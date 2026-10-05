/* HYPER-ESP32 · sims/connection-security.js
 *
 * Simulations of the topic "connection-security" (ids cs-*). Defensive: they show how verification, per-device
 * secrets, segmentation and counters protect a device, never how to attack one. Pictures are schematic where the
 * blurb says so.
 *
 *   cs-tls-handshake   a TLS handshake as messages, with the certificate chain checked; params { mutual, focus: 'chain' }
 *   cs-mitm            someone on the path poses as the server: defeated by verification, succeeding against setInsecure
 *   cs-cert-expiry     the life of a leaf, an intermediate and a root against the life of a product, and what a device stores
 *   cs-secret-location where a secret lives, from source code to a secure element, and who can read it at each step
 *   cs-provisioning    set-up of a new device: open portal, WPA2 set-up network, encrypted exchange with a proof of possession
 *   cs-iot-segment     a home network flat, with an isolated IoT network and with a VLAN: what a bad device can reach
 *   cs-replay          a recorded command played back: fixed command, signed command, counter, challenge
 *   cs-checklist       a checklist that scores a design (params { set: 'rules' } for the obligations of the regulations)
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------------------------------------------------------------- a sequence of messages between actors
     actors: [{ kind, label, sub, dim }]; rows: [{ from, to, label, phase, kind: 'ok' | 'warn' | 'fail' | 'lost' }]
     shown = rows completed, prog = progress (0…1) of the next one. -> { y0, rowH, xs } */
  function seqDraw(c, C, kit, S, st, actors, rows, shown, prog, o) {
    o = o || {};
    const nodeR = clamp(st.W / 34, 11, 17), top = 10 + nodeR, y0 = top + nodeR + 40, n = actors.length, left = o.left == null ? 0.2 : o.left;
    const xs = actors.map((a, i) => st.W * (left + (0.9 - left) * (n === 1 ? 0.5 : i / (n - 1))));
    const rowH = clamp((st.H - y0 - (o.bottom || 10)) / Math.max(1, rows.length), 14, o.rowH || 30);
    actors.forEach((a, i) => {
      S.node(c, xs[i], top, { kind: a.kind, label: a.label, sub: a.sub, r: nodeR, dim: !!a.dim });
      c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 5]);
      c.beginPath(); c.moveTo(xs[i], y0 - 12); c.lineTo(xs[i], y0 + rows.length * rowH); c.stroke(); c.restore();
    });
    let phase = null;
    rows.forEach((r, k) => {
      const yTop = y0 + k * rowH, y = yTop + rowH / 2;
      if (k > shown) return;
      if (r.phase && r.phase !== phase) {
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(6, yTop + 0.5); c.lineTo(st.W - 6, yTop + 0.5); c.stroke(); c.restore();
        kit.label(c, r.phase, 8, yTop + 8, { size: 9.5, color: C.muted, weight: 650 });
      }
      phase = r.phase || phase;
      if (k === shown - 1) { c.save(); c.globalAlpha = 0.08; c.fillStyle = C.accent; c.fillRect(0, yTop, st.W, rowH); c.restore(); }
      const xa = xs[r.from], xb = xs[r.to], dir = xb >= xa ? 1 : -1;
      const col = r.kind === 'fail' ? C.bad : r.kind === 'warn' ? C.warn : (r.color || C.text2);
      const f = k < shown ? 1 : clamp(prog, 0, 1), x2 = r.kind === 'lost' ? xa + (xb - xa) * 0.62 : xb, xe = xa + (x2 - xa) * f;
      c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 1.8;
      c.beginPath(); c.moveTo(xa, y); c.lineTo(xe, y); c.stroke();
      if (f >= 1) {
        if (r.kind === 'lost') { c.lineWidth = 2.2; c.beginPath(); c.moveTo(x2 - 5, y - 5); c.lineTo(x2 + 5, y + 5); c.moveTo(x2 + 5, y - 5); c.lineTo(x2 - 5, y + 5); c.stroke(); }
        else { c.beginPath(); c.moveTo(x2, y); c.lineTo(x2 - dir * 9, y - 4.5); c.lineTo(x2 - dir * 9, y + 4.5); c.closePath(); c.fill(); }
      }
      c.restore();
      if (f < 1) S.msg(c, xa, y, x2, y, f, { color: col, r: 4 });
      kit.label(c, r.label, (xa + x2) / 2, y - 7, { size: 10, color: r.kind === 'fail' ? C.bad : C.text, align: 'center', bg: C.dark ? 'rgba(13,16,32,.78)' : 'rgba(255,255,255,.82)' });
    });
    return { y0, rowH, xs };
  }

  /* a rounded banner of text, centred at y */
  function banner(c, C, kit, st, y, text, color) {
    const w = Math.min(st.W - 16, 28 + text.length * 6.2);
    c.save(); c.fillStyle = color; c.globalAlpha = 0.14; c.fillRect((st.W - w) / 2, y - 12, w, 24); c.globalAlpha = 1;
    c.strokeStyle = color; c.lineWidth = 1.2; c.strokeRect((st.W - w) / 2 + 0.5, y - 11.5, w - 1, 23); c.restore();
    kit.label(c, text, st.W / 2, y, { size: 11, color: color, weight: 650, align: 'center' });
  }

  /* the value of a property carried by the rows already finished */
  const carried = (rows, shown, key, init) => { let v = init; for (let k = 0; k < Math.min(shown, rows.length); k++) if (rows[k][key] != null) v = rows[k][key]; return v; };

  /* ---------------------------------------------------------------- a conversation player
     cfg: { aspect, minH, maxH, bottom, controls, readouts: [[key, label, ({ plan, shown, done, values }) => text]],
            plan(values, params) -> { actors, rows, end: { kind, title }, left }, start(plan, values) -> first row shown,
            extra(c, C, info) draws below the rows: info = { plan, shown, values, geo, bannerY } } */
  function converse(box, kit, cfg, params) {
    const S = kit.esym;
    const st = kit.stage(box.stage, { aspect: cfg.aspect || 0.9, minH: cfg.minH || 420, maxH: cfg.maxH || 640 });
    let plan = null, shown = 0, prog = 0, goal = 0;
    const ctl = kit.controls(box.side, cfg.controls.concat([{ type: 'buttons', items: [{ id: 'next', label: 'Next message', primary: true }, { id: 'play', label: 'Play all' }, { id: 'again', label: 'Start over' }] }]), (id) => {
      if (id === 'next') { if (shown >= goal) goal = Math.min(plan.rows.length, shown + 1); loop.start(); }
      else if (id === 'play') { goal = plan.rows.length; loop.start(); }
      else restart();
    });
    const ro = kit.readout(box.side, cfg.readouts.map(r => [r[0], r[1]]));
    function restart() {
      plan = cfg.plan(ctl.values, params || {});
      shown = cfg.start ? clamp(cfg.start(plan, ctl.values, params || {}), 0, plan.rows.length) : 0;
      prog = 0; goal = shown;
      loop.once();
    }
    const loop = kit.loop((dt) => {
      const c = st.begin(), C = kit.colors();
      if (shown < goal) { prog += dt / 0.7; if (prog >= 1) { shown++; prog = 0; } }
      else if (loop.running) loop.stop();
      const bottom = cfg.bottom || 40;
      const geo = seqDraw(c, C, kit, S, st, plan.actors, plan.rows, shown, prog, { left: plan.left == null ? 0.2 : plan.left, rowH: cfg.rowH || 30, bottom });
      const done = shown >= plan.rows.length;
      const bannerY = st.H - bottom + 18;
      if (done && plan.end) banner(c, C, kit, st, bannerY, plan.end.title, plan.end.kind === 'ok' ? C.ok : plan.end.kind === 'warn' ? C.warn : C.bad);
      if (cfg.extra) cfg.extra(c, C, { plan, shown, values: ctl.values, geo, bannerY, done, st });
      cfg.readouts.forEach(([key, , fn]) => ro.set(key, fn({ plan, shown, done, values: ctl.values })));
    }, box.stage);
    restart();
    st.onResize(() => loop.once());
    return { ctl, st };
  }

  /* ================================================================ cs-tls-handshake */
  const CHAIN_BOX = { leaf: ['Leaf', 'broker.example.com'], inter: ['Intermediate', 'the authority\'s working key'], root: ['Root', 'in my trust store'] };

  Hyper.sim('cs-tls-handshake', {
    title: 'A TLS handshake, and the checks the device makes',
    blurb: `The device is on the left, its **clock and trust store** in the middle, the server on the right. Each arrow is a message; the strip at the bottom is the **certificate chain** that the device checks: leaf, intermediate, root.

**Try this**
- Play it with **nothing wrong** and watch the three checks: signatures to a root the device holds, the name, the dates.
- Choose **the device's clock is wrong** (a fresh device thinks it is 1970): a perfect certificate fails the date check.
- Choose **unknown root** or **chain incomplete**: the server's chain cannot be tied to a root in the store.
- Untick **verify the certificate** (the setInsecure case): every fault now passes, and the connection is encrypted to whoever answered.
- Tick **mutual TLS**: the server asks for a certificate, and the device signs with its private key to prove it owns it.`,
    mount(box, kit, params) {
      const focus = params.focus || '';
      converse(box, kit, {
        aspect: 1.05, minH: 520, maxH: 660, bottom: 112, rowH: 28,
        controls: [
          { id: 'fault', type: 'select', label: 'What is wrong', options: [['Nothing: everything right', 'ok'], ['The device\'s clock is wrong (it thinks it is 1970)', 'clock'], ['Unknown root: not in the device\'s store', 'unknownroot'], ['Wrong name: connecting by IP address', 'name'], ['The server\'s certificate has expired', 'expired'], ['Chain incomplete: the server sends only its leaf', 'incomplete'], ['The device\'s certificate is from the wrong CA (mutual only)', 'wrongca']], value: 'ok' },
          { id: 'verify', type: 'check', label: 'Verify the certificate (setCACert, CERT_REQUIRED)', value: true },
          { id: 'mutual', type: 'check', label: 'Mutual TLS: the server asks for the device\'s certificate', value: !!params.mutual }
        ],
        plan(v) {
          const rows = [], R = (from, to, label, phase, why, extra) => rows.push(Object.assign({ from, to, label, phase, why, kind: 'ok' }, extra || {}));
          const f = v.fault, bad = [];
          R(0, 2, 'ClientHello: suites, name', '1 Hello', 'The device lists the versions and cipher suites it speaks and names the server it wants (server name indication). Anyone on the path can read this message.', { listen: 'the name of the server, and the suites offered' });
          R(2, 0, 'ServerHello: suite, key share', '1 Hello', 'The server picks a suite and sends its half of an ephemeral key exchange. The keys made from it will exist only for this connection (forward secrecy).');
          R(2, 0, f === 'incomplete' ? 'Certificate: the leaf only' : 'Certificate: leaf + intermediate', '2 Cert', f === 'incomplete' ? 'A badly configured server sends no intermediate. The device holds only the root, so it cannot link the leaf to it.' : 'The server sends its chain: its own certificate and the intermediate that signed it. The device already holds the root. Certificates are public, so a listener sees them too.', { listen: 'the server\'s certificates (they are public)', chain: { leaf: 'idle', inter: f === 'incomplete' ? 'missing' : 'idle', root: f === 'unknownroot' ? 'unknown' : 'idle' } });
          if (v.mutual) R(2, 0, 'CertificateRequest', '2 Cert', 'The server asks the device to identify itself with a certificate too. This is what makes the TLS mutual.');
          let failed = null;
          if (!v.verify) {
            R(0, 1, 'no checks (setInsecure)', '3 Checks', 'The device was told to accept any certificate. The three checks are skipped, so a wrong clock, an unknown root or a wrong name makes no difference. The connection will be encrypted, to whoever answered.', { kind: 'warn', chain: { leaf: 'skipped', inter: 'skipped', root: 'skipped' } });
          } else {
            const chainBad = f === 'unknownroot' || f === 'incomplete';
            R(0, 1, chainBad ? '1 signatures → a root? NO' : '1 signatures → a root? yes', '3 Checks', chainBad ? (f === 'incomplete' ? 'The leaf names an issuer the device does not hold, and the server did not send it: the chain stops. The cure is on the server: send the intermediate.' : 'The chain ends at a root that is not in the device\'s store. Either the wrong root was stored, or the authority is new to this firmware.') : 'Each certificate is signed by the next, up to a root that the device holds, and each issuer is allowed to sign certificates.', { kind: chainBad ? 'fail' : 'ok', chain: chainBad ? (f === 'incomplete' ? { inter: 'bad' } : { root: 'bad' }) : { inter: 'ok', root: 'ok' } });
            if (chainBad) failed = f === 'incomplete' ? 'The chain cannot be completed' : 'Unknown root';
            if (!failed) {
              const nameBad = f === 'name';
              R(0, 1, nameBad ? '2 name matches? NO' : '2 name matches? yes', '3 Checks', nameBad ? 'The device connected to an IP address, or to another name than the ones in the certificate. The chain is fine, but it belongs to a different name.' : 'The name the device asked for appears in the certificate\'s list of names.', { kind: nameBad ? 'fail' : 'ok', chain: { leaf: nameBad ? 'bad' : 'ok' } });
              if (nameBad) failed = 'The name does not match';
            }
            if (!failed) {
              const dateBad = f === 'clock' || f === 'expired';
              R(0, 1, dateBad ? '3 dates valid by my clock? NO' : '3 dates valid by my clock? yes', '3 Checks', f === 'clock' ? 'The device has no valid time: it thinks it is 1970, when every real certificate "is not valid yet". Set the clock first (SNTP) and the same server passes.' : f === 'expired' ? 'The end date of the certificate has passed. The server must renew it; the device is right to refuse.' : 'The clock lies between the start and the end date of every certificate in the chain.', { kind: dateBad ? 'fail' : 'ok', chain: dateBad ? { leaf: 'bad' } : { leaf: 'ok', inter: 'ok', root: 'ok' } });
              if (dateBad) failed = f === 'clock' ? 'Certificate not valid yet (wrong clock)' : 'Certificate expired';
            }
          }
          let end;
          if (failed) {
            R(0, 2, 'alert: close the connection', '3 Checks', 'The device stops. It sends no password and no reading, and does not fall back to plain text: it fails closed.', { kind: 'fail', listen: 'the name and the certificates, and then nothing' });
            end = { kind: 'fail', title: 'Refused: ' + failed };
          } else {
            if (v.mutual) {
              R(0, 2, 'my certificate + signature', '4 Device', 'The device sends its own certificate and a signature, made with its private key, over the whole handshake so far. That proves it owns the key without sending it.');
              if (f === 'wrongca') {
                R(2, 0, 'alert: bad certificate', '4 Device', 'The server checked the device\'s chain against its own device CA and found another issuer. It refuses: it will not talk to a device it cannot identify.', { kind: 'fail' });
                failed = 'The server refuses the device';
              }
            }
            if (failed) end = { kind: 'fail', title: failed };
            else {
              R(0, 2, 'Finished', '5 Keys', 'Both sides turn the key exchange into session keys and prove, with a hash of everything said, that nobody changed the handshake.', { listen: 'only encrypted bytes from here on' });
              R(2, 0, 'Finished', '5 Keys', 'The server does the same. From now on both ends use the same keys.');
              R(0, 2, 'data: encrypted (AES-GCM)', '6 Data', 'Application data, here a reading, is encrypted and authenticated. A listener sees only bytes.');
              R(2, 0, 'reply: encrypted', '6 Data', 'The reply travels the same way.');
              end = v.verify ? (v.mutual ? { kind: 'ok', title: 'Connected: server and device both identified' } : { kind: 'ok', title: 'Connected: encrypted, server verified' }) : { kind: 'warn', title: 'Connected: encrypted, but to whoever answered' };
              if (!v.verify && f !== 'ok' && f !== 'wrongca') end.title += ' (the fault went unnoticed)';
            }
          }
          return { actors: [{ kind: 'esp', label: 'device', sub: 'ESP' }, { kind: 'lock', label: 'clock + roots', sub: 'inside the device' }, { kind: 'server', label: 'server', sub: 'broker.example.com' }], rows, left: 0.17, end };
        },
        start(plan, v) {
          if (focus !== 'chain') return 0;
          const i = plan.rows.findIndex(r => r.phase === '3 Checks');
          return i < 0 ? 0 : i;
        },
        readouts: [
          ['step', 'This step', s => s.done ? 'Finished.' : s.plan.rows[s.shown].why],
          ['clock', 'The device\'s clock', s => s.values.fault === 'clock' ? '1970 (not set)' : 'correct (set by SNTP)'],
          ['listen', 'A listener on the path sees', s => carried(s.plan.rows, s.shown, 'listen', 'nothing yet')],
          ['end', 'Result', s => s.done ? s.plan.end.title : '…']
        ],
        extra(c, C, info) {
          const { plan, shown, st, values } = info, S = kit.esym;
          // the certificate chain: three boxes, each with the state the checks have given it
          const state = { leaf: 'idle', inter: 'idle', root: 'idle' };
          for (let k = 0; k < Math.min(shown, plan.rows.length); k++) if (plan.rows[k].chain) Object.assign(state, plan.rows[k].chain);
          const certIdx = plan.rows.findIndex(r => r.phase === '2 Cert'), arrived = shown > certIdx;
          const M = 10, gap = Math.max(16, st.W * 0.04), bw = (st.W - 2 * M - 2 * gap) / 3, bh = 50, y = st.H - 76;
          const colOf = s => s === 'ok' ? C.ok : s === 'bad' ? C.bad : s === 'skipped' ? C.warn : s === 'missing' ? C.bad : s === 'unknown' ? C.warn : C.muted;
          const mark = s => s === 'ok' ? ' ✓' : s === 'bad' ? ' ✗' : s === 'skipped' ? ' –' : '';
          const subOf = (key, s) => {
            if (!arrived) return 'not received yet';
            if (key === 'leaf') return s === 'bad' && values.fault === 'name' ? 'asked for another name' : s === 'bad' ? (values.fault === 'clock' ? 'not valid yet' : 'expired') : CHAIN_BOX.leaf[1];
            if (key === 'inter') return s === 'missing' || (s === 'bad' && values.fault === 'incomplete') ? 'not sent by the server' : CHAIN_BOX.inter[1];
            return s === 'unknown' || (s === 'bad' && values.fault === 'unknownroot') ? 'NOT in my trust store' : CHAIN_BOX.root[1];
          };
          ['leaf', 'inter', 'root'].forEach((key, i) => {
            const x = M + i * (bw + gap), s = arrived ? state[key] : 'idle';
            S.box(c, x, y, bw, bh, { label: CHAIN_BOX[key][0] + mark(s), sub: subOf(key, s), color: arrived ? colOf(s) : C.faint, dash: !arrived || s === 'skipped' || s === 'missing' || s === 'unknown', active: s === 'ok' || s === 'bad', size: 11.5 });
            if (i > 0) {
              const xa = x, xb = x - gap;
              c.save(); c.strokeStyle = C.muted; c.fillStyle = C.muted; c.lineWidth = 1.4;
              c.beginPath(); c.moveTo(xa, y + bh / 2); c.lineTo(xb + 1, y + bh / 2); c.stroke();
              c.beginPath(); c.moveTo(xb, y + bh / 2); c.lineTo(xb + 7, y + bh / 2 - 4); c.lineTo(xb + 7, y + bh / 2 + 4); c.closePath(); c.fill(); c.restore();
            }
          });
          kit.label(c, 'the chain the device checks: each certificate is signed by the next', M, st.H - 12, { size: 10, color: C.muted });
        }
      }, params);
    }
  });
  /* wrap a text into lines no wider than w pixels at the given size */
  function wrap(c, text, w, size) {
    c.save(); c.font = '500 ' + size + 'px system-ui, sans-serif';
    const words = String(text).split(' '), lines = []; let cur = '';
    for (const wd of words) {
      const t = cur ? cur + ' ' + wd : wd;
      if (cur && c.measureText(t).width > w) { lines.push(cur); cur = wd; } else cur = t;
    }
    if (cur) lines.push(cur);
    c.restore();
    return lines;
  }

  /* ================================================================ cs-provisioning */
  Hyper.sim('cs-provisioning', {
    title: 'Setting up a new device: who can listen, who can arrive first',
    blurb: `The phone is on the left, the new device in the middle, and a **stranger** on the right who is standing nearby. Choose how the device offers set-up and whether the stranger only listens or arrives first.

**Try this**
- **Open set-up network**, stranger listening: the form travels in the clear, and the stranger reads the Wi-Fi password.
- Same scheme, stranger **arrives first**: the device accepts whoever connects first and ends up owned by the stranger.
- **WPA2 set-up network**: the code on the label is the password, so the stranger cannot join, and the form travels encrypted.
- **Proof of possession**: the key exchange gives a listener nothing to test, and a stranger who guesses the code is locked out after three tries; the owner reopens the window with the button.`,
    mount(box, kit, params) {
      converse(box, kit, {
        aspect: 1.0, minH: 460, maxH: 640, bottom: 44, rowH: 30,
        controls: [
          { id: 'scheme', type: 'select', label: 'How the device offers set-up', options: [['Open set-up network, plain form', 'open'], ['WPA2 set-up network, the label code is the password', 'wpa2'], ['Encrypted exchange with a proof of possession', 'pop']], value: 'open' },
          { id: 'stranger', type: 'select', label: 'The stranger nearby', options: [['only listens', 'listen'], ['arrives before the owner', 'first']], value: 'listen' }
        ],
        plan(v) {
          const rows = [], R = (from, to, label, phase, why, extra) => rows.push(Object.assign({ from, to, label, phase, why, kind: 'ok' }, extra || {}));
          const first = v.stranger === 'first';
          let end;
          if (v.scheme === 'open') {
            if (!first) {
              R(0, 1, 'join "device-setup" (open)', '1 Join', 'The set-up network has no password, so there is no handshake and no encryption on the link.', { hear: 'the network name, and every frame after it', owner: 'nobody yet', win: 'open' });
              R(0, 1, 'POST name + password, plain', '2 Send', 'The form is sent as plain HTTP over an unencrypted link. Anyone in range who is recording sees the Wi-Fi name and password exactly as typed.', { kind: 'warn', hear: 'the Wi-Fi name and PASSWORD, in clear' });
              R(1, 0, 'saved; joining your Wi-Fi', '3 Done', 'The device saves the credentials and leaves set-up.', { owner: 'you', win: 'closed' });
              end = { kind: 'warn', title: 'Set up, but the password was readable' };
            } else {
              R(2, 1, 'join "device-setup" (open)', '1 Join', 'Nothing asks who is joining. The stranger is first.', { hear: 'it is the one talking', owner: 'nobody yet', win: 'open' });
              R(2, 1, 'POST their own network details', '2 Send', 'The device accepts the first credentials it is given, whoever sends them. This is first come, first served.', { kind: 'warn', hear: 'it is the one talking' });
              R(1, 2, 'saved; joining their network', '3 Done', 'The device saves the stranger\'s details and leaves set-up. It is now on a network the owner does not control.', { kind: 'warn', owner: 'the stranger', win: 'closed' });
              R(0, 1, 'join "device-setup" …', '4 Owner', 'The owner arrives and finds that the set-up network no longer exists.', { kind: 'lost' });
              end = { kind: 'fail', title: 'The stranger owns the device' };
            }
          } else if (v.scheme === 'wpa2') {
            if (first) {
              R(2, 1, 'join with a guess', '1 Stranger', 'Joining needs the code printed on this unit. A guess fails the WPA2 handshake, and the device lets nobody in.', { kind: 'fail', hear: 'a failed handshake', owner: 'nobody yet', win: 'open' });
            }
            R(0, 1, 'join with the label code', '1 Join', 'The owner types the code printed on the unit. Both sides prove that they know it in the WPA2 handshake, and make session keys from it.', { hear: 'encrypted frames: it cannot join', owner: 'nobody yet', win: 'open' });
            R(0, 1, 'POST name + password', '2 Send', 'The form travels inside the WPA2 link, encrypted. A recording shows only random-looking bytes.', { hear: 'only encrypted bytes' });
            R(1, 0, 'saved; window closes', '3 Done', 'The device saves the credentials and switches the set-up network off.', { owner: 'you', win: 'closed' });
            end = { kind: 'ok', title: first ? 'Set up; the stranger got nothing' : 'Set up; nothing was readable' };
          } else {
            R(0, 1, 'connect, key exchange', '1 Connect', 'Phone and device exchange public keys. A listener sees them, but they do not reveal the session key.', { hear: 'public keys only', owner: 'nobody yet', win: 'open' });
            if (first) {
              for (let i = 1; i <= 3; i++) R(2, 1, 'proof of possession: guess ' + i, '2 Stranger', i === 1 ? 'The stranger does not know the code on the label, so its proof is wrong. Each live attempt is one guess; there is nothing to test offline.' : 'Another wrong proof. The device counts the failures.', { kind: 'fail', hear: 'wrong proofs, refused' });
              R(1, 2, 'locked: window closed', '2 Stranger', 'After three failures the device shuts the window. The stranger had three guesses in a million.', { kind: 'fail', win: 'closed' });
              R(1, 0, 'owner holds the button: open again', '3 Owner', 'Holding the button is a physical act that only someone at the device can do. It reopens the window.', { win: 'open' });
            }
            R(0, 1, 'proof from the label code', first ? '4 Owner' : '2 Prove', 'The phone shows that it knows the code, in a way that gives a listener nothing to test guesses against.', { hear: 'a value that cannot be tested offline' });
            R(0, 1, 'name + password, encrypted', first ? '4 Owner' : '3 Send', 'Only now are the Wi-Fi credentials sent, encrypted with the key that the exchange produced.', { hear: 'only encrypted bytes' });
            R(1, 0, 'saved; window closes', first ? '5 Done' : '4 Done', 'The device saves the credentials and closes the window.', { owner: 'you', win: 'closed' });
            end = { kind: 'ok', title: first ? 'Set up; the stranger learned nothing' : 'Set up; nothing was readable' };
          }
          return { actors: [{ kind: 'phone', label: 'phone', sub: 'the owner' }, { kind: 'esp', label: 'new device' }, { kind: 'laptop', label: 'stranger', sub: 'nearby' }], rows, left: 0.17, end };
        },
        readouts: [
          ['step', 'This step', s => s.done ? 'Finished.' : s.plan.rows[s.shown].why],
          ['hear', 'The stranger sees', s => carried(s.plan.rows, s.shown, 'hear', 'nothing yet')],
          ['owner', 'The device belongs to', s => carried(s.plan.rows, s.shown, 'owner', 'nobody yet')],
          ['win', 'The set-up window', s => carried(s.plan.rows, s.shown, 'win', 'closed')]
        ]
      }, params);
    }
  });

  /* ================================================================ cs-replay */
  Hyper.sim('cs-replay', {
    title: 'A recorded command played back',
    blurb: `The owner's phone sends a command to a lock. A **recorder** keeps a copy of everything it hears. Later it plays the recording back, or invents a command. Choose how the lock protects its commands.

This models a link where a copy can be taken: a message with no connection behind it, or a link whose pairing was not authenticated. On an authenticated, encrypted Bluetooth link the link layer already refuses replays.

**Try this**
- **Fixed command**, then **replay**: the recording opens the lock; so does an invented command.
- **Signed command, no counter**: inventing fails, but the replay still opens the lock.
- **Counter**: the lock remembers the highest number it accepted, so the replay is refused.
- **Challenge and response**: every attempt gets a fresh random challenge, so an old answer is useless.`,
    mount(box, kit, params) {
      converse(box, kit, {
        aspect: 0.95, minH: 440, maxH: 620, bottom: 44, rowH: 30,
        controls: [
          { id: 'scheme', type: 'select', label: 'How the lock protects commands', options: [['A fixed command: OPEN', 'fixed'], ['Signed command (HMAC), no counter', 'signed'], ['Signed command with a counter', 'counter'], ['Challenge and response', 'challenge']], value: 'fixed' },
          { id: 'attack', type: 'select', label: 'The recorder later', options: [['plays the recording back', 'replay'], ['invents a command of its own', 'forge']], value: 'replay' }
        ],
        plan(v) {
          const rows = [], R = (from, to, label, phase, why, extra) => rows.push(Object.assign({ from, to, label, phase, why, kind: 'ok' }, extra || {}));
          const s = v.scheme, replay = v.attack === 'replay';
          let end;
          if (s === 'fixed') {
            R(0, 1, 'OPEN', '1 Owner', 'The owner sends the command. It is the same bytes every time, and the recorder copies them.', { rec: 'OPEN', last: 'no counter' });
            R(1, 0, 'opens', '1 Owner', 'The lock opens: it accepts anything that looks like OPEN.', { lock: 'opened' });
            if (replay) R(2, 1, 'OPEN (the recording)', '2 Later', 'The recorder sends back the bytes it kept. Nothing in them says who sent them or when.', { kind: 'warn', lock: 'opens again' });
            else R(2, 1, 'OPEN (made up)', '2 Later', 'The command has no secret in it, so anyone can write it.', { kind: 'warn', lock: 'opens again' });
            end = { kind: 'fail', title: 'A stranger opened the lock' };
          } else if (s === 'signed') {
            R(0, 1, 'OPEN + tag', '1 Owner', 'The owner appends a tag: an HMAC of the command with the shared key. The recorder copies command and tag.', { rec: 'OPEN + its tag', last: 'no counter' });
            R(1, 0, 'tag fits: opens', '1 Owner', 'The lock computes the tag itself and compares. It fits.', { lock: 'opened' });
            if (replay) {
              R(2, 1, 'OPEN + tag (the recording)', '2 Later', 'The tag fits the command, as it did the first time. The lock cannot tell the copy from the original.', { kind: 'warn', lock: 'opens again' });
              end = { kind: 'fail', title: 'The replay opened the lock' };
            } else {
              R(2, 1, 'OPEN + a guessed tag', '2 Later', 'Without the key the recorder cannot compute a tag that fits a new command.', { kind: 'fail', lock: 'refused: the tag does not fit' });
              end = { kind: 'ok', title: 'The forgery was refused' };
            }
          } else if (s === 'counter') {
            R(0, 1, 'OPEN #7 + tag', '1 Owner', 'Each command carries a number, and the tag covers command and number together. The recorder copies it.', { rec: 'OPEN #7 + its tag', last: 'none yet' });
            R(1, 0, 'tag fits, 7 is new: opens', '1 Owner', 'The tag fits, and 7 is higher than any number accepted so far. The lock opens and remembers 7.', { lock: 'opened', last: '7' });
            if (replay) {
              R(2, 1, 'OPEN #7 + tag (the recording)', '2 Later', 'The tag fits, since nothing was changed, but the number is no higher than the last one accepted.', { kind: 'fail', lock: 'refused: 7 is not above 7' });
              end = { kind: 'ok', title: 'The replay was refused' };
            } else {
              R(2, 1, 'OPEN #8 + the old tag', '2 Later', 'A higher number would pass the counter, but the old tag covers number 7, not 8, so the tag does not fit.', { kind: 'fail', lock: 'refused: the tag does not fit' });
              end = { kind: 'ok', title: 'The forgery was refused' };
            }
          } else {
            R(0, 1, 'request: open', '1 Owner', 'The owner asks to open. No secret is sent.', { rec: 'a request', last: 'no counter' });
            R(1, 0, 'challenge: 9F3A…', '1 Owner', 'The lock answers with a fresh random number.', { rec: 'request, challenge 9F3A…' });
            R(0, 1, 'response: tag(9F3A…, OPEN)', '1 Owner', 'The owner answers with a tag over the challenge and the command, which only the key makes. The lock checks it and opens.', { rec: 'the response to 9F3A…', lock: 'opened' });
            if (replay) {
              R(2, 1, 'request: open', '2 Later', 'The recorder starts a new attempt.', { lock: 'waiting' });
              R(1, 2, 'challenge: 41C7… (new)', '2 Later', 'The lock sends a different challenge this time.');
              R(2, 1, 'response to 9F3A… (old)', '2 Later', 'The recorder can only send the answer it kept, which belongs to the old challenge.', { kind: 'fail', lock: 'refused: wrong answer to 41C7…' });
              end = { kind: 'ok', title: 'The replay was refused' };
            } else {
              R(2, 1, 'request: open', '2 Later', 'The recorder starts an attempt of its own.', { lock: 'waiting' });
              R(1, 2, 'challenge: 41C7…', '2 Later', 'The lock sends a challenge.');
              R(2, 1, 'a guessed response', '2 Later', 'Without the key the recorder cannot compute the tag for 41C7….', { kind: 'fail', lock: 'refused: wrong answer' });
              end = { kind: 'ok', title: 'The forgery was refused' };
            }
          }
          return { actors: [{ kind: 'phone', label: 'owner\'s phone' }, { kind: 'lock', label: 'lock', sub: 'ESP' }, { kind: 'laptop', label: 'recorder', sub: 'copies what it hears' }], rows, left: 0.17, end };
        },
        readouts: [
          ['step', 'This step', s => s.done ? 'Finished.' : s.plan.rows[s.shown].why],
          ['rec', 'The recorder holds', s => carried(s.plan.rows, s.shown, 'rec', 'nothing yet')],
          ['last', 'Highest counter the lock accepted', s => carried(s.plan.rows, s.shown, 'last', 'no counter')],
          ['lock', 'The lock', s => carried(s.plan.rows, s.shown, 'lock', 'closed')]
        ]
      }, params);
    }
  });

  /* ================================================================ cs-mitm */
  Hyper.sim('cs-mitm', {
    title: 'Someone on the path poses as the server',
    blurb: `The device sends a reading to a server. In the middle sits **someone on the path**: a rogue access point, a poisoned address lookup or a compromised router can put them there. The picture shows what the device does with the impostor's certificate.

**Try this**
- Leave **verify the certificate** on and tick **someone poses as the server**: the impostor's certificate is not signed by a root the device holds, so the device stops before sending anything.
- Switch to **no check (setInsecure)**: the device encrypts its reading to the impostor, who reads it and passes it on, so that nothing looks wrong.
- Untick the impostor: both modes work, which is exactly why the shortcut is dangerous: it passes every test on a quiet network.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 400, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'mitm', type: 'check', label: 'Someone on the path poses as the server', value: true },
        { id: 'mode', type: 'select', label: 'The device', options: [['verifies the certificate (setCACert)', 'verify'], ['accepts any certificate (setInsecure)', 'insecure']], value: 'verify' },
        { type: 'buttons', items: [{ id: 'send', label: 'Send a reading', primary: true }] }
      ], () => restart());
      const ro = kit.readout(box.side, [['dev', 'The device'], ['imp', 'The one in the middle'], ['srv', 'The real server']]);
      const STEP = 1.15;
      let steps = [], t = 0;
      // each step: { from, to (node index 0 device, 1 middle, 2 server), label, kind, dev, imp, srv }
      function script(v) {
        const s = [];
        const A = (from, to, label, kind, st2) => s.push(Object.assign({ from, to, label, kind: kind || 'ok' }, st2 || {}));
        if (!v.mitm) {
          A(0, 2, 'hello', 'ok', { dev: 'connecting', imp: 'not there', srv: 'waiting' });
          A(2, 0, 'real certificate', 'ok', { dev: v.mode === 'verify' ? 'checking the chain…' : 'not checking' });
          A(0, 0, v.mode === 'verify' ? 'chain, name, dates: valid' : 'no check', v.mode === 'verify' ? 'ok' : 'warn', { dev: v.mode === 'verify' ? 'server verified' : 'accepted without a check' });
          A(0, 2, 'reading, encrypted', 'ok', { dev: 'sent the reading', srv: 'received the reading' });
        } else if (v.mode === 'verify') {
          A(0, 1, 'hello (redirected)', 'warn', { dev: 'connecting', imp: 'answers instead of the server', srv: 'hears nothing' });
          A(1, 0, 'its own certificate', 'warn', { dev: 'checking the chain…', imp: 'shows a certificate it made itself' });
          A(0, 0, 'no root of mine signed it', 'fail', { dev: 'REFUSED: unknown root, nothing sent' });
          A(0, 1, 'alert: close', 'fail', { imp: 'has the hello and nothing else' });
        } else {
          A(0, 1, 'hello (redirected)', 'warn', { dev: 'connecting', imp: 'answers instead of the server', srv: 'hears nothing' });
          A(1, 0, 'its own certificate', 'warn', { dev: 'not checking', imp: 'shows a certificate it made itself' });
          A(0, 0, 'no check: accepted', 'warn', { dev: 'trusts the impostor' });
          A(0, 1, 'reading, encrypted to it', 'warn', { dev: 'sent the reading', imp: 'decrypts it: READS the reading' });
          A(1, 2, 'passed on, re-encrypted', 'warn', { imp: 'reads and forwards everything', srv: 'received the reading, nothing looks wrong' });
        }
        return s;
      }
      function restart() { steps = script(ctl.values); t = 0; loop.start(); }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        const total = steps.length * STEP;
        if (t < total) t = Math.min(total, t + dt); else if (loop.running) loop.stop();
        const idx = Math.min(steps.length, Math.floor(t / STEP)), prog = idx >= steps.length ? 1 : (t - idx * STEP) / STEP;
        const v = ctl.values, M = 8;
        const nodeR = clamp(st.W / 24, 15, 22), ny = 24 + nodeR + 6;
        const xs = [st.W * 0.14, st.W * 0.5, st.W * 0.86];
        // the path
        S.link(c, xs[0], ny, xs[1], ny, { color: v.mitm ? C.warn : C.muted, gap: nodeR + 6, wireless: false });
        S.link(c, xs[1], ny, xs[2], ny, { color: C.muted, gap: nodeR + 6 });
        S.node(c, xs[0], ny, { kind: 'esp', label: 'device', sub: v.mode === 'verify' ? 'verifies' : 'setInsecure', r: nodeR });
        S.node(c, xs[1], ny, { kind: 'laptop', label: v.mitm ? 'impostor' : 'the path', sub: v.mitm ? 'poses as the server' : 'nobody there', r: nodeR, dim: !v.mitm, active: v.mitm && idx > 0 });
        S.node(c, xs[2], ny, { kind: 'server', label: 'server', sub: 'real', r: nodeR });
        // the message on its way
        let dev = 'idle', imp = v.mitm ? 'waiting' : 'not there', srv = 'waiting';
        for (let k = 0; k < Math.min(idx + (prog > 0.6 ? 1 : 0), steps.length); k++) { const s = steps[k]; if (s.dev) dev = s.dev; if (s.imp) imp = s.imp; if (s.srv) srv = s.srv; }
        if (idx < steps.length) {
          const s = steps[idx], col = s.kind === 'fail' ? C.bad : s.kind === 'warn' ? C.warn : C.accent;
          if (s.from !== s.to) {
            const a = xs[s.from], b = xs[s.to], through = !v.mitm && ((s.from === 0 && s.to === 2) || (s.from === 2 && s.to === 0));
            const x = a + (b - a) * prog;
            c.save(); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 8; c.beginPath(); c.arc(x, ny, 5, 0, 6.283); c.fill(); c.restore();
            kit.label(c, s.label, clamp(x, M + 50, st.W - M - 50), ny + nodeR + 44, { size: 10.5, color: C.text, align: 'center', bg: C.dark ? 'rgba(13,16,32,.8)' : 'rgba(255,255,255,.85)' });
            if (through) kit.label(c, 'passes the middle untouched', st.W / 2, ny + nodeR + 62, { size: 9.5, color: C.muted, align: 'center' });
          } else {
            kit.label(c, s.label, xs[s.from] + (s.from === 0 ? 40 : 0), ny + nodeR + 44, { size: 10.5, color: col, align: 'center', weight: 650, bg: C.dark ? 'rgba(13,16,32,.8)' : 'rgba(255,255,255,.85)' });
          }
        }
        // what each end knows
        const py = ny + nodeR + 82, pw = (st.W - 4 * M) / 3, ph = st.H - py - M;
        const panels = [['The device', dev, v.mode === 'verify' ? C.ok : C.warn], ['In the middle', imp, v.mitm ? C.warn : C.faint], ['The server', srv, C.muted]];
        panels.forEach(([title, text, color], i) => {
          const x = M + i * (pw + M);
          c.save(); c.strokeStyle = color; c.lineWidth = 1.3; c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.03)';
          c.fillRect(x, py, pw, ph); c.strokeRect(x + 0.5, py + 0.5, pw - 1, ph - 1); c.restore();
          kit.label(c, title, x + 6, py + 12, { size: 10, color: C.muted, weight: 650 });
          wrap(c, text, pw - 12, 10.5).slice(0, 4).forEach((ln, j) => kit.label(c, ln, x + 6, py + 30 + j * 14, { size: 10.5, color: /READS|REFUSED|trusts/.test(text) ? (/REFUSED/.test(text) ? C.ok : C.bad) : C.text }));
        });
        ro.set('dev', dev); ro.set('imp', imp); ro.set('srv', srv);
      }, box.stage);
      st.onResize(() => loop.once());
      restart();
    }
  });
  /* ================================================================ cs-cert-expiry */
  const durText = y => y < 1 ? (y * 12 < 1 ? 'under a month' : kit_fmt(y * 12) + ' months') : kit_fmt(y) + ' years';
  const kit_fmt = v => String(Math.round(v * 10) / 10);

  Hyper.sim('cs-cert-expiry', {
    title: 'Certificates expire: what the device stores decides when it stops',
    blurb: `Time runs to the right, from the day the device ships. The first three rows are the lives of the **leaf** (renewed on the server every few weeks), the **intermediate** and the **root**. The last row is the device: green while its connections work, red when they fail. The dashed line is the end of the product's planned life.

**Try this**
- **Pin the leaf**: the device fails at the first renewal, after a couple of months, whatever else you set.
- **Store the intermediate** and then the **root**: the failure moves out to the year the authority retires the intermediate, or the root expires.
- Tick **the device can receive a new trust store**: the root, the bundle and your own CA now last the whole life; the leaf does not, because it would need a firmware for every renewal.
- Move the **product life** beyond the root's remaining life, and the **built-in bundle**'s weakness: it fails when the authority moves to a root the bundle never held.
(The figures are typical, not those of one authority; the picture is schematic.)`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 340, maxH: 500 });
      const ctl = kit.controls(box.side, [
        { id: 'trust', type: 'select', label: 'The device stores', options: [['the server\'s leaf certificate (pinning)', 'leaf'], ['the authority\'s intermediate', 'inter'], ['the authority\'s root', 'root'], ['a built-in bundle of roots', 'bundle'], ['your own private CA\'s root (20 years)', 'own']], value: 'root' },
        { id: 'upd', type: 'check', label: 'The device can receive a new trust store (OTA), a year before it is needed', value: false },
        { id: 'life', label: 'Planned product life', min: 1, max: 15, step: 1, value: 10, unit: 'years' },
        { id: 'leaf', label: 'Leaf certificate lasts', min: 30, max: 400, step: 10, value: 90, unit: 'days' },
        { id: 'inter', label: 'Intermediate lasts', min: 1, max: 10, step: 0.5, value: 5, unit: 'years' },
        { id: 'root', label: 'Root has left at shipping', min: 3, max: 25, step: 1, value: 9, unit: 'years' },
        { id: 'move', label: 'The authority moves to a new root after', min: 2, max: 15, step: 1, value: 8, unit: 'years' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['fail', 'The device stops working after'], ['life', 'Planned life'], ['verdict', 'Verdict'], ['upd', 'Updates it would need']]);
      const compute = v => {
        const renew = v.leaf * (2 / 3) / 365;     // a leaf is renewed when two thirds of its life has gone
        let fail = Infinity, why = '';
        if (v.trust === 'leaf') { fail = renew; why = 'the first renewal of the leaf'; }
        else if (v.trust === 'inter') { fail = v.upd ? Infinity : v.inter; why = 'the authority retires the intermediate'; }
        else if (v.trust === 'root') { fail = v.upd ? Infinity : v.root; why = 'the root expires'; }
        else if (v.trust === 'bundle') { fail = v.upd ? Infinity : Math.min(v.root, v.move); why = v.move < v.root ? 'the authority moves to a root the bundle lacks' : 'the root expires'; }
        else { fail = v.upd ? Infinity : 20; why = 'your root expires'; }
        return { fail, why, renew };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, r = compute(v);
        const T = Math.max(15, v.life), px = clamp(st.W * 0.22, 80, 110), pw = st.W - px - 14, top = 30, gap = 8;
        const rowH = Math.max(24, (st.H - top - 54 - 3 * gap) / 4), X = y => px + clamp(y / T, 0, 1) * pw;
        // year axis
        const step = T > 12 ? 5 : T > 6 ? 2 : 1;
        for (let y = 0; y <= T; y += step) {
          c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(X(y), top - 6); c.lineTo(X(y), top + 4 * rowH + 3 * gap); c.stroke(); c.restore();
          kit.label(c, y === 0 ? 'shipped' : y + ' y', X(y), top - 14, { size: 9.5, color: C.muted, align: 'center' });
        }
        const rows = [
          { key: 'leaf', label: 'Leaf', sub: 'the server\'s own', stored: v.trust === 'leaf' },
          { key: 'inter', label: 'Intermediate', sub: 'the authority\'s', stored: v.trust === 'inter' },
          { key: 'root', label: v.trust === 'own' ? 'Your root' : 'Root', sub: v.trust === 'bundle' ? 'in the bundle' : 'in the store', stored: v.trust === 'root' || v.trust === 'own' || v.trust === 'bundle' }
        ];
        rows.forEach((row, i) => {
          const y = top + i * (rowH + gap), bh = rowH * 0.62, by = y + (rowH - bh) / 2;
          kit.label(c, row.label, 6, y + rowH / 2 - 6, { size: 11, weight: row.stored ? 700 : 500, color: row.stored ? C.text : C.text2 });
          kit.label(c, row.stored ? 'stored here' : row.sub, 6, y + rowH / 2 + 8, { size: 9, color: row.stored ? C.accent : C.muted });
          const bar = (a, b, col, alpha) => { c.save(); c.globalAlpha = alpha; c.fillStyle = col; c.fillRect(X(a), by, Math.max(1, X(b) - X(a) - 1), bh); c.restore(); };
          if (row.key === 'leaf') {
            const n = Math.min(400, Math.ceil(T / Math.max(r.renew, 0.01)));
            for (let k = 0; k < n; k++) bar(k * r.renew, k * r.renew + v.leaf / 365, C.series ? C.series[0] : C.accent, k % 2 ? 0.55 : 0.85);
          } else if (row.key === 'inter') {
            for (let k = 0; k * v.inter < T; k++) bar(k * v.inter, (k + 1) * v.inter, C.series ? C.series[1] : C.accent, k % 2 ? 0.55 : 0.85);
          } else {
            const life = v.trust === 'own' ? 20 : v.root;
            bar(0, life, C.series ? C.series[2] : C.accent, 0.8);
            if (life < T) kit.label(c, 'expires', X(life) + 3, by + bh / 2, { size: 9.5, color: C.warn });
          }
          if (row.stored) { c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.6; c.strokeRect(X(0) - 1, by - 2, pw + 2, bh + 4); c.restore(); }
        });
        // the device
        const dy = top + 3 * (rowH + gap), dh = rowH * 0.62, dby = dy + (rowH - dh) / 2;
        kit.label(c, 'The device', 6, dy + rowH / 2 - 6, { size: 11, weight: 700 });
        kit.label(c, 'connects while…', 6, dy + rowH / 2 + 8, { size: 9, color: C.muted });
        const f = Math.min(r.fail, T);
        c.fillStyle = C.ok; c.globalAlpha = 0.8; c.fillRect(X(0), dby, X(f) - X(0), dh); c.globalAlpha = 1;
        if (r.fail < T) { c.fillStyle = C.bad; c.globalAlpha = 0.75; c.fillRect(X(f), dby, X(T) - X(f), dh); c.globalAlpha = 1; kit.label(c, 'fails: ' + r.why, clamp(X(f) + 4, px + 4, st.W - 10), dby - 7, { size: 9.5, color: C.bad, align: X(f) > st.W * 0.6 ? 'right' : 'left' }); }
        // the end of the planned life
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(X(v.life), top - 4); c.lineTo(X(v.life), dy + rowH); c.stroke(); c.restore();
        kit.label(c, 'planned life ends', clamp(X(v.life), px + 40, st.W - 50), dy + rowH + 12, { size: 9.5, color: C.warn, align: 'center' });
        // the numbers
        const whole = r.fail >= v.life;
        ro.set('fail', r.fail === Infinity ? 'never, with the updates' : durText(r.fail));
        ro.set('life', v.life + ' years');
        ro.set('verdict', whole ? 'works for the whole life' : 'stops ' + durText(v.life - r.fail) + ' too early');
        ro.set('upd', v.trust === 'leaf' ? 'one firmware per renewal: ' + Math.ceil(v.life / Math.max(r.renew, 0.001)) + ' in ' + v.life + ' years' : v.upd ? 'one trust-store update, in good time' : 'none planned');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cs-secret-location */
  const WHO = ['the repository', 'the firmware file', 'the board in a hand', 'code on the device'];
  const STAGES = [
    { name: '1 Source code', cells: ['read', 'read', 'read', 'read'], who: 'Everyone with access to the repository, now or in its history: everyone, for good, if it is public. It is also in every firmware built from it.', cost: 'nothing: it is typed in' },
    { name: '2 Firmware file', cells: ['no', 'read', 'read', 'read'], who: 'Anyone who gets the .bin (an update server, a forum, a support request) and anyone who dumps the flash. The strings are easy to find.', cost: 'a build setting that keeps the secret out of the repository' },
    { name: '3 NVS, plain', cells: ['no', 'no', 'read', 'read'], who: 'Anyone who holds the board and reads its flash with a cable, and any code running on the device. The firmware file holds no secret.', cost: 'a set-up step, and a value per unit' },
    { name: '4 NVS, encrypted', cells: ['no', 'no', 'no', 'read'], who: 'Not someone who only reads the flash: the key is in the eFuses. Code running on the device can still read it, so a flaw in your program can leak it.', cost: 'NVS encryption together with flash encryption, keys in the eFuses' },
    { name: '5 eFuse key, HMAC or DS', cells: ['no', 'no', 'no', 'use'], who: 'Nobody can read the key: the hardware uses it to sign or to derive other keys. Code on the device can only ask for that use, which a compromised program can still do while it runs.', cost: 'a chip with the HMAC or Digital Signature peripheral' },
    { name: '6 Secure element', cells: ['no', 'no', 'no', 'use'], who: 'Nobody can read the key: it was made inside a separate tamper-resistant chip and never leaves. Code can only ask the chip to use it.', cost: 'an extra chip, or a module that carries one, and its provisioning' }
  ];

  Hyper.sim('cs-secret-location', {
    title: 'Where a secret lives, and who can read it',
    blurb: `Each row is a place a secret can be kept, from the worst to the best. Each column is someone who might want it. **Red** means they can read it, **amber** that they can only ask the hardware to use it, **green** that they cannot. Click a row, or use the list.

**Try this**
- Walk down the rows: the red spreads left to right and then disappears. A secret in the source is readable by all four columns.
- Tick **the same secret in every unit** and read the line *if one unit leaks*: from row 3 on, a shared secret turns one stolen board into the whole fleet.
- Compare rows 4 and 5: encrypting the flash stops a reader of the chip but not a flaw in your own program; a key that the hardware only uses stops even that from taking the key itself.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 360, maxH: 480 });
      let sel = 2, rowsGeo = [];
      const ctl = kit.controls(box.side, [
        { id: 'stage', type: 'select', label: 'Where the secret is kept', options: STAGES.map((s, i) => [s.name, i]), value: sel },
        { id: 'shared', type: 'check', label: 'The same secret in every unit', value: false },
        { id: 'fleet', label: 'Units in the field', min: 10, max: 100000, value: 1000, log: true, sig: 2 }
      ], (id, v) => { if (id === 'stage') sel = v; loop.once(); });
      const ro = kit.readout(box.side, [['where', 'Kept in'], ['who', 'Who can read it'], ['leak', 'If one unit leaks'], ['cost', 'What it takes']]);
      const exposure = (i, shared, n) => {
        const N = String(Math.round(n));
        if (i <= 1) return 'every unit: all ' + N + ' (one build, one secret)';
        if (i === 2) return shared ? 'all ' + N + ' units (the same secret everywhere)' : '1 unit';
        if (i === 3) return shared ? 'all ' + N + ' units, if code on one is subverted' : '1 unit, and only through code running on it';
        return 'none: the key itself cannot be taken from any unit';
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, M = 8;
        const lw = clamp(st.W * 0.36, 118, 176), cw = (st.W - lw - 2 * M) / 4, hy = 8, hh = 48, lg = 34;
        const rh = (st.H - hy - hh - lg - M) / STAGES.length;
        WHO.forEach((w, j) => {
          const lines = wrap(c, w, cw - 4, 10);
          lines.slice(0, 3).forEach((ln, k) => kit.label(c, ln, M + lw + j * cw + cw / 2, hy + 12 + k * 12, { size: 10, color: C.text2, align: 'center', weight: 600 }));
        });
        rowsGeo = [];
        STAGES.forEach((s, i) => {
          const y = hy + hh + i * rh;
          rowsGeo.push([y, y + rh]);
          if (i === sel) { c.save(); c.fillStyle = C.accent; c.globalAlpha = 0.13; c.fillRect(M - 2, y, st.W - 2 * M + 4, rh); c.globalAlpha = 1; c.strokeStyle = C.accent; c.lineWidth = 1.5; c.strokeRect(M - 1.5, y + 0.5, st.W - 2 * M + 3, rh - 1); c.restore(); }
          kit.label(c, s.name, M + 4, y + rh / 2, { size: 11, weight: i === sel ? 700 : 500, color: i === sel ? C.text : C.text2 });
          s.cells.forEach((cell, j) => {
            const cx = M + lw + j * cw + cw / 2, cy = y + rh / 2, r = Math.min(9, rh * 0.28);
            const colr = cell === 'read' ? C.bad : cell === 'use' ? C.warn : C.ok;
            c.save(); c.fillStyle = colr; c.strokeStyle = colr; c.lineWidth = 2;
            c.beginPath(); c.arc(cx, cy, r, 0, 6.283);
            if (cell === 'use') { c.globalAlpha = 0.25; c.fill(); c.globalAlpha = 1; c.stroke(); } else if (cell === 'read') c.fill(); else { c.globalAlpha = 0.22; c.fill(); c.globalAlpha = 1; c.stroke(); }
            c.restore();
          });
        });
        const ly = st.H - lg + 4;
        [['can read it', C.bad], ['can only ask the hardware to use it', C.warn], ['cannot', C.ok]].forEach(([t, col], i) => {
          const x = M + i * (st.W * 0.28) + (i === 2 ? st.W * 0.1 : 0);
          kit.dot(c, x + 4, ly, 5, col);
          kit.label(c, t, x + 14, ly, { size: 9.5, color: C.muted });
        });
        const s = STAGES[sel];
        ro.set('where', s.name.slice(2)); ro.set('who', s.who); ro.set('leak', exposure(sel, v.shared, v.fleet)); ro.set('cost', s.cost);
      }, box.stage);
      kit.click(st, p => { const i = rowsGeo.findIndex(g => p.y >= g[0] && p.y < g[1]); if (i >= 0) { sel = i; ctl.set('stage', i); loop.once(); } }, p => rowsGeo.some(g => p.y >= g[0] && p.y < g[1]));
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ cs-iot-segment */
  // x, y as fractions of the stage; zone: 'main' (your computers), 'iot' (the devices), 'net' (router, internet)
  const NODES = [
    { id: 'net', kind: 'cloud', label: 'internet', x: 0.5, y: 0.1, zone: 'net' },
    { id: 'rtr', kind: 'router', label: 'router', x: 0.5, y: 0.285, zone: 'net' },
    { id: 'lap', kind: 'laptop', label: 'laptop', x: 0.13, y: 0.58, zone: 'main' },
    { id: 'pho', kind: 'phone', label: 'phone', x: 0.34, y: 0.58, zone: 'main' },
    { id: 'nas', kind: 'db', label: 'files', x: 0.13, y: 0.83, zone: 'main' },
    { id: 'ctl', kind: 'home', label: 'controller', x: 0.34, y: 0.83, zone: 'main' },
    { id: 'bul', kind: 'bulb', label: 'bulb', x: 0.64, y: 0.58, zone: 'iot' },
    { id: 'cam', kind: 'camera', label: 'camera', x: 0.86, y: 0.58, zone: 'iot' },
    { id: 'plg', kind: 'sensor', label: 'plug', x: 0.64, y: 0.83, zone: 'iot' },
    { id: 'sen', kind: 'sensor', label: 'sensor', x: 0.86, y: 0.83, zone: 'iot' }
  ];

  Hyper.sim('cs-iot-segment', {
    title: 'What a compromised device can reach',
    blurb: `Your computers are on the left, the IoT devices on the right, the router and the internet above. Choose how the network is arranged and which device has gone wrong (click a device, or use the list); the red lines are what that device can reach, the green rings what it cannot.

**Try this**
- **One flat network**: a bad camera can reach your laptop, your files and the controller.
- **Guest or IoT network with isolation**: it reaches only the internet and the router, but your phone cannot control the devices locally any more: nothing crosses in either direction.
- **IoT VLAN with firewall rules**: the camera still cannot reach your files, and your phone and the controller can still reach the devices. Only the controller's own ports are open from the IoT side.
(The picture is schematic: real rules depend on the router.)`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 400, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'seg', type: 'select', label: 'How the network is arranged', options: [['One flat network', 'flat'], ['Guest / IoT network with client isolation', 'guest'], ['IoT VLAN with firewall rules', 'vlan']], value: 'flat' },
        { id: 'bad', type: 'select', label: 'The device that has gone wrong', options: [['none', 'none'], ['the camera', 'cam'], ['the smart plug', 'plg'], ['the ESP sensor', 'sen'], ['the bulb', 'bul']], value: 'cam' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['reach', 'The bad device can reach'], ['files', 'Your laptop and files'], ['local', 'Your phone controls the devices'], ['cost', 'What the arrangement costs']]);
      let hits = [];
      // what a compromised IoT device can reach, by arrangement
      const reach = (seg, bad) => {
        if (bad === 'none') return [];
        const others = NODES.filter(n => n.id !== bad).map(n => n.id);
        if (seg === 'flat') return others;
        if (seg === 'guest') return ['net', 'rtr'];
        return ['net', 'rtr', 'ctl'];
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H, M = 8;
        const P = n => [n.x * W, n.y * H], R = clamp(W / 28, 12, 17);
        const flat = v.seg === 'flat';
        // the zones
        const zone = (x0, y0, x1, y1, label, col) => {
          c.save(); c.fillStyle = col; c.globalAlpha = 0.07; c.fillRect(x0, y0, x1 - x0, y1 - y0); c.globalAlpha = 1; c.strokeStyle = col; c.lineWidth = 1.3; c.setLineDash([6, 4]); c.strokeRect(x0 + 0.5, y0 + 0.5, x1 - x0 - 1, y1 - y0 - 1); c.restore();
          kit.label(c, label, x0 + 8, y0 + 11, { size: 10, color: col, weight: 650 });
        };
        if (flat) zone(M, H * 0.43, W - M, H - M, 'one flat network', C.warn);
        else { zone(M, H * 0.43, W * 0.5 - 6, H - M, 'your network', C.ok); zone(W * 0.5 + 6, H * 0.43, W - M, H - M, v.seg === 'guest' ? 'guest / IoT network (isolated)' : 'IoT VLAN', C.accent); }
        // the links to the router
        const rt = P(NODES[1]);
        S.link(c, P(NODES[0])[0], P(NODES[0])[1], rt[0], rt[1], { gap: R + 6 });
        NODES.filter(n => n.zone !== 'net').forEach(n => { const p = P(n); S.link(c, rt[0], rt[1], p[0], p[1], { gap: R + 4, color: C.faint, width: 1 }); });
        // what the bad device reaches
        const rc = reach(v.seg, v.bad), badNode = NODES.find(n => n.id === v.bad);
        if (badNode) {
          const bp = P(badNode);
          rc.forEach(id => { const n = NODES.find(q => q.id === id), p = P(n); S.link(c, bp[0], bp[1], p[0], p[1], { color: C.bad, width: 2, gap: R + 3, arrow: 'end', bend: id === 'net' || id === 'rtr' ? 0 : 18 }); });
        }
        hits = [];
        NODES.forEach(n => {
          const [x, y] = P(n), isBad = n.id === v.bad, reached = rc.includes(n.id);
          if (v.bad !== 'none' && !isBad && n.id !== 'net' && n.id !== 'rtr') { c.save(); c.strokeStyle = reached ? C.bad : C.ok; c.lineWidth = 2.2; c.beginPath(); c.arc(x, y, R * 1.3, 0, 6.283); c.stroke(); c.restore(); }
          S.node(c, x, y, { kind: n.kind, label: isBad ? n.label + ' (bad)' : n.label, r: R, color: isBad ? C.bad : undefined, active: isBad });
          if (n.zone === 'iot') hits.push({ id: n.id, x, y });
        });
        // the numbers
        const names = rc.map(id => NODES.find(q => q.id === id).label);
        ro.set('reach', v.bad === 'none' ? 'nothing has gone wrong' : names.length ? names.join(', ') : 'nothing');
        ro.set('files', v.bad === 'none' ? 'safe' : rc.includes('nas') ? 'REACHABLE from the bad device' : 'out of reach');
        ro.set('local', v.seg === 'guest' ? 'no: nothing crosses, so it goes through the cloud' : 'yes');
        ro.set('cost', v.seg === 'flat' ? 'nothing, and no protection' : v.seg === 'guest' ? 'local control and discovery stop' : 'a router that can do VLANs and rules; name discovery needs a reflector');
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => Math.hypot(p.x - q.x, p.y - q.y) < 26); if (h) { ctl.set('bad', h.id); loop.once(); } }, p => hits.some(q => Math.hypot(p.x - q.x, p.y - q.y) < 26));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cs-checklist */
  const AREAS = ['Secrets', 'Connections', 'Identity', 'Set-up', 'Network', 'Interfaces', 'The device', 'Updates', 'Process', 'Data'];
  // [id, area, weight, critical, default, text]
  const DESIGN = [
    ['i1', 0, 3, true, false, 'No password, key or token in source code or in the shared firmware'],
    ['i2', 0, 3, true, false, 'Every unit has its own credentials'],
    ['i3', 0, 2, false, false, 'Stored secrets are encrypted (NVS and flash encryption)'],
    ['i4', 1, 3, true, false, 'TLS connections are verified: no setInsecure, no CERT_NONE'],
    ['i5', 1, 2, false, true, 'The clock is set before the first TLS connection, and a failed check closes the connection'],
    ['i7', 1, 2, false, false, 'The stored root has an update path before it expires'],
    ['i6', 2, 2, false, false, 'The device proves who it is with a per-device certificate or key'],
    ['i8', 3, 2, false, false, 'Set-up needs a physical act, a per-unit secret and a time limit'],
    ['i9', 4, 2, false, true, 'The device is on its own network segment; no port is forwarded'],
    ['i10', 5, 3, true, false, 'Every page, characteristic and command that acts needs a login or an authenticated link'],
    ['i11', 5, 1, false, true, 'Actions are POST with a token; input is checked and output escaped'],
    ['i14', 6, 2, false, false, 'Secure boot and flash encryption are on in the product, debug ports closed'],
    ['i12', 7, 3, true, false, 'Updates are signed and can roll back'],
    ['i13', 8, 2, false, false, 'A support period is published, and a contact for reports exists'],
    ['i15', 8, 1, false, true, 'A list of components and versions is kept for every release'],
    ['i16', 9, 1, false, true, 'The device collects only the data it needs']
  ];
  // [id, regimes, text]
  const RULES = [
    ['r1', ['PSTI', 'CRA', 'RED'], 'No universal default password: each unit has its own, or it must be changed at first use'],
    ['r2', ['PSTI', 'CRA'], 'A published contact for vulnerability reports'],
    ['r3', ['PSTI', 'CRA'], 'A stated period of security updates (the support period)'],
    ['r4', ['CRA', 'RED'], 'Security updates exist and are authenticated'],
    ['r5', ['CRA'], 'Secure by default: services off until needed, protection on'],
    ['r6', ['CRA', 'RED'], 'Data in transit is protected: TLS with verification'],
    ['r7', ['CRA', 'RED'], 'Stored secrets and personal data are protected'],
    ['r8', ['CRA'], 'Minimal attack surface: no unused ports, debug closed'],
    ['r9', ['CRA'], 'A list of components (SBOM) for every release'],
    ['r10', ['CRA'], 'A process to report actively exploited vulnerabilities to the authorities'],
    ['r11', ['CRA', 'RED'], 'Access control and authentication on every interface'],
    ['r12', ['CRA', 'RED'], 'Technical documentation and a conformity route before CE marking']
  ];
  const REGIMES = [['PSTI', 'UK PSTI'], ['CRA', 'EU Cyber Resilience Act'], ['RED', 'EU RED (EN 18031)']];

  // what a chip's catalogue entry says about secure boot, flash encryption and a digital-signature peripheral
  function hardware(chip) {
    const lines = ((chip && chip.security) || []).filter(s => !/^no(ne)?\b/i.test(s));
    const t = lines.join(' | ');
    return { boot: /secure boot/i.test(t), fenc: /flash[^|]{0,40}encryption|external memory[^|]{0,30}encryption/i.test(t), ds: lines.some(s => /Digital Signature|RSA_DS|ECDSA_DS/i.test(s)) };
  }

  Hyper.sim('cs-checklist', {
    title: 'Scoring a design against the checklist',
    blurb: `Tick what your design really does. The ring is the score: a weighted share of the measures in place. **Critical** gaps (marked ★) are the ones that let a stranger straight in, so any of them caps the score at 59 %, whatever else is ticked.

**Try this**
- Start from the ticks given, a typical hobby design: the score is capped by several critical gaps. Tick the starred ones first and watch the cap lift.
- Choose the **ESP8266** and tick *secure boot and flash encryption*: the chip cannot do it, so the tick does not count.
- With the **rules** version of this checklist, each measure is tagged with the regimes it helps to satisfy: an indicative mapping, not legal advice.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const rules = params.set === 'rules';
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 400, maxH: 520 });
      const chips = E.CHIPS.filter(c => !c.coproc);
      const items = rules ? RULES.map(r => ({ id: r[0], regimes: r[1], w: 1, crit: false, area: 0, text: r[2], def: false })) : DESIGN.map(r => ({ id: r[0], area: r[1], w: r[2], crit: r[3], def: r[4], text: r[5] }));
      const defs = [];
      if (!rules) defs.push({ id: 'chip', type: 'select', label: 'The chip', options: chips.map(c => [String(c.name).slice(0, 26), c.id]), value: E.chip('esp32-c3') ? 'esp32-c3' : chips[0].id });
      items.forEach(it => defs.push({ id: it.id, type: 'check', label: (it.crit ? '★ ' : '') + it.text + (rules ? '  [' + it.regimes.join(' · ') + ']' : ''), value: it.def }));
      const ctl = kit.controls(box.side, defs, () => loop.once());
      const ro = kit.readout(box.side, rules ? [['score', 'Measures in place'], ['psti', 'UK PSTI'], ['cra', 'EU Cyber Resilience Act'], ['red', 'EU RED'], ['fix', 'Do next']] : [['score', 'Score'], ['verdict', 'Verdict'], ['hw', 'This chip offers'], ['gaps', 'Critical gaps'], ['fix', 'Fix first']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H, M = 10;
        const chip = rules ? null : E.chip(v.chip), hw = hardware(chip);
        const possible = it => rules || it.id !== 'i14' || (hw.boot && hw.fenc);
        const on = it => !!v[it.id] && possible(it);
        const total = items.reduce((s, it) => s + it.w, 0), got = items.reduce((s, it) => s + (on(it) ? it.w : 0), 0);
        const gaps = items.filter(it => it.crit && !on(it));
        const raw = total ? got / total : 0, score = gaps.length ? Math.min(raw, 0.59) : raw;
        const col = score >= 0.85 ? C.ok : score >= 0.6 ? C.warn : C.bad;
        // the ring
        const narrow = W < 540, rr = narrow ? Math.min(58, W * 0.16) : Math.min(78, W * 0.14), cx = narrow ? W / 2 : M + rr + 14, cy = M + rr + 8;
        c.save(); c.lineWidth = 13; c.lineCap = 'butt'; c.strokeStyle = C.grid; c.beginPath(); c.arc(cx, cy, rr, 0, 6.2832); c.stroke();
        c.strokeStyle = col; c.beginPath(); c.arc(cx, cy, rr, -1.5708, -1.5708 + 6.2832 * score); c.stroke();
        if (gaps.length && raw > score) { c.strokeStyle = C.faint; c.lineWidth = 3; c.setLineDash([3, 3]); c.beginPath(); c.arc(cx, cy, rr + 12, -1.5708, -1.5708 + 6.2832 * raw); c.stroke(); }
        c.restore();
        kit.label(c, Math.round(score * 100) + ' %', cx, cy - 4, { size: 22, weight: 700, color: col, align: 'center' });
        kit.label(c, rules ? 'in place' : (gaps.length ? 'capped' : 'score'), cx, cy + 17, { size: 10.5, color: C.muted, align: 'center' });
        // the bars: per area, or per regime
        const bx = narrow ? M : cx + rr + 34, by = narrow ? cy + rr + 28 : M + 14, bw = W - bx - M;
        const bars = rules ? REGIMES.map(([k, name]) => { const its = items.filter(it => it.regimes.includes(k)); return { name, n: its.filter(on).length, of: its.length, frac: its.length ? its.filter(on).length / its.length : 0 }; })
          : AREAS.map((name, i) => { const its = items.filter(it => it.area === i); const wt = its.reduce((s, it) => s + it.w, 0); return { name, frac: wt ? its.reduce((s, it) => s + (on(it) ? it.w : 0), 0) / wt : 0, crit: its.some(it => it.crit && !on(it)) }; });
        const bh = Math.min(rules ? 40 : 26, (H - by - M) / bars.length - 4), lw = Math.min(118, bw * 0.4);
        bars.forEach((b, i) => {
          const y = by + i * (bh + 4);
          kit.label(c, b.name, bx, y + bh / 2, { size: 10.5, color: C.text2, weight: 500 });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(bx + lw, y, bw - lw - (rules ? 34 : 0), bh);
          c.fillStyle = b.frac >= 0.99 ? C.ok : b.frac > 0 ? C.warn : C.bad; c.globalAlpha = 0.85; c.fillRect(bx + lw, y, Math.max(0, (bw - lw - (rules ? 34 : 0)) * b.frac), bh); c.globalAlpha = 1;
          if (rules) kit.label(c, b.n + '/' + b.of, bx + bw, y + bh / 2, { size: 10.5, color: C.text2, align: 'right' });
          else if (b.crit) kit.label(c, '★', bx + bw - 4, y + bh / 2, { size: 12, color: C.bad, align: 'right' });
        });
        // the read-out
        const missing = items.filter(it => !on(it)).sort((a, b) => (b.crit - a.crit) || (b.w - a.w))[0];
        ro.set('score', Math.round(score * 100) + ' %' + (gaps.length && raw > score ? ' (would be ' + Math.round(raw * 100) + ' %)' : ''));
        ro.set('fix', missing ? missing.text : 'nothing: all measures are in place');
        if (rules) {
          bars.forEach((b, i) => ro.set(['psti', 'cra', 'red'][i], b.n + ' of ' + b.of + ' measures'));
        } else {
          ro.set('verdict', gaps.length ? 'capped by ' + gaps.length + ' critical gap' + (gaps.length > 1 ? 's' : '') : raw >= 0.9 ? 'strong' : raw >= 0.7 ? 'reasonable: close the remaining gaps' : 'weak');
          ro.set('hw', String(chip.name).slice(0, 24) + ': secure boot ' + (hw.boot ? 'yes' : 'no') + ', flash encryption ' + (hw.fenc ? 'yes' : 'no') + ', digital signature ' + (hw.ds ? 'yes' : 'no'));
          ro.set('gaps', gaps.length ? gaps.map(g => g.text.split(' ').slice(0, 5).join(' ') + '…').join(' · ') : 'none');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
