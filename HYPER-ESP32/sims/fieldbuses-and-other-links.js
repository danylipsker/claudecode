/* HYPER-ESP32 · sims/fieldbuses-and-other-links.js
 *
 * Simulations of "CAN, RS-485, USB and Ethernet" (topic code fb). Waveforms come from kit.esp.proto and the same
 * arithmetic the pages quote.
 *
 *   fb-can-frame        a CAN frame field by field: identifier, length, data, CRC-15, bit stuffing, acknowledge
 *   fb-can-arbitration  three nodes start together: the bus is a wired AND and the lowest identifier wins
 *   fb-rs485-bus        an RS-485 line: reflections, termination, length, speed, and the idle bus with and without bias
 *   fb-modbus           a Modbus RTU request and reply: bytes, CRC-16, the direction pin, collisions
 *   fb-usb              USB on the chips, what the computer sees from a device, and the enumeration steps as host or device
 *   fb-differential     noise and a ground offset on a single wire against a differential pair
 *   fb-i2s              the three I2S wires for a stereo sample, with the clock arithmetic
 *   fb-dmx-midi         a DMX512 packet (break, start code, slots) and a MIDI message at 31 250 baud
 *   fb-parallel         a parallel write cycle (8 or 16 bits and a write strobe) and the frame rate it allows
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- helpers */
  const hex2 = v => (v & 255).toString(16).toUpperCase().padStart(2, '0');
  const hexN = (v, n) => '0x' + (v >>> 0).toString(16).toUpperCase().padStart(n, '0');
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const fmtT = s => {
    const a = Math.abs(s);
    if (a >= 1) return +s.toPrecision(3) + ' s';
    if (a >= 1e-3) return +(s * 1e3).toPrecision(3) + ' ms';
    if (a >= 1e-6) return +(s * 1e6).toPrecision(3) + ' µs';
    return +(s * 1e9).toPrecision(3) + ' ns';
  };
  const fmtBytes = a => a.map(hex2).join(' ');
  // translucent fills for decoded marks, readable on both themes
  const TINT = {
    grey: 'rgba(150,156,190,.34)', blue: 'rgba(123,140,255,.40)', purple: 'rgba(214,100,200,.36)', green: 'rgba(34,179,122,.36)',
    amber: 'rgba(224,160,48,.42)', teal: 'rgba(60,190,200,.34)', red: 'rgba(229,72,77,.50)'
  };
  const levelAt = (edges, t) => { let v = edges.length ? edges[0][1] : 1; for (const e of edges) { if (e[0] > t) break; v = e[1]; } return v; };
  // the part of an edge list inside [t0, t1], with the level that holds at t0 -> { edges, idle }
  const clip = (edges, t0, t1) => ({ idle: levelAt(edges, t0), edges: edges.filter(e => e[0] > t0 && e[0] < t1) });
  // a paragraph that wraps at maxW (returns the number of lines)
  function para(kit, c, text, x, y, maxW, lh, o) {
    o = o || {};
    c.save();
    c.font = (o.weight || 500) + ' ' + (o.size || 12) + 'px sans-serif';
    const lines = [];
    let line = '';
    for (const w of String(text).split(' ')) {
      const t = line ? line + ' ' + w : w;
      if (c.measureText(t).width > maxW * 0.94 && line) { lines.push(line); line = w; } else line = t;
    }
    if (line) lines.push(line);
    c.restore();
    lines.forEach((l, i) => kit.label(c, l, x, y + i * lh, o));
    return lines.length;
  }
  // a row of colour keys that wraps: items [[tint, text], …] -> the y after the last row
  function legend(kit, c, items, x, y, maxW) {
    let px = x;
    c.save(); c.font = '500 11px sans-serif';
    const widths = items.map(it => c.measureText(it[1]).width + 26);
    c.restore();
    items.forEach((it, i) => {
      if (px + widths[i] > x + maxW && px > x) { px = x; y += 16; }
      c.fillStyle = it[0]; c.fillRect(px, y - 5, 12, 10);
      kit.label(c, it[1], px + 17, y, { size: 11, color: kit.colors().text2 });
      px += widths[i];
    });
    return y + 16;
  }

  /* ================================================================ fb-can-frame */
  const CAN_TINT = { SOF: TINT.grey, ID: TINT.blue, ctrl: TINT.purple, DLC: TINT.purple, DATA: TINT.green, CRC: TINT.amber, ACK: TINT.teal, EOF: TINT.grey, stuff: TINT.red };
  const canData = (kind, n) => Array.from({ length: n }, (_, i) => kind === 'zero' ? 0 : kind === 'ff' ? 0xFF : kind === 'alt' ? (i % 2 ? 0xAA : 0x55) : kind === 'count' ? i + 1 : [0xAB, 0xCD, 0xEF, 0x01, 0x23, 0x45, 0x67, 0x89][i]);
  function canGroup(b) {
    if (b.stuffed) return 'stuff';
    const f = b.field;
    return f === 'RTR' || f === 'IDE' || f === 'r0' ? 'ctrl' : f === 'CRC del' || f === 'ACK' || f === 'ACK del' ? 'ACK' : f;
  }
  // bits -> merged marks for the logic analyser
  function canMarks(bits, rowT0, rowT1) {
    const out = [];
    let cur = null;
    for (const b of bits) {
      if (b.t1 <= rowT0 || b.t0 >= rowT1) { cur = null; continue; }
      const g = canGroup(b);
      if (cur && cur.g === g && g !== 'stuff') cur.t1 = b.t1;
      else { cur = { g, t0: b.t0, t1: b.t1 }; out.push(cur); }
    }
    return out.map(m => ({ t0: m.t0, t1: m.t1, text: m.g === 'stuff' ? 's' : m.g === 'DLC' ? 'len' : m.g === 'DATA' ? 'data' : m.g === 'ACK' ? 'ack' : m.g, color: CAN_TINT[m.g] }));
  }
  function canBuild(P, id, n, pat, rate, ack) {
    const data = canData(pat, n);
    const f = P.can(id, data, { bitrate: rate });
    const bits = f.bits.map(b => Object.assign({}, b));
    if (!ack) { const a = bits.find(b => b.field === 'ACK'); if (a) a.v = 1; }
    const tb = 1 / rate;
    const edges = [[-tb, 1]];
    let lv = 1;
    for (const b of bits) { if (b.v !== lv) { edges.push([b.t0, b.v]); lv = b.v; } }
    if (lv !== 1) edges.push([bits[bits.length - 1].t1, 1]);
    return { f, bits, edges, data, tb };
  }
  Hyper.sim('fb-can-frame', {
    title: 'A CAN frame, bit by bit',
    blurb: `The trace is the bus as a logic analyser sees it, cut into rows so the bits stay wide enough to read. Colours mark the fields; **red bits are stuffed bits**, inserted after five equal bits and removed again by every receiver.

**Try this**
- Set the data to **all zeros** and then to **0x55 0xAA**: the first needs a dozen or more stuffed bits, the alternating pattern hardly any, so the frame is clearly longer.
- Move the **identifier**: the first bits of the identifier always go out first, which is why a low number wins arbitration.
- Raise the **data bytes** from 0 to 8 and read the frame time at 125 kbit/s and at 1 Mbit/s.
- Untick **another node acknowledges**: the acknowledge slot stays recessive and the sender sees an error.`,
    mount(box, kit, params) {
      params = params || {};
      const E = kit.esp, S = kit.esym, P = E.proto;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'id', label: 'Identifier', min: 0, max: 2047, step: 1, value: params.id != null ? params.id : 0x123, fmt: v => hexN(Math.round(v), 3) },
        { id: 'n', label: 'Data bytes', min: 0, max: 8, step: 1, value: params.n != null ? params.n : 2 },
        { id: 'pat', type: 'select', label: 'Data', options: [['0xAB 0xCD …', 'abcd'], ['all zeros', 'zero'], ['all 0xFF', 'ff'], ['0x55 0xAA alternating', 'alt'], ['counting 1, 2, 3 …', 'count']], value: 'abcd' },
        { id: 'rate', type: 'select', label: 'Bit rate', options: [['125 kbit/s', 125e3], ['250 kbit/s', 250e3], ['500 kbit/s', 500e3], ['1 Mbit/s', 1e6]], value: 500e3 },
        { id: 'ack', type: 'check', label: 'Another node acknowledges', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['id', 'Identifier'], ['bits', 'Bits on the wire'], ['time', 'Frame time'], ['crc', 'CRC-15'], ['load', 'Share of the bus'], ['ack', 'Acknowledge']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const id = Math.round(ctl.values.id) & 0x7FF, n = Math.round(ctl.values.n), rate = ctl.values.rate;
        const fr = canBuild(P, id, n, ctl.values.pat, rate, ctl.values.ack);
        const N = fr.bits.length, nr = st.W < 520 ? 3 : 2, span = Math.ceil(N / nr), M = 8, W = st.W - 2 * M;
        const legendH = st.W < 520 ? 56 : 40;
        const rowH = Math.max(60, Math.floor((st.H - legendH - 6) / nr));
        for (let r = 0; r < nr; r++) {
          const t0 = r * span * fr.tb, t1 = t0 + span * fr.tb, k = clip(fr.edges, t0, t1);
          S.logic(c, M, 4 + r * rowH, W, rowH, [{ label: 'bus', edges: k.edges, idle: k.idle, marks: canMarks(fr.bits, t0, t1) }], { t0, t1, labelW: 34, grid: span });
        }
        legend(kit, c, [[TINT.grey, 'start · end'], [TINT.blue, 'identifier'], [TINT.purple, 'control · length'], [TINT.green, 'data'], [TINT.amber, 'CRC'], [TINT.teal, 'acknowledge'], [TINT.red, 'stuffed bit']], M, 4 + nr * rowH + 10, W);
        const timeBits = N + 3, t = timeBits * fr.tb;
        ro.set('id', hexN(id, 3) + '  =  ' + id.toString(2).padStart(11, '0').replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3'));
        ro.set('bits', (N - fr.f.stuffed) + ' + ' + fr.f.stuffed + ' stuffed = ' + N + ', then a gap of 3');
        ro.set('time', fmtT(t) + ' at ' + (rate / 1000) + ' kbit/s');
        ro.set('crc', hexN(fr.f.crc, 4) + (n ? '   data ' + fmtBytes(fr.data) : '   (no data)'));
        ro.set('load', 'sent every 10 ms: ' + kit.fmt(t / 0.010 * 100, 3) + ' %');
        ro.set('ack', ctl.values.ack ? 'a receiver pulled the slot dominant' : 'nobody did: ACK error, the sender retries');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ fb-can-arbitration */
  Hyper.sim('fb-can-arbitration', {
    title: 'Arbitration: the lowest identifier wins',
    blurb: `Three nodes start a frame at the same instant. Each sends its identifier and **reads the bus at every bit**. The bus is dominant (0) whenever any node sends 0, so a node that sends recessive (1) but reads 0 has lost: it stops and waits. The last one standing sends its whole frame, undamaged.

**Try this**
- Give two nodes identifiers that differ only in the last bit: they stay together almost to the end of the identifier.
- Make one identifier **0x000**: nothing can beat it.
- Give two nodes the **same identifier**: the arbitration cannot separate them. Real networks must never allow it.
- Untick node C and move A and B until A wins by the third bit.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym, P = E.proto;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'Node A identifier', min: 0, max: 2047, step: 1, value: 0x123, fmt: v => hexN(Math.round(v), 3) },
        { id: 'b', label: 'Node B identifier', min: 0, max: 2047, step: 1, value: 0x0F5, fmt: v => hexN(Math.round(v), 3) },
        { id: 'c', label: 'Node C identifier', min: 0, max: 2047, step: 1, value: 0x3A0, fmt: v => hexN(Math.round(v), 3) },
        { id: 'useC', type: 'check', label: 'Node C takes part', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['win', 'Winner'], ['lost', 'Losers'], ['note', 'Note']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const tb = 2e-6;
        const nodes = [['A', Math.round(ctl.values.a) & 0x7FF], ['B', Math.round(ctl.values.b) & 0x7FF]];
        if (ctl.values.useC) nodes.push(['C', Math.round(ctl.values.c) & 0x7FF]);
        const frames = nodes.map(nd => P.can(nd[1], [], { bitrate: 1 / tb }));
        // the bits up to a little after the last identifier bit
        let last = 0;
        for (const f of frames) f.bits.forEach((b, i) => { if (b.field === 'ID' && i > last) last = i; });
        const K = Math.min(frames[0].bits.length, last + 4);
        const active = nodes.map(() => true), lostAt = nodes.map(() => -1), bus = [], own = nodes.map(() => []);
        for (let k = 0; k < K; k++) {
          const vals = nodes.map((nd, i) => (active[i] ? frames[i].bits[k].v : 1));
          const b = Math.min(...vals);
          bus.push(b);
          nodes.forEach((nd, i) => { own[i].push(vals[i]); if (active[i] && vals[i] === 1 && b === 0) { active[i] = false; lostAt[i] = k; } });
        }
        const alive = nodes.map((nd, i) => i).filter(i => active[i]);
        const winner = alive.length ? alive[0] : 0;
        const edgesOf = arr => { const e = [[-tb, 1]]; let lv = 1; arr.forEach((v, k) => { if (v !== lv) { e.push([k * tb, v]); lv = v; } }); return e; };
        const M = 8, W = st.W - 2 * M, t1 = K * tb;
        const traces = nodes.map((nd, i) => {
          const marks = [];
          if (lostAt[i] >= 0) marks.push({ t0: lostAt[i] * tb, t1: t1, text: 'lost: listens', color: TINT.red });
          else if (alive.length === 1) marks.push({ t0: 0, t1: t1, text: 'wins', color: TINT.green });
          return { label: 'node ' + nd[0], edges: edgesOf(own[i]), marks };
        });
        const wf = frames[winner].bits;
        const busMarks = bus.map((v, k) => ({ t0: k * tb, t1: (k + 1) * tb, text: String(v), color: wf[k].stuffed ? TINT.red : (wf[k].field === 'SOF' ? TINT.grey : wf[k].field === 'ID' ? TINT.blue : TINT.purple) }));
        traces.push({ label: 'bus', edges: edgesOf(bus), marks: busMarks });
        S.logic(c, M, 4, W, st.H - 52, traces, { t0: 0, t1, labelW: 52, grid: K });
        legend(kit, c, [[TINT.grey, 'start'], [TINT.blue, 'identifier bit'], [TINT.red, 'stuffed bit'], [TINT.purple, 'control bits']], M, st.H - 30, W);
        const same = nodes.some((a, i) => nodes.some((b, j) => j > i && a[1] === b[1]));
        ro.set('win', alive.length === 1 ? 'node ' + nodes[winner][0] + ', identifier ' + hexN(nodes[winner][1], 3) : same ? 'nobody: equal identifiers' : 'node ' + nodes[winner][0]);
        ro.set('lost', nodes.map((nd, i) => lostAt[i] >= 0 ? nd[0] + ' at bit ' + (lostAt[i] + 1) : '').filter(Boolean).join(' · ') || '—');
        ro.set('note', same ? 'Two nodes with one identifier cannot be told apart: they would collide in the data field.' : 'The lowest identifier wins; the others retry after the frame.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ fb-rs485-bus */
  // a transmission line with a low-impedance driver at one end and a load at the other. Schematic: the numbers are the textbook model.
  function lineModel(L, tr, termL, termR) {
    const Z0 = 120, tau = 5e-9 * L, Rraw = 10;
    const Rs = termL ? Rraw * Z0 / (Rraw + Z0) : Rraw;          // the driver, with its own terminator in parallel
    const RL = termR ? 118.8 : 12000;                            // the terminator with the receivers, or the receivers alone
    const gs = (Rs - Z0) / (Rs + Z0), gl = (RL - Z0) / (RL + Z0), v1 = Z0 / (Z0 + Rs);
    const rInf = (1 + gl) * v1 / (1 - gl * gs);
    const step = x => {                                          // far-end response to a unit step at x = 0, summed over the bounces
      let sum = 0, g = 1;
      for (let k = 0; k < 80; k++) {
        const arrive = (2 * k + 1) * tau;
        if (x <= arrive) break;
        sum += (1 + gl) * v1 * g * clamp((x - arrive) / Math.max(tr, 1e-12), 0, 1);
        g *= gl * gs;
        if (Math.abs(g) < 1e-4) break;
      }
      return sum;
    };
    return { tau, gs, gl, rInf, step, tauC: 1e-9 * L };
  }
  // the voltage at the far end as [[t, v], …]: edges [[time, change of the sign ±2]], starting sign s0, amplitude A volts; the cable rounds the edges
  function farSeries(m, edges, s0, A, t0, t1, n) {
    const out = [], dt = (t1 - t0) / n;
    let y = null;
    for (let i = 0; i <= n; i++) {
      const t = t0 + i * dt;
      let v = s0 * m.rInf;
      for (const e of edges) if (t > e[0]) v += e[1] * m.step(t - e[0]);
      v *= A;
      y = y == null ? v : y + (v - y) * (1 - Math.exp(-dt / Math.max(m.tauC, 1e-12)));
      out.push([t, y]);
    }
    return out;
  }
  const NOISE = Array.from({ length: 8 }, (_, i) => ({ f: 700 + 900 * i + 137 * ((i * i) % 5), ph: i * 2.399, a: 1 / (1 + 0.15 * i) }));
  const NOISE_SUM = NOISE.reduce((s, c) => s + c.a, 0);
  const noiseAt = (t, amp) => amp * NOISE.reduce((s, c) => s + c.a * Math.sin(2 * Math.PI * c.f * t + c.ph), 0) / NOISE_SUM;

  Hyper.sim('fb-rs485-bus', {
    title: 'An RS-485 line: reflections, termination and bias',
    blurb: `The top picture is the bus: four nodes on a trunk of twisted pair, the talker on the left, a 120 Ω terminator at each end if ticked. The graph is the voltage **A − B** at the far receiver, with the receiver's ±0.2 V threshold shaded. A dot at the middle of each bit is green when the bit is read correctly and red when it is not. (The line is the textbook model: schematic, not a measurement.)

**Try this**
- Untick both terminators at **30 m** and **1 Mbit/s**: reflections ring through the threshold. Tick them and the trace is clean.
- At **9.6 kbit/s** the unterminated line still works: the ringing dies out long before the middle of the bit.
- Choose **One edge, zoomed** to see the overshoot and ringing itself, and compare the slew-limited driver.
- At **1200 m** raise the speed from 9.6 kbit/s upwards: length times speed is the limit.
- In **Idle bus**, tick and untick the bias and raise the noise: without bias the receiver invents characters.`,
    mount(box, kit, params) {
      params = params || {};
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 420, maxH: 620 });
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['A bit stream at the far end', 'bits'], ['One edge, zoomed in', 'edge'], ['The idle bus', 'idle']], value: params.view || 'bits' },
        { id: 'len', label: 'Cable length', min: 1, max: 1200, value: params.len || 30, unit: 'm', log: true, sig: 3 },
        { id: 'rate', type: 'select', label: 'Speed', options: [['9.6 kbit/s', 9600], ['115.2 kbit/s', 115200], ['1 Mbit/s', 1e6], ['10 Mbit/s', 10e6]], value: params.rate || 115200 },
        { id: 'edge', type: 'select', label: 'Driver', options: [['fast edges (20 ns)', 20e-9], ['slew-limited (1 µs)', 1e-6]], value: 20e-9 },
        { id: 'tl', type: 'check', label: 'Terminator at the talker\'s end', value: params.tl !== false },
        { id: 'tr', type: 'check', label: 'Terminator at the far end', value: params.tr !== false },
        { id: 'bias', type: 'check', label: 'Bias resistors', value: false },
        { id: 'noise', label: 'Noise on the line', min: 0, max: 1, value: 0.4, unit: 'V' }
      ], () => { sync(); loop.once(); });
      const ro = kit.readout(box.side, [['a', 'One-way delay'], ['b', 'Edge time'], ['c', 'Result'], ['d', 'Rule of thumb']]);
      const sync = () => {
        const idle = ctl.values.view === 'idle';
        ctl.show('len', !idle); ctl.show('rate', ctl.values.view === 'bits'); ctl.show('edge', !idle); ctl.show('bias', idle); ctl.show('noise', idle);
      };
      sync();
      const PAT = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const M = 8, W = st.W - 2 * M, view = ctl.values.view, L = ctl.values.len, tl = ctl.values.tl, trm = ctl.values.tr;
        // ---- the bus
        const topH = Math.round(st.H * 0.34), x0 = M + 22, x1 = M + W - 22, yA = 26, yB = 40;
        c.save(); c.strokeStyle = C.text2; c.lineWidth = 2.4;
        for (const y of [yA, yB]) { c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); }
        c.restore();
        kit.label(c, 'A', x0 - 12, yA, { size: 11, color: C.muted, align: 'center' }); kit.label(c, 'B', x0 - 12, yB, { size: 11, color: C.muted, align: 'center' });
        [[x0, tl], [x1, trm]].forEach(([x, on]) => {
          c.save(); c.strokeStyle = on ? C.accent : C.faint; c.lineWidth = on ? 2.4 : 1.4; if (!on) c.setLineDash([3, 3]);
          c.strokeRect(x - 4, yA + 2, 8, yB - yA - 4);
          c.restore();
          kit.label(c, on ? '120 Ω' : 'open', x, yB + 12, { size: 10.5, color: on ? C.accent : C.faint, align: 'center' });
        });
        const nodeX = [0.14, 0.38, 0.62, 0.86].map(f => x0 + (x1 - x0) * f), bw = Math.min(70, W * 0.16), by = yB + 28;
        nodeX.forEach((x, i) => {
          c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.6;
          c.beginPath(); c.moveTo(x - 6, yA); c.lineTo(x - 6, by); c.moveTo(x + 6, yB); c.lineTo(x + 6, by); c.stroke(); c.restore();
          S.box(c, x - bw / 2, by, bw, 26, { label: i === 0 ? 'talker' : i === 3 ? 'far end' : 'node ' + (i + 1), size: 11, color: i === 0 ? C.accent : i === 3 ? C.ok : C.faint, active: i === 0 || i === 3 });
        });
        if (view === 'idle' && ctl.values.bias) kit.label(c, 'bias: B up, A down', x0 + 48, yB + 12, { size: 10, color: C.warn });
        if (view !== 'idle') {
          kit.label(c, kit.fmt(L, 3) + ' m of twisted pair', (x0 + x1) / 2, yA - 12, { size: 11, color: C.muted, align: 'center' });
        }
        // ---- the graph
        const gx = M + 40, gw = W - 48, gy = topH + 12;
        let gh = st.H - gy - 30;
        if (view === 'idle') gh -= 38;                   // room for the receiver output under the graph
        const lo = -6, hi = 6, Y = v => gy + gh - clamp((v - lo) / (hi - lo), 0, 1) * gh;
        const band = () => { c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)'; c.fillRect(gx, Y(0.2), gw, Y(-0.2) - Y(0.2)); };
        const axes = (t0, t1, unitText) => {
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); for (const v of [-4, -2, 0, 2, 4]) { c.moveTo(gx, Y(v) + 0.5); c.lineTo(gx + gw, Y(v) + 0.5); } c.stroke();
          for (const v of [-4, -2, 0, 2, 4]) kit.label(c, v + ' V', gx - 6, Y(v), { size: 9.5, color: C.faint, align: 'right' });
          kit.label(c, '0', gx, gy + gh + 12, { size: 10, color: C.faint });
          kit.label(c, fmtT(t1 - t0) + ' shown', gx + gw, gy + gh + 12, { size: 10, color: C.faint, align: 'right' });
        };
        if (view === 'idle') {
          const SPAN = 6e-3, n = 600, amp = ctl.values.noise, bias = ctl.values.bias;
          const Rt = 1 / ((tl ? 1 / 120 : 0) + (trm ? 1 / 120 : 0) + 1 / 3000);
          const V0 = bias ? 3.3 * Rt / (Rt + 780) : 0;
          band(); axes(0, SPAN);
          const pts = [], ro2 = [[0, 1]];
          let out = 1, fall = 0;
          for (let i = 0; i <= n; i++) {
            const t = SPAN * i / n, v = V0 + noiseAt(t, amp);
            pts.push([t, v]);
            const prev = out;
            if (v > 0.2) out = 1; else if (v < -0.2) out = 0;
            if (out !== prev) { ro2.push([t, out]); if (out === 0) fall++; }
          }
          S.analog(c, gx, gy, gw, gh, pts, { t0: 0, t1: SPAN, min: lo, max: hi, color: C.accent, width: 1.8 });
          c.save(); c.strokeStyle = C.warn; c.setLineDash([5, 4]); c.lineWidth = 1.4; c.beginPath(); c.moveTo(gx, Y(V0)); c.lineTo(gx + gw, Y(V0)); c.stroke(); c.restore();
          kit.label(c, bias ? 'bias holds the idle level at ' + kit.fmt(V0, 3) + ' V' : 'nothing holds the lines: only noise', gx + 6, gy + 10, { size: 10.5, color: C.warn });
          const wy = gy + gh + 22;
          S.wave(c, gx, wy, gw, 12, ro2, { t0: 0, t1: SPAN, color: fall ? C.bad : C.ok });
          kit.label(c, 'receiver output (what the UART sees)', gx, wy + 22, { size: 10.5, color: C.muted });
          ro.set('a', '—'); ro.set('b', '—');
          ro.set('c', fall ? fall + ' false start bit' + (fall > 1 ? 's' : '') + ' in ' + fmtT(SPAN) + ': the UART reads stray characters' : 'a steady idle line: no false characters');
          ro.set('d', 'Bias gives a defined idle level only if it is stiffer than the noise; with both ends terminated and 390 Ω resistors it is 0.23 V.');
          return;
        }
        const tr = ctl.values.edge, m = lineModel(L, tr, tl, trm), A = 2;
        if (view === 'edge') {
          const span = clamp(Math.max(6 * tr, 14 * m.tau + 3 * tr), 1e-7, 4e-4), te = 0.1 * span;
          const pts = farSeries(m, [[te, 2]], -1, A, 0, span, 500);
          band(); axes(0, span);
          S.analog(c, gx, gy, gw, gh, [[0, -A], [te, -A], [te, A], [span, A]], { t0: 0, t1: span, min: lo, max: hi, color: C.faint, width: 1.4 });
          S.analog(c, gx, gy, gw, gh, pts, { t0: 0, t1: span, min: lo, max: hi, color: C.accent, width: 2 });
          kit.label(c, 'grey: sent · blue: seen at the far end', gx + 6, gy + 10, { size: 10.5, color: C.muted });
          const fin = A * m.rInf;
          let pk = -1e9, tk = 0;
          for (const p of pts) if (p[1] > pk) { pk = p[1]; tk = p[0]; }
          let low = 1e9; for (const p of pts) if (p[0] > tk && p[1] < low) low = p[1];
          const over = (pk - fin) / fin * 100;
          ro.set('a', fmtT(m.tau)); ro.set('b', fmtT(tr));
          ro.set('c', 'overshoot ' + kit.fmt(Math.max(0, over), 3) + ' %' + (low < 0.2 ? ' · rings back through the threshold' : ' · stays above the threshold'));
          ro.set('d', 'Reflections matter when the round trip, ' + fmtT(2 * m.tau) + ', is a good fraction of the edge time.');
          return;
        }
        // a bit stream
        const T = 1 / ctl.values.rate, t1 = 12 * T + m.tau, edges = [];
        for (let k = 1; k < PAT.length; k++) if (PAT[k] !== PAT[k - 1]) edges.push([k * T, PAT[k] ? 2 : -2]);
        const pts = farSeries(m, edges, PAT[0] ? 1 : -1, A, 0, t1, 700);
        band(); axes(0, t1);
        const drv = [[0, A * (PAT[0] ? 1 : -1)]];
        for (let k = 1; k < PAT.length; k++) if (PAT[k] !== PAT[k - 1]) drv.push([k * T, drv[drv.length - 1][1]], [k * T, A * (PAT[k] ? 1 : -1)]);
        drv.push([12 * T, drv[drv.length - 1][1]]);
        S.analog(c, gx, gy, gw, gh, drv, { t0: 0, t1, min: lo, max: hi, color: C.faint, width: 1.4 });
        S.analog(c, gx, gy, gw, gh, pts, { t0: 0, t1, min: lo, max: hi, color: C.accent, width: 2 });
        let bad = 0;
        const X = t => gx + clamp(t / t1, 0, 1) * gw;
        PAT.forEach((b, k) => {
          const ts = (k + 0.5) * T + m.tau, v = pts[Math.min(pts.length - 1, Math.round(ts / t1 * 700))][1];
          const ok = b ? v > 0.2 : v < -0.2;
          if (!ok) bad++;
          kit.dot(c, X(ts), Y(v), 4, ok ? C.ok : C.bad);
        });
        kit.label(c, 'grey: sent · blue: far end · dots: read mid-bit', gx + 6, gy + 10, { size: 10.5, color: C.muted });
        ro.set('a', fmtT(m.tau)); ro.set('b', fmtT(tr));
        ro.set('c', bad ? bad + ' of ' + PAT.length + ' bits read wrongly' : 'all ' + PAT.length + ' bits read correctly');
        ro.set('d', 'Length times speed here is ' + kit.fmt(L * ctl.values.rate / 1e6, 3) + ' Mbit·m/s; about 120 is the usual limit.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ fb-modbus */
  // the characters found in an edge list: starts at every falling edge from idle, reads in the middle of each bit
  function uartDecode(edges, baud, parity, stop, tFrom, tTo) {
    const Tr = 1 / baud, out = [], lvl = t => levelAt(edges, t), falls = [];
    for (let i = 1; i < edges.length; i++) if (edges[i][1] === 0 && edges[i - 1][1] === 1 && edges[i][0] >= tFrom && edges[i][0] < tTo) falls.push(edges[i][0]);
    let next = -Infinity;
    for (const tf of falls) {
      if (tf < next || lvl(tf + 0.5 * Tr) !== 0) continue;
      let byte = 0, ones = 0, k = 9, ok = true;
      for (let i = 0; i < 8; i++) { const v = lvl(tf + (1.5 + i) * Tr); byte |= v << i; ones += v; }
      if (parity === 'even') { ok = lvl(tf + (k + 0.5) * Tr) === ones % 2; k++; }
      for (let s = 0; s < stop; s++) { if (lvl(tf + (k + 0.5) * Tr) !== 1) ok = false; k++; }
      out.push({ byte, ok });
      next = tf + (k - 0.3) * Tr;
    }
    return out;
  }
  // the bytes of a frame as labelled fields for a picture
  function modbusFields(b, role, f) {
    const out = [{ label: 'addr', size: 1, value: hex2(b[0]), color: 212 }, { label: 'fn', size: 1, value: hex2(b[1]), color: b[1] & 0x80 ? 4 : 36 }];
    const crcAt = b.length - 2;
    let i = 2;
    const pair = (label, color) => { out.push({ label, size: 2, value: hex2(b[i]) + hex2(b[i + 1]), color }); i += 2; };
    if (b[1] & 0x80) { out.push({ label: 'err', size: 1, value: hex2(b[2]), color: 4 }); i = 3; }
    else if (role === 'req' && (f === 3 || f === 4)) { pair('start', 140); pair('count', 150); }
    else if (role === 'req' && f === 6) { pair('reg', 140); pair('value', 150); }
    else if (role === 'rsp' && (f === 3 || f === 4)) { out.push({ label: 'n', size: 1, value: hex2(b[2]), color: 140 }); i = 3; let r = 0; while (i + 1 < crcAt) pair('R' + r++, 150); }
    else if (role === 'rsp' && f === 6) { pair('reg', 140); pair('value', 150); }
    while (i < crcAt) { out.push({ label: 'data', size: 1, value: hex2(b[i]), color: 150 }); i++; }
    out.push({ label: 'CRC', size: 2, value: hex2(b[crcAt]) + hex2(b[crcAt + 1]), color: 286 });
    return out;
  }

  Hyper.sim('fb-modbus', {
    title: 'A Modbus RTU request and its reply',
    blurb: `The top rows are the two frames, byte by byte, with the **CRC-16 worked out** and sent low byte first. Underneath is the RS-485 line as a logic analyser shows it: the direction pin of each side, and the bytes on the bus (blue from the master, green from the server).

**Try this**
- Change the **function** and the **registers**: the request and reply change shape, and the CRC with them.
- Choose **DE released too early**: the last byte of the request is cut, the server's CRC check fails, and it stays silent.
- Choose **DE released too late**: the master's receiver is still off when the reply starts.
- Tick **noise damages one byte**: the frame arrives but the CRC no longer fits.
- Raise the baud rate and read the total time of one poll.`,
    mount(box, kit, params) {
      params = params || {};
      const E = kit.esp, S = kit.esym, P = E.proto;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 460, maxH: 640 });
      const ctl = kit.controls(box.side, [
        { id: 'fn', type: 'select', label: 'Function', options: [['03 · read holding registers', 3], ['04 · read input registers', 4], ['06 · write one register', 6], ['2B · a function the server lacks', 0x2B]], value: params.fn || 3 },
        { id: 'addr', label: 'Server address', min: 1, max: 247, step: 1, value: 1 },
        { id: 'reg', label: 'First register', min: 0, max: 255, step: 1, value: 0 },
        { id: 'qty', label: 'Registers to read', min: 1, max: 8, step: 1, value: 2 },
        { id: 'val', label: 'Value to write', min: 0, max: 65535, step: 1, value: 1234 },
        { id: 'baud', type: 'select', label: 'Baud rate', options: [['9600', 9600], ['19 200', 19200], ['115 200', 115200]], value: 9600 },
        { id: 'fmt', type: 'select', label: 'Frame format', options: [['8E1: even parity', 'even'], ['8N2: no parity, two stop bits', 'none']], value: 'even' },
        { id: 'sw', type: 'select', label: 'The direction pin', options: [['released right after the last byte', 'ok'], ['released too early', 'early'], ['released too late', 'late']], value: params.sw || 'ok' },
        { id: 'corrupt', type: 'check', label: 'Noise damages one byte of the request', value: !!params.corrupt }
      ], () => { sync(); loop.once(); });
      const ro = kit.readout(box.side, [['req', 'Request'], ['crc', 'CRC-16'], ['rsp', 'Reply'], ['time', 'Time'], ['res', 'Result']]);
      const sync = () => {
        const f = ctl.values.fn;
        ctl.show('reg', f !== 0x2B); ctl.show('qty', f === 3 || f === 4); ctl.show('val', f === 6);
      };
      sync();
      const withCrc = a => { const c = E.crc16modbus(a); return a.concat([c & 255, c >> 8]); };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const fn = ctl.values.fn, addr = Math.round(ctl.values.addr), reg = Math.round(ctl.values.reg), qty = Math.round(ctl.values.qty), val = Math.round(ctl.values.val);
        const baud = ctl.values.baud, parity = ctl.values.fmt, stop = parity === 'even' ? 1 : 2, tb = 1 / baud, tc = 11 * tb;
        // ---- the two frames
        let req, rsp;
        if (fn === 3 || fn === 4) {
          req = withCrc([addr, fn, reg >> 8, reg & 255, 0, qty]);
          const body = [addr, fn, 2 * qty];
          for (let i = 0; i < qty; i++) { const v = 2301 + reg + i; body.push(v >> 8, v & 255); }
          rsp = withCrc(body);
        } else if (fn === 6) { req = withCrc([addr, 6, reg >> 8, reg & 255, val >> 8, val & 255]); rsp = req.slice(); }
        else { req = withCrc([addr, fn, 0x0E, 0x01, 0x00]); rsp = withCrc([addr, fn | 0x80, 0x01]); }
        const tx = req.slice();
        if (ctl.values.corrupt) tx[3] ^= 0x04;
        // ---- the timing
        const uo = { baud, parity, stop, gap: 0 };
        const reqF = P.uartBytes(tx, Object.assign({ t: 0 }, uo)), tReq = reqF.t1;
        const sw = ctl.values.sw, tS = tReq + 4 * tc;
        const rspF = P.uartBytes(rsp, Object.assign({ t: tS }, uo)), tRspEnd = rspF.t1;
        const mFall = sw === 'early' ? tReq - 6 * tb : sw === 'late' ? tS + 0.5 * (tRspEnd - tS) : tReq + tb;
        const deM = [[-1, 0], [-2 * tb, 1], [mFall, 0]];
        const bus = (mEdges, sEdges, deS) => {
          const times = [...new Set([].concat(mEdges.map(e => e[0]), sEdges.map(e => e[0]), deM.map(e => e[0]), deS.map(e => e[0])))].sort((a, b) => a - b);
          const out = [[-1, 1]];
          let lv = 1;
          for (const t of times) {
            const lm = levelAt(deM, t) ? levelAt(mEdges, t) : 1, ls = levelAt(deS, t) ? levelAt(sEdges, t) : 1, v = lm & ls;
            if (v !== lv) { out.push([t, v]); lv = v; }
          }
          return out;
        };
        // does the server hear a good request? (decode the bus with the server silent)
        const silent = [[-1, 1]], deNone = [[-1, 0]];
        const bus1 = bus(reqF.edges, silent, deNone);
        const heardReq = uartDecode(bus1, baud, parity, stop, -1, tS).map(x => x.byte);
        const crcOf = a => (a.length >= 4 ? E.crc16modbus(a.slice(0, -2)) : -1);
        const reqCrcOk = heardReq.length === tx.length && heardReq.length >= 4 && crcOf(heardReq) === (heardReq[heardReq.length - 2] | (heardReq[heardReq.length - 1] << 8));
        const answers = reqCrcOk;
        const deS = answers ? [[-1, 0], [tS - 2 * tb, 1], [tRspEnd + tb, 0]] : deNone;
        const sEdges = answers ? rspF.edges : silent;
        const busE = bus(reqF.edges, sEdges, deS);
        const heardRsp = answers ? uartDecode(busE, baud, parity, stop, mFall, tRspEnd + 2 * tb).map(x => x.byte) : [];
        const rspOk = answers && heardRsp.length === rsp.length && crcOf(heardRsp) === (heardRsp[heardRsp.length - 2] | (heardRsp[heardRsp.length - 1] << 8));
        // ---- the frames as pictures
        const M = 8, W = st.W - 2 * M;
        kit.label(c, 'request: master to server', M, 10, { size: 11.5, weight: 600, color: C.text2 });
        S.frame(c, M, 20, W, modbusFields(tx, 'req', fn), { h: 34 });
        if (answers) {
          kit.label(c, 'reply: server to master', M, 72, { size: 11.5, weight: 600, color: C.text2 });
          S.frame(c, M, 82, W, modbusFields(rsp, 'rsp', fn), { h: 34 });
        } else kit.label(c, 'no reply: the server stays silent', M, 82, { size: 11.5, color: C.bad });
        // ---- the line
        const ly = 128, lh = st.H - ly - 46, t0 = -3 * tb, t1 = (answers ? Math.max(tRspEnd, mFall) : tS + 6 * tc) + 3 * tb;
        const marks = [];
        tx.forEach((b, i) => marks.push({ t0: i * tc, t1: (i + 1) * tc, text: hex2(b), color: TINT.blue }));
        if (answers) rsp.forEach((b, i) => marks.push({ t0: tS + i * tc, t1: tS + (i + 1) * tc, text: hex2(b), color: TINT.green }));
        if (sw === 'early') marks.push({ t0: mFall, t1: tReq, text: '', color: TINT.red });
        const overlap = [];
        if (answers) { const a = Math.max(tS - 2 * tb, -1e9), b = Math.min(mFall, tRspEnd + tb); if (b > a) overlap.push({ t0: a, t1: b, text: '', color: TINT.red }); }
        const clipL = e => clip(e, t0, t1);
        const rows = [
          { label: 'master DE', edges: clipL(deM).edges, idle: clipL(deM).idle, color: C.accent, marks: [{ t0: -2 * tb, t1: mFall, text: 'master drives', color: TINT.blue }] },
          { label: 'server DE', edges: clipL(deS).edges, idle: clipL(deS).idle, color: C.ok, marks: answers ? [{ t0: tS - 2 * tb, t1: tRspEnd + tb, text: 'server drives', color: TINT.green }] : [] },
          { label: 'bus', edges: clipL(busE).edges, idle: clipL(busE).idle, marks: marks.concat(overlap) }
        ];
        S.logic(c, M, ly, W, lh, rows, { t0, t1, labelW: 62, grid: 10 });
        legend(kit, c, [[TINT.blue, 'master drives'], [TINT.green, 'server drives'], [TINT.red, 'fault: cut or clash']], M, st.H - 28, W);
        // ---- the numbers
        const crcV = E.crc16modbus(req.slice(0, -2));
        ro.set('req', fmtBytes(tx));
        ro.set('crc', hexN(crcV, 4) + ' → sent ' + hex2(crcV & 255) + ' ' + hex2(crcV >> 8) + ' (low byte first)');
        ro.set('rsp', answers ? fmtBytes(rsp) : '—');
        ro.set('time', fmtT(tReq) + ' request · ' + fmtT(4 * tc) + ' gap' + (answers ? ' · ' + fmtT(tRspEnd - tS) + ' reply' : ''));
        let res;
        if (!answers) res = ctl.values.corrupt ? 'The server\'s CRC check fails (the byte changed, the CRC did not): it stays silent and the master times out.' : 'The end of the request was cut off: the server\'s CRC check fails and it stays silent.';
        else if (!rspOk) res = 'The master\'s receiver was still off while the reply began: it hears a damaged reply and its CRC check fails.';
        else if (fn === 0x2B) res = 'The server answers with the function plus 0x80 and exception code 01: "illegal function".';
        else if (fn === 6) res = 'The server echoes the request: the write is confirmed.';
        else res = 'The master reads ' + qty + ' register' + (qty > 1 ? 's' : '') + ': ' + Array.from({ length: qty }, (_, i) => 2301 + reg + i).join(', ') + '.';
        ro.set('res', res);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ fb-usb */
  const shortChip = c => String(c.name || c.id).replace(/\s*\(.*\)/, '');
  const usbCaps = c => { const u = (c.usb || []).join(' ').toLowerCase(); return { otg: /otg/.test(u), hs: /high-speed/.test(u), sj: /serial\/jtag/.test(u) }; };
  const USB_CLASSES = {
    cdc: { name: 'a serial port (CDC)', short: 'a serial port', sees: 'USB serial device: a COM port or /dev/ttyACM', ifs: 2, eps: 3 },
    kbd: { name: 'a keyboard (HID)', short: 'a keyboard', sees: 'HID keyboard: the computer types what the ESP sends', ifs: 1, eps: 1 },
    mouse: { name: 'a mouse (HID)', short: 'a mouse', sees: 'HID mouse: the pointer moves when the ESP says so', ifs: 1, eps: 1 },
    msc: { name: 'a drive (mass storage)', short: 'a drive', sees: 'mass-storage drive: a drive letter or mounted volume', ifs: 1, eps: 2 },
    midi: { name: 'a MIDI instrument', short: 'a MIDI instrument', sees: 'USB MIDI device: music software lists it', ifs: 2, eps: 2 }
  };
  const USB_PLUG = {
    kbd: { name: 'a keyboard', cls: 'HID keyboard', api: 'USBHostHIDKeyboard', mA: 'about 100 mA or less' },
    mouse: { name: 'a mouse', cls: 'HID mouse', api: 'USBHostHIDMouse', mA: 'about 100 mA or less' },
    msc: { name: 'a flash drive', cls: 'mass storage', api: 'USBHostMSC', mA: 'up to 500 mA (the USB 2.0 limit) while writing' },
    serial: { name: 'a USB-serial adapter', cls: 'CDC serial', api: 'USBHostSerial (CDC adapters; CP210x, FTDI and CH34x need their own drivers)', mA: 'about 100 mA or less' },
    pad: { name: 'a game controller', cls: 'HID gamepad', api: 'USBHostHIDGamepad', mA: 'about 100 mA or less, more with rumble' },
    printer: { name: 'a printer', cls: 'printer', api: null, mA: 'it has its own supply' }
  };
  const USB_STEPS = [
    ['R', 'attach: pull-up on D+', 'The device pulls D+ high through a resistor; the host sees that something is plugged in.'],
    ['L', 'bus reset (about 10 ms)', 'The host holds both data lines low; the device falls back to address 0.'],
    ['L', 'GET_DESCRIPTOR: device', 'The host asks the device who it is, at address 0.'],
    ['R', 'device descriptor: VID, PID, class', 'The device answers: vendor and product numbers, the class, how big its first packets are.'],
    ['L', 'SET_ADDRESS (1 to 127)', 'The host gives the device its own address on the bus.'],
    ['R', 'configuration: interfaces and endpoints', 'The device lists every interface (serial, keyboard, drive …) and the endpoints each one uses.'],
    ['L', 'SET_CONFIGURATION', 'The host picks a configuration; the endpoints come alive.'],
    ['B', 'class driver talks to the interfaces', 'One driver per interface: data now flows in the class\'s own way.']
  ];
  // the ladder diagram of the enumeration: lifelines left (host) and right (device); rows revealed up to `progress`
  function usbLadder(kit, S, c, C, x, y, w, h, leftName, rightName, progress) {
    const lx = x + w * 0.22, rx = x + w * 0.78, top = y + 34, rh = clamp((h - 40) / USB_STEPS.length, 20, 34);
    S.box(c, lx - 44, y, 88, 24, { label: leftName, size: 11, color: C.accent, active: true });
    S.box(c, rx - 44, y, 88, 24, { label: rightName, size: 11, color: C.ok, active: true });
    c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(lx, y + 24); c.lineTo(lx, top + rh * USB_STEPS.length); c.moveTo(rx, y + 24); c.lineTo(rx, top + rh * USB_STEPS.length); c.stroke(); c.restore();
    USB_STEPS.forEach((s, i) => {
      const yy = top + rh * (i + 0.62), on = i < progress, cur = i === Math.floor(progress) && progress < USB_STEPS.length, col = on ? (cur ? C.warn : C.text2) : C.faint;
      c.save(); c.globalAlpha = on ? 1 : 0.45;
      if (s[0] === 'B') { kit.arrow(c, lx + 8, yy, rx - 8, yy, col, 1.6, 7); kit.arrow(c, rx - 8, yy, lx + 8, yy, col, 1.6, 7); }
      else if (s[0] === 'L') kit.arrow(c, lx + 8, yy, rx - 8, yy, col, 1.6, 7);
      else kit.arrow(c, rx - 8, yy, lx + 8, yy, col, 1.6, 7);
      c.restore();
      kit.label(c, (i + 1) + '  ' + s[1], (lx + rx) / 2, yy - 9, { size: 10.5, color: col, align: 'center', weight: cur ? 700 : 500 });
    });
    return top + rh * USB_STEPS.length;
  }

  Hyper.sim('fb-usb', {
    title: 'USB on an ESP: chips, devices and hosts',
    blurb: `Three views of one subject. **Which chip has which USB** is read from the chip catalogue. **What the computer sees** shows the device tree when an ESP with a full USB controller is plugged in: tick the classes it offers. **What the ESP finds** turns the roles round: the ESP is the host and a device is plugged into it. Press *Plug in* to replay the enumeration, step by step.

**Try this**
- In the table, compare the ESP32, the ESP32-S3 and the ESP32-C3: which of them can be a keyboard?
- Choose the ESP32-C3 in the device view: its fixed block offers a serial port and a debugger, nothing else.
- On the ESP32-S3 tick several classes and watch the interface and endpoint counts add up: a chip has only a handful of endpoints.
- In the host view plug in a printer: the ESP has no driver for it.`,
    mount(box, kit, params) {
      params = params || {};
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 430, maxH: 640 });
      const chips = E.CHIPS.filter(c => !c.coproc);
      const views = ['chips', 'device', 'host'];
      let progress = 99;
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['Which chip has which USB', 'chips'], ['What the computer sees', 'device'], ['What the ESP finds', 'host']], value: views.includes(params.view) ? params.view : 'chips' },
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(c => [shortChip(c), c.id]), value: params.chip && E.chip(params.chip) ? params.chip : 'esp32-s3' },
        { id: 'cdc', type: 'check', label: 'Offer a serial port (CDC)', value: true },
        { id: 'kbd', type: 'check', label: 'Offer a keyboard (HID)', value: true },
        { id: 'mouse', type: 'check', label: 'Offer a mouse (HID)', value: false },
        { id: 'msc', type: 'check', label: 'Offer a drive (mass storage)', value: false },
        { id: 'midi', type: 'check', label: 'Offer a MIDI instrument', value: false },
        { id: 'dev', type: 'select', label: 'Plug in', options: Object.keys(USB_PLUG).map(k => [USB_PLUG[k].name, k]), value: 'kbd' },
        { type: 'buttons', items: [{ id: 'go', label: 'Plug in again', primary: true }] }
      ], (id) => {
        sync();
        if (id === 'go' || id === 'view' || id === 'chip' || id === 'dev') { progress = 0; if (ctl.values.view !== 'chips') loop.start(); else loop.once(); } else loop.once();
      });
      const ro = kit.readout(box.side, [['a', 'The chip'], ['b', 'It can be'], ['c', 'Counts'], ['d', 'Now']]);
      const sync = () => {
        const v = ctl.values.view, cap = usbCaps(E.chip(ctl.values.chip) || {});
        for (const k of Object.keys(USB_CLASSES)) ctl.show(k, v === 'device' && cap.otg);
        ctl.show('dev', v === 'host'); ctl.show('go', v !== 'chips'); ctl.show('chip', true);
      };
      sync();
      let rows = [];
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors();
        const view = ctl.values.view, chip = E.chip(ctl.values.chip), cap = usbCaps(chip), M = 8, W = st.W - 2 * M, name = shortChip(chip);
        if (progress < USB_STEPS.length + 1) progress += dt / 0.7; else if (loop.running) { progress = 99; loop.stop(); }
        if (view === 'chips') {
          const cols = [['bridge', 'bridge chip'], ['sj', 'serial+JTAG'], ['otg', 'OTG'], ['hs', 'high speed']];
          const nameW = Math.min(108, W * 0.26), cw = (W - nameW) / cols.length, hy = 6, top = hy + 30, rh = clamp((st.H - top - 40) / chips.length, 20, 34);
          kit.label(c, 'chip', M + 4, hy + 10, { size: 11, color: C.muted, weight: 600 });
          cols.forEach((cl, i) => kit.label(c, cl[1], M + nameW + cw * (i + 0.5), hy + 10, { size: st.W < 520 ? 9.5 : 11, color: C.muted, weight: 600, align: 'center' }));
          rows = [];
          chips.forEach((ch, r) => {
            const k = usbCaps(ch), y = top + r * rh, sel = ch.id === chip.id, has = { bridge: !k.otg && !k.sj, sj: k.sj, otg: k.otg, hs: k.hs };
            if (sel) { c.fillStyle = C.dark ? 'rgba(123,140,255,.18)' : 'rgba(60,90,220,.10)'; c.fillRect(M, y, W, rh - 2); }
            kit.label(c, shortChip(ch), M + 4, y + rh / 2 - 1, { size: 11.5, weight: sel ? 700 : 500 });
            cols.forEach((cl, i) => { if (has[cl[0]]) kit.dot(c, M + nameW + cw * (i + 0.5), y + rh / 2 - 1, 5.5, cl[0] === 'bridge' ? C.warn : cl[0] === 'hs' ? C.accent : C.ok); else kit.label(c, '–', M + nameW + cw * (i + 0.5), y + rh / 2 - 1, { size: 11, color: C.faint, align: 'center' }); });
            rows.push({ y, h: rh, id: ch.id });
          });
          kit.label(c, 'amber: bridge chip needed · green: built in · click a row', M + 4, st.H - 18, { size: 10.5, color: C.muted });
          const pins = (E.PINS[chip.id] && Array.isArray(E.PINS[chip.id].gpios) ? E.PINS[chip.id].gpios : []).filter(p => p && p.usb).map(p => 'GPIO' + p.n + ' ' + p.usb);
          ro.set('a', name + (chip.usb && chip.usb.length ? ': ' + chip.usb.join(' · ') : ': no USB'));
          ro.set('b', cap.otg ? 'a keyboard, mouse, drive, MIDI or audio device — or the host for them' + (cap.hs ? ', at 480 Mbit/s' : ', at 12 Mbit/s') : cap.sj ? 'a serial port plus a debugger on one cable, nothing else' : 'nothing: a bridge chip on the board makes the serial port');
          ro.set('c', pins.length ? 'USB data pins: ' + pins.join(', ') + ' (plain GPIO use switches USB off)' : 'no USB data pins');
          ro.set('d', chip.status ? 'Status of the chip: ' + chip.status : '—');
          return;
        }
        // ---- device and host views: the lifelines, and what is attached
        const wide = st.W >= 640, picW = wide ? W * 0.46 : W, ladX = wide ? M + picW + 10 : M, ladW = wide ? W - picW - 10 : W;
        let leftName, rightName, lines = [], verdict = '', vcol = C.text2;
        if (view === 'device') {
          leftName = 'computer'; rightName = name;
          let ifs = 0, eps = 0;
          if (cap.otg) {
            lines = Object.keys(USB_CLASSES).filter(k => ctl.values[k]).map(k => { ifs += USB_CLASSES[k].ifs; eps += USB_CLASSES[k].eps; return wide ? USB_CLASSES[k].sees : USB_CLASSES[k].short; });
            if (!lines.length) lines = ['(nothing offered: tick at least one class)'];
            verdict = lines.length > 1 ? 'a composite device: one driver per interface' : 'a single-function device';
            vcol = C.ok;
          } else if (cap.sj) {
            lines = ['USB serial port (a COM port or /dev/ttyACM)', 'JTAG debugger (a debug adapter)'];
            verdict = 'fixed function: no other class is possible on this chip'; vcol = C.warn;
          } else {
            lines = ['a USB-to-serial bridge chip on the board (CP210x, CH340 …): a COM port. The ESP itself is not on the USB wires.'];
            verdict = 'the ESP is not a USB device here'; vcol = C.warn;
          }
          // the tree
          let ty = 8;
          S.box(c, M, ty, picW, 28, { label: 'The computer sees: ' + (cap.otg || cap.sj ? name : 'a bridge chip'), size: 11.5, color: C.accent, active: true });
          ty += 40;
          lines.forEach(l => { c.save(); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(M + 14, ty - 18); c.lineTo(M + 14, ty); c.lineTo(M + 28, ty); c.stroke(); c.restore(); ty += para(kit, c, l, M + 34, ty, picW - 40, 14, { size: 11, color: C.text }) * 14 + 10; });
          ty += 4;
          para(kit, c, verdict, M + 2, ty, picW - 4, 14, { size: 11.5, color: vcol, weight: 600 });
          ro.set('a', name + (cap.otg ? ': a full USB controller' + (chip.id === 'esp32-s3' ? ' (the fixed serial and debug block uses the same two pins; the board menu chooses)' : '') : cap.sj ? ': the fixed serial and debug block' : ': no USB of its own'));
          ro.set('b', cap.otg ? 'any device class its firmware offers' : cap.sj ? 'a serial port and a JTAG debugger only' : 'nothing on its own');
          ro.set('c', cap.otg ? ifs + ' interface' + (ifs === 1 ? '' : 's') + ', ' + eps + ' endpoint' + (eps === 1 ? '' : 's') + ' besides endpoint 0' : cap.sj ? 'fixed interfaces' : '—');
        } else {
          const dv = USB_PLUG[ctl.values.dev];
          leftName = name; rightName = dv.name.replace(/^an? /, '');
          let ty = 8;
          S.box(c, M, ty, picW, 28, { label: 'The ESP is the host: ' + name, size: 11.5, color: C.accent, active: true });
          ty += 40;
          const canHost = cap.otg;
          const l1 = canHost ? 'The chip has a USB OTG controller, so it can be a host.' : 'This chip has no OTG controller: it cannot be a USB host at all.';
          ty += para(kit, c, l1, M + 2, ty, picW - 4, 14, { size: 11, color: canHost ? C.text : C.bad }) * 14 + 8;
          const l2 = canHost ? (dv.api ? 'Driver for ' + dv.cls + ': ' + dv.api + '.' : 'No driver for a ' + dv.cls + ' in the ESP\'s USB host classes.') : 'Even with a host stack, it would need an OTG controller.';
          ty += para(kit, c, l2, M + 2, ty, picW - 4, 14, { size: 11, color: canHost && dv.api ? C.text : C.warn }) * 14 + 8;
          ty += para(kit, c, 'The board must supply 5 V on the connector: ' + dv.mA + '. Use a power switch with a current limit, not the chip pin.', M + 2, ty, picW - 4, 14, { size: 11, color: C.text2 }) * 14 + 8;
          verdict = canHost && dv.api ? 'Works with the right library.' : 'Not possible as it stands.';
          para(kit, c, verdict, M + 2, ty, picW - 4, 14, { size: 11.5, color: canHost && dv.api ? C.ok : C.bad, weight: 600 });
          ro.set('a', name + (canHost ? ': can host' : ': cannot host'));
          ro.set('b', dv.name + (dv.cls === 'printer' ? '' : ' (' + dv.cls + ' class)'));
          ro.set('c', 'power: ' + dv.mA);
        }
        usbLadder(kit, S, c, C, ladX, wide ? 8 : Math.round(st.H * 0.5), ladW, wide ? st.H - 16 : st.H - Math.round(st.H * 0.5) - 8, leftName, rightName, progress);
        const stepNo = Math.min(USB_STEPS.length, Math.floor(progress) + 1);
        ro.set('d', progress >= 99 || progress >= USB_STEPS.length ? 'enumeration finished: ' + USB_STEPS[USB_STEPS.length - 1][2] : 'step ' + stepNo + ': ' + USB_STEPS[stepNo - 1][2]);
      }, box.stage);
      kit.click(st, p => { const r = rows.find(q => p.y >= q.y && p.y < q.y + q.h); if (r && ctl.values.view === 'chips') { ctl.set('chip', r.id, true); } }, p => ctl.values.view === 'chips' && rows.some(q => p.y >= q.y && p.y < q.y + q.h));
      st.onResize(() => loop.once());
      progress = 99;
      loop.once();
    }
  });

  /* ================================================================ fb-differential */
  const sstep = x => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const DBITS = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1];
  const DNOISE = [[0.7, 0.4], [1.9, 2.1], [3.3, 4.0], [5.1, 1.3], [8.3, 5.2]];
  const dNoise = (t, amp) => amp * DNOISE.reduce((s, c, i) => s + Math.sin(2 * Math.PI * c[0] * t + c[1]) / (1 + 0.25 * i), 0) / 2.3;
  const dLevel = t => {                       // the sent signal, 0 or 1, with soft edges
    const k = Math.floor(t), cur = DBITS[clamp(k, 0, DBITS.length - 1)], prev = DBITS[clamp(k - 1, 0, DBITS.length - 1)];
    return prev + (cur - prev) * sstep((t - k) / 0.12);
  };

  Hyper.sim('fb-differential', {
    title: 'Noise and a ground offset: one wire against a pair',
    blurb: `A bit pattern is sent over a long cable. The top graph is what the receiver sees at its pins, measured against **its own ground**; the middle graph is the voltage it actually decides on; the boxes show what was sent and what was read. Noise is the same on both wires of a pair, and the **ground offset** is the voltage between the two boards' grounds (a motor, a long cable, a different socket).

**Try this**
- With **one wire**, raise the ground offset to 1 or 2 V: the signal slides off its thresholds and bits are read wrongly.
- Switch to the **RS-485 pair** with the same offset and noise: the offset moves both wires together and cancels in the difference.
- Push the offset to about **+9 V or −10 V** on the pair: the wires' common level leaves the receiver's range of −7 V to +12 V, and even RS-485 fails.
- Choose the **isolated** transceiver: the ground offset can be anything the isolator is rated for.`,
    mount(box, kit, params) {
      params = params || {};
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 440, maxH: 620 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Link', options: [['One wire against ground (3.3 V logic)', 'se'], ['RS-485: a differential pair', 'diff'], ['RS-485 through an isolated transceiver', 'iso']], value: params.mode || 'se' },
        { id: 'noise', label: 'Noise picked up by the cable', min: 0, max: 3, value: params.noise != null ? params.noise : 1, unit: 'V' },
        { id: 'gnd', label: 'Ground offset between the boards', min: -12, max: 12, value: params.gnd != null ? params.gnd : 2, unit: 'V' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['a', 'At the receiver'], ['b', 'Bits read wrongly'], ['c', 'Verdict']]);
      const N = DBITS.length;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const mode = ctl.values.mode, amp = ctl.values.noise, vg = mode === 'iso' ? 0 : ctl.values.gnd;
        const M = 8, W = st.W - 2 * M, gx = M + 40, gw = W - 48;
        // the signals at the receiver pins, against the receiver's ground
        const noise = t => dNoise(t, amp);
        const pinA = t => (mode === 'se' ? 3.3 * dLevel(t) + noise(t) - vg : 1.65 - vg + (2 * dLevel(t) - 1) + noise(t));
        const pinB = t => 1.65 - vg - (2 * dLevel(t) - 1) + 0.97 * noise(t);
        const decide = t => (mode === 'se' ? pinA(t) : pinA(t) - pinB(t));
        // the read bits
        let bad = 0, pmin = 1e9, pmax = -1e9;
        const read = DBITS.map((b, k) => {
          const t = k + 0.5, v = decide(t);
          let r;
          if (mode === 'se') r = v > 0.7 * 3.3 ? 1 : v < 0.3 * 3.3 ? 0 : -1;
          else { const cm = (pinA(t) + pinB(t)) / 2; r = cm < -7 || cm > 12 ? -1 : v > 0.2 ? 1 : v < -0.2 ? 0 : -1; }
          if (r !== b) bad++;
          return r;
        });
        for (let i = 0; i <= 240; i++) { const t = N * i / 240, a = pinA(t); pmin = Math.min(pmin, a); pmax = Math.max(pmax, a); if (mode !== 'se') { const b = pinB(t); pmin = Math.min(pmin, b); pmax = Math.max(pmax, b); } }
        // top graph: the pins
        const lo = -14, hi = 18, ty = 22, th = Math.round(st.H * 0.30);
        const Yt = v => ty + th - clamp((v - lo) / (hi - lo), 0, 1) * th;
        kit.label(c, 'voltage at the receiver\'s pins, against its ground', gx, 10, { size: 11, color: C.muted });
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); for (const v of [-10, -5, 0, 5, 10, 15]) { c.moveTo(gx, Yt(v) + 0.5); c.lineTo(gx + gw, Yt(v) + 0.5); } c.stroke();
        for (const v of [-10, 0, 10]) kit.label(c, v + ' V', gx - 6, Yt(v), { size: 9.5, color: C.faint, align: 'right' });
        if (mode !== 'se') { c.fillStyle = C.dark ? 'rgba(34,179,122,.10)' : 'rgba(34,179,122,.12)'; c.fillRect(gx, Yt(12), gw, Yt(-7) - Yt(12)); kit.label(c, 'receiver common-mode range: −7 V to +12 V', gx + gw - 4, Yt(12) + 9, { size: 9.5, color: C.ok, align: 'right' }); }
        else { c.fillStyle = C.dark ? 'rgba(34,179,122,.10)' : 'rgba(34,179,122,.12)'; c.fillRect(gx, Yt(3.6), gw, Yt(-0.3) - Yt(3.6)); kit.label(c, 'the pin\'s safe range: −0.3 V to 3.6 V', gx + gw - 4, Yt(3.6) - 8, { size: 9.5, color: C.ok, align: 'right' }); }
        S.analog(c, gx, ty, gw, th, pinA, { t0: 0, t1: N, min: lo, max: hi, color: C.accent, width: 1.8 });
        if (mode !== 'se') S.analog(c, gx, ty, gw, th, pinB, { t0: 0, t1: N, min: lo, max: hi, color: C.warn, width: 1.8 });
        kit.label(c, mode === 'se' ? 'blue: the one signal wire' : 'blue: wire A · amber: wire B', gx + 6, ty + 10, { size: 10, color: C.muted });
        // middle graph: what the receiver decides on
        const my = ty + th + 34, mh = Math.round(st.H * 0.24), dlo = mode === 'se' ? -8 : -6, dhi = mode === 'se' ? 12 : 6;
        const Ym = v => my + mh - clamp((v - dlo) / (dhi - dlo), 0, 1) * mh;
        kit.label(c, mode === 'se' ? 'what it decides on: the wire against ground' : 'what it decides on: A minus B', gx, my - 10, { size: 11, color: C.muted });
        if (mode === 'se') {
          c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)';
          c.fillRect(gx, Ym(0.7 * 3.3), gw, Ym(0.3 * 3.3) - Ym(0.7 * 3.3));
          kit.label(c, 'neither level: 0.99 V to 2.31 V', gx + gw - 4, Ym(2.1) , { size: 9.5, color: C.faint, align: 'right' });
        } else { c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'; c.fillRect(gx, Ym(0.2), gw, Ym(-0.2) - Ym(0.2)); }
        c.strokeStyle = C.grid; c.beginPath(); c.moveTo(gx, Ym(0) + 0.5); c.lineTo(gx + gw, Ym(0) + 0.5); c.stroke();
        S.analog(c, gx, my, gw, mh, decide, { t0: 0, t1: N, min: dlo, max: dhi, color: C.accent, width: 2 });
        const X = t => gx + t / N * gw;
        read.forEach((r, k) => { const ok = r === DBITS[k]; kit.dot(c, X(k + 0.5), Ym(decide(k + 0.5)), 3.5, ok ? C.ok : C.bad); });
        // the bits
        const by = my + mh + 14, bw = gw / N;
        kit.label(c, 'sent', gx - 6, by + 9, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'read', gx - 6, by + 33, { size: 10.5, color: C.muted, align: 'right' });
        DBITS.forEach((b, k) => {
          S.box(c, gx + k * bw + 1, by, bw - 2, 18, { label: String(b), size: 11, color: C.faint });
          const r = read[k];
          S.box(c, gx + k * bw + 1, by + 24, bw - 2, 18, { label: r < 0 ? '?' : String(r), size: 11, color: r === b ? C.ok : C.bad, active: r !== b });
        });
        const cmAvg = mode === 'se' ? null : 1.65 - vg;
        ro.set('a', mode === 'se' ? 'the pin swings between ' + kit.fmt(pmin, 3) + ' and ' + kit.fmt(pmax, 3) + ' V' : 'common-mode level ' + kit.fmt(cmAvg, 3) + ' V (safe range −7 to +12 V)');
        ro.set('b', bad + ' of ' + N);
        let verdict;
        if (mode === 'se') verdict = bad ? 'The offset and the noise move the single wire through its thresholds' + (pmin < -0.3 || pmax > 3.6 ? ', and the pin itself is pushed beyond its limits.' : '.') : 'Fine for now: raise the noise or the offset.';
        else if (cmAvg < -7 || cmAvg > 12) verdict = 'The common-mode range is used up: the receiver cannot work, pair or not.';
        else verdict = bad ? 'Noise is large enough to cut into the ±0.2 V threshold even after cancelling.' : (mode === 'iso' ? 'The isolator keeps the two grounds apart: the offset does nothing.' : 'The offset and the noise appear on both wires and cancel in A − B.');
        ro.set('c', verdict);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ fb-i2s */
  const hexW = (v, bits) => '0x' + v.toString(16).toUpperCase().padStart(bits / 4, '0');
  const sampleCode = (pct, bits) => { const max = Math.pow(2, bits - 1) - 1, v = Math.round(pct / 100 * max); return v < 0 ? v + Math.pow(2, bits) : v; };
  Hyper.sim('fb-i2s', {
    title: 'The three wires of I2S',
    blurb: `One stereo frame on the bus. **LRCLK** falls for the left channel and rises for the right. **DATA** carries each sample **most significant bit first**, and is read on the rising edge of **BCLK**. In the Philips format the first bit comes one clock after the LRCLK edge; in the left-justified format it comes with the edge.

**Try this**
- Switch between the two formats and watch the data move by one clock against LRCLK.
- Set the left sample to **+50 %** and the right to **−25 %**: the negative one is a two's-complement number, full of ones at the front.
- Choose **24-bit samples in 32-bit slots**: the last eight bits of each slot are padding, and the bit clock doubles with the slot.
- Raise the **sample rate** and read the bit clock in the read-outs: it is sample rate × bits per slot × 2.`,
    mount(box, kit, params) {
      params = params || {};
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300, maxH: 440 });
      const ctl = kit.controls(box.side, [
        { id: 'fmt', type: 'select', label: 'Format', options: [['I2S (Philips): data one clock late', 'philips'], ['Left-justified: data with the edge', 'left']], value: params.fmt || 'philips' },
        { id: 'w', type: 'select', label: 'Samples and slots', options: [['16-bit samples in 16-bit slots', 16], ['24-bit samples in 32-bit slots', 24], ['32-bit samples in 32-bit slots', 32]], value: params.w || 16 },
        { id: 'fs', type: 'select', label: 'Sample rate', options: [['8 kHz', 8000], ['16 kHz', 16000], ['44.1 kHz', 44100], ['48 kHz', 48000]], value: 16000 },
        { id: 'l', label: 'Left sample', min: -100, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'r', label: 'Right sample', min: -100, max: 100, step: 1, value: -25, unit: '%' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['bclk', 'BCLK'], ['lr', 'LRCLK (one frame)'], ['mclk', 'MCLK, if a chip wants it'], ['l', 'Left word'], ['r', 'Right word'], ['rate', 'Audio data']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const bits = ctl.values.w, slot = bits === 16 ? 16 : 32, fs = ctl.values.fs, off = ctl.values.fmt === 'philips' ? 1 : 0;
        const tb = 1 / (fs * slot * 2), lc = sampleCode(ctl.values.l, bits), rc = sampleCode(ctl.values.r, bits);
        const bitOf = (code, i) => Math.floor(code / Math.pow(2, bits - 1 - i)) % 2;
        // the three signals, period by period (period k runs from k·tb to (k+1)·tb)
        const KA = -3, KB = 2 * slot + 3, n = KB - KA;
        const dataAt = k => {
          for (const fr of [-1, 0, 1]) for (const ch of [0, 1]) {
            const s0 = fr * 2 * slot + ch * slot + off, i = k - s0;
            if (i >= 0 && i < bits) return bitOf(ch ? rc : lc, i);
          }
          return 0;
        };
        const lrAt = k => (((k % (2 * slot)) + 2 * slot) % (2 * slot) >= slot ? 1 : 0);
        const bclk = [[KA * tb, 0]], lrE = [[KA * tb, lrAt(KA)]], dE = [[KA * tb, dataAt(KA)]];
        let lastLr = lrAt(KA), lastD = dataAt(KA);
        for (let k = KA; k < KB; k++) {
          bclk.push([k * tb + tb / 2, 1], [(k + 1) * tb, 0]);
          const l = lrAt(k + 1), d = dataAt(k + 1);
          if (l !== lastLr) { lrE.push([(k + 1) * tb, l]); lastLr = l; }
          if (d !== lastD) { dE.push([(k + 1) * tb, d]); lastD = d; }
        }
        // the bits are written one period at a time: data changes on the falling edge, so period k holds the bit of period k
        const word = (ch, code, txt, color) => ({ t0: (ch * slot + off) * tb, t1: (ch * slot + off + bits) * tb, text: txt, color });
        const marks = [word(0, lc, 'L ' + hexW(lc, bits), TINT.blue), word(1, rc, 'R ' + hexW(rc, bits), TINT.green)];
        if (bits < slot) marks.push({ t0: (off + bits) * tb, t1: (slot + off) * tb, text: 'padding', color: TINT.grey }, { t0: (slot + off + bits) * tb, t1: (2 * slot + off) * tb, text: 'padding', color: TINT.grey });
        const M = 8, W = st.W - 2 * M, t0 = KA * tb, t1 = KB * tb;
        const lrMarks = [{ t0: 0, t1: slot * tb, text: 'left', color: TINT.blue }, { t0: slot * tb, t1: 2 * slot * tb, text: 'right', color: TINT.green }];
        S.logic(c, M, 6, W, st.H - 44, [
          { label: 'BCLK', edges: bclk, color: C.text2 },
          { label: 'LRCLK', edges: lrE, marks: lrMarks },
          { label: 'DATA', edges: dE, marks: marks }
        ], { t0, t1, labelW: 52, grid: 10 });
        legend(kit, c, [[TINT.blue, 'left word, MSB first'], [TINT.green, 'right word'], [TINT.grey, 'padding']], M, st.H - 18, W);
        const fb = fs * slot * 2;
        ro.set('bclk', (fb >= 1e6 ? kit.fmt(fb / 1e6, 4) + ' MHz' : kit.fmt(fb / 1e3, 4) + ' kHz') + '  = ' + fs / 1000 + ' kHz × ' + slot + ' × 2');
        ro.set('lr', kit.fmt(fs / 1000, 3) + ' kHz (' + fmtT(1 / fs) + ')');
        ro.set('mclk', kit.fmt(256 * fs / 1e6, 4) + ' MHz (256 × the sample rate)');
        ro.set('l', hexW(lc, bits) + '  (' + ctl.values.l + ' % of full scale)');
        ro.set('r', hexW(rc, bits) + '  (' + ctl.values.r + ' % of full scale)');
        ro.set('rate', kit.fmt(fs * 2 * bits / 8 / 1000, 4) + ' kB/s of samples, ' + kit.fmt(fs * 2 * slot / 8 / 1000, 4) + ' kB/s on the bus');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ fb-dmx-midi */
  const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const noteName = n => NOTE_NAMES[n % 12] + (Math.floor(n / 12) - 1);
  Hyper.sim('fb-dmx-midi', {
    title: 'DMX512 and MIDI on the wire',
    blurb: `Two old serial standards that an ESP's UART can speak. **DMX512** is RS-485 at 250 kbit/s: a long *break*, a short *mark after break*, a start code, then up to 512 one-byte channels, over and over. **MIDI** is a 31 250 baud current loop that sends three-byte messages such as *note on*.

**Try this**
- In the DMX view send **24 slots** and then **512**: the refresh rate falls from hundreds of packets a second to about 44.
- Change the values of channels 1 and 2 and find them in the trace: eight data bits, least significant bit first, between a start bit and two stop bits.
- In the MIDI view change the note and velocity and find the bytes: a status byte (top bit set) then two data bytes (top bit clear).
- Compare how long a note-on takes with a DMX packet.`,
    mount(box, kit, params) {
      params = params || {};
      const E = kit.esp, S = kit.esym, P = E.proto;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 360, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['DMX512: a lighting packet', 'dmx'], ['MIDI: a note message', 'midi']], value: params.view || 'dmx' },
        { id: 'n', label: 'Slots sent in the packet', min: 24, max: 512, step: 1, value: 512, log: true, sig: 3 },
        { id: 'c1', label: 'Channel 1 value', min: 0, max: 255, step: 1, value: 255 },
        { id: 'c2', label: 'Channel 2 value', min: 0, max: 255, step: 1, value: 128 },
        { id: 'note', label: 'Note', min: 24, max: 96, step: 1, value: 60, fmt: v => Math.round(v) + '  ' + noteName(Math.round(v)) },
        { id: 'vel', label: 'Velocity', min: 1, max: 127, step: 1, value: 100 },
        { id: 'chan', label: 'MIDI channel', min: 1, max: 16, step: 1, value: 1 },
        { id: 'kind', type: 'select', label: 'Message', options: [['Note on', 0x90], ['Note off', 0x80]], value: 0x90 }
      ], () => { sync(); loop.once(); });
      const ro = kit.readout(box.side, [['a', 'The frame'], ['b', 'Timing'], ['c', 'Rate'], ['d', 'On the wire']]);
      const sync = () => { const d = ctl.values.view === 'dmx'; for (const k of ['n', 'c1', 'c2']) ctl.show(k, d); for (const k of ['note', 'vel', 'chan', 'kind']) ctl.show(k, !d); };
      sync();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const M = 8, W = st.W - 2 * M;
        if (ctl.values.view === 'dmx') {
          const us = 1e-6, BRK = 100 * us, MAB = 16 * us, TB = 4 * us;      // a slot is 11 bits of 4 µs: 44 µs
          const vals = [0x00, Math.round(ctl.values.c1), Math.round(ctl.values.c2), 0, 0];
          const edges = [[-30 * us, 1], [0, 0], [BRK, 1]], marks = [{ t0: 0, t1: BRK, text: 'break (low)', color: TINT.red }, { t0: BRK, t1: BRK + MAB, text: 'MAB', color: TINT.amber }];
          let t = BRK + MAB, lv = 1;
          const push = (tt, v) => { if (v !== lv) { edges.push([tt, v]); lv = v; } };
          vals.forEach((byte, s) => {
            const a = t;
            const seq = [0].concat(Array.from({ length: 8 }, (_, i) => (byte >> i) & 1), [1, 1]);
            seq.forEach((v, i) => push(a + i * TB, v));
            marks.push({ t0: a, t1: a + 11 * TB, text: s === 0 ? '00' : s <= 2 ? hex2(byte) : '', color: s === 0 ? TINT.grey : s === 1 ? TINT.blue : s === 2 ? TINT.green : TINT.grey });
            t += 11 * TB;
          });
          const t1 = t + 12 * us;
          const lh = Math.round(st.H * 0.40);
          S.logic(c, M, 6, W, lh, [{ label: 'DMX', edges, marks }], { t0: -30 * us, t1, labelW: 40, grid: 10 });
          legend(kit, c, [[TINT.red, 'break'], [TINT.amber, 'mark after break'], [TINT.grey, 'start code 00'], [TINT.blue, 'channel 1'], [TINT.green, 'channel 2']], M, lh + 18, W);
          // the whole packet, as a bar
          const n = Math.round(ctl.values.n), total = BRK + MAB + (1 + n) * 11 * TB, by = lh + 64, bh = 26;
          kit.label(c, 'the whole packet (not to the scale of the trace above)', M, by - 12, { size: 11, color: C.muted });
          const bw = W, brkW = Math.max(4, bw * (BRK + MAB) / total), slotsW = bw - brkW;
          c.fillStyle = TINT.red; c.fillRect(M, by, brkW, bh);
          c.fillStyle = TINT.green; c.fillRect(M + brkW, by, slotsW, bh);
          c.fillStyle = TINT.grey; c.fillRect(M + brkW, by, Math.max(1, slotsW / (n + 1)), bh);
          c.strokeStyle = C.border2 || C.faint; c.strokeRect(M + 0.5, by + 0.5, bw - 1, bh - 1);
          kit.label(c, 'break + MAB', M + 4, by + bh + 12, { size: 10, color: C.muted });
          kit.label(c, 'start code, then ' + n + ' channels, 44 µs each', M + bw, by + bh + 12, { size: 10, color: C.muted, align: 'right' });
          // the refresh rate against the number of slots
          const ry = by + bh + 34;
          kit.label(c, 'packets per second against slots sent', M, ry, { size: 11, color: C.muted });
          const gx = M + 40, gw = W - 48, gy = ry + 8, gh = st.H - gy - 22, X = v => gx + (Math.log(v / 24) / Math.log(512 / 24)) * gw, rate = v => 1 / (BRK + MAB + (1 + v) * 11 * TB), Rmax = rate(24);
          const Y = r => gy + gh - Math.log(r / 30) / Math.log(Rmax / 30) * gh;
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
          for (let i = 0; i <= 60; i++) { const v = 24 * Math.pow(512 / 24, i / 60); if (i) c.lineTo(X(v), Y(rate(v))); else c.moveTo(X(v), Y(rate(v))); }
          c.stroke();
          kit.dot(c, X(n), Y(rate(n)), 5, C.warn);
          for (const v of [24, 64, 128, 256, 512]) kit.label(c, String(v), X(v), gy + gh + 11, { size: 9.5, color: C.faint, align: 'center' });
          for (const r of [30, 100, 300, 1000]) if (r < Rmax * 1.05) kit.label(c, String(r), gx - 6, Y(r), { size: 9.5, color: C.faint, align: 'right' });
          ro.set('a', 'break ≥ 92 µs, mark after break ≥ 12 µs, start code, slots of 8N2');
          ro.set('b', fmtT(total) + ' for ' + n + ' slots');
          ro.set('c', kit.fmt(1 / total, 3) + ' packets a second');
          ro.set('d', '250 kbit/s over RS-485, 120 Ω at the last device');
        } else {
          const kind = ctl.values.kind, ch = Math.round(ctl.values.chan), note = Math.round(ctl.values.note), vel = Math.round(ctl.values.vel);
          const bytes = [kind | (ch - 1), note, kind === 0x90 ? vel : 0x40];
          const u = P.uartBytes(bytes, { baud: 31250, gap: 0, t: 0 });
          const marks = u.marks.map((m, i) => ({ t0: m.t0, t1: m.t1, text: m.text, color: i === 0 ? TINT.amber : TINT.blue }));
          S.logic(c, M, 6, W, Math.round(st.H * 0.34), [{ label: 'MIDI', edges: u.edges, marks }], { t0: -u.tBit, t1: u.t1 + u.tBit, labelW: 44, grid: 10 });
          // the current loop
          const y = Math.round(st.H * 0.34) + 44, bw = Math.min(110, W * 0.25);
          kit.label(c, 'the loop: a current of about 5 mA, not a voltage', M, y - 18, { size: 11, color: C.muted });
          const a = S.box(c, M, y, bw, 40, { label: 'ESP UART TX', sub: 'through resistors', size: 11, color: C.accent, active: true });
          const b = S.box(c, M + W - bw, y, bw, 40, { label: 'optocoupler', sub: 'the receiver', size: 11, color: C.ok, active: true });
          kit.arrow(c, a.r[0] + 4, y + 20, b.l[0] - 4, y + 20, C.text2, 2);
          kit.label(c, '5-pin DIN cable: pins 4 and 5', (a.r[0] + b.l[0]) / 2, y + 8, { size: 10.5, color: C.muted, align: 'center' });
          kit.label(c, 'no common ground: the opto isolates', (a.r[0] + b.l[0]) / 2, y + 36, { size: 10.5, color: C.muted, align: 'center' });
          ro.set('a', hex2(bytes[0]) + ' ' + hex2(bytes[1]) + ' ' + hex2(bytes[2]) + ' = ' + (kind === 0x90 ? 'note on' : 'note off') + ', channel ' + ch + ', ' + noteName(note) + ', ' + (kind === 0x90 ? 'velocity ' + vel : 'release 64'));
          ro.set('b', '3 bytes × 10 bits at 31 250 baud = ' + fmtT(u.t1));
          ro.set('c', kit.fmt(1 / u.t1, 4) + ' messages a second, or ' + kit.fmt(1 / (2 * 320e-6), 4) + ' with running status (2 bytes)');
          ro.set('d', 'the status byte has its top bit set; the data bytes never do (0 to 127)');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ fb-parallel */
  Hyper.sim('fb-parallel', {
    title: 'A parallel bus: width, clock and frame rate',
    blurb: `A parallel display bus writes a **word of 8 or 16 bits per cycle**, latched by a write strobe (WR). The trace sends four pixels (red, green, blue, white) and shows what appears on the data lines. The read-outs turn that into **clocks per pixel** and the **frame rate** a display of your choice allows, next to the same display on SPI at the same clock.

**Try this**
- Compare **8-bit** and **16-bit** buses for 16-bit colour: one pixel takes two clocks or one.
- Raise the **write clock** from 10 to 40 MHz and watch the frame rate rise in step.
- Choose **800 × 480** on an 8-bit bus at 10 MHz: about 13 frames a second, and SPI would manage fewer than 2.
- Compare the SPI line: one bit per clock is why big displays moved to parallel buses.`,
    mount(box, kit, params) {
      params = params || {};
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'w', type: 'select', label: 'Bus width', options: [['8 data lines', 8], ['16 data lines', 16]], value: params.w || 8 },
        { id: 'bpp', type: 'select', label: 'Colour', options: [['16 bits a pixel (RGB565)', 16], ['24 bits a pixel (RGB888)', 24]], value: 16 },
        { id: 'f', type: 'select', label: 'Write clock', options: [['5 MHz', 5e6], ['10 MHz', 10e6], ['20 MHz', 20e6], ['40 MHz', 40e6]], value: params.f || 20e6 },
        { id: 'res', type: 'select', label: 'Display', options: [['240 × 240', '240x240'], ['320 × 240', '320x240'], ['480 × 320', '480x320'], ['800 × 480', '800x480']], value: '320x240' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['a', 'Clocks per pixel'], ['b', 'One frame'], ['c', 'Frame rate'], ['d', 'On SPI, same clock'], ['e', 'Pins']]);
      const PIX = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 255]];
      const rgb565 = p => ((p[0] >> 3) << 11) | ((p[1] >> 2) << 5) | (p[2] >> 3);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const w = ctl.values.w, bpp = ctl.values.bpp, f = ctl.values.f, res = String(ctl.values.res).split('x').map(Number), tw = 1 / f;
        // each pixel as a bit string, cut into words of the bus width
        const words = [];
        PIX.forEach((p, i) => {
          const bitsStr = bpp === 16 ? rgb565(p).toString(2).padStart(16, '0') : p.map(v => v.toString(2).padStart(8, '0')).join('');
          for (let k = 0; k < bitsStr.length; k += w) words.push({ v: parseInt(bitsStr.slice(k, k + w).padEnd(w, '0'), 2), px: i });
        });
        const WR = [[-tw, 1]], D = [[-tw, 0]], marks = [];
        words.forEach((wd, k) => {
          WR.push([k * tw + 0.25 * tw, 0], [k * tw + 0.75 * tw, 1]);
          D.push([k * tw, 1 - (k % 2)]);                  // the lines change at the start of every word
          marks.push({ t0: k * tw, t1: (k + 1) * tw, text: hexW(wd.v, w), color: [TINT.red, TINT.green, TINT.blue, TINT.grey][wd.px] });
        });
        const M = 8, W = st.W - 2 * M, t1 = words.length * tw;
        S.logic(c, M, 6, W, Math.round(st.H * 0.52), [{ label: 'WR', edges: WR }, { label: 'D[' + (w - 1) + ':0]', edges: D, marks }], { t0: -tw, t1, labelW: 56, grid: words.length + 1 });
        legend(kit, c, [[TINT.red, 'pixel 1: red'], [TINT.green, 'green'], [TINT.blue, 'blue'], [TINT.grey, 'white']], M, Math.round(st.H * 0.52) + 22, W);
        // what it means for a display
        const px = res[0] * res[1], cpp = Math.ceil(bpp / w), frame = px * cpp * tw, fps = 1 / frame, spi = px * bpp * tw;
        const bar = (label, secs, y, color) => {
          const full = Math.max(frame, spi) * 1.02, bw2 = (W - 215) * secs / full;
          kit.label(c, label, M, y + 8, { size: 11, color: C.text2 });
          c.fillStyle = color; c.fillRect(M + 100, y, Math.max(2, bw2), 16);
          kit.label(c, kit.fmt(1 / secs, 3) + ' frames/s', M + 100 + Math.max(2, bw2) + 6, y + 8, { size: 10.5, color: C.muted });
        };
        const by = Math.round(st.H * 0.52) + 56;
        kit.label(c, 'full redraws a second, ' + res[0] + ' × ' + res[1], M, by - 4, { size: 11, color: C.muted });
        bar('parallel, ' + w + ' bit', frame, by + 14, C.accent);
        bar('SPI, 1 bit', spi, by + 40, C.warn);
        ro.set('a', cpp + ' (' + bpp + ' bits over ' + w + ' lines)');
        ro.set('b', fmtT(frame) + ' for ' + px + ' pixels');
        ro.set('c', kit.fmt(fps, 3) + ' frames a second' + (fps < 10 ? ': slow for animation' : fps >= 30 ? ': smooth' : ': acceptable'));
        ro.set('d', kit.fmt(1 / spi, 3) + ' frames a second');
        ro.set('e', w + ' data + WR, DC, CS (+ RD, RST) = ' + (w + 3) + ' to ' + (w + 5));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
