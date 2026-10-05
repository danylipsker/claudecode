/* HYPER-CORE · ui/esp-calc.js
 *
 * Hyper ESP32 · Tools → Calculators: the sums an ESP32 project needs again and again, each a small interactive
 * tool with a picture. All the arithmetic is Hyper.esp (esp32-calc.js); the chip figures come from the catalogue.
 *
 *   #/tools/espcalc/battery      battery life from a duty cycle: chip, cell, the phases of one cycle, the board's own current
 *   #/tools/espcalc/pwm          LEDC: frequency against resolution, duty values, the staircase of duties; a servo
 *   #/tools/espcalc/adc          measuring a voltage: dividers, counts and volts, the ESP32's curve, averaging
 *   #/tools/espcalc/link         radio range: link budget against distance, RSSI, the 2.4 GHz channels
 *   #/tools/espcalc/partitions   the flash layout: schemes, an editable table, errors, the CSV
 *   #/tools/espcalc/leds         an LED with its resistor on a pin; an addressable strip and its power
 *   #/tools/espcalc/lora         spreading factor, air time, the duty-cycle limit, energy per message
 *   #/tools/espcalc/i2c          pull-up resistors: the allowed range, the rise time, modules in parallel
 *   #/tools/espcalc/power        LDO against buck, the capacitor that rides through a transmit burst
 *   #/tools/espcalc/timing       millis() rollover, baud and byte time, timer alarm values, ticks, buffers, flash wear
 *                                (#/tools/espcalc/timing?c=baud|timer|ticks|buffer|flash opens one calculator)
 *
 * Every tab is kit.controls (the headless test drives them) + a kit.stage picture + a kit.readout + a note chosen from
 * the result; pwm, battery and timing also write the program (blocks, Arduino C++, MicroPython) for the numbers shown.
 * The values of the controls are kept while the app is open; the flash table of "partitions" too.
 *
 * Local helpers and figures (not in the engine): the rail dip during a burst (an RC solution, M.dip), the Wi-Fi
 * sensitivity steps by data rate (RATE_OFFSET), LED forward voltages by colour, what a pin can give (about 20 mA by
 * default, 40 mA at most), the strip voltage-drop model (M.stripDrop), the BLE advertising share (0.4 of the Wi-Fi
 * transmit peak) and the CPU-only current (30 mA) of the battery presets, and a few extra checks on partition tables.
 * T.espcalc.model exposes the pure models for tools/test-espcalc.js.
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, E = H.esp;
  const T = H.espTools = H.espTools || {};
  /* the drawing kit, with text that shrinks to fit the picture when it would run off the edge (narrow screens) */
  let curW = 900;                                         // width of the picture being drawn
  const SYMW = { src: null, obj: null };
  function fittedText(c, str, x, y, o) {
    o = o || {};
    const size0 = o.size || 12, align = o.align || 'center', room = align === 'left' ? curW - x - 6 : align === 'right' ? x - 6 : 2 * Math.min(x, curW - x) - 8;
    let size = size0;
    if (room > 24) {
      c.save(); c.font = (o.weight || 500) + ' ' + size0 + 'px ' + (o.mono ? 'Consolas, monospace' : 'system-ui, "Segoe UI", sans-serif');
      const w = c.measureText(String(str)).width; c.restore();
      if (w > room) size = Math.max(8.5, size0 * room / w);
    }
    return H.esym.text(c, str, x, y, size === size0 ? o : Object.assign({}, o, { size }));
  }
  const S = () => { if (SYMW.src !== H.esym) { SYMW.src = H.esym; SYMW.obj = Object.assign({}, H.esym, { text: fittedText }); } return SYMW.obj; };
  const kitc = () => H.kit.colors();

  /* ---------------------------------------------------------------- numbers and words */
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const fin = (x, d) => (Number.isFinite(x) ? x : (d == null ? 0 : d));
  const g = (x, s) => (Number.isFinite(x) ? U.fmt(x, s || 3) : '—');
  const f1 = (x, d) => (Number.isFinite(x) ? x.toFixed(d == null ? 1 : d) : '—');
  const PFX = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p']];
  /* 4700, 'Ω' -> '4.7 kΩ' */
  function eng(v, unit, sig) {
    if (!Number.isFinite(v)) return '—';
    if (v === 0) return '0 ' + unit;
    const a = Math.abs(v), p = PFX.find(x => a >= x[0] * 0.9995) || PFX[PFX.length - 1];
    return g(v / p[0], sig || 3) + ' ' + p[1] + unit;
  }
  const amps = mA => eng(mA / 1000, 'A');
  const ohms = r => eng(r, 'Ω');
  const hz = x => eng(x, 'Hz');
  /* seconds as ms, s, min, h, days or years */
  function dur(s) {
    if (!Number.isFinite(s)) return '—';
    const a = Math.abs(s);
    if (a < 1e-3) return eng(s, 's');
    if (a < 1) return g(s * 1000, 3) + ' ms';
    if (a < 60) return g(s, 3) + ' s';
    if (a < 3600) return g(s / 60, 3) + ' min';
    if (a < 86400) return g(s / 3600, 3) + ' h';
    if (a < 86400 * 365) return g(s / 86400, 3) + ' days';
    return g(s / 86400 / 365, 3) + ' years';
  }
  /* a share 0…1 as a percentage */
  const pct = x => (!Number.isFinite(x) ? '—' : x * 100 < 0.1 ? '< 0.1 %' : x * 100 < 10 ? (x * 100).toFixed(1) + ' %' : Math.round(x * 100) + ' %');
  const hex = (v, d) => '0x' + Math.max(0, Math.round(v)).toString(16).toUpperCase().padStart(d || 1, '0');
  /* a CSS colour from a hue (theme aware) */
  const hue = (h, a) => H.kit.hue(h, a);
  const grey = () => (kitc().dark ? 'rgba(150,156,180,.75)' : 'rgba(90,96,120,.6)');

  /* ---------------------------------------------------------------- controls that remember their values */
  const saved = {};                            // tab name -> { control id: last value }
  /* kit.controls whose values survive leaving the page; api.setc(id, v) sets a slider within its range without firing */
  function ctls(side, name, defs, onChange) {
    const s = saved[name] || (saved[name] = {});
    for (const d of defs) {
      if (!d.id || !(d.id in s)) continue;
      const v = s[d.id];
      if (d.type === 'check') { if (typeof v === 'boolean') d.value = v; }
      else if (d.type === 'select') { if (d.options.some(o => o[1] === v)) d.value = v; }
      else if (d.type == null && typeof v === 'number' && v >= d.min && v <= d.max) d.value = v;
    }
    const api = H.kit.controls(side, defs, (id, v, all) => { onChange(id, v, all, api); Object.assign(s, all); });
    api.setc = (id, v) => {
      const d = defs.find(x => x.id === id);
      if (d && d.type == null) v = clamp(fin(v, d.value), d.min, d.max);
      api.set(id, v);
    };
    return api;
  }
  /* slider definitions, shorter */
  const sl = (id, label, min, max, value, o) => Object.assign({ id, label, min, max, value }, o || {});
  const sel = (id, label, options, value) => ({ id, type: 'select', label, options, value: value == null ? options[0][1] : value });
  const head = html => ({ type: 'html', html: '<b style="color:var(--text)">' + html + '</b>' });
  const fmtA = v => amps(v), fmtT = v => dur(v), fmtU = (u, s) => v => g(v, s || 3) + ' ' + u;

  /* ---------------------------------------------------------------- lab scaffolding */
  /* the controls on the left, the picture on the right, the read-out and its notes under the picture */
  function build(body, o) {
    const lab = T.util.lab(body, o.intro, o.aspect, { minH: o.minH || 260, maxH: o.maxH || 720 });
    const st = lab.st;
    lab.stage.style.minHeight = '0';                       // the picture sets its own height
    let m = null, ctl = null, ro = null, note = null, codeBox = null, codeKey = '';
    const loop = H.kit.loop(() => { if (m && ctl) { curW = st.W; o.draw(st.begin(), st.W, st.H, kitc(), m, ctl.values); } }, lab.stage);
    // a program card that follows the numbers (rebuilt a moment after the last change)
    const codeNow = () => {
      if (!o.code || !m || !codeBox) return;
      const list = [].concat(o.code(m, ctl.values) || []), k = JSON.stringify(list);
      if (k === codeKey) return;
      codeKey = k;
      codeBox.innerHTML = '';
      for (const e of list) { const d = ui.el('<div></div>'); codeBox.appendChild(d); T.util.code(d, e); }
    };
    const codeSoon = o.code ? U.debounce(codeNow, 250) : null;
    const refresh = () => {
      m = o.model(ctl.values);
      o.update(m, ro, note, ctl.values, ctl);
      loop.once();
      if (codeSoon) codeSoon();
    };
    ctl = ctls(lab.side, o.name, o.controls, (id, v, all, api) => { if (o.onChange) o.onChange(id, v, all, api); refresh(); });
    if (o.extraSide) o.extraSide(lab.side);
    if (o.pre) o.pre(lab);
    ro = o.readout ? H.kit.readout(lab.under, o.readout) : null;
    note = ui.el('<div class="espnote"></div>');
    lab.under.appendChild(note);
    const api = { lab, st, ctl, ro, note, loop, refresh, model: () => m };
    if (o.setup) o.setup(api);
    if (o.how || o.more) lab.under.insertAdjacentHTML('beforeend', (o.how ? '<p class="small muted" style="margin:10px 0 0">' + o.how + '</p>' : '') + (o.more ? T.util.more(o.more) : ''));
    if (o.code) { codeBox = ui.el('<div class="espcode" style="margin-top:14px"></div>'); lab.under.appendChild(codeBox); }
    st.onResize(() => loop.once());
    T.util.onTheme(() => loop.once());
    refresh();
    codeNow();
    return api;
  }
  const callout = (kind, title, html) => '<div class="callout co-' + kind + '" style="margin:10px 0 0"><div class="co-h">' + title + '</div><p>' + html + '</p></div>';
  /* a second picture inside the page under the first: -> a kit.stage */
  function stage2(host, aspect, minH) {
    const box = ui.el('<div class="stage" style="margin-top:10px;min-height:0"></div>');
    host.appendChild(box);
    return { box, st: H.kit.stage(box, { aspect: aspect || 0.3, minH: minH || 160, maxH: 460 }) };
  }
  /* a kit.plot in its own box under the picture */
  function plotIn(host, opts, height) {
    const box = ui.el('<div class="espplot" style="margin-top:10px"></div>');
    host.appendChild(box);
    return H.kit.plot(box, opts, height || 220);
  }
  /* a titled section line inside the page */
  const h3 = (host, text) => { const e = ui.el('<h3 style="margin:14px 0 0;font-size:15px">' + text + '</h3>'); host.appendChild(e); return e; };
  /* flowing legend of coloured squares: items [{ color, text }] -> y below */
  function legend(c, items, x, y, w) {
    const C = kitc();
    c.save();
    c.font = '500 11.5px system-ui, "Segoe UI", sans-serif';
    let cx = x, cy = y;
    for (const it of items) {
      const wt = c.measureText(it.text).width + 22;
      if (cx + wt > x + w && cx > x) { cx = x; cy += 18; }
      c.fillStyle = it.color; c.fillRect(cx, cy - 5, 11, 11);
      c.fillStyle = C.text2; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(it.text, cx + 16, cy + 1);
      cx += wt + 10;
    }
    c.restore();
    return cy + 18;
  }
  /* a stacked bar: parts [{ f (fraction), color }]; labels the wide ones with their share */
  function stack(c, x, y, w, h, parts, C) {
    const tot = parts.reduce((a, p) => a + Math.max(0, p.f), 0) || 1;
    let px = x;
    c.save();
    for (const p of parts) {
      const pw = Math.max(0, p.f) / tot * w;
      if (pw <= 0) continue;
      c.fillStyle = p.color; c.fillRect(px, y, Math.max(1, pw - 1), h);
      if (pw > 38) S().text(c, pct(p.f / tot), px + pw / 2, y + h / 2 + 0.5, { size: 11, color: '#fff', weight: 650 });
      px += pw;
    }
    c.strokeStyle = C.border2 || C.faint; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    c.restore();
  }
  /* chips that have a given figure */
  const chipsWith = test => E.CHIPS.filter(c => !c.hidden && test(c));
  const chipOpts = list => list.map(c => [c.name, c.id]);

  /* the pure models, for tools/test-espcalc.js */
  const M = {};
  const TABFN = {};                            // tab id -> function(body), filled as the tabs are defined

  /* ================================================================ 1. battery life */
  const BAT_CHIPS = () => chipsWith(c => c.sleepUa != null && c.txMa != null && c.rxMa != null);
  const BLE_SHARE = 0.4;       // BLE advertising peak as a share of the Wi-Fi transmit peak: a rule of thumb, not a datasheet figure
  const CPU_MA = 30;           // the CPU awake with the radio off: a typical figure, not a datasheet one
  /* the numbers of a radio choice, from the chip's datasheet currents: listening while connecting, then the transmit peak */
  function radioPreset(chip, kind) {
    const rx = (chip && chip.rxMa) || 80, tx = (chip && chip.txMa) || 250;
    if (kind === 'wifi') return { wakeMa: rx, wakeS: 1.5, txMa: tx, txS: 0.05 };
    if (kind === 'ble') return { wakeMa: CPU_MA, wakeS: 0.3, txMa: tx * BLE_SHARE, txS: 0.02 };
    return { wakeMa: CPU_MA, wakeS: 0.3, txMa: 1, txS: 0.001 };
  }
  M.radioPreset = radioPreset;
  /* the model: one cycle of phases -> average current, life, the share of each consumer */
  M.battery = function (v) {
    const chip = E.chip(v.chip) || BAT_CHIPS()[0] || { name: '', sleepUa: v.sleepUa };
    const cell = v.cell === 'custom' ? { id: 'custom', name: 'Your own cell', mAh: v.cap, note: '' } : (E.CELLS.find(c => c.id === v.cell) || E.CELLS[0]);
    const cap = cell.id === 'custom' ? v.cap : cell.mAh, q = Math.max(0, v.q), usable = clamp(v.usable / 100, 0.05, 1);
    const act = [{ key: 'wake', label: 'Wake, connect and measure', short: 'wake-and-connect', mA: v.wakeMa, s: v.wakeS, hue: 150 }, { key: 'tx', label: 'Transmit', short: 'transmit', mA: v.txMa, s: v.txS, hue: 8 }];
    if (v.xa) act.push({ key: 'xa', label: 'Extra phase A', short: 'extra A', mA: v.xaMa, s: v.xaS, hue: 32 });
    if (v.xb) act.push({ key: 'xb', label: 'Extra phase B', short: 'extra B', mA: v.xbMa, s: v.xbS, hue: 186 });
    const activeS = act.reduce((a, p) => a + p.s, 0), over = activeS > v.period, sleepS = Math.max(0, v.period - activeS);
    const phases = [{ key: 'sleep', label: 'Deep sleep (chip)', short: 'deep sleep', mA: v.sleepUa / 1000, s: sleepS, hue: 212 }].concat(act);
    const dc = E.dutyCycle(phases), avg = dc.avg + q;
    const opt = { usable, selfDischarge: v.sd ? 0.03 : 0 };
    const life = E.batteryLife(cap, avg, opt), draw = life.draw, sdmA = Math.max(0, draw - avg);
    const parts = phases.map((p, i) => ({ key: p.key, label: p.label, hue: p.hue, share: draw > 0 ? dc.share[i] * dc.avg / draw : 0 }));
    parts.splice(1, 0, { key: 'board', label: "Board's own current", hue: 52, share: draw > 0 ? q / draw : 0 });
    parts.push({ key: 'self', label: 'Self-discharge', hue: 0, grey: true, share: draw > 0 ? sdmA / draw : 0 });
    const segs = phases.filter(p => p.s > 0).map(p => ({ dur: p.s, mA: p.mA + q, label: p.short, color: p.hue }));
    const altBoard = q > 0.03 ? E.batteryLife(cap, dc.avg + 0.03, opt).hours / Math.max(1e-9, life.hours) : 1;
    return { chip, cell, cap, usable, q, phases, act, dc, avg, life, draw, sdmA, parts, segs, sleepS, activeS, over, period: Math.max(v.period, activeS), altBoard, cycleUAh: (dc.charge + q * dc.period) / 3.6 };
  };
  /* one sentence of advice chosen from the result */
  M.batteryAdvice = function (m, v) {
    const top = m.parts.slice().sort((a, b) => b.share - a.share)[0], out = [];
    let kind = 'tip', title = 'What this says', text;
    if (m.over) {
      kind = 'warn';
      text = 'The phases that are awake add up to ' + dur(m.activeS) + ', longer than the ' + dur(v.period) + ' you chose between wake-ups, so the device never sleeps. Lengthen the period or shorten a phase.';
    } else if (top.key === 'board') {
      text = 'The board itself draws ' + amps(m.q) + ' all the time and takes ' + pct(top.share) + ' of the battery. The chip sleeps on ' + amps(v.sleepUa / 1000) + ', but the regulator, the power LED and the USB chip never sleep.' +
        (m.altBoard > 1.2 ? ' On a bare module or a low-power board (about 30 µA) the same cycle would last about ' + g(m.altBoard, 2) + ' times as long.' : '');
      if (m.q > 0.5) kind = 'warn';
    } else if (top.key === 'sleep') {
      text = 'Deep sleep is the biggest consumer (' + pct(top.share) + '). ' + amps(v.sleepUa / 1000) + ' sounds tiny, but it flows for ' + dur(m.sleepS) + ' of every ' + dur(m.period) + '. Waking less often will not help much: a chip or a board with a lower sleep current, or a bigger cell, will.';
    } else if (top.key === 'self') {
      text = 'The cell loses ' + amps(m.sdmA) + ' to self-discharge, more than the device uses. The 3 % a month used here is a lithium-ion figure; primary cells (alkaline, lithium coin, thionyl chloride) lose only a few percent a year, so untick the box to see the device on its own. The life is then set by the chemistry, not the circuit.';
    } else {
      const p = m.phases.find(x => x.key === top.key) || m.phases[1], gain = (1 / (1 - top.share / 2) - 1) * 100;
      text = 'The ' + p.short + ' phase takes ' + pct(top.share) + ' of the battery: ' + amps(p.mA) + ' for ' + dur(p.s) + ' every cycle. Shorten it: a faster connection (a static IP and a saved channel), a smaller message, or fewer wake-ups. Halving it would stretch the life by about ' + g(gain, 2) + ' %.';
    }
    out.push(callout(kind, title, text));
    if (m.life.years > 10) out.push('<p class="small muted" style="margin:6px 0 0">Past ten years the cell\'s own shelf life matters more than these numbers.</p>');
    if (m.cell.id === 'cr2032' && Math.max(v.txMa, v.wakeMa) > 20) out.push(callout('warn', 'A coin cell cannot give that', 'A CR2032 can supply only a few milliamps. A ' + amps(Math.max(v.txMa, v.wakeMa)) + ' burst makes its voltage collapse and resets the chip: add a large capacitor, or choose a cell that can give pulses.'));
    if (m.cell.note) out.push('<p class="small muted" style="margin:6px 0 0"><b>' + esc(m.cell.name) + ':</b> ' + esc(m.cell.note) + '</p>');
    return out.join('');
  };
  /* the sleep code for the chosen period */
  M.batteryCode = function (m) {
    const s = Math.max(1, Math.round(m.sleepS || 1));
    return {
      title: 'Sleep between measurements',
      about: 'Do the work, then go to deep sleep for the rest of the period. The chip restarts when the timer fires, so everything below runs again from the top.',
      blocks: 'when started\n  // wake, measure, send\n  deep sleep for (' + s + ') seconds',
      cpp: 'const uint64_t SLEEP_SECONDS = ' + s + ';\n\nvoid setup() {\n  // wake, measure, send\n\n  esp_sleep_enable_timer_wakeup(SLEEP_SECONDS * 1000000ULL);   // microseconds\n  esp_deep_sleep_start();                                      // never returns\n}\n\nvoid loop() {}',
      py: 'import machine\n\n# wake, measure, send\n\nmachine.deepsleep(' + (s * 1000) + ')    # milliseconds; the board restarts and runs main.py again',
      notes: ['Wi-Fi and Bluetooth are off after a deep sleep: connect again on every wake-up.']
    };
  };

  function battery(body) {
    const chips = BAT_CHIPS();
    if (!chips.length) { body.innerHTML = '<p class="muted">The chip catalogue is not loaded.</p>'; return; }
    const c0 = chips.find(c => c.id === 'esp32-c3') || chips[0], p0 = radioPreset(c0, 'wifi');
    const setPreset = (api, p) => { for (const k of Object.keys(p)) api.setc(k, p[k]); };
    const defs = [
      sel('chip', 'Chip', chipOpts(chips), c0.id),
      sel('cell', 'Cell', E.CELLS.map(c => [c.name + ' (' + c.mAh + ' mAh)', c.id]).concat([['Your own capacity …', 'custom']]), '18650'),
      sl('cap', 'Capacity of your cell', 10, 20000, 1000, { log: true, sig: 3, fmt: fmtU('mAh') }),
      sl('usable', 'Usable share of the capacity', 50, 100, 80, { step: 1, fmt: v => Math.round(v) + ' %' }),
      { id: 'sd', type: 'check', label: 'Count self-discharge (3 % a month, a lithium-ion figure)', value: true },
      head('One cycle'),
      sl('period', 'Time between wake-ups', 1, 86400, 600, { log: true, sig: 3, fmt: fmtT }),
      sel('radio', 'The radio during a wake-up', [['Wi-Fi: connect, then send', 'wifi'], ['Bluetooth LE: advertise', 'ble'], ['No radio: sensor only', 'none']], 'wifi'),
      head('Deep sleep'),
      sl('sleepUa', 'The chip asleep (datasheet)', 0.5, 3000, c0.sleepUa, { log: true, sig: 3, fmt: fmtU('µA') }),
      sel('qpre', 'The board around the chip', [['Bare module: 10 µA', 0.01], ['Good low-power board: 30 µA', 0.03], ['Dev board, small regulator: 2 mA', 2], ['Typical dev board: 5 mA', 5], ['Dev board with LED and USB chip: 10 mA', 10]], 0.03),
      sl('q', "Board's own current, always", 0.005, 30, 0.03, { log: true, sig: 2, fmt: fmtA }),
      head('Wake, connect and measure'),
      sl('wakeMa', 'Current', 1, 600, p0.wakeMa, { log: true, sig: 3, fmt: fmtA }),
      sl('wakeS', 'Duration', 0.01, 60, p0.wakeS, { log: true, sig: 3, fmt: fmtT }),
      head('Transmit'),
      sl('txMa', 'Current', 1, 600, p0.txMa, { log: true, sig: 3, fmt: fmtA }),
      sl('txS', 'Duration', 0.001, 60, p0.txS, { log: true, sig: 3, fmt: fmtT }),
      head('Extra phases (a warming sensor, a motor, a display …)'),
      { id: 'xa', type: 'check', label: 'Phase A', value: false },
      sl('xaMa', 'A: current', 0.1, 600, 15, { log: true, sig: 3, fmt: fmtA }),
      sl('xaS', 'A: duration', 0.01, 600, 3, { log: true, sig: 3, fmt: fmtT }),
      { id: 'xb', type: 'check', label: 'Phase B', value: false },
      sl('xbMa', 'B: current', 0.1, 600, 5, { log: true, sig: 3, fmt: fmtA }),
      sl('xbS', 'B: duration', 0.01, 600, 10, { log: true, sig: 3, fmt: fmtT })
    ];
    const rows = [['avg', 'Average current'], ['life', 'Battery life'], ['years', 'In years'], ['day', 'Charge used per day'], ['cap', 'Usable capacity'], ['cyc', 'Charge per wake-up'], ['sd', 'Self-discharge alone'],
      ['sh_sleep', 'Share: deep sleep (chip)'], ['sh_board', "Share: the board's own current"], ['sh_wake', 'Share: wake, connect, measure'], ['sh_tx', 'Share: transmit'], ['sh_xa', 'Share: extra phase A'], ['sh_xb', 'Share: extra phase B'], ['sh_self', 'Share: self-discharge']];
    build(body, {
      name: 'battery', aspect: 0.55, minH: 440, controls: defs, readout: rows,
      intro: 'A device that sleeps, wakes, measures, sends and sleeps again lives on its <b>average current</b>. Choose the chip, the cell and the phases of one cycle: the picture shows the current on a log scale with its average, and the bar shows which phase eats the battery.',
      how: 'Read the top picture as one cycle: the long low floor is deep sleep, the tall spikes are the awake phases, and the dashed line is the average the battery actually feels. The bar below shares that average out: whatever is widest is where a change pays most. Datasheet figures are the chip alone; the board around it is the number that usually decides.',
      more: ['battery-life-budget', 'deep-sleep', 'the-board-is-not-the-chip', 'lithium-cells', 'power-modes'],
      code: M.batteryCode,
      model: M.battery,
      onChange(id, v, all, api) {
        if (id === 'chip') { const c = E.chip(v); if (c) { api.setc('sleepUa', c.sleepUa); setPreset(api, radioPreset(c, all.radio)); } }
        if (id === 'radio') setPreset(api, radioPreset(E.chip(all.chip) || c0, v));
        if (id === 'qpre') api.setc('q', v);
        if (id === 'cell') { api.show('cap', v === 'custom'); const c = E.CELLS.find(x => x.id === v); if (c) api.set('sd', !!c.rechargeable); }
      },
      setup(api) { api.ctl.show('cap', api.ctl.values.cell === 'custom'); },
      update(m, ro, note, v, ctl) {
        ro.set('avg', amps(m.avg));
        ro.set('life', dur(m.life.hours * 3600));
        ro.set('years', Number.isFinite(m.life.years) ? (m.life.years > 100 ? 'more than 100 years' : g(m.life.years, 3) + ' years') : '—');
        ro.set('day', g(m.avg * 24, 3) + ' mAh');
        ro.set('cap', g(m.cap * m.usable, 4) + ' mAh of ' + g(m.cap, 4));
        ro.set('cyc', g(m.cycleUAh, 3) + ' µAh');
        ro.set('sd', v.sd ? amps(m.sdmA) : 'not counted');
        for (const p of m.parts) ro.set('sh_' + (p.key === 'sleep' ? 'sleep' : p.key), pct(p.share));
        ro.show('sh_xa', !!v.xa); ro.show('sh_xb', !!v.xb);
        note.innerHTML = M.batteryAdvice(m, v);
      },
      draw(c, W, Hh, C, m) {
        const sy = S(), left = 64, right = 16, w = Math.max(80, W - left - right);
        sy.battery(c, 14, 10, 40, 18, 1, {});
        sy.text(c, m.cell.name + ' · ' + g(m.cap, 4) + ' mAh', 64, 13, { align: 'left', size: 12, color: C.text2 });
        sy.text(c, 'usable ' + g(m.cap * m.usable, 4) + ' mAh', 64, 29, { align: 'left', size: 11 });
        sy.text(c, dur(m.life.hours * 3600), W - 14, 20, { align: 'right', size: 19, weight: 700, color: C.text });
        const tlY = 62, tlH = clamp(Hh - 255, 90, 300);
        sy.text(c, 'Current during one cycle (log scale)', left, tlY - 12, { align: 'left', size: 11.5, color: C.text2 });
        sy.timeline(c, left, tlY, w, tlH, m.segs.map(s => ({ dur: s.dur, mA: s.mA, label: s.label, color: hue(s.color, 0.9) })), { log: true });
        sy.text(c, '0', left, tlY + tlH + 11, { size: 10 });
        sy.text(c, dur(m.period), left + w, tlY + tlH + 11, { align: 'right', size: 10 });
        const by = tlY + tlH + 52;
        sy.text(c, 'Who eats the battery: the share of the charge drawn', left, by - 14, { align: 'left', size: 11.5, color: C.text2 });
        stack(c, left, by, w, 26, m.parts.map(p => ({ f: p.share, color: p.grey ? grey() : hue(p.hue) })), C);
        legend(c, m.parts.filter(p => p.share >= 0.0005).map(p => ({ color: p.grey ? grey() : hue(p.hue), text: p.label + ' ' + pct(p.share) })), left, by + 46, w);
      }
    });
  }

  TABFN.battery = battery;

  /* ================================================================ 2. PWM (LEDC) */
  const PWM_PRESETS = { led: { freq: 5000, bits: 8, duty: 25 }, motor: { freq: 20000, bits: 10, duty: 50 }, servo: { freq: 50, bits: 14, duty: 7.5 }, fan: { freq: 25000, bits: 8, duty: 50 } };
  const timerBits = id => E.ledcTimerBits(id);        // the LEDC timer is 20 bits wide on the ESP32, C6, H2, C5, C61 and P4, and 14 on the S2, S3, C3 and C2
  M.pwm = function (v) {
    const freq = Math.max(1, Math.round(v.freq)), cap = timerBits(v.chip), bits = Math.round(clamp(v.bits, 1, 20));
    const maxBits = E.ledcMaxBits(freq, v.clock, cap), maxFreq = E.ledcMaxFreq(bits, v.clock);
    const ok = bits <= maxBits, useBits = ok ? bits : Math.max(1, maxBits), steps = Math.pow(2, useBits);
    const hw = E.ledcDuty(v.duty / 100, useBits), code = Math.min(hw, steps - 1);     // ledcWrite() takes 0 … 2^bits − 1, the top value being "fully on"
    const p = E.pwm(freq, useBits, code >= steps - 1 ? steps : hw, 3.3);
    return { freq, cap, bits, useBits, maxBits, maxFreq, ok, steps, hw, code, p, frac: p.frac, ticks: v.clock / freq, clockWarn: v.chip === 'esp32' && v.clock < 80e6 };
  };
  M.servo = function (v) {
    const cap = timerBits(v.chip), freq = 50, maxBits = E.ledcMaxBits(freq, v.clock, cap), bits = Math.min(Math.round(v.sbits), Math.max(1, maxBits));
    const maxUs = Math.max(v.maxUs, v.minUs + 100);
    const s = E.servo(v.angle, { minUs: v.minUs, maxUs, range: v.range, freq, bits });
    return { s, bits, maxBits, over: v.sbits > maxBits, maxUs, freq };
  };
  /* a staircase of the duties the timer can make, around the chosen one: -> { pts, lo, hi } in percent */
  M.stairs = function (steps, code) {
    const win = steps <= 32 ? steps : 16;
    const lo = steps <= 32 ? 0 : clamp(code - win / 2, 0, steps - win), hi = lo + win, pts = [];
    for (let k = Math.floor(lo); k <= hi; k++) pts.push([Math.max(lo, k - 0.5) / steps * 100, k / steps * 100], [Math.min(hi, k + 0.5) / steps * 100, k / steps * 100]);
    return { pts, lo: lo / steps * 100, hi: hi / steps * 100 };
  };
  M.pwmCode = function (m, v) {
    if (!m.ok) return null;
    const u16 = Math.round(m.frac * 65535), top = m.steps - 1, share = g(m.frac * 100, 3) + ' %';
    const pwm = {
      title: 'Set up this PWM output',
      about: 'One pin makes a square wave of **' + hz(m.freq) + '** whose width has **' + m.useBits + ' bits** of resolution; the duty is set to ' + share + '.',
      needs: 'An ESP32-family board and a free output pin; pin 4 is only an example.',
      blocks: 'when started\n  set PWM on pin (4) frequency (' + m.freq + ') resolution (' + m.useBits + ')\n  set PWM on pin (4) to (' + m.code + ')',
      cpp: 'const int PWM_PIN  = 4;          // a free output pin of your board\nconst int PWM_FREQ = ' + m.freq + ';       // Hz\nconst int PWM_BITS = ' + m.useBits + ';          // duty values 0 … ' + top + '\n\nvoid setup() {\n  ledcAttach(PWM_PIN, PWM_FREQ, PWM_BITS);\n  ledcWrite(PWM_PIN, ' + m.code + ');          // ' + share + '\n}\n\nvoid loop() {}',
      py: 'from machine import Pin, PWM\n\npwm = PWM(Pin(4), freq=' + m.freq + ', duty_u16=' + u16 + ')    # ' + share + ' (duty_u16 runs 0 … 65535 whatever the hardware resolution)',
      notes: ['In the Arduino core 3 the last value, ' + top + ', means fully on.']
    };
    const sv = M.servo(v), s = sv.s, sTop = Math.pow(2, sv.bits) - 1;
    const servo = {
      title: 'Move a servo to ' + Math.round(v.angle) + '°',
      about: 'A servo wants a pulse every 20 ms; its width, ' + g(s.us, 4) + ' µs here, sets the angle. The duty value below is that pulse at ' + sv.bits + ' bits.',
      needs: 'A hobby servo on its own 5 V supply, with its ground joined to the board\'s ground.',
      blocks: 'when started\n  set servo on pin (18) to (' + Math.round(v.angle) + ') degrees',
      cpp: 'const int SERVO_PIN = 18;        // any free output pin\nconst int FREQ = 50;             // a 20 ms period\nconst int BITS = ' + sv.bits + ';           // duty values 0 … ' + sTop + '\n\nvoid setup() {\n  ledcAttach(SERVO_PIN, FREQ, BITS);\n  ledcWrite(SERVO_PIN, ' + Math.min(s.duty, sTop) + ');     // a pulse of ' + g(s.us, 4) + ' µs\n}\n\nvoid loop() {}',
      py: 'from machine import Pin, PWM\n\nservo = PWM(Pin(18), freq=50)\nservo.duty_ns(' + Math.round(s.us * 1000) + ')    # a pulse of ' + g(s.us, 4) + ' µs',
      notes: ['The pulse limits of ' + Math.round(v.minUs) + ' and ' + Math.round(sv.maxUs) + ' µs belong to the servo; check its data sheet before driving it to the ends.']
    };
    return [pwm, servo];
  };

  function pwm(body) {
    const chips = chipsWith(c => c.ledc > 0);
    if (!chips.length) { body.innerHTML = '<p class="muted">The chip catalogue is not loaded.</p>'; return; }
    const c0 = chips.find(c => c.id === 'esp32') || chips[0];
    let PL = null, SV = null;
    const defs = [
      sel('chip', 'Chip (sets the timer width)', chipOpts(chips), c0.id),
      sel('clock', 'LEDC clock', [['80 MHz (APB)', 80e6], ['40 MHz (crystal)', 40e6]], 80e6),
      sel('preset', 'Start from', [['LED dimming: 5 kHz', 'led'], ['Motor, above hearing: 20 kHz', 'motor'], ['Hobby servo: 50 Hz', 'servo'], ['PC fan: 25 kHz', 'fan'], ['My own numbers', 'own']], 'led'),
      sl('freq', 'Frequency', 1, 1000000, 5000, { log: true, sig: 3, fmt: hz }),
      sl('bits', 'Resolution', 1, 20, 8, { step: 1, fmt: v => Math.round(v) + ' bits' }),
      sl('duty', 'Duty', 0, 100, 25, { step: 0.1, fmt: v => g(v, 3) + ' %' }),
      head('A hobby servo'),
      sl('angle', 'Angle', 0, 180, 90, { step: 1, fmt: v => Math.round(v) + '°' }),
      sl('range', 'Travel of the servo', 90, 270, 180, { step: 5, fmt: v => Math.round(v) + '°' }),
      sl('minUs', 'Pulse at 0°', 400, 1200, 500, { step: 10, fmt: v => Math.round(v) + ' µs' }),
      sl('maxUs', 'Pulse at full travel', 1800, 2600, 2500, { step: 10, fmt: v => Math.round(v) + ' µs' }),
      sel('sbits', 'Servo duty resolution', [['10 bits', 10], ['12 bits', 12], ['14 bits', 14], ['16 bits', 16]], 14)
    ];
    const rows = [['maxbits', 'Finest resolution at this frequency'], ['maxfreq', 'Fastest at this resolution'], ['state', 'This setting'], ['code', 'Duty value to write'], ['actual', 'Duty you really get'], ['step', 'One step of duty'], ['period', 'Period'], ['ton', 'On-time'], ['avg', 'Average voltage (3.3 V supply)']];
    build(body, {
      name: 'pwm', aspect: 0.4, minH: 300, controls: defs, readout: rows,
      intro: 'PWM on the ESP32 is made by the <b>LEDC</b> timer, which counts clock ticks: the faster the wave, the fewer ticks fit in one period, so the fewer steps the duty can have. Pick a frequency and a resolution that fit together, and see the duty value to write.',
      how: 'The top picture is the pin over three periods, with the average a motor or an LED sees. The staircase below shows that duty cannot be set freely: it moves in steps, wide when the resolution is low. If the resolution asked for does not fit the frequency, the setting is impossible and the program below is withheld.',
      more: ['pwm-with-ledc', 'driving-leds-with-pwm', 'servos', 'fans-and-pwm-control', 'motor-pwm-frequency'],
      code: M.pwmCode, model: M.pwm,
      onChange(id, v, all, api) {
        if (id === 'preset' && PWM_PRESETS[v]) { const p = PWM_PRESETS[v]; api.setc('freq', p.freq); api.setc('bits', p.bits); api.setc('duty', p.duty); }
        else if (id === 'freq' || id === 'bits' || id === 'duty') { api.set('preset', 'own'); }
      },
      pre(lab) {
        h3(lab.under, 'The staircase of duty values');
        PL = plotIn(lab.under, { x: { label: 'duty asked for (%)', min: 0, max: 100 }, y: { label: 'duty you get (%)', min: 0, max: 100 }, series: [], legend: true }, 230);
      },
      setup(api) {
        const under = api.lab.under;
        h3(under, 'A hobby servo: angle, pulse width, duty value');
        const s2 = stage2(under, 0.3, 180);
        SV = { m: null, st: s2.st, ro: null, loop: null };
        const paint = () => { if (SV.m) { curW = s2.st.W; paintServo(s2.st.begin(), s2.st.W, s2.st.H, kitc(), SV.m, api.ctl.values); } };
        SV.loop = H.kit.loop(paint, s2.box);
        s2.st.onResize(() => SV.loop.once());
        T.util.onTheme(() => SV.loop.once());
        SV.ro = H.kit.readout(under, [['us', 'Pulse width'], ['share', 'Share of the 20 ms period'], ['duty', 'Duty value to write'], ['bits', 'Resolution used'], ['step', 'One duty step moves the horn by']]);
        SV.note = ui.el('<div class="espnote"></div>'); under.appendChild(SV.note);
      },
      update(m, ro, note, v) {
        ro.set('maxbits', m.maxBits + ' bits (timer width ' + m.cap + ')');
        ro.set('maxfreq', hz(m.maxFreq));
        ro.set('state', m.ok ? 'possible' : 'impossible');
        ro.set('code', m.ok ? m.code + ' of 0 … ' + (m.steps - 1) : '—');
        ro.set('actual', m.ok ? g(m.frac * 100, 4) + ' %' : '—');
        ro.set('step', m.ok ? pct(1 / m.steps) + ' · ' + dur(m.p.stepTime) : '—');
        ro.set('period', dur(m.p.period));
        ro.set('ton', m.ok ? dur(m.p.tOn) : '—');
        ro.set('avg', m.ok ? g(m.p.avg, 3) + ' V' : '—');
        let t;
        if (!m.ok) t = callout('warn', 'These two do not fit', 'At ' + hz(m.freq) + ' the timer has ' + g(m.ticks, 4) + ' clock ticks per period, enough for at most <b>' + m.maxBits + ' bits</b> (the timer of this chip is ' + m.cap + ' bits wide). Asking for ' + m.bits + ' bits makes ledcAttach() fail. Lower the resolution to ' + m.maxBits + ' bits, or the frequency to ' + hz(m.maxFreq) + '.');
        else {
          const bits = [];
          if (m.freq < 200) bits.push('Below about 200 Hz an LED visibly flickers.');
          else if (m.freq < 20000) bits.push('Between 200 Hz and 20 kHz a motor or an inductor may whine; above 20 kHz it is silent but the resolution is smaller.');
          if (m.useBits <= 4) bits.push('With only ' + m.useBits + ' bits the duty moves in jumps of ' + pct(1 / m.steps) + ': fine for on/off, coarse for dimming.');
          if (m.clockWarn) bits.push('The classic ESP32 does not offer the crystal as an LEDC clock: it runs from the 80 MHz APB clock.');
          t = callout('tip', 'What this says', 'At ' + hz(m.freq) + ' with ' + m.useBits + ' bits the duty moves in steps of ' + pct(1 / m.steps) + ' (' + dur(m.p.stepTime) + ' each). The timer could give up to ' + m.maxBits + ' bits here, or ' + hz(m.maxFreq) + ' at ' + m.bits + ' bits. ' + bits.join(' '));
        }
        note.innerHTML = t;
        // the staircase
        const sx = M.stairs(m.steps, m.code);
        PL.set({
          x: { label: 'duty asked for (%)', min: sx.lo, max: sx.hi }, y: { label: 'duty you get (%)', min: sx.lo, max: sx.hi },
          series: [{ pts: sx.pts, label: 'duty values the timer can make', width: 2.4 }, { pts: [[sx.lo, sx.lo], [sx.hi, sx.hi]], label: 'ideal: what you asked for', dash: true, width: 1.4, hover: false }],
          marks: [{ x: v.duty, y: m.frac * 100, label: g(m.frac * 100, 3) + ' %' }]
        });
        // the servo
        const sv = M.servo(v), s = sv.s;
        SV.m = sv;
        SV.ro.set('us', g(s.us, 4) + ' µs');
        SV.ro.set('share', pct(s.frac));
        SV.ro.set('duty', Math.min(s.duty, Math.pow(2, sv.bits) - 1) + ' of 0 … ' + (Math.pow(2, sv.bits) - 1));
        SV.ro.set('bits', sv.bits + ' bits (at most ' + sv.maxBits + ' here)');
        SV.ro.set('step', g(s.stepDeg, 3) + '° (' + g(s.stepUs, 3) + ' µs)');
        SV.note.innerHTML = sv.over ? callout('warn', 'Too many bits for a servo', 'A 20 ms period at ' + v.sbits + ' bits needs a timer wider than the ' + sv.maxBits + ' bits this chip has; the numbers above use ' + sv.bits + ' bits, which is plenty (about ' + g(s.stepDeg, 2) + '° per step).') : '';
        SV.loop.once();
      },
      draw(c, W, Hh, C, m) {
        const sy = S(), left = 58, right = 22, w = Math.max(60, W - left - right), y0 = 60, h = clamp(Hh * 0.38, 50, 150), t1 = 3 / m.freq;
        sy.text(c, 'The pin over three periods', left, 13, { align: 'left', size: 12, color: C.text2 });
        sy.wave(c, left, y0, w, h, sy.pwmEdges(m.freq, m.frac, 0, t1), { t0: 0, t1, color: C.accent, fill: true });
        sy.text(c, '3.3 V', left - 8, y0, { align: 'right', size: 11 }); sy.text(c, '0 V', left - 8, y0 + h, { align: 'right', size: 11 });
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let k = 0; k <= 3; k++) { const x = Math.round(left + w * k / 3) + 0.5; c.beginPath(); c.moveTo(x, y0 - 6); c.lineTo(x, y0 + h + 6); c.stroke(); }
        const ay = y0 + h - clamp(m.p.avg / 3.3, 0, 1) * h;
        c.setLineDash([5, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.4; c.beginPath(); c.moveTo(left, ay); c.lineTo(left + w, ay); c.stroke(); c.setLineDash([]);
        c.restore();
        sy.text(c, 'average ' + g(m.p.avg, 3) + ' V', left + w - 4, ay - 9, { align: 'right', size: 10.5, color: C.warn });
        // period and on-time brackets
        const px = left + w / 3;
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.3; c.beginPath(); c.moveTo(left, y0 - 14); c.lineTo(px, y0 - 14); c.moveTo(left, y0 - 19); c.lineTo(left, y0 - 9); c.moveTo(px, y0 - 19); c.lineTo(px, y0 - 9); c.stroke(); c.restore();
        sy.text(c, 'period ' + dur(m.p.period), (left + px) / 2, y0 - 25, { size: 11, color: C.text2 });
        if (m.ok && m.frac > 0.001 && m.frac < 0.999) {
          const ox = left + w / 3 * m.frac, by = y0 + h + 16;
          c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.6; c.beginPath(); c.moveTo(left, by); c.lineTo(ox, by); c.moveTo(left, by - 5); c.lineTo(left, by + 5); c.moveTo(ox, by - 5); c.lineTo(ox, by + 5); c.stroke(); c.restore();
          sy.text(c, 'on ' + dur(m.p.tOn) + ' (' + g(m.frac * 100, 3) + ' %)', Math.max(left + 60, (left + ox) / 2), by + 14, { size: 11, color: C.accent });
        }
        // the steps inside one period
        const ry = y0 + h + 52;
        sy.text(c, 'One period is cut into ' + m.steps + ' steps of ' + dur(m.p.stepTime), left, ry - 12, { align: 'left', size: 11.5, color: C.text2 });
        const rw = w / 3, n = Math.min(m.steps, 64);
        c.save();
        for (let k = 0; k < n; k++) { c.fillStyle = k * m.steps / n < m.frac * m.steps ? hue(212, 0.85) : (k % 2 ? C.surface2 || C.surface : C.surface); c.fillRect(left + rw * k / n, ry, Math.max(1, rw / n - (n <= 32 ? 1 : 0)), 18); }
        c.strokeStyle = C.border2 || C.faint; c.strokeRect(left + 0.5, ry + 0.5, rw - 1, 17);
        c.restore();
        sy.text(c, m.steps > 64 ? 'first 64 of ' + m.steps + ' shown' : m.steps + ' steps', left + rw + 10, ry + 9, { align: 'left', size: 10.5 });
        sy.text(c, g(m.ticks, 4) + ' clock ticks per period: the steps must fit in them', left, ry + 36, { align: 'left', size: 11, color: C.muted });
      }
    });
  }
  function paintServo(c, W, Hh, C, sv, v) {
    const sy = S(), s = sv.s, left = 110, right = 20, w = Math.max(60, W - left - right), y0 = 34, h = Math.max(30, Hh * 0.34);
    sy.servo(c, 52, Hh * 0.46, clamp(v.angle / Math.max(1, v.range) * 180, 0, 180), { size: 56 });
    sy.text(c, Math.round(v.angle) + '° of ' + Math.round(v.range) + '°', 52, Hh * 0.46 + 46, { size: 11.5, color: C.text2 });
    const t1 = 0.04;
    sy.text(c, 'The control signal: a pulse every 20 ms', left, 14, { align: 'left', size: 12, color: C.text2 });
    sy.wave(c, left, y0, w, h, sy.pwmEdges(50, s.frac, 0, t1), { t0: 0, t1, color: hue(28), fill: true });
    const ox = left + w * (s.us * 1e-6) / t1;
    c.save(); c.strokeStyle = hue(28); c.lineWidth = 1.5; c.beginPath(); c.moveTo(left, y0 + h + 12); c.lineTo(ox, y0 + h + 12); c.moveTo(left, y0 + h + 7); c.lineTo(left, y0 + h + 17); c.moveTo(ox, y0 + h + 7); c.lineTo(ox, y0 + h + 17); c.stroke(); c.restore();
    sy.text(c, g(s.us, 4) + ' µs', Math.max(left + 28, (left + ox) / 2), y0 + h + 28, { size: 11.5, color: hue(28) });
    // the pulse-width scale from 0° to full travel
    const sy0 = y0 + h + 52, x0 = left, sw = w, f = clamp((s.us - v.minUs) / Math.max(1, sv.maxUs - v.minUs), 0, 1);
    c.save(); c.fillStyle = C.surface2 || C.surface; c.fillRect(x0, sy0, sw, 8); c.fillStyle = hue(28, 0.8); c.fillRect(x0, sy0, sw * f, 8); c.restore();
    sy.text(c, Math.round(v.minUs) + ' µs = 0°', x0, sy0 + 20, { align: 'left', size: 10.5 });
    sy.text(c, Math.round(sv.maxUs) + ' µs = ' + Math.round(v.range) + '°', x0 + sw, sy0 + 20, { align: 'right', size: 10.5 });
  }
  TABFN.pwm = pwm;

  /* ================================================================ 3. the ADC */
  const ADC_PRESETS = { bat: { vin: 4.2, head: 95, total: 1e6, series: 'E24', tol: 0.01, atten: 11 }, v5: { vin: 5, head: 95, total: 100e3, series: 'E24', tol: 0.01, atten: 11 }, v12: { vin: 12, head: 95, total: 220e3, series: 'E24', tol: 0.01, atten: 11 } };
  M.adc = function (v) {
    const range = (E.ADC_RANGE[v.chip] || E.ADC_RANGE.esp32)[v.atten] || [0, 3.1], vfs = E.adcFullScale(v.atten);
    const target = range[1] * v.head / 100, needed = v.vin > target;
    let r1 = 0, r2 = 0, vout = v.vin, current = 0, zsrc = 0, errHi = 0, errLo = 0;
    if (needed) {
      const d = E.dividerFor(v.vin, target, v.total);
      r1 = E.eSeries(d.r1, v.series); r2 = E.eSeries(d.r2, v.series);
      vout = E.divider(v.vin, r1, r2);
      current = v.vin / (r1 + r2);
      zsrc = r1 * r2 / (r1 + r2);
      errHi = E.divider(v.vin, r1 * (1 - v.tol), r2 * (1 + v.tol)) / vout - 1;
      errLo = E.divider(v.vin, r1 * (1 + v.tol), r2 * (1 - v.tol)) / vout - 1;
    }
    const ratio = v.vin > 0 ? vout / v.vin : 1;
    const raw = v.chip === 'esp32' && v.atten === 11;
    const n = Math.max(1, Math.round(v.n)), lsb = E.adcLsb(12, vfs);
    return { range, vfs, target, needed, r1, r2, vout, ratio, current, zsrc, errHi, errLo, over: vout > range[1] * 1.001, danger: vout > 3.3,
      cntFull: E.adcCounts(vout, 12, vfs), lsbIn: ratio > 0 ? lsb / ratio : lsb, lsb,
      cPin: E.adcCounts(v.vpin, 12, vfs), vOfCounts: E.adcVolts(v.counts, 12, vfs), raw, rawCounts: E.adcEsp32Raw(v.vpin),
      n, noise1: v.noise, noiseN: E.oversample(v.noise, n), bitsGain: 0.5 * Math.log(n) / Math.LN2 };
  };
  function adc(body) {
    const chipIds = Object.keys(E.ADC_RANGE).filter(id => E.chip(id));
    if (!chipIds.length) { body.innerHTML = '<p class="muted">The chip catalogue is not loaded.</p>'; return; }
    const p0 = ADC_PRESETS.bat;
    let PA = null, PN = null;
    const defs = [
      sel('chip', 'Chip', chipIds.map(id => [E.chip(id).name, id]), 'esp32'),
      sel('atten', 'Attenuation', [['0 dB', 0], ['2.5 dB', 2.5], ['6 dB', 6], ['11 dB (the default)', 11]], 11),
      sel('preset', 'Start from', [['Battery monitor: 4.2 V Li-ion', 'bat'], ['A 5 V sensor output', 'v5'], ['A 12 V supply', 'v12'], ['My own numbers', 'own']], 'bat'),
      head('The divider'),
      sl('vin', 'Highest voltage to measure', 0.5, 60, p0.vin, { step: 0.1, fmt: v => g(v, 3) + ' V' }),
      sl('head', 'Use this much of the ADC range at full input', 60, 100, p0.head, { step: 1, fmt: v => Math.round(v) + ' %' }),
      sl('total', 'Total resistance R1 + R2', 1e3, 1e7, p0.total, { log: true, sig: 2, fmt: ohms }),
      sel('series', 'Resistor series', [['E6 (20 %)', 'E6'], ['E12 (10 %)', 'E12'], ['E24 (5 %)', 'E24']], p0.series),
      sel('tol', 'Resistor tolerance', [['5 %', 0.05], ['1 %', 0.01], ['0.1 %', 0.001]], p0.tol),
      head('Counts and volts'),
      sl('vpin', 'Voltage at the pin', 0, 3.6, 1.65, { step: 0.01, fmt: v => g(v, 3) + ' V' }),
      sl('counts', 'A reading of', 0, 4095, 2048, { step: 1, fmt: v => Math.round(v) + ' counts' }),
      head('Averaging'),
      sl('n', 'Readings averaged', 1, 1024, 16, { log: true, sig: 3, fmt: v => Math.max(1, Math.round(v)) }),
      sl('noise', 'Noise of one reading', 0.5, 30, 6, { step: 0.5, fmt: v => g(v, 3) + ' counts' })
    ];
    const rows = [['r1', 'R1 (to the input)'], ['r2', 'R2 (to ground)'], ['vout', 'Pin voltage at full input'], ['err', 'Worst case, from the tolerance'], ['waste', 'Current the divider wastes'], ['zsrc', 'Source impedance seen by the pin'], ['cnt', 'Counts at full input'], ['lsb', 'One count, at the input'], ['range', 'Recommended range at this attenuation'],
      ['c1', 'The pin voltage reads as'], ['c2', 'The reading means'], ['raw', 'Uncalibrated classic ESP32 reads'], ['noise', 'Noise after averaging'], ['bits', 'Resolution gained']];
    build(body, {
      name: 'adc', aspect: 0.38, minH: 290, controls: defs, readout: rows,
      intro: 'The ADC measures only a few volts at its pin, and the range depends on the <b>attenuation</b>. To measure more, divide the voltage down; to measure better, know what the divider costs in current and accuracy, and what the converter does to the number.',
      how: 'The ruler is the voltage at the pin: green is the range Espressif recommends, amber is beyond it, red is above what the pin survives. The marker is where your divider puts the highest input. The first graph shows how the classic ESP32 bends away from a straight line; the second how little averaging buys at first and how much it costs in readings.',
      more: ['the-esp-adc', 'adc-attenuation-and-calibration', 'oversampling-and-noise', 'measuring-voltage', 'measuring-battery-level'],
      model: M.adc,
      onChange(id, v, all, api) {
        if (id === 'preset' && ADC_PRESETS[v]) { const p = ADC_PRESETS[v]; for (const k of Object.keys(p)) { if (k === 'series' || k === 'tol' || k === 'atten') api.set(k, p[k]); else api.setc(k, p[k]); } }
        else if (['vin', 'head', 'total', 'series', 'tol'].includes(id)) api.set('preset', 'own');
      },
      pre(lab) {
        h3(lab.under, 'Counts against volts at the pin');
        PA = plotIn(lab.under, { x: { label: 'volts at the pin', min: 0, max: 3.6 }, y: { label: 'counts', min: 0, max: 4100 }, series: [], legend: true }, 240);
        h3(lab.under, 'What averaging buys');
        PN = plotIn(lab.under, { x: { label: 'readings averaged', log: true, min: 1, max: 1024 }, y: { label: 'noise (counts rms)', min: 0 }, series: [] }, 170);
      },
      update(m, ro, note, v) {
        ro.set('r1', m.needed ? ohms(m.r1) : 'none needed');
        ro.set('r2', m.needed ? ohms(m.r2) : 'none needed');
        ro.set('vout', g(m.vout, 3) + ' V' + (m.needed ? ' (ratio 1 : ' + g(1 / m.ratio, 3) + ')' : ''));
        ro.set('err', m.needed ? '+' + g(m.errHi * 100, 2) + ' % / ' + g(m.errLo * 100, 2).replace('-', '−') + ' %' : '—');
        ro.set('waste', m.needed ? amps(m.current * 1000) : '0');
        ro.set('zsrc', m.needed ? ohms(m.zsrc) : '—');
        ro.set('cnt', Math.round(m.cntFull) + ' of 4095');
        ro.set('lsb', eng(m.lsbIn, 'V'));
        ro.set('range', g(m.range[0], 3) + ' to ' + g(m.range[1], 3) + ' V');
        ro.set('c1', g(v.vpin, 3) + ' V → ' + Math.round(m.cPin) + ' counts');
        ro.set('c2', Math.round(v.counts) + ' counts → ' + g(m.vOfCounts, 4) + ' V');
        ro.set('raw', m.raw ? Math.round(m.rawCounts) + ' counts (the straight line gives ' + Math.round(m.cPin) + ')' : 'modelled only for the classic ESP32 at 11 dB');
        ro.set('noise', g(m.noise1, 3) + ' → ' + g(m.noiseN, 3) + ' counts (' + eng(m.noiseN * m.lsb, 'V') + ')');
        ro.set('bits', '+' + g(m.bitsGain, 2) + ' bits from ' + m.n + ' readings');
        const t = [];
        if (!m.needed) t.push(callout('tip', 'No divider needed', 'The highest input, ' + g(v.vin, 3) + ' V, already fits the range of the ADC at ' + g(v.atten, 3) + ' dB. Connect it straight to the pin, with a series resistor of about 1 kΩ for protection.'));
        else {
          if (m.danger) t.push(callout('warn', 'This would damage the pin', 'The divider gives ' + g(m.vout, 3) + ' V at full input, above the 3.3 V a pin tolerates. Lower the use of the range, or pick a smaller attenuation.'));
          else if (m.over) t.push(callout('warn', 'Beyond the recommended range', 'The divider gives ' + g(m.vout, 3) + ' V at full input, above the ' + g(m.range[1], 3) + ' V that is recommended at this attenuation: the top readings will be squashed or clipped.'));
          const tips = [];
          if (m.zsrc > 20e3) tips.push('The pin sees ' + ohms(m.zsrc) + ': above about 10–20 kΩ the converter\'s sampling capacitor pulls the readings down. Put 100 nF from the pin to ground, or use smaller resistors.');
          if (m.current * 1e6 > 50) tips.push('The divider wastes ' + g(m.current * 1e6, 3) + ' µA all the time; on a battery that can matter more than the sleep current. Larger resistors save it, but raise the source impedance.');
          if (Math.max(m.errHi, -m.errLo) > 0.02) tips.push('The resistors alone can be wrong by up to ' + g(Math.max(m.errHi, -m.errLo) * 100, 2) + ' %: use 1 % parts, or calibrate against a meter.');
          t.push(callout('tip', 'What this says', 'R1 = ' + ohms(m.r1) + ' and R2 = ' + ohms(m.r2) + ' turn ' + g(v.vin, 3) + ' V into ' + g(m.vout, 3) + ' V at the pin, about ' + Math.round(m.cntFull) + ' counts. ' + tips.join(' ')));
        }
        note.innerHTML = t.join('');
        // counts against volts
        const xmax = clamp(Math.ceil(m.vfs * 1.1 * 10) / 10, 1.2, 4.2), ideal = [], rawp = [];
        for (let k = 0; k <= 90; k++) { const x = xmax * k / 90; ideal.push([x, E.adcCounts(x, 12, m.vfs)]); if (m.raw) rawp.push([x, E.adcEsp32Raw(x)]); }
        PA.set({
          x: { label: 'volts at the pin', min: 0, max: xmax }, y: { label: 'counts', min: 0, max: 4100 },
          series: [{ pts: ideal, label: 'ideal straight line, full scale ' + g(m.vfs, 3) + ' V', width: 2 }].concat(m.raw ? [{ pts: rawp, label: 'classic ESP32, uncalibrated (a typical curve)', width: 2.4 }] : []),
          vlines: [{ x: m.range[1], label: 'recommended up to ' + g(m.range[1], 3) + ' V', color: kitc().warn }].concat(m.range[0] > 0 ? [{ x: m.range[0], label: 'from ' + g(m.range[0], 3) + ' V', color: kitc().faint }] : []),
          marks: [{ x: Math.min(v.vpin, xmax), y: m.cPin, label: Math.round(m.cPin) + '' }].concat(m.raw ? [{ x: Math.min(v.vpin, xmax), y: m.rawCounts, color: kitc().warn }] : [])
        });
        // noise against averaging
        const np = [];
        for (let k = 0; k <= 40; k++) { const nn = Math.pow(1024, k / 40); np.push([nn, E.oversample(v.noise, nn)]); }
        PN.set({ x: { label: 'readings averaged', log: true, min: 1, max: 1024 }, y: { label: 'noise (counts rms)', min: 0, max: Math.max(1, v.noise * 1.05) }, series: [{ pts: np, width: 2.2 }], marks: [{ x: m.n, y: m.noiseN, label: m.n + ' readings: ' + g(m.noiseN, 2) }] });
      },
      draw(c, W, Hh, C, m, v) {
        const sy = S(), sw = clamp(W * 0.36, 150, 270);
        // the divider
        const cx = 56, top = 40, bot = Hh - 34, mid = (top + bot) / 2, bw = 30, bh = Math.min(40, (bot - top) * 0.2);
        c.save(); c.strokeStyle = C.text2; c.fillStyle = C.text2; c.lineWidth = 1.8;
        const res = (y, label) => { c.strokeRect(cx - bw / 2, y, bw, bh); sy.text(c, label, cx + bw / 2 + 8, y + bh / 2, { align: 'left', size: 11.5, color: C.text }); };
        c.beginPath(); c.moveTo(cx, top); c.lineTo(cx, mid - bh - 6); c.stroke();
        res(mid - bh - 6, 'R1  ' + (m.needed ? ohms(m.r1) : '—'));
        c.beginPath(); c.moveTo(cx, mid - 6); c.lineTo(cx, mid + 6); c.stroke();
        res(mid + 6, 'R2  ' + (m.needed ? ohms(m.r2) : '—'));
        c.beginPath(); c.moveTo(cx, mid + bh + 6); c.lineTo(cx, bot); c.moveTo(cx - 12, bot); c.lineTo(cx + 12, bot); c.moveTo(cx - 7, bot + 5); c.lineTo(cx + 7, bot + 5); c.moveTo(cx - 3, bot + 10); c.lineTo(cx + 3, bot + 10); c.stroke();
        c.beginPath(); c.arc(cx, mid, 3, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.moveTo(cx, mid); c.lineTo(sw - 70, mid); c.stroke();
        c.restore();
        sy.text(c, g(v.vin, 3) + ' V in', cx, top - 14, { size: 12, weight: 650, color: C.text });
        sy.text(c, 'to the ADC pin', sw - 66, mid - 12, { align: 'left', size: 11, color: C.muted });
        sy.text(c, g(m.vout, 3) + ' V', sw - 66, mid + 6, { align: 'left', size: 13, weight: 700, color: m.danger ? C.bad : m.over ? C.warn : C.ok });
        // the ruler of the pin voltage
        const rx = sw + 30, rw = Math.max(60, W - rx - 22), ry = Hh * 0.42, rh = 26, vmax = Math.max(m.vfs, 3.6, m.vout * 1.05);
        const X = u => rx + clamp(u / vmax, 0, 1) * rw;
        sy.text(c, 'Voltage at the pin (blue line: the value you set)', rx, ry - 52, { align: 'left', size: 12, color: C.text2 });
        c.save();
        c.fillStyle = C.surface2 || C.surface; c.fillRect(rx, ry, rw, rh);
        c.fillStyle = hue(150, 0.55); c.fillRect(X(m.range[0]), ry, X(m.range[1]) - X(m.range[0]), rh);
        c.fillStyle = hue(40, 0.45); c.fillRect(X(m.range[1]), ry, X(Math.min(3.3, vmax)) - X(m.range[1]), rh);
        if (vmax > 3.3) { c.fillStyle = hue(8, 0.55); c.fillRect(X(3.3), ry, X(vmax) - X(3.3), rh); }
        c.strokeStyle = C.border2 || C.faint; c.lineWidth = 1; c.strokeRect(rx + 0.5, ry + 0.5, rw - 1, rh - 1);
        c.strokeStyle = C.axis; c.beginPath();
        for (let t = 0; t <= Math.floor(vmax * 2) / 2; t += 0.5) { const x = Math.round(X(t)) + 0.5; c.moveTo(x, ry + rh); c.lineTo(x, ry + rh + 5); }
        c.stroke();
        c.restore();
        for (let t = 0; t <= Math.floor(vmax); t += 1) sy.text(c, t + ' V', X(t), ry + rh + 16, { size: 10.5 });
        // the marker: the highest input after the divider
        const mx = X(m.vout);
        c.save(); c.fillStyle = m.danger ? C.bad : m.over ? C.warn : C.text; c.beginPath(); c.moveTo(mx, ry - 2); c.lineTo(mx - 7, ry - 14); c.lineTo(mx + 7, ry - 14); c.closePath(); c.fill(); c.restore();
        sy.text(c, 'highest input: ' + g(m.vout, 3) + ' V = ' + Math.round(m.cntFull) + ' counts', clamp(mx, rx + 95, rx + rw - 95), ry - 30, { size: 11.5, color: C.text });
        sy.text(c, 'recommended ' + g(m.range[0], 3) + ' to ' + g(m.range[1], 3) + ' V', X((m.range[0] + m.range[1]) / 2), ry + rh + 34, { size: 10.5, color: C.ok });
        sy.text(c, 'above 3.3 V the pin is damaged', rx + rw, ry + rh + 50, { align: 'right', size: 10.5, color: C.bad });
        // the pin voltage and counts you asked for
        const px = X(v.vpin);
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(px, ry - 2); c.lineTo(px, ry + rh + 2); c.stroke(); c.restore();
      }
    });
  }
  TABFN.adc = adc;

  /* ================================================================ 4. radio range */
  /* what each data rate costs in sensitivity, against the chip's best figure (about; check the datasheet) */
  const RATE_OFFSET = [['Slowest rate: Wi-Fi 1 Mbit/s or Bluetooth LE 1M', 0], ['Wi-Fi at 11 Mbit/s', 10], ['Wi-Fi at 54 Mbit/s', 23]];
  const ENVS = [['Free space, outdoors in sight: 2', 2], ['Open office: 3', 3], ['Through floors: 4', 4], ['Dense building: 5', 5]];
  M.link = function (v) {
    const sens = v.sens + v.rate, base = { tx: v.tx, gt: v.gt, gr: v.gr, mhz: v.band, n: v.n, walls: v.walls, wallLoss: v.wallLoss, sens };
    const at = E.link(Object.assign({ d: v.d }, base));
    const r0 = Math.min(1e6, E.linkRange(base)), rF = Math.min(1e6, E.linkRange(Object.assign({ margin: v.fade }, base)));
    const dmax = clamp(Math.max(r0, v.d, 10) * 3, 30, 1e6), curve = [];
    for (let k = 0; k <= 80; k++) { const d = Math.pow(dmax, k / 80); curve.push([d, E.link(Object.assign({ d }, base)).margin]); }
    return { sens, at, r0, rF, curve, dmax, fres: E.fresnel(v.d, v.band), wave: E.wavelength(v.band), quarter: E.quarterWave(v.band), quality: E.rssiQuality(at.rx), eirp: v.tx + v.gt,
      per10: Math.pow(10, 1 / Math.max(1, v.n)) };
  };
  /* does a 2 MHz channel at `mhz` fall inside the skirts of a Wi-Fi channel? */
  M.insideWifi = (mhz, wifiCh) => Math.abs(mhz - E.wifiChannel(wifiCh)) < 11;
  function link(body) {
    const chips = chipsWith(c => c.txDbm != null && c.sensDbm != null);
    if (!chips.length) { body.innerHTML = '<p class="muted">The chip catalogue is not loaded.</p>'; return; }
    const c0 = chips.find(c => c.id === 'esp32-c3') || chips[0];
    let PL = null, CH = null;
    const defs = [
      sel('chip', 'Chip (fills transmit power and sensitivity)', chipOpts(chips), c0.id),
      sel('band', 'Band', [['2.4 GHz', 2442], ['5 GHz', 5500]], 2442),
      sel('rate', 'Data rate', RATE_OFFSET, 0),
      head('The transmitter and the receiver'),
      sl('tx', 'Transmit power', -10, 22, c0.txDbm, { step: 0.5, fmt: v => g(v, 3) + ' dBm' }),
      sl('gt', 'Transmit antenna gain', -3, 12, 0, { step: 0.5, fmt: v => g(v, 3) + ' dBi' }),
      sl('gr', 'Receive antenna gain', -3, 12, 0, { step: 0.5, fmt: v => g(v, 3) + ' dBi' }),
      sl('sens', "Receiver sensitivity at the chip's best rate", -110, -60, c0.sensDbm, { step: 0.5, fmt: v => g(v, 4) + ' dBm' }),
      head('The path'),
      sl('d', 'Distance', 1, 10000, 30, { log: true, sig: 3, fmt: v => eng(v, 'm') }),
      sel('env', 'The surroundings', ENVS, 3),
      sl('n', 'Path-loss exponent', 1.6, 6, 3, { step: 0.1, fmt: v => g(v, 2) }),
      sl('walls', 'Walls in the way', 0, 12, 0, { step: 1, fmt: v => Math.round(v) }),
      sl('wallLoss', 'Loss of each wall', 1, 25, 5, { step: 1, fmt: v => Math.round(v) + ' dB' }),
      sl('fade', 'Fade margin to keep', 0, 30, 10, { step: 1, fmt: v => Math.round(v) + ' dB' }),
      head('The 2.4 GHz channels'),
      sel('myWifi', 'Channel of your Wi-Fi router', Array.from({ length: 13 }, (_, i) => ['Channel ' + (i + 1), i + 1]), 6)
    ];
    const rows = [['sens', 'Sensitivity at this rate'], ['eirp', 'Radiated power (EIRP)'], ['loss', 'Path loss at this distance'], ['rx', 'Received power (RSSI)'], ['q', 'Signal quality'], ['margin', 'Margin over the sensitivity'], ['r0', 'Range with no margin'], ['rF', 'Range keeping the fade margin'], ['fres', 'First Fresnel zone, mid-link'], ['wave', 'Wavelength · quarter-wave antenna']];
    build(body, {
      name: 'link', aspect: 0.36, minH: 220, maxH: 420, controls: defs, readout: rows,
      intro: 'A radio link works while the power that arrives is above what the receiver can use. Add the transmit power and both antennas, take away the loss of the path and of every wall, and compare with the receiver\'s <b>sensitivity</b>: what is left is the margin.',
      how: 'The graph shows the margin shrinking with distance: green where the link works, red where it does not, and the line where the margin runs out is the range. Indoors the exponent matters more than anything else. The channel chart below shows why Wi-Fi channels 1, 6 and 11 are the clear trio, and where Bluetooth Low Energy and Zigbee fit between them.',
      more: ['link-budget', 'decibels-and-dbm', 'rssi-and-signal-quality', 'range-and-obstacles', 'interference-and-channels'],
      model: M.link,
      onChange(id, v, all, api) {
        if (id === 'chip') { const c = E.chip(v); if (c) { api.setc('tx', c.txDbm); api.setc('sens', c.sensDbm); } }
        if (id === 'env') api.setc('n', v);
        if (id === 'n') api.set('env', ENVS.some(e => e[1] === v) ? v : all.env);
        if (id === 'myWifi' && CH) CH.loop.once();
      },
      pre(lab) {
        h3(lab.under, 'Margin against distance');
        PL = plotIn(lab.under, { x: { label: 'distance (m)', log: true, min: 1, max: 100 }, y: { label: 'margin over the sensitivity (dB)', min: -40, max: 80 }, series: [] }, 250);
      },
      setup(api) {
        const under = api.lab.under;
        h3(under, 'The 2.4 GHz band: who sits where');
        const s2 = stage2(under, 0.44, 300);
        CH = { st: s2.st, loop: null };
        CH.loop = H.kit.loop(() => { curW = s2.st.W; paintChannels(s2.st.begin(), s2.st.W, s2.st.H, kitc(), api.ctl.values.myWifi); }, s2.box);
        s2.st.onResize(() => CH.loop.once());
        T.util.onTheme(() => CH.loop.once());
        under.insertAdjacentHTML('beforeend', '<p class="small muted" style="margin:8px 0 0">Wi-Fi channels are 20 MHz wide and five apart, so only 1, 6 and 11 do not overlap. Bluetooth LE advertises on three channels placed in the gaps. Zigbee uses 16 channels of 2 MHz; 15, 20, 25 and 26 sit between the busy Wi-Fi channels. Channel 14 is allowed in Japan only.</p>');
        CH.loop.once();
      },
      update(m, ro, note, v) {
        ro.set('sens', g(m.sens, 4) + ' dBm');
        ro.set('eirp', g(m.eirp, 3) + ' dBm (' + g(E.dBmToMw(m.eirp), 3) + ' mW)');
        ro.set('loss', g(m.at.loss, 3) + ' dB');
        ro.set('rx', g(m.at.rx, 3) + ' dBm');
        ro.set('q', m.quality + (m.at.ok ? '' : ' · below the sensitivity'));
        ro.set('margin', (m.at.margin >= 0 ? '+' : '−') + g(Math.abs(m.at.margin), 3) + ' dB');
        ro.set('r0', m.r0 < 1 ? 'under 1 m' : eng(m.r0, 'm'));
        ro.set('rF', m.rF < 1 ? 'under 1 m' : eng(m.rF, 'm'));
        ro.set('fres', eng(m.fres, 'm') + ' (keep 60 % clear)');
        ro.set('wave', eng(m.wave, 'm') + ' · ' + g(m.quarter, 3) + ' mm');
        const t = [], chip = E.chip(v.chip), has5 = chip && chip.wifi && chip.wifi.bands.indexOf(5) >= 0;
        if (v.band > 5000 && !has5) t.push(callout('warn', 'No 5 GHz on this chip', 'The ' + esc(chip ? chip.name : 'chip') + ' has only a 2.4 GHz radio. The figures are for 5 GHz as an example of how much more a higher frequency loses.'));
        if (!m.at.ok) t.push(callout('warn', 'The link is down', 'At ' + eng(v.d, 'm') + ' the signal is ' + g(-m.at.margin, 3) + ' dB too weak. Every 10 dB gained multiplies the range by about ' + g(m.per10, 2) + ' in these surroundings: more transmit power, a better antenna, fewer walls, or a shorter hop (the range with no margin is ' + (m.r0 < 1 ? 'under 1 m' : eng(m.r0, 'm')) + ').'));
        else if (m.at.margin < v.fade) t.push(callout('warn', 'It works, but not reliably', 'The margin is ' + g(m.at.margin, 3) + ' dB, less than the ' + Math.round(v.fade) + ' dB kept for fading (people walking, doors, interference). Expect drop-outs; the reliable range is ' + (m.rF < 1 ? 'under 1 m' : eng(m.rF, 'm')) + '.'));
        else t.push(callout('tip', 'What this says', 'At ' + eng(v.d, 'm') + ' the signal arrives at ' + g(m.at.rx, 3) + ' dBm, ' + g(m.at.margin, 3) + ' dB above what the receiver needs: ' + m.quality + ', with room to spare for fading. The reliable range is ' + (m.rF < 1 ? 'under 1 m' : eng(m.rF, 'm')) + '.'));
        if (m.eirp > 20 && v.band < 3000) t.push('<p class="small muted" style="margin:6px 0 0">Transmit power plus antenna gain is ' + g(m.eirp, 3) + ' dBm, above 20 dBm (100 mW), the usual limit in Europe at 2.4 GHz. Radio is regulated: check your country\'s rules.</p>');
        note.innerHTML = t.join('');
        // the margin against distance, green where the link works and red where it does not
        const ok = m.curve.map(([d, mg]) => [d, Math.max(0, mg)]), bad = m.curve.map(([d, mg]) => [d, Math.min(0, mg)]);
        const top = Math.max(20, Math.ceil(m.curve[0][1] / 10) * 10 + 5), C = kitc();
        PL.set({
          x: { label: 'distance (m)', log: true, min: 1, max: m.dmax, fmt: v2 => eng(v2, 'm', 2) },
          y: { label: 'margin over the sensitivity (dB)', min: -40, max: top, fmt: v2 => (v2 > 0 ? '+' : '') + Math.round(v2) },
          fmtX: v2 => eng(v2, 'm'), fmtY: v2 => f1(v2, 1) + ' dB (' + f1(v2 + m.sens, 1) + ' dBm)',
          series: [{ pts: ok, fill: true, line: false, color: C.ok, hover: false }, { pts: bad, fill: true, line: false, color: C.bad, hover: false }, { pts: m.curve, width: 2.4, color: C.accent, label: 'margin' }],
          hlines: [{ y: 0, label: 'receiver sensitivity ' + g(m.sens, 4) + ' dBm', color: C.bad, dash: false }].concat(v.fade > 0 ? [{ y: v.fade, label: 'fade margin', color: C.warn }] : []),
          vlines: [{ x: Math.min(m.dmax, Math.max(1, v.d)), label: 'you', color: C.text2 }],
          marks: [{ x: Math.min(m.dmax, Math.max(1, v.d)), y: clamp(m.at.margin, -40, top), label: g(m.at.rx, 3) + ' dBm' }]
        });
      },
      draw(c, W, Hh, C, m, v) {
        const sy = S(), y = Hh * 0.46, x1 = 66, x2 = W - 66;
        const half = (x2 - x1) / 2, ratio = clamp(Math.sqrt(m.wave / Math.max(1, v.d)), 0.03, 0.5), ry = clamp(ratio * half * 1.1, 10, Hh * 0.34);
        // the first Fresnel zone, schematic
        c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath(); c.ellipse((x1 + x2) / 2, y, Math.max(1, half - 20), Math.max(1, ry), 0, 0, Math.PI * 2); c.stroke(); c.setLineDash([]); c.restore();
        sy.text(c, 'first Fresnel zone (dashed, schematic): radius ' + eng(m.fres, 'm') + ' at mid-link', (x1 + x2) / 2, Hh - 32, { size: 10.5, color: C.faint });
        // walls
        const nw = Math.min(12, Math.round(v.walls));
        for (let k = 0; k < nw; k++) { const wx = x1 + 60 + (x2 - x1 - 120) * (k + 0.5) / nw; c.save(); c.fillStyle = hue(28, 0.8); c.fillRect(wx - 3, y - Hh * 0.2, 6, Hh * 0.4); c.restore(); }
        if (nw) sy.text(c, nw + ' wall' + (nw > 1 ? 's' : '') + ' × ' + Math.round(v.wallLoss) + ' dB = ' + Math.round(nw * v.wallLoss) + ' dB', (x1 + x2) / 2, y + Hh * 0.2 + 14, { size: 11, color: hue(28) });
        sy.radio(c, x1, y, { r: 54, n: 3, phase: 0.35, color: C.accent });
        sy.node(c, x1, y, { kind: 'esp', label: (E.chip(v.chip) || { name: 'ESP' }).name, r: 22 });
        sy.node(c, x2, y, { kind: 'router', label: 'router or phone', r: 22, color: 212 });
        sy.link(c, x1 + 32, y - 4, x2 - 32, y - 4, { wireless: true, arrow: 'both', color: C.muted });
        sy.text(c, eng(v.d, 'm'), (x1 + x2) / 2, y - 16, { size: 13, weight: 650, color: C.text, bg: C.bg2 });
        const bx = x2 - 17, by = y + 44;
        sy.bars(c, bx, by, m.at.rx, { w: 34, h: 22, label: g(m.at.rx, 3) + ' dBm' });
        sy.text(c, m.at.ok ? m.quality : 'no link', bx + 17, by + 52, { size: 11, color: m.at.ok ? C.text2 : C.bad });
        sy.text(c, (m.at.margin >= 0 ? '+' : '−') + g(Math.abs(m.at.margin), 3) + ' dB margin', x1, Hh - 12, { align: 'left', size: 12.5, weight: 650, color: m.at.ok ? C.ok : C.bad });
      }
    });
  }
  /* the 2.4 GHz band: Wi-Fi humps, BLE channels, Zigbee channels */
  function paintChannels(c, W, Hh, C, myWifi) {
    const sy = S(), left = 30, right = 20, w = Math.max(100, W - left - right), f0 = 2400, f1 = 2500, X = f => left + (f - f0) / (f1 - f0) * w;
    const wy0 = 28, wh = clamp(Hh - 28 - 150, 70, 230), base = wy0 + wh, mine = clamp(Math.round(myWifi), 1, 13);
    sy.text(c, 'Wi-Fi channels, 20 MHz wide (1, 6 and 11 do not overlap)', left, 12, { align: 'left', size: 11.5, color: C.text2 });
    // the humps: the clear trio solid, the others outlined, the reader's own marked
    const hump = (ch, fillA, lineA, lw) => {
      const f = E.wifiChannel(ch);
      c.beginPath();
      for (let k = 0; k <= 24; k++) { const ff = f - 11 + 22 * k / 24, y = base - wh * (1 - Math.pow((ff - f) / 11, 2)) * 0.96; if (k === 0) c.moveTo(X(ff), base); c.lineTo(X(ff), y); }
      c.lineTo(X(f + 11), base); c.closePath();
      c.fillStyle = hue(ch === mine ? 28 : 212, fillA); c.fill(); c.lineWidth = lw; c.strokeStyle = hue(ch === mine ? 28 : 212, lineA); c.stroke();
    };
    c.save();
    for (let ch = 1; ch <= 13; ch++) if (E.WIFI_CLEAR.indexOf(ch) < 0 && ch !== mine) hump(ch, 0.07, 0.4, 1);
    for (const ch of E.WIFI_CLEAR) if (ch !== mine) hump(ch, 0.22, 0.95, 1.8);
    hump(mine, 0.3, 1, 2.4);
    c.restore();
    for (let ch = 1; ch <= 13; ch++) sy.text(c, String(ch), X(E.wifiChannel(ch)), base + 9, { size: 10.5, color: ch === mine ? hue(28) : E.WIFI_CLEAR.indexOf(ch) >= 0 ? C.text : C.faint, weight: ch === mine || E.WIFI_CLEAR.indexOf(ch) >= 0 ? 700 : 500 });
    // the axis
    c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(left, base); c.lineTo(left + w, base); c.stroke(); c.restore();
    for (const f of [2400, 2420, 2440, 2460, 2480, 2500]) sy.text(c, f === 2400 ? '2400 MHz' : String(f), X(f), base + 24, { size: 9.5, color: C.faint });
    // Bluetooth LE: 40 channels, three advertise
    const by = base + 46;
    sy.text(c, 'Bluetooth LE: 40 channels of 2 MHz; 37, 38 and 39 advertise', left, by - 12, { align: 'left', size: 11.5, color: C.text2 });
    for (let k = 0; k < 40; k++) {
      const ch = k < 11 ? 2404 + 2 * k : 2428 + 2 * (k - 11);
      c.save(); c.fillStyle = grey(); c.fillRect(X(ch) - 1.5, by, 3, 16); c.restore();
    }
    for (const ch of [37, 38, 39]) {
      const f = E.bleChannel(ch), inside = M.insideWifi(f, mine);
      c.save(); c.fillStyle = inside ? C.warn : C.ok; c.fillRect(X(f) - 2.5, by - 3, 5, 22); c.restore();
      sy.text(c, String(ch), X(f), by + 31, { size: 10.5, color: inside ? C.warn : C.ok, weight: 700 });
    }
    // Zigbee: 16 channels
    const zy = by + 56;
    sy.text(c, 'Zigbee and Thread: channels 11 to 26 (orange: inside your Wi-Fi channel)', left, zy - 12, { align: 'left', size: 11.5, color: C.text2 });
    for (let ch = 11; ch <= 26; ch++) {
      const f = E.zigbeeChannel(ch), inside = M.insideWifi(f, mine);
      c.save(); c.fillStyle = inside ? C.warn : hue(150); c.globalAlpha = inside ? 0.9 : 0.85; c.fillRect(X(f) - 3, zy, 6, 16); c.restore();
      sy.text(c, String(ch), X(f), zy + 28, { size: 10.5, color: inside ? C.warn : C.text2, weight: [15, 20, 25, 26].indexOf(ch) >= 0 ? 700 : 500 });
    }
  }
  TABFN.link = link;

  /* ================================================================ 5. flash partitions */
  const KB = 1024, MB = 1024 * 1024;
  const SUBTYPES = { app: ['factory', 'ota_0', 'ota_1', 'ota_2', 'test'], data: ['nvs', 'ota', 'phy', 'nvs_keys', 'coredump', 'fat', 'spiffs'] };
  const partState = { scheme: 'default-4m', rows: null };           // the table being edited survives leaving the page
  const cloneParts = id => ((E.PARTITION_SCHEMES.find(s => s.id === id) || E.PARTITION_SCHEMES[0]).parts).map(p => p.slice());
  const partHue = r => (r.type === 'app' ? 212 : r.subtype === 'nvs' || r.subtype === 'nvs_keys' ? 150 : r.subtype === 'ota' ? 52 : r.subtype === 'spiffs' || r.subtype === 'fat' ? 280 : r.subtype === 'coredump' ? 20 : r.subtype === 'phy' ? 186 : 330);
  /* the layout of a table, the checks the engine makes, and a few more of our own */
  M.partitions = function (rows, flash, progKb) {
    const r = E.partitions(rows, flash), warns = [];
    const names = new Set();
    for (const row of r.rows) {
      if (!row.name) warns.push('a partition has no name');
      else if (names.has(row.name)) warns.push('the name "' + row.name + '" is used twice');
      names.add(row.name);
    }
    if (!r.rows.some(x => x.subtype === 'nvs')) warns.push('there is no nvs partition: Wi-Fi settings and Preferences have nowhere to live');
    const od = r.rows.find(x => x.subtype === 'ota');
    if (od && od.size !== 8 * KB) warns.push('the otadata partition is normally 8 KB (two sectors)');
    const fs = r.rows.filter(x => x.subtype === 'spiffs' || x.subtype === 'fat').reduce((a, x) => a + x.size, 0);
    const layers = [{ label: 'Bootloader', sub: 'second stage; its address depends on the chip (0x1000 on the ESP32, 0x0 on the C3 and S3)', size: 0x8000, color: 'rgba(128,128,128,.16)', right: '0x0 · 32 KB' },
      { label: 'Partition table', size: 0x1000, color: 'rgba(128,128,128,.16)', right: '0x8000 · 4 KB' }];
    let end = 0x9000;
    for (const row of r.rows) {
      if (row.offset > end) layers.push({ label: 'unused (alignment)', size: row.offset - end, color: 'rgba(128,128,128,.08)', right: hex(end) + ' · ' + E.kb(row.offset - end) });
      layers.push({ label: row.name || '(no name)', sub: row.type + ' / ' + row.subtype, size: Math.max(1, row.size), color: partHue(row), right: hex(row.offset) + ' · ' + E.kb(row.size) });
      end = Math.max(end, row.end);
    }
    if (r.used > r.flash) layers.push({ label: 'beyond the end of the flash', size: r.used - r.flash, color: 'rgba(229,72,77,.35)', right: E.kb(r.used - r.flash) + ' too much' });
    else if (r.free > 0) layers.push({ label: 'free', size: r.free, color: 'rgba(128,128,128,.06)', right: hex(r.used) + ' · ' + E.kb(r.free) });
    const progB = progKb * KB;
    return { r, warns, layers, fs, progB, fits: r.appMax > 0 && progB <= r.appMax, usePct: r.appMax > 0 ? progB / r.appMax : 0, otaOk: r.ota && !!od };
  };
  function partitions(body) {
    if (!partState.rows) partState.rows = cloneParts(partState.scheme);
    const part = partState;
    let TB = null;
    const schemeById = id => E.PARTITION_SCHEMES.find(s => s.id === id);
    const defs = [
      sel('scheme', 'Start from a scheme', E.PARTITION_SCHEMES.map(s => [s.name, s.id]).concat([['My own table', 'custom']]), part.scheme),
      sel('flash', 'Flash size of the chip or module', [['1 MB', 1 * MB], ['2 MB', 2 * MB], ['4 MB', 4 * MB], ['8 MB', 8 * MB], ['16 MB', 16 * MB], ['32 MB', 32 * MB]], (schemeById(part.scheme) || { flash: 4 * MB }).flash),
      sl('prog', 'Size of your program', 100, 8192, 1200, { log: true, sig: 3, fmt: v => g(v, 3) + ' KB' }),
      { type: 'buttons', items: [{ id: 'add', label: 'Add a partition' }, { id: 'drop', label: 'Remove the last' }, { id: 'fill', label: 'Free space → file system' }, { id: 'reset', label: 'Back to the scheme' }, { id: 'copy', label: 'Copy the CSV', primary: true }] }
    ];
    const rows = [['count', 'Partitions'], ['used', 'Reached by the table'], ['free', 'Free at the end'], ['app', 'Largest program that fits'], ['prog', 'Your program'], ['ota', 'Over-the-air updates'], ['fs', 'Space for files']];
    const cell = (i, f, html) => '<td data-i="' + i + '" data-f="' + f + '">' + html + '</td>';
    const tableHtml = r => '<table class="optable"><thead><tr><th>Name</th><th>Type</th><th>Subtype</th><th>Offset</th><th>Size (KB)</th><th>End</th><th></th></tr></thead><tbody>' +
      r.rows.map((x, i) => '<tr><td><input class="inp" style="width:104px;height:28px" data-i="' + i + '" data-f="name" maxlength="15" value="' + esc(x.name) + '"></td>' +
        '<td><select class="inp" style="height:28px" data-i="' + i + '" data-f="type">' + Object.keys(SUBTYPES).map(t => '<option' + (t === x.type ? ' selected' : '') + '>' + t + '</option>').join('') + '</select></td>' +
        '<td><select class="inp" style="height:28px" data-i="' + i + '" data-f="subtype">' + (SUBTYPES[x.type] || []).map(t => '<option' + (t === x.subtype ? ' selected' : '') + '>' + t + '</option>').join('') + '</select></td>' +
        '<td class="num">' + hex(x.offset) + '</td><td><input type="number" class="inp" style="width:84px;height:28px" min="1" step="4" data-i="' + i + '" data-f="kb" value="' + (x.size / KB) + '"></td>' +
        '<td class="num">' + hex(x.end) + '</td><td><button class="btn sm ghost" data-del="' + i + '" title="Remove">×</button></td></tr>').join('') + '</tbody></table>';
    build(body, {
      name: 'partitions', aspect: 0.7, minH: 380, maxH: 720, controls: defs, readout: rows,
      intro: 'The flash chip is divided into <b>partitions</b>: one or two for the program, one for settings, one for files. The layout is a table that the bootloader reads at 0x8000. Choose a scheme, edit the sizes, and see at once whether it fits, whether over-the-air updates are possible and how big a program can be.',
      how: 'The flash is drawn from address 0x0 at the top. The bootloader and the partition table come first, so the first partition starts at 0x9000; a program partition starts on a 64 KB boundary. Two equal program partitions are what allow an over-the-air update: the new program is written to the one that is not running.',
      more: ['partition-tables', 'ota-partitions-and-rollback', 'flash-wear', 'ota-updates'],
      model: v => M.partitions(part.rows, v.flash, v.prog),
      pre(lab) {
        h3(lab.under, 'The table: edit the names, kinds and sizes');
        TB = ui.el('<div class="esppart" style="margin-top:8px;overflow:auto"></div>');
        lab.under.appendChild(TB);
        TB.addEventListener('change', e => {
          const t = e.target, f = t && t.dataset && t.dataset.f, i = t && t.dataset ? +t.dataset.i : -1, row = part.rows[i];
          if (!f || !row) return;
          if (f === 'name') row[0] = String(t.value || '').trim().slice(0, 15);
          else if (f === 'type') { row[1] = t.value; if (SUBTYPES[row[1]].indexOf(row[2]) < 0) row[2] = SUBTYPES[row[1]][0]; }
          else if (f === 'subtype') row[2] = t.value;
          else if (f === 'kb') row[3] = Math.max(1, Math.round((+t.value || 1) * KB));
          part.scheme = 'custom'; if (pApi) { pApi.ctl.set('scheme', 'custom'); pApi.refresh(); }
        });
        TB.addEventListener('click', e => {
          const b = e.target && e.target.closest ? e.target.closest('[data-del]') : null;
          if (b) { part.rows.splice(+b.dataset.del, 1); part.scheme = 'custom'; if (pApi) { pApi.ctl.set('scheme', 'custom'); pApi.refresh(); } }
        });
      },
      setup(api) { pApi = api; },
      onChange(id, v, all, api) {
        if (id === 'scheme') { const s = schemeById(v); if (s) { part.rows = cloneParts(v); api.set('flash', s.flash); } part.scheme = v; }
        else if (id === 'add') { part.rows.push(['storage', 'data', 'spiffs', 64 * KB]); part.scheme = 'custom'; api.set('scheme', 'custom'); }
        else if (id === 'drop') { part.rows.pop(); part.scheme = 'custom'; api.set('scheme', 'custom'); }
        else if (id === 'reset') { const s = schemeById(part.scheme === 'custom' ? 'default-4m' : part.scheme) || E.PARTITION_SCHEMES[0]; part.scheme = s.id; part.rows = cloneParts(s.id); api.set('scheme', s.id); api.set('flash', s.flash); }
        else if (id === 'fill') {
          const r = E.partitions(part.rows, all.flash), free = Math.floor(r.free / (4 * KB)) * 4 * KB;
          if (free >= 4 * KB) {
            const last = part.rows.slice().reverse().find(x => x[2] === 'spiffs' || x[2] === 'fat');
            if (last) last[3] += free; else part.rows.push(['storage', 'data', 'spiffs', free]);
            part.scheme = 'custom'; api.set('scheme', 'custom');
          }
        }
        else if (id === 'copy') { const csv = E.partitions(part.rows, all.flash).csv; if (ui.copy) ui.copy(csv); }
      },
      update(m, ro, note, v) {
        const r = m.r;
        TB.innerHTML = tableHtml(r);
        ro.set('count', String(r.rows.length));
        ro.set('used', hex(r.used) + ' · ' + E.kb(r.used));
        ro.set('free', r.free >= 0 ? E.kb(r.free) : 'short by ' + E.kb(-r.free));
        ro.set('app', r.appMax > 0 ? E.kb(r.appMax) + (r.ota ? ' (the smaller of the two)' : '') : '—');
        ro.set('prog', r.appMax > 0 ? (m.fits ? 'fits, ' + Math.round(m.usePct * 100) + ' % of it' : 'too big by ' + E.kb(Math.max(0, m.progB - r.appMax))) : '—');
        ro.set('ota', m.otaOk ? 'possible' : r.ota ? 'needs an otadata partition' : 'not possible (one program partition)');
        ro.set('fs', m.fs ? E.kb(m.fs) : 'none');
        const t = [];
        if (r.errors.length) t.push(callout('warn', 'This table will not work', '<ul style="margin:4px 0 0;padding-left:18px">' + r.errors.map(e => '<li>' + esc(e) + '</li>').join('') + '</ul>'));
        if (m.warns.length) t.push(callout('warn', 'Worth a second look', '<ul style="margin:4px 0 0;padding-left:18px">' + m.warns.map(e => '<li>' + esc(e) + '</li>').join('') + '</ul>'));
        if (!r.errors.length) t.push(callout('tip', 'What this says', (m.otaOk ? 'Two program partitions of ' + E.kb(r.appMax) + ' allow over-the-air updates: a program of up to ' + E.kb(r.appMax) + ' can be sent while the old one keeps running.' : 'There is room for one program of up to ' + E.kb(r.appMax) + ', and no over-the-air update: a new program can only arrive over the cable.') + (m.fs ? ' ' + E.kb(m.fs) + ' is left for files.' : '') + (m.fits ? '' : ' Your program of ' + E.kb(m.progB) + ' does not fit.')));
        t.push('<p class="small muted" style="margin:10px 0 4px">The table as a file (<code>partitions.csv</code>): in the Arduino IDE put it in the sketch folder; in PlatformIO set <code>board_build.partitions = partitions.csv</code>; in ESP-IDF choose a custom partition table in the project configuration.</p><pre class="espout">' + esc(r.csv) + '</pre>');
        note.innerHTML = t.join('');
      },
      draw(c, W, Hh, C, m) {
        const sy = S();
        sy.text(c, 'The flash chip from address 0x0 (top) to the end of its ' + E.kb(m.r.flash), 14, 13, { align: 'left', size: 12, color: C.text2 });
        sy.layers(c, 12, 28, Math.max(100, W - 24), m.layers, { h: Math.max(160, Hh - 38), minRow: 19 });
      }
    });
  }
  let pApi = null;
  TABFN.partitions = partitions;

  /* ================================================================ 6. LEDs and strips */
  /* typical forward voltages at 10–20 mA by colour (a part's own datasheet wins) */
  const LED_COLOURS = { ir: { name: 'Infrared', vf: 1.3, hue: 330 }, red: { name: 'Red', vf: 2.0, hue: 4 }, yellow: { name: 'Yellow or amber', vf: 2.1, hue: 50 }, green: { name: 'Green', vf: 2.2, hue: 130 }, blue: { name: 'Blue', vf: 3.0, hue: 220 }, white: { name: 'White', vf: 3.1, hue: null } };
  const pinVerdict = (mA, supply) => {
    if (supply > 3.4) return { level: 'ok', text: 'The rail feeds the LED; the pin only switches a transistor or MOSFET (about 1 mA).' };
    if (mA <= 12) return { level: 'ok', text: 'Comfortable: well within what a pin can give.' };
    if (mA <= 20) return { level: 'warn', text: 'Within the default drive of about 20 mA, but near the limit; most LEDs are bright enough at far less.' };
    if (mA <= 40) return { level: 'bad', text: 'More than a pin should give (about 20 mA by default, 40 mA absolute maximum): switch the LED with a transistor.' };
    return { level: 'bad', text: 'Would destroy the pin: switch the LED with a transistor.' };
  };
  /* the LED with its resistor */
  M.led = function (v) {
    const vcc = v.supply, vf = v.vf, I = v.ma / 1000, head = vcc - vf, feasible = head > 0.05;
    const ideal = E.ledResistor(vcc, vf, I), rStd = feasible ? E.eSeries(ideal, v.series) : 0;
    const iAct = feasible && rStd > 0 ? head / rStd : 0, pR = iAct * iAct * rStd;
    const rating = [0.125, 0.25, 0.5, 1, 2, 5].find(x => x >= 2 * pR) || 5;
    return { vcc, vf, head, feasible, ideal, rStd, iAct, mA: iAct * 1000, pR, rating, pLed: vf * iAct, dropR: iAct * rStd, pin: pinVerdict(iAct * 1000, vcc), eff: vcc > 0 ? vf / vcc : 0 };
  };
  /* the voltage lost along a strip fed at k points (1 = one end, 2 = both ends, then evenly spread), at pixel j from the start (1 … n), each pixel drawing i amps over r ohms of rail */
  M.stripDrop = function (j, n, k, i, r) {
    if (k <= 1) return i * r * j * (2 * n + 1 - j) / 2;
    const L = n / (k - 1), jj = j % L, from = Math.min(jj, L - jj), h = L / 2;
    return i * r * from * (2 * h + 1 - from) / 2;
  };
  M.strip = function (v) {
    const n = Math.max(1, Math.round(v.n)), b = v.bright / 100, I = E.pixelCurrent(n, b, v.mAeach), Ifull = E.pixelCurrent(n, 1, v.mAeach);
    const i = I / 1000 / n, r = v.rail / 1000, k = Math.max(1, Math.round(v.feed));
    const h = k === 1 ? n : n / (2 * (k - 1)), drop = i * r * h * (h + 1) / 2;
    const hOk = (-1 + Math.sqrt(1 + 4 / Math.max(1e-9, i * r))) / 2, every = Math.max(2, Math.floor(2 * hOk));
    return { n, I, Ifull, supplyA: I / 1000 * 1.2, fullA: Ifull / 1000, power: I / 1000 * 5, fuseA: Ifull / 1000 * 1.25, i, r, k, drop, vEnd: Math.max(0, 5 - drop), every, feeds: Math.ceil(n / every) + 1, one: n <= every };
  };
  /* a pixel's colour when the supply sags: the blue and green LEDs need the most voltage, so white drifts to amber */
  const sagColour = (volts, b) => { const f = clamp((volts - 3.0) / 1.5, 0, 1), s = Math.max(0.12, b); return [255 * s * Math.min(1, 0.3 + f), 255 * s * Math.pow(f, 1.3), 255 * s * f * f]; };
  function leds(body) {
    const ledDefs = [
      head('An LED on a pin'),
      sel('supply', 'Fed from', [['A GPIO pin (3.3 V)', 3.3], ['The 5 V rail, through a transistor', 5], ['The 12 V rail, through a transistor', 12]], 3.3),
      sel('colour', 'Colour', Object.keys(LED_COLOURS).map(k => [LED_COLOURS[k].name + ': ' + LED_COLOURS[k].vf + ' V', k]), 'red'),
      sl('vf', 'Forward voltage', 0.8, 4, 2.0, { step: 0.05, fmt: v => g(v, 3) + ' V' }),
      sl('ma', 'Current wanted', 0.5, 40, 10, { step: 0.5, fmt: v => g(v, 3) + ' mA' }),
      sel('series', 'Resistor series', [['E6', 'E6'], ['E12', 'E12'], ['E24', 'E24']], 'E12'),
      head('An addressable strip (WS2812B and friends)'),
      sl('n', 'Number of LEDs', 1, 600, 60, { log: true, sig: 3, fmt: v => Math.max(1, Math.round(v)) }),
      sl('bright', 'Brightness', 1, 100, 50, { step: 1, fmt: v => Math.round(v) + ' %' }),
      sl('mAeach', 'Current of one LED at full white', 10, 100, 60, { step: 5, fmt: v => Math.round(v) + ' mA' }),
      sel('feed', 'Power fed in', [['From one end', 1], ['From both ends', 2], ['Both ends and the middle', 3], ['Both ends and every quarter', 5]], 1),
      sl('rail', 'Copper resistance, per LED, both rails', 2, 40, 8, { step: 1, fmt: v => Math.round(v) + ' mΩ' })
    ];
    const rows = [['res', 'Resistor needed'], ['std', 'Nearest standard value'], ['cur', 'Current with that resistor'], ['pr', 'Power in the resistor'], ['rate', 'Resistor rating to choose'], ['pled', 'Power in the LED'], ['pin', 'Can the pin supply it?']];
    let SP = null;
    build(body, {
      name: 'leds', aspect: 0.4, minH: 240, maxH: 420, controls: ledDefs, readout: rows,
      intro: 'An LED needs a <b>resistor</b> to set its current, and a strip of addressable LEDs needs a <b>supply</b> that can feed all of them. Both are one sum each: the picture shows where the voltage goes, and the checklist under the strip says what to build.',
      how: 'In the circuit the supply voltage is shared between the resistor and the LED: what the LED does not take, the resistor must. The dial shows the current against what a pin can give. For the strip, the picture shows the voltage along it: where the supply sags, white turns to amber, so power must be fed in at more than one place.',
      more: ['leds', 'resistors-in-esp-circuits', 'pin-current-limits', 'addressable-leds', 'powering-led-strips'],
      model: M.led,
      onChange(id, v, all, api) {
        if (id === 'colour' && LED_COLOURS[v]) api.setc('vf', LED_COLOURS[v].vf);
      },
      setup(api) {
        const under = api.lab.under;
        h3(under, 'The strip: current, supply and where the voltage goes');
        const s2 = stage2(under, 0.34, 210);
        SP = { m: null, loop: null, ro: null, list: null };
        SP.loop = H.kit.loop(() => { if (SP.m) { curW = s2.st.W; paintStrip(s2.st.begin(), s2.st.W, s2.st.H, kitc(), SP.m, api.ctl.values); } }, s2.box);
        s2.st.onResize(() => SP.loop.once());
        T.util.onTheme(() => SP.loop.once());
        SP.ro = H.kit.readout(under, [['cur', 'Current at this brightness'], ['full', 'Current at full white'], ['sup', 'Supply to choose'], ['pow', 'Power at this brightness'], ['drop', 'Voltage lost to the far end'], ['vend', 'Voltage at the far end'], ['inj', 'Power fed in at both ends of every']]);
        SP.list = ui.el('<div class="espnote"></div>'); under.appendChild(SP.list);
      },
      update(m, ro, note, v) {
        ro.set('res', m.feasible ? ohms(m.ideal) : '—');
        ro.set('std', m.feasible ? ohms(m.rStd) + ' (' + v.series + ')' : '—');
        ro.set('cur', m.feasible ? g(m.mA, 3) + ' mA' : 'it will not light');
        ro.set('pr', m.feasible ? eng(m.pR, 'W') : '—');
        ro.set('rate', m.feasible ? (m.rating >= 1 ? m.rating + ' W' : '1/' + Math.round(1 / m.rating) + ' W') + ' or more' : '—');
        ro.set('pled', eng(m.pLed, 'W') + ' (' + g(m.eff * 100, 2) + ' % of the supply)');
        ro.set('pin', v.supply > 3.4 ? 'not needed: ' + v.supply + ' V rail' : m.pin.level === 'ok' ? 'yes' : m.pin.level === 'warn' ? 'barely' : 'no');
        const t = [];
        if (!m.feasible) t.push(callout('warn', 'The supply is too low', 'The LED needs ' + g(m.vf, 3) + ' V, and the supply gives only ' + g(m.vcc, 3) + ' V: there is nothing left for a resistor. A blue or white LED cannot be fed from a 3.3 V pin; use the 5 V rail, or an LED with a lower forward voltage.'));
        else {
          if (m.head < 0.5) t.push(callout('warn', 'Very little headroom', 'Only ' + g(m.head, 2) + ' V is left for the resistor, so a small change in the LED\'s forward voltage (parts differ, and it falls as the LED warms) changes the current a lot. Prefer a higher supply, or accept an uneven brightness.'));
          t.push(callout(m.pin.level === 'bad' ? 'warn' : 'tip', 'What this says', 'The resistor drops ' + g(m.dropR, 3) + ' V and the LED ' + g(m.vf, 3) + ' V: ' + g(m.vcc, 2) + ' V in all. The nearest ' + v.series + ' value, ' + ohms(m.rStd) + ', gives ' + g(m.mA, 3) + ' mA and wastes ' + eng(m.pR, 'W') + ' as heat. ' + esc(m.pin.text)));
        }
        note.innerHTML = t.join('');
        // the strip
        const s = M.strip(v);
        SP.m = s;
        SP.ro.set('cur', amps(s.I));
        SP.ro.set('full', amps(s.Ifull) + ' (' + s.n + ' × ' + Math.round(v.mAeach) + ' mA + 1 mA each at rest)');
        SP.ro.set('sup', 'at least ' + g(s.supplyA, 3) + ' A at 5 V');
        SP.ro.set('pow', g(s.power, 3) + ' W');
        SP.ro.set('drop', g(s.drop, 3) + ' V');
        SP.ro.set('vend', g(s.vEnd, 3) + ' V');
        SP.ro.set('inj', s.one ? 'no need: one end is enough' : s.every + ' LEDs (' + s.feeds + ' feeds)');
        const items = [
          ['Supply', 'a 5 V supply of at least <b>' + g(s.supplyA, 3) + ' A</b> (the current at your brightness plus 20 %); for full white, ' + g(s.fullA * 1.2, 3) + ' A. A USB port gives only about 0.5 to 1.5 A' + (s.I > 500 ? ': <b>not enough here</b>' : '') + '.'],
          ['Fuse', 'a fuse of about ' + g(s.fuseA, 2) + ' A in the supply line: a short in a strip is a fire.'],
          ['Capacitor', 'a <b>1000 µF</b> capacitor (6.3 V or more) across the supply where the strip starts, to absorb the surge when the supply is connected.'],
          ['Data resistor', '<b>330 Ω</b> (anything from 300 to 500 Ω) in series with the data line, as close to the first LED as you can.'],
          ['Level shifter', 'the pixel wants a data high of about 0.7 × its supply, 3.5 V at 5 V, and the ESP gives 3.3 V: it often works, and sometimes does not. A 74AHCT125 or a similar level shifter makes it reliable.'],
          ['Common ground', 'the ground of the ESP32 and of the supply must be joined, and joined <i>first</i>.'],
          ['Feeding in power', s.one ? 'at your brightness one end is enough: the far end sags by only ' + g(s.drop, 2) + ' V.' : 'feed power in at both ends of every <b>' + s.every + ' LEDs</b> (about ' + s.feeds + ' feeds in all); from one end the far end would sag by ' + g(s.drop, 2) + ' V.']
        ];
        SP.list.innerHTML = '<ul class="ecchk">' + items.map(x => '<li><b>' + x[0] + ':</b> ' + x[1] + '</li>').join('') + '</ul>';
        SP.loop.once();
      },
      draw(c, W, Hh, C, m, v) {
        const sy = S(), y = Hh * 0.4, col = LED_COLOURS[v.colour] || LED_COLOURS.red;
        const x0 = 62, xr = W * 0.31, xl = W * 0.52, xg = W * 0.66, gx = W - 88;
        // the source, the resistor, the LED and ground
        sy.box(c, x0 - 44, y - 24, 88, 48, { label: v.supply < 3.4 ? 'GPIO pin' : 'power rail', sub: g(v.supply, 3) + ' V', color: C.muted });
        sy.wire(c, [[x0 + 44, y], [xr - 26, y]], { color: C.text2 });
        c.save(); c.strokeStyle = C.text2; c.lineWidth = 1.8; c.strokeRect(xr - 26, y - 9, 52, 18); c.restore();
        sy.text(c, m.feasible ? ohms(m.rStd) : '—', xr, y - 21, { size: 12.5, weight: 650, color: C.text });
        sy.text(c, m.feasible ? 'drops ' + g(m.dropR, 3) + ' V' : '', xr, y + 24, { size: 11, color: C.muted });
        sy.wire(c, [[xr + 26, y], [xl - 16, y]], { color: C.text2 });
        sy.led(c, xl, y, { color: col.hue == null ? '#f5f7ff' : col.hue, on: clamp(m.iAct / 0.02, 0, 1), r: 14 });
        sy.text(c, 'drops ' + g(m.vf, 3) + ' V', xl, y + 30, { size: 11, color: C.muted });
        sy.wire(c, [[xl + 16, y], [xg, y], [xg, y + 30]], { color: C.text2 });
        c.save(); c.strokeStyle = C.text2; c.lineWidth = 1.8; c.beginPath(); c.moveTo(xg - 14, y + 30); c.lineTo(xg + 14, y + 30); c.moveTo(xg - 9, y + 36); c.lineTo(xg + 9, y + 36); c.moveTo(xg - 4, y + 42); c.lineTo(xg + 4, y + 42); c.stroke(); c.restore();
        if (m.feasible) { H.kit.arrow(c, xr + 34, y - 11, xr + 76, y - 11, C.accent, 2); sy.text(c, g(m.mA, 3) + ' mA', xr + 56, y - 24, { size: 11, color: C.accent }); }
        // the working
        sy.text(c, m.feasible ? 'R = (' + g(m.vcc, 3) + ' V − ' + g(m.vf, 3) + ' V) ÷ ' + g(v.ma, 3) + ' mA = ' + ohms(m.ideal) + '  →  ' + ohms(m.rStd) + ' from the ' + v.series + ' series' : 'The LED needs more than the supply gives.', 14, Hh - 22, { align: 'left', size: 12, color: C.text2 });
        // the dial: the current against what a pin can give
        const rails = v.supply > 3.4;
        sy.gauge(c, gx, y + 6, Math.min(52, W * 0.09), clamp(m.mA / 40, 0, 1), { value: g(m.mA, 3) + ' mA', label: rails ? 'LED current' : 'pin current', zones: rails ? [[0, 0.5, C.ok], [0.5, 0.75, C.warn], [0.75, 1, C.bad]] : [[0, 0.3, C.ok], [0.3, 0.5, C.warn], [0.5, 1, C.bad]], color: m.pin.level === 'bad' && !rails ? C.bad : C.accent });
      }
    });
  }
  function paintStrip(c, W, Hh, C, m, v) {
    const sy = S(), cols = Math.min(60, m.n), left = 56, w = Math.max(80, W - left - 20), r = clamp(w / (cols * 2.7), 1.5, 9), b = v.bright / 100;
    sy.text(c, 'Seen from above: ' + m.n + ' LEDs' + (m.n > cols ? ' (' + cols + ' shown)' : '') + ', all white at ' + Math.round(v.bright) + ' %', left, 12, { align: 'left', size: 11.5, color: C.text2 });
    const cs = [];
    for (let i = 0; i < cols; i++) { const j = Math.max(1, Math.round((i + 0.5) * m.n / cols)); cs.push(sagColour(5 - M.stripDrop(j, m.n, m.k, m.i, m.r), b)); }
    sy.pixels(c, left, 26, cs, { r, gap: r * 0.7, cols });
    // the voltage along the strip
    const py = 26 + 2 * r + 36, ph = Math.max(40, Hh - py - 30), vlo = 3.0, vhi = 5.2, Y = u => py + ph - clamp((u - vlo) / (vhi - vlo), 0, 1) * ph;
    sy.text(c, 'Voltage along the strip', left, py - 10, { align: 'left', size: 11.5, color: C.text2 });
    c.save();
    c.strokeStyle = C.grid; c.lineWidth = 1;
    for (const u of [3, 4, 5]) { c.beginPath(); c.moveTo(left, Math.round(Y(u)) + 0.5); c.lineTo(left + w, Math.round(Y(u)) + 0.5); c.stroke(); sy.text(c, u + ' V', left - 8, Y(u), { align: 'right', size: 10 }); }
    c.setLineDash([4, 4]); c.strokeStyle = C.warn; c.beginPath(); c.moveTo(left, Y(4.5)); c.lineTo(left + w, Y(4.5)); c.stroke(); c.setLineDash([]);
    c.beginPath();
    const N = 100;
    for (let q = 0; q <= N; q++) { const j = Math.max(0, q / N * m.n), u = 5 - (j < 1 ? 0 : M.stripDrop(j, m.n, m.k, m.i, m.r)); if (q === 0) c.moveTo(left, Y(u)); else c.lineTo(left + w * q / N, Y(u)); }
    c.strokeStyle = C.accent; c.lineWidth = 2.2; c.stroke();
    // where the power comes in
    c.fillStyle = C.text2;
    const feeds = m.k <= 1 ? [0] : Array.from({ length: m.k }, (_, q) => q / (m.k - 1));
    for (const f of feeds) { const x = left + w * f; c.beginPath(); c.moveTo(x, py + ph + 2); c.lineTo(x - 6, py + ph + 12); c.lineTo(x + 6, py + ph + 12); c.closePath(); c.fill(); }
    c.restore();
    sy.text(c, 'power in', left, py + ph + 24, { align: 'left', size: 10.5, color: C.muted });
    sy.text(c, 'far end: ' + g(m.vEnd, 3) + ' V', left + w, py + ph + 24, { align: 'right', size: 11, color: m.vEnd < 4.5 ? C.warn : C.ok });
    sy.text(c, '4.5 V: below this the blue and green fade', left + w - 4, Y(4.5) - 8, { align: 'right', size: 10, color: C.warn });
  }
  TABFN.leds = leds;

  /* ================================================================ 7. LoRa */
  const BANDS = [['EU 868 MHz, the 1 % sub-bands', 0.01], ['EU 868 MHz, the 0.1 % sub-bands', 0.001], ['EU 868 MHz, the 10 % sub-band', 0.1], ['No duty limit (US 915 MHz has a dwell time instead)', 1]];
  M.lora = function (v) {
    const o = { sf: Math.round(v.sf), bw: v.bw, cr: Math.round(v.cr), preamble: Math.round(v.pre), header: !!v.hdr, crc: !!v.crc, bytes: Math.round(v.bytes) };
    const r = E.lora(o), all = [7, 8, 9, 10, 11, 12].map(sf => Object.assign({ sf }, E.lora(Object.assign({}, o, { sf }))));
    const perHour = E.dutyLimit(r.t, v.duty), mAs = v.txMa * r.t, uAh = mAs / 3.6;
    return { o, r, all, perHour, gap: r.t / Math.max(1e-9, v.duty), mAs, uAh, mJ: mAs * 3.3, per1000: uAh > 0 ? 1e6 / uAh : 0, tPay: r.nPayload * r.tSym };
  };
  function lora(body) {
    const defs = [
      sl('sf', 'Spreading factor', 7, 12, 9, { step: 1, fmt: v => 'SF' + Math.round(v) }),
      sel('bw', 'Bandwidth', [['62.5 kHz', 62.5e3], ['125 kHz', 125e3], ['250 kHz', 250e3], ['500 kHz', 500e3]], 125e3),
      sl('cr', 'Coding rate', 1, 4, 1, { step: 1, fmt: v => '4/' + (4 + Math.round(v)) }),
      sl('bytes', 'Payload', 1, 255, 12, { step: 1, fmt: v => Math.round(v) + ' bytes' }),
      sl('pre', 'Preamble', 6, 16, 8, { step: 1, fmt: v => Math.round(v) + ' symbols' }),
      { id: 'hdr', type: 'check', label: 'Explicit header (the receiver reads the length)', value: true },
      { id: 'crc', type: 'check', label: 'Payload CRC', value: true },
      head('The rules and the battery'),
      sel('duty', 'Where you transmit', BANDS, 0.01),
      sl('txMa', 'Current while transmitting', 10, 150, 100, { step: 5, fmt: v => Math.round(v) + ' mA' })
    ];
    const rows = [['tsym', 'One symbol lasts'], ['npay', 'Symbols in header, payload and CRC'], ['tair', 'Time on air'], ['bit', 'Bit rate'], ['sens', 'Receiver sensitivity'], ['ldro', 'Low data rate optimisation'], ['hour', 'Messages per hour allowed'], ['gap', 'At least between messages'], ['energy', 'Charge and energy per message'], ['n1000', 'Messages from 1000 mAh (sending alone)']];
    build(body, {
      name: 'lora', aspect: 0.95, minH: 440, maxH: 700, controls: defs, readout: rows,
      intro: 'LoRa trades speed for range: a higher <b>spreading factor</b> stretches every symbol, so the receiver can hear a weaker signal, but the message stays on the air longer. That time, not the bit rate, is what the duty-cycle rule and the battery both count.',
      how: 'The top picture is one symbol, an up-chirp, at each spreading factor on the same time scale: every step up doubles its length. The bars show the whole message on the air, and the strip at the bottom what it is made of. A spreading factor gains 2.5 dB of sensitivity and costs twice the air time.',
      more: ['lora-parameters', 'lora', 'lorawan', 'transmit-power-and-regulations'],
      model: M.lora,
      update(m, ro, note, v) {
        const r = m.r;
        ro.set('tsym', dur(r.tSym) + ' (' + g(1 / r.tSym, 3) + ' symbols a second)');
        ro.set('npay', Math.round(r.nPayload) + ' symbols = ' + dur(m.tPay) + ' (the preamble adds ' + dur(r.tPreamble) + ')');
        ro.set('tair', dur(r.t));
        ro.set('bit', eng(r.bitrate, 'bit/s'));
        ro.set('sens', g(r.sensitivity, 4) + ' dBm');
        ro.set('ldro', r.ldro ? 'on: a symbol is longer than 16 ms' : 'off');
        ro.set('hour', v.duty >= 1 ? 'no limit from the duty rule' : g(m.perHour, 4));
        ro.set('gap', v.duty >= 1 ? '—' : dur(m.gap));
        ro.set('energy', g(m.mAs, 3) + ' mA·s = ' + g(m.uAh, 3) + ' µAh = ' + g(m.mJ, 3) + ' mJ at 3.3 V');
        ro.set('n1000', g(m.per1000, 3));
        const step = m.o.sf > 7 ? m.r.sensitivity - m.all[m.o.sf - 8].sensitivity : 0, t = [];
        if (v.duty < 1 && m.perHour < 12) t.push(callout('warn', 'Few messages', 'The ' + (v.duty * 100) + ' % rule allows ' + g(m.perHour, 3) + ' messages an hour, one every ' + dur(m.gap) + '. A shorter message or a lower spreading factor gives more.'));
        t.push(callout('tip', 'What this says', 'A message of ' + m.o.bytes + ' bytes at SF' + m.o.sf + ' and ' + eng(v.bw, 'Hz') + ' is on the air for ' + dur(r.t) + ' and can be heard down to ' + g(r.sensitivity, 4) + ' dBm' + (step ? ' (' + g(step, 2) + ' dB better than SF' + (m.o.sf - 1) + ', at twice the air time)' : '') + '. It costs ' + g(m.uAh, 3) + ' µAh: a 1000 mAh cell could send about ' + g(m.per1000, 3) + ' of them if it did nothing else. Check the rules of your country: duty cycle, power and channels differ.'));
        note.innerHTML = t.join('');
      },
      draw(c, W, Hh, C, m, v) {
        const sy = S(), left = 82, right = 16, w = Math.max(80, W - left - right);
        // one symbol at each spreading factor, on the same time scale
        const top = 30, ch = Hh * 0.43, rh = ch / 6, tmax = Math.pow(2, 12) / v.bw;
        sy.text(c, 'One chirp at each spreading factor, on the same time scale (' + dur(tmax) + ' across)', 14, 13, { align: 'left', size: 11.5, color: C.text2 });
        m.all.forEach((a, i) => {
          const y = top + i * rh, on = a.sf === m.o.sf, n = Math.round(tmax / a.tSym), col = on ? C.accent : C.faint;
          c.save(); c.strokeStyle = col; c.lineWidth = on ? 2 : 1.2; c.globalAlpha = on ? 1 : 0.8;
          c.beginPath();
          for (let k = 0; k < n; k++) { const x0 = left + w * k / n, x1 = left + w * (k + 1) / n; c.moveTo(x0, y + rh - 5); c.lineTo(x1, y + 4); if (k < n - 1) c.lineTo(x1, y + rh - 5); }
          c.stroke(); c.restore();
          sy.text(c, 'SF' + a.sf, 14, y + rh / 2 - 6, { align: 'left', size: 12.5, weight: on ? 700 : 500, color: on ? C.accent : C.text2 });
          sy.text(c, dur(a.tSym), 14, y + rh / 2 + 8, { align: 'left', size: 10, color: C.muted });
        });
        // the air time of the whole message at each factor
        const by = top + ch + 36, bh = Hh * 0.26, bw = bh / 6, tmx = Math.max.apply(null, m.all.map(a => a.t));
        sy.text(c, 'Time on air of this message (' + m.o.bytes + ' bytes)', 14, by - 14, { align: 'left', size: 11.5, color: C.text2 });
        m.all.forEach((a, i) => {
          const y = by + i * bw, on = a.sf === m.o.sf, ww = Math.max(2, a.t / tmx * Math.max(40, w - 150));
          c.save(); c.fillStyle = on ? hue(212) : hue(212, 0.35); c.fillRect(left, y + 2, ww, bw - 5); c.restore();
          sy.text(c, 'SF' + a.sf, 14, y + bw / 2, { align: 'left', size: 11.5, color: on ? C.accent : C.text2, weight: on ? 700 : 500 });
          sy.text(c, dur(a.t) + (v.duty < 1 ? ' · ' + g(E.dutyLimit(a.t, v.duty), 3) + '/h' : ''), left + ww + 6, y + bw / 2, { align: 'left', size: 10.5, color: on ? C.text : C.muted });
        });
        // what the message is made of
        const fy = by + bh + 34;
        sy.text(c, 'The message on the air', 14, fy - 18, { align: 'left', size: 11.5, color: C.text2 });
        sy.frame(c, 14, fy, W - 28, [{ label: 'Preamble', size: m.r.tPreamble, value: dur(m.r.tPreamble), color: 212 }, { label: 'Header, payload and CRC', size: m.tPay, value: dur(m.tPay), color: 150 }], { h: 38 });
      }
    });
  }
  TABFN.lora = lora;

  /* ================================================================ 8. I2C pull-ups */
  M.i2c = function (v) {
    const cBus = 10e-12 + v.devices * v.pfDev * 1e-12 + v.cable * v.pfM * 1e-12;      // the pin and its traces, the modules, the wire
    const rs = [];
    if (v.own) rs.push(v.r);
    for (let k = 0; k < Math.round(v.mods); k++) rs.push(v.rmod);
    const none = rs.length === 0, reff = none ? 0 : 1 / rs.reduce((a, r) => a + 1 / r, 0);
    const lim = E.i2cPullup(v.vcc, cBus, v.speed, none ? 1e9 : reff);
    const tau = none ? 0 : reff * cBus, stiff = !none && reff < lim.min, weak = !none && reff > lim.max, ok = !none && !stiff && !weak;
    const good = lim.min < lim.max ? E.eSeries(Math.sqrt(lim.min * lim.max), 'E12') : 0;
    const tmax = Math.max(3 * lim.limit, 2.2 * (none ? 0 : lim.rise), 1e-9), pts = [];
    for (let k = 0; k <= 80; k++) { const t = tmax * k / 80; pts.push([t * 1e9, none ? 0 : v.vcc * (1 - Math.exp(-t / Math.max(1e-15, tau)))]); }
    return { cBus, rs, none, reff, lim, tau, stiff, weak, ok, good, pts, tmax, t30: -tau * Math.log(0.7), t70: -tau * Math.log(0.3), sink: none ? 0 : (v.vcc - 0.4) / reff };
  };
  function i2c(body) {
    let PL = null;
    const defs = [
      sel('vcc', 'Bus voltage', [['1.8 V', 1.8], ['3.3 V', 3.3], ['5 V', 5]], 3.3),
      sel('speed', 'Speed', [['Standard mode: 100 kHz', 100e3], ['Fast mode: 400 kHz', 400e3]], 100e3),
      head('The bus'),
      sl('devices', 'Modules on the bus', 1, 16, 3, { step: 1, fmt: v => Math.round(v) }),
      sl('pfDev', 'Capacitance of each module', 3, 30, 10, { step: 1, fmt: v => Math.round(v) + ' pF' }),
      sl('cable', 'Wire length', 0, 10, 0.3, { step: 0.05, fmt: v => g(v, 3) + ' m' }),
      sl('pfM', 'Capacitance of the wire, per metre', 30, 150, 60, { step: 5, fmt: v => Math.round(v) + ' pF/m' }),
      head('The pull-ups'),
      { id: 'own', type: 'check', label: 'I fit a pair of pull-ups myself', value: true },
      sl('r', 'My pull-up', 330, 100000, 4700, { log: true, sig: 3, fmt: ohms }),
      sl('mods', 'Modules with pull-ups of their own on board', 0, 8, 0, { step: 1, fmt: v => Math.round(v) }),
      sel('rmod', 'The pull-up on each of those', [['1 kΩ', 1000], ['2.2 kΩ', 2200], ['4.7 kΩ', 4700], ['10 kΩ', 10000]], 4700)
    ];
    const rows = [['cbus', 'Bus capacitance'], ['reff', 'Pull-up the bus sees (all in parallel)'], ['range', 'Allowed pull-up range'], ['rise', 'Rise time, 30 % to 70 %'], ['limit', 'Limit at this speed'], ['sink', 'Current a device must sink'], ['verdict', 'Verdict']];
    build(body, {
      name: 'i2c', aspect: 0.4, minH: 230, maxH: 400, controls: defs, readout: rows,
      intro: 'I2C lines are only pulled <i>low</i> by the devices; a <b>pull-up resistor</b> pulls them high again, against the capacitance of the wires and pins. Too large a resistor makes the edges too slow; too small a one is more than a device can pull down. Many breakout boards carry their own pull-ups, and they all add in parallel.',
      how: 'The bar is the range of pull-up values that works at this speed and capacitance, on a logarithmic scale; the markers show what you fitted and what the bus really sees. The graph is one rising edge: it must climb from 30 % to 70 % of the supply within the limit. A longer wire or more modules shrinks the green range.',
      more: ['i2c-pull-ups-and-bus-problems', 'i2c', 'capacitors-in-esp-circuits', 'i2c-addresses-and-scanning'],
      model: M.i2c,
      pre(lab) {
        h3(lab.under, 'One rising edge on SDA or SCL');
        PL = plotIn(lab.under, { x: { label: 'time (ns)', min: 0, max: 1000 }, y: { label: 'volts', min: 0 }, series: [] }, 220);
      },
      update(m, ro, note, v) {
        ro.set('cbus', g(m.cBus * 1e12, 3) + ' pF');
        ro.set('reff', m.none ? 'no pull-up at all' : ohms(m.reff) + ' (from ' + m.rs.length + ' in parallel)');
        ro.set('range', m.lim.min < m.lim.max ? ohms(m.lim.min) + ' to ' + ohms(m.lim.max) : 'none: ' + ohms(m.lim.min) + ' is more than the ' + ohms(m.lim.max) + ' allowed');
        ro.set('rise', m.none ? '—' : eng(m.lim.rise, 's'));
        ro.set('limit', eng(m.lim.limit, 's'));
        ro.set('sink', m.none ? '—' : g(m.sink * 1000, 3) + ' mA (a pin can sink 3 mA)');
        ro.set('verdict', m.none ? 'nothing works' : m.ok ? 'good' : m.stiff ? 'too strong: the low level is not low enough' : 'too weak: the edges are too slow');
        let t;
        if (m.none) t = callout('warn', 'No pull-up', 'Nothing pulls SDA and SCL high: the bus cannot work. Fit a pair of resistors, or use modules that carry them.');
        else if (m.stiff) t = callout('warn', 'Too many pull-ups in parallel', 'The ' + m.rs.length + ' pull-ups together make ' + ohms(m.reff) + ', below the ' + ohms(m.lim.min) + ' a device can pull down with 3 mA. Leave one pair on the bus and remove the others from the modules (a jumper or a solder pad on most boards).');
        else if (m.weak) t = callout('warn', 'The edges are too slow', 'With ' + g(m.cBus * 1e12, 3) + ' pF and ' + ohms(m.reff) + ' the rise takes ' + eng(m.lim.rise, 's') + ', over the ' + eng(m.lim.limit, 's') + ' allowed. ' + (m.good ? 'A pull-up of about ' + ohms(m.good) + ' would work; or shorten the wire, or slow the bus down to 100 kHz.' : 'No resistor can do it: reduce the capacitance (shorter wire, fewer modules) or lower the speed.'));
        else t = callout('tip', 'What this says', 'The bus sees ' + ohms(m.reff) + ' and a rise of ' + eng(m.lim.rise, 's') + ', inside the ' + eng(m.lim.limit, 's') + ' allowed. ' + (m.good ? 'The middle of the allowed range, ' + ohms(m.good) + ', leaves room both ways.' : ''));
        note.innerHTML = t;
        const C = kitc();
        PL.set({
          x: { label: 'time (ns)', min: 0, max: m.tmax * 1e9 }, y: { label: 'volts', min: 0, max: v.vcc * 1.05 },
          series: [{ pts: m.pts, width: 2.4, color: m.ok ? C.accent : C.warn, hover: false }],
          hlines: [{ y: 0.3 * v.vcc, label: '30 %', color: C.faint }, { y: 0.7 * v.vcc, label: '70 %', color: C.faint }],
          vlines: m.none ? [] : [{ x: m.t30 * 1e9, label: '30 %', color: C.faint }, { x: (m.t30 + m.lim.limit) * 1e9, label: 'the limit', color: m.ok ? C.ok : C.bad }],
          marks: m.none ? [] : [{ x: m.t70 * 1e9, y: 0.7 * v.vcc, label: 'rise ' + eng(m.lim.rise, 's'), color: m.ok ? C.ok : C.bad }]
        });
      },
      draw(c, W, Hh, C, m, v) {
        const sy = S(), left = 24, right = 24;
        // the bus: the ESP at the left, the modules along two lines
        const y1 = 34, y2 = 56, nMod = Math.min(8, Math.round(v.devices)), x0 = 90, x1 = W - right, step = (x1 - x0) / Math.max(1, nMod);
        sy.box(c, left, 20, 52, 54, { label: 'ESP', color: C.muted, size: 11 });
        sy.wire(c, [[left + 52, y1], [x1, y1]], { color: hue(150) }); sy.wire(c, [[left + 52, y2], [x1, y2]], { color: hue(212) });
        sy.text(c, 'SCL', x1 + 2, y1 - 8, { align: 'right', size: 9.5, color: hue(150) }); sy.text(c, 'SDA', x1 + 2, y2 + 9, { align: 'right', size: 9.5, color: hue(212) });
        for (let k = 0; k < nMod; k++) {
          const mx = x0 + step * (k + 0.5), has = k < Math.round(v.mods);
          sy.box(c, mx - 15, 70, 30, 24, { label: String(k + 1), color: has ? C.warn : C.muted, size: 10 });
          c.save(); c.fillStyle = C.muted; c.beginPath(); c.arc(mx - 6, y2, 2, 0, Math.PI * 2); c.arc(mx + 6, y1, 2, 0, Math.PI * 2); c.fill(); c.restore();
          if (has) sy.text(c, ohms(v.rmod), mx, 106, { size: 9, color: C.warn });
        }
        if (Math.round(v.devices) > nMod) sy.text(c, '+' + (Math.round(v.devices) - nMod), x1 - 8, 84, { size: 10, color: C.muted });
        if (v.own) sy.text(c, 'your pull-up ' + ohms(v.r), left, 9, { align: 'left', size: 10, color: C.accent });
        // the allowed range on a log scale
        const by = Math.max(150, Hh * 0.62), bh = 24, lo = 300, hi = 100000, w = W - left - right, X = r => left + clamp(Math.log(r / lo) / Math.log(hi / lo), 0, 1) * w;
        sy.text(c, 'Allowed pull-up range (log scale)', left, by + bh + 32, { align: 'left', size: 11.5, color: C.text2 });
        c.save(); c.fillStyle = C.surface2 || C.surface; c.fillRect(left, by, w, bh);
        if (m.lim.min < m.lim.max) { c.fillStyle = hue(150, 0.6); c.fillRect(X(m.lim.min), by, Math.max(1, X(m.lim.max) - X(m.lim.min)), bh); }
        c.strokeStyle = C.border2 || C.faint; c.strokeRect(left + 0.5, by + 0.5, w - 1, bh - 1);
        c.restore();
        for (const r of [1e3, 1e4, 1e5]) sy.text(c, ohms(r), X(r), by + bh + 12, { size: 10 });
        sy.text(c, m.lim.min < m.lim.max ? ohms(m.lim.min) + ' to ' + ohms(m.lim.max) : 'no value works', clamp((X(m.lim.min) + X(m.lim.max)) / 2, left + 70, left + w - 70), by + bh / 2, { size: 11, color: C.text, weight: 650 });
        const mark = (r, label, color, dy) => { const x = X(r); c.save(); c.fillStyle = color; c.beginPath(); c.moveTo(x, by - 1); c.lineTo(x - 6, by - 11); c.lineTo(x + 6, by - 11); c.closePath(); c.fill(); c.restore(); sy.text(c, label, clamp(x, left + 60, left + w - 60), by - 20 - dy, { size: 10.5, color }); };
        if (v.own) mark(v.r, 'yours', C.accent, 0);
        if (!m.none && m.rs.length > (v.own ? 1 : 0)) mark(m.reff, 'the bus sees ' + ohms(m.reff), m.ok ? C.ok : C.bad, 14);
        else if (!m.none && !v.own) mark(m.reff, 'the bus sees ' + ohms(m.reff), m.ok ? C.ok : C.bad, 0);
      }
    });
  }
  TABFN.i2c = i2c;

  /* ================================================================ 9. the power supply */
  /* the rail during a current burst: the supply (resistance rs) charges a capacitor c that feeds the load. v0 volts at rest, a burst of `amps` for `tb` seconds; the voltage at time t (t = 0 at the start of the burst).
     A first-order solution, local to this lab: the engine has the capacitor sum (holdupCap) but not the shape of the dip. */
  M.dip = function (v0, amps, rs, c, tb, t) {
    const tau = Math.max(1e-12, rs * c);
    if (t <= 0) return v0;
    const vEnd = v0 - amps * rs * (1 - Math.exp(-Math.min(t, tb) / tau));
    return t <= tb ? vEnd : v0 - (v0 - vEnd) * Math.exp(-(t - tb) / tau);
  };
  M.power = function (v) {
    const chip = E.chip(v.chip), vmin = chip && chip.vdd ? chip.vdd[0] : 3.0, I = v.load / 1000;
    const ldo = E.ldo(v.vin, v.vout, I), tj = v.ta + ldo.loss * v.theta, eff = v.buckEff / 100, pout = v.vout * I, buckLoss = pout * (1 / eff - 1);
    const iinBuck = v.vin > 0 ? pout / (v.vin * eff) * 1000 : 0;
    const burst = v.burst / 1000, tb = v.tb / 1000, need = E.holdupCap(burst, tb, v.dv), cBase = v.cbase * 1e-6, cWith = cBase + v.c * 1e-6;
    const tauW = v.rs * cWith, tEnd = tb + Math.max(tb, 4 * tauW), t0 = -0.25 * tb, pts0 = [], pts1 = [];
    for (let k = 0; k <= 140; k++) {
      const t = t0 + (tEnd - t0) * k / 140;
      pts0.push([t * 1000, M.dip(v.vout, burst, v.rs, cBase, tb, t)]);
      pts1.push([t * 1000, M.dip(v.vout, burst, v.rs, cWith, tb, t)]);
    }
    const low0 = M.dip(v.vout, burst, v.rs, cBase, tb, tb), low1 = M.dip(v.vout, burst, v.rs, cWith, tb, tb);
    return { chip, vmin, ldo, tj, eff, pout, buckLoss, iinBuck, need, needStd: E.eSeries(need * 1e6, 'E6'), low0, low1, pts0, pts1, t0: t0 * 1000, tEnd: tEnd * 1000, cWith, tb: tb * 1000, headroom: v.vin - v.vout };
  };
  function power(body) {
    const chips = chipsWith(c => c.vdd);
    if (!chips.length) { body.innerHTML = '<p class="muted">The chip catalogue is not loaded.</p>'; return; }
    let PL = null;
    const defs = [
      sel('chip', 'Chip (its minimum supply)', chipOpts(chips), (chips.find(c => c.id === 'esp32') || chips[0]).id),
      head('A regulator for the 3.3 V rail'),
      sl('vin', 'Input voltage', 3.4, 24, 5, { step: 0.1, fmt: v => g(v, 3) + ' V' }),
      sl('vout', 'Output voltage', 1.8, 5, 3.3, { step: 0.1, fmt: v => g(v, 3) + ' V' }),
      sl('load', 'Average load current', 1, 2000, 150, { log: true, sig: 3, fmt: fmtA }),
      sl('buckEff', 'Efficiency of a buck converter', 60, 98, 90, { step: 1, fmt: v => Math.round(v) + ' %' }),
      sel('theta', 'Package of the LDO', [['SOT-23: about 200 °C/W', 200], ['SOT-223: about 70 °C/W', 70], ['D-Pak on some copper: about 40 °C/W', 40]], 70),
      sl('ta', 'Air temperature', 0, 60, 25, { step: 1, fmt: v => Math.round(v) + ' °C' }),
      head('A transmit burst on the rail'),
      sl('burst', 'Current of the burst', 20, 1000, 350, { log: true, sig: 3, fmt: fmtA }),
      sl('tb', 'Length of the burst', 0.05, 2000, 0.5, { log: true, sig: 3, fmt: v => dur(v / 1000) }),
      sl('dv', 'Droop you can allow', 0.05, 1, 0.2, { step: 0.05, fmt: v => g(v, 3) + ' V' }),
      sl('rs', 'Resistance of the supply and wiring', 0.05, 30, 2, { log: true, sig: 2, fmt: v => g(v, 2) + ' Ω' }),
      sl('cbase', 'Capacitance already on the board', 1, 100, 10, { log: true, sig: 2, fmt: v => g(v, 2) + ' µF' }),
      sl('c', 'Capacitor you add', 1, 10000, 470, { log: true, sig: 3, fmt: v => g(v, 3) + ' µF' }),
      sl('bod', 'Brownout level of the chip', 2.0, 3.0, 2.43, { step: 0.01, fmt: v => g(v, 3) + ' V' })
    ];
    const rows = [['ldo', 'LDO: heat'], ['eff', 'LDO: efficiency'], ['tj', 'LDO: temperature of the chip'], ['buck', 'Buck: heat'], ['iin', 'Input current: LDO / buck'], ['need', 'Capacitor to ride the burst'], ['std', 'Nearest standard value (E6)'], ['low0', 'Lowest voltage on the board alone'], ['low1', 'Lowest voltage with your capacitor'], ['verdict', 'Against the brownout level']];
    build(body, {
      name: 'power', aspect: 0.4, minH: 230, maxH: 400, controls: defs, readout: rows,
      intro: 'The 3.3 V rail has two jobs: to deliver the average, and to hold up through the bursts. A <b>linear regulator</b> (LDO) throws away every volt it drops as heat; a <b>buck converter</b> does not. A transmit burst of hundreds of milliamps for a few milliseconds is carried by a <b>capacitor</b>, or the rail sags below the brownout level and the chip resets.',
      how: 'The bars show where the power goes: what the load uses, and what each regulator loses. The graph is the rail during one burst: the supply resistance makes it dip, the capacitor flattens the dip, and the red line is where the chip resets. The capacitor sum, C = I × t ÷ ΔV, ignores the supply: the curve does not.',
      more: ['regulators-ldo-and-buck', 'current-peaks-and-capacitors', 'brownout', 'the-3v3-rail', 'usb-power'],
      model: M.power,
      pre(lab) {
        h3(lab.under, 'The rail during one burst');
        PL = plotIn(lab.under, { x: { label: 'time (ms)', min: 0, max: 10 }, y: { label: 'volts', min: 0, max: 4 }, series: [], legend: true }, 240);
      },
      update(m, ro, note, v) {
        ro.set('ldo', eng(m.ldo.loss, 'W') + ' (drops ' + g(Math.max(0, m.headroom), 3) + ' V)');
        ro.set('eff', pct(m.ldo.eff));
        ro.set('tj', g(m.tj, 3) + ' °C (limit about 125 °C)');
        ro.set('buck', eng(m.buckLoss, 'W') + ' at ' + Math.round(v.buckEff) + ' %');
        ro.set('iin', amps(v.load) + ' / ' + amps(m.iinBuck));
        ro.set('need', eng(m.need, 'F') + ' for ' + amps(v.burst) + ' × ' + dur(v.tb / 1000) + ' within ' + g(v.dv, 2) + ' V');
        ro.set('std', eng(m.needStd * 1e-6, 'F'));
        ro.set('low0', g(m.low0, 3) + ' V');
        ro.set('low1', g(m.low1, 3) + ' V');
        ro.set('verdict', m.low1 > v.bod ? (m.low1 > m.vmin ? 'safe: above the brownout level and the minimum supply' : 'above the brownout level, but below the ' + g(m.vmin, 2) + ' V the data sheet asks for') : 'the chip resets');
        const t = [];
        if (m.headroom < 0.3) t.push(callout('warn', 'No room for an LDO', 'The input is only ' + g(m.headroom, 2) + ' V above the output, and an LDO needs its dropout voltage (a few tenths of a volt, more at high current) to regulate: the rail will sag. Use a lower-dropout part, or a boost or buck–boost converter.'));
        if (m.tj > 110) t.push(callout('warn', 'The LDO would overheat', 'It burns ' + eng(m.ldo.loss, 'W') + ' and its chip reaches about ' + g(m.tj, 3) + ' °C. A buck converter would lose only ' + eng(m.buckLoss, 'W') + ', and take ' + amps(m.iinBuck) + ' instead of ' + amps(v.load) + ' from the input.'));
        else if (m.headroom >= 0.3) t.push(callout('tip', 'Heat and current', 'The LDO wastes ' + pct(1 - m.ldo.eff) + ' of its input as heat (' + eng(m.ldo.loss, 'W') + '); a buck converter at ' + Math.round(v.buckEff) + ' % would waste ' + eng(m.buckLoss, 'W') + ' and draw ' + amps(m.iinBuck) + ' from the input instead of ' + amps(v.load) + '. On a battery that difference is life; on a USB supply it is only warmth.'));
        if (m.low1 <= v.bod) t.push(callout('warn', 'It still resets', 'With ' + eng(m.cWith, 'F') + ' on the rail the voltage still falls to ' + g(m.low1, 3) + ' V, below the brownout level of ' + g(v.bod, 3) + ' V. Add capacitance (the sum says ' + eng(m.need, 'F') + ' to hold ' + g(v.dv, 2) + ' V), or lower the supply resistance: a thicker wire, a stronger cell.'));
        else t.push(callout('tip', 'What this says', 'Without help the burst pulls the rail down to ' + g(m.low0, 3) + ' V; with ' + eng(m.cWith, 'F') + ' it stays above ' + g(m.low1, 3) + ' V. Place the capacitor close to the module, and choose a low-ESR type: a large electrolytic with a ceramic beside it.'));
        note.innerHTML = t.join('');
        const C = kitc(), ymin = Math.min(v.bod, m.vmin, m.low0) - 0.25, ymax = v.vout + 0.15;
        PL.set({
          x: { label: 'time (ms)', min: m.t0, max: m.tEnd, fmt: x => g(x, 2) }, y: { label: 'volts', min: ymin, max: ymax, fmt: y => g(y, 3) },
          series: [{ pts: m.pts0, label: 'board alone, ' + eng(v.cbase * 1e-6, 'F'), color: C.warn, width: 2.2 }, { pts: m.pts1, label: 'with your capacitor, ' + eng(m.cWith, 'F'), color: C.ok, width: 2.6 }],
          hlines: [{ y: v.bod, label: 'brownout level: the chip resets below this', color: C.bad }, { y: m.vmin, label: 'minimum supply of the chip', color: C.faint }],
          vlines: [{ x: 0, label: 'burst starts', color: C.faint }, { x: m.tb, label: 'ends', color: C.faint }],
          marks: [{ x: m.tb, y: m.low1, label: g(m.low1, 3) + ' V', color: C.ok }]
        });
      },
      draw(c, W, Hh, C, m, v) {
        const sy = S(), left = 22, gw = clamp(W * 0.3, 120, 220), bw = Math.max(100, W - left - gw - 50), top = 36;
        const total = Math.max(m.pout + m.ldo.loss, m.pout + m.buckLoss, 1e-6), X = p => clamp(p / total, 0, 1) * bw;
        sy.text(c, 'Where the power goes', left, 14, { align: 'left', size: 12, color: C.text2 });
        const row = (y, label, use, lose, loseCol) => {
          sy.text(c, label, left, y, { align: 'left', size: 11.5, weight: 650, color: C.text });
          c.save(); c.fillStyle = hue(150, 0.8); c.fillRect(left, y + 8, X(use), 22); c.fillStyle = loseCol; c.fillRect(left + X(use), y + 8, X(lose), 22); c.restore();
          sy.text(c, 'load ' + eng(use, 'W') + ' · lost ' + eng(lose, 'W') + ' (' + pct(use + lose > 0 ? lose / (use + lose) : 0) + ')', left + X(use) + X(lose) + 6, y + 19, { align: 'left', size: 10.5, color: C.text2 });
        };
        row(top, 'Linear regulator (LDO)', m.pout, m.ldo.loss, hue(8, 0.85));
        row(top + 66, 'Buck converter', m.pout, m.buckLoss, hue(40, 0.85));
        sy.text(c, 'Input current: ' + amps(v.load) + ' with the LDO, ' + amps(m.iinBuck) + ' with the buck converter', left, top + 126, { align: 'left', size: 11.5, color: C.text2 });
        sy.gauge(c, W - gw / 2 - 14, Hh * 0.46, Math.min(gw * 0.42, Hh * 0.28), clamp(m.tj / 150, 0, 1), { value: Math.round(m.tj) + ' °C', label: 'LDO chip temperature', zones: [[0, 0.5, C.ok], [0.5, 0.75, C.warn], [0.75, 1, C.bad]], color: m.tj > 110 ? C.bad : C.accent });
      }
    });
  }
  TABFN.power = power;

  /* ================================================================ 10. timing and small conversions */
  const R32 = 4294967296;
  const MODES = [['millis', 'millis() and its rollover'], ['baud', 'Baud rate and the time of a byte'], ['timer', 'Hardware timer alarm'], ['ticks', 'FreeRTOS ticks'], ['buffer', 'Sample rate, buffer and memory'], ['flash', 'Flash wear']];
  const FRAMES = { '8N1': { bits: 8, parity: 'none', stop: 1 }, '8E1': { bits: 8, parity: 'even', stop: 1 }, '8O1': { bits: 8, parity: 'odd', stop: 1 }, '8N2': { bits: 8, parity: 'none', stop: 2 }, '7E1': { bits: 7, parity: 'even', stop: 1 }, '7E2': { bits: 7, parity: 'even', stop: 2 } };
  const SAMPLE_BYTES = { b8: ['8 bits: 1 byte', 1], b16: ['12 or 16 bits: 2 bytes', 2], b24: ['24 bits in a 32-bit slot: 4 bytes', 4], f32: ['32-bit float: 4 bytes', 4] };
  const plain = x => (Number.isFinite(x) ? x.toFixed(9).replace(/0+$/, '').replace(/\.$/, '') : '0');
  M.timing = function (v) {
    const out = { mode: v.mode };
    // millis(): the rollover, and why subtraction survives it
    const before = Math.round(v.m_before), delta = Math.round(v.m_delta), then = (R32 - before) % R32, now = (then + delta) % R32, deadline = (then + delta) % R32;
    const upMs = Math.floor(v.m_days * 86400000), left = E.millisRollover - (v.m_days % E.millisRollover);
    out.mil = { before, delta, then, now, deadline, wraps: before < delta, elapsed: E.elapsed32(now, then), early: then > deadline, upNow: upMs % R32, left, micros: R32 / 1e6 };
    // the UART frame of a byte
    const fr = FRAMES[v.b_frame] || FRAMES['8N1'], u = E.proto.uart(0x41, Object.assign({ baud: v.b_baud, t: 0 }, fr)), nb = Math.round(v.b_n);
    const actual = E.uartActualBaud(v.b_baud), bits = u.bits.length;
    out.baud = { u, fr, bits, ft: u.t1, bps: 1 / u.t1, eff: fr.bits / bits, nb, tn: nb * u.t1, actual, err: E.baudError(v.b_baud, actual, bits) };
    // a timer alarm
    const tm = E.timer(v.t_period, v.t_tick);
    out.timer = Object.assign({}, tm, { err: v.t_period > 0 ? (tm.actual - v.t_period) / v.t_period : 0, divOk: tm.divider >= 2 && tm.divider <= 65536, zero: tm.count < 1 });
    // FreeRTOS ticks
    const tk = E.ticks(v.k_ms, v.k_hz);
    out.ticks = { ticks: tk, got: tk * 1000 / v.k_hz, one: 1000 / v.k_hz, zero: tk < 1 };
    // samples in memory
    const chip = E.chip(v.s_chip), per = (SAMPLE_BYTES[v.s_fmt] || SAMPLE_BYTES.b16)[1], samples = v.s_fs * v.s_secs, bytes = samples * per * Math.round(v.s_ch), ram = chip ? chip.sram * 1024 : 0;
    out.buf = { samples, bytes, ram, share: ram > 0 ? bytes / ram : 0, per, chip, nyq: v.s_fs / 2, rate: v.s_fs * per * Math.round(v.s_ch) };
    // flash wear
    const yrs = E.flashLife(v.f_wpd, v.f_sect, v.f_end);
    out.flash = { yrs, days: yrs * 365, perSector: v.f_wpd / Math.max(1, v.f_sect), total: v.f_end * Math.max(1, v.f_sect) };
    return out;
  };
  M.timerCode = function (t, v) {
    if (t.zero || !t.divOk) return null;
    const ms = v.t_period * 1000, hzTick = Math.round(v.t_tick), pyArg = ms >= 1 ? 'period=' + Math.round(ms) : 'freq=' + Math.max(1, Math.round(1 / v.t_period)), secs = plain(v.t_period);
    return {
      title: 'A timer that fires every ' + dur(t.actual),
      about: 'The timer counts at ' + hz(t.tickHz) + ' and fires when it reaches **' + t.count + '**. The interrupt only counts; `loop()` does the work.',
      blocks: 'when timer fires  // every ' + secs + ' seconds\n  change [ticks v] by (1)',
      cpp: 'hw_timer_t *timer = nullptr;\nvolatile uint32_t ticks = 0;\n\nvoid IRAM_ATTR onTimer() {\n  ticks++;\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  timer = timerBegin(' + hzTick + ');                  // tick frequency in Hz\n  timerAttachInterrupt(timer, &onTimer);\n  timerAlarm(timer, ' + t.count + ', true, 0);          // alarm value, auto-reload, forever\n}\n\nvoid loop() {\n  static uint32_t last = 0;\n  if (ticks != last) { last = ticks; Serial.println(last); }\n}',
      py: 'from machine import Timer\n\ndef tick(t):\n    print("tick")\n\ntim = Timer(0)\ntim.init(' + pyArg + ', mode=Timer.PERIODIC, callback=tick)    # a software timer: good to about a millisecond',
      notes: ['MicroPython\'s Timer takes a period in milliseconds or a frequency in Hz and is not a microsecond clock; the C++ timer is.']
    };
  };
  function timing(body, params) {
    const chips = chipsWith(c => c.sram > 0);
    const want = params && params.get ? params.get('c') : null;          // #/tools/espcalc/timing?c=baud opens that calculator
    if (want && MODES.some(m => m[0] === want)) (saved.timing = saved.timing || {}).mode = want;
    const defs = [
      sel('mode', 'Calculate', MODES.map(m => [m[1], m[0]]), 'millis'),
      // millis()
      sl('m_before', 'The first reading, before the rollover', 0, 20000, 300, { step: 10, fmt: v => Math.round(v) + ' ms' }),
      sl('m_delta', 'The interval you wait', 1, 60000, 800, { log: true, sig: 3, fmt: v => Math.round(v) + ' ms' }),
      sl('m_days', 'Uptime of the board', 0, 100, 20, { step: 0.1, fmt: v => g(v, 3) + ' days' }),
      // baud
      sel('b_baud', 'Baud rate', [300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600, 1500000, 2000000].map(b => [b + ' baud', b]), 115200),
      sel('b_frame', 'Frame', [['8 data bits, no parity, 1 stop (8N1)', '8N1'], ['8 bits, even parity, 1 stop (8E1)', '8E1'], ['8 bits, odd parity, 1 stop (8O1)', '8O1'], ['8 bits, no parity, 2 stop (8N2)', '8N2'], ['7 bits, even parity, 1 stop (7E1)', '7E1'], ['7 bits, even parity, 2 stop (7E2)', '7E2']], '8N1'),
      sl('b_n', 'Bytes to send', 1, 100000, 100, { log: true, sig: 3, fmt: v => Math.round(v) }),
      // timer
      sl('t_period', 'Period of the alarm', 0.000001, 60, 0.001, { log: true, sig: 3, fmt: v => dur(v) }),
      sel('t_tick', 'Tick of the timer', [['10 MHz: 0.1 µs', 10e6], ['1 MHz: 1 µs', 1e6], ['100 kHz: 10 µs', 100e3], ['10 kHz: 0.1 ms', 10e3], ['2 kHz: 0.5 ms (about the slowest)', 2e3]], 1e6),
      // ticks
      sl('k_ms', 'A delay of', 0.1, 60000, 15, { log: true, sig: 3, fmt: v => dur(v / 1000) }),
      sel('k_hz', 'Tick rate of the scheduler', [['Arduino-ESP32: 1000 Hz (1 ms)', 1000], ['ESP-IDF default: 100 Hz (10 ms)', 100]], 1000),
      // buffers
      sl('s_fs', 'Sample rate', 100, 192000, 16000, { log: true, sig: 3, fmt: hz }),
      sel('s_fmt', 'Size of a sample', Object.keys(SAMPLE_BYTES).map(k => [SAMPLE_BYTES[k][0], k]), 'b16'),
      sl('s_ch', 'Channels', 1, 8, 1, { step: 1, fmt: v => Math.round(v) }),
      sl('s_secs', 'Length of the recording', 0.01, 600, 1, { log: true, sig: 3, fmt: v => dur(v) }),
      sel('s_chip', 'Memory of the chip', chipOpts(chips), (chips.find(c => c.id === 'esp32-s3') || chips[0] || { id: '' }).id),
      // flash
      sl('f_wpd', 'Writes of the same data per day', 1, 1000000, 1440, { log: true, sig: 3, fmt: v => g(v, 3) }),
      sl('f_sect', 'Sectors the writes are spread over', 1, 1000, 5, { log: true, sig: 3, fmt: v => Math.max(1, Math.round(v)) }),
      sel('f_end', 'Endurance of a sector', [['10 000 erase cycles (worst case)', 1e4], ['100 000 erase cycles (typical)', 1e5]], 1e5)
    ];
    const GROUPS = { millis: ['m_before', 'm_delta', 'm_days'], baud: ['b_baud', 'b_frame', 'b_n'], timer: ['t_period', 't_tick'], ticks: ['k_ms', 'k_hz'], buffer: ['s_fs', 's_fmt', 's_ch', 's_secs', 's_chip'], flash: ['f_wpd', 'f_sect', 'f_end'] };
    const RO_ROWS = {
      millis: [['roll', 'millis() rolls over after'], ['micros', 'micros() rolls over after'], ['up', 'millis() reads, at your uptime'], ['left', 'Next rollover in'], ['then', 'First reading'], ['now', 'Second reading'], ['el', 'now − then, as unsigned numbers'], ['wrong', 'The wrong test: now > then + interval']],
      baud: [['bits', 'Bits on the wire per byte'], ['ft', 'One byte takes'], ['bps', 'Bytes per second'], ['eff', 'Share of the wire that is data'], ['tn', 'Time to send the bytes'], ['act', 'The baud rate the chip really makes'], ['err', 'Error of that rate']],
      timer: [['div', 'Divider from the 80 MHz clock'], ['res', 'One tick'], ['cnt', 'Alarm value, in ticks'], ['act', 'Period you really get'], ['err', 'Rounding error'], ['ok', 'This setting']],
      ticks: [['tk', 'Ticks'], ['one', 'One tick lasts'], ['got', 'Delay you really get'], ['err', 'Rounding']],
      buffer: [['n', 'Samples'], ['bytes', 'Memory needed'], ['ram', 'Internal RAM of the chip'], ['share', 'Share of that RAM'], ['nyq', 'Highest tone it can capture'], ['rate', 'Data rate to move']],
      flash: [['yrs', 'Life of the flash'], ['per', 'Writes per sector, per day'], ['tot', 'Writes the sectors can take']]
    };
    const RO = {};
    build(body, {
      name: 'timing', aspect: 0.5, minH: 330, maxH: 520, controls: defs, readout: null,
      intro: 'Small conversions people keep needing, one at a time. Choose what to calculate; the picture shows the idea, the figures give the numbers, and where a program helps it is written out in three languages.',
      how: 'Each picture is the idea of its calculator: the ring is the 32-bit counter of millis(), the frame is a byte on the wire, the boxes are a timer dividing its clock, the tracks are a delay rounded to ticks, the bar is a buffer against the memory, and the scale is the life of a flash sector.',
      more: ['hardware-timers', 'software-timers', 'timeouts-and-timed-states', 'why-an-rtos', 'uart-on-the-esp', 'flash-wear'],
      code: (m, v) => (v.mode === 'timer' ? [M.timerCode(m.timer, v)].filter(Boolean) : []),
      model: M.timing,
      pre(lab) { for (const k of Object.keys(RO_ROWS)) RO[k] = H.kit.readout(lab.under, RO_ROWS[k]); },
      setup(api) { showMode(api.ctl, api.ctl.values.mode); },
      onChange(id, v, all, api) { if (id === 'mode') showMode(api, v); },
      update(m, ro, note, v) {
        for (const k of Object.keys(RO)) RO[k].show(k === v.mode);
        const t = [];
        if (v.mode === 'millis') {
          const a = m.mil, r = RO.millis;
          r.set('roll', dur(R32 / 1000) + ' (2³² milliseconds)');
          r.set('micros', dur(a.micros) + ' (2³² microseconds)');
          r.set('up', Math.floor(v.m_days * 86400000) % R32 + ' (after ' + g(v.m_days, 3) + ' days)');
          r.set('left', dur(a.left * 86400));
          r.set('then', a.then + (a.before ? ' (' + a.before + ' ms before the rollover)' : ''));
          r.set('now', a.now + ' (' + a.delta + ' ms later' + (a.wraps ? ', after the wrap' : '') + ')');
          r.set('el', a.elapsed + ' ms: correct');
          r.set('wrong', a.wraps ? 'the deadline ' + a.deadline + ' is already behind the first reading: it fires at once' : 'no rollover between the readings: this works too');
          t.push(callout(a.wraps ? 'warn' : 'tip', a.wraps ? 'A rollover in the middle' : 'What this says', a.wraps
            ? 'The first reading is ' + a.before + ' ms before the counter wraps and the interval is ' + a.delta + ' ms, so the second reading is ' + a.now + '. Comparing against a deadline (<code>then + interval</code>) breaks, because the deadline itself wraps to ' + a.deadline + '. Subtracting always works: <code>now − then</code> is ' + a.elapsed + ' ms, even across the wrap, as long as both are unsigned 32-bit numbers (<code>unsigned long</code>, <code>uint32_t</code>).'
            : 'The counter wraps every ' + g(E.millisRollover, 4) + ' days. Write every wait as <code>millis() − start &gt;= interval</code> with unsigned numbers, and it makes no difference where the wrap falls. Move the first reading closer to the rollover than the interval to see the other way break.'));
        } else if (v.mode === 'baud') {
          const a = m.baud, r = RO.baud;
          r.set('bits', a.bits + ' (1 start + ' + a.fr.bits + ' data' + (a.fr.parity !== 'none' ? ' + 1 parity' : '') + ' + ' + a.fr.stop + ' stop)');
          r.set('ft', dur(a.ft));
          r.set('bps', g(a.bps, 4));
          r.set('eff', pct(a.eff));
          r.set('tn', dur(a.tn));
          r.set('act', hz(a.actual).replace('Hz', 'baud'));
          r.set('err', (a.err.errorPct >= 0 ? '+' : '−') + g(Math.abs(a.err.errorPct), 3) + ' % ' + (a.err.ok ? '(fine)' : '(too far: errors)'));
          t.push(callout(a.err.ok ? 'tip' : 'warn', 'What this says', 'At ' + v.b_baud + ' baud every bit lasts ' + dur(1 / v.b_baud) + ', and a byte needs ' + a.bits + ' bits, so ' + dur(a.ft) + ': ' + g(a.bps, 4) + ' bytes a second, of which ' + pct(a.eff) + ' of the wire time carries data. Sending ' + a.nb + ' bytes takes ' + dur(a.tn) + '. Both ends must agree on the rate within a few percent.' + (a.err.ok ? '' : ' The chip\'s divider cannot make this rate closely enough.')));
        } else if (v.mode === 'timer') {
          const a = m.timer, r = RO.timer;
          r.set('div', g(a.divider, 5) + (a.divOk ? '' : ' (outside 2 to 65536)'));
          r.set('res', dur(a.resolution));
          r.set('cnt', a.zero ? '0: shorter than one tick' : String(a.count));
          r.set('act', a.zero ? '—' : dur(a.actual));
          r.set('err', a.zero ? '—' : (a.err >= 0 ? '+' : '−') + g(Math.abs(a.err) * 100, 3) + ' %');
          r.set('ok', a.zero ? 'impossible: use a faster tick' : a.divOk ? 'possible' : 'impossible: this tick needs a divider outside 2 to 65536');
          if (a.zero) t.push(callout('warn', 'Shorter than one tick', 'The alarm period ' + dur(v.t_period) + ' is shorter than one tick of ' + dur(a.resolution) + '. Choose a faster tick.'));
          else t.push(callout(a.divOk ? 'tip' : 'warn', 'What this says', 'A timer ticking at ' + hz(a.tickHz) + ' (the 80 MHz clock divided by ' + g(a.divider, 5) + ') reaches ' + a.count + ' after ' + dur(a.actual) + (Math.abs(a.err) > 1e-6 ? ', ' + g(Math.abs(a.err) * 100, 2) + ' % off the ' + dur(v.t_period) + ' you wanted: one tick is the finest step' : ', exactly what you asked for') + '. The divider can only be a whole number from 2 to 65536 on the classic ESP32 (other chips differ a little), so the slowest tick is about 1.2 kHz.'));
        } else if (v.mode === 'ticks') {
          const a = m.ticks, r = RO.ticks;
          r.set('tk', String(a.ticks));
          r.set('one', dur(a.one / 1000));
          r.set('got', a.zero ? 'none: the task does not wait' : dur(a.got / 1000));
          r.set('err', a.zero ? 'the whole delay is lost' : g(v.k_ms - a.got, 3) + ' ms short');
          t.push(callout(a.zero ? 'warn' : 'tip', a.zero ? 'Less than one tick' : 'What this says', a.zero
            ? 'A delay of ' + dur(v.k_ms / 1000) + ' is less than one tick of ' + dur(a.one / 1000) + ' at this rate, so <code>pdMS_TO_TICKS()</code> gives 0 and <code>vTaskDelay(0)</code> returns at once. Use a faster tick, or a delay of a whole number of ticks.'
            : '<code>pdMS_TO_TICKS(' + g(v.k_ms, 3) + ')</code> is ' + a.ticks + ' ticks of ' + dur(a.one / 1000) + ': the task waits ' + dur(a.got / 1000) + '. The conversion rounds down, and the delay can be up to one tick longer in practice because the first tick is already partly over.'));
        } else if (v.mode === 'buffer') {
          const a = m.buf, r = RO.buffer;
          r.set('n', g(a.samples, 4) + ' (' + Math.round(v.s_ch) + ' × ' + g(a.samples, 4) + ' per channel)');
          r.set('bytes', E.kb(Math.round(a.bytes)));
          r.set('ram', a.ram ? E.kb(a.ram) + ' (' + (a.chip ? a.chip.name : '') + ')' : '—');
          r.set('share', a.ram ? pct(a.share) : '—');
          r.set('nyq', hz(a.nyq));
          r.set('rate', E.kb(Math.round(a.rate)) + ' a second');
          t.push(callout(a.share > 0.5 ? 'warn' : 'tip', a.share > 1 ? 'More than the chip has' : 'What this says', 'A recording of ' + dur(v.s_secs) + ' at ' + hz(v.s_fs) + ' holds ' + g(a.samples, 4) + ' samples, ' + E.kb(Math.round(a.bytes)) + (a.ram ? ', ' + pct(a.share) + ' of the ' + E.kb(a.ram) + ' of internal RAM of the ' + esc(a.chip ? a.chip.name : 'chip') + '. ' + (a.share > 0.5 ? 'That leaves little for the program: record in pieces and stream them out, keep a short ring buffer, or use PSRAM or a file.' : 'That fits.') : '.') + ' Tones above ' + hz(a.nyq) + ' are not captured; they fold back into lower ones.'));
        } else {
          const a = m.flash, r = RO.flash;
          r.set('yrs', a.yrs > 1000 ? 'more than 1000 years' : dur(a.days * 86400));
          r.set('per', g(a.perSector, 3));
          r.set('tot', g(a.total, 3) + ' writes in all');
          t.push(callout(a.yrs < 2 ? 'warn' : 'tip', a.yrs < 2 ? 'This will wear out' : 'What this says', 'Writing ' + g(v.f_wpd, 3) + ' times a day, spread over ' + Math.max(1, Math.round(v.f_sect)) + ' sector' + (v.f_sect > 1.5 ? 's' : '') + ' of ' + g(v.f_end, 3) + ' cycles each, wears the flash out in ' + (a.yrs > 1000 ? 'more than 1000 years' : dur(a.days * 86400)) + '. ' + (a.yrs < 2 ? 'Write less often (only when the value changed, or every few minutes), or keep it in RAM and save on shutdown. A file system or the NVS spread the writes for you; a fixed address does not.' : 'The key is the spreading: the NVS and the file systems rotate through many sectors, a fixed address does not.')));
        }
        note.innerHTML = t.join('');
      },
      draw(c, W, Hh, C, m, v) {
        ({ millis: drawMillis, baud: drawBaud, timer: drawTimer, ticks: drawTicks, buffer: drawBuffer, flash: drawFlash }[v.mode] || drawMillis)(c, W, Hh, C, m, v);
      }
    });
    function showMode(api, mode) { for (const k of Object.keys(GROUPS)) for (const id of GROUPS[k]) api.show(id, k === mode); }
  }
  /* the 32-bit counter as a ring, and a zoom on the rollover */
  function drawMillis(c, W, Hh, C, m) {
    const sy = S(), a = m.mil, TAU = Math.PI * 2, narrow = W < 600, r = narrow ? Math.min(Hh * 0.17, W * 0.16) : Math.min(Hh * 0.34, W * 0.19), cx = narrow ? W / 2 : r + 56, cy = narrow ? 38 + r : Hh * 0.5, ang = x => -Math.PI / 2 + x / R32 * TAU;
    c.save(); c.lineWidth = 16; c.strokeStyle = C.surface2 || C.surface; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke();
    c.lineWidth = 3; c.strokeStyle = C.border2 || C.faint; c.beginPath(); c.arc(cx, cy, r + 8, 0, TAU); c.stroke(); c.beginPath(); c.arc(cx, cy, r - 8, 0, TAU); c.stroke();
    const a0 = ang(a.then), span = Math.max(0.09, a.delta / R32 * TAU);
    c.lineWidth = 16; c.strokeStyle = hue(150); c.beginPath(); c.arc(cx, cy, r, a0, a0 + span); c.stroke();
    c.restore();
    for (const [x, col] of [[a.then, hue(212)], [a.now, hue(28)]]) { const t = ang(x); c.save(); c.fillStyle = col; c.beginPath(); c.arc(cx + Math.cos(t) * r, cy + Math.sin(t) * r, 7, 0, TAU); c.fill(); c.restore(); }
    c.save(); c.strokeStyle = C.bad; c.lineWidth = 2.5; c.beginPath(); c.moveTo(cx, cy - r - 14); c.lineTo(cx, cy - r + 14); c.stroke(); c.restore();
    sy.text(c, '0 = 4294967296', cx, cy - r - 24, { size: 11, color: C.bad });
    sy.text(c, '2³² ms', cx, cy - 8, { size: 17, weight: 700, color: C.text });
    sy.text(c, g(E.millisRollover, 4) + ' days', cx, cy + 14, { size: 12, color: C.text2 });
    // the zoom
    const x0 = narrow ? 24 : cx + r + 70, w = Math.max(80, W - x0 - 24), y = narrow ? Hh - 88 : Hh * 0.46, tLo = -a.before, tHi = Math.max(0, a.delta - a.before), zspan = Math.max(tHi - tLo, 50), lo = tLo - 0.12 * zspan, hi = tHi + 0.25 * zspan, X = t => x0 + (t - lo) / (hi - lo) * w;
    sy.text(c, 'Zoom on the rollover', x0, narrow ? cy + r + 22 : 16, { align: 'left', size: 12, color: C.text2 });
    c.save(); c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke();
    c.strokeStyle = C.bad; c.lineWidth = 2.5; c.beginPath(); c.moveTo(X(0), y - 30); c.lineTo(X(0), y + 30); c.stroke(); c.restore();
    sy.text(c, 'wraps to 0', X(0), y - 40, { size: 11, color: C.bad });
    const tThen = -a.before, tNow = a.delta - a.before;
    for (const [t, col, lab, val, dy] of [[tThen, hue(212), 'then', a.then, 1], [tNow, hue(28), 'now', a.now, -1]]) {
      c.save(); c.fillStyle = col; c.beginPath(); c.arc(X(t), y, 7, 0, TAU); c.fill(); c.restore();
      sy.text(c, lab + ' = ' + val, clamp(X(t), x0 + 72, x0 + w - 72), y + (dy > 0 ? 28 : -58), { size: 11.5, color: col, weight: 650, bg: C.bg2 });
    }
    c.save(); c.strokeStyle = hue(150); c.lineWidth = 3; c.beginPath(); c.moveTo(X(tThen), y + 14); c.lineTo(X(tNow), y + 14); c.stroke(); c.restore();
    sy.text(c, 'now − then = ' + a.elapsed + ' ms', clamp((X(tThen) + X(tNow)) / 2, x0 + 80, x0 + w - 80), y + 52, { size: 12.5, color: hue(150), weight: 700 });
    sy.text(c, a.wraps ? 'the deadline wraps to ' + a.deadline + ': it fires at once' : 'no wrap between the two readings', x0, Hh - 10, { align: 'left', size: 11.5, color: a.wraps ? C.warn : C.muted });
  }
  /* a byte on the wire */
  function drawBaud(c, W, Hh, C, m, v) {
    const sy = S(), a = m.baud, u = a.u, tb = 1 / v.b_baud, left = 30, w = Math.max(100, W - 2 * left), y = 66, h = Hh * 0.3, t0 = -tb, t1 = u.t1 + tb;
    sy.text(c, 'The byte 0x41 ("A") on the wire at ' + v.b_baud + ' baud, ' + v.b_frame, left, 16, { align: 'left', size: 12, color: C.text2 });
    const wv = sy.wave(c, left, y, w, h, u.edges, { t0, t1, color: C.accent, fill: true, width: 2.2 });
    const KC = { start: C.bad, data: C.accent, parity: C.warn, stop: C.ok };
    let di = 0;
    for (const b of u.bits) {
      const x = wv.X(b.t0), xe = wv.X(b.t1), name = b.kind === 'start' ? 'start' : b.kind === 'stop' ? 'stop' : b.kind === 'parity' ? 'parity' : 'D' + di++;
      c.save(); c.strokeStyle = C.grid; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x, y - 8); c.lineTo(x, y + h + 8); c.stroke(); c.setLineDash([]); c.restore();
      sy.text(c, name, (x + xe) / 2, y - 14, { size: Math.min(11, (xe - x) / 3 + 5), color: KC[b.kind], weight: 650 });
      sy.text(c, String(b.v), (x + xe) / 2, y + h + 16, { size: Math.min(11, (xe - x) / 2.5 + 4), color: C.text2, mono: true });
    }
    const by = y + h + 44;
    c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.4; c.beginPath(); c.moveTo(wv.X(0), by); c.lineTo(wv.X(u.t1), by); c.moveTo(wv.X(0), by - 5); c.lineTo(wv.X(0), by + 5); c.moveTo(wv.X(u.t1), by - 5); c.lineTo(wv.X(u.t1), by + 5); c.stroke(); c.restore();
    sy.text(c, 'one byte: ' + a.bits + ' bits × ' + dur(tb) + ' = ' + dur(a.ft), (wv.X(0) + wv.X(u.t1)) / 2, by + 16, { size: 12, color: C.text, weight: 650 });
    sy.text(c, 'The line idles high; the start bit pulls it low.', left, Hh - 18, { align: 'left', size: 11, color: C.muted });
  }
  /* the clock, the divider, the tick and the alarm */
  function drawTimer(c, W, Hh, C, m, v) {
    const sy = S(), a = m.timer, n = 5, gap = 26, left = 16, bw = (W - 2 * left - gap * (n - 1)) / n, y = Hh * 0.2, bh = Math.min(86, Hh * 0.26);
    const items = [['Clock', '80 MHz'], ['÷ ' + g(a.divider, 5), a.divOk ? 'the divider' : 'not possible'], ['Tick', hz(a.tickHz)], ['Counts to', a.zero ? '0 (!)' : String(a.count)], ['Alarm', a.zero ? '—' : dur(a.actual)]];
    items.forEach((it, i) => {
      const x = left + i * (bw + gap), bad = (i === 1 && !a.divOk) || (i >= 3 && a.zero);
      sy.box(c, x, y, bw, bh, { label: it[0], sub: it[1], color: bad ? C.bad : i === 4 ? C.ok : C.muted, size: Math.min(13, bw / 6 + 5) });
      if (i < n - 1) sy.link(c, x + bw + 2, y + bh / 2, x + bw + gap - 2, y + bh / 2, { arrow: 'end', color: C.muted });
    });
    sy.text(c, 'one tick = ' + dur(a.resolution), left + 2 * (bw + gap) + bw / 2, y + bh + 22, { size: 11.5, color: C.text2 });
    sy.text(c, 'asked for ' + dur(v.t_period), left + 4 * (bw + gap) + bw / 2, y + bh + 22, { size: 11.5, color: C.text2 });
    // the rounding: where the alarm falls against what was asked
    const ry = y + bh + 64, rw = W - 2 * left;
    sy.text(c, 'The alarm can only fall on a tick', left, ry - 20, { align: 'left', size: 12, color: C.text2 });
    c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(left, ry + 14); c.lineTo(left + rw, ry + 14); c.stroke();
    const span = Math.max(a.actual, v.t_period) * 1.25 || 1e-6, X = t => left + t / span * rw, nt = span * a.tickHz;
    if (nt <= 60) { c.strokeStyle = C.grid; for (let k = 0; k <= nt; k++) { c.beginPath(); c.moveTo(X(k / a.tickHz), ry + 8); c.lineTo(X(k / a.tickHz), ry + 20); c.stroke(); } }
    c.fillStyle = C.warn; c.beginPath(); c.arc(X(v.t_period), ry + 14, 6, 0, Math.PI * 2); c.fill();
    if (!a.zero) { c.fillStyle = C.ok; c.beginPath(); c.arc(X(a.actual), ry + 14, 6, 0, Math.PI * 2); c.fill(); }
    c.restore();
    sy.text(c, 'asked', X(v.t_period), ry - 4, { size: 10.5, color: C.warn });
    if (!a.zero) sy.text(c, 'got', X(a.actual), ry + 38, { size: 10.5, color: C.ok });
    sy.text(c, nt > 60 ? 'the tick marks are too close to draw' : '', left, ry + 58, { align: 'left', size: 10, color: C.faint });
  }
  /* a delay in ticks */
  function drawTicks(c, W, Hh, C, m, v) {
    const sy = S(), a = m.ticks, left = 30, w = Math.max(100, W - 2 * left), span = Math.max(v.k_ms, a.got, a.one) * 1.2, X = t => left + t / span * w;
    sy.text(c, 'A delay on the scheduler\'s clock: whole ticks only', left, 16, { align: 'left', size: 12, color: C.text2 });
    const nt = span / a.one, y1 = Hh * 0.28, y2 = Hh * 0.55;
    c.save();
    if (nt <= 80) { c.strokeStyle = C.grid; c.lineWidth = 1; for (let k = 0; k <= nt; k++) { const x = Math.round(X(k * a.one)) + 0.5; c.beginPath(); c.moveTo(x, y1 - 14); c.lineTo(x, y2 + 30); c.stroke(); } }
    c.fillStyle = hue(28, 0.8); c.fillRect(left, y1, Math.max(2, X(v.k_ms) - left), 26);
    c.fillStyle = a.zero ? C.bad : hue(150, 0.85); c.fillRect(left, y2, Math.max(2, X(a.got) - left), 26);
    c.restore();
    sy.text(c, 'you asked for ' + dur(v.k_ms / 1000), left + 6, y1 - 4 - 8, { align: 'left', size: 11.5, color: hue(28) });
    sy.text(c, a.zero ? 'you get nothing: 0 ticks' : 'you get ' + a.ticks + ' tick' + (a.ticks > 1 ? 's' : '') + ' = ' + dur(a.got / 1000), left + 6, y2 - 4 - 8, { align: 'left', size: 11.5, color: a.zero ? C.bad : hue(150) });
    sy.text(c, nt <= 80 ? 'one tick = ' + dur(a.one / 1000) : 'the ticks are too close to draw (' + dur(a.one / 1000) + ' each)', left, Hh - 30, { align: 'left', size: 11.5, color: C.muted });
    sy.text(c, 'pdMS_TO_TICKS(' + g(v.k_ms, 3) + ') = ' + a.ticks, left + w, Hh - 12, { align: 'right', size: 12, color: C.text, mono: true });
  }
  /* a buffer against the memory, and a tone sampled */
  function drawBuffer(c, W, Hh, C, m, v) {
    const sy = S(), a = m.buf, left = 30, w = Math.max(100, W - 2 * left), y = 52;
    sy.text(c, 'The recording against the internal RAM' + (a.chip ? ' of the ' + a.chip.name : ''), left, 16, { align: 'left', size: 12, color: C.text2 });
    c.save(); c.fillStyle = C.surface2 || C.surface; c.fillRect(left, y, w, 30);
    c.fillStyle = a.share > 1 ? C.bad : a.share > 0.5 ? C.warn : hue(150, 0.85); c.fillRect(left, y, clamp(a.share, 0, 1) * w, 30);
    c.strokeStyle = C.border2 || C.faint; c.strokeRect(left + 0.5, y + 0.5, w - 1, 29); c.restore();
    sy.text(c, E.kb(Math.round(a.bytes)) + (a.ram ? ' of ' + E.kb(a.ram) + ' (' + pct(a.share) + ')' : ''), left + 8, y + 15, { align: 'left', size: 12, weight: 650, color: a.share > 0.3 ? '#fff' : C.text });
    // a 1 kHz tone, sampled
    const sy0 = y + 92, sh = Hh - sy0 - 52, f0 = 1000, win = 0.003, X = t => left + t / win * w, Y = u => sy0 + sh / 2 - u * sh * 0.42;
    sy.text(c, 'A 1 kHz tone, sampled at ' + hz(v.s_fs) + ': ' + g(v.s_fs / f0, 3) + ' samples per cycle', left, sy0 - 16, { align: 'left', size: 12, color: C.text2 });
    c.save(); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(left, Y(0)); c.lineTo(left + w, Y(0)); c.stroke();
    c.strokeStyle = C.faint; c.lineWidth = 1.5; c.beginPath();
    for (let k = 0; k <= 200; k++) { const t = win * k / 200; if (k === 0) c.moveTo(X(t), Y(Math.sin(2 * Math.PI * f0 * t))); else c.lineTo(X(t), Y(Math.sin(2 * Math.PI * f0 * t))); }
    c.stroke();
    const dt = 1 / v.s_fs, ns = Math.min(600, Math.floor(win / dt));
    // the samples, and what the sampled values look like when joined
    c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
    for (let k = 0; k <= ns; k++) { const t = k * dt, y2 = Y(Math.sin(2 * Math.PI * f0 * t)); if (k === 0) c.moveTo(X(t), y2); else c.lineTo(X(t), y2); }
    c.stroke(); c.fillStyle = C.accent;
    if (ns <= 150) for (let k = 0; k <= ns; k++) { const t = k * dt; c.beginPath(); c.arc(X(t), Y(Math.sin(2 * Math.PI * f0 * t)), 3, 0, Math.PI * 2); c.fill(); }
    c.restore();
    sy.text(c, v.s_fs < 2 * f0 ? 'below twice the tone: it folds back into a false lower tone' : 'above twice the tone: the shape can be recovered', left, Hh - 20, { align: 'left', size: 11.5, color: v.s_fs < 2 * f0 ? C.bad : C.muted });
  }
  /* the life of a flash sector on a log scale */
  function drawFlash(c, W, Hh, C, m) {
    const sy = S(), a = m.flash, left = 40, w = Math.max(100, W - 2 * left), y = Hh * 0.42, lo = 1 / 365 * 0.1, hi = 1000, X = yr => left + clamp(Math.log(Math.max(yr, lo) / lo) / Math.log(hi / lo), 0, 1) * w;
    sy.text(c, 'How long the flash lasts, on a log scale', left, 16, { align: 'left', size: 12, color: C.text2 });
    c.save(); c.fillStyle = C.surface2 || C.surface; c.fillRect(left, y, w, 26);
    c.fillStyle = a.yrs < 2 ? hue(8, 0.85) : a.yrs < 10 ? hue(40, 0.85) : hue(150, 0.85); c.fillRect(left, y, X(a.yrs) - left, 26);
    c.strokeStyle = C.border2 || C.faint; c.strokeRect(left + 0.5, y + 0.5, w - 1, 25);
    c.restore();
    for (const [yr, lab] of [[1 / 365, '1 day'], [1 / 12, '1 month'], [1, '1 year'], [10, '10 years'], [100, '100 years'], [1000, '1000 years']]) {
      const x = X(yr); c.save(); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x, y - 6); c.lineTo(x, y + 32); c.stroke(); c.restore();
      sy.text(c, lab, x, y + 46, { size: 10.5 });
    }
    sy.text(c, a.yrs > 1000 ? 'more than 1000 years' : dur(a.days * 86400), clamp(X(a.yrs), left + 70, left + w - 70), y - 18, { size: 14, weight: 700, color: a.yrs < 2 ? C.bad : C.text });
    sy.text(c, 'Flash is rated for erase cycles: every write to a sector erases it first.', left, Hh - 20, { align: 'left', size: 11.5, color: C.muted });
  }
  TABFN.timing = timing;

  T.espcalc = function (el, params, sub) {
    const TABS = [['battery', 'Battery life'], ['pwm', 'PWM'], ['adc', 'ADC'], ['link', 'Radio range'], ['partitions', 'Flash layout'], ['leds', 'LEDs'], ['lora', 'LoRa'], ['i2c', 'I2C pull-ups'], ['power', 'Power supply'], ['timing', 'Timing']];
    const { tab, body } = T.util.subtabs(el, 'espcalc', TABS, sub);
    (TABFN[tab] || (b => { b.innerHTML = '<p class="muted">This calculator is not loaded.</p>'; }))(body, params);
  };
  T.espcalc.tabs = ['battery', 'pwm', 'adc', 'link', 'partitions', 'leds', 'lora', 'i2c', 'power', 'timing'];
  T.espcalc.model = M;
})();
