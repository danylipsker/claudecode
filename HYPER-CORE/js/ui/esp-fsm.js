/* HYPER-CORE · ui/esp-fsm.js
 *
 * Hyper ESP32 · Tools → State machine lab
 *
 *   #/tools/fsmlab/design     the workbench: the diagram (states are dragged to arrange them), an editor of states,
 *                             transitions and timeouts, run controls (a button per event, guards as tick boxes, a clock
 *                             with four speeds, step, reset), the log, the problems found, and the program in blocks,
 *                             Arduino C++ and MicroPython; saved in the browser, exported and imported as JSON text
 *   #/tools/fsmlab/examples   eight machines that load into the workbench, each with what it teaches
 *   #/tools/fsmlab/table      the same machine as a state-transition table, edited in place; every state/event pair is
 *                             marked until it is decided (handled, or ignored on purpose)
 *   #/tools/fsmlab/patterns   flag soup against one state; delay() against a timed state; one big machine against two
 *                             small ones; where the inputs become events — each drawn and runnable
 *
 * The machine runs on Hyper.esp.fsm, is checked with Hyper.esp.fsmCheck and is drawn with Hyper.esym.fsm. The program
 * is generated here rather than with Hyper.esp.fsmCode, so that it compiles and runs as it is: actions print until the
 * reader writes them, guards are functions, events can be typed in the serial monitor, exit actions run, guarded
 * alternatives are kept, and at most one timeout fires per pass of loop().
 *
 * The design being edited is kept in localStorage under hyper:esp32:fsmlab, in the engine's own format plus
 * { title, layout: { STATE: [x, y] }, guards: { name: bool }, events: [...], ignored: ['STATE EVENT', ...] }.
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, E = H.esp;
  const T = H.espTools = H.espTools || {};
  const S = () => H.esym;
  const K = () => H.kit;

  const KEY = 'hyper:esp32:fsmlab';
  const MORE = ['what-a-state-machine-is', 'states-events-transitions', 'drawing-a-state-diagram', 'state-machine-in-code', 'timeouts-and-timed-states', 'entry-exit-and-guards',
    'event-queues', 'hierarchical-states', 'several-machines-together', 'connection-manager-machine', 'error-states-and-recovery', 'testing-a-state-machine'];
  const ID = /^[A-Za-z_][A-Za-z0-9_]{0,31}$/;
  // words the generated programs use or the languages reserve: no state or guard may be called so
  const RESERVED = new Set((
    'alignas alignof and asm auto bool break case catch char class const constexpr continue default delete do double else enum explicit extern false float for friend goto if inline int long mutable namespace new noexcept not nullptr operator or private protected public register return short signed sizeof static struct switch template this throw true try typedef typename union unsigned using virtual void volatile while xor ' +
    'False None True as assert async await def del elif except finally from global import in is lambda nonlocal pass raise with yield print len str range list dict ' +
    'setup loop state enteredAt entered action onEntry onExit enter go handle checkTimeouts readSerial readInputs Serial String millis delay STATE_NAMES EVENT_NAMES EVENT_COUNT EVENTS State Event ' +
    'time sys select poller typed flags on_entry on_exit check_timeouts read_console read_inputs ' +
    'HIGH LOW INPUT OUTPUT INPUT_PULLUP CHANGE RISING FALLING LED_BUILTIN PI DEFAULT abs min max constrain round digitalRead digitalWrite pinMode analogRead').split(/\s+/));
  const SPEEDS = [['× 0.25', 0.25], ['× 1', 1], ['× 4', 4], ['× 20', 20]];
  const FX_MS = 900, NOTE_MS = 2200;

  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const now = () => (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
  const txt = v => typeof v === 'string' ? v.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80) : '';
  const fmtMs = ms => ms < 1000 ? ms + ' ms' : ms >= 120000 && ms % 60000 === 0 ? ms / 60000 + ' min' : +(ms / 1000).toFixed(3) + ' s';
  const fmtClock = ms => { ms = Math.max(0, ms || 0); if (ms < 60000) return (ms / 1000).toFixed(ms < 10000 ? 2 : 1) + ' s'; const m = Math.floor(ms / 60000), s = Math.floor(ms / 1000) % 60; return m + ' min ' + (s < 10 ? '0' : '') + s + ' s'; };
  const prettyWhy = w => String(w || '').replace(/^after (\d+(?:\.\d+)?) ms$/, (m, n) => 'after ' + fmtMs(+n));
  const short = (s, n) => !s ? '' : s.length <= n ? s : s.slice(0, Math.max(1, n - 1)).trimEnd() + '…';
  const rr = (c, x, y, w, h, r) => { c.beginPath(); r = Math.max(0, Math.min(r, w / 2, h / 2)); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const uniq = xs => xs.filter((x, i) => x && xs.indexOf(x) === i);

  /* ================================================================ the design: an editable model
     mo = { title, start, states: [{ name, entry, exit, on: [{ ev, to, if, do }], after: [{ ms, to, do }], x, y }],
            guards: { name: bool }, events: [names], ignored: ['STATE EVENT'] } */
  const stateOf = (mo, n) => mo.states.find(s => s.name === n) || null;
  const knownEvents = mo => uniq((mo.events || []).concat(...mo.states.map(s => s.on.map(t => t.ev))));
  const guardNames = mo => uniq([].concat(...mo.states.map(s => s.on.map(t => t.if))));
  const guardFns = mo => { const g = {}; for (const n of guardNames(mo)) g[n] = () => mo.guards[n] !== false; return g; };
  const circle = (i, n) => n < 2 ? [0.5, 0.5] : [0.5 + 0.5 * Math.cos(i * 2 * Math.PI / n - Math.PI / 2), 0.5 + 0.5 * Math.sin(i * 2 * Math.PI / n - Math.PI / 2)];
  const undecided = mo => { const ign = new Set(mo.ignored || []), out = []; for (const ev of knownEvents(mo)) for (const s of mo.states) if (!s.on.some(t => t.ev === ev) && !ign.has(s.name + ' ' + ev)) out.push(s.name + ' ' + ev); return out; };

  /* what is wrong with a name: '' when it is fine */
  function idProblem(n) {
    if (!n) return 'A name is needed.';
    if (!ID.test(n)) return '“' + n + '” will not do as a name: use letters, digits and _ only, starting with a letter and with no spaces (for example DOOR_OPEN), at most 32 characters.';
    return '';
  }
  function stateNameProblem(mo, n, self) {
    const p = idProblem(n);
    if (p) return p;
    if (RESERVED.has(n)) return n + ' is a word the generated programs already use: choose another name.';
    if (n !== self && mo.states.some(s => s.name === n)) return 'There is already a state called ' + n + '.';
    if (guardNames(mo).includes(n)) return n + ' is already the name of a guard.';
    return '';
  }
  function guardNameProblem(mo, n) {
    const p = idProblem(n);
    if (p) return p;
    if (RESERVED.has(n)) return n + ' is a word the generated programs already use: choose another name for the guard.';
    if (mo.states.some(s => s.name === n)) return n + ' is the name of a state; a guard needs a name of its own, such as doorClosed or batteryOk.';
    return '';
  }

  /* the model -> the engine's definition */
  function toDef(mo) {
    const states = {};
    for (const s of mo.states) {
      const d = {};
      if (s.entry) d.entry = s.entry;
      if (s.exit) d.exit = s.exit;
      const on = {};
      for (const t of s.on) {
        const o = (t.if || t.do) ? Object.assign({ to: t.to }, t.if ? { if: t.if } : {}, t.do ? { do: t.do } : {}) : t.to;
        on[t.ev] = on[t.ev] == null ? o : [].concat(on[t.ev], [o]);
      }
      if (Object.keys(on).length) d.on = on;
      const after = {};
      for (const a of s.after) if (after[a.ms] == null) after[a.ms] = a.do ? { to: a.to, do: a.do } : a.to;
      if (Object.keys(after).length) d.after = after;
      states[s.name] = d;
    }
    return { start: mo.start, states };
  }
  /* the model -> what is saved, exported and shown as JSON */
  function exportObj(mo) {
    const d = toDef(mo), layout = {};
    for (const s of mo.states) layout[s.name] = [+s.x.toFixed(3), +s.y.toFixed(3)];
    const guards = {};
    for (const g of guardNames(mo)) guards[g] = mo.guards[g] !== false;
    return Object.assign({ title: mo.title }, d, { layout, guards, events: knownEvents(mo), ignored: (mo.ignored || []).slice() });
  }
  /* JSON (the engine's format, with or without the lab's extras) -> the model; throws an Error in plain words */
  function fromObj(o) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) throw new Error('it is not a design: a design is an object { "start": …, "states": { … } }');
    if (!o.states || typeof o.states !== 'object' || Array.isArray(o.states)) throw new Error('it has no "states" object');
    const names = Object.keys(o.states);
    if (!names.length) throw new Error('it has no states');
    if (names.length > 40) throw new Error('it has ' + names.length + ' states; the lab takes 40 at most');
    for (const n of names) { const p = idProblem(n) || (RESERVED.has(n) ? n + ' is a word the generated programs already use' : ''); if (p) throw new Error('the state name “' + n + '”: ' + p); }
    const layout = o.layout && typeof o.layout === 'object' ? o.layout : {};
    const mo = { title: txt(o.title) || 'Imported machine', start: names.includes(o.start) ? o.start : names[0], states: [], guards: {}, events: [], ignored: [] };
    const target = (t, self) => typeof t === 'string' ? t : t && typeof t === 'object' && t.to != null ? String(t.to) : self;
    names.forEach((n, i) => {
      const S0 = o.states[n] && typeof o.states[n] === 'object' ? o.states[n] : {};
      const L = layout[n], c = circle(i, names.length);
      const s = { name: n, entry: txt(S0.entry), exit: txt(S0.exit), on: [], after: [],
        x: Array.isArray(L) && Number.isFinite(+L[0]) ? clamp(+L[0], 0, 1) : c[0], y: Array.isArray(L) && Number.isFinite(+L[1]) ? clamp(+L[1], 0, 1) : c[1] };
      for (const [ev, v] of Object.entries(S0.on && typeof S0.on === 'object' ? S0.on : {})) {
        if (idProblem(ev)) throw new Error('the event “' + ev + '” in ' + n + ': ' + idProblem(ev));
        for (const t of [].concat(v)) {
          const g = t && typeof t === 'object' && t.if ? String(t.if) : '';
          if (g && (idProblem(g) || RESERVED.has(g))) throw new Error('the guard “' + g + '” in ' + n + ' will not do as a name');
          s.on.push({ ev, to: target(t, n), if: g, do: t && typeof t === 'object' ? txt(t.do) : '' });
        }
      }
      for (const [ms, v] of Object.entries(S0.after && typeof S0.after === 'object' ? S0.after : {})) {
        const k = Math.round(+ms);
        if (!(k >= 10 && k <= 86400000)) throw new Error('the timeout “' + ms + '” in ' + n + ': a timeout is a number of milliseconds from 10 to 86400000 (a day)');
        if (s.after.some(a => a.ms === k)) continue;
        const t = [].concat(v)[0];
        s.after.push({ ms: k, to: target(t, n), do: t && typeof t === 'object' ? txt(t.do) : '' });
      }
      mo.states.push(s);
    });
    for (const g of guardNames(mo)) mo.guards[g] = !(o.guards && o.guards[g] === false);
    mo.events = uniq((Array.isArray(o.events) ? o.events.map(String).filter(e => !idProblem(e)) : []).concat(knownEvents(mo)));
    const okKey = k => { const [a, b] = String(k).split(' '); return names.includes(a) && mo.events.includes(b); };
    mo.ignored = Array.isArray(o.ignored) ? uniq(o.ignored.map(String).filter(okKey)) : [];
    if (o.ignoreRest) mo.ignored = uniq(mo.ignored.concat(undecided(mo)));
    return mo;
  }

  /* the problems of a design, in plain words: [{ level: 'err' | 'warn' | 'info', text }] */
  function phrase(r) {
    let m;
    if ((m = /^the start state "(.*)" is not defined$/.exec(r))) return { level: 'err', text: 'The start state ' + m[1] + ' does not exist.' };
    if ((m = /^"(.*)" goes to "(.*)", which is not a state$/.exec(r))) return { level: 'err', text: m[1] + ' goes to ' + m[2] + ', which is not a state (deleted, or misspelt?). The program leaves that transition out.' };
    if ((m = /^nothing leads to "(.*)"$/.exec(r))) return { level: 'warn', text: 'Nothing leads to ' + m[1] + ': the machine can never get there.' };
    if ((m = /^"(.*)" has no way out/.exec(r))) return { level: 'warn', text: m[1] + ' has no way out: right for a final state, a trap anywhere else.' };
    return { level: 'warn', text: String(r).charAt(0).toUpperCase() + String(r).slice(1) + '.' };
  }
  function problems(mo) {
    let raw;
    try { raw = E.fsmCheck(toDef(mo)); } catch (e) { raw = ['the machine could not be checked (' + e.message + ')']; }
    const out = uniq(raw).map(phrase);
    for (const s of mo.states) {
      const free = new Set();
      for (const t of s.on) {
        if (free.has(t.ev)) out.push({ level: 'warn', text: 'In ' + s.name + ', the ' + t.ev + ' that goes to ' + t.to + ' can never be taken: an earlier ' + t.ev + ' there has no guard, so it always wins.' });
        else if (!t.if) free.add(t.ev);
      }
      if (s.after.length > 1) {
        const ms = s.after.map(a => a.ms).sort((a, b) => a - b);
        for (const x of ms.slice(1)) out.push({ level: 'warn', text: 'In ' + s.name + ', the timeout after ' + fmtMs(x) + ' never fires: the one after ' + fmtMs(ms[0]) + ' leaves first.' });
      }
    }
    for (const ev of knownEvents(mo)) if (!mo.states.some(s => s.on.some(t => t.ev === ev))) out.push({ level: 'warn', text: 'No state handles ' + ev + ': sending it never does anything. Give it a transition, or remove it in the table.' });
    const und = undecided(mo).length;
    if (und) out.push({ level: 'info', text: und + ' state/event pair' + (und > 1 ? 's are' : ' is') + ' not decided yet: open the table and say, for each, whether the event is handled there or ignored on purpose.' });
    return out;
  }

  /* the model -> a drawing for Hyper.esym.fsm, with transitions between the same two states merged into one arrow:
     -> { def, index: Map('FROM>TO' -> transition index), rw, rh } */
  function diagramOf(mo) {
    const longest = Math.max(4, ...mo.states.map(s => s.name.length));
    const rw = clamp(longest * 4.3 + 12, 40, 84), rh = 25, maxNote = Math.max(4, Math.floor((2 * rw - 10) / 5.2));
    const states = mo.states.map(s => ({ id: s.name, label: s.name, note: short(s.entry, maxNote), x: s.x, y: s.y }));
    const edges = [], index = new Map();
    const add = (from, to, label) => {
      const k = from + '>' + to;
      let i = index.get(k);
      if (i == null) { i = edges.length; index.set(k, i); edges.push({ from, to, labels: [] }); }
      if (!edges[i].labels.includes(label)) edges[i].labels.push(label);
    };
    for (const s of mo.states) {
      for (const t of s.on) add(s.name, t.to || s.name, t.ev + (t.if ? ' [' + t.if + ']' : ''));
      for (const a of s.after.slice().sort((x, y) => x.ms - y.ms)) add(s.name, a.to || s.name, 'after ' + fmtMs(a.ms));
    }
    return { def: { states, transitions: edges.map(e => ({ from: e.from, to: e.to, label: e.labels.join(' · ') })), start: mo.start }, index, rw, rh };
  }
  /* an arrow that would cross another state is bent around it */
  function bendAround(D, box) {
    const { rw, rh } = D, pos = {};
    for (const s of D.def.states) pos[s.id] = [box.x + rw + s.x * (box.w - 2 * rw), box.y + rh + s.y * (box.h - 2 * rh)];
    const tr = D.def.transitions;
    const blocked = (t, bend) => {
      const p = pos[t.from], q = pos[t.to];
      const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy) || 1, m = [(p[0] + q[0]) / 2 - dy / len * bend, (p[1] + q[1]) / 2 + dx / len * bend];
      for (let k = 2; k <= 18; k++) {
        const f = k / 20, u = 1 - f, x = u * u * p[0] + 2 * u * f * m[0] + f * f * q[0], y = u * u * p[1] + 2 * u * f * m[1] + f * f * q[1];
        for (const s of D.def.states) {
          if (s.id === t.from || s.id === t.to) continue;
          const c = pos[s.id];
          if (Math.abs(x - c[0]) < rw + 6 && Math.abs(y - c[1]) < rh + 6) return true;
        }
      }
      return false;
    };
    for (const t of tr) {
      if (t.from === t.to || !pos[t.from] || !pos[t.to]) continue;
      const twin = tr.some(u => u.from === t.to && u.to === t.from);
      const tries = twin ? [22, 70, 120, 170] : [0, 70, -70, 120, -120, 180, -180];
      if (!blocked(t, tries[0])) continue;
      const ok = tries.slice(1).find(b => !blocked(t, b));
      if (ok != null) t.bend = ok;
    }
    return pos;
  }

  /* ================================================================ the examples */
  const EXAMPLES = [
    { id: 'traffic', title: 'Traffic light', teaches: 'timeouts alone',
      about: 'Four states and four timeouts, and no events at all: the light changes because time passes. The British sequence shows that a state is not a lamp — RED_AMBER is a state of its own, with its own duration. Change a duration in the editor and watch the cycle follow; Step jumps from one change to the next.',
      start: 'RED',
      states: {
        RED: { entry: 'only red on', after: { 5000: 'RED_AMBER' } },
        RED_AMBER: { entry: 'red and amber on', after: { 1500: 'GREEN' } },
        GREEN: { entry: 'only green on', after: { 5000: 'AMBER' } },
        AMBER: { entry: 'only amber on', after: { 2000: 'RED' } } },
      layout: { RED: [0.06, 0.1], RED_AMBER: [0.94, 0.1], GREEN: [0.94, 0.9], AMBER: [0.06, 0.9] } },
    { id: 'button', title: 'Push button: debounce, click and long press', teaches: 'events and timeouts together',
      about: 'A push button chatters for a few milliseconds when it closes. DEBOUNCE waits 30 ms: an UP inside that time was a bounce and is thrown away. Once the press is trusted, letting go within 0.7 s is a click; holding on longer is a long press. Pause the clock and press DOWN then UP: no time has passed, so it counts as a bounce.',
      start: 'IDLE',
      states: {
        IDLE: { on: { DOWN: 'DEBOUNCE' } },
        DEBOUNCE: { on: { UP: 'IDLE' }, after: { 30: 'PRESSED' } },
        PRESSED: { on: { UP: { to: 'IDLE', do: 'click!' } }, after: { 700: 'LONG_PRESS' } },
        LONG_PRESS: { entry: 'long-press action', on: { UP: 'IDLE' } } },
      layout: { IDLE: [0.04, 0.5], DEBOUNCE: [0.5, 0.06], PRESSED: [0.96, 0.5], LONG_PRESS: [0.5, 0.94] } },
    { id: 'lock', title: 'Door lock with a keypad', teaches: 'guards and an alarm state',
      about: 'The same event can lead to different places. A wrong code while tries are left only beeps; the next one locks the keypad out for 30 s. Guards are the questions asked at that moment — are tries left? is the door closed? — and here you answer them with the tick boxes. Opening the door while LOCKED is a forced entry and goes straight to ALARM, which only the right code leaves.',
      start: 'LOCKED',
      states: {
        LOCKED: { entry: 'bolt out, red LED', on: { CODE_OK: 'UNLOCKED', CODE_BAD: [{ to: 'LOCKED', if: 'triesLeft', do: 'beep, count the try' }, { to: 'LOCKOUT' }], DOOR_OPENED: 'ALARM' } },
        UNLOCKED: { entry: 'bolt in, green LED', on: { LOCK_BUTTON: [{ to: 'LOCKED', if: 'doorClosed', do: 'reset the try count' }, { to: 'UNLOCKED', do: 'beep: close the door first' }] } },
        LOCKOUT: { entry: 'keypad off', on: { DOOR_OPENED: 'ALARM' }, after: { 30000: { to: 'LOCKED', do: 'reset the try count' } } },
        ALARM: { entry: 'siren on, send an alert', exit: 'siren off', on: { CODE_OK: 'UNLOCKED' } } },
      guards: { triesLeft: true, doorClosed: true },
      layout: { LOCKED: [0.06, 0.38], UNLOCKED: [0.94, 0.12], LOCKOUT: [0.06, 0.96], ALARM: [0.94, 0.86] } },
    { id: 'garage', title: 'Garage door', teaches: 'limit switches, an obstruction, a safety stop',
      about: 'One button does everything, and the state decides what it means: open when closed, close when open, stop while moving. The limit switches end each movement, and the exit action stops the motor whatever ended it. The light beam (OBSTACLE) reverses a closing door. A movement that lasts too long means a limit switch has failed: the timeout turns that into a FAULT that only RESET clears, instead of a motor that runs for ever.',
      start: 'CLOSED',
      states: {
        CLOSED: { entry: 'lamp off', on: { BUTTON: 'OPENING' } },
        OPENING: { entry: 'motor up, lamp on', exit: 'motor off', on: { TOP_LIMIT: 'OPEN', BUTTON: 'STOPPED' }, after: { 20000: 'FAULT' } },
        OPEN: { entry: 'lamp off', on: { BUTTON: 'CLOSING' } },
        CLOSING: { entry: 'motor down, lamp on', exit: 'motor off', on: { BOTTOM_LIMIT: 'CLOSED', BUTTON: 'STOPPED', OBSTACLE: { to: 'OPENING', do: 'beep' } }, after: { 20000: 'FAULT' } },
        STOPPED: { on: { BUTTON: 'OPENING' } },
        FAULT: { entry: 'lamp blinks', on: { RESET: 'STOPPED' } } },
      layout: { CLOSED: [0, 0.16], OPENING: [0.5, 0], OPEN: [1, 0.16], CLOSING: [0.5, 0.56], STOPPED: [0, 0.96], FAULT: [1, 0.96] } },
    { id: 'washer', title: 'Washing machine cycle', teaches: 'a sequence with an error state',
      about: 'A programme is a chain of timed states, each starting its own motor or valve. Two steps wait for a sensor instead of the clock — the water level and the empty drum — and each has a time limit: no water after 30 s means a closed tap, no draining means a blocked pump, and both lead to ERROR instead of waiting for ever. The times are shortened so that a whole cycle can be watched.',
      start: 'IDLE',
      states: {
        IDLE: { entry: 'door unlocked', on: { START: [{ to: 'FILL', if: 'doorClosed', do: 'lock the door' }, { to: 'IDLE', do: 'beep: close the door' }] } },
        FILL: { entry: 'water valve open', exit: 'water valve shut', on: { LEVEL_OK: 'WASH' }, after: { 30000: 'ERROR' } },
        WASH: { entry: 'drum turns both ways', after: { 20000: 'DRAIN' } },
        DRAIN: { entry: 'pump on', exit: 'pump off', on: { EMPTY: 'SPIN' }, after: { 30000: 'ERROR' } },
        SPIN: { entry: 'drum spins fast', after: { 10000: 'DONE' } },
        DONE: { entry: 'beep, unlock the door', on: { DOOR_OPENED: 'IDLE' } },
        ERROR: { entry: 'all off, show the code', on: { RESET: { to: 'IDLE', do: 'pump the water out' } } } },
      guards: { doorClosed: true },
      layout: { IDLE: [0, 0.14], FILL: [0.33, 0.14], WASH: [0.67, 0.14], DRAIN: [1, 0.14], SPIN: [1, 0.94], DONE: [0, 0.94], ERROR: [0.5, 0.6] } },
    { id: 'wifi', title: 'Wi-Fi and MQTT connection manager', teaches: 'retries and back-off, the pattern every connected device needs',
      about: 'Connections drop, so a connected device is never simply “connected”: it is somewhere on this chain, and every loss moves it back to the right place instead of restarting the board. A failed attempt waits in BACKOFF before the next one — a real program doubles that wait each time, up to a limit, so that a hundred devices do not hammer a router that has just come back. While Wi-Fi is up, the broker is tried again every 5 s by re-entering WIFI_UP.',
      start: 'DISCONNECTED',
      states: {
        DISCONNECTED: { entry: 'LED off', after: { 500: 'CONNECTING' } },
        CONNECTING: { entry: 'start Wi-Fi, LED blinks', on: { WIFI_OK: 'WIFI_UP' }, after: { 15000: { to: 'BACKOFF', do: 'stop trying' } } },
        BACKOFF: { entry: 'Wi-Fi off, wait longer', after: { 5000: 'CONNECTING' } },
        WIFI_UP: { entry: 'connect to the broker', on: { MQTT_OK: 'MQTT_UP', WIFI_LOST: 'CONNECTING' }, after: { 5000: 'WIFI_UP' } },
        MQTT_UP: { entry: 'subscribe, say online', on: { MQTT_LOST: 'WIFI_UP', WIFI_LOST: 'CONNECTING' } } },
      layout: { DISCONNECTED: [0, 0.18], CONNECTING: [0.44, 0.18], WIFI_UP: [1, 0.18], MQTT_UP: [1, 0.9], BACKOFF: [0.44, 0.9] } },
    { id: 'node', title: 'Battery sensor node', teaches: 'a duty cycle with give-up timeouts',
      about: 'A node on a battery spends nearly all its life asleep, and every round must end in SLEEP whatever happens. A sensor that does not answer and a network that does not take the reading both have a give-up timeout, because a node that waits for ever empties its battery in a day. On a real ESP32, deep sleep restarts the program, so SLEEP → WAKE is a reset: anything to remember (a count, an unsent reading) is kept in RTC memory.',
      start: 'WAKE',
      states: {
        WAKE: { entry: 'power the sensor', after: { 100: 'MEASURE' } },
        MEASURE: { entry: 'start a reading', on: { READING_OK: [{ to: 'SEND', if: 'batteryOk' }, { to: 'SLEEP', do: 'battery low: keep it for later' }] }, after: { 2000: { to: 'SLEEP', do: 'sensor did not answer' } } },
        SEND: { entry: 'Wi-Fi on, send', exit: 'Wi-Fi off', on: { SENT: 'SLEEP' }, after: { 10000: { to: 'SLEEP', do: 'give up until next time' } } },
        SLEEP: { entry: 'deep sleep 10 min', on: { TIMER: 'WAKE' } } },
      guards: { batteryOk: true },
      layout: { WAKE: [0.05, 0.1], MEASURE: [0.95, 0.1], SEND: [0.95, 0.9], SLEEP: [0.05, 0.9] } },
    { id: 'thermostat', title: 'Thermostat with hysteresis', teaches: 'hysteresis, a minimum off time, a fault state',
      about: 'The input code turns the temperature into two events with a gap between them: TOO_COLD below the set point minus half a degree, WARM_ENOUGH above it plus half a degree — that gap is the hysteresis that keeps the relay from chattering. COOLDOWN is a minimum off time: TOO_COLD is ignored there on purpose, which protects the boiler from short cycles. A failed sensor in any state means FAULT with the heater off, and heating for too long counts as a fault too.',
      start: 'IDLE',
      states: {
        IDLE: { entry: 'heater off', on: { TOO_COLD: 'HEATING', SENSOR_FAIL: 'FAULT' } },
        HEATING: { entry: 'heater on', exit: 'heater off', on: { WARM_ENOUGH: 'COOLDOWN', SENSOR_FAIL: 'FAULT' }, after: { 60000: 'FAULT' } },
        COOLDOWN: { entry: 'start the off time', on: { SENSOR_FAIL: 'FAULT' }, after: { 30000: 'IDLE' } },
        FAULT: { entry: 'alarm LED on', exit: 'alarm LED off', on: { SENSOR_OK: 'IDLE' } } },
      layout: { IDLE: [0.05, 0.1], HEATING: [0.95, 0.1], COOLDOWN: [0.5, 0.96], FAULT: [0.5, 0.48] } }
  ];
  EXAMPLES.forEach(x => { x.ignoreRest = true; });
  const NEW_MACHINE = { title: 'My machine', start: 'IDLE', states: { IDLE: { on: { START: 'RUNNING' } }, RUNNING: { entry: 'LED on', exit: 'LED off', on: { STOP: 'IDLE' } } }, layout: { IDLE: [0.2, 0.5], RUNNING: [0.8, 0.5] } };

  /* ================================================================ the program, three ways
     The same structure in all three: an entry action per state, an exit action per state, handle(event) that lets the
     current state decide, a timeout check on every pass of the loop, and events from the reader's own input code. */
  const cstr = s => '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  function plan(mo) {
    const names = mo.states.map(s => s.name), evs = knownEvents(mo);
    const per = mo.states.map(s => {
      const groups = [];
      for (const ev of evs) {
        const opts = [];
        for (const t of s.on) if (t.ev === ev) { opts.push(t); if (!t.if) break; }      // after an unguarded option nothing more is reachable
        if (opts.length) groups.push({ ev, opts });
      }
      const first = s.after.slice().sort((a, b) => a.ms - b.ms)[0] || null;          // only the shortest timeout can fire
      return { s, groups, first, more: s.after.length > 1, ign: evs.filter(ev => !s.on.some(t => t.ev === ev)) };
    });
    return { names, isState: n => names.includes(n), evs, guards: guardNames(mo), per, anyTimeout: mo.states.some(s => s.after.length),
      entries: mo.states.filter(s => s.entry), exits: mo.states.filter(s => s.exit), title: mo.title || 'State machine' };
  }

  function genCpp(mo) {
    const P = plan(mo), L = [], st = n => 'ST_' + n, ev = n => 'EV_' + n;
    const hasEv = P.evs.length > 0, hasG = P.guards.length > 0;
    const take = (ind, t, why) => {
      if (!P.isState(t.to)) return [ind + '// it would go to ' + t.to + ', which is not a state'];
      if (!t.do) return [ind + 'go(' + st(t.to) + ', ' + cstr(why) + ');'];
      return [ind + 'onExit(state);', ind + 'action(' + cstr(t.do) + ');   // ACTION', ind + 'enter(' + st(t.to) + ', ' + cstr(why) + ');'];
    };
    L.push('// ' + P.title + ' - a state machine from the state machine lab of Hyper ESP32.');
    L.push('// It runs as it is: open the serial monitor at 115200 baud and watch the states change.');
    if (hasEv) L.push('// Type an event name (' + P.evs.slice(0, 3).join(', ') + (P.evs.length > 3 ? ', ...' : '') + ') and press Enter to send it.');
    if (hasG) L.push('// Set a guard the same way: ' + P.guards[0] + '=0 or ' + P.guards[0] + '=1.');
    L.push('// Then replace each line marked ACTION with the real work' + (hasEv ? ', and feed real events in readInputs().' : '.'));
    L.push('');
    L.push('enum State { ' + P.names.map(st).join(', ') + ' };');
    L.push('const char *const STATE_NAMES[] = { ' + P.names.map(n => '"' + n + '"').join(', ') + ' };');
    if (hasEv) {
      L.push('');
      L.push('enum Event { ' + P.evs.map(ev).join(', ') + ' };');
      L.push('const char *const EVENT_NAMES[] = { ' + P.evs.map(n => '"' + n + '"').join(', ') + ' };');
      L.push('const int EVENT_COUNT = ' + P.evs.length + ';');
    }
    L.push('');
    L.push('State state = ' + st(mo.start) + ';');
    L.push('uint32_t enteredAt = 0;              // millis() when the current state was entered');
    L.push('');
    L.push('// An action prints what it would do, until you write the real work in its place.');
    L.push('void action(const char *what) {');
    L.push('  Serial.printf("         do: %s\\n", what);');
    L.push('}');
    if (hasG) {
      L.push('');
      L.push('// Guards: the questions a transition asks. Each answers from a variable you can set in the serial monitor.');
      for (const g of P.guards) {
        L.push('bool ' + g + 'Now = ' + (mo.guards[g] !== false) + ';');
        L.push('bool ' + g + '() {');
        L.push('  return ' + g + 'Now;   // GUARD: replace with the real test, e.g. digitalRead(PIN) == LOW');
        L.push('}');
      }
    }
    const actions = (fn, list, key, none) => {
      L.push('');
      L.push('void ' + fn + '(State s) {');
      if (!list.length) L.push('  (void)s;                           // ' + none);
      else {
        L.push('  switch (s) {');
        for (const s of list) { L.push('    case ' + st(s.name) + ':'); L.push('      action(' + cstr(s[key]) + ');   // ACTION'); L.push('      break;'); }
        L.push('    default:');
        L.push('      break;');
        L.push('  }');
      }
      L.push('}');
    };
    actions('onEntry', P.entries, 'entry', 'no state has an entry action yet');
    actions('onExit', P.exits, 'exit', 'no state has an exit action yet');
    L.push('');
    L.push('// Arrive in a state: say so, note the time, run its entry action.');
    L.push('void enter(State next, const char *why) {');
    L.push('  Serial.printf("%7lu ms  %s -> %s  (%s)\\n", (unsigned long)millis(), STATE_NAMES[state], STATE_NAMES[next], why);');
    L.push('  state = next;');
    L.push('  enteredAt = millis();');
    L.push('  onEntry(state);');
    L.push('}');
    L.push('');
    L.push('void go(State next, const char *why) {');
    L.push('  onExit(state);');
    L.push('  enter(next, why);');
    L.push('}');
    if (hasEv) {
      L.push('');
      L.push('// An event arrives: the current state decides what it means. Returns false when it is ignored.');
      L.push('bool handle(Event ev) {');
      L.push('  switch (state) {');
      for (const p of P.per) {
        if (!p.groups.length) continue;
        L.push('    case ' + st(p.s.name) + ':');
        for (const g of p.groups) for (const t of g.opts) {
          if (!P.isState(t.to)) { L.push('      // ' + g.ev + ' would go to ' + t.to + ', which is not a state'); continue; }
          const cond = 'ev == ' + ev(g.ev) + (t.if ? ' && ' + t.if + '()' : '');
          if (!t.do) L.push('      if (' + cond + ') { go(' + st(t.to) + ', ' + cstr(g.ev) + '); return true; }');
          else { L.push('      if (' + cond + ') {'); L.push(...take('        ', t, g.ev)); L.push('        return true;'); L.push('      }'); }
        }
        L.push('      break;' + (p.ign.length ? '                            // ignored here: ' + p.ign.join(', ') : ''));
      }
      L.push('    default:');
      L.push('      break;');
      L.push('  }');
      L.push('  Serial.printf("         %s ignored in %s\\n", EVENT_NAMES[ev], STATE_NAMES[state]);');
      L.push('  return false;');
      L.push('}');
    }
    if (P.anyTimeout) {
      L.push('');
      L.push('// Timed states: checked on every pass of loop(), so nothing waits. At most one timeout fires per call.');
      L.push('void checkTimeouts() {');
      L.push('  uint32_t held = millis() - enteredAt;');
      L.push('  switch (state) {');
      for (const p of P.per) {
        if (!p.first) continue;
        const a = p.first, why = 'after ' + a.ms + ' ms';
        L.push('    case ' + st(p.s.name) + ':' + (p.more ? '                      // its longer timeouts can never fire' : ''));
        if (!P.isState(a.to)) L.push('      // after ' + a.ms + ' ms it would go to ' + a.to + ', which is not a state');
        else if (!a.do) L.push('      if (held >= ' + a.ms + 'UL) go(' + st(a.to) + ', ' + cstr(why) + ');');
        else { L.push('      if (held >= ' + a.ms + 'UL) {'); L.push(...take('        ', a, why)); L.push('      }'); }
        L.push('      break;');
      }
      L.push('    default:');
      L.push('      break;');
      L.push('  }');
      L.push('}');
    }
    if (hasEv) {
      L.push('');
      L.push('// Events typed in the serial monitor, to test the machine without any hardware.');
      L.push('void readSerial() {');
      L.push('  if (!Serial.available()) return;');
      L.push('  String line = Serial.readStringUntil(\'\\n\');');
      L.push('  line.trim();');
      L.push('  if (line.length() == 0) return;');
      L.push('  for (int i = 0; i < EVENT_COUNT; i++) {');
      L.push('    if (line == EVENT_NAMES[i]) {');
      L.push('      handle((Event)i);');
      L.push('      return;');
      L.push('    }');
      L.push('  }');
      for (const g of P.guards) {
        L.push('  if (line == "' + g + '=1") { ' + g + 'Now = true; return; }');
        L.push('  if (line == "' + g + '=0") { ' + g + 'Now = false; return; }');
      }
      L.push('  Serial.printf("unknown: %s\\n", line.c_str());');
      L.push('}');
      L.push('');
      L.push('// Your own inputs: read buttons and sensors here, without delay(), and call handle() when something happens.');
      L.push('void readInputs() {');
      L.push('  // INPUT: for example   if (buttonPressed()) handle(' + ev(P.evs[0]) + ');');
      L.push('}');
    }
    L.push('');
    L.push('void setup() {');
    L.push('  Serial.begin(115200);');
    if (hasEv) L.push('  Serial.setTimeout(50);              // readStringUntil() waits at most 50 ms');
    L.push('  Serial.println(' + cstr(P.title + (hasEv ? ': type an event name and press Enter' : '')) + ');');
    L.push('  Serial.printf("start in %s\\n", STATE_NAMES[state]);');
    L.push('  enteredAt = millis();');
    L.push('  onEntry(state);');
    L.push('}');
    L.push('');
    L.push('void loop() {');
    if (hasEv) { L.push('  readSerial();                       // events typed in the serial monitor'); L.push('  readInputs();                       // events from your buttons and sensors'); }
    if (P.anyTimeout) L.push('  checkTimeouts();                    // timed states');
    if (!hasEv && !P.anyTimeout) L.push('  // nothing moves this machine yet: give it an event or a timeout');
    L.push('}');
    return L.join('\n') + '\n';
  }

  function genPy(mo) {
    const P = plan(mo), L = [];
    const hasEv = P.evs.length > 0, hasG = P.guards.length > 0;
    const tuple = xs => '(' + xs.map(n => '"' + n + '"').join(', ') + (xs.length === 1 ? ',' : '') + ')';
    const take = (ind, t, why) => {
      if (!P.isState(t.to)) return [ind + '# it would go to ' + t.to + ', which is not a state'];
      if (!t.do) return [ind + 'go(' + t.to + ', ' + cstr(why) + ')'];
      return [ind + 'on_exit(state)', ind + 'action(' + cstr(t.do) + ')   # ACTION', ind + 'enter(' + t.to + ', ' + cstr(why) + ')'];
    };
    const blank2 = () => { L.push(''); L.push(''); };
    L.push('# ' + P.title + ' - a state machine from the state machine lab of Hyper ESP32.');
    L.push('# It runs as it is (save it as main.py): watch the states change in the REPL.');
    if (hasEv) L.push('# Type an event name (' + P.evs.slice(0, 3).join(', ') + (P.evs.length > 3 ? ', ...' : '') + ') and press Enter to send it.');
    if (hasG) L.push('# Set a guard the same way: ' + P.guards[0] + '=0 or ' + P.guards[0] + '=1.');
    L.push('# Then replace each line marked ACTION with the real work' + (hasEv ? ', and feed real events in read_inputs().' : '.'));
    if (hasEv) { L.push('import select'); L.push('import sys'); }
    L.push('import time');
    L.push('');
    P.names.forEach((n, i) => L.push(n + ' = ' + i));
    L.push('STATE_NAMES = ' + tuple(P.names));
    if (hasEv) L.push('EVENTS = ' + tuple(P.evs));
    L.push('');
    L.push('state = ' + mo.start);
    L.push('entered = time.ticks_ms()   # when the current state was entered');
    blank2();
    L.push('def action(what):');
    L.push('    # An action prints what it would do, until you write the real work in its place.');
    L.push('    print("         do:", what)');
    if (hasG) {
      blank2();
      L.push('# Guards: the questions a transition asks. Each answers from a value you can set in the REPL.');
      L.push('flags = {' + P.guards.map(g => '"' + g + '": ' + (mo.guards[g] !== false ? 'True' : 'False')).join(', ') + '}');
      for (const g of P.guards) {
        blank2();
        L.push('def ' + g + '():');
        L.push('    return flags["' + g + '"]   # GUARD: replace with the real test, e.g. door.value() == 0');
      }
    }
    const actions = (fn, list, key, none) => {
      blank2();
      L.push('def ' + fn + '(s):');
      if (!list.length) L.push('    pass   # ' + none);
      list.forEach((s, i) => { L.push('    ' + (i ? 'elif' : 'if') + ' s == ' + s.name + ':'); L.push('        action(' + cstr(s[key]) + ')   # ACTION'); });
    };
    actions('on_entry', P.entries, 'entry', 'no state has an entry action yet');
    actions('on_exit', P.exits, 'exit', 'no state has an exit action yet');
    blank2();
    L.push('def enter(new_state, why):');
    L.push('    # Arrive in a state: say so, note the time, run its entry action.');
    L.push('    global state, entered');
    L.push('    print("%7d ms  %s -> %s  (%s)" % (time.ticks_ms(), STATE_NAMES[state], STATE_NAMES[new_state], why))');
    L.push('    state = new_state');
    L.push('    entered = time.ticks_ms()');
    L.push('    on_entry(state)');
    blank2();
    L.push('def go(new_state, why):');
    L.push('    on_exit(state)');
    L.push('    enter(new_state, why)');
    // one if/elif branch per state that has something to do; a branch with nothing but comments gets a pass
    const branches = (items, body) => {
      let first = true;
      for (const p of items) {
        const lines = body(p);
        if (!lines) continue;
        L.push('    ' + (first ? 'if' : 'elif') + ' state == ' + p.s.name + ':');
        if (!lines.some(l => !/^\s*#/.test(l))) lines.push('        pass');
        L.push(...lines);
        first = false;
      }
    };
    if (hasEv) {
      blank2();
      L.push('def handle(event):');
      L.push('    # An event arrives: the current state decides what it means. Returns False when it is ignored.');
      branches(P.per, p => {
        if (!p.groups.length) return null;
        const out = [];
        for (const g of p.groups) for (const t of g.opts) {
          if (!P.isState(t.to)) { out.push('        # ' + g.ev + ' would go to ' + t.to + ', which is not a state'); continue; }
          out.push('        if event == "' + g.ev + '"' + (t.if ? ' and ' + t.if + '()' : '') + ':');
          out.push(...take('            ', t, g.ev));
          out.push('            return True');
        }
        if (p.ign.length) out.push('        # ignored here: ' + p.ign.join(', '));
        return out;
      });
      L.push('    print("        ", event, "ignored in", STATE_NAMES[state])');
      L.push('    return False');
    }
    if (P.anyTimeout) {
      blank2();
      L.push('def check_timeouts():');
      L.push('    # Timed states: checked on every pass of the loop, so nothing waits. At most one timeout fires per call.');
      L.push('    held = time.ticks_diff(time.ticks_ms(), entered)');
      branches(P.per, p => {
        if (!p.first) return null;
        const a = p.first, why = 'after ' + a.ms + ' ms';
        if (!P.isState(a.to)) return ['        # after ' + a.ms + ' ms it would go to ' + a.to + ', which is not a state'];
        return (p.more ? ['        # its longer timeouts can never fire'] : []).concat(['        if held >= ' + a.ms + ':'], take('            ', a, why));
      });
    }
    if (hasEv) {
      blank2();
      L.push('poller = select.poll()');
      L.push('poller.register(sys.stdin, select.POLLIN)');
      L.push('typed = ""');
      blank2();
      L.push('def read_console():');
      L.push('    # Events typed in the REPL, to test the machine without any hardware.');
      L.push('    global typed');
      L.push('    while poller.poll(0):');
      L.push('        ch = sys.stdin.read(1)');
      L.push('        if ch not in "\\r\\n":');
      L.push('            typed += ch');
      L.push('            continue');
      L.push('        word, typed = typed.strip(), ""');
      L.push('        if word in EVENTS:');
      L.push('            handle(word)');
      if (hasG) {
        L.push('        elif word[-2:] in ("=0", "=1") and word[:-2] in flags:');
        L.push('            flags[word[:-2]] = word[-1] == "1"');
      }
      L.push('        elif word:');
      L.push('            print("unknown:", word)');
      blank2();
      L.push('def read_inputs():');
      L.push('    # INPUT: read buttons and sensors here, without long sleeps, and call handle("' + P.evs[0] + '") when something happens.');
      L.push('    pass');
    }
    blank2();
    L.push('print(' + cstr(P.title + (hasEv ? ': type an event name and press Enter' : '')) + ')');
    L.push('print("start in", STATE_NAMES[state])');
    L.push('on_entry(state)');
    L.push('while True:');
    if (hasEv) { L.push('    read_console()     # events typed in the REPL'); L.push('    read_inputs()      # events from your buttons and sensors'); }
    if (P.anyTimeout) L.push('    check_timeouts()   # timed states');
    L.push(hasEv || P.anyTimeout ? '    time.sleep_ms(5)' : '    time.sleep_ms(100)   # nothing moves this machine yet: give it an event or a timeout');
    return L.join('\n') + '\n';
  }

  function genBlocks(mo) {
    const P = plan(mo), L = [];
    const act = t => 'do [' + String(t).replace(/[\[\]]/g, '').replace(/\/\//g, '/').replace(/\s+v$/, ' V') + '] :: my';
    const body = (ind, t) => { if (t.do) L.push(ind + act(t.do)); L.push(ind + (P.isState(t.to) ? 'go to state [' + t.to + ' v]' : '// ' + t.to + ' is not a state')); };
    L.push('// ' + P.title.replace(/\/\//g, '/'));
    L.push('when started');
    L.push('  start serial at (115200) baud');
    L.push('  go to state [' + mo.start + ' v]');
    for (const s of P.entries) { L.push(''); L.push('when entering state [' + s.name + ' v]'); L.push('  ' + act(s.entry)); }
    for (const s of P.exits) { L.push(''); L.push('when leaving state [' + s.name + ' v]'); L.push('  ' + act(s.exit)); }
    for (const p of P.per) for (const g of p.groups) {
      L.push('');
      L.push('when event [' + g.ev + ' v] in state [' + p.s.name + ' v]');
      if (g.opts.length === 1 && !g.opts[0].if) body('  ', g.opts[0]);
      else {
        g.opts.forEach((t, i) => { L.push('  ' + (t.if ? (i ? 'else if' : 'if') + ' <' + t.if + '> then' : 'else')); body('    ', t); });
        L.push('  end');
      }
    }
    for (const p of P.per) if (p.first) {
      L.push('');
      L.push('when (' + +(p.first.ms / 1000).toFixed(3) + ') seconds in state [' + p.s.name + ' v]');
      body('  ', p.first);
    }
    if (P.evs.length) {
      L.push('');
      L.push('when button [A v] pressed           // your own input: raise the events like this');
      L.push('  raise event [' + P.evs[0] + ' v]');
    }
    return L.join('\n') + '\n';
  }
  const genCode = mo => ({ blocks: genBlocks(mo), cpp: genCpp(mo), py: genPy(mo) });

  /* what the serial monitor shows in the first minute when nothing is sent: the timeouts alone */
  function sampleOutput(mo) {
    const P = plan(mo), lines = [P.title + (P.evs.length ? ': type an event name and press Enter' : ''), 'start in ' + mo.start];
    const s0 = stateOf(mo, mo.start);
    if (s0 && s0.entry) lines.push('         do: ' + s0.entry);
    let m = null, more = false;
    try {
      m = E.fsm(toDef(mo), { guards: guardFns(mo), onChange: (from, to, why, actions) => {
        if (lines.length >= 16) { more = true; return; }
        const A = actions.slice(), a = stateOf(mo, from), b = stateOf(mo, to);
        const ex = a && a.exit ? A.shift() : null, en = b && b.entry ? A.pop() : null;
        if (ex) lines.push('         do: ' + ex);
        if (A.length) lines.push('         do: ' + A[0]);
        lines.push(String(Math.round(m.now)).padStart(7) + ' ms  ' + from + ' -> ' + to + '  (' + why + ')');
        if (en) lines.push('         do: ' + en);
      } });
      for (let i = 0; i < 240 && !more && m.now < 60000; i++) m.tick(250);
    } catch (e) { /* a broken design prints only its start */ }
    return lines.slice(0, 16).join('\n') + (more ? '\n…' : '');
  }

  /* ================================================================ the lab's state: kept while the app is open
     mo: the design; m: the running machine (Hyper.esp.fsm); log: what happened; fx: the transition just taken (for
     the flash); note: a message on the canvas; undo / redo: earlier designs as JSON; tsel: the open cell of the table */
  const lab = { mo: null, sel: null, m: null, log: [], playing: true, speed: 1, fx: null, note: null, undo: [], redo: [], tsel: null, logDirty: true, evDirty: true, saved: null };

  function save() { try { localStorage.setItem(KEY, JSON.stringify(exportObj(lab.mo))); lab.saved = true; } catch (e) { lab.saved = false; } }
  function ensure() {
    if (lab.mo) return;
    let mo = null;
    try { const raw = localStorage.getItem(KEY); if (raw) mo = fromObj(JSON.parse(raw)); } catch (e) { mo = null; }
    lab.mo = mo || fromObj(EXAMPLES[0]);
    lab.sel = lab.mo.start;
    restart();
  }
  const logPush = row => { lab.log.push(row); if (lab.log.length > 300) lab.log.splice(0, lab.log.length - 300); lab.logDirty = true; };
  /* the engine reports a transition: split its actions into exit / on the way / entry, log it, flash the arrow */
  function onFire(from, to, why, actions) {
    const mo = lab.mo, A = actions.slice(), a = stateOf(mo, from), b = stateOf(mo, to), acts = [];
    const ex = a && a.exit ? A.shift() : null, en = b && b.entry ? A.pop() : null;
    if (ex) acts.push(['exit', ex]);
    if (A.length) acts.push(['on the way', A[0]]);
    if (en) acts.push(['entry', en]);
    logPush({ t: lab.m ? lab.m.now : 0, from, to, why: prettyWhy(why), acts });
    lab.fx = { key: from + '>' + to, t0: now() };
    lab.evDirty = true;
  }
  const newMachine = mo => E.fsm(toDef(mo), { guards: guardFns(mo), onChange: onFire });
  /* start again from the start state */
  function restart() {
    lab.m = newMachine(lab.mo);
    lab.log = []; lab.fx = null; lab.note = null;
    const s = stateOf(lab.mo, lab.mo.start);
    logPush({ t: 0, from: '', to: lab.mo.start, why: 'start', acts: s && s.entry ? [['entry', s.entry]] : [] });
    lab.evDirty = true;
  }
  /* the design changed: a new machine, still in the same state and at the same time when that state still exists */
  function rebuild() {
    const old = lab.m;
    lab.m = newMachine(lab.mo);
    if (old && stateOf(lab.mo, old.state)) { lab.m.state = old.state; lab.m.since = old.since; lab.m.now = old.now; }
    else { const was = old ? old.state : ''; restart(); if (was) logPush({ t: 0, kind: 'note', text: 'The state ' + was + ' is gone, so the machine starts again.' }); }
    lab.evDirty = true;
  }
  /* change the design: fn mutates lab.mo and returns an error text to refuse; an undo step is kept when something changed */
  function change(fn) {
    const before = JSON.stringify(lab.mo);
    const err = fn();
    if (err) { if (JSON.stringify(lab.mo) !== before) { lab.mo = JSON.parse(before); rebuild(); } return err; }
    if (JSON.stringify(lab.mo) !== before) { lab.undo.push(before); if (lab.undo.length > 80) lab.undo.shift(); lab.redo = []; save(); rebuild(); }
    return '';
  }
  function undoRedo(back) {
    const from = back ? lab.undo : lab.redo, to = back ? lab.redo : lab.undo;
    if (!from.length) return false;
    to.push(JSON.stringify(lab.mo));
    lab.mo = JSON.parse(from.pop());
    if (!stateOf(lab.mo, lab.sel)) lab.sel = lab.mo.start;
    save(); rebuild();
    return true;
  }
  /* send an event; when nothing happens, say why */
  function sendEvent(ev) {
    const m = lab.m, from = m.state, s = stateOf(lab.mo, from), opts = s ? s.on.filter(t => t.ev === ev) : [], n = m.log.length;
    if (m.send(ev)) return true;
    const err = m.log.length > n ? m.log[m.log.length - 1].error : null;
    const text = err ? 'not taken: it leads to a state that does not exist'
      : !opts.length ? 'ignored: ' + from + ' does not handle it'
      : 'not taken: ' + uniq(opts.map(t => t.if)).map(g => g + ' is false').join(', ');
    logPush({ t: m.now, kind: 'ign', state: from, why: ev, text });
    lab.note = { text: ev + ' ' + text, t0: now(), warn: true };
    return false;
  }
  const nextTimeout = () => { const s = lab.m && stateOf(lab.mo, lab.m.state); return s && s.after.length ? s.after.slice().sort((a, b) => a.ms - b.ms)[0] : null; };
  /* advance the machine's clock; a timeout that leads nowhere is reported, and the engine's own log is kept short */
  function tickLab(ms) {
    const m = lab.m, n = m.log.length;
    m.tick(ms);
    for (const r of m.log.slice(n)) if (r.error) {
      logPush({ t: m.now, kind: 'note', text: 'A timeout of ' + m.state + ' leads to a state that does not exist (' + r.error + '): the machine stays where it is.' });
      lab.note = { text: 'the timeout of ' + m.state + ' leads nowhere', t0: now(), warn: true };
    }
    if (m.log.length > 400) m.log.splice(0, m.log.length - 100);
  }

  /* model operations shared by the design and the table: each returns an error text, or '' */
  function addState(mo, name) {
    let n = String(name || '').trim();
    if (!n) { let k = 1; while (stateOf(mo, 'STATE_' + k)) k++; n = 'STATE_' + k; }
    const p = stateNameProblem(mo, n);
    if (p) return p;
    if (mo.states.length >= 40) return 'Forty states is the limit here: a machine that big wants splitting into smaller ones.';
    // a free spot: the point of a coarse grid farthest from every state
    let best = [0.5, 0.5], bestD = -1;
    for (let gx = 0; gx <= 6; gx++) for (let gy = 0; gy <= 4; gy++) {
      const x = gx / 6, y = gy / 4, d = Math.min(9, ...mo.states.map(s => Math.hypot((s.x - x) * 1.6, s.y - y)));
      if (d > bestD + 1e-9) { bestD = d; best = [x, y]; }
    }
    mo.states.push({ name: n, entry: '', exit: '', on: [], after: [], x: best[0], y: best[1] });
    lab.sel = n;
    return '';
  }
  function renameState(mo, from, to) {
    if (from === to) return '';
    const p = stateNameProblem(mo, to, from);
    if (p) return p;
    for (const s of mo.states) {
      if (s.name === from) s.name = to;
      for (const t of s.on) if (t.to === from) t.to = to;
      for (const a of s.after) if (a.to === from) a.to = to;
    }
    if (mo.start === from) mo.start = to;
    mo.ignored = mo.ignored.map(k => { const i = k.indexOf(' '); return k.slice(0, i) === from ? to + k.slice(i) : k; });
    if (lab.sel === from) lab.sel = to;
    if (lab.tsel && lab.tsel.startsWith(from + ' ')) lab.tsel = to + lab.tsel.slice(from.length);
    if (lab.m && lab.m.state === from) lab.m.state = to;
    return '';
  }
  function deleteState(mo, name) {
    if (mo.states.length < 2) return 'A machine needs at least one state.';
    const i = mo.states.findIndex(s => s.name === name);
    if (i < 0) return '';
    mo.states.splice(i, 1);
    if (mo.start === name) mo.start = mo.states[0].name;
    mo.ignored = mo.ignored.filter(k => k.slice(0, k.indexOf(' ')) !== name);
    if (lab.sel === name) lab.sel = (mo.states[i] || mo.states[i - 1]).name;
    return '';
  }
  function addEvent(mo, name) {
    const n = String(name || '').trim(), p = idProblem(n);
    if (p) return p;
    if (knownEvents(mo).includes(n)) return 'The machine already knows ' + n + '.';
    mo.events = knownEvents(mo).concat([n]);
    return '';
  }
  function deleteEvent(mo, ev) {
    for (const s of mo.states) s.on = s.on.filter(t => t.ev !== ev);
    mo.events = knownEvents(mo).filter(e => e !== ev);
    mo.ignored = mo.ignored.filter(k => k.slice(k.indexOf(' ') + 1) !== ev);
    return '';
  }
  const unignore = (mo, st, ev) => { mo.ignored = mo.ignored.filter(k => k !== st + ' ' + ev); };
  const otherState = (mo, s) => (mo.states.find(x => x.name !== s.name) || s).name;
  function addTransition(mo, s, ev) {
    const evs = knownEvents(mo);
    let e = ev || evs.find(x => !s.on.some(t => t.ev === x));
    if (!e) { let k = 1; while (evs.includes('EVENT_' + k)) k++; e = 'EVENT_' + k; }
    s.on.push({ ev: e, to: otherState(mo, s), if: '', do: '' });
    if (!mo.events.includes(e)) mo.events.push(e);
    unignore(mo, s.name, e);
    return '';
  }
  function addTimeout(mo, s) {
    const ms = s.after.length ? Math.max(...s.after.map(a => a.ms)) + 1000 : 1000;
    if (ms > 86400000) return 'A timeout is a day at most.';
    s.after.push({ ms, to: otherState(mo, s), do: '' });
    return '';
  }
  function setGuard(mo, t, v) {
    v = String(v || '').trim();
    if (v) { const p = guardNameProblem(mo, v); if (p) return p; if (!(v in mo.guards)) mo.guards[v] = true; }
    t.if = v;
    return '';
  }
  function setTimeoutMs(s, a, v) {
    const n = Math.round(+v);
    if (!(n >= 10 && n <= 86400000)) return 'A timeout is a whole number of milliseconds, from 10 ms to 86 400 000 ms (a day).';
    if (s.after.some(x => x !== a && x.ms === n)) return s.name + ' already has a timeout after ' + fmtMs(n) + '.';
    a.ms = n;
    return '';
  }
  function setEventName(mo, s, t, v) {
    v = String(v || '').trim();
    const p = idProblem(v);
    if (p) return p;
    const old = t.ev;
    t.ev = v;
    if (!mo.events.includes(v)) mo.events.push(v);
    unignore(mo, s.name, v);
    // a renamed event that nothing uses any more is dropped, rather than left behind as a ghost
    if (old !== v && !mo.states.some(x => x.on.some(u => u.ev === old))) { mo.events = mo.events.filter(e => e !== old); mo.ignored = mo.ignored.filter(k => k.slice(k.indexOf(' ') + 1) !== old); }
    return '';
  }

  /* ================================================================ design: the workbench */
  function design(body) {
    const kit = K();
    body.innerHTML =
      '<p class="muted" style="margin:0 0 10px">Design a state machine, run it, break it and take it away as a program. The diagram lights the state the machine is in and flashes each transition as it is taken; drag a state to arrange the drawing and click one to edit it on the right. Press the events, answer the guards, let the clock run the timeouts — and read in the log what happened, and why.</p>' +
      '<div class="toolbar fsmtop"><input class="inp fsmtitle" maxlength="60" title="The name of the machine" spellcheck="false">' +
        '<button class="btn sm" data-a="undo" title="Undo the last change">↶ Undo</button><button class="btn sm" data-a="redo" title="Redo">↷ Redo</button>' +
        '<button class="btn sm" data-a="new" title="Start a new machine; Undo brings this one back">New machine</button>' +
        '<a class="btn sm ghost" href="#/tools/fsmlab/examples">Load an example</a><a class="btn sm ghost" href="#/tools/fsmlab/table">See it as a table</a><span class="small faint fsmsaved"></span></div>' +
      '<div class="fsmgrid"><div class="fsmmain">' +
        '<div class="fsmrun"><div class="fsmrc"></div><div class="fsmsp"></div><div class="fsmnow"><div class="fsmro"></div><div class="fsmprog" title="Time left before the timeout fires"><i></i></div></div></div>' +
        '<div class="stage fsmstage"></div>' +
        '<div class="fsmio"><div class="fsmevs"></div><div class="fsmgds"></div></div>' +
        '<div class="fsmlog"></div>' +
      '</div><div class="fsmside">' +
        '<div class="boxy"><h3>States <span class="small muted fsmcount" style="font-weight:400"></span></h3><div class="fsmsts"></div>' +
          '<div class="row" style="gap:6px;margin-top:8px"><input class="inp fsmnew" placeholder="NEW_STATE" maxlength="32" spellcheck="false" style="flex:1;height:30px;min-width:0"><button class="btn sm" data-a="addst">Add a state</button></div><p class="fsmerr fsmerr1"></p></div>' +
        '<div class="boxy fsmedit"></div>' +
        '<div class="boxy fsmprob"></div>' +
      '</div></div>' +
      '<div class="fsmcode" style="margin-top:14px"></div>' +
      '<details class="deriv fsmxp"><summary>Export and import</summary><div class="dbody">' +
        '<p class="small muted" style="margin:0 0 6px">The design as text (JSON): copy it to keep it or to share it; paste one here and press Import to load it. Positions, guard settings and the decisions of the table travel with it.</p>' +
        '<textarea class="espidea fsmjson" spellcheck="false" aria-label="The design as JSON"></textarea>' +
        '<div class="btnrow" style="margin-top:6px"><button class="btn sm" data-a="export">Show the current design</button><button class="btn sm pri" data-a="import">Import</button><button class="btn sm ghost" data-a="copyjson">Copy</button></div>' +
        '<p class="small fsmxmsg" style="margin:6px 0 0"></p></div></details>' +
      T.util.more(MORE);
    const q = s => body.querySelector(s);
    const titleEl = q('.fsmtitle'), savedEl = q('.fsmsaved'), stageEl = q('.fsmstage'), evEl = q('.fsmevs'), gdEl = q('.fsmgds'), logEl = q('.fsmlog'),
      stsEl = q('.fsmsts'), countEl = q('.fsmcount'), newEl = q('.fsmnew'), err1 = q('.fsmerr1'), edEl = q('.fsmedit'), prEl = q('.fsmprob'), codeEl = q('.fsmcode'),
      jsonEl = q('.fsmjson'), xmsg = q('.fsmxmsg'), progI = q('.fsmprog i');

    /* ---- run controls */
    const runCtl = kit.controls(q('.fsmrc'), [{ type: 'buttons', items: [{ id: 'play', label: lab.playing ? '❚❚ Pause' : '▶ Play', primary: true }, { id: 'step', label: '⏭ Step' }, { id: 'reset', label: '↺ Reset' }] }], onRun);
    kit.controls(q('.fsmsp'), [{ id: 'speed', type: 'select', label: 'Clock speed', options: SPEEDS, value: lab.speed }], onRun);
    const ro = kit.readout(q('.fsmro'), [['state', 'State'], ['held', 'In it for'], ['next', 'Next timeout'], ['clock', 'Clock']]);
    const playLabel = () => { const b = runCtl.rows.play; if (b) b.textContent = lab.playing ? '❚❚ Pause' : '▶ Play'; };
    function onRun(id, v) {
      if (id === 'play') { lab.playing = !lab.playing; playLabel(); }
      else if (id === 'step') {
        lab.playing = false; playLabel();
        const nx = nextTimeout();
        if (nx) tickLab(Math.max(0, nx.ms - lab.m.inState()));
        else lab.note = { text: 'No timeout in ' + lab.m.state + ': Step has nothing to wait for', t0: now() };
      }
      else if (id === 'reset') restart();
      else if (id === 'speed') lab.speed = +v || 1;
      kick();
    }

    /* ---- the stage */
    const st = kit.stage(stageEl, { aspect: 0.6, minH: 340, maxH: 560 });
    let D = null, box = null, diag = null;
    const busy = () => !!((lab.fx && now() - lab.fx.t0 < FX_MS) || (lab.note && now() - lab.note.t0 < NOTE_MS));
    const loop = kit.loop(dt => {
      if (lab.playing && dt > 0) tickLab(dt * 1000 * lab.speed);
      draw(); panel();
      if (lab.evDirty) { lab.evDirty = false; markEvents(); drawStates(); }
      if (lab.logDirty) drawLog();
      if (!lab.playing && !busy()) loop.stop();
    }, stageEl);
    const kick = () => { if (lab.playing || busy()) loop.start(); else loop.once(); };
    function draw() {
      const c = st.begin(), col = ui.colors(), W = st.W, Hh = st.H, t = now();
      D = diagramOf(lab.mo);
      box = { x: 30, y: 48, w: Math.max(160, W - 60), h: Math.max(140, Hh - 80) };
      bendAround(D, box);
      let fired, pulse;
      if (lab.fx && t - lab.fx.t0 < FX_MS && D.index.has(lab.fx.key)) { fired = D.index.get(lab.fx.key); pulse = (t - lab.fx.t0) / FX_MS; }
      diag = S().fsm(c, D.def, { box, active: lab.m.state, fired, pulse, rw: D.rw, rh: D.rh });
      const ps = diag.pos[lab.sel];
      if (ps) { c.save(); c.setLineDash([4, 3]); c.strokeStyle = col.accent; c.lineWidth = 1.4; rr(c, ps[0] - D.rw - 5, ps[1] - D.rh - 5, 2 * D.rw + 10, 2 * D.rh + 10, D.rh + 5); c.stroke(); c.restore(); }
      const pa = diag.pos[lab.m.state], nx = nextTimeout();
      if (pa && nx) {     // the time left in a timed state, as a bar that drains under it
        const f = clamp(1 - lab.m.inState() / nx.ms, 0, 1), bw = 2 * D.rw - 16, bx = pa[0] - bw / 2, by = pa[1] + D.rh + 6;
        c.save(); rr(c, bx, by, bw, 4, 2); c.fillStyle = col.border2 || col.border; c.fill();
        if (f > 0.002) { rr(c, bx, by, bw * f, 4, 2); c.fillStyle = col.accent; c.fill(); }
        c.restore();
      }
      if (lab.note && t - lab.note.t0 < NOTE_MS) S().text(c, lab.note.text, W / 2, Hh - 14, { size: 12, weight: 600, color: lab.note.warn ? col.warn : col.text2, bg: col.dark ? 'rgba(13,16,32,.9)' : 'rgba(255,255,255,.94)' });
      else S().text(c, 'drag a state to move it · click it to edit it', W - 10, Hh - 12, { align: 'right', size: 10.5, color: col.faint });
    }
    function panel() {
      const m = lab.m, nx = nextTimeout(), left = nx ? Math.max(0, nx.ms - m.inState()) : 0, s = stateOf(lab.mo, m.state);
      ro.set('state', m.state);
      ro.set('held', fmtClock(m.inState()));
      ro.set('next', nx ? nx.to + ' in ' + fmtClock(left) : s && s.on.length ? 'none: it waits for an event' : 'none: nothing leaves this state');
      ro.set('clock', fmtClock(m.now) + (lab.playing ? ' · running ×' + lab.speed : ' · paused'));
      if (progI && progI.style) progI.style.width = (nx ? clamp(left / nx.ms, 0, 1) * 100 : 0).toFixed(1) + '%';
      const sb = runCtl.rows.step;
      if (sb) sb.disabled = !nx;
    }
    let dragBefore = null;
    kit.drag(st, {
      hit: p => diag ? diag.hit(p.x, p.y) : null,
      start: id => {
        dragBefore = JSON.stringify(lab.mo);
        if (lab.sel !== id) {
          const a = typeof document !== 'undefined' ? document.activeElement : null;
          if (a && a.blur && edEl.contains && edEl.contains(a)) a.blur();          // commit a half-typed field first
          lab.sel = id; drawStates(); drawEditor();
        }
      },
      move: (id, p) => {
        const s = stateOf(lab.mo, id);
        if (!s || !box || !D) return;
        s.x = clamp((p.x - box.x - D.rw) / Math.max(1, box.w - 2 * D.rw), 0, 1);
        s.y = clamp((p.y - box.y - D.rh) / Math.max(1, box.h - 2 * D.rh), 0, 1);
        loop.once();
      },
      end: (id, p, moved) => {
        if (moved && dragBefore && dragBefore !== JSON.stringify(lab.mo)) { lab.undo.push(dragBefore); if (lab.undo.length > 80) lab.undo.shift(); lab.redo = []; save(); undoState(); }
        dragBefore = null; loop.once();
      },
      hover: true
    });
    T.util.onTheme(() => loop.once());
    st.onResize(() => loop.once());

    /* ---- events and guards */
    let evCtl = null, evKey = null, gdKey = null;
    function buildEvents() {
      const evs = knownEvents(lab.mo), k = evs.join(' ');
      if (k === evKey) return;
      evKey = k; evCtl = null;
      if (!evs.length) { evEl.innerHTML = '<div class="fsmlbl">Events</div><p class="small muted" style="margin:0">This machine has no events: it runs on its timeouts alone. Add a transition on an event, on the right, to give it one.</p>'; return; }
      evEl.innerHTML = '<div class="fsmlbl">Events <span class="faint">— lit: handled in the current state; dim: ignored there (press one to see)</span></div>';
      const b = ui.el('<div class="fsmevb"></div>');
      evEl.appendChild(b);
      evCtl = kit.controls(b, [{ type: 'buttons', items: evs.map(e => ({ id: 'ev:' + e, label: e })) }], id => { if (String(id).startsWith('ev:')) { sendEvent(String(id).slice(3)); kick(); } });
      markEvents();
    }
    function markEvents() {
      if (!evCtl) return;
      const s = stateOf(lab.mo, lab.m.state), h = new Set(s ? s.on.map(t => t.ev) : []);
      for (const e of knownEvents(lab.mo)) {
        const b = evCtl.rows['ev:' + e];
        if (!b || !b.classList) continue;
        b.classList.toggle('pri', h.has(e)); b.classList.toggle('fsmoff', !h.has(e));
        b.title = h.has(e) ? lab.m.state + ' handles ' + e : lab.m.state + ' ignores ' + e;
      }
    }
    function buildGuards(force) {
      const gs = guardNames(lab.mo), k = gs.join(' ');
      if (k === gdKey && !force) return;
      gdKey = k; gdEl.innerHTML = '';
      if (!gs.length) return;
      gdEl.innerHTML = '<div class="fsmlbl">Guards <span class="faint">— tick when the answer is yes</span></div>';
      const b = ui.el('<div class="fsmgdb"></div>');
      gdEl.appendChild(b);
      kit.controls(b, gs.map(g => ({ id: 'g:' + g, type: 'check', label: g + '?', value: lab.mo.guards[g] !== false })), (id, v) => {
        const g = String(id).slice(2);
        if (!guardNames(lab.mo).includes(g)) return;
        lab.mo.guards[g] = !!v; save(); codeLater(); kick();
      });
    }

    /* ---- the editor */
    function drawStates() {
      const mo = lab.mo, n = (k, w) => k ? k + ' ' + w + (k > 1 ? 's' : '') : '';
      countEl.textContent = String(mo.states.length);
      stsEl.innerHTML = mo.states.map(s => '<div class="fsmst' + (s.name === lab.sel ? ' sel' : '') + '" data-st="' + esc(s.name) + '" role="button" tabindex="0" title="Edit ' + esc(s.name) + '">' +
        '<i class="fsmdot' + (lab.m && s.name === lab.m.state ? ' on' : '') + '" title="' + (lab.m && s.name === lab.m.state ? 'the machine is here' : '') + '"></i><b>' + esc(s.name) + '</b>' + (s.name === mo.start ? '<span class="esptag">start</span>' : '') +
        '<span class="fsmsp2"></span><span class="small muted">' + [n(s.on.length, 'transition'), n(s.after.length, 'timeout')].filter(Boolean).join(', ') + '</span></div>').join('');
    }
    function drawEditor() {
      const mo = lab.mo, s = stateOf(mo, lab.sel) || mo.states[0];
      lab.sel = s.name;
      const names = mo.states.map(x => x.name), isStart = s.name === mo.start;
      const opts = v => (names.includes(v) ? '' : '<option value="' + esc(v) + '" selected>' + esc(v) + ' (not a state)</option>') +
        names.map(n => '<option value="' + esc(n) + '"' + (n === v ? ' selected' : '') + '>' + esc(n) + (n === s.name ? ' (itself)' : '') + '</option>').join('');
      edEl.innerHTML = '<h3>' + esc(s.name) + (isStart ? ' <span class="esptag">start</span>' : '') + '</h3>' +
        '<label class="fsmf">Name<input data-f="name" value="' + esc(s.name) + '" maxlength="32" spellcheck="false"></label>' +
        '<div class="btnrow" style="margin:6px 0 4px"><button class="btn sm" data-a="start"' + (isStart ? ' disabled' : '') + '>' + (isStart ? 'It is the start state' : 'Make it the start state') + '</button>' +
          '<button class="btn sm ghost" data-a="delst"' + (mo.states.length < 2 ? ' disabled' : '') + '>Delete it</button></div>' +
        '<label class="fsmf">Entry action <span class="faint">— done on arriving</span><input data-f="entry" value="' + esc(s.entry) + '" maxlength="80" placeholder="for example: green LED on"></label>' +
        '<label class="fsmf">Exit action <span class="faint">— done on leaving</span><input data-f="exit" value="' + esc(s.exit) + '" maxlength="80" placeholder="for example: motor off"></label>' +
        '<h4 class="fsmh4">On events <span class="faint">event → where it goes; guard / action</span></h4>' +
        (s.on.length ? s.on.map((t, i) => '<div class="fsmtr">' +
          '<input data-f="on.' + i + '.ev" value="' + esc(t.ev) + '" list="fsm-evl" placeholder="EVENT" maxlength="32" spellcheck="false" title="The event">' +
          '<span class="ar">→</span><select data-f="on.' + i + '.to" title="Where it goes">' + opts(t.to) + '</select>' +
          '<button class="fsmx" data-a="deltr" data-i="' + i + '" title="Remove this transition" aria-label="Remove this transition">×</button>' +
          '<input data-f="on.' + i + '.if" value="' + esc(t.if) + '" list="fsm-gdl" placeholder="guard, if any" maxlength="32" spellcheck="false" title="Taken only when this guard is true">' +
          '<span class="ar">/</span><input data-f="on.' + i + '.do" value="' + esc(t.do) + '" placeholder="action on the way, if any" maxlength="80" title="Done between leaving and arriving">' +
          '</div>').join('') : '<p class="small muted fsmnone">None: no event moves this state.</p>') +
        '<button class="btn sm ghost" data-a="addtr">+ A transition on an event</button>' +
        '<h4 class="fsmh4">Timeouts <span class="faint">after so long here → where it goes</span></h4>' +
        (s.after.length ? s.after.map((a, i) => '<div class="fsmtr">' +
          '<label class="fsmms"><span>after</span><input type="number" data-f="after.' + i + '.ms" value="' + a.ms + '" min="10" max="86400000" step="10" title="Milliseconds in the state"><span>ms</span></label>' +
          '<span class="ar">→</span><select data-f="after.' + i + '.to" title="Where it goes">' + opts(a.to) + '</select>' +
          '<button class="fsmx" data-a="delto" data-i="' + i + '" title="Remove this timeout" aria-label="Remove this timeout">×</button>' +
          '<span></span><span class="ar">/</span><input data-f="after.' + i + '.do" value="' + esc(a.do) + '" placeholder="action on the way, if any" maxlength="80">' +
          '</div>').join('') : '<p class="small muted fsmnone">None: time alone never moves this state.</p>') +
        '<button class="btn sm ghost" data-a="addto">+ A timeout</button>' +
        '<p class="fsmerr fsmerr2"></p>' +
        '<datalist id="fsm-evl">' + knownEvents(mo).map(e => '<option value="' + esc(e) + '"></option>').join('') + '</datalist>' +
        '<datalist id="fsm-gdl">' + guardNames(mo).map(g => '<option value="' + esc(g) + '"></option>').join('') + '</datalist>';
    }
    /* redraw the editor after the event that caused it has finished (a Tab press moves the focus first), keeping the focus */
    function drawEditorKeep() {
      const a = typeof document !== 'undefined' ? document.activeElement : null, f = a && a.dataset && edEl.contains && edEl.contains(a) ? a.dataset.f : null;
      drawEditor();
      if (f) { const b = edEl.querySelector('[data-f="' + f + '"]'); if (b && b.focus) b.focus(); }
    }
    const fieldValue = (s, f) => {
      const p = f.split('.');
      if (p.length === 1) return f === 'name' ? s.name : s[f] || '';
      const t = (p[0] === 'on' ? s.on : s.after)[+p[1]];
      return t ? String(t[p[2]] == null ? '' : t[p[2]]) : '';
    };
    edEl.addEventListener('change', e => {
      const el = e.target, f = el && el.dataset ? el.dataset.f : null;
      if (!f) return;
      const s = stateOf(lab.mo, lab.sel);
      if (!s) return;
      const v = el.value, was = fieldValue(s, f), p = f.split('.');
      const err = change(() => {
        const mo = lab.mo;
        if (f === 'name') return renameState(mo, s.name, String(v).trim());
        if (f === 'entry' || f === 'exit') { s[f] = txt(v); return ''; }
        const t = (p[0] === 'on' ? s.on : s.after)[+p[1]];
        if (!t) return '';
        if (p[0] === 'on' && p[2] === 'ev') return setEventName(mo, s, t, v);
        if (p[0] === 'on' && p[2] === 'if') return setGuard(mo, t, v);
        if (p[0] === 'after' && p[2] === 'ms') return setTimeoutMs(s, t, v);
        if (p[2] === 'to') { t.to = String(v); return ''; }
        if (p[2] === 'do') { t.do = txt(v); return ''; }
        return '';
      });
      const e2 = edEl.querySelector('.fsmerr2');
      if (e2) e2.textContent = err;
      if (err) { el.value = was; return; }
      const s2 = stateOf(lab.mo, lab.sel);
      if (s2 && f !== 'name') el.value = fieldValue(s2, f);
      refresh(f === 'name');
    });

    /* ---- problems, log, program */
    function drawProblems() {
      const ps = problems(lab.mo), icon = { err: '✗', warn: '!', info: 'i' };
      prEl.innerHTML = '<h3>Problems' + (ps.length ? ' <span class="small muted" style="font-weight:400">' + ps.length + '</span>' : '') + '</h3>' +
        (ps.length ? '<ul class="fsmprobs">' + ps.map(p => '<li class="' + p.level + '"><b>' + icon[p.level] + '</b><span>' + esc(p.text) + '</span></li>').join('') + '</ul>'
          : '<p class="small fsmok" style="margin:0">✓ None found: every state can be reached and has a way out, and every transition can be taken.</p>');
    }
    function drawLog() {
      lab.logDirty = false;
      const rows = lab.log.slice(-80).reverse();
      logEl.innerHTML = '<div class="fsmlogh"><b>Log</b><span class="small muted">newest first · times on the machine\'s clock</span><span class="fsmsp2"></span><button class="btn sm ghost" data-a="clearlog">Clear</button></div>' +
        '<div class="fsmlogt"><table class="optable"><thead><tr><th>Time</th><th>From → to</th><th>Cause</th><th>Actions run</th></tr></thead><tbody>' +
        rows.map(r => r.kind === 'note' ? '<tr class="ign"><td class="num">' + fmtClock(r.t) + '</td><td colspan="3">' + esc(r.text) + '</td></tr>'
          : r.kind === 'ign' ? '<tr class="ign"><td class="num">' + fmtClock(r.t) + '</td><td>stays in ' + esc(r.state) + '</td><td>' + esc(r.why) + '</td><td>' + esc(r.text) + '</td></tr>'
          : '<tr><td class="num">' + fmtClock(r.t) + '</td><td>' + (r.from ? esc(r.from) + ' → ' : '→ ') + '<b>' + esc(r.to) + '</b></td><td>' + esc(r.why) + '</td><td>' +
            (r.acts.length ? r.acts.map(a => '<span class="fsmk">' + a[0] + '</span> ' + esc(a[1])).join('<br>') : '<span class="faint">none</span>') + '</td></tr>').join('') +
        '</tbody></table></div>';
    }
    let codeT = 0, codeKey = '';
    function drawCode() {
      const mo = lab.mo, G = genCode(mo), out = sampleOutput(mo), k = mo.title + '\u0000' + G.blocks + G.cpp + G.py + out;
      if (k === codeKey) return;
      codeKey = k;
      T.util.code(codeEl, { title: String(mo.title || 'The machine').replace(/[`$*\[\]\\]/g, '') + ' as a program',
        about: 'Generated from the design above, and it runs as it is: the serial monitor shows every transition and every action, and typing an event name sends that event. Replace each line marked `ACTION` with the real work — switch a pin, start a reading — and call `handle()` from your own input code. Nothing in it waits: timeouts compare times on every pass of the loop, with `millis()` in C++ and `ticks_diff()` in MicroPython.',
        blocks: G.blocks, cpp: G.cpp, py: G.py, output: out,
        notes: ['On every transition: the exit action of the old state, then the action on the way, then the entry action of the new one — the order of the log above.',
          'A transition back to the same state leaves it and enters it again: its exit and entry actions run and its timeout starts over.',
          'The blocks follow this app\'s state-machine blocks; block tools such as UIFlow name theirs differently.'] });
    }
    const codeLater = () => { clearTimeout(codeT); codeT = setTimeout(drawCode, 250); };

    /* ---- after a change */
    const undoState = () => { const u = q('[data-a="undo"]'), r = q('[data-a="redo"]'); if (u) u.disabled = !lab.undo.length; if (r) r.disabled = !lab.redo.length; };
    const savedState = () => { savedEl.textContent = lab.saved === false ? 'Not saved: this browser keeps nothing for this page' : 'Saved in this browser as you work'; };
    function refresh(structural) {
      buildEvents(); buildGuards(); markEvents(); drawStates();
      if (structural) setTimeout(drawEditorKeep, 0);
      drawProblems(); codeLater(); undoState(); savedState(); kick();
    }
    function refreshAll() {
      titleEl.value = lab.mo.title; evKey = null;
      buildEvents(); buildGuards(true); markEvents(); drawStates(); drawEditor(); drawProblems(); drawCode(); drawLog(); undoState(); savedState(); playLabel(); kick();
    }
    function addFromInput() {
      const err = change(() => addState(lab.mo, newEl.value));
      err1.textContent = err;
      if (!err) { newEl.value = ''; refresh(true); }
    }
    function doImport() {
      let o, mo;
      try { o = JSON.parse(jsonEl.value); } catch (e) { xmsg.innerHTML = '<span class="fsmbad">This is not JSON (' + esc(e.message) + '): look for a missing comma, quote or bracket.</span>'; return; }
      try { mo = fromObj(o); } catch (e) { xmsg.innerHTML = '<span class="fsmbad">This JSON is not a machine the lab can load: ' + esc(e.message) + '.</span>'; return; }
      change(() => { lab.mo = mo; lab.sel = mo.start; lab.tsel = null; return ''; });
      restart(); refreshAll();
      xmsg.innerHTML = '<span class="fsmok">Imported “' + esc(mo.title) + '”: ' + mo.states.length + ' states, ' + knownEvents(mo).length + ' events. Undo brings the previous design back.</span>';
    }

    body.addEventListener('click', e => {
      const t = e.target;
      if (!t || !t.closest) return;
      const row = t.closest('.fsmst');
      if (row && row.dataset.st != null) { lab.sel = row.dataset.st; drawStates(); drawEditor(); kick(); return; }
      const b = t.closest('[data-a]');
      if (!b) return;
      const a = b.dataset.a, s = stateOf(lab.mo, lab.sel);
      if (a === 'undo' || a === 'redo') { if (undoRedo(a === 'undo')) refreshAll(); return; }
      if (a === 'new') { change(() => { lab.mo = fromObj(NEW_MACHINE); lab.sel = lab.mo.start; lab.tsel = null; return ''; }); restart(); refreshAll(); return; }
      if (a === 'addst') { addFromInput(); return; }
      if (a === 'clearlog') { lab.log = []; logPush({ t: lab.m.now, kind: 'note', text: 'Log cleared; the machine is in ' + lab.m.state + '.' }); drawLog(); return; }
      if (a === 'export') { jsonEl.value = JSON.stringify(exportObj(lab.mo), null, 2); xmsg.textContent = ''; return; }
      if (a === 'import') { doImport(); return; }
      if (a === 'copyjson') {
        const text = jsonEl.value || JSON.stringify(exportObj(lab.mo), null, 2), done = ok => { if (ui.toast) ui.toast(ok ? 'Copied the design' : 'Select the text and copy it with Ctrl+C'); };
        try { navigator.clipboard.writeText(text).then(() => done(true), () => done(false)); } catch (err) { done(false); }
        return;
      }
      if (!s) return;
      let err = '';
      if (a === 'start') err = change(() => { lab.mo.start = s.name; return ''; });
      else if (a === 'delst') err = change(() => deleteState(lab.mo, s.name));
      else if (a === 'addtr') err = change(() => addTransition(lab.mo, s));
      else if (a === 'deltr') err = change(() => { s.on.splice(+b.dataset.i, 1); return ''; });
      else if (a === 'addto') err = change(() => addTimeout(lab.mo, s));
      else if (a === 'delto') err = change(() => { s.after.splice(+b.dataset.i, 1); return ''; });
      else return;
      const e2 = edEl.querySelector('.fsmerr2');
      if (err && e2) { e2.textContent = err; return; }
      refresh(true);
    });
    body.addEventListener('keydown', e => {
      const t = e.target;
      if (!t || !t.classList) return;
      if (e.key === 'Enter' && t.classList.contains('fsmnew')) { e.preventDefault(); addFromInput(); }
      else if ((e.key === 'Enter' || e.key === ' ') && t.classList.contains('fsmst')) { e.preventDefault(); lab.sel = t.dataset.st; drawStates(); drawEditor(); kick(); }
      else if (e.key === 'Enter' && t.tagName === 'INPUT' && (t.dataset.f || t.classList.contains('fsmtitle'))) t.blur();
    });
    titleEl.addEventListener('change', () => {
      change(() => { lab.mo.title = txt(titleEl.value) || 'My machine'; return ''; });
      titleEl.value = lab.mo.title; codeLater(); undoState(); savedState();
    });

    save();
    jsonEl.value = JSON.stringify(exportObj(lab.mo), null, 2);
    refreshAll();
  }

  /* ================================================================ table: the same machine as a state-transition table */
  function table(body) {
    body.innerHTML =
      '<p class="muted" style="margin:0 0 10px">The same machine as a state-transition table: one row per state, one column per event. A cell says where that event leads from that state, with the guard in [brackets] and the action after a slash; the last column holds the timeouts. Click a cell to change it — the diagram and the program follow. A cell marked <b class="fsmq">?</b> is not decided yet: handle the event there, or tick “ignored on purpose”. Every pair should be a decision, not an accident.</p>' +
      '<div class="toolbar"><input class="inp fsmnewev" placeholder="NEW_EVENT" maxlength="32" spellcheck="false" style="width:170px"><button class="btn sm" data-a="addev">Add an event column</button>' +
        '<input class="inp fsmnewst" placeholder="NEW_STATE" maxlength="32" spellcheck="false" style="width:170px"><button class="btn sm" data-a="addst">Add a state row</button>' +
        '<button class="btn sm" data-a="undo">↶ Undo</button><a class="btn sm ghost" href="#/tools/fsmlab/design">Run it in the workbench</a></div>' +
      '<p class="fsmerr fsmterr" style="margin:-6px 0 8px"></p><div class="fsmtab"></div><div class="small fsmtsum" style="margin-top:8px"></div>' + T.util.more(MORE);
    const q = s => body.querySelector(s);
    const tabEl = q('.fsmtab'), sumEl = q('.fsmtsum'), errEl = q('.fsmterr'), newEv = q('.fsmnewev'), newSt = q('.fsmnewst');
    const AFTER = '@after';
    const cellOf = k => { const i = String(k).indexOf(' '); return { s: stateOf(lab.mo, k.slice(0, i)), ev: k.slice(i + 1) }; };
    function render() {
      const mo = lab.mo, evs = knownEvents(mo), names = mo.states.map(s => s.name), ign = new Set(mo.ignored);
      const tgt = (v, self) => (names.includes(v) ? '' : '<option value="' + esc(v) + '" selected>' + esc(v) + ' (not a state)</option>') + names.map(n => '<option value="' + esc(n) + '"' + (n === v ? ' selected' : '') + '>' + esc(n) + (n === self ? ' (itself)' : '') + '</option>').join('');
      const shown = t => '→ ' + (names.includes(t.to) ? '<b>' + esc(t.to) + '</b>' : '<b class="fsmbad" title="not a state">' + esc(t.to) + '?</b>') + (t.if ? ' <span class="fsmg">[' + esc(t.if) + ']</span>' : '') + (t.do ? ' <span class="muted">/ ' + esc(t.do) + '</span>' : '');
      let h = '<div class="tablewrap" style="margin:0"><table class="optable fsmt"><thead><tr><th>State</th>' +
        evs.map(e => '<th>' + esc(e) + ' <button class="fsmx" data-a="delev" data-ev="' + esc(e) + '" title="Remove ' + esc(e) + ' and every transition on it" aria-label="Remove ' + esc(e) + '">×</button></th>').join('') + '<th>Timeout</th></tr></thead><tbody>';
      for (const s of mo.states) {
        h += '<tr><th class="fsmrowh">' + (s.name === mo.start ? '<span class="fsmstart" title="the start state">▸</span>' : '') + '<a href="#/tools/fsmlab/design" data-go="' + esc(s.name) + '" title="Edit it in the workbench">' + esc(s.name) + '</a>' +
          (s.entry ? '<div class="small muted">entry: ' + esc(s.entry) + '</div>' : '') + (s.exit ? '<div class="small muted">exit: ' + esc(s.exit) + '</div>' : '') + '</th>';
        for (const e of evs) {
          const key = s.name + ' ' + e, opts = s.on.map((t, i) => [t, i]).filter(x => x[0].ev === e);
          if (lab.tsel === key) {
            h += '<td class="fsmc on" data-k="' + esc(key) + '">' +
              (opts.length ? opts.map(([t, i]) => '<div class="fsmcrow"><select data-t="to" data-i="' + i + '" title="Where it goes">' + tgt(t.to, s.name) + '</select>' +
                '<input data-t="if" data-i="' + i + '" value="' + esc(t.if) + '" placeholder="guard, if any" maxlength="32" spellcheck="false">' +
                '<input data-t="do" data-i="' + i + '" value="' + esc(t.do) + '" placeholder="action, if any" maxlength="80">' +
                '<button class="fsmx" data-t="del" data-i="' + i + '" title="Remove" aria-label="Remove">×</button></div>').join('')
                : '<div class="small muted" style="margin-bottom:4px">' + esc(e) + ' while in ' + esc(s.name) + ':</div>') +
              '<div class="btnrow" style="margin-top:4px;align-items:center"><button class="btn sm" data-t="add">' + (opts.length ? '+ Another, with a guard' : 'Handle it') + '</button>' +
              (opts.length ? '' : '<label class="ctl chk" style="font-size:12.5px"><input type="checkbox" data-t="ign"' + (ign.has(key) ? ' checked' : '') + '>ignored on purpose</label>') +
              '<button class="btn sm ghost" data-t="close">Done</button></div></td>';
          } else if (opts.length) h += '<td class="fsmc" data-k="' + esc(key) + '" tabindex="0">' + opts.map(x => shown(x[0])).join('<br>') + '</td>';
          else if (ign.has(key)) h += '<td class="fsmc ign" data-k="' + esc(key) + '" tabindex="0" title="Ignored on purpose: click to change">ignored</td>';
          else h += '<td class="fsmc und" data-k="' + esc(key) + '" tabindex="0" title="Not decided: click to decide">?</td>';
        }
        const tk = s.name + ' ' + AFTER;
        if (lab.tsel === tk) {
          h += '<td class="fsmc on" data-k="' + esc(tk) + '">' + s.after.map((a, i) => '<div class="fsmcrow"><input type="number" data-t="ms" data-i="' + i + '" value="' + a.ms + '" min="10" max="86400000" step="10" title="Milliseconds in the state">' +
              '<select data-t="to" data-i="' + i + '">' + tgt(a.to, s.name) + '</select><input data-t="do" data-i="' + i + '" value="' + esc(a.do) + '" placeholder="action, if any" maxlength="80">' +
              '<button class="fsmx" data-t="del" data-i="' + i + '" title="Remove" aria-label="Remove">×</button></div>').join('') +
            '<div class="btnrow" style="margin-top:4px"><button class="btn sm" data-t="add">+ A timeout (ms)</button><button class="btn sm ghost" data-t="close">Done</button></div></td>';
        } else h += '<td class="fsmc' + (s.after.length ? '' : ' ign') + '" data-k="' + esc(tk) + '" tabindex="0">' + (s.after.length ? s.after.slice().sort((a, b) => a.ms - b.ms).map(a => 'after ' + fmtMs(a.ms) + ' ' + shown(a)).join('<br>') : '—') + '</td>';
        h += '</tr>';
      }
      tabEl.innerHTML = h + '</tbody></table></div>';
      const und = undecided(mo).length, pairs = evs.length * mo.states.length;
      sumEl.innerHTML = !evs.length ? '<span class="muted">This machine has no events yet: add an event column to start deciding.</span>'
        : und ? '<span class="fsmwarn">' + und + ' of ' + pairs + ' state/event pairs still undecided (marked ?).</span>'
        : '<span class="fsmok">✓ All ' + pairs + ' state/event pairs are decided: each event is either handled or ignored on purpose in every state.</span>';
    }
    /* edits inside the open cell */
    function cellChange(el, kind) {
      const td = el.closest('[data-k]');
      if (!td) return;
      const { s, ev } = cellOf(td.dataset.k);
      if (!s) return;
      const i = +el.dataset.i, timed = ev === AFTER;
      const err = change(() => {
        const mo = lab.mo, t = timed ? s.after[i] : s.on[i];
        if (kind === 'add') return timed ? addTimeout(mo, s) : addTransition(mo, s, ev);
        if (kind === 'del') { if (timed) s.after.splice(i, 1); else s.on.splice(i, 1); return ''; }
        if (kind === 'ign') { mo.ignored = mo.ignored.filter(k => k !== s.name + ' ' + ev); if (el.checked) mo.ignored.push(s.name + ' ' + ev); return ''; }
        if (!t) return '';
        if (kind === 'to') { t.to = String(el.value); return ''; }
        if (kind === 'do') { t.do = txt(el.value); return ''; }
        if (kind === 'if') return setGuard(mo, t, el.value);
        if (kind === 'ms') return setTimeoutMs(s, t, el.value);
        return '';
      });
      errEl.textContent = err;
      if (err) { render(); return; }
      // a structural change redraws at once; a typed value waits until the focus has moved, then keeps it
      if (kind === 'add' || kind === 'del' || kind === 'ign') render();
      else setTimeout(renderKeep, 0);
    }
    function renderKeep() {
      const a = typeof document !== 'undefined' ? document.activeElement : null;
      const key = a && a.closest && a.closest('[data-k]') ? a.closest('[data-k]').dataset.k : null, t = a && a.dataset ? a.dataset.t : null, i = a && a.dataset ? a.dataset.i : null;
      render();
      if (key && t) { const b = tabEl.querySelector('[data-k="' + key.replace(/"/g, '') + '"] [data-t="' + t + '"][data-i="' + i + '"]'); if (b && b.focus) b.focus(); }
    }
    body.addEventListener('click', e => {
      const t = e.target;
      if (!t || !t.closest) return;
      const go = t.closest('[data-go]');
      if (go) { lab.sel = go.dataset.go; return; }
      const a = t.closest('[data-a]');
      if (a) {
        const k = a.dataset.a;
        let err = '';
        if (k === 'addev') { err = change(() => addEvent(lab.mo, newEv.value)); if (!err) newEv.value = ''; }
        else if (k === 'addst') { err = change(() => addState(lab.mo, newSt.value)); if (!err) newSt.value = ''; }
        else if (k === 'delev') { const ev = a.dataset.ev; err = change(() => deleteEvent(lab.mo, ev)); if (lab.tsel && lab.tsel.endsWith(' ' + ev)) lab.tsel = null; }
        else if (k === 'undo') { undoRedo(true); lab.tsel = null; }
        errEl.textContent = err;
        render();
        return;
      }
      const ctl = t.closest('[data-t]');
      if (ctl) {
        const k = ctl.dataset.t;
        if (k === 'close') { lab.tsel = null; render(); }
        else if (k === 'add' || k === 'del') cellChange(ctl, k);
        return;
      }
      const td = t.closest('td[data-k]');
      if (td && lab.tsel !== td.dataset.k) { lab.tsel = td.dataset.k; errEl.textContent = ''; render(); }
    });
    body.addEventListener('change', e => {
      const t = e.target;
      if (!t || !t.dataset || !t.dataset.t) return;
      cellChange(t, t.dataset.t);
    });
    body.addEventListener('keydown', e => {
      const t = e.target;
      if (!t || !t.classList) return;
      if (e.key === 'Enter' && t.classList.contains('fsmnewev')) { e.preventDefault(); const err = change(() => addEvent(lab.mo, newEv.value)); errEl.textContent = err; if (!err) newEv.value = ''; render(); }
      else if (e.key === 'Enter' && t.classList.contains('fsmnewst')) { e.preventDefault(); const err = change(() => addState(lab.mo, newSt.value)); errEl.textContent = err; if (!err) newSt.value = ''; render(); }
      else if ((e.key === 'Enter' || e.key === ' ') && t.tagName === 'TD' && t.dataset.k) { e.preventDefault(); lab.tsel = t.dataset.k; render(); }
      else if (e.key === 'Escape' && lab.tsel) { lab.tsel = null; render(); }
      else if (e.key === 'Enter' && t.tagName === 'INPUT' && t.dataset.t) t.blur();
    });
    render();
  }

  /* ================================================================ examples */
  function loadExample(i) {
    const x = EXAMPLES[i];
    if (!x) return;
    change(() => { lab.mo = fromObj(x); lab.sel = lab.mo.start; lab.tsel = null; return ''; });
    restart();
    lab.playing = true;
    if (ui.toast) ui.toast('Loaded “' + x.title + '”. Undo in the workbench brings your own design back.');
  }
  /* a diagram drawn small: the whole drawing scaled down so that it keeps its proportions */
  function miniDiagram(c, mo, W, Hh, active) {
    const k = Math.min(1, W / 480), D = diagramOf(mo), vw = W / k, vh = Hh / k;
    D.def.states.forEach(s => { s.note = ''; });
    D.rh = 19;
    const box = { x: 30, y: 44, w: Math.max(120, vw - 60), h: Math.max(80, vh - 62) };
    bendAround(D, box);
    c.save(); c.scale(k, k);
    S().fsm(c, D.def, { box, active, rw: D.rw, rh: D.rh });
    c.restore();
  }
  function examples(body) {
    const kit = K();
    const stats = x => { const n = Object.keys(x.states).length, ev = new Set(), to = []; for (const s of Object.values(x.states)) { Object.keys(s.on || {}).forEach(e => ev.add(e)); to.push(...Object.keys(s.after || {})); } return n + ' states · ' + ev.size + ' event' + (ev.size === 1 ? '' : 's') + ' · ' + to.length + ' timeout' + (to.length === 1 ? '' : 's'); };
    body.innerHTML = '<p class="muted" style="margin:0 0 12px">Eight machines, each built to teach one thing, from the traffic light that needs only a clock to the connection manager every networked device needs. Open one in the workbench to run it, break it, change it and take it away as a program. It replaces the design in the workbench — Undo there brings yours back.</p>' +
      '<div class="fsmexs">' + EXAMPLES.map((x, i) => '<div class="boxy fsmex"><div class="fsmmini" data-mini="' + i + '"></div>' +
        '<h3>' + esc(x.title) + '</h3><div class="small fsmteach">Teaches: ' + esc(x.teaches) + '</div><p class="small" style="margin:0;line-height:1.55">' + esc(x.about) + '</p>' +
        '<div class="row" style="gap:8px;margin-top:auto;padding-top:6px;flex-wrap:wrap;align-items:center"><button class="btn sm pri" data-ex="' + i + '">Open in the workbench</button><span class="small muted">' + stats(x) + '</span></div></div>').join('') + '</div>' +
      T.util.more(MORE);
    const draws = [];
    EXAMPLES.forEach((x, i) => {
      const host = body.querySelector('[data-mini="' + i + '"]');
      if (!host) return;
      const st = kit.stage(host, { aspect: 0.52, minH: 150, maxH: 230 }), mo = fromObj(x);
      const draw = () => miniDiagram(st.begin(), mo, st.W, st.H, mo.start);
      st.onResize(draw); draws.push(draw); draw();
    });
    T.util.onTheme(() => draws.forEach(f => f()));
    body.addEventListener('click', e => {
      const b = e.target && e.target.closest ? e.target.closest('[data-ex]') : null;
      if (!b) return;
      loadExample(+b.dataset.ex);
      location.hash = '#/tools/fsmlab/design';
    });
  }

  /* ================================================================ patterns: four habits, drawn and runnable
     Each canvas is drawn in a virtual 760 × 320 space, scaled to the width it is given. */
  const VW = 760, VH = 320;
  function vbegin(st) {
    const c = st.begin(), k = Math.max(0.1, Math.min(st.W / VW, st.H / VH)), ox = (st.W - VW * k) / 2, oy = (st.H - VH * k) / 2, d = st.dpr || 1;
    c.setTransform(d * k, 0, 0, d * k, d * ox, d * oy);
    return c;
  }
  const head = (c, t, x, y) => S().text(c, t, x, y, { align: 'left', size: 13, weight: 650, color: ui.colors().text });
  const divider = (c, x) => { const col = ui.colors(); c.save(); c.strokeStyle = col.border; c.lineWidth = 1; c.beginPath(); c.moveTo(x, 14); c.lineTo(x, VH - 14); c.stroke(); c.restore(); };
  const firedOf = (D, fx) => { if (!fx || now() - fx.t0 >= FX_MS) return {}; const i = D.transitions.findIndex(t => t.from + '>' + t.to === fx.key); return i < 0 ? {} : { fired: i, pulse: (now() - fx.t0) / FX_MS }; };
  const PATS = [
    ['Flag soup, or one state', 'The same garage door written twice. On the left, five true/false flags that each event sets and clears, as programs often grow; on the right, one variable that holds one state. Press <b>OPEN</b>, then <b>CLOSE</b> before the door reaches the top: the flags switch on both motor directions at once — something the state version cannot even express. Five flags make 32 combinations, and only five of them mean anything.'],
    ['delay(), or a timed state', 'An LED blinks and a button must be noticed. Written with <code>delay()</code>, the program is deaf for the whole delay and looks at the button only between delays: a short press is missed, a long one is noticed late. Written as two timed states, the loop goes round thousands of times a second and the press is noticed at once. Press a few times and compare the rows.'],
    ['One big machine, or two small ones', 'A heater and a Wi-Fi connection in one machine need a state for every combination — 6 states and 14 transitions here — and every change to one must be copied into every state of the other. As two machines (5 states, 6 transitions) each stays simple, and they talk by events: when the heater switches, it sends REPORT to the connection machine, which publishes it if it is online and keeps it for later if not.'],
    ['Where the inputs become events', 'A machine should never read a pin. The input code turns raw signals into events: a bouncing contact becomes one PRESS after debouncing and edge detection; a temperature becomes TOO_HOT and COOL only when it crosses two different thresholds (hysteresis), not on every reading. The events wait in a queue and the machine takes them one at a time. Switch the debouncing or the hysteresis off and watch the machine get confused. Time runs ten times slower on the contact so that the bounces can be seen.']
  ];
  function patterns(body) {
    body.innerHTML = '<p class="muted" style="margin:0 0 12px">Four habits that make the difference between a state machine that helps and one that is only a drawing. Each is drawn and runs: use the buttons beside it.</p>' +
      PATS.map((p, i) => '<section class="boxy fsmpat" data-p="' + i + '"><h3><span class="fsmn">' + (i + 1) + '</span>' + p[0] + '</h3><p class="small" style="margin:0 0 10px;line-height:1.55">' + p[1] + '</p>' +
        '<div class="fsmpatg"><div class="stage"></div><div class="side"></div></div></section>').join('') + T.util.more(MORE);
    [patFlags, patDelay, patSplit, patInputs].forEach((f, i) => {
      const sec = body.querySelector('[data-p="' + i + '"]');
      if (sec) f(sec.querySelector('.stage'), sec.querySelector('.side'));
    });
  }

  /* 1 · five flags against one state */
  function patFlags(stageEl, side) {
    const kit = K(), st = kit.stage(stageEl, { aspect: VH / VW, minH: 200, maxH: 420 });
    const DEF = { start: 'CLOSED', states: { CLOSED: { on: { OPEN: 'OPENING' } }, OPENING: { on: { TOP: 'OPEN', CLOSE: 'STOPPED' } }, OPEN: { on: { CLOSE: 'CLOSING' } },
      CLOSING: { on: { BOTTOM: 'CLOSED', OPEN: 'STOPPED' } }, STOPPED: { on: { OPEN: 'OPENING', CLOSE: 'CLOSING' } } } };
    const Dg = E.fsmDiagram(DEF, { CLOSED: [0, 0.5], OPENING: [0.5, 0], OPEN: [1, 0.5], CLOSING: [0.5, 1], STOPPED: [0.5, 0.5] });
    const FL = ['opening', 'closing', 'isOpen', 'isClosed', 'stopped'];
    let m, f, seen, bad, fx = null;
    const key = () => FL.map(k => f[k] ? 1 : 0).join('');
    const reset = () => { m = E.fsm(DEF, { onChange: (a, b) => { fx = { key: a + '>' + b, t0: now() }; } }); f = { opening: false, closing: false, isOpen: false, isClosed: true, stopped: false }; seen = new Set([key()]); bad = new Set(); fx = null; };
    const send = ev => {
      m.send(ev);
      // the flag version, as such code is usually written: each event sets and clears what it thinks of
      if (ev === 'OPEN') { f.opening = true; f.isClosed = false; f.stopped = false; }
      else if (ev === 'CLOSE') { f.closing = true; f.isOpen = false; f.stopped = false; }
      else if (ev === 'TOP') { f.opening = false; f.isOpen = true; }
      else if (ev === 'BOTTOM') { f.closing = false; f.isClosed = true; }
      seen.add(key());
      if (FL.filter(k => f[k]).length !== 1) bad.add(key());
    };
    reset();
    const ctl = kit.controls(side, [{ type: 'buttons', items: [{ id: 'OPEN', label: 'OPEN' }, { id: 'CLOSE', label: 'CLOSE' }, { id: 'TOP', label: 'TOP limit' }, { id: 'BOTTOM', label: 'BOTTOM limit' }, { id: 'reset', label: 'Start again' }] },
      { type: 'html', html: 'Try: OPEN, then CLOSE before TOP. Then the same on the right: CLOSE while OPENING stops the door, because someone decided it.' }], id => { if (id === 'reset') reset(); else send(id); loop.start(); });
    const ro = kit.readout(side, [['seen', 'Flag combinations seen'], ['bad', 'Impossible ones'], ['state', 'The one state']]);
    const loop = kit.loop(() => {
      const c = vbegin(st), col = ui.colors();
      head(c, 'Five flags', 16, 18);
      FL.forEach((k, i) => { const y = 54 + i * 34; S().led(c, 30, y, { on: f[k], color: 140, r: 7 }); S().text(c, k + ' = ' + f[k], 46, y, { align: 'left', size: 12.5, mono: true, color: f[k] ? col.text : col.muted }); });
      S().text(c, 'motor', 262, 50, { size: 11.5, color: col.muted });
      S().led(c, 240, 80, { on: f.opening, color: 210, r: 9, label: 'up' });
      S().led(c, 284, 80, { on: f.closing, color: 30, r: 9, label: 'down' });
      const on = FL.filter(k => f[k]);
      const msg = f.opening && f.closing ? 'up and down both on: the motor fights itself' : f.isOpen && f.isClosed ? 'open and closed at the same time?' : !on.length ? 'no flag is set: where is the door?' : on.length > 1 ? on.join(' + ') + ': which is it?' : '';
      if (msg) S().text(c, msg, 16, 240, { align: 'left', size: 12, weight: 650, color: col.bad });
      S().text(c, seen.size + ' of 32 combinations seen, ' + bad.size + ' impossible', 16, 266, { align: 'left', size: 11.5, color: col.muted });
      divider(c, 352);
      head(c, 'One state', 372, 18);
      S().fsm(c, Dg, Object.assign({ box: { x: 384, y: 40, w: 356, h: 222 }, active: m.state, rw: 46, rh: 18 }, firedOf(Dg, fx)));
      S().led(c, 540, 292, { on: m.state === 'OPENING', color: 210, r: 8 }); S().text(c, 'up', 556, 292, { align: 'left', size: 11 });
      S().led(c, 610, 292, { on: m.state === 'CLOSING', color: 30, r: 8 }); S().text(c, 'down', 626, 292, { align: 'left', size: 11 });
      ro.set('seen', seen.size + ' of 32'); ro.set('bad', String(bad.size)); ro.set('state', m.state);
      if (!(fx && now() - fx.t0 < FX_MS)) loop.stop();
    }, stageEl);
    st.onResize(() => loop.once()); T.util.onTheme(() => loop.once());
    loop.once();
    return ctl;
  }

  /* 2 · delay() against a timed state */
  function patDelay(stageEl, side) {
    const kit = K(), st = kit.stage(stageEl, { aspect: VH / VW, minH: 200, maxH: 420 });
    const WIN = 8, X0 = 132, X1 = 520;
    let P = 1, t = 0, presses = [], m, fx = null;
    const reset = () => {
      t = 0; presses = []; fx = null;
      m = E.fsm({ start: 'LED_ON', states: { LED_ON: { entry: 'LED on', after: { [P * 1000]: 'LED_OFF' } }, LED_OFF: { entry: 'LED off', after: { [P * 1000]: 'LED_ON' } } } }, { onChange: (a, b) => { fx = { key: a + '>' + b, t0: now() }; } });
    };
    const press = dur => {
      const k = Math.ceil(t / P - 1e-9), tk = k * P;          // delay() looks at the button only when a delay ends
      presses.push({ t0: t, dur, dSeen: tk <= t + dur + 1e-9 ? tk : null, tSeen: t + 0.01 });
    };
    reset();
    kit.controls(side, [{ type: 'buttons', items: [{ id: 'short', label: 'A short press (0.2 s)', primary: true }, { id: 'long', label: 'A long press (1.5 s)' }, { id: 'reset', label: 'Start again' }] },
      { id: 'period', type: 'select', label: 'Blink: on and off for', options: [['0.5 s each', 0.5], ['1 s each', 1], ['2 s each', 2]], value: 1 }], (id, v) => {
      if (id === 'short') press(0.2); else if (id === 'long') press(1.5); else if (id === 'reset') reset(); else if (id === 'period') { P = +v || 1; reset(); }
    });
    const ro = kit.readout(side, [['n', 'Presses'], ['d', 'delay() noticed'], ['s', 'The timed state noticed']]);
    const loop = kit.loop(dt => {
      t += dt; m.tick(dt * 1000);
      presses = presses.filter(p => p.t0 > t - WIN - 2);
      const c = vbegin(st), col = ui.colors(), t0 = t - WIN, X = v => X0 + (v - t0) / WIN * (X1 - X0);
      head(c, 'The last 8 seconds', 16, 18);
      const led = [];
      for (let k = Math.floor(t0 / P) - 1; k <= Math.floor(t / P); k++) led.push([k * P, k % 2 === 0 ? 1 : 0]);
      S().wave(c, X0, 40, X1 - X0, 18, led, { t0, t1: t, label: 'LED (both)', color: col.warn });
      const btn = [[t0 - 1, 0]];
      presses.slice().sort((a, b) => a.t0 - b.t0).forEach(p => { btn.push([p.t0, 1], [p.t0 + p.dur, 0]); });
      S().wave(c, X0, 92, X1 - X0, 18, btn, { t0, t1: t, label: 'button', color: col.accent, fill: true });
      // the moments delay() looks
      c.save(); c.strokeStyle = col.faint; c.setLineDash([2, 3]); c.lineWidth = 1;
      for (let k = Math.ceil(t0 / P); k * P <= t; k++) { const x = X(k * P); c.beginPath(); c.moveTo(x, 140); c.lineTo(x, 178); c.stroke(); }
      c.restore();
      S().text(c, 'delay() sees it', X0 - 6, 164, { align: 'right', size: 11, color: col.text2 });
      S().text(c, 'timed state sees it', X0 - 6, 226, { align: 'right', size: 11, color: col.text2 });
      for (const y of [176, 238]) { c.save(); c.strokeStyle = col.border; c.beginPath(); c.moveTo(X0, y); c.lineTo(X1, y); c.stroke(); c.restore(); }
      for (const p of presses) {
        if (p.dSeen != null && p.dSeen <= t && p.dSeen >= t0) { const x = X(p.dSeen); S().text(c, '+' + (p.dSeen - p.t0).toFixed(2) + ' s', x, 150, { size: 10.5, color: col.text2 }); c.save(); c.fillStyle = col.ok; c.beginPath(); c.arc(x, 168, 5, 0, 2 * Math.PI); c.fill(); c.restore(); }
        else if (p.dSeen == null && p.t0 + p.dur <= t && p.t0 + p.dur >= t0) { const x = X(p.t0 + p.dur); S().text(c, '✗ missed', x, 166, { size: 11.5, weight: 650, color: col.bad }); }
        if (p.tSeen <= t && p.tSeen >= t0) { const x = X(p.tSeen); S().text(c, '+0.01 s', x, 212, { size: 10.5, color: col.text2 }); c.save(); c.fillStyle = col.ok; c.beginPath(); c.arc(x, 230, 5, 0, 2 * Math.PI); c.fill(); c.restore(); }
      }
      S().text(c, 'dotted lines: the only moments the delay() version looks at the button', X0, 268, { align: 'left', size: 10.5, color: col.faint });
      divider(c, 548);
      head(c, 'The timed version', 566, 18);
      const Dg = E.fsmDiagram({ start: 'LED_ON', states: { LED_ON: { after: { [P * 1000]: 'LED_OFF' } }, LED_OFF: { after: { [P * 1000]: 'LED_ON' } } } }, { LED_ON: [0, 0.5], LED_OFF: [1, 0.5] });
      S().fsm(c, Dg, Object.assign({ box: { x: 574, y: 60, w: 176, h: 110 }, active: m.state, rw: 42, rh: 18 }, firedOf(Dg, fx)));
      S().led(c, 662, 222, { on: m.state === 'LED_ON', color: 40, r: 10, label: 'LED' });
      S().text(c, 'the loop never waits, so the', 662, 270, { size: 10.5, color: col.muted });
      S().text(c, 'button is read on every pass', 662, 284, { size: 10.5, color: col.muted });
      const n = presses.length, seenD = presses.filter(p => p.dSeen != null), done = presses.filter(p => p.dSeen != null || p.t0 + p.dur <= t);
      ro.set('n', String(n));
      ro.set('d', done.length ? seenD.length + ' of ' + done.length + (seenD.length ? ', ' + (seenD.reduce((s, p) => s + p.dSeen - p.t0, 0) / seenD.length).toFixed(2) + ' s late' : '') : '—');
      ro.set('s', n ? n + ' of ' + n + ', at once' : '—');
    }, stageEl);
    st.onResize(() => loop.once()); T.util.onTheme(() => loop.once());
    loop.start();
  }

  /* 3 · one machine for everything against two that talk */
  function patSplit(stageEl, side) {
    const kit = K(), st = kit.stage(stageEl, { aspect: VH / VW, minH: 200, maxH: 420 });
    const HDEF = { start: 'IDLE', states: { IDLE: { on: { COLD: 'HEATING' } }, HEATING: { on: { WARM: 'IDLE' } } } };
    const CDEF = { start: 'OFFLINE', states: { OFFLINE: { on: { CONNECT: 'CONNECTING' } }, CONNECTING: { on: { WIFI_UP: 'ONLINE', WIFI_DOWN: 'OFFLINE' } }, ONLINE: { on: { WIFI_DOWN: 'OFFLINE' } } } };
    // the product: one state for every pair, every transition copied into each state of the other machine
    const BIG = { start: 'IDLE_OFFLINE', states: {} };
    for (const a of Object.keys(HDEF.states)) for (const b of Object.keys(CDEF.states)) {
      const on = {};
      for (const [ev, to] of Object.entries(HDEF.states[a].on)) on[ev] = to + '_' + b;
      for (const [ev, to] of Object.entries(CDEF.states[b].on)) on[ev] = a + '_' + to;
      BIG.states[a + '_' + b] = { on };
    }
    const nTr = d => Object.values(d.states).reduce((s, x) => s + Object.keys(x.on || {}).length, 0);
    const AB = { IDLE: 'IDLE', HEATING: 'HEAT', OFFLINE: 'OFF', CONNECTING: 'CONN', ONLINE: 'ON' }, lay = {};
    for (const id of Object.keys(BIG.states)) { const [a, b] = [id.slice(0, id.indexOf('_')), id.slice(id.indexOf('_') + 1)]; lay[id] = [{ OFFLINE: 0, CONNECTING: 0.5, ONLINE: 1 }[b], a === 'IDLE' ? 0 : 1]; }
    const Db = { def: E.fsmDiagram(BIG, lay), rw: 48, rh: 19 };
    Db.def.states.forEach(s => { const i = s.id.indexOf('_'); s.label = AB[s.id.slice(0, i)] + '+' + AB[s.id.slice(i + 1)]; s.note = ''; });
    const boxB = { x: 24, y: 46, w: 316, h: 220 };
    bendAround(Db, boxB);
    const Dh = E.fsmDiagram(HDEF, { IDLE: [0.12, 0.5], HEATING: [0.88, 0.5] }), Dc = E.fsmDiagram(CDEF, { OFFLINE: [0, 0.85], CONNECTING: [0.5, 0.1], ONLINE: [1, 0.85] });
    let mb, mh, mc, fxB, fxH, fxC, msg, kept, last;
    const reset = () => {
      fxB = fxH = fxC = msg = null; kept = 0; last = 'none yet';
      mb = E.fsm(BIG, { onChange: (a, b) => { fxB = { key: a + '>' + b, t0: now() }; } });
      mh = E.fsm(HDEF, { onChange: (a, b) => { fxH = { key: a + '>' + b, t0: now() }; msg = { t0: now(), on: b === 'HEATING' }; } });
      mc = E.fsm(CDEF, { onChange: (a, b) => { fxC = { key: a + '>' + b, t0: now() }; if (b === 'ONLINE' && kept) { last = 'back online: sent the ' + kept + ' kept report' + (kept > 1 ? 's' : ''); kept = 0; } } });
    };
    reset();
    kit.controls(side, [{ type: 'buttons', items: ['COLD', 'WARM', 'CONNECT', 'WIFI_UP', 'WIFI_DOWN'].map(e => ({ id: e, label: e })).concat([{ id: 'reset', label: 'Start again' }]) },
      { type: 'html', html: 'The same five events go to both versions, and they always agree. Count what had to be written to get there.' }], id => {
      if (id === 'reset') reset(); else { mb.send(id); mh.send(id); mc.send(id); }
      loop.start();
    });
    const ro = kit.readout(side, [['one', 'One machine'], ['two', 'Two machines'], ['msg', 'Last REPORT']]);
    ro.set('one', Object.keys(BIG.states).length + ' states, ' + nTr(BIG) + ' transitions');
    ro.set('two', '2 + 3 states, ' + nTr(HDEF) + ' + ' + nTr(CDEF) + ' transitions');
    const MSG_MS = 800;
    const loop = kit.loop(() => {
      const c = vbegin(st), col = ui.colors(), t = now();
      if (msg && t - msg.t0 >= MSG_MS) {
        if (mc.state === 'ONLINE') last = 'published “heater ' + (msg.on ? 'on' : 'off') + '”';
        else { kept++; last = 'offline: kept for later (' + kept + ')'; }
        msg = null;
      }
      head(c, 'One machine for both', 16, 18);
      S().fsm(c, Db.def, Object.assign({ box: boxB, active: mb.state, rw: Db.rw, rh: Db.rh }, firedOf(Db.def, fxB)));
      S().text(c, Object.keys(BIG.states).length + ' states, ' + nTr(BIG) + ' transitions: each heater change is copied 3 times', 16, 300, { align: 'left', size: 10.5, color: col.muted });
      divider(c, 362);
      head(c, 'Two machines that talk', 380, 18);
      S().text(c, 'heater', 388, 40, { align: 'left', size: 10.5, color: col.faint });
      S().fsm(c, Dh, Object.assign({ box: { x: 392, y: 44, w: 348, h: 60 }, active: mh.state, rw: 44, rh: 19 }, firedOf(Dh, fxH)));
      S().text(c, 'connection', 388, 160, { align: 'left', size: 10.5, color: col.faint });
      S().fsm(c, Dc, Object.assign({ box: { x: 392, y: 164, w: 348, h: 104 }, active: mc.state, rw: 50, rh: 19 }, firedOf(Dc, fxC)));
      c.save(); c.strokeStyle = col.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(566, 108); c.lineTo(566, 164); c.stroke(); c.restore();
      if (msg) S().msg(c, 566, 108, 566, 164, clamp((t - msg.t0) / MSG_MS, 0, 1), { label: 'REPORT' });
      S().text(c, last, 566, 300, { size: 11, color: col.text2 });
      ro.set('msg', last);
      if (!msg && !((fxB && t - fxB.t0 < FX_MS) || (fxH && t - fxH.t0 < FX_MS) || (fxC && t - fxC.t0 < FX_MS))) loop.stop();
    }, stageEl);
    st.onResize(() => loop.once()); T.util.onTheme(() => loop.once());
    loop.once();
  }

  /* 4 · raw inputs -> events -> a queue -> the machine */
  function patInputs(stageEl, side) {
    const kit = K(), st = kit.stage(stageEl, { aspect: VH / VW, minH: 200, maxH: 420 });
    const SLOW = 0.1, WIN = 0.4, STEP = 0.0005, TAKE = 0.3, QMAX = 10;
    const DEF = { start: 'OFF', states: { OFF: { on: { PRESS: 'ON' } }, ON: { entry: 'lamp on', exit: 'lamp off', on: { PRESS: 'OFF', TOO_HOT: 'HOT_STOP' } }, HOT_STOP: { on: { COOL: 'OFF' } } } };
    const Dg = E.fsmDiagram(DEF, { OFF: [0, 0.12], ON: [1, 0.12], HOT_STOP: [0.5, 1] });
    Dg.states.forEach(s => { s.note = ''; });
    const o = { hold: false, debounce: true, target: 40, hyst: true };
    let ts, stepT, sched, raw, cand, since, stable, rawE, dbE, evMarks, temp, noise, noiseT, hot, queue, clock, lastTake, taken, m, fx, nRaw, nEv, nDrop, tEv;
    const reset = () => {
      ts = 0; stepT = 0; sched = []; raw = 0; cand = 0; since = 0; stable = 0; rawE = [[-1, 0]]; dbE = [[-1, 0]]; evMarks = []; temp = o.target; noise = 0; noiseT = 0; hot = false;
      queue = []; clock = 0; lastTake = 0; taken = 'nothing yet'; fx = null; nRaw = 0; nEv = 0; nDrop = 0; tEv = [];
      m = E.fsm(DEF, { onChange: (a, b) => { fx = { key: a + '>' + b, t0: now() }; } });
    };
    const emit = (ev, from) => { queue.push({ ev, from }); nEv++; if (queue.length > QMAX) { queue.shift(); nDrop++; } };
    const contact = (lv, at) => {      // the contact closes or opens; a real one bounces for a few milliseconds
      const t0 = at == null ? Math.max(ts, sched.length ? sched[sched.length - 1][0] : 0) : at;
      [0, 0.0007, 0.0019, 0.0026, 0.0041, 0.0055].forEach((d, i) => sched.push([t0 + d, i % 2 === 0 ? lv : 1 - lv]));
      sched.push([t0 + 0.0068, lv]);
      sched.sort((a, b) => a[0] - b[0]);
    };
    reset();
    kit.controls(side, [
      { id: 'hold', type: 'check', label: 'Hold the button down', value: false },
      { type: 'buttons', items: [{ id: 'click', label: 'Click the button', primary: true }, { id: 'reset', label: 'Start again' }] },
      { id: 'debounce', type: 'check', label: 'Debounce the contact (stable for 20 ms)', value: true },
      { id: 'target', label: 'Temperature', min: 20, max: 90, step: 1, value: 40, unit: '°C' },
      { id: 'hyst', type: 'check', label: 'Hysteresis: TOO_HOT above 70 °C, COOL below 60 °C', value: true }
    ], (id, v) => {
      if (id === 'hold') { o.hold = !!v; contact(o.hold ? 1 : 0); }
      else if (id === 'click') { contact(1); contact(0, Math.max(ts, sched.length ? sched[sched.length - 1][0] : ts) + 0.12); }
      else if (id === 'reset') reset();
      else if (id === 'debounce') o.debounce = !!v;
      else if (id === 'target') o.target = +v;
      else if (id === 'hyst') o.hyst = !!v;
    });
    const ro = kit.readout(side, [['raw', 'Contact edges'], ['ev', 'Events made'], ['q', 'Waiting in the queue'], ['drop', 'Dropped: queue full']]);
    const loop = kit.loop(dt => {
      clock += dt;
      // the contact, in slow motion, sampled every half millisecond
      const tEnd = ts + dt * SLOW;
      while (stepT + STEP <= tEnd + 1e-12) {
        stepT += STEP;
        while (sched.length && sched[0][0] <= stepT) {
          const lv = sched.shift()[1];
          if (lv === raw) continue;
          const rose = lv > raw;
          raw = lv; rawE.push([stepT, raw]); nRaw++;
          if (!o.debounce) { stable = raw; dbE.push([stepT, stable]); if (rose) { emit('PRESS', 'button'); evMarks.push(stepT); } }
        }
        if (o.debounce) {
          if (raw !== cand) { cand = raw; since = stepT; }
          if (cand !== stable && stepT - since >= 0.02) { stable = cand; dbE.push([stepT, stable]); if (stable) { emit('PRESS', 'button'); evMarks.push(stepT); } }
        }
      }
      ts = tEnd;
      const keep = (a, lo) => { while (a.length > 1 && a[1][0] < lo) a.shift(); };
      keep(rawE, ts - WIN); keep(dbE, ts - WIN);
      evMarks = evMarks.filter(x => x >= ts - WIN);
      // the temperature, with a little noise on the reading
      noiseT += dt;
      if (noiseT >= 0.1) { noiseT = 0; noise = (Math.random() - 0.5) * 1.6; }
      temp += clamp(o.target - temp, -8 * dt, 8 * dt);
      const tv = temp + noise, hi = o.hyst ? 70 : 65, lo = o.hyst ? 60 : 65;
      if (!hot && tv > hi) { hot = true; emit('TOO_HOT', 'temperature'); tEv.push({ ev: 'TOO_HOT', t: clock }); }
      else if (hot && tv < lo) { hot = false; emit('COOL', 'temperature'); tEv.push({ ev: 'COOL', t: clock }); }
      tEv = tEv.filter(e => e.t > clock - 6);
      // the machine takes one event at a time
      if (queue.length && clock - lastTake >= TAKE) {
        const e = queue.shift(), from = m.state;
        lastTake = clock;
        taken = m.send(e.ev) ? e.ev + ': ' + from + ' → ' + m.state : e.ev + ' ignored in ' + from;
      }
      const c = vbegin(st), col = ui.colors();
      head(c, 'Button', 16, 18);
      S().wave(c, 100, 36, 220, 18, rawE, { t0: ts - WIN, t1: ts, label: 'contact', color: col.muted });
      S().wave(c, 100, 72, 220, 18, dbE, { t0: ts - WIN, t1: ts, label: o.debounce ? 'debounced' : 'no filter', color: col.accent });
      S().text(c, 'events', 94, 112, { align: 'right', size: 11, color: col.text2 });
      for (const x of evMarks) { const px = 100 + (x - (ts - WIN)) / WIN * 220; S().text(c, 'PRESS', px, 112, { size: 10, weight: 650, color: col.warn }); }
      head(c, 'Temperature', 16, 146);
      const TX = v => 100 + (clamp(v, 20, 90) - 20) / 70 * 220;
      c.save(); rr(c, 100, 166, 220, 10, 5); c.fillStyle = col.surface2 || col.border; c.fill();
      rr(c, 100, 166, Math.max(1, TX(tv) - 100), 10, 5); c.fillStyle = hot ? col.bad : col.ok; c.fill(); c.restore();
      for (const [v, lbl] of o.hyst ? [[60, 'COOL 60'], [70, 'TOO_HOT 70']] : [[65, 'one threshold 65']]) {
        c.save(); c.strokeStyle = col.text2; c.lineWidth = 1.5; c.beginPath(); c.moveTo(TX(v), 160); c.lineTo(TX(v), 182); c.stroke(); c.restore();
        S().text(c, lbl, TX(v), 192 + (v === 60 ? 0 : o.hyst ? 12 : 0), { size: 10, color: col.text2 });
      }
      S().text(c, tv.toFixed(1) + ' °C', 94, 171, { align: 'right', size: 11.5, mono: true, color: col.text });
      S().text(c, tEv.length + ' temperature event' + (tEv.length === 1 ? '' : 's') + ' in the last 6 s', 100, 232, { align: 'left', size: 11, color: tEv.length > 4 ? col.bad : col.muted });
      // the queue
      divider(c, 340);
      head(c, 'Queue', 356, 18);
      c.save(); rr(c, 356, 32, 92, 252, 8); c.strokeStyle = col.border2 || col.border; c.lineWidth = 1.2; c.stroke(); c.restore();
      queue.slice(-QMAX).forEach((e, i) => { const y = 270 - i * 24; c.save(); rr(c, 362, y - 9, 80, 18, 5); c.fillStyle = e.from === 'button' ? col.accent : col.warn; c.globalAlpha = 0.85; c.fill(); c.restore(); S().text(c, e.ev, 402, y, { size: 10, weight: 650, color: col.dark ? '#0d1020' : '#fff' }); });
      if (!queue.length) S().text(c, 'empty', 402, 270, { size: 10.5, color: col.faint });
      kit.arrow(c, 450, 270, 478, 270, col.muted, 1.5);
      divider(c, 470);
      head(c, 'Machine', 490, 18);
      S().fsm(c, Dg, Object.assign({ box: { x: 492, y: 40, w: 250, h: 160 }, active: m.state, rw: 46, rh: 19 }, firedOf(Dg, fx)));
      S().led(c, 617, 238, { on: m.state === 'ON', color: 50, r: 11, label: 'lamp' });
      S().text(c, taken, 617, 290, { size: 11, color: /ignored/.test(taken) ? col.warn : col.text2 });
      ro.set('raw', String(nRaw)); ro.set('ev', String(nEv)); ro.set('q', String(queue.length)); ro.set('drop', String(nDrop));
    }, stageEl);
    st.onResize(() => loop.once()); T.util.onTheme(() => loop.once());
    loop.start();
  }

  T.fsmlab = function (el, params, sub) {
    ensure();
    const { tab, body } = T.util.subtabs(el, 'fsmlab', [['design', 'Design and run'], ['examples', 'Examples'], ['table', 'Transition table'], ['patterns', 'Patterns']], sub);
    ({ design, examples, table, patterns })[tab](body);
  };
  T.fsmlab.tabs = ['design', 'examples', 'table', 'patterns'];
  T.fsmlab.dom = true;
  /* the pure parts, for tools/test-fsmlab.js */
  T.fsmlab.lib = { toDef, fromObj, exportObj, problems, diagramOf, genCode, sampleOutput, EXAMPLES, knownEvents, guardNames, undecided };
})();
