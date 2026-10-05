/* HYPER-ESP32 · sims/gpio-and-pinouts.js
 *
 * Simulations of the topic "GPIO and pinouts" (topic code gp):
 *
 *   gp-pinout-reader   a real board with its pads coloured by kind or by verdict; hover a pad to read the pin table
 *   gp-label-match     the same board label (D2 …) is a different GPIO on different boards
 *   gp-pull-resistors  a button, a pull resistor and a floating input that picks up noise
 *   gp-five-volt       a 5 V signal into a 3.3 V pin: the clamp current, a series resistor, a divider
 *   gp-pin-load        what a load asks of a pin, against the pin's default drive strength
 *   gp-power-up        the first moments of one pin after power-up, from the pin table, with a wire on it
 *   gp-pin-planner     a small project given to the pin planner and drawn on a real board
 *   gp-adc-wifi        which analogue pins keep working with Wi-Fi on, chip by chip
 *
 * Every number about a chip or a pin comes from the catalogue (kit.esp); the models say where they are schematic.
 */
(function () {
  'use strict';

  const VERDICT_WORD = { yes: 'free to use', caution: 'with care', avoid: 'do not use', none: 'no such pin' };
  const boardPins = (E, b) => (b && b.headers ? b.headers.flatMap(h => h.pins).map(E.parsePin) : []);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const verdictColour = (kit, C, level) => (level === 'yes' ? kit.hue(150) : level === 'caution' ? C.warn : level === 'avoid' ? C.bad : C.faint);

  /* ================================================================ gp-pinout-reader */
  Hyper.sim('gp-pinout-reader', {
    title: 'Reading the pinout of a real board',
    blurb: `Hover over (or tap) a pad: the read-out says what the pin is, what else it can do, what the pin table's verdict is and why, and what it does at power-up. It all comes from the same pin tables as [the pinout explorer](#/tools/pinout).

**Try this**
- On the **ESP32-DevKitC V4**, find the pads labelled **D0 to D3, CMD and CLK**: they look like any other pad and are the flash memory.
- Switch **Colour the pins by** to *the verdict* and count the green pads on the ESP32 board, then on the **XIAO ESP32C3**: only two.
- Hover **VP** and **VN**: the old names of GPIO36 and GPIO39, both input-only.
- On the **ESP32-S3-DevKitC-1**, look at GPIO35, 36 and 37: on the header, yet taken by the octal PSRAM of N8R8 and N16R8 modules.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const BOARDS = [['ESP32-DevKitC V4', 'esp32-devkitc-v4'], ['DOIT ESP32 DevKit V1 (30 pins)', 'doit-esp32-devkit-v1'], ['ESP32-S3-DevKitC-1 v1.1', 'esp32-s3-devkitc-1-v1.1'],
        ['ESP32-C3-DevKitM-1', 'esp32-c3-devkitm-1'], ['XIAO ESP32C3', 'seeed-xiao-esp32c3'], ['ESP32-C6-DevKitC-1', 'esp32-c6-devkitc-1']].filter(b => E.board(b[1]));
      if (!BOARDS.length) return;
      const first = BOARDS.some(b => b[1] === params.board) ? params.board : BOARDS[0][1];
      const st = kit.stage(box.stage, { aspect: 1.02, minH: 420, maxH: 700 });
      let drawn = null, sel = -1, hov = -1;
      const ctl = kit.controls(box.side, [
        { id: 'board', type: 'select', label: 'Board', options: BOARDS, value: first },
        { id: 'colour', type: 'select', label: 'Colour the pins by', options: [['what the pin is', 'kind'], ['the verdict: free, care, avoid', 'verdict']], value: params.colour === 'verdict' ? 'verdict' : 'kind' }
      ], () => { sel = -1; hov = -1; drawn = null; loop.once(); });
      const ro = kit.readout(box.side, [['pin', 'Pad'], ['caps', 'Can do'], ['verdict', 'Verdict'], ['why', 'Because'], ['boot', 'At power-up']]);
      const NONGPIO = { power: 'A power pad: a supply output or input. Never connect it to a GPIO.', gnd: 'Ground: the common return of every signal.', ctrl: 'The reset line (EN): pulled low it restarts the chip.', nc: 'Not connected.' };
      const verdictKind = (chip, p) => {
        if (p.gpio == null) return E.pinKind(chip, p);
        const v = E.pinVerdict(chip, p.gpio).level;
        return v === 'yes' ? 'gpio' : v === 'caution' ? 'strap' : v === 'avoid' ? 'flash' : 'nc';
      };
      const show = () => {
        const i = hov >= 0 ? hov : sel, p = drawn && i >= 0 ? drawn.pins[i] : null, b = E.board(ctl.values.board);
        if (!p || !b) { ro.set('pin', 'hover over a pad'); ro.set('caps', '—'); ro.set('verdict', '—'); ro.set('why', 'Each pad is explained here.'); ro.set('boot', '—'); return; }
        if (p.gpio == null) {
          ro.set('pin', p.label); ro.set('caps', (S.KINDS[p.kind] || { name: '—' }).name); ro.set('verdict', '—'); ro.set('why', NONGPIO[p.kind] || 'Not a GPIO.'); ro.set('boot', '—');
          return;
        }
        const g = E.pin(b.chip, p.gpio), v = E.pinVerdict(b.chip, p.gpio), caps = E.pinCaps(b.chip, p.gpio);
        ro.set('pin', 'GPIO' + p.gpio + (p.label !== String(p.gpio) ? '  (printed ' + p.label + ')' : ''));
        ro.set('caps', caps.length ? caps.join(' · ') : 'plain digital pin');
        ro.set('verdict', VERDICT_WORD[v.level] || '—');
        ro.set('why', v.text);
        ro.set('boot', g ? (g.pull ? 'internal pull-' + g.pull + ' in reset' : 'no pull listed') + (g.glitch ? '; glitch or activity at power-up' : '') : '—');
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), b = E.board(ctl.values.board), mode = ctl.values.colour;
        const wide = st.W >= 680, bw = wide ? Math.round(st.W * 0.58) : st.W;
        const o = { hover: hov >= 0 ? hov : sel };
        if (mode === 'verdict') o.kindOf = p => verdictKind(b.chip, p);
        drawn = S.board(c, b, { x: 2, y: 2, w: bw - 4, h: st.H - 4 }, o);
        if (wide) {                                     // the key
          const counts = {};
          drawn.pins.forEach(p => { counts[p.kind] = (counts[p.kind] || 0) + 1; });
          const kinds = Object.keys(counts).sort((a, z) => counts[z] - counts[a]);
          const x0 = bw + 8;
          kit.label(c, mode === 'verdict' ? 'Verdict (pads of this board)' : 'What the pads are', x0, 16, { size: 12, weight: 650, color: C.text2 });
          kinds.forEach((k, i) => {
            const y = 40 + i * 24, name = mode === 'verdict' ? ({ gpio: 'free to use', strap: 'with care', flash: 'do not use', nc: 'no such pin' }[k] || (S.KINDS[k] || {}).name) : (S.KINDS[k] || { name: k }).name;
            kit.dot(c, x0 + 7, y, 6, S.kindColor(k));
            kit.label(c, name + ' · ' + counts[k], x0 + 20, y, { size: 11.5, color: C.text });
          });
          kit.label(c, 'GPIO numbers are what the program uses;', x0, st.H - 30, { size: 10.5, color: C.muted });
          kit.label(c, 'the printed label is the maker\'s own.', x0, st.H - 16, { size: 10.5, color: C.muted });
        }
        show();
      }, box.stage);
      const hit = p => (drawn ? S.boardHit(drawn, p.x, p.y) : -1);
      st.canvas.addEventListener('pointermove', e => { const i = hit(st.pos(e)); if (i !== hov) { hov = i; loop.once(); } });
      st.canvas.addEventListener('pointerleave', () => { if (hov !== -1) { hov = -1; loop.once(); } });
      kit.click(st, p => { const i = hit(p); sel = i === sel ? -1 : i; loop.once(); }, p => hit(p) >= 0);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ gp-label-match */
  Hyper.sim('gp-label-match', {
    title: 'The same label, a different pin',
    blurb: `Choose a label printed on a board. The table shows which **GPIO** that pad really is on each board, and the verdict of the pin table for it. A program only understands the GPIO number.

**Try this**
- Start with **D2**: on these boards it is GPIO4, 2, 3, 5 and 9, and on the ESP32-DevKitC V4 a flash pin.
- Switch to **D4** and **D5**: the XIAO ESP32C3 and C6 have the same labels in a different order, and the ESP32 DevKit has no D4 at all.
- Read the second number of the read-out: how many different GPIOs hide behind one label.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const ROWS = [['ESP32-DevKitC V4', 'esp32-devkitc-v4'], ['XIAO ESP32C3', 'seeed-xiao-esp32c3'], ['XIAO ESP32C6', 'seeed-xiao-esp32c6'], ['XIAO ESP32S3', 'seeed-xiao-esp32s3'],
        ['Arduino Nano ESP32', 'arduino-nano-esp32'], ['FireBeetle 2 ESP32-E', 'dfrobot-firebeetle-2-esp32-e'], ['NodeMCU V1.0', 'nodemcu-devkit-v1-amica'], ['LOLIN D1 mini', 'lolin-d1-mini']].filter(r => E.board(r[1]));
      const LABELS = []; for (let i = 0; i <= 10; i++) LABELS.push(['D' + i, 'D' + i]);
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 360, maxH: 520 });
      const ctl = kit.controls(box.side, [{ id: 'label', type: 'select', label: 'Label on the board', options: LABELS, value: LABELS.some(l => l[1] === params.label) ? params.label : 'D2' }], () => loop.once());
      const ro = kit.readout(box.side, [['n', 'Different GPIOs for this label'], ['care', 'Boards where the pin is not free to use']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), label = ctl.values.label, W = st.W;
        const top = 34, rowH = clamp((st.H - top - 26) / Math.max(1, ROWS.length), 28, 46);
        kit.label(c, 'The pad labelled ' + label + ' is …', 12, 16, { size: 13, weight: 650 });
        const gpios = []; let care = 0, have = 0;
        ROWS.forEach(([name, id], i) => {
          const b = E.board(id), y = top + i * rowH;
          const p = boardPins(E, b).find(q => q.label === label && q.gpio != null);
          const v = p ? E.pinVerdict(b.chip, p.gpio) : null;
          if (i % 2 === 0) { c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.035)'; c.fillRect(6, y, W - 12, rowH); }
          kit.label(c, name, 14, y + rowH / 2 - 6, { size: 12, weight: 600 });
          kit.label(c, (E.chip(b.chip) || { name: b.chip }).name, 14, y + rowH / 2 + 8, { size: 10.5, color: C.muted });
          const px = clamp(W * 0.42, 140, 280), pw = clamp(W * 0.2, 70, 110);
          if (p) {
            have++; gpios.push(p.gpio); if (v.level !== 'yes') care++;
            const col = verdictColour(kit, C, v.level);
            S.box(c, px, y + 4, pw, rowH - 8, { label: 'GPIO' + p.gpio, color: col, active: true, size: 13 });
            kit.label(c, v.level === 'avoid' ? (E.pin(b.chip, p.gpio) && E.pin(b.chip, p.gpio).flash ? 'flash pin' : 'do not use') : VERDICT_WORD[v.level], px + pw + 10, y + rowH / 2, { size: 11.5, color: col, align: 'left' });
          } else {
            S.box(c, px, y + 4, pw, rowH - 8, { label: 'no ' + label, color: C.faint, dash: true, size: 11.5 });
          }
        });
        kit.label(c, 'The program uses the GPIO number, not the label.', 12, st.H - 12, { size: 11, color: C.muted });
        ro.set('n', new Set(gpios).size + ' on ' + have + ' boards');
        ro.set('care', care + ' of ' + have);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ gp-pull-resistors */
  Hyper.sim('gp-pull-resistors', {
    title: 'Pull-up, pull-down and the floating input',
    blurb: `A pin's voltage is set by whatever is connected to it: a pull resistor, a closed button, and, if nothing else does, the stray fields of the room. The traces show the last 120 ms (slowed down ten times so that the hum can be seen).

**Try this**
- Set **What is wired to it** to *Nothing* and the pull to *None*: the pin floats, wanders through the in-between band and \`digitalRead\` flickers.
- Choose the **internal pull-up** and *A button to ground*: the pin rests high, and pressing the button pulls it low.
- Switch the pin to the **input-only GPIO34** with an internal pull: the request is ignored, as on the real chip, and the pin floats again. Add the external 10 kΩ.
- Compare the current wasted while the button is held: 45 kΩ internal against 10 kΩ external.`,
    mount(box, kit) {
      const S = kit.esym, SC = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 430, maxH: 580 });
      const ctl = kit.controls(box.side, [
        { id: 'pin', type: 'select', label: 'Pin', options: [['Ordinary pin (GPIO4)', 'plain'], ['Input-only pin (GPIO34)', 'inonly']], value: 'plain' },
        { id: 'wiring', type: 'select', label: 'What is wired to it', options: [['A button to ground', 'gnd'], ['A button to 3.3 V', 'vcc'], ['Nothing', 'none']], value: 'gnd' },
        { id: 'pull', type: 'select', label: 'Pull resistor', options: [['None', 'none'], ['Internal pull-up (about 45 kΩ)', 'int-up'], ['Internal pull-down (about 45 kΩ)', 'int-down'], ['External pull-up 10 kΩ', 'ext-up'], ['External pull-down 10 kΩ', 'ext-down']], value: 'int-up' },
        { id: 'pressed', type: 'check', label: 'Button pressed', value: false },
        { id: 'noise', type: 'check', label: 'A finger or a long wire nearby (picks up hum)', value: true }
      ], () => {});
      const ro = kit.readout(box.side, [['v', 'Voltage at the pin'], ['read', 'digitalRead returns'], ['i', 'Current through the pull while pressed'], ['note', 'Note']]);
      const VCC = 3.3, VIL = 0.25 * VCC, VIH = 0.75 * VCC, SLOW = 0.1, WIN = 0.12;
      const hum = t => 1.65 + 1.15 * Math.sin(2 * Math.PI * 50 * t + 0.6) + 0.45 * Math.sin(2 * Math.PI * 7.3 * t) + 0.2 * Math.sin(2 * Math.PI * 190 * t);
      const wander = t => 1.65 + 0.9 * Math.sin(2 * Math.PI * 0.35 * t) + 0.4 * Math.sin(2 * Math.PI * 0.11 * t + 1);
      // the effective set-up: an internal pull on an input-only pin does not exist
      function setup() {
        const v = ctl.values;
        let pull = v.pull, ignored = false;
        if (v.pin === 'inonly' && pull.indexOf('int-') === 0) { pull = 'none'; ignored = true; }
        return { pull, ignored, pressed: v.pressed && v.wiring !== 'none', wiring: v.wiring, noise: v.noise };
      }
      // the node voltage at simulated time t: resistors and switch as conductances, plus a tiny coupling to the room
      function volts(su, t) {
        let g = 0, gv = 0;
        const add = (R, V) => { g += 1 / R; gv += V / R; };
        if (su.pull === 'int-up') add(45e3, VCC); else if (su.pull === 'int-down') add(45e3, 0);
        else if (su.pull === 'ext-up') add(10e3, VCC); else if (su.pull === 'ext-down') add(10e3, 0);
        if (su.pressed) add(1, su.wiring === 'gnd' ? 0 : VCC);
        const gn = su.noise ? 2e-7 : 2e-9, vn = su.noise ? hum(t) : wander(t);
        return clamp((gv + gn * vn) / (g + gn), 0, VCC);
      }
      const level = v => (v < VIL ? 0 : v > VIH ? 1 : -1);
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), su = setup(), W = st.W, H = st.H, tau = t * SLOW;
        const nowV = volts(su, tau), lv = level(nowV);
        const col = lv === 1 ? kit.hue(150) : lv === 0 ? kit.hue(212) : C.warn;
        // the circuit
        const railY = H * 0.1, nodeY = H * 0.29, gndY = H * 0.47, xa = W * 0.1, xb = W * 0.22, xc = W * 0.34, bx = W * 0.5, bw = W - bx - 8;
        SC.wire(c, [[xa, nodeY], [bx, nodeY]], { color: C.text });
        kit.label(c, 'outside the chip', xa, H * 0.015 + 4, { size: 10.5, color: C.muted, align: 'left' });
        if (su.pull === 'ext-up') { SC.rail(c, xa, railY, '3.3 V'); SC.resistor(c, xa, railY, xa, nodeY, { label: '10 kΩ' }); SC.node(c, xa, nodeY); }
        if (su.pull === 'ext-down') { SC.resistor(c, xb, nodeY, xb, gndY, { label: '10 kΩ' }); SC.ground(c, xb, gndY); SC.node(c, xb, nodeY); }
        if (su.wiring === 'gnd') { SC.switch(c, xc, nodeY, xc, gndY, { closed: su.pressed }); SC.ground(c, xc, gndY); SC.node(c, xc, nodeY); }
        else if (su.wiring === 'vcc') { SC.rail(c, xc, railY, '3.3 V'); SC.switch(c, xc, railY, xc, nodeY, { closed: su.pressed }); SC.node(c, xc, nodeY); }
        // the chip, with its two internal resistors
        S.box(c, bx, railY - 10, bw, gndY - railY + 34, { label: null, color: C.muted });
        kit.label(c, (ctl.values.pin === 'inonly' ? 'GPIO34 (input-only)' : 'GPIO4'), bx + 8, H * 0.015 + 4, { size: 10.5, color: C.muted, align: 'left' });
        const xi1 = bx + bw * 0.38, xi2 = bx + bw * 0.72, hasInt = ctl.values.pin === 'plain';
        const upOn = su.pull === 'int-up', dnOn = su.pull === 'int-down';
        if (hasInt) {
          SC.rail(c, xi1, railY, '3.3 V', { color: upOn ? C.text : C.faint }); SC.resistor(c, xi1, railY, xi1, nodeY, { label: '45 kΩ', color: upOn ? C.text : C.faint });
          SC.resistor(c, xi2, nodeY, xi2, gndY, { label: '45 kΩ', color: dnOn ? C.text : C.faint }); SC.ground(c, xi2, gndY, { color: dnOn ? C.text : C.faint });
          SC.node(c, xi1, nodeY, { color: upOn ? C.text : C.faint }); SC.node(c, xi2, nodeY, { color: dnOn ? C.text : C.faint });
          kit.label(c, upOn ? 'on' : 'off', xi1 + 8, railY + 24, { size: 10, color: upOn ? C.text : C.muted, align: 'left' });
          kit.label(c, dnOn ? 'on' : 'off', xi2 + 8, gndY - 18, { size: 10, color: dnOn ? C.text : C.muted, align: 'left' });
        } else kit.label(c, 'no internal pull resistors', bx + bw / 2, (railY + gndY) / 2, { size: 11.5, color: C.faint, align: 'center' });
        kit.label(c, nowV.toFixed(2) + ' V', bx + 8, nodeY + 18, { size: 12, weight: 700, color: col, align: 'left' });
        // the traces
        const px = 86, pw = W - px - 12, py = H * 0.6, ph = H * 0.2, t1 = tau, t0 = tau - WIN, Y = v => py + ph - clamp(v / VCC, 0, 1) * ph;
        c.fillStyle = C.dark ? 'rgba(34,179,122,.16)' : 'rgba(34,179,122,.14)'; c.fillRect(px, Y(VCC), pw, Y(VIH) - Y(VCC));
        c.fillStyle = C.dark ? 'rgba(90,130,255,.16)' : 'rgba(60,90,220,.12)'; c.fillRect(px, Y(VIL), pw, Y(0) - Y(VIL));
        c.fillStyle = C.dark ? 'rgba(224,160,48,.10)' : 'rgba(224,160,48,.12)'; c.fillRect(px, Y(VIH), pw, Y(VIL) - Y(VIH));
        kit.label(c, 'reads HIGH', px + 4, Y(VCC) + 8, { size: 9.5, color: C.muted, align: 'left' });
        kit.label(c, 'in between', px + 4, Y(VIH) + 9, { size: 9.5, color: C.muted, align: 'left' });
        kit.label(c, 'reads LOW', px + 4, Y(0) - 8, { size: 9.5, color: C.muted, align: 'left' });
        S.analog(c, px, py, pw, ph, tt => volts(su, tt), { t0, t1, min: 0, max: VCC, color: col, label: 'pin V', steps: 360 });
        kit.label(c, '3.3 V', px - 6, py + 2, { size: 9.5, color: C.faint, align: 'right' });
        kit.label(c, '0 V', px - 6, py + ph - 2, { size: 9.5, color: C.faint, align: 'right' });
        const edges = []; let last = null;
        for (let k = 0; k <= 360; k++) {
          const tt = t0 + WIN * k / 360, v = volts(su, tt), l = level(v) === -1 ? (v > 0.5 * VCC ? 1 : 0) : level(v);
          if (l !== last) { edges.push([tt, l]); last = l; }
        }
        const dy = py + ph + 26, dh = H * 0.1;
        S.wave(c, px, dy, pw, dh, edges, { t0, t1, label: 'digitalRead', fill: true, color: C.text2 });
        kit.label(c, '120 ms, slowed down 10 ×', px + pw, dy + dh + 12, { size: 10, color: C.faint, align: 'right' });
        // the numbers
        ro.set('v', nowV.toFixed(2) + ' V');
        ro.set('read', lv === 1 ? 'HIGH' : lv === 0 ? 'LOW' : 'in between: it flickers');
        let i = 0;
        if (su.pressed) {
          const R = su.pull === 'int-up' || su.pull === 'int-down' ? 45e3 : su.pull !== 'none' ? 10e3 : 0;
          if (R && ((su.pull.indexOf('up') >= 0 && su.wiring === 'gnd') || (su.pull.indexOf('down') >= 0 && su.wiring === 'vcc'))) i = VCC / R;
        }
        ro.set('i', su.pressed ? (i ? kit.fmt(i * 1e6, 3) + ' µA' : 'none') : 'the button is open');
        ro.set('note', su.ignored ? 'This pin has no internal resistors: the pull-up or pull-down request is ignored.' : su.pull === 'none' && !su.pressed ? 'Nothing defines the level: the pin floats.' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ gp-five-volt */
  Hyper.sim('gp-five-volt', {
    title: '5 V into a 3.3 V pin',
    blurb: `A pin has a protection diode to the 3.3 V rail. Above about 3.9 V (the rail plus a diode drop) it conducts and holds the pin there; the current is whatever the rest of the circuit lets through. The model is **schematic**: a 50 Ω source and a 0.6 V diode drop, and a clamp current of 5 mA or more is called "heavy" by the simulation's own choice, not by a datasheet. The real structure is not specified for a continuous current.

**Try this**
- 5 V straight to the pin: the pin is held near 3.9 V and the clamp carries tens of milliamps.
- Add a **series resistor** and increase it: the current falls, but the pin still sits at 3.9 V, above its 3.6 V rating. A rescue, not a design.
- Choose the **divider**: about 3.2 V and no clamp current. Now lower the signal to 3.3 V: the divider gives only 2.1 V, which may not read as high. A divider fits one level.
- A **level shifter** puts exactly 3.3 V on the pin whatever the input.`,
    mount(box, kit) {
      const S = kit.esym, SC = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.88, minH: 400, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'sig', label: 'Signal high level', min: 3, max: 6, step: 0.1, value: 5, unit: 'V' },
        { id: 'fix', type: 'select', label: 'Between the signal and the pin', options: [['Nothing: straight to the pin', 'none'], ['A series resistor', 'series'], ['A voltage divider, 1.8 kΩ over 3.3 kΩ', 'divider'], ['A level shifter chip', 'shifter']], value: 'none' },
        { id: 'R', label: 'Series resistor', min: 100, max: 100000, value: 1000, unit: 'Ω', log: true, sig: 2 }
      ], (id, v, all) => { ctl.show('R', all.fix === 'series'); });
      ctl.show('R', false);
      const ro = kit.readout(box.side, [['vp', 'Voltage at the pin'], ['ic', 'Current into the clamp diode'], ['verdict', 'Verdict']]);
      const VCC = 3.3, VD = 0.6, RS = 50, R1 = 1800, R2 = 3300, LIMIT = 3.6, VIH = 0.75 * VCC, HEAVY = 5;   // HEAVY (mA): the simulation's own line
      function solve() {
        const vs = ctl.values.sig, fix = ctl.values.fix, R = ctl.values.R;
        let vth, rth;
        if (fix === 'series') { vth = vs; rth = RS + R; }
        else if (fix === 'divider') { vth = vs * R2 / (RS + R1 + R2); rth = (R2 * (RS + R1)) / (R2 + RS + R1); }
        else if (fix === 'shifter') return { v: VCC, i: 0 };
        else { vth = vs; rth = RS; }
        const vcl = VCC + VD;
        return { v: Math.min(vth, vcl), i: vth > vcl ? (vth - vcl) / rth : 0 };
      }
      let phase = 0;
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, r = solve(), fix = ctl.values.fix;
        phase += dt * 60 * Math.min(1, 0.15 + r.i * 40);
        const railY = H * 0.1, nodeY = H * 0.28, gndY = H * 0.46;
        const bx = W * 0.6, bw = W - bx - 8, xn = bx + bw * 0.3, xg = bx + bw * 0.7;
        // the source and what stands between it and the pin
        S.box(c, 10, nodeY - 22, 92, 44, { label: ctl.values.sig.toFixed(1) + ' V', sub: 'logic output', color: kit.hue(30), size: 13 });
        const sx = 102, ex = bx, mx = sx + (ex - sx) * 0.5;
        if (fix === 'none') SC.wire(c, [[sx, nodeY], [ex, nodeY]], { color: C.text });
        else if (fix === 'series') {
          SC.wire(c, [[sx, nodeY], [sx + 14, nodeY]], { color: C.text });
          SC.resistor(c, sx + 14, nodeY, mx + 40, nodeY, { label: kit.eng(ctl.values.R, 'Ω') });
          SC.wire(c, [[mx + 40, nodeY], [ex, nodeY]], { color: C.text });
        } else if (fix === 'divider') {
          SC.wire(c, [[sx, nodeY], [sx + 14, nodeY]], { color: C.text });
          SC.resistor(c, sx + 14, nodeY, mx + 20, nodeY, { label: '1.8 kΩ' });
          SC.wire(c, [[mx + 20, nodeY], [ex, nodeY]], { color: C.text });
          SC.node(c, mx + 20, nodeY); SC.resistor(c, mx + 20, nodeY, mx + 20, gndY, { label: '3.3 kΩ' }); SC.ground(c, mx + 20, gndY);
        } else {
          SC.wire(c, [[sx, nodeY], [sx + 14, nodeY]], { color: C.text });
          S.box(c, sx + 14, nodeY - 20, (ex - sx) - 28, 40, { label: 'level shifter', color: kit.hue(200), active: true, size: 12 });
          SC.wire(c, [[ex - 14, nodeY], [ex, nodeY]], { color: C.text });
        }
        // the chip, its rail and the two protection diodes
        S.box(c, bx, railY - 10, bw, gndY - railY + 34, { label: null, color: C.muted });
        kit.label(c, 'ESP32 pin', bx + 8, H * 0.015 + 4, { size: 10.5, color: C.muted, align: 'left' });
        SC.rail(c, xn, railY, '3.3 V rail'); SC.diode(c, xn, nodeY, xn, railY, { label: 'clamp', color: r.i > 0 ? C.bad : C.text });
        SC.diode(c, xg, gndY, xg, nodeY, { color: C.text }); SC.ground(c, xg, gndY);
        SC.node(c, xn, nodeY); SC.node(c, xg, nodeY);
        if (r.i > 0) S.flow(c, [[sx, nodeY], [xn, nodeY], [xn, railY]], phase, { color: C.bad, r: 3 });
        kit.label(c, r.v.toFixed(2) + ' V', bx + 8, nodeY + 18, { size: 12, weight: 700, color: r.v > LIMIT ? C.bad : kit.hue(150), align: 'left' });
        // the traces: the signal and what the pin sees
        const px = 44, pw = W - px - 12, py = H * 0.62, ph = H * 0.26, MAXV = 6.5, Y = v => py + ph - clamp(v / MAXV, 0, 1) * ph;
        const sq = lvl => tt => ((tt % 1) < 0.5 ? lvl : 0);
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 4]);
        for (const v of [VCC, LIMIT]) { c.beginPath(); c.moveTo(px, Y(v)); c.lineTo(px + pw, Y(v)); c.stroke(); }
        c.restore();
        kit.label(c, '3.3 V', px - 4, Y(VCC) + 7, { size: 9.5, color: C.faint, align: 'right' });
        kit.label(c, '3.6 V limit', px + pw, Y(LIMIT) - 6, { size: 9.5, color: C.faint, align: 'right' });
        S.analog(c, px, py, pw, ph, sq(ctl.values.sig), { t0: 0, t1: 2, min: 0, max: MAXV, color: kit.hue(30), steps: 400 });
        S.analog(c, px, py, pw, ph, sq(r.v), { t0: 0, t1: 2, min: 0, max: MAXV, color: r.v > LIMIT ? C.bad : kit.hue(150), width: 2.4, steps: 400 });
        kit.label(c, 'orange: signal · green or red: at the pin', px, py + ph + 14, { size: 10.5, color: C.muted, align: 'left' });
        // the numbers
        ro.set('vp', r.v.toFixed(2) + ' V');
        ro.set('ic', r.i > 0 ? kit.fmt(r.i * 1000, 3) + ' mA' : 'none');
        let verdict;
        if (r.v > LIMIT && r.i * 1000 >= HEAVY) verdict = 'The clamp carries heavy current: the pin and the 3.3 V rail are in danger.';
        else if (r.v > LIMIT) verdict = 'Above the 3.6 V rating: it may work on the bench, but it is a rescue, not a design.';
        else if (r.v < VIH && ctl.values.sig > VCC * 0.9) verdict = 'Within the rating, but below the high threshold: the pin may not read it as high.';
        else verdict = 'Within the rating, and read as high.';
        ro.set('verdict', verdict);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ gp-pin-load */
  Hyper.sim('gp-pin-load', {
    title: 'What a load asks of a pin',
    blurb: `Each load needs a current, from Ohm's law at 3.3 V; each pin is built to give a certain **default drive strength**. The scale is logarithmic: every tick is ten times the last. For the ESP32-C3 and C6 the drive strengths come from the catalogue; for the original ESP32 and the S3 the datasheet figure is not in our tables, so the zones follow the rule of thumb of the page: a few milliamps comfortable, a few tens at most.

**Try this**
- Take the **LED with 330 Ω**: a few milliamps, comfortable on any pin.
- Move to the **LED with 47 Ω**, then the **LED with no resistor**: past the drive strength, and a pin or an LED gives way.
- Pick the **relay coil** and the **motor**: far beyond any pin. Then pick the **MOSFET gate**: the pin only charges a gate.
- Compare **GPIO3** of the C3 (10 mA) with its **USB pin GPIO18** (40 mA).`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym, SC = kit.schem;
      // the default drive strength of a pin, read from the catalogue's notes and rules (null: not in the catalogue)
      function driveOf(chip, n) {
        const P = E.PINS[chip], g = E.pin(chip, n);
        if (!P) return null;
        let m = g && /(\d+) mA (?:default )?drive/.exec(g.note || '');
        if (m) return +m[1];
        for (const r of P.rules || []) { m = /(\d+) mA on all other pins/.exec(r); if (m) return +m[1]; }
        return null;
      }
      const PINS = [['ESP32-C3 · GPIO3', ['esp32-c3', 3]], ['ESP32-C3 · GPIO10', ['esp32-c3', 10]], ['ESP32-C3 · GPIO18 (a USB pin)', ['esp32-c3', 18]], ['ESP32-C6 · GPIO2', ['esp32-c6', 2]], ['ESP32-C6 · GPIO12 (a USB pin)', ['esp32-c6', 12]], ['ESP32 or ESP32-S3 (no figure in the catalogue)', ['esp32', 4]]];
      const VF = 2.0, VCC = 3.3;
      const led = R => ({ kind: 'led', R, mA: (VCC - VF) / R * 1000, label: 'LED, ' + (R >= 1000 ? R / 1000 + ' kΩ' : R + ' Ω') });
      const LOADS = [['LED with 1 kΩ', led(1000)], ['LED with 330 Ω', led(330)], ['LED with 100 Ω', led(100)], ['LED with 47 Ω', led(47)],
        ['LED with no resistor', { kind: 'led', R: 0, mA: 1000, label: 'LED, no resistor', open: true }],
        ['Small 5 V relay coil (about 70 mA)', { kind: 'box', mA: 70, label: 'relay coil', sub: 'about 70 mA' }],
        ['Small DC motor (hundreds of mA)', { kind: 'box', mA: 300, label: 'DC motor', sub: 'a few hundred mA' }],
        ['MOSFET gate, switching a 12 V fan', { kind: 'box', mA: 0.01, label: 'MOSFET gate', sub: 'the fan runs from 12 V', gate: true }]];
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 360, maxH: 480 });
      const ctl = kit.controls(box.side, [
        { id: 'pin', type: 'select', label: 'Chip and pin', options: PINS, value: PINS[1][1] },
        { id: 'load', type: 'select', label: 'Load on the pin', options: LOADS, value: LOADS[1][1] }
      ], () => {});
      const ro = kit.readout(box.side, [['i', 'Current the load asks of the pin'], ['drive', 'Default drive strength of the pin'], ['verdict', 'Verdict']]);
      let phase = 0;
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, L = ctl.values.load, [chip, n] = ctl.values.pin;
        const drive = driveOf(chip, n), I = L.mA;
        const green = drive ? drive * 0.5 : 5, amber = drive || 20;
        const level = I <= green ? 'ok' : I <= amber ? 'warn' : 'bad';
        const col = level === 'ok' ? kit.hue(150) : level === 'warn' ? C.warn : C.bad;
        phase += dt * (20 + 12 * Math.log10(Math.max(I, 0.01) / 0.01));
        // the circuit: pin -> load -> ground
        const y = H * 0.2, x0 = 14, pw = Math.min(120, W * 0.24);
        S.box(c, x0, y - 24, pw, 48, { label: (E.chip(chip) || { name: chip }).name, sub: 'GPIO' + n, color: kit.hue(8) });
        const lx = x0 + pw + 40, ex = W - 50;
        SC.wire(c, [[x0 + pw, y], [lx, y]], { color: C.text });
        if (L.kind === 'led') {
          const rx = lx + (ex - lx) * 0.55;
          if (L.R > 0) { SC.resistor(c, lx, y, rx, y, { label: L.R >= 1000 ? L.R / 1000 + ' kΩ' : L.R + ' Ω' }); SC.wire(c, [[rx, y], [rx + 18, y]], { color: C.text }); S.led(c, rx + 32, y, { color: 4, on: clamp(I / 15, 0.05, 1), r: 11 }); SC.wire(c, [[rx + 46, y], [ex, y], [ex, y + 30]], { color: C.text }); }
          else { SC.wire(c, [[lx, y], [lx + 20, y]], { color: C.text }); S.led(c, lx + 34, y, { color: 4, on: 1, r: 11 }); SC.wire(c, [[lx + 48, y], [ex, y], [ex, y + 30]], { color: C.text }); }
        } else {
          S.box(c, lx, y - 22, (ex - lx) - 10, 44, { label: L.label, sub: L.sub, color: kit.hue(210), size: 12 });
          SC.wire(c, [[ex - 10, y], [ex, y], [ex, y + 30]], { color: C.text });
        }
        SC.ground(c, ex, y + 30);
        if (!L.gate) S.flow(c, [[x0 + pw, y], [ex, y], [ex, y + 30]], phase, { color: col, r: 2.6, gap: clamp(30 - 6 * Math.log10(Math.max(I, 0.01) / 0.01), 8, 30) });
        // the logarithmic scale
        const gx = 24, gw = W - 48, gy = H * 0.58, gh = 26, lo = 0.01, hi = 1000, X = v => gx + (Math.log10(clamp(v, lo, hi)) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo)) * gw;
        const zone = (a, b, fill) => { c.fillStyle = fill; c.fillRect(X(a), gy, Math.max(0, X(b) - X(a)), gh); };
        zone(lo, green, C.dark ? 'rgba(34,179,122,.35)' : 'rgba(34,179,122,.30)');
        zone(green, amber, C.dark ? 'rgba(224,160,48,.40)' : 'rgba(224,160,48,.34)');
        zone(amber, hi, C.dark ? 'rgba(229,72,77,.38)' : 'rgba(229,72,77,.28)');
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
        for (const v of [0.01, 0.1, 1, 10, 100, 1000]) { c.beginPath(); c.moveTo(X(v), gy + gh); c.lineTo(X(v), gy + gh + 5); c.stroke(); kit.label(c, v + ' mA', X(v), gy + gh + 16, { size: 10, color: C.muted, align: 'center' }); }
        kit.label(c, 'current, logarithmic scale', gx, gy - 14, { size: 10.5, color: C.muted, align: 'left' });
        kit.label(c, drive ? 'default drive strength ' + drive + ' mA' : 'tens of mA at most: check the datasheet', clamp(X(amber), 130, W - 130), gy + gh + 36, { size: 11, color: C.text2, align: 'center' });
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X(amber), gy - 4); c.lineTo(X(amber), gy + gh + 4); c.stroke();
        // the load
        const mx = X(I);
        c.fillStyle = col; c.beginPath(); c.moveTo(mx, gy - 2); c.lineTo(mx - 7, gy - 14); c.lineTo(mx + 7, gy - 14); c.closePath(); c.fill();
        kit.label(c, L.open ? 'unlimited' : L.gate ? 'almost nothing' : kit.fmt(I, 3) + ' mA', clamp(mx, 60, W - 60), gy - 24, { size: 11.5, weight: 650, color: col, align: 'center' });
        // the numbers
        ro.set('i', L.open ? 'only the LED and the pin limit it' : L.gate ? 'a gate charge, then almost nothing (the fan current flows through the MOSFET)' : kit.fmt(I, 3) + ' mA');
        ro.set('drive', drive ? drive + ' mA (the default setting)' : 'not in the catalogue: check the datasheet');
        ro.set('verdict', L.gate ? 'Right: the pin drives a signal, the transistor drives the load.' : level === 'ok' ? 'Comfortable: a signal-level load.' : level === 'warn' ? 'At or near the pin\'s limit: it is the whole budget of this pin, and the chip has a total limit too.' : 'Too much for a pin: switch it with a transistor or MOSFET.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ gp-power-up */
  Hyper.sim('gp-power-up', {
    title: 'The first moments of a pin',
    blurb: `Choose a chip and a pin. The picture follows it from power-up to your first line of code: the supply rises, the chip is held in reset, the ROM boots (strapping pins are read, the console pin prints its log), the bootloader runs, and only then does \`setup()\` take over. The reset pull, the glitches and the activity come from the pin table. **The time axis is schematic**: a 60 µs glitch would be far thinner than a pixel.

**Try this**
- ESP32, **GPIO12** with *Nothing attached*: it rests low in reset, thanks to its pull-down. Attach *10 kΩ to 3.3 V*: it is high, the strapping check fails.
- ESP32, **GPIO1**: the ROM prints its boot log there. Try **GPIO5** and **GPIO14** for the reported PWM-like activity.
- ESP32-S3, **GPIO18**: glitches in both directions. ESP32-C3, **GPIO18**: a high glitch.
- Put the **LED with 330 Ω** on a pin with an internal pull-up: the pull cannot hold it high.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const CHIPS = [['ESP32', 'esp32'], ['ESP32-S3', 'esp32-s3'], ['ESP32-C3', 'esp32-c3'], ['ESP32-C6', 'esp32-c6']].filter(c => E.PINS[c[1]]);
      const FIRST = { 'esp32': 12, 'esp32-s3': 18, 'esp32-c3': 2, 'esp32-c6': 9 };
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 400, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: CHIPS, value: CHIPS[0][1] },
        { id: 'pin', label: 'GPIO number', min: 0, max: 48, step: 1, value: FIRST[CHIPS[0][1]], unit: '' },
        { id: 'wire', type: 'select', label: 'What is wired to the pin', options: [['Nothing', 'none'], ['10 kΩ to ground', 'gnd10k'], ['10 kΩ to 3.3 V', 'vcc10k'], ['1 kΩ to 3.3 V', 'vcc1k'], ['An LED with 330 Ω to ground', 'led']], value: 'none' }
      ], (id, v) => { if (id === 'chip') ctl.set('pin', FIRST[v]); });
      const ro = kit.readout(box.side, [['pin', 'The pin'], ['rest', 'Resting level in reset'], ['phase', 'Now'], ['strap', 'Strapping check'], ['extra', 'Power-up activity']]);
      const VCC = 3.3, RPULL = 45e3;
      // the voltage the pin rests at in reset: the internal pull and the outside wire as one network
      function rest(g, wire) {
        let gs = 0, gv = 0;
        const add = (R, V) => { gs += 1 / R; gv += V / R; };
        if (g.pull === 'up') add(RPULL, VCC); else if (g.pull === 'down') add(RPULL, 0);
        if (wire === 'gnd10k') add(1e4, 0); else if (wire === 'vcc10k') add(1e4, VCC); else if (wire === 'vcc1k') add(1e3, VCC);
        if (wire === 'led') {
          if (gs === 0 || gv === 0) return gs === 0 ? { v: null } : { v: 0 };
          const vled = I => (I < 1e-9 ? 0 : Math.max(0, 1.85 + 0.12 * Math.log10(I / 1e-3)));   // schematic red LED
          let a = 0, b = gv;
          for (let k = 0; k < 50; k++) { const I = (a + b) / 2; if ((gv - I) / gs > vled(I) + I * 330) a = I; else b = I; }
          const I = (a + b) / 2;
          return { v: vled(I) + I * 330, i: I };
        }
        return gs === 0 ? { v: null } : { v: gv / gs };
      }
      const lvl = v => (v == null ? 'floating' : v < 0.25 * VCC ? 'low' : v > 0.75 * VCC ? 'high' : 'in between');
      // what the table says about activity at power-up
      function activity(chip, g) {
        const n = g.n, note = g.note || '';
        if (chip === 'esp32-s3' && n >= 1 && n <= 20 && g.glitch) return { kind: 'spike', text: 'a 60 µs low-level glitch at power-up' + (n >= 18 ? ' and a 60 µs high-level one' : ''), both: n >= 18 };
        if (chip === 'esp32-c3' && [6, 7, 10, 20].includes(n)) return { kind: 'spike', text: 'a 5 ns low-level glitch at power-up (far too short to draw)' };
        if (chip === 'esp32-c3' && n === 18) return { kind: 'spike', text: 'a 50 µs high-level glitch at power-up', high: true };
        if (g.uart0 === 'TX') return { kind: 'serial', text: 'the ROM boot log (serial data) while it boots' };
        if (/PWM/.test(note)) return { kind: 'pwm', text: 'a PWM-like signal during boot (a community report, flagged in the pin table)' };
        if (g.glitch) return { kind: 'generic', text: 'a glitch or activity is listed in the pin table' };
        return { kind: 'none', text: 'none listed' };
      }
      const PH = [[0, 0.12, 'The supply rises. The chip is not awake: only your circuit acts on the pin.'], [0.12, 0.3, 'Reset. The pin takes its reset state (internal pull, if it has one).'], [0.3, 0.62, 'ROM boot. Strapping pins are read, and the console TX pin prints the boot log.'], [0.62, 0.82, 'The bootloader loads the program.'], [0.82, 1, 'setup() runs: pinMode() takes the pin over.']];
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, chip = ctl.values.chip, n = Math.round(ctl.values.pin), g = E.pin(chip, n);
        const px = 46, pw = W - px - 14, cur = ((t % 8) / 8);
        kit.label(c, (CHIPS.find(x => x[1] === chip) || ['', chip])[0] + ' · GPIO' + n, 12, 14, { size: 13, weight: 650 });
        // the phases as a band
        const by = 30, bh = 22;
        PH.forEach(([a, b, txt], i) => {
          const on = cur >= a && cur < b;
          c.fillStyle = on ? (C.dark ? 'rgba(123,140,255,.30)' : 'rgba(60,90,220,.18)') : (C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)');
          c.fillRect(px + a * pw, by, (b - a) * pw - 1, bh);
          kit.label(c, ['supply', 'reset', 'ROM boot', 'bootloader', 'setup()'][i], px + (a + b) / 2 * pw, by + bh / 2, { size: 10.5, color: on ? C.text : C.muted, weight: on ? 650 : 500, align: 'center' });
        });
        if (!g) {
          kit.label(c, 'This chip has no GPIO' + n + '.', W / 2, H / 2, { size: 14, color: C.faint, align: 'center' });
          ro.set('pin', 'GPIO' + n + ' does not exist'); ro.set('rest', '—'); ro.set('phase', '—'); ro.set('strap', '—'); ro.set('extra', '—');
          return;
        }
        const r = rest(g, ctl.values.wire), v = r.v, act = activity(chip, g);
        // the supply and the reset line
        const ry = by + bh + 22, rh = 26;
        S.analog(c, px, ry, pw, rh, tt => (tt < 0.12 ? VCC * tt / 0.12 : VCC), { t0: 0, t1: 1, min: 0, max: 3.6, color: C.faint, label: '3.3 V', steps: 120 });
        S.wave(c, px, ry + rh + 14, pw, 18, [[0, 0], [0.3, 1]], { t0: 0, t1: 1, label: 'EN', color: C.faint });
        // the pin
        const py = ry + rh + 78, ph = H * 0.3, Y = vv => py + ph - clamp(vv / 3.6, 0, 1) * ph, X = f => px + f * pw;
        c.fillStyle = C.dark ? 'rgba(34,179,122,.13)' : 'rgba(34,179,122,.12)'; c.fillRect(px, Y(VCC), pw, Y(0.75 * VCC) - Y(VCC));
        c.fillStyle = C.dark ? 'rgba(90,130,255,.13)' : 'rgba(60,90,220,.10)'; c.fillRect(px, Y(0.25 * VCC), pw, Y(0) - Y(0.25 * VCC));
        kit.label(c, 'high', px + pw - 4, Y(VCC) + 8, { size: 9.5, color: C.muted, align: 'right' });
        kit.label(c, 'low', px + pw - 4, Y(0) - 8, { size: 9.5, color: C.muted, align: 'right' });
        const col = lvl(v) === 'high' ? kit.hue(150) : lvl(v) === 'low' ? kit.hue(212) : C.warn;
        const ext0 = ctl.values.wire === 'vcc10k' || ctl.values.wire === 'vcc1k';
        c.lineWidth = 2.4; c.strokeStyle = col; c.beginPath();
        if (v == null) { c.setLineDash([5, 4]); c.moveTo(X(0.12), Y(1.65)); c.lineTo(X(0.82), Y(1.65)); }
        else {
          c.moveTo(X(0), Y(0));                                                    // the supply is rising: only the outside acts
          c.lineTo(X(0.12), Y(ext0 ? VCC : 0)); c.lineTo(X(0.12), Y(v)); c.lineTo(X(0.82), Y(v));
        }
        c.stroke(); c.setLineDash([]);
        // the glitch or the activity
        const aS = 0.3, aE = 0.6;
        c.strokeStyle = C.bad; c.lineWidth = 1.6; c.beginPath();
        if (act.kind === 'spike') {
          const x = X(0.13); c.moveTo(x, Y(v == null ? 1.65 : v)); c.lineTo(x, Y(act.high ? VCC : 0)); if (act.both) { c.moveTo(x + 5, Y(v == null ? 1.65 : v)); c.lineTo(x + 5, Y(VCC)); }
        } else if (act.kind === 'serial' || act.kind === 'pwm' || act.kind === 'generic') {
          let x = X(aS), hi = false, seed = n * 7 + 3; c.moveTo(x, Y(v == null ? 1.65 : v));
          while (x < X(aE)) { seed = (seed * 1103515245 + 12345) & 0x7fffffff; const step = act.kind === 'pwm' ? 4 : 3 + (seed % 3) * 4; hi = act.kind === 'pwm' ? !hi : (seed >> 8) % 2 === 0; c.lineTo(x, Y(hi ? VCC : 0)); x += step; c.lineTo(x, Y(hi ? VCC : 0)); }
        }
        c.stroke();
        if (act.kind !== 'none') kit.label(c, act.kind === 'spike' ? 'glitch (not to scale)' : act.kind === 'serial' ? 'boot log' : act.kind === 'pwm' ? 'PWM-like activity' : 'activity', act.kind === 'spike' ? X(0.14) : X((aS + aE) / 2), Y(VCC) - 8, { size: 10, color: C.bad, align: act.kind === 'spike' ? 'left' : 'center' });
        // your program
        c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(X(0.82), py, X(1) - X(0.82), ph);
        kit.label(c, 'pinMode()', X(0.91), py + ph / 2, { size: 10.5, color: C.muted, align: 'center' });
        // the cursor
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(cur), by); c.lineTo(X(cur), py + ph); c.stroke();
        kit.label(c, 'schematic time, not to scale', px + pw, py + ph + 14, { size: 10, color: C.faint, align: 'right' });
        // the numbers
        const phase = PH.find(p => cur >= p[0] && cur < p[1]) || PH[4];
        ro.set('pin', 'GPIO' + n + ': ' + (g.note || ''));
        ro.set('rest', v == null ? 'floating: nothing defines it' + (g.pull ? '' : ' (no internal pull listed)') : kit.fmt(v, 3) + ' V: ' + lvl(v) + (ctl.values.wire === 'led' && v != null ? ' (the LED conducts a little)' : ''));
        ro.set('phase', phase[2]);
        let strap = '—';
        const s = (E.PINS[chip].strapping || []).find(q => q.gpio === n);
        if (s) {
          const m = /^\s*([01])/.exec(s.level || ''), need = m ? +m[1] : null, got = lvl(v);
          if (need == null) strap = 'A strapping pin, but any level is accepted for a normal start (' + s.level + ').';
          else if (got === 'floating' || got === 'in between') strap = 'Needs ' + (need ? 'high' : 'low') + ' for a normal start; the pin is ' + got + ': the result is a matter of luck.';
          else if ((got === 'high') === !!need) strap = 'Needs ' + (need ? 'high' : 'low') + ' for a normal start, and it is ' + got + ': fine.';
          else strap = 'Needs ' + (need ? 'high' : 'low') + ' for a normal start, but it is ' + got + '. The pin table says: ' + (s.meaning || '') + '.';
        }
        ro.set('strap', strap);
        ro.set('extra', act.text);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ gp-pin-planner */
  Hyper.sim('gp-pin-planner', {
    title: 'Planning the pins of a small project',
    blurb: `Tell the planner what the project needs and it places each job on a pin of the board you chose, scarce abilities first, strapping and console pins last. Placed pins light up with their job beside them; pins the board does not offer are never used. The same planner is in [the pin planner tool](#/tools/pinout/plan).

**Try this**
- On the **ESP32-DevKitC V4** with Wi-Fi on, ask for two analogue inputs: they land on ADC1 pins, as they must.
- Switch to the **XIAO ESP32C3** and ask for more jobs than it has pins: the planner runs out and says so.
- Switch Wi-Fi off and watch the analogue choice change.
- Read **Check these**: the planner is a first draft, and any pin that the pin table marks "with care" is listed for you to check.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const BOARDS = [['ESP32-DevKitC V4', 'esp32-devkitc-v4'], ['ESP32-S3-DevKitC-1 v1.1', 'esp32-s3-devkitc-1-v1.1'], ['ESP32-C3-DevKitM-1', 'esp32-c3-devkitm-1'], ['XIAO ESP32C3', 'seeed-xiao-esp32c3'], ['ESP32-C6-DevKitC-1', 'esp32-c6-devkitc-1']].filter(b => E.board(b[1]));
      if (!BOARDS.length) return;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 420, maxH: 680 });
      const ctl = kit.controls(box.side, [
        { id: 'board', type: 'select', label: 'Board', options: BOARDS, value: BOARDS[0][1] },
        { id: 'i2c', type: 'check', label: 'An I2C bus (display, sensors)', value: true },
        { id: 'spi', type: 'check', label: 'An SPI device (SD card, display)', value: false },
        { id: 'adc', label: 'Analogue inputs', min: 0, max: 4, step: 1, value: 1 },
        { id: 'btn', label: 'Buttons', min: 0, max: 4, step: 1, value: 1 },
        { id: 'out', label: 'LEDs or relay inputs (outputs)', min: 0, max: 4, step: 1, value: 1 },
        { id: 'strip', type: 'check', label: 'An addressable LED strip', value: false },
        { id: 'wifi', type: 'check', label: 'Wi-Fi in use', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['n', 'Jobs placed'], ['free', 'Free pins left (no warning)'], ['check', 'Check these']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, b = E.board(v.board), W = st.W;
        const wants = [];
        if (v.i2c) wants.push({ what: 'i2c', name: 'I2C' });
        if (v.spi) wants.push({ what: 'spi', name: 'SPI' });
        if (v.adc) wants.push({ what: 'adc', n: v.adc, name: 'analogue in' });
        if (v.btn) wants.push({ what: 'button', n: v.btn, name: 'button' });
        if (v.out) wants.push({ what: 'out', n: v.out, name: 'output' });
        if (v.strip) wants.push({ what: 'neopixel', name: 'LED strip' });
        const plan = E.planPins(v.board, wants, { wifi: v.wifi });
        const placed = plan.assign.filter(a => a.gpio != null), by = {};
        placed.forEach(a => { by[a.gpio] = a; });
        const level = n => E.pinVerdict(b.chip, n).level;
        const jobW = clamp(W * 0.2, 84, 120);
        const drawn = S.board(c, b, { x: jobW, y: 2, w: W - 2 * jobW, h: st.H - 4 }, {
          kindOf: p => (p.gpio != null && by[p.gpio] ? (level(p.gpio) === 'yes' ? 'gpio' : 'strap') : p.gpio == null ? E.pinKind(b.chip, p) : 'nc'),
          dim: p => p.gpio != null && !by[p.gpio]
        });
        const pillW = drawn.labelW - 10;
        drawn.pins.forEach(p => {
          const a = p.gpio != null ? by[p.gpio] : null;
          if (!a) return;
          const txt = a.name + (a.role ? ' ' + a.role : '');
          if (p.side === 'left') kit.label(c, txt, drawn.rect.x - 6 - pillW - 6, p.y, { size: 10.5, weight: 650, align: 'right', color: C.text });
          else kit.label(c, txt, drawn.rect.x + drawn.rect.w + 6 + pillW + 6, p.y, { size: 10.5, weight: 650, align: 'left', color: C.text });
        });
        // the numbers
        const missing = plan.assign.length - placed.length;
        ro.set('n', placed.length + ' pins for ' + plan.assign.length + ' jobs' + (missing ? ' (' + missing + ' without a pin)' : ''));
        ro.set('free', plan.free.length ? plan.free.map(n => 'GPIO' + n).join(' ') : 'none');
        const notes = plan.warnings.slice();
        placed.forEach(a => {
          const lv = level(a.gpio);
          if (lv !== 'yes' && !notes.some(w => w.indexOf('GPIO' + a.gpio + ' ') === 0)) notes.push('GPIO' + a.gpio + ' (' + a.name + '): ' + VERDICT_WORD[lv] + '. ' + String(E.pinVerdict(b.chip, a.gpio).text).split(/[.;]/)[0] + '.');
        });
        ro.set('check', notes.length ? notes.join(' ') : 'Every pin placed carries no warning in the pin table.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ gp-adc-wifi */
  Hyper.sim('gp-adc-wifi', {
    title: 'Which analogue pins keep working with Wi-Fi on',
    blurb: `Analogue pins are coloured by whether a reading is valid with the Wi-Fi switch as set: **green** works, **amber** may fail, **red** cannot be read, **grey** has no analogue input. The statuses follow the rules in the catalogue: ADC2 and Wi-Fi on the original ESP32, S2 and S3; the C3's unusable ADC2 pin; the C6's single ADC. Hover or tap a pad.

**Try this**
- On the **ESP32-DevKitC V4** switch Wi-Fi on and off: the ADC2 pads (GPIO0, 2, 4, 12 to 15, 25 to 27) go red and green; GPIO32 to 39 never change.
- Compare with the **ESP32-S3**: its ADC2 pads turn amber, not red: arbitrated, and a read may time out.
- On the **C3**, GPIO5 is red whatever the switch says. On the **C6** nothing is ever red.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const BOARDS = [['ESP32-DevKitC V4', 'esp32-devkitc-v4'], ['ESP32-S3-DevKitC-1 v1.1', 'esp32-s3-devkitc-1-v1.1'], ['ESP32-C3-DevKitM-1', 'esp32-c3-devkitm-1'], ['ESP32-C6-DevKitC-1', 'esp32-c6-devkitc-1']].filter(b => E.board(b[1]));
      if (!BOARDS.length) return;
      const st = kit.stage(box.stage, { aspect: 1.0, minH: 420, maxH: 680 });
      let drawn = null, sel = -1, hov = -1;
      const ctl = kit.controls(box.side, [
        { id: 'board', type: 'select', label: 'Board', options: BOARDS, value: BOARDS[0][1] },
        { id: 'wifi', type: 'check', label: 'Wi-Fi is on', value: true }
      ], () => { sel = -1; hov = -1; drawn = null; loop.once(); });
      const ro = kit.readout(box.side, [['pin', 'Pad'], ['adc', 'Converter and channel'], ['off', 'With Wi-Fi off'], ['on', 'With Wi-Fi on'], ['count', 'Analogue pads that work with Wi-Fi on']]);
      // [ok | warn | bad, why] for a GPIO as an analogue input, or null
      function status(chip, g, wifi) {
        const m = g && g.adc && /^ADC(\d)/.exec(g.adc);
        if (!m) return null;
        if (m[1] === '1') return ['ok', 'Works with or without Wi-Fi.'];
        if (chip === 'esp32') return wifi ? ['bad', 'Cannot be read while Wi-Fi is on: the reading is not valid.'] : ['ok', 'Works while Wi-Fi is off.'];
        if (chip === 'esp32-s2' || chip === 'esp32-s3') return wifi ? ['warn', 'Shared with Wi-Fi: a read may time out and return an invalid value.'] : ['ok', 'Works while Wi-Fi is off.'];
        if (chip === 'esp32-c3') return ['bad', 'ADC2 of the C3 is not dependable whatever Wi-Fi does: count it out.'];
        return ['ok', 'Works.'];
      }
      const kindOfStatus = s => (!s ? 'nc' : s[0] === 'ok' ? 'gpio' : s[0] === 'warn' ? 'strap' : 'flash');
      const show = () => {
        const i = hov >= 0 ? hov : sel, p = drawn && i >= 0 ? drawn.pins[i] : null, b = E.board(ctl.values.board);
        if (!p || !b) { ro.set('pin', 'hover over a pad'); ro.set('adc', '—'); ro.set('off', '—'); ro.set('on', '—'); }
        else {
          const g = p.gpio != null ? E.pin(b.chip, p.gpio) : null, s0 = status(b.chip, g, false), s1 = status(b.chip, g, true);
          ro.set('pin', p.gpio != null ? 'GPIO' + p.gpio + (p.label !== String(p.gpio) ? '  (printed ' + p.label + ')' : '') : p.label);
          ro.set('adc', g && g.adc ? g.adc : 'no analogue input');
          ro.set('off', s0 ? s0[1] : '—'); ro.set('on', s1 ? s1[1] : '—');
        }
        if (b && drawn) ro.set('count', drawn.pins.filter(q => q.gpio != null && (status(b.chip, E.pin(b.chip, q.gpio), ctl.values.wifi) || [])[0] === 'ok').length + ' of ' + drawn.pins.filter(q => q.gpio != null && status(b.chip, E.pin(b.chip, q.gpio), true)).length);
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), b = E.board(ctl.values.board), wifi = ctl.values.wifi;
        const wide = st.W >= 680, bw = wide ? Math.round(st.W * 0.58) : st.W;
        const pinStatus = p => (p.gpio != null ? status(b.chip, E.pin(b.chip, p.gpio), wifi) : null);
        drawn = S.board(c, b, { x: 2, y: 2, w: bw - 4, h: st.H - 4 }, {
          hover: hov >= 0 ? hov : sel,
          kindOf: p => (p.gpio == null ? E.pinKind(b.chip, p) : kindOfStatus(pinStatus(p))),
          dim: p => p.gpio != null && !pinStatus(p)
        });
        if (wide) {
          const x0 = bw + 8;
          kit.label(c, 'Wi-Fi is ' + (wifi ? 'on' : 'off'), x0, 16, { size: 13, weight: 650 });
          [['gpio', 'works'], ['strap', 'may fail'], ['flash', 'cannot be read'], ['nc', 'no analogue input']].forEach(([k, name], i) => {
            kit.dot(c, x0 + 7, 44 + i * 24, 6, S.kindColor(k)); kit.label(c, name, x0 + 20, 44 + i * 24, { size: 11.5, align: 'left' });
          });
        }
        show();
      }, box.stage);
      const hit = p => (drawn ? S.boardHit(drawn, p.x, p.y) : -1);
      st.canvas.addEventListener('pointermove', e => { const i = hit(st.pos(e)); if (i !== hov) { hov = i; loop.once(); } });
      st.canvas.addEventListener('pointerleave', () => { if (hov !== -1) { hov = -1; loop.once(); } });
      kit.click(st, p => { const i = hit(p); sel = i === sel ? -1 : i; loop.once(); }, p => hit(p) >= 0);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /*__NEXT__*/
})();
