/* HYPER-ESP32 · sims/worked-projects-2.js
 *
 * One simulation per project of the second half of "Worked projects". Each draws the project's block diagram and its state
 * machine in one stage, and the reader operates the machine: buttons and ticks for the events, a clock (up to thousands of
 * times faster than real time) for the timeouts, and the numbers of the design in the read-out.
 *
 *   wp2-matrix-clock    five states of a network-timed clock, the 8 x 32 matrix and its current
 *   wp2-robot-car       a car, a phone that may go quiet, and the stop on silence
 *   wp2-data-logger     an SD card that may vanish, a flush policy, and what a power cut costs
 *   wp2-garage-door     a door the opener moves, two limit switches, time-outs and an obstruction
 *   wp2-zigbee-switch   a battery switch that sleeps, wakes, rejoins and sends: energy per press
 *   wp2-lora-sensor     a field node: air time, the duty-cycle guard and the battery
 *   wp2-voice-lamp      a lamp that listens: wake word, a short window, a mute switch
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const fmtS = ms => (ms / 1000).toFixed(1) + ' s';
  const fmtDur = s => (s < 90 ? Math.round(s) + ' s' : s < 5400 ? Math.round(s / 60) + ' min' : s < 172800 ? (s / 3600).toFixed(1) + ' h' : (s / 86400).toFixed(1) + ' days');
  const isNarrow = box => (box.stage.clientWidth || 700) < 560;
  const MONO = 'Consolas, "Cascadia Code", monospace';

  /* ---------------------------------------------------------------- the machine and its drawing (as in the State machines topic) */
  function findArrow(dia, from, to, why) {
    const ts = dia.transitions;
    let i = ts.findIndex(t => t.from === from && t.to === to && t.ev === why);
    if (i < 0 && /^after/.test(String(why))) i = ts.findIndex(t => t.from === from && t.to === to && /^after/.test(t.ev));
    if (i < 0) i = ts.findIndex(t => t.from === from && t.to === to);
    return i;
  }
  /* a running machine together with its drawing. o: { layout, bends, guards, ctx, rw, onChange } */
  function bench(kit, def, o) {
    o = o || {};
    const b = { def, o, idx: -1, t: 99, last: null };
    b.dia = kit.esp.fsmDiagram(def, o.layout || {});
    const seen = {};
    for (const t of b.dia.transitions) {
      const k = t.from + '>' + t.to, n = seen[k] = (seen[k] || 0) + 1, v = o.bends && o.bends[k];
      if (v != null) t.bend = Array.isArray(v) ? v[n - 1] : v;
    }
    b.m = kit.esp.fsm(def, {
      guards: o.guards, ctx: o.ctx,
      onChange(from, to, why, actions) {
        b.idx = findArrow(b.dia, from, to, why); b.t = 0; b.last = { from, to, why, actions };
        if (o.onChange) o.onChange(from, to, why, actions);
      }
    });
    return b;
  }
  function drawLog(kit, c, x, y, w, m, rows) {
    const C = kit.colors();
    kit.label(c, 'what happened', x, y, { size: 10.5, color: C.faint, weight: 600 });
    const lines = m.log.slice(-rows);
    if (!lines.length) { kit.label(c, 'nothing yet', x, y + 17, { size: 11, color: C.faint }); return; }
    const maxc = Math.max(18, Math.floor(w / 6.2));
    lines.forEach((e, i) => {
      let s = e.error ? e.error : fmtS(e.t) + '   ' + e.from + ' → ' + e.to + '   (' + e.why + ')' + (e.actions && e.actions.length ? '   · ' + e.actions.join(', ') : '');
      if (s.length > maxc) s = s.slice(0, maxc - 1) + '…';
      kit.label(c, s, x, y + 17 + i * 15, { size: 11, color: e.error ? C.bad : i === lines.length - 1 ? C.text : C.muted });
    });
  }

  /* ---------------------------------------------------------------- the shared stage
     cfg: { def, layout, bends, guards, ctx, rw, controls, onControl(id, v, h), onChange(from, to, why, actions, h), step(s, h) (s = seconds of simulated time),
            scene(c, rect, h, C), readouts: [[key, label]], readout(h, ro), speed: id of the clock-speed control, fsmFrac, aspect, aspectN } */
  function harness(kit, box, cfg) {
    const narrow = isNarrow(box);
    const st = kit.stage(box.stage, { aspect: narrow ? (cfg.aspectN || 1.75) : (cfg.aspect || 0.8), minH: 440, maxH: 780 });
    const h = { E: kit.esp, S: kit.esym, kit, st, T: 0, narrow };
    h.B = bench(kit, cfg.def, { layout: cfg.layout, bends: cfg.bends, guards: cfg.guards, ctx: cfg.ctx, rw: cfg.rw || 40, onChange(from, to, why, actions) { if (cfg.onChange) cfg.onChange(from, to, why, actions, h); } });
    h.m = h.B.m;
    if (cfg.merge) {                           // parallel arrows between two states are drawn once, with their labels joined
      const seen = new Map();
      h.B.dia.transitions = h.B.dia.transitions.filter(t => { const k = t.from + '>' + t.to, f = seen.get(k); if (t.from === t.to) return true; if (f) { f.label += ' · ' + t.label; return false; } seen.set(k, t); return true; });
    }
    if (cfg.labels) for (const [k, v] of Object.entries(cfg.labels)) { const [a, b] = k.split('>'); const t = h.B.dia.transitions.find(x => x.from === a && x.to === b); if (t) t.label = v; }
    h.ctl = kit.controls(box.side, cfg.controls, (id, v) => { if (cfg.onControl) cfg.onControl(id, v, h); h.loop.once(); });
    h.ro = kit.readout(box.side, cfg.readouts);
    h.advance = sec => {                       // jump ahead: the clock runs, the events that depend on time happen
      const n = Math.max(1, Math.ceil(sec / 5)), s = sec / n;
      for (let i = 0; i < n; i++) { h.T += s; if (cfg.step) cfg.step(s, h); h.m.tick(s * 1000); }
    };
    h.loop = kit.loop((dt, t) => {
      const speed = cfg.speed ? (h.ctl.values[cfg.speed] || 1) : 1;
      const sdt = dt * speed, n = Math.max(1, Math.ceil(sdt / (cfg.maxStep || 0.05)));
      for (let i = 0; i < n; i++) { const s = sdt / n; h.T += s; if (cfg.step) cfg.step(s, h); h.m.tick(s * 1000); }
      h.B.t += dt; h.rt = t;
      h.draw();
    }, box.stage);
    h.draw = () => {
      const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, fr = cfg.fsmFrac || 0.55;
      let fsm, scene, logY;
      if (!narrow) { fsm = { x: M, y: M, w: W * fr - M, h: H * 0.66 }; scene = { x: W * fr + 4, y: M, w: W * (1 - fr) - M - 4, h: H * 0.66 }; logY = H * 0.66 + 30; }
      else { const fh = cfg.fsmHN || 0.37; fsm = { x: M, y: M, w: W - 2 * M, h: H * fh }; scene = { x: M, y: H * fh + 16, w: W - 2 * M, h: H * (0.73 - fh) }; logY = H * 0.73 + 28; }
      kit.esym.fsm(c, h.B.dia, { box: fsm, active: h.m.state, fired: h.B.t < 1.6 ? h.B.idx : -1, pulse: h.B.t / 0.7, rw: h.B.o.rw });
      if (cfg.scene) cfg.scene(c, scene, h, C);
      drawLog(kit, c, M, logY, W - 2 * M, h.m, Math.max(2, Math.floor((H - logY - 8) / 15)));
      if (cfg.readout) cfg.readout(h, h.ro);
    };
    st.onResize(() => h.loop.once());
    h.loop.start();
    return h;
  }

  /* a block diagram: nodes at fractions of a rectangle, links between their edges, the lit ones drawn active.
     nodes: [{ id, label, sub, x, y, w }], links: [[a, b, { label, wireless, dash }]], lit: a Set of ids */
  function diagram(kit, c, R, nodes, links, lit, o) {
    o = o || {};
    const S = kit.esym, C = kit.colors(), pos = {};
    const nw = Math.max(52, Math.min(o.w || 92, R.w / (o.cols || 3) - 8)), nh = o.h || 36;
    for (const n of nodes) pos[n.id] = { cx: R.x + n.x * R.w, cy: R.y + n.y * R.h, w: n.w || nw, h: n.h || nh };
    const edge = (p, q) => {
      const dx = q.cx - p.cx, dy = q.cy - p.cy;
      const k = Math.min((p.w / 2 + 2) / Math.max(Math.abs(dx), 1e-9), (p.h / 2 + 2) / Math.max(Math.abs(dy), 1e-9), 1);
      return [p.cx + dx * k, p.cy + dy * k];
    };
    for (const [a, b, lo] of links) {
      const p = pos[a], q = pos[b];
      if (!p || !q) continue;
      const A = edge(p, q), Z = edge(q, p), on = lit && lit.has(a) && lit.has(b);
      S.link(c, A[0], A[1], Z[0], Z[1], Object.assign({ color: on ? C.accent : undefined, width: on ? 2.2 : 1.5 }, lo || {}));
    }
    for (const n of nodes) {
      const p = pos[n.id];
      S.box(c, p.cx - p.w / 2, p.cy - p.h / 2, p.w, p.h, { label: n.label, sub: n.sub, size: n.size || 11.5, active: !!(lit && lit.has(n.id)), color: n.color, dash: n.dash });
    }
    return pos;
  }

  /* ================================================================ wp2-matrix-clock */
  const FONT35 = [[7, 5, 5, 5, 7], [2, 6, 2, 2, 7], [7, 1, 7, 4, 7], [7, 1, 7, 1, 7], [5, 5, 7, 1, 1], [7, 4, 7, 1, 7], [7, 4, 7, 5, 7], [7, 1, 1, 2, 2], [7, 5, 7, 5, 7], [7, 5, 7, 1, 7]];
  const DIGIT_X = [7, 11, 17, 21];
  /* the 32 x 8 picture the program draws: 0 dark, 1 lit, 2 the red pixel */
  function matrixPicture(state, hh, mm, colon, tick) {
    const px = Array.from({ length: 32 }, () => new Array(8).fill(0));
    const digit = (d, x0) => { for (let r = 0; r < 5; r++) for (let k = 0; k < 3; k++) if (FONT35[d][r] & (4 >> k)) px[x0 + k][r + 1] = 1; };
    if (state === 'RUNNING' || state === 'STALE') {
      [Math.floor(hh / 10), hh % 10, Math.floor(mm / 10), mm % 10].forEach((d, i) => digit(d, DIGIT_X[i]));
      if (colon) { px[15][2] = 1; px[15][4] = 1; }
      if (state === 'STALE') px[0][0] = 2;
    } else if (state === 'OFFLINE') {
      for (let i = 0; i < 4; i++) for (let k = 0; k < 3; k++) px[DIGIT_X[i] + k][3] = 1;
    } else px[tick % 32][7] = 1;
    return px;
  }

  Hyper.sim('wp2-matrix-clock', {
    title: 'The matrix clock: five states',
    blurb: `The chip, the matrix and the five states of the clock. The router and the time server are two switches you control; the clock can run up to twenty thousand times faster than real time, or jump six hours at a time.

**Try this**
- Start with both ticked: CONNECTING, SYNCING, RUNNING in a few seconds. Watch the matrix and the **current**.
- Untick **the time server answers**, then speed the clock up (or press *Jump ahead 6 hours* four times): after 24 hours RUNNING becomes STALE and a red pixel appears. Tick the server again: the next attempt brings RUNNING back.
- Press *Start again* with **the router is reachable** unticked: the machine gives up and shows dashes, never a wrong time.
- Raise the **brightness** with the button and read the current: it must stay inside the supply.`,
    mount(box, kit) {
      const E = kit.esp;
      const def = { start: 'CONNECTING', states: {
        CONNECTING: { entry: 'moving dot', on: { WIFI_UP: 'SYNCING' }, after: { 20000: 'OFFLINE' } },
        SYNCING: { entry: 'moving dot', on: { TIME_SET: 'RUNNING' }, after: { 10000: 'OFFLINE' } },
        RUNNING: { entry: 'show time', on: { TIME_SET: 'RUNNING' }, after: { 86400000: 'STALE' } },
        STALE: { entry: 'red pixel', on: { TIME_SET: 'RUNNING' } },
        OFFLINE: { entry: 'dashes', on: { TIME_SET: 'RUNNING' } } } };
      const LEVELS = [8, 20, 50, 100];
      let level = 1, lastSync = null, attempt = 0;
      const start = 12 * 3600 + 34 * 60 + 10;            // the chip's clock before the first answer: wrong on purpose
      let lit = 0;
      const h = harness(kit, box, {
        def, rw: 42, fsmFrac: 0.5,
        layout: { CONNECTING: [0.08, 0.2], SYNCING: [0.5, 0.2], RUNNING: [0.92, 0.2], OFFLINE: [0.3, 0.88], STALE: [0.92, 0.88] },
        bends: { 'RUNNING>STALE': 64, 'STALE>RUNNING': 64 }, labels: { 'RUNNING>STALE': 'after 24 h' },
        controls: [
          { id: 'router', type: 'check', label: 'The router is reachable', value: true },
          { id: 'server', type: 'check', label: 'The time server answers', value: true },
          { id: 'speed', label: 'Clock speed', min: 1, max: 20000, step: 1, value: 20, log: true, unit: '×', sig: 2 },
          { type: 'buttons', items: [{ id: 'press', label: 'Press the brightness button', primary: true }, { id: 'jump', label: 'Jump ahead 6 hours' }, { id: 'reset', label: 'Start again' }] }
        ],
        speed: 'speed', maxStep: 0.25,
        onControl(id, v, hh) {
          if (id === 'press') level = (level + 1) % 4;
          else if (id === 'jump') hh.advance(6 * 3600);
          else if (id === 'reset') { hh.m.reset(); hh.B.idx = -1; hh.B.t = 99; hh.T = 0; lastSync = null; attempt = 0; }
        },
        step(s, hh) {
          const v = hh.ctl.values, st = hh.m.state, ms = hh.m.inState();
          const sync = () => { hh.m.send('TIME_SET'); lastSync = hh.T; attempt = 0; };
          if (st === 'CONNECTING' && v.router && ms >= 2000) hh.m.send('WIFI_UP');
          else if (st === 'SYNCING' && v.router && v.server && ms >= 1500) sync();
          else if (st === 'RUNNING' || st === 'STALE' || st === 'OFFLINE') {
            attempt += s;                                   // the system asks again: hourly when running, soon when not
            if (attempt >= (st === 'RUNNING' ? 3600 : 60)) { attempt = 0; if (v.router && v.server) sync(); }
          }
        },
        scene(c, R, hh, C) {
          const S = hh.S, st = hh.m.state;
          const on = new Set(['esp']);
          if (st === 'CONNECTING' || st === 'SYNCING') on.add('router');
          if (st === 'RUNNING' || st === 'STALE') on.add('matrix');
          diagram(kit, c, { x: R.x, y: R.y, w: R.w, h: R.h * 0.4 }, [
            { id: 'router', label: 'Router', sub: 'time server', x: 0.17, y: 0.2 }, { id: 'esp', label: 'ESP32-C3', sub: 'GPIO3, GPIO10', x: 0.5, y: 0.2 }, { id: 'btn', label: 'Button', sub: 'GPIO10', x: 0.83, y: 0.2 },
            { id: 'psu', label: '5 V supply', sub: '2 A', x: 0.17, y: 0.8 }, { id: 'shift', label: 'Level shift', sub: '74AHCT125', x: 0.5, y: 0.8 }, { id: 'matrix', label: '8 × 32', sub: 'matrix', x: 0.83, y: 0.8 }
          ], [['router', 'esp', { wireless: true }], ['btn', 'esp'], ['esp', 'shift'], ['psu', 'shift', { label: '5 V' }], ['shift', 'matrix']], on, { cols: 3 });
          // the display
          const tod = start + hh.T;                           // the real time of day
          const sec = Math.floor(tod) % 86400, hhh = Math.floor(sec / 3600), mmm = Math.floor(sec / 60) % 60;
          const colon = Math.floor((hh.rt || 0) * 2) % 2 === 0;
          const px = matrixPicture(st, hhh, mmm, colon, Math.floor((hh.rt || 0) * 12));
          const cs = Math.max(4, Math.min(11, Math.floor((R.w - 12) / 32))), mw = cs * 32, mh = cs * 8, mx = R.x + (R.w - mw) / 2, my = R.y + R.h * 0.5;
          c.fillStyle = '#12141a'; c.fillRect(mx - 4, my - 4, mw + 8, mh + 8);
          lit = 0;
          const alpha = 0.3 + 0.7 * LEVELS[level] / 100;
          for (let x = 0; x < 32; x++) for (let y = 0; y < 8; y++) {
            const v = px[x][y];
            if (v) lit++;
            c.beginPath(); c.arc(mx + (x + 0.5) * cs, my + (y + 0.5) * cs, cs * 0.36, 0, 6.2832);
            c.fillStyle = v === 2 ? 'rgb(255,70,60)' : v === 1 ? 'rgba(255,140,20,' + alpha.toFixed(2) + ')' : '#2a2d37'; c.fill();
          }
          kit.label(c, st === 'RUNNING' || st === 'STALE' ? 'the program draws this' : st === 'OFFLINE' ? 'never set: dashes, not a guess' : 'looking for the time', R.x + R.w / 2, my + mh + 18, { size: 11, color: C.muted, align: 'center' });
          kit.label(c, 'brightness ' + LEVELS[level] + ' of 255', R.x + R.w / 2, my + mh + 34, { size: 11, color: C.text2, align: 'center' });
        },
        readouts: [['state', 'State'], ['age', 'Since the last answer'], ['err', 'Clock error since then'], ['lit', 'Pixels lit'], ['amps', 'Matrix and board']],
        readout(hh, ro) {
          const age = lastSync == null ? null : hh.T - lastSync;
          ro.set('state', hh.m.state);
          ro.set('age', age == null ? 'never heard' : fmtDur(age));
          ro.set('err', age == null ? '—' : (age * 20e-6).toFixed(2) + ' s (20 ppm crystal)');
          ro.set('lit', lit + ' of 256');
          const mA = E.pixelCurrent(256, (lit / 256) * LEVELS[level] / 255, 60) + 100;
          ro.set('amps', (mA / 1000).toFixed(2) + ' A at 5 V' + (mA > 1800 ? '  (too much for 2 A)' : ''));
        }
      });
    }
  });

  /* ================================================================ wp2-robot-car */
  Hyper.sim('wp2-robot-car', {
    title: 'The robot car and its failsafe',
    blurb: `The phone sends the two slider values ten times a second. The four states keep the car safe when it does not. The yard shows what the wheels really do.

**Try this**
- Tick **a phone is connected**, push both sliders forward: WAITING, READY, DRIVING, and the car drives.
- Untick **the radio link** while driving: 400 ms later FAILSAFE brakes the car. Tick the link again with the sliders still pushed: the car does **not** move.
- Press *Sliders to zero*: READY. Now it may drive again.
- Untick **a phone is connected** while driving: straight to WAITING, motors braked at once.
- Make the two sliders different to steer: the car turns towards the slower wheel.`,
    mount(box, kit) {
      const car = { x: 0, y: 0, a: -Math.PI / 2, set: false };
      let acc = 0, lastCmdT = -10;
      const def = { start: 'WAITING', states: {
        WAITING: { entry: 'brake', on: { CONNECT: 'READY' } },
        READY: { entry: 'brake', on: { DRIVE: 'DRIVING', LEAVE: 'WAITING' } },
        DRIVING: { entry: 'follow sliders', on: { DRIVE: 'DRIVING', STOP: 'READY', LEAVE: 'WAITING' }, after: { 400: 'FAILSAFE' } },
        FAILSAFE: { entry: 'brake', on: { STOP: 'READY', LEAVE: 'WAITING' } } } };
      const MAXS = 0.8;
      const applied = hh => (hh.m.state === 'DRIVING' ? [hh.ctl.values.left * MAXS, hh.ctl.values.right * MAXS] : [0, 0]);
      const h = harness(kit, box, {
        def, rw: 42, fsmFrac: 0.54,
        layout: { WAITING: [0.1, 0.5], READY: [0.5, 0.2], DRIVING: [0.9, 0.5], FAILSAFE: [0.5, 0.86] },
        bends: { 'DRIVING>WAITING': 34, 'FAILSAFE>READY': 34 },
        controls: [
          { id: 'phone', type: 'check', label: 'A phone is connected', value: false },
          { id: 'link', type: 'check', label: 'The radio link works', value: true },
          { id: 'left', label: 'Left slider', min: -100, max: 100, step: 5, value: 0, unit: '%' },
          { id: 'right', label: 'Right slider', min: -100, max: 100, step: 5, value: 0, unit: '%' },
          { id: 'speed', label: 'Clock speed', min: 1, max: 5, step: 1, value: 1, unit: '×' },
          { type: 'buttons', items: [{ id: 'zero', label: 'Sliders to zero', primary: true }, { id: 'reset', label: 'Start again' }] }
        ],
        speed: 'speed',
        onControl(id, v, hh) {
          if (id === 'phone') hh.m.send(v ? 'CONNECT' : 'LEAVE');
          else if (id === 'zero') { hh.ctl.set('left', 0); hh.ctl.set('right', 0); }
          else if (id === 'reset') { hh.m.reset(); hh.B.idx = -1; hh.B.t = 99; hh.ctl.set('phone', false); car.set = false; }
        },
        step(s, hh) {
          const v = hh.ctl.values;
          acc += s;
          while (acc >= 0.1) {                                   // the page sends a command every 100 ms
            acc -= 0.1;
            if (v.phone && v.link) { lastCmdT = hh.T; hh.m.send(v.left === 0 && v.right === 0 ? 'STOP' : 'DRIVE'); }
          }
          const [l, r] = applied(hh);
          car.v = (l + r) / 2 * 0.7; car.w = (r - l) * 0.012;
          car.a -= car.w * s; car.x += Math.cos(car.a) * car.v * s; car.y += Math.sin(car.a) * car.v * s;
        },
        scene(c, R, hh, C) {
          const S = hh.S, st = hh.m.state, on = new Set();
          if (v2(hh, 'phone')) { on.add('phone'); on.add('esp'); }
          if (st === 'DRIVING') { on.add('drv'); on.add('mot'); }
          diagram(kit, c, { x: R.x, y: R.y, w: R.w, h: R.h * 0.4 }, [
            { id: 'phone', label: 'Phone', sub: 'WebSocket', x: 0.17, y: 0.2 }, { id: 'esp', label: 'ESP32', sub: 'AP + server', x: 0.5, y: 0.2 }, { id: 'drv', label: 'TB6612FNG', sub: 'driver', x: 0.83, y: 0.2 },
            { id: 'pack', label: '2S pack', sub: '7.4 V', x: 0.17, y: 0.8 }, { id: 'buck', label: 'Buck 5 V', x: 0.5, y: 0.8 }, { id: 'mot', label: 'Motors', sub: 'L and R', x: 0.83, y: 0.8 }
          ], [['phone', 'esp', { wireless: true }], ['esp', 'drv'], ['drv', 'mot'], ['pack', 'buck'], ['buck', 'esp']], on, { cols: 3 });
          // the yard
          const yx = R.x + 2, yy = R.y + R.h * 0.46, yw = R.w - 4, yh = R.h * 0.54 - 6;
          c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; c.fillRect(yx, yy, yw, yh);
          c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(yx, yy, yw, yh);
          if (!car.set) { car.x = yx + yw / 2; car.y = yy + yh / 2; car.set = true; }
          car.x = clamp(car.x, yx + 18, yx + yw - 18); car.y = clamp(car.y, yy + 18, yy + yh - 18);
          const [l, r] = applied(hh);
          c.save(); c.translate(car.x, car.y); c.rotate(car.a);
          c.fillStyle = C.accent; c.fillRect(-16, -9, 32, 18);
          c.fillStyle = C.bg2 || '#111'; c.fillRect(10, -7, 5, 14);
          for (const [side, sp] of [[-1, l], [1, r]]) { c.fillStyle = sp > 0 ? C.ok : sp < 0 ? C.bad : C.muted; c.fillRect(-9, side * 11 - 3, 18, 6); }
          c.restore();
          kit.label(c, 'the nose has the dark stripe', yx + 6, yy + 10, { size: 10, color: C.faint });
          // the silence timer
          const age = hh.T - lastCmdT, f = clamp(age / 0.4, 0, 1);
          const bx = yx + 6, by = yy + yh - 16, bw = Math.min(yw - 12, 160);
          if (st === 'DRIVING' || age < 2) { c.fillStyle = C.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.08)'; c.fillRect(bx, by, bw, 7); c.fillStyle = f > 0.75 ? C.bad : C.accent; c.fillRect(bx, by, bw * f, 7); kit.label(c, 'silence ' + Math.round(age * 1000) + ' ms of 400', bx, by - 8, { size: 10, color: C.muted }); }
        },
        readouts: [['state', 'State'], ['wheels', 'Wheels (left, right)'], ['why', 'The car is']],
        readout(hh, ro) {
          const st = hh.m.state, [l, r] = applied(hh);
          ro.set('state', st);
          ro.set('wheels', Math.round(l) + ' %, ' + Math.round(r) + ' %');
          ro.set('why', { WAITING: 'braked: no phone', READY: 'braked: sliders at zero or not yet pushed', DRIVING: 'following the sliders', FAILSAFE: 'braked: silence — waiting for zero' }[st]);
        }
      });
      function v2(hh, id) { return hh.ctl.values[id]; }
    }
  });

  /* ================================================================ wp2-data-logger */
  Hyper.sim('wp2-data-logger', {
    title: 'The logger, its card and the flush policy',
    blurb: `A line is written every 10 s. Amber lines are waiting in the chip's memory; green ones are on the card. Pick how often the program flushes, then pull the plug.

**Try this**
- Choose *every 30 s*, wait for a few amber lines, press **Cut the power**: the amber lines are gone, the green ones survive. Compare *after every line* and *every 5 minutes*.
- Untick **a card is inserted** while logging: nothing happens until the next write, which fails and sends the machine to NO_CARD. Amber lines are lost.
- Press the **eject button**: the lines are flushed, EJECTED, and the card may be removed. Press it again to mount.
- Read **flushes a day** against **worst loss**: that is the whole trade.`,
    mount(box, kit) {
      const def = { start: 'NO_CARD', states: {
        NO_CARD: { entry: 'LED slow', on: { CARD_OK: 'LOGGING' }, after: { 5000: 'NO_CARD' } },
        LOGGING: { entry: 'LED on', on: { BUTTON: 'EJECTED', CARD_LOST: 'NO_CARD' } },
        EJECTED: { entry: 'LED fast', on: { BUTTON: 'NO_CARD' } } } };
      const SAMPLE = 10, POL = { line: 0, s30: 30, m5: 300, never: 1e12 };
      const START = 12 * 3600 + 34 * 60 + 56;
      let buf = [], card = [], cardCount = 0, lost = 0, sampleAcc = 0, flushAcc = 0, flashT = 0, btnT = 0, notice = '', noticeT = 0;
      const stamp = t => { const s = Math.floor(START + t) % 86400; return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(x => String(x).padStart(2, '0')).join(':'); };
      const temp = t => (21.5 + 0.6 * Math.sin(t / 150)).toFixed(2);
      const doFlush = () => { for (const l of buf) { card.push(l); cardCount++; } buf = []; if (card.length > 40) card.splice(0, card.length - 40); flashT = 0.5; flushAcc = 0; };
      const h = harness(kit, box, {
        def, rw: 44, fsmFrac: 0.52,
        layout: { NO_CARD: [0.12, 0.62], LOGGING: [0.62, 0.2], EJECTED: [0.62, 0.9] },
        bends: { 'LOGGING>NO_CARD': 22 },
        controls: [
          { id: 'card', type: 'check', label: 'A card is inserted', value: true },
          { id: 'policy', type: 'select', label: 'Flush', options: [['after every line', 'line'], ['every 30 s', 's30'], ['every 5 minutes', 'm5'], ['never (only on eject)', 'never']], value: 's30' },
          { id: 'speed', label: 'Clock speed', min: 1, max: 60, step: 1, value: 8, unit: '×' },
          { type: 'buttons', items: [{ id: 'btn', label: 'Press the eject button', primary: true }, { id: 'cut', label: 'Cut the power' }, { id: 'reset', label: 'Start again' }] }
        ],
        speed: 'speed',
        onChange(from, to, why, actions, hh) {
          if (to === 'EJECTED') doFlush();
          if (to === 'LOGGING') { sampleAcc = 0; flushAcc = 0; }
        },
        onControl(id, v, hh) {
          if (id === 'btn') { btnT = 0.4; hh.m.send('BUTTON'); }
          else if (id === 'cut') { lost += buf.length; notice = 'Power cut: ' + buf.length + ' line' + (buf.length === 1 ? '' : 's') + ' lost'; noticeT = 5; buf = []; hh.m.reset(); hh.B.idx = -1; hh.B.t = 99; }
          else if (id === 'reset') { hh.m.reset(); hh.B.idx = -1; hh.B.t = 99; buf = []; card = []; cardCount = 0; lost = 0; notice = ''; hh.T = 0; }
        },
        step(s, hh) {
          const v = hh.ctl.values, st = hh.m.state;
          flashT = Math.max(0, flashT - s); btnT = Math.max(0, btnT - s); noticeT = Math.max(0, noticeT - s);
          if (st === 'NO_CARD' && v.card && hh.m.inState() >= 300) hh.m.send('CARD_OK');
          else if (st === 'LOGGING') {
            sampleAcc += s; flushAcc += s;
            if (sampleAcc >= SAMPLE) {
              sampleAcc -= SAMPLE;
              if (!v.card) { lost += buf.length + 1; notice = 'Write failed: the card is gone, ' + (buf.length + 1) + ' lines lost'; noticeT = 6; buf = []; hh.m.send('CARD_LOST'); }
              else { buf.push(stamp(hh.T) + '  ' + temp(hh.T)); if (v.policy === 'line') doFlush(); }
            }
            if (v.card && buf.length && v.policy !== 'line' && flushAcc >= POL[v.policy]) doFlush();
          }
        },
        scene(c, R, hh, C) {
          const v = hh.ctl.values, st = hh.m.state, on = new Set(['esp']);
          if (st === 'LOGGING') { on.add('ds'); on.add('sd'); }
          if (btnT > 0) on.add('btn');
          diagram(kit, c, { x: R.x, y: R.y, w: R.w, h: R.h * 0.34 }, [
            { id: 'ds', label: 'DS18B20', sub: 'GPIO21', x: 0.17, y: 0.22 }, { id: 'esp', label: 'ESP32', sub: 'RAM buffer', x: 0.5, y: 0.22 }, { id: 'sd', label: 'SD card', sub: v.card ? 'SPI' : 'not there', x: 0.83, y: 0.22, dash: !v.card },
            { id: 'btn', label: 'Eject', sub: 'GPIO22', x: 0.17, y: 0.8 }, { id: 'led', label: 'LED', sub: 'GPIO4', x: 0.5, y: 0.8 }
          ], [['ds', 'esp'], ['esp', 'sd', { label: flashT > 0 ? 'flush' : '' }], ['btn', 'esp'], ['esp', 'led']], on, { cols: 3 });
          // the lines: amber in memory, green on the card
          const y0 = R.y + R.h * 0.4, rows = Math.max(4, Math.floor((R.h * 0.6 - 30) / 13));
          kit.label(c, 'in memory: ' + buf.length + '   on the card: ' + cardCount, R.x + 2, y0, { size: 11, weight: 650, color: C.text2 });
          const list = buf.slice().reverse().map(t => [t, false]).concat(card.slice().reverse().map(t => [t, true])).slice(0, rows);
          list.forEach(([t, safe], i) => {
            const y = y0 + 16 + i * 13;
            c.fillStyle = safe ? C.ok : C.warn; c.fillRect(R.x + 2, y - 5, 4, 10);
            kit.label(c, t, R.x + 12, y, { size: 10.5, color: safe ? C.text : C.warn, font: MONO });
          });
          if (noticeT > 0) kit.label(c, notice, R.x + R.w / 2, R.y + R.h * 0.4 - 12, { size: 11, weight: 650, color: C.bad, align: 'center' });
        },
        readouts: [['state', 'State'], ['risk', 'At risk in memory'], ['card', 'On the card'], ['lost', 'Lost so far'], ['fl', 'Flushes a day'], ['worst', 'Worst loss at a power cut']],
        readout(hh, ro) {
          const p = hh.ctl.values.policy, iv = POL[p];
          ro.set('state', hh.m.state);
          ro.set('risk', buf.length + (buf.length === 1 ? ' line' : ' lines'));
          ro.set('card', cardCount + ' lines');
          ro.set('lost', lost + (lost === 1 ? ' line' : ' lines'));
          ro.set('fl', p === 'line' ? '8640' : p === 'never' ? 'none, only on eject' : String(Math.round(86400 / iv)));
          ro.set('worst', p === 'line' ? 'the line being written' : p === 'never' ? 'everything since the start' : Math.ceil(iv / SAMPLE) + ' lines (' + iv + ' s)');
        }
      });
    }
  });

  /* ================================================================ wp2-garage-door */
  Hyper.sim('wp2-garage-door', {
    title: 'The garage door: press, watch, time out',
    blurb: `The opener moves the door; the controller only presses its button (the relay lamp) and reads the two switches. The opener's own safety devices are not part of the controller: the obstruction reversal here is the opener's.

**Try this**
- Press the button from the app: CLOSED, OPENING, OPEN. Press again: CLOSING, CLOSED. Watch the two switch lamps.
- Press during travel: the door stops, the machine goes to AJAR. Press again: the door reverses its last direction.
- Tick **something in the doorway** and close the door: the opener goes back up at 25 %, and the machine ends in OPEN with "reversed" in the log.
- Tick **the opener is stuck** and press: after 25 s of simulated time, AJAR with an alarm.
- Use the **wall button**: the controller finds out from the switches. *Reboot the controller* mid-travel: it starts from the switches.`,
    mount(box, kit) {
      const ctx0 = { wasClosing: false };
      const def = { start: 'CLOSED', states: {
        CLOSED: { entry: 'LED off', on: { CMD: { to: 'OPENING', do: 'pulse the relay' }, LEAVES: 'OPENING' } },
        OPENING: { entry: 'LED blinks', on: { LIMIT_OPEN: 'OPEN', CMD: { to: 'AJAR', do: 'pulse the relay' } }, after: { 25000: { to: 'AJAR', do: 'alarm' } } },
        OPEN: { entry: 'LED on', on: { CMD: { to: 'CLOSING', do: 'pulse the relay' }, LEAVES: 'CLOSING' } },
        CLOSING: { entry: 'LED blinks', on: { LIMIT_CLOSED: 'CLOSED', LIMIT_OPEN: { to: 'OPEN', do: 'report: reversed' }, CMD: { to: 'AJAR', do: 'pulse the relay' } }, after: { 25000: { to: 'AJAR', do: 'alarm' } } },
        AJAR: { entry: 'LED fast', on: { CMD: [{ to: 'OPENING', if: 'down', do: 'pulse the relay' }, { to: 'CLOSING', do: 'pulse the relay' }] } } } };
      const TRAVEL = 12;
      const door = { p: 0, dir: 0, lastDir: -1, prevClosed: true, prevOpen: false, relay: 0 };
      let alarm = false, msg = '';
      const press = () => {                       // what the opener does with a press
        if (door.dir !== 0) { door.lastDir = door.dir; door.dir = 0; }
        else door.dir = door.p <= 0.001 ? 1 : door.p >= 0.999 ? -1 : -door.lastDir;
      };
      const fromSwitches = () => (door.p <= 0.02 ? 'CLOSED' : door.p >= 0.98 ? 'OPEN' : 'AJAR');
      const h = harness(kit, box, {
        def, rw: 40, fsmFrac: 0.56, aspectN: 2.0, fsmHN: 0.42, guards: { down: c => c.wasClosing }, ctx: ctx0, merge: true,
        layout: { CLOSED: [0.08, 0.7], OPENING: [0.5, 0.08], OPEN: [0.92, 0.7], CLOSING: [0.5, 0.92], AJAR: [0.5, 0.5] },
        bends: { 'OPENING>AJAR': 72, 'AJAR>OPENING': 72, 'CLOSING>AJAR': 72, 'AJAR>CLOSING': 72, 'OPEN>CLOSING': 40, 'CLOSING>OPEN': 40, 'CLOSED>OPENING': 0, 'OPENING>OPEN': 0, 'CLOSING>CLOSED': 0 },
        labels: { 'OPENING>AJAR': 'CMD · 25 s', 'CLOSING>AJAR': 'CMD · 25 s' },
        controls: [
          { id: 'obstacle', type: 'check', label: 'Something is in the doorway', value: false },
          { id: 'stuck', type: 'check', label: 'The opener is stuck (it does not move)', value: false },
          { id: 'speed', label: 'Clock speed', min: 1, max: 10, step: 1, value: 3, unit: '×' },
          { type: 'buttons', items: [{ id: 'cmd', label: 'App: press the button', primary: true }, { id: 'wall', label: 'Wall button at the opener' }, { id: 'boot', label: 'Reboot the controller' }, { id: 'reset', label: 'Start again' }] }
        ],
        speed: 'speed',
        onChange(from, to, why, actions) {
          if (to === 'AJAR') ctx0.wasClosing = from === 'CLOSING';
          if (actions.includes('pulse the relay')) { door.relay = 0.5; alarm = false; msg = ''; press(); }
          if (actions.includes('alarm')) { alarm = true; msg = 'ALARM: the door did not arrive in 25 s'; }
          if (actions.includes('report: reversed')) msg = 'OBSTRUCTION: the opener reversed the door';
        },
        onControl(id, v, hh) {
          if (id === 'cmd') hh.m.send('CMD');
          else if (id === 'wall') { msg = ''; press(); }
          else if (id === 'boot') { hh.m.reset(); hh.m.state = fromSwitches(); hh.m.log.push({ t: hh.m.now, from: '(restart)', to: hh.m.state, why: 'the switches', actions: [] }); hh.B.idx = -1; hh.B.t = 99; }
          else if (id === 'reset') { hh.m.reset(); hh.B.idx = -1; hh.B.t = 99; door.p = 0; door.dir = 0; door.lastDir = -1; door.prevClosed = true; door.prevOpen = false; alarm = false; msg = ''; ctx0.wasClosing = false; }
        },
        step(s, hh) {
          const v = hh.ctl.values;
          door.relay = Math.max(0, door.relay - s);
          if (door.dir !== 0 && !v.stuck) {
            door.p = clamp(door.p + door.dir * s / TRAVEL, 0, 1);
            if (v.obstacle && door.dir === -1 && door.p <= 0.25) { door.dir = 1; door.lastDir = -1; }     // the opener's own reversal
            if (door.p >= 1) { door.dir = 0; door.lastDir = 1; }
            if (door.p <= 0) { door.dir = 0; door.lastDir = -1; }
          }
          const closed = door.p <= 0.02, open = door.p >= 0.98;
          if (closed && !door.prevClosed) hh.m.send('LIMIT_CLOSED');
          if (open && !door.prevOpen) hh.m.send('LIMIT_OPEN');
          if (!closed && door.prevClosed) hh.m.send('LEAVES');
          if (!open && door.prevOpen) hh.m.send('LEAVES');
          door.prevClosed = closed; door.prevOpen = open;
        },
        scene(c, R, hh, C) {
          const S = hh.S, on = new Set(['esp']);
          if (door.relay > 0) { on.add('relay'); on.add('opener'); }
          if (door.dir !== 0) { on.add('opener'); on.add('door'); }
          diagram(kit, c, { x: R.x, y: R.y, w: R.w, h: R.h * 0.36 }, [
            { id: 'app', label: 'Phone', x: 0.17, y: 0.2 }, { id: 'esp', label: 'ESP32-C3', x: 0.5, y: 0.2 }, { id: 'relay', label: 'Relay', sub: 'dry contact', x: 0.83, y: 0.2 },
            { id: 'sw', label: 'Switches', sub: 'closed, open', x: 0.17, y: 0.82 }, { id: 'door', label: 'Door', x: 0.5, y: 0.82 }, { id: 'opener', label: 'Opener', sub: 'eye + force limit', x: 0.83, y: 0.82 }
          ], [['app', 'esp', { wireless: true }], ['esp', 'relay'], ['relay', 'opener'], ['opener', 'door'], ['door', 'sw'], ['sw', 'esp']], on, { cols: 3 });
          // the door in its frame
          const fw = Math.min(R.w * 0.5, 130), fh = R.h * 0.5, fx = R.x + 14, fy = R.y + R.h * 0.42;
          c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)'; c.fillRect(fx, fy, fw, fh);
          const ph = (1 - door.p) * fh;
          c.fillStyle = C.dark ? '#6c7388' : '#aab1c4'; c.fillRect(fx, fy, fw, ph);
          c.strokeStyle = C.dark ? '#434a5e' : '#7e869b'; c.lineWidth = 1;
          for (let i = 1; i < 4; i++) { const yy = fy + ph * i / 4; if (ph > 8) { c.beginPath(); c.moveTo(fx, yy); c.lineTo(fx + fw, yy); c.stroke(); } }
          if (hh.ctl.values.obstacle) { c.fillStyle = C.warn; c.fillRect(fx + fw * 0.35, fy + fh * 0.75, fw * 0.3, fh * 0.25); kit.label(c, 'box', fx + fw / 2, fy + fh * 0.88, { size: 10, color: '#000', align: 'center' }); }
          c.strokeStyle = C.text2; c.lineWidth = 2; c.strokeRect(fx, fy, fw, fh);
          const closedSw = door.p <= 0.02, openSw = door.p >= 0.98, lx = fx + fw + 22;
          S.led(c, lx, fy + 8, { color: 130, on: openSw ? 1 : 0, r: 6 }); kit.label(c, 'open switch', lx + 12, fy + 8, { size: 10.5, color: C.muted });
          S.led(c, lx, fy + fh - 8, { color: 130, on: closedSw ? 1 : 0, r: 6 }); kit.label(c, 'closed switch', lx + 12, fy + fh - 8, { size: 10.5, color: C.muted });
          S.led(c, lx, fy + fh * 0.4, { color: 0, on: door.relay > 0 ? 1 : 0, r: 6 }); kit.label(c, 'relay pulse', lx + 12, fy + fh * 0.4, { size: 10.5, color: C.muted });
          kit.label(c, door.dir > 0 ? 'opener: opening' : door.dir < 0 ? 'opener: closing' : 'opener: stopped', lx - 6, fy + fh * 0.62, { size: 10.5, color: C.text2, weight: 600 });
          if (msg) kit.label(c, msg, R.x + 4, fy + fh + 14, { size: 10.5, weight: 650, color: C.bad });
        },
        readouts: [['state', 'State'], ['pos', 'Door position'], ['sw', 'Switches'], ['alarm', 'Alarm']],
        readout(hh, ro) {
          ro.set('state', hh.m.state);
          ro.set('pos', Math.round(door.p * 100) + ' % open');
          ro.set('sw', (door.p <= 0.02 ? 'closed switch on' : door.p >= 0.98 ? 'open switch on' : 'neither: between the ends'));
          ro.set('alarm', alarm ? 'yes: time-out' : 'no');
        }
      });
    }
  });

  /* ================================================================ wp2-zigbee-switch */
  Hyper.sim('wp2-zigbee-switch', {
    title: 'The Zigbee switch: what a press costs',
    blurb: `The switch sleeps at microamps, wakes on a press, rejoins, sends and sleeps again. The currents are the catalogue's figures for the ESP32-H2; the lower part turns them into years on the cells.

**Try this**
- Press: ASLEEP, WAKING, SENDING, ASLEEP, and the bulb toggles. Read **press to light** and the charge of the press.
- Untick **the hub is reachable** and press: WAKING gives up after 10 s, blinking red, and the chip sleeps again.
- Untick **the light answers**: SENDING times out after 3 s.
- Hold the button (5 s): PAIRING. It joins only when **the hub is in pairing mode**.
- A label such as *ACK · 3 s* on an arrow means that event, or, after that many seconds, the time-out.
- Choose **a CR2032** and read the warning. Raise **the board's sleep current**: the years fall far more than for any change in the radio.`,
    mount(box, kit) {
      const E = kit.esp;
      const H2 = E.chip('esp32-h2') || {};
      const RX = H2.rxMa || 25, TX = H2.txMa || 140, SLEEP = (H2.sleepUa || 7) / 1000;
      const def = { start: 'ASLEEP', states: {
        ASLEEP: { entry: 'deep sleep', on: { PRESS: 'WAKING', LONG_PRESS: 'PAIRING' } },
        WAKING: { entry: 'rejoin', on: { JOINED: 'SENDING' }, after: { 10000: { to: 'ASLEEP', do: 'blink red x3' } } },
        SENDING: { entry: 'send toggle', on: { ACK: 'ASLEEP' }, after: { 3000: { to: 'ASLEEP', do: 'blink red' } } },
        PAIRING: { entry: 'forget, search', on: { JOINED: 'ASLEEP' }, after: { 60000: 'ASLEEP' } } } };
      const CUR = { WAKING: RX, SENDING: TX, PAIRING: RX, ASLEEP: 0 };
      let bulb = false, pressT = null, latency = null, q = 0, lastQ = null, presses = 0, fails = 0;
      const CELLS = { aa2: '2 × AA', cr123a: 'CR123A', cr2032: 'CR2032' };
      const h = harness(kit, box, {
        def, rw: 44, fsmFrac: 0.52,
        layout: { ASLEEP: [0.1, 0.5], WAKING: [0.5, 0.14], SENDING: [0.9, 0.5], PAIRING: [0.5, 0.88] },
        merge: true, labels: { 'SENDING>ASLEEP': 'ACK · 3 s', 'PAIRING>ASLEEP': 'JOINED · 60 s' },
        bends: { 'SENDING>ASLEEP': 30, 'ASLEEP>WAKING': 44, 'WAKING>ASLEEP': 44, 'ASLEEP>PAIRING': 44, 'PAIRING>ASLEEP': 44 },
        controls: [
          { id: 'hub', type: 'check', label: 'The hub is reachable', value: true },
          { id: 'ack', type: 'check', label: 'The light answers', value: true },
          { id: 'permit', type: 'check', label: 'The hub is in pairing mode', value: false },
          { id: 'rejoin', label: 'Time to rejoin the network', min: 0.3, max: 5, step: 0.1, value: 1, unit: 's' },
          { id: 'perday', label: 'Presses a day', min: 2, max: 200, value: 20, log: true, sig: 2 },
          { id: 'extra', type: 'select', label: 'Board\'s sleep current (besides the chip)', options: [['none: a bare chip', 0], ['+ 20 µA: a lean board', 0.02], ['+ 100 µA: a dev board', 0.1], ['+ 1 mA: a board with a USB chip', 1]], value: 0.02 },
          { id: 'cell', type: 'select', label: 'Cells', options: [['2 × AA', 'aa2'], ['CR123A', 'cr123a'], ['CR2032 coin cell', 'cr2032']], value: 'aa2' },
          { id: 'speed', label: 'Clock speed', min: 1, max: 20, step: 1, value: 3, unit: '×' },
          { type: 'buttons', items: [{ id: 'press', label: 'Press the button', primary: true }, { id: 'hold', label: 'Hold it for 5 s' }, { id: 'reset', label: 'Start again' }] }
        ],
        speed: 'speed',
        onChange(from, to, why, actions, hh) {
          if (from === 'ASLEEP') { pressT = hh.T; q = 0; presses++; }
          if (to === 'ASLEEP' && from !== 'ASLEEP') lastQ = q;
          if (from === 'SENDING' && why === 'ACK') { bulb = !bulb; latency = hh.T - pressT; }
          if (actions.some(a => /^blink red/.test(a))) fails++;
        },
        onControl(id, v, hh) {
          if (id === 'press') hh.m.send('PRESS');
          else if (id === 'hold') hh.m.send('LONG_PRESS');
          else if (id === 'reset') { hh.m.reset(); hh.B.idx = -1; hh.B.t = 99; bulb = false; latency = null; lastQ = null; q = 0; presses = 0; fails = 0; hh.T = 0; }
        },
        step(s, hh) {
          const v = hh.ctl.values, st = hh.m.state, ms = hh.m.inState();
          q += CUR[st] * s;
          if (st === 'WAKING' && v.hub && ms >= v.rejoin * 1000) hh.m.send('JOINED');
          else if (st === 'SENDING' && v.ack && ms >= 150) hh.m.send('ACK');
          else if (st === 'PAIRING' && v.hub && v.permit && ms >= 6000) hh.m.send('JOINED');
        },
        scene(c, R, hh, C) {
          const S = hh.S, v = hh.ctl.values, st = hh.m.state, on = new Set(['batt']);
          if (st !== 'ASLEEP') { on.add('sw'); on.add('btn'); }
          if (st !== 'ASLEEP' && v.hub) on.add('hub');
          if (bulb) on.add('bulb');
          diagram(kit, c, { x: R.x, y: R.y, w: R.w, h: R.h * 0.4 }, [
            { id: 'btn', label: 'Button', sub: 'GPIO10', x: 0.17, y: 0.2 }, { id: 'sw', label: 'ESP32-H2', sub: 'end device', x: 0.5, y: 0.2 }, { id: 'batt', label: CELLS[v.cell], sub: 'cells', x: 0.83, y: 0.2 },
            { id: 'hub', label: 'Hub', sub: 'coordinator', x: 0.17, y: 0.8 }, { id: 'bulb', label: 'Bulb', sub: bulb ? 'on' : 'off', x: 0.5, y: 0.8 }
          ], [['btn', 'sw'], ['batt', 'sw'], ['sw', 'hub', { wireless: true }], ['hub', 'bulb', { wireless: true }], ['sw', 'bulb', { wireless: true, label: 'bound' }]], on, { cols: 3 });
          // the current now, on a logarithmic bar from 1 µA to 200 mA
          const mA = Math.max(CUR[st], SLEEP + v.extra), bx = R.x + 8, bw = R.w - 16, by = R.y + R.h * 0.58;
          const X = m => bx + clamp((Math.log10(Math.max(m, 1e-3)) + 3) / (Math.log10(200) + 3), 0, 1) * bw;
          c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(bx, by, bw, 10);
          c.fillStyle = st === 'ASLEEP' ? C.ok : C.warn; c.fillRect(bx, by, X(mA) - bx, 10);
          [[0.001, '1 µA'], [1, '1 mA'], [100, '100 mA']].forEach(([m, t]) => { c.fillStyle = C.faint; c.fillRect(X(m), by - 3, 1, 16); kit.label(c, t, X(m), by + 24, { size: 9.5, color: C.faint, align: 'center' }); });
          kit.label(c, 'the whole board draws, now', bx, by - 12, { size: 10.5, color: C.muted });
          kit.label(c, mA < 1 ? Math.round(mA * 1000) + ' µA' : kit.fmt(mA, 3) + ' mA', bx + bw, by - 12, { size: 11, weight: 650, color: C.text, align: 'right' });
          S.led(c, R.x + 24, R.y + R.h * 0.86, { color: 48, on: bulb ? 1 : 0.04, r: 14 });
          kit.label(c, bulb ? 'the lamp is on' : 'the lamp is off', R.x + 52, R.y + R.h * 0.86, { size: 11, color: C.text2 });
        },
        readouts: [['state', 'State'], ['lat', 'Press to light'], ['q', 'Charge of the last press'], ['est', 'Charge per press, estimated'], ['avg', 'Average current'], ['life', 'Cells last about']],
        readout(hh, ro) {
          const v = hh.ctl.values, est = RX * v.rejoin + TX * 0.2, awake = v.rejoin + 0.2;
          const avg = (v.perday * est + Math.max(0, 86400 - v.perday * awake) * (SLEEP + v.extra)) / 86400;
          const cell = E.CELLS.find(x => x.id === v.cell), life = cell ? E.batteryLife(cell.mAh, avg, { cell: v.cell }) : null;
          ro.set('state', hh.m.state);
          ro.set('lat', latency == null ? '—' : latency.toFixed(2) + ' s');
          ro.set('q', lastQ == null ? '—' : kit.fmt(lastQ, 3) + ' mA·s');
          ro.set('est', kit.fmt(est, 3) + ' mA·s');
          ro.set('avg', avg < 1 ? Math.round(avg * 1000) + ' µA' : kit.fmt(avg, 3) + ' mA');
          ro.set('life', life ? (life.years >= 1 ? life.years.toFixed(1) + ' years' : Math.round(life.days) + ' days') + (v.cell === 'cr2032' ? '  (a coin cell sags: not advised)' : '') : '—');
        }
      });
    }
  });

  /* ================================================================ wp2-lora-sensor */
  Hyper.sim('wp2-lora-sensor', {
    title: 'The LoRa node: air time, the guard, the cell',
    blurb: `The ring SLEEPING, MEASURING, SENDING. The guard in MEASURING checks that the packet's time on the air fits the duty-cycle limit for the interval you chose, and the bar shows where the cell's charge goes.

**Try this**
- Leave the settings: a packet every 15 minutes, a tiny duty cycle, the cell lasts more than a year.
- Raise the **spreading factor** to 12 and shorten the **interval** to 20 s: the guard fails, MEASURING goes back to SLEEPING and the log says *skip: duty cycle*.
- Change the **limit** to *no limit* to see what the guard was protecting: the node now breaks the rule.
- Raise the **board's sleep current** to 10 mA: the radio's share of the charge almost vanishes, and the cell lasts days.
- Untick **the radio works**: SENDING times out after 5 s.`,
    mount(box, kit) {
      const E = kit.esp;
      const ctx0 = { dutyOk: true };
      const def = { start: 'SLEEPING', states: {
        SLEEPING: { entry: 'deep sleep', after: { 900000: 'MEASURING' } },
        MEASURING: { entry: 'read the probe', on: { READ_OK: [{ to: 'SENDING', if: 'dutyOk' }, { to: 'SLEEPING', do: 'skip: duty cycle' }], READ_FAIL: { to: 'SLEEPING', do: 'log the error' } } },
        SENDING: { entry: 'transmit', on: { TX_DONE: 'SLEEPING' }, after: { 5000: { to: 'SLEEPING', do: 'log: radio fault' } } } } };
      let sent = 0, skipped = 0, faults = 0;
      const air = v => E.lora({ sf: v.sf, bw: 125e3, cr: 1, bytes: v.bytes });
      const h = harness(kit, box, {
        def, rw: 44, fsmFrac: 0.52, guards: { dutyOk: c => c.dutyOk }, ctx: ctx0,
        layout: { SLEEPING: [0.1, 0.5], MEASURING: [0.5, 0.12], SENDING: [0.9, 0.5] },
        merge: true, labels: { 'MEASURING>SLEEPING': 'skip · fail', 'SENDING>SLEEPING': 'TX_DONE · 5 s' },
        bends: { 'SLEEPING>MEASURING': 44, 'MEASURING>SLEEPING': 44, 'SENDING>SLEEPING': 0, 'MEASURING>SENDING': 0 },
        controls: [
          { id: 'interval', label: 'Sleep interval', min: 5, max: 3600, value: 900, log: true, sig: 2, unit: 's' },
          { id: 'sf', label: 'Spreading factor', min: 7, max: 12, step: 1, value: 9 },
          { id: 'bytes', label: 'Payload', min: 4, max: 51, step: 1, value: 8, unit: 'bytes' },
          { id: 'duty', type: 'select', label: 'Duty-cycle limit', options: [['1 %', 0.01], ['0.1 %', 0.001], ['10 %', 0.1], ['no limit', 0]], value: 0.01 },
          { id: 'sleepmA', type: 'select', label: 'Board\'s sleep current', options: [['0.05 mA: a bare module', 0.05], ['0.1 mA: a lean board', 0.1], ['1 mA: a dev board', 1], ['10 mA: with USB chip and display', 10]], value: 0.1 },
          { id: 'dist', label: 'Distance to the receiver', min: 100, max: 8000, value: 2000, log: true, sig: 2, unit: 'm' },
          { id: 'probe', type: 'check', label: 'The soil probe works', value: true },
          { id: 'radio', type: 'check', label: 'The radio works', value: true },
          { id: 'speed', label: 'Clock speed', min: 1, max: 20000, step: 1, value: 200, log: true, sig: 2, unit: '×' },
          { type: 'buttons', items: [{ id: 'reset', label: 'Start again', primary: true }] }
        ],
        speed: 'speed', maxStep: 0.5,
        onChange(from, to, why, actions) {
          if (to === 'SENDING') sent++;
          if (actions.includes('skip: duty cycle')) skipped++;
          if (actions.includes('log: radio fault')) faults++;
        },
        onControl(id, v, hh) {
          if (id === 'interval') {
            const ms = Math.round(v * 1000);
            def.states.SLEEPING.after = { [ms]: 'MEASURING' };
            const t = hh.B.dia.transitions.find(x => x.from === 'SLEEPING' && x.to === 'MEASURING');
            if (t) { t.label = 'after ' + fmtDur(v); t.ev = 'after ' + ms + ' ms'; }
          } else if (id === 'reset') { hh.m.reset(); hh.B.idx = -1; hh.B.t = 99; sent = skipped = faults = 0; hh.T = 0; }
        },
        step(s, hh) {
          const v = hh.ctl.values, st = hh.m.state, ms = hh.m.inState(), L = air(v);
          ctx0.dutyOk = !v.duty || L.t <= v.duty * v.interval;
          if (st === 'MEASURING' && ms >= 500) hh.m.send(v.probe ? 'READ_OK' : 'READ_FAIL');
          else if (st === 'SENDING' && v.radio && ms >= L.t * 1000) hh.m.send('TX_DONE');
        },
        scene(c, R, hh, C) {
          const S = hh.S, v = hh.ctl.values, st = hh.m.state, L = air(v), on = new Set(['esp']);
          if (st === 'MEASURING') on.add('probe');
          if (st === 'SENDING') { on.add('radio'); on.add('gw'); }
          diagram(kit, c, { x: R.x, y: R.y, w: R.w, h: R.h * 0.36 }, [
            { id: 'probe', label: 'Soil probe', sub: 'GPIO34', x: 0.17, y: 0.2 }, { id: 'esp', label: 'ESP32', sub: 'LoRa32', x: 0.5, y: 0.2 }, { id: 'radio', label: 'SX1276', sub: 'LoRa radio', x: 0.83, y: 0.2 },
            { id: 'cell', label: '18650', sub: '3000 mAh', x: 0.17, y: 0.8 }, { id: 'gw', label: 'Receiver', sub: kit.fmt(v.dist, 3) + ' m away', x: 0.83, y: 0.8 }
          ], [['probe', 'esp'], ['esp', 'radio'], ['cell', 'esp'], ['radio', 'gw', { wireless: true }]], on, { cols: 3 });
          // the packet in flight, and the link margin
          const k = E.link({ tx: 14, gt: 2, gr: 2, mhz: 868, d: v.dist, n: 2.7, sens: L.sensitivity });
          const yy = R.y + R.h * 0.5;
          S.node(c, R.x + 22, yy, { kind: 'sensor', r: 13, label: 'node', color: C.accent });
          S.node(c, R.x + R.w - 24, yy, { kind: 'gateway', r: 13, label: 'receiver', color: C.accent });
          S.link(c, R.x + 42, yy, R.x + R.w - 44, yy, { wireless: true, label: 'margin ' + Math.round(k.margin) + ' dB', labelColor: k.margin < 10 ? C.bad : C.muted });
          if (st === 'SENDING') S.msg(c, R.x + 42, yy, R.x + R.w - 44, yy, clamp(hh.m.inState() / 1000 / L.t, 0, 1), { shape: 'packet', color: C.warn });
          // where the charge goes
          const per = Math.max(v.interval, 1), d = E.dutyCycle([{ mA: 45, s: 0.5 }, { mA: 130, s: L.t }, { mA: v.sleepmA, s: Math.max(0, per - 0.5 - L.t) }]);
          const by = R.y + R.h * 0.76, bw = R.w - 8, bx = R.x + 4;
          kit.label(c, 'where the charge goes', bx, by - 14, { size: 10.5, color: C.faint, weight: 600 });
          let x0 = bx;
          [['wake', 0], ['send', 1], ['sleep', 2]].forEach(([n, i]) => {
            const w = Math.max(1, bw * d.share[i]);
            c.fillStyle = C.series[i]; c.fillRect(x0, by, w, 16);
            if (w > 44) kit.label(c, n + ' ' + Math.round(d.share[i] * 100) + ' %', x0 + w / 2, by + 8, { size: 10, color: '#fff', align: 'center', weight: 600 });
            x0 += w;
          });
          kit.label(c, 'wake 0.5 s at 45 mA · send ' + Math.round(L.t * 1000) + ' ms at 130 mA · sleep ' + v.sleepmA + ' mA', bx, by + 32, { size: 10, color: C.muted });
        },
        readouts: [['state', 'State'], ['air', 'Time on air'], ['used', 'Duty cycle used'], ['verdict', 'The guard says'], ['count', 'Packets sent, skipped, faults'], ['life', 'The 3000 mAh cell lasts about']],
        readout(hh, ro) {
          const v = hh.ctl.values, L = air(v);
          const per = Math.max(v.interval, 1), d = E.dutyCycle([{ mA: 45, s: 0.5 }, { mA: 130, s: L.t }, { mA: v.sleepmA, s: Math.max(0, per - 0.5 - L.t) }]);
          const life = E.batteryLife(3000, d.avg, { cell: '18650' });
          ro.set('state', hh.m.state);
          ro.set('air', Math.round(L.t * 1000) + ' ms');
          ro.set('used', (L.t / per * 100).toFixed(3) + ' % of ' + (v.duty ? (v.duty * 100) + ' %' : 'no limit'));
          ro.set('verdict', ctx0.dutyOk ? 'sends' : 'too long for this interval: skips (shortest ' + fmtDur(L.t / v.duty) + ')');
          ro.set('count', sent + ', ' + skipped + ', ' + faults);
          ro.set('life', life.days >= 400 ? (life.days / 365).toFixed(1) + ' years' : Math.round(life.days) + ' days');
        }
      });
    }
  });

  /* ================================================================ wp2-voice-lamp */
  Hyper.sim('wp2-voice-lamp', {
    title: 'The voice lamp: window, mute and a harmless action',
    blurb: `The wake-word engine is a black box that reports *the wake word* and *a command*. The picture shows what the program does with those reports. The wave under the lamp is the real PWM signal at 5 kHz.

**Try this**
- Say the wake word, then *on*: IDLE, LISTENING, ACTING, IDLE, and the lamp fades up. Say *brighter* and *dimmer* the same way, one at a time.
- Say a command **without** the wake word: it is ignored, and the log shows nothing happened.
- Say the wake word and wait: after 6 s the window closes.
- Say something the recogniser does not know: the window starts again.
- Press *A TV says a similar word*: it opens a window by itself. The window is short and the commands are harmless.
- Move the **mute switch**: the microphone has no power, and no word reaches the machine until it is back.`,
    mount(box, kit) {
      const E = kit.esp;
      const def = { start: 'IDLE', states: {
        IDLE: { entry: 'LED off', on: { WAKE: 'LISTENING', MUTE: 'MUTED' } },
        LISTENING: { entry: 'LED on, 6 s', on: { COMMAND: 'ACTING', UNKNOWN: 'LISTENING', MUTE: 'MUTED' }, after: { 6000: 'IDLE' } },
        ACTING: { entry: 'fade the lamp', after: { 500: 'IDLE' } },
        MUTED: { entry: 'mic has no power', on: { UNMUTE: 'IDLE' } } } };
      const STEP = 20;
      let target = 0, shown = 0, lastOn = 60, pending = '', notice = '', noticeT = 0, noise = 0.2, nT = 0;
      const say = (hh, word) => {
        const st = hh.m.state;
        if (st === 'MUTED') { notice = 'The microphone has no power: "' + word + '" was never heard'; noticeT = 4; return; }
        if (word === 'wake') { if (!hh.m.send('WAKE')) { notice = 'The wake word was ignored in ' + st; noticeT = 3; } return; }
        if (st !== 'LISTENING') { notice = '"' + word + '" ignored: the lamp was not listening (' + st + ')'; noticeT = 4; return; }
        if (word === 'unknown') { hh.m.send('UNKNOWN'); return; }
        pending = word; hh.m.send('COMMAND');
      };
      const h = harness(kit, box, {
        def, rw: 44, fsmFrac: 0.52,
        layout: { IDLE: [0.1, 0.55], LISTENING: [0.5, 0.22], ACTING: [0.9, 0.22], MUTED: [0.5, 0.9] },
        bends: { 'IDLE>LISTENING': 44, 'LISTENING>IDLE': 44, 'IDLE>MUTED': 44, 'MUTED>IDLE': 44, 'LISTENING>MUTED': 0 },
        controls: [
          { id: 'mute', type: 'check', label: 'Mute switch is off (microphone cut)', value: false },
          { type: 'buttons', items: [{ id: 'wake', label: 'Say the wake word', primary: true }, { id: 'on', label: 'Say "on"' }, { id: 'off', label: 'Say "off"' }] },
          { type: 'buttons', items: [{ id: 'up', label: 'Say "brighter"' }, { id: 'down', label: 'Say "dimmer"' }, { id: 'unknown', label: 'Say something else' }] },
          { type: 'buttons', items: [{ id: 'tv', label: 'A TV says a similar word' }, { id: 'reset', label: 'Start again' }] },
          { id: 'speed', label: 'Clock speed', min: 1, max: 5, step: 1, value: 1, unit: '×' }
        ],
        speed: 'speed',
        onChange(from, to, why, actions, hh) {
          if (to === 'ACTING') {
            if (pending === 'off') { if (target > 0) lastOn = target; target = 0; }
            else if (pending === 'on') target = lastOn;
            else if (pending === 'up') target = Math.min(100, target + STEP);
            else if (pending === 'down') target = Math.max(0, target - STEP);
            if (target > 0) lastOn = target;
          }
        },
        onControl(id, v, hh) {
          if (id === 'mute') hh.m.send(v ? 'MUTE' : 'UNMUTE');
          else if (id === 'tv') { notice = 'A television said something that sounds like the wake word'; noticeT = 4; hh.m.send('WAKE'); }
          else if (id === 'reset') { hh.m.reset(); hh.B.idx = -1; hh.B.t = 99; target = shown = 0; lastOn = 60; hh.ctl.set('mute', false); notice = ''; }
          else if (['wake', 'on', 'off', 'up', 'down', 'unknown'].includes(id)) say(hh, id);
        },
        step(s, hh) {
          const rate = 100 / 0.5;                                  // the fade: the whole range in half a second
          if (shown !== target) shown += clamp(target - shown, -rate * s, rate * s);
          noticeT = Math.max(0, noticeT - s);
          nT += s;
          const muted = hh.m.state === 'MUTED';
          noise = muted ? 0 : clamp(0.16 + 0.12 * Math.sin(nT * 7.3) + 0.08 * Math.sin(nT * 19.1) + (hh.m.state === 'LISTENING' ? 0.15 : 0), 0.02, 1);
        },
        scene(c, R, hh, C) {
          const S = hh.S, st = hh.m.state, on = new Set(['s3']);
          if (st !== 'MUTED') on.add('mic'); else on.add('sw');
          if (st === 'LISTENING') on.add('led');
          if (shown > 0.5) { on.add('fet'); on.add('lamp'); }
          diagram(kit, c, { x: R.x, y: R.y, w: R.w, h: R.h * 0.4 }, [
            { id: 'mic', label: 'I2S mic', sub: 'GPIO5, 4, 6', x: 0.17, y: 0.2 }, { id: 's3', label: 'ESP32-S3', sub: 'wake word + logic', x: 0.5, y: 0.2, w: 104 }, { id: 'fet', label: 'MOSFET', sub: 'GPIO21 PWM', x: 0.85, y: 0.2 },
            { id: 'sw', label: 'Mute switch', sub: 'cuts mic power', x: 0.17, y: 0.8 }, { id: 'led', label: 'LED', sub: 'GPIO17', x: 0.5, y: 0.8 }, { id: 'lamp', label: '12 V lamp', sub: '1 A at most', x: 0.85, y: 0.8 }
          ], [['mic', 's3', { label: 'I2S' }], ['s3', 'fet'], ['fet', 'lamp'], ['sw', 'mic', { label: 'power' }], ['s3', 'led']], on, { cols: 3 });
          // the lamp and the real PWM
          const duty = Math.pow(shown / 100, 2.2);
          const lx = R.x + 28, ly = R.y + R.h * 0.56;
          S.led(c, lx, ly, { color: 48, on: clamp(duty * 1.4 + (shown > 0.5 ? 0.12 : 0), 0, 1), r: 16 });
          kit.label(c, Math.round(shown) + ' %', lx, ly + 28, { size: 11.5, weight: 650, color: C.text, align: 'center' });
          const wx = R.x + 64, ww = R.w - 72;
          S.wave(c, wx, R.y + R.h * 0.5, ww, 26, S.pwmEdges(5000, clamp(duty, 0, 1), 0, 0.0008, 0), { t0: 0, t1: 0.0008, fill: true });
          kit.label(c, 'GPIO21', wx, R.y + R.h * 0.5 - 8, { size: 10, color: C.muted });
          kit.label(c, 'duty ' + (duty * 100).toFixed(1) + ' % (gamma 2.2), 5 kHz', wx, R.y + R.h * 0.5 + 40, { size: 10, color: C.muted });
          // the microphone and the window
          const my = R.y + R.h * 0.8;
          kit.label(c, st === 'MUTED' ? 'microphone: no power' : 'microphone level', R.x + 4, my - 14, { size: 10.5, color: st === 'MUTED' ? C.bad : C.muted });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.07)'; c.fillRect(R.x + 4, my, R.w - 8, 8);
          c.fillStyle = st === 'LISTENING' ? C.warn : C.ok; c.fillRect(R.x + 4, my, (R.w - 8) * noise, 8);
          if (st === 'LISTENING') {
            const f = clamp(hh.m.inState() / 6000, 0, 1);
            c.fillStyle = C.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.07)'; c.fillRect(R.x + 4, my + 22, R.w - 8, 7);
            c.fillStyle = f > 0.75 ? C.bad : C.accent; c.fillRect(R.x + 4, my + 22, (R.w - 8) * (1 - f), 7);
            kit.label(c, 'window closes in ' + fmtS(6000 - hh.m.inState()), R.x + 4, my + 40, { size: 10, color: C.muted });
          } else if (noticeT > 0) kit.label(c, notice, R.x + 4, my + 24, { size: 10.5, color: C.warn, weight: 600 });
        },
        readouts: [['state', 'State'], ['lamp', 'Lamp level'], ['duty', 'PWM duty (gamma-corrected)'], ['mic', 'The microphone'], ['win', 'Time left to speak']],
        readout(hh, ro) {
          const st = hh.m.state;
          ro.set('state', st);
          ro.set('lamp', Math.round(shown) + ' %' + (shown !== target ? '  (fading to ' + Math.round(target) + ' %)' : ''));
          ro.set('duty', (Math.pow(shown / 100, 2.2) * 100).toFixed(1) + ' %  =  ' + Math.round(Math.pow(shown / 100, 2.2) * 1023) + ' of 1023');
          ro.set('mic', st === 'MUTED' ? 'no power: hardware mute' : st === 'IDLE' ? 'listening for the wake word' : st === 'LISTENING' ? 'listening for one command' : 'busy for half a second');
          ro.set('win', st === 'LISTENING' ? fmtS(6000 - hh.m.inState()) : '—');
        }
      });
    }
  });

})();
