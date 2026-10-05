/* HYPER-ESP32 · sims/the-esp-idea.js
 *
 * Simulations of the topic "Microcontrollers and the ESP idea". Every id starts with "ei-".
 *
 *   ei-inside-mcu         a microcontroller as a block diagram that lights up as a small program runs, line by line
 *   ei-chip-module-board  chip, module and board drawn side by side, to scale, with what each one adds
 *   ei-name-decoder       a chip or module name taken apart, part by part
 *   ei-family-chart       the whole family from the catalogue: year against a capability, coloured by radio, architecture, series or status
 *   ei-compare-mcus       ESP chips against the Arduino Uno, Pico, STM32 and Nordic parts, as bars
 *   ei-chip-filter        tick what a project needs and watch the chips drop out, with the reason
 *   ei-datasheet-reader   a datasheet table with its columns explained, and the supply and temperature checked against it
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const fmtKb = kb => (kb == null ? '—' : kb >= 1024 ? Math.round(kb / 102.4) / 10 + ' MB' : kb + ' KB');

  /* ================================================================ ei-inside-mcu */
  // The programs, as lines of code and the blocks each line touches.
  // A step: { blocks: [ids lit while it executes], flows: [[from, to], …], run(s, ext) -> sentence, uses(s) optional }
  const PROGS = {
    count: {
      name: 'Count button presses',
      lines: ['down = digitalRead(BUTTON) == LOW', 'if (down && !was_down) count++', 'Serial.printf("Pressed: %d", count)', 'digitalWrite(LED, down)', 'was_down = down', 'delay(20)'],
      vars: ['down', 'was_down', 'count'],
      init: () => ({ down: 0, was_down: 0, count: 0, fired: 0, led: 0, sent: 0 }),
      loopFrom: 0,
      externals: ['button', 'led', 'uart'],
      steps: [
        { blocks: ['gpioin', 'cpu', 'ram'], flows: [['pin_in', 'gpioin'], ['gpioin', 'cpu'], ['cpu', 'ram']], vars: ['down'],
          run(s, e) { s.down = e.button ? 1 : 0; return 'The GPIO input block reads the pin: ' + (e.button ? 'low, the button is pressed' : 'high, the button is not pressed') + '. The CPU stores down = ' + s.down + ' in RAM.'; } },
        { blocks: ['cpu', 'ram'], flows: [['ram', 'cpu'], ['cpu', 'ram']], vars: ['count'],
          run(s) { s.fired = s.down && !s.was_down ? 1 : 0; if (s.fired) s.count++; return s.fired ? 'down is 1 and was_down is 0: a new press, so count becomes ' + s.count + '.' : 'No new press (down is ' + s.down + ', was_down is ' + s.was_down + '), so count stays ' + s.count + '.'; } },
        { blocks: ['cpu', 'uart'], flows: [['cpu', 'uart'], ['uart', 'pin_tx']], vars: [],
          run(s) { s.sent = s.fired ? 1 : 0; return s.fired ? 'The UART block shifts the text out of the TX pin by itself while the CPU moves on.' : 'Nothing new to say, so nothing is sent.'; } },
        { blocks: ['cpu', 'gpioout'], flows: [['cpu', 'gpioout'], ['gpioout', 'pin_out']], vars: [],
          run(s) { s.led = s.down; return 'The CPU hands down to the GPIO output block. The pin goes ' + (s.led ? 'high and the LED lights' : 'low and the LED is dark') + '.'; } },
        { blocks: ['cpu', 'ram'], flows: [['cpu', 'ram']], vars: ['was_down'],
          run(s) { s.was_down = s.down; return 'The CPU remembers this reading for next time: was_down = ' + s.was_down + '.'; } },
        { blocks: ['cpu', 'timer'], flows: [['cpu', 'timer']], vars: [],
          run() { return 'The timer counts 20 milliseconds while the CPU waits. At 240 MHz that is 4.8 million clock cycles spent waiting.'; } }
      ]
    },
    thermo: {
      name: 'A thermostat',
      lines: ['t = readTemperature()', 'if (t < 20) heat = 1;  if (t > 22) heat = 0', 'digitalWrite(HEATER, heat)', 'delay(1000)'],
      vars: ['t', 'heat'],
      init: () => ({ t: 0, heat: 0, out: 0 }),
      loopFrom: 0,
      externals: ['sensor', 'heater'],
      steps: [
        { blocks: ['adc', 'cpu', 'ram'], flows: [['pin_adc', 'adc'], ['adc', 'cpu'], ['cpu', 'ram']], vars: ['t'],
          run(s, e) { s.t = Math.round(e.temp * 10) / 10; return 'The ADC turns the sensor voltage into a number and the CPU stores t = ' + s.t.toFixed(1) + ' °C in RAM.'; } },
        { blocks: ['cpu', 'ram'], flows: [['ram', 'cpu'], ['cpu', 'ram']], vars: ['heat'],
          run(s) { const before = s.heat; if (s.t < 20) s.heat = 1; else if (s.t > 22) s.heat = 0; return s.heat !== before ? 'The rule changes heat to ' + s.heat + '.' : 'Between 20 and 22 °C the rule changes nothing: heat stays ' + s.heat + '. That gap is the hysteresis.'; } },
        { blocks: ['cpu', 'gpioout'], flows: [['cpu', 'gpioout'], ['gpioout', 'pin_out']], vars: [],
          run(s) { s.out = s.heat; return 'The CPU hands heat to the GPIO output block: the heater is ' + (s.out ? 'on' : 'off') + '.'; } },
        { blocks: ['cpu', 'timer'], flows: [['cpu', 'timer']], vars: [],
          run() { return 'The timer counts one second. The loop will read the sensor again after it.'; } }
      ]
    },
    pwm: {
      name: 'Dim an LED with PWM',
      lines: ['ledcAttach(LED, 5000, 8)', 'ledcWrite(LED, duty)', 'count++   // other work, over and over'],
      vars: ['duty', 'count'],
      init: () => ({ duty: 0, count: 0, pwm: 0 }),
      loopFrom: 2,
      externals: ['pwmled'],
      steps: [
        { blocks: ['cpu', 'pwm'], flows: [['cpu', 'pwm']], vars: [],
          run(s) { s.pwm = 1; return 'The CPU sets up the PWM block: 5 kHz, 8 bits. From now on the block works on its own.'; } },
        { blocks: ['cpu', 'pwm', 'ram'], flows: [['cpu', 'pwm'], ['cpu', 'ram']], vars: ['duty'],
          run(s, e) { s.duty = Math.round(e.duty); return 'The CPU writes the duty, ' + s.duty + ' out of 255. The PWM block now switches the pin by itself.'; } },
        { blocks: ['cpu', 'ram'], flows: [['cpu', 'ram']], vars: ['count'],
          run(s) { s.count++; return 'The CPU is free for other work (count is ' + s.count + '). The PWM block keeps the LED at ' + Math.round(s.duty / 2.55) + ' % without any help.'; } }
      ]
    }
  };

  Hyper.sim('ei-inside-mcu', {
    title: 'Inside a microcontroller',
    blurb: `Each line of a small program is carried out in two beats. First the CPU **fetches** the instruction from the flash memory, then it **executes** it, and the blocks it uses light up. Variables live in RAM; the peripherals at the bottom do their jobs by themselves; the pins connect the chip to the world outside.

**Try this**
- Run *Count button presses*, tick **Button held**, and watch the path: pin, GPIO block, CPU, RAM. Untick it and step on to see \`was_down\` remember the old state.
- Switch to the thermostat and slide the **temperature** across 20 and 22 °C: the heater only changes when a limit is crossed.
- Choose *Dim an LED with PWM*, set the duty and run: after the write, the CPU keeps working on other things and the PWM block still dims the LED alone.
- Use **Step** to go one beat at a time.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 400, maxH: 560 });
      let key = PROGS[params.program] ? params.program : 'count';
      let s = PROGS[key].init(), pc = 0, phase = -1, tp = 0, note = 'Press Step or Run to start. The first beat fetches line 1 from flash.', hot = [], flowT = 0;
      let running = false;
      const ctl = kit.controls(box.side, [
        { id: 'prog', type: 'select', label: 'Program', options: Object.keys(PROGS).map(k => [PROGS[k].name, k]), value: key },
        { id: 'btn', type: 'check', label: 'Button held down', value: false },
        { id: 'temp', label: 'Temperature of the room', min: 10, max: 30, step: 0.5, value: 18, unit: '°C' },
        { id: 'duty', label: 'Duty to write', min: 0, max: 255, step: 1, value: 64 },
        { id: 'speed', label: 'Speed', min: 0.4, max: 3, step: 0.1, value: 1, unit: '×' },
        { type: 'buttons', items: [{ id: 'step', label: 'Step', primary: true }, { id: 'run', label: 'Run' }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'prog') { key = ctl.values.prog; reset(); }
        else if (id === 'step') { running = false; advance(); setRunLabel(); }
        else if (id === 'run') { running = !running; setRunLabel(); if (running) loop.start(); }
        else if (id === 'reset') reset();
        showCtl(); loop.once();
      });
      const ro = kit.readout(box.side, [['line', 'Line'], ['what', 'What happens']]);
      const setRunLabel = () => { const b = ctl.rows.run; if (b && b.textContent != null) b.textContent = running ? 'Pause' : 'Run'; };
      const showCtl = () => { ctl.show('btn', key === 'count'); ctl.show('temp', key === 'thermo'); ctl.show('duty', key === 'pwm'); };
      const ext = () => ({ button: !!ctl.values.btn, temp: ctl.values.temp, duty: ctl.values.duty });
      const P = () => PROGS[key];
      function reset() { running = false; setRunLabel(); s = P().init(); pc = 0; phase = -1; tp = 0; hot = []; note = 'Press Step or Run to start. The first beat fetches line 1 from flash.'; }
      // one beat: fetch (phase 0) or execute (phase 1)
      function advance() {
        const p = P();
        if (phase === -1 || phase === 1) { if (phase === 1) { pc++; if (pc >= p.steps.length) pc = p.loopFrom; } phase = 0; tp = 0; hot = []; note = 'Fetch: the CPU reads line ' + (pc + 1) + ' of the program from the flash memory.'; }
        else { phase = 1; tp = 0; const stp = p.steps[pc]; note = stp.run(s, ext()); hot = stp.vars || []; }
      }
      const loop = kit.loop((dt, t) => {
        if (running) {
          tp += dt * ctl.values.speed;
          const dur = phase === 0 ? 0.55 : 1.05;
          if (phase === -1 || tp >= dur) advance();
        }
        flowT = t;
        draw();
      }, box.stage);
      let hit = null;
      function draw() {
        const c = st.begin(), C = kit.colors(), p = P(), W = st.W, H = st.H;
        const narrow = W < 560;
        // ---- the listing
        const lh = 17, lw = narrow ? W - 16 : clamp(W * 0.34, 190, 290);
        const listH = narrow ? p.lines.length * lh + 34 : H - 16;
        S.box(c, 8, 8, lw, listH, { color: C.border2 || C.muted, fill: C.surface });
        S.text(c, 'the program, in flash', 18, 22, { align: 'left', size: 11, color: C.muted, weight: 600 });
        const maxLen = Math.max.apply(null, p.lines.map(l => l.length));
        const fs = clamp((lw - 44) / (maxLen * 0.6), 8, 12);
        p.lines.forEach((ln, i) => {
          const y = 44 + i * (narrow ? lh : Math.max(lh, Math.min(26, (listH - 90) / p.lines.length)));
          const cur = i === pc && phase >= 0;
          if (cur) { c.fillStyle = C.dark ? 'rgba(123,140,255,.22)' : 'rgba(60,90,220,.14)'; c.beginPath(); c.rect(12, y - 10, lw - 8, 20); c.fill(); }
          S.text(c, String(i + 1), 20, y, { align: 'left', size: fs, color: C.faint, mono: true });
          S.text(c, ln, 36, y, { align: 'left', size: fs, color: cur ? C.text : C.text2 || C.muted, mono: true, weight: cur ? 700 : 500 });
        });
        if (!narrow) {
          const phText = phase === -1 ? 'ready' : phase === 0 ? 'beat 1: fetch' : 'beat 2: execute';
          S.text(c, phText, 18, listH - 6, { align: 'left', size: 11, color: C.accent, weight: 650 });
        }
        // ---- the chip
        const A = narrow ? { x: 8, y: listH + 16, w: W - 16, h: H - listH - 24 } : { x: lw + 20, y: 8, w: W - lw - 28, h: H - 16 };
        const chipH = A.h * 0.64, pad = 10;
        S.box(c, A.x, A.y, A.w, chipH, { color: C.muted, fill: C.bg2 });
        S.text(c, 'the microcontroller', A.x + 10, A.y + 12, { align: 'left', size: 11, color: C.muted, weight: 600 });
        const perH = 42, gap = 9, topY = A.y + 24, topH = chipH - 24 - perH - 3 * gap;
        const bw3 = [0.28, 0.30, 0.42], inW = A.w - 2 * pad - 2 * gap;
        const pos = {};
        const lit = new Set(phase === 0 ? ['flash', 'cpu'] : phase === 1 ? p.steps[pc].blocks : []);
        if (p.steps && s.pwm) lit.add('pwm');
        let x = A.x + pad;
        const topBoxes = [['flash', 'Flash', 'the program'], ['cpu', 'CPU', '240 MHz'], ['ram', 'RAM', null]];
        topBoxes.forEach(([id, label, sub], i) => {
          const w = inW * bw3[i];
          const b = S.box(c, x, topY, w, topH, { label: id === 'ram' ? null : label, sub, color: lit.has(id) ? C.accent : C.muted, active: lit.has(id), size: 13 });
          pos[id] = { cx: b.cx, cy: b.cy, l: b.l, r: b.r, t: b.t, b: b.b, w, x, y: topY, h: topH };
          x += w + gap;
        });
        // RAM contents
        const rm = pos.ram;
        S.text(c, 'RAM', rm.x + 8, rm.y + 12, { align: 'left', size: 12.5, color: C.text, weight: 600 });
        p.vars.forEach((v, i) => {
          const isHot = hot.indexOf(v) >= 0;
          const yy = rm.y + 32 + i * 18;
          if (yy > rm.y + rm.h - 6) return;
          if (isHot) { c.fillStyle = C.dark ? 'rgba(255,200,80,.25)' : 'rgba(230,160,30,.25)'; c.beginPath(); c.rect(rm.x + 5, yy - 9, rm.w - 10, 17); c.fill(); }
          const val = s[v];
          S.text(c, v + ' = ' + (typeof val === 'number' && v === 't' ? val.toFixed(1) : val), rm.x + 10, yy, { align: 'left', size: 11.5, color: C.text2 || C.muted, mono: true });
        });
        // the bus and the peripherals
        const busY = topY + topH + gap / 2 + 1;
        S.wire(c, [[A.x + pad, busY], [A.x + A.w - pad, busY]], { color: C.faint, width: 1.5, round: 0 });
        const TILES = [['gpioin', 'GPIO in', 'GPIO4'], ['gpioout', 'GPIO out', 'GPIO18'], ['adc', 'ADC', 'GPIO34'], ['pwm', 'PWM', 'GPIO19'], ['uart', 'UART', 'TX'], ['timer', 'Timer', null]];
        const tw = (A.w - 2 * pad - 5 * 6) / 6, ty = busY + gap / 2 + 4;
        const pinY = A.y + chipH;
        TILES.forEach(([id, label, pin], i) => {
          const tx = A.x + pad + i * (tw + 6);
          const on = lit.has(id);
          const b = S.box(c, tx, ty, tw, perH, { label, color: on ? C.accent : C.muted, active: on, size: 11.5, r: 6 });
          pos[id] = { cx: b.cx, cy: b.cy, t: b.t, b: b.b, w: tw };
          S.wire(c, [[b.cx, busY], [b.cx, ty]], { color: C.faint, width: 1.2, round: 0 });
          if (id === 'pwm' && s.pwm) {                 // a little waveform inside the block: it runs by itself
            const edges = S.pwmEdges(1, clamp(s.duty / 255, 0, 1), 0, 3);
            S.wave(c, tx + 6, ty + perH - 15, tw - 12, 9, edges, { t0: 0, t1: 3, color: C.accent, width: 1.4 });
          }
          if (pin) {
            const pid = id === 'gpioin' ? 'pin_in' : id === 'gpioout' ? 'pin_out' : id === 'adc' ? 'pin_adc' : id === 'pwm' ? 'pin_pwm' : 'pin_tx';
            pos[pid] = { cx: b.cx, cy: pinY };
            S.wire(c, [[b.cx, ty + perH], [b.cx, pinY]], { color: C.faint, width: 1.2, round: 0 });
            kit.dot(c, b.cx, pinY, 4, '#e9c46a');
            S.text(c, pin, b.cx, pinY + 12, { size: 9.5, color: C.muted });
          }
        });
        // the outside world
        const partY = pinY + Math.min(62, (A.h - chipH) * 0.62);
        const used = p.externals;
        const dim = id => (used.indexOf(id) < 0 ? 0.28 : 1);
        const ph = flowT * 60;
        c.save(); c.globalAlpha = dim('button');
        S.wire(c, [[pos.pin_in.cx, pinY], [pos.pin_in.cx, partY - 14]], { color: C.muted });
        hit = S.button(c, pos.pin_in.cx, partY, { pressed: !!ctl.values.btn, label: 'button' });
        c.restore();
        c.save(); c.globalAlpha = dim('led') * (used.indexOf('heater') >= 0 ? 0 : 1);
        if (used.indexOf('heater') < 0) { S.wire(c, [[pos.pin_out.cx, pinY], [pos.pin_out.cx, partY - 12]], { color: C.muted }); S.led(c, pos.pin_out.cx, partY, { color: 4, on: !!s.led, r: 9, label: 'LED' }); }
        c.restore();
        if (used.indexOf('heater') >= 0) { S.wire(c, [[pos.pin_out.cx, pinY], [pos.pin_out.cx, partY - 12]], { color: C.muted }); S.led(c, pos.pin_out.cx, partY, { color: 28, on: !!s.out, r: 11, label: 'heater' }); }
        c.save(); c.globalAlpha = dim('sensor');
        S.wire(c, [[pos.pin_adc.cx, pinY], [pos.pin_adc.cx, partY - 16]], { color: C.muted });
        S.pot(c, pos.pin_adc.cx, partY, 12, (ctl.values.temp - 10) / 20, { label: 'sensor' });
        c.restore();
        c.save(); c.globalAlpha = dim('pwmled');
        S.wire(c, [[pos.pin_pwm.cx, pinY + 14], [pos.pin_pwm.cx, partY - 12]], { color: C.muted });
        S.led(c, pos.pin_pwm.cx, partY, { color: 52, on: s.pwm ? s.duty / 255 : 0, r: 9, label: 'LED' });
        c.restore();
        c.save(); c.globalAlpha = dim('uart');
        S.wire(c, [[pos.pin_tx.cx, pinY], [pos.pin_tx.cx, partY - 10]], { color: C.muted });
        S.text(c, s.sent ? 'Pressed: ' + s.count : 'serial', pos.pin_tx.cx, partY, { size: 10.5, color: s.sent ? C.accent : C.muted, mono: true, weight: 600 });
        S.text(c, 'to the computer', pos.pin_tx.cx, partY + 14, { size: 9.5, color: C.muted });
        c.restore();
        // data moving along the paths of the current beat
        const pathOf = (a, b) => {
          const A1 = pos[a], B1 = pos[b];
          const top = id => id === 'flash' || id === 'cpu' || id === 'ram';
          if (top(a) && top(b)) return A1.cx < B1.cx ? [A1.r, B1.l] : [A1.l, B1.r];
          if (top(a) || top(b)) { const tp0 = top(a) ? A1 : B1, per = top(a) ? B1 : A1, pts = [[tp0.cx, tp0.b[1]], [tp0.cx, busY], [per.cx, busY], [per.cx, per.t[1]]]; return top(a) ? pts : pts.reverse(); }
          if (a.indexOf('pin_') === 0) return [[A1.cx, A1.cy], [B1.cx, B1.t[1] + perH]];
          if (b.indexOf('pin_') === 0) return [[A1.cx, A1.b[1]], [B1.cx, B1.cy]];
          return [[A1.cx, A1.cy], [B1.cx, B1.cy]];
        };
        const flows = phase === 0 ? [['flash', 'cpu']] : phase === 1 ? p.steps[pc].flows : [];
        flows.forEach(([a, b]) => { if (pos[a] && pos[b]) S.flow(c, pathOf(a, b), ph, { color: C.accent, r: 3, gap: 16 }); });
        ro.set('line', phase === -1 ? '—' : (pc + 1) + ' of ' + p.lines.length + ' · ' + (phase === 0 ? 'fetching' : 'executing'));
        ro.set('what', note);
      }
      kit.click(st, pt => { if (hit && pt.x >= hit.x && pt.x <= hit.x + hit.w && pt.y >= hit.y && pt.y <= hit.y + hit.h && key === 'count') { ctl.set('btn', !ctl.values.btn, true); } },
        pt => !!(hit && key === 'count' && pt.x >= hit.x && pt.x <= hit.x + hit.w && pt.y >= hit.y && pt.y <= hit.y + hit.h));
      st.onResize(() => loop.once());
      showCtl();
      loop.start();
    }
  });

  /* ================================================================ ei-chip-module-board */
  // one chip with a module and a board that carry it (all ids are in the catalogue)
  const SETS = {
    'esp32': { module: 'esp32-wroom-32e', board: 'esp32-devkitc-v4' },
    'esp32-s3': { module: 'esp32-s3-wroom-1', board: 'esp32-s3-devkitc-1-v1.1' },
    'esp32-c3': { module: 'esp32-c3-mini-1', board: 'esp32-c3-devkitm-1' },
    'esp32-c6': { module: 'esp32-c6-wroom-1', board: 'esp32-c6-devkitc-1' }
  };
  const sortDims = z => (z && z.length >= 2 ? [Math.min(z[0], z[1]), Math.max(z[0], z[1])] : [10, 10]);
  const pkgMm = str => { const m = /(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)\s*mm/.exec(str || ''); return m ? [+m[1], +m[2]] : [5, 5]; };
  // wrap a sentence to about `n` characters per line
  function wrap(text, n) {
    const out = []; let line = '';
    String(text).split(' ').forEach(w => { if ((line + ' ' + w).trim().length > n && line) { out.push(line); line = w; } else line = (line + ' ' + w).trim(); });
    if (line) out.push(line);
    return out;
  }

  Hyper.sim('ei-chip-module-board', {
    title: 'Chip, module, board',
    blurb: `The same chip at three levels, drawn from the catalogue. Each level adds the things the one before still lacks. With **the same scale** ticked, the sizes are true to each other: the chip is only a few millimetres wide.

**Try this**
- Click a drawing to read its numbers on the right, then compare how much the chip shrinks next to the board.
- Choose another chip: the module and the board change, the chip's own limits do not.
- Untick *the same scale* to see each drawing at its own size.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 380, maxH: 520 });
      let sel = ['chip', 'module', 'board'].indexOf(params.layer) >= 0 ? params.layer : 'module';
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: Object.keys(SETS).map(k => [E.chip(k).name, k]), value: SETS[params.chip] ? params.chip : 'esp32' },
        { id: 'scale', type: 'check', label: 'Draw all three to the same scale', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['chip', 'The chip'], ['module', 'The module'], ['board', 'The board'], ['adds', 'The selected layer adds']]);
      const ADDS = {
        chip: 'Nothing yet: the processors, memory, peripherals and radio. It still needs flash, a crystal, radio matching and an antenna.',
        module: 'The flash memory (and sometimes PSRAM), the 40 MHz crystal, the radio matching, the antenna, a metal shield and, usually, a radio approval.',
        board: 'A USB socket (often with a USB-to-serial chip), a 3.3 V regulator, the EN and BOOT buttons, a power LED and pin headers.'
      };
      let rects = [];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const id = ctl.values.chip, set = SETS[id] || SETS.esp32;
        const chip = E.chip(id), mod = E.module(set.module), brd = E.board(set.board);
        const dim = { chip: pkgMm(chip.pkg && chip.pkg[0]), module: sortDims(mod && mod.size), board: sortDims(brd && brd.size) };
        const W = st.W, H = st.H, gap = 24, pw = (W - 2 * gap - 16) / 3, top = 8, ph = H - 16;
        const maxW = Math.max(dim.chip[0], dim.module[0], dim.board[0]), maxH = Math.max(dim.chip[1], dim.module[1], dim.board[1]);
        rects = [];
        const layers = ['chip', 'module', 'board'];
        const titles = { chip: 'The chip', module: 'The module', board: 'The board' };
        const caps = {
          chip: chip.name + ' · ' + ((chip.pkg && chip.pkg[0]) || ''),
          module: mod ? mod.name + ' · ' + dim.module[0] + ' × ' + dim.module[1] + ' mm' : 'a module',
          board: brd ? brd.name + ' · ' + dim.board[0] + ' × ' + dim.board[1] + ' mm' : 'a board'
        };
        const adds = { chip: 'processors · memory · peripherals · radio', module: '+ flash · crystal · radio matching · antenna · shield · approval', board: '+ USB · regulator · buttons · pin headers' };
        const capN = Math.max(10, Math.floor(pw / 6.4)), addN = Math.max(10, Math.floor(pw / 6));
        const nc = Math.max.apply(null, layers.map(L => wrap(caps[L], capN).length)), na = Math.max.apply(null, layers.map(L => wrap(adds[L], addN).length));
        const aw = pw - 8, ah = Math.max(60, ph - (50 + nc * 13 + 8 + na * 12));   // room for the drawing
        const sCommon = Math.min(aw / maxW, ah / maxH) * 0.96;
        layers.forEach((L, i) => {
          const px = 8 + i * (pw + gap), cx = px + pw / 2, cy = top + 30 + ah / 2;
          const on = sel === L;
          S.box(c, px, top, pw, ph, { color: on ? C.accent : C.faint, active: on, fill: on ? undefined : 'rgba(0,0,0,0)', r: 10 });
          rects.push({ x: px, y: top, w: pw, h: ph, L });
          S.text(c, titles[L], cx, top + 16, { size: 13, color: C.text, weight: 650 });
          const s = ctl.values.scale ? sCommon : Math.min(aw / dim[L][0], ah / dim[L][1]) * 0.9;
          const w = dim[L][0] * s, h = dim[L][1] * s;
          if (L === 'chip') {
            S.chip(c, cx - w / 2, cy - h / 2, Math.max(w, 12), Math.max(h, 12), { pads: 5 });
          } else if (L === 'module') {
            S.module(c, cx - w / 2, cy - h / 2, w, h, { antenna: mod && /connector|U\.FL/i.test(mod.antenna) ? 'ufl' : 'pcb', label: mod ? mod.name.replace(/^ESP32-?/, '') : '' });
            const cw = Math.max(10, dim.chip[0] * s);              // the chip hides under the shield
            c.save(); c.setLineDash([3, 3]); c.strokeStyle = '#2a2f3a'; c.lineWidth = 1.2; c.strokeRect(cx - cw / 2, cy + h * 0.1, cw, cw); c.restore();
          } else if (brd) {
            S.board(c, brd, { x: cx - w / 2, y: cy - h / 2, w, h }, { labels: false, title: false });
          }
          // caption and what it adds
          const capY = top + 36 + ah + 6;
          wrap(caps[L], capN).forEach((ln, k) => S.text(c, ln, cx, capY + k * 13, { size: 10.5, color: C.text2 || C.muted, weight: 600 }));
          wrap(adds[L], addN).forEach((ln, k) => S.text(c, ln, cx, capY + nc * 13 + 8 + k * 12, { size: 10, color: C.muted }));
          if (i < 2) S.text(c, '+', px + pw + gap / 2, cy, { size: 20, color: C.faint, weight: 700 });
        });
        ro.set('chip', chip.name + ', ' + ((chip.pkg && chip.pkg[0]) || 'package n/a'));
        ro.set('module', mod ? mod.name + ', ' + dim.module[0] + ' × ' + dim.module[1] + ' mm, ' + mod.pins + ' pads, flash ' + mod.flash + (mod.psram ? ', PSRAM ' + mod.psram : '') : '—');
        ro.set('board', brd ? brd.name + ', ' + dim.board[0] + ' × ' + dim.board[1] + ' mm, ' + (brd.usb && brd.usb.conn || 'USB') : '—');
        ro.set('adds', ADDS[sel]);
      }, box.stage);
      kit.click(st, p => { const r = rects.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (r) { sel = r.L; loop.once(); } },
        p => rects.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ei-name-decoder */
  // each name: parts [{ t: text shown, sep: text before it, say: what it means }], chip: its catalogue id
  const HUES = [8, 200, 150, 40, 300];
  const NAMES = [
    { name: 'ESP32', chip: 'esp32', parts: [{ t: 'ESP32', say: 'The brand of the whole line, and with nothing after it the name of the first chip, released in 2016: two Xtensa cores, Wi-Fi 4, Bluetooth Classic and Low Energy.' }] },
    { name: 'ESP32-S3', chip: 'esp32-s3', parts: [{ t: 'ESP32', say: 'The brand of the line.' }, { sep: '-', t: 'S', say: 'Series S: performance and peripherals (USB, cameras, displays, machine learning). The S2 and S3 have Xtensa cores; the newest S-series chip, the S31, is RISC-V.' }, { t: '3', say: 'A label inside the series (S2, S3, S31). It tells the chips apart; it is not a grade.' }] },
    { name: 'ESP32-C3', chip: 'esp32-c3', parts: [{ t: 'ESP32', say: 'The brand of the line.' }, { sep: '-', t: 'C', say: 'Series C: low-cost RISC-V chips with Wi-Fi and Bluetooth LE (C2, C3, C5, C6, C61).' }, { t: '3', say: 'The label of this chip: the one announced at the end of 2020 as Espressif\'s first RISC-V chip.' }] },
    { name: 'ESP32-C6', chip: 'esp32-c6', parts: [{ t: 'ESP32', say: 'The brand of the line.' }, { sep: '-', t: 'C', say: 'Series C: low-cost RISC-V chips with Wi-Fi and Bluetooth LE.' }, { t: '6', say: 'A label inside the series. The C6 adds Wi-Fi 6 and an 802.15.4 radio (Zigbee, Thread) to the C3\'s abilities.' }] },
    { name: 'ESP32-C61', chip: 'esp32-c61', parts: [{ t: 'ESP32', say: 'The brand of the line.' }, { sep: '-', t: 'C', say: 'Series C.' }, { t: '61', say: 'Two digits make it a chip of its own and not a revision: a cost-reduced sibling of the C6, with Wi-Fi 6 and PSRAM support but no Zigbee or Thread.' }] },
    { name: 'ESP32-H2', chip: 'esp32-h2', parts: [{ t: 'ESP32', say: 'The brand of the line.' }, { sep: '-', t: 'H', say: 'Series H: Bluetooth LE and 802.15.4 (Zigbee, Thread) at very low power, and no Wi-Fi.' }, { t: '2', say: 'A label inside the series (H2, H4, H21).' }] },
    { name: 'ESP32-P4', chip: 'esp32-p4', parts: [{ t: 'ESP32', say: 'The brand of the line.' }, { sep: '-', t: 'P', say: 'Series P: high performance and no radio at all, built for screens and cameras. Wireless comes from a companion chip.' }, { t: '4', say: 'The only P-series chip so far.' }] },
    { name: 'ESP32-S31', chip: 'esp32-s31', parts: [{ t: 'ESP32', say: 'The brand of the line.' }, { sep: '-', t: 'S', say: 'Series S, now with a RISC-V processor, so the letter does not promise Xtensa.' }, { t: '31', say: 'Two digits: another chip of its own, introduced in 2026 with Wi-Fi 6, Bluetooth Classic and 802.15.4.' }] },
    { name: 'ESP8266', chip: 'esp8266', parts: [{ t: 'ESP', say: 'The older brand stem: the same company, before the "32" generation.' }, { t: '8266', say: 'The model number of the first-generation Wi-Fi chip of 2014. It carries no series letter: it came before the series naming.' }] },
    { name: 'ESP8684', chip: 'esp32-c2', parts: [{ t: 'ESP', say: 'The brand stem.' }, { t: '8684', say: 'The sales name of the ESP32-C2: the same chip sold under a product number of its own, named by Espressif as the upgrade from the ESP8266.' }] },
    { name: 'ESP32-S3-WROOM-1-N16R8', chip: 'esp32-s3', parts: [{ t: 'ESP32-S3', say: 'The chip inside: series S, label 3.' }, { sep: '-', t: 'WROOM', say: 'The module family: a module with a PCB antenna under a shield. This is a module, not a chip.' }, { sep: '-', t: '1', say: 'The version of that module family.' }, { sep: '-', t: 'N16', say: '16 MB of flash memory.' }, { t: 'R8', say: '8 MB of PSRAM, extra RAM beside the flash.' }] },
    { name: 'ESP32-C3-MINI-1U-N4', chip: 'esp32-c3', parts: [{ t: 'ESP32-C3', say: 'The chip inside: series C, label 3.' }, { sep: '-', t: 'MINI', say: 'The module family: a small module, 13.2 mm wide.' }, { sep: '-', t: '1', say: 'The version of that family.' }, { t: 'U', say: 'An antenna connector (U.FL) instead of a printed antenna.' }, { sep: '-', t: 'N4', say: '4 MB of flash memory.' }] }
  ];

  Hyper.sim('ei-name-decoder', {
    title: 'The name decoder',
    blurb: `Pick a name and each part of it is explained. Chip names are a brand, a series letter and a number; module names add the module family, a version and codes for flash and PSRAM ([[reading-a-module-part-number]] goes through those in detail).

**Try this**
- Compare *ESP32-C3*, *ESP32-C6* and *ESP32-C61*: the same letter, three different chips.
- Look at *ESP32-S31*: an S-series chip that is RISC-V, so the letter does not give the processor.
- Open the two module names and find the part that tells you which antenna and how much memory you are buying.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 480 });
      const start = Math.max(0, NAMES.findIndex(n => n.name === params.name));
      const ctl = kit.controls(box.side, [{ id: 'name', type: 'select', label: 'Name', options: NAMES.map((n, i) => [n.name, i]), value: start }], () => loop.once());
      const ro = kit.readout(box.side, [['tag', 'In the catalogue'], ['cpu', 'Processor'], ['radio', 'Radios'], ['year', 'Appeared']]);
      let sel = -1, boxes = [];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const n = NAMES[ctl.values.name] || NAMES[0], W = st.W;
        // the name, big, each part in its own colour
        const full = n.parts.map(p => (p.sep || '') + p.t).join('');
        const size = clamp((W - 40) / (full.length * 0.62), 14, 40);
        c.save(); c.font = '700 ' + size + 'px Consolas, "Cascadia Code", monospace';
        const widths = n.parts.map(p => c.measureText((p.sep || '') + p.t).width);
        const sepWs = n.parts.map(p => (p.sep ? c.measureText(p.sep).width : 0));
        c.restore();
        const total = widths.reduce((a, b) => a + b, 0);
        let x = (W - total) / 2; const y = 52;
        boxes = [];
        n.parts.forEach((p, i) => {
          const hue = HUES[i % HUES.length], colr = kit.hue(hue), w = widths[i], on = sel === i;
          if (on) { c.fillStyle = kit.hue(hue, 0.2); c.fillRect(x - 2, y - size * 0.7, w + 4, size * 1.4); }
          S.text(c, (p.sep || '') + p.t, x, y, { align: 'left', size, mono: true, weight: 700, color: colr });
          // a bracket under the part (not under its separator)
          const bx0 = x + sepWs[i], bx1 = x + w - 2;
          c.strokeStyle = colr; c.lineWidth = 2.4; c.beginPath(); c.moveTo(bx0, y + size * 0.72); c.lineTo(bx1, y + size * 0.72); c.stroke();
          S.text(c, String(i + 1), (bx0 + bx1) / 2, y + size * 0.72 + 14, { size: 11, color: colr, weight: 700 });
          boxes.push({ x: x, y: y - size * 0.8, w, h: size * 1.8 + 16, i });
          x += w;
        });
        // the explanations
        let yy = y + size * 0.72 + 40;
        const rowW = W - 36, perLine = Math.max(24, Math.floor((rowW - 70) / 6.3));
        n.parts.forEach((p, i) => {
          const hue = HUES[i % HUES.length], lines = wrap(p.say, perLine), on = sel === i;
          S.box(c, 12, yy - 10, 52, 22, { label: p.t.length > 6 ? p.t.slice(0, 6) : p.t, color: kit.hue(hue), active: on, size: 10.5, r: 6, textColor: kit.hue(hue) });
          lines.forEach((ln, k) => S.text(c, ln, 74, yy + k * 14 - (lines.length - 1) * 4, { align: 'left', size: 11.5, color: on ? C.text : C.text2 || C.muted }));
          yy += Math.max(30, lines.length * 14 + 12);
        });
        const ch = E.chip(n.chip);
        if (ch) {
          ro.set('tag', ch.tagline || '—');
          ro.set('cpu', ch.arch + ', ' + ch.cores + (ch.cores > 1 ? ' cores' : ' core') + ' at ' + ch.mhz + ' MHz');
          ro.set('radio', [ch.wifi ? 'Wi-Fi ' + ch.wifi.gen + ' (' + ch.wifi.bands.join(' + ') + ' GHz)' : '', ch.bt ? (ch.bt.classic ? 'Bluetooth Classic + LE' : 'Bluetooth LE') : '', ch.ieee802154 ? '802.15.4 (Zigbee, Thread)' : ''].filter(Boolean).join(' · ') || 'none');
          ro.set('year', String(ch.year));
        }
      }, box.stage);
      kit.click(st, p => { const b = boxes.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); sel = b ? b.i : -1; loop.once(); }, p => boxes.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ei-family-chart */
  const radioClass = c => {
    if (c.coproc) return 'co';
    const w = !!c.wifi, cl = !!(c.bt && c.bt.classic), le = !!c.bt, z = !!c.ieee802154;
    if (!w && !le && !z) return 'none';
    if (!w) return 'nowifi';
    if (cl && z) return 'all';
    if (cl) return 'classic';
    if (z) return 'mesh';
    return le ? 'le' : 'wifionly';
  };
  const radiosText = ch => [ch.wifi ? 'Wi-Fi ' + ch.wifi.gen + ' (' + ch.wifi.bands.join(' + ') + ' GHz)' : '', ch.bt ? (ch.bt.classic ? 'Bluetooth Classic + LE' : 'Bluetooth LE') : '', ch.ieee802154 ? '802.15.4 (Zigbee, Thread)' : ''].filter(Boolean).join(' · ') || 'none';
  const seriesOf = ch => { const m = /^esp32-([a-z])\d/.exec(ch.id); return m ? m[1].toUpperCase() : ch.id === 'esp8266' ? '8266' : 'orig'; };
  const statusOf = ch => (/^mass production/.test(ch.status || '') ? 'mass' : /sampling/.test(ch.status || '') ? 'sampling' : /announced/.test(ch.status || '') ? 'announced' : /not recommended/.test(ch.status || '') ? 'nrnd' : 'other');
  // colour modes: the legend keys in order, and for each key [label, hue]
  const MODES = {
    radio: { keys: ['wifionly', 'le', 'classic', 'mesh', 'all', 'nowifi', 'none', 'co'], info: { wifionly: ['Wi-Fi only', 40], le: ['Wi-Fi + Bluetooth LE', 205], classic: ['Wi-Fi + Bluetooth Classic and LE', 270], mesh: ['Wi-Fi + LE + 802.15.4', 150], all: ['Wi-Fi + Classic + LE + 802.15.4', 330], nowifi: ['No Wi-Fi: LE + 802.15.4', 95], none: ['No radio', 0], co: ['Co-processor', 20] }, of: radioClass },
    arch: { keys: ['x', 'r'], info: { x: ['Xtensa (incl. the ESP8266\'s L106)', 28], r: ['RISC-V', 205] }, of: ch => (/xtensa|tensilica/i.test(ch.arch) ? 'x' : 'r') },
    series: { keys: ['8266', 'orig', 'S', 'C', 'H', 'P', 'E'], info: { 8266: ['ESP8266', 0], orig: ['ESP32 (original)', 28], S: ['S series', 52], C: ['C series', 205], H: ['H series', 150], P: ['P series', 330], E: ['E22 co-processor', 270] }, of: ch => (ch.coproc ? 'E' : seriesOf(ch)) },
    status: { keys: ['mass', 'sampling', 'announced', 'nrnd'], info: { mass: ['Mass production', 150], sampling: ['Sampling', 40], announced: ['Announced', 205], nrnd: ['Not recommended for new designs', 0] }, of: statusOf }
  };
  const METRICS = {
    cpu: { label: 'cores × clock (MHz)', v: ch => (ch.cores && ch.mhz ? ch.cores * ch.mhz : null) },
    ram: { label: 'RAM on the chip (KB)', v: ch => ch.sram },
    gpio: { label: 'GPIO pins', v: ch => ch.gpio },
    sleep: { label: 'deep-sleep current (µA, lower is better)', v: ch => ch.sleepUa }
  };
  const shortName = ch => (ch.id === 'esp32' ? 'ESP32' : ch.id === 'esp8266' ? '8266' : ch.id.replace(/^esp32-/, '').toUpperCase());
  const niceTicks = (lo, hi, log) => {
    const out = [];
    if (log) { for (let k = Math.floor(Math.log10(lo)); k <= Math.ceil(Math.log10(hi)); k++) for (const m of [1, 2, 5]) { const v = m * Math.pow(10, k); if (v >= lo * 0.999 && v <= hi * 1.001) out.push(v); } return out; }
    const raw = (hi - lo) / 5, mag = Math.pow(10, Math.floor(Math.log10(raw))), step = ([1, 2, 5, 10].find(m => m * mag >= raw) || 10) * mag;
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(v);
    return out;
  };

  Hyper.sim('ei-family-chart', {
    title: 'The family on one chart',
    blurb: `Every chip of the catalogue is a mark: **across** is the year it appeared, **up** is the capability you choose. Circles are Xtensa processors and squares RISC-V ones. Click a mark to read the chip's details.

**Try this**
- Colour by **radio**: see when Bluetooth Classic, 802.15.4 and the first chip with no Wi-Fi arrived.
- Colour by **architecture** and watch the move from Xtensa to RISC-V after 2020.
- Switch the vertical axis to **deep-sleep current** (log scale): the newest chips are not always the thriftiest.
- Colour by **status** to see which chips are ready for a product and which are still samples.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 360, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'y', type: 'select', label: 'Up: capability', options: [['Processing (cores × MHz)', 'cpu'], ['RAM', 'ram'], ['GPIO pins', 'gpio'], ['Deep-sleep current', 'sleep']], value: METRICS[params.y] ? params.y : 'cpu' },
        { id: 'color', type: 'select', label: 'Colour by', options: [['Radios', 'radio'], ['Architecture', 'arch'], ['Series', 'series'], ['Status', 'status']], value: MODES[params.color] ? params.color : 'radio' },
        { id: 'log', type: 'check', label: 'Logarithmic scale', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['chip', 'Chip'], ['year', 'Appeared'], ['cpu', 'Processor'], ['radio', 'Radios'], ['status', 'Status']]);
      let sel = 'esp32-c3', marks = [];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const yk = ctl.values.y, mode = MODES[ctl.values.color], log = ctl.values.log;
        const items = E.CHIPS.filter(ch => { const v = METRICS[yk].v(ch); return v != null && v > 0; });
        const used = mode.keys.filter(k => items.some(ch => mode.of(ch) === k));
        let legendRows = 1, lx0 = 56;
        used.forEach(k => { const w = 22 + mode.info[k][0].length * 5.9; if (lx0 + w > W - 8) { lx0 = 56; legendRows++; } lx0 += w; });
        const M = { l: 56, r: 14, t: 14, b: 58 + legendRows * 16 }, pw = W - M.l - M.r, ph = H - M.t - M.b;
        const vals = items.map(ch => METRICS[yk].v(ch));
        const vmin = Math.min.apply(null, vals), vmax = Math.max.apply(null, vals);
        const lo = log ? Math.pow(10, Math.floor(Math.log10(vmin * 0.85))) : 0;
        const hi = log ? Math.pow(10, Math.ceil(Math.log10(vmax * 1.15))) : vmax * 1.12;
        const f = v => (log ? Math.log10(v) : v);
        const Y = v => M.t + ph - ((f(v) - f(lo)) / (f(hi) - f(lo) || 1)) * ph;
        const x0 = 2013.4, x1 = 2027.0, X = yr => M.l + ((yr - x0) / (x1 - x0)) * pw;
        // axes and grid
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1;
        niceTicks(lo, hi, log).forEach(v => {
          const y = Y(v); if (y < M.t - 1 || y > M.t + ph + 1) return;
          c.beginPath(); c.moveTo(M.l, y); c.lineTo(M.l + pw, y); c.stroke();
          S.text(c, kit.fmt(v, 3), M.l - 6, y, { align: 'right', size: 10, color: C.muted });
        });
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(M.l, M.t); c.lineTo(M.l, M.t + ph); c.lineTo(M.l + pw, M.t + ph); c.stroke();
        c.restore();
        for (let yr = 2014; yr <= 2026; yr++) { if (pw < 460 && yr % 2) continue; S.text(c, String(yr), X(yr + 0.5), M.t + ph + 12, { size: 10, color: C.muted }); }
        S.text(c, 'year the chip appeared', M.l + pw / 2, M.t + ph + 27, { size: 10.5, color: C.faint });
        S.text(c, METRICS[yk].label, 12, M.t + ph / 2, { size: 10.5, color: C.faint, rot: -Math.PI / 2 });
        // the marks; chips of one year are spread sideways
        const byYear = {};
        items.forEach(ch => { (byYear[ch.year] = byYear[ch.year] || []).push(ch); });
        marks = [];
        items.forEach(ch => {
          const grp = byYear[ch.year], k = grp.indexOf(ch), n = grp.length;
          const x = X(ch.year + 0.5 + (k - (n - 1) / 2) * 0.36), y = Y(METRICS[yk].v(ch));
          const key = mode.of(ch), info = mode.info[key] || ['', 0], hue = info[1];
          const colr = key === 'none' || (ctl.values.color === 'radio' && key === 'none') ? C.muted : kit.hue(hue);
          const risc = !/xtensa|tensilica/i.test(ch.arch), r = 7, on = sel === ch.id;
          c.save();
          if (on) { c.strokeStyle = C.accent; c.lineWidth = 2.5; c.beginPath(); if (risc) c.rect(x - r - 4, y - r - 4, 2 * r + 8, 2 * r + 8); else c.arc(x, y, r + 5, 0, Math.PI * 2); c.stroke(); }
          c.beginPath(); if (risc) c.rect(x - r, y - r, 2 * r, 2 * r); else c.arc(x, y, r, 0, Math.PI * 2);
          if (ch.coproc) { c.lineWidth = 2; c.strokeStyle = colr; c.stroke(); } else { c.fillStyle = colr; c.fill(); }
          c.restore();
          S.text(c, shortName(ch), x, k % 2 === 0 ? y - r - 9 : y + r + 10, { size: 10.5, color: on ? C.text : C.text2 || C.muted, weight: on ? 700 : 500 });
          marks.push({ x, y, id: ch.id });
        });
        // the legend
        let lx = M.l, ly = M.t + ph + 46;
        used.forEach(k => {
          const lab = mode.info[k][0], w = 22 + lab.length * 5.9;
          if (lx + w > W - 8) { lx = M.l; ly += 16; }
          kit.dot(c, lx + 5, ly, 5, k === 'none' ? C.muted : kit.hue(mode.info[k][1]));
          S.text(c, lab, lx + 14, ly, { align: 'left', size: 10.5, color: C.text2 || C.muted });
          lx += w;
        });
        S.text(c, 'circle: Xtensa · square: RISC-V' + (items.some(ch => ch.coproc) ? ' · hollow: co-processor' : ''), W - 10, M.t + ph + 40, { align: 'right', size: 9.5, color: C.faint });
        const ch = E.chip(sel);
        if (ch) {
          ro.set('chip', ch.name + ' — ' + (ch.tagline || ''));
          ro.set('year', String(ch.year));
          ro.set('cpu', ch.arch + ', ' + ch.cores + (ch.cores > 1 ? ' cores' : ' core') + ' at ' + ch.mhz + ' MHz, ' + fmtKb(ch.sram) + ' RAM');
          ro.set('radio', radiosText(ch));
          ro.set('status', ch.status || '—');
        }
      }, box.stage);
      const near = p => { let best = null, bd = 18; marks.forEach(m => { const d = Math.hypot(p.x - m.x, p.y - m.y); if (d < bd) { bd = d; best = m; } }); return best; };
      kit.click(st, p => { const m = near(p); if (m) { sel = m.id; loop.once(); } }, p => !!near(p));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ei-compare-mcus */
  // Typical, well-known figures for popular parts of other families (the datasheet of an exact part decides).
  const OTHERS = [
    { id: 'uno', name: 'Uno (ATmega328P)', hue: 212, cores: 1, mhz: 16, ram: 2, radios: [], wins: 'The simplest to reason about: 5 V pins that forgive a lot, no radio stack, no operating system. Its deepest sleep is well under a microamp (chip alone, typical); the board around it draws far more.' },
    { id: 'pico', name: 'Pico (RP2040)', hue: 340, cores: 2, mhz: 133, ram: 264, radios: [], wins: 'PIO: small programmable state machines that make custom signals with exact timing and no processor load. Very low price, excellent documentation, two identical cores.' },
    { id: 'picow', name: 'Pico W (RP2040)', hue: 340, cores: 2, mhz: 133, ram: 264, radios: ['Wi-Fi 4', 'Bluetooth'], wins: 'A Pico with Wi-Fi 4 and Bluetooth added on a separate radio chip. Keeps PIO and the price advantage; has no Zigbee or Thread.' },
    { id: 'pico2', name: 'Pico 2 (RP2350)', hue: 340, cores: 2, mhz: 150, ram: 520, radios: [], wins: 'More memory and speed than the RP2040, a choice of Arm or RISC-V cores, more PIO state machines and hardware security features.' },
    { id: 'stm32f4', name: 'STM32F411', hue: 190, cores: 1, mhz: 100, ram: 128, radios: [], wins: 'Industrial peripherals (CAN, fast timers, good converters), a huge family from small to very fast, and published availability commitments on many lines.' },
    { id: 'stm32h7', name: 'STM32H743', hue: 190, cores: 1, mhz: 480, ram: 1000, radios: [], wins: 'Raw speed and memory for a microcontroller, with Ethernet, USB high speed and motor-control timers. The tools are steeper and the part has no radio.' },
    { id: 'nrf52832', name: 'nRF52832', hue: 268, cores: 1, mhz: 64, ram: 64, radios: ['Bluetooth LE'], wins: 'Built around low-power Bluetooth LE with a mature stack, a few microamps asleep with memory kept, and NFC. No Wi-Fi.' },
    { id: 'nrf52840', name: 'nRF52840', hue: 268, cores: 1, mhz: 64, ram: 256, radios: ['Bluetooth LE', '802.15.4'], wins: 'The same low-power Bluetooth, with 802.15.4 for Thread and Zigbee, USB, and more memory. No Wi-Fi.' },
    { id: 'nrf54l15', name: 'nRF54L15', hue: 268, cores: 1, mhz: 128, ram: 256, radios: ['Bluetooth LE', '802.15.4'], wins: 'Nordic\'s newer low-power line: faster and more efficient than the nRF52 at the same job, with the same radios. No Wi-Fi.' }
  ];
  const ESP_SHOWN = ['esp8266', 'esp32', 'esp32-s3', 'esp32-c3', 'esp32-c6', 'esp32-h2', 'esp32-p4'];
  const COMPARE = { clock: ['Clock (MHz)', 'mhz'], ram: ['RAM (KB)', 'ram'], cores: ['Cores', 'cores'] };

  Hyper.sim('ei-compare-mcus', {
    title: 'The ESP family against the rest',
    blurb: `Bars compare one number across the ESP chips (red) and popular parts of the other families. The ESP figures come from the chip catalogue; the others are **typical published figures** for a popular part, and every family has many variants.

**Try this**
- Compare **RAM**: an Arduino Uno has 2 KB, a classic ESP32 has 520 KB.
- Compare **clock speed** on the linear scale: an STM32H743 at 480 MHz tops the clock of every ESP chip, the P4's 400 MHz included.
- Click a bar and read where that family is the better choice.
- Remember what a bar cannot show: radios, sleep current, price, peripherals and the supply promise.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 430, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'm', type: 'select', label: 'Compare', options: Object.keys(COMPARE).map(k => [COMPARE[k][0], k]), value: COMPARE[params.metric] ? params.metric : 'ram' },
        { id: 'log', type: 'check', label: 'Logarithmic scale', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['part', 'Part'], ['radio', 'Radios'], ['src', 'Figures from'], ['wins', 'Where this family is the better choice']]);
      let sel = 'esp32-c3', rows = [];
      const all = () => {
        const esp = ESP_SHOWN.map(id => E.chip(id)).filter(Boolean).map(ch => ({ id: ch.id, name: ch.id === 'esp32' ? 'ESP32' : ch.id === 'esp8266' ? 'ESP8266' : ch.name.replace(/ \(.*/, ''), esp: true, hue: 8, cores: ch.cores, mhz: ch.mhz, ram: ch.sram, radios: [ch.wifi ? 'Wi-Fi ' + ch.wifi.gen : null, ch.bt ? (ch.bt.classic ? 'Bluetooth Classic + LE' : 'Bluetooth LE') : null, ch.ieee802154 ? '802.15.4' : null].filter(Boolean), wins: (ch.good && ch.good[0]) || ch.tagline || '' }));
        return esp.concat(OTHERS.map(o => Object.assign({ esp: false }, o)));
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const key = COMPARE[ctl.values.m][1], log = ctl.values.log && key !== 'cores';
        const list = all().filter(r => r[key] > 0).sort((a, b) => b[key] - a[key]);
        const labelW = 124, radioW = W < 480 ? 0 : 124, left = 8 + labelW, right = W - 8 - radioW - 50;
        const short = r => r.radios.map(x => x.replace('Bluetooth Classic + LE', 'BT + LE').replace('Bluetooth LE', 'LE').replace('Bluetooth', 'BT').replace('802.15.4', '15.4')).join(' · ') || 'none';
        const top = 30, rowH = Math.max(18, Math.min(30, (H - top - 22) / list.length));
        const vmax = Math.max.apply(null, list.map(r => r[key])), vmin = Math.min.apply(null, list.map(r => r[key]));
        const lo = log ? Math.pow(10, Math.floor(Math.log10(vmin * 0.7))) : 0, hi = log ? Math.pow(10, Math.ceil(Math.log10(vmax * 1.05))) : vmax * 1.05;
        const f = v => (log ? Math.log10(v) : v);
        const len = v => clamp((f(v) - f(lo)) / (f(hi) - f(lo) || 1), 0.01, 1) * (right - left);
        S.text(c, COMPARE[ctl.values.m][0] + (log ? ' · log scale' : ''), left, 14, { align: 'left', size: 11, color: C.muted, weight: 600 });
        if (radioW) S.text(c, 'radios', W - 8 - radioW, 14, { align: 'left', size: 11, color: C.muted, weight: 600 });
        rows = [];
        list.forEach((r, i) => {
          const y = top + i * rowH + rowH / 2, on = sel === r.id, colr = r.esp ? kit.hue(8) : kit.hue(r.hue);
          if (on) { c.fillStyle = C.dark ? 'rgba(123,140,255,.16)' : 'rgba(60,90,220,.10)'; c.fillRect(4, y - rowH / 2, W - 8, rowH); }
          S.text(c, r.name, 8 + labelW - 6, y, { align: 'right', size: 11.5, color: C.text, weight: r.esp ? 650 : 500 });
          c.fillStyle = colr; c.globalAlpha = r.esp ? 0.95 : 0.8; c.fillRect(left, y - rowH * 0.3, len(r[key]), rowH * 0.6); c.globalAlpha = 1;
          S.text(c, kit.fmt(r[key], 3), left + len(r[key]) + 5, y, { align: 'left', size: 11, color: C.text2 || C.muted, weight: 600 });
          if (radioW) S.text(c, short(r), W - 8 - radioW, y, { align: 'left', size: 10, color: r.radios.length ? C.text2 || C.muted : C.faint });
          rows.push({ y0: y - rowH / 2, y1: y + rowH / 2, id: r.id });
        });
        const r = all().find(q => q.id === sel);
        if (r) {
          ro.set('part', r.name + (r.esp ? ' (ESP family)' : ''));
          ro.set('radio', r.radios.length ? r.radios.join(' + ') + (r.id === 'picow' ? ' (on a separate chip)' : '') : 'none');
          ro.set('src', r.esp ? 'the chip catalogue' : 'typical published figures');
          ro.set('wins', r.wins);
        }
      }, box.stage);
      kit.click(st, p => { const r = rows.find(q => p.y >= q.y0 && p.y <= q.y1); if (r) { sel = r.id; loop.once(); } }, p => rows.some(q => p.y >= q.y0 && p.y <= q.y1));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ei-chip-filter */
  // what a project may need; each test says whether a chip has it, and the reason when not
  const NEEDS = [
    ['wifi', 'Wi-Fi', ch => !!ch.wifi, 'no Wi-Fi'],
    ['wifi6', 'Wi-Fi 6', ch => !!(ch.wifi && ch.wifi.gen >= 6), 'no Wi-Fi 6'],
    ['wifi5', '5 GHz Wi-Fi', ch => !!(ch.wifi && ch.wifi.bands.indexOf(5) >= 0), 'no 5 GHz'],
    ['ble', 'Bluetooth LE', ch => !!ch.bt, 'no Bluetooth'],
    ['classic', 'Bluetooth Classic (audio, serial)', ch => !!(ch.bt && ch.bt.classic), 'no Bluetooth Classic'],
    ['thread', 'Zigbee or Thread (802.15.4)', ch => !!ch.ieee802154, 'no 802.15.4'],
    ['usb', 'USB device (keyboard, drive, MIDI)', ch => (ch.usb || []).some(u => /otg/i.test(u)), 'no USB OTG'],
    ['cam', 'Camera or big colour display', ch => (ch.cam || []).length > 0 || (ch.lcd || []).some(l => /rgb|dsi/i.test(l)), 'no camera or big-display interface'],
    ['pins', '40 or more GPIO pins', ch => ch.gpio >= 40, 'fewer than 40 GPIOs'],
    ['cores', 'Two cores', ch => ch.cores >= 2, 'one core'],
    ['ready', 'Ready to use today', ch => /^mass production/.test(ch.status || '') && !/preview/i.test((ch.sw && ch.sw.idf) || '') && !!ch.sw && (ch.sw.arduino === true || ch.sw.mpy === true || /^v/.test(ch.sw.idf || '')), 'not ready: ' ]
  ];
  const PRESETS = [
    ['A starting point…', '', []],
    ['Battery sensor on Wi-Fi', 'a', ['wifi', 'ready']],
    ['Zigbee light switch', 'b', ['thread', 'ready']],
    ['Music to a phone speaker', 'c', ['classic', 'ready']],
    ['Touch-screen thermostat', 'd', ['wifi', 'ble', 'cam', 'ready']],
    ['USB keyboard with Bluetooth', 'e', ['usb', 'ble', 'ready']]
  ];

  Hyper.sim('ei-chip-filter', {
    title: 'Strike off the chips',
    blurb: `Tick what the project needs. Every chip that lacks something is struck off and says why; the green ones are what remains. The data is the chip catalogue, and the order of the needs is the order of the page: radios and interfaces remove the most chips.

**Try this**
- Pick an example from the list, then add a need and watch the green set shrink.
- Tick *Bluetooth Classic*: how many chips are left, and which?
- Tick *5 GHz Wi-Fi* and *Zigbee or Thread*: is there a chip with both?
- Compare with and without *Ready to use today*. For a description in words, use [the project advisor](#/tools/advisor); to compare chips in detail, use [the chip explorer](#/tools/chips).`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 360, maxH: 520 });
      const defs = [{ id: 'preset', type: 'select', label: 'Example', options: PRESETS.map(p => [p[0], p[1]]), value: '' }]
        .concat(NEEDS.map(n => ({ id: n[0], type: 'check', label: n[1], value: false })))
        .concat([{ type: 'buttons', items: [{ id: 'clear', label: 'Clear all' }] }]);
      const ctl = kit.controls(box.side, defs, (id, v) => {
        if (id === 'preset') { const pr = PRESETS.find(p => p[1] === v); NEEDS.forEach(n => ctl.set(n[0], !!(pr && pr[2].indexOf(n[0]) >= 0))); }
        if (id === 'clear') { NEEDS.forEach(n => ctl.set(n[0], false)); ctl.set('preset', ''); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['left', 'Chips left'], ['names', 'They are']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const chips = E.CHIPS, want = NEEDS.filter(n => ctl.values[n[0]]);
        const verdicts = chips.map(ch => {
          const why = [];
          if (ch.coproc) why.push('a co-processor for other processors, not a chip to program');
          want.forEach(n => { if (!n[2](ch)) why.push(n[0] === 'ready' ? 'not ready today (' + (/preview/i.test((ch.sw && ch.sw.idf) || '') ? 'software in preview' : (ch.status || 'status unknown')) + ')' : n[3]); });
          return { ch, why };
        });
        const cols = W < 520 ? 3 : W < 760 ? 4 : 5, gap = 8, tw = (W - 16 - (cols - 1) * gap) / cols, rowsN = Math.ceil(chips.length / cols);
        const th = Math.max(54, Math.min(86, (H - 16 - (rowsN - 1) * gap) / rowsN));
        verdicts.forEach((v, i) => {
          const x = 8 + (i % cols) * (tw + gap), y = 8 + Math.floor(i / cols) * (th + gap), ok = v.why.length === 0;
          S.box(c, x, y, tw, th, { color: ok ? C.ok : C.faint, active: ok, fill: ok ? undefined : 'rgba(0,0,0,0)', r: 8 });
          S.text(c, v.ch.name.replace(/ \(.*/, ''), x + tw / 2, y + 13, { size: 12, color: ok ? C.text : C.muted, weight: 650 });
          S.text(c, (/xtensa|tensilica/i.test(v.ch.arch) ? 'Xtensa' : 'RISC-V') + ' · ' + v.ch.cores + ' × ' + v.ch.mhz + ' MHz', x + tw / 2, y + 27, { size: 9.5, color: C.muted });
          if (ok) S.text(c, 'meets every need', x + tw / 2, y + th - 14, { size: 10.5, color: C.ok, weight: 650 });
          else wrap(v.why[0] + (v.why.length > 1 ? ' (+' + (v.why.length - 1) + ' more)' : ''), Math.max(14, Math.floor(tw / 5.6))).slice(0, 3).forEach((ln, k) => S.text(c, ln, x + tw / 2, y + 42 + k * 11, { size: 9.5, color: C.bad }));
        });
        const left = verdicts.filter(v => v.why.length === 0);
        ro.set('left', left.length + ' of ' + chips.length + (want.length ? '' : ' (no needs ticked)'));
        ro.set('names', left.length ? left.map(v => v.ch.name.replace(/ \(.*/, '')).join(', ') : 'none: relax a need, or look for a companion chip');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ei-datasheet-reader */
  const DS_CHIPS = ['esp32', 'esp32-s3', 'esp32-c3', 'esp32-c6', 'esp32-h2', 'esp8266'];
  const DS_HELP = {
    vdd: 'A recommended operating condition: inside it every guarantee in the datasheet applies, outside it nothing is promised. The absolute maximum is a different, harsher limit where damage can begin, and the datasheet lists it in its own table.',
    temp: 'The range of temperature the chip is guaranteed over. A module can be narrower than its chip: read the table of the exact part you buy.',
    sleep: 'A typical value under one set of conditions (only the timer awake, room temperature). A real board adds its regulator and LEDs, and a hot or poor sample can draw more. Budget with a margin.',
    rx: 'The current while the radio listens. The supply must be able to carry it for as long as the radio listens, not only on average.',
    tx: 'The current while transmitting at full power, in short bursts. The regulator and the capacitors on the supply must deliver this peak, and the battery sees it as a spike.',
    pwr: 'The strongest signal the chip can send. The limit allowed in your country may be lower, and a certified module is approved only with its own antenna.'
  };

  Hyper.sim('ei-datasheet-reader', {
    title: 'A datasheet table, read',
    blurb: `A page of electrical characteristics, filled from the chip catalogue. Click a row to read how it is meant to be read; then check a supply voltage and a temperature against the guaranteed range.

**Try this**
- Set the supply to **4.2 V**, as a fully charged lithium cell gives, and read the verdict: the chip needs a regulator.
- Choose the **ESP32-S3**, tick *octal PSRAM module* and raise the temperature past 65 °C: the module's limit is lower than the chip's.
- Click the deep-sleep row: it is a typical value with conditions, and a board adds to it.
- Compare the receive and transmit currents with the sleep current: the ratio is why a battery device sleeps nearly always.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 380, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: DS_CHIPS.map(k => [E.chip(k).name, k]), value: DS_CHIPS.indexOf(params.chip) >= 0 ? params.chip : 'esp32-c3' },
        { id: 'v', label: 'Supply voltage', min: 2.0, max: 4.5, step: 0.05, value: 3.3, unit: 'V' },
        { id: 'tc', label: 'Temperature', min: -50, max: 130, step: 1, value: 25, unit: '°C' },
        { id: 'oct', type: 'check', label: 'Module with octal PSRAM (ESP32-S3 only)', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['supply', 'Supply'], ['temp', 'Temperature'], ['help', 'How to read this row']]);
      let sel = 'vdd', rows = [];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const ch = E.chip(ctl.values.chip), v = ctl.values.v, tc = ctl.values.tc;
        const vdd = ch.vdd || [3, 3.6], tr = ch.tempC || [-40, 105];
        const octal = ctl.values.oct && ch.id === 'esp32-s3';
        const tMax = octal ? 65 : tr[1];
        const f1 = x => kit.fmt(x, 3);
        // the table
        const TB = [
          { id: 'vdd', name: 'Supply voltage', min: f1(vdd[0]), typ: '3.3', max: f1(vdd[1]), unit: 'V', cond: 'recommended range' },
          { id: 'temp', name: 'Operating temperature', min: f1(tr[0]), typ: '—', max: f1(tMax), unit: '°C', cond: octal ? 'octal PSRAM module' : 'chip rating' },
          { id: 'sleep', name: 'Deep-sleep current', min: '—', typ: ch.sleepUa != null ? f1(ch.sleepUa) : 'n/p', max: '—', unit: 'µA', cond: 'timer only, 25 °C' },
          { id: 'rx', name: 'Receive current', min: '—', typ: ch.rxMa != null ? f1(ch.rxMa) : 'n/p', max: '—', unit: 'mA', cond: 'radio listening' },
          { id: 'tx', name: 'Transmit current', min: '—', typ: ch.txMa != null ? f1(ch.txMa) : 'n/p', max: '—', unit: 'mA', cond: 'full power, peak' },
          { id: 'pwr', name: 'Transmit power', min: '—', typ: ch.txDbm != null ? f1(ch.txDbm) : 'n/p', max: '—', unit: 'dBm', cond: 'Wi-Fi, maximum' }
        ];
        const X = [0, 0.36, 0.47, 0.58, 0.68, 0.76].map((fr, i) => (i === 0 ? 10 : 10 + (W - 20) * fr));
        const rh = Math.min(34, (H - 150) / TB.length), y0 = 40;
        S.text(c, ch.name + ' · electrical characteristics', 10, 14, { align: 'left', size: 12.5, color: C.text, weight: 650 });
        if (W >= 600) S.text(c, 'values from the catalogue (n/p: not published)', W - 10, 14, { align: 'right', size: 10, color: C.faint });
        const head = ['Parameter', 'Min', 'Typ', 'Max', 'Unit', 'Conditions'];
        c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)'; c.fillRect(6, y0 - 12, W - 12, 22);
        head.forEach((h, i) => S.text(c, h, X[i], y0, { align: 'left', size: 10.5, color: C.muted, weight: 700 }));
        rows = [];
        TB.forEach((r, i) => {
          const y = y0 + 22 + i * rh, on = sel === r.id;
          if (on) { c.fillStyle = C.dark ? 'rgba(123,140,255,.20)' : 'rgba(60,90,220,.12)'; c.fillRect(6, y - rh / 2, W - 12, rh); }
          S.text(c, r.name, X[0], y, { align: 'left', size: 11.5, color: C.text, weight: on ? 700 : 500 });
          [r.min, r.typ, r.max, r.unit, r.cond].forEach((t, k) => S.text(c, t, X[k + 1], y, { align: 'left', size: k === 4 ? 10 : 11.5, color: k === 1 ? C.accent : C.text2 || C.muted, weight: k === 1 ? 700 : 500, mono: k < 3 }));
          rows.push({ y0: y - rh / 2, y1: y + rh / 2, id: r.id });
        });
        // the checks
        const yb = y0 + 22 + TB.length * rh + 22, bw = (W - 30) / 2;
        const supply = v < vdd[0] ? ['bad', 'Below the guaranteed minimum (' + f1(vdd[0]) + ' V): the chip may reset or misbehave, especially when the radio transmits.'] : v > vdd[1] ? ['bad', 'Above the recommended maximum (' + f1(vdd[1]) + ' V): not allowed. A lithium cell at 4.2 V needs a regulator, and the datasheet\'s absolute maximum table gives the point where damage begins.'] : ['ok', 'Inside the recommended range: the datasheet\'s guarantees apply.'];
        const tem = tc < tr[0] ? ['bad', 'Colder than the guaranteed minimum (' + tr[0] + ' °C).'] : tc > tMax ? ['bad', 'Hotter than the guaranteed maximum (' + tMax + ' °C)' + (octal ? ': this module\'s octal PSRAM is rated lower than the chip.' : '.')] : tc > tMax - 10 ? ['warn', 'Inside the range, but within 10 °C of the limit: leave a margin.'] : ['ok', 'Inside the guaranteed range.'];
        [['Supply ' + f1(v) + ' V', supply, 10], ['Temperature ' + f1(tc) + ' °C', tem, 20 + bw]].forEach(([title, res, x]) => {
          const colr = res[0] === 'ok' ? C.ok : res[0] === 'warn' ? C.warn : C.bad;
          S.box(c, x, yb, bw, H - yb - 10, { color: colr, active: true, r: 8 });
          S.text(c, title, x + 10, yb + 14, { align: 'left', size: 12, color: colr, weight: 700 });
          wrap(res[1], Math.max(16, Math.floor((bw - 20) / 5.8))).slice(0, 6).forEach((ln, k) => S.text(c, ln, x + 10, yb + 32 + k * 13, { align: 'left', size: 10.5, color: C.text2 || C.muted }));
        });
        ro.set('supply', supply[0] === 'ok' ? 'inside the range' : supply[0] === 'bad' ? 'outside the range' : 'near a limit');
        ro.set('temp', tem[0] === 'ok' ? 'inside the range' : tem[0] === 'warn' ? 'near the limit' : 'outside the range');
        ro.set('help', DS_HELP[sel]);
      }, box.stage);
      kit.click(st, p => { const r = rows.find(q => p.y >= q.y0 && p.y <= q.y1); if (r) { sel = r.id; loop.once(); } }, p => rows.some(q => p.y >= q.y0 && p.y <= q.y1));
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
