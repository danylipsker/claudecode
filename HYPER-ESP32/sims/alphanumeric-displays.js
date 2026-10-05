/* HYPER-ESP32 · sims/alphanumeric-displays.js
 *
 * Simulations of "LEDs, digits and letters" (topic code ad).
 *
 *   ad-chooser    which display fits a need: what it must show, pins, distance, light, battery
 *   ad-seg        one seven-segment digit: click segments, see the byte, the bit order and the pin levels
 *   ad-mux        multiplexing slowed down: the scan, what the eye sees, and what a blocked program does
 *   ad-lcd        a character LCD with its memory: text, cursor, contrast, the odd order of a 20 x 4
 *   ad-backpack   the four expander bytes (and the I2C traffic) behind one character on a PCF8574 backpack
 *   ad-chars      the custom-character editor: eight slots, shared by every cell that shows them
 *   ad-format     a number printed naively, with a fixed width and with care: stale digits, jumps, flicker
 *   ad-menu       a two-line menu driven by three buttons, as a state machine
 *   ad-matrix     a chain of 8 x 8 modules scrolling text, with the current it needs
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- helpers */
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const hex2 = v => '0x' + (v & 255).toString(16).toUpperCase().padStart(2, '0');
  const popcount = v => { let n = 0; for (let x = v & 255; x; x >>= 1) n += x & 1; return n; };
  const printable = c => c >= 32 && c < 127;
  const SEGNAMES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'dp'];
  // a one-line text field in the side panel (the controls kit has none): -> { get, set }
  function textBox(box, label, value, maxLen, onInput) {
    const wrap = document.createElement('div');
    wrap.className = 'ctl';
    const head = document.createElement('div');
    head.className = 'cl';
    const name = document.createElement('span');
    name.textContent = label;
    head.appendChild(name);
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'inp';
    inp.value = value;
    inp.maxLength = maxLen;
    inp.spellcheck = false;
    inp.oninput = () => onInput(inp.value);
    wrap.appendChild(head);
    wrap.appendChild(inp);
    box.side.appendChild(wrap);
    return { get: () => inp.value, set: v => { inp.value = v; } };
  }
  // text cut to fit a number of pixels at a font size
  const fit = (s, px, size) => { s = String(s); const n = Math.max(4, Math.floor(px / (size * 0.56))); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  // edges clipped to a window: S.wave draws a slanted first segment otherwise
  function clipEdges(edges, t0, t1) {
    let lv = 0;
    for (const e of edges) { if (e[0] <= t0) lv = e[1]; else break; }
    const out = [[t0, lv]];
    for (const e of edges) if (e[0] > t0 && e[0] <= t1) out.push(e);
    return out;
  }

  /* ================================================================ ad-chooser */
  Hyper.sim('ad-chooser', {
    title: 'Which display fits?',
    blurb: `Say what the display must do and where it will live; the list sorts itself into displays that fit (the simplest first) and displays that are ruled out, with the reason. The figures are typical for common modules and rough: check the datasheet of yours.

**Try this**
- Ask for **a number**, read from **across a room**: the LED digits and the matrix fit; the character LCD does not.
- Ask for **pictures or colour** with only **two pins** to spare: nothing fits, and the reasons say what to give up.
- Choose **direct sunshine**: backlit screens drop out and e-paper rises.
- Choose **a battery for a year** and see what survives; then tick **lit only on demand**.`,
    mount(box, kit) {
      const G = kit.gfx;
      const st = kit.stage(box.stage, { height: 8 * 46 + 46, minH: 380, maxH: 460 });
      // cap: 0 states and levels, 1 numbers, 2 text, 3 simple graphics and icons, 4 pictures and colour.
      // dist: 1 a desk (about 1 m), 2 across a room (about 3 m), 3 far (about 10 m).  sun: 0 poor, 1 fair, 2 good.  mA: typical, with the backlight or lit.
      const CAND = [
        { id: 'led', name: 'Indicator LEDs, a row of five', cap: 0, pins: 3, mA: 15, sun: 1, dark: true, dist: 3, volts: '3.3 V' },
        { id: 'tm1637-4', cap: 1, pins: 2, mA: 30, sun: 1, dark: true, dist: 2 },
        { id: 'max7219-8x8', cap: 3, pins: 3, mA: 80, sun: 1, dark: true, dist: 2 },
        { id: 'hd44780-16x2', cap: 2, pins: 2, mA: 25, sun: 1, dark: true, dist: 1 },
        { id: 'hd44780-20x4', cap: 2, pins: 2, mA: 40, sun: 1, dark: true, dist: 1 },
        { id: 'ssd1306-128x64', cap: 3, pins: 2, mA: 20, sun: 0, dark: true, dist: 1 },
        { id: 'ili9341-320x240', cap: 4, pins: 6, mA: 100, sun: 0, dark: true, dist: 2 },
        { id: 'epd-290', cap: 3, pins: 6, mA: 0.02, sun: 2, dark: false, dist: 1, hold: true }
      ];
      for (const c of CAND) { const d = G.display(c.id); if (d) { c.name = d.name; c.volts = d.volts; } }
      const NEED = ['an on/off state or a level', 'a number', 'short text and menus', 'simple graphs and icons', 'pictures or colour'];
      const DIST = ['', 'a desk', 'across a room', 'far away'];
      const ctl = kit.controls(box.side, [
        { id: 'need', type: 'select', label: 'It must show', options: [['An on/off state or a level', 0], ['A number', 1], ['Short text and menus', 2], ['Simple graphs and icons', 3], ['Pictures or colour', 4]], value: 1 },
        { id: 'pins', label: 'Pins to spare', min: 1, max: 8, step: 1, value: 4 },
        { id: 'dist', type: 'select', label: 'Read from', options: [['A desk (about 1 m)', 1], ['Across a room (about 3 m)', 2], ['Far away (about 10 m)', 3]], value: 1 },
        { id: 'light', type: 'select', label: 'In', options: [['A dim room', 'dark'], ['A bright room', 'indoor'], ['Direct sunshine', 'sun']], value: 'indoor' },
        { id: 'power', type: 'select', label: 'Power', options: [['Mains or USB', 'mains'], ['Battery, a few weeks', 'weeks'], ['Battery, a year', 'year']], value: 'mains' },
        { id: 'demand', type: 'check', label: 'Lit only on demand (about 2 % of the time)', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['best', 'Simplest that fits'], ['fits', 'Displays that fit'], ['out', 'Ruled out']]);
      const verdicts = () => {
        const v = ctl.values, limit = v.power === 'mains' ? Infinity : v.power === 'weeks' ? 2 : 0.2;
        return CAND.map(c => {
          const why = [], avg = c.hold ? c.mA : c.mA * (v.demand ? 0.02 : 1);
          if (c.cap < v.need) why.push('cannot show ' + NEED[v.need]);
          if (c.pins > v.pins) why.push('needs ' + c.pins + ' pins');
          if (c.dist < v.dist) why.push('too small to read from ' + DIST[v.dist]);
          if (v.light === 'sun' && c.sun === 0) why.push('washes out in sunshine');
          if (v.light === 'dark' && !c.dark) why.push('needs light to be read');
          if (avg > limit) why.push('draws about ' + kit.fmt(avg, 2) + ' mA, over the budget');
          const cost = c.pins + 2 * c.cap + 1.5 * Math.log10(1 + avg);
          return { c, why, avg, cost, fits: !why.length };
        }).sort((a, b) => (a.fits !== b.fits ? (a.fits ? -1 : 1) : a.fits ? a.cost - b.cost : a.why.length - b.why.length || a.cost - b.cost));
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), M = 12, rows = verdicts(), nFit = rows.filter(r => r.fits).length;
        kit.label(c, 'Fits first, simplest at the top', M, 14, { size: 12, color: C.muted, weight: 600 });
        const rh = Math.min(46, (st.H - 36) / rows.length);
        rows.forEach((r, i) => {
          const y = 30 + i * rh, best = r.fits && i === 0;
          c.fillStyle = r.fits ? (C.dark ? 'rgba(34,179,122,.12)' : 'rgba(34,179,122,.10)') : (C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.035)');
          c.fillRect(M - 4, y, st.W - 2 * M + 8, rh - 4);
          if (best) { c.strokeStyle = C.ok; c.lineWidth = 1.6; c.strokeRect(M - 4, y, st.W - 2 * M + 8, rh - 4); }
          const tag = best ? 'best fit' : r.fits ? 'fits' : 'ruled out';
          kit.label(c, tag, st.W - M, y + 13, { size: 11, color: r.fits ? C.ok : C.bad, weight: 650, align: 'right' });
          kit.label(c, fit(r.c.name, st.W - 2 * M - 80, 12.5), M, y + 13, { size: 12.5, weight: 650, color: r.fits ? C.text : C.muted });
          const facts = r.c.pins + (r.c.pins === 1 ? ' pin' : ' pins') + ' · about ' + kit.fmt(r.avg, 2) + ' mA' + (ctl.values.demand && !r.c.hold ? ' on average' : '') + ' · ' + r.c.volts + ' · reads from ' + DIST[r.c.dist];
          kit.label(c, fit(r.fits ? facts : r.why.join(' · '), st.W - 2 * M, 11), M, y + 30, { size: 11, color: r.fits ? C.muted : C.bad });
        });
        ro.set('best', nFit ? rows[0].c.name : 'nothing fits');
        ro.set('fits', String(nFit));
        ro.set('out', String(rows.length - nFit));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ad-seg */
  // where the segments of one digit are, in the proportions G.drawSeg7 uses
  function segGeom(x, y, h) {
    const w = h * 0.5, t = h * 0.1, cx = x + w / 2;
    return {
      w, t, h,
      segs: [
        { cx, cy: y + t / 2, hor: true }, { cx: x + w - t / 2, cy: y + h * 0.25 + t / 4 }, { cx: x + w - t / 2, cy: y + h * 0.75 - t / 4 }, { cx, cy: y + h - t / 2, hor: true },
        { cx: x + t / 2, cy: y + h * 0.75 - t / 4 }, { cx: x + t / 2, cy: y + h * 0.25 + t / 4 }, { cx, cy: y + h / 2, hor: true }
      ],
      dp: { cx: x + w + h * 0.08, cy: y + h - t / 2 }
    };
  }
  Hyper.sim('ad-seg', {
    title: 'One digit, eight bits',
    blurb: `Click the segments, or choose a character. The row of boxes is the byte a program writes: one bit per segment, lit when the bit is 1 (the bit order and the type of digit are yours to change).

**Try this**
- Choose **8** and **1**, and look at which bits are set. Add the **decimal point**: only bit 7 changes.
- Switch to **common anode**: the pin levels are the byte turned upside down, and the digit looks the same.
- Switch the **bit order** to the MAX7219's: the same digit gives a different byte, so a table copied from another chip's code shows nonsense.
- Click segments to draw a pattern of your own and read its byte.`,
    mount(box, kit) {
      const G = kit.gfx, S = kit.esym;
      const narrow = (box.stage.clientWidth || 700) < 560;
      const st = kit.stage(box.stage, { aspect: narrow ? 1.02 : 0.56, minH: narrow ? 400 : 310, maxH: 470 });
      const CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'b', 'C', 'd', 'E', 'F', 'H', 'L', 'P', 'U', '-'];
      let mask = G.seg7('7'), dp = false, geo = null;
      const ctl = kit.controls(box.side, [
        { id: 'ch', type: 'select', label: 'Show the character', options: [['(your own pattern)', '']].concat(CHARS.map(c => [c, c])), value: '7' },
        { id: 'dp', type: 'check', label: 'Decimal point', value: false },
        { id: 'wire', type: 'select', label: 'Type of digit', options: [['Common cathode: a 1 lights a segment', 'cc'], ['Common anode: a 0 lights a segment', 'ca']], value: 'cc' },
        { id: 'order', type: 'select', label: 'Bit order', options: [['a is bit 0 (TM1637, most tables)', 'a'], ['a is bit 6 (MAX7219 raw)', 'm']], value: 'a' },
        { type: 'buttons', items: [{ id: 'next', label: 'Next character', primary: true }, { id: 'all', label: 'All on' }, { id: 'none', label: 'All off' }] }
      ], (id, v) => {
        if (id === 'ch') { if (v) mask = G.seg7(v) & 0x7F; }
        else if (id === 'dp') dp = !!v;
        else if (id === 'next') { const i = (CHARS.indexOf(ctl.values.ch) + 1) % CHARS.length; ctl.set('ch', CHARS[i]); mask = G.seg7(CHARS[i]) & 0x7F; }
        else if (id === 'all') { mask = 0x7F; dp = true; ctl.set('ch', ''); ctl.set('dp', true); }
        else if (id === 'none') { mask = 0; dp = false; ctl.set('ch', ''); ctl.set('dp', false); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['segs', 'Segments lit'], ['byte', 'Byte for the program'], ['hex', 'In hex'], ['pins', 'Pin levels'], ['looks', 'Looks like']]);
      const bitOf = (seg, order) => (seg === 7 ? 7 : order === 'a' ? seg : 6 - seg);
      const bin8 = v => (v & 255).toString(2).padStart(8, '0');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12;
        const order = ctl.values.order, ca = ctl.values.wire === 'ca';
        let byte = 0;
        for (let s = 0; s < 7; s++) if ((mask >> s) & 1) byte |= 1 << bitOf(s, order);
        if (dp) byte |= 0x80;
        const pins = ca ? (~byte) & 0xFF : byte;
        // the digit
        const dh = narrow ? Math.min(150, H * 0.34) : Math.min(H * 0.62, 190), dx = narrow ? (W - dh * 0.5) / 2 : M + 44, dy = narrow ? 24 : 34;
        const hw = dh * 0.5;
        c.fillStyle = '#12060a';
        c.beginPath(); if (c.roundRect) c.roundRect(dx - dh * 0.2, dy - dh * 0.14, hw + dh * 0.5, dh * 1.28, 8); else c.rect(dx - dh * 0.2, dy - dh * 0.14, hw + dh * 0.5, dh * 1.28); c.fill();
        G.drawSeg7(c, [{ seg: mask & 0x7F, dp }], dx, dy, dh, { color: '#ff3b30', off: 'rgba(255,60,48,.16)' });
        geo = segGeom(dx, dy, dh);
        const ls = clamp(dh * 0.085, 9, 13);
        geo.segs.forEach((g, i) => {
          const on = (mask >> i) & 1;
          const lx = g.hor ? g.cx : g.cx + (i === 1 || i === 2 ? 1 : -1) * geo.t * 1.7, ly = g.hor ? g.cy + (i === 0 ? -1 : 1) * geo.t * 1.5 : g.cy;
          kit.label(c, SEGNAMES[i], lx, ly, { size: ls, color: on ? C.accent : C.faint, weight: 650, align: 'center' });
        });
        kit.label(c, 'dp', geo.dp.cx + geo.t * 0.5, geo.dp.cy + geo.t * 1.5, { size: ls, color: dp ? C.accent : C.faint, weight: 650, align: 'center' });
        // the bits
        const cell = narrow ? clamp(Math.floor((W - 2 * M - 8) / 8), 20, 30) : clamp(Math.floor((W - dx - hw - dh * 0.6 - 3 * M) / 8), 22, 30);
        const bx = narrow ? (W - 8 * cell) / 2 : W - M - 8 * cell, by = narrow ? dy + dh * 1.28 + 50 : 52;
        const lab = new Array(8);
        for (let s = 0; s < 8; s++) lab[bitOf(s, order)] = SEGNAMES[s];
        const labels = [7, 6, 5, 4, 3, 2, 1, 0].map(b => lab[b]);
        kit.label(c, 'byte the program writes (segment letter under each bit)', bx, by - 14, { size: 11, color: C.muted, weight: 600 });
        S.bits(c, bx, by, byte, { n: 8, cell, labels });
        kit.label(c, ca ? 'levels on the pins (common anode: inverted)' : 'levels on the pins (common cathode: the same)', bx, by + cell + 36, { size: 11, color: C.muted, weight: 600 });
        S.bits(c, bx, by + cell + 50, pins, { n: 8, cell, color: kit.hue(150, 0.9) });
        kit.label(c, 'bit 7', bx + cell / 2, by + 2 * cell + 66, { size: 10, color: C.faint, align: 'center' });
        kit.label(c, 'bit 0', bx + 7.5 * cell, by + 2 * cell + 66, { size: 10, color: C.faint, align: 'center' });
        kit.label(c, 'click a segment to switch it', M, H - 12, { size: 11, color: C.faint });
        // the numbers
        const lit = SEGNAMES.filter((n, i) => (i < 7 ? (mask >> i) & 1 : dp));
        let like = '—';
        for (const k of Object.keys(G.SEG7)) if (G.SEG7[k] === (mask & 0x7F) && k !== '°' && k !== '=' && k.length === 1) { like = k === ' ' ? 'blank' : k; break; }
        if (mask === 0) like = 'blank';
        ro.set('segs', lit.length ? lit.join(' ') : 'none');
        ro.set('byte', '0b' + bin8(byte));
        ro.set('hex', hex2(byte));
        ro.set('pins', '0b' + bin8(pins) + '  ' + hex2(pins));
        ro.set('looks', like);
      }, box.stage);
      const hitAt = p => {
        if (!geo) return -1;
        for (let i = 0; i < 7; i++) {
          const g = geo.segs[i];
          const ok = g.hor ? Math.abs(p.x - g.cx) <= geo.w / 2 - geo.t * 0.4 && Math.abs(p.y - g.cy) <= geo.t * 1.2 : Math.abs(p.x - g.cx) <= geo.t * 1.2 && Math.abs(p.y - g.cy) <= geo.h * 0.25 - geo.t * 0.2;
          if (ok) return i;
        }
        if (Math.hypot(p.x - geo.dp.cx, p.y - geo.dp.cy) <= geo.t * 1.4) return 7;
        return -1;
      };
      kit.click(st, p => {
        const i = hitAt(p);
        if (i < 0) return;
        if (i === 7) { dp = !dp; ctl.set('dp', dp); } else { mask ^= 1 << i; ctl.set('ch', ''); }
        loop.once();
      }, p => hitAt(p) >= 0);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ad-mux */
  Hyper.sim('ad-mux', {
    title: 'Multiplexing, slowed down',
    blurb: `Four digits share eight segment wires and take turns. The **top row** shows what the pins do at this instant; the **strip** shows the four digit-select lines; the **bottom row** is what the eye sees, which averages the last 30 milliseconds.

**Try this**
- Slow the **time per digit** to 50 ms: you see the digits taking turns. Speed it up and they blend into one steady number.
- Lower the **peak current** at 2 ms per digit: the display dims, because each digit is lit only a quarter of the time.
- Let the **ESP32 scan** and add a **blocking call** of 300 ms: one digit freezes lit, with the full pulse current running through it, and the others go dark.
- Choose **a driver chip**: the same blocking call changes nothing, because the chip keeps scanning.`,
    mount(box, kit, params) {
      params = params || {};
      const G = kit.gfx, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 400, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'who', type: 'select', label: 'Who scans the digits', options: [['The ESP32, in its own loop', 'cpu'], ['A driver chip (TM1637, MAX7219)', 'chip']], value: params.scanner === 'chip' ? 'chip' : 'cpu' },
        { id: 'T', label: 'Time per digit', min: 0.5, max: 100, value: 2, log: true, sig: 2, fmt: v => (v < 10 ? +v.toFixed(1) : Math.round(v)) + ' ms' },
        { id: 'I', label: 'Peak current per segment', min: 5, max: 40, step: 1, value: 20, unit: 'mA' },
        { id: 'B', label: 'Program blocks, once a second, for', min: 0, max: 600, step: 10, value: 0, unit: 'ms' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['rate', 'Whole display refreshed'], ['duty', 'Each digit lit'], ['avg', 'Average per segment'], ['supply', 'Supply current now'], ['state', 'The scan']]);
      const NUM = '1234', masks = [...NUM].map(ch => G.seg7(ch)), segs = masks.map(popcount);
      const TAU = 0.03;                                   // the eye's averaging time, about 30 ms
      let cur = 0, tin = 0, simT = 0, blockLeft = 0, nextBlock = 1, lastLit = -1;
      const eye = [0, 0, 0, 0], hist = [[], [], [], []];
      function advance(dt) {
        const T = ctl.values.T / 1000, chip = ctl.values.who === 'chip', B = ctl.values.B / 1000;
        let left = dt;
        while (left > 1e-9) {
          const s = Math.min(1e-4, left);
          left -= s; simT += s;
          if (blockLeft > 0) blockLeft -= s;
          else if (B > 0 && simT >= nextBlock) { blockLeft = B; nextBlock = simT + 1; }
          const stuck = blockLeft > 0 && !chip;
          if (!stuck) { tin += s; if (tin >= T) { tin -= T; cur = (cur + 1) % 4; } }
          for (let k = 0; k < 4; k++) eye[k] += ((k === cur ? 1 : 0) - eye[k]) * Math.min(1, s / TAU);
          if (cur !== lastLit) { if (lastLit >= 0) hist[lastLit].push([simT, 0]); hist[cur].push([simT, 1]); lastLit = cur; }
        }
        for (const h of hist) if (h.length > 400) h.splice(0, h.length - 400);
      }
      const loop = kit.loop(dt => {
        advance(dt);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12;
        const T = ctl.values.T / 1000, I = ctl.values.I, chip = ctl.values.who === 'chip';
        const stuck = blockLeft > 0 && !chip;
        const dh = clamp((H - 176) / 2, 40, 96), dw = 0.7 * dh, x0 = (W - 4 * dw) / 2;
        const drawDigits = (y, f) => {
          c.fillStyle = '#12060a';
          c.beginPath(); if (c.roundRect) c.roundRect(x0 - dh * 0.25, y - dh * 0.12, 4 * dw + dh * 0.3, dh * 1.24, 8); else c.rect(x0 - dh * 0.25, y - dh * 0.12, 4 * dw + dh * 0.3, dh * 1.24); c.fill();
          for (let k = 0; k < 4; k++) f(k, x0 + k * dw, y);
        };
        // at this instant
        kit.label(c, 'At this instant: the pins light one digit', M, 10, { size: 11.5, color: C.muted, weight: 600 });
        const y1 = 26;
        drawDigits(y1, (k, x, y) => G.drawSeg7(c, [{ seg: k === cur ? masks[k] : 0, dp: false }], x, y, dh, { color: '#ff3b30', off: 'rgba(255,60,48,.10)' }));
        // the digit select lines
        const ys = y1 + dh + 34, win = clamp(16 * T, 0.01, 2.2), t1 = simT, t0 = t1 - win;
        kit.label(c, 'digit select lines, the last ' + (win >= 1 ? kit.fmt(win, 2) + ' s' : kit.fmt(win * 1000, 2) + ' ms'), M, ys - 8, { size: 11, color: C.muted, weight: 600 });
        for (let k = 0; k < 4; k++) S.wave(c, M + 30, ys + 6 + k * 18, W - 2 * M - 30, 12, clipEdges(hist[k], t0, t1), { t0, t1, label: 'D' + (k + 1), color: k === cur ? C.accent : C.muted });
        if (stuck) kit.label(c, 'the program is blocked: the scan is stuck on digit ' + (cur + 1), W / 2, ys + 82, { size: 11.5, color: C.bad, weight: 650, align: 'center' });
        // what the eye sees
        const y2 = ys + 98;
        kit.label(c, 'What the eye sees (an average of about 30 ms)', M, y2 - 8, { size: 11.5, color: C.muted, weight: 600 });
        drawDigits(y2 + 8, (k, x, y) => {
          const a = clamp(eye[k] * I / 10, 0, 1), col = 'rgba(255,59,48,' + (0.1 + 0.9 * a).toFixed(3) + ')';
          G.drawSeg7(c, [{ seg: masks[k], dp: false }], x, y, dh, { color: col, off: 'rgba(255,60,48,.10)' });
        });
        // the numbers
        const avgI = I / 4;
        ro.set('rate', kit.fmt(1 / (4 * T), 3) + ' Hz' + (1 / (4 * T) < 60 ? ' (flicker)' : ''));
        ro.set('duty', '25 %');
        ro.set('avg', kit.fmt(avgI, 3) + ' mA (looks like a steady ' + kit.fmt(avgI, 3) + ' mA)');
        ro.set('supply', stuck ? kit.fmt(segs[cur] * I, 3) + ' mA, all in digit ' + (cur + 1) : kit.fmt(segs[cur] * I, 3) + ' mA (average ' + kit.fmt(segs.reduce((a, b) => a + b, 0) * I / 4, 3) + ' mA)');
        ro.set('state', stuck ? 'stuck on digit ' + (cur + 1) : chip ? 'the chip scans on its own' : 'scanning');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ad-lcd */
  // a small model of the HD44780 memory: two lines of 40 characters, at addresses 0x00-0x27 and 0x40-0x67;
  // the glass shows a window of it. On a 20 x 4 module rows 3 and 4 are the second halves of those two lines.
  function makeLcdModel(cols, rows) {
    const blank = () => [new Array(40).fill(' '), new Array(40).fill(' ')];
    const m = { cols, rows, line: blank(), addr: 0, shift: 0 };
    m.rowStart = r => [0x00, 0x40, cols, 0x40 + cols][clamp(r, 0, rows - 1)];
    m.put = (a, ch) => { if (a >= 0 && a <= 0x27) m.line[0][a] = ch; else if (a >= 0x40 && a <= 0x67) m.line[1][a - 0x40] = ch; };
    m.print = s => { for (const ch of String(s)) { m.put(m.addr, ch); m.addr = (m.addr + 1) & 0x7F; } };
    m.setCursor = (c, r) => { m.addr = m.rowStart(r) + clamp(c, 0, cols - 1); };
    m.clear = () => { m.line = blank(); m.addr = 0; m.shift = 0; };
    m.at = (r, c) => m.line[r % 2][((((r < 2 ? 0 : cols) + c + m.shift) % 40) + 40) % 40];
    m.cell = a => { for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (m.rowStart(r) + c === a) return [r, c]; return null; };
    // which row of the glass shows each memory cell: [line][index] -> row or -1
    m.rowMap = () => {
      const map = [new Array(40).fill(-1), new Array(40).fill(-1)];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) map[r % 2][((((r < 2 ? 0 : cols) + c + m.shift) % 40) + 40) % 40] = r;
      return map;
    };
    return m;
  }
  const seedLcd = m => {
    m.setCursor(0, 0); m.print('Hello, ESP32');
    m.setCursor(0, 1); m.print('Count: 42');
    if (m.rows > 2) { m.setCursor(0, 2); m.print('Row three'); m.setCursor(0, 3); m.print('Row four'); }
    m.setCursor(0, 0);
  };
  Hyper.sim('ad-lcd', {
    title: 'A character LCD and its memory',
    blurb: `The picture on the glass is a window onto the controller's memory, drawn underneath: two lines of 40 characters. Type some text, choose a column and a row, and press **Print**. Everything is done the way a library does it: set the cursor, then write characters one after another.

**Try this**
- Choose **20 × 4**, put the cursor at row 1, column 0 and print a 30-character text: ten characters land on **row 3**, because the memory of line 1 continues there.
- **Shift display left** a few times: the window slides along the memory, wrapping at 40, and nothing in memory changes.
- Move **contrast** below 30 % or above 70 %, then untick **initialised**: a good module can look dead, or show a row of blocks.
- Press **Clear** and read its time next to the time of a printed character.`,
    mount(box, kit, params) {
      params = params || {};
      const G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380, maxH: 470 });
      let model = makeLcdModel(params.cols === 20 ? 20 : 16, params.cols === 20 ? 4 : 2), text = 'Hello, ESP32', last = 'ready';
      seedLcd(model);
      const ctl = kit.controls(box.side, [
        { id: 'size', type: 'select', label: 'Module', options: [['16 × 2', 16], ['20 × 4', 20]], value: model.cols },
        { id: 'col', label: 'Cursor column', min: 0, max: 19, step: 1, value: 0 },
        { id: 'row', label: 'Cursor row', min: 0, max: 3, step: 1, value: 0 },
        { id: 'cur', type: 'check', label: 'Show the cursor (underline)', value: true },
        { id: 'blink', type: 'check', label: 'Blink the cursor cell', value: false },
        { id: 'init', type: 'check', label: 'Controller initialised (begin() was called)', value: true },
        { id: 'bl', type: 'select', label: 'Backlight', options: [['green', 'green'], ['blue', 'blue'], ['off', 'off']], value: 'green' },
        { id: 'contrast', label: 'Contrast (V0)', min: 0, max: 100, step: 1, value: 50, unit: '%' },
        { type: 'buttons', items: [{ id: 'print', label: 'Print the text', primary: true }, { id: 'clear', label: 'Clear' }, { id: 'left', label: 'Shift display left' }, { id: 'home', label: 'Home' }] }
      ], (id, v) => {
        const v0 = ctl.values;
        if (id === 'size') { model = makeLcdModel(v, v === 20 ? 4 : 2); seedLcd(model); ctl.set('col', 0); ctl.set('row', 0); last = 'a new module: ' + v + ' columns, ' + model.rows + ' rows'; }
        else if (id === 'col' || id === 'row') { model.setCursor(Math.round(v0.col), Math.round(v0.row)); last = 'setCursor(' + clamp(Math.round(v0.col), 0, model.cols - 1) + ', ' + clamp(Math.round(v0.row), 0, model.rows - 1) + '): address ' + hex2(model.addr); }
        else if (id === 'init') { if (v) model.clear(); last = v ? 'initialised: the display was cleared' : 'not initialised: writes are ignored'; }
        else if (id === 'print') {
          if (!v0.init) last = 'nothing happens: the controller was never initialised';
          else { model.print(text); const cell = model.cell(model.addr); if (cell) { ctl.set('row', cell[0]); ctl.set('col', cell[1]); } last = 'print: ' + text.length + ' characters × 37 µs = ' + kit.fmt(text.length * 0.037, 2) + ' ms'; }
        } else if (id === 'clear') { if (v0.init) { model.clear(); ctl.set('col', 0); ctl.set('row', 0); } last = 'clear: 1.52 ms, and the whole screen is blank meanwhile'; }
        else if (id === 'left') { model.shift = (model.shift + 1) % 40; last = 'shift display: the window moved one cell; memory did not change'; }
        else if (id === 'home') { model.addr = 0; model.shift = 0; ctl.set('col', 0); ctl.set('row', 0); last = 'home: address 0x00, window back at the start'; }
        loop.once();
      });
      textBox(box, 'Text to print', text, 40, v => { text = v; });
      const ro = kit.readout(box.side, [['cursor', 'Cursor'], ['addr', 'Memory address'], ['last', 'Last action']]);
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 10, cols = model.cols, rows = model.rows, inited = ctl.values.init;
        const lcd = G.lcd(cols, rows);
        for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) lcd.cells[r][k] = inited ? model.at(r, k) : (r === 0 ? '█' : ' ');
        const cell = inited ? model.cell(model.addr) : null;
        lcd.row = cell ? cell[0] : -1; lcd.col = cell ? cell[1] : -1;
        lcd.cursorOn = !!ctl.values.cur; lcd.blinkOn = !!ctl.values.blink;
        const bl = ctl.values.bl;
        lcd.backlight = bl !== 'off';
        const d = clamp(Math.floor((W - 12) / (6 * cols + 7)), 2, 6), lw = (6 * cols + 3) * d, lx = (W - lw) / 2, ly = 4 * d;
        const r = G.drawLcd(c, lcd, lx, ly, d, { backlight: bl === 'off' ? 'green' : bl, t });
        // contrast: too low washes the dots out, too high darkens every cell
        const ct = ctl.values.contrast, pal = { green: ['#8fb834', '#1e2a0c'], blue: ['#2a5ae6', '#eef4ff'], off: ['#566049', '#252b1e'] }[bl] || ['#8fb834', '#1e2a0c'];
        if (ct < 35) { c.save(); c.globalAlpha = clamp((35 - ct) / 30, 0, 0.97); c.fillStyle = pal[0]; c.fillRect(r.x + d, r.y + d, r.w - 2 * d, r.h - 2 * d); c.restore(); }
        else if (ct > 65) {
          c.save(); c.globalAlpha = clamp((ct - 65) / 35, 0, 1) * 0.6; c.fillStyle = pal[1];
          for (let rr = 0; rr < rows; rr++) for (let k = 0; k < cols; k++) c.fillRect(r.x + 2 * d + k * 6 * d, r.y + 2 * d + rr * 9 * d, 5 * d, 8 * d);
          c.restore();
        }
        // the memory behind it
        const my = r.y + r.h + 4 * d + 34;
        kit.label(c, fit('The controller\'s memory: two lines of 40 characters; the glass shows a window of it', W - 2 * M, 11), M, my - 18, { size: 11, color: C.muted, weight: 600 });
        const map = model.rowMap(), sx = M + 40, cw = (W - sx - M) / 40, hues = [212, 28, 140, 330];
        for (let L = 0; L < 2; L++) {
          const ly2 = my + L * 44, start = L === 0 ? 0 : 0x40;
          kit.label(c, hex2(start), M, ly2 + 10, { size: 10.5, color: C.muted, weight: 600 });
          for (let i = 0; i < 40; i++) {
            const x = sx + i * cw, row = map[L][i];
            c.fillStyle = row >= 0 ? kit.hue(hues[row], 0.3) : (C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)');
            c.fillRect(x + 0.5, ly2, cw - 1, 20);
            if (model.addr === start + i) { c.strokeStyle = C.warn; c.lineWidth = 2; c.strokeRect(x + 1, ly2 + 1, cw - 2, 18); }
            const ch = model.line[L][i];
            if (ch !== ' ' && cw >= 8) kit.label(c, ch, x + cw / 2, ly2 + 10, { size: Math.min(12, cw * 0.95), align: 'center', color: row >= 0 ? C.text : C.faint });
          }
          // the rows under the line
          let i = 0;
          while (i < 40) {
            let j = i; while (j < 40 && map[L][j] === map[L][i]) j++;
            const row = map[L][i];
            kit.label(c, row >= 0 ? 'row ' + (row + 1) : 'hidden', sx + (i + j) / 2 * cw, ly2 + 31, { size: 10, color: row >= 0 ? C.text2 : C.faint, align: 'center' });
            i = j;
          }
        }
        ro.set('cursor', cell ? 'column ' + cell[1] + ', row ' + cell[0] : (inited ? 'not on the glass' : 'not initialised'));
        ro.set('addr', hex2(model.addr));
        ro.set('last', last);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ad-backpack */
  Hyper.sim('ad-backpack', {
    title: 'One character through the backpack',
    blurb: `A PCF8574 on the back of the LCD turns each I2C byte into the eight lines of the display. Every character is sent as two 4-bit halves, and each half needs E raised and lowered: **four writes, four bytes**. The boxes are those bytes pin by pin (P7 on the left); the picture below them is what SCL and SDA carry.

**Try this**
- Send **0x48** ("H") and read the four bytes: the data half sits in the top four bits, and only bit 2 (E) differs inside each pair.
- Switch the **backlight** off: bit 3 clears in every byte.
- Choose **a command** and send 0x01 (clear): RS drops to 0.
- Compare the time of **a whole screen** at 100 and at 400 kHz.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym, P = E.proto;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 430, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'code', label: 'Byte for the LCD', min: 0, max: 255, step: 1, value: 0x48, fmt: v => { const n = Math.round(v); return hex2(n) + (printable(n) ? '  "' + String.fromCharCode(n) + '"' : ''); } },
        { id: 'rs', type: 'select', label: 'It is', options: [['a character (RS = 1)', 1], ['a command (RS = 0)', 0]], value: 1 },
        { id: 'bl', type: 'check', label: 'Backlight on (P3)', value: true },
        { id: 'hz', type: 'select', label: 'I2C clock', options: [['100 kHz', 100e3], ['400 kHz', 400e3]], value: 100e3 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['bytes', 'Bytes to the expander'], ['one', 'One write'], ['char', 'One character'], ['s16', 'A 16 × 2 screen'], ['s20', 'A 20 × 4 screen']]);
      const fmtT = v => (v >= 1e-3 ? kit.fmt(v * 1e3, 3) + ' ms' : kit.fmt(v * 1e6, 3) + ' µs');
      const TINT = { start: 'rgba(224,160,48,.42)', stop: 'rgba(224,160,48,.42)', addr: 'rgba(123,140,255,.38)', ack: 'rgba(34,179,122,.34)', nack: 'rgba(229,72,77,.46)' };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12;
        const code = Math.round(ctl.values.code) & 255, rs = ctl.values.rs ? 1 : 0, bl = ctl.values.bl ? 8 : 0, hz = ctl.values.hz;
        const base = n => (n << 4) | bl | rs;
        const writes = [base(code >> 4) | 4, base(code >> 4), base(code & 15) | 4, base(code & 15)];
        const notes = ['high half, E high', 'E low: latched', 'low half, E high', 'E low: latched'];
        const cell = clamp(Math.floor((W - 2 * M - 150) / 8), 18, 26), x0 = M;
        const pinNames = ['P7', 'P6', 'P5', 'P4', 'P3', 'P2', 'P1', 'P0'], lcdNames = ['D7', 'D6', 'D5', 'D4', 'BL', 'E', 'RW', 'RS'];
        pinNames.forEach((n, i) => {
          kit.label(c, n, x0 + i * cell + cell / 2, 12, { size: 10.5, color: C.text2, align: 'center', weight: 600 });
          kit.label(c, lcdNames[i], x0 + i * cell + cell / 2, 26, { size: 10, color: C.faint, align: 'center' });
        });
        writes.forEach((w, i) => {
          const y = 38 + i * (cell + 10);
          S.bits(c, x0, y, w, { n: 8, cell, hi: [5] });
          kit.label(c, hex2(w), x0 + 8 * cell + 10, y + cell / 2 - 5, { size: 12, weight: 650 });
          kit.label(c, notes[i], x0 + 8 * cell + 10, y + cell / 2 + 9, { size: 10.5, color: C.muted });
        });
        const yEnd = 38 + 4 * (cell + 10);
        // the wire
        const tr = writes.map(w => P.i2c({ addr: 0x27, data: [w], hz }));
        const gap = 3 * tr[0].tBit, per = tr[0].t1 + gap;
        const scl = [], sda = [], marks = [];
        tr.forEach((r, k) => {
          const off = k * per;
          for (const e of r.scl) { const t = e[0] + off; if (!scl.length || t > scl[scl.length - 1][0]) scl.push([t, e[1]]); }
          for (const e of r.sda) { const t = e[0] + off; if (!sda.length || t > sda[sda.length - 1][0]) sda.push([t, e[1]]); }
          for (const m of r.marks) marks.push({ t0: m.t0 + off, t1: m.t1 + off, text: m.text, color: TINT[m.kind] });
        });
        kit.label(c, 'what the wire carries: four writes to address 0x27, one byte each', M, yEnd + 8, { size: 11, color: C.muted, weight: 600 });
        const lh = clamp(H - yEnd - 34, 96, 190);
        S.logic(c, M, yEnd + 20, W - 2 * M, lh, [{ label: 'SCL', edges: scl }, { label: 'SDA', edges: sda, marks }], { t0: -1.5 * tr[0].tBit, t1: 3 * per + tr[0].t1 + tr[0].tBit, labelW: 40, grid: 8 });
        const w1 = tr[0].t1;
        ro.set('bytes', writes.map(hex2).join(' '));
        ro.set('one', fmtT(w1));
        ro.set('char', fmtT(4 * w1));
        ro.set('s16', fmtT(32 * 4 * w1));
        ro.set('s20', fmtT(80 * 4 * w1));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ad-chars */
  const SYMBOLS = {
    heart: [0, 10, 31, 31, 31, 14, 4, 0], batlow: [14, 27, 17, 17, 17, 31, 31, 0], batfull: [14, 31, 31, 31, 31, 31, 31, 0], degree: [6, 9, 9, 6, 0, 0, 0, 0],
    bell: [4, 14, 14, 14, 31, 0, 4, 0], check: [0, 1, 3, 22, 28, 8, 0, 0], up: [4, 14, 21, 4, 4, 4, 4, 0], bar: [0, 0, 0, 0, 31, 31, 31, 31]
  };
  Hyper.sim('ad-chars', {
    title: 'The custom-character editor',
    blurb: `Click dots in the grid to draw a character; the eight numbers on the right are what you give to createChar. The screen preview shows all eight slots, and a row that uses the selected slot **three times**.

**Try this**
- Pick **slot 1** and click a few dots: all three cells in the second row change at once, because a cell holds the slot number, not a copy of the dots.
- Copy a **battery** symbol into a slot and read its eight bytes.
- Use **Shift left** and **Shift up** to move a pattern, and **Invert** to turn dark dots light.
- Notice the bottom row of the grid: the cursor underline shares it, so symbols usually leave it empty.`,
    mount(box, kit, params) {
      params = params || {};
      const G = kit.gfx;
      const narrow = (box.stage.clientWidth || 700) < 560;
      const st = kit.stage(box.stage, { aspect: narrow ? 1.05 : 0.56, minH: narrow ? 430 : 310, maxH: 480 });
      const pat = [SYMBOLS.heart, SYMBOLS.batlow, SYMBOLS.batfull, SYMBOLS.degree, SYMBOLS.bell, SYMBOLS.check, SYMBOLS.up, SYMBOLS.bar].map(a => a.slice());
      let slot = clamp(params.slot | 0, 0, 7), gridGeo = null, lcdGeo = null;
      const ctl = kit.controls(box.side, [
        { id: 'slot', type: 'select', label: 'Slot to edit', options: [0, 1, 2, 3, 4, 5, 6, 7].map(i => ['Slot ' + i, i]), value: slot },
        { id: 'preset', type: 'select', label: 'Copy a symbol into the slot', options: [['(choose one)', ''], ['Heart', 'heart'], ['Battery, low', 'batlow'], ['Battery, full', 'batfull'], ['Degree sign', 'degree'], ['Bell', 'bell'], ['Check mark', 'check'], ['Up arrow', 'up'], ['Bar, four dots tall', 'bar']], value: '' },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear' }, { id: 'invert', label: 'Invert' }, { id: 'left', label: 'Shift left' }, { id: 'up', label: 'Shift up' }] }
      ], (id, v) => {
        if (id === 'slot') slot = v;
        else if (id === 'preset') { if (v) { pat[slot] = SYMBOLS[v].slice(); ctl.set('preset', ''); } }
        else if (id === 'clear') pat[slot] = new Array(8).fill(0);
        else if (id === 'invert') pat[slot] = pat[slot].map(r => (~r) & 31);
        else if (id === 'left') pat[slot] = pat[slot].map(r => (r << 1) & 31);
        else if (id === 'up') pat[slot] = pat[slot].slice(1).concat([0]);
        loop.once();
      });
      const ro = kit.readout(box.side, [['slot', 'Slot'], ['dec', 'Bytes, decimal'], ['hex', 'Bytes, hex'], ['used', 'Slots with a pattern']]);
      const bin5 = v => (v & 31).toString(2).padStart(5, '0');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12;
        const cs = narrow ? clamp(Math.floor((W - 2 * M - 120) / 5), 18, 30) : clamp(Math.floor((H - 70) / 8), 18, 34);
        const gx = M + 22, gy = 34;
        const weights = [16, 8, 4, 2, 1];
        weights.forEach((wt, i) => kit.label(c, String(wt), gx + i * cs + cs / 2, gy - 12, { size: 10.5, color: C.faint, align: 'center' }));
        gridGeo = { gx, gy, cs };
        for (let j = 0; j < 8; j++) {
          kit.label(c, String(j), gx - 10, gy + j * cs + cs / 2, { size: 10, color: C.faint, align: 'center' });
          for (let i = 0; i < 5; i++) {
            const on = (pat[slot][j] >> (4 - i)) & 1;
            c.fillStyle = on ? C.accent : (C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.07)');
            c.fillRect(gx + i * cs + 1, gy + j * cs + 1, cs - 2, cs - 2);
          }
          kit.label(c, bin5(pat[slot][j]) + '  ' + pat[slot][j], gx + 5 * cs + 10, gy + j * cs + cs / 2, { size: 11.5, color: j === 7 ? C.faint : C.text2, font: 'Consolas, monospace' });
        }
        kit.label(c, 'bottom row: shared with the cursor', gx, gy + 8 * cs + 14, { size: 10.5, color: C.faint });
        // the screen
        const lcd = G.lcd(16, 2);
        for (let k = 0; k < 8; k++) lcd.createChar(k, pat[k]);
        for (let k = 0; k < 8; k++) { lcd.setCursor(2 * k, 0); lcd.write(k); }
        lcd.setCursor(0, 1); lcd.print('slot ' + slot + ': ');
        lcd.write(slot); lcd.print(' '); lcd.write(slot); lcd.print(' '); lcd.write(slot);
        lcd.col = -1; lcd.row = -1;
        const px = narrow ? M : gx + 5 * cs + 120, py = narrow ? gy + 8 * cs + 48 : gy + 18;
        const d = clamp(Math.floor((W - px - M - 12) / 103), 2, 5);
        kit.label(c, 'on the screen: all eight slots, then slot ' + slot + ' three times', px, py - 18, { size: 11, color: C.muted, weight: 600 });
        const r = G.drawLcd(c, lcd, px + 2 * d, py, d, { backlight: 'green', t: 0 });
        lcdGeo = { x: r.x, y: r.y, d };
        c.strokeStyle = C.warn; c.lineWidth = 2;
        c.strokeRect(r.x + 2 * d + 2 * slot * 6 * d - 1, r.y + 2 * d - 1, 5 * d + 2, 8 * d + 2);
        kit.label(c, 'click a symbol to select its slot', px, r.y + r.h + 4 * d + 12, { size: 10.5, color: C.faint });
        ro.set('slot', String(slot));
        ro.set('dec', pat[slot].join(', '));
        ro.set('hex', pat[slot].map(hex2).join(' '));
        ro.set('used', pat.filter(p => p.some(x => x)).length + ' of 8');
      }, box.stage);
      kit.click(st, p => {
        if (gridGeo) {
          const i = Math.floor((p.x - gridGeo.gx) / gridGeo.cs), j = Math.floor((p.y - gridGeo.gy) / gridGeo.cs);
          if (i >= 0 && i < 5 && j >= 0 && j < 8) { pat[slot][j] ^= 1 << (4 - i); loop.once(); return; }
        }
        if (lcdGeo) {
          const k = Math.floor((p.x - lcdGeo.x - 2 * lcdGeo.d) / (6 * lcdGeo.d)), row = Math.floor((p.y - lcdGeo.y - 2 * lcdGeo.d) / (9 * lcdGeo.d));
          if (row === 0 && k >= 0 && k <= 14 && k % 2 === 0) { slot = k / 2; ctl.set('slot', slot); loop.once(); }
        }
      }, p => {
        if (gridGeo && p.x >= gridGeo.gx && p.x < gridGeo.gx + 5 * gridGeo.cs && p.y >= gridGeo.gy && p.y < gridGeo.gy + 8 * gridGeo.cs) return true;
        return false;
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ad-format */
  Hyper.sim('ad-format', {
    title: 'The same number, three ways to print it',
    blurb: `The reading changes, and the program rewrites the two rows of the display in the same way each time. Characters that are not overwritten stay on the glass; they are marked in red.

**Try this**
- With **the number as it comes** and the reading near 100, watch the row show things like 99.50 when the value falls from 100.0 to 99.5.
- Switch to **fixed width**: the stale digits are gone and the decimal points stay in their column.
- Choose **wobbles around zero** with **one decimal**: the plain fixed width shows -0.0; **with care** does not.
- Narrow the **field width** to 4 on the sweeping reading and see what spills, then what **with care** shows instead.
- Tick **clear()** and raise the updates per second: the screen is blank for a few per cent of the time, and flickers.`,
    mount(box, kit) {
      const G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340, maxH: 430 });
      const lcd = G.lcd(16, 2);
      const SIG = { near100: t => 100 + 15 * Math.sin(t * 0.9) + 1.5 * Math.sin(t * 3.1), nearzero: t => 0.9 * Math.sin(t * 0.8) + 0.05 * Math.sin(t * 5), wide: t => 500 + 700 * Math.sin(t * 0.35) };
      let acc = 0, tt = 0, value = 100, sent = ['', ''], expect = ['', ''];
      const ctl = kit.controls(box.side, [
        { id: 'fmt', type: 'select', label: 'Printing', options: [['The number as it comes', 'naive'], ['Fixed width, right-aligned', 'fixed'], ['Fixed width, with care', 'careful']], value: 'naive' },
        { id: 'w', type: 'select', label: 'Field width', options: [['4 characters', 4], ['5 characters', 5], ['6 characters', 6], ['7 characters', 7]], value: 6 },
        { id: 'dec', type: 'select', label: 'Decimals', options: [['0', 0], ['1', 1], ['2', 2]], value: 1 },
        { id: 'sig', type: 'select', label: 'The reading', options: [['Wobbles around 100', 'near100'], ['Wobbles around zero', 'nearzero'], ['Sweeps up to 1200', 'wide']], value: 'near100' },
        { id: 'rate', type: 'select', label: 'Updates per second', options: [['1', 1], ['4', 4], ['10', 10], ['30', 30]], value: 4 },
        { id: 'clear', type: 'check', label: 'Call clear() before each update', value: false },
        { id: 'run', type: 'check', label: 'Running', value: true }
      ], id => { if (id !== 'run' && id !== 'rate' && id !== 'clear') update(); loop.once(); });
      const ro = kit.readout(box.side, [['val', 'The reading'], ['stale', 'Wrong characters on the glass'], ['blank', 'Screen blank']]);
      const fmtNum = (v, w, d, mode) => {
        let s = v.toFixed(d);
        if (mode === 'naive') return s;
        if (mode === 'careful') { if (/^-0(\.0*)?$/.test(s)) s = s.slice(1); if (s.length > w) return '-'.repeat(w); }
        return s.padStart(w);
      };
      function update() {
        const v = ctl.values, x = SIG[v.sig](tt), n = Math.round(Math.abs(x) * 10);
        value = x;
        const rows = ['Temp ' + fmtNum(x, v.w, v.dec, v.fmt) + ' C', 'Raw ' + (v.fmt === 'naive' ? String(n) : String(n).padStart(5))];
        if (v.clear) lcd.clear();
        rows.forEach((s, r) => { lcd.setCursor(0, r); lcd.print(s); });
        sent = rows;
        expect = rows.map(s => s.slice(0, 16).padEnd(16, ' '));
      }
      update();
      const loop = kit.loop(dt => {
        if (ctl.values.run && dt > 0) {
          tt += dt; acc += dt;
          const per = 1 / ctl.values.rate;
          let guard = 0;
          while (acc >= per && guard++ < 8) { acc -= per; update(); }
        }
        const c = st.begin(), C = kit.colors(), W = st.W, M = 12;
        const rate = ctl.values.rate, blankFrac = ctl.values.clear ? rate * 0.00152 : 0;
        const shown = blankFrac > 0 && Math.random() < blankFrac ? G.lcd(16, 2) : lcd;
        shown.col = -1; shown.row = -1;
        const d = clamp(Math.floor((W - 12) / 103), 2, 6), lw = 99 * d, lx = (W - lw) / 2, ly = 4 * d;
        const r = G.drawLcd(c, shown, lx, ly, d, { backlight: 'green', t: 0 });
        let stale = 0;
        c.strokeStyle = '#e5484d'; c.lineWidth = 2;
        for (let rr = 0; rr < 2; rr++) for (let k = 0; k < 16; k++) {
          const ch = lcd.cells[rr][k], ok = typeof ch === 'string' && ch === expect[rr][k];
          if (!ok) { stale++; c.strokeRect(r.x + 2 * d + k * 6 * d - 1, r.y + 2 * d + rr * 9 * d - 1, 5 * d + 2, 8 * d + 2); }
        }
        const y = r.y + r.h + 4 * d + 20, mono = 'Consolas, monospace';
        kit.label(c, 'sent to row 1:', M, y, { size: 11, color: C.muted });
        kit.label(c, '"' + sent[0] + '"   ' + sent[0].length + ' characters', M + 96, y, { size: 12, font: mono });
        kit.label(c, 'sent to row 2:', M, y + 22, { size: 11, color: C.muted });
        kit.label(c, '"' + sent[1] + '"   ' + sent[1].length + ' characters', M + 96, y + 22, { size: 12, font: mono });
        kit.label(c, 'red boxes: characters that differ from the text just sent', M, y + 52, { size: 11, color: stale ? C.bad : C.faint });
        ro.set('val', kit.fmt(value, 5));
        ro.set('stale', String(stale));
        ro.set('blank', ctl.values.clear ? kit.fmt(blankFrac * 100, 2) + ' % of the time (1.52 ms per clear)' : 'never');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ad-menu */
  Hyper.sim('ad-menu', {
    title: 'A two-line menu as a state machine',
    blurb: `The display, the three buttons and the state machine behind them. The lit state is where the program is; the arrow that just fired flashes. The same press does different things in different states: that is the whole design.

**Try this**
- From **HOME** press **OK** to open the menu, **DOWN** to move, **OK** to edit, **UP** to change the value, **OK** to keep it.
- In EDIT press **Wait 10 seconds** without saving: the machine falls back to HOME and the edit is dropped.
- Press **OK** on the last line (Exit) to leave the menu.
- Watch the idle bar: every press restarts it, because each press is a transition into a state.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym, G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 450, maxH: 520 });
      const items = [{ label: 'Set point', v: 22, lo: 10, hi: 30, unit: ' C' }, { label: 'Hysteresis', v: 1, lo: 0, hi: 5, unit: ' C' }, { label: 'Brightness', v: 5, lo: 0, hi: 9, unit: '' }];
      const N = items.length;
      let sel = 0, edited = 0, flash = 9, lastIdx = -1;
      const def = { start: 'HOME', states: {
        HOME: { on: { OK: 'MENU' } },
        MENU: { on: { UP: { to: 'MENU', do: 'previous' }, DOWN: { to: 'MENU', do: 'next' }, OK: [{ to: 'HOME', if: 'onExit' }, { to: 'EDIT', do: 'copy value' }] }, after: { 10000: 'HOME' } },
        EDIT: { on: { UP: { to: 'EDIT', do: 'value + 1' }, DOWN: { to: 'EDIT', do: 'value - 1' }, OK: { to: 'MENU', do: 'keep value' } }, after: { 10000: { to: 'HOME', do: 'drop the edit' } } }
      } };
      // the drawing: the arrows between states only (a press that stays in a state is not drawn)
      const dia = E.fsmDiagram(def, { HOME: [0.08, 0.72], MENU: [0.5, 0.1], EDIT: [0.92, 0.72] });
      dia.transitions = dia.transitions.filter(t => t.from !== t.to);
      const seen = {};
      for (const t of dia.transitions) { const k = t.from + '>' + t.to, n = seen[k] = (seen[k] || 0) + 1; t.bend = 22 + (n - 1) * 30; }
      const m = E.fsm(def, {
        guards: { onExit: () => sel === N },
        onChange(from, to, why, actions) {
          if (from === 'HOME' && to === 'MENU') sel = 0;
          for (const a of actions) {
            if (a === 'previous') sel = Math.max(0, sel - 1);
            else if (a === 'next') sel = Math.min(N, sel + 1);
            else if (a === 'copy value') edited = items[sel].v;
            else if (a === 'value + 1') edited = Math.min(items[sel].hi, edited + 1);
            else if (a === 'value - 1') edited = Math.max(items[sel].lo, edited - 1);
            else if (a === 'keep value') items[sel].v = edited;
          }
          lastIdx = dia.transitions.findIndex(t => t.from === from && t.to === to && (/^after/.test(String(why)) ? /^after/.test(t.ev) : t.ev === why));
          flash = 0;
        }
      });
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'UP', label: 'UP' }, { id: 'DOWN', label: 'DOWN' }, { id: 'OK', label: 'OK', primary: true }] },
        { type: 'buttons', items: [{ id: 'wait', label: 'Wait 10 seconds' }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'wait') m.tick(10000);
        else if (id === 'reset') { m.reset(); sel = 0; edited = 0; lastIdx = -1; flash = 9; items[0].v = 22; items[1].v = 1; items[2].v = 5; }
        else m.send(id);
        loop.once();
      });
      const ro = kit.readout(box.side, [['state', 'State'], ['item', 'Selected'], ['edit', 'Value being edited'], ['saved', 'Saved settings'], ['idle', 'Idle for']]);
      const pad = s => String(s).slice(0, 16).padEnd(16, ' ');
      const loop = kit.loop(dt => {
        if (dt > 0) { m.tick(dt * 1000); flash += dt; }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12;
        const names = items.map(i => i.label).concat(['Exit']);
        let l0, l1;
        if (m.state === 'HOME') { l0 = 'Set point ' + items[0].v + ' C'; l1 = 'OK = menu'; }
        else if (m.state === 'MENU') { l0 = '> ' + names[sel]; l1 = '  ' + (names[sel + 1] || ''); }
        else { l0 = items[sel].label; l1 = '< ' + edited + ' >  OK saves'; }
        const lcd = G.lcd(16, 2);
        lcd.setCursor(0, 0); lcd.print(pad(l0)); lcd.setCursor(0, 1); lcd.print(pad(l1));
        lcd.row = -1; lcd.col = -1;
        const d = clamp(Math.floor((W - 12) / 103), 2, 6), lw = 99 * d, lx = (W - lw) / 2, ly = 4 * d;
        const r = G.drawLcd(c, lcd, lx, ly, d, { backlight: 'green', t: 0 });
        // the idle timer
        const by = r.y + r.h + 4 * d + 6, idle = m.state === 'HOME' ? 0 : clamp(m.inState() / 10000, 0, 1);
        c.fillStyle = C.dark ? 'rgba(255,255,255,.10)' : 'rgba(0,0,0,.08)'; c.fillRect(lx, by, lw, 8);
        c.fillStyle = idle > 0.8 ? C.warn : C.accent; c.fillRect(lx, by, lw * idle, 8);
        kit.label(c, m.state === 'HOME' ? 'no idle timer in HOME' : 'idle: ' + kit.fmt(idle * 10, 2) + ' s of 10', lx, by + 20, { size: 10.5, color: C.muted });
        // the machine
        const dy = by + 34, dh = H - dy - 78;
        S.fsm(c, dia, { box: { x: M, y: dy, w: W - 2 * M, h: dh }, active: m.state, fired: flash < 1.6 ? lastIdx : -1, pulse: flash / 0.7 });
        // what happened
        const ly2 = H - 68;
        kit.label(c, 'what happened', M, ly2, { size: 10.5, color: C.faint, weight: 600 });
        const lines = m.log.slice(-3);
        if (!lines.length) kit.label(c, 'nothing yet: press OK', M, ly2 + 17, { size: 11, color: C.faint });
        lines.forEach((e, i) => {
          const s = e.from + ' → ' + e.to + '   (' + e.why + ')' + (e.actions && e.actions.length ? '   · ' + e.actions.join(', ') : '');
          kit.label(c, fit(s, W - 2 * M, 11), M, ly2 + 17 + i * 15, { size: 11, color: i === lines.length - 1 ? C.text : C.muted });
        });
        ro.set('state', m.state);
        ro.set('item', m.state === 'HOME' ? '—' : names[sel]);
        ro.set('edit', m.state === 'EDIT' ? String(edited) : '—');
        ro.set('saved', items.map(i => i.v).join(' · '));
        ro.set('idle', m.state === 'HOME' ? '—' : kit.fmt(idle * 10, 2) + ' s');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ad-matrix */
  Hyper.sim('ad-matrix', {
    title: 'A scrolling LED sign',
    blurb: `Modules of 8 × 8 LEDs in a chain, each with its own MAX7219. The text is rendered once in a 5 × 7 font and the picture slides one column at a time. The current figure is an **estimate** from a typical module: each LED peaks at about 40 mA, a row is lit for 1/8 of the time, and the intensity setting is a duty between 1/32 and 31/32.

**Try this**
- Add modules to the chain and watch the time to cross the sign and the current grow.
- Slow the scroll to 150 ms per column: easy to read, but a long message takes ages. Speed it up until it blurs.
- Move **intensity** from 0 to 15 and compare the current: a low setting is bright indoors at a fraction of the power.
- Type your own message; the six columns per letter show in the length.`,
    mount(box, kit) {
      const G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250, maxH: 330 });
      let text = 'Hello, ESP32', msg = null, offset = 0, acc = 0, tb = null;
      const build = () => { const s = text.length ? text : ' '; msg = G.fb(Math.max(1, G.textWidth(s, 1)), 8); msg.clear(); msg.text(s, 0, 1, { size: 1 }); offset = 0; };
      build();
      const ctl = kit.controls(box.side, [
        { id: 'mod', type: 'select', label: 'Modules in the chain', options: [['1 (8 × 8)', 1], ['2 (16 × 8)', 2], ['4 (32 × 8)', 4], ['8 (64 × 8)', 8]], value: 4 },
        { id: 'ms', label: 'Time per column', min: 15, max: 300, value: 50, log: true, sig: 2, unit: 'ms' },
        { id: 'int', label: 'Intensity', min: 0, max: 15, step: 1, value: 4 },
        { id: 'dir', type: 'select', label: 'Scrolls', options: [['to the left', 1], ['to the right', -1]], value: 1 },
        { id: 'preset', type: 'select', label: 'Message', options: [['Hello, ESP32', 'Hello, ESP32'], ['23.5 C  62 %', '23.5 C  62 %'], ['12:34:56', '12:34:56'], ['SALE 50% OFF', 'SALE 50% OFF']], value: 'Hello, ESP32' },
        { id: 'run', type: 'check', label: 'Scroll', value: true }
      ], (id, v) => {
        if (id === 'preset') { text = v; if (tb) tb.set(v); build(); }
        loop.once();
      });
      tb = textBox(box, 'Or type a message', text, 40, v => { text = v; build(); loop.once(); });
      const ro = kit.readout(box.side, [['len', 'Message'], ['pass', 'Time to pass a point'], ['cross', 'Time to cross the sign'], ['lit', 'Dots lit now'], ['cur', 'Supply current, estimated'], ['rows', 'Row bytes of module 1']]);
      const loop = kit.loop(dt => {
        const mods = ctl.values.mod, W8 = 8 * mods, ms = ctl.values.ms, mw = msg.w, span = mw + W8;
        if (ctl.values.run && dt > 0) { acc += dt * 1000; let g = 0; while (acc >= ms && g++ < 6) { acc -= ms; offset += ctl.values.dir; } }
        offset = ((offset % span) + span) % span;
        const view = G.fb(W8, 8);
        for (let x = 0; x < W8; x++) { const mc = x + offset - W8; if (mc >= 0 && mc < mw) for (let y = 0; y < 8; y++) if (msg.get(mc, y)) view.pixel(x, y, 1); }
        const c = st.begin(), C = kit.colors(), W = st.W, M = 12;
        const scale = clamp(Math.floor((W - 2 * M) / W8), 3, 20), x0 = (W - W8 * scale) / 2, y0 = 18;
        const duty = (2 * ctl.values.int + 1) / 32, alpha = 0.25 + 0.75 * Math.sqrt(duty);
        G.draw(c, view, x0, y0, scale, { style: 'led', on: 'rgba(255,59,48,' + alpha.toFixed(2) + ')' });
        c.fillStyle = 'rgba(255,255,255,.2)';
        for (let k = 1; k < mods; k++) c.fillRect(x0 + k * 8 * scale - 0.5, y0, 1, 8 * scale);
        for (let k = 0; k < mods; k++) kit.label(c, mods * 8 * scale / mods >= 56 ? 'module ' + (k + 1) : String(k + 1), x0 + (k + 0.5) * 8 * scale, y0 + 8 * scale + 14, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, fit('DIN → module 1 → … → module ' + mods + ' → DOUT, one chip each, scanned row by row', W - 2 * M, 11), W / 2, y0 + 8 * scale + 38, { size: 11, color: C.faint, align: 'center' });
        kit.label(c, 'current: an estimate, 40 mA peak per LED, one row of eight lit at a time', W / 2, y0 + 8 * scale + 58, { size: 10.5, color: C.faint, align: 'center' });
        const lit = view.lit(), avg = lit * 40 * duty / 8, full = mods * 64 * 40 * duty / 8;
        let rows = [];
        for (let y = 0; y < 8; y++) { let b = 0; for (let x = 0; x < 8; x++) b |= (view.get(x, y) ? 1 : 0) << (7 - x); rows.push(hex2(b)); }
        ro.set('len', mw + ' columns (' + (text.length || 1) + ' characters at 6 columns)');
        ro.set('pass', kit.fmt(mw * ms / 1000, 3) + ' s');
        ro.set('cross', kit.fmt(span * ms / 1000, 3) + ' s');
        ro.set('lit', lit + ' of ' + W8 * 8);
        ro.set('cur', kit.fmt(avg, 3) + ' mA (all dots lit: ' + kit.fmt(full, 3) + ' mA)');
        ro.set('rows', rows.join(' '));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });
})();
