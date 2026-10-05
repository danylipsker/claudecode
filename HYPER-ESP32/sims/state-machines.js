/* HYPER-ESP32 · sims/state-machines.js
 *
 * Simulations of the topic "State machines". Each is a machine the reader operates: buttons for the events, a clock
 * that fires the timeouts, the diagram with the active state lit and the last transition flashing, and the outputs
 * (lamps, a door, a pump) following the state.
 *
 *   sm-delay-vs-machine   the stair light written with delay() and as a machine, on the same button presses
 *   sm-crossing           a pedestrian crossing: states, events, the transition table
 *   sm-diagram-check      the push-button machine, with flaws to switch on and the checker's report
 *   sm-code-layouts       one mode selector, three code layouts, and the lines each press touches
 *   sm-pump               a pump on a tank: timeouts, rests, and (mode 'fault') a latched fault
 *   sm-door-lock          entry and exit actions, a guard, and the bug of resetting in an entry action
 *   sm-event-queue        a ring buffer between the commands and a vent machine
 *   sm-hierarchy          a garage door drawn flat and with a parent state
 *   sm-two-machines       a button machine and a lamp machine exchanging events
 *   sm-connection         Wi-Fi and MQTT with timeouts and back-off, against a network you can break
 *   sm-requirements       a hand dryer grown from its description, with the state-by-event grid
 *   sm-test-bench         a test script run against the button machine, with bugs to switch on
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const fmtS = ms => (ms / 1000).toFixed(1) + ' s';

  /* which arrow of the drawing the engine's log entry belongs to */
  function findArrow(dia, from, to, why) {
    const ts = dia.transitions;
    let i = ts.findIndex(t => t.from === from && t.to === to && t.ev === why);
    if (i < 0 && /^after/.test(String(why))) i = ts.findIndex(t => t.from === from && t.to === to && /^after/.test(t.ev));
    if (i < 0) i = ts.findIndex(t => t.from === from && t.to === to);
    return i;
  }

  /* a phone-width stage gets a taller picture, laid out in a column */
  const isNarrow = box => (box.stage.clientWidth || 700) < 560;

  /* a running machine together with its drawing.
     o: { layout: { STATE: [x, y] }, bends: { 'A>B': pixels }, guards, ctx, rw, onChange(from, to, why, actions) } */
  function bench(kit, def, o) {
    o = o || {};
    const E = kit.esp;
    const b = { def, o, idx: -1, t: 99, last: null };
    b.dia = E.fsmDiagram(def, o.layout || {});
    const seen = {};
    for (const t of b.dia.transitions) {
      const k = t.from + '>' + t.to, n = seen[k] = (seen[k] || 0) + 1, v = o.bends && o.bends[k];
      if (v != null) t.bend = Array.isArray(v) ? v[n - 1] : v;
    }
    b.m = E.fsm(def, {
      guards: o.guards, ctx: o.ctx,
      onChange(from, to, why, actions) {
        b.idx = findArrow(b.dia, from, to, why); b.t = 0; b.last = { from, to, why, actions };
        if (o.onChange) o.onChange(from, to, why, actions);
      }
    });
    return b;
  }
  /* draw it: the active state lit, the arrow that just fired flashing */
  function drawBench(kit, c, b, box, extra) {
    return kit.esym.fsm(c, b.dia, Object.assign({ box, active: b.m.state, fired: b.t < 1.6 ? b.idx : -1, pulse: b.t / 0.7, rw: b.o.rw }, extra || {}));
  }

  /* the last few things the machine did */
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

  /* the machine as a table, the row of the active state lit */
  function drawTable(kit, c, x, y, w, dia, active, fired) {
    const C = kit.colors(), rh = 16, cw = [0.3, 0.4, 0.3].map(f => f * w);
    kit.label(c, 'In state', x + 4, y, { size: 10.5, color: C.faint, weight: 600 });
    kit.label(c, 'When', x + cw[0] + 4, y, { size: 10.5, color: C.faint, weight: 600 });
    kit.label(c, 'Go to', x + cw[0] + cw[1] + 4, y, { size: 10.5, color: C.faint, weight: 600 });
    dia.transitions.forEach((t, i) => {
      const yy = y + 16 + i * rh, on = t.from === active;
      if (on || i === fired) {
        c.fillStyle = i === fired ? (C.dark ? 'rgba(224,160,48,.30)' : 'rgba(224,160,48,.28)') : (C.dark ? 'rgba(123,140,255,.16)' : 'rgba(60,90,220,.10)');
        c.fillRect(x, yy - rh / 2, w, rh);
      }
      const col = on ? C.text : C.muted;
      kit.label(c, t.from, x + 4, yy, { size: 11, color: col, weight: on ? 650 : 500 });
      kit.label(c, t.label, x + cw[0] + 4, yy, { size: 11, color: col });
      kit.label(c, t.to, x + cw[0] + cw[1] + 4, yy, { size: 11, color: col });
    });
  }

  /* a little rounded button the reader can press on the canvas: -> its rectangle */
  function pill(kit, c, x, y, w, h, text, o) {
    o = o || {};
    kit.esym.box(c, x, y, w, h, { label: text, size: o.size || 11.5, r: h / 2, active: !!o.active, color: o.color, dash: o.dash });
    return { x, y, w, h };
  }

  /* ================================================================ sm-delay-vs-machine */
  Hyper.sim('sm-delay-vs-machine', {
    title: 'The same button, two programs',
    blurb: `Both programs run the stair light: a press lights the lamp for five seconds. **A** waits with \`delay()\`; **B** is the state machine of the page. The strips show the last fourteen seconds: your presses, the lamp of A (the red line under its bars is the time A is deaf), and the lamp of B.

**Try this**
- Press once and wait: both programs do the same.
- Press again *while the lamp is lit*: A ignores the press (a red ✕); B gives five more seconds (a green ✓).
- *Three quick presses* shows how a burst fares.
- Watch the diagram of B: a PRESS in LIT leaves and re-enters LIT, which restarts its timer.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: isNarrow(box) ? 1.6 : 0.56, minH: 380, maxH: 660 });
      const LIT = 5, WIN = 14;
      const def = { start: 'DARK', states: { DARK: { entry: 'lamp off', on: { PRESS: 'LIT' } }, LIT: { entry: 'lamp on', on: { PRESS: 'LIT' }, after: { 5000: 'DARK' } } } };
      const B = bench(kit, def, { layout: { DARK: [0.1, 0.62], LIT: [0.9, 0.62] }, rw: 38 });
      let T = 0, untilA = -1, pending = [];
      const taps = [], segA = [], segB = [];
      const count = { made: 0, a: 0, b: 0 };
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'tap', label: 'Press the button', primary: true }, { id: 'burst', label: 'Three quick presses' }, { id: 'reset', label: 'Start again' }] }
      ], id => {
        if (id === 'tap') tap();
        else if (id === 'burst') { tap(); pending.push(T + 0.7, T + 1.4); }
        else if (id === 'reset') { T = 0; untilA = -1; pending = []; taps.length = 0; segA.length = 0; segB.length = 0; count.made = count.a = count.b = 0; B.m.reset(); B.idx = -1; B.t = 99; }
      });
      const ro = kit.readout(box.side, [['made', 'Presses made'], ['a', 'Seen by A (delay)'], ['b', 'Seen by B (machine)'], ['state', 'B is in state']]);
      function tap() {
        const rec = { t: T, a: false, b: true };
        if (T >= untilA) { untilA = T + LIT; rec.a = true; count.a++; }
        B.m.send('PRESS'); count.b++; count.made++;
        taps.push(rec);
      }
      function track(segs, on) {
        const s = segs[segs.length - 1];
        if (on) { if (s && s.open) s.t1 = T; else segs.push({ t0: T, t1: T, open: true }); } else if (s && s.open) s.open = false;
        while (segs.length && segs[0].t1 < T - WIN - 1) segs.shift();
      }
      const loop = kit.loop(dt => {
        T += dt;
        while (pending.length && pending[0] <= T) { pending.shift(); tap(); }
        B.m.tick(dt * 1000); B.t += dt;
        const litA = T < untilA, litB = B.m.state === 'LIT';
        track(segA, litA); track(segB, litB);
        while (taps.length && taps[0].t < T - WIN - 1) taps.shift();
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12;
        const wide = W >= 560, pw = wide ? (W - 3 * M) / 2 : W - 2 * M, ph = H * (wide ? 0.44 : 0.3);
        // program A: the code, with the line it is on
        const ax = M, ay = 8;
        S.box(c, ax, ay, pw, ph, { color: C.faint });
        kit.label(c, 'A · delay()', ax + 10, ay + 16, { size: 12.5, weight: 650 });
        S.led(c, ax + pw - 24, ay + 22, { color: 48, on: litA ? 1 : 0, r: 9 });
        const lines = ['if (button is down) {', '  lamp on;', '  delay(5000);', '  lamp off;', '}'];
        const hot = litA ? 2 : 0;
        lines.forEach((s, i) => {
          const ly = ay + 46 + i * Math.min(20, (ph - 60) / 5);
          if (i === hot) { c.fillStyle = litA ? (C.dark ? 'rgba(229,72,77,.30)' : 'rgba(229,72,77,.22)') : (C.dark ? 'rgba(34,179,122,.25)' : 'rgba(34,179,122,.18)'); c.fillRect(ax + 6, ly - 9, pw - 12, 18); }
          kit.label(c, s, ax + 14, ly, { size: 12, color: i === hot ? C.text : C.muted, font: 'Consolas, "Cascadia Code", monospace' });
        });
        kit.label(c, litA ? 'asleep in delay(): deaf' : 'looking at the button', ax + 10, ay + ph - 12, { size: 11, color: litA ? C.bad : C.ok, weight: 600 });
        // program B: the machine
        const bx = wide ? 2 * M + pw : M, by = wide ? ay : ay + ph + 10;
        S.box(c, bx, by, pw, ph, { color: C.faint });
        kit.label(c, 'B · state machine', bx + 10, by + 16, { size: 12.5, weight: 650 });
        S.led(c, bx + pw - 24, by + 22, { color: 48, on: litB ? 1 : 0, r: 9 });
        drawBench(kit, c, B, { x: bx + 6, y: by + 24, w: pw - 12, h: ph - 30 });
        // the strips
        const top = (wide ? ay + ph : by + ph) + 26, px = 64, sw = W - px - M, rowH = Math.max(20, Math.min(40, (H - top - 40) / 3.4));
        const X = t => px + clamp((t - (T - WIN)) / WIN, 0, 1) * sw;
        const rows = [['presses', 0], ['A · lamp', 1], ['B · lamp', 2]];
        rows.forEach(([name, i]) => {
          const y = top + i * (rowH + 8);
          c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(px, y, sw, rowH);
          kit.label(c, name, px - 6, y + rowH / 2, { size: 11, color: C.text2, align: 'right' });
        });
        const barRow = (segs, i, deaf) => {
          const y = top + i * (rowH + 8);
          for (const s of segs) {
            const x0 = X(s.t0), x1 = X(s.t1);
            c.fillStyle = kit.hue(48, 0.9); c.fillRect(x0, y + 3, Math.max(1, x1 - x0), rowH - 6);
            if (deaf) { c.fillStyle = C.bad; c.fillRect(x0, y + rowH - 4, Math.max(1, x1 - x0), 3); }
          }
        };
        barRow(segA, 1, true); barRow(segB, 2, false);
        for (const tp of taps) {
          const x = X(tp.t);
          for (let i = 0; i < 3; i++) {
            const y = top + i * (rowH + 8) + rowH / 2;
            if (i === 0) kit.dot(c, x, y, 4, C.text);
            else kit.label(c, (i === 1 ? tp.a : tp.b) ? '✓' : '✕', x, y, { size: 13, weight: 700, align: 'center', color: (i === 1 ? tp.a : tp.b) ? C.ok : C.bad });
          }
        }
        kit.label(c, '14 s ago', px, top + 3 * (rowH + 8) + 2, { size: 10, color: C.faint });
        kit.label(c, 'now', px + sw, top + 3 * (rowH + 8) + 2, { size: 10, color: C.faint, align: 'right' });
        ro.set('made', String(count.made)); ro.set('a', String(count.a) + (count.made > count.a ? '  (' + (count.made - count.a) + ' lost)' : '')); ro.set('b', String(count.b)); ro.set('state', B.m.state);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ sm-crossing */
  Hyper.sim('sm-crossing', {
    title: 'A pedestrian crossing',
    blurb: `The machine of the page, running. The lit box is the state; the arrow that has just fired flashes; the table lists the same machine row by row, with the row of the current state highlighted.

**Try this**
- Press the button in GREEN: BUTTON is accepted and the machine goes to AMBER.
- Press it again in AMBER and in RED: nothing happens, because those states do not list BUTTON. The readout shows the events the state listens to.
- Raise the clock speed to see the timeouts fire: 2 s in AMBER, 6 s in RED.
- Note the lamps: they are set by the *entry* of each state, nowhere else.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: isNarrow(box) ? 1.3 : 0.7, minH: 360, maxH: 560 });
      const def = { start: 'GREEN', states: {
        GREEN: { entry: 'cars go', on: { BUTTON: { to: 'AMBER', do: 'beep once' } } },
        AMBER: { entry: 'cars warned', after: { 2000: 'RED' } },
        RED: { entry: 'people walk', after: { 6000: 'GREEN' } } } };
      const B = bench(kit, def, { layout: { GREEN: [0.1, 0.62], AMBER: [0.5, 0.1], RED: [0.9, 0.62] }, rw: 40 });
      let lastEv = '—', blocked = 0;
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'press', label: 'Press the button', primary: true }, { id: 'reset', label: 'Reset' }] },
        { id: 'speed', label: 'Clock speed', min: 1, max: 8, step: 1, value: 1, unit: '×' },
        { id: 'run', type: 'check', label: 'Clock running', value: true }
      ], id => {
        if (id === 'press') { const ok = B.m.send('BUTTON'); lastEv = ok ? 'BUTTON: accepted in ' + B.last.from : 'BUTTON: ignored in ' + B.m.state; if (!ok) blocked++; }
        if (id === 'reset') { B.m.reset(); B.idx = -1; B.t = 99; lastEv = '—'; blocked = 0; }
      });
      const ro = kit.readout(box.side, [['state', 'State'], ['t', 'Time in this state'], ['listens', 'This state listens to'], ['last', 'Last event']]);
      const loop = kit.loop(dt => {
        if (ctl.values.run) B.m.tick(dt * 1000 * ctl.values.speed);
        B.t += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, s = B.m.state;
        const wide = W >= 560, dw = wide ? W * 0.6 : W - 2 * M, dh = H * (wide ? 0.6 : 0.36);
        drawBench(kit, c, B, { x: M, y: M, w: dw - M, h: dh - M });
        const lampOn = (name, on) => (name === on ? 1 : 0.06);
        const aft = Object.keys(def.states[s].after || {}).map(Number)[0];
        const progress = (x, y, w) => {
          if (aft) { const f = clamp(B.m.inState() / aft, 0, 1); c.fillStyle = C.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.07)'; c.fillRect(x, y, w, 7); c.fillStyle = C.accent; c.fillRect(x, y, w * f, 7); kit.label(c, 'time-out in ' + fmtS(Math.max(0, aft - B.m.inState())), x + w / 2, y + 18, { size: 10.5, color: C.muted, align: 'center' }); }
          else kit.label(c, 'no timeout: waits for BUTTON', x + w / 2, y + 8, { size: 10.5, color: C.muted, align: 'center' });
        };
        if (wide) {
          // the lamps, as a traffic light beside the diagram
          const lx = W * 0.6 + (W * 0.4) / 2, ly = 38, step = 30;
          S.box(c, lx - 70, ly - 22, 140, step * 3 + 14, { color: C.faint, r: 10 });
          S.led(c, lx - 34, ly, { color: 0, on: lampOn('RED', s), r: 11 });
          S.led(c, lx - 34, ly + step, { color: 44, on: lampOn('AMBER', s), r: 11 });
          S.led(c, lx - 34, ly + 2 * step, { color: 130, on: lampOn('GREEN', s), r: 11 });
          kit.label(c, 'cars', lx - 34, ly + 3 * step - 6, { size: 10.5, color: C.muted, align: 'center' });
          S.led(c, lx + 34, ly, { color: 0, on: s === 'RED' ? 0.06 : 1, r: 9 });
          S.led(c, lx + 34, ly + step, { color: 130, on: s === 'RED' ? 1 : 0.06, r: 9 });
          kit.label(c, s === 'RED' ? 'WALK' : 'WAIT', lx + 34, ly + 2 * step - 4, { size: 11, weight: 650, color: s === 'RED' ? C.ok : C.bad, align: 'center' });
          kit.label(c, 'people', lx + 34, ly + 3 * step - 6, { size: 10.5, color: C.muted, align: 'center' });
          progress(lx - 70, ly + 3 * step + 14, 140);
          const ty = dh + 14;
          drawTable(kit, c, M, ty, W * 0.44, B.dia, s, B.t < 1.6 ? B.idx : -1);
          drawLog(kit, c, W * 0.5, ty, W * 0.5 - M, B.m, Math.max(3, Math.floor((H - ty - 24) / 15)));
        } else {
          // phone width: a row of lamps, the progress bar and the log under the diagram
          const ly = dh + 36;
          S.box(c, M, ly - 28, W - 2 * M, 62, { color: C.faint, r: 10 });
          const x0 = W * 0.16;
          S.led(c, x0, ly - 4, { color: 0, on: lampOn('RED', s), r: 10 });
          S.led(c, x0 + 34, ly - 4, { color: 44, on: lampOn('AMBER', s), r: 10 });
          S.led(c, x0 + 68, ly - 4, { color: 130, on: lampOn('GREEN', s), r: 10 });
          kit.label(c, 'cars', x0 + 34, ly + 22, { size: 10.5, color: C.muted, align: 'center' });
          const x1 = W * 0.62;
          S.led(c, x1, ly - 4, { color: 0, on: s === 'RED' ? 0.06 : 1, r: 9 });
          S.led(c, x1 + 30, ly - 4, { color: 130, on: s === 'RED' ? 1 : 0.06, r: 9 });
          kit.label(c, s === 'RED' ? 'WALK' : 'WAIT', x1 + 65, ly - 4, { size: 11, weight: 650, color: s === 'RED' ? C.ok : C.bad });
          kit.label(c, 'people', x1 + 15, ly + 22, { size: 10.5, color: C.muted, align: 'center' });
          progress(M + 20, ly + 44, W - 2 * M - 40);
          drawLog(kit, c, M, ly + 80, W - 2 * M, B.m, Math.max(2, Math.floor((H - ly - 100) / 15)));
        }
        ro.set('state', s); ro.set('t', fmtS(B.m.inState())); ro.set('listens', B.m.events().join(', ') || 'only the clock'); ro.set('last', lastEv);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ sm-diagram-check */
  Hyper.sim('sm-diagram-check', {
    title: 'Draw, then check',
    blurb: `The push-button machine: RELEASED, PRESSED, and HELD after a second. Break the drawing in three ways and read what the checker says; then run the broken machine to see what the flaw does.

**Try this**
- Tick **no arrow out of HELD**: the checker reports a dead end. Press DOWN, wait a second, press UP: the machine stays in HELD for ever.
- Tick **misspelt target**: an arrow now points at a state that does not exist (drawn dashed). Press DOWN then UP: the machine ignores the release and stays in PRESSED.
- Tick **a state nothing leads to**: DOUBLE can never be reached.
- Untick everything: no problems, and the machine does what the page describes.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 380, maxH: 560 });
      const flags = { trap: false, typo: false, orphan: false };
      let B = make();
      function make() {
        const d = { start: 'RELEASED', states: {
          RELEASED: { on: { DOWN: 'PRESSED' } },
          PRESSED: { on: { UP: { to: flags.typo ? 'RELEASD' : 'RELEASED', do: 'click' } }, after: { 1000: 'HELD' } },
          HELD: { entry: 'long press', on: flags.trap ? {} : { UP: 'RELEASED' } } } };
        if (flags.orphan) d.states.DOUBLE = { on: { DOWN: 'PRESSED' } };
        const b = bench(kit, d, { layout: { RELEASED: [0.1, 0.55], PRESSED: [0.5, 0.12], HELD: [0.9, 0.55], DOUBLE: [0.1, 0.95] }, bends: { 'PRESSED>RELEASED': 24 }, rw: 40 });
        if (flags.typo) b.dia.states.push({ id: 'RELEASD', label: 'RELEASD', x: 0.9, y: 0.95 });
        return b;
      }
      let lastEv = '—';
      const ctl = kit.controls(box.side, [
        { id: 'trap', type: 'check', label: 'No arrow out of HELD', value: false },
        { id: 'typo', type: 'check', label: 'A misspelt target (RELEASD)', value: false },
        { id: 'orphan', type: 'check', label: 'A state nothing leads to (DOUBLE)', value: false },
        { type: 'buttons', items: [{ id: 'down', label: 'DOWN (press)', primary: true }, { id: 'up', label: 'UP (release)' }, { id: 'reset', label: 'Reset' }] }
      ], (id, v) => {
        if (id === 'trap' || id === 'typo' || id === 'orphan') { flags[id] = !!v; B = make(); lastEv = '—'; return; }
        if (id === 'reset') { B.m.reset(); B.idx = -1; B.t = 99; lastEv = '—'; return; }
        const ev = id === 'down' ? 'DOWN' : 'UP', before = B.m.state, ok = B.m.send(ev);
        const err = B.m.log.length && B.m.log[B.m.log.length - 1].error;
        lastEv = ev + ': ' + (ok ? before + ' → ' + B.m.state : err ? 'the arrow leads nowhere' : 'ignored in ' + before);
      });
      const ro = kit.readout(box.side, [['state', 'State'], ['problems', 'Problems found'], ['last', 'Last event']]);
      const loop = kit.loop(dt => {
        B.m.tick(dt * 1000); B.t += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10;
        const dh = H * 0.66;
        drawBench(kit, c, B, { x: M, y: M, w: W - 2 * M, h: dh - M });
        const probs = E.fsmCheck(B.def);
        kit.label(c, 'what the checker says', M, dh + 14, { size: 11, color: C.faint, weight: 600 });
        if (!probs.length) kit.label(c, '✓  no problems found', M, dh + 36, { size: 12.5, color: C.ok, weight: 650 });
        probs.slice(0, 5).forEach((p, i) => kit.label(c, '✗  ' + p, M, dh + 36 + i * 18, { size: 12, color: C.bad }));
        ro.set('state', B.m.state); ro.set('problems', String(probs.length)); ro.set('last', lastEv);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ sm-code-layouts */
  // the lines of each layout, and which of them a PRESS in each state runs (dispatch) and which of them is the entry of the next state
  const LAYOUTS = {
    switch: {
      name: 'Switch on an enum',
      code: [
        'void handle(Event ev) {',
        '  switch (state) {',
        '    case OFF:',
        '      if (ev == PRESS) goTo(SLOW);',
        '      break;',
        '    case SLOW:',
        '      if (ev == PRESS) goTo(FAST);',
        '      break;',
        '    case FAST:',
        '      if (ev == PRESS) goTo(OFF);',
        '      break;',
        '  }',
        '}'
      ],
      run: { OFF: [0, 1, 2, 3], SLOW: [0, 1, 5, 6], FAST: [0, 1, 8, 9] },
      enter: {},
      add: 'a new case in handle(), and in every other switch that mentions the states'
    },
    table: {
      name: 'Transition table',
      code: [
        'const Row TABLE[] = {',
        '  { OFF,  PRESS, SLOW },',
        '  { SLOW, PRESS, FAST },',
        '  { FAST, PRESS, OFF  },',
        '};',
        '',
        'void handle(Event ev) {',
        '  for (const Row &r : TABLE)',
        '    if (r.from == state && r.ev == ev) {',
        '      goTo(r.to); return;',
        '    }',
        '}'
      ],
      run: { OFF: [1, 6, 7, 8, 9], SLOW: [2, 6, 7, 8, 9], FAST: [3, 6, 7, 8, 9] },
      enter: {},
      add: 'one new row (and its blink period)'
    },
    funcs: {
      name: 'One function per state',
      code: [
        'void stateOff(Event ev) {',
        '  if (ev == ENTER) setLed(false);',
        '  if (ev == PRESS) goTo(stateSlow);',
        '}',
        'void stateSlow(Event ev) {',
        '  if (ev == ENTER) period = 500;',
        '  if (ev == TICK)  blink();',
        '  if (ev == PRESS) goTo(stateFast);',
        '}',
        'void stateFast(Event ev) {',
        '  if (ev == ENTER) period = 120;',
        '  if (ev == TICK)  blink();',
        '  if (ev == PRESS) goTo(stateOff);',
        '}'
      ],
      run: { OFF: [0, 2], SLOW: [4, 7], FAST: [9, 12] },
      enter: { SLOW: [5], FAST: [10], OFF: [1] },
      add: 'one new function, and one changed line in the state before it'
    }
  };
  const BLINK = { OFF: 0, SLOW: 500, FAST: 120 };

  Hyper.sim('sm-code-layouts', {
    title: 'One machine, three layouts',
    blurb: `The mode selector — OFF, SLOW, FAST, stepped by one button — written three ways. Press the button and watch which **lines of code** the press runs: blue for the dispatch, green for the entry of the new state.

**Try this**
- In the *switch*, every press walks through the switch and one case; note how the states are named in many lines.
- In the *table*, the same five lines of search run whatever the row: only the row changes.
- In *one function per state*, the press runs inside the function of the current state, and the entry of the next state runs in its own function.
- Read **To add a state you…**: that is how each layout scales.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: isNarrow(box) ? 1.5 : 0.62, minH: 420, maxH: 620 });
      const def = { start: 'OFF', states: { OFF: { entry: 'LED off', on: { PRESS: 'SLOW' } }, SLOW: { entry: 'blink 500 ms', on: { PRESS: 'FAST' } }, FAST: { entry: 'blink 120 ms', on: { PRESS: 'OFF' } } } };
      const B = bench(kit, def, { layout: { OFF: [0.12, 0.8], SLOW: [0.5, 0.12], FAST: [0.88, 0.8] }, rw: 38 });
      let layout = 'switch', T = 0, dispatched = null, flash = 9;
      const ctl = kit.controls(box.side, [
        { id: 'layout', type: 'select', label: 'Layout', options: [['Switch on an enum', 'switch'], ['Transition table', 'table'], ['One function per state', 'funcs']], value: 'switch' },
        { type: 'buttons', items: [{ id: 'press', label: 'PRESS', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], (id, v) => {
        if (id === 'layout') { layout = v; dispatched = null; }
        if (id === 'press') { const from = B.m.state; B.m.send('PRESS'); dispatched = { from, to: B.m.state }; flash = 0; }
        if (id === 'reset') { B.m.reset(); B.idx = -1; B.t = 99; dispatched = null; }
      });
      const ro = kit.readout(box.side, [['state', 'State'], ['lines', 'Lines run by the last PRESS'], ['add', 'To add a state you need']]);
      const loop = kit.loop(dt => {
        T += dt; flash += dt; B.t += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, wide = W >= 560, L = LAYOUTS[layout];
        const dw = wide ? W * 0.42 - M : W - 2 * M, dh = wide ? H * 0.64 : H * 0.3;
        drawBench(kit, c, B, { x: M, y: M, w: dw, h: dh });
        // the LED, blinking at the period of the state
        const s = B.m.state, per = BLINK[s], on = per ? Math.floor(T * 1000 / per) % 2 === 0 : false;
        const lx = wide ? M + dw / 2 - 40 : M + 18, ly = wide ? dh + 46 : dh + 30;
        S.led(c, lx, ly, { color: 130, on: on ? 1 : 0, r: 11 });
        kit.label(c, per ? 'blinks every ' + per + ' ms' : 'off', lx + 22, ly, { size: 11, color: C.muted });
        // the code
        const cx = wide ? W * 0.46 : M, cy = wide ? M : dh + 62, cw = wide ? W * 0.54 - M : W - 2 * M, lh = 16;
        S.box(c, cx, cy, cw, Math.min(H - cy - M, 44 + L.code.length * lh), { color: C.faint, r: 8 });
        kit.label(c, L.name, cx + 12, cy + 18, { size: 12.5, weight: 650 });
        const alpha = clamp(1 - flash / 2.4, 0, 1), runs = dispatched ? (L.run[dispatched.from] || []) : [], ents = dispatched ? (L.enter[dispatched.to] || []) : [];
        L.code.forEach((line, i) => {
          const y = cy + 40 + i * lh;
          if (alpha > 0 && runs.includes(i)) { c.fillStyle = C.dark ? 'rgba(123,140,255,' + 0.35 * alpha + ')' : 'rgba(60,90,220,' + 0.25 * alpha + ')'; c.fillRect(cx + 6, y - lh / 2, cw - 12, lh); }
          if (alpha > 0 && ents.includes(i)) { c.fillStyle = C.dark ? 'rgba(34,179,122,' + 0.4 * alpha + ')' : 'rgba(34,179,122,' + 0.3 * alpha + ')'; c.fillRect(cx + 6, y - lh / 2, cw - 12, lh); }
          kit.label(c, line, cx + 12, y, { size: 11, color: C.text, font: 'Consolas, "Cascadia Code", monospace' });
        });
        const n = runs.length + ents.length;
        ro.set('state', s); ro.set('lines', dispatched ? n + ' of ' + L.code.length + ' lines' : '—'); ro.set('add', L.add);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ sm-pump */
  Hyper.sim('sm-pump', {
    title: 'A pump on a tank',
    blurb: `A tank is used up at the rate you set and refilled by the pump. The low float starts the pump (TANK_LOW); the full float stops it (TANK_FULL); the pump may run 20 s at most, then rests 10 s. The clock can run up to twenty times faster than real time.

**Try this**
- Leave it running: the tank falls to the low mark, the pump fills it, and the machine returns to IDLE.
- Raise **Water use** so the pump cannot keep up: PUMPING times out and the machine rests.
- Tick **The well is dry**: the pump delivers nothing and times out again and again. In the *fault* version the third failure latches FAULT until you press *Reset the fault*.
- Watch the time-out bar: leaving PUMPING early throws the timer away.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const fault = !!(params && params.mode === 'fault');
      const st = kit.stage(box.stage, { aspect: isNarrow(box) ? 1.5 : 0.7, minH: 420, maxH: 640 });
      const LOW = 25, FULL = 90, FLOW = 5;
      const defTimed = { start: 'IDLE', states: {
        IDLE: { entry: 'pump off', on: { TANK_LOW: 'PUMPING' } },
        PUMPING: { entry: 'pump on', on: { TANK_FULL: 'IDLE' }, after: { 20000: 'RESTING' } },
        RESTING: { entry: 'pump off', after: { 10000: 'IDLE' } } } };
      const defFault = { start: 'IDLE', states: {
        IDLE: { entry: 'pump off', on: { TANK_LOW: 'PUMPING' } },
        PUMPING: { entry: 'pump on', on: { TANK_FULL: { to: 'IDLE', do: 'failures = 0' }, 'after 20 s': [{ to: 'FAULT', if: 'third', do: 'count the failure' }, { to: 'RESTING', do: 'count the failure' }] } },
        RESTING: { entry: 'pump off', after: { 10000: 'IDLE' } },
        FAULT: { entry: 'alarm on', exit: 'alarm off', on: { FAULT_RESET: { to: 'IDLE', do: 'failures = 0' } } } } };
      const ctx0 = { failures: 0 };
      const B = bench(kit, fault ? defFault : defTimed, {
        layout: fault ? { IDLE: [0.1, 0.5], PUMPING: [0.45, 0.5], RESTING: [0.85, 0.12], FAULT: [0.85, 0.88] } : { IDLE: [0.1, 0.5], PUMPING: [0.45, 0.5], RESTING: [0.85, 0.5] },
        bends: fault ? { 'RESTING>IDLE': 40, 'FAULT>IDLE': -40 } : { 'RESTING>IDLE': -55 },
        guards: { third: c => c.failures >= 2 }, ctx: ctx0, rw: 40,
        onChange(from, to, why, actions) { for (const a of actions) { if (a === 'count the failure') ctx0.failures++; if (a === 'failures = 0') ctx0.failures = 0; } }
      });
      let level = 55, pumped = 0, lastEv = '—';
      const ctl = kit.controls(box.side, [
        { id: 'use', label: 'Water use', min: 0, max: 4.5, step: 0.1, value: 0.6, unit: '% of the tank per s' },
        { id: 'dry', type: 'check', label: 'The well is dry', value: false },
        { id: 'speed', label: 'Clock speed', min: 1, max: 20, step: 1, value: 4, unit: '×' },
        { type: 'buttons', items: [{ id: 'reset', label: fault ? 'Reset the fault' : 'Start again', primary: fault }, { id: 'fill', label: 'Refill the tank' }] }
      ], id => {
        if (id === 'fill') level = 100;
        if (id === 'reset') {
          if (fault && B.m.state === 'FAULT') B.m.send('FAULT_RESET');
          else if (!fault) { B.m.reset(); B.idx = -1; B.t = 99; level = 55; pumped = 0; }
        }
      });
      const ro = kit.readout(box.side, [['state', 'State'], ['t', 'Time in this state'], ['level', 'Water level'], [fault ? 'fail' : 'run', fault ? 'Failed runs in a row' : 'Pump has run in total']]);
      function step(h) {
        const pumping = B.m.state === 'PUMPING';
        level = clamp(level + ((pumping && !ctl.values.dry ? FLOW : 0) - ctl.values.use) * h, 0, 100);
        if (pumping) pumped += h;
        if (level < LOW) B.m.send('TANK_LOW');                   // the floats send their level on every pass
        if (level >= FULL) B.m.send('TANK_FULL');
        if (fault && B.m.state === 'PUMPING' && B.m.inState() >= 20000) B.m.send('after 20 s');
        B.m.tick(h * 1000);
      }
      const loop = kit.loop(dt => {
        const sdt = dt * ctl.values.speed, n = Math.max(1, Math.ceil(sdt / 0.25));
        for (let i = 0; i < n; i++) step(sdt / n);
        B.t += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, wide = W >= 560, s = B.m.state;
        const dw = wide ? W * 0.56 - M : W - 2 * M, dh = wide ? H * 0.62 : H * 0.34;
        drawBench(kit, c, B, { x: M, y: M, w: dw, h: dh });
        // the tank
        const sx = wide ? W * 0.6 : M, sy = wide ? M : dh + 18, sw = wide ? W * 0.4 - M : W - 2 * M, sh = wide ? H * 0.62 : H * 0.3;
        const tw = Math.min(90, sw * 0.3), tx = sx + sw * 0.5, ty = sy + 16, th = sh - 50;
        c.fillStyle = kit.hue(205, 0.55); c.fillRect(tx + 1, ty + th * (1 - level / 100), tw - 2, th * level / 100);
        c.strokeStyle = C.text2; c.lineWidth = 2; c.strokeRect(tx, ty, tw, th);
        const yLow = ty + th * (1 - LOW / 100), yFull = ty + th * (1 - FULL / 100);
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([4, 3]);
        c.beginPath(); c.moveTo(tx - 6, yLow); c.lineTo(tx + tw, yLow); c.moveTo(tx - 6, yFull); c.lineTo(tx + tw, yFull); c.stroke(); c.restore();
        S.led(c, tx - 14, yLow, { color: 130, on: level < LOW ? 1 : 0, r: 5 });
        S.led(c, tx - 14, yFull, { color: 130, on: level >= FULL ? 1 : 0, r: 5 });
        kit.label(c, 'low', tx - 24, yLow, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, 'full', tx - 24, yFull, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, Math.round(level) + ' %', tx + tw / 2, ty - 6, { size: 11.5, weight: 650, align: 'center' });
        const px = sx + sw * 0.14, py = ty + th - 6, pumping = s === 'PUMPING';
        S.wire(c, [[px + 16, py], [tx + tw * 0.5, py], [tx + tw * 0.5, ty + th]], { color: pumping && !ctl.values.dry ? C.accent : C.faint });
        S.motor(c, px, py, 13, pumping ? (loop.t || 0) * 9 : 0, { color: pumping ? C.accent : C.faint });
        kit.label(c, 'pump', px, py + 26, { size: 10.5, color: C.muted, align: 'center' });
        if (ctl.values.dry) kit.label(c, 'DRY WELL', px, py - 24, { size: 10.5, weight: 650, color: C.bad, align: 'center' });
        kit.arrow(c, tx + tw + 2, ty + th * 0.75, tx + tw + 30, ty + th * 0.75, ctl.values.use > 0 ? C.warn : C.faint, 2);
        kit.label(c, 'use', tx + tw + 16, ty + th * 0.75 - 12, { size: 10.5, color: C.muted, align: 'center' });
        // the time-out bar of the state
        const aft = fault && s === 'PUMPING' ? 20000 : Object.keys(B.def.states[s].after || {}).map(Number)[0];
        const by = sy + sh - 14, bw = Math.min(sw - 10, 170);
        if (aft) { const f = clamp(B.m.inState() / aft, 0, 1); c.fillStyle = C.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.07)'; c.fillRect(sx + 4, by, bw, 7); c.fillStyle = f > 0.8 ? C.warn : C.accent; c.fillRect(sx + 4, by, bw * f, 7); kit.label(c, 'time-out in ' + fmtS(Math.max(0, aft - B.m.inState())), sx + 4, by + 17, { size: 10.5, color: C.muted }); }
        else kit.label(c, s === 'FAULT' ? 'latched: waits for a reset' : 'no timeout: waits for a float', sx + 4, by + 7, { size: 10.5, color: C.muted });
        const ly = wide ? dh + 28 : sy + sh + 24;
        drawLog(kit, c, M, ly, W - 2 * M, B.m, Math.max(3, Math.floor((H - ly - 14) / 15)));
        ro.set('state', s); ro.set('t', fmtS(B.m.inState())); ro.set('level', Math.round(level) + ' %');
        if (fault) ro.set('fail', ctx0.failures + ' of 3'); else ro.set('run', fmtS(pumped * 1000));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ sm-door-lock */
  Hyper.sim('sm-door-lock', {
    title: 'A door lock with a lockout',
    blurb: `Enter codes at the keypad. A right code retracts the bolt; the door relocks when it has been opened and closed, or after eight seconds. Three wrong codes lock the keypad for thirty seconds. Under the diagram, *what the last transition ran* shows the order: exit of the old state, the arrow, entry of the new one.

**Try this**
- Enter the right code, then wait: the **exit** of UNLOCKED puts the bolt out by timeout. Do it again with *Open and close the door*: the same exit runs.
- Enter a wrong code three times: the third trips the guard and goes to LOCKOUT.
- Tick **bug** and enter wrong codes: LOCKED goes to LOCKED, its entry resets the counter, and the lockout never comes.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: isNarrow(box) ? 1.5 : 0.72, minH: 420, maxH: 640 });
      const def = { start: 'LOCKED', states: {
        LOCKED: { entry: 'show LOCKED', on: { CODE_OK: { to: 'UNLOCKED', do: 'tries = 0' }, CODE_BAD: [{ to: 'LOCKOUT', if: 'thirdBad' }, { to: 'LOCKED', do: 'count the wrong try' }] } },
        UNLOCKED: { entry: 'bolt retracted', exit: 'bolt out', on: { DOOR_CLOSED: 'LOCKED' }, after: { 8000: 'LOCKED' } },
        LOCKOUT: { entry: 'buzzer on', exit: 'buzzer off, tries = 0', after: { 30000: 'LOCKED' } } } };
      const ctx0 = { tries: 0 };
      const B = bench(kit, def, {
        layout: { LOCKED: [0.12, 0.3], UNLOCKED: [0.88, 0.3], LOCKOUT: [0.5, 0.9] },
        bends: { 'UNLOCKED>LOCKED': [22, 54], 'LOCKED>UNLOCKED': 22 }, rw: 44,
        guards: { thirdBad: c => c.tries >= 2 }, ctx: ctx0,
        onChange(from, to, why, actions) { for (const a of actions) { if (a === 'count the wrong try') ctx0.tries++; if (/tries = 0|reset tries/.test(a)) ctx0.tries = 0; } }
      });
      let bolt = 1, lastEv = '—', bug = false;
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'ok', label: 'Enter the right code', primary: true }, { id: 'bad', label: 'Enter a wrong code' }, { id: 'door', label: 'Open and close the door' }, { id: 'reset', label: 'Reset' }] },
        { id: 'bug', type: 'check', label: 'Bug: the entry of LOCKED resets the tries', value: false },
        { id: 'speed', label: 'Clock speed', min: 1, max: 10, step: 1, value: 2, unit: '×' }
      ], (id, v) => {
        if (id === 'bug') {
          bug = !!v; def.states.LOCKED.entry = bug ? 'reset tries' : 'show LOCKED';
          const ds = B.dia.states.find(x => x.id === 'LOCKED'); if (ds) ds.note = def.states.LOCKED.entry;
          return;
        }
        if (id === 'reset') { B.m.reset(); ctx0.tries = 0; B.idx = -1; B.t = 99; lastEv = '—'; return; }
        const ev = { ok: 'CODE_OK', bad: 'CODE_BAD', door: 'DOOR_CLOSED' }[id], before = B.m.state;
        if (!ev) return;
        const ok = B.m.send(ev);
        lastEv = ev + ': ' + (ok ? before + ' → ' + B.m.state : 'ignored in ' + before);
      });
      const ro = kit.readout(box.side, [['state', 'State'], ['tries', 'Wrong tries so far'], ['t', 'Time in this state'], ['last', 'Last event']]);
      const loop = kit.loop(dt => {
        B.m.tick(dt * 1000 * ctl.values.speed); B.t += dt;
        const target = B.m.state === 'UNLOCKED' ? 0 : 1;
        bolt += (target - bolt) * Math.min(1, dt * 8);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, wide = W >= 560, s = B.m.state;
        const dw = wide ? W * 0.62 - M : W - 2 * M, dh = wide ? H * 0.58 : H * 0.34;
        drawBench(kit, c, B, { x: M, y: M, w: dw, h: dh });
        // the door, the bolt, the keypad lamps and the buzzer
        const sx = wide ? W * 0.64 : M, sy = wide ? M : dh + 18, sw = wide ? W * 0.36 - M : W - 2 * M, sh = wide ? H * 0.58 : H * 0.27;
        const dx = sx + sw * 0.18, dy = sy + 8, dwid = Math.min(70, sw * 0.28), dhei = sh - 40;
        c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(dx, dy, dwid, dhei);
        c.strokeStyle = C.text2; c.lineWidth = 2; c.strokeRect(dx, dy, dwid, dhei);
        c.fillStyle = bolt > 0.5 ? C.bad : C.ok; c.fillRect(dx + dwid - 3 - bolt * 12, dy + dhei * 0.45, 6 + bolt * 12, 8);
        kit.label(c, bolt > 0.5 ? 'bolt out' : 'bolt retracted', dx + dwid / 2, dy + dhei + 14, { size: 10.5, color: bolt > 0.5 ? C.bad : C.ok, align: 'center', weight: 650 });
        const kx = dx + dwid + 34;
        kit.label(c, 'keypad', kx + 24, dy + 12, { size: 10.5, color: C.muted, align: 'center' });
        for (let i = 0; i < 3; i++) S.led(c, kx + i * 24, dy + 34, { color: 0, on: i < ctx0.tries ? 1 : 0.05, r: 7 });
        kit.label(c, 'wrong tries', kx + 24, dy + 54, { size: 10, color: C.muted, align: 'center' });
        S.buzzer(c, kx + 24, dy + 90, s === 'LOCKOUT', { phase: (loop.t || 0) * 3, r: 11 });
        kit.label(c, 'buzzer', kx + 24, dy + 118, { size: 10, color: C.muted, align: 'center' });
        // what the last transition ran, in order
        const ay = wide ? dh + 22 : sy + sh + 20;
        kit.label(c, 'what the last transition ran, in order', M, ay, { size: 10.5, color: C.faint, weight: 600 });
        const L = B.last;
        if (!L) kit.label(c, 'nothing yet', M, ay + 17, { size: 11, color: C.faint });
        else {
          const S0 = def.states[L.from], S1 = def.states[L.to];
          const items = L.actions.map(a => (a === S0.exit ? 'exit of ' + L.from : a === S1.entry ? 'entry of ' + L.to : 'on the arrow') + ':  ' + a);
          if (!items.length) items.push('(no actions)');
          items.forEach((t, i) => kit.label(c, (i + 1) + '.  ' + t, M, ay + 17 + i * 15, { size: 11, color: C.text }));
        }
        const lx = wide ? W * 0.5 : M, ly = wide ? ay : ay + 70;
        drawLog(kit, c, lx, ly, W - lx - M, B.m, Math.max(2, Math.floor((H - ly - 14) / 15)));
        ro.set('state', s); ro.set('tries', String(ctx0.tries)); ro.set('t', fmtS(B.m.inState())); ro.set('last', lastEv);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ sm-event-queue */
  Hyper.sim('sm-event-queue', {
    title: 'A queue in front of the vent',
    blurb: `Commands go into a ring buffer; the machine takes one every so often. The vent takes two seconds to move, so commands often arrive while it is moving. The ring shows the queue: **read** is where the next command comes out, **write** where the next goes in.

**Try this**
- With *Handle at once*, press **Open** and then, while the vent is opening, **Close**: the machine takes the Close while OPENING, which does not list it, and it is *lost*.
- Switch to *Wait while the motor turns* and repeat: the Close waits in the queue and is carried out once the vent is OPEN.
- Press **Five commands in a burst** with a small queue: the ring fills up and the extra commands are *dropped*.
- Slow the machine down and see the queue grow.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { aspect: narrow ? 1.6 : 0.68, minH: 460, maxH: 680 });
      const def = { start: 'CLOSED', states: {
        CLOSED: { entry: 'motor off', on: { OPEN_CMD: 'OPENING' } },
        OPENING: { entry: 'motor opens', after: { 2000: 'OPEN' } },
        OPEN: { entry: 'motor off', on: { CLOSE_CMD: 'CLOSING' } },
        CLOSING: { entry: 'motor closes', after: { 2000: 'CLOSED' } } } };
      const B = bench(kit, def, { layout: { CLOSED: [0.12, 0.85], OPENING: [0.12, 0.15], OPEN: [0.88, 0.15], CLOSING: [0.88, 0.85] }, rw: 40 });
      const MAXN = 8;
      let ring = new Array(MAXN).fill(null), head = 0, tail = 0, size = 8, acc = 0, flashDrop = 0, T = 0, lastEv = '—';
      const stat = { handled: 0, lost: 0, already: 0, dropped: 0 };
      const count = () => (tail - head + size) % size;
      const push = ev => { const next = (tail + 1) % size; if (next === head) { stat.dropped++; flashDrop = 1; return; } ring[tail] = ev; tail = next; };
      const clear = () => { ring = new Array(MAXN).fill(null); head = tail = 0; };
      const ctl = kit.controls(box.side, [
        { id: 'policy', type: 'select', label: 'The machine…', options: [['Handles at once, whatever the state', 'drop'], ['Waits while the motor turns', 'defer']], value: 'drop' },
        { id: 'size', label: 'Queue size', min: 3, max: 8, step: 1, value: 8, unit: 'slots' },
        { id: 'pace', label: 'Machine takes an event every', min: 0.1, max: 1.5, step: 0.1, value: 0.4, unit: 's' },
        { type: 'buttons', items: [{ id: 'open', label: 'Open', primary: true }, { id: 'close', label: 'Close' }, { id: 'burst', label: 'Five commands in a burst' }, { id: 'reset', label: 'Start again' }] }
      ], (id, v) => {
        if (id === 'size') { size = Math.round(v); clear(); }
        if (id === 'open') push('OPEN_CMD');
        if (id === 'close') push('CLOSE_CMD');
        if (id === 'burst') ['OPEN_CMD', 'CLOSE_CMD', 'OPEN_CMD', 'CLOSE_CMD', 'OPEN_CMD'].forEach(push);
        if (id === 'reset') { clear(); B.m.reset(); B.idx = -1; B.t = 99; stat.handled = stat.lost = stat.already = stat.dropped = 0; lastEv = '—'; }
      });
      const ro = kit.readout(box.side, [['q', 'In the queue'], ['state', 'Vent state'], ['handled', 'Commands carried out'], ['lost', 'Lost while the motor turned'], ['already', 'Already in position'], ['dropped', 'Dropped: queue full']]);
      function take() {
        if (head === tail) return;
        const s = B.m.state, settled = s === 'CLOSED' || s === 'OPEN';
        if (ctl.values.policy === 'defer' && !settled) return;
        const ev = ring[head]; ring[head] = null; head = (head + 1) % size;
        const ok = B.m.send(ev);
        if (ok) { stat.handled++; lastEv = ev + ': carried out'; } else if (settled) { stat.already++; lastEv = ev + ': already there'; } else { stat.lost++; lastEv = ev + ': lost, the vent was moving'; }
      }
      const loop = kit.loop(dt => {
        T += dt; B.t += dt; flashDrop = Math.max(0, flashDrop - dt * 2);
        B.m.tick(dt * 1000);
        acc += dt; if (acc >= ctl.values.pace) { acc = 0; take(); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, s = B.m.state;
        // zones: the ring, the diagram, the vent
        const rz = narrow ? { x: M, y: M, w: W * 0.55 - M, h: H * 0.3 } : { x: M, y: M, w: W * 0.3, h: H * 0.62 };
        const dz = narrow ? { x: M, y: H * 0.3 + 16, w: W - 2 * M, h: H * 0.32 } : { x: W * 0.33, y: M, w: W * 0.45, h: H * 0.62 };
        const vz = narrow ? { x: W * 0.6, y: M, w: W * 0.4 - M, h: H * 0.3 } : { x: W * 0.8, y: M, w: W * 0.2 - M, h: H * 0.62 };
        // the ring
        const cx = rz.x + rz.w / 2, cy = rz.y + rz.h / 2 + 4, R = Math.max(30, Math.min(rz.w, rz.h) / 2 - 30), sz = clamp(2 * Math.PI * R / size * 0.62, 16, 28);
        kit.label(c, 'the queue', cx, rz.y + 6, { size: 11, color: C.faint, weight: 600, align: 'center' });
        const cnt = count();
        for (let i = 0; i < size; i++) {
          const a = -Math.PI / 2 + i * 2 * Math.PI / size, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a), occupied = ring[i] != null && ((i - head + size) % size) < cnt;
          const ev = occupied ? ring[i] : null;
          S.box(c, x - sz / 2, y - sz / 2, sz, sz, { label: ev ? (ev === 'OPEN_CMD' ? 'O' : 'C') : null, size: 11, r: 6, dash: !ev, color: ev ? (ev === 'OPEN_CMD' ? C.ok : C.warn) : C.faint, active: !!ev });
        }
        const mark = (idx, text, dr) => { const a = -Math.PI / 2 + idx * 2 * Math.PI / size; kit.label(c, text, cx + (R + sz / 2 + dr) * Math.cos(a), cy + (R + sz / 2 + dr) * Math.sin(a), { size: 10, color: C.accent, weight: 650, align: 'center' }); };
        if (head === tail) mark(head, 'read·write', 17); else { mark(head, 'read', 13); mark(tail, 'write', 13); }
        kit.label(c, cnt + ' of ' + (size - 1), cx, cy - 6, { size: 14, weight: 700, align: 'center', color: flashDrop > 0.05 ? C.bad : C.text });
        kit.label(c, flashDrop > 0.05 ? 'FULL: dropped' : 'in the queue', cx, cy + 12, { size: 10, align: 'center', color: flashDrop > 0.05 ? C.bad : C.muted });
        // the diagram
        drawBench(kit, c, B, { x: dz.x, y: dz.y, w: dz.w, h: dz.h });
        // the vent: a sash opening on its hinge
        const frac = s === 'OPEN' ? 1 : s === 'OPENING' ? B.m.inState() / 2000 : s === 'CLOSING' ? 1 - B.m.inState() / 2000 : 0;
        const vx = vz.x + vz.w / 2, vy = vz.y + vz.h / 2 + 16, vl = Math.max(30, Math.min(vz.w * 0.8, vz.h * 0.55, 90));
        kit.label(c, 'the vent', vx, vz.y + 6, { size: 11, color: C.faint, weight: 600, align: 'center' });
        c.strokeStyle = C.text2; c.lineWidth = 2; c.strokeRect(vx - vl / 2, vy - vl / 2, vl, vl);
        c.save(); c.translate(vx - vl / 2, vy + vl / 2); c.rotate(-clamp(frac, 0, 1) * 1.0); c.fillStyle = kit.hue(205, 0.7); c.fillRect(0, -3, vl, 6); c.restore();
        kit.label(c, Math.round(frac * 100) + ' % open', vx, vy + vl / 2 + 18, { size: 11, color: C.muted, align: 'center' });
        // the log
        const ly = (narrow ? dz.y + dz.h : H * 0.62) + 26;
        drawLog(kit, c, M, ly, W - 2 * M, B.m, Math.max(2, Math.floor((H - ly - 12) / 15)));
        ro.set('q', cnt + ' of ' + (size - 1)); ro.set('state', s); ro.set('handled', String(stat.handled)); ro.set('lost', String(stat.lost)); ro.set('already', String(stat.already)); ro.set('dropped', String(stat.dropped));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ sm-hierarchy */
  Hyper.sim('sm-hierarchy', {
    title: 'A garage door: flat, and with a parent state',
    blurb: `The same garage door drawn two ways. **Flat**: one MOTOR_FAULT arrow from each working state. **As one parent state**: a box NORMAL round the four working states, and a single arrow from the box to FAULT. The machine behaves identically; only the drawing, and the code behind it, differs.

**Try this**
- Switch between the two views and read **Arrows into FAULT**: four against one.
- Press **REMOTE** to open the door; trigger **MOTOR_FAULT** in the middle of the move: the motor stops from whichever substate you are in.
- Press **OBSTACLE** while the door is closing: the substate's own rule reverses it; the parent is not involved.
- Press **Reset the fault**: the door goes to CLOSED (the reset assumes it was closed by hand).`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { aspect: narrow ? 1.5 : 0.7, minH: 460, maxH: 660 });
      const SUBS = ['CLOSED', 'OPENING', 'OPEN', 'CLOSING'];
      const def = { start: 'CLOSED', states: {
        CLOSED: { entry: 'motor off', on: { REMOTE: 'OPENING' } },
        OPENING: { entry: 'motor up', on: { TOP_REACHED: 'OPEN' } },
        OPEN: { entry: 'motor off', on: { REMOTE: 'CLOSING' } },
        CLOSING: { entry: 'motor down', on: { BOTTOM_REACHED: 'CLOSED', OBSTACLE: 'OPENING' } },
        FAULT: { entry: 'alarm on', on: { FAULT_RESET: 'CLOSED' } } } };
      for (const s of SUBS) def.states[s].on.MOTOR_FAULT = 'FAULT';      // the parent's rule, written out once per substate for the engine
      const B = bench(kit, def, { layout: { OPENING: [0.12, 0.1], OPEN: [0.88, 0.1], CLOSED: [0.12, 0.5], CLOSING: [0.88, 0.5], FAULT: [0.5, 0.93] }, bends: { 'FAULT>CLOSED': 30, 'OPENING>FAULT': 20, 'OPEN>FAULT': -(20), 'CLOSED>FAULT': 25, 'CLOSING>FAULT': -25 }, rw: 40 });
      for (const t of B.dia.transitions) if (t.ev === 'MOTOR_FAULT' && (t.from === 'OPENING' || t.from === 'OPEN')) t.label = null;   // four arrows, two labels: all four mean MOTOR_FAULT
      let pos = 0, lastEv = '—', beam = 0;
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Draw the machine', options: [['With a parent state', 'group'], ['Flat', 'flat']], value: 'group' },
        { type: 'buttons', items: [{ id: 'remote', label: 'REMOTE', primary: true }, { id: 'obstacle', label: 'OBSTACLE' }, { id: 'fault', label: 'MOTOR_FAULT' }, { id: 'reset', label: 'Reset the fault' }] }
      ], id => {
        const ev = { remote: 'REMOTE', obstacle: 'OBSTACLE', fault: 'MOTOR_FAULT', reset: 'FAULT_RESET' }[id];
        if (!ev) return;
        const before = B.m.state, ok = B.m.send(ev);
        if (id === 'obstacle') beam = 1;
        if (ok && ev === 'FAULT_RESET') pos = 0;
        lastEv = ev + ': ' + (ok ? before + ' → ' + B.m.state : 'ignored in ' + before);
      });
      const ro = kit.readout(box.side, [['state', 'State'], ['arrows', 'Arrows into FAULT in the drawing'], ['pos', 'Door position'], ['last', 'Last event']]);
      const loop = kit.loop(dt => {
        B.t += dt; beam = Math.max(0, beam - dt * 1.2);
        B.m.tick(dt * 1000);
        const s = B.m.state;
        if (s === 'OPENING') pos = Math.min(1, pos + dt / 6); else if (s === 'CLOSING') pos = Math.max(0, pos - dt / 6);
        if (s === 'OPENING' && pos >= 1) { B.m.send('TOP_REACHED'); }
        if (s === 'CLOSING' && pos <= 0) { B.m.send('BOTTOM_REACHED'); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, grouped = ctl.values.view === 'group';
        const dz = narrow ? { x: M, y: M, w: W - 2 * M, h: H * 0.5 } : { x: M, y: M, w: W * 0.62, h: H * 0.62 };
        // the machine, drawn flat or grouped
        const rw = 40, rh = rw * 0.58, fx = (f, k) => dz.x + rw + f * (dz.w - 2 * rw), fy = f => dz.y + rh + f * (dz.h - 2 * rh);
        const lay = B.o.layout, pxs = SUBS.map(n => fx(lay[n][0])), pys = SUBS.map(n => fy(lay[n][1]));
        let gx0 = 0, gx1 = 0, gy0 = 0, gy1 = 0;
        const dia = B.dia, full = dia.transitions;
        if (grouped) {
          gx0 = Math.min(...pxs) - rw - 14; gx1 = Math.max(...pxs) + rw + 14; gy0 = Math.min(...pys) - rh - 26; gy1 = Math.max(...pys) + rh + 14;
          S.box(c, gx0, gy0, gx1 - gx0, gy1 - gy0, { r: 14, dash: true, color: C.accent, fill: C.dark ? 'rgba(123,140,255,.07)' : 'rgba(60,90,220,.05)' });
          kit.label(c, 'NORMAL', gx0 + 12, gy0 + 13, { size: 12, weight: 700, color: C.accent });
        }
        const shown = grouped ? { states: dia.states, start: dia.start, transitions: full.filter(t => t.ev !== 'MOTOR_FAULT') } : dia;
        const firedAll = B.t < 1.6 ? B.idx : -1, firedT = firedAll >= 0 ? full[firedAll] : null;
        const fired = firedT ? shown.transitions.indexOf(firedT) : -1;
        S.fsm(c, shown, { box: dz, active: s, fired, pulse: B.t / 0.7, rw });
        if (grouped) {
          const ax = (gx0 + gx1) / 2, ay0 = gy1, ay1 = fy(lay.FAULT[1]) - rh - 2, hot = firedT && firedT.ev === 'MOTOR_FAULT';
          kit.arrow(c, ax, ay0, ax, ay1, hot ? C.warn : C.muted, hot ? 2.6 : 1.6);
          kit.label(c, 'MOTOR_FAULT', ax + 8, (ay0 + ay1) / 2, { size: 10.5, color: hot ? C.warn : C.text2 });
        }
        // the door
        const sx = narrow ? M : W * 0.66, sy = narrow ? dz.y + dz.h + 10 : M, sw = narrow ? W - 2 * M : W * 0.34 - M, sh = narrow ? H * 0.42 : H * 0.62;
        const ow = Math.min(120, sw * 0.5), oh = Math.min(sh - 70, 130), ox = sx + sw / 2 - ow / 2 - 20, oy = sy + 30;
        kit.label(c, 'the door', sx + sw / 2 - 20, sy + 8, { size: 11, color: C.faint, weight: 600, align: 'center' });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)'; c.fillRect(ox, oy, ow, oh);
        c.fillStyle = kit.hue(30, 0.6); c.fillRect(ox + 2, oy + 2, ow - 4, Math.max(0, (1 - pos) * (oh - 4)));
        c.strokeStyle = C.text2; c.lineWidth = 2; c.strokeRect(ox, oy, ow, oh);
        c.save(); c.setLineDash([4, 3]); c.strokeStyle = beam > 0.05 ? C.bad : C.faint; c.lineWidth = beam > 0.05 ? 2 : 1; c.beginPath(); c.moveTo(ox - 8, oy + oh - 8); c.lineTo(ox + ow + 8, oy + oh - 8); c.stroke(); c.restore();
        kit.label(c, 'light barrier', ox + ow / 2, oy + oh + 12, { size: 10, color: beam > 0.05 ? C.bad : C.muted, align: 'center' });
        const mx = ox + ow + 24, my = oy + oh / 2;
        if (s === 'OPENING') kit.arrow(c, mx, my + 14, mx, my - 14, C.ok, 3); else if (s === 'CLOSING') kit.arrow(c, mx, my - 14, mx, my + 14, C.warn, 3);
        else kit.label(c, s === 'FAULT' ? 'FAULT' : 'motor off', mx, my, { size: 10.5, color: s === 'FAULT' ? C.bad : C.muted, align: 'left', weight: s === 'FAULT' ? 700 : 500 });
        const ly = narrow ? sy + sh : H * 0.62 + 24;
        drawLog(kit, c, M, ly, W - 2 * M, B.m, Math.max(2, Math.floor((H - ly - 12) / 15)));
        const into = shown.transitions.filter(t => t.to === 'FAULT').length + (grouped ? 1 : 0);
        ro.set('state', s); ro.set('arrows', String(into)); ro.set('pos', Math.round(pos * 100) + ' % open'); ro.set('last', lastEv);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ sm-two-machines */
  Hyper.sim('sm-two-machines', {
    title: 'A button machine and a lamp machine',
    blurb: `Two small machines and two words between them. Press and hold the button on the canvas (or use the two shortcuts). The button machine turns DOWN and UP into **CLICK** or **LONG_PRESS**; the lamp machine reacts. Dots crossing between the diagrams are the events being passed.

**Try this**
- A quick press: CLICK goes to the lamp, which toggles OFF and ON.
- Hold for more than a second: LONG_PRESS when the button machine reaches HELD; the lamp dims, and after eight seconds goes off by itself.
- Press while the lamp is DIM: CLICK switches it off. LONG_PRESS in OFF is ignored.
- Read the counts: one machine of 9 states against two machines of 3 + 3.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { aspect: narrow ? 1.55 : 0.68, minH: 460, maxH: 660 });
      const lampB = bench(kit, { start: 'OFF', states: {
        OFF: { entry: 'lamp off', on: { CLICK: 'ON' } },
        ON: { entry: 'lamp on', on: { CLICK: 'OFF', LONG_PRESS: 'DIM' } },
        DIM: { entry: 'lamp dim', on: { CLICK: 'OFF' }, after: { 8000: 'OFF' } } } },
      { layout: { OFF: [0.15, 0.8], ON: [0.5, 0.15], DIM: [0.85, 0.8] }, bends: { 'DIM>OFF': [26, -26] }, rw: 46 });
      let msgs = [], sent = 0, lastEv = '—', T = 0, down = false, autoUp = -1, rect = null;
      const btnB = bench(kit, { start: 'RELEASED', states: {
        RELEASED: { on: { DOWN: 'PRESSED' } },
        PRESSED: { on: { UP: { to: 'RELEASED', do: 'emit CLICK' } }, after: { 1000: 'HELD' } },
        HELD: { entry: 'emit LONG_PRESS', on: { UP: 'RELEASED' } } } },
      { layout: { RELEASED: [0.15, 0.8], PRESSED: [0.5, 0.15], HELD: [0.85, 0.8] }, rw: 46,
        onChange(from, to, why, actions) { for (const a of actions) { const m = /^emit (\w+)/.exec(a); if (m) { lampB.m.send(m[1]); msgs.push({ name: m[1], f: 0 }); sent++; lastEv = m[1] + ' sent: the lamp is now ' + lampB.m.state; } } } });
      const pressDown = () => { if (!down) { down = true; btnB.m.send('DOWN'); } };
      const pressUp = () => { if (down) { down = false; btnB.m.send('UP'); } };
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'click', label: 'A quick click', primary: true }, { id: 'long', label: 'A long press' }, { id: 'reset', label: 'Start again' }] }
      ], id => {
        if (id === 'click') { pressDown(); autoUp = T + 0.15; }
        if (id === 'long') { pressDown(); autoUp = T + 1.4; }
        if (id === 'reset') { down = false; autoUp = -1; btnB.m.reset(); lampB.m.reset(); msgs = []; sent = 0; lastEv = '—'; btnB.idx = lampB.idx = -1; btnB.t = lampB.t = 99; }
      });
      kit.drag(st, {
        hit: p => (rect && p.x >= rect.x && p.x <= rect.x + rect.w && p.y >= rect.y && p.y <= rect.y + rect.h ? rect : null),
        start: () => { autoUp = -1; pressDown(); }, move: () => {}, end: () => pressUp(), hover: true
      });
      const ro = kit.readout(box.side, [['b', 'Button machine'], ['l', 'Lamp machine'], ['sent', 'Events passed on'], ['merged', 'States as one machine'], ['last', 'Last event passed']]);
      const loop = kit.loop(dt => {
        T += dt; btnB.t += dt; lampB.t += dt;
        if (autoUp >= 0 && T >= autoUp) { autoUp = -1; pressUp(); }
        btnB.m.tick(dt * 1000); lampB.m.tick(dt * 1000);
        msgs.forEach(m => { m.f += dt / 0.8; }); msgs = msgs.filter(m => m.f < 1);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10;
        let bz, lz, a1, a2;
        if (narrow) { bz = { x: M, y: 26, w: W - 2 * M, h: H * 0.27 }; lz = { x: M, y: H * 0.27 + 80, w: W - 2 * M, h: H * 0.27 }; a1 = [W / 2, bz.y + bz.h + 4]; a2 = [W / 2, lz.y - 20]; }
        else { bz = { x: M, y: 26, w: W * 0.43, h: H * 0.5 }; lz = { x: W * 0.57 - M, y: 26, w: W * 0.43, h: H * 0.5 }; a1 = [bz.x + bz.w + 4, bz.y + bz.h / 2]; a2 = [lz.x - 4, lz.y + lz.h / 2]; }
        kit.label(c, 'button machine', bz.x + 4, bz.y - 12, { size: 12, weight: 650 });
        kit.label(c, 'lamp machine', lz.x + 4, lz.y - 12, { size: 12, weight: 650 });
        drawBench(kit, c, btnB, bz); drawBench(kit, c, lampB, lz);
        S.link(c, a1[0], a1[1], a2[0], a2[1], { arrow: 'end', color: C.accent, width: 2 });
        kit.label(c, narrow ? 'CLICK · LONG_PRESS' : 'CLICK', (a1[0] + a2[0]) / 2 + (narrow ? 82 : 0), (a1[1] + a2[1]) / 2 - (narrow ? 0 : 20), { size: 10.5, color: C.accent, align: 'center', weight: 650 });
        if (!narrow) kit.label(c, 'LONG_PRESS', (a1[0] + a2[0]) / 2, (a1[1] + a2[1]) / 2 + 18, { size: 10.5, color: C.accent, align: 'center', weight: 650 });
        for (const m of msgs) S.msg(c, a1[0], a1[1], a2[0], a2[1], clamp(m.f, 0, 1), { color: m.name === 'CLICK' ? C.ok : C.warn, r: 5 });
        // the real button, and the lamp
        const by = narrow ? lz.y + lz.h + 56 : bz.y + bz.h + 56, bx = narrow ? W * 0.25 : bz.x + bz.w / 2;
        const r = S.button(c, bx, by, { pressed: down, size: 44, label: null });
        rect = { x: r.x - 8, y: r.y - 8, w: r.w + 16, h: r.h + 16 };
        kit.label(c, down ? 'held down' : 'press and hold me', bx, by + 40, { size: 11, color: down ? C.accent : C.muted, align: 'center' });
        const lx = narrow ? W * 0.75 : lz.x + lz.w / 2, ls = lampB.m.state;
        S.led(c, lx, by, { color: 48, on: ls === 'ON' ? 1 : ls === 'DIM' ? 0.28 : 0, r: 16 });
        kit.label(c, 'lamp ' + ls.toLowerCase(), lx, by + 40, { size: 11, color: C.muted, align: 'center' });
        ro.set('b', btnB.m.state); ro.set('l', lampB.m.state); ro.set('sent', String(sent)); ro.set('merged', '9 (3 × 3), against 6 (3 + 3)'); ro.set('last', lastEv);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ sm-connection */
  const CONN_COLOR = { DISCONNECTED: 'bad', CONNECTING: 'warn', WIFI_UP: 'blue', MQTT_UP: 'ok' };
  Hyper.sim('sm-connection', {
    title: 'A connection manager against a network you can break',
    blurb: `The machine of the page, owning the way from the ESP32 to the broker. Untick **Wi-Fi available** or **Broker reachable** and watch it fall back, wait, and try again. The strip shows the last three minutes of *simulated* time, one colour per state; the clock can run up to thirty times faster than real time.

**Try this**
- Start with everything available: the machine climbs to MQTT_UP in a few seconds.
- Untick **Wi-Fi available** and leave it: CONNECTING times out after 15 s, and the wait in DISCONNECTED doubles each time (1 s, 2 s, 4 s … up to 30 s). Read **Back-off for the next failure**.
- Tick it again: the next attempt succeeds, MQTT_UP is reached, and the back-off returns to 1 s.
- Untick **Broker reachable**: the machine reaches WIFI_UP, gives up after 8 s, and starts over.
- With the machine in MQTT_UP, take the Wi-Fi away: the whole path is rebuilt from DISCONNECTED.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { aspect: narrow ? 1.75 : 0.8, minH: 500, maxH: 720 });
      const WIN = 180, MAXB = 30000;
      const ctx0 = { backoff: 1000, wait: 1000, attempts: 0 };
      const def = { start: 'DISCONNECTED', states: {
        DISCONNECTED: { entry: 'Wi-Fi off', on: {}, after: { 1000: 'CONNECTING' } },
        CONNECTING: { entry: 'join Wi-Fi', on: { WIFI_OK: 'WIFI_UP' }, after: { 15000: 'DISCONNECTED' } },
        WIFI_UP: { entry: 'connect MQTT', on: { MQTT_OK: 'MQTT_UP', WIFI_LOST: 'DISCONNECTED' }, after: { 8000: 'DISCONNECTED' } },
        MQTT_UP: { entry: 'publish online', on: { MQTT_LOST: 'WIFI_UP', WIFI_LOST: 'DISCONNECTED' } } } };
      let seed = 7;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      const B = bench(kit, def, {
        layout: { DISCONNECTED: [0.12, 0.2], CONNECTING: [0.88, 0.2], WIFI_UP: [0.88, 0.8], MQTT_UP: [0.12, 0.8] },
        bends: { 'WIFI_UP>DISCONNECTED': [45, -45] }, rw: 44,
        onChange(from, to) {
          if (to === 'DISCONNECTED') { ctx0.wait = ctx0.backoff + Math.floor(rnd() * 500); def.states.DISCONNECTED.after = { [ctx0.wait]: 'CONNECTING' }; }
          if (from === 'DISCONNECTED' && to === 'CONNECTING') { ctx0.backoff = Math.min(ctx0.backoff * 2, MAXB); ctx0.attempts++; }
          if (to === 'MQTT_UP') { ctx0.backoff = 1000; ctx0.attempts = 0; }
        }
      });
      const wait = B.dia.transitions.find(t => t.from === 'DISCONNECTED' && t.to === 'CONNECTING');
      if (wait) wait.label = 'after back-off';
      let Ts = 0, segs = [];
      const ctl = kit.controls(box.side, [
        { id: 'wifi', type: 'check', label: 'Wi-Fi available', value: true },
        { id: 'broker', type: 'check', label: 'Broker reachable', value: true },
        { id: 'speed', label: 'Clock speed', min: 1, max: 30, step: 1, value: 6, unit: '×' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Restart the device', primary: true }] }
      ], id => {
        if (id === 'reset') { B.m.reset(); B.idx = -1; B.t = 99; ctx0.backoff = 1000; ctx0.wait = 1000; ctx0.attempts = 0; def.states.DISCONNECTED.after = { 1000: 'CONNECTING' }; segs = []; Ts = 0; }
      });
      const ro = kit.readout(box.side, [['state', 'State'], ['t', 'Time in this state'], ['backoff', 'Back-off for the next failure'], ['att', 'Failed attempts since the last success']]);
      function step(h) {
        const env = ctl.values;
        let s = B.m.state, t = B.m.inState();
        if (s === 'CONNECTING' && env.wifi && t >= 3000) B.m.send('WIFI_OK');
        else if (s === 'WIFI_UP' && env.broker && env.wifi && t >= 1000) B.m.send('MQTT_OK');
        s = B.m.state;
        if ((s === 'WIFI_UP' || s === 'MQTT_UP') && !env.wifi) B.m.send('WIFI_LOST');
        if (B.m.state === 'MQTT_UP' && !env.broker) B.m.send('MQTT_LOST');
        B.m.tick(h * 1000);
        Ts += h;
        const last = segs[segs.length - 1];
        if (last && last.s === B.m.state) last.t1 = Ts; else segs.push({ s: B.m.state, t0: Ts - h, t1: Ts });
        while (segs.length && segs[0].t1 < Ts - WIN) segs.shift();
      }
      const loop = kit.loop(dt => {
        const sdt = dt * ctl.values.speed, n = Math.max(1, Math.ceil(sdt / 0.25));
        for (let i = 0; i < n; i++) step(sdt / n);
        B.t += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, wide = W >= 560, s = B.m.state, env = ctl.values;
        const colour = k => CONN_COLOR[k] === 'bad' ? C.bad : CONN_COLOR[k] === 'warn' ? C.warn : CONN_COLOR[k] === 'ok' ? C.ok : kit.hue(210, 0.9);
        const dz = wide ? { x: M, y: M, w: W * 0.56, h: H * 0.58 } : { x: M, y: M, w: W - 2 * M, h: H * 0.38 };
        drawBench(kit, c, B, dz);
        // the network
        const nz = wide ? { x: W * 0.6, y: M + 20, w: W * 0.4 - M, h: H * 0.3 } : { x: M, y: dz.y + dz.h + 14, w: W - 2 * M, h: H * 0.13 };
        const ny = nz.y + (wide ? 50 : 24), nx = [nz.x + nz.w * 0.14, nz.x + nz.w * 0.5, nz.x + nz.w * 0.86];
        const up1 = s === 'WIFI_UP' || s === 'MQTT_UP', up2 = s === 'MQTT_UP';
        S.link(c, nx[0] + 22, ny, nx[1] - 22, ny, { wireless: true, color: !env.wifi ? C.bad : up1 ? C.ok : C.faint, width: 2 });
        S.link(c, nx[1] + 22, ny, nx[2] - 22, ny, { color: !env.broker ? C.bad : up2 ? C.ok : C.faint, width: 2 });
        if (!env.wifi) kit.label(c, '✕', (nx[0] + nx[1]) / 2, ny - 10, { size: 15, color: C.bad, weight: 700, align: 'center' });
        if (!env.broker) kit.label(c, '✕', (nx[1] + nx[2]) / 2, ny - 10, { size: 15, color: C.bad, weight: 700, align: 'center' });
        S.node(c, nx[0], ny, { kind: 'esp', label: 'ESP32', r: 16, active: true });
        S.node(c, nx[1], ny, { kind: 'router', label: 'router', r: 16, dim: !env.wifi });
        S.node(c, nx[2], ny, { kind: 'broker', label: 'broker', r: 16, dim: !env.broker });
        // the strip: the state over the last three minutes of simulated time
        const sy = wide ? H * 0.68 : nz.y + nz.h + 30, px = M, sw = W - 2 * M, X = t => px + clamp((t - (Ts - WIN)) / WIN, 0, 1) * sw, sh = 24;
        kit.label(c, 'the state over the last 3 minutes (simulated time)', px, sy - 12, { size: 10.5, color: C.faint, weight: 600 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(px, sy, sw, sh);
        for (const g of segs) { c.fillStyle = colour(g.s); c.fillRect(X(g.t0), sy, Math.max(1, X(g.t1) - X(g.t0)), sh); }
        Object.keys(CONN_COLOR).forEach((k, i) => {
          const lx = px + i * sw / 4;
          c.fillStyle = colour(k); c.fillRect(lx, sy + sh + 10, 10, 10);
          kit.label(c, k, lx + 14, sy + sh + 15, { size: 10, color: C.muted });
        });
        const ly = sy + sh + 42;
        drawLog(kit, c, M, ly, W - 2 * M, B.m, Math.max(2, Math.floor((H - ly - 12) / 15)));
        ro.set('state', s); ro.set('t', fmtS(B.m.inState())); ro.set('backoff', fmtS(ctx0.backoff)); ro.set('att', String(ctx0.attempts));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ sm-requirements */
  const DRYER_STATES = ['IDLE', 'DRYING', 'OVERRUN', 'FAN_ONLY', 'PAUSE'];
  const DRYER_TEXT = 'When a hand is put under the dryer, the fan and the heater start. They run while the hand is there, and for two seconds after it leaves. If the hand stays more than thirty seconds the heater switches off to protect it, but the fan carries on. After a run the dryer waits three seconds before it can start again.';
  const DRYER_NOTES = {
    1: ['The description', DRYER_TEXT],
    2: ['Nouns become states', 'IDLE: nothing is happening', 'DRYING: fan and heater on, the hand is there', 'OVERRUN: the two seconds after the hand leaves', 'FAN_ONLY: the heater is off, the hand is still there', 'PAUSE: waiting three seconds before the next run'],
    3: ['"When" clauses become events', 'a hand is put under: HAND_IN, in IDLE', 'the hand leaves: HAND_OUT, in DRYING', 'for two seconds after: a time-out in OVERRUN', 'more than thirty seconds: a time-out in DRYING', 'waits three seconds: a time-out in PAUSE'],
    4: ['"Then" clauses become actions', 'fan and heater start: entry of DRYING', 'and keep running: entry of OVERRUN', 'the heater switches off: entry of FAN_ONLY', 'everything off: entry of IDLE and PAUSE'],
    5: ['"What if" fills the holes', 'the hand comes back in OVERRUN: DRYING', 'the hand leaves in FAN_ONLY: PAUSE', 'a hand arrives in PAUSE: ignored, on purpose', 'power-up: IDLE, everything off', 'every other empty cell: ignored']
  };
  function dryerDef(step) {
    const d = { start: 'IDLE', states: {} };
    for (const s of DRYER_STATES) d.states[s] = { on: {} };
    if (step >= 3) {
      d.states.IDLE.on.HAND_IN = 'DRYING';
      d.states.DRYING.on.HAND_OUT = 'OVERRUN';
      d.states.DRYING.after = { 30000: 'FAN_ONLY' };
      d.states.OVERRUN.after = { 2000: 'PAUSE' };
      d.states.PAUSE.after = { 3000: 'IDLE' };
    }
    if (step >= 4) { d.states.IDLE.entry = 'all off'; d.states.DRYING.entry = 'fan + heater'; d.states.OVERRUN.entry = 'fan + heater'; d.states.FAN_ONLY.entry = 'fan only'; d.states.PAUSE.entry = 'all off'; }
    if (step >= 5) { d.states.OVERRUN.on.HAND_IN = 'DRYING'; d.states.FAN_ONLY.on.HAND_OUT = 'PAUSE'; }
    return d;
  }
  function wrapText(str, maxc) {
    const out = []; let line = '';
    for (const w of String(str).split(' ')) {
      if ((line + ' ' + w).trim().length > maxc) { out.push(line); line = w; } else line = (line + ' ' + w).trim();
    }
    if (line) out.push(line);
    return out;
  }

  Hyper.sim('sm-requirements', {
    title: 'A machine grown from a description',
    blurb: `The hand dryer of the page, built in the five steps of the method. Move the **step** slider: the notes on the left say what each part of the description becomes, the diagram grows, and from step 3 the grid of states against events appears. A **?** is an empty cell, a question the description did not answer; at step 5 each is resolved as a transition or as *ignored, on purpose*.

**Try this**
- At step 2 the checker complains that nothing leads anywhere: states alone are not a machine.
- At step 3 tick **A hand is under the dryer** and take it away while OVERRUN: the hand coming back is *not handled* yet, because that cell is still a **?**.
- Step 5 fills the holes: now a hand returning during OVERRUN restarts DRYING.
- Count the grid: 15 cells, 5 from the words, 2 from the questions, 8 ignored.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { aspect: narrow ? 1.9 : 0.86, minH: 560, maxH: 760 });
      const LAYOUT = { IDLE: [0.1, 0.5], DRYING: [0.42, 0.12], OVERRUN: [0.9, 0.12], PAUSE: [0.9, 0.62], FAN_ONLY: [0.42, 0.88] };
      const BENDS = { 'PAUSE>IDLE': -34, 'DRYING>OVERRUN': 20, 'OVERRUN>DRYING': 20 };
      let step = 1, B = make();
      function make() { return bench(kit, dryerDef(step), { layout: LAYOUT, bends: BENDS, rw: 40 }); }
      const ctl = kit.controls(box.side, [
        { id: 'step', label: 'Step of the method', min: 1, max: 5, step: 1, value: 1 },
        { id: 'hand', type: 'check', label: 'A hand is under the dryer', value: false },
        { id: 'speed', label: 'Clock speed', min: 1, max: 20, step: 1, value: 6, unit: '×' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again' }] }
      ], (id, v) => {
        if (id === 'step') { step = Math.round(v); B = make(); }
        if (id === 'reset') { B = make(); ctl.set('hand', false); }
      });
      const ro = kit.readout(box.side, [['state', 'State'], ['t', 'Time in this state'], ['check', 'The checker says']]);
      const loop = kit.loop(dt => {
        B.t += dt;
        if (step >= 3) { const sdt = dt * ctl.values.speed; B.m.send(ctl.values.hand ? 'HAND_IN' : 'HAND_OUT'); B.m.tick(sdt * 1000); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, wide = W >= 560, s = B.m.state, d = B.def;
        // the notes of this step
        const nz = wide ? { x: M, y: M, w: W * 0.38 - M, h: H * 0.62 } : { x: M, y: M, w: W - 2 * M, h: H * 0.27 };
        S.box(c, nz.x, nz.y, nz.w, nz.h, { color: C.faint, r: 8 });
        const notes = DRYER_NOTES[step], maxc = Math.floor((nz.w - 24) / 6.2);
        kit.label(c, step + ' · ' + notes[0], nz.x + 12, nz.y + 18, { size: 12.5, weight: 650, color: C.accent });
        let ty = nz.y + 42;
        for (const line of notes.slice(1)) {
          for (const w of wrapText(line, maxc)) { if (ty < nz.y + nz.h - 6) kit.label(c, w, nz.x + 12, ty, { size: 11, color: C.text }); ty += 16; }
          ty += 4;
        }
        // the diagram
        const dz = wide ? { x: W * 0.4, y: M, w: W * 0.6 - M, h: H * 0.62 } : { x: M, y: nz.y + nz.h + 8, w: W - 2 * M, h: H * 0.34 };
        if (step >= 2) drawBench(kit, c, B, dz); else kit.label(c, 'the diagram starts at step 2', dz.x + dz.w / 2, dz.y + dz.h / 2, { size: 11.5, color: C.faint, align: 'center' });
        // the outputs
        const on = step >= 4 ? { fan: s === 'DRYING' || s === 'OVERRUN' || s === 'FAN_ONLY', heater: s === 'DRYING' || s === 'OVERRUN' } : { fan: false, heater: false };
        const ox = wide ? dz.x + dz.w - 130 : W - 150, oy = wide ? dz.y + dz.h - 30 : dz.y + dz.h + 14;
        S.led(c, ox, oy, { color: 200, on: on.fan ? 1 : 0, r: 8 }); kit.label(c, 'fan', ox + 14, oy, { size: 10.5, color: C.muted });
        S.led(c, ox + 56, oy, { color: 20, on: on.heater ? 1 : 0, r: 8 }); kit.label(c, 'heater', ox + 70, oy, { size: 10.5, color: C.muted });
        if (step < 4) kit.label(c, 'outputs from step 4', ox + 35, oy + 17, { size: 10, color: C.faint, align: 'center' });
        // the grid of states against events
        const gy = wide ? H * 0.62 + 20 : dz.y + dz.h + 44, gx = M, gw = W - 2 * M, lw = Math.min(84, gw * 0.2), cw = (gw - lw) / 3, rh = 20;
        const cols = [['HAND_IN', 'HAND_IN'], ['HAND_OUT', 'HAND_OUT'], ['time', 'time up']];
        if (step >= 3) {
          kit.label(c, 'state × event: every cell is a decision', gx, gy - 12, { size: 10.5, color: C.faint, weight: 600 });
          cols.forEach(([k, t], i) => kit.label(c, t, gx + lw + i * cw + cw / 2, gy + 8, { size: 10.5, color: C.muted, weight: 650, align: 'center' }));
          DRYER_STATES.forEach((n, r) => {
            const y = gy + 20 + r * rh, S0 = d.states[n], hot = n === s;
            if (hot) { c.fillStyle = C.dark ? 'rgba(123,140,255,.16)' : 'rgba(60,90,220,.10)'; c.fillRect(gx, y, gw, rh); }
            kit.label(c, n, gx + 4, y + rh / 2, { size: 11, weight: hot ? 700 : 500, color: hot ? C.text : C.muted });
            cols.forEach(([k], i) => {
              let txt = null, kind = 'open';
              if (k === 'time') { const a = Object.keys(S0.after || {})[0]; if (a) { txt = S0.after[a] + ' ' + (a / 1000) + ' s'; kind = 'set'; } }
              else if (S0.on[k]) { txt = S0.on[k]; kind = 'set'; }
              const whatif = step >= 5 && ((n === 'OVERRUN' && k === 'HAND_IN') || (n === 'FAN_ONLY' && k === 'HAND_OUT'));
              if (!txt) txt = step >= 5 ? 'ignored' : '?';
              const x = gx + lw + i * cw;
              if (whatif) { c.fillStyle = C.dark ? 'rgba(224,160,48,.28)' : 'rgba(224,160,48,.25)'; c.fillRect(x + 1, y + 1, cw - 2, rh - 2); }
              kit.label(c, txt, x + cw / 2, y + rh / 2, { size: 10.5, align: 'center', weight: kind === 'open' && step < 5 ? 700 : 500, color: kind === 'open' ? (step < 5 ? C.bad : C.faint) : C.text });
            });
          });
        } else kit.label(c, 'the grid appears at step 3', gx, gy, { size: 11, color: C.faint });
        const probs = E.fsmCheck(d);
        ro.set('state', s); ro.set('t', fmtS(B.m.inState())); ro.set('check', probs.length ? probs.length + ' problem' + (probs.length > 1 ? 's' : '') + ': ' + probs[0] : 'no problems');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ sm-test-bench */
  const BUTTON_TESTS = [
    { text: 'start', exp: 'RELEASED' },
    { text: 'send DOWN', ev: 'DOWN', exp: 'PRESSED' },
    { text: 'wait 999 ms', ms: 999, exp: 'PRESSED' },
    { text: 'wait 1 ms', ms: 1, exp: 'HELD' },
    { text: 'send UP', ev: 'UP', exp: 'RELEASED' },
    { text: 'send UP (ignored?)', ev: 'UP', exp: 'RELEASED' },
    { text: 'send DOWN', ev: 'DOWN', exp: 'PRESSED' },
    { text: 'wait 300 ms', ms: 300, exp: 'PRESSED' },
    { text: 'send UP (1 click)', ev: 'UP', exp: 'RELEASED', clicks: 1 },
    { text: 'send DOWN', ev: 'DOWN', exp: 'PRESSED' },
    { text: 'wait 300 ms', ms: 300, exp: 'PRESSED' },
    { text: 'send DOWN (a bounce)', ev: 'DOWN', exp: 'PRESSED' },
    { text: 'wait 700 ms', ms: 700, exp: 'HELD' }
  ];
  Hyper.sim('sm-test-bench', {
    title: 'A test script against the button machine',
    blurb: `The test script of the page, run against the push-button machine. Each step sends an event or advances the clock, and says which state to expect. The diagram follows the machine through the script; the table records what it found. Choose a **bug** and run the script again to see which step catches it.

**Try this**
- Run the script on the correct machine: every step passes.
- Choose *hold limit 1500 ms*: the step *wait 1 ms* fails, because HELD does not arrive at 1000 ms.
- Choose *> instead of >=*: the same step fails by exactly one millisecond; this is why the script stops at 999 ms and then adds 1.
- Choose *a bounce restarts the hold time*: only the last step catches it. Without that step the bug would pass every test.
- Use **Next step** to walk through slowly and watch the diagram.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { aspect: narrow ? 1.55 : 0.72, minH: 480, maxH: 680 });
      let clicks = 0, B = make('ok'), idx = 0, results = [], auto = false, acc = 0, variant = 'ok';
      function make(v) {
        clicks = 0;
        const hold = v === 'late' ? 1500 : v === 'gt' ? 1001 : 1000;
        const d = { start: 'RELEASED', states: {
          RELEASED: { on: { DOWN: 'PRESSED' } },
          PRESSED: { on: Object.assign({ UP: { to: 'RELEASED', do: 'click' } }, v === 'bounce' ? { DOWN: 'PRESSED' } : {}), after: { [hold]: 'HELD' } },
          HELD: { entry: 'long press', on: v === 'trap' ? {} : { UP: 'RELEASED' } } } };
        return bench(kit, d, { layout: { RELEASED: [0.1, 0.85], PRESSED: [0.5, 0.3], HELD: [0.9, 0.85] }, bends: { 'PRESSED>RELEASED': 24 }, rw: 38,
          onChange(from, to, why, actions) { if (actions.includes('click')) clicks++; } });
      }
      function reset() { B = make(variant); idx = 0; results = []; auto = false; acc = 0; }
      function runStep() {
        if (idx >= BUTTON_TESTS.length) return;
        const t = BUTTON_TESTS[idx];
        if (t.ev) B.m.send(t.ev);
        if (t.ms) B.m.tick(t.ms);
        const got = B.m.state, okClicks = t.clicks == null || clicks === t.clicks;
        results.push({ got, clicks, ok: got === t.exp && okClicks });
        idx++;
      }
      const ctl = kit.controls(box.side, [
        { id: 'bug', type: 'select', label: 'Machine under test', options: [['The machine of the page', 'ok'], ['Hold limit 1500 ms, not 1000', 'late'], ['> instead of >= (HELD at 1001 ms)', 'gt'], ['HELD cannot be released', 'trap'], ['A bounce restarts the hold time', 'bounce']], value: 'ok' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run all the tests', primary: true }, { id: 'step', label: 'Next step' }, { id: 'reset', label: 'Start again' }] }
      ], (id, v) => {
        if (id === 'bug') { variant = v; reset(); }
        if (id === 'reset') reset();
        if (id === 'run') { if (idx >= BUTTON_TESTS.length) reset(); auto = true; acc = 0.4; }
        if (id === 'step') { auto = false; runStep(); }
      });
      const ro = kit.readout(box.side, [['pass', 'Steps passed'], ['first', 'First failure'], ['state', 'Machine state']]);
      const loop = kit.loop(dt => {
        B.t += dt;
        if (auto) { acc += dt; if (acc >= 0.42) { acc = 0; runStep(); if (idx >= BUTTON_TESTS.length) auto = false; } }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, wide = W >= 560;
        const dz = wide ? { x: M, y: M, w: W * 0.4 - M, h: H * 0.45 } : { x: M, y: M, w: W - 2 * M, h: H * 0.27 };
        drawBench(kit, c, B, dz);
        // the table of steps
        const tx = wide ? W * 0.44 : M, ty = wide ? M + 6 : dz.y + dz.h + 22, tw = W - tx - M, rh = 19, cw = [0.07, 0.4, 0.23, 0.24, 0.06].map(f => f * tw);
        const heads = ['', 'step', 'expect', 'got', ''];
        let xx = tx; heads.forEach((h, i) => { kit.label(c, h, xx + 4, ty, { size: 10.5, color: C.faint, weight: 650 }); xx += cw[i]; });
        BUTTON_TESTS.forEach((t, i) => {
          const y = ty + 16 + i * rh, r = results[i], next = i === idx;
          if (r) { c.fillStyle = r.ok ? (C.dark ? 'rgba(34,179,122,.13)' : 'rgba(34,179,122,.12)') : (C.dark ? 'rgba(229,72,77,.25)' : 'rgba(229,72,77,.18)'); c.fillRect(tx, y - rh / 2, tw, rh); }
          else if (next) { c.fillStyle = C.dark ? 'rgba(123,140,255,.16)' : 'rgba(60,90,220,.10)'; c.fillRect(tx, y - rh / 2, tw, rh); }
          const col = r ? C.text : C.muted;
          let x = tx;
          kit.label(c, String(i + 1), x + 4, y, { size: 10.5, color: C.faint }); x += cw[0];
          kit.label(c, t.text, x + 4, y, { size: 11, color: col }); x += cw[1];
          kit.label(c, t.exp, x + 4, y, { size: 11, color: col }); x += cw[2];
          if (r) kit.label(c, r.got, x + 4, y, { size: 11, color: r.ok ? C.text : C.bad, weight: r.ok ? 500 : 650 });
          x += cw[3];
          if (r) kit.label(c, r.ok ? '✓' : '✕', x + 4, y, { size: 13, weight: 700, color: r.ok ? C.ok : C.bad });
        });
        const passed = results.filter(r => r.ok).length, firstBad = results.findIndex(r => !r.ok);
        const sy = ty + 16 + BUTTON_TESTS.length * rh + 18;
        const done = idx >= BUTTON_TESTS.length;
        kit.label(c, done ? (passed === BUTTON_TESTS.length ? 'all ' + passed + ' steps pass' : (BUTTON_TESTS.length - passed) + ' of ' + BUTTON_TESTS.length + ' steps fail') : passed + ' passed so far, ' + (BUTTON_TESTS.length - idx) + ' to run', tx, sy, { size: 12.5, weight: 700, color: done ? (passed === BUTTON_TESTS.length ? C.ok : C.bad) : C.text });
        ro.set('pass', passed + ' of ' + results.length); ro.set('state', B.m.state);
        ro.set('first', firstBad < 0 ? '—' : 'step ' + (firstBad + 1) + ': ' + BUTTON_TESTS[firstBad].text + ' (expected ' + BUTTON_TESTS[firstBad].exp + ', got ' + results[firstBad].got + (BUTTON_TESTS[firstBad].clicks != null ? ', ' + results[firstBad].clicks + ' clicks' : '') + ')');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });
})();
