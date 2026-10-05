/* HYPER-ESP32 · sims/touch-and-gui.js
 *
 * The simulations of the topic "Touch and GUIs". Most of them are real little interfaces drawn on a virtual colour
 * screen with the widget kit of the display engine (kit.gfx): a thermostat the reader operates, a widget gallery, two
 * screens with navigation, a focus moved by a virtual encoder, one value shown four ways, a GUI designer that writes
 * LVGL 9. The others show how a finger becomes a coordinate (resistive and capacitive panels, calibration and
 * rotation), the LVGL loop with its flush and its buffer, flex layouts, the size of touch targets, and a web page
 * as the display.
 *
 *   tg-resistive    tg-capacitive   tg-calibration   tg-thermostat   tg-lvgl-loop   tg-buffers   tg-widgets
 *   tg-layout       tg-screens      tg-designer      tg-present      tg-targets     tg-webui     tg-encoder
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const MONO = 'Consolas, "Cascadia Code", monospace';
  /* the colours of the virtual screens (0xRRGGBB), as the widget kit's dark theme */
  const P = { bg: 0x101622, panel: 0x1B2434, fg: 0xE8ECF4, dim: 0x3A4458, accent: 0x38A0FF, ok: 0x30D060, warn: 0xFFB000, bad: 0xF04848, muted: 0x8C96AC, white: 0xFFFFFF };
  /* a small seeded random generator, so that a simulation repeats */
  function rng(seed) { let s = (seed >>> 0) || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
  function gauss(r) { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); }
  /* the error function (Abramowitz and Stegun 7.1.26) */
  function erf(x) {
    const s = x < 0 ? -1 : 1, a = Math.abs(x), t = 1 / (1 + 0.3275911 * a);
    return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a));
  }
  /* the biggest whole-number scale of a w × h screen that fits a stage, with room reserved above and below */
  function fit(st, w, h, top, bottom, maxScale) {
    const s = Math.max(1, Math.min(Math.floor((st.W - 16) / w), Math.floor((st.H - top - bottom) / h), maxScale || 3));
    return { x: Math.round((st.W - w * s) / 2), y: top, scale: s, w, h };
  }
  /* touch input on a virtual screen: down, move and up in screen pixels (up may come without a point) */
  function screenTouch(kit, st, G, fb, geom, h) {
    const inside = p => { const g = geom(); return g ? G.pick(fb, g.x, g.y, g.scale, p.x, p.y) : null; };
    const clampPt = p => { const g = geom(); return { x: clamp(Math.floor((p.x - g.x) / g.scale), 0, g.w - 1), y: clamp(Math.floor((p.y - g.y) / g.scale), 0, g.h - 1) }; };
    kit.drag(st, {
      hit: p => { const q = inside(p); return q ? { q } : null; },
      start: (t, p) => { if (h.down) h.down(t.q); },
      move: (t, p) => { if (h.move) h.move(clampPt(p)); },
      end: (t, p) => { if (h.up) h.up(p ? clampPt(p) : t.q); }
    });
  }
  /* lines of monospace text, newest first, fading; used for event logs */
  function logLines(kit, c, C, x, y, lines, o) {
    o = o || {};
    lines.forEach((l, i) => kit.label(c, l.text, x, y + i * (o.step || 15), { size: o.size || 11, color: i === 0 ? (l.color || C.text) : (l.color || C.muted), font: MONO }));
  }
  /* text on a virtual screen; the frame buffer itself draws black unless a colour is given */
  const txt = (fb, s, x, y, o) => fb.text(s, x, y, Object.assign({ color: P.fg }, o || {}));
  /* a line of text broken into lines of at most n characters, at spaces */
  function wrapText(str, n) {
    const out = []; let line = '';
    for (const w of String(str).split(' ')) { if ((line + ' ' + w).length > n && line) { out.push(line); line = '          ' + w; } else line = line ? line + ' ' + w : w; }
    if (line) out.push(line);
    return out;
  }
  const hhmm = m => { const t = Math.floor(m) % 1440; return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'); };

  /* ================================================================ tg-thermostat */
  Hyper.sim('tg-thermostat', {
    title: 'A touch thermostat you can operate',
    blurb: `A 320 × 240 colour screen drawn with the widgets of a GUI: buttons, a slider, a switch, a gauge and a chart. Press, slide and release as on a real panel; the log under the screen shows what a GUI library would deliver to your code.

**Try this**
- Tap **+** and **−**: PRESSED, RELEASED and CLICKED arrive in turn, and the setpoint changes only on CLICKED.
- Press **+**, slide off it and lift: PRESS_LOST, and nothing happens.
- Drag the **slider**: VALUE_CHANGED repeats while the finger moves.
- Tick **Show touch targets**: every widget is only a rectangle. Read the size of the + button in millimetres on a 2.8 inch panel.`,
    mount(box, kit) {
      const G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 400, maxH: 640 });
      const W = 320, H = 240;
      const fb = G.fb(W, H, { depth: 16 }), ui = G.ui(fb);
      let sp = 21, T = 17.5, heating = true, heater = false, clock = 7 * 60, minAcc = 0;
      const hist = new Array(60).fill(T);
      let pressed = null, lost = false, L = fit(st, W, H, 10, 110);
      const events = [];
      const NAMES = { minus: 'btn_minus', plus: 'btn_plus', slider: 'slider_sp', mode: 'switch_heat' };
      const log = (text, color) => { events.unshift({ text, color }); if (events.length > 6) events.pop(); };
      const ctl = kit.controls(box.side, [
        { id: 'speed', label: 'Time runs at', min: 1, max: 30, step: 1, value: 6, unit: 'min per s' },
        { id: 'tau', label: 'Insulation (time constant)', min: 30, max: 300, step: 5, value: 120, unit: 'min' },
        { id: 'out', label: 'Outside', min: -10, max: 20, step: 1, value: 5, unit: '°C' },
        { id: 'targets', type: 'check', label: 'Show touch targets', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset the room', primary: true }] }
      ], id => { if (id === 'reset') { T = 17.5; sp = 21; heating = true; hist.fill(T); events.length = 0; } });
      const ro = kit.readout(box.side, [['sp', 'Setpoint'], ['T', 'Room'], ['heater', 'Heater'], ['last', 'Last event'], ['mm', '+ button, 2.8 inch panel']]);

      function setSlider(x) {
        const f = clamp((x - 184) / 120, 0, 1), v = Math.round((10 + 20 * f) * 2) / 2;
        if (v !== sp) { sp = v; log('VALUE_CHANGED  slider_sp = ' + sp.toFixed(1), kit.colors().accent); }
      }
      function render() {
        ui.screen();
        ui.header('Thermostat');
        ui.icon('wifi', 292, 5);
        txt(fb, hhmm(clock), 250, 5, { color: P.muted });
        // the room: a gauge with the temperature in the middle and a tick at the setpoint
        const gc = heater ? P.warn : P.accent;
        ui.gauge(78, 106, 56, clamp((T - 10) / 20, 0, 1), { color: gc, needle: false });
        const a = (-135 + 270 * clamp((sp - 10) / 20, 0, 1)) * Math.PI / 180;
        fb.line(78 + Math.sin(a) * 45, 106 - Math.cos(a) * 45, 78 + Math.sin(a) * 61, 106 - Math.cos(a) * 61, P.fg);
        txt(fb, T.toFixed(1), 78, 92, { size: 3, align: 'center' });
        txt(fb, '°C room', 78, 122, { align: 'center', color: P.muted });
        // the setpoint: a number, two buttons and a slider
        txt(fb, 'SETPOINT', 176, 26, { color: P.muted });
        txt(fb, sp.toFixed(1), 246, 40, { size: 3, align: 'center' });
        ui.button(176, 74, 56, 44, '-', { id: 'minus', size: 3, pressed: pressed === 'minus' && !lost });
        ui.button(260, 74, 56, 44, '+', { id: 'plus', size: 3, pressed: pressed === 'plus' && !lost });
        ui.slider(184, 140, 120, (sp - 10) / 20, { id: 'slider' });
        txt(fb, '10', 178, 158, { color: P.muted }); txt(fb, '30', 296, 158, { color: P.muted });
        txt(fb, 'HEATING', 176, 178, { color: P.fg });
        ui.toggle(262, 174, heating, { id: 'mode' });
        txt(fb, heater ? 'HEATER ON' : 'heater off', 176, 198, { color: heater ? P.warn : P.muted });
        txt(fb, 'outside ' + ctl.values.out + '°C', 176, 212, { color: P.muted });
        ui.chart(10, 172, 150, 50, hist, { min: 10, max: 30, color: gc });
        txt(fb, 'last hour', 10, 226, { color: P.muted });
        if (ctl.values.targets) for (const b of ui.hits) fb.rect(b.x, b.y, b.w, b.h, P.warn);
      }
      screenTouch(kit, st, G, fb, () => L, {
        down(p) {
          const id = ui.hit(p.x, p.y);
          pressed = id; lost = false;
          if (id) { log('PRESSED       ' + NAMES[id], kit.colors().muted); if (id === 'slider') setSlider(p.x); }
        },
        move(p) {
          if (!pressed) return;
          if (pressed === 'slider') { setSlider(p.x); return; }
          if (!lost && ui.hit(p.x, p.y) !== pressed) { lost = true; log('PRESS_LOST    ' + NAMES[pressed], kit.colors().warn); }
        },
        up(p) {
          if (!pressed) return;
          const id = pressed;
          pressed = null;
          if (lost || id === 'slider') { if (id === 'slider') log('RELEASED      ' + NAMES[id], kit.colors().muted); return; }
          log('RELEASED      ' + NAMES[id], kit.colors().muted);
          log('CLICKED       ' + NAMES[id], kit.colors().ok);
          if (id === 'minus') sp = clamp(sp - 0.5, 10, 30);
          if (id === 'plus') sp = clamp(sp + 0.5, 10, 30);
          if (id === 'mode') { heating = !heating; log('VALUE_CHANGED  switch_heat = ' + (heating ? 'on' : 'off'), kit.colors().accent); }
        }
      });
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const dtm = dt * v.speed;
        clock += dtm;
        if (heating) { if (T < sp - 0.4) heater = true; else if (T > sp + 0.4) heater = false; } else heater = false;
        T += ((v.out - T) / v.tau + (heater ? 0.2 : 0)) * dtm;
        minAcc += dtm;
        while (minAcc >= 1) { minAcc -= 1; hist.push(T); if (hist.length > 60) hist.shift(); }
        render();
        L = fit(st, W, H, 10, 110);
        G.draw(c, fb, L.x, L.y, L.scale, { style: 'tft' });
        const ly = L.y + H * L.scale + 22;
        kit.label(c, 'what the GUI library would call in your program', L.x, ly - 8, { size: 10.5, color: C.faint });
        logLines(kit, c, C, L.x, ly + 8, events);
        ro.set('sp', sp.toFixed(1) + ' °C');
        ro.set('T', T.toFixed(1) + ' °C');
        ro.set('heater', heater ? 'on' : 'off');
        ro.set('last', events.length ? events[0].text.replace(/ +/g, ' ') : '—');
        ro.set('mm', kit.fmt(G.pxToMm(56, W, H, 2.8), 3) + ' × ' + kit.fmt(G.pxToMm(44, W, H, 2.8), 3) + ' mm');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ tg-resistive */
  Hyper.sim('tg-resistive', {
    title: 'Inside a resistive touch panel',
    blurb: `Drag the finger over the panel. The controller measures in turn **X** (a voltage gradient across one sheet, the other sheet as the probe), **Y**, and the **pressure**, and turns each into a 12-bit number. The numbers are those the controller would report; the dead margins of the film are the reason they do not run from 0 to 4095.

**Try this**
- Move the finger: the voltage on the probe is the fraction of the way across, and the raw number follows it.
- Lower **Pressure** under the threshold: the sheets do not touch, there is no contact and no reading.
- Raise **Noise** and watch the pixel jump; raise **Readings averaged** and the jitter shrinks.
- Tick **A second finger**: the controller reports one point between the two.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 520, maxH: 600 });
      const R = rng(7);
      let fx = 0.35, fy = 0.6, pa = { x: 0, y: 0, w: 100, h: 60 };
      let reading = { x: 0, y: 0 }, lastRead = -1;
      const ctl = kit.controls(box.side, [
        { id: 'noise', label: 'Noise in each reading', min: 0, max: 80, step: 1, value: 15, unit: 'counts' },
        { id: 'avg', label: 'Readings averaged', min: 1, max: 16, step: 1, value: 1 },
        { id: 'press', label: 'Pressure of the finger', min: 0, max: 100, step: 1, value: 60, unit: '%' },
        { id: 'two', type: 'check', label: 'A second finger at the right', value: false }
      ], () => { lastRead = -1; });
      const ro = kit.readout(box.side, [['rx', 'Raw X'], ['ry', 'Raw Y'], ['z', 'Contact'], ['px', 'Pixel (320 × 240)'], ['jit', 'Jitter, about']]);
      const MIN = 200, SPAN = 3700, THRESH = 30;
      const eff = () => (ctl.values.two ? { x: (fx + 0.82) / 2, y: (fy + 0.25) / 2 } : { x: fx, y: fy });
      function layout() {
        const W = st.W, wide = W >= 600, pad = 14;
        if (wide) {
          const lw = Math.floor(W * 0.46), rx = pad + lw + 30;
          pa = { x: pad, y: 34, w: lw, h: Math.round(lw * 0.68) };
          return { wide, sv: { x: pad, y: pa.y + pa.h + 56, w: lw, h: 70 }, sx: { x: rx, y: 70, w: W - rx - pad, h: 26 }, sy: { x: rx, y: 170, w: W - rx - pad, h: 26 }, txt: { x: rx, y: 250 } };
        }
        const w = W - 2 * pad;
        pa = { x: pad, y: 28, w, h: Math.min(170, Math.round(w * 0.5)) };
        return { wide, sv: { x: pad, y: pa.y + pa.h + 38, w, h: 56 }, sx: { x: pad, y: pa.y + pa.h + 38 + 56 + 62, w, h: 20 }, sy: { x: pad, y: pa.y + pa.h + 38 + 56 + 62 + 86, w, h: 20 }, txt: null };
      }
      let lay = layout();
      kit.drag(st, {
        hit: p => (p.x >= pa.x - 10 && p.x <= pa.x + pa.w + 10 && p.y >= pa.y - 10 && p.y <= pa.y + pa.h + 10 ? {} : null),
        move: (t, p) => { fx = clamp((p.x - pa.x) / pa.w, 0.02, 0.98); fy = clamp((p.y - pa.y) / pa.h, 0.02, 0.98); lastRead = -1; },
        end: () => {}
      });
      st.onResize(() => { lay = layout(); loop.once(); });
      const bar = (c, C, r, frac, label, v, active) => {
        const g = c.createLinearGradient(r.x, 0, r.x + r.w, 0);
        g.addColorStop(0, C.surface2); g.addColorStop(1, C.accent);
        c.fillStyle = g; c.fillRect(r.x, r.y, r.w, r.h);
        c.strokeStyle = active ? C.accent : C.border2; c.lineWidth = active ? 2.4 : 1.2; c.strokeRect(r.x, r.y, r.w, r.h);
        const mx = r.x + frac * r.w;
        kit.dot(c, mx, r.y + r.h / 2, 6, C.text, C.bg2);
        c.strokeStyle = C.text; c.lineWidth = 1.4; c.beginPath(); c.moveTo(mx, r.y - 8); c.lineTo(mx, r.y + r.h / 2 - 6); c.stroke();
        kit.label(c, label, r.x, r.y - 32, { size: 11.5, color: active ? C.text : C.muted, weight: 600 });
        kit.label(c, v, mx, r.y - 17, { size: 11, color: C.text, align: mx > r.x + r.w - 60 ? 'right' : 'left' });
        kit.label(c, '0 V', r.x, r.y + r.h + 12, { size: 10, color: C.faint });
        kit.label(c, '3.3 V', r.x + r.w, r.y + r.h + 12, { size: 10, color: C.faint, align: 'right' });
      };
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        lay = layout();
        const e = eff(), touched = v.press >= THRESH, phase = Math.floor(t / 0.55) % 3;
        if (t - lastRead > 0.12 || lastRead < 0) {
          lastRead = t;
          let sx = 0, sy = 0;
          for (let i = 0; i < v.avg; i++) { sx += MIN + e.x * SPAN + (R() - 0.5) * 2 * v.noise; sy += MIN + e.y * SPAN + (R() - 0.5) * 2 * v.noise; }
          reading = { x: clamp(Math.round(sx / v.avg), 0, 4095), y: clamp(Math.round(sy / v.avg), 0, 4095) };
        }
        // the panel seen from above
        kit.label(c, 'The panel, seen from above (drag the finger)', pa.x, pa.y - 14, { size: 11.5, color: C.muted });
        c.fillStyle = C.surface; c.fillRect(pa.x, pa.y, pa.w, pa.h);
        c.strokeStyle = C.border2; c.lineWidth = 1.5; c.strokeRect(pa.x, pa.y, pa.w, pa.h);
        c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1;
        c.strokeRect(pa.x + pa.w * 0.05, pa.y + pa.h * 0.05, pa.w * 0.9, pa.h * 0.9); c.setLineDash([]);
        const fingers = [[fx, fy]].concat(v.two ? [[0.82, 0.25]] : []);
        for (const [gx, gy] of fingers) kit.dot(c, pa.x + gx * pa.w, pa.y + gy * pa.h, 13, touched ? 'rgba(229,72,77,.55)' : 'rgba(150,156,180,.35)', C.text);
        if (touched) { c.strokeStyle = C.ok; c.lineWidth = 1.5; const cx = pa.x + e.x * pa.w, cy = pa.y + e.y * pa.h; c.beginPath(); c.moveTo(cx - 9, cy); c.lineTo(cx + 9, cy); c.moveTo(cx, cy - 9); c.lineTo(cx, cy + 9); c.stroke(); }
        // the cross-section: two sheets, spacer dots, the top sheet bending
        const sv = lay.sv, base = sv.y + sv.h - 8, gap = 26, fxs = sv.x + e.x * sv.w, press = v.press / 100;
        kit.label(c, 'Side view', sv.x, sv.y - 14, { size: 11.5, color: C.muted });
        c.fillStyle = C.border2; c.fillRect(sv.x, base, sv.w, 5);
        for (let i = 1; i < 10; i++) kit.dot(c, sv.x + (i / 10) * sv.w, base - 3, 2, C.faint);
        c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath();
        const dip = touched ? gap : gap * press * 0.8, sw = sv.w * 0.09;
        for (let i = 0; i <= 60; i++) { const x = sv.x + (i / 60) * sv.w, y = base - 4 - gap + dip * Math.exp(-Math.pow((x - fxs) / sw, 2)); if (i) c.lineTo(x, y); else c.moveTo(x, y); }
        c.stroke();
        c.fillStyle = C.muted; c.beginPath(); if (c.roundRect) c.roundRect(fxs - 9, base - gap - 24 + dip * 0.6 - 4, 18, 26, 6); else c.rect(fxs - 9, base - gap - 24 + dip * 0.6 - 4, 18, 26); c.fill();
        kit.label(c, touched ? 'sheets touch' : 'no contact', sv.x + sv.w, sv.y - 14, { size: 11, color: touched ? C.ok : C.warn, align: 'right' });
        // the measurement: the divider the finger creates
        kit.label(c, 'What the controller measures', lay.sx.x, lay.sx.y - 56, { size: 11.5, color: C.muted });
        const names = ['measuring X', 'measuring Y', 'measuring pressure'];
        kit.label(c, names[phase], lay.sx.x + lay.sx.w, lay.sx.y - 56, { size: 11, color: C.accent, align: 'right', weight: 600 });
        bar(c, C, lay.sx, e.x, 'X sheet: the probe sheet reads the divider', (3.3 * e.x).toFixed(2) + ' V', phase === 0);
        bar(c, C, lay.sy, e.y, 'Y sheet: the same, across the other sheet', (3.3 * e.y).toFixed(2) + ' V', phase === 1);
        if (lay.txt) {
          kit.label(c, 'Pressure: ' + v.press + ' %  (contact from ' + THRESH + ' %)', lay.txt.x, lay.txt.y, { size: 11.5, color: phase === 2 ? C.accent : C.muted, weight: phase === 2 ? 600 : 500 });
          kit.label(c, '12-bit reading = 4095 × volts / 3.3 V,', lay.txt.x, lay.txt.y + 22, { size: 11, color: C.faint });
          kit.label(c, 'then the margins of the film shift it.', lay.txt.x, lay.txt.y + 38, { size: 11, color: C.faint });
        }
        const px = clamp(Math.round((reading.x - MIN) / SPAN * 319), 0, 319), py = clamp(Math.round((reading.y - MIN) / SPAN * 239), 0, 239);
        ro.set('rx', touched ? reading.x + ' of 4095' : '— (no contact)');
        ro.set('ry', touched ? reading.y + ' of 4095' : '—');
        ro.set('z', touched ? 'yes, ' + v.press + ' %' : 'no, too light');
        ro.set('px', touched ? 'x ' + px + ', y ' + py : '—');
        ro.set('jit', kit.fmt(v.noise / Math.sqrt(3) / Math.sqrt(v.avg) * 319 / SPAN, 2) + ' px');
        S.text(c, v.two ? 'two fingers: the reading is between them' : '', pa.x + pa.w / 2, pa.y + pa.h + 14, { size: 11, color: C.warn });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ tg-capacitive */
  Hyper.sim('tg-capacitive', {
    title: 'A capacitive panel finds a finger',
    blurb: `A grid of 12 × 8 electrode crossings. Each circle is the controller's measurement at one crossing: the larger and warmer, the more a finger (or something else) has taken from the field. The controller finds the peaks above the **threshold** and works out the centre of each from its neighbours. Drag the two fingers.

**Try this**
- Move a finger between crossings: the reported position follows to a fraction of a crossing, from the weights of the neighbours.
- Bring the two fingers close together: they merge into one blob and one touch.
- Switch on the **water drop**: a small false signal. Lower the threshold until it is reported as a touch.
- Tick **thick glove**: the signal weakens; raise the noise and the finger disappears into it.`,
    mount(box, kit) {
      const G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 470 });
      const NX = 12, NY = 8;
      const R = rng(11);
      let fingers = [{ x: 4.3, y: 3.2 }, { x: 8.2, y: 4.8 }];
      const drop = { x: 2.0, y: 6.2 };
      let pad = { x: 10, y: 10, w: 100, h: 60 }, cell = 30, noiseField = null, lastN = -1;
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Controller', options: [['FT6336U: 2 points', 2], ['GT911: 5 points', 5], ['CST816S: 1 point', 1]], value: 2 },
        { id: 'noise', label: 'Noise', min: 0, max: 40, step: 1, value: 6, unit: '%' },
        { id: 'thr', label: 'Threshold', min: 10, max: 90, step: 1, value: 40, unit: '%' },
        { id: 'two', type: 'check', label: 'Two fingers', value: true },
        { id: 'drop', type: 'check', label: 'A water drop on the glass', value: false },
        { id: 'glove', type: 'check', label: 'A thick glove', value: false }
      ], () => { lastN = -1; });
      const ro = kit.readout(box.side, [['n', 'Touches reported'], ['p1', 'Touch 1'], ['p2', 'Touch 2'], ['peak', 'Strongest signal'], ['err', 'Error of touch 1']]);
      function layout() {
        const W = st.W, H = st.H;
        cell = Math.max(18, Math.min((W - 28) / NX, (H - 60) / NY));
        pad = { x: Math.round((W - cell * NX) / 2), y: 38, w: cell * NX, h: cell * NY };
      }
      layout();
      kit.drag(st, {
        hit: p => {
          let best = null, bd = 1e9;
          fingers.forEach((f, i) => { if (i === 1 && !ctl.values.two) return; const d = Math.hypot(pad.x + f.x * cell - p.x, pad.y + f.y * cell - p.y); if (d < cell * 1.3 && d < bd) { best = i; bd = d; } });
          return best == null ? null : { i: best };
        },
        move: (t, p) => { fingers[t.i] = { x: clamp((p.x - pad.x) / cell, 0.2, NX - 0.2), y: clamp((p.y - pad.y) / cell, 0.2, NY - 0.2) }; },
        end: () => {}
      });
      st.onResize(() => { layout(); loop.once(); });
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        layout();
        if (!noiseField || t - lastN > 0.1) { noiseField = Array.from({ length: NX * NY }, () => R() * 2 - 1); lastN = t; }
        const amp = v.glove ? 32 : 100, act = fingers.slice(0, v.two ? 2 : 1);
        const val = new Array(NX * NY);
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          let s = 0;
          for (const f of act) s += amp * Math.exp(-(Math.pow(i + 0.5 - f.x, 2) + Math.pow(j + 0.5 - f.y, 2)) / (2 * 0.85 * 0.85));
          if (v.drop) s += 34 * Math.exp(-(Math.pow(i + 0.5 - drop.x, 2) + Math.pow(j + 0.5 - drop.y, 2)) / (2 * 0.45 * 0.45));
          val[j * NX + i] = Math.max(0, s + noiseField[j * NX + i] * v.noise);
        }
        // the peaks above the threshold, and their centres from the 3 × 3 neighbourhood
        const peaks = [];
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          const a = val[j * NX + i];
          if (a < v.thr) continue;
          let top = true;
          for (let dj = -1; dj <= 1 && top; dj++) for (let di = -1; di <= 1; di++) {
            if (!di && !dj) continue;
            const ii = i + di, jj = j + dj;
            if (ii < 0 || jj < 0 || ii >= NX || jj >= NY) continue;
            const b = val[jj * NX + ii];
            if (b > a || (b === a && (jj * NX + ii) < (j * NX + i))) { top = false; break; }
          }
          if (!top) continue;
          let sw = 0, sx = 0, sy = 0;
          for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
            const ii = i + di, jj = j + dj;
            if (ii < 0 || jj < 0 || ii >= NX || jj >= NY) continue;
            const b = val[jj * NX + ii]; sw += b; sx += b * (ii + 0.5); sy += b * (jj + 0.5);
          }
          peaks.push({ a, x: sx / sw, y: sy / sw });
        }
        peaks.sort((p, q) => q.a - p.a);
        const found = peaks.slice(0, v.chip);
        // the grid and the measurements
        kit.label(c, 'Electrode crossings: drag the fingers', pad.x, pad.y - 16, { size: 11.5, color: C.muted });
        c.fillStyle = C.surface; c.fillRect(pad.x, pad.y, pad.w, pad.h);
        c.strokeStyle = C.border; c.lineWidth = 1; c.beginPath();
        for (let i = 0; i < NX; i++) { c.moveTo(pad.x + (i + 0.5) * cell, pad.y); c.lineTo(pad.x + (i + 0.5) * cell, pad.y + pad.h); }
        for (let j = 0; j < NY; j++) { c.moveTo(pad.x, pad.y + (j + 0.5) * cell); c.lineTo(pad.x + pad.w, pad.y + (j + 0.5) * cell); }
        c.stroke();
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          const f = clamp(val[j * NX + i] / 100, 0, 1);
          kit.dot(c, pad.x + (i + 0.5) * cell, pad.y + (j + 0.5) * cell, 1.5 + f * cell * 0.4, f > 0.02 ? kit.hue(210 - 190 * f, 0.35 + 0.6 * f) : C.faint);
        }
        // the threshold, as a ring around every node that counts
        c.strokeStyle = C.warn; c.lineWidth = 1.5;
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) if (val[j * NX + i] >= v.thr) { c.beginPath(); c.arc(pad.x + (i + 0.5) * cell, pad.y + (j + 0.5) * cell, cell * 0.46, 0, Math.PI * 2); c.stroke(); }
        if (v.drop) { c.strokeStyle = C.accent; c.setLineDash([3, 3]); c.beginPath(); c.arc(pad.x + drop.x * cell, pad.y + drop.y * cell, cell * 0.55, 0, Math.PI * 2); c.stroke(); c.setLineDash([]); kit.label(c, 'drop', pad.x + drop.x * cell, pad.y + drop.y * cell + cell * 0.8, { size: 10, color: C.accent, align: 'center' }); }
        act.forEach((f, i) => { c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(pad.x + f.x * cell, pad.y + f.y * cell, cell * 0.85, 0, Math.PI * 2); c.stroke(); kit.label(c, String(i + 1), pad.x + f.x * cell, pad.y + f.y * cell, { size: 11, color: C.text, align: 'center' }); });
        found.forEach((p, i) => {
          const x = pad.x + p.x * cell, y = pad.y + p.y * cell;
          c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 10, y); c.lineTo(x + 10, y); c.moveTo(x, y - 10); c.lineTo(x, y + 10); c.stroke();
          kit.label(c, 'T' + (i + 1), x + 12, y - 10, { size: 11, color: C.ok, weight: 600 });
        });
        const pxOf = p => ({ x: Math.round(p.x / NX * 319), y: Math.round(p.y / NY * 239) });
        ro.set('n', found.length + (peaks.length > found.length ? ' (chip limit ' + v.chip + ')' : ''));
        ro.set('p1', found[0] ? 'x ' + pxOf(found[0]).x + ', y ' + pxOf(found[0]).y : '—');
        ro.set('p2', found[1] ? 'x ' + pxOf(found[1]).x + ', y ' + pxOf(found[1]).y : '—');
        ro.set('peak', Math.round(Math.max.apply(null, val)) + ' % of a finger');
        if (found[0]) {
          let d = 1e9; for (const f of act) d = Math.min(d, Math.hypot(f.x - found[0].x, f.y - found[0].y));
          ro.set('err', kit.fmt(d / NX * 57, 2) + ' mm on a 2.8 inch panel');
        } else ro.set('err', '—');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ tg-calibration */
  Hyper.sim('tg-calibration', {
    title: 'Touch calibration and rotation',
    blurb: `A 240 × 320 resistive panel with an XPT2046, as on a 2.8 inch module. The touch layer is glued to the glass and never turns; the picture does. The finger is the white ring, the red cross is where the software thinks it is.

**Try this**
- Start with the naive guess (raw 0 to 4095 straight onto the screen): the red cross is far from the finger.
- Press **Calibrate**, touch the three targets, then touch around: the cross follows the finger.
- Now change **Rotation**: the picture turns, the touch map does not, and the cross is wrong again.
- Tick **Update the touch map when the picture turns** to see what a product has to do.`,
    mount(box, kit) {
      const G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.92, minH: 440, maxH: 700 });
      const NW = 240, NH = 320;
      const dims = r => ((r & 1) ? { w: NH, h: NW } : { w: NW, h: NH });
      const toNative = (x, y, r) => [{ x, y }, { x: y, y: NH - 1 - x }, { x: NW - 1 - x, y: NH - 1 - y }, { x: NW - 1 - y, y: x }][r & 3];
      const rawAt = (x, y, r) => { const n = toNative(x, y, r); return { x: 3870 - n.x * 3640 / (NW - 1), y: 250 + n.y * 3540 / (NH - 1) }; };
      const NAIVE = { xMin: 0, xMax: 4095, yMin: 0, yMax: 4095, swap: false, flipX: false, flipY: false };
      const R = rng(5);
      const fbs = [G.fb(NW, NH, { depth: 16 }), G.fb(NH, NW, { depth: 16 })];
      let rot = 0, cal = Object.assign({}, NAIVE), calName = 'none: a naive guess', calRot = null;
      let finger = null, raw = null, mapped = null, down = false;
      let calib = { active: false, step: 0, pts: [] };
      let L = fit(st, NW, NH, 12, 40);
      const exactCal = r => {
        const d = dims(r), a = rawAt(0, 0, r), b = rawAt(d.w - 1, 0, r), c = rawAt(0, d.h - 1, r);
        const swap = Math.abs(b.y - a.y) > Math.abs(b.x - a.x), xa = swap ? 'y' : 'x', ya = swap ? 'x' : 'y';
        return { xMin: a[xa], xMax: b[xa], yMin: a[ya], yMax: c[ya], swap, flipX: false, flipY: false };
      };
      // three touches (raw readings and the pixels they should be) -> the four numbers and the swap, by least squares per axis
      function solveCal(pts, w, h) {
        const fitLine = (us, vs) => {
          const n = us.length, mu = us.reduce((s, q) => s + q, 0) / n, mv = vs.reduce((s, q) => s + q, 0) / n;
          let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (us[i] - mu) * (vs[i] - mv); sxx += (us[i] - mu) * (us[i] - mu); }
          const a = sxx ? sxy / sxx : 0, b = mv - a * mu; let err = 0; for (let i = 0; i < n; i++) err += Math.pow(a * us[i] + b - vs[i], 2);
          return { a, b, err };
        };
        let best = null;
        for (const swap of [false, true]) {
          const fx = fitLine(pts.map(p => (swap ? p.raw.y : p.raw.x)), pts.map(p => p.target.x)), fy = fitLine(pts.map(p => (swap ? p.raw.x : p.raw.y)), pts.map(p => p.target.y));
          if (!fx.a || !fy.a) continue;
          if (!best || fx.err + fy.err < best.e) best = { e: fx.err + fy.err, swap, fx, fy };
        }
        if (!best) return Object.assign({}, NAIVE);
        return { xMin: -best.fx.b / best.fx.a, xMax: (w - 1 - best.fx.b) / best.fx.a, yMin: -best.fy.b / best.fy.a, yMax: (h - 1 - best.fy.b) / best.fy.a, swap: best.swap, flipX: false, flipY: false };
      }
      const targets = () => { const d = dims(rot); return [{ x: Math.round(d.w * 0.12), y: Math.round(d.h * 0.12) }, { x: Math.round(d.w * 0.88), y: Math.round(d.h * 0.5) }, { x: Math.round(d.w * 0.5), y: Math.round(d.h * 0.88) }]; };
      const ctl = kit.controls(box.side, [
        { id: 'rot', type: 'select', label: 'Rotation of the picture', options: [['0: portrait', 0], ['1: landscape', 1], ['2: portrait, upside down', 2], ['3: landscape, the other way', 3]], value: 0 },
        { id: 'noise', label: 'Noise in each reading', min: 0, max: 60, step: 1, value: 8, unit: 'counts' },
        { id: 'follow', type: 'check', label: 'Update the touch map when the picture turns', value: false },
        { type: 'buttons', items: [{ id: 'cal', label: 'Calibrate: touch 3 targets', primary: true }, { id: 'exact', label: 'Exact map for this rotation' }, { id: 'forget', label: 'Forget the calibration' }] }
      ], (id, v) => {
        if (id === 'rot') { rot = v; finger = null; mapped = null; calib.active = false; if (ctl.values.follow) { cal = exactCal(rot); calRot = rot; calName = 'exact, for rotation ' + rot; } }
        if (id === 'cal') { calib = { active: true, step: 0, pts: [] }; finger = null; mapped = null; }
        if (id === 'exact') { cal = exactCal(rot); calRot = rot; calName = 'exact, for rotation ' + rot; calib.active = false; }
        if (id === 'forget') { cal = Object.assign({}, NAIVE); calRot = null; calName = 'none: a naive guess'; calib.active = false; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['raw', 'Raw reading'], ['px', 'Mapped pixel'], ['err', 'Error'], ['cal', 'Calibration'], ['step', 'Now']]);
      function touchAt(p) {
        const d = dims(rot), n = ctl.values.noise, r0 = rawAt(p.x, p.y, rot);
        raw = { x: Math.round(clamp(r0.x + (R() - 0.5) * 2 * n, 0, 4095)), y: Math.round(clamp(r0.y + (R() - 0.5) * 2 * n, 0, 4095)) };
        finger = { x: p.x, y: p.y };
        mapped = G.touchMap(raw.x, raw.y, cal, d.w, d.h);
      }
      screenTouch(kit, st, G, fbs[0], () => L, {
        down(p) {
          down = true;
          if (calib.active) {
            const tg = targets()[calib.step], d = dims(rot), r0 = rawAt(p.x, p.y, rot);
            calib.pts.push({ raw: { x: r0.x + (R() - 0.5) * 2 * ctl.values.noise, y: r0.y + (R() - 0.5) * 2 * ctl.values.noise }, target: tg });
            calib.step++;
            finger = { x: p.x, y: p.y }; mapped = null;
            if (calib.step >= 3) { cal = solveCal(calib.pts, d.w, d.h); calRot = rot; calName = 'three touches, for rotation ' + rot; calib.active = false; }
          } else touchAt(p);
        },
        move(p) { if (down && !calib.active) touchAt(p); },
        up() { down = false; }
      });
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), d = dims(rot), fb = fbs[rot & 1];
        fb.clear(P.bg);
        for (let x = 0; x < d.w; x += 40) fb.vline(x, 0, d.h, P.dim);
        for (let y = 0; y < d.h; y += 40) fb.hline(0, y, d.w, P.dim);
        fb.rect(0, 0, d.w, d.h, P.muted);
        txt(fb, 'TOP', d.w >> 1, 4, { align: 'center', color: P.muted });
        txt(fb, 'rotation ' + rot, d.w >> 1, (d.h >> 1) + 18, { align: 'center', color: P.muted });
        txt(fb, 'F', d.w >> 1, (d.h >> 1) - 30, { size: 6, align: 'center', color: P.dim });
        if (calib.active) {
          const tg = targets()[calib.step];
          const pulse = 8 + Math.round(3 * Math.sin(t * 5));
          fb.circle(tg.x, tg.y, pulse, P.warn); fb.hline(tg.x - 14, tg.y, 29, P.warn); fb.vline(tg.x, tg.y - 14, 29, P.warn);
          txt(fb, 'touch the target ' + (calib.step + 1) + ' of 3', d.w >> 1, d.h - 14, { align: 'center', color: P.warn });
        } else if (finger) {
          fb.circle(finger.x, finger.y, 9, P.white);
          if (mapped) {
            fb.hline(mapped.x - 8, mapped.y, 17, P.bad); fb.vline(mapped.x, mapped.y - 8, 17, P.bad);
            if (Math.hypot(mapped.x - finger.x, mapped.y - finger.y) > 12) fb.line(finger.x, finger.y, mapped.x, mapped.y, P.bad);
          }
        }
        L = fit(st, d.w, d.h, 12, 40);
        const r = G.draw(c, fb, L.x, L.y, L.scale, { style: 'tft' });
        kit.label(c, 'white ring: the finger · red cross: where the touch map puts it', st.W / 2, r.y + r.h + 18, { size: 11, color: C.muted, align: 'center' });
        let err = '—';
        if (finger && mapped && !calib.active) err = kit.fmt(Math.hypot(mapped.x - finger.x, mapped.y - finger.y), 3) + ' px';
        ro.set('raw', raw && !calib.active ? 'x ' + raw.x + ', y ' + raw.y : '—');
        ro.set('px', mapped && !calib.active ? 'x ' + mapped.x + ', y ' + mapped.y : '—');
        ro.set('err', err);
        ro.set('cal', calName + (calRot != null && calRot !== rot ? '  (made for rotation ' + calRot + ': wrong here)' : ''));
        ro.set('step', calib.active ? 'touch target ' + (calib.step + 1) + ' of 3' : 'touch the screen anywhere');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ tg-lvgl-loop */
  Hyper.sim('tg-lvgl-loop', {
    title: 'The LVGL loop: from touch to pixels',
    blurb: `One pass of loop() calls lv_timer_handler(). Inside it LVGL reads the touch (about every 30 ms), runs your callback, and redraws the dirty area at its next refresh (about every 33 ms): render into the buffer, then flush to the panel. Time runs slowed down so that you can follow it; the picture is schematic, with a software drawing speed of 8 ms for a whole 320 × 240 screen.

**Try this**
- Watch one touch go through the five stages; read **touch to pixels**.
- Raise **Your callback takes** to 200 ms, as if it fetched a web page: nothing is read or drawn for that long.
- Raise **Dirty area**: render and flush grow with it; lower the **SPI clock** and the flush dominates.
- Tick **Flush by DMA**: the bus works while the CPU draws the next piece.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380, maxH: 470 });
      const WIN = 120, FULL_RENDER_MS = 8, PIXELS = 320 * 240;
      let now = 0, nextPass = 0, indevDue = 0, refreshDue = 0, pending = null, dirty = 0, autoNext = 150, touchedAt = null;
      let segs = [], marks = [], latency = null, lastPass = null, active = -1;
      const ctl = kit.controls(box.side, [
        { id: 'dirty', label: 'Dirty area', min: 1, max: 100, step: 1, value: 20, unit: '% of the screen' },
        { id: 'spi', label: 'SPI clock', min: 5, max: 80, step: 1, value: 40, unit: 'MHz' },
        { id: 'cb', label: 'Your callback takes', min: 0, max: 300, step: 1, value: 1, unit: 'ms' },
        { id: 'delay', label: 'delay() in loop()', min: 1, max: 50, step: 1, value: 5, unit: 'ms' },
        { id: 'dma', type: 'check', label: 'Flush by DMA (the bus works while the CPU draws)', value: false },
        { id: 'auto', type: 'check', label: 'Touch every half second', value: true },
        { id: 'slow', type: 'select', label: 'Time runs at', options: [['1/50 of real time', 0.02], ['1/10 of real time', 0.1], ['real time', 1]], value: 0.1 },
        { type: 'buttons', items: [{ id: 'touch', label: 'Touch now', primary: true }] }
      ], id => { if (id === 'touch' && pending == null) pending = now; });
      const ro = kit.readout(box.side, [['lat', 'Touch to pixels'], ['pass', 'The pass with a redraw'], ['flush', 'A full-screen flush'], ['fps', 'Full redraws at best'], ['stall', 'Frozen by your callback']]);
      const costs = () => {
        const v = ctl.values, R = FULL_RENDER_MS * v.dirty / 100, F = PIXELS * (v.dirty / 100) * 16 / (v.spi * 1e6) * 1000;
        return { R, F, full: PIXELS * 16 / (v.spi * 1e6) * 1000 };
      };
      function runPass(tp) {
        const v = ctl.values;
        let t = tp;
        const add = (kind, d) => { if (d > 0) { segs.push({ kind, a: t, b: t + d, lane: 0 }); t += d; } };
        add('timers', 0.06);
        if (tp >= indevDue) {
          indevDue = Math.floor(tp / 30) * 30 + 30;
          add('input', 0.3);
          if (pending != null && pending <= tp) {
            touchedAt = pending; pending = null;
            marks.push({ t: touchedAt, kind: 'touch' });
            add('callback', v.cb);
            dirty = Math.max(dirty, v.dirty / 100);
          }
        }
        if (tp >= refreshDue) {
          refreshDue = Math.floor(tp / 33) * 33 + 33;
          if (dirty > 0) {
            const k = costs();
            if (v.dma) { segs.push({ kind: 'render', a: t, b: t + k.R, lane: 0 }); segs.push({ kind: 'flush', a: t, b: t + k.F, lane: 1 }); t += Math.max(k.R, k.F); }
            else { add('render', k.R); add('flush', k.F); }
            marks.push({ t, kind: 'shown' });
            if (touchedAt != null) latency = t - touchedAt;
            lastPass = t - tp; touchedAt = null; dirty = 0;
          }
        }
        add('idle', v.delay);
        nextPass = t;
      }
      const KCOL = C => ({ timers: C.faint, input: C.accent, callback: C.bad, render: C.warn, flush: kit.hue(285), idle: C.surface2 });
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, KC = KCOL(C);
        now += dt * 1000 * v.slow;
        if (v.auto && now >= autoNext) { if (pending == null) pending = autoNext; autoNext += 500; }
        if (!v.auto) autoNext = Math.max(autoNext, now + 100);
        let guard = 0;
        while (nextPass <= now && guard++ < 4000) runPass(nextPass);
        segs = segs.filter(s => s.b > now - WIN - 20);
        marks = marks.filter(m => m.t > now - WIN - 20);
        const W = st.W, pad = 14;
        // the pipeline of one touch
        const labels = [['touch', 'finger'], ['read', 'indev'], ['callback', 'yours'], ['render', 'dirty area'], ['flush', 'to panel']];
        const bw = (W - 2 * pad - 4 * 12) / 5;
        const cur = segs.filter(s => s.a <= now && s.b > now && s.kind !== 'idle' && s.kind !== 'timers')[0];
        active = cur ? { input: 1, callback: 2, render: 3, flush: 4 }[cur.kind] : -1;
        labels.forEach((l, i) => {
          const x = pad + i * (bw + 12), b = S.box(c, x, 14, bw, 44, { label: l[0], sub: l[1], size: 11.5, active: i === active, color: i === active ? C.accent : C.muted });
          if (i < 4) S.link(c, b.r[0], b.r[1], x + bw + 12, 36, { arrow: 'end', color: C.faint, width: 1.2 });
        });
        // the timeline
        const x0 = 84, x1 = W - pad, X = tt => x0 + (tt - (now - WIN)) / WIN * (x1 - x0);
        const y0 = 96, lh = 30;
        kit.label(c, 'loop()', x0 - 8, y0 + lh / 2, { size: 11.5, color: C.text2, align: 'right' });
        kit.label(c, 'bus (DMA)', x0 - 8, y0 + lh + 28, { size: 11.5, color: C.text2, align: 'right' });
        kit.label(c, 'events', x0 - 8, y0 + lh + 70, { size: 11.5, color: C.text2, align: 'right' });
        c.fillStyle = C.surface; c.fillRect(x0, y0, x1 - x0, lh); c.fillRect(x0, y0 + lh + 16, x1 - x0, 24); c.fillRect(x0, y0 + lh + 58, x1 - x0, 24);
        for (const s of segs) {
          const a = Math.max(x0, X(s.a)), b = Math.min(x1, X(Math.min(s.b, now)));
          if (b <= a) continue;
          c.fillStyle = KC[s.kind] || C.faint;
          if (s.lane === 1) c.fillRect(a, y0 + lh + 16, Math.max(1, b - a), 24); else c.fillRect(a, y0, Math.max(1, b - a), lh);
        }
        for (const m of marks) {
          if (m.t > now) continue;
          const x = X(m.t); if (x < x0) continue;
          c.strokeStyle = m.kind === 'touch' ? C.accent : C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y0 + lh + 58); c.lineTo(x, y0 + lh + 82); c.stroke();
          kit.label(c, m.kind === 'touch' ? 'touch' : 'pixels', x, y0 + lh + 94, { size: 10, color: m.kind === 'touch' ? C.accent : C.ok, align: 'center' });
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x1, y0 - 4); c.lineTo(x1, y0 + lh + 84); c.stroke();
        kit.label(c, '120 ms ago', x0, y0 - 10, { size: 10, color: C.faint });
        kit.label(c, 'now', x1, y0 - 10, { size: 10, color: C.faint, align: 'right' });
        // the legend
        const leg = [['timers', 'timers'], ['input', 'read the touch'], ['callback', 'your callback'], ['render', 'render'], ['flush', 'flush'], ['idle', 'delay()']];
        let lx = x0, ly = y0 + lh + 126;
        for (const [k, t] of leg) {
          const w = 24 + t.length * 6.4;
          if (lx + w > x1 + 4) { lx = x0; ly += 18; }
          c.fillStyle = KC[k]; c.fillRect(lx, ly - 6, 12, 12); c.strokeStyle = C.border2; c.lineWidth = 1; c.strokeRect(lx, ly - 6, 12, 12);
          kit.label(c, t, lx + 18, ly, { size: 10.5, color: C.muted });
          lx += w + 6;
        }
        const k = costs();
        ro.set('lat', latency == null ? 'wait for a touch' : kit.fmt(latency, 3) + ' ms');
        ro.set('pass', lastPass == null ? '—' : kit.fmt(lastPass, 3) + ' ms');
        ro.set('flush', kit.fmt(k.full, 3) + ' ms at ' + v.spi + ' MHz');
        ro.set('fps', kit.fmt(1000 / (v.dma ? Math.max(FULL_RENDER_MS, k.full) : FULL_RENDER_MS + k.full), 3) + ' a second');
        ro.set('stall', v.cb > 5 ? kit.fmt(v.cb, 3) + ' ms: no touch read, nothing drawn' : 'no noticeable stall');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ tg-buffers */
  Hyper.sim('tg-buffers', {
    title: 'How much memory do the pixels need?',
    blurb: `The same screen can be kept in memory whole or in strips. Pick a display, a chip and an approach: the bars show what the buffer costs against the chip's internal RAM, and the screen shows how a strip-by-strip redraw runs (amber: being drawn into the buffer, blue: already sent). The time is the best case at the SPI clock, with 5 % protocol overhead.

**Try this**
- Choose the **320 × 240** screen with a **full frame** on an ESP32: 150 KB, a large share of its RAM. Tick *PSRAM fitted* and it moves out.
- Switch to a **strip** and move *Lines in a strip*: RAM falls, flushes per redraw rise.
- Raise the screen to **800 × 480**: a frame no longer fits internal RAM on any chip.
- Lower the **SPI clock** to see the ceiling on the frame rate fall.`,
    mount(box, kit, params) {
      const G = kit.gfx, E = kit.esp;
      const mp = !!(params && params.mode === 'micropython');
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380, maxH: 480 });
      const CHIPS = ['esp32', 'esp32-s3', 'esp32-c3', 'esp32-p4'];
      const chipName = id => { const ch = E.chip(id); return ch ? String(ch.name).slice(0, 24) : id; };
      let strip = 0, hold = 0, stage = 0;
      const ctl = kit.controls(box.side, [
        { id: 'disp', type: 'select', label: 'Display', options: [['128 × 64 OLED, 1 bit', '128x64x1'], ['240 × 240, RGB565', '240x240x16'], ['320 × 240, RGB565', '320x240x16'], ['480 × 320, RGB565', '480x320x16'], ['800 × 480, RGB565', '800x480x16'], ['800 × 480, 24 bit', '800x480x24']], value: '320x240x16' },
        { id: 'chip', type: 'select', label: 'Chip', options: CHIPS.map(id => [chipName(id), id]), value: 'esp32' },
        { id: 'psram', type: 'check', label: 'PSRAM fitted (8 MB)', value: false },
        { id: 'how', type: 'select', label: mp ? 'The frame in memory' : 'LVGL draw buffer', options: [['One full frame', 'full'], ['Two full frames', 'full2'], ['A strip (partial)', 'part'], ['Two strips', 'part2']], value: mp ? 'full' : 'part' },
        { id: 'lines', label: 'Lines in a strip', min: 2, max: 120, step: 1, value: 24 },
        { id: 'spi', label: 'SPI clock', min: 5, max: 80, step: 1, value: 40, unit: 'MHz' }
      ], () => { strip = 0; stage = 0; hold = 0; });
      const ro = kit.readout(box.side, [['buf', 'Memory for pixels'], ['share', 'Of the internal SRAM'], ['fits', 'Verdict'], ['flush', 'Flushes per redraw'], ['time', 'Whole-screen redraw']]);
      function model() {
        const v = ctl.values, [w, h, bpp] = String(v.disp).split('x').map(Number);
        const ch = E.chip(v.chip) || {}, sramKB = typeof ch.sram === 'number' ? ch.sram : 400;
        const lines = Math.min(v.lines, h), partial = v.how === 'part' || v.how === 'part2', copies = v.how === 'full2' || v.how === 'part2' ? 2 : 1;
        const store = bpp <= 8 ? bpp : bpp <= 16 ? 16 : 24;
        const one = partial ? Math.ceil(w * lines * store / 8) : G.frameBytes(w, h, bpp);
        const bytes = one * copies, flushes = partial ? Math.ceil(h / lines) : 1;
        const psram = v.psram || v.chip === 'esp32-p4';
        const share = bytes / (sramKB * 1024);
        let verdict = 'comfortable in internal RAM', level = 0;
        if (share > 1) { level = 2; verdict = psram ? 'does not fit internal RAM: use PSRAM' : 'does not fit: needs PSRAM or a strip'; }
        else if (share > 0.4) { level = 2; verdict = psram ? 'too much for internal RAM: use PSRAM' : 'too big next to Wi-Fi and the heap'; }
        else if (share > 0.1) { level = 1; verdict = 'big: possible, but it crowds the heap'; }
        if (psram && bytes > 8 * 1048576) { level = 2; verdict = 'does not fit even in 8 MB of PSRAM'; }
        const fps = G.busFps(w, h, store, v.spi * 1e6);
        return { w, h, bpp, bytes, flushes, lines, partial, share, verdict, level, fps, sramKB, psram, copies };
      }
      const kb = n => (n >= 1048576 ? kit.fmt(n / 1048576, 3) + ' MB' : n >= 1024 ? kit.fmt(n / 1024, 3) + ' KB' : n + ' bytes');
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), m = model(), W = st.W, H = st.H, wide = W >= 600, pad = 14;
        // the animation of one redraw: strips are drawn into the buffer (amber), then flushed (blue)
        const steps = m.partial ? m.flushes : 1;
        if (hold > 0) hold -= dt; else { stage += dt * 3; if (stage >= 1) { stage = 0; strip++; if (strip >= steps) { strip = 0; hold = 0.8; } } }
        const area = wide ? { x: pad, y: 34, w: Math.floor(W * 0.46), h: H - 60 } : { x: pad, y: 30, w: W - 2 * pad, h: Math.floor(H * 0.36) };
        const sc = Math.min(area.w / m.w, area.h / m.h), sw = m.w * sc, sh = m.h * sc, sx = area.x + (area.w - sw) / 2, sy = area.y;
        kit.label(c, 'The screen and its buffer (' + m.w + ' × ' + m.h + ')', area.x, area.y - 14, { size: 11.5, color: C.muted });
        c.fillStyle = C.surface; c.fillRect(sx, sy, sw, sh);
        const stripH = m.partial ? m.lines * sc : sh;
        for (let i = 0; i < steps; i++) {
          const y = sy + i * stripH, hh = Math.min(stripH, sy + sh - y);
          if (hold > 0 || i < strip) { c.fillStyle = C.dark ? 'rgba(80,140,255,.45)' : 'rgba(40,90,220,.35)'; c.fillRect(sx, y, sw, hh); }
          else if (i === strip) { c.fillStyle = C.warn; c.globalAlpha = 0.85; c.fillRect(sx, y, sw, hh); c.globalAlpha = 1; }
          c.strokeStyle = C.border2; c.lineWidth = 1; c.strokeRect(sx, y, sw, hh);
        }
        c.strokeStyle = C.text2; c.lineWidth = 1.5; c.strokeRect(sx, sy, sw, sh);
        // the bars
        const bx = wide ? area.x + area.w + 30 : pad, bw = wide ? W - bx - pad : W - 2 * pad, by = wide ? 60 : area.y + area.h + 36, gapB = wide ? 76 : 62;
        const bar = (y, label, frac, text, color) => {
          kit.label(c, label, bx, y - 14, { size: 11.5, color: C.muted });
          c.fillStyle = C.surface2; c.fillRect(bx, y, bw, 16);
          c.fillStyle = color; c.fillRect(bx, y, Math.max(2, Math.min(1, frac) * bw), 16);
          c.strokeStyle = C.border2; c.strokeRect(bx, y, bw, 16);
          kit.label(c, text, bx + bw, y + 30, { size: 11, color: C.text2, align: 'right' });
        };
        const col = m.level === 0 ? C.ok : m.level === 1 ? C.warn : C.bad;
        bar(by, (m.copies > 1 ? 'Two ' : 'One ') + (m.partial ? 'strip of ' + m.lines + ' lines' : 'full frame') + (m.copies > 1 ? ' each' : ''), m.share, kb(m.bytes) + ' = ' + (m.share >= 10 ? 'over 1000' : kit.fmt(m.share * 100, 3)) + ' % of ' + kb(m.sramKB * 1024), col);
        bar(by + gapB, 'Internal SRAM of the ' + chipName(ctl.values.chip), 1, kb(m.sramKB * 1024) + ' in all, shared with Wi-Fi and the rest', C.faint);
        if (m.psram) bar(by + 2 * gapB, 'PSRAM', m.bytes / (8 * 1048576), kb(m.bytes) + ' of 8 MB', C.accent);
        ro.set('buf', kb(m.bytes) + (m.copies > 1 ? ' (2 buffers)' : ''));
        ro.set('share', (m.share >= 10 ? 'over ten times' : kit.fmt(m.share * 100, 3) + ' %'));
        ro.set('fits', m.verdict);
        ro.set('flush', m.flushes + (m.partial ? ' strips of ' + m.lines + ' lines' : ' (the whole frame)'));
        ro.set('time', kit.fmt(1000 / m.fps, 3) + ' ms at best: ' + kit.fmt(m.fps, 3) + ' a second');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ tg-widgets */
  Hyper.sim('tg-widgets', {
    title: 'A gallery of LVGL widgets',
    blurb: `Nine widgets on a 320 × 240 screen, drawn the way a GUI library draws them. Touch one to operate it; the panel under the screen says what its LVGL 9 widget is called, which event it reports, and which calls set and read it. The slider also feeds the bar and the arc gauge, and the chart takes a new point every quarter of a second.

**Try this**
- Drag the **slider**: VALUE_CHANGED, and the bar and the arc follow.
- Touch the **switch** and the **checkbox**: both report VALUE_CHANGED; their state is the *checked* state.
- Touch the **arc**: it only shows a value (no knob, no touch), which is what makes it a gauge.
- Tick **Outline every widget**: each is a rectangle with a hit area, the switch's a little larger than it looks.`,
    mount(box, kit) {
      const G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 440, maxH: 700 });
      const W = 320, H = 240;
      const fb = G.fb(W, H, { depth: 16 }), ui = G.ui(fb);
      const INFO = {
        label: { create: 'lv_label_create(parent)', ev: 'none: it only shows text', parts: 'MAIN', calls: 'lv_label_set_text, lv_label_set_text_fmt', note: 'A symbol such as LV_SYMBOL_WIFI is text in a label.' },
        btn: { create: 'lv_button_create(parent)', ev: 'CLICKED (also PRESSED, RELEASED, LONG_PRESSED)', parts: 'MAIN', calls: 'lv_obj_add_event_cb; put a label inside it', note: 'A button has no text of its own.' },
        slider: { create: 'lv_slider_create(parent)', ev: 'VALUE_CHANGED', parts: 'MAIN (track), INDICATOR, KNOB', calls: 'lv_slider_set_range, lv_slider_set_value, lv_slider_get_value', note: 'Setting the value from the program raises the event too.' },
        sw: { create: 'lv_switch_create(parent)', ev: 'VALUE_CHANGED', parts: 'MAIN, INDICATOR, KNOB', calls: 'lv_obj_add_state(sw, LV_STATE_CHECKED), lv_obj_has_state', note: 'On means the CHECKED state.' },
        ck: { create: 'lv_checkbox_create(parent)', ev: 'VALUE_CHANGED', parts: 'MAIN (text), INDICATOR (the box)', calls: 'lv_checkbox_set_text, lv_obj_has_state(cb, LV_STATE_CHECKED)', note: 'The text is part of the touch target.' },
        bar: { create: 'lv_bar_create(parent)', ev: 'none: it only shows', parts: 'MAIN, INDICATOR', calls: 'lv_bar_set_range, lv_bar_set_value', note: 'Progress and levels.' },
        arc: { create: 'lv_arc_create(parent)', ev: 'VALUE_CHANGED (if it can be dragged)', parts: 'MAIN, INDICATOR, KNOB', calls: 'lv_arc_set_range, lv_arc_set_value', note: 'Remove the KNOB style and the CLICKABLE flag: a gauge.' },
        chart: { create: 'lv_chart_create(parent)', ev: 'none: it only shows', parts: 'MAIN, ITEMS (the points)', calls: 'lv_chart_set_type, lv_chart_add_series, lv_chart_set_next_value', note: 'The default range is 0 to 100: scale readings into it.' },
        list: { create: 'lv_list_create(parent)', ev: 'CLICKED on each entry', parts: 'MAIN; each entry is a button', calls: 'lv_list_add_button(list, icon, text)', note: 'A menu that scrolls when it is longer than its box.' }
      };
      const ORDER = ['label', 'btn', 'slider', 'sw', 'ck', 'bar', 'arc', 'chart', 'list'];
      const NAME = { label: 'label', btn: 'button', slider: 'slider', sw: 'switch', ck: 'checkbox', bar: 'bar', arc: 'arc', chart: 'chart', list: 'list' };
      let sel = 'slider', sliderV = 40, swOn = true, ckOn = false, listSel = 0, pressed = null, lost = false, lastEvent = '—', acc = 0, ph = 0;
      const hist = Array.from({ length: 40 }, (_, i) => 40 + 15 * Math.sin(i / 4));
      let L = fit(st, W, H, 10, 160, 2);
      const ctl = kit.controls(box.side, [
        { id: 'w', type: 'select', label: 'Widget', options: ORDER.map(k => [NAME[k], k]), value: sel },
        { id: 'outline', type: 'check', label: 'Outline every widget', value: false }
      ], (id, v) => { if (id === 'w') sel = v; });
      const ro = kit.readout(box.side, [['create', 'Created with'], ['ev', 'Reports'], ['last', 'Last event'], ['val', 'Slider value']]);
      const base = id => (id ? String(id).split(':')[0] : null);
      function render() {
        ui.screen();
        ui.header('Widgets');
        txt(fb, 'label', 214, 30, { color: P.fg }); ui.icon('wifi', 252, 31); ui.hits.push({ x: 208, y: 24, w: 70, h: 22, id: 'label' });
        ui.button(10, 24, 92, 34, 'Button', { id: 'btn', pressed: pressed === 'btn' && !lost });
        txt(fb, 'switch', 114, 32, { color: P.fg }); ui.toggle(160, 29, swOn, { id: 'sw' });
        const h1 = ui.hits[ui.hits.length - 1]; h1.x -= 8; h1.y -= 8; h1.w += 16; h1.h += 16;
        ui.check(114, 48, ckOn, 'checkbox', { id: 'ck' });
        txt(fb, 'slider', 14, 76, { color: P.muted }); ui.slider(14, 90, 130, sliderV / 100, { id: 'slider' });
        txt(fb, 'bar', 14, 112, { color: P.muted }); ui.bar(14, 124, 130, 12, sliderV / 100, { id: 'bar' });
        txt(fb, 'arc', 236, 62, { color: P.muted, align: 'center' });
        ui.gauge(236, 114, 34, sliderV / 100, { id: 'arc', needle: false });
        txt(fb, String(Math.round(sliderV)), 236, 110, { align: 'center', color: P.fg });
        txt(fb, 'chart', 166, 142, { color: P.muted }); ui.chart(166, 154, 144, 54, hist, { min: 0, max: 100, id: 'chart' });
        txt(fb, 'list', 14, 146, { color: P.muted }); ui.list(14, 158, 130, ['Wi-Fi', 'Display', 'About'], listSel, { id: 'list', rowH: 16 });
        for (const b of ui.hits) {
          const on = base(b.id) === sel;
          if (on) { fb.rect(b.x - 2, b.y - 2, b.w + 4, b.h + 4, P.warn); fb.rect(b.x - 3, b.y - 3, b.w + 6, b.h + 6, P.warn); }
          else if (ctl.values.outline) fb.rect(b.x, b.y, b.w, b.h, P.dim);
        }
      }
      const setSlider = x => { const v = Math.round(clamp((x - 14) / 130, 0, 1) * 100); if (v !== Math.round(sliderV)) { sliderV = v; lastEvent = 'slider VALUE_CHANGED (' + v + ')'; } };
      screenTouch(kit, st, G, fb, () => L, {
        down(p) {
          const id = ui.hit(p.x, p.y); pressed = id; lost = false;
          if (id) { sel = base(id); ctl.set('w', sel); lastEvent = NAME[sel] + ' PRESSED'; if (id === 'slider') setSlider(p.x); }
        },
        move(p) {
          if (!pressed) return;
          if (pressed === 'slider') { setSlider(p.x); return; }
          if (!lost && ui.hit(p.x, p.y) !== pressed) { lost = true; lastEvent = NAME[base(pressed)] + ' PRESS_LOST'; }
        },
        up(p) {
          const id = pressed; pressed = null;
          if (!id || lost || id === 'slider') return;
          if (id === 'btn') lastEvent = 'button CLICKED';
          else if (id === 'sw') { swOn = !swOn; lastEvent = 'switch VALUE_CHANGED (' + (swOn ? 'checked' : 'unchecked') + ')'; }
          else if (id === 'ck') { ckOn = !ckOn; lastEvent = 'checkbox VALUE_CHANGED (' + (ckOn ? 'checked' : 'unchecked') + ')'; }
          else if (base(id) === 'list') { listSel = Number(String(id).split(':')[1]) || 0; lastEvent = 'list entry ' + listSel + ' CLICKED'; }
          else lastEvent = NAME[base(id)] + ' touched: no event';
        }
      });
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors();
        acc += dt; ph += dt;
        while (acc >= 0.25) { acc -= 0.25; hist.push(clamp(sliderV + 10 * Math.sin(ph * 2.3) + 6 * Math.sin(ph * 7.1), 0, 100)); if (hist.length > 40) hist.shift(); }
        render();
        L = fit(st, W, H, 10, 160, 2);
        const r = G.draw(c, fb, L.x, L.y, L.scale, { style: 'tft' });
        const info = INFO[sel] || INFO.label, y = r.y + r.h + 20, maxCh = Math.max(24, Math.floor((st.W - 2 * r.x + 10) / 6.4));
        kit.label(c, info.create, r.x, y, { size: 13, color: C.text, weight: 650, font: MONO });
        const rows = wrapText('reports   ' + info.ev, maxCh).concat(wrapText('parts     ' + info.parts, maxCh), wrapText('calls     ' + info.calls, maxCh));
        rows.forEach((l, i) => kit.label(c, l, r.x, y + 20 + i * 15, { size: 11, color: C.text2 }));
        kit.label(c, info.note, r.x, y + 24 + rows.length * 15, { size: 11, color: C.muted });
        ro.set('create', info.create);
        ro.set('ev', info.ev);
        ro.set('last', lastEvent);
        ro.set('val', Math.round(sliderV) + ' of 100');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ tg-layout */
  Hyper.sim('tg-layout', {
    title: 'Flex layout, as LVGL does it',
    blurb: `A container with five children, laid out by the rules of LVGL's flex layout. Change the **flow**, the alignment on the **main axis** (along the flow) and on the **cross axis**, the gap and the size of the container, and read the calls that make it. The picture follows the model of LVGL: items are put in tracks, free space is shared out, and the tracks are placed by the third argument. It is schematic, and the pixel sizes of real widgets differ.

**Try this**
- Shrink the container width with **ROW**: the items overflow. Switch to **ROW_WRAP** and a second track appears.
- Set the main axis to **SPACE_BETWEEN**, **SPACE_AROUND**, **SPACE_EVENLY** and compare the gaps.
- Tick **Item B grows**: it takes all the free space on the main axis.
- Choose **COLUMN** and note how main and cross swap.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 460, maxH: 560 });
      const ITEMS = [[70, 40], [110, 56], [60, 32], [90, 48], [80, 40]];
      const NAMES = 'ABCDE';
      const FLOWS = ['ROW', 'COLUMN', 'ROW_WRAP', 'COLUMN_WRAP'];
      const MAIN = ['START', 'CENTER', 'END', 'SPACE_BETWEEN', 'SPACE_AROUND', 'SPACE_EVENLY'];
      const CROSS = ['START', 'CENTER', 'END'];
      const opt = (pre, list) => list.map(f => [pre + f, f]);
      const ctl = kit.controls(box.side, [
        { id: 'flow', type: 'select', label: 'Flow', options: opt('LV_FLEX_FLOW_', FLOWS), value: 'ROW_WRAP' },
        { id: 'main', type: 'select', label: 'Main axis', options: opt('LV_FLEX_ALIGN_', MAIN), value: 'START' },
        { id: 'cross', type: 'select', label: 'Cross axis (items in a track)', options: opt('LV_FLEX_ALIGN_', CROSS), value: 'START' },
        { id: 'track', type: 'select', label: 'Tracks in the container', options: opt('LV_FLEX_ALIGN_', CROSS), value: 'START' },
        { id: 'w', label: 'Container width', min: 140, max: 560, step: 5, value: 360, unit: 'px' },
        { id: 'h', label: 'Container height', min: 100, max: 260, step: 5, value: 170, unit: 'px' },
        { id: 'gap', label: 'Gap', min: 0, max: 30, step: 1, value: 8, unit: 'px' },
        { id: 'n', label: 'Items', min: 1, max: 5, step: 1, value: 5 },
        { id: 'grow', type: 'check', label: 'Item B grows (flex grow 1)', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['tracks', 'Tracks'], ['free', 'Free space, first track'], ['over', 'Overflow']]);
      const PAD = 6;
      function layout(v) {
        const vert = v.flow.indexOf('COLUMN') === 0, wrap = v.flow.indexOf('WRAP') > 0;
        const mainSize = (vert ? v.h : v.w) - 2 * PAD, crossSize = (vert ? v.w : v.h) - 2 * PAD;
        const items = ITEMS.slice(0, v.n).map((s, i) => ({ i, m: vert ? s[1] : s[0], c: vert ? s[0] : s[1] }));
        const tracks = []; let cur = [], used = 0;
        for (const it of items) {
          const add = cur.length ? it.m + v.gap : it.m;
          if (wrap && cur.length && used + add > mainSize) { tracks.push(cur); cur = []; used = 0; }
          used += cur.length ? it.m + v.gap : it.m;
          cur.push(it);
        }
        if (cur.length) tracks.push(cur);
        let over = false, firstFree = 0;
        const placed = [];
        const tCross = tracks.map(t => Math.max.apply(null, t.map(q => q.c)));
        const totalCross = tCross.reduce((s, q) => s + q, 0) + v.gap * (tracks.length - 1);
        const freeCross = Math.max(0, crossSize - totalCross);
        if (totalCross > crossSize) over = true;
        let cy = v.track === 'CENTER' ? freeCross / 2 : v.track === 'END' ? freeCross : 0;
        tracks.forEach((t, ti) => {
          let sum = t.reduce((s, q) => s + q.m, 0) + v.gap * (t.length - 1), free = mainSize - sum;
          if (v.grow && t.some(q => q.i === 1) && free > 0) { t.find(q => q.i === 1).m += free; free = 0; }
          if (free < 0) over = true;
          if (ti === 0) firstFree = free;
          free = Math.max(0, free);
          const n = t.length;
          let off = 0, sp = v.gap;
          if (v.main === 'CENTER') off = free / 2; else if (v.main === 'END') off = free;
          else if (v.main === 'SPACE_BETWEEN') sp = v.gap + (n > 1 ? free / (n - 1) : 0);
          else if (v.main === 'SPACE_AROUND') { sp = v.gap + free / n; off = free / n / 2; }
          else if (v.main === 'SPACE_EVENLY') { sp = v.gap + free / (n + 1); off = free / (n + 1); }
          let pos = off;
          for (const it of t) {
            const co = v.cross === 'CENTER' ? (tCross[ti] - it.c) / 2 : v.cross === 'END' ? tCross[ti] - it.c : 0;
            placed.push(vert ? { i: it.i, x: PAD + cy + co, y: PAD + pos, w: it.c, h: it.m } : { i: it.i, x: PAD + pos, y: PAD + cy + co, w: it.m, h: it.c });
            pos += it.m + sp;
          }
          cy += tCross[ti] + v.gap;
        });
        return { placed, tracks: tracks.length, over, free: firstFree };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, r = layout(v);
        const sc = Math.min(1, (st.W - 28) / v.w, (st.H - 200) / v.h), cx = Math.round((st.W - v.w * sc) / 2), cy = 24;
        kit.label(c, 'The container: ' + v.w + ' × ' + v.h + ' px, padding ' + PAD + ' px', cx, cy - 12, { size: 11.5, color: C.muted });
        c.fillStyle = C.surface; c.fillRect(cx, cy, v.w * sc, v.h * sc);
        c.strokeStyle = r.over ? C.bad : C.border2; c.lineWidth = 2; c.strokeRect(cx, cy, v.w * sc, v.h * sc);
        c.setLineDash([3, 4]); c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(cx + PAD * sc, cy + PAD * sc, (v.w - 2 * PAD) * sc, (v.h - 2 * PAD) * sc); c.setLineDash([]);
        for (const p of r.placed) {
          const x = cx + p.x * sc, y = cy + p.y * sc, w = p.w * sc, h = p.h * sc;
          c.fillStyle = kit.hue(30 + p.i * 62, 0.55); c.fillRect(x, y, w, h);
          c.strokeStyle = kit.hue(30 + p.i * 62, 1); c.lineWidth = 1.5; c.strokeRect(x, y, w, h);
          kit.label(c, NAMES[p.i], x + w / 2, y + h / 2, { size: 14, color: C.text, align: 'center', weight: 650 });
        }
        const gy = cy + v.h * sc + 26, vert = v.flow.indexOf('COLUMN') === 0;
        const code = [
          'lv_obj_set_flex_flow(cont, LV_FLEX_FLOW_' + v.flow + ');',
          'lv_obj_set_flex_align(cont,',
          '    LV_FLEX_ALIGN_' + v.main + ',',
          '    LV_FLEX_ALIGN_' + v.cross + ',',
          '    LV_FLEX_ALIGN_' + v.track + ');',
          vert ? 'lv_obj_set_style_pad_row(cont, ' + v.gap + ', 0);' : 'lv_obj_set_style_pad_column(cont, ' + v.gap + ', 0);'
        ];
        if (v.flow.indexOf('WRAP') > 0) code.push(vert ? 'lv_obj_set_style_pad_column(cont, ' + v.gap + ', 0);' : 'lv_obj_set_style_pad_row(cont, ' + v.gap + ', 0);');
        if (v.grow && v.n > 1) code.push('lv_obj_set_flex_grow(item_b, 1);');
        code.forEach((l, i) => kit.label(c, l, Math.max(12, cx), gy + i * 15, { size: 11, color: C.text2, font: MONO }));
        ro.set('tracks', String(r.tracks));
        ro.set('free', r.free >= 0 ? kit.fmt(r.free, 3) + ' px' : 'short by ' + kit.fmt(-r.free, 3) + ' px');
        ro.set('over', r.over ? 'yes: the children do not fit' : 'no');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ tg-screens */
  Hyper.sim('tg-screens', {
    title: 'Screens, events and navigation',
    blurb: `Three screens (Home, Settings, Data) with a back stack, as an LVGL program loads them. The log shows the events your callbacks would see: PRESSED, RELEASED, CLICKED, VALUE_CHANGED, and the screen load events that bracket a change of screen. Choose whether the screens are kept in memory or created when needed.

**Try this**
- Tap **Settings**, then **< Back**: the stack grows and shrinks.
- Press a button, slide off it, and lift: PRESS_LOST, no click, no navigation.
- Switch off **Keep every screen in memory** and watch *Widgets in RAM* fall to the one screen showing.
- Turn **Slide animation** off for an instant change.`,
    mount(box, kit) {
      const G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 460, maxH: 700 });
      const W = 320, H = 240;
      const NAMES = ['home', 'settings', 'data'];
      const fbs = { home: G.fb(W, H, { depth: 16 }), settings: G.fb(W, H, { depth: 16 }), data: G.fb(W, H, { depth: 16 }) };
      const uis = { home: G.ui(fbs.home), settings: G.ui(fbs.settings), data: G.ui(fbs.data) };
      const view = G.fb(W, H, { depth: 16 });
      const WIDGETS = { home: 4, settings: 6, data: 5 };
      const stack = ['home'], events = [];
      let cur = 'home', anim = null, wifi = true, bright = 70, pressed = null, lost = false, ph = 0, L = fit(st, W, H, 10, 128, 2);
      const hist = Array.from({ length: 40 }, (_, i) => 21 + Math.sin(i / 5));
      const log = (text, color) => { events.unshift({ text, color }); if (events.length > 7) events.pop(); };
      const ctl = kit.controls(box.side, [
        { id: 'anim', type: 'check', label: 'Slide animation', value: true },
        { id: 'keep', type: 'check', label: 'Keep every screen in memory (create once)', value: true },
        { type: 'buttons', items: [{ id: 'back', label: 'Back (a hardware key)' }] }
      ], id => { if (id === 'back') goBack(); });
      const ro = kit.readout(box.side, [['screen', 'Screen'], ['depth', 'Back stack'], ['ram', 'Widgets in RAM'], ['last', 'Last event']]);
      function navigate(to, dir) {
        if (anim || to === cur) return;
        const C = kit.colors();
        log('SCREEN_UNLOAD_START  ' + cur, C.muted);
        log('lv_screen_load(' + to + ')' + (ctl.values.keep ? '' : '   // created just now'), C.accent);
        const from = cur;
        if (ctl.values.anim) anim = { from, to, t: 0, dir }; else { cur = to; log('SCREEN_LOADED        ' + to, C.ok); if (!ctl.values.keep) log('lv_obj_delete(' + from + ')', C.muted); }
        if (dir > 0) stack.push(to); else stack.pop();
        if (!ctl.values.anim) cur = to;
      }
      function goBack() { if (stack.length > 1 && !anim) navigate(stack[stack.length - 2], -1); }
      function drawScreen(name) {
        const fb = fbs[name], ui = uis[name];
        ui.screen();
        if (name === 'home') {
          ui.header('Home');
          ui.button(40, 40, 240, 44, 'Settings', { id: 'go-settings', size: 2, pressed: pressed === 'go-settings' && !lost && cur === name });
          ui.button(40, 100, 240, 44, 'Data', { id: 'go-data', size: 2, pressed: pressed === 'go-data' && !lost && cur === name });
          txt(fb, 'a menu of two buttons', 160, 170, { align: 'center', color: P.muted });
        } else if (name === 'settings') {
          ui.header('Settings');
          txt(fb, 'Wi-Fi', 20, 48, { size: 2 }); ui.toggle(248, 46, wifi, { id: 'wifi' });
          const h = ui.hits[ui.hits.length - 1]; h.x -= 10; h.y -= 10; h.w += 20; h.h += 20;
          txt(fb, 'Brightness', 20, 88, { size: 2 }); ui.slider(24, 122, 270, bright / 100, { id: 'bright' });
          txt(fb, bright + ' %', 160, 146, { align: 'center', color: P.muted });
          ui.button(20, 190, 100, 40, '< Back', { id: 'back', pressed: pressed === 'back' && !lost && cur === name });
        } else {
          ui.header('Data');
          txt(fb, (21 + 1.5 * Math.sin(ph)).toFixed(1), 160, 36, { size: 5, align: 'center' });
          txt(fb, '°C, the living room', 160, 82, { align: 'center', color: P.muted });
          ui.chart(20, 100, 280, 70, hist, { min: 18, max: 25 });
          ui.button(20, 190, 100, 40, '< Back', { id: 'back', pressed: pressed === 'back' && !lost && cur === name });
        }
      }
      screenTouch(kit, st, G, view, () => L, {
        down(p) {
          if (anim) return;
          const id = uis[cur].hit(p.x, p.y); pressed = id; lost = false;
          if (id) { log('PRESSED    ' + id, kit.colors().muted); if (id === 'bright') { bright = Math.round(clamp((p.x - 24) / 270, 0, 1) * 100); log('VALUE_CHANGED  bright = ' + bright, kit.colors().accent); } }
        },
        move(p) {
          if (!pressed || anim) return;
          if (pressed === 'bright') { const v = Math.round(clamp((p.x - 24) / 270, 0, 1) * 100); if (v !== bright) { bright = v; log('VALUE_CHANGED  bright = ' + bright, kit.colors().accent); } return; }
          if (!lost && uis[cur].hit(p.x, p.y) !== pressed) { lost = true; log('PRESS_LOST ' + pressed, kit.colors().warn); }
        },
        up(p) {
          const id = pressed; pressed = null;
          if (!id || lost || anim) return;
          const C = kit.colors();
          log('RELEASED   ' + id, C.muted);
          if (id === 'bright') return;
          log('CLICKED    ' + id, C.ok);
          if (id === 'go-settings') navigate('settings', 1);
          else if (id === 'go-data') navigate('data', 1);
          else if (id === 'back') goBack();
          else if (id === 'wifi') { wifi = !wifi; log('VALUE_CHANGED  wifi = ' + (wifi ? 'on' : 'off'), C.accent); }
        }
      });
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors();
        ph += dt;
        if (Math.floor(ph * 2) !== Math.floor((ph - dt) * 2)) { hist.push(21 + 1.5 * Math.sin(ph) + 0.2 * Math.sin(ph * 9)); if (hist.length > 40) hist.shift(); }
        if (anim) {
          anim.t += dt / 0.28;
          if (anim.t >= 1) { cur = anim.to; log('SCREEN_LOADED        ' + cur, C.ok); if (!ctl.values.keep) log('lv_obj_delete(' + anim.from + ')', C.muted); anim = null; }
        }
        drawScreen(cur);
        if (anim) {
          drawScreen(anim.from); drawScreen(anim.to);
          const e = anim.t * anim.t * (3 - 2 * anim.t), off = Math.round(clamp(e, 0, 1) * W);
          for (let y = 0; y < H; y++) {
            if (anim.dir > 0) { view.px.set(fbs[anim.from].px.subarray(y * W + off, y * W + W), y * W); view.px.set(fbs[anim.to].px.subarray(y * W, y * W + off), y * W + W - off); }
            else { view.px.set(fbs[anim.to].px.subarray(y * W + W - off, y * W + W), y * W); view.px.set(fbs[anim.from].px.subarray(y * W, y * W + W - off), y * W + off); }
          }
        } else view.px.set(fbs[cur].px);
        L = fit(st, W, H, 10, 128, 2);
        const r = G.draw(c, view, L.x, L.y, L.scale, { style: 'tft' });
        kit.label(c, 'back stack: ' + stack.join(' › '), r.x, r.y + r.h + 16, { size: 11.5, color: C.text2, font: MONO });
        logLines(kit, c, C, r.x, r.y + r.h + 36, events, { step: 14, size: 10.5 });
        const keep = ctl.values.keep;
        ro.set('screen', cur + (anim ? ' (loading ' + anim.to + ')' : ''));
        ro.set('depth', String(stack.length));
        ro.set('ram', String(keep ? WIDGETS.home + WIDGETS.settings + WIDGETS.data : WIDGETS[cur] + (anim ? WIDGETS[anim.to] : 0)) + (keep ? ' (all three screens)' : ' (the showing screen)'));
        ro.set('last', events.length ? events[0].text.replace(/ +/g, ' ') : '—');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ tg-designer */
  Hyper.sim('tg-designer', {
    title: 'A tiny GUI designer that writes LVGL 9',
    blurb: `Add widgets, drag them into place on the 320 × 240 screen, and read the LVGL 9 code the designer would write for exactly what you see. The code shown starts with the widget you selected. It is the same code you could write by hand: a designer saves the typing and the guessing of pixel positions, not the understanding.

**Try this**
- Press **Add it** a few times with different widget types; drag them about.
- Tick **Snap to a 10 px grid**: the positions in the code become round numbers.
- Select a widget and delete it: its block disappears from the code.
- Count the lines per widget: a screen of fifty widgets is hundreds of lines nobody wants to type.`,
    mount(box, kit) {
      const G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 480, maxH: 540 });
      const W = 320, H = 240;
      const fb = G.fb(W, H, { depth: 16 }), ui = G.ui(fb);
      const KINDS = { button: { w: 92, h: 34, text: 'Button' }, label: { w: 36, h: 8, text: 'Label' }, slider: { w: 112, h: 13 }, switch: { w: 26, h: 14 }, bar: { w: 100, h: 12 } };
      let items = [{ k: 'label', x: 20, y: 28, text: 'Thermostat' }, { k: 'slider', x: 20, y: 70 }, { k: 'button', x: 20, y: 110, text: 'Save' }];
      items.forEach(it => { Object.assign(it, { w: KINDS[it.k].w, h: KINDS[it.k].h }); if (it.k === 'label') it.w = G.textWidth(it.text, 1); });
      let sel = 2, grab = null, L = { x: 14, y: 12, scale: 1, w: W, h: H };
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Widget to add', options: Object.keys(KINDS).map(k => [k, k]), value: 'button' },
        { id: 'snap', type: 'check', label: 'Snap to a 10 px grid', value: false },
        { type: 'buttons', items: [{ id: 'add', label: 'Add it', primary: true }, { id: 'del', label: 'Delete the selected' }, { id: 'clear', label: 'Clear the screen' }] }
      ], id => {
        if (id === 'add') {
          const k = ctl.values.kind, n = items.length, d = KINDS[k];
          items.push({ k, x: 30 + (n * 26) % 150, y: 40 + (n * 34) % 150, w: d.w, h: d.h, text: d.text });
          sel = items.length - 1;
        }
        if (id === 'del' && sel != null) { items.splice(sel, 1); sel = items.length ? Math.min(sel, items.length - 1) : null; }
        if (id === 'clear') { items = []; sel = null; }
      });
      const ro = kit.readout(box.side, [['n', 'Widgets'], ['sel', 'Selected'], ['pos', 'Position'], ['lines', 'Lines of code']]);
      const NAMEOF = (it, i) => it.k + (items.slice(0, i + 1).filter(q => q.k === it.k).length);
      function codeOf(it, i) {
        const n = NAMEOF(it, i), p = 'lv_screen_active()';
        const head = 'lv_obj_t *' + n + ' = lv_' + (it.k === 'button' ? 'button' : it.k) + '_create(' + p + ');';
        const pos = 'lv_obj_set_pos(' + n + ', ' + it.x + ', ' + it.y + ');', size = 'lv_obj_set_size(' + n + ', ' + it.w + ', ' + it.h + ');';
        if (it.k === 'button') return [head, pos, size, 'lv_label_set_text(lv_label_create(' + n + '), "' + it.text + '");'];
        if (it.k === 'label') return [head, 'lv_label_set_text(' + n + ', "' + it.text + '");', pos];
        if (it.k === 'slider') return [head, pos, size];
        if (it.k === 'switch') return [head, pos];
        return [head, pos, size, 'lv_bar_set_value(' + n + ', 60, LV_ANIM_OFF);'];
      }
      function render() {
        fb.clear(P.bg);
        if (ctl.values.snap) for (let y = 0; y < H; y += 10) for (let x = 0; x < W; x += 10) fb.pixel(x, y, P.dim);
        ui.screen();
        items.forEach((it, i) => {
          if (it.k === 'button') ui.button(it.x, it.y, it.w, it.h, it.text, { id: 'w' + i });
          else if (it.k === 'label') { txt(fb, it.text, it.x, it.y, { color: P.fg }); ui.hits.push({ x: it.x, y: it.y - 3, w: it.w, h: 14, id: 'w' + i }); }
          else if (it.k === 'slider') { ui.slider(it.x + 6, it.y, it.w - 12, 0.5, { id: 'w' + i }); }
          else if (it.k === 'switch') ui.toggle(it.x, it.y, true, { id: 'w' + i });
          else ui.bar(it.x, it.y, it.w, it.h, 0.6, { id: 'w' + i });
        });
        if (sel != null && items[sel]) { const it = items[sel]; fb.rect(it.x - 3, it.y - 3, it.w + 6, it.h + 6, P.warn); fb.fillRect(it.x + it.w + 1, it.y + it.h + 1, 4, 4, P.warn); }
      }
      screenTouch(kit, st, G, fb, () => L, {
        down(p) {
          let found = null;
          for (let i = items.length - 1; i >= 0; i--) { const it = items[i]; if (p.x >= it.x - 4 && p.x <= it.x + it.w + 4 && p.y >= it.y - 6 && p.y <= it.y + it.h + 6) { found = i; break; } }
          sel = found;
          grab = found == null ? null : { dx: p.x - items[found].x, dy: p.y - items[found].y };
        },
        move(p) {
          if (sel == null || !grab || !items[sel]) return;
          const it = items[sel], g = ctl.values.snap ? 10 : 1;
          it.x = clamp(Math.round((p.x - grab.dx) / g) * g, 0, W - it.w); it.y = clamp(Math.round((p.y - grab.dy) / g) * g, 0, H - it.h);
        },
        up() { grab = null; }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), wide = st.W >= 680;
        L = wide ? { x: 14, y: 14, scale: 1, w: W, h: H } : { x: Math.max(8, Math.round((st.W - W) / 2)), y: 12, scale: 1, w: W, h: H };
        render();
        const r = G.draw(c, fb, L.x, L.y, 1, { style: 'tft' });
        const cx = wide ? r.x + r.w + 18 : r.x, cy = wide ? r.y + 6 : r.y + r.h + 24, maxCh = Math.max(20, Math.floor(((wide ? st.W - cx - 10 : st.W - 2 * cx) - 4) / 6.7));
        kit.label(c, 'generated code (the selected widget first)', cx, cy, { size: 11.5, color: C.muted });
        // all blocks, rotated so that the selected one comes first
        const blocks = items.map((it, i) => codeOf(it, i));
        const order = items.map((_, i) => i).sort((a, b) => ((a - (sel || 0) + items.length) % items.length) - ((b - (sel || 0) + items.length) % items.length));
        const lines = []; order.forEach(i => blocks[i].forEach(l => lines.push({ l, on: i === sel })));
        const maxLines = wide ? 18 : 10;
        lines.slice(0, maxLines).forEach((q, i) => kit.label(c, q.l.length > maxCh ? q.l.slice(0, maxCh - 1) + '…' : q.l, cx, cy + 20 + i * 15, { size: 11, color: q.on ? C.accent : C.text2, font: MONO }));
        if (lines.length > maxLines) kit.label(c, '… and ' + (lines.length - maxLines) + ' more lines', cx, cy + 20 + maxLines * 15, { size: 11, color: C.faint, font: MONO });
        if (!items.length) kit.label(c, '// an empty screen: add a widget', cx, cy + 20, { size: 11, color: C.faint, font: MONO });
        const total = blocks.reduce((s, b) => s + b.length, 0), it = sel != null ? items[sel] : null;
        ro.set('n', String(items.length));
        ro.set('sel', it ? NAMEOF(it, sel) : '—');
        ro.set('pos', it ? 'x ' + it.x + ', y ' + it.y + ', size ' + it.w + ' × ' + it.h : '—');
        ro.set('lines', String(total));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ tg-present */
  Hyper.sim('tg-present', {
    title: 'One reading, four ways to show it',
    blurb: `The same temperature, shown as a number, a bar, a gauge and a trend chart on one 320 × 240 screen. The reading wobbles with noise and drifts slowly; the controls change how it is presented, and what goes wrong when the sensor stops.

**Try this**
- Raise the **noise** with no smoothing: the number flickers. Add **smoothing** and it settles, but follows a real change later.
- Lower **Number refresh** to 1 a second and compare it with 20.
- Tick **The sensor is lost**. With *Mark stale data* on the number turns to dashes. Switch it off: the screen shows the last value as if it were new.
- Tick **Auto-scale the chart**: noise becomes drama. Tick **Colour-blind view** and see what the thresholds look like.`,
    mount(box, kit) {
      const G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 440, maxH: 700 });
      const W = 320, H = 240, LO = 10, HI = 30, NORM = [18, 24];
      const fb = G.fb(W, H, { depth: 16 }), ui = G.ui(fb);
      const R = rng(3);
      let t = 0, raw = 21, sm = 21, shown = 21, sampleAcc = 0, numAcc = 0, chartAcc = 0, lastGood = 0, L = fit(st, W, H, 10, 56, 2);
      const hist = Array.from({ length: 40 }, () => 21);
      const ctl = kit.controls(box.side, [
        { id: 'noise', label: 'Sensor noise', min: 0, max: 1.5, step: 0.05, value: 0.5, unit: '°C' },
        { id: 'tau', label: 'Smoothing (time constant)', min: 0, max: 3, step: 0.1, value: 0.8, unit: 's' },
        { id: 'rate', label: 'Number refresh', min: 1, max: 20, step: 1, value: 4, unit: 'per second' },
        { id: 'lost', type: 'check', label: 'The sensor is lost (data stops)', value: false },
        { id: 'mark', type: 'check', label: 'Mark stale data', value: true },
        { id: 'thr', type: 'check', label: 'Colour thresholds (cold, normal, hot)', value: true },
        { id: 'auto', type: 'check', label: 'Auto-scale the chart', value: false },
        { id: 'cvd', type: 'check', label: 'Colour-blind view (red and green look alike)', value: false }
      ], () => {});
      const ro = kit.readout(box.side, [['raw', 'Sensor now'], ['shown', 'Shown'], ['age', 'Age of the data'], ['range', 'Chart range']]);
      const cvd = col => { const r = (col >> 16) & 255, g = (col >> 8) & 255, b = col & 255; return G.rgb(clamp(0.152286 * r + 1.052583 * g - 0.204868 * b, 0, 255), clamp(0.114503 * r + 0.786281 * g + 0.099216 * b, 0, 255), clamp(-0.003882 * r - 0.048116 * g + 1.051998 * b, 0, 255)); };
      const colour = col => (ctl.values.cvd ? cvd(col) : col);
      const BLUE = 0x3080FF;
      const level = v => (!ctl.values.thr ? colour(P.accent) : v < NORM[0] ? colour(BLUE) : v > NORM[1] ? colour(P.bad) : colour(P.ok));
      function render(stale) {
        const v = ctl.values, dim = stale && v.mark, val = dim ? P.dim : level(shown), frac = clamp((shown - LO) / (HI - LO), 0, 1);
        fb.clear(P.bg);
        fb.hline(0, 119, W, P.dim); fb.vline(160, 0, H, P.dim);
        // 1: the number
        txt(fb, 'NUMBER', 6, 6, { color: P.muted });
        txt(fb, dim ? '--.-' : shown.toFixed(1), 80, 36, { size: 4, align: 'center', color: dim ? P.dim : val });
        txt(fb, '°C', 80, 78, { align: 'center', color: P.muted });
        txt(fb, dim ? 'STALE ' + (t - lastGood).toFixed(0) + ' s' : (stale ? 'last value' : 'now'), 80, 100, { align: 'center', color: dim ? P.warn : P.muted });
        // 2: the bar, with the normal band marked
        txt(fb, 'BAR', 166, 6, { color: P.muted });
        ui.bar(172, 44, 136, 22, frac, { color: val });
        for (const m of NORM) { const x = 172 + 2 + Math.round((m - LO) / (HI - LO) * 132); fb.vline(x, 38, 34, P.fg); }
        txt(fb, 'normal', 172 + 2 + Math.round(((NORM[0] + NORM[1]) / 2 - LO) / (HI - LO) * 132), 76, { align: 'center', color: P.muted });
        txt(fb, String(LO), 172, 92, { color: P.muted }); txt(fb, String(HI), 308, 92, { color: P.muted, align: 'right' });
        // 3: the gauge
        txt(fb, 'GAUGE', 6, 126, { color: P.muted });
        ui.gauge(80, 186, 42, frac, { color: val });
        txt(fb, dim ? '--' : shown.toFixed(0), 80, 200, { align: 'center', color: dim ? P.dim : P.fg });
        // 4: the trend
        txt(fb, 'CHART', 166, 126, { color: P.muted });
        const lo = v.auto ? Math.min.apply(null, hist) - 0.05 : LO, hi = v.auto ? Math.max.apply(null, hist) + 0.05 : HI;
        ui.chart(172, 142, 136, 66, hist, { min: lo, max: hi, color: dim ? P.dim : colour(P.accent) });
        if (!v.auto) { const y = Math.round(142 + 66 - 2 - (21 - lo) / (hi - lo) * 62); fb.hline(173, y, 134, P.muted); txt(fb, '21', 174, y - 9, { color: P.muted }); }
        txt(fb, v.auto ? lo.toFixed(2) + ' to ' + hi.toFixed(2) : 'last 40 s', 172, 214, { color: P.muted });
        if (dim) txt(fb, 'no data', 240, 178, { align: 'center', color: P.warn });
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        t += dt;
        sampleAcc += dt; numAcc += dt; chartAcc += dt;
        if (!v.lost) {
          while (sampleAcc >= 0.1) {
            sampleAcc -= 0.1;
            raw = 21 + 2.4 * Math.sin(2 * Math.PI * t / 45) + 0.7 * Math.sin(2 * Math.PI * t / 6.1) + gauss(R) * v.noise * 0.5;
            const alpha = 0.1 / (v.tau + 0.1);
            sm += alpha * (raw - sm);
            lastGood = t;
          }
          while (chartAcc >= 1) { chartAcc -= 1; hist.push(sm); if (hist.length > 40) hist.shift(); }
        } else { sampleAcc = 0; chartAcc = 0; }
        if (numAcc >= 1 / v.rate) { numAcc = 0; shown = sm; }
        const stale = t - lastGood > 1.5;
        render(stale);
        L = fit(st, W, H, 10, 56, 2);
        const r = G.draw(c, fb, L.x, L.y, L.scale, { style: 'tft' });
        kit.label(c, 'number: exact · bar: in the normal band?', r.x, r.y + r.h + 16, { size: 10.5, color: C.faint });
        kit.label(c, 'gauge: at a glance · chart: where it is heading', r.x, r.y + r.h + 32, { size: 10.5, color: C.faint });
        ro.set('raw', kit.fmt(raw, 4) + ' °C' + (v.lost ? ' (lost)' : ''));
        ro.set('shown', kit.fmt(shown, 4) + ' °C');
        ro.set('age', stale ? kit.fmt(t - lastGood, 3) + ' s' + (v.mark ? ': marked stale' : ': nothing says so') : 'fresh');
        ro.set('range', v.auto ? 'auto: ' + kit.fmt(Math.min.apply(null, hist), 4) + ' to ' + kit.fmt(Math.max.apply(null, hist), 4) : 'fixed 10 to 30');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ tg-targets */
  Hyper.sim('tg-targets', {
    title: 'How big must a touch target be?',
    blurb: `Three buttons on a virtual panel, drawn at the real size of the screen you choose. Tap **OK** as if with a finger: the contact lands where you click **plus a random scatter**, as a real fingertip does, and is counted as a hit, a wrong button or a miss. The model assumes a scatter of 2.5 mm for a careful tap; real people and moving vehicles differ, so treat the figures as a model and not a measurement.

**Try this**
- Keep the 30 px button and press **Run 1000 taps** at 2.8 inches (about 5 mm): how often does a tap miss, and how often does it press the neighbour?
- Make the button big enough for 9 mm and run again.
- Shrink the **gap**: misses become wrong-button errors, which are worse than misses.
- Move the screen to **7 inches**: the same 30 pixels are now a comfortable size.`,
    mount(box, kit) {
      const G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 400, maxH: 540 });
      const SW = 320, SH = 240;
      const R = rng(21);
      let taps = 0, okN = 0, wrongN = 0, missN = 0, contact = null, verdict = '', L = { x: 14, y: 40, sc: 1 };
      const ctl = kit.controls(box.side, [
        { id: 'diag', label: 'Screen diagonal (320 × 240 pixels)', min: 1.5, max: 10, step: 0.1, value: 2.8, unit: 'in' },
        { id: 'size', label: 'Button size', min: 12, max: 90, step: 1, value: 30, unit: 'px' },
        { id: 'gap', label: 'Gap between buttons', min: 0, max: 30, step: 1, value: 6, unit: 'px' },
        { id: 'sigma', label: 'Scatter of a careful tap', min: 0.5, max: 6, step: 0.1, value: 2.5, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run 1000 taps on OK', primary: true }, { id: 'clear', label: 'Clear the counts' }] }
      ], id => {
        if (id === 'run') { for (let i = 0; i < 1000; i++) tapAt(centre(1).x, centre(1).y, true); verdict = '1000 taps aimed at the centre of OK'; }
        if (id === 'clear') { taps = okN = wrongN = missN = 0; contact = null; verdict = ''; }
      });
      const ro = kit.readout(box.side, [['mm', 'Button on the glass'], ['ppi', 'Pixel pitch'], ['pred', 'Expected (model)'], ['obs', 'Your taps']]);
      const mmPerPx = () => G.pxToMm(1, SW, SH, ctl.values.diag);
      const centre = i => ({ x: SW / 2 + (i - 1) * (ctl.values.size + ctl.values.gap), y: SH / 2 });
      function tapAt(x, y, quiet) {
        const v = ctl.values, s = v.size, sg = v.sigma / mmPerPx();
        let nearest = 0, bd = 1e9;
        for (let i = 0; i < 3; i++) { const d = Math.abs(centre(i).x - x); if (d < bd) { bd = d; nearest = i; } }
        const cx = x + gauss(R) * sg, cy = y + gauss(R) * sg;
        let hit = -1;
        for (let i = 0; i < 3; i++) { const c = centre(i); if (Math.abs(cx - c.x) <= s / 2 && Math.abs(cy - c.y) <= s / 2) hit = i; }
        taps++;
        if (hit === nearest) okN++; else if (hit >= 0) wrongN++; else missN++;
        if (!quiet) { contact = { x: cx, y: cy }; verdict = hit === nearest ? 'hit' : hit >= 0 ? 'the wrong button' : 'missed'; }
      }
      kit.click(st, p => { tapAt((p.x - L.x) / L.sc, (p.y - L.y) / L.sc, false); }, p => p.x >= L.x && p.x <= L.x + SW * L.sc && p.y >= L.y && p.y <= L.y + SH * L.sc);
      function model() {
        const v = ctl.values, s = v.size, sg = v.sigma / mmPerPx(), d = s + v.gap;
        const px = erf(s / 2 / (sg * Math.SQRT2)), side = 0.5 * (erf((d + s / 2) / (sg * Math.SQRT2)) - erf((d - s / 2) / (sg * Math.SQRT2)));
        const ok = px * px, wrong = 2 * side * px;
        return { ok, wrong, miss: Math.max(0, 1 - ok - wrong) };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, mm = mmPerPx(), W = st.W, H = st.H;
        const sc = Math.min((W - 28) / SW, (H - 100) / SH);
        L = { x: Math.round((W - SW * sc) / 2), y: 34, sc };
        const pxmm = sc / mm;
        kit.label(c, 'The panel at its true shape (' + kit.fmt(SW * mm, 3) + ' × ' + kit.fmt(SH * mm, 3) + ' mm). Tap OK.', L.x, 18, { size: 11.5, color: C.muted });
        c.fillStyle = C.surface; c.fillRect(L.x, L.y, SW * sc, SH * sc);
        c.strokeStyle = C.border2; c.lineWidth = 1.5; c.strokeRect(L.x, L.y, SW * sc, SH * sc);
        ['−', 'OK', '+'].forEach((t, i) => {
          const q = centre(i), s = v.size * sc, x = L.x + q.x * sc - s / 2, y = L.y + q.y * sc - s / 2;
          c.fillStyle = i === 1 ? C.accent : C.surface2; c.fillRect(x, y, s, s);
          c.strokeStyle = C.accent; c.lineWidth = 1.5; c.strokeRect(x, y, s, s);
          kit.label(c, t, x + s / 2, y + s / 2, { size: Math.max(9, Math.min(22, s * 0.4)), color: i === 1 ? C.bg : C.text, align: 'center', weight: 650 });
        });
        if (contact) {
          const x = L.x + contact.x * sc, y = L.y + contact.y * sc;
          c.fillStyle = 'rgba(229,72,77,.35)'; c.beginPath(); c.arc(x, y, 4.5 * pxmm, 0, Math.PI * 2); c.fill();
          c.strokeStyle = C.bad; c.lineWidth = 1.5; c.stroke(); kit.dot(c, x, y, 2.5, C.bad);
        }
        // a 10 mm ruler and the verdict
        const ry = L.y + SH * sc + 22;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(L.x, ry); c.lineTo(L.x + 10 * pxmm, ry); c.moveTo(L.x, ry - 5); c.lineTo(L.x, ry + 5); c.moveTo(L.x + 10 * pxmm, ry - 5); c.lineTo(L.x + 10 * pxmm, ry + 5); c.stroke();
        kit.label(c, '10 mm: the width of a fingertip', L.x + 10 * pxmm + 10, ry, { size: 11, color: C.text2 });
        kit.label(c, verdict, L.x + SW * sc, ry, { size: 12, color: verdict === 'hit' ? C.ok : verdict ? C.bad : C.muted, align: 'right', weight: 600 });
        kit.label(c, 'red circle: where a 9 mm fingertip really landed', L.x, ry + 22, { size: 10.5, color: C.faint });
        const m = model(), bmm = v.size * mm;
        ro.set('mm', kit.fmt(bmm, 3) + ' mm' + (bmm < 7 ? '  (under 7: too small)' : bmm > 10 ? '' : '  (in the 7 to 10 range)'));
        ro.set('ppi', kit.fmt(25.4 / mm, 3) + ' pixels per inch');
        ro.set('pred', 'hit ' + kit.fmt(m.ok * 100, 3) + ' %, wrong button ' + kit.fmt(m.wrong * 100, 3) + ' %, miss ' + kit.fmt(m.miss * 100, 3) + ' %');
        ro.set('obs', taps ? 'of ' + taps + ': hit ' + okN + ', wrong ' + wrongN + ', miss ' + missN + '  (' + kit.fmt(okN / taps * 100, 3) + ' % hit)' : 'none yet');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ tg-webui */
  Hyper.sim('tg-webui', {
    title: 'The phone as the display: polling or push',
    blurb: `The ESP serves a page; the phone shows a value that changes at random moments. In **polling** mode the page asks every period; in **push** mode (a WebSocket) the ESP sends each change as it happens. The strip at the bottom shows each change on the top row and the moment the phone showed it on the bottom row. The byte counts assume 500 bytes of HTTP headers and 40 bytes of data per message: assumptions, not measurements.

**Try this**
- With polling at 1 s, watch the delay of each change; lengthen the period and it grows to about half of it, plus the network.
- Switch to **push**: the delay falls to half the round trip, and the traffic follows the changes.
- Raise **Phones watching** and the polling traffic multiplies, push barely moves.
- Slow the Wi-Fi to 400 ms: even push is not instant.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380, maxH: 480 });
      const R = rng(9);
      let t = 0, nextChange = 1, pollNext = 0.5, value = 21, shown = 21;
      const queue = [], msgs = [], pending = [], recent = [], marks = [];
      const ctl = kit.controls(box.side, [
        { id: 'how', type: 'select', label: 'The page gets its data by', options: [['polling', 'poll'], ['a WebSocket (push)', 'push']], value: 'poll' },
        { id: 'T', label: 'Polling period', min: 0.25, max: 5, step: 0.05, value: 1, unit: 's' },
        { id: 'rtt', label: 'Wi-Fi round trip', min: 10, max: 400, step: 5, value: 60, unit: 'ms' },
        { id: 'rate', label: 'Changes of the value', min: 2, max: 60, step: 1, value: 12, unit: 'per minute' },
        { id: 'n', label: 'Phones watching', min: 1, max: 6, step: 1, value: 1 }
      ], (id, v) => { if (id === 'how') ctl.show('T', v === 'poll'); if (id === 'how' && v === 'poll') pollNext = t + ctl.values.T; });
      ctl.show('T', true);
      const ro = kit.readout(box.side, [['delay', 'Delay before a change shows'], ['req', 'Messages a minute'], ['bytes', 'Data a minute']]);
      const fmtV = x => x.toFixed(1) + ' °C';
      function newChange() {
        value = Math.round((18 + 8 * R()) * 10) / 10;
        const ch = { t, v: value, shown: null };
        marks.push(ch); pending.push(ch);
        const half = ctl.values.rtt / 2000;
        if (ctl.values.how === 'push') {
          msgs.push({ from: 'esp', t0: t, dur: half, label: fmtV(value) });
          queue.push({ at: t + half, fn: () => { shown = ch.v; ch.shown = t; recent.push(ch.shown - ch.t); if (recent.length > 12) recent.shift(); const i = pending.indexOf(ch); if (i >= 0) pending.splice(i, 1); } });
        }
      }
      function poll(tp) {
        const half = ctl.values.rtt / 2000;
        msgs.push({ from: 'phone', t0: tp, dur: half, label: 'GET /data' });
        queue.push({ at: tp + half, fn: () => {
          const snap = pending.slice(), v = value;
          msgs.push({ from: 'esp', t0: tp + half, dur: half, label: fmtV(v) });
          queue.push({ at: tp + 2 * half, fn: () => { shown = v; for (const ch of snap) { ch.shown = tp + 2 * half; recent.push(ch.shown - ch.t); const i = pending.indexOf(ch); if (i >= 0) pending.splice(i, 1); } while (recent.length > 12) recent.shift(); } });
        } });
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, pad = 14;
        t += dt;
        let guard = 0;
        while (t >= nextChange && guard++ < 50) { const tc = t; newChange(); nextChange = tc + Math.max(0.3, -Math.log(1 - R() * 0.999) * 60 / v.rate); }
        if (v.how === 'poll') { guard = 0; while (t >= pollNext && guard++ < 50) { poll(pollNext); pollNext += v.T; } }
        queue.sort((a, b) => a.at - b.at);
        while (queue.length && queue[0].at <= t) queue.shift().fn();
        while (msgs.length && msgs[0].t0 + msgs[0].dur < t) msgs.shift();
        while (marks.length > 40) marks.shift();
        // the two ends
        const ex = Math.max(60, W * 0.14), px = W - Math.max(60, W * 0.14), ny = 72;
        S.link(c, ex + 26, ny, px - 26, ny, { wireless: true });
        kit.label(c, 'Wi-Fi, round trip ' + v.rtt + ' ms', (ex + px) / 2, ny - 34, { size: 11, color: C.muted, align: 'center' });
        S.node(c, ex, ny, { kind: 'esp', label: 'ESP32', sub: 'now ' + fmtV(value), r: 22 });
        S.node(c, px, ny, { kind: 'phone', label: 'phone' + (v.n > 1 ? ' × ' + v.n : ''), sub: 'shows ' + fmtV(shown), r: 22 });
        for (const m of msgs) {
          const f = clamp((t - m.t0) / m.dur, 0, 1);
          if (m.from === 'esp') S.msg(c, ex + 26, ny, px - 26, ny, f, { label: m.label, color: C.ok }); else S.msg(c, px - 26, ny, ex + 26, ny, f, { label: m.label, color: C.accent, bend: 14 });
        }
        // the strip: changes above, the moments they were shown below
        const x0 = 112, x1 = W - pad, WINS = 20, X = tt => x0 + (tt - (t - WINS)) / WINS * (x1 - x0), y0 = 168;
        kit.label(c, 'value changes', x0 - 8, y0 + 12, { size: 11, color: C.text2, align: 'right' });
        kit.label(c, 'phone shows it', x0 - 8, y0 + 62, { size: 11, color: C.text2, align: 'right' });
        c.fillStyle = C.surface; c.fillRect(x0, y0, x1 - x0, 24); c.fillRect(x0, y0 + 50, x1 - x0, 24);
        for (const m of marks) {
          const xa = X(m.t), xb = X(m.shown == null ? t : m.shown);
          if (xa < x0) continue;
          c.strokeStyle = m.shown == null ? C.warn : C.faint; c.lineWidth = 1.2; c.beginPath(); c.moveTo(xa, y0 + 24); c.lineTo(Math.min(xb, x1), y0 + 50); c.stroke();
          c.fillStyle = C.accent; c.fillRect(xa - 1.5, y0 + 2, 3, 20);
          if (m.shown != null && xb >= x0) { c.fillStyle = C.ok; c.fillRect(xb - 1.5, y0 + 52, 3, 20); }
        }
        kit.label(c, '20 s ago', x0, y0 - 10, { size: 10, color: C.faint });
        kit.label(c, 'now', x1, y0 - 10, { size: 10, color: C.faint, align: 'right' });
        kit.label(c, 'slanted line: how long an old value stayed on the phone', pad, y0 + 94, { size: 10.5, color: C.faint });
        const avg = recent.length ? recent.reduce((s, q) => s + q, 0) / recent.length : null;
        const perMin = v.how === 'poll' ? 60 / v.T * v.n : v.rate * v.n;
        const bytes = v.how === 'poll' ? perMin * (500 + 40) : perMin * (40 + 2);
        ro.set('delay', avg == null ? 'wait for a change' : kit.fmt(avg * 1000, 3) + ' ms on average');
        ro.set('req', kit.fmt(perMin, 3) + (v.how === 'poll' ? ' (requests, answered each time)' : ' (pushed frames)'));
        ro.set('bytes', kit.fmt(bytes / 1024, 3) + ' KB');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ tg-encoder */
  Hyper.sim('tg-encoder', {
    title: 'Navigating by knob or three buttons',
    blurb: `A settings screen with four widgets in a focus group. Turn the virtual knob (drag it round, or click its left or right half), or use the three-button version: the focus moves from widget to widget. A press **activates** the focused widget; on the slider it enters **edit mode**, where turning changes the value, and a second press leaves it. The log shows the LVGL events.

**Try this**
- Turn right, right: the focus walks down the list. At the end it wraps if **Wrap round** is on.
- Focus the slider and press: the ring turns amber and the knob changes the value now. Press again to leave.
- Press on the switch and on **Mode**: they act at once.
- Choose **Three buttons**: previous, OK and next do the same job.`,
    mount(box, kit) {
      const G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 480, maxH: 700 });
      const W = 320, H = 240;
      const fb = G.fb(W, H, { depth: 16 }), ui = G.ui(fb);
      const MODES = ['Eco', 'Comfort', 'Boost'];
      const ROWS = [{ x: 8, y: 28, w: 304, h: 32, name: 'slider_bright' }, { x: 8, y: 68, w: 304, h: 32, name: 'switch_wifi' }, { x: 8, y: 108, w: 304, h: 36, name: 'btn_mode' }, { x: 8, y: 160, w: 130, h: 48, name: 'btn_save' }];
      let focus = 0, editing = false, bright = 60, wifi = true, mode = 1, savedAt = -9, t = 0, angle = 0, acc = 0, L = fit(st, W, H, 8, 190, 2), knob = { x: 0, y: 0, r: 40 }, keys = [];
      const events = [];
      const log = (text, color) => { events.unshift({ text, color }); if (events.length > 6) events.pop(); };
      const ctl = kit.controls(box.side, [
        { id: 'dev', type: 'select', label: 'Input device', options: [['Encoder: turn and press', 'enc'], ['Three buttons: previous, OK, next', 'keys']], value: 'enc' },
        { id: 'wrap', type: 'check', label: 'Wrap round at the ends', value: true },
        { type: 'buttons', items: [{ id: 'left', label: 'Turn left' }, { id: 'right', label: 'Turn right' }, { id: 'press', label: 'Press', primary: true }] }
      ], id => { if (id === 'left') step(-1); if (id === 'right') step(1); if (id === 'press') press(); });
      const ro = kit.readout(box.side, [['f', 'Focused widget'], ['m', 'Knob now'], ['b', 'Brightness'], ['w', 'Wi-Fi and mode']]);
      function step(dir) {
        const C = kit.colors();
        angle += dir * 30;
        if (editing) { bright = clamp(bright + 5 * dir, 0, 100); log('VALUE_CHANGED  ' + ROWS[0].name + ' = ' + bright, C.accent); return; }
        const n = ROWS.length, old = focus;
        focus = ctl.values.wrap ? (focus + dir + n) % n : clamp(focus + dir, 0, n - 1);
        if (focus !== old) { log('DEFOCUSED     ' + ROWS[old].name, C.muted); log('FOCUSED       ' + ROWS[focus].name, C.ok); }
      }
      function press() {
        const C = kit.colors(), nm = ROWS[focus].name;
        log('PRESSED       ' + nm, C.muted);
        if (focus === 0) { editing = !editing; log(editing ? 'edit mode ON' : 'edit mode OFF', C.warn); }
        else if (focus === 1) { wifi = !wifi; log('VALUE_CHANGED  ' + nm + ' = ' + (wifi ? 'on' : 'off'), C.accent); }
        else if (focus === 2) { mode = (mode + 1) % MODES.length; log('CLICKED       ' + nm + ' → ' + MODES[mode], C.ok); }
        else { savedAt = t; log('CLICKED       ' + nm, C.ok); }
      }
      function render() {
        ui.screen();
        ui.header('Settings');
        txt(fb, 'turn: move · press: select', 316, 5, { align: 'right', color: P.muted });
        txt(fb, 'Brightness', 16, 40, { size: 1 }); ui.slider(120, 38, 160, bright / 100);
        txt(fb, bright + '', 296, 40, { color: P.muted });
        txt(fb, 'Wi-Fi', 16, 80); ui.toggle(120, 78, wifi);
        txt(fb, 'Mode', 16, 123); ui.button(120, 112, 160, 28, MODES[mode], {});
        ui.button(16, 168, 114, 32, 'Save', {});
        if (t - savedAt < 1.2) txt(fb, 'saved', 150, 180, { color: P.ok });
        const r = ROWS[focus], col = editing ? P.warn : P.accent;
        fb.rect(r.x, r.y, r.w, r.h, col); fb.rect(r.x - 1, r.y - 1, r.w + 2, r.h + 2, col); fb.rect(r.x + 1, r.y + 1, r.w - 2, r.h - 2, col);
        if (editing) { txt(fb, '[', 112, 40, { color: P.warn }); txt(fb, ']', 284, 40, { color: P.warn }); }
      }
      kit.drag(st, {
        hit: p => (ctl.values.dev === 'enc' && Math.hypot(p.x - knob.x, p.y - knob.y) <= knob.r * 1.35 ? { a: Math.atan2(p.y - knob.y, p.x - knob.x) } : null),
        start: (th, p) => { th.last = th.a; },
        move: (th, p) => {
          const a = Math.atan2(p.y - knob.y, p.x - knob.x); let d = a - th.last; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
          th.last = a; acc += d * 180 / Math.PI;
          while (acc >= 30) { acc -= 30; step(1); }
          while (acc <= -30) { acc += 30; step(-1); }
        },
        end: (th, p, moved) => {
          if (moved || !p) { acc = 0; return; }
          if (Math.hypot(p.x - knob.x, p.y - knob.y) < knob.r * 0.45) press(); else step(p.x < knob.x ? -1 : 1);
        }
      });
      kit.click(st, p => {
        if (ctl.values.dev !== 'keys') return;
        const k = keys.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h);
        if (k) { if (k.id === 'ok') press(); else step(k.id === 'prev' ? -1 : 1); }
      }, p => ctl.values.dev === 'keys' && keys.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        t += dt;
        render();
        L = fit(st, W, H, 8, 190, 2);
        const r = G.draw(c, fb, L.x, L.y, L.scale, { style: 'tft' });
        const hy = r.y + r.h + 22;
        if (v.dev === 'enc') {
          knob = { x: r.x + 66, y: hy + 70, r: 44 };
          keys = [];
          c.fillStyle = C.surface2; c.beginPath(); c.arc(knob.x, knob.y, knob.r, 0, Math.PI * 2); c.fill();
          c.strokeStyle = C.border2; c.lineWidth = 2; c.stroke();
          for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6 + angle * Math.PI / 180; c.strokeStyle = C.faint; c.lineWidth = 1.5; c.beginPath(); c.moveTo(knob.x + Math.cos(a) * knob.r * 0.82, knob.y + Math.sin(a) * knob.r * 0.82); c.lineTo(knob.x + Math.cos(a) * knob.r * 0.95, knob.y + Math.sin(a) * knob.r * 0.95); c.stroke(); }
          const a = angle * Math.PI / 180 - Math.PI / 2;
          c.strokeStyle = C.accent; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(knob.x, knob.y); c.lineTo(knob.x + Math.cos(a) * knob.r * 0.7, knob.y + Math.sin(a) * knob.r * 0.7); c.stroke(); c.lineCap = 'butt';
          kit.dot(c, knob.x, knob.y, knob.r * 0.28, C.surface, C.border2);
          kit.label(c, 'drag round · click centre = press', knob.x, knob.y + knob.r + 18, { size: 10.5, color: C.faint, align: 'center' });
        } else {
          knob = { x: -999, y: -999, r: 1 };
          const bw = 52, bh = 40, bx = r.x + 8, by = hy + 34;
          keys = [{ id: 'prev', x: bx, y: by, w: bw, h: bh, t: '◀' }, { id: 'ok', x: bx + bw + 10, y: by, w: bw, h: bh, t: 'OK' }, { id: 'next', x: bx + 2 * (bw + 10), y: by, w: bw, h: bh, t: '▶' }];
          for (const k of keys) {
            c.fillStyle = C.surface2; c.fillRect(k.x, k.y, k.w, k.h); c.strokeStyle = C.accent; c.lineWidth = 1.5; c.strokeRect(k.x, k.y, k.w, k.h);
            kit.label(c, k.t, k.x + k.w / 2, k.y + k.h / 2, { size: 15, color: C.text, align: 'center', weight: 650 });
          }
          kit.label(c, 'three buttons: previous, OK, next', bx, by + bh + 18, { size: 10.5, color: C.faint });
        }
        logLines(kit, c, C, r.x + 150, hy + 8, events, { step: 14, size: 10 });
        ro.set('f', ROWS[focus].name);
        ro.set('m', editing ? 'edit mode: turning changes the value' : 'navigate: turning moves the focus');
        ro.set('b', bright + ' of 100');
        ro.set('w', 'Wi-Fi ' + (wifi ? 'on' : 'off') + ', mode ' + MODES[mode]);
      }, box.stage);
      loop.start();
    }
  });

})();
