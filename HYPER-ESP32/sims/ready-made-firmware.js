/* HYPER-ESP32 · sims/ready-made-firmware.js
 *
 * Simulations of the topic "Ready-made firmware". Timings and settings are schematic where the blurb says so; the
 * chip facts (ESPHome support, PSRAM) come from the catalogue (kit.esp).
 *
 *   rf-esphome-path   a YAML file's way to a device in Home Assistant: check, compile, install, boot, adopt; each step can fail
 *   rf-tasmota-rule   a Tasmota rule as trigger -> action on a relay, with a timer and the telemetry period
 *   rf-wled-effects   a strip of 40 pixels with effects, segments, palette, brightness and a current limit
 *   rf-ha-link        params { view: 'discovery' | 'gateway' }: MQTT discovery between a device, a broker and Home Assistant;
 *                     and a gateway that turns radio messages into MQTT topics
 *   rf-cnc-machine    G-code in, a planned path and step pulses out, with a trapezoidal speed profile
 *   rf-voice-states   a voice satellite as a state machine with timeouts, a server to break and a mute switch
 *   rf-stream-buffer  an audio buffer between a stream and the decoder, a Wi-Fi that stalls, and underruns
 *   rf-web-flash      a browser flashing a chip through Web Serial: the checks, the manifest and the flash map
 *   rf-build-or-use   the decision tree: ready-made firmware, ready-made plus a little code, or your own
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- helpers */
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const inRect = (p, r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
  const fontOf = (size, weight, mono) => (weight || 500) + ' ' + size + 'px ' + (mono ? 'Consolas, "Cascadia Code", monospace' : 'system-ui, "Segoe UI", sans-serif');
  const frac1 = v => v - Math.floor(v);
  const tri = v => { const f = frac1(v); return f < 0.5 ? f * 2 : 2 - f * 2; };
  // shortens a string with an ellipsis so that it fits in maxW pixels
  function fit(c, str, maxW, size, weight, mono) {
    let s = String(str == null ? '' : str);
    c.save(); c.font = fontOf(size, weight, mono);
    if (maxW > 8 && c.measureText(s).width > maxW) {
      while (s.length > 1 && c.measureText(s + '…').width > maxW) s = s.slice(0, -1);
      s += '…';
    }
    c.restore();
    return s;
  }
  // draws wrapped text, left aligned; returns the y below the last line
  function wrap(S, c, text, x, y, maxW, lh, o) {
    o = o || {};
    const words = String(text).split(' ');
    let line = '';
    c.save(); c.font = fontOf(o.size || 12, o.weight);
    const lines = [];
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (c.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
    }
    c.restore();
    if (line) lines.push(line);
    const max = o.maxLines || 99;
    lines.slice(0, max).forEach((l, i) => {
      if (i === max - 1 && lines.length > max) l = fit(c, l + ' …', maxW, o.size || 12, o.weight);
      S.text(c, l, x, y, { size: o.size, color: o.color, align: o.align || 'left', weight: o.weight });
      y += lh;
    });
    return y;
  }
  const panel = (c, C, x, y, w, h) => {
    c.save();
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, 8); else c.rect(x, y, w, h);
    c.fillStyle = C.surface; c.fill();
    c.lineWidth = 1; c.strokeStyle = C.grid; c.stroke();
    c.restore();
  };
  const isNarrow = box => (box.stage.clientWidth || 700) < 560;
  const hsv = (h, s, v) => {
    h = ((h % 1) + 1) % 1;
    const i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
    const m = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][i % 6];
    return [m[0] * 255, m[1] * 255, m[2] * 255];
  };
  const mix = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const secs = s => (s >= 100 ? Math.round(s) + ' s' : s >= 10 ? s.toFixed(0) + ' s' : s.toFixed(1) + ' s');

  /* ================================================================ rf-esphome-path */
  const ES_STAGES = [['YAML file', 'you write it'], ['Check', 'validate'], ['Compile', 'C++ to firmware'], ['Install', 'cable or Wi-Fi'], ['Boot', 'join Wi-Fi'], ['Home Assistant', 'adopts it']];
  Hyper.sim('rf-esphome-path', {
    title: 'From a YAML file to a device in Home Assistant',
    blurb: `Six steps stand between the file and a new entity. Press **Run** to send the file through them; the box that goes red is where it stopped, and the panel says why. The durations are schematic: a real first compile takes minutes (it fetches the tools), later ones tens of seconds.

**Try this**
- Run with the defaults: the DHT22 appears as two entities.
- Choose **a typo** in the file: the checker stops it before anything is built.
- Set the device to **new, blank** and install **over Wi-Fi**: a blank chip has no ESPHome to accept an update.
- Untick **Wi-Fi password correct**, or the **API key**, and see how far the device gets.`,
    mount(box, kit) {
      const S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { aspect: narrow ? 1.5 : 0.66, minH: 440, maxH: 660 });
      let run = null;
      const ctl = kit.controls(box.side, [
        { id: 'parts', type: 'select', label: 'The file adds', options: [['a DHT22 sensor', 'dht'], ['a relay switch', 'relay'], ['a typo (wrong indent)', 'typo']], value: 'dht' },
        { id: 'device', type: 'select', label: 'The device is', options: [['new and blank', 'blank'], ['already running ESPHome', 'esphome']], value: 'blank' },
        { id: 'via', type: 'select', label: 'Install through', options: [['a USB cable', 'usb'], ['the browser (Web Serial)', 'web'], ['Wi-Fi (over the air)', 'ota']], value: 'usb' },
        { id: 'wifi', type: 'check', label: 'Wi-Fi password in the file is correct', value: true },
        { id: 'key', type: 'check', label: 'The API key entered in Home Assistant matches', value: true },
        { type: 'buttons', items: [{ id: 'run', label: 'Run', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'run') { run = { t: 0, plan: plan(), over: false }; loop.start(); return; }
        run = null; loop.once();
      });
      const ro = kit.readout(box.side, [['where', 'Where it is'], ['result', 'Result'], ['fix', 'What to do']]);
      function plan() {
        const v = ctl.values, p = { failAt: -1, text: '', fix: '', lines: {}, entities: [] };
        if (v.parts === 'typo') { p.failAt = 1; p.lines.name = 'bad'; p.text = 'The checker stops at the second line: "name" is not indented, so it means something other than you wrote. Nothing is built.'; p.fix = 'Correct the indent; the message names the line.'; return p; }
        if (v.via === 'ota' && v.device === 'blank') { p.failAt = 3; p.text = 'A blank chip has no ESPHome in it to receive an update over Wi-Fi. The first install must go through a cable or the browser.'; p.fix = 'Install the first time by USB or Web Serial; later changes can go over the air.'; return p; }
        if (!v.wifi) { p.failAt = 4; p.lines.password = 'bad'; p.text = 'The new firmware cannot join the Wi-Fi, so it never reaches Home Assistant. With a fallback access point in the file, the device opens its own network for you to correct this.'; p.fix = 'Fix the password in the secrets file and install again, through the fallback network or a cable.'; return p; }
        if (!v.key) { p.failAt = 5; p.lines.key = 'warn'; p.text = 'Home Assistant finds the device on the network but cannot decrypt its messages: the key it was given is not the key in the file. No entities appear.'; p.fix = 'Copy the key from the file into Home Assistant\'s prompt.'; return p; }
        p.entities = v.parts === 'relay' ? [['switch', 'Relay']] : [['sensor', 'Temperature'], ['sensor', 'Humidity']];
        p.text = 'The device joins the Wi-Fi, announces itself by mDNS, Home Assistant adopts it with the key, and one entity per component appears under one device.';
        p.fix = 'Nothing: later changes to the file go over the air.';
        return p;
      }
      const dur = () => [0.7, 1.1, 2.6, ctl.values.via === 'ota' ? 1.6 : 2.4, 1.5, 1.3];
      // where the run is: { idx, frac, failed, done }
      function where() {
        if (!run) return { idx: -1, frac: 0, failed: false, done: false };
        const D = dur(); let t = run.t;
        for (let i = 0; i < D.length; i++) {
          const f = t / D[i];
          if (i === run.plan.failAt && f >= 0.55) return { idx: i, frac: 0.55, failed: true, done: true };
          if (f < 1) return { idx: i, frac: Math.max(0, f), failed: false, done: false };
          t -= D[i];
        }
        return { idx: D.length, frac: 1, failed: false, done: true };
      }
      const YAML = () => {
        const v = ctl.values, L = [['esphome:', ''], ['  name: shelf-sensor', 'name'], ['wifi:', ''], ['  ssid: !secret wifi_ssid', ''], ['  password: !secret wifi_password', 'password'], ['api:', ''], ['  encryption:', ''], ['    key: !secret api_key', 'key']];
        if (v.parts === 'typo') L[1] = ['name: shelf-sensor', 'name'];
        if (v.parts === 'dht') L.push(['sensor:', ''], ['  - platform: dht', ''], ['    pin: GPIO4', ''], ['    model: DHT22', ''], ['    temperature:', ''], ['      name: "Temperature"', '']);
        if (v.parts === 'relay') L.push(['switch:', ''], ['  - platform: gpio', ''], ['    pin: GPIO26', ''], ['    name: "Relay"', '']);
        return L;
      };
      const loop = kit.loop(dt => {
        if (run && !run.over) { run.t += dt; const w = where(); if (w.done) run.over = true; }
        const c = st.begin(), C = kit.colors(), W = st.W, M = 10, w = where(), n = ES_STAGES.length;
        const cols = narrow ? 3 : 6, gap = 8, bw = (W - 2 * M - (cols - 1) * gap) / cols, bh = 50, rowGap = 20;
        const pos = i => ({ x: M + (i % cols) * (bw + gap), y: 12 + Math.floor(i / cols) * (bh + rowGap) });
        const done = w.done && !w.failed;
        ES_STAGES.forEach(([label, sub], i) => {
          const p = pos(i);
          const state = done || (w.idx > i) ? 'done' : (w.idx === i ? (w.failed ? 'fail' : 'active') : 'todo');
          const col = state === 'done' ? C.ok : state === 'fail' ? C.bad : state === 'active' ? C.accent : C.faint;
          if (i < n - 1 && (i + 1) % cols !== 0) {
            const q = pos(i + 1);
            S.wire(c, [[p.x + bw, p.y + bh / 2], [q.x, q.y + bh / 2]], { color: w.idx > i || done ? C.ok : C.faint, width: 2 });
          }
          S.box(c, p.x, p.y, bw, bh, { label: fit(c, label, bw - 8, 12, 600), sub: fit(c, sub, bw - 8, 10), color: col, active: state === 'active' || state === 'fail', dash: state === 'todo', size: 12 });
          if (state === 'active') { c.fillStyle = C.accent; c.fillRect(p.x + 4, p.y + bh - 6, Math.max(2, (bw - 8) * w.frac), 3); }
          if (state === 'fail') S.text(c, '✕', p.x + bw - 10, p.y + 10, { size: 13, color: C.bad, weight: 700 });
          if (state === 'done') S.text(c, '✓', p.x + bw - 10, p.y + 10, { size: 12, color: C.ok, weight: 700 });
        });
        // the panels: the file, and what happened
        const topY = pos(n - 1).y + bh + 18;
        const wide = !narrow, pw = wide ? (W - 2 * M - 10) * 0.46 : W - 2 * M;
        const fh = wide ? st.H - topY - 10 : Math.min(st.H * 0.42, 16 * 14 + 34);
        panel(c, C, M, topY, pw, fh);
        S.text(c, 'the file', M + 10, topY + 13, { align: 'left', size: 10.5, color: C.faint, weight: 600 });
        const lines = YAML();
        const lh = Math.max(12, Math.min(14.5, (fh - 30) / lines.length));
        lines.forEach(([txt, tag], i) => {
          const y = topY + 30 + i * lh, bad = tag && run && run.plan.lines[tag];
          if (bad) { c.fillStyle = bad === 'bad' ? (C.dark ? 'rgba(229,72,77,.28)' : 'rgba(229,72,77,.18)') : (C.dark ? 'rgba(224,160,48,.28)' : 'rgba(224,160,48,.2)'); c.fillRect(M + 4, y - lh / 2, pw - 8, lh); }
          S.text(c, fit(c, txt, pw - 24, 11, 500, true), M + 12, y, { align: 'left', size: 11, mono: true, color: bad ? (bad === 'bad' ? C.bad : C.warn) : C.text });
        });
        const ox = wide ? M + pw + 10 : M, oy = wide ? topY : topY + fh + 10, ow = wide ? W - 2 * M - pw - 10 : W - 2 * M, oh = wide ? fh : st.H - oy - 10;
        panel(c, C, ox, oy, ow, Math.max(60, oh));
        let msg, head, hcol;
        if (!run) { head = 'Press Run'; hcol = C.muted; msg = 'The file goes through the check, the compiler and the installer, and then the device has to boot, join the Wi-Fi and be adopted.'; }
        else if (!w.done) { head = ES_STAGES[Math.min(w.idx, n - 1)][0] + ' …'; hcol = C.accent; msg = 'Working. A real compile is the slow step.'; }
        else if (w.failed) { head = 'Stopped at: ' + ES_STAGES[w.idx][0]; hcol = C.bad; msg = run.plan.text; }
        else { head = 'Done'; hcol = C.ok; msg = run.plan.text; }
        S.text(c, head, ox + 10, oy + 14, { align: 'left', size: 12.5, color: hcol, weight: 650 });
        const my = wrap(S, c, msg, ox + 10, oy + 36, ow - 20, 15, { size: 11.5, color: C.text, maxLines: Math.max(3, Math.floor((oh - 60) / 15)) });
        if (done && run) {
          let ey = Math.max(my + 6, oy + oh - 70);
          if (ey > oy + oh - 40) ey = oy + Math.max(60, oh) - 40;
          run.plan.entities.forEach((e, i) => {
            const ex = ox + 10 + i * Math.min(120, (ow - 20) / 2 + 2), ew = Math.min(114, (ow - 28) / 2);
            S.box(c, ex, ey, ew, 32, { label: fit(c, e[1], ew - 8, 12, 600), sub: e[0], color: kit.hue(150), size: 11.5, active: true });
          });
        }
        ro.set('where', !run ? 'not started' : w.failed || (w.done && w.idx >= n) ? (w.failed ? ES_STAGES[w.idx][0] : 'finished') : ES_STAGES[Math.min(w.idx, n - 1)][0]);
        ro.set('result', !run ? '—' : w.failed ? 'stopped' : w.done ? 'the device is in Home Assistant' : 'running');
        ro.set('fix', run && w.done ? run.plan.fix : '—');
        if (!run || run.over) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ rf-tasmota-rule */
  Hyper.sim('rf-tasmota-rule', {
    title: 'A Tasmota rule: event, then action',
    blurb: `A Tasmota device has a **switch input** (Switch1), a **relay** (Power1), a **timer** and a **temperature sensor**. A rule says: when this event happens, do that. Choose a rule, then cause events with the buttons. The trace is the relay over the last minute (simulated time; the clock can run faster than real time).

A sensor value reaches the rules only when the sensor is *reported*: every **TelePeriod**, 300 s unless changed. Here the range is 10 to 300 s.

**Try this**
- *Auto-off*: switch Power1 on from the web page and watch the timer run down and the rule turn it off.
- *Door switch*: close the switch input; the rule switches the light on and starts the timer. Close it again: the timer restarts.
- *Temperature*: move the temperature above 28, and see that nothing happens until the next report. Then lower **TelePeriod**.
- Untick **Rule enabled** (Rule1 0) and repeat.`,
    mount(box, kit) {
      const S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { aspect: narrow ? 1.3 : 0.78, minH: 420, maxH: 620 });
      const SPAN = 60;
      let t = 0, power = false, timerEnd = null, lastTele = 0, reading = 22, edges = [[-SPAN, 0]], log = [], flash = { clause: -1, t: -9 }, sw = 0, timerStart = 0;
      const ctl = kit.controls(box.side, [
        { id: 'rule', type: 'select', label: 'Rule1', options: [['Auto-off after a time', 'autooff'], ['Door switch: light for a while', 'door'], ['Temperature above a limit', 'temp'], ['No rule', 'none']], value: 'autooff' },
        { id: 'secs', label: 'Timer (RuleTimer1)', min: 5, max: 60, step: 1, value: 15, unit: 's' },
        { id: 'tele', label: 'TelePeriod', min: 10, max: 300, step: 5, value: 60, unit: 's' },
        { id: 'temp', label: 'Temperature now', min: 10, max: 40, step: 0.5, value: 22, unit: '°C' },
        { id: 'speed', label: 'Clock speed', min: 1, max: 20, step: 1, value: 4, unit: '×' },
        { id: 'on', type: 'check', label: 'Rule enabled (Rule1 1)', value: true },
        { type: 'buttons', items: [{ id: 'door', label: 'Switch1 closes' }, { id: 'pon', label: 'Power1 on (web page)' }, { id: 'poff', label: 'Power1 off' }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'door') { sw = t; event('Switch1#State=1'); }
        else if (id === 'pon') setPower(true, 'web page');
        else if (id === 'poff') setPower(false, 'web page');
        else if (id === 'reset') reset();
        else if (id === 'rule' || id === 'on') { timerEnd = null; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['rule', 'Rule1 as typed'], ['power', 'Power1'], ['timer', 'Rule timer'], ['report', 'Next sensor report']]);
      const clauses = () => {
        const v = ctl.values, s = Math.round(v.secs);
        if (v.rule === 'autooff') return [['Power1#State=1', 'RuleTimer1 ' + s], ['Rules#Timer=1', 'Power1 0']];
        if (v.rule === 'door') return [['Switch1#State=1', 'Backlog Power1 1; RuleTimer1 ' + s], ['Rules#Timer=1', 'Power1 0']];
        if (v.rule === 'temp') return [['DS18B20#Temperature>28', 'Power1 1'], ['DS18B20#Temperature<26', 'Power1 0']];
        return [];
      };
      const text = () => { const cl = clauses(); return cl.length ? 'Rule1 ' + cl.map(x => 'ON ' + x[0] + ' DO ' + x[1] + ' ENDON').join(' ') : 'Rule1 (empty)'; };
      function note(s) { log.push(t.toFixed(0).padStart(3, ' ') + ' s  ' + s); if (log.length > 40) log.shift(); }
      function reset() { t = 0; power = false; timerEnd = null; lastTele = 0; edges = [[-SPAN, 0]]; log = []; flash = { clause: -1, t: -9 }; sw = 0; }
      function setPower(on, why) {
        if (on === power) { note('Power1 ' + (on ? 'ON' : 'OFF') + ' (already, ' + why + ')'); return; }
        power = on; edges.push([t, on ? 1 : 0]); note('Power1 ' + (on ? 'ON' : 'OFF') + ' (' + why + ')');
        if (on) event('Power1#State=1');
      }
      function event(name, value) {
        note('event ' + name + (value != null ? '=' + value.toFixed(1) : ''));
        if (!ctl.values.on) return;
        clauses().forEach((cl, i) => {
          if (!match(cl[0], name, value)) return;
          flash = { clause: i, t };
          note('rule: ' + cl[1]);
          cl[1].split(';').map(s => s.trim().replace(/^Backlog\s+/, '')).forEach(cmd => {
            if (/^RuleTimer1\s+\d+/.test(cmd)) { timerStart = t; timerEnd = t + parseInt(cmd.replace(/\D+/g, ''), 10); }
            else if (/^Power1\s+1/.test(cmd)) setPower(true, 'rule');
            else if (/^Power1\s+0/.test(cmd)) setPower(false, 'rule');
          });
        });
      }
      // does the clause trigger match the event? a trigger such as DS18B20#Temperature>28 compares the reported value
      function match(trig, name, value) {
        const m = /^(.+?)([<>])(-?[0-9.]+)$/.exec(trig);
        if (m) return name === m[1] && value != null && (m[2] === '>' ? value > +m[3] : value < +m[3]);
        return trig === name;
      }
      const loop = kit.loop(dt => {
        const v = ctl.values, h = dt * v.speed;
        t += h;
        if (timerEnd != null && t >= timerEnd) { timerEnd = null; event('Rules#Timer=1'); }
        if (t - lastTele >= v.tele) { lastTele = t; reading = v.temp; note('report: DS18B20#Temperature=' + reading.toFixed(1)); event('DS18B20#Temperature', reading); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10;
        // the device
        const dy = 14, dh = 78, gapx = 10, nb = 3, bw = (W - 2 * M - (nb - 1) * gapx) / nb;
        const bx = i => M + i * (bw + gapx);
        const swOn = t - sw < 1.2 && sw > 0;
        panel(c, C, bx(0), dy, bw, dh);
        S.text(c, 'Switch1', bx(0) + 10, dy + 13, { align: 'left', size: 10.5, color: C.faint, weight: 600 });
        S.button(c, bx(0) + bw / 2, dy + 46, { pressed: swOn, size: 28 });
        S.text(c, swOn ? 'closed' : 'open', bx(0) + bw / 2, dy + dh - 9, { size: 10.5, color: swOn ? C.accent : C.muted });
        panel(c, C, bx(1), dy, bw, dh);
        S.text(c, 'Sensor (reported every ' + secs(v.tele) + ')', bx(1) + 10, dy + 13, { align: 'left', size: 10.5, color: C.faint, weight: 600 });
        S.text(c, reading.toFixed(1) + ' °C', bx(1) + bw / 2, dy + 40, { size: 20, color: C.text, weight: 650 });
        S.text(c, 'live: ' + v.temp.toFixed(1) + ' °C · next report in ' + secs(Math.max(0, v.tele - (t - lastTele))), bx(1) + bw / 2, dy + dh - 12, { size: 10, color: v.temp !== reading ? C.warn : C.muted });
        panel(c, C, bx(2), dy, bw, dh);
        S.text(c, 'Power1 (relay)', bx(2) + 10, dy + 13, { align: 'left', size: 10.5, color: C.faint, weight: 600 });
        S.led(c, bx(2) + 30, dy + 46, { color: 40, on: power, r: 13 });
        S.text(c, power ? 'ON' : 'OFF', bx(2) + 30, dy + dh - 9, { size: 11, color: power ? C.ok : C.muted, weight: 650 });
        if (timerEnd != null) {
          const left = Math.max(0, timerEnd - t), tot = Math.max(1, timerEnd - timerStart), tx = bx(2) + 56, tw = bw - 66;
          c.fillStyle = C.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.08)'; c.fillRect(tx, dy + 40, tw, 10);
          c.fillStyle = C.warn; c.fillRect(tx, dy + 40, tw * clamp(left / tot, 0, 1), 10);
          S.text(c, 'RuleTimer1 ' + secs(left), tx, dy + 62, { align: 'left', size: 10, color: C.warn });
        } else S.text(c, 'no timer running', bx(2) + 56, dy + 46, { align: 'left', size: 10.5, color: C.faint });
        // the rule
        const ry = dy + dh + 14, cl = clauses();
        S.text(c, 'the rule in the console', M, ry, { align: 'left', size: 10.5, color: C.faint, weight: 600 });
        const rh = Math.max(34, 18 + (cl.length || 1) * 16);
        panel(c, C, M, ry + 8, W - 2 * M, rh);
        if (!cl.length) S.text(c, 'Rule1 (empty): events happen, nothing reacts', M + 10, ry + 8 + rh / 2, { align: 'left', size: 11, mono: true, color: C.muted });
        cl.forEach((x, i) => {
          const y = ry + 8 + 16 + i * 16, hot = flash.clause === i && t - flash.t < 2.5 * Math.max(1, v.speed / 2);
          if (hot) { c.fillStyle = C.dark ? 'rgba(224,160,48,.3)' : 'rgba(224,160,48,.25)'; c.fillRect(M + 4, y - 8, W - 2 * M - 8, 16); }
          const line = (i === 0 ? 'Rule1 ' : '      ') + 'ON ' + x[0] + ' DO ' + x[1] + ' ENDON';
          S.text(c, fit(c, line, W - 2 * M - 22, 11, 500, true), M + 12, y, { align: 'left', size: 11, mono: true, color: !v.on ? C.faint : hot ? C.warn : C.text });
        });
        if (!v.on) S.text(c, 'disabled', W - M - 10, ry + 8 + 14, { align: 'right', size: 10.5, color: C.bad });
        // the trace and the log
        const ty = ry + 8 + rh + 22, th = Math.max(34, Math.min(60, (H - ty) * 0.3)), px = M + 56, pw = W - px - M;
        const shown = edges.filter(e => e[0] <= t), t0 = t - SPAN, vis = shown.length ? shown.filter((e, i) => !(i < shown.length - 1 && shown[i + 1][0] <= t0)) : [[t0, 0]];
        const clip = vis.map((e, i) => (i === 0 && e[0] < t0 ? [t0, e[1]] : e));
        S.wave(c, px, ty, pw, th, clip, { t0, t1: t, label: 'Power1', fill: true });
        S.text(c, '60 s ago', px, ty + th + 10, { align: 'left', size: 9.5, color: C.faint });
        S.text(c, 'now (simulated time)', px + pw, ty + th + 10, { align: 'right', size: 9.5, color: C.faint });
        const ly = ty + th + 30, rows = Math.max(2, Math.floor((H - ly - 8) / 14));
        S.text(c, 'console', M, ly - 2, { align: 'left', size: 10.5, color: C.faint, weight: 600 });
        log.slice(-rows).forEach((s, i, a) => S.text(c, fit(c, s, W - 2 * M, 10.5, 500, true), M, ly + 14 + i * 14, { align: 'left', size: 10.5, mono: true, color: i === a.length - 1 ? C.text : C.muted }));
        ro.set('rule', text());
        ro.set('power', power ? 'ON' : 'OFF');
        ro.set('timer', timerEnd != null ? secs(Math.max(0, timerEnd - t)) + ' left' : 'not running');
        ro.set('report', secs(Math.max(0, v.tele - (t - lastTele))));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ rf-wled-effects */
  const PIX = 40;
  const WL_FX = [['Solid', 'solid'], ['Blink', 'blink'], ['Breathe', 'breathe'], ['Wipe', 'wipe'], ['Scan', 'scan'], ['Chase', 'chase'], ['Rainbow', 'rainbow'], ['Twinkle', 'twinkle'], ['Fire', 'fire']];
  // a palette: x in 0..1 -> [r, g, b] 0..255
  function palette(name, x, hue) {
    x = ((x % 1) + 1) % 1;
    if (name === 'rainbow') return hsv(x, 1, 1);
    if (name === 'sunset') { const k = [[40, 50, 140], [140, 40, 140], [240, 90, 40], [255, 200, 60]], f = x * 3, i = Math.min(2, Math.floor(f)); return mix(k[i], k[i + 1], f - i); }
    if (name === 'ocean') { const k = [[10, 40, 120], [10, 120, 190], [20, 190, 170], [190, 240, 240]], f = x * 3, i = Math.min(2, Math.floor(f)); return mix(k[i], k[i + 1], f - i); }
    return hsv(hue / 360, 1, 1);
  }
  const fireColour = h => (h < 0.33 ? [h * 3 * 220, 0, 0] : h < 0.66 ? [220 + (h - 0.33) * 3 * 35, (h - 0.33) * 3 * 120, 0] : [255, 120 + (h - 0.66) * 3 * 135, (h - 0.66) * 3 * 120]);
  // the colour of pixel j of a segment of length L at time T, for an effect
  function effect(fx, j, L, T, sx, ix, pal, hue) {
    const u = L > 1 ? j / (L - 1) : 0, I = ix / 255, p = x => palette(pal, x, hue);
    switch (fx) {
      case 'solid': return p(0);
      case 'blink': return frac1(T * 0.8) < 0.15 + I * 0.7 ? p(0) : [0, 0, 0];
      case 'breathe': return scale(p(0), (Math.sin(T * Math.PI) + 1) / 2);
      case 'wipe': { const pos = frac1(T * 0.25) * 2, lit = pos < 1 ? u <= pos : u > pos - 1; return lit ? p(u) : [0, 0, 0]; }
      case 'scan': { const pos = tri(T * 0.35) * (L - 1), wd = 1 + I * L / 5; return scale(p(pos / Math.max(1, L - 1)), Math.max(0, 1 - Math.abs(j - pos) / wd)); }
      case 'chase': { const pos = frac1(T * 0.4) * L, d = (pos - j + L) % L, tail = 3 + I * L * 0.6; return d < tail ? scale(p(u), 1 - d / tail) : [0, 0, 0]; }
      case 'rainbow': return palette(pal === 'solid' ? 'rainbow' : pal, u * (0.6 + I * 2) - T * 0.15, hue);
      case 'twinkle': { const s = frac1(Math.sin(j * 12.9898 + 4.1) * 43758.5453), lv = Math.pow(Math.max(0, Math.sin((T * 0.5 + s) * Math.PI * 2)), 6 + (1 - I) * 24); return scale(p(s), lv); }
      case 'fire': { const nz = (Math.sin(j * 1.7 + T * 7.3) + Math.sin(j * 0.9 - T * 5.1) + 2) / 4; return fireColour(clamp(Math.pow(1 - u * 0.8, 1.4) * (0.35 + 0.65 * nz) * (0.6 + I * 0.5), 0, 1)); }
      default: return [0, 0, 0];
    }
  }
  Hyper.sim('rf-wled-effects', {
    title: 'A WLED strip: effects, segments and a current limit',
    blurb: `Forty pixels, each lit by a rule that gives it a colour at every moment: that is an **effect**. These are simplified look-alikes of the kinds of effect WLED has, not WLED's own code. Cut the strip into **two segments** and each runs its own effect; the speed and intensity settings change how it moves.

The current is **estimated**: each colour channel of a pixel draws about 20 mA at full level, so a white pixel draws about 60 mA. With a **maximum current** set, the brightness is lowered to fit, as WLED does.

**Try this**
- Set **Segment 1 ends after pixel** to 20 and give the halves different effects.
- Set the palette to *Rainbow*, brightness to the top, and read the current; then set a limit of 1 A.
- Lower **intensity** on *Chase*: the tail shortens. Raise the **speed**.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 420 });
      const fxOpts = WL_FX.map(x => [x[0], x[1]]);
      const ctl = kit.controls(box.side, [
        { id: 'fx1', type: 'select', label: 'Effect, segment 1', options: fxOpts, value: 'chase' },
        { id: 'fx2', type: 'select', label: 'Effect, segment 2', options: fxOpts, value: 'twinkle' },
        { id: 'split', label: 'Segment 1 ends after pixel', min: 1, max: PIX, step: 1, value: PIX },
        { id: 'pal', type: 'select', label: 'Palette', options: [['One colour', 'solid'], ['Rainbow', 'rainbow'], ['Sunset', 'sunset'], ['Ocean', 'ocean']], value: 'sunset' },
        { id: 'hue', label: 'Colour (one-colour palette)', min: 0, max: 360, step: 1, value: 30, unit: '°' },
        { id: 'sx', label: 'Speed', min: 0, max: 255, step: 1, value: 128 },
        { id: 'ix', label: 'Intensity', min: 0, max: 255, step: 1, value: 128 },
        { id: 'bri', label: 'Brightness', min: 1, max: 255, step: 1, value: 128 },
        { id: 'limit', label: 'Maximum current, 0 = none', min: 0, max: 3, step: 0.1, value: 0, unit: 'A' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['seg', 'Segments'], ['cur', 'Current (estimated)'], ['bri', 'Brightness used'], ['frame', 'One frame to the strip']]);
      let T = 0;
      const loop = kit.loop(dt => {
        const v = ctl.values, cut = Math.round(v.split);
        T += dt * (0.25 + v.sx / 255 * 2.75);
        const px = [];
        for (let i = 0; i < PIX; i++) {
          const seg2 = i >= cut, L = seg2 ? PIX - cut : cut, j = seg2 ? i - cut : i;
          px.push(effect(seg2 ? v.fx2 : v.fx1, j, Math.max(1, L), T, v.sx, v.ix, v.pal, v.hue));
        }
        const k = v.bri / 255, idle = PIX * 0.001;
        const lit = px.reduce((a, q) => a + (q[0] + q[1] + q[2]) / 255 * 20, 0) / 1000;    // amperes at full brightness
        const raw = lit * k + idle;
        let kk = k;
        if (v.limit > 0 && raw > v.limit) kk = clamp((v.limit - idle) / Math.max(0.0001, lit), 0, k);
        const out = px.map(q => scale(q, kk));
        const cur = out.reduce((a, q) => a + (q[0] + q[1] + q[2]) / 255 * 20, 0) / 1000 + idle;
        const c = st.begin(), C = kit.colors(), W = st.W, M = 12;
        const pw = W - 2 * M, gap0 = 0.6, r = Math.max(2.5, Math.min(11, pw / (PIX * (2 + gap0)))), step = 2 * r + r * gap0;
        const x0 = M + (pw - (PIX * step - r * gap0)) / 2, y0 = 34;
        c.fillStyle = C.dark ? '#05060c' : '#1b1e26'; c.fillRect(x0 - 8, y0 - 8, PIX * step - r * gap0 + 16, 2 * r + 16);
        S.pixels(c, x0, y0, out, { r, gap: r * gap0 });
        // the segments under the strip
        const sy = y0 + 2 * r + 20, sx0 = x0, sw = PIX * step - r * gap0;
        const segs = cut >= PIX ? [[0, PIX, 'one segment', v.fx1]] : [[0, cut, 'segment 1', v.fx1], [cut, PIX, 'segment 2', v.fx2]];
        segs.forEach(([a, b, name, fx], i) => {
          const xa = sx0 + a / PIX * sw + 1, xb = sx0 + b / PIX * sw - 1;
          c.fillStyle = i === 0 ? kit.hue(212, 0.8) : kit.hue(40, 0.8); c.fillRect(xa, sy, Math.max(2, xb - xa), 5);
          S.text(c, fit(c, name + ' · pixels ' + a + '–' + (b - 1) + ' · ' + (WL_FX.find(f => f[1] === fx) || ['—'])[0], Math.max(60, xb - xa), 10.5, 500), xa, sy + 17, { align: 'left', size: 10.5, color: C.text2 });
        });
        S.text(c, 'pixel 0', x0, 14, { align: 'left', size: 10, color: C.faint });
        S.text(c, 'pixel ' + (PIX - 1), x0 + sw, 14, { align: 'right', size: 10, color: C.faint });
        // a current bar
        const by = sy + 54, bh = 14, full = PIX * 0.061;
        c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'; c.fillRect(M, by, pw, bh);
        c.fillStyle = v.limit > 0 && raw > v.limit ? C.warn : C.accent; c.fillRect(M, by, pw * clamp(cur / full, 0, 1), bh);
        if (v.limit > 0) { const lx = M + pw * clamp(v.limit / full, 0, 1); c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(lx, by - 4); c.lineTo(lx, by + bh + 4); c.stroke(); S.text(c, 'limit ' + kit.fmt(v.limit, 2) + ' A', Math.min(W - 40, lx), by + bh + 14, { size: 10, color: C.bad }); }
        S.text(c, 'current drawn · full scale = every pixel white = ' + kit.fmt(full, 3) + ' A', M, by - 10, { align: 'left', size: 10, color: C.faint });
        ro.set('seg', cut >= PIX ? '1' : '2 (pixels 0–' + (cut - 1) + ' and ' + cut + '–' + (PIX - 1) + ')');
        ro.set('cur', kit.fmt(cur, 3) + ' A  (' + kit.fmt(cur * 5, 3) + ' W at 5 V)');
        ro.set('bri', Math.round(kk * 255) + ' of 255' + (kk < k - 0.003 ? ' (held down by the limit)' : ''));
        const frame = (PIX * 30 + 300) / 1000;
        ro.set('frame', kit.fmt(frame, 3) + ' ms: up to ' + Math.floor(1000 / frame) + ' frames a second');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });
  /* ================================================================ rf-ha-link */
  // a tiny scheduler and a list of messages in flight, shared by the two network pictures
  function netKit() {
    const k = { t: 0, queue: [], flights: [], log: [], FL: 0.75 };
    k.later = (d, fn) => k.queue.push({ at: k.t + d, fn });
    k.note = s => { k.log.push(s); if (k.log.length > 40) k.log.shift(); };
    k.fly = (a, b, label, onArrive, color) => { k.flights.push({ a, b, t0: k.t, label, color }); k.later(k.FL, onArrive || (() => {})); };
    k.step = dt => {
      k.t += dt;
      for (let guard = 0; guard < 200; guard++) {
        const i = k.queue.findIndex(q => q.at <= k.t);
        if (i < 0) break;
        const q = k.queue.splice(i, 1)[0];
        try { q.fn(); } catch (e) { /* a scheduled action must never stop the picture */ }
      }
      k.flights = k.flights.filter(f => k.t - f.t0 <= k.FL + 0.05);
    };
    k.reset = () => { k.queue = []; k.flights = []; k.log = []; };
    return k;
  }
  Hyper.sim('rf-ha-link', {
    title: 'A device introduces itself to Home Assistant',
    blurb: `The three boxes below the picture are what each party remembers. A **device** boots, connects to the **broker**, and publishes a *discovery message*; **Home Assistant** creates an entity from it. The device then publishes its value every few seconds.

The three ticks decide what survives a restart. A message that is **retained** is kept by the broker and handed to Home Assistant when it starts. The **birth message** tells devices to announce themselves again. The **last will** lets the broker mark a device as gone.

**Try this**
- Boot the device, then **restart Home Assistant** with everything ticked: the entity comes back at once.
- Untick **retained** and restart: the entity returns only because of the birth message. Untick that too, and it stays missing until the device reboots.
- Pull the device's power with **availability** ticked, then without: *unavailable*, or a value that goes quietly stale.`,
    mount(box, kit) {
      const S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { aspect: narrow ? 1.3 : 0.74, minH: 420, maxH: 620 });
      const N = netKit();
      const dev = { on: false, connected: false, will: false, timer: 0 };
      const bro = { config: false, configAvail: false, avail: null, willArmed: false };
      const ha = { up: true, entity: null, value: null, avail: null, last: 0 };
      const ctl = kit.controls(box.side, [
        { id: 'retain', type: 'check', label: 'The discovery message is retained', value: true },
        { id: 'avail', type: 'check', label: 'Availability topic and last will', value: true },
        { id: 'birth', type: 'check', label: 'Device announces again on the birth message', value: true },
        { type: 'buttons', items: [{ id: 'boot', label: 'Boot the device', primary: true }, { id: 'restart', label: 'Restart Home Assistant' }, { id: 'pull', label: 'Pull the device\'s power' }] }
      ], id => {
        if (id === 'boot') boot(); else if (id === 'restart') restartHA(); else if (id === 'pull') pull();
        loop.start();
      });
      const ro = kit.readout(box.side, [['entity', 'The entity'], ['dev', 'Device'], ['after', 'After Home Assistant restarts']]);
      function createEntity(hasAvail) {
        if (!ha.entity) { ha.entity = { hasAvail }; N.note('Home Assistant creates the entity from the config message'); }
      }
      function announce() {
        if (!dev.on || !dev.connected) return;
        const retain = ctl.values.retain, av = ctl.values.avail;
        N.fly('dev', 'bro', retain ? 'config (retained)' : 'config', () => {
          if (retain) { bro.config = true; bro.configAvail = av; N.note('broker keeps the config message'); }
          if (ha.up) N.fly('bro', 'ha', 'config', () => { if (ha.up) createEntity(av); });
          else N.note('Home Assistant is not listening: the config is ' + (retain ? 'kept for later' : 'lost'));
        });
        if (av) N.later(0.25, () => N.fly('dev', 'bro', 'online (retained)', () => {
          bro.avail = 'online';
          if (ha.up) N.fly('bro', 'ha', 'online', () => { if (ha.up) ha.avail = 'online'; });
        }));
      }
      function boot() {
        if (dev.on) { N.note('the device is already running'); return; }
        dev.on = true; dev.connected = false; dev.timer = 0; N.note('device powered on');
        N.later(0.5, () => {
          if (!dev.on) return;
          dev.will = ctl.values.avail;
          N.fly('dev', 'bro', 'CONNECT', () => {
            if (!dev.on) return;
            dev.connected = true; bro.willArmed = dev.will;
            N.note('broker: device connected' + (dev.will ? ', last will registered' : ''));
            announce();
          });
        });
      }
      function restartHA() {
        if (!ha.up) { N.note('Home Assistant is already restarting'); return; }
        ha.up = false; ha.entity = null; ha.value = null; ha.avail = null;
        N.note('Home Assistant stops: its entities are gone');
        N.later(1.8, () => {
          ha.up = true; N.note('Home Assistant starts and subscribes to homeassistant/#');
          if (bro.config) N.fly('bro', 'ha', 'config (retained)', () => { if (ha.up) createEntity(bro.configAvail); });
          if (bro.avail) { const a = bro.avail; N.later(0.2, () => N.fly('bro', 'ha', a + ' (retained)', () => { if (ha.up) ha.avail = a; })); }
          N.later(0.9, () => N.fly('ha', 'bro', 'status: online', () => {
            if (dev.on && dev.connected) N.fly('bro', 'dev', 'status: online', () => {
              if (!dev.on) return;
              if (ctl.values.birth) { N.note('the device saw the birth message and announces again'); announce(); }
              else N.note('the device ignores the birth message');
            });
          }));
        });
      }
      function pull() {
        if (!dev.on) { N.note('the device is already off'); return; }
        dev.on = false; dev.connected = false; N.note('power pulled');
        N.later(2.2, () => {
          if (dev.connected) return;
          if (bro.willArmed) {
            bro.willArmed = false; bro.avail = 'offline'; N.note('broker: the keep-alive ran out, so it publishes the last will');
            N.fly('bro', 'ha', 'offline (will)', () => { if (ha.up) ha.avail = 'offline'; });
          } else N.note('broker: the connection is gone and nothing is published');
        });
      }
      function entityText() {
        if (!ha.up) return ['Home Assistant is stopped', 'bad'];
        if (!ha.entity) return ['no entity', 'faint'];
        if (ha.entity.hasAvail && ha.avail !== 'online') return ['unavailable', 'bad'];
        if (ha.value == null) return ['unknown', 'warn'];
        if (!dev.on && !ha.entity.hasAvail) return [ha.value + ' %  (stale: ' + Math.round(N.t - ha.last) + ' s old)', 'warn'];
        return [ha.value + ' %', 'ok'];
      }
      const loop = kit.loop(dt => {
        N.step(dt);
        if (dev.on && dev.connected) {
          dev.timer += dt;
          if (dev.timer >= 3) {
            dev.timer = 0;
            N.fly('dev', 'bro', 'value', () => {
              if (ha.up) N.fly('bro', 'ha', 'value', () => { if (ha.up && ha.entity) { ha.value = 20 + Math.round(60 * Math.abs(Math.sin(N.t * 0.3))); ha.last = N.t; } });
            });
          }
        }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, v = ctl.values;
        const ny = 52, nx = { dev: W * 0.15, bro: W * 0.5, ha: W * 0.85 };
        S.link(c, nx.dev, ny, nx.bro, ny, { gap: 26, color: dev.connected ? C.ok : C.faint, width: 2 });
        S.link(c, nx.bro, ny, nx.ha, ny, { gap: 26, color: ha.up ? C.ok : C.faint, width: 2 });
        S.node(c, nx.dev, ny, { kind: 'esp', label: 'Device', r: 17, active: dev.connected, dim: !dev.on });
        S.node(c, nx.bro, ny, { kind: 'broker', label: 'Broker', r: 17, active: true });
        S.node(c, nx.ha, ny, { kind: 'home', label: narrow ? 'Home Assistant' : 'Home Assistant', r: 17, active: ha.up, dim: !ha.up });
        N.flights.forEach(f => S.msg(c, nx[f.a], ny, nx[f.b], ny, clamp((N.t - f.t0) / N.FL, 0, 1), { gap: 26, label: f.label, color: f.color || C.accent, r: 4.5 }));
        // what each party remembers
        const gap = 8, pw = (W - 2 * M - 2 * gap) / 3, py = 106, ph = 94;
        const eT = entityText(), ec = eT[1] === 'ok' ? C.ok : eT[1] === 'bad' ? C.bad : eT[1] === 'warn' ? C.warn : C.faint;
        const cards = [
          ['Device', [dev.on ? (dev.connected ? 'powered, connected' : 'powered, connecting') : 'powered off', 'last will: ' + (dev.will && dev.on ? 'registered' : 'none')], C.text],
          ['The broker keeps', ['config: ' + (bro.config ? 'yes, retained' : 'nothing'), 'availability: ' + (bro.avail || 'nothing')], C.text],
          [ha.up ? 'Home Assistant' : 'Home Assistant (stopped)', [ha.entity ? 'sensor.shelf_light_level' : 'no entity yet', eT[0]], ec]
        ];
        cards.forEach(([head, lines, col], i) => {
          const x = M + i * (pw + gap);
          panel(c, C, x, py, pw, ph);
          S.text(c, fit(c, head, pw - 16, 11, 650), x + 8, py + 14, { align: 'left', size: 11, color: C.faint, weight: 650 });
          S.text(c, fit(c, lines[0], pw - 16, 11, 500), x + 8, py + 40, { align: 'left', size: 11, color: i === 2 ? C.text2 : C.text });
          wrap(S, c, lines[1], x + 8, py + 62, pw - 16, 14, { size: 11.5, color: col, weight: i === 2 ? 650 : 500, maxLines: 2 });
        });
        // the log
        const ly = py + ph + 22, rows = Math.max(2, Math.floor((H - ly - 8) / 15));
        S.text(c, 'what happened', M, ly - 6, { align: 'left', size: 10.5, color: C.faint, weight: 600 });
        N.log.slice(-rows).forEach((s, i, a) => S.text(c, fit(c, s, W - 2 * M, 11, 500), M, ly + 12 + i * 15, { align: 'left', size: 11, color: i === a.length - 1 ? C.text : C.muted }));
        ro.set('entity', eT[0]);
        ro.set('dev', dev.on ? (dev.connected ? 'connected to the broker' : 'starting') : 'off');
        ro.set('after', v.retain ? 'the broker hands over the config: the entity returns at once' : v.birth ? 'only the birth message brings it back: the device announces again' : 'the entity stays missing until the device reboots');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ rf-radio-gateway */
  const GW = {
    ble: { name: 'Bluetooth thermometer', short: 'BLE', topic: 'home/gateway/BTtoMQTT/<address>', ok: '{"model":"thermometer","tempc":21.4,"hum":48,"batt":87,"rssi":-67}', raw: '{"id":"A4:C1:38:11:22:33","rssi":-71,"manufacturerdata":"…raw bytes…"}' },
    rf: { name: '433 MHz door sensor', short: '433 MHz', topic: 'home/gateway/433toMQTT', ok: '{"value":1234567,"protocol":1,"length":24}' },
    ir: { name: 'Infrared remote', short: 'infrared', topic: 'home/gateway/IRtoMQTT', ok: '{"value":"0x20DF10EF","protocol":"NEC","bits":32}' }
  };
  Hyper.sim('rf-radio-gateway', {
    title: 'A gateway turns radio messages into MQTT',
    blurb: `Three devices speak in their own way: a Bluetooth thermometer, a 433 MHz door sensor and an infrared remote. A **gateway** (an ESP32 with the right modules) listens and republishes each message on MQTT, where Home Assistant can use it. Only Bluetooth is built into the ESP32; the other two need a module, so untick one to see what happens without it.

The topics and the contents are **illustrative**, in the style of such gateways: the project's documentation has the real names for your version.

**Try this**
- Press each button and read the topic and the payload at the bottom.
- Untick **433 MHz receiver fitted** and press the door sensor: the gateway hears nothing.
- Untick **the gateway knows this sensor**: the Bluetooth message arrives undecoded.
- Press the 433 MHz and infrared buttons twice and compare: the codes are the same each time, which is why anyone nearby can record and repeat them.`,
    mount(box, kit) {
      const S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { aspect: narrow ? 1.25 : 0.72, minH: 420, maxH: 600 });
      const N = netKit();
      let waves = [], last = null, count = { ble: 0, rf: 0, ir: 0 }, deaf = null;
      const ctl = kit.controls(box.side, [
        { id: 'rf', type: 'check', label: '433 MHz receiver fitted', value: true },
        { id: 'ir', type: 'check', label: 'Infrared receiver fitted', value: true },
        { id: 'dec', type: 'check', label: 'The gateway knows this Bluetooth sensor', value: true },
        { type: 'buttons', items: [{ id: 'ble', label: 'Thermometer advertises', primary: true }, { id: 'rf', label: 'Door sensor opens' }, { id: 'ir', label: 'Remote key pressed' }] }
      ], id => { if (GW[id]) fire(id); loop.start(); });
      const ro = kit.readout(box.side, [['heard', 'Last event'], ['topic', 'Topic'], ['count', 'Messages so far']]);
      const heard = k => k === 'ble' || (k === 'rf' ? ctl.values.rf : ctl.values.ir);
      function fire(k) {
        waves.push({ k, t0: N.t });
        deaf = null;
        N.later(0.8, () => {
          if (!heard(k)) { deaf = k; last = { k, text: 'nothing heard: this gateway has no ' + GW[k].short + ' receiver', bad: true }; return; }
          const decoded = k !== 'ble' || ctl.values.dec;
          last = { k, topic: GW[k].topic, payload: decoded ? GW[k].ok : GW[k].raw, fixed: k !== 'ble' };
          count[k]++;
          N.fly('gw', 'bro', 'MQTT', () => N.fly('bro', 'ha', 'MQTT', () => {}));
        });
      }
      const loop = kit.loop(dt => {
        N.step(dt);
        waves = waves.filter(w => N.t - w.t0 < 0.9);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10;
        const rowY = [52, 112, 172], X = { src: W * 0.13, gw: W * 0.4, bro: W * 0.66, ha: W * 0.89 }, midY = rowY[1];
        const P = { gw: [X.gw, midY], bro: [X.bro, midY], ha: [X.ha, midY] };
        ['ble', 'rf', 'ir'].forEach((k, i) => {
          const y = rowY[i], on = waves.some(w => w.k === k), fitted = heard(k);
          S.link(c, X.src, y, X.gw, midY, { wireless: true, gap: 22, color: fitted ? C.faint : C.bad });
          S.node(c, X.src, y, { kind: 'sensor', label: '', r: 12, color: [212, 40, 290][i], active: on });
          S.text(c, GW[k].name, X.src, y + 22, { size: 10, color: C.text2, weight: 600 });
        });
        waves.forEach(w => { const i = ['ble', 'rf', 'ir'].indexOf(w.k), f = (N.t - w.t0) / 0.8; S.msg(c, X.src, rowY[i], X.gw, midY, clamp(f, 0, 1), { gap: 22, color: [kit.hue(212), kit.hue(40), kit.hue(290)][i], r: 4 }); });
        S.link(c, X.gw, midY, X.bro, midY, { gap: 22, color: C.muted, width: 2 });
        S.link(c, X.bro, midY, X.ha, midY, { gap: 22, color: C.muted, width: 2 });
        S.node(c, X.gw, midY, { kind: 'gateway', label: 'Gateway', sub: 'ESP32', r: 18, active: waves.length > 0 });
        S.node(c, X.bro, midY, { kind: 'broker', label: 'Broker', r: 16 });
        S.node(c, X.ha, midY, { kind: 'home', label: narrow ? 'HA' : 'Home Assistant', r: 16 });
        N.flights.forEach(f => S.msg(c, P[f.a][0], P[f.a][1], P[f.b][0], P[f.b][1], clamp((N.t - f.t0) / N.FL, 0, 1), { gap: 22, label: f.label, color: C.accent, r: 4.5 }));
        // the modules of the gateway
        const my = rowY[2] + 44, mw = (W - 2 * M - 16) / 3;
        [['ble', 'Bluetooth', 'built into the chip', true], ['rf', '433 MHz', ctl.values.rf ? 'receiver module fitted' : 'no module', ctl.values.rf], ['ir', 'Infrared', ctl.values.ir ? 'receiver module fitted' : 'no module', ctl.values.ir]].forEach(([k, name, sub, ok], i) => {
          S.box(c, M + i * (mw + 8), my, mw, 40, { label: name, sub: fit(c, sub, mw - 10, 10), color: ok ? C.ok : C.bad, dash: !ok, size: 12 });
        });
        // the last message
        const ty = my + 56, th = Math.max(70, H - ty - 8);
        panel(c, C, M, ty, W - 2 * M, th);
        S.text(c, 'the last message', M + 10, ty + 14, { align: 'left', size: 10.5, color: C.faint, weight: 600 });
        if (!last) wrap(S, c, 'Press a button to send an event.', M + 10, ty + 36, W - 2 * M - 20, 15, { size: 11.5, color: C.muted });
        else if (last.bad) wrap(S, c, last.text, M + 10, ty + 36, W - 2 * M - 20, 15, { size: 11.5, color: C.bad, weight: 600 });
        else {
          S.text(c, fit(c, last.topic, W - 2 * M - 20, 11, 600, true), M + 10, ty + 34, { align: 'left', size: 11, mono: true, color: C.accent });
          const yy = wrap(S, c, last.payload, M + 10, ty + 54, W - 2 * M - 20, 14.5, { size: 11, color: C.text, maxLines: 3 });
          if (last.fixed) wrap(S, c, 'The same code every time: anyone nearby can record it and send it again.', M + 10, yy + 6, W - 2 * M - 20, 14, { size: 10.5, color: C.warn, maxLines: 2 });
        }
        ro.set('heard', last ? (last.bad ? 'not heard' : GW[last.k].name) : '—');
        ro.set('topic', last && !last.bad ? last.topic : '—');
        ro.set('count', count.ble + ' Bluetooth · ' + count.rf + ' 433 MHz · ' + count.ir + ' infrared');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ rf-cnc-machine */
  const CNC_PROGRAMS = {
    square: { name: 'Square, 40 mm', start: [0, 0], pts: [[40, 0], [40, 40], [0, 40], [0, 0]] },
    diamond: { name: 'Diamond', start: [20, 0], pts: [[40, 20], [20, 40], [0, 20], [20, 0]] },
    triangle: { name: 'Triangle', start: [0, 0], pts: [[40, 0], [20, 35], [0, 0]] }
  };
  Hyper.sim('rf-cnc-machine', {
    title: 'G-code in, step pulses out',
    blurb: `A CNC controller turns lines of G-code into a path, a speed profile and step pulses. The tool follows the program on the table; below it are the speed against time and, for the two axes, the step pulses at this instant (a *zoom*: the time window is shown, and the pulse width is exaggerated).

The model is simplified: each move starts and ends at rest, with constant acceleration to the feed rate. A real planner slows only as much as a corner needs. The feed rate is capped by the **maximum rate** setting, and the step rate must stay within what the **driver** can follow.

**Try this**
- Raise the **feed rate** until the cruise flat disappears from the graph: the move never reaches the feed rate and is a triangle.
- Change **steps per millimetre** from 80 to 1600 at the same feed: the pulses come twenty times faster.
- Lower the **driver limit** below the step rate in the read-out: steps would be lost.
- Run the diamond: on a diagonal each axis steps more slowly.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { aspect: narrow ? 2.0 : 0.82, minH: 460, maxH: 760 });
      let Tp = 0;
      const ctl = kit.controls(box.side, [
        { id: 'prog', type: 'select', label: 'G-code program', options: Object.keys(CNC_PROGRAMS).map(k => [CNC_PROGRAMS[k].name, k]), value: 'square' },
        { id: 'feed', label: 'Feed rate F', min: 200, max: 9000, step: 100, value: 3000, unit: 'mm/min', log: true },
        { id: 'maxrate', label: 'max_rate_mm_per_min', min: 500, max: 10000, step: 100, value: 5000, unit: 'mm/min' },
        { id: 'acc', label: 'Acceleration', min: 20, max: 1000, step: 10, value: 150, unit: 'mm/s²', log: true },
        { id: 'spm', type: 'select', label: 'Steps per millimetre', options: [['80 (belt, 16 microsteps)', 80], ['400 (8 mm lead screw)', 400], ['1600 (2 mm lead screw)', 1600]], value: 80 },
        { id: 'drv', label: 'Step rate the driver can follow', min: 5, max: 100, step: 1, value: 40, unit: 'kHz' },
        { id: 'speed', label: 'Playback speed', min: 1, max: 30, step: 1, value: 4, unit: '×' }
      ], () => { Tp = 0; loop.once(); });
      const ro = kit.readout(box.side, [['feed', 'Feed used'], ['cruise', 'Step rate at cruise'], ['now', 'Step rate now (fastest axis)'], ['time', 'Program time'], ['driver', 'Driver']]);
      // the program as moves: lengths, directions, trapezoids and cumulative times
      function model() {
        const v = ctl.values, P = CNC_PROGRAMS[v.prog] || CNC_PROGRAMS.square, vmax = Math.min(v.feed, v.maxrate) / 60;
        let p = P.start, T = 0;
        const segs = P.pts.map(q => {
          const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1e-9;
          const m = E.move(L, vmax, v.acc), s = { a: p, b: q, L, ux: dx / L, uy: dy / L, m, t0: T, t1: T + m.tTotal };
          T += m.tTotal; p = q; return s;
        });
        return { P, segs, T, vmax };
      }
      const at = (M, tt) => {
        const s = M.segs.find(q => tt < q.t1) || M.segs[M.segs.length - 1], r = s.m.at(clamp(tt - s.t0, 0, s.m.tTotal));
        return { s, d: r.x, v: Math.abs(r.v), x: s.a[0] + s.ux * r.x, y: s.a[1] + s.uy * r.x, i: M.segs.indexOf(s) };
      };
      const loop = kit.loop(dt => {
        const v = ctl.values, M = model(), total = M.T + 1.2;
        Tp = (Tp + dt * v.speed) % total;
        const tt = Math.min(Tp, M.T), cur = at(M, tt);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, Mg = 10;
        // layout
        const wide = !narrow, mapS = wide ? Math.min(W * 0.4, H * 0.62) : Math.min(W - 2 * Mg, H * 0.34);
        const mapX = Mg + (wide ? 0 : (W - 2 * Mg - mapS) / 2), mapY = 14;
        const rx = wide ? mapX + mapS + 22 : Mg, rw = wide ? W - rx - Mg : W - 2 * Mg;
        // the table
        const mm = u => mapS / 50 * u, TX = x => mapX + 5 * mapS / 50 + mm(x), TY = y => mapY + mapS - 5 * mapS / 50 - mm(y);
        panel(c, C, mapX, mapY, mapS, mapS);
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let g = 0; g <= 40; g += 10) { c.beginPath(); c.moveTo(TX(g), TY(0)); c.lineTo(TX(g), TY(40)); c.moveTo(TX(0), TY(g)); c.lineTo(TX(40), TY(g)); c.stroke(); }
        S.text(c, 'X, mm', mapX + mapS - 8, TY(0) + 11, { align: 'right', size: 9.5, color: C.faint });
        S.text(c, 'Y', mapX + 10, mapY + 11, { align: 'left', size: 9.5, color: C.faint });
        // the path, with the part already cut stronger
        c.lineWidth = 2; c.strokeStyle = C.faint; c.beginPath(); c.moveTo(TX(M.P.start[0]), TY(M.P.start[1]));
        M.segs.forEach(s => c.lineTo(TX(s.b[0]), TY(s.b[1]))); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(TX(M.P.start[0]), TY(M.P.start[1]));
        M.segs.forEach((s, i) => { if (i < cur.i) c.lineTo(TX(s.b[0]), TY(s.b[1])); });
        c.lineTo(TX(cur.x), TY(cur.y)); c.stroke();
        kit.dot(c, TX(cur.x), TY(cur.y), 5.5, C.warn, C.bg);
        // the program text
        const feedTxt = Math.round(v.feed);
        const lines = ['G21 G90', 'G0 X' + M.P.start[0] + ' Y' + M.P.start[1]].concat(M.segs.map((s, i) => 'G1 ' + (s.b[0] !== s.a[0] ? 'X' + s.b[0] + ' ' : '') + (s.b[1] !== s.a[1] ? 'Y' + s.b[1] + ' ' : '') + (i === 0 ? 'F' + feedTxt : '')).map(s => s.trim()));
        const gy = wide ? mapY : mapY + mapS + 14, gh = 16 + lines.length * 15;
        panel(c, C, rx, gy, rw, gh);
        lines.forEach((l, i) => {
          const hot = i === cur.i + 2, y = gy + 14 + i * 15;
          if (hot) { c.fillStyle = C.dark ? 'rgba(224,160,48,.3)' : 'rgba(224,160,48,.25)'; c.fillRect(rx + 3, y - 7.5, rw - 6, 15); }
          S.text(c, l, rx + 10, y, { align: 'left', size: 11, mono: true, color: hot ? C.text : C.muted, weight: hot ? 650 : 500 });
        });
        // the speed profile
        const sy = gy + gh + 22, sh = wide ? Math.max(50, Math.min(90, (H - sy) * 0.3)) : 56, sx = rx + 34, sw = rw - 40;
        const top = Math.max(M.vmax * 1.15, 1);
        const sp = S.analog(c, sx, sy, sw, sh, t => at(M, t).v, { t0: 0, t1: M.T, min: 0, max: top, label: null, steps: 160 });
        S.text(c, 'speed along the path, mm/s', rx, sy - 8, { align: 'left', size: 10, color: C.faint });
        S.text(c, kit.fmt(top, 2), sx - 4, sy + 5, { align: 'right', size: 9, color: C.faint });
        S.text(c, '0', sx - 4, sy + sh - 3, { align: 'right', size: 9, color: C.faint });
        const cx = sp.X(tt); c.strokeStyle = C.warn; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, sy); c.lineTo(cx, sy + sh); c.stroke();
        kit.dot(c, cx, sp.Y(cur.v), 4, C.warn);
        // the pulses at this instant
        const ax = Math.abs(cur.s.ux) * cur.v * v.spm, ay = Math.abs(cur.s.uy) * cur.v * v.spm, fast = Math.max(ax, ay);
        const win = clamp(14 / Math.max(fast, 1), 0.0003, 0.05), py0 = sy + sh + 34, ph = 16;
        S.text(c, 'step pulses now · window ' + (win >= 0.001 ? kit.fmt(win * 1000, 2) + ' ms' : kit.fmt(win * 1e6, 3) + ' µs') + ' · pulse width exaggerated', rx, py0 - 8, { align: 'left', size: 10, color: C.faint });
        [['X step', ax, cur.d * Math.abs(cur.s.ux) * v.spm], ['Y step', ay, cur.d * Math.abs(cur.s.uy) * v.spm]].forEach(([label, rate, steps], i) => {
          const y = py0 + i * (ph + 14);
          const edges = [];
          if (rate > 1) for (let k = 0; k < 400; k++) { const t1 = (k - frac1(steps)) / rate; if (t1 > win) break; if (t1 + 0.45 / rate < 0) continue; edges.push([Math.max(0, t1), 1], [t1 + 0.45 / rate, 0]); }
          S.wave(c, rx + 46, y, rw - 52, ph, edges.length ? edges : [[0, 0], [win, 0]], { t0: 0, t1: win, idle: 0, label });
          S.text(c, rate >= 1000 ? kit.fmt(rate / 1000, 3) + ' kHz' : kit.fmt(rate, 3) + ' Hz', rx + rw, y - 3, { align: 'right', size: 9.5, color: C.muted });
        });
        // the numbers
        const peak = M.vmax * v.spm * Math.max(...M.segs.map(s => Math.max(Math.abs(s.ux), Math.abs(s.uy))));
        ro.set('feed', kit.fmt(Math.min(v.feed, v.maxrate), 4) + ' mm/min' + (v.feed > v.maxrate ? ' (capped by max_rate)' : ''));
        ro.set('cruise', kit.fmt(peak / 1000, 3) + ' kHz');
        ro.set('now', kit.fmt(fast / 1000, 3) + ' kHz');
        ro.set('time', kit.fmt(M.T, 3) + ' s' + (M.segs.every(s => s.m.triangle) ? ' (never reaches the feed rate)' : ''));
        ro.set('driver', peak / 1000 > v.drv ? 'cannot follow ' + kit.fmt(peak / 1000, 3) + ' kHz: steps would be lost' : 'keeps up (limit ' + v.drv + ' kHz)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });
  /* ================================================================ rf-voice-states */
  const VOICE = { start: 'IDLE', states: {
    IDLE: { entry: 'listen for the wake word', on: { WAKE: 'STREAMING', MUTE: 'MUTED' } },
    STREAMING: { entry: 'stream the microphone', on: { END_OF_SPEECH: 'WAITING', SERVER_LOST: 'ERROR', MUTE: 'MUTED' }, after: { 8000: 'IDLE' } },
    WAITING: { entry: 'wait for the answer', on: { REPLY: 'SPEAKING', SERVER_LOST: 'ERROR' }, after: { 10000: 'ERROR' } },
    SPEAKING: { entry: 'play the reply', on: { DONE: 'IDLE' } },
    ERROR: { entry: 'play the error sound', after: { 2000: 'IDLE' } },
    MUTED: { entry: 'microphone disconnected', on: { UNMUTE: 'IDLE' } }
  } };
  const VOICE_LAYOUT = { IDLE: [0.14, 0.5], STREAMING: [0.46, 0.12], WAITING: [0.86, 0.12], SPEAKING: [0.86, 0.62], ERROR: [0.46, 0.62], MUTED: [0.14, 0.92] };
  const VOICE_BENDS = { 'WAITING>ERROR': [34, -34], 'STREAMING>IDLE': 26, 'IDLE>STREAMING': 26 };
  function findArrow(dia, from, to, why) {
    const ts = dia.transitions;
    let i = ts.findIndex(t => t.from === from && t.to === to && t.ev === why);
    if (i < 0 && /^after/.test(String(why))) i = ts.findIndex(t => t.from === from && t.to === to && /^after/.test(t.ev));
    if (i < 0) i = ts.findIndex(t => t.from === from && t.to === to);
    return i;
  }
  Hyper.sim('rf-voice-states', {
    title: 'A voice satellite as a state machine',
    blurb: `The diagram is the satellite's behaviour: it **listens** for the wake word, **streams** the sentence, **waits** for the server, **speaks** the reply, and has a way back to listening from every state, even **ERROR** and **MUTED**. The clock can run faster than real time. The times (8 s of streaming at most, 10 s of waiting) are examples, not the settings of any product.

**Try this**
- Press **Say the wake word**, then **The speaker stops**: the server answers after its thinking time and the reply is played.
- Untick **Server reachable** and say the wake word: the machine goes to ERROR and comes back by itself.
- Raise the **server thinking time** above 10 s: WAITING times out. Without that timeout the satellite would hang.
- Switch **Mute** on: the wake word is ignored, whatever else happens.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { aspect: narrow ? 1.5 : 0.82, minH: 460, maxH: 660 });
      const def = JSON.parse(JSON.stringify(VOICE));
      const dia = E.fsmDiagram(def, VOICE_LAYOUT);
      const seen = {};
      for (const tr of dia.transitions) { const k = tr.from + '>' + tr.to, n = seen[k] = (seen[k] || 0) + 1, b = VOICE_BENDS[k]; if (b != null) tr.bend = Array.isArray(b) ? b[n - 1] : b; }
      let idx = -1, flash = 99, sent = 0, pendingMute = false;
      const m = E.fsm(def, { onChange(from, to, why) { idx = findArrow(dia, from, to, why); flash = 0; } });
      const send = ev => { const ok = m.send(ev); if (!ok) m.log.push({ t: m.now, error: ev + ' ignored in ' + m.state }); return ok; };
      const ctl = kit.controls(box.side, [
        { id: 'server', type: 'check', label: 'Server reachable', value: true },
        { id: 'mute', type: 'check', label: 'Mute switch on', value: false },
        { id: 'think', label: 'Server thinking time', min: 0.5, max: 15, step: 0.5, value: 3, unit: 's' },
        { id: 'speed', label: 'Clock speed', min: 1, max: 10, step: 1, value: 2, unit: '×' },
        { type: 'buttons', items: [{ id: 'wake', label: 'Say the wake word', primary: true }, { id: 'stop', label: 'The speaker stops' }, { id: 'reset', label: 'Reset' }] }
      ], (id, value) => {
        if (id === 'wake') send('WAKE');
        else if (id === 'stop') send('END_OF_SPEECH');
        else if (id === 'mute') { if (value) { if (!m.send('MUTE')) pendingMute = true; } else { pendingMute = false; m.send('UNMUTE'); } }
        else if (id === 'reset') { m.reset(); idx = -1; flash = 99; sent = 0; pendingMute = !!ctl.values.mute; }
        loop.start();
      });
      const ro = kit.readout(box.side, [['state', 'State'], ['t', 'Time in this state'], ['mic', 'Microphone'], ['sent', 'Audio sent to the server']]);
      const fmtS = ms => (ms / 1000).toFixed(1) + ' s';
      const loop = kit.loop(dt => {
        const v = ctl.values, h = dt * v.speed;
        if (pendingMute && m.state === 'IDLE') { pendingMute = false; m.send('MUTE'); }
        if (!v.server && (m.state === 'STREAMING' || m.state === 'WAITING')) send('SERVER_LOST');
        if (m.state === 'WAITING' && v.server && m.inState() >= v.think * 1000) send('REPLY');
        if (m.state === 'SPEAKING' && m.inState() >= 3000) send('DONE');
        if (m.state === 'STREAMING') sent += 32000 * h;
        m.tick(h * 1000);
        flash += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, s = m.state;
        const dz = narrow ? { x: M, y: M, w: W - 2 * M, h: H * 0.5 } : { x: M, y: M, w: W - 2 * M, h: H * 0.56 };
        S.fsm(c, dia, { box: dz, active: s, fired: flash < 1.6 ? idx : -1, pulse: flash / 0.7, rw: narrow ? 40 : 46 });
        // the microphone and the log
        const my = dz.y + dz.h + 16, micOn = s === 'IDLE' || s === 'STREAMING';
        S.led(c, M + 14, my + 6, { color: micOn ? 140 : 4, on: micOn || s === 'MUTED', r: 8 });
        S.text(c, s === 'MUTED' ? 'microphone disconnected by the mute switch' : s === 'STREAMING' ? 'microphone open: audio goes to the server' : s === 'IDLE' ? 'listening for the wake word (audio stays on the device)' : 'microphone not streaming', M + 30, my + 6, { align: 'left', size: 11.5, color: C.text2 });
        const ly = my + 30, rows = Math.max(2, Math.floor((H - ly - 8) / 15));
        S.text(c, 'what happened', M, ly - 4, { align: 'left', size: 10.5, color: C.faint, weight: 600 });
        const lines = m.log.slice(-rows);
        const maxc = Math.max(18, Math.floor((W - 2 * M) / 6.2));
        if (!lines.length) S.text(c, 'nothing yet', M, ly + 13, { align: 'left', size: 11, color: C.faint });
        lines.forEach((e, i) => {
          let txt = e.error ? e.error : fmtS(e.t) + '   ' + e.from + ' → ' + e.to + '   (' + e.why + ')';
          if (txt.length > maxc) txt = txt.slice(0, maxc - 1) + '…';
          S.text(c, txt, M, ly + 13 + i * 15, { align: 'left', size: 11, color: e.error ? C.bad : i === lines.length - 1 ? C.text : C.muted });
        });
        ro.set('state', s);
        ro.set('t', fmtS(m.inState()));
        ro.set('mic', s === 'MUTED' ? 'off (muted)' : micOn ? (s === 'STREAMING' ? 'streaming' : 'listening locally') : 'not streaming');
        ro.set('sent', kit.fmt(sent / 1000, 3) + ' kB (16 kHz, 16 bit, mono)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ rf-stream-buffer */
  Hyper.sim('rf-stream-buffer', {
    title: 'The buffer between the stream and the speaker',
    blurb: `Data arrives from the network into a **buffer**; the decoder takes it out at the stream's bit rate. The graph shows the buffer's fill over the last minute (simulated time); red bands are Wi-Fi **stalls**, and amber marks are **underruns**, when the buffer ran dry and the sound stopped. After an underrun the player waits until a quarter of the buffer is full before playing again.

An **internet radio** is live: after a stall the server cannot send much faster than real time (here 1.3 times the bit rate), so the buffer refills slowly. A server on **your own network** can refill at once (here 20 times). The memory choices are assumptions: about 100 kB of free RAM once the decoder and Wi-Fi have taken theirs, or a PSRAM module.

**Try this**
- Leave the radio at 128 kbit/s with 128 kB and a 3 s stall: the buffer holds 8 s, so nothing is heard.
- Raise the bit rate to FLAC: the same buffer lasts a fraction of the time and the stalls bite.
- Pick **internal RAM only** and a big buffer: the buffer is capped by the memory.
- Make stalls frequent with the radio: the buffer never recovers. Switch to your own server.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { aspect: narrow ? 1.2 : 0.7, minH: 400, maxH: 580 });
      const SPAN = 60;
      let t = 0, fill = 0, playing = false, under = 0, hist = [], marks = [], silent = false;
      const ctl = kit.controls(box.side, [
        { id: 'rate', type: 'select', label: 'Stream', options: [['MP3 128 kbit/s', 128], ['MP3 320 kbit/s', 320], ['FLAC, about 900 kbit/s', 900], ['CD sound, uncompressed 1411 kbit/s', 1411]], value: 128 },
        { id: 'src', type: 'select', label: 'Source', options: [['Internet radio (live)', 'radio'], ['A server on your own network', 'lan']], value: 'radio' },
        { id: 'mem', type: 'select', label: 'Memory for the buffer', options: [['internal RAM only (about 100 kB, assumed)', 100], ['PSRAM, 2 MB', 2048], ['PSRAM, 8 MB', 8192]], value: 100 },
        { id: 'buf', label: 'Buffer size wanted', min: 16, max: 4096, step: 8, value: 128, unit: 'kB', log: true },
        { id: 'stall', label: 'Wi-Fi stall length', min: 0, max: 10, step: 0.5, value: 3, unit: 's' },
        { id: 'every', label: 'Stalls per minute', min: 0, max: 6, step: 1, value: 1 },
        { id: 'speed', label: 'Clock speed', min: 1, max: 10, step: 1, value: 3, unit: '×' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again' }] }
      ], id => { if (id === 'reset') { t = 0; fill = 0; playing = false; under = 0; hist = []; marks = []; silent = false; } loop.once(); });
      const ro = kit.readout(box.side, [['cap', 'Buffer in use'], ['hold', 'Playing time it holds'], ['need', 'Needed for one stall'], ['under', 'Underruns so far'], ['psram', 'PSRAM can be fitted to']]);
      const stalled = tt => { const v = ctl.values; if (v.every <= 0 || v.stall <= 0 || tt < 8) return false; const per = 60 / v.every; return ((tt - 8) % per) < v.stall; };
      const psramChips = (E.CHIPS || []).filter(x => !x.coproc && x.psramMax).map(x => (x.id === 'esp32' ? 'ESP32' : String(x.id).replace('esp32-', '').toUpperCase()));
      const loop = kit.loop(dt => {
        const v = ctl.values, cap = Math.min(v.buf, v.mem), bps = v.rate / 8;     // kB per second
        const fillRate = bps * (v.src === 'radio' ? 1.3 : 20);
        let left = dt * v.speed;
        while (left > 1e-9) {
          const h = Math.min(0.05, left); left -= h; t += h;
          if (!stalled(t)) fill = Math.min(cap, fill + fillRate * h);
          if (fill > cap) fill = cap;
          if (playing) {
            fill -= bps * h;
            if (fill <= 0) { fill = 0; playing = false; under++; silent = true; marks.push([t, t]); }
          } else if (fill >= Math.max(cap * 0.25, Math.min(cap, bps * 1.0))) { playing = true; silent = false; }
          if (silent && marks.length) marks[marks.length - 1][1] = t;
          hist.push([t, fill]);
        }
        while (hist.length && hist[0][0] < t - SPAN - 1) hist.shift();
        while (marks.length && marks[0][1] < t - SPAN - 1) marks.shift();
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10;
        // the pipe
        const bw = (W - 2 * M - 4 * 12) / 5, by = 12, bh = 46;
        const names = [['Server', 'the stream'], ['Wi-Fi', stalled(t) ? 'STALLED' : 'flowing'], ['Buffer', Math.round(fill) + ' of ' + Math.round(cap) + ' kB'], ['Decoder', playing ? 'MP3 / FLAC' : 'starved'], ['I2S + DAC', playing ? 'sound' : 'silence']];
        const xs = names.map((_, i) => M + i * (bw + 12));
        names.forEach(([a, b], i) => {
          const bad = (i === 1 && stalled(t)) || ((i === 3 || i === 4) && !playing);
          S.box(c, xs[i], by, bw, bh, { label: fit(c, a, bw - 6, 12, 600), sub: fit(c, b, bw - 6, 10), color: bad ? C.bad : i === 2 ? C.accent : C.muted, active: i === 2, size: 12 });
          if (i < 4) S.wire(c, [[xs[i] + bw, by + bh / 2], [xs[i + 1], by + bh / 2]], { color: bad ? C.bad : C.faint, width: 2 });
        });
        // the fill of the buffer
        const fy = by + bh + 10;
        c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'; c.fillRect(xs[2], fy, bw, 8);
        c.fillStyle = fill < cap * 0.1 ? C.bad : C.accent; c.fillRect(xs[2], fy, bw * clamp(fill / Math.max(cap, 1), 0, 1), 8);
        // the graph
        const gx = M + 40, gy = fy + 40, gw = W - gx - M, gh = Math.max(110, H - gy - 54), t0 = t - SPAN;
        c.fillStyle = C.dark ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.03)'; c.fillRect(gx, gy, gw, gh);
        const X = tt => gx + clamp((tt - t0) / SPAN, 0, 1) * gw;
        for (let k = Math.floor(Math.max(0, t0) / 1) - 1; k <= Math.ceil(t) + 1; k++) {
          // stalls are periodic: draw the bands that fall in the window
          if (!stalled(k + 0.001) || stalled(k - 0.999)) continue;
          let e = k; while (e < t + 12 && stalled(e + 0.05)) e += 0.25;
          c.fillStyle = C.dark ? 'rgba(229,72,77,.25)' : 'rgba(229,72,77,.16)'; c.fillRect(X(k), gy, Math.max(1, X(Math.min(e, t)) - X(k)), gh);
        }
        marks.forEach(([a, b]) => { c.fillStyle = C.warn; c.fillRect(X(a), gy + gh - 6, Math.max(2, X(b) - X(a)), 6); });
        S.analog(c, gx, gy, gw, gh, hist, { t0, t1: t, min: 0, max: Math.max(cap, 1), label: null });
        S.text(c, kit.fmt(cap, 3) + ' kB', gx - 4, gy + 6, { align: 'right', size: 9.5, color: C.faint });
        S.text(c, '0', gx - 4, gy + gh - 4, { align: 'right', size: 9.5, color: C.faint });
        S.text(c, 'buffer fill, last 60 s (simulated)', gx, gy - 8, { align: 'left', size: 10, color: C.faint });
        S.text(c, 'red: Wi-Fi stalled', gx + gw, gy - 8, { align: 'right', size: 10, color: C.bad });
        S.text(c, playing ? 'playing' : silent ? 'SILENCE: the buffer ran dry' : 'filling before it starts', gx, gy + gh + 16, { align: 'left', size: 11.5, color: playing ? C.ok : silent ? C.bad : C.warn, weight: 650 });
        S.text(c, 'amber marks: underruns', gx + gw, gy + gh + 16, { align: 'right', size: 10, color: C.warn });
        const hold = cap / bps, need = v.stall * bps;
        ro.set('cap', kit.fmt(cap, 3) + ' kB' + (v.buf > v.mem ? ' (capped by the memory)' : ''));
        ro.set('hold', kit.fmt(hold, 3) + ' s');
        ro.set('need', v.stall > 0 ? kit.fmt(need, 3) + ' kB for ' + kit.fmt(v.stall, 2) + ' s' + (need > cap ? ': more than the buffer holds' : ': it fits') : 'no stalls set');
        ro.set('under', String(under));
        ro.set('psram', psramChips.length ? psramChips.join(', ') : 'not in the catalogue');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ rf-web-flash */
  const WF_CHIPS = ['ESP32', 'ESP32-S2', 'ESP32-S3', 'ESP32-C3', 'ESP32-C6', 'ESP32-H2', 'ESP8266'];
  const WF_BOOT = { 'ESP32': 0x1000, 'ESP32-S2': 0x1000, 'ESP32-S3': 0, 'ESP32-C3': 0, 'ESP32-C6': 0, 'ESP32-H2': 0, 'ESP8266': 0 };
  const WF_SETS = { a: ['ESP32', 'ESP32-C3'], b: ['ESP32-S3', 'ESP32-C6'], all: WF_CHIPS };
  const hex = n => '0x' + n.toString(16).toUpperCase();
  const WF_STEPS = ['Browser offers Web Serial', 'Page is a secure context', 'You choose a serial port', 'Chip enters download mode', 'Manifest has a build for the chip', 'Parts are written', 'Board resets and runs'];
  Hyper.sim('rf-web-flash', {
    title: 'Flashing from the browser, step by step',
    blurb: `Seven things must be true for a web page to flash a board. Describe your set-up and press **Install**: the steps tick off until one fails, and the panels show what the page's **manifest** says and where each part lands in flash.

The flash map shows the usual Arduino-style layout (a bootloader, the partition table at 0x8000, the boot data at 0xE000, the program at 0x10000) for the separate-parts case, with the chip's own bootloader address; a project that publishes a single merged *factory image* needs only one part, at address 0. Check your own project's files: this is a picture of the idea.

**Try this**
- Press Install with the defaults, then choose **ESP32-S3**: the manifest has no build for it.
- Choose **Firefox**, or **plain HTTP**: it stops before it ever looks at a port.
- Choose a **charge-only cable**: the port list is empty.
- Switch the build to **separate parts** and compare the flash map of an ESP32 with that of an ESP32-C3.`,
    mount(box, kit) {
      const S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { aspect: narrow ? 1.6 : 0.7, minH: 440, maxH: 680 });
      let run = null;
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'The board has', options: WF_CHIPS.map(x => [x, x]), value: 'ESP32-C3' },
        { id: 'set', type: 'select', label: 'The manifest has builds for', options: [['ESP32 and ESP32-C3', 'a'], ['ESP32-S3 and ESP32-C6', 'b'], ['every chip family', 'all']], value: 'a' },
        { id: 'image', type: 'select', label: 'Each build is', options: [['one factory image at 0', 'factory'], ['separate parts', 'parts']], value: 'factory' },
        { id: 'browser', type: 'select', label: 'Browser', options: [['Chrome or Edge on a computer', 'chromium'], ['Firefox on a computer', 'firefox'], ['Safari on a Mac', 'safari']], value: 'chromium' },
        { id: 'page', type: 'select', label: 'The page is', options: [['served over HTTPS', 'https'], ['plain HTTP on the Internet', 'http'], ['a local test server', 'local']], value: 'https' },
        { id: 'board', type: 'select', label: 'The board is', options: [['on a data cable, ready', 'ok'], ['on a charge-only cable', 'charge'], ['not in download mode', 'nodl']], value: 'ok' },
        { type: 'buttons', items: [{ id: 'run', label: 'Install', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'run') { run = { t: 0, fail: failAt(), over: false }; loop.start(); return; }
        run = null; loop.once();
      });
      const ro = kit.readout(box.side, [['at', 'Result'], ['why', 'Because']]);
      function verdict() {
        const v = ctl.values;
        if (v.browser !== 'chromium') return [0, 'This browser has no Web Serial interface, so the page cannot open a port.'];
        if (v.page === 'http') return [1, 'Web Serial is offered only to a secure page: HTTPS, or a local address for testing.'];
        if (v.board === 'charge') return [2, 'A charge-only cable has no data wires, so the browser lists no port.'];
        if (v.board === 'nodl') return [3, 'The tool could not put the chip into download mode. Hold BOOT, tap RESET, and try again.'];
        if (!(WF_SETS[v.set] || []).includes(v.chip)) return [4, 'The manifest has no build for ' + v.chip + ', so nothing is written: it cannot flash the wrong file.'];
        return [-1, 'All checks pass: the parts are written and the board restarts into the new firmware.'];
      }
      const failAt = () => verdict()[0];
      const progress = () => {
        if (!run) return { idx: -1, frac: 0, done: false };
        const per = 0.65, n = WF_STEPS.length, f = run.fail, k = run.t / per;
        if (f >= 0 && k >= f + 0.6) return { idx: f, frac: 1, done: true, failed: true };
        if (f < 0 && k >= n) return { idx: n, frac: 1, done: true, failed: false };
        return { idx: Math.floor(k), frac: k - Math.floor(k), done: false };
      };
      function parts() {
        const v = ctl.values;
        if (v.image === 'factory' || v.chip === 'ESP8266') return [[0, v.chip === 'ESP8266' ? 'firmware' : 'factory image: bootloader, table, program']];
        return [[WF_BOOT[v.chip] || 0, 'bootloader'], [0x8000, 'partition table'], [0xE000, 'boot data (otadata)'], [0x10000, 'program']];
      }
      const loop = kit.loop(dt => {
        if (run && !run.over) { run.t += dt; if (progress().done) run.over = true; }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, p = progress(), v = ctl.values, n = WF_STEPS.length;
        const wide = !narrow, lw = wide ? (W - 2 * M - 10) * 0.44 : W - 2 * M, rowH = 30;
        // the checklist
        panel(c, C, M, M, lw, n * rowH + 16);
        WF_STEPS.forEach((s, i) => {
          const y = M + 8 + i * rowH + rowH / 2, state = !run ? 'todo' : p.failed && i === p.idx ? 'fail' : (i < p.idx || (p.done && !p.failed)) ? 'done' : i === p.idx ? 'active' : 'todo';
          const col = state === 'done' ? C.ok : state === 'fail' ? C.bad : state === 'active' ? C.accent : C.faint;
          S.text(c, state === 'done' ? '✓' : state === 'fail' ? '✕' : String(i + 1), M + 18, y, { size: 13, color: col, weight: 700 });
          S.text(c, fit(c, s, lw - 50, 12, state === 'todo' ? 500 : 650), M + 36, y, { align: 'left', size: 12, color: state === 'todo' ? C.muted : C.text, weight: state === 'todo' ? 500 : 650 });
        });
        const msgY = M + n * rowH + 28;
        let head, hc, msg;
        if (!run) { head = 'Press Install'; hc = C.muted; msg = 'The checks run in this order; the first that fails stops the install.'; }
        else if (!p.done) { head = 'Working …'; hc = C.accent; msg = WF_STEPS[Math.min(p.idx, n - 1)]; }
        else if (p.failed) { head = 'Stopped at step ' + (p.idx + 1); hc = C.bad; msg = verdict()[1]; }
        else { head = 'Installed'; hc = C.ok; msg = verdict()[1]; }
        S.text(c, head, M + 4, msgY, { align: 'left', size: 12.5, color: hc, weight: 650 });
        const mEnd = wrap(S, c, msg, M + 4, msgY + 20, lw - 8, 15, { size: 11.5, color: C.text, maxLines: 4 });
        // the manifest and the flash map
        const rx = wide ? M + lw + 10 : M, rw = wide ? W - rx - M : W - 2 * M, ry = wide ? M : Math.max(mEnd + 10, M + n * rowH + 100);
        const builds = WF_SETS[v.set] || [], ml = [];
        ml.push('{ "name": "My firmware", "version": "1.0",', '  "builds": [');
        builds.slice(0, 3).forEach((b, i) => {
          const pr = (b === v.chip ? parts() : (v.image === 'factory' || b === 'ESP8266' ? [[0, 'x']] : [[0, 'x'], [0, 'x'], [0, 'x'], [0, 'x']]));
          ml.push('    { "chipFamily": "' + b + '", "parts": [' + pr.length + ' at ' + (b === v.chip ? pr.map(q => hex(q[0])).join(', ') : (v.image === 'factory' || b === 'ESP8266' ? '0x0' : hex(WF_BOOT[b] || 0) + ' …')) + '] }' + (i < Math.min(3, builds.length) - 1 || builds.length > 3 ? ',' : ''));
        });
        if (builds.length > 3) ml.push('    … and ' + (builds.length - 3) + ' more families');
        ml.push('  ] }');
        const mh = 24 + ml.length * 14;
        panel(c, C, rx, ry, rw, mh);
        S.text(c, 'manifest.json (shortened)', rx + 10, ry + 13, { align: 'left', size: 10.5, color: C.faint, weight: 600 });
        ml.forEach((l, i) => S.text(c, fit(c, l, rw - 20, 10.5, 500, true), rx + 10, ry + 30 + i * 14, { align: 'left', size: 10.5, mono: true, color: l.indexOf(v.chip) >= 0 ? C.accent : C.text2 }));
        const my = ry + mh + 10, pr = parts(), mh2 = Math.max(70, H - my - M);
        panel(c, C, rx, my, rw, Math.min(mh2, 30 + pr.length * 22 + 26));
        S.text(c, 'flash map of the ' + v.chip + ' (typical layout)', rx + 10, my + 13, { align: 'left', size: 10.5, color: C.faint, weight: 600 });
        pr.forEach(([a, name], i) => {
          const y = my + 34 + i * 22;
          c.fillStyle = kit.hue(212 + i * 36, 0.85); c.fillRect(rx + 10, y - 7, 8, 14);
          S.text(c, hex(a), rx + 26, y, { align: 'left', size: 11, mono: true, color: C.text });
          S.text(c, fit(c, name, rw - 110, 11.5, 500), rx + 90, y, { align: 'left', size: 11.5, color: C.text2 });
        });
        S.text(c, v.chip === 'ESP8266' ? 'ESP8266: usually one image written at 0x0' : v.image === 'factory' ? 'one file: written at 0, so the page needs no addresses' : 'each part is written at its own address', rx + 10, my + 34 + pr.length * 22 + 2, { align: 'left', size: 10, color: C.muted });
        const vd = verdict();
        ro.set('at', !run ? '—' : p.done ? (p.failed ? 'stopped at: ' + WF_STEPS[vd[0]] : 'installed') : 'working');
        ro.set('why', run && p.done ? vd[1] : '—');
        if (!run || run.over) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ rf-build-or-use */
  const BU_JOBS = {
    sensor: ['Sensor or switch reporting to Home Assistant', 'ESPHome, Tasmota or ESPEasy'],
    led: ['LED strip with effects', 'WLED'],
    cnc: ['CNC machine controller', 'FluidNC'],
    gateway: ['Radio gateway: Bluetooth, 433 MHz, infrared to MQTT', 'OpenMQTTGateway'],
    audio: ['Network audio player', 'Squeezelite-ESP32 or ESPHome'],
    voice: ['Voice satellite for Home Assistant', 'ESPHome'],
    none: ['A new kind of device nobody has made firmware for', '']
  };
  Hyper.sim('rf-build-or-use', {
    title: 'Write your own, or use what exists?',
    blurb: `Describe the job and the four questions answer themselves, from top to bottom. The result is one of three: use ready-made firmware as it is, use it and add a little code through its hatch (a lambda, a Berry script, a usermod), or write your own. It is a way of thinking, not a verdict: your own constraints always count.

The chip box uses the catalogue: it says whether the catalogue marks ESPHome as supported on that chip.

**Try this**
- Choose the LED strip with nothing ticked: use WLED as it is.
- Tick **an algorithm of its own** on a sensor job: the middle road. Tick **sold as a product** as well: the answer changes.
- Choose **a new kind of device**: there is nothing to start from.
- Tick **battery for years** and see what the lean requirement does.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { aspect: narrow ? 1.35 : 0.7, minH: 420, maxH: 600 });
      const chips = ['esp32', 'esp32-s3', 'esp32-c3', 'esp32-c6', 'esp32-c2', 'esp32-c61', 'esp8266'].filter(id => E.chip(id));
      const ctl = kit.controls(box.side, [
        { id: 'job', type: 'select', label: 'The job', options: Object.keys(BU_JOBS).map(k => [BU_JOBS[k][0], k]), value: 'sensor' },
        { id: 'chip', type: 'select', label: 'The chip', options: chips.map(id => [E.chip(id).name.length > 22 ? E.chip(id).name.slice(0, 20) + '…' : E.chip(id).name, id]), value: chips[0] || 'esp32' },
        { id: 'algo', type: 'check', label: 'It needs an algorithm of its own, or tight timing', value: false },
        { id: 'part', type: 'check', label: 'A part or protocol the firmware does not support', value: false },
        { id: 'lean', type: 'check', label: 'Battery for years, or a very small chip', value: false },
        { id: 'sell', type: 'check', label: 'It will be sold as a product', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['out', 'Outcome'], ['why', 'Because'], ['chip', 'ESPHome on this chip']]);
      function decide() {
        const v = ctl.values, exists = v.job !== 'none', covered = !v.algo && !v.part, fits = !v.lean, product = v.sell;
        let out;
        if (!exists) out = 'own';
        else if ((v.algo && (v.lean || v.sell)) || (v.part && v.lean)) out = 'own';
        else if (v.algo || v.part || v.lean) out = 'middle';
        else out = 'use';
        const why = [];
        why.push(exists ? 'There is firmware for this job: ' + BU_JOBS[v.job][1] + '.' : 'No firmware exists for this kind of device.');
        if (exists) why.push(covered ? 'Its configuration covers the behaviour.' : 'Configuration alone does not cover ' + (v.algo && v.part ? 'your algorithm and your part' : v.algo ? 'your algorithm' : 'your part') + '.');
        if (exists) why.push(fits ? 'No constraint rules it out.' : 'A battery for years, or a very small chip, is hard for generic firmware.');
        if (product) why.push('As a product you also owe licence compliance, security updates and support.');
        return { exists, covered, fits, product, out, why };
      }
      const OUT = { use: ['Use it as it is', 'configure, do not program'], middle: ['Use it and add a little code', 'lambda, Berry script, usermod'], own: ['Write your own', 'you own every part of it'] };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, d = decide(), v = ctl.values;
        const qw = Math.min(W * 0.5, 330), ox = narrow ? M + qw + 28 : M + qw + 60, ow = W - ox - M, qh = 44, gap = 16;
        const Q = [
          ['1  Is there firmware for this job?', d.exists],
          ['2  Does configuration cover it?', d.exists ? d.covered : null],
          ['3  Do the constraints fit?', d.exists ? d.fits : null],
          ['4  Is it a product you sell?', d.exists ? d.product : null]
        ];
        const qy = i => 14 + i * (qh + gap);
        Q.forEach(([label, yes], i) => {
          const y = qy(i), on = yes != null;
          const good = i === 3 ? !yes : yes;
          S.box(c, M, y, qw, qh, { label: fit(c, label, qw - 14, 12, 600), sub: !on ? 'not reached: the answer is already clear' : yes ? 'yes' : 'no', color: !on ? C.faint : good ? C.ok : C.warn, dash: !on, active: on, size: 12 });
          if (i < 3) S.wire(c, [[M + qw / 2, y + qh], [M + qw / 2, y + qh + gap]], { color: on ? C.muted : C.faint, width: 2 });
        });
        // the outcomes
        const keys = ['use', 'middle', 'own'], oh = 56, og = (H - 28 - 3 * oh) / 2 > 12 ? Math.min(40, (H * 0.5 - 3 * oh) / 2) : 12;
        keys.forEach((k, i) => {
          const y = 14 + i * (oh + og + 14), sel = d.out === k;
          S.box(c, ox, y, ow, oh, { label: fit(c, OUT[k][0], ow - 12, 12.5, 650), sub: fit(c, OUT[k][1], ow - 12, 10.5), color: sel ? (k === 'own' ? C.warn : C.ok) : C.faint, active: sel, dash: !sel, size: 12.5 });
          if (sel) { const ey = qy(k === 'use' ? 3 : k === 'middle' ? 1 : (d.exists ? 2 : 0)) + qh / 2; S.wire(c, [[M + qw, ey], [ox - 14, ey], [ox - 14, y + oh / 2], [ox, y + oh / 2]], { color: k === 'own' ? C.warn : C.ok, width: 2.5, round: 8 }); }
        });
        // the reasons
        const ry = 14 + 4 * (qh + gap) + 6, rw = W - 2 * M;
        panel(c, C, M, ry, rw, Math.max(70, H - ry - M));
        S.text(c, 'why', M + 10, ry + 14, { align: 'left', size: 10.5, color: C.faint, weight: 600 });
        let yy = ry + 34;
        d.why.forEach(s => { yy = wrap(S, c, '• ' + s, M + 10, yy, rw - 20, 15, { size: 11.5, color: C.text, maxLines: 2 }); });
        const sw = (E.chip(v.chip) || {}).sw || {};
        const esp = sw.esphome === true ? 'supported' : sw.esphome === false ? 'not supported' : 'not listed';
        ro.set('out', OUT[d.out][0]);
        ro.set('why', d.why.slice(0, 2).join(' '));
        ro.set('chip', esp + (sw.esphome === false && (v.job === 'sensor' || v.job === 'voice') ? ' — check the other firmware lists, or pick another chip' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
