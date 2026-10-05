/* HYPER-ESP32 · sims/bluetooth-and-ble.js
 *
 * Simulations of the topic "bluetooth-and-ble" (ids bt-*).
 *
 *   bt-chips        the catalogue's Bluetooth features chip by chip, with filters; params { filter: 'classic' }
 *   bt-roles        broadcaster, observer, peripheral, central: two devices and what happens between them
 *   bt-payload      the 31 bytes of an advertising packet, field by field; params { format: 'ibeacon' }
 *   bt-advertising  advertising on channels 37, 38, 39 against a scanner: discovery time and current
 *   bt-gatt         a GATT tree to explore: handles, UUIDs, properties, reading and subscribing; params { profile: 'hid' }
 *   bt-notify       polling against notifications: packets, delay and lost changes
 *   bt-connection   connection interval, latency, timeout, MTU: throughput, delay and idle current; params { mtu: 23 }
 *   bt-pairing      pairing as a message sequence: Just Works, passkey, numeric comparison, bonding
 *   bt-phy          1M, 2M and coded PHYs: range and airtime
 *   bt-mesh         flooding a message through a mesh: range, TTL, relays, loss
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hex2 = v => ('0' + (v & 255).toString(16)).slice(-2).toUpperCase();
  const hexs = bytes => bytes.map(hex2).join(' ');
  const trunc = (s, n) => (s.length > n ? s.slice(0, Math.max(1, n - 1)) + '…' : s);
  const ascii = s => Array.from(s).map(ch => ch.charCodeAt(0) & 255);
  function rng(seed) { let s = (seed >>> 0) || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
  const fmtMs = ms => (ms >= 1000 ? (ms / 1000).toFixed(ms >= 10000 ? 0 : 1) + ' s' : (ms >= 100 ? Math.round(ms) : Math.round(ms * 10) / 10) + ' ms');
  // break a sentence into lines of at most n characters
  function wrap(text, n) {
    const out = []; let line = '';
    for (const w of String(text).split(' ')) {
      if ((line + ' ' + w).trim().length > n && line) { out.push(line); line = w; } else line = (line + ' ' + w).trim();
    }
    if (line) out.push(line);
    return out;
  }
  const UUID_BASE = (u16) => ('0000' + u16.toString(16).toUpperCase()).slice(-4);

  /* ================================================================ bt-chips */
  Hyper.sim('bt-chips', {
    title: 'Which chip has which Bluetooth',
    blurb: `Every row is a chip of the family and every column a Bluetooth feature, read from the same catalogue as [the chip explorer](#/tools/chips). A filled dot means the catalogue lists the feature; a dash means it does not. Rows that do not match the filter fade.

**Try this**
- Filter **With Classic Bluetooth**: only the ESP32 and the ESP32-S31 stay bright (the ESP32-E22 co-processor too).
- Filter **With the Bluetooth 5 range features**: the original ESP32 drops out, because it stops at LE 4.2.
- Filter **With LE Audio** and see how few chips list it, and read their status in the box.
- Click a row to read what the catalogue says about that chip.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 450, maxH: 600 });
      const feat = (c, re) => !!(c.bt && c.bt.feat && c.bt.feat.some(f => re.test(f)));
      const COLS = [
        { long: 'Classic', short: 'Classic', test: c => !!(c.bt && c.bt.classic) },
        { long: 'LE version', short: 'LE', text: c => (c.bt ? (c.bt.le || 'n/a') : '') },
        { long: '2M PHY', short: '2M', test: c => feat(c, /2M PHY/i) },
        { long: 'Coded PHY', short: 'Coded', test: c => feat(c, /coded PHY/i) },
        { long: 'Ext. adv.', short: 'Ext', test: c => feat(c, /extended advertising/i) },
        { long: 'Mesh', short: 'Mesh', test: c => feat(c, /mesh/i) },
        { long: 'LE Audio', short: 'Audio', test: c => feat(c, /LE Audio/i) },
        { long: 'Dir. finding', short: 'DF', test: c => feat(c, /direction finding/i) }
      ];
      const FILTERS = {
        all: () => true,
        classic: c => !!(c.bt && c.bt.classic),
        bt: c => !!c.bt,
        v5: c => feat(c, /2M PHY/i) && feat(c, /coded PHY/i) && feat(c, /extended advertising/i),
        audio: c => feat(c, /LE Audio/i),
        mesh: c => feat(c, /mesh/i)
      };
      const chips = E.CHIPS.slice();
      let sel = (E.chip('esp32-c3') ? 'esp32-c3' : chips[0].id);
      const ctl = kit.controls(box.side, [
        { id: 'filter', type: 'select', label: 'Show', options: [['All chips', 'all'], ['With Classic Bluetooth', 'classic'], ['With any Bluetooth', 'bt'], ['With the Bluetooth 5 range features', 'v5'], ['With LE Audio', 'audio'], ['With Bluetooth Mesh', 'mesh']], value: FILTERS[params.filter] ? params.filter : 'all' },
        { id: 'chip', type: 'select', label: 'Look at', options: chips.map(c => [c.name, c.id]), value: sel }
      ], (id, v) => { if (id === 'chip') sel = v; loop.once(); });
      const ro = kit.readout(box.side, [['chip', 'The chip'], ['bt', 'Bluetooth'], ['feat', 'Features listed'], ['count', 'Matching the filter']]);
      let geo = { y0: 34, rowH: 22 };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 10;
        const match = FILTERS[ctl.values.filter] || FILTERS.all;
        const nameW = clamp(W * 0.27, 92, 170), cw = (W - 2 * M - nameW) / COLS.length, wide = cw >= 62;
        const y0 = 34, rowH = clamp((st.H - y0 - 50) / chips.length, 18, 30);
        geo = { y0, rowH };
        kit.label(c, 'Chip', M + 4, 16, { size: 11, color: C.muted, weight: 650 });
        COLS.forEach((col, j) => kit.label(c, wide ? col.long : col.short, M + nameW + (j + 0.5) * cw, 16, { size: 10.5, color: C.muted, weight: 650, align: 'center' }));
        let n = 0;
        chips.forEach((chip, i) => {
          const ry = y0 + i * rowH, cy = ry + rowH / 2, on = match(chip);
          if (on) n++;
          c.save();
          c.globalAlpha = on ? 1 : 0.32;
          if (chip.id === sel) { c.fillStyle = C.accent; c.globalAlpha = on ? 0.14 : 0.07; c.fillRect(M, ry, W - 2 * M, rowH); c.globalAlpha = on ? 1 : 0.32; }
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(M, ry + rowH - 0.5); c.lineTo(W - M, ry + rowH - 0.5); c.stroke();
          kit.label(c, trunc(chip.name, Math.floor(nameW / 6.6)), M + 4, cy, { size: 11.5, weight: chip.id === sel ? 700 : 500, color: C.text });
          COLS.forEach((col, j) => {
            const cx = M + nameW + (j + 0.5) * cw;
            if (col.text) kit.label(c, col.text(chip) || '—', cx, cy, { size: 11, align: 'center', color: col.text(chip) ? C.text : C.faint });
            else if (col.test(chip)) kit.dot(c, cx, cy, Math.min(6, rowH * 0.28), C.ok);
            else { c.strokeStyle = C.faint; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx - 4, cy); c.lineTo(cx + 4, cy); c.stroke(); }
          });
          c.restore();
        });
        const ly = y0 + chips.length * rowH + 16;
        kit.dot(c, M + 8, ly, 5, C.ok); kit.label(c, 'the catalogue lists it', M + 18, ly, { size: 10.5, color: C.text2 });
        kit.label(c, '—  not listed', M + Math.min(170, W * 0.42), ly, { size: 10.5, color: C.text2 });
        kit.label(c, 'n/a: no version in the catalogue · faded: not in the filter', M + 4, ly + 17, { size: 10, color: C.faint });
        // the numbers
        const ch = E.chip(sel);
        if (ch) {
          const bt = ch.bt;
          ro.set('chip', ch.name + ' · ' + (ch.status || 'status not listed'));
          ro.set('bt', bt ? (bt.classic ? 'Classic + Low Energy ' : 'Low Energy only ') + (bt.le || '(version not published)') : 'none');
          ro.set('feat', bt && bt.feat && bt.feat.length ? bt.feat.join(' · ') : (bt ? 'nothing beyond the basics' : '—'));
        }
        ro.set('count', n + ' of ' + chips.length + ' chips');
      }, box.stage);
      kit.click(st, p => {
        const i = Math.floor((p.y - geo.y0) / geo.rowH);
        if (i >= 0 && i < chips.length) { sel = chips[i].id; ctl.set('chip', sel, false); loop.once(); }
      }, p => p.y > geo.y0 && p.y < geo.y0 + chips.length * geo.rowH);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ bt-roles */
  const ROLES = {
    broadcaster: { name: 'Broadcaster', says: 'sends advertising only and cannot be connected to', tx: true, rx: false, state: 'advertising' },
    observer: { name: 'Observer', says: 'only listens to advertising and never connects', tx: false, rx: true, state: 'scanning' },
    peripheral: { name: 'Peripheral', says: 'advertises as connectable and waits to be connected', tx: true, rx: false, state: 'advertising' },
    central: { name: 'Central', says: 'scans, chooses a device and starts the connection', tx: false, rx: true, state: 'scanning' }
  };
  function rolesOutcome(a, b) {
    const A = ROLES[a], B = ROLES[b];
    const link = (a === 'peripheral' && b === 'central') || (a === 'central' && b === 'peripheral');
    const aHears = A.rx && B.tx, bHears = B.rx && A.tx;
    if (link) return { kind: 'ok', link: true, title: 'Connected', text: 'The central heard the peripheral\'s advertising and started the connection. The peripheral is usually the GATT server and the central the client, though the two pairs of roles are independent.', who: 'The central', data: 'Read, write and notify, in both directions' };
    if (aHears || bHears) {
      const listener = aHears ? a : b, talker = aHears ? b : a;
      if (listener === 'observer') return { kind: 'warn', hear: aHears ? 'a' : 'b', title: 'Heard, never connected', text: 'An observer only listens. It hears the advertising and can read its data, and it never connects.', who: 'Nobody: an observer does not connect', data: 'Only what the advertisement carries' };
      return { kind: 'warn', hear: aHears ? 'a' : 'b', title: 'Heard, but not connectable', text: 'The central would connect, but a ' + talker + ' advertises as not connectable. It can only be heard.', who: 'Nobody: the ' + talker + ' accepts no connection', data: 'Only what the advertisement carries' };
    }
    if (A.tx || B.tx) return { kind: 'bad', title: 'Nobody is listening', text: 'The advertising goes out, but neither device is scanning, so no one hears it. One side must be an observer or a central.', who: 'Nobody', data: 'None' };
    return { kind: 'bad', title: 'Silence', text: 'Both devices only listen and nobody advertises. One side must be a broadcaster or a peripheral.', who: 'Nobody', data: 'None' };
  }
  Hyper.sim('bt-roles', {
    title: 'Roles on the radio',
    blurb: `Give each device a role and see what can happen. The rings are advertising; a dashed circle is a device that is scanning. Two devices connect only when one is a **peripheral** and the other a **central**.

**Try this**
- Peripheral and central: the everyday case. The central starts the connection, and data can flow.
- Change the ESP to **broadcaster**: the phone still hears it, but cannot connect.
- Make the phone an **observer**: it hears the peripheral and never connects.
- Try two **peripherals**, or two **centrals**: nothing happens. Both talk, or both listen, and nobody does the other half.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 360, maxH: 470 });
      const opts = Object.keys(ROLES).map(k => [ROLES[k].name, k]);
      const ctl = kit.controls(box.side, [
        { id: 'a', type: 'select', label: 'The ESP (left) is a…', options: opts, value: 'peripheral' },
        { id: 'b', type: 'select', label: 'The phone (right) is a…', options: opts, value: 'central' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['a', 'The ESP'], ['b', 'The phone'], ['res', 'What happens'], ['who', 'Who starts a connection'], ['data', 'Data that can flow']]);
      let ph = 0;
      const loop = kit.loop(dt => {
        ph = (ph + dt * 0.55) % 1;
        const c = st.begin(), C = kit.colors(), W = st.W, a = ctl.values.a, b = ctl.values.b, A = ROLES[a], B = ROLES[b], out = rolesOutcome(a, b);
        const ax = W * 0.2, bx = W * 0.8, ny = 92, R = Math.min(W * 0.32, 150);
        // advertising rings, and the scanning circles
        if (A.tx) S.radio(c, ax, ny, { r: R, n: 3, phase: ph, color: C.accent });
        if (B.tx) S.radio(c, bx, ny, { r: R, n: 3, phase: ph, color: C.accent });
        const scanRing = (x, on) => { if (!on) return; c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.setLineDash([4, 4]); c.globalAlpha = 0.5 + 0.4 * Math.sin(ph * 6.283); c.beginPath(); c.arc(x, ny, 40, 0, 6.283); c.stroke(); c.restore(); };
        scanRing(ax, A.rx); scanRing(bx, B.rx);
        // the link
        if (out.link) {
          S.link(c, ax + 30, ny, bx - 30, ny, { color: C.ok, width: 2.4, arrow: 'both', label: 'connection' });
          S.msg(c, ax + 30, ny, bx - 30, ny, ph, { color: C.accent, r: 4, label: 'write' });
          S.msg(c, bx - 30, ny + 10, ax + 30, ny + 10, (ph + 0.5) % 1, { color: C.ok, r: 4, label: 'notify' });
          const peri = a === 'peripheral' ? ax : bx, cent = a === 'peripheral' ? bx : ax;
          kit.label(c, 'GATT server (usually)', peri, ny - 62, { size: 10.5, color: C.text2, align: 'center' });
          kit.label(c, 'GATT client (usually)', cent, ny - 62, { size: 10.5, color: C.text2, align: 'center' });
        } else {
          if ((out.hear === 'a' || out.hear === 'b')) {
            const hx = out.hear === 'a' ? ax : bx;
            kit.label(c, 'hears the advertising', hx, ny - 62, { size: 10.5, color: C.warn, align: 'center', weight: 650 });
          }
        }
        S.node(c, ax, ny, { kind: 'esp', label: 'ESP', r: 22, active: out.link });
        S.node(c, bx, ny, { kind: 'phone', label: 'phone', r: 22, active: out.link, color: 212 });
        // the roles
        const bw = Math.min(130, W * 0.34), by = ny + 58;
        S.box(c, ax - bw / 2, by, bw, 40, { label: A.name, sub: A.state, color: C.accent, active: true });
        S.box(c, bx - bw / 2, by, bw, 40, { label: B.name, sub: B.state, color: C.accent, active: true });
        // the verdict
        const vy = by + 74, col = out.kind === 'ok' ? C.ok : out.kind === 'warn' ? C.warn : C.bad;
        S.box(c, W / 2 - Math.min(150, W * 0.4), vy, Math.min(300, W * 0.8), 32, { label: out.title, color: col, active: true, textColor: col, size: 13.5 });
        wrap(out.text, Math.max(30, Math.floor((W - 24) / 6.2))).slice(0, 5).forEach((ln, i) => kit.label(c, ln, W / 2, vy + 52 + i * 15, { size: 10.8, color: C.text2, align: 'center' }));
        ro.set('a', A.name + ': ' + A.says);
        ro.set('b', B.name + ': ' + B.says);
        ro.set('res', out.title);
        ro.set('who', out.who);
        ro.set('data', out.data);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ bt-payload */
  // one advertising structure: len type data; hue tints its bytes
  function ad(type, name, data, hue, note) { return { type, name, data, hue, note: note || '' }; }
  const NUS_LE = [0x9E, 0xCA, 0xDC, 0x24, 0x0E, 0xE5, 0xA9, 0xE0, 0x93, 0xF3, 0xA3, 0xB5, 0x01, 0x00, 0x40, 0x6E];   // 6E400001-B5A3-F393-E0A9-E50E24DCCA9E, little-endian
  const IBEACON_UUID = [0x4F, 0xD0, 0xD7, 0xA1, 0x3C, 0x6E, 0x4F, 0x1E, 0x9A, 0x52, 0x1B, 0x7E, 0x6C, 0x3D, 0x8A, 0x90];
  const NAME_BASE = 'ESP32-SENSOR-ROOM-1234567890';
  const FORMATS = {
    name: { label: 'Flags and a name', info: 'The simplest advertisement: it makes the device show up in a scan list under its name.', nameOk: true,
      build: n => ({ pkts: [[ad(0x01, 'Flags', [0x06], 212, 'discoverable, no Classic'), ad(0x09, 'Complete local name', ascii(NAME_BASE.slice(0, n)), 36, '"' + NAME_BASE.slice(0, n) + '"')]] }) },
    uuid16: { label: 'Flags, a 16-bit service and a name', info: 'A standard service (Environmental Sensing, 0x181A) announces what the device offers; the 16-bit UUID costs only 4 bytes.', nameOk: true,
      build: n => ({ pkts: [[ad(0x01, 'Flags', [0x06], 212, 'discoverable, no Classic'), ad(0x03, '16-bit service UUIDs', [0x1A, 0x18], 140, '0x181A, little-endian'), ad(0x09, 'Complete local name', ascii(NAME_BASE.slice(0, n)), 36, '"' + NAME_BASE.slice(0, n) + '"')]] }) },
    uuid128: { label: 'Flags, a 128-bit service and a name', info: 'A private service needs a 128-bit UUID: 18 bytes of the 31. A long name no longer fits, and the scan response is the way out.', nameOk: true,
      build: n => ({ pkts: [[ad(0x01, 'Flags', [0x06], 212, 'discoverable, no Classic'), ad(0x07, '128-bit service UUIDs', NUS_LE, 140, 'a custom UUID, little-endian'), ad(0x09, 'Complete local name', ascii(NAME_BASE.slice(0, n)), 36, '"' + NAME_BASE.slice(0, n) + '"')]] }) },
    ibeacon: { label: 'iBeacon', info: 'Apple\'s beacon layout: company 4C 00, type 02, length 15, a 16-byte UUID, major 1, minor 42 and the measured power -59 dBm (C5). It fills 30 of the 31 bytes.', nameOk: false,
      build: () => ({ pkts: [[ad(0x01, 'Flags', [0x06], 212, 'discoverable, no Classic'),
        ad(0xFF, 'Manufacturer data', [0x4C, 0x00, 0x02, 0x15].concat(IBEACON_UUID, [0x00, 0x01, 0x00, 0x2A, 0xC5]), 8, 'iBeacon: UUID, major 1, minor 42, -59 dBm')]] }) },
    eddystone: { label: 'Eddystone-URL', info: 'Google\'s Eddystone-URL frame: the service UUID 0xFEAA, a frame type 0x10, the power at 0 m, a scheme code (03 is https://), the letters and a code for ".com". Little used today.', nameOk: false,
      build: () => ({ pkts: [[ad(0x01, 'Flags', [0x06], 212, 'discoverable, no Classic'), ad(0x03, '16-bit service UUIDs', [0xAA, 0xFE], 140, '0xFEAA (Eddystone)'),
        ad(0x16, 'Service data', [0xAA, 0xFE, 0x10, 0xEC, 0x03].concat(ascii('example'), [0x07]), 280, 'URL frame: https://example.com')]] }) },
    custom: { label: 'Your own sensor data', info: 'A sensor can put its reading straight into manufacturer data: a company ID (0xFFFF is set aside for tests) and your own bytes, here temperature 22.31 °C (B7 08), humidity 46 % and battery 87 %.', nameOk: true,
      build: n => ({ pkts: [[ad(0x01, 'Flags', [0x06], 212, 'discoverable, no Classic'),
        ad(0xFF, 'Manufacturer data', [0xFF, 0xFF, 0xB7, 0x08, 0x2E, 0x57], 8, 'company FFFF, 22.31 °C, 46 %, 87 %'),
        ad(0x09, 'Complete local name', ascii(NAME_BASE.slice(0, n)), 36, '"' + NAME_BASE.slice(0, n) + '"')]] }) }
  };
  Hyper.sim('bt-payload', {
    title: 'The 31 bytes of an advertisement',
    blurb: `Each box is one byte of an advertising packet, in hex. A structure is **length, type, data**: the darker boxes are its length and type, the lighter ones its data. A legacy packet holds at most 31 bytes; bytes past the limit turn red.

**Try this**
- Choose **Flags, a 128-bit service and a name** and lengthen the name: it stops fitting at 10 letters.
- Tick **Move the name to the scan response**: the name gets a packet of its own and the first packet has room again.
- Look at **iBeacon**: 30 bytes of 31, and no space for a name.
- Count the data of **Your own sensor data**: a reading in 6 bytes, with no connection at all.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 420, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'format', type: 'select', label: 'What the packet carries', options: Object.keys(FORMATS).map(k => [FORMATS[k].label, k]), value: FORMATS[params.format] ? params.format : 'uuid128' },
        { id: 'n', label: 'Length of the name', min: 1, max: 28, step: 1, value: 9, unit: 'letters' },
        { id: 'resp', type: 'check', label: 'Move the name to the scan response', value: false }
      ], () => { sync(); loop.once(); });
      const ro = kit.readout(box.side, [['what', 'This packet'], ['used', 'Bytes used'], ['fits', 'Does it fit?']]);
      function sync() { ctl.show('n', FORMATS[ctl.values.format].nameOk); ctl.show('resp', FORMATS[ctl.values.format].nameOk); }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 10;
        const f = FORMATS[ctl.values.format], built = f.build(ctl.values.n);
        let packets = built.pkts.map(p => p.slice());
        if (f.nameOk && ctl.values.resp) {
          const first = packets[0], idx = first.findIndex(s => s.type === 0x09);
          if (idx >= 0) { const nm = first.splice(idx, 1)[0]; packets.push([nm]); }
        }
        const cw = (W - 2 * M) / 16, ch = 24;
        let y = 12, firstUsed = 0, worst = 0;
        packets.forEach((pkt, pi) => {
          const bytes = [];
          pkt.forEach((s, si) => {
            bytes.push({ v: s.data.length + 1, hue: s.hue, strong: true, si });
            bytes.push({ v: s.type, hue: s.hue, strong: true, si });
            s.data.forEach(v => bytes.push({ v, hue: s.hue, strong: false, si }));
          });
          const used = bytes.length, over = Math.max(0, used - 31);
          if (pi === 0) firstUsed = used;
          worst = Math.max(worst, over);
          kit.label(c, pi === 0 ? 'Advertising packet' : 'Scan response (sent when a scanner asks)', M, y + 6, { size: 11.5, weight: 650, color: C.text });
          kit.label(c, used + ' / 31 bytes', W - M, y + 6, { size: 11, color: over ? C.bad : C.muted, weight: over ? 700 : 500, align: 'right' });
          y += 20;
          const total = Math.max(31, used), rows = Math.ceil(total / 16);
          for (let i = 0; i < total; i++) {
            const bx = M + (i % 16) * cw, by = y + Math.floor(i / 16) * (ch + 3), b = bytes[i];
            if (b) {
              c.fillStyle = kit.hue(b.hue, b.strong ? 0.62 : 0.26); c.fillRect(bx + 1, by, cw - 2, ch);
              c.strokeStyle = i >= 31 ? C.bad : kit.hue(b.hue, 0.9); c.lineWidth = i >= 31 ? 2 : 1; c.strokeRect(bx + 1.5, by + 0.5, cw - 3, ch - 1);
              S_text(c, hex2(b.v), bx + cw / 2, by + ch / 2 + 0.5, { size: Math.min(11.5, cw * 0.46), color: i >= 31 ? C.bad : C.text, mono: true, weight: b.strong ? 700 : 500 });
            } else {
              c.strokeStyle = C.grid; c.lineWidth = 1; c.setLineDash([2, 3]); c.strokeRect(bx + 1.5, by + 0.5, cw - 3, ch - 1); c.setLineDash([]);
            }
          }
          y += rows * (ch + 3) + 6;
          pkt.forEach(s => {
            c.fillStyle = kit.hue(s.hue, 0.7); c.fillRect(M, y + 2, 9, 9);
            kit.label(c, trunc(hex2(s.data.length + 1) + ' ' + hex2(s.type) + ' · ' + s.name + (s.note ? ' · ' + s.note : ''), Math.floor((W - M - 21) / 5.9)), M + 15, y + 7, { size: 10.5, color: C.text2 });
            y += 16;
          });
          y += 12;
        });
        kit.label(c, 'dark: length and type · light: data · dashed: free', M, Math.min(st.H - 12, y + 2), { size: 10, color: C.faint });
        ro.set('what', f.label);
        ro.set('used', packets.map(p => p.reduce((a, s) => a + s.data.length + 2, 0)).join(' + ') + ' of 31' + (packets.length > 1 ? ' (scan response second)' : ''));
        ro.set('fits', worst ? 'No: ' + worst + ' bytes too many. Shorten the name, drop a UUID or use the scan response.' : (31 - firstUsed) + ' bytes free in the advertisement');
      }, box.stage);
      function S_text(c, str, x, y, o) { kit.esym.text(c, str, x, y, Object.assign({ align: 'center' }, o)); }
      sync();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ bt-advertising */
  // the median and the 9-in-10 time until a scanner first hears an advertiser, from many random starts. Seconds.
  function discovery(T, Si, Sw) {
    const r = rng(12345), res = [];
    for (let k = 0; k < 160; k++) {
      const phi = r() * T, psi = r() * 3 * Si;
      let found = 60, te = phi;
      for (; te < 60 && found >= 60; te += T + r() * 0.010) {
        for (let ch = 0; ch < 3; ch++) {
          const tx = te + ch * 0.0004, s = tx + psi, i = Math.floor(s / Si);
          if (i % 3 === ch && s - i * Si < Sw) { found = tx; break; }
        }
      }
      res.push(found);
    }
    res.sort((a, b) => a - b);
    return { med: res[80], p90: res[144] };
  }
  const days = d => (d >= 730 ? (d / 365).toFixed(1) + ' years' : d >= 3 ? Math.round(d) + ' days' : (d * 24).toFixed(0) + ' hours');
  Hyper.sim('bt-advertising', {
    title: 'Advertising against a scanner',
    blurb: `The three rows are the advertising channels 37, 38 and 39. Grey bars are the advertiser's packets (one on each channel per event); the amber boxes are moments when a scanner is **listening on that channel**; a packet that lands inside a box of its own channel is **heard** (green). The scanner moves to the next channel at every scan interval. Time runs faster than real time so that you can watch several events.

**Try this**
- Lengthen the **advertising interval** to 1 s: the current falls tenfold and the median discovery time grows.
- Shorten the **scan window** to 5 %: the scanner mostly sleeps and misses packets, and a short interval does not help much.
- Raise the **radio on per event**: the current rises, the discovery time does not move.
- Pick a Bluetooth-only chip such as the ESP32-H2 and compare its current with the ESP32-S3.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 380, maxH: 520 });
      const chips = E.CHIPS.filter(c => c.bt && c.rxMa != null && c.lightUa != null);
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip (current figures from the catalogue)', options: chips.map(c => [c.name, c.id]), value: 'esp32-c3' },
        { id: 'T', label: 'Advertising interval', min: 20, max: 10240, value: 100, unit: 'ms', log: true, sig: 3 },
        { id: 'ev', label: 'Radio on per event', min: 1, max: 10, step: 0.5, value: 4, unit: 'ms' },
        { id: 'Si', label: 'Scan interval', min: 20, max: 2000, value: 100, unit: 'ms', log: true, sig: 2 },
        { id: 'duty', label: 'Scan window', min: 5, max: 100, step: 5, value: 50, unit: '% of the interval' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['cur', 'Average current'], ['life', 'Battery life'], ['rate', 'Advertising events'], ['disc', 'Typical time to be found'], ['p90', 'Slow case (9 in 10)']]);
      let tau = 0, memoKey = '', memoVal = null;
      const jit = k => ((Math.imul(k + 7, 2654435761) >>> 0) / 4294967296) * 0.010;
      const loop = kit.loop(dt => {
        const v = ctl.values, chip = E.chip(v.chip) || chips[0], T = v.T / 1000, Si = v.Si / 1000, Sw = Si * v.duty / 100;
        const SPAN = clamp(Math.max(T * 6, Si * 6), 0.6, 30);
        tau += dt * SPAN / 6;
        const c = st.begin(), C = kit.colors(), W = st.W;
        const x0 = 72, x1 = W - 12, y0 = 58, rowH = 40, t1 = tau, t0 = tau - SPAN, X = t => x0 + (t - t0) / SPAN * (x1 - x0);
        kit.label(c, 'advertiser: channels 37, 38, 39 every ' + fmtMs(v.T), 10, 12, { size: 11, color: C.text2 });
        kit.label(c, 'scanner: listens ' + fmtMs(Sw * 1000) + ' of every ' + fmtMs(v.Si) + ', one channel at a time', 10, 29, { size: 11, color: C.text2 });
        const chans = [37, 38, 39], phi0 = 0.137 * T, psi0 = 0.31 * Si;
        let heard = 0;
        chans.forEach((ch, row) => {
          const y = y0 + row * rowH;
          c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; c.fillRect(x0, y, x1 - x0, rowH - 6);
          kit.label(c, 'channel ' + ch, 8, y + (rowH - 6) / 2, { size: 11, color: C.text2, weight: 650 });
          // the scanner's windows on this channel
          for (let i = Math.floor((t0 - psi0) / Si) - 1; i * Si + psi0 < t1 + Si; i++) {
            if (((i % 3) + 3) % 3 !== row) continue;
            const a = i * Si + psi0, b = a + Sw;
            if (b < t0 || a > t1) continue;
            c.fillStyle = C.warn; c.globalAlpha = 0.24; c.fillRect(clamp(X(a), x0, x1), y, Math.max(1.5, clamp(X(b), x0, x1) - clamp(X(a), x0, x1)), rowH - 6); c.globalAlpha = 1;
          }
        });
        // the advertiser's packets
        for (let k = Math.floor((t0 - phi0) / T) - 1; phi0 + k * T < t1 + 0.02; k++) {
          const te = phi0 + k * T + jit(k);
          chans.forEach((ch, row) => {
            const tx = te + row * 0.0004;
            if (tx < t0 || tx > t1) return;
            const w = ((Math.floor((tx - psi0) / Si) % 3) + 3) % 3 === row && ((tx - psi0) - Math.floor((tx - psi0) / Si) * Si) < Sw;
            if (w) heard++;
            const y = y0 + row * rowH;
            c.fillStyle = w ? C.ok : C.text2; c.fillRect(X(tx) - 1.5, y + 2, 3, rowH - 10);
            if (w) kit.dot(c, X(tx), y + rowH - 8, 3.5, C.ok);
          });
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y0 + 3 * rowH - 2.5); c.lineTo(x1, y0 + 3 * rowH - 2.5); c.stroke();
        kit.label(c, fmtMs(SPAN * 1000) + ' ago', x0, y0 + 3 * rowH + 8, { size: 10, color: C.faint });
        kit.label(c, 'now', x1, y0 + 3 * rowH + 8, { size: 10, color: C.faint, align: 'right' });
        kit.label(c, 'grey: a packet · amber: the scanner listens here', 10, y0 + 3 * rowH + 28, { size: 10.5, color: C.text2 });
        kit.label(c, 'green: heard (' + heard + ' in view)', 10, y0 + 3 * rowH + 45, { size: 10.5, color: C.text2 });
        // the numbers
        const I = E.bleAdvCurrent(T, { ms: v.ev, mA: chip.rxMa, sleepUa: chip.lightUa });
        const cr = E.batteryLife(225, I, { cell: 'cr2032' }), li = E.batteryLife(1000, I, { cell: 'lipo-1000' });
        const key = T + '|' + Si + '|' + Sw;
        if (key !== memoKey) { memoKey = key; memoVal = discovery(T, Si, Sw); }
        const d = memoVal;
        ro.set('cur', (I >= 1 ? kit.fmt(I, 3) + ' mA' : kit.fmt(I * 1000, 3) + ' µA') + '  (' + v.ev + ' ms at ' + chip.rxMa + ' mA, then ' + chip.lightUa + ' µA)');
        ro.set('life', days(li.days) + ' on 1000 mAh Li-ion · ' + days(cr.days) + ' on a CR2032, which cannot give such peaks well');
        ro.set('rate', kit.fmt(1 / (T + 0.005), 3) + ' a second');
        ro.set('disc', d.med >= 60 ? 'over a minute' : fmtMs(d.med * 1000));
        ro.set('p90', d.p90 >= 60 ? 'over a minute' : fmtMs(d.p90 * 1000));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ bt-gatt */
  const TXT = b => '"' + b.map(x => String.fromCharCode(x)).join('') + '"';
  const APPEAR = { 0x0000: 'Unknown', 0x03C1: 'Keyboard' };
  const GA = (name, appearance) => ({ u: 0x1800, n: 'Generic Access', chars: [
    { u: 0x2A00, n: 'Device Name', p: ['read'], b: ascii(name), dec: TXT },
    { u: 0x2A01, n: 'Appearance', p: ['read'], b: [appearance & 255, appearance >> 8], dec: b => APPEAR[b[0] | (b[1] << 8)] || 'a generic device' }] });
  const DIS = { u: 0x180A, n: 'Device Information', chars: [
    { u: 0x2A29, n: 'Manufacturer Name String', p: ['read'], b: ascii('Hobby'), dec: TXT },
    { u: 0x2A24, n: 'Model Number String', p: ['read'], b: ascii('ESP32-DEMO'), dec: TXT }] };
  const wob = (k, a) => Math.round(a * Math.sin(k * 0.9));
  const REPORT_MAP = [0x05, 0x01, 0x09, 0x06, 0xA1, 0x01, 0x05, 0x07, 0x19, 0xE0, 0x29, 0xE7, 0x15, 0x00, 0x25, 0x01, 0x75, 0x01, 0x95, 0x08, 0x81, 0x02, 0x95, 0x01, 0x75, 0x08, 0x81, 0x01, 0x95, 0x06, 0x75, 0x08, 0x15, 0x00, 0x25, 0x65, 0x05, 0x07, 0x19, 0x00, 0x29, 0x65, 0x81, 0x00, 0xC0];
  const HELLO = 'Hello';
  const reportAt = k => {
    const ch = HELLO[Math.floor(k / 2) % HELLO.length];
    if (k % 2) return [0, 0, 0, 0, 0, 0, 0, 0];
    return [ch === ch.toUpperCase() ? 0x02 : 0, 0, ch.toLowerCase().charCodeAt(0) - 97 + 4, 0, 0, 0, 0, 0];
  };
  const PROFILES = {
    battery: { name: 'A battery sensor', services: [GA('battery-demo', 0),
      { u: 0x180F, n: 'Battery Service', chars: [{ u: 0x2A19, n: 'Battery Level', p: ['read', 'notify'], b: [87], dec: b => b[0] + ' %', next: (b, k) => [Math.max(1, 87 - k)] }] }, DIS] },
    env: { name: 'An environment sensor', services: [GA('env-sensor', 0),
      { u: 0x181A, n: 'Environmental Sensing', chars: [
        { u: 0x2A6E, n: 'Temperature', p: ['read', 'notify'], b: [0xB7, 0x08], dec: b => { const q = b[0] | (b[1] << 8), s = q > 32767 ? q - 65536 : q; return (s / 100).toFixed(2) + ' °C'; }, next: (b, k) => { const q = 2231 + wob(k, 30); return [q & 255, q >> 8]; } },
        { u: 0x2A6F, n: 'Humidity', p: ['read', 'notify'], b: [0xD0, 0x11], dec: b => ((b[0] | (b[1] << 8)) / 100).toFixed(2) + ' %', next: (b, k) => { const q = 4560 + wob(k, 90); return [q & 255, q >> 8]; } },
        { u: 0x2A6D, n: 'Pressure', p: ['read', 'notify'], b: [0x02, 0x76, 0x0F, 0x00], dec: b => (((b[0] | (b[1] << 8) | (b[2] << 16)) + b[3] * 16777216) / 1000).toFixed(2) + ' hPa', next: (b, k) => { const q = 1013250 + wob(k, 50); return [q & 255, (q >> 8) & 255, (q >> 16) & 255, 0]; } }] }] },
    uart: { name: 'A serial port (Nordic UART Service)', services: [GA('uart-demo', 0),
      { u: '6E400001-B5A3-F393-E0A9-E50E24DCCA9E', n: 'Nordic UART Service', chars: [
        { u: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E', n: 'RX (the phone writes here)', p: ['write', 'write without response'], b: [], dec: () => 'a write from the phone arrives here' },
        { u: '6E400003-B5A3-F393-E0A9-E50E24DCCA9E', n: 'TX (notifies the phone)', p: ['notify'], b: ascii('hello 0'), dec: TXT, next: (b, k) => ascii('hello ' + k) }] }] },
    hr: { name: 'A heart-rate strap', services: [GA('hr-strap', 0),
      { u: 0x180D, n: 'Heart Rate', chars: [
        { u: 0x2A37, n: 'Heart Rate Measurement', p: ['notify'], b: [0x00, 72], dec: b => 'flags ' + hex2(b[0]) + ' (8-bit value): ' + b[1] + ' bpm', next: (b, k) => [0x00, 72 + wob(k, 6)] },
        { u: 0x2A38, n: 'Body Sensor Location', p: ['read'], b: [0x01], dec: b => (['Other', 'Chest', 'Wrist'][b[0]] || 'Other') },
        { u: 0x2A39, n: 'Heart Rate Control Point', p: ['write'], b: [], dec: () => 'a write of 01 resets the energy counter' }] }, DIS] },
    hid: { name: 'A BLE keyboard (HID)', services: [GA('macro-pad', 0x03C1),
      { u: 0x1812, n: 'Human Interface Device', chars: [
        { u: 0x2A4A, n: 'HID Information', p: ['read'], b: [0x11, 0x01, 0x00, 0x02], dec: () => 'HID 1.11, no country code, normally connectable' },
        { u: 0x2A4B, n: 'Report Map', p: ['read'], b: REPORT_MAP, dec: b => b.length + ' bytes: a keyboard report of 8 bytes (modifiers, reserved, six keys)' },
        { u: 0x2A4C, n: 'HID Control Point', p: ['write without response'], b: [0], dec: () => 'suspend or exit suspend' },
        { u: 0x2A4D, n: 'Report (input)', p: ['read', 'notify'], b: [0, 0, 0, 0, 0, 0, 0, 0],
          dec: b => (b[2] ? (b[0] & 2 ? 'Shift + ' : '') + 'key code ' + hex2(b[2]) + ' (' + String.fromCharCode(b[2] - 4 + 97) + ')' : 'all keys released'),
          next: (b, k) => reportAt(k), descs: [{ u: 0x2908, n: 'Report Reference', b: [0, 1], dec: () => 'report ID 0, an input report' }] }] },
      { u: 0x180F, n: 'Battery Service', chars: [{ u: 0x2A19, n: 'Battery Level', p: ['read', 'notify'], b: [100], dec: b => b[0] + ' %' }] }] }
  };
  const uuidShort = u => (typeof u === 'number' ? '0x' + UUID_BASE(u) : u.slice(0, 8) + '…');
  const uuidFull = u => (typeof u === 'number' ? '0000' + UUID_BASE(u) + '-0000-1000-8000-00805F9B34FB' : u);
  const h4 = n => '0x' + ('000' + n.toString(16).toUpperCase()).slice(-4);
  function gattRows(profile) {
    const rows = []; let h = 1;
    profile.services.forEach(svc => {
      const sr = { kind: 'svc', svc, u: svc.u, n: svc.n, h: h++, last: 0 };
      rows.push(sr);
      svc.chars.forEach(ch => {
        const decl = h++, val = h++;
        const cr = { kind: 'chr', ch, u: ch.u, n: ch.n, h: val, decl, p: ch.p, b: ch.b.slice(), seen: null, sub: false, flash: 0 };
        rows.push(cr);
        if (ch.p.some(p => p === 'notify' || p === 'indicate')) rows.push({ kind: 'dsc', chr: cr, u: 0x2902, n: 'CCCD (the notification switch)', h: h++, cccd: true });
        (ch.descs || []).forEach(d => rows.push({ kind: 'dsc', chr: cr, u: d.u, n: d.n, h: h++, b: d.b, dec: d.dec }));
      });
      sr.last = h - 1;
    });
    return rows;
  }
  Hyper.sim('bt-gatt', {
    title: 'A GATT tree to explore',
    blurb: `The list is the **attribute table** of a device, as a client sees it after connecting: services (bold), their characteristics, and the descriptors under them. The first column is each attribute's **handle**. Click a row for its details.

**Try this**
- Select a characteristic and press **Read**: the value comes back as bytes, and the decoded meaning is shown. Look at the little-endian order of the temperature.
- Select a characteristic marked *notify* and press **Subscribe**: its CCCD turns to 01 00, and new values arrive by themselves. Unsubscribe and they stop.
- Switch to the **serial port** profile: a custom service with 128-bit UUIDs.
- Switch to the **keyboard** profile to see the HID service, its report map and a report arriving when you subscribe.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 460, maxH: 640 });
      let rows = [], sel = 0, k = 0, acc = 0, log = 'nothing yet';
      const load = key => { rows = gattRows(PROFILES[key]); sel = rows.findIndex(r => r.kind === 'chr'); if (sel < 0) sel = 0; k = 0; acc = 0; log = 'connected: the table was discovered'; };
      const ctl = kit.controls(box.side, [
        { id: 'profile', type: 'select', label: 'The device', options: Object.keys(PROFILES).map(key => [PROFILES[key].name, key]), value: PROFILES[params.profile] ? params.profile : 'battery' },
        { type: 'buttons', items: [{ id: 'read', label: 'Read the selected value', primary: true }, { id: 'sub', label: 'Subscribe / unsubscribe' }] }
      ], id => {
        if (id === 'profile') load(ctl.values.profile);
        else {
          const r = rows[sel], cr = r && (r.kind === 'chr' ? r : r.chr);
          if (id === 'read' && cr && cr.ch.p.includes('read')) { cr.seen = cr.b.slice(); log = 'Read Request ' + h4(cr.h) + ' → Read Response ' + (cr.seen.length ? hexs(cr.seen.slice(0, 8)) + (cr.seen.length > 8 ? ' …' : '') : '(empty)'); }
          else if (id === 'read') log = 'Read Request ' + h4(cr ? cr.h : 0) + ' → Error: read not permitted';
          if (id === 'sub') {
            if (cr && cr.ch.p.some(p => p === 'notify' || p === 'indicate')) { cr.sub = !cr.sub; log = 'Write ' + h4(cr.h + 1) + ' (CCCD) ← ' + (cr.sub ? '01 00: notifications on' : '00 00: off'); if (cr.sub) cr.seen = cr.b.slice(); }
            else log = 'this characteristic has no notify property: nothing to subscribe to';
          }
        }
        loop.once();
      });
      const ro = kit.readout(box.side, [['sel', 'Selected'], ['uuid', 'UUID'], ['props', 'Properties'], ['val', 'Value the client holds'], ['log', 'Last exchange']]);
      load(ctl.values.profile);
      let geo = { y0: 26, rowH: 20 };
      const loop = kit.loop(dt => {
        acc += dt;
        if (acc >= 1) {
          acc -= 1; k++;
          rows.forEach(r => { if (r.kind !== 'chr') return; if (r.ch.next) r.b = r.ch.next(r.b, k); if (r.sub) { r.seen = r.b.slice(); r.flash = 1; log = 'Notification ' + h4(r.h) + ' → ' + hexs(r.seen.slice(0, 8)); } });
        }
        rows.forEach(r => { if (r.flash > 0) r.flash = Math.max(0, r.flash - dt * 1.5); });
        const c = st.begin(), C = kit.colors(), W = st.W, M = 8, detailH = 118, y0 = 26;
        const rowH = clamp((st.H - y0 - detailH - 8) / rows.length, 17, 25);
        geo = { y0, rowH };
        kit.label(c, 'handle', M, 12, { size: 10, color: C.faint }); kit.label(c, 'service · characteristic · descriptor', M + 54, 12, { size: 10, color: C.faint });
        rows.forEach((r, i) => {
          const y = y0 + i * rowH, cy = y + rowH / 2, ind = r.kind === 'svc' ? 0 : r.kind === 'chr' ? 16 : 32;
          if (i === sel) { c.fillStyle = C.accent; c.globalAlpha = 0.15; c.fillRect(M - 2, y, W - 2 * M + 4, rowH); c.globalAlpha = 1; }
          if (r.flash) { c.fillStyle = C.ok; c.globalAlpha = 0.25 * r.flash; c.fillRect(M - 2, y, W - 2 * M + 4, rowH); c.globalAlpha = 1; }
          if (r.kind === 'svc') { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(M, y + 0.5); c.lineTo(W - M, y + 0.5); c.stroke(); }
          kit.label(c, h4(r.h), M, cy, { size: 10, color: C.faint });
          const col = r.kind === 'svc' ? C.text : r.kind === 'chr' ? C.text : C.text2;
          const nm = trunc(r.n, Math.floor((W - 150) / 6.8)), tags = r.kind === 'chr' && W > 470 ? r.p.map(q => q.replace('write without response', 'write-nr')).join(' · ') : '';
          kit.label(c, nm, M + 54 + ind, cy, { size: 11.3, weight: r.kind === 'svc' ? 700 : 500, color: col });
          if (tags) kit.label(c, tags, M + 54 + ind + nm.length * 6.6 + 10, cy, { size: 10, color: C.muted });
          kit.label(c, uuidShort(r.u), W - M, cy, { size: 10, color: C.faint, align: 'right' });
          if (r.kind === 'chr' && r.sub) kit.dot(c, W - M - 84, cy, 3.5, C.ok);
        });
        // the details of the selected attribute
        const r = rows[sel], dy = st.H - detailH + 6, lines = [];
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(M, dy - 6); c.lineTo(W - M, dy - 6); c.stroke();
        let valText = '—', props = '—';
        if (r.kind === 'svc') {
          lines.push(['Service ' + r.n, 650]); lines.push(['Handles ' + h4(r.h) + ' to ' + h4(r.last) + ' (' + (r.last - r.h + 1) + ' attributes)', 500]);
          lines.push([typeof r.u === 'number' ? 'A standard service: a 16-bit UUID assigned by the Bluetooth SIG' : 'A custom service: a random 128-bit UUID', 500]);
          props = 'a service has no properties of its own';
        } else if (r.kind === 'chr') {
          props = r.p.join(', ');
          valText = r.seen ? (r.seen.length ? hexs(r.seen.slice(0, 12)) + (r.seen.length > 12 ? ' …' : '') + '   →   ' + r.ch.dec(r.seen) : '(empty)') : (r.ch.p.includes('read') || r.ch.p.includes('notify') ? 'not read yet: press Read' + (r.ch.p.includes('notify') ? ' or Subscribe' : '') : 'write only: a client cannot read it');
          lines.push(['Characteristic ' + r.n, 650]); lines.push(['Value at handle ' + h4(r.h) + ' (declaration at ' + h4(r.decl) + ')', 500]); lines.push(['Value: ' + valText, 500]);
        } else if (r.cccd) {
          const on = r.chr.sub;
          valText = on ? '01 00 (notifications on)' : '00 00 (off)';
          lines.push(['Descriptor 0x2902: the Client Characteristic Configuration', 650]); lines.push(['Attribute ' + h4(r.h) + ' of ' + r.chr.n, 500]); lines.push(['Value: ' + valText + '. A client writes 01 00 to switch notifications on.', 500]);
          props = 'read, write';
        } else {
          valText = hexs(r.b) + '   →   ' + r.dec(r.b);
          lines.push(['Descriptor ' + r.n, 650]); lines.push(['Attribute ' + h4(r.h) + ' of ' + r.chr.n, 500]); lines.push(['Value: ' + valText, 500]);
          props = 'read';
        }
        lines.push(['UUID ' + uuidFull(r.u), 500]);
        lines.forEach(([t, wgt], i) => kit.label(c, trunc(t, Math.floor((W - 2 * M) / 6.2)), M, dy + 8 + i * 17, { size: 11, weight: wgt, color: i === 0 ? C.text : C.text2 }));
        ro.set('sel', r.n); ro.set('uuid', uuidFull(r.u)); ro.set('props', props); ro.set('val', valText); ro.set('log', log);
      }, box.stage);
      kit.click(st, p => {
        const i = Math.floor((p.y - geo.y0) / geo.rowH);
        if (i >= 0 && i < rows.length) { sel = i; loop.once(); }
      }, p => p.y > geo.y0 && p.y < geo.y0 + rows.length * geo.rowH);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ bt-notify */
  Hyper.sim('bt-notify', {
    title: 'Polling or notifications',
    blurb: `Three lanes over the last 20 seconds (time runs twice as fast as real time). **Sensor:** the moments when its value changes. **Polling:** the phone reads every so often; a green tick is a read that found something new, and a **red cross** on the sensor lane is a change that was overwritten before any read saw it. **Notifications:** the sensor sends each change as it happens, a little late because it must wait for the next connection event.

**Try this**
- With a change every 10 seconds and a poll every second, compare the packets a minute: polling sends about 20 times as many for the same news.
- Poll **every 10 seconds** on a fast-changing sensor: many red crosses, the phone sees only some of the values.
- Raise the **connection interval** to 1 s: both ways get later, but notifications still win.
- Switch to **indications**: every notification gets a confirming packet, so the packet count doubles.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 350, maxH: 480 });
      let events = [];
      function gen() {
        const r = rng(99), lam = ctl.values.rate / 60;
        events = []; let t = 0;
        while (t < 600) { t += -Math.log(1 - r()) / lam; events.push(t); }
      }
      const ctl = kit.controls(box.side, [
        { id: 'rate', label: 'The value changes', min: 1, max: 120, value: 6, unit: 'times a minute', log: true, sig: 2 },
        { id: 'P', label: 'The phone polls every', min: 0.1, max: 10, value: 1, unit: 's', log: true, sig: 2 },
        { id: 'ci', label: 'Connection interval', min: 7.5, max: 1000, value: 50, unit: 'ms', log: true, sig: 2 },
        { id: 'mode', type: 'select', label: 'The sensor sends', options: [['Notifications', 'notify'], ['Indications (confirmed)', 'indicate']], value: 'notify' }
      ], id => { if (id === 'rate') gen(); loop.once(); });
      const ro = kit.readout(box.side, [['poll', 'Polling: packets'], ['notif', 'Notifying: packets'], ['ratio', 'Polling costs'], ['lost', 'Changes polling misses'], ['delay', 'Average delay']]);
      gen();
      let tau = 20;
      const loop = kit.loop(dt => {
        tau += dt * 2; if (tau > 590) tau = 20;
        const v = ctl.values, P = v.P, ci = v.ci / 1000, lam = v.rate / 60, ind = v.mode === 'indicate';
        const c = st.begin(), C = kit.colors(), W = st.W, x0 = 96, x1 = W - 12, SPAN = 20, t1 = tau, t0 = tau - SPAN, X = t => x0 + (t - t0) / SPAN * (x1 - x0);
        const lanes = [['sensor', 'value changes'], ['phone polls', 'a read every ' + fmtMs(P * 1000)], ['notify', ind ? 'indications, confirmed' : 'sent as it changes']];
        const ys = [66, 138, 210], lh = 46;
        lanes.forEach(([a, b], i) => {
          c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; c.fillRect(x0, ys[i] - lh / 2, x1 - x0, lh);
          kit.label(c, a, 8, ys[i] - 7, { size: 11, weight: 650, color: C.text2 }); kit.label(c, trunc(b, 14), 8, ys[i] + 8, { size: 9.5, color: C.faint });
        });
        // events near the window, and which of them a poll can still see
        const near = events.filter(e => e > t0 - 11 && e <= t1);
        const seenPoll = new Set();
        const lostSet = new Set();
        near.forEach((e, i) => { const pk = Math.ceil(e / P - 1e-9), lost = i + 1 < near.length && near[i + 1] <= pk * P + 1e-9; if (lost) lostSet.add(i); else seenPoll.add(pk); });
        // polls
        for (let q = Math.ceil(t0 / P); q * P <= t1; q++) {
          const x = X(q * P), good = seenPoll.has(q);
          c.strokeStyle = good ? C.ok : C.faint; c.lineWidth = good ? 2.4 : 1;
          c.beginPath(); c.moveTo(x, ys[1] + (good ? -16 : -6)); c.lineTo(x, ys[1] + (good ? 16 : 6)); c.stroke();
        }
        // sensor changes, lost ones crossed, and the notifications
        near.forEach((e, i) => {
          if (e < t0) return;
          const x = X(e), pk = Math.ceil(e / P - 1e-9) * P;
          kit.dot(c, x, ys[0], 4.5, lostSet.has(i) ? C.bad : C.accent);
          if (lostSet.has(i)) { c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 6, ys[0] - 6); c.lineTo(x + 6, ys[0] + 6); c.moveTo(x + 6, ys[0] - 6); c.lineTo(x - 6, ys[0] + 6); c.stroke(); }
          const dly = ci * ((Math.imul(Math.round(e * 1000) + 13, 2654435761) >>> 0) / 4294967296), xn = X(Math.min(t1, e + dly));
          if (e + dly <= t1) {
            c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath(); c.moveTo(xn, ys[2] - 15); c.lineTo(xn, ys[2] + 15); c.stroke();
            if (ind) { const xc = X(Math.min(t1, e + dly + ci)); if (e + dly + ci <= t1) { c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(xc, ys[2] - 7); c.lineTo(xc, ys[2] + 7); c.stroke(); } }
          }
          if (pk <= t1 && !lostSet.has(i)) { c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(x, ys[0] + 6); c.lineTo(X(pk), ys[1] - 17); c.stroke(); c.setLineDash([]); }
        });
        kit.label(c, '20 s ago', x0, 250, { size: 10, color: C.faint }); kit.label(c, 'now', x1, 250, { size: 10, color: C.faint, align: 'right' });
        kit.label(c, 'sensor: a change · red cross: overwritten before any read', 10, 268, { size: 10, color: C.text2 });
        kit.label(c, 'polls: grey = a read · green = a read that found news', 10, 284, { size: 10, color: C.text2 });
        kit.label(c, 'notify: thick tick = notification' + (ind ? ' · thin = confirmation' : ''), 10, 300, { size: 10, color: C.text2 });
        // the numbers
        const pollPk = 2 * 60 / P, notifPk = v.rate * (ind ? 2 : 1), seenPm = 60 * (1 - Math.exp(-lam * P)) / P, lostPm = Math.max(0, v.rate - seenPm);
        ro.set('poll', kit.fmt(pollPk, 3) + ' a minute (request and answer)');
        ro.set('notif', kit.fmt(notifPk, 3) + ' a minute' + (ind ? ' (each with its confirmation)' : ''));
        ro.set('ratio', kit.fmt(pollPk / notifPk, 3) + ' times the packets');
        ro.set('lost', kit.fmt(lostPm, 2) + ' of ' + kit.fmt(v.rate, 3) + ' a minute');
        ro.set('delay', 'polling about ' + fmtMs((P / 2 + ci) * 1000) + ' · notifying about ' + fmtMs(ci * 500));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ bt-connection */
  // the numbers of a link. v: the control values, chip: a catalogue chip. Schematic, from the airtime of each packet.
  function connModel(v, chip) {
    const ci = Math.max(7.5, Math.round(v.ci / 1.25) * 1.25);
    const L = v.dle ? 251 : 27, us = v.phy === 2 ? 4 : 8, ov = v.phy === 2 ? 11 : 10;        // LL payload, microseconds per byte, overhead bytes of a packet
    const pktUs = (L + ov) * us + 150 + ov * us + 150;                                          // a full packet, the gap, an empty answer, the gap
    const nAir = Math.max(1, Math.floor((ci * 1000 - 300) / pktUs)), N = Math.min(6, nAir);
    const dataLen = v.mtu - 3, k = Math.ceil((dataLen + 7) / L), perEvent = N * dataLen / k;
    const kbps = 8 * perEvent / ci, T = ci * (1 + v.lat);
    const awake = 2.5, busy = Math.min(ci, 1.5 + N * pktUs / 1000);
    const idle = (chip.rxMa * awake + chip.lightUa / 1000 * Math.max(0, T - awake)) / T;
    const stream = (chip.rxMa * busy + chip.lightUa / 1000 * Math.max(0, ci - busy)) / ci;
    return { ci, L, N, nAir, dataLen, k, perEvent, kbps, T, busy, idle, stream, tsMin: 2 * (1 + v.lat) * ci, pktUs };
  }
  Hyper.sim('bt-connection', {
    title: 'Connection interval, latency and throughput',
    blurb: `The top lane is the phone, which opens a **connection event** every interval. The lower lane is the ESP: a filled block is an event it takes part in, a dashed one an event it **skips** because of its latency. The blocks show how many packets fit in an event. The numbers are worked out from the airtime of each packet on the 1M or 2M PHY and are **schematic**: real controllers and phones add their own limits, and the current uses the catalogue's receive current for the time the radio is on and its light-sleep current for the rest.

**Try this**
- Start with the default MTU of 23 and an interval of 30 ms: about 32 kbit/s. Raise the **MTU** to 247 alone: nothing changes much. Now tick **data length extension**: the packets are big enough to use it.
- Press **Fastest**, then lengthen the interval step by step and watch the throughput, the delay and the current fall.
- Raise the **latency** to 10 with a 100 ms interval: the idle current falls, but a command from the phone may wait a full second.
- Make the **timeout** shorter than the rule allows and read the warning.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 380, maxH: 500 });
      const chips = E.CHIPS.filter(c => c.bt && c.rxMa != null && c.lightUa != null);
      const mtuOpts = [['23 (the default)', 23], ['64', 64], ['185', 185], ['247', 247], ['517', 517]];
      const ctl = kit.controls(box.side, [
        { id: 'ci', label: 'Connection interval', min: 7.5, max: 4000, value: 30, unit: 'ms', log: true, sig: 3 },
        { id: 'lat', label: 'Peripheral latency', min: 0, max: 50, step: 1, value: 0, unit: 'events skipped' },
        { id: 'to', label: 'Supervision timeout', min: 100, max: 6000, value: 2000, unit: 'ms', log: true, sig: 3 },
        { id: 'mtu', type: 'select', label: 'ATT MTU', options: mtuOpts, value: mtuOpts.some(o => o[1] === params.mtu) ? params.mtu : 23 },
        { id: 'dle', type: 'check', label: 'Data length extension (251-byte packets)', value: false },
        { id: 'phy', type: 'select', label: 'PHY', options: [['1M', 1], ['2M', 2]], value: 1 },
        { id: 'chip', type: 'select', label: 'Chip (for the current)', options: chips.map(c => [c.name, c.id]), value: 'esp32-c3' },
        { type: 'buttons', items: [{ id: 'friendly', label: 'Phone friendly' }, { id: 'sensor', label: 'Slow sensor' }, { id: 'fast', label: 'Fastest', primary: true }] }
      ], id => {
        const set = o => Object.keys(o).forEach(key => ctl.set(key, o[key], false));
        if (id === 'friendly') set({ ci: 30, lat: 0, to: 2000, mtu: 23, dle: false, phy: 1 });
        else if (id === 'sensor') set({ ci: 500, lat: 4, to: 6000, mtu: 23, dle: false, phy: 1 });
        else if (id === 'fast') set({ ci: 7.5, lat: 0, to: 1000, mtu: 247, dle: true, phy: 2 });
        loop.once();
      });
      const ro = kit.readout(box.side, [['thr', 'Throughput, at best'], ['pk', 'Packets in one event'], ['delay', 'Longest wait for a message'], ['to', 'Supervision timeout'], ['cur', 'Current of the ESP'], ['life', '1000 mAh Li-ion, idle']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, v = ctl.values, chip = E.chip(v.chip) || chips[0], m = connModel(v, chip), M = 12;
        const span = clamp(m.T * 8, 60, 40000), x0 = 70, x1 = W - 12, X = t => x0 + t / span * (x1 - x0), ppm = (x1 - x0) / span;
        const yP = 54, yE = 112;
        kit.label(c, 'an event every ' + fmtMs(m.ci) + (v.lat ? ' · the ESP wakes 1 in ' + (v.lat + 1) : ''), M, 16, { size: 11, color: C.text2 });
        kit.label(c, 'phone', 8, yP, { size: 11, weight: 650, color: C.text2 }); kit.label(c, 'ESP', 8, yE, { size: 11, weight: 650, color: C.text2 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; c.fillRect(x0, yP - 18, x1 - x0, 36); c.fillRect(x0, yE - 18, x1 - x0, 36);
        const bw = clamp(m.busy * ppm, 3, Math.max(3, m.ci * ppm * 0.8));
        for (let n = 0; n * m.ci <= span; n++) {
          const x = X(n * m.ci), awake = n % (v.lat + 1) === 0;
          c.strokeStyle = C.text2; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, yP - 14); c.lineTo(x, yP + 14); c.stroke();
          if (awake) {
            c.fillStyle = C.accent; c.globalAlpha = 0.75; c.fillRect(x, yE - 14, bw, 28); c.globalAlpha = 1;
            if (bw > 4 * m.N) { c.strokeStyle = C.bg2; c.lineWidth = 1; for (let q = 1; q < m.N; q++) { const xq = x + bw * q / m.N; c.beginPath(); c.moveTo(xq, yE - 14); c.lineTo(xq, yE + 14); c.stroke(); } }
          } else { c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 3]); c.strokeRect(x + 0.5, yE - 14, Math.max(3, bw), 28); c.setLineDash([]); }
        }
        // how long a message to the sleeping ESP may wait
        if (v.lat > 0) {
          c.strokeStyle = C.warn; c.lineWidth = 1.6; c.beginPath(); c.moveTo(X(0), yE + 26); c.lineTo(Math.min(x1, X(m.T)), yE + 26); c.stroke();
          kit.label(c, 'a message from the phone may wait up to ' + fmtMs(m.T), x0, yE + 40, { size: 10.5, color: C.warn });
        } else kit.label(c, 'the ESP listens at every event', x0, yE + 40, { size: 10.5, color: C.muted });
        kit.label(c, 'time: ' + fmtMs(span) + ' shown', x1, yE + 40, { size: 10, color: C.faint, align: 'right' });
        // throughput bar
        const by = 190, bwid = x1 - x0, scale = 1500;
        kit.label(c, 'throughput', 8, by + 8, { size: 11, weight: 650, color: C.text2 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(x0, by, bwid, 16);
        c.fillStyle = C.accent; c.globalAlpha = 0.85; c.fillRect(x0, by, Math.max(2, bwid * clamp(m.kbps / scale, 0, 1)), 16); c.globalAlpha = 1;
        const xm = x0 + bwid * 1000 / scale;
        c.strokeStyle = C.warn; c.lineWidth = 1.5; c.beginPath(); c.moveTo(xm, by - 4); c.lineTo(xm, by + 20); c.stroke();
        kit.label(c, '1 Mbit/s: raw rate of the 1M PHY', xm, by + 32, { size: 10, color: C.warn, align: 'right' });
        kit.label(c, (m.kbps >= 100 ? Math.round(m.kbps) : kit.fmt(m.kbps, 3)) + ' kbit/s', x0 + 6, by + 8, { size: 11, weight: 650, color: m.kbps / scale > 0.12 ? '#fff' : C.text });
        // the timeout rule
        const ok = v.to > m.tsMin, ty = 250;
        S_box(c, C, x0 - 62, ty, x1 - x0 + 62, 30, ok ? C.ok : C.bad, ok ? 'timeout ' + fmtMs(v.to) + ' > 2 × (1 + ' + v.lat + ') × ' + fmtMs(m.ci) + ' = ' + fmtMs(m.tsMin) + ': allowed' : 'timeout ' + fmtMs(v.to) + ' must exceed ' + fmtMs(m.tsMin) + ': the link would drop');
        // the numbers
        ro.set('thr', (m.kbps >= 1000 ? kit.fmt(m.kbps / 1000, 3) + ' Mbit/s' : kit.fmt(m.kbps, 3) + ' kbit/s') + ' · ' + kit.fmt(m.perEvent, 3) + ' bytes an event');
        ro.set('pk', m.N + ' of ' + m.L + ' bytes (airtime allows ' + m.nAir + (m.N < m.nAir ? ', the controller limit is 6' : '') + ')');
        ro.set('delay', 'to the ESP ' + fmtMs(m.T) + ' · to the phone ' + fmtMs(m.ci));
        ro.set('to', ok ? 'fine (the minimum is ' + fmtMs(m.tsMin) + ')' : 'too short: must exceed ' + fmtMs(m.tsMin));
        ro.set('cur', 'idle ' + kit.fmt(m.idle, 3) + ' mA · streaming ' + kit.fmt(m.stream, 3) + ' mA');
        const li = E.batteryLife(1000, m.idle, { cell: 'lipo-1000' });
        ro.set('life', days(li.days));
      }, box.stage);
      function S_box(c, C, x, y, w, h, color, text) {
        c.save(); c.fillStyle = color; c.globalAlpha = 0.14; c.fillRect(x, y, w, h); c.globalAlpha = 1; c.strokeStyle = color; c.lineWidth = 1.2; c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); c.restore();
        kit.label(c, trunc(text, Math.floor((w - 12) / 6.3)), x + 8, y + h / 2, { size: 11, color: color, weight: 600 });
      }
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ bt-pairing */
  const CAPS = {
    none: 'no screen and no keys (NoInputNoOutput)', display: 'a screen only (DisplayOnly)',
    yesno: 'a screen and a yes/no button (DisplayYesNo)', keyboard: 'keys only (KeyboardOnly)'
  };
  const METHODS = { justworks: 'Just Works', passkey: 'Passkey entry', numeric: 'Numeric comparison' };
  function pairPlan(cap, sc, bond, again) {
    const method = cap === 'none' ? 'justworks' : cap === 'yesno' ? (sc ? 'numeric' : 'passkey') : 'passkey';
    const rows = []; let phase = '';
    const R = (from, to, label, why, o) => rows.push(Object.assign({ from, to, label, why, phase }, o));
    phase = '1 Abilities';
    R(0, 1, 'Pairing Request', 'The phone says what it can do: show a number and type one. It asks for bonding and for ' + (sc ? 'LE Secure Connections.' : 'legacy pairing.'));
    R(1, 0, 'Pairing Response', 'The ESP answers with its own abilities, ' + CAPS[cap] + '. From the two answers both sides choose the method: ' + METHODS[method] + '.');
    phase = '2 Check who is there';
    if (sc) { R(0, 1, 'Public key', 'Each side sends a public key (elliptic curve P-256). From them both compute a shared secret that a listener cannot work out.'); R(1, 0, 'Public key', 'The second public key. A passive listener who records all of this still cannot compute the secret.'); }
    if (method === 'justworks') {
      R(1, 0, 'Confirm value', 'Just Works: no number is shown or typed. The confirm values show that someone answered, not who.', { kind: 'warn' });
      R(0, 1, 'Random number', 'The phone reveals its random number so that the confirm value can be checked.');
      R(1, 0, 'Random number', 'The ESP does the same. Nothing here can tell a stranger in the middle from the real device.', { kind: 'warn' });
    } else if (method === 'passkey') {
      if (cap === 'keyboard') R(0, 1, 'User: phone shows 482 913, type it on the ESP', 'The ESP has keys but no screen, so the phone shows a six-digit passkey and you type it on the ESP.', { kind: 'user' });
      else R(1, 0, 'User: ESP shows 482 913, type it on the phone', 'The ESP shows a six-digit passkey and you type it on the phone. A man in the middle does not know it.', { kind: 'user' });
      R(0, 1, 'Confirm value (uses the passkey)', 'Both sides mix the passkey into a confirm value and check each other\'s. A wrong passkey fails here.');
      R(1, 0, 'Confirm value (uses the passkey)', 'The ESP\'s answer.');
    } else {
      R(1, 0, 'User: both screens show 482 913, confirm', 'Both devices compute a six-digit number from the exchange and show it. You check that the two are equal and say Yes on each. A man in the middle would make them differ.', { kind: 'user' });
      R(0, 1, 'Confirm value', 'The confirm values are checked.');
    }
    phase = '3 Keys';
    if (sc) { R(0, 1, 'DHKey check', 'Both prove that they hold the same shared secret. The long-term key is derived from it, never sent.'); R(1, 0, 'DHKey check', 'The ESP\'s proof.'); }
    else R(1, 0, 'Pairing confirmed', 'Both sides derive the short-term key from the exchanged values.');
    phase = '4 Encrypt';
    R(0, 1, 'Start encryption', 'The phone asks to switch the link to AES-CCM encryption with the new key.');
    R(1, 0, 'Encryption on', 'From now on the link is encrypted: a listener sees only noise.', { kind: 'ok' });
    if (bond) {
      phase = '5 Bond';
      R(1, 0, 'Identity key and address', 'Each side tells the other its identity key, so that a changing private address can be recognised later.');
      R(0, 1, 'Identity key and address', 'Both now store the keys: the ESP in flash, the phone in its database. That is the bond.', { kind: 'ok' });
    }
    if (again) {
      phase = '6 Later';
      if (bond) {
        R(0, 1, 'Connect', 'Next day: the phone connects to the advertising ESP again.');
        R(0, 1, 'Start encryption (stored key)', 'No pairing this time. Both still hold the long-term key, so the link is encrypted at once.', { kind: 'ok' });
      } else {
        R(0, 1, 'Connect', 'Next day: the phone connects again.');
        R(0, 1, 'Pairing Request', 'The keys were not kept, so everything starts again, and the user must repeat the confirmation.', { kind: 'warn' });
      }
    }
    return { method, rows, sc, bond };
  }
  Hyper.sim('bt-pairing', {
    title: 'Pairing, step by step',
    blurb: `The phone (the central) is on the left and the ESP (the peripheral) on the right. Each arrow is one message; a dashed arrow is a step the **user** takes. The method is chosen from the abilities of the two devices: here the phone can show and type numbers, and you choose what the ESP can do.

**Try this**
- Choose an ESP **with no screen and no keys**: the method is Just Works, and the readout says what an eavesdropper and a man in the middle can do.
- Give it **a screen only**: the ESP shows a passkey and you type it on the phone.
- Give it **a screen and yes/no** with Secure Connections on: numeric comparison. Turn Secure Connections off: the same ESP falls back to a passkey.
- Tick **Show a later reconnection** with bonding on and off.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 480, maxH: 650 });
      const ctl = kit.controls(box.side, [
        { id: 'cap', type: 'select', label: 'The ESP has…', options: Object.keys(CAPS).map(k => [CAPS[k], k]), value: 'none' },
        { id: 'sc', type: 'check', label: 'LE Secure Connections (Bluetooth 4.2)', value: true },
        { id: 'bond', type: 'check', label: 'Bonding: keep the keys', value: true },
        { id: 'again', type: 'check', label: 'Show a later reconnection', value: false },
        { type: 'buttons', items: [{ id: 'next', label: 'Next message', primary: true }, { id: 'play', label: 'Play all' }, { id: 'again2', label: 'Start over' }] }
      ], id => {
        if (id === 'next') { goal = Math.min(plan.rows.length, Math.max(goal, shown) + (shown >= goal ? 1 : 0)); loop.start(); }
        else if (id === 'play') { goal = plan.rows.length; loop.start(); }
        else restart();
      });
      const ro = kit.readout(box.side, [['method', 'Method'], ['step', 'This step'], ['eave', 'A listener who recorded it'], ['mitm', 'A man in the middle'], ['end', 'Result']]);
      let plan = null, shown = 0, prog = 0, goal = 0;
      function restart() { plan = pairPlan(ctl.values.cap, ctl.values.sc, ctl.values.bond, ctl.values.again); shown = 0; prog = 0; goal = 0; loop.once(); }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W;
        if (shown < goal) { prog += dt / 0.7; if (prog >= 1) { shown++; prog = 0; } } else if (loop.running) loop.stop();
        const rows = plan.rows, xs = [W * 0.22, W * 0.78], nodeR = clamp(W / 32, 12, 17), top = 12 + nodeR, y0 = top + nodeR + 42;
        const rowH = clamp((st.H - y0 - 40) / Math.max(1, rows.length), 14, 30);
        S.node(c, xs[0], top, { kind: 'phone', label: 'phone', sub: 'central', r: nodeR, color: 212 });
        S.node(c, xs[1], top, { kind: 'esp', label: 'ESP', sub: 'peripheral', r: nodeR });
        xs.forEach(x => { c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 5]); c.beginPath(); c.moveTo(x, y0 - 14); c.lineTo(x, y0 + rows.length * rowH); c.stroke(); c.restore(); });
        let phase = '';
        rows.forEach((r, k) => {
          if (k > shown) return;
          const yTop = y0 + k * rowH, y = yTop + rowH / 2;
          if (r.phase !== phase) { c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(6, yTop + 0.5); c.lineTo(W - 6, yTop + 0.5); c.stroke(); c.restore(); kit.label(c, r.phase, 8, yTop + 8, { size: 9.5, color: C.muted, weight: 650 }); }
          phase = r.phase;
          if (k === shown - 1) { c.save(); c.globalAlpha = 0.07; c.fillStyle = C.accent; c.fillRect(0, yTop, W, rowH); c.restore(); }
          const xa = xs[r.from], xb = xs[r.to], dir = xb >= xa ? 1 : -1, col = r.kind === 'warn' ? C.warn : r.kind === 'ok' ? C.ok : r.kind === 'user' ? C.accent : C.text2;
          const f = k < shown ? 1 : clamp(prog, 0, 1), xe = xa + (xb - xa) * f;
          c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 1.8; if (r.kind === 'user') c.setLineDash([5, 4]);
          c.beginPath(); c.moveTo(xa, y); c.lineTo(xe, y); c.stroke(); c.setLineDash([]);
          if (f >= 1) { c.beginPath(); c.moveTo(xb, y); c.lineTo(xb - dir * 9, y - 4.5); c.lineTo(xb - dir * 9, y + 4.5); c.closePath(); c.fill(); }
          c.restore();
          if (f < 1) S.msg(c, xa, y, xb, y, f, { color: col, r: 4 });
          kit.label(c, trunc(r.label, Math.floor((Math.abs(xb - xa) - 6) / 5.7)), (xa + xb) / 2, y - 7, { size: 10.2, color: r.kind === 'warn' ? C.warn : C.text, align: 'center', bg: C.dark ? 'rgba(13,16,32,.78)' : 'rgba(255,255,255,.82)' });
        });
        const done = shown >= rows.length, sc = plan.sc, jw = plan.method === 'justworks';
        const cur = rows[Math.min(shown, rows.length - 1)];
        ro.set('method', METHODS[plan.method] + (sc ? ' with LE Secure Connections' : ', legacy'));
        ro.set('step', done ? 'Finished.' : cur.phase.slice(2) + ': ' + cur.why);
        ro.set('eave', sc ? 'learns nothing: the key comes from a public-key exchange' : jw ? 'recovers the key: the temporary key of Just Works is zero' : 'can try all million passkeys offline and recover the key');
        ro.set('mitm', jw ? 'not detected: nothing is compared' : 'detected: the passkey or number would not match');
        ro.set('end', done ? (plan.bond ? 'Encrypted and bonded: the keys are stored' : 'Encrypted, not bonded: the keys are forgotten at disconnect') : '…');
      }, box.stage);
      restart();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ bt-phy */
  // typical receiver sensitivities of Bluetooth LE radios (dBm) and the time on the air of one packet (µs) for n payload bytes
  const PHYS = [
    { name: 'LE 1M', rate: '1 Mbit/s', sens: -95, air: n => (n + 10) * 8 },
    { name: 'LE 2M', rate: '2 Mbit/s', sens: -92, air: n => (n + 11) * 4 },
    { name: 'Coded S=2', rate: '500 kbit/s', sens: -99, air: n => 80 + 256 + 16 + 24 + (n + 5) * 8 * 2 + 6 },
    { name: 'Coded S=8', rate: '125 kbit/s', sens: -103, air: n => 80 + 256 + 16 + 24 + (n + 5) * 8 * 8 + 24 }
  ];
  const fmtM = m => (m >= 1000 ? kit_fmt(m / 1000) + ' km' : m >= 100 ? Math.round(m) + ' m' : (Math.round(m * 10) / 10) + ' m');
  function kit_fmt(v) { return v >= 10 ? String(Math.round(v)) : String(Math.round(v * 10) / 10); }
  Hyper.sim('bt-phy', {
    title: 'Four PHYs: range against airtime',
    blurb: `Each block is one way of sending bits. The **upper bar** is how far a signal reaches (a logarithmic scale) with your power, surroundings and walls; the vertical line is **your distance**, and a bar turns red if it falls short. The **lower bar** is how long one packet of your payload occupies the air. Sensitivities are typical figures for Bluetooth LE radios and the airtime counts the preamble, address and checksum; both are **approximate**, and an ESP chip's datasheet differs by a few dB.

**Try this**
- At the defaults, read the reach of the 1M PHY and then of coded S=8: about 2 to 3 times as far for 8 times the airtime.
- Add **three walls** or switch to a **house**: all four ranges collapse together.
- Lengthen the **payload** to 251 bytes: the S=8 packet takes 17 ms of airtime.
- Move your distance beyond the 1M reach but inside the S=8 reach: only the coded PHY holds the link.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 400, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'tx', label: 'Transmit power', min: -20, max: 10, step: 1, value: 0, unit: 'dBm' },
        { id: 'n', type: 'select', label: 'Surroundings', options: [['Open air · exponent 2.0', 2.0], ['An office · 2.7', 2.7], ['A house · 3.3', 3.3]], value: 2.7 },
        { id: 'walls', label: 'Walls in the way', min: 0, max: 6, step: 1, value: 0 },
        { id: 'd', label: 'Your distance', min: 1, max: 1000, value: 30, unit: 'm', log: true, sig: 2 },
        { id: 'bytes', label: 'Payload of a packet', min: 1, max: 251, step: 1, value: 31, unit: 'bytes' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['reach', 'Reach, 1M against S=8'], ['air', 'Airtime, 1M against S=8'], ['at', 'At your distance']]);
      const WALL = 6, fs1 = E.fspl(1, 2440);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, v = ctl.values, M = 10;
        const nameW = clamp(W * 0.2, 74, 104), bx = M + nameW, bw = W - bx - 70, rowH = clamp((st.H - 70) / 4, 62, 92);
        const reach = PHYS.map(p => Math.pow(10, (v.tx - p.sens - fs1 - v.walls * WALL) / (10 * v.n)));
        const air = PHYS.map(p => p.air(v.bytes));
        const maxAir = Math.max.apply(null, air), LO = Math.log10(0.5), HI = Math.log10(2000);
        const X = d => bx + (Math.log10(clamp(d, 0.5, 2000)) - LO) / (HI - LO) * bw;
        kit.label(c, 'reach (log scale, metres)  ·  airtime of one packet (linear)', M, 9, { size: 10.5, color: C.muted });
        // the distance scale
        [1, 10, 100, 1000].forEach(d => { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(X(d), 26); c.lineTo(X(d), 26 + rowH * 4 - 8); c.stroke(); kit.label(c, d + ' m', X(d), 26 + rowH * 4 + 2, { size: 9.5, color: C.faint, align: 'center' }); });
        const hit = [];
        PHYS.forEach((p, i) => {
          const y = 32 + i * rowH, ok = reach[i] >= v.d;
          kit.label(c, p.name, M, y + 12, { size: 12, weight: 700, color: C.text });
          kit.label(c, p.rate, M, y + 28, { size: 10, color: C.muted });
          kit.label(c, p.sens + ' dBm', M, y + 42, { size: 10, color: C.faint });
          c.fillStyle = ok ? C.ok : C.bad; c.globalAlpha = 0.8; c.fillRect(bx, y + 4, Math.max(2, X(reach[i]) - bx), 16); c.globalAlpha = 1;
          kit.label(c, fmtM(reach[i]), Math.min(W - M, X(reach[i]) + 6), y + 12, { size: 11, weight: 650, color: C.text });
          c.fillStyle = C.accent; c.globalAlpha = 0.7; c.fillRect(bx, y + 28, Math.max(2, bw * air[i] / maxAir), 11); c.globalAlpha = 1;
          kit.label(c, air[i] >= 1000 ? kit.fmt(air[i] / 1000, 3) + ' ms' : Math.round(air[i]) + ' µs', bx + Math.max(2, bw * air[i] / maxAir) + 6, y + 34, { size: 10.5, color: C.text2 });
          hit.push(ok);
        });
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(X(v.d), 26); c.lineTo(X(v.d), 26 + rowH * 4 - 8); c.stroke();
        kit.label(c, 'you: ' + fmtM(v.d), clamp(X(v.d), 40, W - 40), 23, { size: 10.5, color: C.warn, align: 'center', weight: 650 });
        ro.set('reach', fmtM(reach[0]) + ' against ' + fmtM(reach[3]) + ' (' + kit.fmt(reach[3] / reach[0], 3) + ' times)');
        ro.set('air', (air[0] / 1000 >= 1 ? kit.fmt(air[0] / 1000, 3) + ' ms' : Math.round(air[0]) + ' µs') + ' against ' + kit.fmt(air[3] / 1000, 3) + ' ms (' + kit.fmt(air[3] / air[0], 3) + ' times)');
        ro.set('at', PHYS.map((p, i) => p.name + (hit[i] ? ' holds' : ' fails')).join(' · '));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ bt-mesh */
  Hyper.sim('bt-mesh', {
    title: 'A message flooding through a mesh',
    blurb: `Twenty-four nodes on a floor. A faint line joins two nodes that are in radio range of each other. **Click a node** to send a message from it: it transmits, every node that hears it for the first time and is a **relay** (a ring around it) transmits it again with the TTL reduced by one, and so on until the TTL runs out. Nodes turn from grey to colour as the message reaches them; the colour shows how many hops it took.

**Try this**
- With a TTL of 5 and range 1.5, send from a corner: the message crosses the floor in a few hops.
- Lower the **TTL** to 2: it stops after two hops and the far nodes never hear it.
- Reduce the **relays** to 20 %: far fewer transmissions, but gaps may appear.
- Raise the **range** to 3: everyone is in reach of everyone, and the transmissions pile up: that is the noise of flooding.
- Add **link loss**: the flood often routes around it because of the many paths.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 360, maxH: 500 });
      const COLS = 6, ROWS = 4, N = COLS * ROWS, RT = 0.8;
      const r0 = rng(7), pos = [];
      for (let i = 0; i < N; i++) pos.push([(i % COLS) + (r0() - 0.5) * 0.5, Math.floor(i / COLS) + (r0() - 0.5) * 0.5]);
      let seed = 3, order = [];
      const shuffle = () => { const r = rng(seed++), a = Array.from({ length: N }, (_, i) => i); for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } order = a; };
      shuffle();
      let src = 0, res = null, ta = 0;
      const ctl = kit.controls(box.side, [
        { id: 'range', label: 'Radio range', min: 1, max: 3, step: 0.1, value: 1.5, unit: 'cells' },
        { id: 'ttl', label: 'TTL of the message', min: 1, max: 10, step: 1, value: 5 },
        { id: 'relays', label: 'Nodes that relay', min: 0, max: 100, step: 10, value: 70, unit: '%' },
        { id: 'loss', label: 'Lost packets', min: 0, max: 60, step: 5, value: 0, unit: '% of links' },
        { type: 'buttons', items: [{ id: 'again', label: 'Send again', primary: true }, { id: 'shuffle', label: 'Choose other relays' }] }
      ], id => { if (id === 'shuffle') shuffle(); run(); });
      const ro = kit.readout(box.side, [['reach', 'Nodes reached'], ['tx', 'Transmissions'], ['hops', 'Farthest node'], ['heard', 'Copies heard']]);
      function run() {
        const v = ctl.values, p = 1 - v.loss / 100, relay = new Set(order.slice(0, Math.round(N * v.relays / 100)));
        const got = new Array(N).fill(-1); got[src] = 0;
        let tx = [[src, v.ttl]], round = 0, heard = 0; const rounds = [];
        while (tx.length && round < 30) {
          rounds.push(tx.map(t => t[0]));
          const next = [];
          tx.forEach(([a, t]) => {
            for (let j = 0; j < N; j++) {
              if (j === a || Math.hypot(pos[a][0] - pos[j][0], pos[a][1] - pos[j][1]) > v.range) continue;
              if ((Math.imul((a + 1) * 131 + j * 17 + round * 7919, 2654435761) >>> 0) / 4294967296 >= p) continue;
              heard++;
              if (got[j] < 0) { got[j] = round + 1; if (relay.has(j) && t >= 2) next.push([j, t - 1]); }
            }
          });
          tx = next; round++;
        }
        res = { got, rounds, relay, heard, tx: rounds.reduce((s, r) => s + r.length, 0), reached: got.filter(g => g >= 0).length, hops: Math.max.apply(null, got) };
        ta = 0; loop.start();
      }
      const loop = kit.loop(dt => {
        ta += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, v = ctl.values;
        const unit = Math.min((W - 40) / (COLS - 0.5), (st.H - 60) / (ROWS - 0.5)), ox = (W - unit * (COLS - 0.5)) / 2, oy = 22 + (st.H - 60 - unit * (ROWS - 0.5)) / 2;
        const P = i => [ox + (pos[i][0] + 0.25) * unit, oy + (pos[i][1] + 0.25) * unit];
        // links in range
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) if (Math.hypot(pos[i][0] - pos[j][0], pos[i][1] - pos[j][1]) <= v.range) { const a = P(i), b = P(j); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
        // the waves of the round in progress
        const rIdx = Math.floor(ta / RT);
        if (rIdx < res.rounds.length) res.rounds[rIdx].forEach(a => {
          const f = (ta - rIdx * RT) / RT, q = P(a);
          c.save(); c.strokeStyle = C.accent; c.globalAlpha = 0.7 * (1 - f); c.lineWidth = 2; c.beginPath(); c.arc(q[0], q[1], Math.max(1, v.range * unit * f), 0, 6.283); c.stroke(); c.restore();
        });
        // the nodes
        for (let i = 0; i < N; i++) {
          const q = P(i), g = res.got[i], reached = g >= 0 && ta >= (g - 0.5) * RT && g > 0 || i === src;
          if (res.relay.has(i) || i === src) { c.strokeStyle = i === src ? C.accent : C.muted; c.lineWidth = 1.4; c.beginPath(); c.arc(q[0], q[1], 11, 0, 6.283); c.stroke(); }
          c.fillStyle = i === src ? C.accent : reached ? kit.hue(150 - Math.min(g, 9) * 14) : C.faint;
          c.beginPath(); c.arc(q[0], q[1], i === src ? 8 : 6.5, 0, 6.283); c.fill();
          if (reached && i !== src) kit.label(c, String(g), q[0], q[1] - 17, { size: 9.5, color: C.text2, align: 'center' });
        }
        kit.label(c, 'click a node to send · ring: relay · number: hops', 10, 12, { size: 10.5, color: C.text2 });
        const rl = [['sender', C.accent], ['reached', kit.hue(120)], ['not reached', C.faint]];
        rl.forEach(([t, col], i) => { const lx = 12 + i * 100, ly = st.H - 14; kit.dot(c, lx, ly, 5, col); kit.label(c, t, lx + 10, ly, { size: 10.5, color: C.text2 }); });
        ro.set('reach', res.reached + ' of ' + N + ' nodes' + (ta < res.rounds.length * RT ? ' (so far, and counting)' : ''));
        ro.set('tx', res.tx + ' (1 from the sender, ' + (res.tx - 1) + ' from relays)');
        ro.set('hops', res.hops + ' hops' + (res.hops >= v.ttl ? ' (the TTL was the limit)' : ''));
        ro.set('heard', res.reached > 1 ? kit.fmt(res.heard / Math.max(1, res.reached - 1), 3) + ' per node on average' : 'none');
        if (ta > (res.rounds.length + 1) * RT) loop.stop();
      }, box.stage);
      kit.click(st, p => {
        const unit = Math.min((st.W - 40) / (COLS - 0.5), (st.H - 60) / (ROWS - 0.5)), ox = (st.W - unit * (COLS - 0.5)) / 2, oy = 22 + (st.H - 60 - unit * (ROWS - 0.5)) / 2;
        let best = -1, bd = 24;
        for (let i = 0; i < N; i++) { const d = Math.hypot(ox + (pos[i][0] + 0.25) * unit - p.x, oy + (pos[i][1] + 0.25) * unit - p.y); if (d < bd) { bd = d; best = i; } }
        if (best >= 0) { src = best; run(); }
      }, () => true);
      run();
      st.onResize(() => loop.once());
    }
  });
})();
