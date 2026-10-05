/* HYPER-ESP32 · sims/cloud-and-data-management.js
 *
 * Simulations of the topic "cloud-and-data-management" (ids cd-*).
 *
 *   cd-path       the path of a reading from sensor to dashboard, hop by hop; params { arch: 'cloud' | 'gateway' | 'local' }
 *   cd-payload    one reading as JSON, CBOR, Protocol Buffers and a packed frame: sizes, the bytes, what fits the channel
 *   cd-series     a signal sampled, kept raw for a while and summarised after: storage against the spikes you still see
 *   cd-dashboard  a dashboard drawn with virtual-display widgets, fed by a sensor stream: stale data and alert rules
 *   cd-shadow     a device shadow or twin: desired, reported and delta converge; params { flavour: 'shadow' | 'rainmaker' }
 *   cd-outage     an outage with and without buffering: what arrives live, late or never
 *   cd-rate       reporting interval and batching against messages, traffic, billing blocks and battery life
 *   cd-privacy    a day of household power at different resolutions: which events can still be read off
 *   cd-identity   a fleet with a shared secret, a secret per device or a certificate per device: one is stolen
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmtN = v => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const fitText = (s, px, size) => { const n = Math.max(3, Math.floor(px / (size * 0.56))); s = String(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  const rng = seed => { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; };
  const hex2 = b => (b < 16 ? '0' : '') + b.toString(16).toUpperCase();
  const round1 = v => Math.round(v * 10) / 10;

  /* ================================================================ cd-path */
  // the chains. hop i joins node i to node i + 1; "need" names the part of the environment that hop depends on.
  const ARCHS = {
    cloud: {
      name: 'Direct to a cloud',
      nodes: [{ kind: 'sensor', label: 'sensor' }, { kind: 'esp', label: 'ESP32', buf: true }, { kind: 'router', label: 'router' }, { kind: 'cloud', label: 'broker', sub: 'in the cloud' }, { kind: 'db', label: 'database' }, { kind: 'phone', label: 'phone', sub: 'dashboard' }],
      hops: [{ proto: 'I2C', ms: 1, form: '2 bytes' }, { proto: 'Wi-Fi', ms: 5, form: 'JSON, 57 B', need: 'wifi' }, { proto: 'internet', ms: 40, form: 'MQTT + TLS', need: 'net' }, { proto: 'rule: write', ms: 20, form: 'a point' }, { proto: 'HTTPS', ms: 80, form: 'a graph' }]
    },
    gateway: {
      name: 'Through a gateway',
      nodes: [{ kind: 'sensor', label: 'sensor' }, { kind: 'esp', label: 'ESP32 node' }, { kind: 'gateway', label: 'gateway', buf: true }, { kind: 'router', label: 'router' }, { kind: 'cloud', label: 'broker', sub: 'in the cloud' }, { kind: 'phone', label: 'phone', sub: 'dashboard' }],
      hops: [{ proto: 'I2C', ms: 1, form: '2 bytes' }, { proto: 'ESP-NOW', ms: 3, form: 'frame, 9 B' }, { proto: 'Wi-Fi', ms: 5, form: 'JSON, 57 B', need: 'wifi' }, { proto: 'internet', ms: 40, form: 'MQTT + TLS', need: 'net' }, { proto: 'HTTPS', ms: 80, form: 'a graph' }]
    },
    local: {
      name: 'Local first',
      nodes: [{ kind: 'sensor', label: 'sensor' }, { kind: 'esp', label: 'ESP32', buf: true }, { kind: 'router', label: 'router' }, { kind: 'server', label: 'home server', sub: 'broker + database' }, { kind: 'phone', label: 'phone', sub: 'dashboard' }],
      hops: [{ proto: 'I2C', ms: 1, form: '2 bytes' }, { proto: 'Wi-Fi', ms: 5, form: 'JSON, 57 B', need: 'wifi' }, { proto: 'LAN', ms: 2, form: 'MQTT' }, { proto: 'home Wi-Fi', ms: 8, form: 'a graph' }]
    }
  };

  function pathPlace(n, W, H) {
    const pad = Math.max(34, W * 0.075), narrow = W < 540, pts = [];
    if (!narrow || n <= 4) {
      const y = H * (narrow ? 0.4 : 0.38);
      for (let i = 0; i < n; i++) pts.push([pad + i * (W - 2 * pad) / (n - 1), y]);
    } else {
      const k = Math.ceil(n / 2), y1 = H * 0.24, y2 = H * 0.6;
      for (let i = 0; i < n; i++) {
        if (i < k) pts.push([pad + i * (W - 2 * pad) / (k - 1), y1]);
        else pts.push([pad + (k - 1 - (i - k)) * (W - 2 * pad) / (k - 1), y2]);
      }
    }
    return pts;
  }

  Hyper.sim('cd-path', {
    title: 'The path of a reading, from sensor to dashboard',
    blurb: `A reading leaves the sensor and crosses one link after another. Each link is labelled with its protocol and a **typical delay** (schematic: real figures vary with the network); the label above the travelling dot says what the data looks like at that moment. Cut a link and see where the chain breaks, what the dashboard then shows, and what a device that **buffers** can still do.

**Try this**
- Untick **Home Wi-Fi works**: in every shape the chain breaks at the same place, and the dashboard goes stale. Tick the buffer box and watch readings pile up on the device instead of being lost.
- Untick **Internet works** in *Direct to a cloud*, then in *Local first*: only one of them notices.
- In *Local first* put the phone **away from home**: it now needs the internet and a VPN to reach the server.
- Compare the end-to-end delays of the three shapes.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 330, maxH: 520 });
      let arch = ARCHS[params.arch] ? params.arch : 'cloud';
      const reset = () => { lastCyc = -1; lastOk = null; arrivedCyc = -1; lost = 0; held = 0; lateN = 0; lateAt = -99; };
      const ctl = kit.controls(box.side, [
        { id: 'arch', type: 'select', label: 'Shape', options: Object.keys(ARCHS).map(k => [ARCHS[k].name, k]), value: arch },
        { id: 'wifi', type: 'check', label: 'Home Wi-Fi works', value: true },
        { id: 'net', type: 'check', label: 'Internet works', value: true },
        { id: 'buf', type: 'check', label: 'The device buffers while a link is down', value: false },
        { id: 'away', type: 'check', label: 'Phone is away from home (Local first)', value: false }
      ], (id, v) => {
        if (id === 'arch') { arch = v; reset(); ctl.show('away', arch === 'local'); }
        loop.once();
      });
      ctl.show('away', arch === 'local');
      const ro = kit.readout(box.side, [['shape', 'Shape'], ['delay', 'End to end'], ['dash', 'The dashboard shows'], ['net', 'Needs the internet for daily use']]);
      const SEG = 0.75, GAP = 1.2;
      let lastCyc = -1, lastOk = null, arrivedCyc = -1, lost = 0, held = 0, lateN = 0, lateAt = -99;
      const hopsOf = () => {
        const a = ARCHS[arch], hops = a.hops.map(h => Object.assign({}, h));
        if (arch === 'local' && ctl.values.away) hops[hops.length - 1] = { proto: 'VPN + internet', ms: 60, form: 'a graph', need: 'net' };
        return hops;
      };
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), A = ARCHS[arch], hops = hopsOf(), n = hops.length, env = ctl.values;
        const CYC = n * SEG + GAP, cyc = Math.floor(t / CYC), tin = t - cyc * CYC;
        const fail = hops.findIndex(h => h.need && !env[h.need]);
        if (cyc !== lastCyc) {
          lastCyc = cyc;
          if (fail < 0) { if (held > 0) { lateN = held; lateAt = t; held = 0; } }
          else if (env.buf) held = Math.min(held + 1, 99);
          else lost++;
        }
        if (fail < 0 && tin >= n * SEG && arrivedCyc !== cyc) { arrivedCyc = cyc; lastOk = t; }
        const r = clamp(st.W / 36, 12, 19), P = pathPlace(A.nodes.length, st.W, st.H);
        // the links
        hops.forEach((h, i) => {
          const a = P[i], b = P[i + 1], up = fail < 0 || i < fail, past = fail >= 0 && i > fail;
          S.link(c, a[0], a[1], b[0], b[1], { gap: r + 3, width: 2, color: up ? C.text2 : past ? C.faint : C.bad, dash: !up });
          const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, vertical = Math.abs(a[1] - b[1]) > 4;
          const al = vertical ? 'left' : 'center', lx = vertical ? mx + 9 : mx, ly = vertical ? my - 6 : my + 14;
          kit.label(c, h.proto, lx, ly, { size: 10.5, color: up ? C.text : past ? C.faint : C.bad, align: al, weight: 600 });
          kit.label(c, '~' + h.ms + ' ms', lx, ly + 12, { size: 10, color: C.muted, align: al });
          if (h.need) kit.label(c, h.need === 'wifi' ? 'needs Wi-Fi' : 'needs internet', lx, ly + 24, { size: 9, color: C.faint, align: al });
        });
        // the nodes
        A.nodes.forEach((nd, i) => {
          const dim = fail >= 0 && i > fail;
          S.node(c, P[i][0], P[i][1], { kind: nd.kind, label: nd.label, sub: nd.sub, r, dim, active: i === A.nodes.length - 1 && fail < 0 && tin >= n * SEG && tin < n * SEG + 0.6, color: nd.kind === 'esp' ? undefined : undefined });
        });
        // readings held on the device, drawn as a little stack above the node that holds them
        if (fail >= 0 && env.buf && held > 0) {
          let hold = fail;
          while (hold > 0 && !A.nodes[hold].buf) hold--;
          const hp = P[hold], k = Math.min(held, 8);
          for (let q = 0; q < k; q++) { c.fillStyle = C.warn; c.fillRect(hp[0] - 14 + q * 4, hp[1] - r - 12 - (q % 2) * 0, 3, 8); }
          kit.label(c, held + ' held', hp[0] + 22, hp[1] - r - 8, { size: 10, color: C.warn, align: 'left', weight: 600 });
        }
        // the travelling reading
        for (let i = 0; i < n; i++) {
          if (fail >= 0 && i > fail) break;
          let f = (tin - i * SEG) / SEG;
          const a = P[i], b = P[i + 1];
          if (i === fail) {
            const stop = 0.55;
            if (f >= stop) {
              const x = a[0] + (b[0] - a[0]) * stop, y = a[1] + (b[1] - a[1]) * stop;
              kit.label(c, '×', x, y, { size: 22, color: C.bad, align: 'center', weight: 700 });
              break;
            }
            f = Math.min(f, stop);
          }
          if (f >= 0 && f <= 1) S.msg(c, a[0], a[1], b[0], b[1], f, { label: hops[i].form, color: C.accent, r: 5, gap: r + 3 });
        }
        // the numbers
        const total = hops.reduce((s, h) => s + h.ms, 0);
        ro.set('shape', A.name);
        ro.set('delay', fail < 0 ? '~' + total + ' ms' : 'broken at: ' + hops[fail].proto);
        const age = lastOk == null ? null : t - lastOk;
        let dash;
        if (age == null) dash = fail < 0 ? 'waiting for the first reading' : 'nothing yet: the chain is broken';
        else if (fail < 0 && t - lateAt < 5 && lateN > 0) dash = 'live again: ' + lateN + ' held readings arrived late';
        else if (fail < 0) dash = 'live';
        else dash = 'stale: last reading ' + Math.round(age) + ' s ago' + (held > 0 ? ', ' + held + ' held on the device' : lost > 0 ? ', ' + lost + ' readings lost' : '');
        ro.set('dash', dash);
        ro.set('net', hops.some(h => h.need === 'net') ? 'yes' : 'no');
        kit.label(c, 'one reading every ' + fmtN(CYC) + ' s (the dot is slowed down)', 10, st.H - 12, { size: 10, color: C.faint, align: 'left' });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ cd-payload */
  const utf8 = s => { const out = []; for (const ch of s) { const cp = ch.codePointAt(0); if (cp < 128) out.push(cp); else if (cp < 2048) out.push(192 | (cp >> 6), 128 | (cp & 63)); else out.push(224 | (cp >> 12), 128 | ((cp >> 6) & 63), 128 | (cp & 63)); } return out; };
  const f32 = v => { const d = new DataView(new ArrayBuffer(4)); d.setFloat32(0, v); return [d.getUint8(0), d.getUint8(1), d.getUint8(2), d.getUint8(3)]; };
  const f32le = v => f32(v).reverse();
  const cborHead = (major, n) => n < 24 ? [(major << 5) | n] : n < 256 ? [(major << 5) | 24, n] : n < 65536 ? [(major << 5) | 25, n >> 8, n & 255] : [(major << 5) | 26, (n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
  function cbor(v) {
    if (typeof v === 'string') { const b = utf8(v); return cborHead(3, b.length).concat(b); }
    if (typeof v === 'number') {
      if (Number.isInteger(v)) return v >= 0 ? cborHead(0, v) : cborHead(1, -1 - v);
      return [0xFA].concat(f32(v));
    }
    if (Array.isArray(v)) return v.reduce((a, x) => a.concat(cbor(x)), cborHead(4, v.length));
    const keys = Object.keys(v);
    return keys.reduce((a, k) => a.concat(cbor(k), cbor(v[k])), cborHead(5, keys.length));
  }
  const varint = n => { const o = []; while (n >= 128) { o.push((n & 127) | 128); n = Math.floor(n / 128); } o.push(n); return o; };
  const T0 = 1791115200, DEVICE = 'esp32-demo';
  const readingsOf = b => { const o = []; for (let i = 0; i < b; i++) o.push({ t: T0 + 10 * i, temp: round1(21.5 + 0.1 * i), hum: round1(48.2 - 0.1 * i) }); return o; };
  function encodings(b, withId) {
    const rs = readingsOf(b);
    // JSON and CBOR: one reading is a flat object, several are a list
    const obj = b === 1 ? Object.assign(withId ? { id: DEVICE } : {}, rs[0]) : Object.assign(withId ? { id: DEVICE } : {}, { r: rs });
    const json = JSON.stringify(obj);
    const cb = cbor(obj);
    // Protocol Buffers: id = 1, then either the flat fields 2 to 4 or a repeated message in field 5
    let pb = [];
    if (withId) { const id = utf8(DEVICE); pb = pb.concat([0x0A, id.length], id); }
    if (b === 1) pb = pb.concat([0x10], varint(rs[0].t), [0x1D], f32le(rs[0].temp), [0x25], f32le(rs[0].hum));
    else rs.forEach(r => { const sub = [0x08].concat(varint(r.t), [0x15], f32le(r.temp), [0x1D], f32le(r.hum)); pb = pb.concat([0x2A, sub.length], sub); });
    // packed frame: version, then the time, the values as fixed point; several readings share a start time and a step
    const le16 = v => [v & 255, (v >> 8) & 255], le32 = v => [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255];
    let bin = [1];
    if (b === 1) bin = bin.concat(le32(rs[0].t), le16(Math.round(rs[0].temp * 100) & 0xFFFF), le16(Math.round(rs[0].hum * 100)));
    else { bin = bin.concat([b], le32(T0), le16(10)); rs.forEach(r => { bin = bin.concat(le16(Math.round(r.temp * 100) & 0xFFFF), le16(Math.round(r.hum * 100))); }); }
    if (withId) bin = bin.concat(utf8(DEVICE));
    return { json: { bytes: utf8(json), text: json }, cbor: { bytes: cb }, pb: { bytes: pb }, bin: { bytes: bin } };
  }
  const MQTT_TOPIC = 28;
  const CHANNELS = {
    tls: { name: 'MQTT over TLS on Wi-Fi', over: p => 1 + (p + MQTT_TOPIC + 2 < 128 ? 1 : 2) + 2 + MQTT_TOPIC + 40 + 25 },
    plain: { name: 'MQTT without TLS', over: p => 1 + (p + MQTT_TOPIC + 2 < 128 ? 1 : 2) + 2 + MQTT_TOPIC + 40 },
    lora: { name: 'LoRaWAN, slowest rate', limit: 51 },
    espnow: { name: 'ESP-NOW (original)', limit: 250 }
  };
  const FORMATS = [['json', 'JSON'], ['cbor', 'CBOR'], ['pb', 'Protocol Buffers'], ['bin', 'Packed frame']];

  Hyper.sim('cd-payload', {
    title: 'One reading, four formats',
    blurb: `The same reading (a time, a temperature, a humidity, and optionally the device name) written four ways. The bar is the **payload**; on MQTT channels the paler part is the **headers** of MQTT, TCP/IP and, with TLS, the record layer. The dump shows the real bytes of the format you pick, and the check value is the CRC-32 of those bytes.

**Try this**
- Start with one reading and *MQTT over TLS*: the frame (19 bytes with the name, 9 without) is a third or less of the JSON's 57, but the totals on the wire differ much less.
- Switch to **LoRaWAN**: the headers vanish from the picture and a hard limit appears. Which formats fit now?
- Raise the **readings per message**: the repeated names make JSON grow fastest, while the frame shares one start time.
- Untick **Include the device name**: the binary frame loses 10 bytes, the others lose the key as well.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 380, maxH: 640 });
      const ctl = kit.controls(box.side, [
        { id: 'ch', type: 'select', label: 'Channel', options: Object.keys(CHANNELS).map(k => [CHANNELS[k].name, k]), value: 'tls' },
        { id: 'b', label: 'Readings per message', min: 1, max: 12, step: 1, value: 1 },
        { id: 'id', type: 'check', label: 'Include the device name', value: true },
        { id: 'view', type: 'select', label: 'Show the bytes of', options: FORMATS.map(f => [f[1], f[0]]), value: 'json' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['size', 'This format'], ['wire', 'On the wire'], ['month', 'Traffic a month'], ['crc', 'CRC-32 of the payload']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, ch = CHANNELS[v.ch], enc = encodings(v.b, v.id);
        const rows = FORMATS.map(([k, name]) => { const p = enc[k].bytes.length, over = ch.over ? ch.over(p) : 0; return { k, name, p, over, total: p + over }; });
        const maxB = Math.max(...rows.map(r => r.total), ch.limit ? ch.limit * 1.12 : 0, 20);
        const narrow = st.W < 520, lw = narrow ? 92 : 128, x0 = lw + 6, bw = st.W - x0 - (narrow ? 70 : 150), rowH = 30, y0 = 34;
        kit.label(c, ch.name + ' · ' + v.b + (v.b === 1 ? ' reading' : ' readings') + ' per message', 10, 14, { size: 12, weight: 650 });
        const X = n => x0 + n / maxB * bw;
        if (ch.limit) {
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(ch.limit), y0 - 8); c.lineTo(X(ch.limit), y0 + rows.length * rowH); c.stroke(); c.restore();
          kit.label(c, 'limit ' + ch.limit + ' B', X(ch.limit), y0 - 14, { size: 10, color: C.warn, align: 'center' });
        }
        rows.forEach((r, i) => {
          const y = y0 + i * rowH, hue = [212, 150, 36, 300][i], sel = r.k === v.view;
          kit.label(c, r.name, 10, y + 11, { size: 11.5, weight: sel ? 700 : 500, color: sel ? C.text : C.text2 });
          c.fillStyle = kit.hue(hue, 0.85); c.fillRect(x0, y + 2, Math.max(2, X(r.p) - x0), 17);
          if (r.over) { c.fillStyle = C.dark ? 'rgba(255,255,255,.16)' : 'rgba(0,0,0,.13)'; c.fillRect(X(r.p), y + 2, X(r.total) - X(r.p), 17); }
          const over = ch.limit && r.p > ch.limit;
          const txt = ch.limit ? r.p + ' B' + (over ? ' · too big' : ' · fits') : r.p + (r.over ? ' + ' + r.over + ' = ' + r.total : '') + ' B';
          kit.label(c, fitText(txt, st.W - X(r.total) - 14, 11), X(r.total) + 6, y + 11, { size: 11, color: over ? C.bad : C.text2, align: 'left' });
        });
        // the bytes of the chosen format
        const sel = enc[v.view], by = y0 + rows.length * rowH + 22, nm = FORMATS.find(f => f[0] === v.view)[1];
        kit.label(c, nm + ' — the bytes' + (v.view === 'json' ? ' (text)' : ' (hexadecimal)'), 10, by, { size: 11.5, weight: 650 });
        const size = narrow ? 10 : 11, cw = size * 0.6, perRow = Math.max(8, Math.floor((st.W - 20) / (cw * 3))), maxRows = Math.max(3, Math.floor((st.H - by - 18) / (size + 5)));
        if (v.view === 'json') {
          const per = Math.max(10, Math.floor((st.W - 20) / cw));
          for (let r = 0; r < maxRows; r++) {
            const part = sel.text.slice(r * per, (r + 1) * per);
            if (!part) break;
            S_text(kit, c, part + (r === maxRows - 1 && sel.text.length > (r + 1) * per ? '…' : ''), 10, by + 16 + r * (size + 5), size, C.text2);
          }
        } else {
          const bytes = sel.bytes;
          for (let r = 0; r < maxRows; r++) {
            const part = bytes.slice(r * perRow, (r + 1) * perRow);
            if (!part.length) break;
            S_text(kit, c, part.map(hex2).join(' ') + (r === maxRows - 1 && bytes.length > (r + 1) * perRow ? ' …' : ''), 10, by + 16 + r * (size + 5), size, C.text2);
          }
        }
        const cur = rows.find(r => r.k === v.view), crc = E.crc32(sel.bytes) >>> 0;
        ro.set('size', cur.p + ' bytes');
        ro.set('wire', ch.limit ? (cur.p <= ch.limit ? 'fits in ' + ch.limit + ' B' : 'does not fit in ' + ch.limit + ' B') : cur.total + ' bytes');
        ro.set('month', ch.limit ? 'not applicable' : kit.fmt(cur.total * 43200 / v.b / 1e6, 3) + ' MB at one reading a minute');
        ro.set('crc', '0x' + ('00000000' + crc.toString(16).toUpperCase()).slice(-8));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  // monospaced text, left aligned
  function S_text(kit, c, s, x, y, size, color) { kit.esym.text(c, s, x, y, { size, color, align: 'left', mono: true }); }

  /* ================================================================ cd-series */
  // fourteen days of a greenhouse temperature, one value a minute, with two short spikes
  const SERIES = (() => {
    const n = 14 * 1440, r = rng(7), v = new Float64Array(n);
    for (let i = 0; i < n; i++) v[i] = 18 + 4.5 * Math.sin(2 * Math.PI * (i / 1440 - 0.3)) + 0.9 * Math.sin(2 * Math.PI * i / (1440 * 5)) + (r() - 0.5) * 0.7;
    const spike = (day, hour, minutes, add) => { const s = day * 1440 + hour * 60; for (let k = 0; k < minutes; k++) v[s + k] += add * Math.sin(Math.PI * (k + 0.5) / minutes) ** 0.5; };
    spike(3, 14.3, 8, 13); spike(9, 3.2, 6, 11);
    return v;
  })();
  const LIMIT = 28;

  Hyper.sim('cd-series', {
    title: 'Sampling, retention and downsampling',
    blurb: `Fourteen days of a greenhouse temperature, with two short **heat spikes**. The sensor reports at the interval you choose; the newest days are kept as raw readings, the older ones are replaced by **hourly summaries**, or deleted. The dashed line is an alert limit of ${LIMIT} °C: a spike counts as *still visible* if some stored value crosses it.

**Try this**
- Keep **hourly mean only** and sample every minute: the spikes vanish from the old days. Switch to **mean, minimum and maximum**: they come back, as the top of the band.
- Sample **every hour**: even the raw data misses the spikes, whatever you keep. The sampling interval is a decision too.
- Compare **Stored** with **Without a rule**: how much does the retention rule save?
- Choose **delete** for old data and read what you lose.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'int', type: 'select', label: 'The sensor reports', options: [['every 10 s', 1 / 6], ['every minute', 1], ['every 5 minutes', 5], ['every 15 minutes', 15], ['every hour', 60]], value: 1 },
        { id: 'raw', type: 'select', label: 'Keep raw readings for', options: [['1 day', 1], ['3 days', 3], ['7 days', 7], ['14 days', 14]], value: 3 },
        { id: 'old', type: 'select', label: 'Older data is kept as', options: [['nothing (deleted)', 'none'], ['hourly mean only', 'mean'], ['hourly mean, minimum and maximum', 'mmm']], value: 'mmm' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['stored', 'Stored'], ['full', 'Without a rule'], ['saved', 'Saved'], ['spikes', 'Spikes still visible']]);
      const BYTES = 16;       // per stored value, before compression (schematic)
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, step = Math.max(1, Math.round(v.int)), days = 14, rawDays = v.raw;
        const pl = 44, pr = 12, pt = 28, pb = 36, w = st.W - pl - pr, h = st.H - pt - pb, lo = 10, hi = 36;
        const X = d => pl + d / days * w, Y = val => pt + h - (clamp(val, lo, hi) - lo) / (hi - lo) * h;
        // what the sensor reported: every step-th minute
        const sampled = i => i % step === 0;
        const cut = (days - rawDays) * 1440;       // minutes before this are "old"
        // grid and axes
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let val = 10; val <= 35; val += 5) { const y = Math.round(Y(val)) + 0.5; c.beginPath(); c.moveTo(pl, y); c.lineTo(pl + w, y); c.stroke(); kit.label(c, val + ' °C', pl - 5, y, { size: 9.5, color: C.faint, align: 'right' }); }
        for (let d = 0; d <= days; d += 2) kit.label(c, d === days ? 'now' : '−' + (days - d) + ' d', X(d), pt + h + 12, { size: 9.5, color: C.faint, align: 'center' });
        // old region
        let seen = false, storedValues = 0;
        const hours = Math.floor(cut / 60);
        const bands = [];
        for (let hh = 0; hh < hours; hh++) {
          let mn = 1e9, mx = -1e9, sum = 0, k = 0;
          for (let m = hh * 60; m < hh * 60 + 60; m++) if (sampled(m)) { const x = SERIES[m]; if (x < mn) mn = x; if (x > mx) mx = x; sum += x; k++; }
          if (k) bands.push({ d: (hh + 0.5) / 24, mn, mx, mean: sum / k });
        }
        if (v.old !== 'none') {
          storedValues += bands.length * (v.old === 'mmm' ? 3 : 1);
          if (v.old === 'mmm') {
            c.save(); c.globalAlpha = 0.25; c.fillStyle = C.accent; c.beginPath();
            bands.forEach((b, i) => { const x = X(b.d), y = Y(b.mx); if (i) c.lineTo(x, y); else c.moveTo(x, y); });
            for (let i = bands.length - 1; i >= 0; i--) c.lineTo(X(bands[i].d), Y(bands[i].mn));
            c.closePath(); c.fill(); c.restore();
            if (bands.some(b => b.mx > LIMIT)) seen = true;
          }
          c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
          bands.forEach((b, i) => { const x = X(b.d), y = Y(b.mean); if (i) c.lineTo(x, y); else c.moveTo(x, y); });
          c.stroke();
        } else if (hours > 0) {
          c.save(); c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)'; c.fillRect(pl, pt, X(days - rawDays) - pl, h); c.restore();
          kit.label(c, 'deleted', (pl + X(days - rawDays)) / 2, pt + h / 2, { size: 12, color: C.faint, align: 'center' });
        }
        // raw region
        c.strokeStyle = C.series[1] || C.warn; c.lineWidth = 1.4; c.beginPath();
        let first = true, rawCount = 0;
        for (let m = Math.max(0, cut); m < days * 1440; m++) {
          if (!sampled(m)) continue;
          rawCount++;
          if (SERIES[m] > LIMIT) seen = true;
          const x = X(m / 1440), y = Y(SERIES[m]);
          if (first) { c.moveTo(x, y); first = false; } else c.lineTo(x, y);
        }
        c.stroke();
        // the limit, the boundary
        c.save(); c.strokeStyle = C.bad; c.lineWidth = 1.3; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(pl, Y(LIMIT)); c.lineTo(pl + w, Y(LIMIT)); c.stroke(); c.restore();
        kit.label(c, 'alert limit ' + LIMIT + ' °C', pl + w - 2, Y(LIMIT) - 8, { size: 10, color: C.bad, align: 'right' });
        if (cut > 0) { c.save(); c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([2, 4]); c.beginPath(); c.moveTo(X(days - rawDays), pt); c.lineTo(X(days - rawDays), pt + h); c.stroke(); c.restore(); }
        kit.label(c, v.old === 'none' ? '' : 'older: ' + (v.old === 'mmm' ? 'hourly mean, min, max' : 'hourly mean'), pl + 4, pt - 12, { size: 10.5, color: C.accent, align: 'left' });
        kit.label(c, 'raw: ' + (rawDays === 1 ? 'last day' : 'last ' + rawDays + ' days'), pl + w, pt - 12, { size: 10.5, color: C.series[1] || C.warn, align: 'right' });
        // the numbers
        const perDay = 1440 / v.int, rawPoints = rawDays * perDay, fullPoints = days * perDay;
        const stored = (rawPoints + storedValues) * BYTES, full = fullPoints * BYTES;
        const fmtMB = b => b >= 1e6 ? kit.fmt(b / 1e6, 3) + ' MB' : kit.fmt(b / 1e3, 3) + ' kB';
        ro.set('stored', fmtMB(stored) + ' (' + fmtN(rawPoints + storedValues) + ' values)');
        ro.set('full', fmtMB(full) + ' (' + fmtN(fullPoints) + ' values)');
        ro.set('saved', Math.round((1 - stored / full) * 100) + ' %');
        ro.set('spikes', seen ? 'yes: a stored value crosses ' + LIMIT + ' °C' : 'no: the alert limit is never crossed');
        void E;
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cd-dashboard */
  Hyper.sim('cd-dashboard', {
    title: 'A dashboard fed by a sensor stream',
    blurb: `A small dashboard drawn on a virtual 240 × 160 colour display: a gauge, the value, an alert light and a chart of the last readings. The "sensor" reports at the interval you set. **Disconnect** it and see what the dashboard does with data that has stopped arriving, with and without the age shown. The alert rule decides when the light comes on.

**Try this**
- Choose *swinging around the limit* and the rule *any reading above the limit*: count the alerts. Now choose the delay rule: the same signal rings far less.
- Untick **Sensor is connected**. With the age shown the dashboard greys out and says "stale"; untick the age too and the last value is shown as if it were now.
- Pick *with short spikes*: one glitch is enough for the first rule, none for the second.
- Raise the reporting interval: the "stale" warning comes later, because it waits for a few missed reports.`,
    mount(box, kit) {
      const G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 300, maxH: 520 });
      const R = rng(11);
      let T = 0, nextReport = 0, last = null, alertOn = false, aboveSince = null, fired = 0;
      const hist = [];
      const ctl = kit.controls(box.side, [
        { id: 'scn', type: 'select', label: 'The sensor', options: [['steady', 'steady'], ['rising slowly', 'rise'], ['swinging around the limit', 'swing'], ['with short spikes', 'spiky']], value: 'swing' },
        { id: 'iv', label: 'Reports every', min: 1, max: 20, step: 1, value: 3, unit: 's' },
        { id: 'lim', label: 'Alert limit', min: 24, max: 34, step: 0.5, value: 28, unit: '°C' },
        { id: 'rule', type: 'select', label: 'Alert rule', options: [['any reading above the limit', 'any'], ['above the limit for 8 s, cleared 2 °C lower', 'delay']], value: 'any' },
        { id: 'conn', type: 'check', label: 'Sensor is connected', value: true },
        { id: 'age', type: 'check', label: 'The dashboard shows the age of the data', value: true },
        { type: 'buttons', items: [{ id: 'clear', label: 'Reset the alert count' }] }
      ], (id) => { if (id === 'clear') fired = 0; loop.once(); });
      const ro = kit.readout(box.side, [['upd', 'Last update'], ['alert', 'Alert'], ['fired', 'Alerts raised']]);
      const sample = () => {
        const n = (R() - 0.5) * 0.4, scn = ctl.values.scn;
        if (scn === 'steady') return 24 + n;
        if (scn === 'rise') return 22 + ((T % 90) / 90) * 14 + n;
        if (scn === 'swing') return 27 + 3.2 * Math.sin(T / 9) + n;
        return 24 + n + (R() < 0.12 ? 7 : 0);
      };
      const evaluate = (v, tr) => {
        const lim = ctl.values.lim;
        if (ctl.values.rule === 'any') {
          const on = v > lim;
          if (on && !alertOn) fired++;
          alertOn = on;
        } else if (v > lim) {
          if (aboveSince == null) aboveSince = tr;
          if (tr - aboveSince >= 8 && !alertOn) { alertOn = true; fired++; }
        } else {
          aboveSince = null;
          if (v < lim - 2) alertOn = false;
        }
      };
      const loop = kit.loop((dt) => {
        const v0 = ctl.values, iv = v0.iv;
        T += dt;
        if (v0.conn) {
          let guard = 0;
          while (T >= nextReport && guard++ < 50) {
            const v = sample();
            hist.push(v); if (hist.length > 56) hist.shift();
            last = { v, t: nextReport };
            evaluate(v, nextReport);
            nextReport += iv;
          }
        } else nextReport = Math.max(nextReport, T);
        const c = st.begin(), C = kit.colors();
        const fb = G.fb(240, 160, { depth: 16 }), ui = G.ui(fb);
        const age = last ? Math.max(0, T - last.t) : null, stale = last != null && age > 2.5 * iv, grey = stale && v0.age;
        const val = last ? last.v : 20, fg = grey ? 0x808890 : alertOn ? 0xF04848 : 0xE8ECF4;
        ui.screen();
        ui.header('Greenhouse');
        ui.icon(grey ? 'wifi0' : 'wifi', 224, 5, { color: grey ? 0xF04848 : 0x30D060 });
        if (alertOn) ui.icon('bell', 208, 5, { color: 0xFFB000 });
        ui.gauge(50, 74, 34, clamp((val - 15) / 25, 0, 1), { text: kit.fmt(val, 3) + ' C', color: grey ? 0x808890 : alertOn ? 0xF04848 : 0x38A0FF });
        ui.label(100, 26, 'TEMPERATURE', { color: 0x8A96B0 });
        ui.label(100, 38, kit.fmt(val, 3) + ' C', { size: 2, color: fg });
        ui.label(100, 58, 'limit ' + kit.fmt(v0.lim, 3) + ' C', { color: 0x8A96B0 });
        if (v0.age && last) ui.label(100, 70, stale ? 'STALE ' + Math.round(age) + ' s' : 'updated ' + Math.round(age) + ' s ago', { color: stale ? 0xF04848 : 0x30D060 });
        ui.button(100, 84, 62, 16, alertOn ? 'ALERT' : 'ok', { filled: alertOn, color: alertOn ? 0xF04848 : 0x30D060 });
        ui.label(168, 88, 'x' + fired, { color: 0x8A96B0 });
        ui.chart(8, 108, 224, 46, hist.length > 1 ? hist : [20, 20], { min: 15, max: 40, color: grey ? 0x808890 : 0x38A0FF });
        const ly = Math.round(108 + 46 - 2 - clamp((v0.lim - 15) / 25, 0, 1) * 42);
        fb.hline(9, ly, 222, 0x8A3030);
        const sc = Math.max(1, Math.min(4, Math.floor(Math.min((st.W - 16) / 240, (st.H - 46) / 160))));
        const px = Math.round((st.W - 240 * sc) / 2);
        G.draw(c, fb, px, 8, sc, { style: 'tft' });
        const by = 8 + 160 * sc + 16;
        kit.label(c, v0.age ? 'The age of the data is shown, and the value greys out when reports stop.' : 'No age is shown: a silent sensor looks exactly like a healthy one.', st.W / 2, by, { size: 10.5, color: v0.age ? C.muted : C.bad, align: 'center' });
        kit.label(c, v0.rule === 'any' ? 'Rule: any reading above the limit' : 'Rule: above the limit for 8 s, cleared 2 °C lower', st.W / 2, by + 15, { size: 10.5, color: C.muted, align: 'center' });
        ro.set('upd', last ? (stale ? 'stale: ' + Math.round(age) + ' s ago' : Math.round(age) + ' s ago') : 'nothing yet');
        ro.set('alert', alertOn ? 'ACTIVE' : 'clear');
        ro.set('fired', String(fired));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ cd-shadow */
  const FLAV = {
    shadow: { app: 'App', cloud: 'Cloud shadow', dev: 'Thermostat', a: 'heating', b: 'target', unit: '°C', min: 15, max: 25, step: 2, def: 19 },
    rainmaker: { app: 'Phone app', cloud: 'RainMaker cloud', dev: 'Lamp node', a: 'power', b: 'brightness', unit: '%', min: 0, max: 100, step: 20, def: 40 }
  };

  Hyper.sim('cd-shadow', {
    title: 'Desired, reported and delta',
    blurb: `The **app** writes what it wants (*desired*) into a document in the **cloud**; the **device** applies it and writes what it is (*reported*). The difference is the **delta**. Messages travel between the three, and the device can go offline.

**Try this**
- Press an app button with the device online: desired, delta, apply, report, and the delta shrinks to nothing.
- Untick **Device is online**, press two app buttons, then tick it again: the document held the wish, and the device catches up in one step.
- Press **the device's own button**: the device disagrees with desired. Compare the two rules for who wins.
- Watch the version numbers: the device reports the version of the desired state it last applied.`,
    mount(box, kit, params) {
      const S = kit.esym, F = FLAV[params.flavour] || FLAV.shadow;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 340, maxH: 540 });
      let T = 0;
      const fresh = () => ({ desired: { on: false, lvl: F.def, v: 0 }, reported: { on: false, lvl: F.def, v: 0 }, dev: { on: false, lvl: F.def, v: 0 }, app: { on: false, lvl: F.def }, flights: [] });
      let M = fresh();
      const lvlStep = dir => clamp(M.app.lvl + dir * F.step, F.min, F.max);
      const fly = (from, to, label, dur, onArrive) => M.flights.push({ from, to, label, t0: T, dur, onArrive, done: false });
      const delta = () => { const out = []; if (M.desired.on !== M.reported.on) out.push(F.a); if (M.desired.lvl !== M.reported.lvl) out.push(F.b); return out; };
      const online = () => !!ctl.values.online;
      const deviceReport = () => {
        const rep = { on: M.dev.on, lvl: M.dev.lvl, v: M.dev.v };
        fly('dev', 'cloud', 'report v' + rep.v, 0.7, () => { M.reported = rep; afterReport(); });
      };
      const sendDelta = () => {
        const d = Object.assign({}, M.desired);
        fly('cloud', 'dev', 'delta → v' + d.v, 0.7, () => {
          if (!online()) return;
          M.dev.on = d.on; M.dev.lvl = d.lvl; M.dev.v = d.v;
          deviceReport();
        });
      };
      // the cloud has just received a report: decide what the difference means
      const afterReport = () => {
        if (!delta().length) return;
        if (ctl.values.rule === 'device') {
          M.desired = { on: M.reported.on, lvl: M.reported.lvl, v: M.desired.v + 1 };
          M.dev.v = M.desired.v; M.reported.v = M.desired.v;
          M.app.on = M.desired.on; M.app.lvl = M.desired.lvl;
        } else if (online()) sendDelta();
      };
      const appSet = () => {
        const want = { on: M.app.on, lvl: M.app.lvl };
        fly('app', 'cloud', 'set desired', 0.6, () => {
          M.desired = { on: want.on, lvl: want.lvl, v: M.desired.v + 1 };
          if (online() && delta().length) sendDelta();
        });
      };
      const ctl = kit.controls(box.side, [
        { id: 'online', type: 'check', label: 'Device is online', value: true },
        { id: 'rule', type: 'select', label: 'After a change on the device', options: [['The cloud wins: the device re-applies desired', 'cloud'], ['The device wins: desired follows it', 'device']], value: 'cloud' },
        { type: 'buttons', items: [
          { id: 'on', label: 'App: switch ' + F.a + ' on', primary: true }, { id: 'off', label: 'App: switch ' + F.a + ' off' },
          { id: 'up', label: 'App: raise ' + F.b }, { id: 'down', label: 'App: lower ' + F.b },
          { id: 'local', label: 'Press the device\'s own button' }, { id: 'reset', label: 'Start again' }] }
      ], (id, v) => {
        if (id === 'on') { M.app.on = true; appSet(); }
        else if (id === 'off') { M.app.on = false; appSet(); }
        else if (id === 'up') { M.app.lvl = lvlStep(1); appSet(); }
        else if (id === 'down') { M.app.lvl = lvlStep(-1); appSet(); }
        else if (id === 'local') { M.dev.on = !M.dev.on; if (online()) deviceReport(); }
        else if (id === 'reset') M = fresh();
        else if (id === 'online' && v) {
          const rep = { on: M.dev.on, lvl: M.dev.lvl, v: M.dev.v };
          fly('dev', 'cloud', 'hello + report', 0.7, () => { M.reported = rep; afterReport(); });
        }
        loop.start();
      });
      const ro = kit.readout(box.side, [['sync', 'The cloud document'], ['dev', 'The device'], ['ver', 'Versions']]);
      const show = s => (s.on ? 'ON ' : 'OFF ') + s.lvl + F.unit;
      const loop = kit.loop((dt) => {
        T += dt;
        for (const f of M.flights) if (!f.done && T >= f.t0 + f.dur) { f.done = true; f.onArrive(); }
        M.flights = M.flights.filter(f => !f.done);
        const c = st.begin(), C = kit.colors(), W = st.W, narrow = W < 520, fs = narrow ? 10 : 11;
        const r = clamp(W / 38, 13, 18), cx = { app: W * 0.14, cloud: W * 0.5, dev: W * 0.86 }, ny = 34, on = online();
        // links and nodes
        S.link(c, cx.app, ny, cx.cloud, ny, { gap: r + 4, width: 2, color: C.text2 });
        S.link(c, cx.cloud, ny, cx.dev, ny, { gap: r + 4, width: 2, color: on ? C.text2 : C.bad, dash: !on });
        S.node(c, cx.app, ny, { kind: 'phone', label: F.app, r });
        S.node(c, cx.cloud, ny, { kind: 'cloud', label: F.cloud, r });
        S.node(c, cx.dev, ny, { kind: 'esp', label: F.dev, r, dim: !on });
        // the documents
        const bw = { app: clamp(W * 0.27, 96, 190), cloud: clamp(W * 0.4, 150, 300), dev: clamp(W * 0.27, 96, 190) }, by = ny + r + 34, lh = fs + 6, bh = lh * 4 + 8;
        const dl = delta(), sync = dl.length === 0;
        const box3 = (k, lines, color) => {
          const x = clamp(cx[k] - bw[k] / 2, 4, W - bw[k] - 4);
          S.box(c, x, by, bw[k], bh, { color, r: 6 });
          lines.forEach((ln, i) => S.text(c, fitText(ln[0], bw[k] - 12, fs), x + 8, by + 8 + lh / 2 + i * lh, { size: fs, color: ln[1] || C.text2, align: 'left', mono: true }));
        };
        box3('app', [['asked:', C.muted], [show(M.app)], ['sees:', C.muted], [show(M.reported)]], C.border2 || C.muted);
        box3('cloud', [['desired:  ' + show(M.desired) + ' v' + M.desired.v], ['reported: ' + show(M.reported) + ' v' + M.reported.v], ['delta:    ' + (sync ? 'none' : dl.join(', ')), sync ? C.ok : C.warn], [sync ? 'in sync' : on ? 'delta on its way' : 'waiting for the device', sync ? C.ok : C.warn]], sync ? C.ok : C.warn);
        box3('dev', [['is:', C.muted], [show(M.dev)], [on ? 'online' : 'offline', on ? C.ok : C.bad], ['applied v' + M.dev.v, C.muted]], on ? C.border2 || C.muted : C.bad);
        // the thing itself
        const lx = clamp(cx.dev, 40, W - 40), ly = by + bh + 30;
        S.led(c, lx, ly, { color: params.flavour === 'rainmaker' ? 48 : 8, on: M.dev.on ? (params.flavour === 'rainmaker' ? 0.25 + 0.75 * clamp(M.dev.lvl / 100, 0, 1) : 1) : 0, r: 14, label: M.dev.on ? 'on' : 'off' });
        // messages in flight
        for (const f of M.flights) {
          const fr = clamp((T - f.t0) / f.dur, 0, 1);
          S.msg(c, cx[f.from], ny, cx[f.to], ny, fr, { label: fitText(f.label, 110, 10.5), color: C.accent, r: 5, gap: r + 4 });
        }
        kit.label(c, F.cloud.indexOf('shadow') >= 0 ? 'A shadow keeps the wish while the device is away.' : 'RainMaker keeps each parameter\'s wish and report in the cloud.', 10, st.H - 12, { size: 10, color: C.faint, align: 'left' });
        ro.set('sync', sync ? 'in sync' : 'delta: ' + dl.join(', '));
        ro.set('dev', on ? 'online, ' + show(M.dev) : 'offline, ' + show(M.dev));
        ro.set('ver', 'desired v' + M.desired.v + ', reported v' + M.reported.v + ', device v' + M.dev.v);
        if (!M.flights.length && T > 0) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ cd-outage */
  Hyper.sim('cd-outage', {
    title: 'An outage, with and without a queue',
    blurb: `A device takes one reading a minute for two hours. The link goes down for the time you choose. Each reading ends up **live** (delivered in its own minute), **late** (queued, then delivered), **lost**, or still **waiting** at the end. The curve below is the **backlog** held on the device.

**Try this**
- Leave the device on *sends and forgets* and make the outage 40 minutes: every reading in it is lost, a hole in the graph.
- Choose the **RAM queue**: it holds 20 readings, so a long outage still loses the oldest. Make the outage shorter than 20 minutes and nothing is lost.
- Tick **a brownout resets the device**: the RAM queue is wiped, the flash queue survives.
- Compare the catch-up speeds: *everything at once* is fastest, but in a real system the burst can hit rate limits.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320, maxH: 480 });
      const ctl = kit.controls(box.side, [
        { id: 'start', label: 'The link goes down at minute', min: 5, max: 90, step: 5, value: 30 },
        { id: 'len', label: 'and stays down for', min: 0, max: 90, step: 5, value: 40, unit: 'min' },
        { id: 'mode', type: 'select', label: 'The device', options: [['sends and forgets', 'none'], ['keeps a RAM queue (20 readings)', 'ram'], ['keeps a flash queue (1,000 readings)', 'flash']], value: 'none' },
        { id: 'catch', type: 'select', label: 'After the outage it sends', options: [['one extra reading a minute', 1], ['five extra a minute', 5], ['everything at once', 999]], value: 5 },
        { id: 'reset', type: 'check', label: 'A brownout resets the device mid-outage', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['live', 'Delivered live'], ['late', 'Delivered late'], ['lost', 'Lost'], ['depth', 'Largest backlog'], ['catch', 'Catch-up took']]);
      const N = 120;
      function simulate(v) {
        const s = v.start, e = Math.min(N, s + v.len), cap = v.mode === 'none' ? 0 : v.mode === 'ram' ? 20 : 1000;
        const status = new Array(N).fill('live'), depth = new Array(N).fill(0), resetAt = s + Math.floor(v.len / 2);
        let queue = [], drained = null;
        for (let m = 0; m < N; m++) {
          const up = !(m >= s && m < e);
          if (v.reset && v.len > 0 && m === resetAt && v.mode === 'ram') { for (const q of queue) status[q] = 'lost'; queue = []; }
          if (up) {
            const budget = 1 + (queue.length ? v.catch : 0);
            queue.push(m);
            let sent = 0;
            while (queue.length && sent < budget) { const q = queue.shift(); status[q] = q === m ? 'live' : 'late'; sent++; }
          } else if (cap === 0) status[m] = 'lost';
          else { queue.push(m); if (queue.length > cap) status[queue.shift()] = 'lost'; }
          depth[m] = queue.length;
          if (m >= e && drained == null && e > s && queue.length === 0 && depth.slice(s, e).some(d => d > 0)) drained = m;
        }
        for (const q of queue) status[q] = 'waiting';
        const count = k => status.filter(x => x === k).length;
        return { status, depth, live: count('live'), late: count('late'), lost: count('lost'), waiting: count('waiting'), maxDepth: Math.max(...depth), s, e, resetAt, drained, cap };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, R = simulate(v);
        const pad = 14, w = st.W - 2 * pad, cw = w / N, col = { live: C.ok, late: C.warn, lost: C.bad, waiting: C.faint };
        // the legend
        let lx = pad;
        [['live', R.live], ['late', R.late], ['lost', R.lost], ['waiting', R.waiting]].forEach(([k, n]) => {
          c.fillStyle = col[k]; c.fillRect(lx, 9, 10, 10);
          const t = k + ' ' + n;
          kit.label(c, t, lx + 14, 14, { size: 11, color: C.text2, align: 'left' });
          lx += 14 + t.length * 6.4 + 14;
        });
        // the readings
        const sy = 38, sh = 30;
        if (R.e > R.s) {
          c.fillStyle = C.dark ? 'rgba(229,72,77,.16)' : 'rgba(200,40,50,.10)';
          c.fillRect(pad + R.s * cw, sy - 8, (R.e - R.s) * cw, sh + 16 + 140);
          kit.label(c, 'link down', pad + (R.s + R.e) / 2 * cw, sy - 14, { size: 10.5, color: C.bad, align: 'center' });
        }
        R.status.forEach((k, m) => { c.fillStyle = col[k]; c.fillRect(pad + m * cw + 0.5, sy, Math.max(1, cw - 1), sh); });
        kit.label(c, 'each bar is one reading, in the minute it was taken', pad, sy + sh + 12, { size: 10, color: C.muted, align: 'left' });
        // minute scale
        for (let m = 0; m <= N; m += 30) kit.label(c, m + '', pad + m * cw, sy + sh + 26, { size: 9.5, color: C.faint, align: m === 0 ? 'left' : m === N ? 'right' : 'center' });
        // the backlog
        const qy = sy + sh + 46, qh = Math.max(60, st.H - qy - 30), top = Math.max(R.maxDepth, 10);
        const Y = d => qy + qh - d / top * qh;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(pad, qy + qh + 0.5); c.lineTo(pad + w, qy + qh + 0.5); c.stroke();
        c.beginPath(); c.moveTo(pad, qy + qh);
        R.depth.forEach((d, m) => { c.lineTo(pad + m * cw, Y(d)); c.lineTo(pad + (m + 1) * cw, Y(d)); });
        c.lineTo(pad + w, qy + qh); c.closePath();
        c.save(); c.globalAlpha = 0.25; c.fillStyle = C.accent; c.fill(); c.restore();
        c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
        R.depth.forEach((d, m) => { if (m) c.lineTo(pad + m * cw, Y(R.depth[m - 1])); else c.moveTo(pad, Y(d)); c.lineTo(pad + (m + 1) * cw, Y(d)); });
        c.stroke();
        if (R.cap > 0 && R.cap <= top * 1.5) {
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.2; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(pad, Y(Math.min(R.cap, top))); c.lineTo(pad + w, Y(Math.min(R.cap, top))); c.stroke(); c.restore();
          kit.label(c, 'queue limit ' + R.cap, pad + w, Y(Math.min(R.cap, top)) - 8, { size: 10, color: C.warn, align: 'right' });
        }
        if (v.reset && v.mode === 'ram' && v.len > 0) {
          c.save(); c.strokeStyle = C.bad; c.lineWidth = 1.4; c.beginPath(); c.moveTo(pad + R.resetAt * cw, qy); c.lineTo(pad + R.resetAt * cw, qy + qh); c.stroke(); c.restore();
          kit.label(c, 'reset', pad + R.resetAt * cw + 4, qy + 8, { size: 10, color: C.bad, align: 'left' });
        }
        kit.label(c, 'readings waiting on the device (' + top + ' at the top)', pad, qy - 8, { size: 10.5, color: C.text2, align: 'left' });
        ro.set('live', R.live + ' of ' + N);
        ro.set('late', String(R.late));
        ro.set('lost', R.lost + (R.waiting ? ' (and ' + R.waiting + ' still waiting)' : ''));
        ro.set('depth', R.maxDepth + ' readings');
        ro.set('catch', R.drained != null ? (R.drained - R.e + 1) + ' min after the link returned' : R.maxDepth > 0 ? 'not finished by minute ' + N : 'no backlog');
        void S;
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cd-identity */
  Hyper.sim('cd-identity', {
    title: 'One device is stolen: how far does it go?',
    blurb: `A fleet of devices, all talking to one cloud service. An attacker steals **one** device and reads its flash. What the attacker gets depends on what each device holds and where it is kept. Click a device (or press the button) to steal it, then **revoke** the credential and see who is cut off.

**Try this**
- With *the same secret* in *plain flash*: steal one device. The attacker can pose as every device, and revoking cuts them all off.
- Switch to *a secret of its own* and steal again: one device is compromised, one is cut off, the rest keep working.
- Keep the shared secret but choose *encrypted flash*: reading the flash gives only ciphertext. Protection raises the cost of extraction; it is not a promise.
- Choose *hardware*: the key can be used by the device but not read out, so the attacker has only the stolen unit.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 340, maxH: 540 });
      let stolen = null, revoked = false, pos = [];
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Fleet size', min: 6, max: 48, step: 6, value: 12 },
        { id: 'scheme', type: 'select', label: 'Every device holds', options: [['the same secret', 'shared'], ['a secret of its own', 'own'], ['a certificate and a private key of its own', 'cert']], value: 'shared' },
        { id: 'prot', type: 'select', label: 'The secret is kept in', options: [['plain flash', 'plain'], ['encrypted flash', 'enc'], ['hardware: usable, not readable', 'hw']], value: 'plain' },
        { type: 'buttons', items: [{ id: 'steal', label: 'Steal a device and read its flash', primary: true }, { id: 'revoke', label: 'Revoke the credential' }, { id: 'again', label: 'Start again' }] }
      ], (id) => {
        const n = ctl.values.n;
        if (id === 'steal') { stolen = Math.floor(n / 3); revoked = false; }
        else if (id === 'revoke') { if (stolen != null) revoked = true; }
        else if (id === 'again' || id === 'n') { stolen = null; revoked = false; }
        else if (id === 'scheme' || id === 'prot') revoked = false;
        loop.once();
      });
      const ro = kit.readout(box.side, [['imp', 'The attacker can pose as'], ['cut', 'Cut off by revoking'], ['ok', 'Still working after revoking'], ['why', 'Why']]);
      const analyse = () => {
        const v = ctl.values, n = v.n, all = Array.from({ length: n }, (_, i) => i);
        if (stolen == null || stolen >= n) return { imp: [], cut: [], extracted: false, why: 'Nothing stolen yet: click a device.' };
        const extracted = v.prot === 'plain';
        const imp = extracted && v.scheme === 'shared' ? all : [stolen];
        const cut = v.scheme === 'shared' ? all : [stolen];
        let why;
        if (extracted) why = v.scheme === 'shared' ? 'The one secret is copied out of one flash: it works for every device, and the only cure disconnects them all.' : 'The secret of one device was copied. It is useless for the others and can be revoked alone.';
        else if (v.prot === 'enc') why = 'Reading the flash gives only ciphertext. The attacker holds one working device, no more, unless a deeper attack succeeds.';
        else why = 'The key can sign but not be read, so it cannot be copied. The attacker holds one device, and you can revoke it.';
        if (!extracted && v.scheme === 'shared') why += ' A shared secret is still a single point of failure if it ever leaks.';
        return { imp, cut, extracted, why };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, n = v.n, A = analyse();
        const topH = 70, aw = st.W, ah = st.H - topH - 30, cols = clamp(Math.round(Math.sqrt(n * aw / Math.max(60, ah))), 3, n), rows = Math.ceil(n / cols);
        const cwid = aw / cols, chei = ah / rows, r = clamp(Math.min(cwid, chei) * 0.27, 6, 15);
        pos = [];
        for (let i = 0; i < n; i++) pos.push([cwid * (i % cols + 0.5), topH + chei * (Math.floor(i / cols) + 0.42)]);
        const cutSet = new Set(revoked ? A.cut : []), impSet = new Set(revoked ? [] : A.imp);
        // the cloud and the attacker
        S.node(c, st.W * 0.3, 26, { kind: 'cloud', label: 'cloud service', r: 17 });
        S.node(c, st.W * 0.78, 26, { kind: 'user', label: 'attacker', r: 15, color: 356, dim: stolen == null });
        if (stolen != null && stolen < n) for (const i of impSet) {
          c.save(); c.strokeStyle = C.bad; c.globalAlpha = 0.55; c.lineWidth = 1; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(st.W * 0.78, 42); c.lineTo(pos[i][0], pos[i][1] - r); c.stroke(); c.restore();
        }
        for (let i = 0; i < n; i++) {
          const isCut = cutSet.has(i), isImp = impSet.has(i);
          S.node(c, pos[i][0], pos[i][1], { kind: 'esp', r, color: isImp ? 356 : 205, dim: isCut, active: i === stolen });
          if (i === stolen) kit.label(c, 'stolen', pos[i][0], pos[i][1] + r + 11, { size: 9.5, color: C.bad, align: 'center', weight: 650 });
          else if (isCut) kit.label(c, '×', pos[i][0], pos[i][1], { size: 14, color: C.bad, align: 'center', weight: 700 });
        }
        [['working', kit.hue(205)], ['attacker can pose as it', kit.hue(356)], ['refused by the cloud', C.faint]].reduce((x, [t, colr]) => {
          c.fillStyle = colr; c.fillRect(x, st.H - 20, 10, 10); kit.label(c, t, x + 14, st.H - 15, { size: 10.5, color: C.text2, align: 'left' });
          return x + 14 + t.length * 6 + 16;
        }, 10);
        ro.set('imp', stolen == null ? 'nothing stolen yet' : revoked ? '0 (revoked)' : A.imp.length + ' of ' + n);
        ro.set('cut', stolen == null ? '—' : A.cut.length + ' of ' + n);
        ro.set('ok', stolen == null ? n + ' of ' + n : revoked ? (n - A.cut.length) + ' of ' + n : 'not revoked yet: ' + n + ' of ' + n);
        ro.set('why', A.why);
      }, box.stage);
      kit.click(st, p => {
        let best = -1, bd = 1e9;
        pos.forEach((q, i) => { const d = Math.hypot(q[0] - p.x, q[1] - p.y); if (d < bd) { bd = d; best = i; } });
        if (best >= 0 && bd < 30) { stolen = best; revoked = false; loop.once(); }
      }, p => pos.some(q => Math.hypot(q[0] - p.x, q[1] - p.y) < 30));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cd-rate */
  const fmtDays = d => !Number.isFinite(d) ? 'very long' : d >= 730 ? (Math.round(d / 36.525) / 10) + ' years' : d >= 60 ? Math.round(d) + ' days' : (Math.round(d * 10) / 10) + ' days';
  const fmtAge = s => s < 90 ? Math.round(s) + ' s' : s < 5400 ? Math.round(s / 60) + ' min' : (Math.round(s / 360) / 10) + ' h';

  Hyper.sim('cd-rate', {
    title: 'Reporting interval, batching and battery life',
    blurb: `A battery device sleeps, wakes to take readings, and sends a message after every **b** readings. The model is schematic but its numbers are honest: the chip's receive and transmit currents and its sleep current come from the chip catalogue (the radio phase runs at the receive current with a tenth of the time at the transmit current), the battery from the cell list, and each reading outside the radio phase costs a 0.3 s wake at 30 mA. The two curves show how **battery life** and **traffic** change with the batch size at your other settings; the dot is where you are.

**Try this**
- Leave one reading per message and read the battery life; now raise the batch to 6 or 12. The radio wakes far less often, and the curve climbs steeply at first.
- Set the reading interval to 10 s with batch 1: the device is awake for a third of its life and the battery life collapses.
- Tick **a new TLS connection for every message**: traffic grows by kilobytes per message, and batching pays even more.
- Compare **Oldest reading at the receiver** with the gain: batching buys energy with delay.`,
    mount(box, kit) {
      const E = kit.esp;
      const chipIds = ['esp32', 'esp32-c3', 'esp32-s3', 'esp32-c6'].filter(id => E.chip(id));
      const cells = E.CELLS.filter(c => c.id !== 'cr2032');
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 400, maxH: 640 });
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Time between readings', min: 10, max: 3600, value: 300, unit: 's', log: true },
        { id: 'b', label: 'Readings per message', min: 1, max: 60, step: 1, value: 1 },
        { id: 'r', label: 'Bytes per reading', min: 4, max: 100, step: 2, value: 12, unit: 'B' },
        { id: 'awake', label: 'Awake to connect and send', min: 0.5, max: 8, step: 0.5, value: 3, unit: 's' },
        { id: 'tls', type: 'check', label: 'A new TLS connection for every message', value: false },
        { id: 'chip', type: 'select', label: 'Chip', options: chipIds.map(id => [E.chip(id).name, id]), value: chipIds.indexOf('esp32-c3') >= 0 ? 'esp32-c3' : chipIds[0] },
        { id: 'cell', type: 'select', label: 'Battery', options: cells.map(c => [c.name, c.id]), value: cells[1] ? cells[1].id : cells[0].id }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['msgs', 'Messages a month'], ['traffic', 'Traffic a month'], ['units', 'Billing units (5 KB blocks)'], ['age', 'Oldest reading at the receiver'], ['cur', 'Average current'], ['life', 'Battery life'], ['gain', 'Against one reading per message']]);
      const calc = (v, b) => {
        const c = E.chip(v.chip), cell = cells.find(x => x.id === v.cell) || cells[0];
        const rx = c.rxMa || 90, tx = c.txMa || 300, sleep = (c.sleepUa != null ? c.sleepUa : 10) / 1000 + 0.02;
        const Irad = rx + (tx - rx) * 0.1, tS = 0.3, IS = 30, tR = v.awake;
        const P = b * v.T, awakeT = tR + (b - 1) * tS, sleepT = Math.max(0, P - awakeT), period = Math.max(P, awakeT);
        const charge = Irad * tR + (b - 1) * IS * tS + sleep * sleepT;
        const Iavg = charge / period, life = E.batteryLife(cell.mAh, Iavg, { cell: cell.id });
        const N = 2592000 / period, hdr = 160 + (v.tls ? 4500 : 0);
        return { Iavg, days: life.days, N, D: N * (b * v.r + hdr) / 1e6, units: N * Math.max(1, Math.ceil(b * v.r / 5120)), age: (b - 1) * v.T };
      };
      const curve = (c, C, x, y, w, h, vals, cur, title, fmt, color) => {
        const fin = vals.filter(Number.isFinite), mx = (fin.length ? Math.max(...fin) : 1) * 1.1 || 1;
        const X = b => x + Math.log(b) / Math.log(60) * w, Y = val => y + h - clamp(val, 0, mx) / mx * h;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + h); c.lineTo(x + w, y + h); c.stroke();
        kit.label(c, title, x, y - 10, { size: 11, color: C.text2, align: 'left', weight: 600 });
        [1, 2, 5, 10, 20, 60].forEach(b => kit.label(c, String(b), X(b), y + h + 11, { size: 9.5, color: C.faint, align: 'center' }));
        kit.label(c, 'readings per message', x + w, y + h + 24, { size: 9.5, color: C.faint, align: 'right' });
        c.strokeStyle = color; c.lineWidth = 2; c.beginPath();
        vals.forEach((val, i) => { const px = X(i + 1), py = Y(Number.isFinite(val) ? val : mx); if (i) c.lineTo(px, py); else c.moveTo(px, py); });
        c.stroke();
        const cv = vals[cur - 1];
        kit.dot(c, X(cur), Y(Number.isFinite(cv) ? cv : mx), 5, color);
        kit.label(c, fmt(cv), clamp(X(cur), x + 40, x + w - 40), Y(Number.isFinite(cv) ? cv : mx) - 12, { size: 10.5, color: C.text, align: 'center', weight: 650 });
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, b = Math.round(v.b);
        const all = []; for (let k = 1; k <= 60; k++) all.push(calc(v, k));
        const cur = all[b - 1], one = all[0];
        const pl = 12, w = st.W - pl - 14, ph = Math.max(60, (st.H - 100) / 2);
        curve(c, C, pl, 30, w, ph, all.map(a => a.days), b, 'Battery life', fmtDays, C.accent);
        curve(c, C, pl, 30 + ph + 56, w, ph, all.map(a => a.D), b, 'Traffic per month, in megabytes', d => kit.fmt(d, 3) + ' MB', C.warn);
        ro.set('msgs', fmtN(cur.N));
        ro.set('traffic', kit.fmt(cur.D, 3) + ' MB');
        ro.set('units', fmtN(cur.units));
        ro.set('age', b === 1 ? 'none: sent at once' : 'up to ' + fmtAge(cur.age));
        ro.set('cur', kit.fmt(cur.Iavg * 1000, 3) + ' µA');
        ro.set('life', fmtDays(cur.days));
        ro.set('gain', b === 1 ? 'the baseline' : '× ' + kit.fmt(cur.days / one.days, 3) + ' battery life, × ' + kit.fmt(one.D / cur.D, 3) + ' less traffic');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cd-privacy */
  const DAY = 86400, hm = (h, m) => (h * 60 + m) * 60;
  const EVENTS = [
    { name: 'Kettle', t0: hm(7, 5), dur: 150, peak: 2000, hue: 24, shape: () => 2000 },
    { name: 'Toaster', t0: hm(7, 12), dur: 120, peak: 900, hue: 44, shape: () => 900 },
    { name: 'Washing machine', t0: hm(8, 0), dur: 5400, peak: 2000, hue: 205, shape: s => (s < 720 || (s >= 3600 && s < 4080)) ? 2000 : 250 },
    { name: 'Nobody at home', t0: hm(9, 30), dur: 27000, peak: 0, hue: 130, away: true },
    { name: 'Fridge cycle', t0: hm(12, 10), dur: 1080, peak: 140, hue: 175, bg: true, shape: () => 140 },
    { name: 'Oven', t0: hm(18, 15), dur: 2400, peak: 2400, hue: 8, shape: s => (s % 360) < 240 ? 2400 : 40 },
    { name: 'Television', t0: hm(19, 0), dur: 12600, peak: 110, hue: 285, shape: () => 110 }
  ];
  const TRACE = (() => {
    const r = rng(5), a = new Float64Array(DAY);
    let drift = 0;
    for (let s = 0; s < DAY; s++) { drift = drift * 0.95 + (r() - 0.5) * 3; a[s] = 65 + drift; if (s >= hm(17, 30) && s < hm(23, 30)) a[s] += 90; }
    for (let m = 30; m < 1440; m += 50) for (let s = m * 60; s < Math.min(DAY, (m + 18) * 60); s++) a[s] += 140;      // the fridge: 18 minutes in every 50
    EVENTS.forEach(e => { if (e.bg || e.away) return; for (let s = e.t0; s < Math.min(DAY, e.t0 + e.dur); s++) a[s] += e.shape(s - e.t0); });
    return a;
  })();
  const PREFIX = (() => { const p = new Float64Array(DAY + 1); for (let i = 0; i < DAY; i++) p[i + 1] = p[i] + TRACE[i]; return p; })();
  const winMean = (k, res) => { const a = k * res, b = Math.min(DAY, (k + 1) * res); return b > a ? (PREFIX[b] - PREFIX[a]) / (b - a) : 0; };
  // each event on its own, as a running sum, so that a window average can be asked what the event alone contributes
  const OWN = EVENTS.map(e => {
    const p = new Float64Array(DAY + 1);
    for (let i = 0; i < DAY; i++) p[i + 1] = p[i] + (!e.away && i >= e.t0 && i < e.t0 + e.dur ? e.shape(i - e.t0) : 0);
    return p;
  });
  // an event is readable when, in some window, its own average power is at least half of its peak: it still stands out
  function readable(e, res) {
    if (e.away) return true;
    const p = OWN[EVENTS.indexOf(e)];
    let mx = 0;
    const k0 = Math.floor(e.t0 / res), k1 = Math.floor((Math.min(DAY, e.t0 + e.dur) - 1) / res);
    for (let k = k0; k <= k1; k++) { const a = k * res, b = Math.min(DAY, (k + 1) * res); if (b > a) mx = Math.max(mx, (p[b] - p[a]) / (b - a)); }
    return mx >= 0.5 * e.peak;
  }
  const hhmm = s => { const m = Math.floor(s / 60) % 1440; return (m < 600 ? '0' : '') + Math.floor(m / 60) + ':' + (m % 60 < 10 ? '0' : '') + (m % 60); };
  const LEARN = { 1: 'every appliance, second by second: what you cook, wash and watch', 10: 'every switch-on: the kettle, the toaster, the oven', 60: 'most appliances, and the daily routine', 900: 'only the big loads, but still when the home is active or empty', 3600: 'only the daily routine: when the house is awake, empty or asleep' };

  Hyper.sim('cd-privacy', {
    title: 'What a power meter can tell about a day at home',
    blurb: `One synthetic day of household power, measured every second and then **averaged over the window you choose**, as a meter that reports less often would. The shaded bands are real events of the day. A band is **solid** if the averaged data still shows it (it stands out by at least half of its power) and **dashed** if it has vanished into the average. This is a model with made-up appliances, but the effect is the real one.

**Try this**
- At **1 second** look at the morning: the kettle and the toaster are rectangles you could name. At **15 minutes** they are a smear.
- Go to **1 hour**: the kettle, the toaster and the oven are gone, yet the television evening, the empty house and the sleeping house are still plain. Coarse data is not private data.
- Read **Data a day**: the 1-second record is 86,400 values, the hourly one 24.
- Switch the view between the whole day and the evening to see which events survive.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.92, minH: 420, maxH: 660 });
      const ctl = kit.controls(box.side, [
        { id: 'res', type: 'select', label: 'The meter reports every', options: [['1 second', 1], ['10 seconds', 10], ['1 minute', 60], ['15 minutes', 900], ['1 hour', 3600]], value: 1 },
        { id: 'view', type: 'select', label: 'Look at', options: [['the whole day', 'day'], ['the morning, 06:30 to 09:30', 'morning'], ['the evening, 17:30 to 23:00', 'evening']], value: 'morning' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['n', 'Readings a day'], ['kb', 'Data a day'], ['vis', 'Events still readable'], ['learn', 'An observer learns']]);
      const VIEWS = { day: [0, DAY], morning: [hm(6, 30), hm(9, 30)], evening: [hm(17, 30), hm(23, 0)] };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), res = ctl.values.res, [a, b] = VIEWS[ctl.values.view];
        const pl = 40, pr = 12, pt = 24, w = st.W - pl - pr, listRows = EVENTS.length, lh = 17, listH = listRows * lh + 8, h = Math.max(110, st.H - pt - 36 - listH - 24), top = 2600;
        const X = s => pl + (s - a) / (b - a) * w, Y = val => pt + h - clamp(val, 0, top) / top * h;
        const flags = EVENTS.map(e => readable(e, res));
        // grid
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let val = 0; val <= 2500; val += 500) { const y = Math.round(Y(val)) + 0.5; c.beginPath(); c.moveTo(pl, y); c.lineTo(pl + w, y); c.stroke(); kit.label(c, val + ' W', pl - 5, y, { size: 9.5, color: C.faint, align: 'right' }); }
        const span = b - a, tick = span > 40000 ? 4 * 3600 : span > 12000 ? 3600 : 1800;
        for (let s = Math.ceil(a / tick) * tick; s <= b; s += tick) kit.label(c, hhmm(s), X(s), pt + h + 12, { size: 9.5, color: C.faint, align: 'center' });
        // the events as bands
        EVENTS.forEach((e, i) => {
          const x0 = X(Math.max(a, e.t0)), x1 = X(Math.min(b, e.t0 + e.dur));
          if (x1 <= x0) return;
          const colr = kit.hue(e.hue, flags[i] ? 0.28 : 0.0);
          if (flags[i]) { c.fillStyle = colr; c.fillRect(x0, e.away ? pt : pt + 4, x1 - x0, e.away ? h : h - 4); }
          c.save(); c.strokeStyle = kit.hue(e.hue); c.lineWidth = 1.3; if (!flags[i]) c.setLineDash([3, 3]); c.strokeRect(x0 + 0.5, (e.away ? pt : pt + 4) + 0.5, Math.max(1, x1 - x0 - 1), (e.away ? h : h - 4) - 1); c.restore();
        });
        // the averaged trace
        const pix = (b - a) / w;
        const val = px => {
          const s0 = a + px * pix, s1 = s0 + pix;
          if (res <= pix) { const i0 = clamp(Math.floor(s0), 0, DAY - 1), i1 = clamp(Math.ceil(s1), i0 + 1, DAY); return (PREFIX[i1] - PREFIX[i0]) / (i1 - i0); }
          return winMean(clamp(Math.floor(s0 / res), 0, Math.ceil(DAY / res) - 1), res);
        };
        c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
        for (let px = 0; px < w; px++) { const y = Y(val(px)); if (px) c.lineTo(pl + px, y); else c.moveTo(pl + px, y); }
        c.stroke();
        kit.label(c, 'power, averaged over ' + (res >= 3600 ? '1 hour' : res >= 60 ? (res / 60) + ' min' : res + ' s') + ' windows', pl, 10, { size: 10.5, color: C.text2, align: 'left' });
        // the list
        const ly = pt + h + 26;
        EVENTS.forEach((e, i) => {
          const y = ly + i * lh + 8;
          c.fillStyle = kit.hue(e.hue); c.fillRect(10, y - 5, 10, 10);
          const t = e.name + ' · ' + hhmm(e.t0) + (e.dur >= 3600 ? '–' + hhmm(e.t0 + e.dur) : '');
          kit.label(c, fitText(t, st.W * 0.6, 11), 26, y, { size: 11, color: C.text2, align: 'left' });
          kit.label(c, flags[i] ? 'readable' : 'lost in the average', st.W - 12, y, { size: 10.5, color: flags[i] ? C.warn : C.ok, align: 'right', weight: 600 });
        });
        const nvis = flags.filter(Boolean).length, readings = DAY / res;
        ro.set('n', fmtN(readings));
        ro.set('kb', kit.fmt(readings * 4 / 1000, 3) + ' kB (4 bytes each)');
        ro.set('vis', nvis + ' of ' + EVENTS.length);
        ro.set('learn', LEARN[res] || '');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
