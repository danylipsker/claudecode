/* HYPER-ESP32 · sims/worked-projects.js
 *
 * One simulation for each of the first seven worked projects. Each draws the project's block diagram, lights the parts that
 * are active, and runs the project's behaviour as a state machine that the reader operates: the events are buttons (or play
 * by themselves), the time-outs run on a clock that can go up to 600 times faster, and the world around the device
 * (a cell, a room, soil, a router's channel, a tag, a mains load) is a few sliders and switches.
 *
 *   wp-weather    the battery weather station: wake, read, connect, publish, sleep; the average current as it runs
 *   wp-thermostat the panel thermostat: hysteresis band, rest, four-hour limit, lost sensor
 *   wp-plant      the plant waterer: measure, pulse, soak, with a latched fault
 *   wp-doorbell   the doorbell camera: ring, photograph, upload, cooldown; the life of a cell
 *   wp-espnow     an ESP-NOW node and its gateway: the channel, the acknowledgement, the retries
 *   wp-presence   a BLE tag in a room: signal against distance, sightings, home and away
 *   wp-energy     the metering module and the ESP: ask, check, publish, notice a silent meter
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const M = 10;

  /* a duration in milliseconds as a short phrase */
  function fmtDur(ms) {
    const s = Math.max(0, ms) / 1000;
    if (s >= 7200) return (s / 3600).toFixed(1) + ' h';
    if (s >= 120) return (s / 60).toFixed(1) + ' min';
    return s.toFixed(1) + ' s';
  }
  /* a time-out as a short phrase: 600000 -> '10 min' */
  function fmtShort(ms) {
    const s = ms / 1000;
    if (ms < 1000) return ms + ' ms';
    if (s < 120) return (+s.toFixed(1)) + ' s';
    if (s < 7200) return (+(s / 60).toFixed(1)) + ' min';
    return (+(s / 3600).toFixed(1)) + ' h';
  }
  /* a small repeatable random sequence, so that a run does not depend on luck */
  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  }

  /* which arrow of the drawing a log entry belongs to */
  function findArrow(dia, from, to, why) {
    const ts = dia.transitions;
    let i = ts.findIndex(t => t.from === from && t.to === to && t.ev === why);
    if (i < 0 && /^after/.test(String(why))) i = ts.findIndex(t => t.from === from && t.to === to && /^after/.test(t.ev));
    if (i < 0) i = ts.findIndex(t => t.from === from && t.to === to);
    return i;
  }

  /* the last few things the machine did */
  function drawLog(kit, c, x, y, w, m, rows) {
    const C = kit.colors();
    kit.label(c, 'what happened', x, y, { size: 10.5, color: C.faint, weight: 600 });
    const lines = m.log.slice(-rows);
    if (!lines.length) { kit.label(c, 'nothing yet', x, y + 17, { size: 11, color: C.faint }); return; }
    const maxc = Math.max(18, Math.floor(w / 6.2));
    lines.forEach((e, i) => {
      let s = e.error ? e.error : fmtDur(e.t) + '  ' + e.from + ' → ' + e.to + '  (' + e.why + ')' + (e.actions && e.actions.length ? '  · ' + e.actions.join(', ') : '');
      if (s.length > maxc) s = s.slice(0, maxc - 1) + '…';
      kit.label(c, s, x, y + 17 + i * 15, { size: 11, color: e.error ? C.bad : i === lines.length - 1 ? C.text : C.muted });
    });
  }

  /* a block diagram in a row (a grid of two rows on a narrow stage): items are boxes or network nodes, links join them.
     item: { id, label, sub, kind (a node icon) | draw(c, it), val (a line under it), lit, dim }; link: { a, b, lit, wireless } */
  function flow(kit, c, r, narrow, items, links) {
    const S = kit.esym, C = kit.colors();
    const n = items.length, cols = narrow ? Math.ceil(n / 2) : n, rows = narrow ? 2 : 1;
    const cw = r.w / cols, ch = r.h / rows, byId = {};
    items.forEach((it, i) => {
      const col = narrow ? i % cols : i, row = narrow ? Math.floor(i / cols) : 0;
      it.cx = r.x + cw * (col + 0.5);
      it.cy = r.y + ch * (row + 0.5) - 8;
      it.bw = Math.max(44, Math.min(116, cw - 14));
      it.bh = it.kind ? 0 : Math.max(30, Math.min(52, ch - 36));
      it.nr = it.r || 15;
      byId[it.id] = it;
    });
    const edge = (a, b) => {
      const dx = b.cx - a.cx, dy = b.cy - a.cy, d = Math.hypot(dx, dy) || 1;
      if (a.kind) return [a.cx + dx / d * (a.nr + 5), a.cy + dy / d * (a.nr + 5)];
      const hw = (a.bw || 60) / 2 + 3, hh = (a.bh || 40) / 2 + 3, k = 1 / Math.max(Math.abs(dx) / hw, Math.abs(dy) / hh, 1e-9);
      return [a.cx + dx * Math.min(1, k), a.cy + dy * Math.min(1, k)];
    };
    for (const l of links) {
      const a = byId[l.a], b = byId[l.b];
      if (!a || !b) continue;
      const p = edge(a, b), q = edge(b, a);
      S.link(c, p[0], p[1], q[0], q[1], { color: l.lit ? C.accent : undefined, wireless: !!l.wireless, width: l.lit ? 2.6 : 1.6, arrow: l.arrow });
    }
    for (const it of items) {
      if (it.draw) it.draw(c, it);
      else if (it.kind) S.node(c, it.cx, it.cy, { kind: it.kind, label: it.label, sub: it.sub, r: it.nr, active: !!it.lit, dim: !!it.dim });
      else S.box(c, it.cx - it.bw / 2, it.cy - it.bh / 2, it.bw, it.bh, { label: it.label, sub: it.sub, active: !!it.lit, size: 11.5 });
      if (it.val) kit.label(c, it.val, it.cx, it.cy + (it.kind ? it.nr + 37 : it.bh / 2 + 13), { size: 10.5, color: it.lit ? C.text : C.muted, align: 'center', weight: 600 });
    }
    return byId;
  }

  /* ================================================================ the common machinery
     cfg: { title, blurb, def, layout, layoutN, bends, notes, any: { ev, to, keep }, rw,
            sliders: [kit.controls items], events: [{ id, label }], readouts: [[key, label]],
            mA: (state, v) => mA, cap, cell, minT,           (a battery: the average current and the life, as it runs)
            speed, fast (the states that run at the full clock speed; short bursts in the others run slowly enough to be seen), slow,
            world(kit) -> { reset, step(h, B, v), auto(state, tIn, v), onChange(from, to, why, actions), read(B, v), guards },
            scene(c, rect, narrow, B, w, v, kit), strip(c, rect, B, w, v, kit), stripH } */
  function project(id, cfg) {
    Hyper.sim(id, {
      title: cfg.title,
      blurb: cfg.blurb,
      mount(box, kit) {
        const E = kit.esp, S = kit.esym;
        const st = kit.stage(box.stage, { aspect: (box.stage.clientWidth || 700) < 640 ? 2.0 : 1.0, minH: 600, maxH: 840 });
        const w = cfg.world(kit);
        w.reset();
        // the machine, drawn twice: for a wide and for a narrow stage
        const arrowFor = (dia, from, to, why) => {
          if (cfg.any && why === cfg.any.ev && to === cfg.any.to) { const k = dia.transitions.findIndex(t => t.from === cfg.any.keep && t.to === to); if (k >= 0) return k; }
          return findArrow(dia, from, to, why);
        };
        const draw2 = (lay, bends) => {
          const dia = E.fsmDiagram(cfg.def, lay);
          const seen = {};
          for (const t of dia.transitions) {
            const k = t.from + '>' + t.to, n = seen[k] = (seen[k] || 0) + 1, b = bends && bends[k];
            const am = /^after ([0-9]+) ms$/.exec(t.ev);
            if (am) t.label = 'after ' + fmtShort(+am[1]);
            if (b != null) t.bend = Array.isArray(b) ? b[n - 1] : b;
          }
          if (cfg.any) {
            dia.transitions = dia.transitions.filter(t => !(t.ev === cfg.any.ev && t.to === cfg.any.to && t.from !== cfg.any.keep));
            for (const t of dia.transitions) if (t.ev === cfg.any.ev && t.to === cfg.any.to) t.label = cfg.any.label || (t.label + ' (any)');
          }
          for (const s of dia.states) s.note = (cfg.notes && cfg.notes[s.id]) || '';
          return dia;
        };
        const B = { idx: -1, t: 99, last: null, diaW: draw2(cfg.layout, cfg.bends), diaN: draw2(cfg.layoutN || cfg.layout, cfg.bendsN || cfg.bends) };
        B.m = E.fsm(cfg.def, {
          guards: w.guards, ctx: w,
          onChange(from, to, why, actions) {
            B.idx = arrowFor(B.diaW, from, to, why); B.t = 0; B.last = { from, to, why, actions };
            if (w.onChange) w.onChange(from, to, why, actions);
          }
        });
        let charge = 0, elapsed = 0, lastEv = '—';
        const defs = (cfg.sliders || []).concat([
          { id: 'auto', type: 'check', label: 'Play the events by themselves', value: true },
          { id: 'speed', label: 'Clock speed (waits)', min: 1, max: 600, value: cfg.speed || 60, unit: '×', log: true },
          { type: 'buttons', items: (cfg.events || []).map(e => ({ id: 'ev:' + e.id, label: e.label })).concat([{ id: 'reset', label: 'Start again', primary: true }]) }
        ]);
        const ctl = kit.controls(box.side, defs, (cid, val) => {
          if (cid === 'reset') { B.m.reset(); B.idx = -1; B.t = 99; B.last = null; w.reset(); charge = 0; elapsed = 0; lastEv = '—'; loop.once(); return; }
          if (cid.indexOf('ev:') === 0) {
            const ev = cid.slice(3), before = B.m.state, ok = B.m.send(ev);
            lastEv = ev + ': ' + (ok ? before + ' → ' + B.m.state : 'ignored in ' + before);
          }
          if (cfg.onControl) cfg.onControl(cid, val, w, ctl.values);
          loop.once();
        });
        const v = ctl.values;
        const baseRo = [['state', 'State'], ['t', 'Time in this state'], ['clock', 'Clock'], ['last', 'Last event']];
        const ro = kit.readout(box.side, baseRo.concat(cfg.readouts || [], cfg.mA ? [['avg', 'Average current'], ['life', 'Battery life at this rate']] : []));
        function step(h) {
          w.step(h, B, v);
          if (v.auto && w.auto) { const ev = w.auto(B.m.state, B.m.inState() / 1000, v); if (ev) { const before = B.m.state; if (B.m.send(ev)) lastEv = ev + ': ' + before + ' → ' + B.m.state; } }
          if (cfg.mA) { charge += cfg.mA(B.m.state, v) * h; elapsed += h; }
          B.m.tick(h * 1000);
        }
        const loop = kit.loop(dt => {
          for (let i = 0; i < 40; i++) {
            const eff = !cfg.fast || cfg.fast.indexOf(B.m.state) >= 0 ? v.speed : Math.min(v.speed, cfg.slow || 4);
            step(dt / 40 * eff);
          }
          B.t += dt;
          const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, narrow = W < 640, s = B.m.state;
          const sceneH = H * (narrow ? 0.25 : 0.29), fsmH = H * (narrow ? 0.45 : 0.40);
          cfg.scene(c, { x: M, y: M, w: W - 2 * M, h: sceneH }, narrow, B, w, v, kit);
          const fy = M + sceneH + 8;
          S.fsm(c, narrow ? B.diaN : B.diaW, { box: { x: M, y: fy, w: W - 2 * M, h: fsmH }, active: s, fired: B.t < 1.6 ? B.idx : -1, pulse: B.t / 0.7, rw: cfg.rw || 46 });
          // the time-out of the state, and what the machine did
          const by = fy + fsmH + 10, leftW = narrow ? W - 2 * M : (W - 2 * M) * 0.46;
          const afters = Object.keys(cfg.def.states[s].after || {}).map(Number);
          const aft = afters.length ? Math.min.apply(null, afters) : 0, bw = Math.min(leftW - 4, 260);
          if (aft) {
            const f = clamp(B.m.inState() / aft, 0, 1);
            c.fillStyle = C.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.07)'; c.fillRect(M, by, bw, 7);
            c.fillStyle = f > 0.8 ? C.warn : C.accent; c.fillRect(M, by, bw * f, 7);
            kit.label(c, 'time-out in ' + fmtDur(Math.max(0, aft - B.m.inState())), M, by + 18, { size: 10.5, color: C.muted });
          } else kit.label(c, 'no time-out here: waits for an event', M, by + 7, { size: 10.5, color: C.muted });
          let ly = by + 30;
          if (cfg.strip) {
            const sh = cfg.stripH || (narrow ? 64 : Math.max(50, H - ly - 30));
            cfg.strip(c, { x: M + 8, y: ly + 4, w: leftW - 16, h: sh - 14 }, B, w, v, kit);
            if (narrow) ly += sh + 8;
          }
          const lx = narrow ? M : M + leftW + 14, lyy = narrow ? ly : by;
          drawLog(kit, c, lx, lyy, W - lx - M, B.m, Math.max(2, Math.floor((H - lyy - 14) / 15)));
          // the numbers
          ro.set('state', s); ro.set('t', fmtDur(B.m.inState())); ro.set('clock', fmtDur(w.clock * 1000)); ro.set('last', lastEv);
          if (cfg.mA) {
            const avg = elapsed > 0 ? charge / elapsed : cfg.mA(s, v);
            ro.set('avg', avg >= 1 ? kit.fmt(avg, 3) + ' mA' : kit.fmt(avg * 1000, 3) + ' µA');
            if (elapsed >= (cfg.minT || 600) && avg > 0) {
              const L = E.batteryLife(cfg.cap, avg, { cell: cfg.cell });
              ro.set('life', L.days >= 800 ? kit.fmt(L.years, 3) + ' years' : kit.fmt(L.days, 3) + ' days');
            } else ro.set('life', 'measuring…');
          }
          const extra = w.read(B, v);
          for (const k in extra) ro.set(k, extra[k]);
        }, box.stage);
        st.onResize(() => loop.once());
        loop.start();
      }
    });
  }

  /* ================================================================ wp-weather */
  project('wp-weather', {
    title: 'The weather station that sleeps',
    blurb: `A battery node that wakes, reads, connects, publishes and sleeps. The clock runs fast (ten minutes of sleep in ten seconds, while the awake seconds play slowly); *Average current* and *Battery life* are measured from what the machine does, with 35 µA asleep and typical currents awake.

**Try this**
- Leave it running for a minute: the average settles near 0.7 mA and the life near four months, short of the six the project asks for.
- Pull **Wi-Fi connect time** down to 1.3 s, as a cached channel would: the life nearly doubles.
- Lower the **cell** below 3.3 V: the machine reads, then skips the radio and sleeps.
- Untick **Router answers**: CONNECTING times out after ten seconds, counts a failure, and the average rises.`,
    def: { start: 'SLEEPING', states: {
      SLEEPING: { entry: 'radio off', after: { 600000: 'READING' } },
      READING: { entry: 'power the sensor', on: { READ_OK: [{ to: 'SLEEPING', if: 'low', do: 'skip the radio' }, { to: 'CONNECTING' }] }, after: { 10000: { to: 'SLEEPING', do: 'count a failure' } } },
      CONNECTING: { entry: 'Wi-Fi on', on: { WIFI_UP: 'SENDING' }, after: { 10000: { to: 'SLEEPING', do: 'count a failure' } } },
      SENDING: { entry: 'publish', on: { PUBLISHED: 'SLEEPING' }, after: { 10000: { to: 'SLEEPING', do: 'count a failure' } } } } },
    layout: { SLEEPING: [0.1, 0.16], READING: [0.9, 0.16], CONNECTING: [0.9, 0.86], SENDING: [0.1, 0.86] },
    bends: { 'SLEEPING>READING': 18, 'READING>SLEEPING': 18 },
    any: { ev: 'after 10000 ms', to: 'SLEEPING', keep: 'CONNECTING', label: 'after 10 s (any)' },
    notes: { SLEEPING: '35 µA', READING: '35 mA', CONNECTING: '95 mA', SENDING: '120 mA' },
    sliders: [
      { id: 'vbat', label: 'Cell voltage', min: 3.0, max: 4.2, step: 0.05, value: 3.9, unit: 'V' },
      { id: 'conn', label: 'Wi-Fi connect time', min: 1, max: 8, step: 0.1, value: 3.5, unit: 's' },
      { id: 'wifi', type: 'check', label: 'Router answers', value: true },
      { id: 'broker', type: 'check', label: 'Broker answers', value: true },
      { id: 'sensor', type: 'check', label: 'Sensor answers', value: true }
    ],
    events: [{ id: 'READ_OK', label: 'Sensor answers' }, { id: 'WIFI_UP', label: 'Wi-Fi connects' }, { id: 'PUBLISHED', label: 'Broker accepts' }],
    readouts: [['cell', 'Cell'], ['count', 'Wake-ups · failures · sent']],
    speed: 60, fast: ['SLEEPING'], slow: 4, cap: 3000, cell: '18650', minT: 3600,
    mA: s => ({ SLEEPING: 0.035, READING: 35, CONNECTING: 95, SENDING: 120 })[s],
    world() {
      const w = {
        guards: { low: c => c.low },
        reset() { w.clock = 0; w.wakes = 0; w.failures = 0; w.sent = 0; w.low = false; w.temp = 18; w.rh = 60; w.last = ''; },
        step(h, B, v) {
          w.clock += h; w.low = v.vbat < 3.3;
          w.temp = 18 + 4 * Math.sin(w.clock / 3600 * 0.26); w.rh = 60 + 12 * Math.cos(w.clock / 3600 * 0.26);
        },
        auto(s, t, v) {
          if (s === 'READING' && t >= 0.3 && v.sensor) return 'READ_OK';
          if (s === 'CONNECTING' && t >= v.conn && v.wifi) return 'WIFI_UP';
          if (s === 'SENDING' && t >= 0.5 && v.broker) return 'PUBLISHED';
          return null;
        },
        onChange(from, to, why, actions) {
          if (to === 'READING') w.wakes++;
          if (actions.indexOf('count a failure') >= 0) w.failures++;
          if (why === 'PUBLISHED') { w.sent++; w.last = w.temp.toFixed(1) + ' °C · ' + Math.round(w.rh) + ' %'; }
        },
        read(B, v) { return { cell: v.vbat.toFixed(2) + ' V' + (w.low ? '  (low: no radio)' : ''), count: w.wakes + ' · ' + w.failures + ' · ' + w.sent }; }
      };
      return w;
    },
    scene(c, r, narrow, B, w, v, kit) {
      const s = B.m.state, awake = s !== 'SLEEPING', link = s === 'CONNECTING' || s === 'SENDING';
      flow(kit, c, r, narrow, [
        { id: 'cell', kind: 'battery', label: 'Cell', val: kit.fmt(v.vbat, 3) + ' V', lit: awake, dim: false },
        { id: 'sht', label: 'SHT31', sub: 'I2C', val: w.temp.toFixed(1) + ' °C', lit: s === 'READING' },
        { id: 'esp', label: 'XIAO ESP32C3', sub: awake ? 'awake' : 'asleep', lit: awake },
        { id: 'rt', kind: 'router', label: 'Router', lit: link, dim: !v.wifi },
        { id: 'mq', kind: 'broker', label: 'MQTT broker', val: w.last || 'no message yet', lit: s === 'SENDING', dim: !v.broker }
      ], [{ a: 'cell', b: 'esp', lit: awake }, { a: 'sht', b: 'esp', lit: s === 'READING' }, { a: 'esp', b: 'rt', wireless: true, lit: link }, { a: 'rt', b: 'mq', lit: s === 'SENDING' }]);
    }
  });

  /* ================================================================ wp-thermostat */
  project('wp-thermostat', {
    title: 'The panel thermostat',
    blurb: `A room heated by a relay, with the protections around it. The room warms while the relay is closed and cools towards the outside temperature; the clock runs up to 600 times faster. The chart shows the room against the setpoint and its band.

**Try this**
- Watch one cycle: IDLE → HEATING at the lower edge of the band, → RESTING at the upper edge, three minutes of rest, then IDLE.
- Widen the **band**: fewer, longer cycles. Narrow it to 0.2 °C: many short ones.
- Set the **outside temperature** to −10 °C: the heater cannot reach the setpoint and the four-hour limit stops HEATING.
- Tick **Sensor cable cut** and wait ten simulated minutes: NO_SENSOR from whichever state you were in, relay open.`,
    def: { start: 'IDLE', states: {
      IDLE: { entry: 'relay open', on: { TOO_COLD: 'HEATING', SENSOR_LOST: 'NO_SENSOR' } },
      HEATING: { entry: 'relay closed', on: { WARM_ENOUGH: 'RESTING', SENSOR_LOST: 'NO_SENSOR' }, after: { 14400000: 'RESTING' } },
      RESTING: { entry: 'relay open', on: { SENSOR_LOST: 'NO_SENSOR' }, after: { 180000: 'IDLE' } },
      NO_SENSOR: { entry: 'relay open, alarm', on: { SENSOR_BACK: 'IDLE' } } } },
    layout: { IDLE: [0.07, 0.22], HEATING: [0.5, 0.22], RESTING: [0.93, 0.22], NO_SENSOR: [0.5, 0.88] },
    layoutN: { HEATING: [0.12, 0.1], RESTING: [0.88, 0.1], IDLE: [0.12, 0.55], NO_SENSOR: [0.88, 0.9] },
    bends: { 'HEATING>RESTING': [26, -26], 'RESTING>IDLE': 80, 'IDLE>NO_SENSOR': 20, 'NO_SENSOR>IDLE': 20 },
    bendsN: { 'HEATING>RESTING': [26, -26], 'IDLE>NO_SENSOR': 20, 'NO_SENSOR>IDLE': 20 },
    any: { ev: 'SENSOR_LOST', to: 'NO_SENSOR', keep: 'IDLE', label: 'SENSOR_LOST (any)' },
    notes: { HEATING: 'relay closed', RESTING: '3 min rest' },
    sliders: [
      { id: 'sp', label: 'Setpoint', min: 12, max: 26, step: 0.5, value: 20, unit: '°C' },
      { id: 'hyst', label: 'Half-band', min: 0.2, max: 2, step: 0.1, value: 0.5, unit: '°C' },
      { id: 'out', label: 'Outside temperature', min: -10, max: 18, step: 1, value: 5, unit: '°C' },
      { id: 'cut', type: 'check', label: 'Sensor cable cut', value: false }
    ],
    events: [{ id: 'TOO_COLD', label: 'Too cold' }, { id: 'WARM_ENOUGH', label: 'Warm enough' }, { id: 'SENSOR_LOST', label: 'Sensor lost' }, { id: 'SENSOR_BACK', label: 'Sensor back' }],
    readouts: [['room', 'Room'], ['relay', 'Relay'], ['runs', 'Heating runs']],
    speed: 120, fast: ['IDLE', 'HEATING', 'RESTING', 'NO_SENSOR'], stripH: 120,
    world() {
      const w = {
        reset() { w.clock = 0; w.T = 17.5; w.age = 0; w.hist = []; w.nextHist = 0; w.runs = 0; w.reading = 17.5; },
        step(h, B, v) {
          w.clock += h;
          const heating = B.m.state === 'HEATING', teq = v.out + (heating ? 28 : 0);
          w.T = teq + (w.T - teq) * Math.exp(-h / 10800);
          if (v.cut) w.age += h; else { w.age = 0; w.reading = w.T; }
          if (w.clock >= w.nextHist) { w.hist.push([w.clock, w.T]); w.nextHist = w.clock + 30; if (w.hist.length > 240) w.hist.shift(); }
        },
        auto(s, t, v) {
          if (w.age > 600 && s !== 'NO_SENSOR') return 'SENSOR_LOST';
          if (s === 'NO_SENSOR' && w.age < 1) return 'SENSOR_BACK';
          if (s === 'IDLE' && w.reading < v.sp - v.hyst) return 'TOO_COLD';
          if (s === 'HEATING' && w.reading > v.sp + v.hyst) return 'WARM_ENOUGH';
          return null;
        },
        onChange(from, to) { if (to === 'HEATING') w.runs++; },
        read(B, v) { return { room: w.T.toFixed(1) + ' °C  (set ' + v.sp.toFixed(1) + ')', relay: B.m.state === 'HEATING' ? 'closed' : 'open', runs: String(w.runs) }; }
      };
      return w;
    },
    scene(c, r, narrow, B, w, v, kit) {
      const S = kit.esym, s = B.m.state, on = s === 'HEATING';
      flow(kit, c, r, narrow, [
        { id: 'sen', kind: 'sensor', label: 'SHT31', val: v.cut ? 'no reading' : w.T.toFixed(1) + ' °C', lit: !v.cut, dim: v.cut },
        { id: 'pan', label: 'ESP32-S3 panel', sub: 'LVGL touch', val: 'set ' + v.sp.toFixed(1) + ' °C', lit: true },
        { id: 'rel', label: '', draw(cc, it) { S.relay(cc, it.cx - 32, it.cy - 23, on, { label: 'RELAY' }); kit.label(cc, 'relay 1', it.cx, it.cy + 36, { size: 10.5, color: kit.colors().muted, align: 'center' }); } },
        { id: 'boi', kind: 'home', label: 'Boiler call', sub: 'volt-free', lit: on }
      ], [{ a: 'sen', b: 'pan', lit: !v.cut }, { a: 'pan', b: 'rel', lit: on }, { a: 'rel', b: 'boi', lit: on }]);
    },
    strip(c, r, B, w, v, kit) {
      const S = kit.esym, C = kit.colors();
      const t1 = Math.max(w.clock, 7200), t0 = t1 - 7200, lo = 12, hi = 26;
      const pts = w.hist.filter(p => p[0] >= t0);
      c.fillStyle = C.dark ? 'rgba(123,140,255,.14)' : 'rgba(60,90,220,.10)';
      const yOf = val => r.y + r.h - clamp((val - lo) / (hi - lo), 0, 1) * r.h;
      c.fillRect(r.x, yOf(v.sp + v.hyst), r.w, Math.max(1, yOf(v.sp - v.hyst) - yOf(v.sp + v.hyst)));
      c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(r.x, r.y); c.lineTo(r.x, r.y + r.h); c.lineTo(r.x + r.w, r.y + r.h); c.stroke();
      if (pts.length > 1) S.analog(c, r.x, r.y, r.w, r.h, pts, { t0, t1, min: lo, max: hi, color: C.accent });
      kit.label(c, 'room temperature, the last 2 h; the band is shaded', r.x + 4, r.y - 4, { size: 10, color: C.faint });
    }
  });

  /* ================================================================ wp-plant */
  project('wp-plant', {
    title: 'The plant waterer',
    blurb: `A pot that dries, a probe, a pump and a tank. The machine wakes every 30 minutes, measures, and waters in pulses of six seconds with ten minutes of soaking between them, three pulses a day at most. A fault is latched until the tank is refilled or the power cycled. The clock runs fast while it sleeps; the pump's six seconds play slowly enough to see.

**Try this**
- Raise the **drying rate**: the soil falls below 30 %, MEASURING sees DRY and WATERING starts; after soaking the probe reads wet.
- Tick **Tank empty** during a pulse: WATERING ends at once in FAULT. Untick it: the refill clears the fault.
- Tick **Probe unplugged**: MEASURING gets no reading and times out into FAULT after three seconds.
- Make the pump **weak** and the soil dry quickly: three pulses do not help and the fourth need latches a fault.`,
    def: { start: 'SLEEPING', states: {
      SLEEPING: { entry: 'asleep', after: { 1800000: 'MEASURING' } },
      MEASURING: { entry: 'probe on', on: { WET: 'SLEEPING', DRY: { to: 'WATERING', if: 'left', do: 'count a pulse' } }, after: { 3000: { to: 'FAULT', do: 'latch the fault' } } },
      WATERING: { entry: 'pump on', exit: 'pump off', on: { TANK_EMPTY: { to: 'FAULT', do: 'latch the fault' } }, after: { 6000: 'SOAKING' } },
      SOAKING: { entry: 'asleep', after: { 600000: 'MEASURING' } },
      FAULT: { entry: 'pump off, alarm', on: { RESET: 'SLEEPING' } } } },
    layout: { SLEEPING: [0.07, 0.16], MEASURING: [0.42, 0.16], WATERING: [0.93, 0.16], SOAKING: [0.8, 0.86], FAULT: [0.2, 0.86] },
    layoutN: { SLEEPING: [0.12, 0.08], MEASURING: [0.88, 0.08], SOAKING: [0.12, 0.5], WATERING: [0.88, 0.5], FAULT: [0.5, 0.93] },
    bends: { 'SLEEPING>MEASURING': 20, 'MEASURING>SLEEPING': 20, 'WATERING>FAULT': 60, 'SOAKING>MEASURING': -30 },
    bendsN: { 'SLEEPING>MEASURING': 20, 'MEASURING>SLEEPING': 20, 'MEASURING>FAULT': 70, 'FAULT>SLEEPING': 32, 'WATERING>FAULT': 20, 'WATERING>SOAKING': -30 },
    notes: { SLEEPING: '40 µA', MEASURING: '30 mA', WATERING: '250 mA', SOAKING: '40 µA' },
    sliders: [
      { id: 'dry', label: 'Drying rate', min: 0.5, max: 12, step: 0.5, value: 6, unit: '% per hour' },
      { id: 'pulse', label: 'What one pulse adds', min: 2, max: 20, step: 1, value: 12, unit: '%' },
      { id: 'tank', type: 'check', label: 'Tank empty', value: false },
      { id: 'unplug', type: 'check', label: 'Probe unplugged', value: false }
    ],
    events: [{ id: 'DRY', label: 'Soil is dry' }, { id: 'WET', label: 'Soil is wet' }, { id: 'TANK_EMPTY', label: 'Float: empty' }, { id: 'RESET', label: 'Reset the fault' }],
    readouts: [['soil', 'Soil moisture'], ['mv', 'Probe'], ['pulses', 'Pulses today']],
    speed: 240, fast: ['SLEEPING', 'SOAKING', 'FAULT'], slow: 6, cap: 3000, cell: '18650', minT: 43200, stripH: 56,
    mA: s => ({ SLEEPING: 0.04, MEASURING: 30, WATERING: 250, SOAKING: 0.04, FAULT: 0.04 })[s],
    world() {
      const w = {
        guards: { left: c => c.pulses < 3 },
        reset() { w.clock = 0; w.soil = 40; w.probe = 40; w.pulses = 0; w.day = 0; w.target = 40; w.flash = 0; w.reason = ''; },
        step(h, B, v) {
          w.clock += h; w.day += h;
          if (w.day >= 86400) { w.day = 0; w.pulses = 0; }
          w.target = clamp(w.target - v.dry * h / 3600, 0, 100);
          if (B.m.state === 'WATERING' && !v.tank) { w.target = clamp(w.target + v.pulse * h / 6, 0, 100); w.flash = 1; }
          w.soil = w.target;
          w.probe += (w.soil - w.probe) * (1 - Math.exp(-h / 300));      // the probe sees the water late
          w.flash = Math.max(0, w.flash - h / 3);
        },
        auto(s, t, v) {
          if (s === 'MEASURING' && t >= 0.3 && !v.unplug) return w.probe < 30 ? 'DRY' : 'WET';
          if (s === 'WATERING' && v.tank) return 'TANK_EMPTY';
          if (s === 'FAULT' && w.reason === 'tank' && !v.tank) return 'RESET';
          return null;
        },
        onChange(from, to, why, actions) {
          if (actions.indexOf('count a pulse') >= 0) w.pulses++;
          if (to === 'FAULT') w.reason = from === 'WATERING' ? 'tank' : 'probe';
          if (why === 'RESET') { w.pulses = 0; w.reason = ''; }
        },
        read(B, v) { return { soil: Math.round(w.soil) + ' %  (probe sees ' + Math.round(w.probe) + ' %)', mv: v.unplug ? 'unplugged' : Math.round(2300 - w.probe * 12) + ' mV', pulses: w.pulses + ' of 3' }; }
      };
      return w;
    },
    scene(c, r, narrow, B, w, v, kit) {
      const S = kit.esym, C = kit.colors(), s = B.m.state, pumping = s === 'WATERING' && !v.tank;
      flow(kit, c, r, narrow, [
        { id: 'prb', kind: 'sensor', label: 'Soil probe', val: v.unplug ? 'unplugged' : Math.round(w.probe) + ' %', lit: s === 'MEASURING', dim: v.unplug },
        { id: 'esp', label: 'XIAO ESP32C3', sub: s === 'SLEEPING' || s === 'SOAKING' ? 'asleep' : 'awake', lit: s !== 'SLEEPING' && s !== 'SOAKING' },
        { id: 'mot', kind: 'motor', label: 'Pump', sub: 'MOSFET', lit: pumping },
        { id: 'tnk', label: '', draw(cc, it) {
            const x = it.cx - 22, y = it.cy - 26, hh = 52;
            cc.strokeStyle = C.text2; cc.lineWidth = 2; cc.strokeRect(x, y, 44, hh);
            if (!v.tank) { cc.fillStyle = kit.hue(205, 0.55); cc.fillRect(x + 1, y + hh * 0.35, 42, hh * 0.65 - 1); }
            kit.label(cc, 'Tank', it.cx, it.cy + 38, { size: 11.5, weight: 600, align: 'center' });
            kit.label(cc, v.tank ? 'float: empty' : 'float: water', it.cx, it.cy + 51, { size: 10.5, color: v.tank ? C.bad : C.muted, align: 'center' });
          } }
      ], [{ a: 'prb', b: 'esp', lit: s === 'MEASURING' }, { a: 'esp', b: 'mot', lit: pumping }, { a: 'mot', b: 'tnk', lit: pumping }]);
    },
    strip(c, r, B, w, v, kit) {
      const C = kit.colors();
      c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(r.x, r.y + 6, r.w, 12);
      c.fillStyle = kit.hue(205, 0.7); c.fillRect(r.x, r.y + 6, r.w * clamp(w.soil / 100, 0, 1), 12);
      c.strokeStyle = C.warn; c.lineWidth = 2; const x30 = r.x + r.w * 0.3; c.beginPath(); c.moveTo(x30, r.y + 2); c.lineTo(x30, r.y + 22); c.stroke();
      kit.label(c, 'soil moisture; the mark is 30 %', r.x, r.y + 32, { size: 10, color: C.faint });
    }
  });

  /* ================================================================ wp-doorbell */
  project('wp-doorbell', {
    title: 'The doorbell camera',
    blurb: `A button wakes the board; it rings, takes one photograph, uploads it and goes back to sleep. A second press inside the cooldown only chimes. The demo presses the button by itself every 30 seconds so that there is something to watch; the battery estimate at the bottom uses the *presses per day* you set, not the demo.

**Try this**
- Watch a full press: RINGING (1.5 s), CAPTURING, UPLOADING, COOLDOWN, then ASLEEP.
- Untick **Wi-Fi works**: UPLOADING gives up after 15 s and the doorbell still rang.
- Untick **Camera works**: CAPTURING gives up after 4 s with no picture.
- Raise the **sleep current** from 0.1 mA to 2 mA and read the battery life: the sleeping, not the presses, decides it.`,
    def: { start: 'ASLEEP', states: {
      ASLEEP: { entry: 'deep sleep', on: { BUTTON: 'RINGING' } },
      RINGING: { entry: 'chime on', after: { 1500: 'CAPTURING' } },
      CAPTURING: { entry: 'camera on', on: { FRAME_READY: 'UPLOADING' }, after: { 4000: { to: 'ASLEEP', do: 'no picture' } } },
      UPLOADING: { entry: 'Wi-Fi, POST', on: { UPLOADED: 'COOLDOWN' }, after: { 15000: { to: 'ASLEEP', do: 'give up' } } },
      COOLDOWN: { entry: 'camera off', on: { BUTTON: { internal: true, do: 'chime only, no photo' } }, after: { 20000: 'ASLEEP' } } } },
    layout: { ASLEEP: [0.5, 0.1], RINGING: [0.88, 0.4], CAPTURING: [0.76, 0.9], UPLOADING: [0.24, 0.9], COOLDOWN: [0.12, 0.4] },
    layoutN: { ASLEEP: [0.12, 0.06], RINGING: [0.88, 0.06], CAPTURING: [0.88, 0.5], UPLOADING: [0.88, 0.93], COOLDOWN: [0.12, 0.93] },
    bends: { 'CAPTURING>ASLEEP': 24, 'UPLOADING>ASLEEP': -24 },
    bendsN: {},
    sliders: [
      { id: 'rate', label: 'Presses per day', min: 1, max: 60, step: 1, value: 3 },
      { id: 'sleep', label: 'Sleep current of the board', min: 0.05, max: 2, step: 0.05, value: 0.5, unit: 'mA' },
      { id: 'wifi', type: 'check', label: 'Wi-Fi works', value: true },
      { id: 'cam', type: 'check', label: 'Camera works', value: true }
    ],
    events: [{ id: 'BUTTON', label: 'Press the doorbell' }, { id: 'FRAME_READY', label: 'Frame ready' }, { id: 'UPLOADED', label: 'Upload done' }],
    readouts: [['pics', 'Photos sent · missed'], ['est', 'Average current (estimate)'], ['lifeEst', 'Battery life, 3000 mAh']],
    speed: 6, slow: 5,
    world(kit) {
      const E = kit.esp;
      const w = {
        reset() { w.clock = 0; w.sent = 0; w.missed = 0; w.cdPress = false; },
        step(h) { w.clock += h; },
        auto(s, t, v) {
          if (s === 'ASLEEP' && t >= 30) return 'BUTTON';
          if (s === 'CAPTURING' && t >= 0.6 && v.cam) return 'FRAME_READY';
          if (s === 'UPLOADING' && t >= 3 && v.wifi) return 'UPLOADED';
          if (s === 'COOLDOWN' && t >= 8 && !w.cdPress) { w.cdPress = true; return 'BUTTON'; }
          return null;
        },
        onChange(from, to, why, actions) {
          if (to === 'COOLDOWN' && from !== 'COOLDOWN') w.cdPress = false;
          if (why === 'UPLOADED') w.sent++;
          if (actions.indexOf('no picture') >= 0 || actions.indexOf('give up') >= 0) w.missed++;
        },
        read(B, v) {
          const avg = v.sleep + v.rate * 1760 / 86400;     // 8 s at 220 mA per press, spread over a day
          const L = E.batteryLife(3000, avg, { cell: '18650' });
          return { pics: w.sent + ' · ' + w.missed, est: avg.toFixed(2) + ' mA', lifeEst: L.days >= 800 ? L.years.toFixed(1) + ' years' : Math.round(L.days) + ' days' };
        }
      };
      return w;
    },
    scene(c, r, narrow, B, w, v, kit) {
      const S = kit.esym, s = B.m.state, awake = s !== 'ASLEEP' && s !== 'COOLDOWN';
      const pressed = !!(B.last && (B.last.why === 'BUTTON') && B.t < 0.6);
      flow(kit, c, r, narrow, [
        { id: 'btn', label: '', draw(cc, it) { S.button(cc, it.cx, it.cy, { pressed, size: 28 }); kit.label(cc, 'Button', it.cx, it.cy + 30, { size: 11.5, weight: 600, align: 'center' }); kit.label(cc, 'GPIO4', it.cx, it.cy + 44, { size: 10, color: kit.colors().muted, align: 'center' }); } },
        { id: 'esp', label: 'XIAO S3 Sense', sub: awake ? 'awake' : 'asleep', lit: awake },
        { id: 'buz', label: '', draw(cc, it) { S.buzzer(cc, it.cx, it.cy, s === 'RINGING', { phase: B.t * 3, r: 12 }); kit.label(cc, 'Chime', it.cx, it.cy + 30, { size: 11.5, weight: 600, align: 'center' }); kit.label(cc, 'GPIO1', it.cx, it.cy + 44, { size: 10, color: kit.colors().muted, align: 'center' }); } },
        { id: 'cam', kind: 'camera', label: 'Camera', val: v.cam ? '' : 'not working', lit: s === 'CAPTURING', dim: !v.cam },
        { id: 'rt', kind: 'router', label: 'Router', lit: s === 'UPLOADING', dim: !v.wifi },
        { id: 'srv', kind: 'server', label: 'Home server', lit: s === 'UPLOADING' && v.wifi }
      ], [{ a: 'btn', b: 'esp', lit: pressed }, { a: 'esp', b: 'buz', lit: s === 'RINGING' }, { a: 'esp', b: 'cam', lit: s === 'CAPTURING' }, { a: 'esp', b: 'rt', wireless: true, lit: s === 'UPLOADING' }, { a: 'rt', b: 'srv', lit: s === 'UPLOADING' && v.wifi }]);
    }
  });

  /* ================================================================ wp-espnow */
  project('wp-espnow', {
    title: 'An ESP-NOW node and its gateway',
    blurb: `A battery node wakes every five minutes, measures, and sends six bytes to the gateway, which sits on the router's channel. The node transmits on channel 6. Each send ends as *acknowledged* or *not*; with tries left the node backs off and sends again, up to three times. *Average current* and *Battery life* (three AA cells) are measured as it runs.

**Try this**
- Leave it running: the reports are acknowledged at once, the average settles near 0.09 mA, and the life near two years.
- Move the **router's channel** to 11: every send ends not acknowledged, the node tries three times, counts a failure and sleeps.
- Raise **Frames lost** to 60 %: some reports need two or three tries; the average rises with them.
- Switch the **gateway** off: the same as a wrong channel from the node's point of view.`,
    def: { start: 'SLEEPING', states: {
      SLEEPING: { entry: 'asleep', after: { 300000: 'MEASURING' } },
      MEASURING: { entry: 'NTC on', on: { READ_DONE: 'SENDING' } },
      SENDING: { entry: 'send', on: { ACKED: 'SLEEPING', NOT_ACKED: [{ to: 'BACKOFF', if: 'left', do: 'count a try' }, { to: 'SLEEPING', do: 'count a failure' }] } },
      BACKOFF: { entry: 'wait', after: { 100: 'SENDING' } } } },
    layout: { SLEEPING: [0.07, 0.16], MEASURING: [0.93, 0.16], SENDING: [0.93, 0.86], BACKOFF: [0.07, 0.86] },
    bends: { 'SENDING>SLEEPING': [26, -26], 'SENDING>BACKOFF': 24, 'BACKOFF>SENDING': 24 },
    notes: { SLEEPING: '30 µA', MEASURING: '33 mA', SENDING: '105 mA' },
    sliders: [
      { id: 'ch', label: 'Router (gateway) channel', min: 1, max: 13, step: 1, value: 6 },
      { id: 'loss', label: 'Frames lost', min: 0, max: 90, step: 5, value: 20, unit: '%' },
      { id: 'gw', type: 'check', label: 'Gateway powered', value: true }
    ],
    events: [{ id: 'READ_DONE', label: 'Reading done' }, { id: 'ACKED', label: 'Acknowledged' }, { id: 'NOT_ACKED', label: 'Not acknowledged' }],
    readouts: [['rep', 'Delivered · given up'], ['tries', 'Attempts · this report'], ['chan', 'Channels']],
    speed: 90, fast: ['SLEEPING'], slow: 4, cap: 2500, cell: 'aa3', minT: 3000,
    mA: s => ({ SLEEPING: 0.03, MEASURING: 33, SENDING: 105, BACKOFF: 30 })[s],
    world() {
      const rnd = rng(7);
      const w = {
        guards: { left: c => c.tries < 2 },
        reset() { w.clock = 0; w.delivered = 0; w.failed = 0; w.attempts = 0; w.tries = 0; w.outcome = true; w.v = { ch: 6, loss: 0, gw: true }; },
        step(h, B, v) { w.clock += h; w.v = v; },
        auto(s, t) {
          if (s === 'MEASURING' && t >= 0.25) return 'READ_DONE';
          if (s === 'SENDING') { if (w.outcome && t >= 0.03) return 'ACKED'; if (!w.outcome && t >= 0.1) return 'NOT_ACKED'; }
          return null;
        },
        onChange(from, to, why, actions) {
          if (to === 'MEASURING') w.tries = 0;
          if (to === 'SENDING') { w.attempts++; w.outcome = w.v.gw && w.v.ch === 6 && rnd() * 100 >= w.v.loss; }
          if (why === 'ACKED') w.delivered++;
          if (actions.indexOf('count a try') >= 0) w.tries++;
          if (actions.indexOf('count a failure') >= 0) w.failed++;
        },
        read(B, v) { return { rep: w.delivered + ' · ' + w.failed, tries: w.attempts + ' · ' + (w.tries + 1), chan: 'node 6, gateway ' + v.ch + (v.ch === 6 ? ' (same)' : ' (differ)') }; }
      };
      return w;
    },
    scene(c, r, narrow, B, w, v, kit) {
      const s = B.m.state, awake = s !== 'SLEEPING', same = v.ch === 6 && v.gw;
      flow(kit, c, r, narrow, [
        { id: 'ntc', kind: 'sensor', label: 'NTC', sub: 'on a pin', lit: s === 'MEASURING' },
        { id: 'nod', label: 'Node XIAO C3', sub: awake ? 'awake · ch 6' : 'asleep · ch 6', lit: awake },
        { id: 'gw', kind: 'gateway', label: 'Gateway', sub: 'ch ' + v.ch, val: same ? 'same channel' : (v.gw ? 'other channel' : 'off'), lit: s === 'SENDING' && same, dim: !v.gw },
        { id: 'rt', kind: 'router', label: 'Router', sub: 'ch ' + v.ch, lit: false },
        { id: 'mq', kind: 'broker', label: 'MQTT', lit: false }
      ], [{ a: 'ntc', b: 'nod', lit: s === 'MEASURING' }, { a: 'nod', b: 'gw', wireless: true, lit: s === 'SENDING' }, { a: 'gw', b: 'rt', lit: s === 'SENDING' && same }, { a: 'rt', b: 'mq', lit: false }]);
    }
  });

  /* ================================================================ wp-presence */
  project('wp-presence', {
    title: 'A BLE tag in a room',
    blurb: `A tag advertises once a second; the board listens (half of the time, as it should when Wi-Fi shares the radio) and, every four seconds, decides whether it heard the tag *strongly enough*. Three such periods within twenty seconds mean "home"; a hundred and twenty seconds without one mean "away". Signal strength falls with the logarithm of distance, with an extra loss behind the wall at 5 m, and wobbles by a few decibels.

**Try this**
- Start with the tag 3 m away: ABSENT → ARRIVING → PRESENT in about twelve seconds.
- Move it to 15 m: the signal is under the threshold and PRESENT times out into ABSENT.
- Put **a wall** (10 dB) behind 5 m and watch the signal drop at the wall.
- Lower the **listening share** to 10 %: sightings get rare and arriving takes longer.
- Tick **Tag battery dead**: no advertisements at all.`,
    def: { start: 'ABSENT', states: {
      ABSENT: { entry: 'away', on: { SEEN: { to: 'ARRIVING', do: 'sightings = 1' } } },
      ARRIVING: { entry: 'counting', on: { SEEN: [{ to: 'PRESENT', if: 'three', do: 'publish home' }, { internal: true, do: 'count the sighting' }] }, after: { 20000: 'ABSENT' } },
      PRESENT: { entry: 'home', on: { SEEN: 'PRESENT' }, after: { 120000: { to: 'ABSENT', do: 'publish away' } } } } },
    layout: { ABSENT: [0.07, 0.4], ARRIVING: [0.5, 0.4], PRESENT: [0.93, 0.4] },
    layoutN: { ABSENT: [0.15, 0.2], ARRIVING: [0.85, 0.2], PRESENT: [0.85, 0.88] },
    bends: { 'PRESENT>ABSENT': -110, 'ABSENT>ARRIVING': 20, 'ARRIVING>ABSENT': 20 },
    notes: { ABSENT: 'away', PRESENT: 'home' },
    sliders: [
      { id: 'dist', label: 'Distance to the tag', min: 0.5, max: 25, step: 0.5, value: 3, unit: 'm' },
      { id: 'walls', label: 'Loss behind the wall at 5 m', min: 0, max: 20, step: 1, value: 0, unit: 'dB' },
      { id: 'thr', label: 'Threshold', min: -95, max: -60, step: 1, value: -80, unit: 'dBm' },
      { id: 'duty', label: 'Listening share', min: 10, max: 100, step: 10, value: 50, unit: '%' },
      { id: 'dead', type: 'check', label: 'Tag battery dead', value: false }
    ],
    events: [{ id: 'SEEN', label: 'Tag heard' }],
    readouts: [['rssi', 'Last advertisement'], ['best', 'Strongest this period'], ['sight', 'Sightings counted']],
    speed: 6, fast: ['ABSENT', 'ARRIVING', 'PRESENT'],
    world() {
      const rnd = rng(11);
      const w = {
        guards: { three: c => c.sightings >= 2 },
        reset() { w.clock = 0; w.sightings = 0; w.rssi = -100; w.best = -100; w.advT = 0; w.perT = 0; w.pending = false; w.hist = []; w.heard = 0; },
        step(h, B, v) {
          w.clock += h; w.advT += h; w.perT += h;
          if (w.advT >= 1) {
            w.advT -= 1;
            if (!v.dead && rnd() * 100 < v.duty) {
              const wall = v.dist > 5 ? v.walls : 0;
              w.rssi = -59 - 25 * Math.log10(Math.max(0.5, v.dist)) - wall + (rnd() - 0.5) * 6;
              w.best = Math.max(w.best, w.rssi); w.heard = 1.2;
              w.hist.push([w.clock, w.rssi]);
              if (w.hist.length > 140) w.hist.shift();
            }
          }
          w.heard = Math.max(0, w.heard - h);
          if (w.perT >= 4) { w.perT -= 4; if (w.best >= v.thr) w.pending = true; w.best = -100; }
        },
        auto() { if (w.pending) { w.pending = false; return 'SEEN'; } return null; },
        onChange(from, to, why, actions) {
          if (actions.indexOf('sightings = 1') >= 0) w.sightings = 1;
          if (actions.indexOf('count the sighting') >= 0) w.sightings++;
        },
        read(B, v) { return { rssi: w.rssi > -99 ? Math.round(w.rssi) + ' dBm' : 'nothing yet', best: w.best > -99 ? Math.round(w.best) + ' dBm' : '—', sight: String(w.sightings) }; }
      };
      return w;
    },
    scene(c, r, narrow, B, w, v, kit) {
      const S = kit.esym, C = kit.colors(), s = B.m.state;
      c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.6; c.strokeRect(r.x + 4, r.y + 4, r.w - 8, r.h - 8); c.restore();
      const ex = r.x + 62, ey = r.y + r.h * 0.45, span = Math.max(60, r.w - 190), X = d => ex + 56 + span * clamp((d - 0.5) / 24.5, 0, 1);
      S.box(c, ex - 40, ey - 24, 80, 48, { label: 'ESP32-C3', sub: 'scanner', active: s === 'PRESENT', size: 11.5 });
      if (v.walls > 0) {
        const wx = X(5);
        c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(wx, r.y + 24); c.lineTo(wx, r.y + r.h - 12); c.stroke(); c.restore();
        kit.label(c, 'wall −' + v.walls + ' dB', wx, r.y + 14, { size: 10, color: C.warn, align: 'center' });
      }
      S.link(c, ex + 44, ey, X(v.dist) - 18, ey, { wireless: true, color: w.heard > 0 ? C.accent : undefined, width: w.heard > 0 ? 2.4 : 1.4 });
      S.node(c, X(v.dist), ey, { kind: 'tag', label: 'Tag', sub: v.dist.toFixed(1) + ' m', r: 14, active: w.heard > 0, dim: v.dead });
      S.bars(c, ex - 17, ey + 34, w.rssi, { w: 34, h: 18, label: w.rssi > -99 ? Math.round(w.rssi) + ' dBm' : 'no signal' });
    },
    strip(c, r, B, w, v, kit) {
      const S = kit.esym, C = kit.colors();
      const t1 = Math.max(w.clock, 120), t0 = t1 - 120, lo = -100, hi = -40;
      const yOf = val => r.y + r.h - clamp((val - lo) / (hi - lo), 0, 1) * r.h;
      c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(r.x, r.y); c.lineTo(r.x, r.y + r.h); c.lineTo(r.x + r.w, r.y + r.h); c.stroke();
      c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.4; c.beginPath(); c.moveTo(r.x, yOf(v.thr)); c.lineTo(r.x + r.w, yOf(v.thr)); c.stroke(); c.restore();
      for (const p of w.hist) { if (p[0] < t0) continue; kit.dot(c, r.x + (p[0] - t0) / 120 * r.w, yOf(p[1]), 2.6, p[1] >= v.thr ? C.accent : C.faint); }
      kit.label(c, 'advertisements heard, the last 2 min; the dashed line is the threshold', r.x + 4, r.y - 4, { size: 10, color: C.faint });
    }
  });

  /* ================================================================ wp-energy */
  project('wp-energy', {
    title: 'The metering module and its reader',
    blurb: `The module does the mains measuring behind an isolation barrier; the ESP only asks over a serial port. The machine waits ten seconds, asks, expects the answer within half a second (three misses in a row make the meter *offline*), and publishes. The shaded side is the mains side: nothing of the ESP is on it.

**Try this**
- Change the **load**: the meter's volts, amps, watts and the energy counter follow; the messages carry them.
- Tick **Meter unplugged**: ASKING gets no reply, counts misses, and after the third goes to NO_METER, which tries again every 30 s.
- Untick **Broker answers**: PUBLISHING gives up after 3 s and drops the reading.
- Clear **Meter unplugged** again: the next poll succeeds and the count of misses starts from zero.`,
    def: { start: 'WAITING', states: {
      WAITING: { entry: 'idle', after: { 10000: 'ASKING' } },
      ASKING: { entry: 'send the request', on: { REPLY_OK: 'PUBLISHING', NO_REPLY: [{ to: 'ASKING', if: 'few', do: 'count a miss' }, { to: 'NO_METER', do: 'publish offline' }] } },
      PUBLISHING: { entry: 'publish', on: { PUBLISHED: 'WAITING' }, after: { 3000: { to: 'WAITING', do: 'drop the reading' } } },
      NO_METER: { entry: 'offline', after: { 30000: 'ASKING' } } } },
    layout: { WAITING: [0.07, 0.18], ASKING: [0.5, 0.18], NO_METER: [0.93, 0.18], PUBLISHING: [0.5, 0.86] },
    layoutN: { ASKING: [0.12, 0.2], NO_METER: [0.88, 0.2], WAITING: [0.12, 0.9], PUBLISHING: [0.88, 0.9] },
    bends: { 'PUBLISHING>WAITING': [26, -26], 'ASKING>NO_METER': 24, 'NO_METER>ASKING': 24 },
    sliders: [
      { id: 'load', label: 'Load on the circuit', min: 0, max: 3000, step: 50, value: 650, unit: 'W' },
      { id: 'unplug', type: 'check', label: 'Meter unplugged', value: false },
      { id: 'broker', type: 'check', label: 'Broker answers', value: true }
    ],
    events: [{ id: 'REPLY_OK', label: 'Meter replies' }, { id: 'NO_REPLY', label: 'No reply' }, { id: 'PUBLISHED', label: 'Broker accepts' }],
    readouts: [['meter', 'The meter says'], ['kwh', 'Energy counter'], ['msg', 'Messages sent · misses']],
    speed: 10, fast: ['WAITING', 'NO_METER'], slow: 3,
    world() {
      const w = {
        guards: { few: c => c.misses < 2 },
        reset() { w.clock = 0; w.misses = 0; w.sent = 0; w.kwh = 18.274; w.lastV = 230; },
        step(h, B, v) { w.clock += h; w.lastV = 230 + 1.8 * Math.sin(w.clock / 40); w.kwh += v.load * h / 3.6e6; },
        auto(s, t, v) {
          if (s === 'ASKING') { if (!v.unplug && t >= 0.15) return 'REPLY_OK'; if (v.unplug && t >= 0.5) return 'NO_REPLY'; }
          if (s === 'PUBLISHING' && t >= 0.05 && v.broker) return 'PUBLISHED';
          return null;
        },
        onChange(from, to, why, actions) {
          if (why === 'REPLY_OK') w.misses = 0;
          if (actions.indexOf('count a miss') >= 0) w.misses++;
          if (why === 'PUBLISHED') w.sent++;
        },
        read(B, v) {
          const amps = v.load / (w.lastV * 0.95);
          return { meter: v.unplug ? 'no reply' : w.lastV.toFixed(1) + ' V · ' + amps.toFixed(2) + ' A · ' + Math.round(v.load) + ' W', kwh: w.kwh.toFixed(3) + ' kWh', msg: w.sent + ' · ' + w.misses };
        }
      };
      return w;
    },
    scene(c, r, narrow, B, w, v, kit) {
      const C = kit.colors(), s = B.m.state;
      const amps = v.load / (w.lastV * 0.95);
      const items = [
        { id: 'mn', kind: 'home', label: 'Mains circuit', val: Math.round(v.load) + ' W', lit: v.load > 0 },
        { id: 'mod', label: 'Metering module', sub: 'isolated', val: v.unplug ? 'unplugged' : w.lastV.toFixed(0) + ' V · ' + amps.toFixed(1) + ' A', lit: s === 'ASKING' && !v.unplug, dim: v.unplug },
        { id: 'esp', label: 'XIAO ESP32C3', sub: '5 V side', lit: s === 'ASKING' || s === 'PUBLISHING' },
        { id: 'rt', kind: 'router', label: 'Router', lit: s === 'PUBLISHING' },
        { id: 'mq', kind: 'broker', label: 'MQTT broker', lit: s === 'PUBLISHING' && v.broker, dim: !v.broker }
      ];
      const n = items.length, cols = narrow ? Math.ceil(n / 2) : n, cw = r.w / cols;
      const bx = r.x + cw * 2;                      // the barrier, between the module and the ESP
      c.fillStyle = C.dark ? 'rgba(229,72,77,.12)' : 'rgba(229,72,77,.09)';
      c.fillRect(r.x, r.y, bx - r.x, narrow ? r.h / 2 : r.h);
      const byId = flow(kit, c, r, narrow, items, [{ a: 'mn', b: 'mod', lit: v.load > 0 }, { a: 'mod', b: 'esp', lit: s === 'ASKING' && !v.unplug, arrow: 'both' }, { a: 'esp', b: 'rt', wireless: true, lit: s === 'PUBLISHING' }, { a: 'rt', b: 'mq', lit: s === 'PUBLISHING' && v.broker }]);
      c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, r.y + 4); c.lineTo(bx, r.y + (narrow ? r.h / 2 : r.h) - 4); c.stroke(); c.restore();
      kit.label(c, 'mains side', r.x + 6, r.y + 10, { size: 10.5, color: C.bad, weight: 600 });
      kit.label(c, 'isolation', bx + 4, r.y + 10, { size: 10.5, color: C.bad, weight: 600 });
    }
  });
})();
