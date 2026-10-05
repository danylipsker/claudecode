/* HYPER-ESP32 · sims/program-structure.js
 *
 * Simulations of the topic "A program, three ways" (program-structure):
 *
 *   ps-program-counter   the program counter walking through setup() once and loop() for ever, with the variables changing
 *   ps-variable-box      a variable as a box of a given size: overflow in C++ against Python; millis() across its wrap (params: { mode: 'millis' })
 *   ps-flow              if / else if / else and for / while drawn as a flow chart, step by step, next to the code in three notations
 *   ps-callstack         the call stack growing as functions call functions, and recursion running out of it
 *   ps-array-index       an array with an index walking off its end (params: { mode: 'chars' } for a char buffer and its zero byte)
 *   ps-timers            several timers in one loop on a shared time axis: delay() against watching the clock
 *   ps-bits              the bits of a byte with masks and shifts, and a signed register read as two's complement (params: { mode: 'twos' })
 *
 * Numbers come from the rules of C++ integers; pictures use theme colours only.
 */
(function () {
  'use strict';

  const LANGS = [['Blocks', 'blocks'], ['Arduino C++', 'cpp'], ['MicroPython', 'py']];
  const fmtInt = v => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const rrPath = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2))); else c.rect(x, y, w, h); };

  /* The lines of a program in three notations, one row per line: { i: indent level, b: blocks, c: Arduino C++, p: MicroPython }.
     hot: the row numbers to highlight. Blocks are drawn as coloured pieces, the others as code. */
  function codePanel(c, kit, S, x, y, w, rows, lang, hot, lh) {
    const C = kit.colors(), B = kit.code && kit.code.blocks;
    const size = clamp(lh - 6, 10, 12.5), cw = size * 0.6;
    rows.forEach((L, i) => {
      const raw = lang === 'blocks' ? L.b : lang === 'cpp' ? L.c : L.p, ly = y + i * lh;
      if (hot.indexOf(i) >= 0) { c.fillStyle = C.dark ? 'rgba(123,140,255,.26)' : 'rgba(60,90,220,.16)'; c.fillRect(x - 6, ly, w + 10, lh - 1); }
      if (!raw) return;
      const ind = (L.i || 0) * (lang === 'py' ? 20 : 16), tx = x + ind;
      const isNote = /^(\/\/|#)/.test(raw) && !L.keep;
      if (lang === 'blocks' && !isNote) {
        const txt = raw.replace(/\s+v\]/g, ' ▾]');
        const hue = B ? B.hue(B.categoryOf(raw)) : 212;
        const bw = Math.min(w - ind, txt.length * cw + 14);
        rrPath(c, tx, ly + 1, Math.max(10, bw), lh - 3, 5); c.fillStyle = kit.hue(hue, 0.92); c.fill();
        S.text(c, txt, tx + 7, ly + lh / 2, { size, align: 'left', color: C.dark ? '#10142a' : '#ffffff', weight: 600 });
      } else {
        S.text(c, raw, tx, ly + lh / 2, { size, align: 'left', mono: true, color: isNote ? C.muted : C.text });
      }
    });
  }

  /* ================================================================ ps-program-counter */
  const PC_PROGS = {
    blink: {
      decor: { b: '// a variable is made by a set block', c: 'int count;   bool ledOn;   // globals', p: '# a name exists once it is assigned' },
      vars: ['count', 'ledOn'],
      lines: [
        { b: 'when started', c: 'void setup() {', p: '# once, after power-on or reset', kind: 'enter' },
        { i: 1, b: 'start serial at (115200) baud', c: 'Serial.begin(115200);', p: '# print() already goes to the USB port', run: s => { s.serial = true; } },
        { i: 1, b: 'set pin (2) as [output v]', c: 'pinMode(LED_PIN, OUTPUT);', p: 'led = Pin(LED_PIN, Pin.OUT)', run: s => { s.out2 = true; } },
        { i: 1, b: 'set [count v] to (0)', c: 'count = 0;', p: 'count = 0', run: s => { s.v.count = 0; } },
        { i: 1, b: 'set [ledOn v] to <false>', c: 'ledOn = false;', p: 'ledOn = False', run: s => { s.v.ledOn = false; } },
        { b: '', c: '}', p: '', skip: true },
        { b: 'forever', c: 'void loop() {', p: 'while True:', kind: 'pass' },
        { i: 1, b: 'change [count v] by (1)', c: 'count++;', p: 'count += 1', run: s => { s.v.count++; } },
        { i: 1, b: 'set [ledOn v] to <not <ledOn>>', c: 'ledOn = !ledOn;', p: 'ledOn = not ledOn', run: s => { s.v.ledOn = !s.v.ledOn; } },
        { i: 1, b: 'set pin (2) to (ledOn)', c: 'digitalWrite(LED_PIN, ledOn);', p: 'led.value(ledOn)', run: s => { s.led = !!s.v.ledOn; } },
        { i: 1, b: 'print (count)', c: 'Serial.println(count);', p: 'print(count)', run: s => { s.mon.push(String(s.v.count)); } },
        { i: 1, b: 'wait (0.5) seconds', c: 'delay(500);', p: 'time.sleep_ms(500)', run: s => { s.ms += 500; } },
        { b: 'end', c: '}', p: '', jump: 6, kind: 'ret' }
      ]
    },
    button: {
      decor: { b: '// a variable is made by a set block', c: 'bool pressed;   // a global', p: '# a name exists once it is assigned' },
      vars: ['pressed'],
      lines: [
        { b: 'when started', c: 'void setup() {', p: '# once, after power-on or reset', kind: 'enter' },
        { i: 1, b: 'set pin (0) as [input with pull-up v]', c: 'pinMode(BUTTON_PIN, INPUT_PULLUP);', p: 'button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)', run: s => { s.in0 = true; } },
        { i: 1, b: 'set pin (2) as [output v]', c: 'pinMode(LED_PIN, OUTPUT);', p: 'led = Pin(LED_PIN, Pin.OUT)', run: s => { s.out2 = true; } },
        { b: '', c: '}', p: '', skip: true },
        { b: 'forever', c: 'void loop() {', p: 'while True:', kind: 'pass' },
        { i: 1, b: 'set [pressed v] to <(read pin (0)) = [LOW v]>', c: 'pressed = digitalRead(BUTTON_PIN) == LOW;', p: 'pressed = button.value() == 0', run: (s, o) => { s.v.pressed = !!o.hold; s.ms += 1; } },
        { i: 1, b: 'set pin (2) to (pressed)', c: 'digitalWrite(LED_PIN, pressed);', p: 'led.value(pressed)', run: s => { s.led = !!s.v.pressed; } },
        { b: 'end', c: '}', p: '', jump: 4, kind: 'ret' }
      ]
    }
  };

  Hyper.sim('ps-program-counter', {
    title: 'The program counter: setup once, loop for ever',
    blurb: `The highlighted line is where the processor is: the **program counter**. Press **Step** to move it one line, or **Run** to let it go. Look at the boxes on the right — they are the variables.

**Try this**
- Step through the first program and watch \`setup()\` run **once**, then the loop come round and round: the pass counter at the top right goes up, the setup counter does not.
- Press **Reset the chip** in the middle of a run: every variable is forgotten and the program starts again from the top.
- Switch **Show it as** between blocks, Arduino C++ and MicroPython: the same lines, the same order, only the spelling changes. Notice that Python has no \`setup()\` — its first lines simply run before the loop.
- Choose the button program and tick **Hold the BOOT button** at different moments: the variable is read once per pass, so a press between two reads is only seen on the next one.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.68, maxH: 560 });
      let running = false, acc = 0, s = null;
      const reset = () => { s = { pc: -1, v: {}, led: false, serial: false, mon: [], ms: 0, setups: 0, passes: 0, trail: [], changed: {} }; };
      reset();
      const nextIndex = (P, i) => { const L = P.lines[i]; let j = L.jump != null ? L.jump : i + 1; while (j < P.lines.length && P.lines[j].skip) j++; return j >= P.lines.length ? 0 : j; };
      const step = () => {
        const P = PC_PROGS[ctl.values.prog] || PC_PROGS.blink;
        const i = s.pc < 0 ? 0 : nextIndex(P, s.pc), L = P.lines[i], before = Object.assign({}, s.v);
        s.pc = i;
        if (L.kind === 'enter') { s.setups++; s.trail.push('S'); }
        if (L.kind === 'pass') { s.passes++; s.trail.push('L'); if (s.trail.length > 18) s.trail.splice(1, 1); }
        if (L.run) L.run(s, ctl.values);
        s.changed = {};
        for (const k of Object.keys(s.v)) if (before[k] !== s.v[k]) s.changed[k] = true;
        if (s.mon.length > 40) s.mon.splice(0, s.mon.length - 40);
      };
      const ctl = kit.controls(box.side, [
        { id: 'prog', type: 'select', label: 'Program', options: [['Blink and count', 'blink'], ['BOOT button lights the LED', 'button']], value: PC_PROGS[params.program] ? params.program : 'blink' },
        { id: 'lang', type: 'select', label: 'Show it as', options: LANGS, value: 'cpp' },
        { id: 'speed', label: 'Speed', min: 0.5, max: 8, step: 0.5, value: 2, unit: 'steps/s' },
        { id: 'hold', type: 'check', label: 'Hold the BOOT button', value: false },
        { type: 'buttons', items: [{ id: 'step', label: 'Step', primary: true }, { id: 'run', label: 'Run / pause' }, { id: 'reset', label: 'Reset the chip' }] }
      ], (id) => {
        if (id === 'step') { running = false; loop.stop(); step(); }
        else if (id === 'run') { running = !running; if (running) loop.start(); else loop.stop(); }
        else if (id === 'reset' || id === 'prog') reset();
        loop.once();
      });
      const ro = kit.readout(box.side, [['line', 'Now executing'], ['setups', 'setup() has run'], ['passes', 'loop() passes'], ['up', 'Time since reset']]);
      const loop = kit.loop(dt => {
        if (running) { acc += dt * ctl.values.speed; let n = 0; while (acc >= 1 && n++ < 6) { step(); acc -= 1; } }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, P = PC_PROGS[ctl.values.prog] || PC_PROGS.blink, lang = ctl.values.lang;
        const M = 12, codeW = Math.max(190, Math.min(W * 0.56, 430, W - 170)), rows = [P.decor].concat(P.lines), lh = clamp((H - 70) / rows.length, 15, 24);
        // the program
        const top = 46;
        S.text(c, s.pc < 0 ? '▶ power on or reset: the counter is before the first line' : 'the program counter is on the highlighted line', M, 16, { size: 11.5, align: 'left', color: s.pc < 0 ? C.accent : C.muted, weight: 600 });
        const hot = s.pc >= 0 ? [s.pc + 1] : [];
        codePanel(c, kit, S, M + 14, top, codeW - 14, rows, lang, hot, lh);
        if (s.pc >= 0) { const ay = top + (s.pc + 1) * lh + lh / 2; c.fillStyle = C.accent; c.beginPath(); c.moveTo(M - 2, ay - 5); c.lineTo(M + 9, ay); c.lineTo(M - 2, ay + 5); c.closePath(); c.fill(); }
        // the two regions: once and for ever
        const iLoop = P.lines.findIndex(l => l.kind === 'pass') + 1;
        c.fillStyle = kit.hue(46, 0.9); c.fillRect(M + 3, top + lh, 3, Math.max(4, (iLoop - 1) * lh - 3));
        c.fillStyle = kit.hue(212, 0.9); c.fillRect(M + 3, top + iLoop * lh, 3, Math.max(4, (rows.length - iLoop) * lh - 2));
        // the machine
        const x0 = M + codeW + 22, wR = Math.max(110, W - x0 - M);
        S.text(c, 'setup ' + s.setups + '×  ·  loop ' + s.passes + ' passes', x0, 16, { size: 11.5, align: 'left', color: C.text2, weight: 600 });
        let y = 34;
        P.vars.forEach(name => {
          const v = s.v[name], txt = v === undefined ? 'not set yet' : typeof v === 'boolean' ? String(v) : String(v);
          S.box(c, x0, y, wR, 38, { label: name, sub: txt, active: !!s.changed[name], color: s.changed[name] ? C.accent : C.muted });
          y += 44;
        });
        y += 4;
        S.led(c, x0 + 14, y + 12, { color: 4, on: s.led, r: 11 });
        S.text(c, 'GPIO2: ' + (s.led ? 'HIGH' : 'LOW'), x0 + 34, y + 12, { size: 11.5, align: 'left', color: s.led ? C.accent : C.muted, weight: 600 });
        if (ctl.values.prog === 'button') S.button(c, x0 + Math.min(wR - 30, 150), y + 12, { pressed: !!ctl.values.hold });
        y += 34;
        const monH = clamp(H - y - 56, 52, 92);
        rrPath(c, x0, y, wR, monH, 6); c.fillStyle = C.dark ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.05)'; c.fill(); c.strokeStyle = C.border2 || C.faint; c.lineWidth = 1; c.stroke();
        S.text(c, 'serial monitor', x0 + 8, y + 10, { size: 10, align: 'left', color: C.faint });
        const shown = s.mon.slice(-Math.max(1, Math.floor((monH - 20) / 14)));
        shown.forEach((t, k) => S.text(c, t, x0 + 8, y + 24 + k * 14, { size: 11.5, align: 'left', mono: true, color: C.text }));
        y += monH + 10;
        // the history of the run: S = setup, L = one pass of loop()
        S.text(c, 'history:', x0, y + 9, { size: 10.5, align: 'left', color: C.muted });
        const cell = clamp((wR - 48) / 19, 9, 17);
        s.trail.forEach((t, k) => {
          const cx = x0 + 46 + k * cell, last = k === s.trail.length - 1;
          rrPath(c, cx, y, cell - 2, cell - 2, 3); c.fillStyle = t === 'S' ? kit.hue(46, 0.9) : kit.hue(212, last ? 1 : 0.55); c.fill();
        });
        S.text(c, 'S setup · L one loop pass', x0, y + 24, { size: 10, align: 'left', color: C.faint });
        const cur = s.pc >= 0 ? (P.lines[s.pc][lang === 'blocks' ? 'b' : lang === 'cpp' ? 'c' : 'p'] || '(end of the pass)') : 'nothing yet: the chip has just been reset';
        ro.set('line', cur.replace(/\s+v\]/g, ']'));
        ro.set('setups', String(s.setups));
        ro.set('passes', String(s.passes));
        ro.set('up', s.ms + ' ms');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ps-variable-box */
  const SPECS = {
    u8: { bits: 8, signed: false, name: 'uint8_t' }, i8: { bits: 8, signed: true, name: 'int8_t' },
    u16: { bits: 16, signed: false, name: 'uint16_t' }, i16: { bits: 16, signed: true, name: 'int16_t' },
    u32: { bits: 32, signed: false, name: 'uint32_t' }, i32: { bits: 32, signed: true, name: 'int32_t (int)' }
  };
  const specMin = sp => (sp.signed ? -Math.pow(2, sp.bits - 1) : 0);
  const specMax = sp => (sp.signed ? Math.pow(2, sp.bits - 1) - 1 : Math.pow(2, sp.bits) - 1);
  const wrapTo = (sp, x) => { const m = Math.pow(2, sp.bits); let v = ((x % m) + m) % m; if (sp.signed && v >= m / 2) v -= m; return v; };

  Hyper.sim('ps-variable-box', {
    title: 'A variable is a box of a given size',
    blurb: `A C++ variable has a fixed number of bits. Count into it until it is full: the next step wraps round to the other end. A Python integer has no such limit. In the **millis()** view the box is the 32-bit clock of the chip, and the question is whether an elapsed-time test survives the day the clock wraps.

**Try this**
- Choose \`uint8_t\`, press **Near the limit**, then **+1** a few times: 255 + 1 is 0, and Python's integer carries on at 256.
- Choose \`int16_t\` and count past 32 767: the value turns negative. Press **−1** on a \`uint8_t\` at 0: it jumps to 255.
- Tick **Count on its own** and watch how often each size wraps at the same speed.
- Open the **millis()** view (the page on timing): slide **Distance from the wrap** through zero. The subtraction stays right; comparing two absolute times does not.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const millisMode = params.mode === 'millis';
      const st = kit.stage(box.stage, { aspect: millisMode ? 0.6 : 0.62, minH: 300, maxH: 520 });
      const SPAN = 3000;
      let key = SPECS[params.type] ? params.type : 'u8', trueVal = 0, last = 'nothing added yet', acc = 0;
      const defs = millisMode ? [
        { id: 'off', label: 'Distance from the wrap', min: -3000, max: 3000, step: 10, value: -1200, unit: 'ms' },
        { id: 'ago', label: 'Time since the job last ran', min: 0, max: 1500, step: 10, value: 300, unit: 'ms' },
        { id: 'interval', type: 'select', label: 'Interval of the job', options: [['100 ms', 100], ['500 ms', 500], ['1000 ms', 1000]], value: 500 }
      ] : [
        { id: 'type', type: 'select', label: 'C++ type', options: Object.keys(SPECS).map(k => [SPECS[k].name + '  (' + fmtInt(specMin(SPECS[k])) + ' … ' + fmtInt(specMax(SPECS[k])) + ')', k]), value: key },
        { id: 'auto', type: 'check', label: 'Count on its own', value: false },
        { id: 'rate', label: 'Counts per second', min: 1, max: 500, step: 1, value: 40, unit: '/s', log: true },
        { type: 'buttons', items: [{ id: 'p1', label: '+1', primary: true }, { id: 'p10', label: '+10' }, { id: 'p100', label: '+100' }, { id: 'm1', label: '−1' }, { id: 'near', label: 'Near the limit' }, { id: 'zero', label: 'Reset to 0' }] }
      ];
      const add = n => {
        const sp = SPECS[key], before = wrapTo(sp, trueVal);
        trueVal += n;
        const now = wrapTo(sp, trueVal), wrapped = (n > 0 && now < before) || (n < 0 && now > before);
        last = fmtInt(before) + (n >= 0 ? ' + ' : ' − ') + fmtInt(Math.abs(n)) + ' = ' + fmtInt(now) + (wrapped ? '   — wrapped round' : '');
      };
      const ctl = kit.controls(box.side, defs, (id, v) => {
        if (millisMode) { loop.once(); return; }
        const sp = SPECS[key];
        if (id === 'type') { key = v; trueVal = 0; last = 'nothing added yet'; }
        else if (id === 'p1') add(1); else if (id === 'p10') add(10); else if (id === 'p100') add(100); else if (id === 'm1') add(-1);
        else if (id === 'near') { trueVal = specMax(sp) - 3; last = 'moved to ' + fmtInt(specMax(sp) - 3); }
        else if (id === 'zero') { trueVal = 0; last = 'reset to 0'; }
        else if (id === 'auto') { if (v) loop.start(); else loop.stop(); }
        loop.once();
      });
      const ro = millisMode
        ? kit.readout(box.side, [['now', 'millis() now'], ['last', 'millis() at the last run'], ['diff', 'now − last (unsigned)'], ['fires', 'Subtraction says'], ['naive', 'now ≥ last + interval says'], ['truth', 'In truth']])
        : kit.readout(box.side, [['cpp', 'C++ value'], ['py', 'Python integer'], ['wraps', 'Times wrapped'], ['bytes', 'Memory']]);
      const drawBox = (c, C, W, H) => {
        const sp = SPECS[key], v = wrapTo(sp, trueVal), lo = specMin(sp), hi = specMax(sp), M = 14;
        S.text(c, sp.name + ': a box of ' + sp.bits + ' bits', M, 16, { size: 13, align: 'left', weight: 650, color: C.text });
        // the bits
        const cell = clamp(Math.floor((W - 2 * M) / sp.bits), 9, 26), bx = M, by = 40;
        const raw = v < 0 ? v + Math.pow(2, sp.bits) : v;
        S.bits(c, bx, by, raw, { n: sp.bits, cell, labels: cell >= 14, color: kit.hue(212, 0.95) });
        // the scale from smallest to largest, and the marker
        const sy = by + cell + 54, sw = W - 2 * M;
        c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'; c.fillRect(M, sy, sw, 12);
        const fx = M + sw * (v - lo) / (hi - lo);
        c.fillStyle = kit.hue(212, 0.9); c.fillRect(M, sy, Math.max(2, fx - M), 12);
        c.fillStyle = C.accent; c.fillRect(fx - 2, sy - 6, 4, 24);
        S.text(c, fmtInt(lo), M, sy + 28, { size: 10.5, align: 'left', color: C.muted });
        S.text(c, fmtInt(hi), M + sw, sy + 28, { size: 10.5, align: 'right', color: C.muted });
        S.text(c, fmtInt(v), clamp(fx, M + 56, M + sw - 56), sy - 16, { size: 13, weight: 700, color: C.accent });
        // the two languages side by side
        const py = sy + 52, hw = (sw - 12) / 2;
        S.box(c, M, py, hw, 62, { label: fmtInt(v), sub: 'C++ ' + sp.name + ' — wraps', active: true, color: C.accent, size: 16 });
        S.box(c, M + hw + 12, py, hw, 62, { label: fmtInt(trueVal), sub: 'Python int — no limit', color: C.ok, size: 16 });
        S.text(c, last, M, py + 82, { size: 12, align: 'left', color: /wrapped/.test(last) ? C.warn : C.text2, weight: /wrapped/.test(last) ? 700 : 500, mono: true });
        const range = Math.pow(2, sp.bits), wraps = Math.floor((trueVal - lo) / range);
        ro.set('cpp', fmtInt(v));
        ro.set('py', fmtInt(trueVal));
        ro.set('wraps', String(Math.abs(wraps)) + (wraps < 0 ? ' (below the minimum)' : ''));
        ro.set('bytes', sp.bits / 8 + (sp.bits === 8 ? ' byte' : ' bytes'));
      };
      const drawMillis = (c, C, W, H) => {
        const M = 16, off = ctl.values.off, ago = ctl.values.ago, iv = ctl.values.interval, W32 = 4294967296;
        const nowTrue = W32 + off, lastTrue = nowTrue - ago;
        const now = nowTrue % W32, lastV = lastTrue % W32;
        const diff = ((now - lastV) % W32 + W32) % W32, sum = (lastV + iv) % W32;
        const fires = diff >= iv, naive = now >= sum, truth = ago >= iv;
        S.text(c, 'millis() is a 32-bit box: it wraps after ' + fmtInt(W32) + ' ms = 49.71 days', M, 16, { size: 13, align: 'left', weight: 650, color: C.text });
        // time axis around the wrap
        const ax = M + 6, aw = W - 2 * M - 12, ay = 92, X = t => ax + aw * (t + SPAN) / (2 * SPAN);
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(ax, ay); c.lineTo(ax + aw, ay); c.stroke();
        c.strokeStyle = C.bad; c.lineWidth = 1.5; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(X(0), ay - 34); c.lineTo(X(0), ay + 42); c.stroke(); c.setLineDash([]);
        S.text(c, 'the counter wraps to 0 here', X(0), ay - 44, { size: 11, color: C.bad, weight: 600 });
        [-3000, -2000, -1000, 0, 1000, 2000, 3000].forEach(t => {
          const reg = t < 0 ? W32 + t : t;
          c.strokeStyle = C.axis; c.beginPath(); c.moveTo(X(t), ay - 4); c.lineTo(X(t), ay + 4); c.stroke();
          S.text(c, fmtInt(reg), t === -3000 ? X(t) - 6 : t === 3000 ? X(t) + 6 : X(t), ay + 18, { size: 9.5, color: C.faint, mono: true, align: t === -3000 ? 'left' : t === 3000 ? 'right' : 'center' });
        });
        const mark = (t, label, color, dy) => { c.fillStyle = color; c.beginPath(); c.arc(X(clamp(t, -SPAN, SPAN)), ay, 6, 0, kit.TAU); c.fill(); S.text(c, label, clamp(X(clamp(t, -SPAN, SPAN)), M + 28, W - M - 28), ay + dy, { size: 11.5, color, weight: 650 }); };
        mark(off - ago, 'last ran', C.warn, -16);
        mark(off, 'now', C.accent, 34);
        // the verdicts
        const vy = ay + 72, vw = (W - 2 * M - 16) / 3, verdict = (x, title, ok, line) => {
          S.box(c, x, vy, vw, 70, { label: ok ? 'fires' : 'waits', sub: title, color: ok ? C.ok : C.muted, active: ok, size: 15 });
          S.text(c, line, x + vw / 2, vy + 84, { size: 10, color: C.muted, mono: true });
        };
        verdict(M, 'now − last ≥ ' + iv, fires, fmtInt(diff) + ' ≥ ' + iv);
        verdict(M + vw + 8, 'now ≥ last + ' + iv, naive, fmtInt(now) + ' ≥ ' + fmtInt(sum));
        verdict(M + 2 * (vw + 8), 'in truth', truth, ago + ' ms ≥ ' + iv + ' ms');
        const good = fires === truth, naiveGood = naive === truth;
        S.text(c, good ? (naiveGood ? 'Both tests agree with the truth here.' : 'The subtraction is right; the absolute comparison is wrong.') : 'Unexpected: the subtraction disagrees with the truth.', M, vy + 108, { size: 12, align: 'left', color: naiveGood ? C.text2 : C.warn, weight: 650 });
        ro.set('now', fmtInt(now));
        ro.set('last', fmtInt(lastV));
        ro.set('diff', fmtInt(diff) + ' ms');
        ro.set('fires', fires ? 'run the job' : 'wait');
        ro.set('naive', naive ? 'run the job' : 'wait');
        ro.set('truth', truth ? 'the interval has passed' : 'not yet');
      };
      const loop = kit.loop(dt => {
        if (!millisMode && ctl.values.auto) { acc += dt * ctl.values.rate; const n = Math.floor(acc); if (n > 0) { acc -= n; add(n); } }
        const c = st.begin(), C = kit.colors();
        if (millisMode) drawMillis(c, C, st.W, st.H); else drawBox(c, C, st.W, st.H);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ ps-flow */
  const row = (i, b, c, p) => ({ i, b, c, p });
  const FLOW = {
    ifelse: {
      name: 'if / else if / else',
      rows: () => [
        row(0, 'set [t v] to (read temperature)', 'float t = readTemperature();', 't = readTemperature()'),
        row(0, 'if <(t) > (30)> then', 'if (t > 30) {', 'if t > 30:'),
        row(1, 'print [hot]', 'Serial.println("hot");', 'print("hot")'),
        row(0, 'else if <(t) > (20)> then', '} else if (t > 20) {', 'elif t > 20:'),
        row(1, 'print [warm]', 'Serial.println("warm");', 'print("warm")'),
        row(0, 'else', '} else {', 'else:'),
        row(1, 'print [cool]', 'Serial.println("cool");', 'print("cool")'),
        row(0, 'end', '}', '')
      ],
      nodes: [
        { id: 'start', kind: 'term', text: () => 'start', x: 0.38, y: 0.05, rows: [] },
        { id: 'read', kind: 'act', text: () => 'read t', x: 0.38, y: 0.2, rows: [0] },
        { id: 'c1', kind: 'cond', text: () => 't > 30 ?', x: 0.38, y: 0.38, rows: [1] },
        { id: 'hot', kind: 'act', text: () => 'print hot', x: 0.76, y: 0.38, rows: [2] },
        { id: 'c2', kind: 'cond', text: () => 't > 20 ?', x: 0.38, y: 0.58, rows: [3] },
        { id: 'warm', kind: 'act', text: () => 'print warm', x: 0.76, y: 0.58, rows: [4] },
        { id: 'cool', kind: 'act', text: () => 'print cool', x: 0.38, y: 0.78, rows: [5, 6] },
        { id: 'end', kind: 'term', text: () => 'end', x: 0.62, y: 0.94, rows: [7] }
      ],
      edges: [
        { a: 'start', as: 'b', b: 'read', bs: 't' }, { a: 'read', as: 'b', b: 'c1', bs: 't' },
        { a: 'c1', as: 'r', b: 'hot', bs: 'l', label: 'yes' }, { a: 'c1', as: 'b', b: 'c2', bs: 't', label: 'no' },
        { a: 'c2', as: 'r', b: 'warm', bs: 'l', label: 'yes' }, { a: 'c2', as: 'b', b: 'cool', bs: 't', label: 'no' },
        { a: 'hot', as: 'r', b: 'end', bs: 'r', via: [[0.96, 0.38], [0.96, 0.94]] }, { a: 'warm', as: 'r', b: 'end', bs: 'r', via: [[0.96, 0.58], [0.96, 0.94]] },
        { a: 'cool', as: 'b', b: 'end', bs: 'l', via: [[0.38, 0.94]] }
      ],
      exec(id, v, o, s) {
        switch (id) {
          case 'start': return 'read';
          case 'read': v.t = o.t; return 'c1';
          case 'c1': return v.t > 30 ? 'hot' : 'c2';
          case 'c2': return v.t > 20 ? 'warm' : 'cool';
          case 'hot': s.out.push('hot'); return 'end';
          case 'warm': s.out.push('warm'); return 'end';
          case 'cool': s.out.push('cool'); return 'end';
          default: return 'end';
        }
      },
      vars: v => (v.t === undefined ? '' : 't = ' + v.t)
    },
    loop: {
      name: 'for loop (sum of 0 … n−1)',
      rows: o => [
        row(0, 'set [total v] to (0)', 'int total = 0;', 'total = 0'),
        row(0, 'for each [i v] in (range 0 to ' + (o.n - 1) + ')', 'for (int i = 0; i < ' + o.n + '; i++) {', 'for i in range(' + o.n + '):'),
        row(1, 'change [total v] by (i)', 'total += i;', 'total += i'),
        row(0, 'end', '}', ''),
        row(0, 'print (total)', 'Serial.println(total);', 'print(total)')
      ],
      nodes: [
        { id: 'start', kind: 'term', text: () => 'start', x: 0.4, y: 0.05, rows: [] },
        { id: 'init', kind: 'act', text: () => 'total = 0,  i = 0', x: 0.4, y: 0.19, rows: [0, 1] },
        { id: 'test', kind: 'cond', text: o => 'i < ' + o.n + ' ?', x: 0.4, y: 0.37, rows: [1] },
        { id: 'body', kind: 'act', text: () => 'total += i', x: 0.4, y: 0.57, rows: [2] },
        { id: 'inc', kind: 'act', text: () => 'i++', x: 0.4, y: 0.74, rows: [1] },
        { id: 'print', kind: 'act', text: () => 'print total', x: 0.8, y: 0.37, rows: [4] },
        { id: 'end', kind: 'term', text: () => 'end', x: 0.8, y: 0.57, rows: [3, 4] }
      ],
      edges: [
        { a: 'start', as: 'b', b: 'init', bs: 't' }, { a: 'init', as: 'b', b: 'test', bs: 't' },
        { a: 'test', as: 'b', b: 'body', bs: 't', label: 'yes' }, { a: 'body', as: 'b', b: 'inc', bs: 't' },
        { a: 'inc', as: 'l', b: 'test', bs: 'l', via: [[0.05, 0.74], [0.05, 0.37]] },
        { a: 'test', as: 'r', b: 'print', bs: 'l', label: 'no' }, { a: 'print', as: 'b', b: 'end', bs: 't' }
      ],
      exec(id, v, o, s) {
        switch (id) {
          case 'start': return 'init';
          case 'init': v.total = 0; v.i = 0; return 'test';
          case 'test': return v.i < o.n ? 'body' : 'print';
          case 'body': v.total += v.i; return 'inc';
          case 'inc': v.i++; return 'test';
          case 'print': s.out.push(String(v.total)); return 'end';
          default: return 'end';
        }
      },
      vars: v => (v.total === undefined ? '' : 'total = ' + v.total + (v.i === undefined ? '' : ',  i = ' + v.i))
    },
    wait: {
      name: 'while loop (wait for the button)',
      rows: () => [
        row(0, 'while <(read pin (0)) = [LOW v]>', 'while (digitalRead(0) == LOW) {', 'while button.value() == 0:'),
        row(1, 'wait (0.01) seconds', 'delay(10);', 'time.sleep_ms(10)'),
        row(0, 'end', '}', ''),
        row(0, 'print [released]', 'Serial.println("released");', 'print("released")')
      ],
      nodes: [
        { id: 'start', kind: 'term', text: () => 'start', x: 0.42, y: 0.05, rows: [] },
        { id: 'test', kind: 'cond', text: () => 'button LOW ?', x: 0.42, y: 0.27, rows: [0] },
        { id: 'wait', kind: 'act', text: () => 'wait 10 ms', x: 0.42, y: 0.5, rows: [1] },
        { id: 'print', kind: 'act', text: () => 'print released', x: 0.8, y: 0.27, rows: [3] },
        { id: 'end', kind: 'term', text: () => 'end', x: 0.8, y: 0.5, rows: [2, 3] }
      ],
      edges: [
        { a: 'start', as: 'b', b: 'test', bs: 't' }, { a: 'test', as: 'b', b: 'wait', bs: 't', label: 'yes' },
        { a: 'wait', as: 'l', b: 'test', bs: 'l', via: [[0.05, 0.5], [0.05, 0.27]] },
        { a: 'test', as: 'r', b: 'print', bs: 'l', label: 'no' }, { a: 'print', as: 'b', b: 'end', bs: 't' }
      ],
      exec(id, v, o, s) {
        switch (id) {
          case 'start': v.checks = 0; return 'test';
          case 'test': v.checks++; return o.held ? 'wait' : 'print';
          case 'wait': return 'test';
          case 'print': s.out.push('released'); return 'end';
          default: return 'end';
        }
      },
      vars: v => (v.checks === undefined ? '' : 'the test has run ' + v.checks + ' ×')
    }
  };

  Hyper.sim('ps-flow', {
    title: 'Flow: conditions and loops step by step',
    blurb: `The chart on the left is the program drawn as a flow: diamonds are questions, boxes are actions. The code on the right is the same program in your choice of notation; the lit line is the one being executed.

**Try this**
- Take the first example and slide the **temperature** across 20 and 30 before pressing **Step** through the chart: exactly one branch is taken.
- In the \`for\` example the three jobs of the \`for\` line — start, test, step — light the same line three times. Change the **repeat count** and see the loop go round that many times.
- In the \`while\` example leave **Button held** ticked and press **Run**: the loop spins for ever. Untick it while it runs and the loop ends on its next test.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 520 });
      let running = false, acc = 0, s = null;
      const o0 = () => ({ t: ctl.values.t, n: Math.round(ctl.values.n), held: !!ctl.values.held });
      const reset = () => { s = { node: 'start', v: {}, out: [], steps: 0, visited: {}, edge: '', done: false }; };
      reset();
      const step = () => {
        const F = FLOW[ctl.values.ex], o = o0();
        if (s.done) return;
        const cur = s.node, nxt = F.exec(cur, s.v, o, s);
        s.visited[cur] = true; s.steps++;
        s.edge = cur + '>' + nxt;
        s.node = nxt;
        if (nxt === 'end') { s.done = true; s.visited.end = true; }
      };
      const ctl = kit.controls(box.side, [
        { id: 'ex', type: 'select', label: 'Example', options: Object.keys(FLOW).map(k => [FLOW[k].name, k]), value: FLOW[params.ex] ? params.ex : 'ifelse' },
        { id: 't', label: 'Temperature', min: 0, max: 40, step: 1, value: 24, unit: '°C' },
        { id: 'n', label: 'Repeat count', min: 1, max: 8, step: 1, value: 5 },
        { id: 'held', type: 'check', label: 'Button held down', value: true },
        { id: 'lang', type: 'select', label: 'Show the code as', options: LANGS, value: 'cpp' },
        { id: 'speed', label: 'Speed', min: 0.5, max: 6, step: 0.5, value: 1.5, unit: 'steps/s' },
        { type: 'buttons', items: [{ id: 'step', label: 'Step', primary: true }, { id: 'run', label: 'Run / pause' }, { id: 'again', label: 'Start again' }] }
      ], (id) => {
        const ex = ctl.values.ex;
        ctl.show('t', ex === 'ifelse'); ctl.show('n', ex === 'loop'); ctl.show('held', ex === 'wait');
        if (id === 'step') { running = false; loop.stop(); step(); }
        else if (id === 'run') { running = !running; if (running) loop.start(); else loop.stop(); }
        else if (id === 'again' || id === 'ex' || id === 't' || id === 'n') reset();
        loop.once();
      });
      const ro = kit.readout(box.side, [['now', 'Now'], ['vars', 'Variables'], ['out', 'Printed'], ['steps', 'Steps taken']]);
      const loop = kit.loop(dt => {
        if (running) { acc += dt * ctl.values.speed; let k = 0; while (acc >= 1 && k++ < 4) { step(); acc -= 1; } }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, F = FLOW[ctl.values.ex], o = o0(), lang = ctl.values.lang;
        ctl.show('t', ctl.values.ex === 'ifelse'); ctl.show('n', ctl.values.ex === 'loop'); ctl.show('held', ctl.values.ex === 'wait');
        // the chart
        const M = 10, cw = Math.max(200, Math.min(W * 0.46, 370)), ch = H - 2 * M - 4, nw = clamp(cw * 0.3, 78, 128), nh = 32;
        const geo = {};
        F.nodes.forEach(n => { const w = n.kind === 'cond' ? nw + 14 : nw, h = n.kind === 'cond' ? nh + 14 : nh; geo[n.id] = { cx: M + n.x * cw, cy: M + 6 + n.y * (ch - 8), w, h }; });
        const anchor = (id, side) => { const g = geo[id]; return side === 't' ? [g.cx, g.cy - g.h / 2] : side === 'b' ? [g.cx, g.cy + g.h / 2] : side === 'l' ? [g.cx - g.w / 2, g.cy] : [g.cx + g.w / 2, g.cy]; };
        F.edges.forEach(e => {
          const pts = [anchor(e.a, e.as)].concat((e.via || []).map(p => [M + p[0] * cw, M + 6 + p[1] * (ch - 8)]), [anchor(e.b, e.bs)]);
          const on = s.edge === e.a + '>' + e.b, col = on ? C.accent : (C.dark ? 'rgba(200,205,230,.45)' : 'rgba(60,66,90,.5)');
          c.strokeStyle = col; c.lineWidth = on ? 2.6 : 1.4; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
          for (let k = 1; k < pts.length - 1; k++) c.lineTo(pts[k][0], pts[k][1]);
          const q = pts[pts.length - 2], z = pts[pts.length - 1], len = Math.hypot(z[0] - q[0], z[1] - q[1]) || 1, ux = (z[0] - q[0]) / len, uy = (z[1] - q[1]) / len;
          c.lineTo(z[0] - ux * 7, z[1] - uy * 7); c.stroke();
          c.fillStyle = col; c.beginPath(); c.moveTo(z[0], z[1]); c.lineTo(z[0] - ux * 8 - uy * 4, z[1] - uy * 8 + ux * 4); c.lineTo(z[0] - ux * 8 + uy * 4, z[1] - uy * 8 - ux * 4); c.closePath(); c.fill();
          if (e.label) { const a0 = pts[0], a1 = pts[1]; S.text(c, e.label, (a0[0] + a1[0]) / 2 + (e.as === 'r' ? 0 : 14), (a0[1] + a1[1]) / 2 + (e.as === 'r' ? -9 : 0), { size: 10.5, color: on ? C.accent : C.muted, weight: 650 }); }
        });
        F.nodes.forEach(n => {
          const g = geo[n.id], act = s.node === n.id, seen = !!s.visited[n.id];
          c.beginPath();
          if (n.kind === 'cond') { c.moveTo(g.cx, g.cy - g.h / 2); c.lineTo(g.cx + g.w / 2, g.cy); c.lineTo(g.cx, g.cy + g.h / 2); c.lineTo(g.cx - g.w / 2, g.cy); c.closePath(); }
          else rrPath(c, g.cx - g.w / 2, g.cy - g.h / 2, g.w, g.h, n.kind === 'term' ? g.h / 2 : 6);
          c.fillStyle = act ? (C.dark ? 'rgba(123,140,255,.38)' : 'rgba(60,90,220,.22)') : seen ? (C.dark ? 'rgba(123,140,255,.12)' : 'rgba(60,90,220,.08)') : C.surface;
          c.fill(); c.lineWidth = act ? 2.6 : 1.3; c.strokeStyle = act ? C.accent : C.muted; c.stroke();
          S.text(c, n.text(o), g.cx, g.cy, { size: n.kind === 'cond' ? 10.5 : 11, color: C.text, weight: act ? 700 : 500 });
        });
        // the code
        const rows = F.rows(o), cx0 = M + cw + 24, cwid = Math.max(120, W - cx0 - M), lh = clamp((H - 60) / rows.length, 15, 24);
        S.text(c, 'the same program as code', cx0, 18, { size: 11.5, align: 'left', color: C.muted, weight: 600 });
        const cur = F.nodes.find(n => n.id === s.node);
        codePanel(c, kit, S, cx0, 36, cwid, rows, lang, cur ? cur.rows : [], lh);
        ro.set('now', cur ? cur.text(o) : '—');
        ro.set('vars', F.vars(s.v) || 'none yet');
        ro.set('out', s.out.length ? s.out.join(', ') : 'nothing yet');
        ro.set('steps', String(s.steps));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ps-callstack */
  const STACK_BYTES = 8192, LOOP_FRAME = 16, FACT_FRAME = 48;
  const CS_PROGS = {
    nested: {
      name: 'Calls inside calls',
      rows: () => [
        row(0, 'define flash (ms)', 'void flash(int ms) {', 'def flash(ms):'),
        row(1, 'set pin (2) to [HIGH v]', 'digitalWrite(LED_PIN, HIGH);', 'led.value(1)'),
        row(1, 'wait ((ms) / (1000)) seconds', 'delay(ms);', 'time.sleep_ms(ms)'),
        row(1, 'set pin (2) to [LOW v]', 'digitalWrite(LED_PIN, LOW);', 'led.value(0)'),
        row(0, '', '}', ''),
        row(0, 'define blink (times)', 'void blink(int times) {', 'def blink(times):'),
        row(1, 'repeat (times)', 'for (int i = 0; i < times; i++) {', 'for i in range(times):'),
        row(2, 'flash (100) :: my', 'flash(100);', 'flash(100)'),
        row(1, 'end', '}', ''),
        row(0, '', '}', ''),
        row(0, 'forever', 'void loop() {', 'while True:'),
        row(1, 'blink (2) :: my', 'blink(2);', 'blink(2)'),
        row(0, 'end', '}', '')
      ],
      build(o) {
        const snaps = [], T = Math.round(o.times);
        const base = [{ fn: 'loopTask', sub: 'calls loop() again and again', bytes: 0 }, { fn: 'loop()', sub: '', bytes: LOOP_FRAME }];
        const push = (stack, ln, note) => snaps.push({ stack: stack.map(f => Object.assign({}, f)), ln, note });
        push(base, 10, 'The core calls loop(): a pass begins.');
        push(base, 11, 'loop() calls blink(' + T + ').');
        const blink = { fn: 'blink(times = ' + T + ')', sub: '', bytes: 48 };
        for (let i = 0; i < T; i++) {
          blink.sub = 'i = ' + i;
          push(base.concat([blink]), 6, 'blink: the loop goes round with i = ' + i + '.');
          push(base.concat([blink]), 7, 'blink calls flash(100).');
          const fl = base.concat([blink, { fn: 'flash(ms = 100)', sub: '', bytes: 32 }]);
          push(fl, 1, 'flash: the LED goes on.'); push(fl, 2, 'flash: it waits 100 ms.'); push(fl, 3, 'flash: the LED goes off.');
          push(base.concat([blink]), 7, 'flash returns: its frame is gone, blink carries on.');
        }
        blink.sub = 'done';
        push(base.concat([blink]), 8, 'The loop in blink is finished.');
        push(base, 11, 'blink returns; loop() carries on.');
        push(base, 12, 'loop() ends; the core will call it again.');
        return { snaps, cpp: '—', py: '—' };
      }
    },
    fact: {
      name: 'Recursion: factorial(n)',
      rows: () => [
        row(0, 'define factorial (n)', 'long factorial(int n) {', 'def factorial(n):'),
        row(1, 'if <(n) ≤ (1)> then', 'if (n <= 1) {', 'if n <= 1:'),
        row(2, 'return (1)', 'return 1;', 'return 1'),
        row(1, 'end', '}', ''),
        row(1, 'return ((n) * (factorial ((n) - (1))))', 'return n * factorial(n - 1);', 'return n * factorial(n - 1)'),
        row(0, '', '}', ''),
        row(0, 'forever', 'void loop() {', 'while True:'),
        row(1, 'set [r v] to (factorial (n))', 'long r = factorial(n);', 'r = factorial(n)'),
        row(0, 'end', '}', '')
      ],
      build(o) {
        const snaps = [], n = Math.round(o.n), noBase = !!o.nobase;
        const base = [{ fn: 'loopTask', sub: 'calls loop() again and again', bytes: 0 }, { fn: 'loop()', sub: '', bytes: LOOP_FRAME }];
        const push = (frames, ln, note, extra) => snaps.push(Object.assign({ stack: base.concat(frames).map(f => Object.assign({}, f)), ln, note }, extra || {}));
        const frames = [];
        push([], 6, 'The core calls loop(): a pass begins.');
        push([], 7, 'loop() calls factorial(' + (noBase ? 'n' : n) + ').');
        let overflow = false, k = n;
        for (; ; k--) {
          const bytes = LOOP_FRAME + (frames.length + 1) * FACT_FRAME;
          if (bytes > STACK_BYTES) { overflow = true; break; }
          frames.push({ fn: 'factorial(n = ' + k + ')', sub: '', bytes: FACT_FRAME });
          push(frames, 1, 'factorial(' + k + '): is n <= 1 ?');
          if (k > 1 || noBase) { frames[frames.length - 1].sub = 'waits for factorial(' + (k - 1) + ')'; push(frames, 4, 'factorial(' + k + ') calls factorial(' + (k - 1) + ').'); }
          else { push(frames, 2, 'factorial(1) returns 1: the base case ends the chain.'); break; }
        }
        if (overflow) { push(frames, 4, 'The stack is full: the next call has no room.', { overflow: true }); return { snaps, cpp: 'stack overflow', py: 'RuntimeError: maximum recursion depth exceeded' }; }
        let val = 1, bigv = 1n;
        for (let j = 2; j <= n; j++) {
          frames.pop();
          const prev = val; val = Math.imul(val, j); bigv *= BigInt(j);
          frames[frames.length - 1].sub = 'got ' + fmtInt(prev) + ' → returns ' + j + ' × ' + fmtInt(prev) + ' = ' + fmtInt(val);
          push(frames, 4, 'factorial(' + (j - 1) + ') returned ' + fmtInt(prev) + '; factorial(' + j + ') returns ' + fmtInt(val) + '.');
        }
        frames.pop();
        push([], 7, 'factorial(' + n + ') returned ' + fmtInt(val) + ' to loop().');
        return { snaps, cpp: fmtInt(val), py: fmtInt(bigv.toString()) };
      }
    }
  };

  Hyper.sim('ps-callstack', {
    title: 'The call stack',
    blurb: `Each call puts a **frame** on the stack — the function's parameters and local variables — and each return takes it off. The tower on the right is the stack at the highlighted line of the code on the left.

**Try this**
- Step through *Calls inside calls*: the tower reaches four plates (the loop task, loop, blink, flash) and shrinks back at every return.
- Choose *Recursion* and raise **n**: the tower is n frames high at the deepest point, and the results come back as it unwinds. Above 12 the C++ result stops matching the Python one, because the \`long\` overflows (see the page on types).
- Tick **Forget the base case**: the recursion never stops and the stack fills up. The frame sizes here are schematic; the real numbers depend on the compiler, but the Arduino loop task has about 8 KB by default.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340, maxH: 540 });
      let running = false, acc = 0, pos = 0, built = null;
      const rebuild = () => { built = CS_PROGS[ctl.values.prog].build({ times: ctl.values.times, n: ctl.values.n, nobase: ctl.values.nobase }); pos = 0; };
      const ctl = kit.controls(box.side, [
        { id: 'prog', type: 'select', label: 'Program', options: Object.keys(CS_PROGS).map(k => [CS_PROGS[k].name, k]), value: CS_PROGS[params.prog] ? params.prog : 'nested' },
        { id: 'times', label: 'blink(times)', min: 1, max: 4, step: 1, value: 2 },
        { id: 'n', label: 'n', min: 1, max: 20, step: 1, value: 5 },
        { id: 'nobase', type: 'check', label: 'Forget the base case', value: false },
        { id: 'lang', type: 'select', label: 'Show the code as', options: LANGS, value: 'cpp' },
        { type: 'buttons', items: [{ id: 'next', label: 'Step ▶', primary: true }, { id: 'back', label: '◀ Back' }, { id: 'run', label: 'Run / pause' }, { id: 'again', label: 'Start again' }] }
      ], (id) => {
        if (id === 'next') { running = false; loop.stop(); pos = Math.min(built.snaps.length - 1, pos + 1); }
        else if (id === 'back') { running = false; loop.stop(); pos = Math.max(0, pos - 1); }
        else if (id === 'run') { running = !running; if (running) loop.start(); else loop.stop(); }
        else if (id === 'again') pos = 0;
        else if (id !== 'lang') rebuild();
        loop.once();
      });
      rebuild();
      const ro = kit.readout(box.side, [['depth', 'Frames on the stack'], ['bytes', 'Stack in use'], ['cpp', 'C++ result'], ['py', 'Python result']]);
      const loop = kit.loop(dt => {
        if (running) { acc += dt * (ctl.values.prog === 'fact' && ctl.values.nobase ? 14 : 2.5); while (acc >= 1) { acc -= 1; if (pos < built.snaps.length - 1) pos++; else { running = false; loop.stop(); } } }
        const isFact = ctl.values.prog === 'fact';
        ctl.show('times', !isFact); ctl.show('n', isFact); ctl.show('nobase', isFact);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, P = CS_PROGS[ctl.values.prog], sn = built.snaps[pos], rows = P.rows(), lang = ctl.values.lang;
        const M = 10, cw = Math.max(190, Math.min(W * 0.5, 380)), lh = clamp((H - 70) / rows.length, 15, 24);
        S.text(c, 'the code', M, 18, { size: 11.5, align: 'left', color: C.muted, weight: 600 });
        codePanel(c, kit, S, M, 36, cw, rows, lang, [sn.ln], lh);
        // the tower of frames
        const x0 = M + cw + 24, wR = Math.max(130, W - x0 - M), fh = 34, gap = 5, maxShow = Math.max(4, Math.floor((H - 130) / (fh + gap)));
        S.text(c, 'the call stack — newest on top', x0, 18, { size: 11.5, align: 'left', color: C.muted, weight: 600 });
        const frames = sn.stack, total = frames.length;
        let shown = frames.map((f, i) => ({ f, i }));
        let hidden = 0;
        if (total > maxShow) { hidden = total - maxShow + 1; shown = frames.slice(0, 2).map((f, i) => ({ f, i })).concat([{ gap: true }], frames.slice(total - (maxShow - 3)).map((f, i) => ({ f, i: total - (maxShow - 3) + i }))); }
        const bottom = H - 76;
        shown.forEach((e, k) => {
          const y = bottom - (k + 1) * (fh + gap) + gap;
          if (e.gap) { S.text(c, '… ' + hidden + ' more frames …', x0 + wR / 2, y + fh / 2, { size: 12, color: C.warn, weight: 650 }); return; }
          const top = e.i === total - 1;
          S.box(c, x0, y, wR, fh, { label: e.f.fn, sub: e.f.sub || ' ', active: top, color: top ? C.accent : C.muted, size: 11.5 });
        });
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 - 4, bottom + 4); c.lineTo(x0 + wR + 4, bottom + 4); c.stroke();
        // the memory
        const used = frames.reduce((a, f) => a + f.bytes, 0), frac = clamp(used / STACK_BYTES, 0, 1), by = bottom + 18;
        c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'; c.fillRect(x0, by, wR, 12);
        c.fillStyle = sn.overflow ? C.bad : frac > 0.7 ? C.warn : kit.hue(212, 0.9); c.fillRect(x0, by, Math.max(2, wR * frac), 12);
        S.text(c, used + ' of ' + STACK_BYTES + ' bytes of stack', x0, by + 26, { size: 10.5, align: 'left', color: sn.overflow ? C.bad : C.muted });
        S.text(c, sn.note, M, H - 12, { size: 12, align: 'left', color: sn.overflow ? C.bad : C.text, weight: 650 });
        ro.set('depth', String(total));
        ro.set('bytes', used + ' bytes' + (sn.overflow ? ' — overflow' : ''));
        ro.set('cpp', built.cpp);
        ro.set('py', built.py);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ ps-array-index */
  const wrapText = (text, max) => { const out = []; let line = ''; for (const w of String(text).split(' ')) { if ((line + ' ' + w).trim().length > max && line) { out.push(line); line = w; } else line = (line + ' ' + w).trim(); } if (line) out.push(line); return out; };
  const LETTERS = 'ABCDEFGHIJKLMNOP';

  Hyper.sim('ps-array-index', {
    title: 'An index walking off the end',
    blurb: `Memory is a row of cells. The array owns the bright ones; its neighbours are other variables that happen to sit next to it. **C++ does not check the index**: write outside the array and you write into whatever lives there. **MicroPython checks**, and stops with an error. The picture shows one possible layout — the real order is decided by the compiler.

**Try this**
- Arrays: leave the language on C++, set the **index** to 5 and press **Write 99**: the variable \`ledPin\` has just been overwritten, with no message. Try 6, then −1 and 9.
- Switch to MicroPython and repeat: \`IndexError\`, and nothing is damaged. Try −1: a negative index counts from the end.
- Characters: copy 7 characters into the 8-byte buffer (it fits), then 8 (the zero byte falls outside: the classic off-by-one), then 12.
- Choose the Arduino \`String\` or the Python \`str\`: the text sizes its own storage, with no overflow — and a heap allocation instead.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330, maxH: 500 });
      let mode = params.mode === 'chars' ? 'chars' : 'array', mem = null, msg = null, touched = {}, heap = 0;
      const size = () => (mode === 'chars' ? 8 : 5);
      const nbName = k => (k === size() ? 'ledPin' : 'limit');
      const fresh = () => {
        const n = size(); mem = {}; touched = {}; heap = 0;
        for (let i = -2; i < n + 2; i++) mem[i] = { kind: i < 0 ? 'other' : i < n ? 'buf' : 'nb', val: i < 0 ? '?' : i < n ? (mode === 'chars' ? 0 : 10 * (i + 1)) : (i === n ? 2 : 100) };
        msg = { kind: 'info', text: 'Memory is untouched. Pick an index and write.' };
      };
      fresh();
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Shows', options: [['An array of 5 ints', 'array'], ['A text buffer of 8 bytes', 'chars']], value: mode },
        { id: 'lang', type: 'select', label: 'Language', options: [['Arduino C++ (no checks)', 'cpp'], ['MicroPython (checked)', 'py']], value: 'cpp' },
        { id: 'how', type: 'select', label: 'Kept as', options: [['char name[8] and strcpy', 'char'], ['Arduino String', 'string'], ['Python str', 'str']], value: 'char' },
        { id: 'i', label: 'Index', min: -7, max: 9, step: 1, value: 3 },
        { id: 'n', label: 'Characters to copy', min: 0, max: 16, step: 1, value: 5 },
        { type: 'buttons', items: [{ id: 'write', label: 'Write 99', primary: true }, { id: 'read', label: 'Read it' }, { id: 'copy', label: 'Copy the text', primary: true }, { id: 'reset', label: 'Reset memory' }] }
      ], (id, v) => {
        if (id === 'view') { mode = v; fresh(); }
        else if (id === 'reset') fresh();
        else if (id === 'write') doWrite();
        else if (id === 'read') doRead();
        else if (id === 'copy') doCopy();
        loop.once();
      });
      const ro = kit.readout(box.side, [['stmt', 'The statement'], ['valid', 'Valid indexes']]);
      const ok = text => ({ kind: 'ok', text }), warn = text => ({ kind: 'warn', text }), bad = text => ({ kind: 'bad', text });
      function doWrite() {
        const i = Math.round(ctl.values.i), n = size(), py = ctl.values.lang === 'py';
        touched = {};
        if (py) {
          if (i >= -n && i < n) { const k = i < 0 ? n + i : i; mem[k].val = 99; touched[k] = 1; msg = ok('readings[' + i + '] = 99 changed item ' + k + (i < 0 ? ' (a negative index counts from the end)' : '') + '.'); }
          else msg = bad('IndexError: list index out of range. The program stops on this line and nothing was overwritten.');
        } else if (i >= 0 && i < n) { mem[i].val = 99; touched[i] = 1; msg = ok('readings[' + i + '] = 99 is inside the array: fine.'); }
        else if (mem[i]) {
          const was = mem[i].val; mem[i].val = 99; touched[i] = 1;
          msg = warn('No check! readings[' + i + '] is outside the array. The 99 went into ' + (mem[i].kind === 'nb' ? 'the variable ' + nbName(i) + ', which held ' + was : 'memory that belongs to something else') + '. The program carries on with damaged data and says nothing.');
        } else msg = bad('readings[' + i + '] is far outside everything drawn here: undefined behaviour. It may corrupt another variable, crash with a Guru Meditation Error, or seem to work.');
      }
      function doRead() {
        const i = Math.round(ctl.values.i), n = size(), py = ctl.values.lang === 'py';
        touched = {};
        if (py) {
          if (i >= -n && i < n) { const k = i < 0 ? n + i : i; msg = ok('readings[' + i + '] is ' + mem[k].val + '.'); }
          else msg = bad('IndexError: list index out of range.');
        } else if (mem[i]) msg = (i >= 0 && i < n) ? ok('readings[' + i + '] is ' + mem[i].val + '.') : warn('readings[' + i + '] is outside the array, but C++ reads it anyway: ' + mem[i].val + ' — whatever lives there.');
        else msg = bad('readings[' + i + '] is far outside the picture: C++ reads whatever the memory holds — garbage, or a fault.');
      }
      function doCopy() {
        const n = Math.round(ctl.values.n), how = ctl.values.how, B = size();
        touched = {}; heap = 0;
        if (how !== 'char') { heap = n + 1; msg = ok((how === 'string' ? 'The Arduino String' : 'The Python str') + ' sizes its own storage on the heap: ' + (n + 1) + ' bytes for ' + n + ' characters. No overflow — but a heap allocation, and over weeks of such calls a fragmented heap.'); return; }
        for (let k = 0; k <= n; k++) { const v = k < n ? LETTERS.charCodeAt(k) : 0; if (mem[k]) { mem[k].val = v; touched[k] = 1; } }
        const spill = n + 1 - B;
        if (spill <= 0) msg = ok('"' + LETTERS.slice(0, n) + '" fits: ' + n + ' characters and the zero byte take ' + (n + 1) + ' of ' + B + ' bytes.');
        else if (n === B) msg = warn('Off by one! The ' + B + ' characters fill the buffer and the terminating zero byte lands in the next variable, ledPin: it is now 0.');
        else if (n + 1 <= B + 2) msg = warn('Overflow by ' + spill + ' bytes: the text ran into ledPin' + (spill > 1 ? ' and limit' : '') + '. strcpy does not know the buffer is only ' + B + ' bytes.');
        else msg = bad('Overflow by ' + spill + ' bytes: past ledPin and limit into memory the picture does not show. strcpy copies until the zero byte, wherever that is: a crash or a security hole.');
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, n = size(), py = ctl.values.lang === 'py', chars = mode === 'chars';
        ctl.show('i', !chars); ctl.show('n', chars); ctl.show('how', chars); ctl.show('lang', !chars);
        ctl.show('write', !chars); ctl.show('read', !chars); ctl.show('copy', chars);
        const i = Math.round(ctl.values.i), how = ctl.values.how, M = 12;
        const stmt = chars ? (how === 'char' ? 'strcpy(name, "' + LETTERS.slice(0, Math.round(ctl.values.n)) + '");' : how === 'string' ? 'String name = "' + LETTERS.slice(0, Math.round(ctl.values.n)) + '";' : 'name = "' + LETTERS.slice(0, Math.round(ctl.values.n)) + '"') : 'readings[' + i + '] = 99' + (py ? '' : ';');
        S.text(c, chars ? 'char name[8]: eight bytes, then other variables' : 'int readings[5]: five cells, then other variables', M, 16, { size: 13, align: 'left', weight: 650, color: C.text });
        S.text(c, stmt, M, 40, { size: 13, align: 'left', mono: true, color: C.accent });
        // the row of cells from index −2 to n+1
        const cells = n + 4, cw = clamp((W - 2 * M) / cells, 28, 70), x0 = M + (W - 2 * M - cells * cw) / 2, cy = 82, chh = 50;
        S.text(c, 'memory addresses grow to the right  →', x0, cy - 14, { size: 10.5, align: 'left', color: C.faint });
        for (let k = -2; k < n + 2; k++) {
          const cell = mem[k], x = x0 + (k + 2) * cw, kind = cell.kind;
          const label = kind === 'other' ? '?' : chars && kind === 'buf' ? (cell.val === 0 ? '\\0' : String.fromCharCode(cell.val)) : String(cell.val);
          const sub = kind === 'buf' ? '[' + k + ']' : kind === 'nb' ? nbName(k) : 'other';
          const hit = touched[k], color = hit && kind !== 'buf' ? C.bad : kind === 'buf' ? C.accent : kind === 'nb' ? kit.hue(32) : C.faint;
          S.box(c, x + 2, cy, cw - 4, chh, { label, sub, color, active: !!hit || kind === 'buf', dash: kind === 'other', size: chars ? 14 : 13 });
          if (chars && kind === 'buf' && cell.val) S.text(c, String(cell.val), x + cw / 2, cy + chh + 9, { size: 9.5, color: C.faint, mono: true });
        }
        // the owner brackets
        const bx0 = x0 + 2 * cw, bx1 = bx0 + n * cw;
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(bx0 + 2, cy + chh + 24); c.lineTo(bx1 - 2, cy + chh + 24); c.stroke();
        S.text(c, chars ? 'name (8 bytes)' : 'readings (5 ints)', (bx0 + bx1) / 2, cy + chh + 38, { size: 11.5, color: C.accent, weight: 650 });
        // the index arrow
        if (!chars) {
          const inside = !!mem[i], k = inside ? i : (i < 0 ? -2 : n + 1), ax = x0 + (k + 2) * cw + cw / 2, ay = cy - 2;
          const eff = py ? (i >= -n && i < n ? (i < 0 ? n + i : i) : null) : i;
          const ex = eff != null && mem[eff] ? x0 + (eff + 2) * cw + cw / 2 : ax;
          c.fillStyle = py && eff == null ? C.bad : C.warn; c.beginPath(); c.moveTo(ex, cy + chh + 4); c.lineTo(ex - 6, cy + chh + 14); c.lineTo(ex + 6, cy + chh + 14); c.closePath(); c.fill();
          S.text(c, 'index ' + i + (py && i < 0 && eff != null ? ' → item ' + eff : '') + (!inside && !(py && eff != null) ? ' (off the picture)' : ''), clamp(ex, 70, W - 70), cy + chh + 58, { size: 11.5, color: C.warn, weight: 650 });
        }
        // the heap for String and str
        if (chars && heap > 0) {
          const hy = cy + chh + 74;
          S.text(c, 'on the heap, sized to fit: ' + heap + ' bytes', M, hy, { size: 11, align: 'left', color: C.ok, weight: 650 });
          for (let k = 0; k < Math.min(heap, 17); k++) S.box(c, M + k * 22, hy + 8, 20, 24, { label: k < heap - 1 ? LETTERS[k] : '\\0', color: C.ok, size: 11 });
        }
        // the verdict
        const col = msg.kind === 'ok' ? C.ok : msg.kind === 'warn' ? C.warn : msg.kind === 'bad' ? C.bad : C.text2;
        const lines = wrapText(msg.text, Math.max(30, Math.floor((W - 2 * M) / 7.2)));
        lines.slice(0, 4).forEach((t, k) => S.text(c, t, M, H - 14 - (Math.min(4, lines.length) - 1 - k) * 16, { size: 12, align: 'left', color: col, weight: 600 }));
        ro.set('stmt', stmt);
        ro.set('valid', chars ? '0 … 7 for the characters, and the zero byte after them' : py ? '−5 … 4 (checked)' : '0 … 4 (but C++ will accept anything)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ps-timers */
  // one second of the loop at a time; times are in milliseconds
  function simulateTimers(method, ia, ib, ic, work, T) {
    const led = [[0, 0]], report = [], poll = [], busy = [];
    let level = 0;
    if (method === 'clock') {
      const dur = Math.max(work, 0.5);
      let t = 0, lastA = 0, lastB = 0, lastC = 0;
      while (t < T) {
        if (t - lastA >= ia) { lastA += ia; level = 1 - level; led.push([t, level]); }
        if (t - lastC >= ic) { lastC += ic; poll.push(t); }
        if (t - lastB >= ib) { lastB += ib; report.push(t); }
        if (work > 0) busy.push([t, t + work, 'work']);
        t += dur;
      }
    } else {
      let t = 0, lastB = 0;
      while (t < T) {
        level = 1 - level; led.push([t, level]);
        busy.push([t, t + ia, 'wait']); t += ia;
        poll.push(t);
        if (t - lastB >= ib) { lastB += ib; report.push(t); }
        if (work > 0) { busy.push([t, t + work, 'work']); t += work; }
      }
    }
    return { led, report, poll, busy };
  }
  const gaps = a => { const g = []; for (let k = 1; k < a.length; k++) g.push(a[k] - a[k - 1]); return g; };
  const mean = a => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);

  Hyper.sim('ps-timers', {
    title: 'Three jobs in one loop',
    blurb: `Three jobs share one loop: **blink** the LED every A ms, **report** every B ms, and **look at the button** every C ms. The traces show *when each job really ran* over six seconds; the faint lines mark when the LED was due to change.

**Try this**
- With *Watching the clock* and no slow work, every job runs on its own rhythm and the button is looked at every 20 ms.
- Switch to *delay() in the loop*: the other two jobs are dragged into the LED's rhythm — the button is looked at only every half second.
- Back on the clock, add **slow work** of 150 ms to every pass: all three timers are now late by up to 150 ms, and the longest gap without looking at the button is the length of the work.
- Make the slow work longer than the LED interval and the LED can no longer keep its rhythm: the loop cannot come round fast enough.`,
    mount(box, kit) {
      const S = kit.esym, SPAN = 6000;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300, maxH: 460 });
      let sim = null, cursor = 0;
      const compute = () => { const v = ctl.values; sim = simulateTimers(v.method, v.ia, v.ib, v.ic, v.work, SPAN); };
      const ctl = kit.controls(box.side, [
        { id: 'method', type: 'select', label: 'The loop uses', options: [['Watching the clock (millis)', 'clock'], ['delay() for the LED', 'delay']], value: 'clock' },
        { id: 'ia', label: 'LED changes every (A)', min: 100, max: 1000, step: 50, value: 500, unit: 'ms' },
        { id: 'ib', label: 'Report every (B)', min: 200, max: 2000, step: 100, value: 1000, unit: 'ms' },
        { id: 'ic', label: 'Look at the button every (C)', min: 10, max: 100, step: 10, value: 20, unit: 'ms' },
        { id: 'work', label: 'Slow work in every pass', min: 0, max: 300, step: 10, value: 0, unit: 'ms' },
        { type: 'buttons', items: [{ id: 'replay', label: 'Replay', primary: true }] }
      ], (id) => { compute(); cursor = id === 'replay' ? 0 : SPAN; if (id === 'replay') loop.start(); loop.once(); });
      compute();
      cursor = SPAN;
      const ro = kit.readout(box.side, [['led', 'The LED really changes every'], ['rep', 'A report really comes every'], ['look', 'The button is looked at every'], ['gap', 'Longest gap without a look']]);
      const loop = kit.loop(dt => {
        if (cursor < SPAN) { cursor = Math.min(SPAN, cursor + dt * 1500); if (cursor >= SPAN) loop.stop(); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, v = ctl.values;
        const px = 132, pw = Math.max(120, W - px - 16), X = t => px + clamp(t / SPAN, 0, 1) * pw, cx = X(cursor);
        const rows = [['LED  (GPIO2)', 30], ['report', 18], ['button looked at', 18], ['the loop', 14]], gapY = 18;
        let y = 18; const ys = [];
        rows.forEach(r => { ys.push(y); y += r[1] + gapY; });
        rows.forEach((r, k) => S.text(c, r[0], px - 8, ys[k] + r[1] / 2, { size: 11, align: 'right', color: C.text2 }));
        // the moments the LED is due
        c.strokeStyle = C.grid; c.lineWidth = 1; c.setLineDash([2, 4]);
        for (let t = v.ia; t < SPAN && t / v.ia < 80; t += v.ia) { c.beginPath(); c.moveTo(X(t), ys[0] - 6); c.lineTo(X(t), ys[0] + 36); c.stroke(); }
        c.setLineDash([]);
        const drawAt = (alpha, x0, x1) => {
          c.save(); c.globalAlpha = alpha; c.beginPath(); c.rect(x0, 0, Math.max(0, x1 - x0), H); c.clip();
          S.wave(c, px, ys[0], pw, rows[0][1], sim.led, { t0: 0, t1: SPAN, fill: true });
          c.strokeStyle = kit.hue(150, 0.95); c.lineWidth = 2; c.beginPath(); sim.report.forEach(t => { c.moveTo(X(t), ys[1]); c.lineTo(X(t), ys[1] + rows[1][1]); }); c.stroke();
          c.strokeStyle = kit.hue(40, 0.95); c.lineWidth = 1; c.beginPath(); sim.poll.forEach(t => { c.moveTo(X(t), ys[2]); c.lineTo(X(t), ys[2] + rows[2][1]); }); c.stroke();
          sim.busy.forEach(b => { c.fillStyle = b[2] === 'wait' ? (C.dark ? 'rgba(229,72,77,.8)' : 'rgba(200,40,50,.75)') : kit.hue(40, 0.85); c.fillRect(X(b[0]), ys[3], Math.max(0.6, X(b[1]) - X(b[0])), rows[3][1]); });
          c.restore();
        };
        c.fillStyle = C.dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)'; rows.forEach((r, k) => c.fillRect(px, ys[k], pw, r[1]));
        drawAt(0.22, cx, px + pw + 1); drawAt(1, px - 1, cx);
        if (cursor < SPAN) { c.strokeStyle = C.warn; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, 6); c.lineTo(cx, ys[3] + 22); c.stroke(); }
        // the time axis
        const ay = ys[3] + 34;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(px, ay); c.lineTo(px + pw, ay); c.stroke();
        for (let s = 0; s <= 6; s++) { c.beginPath(); c.moveTo(X(s * 1000), ay); c.lineTo(X(s * 1000), ay + 4); c.stroke(); S.text(c, s + ' s', X(s * 1000), ay + 14, { size: 10, color: C.faint }); }
        const legend = v.method === 'delay' ? 'red: stuck in delay()' + (v.work ? ' · amber: slow work' : '') : (v.work ? 'amber: slow work in every pass' : 'the loop is free all the time: no bar');
        S.text(c, legend, px, ay + 32, { size: 11, align: 'left', color: C.muted });
        S.text(c, 'schematic: an idle pass is taken as 0.5 ms', px, ay + 48, { size: 10, align: 'left', color: C.faint });
        const fmtMs = x => (x == null ? '—' : kit.fmt(x, 3) + ' ms');
        ro.set('led', fmtMs(mean(gaps(sim.led.map(e => e[0]).slice(1)))));
        ro.set('rep', fmtMs(mean(gaps(sim.report))));
        ro.set('look', fmtMs(mean(gaps(sim.poll))));
        const g = gaps(sim.poll); ro.set('gap', g.length ? fmtMs(Math.max.apply(null, g)) : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ ps-bits */
  const BIT_OPS = [
    ['AND   value & mask', 'and'], ['OR   value | mask', 'or'], ['XOR   value ^ mask', 'xor'], ['NOT   ~value', 'not'],
    ['Shift left   value << n', 'shl'], ['Shift right   value >> n', 'shr'],
    ['Set bit n', 'set'], ['Clear bit n', 'clr'], ['Toggle bit n', 'tog'], ['Test bit n', 'tst']
  ];
  const MPU_NAMES = ['RST', 'SLP', 'CYC', '—', 'TDIS', 'CL2', 'CL1', 'CL0'];
  const MPU_TEXT = { 7: 'DEVICE_RESET: 1 resets the chip', 6: 'SLEEP: 1 = the chip is asleep', 5: 'CYCLE: wake only to take samples', 3: 'TEMP_DIS: 1 = the temperature sensor is off', 2: 'CLKSEL bit 2', 1: 'CLKSEL bit 1', 0: 'CLKSEL bit 0' };
  function bitOp(op, v, m, n) {
    const one = 1 << n;
    switch (op) {
      case 'and': return { res: v & m, operand: m, edit: true, sym: '&', expr: 'value & mask' };
      case 'or': return { res: v | m, operand: m, edit: true, sym: '|', expr: 'value | mask' };
      case 'xor': return { res: v ^ m, operand: m, edit: true, sym: '^', expr: 'value ^ mask' };
      case 'not': return { res: ~v & 255, operand: null, sym: '~', expr: '~value', note: 'In Python write ~value & 0xFF: its integers have no width, so ~ alone gives a negative number.' };
      case 'shl': return { res: (v << n) & 255, operand: null, sym: '<<', expr: 'value << ' + n, note: 'The bits shifted out of the left end are lost; zeros come in at the right. One place left doubles the number.' };
      case 'shr': return { res: v >> n, operand: null, sym: '>>', expr: 'value >> ' + n, note: 'Zeros come in at the left. One place right halves the number (rounding down).' };
      case 'set': return { res: v | one, operand: one, sym: '|', expr: 'value | (1 << ' + n + ')' };
      case 'clr': return { res: v & ~one & 255, operand: one, sym: '& ~', expr: 'value & ~(1 << ' + n + ')' };
      case 'tog': return { res: v ^ one, operand: one, sym: '^', expr: 'value ^ (1 << ' + n + ')' };
      default: return { res: (v >> n) & 1, operand: one, sym: '', expr: '(value >> ' + n + ') & 1', note: 'The result is 0 or 1: the value of bit ' + n + '.' };
    }
  }

  Hyper.sim('ps-bits', {
    title: 'Bits, masks and shifts',
    blurb: `A byte is eight bits. **Click a bit** to flip it. A *mask* picks bits out of a number: AND keeps them, OR sets them, XOR flips them. In the second view the same bits are read as a **signed number** (two's complement), as a sensor register must be.

**Try this**
- Choose *Clear bit n* with the **MPU-6050 register** and \`n = 6\`: the SLEEP bit goes to 0 and the chip wakes up; the other bits are untouched.
- Choose *Shift left* and watch the value double with every step, until the top bit falls off the end.
- Choose *NOT*: every bit flips.
- Open the **signed register** view with the TMP102 format: bytes 0xE7 0x00 are −25 °C, but read as unsigned they would be +231 °C. Click the top bit to see the sign change.`,
    mount(box, kit, params) {
      const S = kit.esym, E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 380, maxH: 540 });
      let hits = [];
      const hx = v => E.hex(v, 2);
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['Masks and shifts', 'ops'], ['A signed register', 'twos']], value: params.mode === 'twos' ? 'twos' : 'ops' },
        { id: 'preset', type: 'select', label: 'Register', options: [['A plain byte', 'plain'], ['MPU-6050 power register (0x6B)', 'mpu']], value: 'mpu' },
        { id: 'op', type: 'select', label: 'Operation', options: BIT_OPS, value: 'clr' },
        { id: 'v', label: 'Value', min: 0, max: 255, step: 1, value: 0x40, fmt: x => '0x' + Math.round(x).toString(16).toUpperCase().padStart(2, '0') + ' = ' + Math.round(x) },
        { id: 'm', label: 'Mask', min: 0, max: 255, step: 1, value: 0x08, fmt: x => '0x' + Math.round(x).toString(16).toUpperCase().padStart(2, '0') + ' = ' + Math.round(x) },
        { id: 'n', label: 'Bit number n', min: 0, max: 7, step: 1, value: 6 },
        { id: 'fmt', type: 'select', label: 'Register format', options: [['12 bits, left-justified (TMP102 temperature)', 'tmp'], ['16-bit signed number (a sensor axis)', 's16']], value: 'tmp' },
        { id: 'hi', label: 'High byte', min: 0, max: 255, step: 1, value: 0xE7, fmt: x => '0x' + Math.round(x).toString(16).toUpperCase().padStart(2, '0') },
        { id: 'lo', label: 'Low byte', min: 0, max: 255, step: 1, value: 0x00, fmt: x => '0x' + Math.round(x).toString(16).toUpperCase().padStart(2, '0') }
      ], (id, val) => {
        if (id === 'preset' && val === 'mpu') { ctl.set('v', 0x40); ctl.set('op', 'clr'); ctl.set('n', 6); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['a', 'Value'], ['b', 'Mask'], ['c', 'Result'], ['d', 'Meaning']]);
      kit.click(st, p => {
        const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h);
        if (!h) return;
        const cur = Math.round(ctl.values[h.id]);
        ctl.set(h.id, (cur ^ (1 << h.bit)) & 255, false);
        loop.once();
      }, p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, twos = ctl.values.view === 'twos', M = 12;
        ['preset', 'op', 'v'].forEach(k => ctl.show(k, !twos));
        ctl.show('fmt', twos); ctl.show('hi', twos); ctl.show('lo', twos);
        const op = ctl.values.op;
        const needN = !twos && ['shl', 'shr', 'set', 'clr', 'tog', 'tst'].indexOf(op) >= 0, needM = !twos && ['and', 'or', 'xor'].indexOf(op) >= 0;
        ctl.show('n', needN); ctl.show('m', needM);
        hits = [];
        if (!twos) {
          const v = Math.round(ctl.values.v) & 255, m = Math.round(ctl.values.m) & 255, n = Math.round(ctl.values.n), r = bitOp(op, v, m, n), mpu = ctl.values.preset === 'mpu';
          const lw = 78, cell = clamp(Math.floor((W - lw - 24 - 70) / 8), 24, 44), x0 = M + lw, rowGap = cell + 46;
          const rows = [{ y: 38, label: 'value', val: v, id: 'v' }];
          if (r.operand != null) rows.push({ y: 38 + rowGap, label: op === 'and' || op === 'or' || op === 'xor' ? 'mask' : '1 << ' + n, val: r.operand, id: r.edit ? 'm' : null });
          const ry = 38 + rowGap * rows.length;
          rows.push({ y: ry, label: 'result', val: r.res, id: null });
          const changed = []; for (let b = 0; b < 8; b++) if (((v >> b) & 1) !== ((r.res >> b) & 1)) changed.push(7 - b);
          rows.forEach((rw, k) => {
            S.text(c, rw.label, M + lw - 10, rw.y + cell / 2, { size: 12.5, align: 'right', color: k === rows.length - 1 ? C.accent : C.text2, weight: 650 });
            const tint = []; if (k === 0 && r.operand != null) for (let b = 0; b < 8; b++) if ((r.operand >> b) & 1) tint.push(7 - b);
            if (k === rows.length - 1 && op !== 'tst') changed.forEach(i => tint.push(i));
            S.bits(c, x0, rw.y, rw.val, { n: 8, cell, hi: tint, labels: k === 0 ? (mpu ? MPU_NAMES : true) : k === rows.length - 1 ? true : false, color: k === rows.length - 1 ? kit.hue(150, 0.95) : kit.hue(212, 0.95) });
            S.text(c, hx(rw.val), x0 + 8 * cell + 12, rw.y + cell / 2 - 7, { size: 12.5, align: 'left', mono: true, color: C.text, weight: 650 });
            S.text(c, String(rw.val), x0 + 8 * cell + 12, rw.y + cell / 2 + 8, { size: 11, align: 'left', mono: true, color: C.muted });
            if (rw.id) for (let b = 0; b < 8; b++) hits.push({ x: x0 + (7 - b) * cell, y: rw.y, w: cell, h: cell, id: rw.id, bit: b });
          });
          if (r.sym) S.text(c, r.sym, M + lw - 10, rows[1] ? rows[1].y - 18 : 38 + cell + 14, { size: 14, align: 'right', color: C.warn, weight: 700, mono: true });
          const ty = ry + cell + 38;
          S.text(c, 'in C++ and in Python:   ' + r.expr + '   =   ' + hx(r.res) + (op === 'tst' ? '' : '   (' + r.res + ')'), M, ty, { size: 12.5, align: 'left', mono: true, color: C.text });
          let ly = ty + 20;
          if (r.note) wrapText(r.note, Math.max(30, Math.floor((W - 2 * M) / 7.2))).slice(0, 3).forEach(t => { S.text(c, t, M, ly, { size: 11.5, align: 'left', color: C.muted }); ly += 15; });
          const setBits = []; for (let b = 7; b >= 0; b--) if ((r.res >> b) & 1 && mpu && op !== 'tst') setBits.push('bit ' + b + ' ' + MPU_TEXT[b]);
          if (mpu && op !== 'tst') { ly += 4; S.text(c, setBits.length ? 'result bits that are set:' : 'no bit is set in the result.', M, ly, { size: 11.5, align: 'left', color: C.text2, weight: 650 }); setBits.slice(0, 5).forEach(t => { ly += 15; S.text(c, '· ' + t, M + 8, ly, { size: 11, align: 'left', color: C.muted }); }); }
          ro.set('a', hx(v) + ' = 0b' + E.bin(v, 8));
          ro.set('b', r.operand != null ? hx(r.operand) + ' = 0b' + E.bin(r.operand, 8) : '—');
          ro.set('c', hx(r.res) + ' = 0b' + E.bin(r.res, 8) + ' = ' + r.res);
          ro.set('d', op === 'tst' ? 'bit ' + n + ' is ' + r.res : (v === r.res ? 'nothing changed' : changed.length + (changed.length === 1 ? ' bit' : ' bits') + ' changed'));
        } else {
          const hi = Math.round(ctl.values.hi) & 255, lo = Math.round(ctl.values.lo) & 255, tmp = ctl.values.fmt === 'tmp', raw16 = (hi << 8) | lo;
          const cell = clamp(Math.floor((W - 2 * M) / 16), 14, 32), x0 = M + (W - 2 * M - 16 * cell) / 2;
          S.text(c, tmp ? 'The two bytes of a TMP102 temperature register' : 'The two bytes of a 16-bit sensor reading', M, 16, { size: 13, align: 'left', weight: 650, color: C.text });
          S.text(c, 'high byte  ' + hx(hi), x0 + 4 * cell, 44, { size: 12, color: C.text2, mono: true, weight: 650 });
          S.text(c, 'low byte  ' + hx(lo), x0 + 12 * cell, 44, { size: 12, color: C.text2, mono: true, weight: 650 });
          S.bits(c, x0, 58, raw16, { n: 16, cell, labels: cell >= 18, hi: [0], color: kit.hue(212, 0.95) });
          for (let b = 0; b < 16; b++) { hits.push({ x: x0 + (15 - b) * cell, y: 58, w: cell, h: cell, id: b >= 8 ? 'hi' : 'lo', bit: b % 8 }); }
          if (tmp) { c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 + 2, 58 + cell + 26); c.lineTo(x0 + 12 * cell - 2, 58 + cell + 26); c.stroke(); S.text(c, '12 data bits', x0 + 6 * cell, 58 + cell + 40, { size: 10.5, color: C.accent }); S.text(c, '4 unused', x0 + 14 * cell, 58 + cell + 40, { size: 10.5, color: C.faint }); }
          const lines = []; let signedV, text, unsignedV;
          if (tmp) {
            const raw = (hi << 4) | (lo >> 4), neg = (raw & 0x800) !== 0;
            signedV = neg ? raw - 4096 : raw; unsignedV = raw;
            lines.push('raw = (hi << 4) | (lo >> 4) = ' + E.hex(raw, 3) + ' = ' + fmtInt(raw));
            lines.push(neg ? 'bit 11 is set: negative, so raw − 4096 = ' + fmtInt(signedV) : 'bit 11 is clear: the number is positive, raw stays ' + fmtInt(raw));
            lines.push('temperature = ' + fmtInt(signedV) + ' × 0.0625 = ' + (signedV * 0.0625).toFixed(2) + ' °C');
            if (neg) lines.push('read as unsigned it would be ' + (raw * 0.0625).toFixed(2) + ' °C: the classic bug');
            text = (signedV * 0.0625).toFixed(2) + ' °C';
          } else {
            const neg = raw16 >= 32768;
            signedV = neg ? raw16 - 65536 : raw16; unsignedV = raw16;
            lines.push('raw = (hi << 8) | lo = ' + E.hex(raw16, 4) + ' = ' + fmtInt(raw16) + ' as an unsigned number');
            lines.push(neg ? 'bit 15 is set: negative, so raw − 65 536 = ' + fmtInt(signedV) : 'bit 15 is clear: positive, the signed value is the same');
            lines.push('C++: (int16_t)((hi << 8) | lo)'); lines.push('Python: subtract 65 536 when raw ≥ 32 768');
            text = fmtInt(signedV);
          }
          let ly = 58 + cell + 74;
          lines.forEach(t => { S.text(c, t, M, ly, { size: 12, align: 'left', mono: true, color: C.text }); ly += 19; });
          // the signed value on a scale
          const lo0 = tmp ? -2048 : -32768, hi0 = tmp ? 2047 : 32767, sy = Math.min(H - 52, ly + 14), sw = W - 2 * M, fx = M + sw * (signedV - lo0) / (hi0 - lo0);
          c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'; c.fillRect(M, sy, sw, 12);
          c.fillStyle = C.faint; c.fillRect(M + sw * (0 - lo0) / (hi0 - lo0) - 1, sy - 4, 2, 20);
          c.fillStyle = signedV < 0 ? C.bad : C.ok; c.fillRect(fx - 2, sy - 6, 4, 24);
          S.text(c, fmtInt(lo0), M, sy + 28, { size: 10.5, align: 'left', color: C.muted });
          S.text(c, '0', M + sw * (0 - lo0) / (hi0 - lo0), sy + 28, { size: 10.5, color: C.muted });
          S.text(c, fmtInt(hi0), M + sw, sy + 28, { size: 10.5, align: 'right', color: C.muted });
          ro.set('a', hx(hi) + ' ' + hx(lo));
          ro.set('b', '—');
          ro.set('c', fmtInt(signedV) + ' (signed)  ·  ' + fmtInt(unsignedV) + ' (unsigned)');
          ro.set('d', text);
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
