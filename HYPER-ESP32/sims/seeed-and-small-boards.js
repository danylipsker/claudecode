/* HYPER-ESP32 · sims/seeed-and-small-boards.js
 *
 * Simulations of "Seeed and the thumb-sized boards" (topic code: sx).
 *
 *   sx-xiao-pins      a XIAO drawn from the catalogue; the D-labels land on different GPIOs on each chip
 *   sx-pin-planner    the pin planner at work: add jobs, see the pads they get and the warnings
 *   sx-connectors     Grove (I2C, UART, digital, analogue) against STEMMA QT / Qwiic: what each wire carries
 *   sx-i2c-daisy      I2C sensors on one connector: addresses, clashes, the pull-up arithmetic
 *   sx-board-sizes    boards drawn to scale from their size in millimetres
 *   sx-antenna-range  the range of a tiny antenna against an external one, with detuning
 *   sx-ladder         a resistor ladder: four buttons on one analogue pin
 *   sx-battery        reading a lithium cell through a divider, and what the divider costs in sleep
 *
 * Board facts come from the catalogue (kit.esp); the antenna gains, the board capacitances and the pull-up values
 * are teaching figures and the blurbs say so.
 */
(function () {
  'use strict';

  const XIAO = [
    { id: 'seeed-xiao-esp32c3', name: 'XIAO ESP32C3', short: 'C3', chip: 'esp32-c3' },
    { id: 'seeed-xiao-esp32s3', name: 'XIAO ESP32S3', short: 'S3', chip: 'esp32-s3' },
    { id: 'seeed-xiao-esp32c6', name: 'XIAO ESP32C6', short: 'C6', chip: 'esp32-c6' },
    { id: 'seeed-xiao-esp32c5', name: 'XIAO ESP32C5', short: 'C5', chip: 'esp32-c5' }
  ];
  const ROLE = { D4: 'I2C data', D5: 'I2C clock', D6: 'serial TX', D7: 'serial RX', D8: 'SPI clock', D9: 'SPI input', D10: 'SPI output' };
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const fmt = (v, d) => (Number.isFinite(v) ? v.toFixed(d == null ? 1 : d) : '—');

  /* the pads of a board's header: [{ label, gpio, side, i }] */
  function pads(E, board) {
    const out = [];
    for (const hd of (board && board.headers) || []) hd.pins.forEach((raw, i) => { const p = E.parsePin(raw); out.push({ label: p.label, gpio: p.gpio, side: hd.side, i }); });
    return out;
  }
  /* the GPIO behind a D-label on a board, or null */
  function gpioOf(E, board, label) { const p = pads(E, board).find(q => q.label === label); return p ? p.gpio : null; }
  /* a very simple word wrap by character count: -> lines */
  function wrap(str, n) {
    const words = String(str).split(/\s+/), lines = [];
    let cur = '';
    for (const w of words) { if ((cur + ' ' + w).trim().length > n && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
    if (cur) lines.push(cur);
    return lines;
  }

  /* ================================================================ sx-xiao-pins */
  Hyper.sim('sx-xiao-pins', {
    title: 'One XIAO, four chips: the same labels on different pins',
    blurb: `The board on the left is drawn from the catalogue; the table on the right lists the GPIO behind every D-label on all four ESP32 XIAO boards, coloured by what the chip says about the pin. **Click a pad** (or a table row) to read what it can do.

**Try this**
- Select **D4** and switch the board: the I2C data pad is GPIO6, 5, 22 and 23. The label never moves, the GPIO does.
- Highlight **strapping pads** on each board: three on the C3 (D0, D8, D9), one on the S3, none on the C6, two on the C5.
- Highlight **pads with an ADC**: the S3 has nine, the C3 four (one of them on the unreliable ADC2), the C6 three, and the C5 only one.
- Click **D3** on each chip and read the verdict: the same pad is analogue on one chip, plain on another and a strapping pin on a third.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, (box.stage.clientWidth || 760) < 500 ? { aspect: 1.6, minH: 540, maxH: 700 } : { aspect: 0.8, maxH: 560 });
      const start = XIAO.find(x => x.chip === (params && params.chip)) || XIAO[0];
      let sel = 'D4', rows = [];
      const ctl = kit.controls(box.side, [
        { id: 'board', type: 'select', label: 'XIAO board', options: XIAO.map(x => [x.name, x.id]), value: start.id },
        { id: 'mark', type: 'select', label: 'Highlight', options: [['the pad you click', 'sel'], ['strapping pads', 'strap'], ['pads with an ADC', 'adc'], ['pads that can wake deep sleep', 'rtc']], value: 'sel' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['pad', 'Pad'], ['gpio', 'GPIO'], ['can', 'The pin can'], ['says', 'The catalogue says'], ['board', 'On this board']]);
      const matches = (chip, gpio, mode, label) => {
        if (gpio == null) return false;
        const g = E.pin(chip, gpio);
        if (mode === 'sel') return label === sel;
        return !!(g && (mode === 'strap' ? g.strap : mode === 'adc' ? g.adc : g.rtc));
      };
      let drawn = null;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const b = E.board(ctl.values.board), mode = ctl.values.mark;
        if (!b) return;
        const list = pads(E, b), hue = { sel: C.accent, strap: C.warn, adc: C.ok, rtc: kit.hue(280) }[mode];
        const hl = {};
        for (const p of list) if (matches(b.chip, p.gpio, mode, p.label)) hl[p.gpio] = hue;
        const narrow = st.W < 500, bw = narrow ? st.W - 8 : Math.min(st.W * 0.47, 330);
        drawn = S.board(c, b, { x: 4, y: 4, w: bw, h: narrow ? 272 : st.H - 8 }, { highlight: hl, dim: mode === 'sel' ? null : (p => !(p.gpio != null && hl[p.gpio])) });
        // the table: every D-label on the four boards (beside the board, or under it on a narrow stage)
        const x0 = narrow ? 10 : bw + 18, w = narrow ? st.W - 20 : Math.max(160, st.W - x0 - 6), roleW = Math.min(74, w * 0.22), labW = 34, cw = (w - labW - roleW) / 4;
        const top = narrow ? 282 : 0, rh = clamp((st.H - top - 84) / 11, 17, 27), y0 = top + 34;
        kit.label(c, narrow ? 'GPIO behind each label' : 'Which GPIO is behind each label', x0, top + 12, { size: 12, weight: 650, color: C.text2 });
        XIAO.forEach((x, j) => {
          const cur = x.id === b.id;
          kit.label(c, x.short, x0 + labW + roleW + cw * (j + 0.5), y0 - 8, { size: 11.5, weight: cur ? 700 : 500, color: cur ? C.accent : C.muted, align: 'center' });
        });
        rows = [];
        for (let n = 0; n <= 10; n++) {
          const label = 'D' + n, y = y0 + n * rh;
          if (label === sel) { c.fillStyle = C.dark ? 'rgba(123,140,255,.16)' : 'rgba(60,90,220,.10)'; c.fillRect(x0 - 3, y, w + 3, rh - 1); }
          rows.push({ x: x0 - 3, y, w: w + 3, h: rh, label });
          kit.label(c, label, x0, y + rh / 2, { size: 11.5, weight: 650 });
          kit.label(c, ROLE[label] || '', x0 + labW, y + rh / 2, { size: 10, color: C.muted });
          XIAO.forEach((xb, j) => {
            const bb = E.board(xb.id), g = bb ? gpioOf(E, bb, label) : null, cx = x0 + labW + roleW + cw * j;
            if (g == null) return;
            const kind = E.pinKind(bb.chip, g), hit = mode !== 'sel' && matches(bb.chip, g, mode, label);
            c.fillStyle = S.kindColor(kind, hit ? 0.5 : 0.2); c.fillRect(cx + 2, y + 1.5, cw - 4, rh - 3);
            if (xb.id === b.id) { c.strokeStyle = C.accent; c.lineWidth = 1.6; c.strokeRect(cx + 2, y + 1.5, cw - 4, rh - 3); }
            kit.label(c, String(g), cx + cw / 2, y + rh / 2, { size: 11.5, weight: hit ? 700 : 500, align: 'center' });
          });
        }
        // a legend of the colours in use
        const ly = y0 + 11 * rh + 14, leg = [['gpio', 'plain'], ['adc', 'analogue'], ['strap', 'strapping'], ['uart', 'serial console'], ['jtag', 'JTAG']];
        let lx = x0, lrow = 0;
        for (const [k, t] of leg) {
          const iw = 24 + t.length * 5.6;
          if (lx + iw > x0 + w && lx > x0) { lx = x0; lrow++; }
          c.fillStyle = S.kindColor(k, 0.6); c.fillRect(lx, ly + lrow * 15 - 5, 10, 10); kit.label(c, t, lx + 14, ly + lrow * 15, { size: 10, color: C.muted }); lx += iw;
        }
        // the readout for the selected pad
        const g = gpioOf(E, b, sel);
        ro.set('pad', sel + (ROLE[sel] ? ' · ' + ROLE[sel] : ''));
        if (g == null) { ro.set('gpio', '—'); ro.set('can', '—'); ro.set('says', '—'); }
        else {
          const caps = E.pinCaps(b.chip, g), v = E.pinVerdict(b.chip, g);
          ro.set('gpio', 'GPIO' + g);
          ro.set('can', caps.length ? caps.join(', ') : 'plain GPIO');
          ro.set('says', v.text.length > 150 ? v.text.slice(0, 147) + '…' : v.text);
        }
        const pn = b.pins || {};
        ro.set('board', (pn.user_led != null ? 'user LED GPIO' + pn.user_led : 'no user LED') + ' · BOOT GPIO' + (pn.boot != null ? pn.boot : '?'));
      }, box.stage);
      kit.click(st, p => {
        if (drawn) { const i = S.boardHit(drawn, p.x, p.y); if (i >= 0 && /^D\d+$/.test(drawn.pins[i].label)) { sel = drawn.pins[i].label; loop.once(); return; } }
        const r = rows.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h);
        if (r) { sel = r.label; loop.once(); }
      }, p => !!(drawn && S.boardHit(drawn, p.x, p.y) >= 0) || rows.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sx-pin-planner */
  const JOB_HUE = { I2C: 186, SPI: 312, Serial: 212, Analogue: 36, Button: 140, Output: 8, 'LED strip': 280 };
  Hyper.sim('sx-pin-planner', {
    title: 'The pin planner: eleven pads, many jobs',
    blurb: `Ask the planner for jobs and it hands out pads from the board's own header, spending safe pads first and strapping or serial pads last, and warns when it has to use one. Everything comes from the catalogue's pin tables.

**Try this**
- Start with the default (I2C, an analogue input, two buttons, an output, an LED strip) on the **C3**: the planner has to use D8, a strapping pad, and warns.
- Tick **Use the BOOT button as a button**: one button needs no pad, the planner no longer needs D8, and the warning goes. On boards with a user LED tick that too.
- Switch to the **C6**: no strapping pads, so the same jobs get no warning.
- Add an **SPI device** and a **serial port** and watch the pads run out on the C3.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, (box.stage.clientWidth || 760) < 500 ? { aspect: 1.8, minH: 600, maxH: 760 } : { aspect: 0.88, maxH: 620 });
      const BOARDS = XIAO.map(x => [x.name, x.id]).concat([['Adafruit QT Py ESP32-S3 (8 MB)', 'adafruit-qt-py-esp32-s3-8mb-nopsram']]);
      const ctl = kit.controls(box.side, [
        { id: 'board', type: 'select', label: 'Board', options: BOARDS, value: 'seeed-xiao-esp32c3' },
        { id: 'i2c', label: 'I2C buses', min: 0, max: 1, step: 1, value: 1 },
        { id: 'spi', label: 'SPI devices', min: 0, max: 1, step: 1, value: 0 },
        { id: 'uart', label: 'Serial ports', min: 0, max: 1, step: 1, value: 0 },
        { id: 'adc', label: 'Analogue inputs', min: 0, max: 5, step: 1, value: 1 },
        { id: 'button', label: 'Buttons', min: 0, max: 6, step: 1, value: 2 },
        { id: 'out', label: 'Outputs (LEDs, relays)', min: 0, max: 6, step: 1, value: 1 },
        { id: 'neo', label: 'LED strip data lines', min: 0, max: 1, step: 1, value: 1 },
        { id: 'boot', type: 'check', label: 'Use the BOOT button as a button', value: false },
        { id: 'led', type: 'check', label: 'Use the user LED as an output', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['asked', 'Pads asked for'], ['have', 'Pads on the header'], ['lost', 'Jobs with no pad'], ['warn', 'Warnings']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, b = E.board(v.board);
        if (!b) return;
        const pn = b.pins || {}, hasBoot = pn.boot != null || pn.button != null, hasLed = pn.user_led != null;
        const buttons = Math.max(0, v.button - (v.boot && hasBoot ? 1 : 0)), outs = Math.max(0, v.out - (v.led && hasLed ? 1 : 0));
        const wants = [];
        if (v.i2c) wants.push({ what: 'i2c', name: 'I2C', n: v.i2c });
        if (v.spi) wants.push({ what: 'spi', name: 'SPI' });
        if (v.uart) wants.push({ what: 'uart', name: 'Serial' });
        if (v.adc) wants.push({ what: 'adc', name: 'Analogue', n: v.adc });
        if (buttons) wants.push({ what: 'button', name: 'Button', n: buttons });
        if (outs) wants.push({ what: 'out', name: 'Output', n: outs });
        if (v.neo) wants.push({ what: 'neopixel', name: 'LED strip' });
        const plan = wants.length ? E.planPins(b, wants, { wifi: true }) : { assign: [], warnings: [], free: [] };
        const list = pads(E, b), gp = list.filter(p => p.gpio != null), label = g => { const p = gp.find(q => q.gpio === g); return p ? p.label : 'GPIO' + g; };
        // group by job
        const groups = [];
        for (const a of plan.assign) {
          let g = groups.find(q => q.name === a.name);
          if (!g) { g = { name: a.name, kind: (a.name || '').replace(/ \d+$/, ''), parts: [], level: 'yes', lost: false }; groups.push(g); }
          g.parts.push({ role: a.role, gpio: a.gpio });
          if (a.gpio == null) g.lost = true; else if (a.level === 'caution') g.level = 'caution';
        }
        const hl = {};
        for (const a of plan.assign) if (a.gpio != null) hl[a.gpio] = kit.hue(JOB_HUE[(a.name || '').replace(/ \d+$/, '')] != null ? JOB_HUE[(a.name || '').replace(/ \d+$/, '')] : 150);
        const narrow = st.W < 500, bw = narrow ? Math.min(st.W - 8, 330) : Math.min(st.W * 0.42, 290);
        S.board(c, b, { x: narrow ? (st.W - bw) / 2 : 4, y: 4, w: bw, h: narrow ? 296 : st.H - 8 }, { highlight: hl, dim: p => !(p.gpio != null && hl[p.gpio]) });
        // the list of jobs (beside the board, or under it on a narrow stage)
        const x0 = narrow ? 10 : bw + 18, wd = st.W - x0 - 6, nch = Math.max(24, Math.floor(wd / 6.3)), top = narrow ? 312 : 0;
        kit.label(c, 'What the planner gave each job', x0, top + 12, { size: 12, weight: 650, color: C.text2 });
        let y = top + 34;
        if (!groups.length) { kit.label(c, 'Add a job with the sliders.', x0, y, { size: 12, color: C.muted }); y += 20; }
        for (const g of groups) {
          const col = kit.hue(JOB_HUE[g.kind] != null ? JOB_HUE[g.kind] : 150);
          kit.dot(c, x0 + 5, y, 4.5, col);
          kit.label(c, g.name, x0 + 16, y, { size: 12, weight: 650 });
          const txt = g.parts.map(q => (q.role ? q.role + ' ' : '') + (q.gpio == null ? 'no pad left' : label(q.gpio) + ' (GPIO' + q.gpio + ')')).join('  ·  ');
          kit.label(c, txt + (g.level === 'caution' && !g.lost ? '   !' : ''), x0 + 16, y + 15, { size: 10.5, color: g.lost ? C.bad : g.level === 'caution' ? C.warn : C.muted });
          y += 34;
        }
        // what is left
        const used = new Set(plan.assign.filter(a => a.gpio != null).map(a => a.gpio));
        const free = gp.filter(p => !used.has(p.gpio)).map(p => p.label);
        y += 4;
        kit.label(c, 'Pads not used: ' + (free.length ? free.join(' ') : 'none'), x0, y, { size: 11.5, color: C.text2 });
        y += 22;
        for (const w of plan.warnings) for (const ln of wrap(w, nch)) { if (y < st.H - 6) kit.label(c, ln, x0, y, { size: 10.5, color: C.warn }); y += 14; }
        // numbers
        const asked = (v.i2c ? 2 * v.i2c : 0) + (v.spi ? 4 : 0) + (v.uart ? 2 : 0) + v.adc + buttons + outs + v.neo;
        ro.set('asked', String(asked));
        ro.set('have', String(gp.length));
        ro.set('lost', String(plan.assign.filter(a => a.gpio == null).length));
        ro.set('warn', String(plan.warnings.length));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sx-connectors */
  const WIRE = { yellow: '#e2b714', white: '#f1f1ee', red: '#d6403f', black: '#16181d', blue: '#2f6fe0' };
  const FAMILY = {
    'grove-i2c': { name: 'Grove cable, I2C', pitch: '2.0 mm', carries: 'I2C (two signals)', wires: [['yellow', 'SCL'], ['white', 'SDA'], ['red', 'supply'], ['black', 'GND']] },
    'grove-uart': { name: 'Grove cable, serial', pitch: '2.0 mm', carries: 'serial (two lines)', wires: [['yellow', 'line 1'], ['white', 'line 2'], ['red', 'supply'], ['black', 'GND']] },
    'grove-digital': { name: 'Grove cable, digital', pitch: '2.0 mm', carries: 'one digital signal', wires: [['yellow', 'signal'], ['white', 'signal 2 (unused)'], ['red', 'supply'], ['black', 'GND']] },
    'grove-analog': { name: 'Grove cable, analogue', pitch: '2.0 mm', carries: 'one analogue signal', wires: [['yellow', 'signal'], ['white', 'signal 2 (unused)'], ['red', 'supply'], ['black', 'GND']] },
    'stemma': { name: 'STEMMA QT / Qwiic cable', pitch: '1.0 mm', carries: 'I2C only', wires: [['black', 'GND'], ['red', '3.3 V'], ['blue', 'SDA'], ['yellow', 'SCL']] }
  };
  function connectorVerdict(fam, supply, pull) {
    if (fam === 'stemma') return ['ok', 'Fixed 3.3 V and I2C only: nothing to switch, and nothing on the cable can reach an ESP32 pin above 3.3 V. Chain boards that have different addresses.'];
    const low = supply < 4;
    if (fam === 'grove-i2c') {
      if (low) return ['ok', 'A 3.3 V module on a 3.3 V board. If the module has pull-ups they go to 3.3 V. Check that its address is free on the bus.'];
      if (pull) return ['bad', 'The module pulls SDA and SCL up to its 5 V supply, so both lines rise to 5 V: more than a 3.3 V ESP32 pin tolerates. Use a 3.3 V module or a level shifter.'];
      return ['warn', 'With no pull-ups on the module the board holds the bus at 3.3 V, so nothing goes above 3.3 V. But a 5 V module reads 3.3 V as high only marginally (a 5 V input wants about 3.5 V). Power it at 3.3 V if it allows.'];
    }
    if (fam === 'grove-uart') return low ? ['ok', 'Both ends are 3.3 V. Cross the lines: the board\'s transmit goes to the module\'s receive, and the labels may be written from either side, so read the silkscreen.'] : ['bad', 'The module\'s transmit line swings to 5 V into a 3.3 V receive pin. Divide it down or shift the level, and cross the lines.'];
    if (fam === 'grove-digital') return low ? ['ok', 'Both ends are 3.3 V, so the signal stays within what the ESP32 pin accepts.'] : ['bad', 'A 5 V module\'s output swings to 5 V into a 3.3 V pin, and the board\'s 3.3 V output may be too low for it to read as high. Use a divider or a level shifter.'];
    return low ? ['ok', 'A 3.3 V sensor stays between 0 and 3.3 V. Check the ADC range of your chip: about 2.5 V at the default setting on a C3.'] : ['warn', 'A sensor on 5 V can output up to 5 V, beyond what the pin takes. Divide it so that its full swing falls inside the ADC range (0 to 2.5 V on a C3 at the default setting).'];
  }
  Hyper.sim('sx-connectors', {
    title: 'Grove against STEMMA QT and Qwiic: what each wire carries',
    blurb: `Pick a connector and a use. The four wires are drawn in their real colours, with what each one carries and the verdict for plugging it into a 3.3 V ESP32 board. Pin order of the Grove cable: yellow, white, red, black; of STEMMA QT and Qwiic: ground, 3.3 V, SDA, SCL.

**Try this**
- Start with **Grove, I2C**: yellow is the clock, white the data. Raise the module supply to **5 V** with its pull-ups on and read the verdict.
- Untick the pull-ups: the danger eases, but a 5 V module still reads 3.3 V poorly.
- Switch to **STEMMA QT / Qwiic**: one pitch (1.0 mm), I2C only, always 3.3 V, so there is no choice to get wrong.
- Try **Grove, serial**: two lines that must be crossed, not wired straight.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 380, maxH: 470 });
      const ctl = kit.controls(box.side, [
        { id: 'family', type: 'select', label: 'Connector and use', options: Object.keys(FAMILY).map(k => [FAMILY[k].name, k]), value: FAMILY[params && params.family] ? params.family : 'grove-i2c' },
        { id: 'supply', type: 'select', label: 'Module supply (Grove)', options: [['3.3 V', 3.3], ['5 V', 5]], value: 3.3 },
        { id: 'pull', type: 'check', label: 'The module pulls SDA and SCL up to its supply', value: true }
      ], () => { sync(); loop.once(); });
      const ro = kit.readout(box.side, [['pitch', 'Connector'], ['carries', 'Carries'], ['supply', 'Supply'], ['verdict', 'On a 3.3 V ESP32']]);
      const sync = () => { const f = ctl.values.family; ctl.show('supply', f !== 'stemma'); ctl.show('pull', f === 'grove-i2c'); };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, fam = FAMILY[v.family] || FAMILY['grove-i2c'];
        const supply = v.family === 'stemma' ? 3.3 : v.supply, ver = connectorVerdict(v.family, supply, v.pull);
        const col = ver[0] === 'ok' ? C.ok : ver[0] === 'warn' ? C.warn : C.bad;
        kit.label(c, fam.name, st.W / 2, 14, { size: 13, weight: 650, align: 'center' });
        const bw = Math.min(150, st.W * 0.26), by = 36, bh = 186, lx = 10, rx = st.W - 10 - bw;
        S.box(c, lx, by, bw, bh, { label: 'ESP32 board', sub: '3.3 V logic', color: kit.hue(8) });
        S.box(c, rx, by, bw, bh, { label: 'Module', sub: supply + ' V supply', color: kit.hue(supply < 4 ? 150 : 28) });
        // the plugs and the four wires
        const x1 = lx + bw + 8, x2 = rx - 8;
        for (const x of [lx + bw, rx - 14]) { c.fillStyle = C.dark ? 'rgba(255,255,255,.10)' : 'rgba(0,0,0,.08)'; c.fillRect(x, by + 14, 14, bh - 28); }
        kit.label(c, fam.pitch + ' pitch', lx + bw / 2, by + bh + 12, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, fam.pitch + ' pitch', rx + bw / 2, by + bh + 12, { size: 10.5, color: C.muted, align: 'center' });
        fam.wires.forEach(([colour, name], i) => {
          const y = by + 34 + i * 38;
          const isSignal = name !== 'GND' && !/supply|3\.3/.test(name);
          const label = name === 'supply' ? 'supply ' + supply + ' V' : name;
          c.strokeStyle = C.muted; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(x1, y); c.lineTo(x2, y); c.stroke();
          c.strokeStyle = WIRE[colour]; c.lineWidth = 4; c.beginPath(); c.moveTo(x1, y); c.lineTo(x2, y); c.stroke();
          kit.dot(c, lx + bw - 4, y, 3, WIRE[colour], C.muted); kit.dot(c, rx + 4, y, 3, WIRE[colour], C.muted);
          kit.label(c, (i + 1) + ' · ' + colour, (x1 + x2) / 2, y - 9, { size: 10.5, color: C.muted, align: 'center' });
          kit.label(c, label, (x1 + x2) / 2, y + 11, { size: 11.5, weight: 650, color: isSignal && supply > 4 && v.family !== 'stemma' ? C.warn : C.text, align: 'center' });
        });
        // the verdict
        const vy = by + bh + 32, vh = Math.max(46, st.H - vy - 8), nch = Math.max(30, Math.floor((st.W - 40) / 6.3)), lines = wrap(ver[1], nch);
        c.fillStyle = col; c.globalAlpha = 0.14; c.fillRect(10, vy, st.W - 20, vh); c.globalAlpha = 1;
        c.strokeStyle = col; c.lineWidth = 1.6; c.strokeRect(10, vy, st.W - 20, vh);
        kit.label(c, ver[0] === 'ok' ? 'Fine on a 3.3 V board' : ver[0] === 'warn' ? 'Check before you plug in' : 'Do not plug it in like this', 20, vy + 13, { size: 12, weight: 700, color: col });
        lines.slice(0, Math.max(1, Math.floor((vh - 24) / 14))).forEach((ln, k) => kit.label(c, ln, 20, vy + 30 + k * 14, { size: 11, color: C.text2 }));
        ro.set('pitch', fam.pitch + ' · 4 wires' + (v.family === 'stemma' ? ' · JST-SH' : ' · keyed'));
        ro.set('carries', fam.carries);
        ro.set('supply', v.family === 'stemma' ? 'fixed 3.3 V' : supply + ' V (module)');
        ro.set('verdict', ver[0] === 'ok' ? 'fine' : ver[0] === 'warn' ? 'check first' : 'level problem');
      }, box.stage);
      sync();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sx-i2c-daisy */
  const PARTS = [
    { name: 'BME280 (temperature, humidity, pressure)', short: 'BME280', addr: [0x76, 0x77] },
    { name: 'BH1750 (light)', short: 'BH1750', addr: [0x23, 0x5C] },
    { name: 'SHT31 (temperature, humidity)', short: 'SHT31', addr: [0x44, 0x45] },
    { name: 'AHT20 (temperature, humidity)', short: 'AHT20', addr: [0x38] },
    { name: 'SSD1306 OLED display', short: 'OLED', addr: [0x3C, 0x3D] },
    { name: 'MPU6050 (motion)', short: 'MPU6050', addr: [0x68, 0x69] },
    { name: 'DS3231 (real-time clock)', short: 'DS3231', addr: [0x68] },
    { name: 'INA219 (current)', short: 'INA219', addr: [0x40, 0x41] },
    { name: 'ADS1115 (analogue inputs)', short: 'ADS1115', addr: [0x48, 0x49] },
    { name: 'SCD41 (CO2)', short: 'SCD41', addr: [0x62] },
    { name: 'VL53L1X (distance)', short: 'VL53L1X', addr: [0x29] },
    { name: 'MCP23017 (16 extra pins)', short: 'MCP23017', addr: [0x20, 0x21] }
  ];
  const hex2 = a => '0x' + a.toString(16).toUpperCase().padStart(2, '0');
  Hyper.sim('sx-i2c-daisy', {
    title: 'Sensors on one connector: addresses and pull-ups',
    blurb: `Chain up to five I2C parts on one cable. The bus lines run from the board's SDA and SCL pads to every part; the sketch below the picture is what an I2C scan would print. Two parts at one address clash. The pull-ups of every board add in parallel, and every board and metre of cable adds capacitance; the bus must still rise within the I2C limit.

The addresses are those of the common parts, and the capacitances (10 pF per board, 50 pF per metre of cable) and the pull-up values are **teaching figures**, not measurements.

**Try this**
- Put a **DS3231** in Part 1 and an **MPU6050** in Part 2: both answer at 0x68, so the scan shows one address. Tick **move a part to its alternate address**: the MPU6050 goes to 0x69.
- Fill all five slots and choose **4.7 kΩ** on each: the pull-ups combine to less than the pads can pull down.
- Choose **none** for the pull-ups: the bus never rises at all.
- Leave one part, set **400 kHz** and stretch the cable to 1.5 m: a single 10 kΩ pull-up is too weak and the rise time passes its limit. More boards in parallel make the edge faster.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 340, maxH: 500 });
      const opts = [['— nothing —', -1]].concat(PARTS.map((p, i) => [p.name, i]));
      const defaults = [0, 1, 4, 3, -1];
      const defs = defaults.map((d, i) => ({ id: 's' + i, type: 'select', label: 'Part ' + (i + 1), options: opts, value: d }));
      const ctl = kit.controls(box.side, defs.concat([
        { id: 'auto', type: 'check', label: 'Move a part to its alternate address when it clashes', value: false },
        { id: 'hz', type: 'select', label: 'Bus speed', options: [['100 kHz', 100e3], ['400 kHz', 400e3]], value: 100e3 },
        { id: 'pull', type: 'select', label: 'Pull-ups on each board', options: [['10 kΩ', 10e3], ['4.7 kΩ', 4.7e3], ['none', 0]], value: 10e3 },
        { id: 'cable', label: 'Cable between boards', min: 0.05, max: 1.5, step: 0.05, value: 0.3, unit: 'm' }
      ]), () => loop.once());
      const ro = kit.readout(box.side, [['n', 'Parts on the bus'], ['clash', 'Address clashes'], ['pull', 'Pull-ups together'], ['cap', 'Bus capacitance'], ['rise', 'Rise time (limit)'], ['bus', 'The bus']]);
      const connector = params && params.connector === 'grove' ? 'Grove I2C hub or chain' : 'STEMMA QT / Qwiic chain';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const slots = [0, 1, 2, 3, 4].map(i => v['s' + i]), used = new Map(), res = [];
        for (const i of slots) {
          if (i < 0) continue;
          const p = PARTS[i];
          let a = p.addr[0];
          if (v.auto) { const f = p.addr.find(x => !used.has(x)); if (f != null) a = f; }
          used.set(a, (used.get(a) || 0) + 1);
          res.push({ part: p, addr: a, alt: a !== p.addr[0] });
        }
        const n = res.length, clashes = [...used.values()].filter(k => k > 1).length;
        // the picture: the board, then the parts, on two bus lines
        kit.label(c, connector, st.W / 2, 13, { size: 12.5, weight: 650, align: 'center' });
        const tw = clamp((st.W - 28) / 6.2, 50, 104), gap = 5, ty = 52, th = 62, bx = 6;
        const yS = ty + th + 26, yC = ty + th + 40;
        const bd = S.tile(c, bx, ty, tw, th, { label: 'XIAO', sub: 'D4 · D5', color: 'black', pins: ['SDA', 'SCL'], side: 'bottom' });
        const sdaX = [bd.pins.SDA], sclX = [bd.pins.SCL];
        res.forEach((r, k) => {
          const x = bx + (k + 1) * (tw + gap);
          const bad = (used.get(r.addr) || 0) > 1;
          const t = S.tile(c, x, ty, tw, th, { label: r.part.short, sub: hex2(r.addr) + (r.alt ? ' (alt)' : ''), color: ['blue', 'green', 'purple', 'teal', 'red'][k % 5], pins: ['SDA', 'SCL'], side: 'bottom', size: tw < 70 ? 9.5 : 11 });
          if (bad) { c.strokeStyle = C.bad; c.lineWidth = 2.5; c.strokeRect(x - 2, ty - 2, tw + 4, th + 4); }
          sdaX.push(t.pins.SDA); sclX.push(t.pins.SCL);
        });
        const xEnd = Math.max(...sdaX.map(p => p[0]), ...sclX.map(p => p[0]));
        c.lineWidth = 2.4; c.strokeStyle = WIRE.blue; c.beginPath(); c.moveTo(sdaX[0][0], yS); c.lineTo(xEnd, yS); c.stroke();
        c.strokeStyle = WIRE.yellow; c.beginPath(); c.moveTo(sclX[0][0], yC); c.lineTo(xEnd, yC); c.stroke();
        sdaX.forEach(p => { c.strokeStyle = WIRE.blue; c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[0], yS); c.stroke(); kit.dot(c, p[0], yS, 3, WIRE.blue); });
        sclX.forEach(p => { c.strokeStyle = WIRE.yellow; c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[0], yC); c.stroke(); kit.dot(c, p[0], yC, 3, WIRE.yellow); });
        kit.label(c, 'SDA', 4, yS - 7, { size: 9.5, color: C.muted }); kit.label(c, 'SCL', 4, yC + 8, { size: 9.5, color: C.muted });
        // what a scan prints
        let y = yC + 34;
        kit.label(c, 'An I2C scan would print:', 8, y, { size: 12, weight: 650, color: C.text2 });
        y += 20;
        const addrs = [...used.keys()].sort((a, b) => a - b);
        if (!addrs.length) kit.label(c, 'nothing: no part is plugged in', 8, y, { size: 11.5, color: C.muted });
        addrs.forEach(a => {
          const guess = (E.I2C_ADDR[a] || ['unknown'])[0], dup = used.get(a) > 1;
          kit.label(c, hex2(a) + '   ' + guess + (dup ? '   ← ' + used.get(a) + ' parts answer here' : ''), 8, y, { size: 11.5, color: dup ? C.bad : C.text, weight: dup ? 650 : 500 });
          y += 17;
        });
        if (addrs.length) wrap('A scan lists addresses only: the names are guesses from a table of common parts.', Math.max(24, Math.floor((st.W - 16) / 5.6))).forEach((ln, k) => kit.label(c, ln, 8, Math.min(st.H - 8, y + 6 + k * 12), { size: 10, color: C.faint }));
        // the electrical side
        const R = v.pull > 0 && n > 0 ? v.pull / n : Infinity, Cb = (n + 1) * 10e-12 + 50e-12 * v.cable;
        const r = E.i2cPullup(3.3, Cb, v.hz, Number.isFinite(R) ? R : 1e9);
        let bus = 'fine';
        if (n === 0) bus = 'no part';
        else if (!Number.isFinite(R)) bus = 'no pull-ups: never rises';
        else if (R < r.min) bus = 'pull-ups too strong';
        else if (r.rise > r.limit) bus = 'too slow';
        ro.set('n', String(n));
        ro.set('clash', String(clashes));
        ro.set('pull', Number.isFinite(R) ? fmt(R / 1000, 2) + ' kΩ (min ' + fmt(r.min / 1000, 2) + ')' : 'none');
        ro.set('cap', fmt(Cb * 1e12, 0) + ' pF');
        ro.set('rise', Number.isFinite(R) ? fmt(r.rise * 1e9, 0) + ' ns (' + fmt(r.limit * 1e9, 0) + ')' : '—');
        ro.set('bus', bus);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sx-board-sizes */
  const SIZE_GROUPS = {
    thumb: ['seeed-xiao-esp32c3', 'adafruit-qt-py-esp32-s3-8mb-nopsram', 'esp32-c3-supermini', 'esp32-c6-supermini', 'esp32-h2-supermini', 'esp32-s3-supermini', 'm5stack-atoms3', 'lolin-c3-pico', 'arduino-nano-esp32', 'esp32-c3-devkitc-02', 'esp32-s3-devkitc-1-v1.1'],
    devkits: ['seeed-xiao-esp32c3', 'esp32-c3-devkitc-02', 'esp32-devkitc-v4', 'esp32-s3-devkitc-1-v1.1', 'adafruit-feather-esp32-v2', 'nodemcu-32s', 'lolin-d1-mini', 'esp32-cam-ai-thinker'],
    seeed: ['seeed-xiao-esp32c3', 'seeed-wio-s3-wireless-module', 'seeed-reterminal-e1001', 'seeed-xiao-7-5-inch-epaper-panel', 'seeed-reterminal-e1003', 'seeed-reterminal-e1004']
  };
  const MAKER_HUE = { 'Seeed Studio': 150, Adafruit: 300, Espressif: 8, 'Generic and clones': 48, Waveshare: 212, M5Stack: 28, Arduino: 190, LOLIN: 262 };
  Hyper.sim('sx-board-sizes', {
    title: 'Boards to scale',
    blurb: `Every board is drawn from its size in millimetres in the catalogue, all at one scale, bottoms aligned. **Click a board** for its size and how many times the area of a XIAO ESP32C3 it covers. The coin is a 1 euro piece (23.25 mm) for a sense of scale. Sizes are the makers' figures for the board without its pins, antenna or case; they vary a little between sources.

**Try this**
- In *the thumb-sized boards* compare a XIAO with the SuperMini boards: nearly the same, within a few millimetres.
- Look at the Arduino Nano ESP32 and a DevKit: long and thin, and two to four times the area of a XIAO.
- Switch to *Seeed's finished devices*: a XIAO is a speck beside the 13.3 inch reTerminal E1004.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.62, maxH: 460 });
      let sel = 'seeed-xiao-esp32c3', hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'group', type: 'select', label: 'Show', options: [['the thumb-sized boards', 'thumb'], ['against the DevKits', 'devkits'], ['Seeed\'s finished devices', 'seeed']], value: SIZE_GROUPS[params && params.group] ? params.group : 'thumb' },
        { id: 'coin', type: 'check', label: 'Show a 1 euro coin', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['name', 'Board'], ['size', 'Size'], ['area', 'Area'], ['times', 'Against a XIAO ESP32C3'], ['chip', 'Chip and memory']]);
      const xiao = E.board('seeed-xiao-esp32c3'), xiaoArea = xiao && xiao.size ? xiao.size[0] * xiao.size[1] : 374;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const items = (SIZE_GROUPS[v.group] || SIZE_GROUPS.thumb).map(id => E.board(id)).filter(b => b && b.size).map(b => ({ b, w: b.size[0], h: b.size[1] }));
        if (v.coin) items.push({ coin: true, w: 23.25, h: 23.25 });
        const rows = st.W < 560 ? 3 : 2, gap = 14, sumW = items.reduce((a, it) => a + it.w, 0), maxH = Math.max(...items.map(it => it.h), 1);
        const availW = st.W - 24 - gap * (items.length - 1), availH = st.H - 24 - 40 - rows * 13;
        const scale = Math.max(0.05, Math.min(availW / sumW, availH / maxH));
        const base = 18 + maxH * scale;
        hits = [];
        let x = 12;
        items.forEach((it, k) => {
          const w = it.w * scale, h = it.h * scale;
          if (it.coin) {
            c.beginPath(); c.arc(x + w / 2, base - h / 2, w / 2, 0, 6.2832); c.fillStyle = C.dark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.08)'; c.fill();
            c.strokeStyle = C.muted; c.lineWidth = 1.4; c.stroke();
            kit.label(c, '1 euro', x + w / 2, base + 12 + (k % rows) * 13, { size: 10, color: C.muted, align: 'center' });
          } else {
            const hue = MAKER_HUE[it.b.maker] != null ? MAKER_HUE[it.b.maker] : 100, on = it.b.id === sel;
            c.fillStyle = kit.hue(hue, 0.28); c.fillRect(x, base - h, w, h);
            c.strokeStyle = on ? C.accent : kit.hue(hue); c.lineWidth = on ? 2.6 : 1.4; c.strokeRect(x, base - h, w, h);
            c.fillStyle = C.muted; c.fillRect(x + w * 0.38, base - Math.max(2, 2.2 * scale), w * 0.24, Math.max(2, 2.2 * scale));
            const nm = it.b.name.replace(/^Seeed Studio /, '').replace(/ \(.*$/, '').replace(/^Adafruit /, '').replace(/^ESP32-/, '').slice(0, 20);
            const half = nm.length * 9.5 * 0.28 + 2;
            kit.label(c, nm, clamp(x + w / 2, half, st.W - half), base + 12 + (k % rows) * 13, { size: 9.5, color: on ? C.accent : C.text2, align: 'center', weight: on ? 650 : 500 });
            hits.push({ x, y: base - h, w, h, id: it.b.id });
          }
          x += w + gap;
        });
        // the scale bar
        const nice = [5, 10, 20, 50, 100].find(m => m * scale >= 40) || 100;
        const sy = st.H - 14;
        c.strokeStyle = C.text2; c.lineWidth = 2; c.beginPath(); c.moveTo(12, sy); c.lineTo(12 + nice * scale, sy); c.moveTo(12, sy - 4); c.lineTo(12, sy + 4); c.moveTo(12 + nice * scale, sy - 4); c.lineTo(12 + nice * scale, sy + 4); c.stroke();
        kit.label(c, nice + ' mm', 18 + nice * scale, sy, { size: 10.5, color: C.text2 });
        // the readout
        const b = E.board(sel) && E.board(sel).size ? E.board(sel) : null;
        if (b) {
          const a = b.size[0] * b.size[1], ch = E.chip(b.chip);
          ro.set('name', b.name.length > 38 ? b.name.slice(0, 36) + '…' : b.name);
          ro.set('size', b.size.join(' × ') + ' mm');
          ro.set('area', fmt(a / 100, 1) + ' cm²');
          ro.set('times', fmt(a / xiaoArea, 1) + ' ×');
          ro.set('chip', (ch ? ch.name : b.chip) + ', ' + (b.flash || '?') + (b.psram ? ' + ' + b.psram + ' PSRAM' : ''));
        } else for (const k of ['name', 'size', 'area', 'times', 'chip']) ro.set(k, '—');
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x - 3 && p.x <= q.x + q.w + 3 && p.y >= q.y - 3 && p.y <= q.y + q.h + 3); if (h) { sel = h.id; loop.once(); } },
        p => hits.some(q => p.x >= q.x - 3 && p.x <= q.x + q.w + 3 && p.y >= q.y - 3 && p.y <= q.y + q.h + 3));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sx-antenna-range */
  const ANT = [['Tiny ceramic chip antenna (-2 dBi)', -2], ['PCB trace antenna (-1 dBi)', -1], ['External stick antenna (+2 dBi)', 2], ['External antenna (+5 dBi)', 5]];
  Hyper.sim('sx-antenna-range', {
    title: 'What a tiny antenna costs in range',
    blurb: `Signal strength falls with distance; the receiver needs a minimum (the dashed line). Where each curve meets that line is the range. Choose two antennas and compare. **The antenna gains and the detuning losses are teaching figures**, not measurements of any board: real boards vary by several dB, which is exactly the point of testing yours. Transmit power and the best sensitivity of each chip come from the catalogue; the other end of the link is assumed to have a 0 dBi antenna.

**Try this**
- Compare the **ceramic chip** with the **+2 dBi stick**: 4 dB, about a quarter of the range indoors.
- Add **detuning** to antenna A (a hand over it, a metal case): a few more dB, and the range halves.
- Raise **walls**: each wall takes 5 dB off both antennas, so the gap between them in metres shrinks even as the dB stay equal.
- Choose the **+5 dBi** antenna at full power and read the EIRP: in Europe 2.4 GHz is limited to 20 dBm.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.7, maxH: 500 });
      const chips = ['esp32-c3', 'esp32-s3', 'esp32-c6', 'esp32-c5'];
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(id => [E.chip(id).name, id]), value: 'esp32-c3' },
        { id: 'a', type: 'select', label: 'Antenna A', options: ANT, value: -2 },
        { id: 'b', type: 'select', label: 'Antenna B', options: ANT, value: 2 },
        { id: 'detA', label: 'Detuning of A (hand, case, battery)', min: 0, max: 12, step: 0.5, value: 0, unit: 'dB' },
        { id: 'detB', label: 'Detuning of B', min: 0, max: 12, step: 0.5, value: 0, unit: 'dB' },
        { id: 'env', type: 'select', label: 'Surroundings', options: [['open air (n = 2)', 2], ['inside, open rooms (n = 2.7)', 2.7], ['inside, many walls (n = 3.3)', 3.3]], value: 2.7 },
        { id: 'walls', label: 'Walls in the way', min: 0, max: 4, step: 1, value: 0 },
        { id: 'tx', label: 'Transmit power', min: 0, max: 21, step: 0.5, value: 18, unit: 'dBm' },
        { id: 'need', label: 'Signal needed at the receiver', min: -100, max: -60, step: 1, value: -90, unit: 'dBm' },
        { id: 'dist', label: 'Distance to look at', min: 1, max: 300, value: 20, unit: 'm', log: true, sig: 2 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['ra', 'Range with A'], ['rb', 'Range with B'], ['rat', 'A against B'], ['sa', 'Signal at that distance, A'], ['sb', 'Signal at that distance, B'], ['eirp', 'EIRP of A and B']]);
      const MAXD = 5000, YMIN = -110, YMAX = -20;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, ch = E.chip(v.chip);
        const base = { tx: v.tx, gr: 0, mhz: 2442, n: v.env, walls: v.walls, wallLoss: 5, sens: v.need };
        const gA = v.a - v.detA, gB = v.b - v.detB;
        const L = g => Object.assign({}, base, { gt: g });
        const rA = E.linkRange(L(gA)), rB = E.linkRange(L(gB));
        const sA = E.link(Object.assign(L(gA), { d: v.dist })), sB = E.link(Object.assign(L(gB), { d: v.dist }));
        // the plot
        const px = 46, py = 30, pw = st.W - px - 14, ph = st.H - py - 96;
        const X = d => px + Math.log10(clamp(d, 1, MAXD)) / Math.log10(MAXD) * pw, Y = r => py + (YMAX - clamp(r, YMIN, YMAX)) / (YMAX - YMIN) * ph;
        kit.label(c, 'Signal strength against distance (' + ch.name + ')', px, 12, { size: 12, weight: 650, color: C.text2 });
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (const d of [1, 10, 100, 1000]) { c.beginPath(); c.moveTo(X(d), py); c.lineTo(X(d), py + ph); c.stroke(); kit.label(c, d >= 1000 ? d / 1000 + ' km' : d + ' m', X(d), py + ph + 11, { size: 10, color: C.muted, align: 'center' }); }
        for (const r of [-100, -80, -60, -40]) { c.beginPath(); c.moveTo(px, Y(r)); c.lineTo(px + pw, Y(r)); c.stroke(); kit.label(c, String(r), px - 5, Y(r), { size: 10, color: C.muted, align: 'right' }); }
        kit.label(c, 'dBm', px - 5, py - 6, { size: 10, color: C.faint, align: 'right' });
        // the needed level
        c.strokeStyle = C.bad; c.lineWidth = 1.6; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(px, Y(v.need)); c.lineTo(px + pw, Y(v.need)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'needed: ' + v.need + ' dBm', px + pw - 2, Y(v.need) - 8, { size: 10, color: C.bad, align: 'right' });
        // the two curves
        const curve = (g, col) => {
          c.strokeStyle = col; c.lineWidth = 2.4; c.beginPath();
          for (let i = 0; i <= 160; i++) { const d = Math.pow(MAXD, i / 160), r = E.link(Object.assign(L(g), { d })).rx; if (i) c.lineTo(X(d), Y(r)); else c.moveTo(X(d), Y(r)); }
          c.stroke();
        };
        curve(gB, C.warn); curve(gA, C.accent);
        const mark = (r, col, name, dy) => { if (r <= MAXD && r >= 1) { c.strokeStyle = col; c.lineWidth = 1.2; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(r), Y(v.need)); c.lineTo(X(r), py + ph); c.stroke(); c.setLineDash([]); kit.dot(c, X(r), Y(v.need), 4, col); kit.label(c, name + ' ' + (r < 100 ? fmt(r, 0) : fmt(r, 0)) + ' m', clamp(X(r), px + 40, px + pw - 40), Y(v.need) + dy, { size: 10.5, weight: 650, color: col, align: 'center' }); } };
        mark(rB, C.warn, 'B', -22); mark(rA, C.accent, 'A', 22);
        // the distance cursor
        c.strokeStyle = C.text2; c.lineWidth = 1; c.beginPath(); c.moveTo(X(v.dist), py); c.lineTo(X(v.dist), py + ph); c.stroke();
        kit.label(c, fmt(v.dist, v.dist < 10 ? 1 : 0) + ' m', X(v.dist), py - 2, { size: 10, color: C.text2, align: 'center' });
        // the bars under the plot
        const by = py + ph + 26;
        kit.label(c, 'A', px, by + 12, { size: 12, weight: 700, color: C.accent });
        S.bars(c, px + 14, by, sA.rx, { w: 36, h: 22, label: Math.round(sA.rx) + ' dBm' });
        kit.label(c, 'B', px + 120, by + 12, { size: 12, weight: 700, color: C.warn });
        S.bars(c, px + 134, by, sB.rx, { w: 36, h: 22, label: Math.round(sB.rx) + ' dBm' });
        kit.label(c, 'at ' + fmt(v.dist, v.dist < 10 ? 1 : 0) + ' m', px + 215, by + 10, { size: 11, color: C.muted });
        const fm = r => (r > MAXD ? 'over ' + MAXD + ' m' : fmt(r, r < 10 ? 1 : 0) + ' m');
        ro.set('ra', fm(rA)); ro.set('rb', fm(rB));
        ro.set('rat', fmt(100 * rA / Math.max(rB, 1e-9), 0) + ' % of B');
        ro.set('sa', fmt(sA.rx, 0) + ' dBm' + (sA.ok ? '' : ' (too weak)'));
        ro.set('sb', fmt(sB.rx, 0) + ' dBm' + (sB.ok ? '' : ' (too weak)'));
        const eA = v.tx + gA, eB = v.tx + gB;
        ro.set('eirp', fmt(eA, 1) + ' / ' + fmt(eB, 1) + ' dBm' + (Math.max(eA, eB) > 20 ? '  (over 20: lower the power)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sx-ladder */
  const LADDER = [['A', 470], ['B', 2200], ['C', 6800], ['D', 15000]];
  Hyper.sim('sx-ladder', {
    title: 'A resistor ladder: four buttons on one pin',
    blurb: `A pull-up holds the analogue pad high; each button connects it to ground through its own resistor, so the pad's voltage tells which one is down. The scale on the right shows every level, the ADC limit of the chip (readings above it are clipped), the mid-point thresholds, and the noise band around the current reading. **Click a button** in the circuit to press it.

**Try this**
- With the **C3** and a **4.7 kΩ** pull-up, D reads 2.5 V: the same as "no button", because the ADC clips. Raise the pull-up.
- Raise the **noise** until the band touches a threshold: the program would misread.
- Press **A and B together**: the parallel resistance is lower than either, so the reading lands at or below A's level and nothing says two buttons were down.
- Switch the chip to the **C6**, whose converter reads up to 3.3 V: the top level is clear again.`,
    mount(box, kit) {
      const E = kit.esp, SC = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 310, maxH: 500 });
      let hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip (ADC range)', options: [['ESP32-C3: reads up to 2.5 V', 'esp32-c3'], ['ESP32-S3: up to 3.1 V', 'esp32-s3'], ['ESP32-C6: up to 3.3 V', 'esp32-c6']], value: 'esp32-c3' },
        { id: 'rp', type: 'select', label: 'Pull-up resistor', options: [['4.7 kΩ', 4700], ['10 kΩ', 10000], ['22 kΩ', 22000]], value: 10000 },
        { id: 'press', type: 'select', label: 'Pressed', options: [['no button', 'none'], ['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D'], ['A and B together', 'AB']], value: 'none' },
        { id: 'noise', label: 'ADC noise', min: 0, max: 400, step: 5, value: 40, unit: 'mV' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['pad', 'Voltage on the pad'], ['read', 'The ADC reads'], ['counts', 'Counts (12 bit)'], ['dec', 'Decoded as'], ['margin', 'Margin to a threshold'], ['say', 'Verdict']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, vcc = 3.3, rp = v.rp;
        const vfs = (E.ADC_RANGE[v.chip] && E.ADC_RANGE[v.chip]['11'] ? E.ADC_RANGE[v.chip]['11'][1] : 3.3);
        const levels = LADDER.map(([k, r]) => ({ k, v: E.divider(vcc, rp, r) })).concat([{ k: 'none', v: vcc }]);
        levels.forEach(l => { l.read = Math.min(l.v, vfs); });
        const pressed = v.press === 'none' ? [] : v.press.split('');
        let vp = vcc;
        if (pressed.length) { const g = pressed.reduce((a, k) => a + 1 / LADDER.find(q => q[0] === k)[1], 0); vp = E.divider(vcc, rp, 1 / g); }
        const read = Math.min(vp, vfs);
        // decode: the nearest level in the ADC's own range
        let best = levels[0];
        for (const l of levels) if (Math.abs(l.read - read) < Math.abs(best.read - read)) best = l;
        const sorted = levels.slice().sort((a, b) => a.read - b.read), th = [];
        for (let i = 0; i < sorted.length - 1; i++) th.push((sorted[i].read + sorted[i + 1].read) / 2);
        const margin = th.length ? Math.min(...th.map(t => Math.abs(t - read))) : 0, noiseV = v.noise / 1000;
        const want = pressed.length === 1 ? pressed[0] : pressed.length ? '?' : 'none';
        const clipDup = levels.some((l, i) => levels.some((m, j) => j > i && Math.abs(l.read - m.read) < 0.005));
        // the circuit
        const narrow = st.W < 500, nx = narrow ? 58 : 82, ny = 112, bx0 = narrow ? 84 : 122, step = narrow ? 36 : clamp((st.W * 0.6 - bx0 - 20) / 3, 34, 58), gy = 252;
        c.strokeStyle = C.text; c.lineWidth = 2;
        SC.wire(c, [[18, 24], [nx + 3 * step + 70, 24]], { color: C.text });
        kit.label(c, '3V3', 8, 24, { size: 11, weight: 650, align: 'left', baseline: 'bottom' });
        SC.resistor(c, nx, 24, nx, ny - 6, { label: 'Rp', value: kit.eng(rp, 'Ω') });
        SC.wire(c, [[nx, ny - 6], [nx, ny]]);
        SC.node(c, nx, ny);
        const bxs = LADDER.map((_, i) => bx0 + 18 + i * step);
        SC.wire(c, [[nx, ny], [bxs[3], ny]]);
        kit.label(c, 'D1', 8, ny - 12, { size: 11.5, weight: 650, align: 'left' });
        kit.label(c, 'ADC pad', 8, ny + 12, { size: 9.5, color: C.muted, align: 'left' });
        SC.wire(c, [[44, ny], [nx, ny]]);
        hits = [];
        LADDER.forEach(([k, r], i) => {
          const x = bxs[i], on = pressed.includes(k);
          SC.node(c, x, ny);
          SC.wire(c, [[x, ny], [x, 132]]);
          SC.switch(c, x, 132, x, 172, { closed: on, label: k, color: on ? C.accent : C.text });
          SC.wire(c, [[x, 172], [x, 184]]);
          SC.resistor(c, x, 184, x, 232, { label: '', value: narrow ? '' : kit.eng(r, 'Ω') });
          SC.wire(c, [[x, 232], [x, gy]]);
          hits.push({ x: x - 16, y: 128, w: 32, h: 48, k });
        });
        SC.wire(c, [[bxs[0], gy], [bxs[3], gy]]);
        SC.ground(c, (bxs[0] + bxs[3]) / 2, gy);
        if (narrow) kit.label(c, LADDER.map(([k, r]) => k + ' ' + kit.eng(r, 'Ω')).join('   '), 8, gy + 26, { size: 10.5, color: C.muted, align: 'left' });
        // the scale
        const sx = bxs[3] + (narrow ? 30 : 62), sw = Math.max(70, st.W - sx - 8), top = 36, hgt = st.H - top - 26, Vmax = 3.5;
        const Y = val => top + (1 - clamp(val, 0, Vmax) / Vmax) * hgt;
        kit.label(c, narrow ? 'pad voltage' : 'the pad against the ADC', sx, 14, { size: 11.5, weight: 650, color: C.text2, align: 'left' });
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(sx + 26, top); c.lineTo(sx + 26, top + hgt); c.stroke();
        for (const t of [0, 1, 2, 3]) { kit.label(c, t + ' V', sx + 22, Y(t), { size: 9.5, color: C.muted, align: 'right' }); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(sx + 26, Y(t)); c.lineTo(sx + sw, Y(t)); c.stroke(); }
        c.fillStyle = C.dark ? 'rgba(229,72,77,.16)' : 'rgba(200,40,50,.10)'; c.fillRect(sx + 26, Y(Vmax), sw - 26, Y(vfs) - Y(Vmax));
        kit.label(c, 'clipped', sx + 30, Y(Vmax) + 9, { size: 9.5, color: C.bad, align: 'left' });
        c.strokeStyle = C.bad; c.lineWidth = 1.4; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(sx + 26, Y(vfs)); c.lineTo(sx + sw, Y(vfs)); c.stroke(); c.setLineDash([]);
        for (const t of th) { c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(sx + 26, Y(t)); c.lineTo(sx + sw - 24, Y(t)); c.stroke(); c.setLineDash([]); }
        levels.forEach(l => { c.fillStyle = C.text2; c.fillRect(sx + 30, Y(l.read) - 1.5, sw - 60, 3); kit.label(c, l.k === 'none' ? '–' : l.k, sx + sw - 8, Y(l.read), { size: 11, weight: 700, align: 'right' }); });
        c.fillStyle = C.dark ? 'rgba(224,160,48,.30)' : 'rgba(224,160,48,.30)'; c.fillRect(sx + 28, Y(read + noiseV), sw - 40, Math.max(2, Y(read - noiseV) - Y(read + noiseV)));
        c.strokeStyle = C.accent; c.lineWidth = 2.6; c.beginPath(); c.moveTo(sx + 26, Y(read)); c.lineTo(sx + sw - 24, Y(read)); c.stroke();
        kit.label(c, fmt(read, 2) + ' V', sx + 30, Y(read) - 9, { size: 10.5, weight: 700, color: C.accent, align: 'left' });
        // the numbers
        ro.set('pad', fmt(vp, 2) + ' V');
        ro.set('read', fmt(read, 2) + ' V' + (vp > vfs ? ' (clipped)' : ''));
        ro.set('counts', String(E.adcCounts(read, 12, vfs)) + ' of 4095');
        ro.set('dec', pressed.length > 1 ? (best.k === 'none' ? 'no button' : 'button ' + best.k) : best.k === 'none' ? 'no button' : 'button ' + best.k);
        ro.set('margin', fmt(margin * 1000, 0) + ' mV (noise ± ' + v.noise + ')');
        const right = want !== '?' && best.k === want;
        ro.set('say', clipDup ? 'two levels clip to the same reading' : margin <= noiseV ? 'noise can cause a misread' : pressed.length > 1 ? (right ? 'two buttons: do not rely on it' : 'two buttons read as ' + (best.k === 'none' ? 'nothing' : best.k)) : right ? 'reads correctly' : 'misread');
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { ctl.set('press', ctl.values.press === h.k ? 'none' : h.k, true); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sx-battery */
  const RES = [['47 kΩ', 47e3], ['100 kΩ', 100e3], ['220 kΩ', 220e3], ['470 kΩ', 470e3], ['1 MΩ', 1e6], ['2.2 MΩ', 2.2e6]];
  Hyper.sim('sx-battery', {
    title: 'Reading a lithium cell through a divider',
    blurb: `A lithium cell runs from 4.2 V to about 3.0 V, above what the chip's converter can read, so a divider brings it down to the pad. But the divider sits across the cell for ever. The picture shows what reaches the pad, how the cell's charge looks on a typical curve, and how the divider's drain compares with the chip's own sleep current (from the catalogue).

**Try this**
- Start with two **470 kΩ** and read the pin voltage against the ADC range. Pick **47 kΩ** and see the drain dwarf the chip's sleep current.
- Make **R2** much smaller than **R1** to read a low voltage, or much larger to push the pin past the ADC limit: it clips.
- Tick **switch the divider off between readings**: the drain disappears from the sleep budget.
- Untick the **self-discharge** and watch a small drain matter more. With it on, a bigger cell loses more by itself, so the same divider matters less.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym, SC = kit.schem;
      const st = kit.stage(box.stage, (box.stage.clientWidth || 760) < 500 ? { aspect: 1.25, minH: 440, maxH: 520 } : { aspect: 0.62, minH: 240, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'vbat', label: 'Cell voltage', min: 3.0, max: 4.2, step: 0.01, value: 3.9, unit: 'V' },
        { id: 'chip', type: 'select', label: 'Chip', options: [['ESP32-C3', 'esp32-c3'], ['ESP32-S3', 'esp32-s3'], ['ESP32-C6', 'esp32-c6']], value: 'esp32-c3' },
        { id: 'r1', type: 'select', label: 'R1 (upper)', options: RES, value: 470e3 },
        { id: 'r2', type: 'select', label: 'R2 (lower)', options: RES, value: 470e3 },
        { id: 'cap', type: 'check', label: '100 nF across R2', value: true },
        { id: 'sw', type: 'check', label: 'Switch the divider off between readings', value: false },
        { id: 'mah', type: 'select', label: 'Cell capacity', options: [['100 mAh', 100], ['500 mAh', 500], ['1000 mAh', 1000], ['2000 mAh', 2000]], value: 1000 },
        { id: 'self', type: 'check', label: 'Count self-discharge (3 % a month)', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['pin', 'Voltage at the pad'], ['read', 'The ADC reads'], ['est', 'Cell estimate (step)'], ['soc', 'Charge, typical curve'], ['drain', 'Divider drain'], ['sleep', 'Sleep current with it'], ['life', 'Sleep life, without / with'], ['src', 'Source resistance, settling']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, ch = E.chip(v.chip);
        const range = E.ADC_RANGE[v.chip] && E.ADC_RANGE[v.chip]['11'] ? E.ADC_RANGE[v.chip]['11'][1] : 3.3;
        const vpin = E.divider(v.vbat, v.r1, v.r2), clipped = vpin > range, read = Math.min(vpin, range);
        const ratio = (v.r1 + v.r2) / v.r2, est = read * ratio, step = E.adcLsb(12, range) * ratio;
        const drainUa = v.sw ? 0 : v.vbat / (v.r1 + v.r2) * 1e6, sleepUa = ch.sleepUa != null ? ch.sleepUa : 5;
        const sd = v.self ? 0.03 : 0, soc = E.lipoSoc(v.vbat);
        const l0 = E.batteryLife(v.mah, sleepUa / 1000, { selfDischarge: sd }), l1 = E.batteryLife(v.mah, (sleepUa + drainUa) / 1000, { selfDischarge: sd });
        const rsrc = v.r1 * v.r2 / (v.r1 + v.r2), tau = rsrc * 100e-9;
        // the circuit
        const x = 60;
        kit.label(c, 'BAT+ pad', x, 14, { size: 11, weight: 650, align: 'center' });
        SC.wire(c, [[x, 22], [x, 34]]);
        SC.resistor(c, x, 34, x, 92, { label: 'R1', value: kit.eng(v.r1, 'Ω') });
        SC.wire(c, [[x, 92], [x, 104]]);
        SC.node(c, x, 104);
        SC.resistor(c, x, 104, x, 162, { label: 'R2', value: kit.eng(v.r2, 'Ω') });
        SC.wire(c, [[x, 162], [x, 178]]);
        SC.ground(c, x, 178);
        SC.wire(c, [[x, 104], [118, 104]]);
        if (v.cap) { SC.wire(c, [[118, 104], [118, 120]]); SC.capacitor(c, 118, 120, 118, 150, { label: '', value: '100 nF' }); SC.wire(c, [[118, 150], [118, 178]]); SC.wire(c, [[x, 178], [118, 178]]); }
        SC.wire(c, [[118, 104], [150, 104]]);
        S.box(c, 150, 86, 58, 36, { label: 'D1', sub: 'ADC', color: kit.hue(8) });
        kit.label(c, fmt(vpin, 2) + ' V', 130, 94, { size: 10.5, weight: 700, color: clipped ? C.bad : C.accent });
        // the right-hand panel (under the circuit on a narrow stage)
        const narrow = st.W < 500, oy = narrow ? 196 : 0, x0 = narrow ? 10 : Math.max(232, st.W * 0.4), pw = st.W - x0 - 10;
        kit.label(c, 'Pad voltage against the ADC range', x0, oy + 14, { size: 11.5, weight: 650, color: C.text2, align: 'left' });
        const Vm = 4.4, X = val => x0 + clamp(val, 0, Vm) / Vm * pw;
        c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(x0, oy + 26, pw, 14);
        c.fillStyle = C.dark ? 'rgba(34,179,122,.35)' : 'rgba(34,179,122,.28)'; c.fillRect(x0, oy + 26, X(range) - x0, 14);
        c.strokeStyle = C.bad; c.lineWidth = 1.6; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(range), oy + 22); c.lineTo(X(range), oy + 46); c.stroke(); c.setLineDash([]);
        const limHalf = 40;
        kit.label(c, 'ADC limit ' + fmt(range, 1) + ' V', clamp(X(range), x0 + limHalf, x0 + pw - limHalf), oy + 56, { size: 10, color: C.bad, align: 'center' });
        c.fillStyle = clipped ? C.bad : C.accent; c.beginPath(); c.moveTo(X(vpin), oy + 24); c.lineTo(X(vpin) - 5, oy + 14); c.lineTo(X(vpin) + 5, oy + 14); c.closePath(); c.fill();
        S.battery(c, x0, oy + 76, 66, 26, soc, { label: Math.round(soc * 100) + ' %', charging: false });
        kit.label(c, 'charge on a typical curve', x0 + 80, oy + 89, { size: 10.5, color: C.muted, align: 'left' });
        // the sleep budget
        kit.label(c, 'Sleep current', x0, oy + 134, { size: 11.5, weight: 650, color: C.text2, align: 'left' });
        const tot = sleepUa + drainUa, scaleMax = Math.max(tot, 20);
        c.fillStyle = kit.hue(212, 0.7); c.fillRect(x0, oy + 146, sleepUa / scaleMax * pw, 16);
        c.fillStyle = C.warn; c.fillRect(x0 + sleepUa / scaleMax * pw, oy + 146, drainUa / scaleMax * pw, 16);
        kit.label(c, 'chip ' + fmt(sleepUa, 0) + ' µA', x0, oy + 176, { size: 10.5, color: C.muted, align: 'left' });
        kit.label(c, 'divider ' + fmt(drainUa, 1) + ' µA', x0 + pw, oy + 176, { size: 10.5, color: drainUa > sleepUa ? C.bad : C.warn, align: 'right' });
        const lifeText = l => (l.days >= 730 ? fmt(l.years, 1) + ' years' : fmt(l.days, 0) + ' days');
        kit.label(c, 'Asleep, no divider: ' + lifeText(l0), x0, oy + 198, { size: 11, color: C.text2, align: 'left' });
        kit.label(c, 'Asleep, with it: ' + lifeText(l1), x0, oy + 214, { size: 11, color: C.text2, align: 'left' });
        // the numbers
        ro.set('pin', fmt(vpin, 2) + ' V' + (clipped ? ' (above the ADC limit)' : ''));
        ro.set('read', fmt(read, 2) + ' V');
        ro.set('est', fmt(est, 2) + ' V (±' + fmt(step * 1000, 1) + ' mV)');
        ro.set('soc', Math.round(soc * 100) + ' %');
        ro.set('drain', fmt(drainUa, 1) + ' µA');
        ro.set('sleep', fmt(sleepUa + drainUa, 1) + ' µA (chip ' + fmt(sleepUa, 0) + ')');
        ro.set('life', lifeText(l0) + ' / ' + lifeText(l1));
        ro.set('src', fmt(rsrc / 1000, 0) + ' kΩ, ' + (v.cap ? fmt(5 * tau * 1000, 0) + ' ms to settle' : 'needs the capacitor'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
