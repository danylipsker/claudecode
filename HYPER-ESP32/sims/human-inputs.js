/* HYPER-ESP32 · sims/human-inputs.js
 *
 * Simulations of the topic "Buttons, knobs and touch" (ids start with hi-):
 *   hi-switch     a button, its pull-up and the voltage on the pin
 *   hi-bounce     contact bounce on the pin, and two ways to debounce it
 *   hi-gesture    click, double click and long press as a state machine, with a virtual button
 *   hi-encoder    a rotary encoder: A and B traces, a state-table decoder and a naive one
 *   hi-keypad     a 4 x 4 key matrix scanned row by row, with ghosting and diodes
 *   hi-touch      a touch pin's reading against the finger's distance and the threshold
 *   hi-joystick   a thumb joystick: ADC counts, centre offset, dead zone and the scaled output
 *   hi-nec        an NEC infrared frame, drawn and decoded
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const hex2 = n => (n < 16 ? '0' : '') + n.toString(16).toUpperCase();

  /* ================================================================ hi-switch */
  Hyper.sim('hi-switch', {
    title: 'A button, a pull-up and the pin',
    blurb: `The circuit is drawn on top and the voltage at the pin over the last four seconds underneath. **Press and hold the round button** (or tick *Hold the button down*).

**Try this**
- With the first wiring the pin is high at rest and low when pressed: an **active-low** button. Note the 73 µA that flows through the resistor while it is held.
- Choose *no resistor* and let go: the pin **floats**, wanders, and the program would read anything. Tick the noise box to see a hand make it worse.
- Compare the 45 kΩ internal pull-up with the 10 kΩ external one with the noise on: the stiffer resistor holds the level better and costs 330 µA while pressed.
- Choose the pull-down wiring: everything is inverted.
- The dashed lines are the chip's input thresholds (25 % and 75 % of 3.3 V, typical): between them the reading is not guaranteed.`,
    mount(box, kit) {
      const S = kit.esym, SC = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 340, maxH: 470 });
      const VDD = 3.3, VIH = 0.75 * VDD, VIL = 0.25 * VDD;
      let down = false, drift = 0, ripple = 0, phase = 0, btn = null;
      const hist = [];
      const ctl = kit.controls(box.side, [
        { id: 'wire', type: 'select', label: 'Wiring', options: [['Switch to GND, internal pull-up (45 kΩ)', 'pu45'], ['Switch to GND, external pull-up (10 kΩ)', 'pu10'], ['Switch to GND, no resistor', 'none'], ['Switch to 3.3 V, internal pull-down (45 kΩ)', 'pd']], value: 'pu45' },
        { id: 'hold', type: 'check', label: 'Hold the button down', value: false },
        { id: 'noise', type: 'check', label: 'A hand near the wire (noise)', value: false }
      ], () => {});
      const ro = kit.readout(box.side, [['v', 'Voltage at the pin'], ['read', 'The program reads'], ['i', 'Current while pressed']]);
      function volts(v, pressed, dt) {
        const step = Math.min(1, dt * 12);
        drift = drift * (1 - Math.min(1, dt * 3)) + (Math.random() - 0.5) * (v.noise ? 2.4 : 0.9) * step;
        drift = clamp(drift, -1.6, 1.6);
        ripple = ripple * 0.6 + Math.random() * 0.4;
        const amp = v.noise ? (v.wire === 'pu10' ? 0.12 : 0.5) : 0.01;
        if (v.wire === 'pu45' || v.wire === 'pu10') return pressed ? 0 : VDD - amp * ripple;
        if (v.wire === 'pd') return pressed ? VDD : amp * ripple;
        return pressed ? 0 : clamp(VDD / 2 + drift, 0, VDD);
      }
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const pressed = down || v.hold;
        const V = volts(v, pressed, dt);
        hist.push([t, V]);
        while (hist.length > 1 && hist[0][0] < t - 5) hist.shift();
        const high = V >= VIH, low = V <= VIL;
        const pullUp = v.wire === 'pu45' || v.wire === 'pu10';
        const amps = pressed ? (v.wire === 'pu10' ? VDD / 10e3 : (pullUp || v.wire === 'pd') ? VDD / 45e3 : 0) : 0;
        // the circuit
        const ox = Math.max(0, (W - 560) * 0.3), xs = Math.max(58, Math.min(96, W * 0.15)) + ox, yR = 34, yN = 96, yG = 158;
        const xe = xs + 150, bw = 100, lineCol = high ? C.accent : low ? C.muted : C.warn;
        if (pullUp) {
          SC.rail(c, xs, yR, '3.3 V');
          SC.resistor(c, xs, yR, xs, yN, { label: 'pull-up', value: v.wire === 'pu10' ? '10 kΩ' : '45 kΩ (internal)' });
          SC.switch(c, xs, yN, xs, yG, { closed: pressed, label: 'button' });
        } else if (v.wire === 'pd') {
          SC.rail(c, xs, yR, '3.3 V');
          SC.switch(c, xs, yR, xs, yN, { closed: pressed, label: 'button' });
          SC.resistor(c, xs, yN, xs, yG, { label: 'pull-down', value: '45 kΩ (internal)' });
        } else {
          SC.switch(c, xs, yN, xs, yG, { closed: pressed, label: 'button' });
        }
        SC.ground(c, xs, yG);
        SC.wire(c, [[xs, yN], [xe, yN]], { color: lineCol });
        SC.node(c, xs, yN, { color: lineCol });
        if (amps > 0) { phase += dt * 40; S.flow(c, [[xs, yR], [xs, yG]], phase, { color: C.accent }); }
        S.box(c, xe, yN - 32, bw, 64, { label: 'GPIO4', sub: high ? 'reads HIGH' : low ? 'reads LOW' : 'reads ?', color: lineCol, active: high || low });
        kit.label(c, kit.fmt(V, 2) + ' V', xs + 75, yN - 12, { size: 12, color: lineCol, align: 'center', weight: 650 });
        if (v.wire === 'none' && !pressed) kit.label(c, 'nothing holds the pin', xs + 75, yN + 16, { size: 10.5, color: C.warn, align: 'center' });
        btn = { x: xe + bw / 2, y: yG + 8, r: 28 };
        S.button(c, btn.x, btn.y, { pressed, size: 46, label: 'press and hold' });
        // the trace
        const px = 64, pw = W - px - 16, py = 218, ph = Math.max(60, H - py - 30);
        const g = S.analog(c, px, py, pw, ph, hist, { t0: t - 4, t1: t, min: 0, max: VDD, label: 'pin (V)', color: C.accent });
        c.save(); c.setLineDash([4, 4]); c.lineWidth = 1; c.strokeStyle = C.faint;
        for (const lv of [VIH, VIL]) { c.beginPath(); c.moveTo(px, g.Y(lv)); c.lineTo(px + pw, g.Y(lv)); c.stroke(); }
        c.restore();
        kit.label(c, 'HIGH above 2.5 V', px + pw - 4, g.Y(VIH) - 8, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, 'LOW below 0.8 V', px + pw - 4, g.Y(VIL) + 9, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, '4 s ago', px, py + ph + 12, { size: 10, color: C.faint });
        kit.label(c, 'now', px + pw, py + ph + 12, { size: 10, color: C.faint, align: 'right' });
        ro.set('v', kit.fmt(V, 3) + ' V');
        ro.set('read', high ? 'HIGH' : low ? 'LOW' : 'in between: not guaranteed');
        ro.set('i', pressed ? (amps > 0 ? kit.fmt(amps * 1e6, 3) + ' µA' : '0: no resistor') : 'none: the switch is open');
      }, box.stage);
      kit.drag(st, { hover: true, hit: p => (btn && Math.hypot(p.x - btn.x, p.y - btn.y) < btn.r + 6 ? 'b' : null), start: () => { down = true; }, move: () => {}, end: () => { down = false; } });
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ hi-bounce */
  Hyper.sim('hi-bounce', {
    title: 'Contact bounce and the debounce window',
    blurb: `Three traces over 300 ms: the **finger** (what the user did: one press of 80 ms and a second, shorter tap), the **pin** (what the chip sees, with the contacts chattering) and the result of the method you choose.

**Try this**
- Set the bounce to 0: the pin is clean. Raise it: the number of **edges at the pin** shoots up while the finger still pressed twice.
- With the **stable-time filter**, make the window shorter than the bounce: bounces are counted as extra presses. Make it longer than the second tap: that tap is lost.
- Switch to the **interrupt lock-out**: an edge counts only if it is falling and the pin was quiet for the lock-out time before it. The shaded stretches are the lock-out, restarted by every edge, the release included. The second tap's length no longer matters, but with a lock-out above about 45 ms its press follows the release of the first too closely and is lost.
- The filter answers after the window has passed; the lock-out answers at the first edge.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 320, maxH: 460 });
      const T = 0.3;
      const ctl = kit.controls(box.side, [
        { id: 'method', type: 'select', label: 'Method', options: [['Stable-time filter', 'filter'], ['Interrupt lock-out', 'lockout']], value: 'filter' },
        { id: 'bounce', label: 'Contact bounce', min: 0, max: 15, step: 1, value: 6, unit: 'ms' },
        { id: 'win', label: 'Debounce / lock-out time', min: 0, max: 60, step: 1, value: 25, unit: 'ms' },
        { id: 'tap', label: 'Second tap length', min: 10, max: 90, step: 1, value: 40, unit: 'ms' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['edges', 'Edges at the pin'], ['count', 'Presses counted'], ['note', 'What happened']]);
      const falling = edges => { let n = 0, last = null; for (const e of edges) { if (last === 1 && e[1] === 0) n++; last = e[1]; } return n; };
      function model(v) {
        const tap = v.tap / 1000, win = v.win / 1000;
        const presses = [[0.03, 0.11], [0.16, 0.16 + tap]];
        const bm = Math.min(v.bounce, 0.45 * v.tap);
        const raw = E.proto.bounce(presses, { bounceMs: bm, seed: 7 });
        const finger = [[-0.02, 1], [0.03, 0], [0.11, 1], [0.16, 0], [0.16 + tap, 1]];
        let out, counted = 0, locks = [];
        if (v.method === 'filter') {
          const deb = E.debouncer(v.win, 1);
          out = [[-0.02, 1]];
          let last = 1;
          for (let k = 0; k <= T * 10000; k++) {
            const t = k / 10000, lv = deb(E.proto.levelAt(raw, t), t * 1000);
            if (lv !== last) { out.push([t, lv]); last = lv; }
          }
          counted = falling(out);
        } else {
          // the interrupt fires on every edge: an edge counts as a press only if it is falling and the pin was quiet for `win` before it
          out = [[-0.02, 0]];
          let lastEdge = -1e9, prev = 1, burst = null;
          for (let i = 1; i < raw.length; i++) {
            const t = raw[i][0], lv = raw[i][1], quiet = t - lastEdge > win;
            if (quiet) { burst = [t, t + win]; locks.push(burst); if (prev === 1 && lv === 0) { counted++; out.push([t, 1], [t + 0.004, 0]); } }
            else if (burst) burst[1] = t + win;
            lastEdge = t; prev = lv;
          }
        }
        return { raw, finger, out, counted, locks, rawEdges: raw.length - 1, rawFall: falling(raw), bm };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const m = model(v);
        const traces = [
          { label: 'finger', edges: m.finger, color: C.muted },
          { label: 'pin', edges: m.raw, color: C.series[0], marks: m.locks.map(l => ({ t0: l[0], t1: l[1], text: 'lock-out', color: C.dark ? 'rgba(224,160,48,.28)' : 'rgba(224,160,48,.30)' })) },
          { label: v.method === 'filter' ? 'output' : 'counted', edges: m.out, color: C.ok }
        ];
        S.logic(c, 6, 6, W - 12, H - 34, traces, { t0: 0, t1: T, labelW: 62, grid: 10 });
        kit.label(c, 'press 80 ms at 30 ms, then a tap of ' + v.tap + ' ms at 160 ms', 10, H - 11, { size: 11, color: C.muted });
        ro.set('edges', m.rawEdges + ' (' + m.rawFall + ' falling)');
        ro.set('count', m.counted + ' of 2 real presses');
        const note = m.counted === 2 ? 'both taps counted, once each'
          : m.counted > 2 ? 'bounces counted as presses: the time is shorter than the bounce'
          : v.method === 'filter' ? 'the second tap was shorter than the window: lost' : 'the second press came too soon after another edge: lost';
        ro.set('note', note);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ hi-gesture */
  Hyper.sim('hi-gesture', {
    title: 'One button, three gestures',
    blurb: `The machine of the page, running. **Press and hold the round button** with the pointer, or use the three demonstration buttons. The active state is lit and the transition that just fired flashes.

**Try this**
- Tap once and wait: **DOWN**, then **GAP**, then after the click gap **SINGLE CLICK**. Notice how late the click is reported.
- Tap twice quickly: the second press in **GAP** goes to **DOWN2** and its release is a **DOUBLE CLICK**.
- Hold: when the long-press time has passed, **LONG PRESS** is reported while you are still holding.
- Raise the click gap: every single click becomes slower. Lower the long-press time to 300 ms and see how easily a slow tap becomes a long press.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 390, maxH: 520 });
      let m = null, dg = null, physDown = false, clock = 0, fired = null, last = '—', btn = null;
      const script = [], log = [];
      const ctl = kit.controls(box.side, [
        { id: 'long', label: 'Long-press time', min: 300, max: 1500, step: 50, value: 600, unit: 'ms' },
        { id: 'gap', label: 'Click gap', min: 150, max: 600, step: 25, value: 300, unit: 'ms' },
        { type: 'buttons', items: [{ id: 'tap', label: 'Single tap', primary: true }, { id: 'dbl', label: 'Double tap' }, { id: 'hold', label: 'Long press' }, { id: 'clear', label: 'Clear' }] }
      ], (id) => {
        if (id === 'clear') { log.length = 0; last = '—'; return; }
        if (id === 'tap') script.push({ t: clock, ev: 'PRESS' }, { t: clock + 90, ev: 'RELEASE' });
        else if (id === 'dbl') { const g = Math.min(ctl.values.gap * 0.5, 150); script.push({ t: clock, ev: 'PRESS' }, { t: clock + 90, ev: 'RELEASE' }, { t: clock + 90 + g, ev: 'PRESS' }, { t: clock + 180 + g, ev: 'RELEASE' }); }
        else if (id === 'hold') script.push({ t: clock, ev: 'PRESS' }, { t: clock + ctl.values.long + 500, ev: 'RELEASE' });
        else build();
      });
      const ro = kit.readout(box.side, [['state', 'State'], ['last', 'Last gesture'], ['single', 'Single click comes'], ['long', 'Long press comes']]);
      function build() {
        const L = Math.round(ctl.values.long), G = Math.round(ctl.values.gap);
        const def = { start: 'IDLE', states: {
          IDLE: { on: { PRESS: 'DOWN' } },
          DOWN: { on: { RELEASE: 'GAP' }, after: { [L]: { to: 'HELD', do: 'LONG PRESS' } } },
          GAP: { on: { PRESS: 'DOWN2' }, after: { [G]: { to: 'IDLE', do: 'SINGLE CLICK' } } },
          DOWN2: { on: { RELEASE: { to: 'IDLE', do: 'DOUBLE CLICK' } } },
          HELD: { on: { RELEASE: 'IDLE' } }
        } };
        dg = E.fsmDiagram(def, { IDLE: [0.04, 0.5], DOWN: [0.34, 0.12], GAP: [0.7, 0.12], DOWN2: [0.96, 0.88], HELD: [0.34, 0.88] });
        const notes = { IDLE: 'at rest', DOWN: 'pressed', GAP: 'quiet?', DOWN2: 'pressed again', HELD: 'held' };
        dg.states.forEach(s => { s.note = notes[s.id] || ''; });
        m = E.fsm(def, { onChange(from, to, why, actions) {
          const i = dg.transitions.findIndex(t => t.from === from && t.ev === why);
          fired = { i, at: clock };
          const g = (actions || []).find(a => /CLICK|PRESS$/.test(a) && a === a.toUpperCase());
          if (g) { last = g.toLowerCase(); log.unshift((clock / 1000).toFixed(2) + ' s   ' + g.toLowerCase()); if (log.length > 4) log.pop(); }
        } });
        script.length = 0;
        physDown = false;
      }
      const press = () => { if (!physDown) { physDown = true; m.send('PRESS'); } };
      const release = () => { if (physDown) { physDown = false; m.send('RELEASE'); } };
      build();
      const loop = kit.loop(dt => {
        const ms = dt * 1000;
        clock += ms;
        while (script.length && script[0].t <= clock) { const s = script.shift(); if (s.ev === 'PRESS') press(); else release(); }
        m.tick(ms);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const fsmH = Math.round(H * 0.62);
        const rw = Math.max(30, Math.min(48, (W - 52) / 8));
        const pulse = fired ? clamp((clock - fired.at) / 450, 0, 1) : null;
        S.fsm(c, dg, { box: { x: 6, y: 4, w: W - 12, h: fsmH }, active: m.state, fired: fired && pulse < 1 ? fired.i : -1, pulse: pulse == null ? 0 : pulse, rw });
        // time left in a timed state
        const y0 = fsmH + 12, bx = 112, bw = W - bx - 12;
        const L = Math.round(ctl.values.long), G = Math.round(ctl.values.gap);
        const lim = m.state === 'DOWN' ? L : m.state === 'GAP' ? G : 0;
        c.fillStyle = C.dark ? 'rgba(255,255,255,.10)' : 'rgba(0,0,0,.07)'; c.fillRect(bx, y0, bw, 9);
        if (lim) { c.fillStyle = m.state === 'DOWN' ? C.warn : C.accent; c.fillRect(bx, y0, bw * clamp(m.inState() / lim, 0, 1), 9); }
        kit.label(c, lim ? (m.state === 'DOWN' ? 'long press in ' : 'single click in ') + Math.max(0, Math.round(lim - m.inState())) + ' ms' : 'no timer running', bx, y0 + 22, { size: 11, color: C.muted });
        log.forEach((l, i) => kit.label(c, l, bx, y0 + 44 + i * 16, { size: 11.5, color: i ? C.muted : C.text, weight: i ? 500 : 650 }));
        btn = { x: 54, y: y0 + 52, r: 30 };
        S.button(c, btn.x, btn.y, { pressed: physDown, size: 58, label: 'press and hold' });
        ro.set('state', m.state);
        ro.set('last', last);
        ro.set('single', G + ' ms after the release');
        ro.set('long', L + ' ms after the press');
      }, box.stage);
      kit.drag(st, { hover: true, hit: p => (btn && Math.hypot(p.x - btn.x, p.y - btn.y) < btn.r + 6 ? 'b' : null), start: () => press(), move: () => {}, end: () => release() });
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ hi-encoder */
  Hyper.sim('hi-encoder', {
    title: 'A rotary encoder: A, B and the count',
    blurb: `A knob with 20 pulses per turn: each change of A or B is a **quarter step** of 4.5°, and one click (detent) is four of them. **Drag the knob** round, or use the buttons. The traces show the two contacts; the third shows the count made by a 16-entry state table.

**Try this**
- Turn clockwise: **A leads B**. Turn anticlockwise: B leads A. The table adds +1 or −1 at every edge.
- Raise the turning speed: the edges come closer, the count is still exact.
- Tick **Contacts chatter** and set the time shown to 150 ms: each change now shakes for a millisecond or two. The table still counts right (+1, −1, +1, −1, +1), but the **naive** method (look at B whenever A falls) counts the chatter as extra clicks and drifts away from the true position.
- One detent is four counts: the position is the count divided by four.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 380, maxH: 520 });
      const SEQ = [[0, 0], [1, 0], [1, 1], [0, 1]];
      const TABLE = [0, -1, 1, 0, 1, 0, 0, -1, -1, 0, 0, 1, 0, 1, -1, 0];
      const DEG = 4.5;
      let clock = 0, counts = 0, A = 0, B = 0, prev = 0, tableCount = 0, naive = 0, queue = 0, qAcc = 0, emitT = 0, lastDir = 0, acc = 0, lastA = 0;
      let geo = { kx: 60, ky: 60, r: 40 };
      const eA = [[0, 0]], eB = [[0, 0]], cnt = [[0, 0]];
      const ctl = kit.controls(box.side, [
        { id: 'speed', label: 'Turning speed', min: 10, max: 120, step: 5, value: 40, unit: 'counts/s' },
        { id: 'bounce', type: 'check', label: 'Contacts chatter (bounce)', value: false },
        { id: 'span', type: 'select', label: 'Time shown', options: [['150 ms', 0.15], ['500 ms', 0.5], ['2 s', 2]], value: 0.15 },
        { type: 'buttons', items: [{ id: 'r', label: 'One detent right', primary: true }, { id: 'l', label: 'One detent left' }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'r') queue += 4;
        else if (id === 'l') queue -= 4;
        else if (id === 'reset') {
          counts = 0; A = 0; B = 0; prev = 0; tableCount = 0; naive = 0; queue = 0; lastDir = 0; qAcc = 0;
          eA.length = 0; eB.length = 0; cnt.length = 0;
          eA.push([clock, 0]); eB.push([clock, 0]); cnt.push([clock, 0]);
        }
      });
      const ro = kit.readout(box.side, [['counts', 'Counts (state table)'], ['det', 'Detents (counts ÷ 4)'], ['naive', 'Naive: A falls, read B'], ['ang', 'Knob angle']]);
      function setLine(line, level, t) {
        if (line === 'A') { A = level; eA.push([t, level]); } else { B = level; eB.push([t, level]); }
        const now = (A << 1) | B;
        tableCount += TABLE[(prev << 2) | now];
        prev = now;
        if (line === 'A' && level === 0) naive += B ? 1 : -1;
        cnt.push([t, tableCount]);
      }
      function step(dir) {
        counts += dir;
        const k = ((counts % 4) + 4) % 4, nA = SEQ[k][0], nB = SEQ[k][1];
        emitT = Math.max(clock, emitT + 0.003);
        lastDir = dir;
        const line = nA !== A ? 'A' : 'B', level = line === 'A' ? nA : nB, old = 1 - level;
        if (ctl.values.bounce) {
          const n = 3 + 2 * Math.floor(Math.random() * 3);          // 3, 5 or 7 changes, ending on the true level
          for (let i = 0; i < n; i++) setLine(line, i % 2 ? old : level, emitT + i * 0.0004);
          emitT += n * 0.0004;
        } else setLine(line, level, emitT);
      }
      const trim = arr => { while (arr.length > 2 && arr[1][0] < clock - 2.6) arr.shift(); };
      const loop = kit.loop(dt => {
        clock += dt;
        if (queue !== 0) {
          qAcc += dt * ctl.values.speed;
          while (qAcc >= 1 && queue !== 0) { qAcc -= 1; const d = queue > 0 ? 1 : -1; queue -= d; step(d); }
          if (queue === 0) qAcc = 0;
        }
        trim(eA); trim(eB); trim(cnt);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        // the knob
        const r = Math.max(36, Math.min(54, W * 0.13)), kx = 16 + r + 6, ky = 16 + r + 8;
        geo = { kx, ky, r };
        c.beginPath(); c.arc(kx, ky, r, 0, Math.PI * 2); c.fillStyle = C.surface; c.fill(); c.lineWidth = 2; c.strokeStyle = C.muted; c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1.5;
        for (let i = 0; i < 20; i++) { const a = i * 18 * Math.PI / 180 - Math.PI / 2; c.beginPath(); c.moveTo(kx + Math.cos(a) * (r + 3), ky + Math.sin(a) * (r + 3)); c.lineTo(kx + Math.cos(a) * (r + 8), ky + Math.sin(a) * (r + 8)); c.stroke(); }
        const pa = counts * DEG * Math.PI / 180 - Math.PI / 2;
        c.strokeStyle = C.accent; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(kx, ky); c.lineTo(kx + Math.cos(pa) * r * 0.82, ky + Math.sin(pa) * r * 0.82); c.stroke(); c.lineCap = 'butt';
        kit.dot(c, kx, ky, 4, C.accent);
        kit.label(c, 'drag the knob', kx, ky + r + 18, { size: 10.5, color: C.faint, align: 'center' });
        // the numbers beside it
        const x0 = kx + r + 24;
        kit.label(c, 'position ' + Math.floor(tableCount / 4), x0, ky - 20, { size: 18, weight: 650 });
        kit.label(c, tableCount + ' counts, 4 per detent', x0, ky + 4, { size: 12, color: C.text2 });
        kit.label(c, lastDir > 0 ? 'clockwise: A leads B' : lastDir < 0 ? 'anticlockwise: B leads A' : 'at rest', x0, ky + 24, { size: 12, color: C.muted });
        // the traces
        const span = ctl.values.span, yT = ky + r + 32, hT = Math.max(120, H - yT - 6);
        const stair = [];
        cnt.forEach((p, i) => { if (i) stair.push([p[0], cnt[i - 1][1]]); stair.push(p); });
        stair.push([clock, cnt[cnt.length - 1][1]]);
        let lo = Infinity, hi = -Infinity;
        for (const p of stair) { lo = Math.min(lo, p[1]); hi = Math.max(hi, p[1]); }
        S.logic(c, 6, yT, W - 12, hT, [
          { label: 'A', edges: eA, color: C.series[0] },
          { label: 'B', edges: eB, color: C.series[1] },
          { label: 'count', pts: stair, color: C.ok, min: lo - 1, max: hi + 1 }
        ], { t0: clock - span, t1: clock, labelW: 46, grid: 10 });
        ro.set('counts', String(tableCount));
        ro.set('det', String(Math.floor(tableCount / 4)));
        ro.set('naive', naive + (Math.abs(naive - tableCount / 4) > 1 ? ' detents (wrong)' : ' detents'));
        ro.set('ang', (((counts * DEG) % 360) + 360) % 360 + '°');
      }, box.stage);
      kit.drag(st, {
        hover: true,
        hit: p => (Math.hypot(p.x - geo.kx, p.y - geo.ky) < geo.r + 16 ? 'k' : null),
        start: (k, p) => { lastA = Math.atan2(p.y - geo.ky, p.x - geo.kx); acc = 0; },
        move: (k, p) => {
          const a = Math.atan2(p.y - geo.ky, p.x - geo.kx);
          let d = a - lastA;
          if (d > Math.PI) d -= 2 * Math.PI;
          if (d < -Math.PI) d += 2 * Math.PI;
          lastA = a; acc += d * 180 / Math.PI;
          while (acc >= DEG) { step(1); acc -= DEG; }
          while (acc <= -DEG) { step(-1); acc += DEG; }
        },
        end: () => {}
      });
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ hi-keypad */
  Hyper.sim('hi-keypad', {
    title: 'Scanning a key matrix',
    blurb: `A 4 × 4 keypad on 8 pins. The chip drives **one row low at a time** (blue) and the columns that read low show where a key is closed. **Click keys** to press or release them.

**Try this**
- Press one key and watch the scan find it, in its row, as the row is driven.
- Press **three keys at the corners of a rectangle** (the button does it): the fourth corner is reported as well, a **ghost**, because current finds its way round through the three closed keys.
- Tick **a diode in series with every key**: the sneak path is blocked and the ghost goes.
- Keys in the same row or column never ghost; it takes three corners of a rectangle.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 350, maxH: 480 });
      const KEYS = '123A456B789C*0#D';
      const held = new Set();
      let scanT = 0, geo = { gx: 44, gy: 44, cs: 46 };
      const ctl = kit.controls(box.side, [
        { id: 'diodes', type: 'check', label: 'A diode in series with every key', value: false },
        { id: 'speed', label: 'Scan speed', min: 0.3, max: 4, step: 0.1, value: 1.2, unit: 'rows/s' },
        { type: 'buttons', items: [{ id: 'ghost', label: 'Press three keys', primary: true }, { id: 'clear', label: 'Release all' }] }
      ], id => {
        if (id === 'ghost') { held.clear(); ['0,0', '0,1', '1,0'].forEach(k => held.add(k)); } else if (id === 'clear') held.clear();
      });
      const ro = kit.readout(box.side, [['held', 'Keys held'], ['rep', 'Keys reported'], ['ghost', 'Phantom keys']]);
      // the columns that read low when row r is driven low (the other rows float)
      function lowColumns(r, diodes) {
        const cols = new Set();
        if (diodes) { for (let c = 0; c < 4; c++) if (held.has(r + ',' + c)) cols.add(c); return cols; }
        const seenR = new Set([r]), stack = [['r', r]];
        while (stack.length) {
          const [k, i] = stack.pop();
          if (k === 'r') { for (let c = 0; c < 4; c++) if (held.has(i + ',' + c) && !cols.has(c)) { cols.add(c); stack.push(['c', c]); } }
          else { for (let q = 0; q < 4; q++) if (held.has(q + ',' + i) && !seenR.has(q)) { seenR.add(q); stack.push(['r', q]); } }
        }
        return cols;
      }
      const loop = kit.loop(dt => {
        scanT += dt * ctl.values.speed;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, diodes = ctl.values.diodes;
        const row = Math.floor(scanT) % 4;
        const rep = new Set(), low = [];
        for (let r = 0; r < 4; r++) { const cols = lowColumns(r, diodes); if (r === row) cols.forEach(x => low.push(x)); cols.forEach(x => rep.add(r + ',' + x)); }
        const cs = clamp(Math.min((W - 90) / 4, (H - 150) / 4), 30, 50), gx = 44, gy = 46;
        geo = { gx, gy, cs };
        // column heads: lit when the column reads low in the row being scanned
        for (let k = 0; k < 4; k++) {
          const x = gx + k * cs + cs / 2, lit = low.includes(k);
          kit.dot(c, x, gy - 28, 5, lit ? C.ok : C.faint);
          S.text(c, 'C' + (k + 1), x, gy - 12, { size: 11, color: lit ? C.ok : C.muted, weight: lit ? 700 : 500 });
        }
        for (let r = 0; r < 4; r++) {
          const y = gy + r * cs, on = r === row;
          if (on) { c.fillStyle = C.dark ? 'rgba(123,140,255,.16)' : 'rgba(60,90,220,.10)'; c.fillRect(gx - 34, y + 1, 4 * cs + 34, cs - 2); }
          S.text(c, 'R' + (r + 1), gx - 18, y + cs / 2, { size: 12, color: on ? C.accent : C.muted, weight: on ? 700 : 500 });
          for (let k = 0; k < 4; k++) {
            const x = gx + k * cs, id = r + ',' + k, isHeld = held.has(id), isRep = rep.has(id), ghost = isRep && !isHeld;
            c.save();
            c.beginPath(); c.roundRect ? c.roundRect(x + 3, y + 3, cs - 6, cs - 6, 6) : c.rect(x + 3, y + 3, cs - 6, cs - 6);
            c.fillStyle = isHeld ? C.accent : ghost ? 'rgba(229,72,77,.22)' : C.surface; c.fill();
            c.lineWidth = ghost ? 2 : 1.4; c.strokeStyle = ghost ? C.bad : isHeld ? C.accent : C.faint;
            if (ghost) c.setLineDash([4, 3]);
            c.stroke();
            c.restore();
            S.text(c, KEYS[r * 4 + k], x + cs / 2, y + cs / 2, { size: Math.max(13, cs * 0.34), weight: 650, color: isHeld ? (C.dark ? '#0d1020' : '#fff') : ghost ? C.bad : C.text });
            if (diodes) { c.fillStyle = C.muted; c.beginPath(); c.moveTo(x + cs - 6, y + cs - 11); c.lineTo(x + cs - 6, y + cs - 5); c.lineTo(x + cs - 12, y + cs - 8); c.closePath(); c.fill(); }
          }
        }
        // the story of this scan
        const names = low.map(x => 'C' + (x + 1)).join(' ');
        const lines = ['Row ' + (row + 1) + ' is driven low;', 'the other rows are left floating.', 'Columns reading low: ' + (names || 'none'), diodes ? 'Diodes: one-way, no sneak path.' : 'No diodes: sneak paths possible.'];
        const wide = W - (gx + 4 * cs + 24) >= 190, tx = wide ? gx + 4 * cs + 24 : gx - 30, ty = wide ? gy + 8 : gy + 4 * cs + 22;
        lines.forEach((l, i) => kit.label(c, l, tx, ty + i * 17, { size: 11.5, color: i === 2 ? C.text : C.muted, weight: i === 2 ? 650 : 500 }));
        const ghosts = [...rep].filter(k => !held.has(k)).map(k => { const [r, q] = k.split(',').map(Number); return KEYS[r * 4 + q]; });
        ro.set('held', String(held.size));
        ro.set('rep', String(rep.size));
        ro.set('ghost', ghosts.length ? ghosts.join(' ') + ' (not pressed)' : 'none');
      }, box.stage);
      kit.click(st, p => {
        const k = Math.floor((p.x - geo.gx) / geo.cs), r = Math.floor((p.y - geo.gy) / geo.cs);
        if (k < 0 || k > 3 || r < 0 || r > 3) return;
        const id = r + ',' + k;
        if (held.has(id)) held.delete(id); else held.add(id);
      }, p => p.x >= geo.gx && p.x < geo.gx + 4 * geo.cs && p.y >= geo.gy && p.y < geo.gy + 4 * geo.cs);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ hi-touch */
  Hyper.sim('hi-touch', {
    title: 'A touch pin and its threshold',
    blurb: `The curve is what the touch pin reads as a finger approaches the pad (right is touching). The numbers are **schematic**: real values depend on the board, the wire and the cover, so print your own. **Drag on the graph** to move the finger.

**Try this**
- On the **ESP32** the reading **falls** as the finger comes close; on the **ESP32-S3** it **rises**. The threshold is on the other side of the baseline.
- Increase the **cover** thickness: the curve flattens and the finger must come closer, or the threshold margin must shrink.
- Tick **damp air**: the baseline moves, but the threshold stays where it was calibrated, and with a small margin an untouched pad now looks touched. Press **Calibrate now** to track the drift.
- A bigger margin is safer against drift and needs a firmer touch.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 330, maxH: 440 });
      const CH = { esp32: { name: 'ESP32', base: 75, falls: true }, s3: { name: 'ESP32-S3', base: 24000, falls: false } };
      const sig = (d, cover) => 1 / (1 + Math.pow((d + 1.2 * cover) / 4, 2));
      const dampF = (chip, damp) => (damp ? (CH[chip].falls ? 0.88 : 1.1) : 1);
      const reading = (chip, d, cover, damp, far) => {
        const k = CH[chip], s = far ? 0 : sig(d, cover);
        return k.falls ? k.base * dampF(chip, damp) * (1 - 0.7 * s) : k.base * dampF(chip, damp) * (1 + 0.25 * s);
      };
      let calib = null, plot = { x: 60, y: 60, w: 300, h: 200 };
      const calibrate = () => { const v = ctl.values; calib = reading(v.chip, 0, 0, v.damp, true); };
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: [['ESP32 (reading falls)', 'esp32'], ['ESP32-S3 (reading rises)', 's3']], value: 'esp32' },
        { id: 'd', label: 'Finger distance', min: 0, max: 20, step: 0.5, value: 20, unit: 'mm' },
        { id: 'cover', label: 'Cover over the pad', min: 0, max: 5, step: 0.5, value: 1, unit: 'mm' },
        { id: 'margin', label: 'Threshold margin', min: 5, max: 50, step: 1, value: 20, unit: '%' },
        { id: 'damp', type: 'check', label: 'Damp air or a wet pad', value: false },
        { type: 'buttons', items: [{ id: 'cal', label: 'Calibrate now', primary: true }] }
      ], id => { if (id === 'chip' || id === 'cal') calibrate(); loop.once(); });
      const ro = kit.readout(box.side, [['read', 'Reading'], ['base', 'Baseline when calibrated'], ['thr', 'Threshold'], ['state', 'The program says']]);
      calibrate();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H, k = CH[v.chip], m = v.margin / 100;
        const thr = k.falls ? calib * (1 - m) : calib * (1 + m);
        const r = reading(v.chip, v.d, v.cover, v.damp);
        const touched = k.falls ? r < thr : r > thr;
        // the graph
        const px = 56, py = 44, pw = W - px - 16, ph = H - py - 42;
        plot = { x: px, y: py, w: pw, h: ph };
        let lo = Infinity, hi = -Infinity;
        for (const dm of [false, true]) for (let i = 0; i <= 20; i++) { const y = reading(v.chip, i, v.cover, dm); lo = Math.min(lo, y); hi = Math.max(hi, y); }
        lo = Math.min(lo, thr, calib); hi = Math.max(hi, thr, calib);
        const pad = (hi - lo) * 0.1; lo -= pad; hi += pad;
        const X = d => px + (20 - d) / 20 * pw, Y = y => py + ph - (y - lo) / (hi - lo) * ph;
        c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.03)'; c.fillRect(px, py, pw, ph);
        // the touched side of the threshold
        const ty = Y(thr);
        c.fillStyle = C.dark ? 'rgba(34,179,122,.16)' : 'rgba(34,179,122,.14)';
        if (k.falls) c.fillRect(px, ty, pw, py + ph - ty); else c.fillRect(px, py, pw, ty - py);
        kit.label(c, 'counts as touched', px + pw - 6, k.falls ? Math.min(py + ph - 10, ty + 14) : Math.max(py + 10, ty - 14), { size: 10.5, color: C.ok, align: 'right' });
        c.save(); c.lineWidth = 1.5; c.setLineDash([5, 4]);
        c.strokeStyle = C.warn; c.beginPath(); c.moveTo(px, ty); c.lineTo(px + pw, ty); c.stroke();
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(px, Y(calib)); c.lineTo(px + pw, Y(calib)); c.stroke();
        c.restore();
        kit.label(c, 'threshold', px + 6, ty + (k.falls ? -9 : 10), { size: 10.5, color: C.warn });
        kit.label(c, 'baseline when calibrated', px + 6, Y(calib) + (Y(calib) < ty ? -9 : 10), { size: 10.5, color: C.muted });
        const curve = (dm, col, w) => { c.beginPath(); for (let i = 0; i <= 80; i++) { const d = 20 - i / 4, x = X(d), y = Y(reading(v.chip, d, v.cover, dm)); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.strokeStyle = col; c.lineWidth = w; c.stroke(); };
        if (v.damp) curve(false, C.faint, 1.5);
        curve(v.damp, C.accent, 2.5);
        kit.dot(c, X(v.d), Y(r), 6, touched ? C.ok : C.accent, C.text);
        kit.label(c, touched ? 'TOUCHED' : 'not touched', px, 22, { size: 17, weight: 700, color: touched ? C.ok : C.muted });
        kit.label(c, k.name + ': the reading ' + (k.falls ? 'falls' : 'rises') + ' on touch', px + pw, 22, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, '20 mm away', px, py + ph + 14, { size: 10.5, color: C.faint });
        kit.label(c, 'touching', px + pw, py + ph + 14, { size: 10.5, color: C.faint, align: 'right' });
        kit.label(c, 'finger distance: drag here', px + pw / 2, py + ph + 30, { size: 10.5, color: C.muted, align: 'center' });
        ro.set('read', String(Math.round(r)));
        ro.set('base', String(Math.round(calib)));
        ro.set('thr', String(Math.round(thr)));
        ro.set('state', touched ? 'touched' : 'not touched');
      }, box.stage);
      const setD = p => { const d = Math.round((20 - clamp((p.x - plot.x) / plot.w, 0, 1) * 20) * 2) / 2; ctl.set('d', d); loop.once(); };
      kit.drag(st, { hover: true, hit: p => (p.x >= plot.x - 4 && p.x <= plot.x + plot.w + 4 && p.y >= plot.y && p.y <= plot.y + plot.h ? 'g' : null), start: (k, p) => setD(p), move: (k, p) => setD(p), end: () => {} });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ hi-joystick */
  Hyper.sim('hi-joystick', {
    title: 'A thumb joystick and the ADC',
    blurb: `Each axis is a voltage the 12-bit ADC turns into 0–4095. **Drag the stick** in the square: the bars show the raw counts and the scaled output (−100…+100). The dashed square is the dead zone.

**Try this**
- Let go of the stick: the raw values return to the module's *own* centre (here 2138 and 1988, not 2048). With the program assuming 2048 and the dead zone at 0, the output **creeps**.
- Press **Measure the centre**: the assumed centre moves to where the stick really rests and the dead zone square settles around it.
- Raise the **ADC noise** with the dead zone at 0: the output flickers by a count or two at rest. A dead zone of about 5–8 % hides it.
- Push the stick to the end: the raw value reaches 4095 and stays there, and each side of the centre is scaled on its own span.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300, maxH: 420 });
      let sx = 0, sy = 0, dragging = false, centreX = 2048, centreY = 2048, pad = { x: 16, y: 16, s: 160 };
      const ctl = kit.controls(box.side, [
        { id: 'offx', label: 'Centre offset of the module, X', min: -250, max: 250, step: 5, value: 90, unit: 'counts' },
        { id: 'offy', label: 'Centre offset of the module, Y', min: -250, max: 250, step: 5, value: -60, unit: 'counts' },
        { id: 'dz', label: 'Dead zone', min: 0, max: 25, step: 1, value: 8, unit: '%' },
        { id: 'noise', label: 'ADC noise', min: 0, max: 80, step: 5, value: 30, unit: 'counts' },
        { type: 'buttons', items: [{ id: 'cal', label: 'Measure the centre', primary: true }, { id: 'uncal', label: 'Assume 2048' }] }
      ], id => {
        if (id === 'cal') { centreX = 2048 + ctl.values.offx; centreY = 2048 + ctl.values.offy; }
        else if (id === 'uncal') { centreX = 2048; centreY = 2048; }
      });
      const ro = kit.readout(box.side, [['raw', 'Raw X, Y'], ['out', 'Output X, Y'], ['centre', 'Centre assumed'], ['rest', 'Output at rest']]);
      const scaled = (raw, centre, dz) => {
        let span = raw >= centre ? 4095 - centre : centre;
        if (span < 1) span = 1;
        const v = Math.trunc((raw - centre) * 100 / span);
        return Math.abs(v) < dz ? 0 : v;
      };
      const loop = kit.loop(dt => {
        if (!dragging) { const k = Math.min(1, dt * 12); sx -= sx * k; sy -= sy * k; }
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const nz = () => (Math.random() - 0.5) * 2 * v.noise;
        const rawX = clamp(Math.round(2048 + v.offx + sx * 1900 + nz()), 0, 4095), rawY = clamp(Math.round(2048 + v.offy + sy * 1900 + nz()), 0, 4095);
        const outX = scaled(rawX, centreX, v.dz), outY = scaled(rawY, centreY, v.dz);
        // the pad
        const ps = clamp(Math.min(W * 0.4, H - 40), 130, 220), x0 = 16, y0 = 16;
        pad = { x: x0, y: y0, s: ps };
        const cx = x0 + ps / 2, cy = y0 + ps / 2, PX = s => cx + s * ps / 2, PY = s => cy - s * ps / 2;
        c.fillStyle = C.surface; c.fillRect(x0, y0, ps, ps); c.strokeStyle = C.faint; c.lineWidth = 1.5; c.strokeRect(x0, y0, ps, ps);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(cx, y0); c.lineTo(cx, y0 + ps); c.moveTo(x0, cy); c.lineTo(x0 + ps, cy); c.stroke();
        // the dead zone: where the output is zero, around the assumed centre
        const zx = (centreX - 2048 - v.offx) / 1900, zy = (centreY - 2048 - v.offy) / 1900, hw = v.dz / 100 * 2047 / 1900;
        c.save(); c.setLineDash([4, 3]); c.strokeStyle = C.warn; c.lineWidth = 1.6;
        c.fillStyle = 'rgba(224,160,48,.14)'; c.fillRect(PX(zx - hw), PY(zy + hw), hw * ps, hw * ps);
        c.strokeRect(PX(zx - hw), PY(zy + hw), hw * ps, hw * ps);
        c.restore();
        kit.dot(c, cx, cy, 2.5, C.muted);
        const dx = PX(sx), dy = PY(sy);
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(cx, cy); c.lineTo(dx, dy); c.stroke();
        kit.dot(c, dx, dy, 11, C.accent, C.text);
        kit.label(c, 'drag the stick', x0 + ps / 2, y0 + ps + 14, { size: 10.5, color: C.faint, align: 'center' });
        // the bars: raw counts, then the scaled output
        const bx = x0 + ps + 28, bw = Math.max(80, W - bx - 16);
        const bar = (i, title, val, text, lo, hi, marks, fillCol) => {
          const y = 22 + i * 38;
          kit.label(c, title, bx, y - 8, { size: 11, color: C.text2, weight: 600 });
          kit.label(c, text, bx + bw, y - 8, { size: 11, color: C.text, align: 'right', weight: 650 });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'; c.fillRect(bx, y, bw, 12);
          const X = q => bx + (q - lo) / (hi - lo) * bw;
          c.fillStyle = fillCol; c.fillRect(Math.min(X(val), X(marks[0])), y, Math.abs(X(val) - X(marks[0])), 12);
          marks.forEach((m, k) => { c.strokeStyle = k ? C.warn : C.text; c.lineWidth = 1.5; c.setLineDash(k ? [3, 2] : []); c.beginPath(); c.moveTo(X(m), y - 3); c.lineTo(X(m), y + 15); c.stroke(); });
          c.setLineDash([]);
        };
        bar(0, 'X raw (ADC counts)', rawX, String(rawX), 0, 4095, [2048, centreX], C.series[0]);
        bar(1, 'Y raw (ADC counts)', rawY, String(rawY), 0, 4095, [2048, centreY], C.series[1]);
        bar(2, 'X output', outX, String(outX), -100, 100, [0], outX ? C.ok : C.faint);
        bar(3, 'Y output', outY, String(outY), -100, 100, [0], outY ? C.ok : C.faint);
        kit.label(c, 'solid mark: 2048', bx, 22 + 4 * 38 - 6, { size: 10, color: C.muted });
        kit.label(c, 'dashed mark: centre the program assumes', bx, 22 + 4 * 38 + 8, { size: 10, color: C.warn });
        ro.set('raw', rawX + ', ' + rawY);
        ro.set('out', outX + ', ' + outY);
        ro.set('centre', centreX + ', ' + centreY);
        ro.set('rest', scaled(2048 + v.offx, centreX, v.dz) + ', ' + scaled(2048 + v.offy, centreY, v.dz));
      }, box.stage);
      kit.drag(st, {
        hover: true,
        hit: p => (p.x >= pad.x - 6 && p.x <= pad.x + pad.s + 6 && p.y >= pad.y - 6 && p.y <= pad.y + pad.s + 6 ? 'p' : null),
        start: (k, p) => { dragging = true; sx = clamp((p.x - pad.x - pad.s / 2) / (pad.s / 2), -1, 1); sy = clamp(-(p.y - pad.y - pad.s / 2) / (pad.s / 2), -1, 1); },
        move: (k, p) => { sx = clamp((p.x - pad.x - pad.s / 2) / (pad.s / 2), -1, 1); sy = clamp(-(p.y - pad.y - pad.s / 2) / (pad.s / 2), -1, 1); },
        end: () => { dragging = false; }
      });
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ hi-nec */
  Hyper.sim('hi-nec', {
    title: 'An NEC infrared frame',
    blurb: `The top trace is the infrared LED's **envelope** (high while it sends the 38 kHz carrier); the lower trace is what the **receiver module's pin** shows: the same, upside down, idling high. The decoder times the gaps between the *falling edges* of the pin, exactly as the program on the page does.

**Try this**
- Change the address and the command: the bit pattern changes, the **frame stays about 68 ms** long, because every byte is sent with its inverse.
- Choose *leader and first byte*: the 9 ms burst, the 4.5 ms gap, then 8 bits. A short gap is a 0, a long gap a 1.
- Tick **key held**: after 108 ms a short repeat code follows, and again every 108 ms while the key is down.
- The bytes are sent lowest bit first: command 0x45 is written 10100010.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 310, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'addr', label: 'Address byte', min: 0, max: 255, step: 1, value: 0, fmt: q => '0x' + hex2(Math.round(q)) },
        { id: 'cmd', label: 'Command byte', min: 0, max: 255, step: 1, value: 69, fmt: q => '0x' + hex2(Math.round(q)) },
        { id: 'zoom', type: 'select', label: 'Window', options: [['whole frame', 'all'], ['leader and first byte', 'head']], value: 'all' },
        { id: 'held', type: 'check', label: 'Key held (repeat codes)', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['addr', 'Decoded address'], ['cmd', 'Decoded command'], ['check', 'Inverse bytes'], ['len', 'Frame length']]);
      // time the falling edges of the receiver pin, then decode them as the program does
      function decode(falls) {
        if (falls.length !== 34) return null;
        const lead = falls[1] - falls[0];
        if (lead < 0.012 || lead > 0.015) return null;
        let code = 0;
        for (let i = 0; i < 32; i++) if (falls[i + 2] - falls[i + 1] > 0.0017) code += Math.pow(2, i);
        const b = [0, 8, 16, 24].map(s => Math.floor(code / Math.pow(2, s)) % 256);
        return { a: b[0], na: b[1], c: b[2], nc: b[3], ok: (b[0] ^ b[1]) === 255 && (b[2] ^ b[3]) === 255 };
      }
      const bitsOf = byte => { let s = ''; for (let i = 0; i < 8; i++) s += (byte >> i) & 1; return s; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const a = Math.round(v.addr), cm = Math.round(v.cmd);
        const f = E.proto.nec(a, cm, { t: 0 });
        const edges = f.edges.slice(), marks = [];
        const names = ['address', '~address', 'command', '~command'], wide = W >= 560;
        f.marks.forEach((m, i) => marks.push({ t0: m.t0, t1: m.t1, text: i === 0 ? 'leader' : (wide ? names[i - 1] + ' ' : '') + m.text.replace('0x', '') }));
        const frameEnd = f.edges[f.edges.length - 1][0];
        if (v.held) for (let k = 1; k <= 2; k++) { const T = k * 0.108; edges.push([T, 1], [T + 0.009, 0], [T + 0.01125, 1], [T + 0.01125 + 0.00056, 0]); marks.push({ t0: T, t1: T + 0.0118, text: 'repeat' }); }
        const rx = edges.map(e => [e[0], 1 - e[1]]);
        const falls = []; let prev = 1;
        for (const [t, lv] of rx) { if (prev === 1 && lv === 0) falls.push(t); prev = lv; }
        const group = [falls[0]];
        for (let i = 1; i < falls.length; i++) { if (falls[i] - falls[i - 1] > 0.02) break; group.push(falls[i]); }
        const d = decode(group);
        const t1 = v.zoom === 'head' ? 0.0345 : v.held ? 0.108 * 2 + 0.0165 : frameEnd + 0.004;
        const pxPerS = (W - 12 - 40) / (t1 + 0.003);
        const shown = marks.filter(m => m.t0 < t1).map(m => ({ t0: m.t0, t1: m.t1, text: (m.t1 - m.t0) * pxPerS < m.text.length * 6.4 + 8 ? '' : m.text }));
        S.logic(c, 6, 6, W - 12, H - 66, [
          { label: 'LED', edges, color: C.series[3], marks: shown },
          { label: 'pin', edges: rx, color: C.series[0] }
        ], { t0: -0.003, t1, labelW: 40, grid: 10 });
        const bits = [a, ~a & 255, cm, ~cm & 255].map(bitsOf).join(' ');
        kit.label(c, 'sent lowest bit first: address · inverse · command · inverse', 10, H - 44, { size: 10.5, color: C.muted });
        S.text(c, bits, 10, H - 24, { size: 12.5, mono: true, align: 'left', color: C.text });
        ro.set('addr', d ? '0x' + hex2(d.a) + ' (' + d.a + ')' : 'frame error');
        ro.set('cmd', d ? '0x' + hex2(d.c) + ' (' + d.c + ')' : 'frame error');
        ro.set('check', d ? (d.ok ? 'both match: accepted' : 'mismatch: rejected') : '—');
        ro.set('len', kit.fmt(frameEnd * 1000, 3) + ' ms' + (v.held ? ' + a repeat every 108 ms' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
