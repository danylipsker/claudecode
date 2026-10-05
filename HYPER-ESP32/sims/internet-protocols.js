/* HYPER-ESP32 · sims/internet-protocols.js
 *
 * Simulations of the topic "internet-protocols" (ids ip-*).
 *
 *   ip-layers   a request travelling down the stack, with the header each layer adds; params { mode: 'faults' }: the ladder of checks and where a request stops
 *   ip-tcp      the TCP handshake, data, a lost segment, a closed port, a silent server; and UDP datagrams
 *   ip-http     an HTTP request and its response as text, with status codes and time-outs; params { preset: 'get' | 'rest' | 'server' | 'webhook' }
 *   ip-tls      the TLS handshake and the checks a device makes: the root, the name, the dates against its clock
 *   ip-qos      MQTT QoS 0, 1 and 2 and CoAP confirmable messages when the line breaks; params { proto: 'coap' }
 *   ip-ntp      the four NTP timestamps, the offset, the delay, and what an unequal path does to them
 *   ip-mqtt     clients, a broker, wildcards, retained messages and a last will; params { retain: true }
 *   ip-push     polling against a WebSocket push: delay, missed changes and traffic
 *
 * Numbers that are schematic (retransmission times, bytes per poll) say so in the blurb.
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pad2 = n => (n < 10 ? '0' : '') + n;

  /* ---------------------------------------------------------------- a sequence of messages between actors
     actors: [{ kind, label, sub, x (0…1), color, dim }]; rows: [{ from, to, label, phase, kind: 'ok' | 'warn' | 'fail' | 'lost', color }]
     shown = rows completed, prog = progress (0…1) of the next one. */
  function seqDraw(c, C, kit, S, st, actors, rows, shown, prog, o) {
    o = o || {};
    const nodeR = clamp(st.W / 32, 12, 18), top = 12 + nodeR, y0 = top + nodeR + 42, n = actors.length, left = o.left == null ? 0.2 : o.left, right = o.right == null ? 0.86 : o.right;
    const xs = actors.map((a, i) => st.W * (a.x != null ? a.x : left + (right - left) * (n === 1 ? 0.5 : i / (n - 1))));
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
      kit.label(c, r.label, (xa + x2) / 2, y - 7, { size: 10.5, color: r.kind === 'fail' ? C.bad : C.text, align: 'center', bg: C.dark ? 'rgba(13,16,32,.78)' : 'rgba(255,255,255,.82)' });
    });
  }

  /* a rounded banner of text */
  function banner(c, C, kit, st, y, text, color) {
    const w = Math.min(st.W - 20, 30 + text.length * 6.3);
    c.save(); c.fillStyle = color; c.globalAlpha = 0.14;
    c.fillRect((st.W - w) / 2, y - 12, w, 24); c.globalAlpha = 1; c.strokeStyle = color; c.lineWidth = 1.2; c.strokeRect((st.W - w) / 2 + 0.5, y - 11.5, w - 1, 23); c.restore();
    kit.label(c, text, st.W / 2, y, { size: 11.5, color: color, weight: 650, align: 'center' });
  }

  /* a conversation player. cfg: { aspect, minH, controls: [...], readouts: [[key, label, ({ plan, shown, done, values }) => text]],
     plan(values) -> { actors, rows, end: { kind, title }, left }, onChange(ctl, id) } */
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
      seqDraw(c, C, kit, S, st, plan.actors, plan.rows, shown, prog, { left: plan.left == null ? 0.2 : plan.left, right: plan.right, rowH: 32 });
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
  // a row of a conversation
  const rowMaker = rows => (from, to, label, phase, why, extra) => rows.push(Object.assign({ from, to, label, phase, why, kind: 'ok' }, extra || {}));

  /* ================================================================ ip-layers */
  const STAGES = [
    ['Link', 'Is the Wi-Fi joined?'],
    ['Address', 'Is there an IP address?'],
    ['Reach', 'Do the router and the ESP hear each other?'],
    ['Name', 'Does the name become an address?'],
    ['Connect', 'Does the TCP connection open?'],
    ['Secure', 'Does the TLS handshake succeed?'],
    ['Request', 'Is the HTTP status 2xx?'],
    ['Data', 'Is the content what the program expects?']
  ];
  // stop: index of the stage where the request stops (-1: it does not)
  const FAULTS = [
    { id: 'none', name: 'Nothing is wrong', stop: -1, sees: 'The status is 200 and the data is there.', test: 'Nothing to find.', fix: 'Nothing to do.' },
    { id: 'password', name: 'Wrong Wi-Fi password', stop: 0, sees: 'The status never becomes "connected"; the disconnect reason is a handshake time-out.', test: 'Print the status and the disconnect reason; check the password and that the router offers 2.4 GHz.', fix: 'Correct the password, or the band of the network.' },
    { id: 'dhcp', name: 'The router gives no address', stop: 1, sees: 'The link is up but the address is 0.0.0.0 (Arduino status stays 0).', test: 'Print the IP address; look at the router\'s DHCP pool and client list.', fix: 'Free addresses in the router, or give a static address together with a DNS server.' },
    { id: 'isolation', name: 'Client isolation on the router', stop: 2, sees: 'The ESP has an address, but a computer on the same Wi-Fi cannot ping it, and a connection to a device on your own network times out.', test: 'Ping the ESP from a computer on the same network; look for a guest or isolation setting.', fix: 'Turn off isolation, or put both devices on the same ordinary network.' },
    { id: 'dns', name: 'The DNS server does not answer', stop: 3, sees: 'The lookup returns nothing; the same request to a numeric address would work.', test: 'Look up the name on its own; try the request by IP address.', fix: 'Fix the DNS server (or give one with a static address); beware a captive portal.' },
    { id: 'drop', name: 'Wrong address, or a firewall that drops', stop: 4, sees: 'connect() waits for its whole time-out and then fails: silence.', test: 'Ping the host from a computer on the same network; check the address, the port and the firewall.', fix: 'Correct the address, open the port, or move the device out of isolation.' },
    { id: 'refused', name: 'Nothing listens on the port', stop: 4, sees: 'connect() fails at once with "refused": the host answered, and said no.', test: 'Try the same port from a computer; is the service running and on this port?', fix: 'Start the service, or use the port it listens on.' },
    { id: 'clock', name: 'The ESP clock is wrong (1970)', stop: 5, sees: 'A certificate error: "not yet valid". The server and the root are fine.', test: 'Print the date before connecting.', fix: 'Set the clock with SNTP before the first HTTPS call.' },
    { id: 'root', name: 'The root certificate is missing', stop: 5, sees: 'A certificate error: "unknown CA" or "verification failed".', test: 'Compare the stored root with the root of the server\'s chain.', fix: 'Store the right root certificate, or use a bundle of public roots.' },
    { id: 'http401', name: 'The server wants a key (401)', stop: 6, sees: 'The call works and returns the status 401.', test: 'Print the status and the body.', fix: 'Send the key or password in the header the service expects.' },
    { id: 'http404', name: 'Wrong path (404)', stop: 6, sees: 'The call works and returns the status 404.', test: 'Print the status; try the address in a browser.', fix: 'Correct the path.' },
    { id: 'data', name: 'The answer lacks the field', stop: 7, sees: 'Status 200 and valid JSON, but a field is missing: the program prints its default.', test: 'Print the raw answer.', fix: 'Read the field the server really sends; always use a default.' }
  ];

  Hyper.sim('ip-layers', {
    title: 'A request down the stack, and where it stops',
    blurb: `**Headers.** A message of your own is handed down the four layers; each wraps it in an envelope, and the bar under the layer shows the bytes. The bottom bar is what goes on the air. Change the size of your data, the transport and the encryption, and watch the share of the envelope.

**Faults.** The same request as a ladder of eight checks. Choose what is wrong and send the request again: it passes every step down to the broken one, and the panel says what a program sees there, how to find it and what to do. Sizes of headers are those of an IPv4 packet in an 802.11 data frame; the exact figures vary a little with the access point.

**Try this**
- Send **1 byte** over TCP: the envelope is about 99 % of what is on the air. Then 1400 bytes: it is under 10 %.
- Choose **4000 bytes**: TCP cuts it into three segments of at most 1460 bytes. With UDP the IP layer splits it into fragments, and one lost fragment loses the whole datagram.
- Tick or clear **encryption** and see the Wi-Fi envelope grow or shrink by 16 bytes.
- In *faults*, compare **refused** with **wrong address**: the same step, one answered at once and one in silence.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 360, maxH: 580 });
      let t0 = 0, prog = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Headers added at each layer', 'headers'], ['Where a request stops: faults', 'faults']], value: params.mode === 'faults' ? 'faults' : 'headers' },
        { id: 'bytes', label: 'Your data', min: 1, max: 4000, value: 120, step: 1, log: true, sig: 3, unit: 'bytes' },
        { id: 'proto', type: 'select', label: 'Transport', options: [['TCP', 'tcp'], ['UDP', 'udp']], value: 'tcp' },
        { id: 'enc', type: 'check', label: 'Wi-Fi encryption (WPA2)', value: true },
        { id: 'fault', type: 'select', label: 'What is wrong', options: FAULTS.map(f => [f.name, f.id]), value: 'none' },
        { type: 'buttons', items: [{ id: 'go', label: 'Send it again', primary: true }] }
      ], (id) => {
        if (id === 'go') { t0 = loop.t; prog = 0; }
        if (id === 'fault' || id === 'mode') prog = 0;
        syncUi();
        loop.start();
      });
      const ro = kit.readout(box.side, [['pk', 'Packets for the message'], ['air', 'Bytes on the air'], ['ovh', 'Share that is envelope'], ['mss', 'Most data in one packet'],
        ['stop', 'The request stops at'], ['sees', 'What the program sees'], ['test', 'How to find it'], ['fix', 'What to do']]);
      function syncUi() {
        const h = ctl.values.mode === 'headers';
        ['bytes', 'proto', 'enc'].forEach(k => ctl.show(k, h)); ctl.show('fault', !h);
        ['pk', 'air', 'ovh', 'mss'].forEach(k => ro.show(k, h)); ['stop', 'sees', 'test', 'fix'].forEach(k => ro.show(k, !h));
      }
      const fault = () => FAULTS.find(f => f.id === ctl.values.fault) || FAULTS[0];

      function headers(c, C, t) {
        const W = st.W, H = st.H;
        const bytes = Math.max(1, Math.round(ctl.values.bytes)), udp = ctl.values.proto === 'udp', enc = !!ctl.values.enc;
        const mss = udp ? 1472 : 1460, n = Math.ceil(bytes / mss), first = Math.min(bytes, mss);
        const l4 = udp ? 8 : 20, ip = 20, lh = 34 + (enc ? 8 : 0), lt = 4 + (enc ? 8 : 0);
        const total1 = first + l4 + ip + lh + lt;
        const air = bytes + (udp ? 8 : 0) + n * ((udp ? 0 : l4) + ip + lh + lt);
        kit.label(c, 'A message of ' + bytes + ' bytes goes down the stack' + (n > 1 ? ' (the first of ' + n + (udp ? ' fragments' : ' segments') + ')' : ''), 12, 16, { size: 12, weight: 600 });
        const lw = clamp(W * 0.27, 92, 160), ax = lw + 16, aw = W - ax - 12, y0 = 40, rh = clamp((H - y0 - 40) / 4, 40, 74), bh = clamp(rh * 0.5, 22, 36);
        const names = [['Application', 'your data'], ['Transport', udp ? 'UDP header' : 'TCP header'], ['Internet', 'IP header'], ['Link', 'Wi-Fi frame']];
        const cyc = (((t - t0) % 7) + 7) % 7, reach = cyc < 0.8 ? 0 : cyc < 1.8 ? 1 : cyc < 2.8 ? 2 : 3;
        const fieldsOf = k => {
          const f = [];
          if (k >= 3) f.push({ label: 'Wi-Fi', size: lh, value: lh + ' B', color: 292 });
          if (k >= 2) f.push({ label: 'IP', size: ip, value: ip + ' B', color: 212 });
          if (k >= 1) f.push({ label: udp ? 'UDP' : 'TCP', size: l4, value: l4 + ' B', color: 150 });
          f.push({ label: 'data', size: first, value: first + ' B', color: 40 });
          if (k >= 3) f.push({ label: 'end', size: lt, value: lt + ' B', color: 292 });
          return f;
        };
        for (let k = 0; k < 4; k++) {
          const y = y0 + k * rh, active = k === reach;
          if (active) { c.save(); c.globalAlpha = 0.08; c.fillStyle = C.accent; c.fillRect(6, y - 4, W - 12, rh - 2); c.restore(); }
          kit.label(c, names[k][0], 14, y + bh / 2 - 2, { size: 12, weight: 650, color: k <= reach ? C.text : C.faint });
          kit.label(c, names[k][1], 14, y + bh / 2 + 13, { size: 10, color: C.muted });
          if (k <= reach) {
            const fields = fieldsOf(k), tot = fields.reduce((a, f) => a + f.size, 0), w = Math.max(24, aw * tot / total1);
            S.frame(c, ax, y, w, fields, { h: bh });
            kit.label(c, tot + ' bytes', ax, y + bh + 9, { size: 10, color: C.muted });
          } else {
            c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(ax, y + bh / 2); c.lineTo(ax + aw * 0.4, y + bh / 2); c.stroke(); c.restore();
          }
        }
        // the packet going down
        const prow = clamp((cyc - 0.2) / 0.9, 0, 3), my = y0 + bh / 2 + prow * rh;
        kit.dot(c, ax - 10, my, 5, C.accent);
        kit.label(c, 'Headers: ' + (udp ? 'UDP 8' : 'TCP 20') + ' · IP 20 · Wi-Fi ' + lh + ' + ' + lt + ' B', 12, H - 14, { size: 10.5, color: C.muted });
        ro.set('pk', n + (n === 1 ? ' packet' : udp ? ' fragments' : ' segments'));
        ro.set('air', air + ' bytes for ' + bytes + ' of data');
        ro.set('ovh', kit.fmt(100 * (1 - bytes / air), 3) + ' %');
        ro.set('mss', mss + ' bytes' + (udp ? ' (before IP splits it)' : ' (the MSS)'));
      }

      const NSTAGE = STAGES.length;
      function faults(c, C, dt) {
        const W = st.W, H = st.H, f = fault(), reach = f.stop < 0 ? NSTAGE : f.stop;
        const finish = f.stop < 0 ? NSTAGE : f.stop + 0.7;
        prog = Math.min(finish, prog + dt * 2.2);
        const top = 44, rh = clamp((H - top - 12) / NSTAGE, 24, 42), x0 = 20, tx = 46;
        if (prog < finish - 1e-6) kit.label(c, 'The request, step by step', 12, 16, { size: 12, weight: 600 });
        for (let k = 0; k < NSTAGE; k++) {
          const y = top + k * rh + rh / 2;
          const ok = k < Math.min(reach, Math.floor(prog)), bad = k === f.stop && prog >= f.stop + 0.5, now = !ok && !bad && k === Math.floor(prog) && prog < finish;
          const col = ok ? C.ok : bad ? C.bad : now ? C.accent : C.faint;
          if (k > 0) { c.save(); c.strokeStyle = ok ? C.ok : C.faint; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, y - rh); c.lineTo(x0, y); c.stroke(); c.restore(); }
          c.save(); c.fillStyle = col; c.globalAlpha = ok || bad || now ? 1 : 0.5; c.beginPath(); c.arc(x0, y, 8, 0, Math.PI * 2); c.fill(); c.restore();
          kit.label(c, ok ? '✓' : bad ? '✗' : String(k + 1), x0, y, { size: 10, color: '#fff', align: 'center', weight: 700 });
          kit.label(c, STAGES[k][0], tx, y - 6, { size: 12, weight: 650, color: ok || bad || now ? C.text : C.faint });
          kit.label(c, STAGES[k][1], tx, y + 8, { size: 10.5, color: bad ? C.bad : C.muted });
        }
        const done = prog >= finish - 1e-6;
        if (done) banner(c, C, kit, st, 22, f.stop < 0 ? 'The request completes' : 'The request stops at step ' + (f.stop + 1) + ': ' + STAGES[f.stop][0], f.stop < 0 ? C.ok : C.bad);
        else kit.dot(c, W - 24, top + clamp(prog, 0, NSTAGE - 0.5) * rh + rh / 2, 5, C.accent);
        ro.set('stop', f.stop < 0 ? 'nowhere' : 'step ' + (f.stop + 1) + ', ' + STAGES[f.stop][0]);
        ro.set('sees', f.sees); ro.set('test', f.test); ro.set('fix', f.fix);
        return done;
      }

      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors();
        if (ctl.values.mode === 'headers') headers(c, C, t);
        else if (faults(c, C, dt) && loop.running) loop.stop();
      }, box.stage);
      syncUi();
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ip-tcp */
  Hyper.sim('ip-tcp', {
    title: 'TCP and UDP, message by message',
    blurb: `The ESP is on the left, a server on the right. Each arrow is one packet; a cross means it was lost. Choose a scenario and step through it: the panel names the ESP's TCP state, the bytes delivered and the time on the line. The times are **schematic**: a round trip of 24 ms, and a first retransmission time-out of about a second, as a stack might start with.

**Try this**
- Play **a normal TCP conversation**: three messages open the connection, and \`connect()\` returns one round trip after the first of them. Note the numbers: each acknowledgement names the next byte expected.
- Choose **a data segment is lost**: nobody tells the program; it only sees the delay of the retransmission.
- Compare **nothing listens** (an instant reset: *refused*) with **the server does not answer** (silence, three tries and a time-out).
- Choose **UDP: a datagram is lost**: the send looked fine, and nobody will ever say it vanished.`,
    mount(box, kit, params) {
      converse(box, kit, {
        aspect: 0.82, minH: 380,
        controls: [
          { id: 'sc', type: 'select', label: 'Scenario', options: [['TCP: connect, send, close', 'ok'], ['TCP: a data segment is lost', 'lost'], ['TCP: nothing listens on the port', 'refused'], ['TCP: the server does not answer', 'down'], ['UDP: a datagram arrives', 'udp'], ['UDP: a datagram is lost', 'udplost']], value: 'ok' },
          { id: 'fin', type: 'check', label: 'Show the closing (FIN)', value: true }
        ],
        plan: v => {
          const rows = [], R = rowMaker(rows);
          const A = [{ kind: 'esp', label: 'ESP', sub: 'client' }, { kind: 'server', label: 'server', sub: v.sc.indexOf('udp') === 0 ? 'UDP port 4210' : 'port 80' }];
          if (v.sc === 'udp' || v.sc === 'udplost') {
            R(0, 1, v.sc === 'udp' ? 'datagram · 24 bytes' : 'datagram · 24 bytes (lost)', '1 Send', v.sc === 'udp' ? 'One datagram, no connection and no set-up. send() returns as soon as it is handed to the network.' : 'The datagram is dropped somewhere on the way. send() returned normally and will never report a problem.', Object.assign({ ms: '0 ms', stt: 'no connection', del: '0 bytes', kind: v.sc === 'udp' ? 'ok' : 'lost' }, v.sc === 'udp' ? { del: '24 bytes (the ESP cannot tell)' } : {}));
            if (v.sc === 'udp') R(1, 0, 'reply · 5 bytes (optional)', '2 Answer', 'UDP has no acknowledgement of its own. If the program wants to know, the other program must send an answer, and the ESP must wait for it and ask again if it never comes.', { ms: '24 ms', color: 'faint' });
            else R(0, 1, 'next datagram · 24 bytes', '2 Next', 'Two seconds later the next reading goes out and arrives. For a stream of readings that is often enough: the new value replaces the lost one.', { ms: '2000 ms', del: '24 bytes, one reading missing' });
            return { actors: A, rows, end: { kind: v.sc === 'udp' ? 'ok' : 'warn', title: v.sc === 'udp' ? 'Delivered, and nobody said so' : 'One datagram lost without a trace' } };
          }
          if (v.sc === 'refused') {
            R(0, 1, 'SYN · seq 1000', '1 Connect', 'The ESP asks to open a connection to port 80: SYN, with its first sequence number.', { ms: '0 ms', stt: 'SYN_SENT', del: '0 bytes' });
            R(1, 0, 'RST, ACK · refused', '1 Connect', 'Nothing listens on that port, so the server\'s stack answers at once with a reset. connect() fails after one round trip: "connection refused". The address and the route are proven good.', { kind: 'fail', ms: '24 ms', stt: 'CLOSED' });
            return { actors: A, rows, end: { kind: 'fail', title: 'Refused' } };
          }
          if (v.sc === 'down') {
            R(0, 1, 'SYN · seq 1000 (lost)', '1 Connect', 'The SYN never gets an answer: the address is wrong, a firewall drops it, or the server is off.', { kind: 'lost', ms: '0 ms', stt: 'SYN_SENT', del: '0 bytes' });
            R(0, 1, 'SYN again (lost)', '1 Connect', 'The stack tries again after a time-out, and again later with a longer gap. The times here are only an illustration.', { kind: 'lost', ms: '1000 ms' });
            R(0, 1, 'SYN again (lost)', '1 Connect', 'Still silence. Your program\'s own time-out ends the wait: connect() fails after seconds, with a time-out and no other clue.', { kind: 'lost', ms: '3000 ms' });
            return { actors: A, rows, end: { kind: 'fail', title: 'Timed out' } };
          }
          // TCP, normal or with a lost segment
          R(0, 1, 'SYN · seq 1000', '1 Connect', 'The ESP asks to open a connection: SYN, with its starting sequence number.', { ms: '0 ms', stt: 'SYN_SENT', del: '0 bytes' });
          R(1, 0, 'SYN-ACK · seq 5000 · ack 1001', '1 Connect', 'The server agrees, gives its own starting number and acknowledges 1001, the next byte it expects from the ESP.', { ms: '12 ms' });
          R(0, 1, 'ACK · ack 5001', '1 Connect', 'The connection is open: connect() returns, one round trip after the SYN.', { ms: '24 ms', stt: 'ESTABLISHED' });
          if (v.sc === 'lost') {
            R(0, 1, 'data · seq 1001 · 20 bytes (lost)', '2 Data', 'The first request is lost on the way. The ESP keeps a copy and starts a retransmission timer.', { kind: 'lost', ms: '24 ms' });
            R(0, 1, 'data · seq 1001 again', '2 Data', 'No acknowledgement before the timer ran out (about a second here), so the same bytes are sent again. The program sees nothing but a delay.', { kind: 'warn', ms: '≈ 1024 ms' });
          } else R(0, 1, 'data · seq 1001 · 20 bytes', '2 Data', 'The ESP sends 20 bytes of request. Sequence number 1001 labels the first of them.', { ms: '24 ms' });
          R(1, 0, 'ACK · ack 1021', '2 Data', 'The server has all bytes up to 1020 and expects 1021 next.', { ms: v.sc === 'lost' ? '≈ 1036 ms' : '36 ms', del: '20 bytes delivered' });
          R(1, 0, 'data · seq 5001 · 24 bytes', '2 Data', 'The answer comes back the same way.', { ms: v.sc === 'lost' ? '≈ 1040 ms' : '40 ms' });
          R(0, 1, 'ACK · ack 5025', '2 Data', 'The ESP acknowledges the 24 bytes; both directions have been delivered in full.', { ms: v.sc === 'lost' ? '≈ 1052 ms' : '52 ms', del: '20 up, 24 down' });
          if (v.fin) {
            R(0, 1, 'FIN', '3 Close', 'The ESP has nothing more to say and closes its side.', { stt: 'FIN_WAIT' });
            R(1, 0, 'ACK, FIN', '3 Close', 'The server acknowledges and closes its own side.');
            R(0, 1, 'ACK', '3 Close', 'The last acknowledgement. The ESP waits a little before it forgets the connection, so that a stray late packet is not mistaken for a new one.', { stt: 'TIME_WAIT, then CLOSED' });
          }
          return { actors: A, rows, end: { kind: v.sc === 'lost' ? 'warn' : 'ok', title: v.sc === 'lost' ? 'Delivered, after a retransmission' : 'Delivered in full' } };
        },
        onChange: (ctl) => { ctl.show('fin', ctl.values.sc === 'ok' || ctl.values.sc === 'lost'); },
        readouts: [
          ['step', 'This step', s => s.done ? (s.plan.end.title + '.') : s.plan.rows[s.shown].why],
          ['stt', 'The ESP\'s TCP state', s => carried(s.plan, s.shown, 'stt', 'CLOSED')],
          ['del', 'Bytes delivered', s => carried(s.plan, s.shown, 'del', '0 bytes')],
          ['ms', 'Time (schematic)', s => carried(s.plan, s.shown, 'ms', '0 ms')]
        ]
      });
    }
  });

  /* ================================================================ ip-http */
  const JSON_H = 'Content-Type: application/json', TEXT_H = 'Content-Type: text/plain';
  const PRESETS = {
    get: {
      title: 'a page or a value from a server', host: 'example.com', asker: 'the ESP asks',
      cases: [
        { id: 'ok', name: 'A normal answer', method: 'GET', path: '/api/status', rq: ['Accept: application/json'], st: 200, rs: [JSON_H], body: ['{"temp":21.5,"unit":"C"}'], mean: 'It worked: the body is the data.', do: 'Parse the body.' },
        { id: 'moved', name: 'The page has moved (301)', method: 'GET', path: '/status', rq: ['Accept: application/json'], st: 301, rs: ['Location: https://example.com/api/status'], body: [], mean: 'The page lives somewhere else; the new address is in the Location header.', do: 'Ask again at that address, or set the client to follow redirects. Note that it is https.' },
        { id: 'missing', name: 'Nothing at that path (404)', method: 'GET', path: '/api/reading', rq: ['Accept: application/json'], st: 404, rs: [TEXT_H], body: ['not found'], mean: 'The server has nothing at that path. The body is an error page, not your data.', do: 'Check the path; never parse the body of a 4xx as data.' },
        { id: 'auth', name: 'A key is needed (401)', method: 'GET', path: '/api/private', rq: ['Accept: application/json'], st: 401, rs: ['WWW-Authenticate: Bearer', JSON_H], body: ['{"error":"missing key"}'], mean: 'The server wants to know who is asking.', do: 'Send the key in the header the service names, and keep it out of shared code.' },
        { id: 'busy', name: 'Asked too often (429)', method: 'GET', path: '/api/status', rq: ['Accept: application/json'], st: 429, rs: ['Retry-After: 60', JSON_H], body: ['{"error":"slow down"}'], mean: 'The service limits how often you may ask.', do: 'Wait for the time in Retry-After, and ask less often.' },
        { id: 'down', name: 'The server is failing (503)', method: 'GET', path: '/api/status', rq: ['Accept: application/json'], st: 503, rs: ['Retry-After: 30', TEXT_H], body: ['temporarily unavailable'], mean: 'The server cannot answer now. The fault is on its side, not yours.', do: 'Try again later and keep the last good value meanwhile.' },
        { id: 'refused', name: 'Nothing listens on the port', method: 'GET', path: '/api/status', rq: ['Accept: application/json'], noTcp: 'refused', mean: 'The machine answered the connection attempt with a refusal: no web server on that port.', do: 'Check the address and the port; the HTTP request was never sent.' }
      ]
    },
    rest: {
      title: 'a REST API on your own network', host: '192.168.1.10:8080', asker: 'the ESP asks',
      cases: [
        { id: 'read', name: 'Read one record', method: 'GET', path: '/api/readings/42', rq: ['Accept: application/json'], st: 200, rs: [JSON_H], body: ['{"id":42,"sensor":"esp32","temp":21.5}'], mean: 'The record, as JSON.', do: 'Parse it, reading each field with a default.' },
        { id: 'create', name: 'Create a record (POST)', method: 'POST', path: '/api/readings', rq: [JSON_H], reqBody: ['{"sensor":"esp32","temp":21.5}'], st: 201, rs: ['Location: /api/readings/43', JSON_H], body: ['{"id":43}'], mean: 'A new record was created; Location is its address.', do: 'Nothing more: a 201 is success.' },
        { id: 'badjson', name: 'A broken body (400)', method: 'POST', path: '/api/readings', rq: [JSON_H], reqBody: ['{"sensor":"esp32","temp":21.5'], st: 400, rs: [JSON_H], body: ['{"error":"invalid JSON"}'], mean: 'The body is not valid JSON (the closing brace is missing).', do: 'Build the JSON with the library, not by joining strings.' },
        { id: 'type', name: 'No Content-Type header (415)', method: 'POST', path: '/api/readings', rq: [], reqBody: ['{"sensor":"esp32","temp":21.5}'], st: 415, rs: [JSON_H], body: ['{"error":"send JSON"}'], mean: 'The server does not know what the body is without the header.', do: 'Add Content-Type: application/json.' },
        { id: 'update', name: 'Replace the settings (PUT)', method: 'PUT', path: '/api/settings', rq: [JSON_H], reqBody: ['{"interval":60}'], st: 204, rs: [], body: [], mean: '204 No Content: done, and there is nothing to send back.', do: 'Treat any 2xx as success; do not parse an empty body.' },
        { id: 'delete', name: 'Delete a record (DELETE)', method: 'DELETE', path: '/api/readings/42', rq: [], st: 204, rs: [], body: [], mean: 'The record is gone.', do: 'Nothing more.' },
        { id: 'conflict', name: 'That record exists (409)', method: 'POST', path: '/api/readings', rq: [JSON_H], reqBody: ['{"id":42,"temp":21.5}'], st: 409, rs: [JSON_H], body: ['{"error":"id exists"}'], mean: 'The request clashes with what the server already holds.', do: 'Do not repeat it blindly: read the record, or choose another id.' }
      ]
    },
    server: {
      title: 'a browser asking the ESP', host: 'esp32.local', asker: 'the browser asks', ua: true,
      cases: [
        { id: 'root', name: 'The page', method: 'GET', path: '/', rq: ['Accept: text/html'], st: 200, rs: ['Content-Type: text/html'], body: ['<h1>ESP32</h1><p><a href=\'/led?state=1\'>LED on</a> |', '<a href=\'/led?state=0\'>LED off</a></p>'], mean: 'The handler for "/" built the page and sent it.', do: 'Nothing: this is the front door.' },
        { id: 'led', name: 'Switch the LED', method: 'GET', path: '/led?state=1', rq: ['Accept: */*'], st: 200, rs: [JSON_H], body: ['{"ok":true}'], mean: 'The handler read state=1, switched the LED and answered with JSON.', do: 'An action should be a POST: a pre-fetching browser can fire this link.' },
        { id: 'status', name: 'Read the status', method: 'GET', path: '/status', rq: ['Accept: application/json'], st: 200, rs: [JSON_H], body: ['{"led":1,"uptime_s":3721}'], mean: 'A JSON endpoint that a page, or another program, can poll.', do: 'Keep such handlers short: they run while the loop waits.' },
        { id: 'favicon', name: 'The icon every browser asks for', method: 'GET', path: '/favicon.ico', rq: ['Accept: image/*'], st: 404, rs: [TEXT_H], body: ['not found'], mean: 'No handler for that path, so the not-found handler answered. Harmless.', do: 'Ignore it, or serve a tiny icon.' },
        { id: 'long', name: 'An address that is far too long', method: 'GET', path: '/aaaa…(more than 2000 characters)', rq: ['Accept: */*'], st: 414, rs: [TEXT_H], body: ['URI too long'], mean: 'Core 3.3.12 refuses very long addresses and headers, so that a hostile client cannot exhaust the memory.', do: 'Nothing: the limit is a protection.' }
      ]
    },
    webhook: {
      title: 'a message to a chat service', host: 'api.telegram.org', asker: 'the ESP asks',
      cases: [
        { id: 'ok', name: 'The message is sent', method: 'POST', path: '/bot123456:your-bot-token/sendMessage', rq: [JSON_H], reqBody: ['{"chat_id":"123456789",', ' "text":"The button was pressed"}'], st: 200, rs: [JSON_H], body: ['{"ok":true,"result":{"message_id":88,…}}'], mean: 'The service accepted the message and posted it.', do: 'Treat 200 as sent. Keep a cool-down so that a flapping sensor cannot flood the chat.' },
        { id: 'token', name: 'A wrong token (401)', method: 'POST', path: '/bot123456:wrong-token/sendMessage', rq: [JSON_H], reqBody: ['{"chat_id":"123456789",', ' "text":"The button was pressed"}'], st: 401, rs: [JSON_H], body: ['{"ok":false,"error_code":401,', ' "description":"Unauthorized"}'], mean: 'The token does not belong to any bot.', do: 'Check the token. If it leaked, revoke it and use a new one.' },
        { id: 'chat', name: 'The chat does not exist (400)', method: 'POST', path: '/bot123456:your-bot-token/sendMessage', rq: [JSON_H], reqBody: ['{"chat_id":"000",', ' "text":"The button was pressed"}'], st: 400, rs: [JSON_H], body: ['{"ok":false,"error_code":400,', ' "description":"Bad Request: chat not found"}'], mean: 'The bot cannot write to that chat: a wrong id, or nobody has started the bot.', do: 'Send the bot a message first, and use the chat id it reports.' },
        { id: 'empty', name: 'No text (400)', method: 'POST', path: '/bot123456:your-bot-token/sendMessage', rq: [JSON_H], reqBody: ['{"chat_id":"123456789"}'], st: 400, rs: [JSON_H], body: ['{"ok":false,"error_code":400,', ' "description":"Bad Request: message text', ' is empty"}'], mean: 'The text field is missing.', do: 'Build the JSON with the library and test for empty strings.' },
        { id: 'flood', name: 'Too many messages (429)', method: 'POST', path: '/bot123456:your-bot-token/sendMessage', rq: [JSON_H], reqBody: ['{"chat_id":"123456789",', ' "text":"The button was pressed"}'], st: 429, rs: ['Retry-After: 17', JSON_H], body: ['{"ok":false,"error_code":429,', ' "description":"Too Many Requests:', ' retry after 17"}'], mean: 'The device sent faster than the service allows.', do: 'Wait the time given, and add a cool-down in the device.' }
      ]
    }
  };
  const REASONS = { 200: 'OK', 201: 'Created', 204: 'No Content', 301: 'Moved Permanently', 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found', 409: 'Conflict', 414: 'URI Too Long', 415: 'Unsupported Media Type', 429: 'Too Many Requests', 503: 'Service Unavailable' };

  Hyper.sim('ip-http', {
    title: 'An HTTP request and its response',
    blurb: `The top box is the request as it travels as text, the bottom box the response. The first line of the response carries the **status code**, coloured by its class: green for 2xx, amber for 3xx, red for 4xx and 5xx. The panel shows what the program gets back from the Arduino \`HTTPClient\` and from MicroPython's \`requests\`.

Choose a **situation**, then move the two sliders: how long the server takes, and how long the client is willing to wait. The bar at the bottom shows the program being stuck.

**Try this**
- Step through the situations: only the first digit of the status decides what to do next.
- Choose a **404** and note that the body is a page, not your data.
- Make the server take **longer than the time-out**: the call returns -11 (Arduino) or raises an error, and the response is never read. The server may still have done the job: a POST is not safe to repeat blindly.
- Compare the ESP as a client with **a browser asking the ESP** in the server preset.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const P = PRESETS[params.preset] || PRESETS.get;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 400, maxH: 580 });
      const ctl = kit.controls(box.side, [
        { id: 'sc', type: 'select', label: 'Situation', options: P.cases.map(k => [k.name, k.id]), value: P.cases[0].id },
        { id: 'delay', label: 'The server takes', min: 0.05, max: 10, value: 0.2, log: true, sig: 2, unit: 's' },
        { id: 'tmo', label: 'The client waits at most', min: 1, max: 10, value: 5, step: 1, unit: 's' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['status', 'Status'], ['mean', 'What it means'], ['ard', 'Arduino HTTPClient'], ['py', 'MicroPython requests'], ['do', 'What the program should do'], ['wait', 'The program is stuck for']]);
      const fit = (s, n) => { s = String(s); return s.length > n ? s.slice(0, Math.max(1, n - 1)) + '…' : s; };
      const verbCall = m => (m === 'GET' ? 'GET()' : m === 'POST' ? 'POST(body)' : m === 'PUT' ? 'PUT(body)' : 'sendRequest("' + m + '")');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const W = st.W, H = st.H;
        const k = P.cases.find(x => x.id === ctl.values.sc) || P.cases[0];
        const delay = ctl.values.delay, tmo = ctl.values.tmo;
        const noTcp = !!k.noTcp, late = !noTcp && delay > tmo, answered = !noTcp && !late;
        // the two texts
        const reqLines = [k.method + ' ' + k.path + ' HTTP/1.1', 'Host: ' + P.host];
        if (P.ua) reqLines.push('User-Agent: Mozilla/5.0 (a phone)');
        k.rq.forEach(h => reqLines.push(h));
        const rb = k.reqBody || [];
        if (rb.length) reqLines.push('Content-Length: ' + rb.join('').length);
        if (rb.length) { reqLines.push(''); rb.forEach(l => reqLines.push(l)); }
        const body = k.body || [];
        const resLines = [];
        if (answered) {
          resLines.push('HTTP/1.1 ' + k.st + ' ' + (REASONS[k.st] || ''));
          k.rs.forEach(h => resLines.push(h));
          resLines.push('Content-Length: ' + body.join('').length);
          if (body.length) { resLines.push(''); body.forEach(l => resLines.push(l)); }
        } else resLines.push(noTcp ? '(no HTTP at all: the connection was refused)' : '(nothing arrives before the time-out)');
        const pad = 12, fs = clamp(W / 58, 10, 12), total = reqLines.length + resLines.length;
        const lh = clamp((H - 150) / Math.max(1, total), 13, fs * 1.7), cw = fs * 0.6, maxc = Math.max(10, Math.floor((W - 2 * pad - 16) / cw));
        const box1 = (y, title, lines, cols) => {
          kit.label(c, title, pad, y, { size: 11.5, weight: 650, color: C.text2 });
          const by = y + 12, bh = lines.length * lh + 12;
          c.save(); c.fillStyle = C.surface; c.strokeStyle = C.border2 || C.faint; c.lineWidth = 1.2; c.fillRect(pad, by, W - 2 * pad, bh); c.strokeRect(pad + 0.5, by + 0.5, W - 2 * pad - 1, bh - 1); c.restore();
          lines.forEach((l, i) => S.text(c, fit(l, maxc), pad + 8, by + 6 + lh * (i + 0.5), { mono: true, align: 'left', size: fs, color: cols(l, i) }));
          return by + bh;
        };
        const stCol = k.st >= 500 || k.st >= 400 ? C.bad : k.st >= 300 ? C.warn : C.ok;
        let y = box1(18, 'Request: ' + P.asker, reqLines, (l, i) => (i === 0 ? C.text : C.text2));
        y = box1(y + 20, 'Response: the server answers', resLines, (l, i) => (i === 0 ? (answered ? stCol : C.muted) : answered ? C.text2 : C.muted));
        // the time bar: how long the program was stuck
        const by = H - 30, bx = pad, bw = W - 2 * pad, maxT = Math.max(tmo, delay) * 1.12, X = tt => bx + clamp(tt / maxT, 0, 1) * bw;
        const stuck = noTcp ? 0.02 : Math.min(delay, tmo);
        c.save(); c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(bx, by, bw, 10);
        c.fillStyle = late ? C.bad : C.warn; c.globalAlpha = 0.85; c.fillRect(bx, by, Math.max(2, X(stuck) - bx), 10);
        c.strokeStyle = C.bad; c.lineWidth = 1.5; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(tmo), by - 5); c.lineTo(X(tmo), by + 15); c.stroke(); c.restore();
        kit.label(c, 'the program waits: ' + (noTcp ? 'about 0.02' : kit.fmt(stuck, 2)) + ' s', bx, by - 10, { size: 10.5, color: C.muted });
        kit.label(c, 'time-out ' + tmo + ' s', clamp(X(tmo), 60, W - 6), by + 22, { size: 10, color: C.bad, align: 'right' });
        if (answered) kit.dot(c, X(delay), by + 5, 4, C.ok, C.bg2);
        // the panel
        const m = k.method;
        if (noTcp) { ro.set('status', 'none: refused'); ro.set('ard', '-1 · connection refused'); ro.set('py', 'OSError: connection refused'); ro.set('mean', k.mean); ro.set('do', k.do); }
        else if (late) { ro.set('status', 'none: no answer in time'); ro.set('ard', '-11 · read time-out'); ro.set('py', 'OSError: a time-out'); ro.set('mean', 'No answer within the time-out, so the call gives up. The server may still be working, and may even do the job.'); ro.set('do', 'Treat the result as unknown. Before repeating a POST, check whether the first one worked.'); }
        else { ro.set('status', k.st + ' ' + (REASONS[k.st] || '')); ro.set('ard', verbCall(m) + ' returns ' + k.st); ro.set('py', 'r.status_code is ' + k.st); ro.set('mean', k.mean); ro.set('do', k.do); }
        ro.set('wait', noTcp ? 'about 0.02 s' : kit.fmt(stuck, 2) + ' s' + (late ? ' (the whole time-out)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ip-tls */
  Hyper.sim('ip-tls', {
    title: 'The TLS handshake and what the ESP checks',
    blurb: `The ESP is on the left, the server (or an impostor) on the right. The panel shows what the ESP knows when the certificate arrives: its own **clock**, what the **certificate says**, and the three checks it makes. The handshake is drawn in a general form: TLS 1.2 and TLS 1.3 differ in the number of messages.

**Try this**
- Play the **correct server**: only when the root, the name and the dates all pass does the encrypted conversation start.
- Choose **the ESP clock is wrong**: the server and the root are fine, but the certificate "starts in the future" for a device that believes it is 1970.
- Compare **expired**, **root missing** and **name mismatch**: each is a different alert at the same moment.
- Choose **no check at all**: the handshake succeeds with an impostor. The data is encrypted, but to the wrong party.`,
    mount(box, kit) {
      converse(box, kit, {
        aspect: 0.8, minH: 380,
        controls: [{ id: 'sc', type: 'select', label: 'Scenario', options: [['A correct server, a correct clock', 'ok'], ['The ESP clock is wrong (1970)', 'clock'], ['The certificate has expired', 'expired'], ['The root is not in the ESP', 'root'], ['The name does not match', 'name'], ['No check at all, and an impostor answers', 'insecure']], value: 'ok' }],
        plan: v => {
          const rows = [], R = rowMaker(rows);
          const imp = v.sc === 'insecure';
          const A = [{ kind: 'esp', label: 'ESP', sub: 'client' }, imp ? { kind: 'laptop', label: 'impostor', sub: 'on the same Wi-Fi', color: 4 } : { kind: 'server', label: 'server', sub: 'example.com' }];
          const cert = { ok: 'example.com · valid 2026-08-12 to 2026-11-10', clock: 'example.com · valid 2026-08-12 to 2026-11-10', expired: 'example.com · valid 2026-03-01 to 2026-05-30', root: 'example.com · signed by Example Root CA', name: 'other-host.example · valid 2026-08-12 to 2026-11-10', insecure: 'anything the impostor invents' }[v.sc];
          const clock = v.sc === 'clock' ? '1970-01-01 (not set)' : '2026-10-04';
          const chk = { ok: ['yes', 'yes: example.com', 'yes'], clock: ['yes', 'yes', 'NO: it starts 2026-08-12, the clock says 1970'], expired: ['yes', 'yes', 'NO: it ended 2026-05-30'], root: ['NO: that root is not stored on the ESP', 'yes', 'yes'], name: ['yes', 'NO: the certificate is for other-host.example', 'yes'], insecure: ['not checked', 'not checked', 'not checked'] }[v.sc];
          R(0, 1, 'ClientHello · server name', '1 Hello', imp ? 'The ESP asks for example.com. A machine on the same network answers in its place (it has tricked the name lookup or runs a fake access point).' : 'The ESP lists the TLS versions and ciphers it knows, a random number and the name of the server it wants.', {});
          R(1, 0, imp ? 'any certificate' : 'ServerHello · certificate', '2 Certificate', imp ? 'The impostor shows a certificate it made itself. A client with no checks does not even look.' : 'The server chooses the settings and sends its certificate chain: the site\'s certificate and any intermediates, signed up to a root.', { chk, kind: imp ? 'warn' : 'ok' });
          if (v.sc === 'ok') {
            R(0, 1, 'Finished', '3 Keys', 'The checks passed, so the ESP trusts the server and the keys are agreed. Everything from here is encrypted and protected against tampering.', { vd: 'trusted' });
            R(1, 0, 'Finished', '3 Keys', 'The server confirms with the same keys.');
            R(0, 1, 'GET /api/status (encrypted)', '4 Data', 'The HTTP request travels inside the encrypted channel.', { vd: 'trusted: encrypted and authenticated' });
            R(1, 0, '200 OK + body (encrypted)', '4 Data', 'The answer comes back the same way.');
            return { actors: A, rows, cert, clock, end: { kind: 'ok', title: 'A secure connection' } };
          }
          if (imp) {
            R(0, 1, 'Finished', '3 Keys', 'The ESP accepts: it agrees keys with the impostor.', { kind: 'warn', vd: 'accepted without a check' });
            R(1, 0, 'Finished', '3 Keys', 'The impostor confirms.', { kind: 'warn' });
            R(0, 1, 'password (encrypted)', '4 Data', 'Everything is encrypted, but to the impostor, who reads it and may pass it on to the real server.', { kind: 'warn', vd: 'encrypted to the wrong party' });
            return { actors: A, rows, cert, clock, end: { kind: 'warn', title: 'Encrypted to the wrong party' } };
          }
          const al = { clock: ['Alert: certificate not yet valid', 'The certificate starts on 2026-08-12 but the ESP thinks it is 1970. Nothing is wrong with the server: the ESP has no time. Set the clock first.'],
            expired: ['Alert: certificate expired', 'The certificate ended on 2026-05-30, before the date the ESP knows. The server needs a new certificate (or, if the ESP\'s clock is ahead, a sync).'],
            root: ['Alert: unknown CA', 'The chain ends at a root that the ESP does not hold. Store the right root certificate, or use a bundle of public roots.'],
            name: ['Alert: name mismatch', 'The certificate is for another name than the one asked for: often a connection by IP address, or a server that serves several names.'] }[v.sc];
          R(0, 1, al[0], '3 Alert', al[1], { kind: 'fail', vd: 'refused' });
          return { actors: A, rows, cert, clock, end: { kind: 'fail', title: 'The handshake fails' } };
        },
        readouts: [
          ['step', 'This step', s => s.done ? (s.plan.end.title + '.') : s.plan.rows[s.shown].why],
          ['clock', 'The ESP clock says', s => s.plan.clock],
          ['cert', 'The certificate says', s => (s.shown >= 2 ? s.plan.cert : 'not received yet')],
          ['chain', 'Chain ends at a trusted root?', s => carried(s.plan, s.shown, 'chk', ['—', '—', '—'])[0]],
          ['name', 'Name matches?', s => carried(s.plan, s.shown, 'chk', ['—', '—', '—'])[1]],
          ['dates', 'Dates valid on the ESP clock?', s => carried(s.plan, s.shown, 'chk', ['—', '—', '—'])[2]],
          ['vd', 'Verdict', s => carried(s.plan, s.shown, 'vd', 'pending')]
        ]
      });
    }
  });

  /* ================================================================ ip-qos */
  Hyper.sim('ip-qos', {
    title: 'What QoS 0, 1 and 2 do when the line breaks',
    blurb: `One message from the ESP to the broker (or, for CoAP, to a server), with a fault in the middle. For **MQTT** the interesting fault is not a lost packet, which TCP repairs by itself, but a **broken connection**: the sender then has to decide whether to send again after it reconnects. For **CoAP**, which runs on UDP, a packet really can be lost, and the protocol resends it. The times are schematic.

**Try this**
- Choose **QoS 0** and break the connection before delivery: the message is gone, and the ESP never knows.
- Choose **QoS 1**, the acknowledgement lost: the message arrives **twice**. At least once means exactly that.
- Choose **QoS 2** with the same fault: it still arrives once, at the price of four messages.
- Switch to **CoAP confirmable** with a lost request, then with a lost acknowledgement; and see what a non-confirmable message does without either.`,
    mount(box, kit, params) {
      converse(box, kit, {
        aspect: 0.82, minH: 380,
        controls: [
          { id: 'proto', type: 'select', label: 'Protocol', options: [['MQTT QoS 0: at most once', 'q0'], ['MQTT QoS 1: at least once', 'q1'], ['MQTT QoS 2: exactly once', 'q2'], ['CoAP confirmable (CON)', 'coap'], ['CoAP non-confirmable (NON)', 'non']], value: params.proto === 'coap' ? 'coap' : 'q1' },
          { id: 'mt', type: 'select', label: 'What goes wrong (MQTT)', options: [['Nothing', 'none'], ['The connection drops before the broker has the message', 'before'], ['The connection drops after the broker has it, before the acknowledgement', 'after']], value: 'after' },
          { id: 'ct', type: 'select', label: 'What goes wrong (CoAP)', options: [['Nothing', 'none'], ['The request is lost', 'req'], ['The acknowledgement or reply is lost', 'ack']], value: 'req' }
        ],
        onChange: (ctl) => { const m = String(ctl.values.proto).charAt(0) === 'q'; ctl.show('mt', m); ctl.show('ct', !m); },
        plan: v => {
          const rows = [], R = rowMaker(rows);
          const mq = String(v.proto).charAt(0) === 'q';
          if (mq) {
            const q = +String(v.proto).charAt(1), t = v.mt;
            const A = [{ kind: 'esp', label: 'ESP', sub: 'publisher' }, { kind: 'broker', label: 'broker', sub: 'home/kitchen/temp' }];
            const ns = 'The ESP cannot tell: nothing came back.';
            if (q === 0) {
              if (t === 'before') {
                R(0, 1, 'PUBLISH QoS 0 · 21.5', '1 Publish', 'The connection breaks before the broker has read the message. QoS 0 keeps nothing and asks for nothing: the message is simply gone, and the ESP does not know.', { kind: 'lost', cp: '0', know: 'no: nothing is acknowledged' });
                return { actors: A, rows, end: { kind: 'fail', title: 'Lost, and nobody knows' } };
              }
              R(0, 1, 'PUBLISH QoS 0 · 21.5', '1 Publish', t === 'after' ? 'The broker has the message, so a later break changes nothing for it. The ESP still has no confirmation and will never resend.' : 'One message, no acknowledgement. Cheap and fast, and enough when the next reading will replace this one.', { cp: '1', know: 'no: nothing is acknowledged' });
              return { actors: A, rows, end: { kind: 'ok', title: 'Delivered, with no acknowledgement' } };
            }
            if (q === 1) {
              if (t === 'none') {
                R(0, 1, 'PUBLISH QoS 1 · id 7', '1 Publish', 'The message carries a packet id, 7, and the ESP keeps a copy until it is acknowledged.', { cp: '1', know: 'not yet' });
                R(1, 0, 'PUBACK · id 7', '1 Publish', 'The broker confirms id 7. The ESP may forget its copy.', { know: 'yes' });
                return { actors: A, rows, end: { kind: 'ok', title: 'Delivered and acknowledged' } };
              }
              if (t === 'before') {
                R(0, 1, 'PUBLISH QoS 1 · id 7', '1 Publish', 'The connection breaks while the message is on its way, and the broker never has it. The ESP keeps its copy: no PUBACK came.', { kind: 'lost', cp: '0', know: 'not yet' });
                R(0, 1, 'reconnect, session kept', '2 Reconnect', 'The ESP reconnects with a persistent session. Messages not yet acknowledged are due to be sent again.', { color: 'faint' });
                R(0, 1, 'PUBLISH · id 7 · DUP', '3 Resend', 'The same message again, with the DUP flag set.', { cp: '1' });
                R(1, 0, 'PUBACK · id 7', '3 Resend', 'Now the broker confirms.', { know: 'yes' });
                return { actors: A, rows, end: { kind: 'ok', title: 'Delivered once, after a resend' } };
              }
              R(0, 1, 'PUBLISH QoS 1 · id 7', '1 Publish', 'The broker receives the message and passes it on to the subscribers.', { cp: '1', know: 'not yet' });
              R(1, 0, 'PUBACK · id 7 (lost)', '1 Publish', 'The connection breaks just as the acknowledgement is on its way. The broker has done its work, but the ESP does not know it.', { kind: 'lost', know: 'no' });
              R(0, 1, 'reconnect, session kept', '2 Reconnect', 'The ESP reconnects and finds message 7 still unacknowledged.', { color: 'faint' });
              R(0, 1, 'PUBLISH · id 7 · DUP', '3 Resend', 'To be sure, the ESP sends it again. The broker cannot always tell it is a repeat, so subscribers may receive a second copy.', { kind: 'warn', cp: '2' });
              R(1, 0, 'PUBACK · id 7', '3 Resend', 'Confirmed at last.', { know: 'yes' });
              return { actors: A, rows, end: { kind: 'warn', title: 'Delivered twice: handle duplicates' } };
            }
            // QoS 2
            const four = (cp) => {
              R(0, 1, 'PUBLISH QoS 2 · id 7', '1 Publish', 'The broker stores the message under id 7 and takes responsibility for delivering it once.', { cp: cp, know: 'not yet' });
              R(1, 0, 'PUBREC · id 7', '1 Publish', 'Received: the broker confirms it holds message 7.');
              R(0, 1, 'PUBREL · id 7', '2 Release', 'The ESP releases it: "you may forget that you had it twice".');
              R(1, 0, 'PUBCOMP · id 7', '2 Release', 'Complete. Both sides forget id 7.', { know: 'yes' });
            };
            if (t === 'none') { four('1'); return { actors: A, rows, end: { kind: 'ok', title: 'Exactly once' } }; }
            if (t === 'before') {
              R(0, 1, 'PUBLISH QoS 2 · id 7', '1 Publish', 'The connection breaks and the broker never has the message. The ESP keeps its copy.', { kind: 'lost', cp: '0', know: 'not yet' });
              R(0, 1, 'reconnect, session kept', '2 Reconnect', 'The ESP resumes the session and sends message 7 again.', { color: 'faint' });
              R(0, 1, 'PUBLISH · id 7 · DUP', '3 Resend', 'The first time that the broker sees id 7.', { cp: '1' });
              R(1, 0, 'PUBREC · id 7', '3 Resend', 'Received.');
              R(0, 1, 'PUBREL · id 7', '4 Release', 'Released.');
              R(1, 0, 'PUBCOMP · id 7', '4 Release', 'Complete.', { know: 'yes' });
              return { actors: A, rows, end: { kind: 'ok', title: 'Exactly once' } };
            }
            R(0, 1, 'PUBLISH QoS 2 · id 7', '1 Publish', 'The broker stores message 7 and takes responsibility for it.', { cp: '1', know: 'not yet' });
            R(1, 0, 'PUBREC · id 7 (lost)', '1 Publish', 'The connection breaks as the PUBREC is on its way. The ESP does not know that the broker has the message.', { kind: 'lost', know: 'no' });
            R(0, 1, 'reconnect, session kept', '2 Reconnect', 'The ESP resumes and sends message 7 again.', { color: 'faint' });
            R(0, 1, 'PUBLISH · id 7 · DUP', '3 Resend', 'The broker still holds id 7, so it recognises the repeat and does not deliver it a second time.', { kind: 'warn' });
            R(1, 0, 'PUBREC · id 7', '3 Resend', 'It simply repeats its confirmation.');
            R(0, 1, 'PUBREL · id 7', '4 Release', 'Released.');
            R(1, 0, 'PUBCOMP · id 7', '4 Release', 'Complete: one copy was delivered.', { know: 'yes' });
            return { actors: A, rows, end: { kind: 'ok', title: 'Exactly once, even after a repeat' } };
          }
          // CoAP
          const A = [{ kind: 'esp', label: 'ESP', sub: 'client' }, { kind: 'server', label: 'CoAP server', sub: 'UDP port 5683' }];
          const t = v.ct;
          if (v.proto === 'coap') {
            R(0, 1, t === 'req' ? 'CON GET /temp · MID 1A2B (lost)' : 'CON GET /temp · MID 1A2B', '1 Request', t === 'req' ? 'A confirmable request: it asks to be acknowledged. UDP drops it on the way, so the server never sees it.' : 'A confirmable request, with a message id that identifies it.', { kind: t === 'req' ? 'lost' : 'ok', cp: t === 'req' ? '0' : '1', know: 'not yet', tm: '0 s' });
            if (t === 'none') { R(1, 0, 'ACK 2.05 Content · 21.5', '1 Request', 'The acknowledgement carries the answer as well: 2.05 Content, with the temperature.', { know: 'yes', tm: '0.05 s' }); return { actors: A, rows, end: { kind: 'ok', title: 'Answered at once' } }; }
            if (t === 'req') {
              R(0, 1, 'CON again · MID 1A2B', '2 Retry', 'No acknowledgement within the time-out (two to three seconds at first), so the client sends the same message again and doubles the wait for the next time, up to four retries.', { kind: 'warn', cp: '1', tm: '≈ 2.5 s' });
              R(1, 0, 'ACK 2.05 Content · 21.5', '2 Retry', 'Answered, after one retry.', { know: 'yes', tm: '≈ 2.6 s' });
              return { actors: A, rows, end: { kind: 'ok', title: 'Answered after one retry' } };
            }
            R(1, 0, 'ACK 2.05 · 21.5 (lost)', '1 Request', 'The server got the request and answered, but the answer is lost on the way.', { kind: 'lost', know: 'no', tm: '0.05 s' });
            R(0, 1, 'CON again · MID 1A2B', '2 Retry', 'The client waits, then sends the same message again.', { kind: 'warn', tm: '≈ 2.5 s' });
            R(1, 0, 'ACK 2.05 · 21.5 (again)', '2 Retry', 'The server sees the message id 1A2B for the second time: it answers again, but does not repeat the work.', { know: 'yes', tm: '≈ 2.6 s' });
            return { actors: A, rows, end: { kind: 'ok', title: 'Handled once, answered twice' } };
          }
          // non-confirmable
          R(0, 1, t === 'req' ? 'NON GET /temp (lost)' : 'NON GET /temp', '1 Request', t === 'req' ? 'A non-confirmable request: fire and forget. It is lost, and nobody will ever resend it.' : 'A non-confirmable request: no acknowledgement is asked for.', { kind: t === 'req' ? 'lost' : 'ok', cp: t === 'req' ? '0' : '1', know: 'not yet', tm: '0 s' });
          if (t === 'req') return { actors: A, rows, end: { kind: 'fail', title: 'Lost: the client waits for nothing' } };
          R(1, 0, t === 'ack' ? 'NON 2.05 · 21.5 (lost)' : 'NON 2.05 · 21.5', '1 Request', t === 'ack' ? 'The server acted and replied, but the reply is lost. Nothing is resent.' : 'The reply is a message of its own, and equally unacknowledged.', { kind: t === 'ack' ? 'lost' : 'ok', know: t === 'ack' ? 'no' : 'yes', tm: '0.05 s' });
          return { actors: A, rows, end: { kind: t === 'ack' ? 'warn' : 'ok', title: t === 'ack' ? 'Done, but the client never hears' : 'Answered, with no guarantees' } };
        },
        readouts: [
          ['step', 'This step', s => s.done ? (s.plan.end.title + '.') : s.plan.rows[s.shown].why],
          ['cp', 'Copies that reach the receiver', s => carried(s.plan, s.shown, 'cp', '0')],
          ['know', 'The sender knows it arrived?', s => carried(s.plan, s.shown, 'know', 'not yet')],
          ['tm', 'Time (schematic)', s => carried(s.plan, s.shown, 'tm', '0 s')]
        ]
      });
    }
  });

  /* ================================================================ ip-ntp */
  const tod = ms => {
    ms = Math.round(ms);
    const f = ((ms % 1000) + 1000) % 1000, s = Math.floor(ms / 1000);
    return pad2(Math.floor(s / 3600) % 24) + ':' + pad2(Math.floor(s / 60) % 60) + ':' + pad2(((s % 60) + 60) % 60) + '.' + (f < 10 ? '00' : f < 100 ? '0' : '') + f;
  };

  Hyper.sim('ip-ntp', {
    title: 'Four timestamps and one offset',
    blurb: `Time runs downwards. The ESP (left) sends a question and notes **t1** by its own clock; the server (right) notes **t2** on arrival and **t3** when it answers, by its clock; the ESP notes **t4** when the answer comes. From the four numbers the ESP computes how far apart the clocks are (**offset**) and how long the messages spent on the network (**delay**). The server takes 2 ms to answer.

**Try this**
- With equal paths, **Set the clock**: the offset is exact and the error left is zero.
- Make the request take **200 ms** and the answer **10 ms**, then set the clock: some **95 ms** of error remain: half the difference of the two paths, which the method cannot see.
- Drag the **ESP clock error** to a large value: the offset follows it exactly, and the delay does not change.
- Watch the **delay**: a sample with a long delay is less trustworthy, which is why NTP clients prefer the one with the shortest.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 380, maxH: 560 });
      const PROC = 2, T0 = 12 * 3600 * 1000;
      const ctl = kit.controls(box.side, [
        { id: 'err', label: 'The ESP clock is wrong by', min: -3000, max: 3000, value: 1200, step: 1, unit: 'ms' },
        { id: 'd1', label: 'The request takes', min: 2, max: 300, value: 12, step: 1, unit: 'ms' },
        { id: 'd2', label: 'The answer takes', min: 2, max: 300, value: 12, step: 1, unit: 'ms' },
        { type: 'buttons', items: [{ id: 'set', label: 'Set the clock', primary: true }, { id: 'reset', label: 'Break the clock again' }] }
      ], (id) => {
        if (id === 'set') ctl.set('err', clamp(Math.round(ctl.values.err + measure().theta), -3000, 3000));
        else if (id === 'reset') ctl.set('err', 1200);
        loop.once();
      });
      const ro = kit.readout(box.side, [['theta', 'Measured offset: add this to the ESP clock'], ['true', 'The real offset'], ['err', 'Error left after setting the clock'], ['delta', 'Round-trip delay'], ['now', 'ESP clock error now']]);
      function measure() {
        const e = ctl.values.err, d1 = ctl.values.d1, d2 = ctl.values.d2;
        const t1 = T0 + e, t2 = T0 + d1, t3 = t2 + PROC, t4 = T0 + d1 + PROC + d2 + e;
        const theta = ((t2 - t1) + (t3 - t4)) / 2, delta = (t4 - t1) - (t3 - t2);
        return { t1, t2, t3, t4, theta, delta, real: -e, left: theta - (-e), d1, d2, e };
      }
      const sg = v => (v > 0.0005 ? '+' : v < -0.0005 ? '−' : '') + (Math.abs(v) >= 1000 ? kit.fmt(Math.abs(v) / 1000, 4) + ' s' : kit.fmt(Math.abs(v), 4) + ' ms');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, m = measure();
        const xL = W * 0.3, xR = W * 0.7, top = 74, bot = H - 54, total = m.d1 + PROC + m.d2;
        const Y = tt => top + 18 + clamp(tt / total, 0, 1) * (bot - top - 40);
        S.node(c, xL, 24, { kind: 'esp', label: 'ESP', sub: 'its own clock', r: 14 });
        S.node(c, xR, 24, { kind: 'server', label: 'time server', sub: 'the right time', r: 14 });
        kit.arrow(c, xL, top, xL, bot, C.faint, 1.5); kit.arrow(c, xR, top, xR, bot, C.faint, 1.5);
        kit.label(c, 'time', xL - 8, bot + 8, { size: 10, color: C.faint, align: 'right' }); kit.label(c, 'time', xR + 8, bot + 8, { size: 10, color: C.faint });
        // the server's turnaround
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 5; c.beginPath(); c.moveTo(xR, Y(m.d1)); c.lineTo(xR, Y(m.d1 + PROC)); c.stroke(); c.restore();
        // the two messages
        kit.arrow(c, xL, Y(0), xR, Y(m.d1), C.text2, 2);
        kit.arrow(c, xR, Y(m.d1 + PROC), xL, Y(total), C.warn, 2);
        kit.label(c, 'request · ' + m.d1 + ' ms', (xL + xR) / 2, (Y(0) + Y(m.d1)) / 2 - 9, { size: 10.5, color: C.text, align: 'center', bg: C.dark ? 'rgba(13,16,32,.78)' : 'rgba(255,255,255,.82)' });
        kit.label(c, 'answer · ' + m.d2 + ' ms', (xL + xR) / 2, (Y(m.d1 + PROC) + Y(total)) / 2 + 9, { size: 10.5, color: C.text, align: 'center', bg: C.dark ? 'rgba(13,16,32,.78)' : 'rgba(255,255,255,.82)' });
        // the four timestamps
        const tick = (x, y, name, val, side) => { kit.dot(c, x, y, 3.5, C.text); kit.label(c, name + '  ' + tod(val), x + (side === 'L' ? -9 : 9), y, { size: 10.5, color: C.text, align: side === 'L' ? 'right' : 'left', weight: 600 }); };
        tick(xL, Y(0), 't1', m.t1, 'L'); tick(xR, Y(m.d1), 't2', m.t2, 'R'); tick(xR, Y(m.d1 + PROC), 't3', m.t3, 'R'); tick(xL, Y(total), 't4', m.t4, 'L');
        kit.label(c, 'offset = ((t2 − t1) + (t3 − t4)) ÷ 2 = ' + sg(m.theta), 12, H - 30, { size: 11.5, weight: 600, color: C.text });
        kit.label(c, 'delay = (t4 − t1) − (t3 − t2) = ' + sg(m.delta).replace('+', ''), 12, H - 12, { size: 11.5, color: C.text2 });
        ro.set('theta', sg(m.theta));
        ro.set('true', sg(m.real));
        ro.set('err', sg(m.left) + (Math.abs(m.left) < 0.0005 ? ' (none)' : ' (half the difference of the two paths)'));
        ro.set('delta', sg(m.delta).replace('+', ''));
        ro.set('now', sg(m.e));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ip-mqtt */
  // does a subscription filter match a topic? + is one level, # is the rest (last)
  function topicMatches(filter, topic) {
    const f = filter.split('/'), t = topic.split('/');
    for (let i = 0; i < f.length; i++) {
      if (f[i] === '#') return i === f.length - 1;
      if (i >= t.length) return false;
      if (f[i] !== '+' && f[i] !== t[i]) return false;
    }
    return f.length === t.length;
  }
  const SUBS = { A: { kind: 'phone', label: 'dashboard', filters: ['home/+/temp'], y: 0.2 }, B: { kind: 'laptop', label: 'logger', filters: ['home/#'], y: 0.5 }, C: { kind: 'display', label: 'late display', filters: ['home/+/temp', 'home/+/status'], y: 0.8 } };

  Hyper.sim('ip-mqtt', {
    title: 'Publishers, a broker and subscribers',
    blurb: `The sensor (left) publishes to the broker (centre); the broker passes each message to every connected subscriber whose **filter** matches the topic. The dashboard listens to \`home/+/temp\`, the logger to \`home/#\`. The late display is not connected until you connect it. The panel shows what each subscriber received and what the broker remembers.

**Try this**
- Publish to **home/kitchen/temp**, then to **home/kitchen/oven/temp**: the dashboard's \`+\` covers one level only, the logger's \`#\` covers all.
- Publish a few values **with retain**, then **connect the late display**: it receives the retained values at once, instead of waiting for the next reading.
- **Cut the sensor's power** with the last will ticked: after the keep-alive runs out (shortened here) the broker itself publishes *offline*, retained, to the status topic.
- Untick the last will and cut the power again: nothing is announced, and the status stays *online* for ever.
- **Clear the retained message** of a topic by publishing an empty one.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 360, maxH: 540 });
      const TOPICS = ['home/kitchen/temp', 'home/garage/temp', 'home/kitchen/humidity', 'home/kitchen/oven/temp'].map(t => [t, t]);
      const STATUS = 'home/kitchen/status';
      let T = 0, lateOn = false, sensorOn = true, willAt = null;
      const flights = [], queue = [], retained = {}, got = { A: 'nothing yet', B: 'nothing yet', C: 'not connected' }, flash = { broker: -9, sensor: -9, A: -9, B: -9, C: -9 };
      const ctl = kit.controls(box.side, [
        { id: 'topic', type: 'select', label: 'Publish to', options: TOPICS, value: TOPICS[0][1] },
        { id: 'val', label: 'Value', min: 0, max: 40, value: 21.5, step: 0.5 },
        { id: 'retain', type: 'check', label: 'Retain the message', value: params.retain === true },
        { id: 'will', type: 'check', label: 'The sensor registered a last will', value: true },
        { type: 'buttons', items: [{ id: 'pub', label: 'Publish', primary: true }, { id: 'late', label: 'Connect or drop the late display' }, { id: 'power', label: 'Cut or restore the sensor\'s power' }, { id: 'clear', label: 'Clear the retained message' }] }
      ], (id) => {
        const topic = ctl.values.topic;
        if (id === 'pub' && sensorOn) publish(topic, String(ctl.values.val), !!ctl.values.retain);
        else if (id === 'clear' && sensorOn) publish(topic, '', true);
        else if (id === 'late') toggleLate();
        else if (id === 'power') togglePower();
        loop.start(); loop.once();
      });
      const ro = kit.readout(box.side, [['A', 'Dashboard got'], ['B', 'Logger got'], ['C', 'Late display got'], ['ret', 'The broker remembers'], ['status', 'Status topic now']]);
      const geo = () => {
        const W = st.W, H = st.H;
        return { r: clamp(W / 32, 12, 17), sensor: [W * 0.11, H * 0.5], broker: [W * 0.46, H * 0.5], A: [W * 0.82, H * SUBS.A.y], B: [W * 0.82, H * SUBS.B.y], C: [W * 0.82, H * SUBS.C.y] };
      };
      function fly(from, to, label, color, cb) { flights.push({ from, to, label, color, t0: T, dur: 0.7, cb }); }
      function deliver(topic, payload, why) {
        for (const k of Object.keys(SUBS)) {
          if (k === 'C' && !lateOn) continue;
          if (!SUBS[k].filters.some(f => topicMatches(f, topic))) continue;
          fly('broker', k, (why ? 'retained ' : '') + (payload === '' ? '(empty)' : payload), why ? kit.colors().warn : kit.colors().ok, () => { flash[k] = T; got[k] = topic + ' = ' + (payload === '' ? '(empty)' : payload) + (why ? ' (retained)' : ''); });
        }
      }
      function publish(topic, payload, retain) {
        fly('sensor', 'broker', payload === '' ? '(empty)' : payload, kit.colors().accent, () => {
          flash.broker = T;
          if (retain) { if (payload === '') delete retained[topic]; else retained[topic] = payload; }
          deliver(topic, payload, false);
        });
      }
      function toggleLate() {
        lateOn = !lateOn;
        if (!lateOn) { got.C = 'not connected'; return; }
        got.C = 'subscribed, nothing yet';
        Object.keys(retained).sort().forEach((tp, i) => {
          if (!SUBS.C.filters.some(f => topicMatches(f, tp))) return;
          queue.push({ t: T + 0.25 * i, fn: () => fly('broker', 'C', 'retained ' + retained[tp], kit.colors().warn, () => { flash.C = T; got.C = tp + ' = ' + retained[tp] + ' (retained)'; }) });
        });
      }
      function togglePower() {
        sensorOn = !sensorOn;
        if (sensorOn) { willAt = null; queue.push({ t: T + 0.2, fn: () => publish(STATUS, 'online', true) }); }
        else if (ctl.values.will) willAt = T + 3;
      }
      queue.push({ t: 0.3, fn: () => publish(STATUS, 'online', true) });
      const fit = (s, n) => (s.length > n ? s.slice(0, Math.max(1, n - 1)) + '…' : s);
      const loop = kit.loop((dt) => {
        T += dt;
        for (const q of queue.slice()) if (T >= q.t) { queue.splice(queue.indexOf(q), 1); q.fn(); }
        if (willAt != null && T >= willAt) {
          willAt = null; retained[STATUS] = 'offline'; flash.broker = T;
          deliver(STATUS, 'offline', false);
        }
        for (const f of flights.slice()) if (T >= f.t0 + f.dur) { flights.splice(flights.indexOf(f), 1); if (f.cb) f.cb(); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, g = geo();
        // the links
        const link = (a, b, on) => S.link(c, a[0], a[1], b[0], b[1], { color: on ? C.muted : C.faint, dash: !on, gap: g.r + 4 });
        link(g.sensor, g.broker, sensorOn); link(g.broker, g.A, true); link(g.broker, g.B, true); link(g.broker, g.C, lateOn);
        // the nodes
        const act = k => T - flash[k] < 0.5;
        S.node(c, g.sensor[0], g.sensor[1], { kind: 'esp', label: 'sensor', sub: 'publishes', r: g.r, dim: !sensorOn, active: act('sensor') });
        S.node(c, g.broker[0], g.broker[1], { kind: 'broker', label: 'broker', sub: Object.keys(retained).length + ' retained', r: g.r + 3, active: act('broker'), color: 212 });
        for (const k of Object.keys(SUBS)) S.node(c, g[k][0], g[k][1], { kind: SUBS[k].kind, label: SUBS[k].label, sub: k === 'C' ? 'home/+/temp + status' : SUBS[k].filters[0], r: g.r, dim: k === 'C' && !lateOn, active: act(k), color: 150 });
        // the messages on their way
        for (const f of flights) {
          const a = g[f.from], b = g[f.to];
          S.msg(c, a[0], a[1], b[0], b[1], clamp((T - f.t0) / f.dur, 0, 1), { color: f.color, label: f.label, r: 5, gap: g.r + 4 });
        }
        // the keep-alive running out
        if (willAt != null) {
          const p = clamp(1 - (willAt - T) / 3, 0, 1), bw = 96, bx = g.broker[0] - bw / 2, by = g.broker[1] + g.r + 36;
          c.save(); c.fillStyle = C.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.08)'; c.fillRect(bx, by, bw, 7); c.fillStyle = C.warn; c.fillRect(bx, by, bw * p, 7); c.restore();
          kit.label(c, 'keep-alive running out', g.broker[0], by + 16, { size: 10, color: C.warn, align: 'center' });
        }
        const ret = Object.keys(retained).sort().map(k => k.replace('home/', '') + '=' + retained[k]).join(' · ');
        kit.label(c, fit('Broker memory (retained): ' + (ret || 'nothing'), Math.floor((W - 24) / 5.6)), 12, H - 14, { size: 10.5, color: C.muted });
        ro.set('A', got.A); ro.set('B', got.B); ro.set('C', got.C);
        ro.set('ret', ret || 'nothing');
        const sv = retained[STATUS];
        ro.set('status', sv == null ? 'no value' : sv + (sv === 'online' && !sensorOn && willAt == null ? ' (stale: the sensor is off)' : ''));
        if (!flights.length && !queue.length && willAt == null && loop.running) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ip-push */
  Hyper.sim('ip-push', {
    title: 'Polling against WebSocket push',
    blurb: `Three lanes over the last 20 seconds. Top: the value changes on the ESP, at random. Middle: a page that **polls**, asking at fixed intervals; the amber bar is how long each change stayed unseen, a red cross a change that was overwritten before the next poll. Bottom: a page on a **WebSocket**, which hears of each change as it happens. Traffic is **schematic**: about 450 bytes for a poll with its request and response headers, 22 bytes for a pushed message (a 2-byte frame header and 20 bytes of value).

**Try this**
- Poll every **2 s** with a change every few seconds: the average delay is about half the interval.
- Set the polling to **1 s**: the delay shrinks, and the traffic doubles. Push has neither problem.
- Raise the change rate to **60 a minute** with slow polling: the red crosses show changes that the page never saw.
- Lower the change rate to **2 a minute**: polling still sends hundreds of requests that bring nothing.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 480 });
      const WIN = 20, PUSH = 0.02, RTT = 0.06;
      let T = 0, seed = 1234567, nextEv = 0.8, nextPoll = 1, lastPoll = 0, events = [];
      const stats = { dsum: 0, dn: 0, missed: 0, total: 0 };
      const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
      const expo = rate => -Math.log(1 - rnd()) / Math.max(0.01, rate / 60);
      const ctl = kit.controls(box.side, [
        { id: 'poll', label: 'The page asks every', min: 0.5, max: 10, value: 2, step: 0.5, unit: 's' },
        { id: 'rate', label: 'The value changes', min: 2, max: 60, value: 12, step: 1, unit: 'times a minute' },
        { type: 'buttons', items: [{ id: 'new', label: 'New random changes', primary: true }] }
      ], (id) => {
        if (id === 'new') { seed = Math.floor(Math.random() * 4294967296) || 7; events = []; stats.dsum = stats.dn = stats.missed = stats.total = 0; nextEv = T + 0.5; }
        if (id === 'poll') nextPoll = lastPoll + ctl.values.poll;
        loop.start();
      });
      const ro = kit.readout(box.side, [['dp', 'Polling: average delay'], ['dw', 'WebSocket: average delay'], ['miss', 'Polling: changes never seen'], ['tp', 'Polling traffic'], ['tw', 'WebSocket traffic']]);
      const loop = kit.loop((dt) => {
        T += dt;
        const interval = ctl.values.poll, rate = ctl.values.rate;
        while (nextEv <= T) { events.push({ t: nextEv, pollAt: null, missed: false }); stats.total++; nextEv += expo(rate); }
        while (nextPoll <= T) {
          const p = nextPoll; lastPoll = p; nextPoll += interval;
          const pend = events.filter(e => e.pollAt == null && !e.missed && e.t <= p);
          pend.forEach((e, i) => {
            if (i === pend.length - 1) { e.pollAt = p + RTT; stats.dsum += e.pollAt - e.t; stats.dn++; }
            else { e.missed = true; stats.missed++; }
          });
        }
        events = events.filter(e => e.t > T - WIN - 2);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const x0 = 12, w = W - 24, top = 30, gap = 22, laneH = Math.max(30, (H - top - 3 * gap - 22) / 3);
        const X = tt => x0 + clamp((tt - (T - WIN)) / WIN, 0, 1) * w;
        const lane = i => top + i * (laneH + gap) + gap;
        const titles = ['The value changes on the ESP', 'A page that polls every ' + kit.fmt(interval, 2) + ' s', 'A page on a WebSocket: pushed at once'];
        for (let i = 0; i < 3; i++) {
          const y = lane(i);
          kit.label(c, titles[i], x0, y - 11, { size: 11, weight: 650, color: C.text2 });
          c.save(); c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; c.fillRect(x0, y, w, laneH); c.restore();
        }
        // lane 0: the changes; lane 1: the polls, the waiting and the misses; lane 2: the pushes
        const y0 = lane(0), y1 = lane(1), y2 = lane(2), mid1 = y1 + laneH / 2, mid2 = y2 + laneH / 2;
        c.save(); c.lineWidth = 2; c.strokeStyle = C.accent;
        for (const e of events) { const x = X(e.t); c.beginPath(); c.moveTo(x, y0 + 4); c.lineTo(x, y0 + laneH - 4); c.stroke(); }
        c.restore();
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1;
        for (let p = lastPoll; p > T - WIN - 1 && p > 0; p -= interval) { const x = X(p); if (x > x0) { c.beginPath(); c.moveTo(x, mid1 - 5); c.lineTo(x, mid1 + 5); c.stroke(); } }
        c.restore();
        for (const e of events) {
          const x = X(e.t);
          if (e.missed) { kit.label(c, '✗', x, mid1, { size: 14, color: C.bad, align: 'center', weight: 700 }); continue; }
          if (e.pollAt != null) {
            const xb = X(Math.min(e.pollAt, T));
            c.save(); c.fillStyle = C.warn; c.globalAlpha = 0.7; c.fillRect(x, mid1 - 5, Math.max(1, xb - x), 10); c.restore();
            if (e.pollAt <= T) kit.dot(c, X(e.pollAt), mid1, 3.5, C.ok);
          } else {
            c.save(); c.fillStyle = C.warn; c.globalAlpha = 0.7; c.fillRect(x, mid1 - 5, Math.max(1, X(T) - x), 10); c.restore();
          }
          const xp = X(e.t + PUSH);
          c.save(); c.fillStyle = C.ok; c.globalAlpha = 0.9; c.fillRect(x, mid2 - 5, Math.max(2, xp - x), 10); c.restore();
        }
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(T), top + 4); c.lineTo(X(T), H - 22); c.stroke(); c.restore();
        kit.label(c, '20 s ago', x0, H - 10, { size: 10, color: C.faint });
        kit.label(c, 'now', x0 + w, H - 10, { size: 10, color: C.faint, align: 'right' });
        ro.set('dp', stats.dn ? kit.fmt(stats.dsum / stats.dn, 3) + ' s' : '—');
        ro.set('dw', '0.02 s (the network only)');
        ro.set('miss', stats.total ? stats.missed + ' of ' + stats.total + ' changes' : '—');
        ro.set('tp', kit.fmt(60 / interval * 450 / 1024, 3) + ' kB a minute, in ' + kit.fmt(60 / interval, 3) + ' requests');
        ro.set('tw', kit.fmt(rate * 22 / 1024, 3) + ' kB a minute, ' + rate + ' messages');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });
})();
