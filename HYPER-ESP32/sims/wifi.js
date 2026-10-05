/* HYPER-ESP32 · sims/wifi.js
 *
 * Simulations of the topic "wifi" (ids wf-*).
 *
 *   wf-band        the 2.4 GHz band: channels as overlapping humps, why 1, 6 and 11; params { scan: true } adds a scan list
 *   wf-join        joining a network as messages between station and access point, the status at each step, and what faults do
 *   wf-range       signal strength against distance and walls, with the rate falling; params { lr: true }
 *   wf-sense       the RSSI of a link while a person walks across it
 *   wf-modes       station, soft access point and both, as a network picture
 *   wf-portal      a captive portal as a conversation; params { flow: 'provision' }
 *   wf-dhcp-dns    DHCP, DNS and mDNS as conversations; params { conv: 'dhcp' | 'dns' | 'mdns' }
 *   wf-reconnect   reconnection with back-off after the router disappears, as a state machine
 *   wf-beacon      beacons, DTIM and target wake time: when the radio wakes to listen; params { scheme: 'twt' }
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------------------------------------------------------------- a sequence of messages between actors
     actors: [{ kind, label, sub, x (0…1), color, dim }]; rows: [{ from, to, label, phase, kind: 'ok' | 'warn' | 'fail' | 'lost', color }]
     shown = rows completed, prog = progress (0…1) of the next one. -> { y0, rowH, xs } */
  function seqDraw(c, C, kit, S, st, actors, rows, shown, prog, o) {
    o = o || {};
    const nodeR = clamp(st.W / 32, 12, 18), top = 12 + nodeR, y0 = top + nodeR + 42, n = actors.length, left = o.left == null ? 0.2 : o.left;
    const xs = actors.map((a, i) => st.W * (a.x != null ? a.x : left + (0.9 - left) * (n === 1 ? 0.5 : i / (n - 1))));
    const rowH = clamp((st.H - y0 - (o.bottom || 10)) / Math.max(1, rows.length), 15, o.rowH || 32);
    actors.forEach((a, i) => {
      S.node(c, xs[i], top, { kind: a.kind, label: a.label, sub: a.sub, r: nodeR, color: a.color, dim: !!a.dim });
      c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 5]);
      c.beginPath(); c.moveTo(xs[i], y0 - 14); c.lineTo(xs[i], y0 + rows.length * rowH); c.stroke(); c.restore();
    });
    let phase = null;
    rows.forEach((r, k) => {
      const yTop = y0 + k * rowH, y = yTop + rowH / 2;
      if (k > shown) return;
      if (r.phase && r.phase !== phase) {
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(6, yTop + 0.5); c.lineTo(st.W - 6, yTop + 0.5); c.stroke(); c.restore();
        kit.label(c, r.phase, 8, yTop + 9, { size: 10, color: C.muted, weight: 650 });
      }
      phase = r.phase || phase;
      if (k === shown - 1) { c.save(); c.globalAlpha = 0.07; c.fillStyle = C.accent; c.fillRect(0, yTop, st.W, rowH); c.restore(); }
      const xa = xs[r.from], xb = xs[r.to], dir = xb >= xa ? 1 : -1;
      const col = r.kind === 'fail' ? C.bad : r.kind === 'warn' ? C.warn : r.color === 'faint' ? C.faint : (r.color || C.text2);
      const f = k < shown ? 1 : clamp(prog, 0, 1), x2 = r.kind === 'lost' ? xa + (xb - xa) * 0.62 : xb, xe = xa + (x2 - xa) * f;
      c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 1.8;
      c.beginPath(); c.moveTo(xa, y); c.lineTo(xe, y); c.stroke();
      if (f >= 1) {
        if (r.kind === 'lost') { c.lineWidth = 2.2; c.beginPath(); c.moveTo(x2 - 5, y - 5); c.lineTo(x2 + 5, y + 5); c.moveTo(x2 + 5, y - 5); c.lineTo(x2 - 5, y + 5); c.stroke(); }
        else { c.beginPath(); c.moveTo(x2, y); c.lineTo(x2 - dir * 9, y - 4.5); c.lineTo(x2 - dir * 9, y + 4.5); c.closePath(); c.fill(); }
      }
      c.restore();
      if (f < 1) S.msg(c, xa, y, x2, y, f, { color: col, r: 4 });
      kit.label(c, r.label, (xa + x2) / 2, y - 7, { size: 10.5, color: r.kind === 'fail' ? C.bad : C.text, bg: C.dark ? 'rgba(13,16,32,.78)' : 'rgba(255,255,255,.82)' });
    });
    return { y0, rowH, xs };
  }

  /* a rounded banner of text */
  function banner(c, C, kit, st, y, text, color) {
    c.save(); c.fillStyle = color; c.globalAlpha = 0.14; const w = Math.min(st.W - 20, 30 + text.length * 6.3);
    c.fillRect((st.W - w) / 2, y - 12, w, 24); c.globalAlpha = 1; c.strokeStyle = color; c.lineWidth = 1.2; c.strokeRect((st.W - w) / 2 + 0.5, y - 11.5, w - 1, 23); c.restore();
    kit.label(c, text, st.W / 2, y, { size: 11.5, color: color, weight: 650, align: 'center' });
  }

  /* ================================================================ wf-band */
  const SCENES = {
    quiet: [{ ssid: 'cafe-guest', ch: 11, rssi: -78, sec: 'WPA2' }],
    block: [{ ssid: 'Neighbour-A', ch: 6, rssi: -52, sec: 'WPA2/WPA3' }, { ssid: 'Neighbour-B', ch: 1, rssi: -66, sec: 'WPA2' }, { ssid: 'Printer-3A', ch: 6, rssi: -74, sec: 'WPA2' },
      { ssid: 'Guest-22', ch: 11, rssi: -70, sec: 'WPA2' }, { ssid: 'Router-4F', ch: 4, rssi: -80, sec: 'WPA2' }],
    crowded: [{ ssid: 'Flat-1', ch: 1, rssi: -58, sec: 'WPA2' }, { ssid: 'Flat-2', ch: 1, rssi: -72, sec: 'WPA2' }, { ssid: 'Flat-3', ch: 2, rssi: -76, sec: 'WPA2' }, { ssid: 'Flat-4', ch: 3, rssi: -64, sec: 'WPA2' },
      { ssid: 'Flat-5', ch: 6, rssi: -50, sec: 'WPA2/WPA3' }, { ssid: 'Flat-6', ch: 6, rssi: -69, sec: 'WPA2' }, { ssid: 'Flat-7', ch: 6, rssi: -77, sec: 'WPA' }, { ssid: 'Flat-8', ch: 8, rssi: -61, sec: 'WPA2' },
      { ssid: 'Flat-9', ch: 9, rssi: -73, sec: 'WPA2' }, { ssid: 'Flat-10', ch: 11, rssi: -66, sec: 'WPA2' }, { ssid: 'Flat-11', ch: 11, rssi: -79, sec: 'open' }, { ssid: 'Hotspot', ch: 13, rssi: -82, sec: 'WPA2' }]
  };

  Hyper.sim('wf-band', {
    title: 'The 2.4 GHz band and its channels',
    blurb: `Each hump is one network, drawn where its signal sits in the band: **taller means stronger**. Your router is the accent-coloured hump; neighbours that **overlap** it are amber, and those on **the same channel** are red. The band is only 83 MHz wide and a signal is 20 MHz wide, so there is room for just three clear channels: 1, 6 and 11.

**Try this**
- Set your channel to **3** in the block of flats: you now overlap networks on 1, 4 and 6 at once.
- Press **Move to the quietest channel** in each neighbourhood. It weighs every neighbour by its signal, so a strong one counts for more than three faint ones.
- Switch to **40 MHz**: the hump doubles and the room for others vanishes. This is why 40 MHz is a poor idea on a crowded 2.4 GHz band.
- Click a channel number on the axis to move your router there.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym, scan = !!params.scan;
      const st = kit.stage(box.stage, { aspect: scan ? 0.84 : 0.58, minH: scan ? 450 : 300, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'scene', type: 'select', label: 'Neighbourhood', options: [['A quiet street', 'quiet'], ['A block of flats', 'block'], ['A crowded building', 'crowded']], value: scan ? 'crowded' : 'block' },
        { id: 'ch', label: 'My router\'s channel', min: 1, max: 13, step: 1, value: 6 },
        { id: 'bw', type: 'select', label: 'Channel width', options: [['20 MHz', 20], ['40 MHz', 40]], value: 20 },
        { type: 'buttons', items: [{ id: 'best', label: 'Move to the quietest channel', primary: true }] }
      ], (id) => {
        if (id === 'best') ctl.set('ch', best().ch, false);
        loop.once();
      });
      const ro = kit.readout(box.side, [['freq', 'My channel'], ['ov', 'Overlapping'], ['inter', 'Interference heard'], ['best', 'Quietest channel']]);
      const MY_RSSI = -45, F0 = 2399, F1 = 2487;
      const centre = (ch, bw) => E.wifiChannel(ch) + (bw === 40 ? 10 : 0);
      const overlapFrac = (cMy, bw, nch) => { const fn = E.wifiChannel(nch); return Math.max(0, Math.min(cMy + bw / 2, fn + 10) - Math.max(cMy - bw / 2, fn - 10)) / 20; };
      const interference = (ch, bw) => SCENES[ctl.values.scene].reduce((s, n) => s + E.dBmToMw(n.rssi) * overlapFrac(centre(ch, bw), bw, n.ch), 0);
      function best() {
        const bw = ctl.values.bw, order = [1, 6, 11, 2, 3, 4, 5, 7, 8, 9, 10, 12, 13].filter(ch => ch <= (bw === 40 ? 9 : 13));
        let b = null;
        for (const ch of order) { const s = interference(ch, bw); if (!b || s < b.s * 0.999) b = { ch, s }; }
        return b;
      }
      let geo = { x0: 40, x1: 100, yb: 100 };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), net = SCENES[ctl.values.scene], my = ctl.values.ch, bw = ctl.values.bw;
        const cMy = centre(my, bw);
        const x0 = 14, x1 = st.W - 14, yTop = 40, yb = scan ? Math.round(st.H * 0.5) : st.H - 50;
        geo = { x0, x1, yb };
        const X = f => x0 + (f - F0) / (F1 - F0) * (x1 - x0), Hh = r => (yb - yTop) * clamp((r + 95) / 62, 0.06, 1);
        const hump = (cm, wMHz, h, color, a, lw) => {
          const hw = wMHz / 2;
          c.beginPath(); c.moveTo(X(cm - hw - 2), yb); c.lineTo(X(cm - hw + 1), yb - h); c.lineTo(X(cm + hw - 1), yb - h); c.lineTo(X(cm + hw + 2), yb);
          c.save(); c.globalAlpha = a; c.fillStyle = color; c.fill(); c.restore();
          c.strokeStyle = color; c.lineWidth = lw; c.stroke();
        };
        // legend
        [['my router', C.accent], ['overlaps mine', C.warn], ['same channel', C.bad], ['clear of mine', C.muted]].forEach(([t, col], i) => {
          const lx = 14 + i * Math.min(120, (st.W - 28) / 4);
          c.fillStyle = col; c.fillRect(lx, 14, 10, 10); kit.label(c, t, lx + 15, 19, { size: 10.5, color: C.text2 });
        });
        // neighbours first, mine on top
        const rows = [];
        net.forEach(n => {
          const frac = overlapFrac(cMy, bw, n.ch), same = n.ch === my && bw === 20 || (bw === 40 && n.ch >= my && n.ch <= my + 4), kind = same ? 'same' : frac > 0 ? 'over' : 'clear';
          rows.push(Object.assign({ kind, frac }, n));
          const col = kind === 'same' ? C.bad : kind === 'over' ? C.warn : C.muted, h = Hh(n.rssi);
          hump(E.wifiChannel(n.ch), 20, h, col, 0.2, 1.4);
          kit.label(c, n.ssid, X(E.wifiChannel(n.ch)), yb - h - 7, { size: 9.5, color: C.text2, align: 'center' });
        });
        hump(cMy, bw, Hh(MY_RSSI), C.accent, 0.3, 2.4);
        kit.label(c, 'my router · channel ' + my + (bw === 40 ? ' + 40 MHz' : ''), X(cMy), yb - Hh(MY_RSSI) - 8, { size: 11, color: C.accent, weight: 650, align: 'center' });
        // the axis: channel centres, 1, 6 and 11 marked
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yb + 0.5); c.lineTo(x1, yb + 0.5); c.stroke();
        const counts = new Array(14).fill(0); net.forEach(n => counts[n.ch]++); counts[my]++;
        for (let ch = 1; ch <= 13; ch++) {
          const xx = X(E.wifiChannel(ch)), clear = E.WIFI_CLEAR.includes(ch);
          c.strokeStyle = clear ? C.accent : C.faint; c.lineWidth = clear ? 1.5 : 1;
          c.beginPath(); c.moveTo(xx, yb); c.lineTo(xx, yb + (clear ? 8 : 5)); c.stroke();
          kit.label(c, String(ch), xx, yb + 16, { size: clear ? 12 : 10.5, weight: clear ? 700 : 400, color: ch === my ? C.accent : clear ? C.text : C.muted, align: 'center' });
          if (clear) kit.label(c, E.wifiChannel(ch) + '', xx, yb + 30, { size: 9.5, color: C.faint, align: 'center' });
          if (scan) kit.label(c, String(counts[ch]), xx, yb + (clear ? 43 : 31), { size: 9.5, color: counts[ch] ? C.text2 : C.faint, align: 'center' });
        }
        kit.label(c, 'channel number · centre frequency in MHz' + (scan ? ' · networks heard' : ''), x0, yb + (scan ? 56 : 46), { size: 9.5, color: C.faint, align: 'left' });
        // the scan list
        if (scan) {
          const ty = yb + 74, rh = 15, room = Math.floor((st.H - ty - 8) / rh) - 1;
          kit.label(c, 'what a scan prints', x0, ty, { size: 10.5, color: C.muted, weight: 650 });
          const list = [{ ssid: 'my router', ch: my, rssi: MY_RSSI, sec: 'WPA2', mine: true }].concat(net).sort((a, b) => b.rssi - a.rssi);
          const cols = [x0, x0 + st.W * 0.3, x0 + st.W * 0.4, x0 + st.W * 0.5, x0 + st.W * 0.65];
          ['SSID', 'ch', 'signal', 'RSSI', 'security'].forEach((t, i) => kit.label(c, t, cols[i], ty + rh, { size: 9.5, color: C.faint, align: 'left' }));
          list.slice(0, Math.max(1, room - 1)).forEach((n, i) => {
            const yy = ty + rh * (i + 2);
            const col = n.mine ? C.accent : C.text;
            kit.label(c, n.ssid, cols[0], yy, { size: 10.5, color: col, align: 'left' });
            kit.label(c, String(n.ch), cols[1], yy, { size: 10.5, color: col, align: 'left' });
            S.bars(c, cols[2], yy - 6, n.rssi, { w: 22, h: 11, label: false });
            kit.label(c, n.rssi + ' dBm', cols[3], yy, { size: 10.5, color: col, align: 'left' });
            kit.label(c, n.sec, cols[4], yy, { size: 10.5, color: n.sec === 'open' ? C.bad : col, align: 'left' });
          });
          if (list.length > room - 1) kit.label(c, '+ ' + (list.length - (room - 1)) + ' more', cols[0], ty + rh * (room + 1), { size: 10, color: C.faint, align: 'left' });
        }
        // numbers
        const near = rows.filter(r => r.kind !== 'clear'), same = rows.filter(r => r.kind === 'same'), I = interference(my, bw), b = best();
        ro.set('freq', 'channel ' + my + ' · ' + cMy + ' MHz · ' + (cMy - bw / 2) + '–' + (cMy + bw / 2) + ' MHz');
        ro.set('ov', near.length ? near.length + ' of ' + net.length + ' networks (' + same.length + ' on the same channel)' : 'none: a clear channel');
        ro.set('inter', I > 0 ? kit.fmt(E.mwToDbm(I), 3) + ' dBm' : 'nothing heard');
        ro.set('best', 'channel ' + b.ch + (b.ch === my ? ' (you are on it)' : '') + ' · ' + (b.s > 0 ? kit.fmt(E.mwToDbm(b.s), 3) + ' dBm' : 'nothing heard'));
      }, box.stage);
      kit.click(st, p => {
        if (p.y < geo.yb - 4 || p.y > geo.yb + 34) return;
        let bestCh = 1, bd = 1e9;
        for (let ch = 1; ch <= 13; ch++) { const xx = geo.x0 + (E.wifiChannel(ch) - F0) / (F1 - F0) * (geo.x1 - geo.x0), d = Math.abs(xx - p.x); if (d < bd) { bd = d; bestCh = ch; } }
        ctl.set('ch', bestCh, false); loop.once();
      }, p => p.y > geo.yb - 4 && p.y < geo.yb + 34);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ wf-range */
  // rungs of the rate ladder: the PHY rate, and how many dB above the chip's best (1 Mbit/s) sensitivity the signal must be. Schematic, from the usual spread.
  const RUNGS = [
    { name: '1 Mbit/s', mbps: 1, off: 0 }, { name: '7.2 Mbit/s', mbps: 7.2, off: 5 }, { name: '21.7 Mbit/s', mbps: 21.7, off: 10 },
    { name: '43.3 Mbit/s', mbps: 43.3, off: 17 }, { name: '57.8 Mbit/s', mbps: 57.8, off: 21 }, { name: '72.2 Mbit/s', mbps: 72.2, off: 25 }
  ];
  const LR_RUNGS = [{ name: 'LR 250 kbit/s', mbps: 0.25, off: -7, lr: true }, { name: 'LR 500 kbit/s', mbps: 0.5, off: -4, lr: true }];

  Hyper.sim('wf-range', {
    title: 'Signal strength, distance and walls',
    blurb: `The curve is the signal strength you would measure (RSSI) at each distance, from the link budget: the transmit power, the free-space loss, a **path-loss exponent** for the surroundings and a few decibels for every wall. The horizontal lines are what the receiver needs for each data rate, from the chip's own best sensitivity; where the curve falls below a line, that rate is lost. The rate ladder is **schematic** (typical spacing between rates), and the real throughput is about half the PHY rate.

**Try this**
- Walk the **distance** slider out with no walls, then add walls: every wall moves all the rates inwards by a few metres.
- Switch the **surroundings** from open air to a house: the exponent 2 becomes 3.3 and the range collapses.
- Change the **band** to 5 GHz: the same walls cost more and the free-space loss is 6.6 dB higher. Only the ESP32-C5 has this band.
- Turn on **long-range mode** (assumed here to gain 4 and 7 dB over 1 Mbit/s): see how little distance it buys.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.84, minH: 400, maxH: 600 });
      const chips = E.CHIPS.filter(x => x.wifi && x.txDbm != null && x.sensDbm != null && x.wifi.bw[0] <= 40);
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(x => [x.name, x.id]), value: 'esp32-c3' },
        { id: 'band', type: 'select', label: 'Band', options: [['2.4 GHz', 2442], ['5 GHz', 5500]], value: 2442 },
        { id: 'd', label: 'Distance', min: 1, max: 300, value: 15, unit: 'm', log: true, sig: 2 },
        { id: 'walls', label: 'Walls in the way', min: 0, max: 8, step: 1, value: 2 },
        { id: 'wall', type: 'select', label: 'Wall type', options: [['Plasterboard · 3 dB', 3], ['Brick · 7 dB', 7], ['Concrete · 12 dB', 12]], value: 7 },
        { id: 'n', type: 'select', label: 'Surroundings', options: [['Open air · exponent 2.0', 2.0], ['Open-plan office · 2.7', 2.7], ['A house · 3.3', 3.3]], value: 2.7 },
        { id: 'ant', label: 'Antenna gain, each end', min: -3, max: 8, step: 1, value: 0, unit: 'dBi' },
        { id: 'lr', type: 'check', label: 'Long-range mode (Espressif to Espressif)', value: !!params.lr }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['rssi', 'Signal strength'], ['q', 'Quality'], ['rate', 'Fastest rate held'], ['tcp', 'Real data rate, about'], ['reach', 'Reach at 1 Mbit/s']]);
      const model = (d) => {
        const v = ctl.values, chip = E.chip(v.chip), wall = v.wall * (v.band > 3000 ? 1.3 : 1);
        const o = { tx: chip.txDbm, gt: v.ant, gr: v.ant, mhz: v.band, n: v.n, walls: v.walls, wallLoss: wall, sens: chip.sensDbm };
        return { chip, o, rx: E.link(Object.assign({ d }, o)).rx };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, M = model(v.d), chip = M.chip;
        const rungs = RUNGS.concat(v.lr ? LR_RUNGS : []).map(r => Object.assign({ thr: chip.sensDbm + r.off }, r)).sort((a, b) => a.thr - b.thr);
        // the scene: router, walls, the ESP, its signal bars
        const sy = 52, sx0 = 48, sx1 = st.W - 48;
        const posOf = d => sx0 + (Math.log(d) / Math.log(300)) * (sx1 - sx0);
        const ex = posOf(v.d);
        S.node(c, sx0, sy, { kind: 'router', label: 'router', r: 17 });
        for (let i = 0; i < v.walls; i++) { const wx = sx0 + 26 + (ex - sx0 - 40) * (i + 1) / (v.walls + 1); c.fillStyle = C.faint; c.fillRect(wx - 2, sy - 28, 4, 56); }
        if (v.walls && ex - sx0 < 60) kit.label(c, 'walls too close to draw', (sx0 + ex) / 2 + 20, sy - 34, { size: 9.5, color: C.faint });
        S.radio(c, ex - 26, sy, { r: 28, n: 3, phase: 0.5, from: Math.PI * 0.7, to: Math.PI * 1.3, color: C.faint, width: 1.2 });
        S.node(c, ex, sy, { kind: 'esp', label: kit.fmt(v.d, 3) + ' m', r: 17 });
        const bars = S.bars(c, clamp(ex - 15, 4, st.W - 40), 2, M.rx, { w: 30, h: 20, label: false });
        // the chart: signal against distance (log), with the thresholds of the rates
        const px = 54, pw = st.W - px - 18, py = 112, ph = st.H - py - 40;
        const X = d => px + (Math.log(d) / Math.log(300)) * pw, Y = r => py + (clamp(r, -115, -20) + 20) / (-95) * ph;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let r = -20; r >= -110; r -= 10) { c.beginPath(); c.moveTo(px, Y(r)); c.lineTo(px + pw, Y(r)); c.stroke(); kit.label(c, String(r), px - 6, Y(r), { size: 9.5, color: C.faint, align: 'right' }); }
        [1, 3, 10, 30, 100, 300].forEach(d => { c.beginPath(); c.moveTo(X(d), py); c.lineTo(X(d), py + ph); c.stroke(); kit.label(c, d + ' m', X(d), py + ph + 12, { size: 9.5, color: C.faint, align: 'center' }); });
        kit.label(c, 'RSSI, dBm', px, py - 12, { size: 10, color: C.muted, align: 'left' });
        // thresholds
        rungs.forEach((r, i) => {
          const y = Y(r.thr), held = M.rx >= r.thr, col = r.lr ? C.warn : held ? C.ok : C.faint;
          c.save(); c.strokeStyle = col; c.lineWidth = held ? 1.6 : 1; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(px, y); c.lineTo(px + pw, y); c.stroke(); c.restore();
          const reach = E.linkRange(Object.assign({}, M.o, { sens: r.thr }));
          kit.label(c, r.name + (reach < 300 ? ' · to ' + kit.fmt(reach, 2) + ' m' : ' · beyond 300 m'), px + pw - 3, y - 6, { size: 9.5, color: held ? C.text : C.muted, align: 'right', bg: C.dark ? 'rgba(13,16,32,.55)' : 'rgba(255,255,255,.6)' });
        });
        // the curve and the marker
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath();
        for (let i = 0; i <= 80; i++) { const d = Math.exp(Math.log(300) * i / 80), rx = model(d).rx; i ? c.lineTo(X(d), Y(rx)) : c.moveTo(X(d), Y(rx)); }
        c.stroke();
        c.strokeStyle = C.text2; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(v.d), py); c.lineTo(X(v.d), py + ph); c.stroke(); c.setLineDash([]);
        kit.dot(c, X(v.d), Y(M.rx), 5, C.accent, C.bg2);
        // numbers
        const held = rungs.filter(r => M.rx >= r.thr && !r.lr).pop(), heldLr = rungs.filter(r => M.rx >= r.thr).pop();
        ro.set('rssi', kit.fmt(M.rx, 3) + ' dBm');
        ro.set('q', E.rssiQuality(M.rx) + (bars ? ' · ' + bars + ' of 5 bars' : ''));
        ro.set('rate', heldLr ? heldLr.name : 'no link');
        ro.set('tcp', heldLr && !heldLr.lr ? kit.fmt(heldLr.mbps * 0.5, 2) + ' Mbit/s' : heldLr ? 'under 0.25 Mbit/s' : '—');
        const r1 = E.linkRange(Object.assign({}, M.o, { sens: chip.sensDbm })), rl = E.linkRange(Object.assign({}, M.o, { sens: chip.sensDbm - 7 }));
        ro.set('reach', kit.fmt(r1, 3) + ' m' + (v.lr ? ' · LR: ' + kit.fmt(rl, 3) + ' m' : '') + (v.band > 3000 && !(chip.wifi.bands || []).includes(5) ? ' · this chip has no 5 GHz' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

/* ================================================================ wf-join */
  const SNAP = {
    init: { a: '— · WiFi.begin() just called', ev: 'STA_START', m: '1000 · STAT_IDLE, then 1001 · STAT_CONNECTING' },
    trying: { a: '6 · WL_DISCONNECTED (also while it tries)', ev: '—', m: '1001 · STAT_CONNECTING' },
    link: { a: '0 · WL_IDLE_STATUS (linked, no address yet)', ev: 'STA_CONNECTED', m: '1001 · STAT_CONNECTING' },
    ip: { a: '3 · WL_CONNECTED', ev: 'STA_GOT_IP', m: '1010 · STAT_GOT_IP' }
  };

  function buildJoin(fault, wpa3) {
    const rows = [], ST = 'your-ssid', R = (from, to, label, phase, why, extra) => rows.push(Object.assign({ from, to, label, phase, why, kind: 'ok' }, extra || {}));
    const sec = wpa3 ? 'WPA3' : 'WPA2';
    let end = { kind: 'ok', title: 'Joined', text: 'The station has an address and a working link: the Arduino status is 3 (WL_CONNECTED), MicroPython returns 1010.', reason: '— none: the join succeeded' };
    // 1 scan
    if (fault === 'notfound') {
      [1, 6, 11].forEach(ch => R(0, 1, 'Probe request, channel ' + ch + ': no answer', '1 Scan', 'The station asks on each channel whether "' + ST + '" is there. Nobody answers: the network is on 5 GHz only, too far away, or the name is wrong.', { kind: 'lost', snap: SNAP.trying }));
      end = { kind: 'fail', title: 'Network not found', text: 'No access point answered. The Arduino status becomes 1 (WL_NO_SSID_AVAIL); MicroPython returns 201 (STAT_NO_AP_FOUND). Look at a scan: is the name there, and on 2.4 GHz?', reason: '201 · NO_AP_FOUND' };
      return { rows, end };
    }
    if (fault === 'brownout') {
      R(0, 1, 'Probe request: the radio draws 340 mA…', '1 Scan', 'The radio switches on and the supply current jumps. A thin cable or a weak regulator lets the 3.3 V rail sag below what the chip needs.', { kind: 'lost', snap: SNAP.init });
      end = { kind: 'fail', title: 'Brownout', text: 'The brown-out detector resets the chip before anything is sent. The program restarts, joins again, resets again: the serial monitor shows the start-up messages over and over. Fix the supply, not the code.', reason: 'none: the chip resets before it can report' };
      return { rows, end };
    }
    R(0, 1, 'Probe request: is "' + ST + '" here?', '1 Scan', 'The station scans the channels for the network name, to learn its channel and the access point\'s address.', { snap: SNAP.trying });
    R(1, 0, 'Probe response: channel 6, ' + sec, '1 Scan', 'The access point answers with what a beacon would say: channel, security and the speeds it understands.');
    // 2 authentication and association
    if (wpa3) {
      R(0, 1, 'SAE commit: a value made from the password', '2 Join', 'WPA3 authenticates with SAE: each side sends a value computed from the password. Nothing in it lets an eavesdropper test password guesses offline.');
      R(1, 0, 'SAE commit', '2 Join', 'The access point answers with its own value; both can now derive the same secret.');
      R(0, 1, 'SAE confirm', '2 Join', 'Each side proves, with a check value, that it derived the same secret.');
      R(1, 0, 'SAE confirm', '2 Join', 'Proven both ways. The password was never sent and each guess needed a live exchange.');
    } else {
      R(0, 1, 'Authentication request', '2 Join', 'The first step of 802.11: the station asks to be authenticated. With WPA2 this is an open step; the password is checked later.');
      if (fault === 'weak') R(0, 1, 'Authentication request again…', '2 Join', 'At −84 dBm frames are lost and the station repeats them, so joining is slow.', { kind: 'lost' });
      R(1, 0, 'Authentication response', '2 Join', 'The access point accepts the authentication.');
    }
    R(0, 1, 'Association request', '2 Join', 'The station asks for a place in the network and states the speeds it supports.');
    if (fault === 'weak') {
      R(0, 1, 'Association request again…', '2 Join', 'Lost again: the weak signal costs several repeats before one frame gets through.', { kind: 'lost' });
      R(0, 1, 'Association request, third try', '2 Join', 'This one arrives.', { kind: 'warn' });
    }
    R(1, 0, 'Association response: welcome, AID 1', '2 Join', 'The access point gives the station an identifier. The station is now part of the network, but nothing is encrypted yet.');
    // 3 the four-way handshake
    R(1, 0, 'Handshake 1: the AP\'s random number', '3 Keys', 'Both sides already hold the master key made from the password and the network name. The access point starts the handshake with a random number (ANonce). The password is never sent.');
    if (fault === 'password') {
      R(0, 1, 'Handshake 2: proof does not match', '3 Keys', 'The station sends its own random number and a check value (MIC) computed with a key from its password. The access point recomputes it from ITS password and the values differ: it discards the frame.', { kind: 'fail' });
      R(1, 0, 'Disassociate · reason 15, handshake timeout', '3 Keys', 'After a few repeats the handshake times out and the link is dropped. The reason is 15 (some routers answer with 202, authentication failed). The status is a poor guide here: read the reason.', { kind: 'fail' });
      end = { kind: 'fail', title: 'Wrong password', text: 'Reason code 15 (4WAY_HANDSHAKE_TIMEOUT), or 202 (AUTH_FAIL) on some routers. The Arduino status is often only 6 (not connected); MicroPython reports 202 (STAT_WRONG_PASSWORD), or 1001 while it keeps retrying.', reason: '15 · 4WAY_HANDSHAKE_TIMEOUT (or 202)' };
      return { rows, end };
    }
    R(0, 1, 'Handshake 2: station\'s number + proof (MIC)', '3 Keys', 'The station sends its own random number and a check value (MIC) computed with a key derived from the master key and both numbers. A wrong password fails right here.');
    R(1, 0, 'Handshake 3: group key, install', '3 Keys', 'The access point proves it knows the key too and delivers the group key for broadcast traffic, encrypted.');
    R(0, 1, 'Handshake 4: acknowledged', '3 Keys', 'Both sides install the session key. From now on every frame is encrypted. The link is up (event STA_CONNECTED) but there is no address yet: status 0.', { snap: SNAP.link });
    // 4 an address
    R(0, 1, 'DHCP discover (broadcast)', '4 Address', 'The station shouts: is there a DHCP server? It has no address yet, so it uses 0.0.0.0 and the broadcast address.');
    if (fault === 'dhcp') {
      R(1, 0, 'DHCP offer: none, the pool is empty', '4 Address', 'The router has no address left to lend, or blocks the exchange. The station repeats the discover and waits.', { kind: 'lost' });
      R(0, 1, 'DHCP discover again…', '4 Address', 'Still silence. The link is up, so the password was right; there is just no address.', { kind: 'lost' });
      end = { kind: 'fail', title: 'No address', text: 'The link is up but no address arrives: the Arduino status stays 0 (WL_IDLE_STATUS), only STA_CONNECTED fires and never STA_GOT_IP; MicroPython stays at 1001. Look at the router\'s client list and address pool.', reason: 'none: no disconnect, the station waits for DHCP' };
      return { rows, end };
    }
    R(1, 0, 'DHCP offer: 192.168.1.57', '4 Address', 'The router offers an address with a mask, a gateway, a DNS server and a lease time.');
    R(0, 1, 'DHCP request', '4 Address', 'The station accepts the offer.');
    R(1, 0, 'DHCP acknowledge', '4 Address', 'The router confirms. The event STA_GOT_IP fires and the Arduino status becomes 3: now the network is usable.', { snap: SNAP.ip });
    if (fault === 'isolation') {
      R(0, 1, 'Packet for the phone, 192.168.1.23', '5 Talk', 'The station sends a packet to another Wi-Fi device through the router.', { snap: SNAP.ip });
      R(1, 0, 'Dropped: client isolation', '5 Talk', 'The router refuses to pass traffic between Wi-Fi clients. Pings to the router and the internet work; pings to the phone never answer.', { kind: 'fail' });
      end = { kind: 'fail', title: 'Joined, but isolated', text: 'The join succeeded (status 3) but the router drops traffic between Wi-Fi devices: a phone cannot reach the ESP, and mDNS names fail. Turn off client isolation (AP isolation) or leave the guest network.', reason: 'none: nothing is wrong with the join' };
    }
    if (fault === 'weak') end = { kind: 'warn', title: 'Joined, barely', text: 'It joined after repeated frames. At −84 dBm the link will drop from time to time: expect a disconnect with reason 200 (BEACON_TIMEOUT). Improve the signal.', reason: 'later: 200 · BEACON_TIMEOUT' };
    return { rows, end };
  }

  Hyper.sim('wf-join', {
    title: 'Joining a network, message by message',
    blurb: `The ESP is on the left, the access point on the right. Each arrow is one frame; the **status panel** shows what a program would read at that moment, in Arduino and in MicroPython. Red arrows are frames that fail; an arrow ending in a cross never arrives.

**Try this**
- Play the join with **everything right**: the status stays 6, then becomes 0 once the link is up, and only reaches 3 when DHCP has answered.
- Choose **wrong password**: it fails in the handshake, in step 3, not in the scan or the association.
- Choose **network not found**: three questions, no answer. The same picture for a 5 GHz-only network, a hidden name or a router too far away.
- Tick **WPA3**: the authentication changes to SAE and the password-guessing risk of the handshake disappears.
- Try **client isolation** and **brownout**: the first joins and then fails to talk, the second never gets a frame out.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const focus = params.focus || '';
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 430, maxH: 640 });
      const ctl = kit.controls(box.side, [
        { id: 'fault', type: 'select', label: 'What is wrong', options: [['Nothing: everything right', 'ok'], ['Wrong password', 'password'], ['Network not found (5 GHz only, too far, hidden)', 'notfound'], ['Very weak signal', 'weak'], ['Router out of addresses (DHCP)', 'dhcp'], ['Client isolation on the router', 'isolation'], ['Supply too weak (brownout)', 'brownout']], value: focus === 'faults' ? 'notfound' : 'ok' },
        { id: 'wpa3', type: 'check', label: 'The network uses WPA3 (SAE)', value: false },
        { type: 'buttons', items: [{ id: 'next', label: 'Next message', primary: true }, { id: 'play', label: 'Play all' }, { id: 'again', label: 'Start over' }] }
      ], (id) => {
        if (id === 'next') { goal = Math.min(plan.rows.length, Math.max(goal, shown) + (shown >= goal ? 1 : 0)); loop.start(); }
        else if (id === 'play') { goal = plan.rows.length; loop.start(); }
        else if (id === 'again') restart(0);
        else restart(0);
      });
      const ro = kit.readout(box.side, [['step', 'This step'], ['a', 'Arduino status'], ['ev', 'Event fired'], ['m', 'MicroPython status'], ['end', 'Result'], ['why', 'Reason code']]);
      let plan = null, shown = 0, prog = 0, goal = 0;
      function restart(startAt) {
        plan = buildJoin(ctl.values.fault, ctl.values.wpa3);
        shown = startAt || 0; prog = 0; goal = shown;
        loop.once();
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (shown < goal) { prog += dt / 0.8; if (prog >= 1) { shown++; prog = 0; } }
        else if (loop.running) loop.stop();
        const rows = plan.rows;
        const geo = seqDraw(c, C, kit, S, st, [{ kind: 'esp', label: 'ESP', sub: 'station' }, { kind: 'router', label: 'access point', sub: 'your-ssid' }], rows, shown, prog, { left: 0.2, rowH: 30 });
        const done = shown >= rows.length;
        if (done) banner(c, C, kit, st, 22, plan.end.title, plan.end.kind === 'ok' ? C.ok : plan.end.kind === 'warn' ? C.warn : C.bad);
        // the status panel
        let snap = SNAP.init;
        for (let k = 0; k < shown; k++) if (rows[k].snap) snap = rows[k].snap;
        const lastOk = done && plan.end.kind === 'fail';
        ro.set('step', done ? 'Finished.' : (rows[shown].phase.slice(2) + ': ' + rows[shown].why));
        ro.set('a', lastOk && ctl.values.fault === 'notfound' ? '1 · WL_NO_SSID_AVAIL' : lastOk && ctl.values.fault === 'password' ? '6 · WL_DISCONNECTED (or 4, refused)' : lastOk && ctl.values.fault === 'dhcp' ? '0 · WL_IDLE_STATUS, for ever' : snap.a);
        ro.set('ev', lastOk && ctl.values.fault === 'notfound' ? 'STA_DISCONNECTED, reason 201' : lastOk && ctl.values.fault === 'password' ? 'STA_DISCONNECTED, reason 15' : lastOk && ctl.values.fault === 'dhcp' ? 'STA_CONNECTED only, never GOT_IP' : snap.ev);
        ro.set('m', lastOk && ctl.values.fault === 'notfound' ? '201 · STAT_NO_AP_FOUND' : lastOk && ctl.values.fault === 'password' ? '202 · STAT_WRONG_PASSWORD (or 1001 while retrying)' : lastOk && ctl.values.fault === 'dhcp' ? '1001 · STAT_CONNECTING' : snap.m);
        ro.set('end', done ? plan.end.text : '…');
        ro.set('why', done ? plan.end.reason : '…');
      }, box.stage);
      restart(focus === 'handshake' ? 6 + (ctl.values.wpa3 ? 2 : 0) : 0);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

/* ================================================================ a conversation player, used by wf-portal and wf-dhcp-dns
     cfg: { aspect, minH, controls: [...], readouts: [[key, label, ({ plan, shown, done, values }) => text]], plan(values) -> { actors, rows, end: { kind, title }, left }, onChange(ctl, id) } */
  function converse(box, kit, cfg) {
    const S = kit.esym;
    const st = kit.stage(box.stage, { aspect: cfg.aspect || 0.7, minH: cfg.minH || 360, maxH: cfg.maxH || 600 });
    let plan = null, shown = 0, prog = 0, goal = 0;
    const ctl = kit.controls(box.side, cfg.controls.concat([{ type: 'buttons', items: [{ id: 'next', label: 'Next message', primary: true }, { id: 'play', label: 'Play all' }, { id: 'again', label: 'Start over' }] }]), (id) => {
      if (id === 'next') { if (shown >= goal) goal = Math.min(plan.rows.length, shown + 1); loop.start(); }
      else if (id === 'play') { goal = plan.rows.length; loop.start(); }
      else restart(id);
    });
    const ro = kit.readout(box.side, cfg.readouts.map(r => [r[0], r[1]]));
    function restart(id) {
      if (cfg.onChange) cfg.onChange(ctl, id);
      plan = cfg.plan(ctl.values); shown = 0; prog = 0; goal = 0;
      loop.once();
    }
    const loop = kit.loop((dt) => {
      const c = st.begin(), C = kit.colors();
      if (shown < goal) { prog += dt / 0.8; if (prog >= 1) { shown++; prog = 0; } }
      else if (loop.running) loop.stop();
      seqDraw(c, C, kit, S, st, plan.actors, plan.rows, shown, prog, { left: plan.left == null ? 0.2 : plan.left, rowH: 32 });
      const done = shown >= plan.rows.length;
      if (done && plan.end) banner(c, C, kit, st, 22, plan.end.title, plan.end.kind === 'ok' ? C.ok : plan.end.kind === 'warn' ? C.warn : C.bad);
      cfg.readouts.forEach(([key, , fn]) => ro.set(key, fn({ plan, shown, done, values: ctl.values })));
    }, box.stage);
    restart();
    st.onResize(() => loop.once());
    return { ctl, st };
  }
  // the last value of a property among the rows already finished
  const carried = (plan, shown, key, init) => { let v = init; for (let k = 0; k < Math.min(shown, plan.rows.length); k++) if (plan.rows[k][key] != null) v = plan.rows[k][key]; return v; };

  /* ================================================================ wf-portal */
  Hyper.sim('wf-portal', {
    title: 'A captive portal, step by step',
    blurb: `The phone is on the left, the ESP, which is the access point, its catch-all DNS and its web server, in the middle. The right-hand column is the home router, which the ESP joins at the end of the set-up flow.

**Try this**
- Play the flow and watch step 2: the phone's own internet check is answered by the ESP, and the **redirect** is what makes the pop-up appear.
- Tick **private DNS** on the phone: its lookups go out encrypted, past the catch-all, so no pop-up appears and the page must be typed by hand.
- In the **set-up flow** read the **flash** line: nothing is saved until the form is submitted, and after the restart the ESP leaves the soft AP and joins the home network.`,
    mount(box, kit, params) {
      const provision = params.flow === 'provision';
      converse(box, kit, {
        aspect: 0.8, minH: 400,
        controls: [
          { id: 'flow', type: 'select', label: 'Flow', options: [['Portal page only', 'portal'], ['Full set-up: save and join the home network', 'provision']], value: provision ? 'provision' : 'portal' },
          { id: 'priv', type: 'check', label: 'The phone uses private (encrypted) DNS', value: false }
        ],
        plan: v => {
          const rows = [], R = (from, to, label, phase, why, extra) => rows.push(Object.assign({ from, to, label, phase, why, kind: 'ok' }, extra || {}));
          R(0, 1, 'Join "device-setup" (open network)', '1 Join', 'The phone joins the soft AP. It is an open network, so there is no handshake and no password.', { ph: 'Connected, checking the internet…', es: 'soft AP + catch-all DNS + web server' });
          R(1, 0, 'DHCP: you are 192.168.4.2, DNS 192.168.4.1', '1 Join', 'The ESP\'s DHCP server hands out an address and names itself as router and DNS server, so every later question comes to it.');
          if (v.priv) {
            R(0, 2, 'DNS over TLS to a public server: fails', '2 Check', 'Private DNS sends lookups encrypted to a public server, past the catch-all. With no internet the lookup fails: the phone says "connected, no internet" and opens no pop-up.', { kind: 'lost', ph: 'Connected, no internet · no pop-up' });
            R(0, 1, 'You type http://192.168.4.1/ by hand', '3 Page', 'The page itself still works at its address, which is why the program prints it.', { ph: 'Browser opened by hand' });
          } else {
            R(0, 1, 'DNS: connectivitycheck.gstatic.com?', '2 Check', 'After joining, Android asks for a well-known address to find out whether the internet is there. An iPhone asks for captive.apple.com instead.');
            R(1, 0, 'DNS answer: 192.168.4.1', '2 Check', 'The catch-all DNS answers every name with the ESP\'s own address.');
            R(0, 1, 'GET /generate_204', '2 Check', 'The phone expects an empty reply with status 204. Anything else means a sign-in page is in the way.');
            R(1, 0, '302 redirect to http://192.168.4.1/', '2 Check', 'The ESP answers with a redirect instead. The phone concludes that a sign-in page is in the way and opens a browser window by itself.', { kind: 'warn', ph: '"Sign in to network": the pop-up opens' });
            R(0, 1, 'GET / (the pop-up browser)', '3 Page', 'The pop-up browser asks for the address it was redirected to.');
          }
          R(1, 0, 'The page: network name and password form', '3 Page', v.flow === 'provision' ? 'The ESP serves the set-up form. Nothing has been saved yet.' : 'The ESP serves its page. For a set-up portal this is the form.', {});
          if (v.flow === 'provision') {
            R(0, 1, 'POST /save: name and password', '4 Save', 'The form arrives as plain HTTP: anyone listening to an open soft AP could read it. Give the set-up network a password in a real product.', { fl: 'nothing saved yet' });
            R(1, 0, 'Saved in flash. Restarting…', '4 Save', 'The ESP writes the two values to the NVS partition, which survives resets and updates, and restarts.', { fl: 'ssid = HomeNet · password stored', es: 'restarting' });
            R(1, 2, 'Station: join "HomeNet", then DHCP', '5 Join home', 'After the restart the saved credentials are found and the ESP joins the home router as a station, as on the station page.', { es: 'station on HomeNet' });
            R(2, 1, '192.168.1.57: joined', '5 Join home', 'The router gives the ESP its address. The ESP is now on the home network and the soft AP no longer exists.', {});
            R(1, 0, 'The soft AP is gone: the phone drops', '5 Join home', 'The set-up network has disappeared; the phone falls back to its own Wi-Fi or mobile data.', { kind: 'lost', ph: 'Back on its own network' });
          }
          return { actors: [{ kind: 'phone', label: 'phone' }, { kind: 'esp', label: 'ESP', sub: 'AP · DNS · web' }, { kind: 'router', label: 'home router', sub: 'and the internet', dim: v.flow !== 'provision' && !v.priv }], rows, left: 0.17, end: { kind: 'ok', title: v.flow === 'provision' ? 'Set up and joined' : v.priv ? 'Page by hand' : 'Page opened' } };
        },
        readouts: [
          ['step', 'This step', s => s.done ? 'Finished.' : s.plan.rows[s.shown].why],
          ['ph', 'What the phone shows', s => carried(s.plan, s.shown, 'ph', 'not connected')],
          ['es', 'The ESP is', s => carried(s.plan, s.shown, 'es', 'idle')],
          ['fl', 'Saved in flash', s => carried(s.plan, s.shown, 'fl', 'nothing saved yet')]
        ]
      });
    }
  });

  /* ================================================================ wf-dhcp-dns */
  Hyper.sim('wf-dhcp-dns', {
    title: 'DHCP, DNS and mDNS as conversations',
    blurb: `Three conversations a device has on a network, one after the other: how it gets **an address** (DHCP), how it turns **a name into an address** (DNS), and how it is found **by name on its own network** (mDNS). Choose one, then step through it message by message.

**Try this**
- In **DHCP**, drag the pool of free addresses to 0: no offer comes, and the ESP is linked but never gets an address.
- Tick **static address**: the four DHCP messages vanish, which saves time on every connection, at the price of nobody checking the address is free.
- In **DNS**, try *cached* (one message instead of four), *DNS server down* (a time-out) and *captive network* (an answer, but the wrong one).
- In **mDNS**, the question goes to everybody at once. Tick **the network blocks multicast** and the name fails while the address would still work.`,
    mount(box, kit, params) {
      converse(box, kit, {
        aspect: 0.62, minH: 330,
        controls: [
          { id: 'conv', type: 'select', label: 'Conversation', options: [['DHCP: getting an address', 'dhcp'], ['DNS: finding a name', 'dns'], ['mDNS: asking everybody', 'mdns']], value: params.conv || 'dhcp' },
          { id: 'pool', label: 'DHCP: free addresses in the router', min: 0, max: 50, step: 1, value: 20 },
          { id: 'stat', type: 'check', label: 'DHCP: a static address in the code', value: false },
          { id: 'lease', type: 'select', label: 'DHCP: lease time', options: [['1 hour', 1], ['12 hours', 12], ['24 hours', 24], ['7 days', 168]], value: 24 },
          { id: 'sit', type: 'select', label: 'DNS: the situation', options: [['A normal lookup', 'normal'], ['The router has it cached', 'cached'], ['DNS server down or wrong', 'down'], ['A captive network answers everything', 'portal']], value: 'normal' },
          { id: 'block', type: 'check', label: 'mDNS: the network blocks multicast', value: false }
        ],
        onChange: (ctl) => {
          const cv = ctl.values.conv;
          ['pool', 'stat', 'lease'].forEach(k => ctl.show(k, cv === 'dhcp'));
          ctl.show('sit', cv === 'dns'); ctl.show('block', cv === 'mdns');
        },
        plan: v => {
          const rows = [], R = (from, to, label, phase, why, extra) => rows.push(Object.assign({ from, to, label, phase, why, kind: 'ok' }, extra || {}));
          if (v.conv === 'dhcp') {
            const lease = v.lease >= 48 ? v.lease / 24 + ' days' : v.lease + (v.lease === 1 ? ' hour' : ' hours'), half = v.lease === 1 ? '30 minutes' : v.lease >= 48 ? kit.fmt(v.lease / 48, 2) + ' days' : v.lease / 2 + ' hours';
            if (v.stat) {
              R(0, 1, 'ARP: I am 192.168.1.50', 'Static address', 'No DHCP at all: the code sets the address, mask and gateway before the join. The ESP just announces itself. Nobody checks that the address is free, so a clash is possible, and the DNS server must be set by hand too.', { ad: '192.168.1.50 (from the code)' });
              return { actors: [{ kind: 'esp', label: 'ESP' }, { kind: 'router', label: 'router', sub: 'DHCP server' }], rows, end: { kind: 'ok', title: 'Static address' } };
            }
            R(0, 1, 'DHCP discover (broadcast)', '1 Discover', 'The ESP has no address yet, so it sends from 0.0.0.0 to everybody: is there a DHCP server? (UDP port 67)', { ad: 'none yet' });
            if (v.pool === 0) {
              R(1, 0, 'No offer: the pool is empty', '2 Offer', 'The router has no free address to lend, or blocks the exchange. The ESP repeats its question and waits; the link is up but the Arduino status stays 0.', { kind: 'lost' });
              R(0, 1, 'DHCP discover again…', '1 Discover', 'Still no answer.', { kind: 'lost' });
              return { actors: [{ kind: 'esp', label: 'ESP' }, { kind: 'router', label: 'router', sub: 'DHCP server' }], rows, end: { kind: 'fail', title: 'No address' } };
            }
            R(1, 0, 'DHCP offer: 192.168.1.57 · mask · gateway · DNS · ' + lease, '2 Offer', 'The router offers an address from its pool (' + v.pool + ' still free) with the mask 255.255.255.0, the gateway 192.168.1.1, the DNS server and a lease of ' + lease + '.');
            R(0, 1, 'DHCP request: I take 192.168.1.57', '3 Request', 'The ESP accepts the offer, which also tells any other DHCP server that the offer was taken.');
            R(1, 0, 'DHCP acknowledge', '4 Acknowledge', 'The router confirms. The ESP now configures its address; the event STA_GOT_IP fires.', { ad: '192.168.1.57, for ' + lease });
            R(0, 1, 'Renew 192.168.1.57', '5 Renew', 'Half-way through the lease, after ' + half + ', the ESP asks to keep its address. If it never asks, the address returns to the pool.');
            return { actors: [{ kind: 'esp', label: 'ESP' }, { kind: 'router', label: 'router', sub: 'DHCP server' }], rows, end: { kind: 'ok', title: 'Address leased' } };
          }
          if (v.conv === 'dns') {
            const A = [{ kind: 'esp', label: 'ESP' }, { kind: 'router', label: 'router', sub: 'DNS resolver' }, { kind: 'cloud', label: 'upstream DNS', sub: 'the internet' }];
            if (v.sit === 'down') {
              R(0, 1, 'A? example.com: no answer', '1 Ask', 'The DNS server is missing, wrong or unreachable. The ESP waits for its time-out.', { kind: 'lost', an: '—' });
              R(0, 1, 'A? example.com again…', '1 Ask', 'Still nothing. WiFi.hostByName returns 0, and getaddrinfo raises an OSError. Pinging an address would still work.', { kind: 'lost' });
              return { actors: A, rows, left: 0.16, end: { kind: 'fail', title: 'Lookup failed' } };
            }
            R(0, 1, 'A? example.com', '1 Ask', 'The ESP asks its DNS server (the one DHCP named): which address has this name? (UDP port 53)', { an: '…' });
            if (v.sit === 'normal') {
              R(1, 2, 'A? example.com (not in its cache)', '2 Upstream', 'The router does not know the name, so it asks a DNS server of the internet on the ESP\'s behalf.');
              R(2, 1, 'A 203.0.113.7 · TTL 300 s', '2 Upstream', 'The answer carries an address (a documentation address here) and a time to live: how long it may be remembered.');
            }
            if (v.sit === 'portal') { R(1, 0, 'A 192.168.4.1 (every name!)', '3 Answer', 'A captive network answers every question with its own address. The lookup succeeds, but the ESP then talks to the wrong machine.', { kind: 'warn', an: '192.168.4.1 (wrong)' }); return { actors: A, rows, left: 0.16, end: { kind: 'warn', title: 'Wrong answer' } }; }
            R(1, 0, v.sit === 'cached' ? 'A 203.0.113.7 · from the cache' : 'A 203.0.113.7 · TTL 300 s', '3 Answer', v.sit === 'cached' ? 'The router answers at once from its cache: one message pair instead of two.' : 'The router passes the answer on, and keeps it for 300 s for the next device that asks.', { an: '203.0.113.7' });
            return { actors: A, rows, left: 0.16, end: { kind: 'ok', title: 'Name resolved' } };
          }
          // mDNS
          const A = [{ kind: 'laptop', label: 'laptop', sub: 'opens esp32.local' }, { kind: 'phone', label: 'another device' }, { kind: 'esp', label: 'ESP', sub: 'is esp32.local' }];
          if (v.block) {
            R(0, 2, 'Who is esp32.local? multicast: blocked', '1 Ask', 'The network (a guest network, client isolation, an extender) does not pass multicast. The question never arrives.', { kind: 'lost', an: '—' });
            R(0, 2, 'Who is esp32.local? again…', '1 Ask', 'The laptop repeats and gives up: "server not found". The ESP is fine; http://192.168.1.57/ would still work.', { kind: 'lost' });
            return { actors: A, rows, left: 0.17, end: { kind: 'fail', title: 'Name not found' } };
          }
          R(0, 2, 'Who is esp32.local? (to 224.0.0.251)', '1 Ask', 'A multicast question to everybody on the network at once, on UDP port 5353. No server is involved.', { an: '…' });
          R(0, 1, 'the same question: not my name', '1 Ask', 'Every other device hears it too, and ignores it: it is not their name.', { color: 'faint' });
          R(2, 0, 'esp32.local is 192.168.1.57 · TTL 120 s', '2 Answer', 'The owner of the name answers, with its address and a time to live. The laptop remembers it for a while.', { an: '192.168.1.57' });
          R(0, 2, 'Who offers _http._tcp?', '3 Service', 'DNS-SD: ask for a kind of service rather than a name.');
          R(2, 0, 'esp32 · port 80', '3 Service', 'The ESP answers with the service it advertised (MDNS.addService), so a program can find it without knowing the name.');
          return { actors: A, rows, left: 0.17, end: { kind: 'ok', title: 'Name resolved' } };
        },
        readouts: [
          ['step', 'This step', s => s.done ? (s.plan.end.title + '.') : s.plan.rows[s.shown].why],
          ['res', 'The result so far', s => s.values.conv === 'dhcp' ? carried(s.plan, s.shown, 'ad', 'no address') : s.values.conv === 'dns' || s.values.conv === 'mdns' ? carried(s.plan, s.shown, 'an', 'no answer yet') : '']
        ]
      });
    }
  });

/* ================================================================ wf-modes */
  Hyper.sim('wf-modes', {
    title: 'Station, soft access point, or both',
    blurb: `The ESP in the middle, the home router and the internet on the left, a phone and a laptop on the right. Packets travel in a loop of six seconds: the ESP **reports to the cloud** (if it is a station), a phone **asks the ESP for a page** (if it is an access point), and a laptop **tries to reach the internet through the ESP**.

**Try this**
- As a **soft access point** alone, the phones reach the ESP but the internet request is blocked: the ESP is not a router.
- In **both** mode, press **the router moves to another channel**: the soft AP must follow it, because there is one radio, and its clients drop for a moment.
- Tick **forward the packets** in both mode: the laptop now reaches the internet, through the ESP, slowly. It works, but a microcontroller makes a poor router.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 520 });
      let routerCh = 6, drop = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'The ESP is', options: [['A station of the home router', 'sta'], ['A soft access point', 'ap'], ['Both at once (AP+STA)', 'both']], value: 'both' },
        { id: 'nat', type: 'check', label: 'Forward the laptop\'s packets to the router (NAT)', value: false },
        { type: 'buttons', items: [{ id: 'move', label: 'The router moves to another channel', primary: true }] }
      ], (id) => { if (id === 'move') { routerCh = routerCh === 6 ? 11 : 6; if (ctl.values.mode === 'both') drop = 3; } loop.start(); });
      const ro = kit.readout(box.side, [['sta', 'As a station'], ['ap', 'As an access point'], ['phone', 'A phone can reach'], ['esp', 'The ESP can reach']]);
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), mode = ctl.values.mode, sta = mode !== 'ap', ap = mode !== 'sta', both = mode === 'both', nat = ctl.values.nat && both;
        drop = Math.max(0, drop - dt);
        const W = st.W, Hh = st.H;
        const cl = [W * 0.1, Hh * 0.2], rt = [W * 0.1, Hh * 0.62], es = [W * 0.5, Hh * 0.46], ph = [W * 0.9, Hh * 0.24], lp = [W * 0.9, Hh * 0.7];
        const apCh = both ? routerCh : 1;
        // links
        S.link(c, rt[0], rt[1], cl[0], cl[1], { label: 'internet', gap: 22 });
        if (sta) S.link(c, es[0], es[1], rt[0], rt[1], { wireless: true, gap: 24, label: 'station · channel ' + routerCh, color: C.accent });
        if (ap) {
          const colr = drop > 0 ? C.bad : C.accent, lab = drop > 0 ? 'channel changed: clients drop…' : 'soft AP "esp32-ap" · channel ' + apCh;
          S.link(c, es[0], es[1], ph[0], ph[1], { wireless: true, gap: 24, color: colr, label: lab });
          S.link(c, es[0], es[1], lp[0], lp[1], { wireless: true, gap: 24, color: colr });
        }
        S.node(c, cl[0], cl[1], { kind: 'cloud', label: 'internet', r: 22 });
        S.node(c, rt[0], rt[1], { kind: 'router', label: 'home router', sub: 'channel ' + routerCh, r: 22 });
        S.node(c, es[0], es[1], { kind: 'esp', label: 'ESP', sub: (sta ? '192.168.1.57' : '') + (sta && ap ? ' · ' : '') + (ap ? '192.168.4.1' : ''), r: 24, active: true });
        S.node(c, ph[0], ph[1], { kind: 'phone', label: 'phone', sub: ap ? '192.168.4.2' : 'not connected', r: 20, dim: !ap });
        S.node(c, lp[0], lp[1], { kind: 'laptop', label: 'laptop', sub: ap ? '192.168.4.3' : 'not connected', r: 20, dim: !ap });
        // the loop of six seconds
        const u = (t % 6) / 6, seg = (a, b) => clamp((u - a) / (b - a), 0, 1), on = (a, b) => u >= a && u < b;
        const hop = (p, q, f, label, color) => { if (f > 0 && f < 1) S.msg(c, p[0], p[1], q[0], q[1], f, { color: color || C.accent, label, gap: 24 }); };
        if (sta && !drop) { hop(es, rt, seg(0, 0.17), 'reading', C.ok); hop(rt, cl, seg(0.17, 0.33), 'reading', C.ok); }
        if (ap && !drop) {
          hop(ph, es, seg(0.33, 0.5), 'GET /'); hop(es, ph, seg(0.5, 0.67), 'page');
          hop(lp, es, seg(0.67, 0.83), 'cloud?', C.warn);
          if (nat && sta) { hop(es, rt, seg(0.83, 0.92), 'forwarded', C.warn); hop(rt, cl, seg(0.92, 1.0), 'forwarded', C.warn); }
          else if (on(0.83, 1.0)) { c.strokeStyle = C.bad; c.lineWidth = 3; const bx = es[0] + 34, by = es[1] + 8; c.beginPath(); c.moveTo(bx - 7, by - 7); c.lineTo(bx + 7, by + 7); c.moveTo(bx + 7, by - 7); c.lineTo(bx - 7, by + 7); c.stroke(); kit.label(c, 'not forwarded', bx + 12, by, { size: 10.5, color: C.bad }); }
        }
        if (both) kit.label(c, 'one radio: the soft AP follows the station\'s channel', W * 0.5, Hh - 14, { size: 11, color: C.warn, align: 'center' });
        ro.set('sta', sta ? '192.168.1.57 · channel ' + routerCh + ' · address from the router' : 'off');
        ro.set('ap', ap ? '"esp32-ap" · 192.168.4.1 · channel ' + apCh + (both ? ' (follows the station)' : ' (the default)') : 'off');
        ro.set('phone', !ap ? 'nothing of the ESP: it is not an access point' : nat ? 'the ESP, and the internet through it' : 'the ESP only');
        ro.set('esp', (sta ? 'the internet through the router' : 'nothing beyond itself') + (ap ? ' and the phones' : ''));
      }, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ wf-sense */
  Hyper.sim('wf-sense', {
    title: 'Sensing movement with the signal strength',
    blurb: `The ESP reads the **RSSI** of its link to the router ten times a second, as the program on the page does. A person walks across the link: their body shadows the signal and the readings swing. The program keeps the last 20 values (two seconds), computes their **variance** and calls it movement when it passes the threshold.

**Try this**
- Stop the walker and raise the **noise**: the variance of a quiet room grows, and the detector starts to cry wolf.
- Lower the **body shadow** to 1 or 2 dB and watch the walker disappear into the noise.
- Move the **threshold** until the quiet room is quiet and the walk is still detected. There is usually a gap between the two, and it differs from room to room: calibrate in place.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 380, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'walk', type: 'check', label: 'Someone walks across the link', value: true },
        { id: 'depth', label: 'Body shadow', min: 1, max: 10, step: 0.5, value: 5, unit: 'dB' },
        { id: 'noise', label: 'Noise and interference', min: 0, max: 4, step: 0.25, value: 1, unit: 'dB' },
        { id: 'thr', label: 'Threshold (variance)', min: 0.5, max: 20, step: 0.5, value: 4, unit: 'dB²' }
      ], () => loop.start());
      const ro = kit.readout(box.side, [['rssi', 'RSSI now'], ['mean', 'Mean of the last 2 s'], ['var', 'Variance of the last 2 s'], ['say', 'The program prints']]);
      const N = 20, KEEP = 150, hist = [], vars = [];
      let acc = 0, seed = 7, phase = 0;
      const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
      const loop = kit.loop((dt) => {
        const v = ctl.values;
        phase += dt; acc += dt;
        const yw = v.walk ? Math.sin(phase * 2 * Math.PI / 9) : 1.3;                  // the walker's position across the link, -1 … 1
        while (acc >= 0.1) {
          acc -= 0.1;
          const att = v.depth * Math.exp(-Math.pow(yw / 0.32, 2));
          const rssi = Math.round(-54 - att + (rnd() - 0.5) * 2 * v.noise);
          hist.push(rssi); if (hist.length > KEEP) hist.shift();
          if (hist.length >= N) { const w = hist.slice(-N), m = w.reduce((a, b) => a + b, 0) / N; vars.push(w.reduce((a, b) => a + (b - m) * (b - m), 0) / N); } else vars.push(0);
          if (vars.length > KEEP) vars.shift();
        }
        const c = st.begin(), C = kit.colors();
        // the scene
        const sy = 66, x1 = st.W * 0.1, x2 = st.W * 0.9, half = 44, mid = st.W * 0.5;
        S.link(c, x1, sy, x2, sy, { wireless: true, gap: 24, color: C.accent });
        S.node(c, x1, sy, { kind: 'router', label: 'router', r: 17 });
        S.node(c, x2, sy, { kind: 'esp', label: 'ESP', r: 17 });
        const near = Math.exp(-Math.pow(yw / 0.32, 2)) > 0.4 && v.walk;
        S.node(c, mid, sy + yw * half, { kind: 'user', label: v.walk ? '' : 'nobody here', r: 15, color: near ? C.warn : C.muted, active: near });
        // the traces
        const px = 50, pw = st.W - px - 16, top = 150, h1 = (st.H - top) * 0.46, h2 = (st.H - top) * 0.3, gap = (st.H - top) * 0.1;
        const X = i => px + i / (KEEP - 1) * pw, Y1 = r => top + (clamp(r, -75, -40) + 40) / (-35) * h1;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        [-45, -55, -65].forEach(r => { c.beginPath(); c.moveTo(px, Y1(r)); c.lineTo(px + pw, Y1(r)); c.stroke(); kit.label(c, String(r), px - 6, Y1(r), { size: 9.5, color: C.faint, align: 'right' }); });
        kit.label(c, 'RSSI, dBm · the last 15 s', px, top - 10, { size: 10, color: C.muted });
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        hist.forEach((r, i) => { const xx = X(KEEP - hist.length + i), yy = Y1(r); i ? c.lineTo(xx, yy) : c.moveTo(xx, yy); });
        c.stroke();
        const y2 = top + h1 + gap, Y2 = r => y2 + h2 - clamp(r, 0, 25) / 25 * h2;
        kit.label(c, 'variance of the last 20 values, dB²', px, y2 - 8, { size: 10, color: C.muted });
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(px, y2 + h2 + 0.5); c.lineTo(px + pw, y2 + h2 + 0.5); c.stroke();
        c.save(); c.fillStyle = C.warn; c.globalAlpha = 0.28;
        vars.forEach((r, i) => { if (r > v.thr) c.fillRect(X(KEEP - vars.length + i) - 1, y2, 2.4, h2); });
        c.restore();
        c.strokeStyle = C.text2; c.lineWidth = 1.5; c.beginPath();
        vars.forEach((r, i) => { const xx = X(KEEP - vars.length + i), yy = Y2(r); i ? c.lineTo(xx, yy) : c.moveTo(xx, yy); });
        c.stroke();
        c.save(); c.strokeStyle = C.bad; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(px, Y2(v.thr)); c.lineTo(px + pw, Y2(v.thr)); c.stroke(); c.restore();
        kit.label(c, 'threshold', px + pw - 3, Y2(v.thr) - 8, { size: 9.5, color: C.bad, align: 'right' });
        const last = hist.length ? hist[hist.length - 1] : -54, lv = vars.length ? vars[vars.length - 1] : 0, w = hist.slice(-N), mean = w.length ? w.reduce((a, b) => a + b, 0) / w.length : -54;
        ro.set('rssi', last + ' dBm');
        ro.set('mean', kit.fmt(mean, 3) + ' dBm');
        ro.set('var', kit.fmt(lv, 3) + ' dB²');
        ro.set('say', hist.length < N ? 'collecting samples…' : lv > v.thr ? 'MOVEMENT' : 'still');
      }, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ wf-reconnect */
  const RECON_DEF = {
    start: 'CONNECTED',
    states: {
      CONNECTED: { on: { LINK_LOST: 'BACKOFF' }, entry: 'wait = base' },
      BACKOFF: { on: { RETRY: 'CONNECTING' }, entry: 'sleep for wait' },
      CONNECTING: { on: { LINK_UP: 'CONNECTED', FAILED: 'BACKOFF' }, entry: 'begin()' }
    }
  };
  Hyper.sim('wf-reconnect', {
    title: 'Reconnection with back-off',
    blurb: `A connection manager as a state machine, and below it the timeline of what the radio does while the router is away. Each attempt keeps the radio on for about **6 seconds**; the wait between attempts is the **back-off**. The clock runs fast, so a few minutes pass in seconds.

**Try this**
- Press **Cut the router for 3 minutes** with *Retry at once*: the radio is busy nearly all the time and the router, when it returns, is hammered.
- Switch to *Doubling wait*: the attempts thin out, the radio duty falls, and the device still reconnects within one wait of the router's return.
- Raise the **cap**: a longer cap saves more energy and makes reconnection later.
- Slide the **number of devices** and compare the busiest second with and without **jitter**: without it all devices retry in lock-step.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 420, maxH: 620 });
      const ctl = kit.controls(box.side, [
        { id: 'strat', type: 'select', label: 'Wait between attempts', options: [['Retry at once', 'now'], ['Fixed · 5 s', 'fixed'], ['Doubling, up to a cap', 'exp']], value: 'exp' },
        { id: 'base', label: 'First wait', min: 0.5, max: 5, step: 0.5, value: 1, unit: 's' },
        { id: 'cap', label: 'Cap on the wait', min: 10, max: 300, step: 5, value: 60, unit: 's' },
        { id: 'jit', type: 'check', label: 'Add jitter (a random part of each wait)', value: true },
        { id: 'n', label: 'Devices that lost the network together', min: 1, max: 40, step: 1, value: 20 },
        { id: 'speed', type: 'select', label: 'Clock', options: [['10 × real time', 10], ['30 × real time', 30], ['100 × real time', 100]], value: 30 },
        { id: 'router', type: 'check', label: 'The router is on', value: true },
        { type: 'buttons', items: [{ id: 'cut', label: 'Cut the router for 3 minutes', primary: true }, { id: 'reset', label: 'Start again' }] }
      ], (id, val) => {
        if (id === 'cut') { ctl.set('router', false); offUntil = simT + 180; }
        else if (id === 'reset') init();
        else if (id === 'router') { routerOn = !!val; if (val) offUntil = null; }
        loop.start();
      });
      const ro = kit.readout(box.side, [['state', 'State'], ['k', 'Attempts in this outage'], ['off', 'Offline for'], ['duty', 'Radio busy during the outage'], ['peak', 'Busiest second, all devices']]);
      const ATT = 6, DETECT = 6, WIN = 300, LAYOUT = { CONNECTED: [0.14, 0.5], CONNECTING: [0.86, 0.5], BACKOFF: [0.5, 0.88] };
      let m, simT, routerOn, offUntil, due, lostDue, k, attempts, outageStart, segs, rsegs, ticks, lastFired, firedAt, seed;
      function init() {
        m = E.fsm(RECON_DEF); simT = 0; routerOn = true; offUntil = null; due = null; lostDue = null; k = 0; attempts = 0; outageStart = null;
        segs = [{ s: 'CONNECTED', t0: 0, t1: 0 }]; rsegs = [{ on: true, t0: 0, t1: 0 }]; ticks = []; lastFired = -1; firedAt = -9; seed = 99;
        ctl.set('router', true, false);
      }
      const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
      const waitFor = (kk, r) => {
        const v = ctl.values; let w = v.strat === 'now' ? 0 : v.strat === 'fixed' ? 5 : Math.min(v.cap, v.base * Math.pow(2, kk));
        if (v.jit && v.strat !== 'now') w = w * (0.5 + 0.5 * r);
        return w;
      };
      const go = (ev, at) => {
        const idx = { LINK_LOST: 0, RETRY: 1, LINK_UP: 2, FAILED: 3 }[ev];
        if (!m.send(ev)) return;
        lastFired = idx; firedAt = at;
        const last = segs[segs.length - 1]; last.t1 = at; segs.push({ s: m.state, t0: at, t1: at });
        if (m.state === 'CONNECTING') { attempts++; ticks.push(at); due = at + ATT; }
        else if (m.state === 'BACKOFF') due = at + waitFor(k++, rnd());
        else if (m.state === 'CONNECTED') { due = null; k = 0; attempts = 0; outageStart = null; lostDue = null; }
      };
      // N devices that lost the network at the same moment: how many start an attempt in the busiest second?
      function crowd() {
        const v = ctl.values, bins = {}; let sd = 12345;
        const r = () => { sd = (sd * 1664525 + 1013904223) >>> 0; return sd / 4294967296; };
        for (let d = 0; d < v.n; d++) {
          let t = DETECT, kk = 0;
          while (t < 240 && kk < 400) {
            const w = v.strat === 'now' ? 0.05 : v.strat === 'fixed' ? 5 * (v.jit ? 0.5 + 0.5 * r() : 1) : Math.min(v.cap, v.base * Math.pow(2, kk)) * (v.jit ? 0.5 + 0.5 * r() : 1);
            t += w; bins[Math.floor(t)] = (bins[Math.floor(t)] || 0) + 1; t += ATT; kk++;
          }
        }
        return Math.max(0, ...Object.values(bins));
      }
      const loop = kit.loop((dt) => {
        const v = ctl.values;
        let rest = dt * v.speed;
        while (rest > 0) {                                   // advance the clock in steps of at most 0.25 s
          const step = Math.min(0.25, rest); rest -= step; simT += step;
          if (offUntil != null && simT >= offUntil) { offUntil = null; routerOn = true; ctl.set('router', true, false); }
          if (rsegs[rsegs.length - 1].on !== routerOn) { rsegs[rsegs.length - 1].t1 = simT; rsegs.push({ on: routerOn, t0: simT, t1: simT }); }
          rsegs[rsegs.length - 1].t1 = simT; segs[segs.length - 1].t1 = simT;
          if (m.state === 'CONNECTED') { if (!routerOn) { if (lostDue == null) lostDue = simT + DETECT; if (simT >= lostDue) { outageStart = lostDue - DETECT; go('LINK_LOST', lostDue); } } else lostDue = null; }
          let guard = 0;
          while (due != null && simT >= due && guard++ < 50) {
            const at = due;
            if (m.state === 'BACKOFF') go('RETRY', at);
            else if (m.state === 'CONNECTING') { if (routerOn) go('LINK_UP', at); else go('FAILED', at); }
          }
        }
        const c = st.begin(), C = kit.colors();
        // the machine
        const d = E.fsmDiagram(RECON_DEF, LAYOUT);
        const fsmH = st.H * 0.46;
        S.fsm(c, d, { box: { x: 6, y: 4, w: st.W - 12, h: fsmH }, active: m.state, fired: lastFired, pulse: clamp((simT - firedAt) / 2, 0, 1) });
        // the timeline
        const px = 56, pw = st.W - px - 14, y0 = fsmH + 24, rowH = 22, t1 = simT, t0 = simT - WIN;
        const X = t => px + clamp((t - t0) / WIN, 0, 1) * pw;
        const strip = (y, label, items, colorOf) => {
          kit.label(c, label, px - 6, y + rowH / 2, { size: 10.5, color: C.text2, align: 'right' });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(px, y, pw, rowH);
          items.forEach(it => { if (it.t1 < t0) return; c.fillStyle = colorOf(it); c.fillRect(X(it.t0), y, Math.max(1, X(it.t1) - X(it.t0)), rowH); });
        };
        strip(y0, 'router', rsegs, it => it.on ? C.ok : C.bad);
        strip(y0 + rowH + 10, 'ESP', segs, it => it.s === 'CONNECTED' ? C.ok : it.s === 'CONNECTING' ? C.accent : (C.dark ? 'rgba(160,170,200,.45)' : 'rgba(120,130,160,.45)'));
        const yt = y0 + 2 * rowH + 20;
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(px, yt); c.lineTo(px + pw, yt); c.stroke();
        ticks.forEach(t => { if (t < t0) return; c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(X(t), yt - 6); c.lineTo(X(t), yt + 6); c.stroke(); });
        kit.label(c, 'attempts', px - 6, yt, { size: 10.5, color: C.text2, align: 'right' });
        kit.label(c, 'green: connected · blue: an attempt, radio on · grey: waiting, radio asleep', px, yt + 22, { size: 10, color: C.muted });
        kit.label(c, '5 minutes ago', px, yt + 38, { size: 9.5, color: C.faint }); kit.label(c, 'now', px + pw, yt + 38, { size: 9.5, color: C.faint, align: 'right' });
        // numbers
        const off = outageStart != null ? simT - outageStart : 0, busy = off > 0 ? Math.min(1, (attempts * ATT) / off) : 0;
        ro.set('state', m.state + (m.state === 'BACKOFF' && due != null ? ' · next try in ' + kit.fmt(Math.max(0, due - simT), 2) + ' s' : ''));
        ro.set('k', outageStart != null || m.state !== 'CONNECTED' ? String(attempts) : '0');
        ro.set('off', outageStart != null ? kit.fmt(off, 3) + ' s' : (!routerOn ? 'the router is off; the ESP has not noticed yet' : 'not offline'));
        ro.set('duty', off > 0 ? kit.fmt(busy * 100, 2) + ' % of the time' : '—');
        ro.set('peak', crowd() + ' of ' + v.n + ' devices');
      }, box.stage);
      init();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ wf-beacon */
  Hyper.sim('wf-beacon', {
    title: 'Beacons, DTIM and target wake time',
    blurb: `The top row is the access point: a **beacon** every 102.4 ms, and every few of them a **DTIM** beacon, the one that announces broadcast and multicast traffic. The second row is the ESP's radio: **awake** (coloured) only when it has to listen. The average current follows from the chip's receive current and its sleep current, both from the catalogue. The awake times (3 ms for a beacon, 10 ms for a target wake time exchange) are assumptions; the picture is schematic.

**Try this**
- Compare *always on* with *wake for every DTIM beacon*: the average current falls by a factor of ten or more.
- Raise the **DTIM period**: fewer wake-ups and a lower current, but a message from the network waits longer. Press **Send a message to the ESP** and read how long it waited.
- Choose **target wake time** (Wi-Fi 6 chips only) and stretch its interval to seconds: the radio sleeps through all the beacons.
- Untick **the router supports TWT**: the ESP is back to waking for beacons.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 520 });
      const chips = E.CHIPS.filter(x => x.wifi && x.rxMa != null && x.lightUa != null && x.wifi.bw[0] <= 40);
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(x => [x.name, x.id]), value: 'esp32-c6' },
        { id: 'scheme', type: 'select', label: 'The radio', options: [['Always listening (no power save)', 'on'], ['Wake for every DTIM beacon', 'dtim'], ['Wake for every n-th beacon (listen interval)', 'listen'], ['Target wake time (Wi-Fi 6)', 'twt']], value: params.scheme || 'dtim' },
        { id: 'dtim', label: 'DTIM period / n', min: 1, max: 10, step: 1, value: 3 },
        { id: 'twt', label: 'TWT wake interval', min: 0.2, max: 10, step: 0.1, value: 2, unit: 's', log: true, sig: 2 },
        { id: 'rtwt', type: 'check', label: 'The router supports TWT', value: true },
        { id: 'sleep', type: 'select', label: 'While the radio sleeps', options: [['The CPU runs (about 20 mA, assumed)', 'cpu'], ['The CPU is in light sleep (catalogue)', 'light']], value: 'light' },
        { type: 'buttons', items: [{ id: 'msg', label: 'Send a message to the ESP', primary: true }] }
      ], (id) => { if (id === 'msg') { arrival = t; waited = null; } loop.start(); });
      const ro = kit.readout(box.side, [['mode', 'The radio'], ['duty', 'Awake'], ['avg', 'Average current'], ['wait', 'A message waits']]);
      const BI = 0.1024;
      let t = 0, arrival = null, waited = null;
      const loop = kit.loop((dt) => {
        const v = ctl.values, chip = E.chip(v.chip);
        let scheme = v.scheme, note = '';
        if (scheme === 'twt' && !(chip.wifi.feat || []).some(f => /TWT/.test(f))) { scheme = 'dtim'; note = 'this chip has no TWT: it wakes for beacons'; }
        else if (scheme === 'twt' && !v.rtwt) { scheme = 'dtim'; note = 'the router has no TWT: wakes for beacons'; }
        const P = scheme === 'dtim' || scheme === 'listen' ? v.dtim : 1;
        const Tw = scheme === 'on' ? 0 : scheme === 'twt' ? v.twt : P * BI;           // seconds between wake-ups
        const awake = scheme === 'twt' ? 0.010 : 0.003;
        const win = Math.max(1.6, Math.min(14, Tw * 1.7)), rate = win / 8;
        t += dt * rate;
        const c = st.begin(), C = kit.colors();
        const t0 = t - win, px = 60, pw = st.W - px - 14, X = tt => px + (tt - t0) / win * pw;
        // the access point's beacons
        const y1 = 52, y2 = y1 + 84;
        kit.label(c, 'access point', px - 6, y1 - 6, { size: 10.5, color: C.text2, align: 'right' });
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(px, y1 + 0.5); c.lineTo(px + pw, y1 + 0.5); c.stroke();
        const k0 = Math.ceil(t0 / BI), k1 = Math.floor(t / BI);
        for (let kk = k0; kk <= k1; kk++) {
          const dtim = kk % (v.dtim) === 0, xx = X(kk * BI);
          c.strokeStyle = dtim ? C.accent : C.faint; c.lineWidth = dtim ? 2.2 : 1.2;
          c.beginPath(); c.moveTo(xx, y1); c.lineTo(xx, y1 - (dtim ? 26 : 14)); c.stroke();
        }
        kit.label(c, 'beacon every 102.4 ms · tall: DTIM (every ' + v.dtim + ')', px, y1 + 16, { size: 10, color: C.muted });
        // the radio of the ESP
        kit.label(c, 'ESP radio', px - 6, y2 + 4, { size: 10.5, color: C.text2, align: 'right' });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(px, y2 - 12, pw, 24);
        const wakes = [];
        if (scheme === 'on') wakes.push([t0, t]);
        else if (scheme === 'twt') for (let n = Math.ceil((t0 - 0.2) / Tw); n * Tw + 0.05 <= t; n++) wakes.push([n * Tw + 0.05, n * Tw + 0.05 + awake]);
        else for (let kk = k0 - 1; kk <= k1; kk++) if (kk % P === 0) wakes.push([kk * BI - 0.001, kk * BI - 0.001 + awake]);
        c.fillStyle = scheme === 'twt' ? C.ok : C.accent;
        wakes.forEach(([a, b]) => { const xa = X(Math.max(a, t0)), xb = X(Math.min(b, t)); if (xb > xa || scheme !== 'on') c.fillRect(xa, y2 - 12, Math.max(2.5, xb - xa), 24); });
        kit.label(c, scheme === 'on' ? 'listening all the time' : 'awake ' + (awake * 1000) + ' ms every ' + kit.fmt(Tw * 1000, 3) + ' ms', px, y2 + 26, { size: 10, color: C.muted });
        // a message waiting at the access point
        let nextWake = null;
        if (arrival != null) {
          if (scheme === 'on') nextWake = arrival + 0.002;
          else if (scheme === 'twt') nextWake = (Math.ceil((arrival - 0.05) / Tw)) * Tw + 0.05;
          else nextWake = Math.ceil((arrival + 0.001) / (P * BI)) * P * BI - 0.001;
          if (waited == null && t >= nextWake) waited = nextWake - arrival;
          const xa = X(arrival), xb = X(Math.min(t, nextWake));
          if (xa > px - 2) {
            c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(xa, y1 + 4); c.lineTo(xa, y2 - 14); c.stroke();
            c.save(); c.fillStyle = C.warn; c.globalAlpha = 0.25; c.fillRect(xa, y2 - 30, Math.max(0, xb - xa), 12); c.restore();
            kit.label(c, 'message arrives', xa + 4, y2 - 38, { size: 10, color: C.warn });
          }
        }
        // numbers: the average current from the catalogue's receive and sleep currents
        const sleepMa = v.sleep === 'cpu' ? 20 : chip.lightUa / 1000, rxMa = chip.rxMa;
        const frac = scheme === 'on' ? 1 : awake / Tw, avg = frac * rxMa + (1 - frac) * sleepMa;
        ro.set('mode', (scheme === 'on' ? 'always on' : scheme === 'twt' ? 'target wake time, every ' + kit.fmt(Tw, 2) + ' s' : scheme === 'dtim' ? 'wakes every DTIM beacon, every ' + kit.fmt(Tw * 1000, 3) + ' ms' : 'wakes every ' + P + (P === 1 ? 'st' : 'th') + ' beacon') + (note ? ' · ' + note : ''));
        ro.set('duty', kit.fmt(frac * 100, 3) + ' % of the time');
        ro.set('avg', kit.fmt(avg, 3) + ' mA · receive ' + rxMa + ' mA, asleep ' + kit.fmt(sleepMa, 2) + ' mA');
        ro.set('wait', arrival == null ? 'press the button to send one · worst case ' + kit.fmt(Tw * 1000, 3) + ' ms' : waited == null ? 'waiting for the next wake-up…' : kit.fmt(waited * 1000, 3) + ' ms · worst case ' + kit.fmt(Tw * 1000, 3) + ' ms');
      }, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

})();
