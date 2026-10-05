/* HYPER-ESP32 · sims/esp-now-and-peer-to-peer.js
 *
 * Simulations of the topic "esp-now-and-peer-to-peer" (ids en-*).
 *
 *   en-exchange   a message and its acknowledgement as a ladder diagram; params { mode: 'broadcast' | 'unicast' | 'app' | 'udp' | 'tcp' }
 *   en-broadcast  one broadcast frame against one unicast frame per board, with the signal of each board and the air time
 *   en-channel    sensors, a gateway and a router on the 13 Wi-Fi channels: why frames vanish when the gateway joins the router
 *   en-chain      sensor, gateway, broker and dashboard: what a missing broker and a restart do to the readings
 *   en-mesh       a mesh of nodes you can drag and switch off, with the routes redrawn
 *   en-airtime    what one ESP-NOW message costs in air time and battery, from the catalogue's currents
 *   en-timesync   the four timestamps of a clock exchange, the offset and delay it finds, and the error asymmetry causes
 *
 * All numbers about chips come from the catalogue (kit.esp); the loss figures are schematic and say so in the blurbs.
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt1 = v => (Math.round(v * 10) / 10).toString();
  const frac = v => v - Math.floor(v);
  // a seeded random generator (mulberry32), so that a layout can be repeated
  function rngOf(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  // a short label that fits: cut with an ellipsis
  const cut = (s, n) => (String(s).length > n ? String(s).slice(0, n - 1) + '…' : String(s));
  // the catalogue's figure, or a fallback when the chip has none
  const num = (v, d) => (typeof v === 'number' && isFinite(v) ? v : d);

  /* ================================================================ en-exchange */
  Hyper.sim('en-exchange', {
    title: 'A message and its acknowledgement',
    blurb: `Board A sends numbered messages to board B over a link that **loses frames**. Each arrow is one frame; an arrow ending in a cross never arrives. The column on the left is the time of each frame in milliseconds. Notes beside B say what the receiving program saw.

The loss and the timers are **schematic** (the real number of radio repeats and the real timeouts are set in the Wi-Fi driver and the network stack), but the logic of each method is the real one.

**Try this**
- *Broadcast* with 30 % loss: send twenty. The sender is told "sent" every time, yet about six never arrived — and nothing says which.
- *To one board*: the radio repeats an unanswered frame up to four times, so most messages get through. Look for **"told failed, yet it arrived"**: all the acknowledgements were lost, not the data.
- *Our own acknowledgement*: when only the ACK is lost, A sends again and B sees a **duplicate**. B acknowledges it again but does not act on it twice.
- *UDP* behaves like a broadcast; *TCP* sets up a connection first, then repeats with growing timeouts until the acknowledgement comes — slower, but nothing is lost until it gives up.`,
    mount(box, kit, params) {
      params = params || {};
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 440, maxH: 620 });
      const MODES = [['ESP-NOW broadcast', 'broadcast'], ['ESP-NOW to one board (radio acknowledges and repeats)', 'unicast'], ['ESP-NOW with our own acknowledgement and retries', 'app'], ['UDP datagram', 'udp'], ['TCP connection', 'tcp']];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'How the message is sent', options: MODES, value: MODES.some(m => m[1] === params.mode) ? params.mode : 'unicast' },
        { id: 'loss', label: 'Frames lost on the air', min: 0, max: 90, step: 5, value: 30, unit: '%' },
        { type: 'buttons', items: [{ id: 'send', label: 'Send a message', primary: true }, { id: 'many', label: 'Send 20 at once' }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'send') {
          if (cur && !cur.committed) { shown = cur.rows.length; commit(); }
          cur = build(); shown = 0; prog = 0; loop.start();
        } else if (id === 'many') {
          if (cur && !cur.committed) commit();
          for (let i = 0; i < 20; i++) { cur = build(); commit(); }
          shown = cur.rows.length; prog = 0; loop.once();
        } else if (id === 'reset' || id === 'mode') {
          tally.n = tally.got = tally.told = tally.wrong = tally.miss = tally.dup = 0;
          conn.open = false; conn.seq = 0; cur = null; shown = 0; prog = 0;
          refresh(); loop.once();
        } else loop.once();
      });
      const ro = kit.readout(box.side, [['n', 'Messages sent'], ['got', 'Reached the receiving program'], ['told', 'Sender thinks it worked'], ['wrong', 'Thought it worked, but lost'], ['miss', 'Thought it failed, but it arrived'], ['dup', 'Repeats dropped by B'], ['last', 'Last message']]);
      const tally = { n: 0, got: 0, told: 0, wrong: 0, miss: 0, dup: 0 };
      const conn = { open: false, seq: 0 };
      const ROW = 0.5;                   // seconds of animation per frame
      let cur = null, shown = 0, prog = 0, lastText = '—';

      // the whole exchange of one message, worked out at once: rows = the frames, res = what happened
      function build() {
        const mode = ctl.values.mode, p = ctl.values.loss / 100;
        const rows = [], res = { reached: false, told: false, tries: 0, dup: 0, hand: false };
        let t = 0;
        const seq = ++conn.seq;
        const frame = (dir, label, kind) => { const lost = Math.random() < p; rows.push({ dir, label, lost, t, kind: kind || (dir === 'AB' ? 'data' : 'ack') }); t += 1; return !lost; };
        const note = txt => { rows[rows.length - 1].note = txt; };
        let verdict;
        if (mode === 'broadcast' || mode === 'udp') {
          const ok = frame('AB', (mode === 'udp' ? 'datagram #' : 'broadcast #') + seq);
          if (ok) { res.reached = true; note('received'); }
          res.told = true;
          verdict = ok ? ['ok', 'Sent, and it arrived'] : ['warn', 'Sent, but lost: nobody knows'];
          res.text = ok ? 'Arrived. The sender was told "sent" and could not have known otherwise.' : 'Lost on the air. The sender was told "sent" all the same: there is no acknowledgement.';
        } else if (mode === 'unicast') {
          let acked = false;
          for (let k = 1; k <= 4 && !acked; k++) {
            const ok = frame('AB', 'data #' + seq + (k > 1 ? ' (repeat ' + (k - 1) + ')' : ''));
            if (ok) {
              if (!res.reached) { res.reached = true; note('received'); } else note('repeat');
              if (frame('BA', 'ACK (radio)')) acked = true;
            }
            if (!acked) t += 3;
            res.tries = k;
          }
          res.told = acked;
          if (acked) { verdict = ['ok', 'Delivered' + (res.tries > 1 ? ' on try ' + res.tries : '')]; res.text = 'The send callback said success after ' + res.tries + (res.tries > 1 ? ' tries.' : ' try.'); }
          else if (res.reached) { verdict = ['warn', 'Told "failed", yet it arrived']; res.text = 'All four tries went unanswered, but B did hear the data: only the acknowledgements were lost.'; }
          else { verdict = ['bad', 'Failed: it never arrived']; res.text = 'Four tries, no acknowledgement, and B heard nothing. The callback said failure.'; }
        } else if (mode === 'app') {
          let acked = false, timeout = 20;
          for (let k = 1; k <= 5 && !acked && rows.length < 14; k++) {
            const ok = frame('AB', 'DATA #' + seq + (k > 1 ? ' (try ' + k + ')' : ''));
            if (ok) {
              if (!res.hand) { res.hand = true; res.reached = true; note('handled'); } else { res.dup++; note('duplicate'); }
              if (frame('BA', 'ACK #' + seq)) acked = true;
            }
            if (!acked) { t += timeout; timeout *= 2; }
            res.tries = k;
          }
          res.told = acked;
          if (acked) { verdict = ['ok', 'Acknowledged' + (res.tries > 1 ? ' after ' + res.tries + ' tries' : '')]; res.text = 'B acted once' + (res.dup ? ' and dropped ' + res.dup + ' repeat' + (res.dup > 1 ? 's' : '') + ' by sequence number' : '') + '. Total ' + Math.round(t) + ' ms.'; }
          else if (res.reached) { verdict = ['warn', 'Gave up, yet B has it']; res.text = 'Every acknowledgement was lost, so A gave up; B had acted on the first copy.'; }
          else { verdict = ['bad', 'Gave up: it never arrived']; res.text = 'Five tries, no acknowledgement. The program must now decide: keep the reading or drop it.'; }
        } else {
          let ok = true;
          if (!conn.open) {
            const steps = [['AB', 'SYN'], ['BA', 'SYN-ACK'], ['AB', 'ACK']];
            for (const [dir, label] of steps) {
              let got = false, rto = 200;
              for (let k = 1; k <= 3 && !got; k++) { got = frame(dir, k > 1 ? label + ' (again)' : label, 'ctl'); if (!got) { t += rto; rto *= 2; } }
              if (!got) { ok = false; break; }
            }
            if (ok) { conn.open = true; note('connected'); }
          }
          if (ok) {
            let acked = false, rto = 200;
            for (let k = 1; k <= 5 && !acked && rows.length < 15; k++) {
              const arrived = frame('AB', 'DATA ' + seq + (k > 1 ? ' (again)' : ''));
              if (arrived) {
                if (!res.hand) { res.hand = true; res.reached = true; note('delivered'); } else { res.dup++; note('duplicate'); }
                if (frame('BA', 'ACK ' + seq)) acked = true;
              }
              if (!acked) { t += rto; rto *= 2; }
              res.tries = k;
            }
            res.told = acked;
            if (acked) { verdict = ['ok', 'Delivered' + (res.tries > 1 ? ' after ' + res.tries + ' tries' : '')]; res.text = 'In order and once' + (res.dup ? ' (' + res.dup + ' repeated segment dropped)' : '') + '. It took ' + Math.round(t) + ' ms.'; }
            else { conn.open = false; verdict = [res.reached ? 'warn' : 'bad', 'Connection broken, gave up']; res.text = 'No acknowledgement after five tries: TCP resets the connection and tells the program.'; }
          } else { verdict = ['bad', 'Could not connect']; res.text = 'The handshake failed three times: no connection, so nothing was sent.'; }
        }
        return { rows, res, verdict, ms: t, committed: false };
      }
      // count a finished message
      function commit() {
        if (!cur || cur.committed) return;
        cur.committed = true;
        const r = cur.res;
        tally.n++;
        if (r.reached) tally.got++;
        if (r.told) tally.told++;
        if (r.told && !r.reached) tally.wrong++;
        if (!r.told && r.reached) tally.miss++;
        tally.dup += r.dup;
        lastText = cur.res.text;
        refresh();
      }
      function refresh() {
        const n = tally.n, pct = v => (n ? v + ' of ' + n + ' (' + Math.round(100 * v / n) + ' %)' : '—');
        ro.set('n', String(n));
        ro.set('got', pct(tally.got));
        ro.set('told', pct(tally.told));
        ro.set('wrong', pct(tally.wrong));
        ro.set('miss', pct(tally.miss));
        ro.set('dup', String(tally.dup));
        ro.set('last', n ? lastText : 'Press "Send a message".');
      }
      const loop = kit.loop(dt => {
        let animating = false;
        if (cur && shown < cur.rows.length) { animating = true; prog += dt / ROW; if (prog >= 1) { shown++; prog = 0; if (shown >= cur.rows.length) { commit(); animating = false; } } }
        draw();
        if (!animating) loop.stop();
      }, box.stage);
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, mode = ctl.values.mode;
        const narrow = W < 520;
        const xa = W * (narrow ? 0.25 : 0.27), xb = W * (narrow ? 0.75 : 0.73);
        const nr = clamp(W / 36, 12, 17), top = 12 + nr, y0 = top + nr + 46, rowH = clamp((H - y0 - 40) / 16, 14, 28);
        const names = mode === 'tcp' ? ['client', 'server'] : ['sender', 'receiver'];
        S.node(c, xa, top, { kind: 'esp', label: 'A', sub: names[0], r: nr });
        S.node(c, xb, top, { kind: 'esp', label: 'B', sub: names[1], r: nr, color: 212 });
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 5]);
        for (const x of [xa, xb]) { c.beginPath(); c.moveTo(x, y0 - 14); c.lineTo(x, y0 + 16 * rowH); c.stroke(); }
        c.restore();
        if (!cur) { kit.label(c, 'Press "Send a message"', W / 2, y0 + 3 * rowH, { size: 12.5, color: C.muted, align: 'center' }); return; }
        const rows = cur.rows;
        rows.forEach((r, k) => {
          if (k > shown) return;
          const y = y0 + k * rowH + rowH / 2, dir = r.dir === 'AB' ? 1 : -1;
          const x1 = r.dir === 'AB' ? xa : xb, x2full = r.dir === 'AB' ? xb : xa;
          const f = k < shown ? 1 : clamp(prog, 0, 1), x2 = r.lost ? x1 + (x2full - x1) * 0.62 : x2full, xe = x1 + (x2 - x1) * f;
          const col = r.lost ? C.bad : r.kind === 'ack' ? C.ok : r.kind === 'ctl' ? C.muted : C.accent;
          kit.label(c, Math.round(r.t) + ' ms', 4, y, { size: 9.5, color: C.faint });
          c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 1.8;
          c.beginPath(); c.moveTo(x1, y); c.lineTo(xe, y); c.stroke();
          if (f >= 1) {
            if (r.lost) { c.lineWidth = 2.2; c.beginPath(); c.moveTo(x2 - 5, y - 5); c.lineTo(x2 + 5, y + 5); c.moveTo(x2 + 5, y - 5); c.lineTo(x2 - 5, y + 5); c.stroke(); }
            else { c.beginPath(); c.moveTo(x2, y); c.lineTo(x2 - dir * 9, y - 4.5); c.lineTo(x2 - dir * 9, y + 4.5); c.closePath(); c.fill(); }
          }
          c.restore();
          if (f < 1) S.msg(c, x1, y, x2, y, f, { color: col, r: 4 });
          kit.label(c, r.label, (x1 + x2) / 2, y - 7, { size: 10.5, align: 'center', color: r.lost ? C.bad : C.text, bg: C.dark ? 'rgba(13,16,32,.78)' : 'rgba(255,255,255,.82)' });
          if (r.note && !r.lost && r.dir === 'AB' && (k < shown || prog > 0.9)) kit.label(c, r.note, xb + 10, y, { size: 9.5, color: r.note === 'duplicate' || r.note === 'repeat' ? C.warn : C.ok });
        });
        if (shown >= rows.length) {
          const kind = cur.verdict[0], colr = kind === 'ok' ? C.ok : kind === 'warn' ? C.warn : C.bad;
          S.box(c, 8, H - 32, W - 16, 24, { label: cut(cur.verdict[1], Math.max(24, Math.floor(W / 7.2))), color: colr, active: true, size: 12 });
        }
      }
      refresh();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ en-broadcast */
  Hyper.sim('en-broadcast', {
    title: 'One frame to many, or one frame to each',
    blurb: `The controller is in the middle; each board is placed at its distance, and the **percentage** under it is the chance that one frame is heard there, worked out from a link budget with the catalogue's transmit power and receiver sensitivity. Press **Send a round** and watch what the two methods do.

A **broadcast** is one frame: every board in earshot may hear it, nobody acknowledges it, nobody repeats it. A **unicast** to each board is one frame per board, acknowledged by the radio and repeated up to four times, so the controller knows who has it, at the cost of more frames and more air time.

The loss figures are schematic: a logistic curve of the margin above the receiver's sensitivity. The air time counts only the data frames, not the short acknowledgements.

**Try this**
- Six boards, *Indoors*: the broadcast reaches most of them with **one** frame. Switch to unicast and count the frames.
- Choose *Indoors, many walls*: the far boards fall silent. The unicast tries harder but the sender also learns that those boards are not answering; the broadcast never knows.
- Raise the payload to 250 bytes: the air time of each frame grows from under 1 ms to about 2.6 ms.
- Add boards: the broadcast costs the same; the unicast cost grows with every board.`,
    mount(box, kit, params) {
      params = params || {};
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 380, maxH: 560 });
      const chip = E.chip('esp32-c3') || {}, TX = num(chip.txDbm, 20), SENS = num(chip.sensDbm, -98);
      const ENV = { open: { n: 2, extra: 0 }, indoor: { n: 3, extra: 10 }, walls: { n: 3.5, extra: 25 } };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'The controller sends', options: [['One broadcast frame', 'broadcast'], ['One unicast frame to each board', 'unicast']], value: params.mode === 'unicast' ? 'unicast' : 'broadcast' },
        { id: 'n', label: 'Receiving boards', min: 2, max: 12, step: 1, value: 6 },
        { id: 'env', type: 'select', label: 'Surroundings', options: [['Open air', 'open'], ['Indoors', 'indoor'], ['Indoors, many walls', 'walls']], value: 'indoor' },
        { id: 'bytes', label: 'Payload', min: 1, max: 250, step: 1, value: 20, unit: 'bytes' },
        { type: 'buttons', items: [{ id: 'send', label: 'Send a round', primary: true }] }
      ], id => { if (id === 'send') startRound(); else { round = null; loop.once(); } });
      const ro = kit.readout(box.side, [['frames', 'Frames the controller sends'], ['air', 'Air time of those frames'], ['reach', 'Boards that hear it, on average'], ['know', 'Boards the controller knows have it'], ['other', 'The other method would need'], ['round', 'This round']]);
      let round = null;
      const heardProb = margin => 1 / (1 + Math.exp(-(margin - 5) / 2.5));
      // the receiving boards: distance, signal margin and the chance one frame is heard
      function boards() {
        const n = Math.round(ctl.values.n), env = ENV[ctl.values.env] || ENV.indoor, out = [];
        for (let i = 0; i < n; i++) {
          const d = 10 + 110 * frac(i * 0.618034 + 0.13);
          const link = E.link({ tx: TX, mhz: 2437, d, n: env.n, sens: SENS });
          const margin = link.margin - env.extra;
          out.push({ d, margin, rx: link.rx - env.extra, q: heardProb(margin), ang: -Math.PI / 2 + 0.35 + i * 2 * Math.PI / n });
        }
        return out;
      }
      function analytics(bs) {
        const b = { reach: 0, frames: 1 }, u = { reach: 0, know: 0, frames: 0 };
        bs.forEach(x => {
          b.reach += x.q;
          u.reach += 1 - Math.pow(1 - x.q, 4);
          const q2 = x.q * x.q;
          u.know += 1 - Math.pow(1 - q2, 4);
          let e = 0, pr = 1;
          for (let k = 0; k < 4; k++) { e += pr; pr *= 1 - q2; }
          u.frames += e;
        });
        return { b, u };
      }
      function startRound() {
        const bs = boards(), mode = ctl.values.mode, segs = [], heard = bs.map(() => -1), known = bs.map(() => -1);
        let t = 0, frames = 0;
        if (mode === 'broadcast') {
          segs.push({ t0: 0, t1: 1.0, kind: 'wave' });
          bs.forEach((b, i) => { if (Math.random() < b.q) heard[i] = clamp(b.d / 125, 0.05, 1); });
          frames = 1; t = 1.0;
        } else {
          bs.forEach((b, i) => {
            for (let k = 1; k <= 4; k++) {
              const ok = Math.random() < b.q;
              frames++;
              segs.push({ t0: t, t1: t + 0.16, to: i, kind: 'out', ok }); t += 0.16;
              if (ok) {
                if (heard[i] < 0) heard[i] = t;
                const ackOk = Math.random() < b.q;
                segs.push({ t0: t, t1: t + 0.1, to: i, kind: 'ack', ok: ackOk }); t += 0.1;
                if (ackOk) { known[i] = t; break; }
              }
              t += 0.04;
            }
          });
        }
        round = { segs, heard, known, total: t + 0.4, frames, clock: 0, n: bs.length, heardN: heard.filter(v => v >= 0).length, knownN: known.filter(v => v >= 0).length };
        loop.start();
      }
      const loop = kit.loop(dt => {
        if (round) round.clock += dt;
        draw();
        if (!round || round.clock >= round.total) loop.stop();
      }, box.stage);
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, mode = ctl.values.mode;
        const bs = boards(), cx = W / 2, cy = H / 2, maxR = Math.max(60, Math.min(W / 2 - 30, H / 2 - 44)), px = d => d / 125 * maxR;
        const clock = round ? round.clock : -1;
        // distance rings
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.setLineDash([3, 5]);
        for (const d of [30, 60, 90, 120]) { c.beginPath(); c.arc(cx, cy, px(d), 0, Math.PI * 2); c.stroke(); }
        c.restore();
        for (const d of [30, 60, 90, 120]) kit.label(c, d + ' m', cx + px(d) * 0.707 + 2, cy - px(d) * 0.707 - 2, { size: 9, color: C.faint });
        const pos = bs.map(b => ({ x: cx + Math.cos(b.ang) * px(b.d), y: cy + Math.sin(b.ang) * px(b.d) }));
        // the frames in flight
        if (round) {
          for (const sg of round.segs) {
            if (clock < sg.t0 || clock > sg.t1 + 0.3) continue;
            const f = clamp((clock - sg.t0) / (sg.t1 - sg.t0), 0, 1);
            if (sg.kind === 'wave') {
              const rad = f * maxR * 1.05;
              c.save(); c.strokeStyle = C.accent; c.lineWidth = 2; c.globalAlpha = Math.max(0, 0.9 * (1 - f));
              c.beginPath(); c.arc(cx, cy, rad, 0, Math.PI * 2); c.stroke();
              c.beginPath(); c.arc(cx, cy, rad * 0.7, 0, Math.PI * 2); c.stroke();
              c.restore();
              continue;
            }
            const p = pos[sg.to], a = sg.kind === 'out' ? [cx, cy] : [p.x, p.y], b = sg.kind === 'out' ? [p.x, p.y] : [cx, cy];
            const col = sg.kind === 'out' ? C.accent : C.ok;
            if (sg.ok) { if (f < 1) S.msg(c, a[0], a[1], b[0], b[1], f, { color: col, r: 3.5 }); }
            else if (f < 1) S.msg(c, a[0], a[1], b[0], b[1], Math.min(f, 0.6), { color: C.bad, r: 3.5 });
            else {
              const mx = a[0] + (b[0] - a[0]) * 0.6, my = a[1] + (b[1] - a[1]) * 0.6;
              c.save(); c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(mx - 4, my - 4); c.lineTo(mx + 4, my + 4); c.moveTo(mx + 4, my - 4); c.lineTo(mx - 4, my + 4); c.stroke(); c.restore();
            }
          }
        }
        // the boards
        const r = clamp(maxR / 12, 9, 13);
        bs.forEach((b, i) => {
          const isHeard = round && round.heard[i] >= 0 && clock >= round.heard[i];
          S.node(c, pos[i].x, pos[i].y, { kind: 'esp', r, label: String(i + 1), sub: Math.round(b.q * 100) + ' %', color: Math.round(4 + 136 * b.q), active: !!isHeard, dim: b.q < 0.05 });
          if (round && mode === 'unicast' && round.known[i] >= 0 && clock >= round.known[i]) kit.label(c, '✓', pos[i].x + r + 3, pos[i].y - r, { size: 12, color: C.ok, weight: 700 });
        });
        S.node(c, cx, cy, { kind: 'esp', r: 15, label: 'controller', color: 212 });
        // the numbers
        const an = analytics(bs), air = E.espnowAirtime(ctl.values.bytes, 1) * 1000, n = bs.length;
        const me = mode === 'broadcast' ? an.b : an.u, other = mode === 'broadcast' ? an.u : an.b;
        ro.set('frames', fmt1(me.frames) + (me.frames === 1 ? ' frame' : ' frames'));
        ro.set('air', kit.fmt(me.frames * air, 3) + ' ms');
        ro.set('reach', fmt1(me.reach) + ' of ' + n);
        ro.set('know', mode === 'broadcast' ? 'none: no acknowledgement' : fmt1(an.u.know) + ' of ' + n);
        ro.set('other', fmt1(other.frames) + (other.frames === 1 ? ' frame' : ' frames') + ', reach ' + fmt1(other.reach) + ' of ' + n);
        if (!round) ro.set('round', 'Press "Send a round".');
        else if (round.clock < round.total) ro.set('round', 'under way…');
        else ro.set('round', 'heard by ' + round.heardN + ' of ' + round.n + ' · ' + round.frames + (round.frames === 1 ? ' frame' : ' frames') + (mode === 'unicast' ? ' · acknowledged by ' + round.knownN : ''));
      }
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ en-channel */
  Hyper.sim('en-channel', {
    title: 'The channel problem',
    blurb: `Three sensors send a frame every second to a gateway. A frame is heard only if the sender and the receiver are **on the same Wi-Fi channel**; otherwise it dies on the way (a cross). Each bar under an icon is that device's 20 MHz channel, which is four channels wide.

**Try this**
- Start: the gateway has not joined anything, so it sits on channel 1, and the sensors are on channel 1. Everything arrives.
- Tick **The gateway has joined the router**: it moves to the router's channel (6), the sensors stay on 1 — and nothing arrives.
- Move the **sensors to the router's channel** to repair it by hand. Then press **The router changes channel**: the repair is gone.
- Tick **Sensors hunt for the gateway**: after two failures a sensor tries the next channel every 0.3 s until a frame is answered. Press the router button again and watch the sensors find it.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 400, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'router', label: 'Router channel', min: 1, max: 13, step: 1, value: 6 },
        { id: 'sensors', label: 'Sensors are set to channel', min: 1, max: 13, step: 1, value: 1 },
        { id: 'joined', type: 'check', label: 'The gateway has joined the router', value: false },
        { id: 'hunt', type: 'check', label: 'Sensors hunt for the gateway when frames fail', value: false },
        { type: 'buttons', items: [{ id: 'move', label: 'The router changes channel', primary: true }, { id: 'clear', label: 'Clear the history' }] }
      ], id => {
        if (id === 'move') {
          const others = [];
          for (let k = 1; k <= 13; k++) if (k !== ctl.values.router) others.push(k);
          ctl.set('router', others[Math.floor(Math.random() * others.length)]);
        } else if (id === 'sensors') {
          sensors.forEach((s, i) => { s.ch = ctl.values.sensors; s.misses = 0; s.scanning = false; s.nextAt = clock + 0.3 * i; });
        } else if (id === 'clear') {
          sensors.forEach(s => { s.hist = []; });
        }
        loop.once();
      });
      const ro = kit.readout(box.side, [['gw', 'The gateway listens on channel'], ['se', 'The sensors transmit on channel'], ['ok', 'Frames that arrived, last 20 each'], ['v', 'Verdict']]);
      let clock = 0, packets = [];
      const sensors = [0, 1, 2].map(i => ({ ch: 1, misses: 0, scanning: false, nextAt: 0.3 * i + 0.2, hist: [] }));
      const gwChannel = () => (ctl.values.joined ? ctl.values.router : 1);
      const lane = () => ({ xL: 78, xR: st.W - 26 });
      const LY = { R: 0.13, G: 0.31, S: 0.5, AX: 0.7 };      // the heights of the lanes and of the channel axis, as fractions of the stage
      const X = ch => { const l = lane(); return l.xL + (ch - 1) / 12 * (l.xR - l.xL); };
      const loop = kit.loop(dt => {
        clock += dt;
        const gw = gwChannel(), W = st.W, H = st.H;
        sensors.forEach((s, i) => {
          if (clock < s.nextAt) return;
          const ok = s.ch === gw;
          packets.push({ x1: X(s.ch) + (i - 1) * 14, y1: H * LY.S, x2: X(gw), y2: H * LY.G, t0: clock, ok });
          s.hist.push(ok); if (s.hist.length > 20) s.hist.shift();
          if (ok) { s.misses = 0; s.scanning = false; s.nextAt = clock + 1.0; }
          else {
            s.misses++;
            if (ctl.values.hunt && (s.misses >= 2 || s.scanning)) { s.scanning = true; s.ch = s.ch % 13 + 1; s.nextAt = clock + 0.3; }
            else s.nextAt = clock + 1.0;
          }
        });
        packets = packets.filter(p => clock - p.t0 < 1.0);
        draw(W, H);
      }, box.stage);
      function draw(W, H) {
        const c = st.begin(), C = kit.colors();
        const rc = ctl.values.router, gc = gwChannel();
        const yR = H * LY.R, yG = H * LY.G, yS = H * LY.S, yAx = H * LY.AX, l = lane();
        const chText = (txt, x, y, off) => kit.label(c, txt, x > W * 0.72 ? x - off : x + off, y, { size: 10.5, color: C.text2, align: x > W * 0.72 ? 'right' : 'left' });
        const band = (ch, y, color) => {
          const x1 = clamp(X(ch - 2), l.xL - 12, l.xR + 12), x2 = clamp(X(ch + 2), l.xL - 12, l.xR + 12);
          c.save(); c.fillStyle = color; c.globalAlpha = 0.28; c.beginPath(); if (c.roundRect) c.roundRect(x1, y, Math.max(2, x2 - x1), 9, 4); else c.rect(x1, y, Math.max(2, x2 - x1), 9); c.fill(); c.restore();
        };
        kit.label(c, 'router', 6, yR, { size: 10.5, color: C.muted });
        kit.label(c, 'gateway', 6, yG, { size: 10.5, color: C.muted });
        kit.label(c, 'sensors', 6, yS, { size: 10.5, color: C.muted });
        // the channel axis
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(l.xL - 12, yAx); c.lineTo(l.xR + 12, yAx); c.stroke(); c.restore();
        for (let ch = 1; ch <= 13; ch++) {
          c.save(); c.strokeStyle = C.axis; c.beginPath(); c.moveTo(X(ch), yAx - 3); c.lineTo(X(ch), yAx + 3); c.stroke(); c.restore();
          kit.label(c, String(ch), X(ch), yAx + 12, { size: 10, color: [1, 6, 11].includes(ch) ? C.text2 : C.faint, align: 'center', weight: [1, 6, 11].includes(ch) ? 650 : 500 });
        }
        kit.label(c, 'Wi-Fi channel', l.xR + 12, yAx + 26, { size: 10, color: C.faint, align: 'right' });
        // the three kinds of device and their bands
        band(rc, yR + 22, kit.hue(212)); band(gc, yG + 22, kit.hue(140));
        const hue = kit.hue;
        S.node(c, X(rc), yR, { kind: 'router', r: 13, color: 212 });
        chText('ch ' + rc, X(rc), yR, 20);
        S.node(c, X(gc), yG, { kind: 'gateway', r: 13, color: 140, active: true });
        chText('ch ' + gc, X(gc), yG, 20);
        if (ctl.values.joined) S.link(c, X(gc), yG - 15, X(rc), yR + 15, { wireless: true, arrow: 'end', label: 'joined: follows the router', labelColor: C.muted });
        sensors.forEach((s, i) => {
          band(s.ch, yS + 22, hue(4));
          S.node(c, X(s.ch) + (i - 1) * 14, yS, { kind: 'esp', r: 9 });
        });
        kit.label(c, 'ch ' + sensors.map(s => s.ch).filter((v, i, a) => a.indexOf(v) === i).join(', '), X(sensors[0].ch), yS - 22, { size: 10.5, color: C.text2, align: 'center' });
        // frames in flight
        for (const p of packets) {
          const f = clamp((clock - p.t0) / 0.6, 0, 1);
          if (p.ok) { if (f < 1) S.msg(c, p.x1, p.y1, p.x2, p.y2, f, { color: C.ok, r: 3.5 }); }
          else if (f < 1) S.msg(c, p.x1, p.y1, p.x2, p.y2, Math.min(f, 0.55), { color: C.bad, r: 3.5 });
          else {
            const mx = p.x1 + (p.x2 - p.x1) * 0.55, my = p.y1 + (p.y2 - p.y1) * 0.55;
            c.save(); c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(mx - 4, my - 4); c.lineTo(mx + 4, my + 4); c.moveTo(mx + 4, my - 4); c.lineTo(mx - 4, my + 4); c.stroke(); c.restore();
          }
        }
        // the history of each sensor
        sensors.forEach((s, i) => {
          const y = H * 0.88 + i * 12;
          kit.label(c, 's' + (i + 1), 6, y, { size: 10, color: C.muted });
          s.hist.forEach((ok, k) => kit.dot(c, l.xL + k * 9, y, 3.4, ok ? C.ok : C.bad));
        });
        // the numbers
        const total = sensors.reduce((a, s) => a + s.hist.length, 0), good = sensors.reduce((a, s) => a + s.hist.filter(Boolean).length, 0);
        const same = sensors.filter(s => s.ch === gc).length;
        const verdict = same === 3 ? 'Same channel: frames arrive' : same === 0 ? (sensors.some(s => s.scanning) && ctl.values.hunt ? 'Searching: the sensors try one channel after another' : 'Different channels: nothing arrives') : 'Some sensors have found the gateway';
        kit.label(c, verdict, W / 2, yAx + 40, { size: 11.5, align: 'center', weight: 650, color: same === 3 ? C.ok : same === 0 && !(ctl.values.hunt && sensors.some(s => s.scanning)) ? C.bad : C.warn });
        ro.set('gw', String(gc) + (ctl.values.joined ? ' (pinned to the router)' : ' (idle: channel 1)'));
        ro.set('se', sensors.map(s => s.ch).join(', '));
        ro.set('ok', total ? good + ' of ' + total + ' (' + Math.round(100 * good / total) + ' %)' : '—');
        ro.set('v', verdict);
      }
      st.onResize(() => { if (!loop.running) draw(st.W, st.H); });
      loop.start();
    }
  });

  /* ================================================================ en-chain */
  Hyper.sim('en-chain', {
    title: 'Sensor, gateway, broker, dashboard',
    blurb: `A sensor sends a reading by ESP-NOW. The gateway acknowledges it (the **radio** does, at once), then publishes it to the MQTT broker, which passes it to a dashboard. Each dot is one reading; the counters show where readings end up.

**Try this**
- Leave everything running: every reading is told "delivered" and published.
- Untick **The broker is reachable**, with *No queue*: the sensor is still told "delivered" for every frame, but nothing reaches the dashboard. After a moment the dashboard shows **gateway offline**, which is what an MQTT last will does.
- Switch to *Queue of 8 in RAM*: eight readings wait, the rest are lost. Tick the broker on again and the queue drains.
- Press **Restart the gateway** with a RAM queue: the queue is lost, and frames that arrive during the restart are not even acknowledged. With the *flash* queue the waiting readings survive.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340, maxH: 480 });
      const ctl = kit.controls(box.side, [
        { id: 'broker', type: 'check', label: 'The broker is reachable', value: true },
        { id: 'queue', type: 'select', label: 'The gateway keeps…', options: [['No queue: drop what it cannot send', 'none'], ['A queue of 8 in RAM', 'ram'], ['A queue in flash (keeps all)', 'flash']], value: 'ram' },
        { id: 'every', label: 'The sensor sends every', min: 0.5, max: 5, step: 0.5, value: 1.5, unit: 's' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart the gateway', primary: true }, { id: 'reset', label: 'Reset the counters' }] }
      ], id => {
        if (id === 'restart') {
          gwDown = 3;
          if (ctl.values.queue === 'ram') { ct.lost += queue.length; queue.length = 0; }
        } else if (id === 'reset') {
          ct.sent = ct.told = ct.pub = ct.lost = 0; queue.length = 0; packets.length = 0; last = 0;
        }
        loop.once();
      });
      const ro = kit.readout(box.side, [['sent', 'Sent by the sensor'], ['told', 'Sensor was told "delivered"'], ['pub', 'Reached the broker'], ['wait', 'Waiting in the gateway'], ['lost', 'Lost'], ['dash', 'Dashboard shows']]);
      const ct = { sent: 0, told: 0, pub: 0, lost: 0 };
      const queue = [];
      let packets = [], clock = 0, nextSend = 0.5, drainAt = 0, gwDown = 0, offlineFor = 0, last = 0, seq = 0;
      const broker = () => !!ctl.values.broker;
      function send2(v) { packets.push({ stage: 2, t0: clock, dur: 0.5, v }); }
      function arrive(p) {
        if (p.stage === 1) {
          if (gwDown > 0) { ct.lost++; return; }
          ct.told++;
          const mode = ctl.values.queue;
          if (broker() && queue.length === 0) send2(p.v);
          else if (mode === 'none') ct.lost++;
          else if (mode === 'ram' && queue.length >= 8) ct.lost++;
          else queue.push(p.v);
        } else if (p.stage === 2) {
          if (!broker()) { ct.lost++; return; }
          ct.pub++;
          packets.push({ stage: 3, t0: clock, dur: 0.4, v: p.v });
        } else last = p.v;
      }
      const loop = kit.loop(dt => {
        clock += dt;
        if (gwDown > 0) gwDown = Math.max(0, gwDown - dt);
        if (clock >= nextSend) { seq++; ct.sent++; packets.push({ stage: 1, t0: clock, dur: 0.5, v: seq }); nextSend = clock + ctl.values.every; }
        for (const p of packets.slice()) if (clock - p.t0 >= p.dur) { packets.splice(packets.indexOf(p), 1); arrive(p); }
        if (broker() && gwDown <= 0 && queue.length && clock >= drainAt) { send2(queue.shift()); drainAt = clock + 0.3; }
        if (!broker() || gwDown > 0) offlineFor += dt; else offlineFor = 0;
        draw();
      }, box.stage);
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const r = clamp(W / 30, 12, 17), y = H * 0.3;
        const xs = [W * 0.1, W * 0.37, W * 0.63, W * 0.88];
        const down = gwDown > 0, offline = offlineFor > 2;
        S.link(c, xs[0] + r, y, xs[1] - r, y, { wireless: true, arrow: 'end', label: 'ESP-NOW', gap: 4 });
        S.link(c, xs[1] + r, y, xs[2] - r, y, { color: broker() ? C.muted : C.bad, arrow: 'end', label: broker() ? 'Wi-Fi · MQTT' : 'unreachable', labelColor: broker() ? C.muted : C.bad, gap: 4 });
        S.link(c, xs[2] + r, y, xs[3] - r, y, { color: C.muted, arrow: 'end', gap: 4 });
        S.node(c, xs[0], y, { kind: 'sensor', r, label: 'sensor', color: 4 });
        S.node(c, xs[1], y, { kind: 'gateway', r, label: 'gateway', sub: down ? 'restarting…' : 'online', color: 140, dim: down, active: !down });
        S.node(c, xs[2], y, { kind: 'broker', r, label: 'broker', color: broker() ? 212 : undefined, dim: !broker() });
        S.node(c, xs[3], y, { kind: 'laptop', r, label: 'dashboard', sub: offline ? 'gateway offline' : 'gateway online', color: offline ? 40 : 250 });
        // the readings in flight
        for (const p of packets) {
          const f = clamp((clock - p.t0) / p.dur, 0, 1), a = p.stage - 1;
          S.msg(c, xs[a] + r, y, xs[a + 1] - r, y, f, { color: p.stage === 1 ? C.accent : C.ok, r: 4 });
        }
        // the queue under the gateway
        const qy = H * 0.58, mode = ctl.values.queue, qx = xs[1];
        kit.label(c, mode === 'none' ? 'no queue' : mode === 'ram' ? 'queue in RAM (8)' : 'queue in flash', qx, qy - 18, { size: 10.5, color: C.muted, align: 'center' });
        if (mode === 'ram') {
          const sz = clamp(W / 40, 9, 15), x0 = qx - 4 * (sz + 2);
          for (let i = 0; i < 8; i++) {
            c.save(); c.fillStyle = i < queue.length ? C.accent : C.border2 || C.faint; c.globalAlpha = i < queue.length ? 0.9 : 0.35; c.fillRect(x0 + i * (sz + 2), qy, sz, sz); c.restore();
          }
        } else if (mode === 'flash') {
          const bw = clamp(W * 0.3, 90, 160);
          c.save(); c.strokeStyle = C.border2 || C.faint; c.lineWidth = 1; c.strokeRect(qx - bw / 2, qy, bw, 12);
          c.fillStyle = C.accent; c.globalAlpha = 0.85; c.fillRect(qx - bw / 2 + 1, qy + 1, Math.max(0, (bw - 2) * Math.min(1, queue.length / 40)), 10); c.restore();
        }
        kit.label(c, queue.length + ' waiting', qx, qy + 28, { size: 10.5, color: queue.length ? C.text2 : C.faint, align: 'center' });
        // a one-line summary
        const note = !broker() ? (mode === 'none' ? 'Broker away, nothing kept: lost, yet "delivered"' : 'Broker away: readings wait in the gateway') : down ? 'Gateway restarting: frames not acknowledged' : 'Everything is flowing';
        kit.label(c, note, W / 2, H - 22, { size: 11, color: !broker() || down ? C.warn : C.ok, align: 'center' });
        ro.set('sent', String(ct.sent));
        ro.set('told', String(ct.told));
        ro.set('pub', String(ct.pub));
        ro.set('wait', String(queue.length));
        ro.set('lost', String(ct.lost));
        ro.set('dash', last ? 'reading #' + last + (offline ? ' · gateway offline' : '') : 'nothing yet');
      }
      st.onResize(() => { if (!loop.running) draw(); });
      loop.start();
    }
  });

  /* ================================================================ en-mesh */
  Hyper.sim('en-mesh', {
    title: 'A mesh that heals',
    blurb: `The square node is the **root** (the gateway to the router). Every other node finds the route with the fewest hops to it; thick lines are the routes in use, faint lines are every pair that can hear each other. The number on a node is its **hop count**. Dots are messages travelling hop by hop towards the root.

**Try this**
- **Drag** a node: its range circle appears, and the routes redraw as you move.
- **Click** a node to switch it off (click again to revive it). Pick one that other nodes route through: they find another way, or become **cut off**.
- Shorten the **radio range** until the far nodes lose contact; then drag a node into the gap to bridge it.
- Read the last line of the numbers: with one radio on one channel, a node n hops away gets roughly 1/n of the rate of a node next to the root. That is a rule of thumb, not a measurement.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360, maxH: 520 });
      const M = 24, SPAN = 150;                // the stage is 150 m wide
      let nodes = [], packets = [], clock = 0, nextSend = 0.6, drag = -1, seed = 7;
      const ct = { sent: 0, done: 0, lost: 0 };
      const ctl = kit.controls(box.side, [
        { id: 'range', label: 'Radio range', min: 15, max: 80, step: 1, value: 38, unit: 'm' },
        { id: 'n', label: 'Nodes', min: 6, max: 18, step: 1, value: 12 },
        { id: 'hops', type: 'check', label: 'Show hop counts', value: true },
        { type: 'buttons', items: [{ id: 'burst', label: 'Send from every node', primary: true }, { id: 'again', label: 'New layout' }] }
      ], id => {
        if (id === 'n') layout();
        else if (id === 'again') { seed += 11; layout(); }
        else if (id === 'burst') { const net = route(); nodes.forEach((nd, i) => { if (i && net.hop[i] >= 0) launch(i, net); }); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['conn', 'Nodes connected to the root'], ['cut', 'Cut off'], ['deep', 'Deepest node'], ['avg', 'Average hops'], ['rate', 'Rate at the deepest node'], ['msg', 'Messages delivered / lost']]);
      function layout() {
        const n = Math.round(ctl.values.n), rnd = rngOf(seed), cols = Math.ceil(Math.sqrt(n * 1.6)), rows = Math.ceil((n - 1) / cols);
        nodes = [{ x: 0.06, y: 0.5, alive: true }];
        let k = 1;
        for (let r = 0; r < rows && k < n; r++) for (let q = 0; q < cols && k < n; q++) {
          nodes.push({ x: clamp(0.2 + (q + 0.5) / cols * 0.76 + (rnd() - 0.5) * 0.5 / cols, 0.03, 0.97), y: clamp(0.08 + (r + 0.5) / rows * 0.84 + (rnd() - 0.5) * 0.5 / rows, 0.05, 0.95), alive: true });
          k++;
        }
        packets = [];
      }
      const px = nd => ({ x: M + nd.x * (st.W - 2 * M), y: M + nd.y * (st.H - 2 * M) });
      const rangePx = () => ctl.values.range * st.W / SPAN;
      // the routes: hops from the root and each node's parent, over the nodes that are on and in range
      function route() {
        const n = nodes.length, P = nodes.map(px), R = rangePx(), hop = new Array(n).fill(-1), parent = new Array(n).fill(-1);
        const d = (a, b) => Math.hypot(P[a].x - P[b].x, P[a].y - P[b].y);
        if (nodes[0].alive) hop[0] = 0;
        const queue = nodes[0].alive ? [0] : [];
        for (let h = 0; h < queue.length; h++) {
          const v = queue[h];
          for (let w = 0; w < n; w++) if (nodes[w].alive && hop[w] < 0 && d(v, w) <= R) { hop[w] = hop[v] + 1; queue.push(w); }
        }
        for (let w = 1; w < n; w++) {
          if (hop[w] < 0) continue;
          let best = -1, bd = 1e9;
          for (let v = 0; v < n; v++) if (nodes[v].alive && hop[v] === hop[w] - 1 && d(v, w) <= R && d(v, w) < bd) { best = v; bd = d(v, w); }
          parent[w] = best;
        }
        return { hop, parent, P, R, d };
      }
      function launch(i, net) {
        const path = [i];
        while (path[path.length - 1] !== 0 && path.length < 30) { const p = net.parent[path[path.length - 1]]; if (p < 0) return; path.push(p); }
        packets.push({ path, t0: clock });
        ct.sent++;
      }
      kit.drag(st, {
        hover: true,
        hit(p) {
          let best = null, bd = 16;
          nodes.forEach((nd, i) => { const q = px(nd), dd = Math.hypot(q.x - p.x, q.y - p.y); if (dd < bd) { bd = dd; best = i; } });
          return best;
        },
        start(i) { drag = i; },
        move(i, p) { nodes[i].x = clamp((p.x - M) / (st.W - 2 * M), 0, 1); nodes[i].y = clamp((p.y - M) / (st.H - 2 * M), 0, 1); loop.once(); },
        end(i, p, moved) { drag = -1; if (!moved && i !== 0) nodes[i].alive = !nodes[i].alive; loop.once(); }
      });
      const loop = kit.loop(dt => {
        clock += dt;
        if (clock >= nextSend) {
          nextSend = clock + 1.1;
          const net = route(), alive = [];
          nodes.forEach((nd, i) => { if (i && net.hop[i] >= 0) alive.push(i); });
          if (alive.length) launch(alive[Math.floor(Math.random() * alive.length)], net);
        }
        draw();
      }, box.stage);
      function draw() {
        const c = st.begin(), C = kit.colors(), net = route(), P = net.P, n = nodes.length, HOP = 0.4;
        // every pair that can hear each other
        c.save(); c.strokeStyle = C.faint; c.globalAlpha = 0.25; c.lineWidth = 1;
        for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) if (nodes[a].alive && nodes[b].alive && net.d(a, b) <= net.R) { c.beginPath(); c.moveTo(P[a].x, P[a].y); c.lineTo(P[b].x, P[b].y); c.stroke(); }
        c.restore();
        // the routes in use
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.4; c.globalAlpha = 0.85;
        for (let w = 1; w < n; w++) if (net.parent[w] >= 0) { c.beginPath(); c.moveTo(P[w].x, P[w].y); c.lineTo(P[net.parent[w]].x, P[net.parent[w]].y); c.stroke(); }
        c.restore();
        // the range of the node being dragged
        if (drag >= 0 && nodes[drag]) { c.save(); c.strokeStyle = C.accent; c.setLineDash([4, 4]); c.globalAlpha = 0.6; c.beginPath(); c.arc(P[drag].x, P[drag].y, net.R, 0, Math.PI * 2); c.stroke(); c.restore(); }
        // messages hop by hop towards the root
        packets = packets.filter(pk => {
          const k = Math.floor((clock - pk.t0) / HOP);
          if (k >= pk.path.length - 1) { ct.done++; return false; }
          const a = pk.path[k], b = pk.path[k + 1];
          if (!nodes[a].alive || !nodes[b].alive || net.d(a, b) > net.R) { ct.lost++; return false; }
          S.msg(c, P[a].x, P[a].y, P[b].x, P[b].y, (clock - pk.t0) / HOP - k, { color: C.ok, r: 3.5 });
          return true;
        });
        // the nodes
        nodes.forEach((nd, i) => {
          const h = net.hop[i];
          if (i === 0) { S.node(c, P[i].x, P[i].y, { kind: 'gateway', r: 13, color: 212, dim: !nd.alive, label: 'root' }); return; }
          S.node(c, P[i].x, P[i].y, { kind: 'esp', r: 10, color: !nd.alive ? 0 : h >= 0 ? 140 : 40, dim: !nd.alive });
          if (!nd.alive) { c.save(); c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(P[i].x - 8, P[i].y - 8); c.lineTo(P[i].x + 8, P[i].y + 8); c.moveTo(P[i].x + 8, P[i].y - 8); c.lineTo(P[i].x - 8, P[i].y + 8); c.stroke(); c.restore(); }
          else if (ctl.values.hops) kit.label(c, h >= 0 ? String(h) : '?', P[i].x, P[i].y - 17, { size: 10.5, color: h >= 0 ? C.text : C.warn, align: 'center', weight: 650 });
        });
        // the numbers
        let conn = 0, cutOff = 0, deep = 0, sum = 0;
        nodes.forEach((nd, i) => { if (!i || !nd.alive) return; if (net.hop[i] >= 0) { conn++; sum += net.hop[i]; deep = Math.max(deep, net.hop[i]); } else cutOff++; });
        ro.set('conn', conn + ' of ' + (n - 1));
        ro.set('cut', cutOff ? cutOff + ' (marked ?)' : 'none');
        ro.set('deep', deep ? deep + (deep === 1 ? ' hop' : ' hops') : '—');
        ro.set('avg', conn ? fmt1(sum / conn) : '—');
        ro.set('rate', deep ? 'about 1/' + deep + ' of the one-hop rate' : '—');
        ro.set('msg', ct.done + ' / ' + ct.lost);
      }
      layout();
      st.onResize(() => { if (!loop.running) draw(); });
      loop.start();
    }
  });

  /* ================================================================ en-airtime */
  Hyper.sim('en-airtime', {
    title: 'What one message costs',
    blurb: `A battery sensor wakes, starts the radio, sends one ESP-NOW frame, waits for the acknowledgement and goes back to sleep. The four cards show each phase: its duration, the current the **catalogue** gives for the chip (receive current for the wake-up and the wait, transmit current for the frame, sleep current for the rest) and its **share of the energy** of one cycle.

The time to wake the chip and start Wi-Fi and ESP-NOW is **an assumption** you can change; it depends on the program, the board and whether the radio is already calibrated. The current of the wake-up phase is taken to be the chip's receive current, which is a rough stand-in.

**Try this**
- Look at the bars with the defaults: the **wake-up** takes nearly all the energy; the frame itself is a few percent.
- Raise the payload to 250 bytes: the transmit bar grows, but barely changes the average.
- Increase **transmissions per message** to 5 (a bad link): the cost of the radio rises, the wake-up is still the larger part.
- Make the message less frequent (log slider): the sleep current of the **board** starts to matter. Choose a coin cell and read the note.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 380, maxH: 520 });
      const ids = ['esp32-c3', 'esp32-s3', 'esp32', 'esp32-c6', 'esp32-s2', 'esp32-c2'].filter(id => E.chip(id));
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: ids.map(id => [E.chip(id).name, id]), value: ids[0] },
        { id: 'bytes', label: 'Payload', min: 1, max: 250, step: 1, value: 20, unit: 'bytes' },
        { id: 'rate', type: 'select', label: 'Data rate of the frame', options: [['1 Mbit/s (the default)', 1], ['6 Mbit/s', 6], ['24 Mbit/s', 24]], value: 1 },
        { id: 'wake', label: 'Wake, start Wi-Fi and ESP-NOW', min: 20, max: 400, step: 10, value: 150, unit: 'ms' },
        { id: 'tries', label: 'Transmissions per message', min: 1, max: 6, step: 1, value: 1 },
        { id: 'every', label: 'One message every', min: 1, max: 3600, step: 1, value: 60, unit: 's', log: true, sig: 2 },
        { id: 'cell', type: 'select', label: 'Battery', options: E.CELLS.map(x => [x.name, x.id]), value: 'aa2' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['air', 'Air time per message'], ['awake', 'Awake time per message'], ['avg', 'Average current'], ['life', 'Battery life'], ['msgs', 'Messages on one battery'], ['note', 'Note']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, v = ctl.values;
        const chip = E.chip(v.chip) || {}, rx = num(chip.rxMa, 80), tx = num(chip.txMa, 300), sleepMa = num(chip.sleepUa, 10) / 1000;
        const tries = Math.round(v.tries), air = E.espnowAirtime(v.bytes, v.rate) * tries, wake = v.wake / 1000, ack = 0.002 * tries;
        const awake = wake + air + ack, every = Math.max(v.every, awake), sleep = Math.max(0, every - awake);
        const phases = [
          { name: 'Wake and start the radio', s: wake, mA: rx, hue: 40 },
          { name: 'Transmit the frame' + (tries > 1 ? ' ×' + tries : ''), s: air, mA: tx, hue: 4 },
          { name: 'Wait for the acknowledgement', s: ack, mA: rx, hue: 212 },
          { name: 'Deep sleep', s: sleep, mA: sleepMa, hue: 250 }
        ];
        const dc = E.dutyCycle(phases.map(p => ({ mA: p.mA, s: p.s })));
        const cell = E.CELLS.find(x => x.id === v.cell) || E.CELLS[0];
        const life = E.batteryLife(cell.mAh, dc.avg, { cell: cell.id });
        // the four cards
        const wide = W >= 560, cols = wide ? 4 : 2, rows = wide ? 1 : 2, gap = 8, M = 10;
        const cw = (W - 2 * M - gap * (cols - 1)) / cols, chh = wide ? 74 : 62;
        const durText = s => (s >= 1 ? kit.fmt(s, 3) + ' s' : s >= 0.001 ? kit.fmt(s * 1000, 3) + ' ms' : kit.fmt(s * 1e6, 3) + ' µs');
        const curText = mA => (mA >= 1 ? kit.fmt(mA, 3) + ' mA' : kit.fmt(mA * 1000, 3) + ' µA');
        phases.forEach((p, i) => {
          const x = M + (i % cols) * (cw + gap), y = 12 + Math.floor(i / cols) * (chh + 34);
          S.box(c, x, y, cw, chh, { label: cut(p.name, Math.max(14, Math.floor(cw / 6.4))), sub: durText(p.s) + ' · ' + curText(p.mA), color: kit.hue(p.hue), size: 11.5 });
          const share = dc.share[i] || 0;
          c.save(); c.fillStyle = C.border2 || C.faint; c.globalAlpha = 0.4; c.fillRect(x, y + chh + 6, cw, 8); c.restore();
          c.save(); c.fillStyle = kit.hue(p.hue); c.fillRect(x, y + chh + 6, Math.max(1.5, cw * share), 8); c.restore();
          kit.label(c, (share >= 0.1 ? Math.round(share * 100) : kit.fmt(share * 100, 2)) + ' % of the energy', x, y + chh + 24, { size: 10.5, color: C.text2 });
        });
        // one cycle to scale: the transmission is the thin line
        const sy = 12 + rows * (chh + 34) + 14, sx = M, sw = W - 2 * M;
        kit.label(c, 'One wake-up, drawn to scale (without the sleep)', sx, sy, { size: 10.5, color: C.muted });
        let xx = sx;
        phases.slice(0, 3).forEach((p, i) => {
          const w = Math.max(2, sw * p.s / awake);
          c.save(); c.fillStyle = kit.hue(p.hue); c.fillRect(xx, sy + 10, w, 16); c.restore();
          xx += w;
        });
        kit.label(c, 'wake-up ' + durText(wake), sx + 4, sy + 40, { size: 10, color: C.text2 });
        kit.label(c, 'frame ' + durText(air) + ' (the thin red line)', sx + sw, sy + 40, { size: 10, color: C.bad, align: 'right' });
        // the battery
        const by = sy + 62;
        S.battery(c, M, by, 52, 22, 0.8);
        kit.label(c, cell.name, M + 62, by + 6, { size: 11, color: C.text2 });
        kit.label(c, 'average ' + curText(dc.avg) + ' → ' + (life.years >= 1 ? fmt1(life.years) + ' years' : fmt1(life.days) + ' days'), M + 62, by + 22, { size: 12, weight: 650 });
        // the numbers
        ro.set('air', durText(air) + (tries > 1 ? ' (' + tries + ' frames)' : ''));
        ro.set('awake', durText(awake));
        ro.set('avg', curText(dc.avg));
        ro.set('life', isFinite(life.years) ? (life.years >= 1 ? fmt1(life.years) + ' years' : fmt1(life.days) + ' days') + ' (with ' + cell.mAh + ' mAh, 80 % usable)' : '—');
        ro.set('msgs', isFinite(life.hours) ? kit.fmt(life.hours * 3600 / every, 3) : '—');
        ro.set('note', cell.id === 'cr2032' ? 'A coin cell cannot give ' + curText(tx) + ': the frame would collapse the supply.' : v.every < awake ? 'The interval is shorter than the awake time: the board never sleeps.' : sleepMa > 0.02 ? 'The chip sleeps at ' + curText(sleepMa) + '; a whole board often needs far more.' : 'The board\'s own sleep current is often larger than the chip\'s.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ en-timesync */
  Hyper.sim('en-timesync', {
    title: 'Four timestamps, one clock offset',
    blurb: `Time runs **down** the picture. A asks (t₁, read on A's clock), B receives it (t₂) and replies (t₃), A receives the reply (t₄). The two clocks differ by an unknown **offset**; the exchange finds it. The thin dashed path is what the formula **assumes**: the same delay each way.

**Try this**
- Make the two delays equal (12 ms and 12 ms): the estimate is exact, whatever the offset.
- Make them different (5 ms out, 35 back): the error is half the difference, and never more than half the round trip.
- Add **random variation** and press *Run an exchange* several times: the estimate wanders, and the one with the **smallest round trip** is nearest the truth.
- Raise the **clock rate error** and read how soon the two boards must be corrected again for the error you accept.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 400, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'offset', label: 'True offset of B\'s clock', min: -500, max: 500, step: 10, value: 250, unit: 'ms' },
        { id: 'out', label: 'Delay from A to B', min: 1, max: 40, step: 1, value: 12, unit: 'ms' },
        { id: 'back', label: 'Delay from B to A', min: 1, max: 40, step: 1, value: 14, unit: 'ms' },
        { id: 'turn', label: 'B holds the message for', min: 1, max: 20, step: 1, value: 5, unit: 'ms' },
        { id: 'jitter', label: 'Random variation of each delay', min: 0, max: 20, step: 1, value: 0, unit: 'ms' },
        { id: 'ppm', label: 'Clock rate error of B', min: 0, max: 100, step: 1, value: 20, unit: 'ppm' },
        { id: 'accept', label: 'Error you accept', min: 1, max: 100, step: 1, value: 5, unit: 'ms' },
        { id: 'auto', type: 'check', label: 'Repeat the exchange every 1.5 s', value: false },
        { type: 'buttons', items: [{ id: 'run', label: 'Run an exchange', primary: true }, { id: 'clear', label: 'Clear the samples' }] }
      ], id => {
        if (id === 'run') run();
        else if (id === 'clear') samples = [];
        else if (id !== 'auto') { samples = []; }
        compute(); loop.start();
      });
      const ro = kit.readout(box.side, [['t', 'Readings t₁ · t₂ · t₃ · t₄'], ['est', 'Estimated offset θ'], ['true', 'True offset'], ['err', 'Error of this estimate'], ['rtt', 'Round trip δ, so the error is under'], ['best', 'Best of the last 8 (smallest δ)'], ['mean', 'Average of the last 8'], ['drift', 'Re-synchronise about every']]);
      let jo = 0, jb = 0, samples = [], x = null, anim = 9, clock = 0, nextAuto = 0;
      // one exchange with the stored random variation
      function exchange() {
        const v = ctl.values, out = Math.max(0.5, v.out + jo), back = Math.max(0.5, v.back + jb), t1 = 1000;
        const t2 = t1 + out + v.offset, t3 = t2 + v.turn, t4 = t1 + out + v.turn + back;
        const est = ((t2 - t1) + (t3 - t4)) / 2, rtt = (t4 - t1) - (t3 - t2);
        return { out, back, t1, t2, t3, t4, est, rtt, err: est - v.offset, true: v.offset };
      }
      function compute() { x = exchange(); }
      function run() {
        const j = ctl.values.jitter;
        jo = (Math.random() * 2 - 1) * j; jb = (Math.random() * 2 - 1) * j;
        compute();
        samples.push({ est: x.est, rtt: x.rtt, err: x.err });
        if (samples.length > 8) samples.shift();
        anim = 0;
      }
      const loop = kit.loop(dt => {
        clock += dt;
        if (anim < 2) anim += dt;
        if (ctl.values.auto && clock >= nextAuto) { nextAuto = clock + 1.5; run(); }
        draw();
        if (anim >= 2 && !ctl.values.auto) loop.stop();
      }, box.stage);
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, v = ctl.values;
        if (!x) compute();
        const narrow = W < 520, xa = W * (narrow ? 0.24 : 0.25), xb = W * (narrow ? 0.76 : 0.75), nr = clamp(W / 38, 11, 16);
        const y0 = 16 + nr + 30, total = x.out + v.turn + x.back, span = Math.max(50, total * 1.25), sc = (H - y0 - 22) / span, Y = t => y0 + t * sc;
        S.node(c, xa, 16 + nr, { kind: 'esp', r: nr, label: 'A', color: 212 });
        S.node(c, xb, 16 + nr, { kind: 'esp', r: nr, label: 'B', color: 140 });
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 5]);
        for (const lx of [xa, xb]) { c.beginPath(); c.moveTo(lx, y0 - 8); c.lineTo(lx, y0 + span * sc); c.stroke(); }
        c.restore();
        // what the formula assumes: the same delay each way
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.setLineDash([4, 4]); c.globalAlpha = 0.8;
        c.beginPath(); c.moveTo(xa, Y(0)); c.lineTo(xb, Y(x.rtt / 2)); c.moveTo(xb, Y(x.rtt / 2 + v.turn)); c.lineTo(xa, Y(x.rtt + v.turn)); c.stroke();
        c.restore();
        // what really happens
        const pts = [[xa, Y(0)], [xb, Y(x.out)], [xb, Y(x.out + v.turn)], [xa, Y(total)]];
        c.save(); c.strokeStyle = C.accent; c.fillStyle = C.accent; c.lineWidth = 2;
        c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); c.lineTo(pts[1][0], pts[1][1]); c.stroke();
        c.beginPath(); c.moveTo(pts[2][0], pts[2][1]); c.lineTo(pts[3][0], pts[3][1]); c.stroke();
        c.lineWidth = 5; c.globalAlpha = 0.6; c.beginPath(); c.moveTo(pts[1][0], pts[1][1]); c.lineTo(pts[2][0], pts[2][1]); c.stroke();
        c.restore();
        for (const k of [1, 3]) kit.dot(c, pts[k][0], pts[k][1], 3.5, C.accent);
        for (const k of [0, 2]) kit.dot(c, pts[k][0], pts[k][1], 3.5, C.accent);
        // the readings
        const f1 = n => n.toFixed(1);
        kit.label(c, 't₁ ' + f1(x.t1), xa - 8, pts[0][1], { size: 10.5, align: 'right', weight: 650 });
        kit.label(c, 't₄ ' + f1(x.t4), xa - 8, pts[3][1], { size: 10.5, align: 'right', weight: 650 });
        kit.label(c, 't₂ ' + f1(x.t2), xb + 8, pts[1][1], { size: 10.5, weight: 650 });
        kit.label(c, 't₃ ' + f1(x.t3), xb + 8, pts[2][1] + 4, { size: 10.5, weight: 650 });
        kit.label(c, 'request ' + f1(x.out) + ' ms', (pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2 - 8, { size: 10, color: C.text2, align: 'center', bg: C.dark ? 'rgba(13,16,32,.7)' : 'rgba(255,255,255,.75)' });
        kit.label(c, 'reply ' + f1(x.back) + ' ms', (pts[2][0] + pts[3][0]) / 2, (pts[2][1] + pts[3][1]) / 2 - 8, { size: 10, color: C.text2, align: 'center', bg: C.dark ? 'rgba(13,16,32,.7)' : 'rgba(255,255,255,.75)' });
        kit.label(c, 'dashed: equal delays assumed', W / 2, y0 + span * sc + 10, { size: 10, color: C.muted, align: 'center' });
        // the travelling message
        if (anim < 2) {
          const f = anim / 2, seg = f < 0.45 ? [pts[0], pts[1], f / 0.45] : f < 0.55 ? [pts[1], pts[2], (f - 0.45) / 0.1] : [pts[2], pts[3], (f - 0.55) / 0.45];
          S.msg(c, seg[0][0], seg[0][1], seg[1][0], seg[1][1], clamp(seg[2], 0, 1), { color: C.ok, r: 4.5 });
        }
        // the numbers
        const last8 = samples.slice(-8), best = last8.length ? last8.reduce((a, b) => (b.rtt < a.rtt ? b : a)) : null;
        const mean = last8.length ? last8.reduce((a, b) => a + b.err, 0) / last8.length : null;
        const sign = n => (n >= 0 ? '+' : '−') + Math.abs(n).toFixed(1) + ' ms';
        ro.set('t', [x.t1, x.t2, x.t3, x.t4].map(f1).join(' · ') + ' ms');
        ro.set('est', f1(x.est) + ' ms');
        ro.set('true', f1(x.true) + ' ms');
        ro.set('err', sign(x.err));
        ro.set('rtt', f1(x.rtt) + ' ms: ± ' + f1(x.rtt / 2) + ' ms');
        ro.set('best', best ? 'error ' + sign(best.err) + ' (δ ' + f1(best.rtt) + ' ms, of ' + last8.length + ')' : 'run an exchange');
        ro.set('mean', mean != null ? 'error ' + sign(mean) : 'run an exchange');
        ro.set('drift', v.ppm > 0 ? kit.fmt(1000 * v.accept / v.ppm, 3) + ' s for ' + v.accept + ' ms at ' + v.ppm + ' ppm' : 'never: no drift');
      }
      compute();
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
