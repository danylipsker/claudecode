/* HYPER-ESP32 · sims/zigbee-thread-matter.js
 *
 * Simulations of the topic "zigbee-thread-matter" (ids zt-*).
 *
 *   zt-channels       the sixteen 802.15.4 channels against the Wi-Fi networks around you, and a frame byte by byte;
 *                     params { view: 'plan' } shows only the channel plan
 *   zt-zigbee-mesh    a Zigbee network forming round a coordinator, a message routed hop by hop, a router failing and the mesh healing
 *   zt-sleepy-poll    a sleepy end device polling its parent: poll period against battery life and the delay of a command
 *   zt-clusters       the endpoints and clusters of a Zigbee device as an explorer; params { device: 'esplight' }
 *   zt-thread-network Thread roles on a mesh, the border router to Wi-Fi, a leader failing and a new one elected; params { br2: true }
 *   zt-matter-commission  Matter commissioning as a sequence of messages, with faults; params { view: 'share' } ends with a second ecosystem
 *   zt-compare-light  the same device on Wi-Fi, Zigbee and Thread: link, battery life, reachability
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const short = (s, n) => { s = String(s == null ? '' : s); return s.length > n ? s.slice(0, Math.max(1, n - 1)) + '…' : s; };
  const hex = (v, d) => '0x' + Math.round(v).toString(16).toUpperCase().padStart(d || 4, '0');
  const list = a => (a.length ? a.join(', ') : 'none');

  /* ================================================================ zt-channels */
  const WIFI_PLANS = {
    clear: { name: 'Wi-Fi on channels 1, 6 and 11', nets: [[1, 20], [6, 20], [11, 20]] },
    two: { name: 'Wi-Fi on channels 1 and 6', nets: [[1, 20], [6, 20]] },
    single: { name: 'One router, on channel 6', nets: [[6, 20]] },
    crowded: { name: 'A crowded block: 1, 3, 6, 9, 11', nets: [[1, 20], [3, 20], [6, 20], [9, 20], [11, 20]] },
    wide: { name: 'One router on 6, 40 MHz wide', nets: [[6, 40]] }
  };

  Hyper.sim('zt-channels', {
    title: 'The sixteen 802.15.4 channels and your Wi-Fi',
    blurb: `Each wide hump is a Wi-Fi network, drawn as wide as its signal mask (22 MHz for a 20 MHz channel, 42 MHz for 40 MHz). Each narrow bar is one of the 802.15.4 channels, 11 to 26, **green** where no Wi-Fi network overlaps it, amber where one does, red where two or more do. Click a bar to choose it.

**Try this**
- With Wi-Fi on **1, 6 and 11**, look for the green bars: 15, 20, 25 and 26 sit in the gaps.
- Press **Choose the quietest channel** on each plan. It also counts the leakage at the edges of a Wi-Fi hump, and prefers 25 to 26 when both are free, because channel 26 sits at the very edge of the band.
- Switch to **40 MHz Wi-Fi**: one router now blocks eight channels.
- Slide the **frame size** down and watch the payload shrink, while the 6 bytes in front and the acknowledgement cost the same.

The picture is schematic: real Wi-Fi spectra have skirts and the strength of each network matters. The frame timings are the standard's, for one sender on a quiet channel.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const plan = !!(params && params.view === 'plan');
      const st = kit.stage(box.stage, { aspect: plan ? 0.52 : 0.8, minH: plan ? 300 : 430, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'plan', type: 'select', label: 'Wi-Fi networks around you', options: Object.keys(WIFI_PLANS).map(k => [WIFI_PLANS[k].name, k]), value: 'clear' },
        { id: 'ch', label: '802.15.4 channel', min: 11, max: 26, step: 1, value: 25 },
        { id: 'len', label: 'Frame size (PSDU)', min: 12, max: 127, step: 1, value: 127, unit: 'bytes' },
        { type: 'buttons', items: [{ id: 'best', label: 'Choose the quietest channel', primary: true }] }
      ], (id) => {
        if (id === 'best') ctl.set('ch', best().ch, false);
        loop.once();
      });
      if (plan) ctl.show('len', false);
      const ro = kit.readout(box.side, [['ch', 'Your channel'], ['over', 'Wi-Fi on top of it'], ['clear', 'Free of Wi-Fi'], ['best', 'Quietest'], ['air', 'Frame on the air'], ['rate', 'Best-case payload rate']]);
      if (plan) { ro.show('air', false); ro.show('rate', false); }
      const nets = () => (WIFI_PLANS[ctl.values.plan] || WIFI_PLANS.clear).nets.map(([ch, bw]) => { const fc = E.wifiChannel(ch) + (bw === 40 ? 10 : 0), half = bw === 40 ? 21 : 11; return { ch, bw, fc, lo: fc - half, hi: fc + half }; });
      const freq = ch => E.zigbeeChannel(ch);
      const overlaps = (ch, ns) => ns.filter(n => freq(ch) + 1 > n.lo && freq(ch) - 1 < n.hi);
      // a penalty that also counts the leakage just outside a Wi-Fi mask
      const penalty = (ch, ns) => ns.reduce((a, n) => {
        const f = freq(ch), gap = Math.max(n.lo - (f + 1), (f - 1) - n.hi, 0);
        return a + (gap === 0 ? 1 : Math.max(0, 1 - gap / 4) * 0.5);
      }, 0);
      function best() {
        const ns = nets(), order = [25, 20, 15, 26, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24];
        let b = null;
        for (const ch of order) { const p = penalty(ch, ns); if (!b || p < b.p - 1e-9) b = { ch, p }; }
        return b;
      }
      let geo = { x0: 12, x1: 700, yTop: 34, yb: 150 };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), ns = nets(), sel = Math.round(ctl.values.ch);
        const x0 = 12, x1 = Math.max(x0 + 100, st.W - 12), yTop = 34, yb = plan ? Math.round(st.H * 0.66) : Math.round(st.H * 0.4);
        geo = { x0, x1, yTop, yb };
        const F0 = 2399, F1 = 2486, X = f => x0 + (f - F0) / (F1 - F0) * (x1 - x0);
        // legend
        [['Wi-Fi', C.muted], ['clear', C.ok], ['one overlap', C.warn], ['two or more', C.bad]].forEach(([t, col], i) => {
          const lx = 12 + i * Math.min(150, (st.W - 24) / 4);
          c.fillStyle = col; c.fillRect(lx, 12, 10, 10); kit.label(c, t, lx + 15, 17, { size: 10.5, color: C.text2 });
        });
        // the Wi-Fi networks
        const hH = (yb - yTop) * 0.62;
        ns.forEach(n => {
          c.beginPath(); c.moveTo(X(n.lo - 1), yb); c.lineTo(X(n.lo + 1), yb - hH); c.lineTo(X(n.hi - 1), yb - hH); c.lineTo(X(n.hi + 1), yb);
          c.save(); c.globalAlpha = 0.16; c.fillStyle = C.muted; c.fill(); c.restore();
          c.strokeStyle = C.faint; c.lineWidth = 1.3; c.stroke();
          kit.label(c, 'Wi-Fi ' + n.ch + (n.bw === 40 ? ' · 40 MHz' : ''), X(n.fc), yb - hH - 8, { size: 10.5, color: C.text2, align: 'center' });
        });
        // the sixteen channels
        const bh = (yb - yTop) * 0.5, bw = Math.max(5, X(2) - X(0));
        for (let ch = 11; ch <= 26; ch++) {
          const f = freq(ch), k = overlaps(ch, ns).length, col = k === 0 ? C.ok : k === 1 ? C.warn : C.bad, isSel = ch === sel;
          c.save(); c.globalAlpha = isSel ? 0.95 : 0.55; c.fillStyle = col; c.fillRect(X(f) - bw / 2, yb - bh, bw, bh); c.restore();
          if (isSel) { c.strokeStyle = C.accent; c.lineWidth = 2.2; c.strokeRect(X(f) - bw / 2 - 2, yb - bh - 2, bw + 4, bh + 4); }
          kit.label(c, String(ch), X(f), yb + 11, { size: st.W < 520 ? 9.5 : 11, color: isSel ? C.accent : C.text2, weight: isSel ? 700 : 500, align: 'center' });
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yb + 0.5); c.lineTo(x1, yb + 0.5); c.stroke();
        kit.label(c, '802.15.4 channel · centre ' + freq(sel) + ' MHz', x0, yb + 28, { size: 10.5, color: C.muted });
        kit.label(c, '2400 MHz', x0, yb + 42, { size: 9.5, color: C.faint });
        kit.label(c, '2483.5 MHz', x1, yb + 42, { size: 9.5, color: C.faint, align: 'right' });
        // a frame, byte by byte, and one acknowledged exchange
        const L = Math.round(ctl.values.len), payload = Math.max(0, L - 11);
        const total = (L + 6) * 8 / 250000, tAck = (5 + 6) * 8 / 250000, tTurn = 0.000192, tGap = L > 18 ? 0.00064 : 0.000192;
        const cycle = total + tTurn + tAck + tGap, rate = payload * 8 / cycle;
        if (!plan) {
          const y1 = yb + 70;
          kit.label(c, 'A frame of ' + L + ' bytes, as sent', 12, y1, { size: 11.5, weight: 650 });
          S.frame(c, 12, y1 + 12, st.W - 24, [
            { label: 'PHY', size: 6, color: 212 },
            { label: 'MAC', size: 9, color: 286 },
            { label: 'Payload', size: Math.max(0.5, payload), value: String(payload), color: 150 },
            { label: 'FCS', size: 2, color: 36 }
          ], { h: 38 });
          kit.label(c, 'PHY 6 + MAC 9 + payload ' + payload + ' + FCS 2 bytes', 12, y1 + 62, { size: 10, color: C.muted });
          const y2 = y1 + 86;
          kit.label(c, 'One acknowledged exchange (ms)', 12, y2, { size: 11.5, weight: 650 });
          S.frame(c, 12, y2 + 12, st.W - 24, [
            { label: 'Data', size: total * 1e3, value: kit.fmt(total * 1e3, 3), color: 150 },
            { label: 'Turn', size: tTurn * 1e3, value: '', color: 212 },
            { label: 'ACK', size: tAck * 1e3, value: kit.fmt(tAck * 1e3, 2), color: 286 },
            { label: 'Gap', size: tGap * 1e3, value: '', color: 36 }
          ], { h: 32 });
          kit.label(c, 'Data, a short turn-round, the ACK, a gap: in ms. CSMA-CA adds a random wait first.', 12, y2 + 62, { size: 10, color: C.muted });
        }
        const ov = overlaps(sel, ns), free = [], all = [];
        for (let ch = 11; ch <= 26; ch++) { all.push(ch); if (overlaps(ch, ns).length === 0) free.push(ch); }
        const b = best();
        ro.set('ch', sel + ' · ' + freq(sel) + ' MHz' + (sel === 26 ? ' · band edge' : ''));
        ro.set('over', ov.length ? ov.map(n => 'channel ' + n.ch + (n.bw === 40 ? ' (40 MHz)' : '')).join(', ') : 'nothing: clear');
        ro.set('clear', list(free));
        ro.set('best', b.ch + (b.p > 0.01 ? ' (some leakage)' : '') + (b.ch === 26 ? ' · band edge' : ''));
        ro.set('air', kit.fmt(total * 1e3, 3) + ' ms for ' + (L + 6) + ' bytes at 250 kbit/s');
        ro.set('rate', kit.fmt(rate / 1000, 3) + ' kbit/s (' + kit.fmt(1 / cycle, 3) + ' frames a second)');
      }, box.stage);
      kit.click(st, p => {
        let nearest = 11, bd = 1e9;
        for (let ch = 11; ch <= 26; ch++) { const d = Math.abs(geo.x0 + (freq(ch) - 2399) / 87 * (geo.x1 - geo.x0) - p.x); if (d < bd) { bd = d; nearest = ch; } }
        if (bd < 22) ctl.set('ch', nearest, true);
      }, p => p.y > geo.yTop && p.y < geo.yb + 24);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ zt-zigbee-mesh */
  Hyper.sim('zt-zigbee-mesh', {
    title: 'A Zigbee network: forming, routing and healing',
    blurb: `The **hub** (the coordinator) forms the network; mains-powered **lamps** (routers) and battery **sensors** (end devices) join one at a time through the nearest router. A message from a sensor goes to its parent, then hops from router to router to the hub. Click a lamp to switch it off.

**Try this**
- Press **Send a message** from the Door sensor: it takes four hops. The first time, a **route discovery** (the ripples) finds the way and the hub remembers it.
- Press **Fail the router on the route** and send again: the cached route is broken, a new discovery finds the other branch, and the message still arrives.
- Switch off the **Lamp D** that carries the Door sensor: the sensor is an orphan, nobody else is in range. Raise the **radio range** until another lamp can adopt it.
- Switch off **Lamp C**, the middle of the mesh: Lamps D and E, and what hangs off them, are cut off. A mesh needs routers in the right places.

The distances and the half-second per hop are for the eye; a real hop takes a few milliseconds, and a child notices a dead parent after several missed polls, which can take seconds to minutes.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 340, maxH: 540 });
      const N = [
        { id: 'hub', kind: 'gateway', label: 'Hub', role: 'coordinator', x: 0.09, y: 0.5 },
        { id: 'a', kind: 'bulb', label: 'Lamp A', role: 'router', x: 0.3, y: 0.2 },
        { id: 'b', kind: 'bulb', label: 'Lamp B', role: 'router', x: 0.3, y: 0.8 },
        { id: 'c', kind: 'bulb', label: 'Lamp C', role: 'router', x: 0.52, y: 0.5 },
        { id: 'd', kind: 'bulb', label: 'Lamp D', role: 'router', x: 0.72, y: 0.2 },
        { id: 'e', kind: 'bulb', label: 'Lamp E', role: 'router', x: 0.72, y: 0.8 },
        { id: 's1', kind: 'sensor', label: 'Door', role: 'end', x: 0.92, y: 0.14 },
        { id: 's2', kind: 'sensor', label: 'Motion', role: 'end', x: 0.52, y: 0.92 },
        { id: 's3', kind: 'sensor', label: 'Temp', role: 'end', x: 0.09, y: 0.9 }
      ];
      const RATIO = 0.74, TOP = 26, BOT = 46;
      const isRouter = n => n.role !== 'end';
      const dist = (a, b) => Math.hypot(a.x - b.x, (a.y - b.y) * RATIO);
      const hue = n => n.role === 'coordinator' ? 215 : n.role === 'router' ? 150 : 38;
      const joined = N.map(() => false), parent = N.map(() => -1), failed = N.map(() => false), orphanAt = N.map(() => -1), flash = N.map(() => 0);
      let clock = 0, nextJoin = 0.4, phase = 'forming', note = 'The hub forms the network on channel 25 (' + E.zigbeeChannel(25) + ' MHz).', range = 0.32;
      let msg = null, cache = {};
      const ctl = kit.controls(box.side, [
        { id: 'from', type: 'select', label: 'Send a message from', options: N.map((n, i) => [n.label, i]).filter(o => o[1] > 0), value: 6 },
        { id: 'range', label: 'Radio range', min: 20, max: 60, step: 1, value: 32, unit: '% of the width' },
        { id: 'links', type: 'check', label: 'Show every radio link', value: true },
        { type: 'buttons', items: [{ id: 'send', label: 'Send a message', primary: true }, { id: 'cut', label: 'Fail the router on the route' }, { id: 'again', label: 'Start again' }] }
      ], (id, v) => {
        if (id === 'send') send();
        else if (id === 'cut') cutRoute();
        else if (id === 'again') restart();
        else if (id === 'range') { range = v / 100; cache = {}; if (phase === 'formed') { phase = 'forming'; nextJoin = clock + 0.3; } note = 'Radio range is now ' + Math.round(v) + ' % of the width.'; }
        loop.start();
      });
      const ro = kit.readout(box.side, [['net', 'Network'], ['route', 'Route'], ['hops', 'Hops'], ['delay', 'Time on a real network'], ['event', 'Last event']]);
      range = ctl.values.range / 100;

      function restart() {
        N.forEach((n, i) => { joined[i] = i === 0; parent[i] = -1; failed[i] = false; orphanAt[i] = -1; flash[i] = i === 0 ? 1 : 0; });
        clock = 0; nextJoin = 0.5; phase = 'forming'; msg = null; cache = {};
        note = 'The hub forms the network on channel 25 (' + E.zigbeeChannel(25) + ' MHz) and opens permit join.';
      }
      function bestParent(i) {
        let best = -1, bd = 1e9;
        N.forEach((m, j) => {
          if (j === i || !isRouter(m) || !joined[j] || failed[j]) return;
          const d = dist(N[i], m);
          if (d <= range && d < bd) { bd = d; best = j; }
        });
        return best;
      }
      function formStep() {
        let pick = -1, pickP = -1;
        for (const wantRouter of [true, false]) {
          let bd = 1e9;
          N.forEach((m, i) => {
            if (joined[i] || failed[i] || isRouter(m) !== wantRouter) return;
            const p = bestParent(i);
            if (p >= 0 && dist(m, N[p]) < bd) { bd = dist(m, N[p]); pick = i; pickP = p; }
          });
          if (pick >= 0) break;
        }
        if (pick < 0) { phase = 'formed'; const miss = N.filter((m, i) => !joined[i]).map(m => m.label); note = miss.length ? 'Formed. Out of range of any router: ' + miss.join(', ') + '.' : 'Formed: every device found a parent.'; return; }
        joined[pick] = true; parent[pick] = pickP; flash[pick] = 1;
        note = N[pick].label + ' asked ' + N[pickP].label + ' to be its parent and received the network key.';
      }
      // the route from a device to the hub through the routers that are alive, or null
      function routeFrom(i) {
        if (i === 0 || !joined[i] || failed[i]) return null;
        let start = i, pre = [];
        if (!isRouter(N[i])) { const p = parent[i]; if (p < 0 || failed[p] || !joined[p]) return null; pre = [i]; start = p; }
        const prev = new Map([[start, -1]]), q = [start];
        while (q.length) {
          const u = q.shift();
          if (u === 0) break;
          for (let v = 0; v < N.length; v++) if (isRouter(N[v]) && joined[v] && !failed[v] && !prev.has(v) && dist(N[u], N[v]) <= range) { prev.set(v, u); q.push(v); }
        }
        if (!prev.has(0)) return null;
        const path = [];
        for (let u = 0; u !== -1; u = prev.get(u)) path.push(u);
        path.reverse();
        return pre.concat(path);
      }
      const valid = p => p && p.every(i => joined[i] && !failed[i]);
      function send() {
        const i = Math.round(ctl.values.from);
        if (phase !== 'formed') { note = 'Wait for the network to form first.'; return; }
        if (!joined[i]) { note = N[i].label + ' has not joined: it is out of range of every router.'; return; }
        const known = cache[i];
        msg = { from: i, state: valid(known) ? 'travel' : 'discover', t: 0, seg: 0, f: 0, path: valid(known) ? known : null };
        note = msg.state === 'discover' ? N[i].label + ' has no route: the first router floods a route request.' : 'The cached route is still good: ' + N[i].label + ' sends at once.';
      }
      function failNode(i, on) {
        if (i <= 0) return;
        failed[i] = on;
        if (on) N.forEach((m, j) => { if (!isRouter(m) && parent[j] === i) { parent[j] = -1; orphanAt[j] = clock; } });
        note = N[i].label + (on ? ' was switched off.' : ' is back on.') + (on && N.some((m, j) => !isRouter(m) && joined[j] && parent[j] < 0) ? ' Its children are orphans and look for a new parent.' : '');
      }
      function cutRoute() {
        const i = Math.round(ctl.values.from), p = valid(cache[i]) ? cache[i] : routeFrom(i);
        if (!p) { note = 'There is no route to cut.'; return; }
        const relays = p.slice(1, -1).filter(k => isRouter(N[k])), relay = relays.length ? relays[relays.length - 1] : null;
        if (relay == null) { note = 'This message goes straight to the hub: nothing to fail on the way.'; return; }
        failNode(relay, true);
      }
      function update(dt) {
        clock += dt;
        for (let i = 0; i < N.length; i++) flash[i] = Math.max(0, flash[i] - dt * 1.4);
        if (phase === 'forming' && clock >= nextJoin) { formStep(); nextJoin = clock + 0.6; }
        N.forEach((m, j) => {
          if (isRouter(m) || !joined[j] || parent[j] >= 0 || failed[j]) return;
          if (clock - orphanAt[j] > 1.6) {
            const p = bestParent(j);
            if (p >= 0) { parent[j] = p; flash[j] = 1; note = m.label + ' scanned, found ' + N[p].label + ' and rejoined through it.'; }
            else orphanAt[j] = clock;
          }
        });
        if (msg) {
          if (msg.state === 'discover') {
            msg.t += dt;
            if (msg.t > 0.95) {
              const p = routeFrom(msg.from);
              if (p) { msg.path = p; cache[msg.from] = p; msg.state = 'travel'; msg.seg = 0; msg.f = 0; note = 'Route found: ' + p.map(k => N[k].label).join(' → ') + '.'; }
              else { msg.state = 'fail'; msg.t = 0; note = 'No route to the hub: the network is cut in two for this device.'; }
            }
          } else if (msg.state === 'travel') {
            msg.f += dt / 0.5;
            if (msg.f >= 1) { msg.seg++; msg.f = 0; if (msg.seg >= msg.path.length - 1) { msg.state = 'done'; msg.t = 0; note = 'Delivered to the hub in ' + (msg.path.length - 1) + ' hops.'; } }
          } else { msg.t += dt; if (msg.t > 4) msg = null; }
        }
      }
      const P = i => [N[i].x * st.W, TOP + N[i].y * (st.H - TOP - BOT)];
      const loop = kit.loop((dt) => {
        update(Math.min(dt, 0.05));
        const c = st.begin(), C = kit.colors(), r = clamp(st.W / 38, 11, 17);
        // radio links between joined routers
        if (ctl.values.links) {
          for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) {
            if (!isRouter(N[i]) || !isRouter(N[j]) || !joined[i] || !joined[j] || dist(N[i], N[j]) > range) continue;
            const a = P(i), b = P(j), dead = failed[i] || failed[j];
            S.link(c, a[0], a[1], b[0], b[1], { color: dead ? C.faint : C.border2, width: 1.2, dash: dead });
          }
        }
        // a child and its parent
        N.forEach((m, i) => { if (!isRouter(m) && joined[i] && parent[i] >= 0) { const a = P(i), b = P(parent[i]); S.link(c, a[0], a[1], b[0], b[1], { color: C.faint, width: 1.4, wireless: true }); } });
        // the route being used
        const route = msg && msg.path ? msg.path : null;
        if (route) for (let k = 0; k < route.length - 1; k++) {
          const a = P(route[k]), b = P(route[k + 1]);
          S.link(c, a[0], a[1], b[0], b[1], { color: C.accent, width: msg.state === 'travel' || msg.state === 'done' ? 3 : 1.6 });
        }
        // the devices
        N.forEach((m, i) => {
          const p = P(i), orphan = !isRouter(m) && joined[i] && parent[i] < 0 && !failed[i];
          S.node(c, p[0], p[1], { kind: m.kind, label: m.label, sub: st.W >= 560 ? (!joined[i] ? 'not joined' : failed[i] ? 'off' : orphan ? 'orphan' : m.role) : undefined, r, color: hue(m), dim: !joined[i] || failed[i], active: flash[i] > 0.05 });
          if (orphan) { c.save(); c.strokeStyle = C.warn; c.lineWidth = 2; c.setLineDash([3, 3]); c.beginPath(); c.arc(p[0], p[1], r * 1.5, 0, Math.PI * 2); c.stroke(); c.restore(); }
          if (failed[i]) { c.save(); c.strokeStyle = C.bad; c.lineWidth = 2.5; c.beginPath(); c.moveTo(p[0] - r, p[1] - r); c.lineTo(p[0] + r, p[1] + r); c.moveTo(p[0] + r, p[1] - r); c.lineTo(p[0] - r, p[1] + r); c.stroke(); c.restore(); }
        });
        // the message
        if (msg) {
          const o = P(msg.from);
          if (msg.state === 'discover') S.radio(c, o[0], o[1], { r: r * 4, phase: msg.t * 1.3, color: C.warn });
          else if (msg.state === 'travel') { const a = P(msg.path[msg.seg]), b = P(msg.path[msg.seg + 1]); S.msg(c, a[0], a[1], b[0], b[1], msg.f, { color: C.accent, label: 'hop ' + (msg.seg + 1) }); }
          else if (msg.state === 'fail') { c.save(); c.strokeStyle = C.bad; c.lineWidth = 3; c.beginPath(); c.arc(o[0], o[1], r * 1.8, 0, Math.PI * 2); c.stroke(); c.restore(); }
        }
        // legend and the last event
        [['coordinator', 215], ['router, mains', 150], ['end device, battery', 38]].forEach(([t, h], i) => {
          const lx = 12 + i * Math.min(150, (st.W - 24) / 3);
          c.fillStyle = kit.hue(h); c.fillRect(lx, st.H - 38, 10, 10); kit.label(c, t, lx + 15, st.H - 33, { size: 10.5, color: C.text2 });
        });
        kit.label(c, short(note, Math.floor((st.W - 24) / 6.1)), 12, st.H - 14, { size: 11, color: C.text2 });
        kit.label(c, 'channel 25 · PAN 0x1A62', st.W - 12, 12, { size: 10, color: C.faint, align: 'right' });
        // read-outs
        const n = joined.filter(Boolean).length, rt = msg && msg.path ? msg.path : (valid(cache[Math.round(ctl.values.from)]) ? cache[Math.round(ctl.values.from)] : null);
        ro.set('net', (phase === 'forming' ? 'forming: ' : 'formed: ') + n + ' of ' + N.length + ' joined');
        ro.set('route', rt ? rt.map(k => N[k].label).join(' → ') : 'none known');
        ro.set('hops', rt ? String(rt.length - 1) : '—');
        ro.set('delay', rt ? 'about ' + kit.fmt((rt.length - 1) * 5, 2) + ' ms (5 ms a hop)' : '—');
        ro.set('event', short(note, 70));
        if (phase !== 'forming' && !msg && !N.some((m, j) => !isRouter(m) && joined[j] && parent[j] < 0 && !failed[j]) && !flash.some(f => f > 0.05)) loop.stop();
      }, box.stage);
      kit.click(st, p => {
        let hit = -1, bd = 1e9;
        N.forEach((m, i) => { const q = P(i), d = Math.hypot(q[0] - p.x, q[1] - p.y); if (d < bd) { bd = d; hit = i; } });
        if (hit > 0 && bd < 26 && isRouter(N[hit]) && joined[hit]) { failNode(hit, !failed[hit]); msg = null; cache = {}; loop.start(); }
      }, p => N.some((m, i) => i > 0 && isRouter(m) && Math.hypot(P(i)[0] - p.x, P(i)[1] - p.y) < 26));
      st.onResize(() => loop.once());
      restart();
      loop.start();
    }
  });

  /* ================================================================ zt-sleepy-poll */
  Hyper.sim('zt-sleepy-poll', {
    title: 'A sleepy end device and its parent',
    blurb: `A battery device keeps its radio off and wakes every **poll period** to ask its parent router, "anything for me?". A command that reaches the parent between polls (the amber bar) must wait for the next one. The graph underneath shows how long the chosen battery lasts at each poll period.

**Try this**
- Send a command right after a poll and right before one: the wait is almost the whole period, or almost nothing, and **on average half a period**.
- Shorten the poll period to 0.25 s: the lamp-switch feels instant and the cell lasts days. Lengthen it to a minute: a valve or a lock can wait, and the cell lasts years.
- Find the **knee**: past about 18 s the polling costs less than the 7 µA of sleep, and waiting longer gains less and less.
- Change the cell: a coin cell cannot give the radio's peak current without a capacitor, a point the numbers do not show.

Currents come from the ESP32-H2 entry of the chip catalogue: 7 µA asleep, 25 mA receiving. A poll is modelled as 5 ms of reception and a command as 20 ms; the board's regulator, sensors and LED are not counted, and they are often what really drains the cell.`,
    mount(box, kit) {
      const E = kit.esp;
      const chip = E.chip('esp32-h2') || {};
      const RX = chip.rxMa || 25, SLEEP = (chip.sleepUa != null ? chip.sleepUa : 7) / 1000;     // mA
      const T_POLL = 0.005, T_ACT = 0.02, SHOW = 2.4;       // seconds of radio per poll, per command; real seconds a period takes on the screen
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 420, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'period', label: 'Poll period', min: 0.25, max: 120, value: 10, unit: 's', log: true, sig: 2 },
        { id: 'cmds', label: 'Commands a day', min: 0, max: 500, step: 1, value: 20 },
        { id: 'cell', type: 'select', label: 'Battery', options: [['CR2032 coin cell, 225 mAh', 'cr2032'], ['CR123A lithium, 1500 mAh', 'cr123a'], ['2 × AA alkaline, 2500 mAh', 'aa2']], value: 'cr123a' },
        { type: 'buttons', items: [{ id: 'send', label: 'Send a command now', primary: true }] }
      ], (id) => { if (id === 'period' || id === 'cell') cmdList = []; if (id === 'send') sendNow(); loop.once(); });
      const ro = kit.readout(box.side, [['avg', 'Average current'], ['life', 'Battery lasts'], ['delay', 'Delay of a command'], ['share', 'Spent on polling']]);
      let tSim = 0, cmdList = [], seed = 12345, nextAuto = 1.3 * ctl.values.period;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      const model = P => {
        const cell = E.CELLS.find(c => c.id === ctl.values.cell) || E.CELLS[0];
        const poll = RX * T_POLL / P, act = ctl.values.cmds / 86400 * RX * T_ACT, avg = SLEEP + poll + act;
        return { avg, poll, act, cell, life: E.batteryLife(cell.mAh, avg, { cell: cell.id }) };
      };
      const fetchAt = (tA, P) => (Math.floor(tA / P + 1e-9) + 1) * P;
      function sendNow() { const P = ctl.values.period; cmdList.push({ tA: tSim, tF: fetchAt(tSim, P) }); }
      const fmtT = s => s < 1 ? kit.fmt(s * 1000, 3) + ' ms' : s < 120 ? kit.fmt(s, 3) + ' s' : kit.fmt(s / 60, 3) + ' min';
      const loop = kit.loop((dt) => {
        const P = ctl.values.period;
        tSim += dt * P / SHOW;
        if (tSim >= nextAuto) { cmdList.push({ tA: nextAuto, tF: fetchAt(nextAuto, P) }); nextAuto += P * (2.2 + rnd() * 1.6); }
        const win = 4.4 * P, t0 = tSim - 3.4 * P, t1 = tSim + P;
        cmdList = cmdList.filter(k => k.tF > t0 - P);
        const c = st.begin(), C = kit.colors(), M = model(P);
        const narrow = st.W < 520, px = narrow ? 64 : 92, pw = Math.max(80, st.W - px - 14), X = t => px + clamp((t - t0) / win, 0, 1) * pw;
        const lanes = [['Hub', 'sends'], ['Parent', 'holds'], ['Child', 'radio']], ly = [46, 92, 138], lh = 30;
        kit.label(c, 'Each dashed line is one poll, every ' + fmtT(P) + '. Time runs left to right.', 12, 16, { size: 11, color: C.text2 });
        lanes.forEach(([a, b], i) => {
          c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; c.fillRect(px, ly[i], pw, lh);
          kit.label(c, a, px - 8, ly[i] + lh / 2 - 6, { size: 11.5, weight: 650, align: 'right' });
          kit.label(c, b, px - 8, ly[i] + lh / 2 + 8, { size: 10, color: C.muted, align: 'right' });
        });
        // polls
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 4]);
        for (let k = Math.ceil(t0 / P); k * P <= t1; k++) { const x = X(k * P); c.beginPath(); c.moveTo(x, ly[0] - 4); c.lineTo(x, ly[2] + lh + 4); c.stroke(); }
        c.restore();
        for (let k = Math.ceil(t0 / P); k * P <= t1; k++) {
          const tp = k * P, fetched = cmdList.some(q => Math.abs(q.tF - tp) < 1e-6 * P + 1e-9), x = X(tp), w = Math.max(2.5, (fetched ? T_ACT : T_POLL) / win * pw);
          c.fillStyle = fetched ? C.accent : C.muted; c.fillRect(x - w / 2, ly[2] + (fetched ? 2 : 8), w, fetched ? lh - 4 : lh - 16);
        }
        // commands and the wait
        cmdList.forEach(q => {
          const xa = X(q.tA), xe = X(Math.min(q.tF, tSim));
          if (q.tA <= tSim) {
            c.save(); c.globalAlpha = 0.55; c.fillStyle = C.warn; c.fillRect(xa, ly[1] + 6, Math.max(0, xe - xa), lh - 12); c.restore();
            c.fillStyle = C.warn; c.beginPath(); c.moveTo(xa, ly[0] + lh - 4); c.lineTo(xa - 6, ly[0] + 6); c.lineTo(xa + 6, ly[0] + 6); c.closePath(); c.fill();
            if (xe - xa > 70) kit.label(c, 'waits ' + fmtT(Math.min(q.tF, tSim) - q.tA), (xa + xe) / 2, ly[1] + lh / 2, { size: 10.5, align: 'center' });
          }
          if (q.tF <= tSim && q.tF > t0 && xe - xa <= 70) kit.label(c, fmtT(q.tF - q.tA), X(q.tF) + 6, ly[1] + lh / 2, { size: 10, color: C.muted });
        });
        const nx = X(tSim);
        c.strokeStyle = C.text; c.lineWidth = 1.4; c.beginPath(); c.moveTo(nx, ly[0] - 6); c.lineTo(nx, ly[2] + lh + 6); c.stroke();
        kit.label(c, 'now', nx, ly[2] + lh + 16, { size: 10, color: C.muted, align: 'center' });
        // the curve: battery life against poll period
        const gy = ly[2] + lh + 46, gh = Math.max(90, st.H - gy - 46), gx = px, gw = pw;
        const LO = 0.05, HI = 40, PL = 0.25, PH = 120;
        const GX = p => gx + Math.log(p / PL) / Math.log(PH / PL) * gw, GY = y => gy + gh - clamp(Math.log(Math.max(y, LO) / LO) / Math.log(HI / LO), 0, 1) * gh;
        kit.label(c, 'Battery life against poll period (' + M.cell.name.split(',')[0] + ')', 12, gy - 14, { size: 11.5, weight: 650 });
        c.strokeStyle = C.grid; c.lineWidth = 1;
        [0.1, 1, 10].forEach(y => { c.beginPath(); c.moveTo(gx, GY(y) + 0.5); c.lineTo(gx + gw, GY(y) + 0.5); c.stroke(); kit.label(c, y + ' y', gx - 6, GY(y), { size: 10, color: C.muted, align: 'right' }); });
        [0.25, 1, 10, 100].forEach(p => { c.beginPath(); c.moveTo(GX(p) + 0.5, gy); c.lineTo(GX(p) + 0.5, gy + gh); c.stroke(); kit.label(c, p + ' s', GX(p), gy + gh + 12, { size: 10, color: C.muted, align: 'center' }); });
        c.beginPath();
        for (let i = 0; i <= 60; i++) { const p = PL * Math.pow(PH / PL, i / 60), y = GY(model(p).life.years); if (i) c.lineTo(GX(p), y); else c.moveTo(GX(p), y); }
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.stroke();
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx, gy + gh); c.lineTo(gx + gw, gy + gh); c.stroke();
        kit.dot(c, GX(P), GY(M.life.years), 6, C.warn, C.text);
        kit.label(c, 'poll period', gx + gw / 2, gy + gh + 28, { size: 10, color: C.muted, align: 'center' });
        // numbers
        ro.set('avg', kit.fmt(M.avg * 1000, 3) + ' µA (sleep ' + kit.fmt(SLEEP * 1000, 2) + ' + polls ' + kit.fmt(M.poll * 1000, 3) + ' + commands ' + kit.fmt(M.act * 1000, 2) + ')');
        ro.set('life', M.life.years >= 1 ? kit.fmt(M.life.years, 3) + ' years' : kit.fmt(M.life.days, 3) + ' days');
        ro.set('delay', 'on average ' + fmtT(P / 2) + ', at worst ' + fmtT(P));
        ro.set('share', kit.fmt(100 * M.poll / M.avg, 3) + ' % of the average current');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ zt-clusters */
  const CL = {
    basic: { id: 0x0000, name: 'Basic', note: 'Who the device is. A hub reads the manufacturer and model to recognise it and pick the right entities.',
      attrs: [[0x0004, 'ManufacturerName', 'string', V => V.maker], [0x0005, 'ModelIdentifier', 'string', V => V.model], [0x0007, 'PowerSource', 'enum8', V => (V.battery ? '0x03  (battery)' : '0x01  (mains, single phase)')]],
      cmds: [['Reset to factory defaults', 0x00, V => 'the device forgets its settings (but not its network)']] },
    powercfg: { id: 0x0001, name: 'Power Configuration', note: 'The battery. Raw numbers are scaled: the voltage in units of 100 mV, the charge in half-percents (200 means 100 %).',
      attrs: [[0x0020, 'BatteryVoltage', 'uint8', V => Math.round((2.4 + 0.006 * V.batt) * 10) + '  (units of 100 mV)'], [0x0021, 'BatteryPercentageRemaining', 'uint8', V => Math.round(V.batt * 2) + '  (' + Math.round(V.batt) + ' %)']],
      cmds: [], measure: { key: 'batt', lo: 0, hi: 100, step: 1, unit: '%' } },
    identify: { id: 0x0003, name: 'Identify', note: 'Makes the device show itself, by blinking or beeping, so you can tell which one you are configuring.',
      attrs: [[0x0000, 'IdentifyTime', 'uint16', V => V.identify + ' s']], cmds: [['Identify for 5 s', 0x00, V => { V.identify = 5; return 'the device blinks or beeps for 5 s'; }]] },
    groups: { id: 0x0004, name: 'Groups', note: 'Lets one message address many devices at once: every lamp in a group switches together, with no per-lamp traffic.',
      attrs: [[0x0000, 'NameSupport', 'bitmap8', V => '0x00  (' + V.groups + ' group' + (V.groups === 1 ? '' : 's') + ' joined)']], cmds: [['Add group 0x0001', 0x00, V => { V.groups++; return 'the device now answers to group 0x0001'; }]] },
    scenes: { id: 0x0005, name: 'Scenes', note: 'Stores the settings of several clusters (on/off, level, colour) under one number and recalls them together.',
      attrs: [[0x0000, 'SceneCount', 'uint8', V => String(V.scenes)]], cmds: [['Store scene 1', 0x04, V => { V.scenes++; return 'scene 1 stored: the current on/off and level'; }], ['Recall scene 1', 0x05, V => 'the stored settings are applied at once']] },
    onoff: { id: 0x0006, name: 'On/Off', note: 'The simplest cluster: one boolean. Three commands change it, and the device reports the new value.',
      attrs: [[0x0000, 'OnOff', 'boolean', V => (V.onoff ? 'true  (on)' : 'false  (off)')]],
      cmds: [['Off', 0x00, V => { V.onoff = false; return 'OnOff becomes false'; }], ['On', 0x01, V => { V.onoff = true; return 'OnOff becomes true'; }], ['Toggle', 0x02, V => { V.onoff = !V.onoff; return 'OnOff becomes ' + V.onoff; }]] },
    level: { id: 0x0008, name: 'Level Control', note: 'A level from 0 to 254, for brightness or speed. "Move to level with on/off" also switches the lamp on or off at the ends.',
      attrs: [[0x0000, 'CurrentLevel', 'uint8', V => V.level + '  (' + Math.round(V.level / 254 * 100) + ' % of 254)']],
      cmds: [['Move to 25 %', 0x04, V => { V.level = Math.round(0.25 * 254); V.onoff = true; return 'CurrentLevel becomes ' + V.level + ' and the lamp is on'; }], ['Move to 100 %', 0x04, V => { V.level = 254; V.onoff = true; return 'CurrentLevel becomes 254'; }], ['Move to 0 (off)', 0x04, V => { V.level = 0; V.onoff = false; return 'the level reaches 0 and the lamp switches off'; }]] },
    temp: { id: 0x0402, name: 'Temperature Measurement', note: 'A temperature as a signed integer in hundredths of a degree: 21.5 °C is sent as 2150. The sensor reports it when it changes by more than a set amount, or when its maximum interval is up.',
      attrs: [[0x0000, 'MeasuredValue', 'int16', V => Math.round(V.temp * 100) + '  (' + V.temp.toFixed(1) + ' °C)'], [0x0001, 'MinMeasuredValue', 'int16', V => '-4000  (−40 °C, example)'], [0x0002, 'MaxMeasuredValue', 'int16', V => '8500  (85 °C, example)']],
      cmds: [], measure: { key: 'temp', lo: -10, hi: 40, step: 0.5, unit: '°C' } },
    humidity: { id: 0x0405, name: 'Relative Humidity', note: 'Humidity in hundredths of a percent: 45 % is sent as 4500.',
      attrs: [[0x0000, 'MeasuredValue', 'uint16', V => Math.round(V.hum * 100) + '  (' + Math.round(V.hum) + ' %)']], cmds: [], measure: { key: 'hum', lo: 0, hi: 100, step: 1, unit: '%' } },
    elecmeas: { id: 0x0B04, name: 'Electrical Measurement', note: 'Voltage, current and power. The raw numbers are scaled by multiplier and divisor attributes of the same cluster: always read those too.',
      attrs: [[0x0505, 'RMSVoltage', 'uint16', V => '230  (V)'], [0x050B, 'ActivePower', 'int16', V => Math.round(V.onoff ? V.power : 0) + '  (W)']],
      cmds: [], measure: { key: 'power', lo: 0, hi: 2000, step: 10, unit: 'W' } },
    iaszone: { id: 0x0500, name: 'IAS Zone', note: 'The cluster of alarm-type sensors: a door contact is a "zone". The device pushes a status-change notification the moment the zone changes.',
      attrs: [[0x0000, 'ZoneState', 'enum8', V => '0x01  (enrolled with the hub)'], [0x0001, 'ZoneType', 'enum16', V => '0x0015  (contact switch)'], [0x0002, 'ZoneStatus', 'bitmap16', V => (V.open ? '0x0001  (alarm: opened)' : '0x0000  (closed)')]],
      cmds: [['Door opens', 0x00, V => { V.open = true; return 'the sensor sends a Zone Status Change Notification, ZoneStatus 0x0001'; }], ['Door closes', 0x00, V => { V.open = false; return 'the sensor sends a Zone Status Change Notification, ZoneStatus 0x0000'; }]] },
    thermostat: { id: 0x0201, name: 'Thermostat', note: 'Temperatures in hundredths of a degree again. The setpoint is where you steer the room to; the system mode says whether the heating is allowed to run.',
      attrs: [[0x0000, 'LocalTemperature', 'int16', V => Math.round(V.temp * 100) + '  (' + V.temp.toFixed(1) + ' °C)'], [0x0012, 'OccupiedHeatingSetpoint', 'int16', V => Math.round(V.heat * 100) + '  (' + V.heat.toFixed(1) + ' °C)'], [0x001C, 'SystemMode', 'enum8', V => (V.mode === 'heat' ? '0x04  (heat)' : '0x00  (off)')]],
      cmds: [['Raise 0.5 °C', 0x00, V => { V.heat = Math.min(30, V.heat + 0.5); return 'setpoint becomes ' + V.heat.toFixed(1) + ' °C'; }], ['Lower 0.5 °C', 0x00, V => { V.heat = Math.max(5, V.heat - 0.5); return 'setpoint becomes ' + V.heat.toFixed(1) + ' °C'; }], ['Heat / off', 0x00, V => { V.mode = V.mode === 'heat' ? 'off' : 'heat'; return 'SystemMode becomes ' + V.mode; }]] },
    windowcov: { id: 0x0102, name: 'Window Covering', note: 'A blind. The position is a percentage closed: 0 is fully open and 100 fully closed, the other way round from what most people expect.',
      attrs: [[0x0008, 'CurrentPositionLiftPercentage', 'uint8', V => V.lift + ' % closed']],
      cmds: [['Up / Open', 0x00, V => { V.lift = 0; return 'the blind runs fully open'; }], ['Down / Close', 0x01, V => { V.lift = 100; return 'the blind runs fully closed'; }], ['Stop', 0x02, V => 'the motor stops where it is'], ['Go to 50 %', 0x05, V => { V.lift = 50; return 'the blind runs to 50 % closed'; }]] },
    poll: { id: 0x0020, name: 'Poll Control', note: 'For sleepy devices: how often they poll their parent normally, how often right after something happens, and how often they check in with the hub.',
      attrs: [[0x0000, 'CheckInInterval', 'uint32', V => '14400  (quarter-seconds: 1 hour, example)'], [0x0001, 'LongPollInterval', 'uint32', V => '24  (6 s, example)'], [0x0002, 'ShortPollInterval', 'uint16', V => '2  (0.5 s, example)']], cmds: [] }
  };
  const DEV = {
    light: { name: 'Dimmable light', did: 0x0101, maker: 'Acme', model: 'DL-1', battery: false, srv: ['basic', 'identify', 'groups', 'scenes', 'onoff', 'level'], cli: 'OTA Upgrade 0x0019', start: 'onoff',
      ha: V => 'light: ' + (V.onoff ? 'on, brightness ' + Math.round(V.level / 254 * 100) + ' %' : 'off') },
    esplight: { name: 'On/off light, as in the ESP32 example', did: 0x0100, maker: 'Espressif', model: 'ZBLightBulb', battery: false, srv: ['basic', 'identify', 'groups', 'scenes', 'onoff'], cli: 'none', start: 'basic',
      ha: V => 'light: ' + (V.onoff ? 'on' : 'off') },
    climate: { name: 'Temperature and humidity sensor', did: 0x0302, maker: 'Acme', model: 'TH-1', battery: true, srv: ['basic', 'powercfg', 'identify', 'temp', 'humidity', 'poll'], cli: 'Identify 0x0003, OTA Upgrade 0x0019', start: 'temp',
      ha: V => 'sensors: ' + V.temp.toFixed(1) + ' °C, ' + Math.round(V.hum) + ' %, battery ' + Math.round(V.batt) + ' %' },
    plug: { name: 'Smart plug with power metering', did: 0x0051, maker: 'Acme', model: 'SP-2', battery: false, srv: ['basic', 'identify', 'groups', 'scenes', 'onoff', 'elecmeas'], cli: 'OTA Upgrade 0x0019', start: 'onoff',
      ha: V => 'switch: ' + (V.onoff ? 'on' : 'off') + ' · sensor: ' + Math.round(V.onoff ? V.power : 0) + ' W' },
    contact: { name: 'Door and window contact sensor', did: 0x0402, maker: 'Acme', model: 'DC-1', battery: true, srv: ['basic', 'powercfg', 'identify', 'iaszone', 'poll'], cli: 'OTA Upgrade 0x0019', start: 'iaszone',
      ha: V => 'binary sensor: ' + (V.open ? 'open' : 'closed') + ' · battery ' + Math.round(V.batt) + ' %' },
    thermostat: { name: 'Thermostat', did: 0x0301, maker: 'Acme', model: 'TS-1', battery: false, srv: ['basic', 'identify', 'thermostat', 'temp'], cli: 'OTA Upgrade 0x0019', start: 'thermostat',
      ha: V => 'climate: heating to ' + V.heat.toFixed(1) + ' °C, room ' + V.temp.toFixed(1) + ' °C, mode ' + V.mode },
    blind: { name: 'Window blind', did: 0x0202, maker: 'Acme', model: 'WB-1', battery: false, srv: ['basic', 'identify', 'groups', 'scenes', 'windowcov'], cli: 'OTA Upgrade 0x0019', start: 'windowcov',
      ha: V => 'cover: ' + (100 - V.lift) + ' % open' }
  };

  Hyper.sim('zt-clusters', {
    title: 'The endpoints and clusters of a Zigbee device',
    blurb: `A Zigbee device is a list of **clusters** on an **endpoint**. Every chip in the row is a standard bundle of attributes and commands, with a fixed number. Click a cluster to read its attributes, and click a command to send it.

**Try this**
- Choose **Dimmable light**, open **On/Off**, press *Toggle*, then open **Level Control** and move it to 25 %.
- Open **Temperature Measurement** on the sensor and move the *reading* slider: the raw number is the temperature times a hundred, an integer, so that no floating point travels over the air.
- Compare the **ESP32 example** with the dimmable lamp: it has no Level Control, so a hub offers an on/off switch but no brightness.
- Look at the **blind**: position 0 means open. Standard clusters hold surprises like that, which is why a program should read the Cluster Library, not guess.

The device IDs and the cluster and attribute numbers are the standard's. The devices themselves are examples: a real product may add clusters of its own.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 480, maxH: 600 });
      const V = { maker: '', model: '', battery: false, onoff: false, level: 127, temp: 21.5, hum: 45, batt: 87, power: 600, open: false, lift: 100, heat: 21, mode: 'heat', identify: 0, groups: 0, scenes: 0 };
      let devKey = params && DEV[params.device] ? params.device : 'light', sel = 'onoff', logText = 'Nothing sent yet.', hits = [];
      const loadDevice = k => { devKey = k; const d = DEV[k]; V.maker = d.maker; V.model = d.model; V.battery = d.battery; V.onoff = false; V.identify = 0; V.groups = 0; V.scenes = 0; sel = d.start; logText = 'Nothing sent yet.'; };
      const ctl = kit.controls(box.side, [
        { id: 'dev', type: 'select', label: 'Device', options: Object.keys(DEV).map(k => [DEV[k].name, k]), value: devKey },
        { id: 'read', label: 'Reading of the selected cluster', min: 0, max: 100, step: 1, value: 50, unit: '%' }
      ], (id, v) => {
        if (id === 'dev') { loadDevice(v); syncSlider(); }
        if (id === 'read') { const m = CL[sel] && CL[sel].measure; if (m) V[m.key] = clamp(Math.round((m.lo + (m.hi - m.lo) * v / 100) / m.step) * m.step, m.lo, m.hi); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['cl', 'Selected cluster'], ['ha', 'A hub such as Home Assistant shows'], ['log', 'Last command or report']]);
      function syncSlider() { const m = CL[sel] && CL[sel].measure; ctl.show('read', !!m); if (m) ctl.set('read', clamp((V[m.key] - m.lo) / (m.hi - m.lo) * 100, 0, 100), false); }
      loadDevice(devKey); syncSlider();
      const wrap = (t, n) => { const out = []; let line = ''; String(t).split(' ').forEach(w => { if ((line + ' ' + w).trim().length > n) { out.push(line.trim()); line = w; } else line += ' ' + w; }); if (line.trim()) out.push(line.trim()); return out; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), d = DEV[devKey], W = st.W, M = 12, wide = W >= 600;
        hits = [];
        kit.label(c, d.name, M, 16, { size: 14, weight: 650 });
        kit.label(c, 'Device ID ' + hex(d.did) + ' · endpoint 1 · profile 0x0104 (Home Automation) · ' + (d.battery ? 'battery' : 'mains') + ' powered', M, 34, { size: 10.5, color: C.muted });
        // the clusters of the endpoint
        const treeW = wide ? Math.round(W * 0.4) : W - 2 * M, chipH = 24, gap = 6;
        let cx = M, cy = 60;
        kit.label(c, 'Server clusters: what the device offers', M, cy - 10, { size: 11, color: C.text2, weight: 600 });
        d.srv.forEach(k => {
          const cl = CL[k], label = cl.name, w = Math.min(treeW, label.length * 6.1 + 14);
          if (cx + w > M + treeW + 1) { cx = M; cy += chipH + gap; }
          const on = k === sel;
          S.box(c, cx, cy, w, chipH, { label, size: 10.5, color: on ? C.accent : C.border2, active: on, r: 6 });
          hits.push({ x: cx, y: cy, w, h: chipH, fn: () => { sel = k; syncSlider(); } });
          kit.label(c, hex(cl.id), cx + w / 2, cy + chipH + 7, { size: 8.5, color: C.faint, align: 'center' });
          cx += w + gap;
        });
        cy += chipH + 24;
        kit.label(c, 'Client clusters: ' + d.cli, M, cy, { size: 10.5, color: C.muted });
        // the selected cluster
        const dx = wide ? treeW + 2 * M : M, dy = wide ? 52 : cy + 18, dw = W - dx - M, dh = Math.max(150, st.H - dy - 62);
        const cl = CL[sel] || CL[d.start];
        S.box(c, dx, dy, dw, dh, { color: C.border2, r: 8 });
        kit.label(c, cl.name + '  ·  cluster ' + hex(cl.id), dx + 10, dy + 16, { size: 12.5, weight: 650 });
        let ty = dy + 36;
        wrap(cl.note, Math.max(24, Math.floor((dw - 20) / 6))).forEach(line => { kit.label(c, line, dx + 10, ty, { size: 10.5, color: C.text2 }); ty += 14; });
        ty += 6;
        kit.label(c, 'Attributes', dx + 10, ty, { size: 10.5, color: C.muted, weight: 600 }); ty += 15;
        cl.attrs.forEach(a => {
          const val = a[3](V);
          kit.label(c, hex(a[0]), dx + 10, ty, { size: 10.5, color: C.faint });
          kit.label(c, short(a[1], Math.floor(dw / 8)), dx + 58, ty, { size: 10.5, weight: 600 });
          kit.label(c, a[2], dx + dw - 10, ty, { size: 9.5, color: C.faint, align: 'right' });
          ty += 14;
          kit.label(c, short(val, Math.floor((dw - 40) / 6.2)), dx + 28, ty, { size: 11, color: C.accent });
          ty += 18;
        });
        if (cl.cmds.length) {
          ty += 2; kit.label(c, 'Commands (click to send)', dx + 10, ty, { size: 10.5, color: C.muted, weight: 600 }); ty += 8;
          let bx = dx + 10;
          cl.cmds.forEach(cm => {
            const w = Math.min(dw - 20, cm[0].length * 6.3 + 24);
            if (bx + w > dx + dw - 8) { bx = dx + 10; ty += 30; }
            S.box(c, bx, ty, w, 24, { label: cm[0], size: 10, color: C.accent, r: 6 });
            hits.push({ x: bx, y: ty, w, h: 24, fn: () => { logText = cm[0] + ' (command ' + hex(cm[1], 2) + '): ' + cm[2](V); } });
            bx += w + 6;
          });
        } else if (cl.measure) kit.label(c, 'Use the slider to change the reading.', dx + 10, ty + 8, { size: 10.5, color: C.muted });
        // the line that says what a hub makes of it
        kit.label(c, 'A hub shows  →  ' + d.ha(V), M, st.H - 30, { size: 11.5, color: C.text, weight: 600 });
        kit.label(c, short(logText, Math.floor((W - 24) / 6.2)), M, st.H - 12, { size: 10.5, color: C.muted });
        ro.set('cl', cl.name + ' (' + hex(cl.id) + ')');
        ro.set('ha', d.ha(V));
        ro.set('log', logText);
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { h.fn(); loop.once(); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ zt-thread-network */
  Hyper.sim('zt-thread-network', {
    title: 'A Thread mesh, its leader and its border router',
    blurb: `The right-hand side is the **Thread mesh**: one **leader** (double ring), **routers** (mains lamps and the border routers), a **router-eligible end device** (Lamp 4, on the edge) and two **sleepy sensors**. The left-hand side is the home network: a phone, the Wi-Fi router and the **border router(s)** that join the two worlds. Click any device on the mesh to switch it off or on.

**Try this**
- Press **Phone switches the target**: the message crosses Wi-Fi, a border router and the mesh. The route changes with what is alive.
- Switch off the **leader** (Lamp L): the routers notice, wait a couple of seconds and **elect a new leader**. The mesh keeps working throughout.
- Switch off **Border router 1**: the mesh is fine, but the phone cannot reach it. Tick **Second border router**: now a second path exists and the phone gets through.
- Switch off two or three lamps: the mesh splits into **partitions**, each with its own leader, and merges when they return. A router-eligible end device may promote itself to a router when routers get scarce.
- **Sensor 1 to Lamp 3** is traffic inside the mesh: it needs no border router at all.

Positions and timings are for the eye. In a real mesh, roles change by themselves within seconds and every device is a normal IPv6 host.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 400, maxH: 560 });
      const T = [
        { label: 'Phone', kind: 'phone', t: 'ip' }, { label: 'Wi-Fi router', kind: 'router', t: 'ip' },
        { label: 'Border router 1', kind: 'gateway', t: 'br' }, { label: 'Border router 2', kind: 'gateway', t: 'br' },
        { label: 'Lamp L', kind: 'bulb', t: 'router' }, { label: 'Lamp 1', kind: 'bulb', t: 'router' }, { label: 'Lamp 2', kind: 'bulb', t: 'router' }, { label: 'Lamp 3', kind: 'bulb', t: 'router' },
        { label: 'Lamp 4', kind: 'bulb', t: 'reed' }, { label: 'Sensor 1', kind: 'sensor', t: 'sed' }, { label: 'Sensor 2', kind: 'sensor', t: 'sed' }
      ];
      const WIDE = [[0.07, 0.5], [0.2, 0.5], [0.34, 0.24], [0.34, 0.76], [0.52, 0.5], [0.66, 0.2], [0.66, 0.8], [0.8, 0.5], [0.88, 0.82], [0.9, 0.18], [0.52, 0.9]];
      const NARROW = [[0.12, 0.08], [0.37, 0.08], [0.62, 0.08], [0.88, 0.08], [0.5, 0.34], [0.18, 0.5], [0.82, 0.5], [0.5, 0.62], [0.82, 0.82], [0.12, 0.8], [0.5, 0.9]];
      const MESH = [[2, 4], [2, 5], [3, 4], [3, 6], [4, 5], [4, 6], [5, 7], [6, 7]];
      const ATTACH = { 8: [7, 6], 9: [5, 7], 10: [6, 3, 4] };
      const PRIO = [7, 5, 6, 2, 3, 4, 8], REED = 8, TOP = 30, BOT = 48;
      const ctl = kit.controls(box.side, [
        { id: 'target', type: 'select', label: 'The phone switches', options: [['Sensor 1 (sleepy)', 9], ['Sensor 2 (sleepy)', 10], ['Lamp 4 (router-eligible)', 8], ['Lamp 3 (router)', 7]], value: 9 },
        { id: 'br2', type: 'check', label: 'Second border router', value: !!(params && params.br2) },
        { type: 'buttons', items: [{ id: 'send', label: 'Phone switches the target', primary: true }, { id: 'local', label: 'Sensor 1 to Lamp 3' }, { id: 'restore', label: 'Switch everything back on' }] }
      ], (id) => {
        if (id === 'send') send(false);
        else if (id === 'local') send(true);
        else if (id === 'restore') reset();
        else if (id === 'br2') note = ctl.values.br2 ? 'A second border router joined the mesh.' : 'The second border router was removed.';
        loop.start();
      });
      const ro = kit.readout(box.side, [['leader', 'Leader'], ['routers', 'Routers alive'], ['parts', 'Partitions'], ['ip', 'Phone to the mesh'], ['event', 'Last event']]);
      let on, isLeader, reedUp, parentOf, attachT, flash, elect, promoT, msg, note, cs;
      const present = i => i !== 3 || !!ctl.values.br2;
      const alive = i => present(i) && on[i];
      const isR = i => T[i].t === 'br' || T[i].t === 'router' || (i === REED && reedUp);
      function reset() {
        on = T.map(() => true); isLeader = T.map((m, i) => i === 4); reedUp = false;
        parentOf = T.map(() => -1); parentOf[8] = 7; parentOf[9] = 5; parentOf[10] = 6;
        attachT = T.map(() => 0); flash = T.map(() => 0); elect = {}; promoT = 0; msg = null;
        note = 'All devices are on. Lamp L is the leader.';
      }
      function components() {
        const nodes = []; T.forEach((m, i) => { if (isR(i) && alive(i)) nodes.push(i); });
        const adj = new Map(nodes.map(i => [i, []]));
        MESH.concat(reedUp ? [[8, 7], [8, 6]] : []).forEach(([a, b]) => { if (adj.has(a) && adj.has(b)) { adj.get(a).push(b); adj.get(b).push(a); } });
        const seen = new Set(), out = [];
        nodes.forEach(s => {
          if (seen.has(s)) return;
          const comp = [], q = [s]; seen.add(s);
          while (q.length) { const u = q.shift(); comp.push(u); adj.get(u).forEach(v => { if (!seen.has(v)) { seen.add(v); q.push(v); } }); }
          out.push(comp.sort((a, b) => a - b));
        });
        return { out, adj };
      }
      function meshPath(a, b, adj) {
        if (!adj.has(a) || !adj.has(b)) return null;
        const prev = new Map([[a, -1]]), q = [a];
        while (q.length) { const u = q.shift(); if (u === b) break; adj.get(u).forEach(v => { if (!prev.has(v)) { prev.set(v, u); q.push(v); } }); }
        if (!prev.has(b)) return null;
        const p = []; for (let u = b; u !== -1; u = prev.get(u)) p.push(u);
        return p.reverse();
      }
      const attach = i => (isR(i) ? i : parentOf[i]);
      function routeIp(target) {
        const a = attach(target);
        if (!(a >= 0) || !alive(a) || !alive(target)) return null;
        let best = null;
        [2, 3].forEach(b => { if (!alive(b)) return; const mp = meshPath(b, a, cs.adj); if (mp && (!best || mp.length < best.length)) best = mp; });
        return best ? [0, 1].concat(best, isR(target) ? [] : [target]) : null;
      }
      function send(local) {
        cs = components();
        let path = null;
        if (local) { const a = attach(9); const mp = a >= 0 && alive(a) && alive(9) ? meshPath(a, 7, cs.adj) : null; path = mp ? [9].concat(mp) : null; if (!alive(7)) path = null; }
        else path = routeIp(Math.round(ctl.values.target));
        const tn = local ? 'Lamp 3' : T[Math.round(ctl.values.target)].label;
        if (!path) { msg = { path: [local ? 9 : 0], state: 'fail', t: 0, seg: 0, f: 0 }; note = local ? 'Sensor 1 cannot reach Lamp 3: it has no parent or Lamp 3 is cut off.' : 'No route to ' + tn + ': ' + (!alive(2) && !alive(3) ? 'there is no border router.' : 'no border router is connected to its part of the mesh.'); return; }
        msg = { path, state: 'travel', t: 0, seg: 0, f: 0 };
        note = 'Sending to ' + tn + ' through ' + path.map(k => T[k].label).join(' → ') + '.' + (!local && T[path[path.length - 1]].t === 'sed' ? ' The sleepy sensor receives it at its next poll.' : '');
      }
      function toggle(i) {
        on[i] = !on[i];
        note = T[i].label + (on[i] ? ' is back on.' : ' was switched off.') + (!on[i] && isLeader[i] ? ' It was the leader: the routers will elect a new one.' : '');
        if (!on[i]) isLeader[i] = false;
        msg = null;
      }
      function update(dt) {
        flash = flash.map(f => Math.max(0, f - dt * 1.2));
        cs = components();
        const next = {};
        cs.out.forEach(cp => {
          const leaders = cp.filter(i => isLeader[i]);
          if (leaders.length > 1) { leaders.sort((a, b) => PRIO.indexOf(a) - PRIO.indexOf(b)); leaders.slice(1).forEach(i => { isLeader[i] = false; }); note = 'Two partitions met and merged: ' + T[leaders[0]].label + ' stays leader.'; return; }
          if (leaders.length === 1) return;
          const key = cp.join('-');
          next[key] = (elect[key] || 0) + dt;
          if (next[key] >= 2.5) {
            const pick = cp.slice().sort((a, b) => PRIO.indexOf(a) - PRIO.indexOf(b))[0];
            isLeader[pick] = true; flash[pick] = 1; delete next[key];
            note = T[pick].label + ' is the new leader of its partition.';
          }
        });
        elect = next;
        // a router-eligible device promotes itself when routers get scarce
        const routerCount = T.filter((m, i) => isR(i) && alive(i)).length;
        if (!reedUp && alive(REED) && parentOf[REED] >= 0 && routerCount < 5) {
          promoT += dt;
          if (promoT > 1.5) { reedUp = true; parentOf[REED] = -1; flash[REED] = 1; note = 'Lamp 4 had a good link and the mesh was short of routers: it promoted itself to router.'; promoT = 0; }
        } else promoT = 0;
        [REED, 9, 10].forEach(i => {
          if (isR(i) || !alive(i)) return;
          if (parentOf[i] >= 0 && !(alive(parentOf[i]) && isR(parentOf[i]))) { parentOf[i] = -1; attachT[i] = 0; }
          if (parentOf[i] < 0) {
            attachT[i] += dt;
            if (attachT[i] > 1.2) {
              const p = ATTACH[i].find(k => isR(k) && alive(k));
              if (p != null) { parentOf[i] = p; flash[i] = 1; note = T[i].label + ' attached to ' + T[p].label + ' as its new parent.'; } else attachT[i] = 0;
            }
          }
        });
        if (msg) {
          if (msg.state === 'travel') { msg.f += dt / 0.45; if (msg.f >= 1) { msg.seg++; msg.f = 0; if (msg.seg >= msg.path.length - 1) { msg.state = 'done'; msg.t = 0; } } }
          else { msg.t += dt; if (msg.t > 3) msg = null; }
        }
      }
      reset();
      const hue = i => T[i].t === 'ip' ? 210 : T[i].t === 'br' ? 285 : T[i].t === 'router' ? 150 : T[i].t === 'reed' ? (reedUp ? 150 : 178) : 38;
      const loop = kit.loop((dt) => {
        update(Math.min(dt, 0.05));
        const c = st.begin(), C = kit.colors(), narrow = st.W < 520, L = narrow ? NARROW : WIDE, r = clamp(st.W / 40, 10, 16);
        const P = i => [L[i][0] * st.W, TOP + L[i][1] * (st.H - TOP - BOT)];
        const line = (a, b, o) => { const p = P(a), q = P(b); S.link(c, p[0], p[1], q[0], q[1], o); };
        if (!narrow) { kit.label(c, 'Home network', 12, 14, { size: 11, color: C.muted, weight: 600 }); kit.label(c, 'Thread mesh (802.15.4)', Math.round(st.W * 0.44), 14, { size: 11, color: C.muted, weight: 600 }); }
        // links
        line(0, 1, { wireless: true });
        [2, 3].forEach(b => { if (present(b)) line(1, b, { color: alive(b) ? C.muted : C.faint, width: 2 }); });
        MESH.concat(reedUp ? [[8, 7], [8, 6]] : []).forEach(([a, b]) => { if (present(a) && present(b)) line(a, b, { color: alive(a) && alive(b) ? C.border2 : C.faint, width: 1.4, dash: !(alive(a) && alive(b)) }); });
        [REED, 9, 10].forEach(i => { if (!isR(i) && parentOf[i] >= 0) line(i, parentOf[i], { wireless: true, color: C.faint }); });
        if (msg && msg.path.length > 1) for (let k = 0; k < msg.path.length - 1; k++) line(msg.path[k], msg.path[k + 1], { color: C.accent, width: 3 });
        // devices
        const roleOf = i => {
          if (T[i].t === 'ip') return '';
          if (!alive(i)) return 'off';
          if (isLeader[i]) return T[i].t === 'br' ? 'leader · border router' : 'leader';
          if (T[i].t === 'br') return 'border router';
          if (i === REED) return reedUp ? 'router (was REED)' : (parentOf[i] < 0 ? 'REED · no parent' : 'REED');
          if (T[i].t === 'sed') return parentOf[i] < 0 ? 'sleepy · no parent' : 'sleepy';
          return 'router';
        };
        T.forEach((m, i) => {
          if (!present(i)) return;
          const p = P(i);
          S.node(c, p[0], p[1], { kind: m.kind, label: m.label, sub: st.W >= 560 ? roleOf(i) : undefined, r, color: hue(i), dim: !alive(i), active: flash[i] > 0.05 });
          if (isLeader[i] && alive(i)) { c.save(); c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.arc(p[0], p[1], r * 1.55, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.arc(p[0], p[1], r * 1.9, 0, Math.PI * 2); c.stroke(); c.restore(); }
          if (!alive(i) && T[i].t !== 'ip') { c.save(); c.strokeStyle = C.bad; c.lineWidth = 2.5; c.beginPath(); c.moveTo(p[0] - r, p[1] - r); c.lineTo(p[0] + r, p[1] + r); c.moveTo(p[0] + r, p[1] - r); c.lineTo(p[0] - r, p[1] + r); c.stroke(); c.restore(); }
        });
        // an election in progress
        cs.out.forEach(cp => { const key = cp.join('-'); if (elect[key] > 0) { const p = P(cp[0]); kit.label(c, 'electing a leader…', p[0], p[1] - r * 2.3, { size: 10.5, color: C.warn, align: 'center', weight: 650 }); } });
        if (msg) {
          const p0 = P(msg.path[0]);
          if (msg.state === 'travel') { const a = P(msg.path[msg.seg]), b = P(msg.path[msg.seg + 1]); S.msg(c, a[0], a[1], b[0], b[1], msg.f, { color: C.accent }); }
          else if (msg.state === 'fail') { c.save(); c.strokeStyle = C.bad; c.lineWidth = 3; c.beginPath(); c.arc(p0[0], p0[1], r * 2.2, 0, Math.PI * 2); c.stroke(); c.restore(); }
        }
        // legend and note
        [['border router', 285], ['router', 150], ['REED', 178], ['sleepy device', 38]].forEach(([t, h], i) => {
          const lx = 12 + i * Math.min(130, (st.W - 24) / 4);
          c.fillStyle = kit.hue(h); c.fillRect(lx, st.H - 42, 10, 10); kit.label(c, t, lx + 15, st.H - 37, { size: 10.5, color: C.text2 });
        });
        kit.label(c, short(note, Math.floor((st.W - 24) / 6.1)), 12, st.H - 16, { size: 11, color: C.text2 });
        // numbers
        const leaders = cs.out.map(cp => { const l = cp.find(i => isLeader[i]); return l == null ? 'electing…' : T[l].label; });
        ro.set('leader', cs.out.length ? leaders.join(' and ') : 'none');
        ro.set('routers', String(T.filter((m, i) => isR(i) && alive(i)).length));
        ro.set('parts', String(cs.out.length));
        const rt = routeIp(Math.round(ctl.values.target));
        ro.set('ip', rt ? 'through ' + T[rt[2]].label + ', ' + (rt.length - 3) + ' hops in the mesh' : (!alive(2) && !(present(3) && alive(3)) ? 'no border router: the mesh cannot be reached' : 'cut off from every border router'));
        ro.set('event', short(note, 80));
        if (!msg && !Object.keys(elect).length && promoT === 0 && !flash.some(f => f > 0.05) && ![REED, 9, 10].some(i => !isR(i) && alive(i) && parentOf[i] < 0)) loop.stop();
      }, box.stage);
      kit.click(st, p => {
        const narrow = st.W < 520, L = narrow ? NARROW : WIDE;
        let hit = -1, bd = 1e9;
        T.forEach((m, i) => { if (i < 2 || !present(i)) return; const q = [L[i][0] * st.W, TOP + L[i][1] * (st.H - TOP - BOT)], d = Math.hypot(q[0] - p.x, q[1] - p.y); if (d < bd) { bd = d; hit = i; } });
        if (hit >= 2 && bd < 28) { toggle(hit); loop.start(); }
      }, p => p.y > TOP);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ zt-matter-commission */
  // the last value of a property among the rows already shown
  const carried = (rows, shown, key, init) => { let v = init; for (let k = 0; k < Math.min(shown, rows.length); k++) if (rows[k][key] != null) v = rows[k][key]; return v; };

  function buildCommission(v) {
    const rows = [], thread = v.net === 'thread', noble = v.net === 'wifi-firmware';
    const R = (from, to, label, phase, why, o) => rows.push(Object.assign({ from, to, label, phase, why }, o || {}));
    let end = { kind: 'ok', title: 'Commissioned', text: 'The device holds a certificate of your fabric, sits on the home network and answers the phone through its own certificate. No cloud was needed.' };
    const stop = (title, text) => { end = { kind: 'fail', title, text }; return { rows, end }; };
    const netName = thread ? 'Thread' : 'Wi-Fi';
    R(0, 1, 'Scan the QR code', '1 Scan', 'The label (or the device\'s screen) carries a setup passcode, a 12-bit discriminator and the vendor and product numbers. Nothing is sent yet: the phone only reads them.', { dev: 'factory new: waiting to be commissioned', fab: 0 });
    if (!noble) {
      R(2, 1, 'Advertise: discriminator', '2 Bluetooth LE', 'The device in commissioning mode advertises over Bluetooth LE. The phone looks for the discriminator it has just read, so it picks the right device when several are nearby.');
      R(1, 2, 'Connect over BLE', '2 Bluetooth LE', 'The phone connects. This link is only the delivery truck for the next steps; it is closed at the end.');
      R(1, 2, 'PASE: prove the passcode', '2 Bluetooth LE', 'The phone and the device run a password-authenticated key exchange using the passcode. Neither sends the passcode itself; both end up with a secret key only if they know it.');
      if (v.fault === 'code') { R(2, 1, 'PASE fails: passcode wrong', '2 Bluetooth LE', 'The keys do not match, so the session is refused. The app says the code is wrong or the device is not ready.', { kind: 'fail' }); return stop('Wrong setup code', 'The passcode did not match the one inside the device, so no secure session started and nothing was exchanged. Check the label, and that the device is in commissioning mode.'); }
      R(2, 1, 'Secure session up (PASE)', '2 Bluetooth LE', 'Both sides now share a session key. Everything after this is encrypted.', { dev: 'in a secure session with the phone' });
      R(2, 1, 'Attestation certificates', '3 Trust', v.fault === 'test' ? 'The device presents certificates chained to a test root, as every development build does. The app warns that the device is not a certified product, and lets you continue.' : 'The device presents certificates from its maker, chained to the Matter root. The phone checks that this is a genuine, certified product.', v.fault === 'test' ? { kind: 'warn' } : {});
      R(1, 2, 'Operational certificate', '3 Trust', 'The ecosystem issues the device a certificate of its own. This is the fabric: from now on the device and the ecosystem can prove who they are to each other.', { dev: 'holds a fabric certificate', fab: 1 });
      if (thread) {
        R(1, 2, 'Thread credentials', '4 Network', 'The phone hands over the Thread network credentials (the operational dataset: network name, channel and key).');
        R(2, 3, 'Attach to the Thread mesh', '4 Network', 'The device attaches to a router of the mesh as a child, and gets IPv6 addresses.', v.fault === 'net' ? { kind: 'lost' } : {});
        if (v.fault === 'net') return stop('No Thread network', 'The device heard no Thread router: it is out of range, or the credentials belong to another network. It waits and the app times out.');
      } else {
        R(1, 2, 'Wi-Fi name and password', '4 Network', 'The phone hands over the Wi-Fi name and password, encrypted in the session.');
        R(2, 3, 'Join the home Wi-Fi', '4 Network', 'The device joins your router like any station. The Matter device uses 2.4 GHz unless its chip also has the 5 GHz band.', v.fault === 'net' ? { kind: 'lost' } : {});
        if (v.fault === 'net') return stop('Could not join the Wi-Fi', 'The device never got onto the network: a wrong password, a 5 GHz-only network, or a router too far away. The app times out after a minute or so.');
      }
      R(2, 3, 'Announce itself (mDNS)', '5 Operational', 'On the network the device announces itself with DNS-SD over multicast, so that controllers can find it by its fabric and node number.', { dev: 'on the home network' });
      if (v.fault === 'mdns') { R(1, 3, 'Phone searches: no answer', '5 Operational', 'The phone sends its query and hears nothing: it sits on another network, or the router blocks multicast, or IPv6 is switched off.', { kind: 'lost' }); return stop('The phone cannot find the device', 'The device joined the network but the phone cannot discover it. Matter needs IPv6 and multicast on the home network: check that the phone and the device share a network and that nothing filters mDNS.'); }
      R(1, 2, 'Secure session (CASE)', '5 Operational', 'The phone and the device set up a second, long-lived secure session, now using their certificates of the same fabric.');
      R(1, 2, 'Commissioning complete', '5 Operational', 'The phone tells the device it is done; the device closes the Bluetooth link and stops advertising. It is now a normal node of the fabric.', { dev: 'commissioned: 1 fabric', fab: 1 });
    } else {
      R(2, 3, 'Join Wi-Fi (built-in password)', '2 Network', 'This build has the Wi-Fi name and password compiled in, as in the library\'s simple examples: the device joins the network by itself and needs no Bluetooth.', v.fault === 'net' ? { kind: 'lost' } : {});
      if (v.fault === 'net') return stop('Could not join the Wi-Fi', 'The compiled-in password is wrong or the router is out of reach. Nothing else can happen until the device is on the network.');
      R(2, 3, 'Announce: commissionable (mDNS)', '3 Find and trust', 'The device advertises that it can be commissioned, with its discriminator, over multicast on the home network.', { dev: 'on the network, waiting to be commissioned' });
      if (v.fault === 'mdns') { R(1, 3, 'Phone searches: no answer', '3 Find and trust', 'The phone hears nothing: another network, multicast blocked or IPv6 off.', { kind: 'lost' }); return stop('The phone cannot find the device', 'Without Bluetooth the phone finds the device only by multicast on the home network. Check that both share a network and that nothing filters mDNS.'); }
      R(1, 2, 'PASE over the network: passcode', '3 Find and trust', 'The same password-authenticated key exchange as over Bluetooth, but through the home network.');
      if (v.fault === 'code') { R(2, 1, 'PASE fails: passcode wrong', '3 Find and trust', 'The keys do not match; the session is refused.', { kind: 'fail' }); return stop('Wrong setup code', 'The passcode did not match; no secure session started.'); }
      R(2, 1, 'Attestation certificates', '3 Find and trust', v.fault === 'test' ? 'Test certificates: the app warns that the device is not certified, and lets you continue.' : 'The device presents its maker\'s certificates; the phone checks that it is a certified product.', v.fault === 'test' ? { kind: 'warn' } : {});
      R(1, 2, 'Operational certificate', '3 Find and trust', 'The ecosystem issues the device a certificate of its own: the fabric.', { dev: 'holds a fabric certificate', fab: 1 });
      R(1, 2, 'Secure session (CASE)', '4 Operational', 'A long-lived secure session using the fabric certificates.');
      R(1, 2, 'Commissioning complete', '4 Operational', 'The device is now a normal node of the fabric.', { dev: 'commissioned: 1 fabric', fab: 1 });
    }
    if (v.share) {
      R(1, 2, 'Open a commissioning window', '6 Share', 'In the first app you choose "share". The device opens a commissioning window for a few minutes and shows a one-time code. The first app stays in control.', { dev: 'commissioning window open (one-time code)', fab: 1 });
      R(4, 2, 'Second ecosystem: PASE with new code', '6 Share', 'The second ecosystem commissions the device with the one-time code, exactly as the first one did, over the network.');
      R(4, 2, 'Second operational certificate', '6 Share', 'The device receives a certificate of the second fabric. It now holds two, one per ecosystem, and each ecosystem sees only its own.', { dev: 'commissioned: 2 fabrics', fab: 2 });
      R(4, 2, 'Secure session (CASE)', '6 Share', 'The second ecosystem controls the device directly, locally, with no help from the first.');
      end = { kind: 'ok', title: 'Two fabrics', text: 'One device, two ecosystems: each holds its own certificate and controls the light on its own. Removing the device from one leaves the other untouched.' };
    }
    return { rows, end };
  }

  /* a sequence of messages between actors, drawn from rows */
  function seqPicture(c, C, kit, S, st, actors, rows, shown, prog, left) {
    const nodeR = clamp(st.W / 34, 11, 17), top = 14 + nodeR, y0 = top + nodeR + 42, n = actors.length;
    const xs = actors.map((a, i) => st.W * (left + (0.88 - left) * (n === 1 ? 0.5 : i / (n - 1))));
    const rowH = clamp((st.H - y0 - 10) / Math.max(1, rows.length), 15, 32);
    actors.forEach((a, i) => {
      S.node(c, xs[i], top, { kind: a.kind, label: a.label, sub: st.W >= 520 ? a.sub : undefined, r: nodeR, color: a.color, dim: !!a.dim });
      c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 5]);
      c.beginPath(); c.moveTo(xs[i], y0 - 14); c.lineTo(xs[i], y0 + rows.length * rowH); c.stroke(); c.restore();
    });
    let phase = null;
    rows.forEach((r, k) => {
      if (k > shown) return;
      const yTop = y0 + k * rowH, y = yTop + rowH / 2;
      if (r.phase !== phase) {
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(6, yTop + 0.5); c.lineTo(st.W - 6, yTop + 0.5); c.stroke(); c.restore();
        kit.label(c, r.phase, 8, yTop + 9, { size: 10, color: C.muted, weight: 650 });
      }
      phase = r.phase;
      if (k === shown - 1) { c.save(); c.globalAlpha = 0.07; c.fillStyle = C.accent; c.fillRect(0, yTop, st.W, rowH); c.restore(); }
      const xa = xs[r.from], xb = xs[r.to], dir = xb >= xa ? 1 : -1;
      const col = r.kind === 'fail' ? C.bad : r.kind === 'warn' ? C.warn : r.kind === 'lost' ? C.bad : C.text2;
      const f = k < shown ? 1 : clamp(prog, 0, 1), x2 = r.kind === 'lost' ? xa + (xb - xa) * 0.62 : xb, xe = xa + (x2 - xa) * f;
      c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 1.8;
      c.beginPath(); c.moveTo(xa, y); c.lineTo(xe, y); c.stroke();
      if (f >= 1) {
        if (r.kind === 'lost') { c.lineWidth = 2.2; c.beginPath(); c.moveTo(x2 - 5, y - 5); c.lineTo(x2 + 5, y + 5); c.moveTo(x2 + 5, y - 5); c.lineTo(x2 - 5, y + 5); c.stroke(); }
        else { c.beginPath(); c.moveTo(x2, y); c.lineTo(x2 - dir * 9, y - 4.5); c.lineTo(x2 - dir * 9, y + 4.5); c.closePath(); c.fill(); }
      }
      c.restore();
      if (f < 1) S.msg(c, xa, y, x2, y, f, { color: col, r: 4 });
      kit.label(c, r.label, (xa + x2) / 2, y - 7, { size: 10.5, color: r.kind === 'fail' || r.kind === 'lost' ? C.bad : C.text, align: 'center', bg: C.dark ? 'rgba(13,16,32,.78)' : 'rgba(255,255,255,.82)' });
    });
  }

  Hyper.sim('zt-matter-commission', {
    title: 'Commissioning a Matter device, message by message',
    blurb: `Read the picture from left to right: the **label** with its QR code, the **phone** (the first ecosystem), the **device** and the **home network**. Each arrow is a message; a red arrow ending in a cross never arrives. The panel names the state of the device after each step.

**Try this**
- Play it through with everything right and note **where Bluetooth is used** (only to hand over credentials) and where it is not (afterwards, everything runs over the home network).
- Choose **Wrong setup code**: it fails at the very first secure step, before any certificate or password changes hands.
- Choose **Phone cannot find the device**: the device joined, yet the app times out. A router that filters multicast or has no IPv6 does this.
- Tick **share with a second ecosystem** at the end: the device opens a one-time window and then holds **two fabrics**.
- Choose **Wi-Fi built into the firmware**: the simple library examples skip Bluetooth, because the device joins the network itself.

Names (PASE, CASE, fabric, attestation) are the Matter specification's. Timings are not shown: a real commissioning takes about half a minute, most of it joining the network.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const focusShare = !!(params && params.view === 'share');
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 440, maxH: 600 });
      let plan = null, shown = 0, prog = 0, goal = 0;
      const ctl = kit.controls(box.side, [
        { id: 'net', type: 'select', label: 'Network and method', options: [['Wi-Fi, set up over Bluetooth LE', 'wifi'], ['Thread, set up over Bluetooth LE', 'thread'], ['Wi-Fi built into the firmware (no Bluetooth)', 'wifi-firmware']], value: 'wifi' },
        { id: 'fault', type: 'select', label: 'What goes wrong', options: [['Nothing: everything right', 'ok'], ['Wrong setup code', 'code'], ['Cannot join the network (password, range)', 'net'], ['Phone cannot find the device (mDNS, IPv6)', 'mdns'], ['Development device with test certificates', 'test']], value: 'ok' },
        { id: 'share', type: 'check', label: 'Then share with a second ecosystem', value: focusShare },
        { type: 'buttons', items: [{ id: 'next', label: 'Next message', primary: true }, { id: 'play', label: 'Play all' }, { id: 'again', label: 'Start over' }] }
      ], (id) => {
        if (id === 'next') { if (shown >= goal) goal = Math.min(plan.rows.length, shown + 1); loop.start(); }
        else if (id === 'play') { goal = plan.rows.length; loop.start(); }
        else restart(0);
      });
      const ro = kit.readout(box.side, [['step', 'This step'], ['dev', 'The device is'], ['fab', 'Fabrics on the device'], ['end', 'Result']]);
      function restart(startAt) {
        plan = buildCommission(ctl.values);
        shown = clamp(startAt || 0, 0, plan.rows.length); prog = 0; goal = shown;
        loop.once();
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (shown < goal) { prog += dt / 0.8; if (prog >= 1) { shown++; prog = 0; } }
        else if (loop.running) loop.stop();
        const rows = plan.rows, v = ctl.values, thread = v.net === 'thread';
        const actors = [
          { kind: 'tag', label: 'Label', sub: 'QR code', color: 36 },
          { kind: 'phone', label: 'Phone', sub: 'ecosystem A', color: 215 },
          { kind: 'esp', label: 'Device', sub: 'ESP32' },
          { kind: thread ? 'gateway' : 'router', label: thread ? 'Border router' : 'Wi-Fi router', sub: thread ? 'Thread mesh' : 'home network', color: 285 },
          { kind: 'laptop', label: 'Ecosystem B', sub: 'second app', color: 150, dim: !v.share }
        ];
        seqPicture(c, C, kit, S, st, actors, rows, shown, prog, 0.1);
        const done = shown >= rows.length;
        if (done) {
          const col = plan.end.kind === 'ok' ? C.ok : plan.end.kind === 'warn' ? C.warn : C.bad;
          c.save(); const w = Math.min(st.W - 20, 30 + plan.end.title.length * 6.5); c.fillStyle = col; c.globalAlpha = 0.14; c.fillRect((st.W - w) / 2, 10, w, 24); c.globalAlpha = 1; c.strokeStyle = col; c.lineWidth = 1.2; c.strokeRect((st.W - w) / 2 + 0.5, 10.5, w - 1, 23); c.restore();
          kit.label(c, plan.end.title, st.W / 2, 22, { size: 11.5, color: col, weight: 650, align: 'center' });
        }
        ro.set('step', done ? 'Finished.' : (rows[shown].phase.slice(2) + ': ' + rows[shown].why));
        ro.set('dev', carried(rows, shown, 'dev', 'factory new: waiting to be commissioned'));
        ro.set('fab', String(carried(rows, shown, 'fab', 0)));
        ro.set('end', done ? plan.end.text : '…');
      }, box.stage);
      restart(0);
      if (focusShare) { const k = plan.rows.findIndex(r => r.phase.charAt(0) === '6'); restart(k > 0 ? k : 0); }
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ zt-compare-light */
  Hyper.sim('zt-compare-light', {
    title: 'The same device on Wi-Fi, Zigbee and Thread',
    blurb: `One battery device, one message every few minutes, three radios. Each card shows the **link** at your distance and walls, the **battery life**, and what a radio asks of the house.

**Try this**
- Leave the defaults and compare the battery bars: Zigbee and Thread last a decade or so, Wi-Fi about a year. **Zigbee and Thread are the same radio**, so their bars match.
- Shorten the **Wi-Fi wake time** to 0.3 s (fast reconnect with a stored address): Wi-Fi gains a lot, but still trails.
- Push the **distance** and the **walls** up: the direct link of every radio fails at about the same place. What extends Zigbee and Thread is the mesh of mains devices, not a stronger radio.
- Slow the **poll period** to a minute: the battery gains little (the sleep current dominates) and a command now waits up to a minute. Wi-Fi in deep sleep is reachable only when it wakes to send.

Currents come from the catalogue (ESP32-C6 for Wi-Fi, ESP32-H2 for Zigbee and Thread: the receive current and the sleep current). The wake time, the 15 ms of a Zigbee message, the 5 ms of a poll, the 18 dBm of Wi-Fi and the 10 dBm of Zigbee and Thread are assumptions, stated on the page. Radio rules (path-loss exponent 3, 5 dB a wall) are the same as in the link-budget calculator.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const c6 = E.chip('esp32-c6') || {}, h2 = E.chip('esp32-h2') || {};
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 430, maxH: 580 });
      const ctl = kit.controls(box.side, [
        { id: 'dist', label: 'Distance to the hub', min: 1, max: 80, step: 1, value: 15, unit: 'm' },
        { id: 'walls', label: 'Walls in the way', min: 0, max: 6, step: 1, value: 2 },
        { id: 'rate', label: 'Messages an hour', min: 1, max: 360, value: 12, unit: '/h', log: true, sig: 2 },
        { id: 'poll', label: 'Poll period (Zigbee, Thread)', min: 1, max: 120, value: 20, unit: 's', log: true, sig: 2 },
        { id: 'wake', label: 'Wi-Fi wake and send time', min: 0.3, max: 4, step: 0.1, value: 1, unit: 's' },
        { id: 'cell', type: 'select', label: 'Battery', options: [['2 × AA alkaline, 2500 mAh', 'aa2'], ['CR123A lithium, 1500 mAh', 'cr123a'], ['CR2032 coin cell, 225 mAh', 'cr2032']], value: 'aa2' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['w', 'Wi-Fi 6'], ['z', 'Zigbee'], ['t', 'Thread'], ['note', 'Note']]);
      const RADIOS = [
        { id: 'w', name: 'Wi-Fi 6', chip: 'ESP32-C6', tx: 18, sens: -92, hue: 212, rx: c6.rxMa || 82, sleep: c6.sleepUa != null ? c6.sleepUa : 7, kind: 'wifi',
          facts: ['Needs: a Wi-Fi router', 'Shape: a star to the router', 'Reach: only when awake', 'Speed: up to ' + ((c6.wifi && c6.wifi.mbps) || 150) + ' Mbit/s'] },
        { id: 'z', name: 'Zigbee', chip: 'ESP32-H2', tx: 10, sens: -100, hue: 150, rx: h2.rxMa || 25, sleep: h2.sleepUa != null ? h2.sleepUa : 7, kind: 'zb',
          facts: ['Needs: a coordinator', 'Shape: a mesh of mains devices', 'Reach: within a poll period', 'Speed: 250 kbit/s'] },
        { id: 't', name: 'Thread', chip: 'ESP32-H2', tx: 10, sens: -100, hue: 285, rx: h2.rxMa || 25, sleep: h2.sleepUa != null ? h2.sleepUa : 7, kind: 'zb',
          facts: ['Needs: a border router', 'Shape: an IPv6 mesh', 'Reach: within a poll period', 'Speed: 250 kbit/s'] }
      ];
      const fmtLife = y => y >= 1 ? kit.fmt(y, 3) + ' years' : kit.fmt(y * 365, 3) + ' days';
      function model(R) {
        const v = ctl.values, cell = E.CELLS.find(c => c.id === v.cell) || E.CELLS[0];
        const link = E.link({ tx: R.tx, mhz: 2442, d: v.dist, n: 3, walls: v.walls, wallLoss: 5, sens: R.sens });
        const range = E.linkRange({ tx: R.tx, mhz: 2442, n: 3, walls: v.walls, wallLoss: 5, sens: R.sens, margin: 10 });
        const perMsg = R.kind === 'wifi' ? R.rx * v.wake : R.rx * 0.015;          // mA s
        const poll = R.kind === 'wifi' ? 0 : R.rx * 0.005 / v.poll;               // mA
        const avg = R.sleep / 1000 + v.rate * perMsg / 3600 + poll;
        const life = E.batteryLife(cell.mAh, avg, { cell: cell.id });
        const wait = R.kind === 'wifi' ? 3600 / v.rate : v.poll;
        return { link, range, avg, life, wait };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), wide = st.W >= 620, M = 10, G = 8;
        const cw = wide ? (st.W - 2 * M - 2 * G) / 3 : st.W - 2 * M, ch = wide ? st.H - 2 * M : (st.H - 2 * M - 2 * G) / 3;
        const LO = 0.05, HI = 40;
        RADIOS.forEach((R, i) => {
          const m = model(R), x = wide ? M + i * (cw + G) : M, y = wide ? M : M + i * (ch + G), inner = cw - 24;
          const colW = wide ? inner : (inner - 14) / 2, chars = Math.floor(colW / 5.8);
          S.box(c, x, y, cw, ch, { color: kit.hue(R.hue, 0.8), r: 10 });
          kit.label(c, R.name, x + 12, y + 18, { size: 14.5, weight: 700 });
          kit.label(c, short(R.chip + ' · tx ' + R.tx + ' dBm · sens ' + R.sens + ' dBm', Math.floor(inner / 5.4)), x + 12, y + 35, { size: 10, color: C.muted });
          // the link
          const lx = x + 12, ly = y + (wide ? 62 : 58);
          kit.label(c, short('Link at ' + ctl.values.dist + ' m, ' + ctl.values.walls + (ctl.values.walls === 1 ? ' wall' : ' walls'), chars), lx, ly, { size: 10.5, color: C.text2, weight: 600 });
          const frac = clamp((m.link.margin + 10) / 50, 0, 1), col = m.link.margin >= 10 ? C.ok : m.link.margin >= 0 ? C.warn : C.bad;
          c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'; c.fillRect(lx, ly + 8, colW, 9);
          c.fillStyle = col; c.fillRect(lx, ly + 8, colW * frac, 9);
          kit.label(c, short(wide ? 'received ' + kit.fmt(m.link.rx, 3) + ' dBm · margin ' + kit.fmt(m.link.margin, 3) + ' dB' : 'margin ' + kit.fmt(m.link.margin, 3) + ' dB', chars), lx, ly + 29, { size: 10.5, color: col, weight: 600 });
          kit.label(c, short('direct range about ' + kit.fmt(m.range, 2) + ' m', chars), lx, ly + 44, { size: 10, color: C.muted });
          // the battery
          const bx = wide ? lx : lx + colW + 14, by = wide ? ly + 76 : ly;
          kit.label(c, 'Battery life', bx, by, { size: 10.5, color: C.text2, weight: 600 });
          const bf = clamp(Math.log(Math.max(m.life.years, LO) / LO) / Math.log(HI / LO), 0, 1);
          c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'; c.fillRect(bx, by + 8, colW, 9);
          c.fillStyle = kit.hue(R.hue); c.fillRect(bx, by + 8, colW * bf, 9);
          kit.label(c, short(fmtLife(m.life.years) + (wide ? ' · average ' : ' · ') + kit.fmt(m.avg * 1000, 3) + ' µA', chars), bx, by + 29, { size: 10.5, color: C.text, weight: 600 });
          kit.label(c, short((wide ? 'a command waits up to ' : 'command waits ≤ ') + (m.wait >= 120 ? kit.fmt(m.wait / 60, 3) + ' min' : kit.fmt(m.wait, 3) + ' s'), chars), bx, by + 44, { size: 10, color: C.muted });
          // what it asks of the house
          if (wide) R.facts.forEach((t, k) => kit.label(c, short(t, Math.floor(inner / 6)), lx, by + 74 + k * 17, { size: 10.5, color: C.text2 }));
          else kit.label(c, short(R.facts.slice(0, 2).join(' · '), Math.floor(inner / 5.4)), lx, y + ch - 12, { size: 10, color: C.muted });
        });
        const mw = model(RADIOS[0]), mz = model(RADIOS[1]), mt = model(RADIOS[2]);
        ro.set('w', fmtLife(mw.life.years) + ' · margin ' + kit.fmt(mw.link.margin, 3) + ' dB');
        ro.set('z', fmtLife(mz.life.years) + ' · margin ' + kit.fmt(mz.link.margin, 3) + ' dB');
        ro.set('t', fmtLife(mt.life.years) + ' · margin ' + kit.fmt(mt.link.margin, 3) + ' dB');
        ro.set('note', 'Zigbee and Thread share one radio: the difference is above it. Peak currents must also suit the cell.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
