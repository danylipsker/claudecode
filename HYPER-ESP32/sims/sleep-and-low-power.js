/* HYPER-ESP32 · sims/sleep-and-low-power.js
 *
 *   sl-power-modes         the four rungs of a chosen chip as bars on a logarithmic axis, from the catalogue
 *   sl-cycle               current against time through wake – work – connect – send – sleep, with the average line
 *   sl-wake-sources        the sources that wake a sleeping chip, lighting the path that wakes it
 *   sl-rtc-memory          a deep-sleep counter: what survives a wake, a restart and a power cut; flash wear
 *   sl-board-vs-chip       the parts of a board ticked on and off against the chip's own sleep current
 *   sl-ulp                 a coprocessor watching a sensor while the main cores sleep, against waking to look
 *   sl-connect             a slow Wi-Fi connection against a fast one, phase by phase
 *   sl-staying-connected   Wi-Fi beacons and target wake time, BLE and Thread intervals: current against delay
 *
 * Currents of the chips come from the catalogue (sleepUa, lightUa, rxMa, txMa). Where a figure is not in the
 * catalogue (the CPU running with the radio off, the time of a connection step) the picture says so and uses a
 * round estimate, named in its text.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared helpers */
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const sleepChips = E => E.CHIPS.filter(c => !c.coproc && c.sleepUa != null);
  const radioChips = E => E.CHIPS.filter(c => !c.coproc && c.sleepUa != null && c.lightUa != null && c.rxMa != null && c.id !== 'esp8266');
  const pick = (id, list, fallback) => (list.some(c => c.id === id) ? id : fallback);
  const cpuMa = c => 0.125 * c.mhz;                    // the CPU running with the radio off: a round rule of 0.125 mA per MHz
  const fmtI = (kit, mA) => (!(mA >= 0) ? '—' : mA >= 1 ? kit.fmt(mA, 3) + ' mA' : mA >= 0.001 ? kit.fmt(mA * 1000, 3) + ' µA' : kit.fmt(mA * 1e6, 3) + ' nA');
  const fmtT = (kit, s) => (!(s >= 0) ? '—' : s >= 172800 ? kit.fmt(s / 86400, 3) + ' days' : s >= 7200 ? kit.fmt(s / 3600, 3) + ' h' : s >= 120 ? kit.fmt(s / 60, 3) + ' min' : s >= 1 ? kit.fmt(s, 3) + ' s' : kit.fmt(s * 1000, 3) + ' ms');
  const fmtLife = (kit, hours) => (!isFinite(hours) || !(hours >= 0) ? 'for ever' : hours < 48 ? kit.fmt(hours, 3) + ' hours' : hours < 24 * 400 ? kit.fmt(hours / 24, 3) + ' days' : kit.fmt(hours / 8760, 3) + ' years');
  const ranges = list => {                              // [0, 2, 4, 12, 13, 14, 15] -> "0, 2, 4, 12–15"
    const a = (list || []).slice().sort((x, y) => x - y), out = [];
    for (let i = 0; i < a.length;) {
      let j = i;
      while (j + 1 < a.length && a[j + 1] === a[j] + 1) j++;
      out.push(j - i >= 2 ? a[i] + '–' + a[j] : a.slice(i, j + 1).join(', '));
      i = j + 1;
    }
    return out.join(', ');
  };
  const decadeLabel = e => { const mA = Math.pow(10, e); return mA >= 1000 ? mA / 1000 + ' A' : mA >= 1 ? mA + ' mA' : Math.round(mA * 1000) + ' µA'; };
  const panel = (C, a) => (C.dark ? 'rgba(255,255,255,' + (a || 0.08) + ')' : 'rgba(0,0,0,' + ((a || 0.08) * 0.75) + ')');

  /* ================================================================ sl-power-modes */
  Hyper.sim('sl-power-modes', {
    title: 'The four rungs of a chip',
    blurb: `Each bar is the current a chip draws in one power mode, from the catalogue, on a **logarithmic** axis: every grid line is ten times the one before. Pick a chip, then **compare with** another.

**Try this**
- Look at the gap between the top bar and the bottom one: transmitting against deep sleep is four to five orders of magnitude.
- Compare the **ESP32-C3** with the original **ESP32**: the light-sleep bars differ by a factor of six.
- Read the three battery lines: a cell in deep sleep alone lasts years *on paper*; self-discharge cuts that to about two years, and a transmitter lasts hours.
- The **modem sleep** row is empty for most chips: the catalogue has a figure only for the ESP32-C2 (9 to 15 mA).`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, maxH: 460, minH: 330 });
      const chips = sleepChips(E);
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(c => [c.name, c.id]), value: pick(params.chip, chips, 'esp32-c3') },
        { id: 'cmp', type: 'select', label: 'Compare with', options: [['—', '']].concat(chips.map(c => [c.name, c.id])), value: pick(params.compare, chips, '') },
        { id: 'cell', label: 'Battery', min: 100, max: 5000, value: 1000, unit: 'mAh', log: true, sig: 2 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['ratio', 'Transmit ÷ deep sleep'], ['paper', 'Cell in deep sleep, on paper'], ['real', '… with 3 % self-discharge a month'], ['tx', 'Cell, transmitting non-stop']]);
      const MODEM = { 'esp32-c2': [9, 15] };               // the only modem-sleep figure in the catalogue
      const ROWS = [
        { label: 'Deep sleep', sub: 'RTC timer running', hue: 150, mA: c => (c.sleepUa != null ? c.sleepUa / 1000 : null) },
        { label: 'Light sleep', sub: 'CPU paused, RAM kept', hue: 195, mA: c => (c.lightUa != null ? c.lightUa / 1000 : null) },
        { label: 'Modem sleep', sub: 'CPU on, radio off', hue: 48, band: true },
        { label: 'Receiving', sub: 'CPU and radio on', hue: 28, mA: c => (c.rxMa != null ? c.rxMa : null) },
        { label: 'Transmitting', sub: 'the chip\'s peak', hue: 6, mA: c => (c.txMa != null ? c.txMa : null) }
      ];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const a = E.chip(ctl.values.chip), b = ctl.values.cmp && ctl.values.cmp !== a.id ? E.chip(ctl.values.cmp) : null;
        const W = st.W, H = st.H, lw = clamp(W * 0.25, 96, 150), vw = 78, px = lw + 6, pw = Math.max(60, W - px - vw - 8), top = 50, bot = 30;
        const rh = (H - top - bot) / ROWS.length, LO = 1e-3, HI = 1e3, L10 = Math.log10(HI / LO);
        const X = mA => px + clamp(Math.log10(Math.max(mA, LO) / LO) / L10, 0, 1) * pw;
        kit.label(c, a.name + (b ? '   against   ' + b.name : ''), 10, 14, { size: 14, weight: 650 });
        kit.label(c, 'current drawn in each mode · each grid line is ten times the one before', 10, 32, { size: 11, color: C.muted });
        // the grid
        for (let e = -3; e <= 3; e++) {
          const gx = Math.round(X(Math.pow(10, e))) + 0.5;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(gx, top - 4); c.lineTo(gx, H - bot + 2); c.stroke();
          S.text(c, decadeLabel(e), gx, H - bot + 14, { size: 10, color: C.muted });
        }
        ROWS.forEach((r, i) => {
          const y = top + i * rh, cy = y + rh / 2, bh = Math.min(26, rh * 0.5);
          S.text(c, r.label, 10, cy - 7, { size: 12.5, weight: 600, align: 'left', color: C.text });
          S.text(c, r.sub, 10, cy + 8, { size: 10, align: 'left', color: C.muted });
          const track = panel(C, 0.05);
          c.fillStyle = track; c.fillRect(px, cy - bh / 2, pw, bh);
          const va = r.band ? null : r.mA(a), vb = b && !r.band ? r.mA(b) : null;
          let txt = '—', sub2 = '';
          if (r.band) {
            const m = MODEM[a.id];
            if (m) {
              c.fillStyle = kit.hue(r.hue, 0.8); c.fillRect(X(m[0]), cy - bh / 2, Math.max(3, X(m[1]) - X(m[0])), bh);
              txt = m[0] + '–' + m[1] + ' mA';
            } else {
              c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.strokeRect(px + 0.5, cy - bh / 2 + 0.5, pw - 1, bh - 1); c.restore();
              S.text(c, 'no figure in the catalogue', px + 8, cy, { size: 10.5, align: 'left', color: C.faint });
            }
            const mb = b && MODEM[b.id];
            if (mb) { sub2 = b.name.split(' ')[0].replace('ESP32-', '') + ': ' + mb[0] + '–' + mb[1] + ' mA'; }
          } else if (va != null) {
            c.fillStyle = kit.hue(r.hue, 0.8); c.fillRect(px, cy - bh / 2, Math.max(2, X(va) - px), bh);
            txt = fmtI(kit, va);
          } else {
            c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.strokeRect(px + 0.5, cy - bh / 2 + 0.5, pw - 1, bh - 1); c.restore();
            S.text(c, 'no radio on this chip', px + 8, cy, { size: 10.5, align: 'left', color: C.faint });
          }
          if (vb != null) {
            const mx = X(vb);
            c.fillStyle = C.warn; c.beginPath(); c.moveTo(mx, cy - bh / 2 - 4); c.lineTo(mx + 5, cy - bh / 2 - 9); c.lineTo(mx - 5, cy - bh / 2 - 9); c.closePath(); c.fill();
            c.fillRect(mx - 1, cy - bh / 2 - 4, 2, bh + 8);
            sub2 = fmtI(kit, vb);
          }
          S.text(c, txt, W - 6, cy - (sub2 ? 6 : 0), { size: 12.5, weight: 650, align: 'right', color: va == null && !MODEM[a.id] ? C.faint : C.text });
          if (sub2) S.text(c, sub2, W - 6, cy + 9, { size: 10.5, align: 'right', color: C.warn });
        });
        // the readouts
        const cell = ctl.values.cell;
        const both = fn => fn(a) + (b ? '   ·   ' + fn(b) : '');
        ro.set('ratio', both(x => (x.txMa != null ? Math.round(x.txMa / (x.sleepUa / 1000)).toLocaleString('en') + ' ×' : 'no radio')));
        ro.set('paper', both(x => fmtLife(kit, E.batteryLife(cell, x.sleepUa / 1000, { selfDischarge: 0 }).hours)));
        ro.set('real', both(x => fmtLife(kit, E.batteryLife(cell, x.sleepUa / 1000).hours)));
        ro.set('tx', both(x => (x.txMa != null ? fmtLife(kit, E.batteryLife(cell, x.txMa, { selfDischarge: 0 }).hours) : 'no radio')));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sl-cycle */
  // the phases of a wake-up, in seconds: start-up on the CPU, then the radio phases at the receive current
  const CYCLE_METHODS = {
    full: { name: 'Full Wi-Fi connection, HTTPS', boot: 0.25, connect: 2.9, send: 0.35 },
    fast: { name: 'Fast reconnect, one UDP packet', boot: 0.25, connect: 0.5, send: 0.05 },
    espnow: { name: 'ESP-NOW frame to a receiver', boot: 0.25, connect: 0.1, send: 0.02 }
  };
  Hyper.sim('sl-cycle', {
    title: 'One wake-up cycle and its average',
    blurb: `The top chart is **one full cycle to scale**: the thin spike is the time the device is awake, the long floor is the sleep. The bottom chart magnifies the awake part. The dashed line is the **average current**. Phases use the chip's catalogue figures: the radio phases the receive current, the sleep the deep-sleep current; the CPU-only phases use a round 0.125 mA per MHz, and the connection times are typical, not measured on your router.

**Try this**
- Lengthen the **cycle**: the average falls towards the sleep floor, but never below it.
- Switch the **method** from the full connection to ESP-NOW and watch the average fall twenty-fold or more.
- Add **board sleep current**, as in [the board page](#/c/the-board-is-not-the-chip): 100 µA makes the fast methods lose half their life.
- Read the bar of **where the charge goes**: almost always the radio.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.95, maxH: 620, minH: 440 });
      const chips = radioChips(E), ids = Object.keys(CYCLE_METHODS);
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(c => [c.name, c.id]), value: pick(params.chip, chips, 'esp32-c3') },
        { id: 'method', type: 'select', label: 'How it sends', options: ids.map(k => [CYCLE_METHODS[k].name, k]), value: CYCLE_METHODS[params.method] ? params.method : 'full' },
        { id: 'cycle', label: 'Time between wake-ups', min: 5, max: 86400, value: clamp(+params.cycle || 600, 5, 86400), log: true, sig: 3, fmt: v => fmtT(kit, v) },
        { id: 'work', label: 'Other work while awake', min: 0, max: 3000, step: 10, value: clamp(params.work != null ? +params.work : 0, 0, 3000), unit: 'ms' },
        { id: 'board', label: 'Extra sleep current of the board', min: 0, max: 1000, step: 5, value: clamp(+params.board || 0, 0, 1000), unit: 'µA' },
        { id: 'cell', label: 'Battery', min: 100, max: 5000, value: clamp(+params.cell || 1000, 100, 5000), unit: 'mAh', log: true, sig: 2 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['awake', 'Time awake per cycle'], ['avg', 'Average current'], ['life', 'Battery lasts'], ['share', 'Charge spent awake'], ['floor', 'Sleeping floor']]);
      const COL = { cpu: kit.hue(214, 0.9), radio: kit.hue(30, 0.9), sleep: kit.hue(150, 0.9) };
      const model = () => {
        const v = ctl.values, c = E.chip(v.chip), M = CYCLE_METHODS[v.method], cpu = cpuMa(c), rx = c.rxMa, work = v.work / 1000;
        const awakeSegs = [{ dur: M.boot, mA: cpu, label: 'boot', color: COL.cpu }];
        if (work > 0) awakeSegs.push({ dur: work, mA: cpu, label: 'work', color: COL.cpu });
        awakeSegs.push({ dur: M.connect, mA: rx, label: 'connect', color: COL.radio }, { dur: M.send, mA: rx, label: 'send', color: COL.radio });
        const awake = awakeSegs.reduce((s, x) => s + x.dur, 0);
        const sleepDur = Math.max(0.001, v.cycle - awake), sleepMa = c.sleepUa / 1000 + v.board / 1000;
        const full = awakeSegs.concat([{ dur: sleepDur, mA: sleepMa, label: 'sleep', color: COL.sleep }]);
        const d = E.dutyCycle(full.map(x => ({ mA: x.mA, s: x.dur })));
        return { c, M, awakeSegs, full, awake, sleepDur, sleepMa, d, never: v.cycle <= awake };
      };
      const loop = kit.loop(() => {
        const cv = st.begin(), C = kit.colors(), v = ctl.values, m = model();
        const W = st.W, H = st.H, x0 = 60, w = W - x0 - 14;
        let y = 16;
        kit.label(cv, m.c.name + ' · ' + m.M.name, 10, y, { size: 13.5, weight: 650 });
        y += 24;
        kit.label(cv, 'One cycle of ' + fmtT(kit, m.d.period) + ', to scale (current on a logarithmic axis)', x0, y, { size: 11, color: C.muted });
        y += 10;
        const h1 = Math.round(H * 0.27);
        S.timeline(cv, x0, y, w, h1, m.full, { log: true });
        y += h1 + 24;
        kit.label(cv, 'The awake part, magnified: ' + fmtT(kit, m.awake) + ' (its dashed line is the average while awake)', x0, y, { size: 11, color: C.muted });
        y += 10;
        const h2 = Math.round(H * 0.2);
        const z = S.timeline(cv, x0, y, w, h2, m.awakeSegs, { log: false });
        // the current of each awake phase above its bar
        let t = 0;
        for (const s of m.awakeSegs) {
          const xa = z.X(t), xb = z.X(t + s.dur);
          if (xb - xa > 46) kit.label(cv, fmtI(kit, s.mA), (xa + xb) / 2, z.Y(s.mA) + 12, { size: 10, color: C.text, align: 'center' });
          t += s.dur;
        }
        y += h2 + 12;
        // where the charge goes
        kit.label(cv, 'Where the charge goes in one cycle', x0, y + 6, { size: 11, color: C.muted });
        y += 18;
        const names = m.full.map(s => s.label), shares = m.d.share;
        let xs = x0;
        shares.forEach((sh, i) => {
          const sw = Math.max(0, sh * w);
          cv.fillStyle = m.full[i].color; cv.globalAlpha = 0.75; cv.fillRect(xs, y, sw, 22); cv.globalAlpha = 1;
          if (sw > 52) kit.label(cv, names[i] + ' ' + Math.round(sh * 100) + ' %', xs + sw / 2, y + 11, { size: 10.5, align: 'center', color: C.text });
          xs += sw;
        });
        cv.strokeStyle = C.axis; cv.lineWidth = 1; cv.strokeRect(x0 + 0.5, y + 0.5, w - 1, 21);
        y += 36;
        if (m.never) kit.label(cv, 'The cycle is shorter than the time awake: this device never sleeps.', x0, y, { size: 11.5, color: C.bad, weight: 600 });
        // the readouts
        const life = E.batteryLife(v.cell, m.d.avg);
        const awakeShare = 1 - shares[shares.length - 1];
        ro.set('awake', fmtT(kit, m.awake));
        ro.set('avg', fmtI(kit, m.d.avg));
        ro.set('life', fmtLife(kit, life.hours));
        ro.set('share', Math.round(awakeShare * 100) + ' %');
        ro.set('floor', fmtI(kit, m.sleepMa) + ' (' + fmtLife(kit, E.batteryLife(v.cell, m.sleepMa).hours) + ' on its own)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sl-wake-sources */
  const WAKE_CHIPS = ['esp32', 'esp32-s2', 'esp32-s3', 'esp32-c3', 'esp32-c6', 'esp32-h2'];
  const WAKE_SRC = [
    { id: 'timer', name: 'Timer', hue: 150, has: () => true, sub: () => 'after a set time', cause: 'ESP_SLEEP_WAKEUP_TIMER', py: 'machine.TIMER_WAKE' },
    { id: 'ext0', name: 'ext0', hue: 205, has: id => ['esp32', 'esp32-s2', 'esp32-s3'].includes(id), pins: true, sub: () => 'one RTC pin, one level', cause: 'ESP_SLEEP_WAKEUP_EXT0', py: 'machine.EXT0_WAKE' },
    { id: 'ext1', name: 'ext1', hue: 232, has: id => ['esp32', 'esp32-s2', 'esp32-s3', 'esp32-c6', 'esp32-h2'].includes(id), pins: true, sub: () => 'several RTC pins, any high', cause: 'ESP_SLEEP_WAKEUP_EXT1', py: 'machine.EXT1_WAKE' },
    { id: 'gpio', name: 'GPIO', hue: 262, has: id => id === 'esp32-c3' || id === 'esp32-c6', pins: true, sub: () => 'deep-sleep pin wake-up', cause: 'ESP_SLEEP_WAKEUP_GPIO', py: '(see the MicroPython port)' },
    { id: 'touch', name: 'Touch pad', hue: 300, has: id => ['esp32', 'esp32-s2', 'esp32-s3'].includes(id), sub: c => (c.id === 'esp32' ? 'a finger on any armed pad' : 'a finger on one pad'), cause: 'ESP_SLEEP_WAKEUP_TOUCHPAD', py: 'machine.TOUCHPAD_WAKE' },
    { id: 'ulp', name: 'Coprocessor', hue: 28, has: (id, c) => !!c.lp, sub: c => (/LP RISC-V/.test(c.lp || '') ? 'LP RISC-V core decides' : /RISC-V/.test(c.lp || '') ? 'ULP-RISC-V or ULP-FSM decides' : 'ULP state machine decides'), cause: 'ESP_SLEEP_WAKEUP_ULP', py: 'machine.ULP_WAKE' }
  ];
  Hyper.sim('sl-wake-sources', {
    title: 'What can wake a sleeping chip',
    blurb: `Each tile on the left is a wake-up source. **Bright tiles exist on the chosen chip**, dim ones do not. Click a bright tile to fire it and watch the signal travel through the always-on RTC domain to the sleeping CPU, which wakes and restarts. The read-out gives the cause the program would see.

**Try this**
- Choose the **ESP32-C3**: there is no ext0 or touch, but a GPIO source on pins 0 to 5.
- Choose the original **ESP32**: three pin-like sources (ext0, ext1 and touch) and the ULP.
- Choose the **ESP32-H2**: no coprocessor; the pins that can wake it are GPIO8 to 14.
- Fire two different sources in turn and compare the causes: the program decides what to do from that one value.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.66, maxH: 470, minH: 360 });
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: WAKE_CHIPS.map(id => [E.chip(id).name, id]), value: WAKE_CHIPS.includes(params.chip) ? params.chip : 'esp32' },
        { type: 'buttons', items: [{ id: 'sleep', label: 'Back to sleep', primary: true }] }
      ], () => { fired = null; anim = 0; hits = []; refresh(); loop.stop(); loop.once(); });
      const ro = kit.readout(box.side, [['state', 'The chip'], ['cause', 'Wake-up cause (C++)'], ['py', 'MicroPython'], ['pins', 'Pins that can wake it']]);
      let fired = null, anim = 0, hits = [];
      const ANIM = 1.9;
      const refresh = () => {
        const c = E.chip(ctl.values.chip);
        if (!fired) { ro.set('state', 'asleep'); ro.set('cause', '—'); ro.set('py', '—'); ro.set('pins', ranges(E.pinsFor(c.id, 'wake')) || '—'); return; }
        const s = WAKE_SRC.find(q => q.id === fired);
        ro.set('state', anim >= ANIM ? 'awake: the program starts from the top' : 'waking …');
        ro.set('cause', s.cause); ro.set('py', s.py); ro.set('pins', s.pins ? ranges(E.pinsFor(c.id, 'wake')) : '—');
      };
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), chip = E.chip(ctl.values.chip);
        if (fired && anim < ANIM) { anim = Math.min(ANIM, anim + dt); refresh(); }
        const W = st.W, H = st.H, n = WAKE_SRC.length, pad = 10;
        const tw = clamp(W * 0.36, 128, 230), gap = 6, th = Math.max(46, Math.min(58, (H - 30 - pad - gap * (n - 1)) / n));
        kit.label(c, chip.name + ' in deep sleep', pad, 14, { size: 13.5, weight: 650 });
        hits = [];
        const rtcX = tw + pad + (W - tw - pad) * 0.22, rtcW = (W - tw - pad) * 0.3, rtcY = 34 + (H - 40) * 0.2, rtcH = (H - 40) * 0.6;
        const cpuX = rtcX + rtcW + (W - rtcX - rtcW) * 0.18, cpuW = Math.max(70, W - cpuX - pad), cpuH = Math.min(150, rtcH * 0.62), cpuY = rtcY + (rtcH - cpuH) / 2;
        const awake = fired && anim >= ANIM;
        // the always-on domain and the sleeping CPU
        S.box(c, rtcX, rtcY, rtcW, rtcH, { label: 'RTC domain', sub: 'always on', color: C.accent, active: !!fired && anim > 0.6 });
        S.box(c, cpuX, cpuY, cpuW, cpuH, { label: 'CPU and RAM', sub: awake ? 'awake' : 'asleep, off', color: awake ? C.ok : C.faint, active: awake, dash: !awake });
        S.link(c, rtcX + rtcW, rtcY + rtcH / 2, cpuX, cpuY + cpuH / 2, { arrow: 'end', color: fired && anim > 0.7 ? C.accent : C.muted, width: 2 });
        if (awake) S.text(c, 'restarts into setup()', cpuX + cpuW / 2, cpuY + cpuH + 14, { size: 10.5, color: C.ok });
        WAKE_SRC.forEach((s, i) => {
          const has = s.has(chip.id, chip), x = pad, y = 30 + i * (th + gap);
          const on = fired === s.id;
          S.box(c, x, y, tw, th, { color: has ? kit.hue(s.hue) : C.faint, active: on, dash: !has });
          S.text(c, s.name, x + tw / 2, y + 13, { size: 12.5, weight: 650, color: has ? C.text : C.faint });
          S.text(c, has ? s.sub(chip) : 'not on this chip', x + tw / 2, y + 27, { size: 10, color: has ? C.muted : C.faint });
          if (s.pins && has) S.text(c, 'GPIO ' + ranges(E.pinsFor(chip.id, 'wake')), x + tw / 2, y + 40, { size: 9.5, color: C.muted });
          const ty = y + th / 2, ry = rtcY + rtcH * (0.12 + 0.76 * (i + 0.5) / n);
          S.link(c, x + tw, ty, rtcX, ry, { color: has ? kit.hue(s.hue) : C.faint, wireless: !has, width: has ? 1.8 : 1 });
          if (has) hits.push({ x, y, w: tw, h: th, id: s.id });
          if (on && anim < 0.7) S.msg(c, x + tw, ty, rtcX, ry, anim / 0.7, { color: kit.hue(s.hue), r: 6 });
        });
        if (fired && anim >= 0.7 && anim < 1.3) S.msg(c, rtcX + rtcW, rtcY + rtcH / 2, cpuX, cpuY + cpuH / 2, (anim - 0.7) / 0.6, { color: C.accent, r: 6 });
        if (!fired) S.text(c, 'click a bright tile', cpuX + cpuW / 2, cpuY - 16, { size: 11, color: C.muted });
        if (fired && anim >= ANIM) loop.stop();
      }, box.stage);
      kit.click(st, p => {
        const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h);
        if (h) { fired = h.id; anim = 0; refresh(); loop.start(); }
      }, p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      refresh();
      loop.once();
    }
  });

  /* ================================================================ sl-rtc-memory */
  Hyper.sim('sl-rtc-memory', {
    title: 'What a deep-sleep counter remembers',
    blurb: `Four counters live in four kinds of memory. The program starts, counts one more than it finds, and stores the result. Press the buttons to wake the chip from deep sleep, restart it in software, or cut the power, and see which counters survive.

**Try this**
- **Wake from deep sleep** a few times: RAM starts again at 1 each time, the RTC counters climb, flash climbs too.
- **Restart in software**: the RTC data counter is reloaded, the *no-init* one carries on.
- **Cut the power**: only flash remembers.
- Untick *write to flash* and set a short interval: the wear panel shows how fast a flash sector would be used up, and how much longer a wear-levelled area lasts.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.72, maxH: 500, minH: 380 });
      const AREAS = [['one 4 KB sector', 1], ['a 20 KB NVS area (5 sectors)', 5], ['a 1 MB file system (256 sectors)', 256]];
      const s = { ram: 0, rtc: 0, noinit: 0, flash: 0, kind: 'power', log: [] };
      const ctl = kit.controls(box.side, [
        { id: 'every', label: 'Wake-up every', min: 1, max: 86400, value: 60, log: true, sig: 2, fmt: v => fmtT(kit, v) },
        { id: 'write', type: 'check', label: 'Write the count to flash on every wake', value: true },
        { id: 'area', type: 'select', label: 'Flash the writes are spread over', options: AREAS, value: 5 },
        { type: 'buttons', items: [{ id: 'wake', label: 'Wake from deep sleep', primary: true }, { id: 'restart', label: 'Restart in software' }, { id: 'power', label: 'Cut the power' }] }
      ], id => { if (id === 'wake' || id === 'restart' || id === 'power') event(id); loop.once(); });
      const ro = kit.readout(box.side, [['perday', 'Flash writes a day'], ['one', 'One sector lasts'], ['area', 'The chosen area lasts'], ['sixth', 'Writing every sixth wake only']]);
      const NAMES = { wake: 'wake from deep sleep', restart: 'restart in software', power: 'power cut' };
      function event(kind) {
        s.ram = 1;                                       // the program starts from the top and counts one more than it found (0)
        if (kind === 'wake') { s.rtc += 1; s.noinit += 1; }
        else if (kind === 'restart') { s.rtc = 1; s.noinit += 1; }
        else { s.rtc = 1; s.noinit = 1; }
        if (ctl.values.write) s.flash += 1;
        s.kind = kind;
        s.log.unshift(NAMES[kind] + ':  RAM ' + s.ram + ' · RTC ' + s.rtc + ' · no-init ' + s.noinit + ' · flash ' + s.flash);
        if (s.log.length > 4) s.log.length = 4;
      }
      event('power');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        kit.label(c, 'The program: count = (value found) + 1; store it; sleep', 10, 14, { size: 13, weight: 650 });
        const k = s.kind;
        const cards = [
          { title: 'Normal RAM', sub: 'int count = 0;', n: s.ram, say: 'wiped: the program restarted', col: C.bad },
          { title: 'RTC memory', sub: 'RTC_DATA_ATTR int count;', n: s.rtc, say: k === 'wake' ? 'kept: counted on' : k === 'restart' ? 'reloaded: back to 1' : 'lost: back to 1', col: k === 'wake' ? C.ok : C.bad },
          { title: 'RTC, not initialised', sub: 'RTC_NOINIT_ATTR int count;', n: s.noinit, say: k === 'power' ? 'garbage: caught by a magic number' : 'kept: counted on', col: k === 'power' ? C.bad : C.ok },
          { title: 'Flash (NVS)', sub: 'Preferences, a file', n: s.flash, say: v.write ? 'kept, and written again' : 'kept, but not written', col: C.ok }
        ];
        const cols = W < 560 ? 2 : 4, gap = 8, cw = (W - 20 - gap * (cols - 1)) / cols, ch = Math.max(70, Math.min(118, (H - 150) / Math.ceil(4 / cols) - gap));
        cards.forEach((q, i) => {
          const x = 10 + (i % cols) * (cw + gap), y = 34 + Math.floor(i / cols) * (ch + gap);
          S.box(c, x, y, cw, ch, { color: q.col, active: true, r: 8 });
          S.text(c, q.title, x + cw / 2, y + 14, { size: 12, weight: 650, color: C.text });
          S.text(c, q.sub, x + cw / 2, y + 29, { size: 9.5, color: C.muted, mono: true });
          S.text(c, String(q.n), x + cw / 2, y + ch * 0.58, { size: Math.min(34, ch * 0.34), weight: 700, color: C.text });
          S.text(c, q.say, x + cw / 2, y + ch - 12, { size: 10, color: q.col, weight: 600 });
        });
        // what has happened
        const y = 34 + Math.ceil(4 / cols) * (ch + gap) + 10;
        kit.label(c, 'What has happened', 10, y, { size: 11, color: C.muted, weight: 600 });
        s.log.forEach((line, i) => kit.label(c, line, 10, y + 16 + i * 15, { size: 10.5, color: i === 0 ? C.text : C.muted }));
        // the wear of the flash
        const perDay = v.write ? 86400 / v.every : 0, area = v.area;
        ro.set('perday', v.write ? kit.fmt(perDay, 3) : 'none');
        if (v.write) {
          ro.set('one', fmtLife(kit, E.flashLife(perDay, 1) * 8760));
          ro.set('area', fmtLife(kit, E.flashLife(perDay, area) * 8760));
          ro.set('sixth', fmtLife(kit, E.flashLife(perDay / 6, area) * 8760));
        } else { ro.set('one', 'no writes'); ro.set('area', 'no writes'); ro.set('sixth', 'no writes'); }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sl-board-vs-chip */
  const REGULATORS = [['No regulator: the cell feeds the chip', 0], ['Low-quiescent LDO (about 2 µA)', 0.002], ['Small LDO (about 55 µA)', 0.055], ['1117-type linear regulator (about 5 mA)', 5]];
  const POWER_LEDS = [['No power LED', 0], ['LED behind 10 kΩ', 10000], ['LED behind 1 kΩ', 1000], ['LED behind 330 Ω', 330]];
  const REAL_BOARDS = [['—', 0], ['Adafruit ESP32 Feather V2: about 70 µA', 0.070], ['Seeed XIAO ESP32-C6: 15 µA', 0.015], ['Seeed XIAO ESP32-S3: 14 µA', 0.014], ['Olimex ESP32-DevKit-LiPo: about 10 µA', 0.010],
    ['Heltec WiFi Kit 32 V3: under 10 µA (claimed)', 0.010], ['UM TinyPICO: 18 to 20 µA', 0.019], ['Olimex ESP32-S3-DevKit-LiPo: about 200 µA', 0.200], ['Heltec WiFi LoRa 32 V2: about 800 µA', 0.800]];
  Hyper.sim('sl-board-vs-chip', {
    title: 'Board against bare chip',
    blurb: `The first bar is the chip in deep sleep, from the catalogue. Every other bar is a part of a typical development board that keeps drawing while the chip sleeps. The axis is logarithmic: one grid line is ten times the one before. The LED and divider currents are calculated (3.3 V, a red LED at 2.0 V; 2 × 100 kΩ across 4.2 V); the regulator, USB chip and sensor figures are typical round numbers, so read the datasheets of your own parts.

**Try this**
- Start with the default board and read **times the chip alone**, then untick parts one at a time to find the worst.
- Choose the **1117-type regulator**: one part outweighs everything else.
- Remove the LED, the USB chip and the divider and pick the low-quiescent LDO: the board approaches the chip.
- Pick a **real board** to draw the sleep figure its maker states, as a dashed line.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.7, maxH: 470, minH: 360 });
      const chips = sleepChips(E);
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(c => [c.name, c.id]), value: pick(params.chip, chips, 'esp32-c3') },
        { id: 'reg', type: 'select', label: 'Voltage regulator', options: REGULATORS, value: 0.055 },
        { id: 'led', type: 'select', label: 'Power LED', options: POWER_LEDS, value: 1000 },
        { id: 'usb', type: 'check', label: 'USB-serial chip on the 3.3 V rail (about 5 mA)', value: true },
        { id: 'div', type: 'check', label: 'Battery divider, 2 × 100 kΩ (21 µA)', value: true },
        { id: 'sensor', type: 'check', label: 'A sensor left powered (about 0.5 mA)', value: false },
        { id: 'real', type: 'select', label: 'Mark a real board', options: REAL_BOARDS, value: 0 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['total', 'Board in deep sleep'], ['times', 'Times the chip alone'], ['chipLife', '1000 mAh cell, chip alone'], ['boardLife', '1000 mAh cell, this board'], ['worst', 'The biggest part']]);
      const items = () => {
        const v = ctl.values, c = E.chip(v.chip);
        return [
          { name: 'Chip, deep sleep', mA: c.sleepUa / 1000, hue: 150 },
          { name: 'Voltage regulator', mA: v.reg, hue: 28 },
          { name: 'USB-serial chip', mA: v.usb ? 5 : 0, hue: 232 },
          { name: 'Power LED', mA: v.led ? (3.3 - 2.0) / v.led * 1000 : 0, hue: 6 },
          { name: 'Battery divider', mA: v.div ? 4.2 / 200000 * 1000 : 0, hue: 195 },
          { name: 'Sensor left on', mA: v.sensor ? 0.5 : 0, hue: 300 }
        ];
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, list = items(), chip = E.chip(v.chip);
        const total = list.reduce((a, q) => a + q.mA, 0);
        const rows = list.concat([{ name: 'Board total', mA: total, hue: 48, total: true }]);
        const W = st.W, H = st.H, lw = clamp(W * 0.26, 100, 160), vw = 78, px = lw + 6, pw = Math.max(60, W - px - vw - 8), top = 50, bot = 28;
        const rh = (H - top - bot) / rows.length, LO = 1e-3, HI = 1e2, L10 = Math.log10(HI / LO);
        const X = mA => px + clamp(Math.log10(Math.max(mA, LO) / LO) / L10, 0, 1) * pw;
        kit.label(c, chip.name + ' on a board, asleep', 10, 14, { size: 14, weight: 650 });
        kit.label(c, 'current drawn from the battery · each grid line is ten times the one before', 10, 32, { size: 11, color: C.muted });
        for (let e = -3; e <= 2; e++) {
          const gx = Math.round(X(Math.pow(10, e))) + 0.5;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(gx, top - 4); c.lineTo(gx, H - bot + 2); c.stroke();
          S.text(c, decadeLabel(e), gx, H - bot + 14, { size: 10, color: C.muted });
        }
        rows.forEach((r, i) => {
          const cy = top + i * rh + rh / 2, bh = Math.min(22, rh * 0.56), on = r.mA > 0;
          S.text(c, r.name, 10, cy, { size: r.total ? 12.5 : 11.5, weight: r.total ? 700 : 600, align: 'left', color: on ? C.text : C.faint });
          c.fillStyle = panel(C, 0.05); c.fillRect(px, cy - bh / 2, pw, bh);
          if (on) { c.fillStyle = kit.hue(r.hue, 0.82); c.fillRect(px, cy - bh / 2, Math.max(2, X(r.mA) - px), bh); }
          S.text(c, on ? fmtI(kit, r.mA) : 'off', W - 6, cy, { size: 12, weight: 650, align: 'right', color: on ? C.text : C.faint });
        });
        if (v.real > 0) {
          const rx = X(v.real);
          c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.8; c.beginPath(); c.moveTo(rx, top - 4); c.lineTo(rx, H - bot); c.stroke(); c.restore();
          S.text(c, 'maker\'s figure: ' + fmtI(kit, v.real), clamp(rx, px + 60, px + pw - 60), top - 10, { size: 10.5, color: C.warn, weight: 600 });
        }
        const chipMa = list[0].mA, worst = list.slice(1).reduce((a, q) => (q.mA > a.mA ? q : a), { mA: 0, name: '—' });
        ro.set('total', fmtI(kit, total));
        ro.set('times', total / chipMa >= 10 ? Math.round(total / chipMa).toLocaleString('en') + ' ×' : kit.fmt(total / chipMa, 3) + ' ×');
        ro.set('chipLife', fmtLife(kit, E.batteryLife(1000, chipMa).hours));
        ro.set('boardLife', fmtLife(kit, E.batteryLife(1000, total).hours));
        ro.set('worst', worst.mA > 0 ? worst.name + ' (' + Math.round(worst.mA / total * 100) + ' %)' : 'nothing but the chip');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sl-ulp */
  const ULP_MS = 2, ULP_AWAKE = 0.3, ULP_THRESH = 0.6, ULP_SPAN = 6;
  Hyper.sim('sl-ulp', {
    title: 'A coprocessor watching a sensor',
    blurb: `The top picture shows a sensor level and the samples a coprocessor takes (ticks on the **ULP** row). When a sample crosses the threshold it wakes the main cores (the **main cores** row), which would otherwise be asleep. The curves below plot the average current against how often you look: the **ULP** way against **waking the main core** to look. The picture shows an event every 5 seconds so that you can see it; the numbers use your events per hour. The ULP runs 2 ms per sample and the main core is awake 0.3 s per wake at a round 0.125 mA per MHz.

**Try this**
- Move the **period** to 2 s: the ULP costs almost nothing, but short events slip between samples.
- Set it to 20 ms: the ULP catches everything and its cost climbs, still far below polling with the main core.
- Raise **ULP current while it runs**: the curves approach each other at short periods.
- Compare the two battery lines at a period of 1 s.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.9, maxH: 580, minH: 430 });
      const chips = E.CHIPS.filter(c => !c.coproc && c.lp && c.sleepUa != null);
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip with a coprocessor', options: chips.map(c => [c.name, c.id]), value: pick(params.chip, chips, 'esp32-s3') },
        { id: 'period', label: 'How often the sensor is looked at', min: 0.01, max: 10, value: clamp(+params.period || 0.1, 0.01, 10), log: true, sig: 2, fmt: v => fmtT(kit, v) },
        { id: 'events', label: 'Real events per hour', min: 0.1, max: 600, value: 6, log: true, sig: 2 },
        { id: 'ulpma', label: 'ULP current while it runs', min: 0.1, max: 5, step: 0.1, value: 1, unit: 'mA' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['ulp', 'ULP watching, average'], ['poll', 'Main core waking to look'], ['life', '1000 mAh cell: ULP · polling'], ['delay', 'Longest wait before noticing']]);
      const ev = t => { const te = Math.round((t - 3) / 5) * 5 + 3; return 0.45 * Math.exp(-Math.pow((t - te) / 0.2, 2)); };
      const sig = t => 0.28 + 0.05 * Math.sin(t * 1.9) + 0.025 * Math.sin(t * 7.3 + 1) + ev(t);
      const avgs = () => {
        const v = ctl.values, c = E.chip(v.chip), cpu = cpuMa(c), sl = c.sleepUa / 1000;
        return {
          cpu, sl,
          ulp: p => sl + v.ulpma * (ULP_MS / 1000) / p + (v.events / 3600) * cpu * ULP_AWAKE,
          poll: p => sl + cpu * Math.min(1, ULP_AWAKE / p)
        };
      };
      const loop = kit.loop((dt, tNow) => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, A = avgs(), P = v.period, W = st.W, H = st.H;
        const px = 62, pw = W - px - 14, t0 = tNow - ULP_SPAN, X = t => px + (t - t0) / ULP_SPAN * pw;
        kit.label(c, E.chip(v.chip).name + ': main cores asleep, coprocessor watching', 10, 14, { size: 13.5, weight: 650 });
        // the sensor and its samples
        const sy = 34, sh = Math.round(H * 0.25), Y = x => sy + sh - clamp(x, 0, 1) * sh;
        c.fillStyle = panel(C, 0.05); c.fillRect(px, sy, pw, sh);
        c.strokeStyle = C.warn; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(px, Y(ULP_THRESH)); c.lineTo(px + pw, Y(ULP_THRESH)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'threshold', px + pw - 4, Y(ULP_THRESH) - 8, { size: 10, color: C.warn, align: 'right' });
        c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
        const N = Math.max(40, Math.round(pw / 2));
        for (let i = 0; i <= N; i++) { const t = t0 + i / N * ULP_SPAN, x = X(t), y = Y(sig(t)); if (i) c.lineTo(x, y); else c.moveTo(x, y); }
        c.stroke();
        kit.label(c, 'sensor', px - 6, sy + sh / 2, { size: 11, color: C.text2, align: 'right' });
        // the samples, thinned when they are too close to draw
        const k0 = Math.ceil(t0 / P), k1 = Math.floor(tNow / P), stride = Math.max(1, Math.ceil(3 / (P / ULP_SPAN * pw)));
        const ry = sy + sh + 8, rh = 18, my = ry + rh + 8;
        c.fillStyle = panel(C, 0.05); c.fillRect(px, ry, pw, rh); c.fillRect(px, my, pw, rh);
        kit.label(c, 'ULP', px - 6, ry + rh / 2, { size: 11, color: C.text2, align: 'right' });
        kit.label(c, 'main cores', px - 6, my + rh / 2, { size: 11, color: C.text2, align: 'right' });
        let prevAbove = sig((k0 - 1) * P) > ULP_THRESH;
        const detections = [];
        for (let k = k0; k <= k1; k++) {
          const t = k * P, above = sig(t) > ULP_THRESH;
          if (above && !prevAbove) detections.push(t);
          prevAbove = above;
          if (k % stride === 0) {
            c.fillStyle = above ? C.bad : C.muted; c.fillRect(X(t) - 1, ry + 2, 2, rh - 4);
            if (above) kit.dot(c, X(t), Y(sig(t)), 3, C.bad);
          }
        }
        for (const t of detections) { c.fillStyle = C.bad; c.globalAlpha = 0.65; c.fillRect(X(t), my + 2, Math.max(2, ULP_AWAKE * 2 / ULP_SPAN * pw), rh - 4); c.globalAlpha = 1; }
        kit.label(c, 'red: a sample above the threshold wakes the main cores · events shorter than the period can be missed', px, my + rh + 14, { size: 10, color: C.muted });
        // the curves
        const cy0 = my + rh + 34, ch = Math.max(60, H - cy0 - 34), LO = 1e-3, HI = 1e2, L10 = Math.log10(HI / LO), XL = 0.01, XH = 10;
        const CX = p => px + Math.log10(clamp(p, XL, XH) / XL) / Math.log10(XH / XL) * pw, CY = mA => cy0 + ch - clamp(Math.log10(Math.max(mA, LO) / LO) / L10, 0, 1) * ch;
        kit.label(c, 'Average current against how often the sensor is looked at (logarithmic axes)', 10, cy0 - 8, { size: 11, color: C.muted });
        for (let e = -3; e <= 2; e++) { const gy = Math.round(CY(Math.pow(10, e))) + 0.5; c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(px, gy); c.lineTo(px + pw, gy); c.stroke(); S.text(c, decadeLabel(e), px - 5, gy, { size: 9.5, color: C.muted, align: 'right' }); }
        [0.01, 0.1, 1, 10].forEach(p => { const gx = Math.round(CX(p)) + 0.5; c.strokeStyle = C.grid; c.beginPath(); c.moveTo(gx, cy0); c.lineTo(gx, cy0 + ch); c.stroke(); S.text(c, fmtT(kit, p), gx, cy0 + ch + 12, { size: 9.5, color: C.muted }); });
        const curve = (fn, col) => { c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); for (let i = 0; i <= 80; i++) { const p = XL * Math.pow(XH / XL, i / 80), x = CX(p), y = CY(fn(p)); if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke(); };
        curve(A.poll, C.bad); curve(A.ulp, C.ok);
        c.setLineDash([2, 4]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(px, CY(A.sl)); c.lineTo(px + pw, CY(A.sl)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'deep-sleep floor', px + pw - 4, CY(A.sl) - 7, { size: 9.5, color: C.muted, align: 'right' });
        kit.label(c, 'main core wakes to look', px + 6, CY(A.poll(0.012)) + 10, { size: 10, color: C.bad });
        kit.label(c, 'ULP watches', px + 6, CY(A.ulp(0.012)) - 10, { size: 10, color: C.ok });
        kit.dot(c, CX(P), CY(A.poll(P)), 4.5, C.bad); kit.dot(c, CX(P), CY(A.ulp(P)), 4.5, C.ok);
        const ua = A.ulp(P), pa = A.poll(P);
        ro.set('ulp', fmtI(kit, ua)); ro.set('poll', fmtI(kit, pa));
        ro.set('life', fmtLife(kit, E.batteryLife(1000, ua).hours) + '  ·  ' + fmtLife(kit, E.batteryLife(1000, pa).hours));
        ro.set('delay', fmtT(kit, Math.max(P, 0)));
        void dt;
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ sl-connect */
  // the steps of a wake-up that sends one message, in seconds: typical values, not measured on your router
  const CONNECT_STEPS = [
    { id: 'boot', name: 'wake and boot', short: 'boot', s: 0.25, hue: 214 },
    { id: 'radio', name: 'start the radio', short: 'radio', s: 0.10, hue: 190 },
    { id: 'scan', name: 'scan for the network', short: 'scan', s: 0.90, hue: 150 },
    { id: 'join', name: 'join: authenticate, associate, keys', short: 'join', s: 0.30, hue: 100 },
    { id: 'dhcp', name: 'get an address (DHCP)', short: 'DHCP', s: 0.70, hue: 48 },
    { id: 'tls', name: 'DNS, TCP and TLS', short: 'TLS', s: 0.90, hue: 28 },
    { id: 'send', name: 'send and wait for the answer', short: 'send', s: 0.35, hue: 6 }
  ];
  const stepsFor = o => {
    const t = {};
    CONNECT_STEPS.forEach(p => { t[p.id] = p.s; });
    if (o.espnow) { t.scan = 0; t.join = 0; t.dhcp = 0; t.tls = 0; t.send = 0.02; }
    else {
      if (o.remember) t.scan = 0.10;
      if (o.fixed) t.dhcp = 0;
      if (o.udp) { t.tls = 0; t.send = 0.05; }
    }
    return CONNECT_STEPS.filter(p => t[p.id] > 0).map(p => ({ id: p.id, name: p.name, short: p.short, hue: p.hue, s: t[p.id] }));
  };
  Hyper.sim('sl-connect', {
    title: 'A slow connection against a fast one',
    blurb: `The top bar is a **cold start**: everything done the slow way, about 3.5 seconds of awake time with the radio on. The bottom bar is **your choices**, drawn to the same scale. The step times are typical values, not measured on your router: time your own. The radio steps use the chip's receive current, the boot step a round 0.125 mA per MHz.

**Try this**
- Tick **remember the channel and access point**: the scan shrinks to a tenth.
- Add a **static IP address**: the DHCP step disappears.
- Add **a UDP packet instead of HTTPS**: the TLS step goes, and the send is short.
- Tick **ESP-NOW instead**: most of the bar disappears. Read the battery lines at the bottom.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.62, maxH: 460, minH: 340 });
      const chips = radioChips(E);
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(c => [c.name, c.id]), value: pick(params.chip, chips, 'esp32-c3') },
        { id: 'remember', type: 'check', label: 'Remember the channel and access point', value: !!params.remember },
        { id: 'fixed', type: 'check', label: 'Use a static IP address', value: !!params.fixed },
        { id: 'udp', type: 'check', label: 'Send one UDP packet, not HTTPS', value: !!params.udp },
        { id: 'espnow', type: 'check', label: 'Use ESP-NOW instead of Wi-Fi', value: !!params.espnow },
        { id: 'cycle', label: 'Time between wake-ups', min: 5, max: 86400, value: clamp(+params.cycle || 600, 5, 86400), log: true, sig: 3, fmt: v => fmtT(kit, v) }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['awake', 'Awake: cold · yours'], ['avg', 'Average current: cold · yours'], ['life', '1000 mAh cell: cold · yours'], ['gain', 'Yours lasts']]);
      const evalPlan = (c, steps, cycle) => {
        const phases = steps.map(p => ({ mA: p.id === 'boot' ? cpuMa(c) : c.rxMa, s: p.s }));
        const awake = steps.reduce((a, p) => a + p.s, 0);
        phases.push({ mA: c.sleepUa / 1000, s: Math.max(0.001, cycle - awake) });
        const d = E.dutyCycle(phases);
        return { awake, avg: d.avg, hours: E.batteryLife(1000, d.avg).hours };
      };
      const loop = kit.loop(() => {
        const cv = st.begin(), C = kit.colors(), v = ctl.values, c = E.chip(v.chip);
        const cold = stepsFor({}), mine = stepsFor(v), scaleT = cold.reduce((a, p) => a + p.s, 0);
        const W = st.W, H = st.H, x0 = 16, w = W - 2 * x0 - 4;
        const bar = (y, steps, title) => {
          kit.label(cv, title, x0, y - 12, { size: 12, weight: 650 });
          cv.fillStyle = panel(C, 0.05); cv.fillRect(x0, y, w, 46);
          let x = x0;
          steps.forEach(p => {
            const sw = p.s / scaleT * w;
            cv.fillStyle = kit.hue(p.hue, 0.8); cv.fillRect(x, y, Math.max(1.5, sw), 46);
            cv.strokeStyle = C.bg2; cv.lineWidth = 1; cv.strokeRect(x, y, Math.max(1.5, sw), 46);
            if (sw > 30) kit.label(cv, p.short, x + sw / 2, y + 17, { size: 10.5, align: 'center', color: C.text, weight: 600 });
            if (sw > 38) kit.label(cv, kit.fmt(p.s, 2) + ' s', x + sw / 2, y + 33, { size: 9.5, align: 'center', color: C.text });
            x += sw;
          });
          const tot = steps.reduce((a, p) => a + p.s, 0);
          kit.label(cv, 'total ' + kit.fmt(tot, 3) + ' s', Math.min(x0 + w - 4, x + 6), y + 58, { size: 11, color: C.text2, weight: 600, align: x + 90 > x0 + w ? 'right' : 'left' });
        };
        kit.label(cv, c.name + ': one wake-up that sends one message', x0, 14, { size: 13.5, weight: 650 });
        bar(52, cold, 'A cold start: scan, join, DHCP, TLS');
        const y2 = 52 + 46 + 52;
        const desc = v.espnow ? 'ESP-NOW' : [v.remember ? 'remembered channel' : '', v.fixed ? 'static IP' : '', v.udp ? 'UDP' : ''].filter(Boolean).join(' + ') || 'nothing changed';
        bar(y2, mine, 'Your choices: ' + desc);
        // the time axis
        const ay = y2 + 46 + 28;
        cv.strokeStyle = C.axis; cv.lineWidth = 1; cv.beginPath(); cv.moveTo(x0, ay); cv.lineTo(x0 + w, ay); cv.stroke();
        for (let t = 0; t <= scaleT + 0.001; t += 0.5) { const tx = x0 + t / scaleT * w; cv.beginPath(); cv.moveTo(tx, ay); cv.lineTo(tx, ay + 4); cv.stroke(); kit.label(cv, kit.fmt(t, 2) + ' s', tx, ay + 14, { size: 9.5, color: C.muted, align: 'center' }); }
        // what the steps are
        let ly = ay + 34;
        mine.forEach((p, i) => {
          const lx = x0 + (i % 2) * (w / 2), yy = ly + Math.floor(i / 2) * 16;
          cv.fillStyle = kit.hue(p.hue, 0.8); cv.fillRect(lx, yy - 5, 10, 10);
          kit.label(cv, p.name + ': ' + kit.fmt(p.s, 2) + ' s', lx + 16, yy, { size: 10.5, color: C.text2 });
        });
        void H;
        const A = evalPlan(c, cold, v.cycle), B = evalPlan(c, mine, v.cycle);
        ro.set('awake', kit.fmt(A.awake, 3) + ' s  ·  ' + kit.fmt(B.awake, 3) + ' s');
        ro.set('avg', fmtI(kit, A.avg) + '  ·  ' + fmtI(kit, B.avg));
        ro.set('life', fmtLife(kit, A.hours) + '  ·  ' + fmtLife(kit, B.hours));
        ro.set('gain', kit.fmt(B.hours / A.hours, 3) + ' times as long as the cold start');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sl-staying-connected */
  const STAY_MODES = [['Wi-Fi: wake for the beacons (DTIM)', 'dtim'], ['Wi-Fi 6: target wake time', 'twt'], ['Bluetooth LE: a connection', 'ble'], ['Bluetooth LE: advertising', 'adv'], ['Zigbee or Thread: sleepy end device', 'sed']];
  const STAY_SHOW = { dtim: ['dtim', 'win'], twt: ['twt', 'win'], ble: ['conn', 'lat', 'win', 'radio'], adv: ['adv', 'win', 'radio'], sed: ['poll', 'win', 'radio'] };
  const STAY_WIN = { dtim: 2, twt: 10, ble: 2.5, adv: 3, sed: 6 };
  const STAY_RADIO = { ble: 12, adv: 12, sed: 25 };
  Hyper.sim('sl-staying-connected', {
    title: 'Staying reachable while asleep',
    blurb: `A device that must stay reachable wakes on a schedule: every DTIM beacon, every Wi-Fi 6 wake time, every BLE connection or advertising interval, every poll of a parent. The top picture shows the wake-ups (the tall bars) against the sleeping floor. The curve below plots the **average current against the interval**: the longer the interval, the nearer the current falls to the floor, and the longer a message may wait. Between wake-ups the chip is in light sleep (the catalogue's figure); a wake-up draws the radio current for the awake time. The awake times and the BLE and 802.15.4 radio currents are typical round numbers: the default Wi-Fi window of 2 ms reproduces Espressif's measured C3 figures to within about a third.

**Try this**
- In **DTIM** mode move the period from 1 to 10: the current falls about fivefold, the wait grows tenfold.
- In **target wake time** mode set the interval to a minute: the current is almost the floor.
- In **BLE connection** mode add **peripheral latency**: the same effect as a longer interval, without telling the phone.
- In **Zigbee or Thread** mode compare a 1 s poll with a 30 s poll.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.9, maxH: 580, minH: 430 });
      const chips = radioChips(E);
      let mode = STAY_MODES.some(m => m[1] === params.mode) ? params.mode : 'dtim';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'How it stays reachable', options: STAY_MODES, value: mode },
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(c => [c.name, c.id]), value: pick(params.chip, chips, 'esp32-c3') },
        { id: 'dtim', label: 'DTIM period', min: 1, max: 10, step: 1, value: 3, unit: 'beacons' },
        { id: 'twt', label: 'Wake interval (TWT)', min: 0.5, max: 600, value: 10, log: true, sig: 2, fmt: v => fmtT(kit, v) },
        { id: 'conn', label: 'Connection interval', min: 7.5, max: 4000, value: 500, log: true, sig: 3, unit: 'ms' },
        { id: 'lat', label: 'Peripheral latency', min: 0, max: 30, step: 1, value: 0, unit: 'events' },
        { id: 'adv', label: 'Advertising interval', min: 20, max: 10240, value: 1000, log: true, sig: 3, unit: 'ms' },
        { id: 'poll', label: 'Poll period', min: 0.1, max: 60, value: 5, log: true, sig: 2, fmt: v => fmtT(kit, v) },
        { id: 'win', label: 'Awake per wake-up', min: 0.5, max: 50, value: STAY_WIN[mode], log: true, sig: 2, unit: 'ms' },
        { id: 'radio', label: 'Radio current while awake', min: 5, max: 40, step: 1, value: STAY_RADIO[mode] || 12, unit: 'mA' }
      ], (id, val) => { if (id === 'mode') setMode(val); loop.once(); });
      const ro = kit.readout(box.side, [['T', 'Interval between wake-ups'], ['avg', 'Average current'], ['life', '1000 mAh cell lasts'], ['wait', 'A message may wait up to'], ['floor', 'Light-sleep floor']]);
      function setMode(m) {
        mode = m;
        ['dtim', 'twt', 'conn', 'lat', 'adv', 'poll', 'win', 'radio'].forEach(id => ctl.show(id, STAY_SHOW[m].indexOf(id) >= 0));
        ctl.set('win', STAY_WIN[m]);
        if (STAY_RADIO[m]) ctl.set('radio', STAY_RADIO[m]);
      }
      setMode(mode);
      const model = () => {
        const v = ctl.values, c = E.chip(v.chip), base = c.lightUa / 1000;
        let T, radio;
        if (mode === 'dtim') { T = 0.1024 * v.dtim; radio = c.rxMa; }
        else if (mode === 'twt') { T = v.twt; radio = c.rxMa; }
        else if (mode === 'ble') { T = v.conn / 1000 * (1 + v.lat); radio = v.radio; }
        else if (mode === 'adv') { T = v.adv / 1000; radio = v.radio; }
        else { T = v.poll; radio = v.radio; }
        const w = v.win / 1000;
        const avgAt = t => (mode === 'adv'
          ? E.bleAdvCurrent(t, { ms: v.win, mA: radio, sleepUa: c.lightUa })
          : E.dutyCycle([{ mA: radio, s: Math.min(w, t) }, { mA: base, s: Math.max(0, t - w) }]).avg);
        let note = '';
        if ((mode === 'dtim' || mode === 'twt') && !c.wifi) note = 'This chip has no Wi-Fi radio.';
        else if (mode === 'twt' && !((c.wifi.feat || []).some(f => /TWT/.test(f)))) note = 'This chip has no target wake time (it is Wi-Fi 4).';
        else if ((mode === 'ble' || mode === 'adv') && !c.bt) note = 'This chip has no Bluetooth.';
        else if (mode === 'sed' && !c.ieee802154) note = 'This chip has no 802.15.4 radio.';
        return { c, base, T, radio, w, avgAt, note };
      };
      const loop = kit.loop(() => {
        const cv = st.begin(), C = kit.colors(), m = model(), v = ctl.values, W = st.W, H = st.H;
        const px = 64, pw = W - px - 14, avg = m.avgAt(m.T);
        kit.label(cv, m.c.name + ' · ' + STAY_MODES.find(q => q[1] === mode)[0], 10, 14, { size: 13.5, weight: 650 });
        if (m.note) kit.label(cv, m.note, 10, 32, { size: 11.5, color: C.bad, weight: 600 });
        // the wake-ups
        const sy = 46, sh = Math.round(H * 0.24), n = 7.5, tspan = m.T * n;
        cv.fillStyle = panel(C, 0.05); cv.fillRect(px, sy, pw, sh);
        const floorY = sy + sh - 4;
        cv.strokeStyle = C.muted; cv.lineWidth = 1.2; cv.beginPath(); cv.moveTo(px, floorY); cv.lineTo(px + pw, floorY); cv.stroke();
        const wpx = Math.max(2.5, m.w / tspan * pw);
        let firstX = 0, secondX = 0;
        for (let k = 0; k < 8; k++) {
          const t = m.T * (k + 0.5), x = px + t / tspan * pw;
          if (x > px + pw) break;
          cv.fillStyle = kit.hue(30, 0.9); cv.fillRect(x, sy + 8, wpx, sh - 12);
          if (k === 0) firstX = x; if (k === 1) secondX = x;
        }
        kit.label(cv, 'radio awake', px - 6, sy + sh * 0.4, { size: 10.5, color: C.text2, align: 'right' });
        kit.label(cv, 'asleep', px - 6, floorY - 2, { size: 10.5, color: C.text2, align: 'right' });
        if (secondX > firstX) {
          cv.strokeStyle = C.accent; cv.lineWidth = 1.4; cv.beginPath(); cv.moveTo(firstX, sy + sh + 12); cv.lineTo(secondX, sy + sh + 12); cv.stroke();
          cv.beginPath(); cv.moveTo(firstX, sy + sh + 8); cv.lineTo(firstX, sy + sh + 16); cv.moveTo(secondX, sy + sh + 8); cv.lineTo(secondX, sy + sh + 16); cv.stroke();
          kit.label(cv, fmtT(kit, m.T), (firstX + secondX) / 2, sy + sh + 26, { size: 11, color: C.accent, align: 'center', weight: 600 });
        }
        kit.label(cv, 'awake ' + kit.fmt(v.win, 2) + ' ms at ' + fmtI(kit, m.radio) + ', then asleep at ' + fmtI(kit, m.base), px + pw, sy + sh + 26, { size: 10.5, color: C.muted, align: 'right' });
        // the curve: average current against the interval
        const cy0 = sy + sh + 56, ch = Math.max(60, H - cy0 - 34), LO = 1e-3, HI = 1e2, L10 = Math.log10(HI / LO), XL = 0.005, XH = 1000;
        const CX = t => px + Math.log10(clamp(t, XL, XH) / XL) / Math.log10(XH / XL) * pw, CY = mA => cy0 + ch - clamp(Math.log10(Math.max(mA, LO) / LO) / L10, 0, 1) * ch;
        kit.label(cv, 'Average current against the interval (logarithmic axes)', 10, cy0 - 8, { size: 11, color: C.muted });
        for (let e = -3; e <= 2; e++) { const gy = Math.round(CY(Math.pow(10, e))) + 0.5; cv.strokeStyle = C.grid; cv.lineWidth = 1; cv.beginPath(); cv.moveTo(px, gy); cv.lineTo(px + pw, gy); cv.stroke(); S.text(cv, decadeLabel(e), px - 5, gy, { size: 9.5, color: C.muted, align: 'right' }); }
        [0.01, 0.1, 1, 10, 100, 1000].forEach(t => { const gx = Math.round(CX(t)) + 0.5; cv.strokeStyle = C.grid; cv.beginPath(); cv.moveTo(gx, cy0); cv.lineTo(gx, cy0 + ch); cv.stroke(); S.text(cv, fmtT(kit, t), gx, cy0 + ch + 12, { size: 9.5, color: C.muted }); });
        cv.strokeStyle = C.accent; cv.lineWidth = 2.2; cv.beginPath();
        for (let i = 0; i <= 100; i++) { const t = XL * Math.pow(XH / XL, i / 100), x = CX(t), y = CY(m.avgAt(t)); if (i) cv.lineTo(x, y); else cv.moveTo(x, y); }
        cv.stroke();
        cv.save(); cv.setLineDash([3, 4]); cv.strokeStyle = C.ok; cv.lineWidth = 1.4; cv.beginPath(); cv.moveTo(px, CY(m.base)); cv.lineTo(px + pw, CY(m.base)); cv.stroke(); cv.restore();
        kit.label(cv, 'light-sleep floor', px + pw - 4, CY(m.base) - 8, { size: 9.5, color: C.ok, align: 'right' });
        const deep = m.c.sleepUa / 1000;
        cv.save(); cv.setLineDash([1, 4]); cv.strokeStyle = C.muted; cv.beginPath(); cv.moveTo(px, CY(deep)); cv.lineTo(px + pw, CY(deep)); cv.stroke(); cv.restore();
        kit.label(cv, 'deep sleep (not connected)', px + pw - 4, CY(deep) - 8, { size: 9.5, color: C.muted, align: 'right' });
        cv.save(); cv.setLineDash([4, 4]); cv.strokeStyle = C.warn; cv.beginPath(); cv.moveTo(CX(m.T), cy0); cv.lineTo(CX(m.T), cy0 + ch); cv.stroke(); cv.restore();
        kit.dot(cv, CX(m.T), CY(avg), 5, C.warn, C.bg2);
        ro.set('T', fmtT(kit, m.T));
        ro.set('avg', fmtI(kit, avg));
        ro.set('life', fmtLife(kit, E.batteryLife(1000, avg).hours));
        ro.set('wait', fmtT(kit, m.T) + (mode === 'adv' ? ' for a scanner that listens only now and then' : ''));
        ro.set('floor', fmtI(kit, m.base));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
