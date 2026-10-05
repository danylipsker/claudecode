/* HYPER-CORE · espsym.js
 *
 * Drawing microcontroller things on a canvas (kit.esym, Hyper.esym) for Hyper ESP32: a development board with its
 * header pins coloured by what they can do, chips and modules, LEDs, buttons and other parts, wires with moving
 * current, logic-analyser traces with decoded bytes, bit boxes and packet layouts, radio rings and signal bars,
 * network pictures (boards, routers, phones, clouds) with messages travelling between them, state-machine diagrams,
 * current-against-time profiles, memory maps, gauges, servos and motors.
 *
 * Every function takes the canvas context first; positions are canvas pixels; colours come from the theme unless
 * given in the options. Nothing here needs the DOM beyond the context it is handed.
 *
 *   S.text  S.box  S.chip  S.module  S.board  S.tile
 *   S.led  S.pixels  S.button  S.pot  S.relay  S.buzzer  S.servo  S.motor  S.battery  S.gauge
 *   S.wire  S.flow  S.breadboard
 *   S.wave  S.analog  S.logic  S.bits  S.frame  S.layers  S.timeline
 *   S.node  S.link  S.msg  S.radio  S.antenna  S.bars
 *   S.fsm
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const S = H.esym = {};
  const PI = Math.PI, TAU = 2 * PI;
  const FALL = { text: '#e7e9f5', text2: '#c3c8e0', muted: '#959cbd', faint: '#677096', accent: '#7b8cff', axis: '#888', grid: 'rgba(128,128,128,.2)', bg: '#0d1020', bg2: '#10142a',
    surface: '#151a31', surface2: '#1a2040', border: '#252d52', border2: '#323c6b', warn: '#e0a030', ok: '#22b37a', bad: '#e5484d', dark: true, hue: (h, a) => 'hsl(' + h + ' 75% 68%' + (a != null ? ' / ' + a : '') + ')' };
  const col = () => (H.ui && H.ui.colors ? H.ui.colors() : FALL);
  const hsl = (h, s, l, a) => 'hsl(' + h + ' ' + s + '% ' + l + '%' + (a != null ? ' / ' + a : '') + ')';
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); r = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2)); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); };

  function text(ctx, str, x, y, o) {
    o = o || {};
    ctx.save();
    ctx.font = (o.weight || 500) + ' ' + (o.size || 12) + 'px ' + (o.mono ? 'Consolas, "Cascadia Code", monospace' : 'system-ui, "Segoe UI", sans-serif');
    ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
    if (o.bg) {
      const w = ctx.measureText(String(str)).width + 8, h = (o.size || 12) + 6;
      const bx = (o.align || 'center') === 'center' ? x - w / 2 : o.align === 'right' ? x - w + 4 : x - 4;
      ctx.fillStyle = o.bg; rr(ctx, bx, y - h / 2, w, h, 4); ctx.fill();
    }
    ctx.fillStyle = o.color || col().muted;
    if (o.rot) { ctx.translate(x, y); ctx.rotate(o.rot); ctx.fillText(String(str), 0, 0); } else ctx.fillText(String(str), x, y);
    ctx.restore();
  }
  S.text = text;

  /* ---------------------------------------------------------------- pin kinds and their colours */
  S.KINDS = {
    power: { name: 'Power', hue: 4 }, gnd: { name: 'Ground', hue: 0, grey: true }, gpio: { name: 'GPIO, safe to use', hue: 140 }, adc: { name: 'Analog input (ADC)', hue: 36 },
    dac: { name: 'Analog output (DAC)', hue: 22 }, touch: { name: 'Touch sensing', hue: 280 }, uart: { name: 'Serial (UART0)', hue: 212 }, i2c: { name: 'I2C default', hue: 186 },
    spi: { name: 'SPI default', hue: 312 }, strap: { name: 'Strapping pin: care at boot', hue: 52 }, flash: { name: 'Used by the flash memory: do not use', hue: 356 },
    input: { name: 'Input only', hue: 168 }, usb: { name: 'USB data', hue: 252 }, ctrl: { name: 'Reset / enable', hue: 330 }, nc: { name: 'Not connected', hue: 0, grey: true }, jtag: { name: 'JTAG', hue: 96 }
  };
  S.kindColor = function (kind, a) {
    const k = S.KINDS[kind] || S.KINDS.gpio, c = col();
    if (k.grey) return c.dark ? 'rgba(150,156,180,' + (a == null ? 1 : a) + ')' : 'rgba(70,76,96,' + (a == null ? 1 : a) + ')';
    return hsl(k.hue, 72, c.dark ? 62 : 42, a);
  };

  /* ---------------------------------------------------------------- blocks, chips, modules */
  /* a labelled block of a block diagram. o: { label, sub, color (css), fill, r, dash, size, active } -> { x, y, w, h, cx, cy, l, r, t, b: mid-side points } */
  S.box = function (ctx, x, y, w, h, o) {
    o = o || {};
    const c = col(), line = o.color || c.muted;
    ctx.save();
    rr(ctx, x, y, w, h, o.r == null ? 8 : o.r);
    ctx.fillStyle = o.fill || (o.active ? (c.dark ? 'rgba(123,140,255,.20)' : 'rgba(60,90,220,.12)') : c.surface);
    ctx.fill();
    ctx.lineWidth = o.active ? 2.2 : 1.4; ctx.strokeStyle = o.active ? (o.color || c.accent) : line;
    if (o.dash) ctx.setLineDash([5, 4]);
    ctx.stroke();
    ctx.restore();
    if (o.label != null) text(ctx, o.label, x + w / 2, y + h / 2 - (o.sub ? 7 : 0), { color: o.textColor || c.text, size: o.size || 12.5, weight: 600 });
    if (o.sub) text(ctx, o.sub, x + w / 2, y + h / 2 + 9, { color: c.muted, size: (o.size || 12.5) - 2 });
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2, l: [x, y + h / 2], r: [x + w, y + h / 2], t: [x + w / 2, y], b: [x + w / 2, y + h] };
  };

  /* a bare chip (QFN): a dark square with pads on four sides. o: { label, sub, pads (per side) } */
  S.chip = function (ctx, x, y, w, h, o) {
    o = o || {};
    const c = col(), n = o.pads == null ? 6 : o.pads;
    ctx.save();
    ctx.fillStyle = c.dark ? '#c9cfdf' : '#8a90a0';
    for (let i = 0; i < n; i++) {
      const fx = x + w * (i + 1) / (n + 1), fy = y + h * (i + 1) / (n + 1), p = Math.max(2, Math.min(w, h) * 0.06);
      ctx.fillRect(fx - p / 2, y - p, p, p); ctx.fillRect(fx - p / 2, y + h, p, p); ctx.fillRect(x - p, fy - p / 2, p, p); ctx.fillRect(x + w, fy - p / 2, p, p);
    }
    rr(ctx, x, y, w, h, 3); ctx.fillStyle = '#1b1e26'; ctx.fill();
    ctx.beginPath(); ctx.arc(x + Math.min(w, h) * 0.12, y + Math.min(w, h) * 0.12, Math.max(1, Math.min(w, h) * 0.04), 0, TAU); ctx.fillStyle = '#596070'; ctx.fill();
    ctx.restore();
    if (o.label != null) text(ctx, o.label, x + w / 2, y + h / 2 - (o.sub ? 6 : 0), { color: '#e8ecf4', size: o.size || Math.max(9, Math.min(13, w / 7)), weight: 600 });
    if (o.sub) text(ctx, o.sub, x + w / 2, y + h / 2 + 8, { color: '#9aa3b8', size: Math.max(8, Math.min(11, w / 9)) });
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
  };

  /* a radio module: a metal can over a PCB with its antenna at the top. o: { label, antenna: 'pcb' | 'ufl' | 'none', pcb: css } */
  S.module = function (ctx, x, y, w, h, o) {
    o = o || {};
    const ant = o.antenna === 'none' ? 0 : h * 0.24;
    ctx.save();
    rr(ctx, x, y, w, h, 2); ctx.fillStyle = o.pcb || '#16181d'; ctx.fill();
    if (o.antenna !== 'none' && o.antenna !== 'ufl') {                      // the meandered PCB trace
      ctx.strokeStyle = '#c9a227'; ctx.lineWidth = Math.max(1, w * 0.035); ctx.lineJoin = 'miter';
      const ax = x + w * 0.12, aw = w * 0.76, ay = y + ant * 0.2, ah = ant * 0.6, n = 5;
      ctx.beginPath(); ctx.moveTo(ax, ay + ah);
      for (let i = 0; i < n; i++) { const xa = ax + aw * i / n, xb = ax + aw * (i + 0.5) / n, xc = ax + aw * (i + 1) / n; ctx.lineTo(xa, ay); ctx.lineTo(xb, ay); ctx.lineTo(xb, ay + ah); ctx.lineTo(xc, ay + ah); }
      ctx.stroke();
    } else if (o.antenna === 'ufl') {
      ctx.beginPath(); ctx.arc(x + w * 0.78, y + ant * 0.55, Math.max(2, w * 0.07), 0, TAU); ctx.fillStyle = '#c9a227'; ctx.fill();
      ctx.beginPath(); ctx.arc(x + w * 0.78, y + ant * 0.55, Math.max(1, w * 0.03), 0, TAU); ctx.fillStyle = '#16181d'; ctx.fill();
    }
    const g = ctx.createLinearGradient(x, y + ant, x + w, y + h);
    if (g && g.addColorStop) { g.addColorStop(0, '#d7dbe3'); g.addColorStop(0.5, '#aeb4c0'); g.addColorStop(1, '#c4c9d4'); }
    rr(ctx, x + w * 0.06, y + ant, w * 0.88, h - ant - h * 0.05, 2); ctx.fillStyle = g && g.addColorStop ? g : '#bcc2ce'; ctx.fill();
    ctx.restore();
    if (o.label != null) text(ctx, o.label, x + w / 2, y + ant + (h - ant) / 2, { color: '#2a2f3a', size: o.size || Math.max(8, Math.min(12, w / 8)), weight: 600 });
    return { x, y, w, h };
  };

  /* a small breakout board (a sensor, a driver): o: { label, sub, color (pcb hue name: 'blue' 'red' 'green' 'purple' 'black'), pins: ['VCC','GND','SDA','SCL'], side: 'bottom' | 'left' | 'right' | 'top' }
     -> { pins: { VCC: [x, y], … }, x, y, w, h } */
  S.tile = function (ctx, x, y, w, h, o) {
    o = o || {};
    const PCB = { blue: '#1d4f9e', red: '#a8252b', green: '#1f7a4a', purple: '#5b2a86', black: '#1b1e26', yellow: '#b8860b', teal: '#127a7a' };
    ctx.save();
    rr(ctx, x, y, w, h, 4); ctx.fillStyle = PCB[o.color] || PCB.blue; ctx.fill();
    ctx.restore();
    if (o.label != null) text(ctx, o.label, x + w / 2, y + h / 2 - (o.sub ? 6 : 0), { color: '#fff', size: o.size || 11.5, weight: 600 });
    if (o.sub) text(ctx, o.sub, x + w / 2, y + h / 2 + 8, { color: 'rgba(255,255,255,.75)', size: 9.5 });
    const pins = {}, list = o.pins || [], side = o.side || 'bottom';
    list.forEach((name, i) => {
      const f = (i + 1) / (list.length + 1);
      const p = side === 'bottom' ? [x + w * f, y + h - 4] : side === 'top' ? [x + w * f, y + 4] : side === 'left' ? [x + 4, y + h * f] : [x + w - 4, y + h * f];
      ctx.beginPath(); ctx.arc(p[0], p[1], 2.6, 0, TAU); ctx.fillStyle = '#e9c46a'; ctx.fill();
      const lp = side === 'bottom' ? [p[0], p[1] - 9] : side === 'top' ? [p[0], p[1] + 9] : side === 'left' ? [p[0] + 6, p[1]] : [p[0] - 6, p[1]];
      text(ctx, name, lp[0], lp[1], { color: 'rgba(255,255,255,.85)', size: 8, align: side === 'left' ? 'left' : side === 'right' ? 'right' : 'center' });
      pins[name] = p;
    });
    return { pins, x, y, w, h };
  };

  /* ---------------------------------------------------------------- a development board
     board: an entry of Hyper.esp.BOARDS (or any { name, chip, headers: [{ side: 'left'|'right', pins: [...] }], size, usb, antenna })
     box: { x, y, w, h } the room it may take.
     o: { labels (true), highlight: { <gpio or label>: css colour }, dim: fn(pin) -> true to fade, hover: index, kindOf: fn(pin) -> kind, title (true) }
     -> { pins: [{ i, label, gpio, kind, x, y (pad), lx, ly (label), side }], rect: { x, y, w, h }, pitch } */
  S.board = function (ctx, board, box, o) {
    o = o || {};
    const c = col(), E = H.esp;
    const heads = (board.headers || []).filter(hd => hd.pins && hd.pins.length);
    const left = heads.find(hd => hd.side === 'left') || heads[0] || { pins: [] };
    const right = heads.find(hd => hd.side === 'right') || heads.find(hd => hd !== left) || { pins: [] };
    const n = Math.max(left.pins.length, right.pins.length, 4);
    const lab = o.labels === false ? 0 : Math.min(118, box.w * 0.27);
    const titleH = o.title === false ? 0 : 20;
    const hasAnt = board.antenna !== 'none';
    const topPad = hasAnt ? 2.4 : 1.2, botPad = 1.9;
    const pitch = clamp((box.h - titleH - 8) / (n + topPad + botPad), 7, 26);
    const mmW = board.size ? board.size[0] : 26;
    const bw = clamp(mmW / 2.54 * pitch, pitch * 4.4, Math.max(pitch * 4.4, box.w - 2 * lab - 16));
    const bh = pitch * (n + topPad + botPad);
    const bx = box.x + (box.w - bw) / 2, by = box.y + titleH + (box.h - titleH - bh) / 2;
    ctx.save();
    // the PCB
    rr(ctx, bx, by, bw, bh, Math.min(8, pitch * 0.5));
    ctx.fillStyle = board.pcb || '#1c2733'; ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = c.dark ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.25)'; ctx.stroke();
    // the module or chip
    const mw = Math.min(bw - pitch * 1.6, pitch * 7), mh = Math.min(bh * 0.46, pitch * 9.5);
    if (board.bare) S.chip(ctx, bx + (bw - mw * 0.6) / 2, by + pitch * topPad, mw * 0.6, mw * 0.6, { label: board.chipLabel || '', pads: 5 });
    else S.module(ctx, bx + (bw - mw) / 2, by + pitch * 0.25, mw, mh, { label: board.moduleLabel || (E && E.chip && board.chip && E.chip(board.chip) ? E.chip(board.chip).name : ''), antenna: hasAnt ? (board.antenna === 'ufl' ? 'ufl' : 'pcb') : 'none' });
    // the USB socket and the two buttons
    const uw = Math.min(bw * 0.34, pitch * 3.2), uh = pitch * 1.25;
    rr(ctx, bx + (bw - uw) / 2, by + bh - uh + 3, uw, uh, 2.5); ctx.fillStyle = '#b9bfcc'; ctx.fill();
    text(ctx, (board.usb && board.usb.conn) || 'USB', bx + bw / 2, by + bh - uh / 2 + 3, { color: '#3a4050', size: Math.min(9, pitch * 0.55) });
    if (pitch > 9) {
      for (const [fx, name] of [[0.2, board.buttons && board.buttons[0] || 'EN'], [0.8, board.buttons && board.buttons[1] || 'BOOT']]) {
        const cx = bx + bw * fx, cy = by + bh - pitch * 2.3;
        if (cy < by + pitch * 0.25 + mh + 4) break;
        rr(ctx, cx - pitch * 0.42, cy - pitch * 0.42, pitch * 0.84, pitch * 0.84, 2); ctx.fillStyle = '#d6dae2'; ctx.fill();
        ctx.beginPath(); ctx.arc(cx, cy, pitch * 0.22, 0, TAU); ctx.fillStyle = '#2b3140'; ctx.fill();
        if (bw > pitch * 6) text(ctx, name, cx, cy + pitch * 0.85, { color: 'rgba(255,255,255,.6)', size: Math.min(8, pitch * 0.5) });
      }
    }
    ctx.restore();
    if (titleH) text(ctx, board.name || '', box.x + box.w / 2, box.y + 9, { color: c.text, size: 12.5, weight: 650 });
    // the pins
    const pins = [];
    const kindOf = o.kindOf || (p => (E && E.pinKind ? E.pinKind(board.chip, p) : (p.gpio == null ? (/GND/i.test(p.label) ? 'gnd' : 'power') : 'gpio')));
    const each = (hd, side) => hd.pins.forEach((raw, i) => {
      const p = E && E.parsePin ? E.parsePin(raw) : { label: String(raw), gpio: /^\d+$/.test(String(raw)) ? +raw : null };
      const px = side === 'left' ? bx + pitch * 0.5 : bx + bw - pitch * 0.5, py = by + pitch * (topPad + i + 0.5);
      const kind = kindOf(p);
      const hl = o.highlight && (o.highlight[p.gpio] != null && p.gpio != null ? o.highlight[p.gpio] : o.highlight[p.label]);
      const faded = o.dim && o.dim(p);
      const idx = pins.length;
      ctx.save();
      ctx.globalAlpha = faded ? 0.28 : 1;
      // the pad
      ctx.beginPath(); ctx.arc(px, py, Math.max(2, pitch * 0.26), 0, TAU); ctx.fillStyle = '#e9c46a'; ctx.fill();
      ctx.beginPath(); ctx.arc(px, py, Math.max(1, pitch * 0.11), 0, TAU); ctx.fillStyle = '#3a3320'; ctx.fill();
      // the label pill
      let lx = px, ly = py;
      if (lab) {
        const lw = lab - 10, lh = Math.min(pitch - 2, 17);
        const x0 = side === 'left' ? bx - 6 - lw : bx + bw + 6;
        lx = side === 'left' ? x0 : x0 + lw;
        ctx.beginPath(); ctx.moveTo(side === 'left' ? bx - 6 : bx + bw + 6, py); ctx.lineTo(px, py); ctx.strokeStyle = S.kindColor(kind, 0.5); ctx.lineWidth = 1; ctx.stroke();
        rr(ctx, x0, py - lh / 2, lw, lh, lh / 2);
        ctx.fillStyle = hl || S.kindColor(kind, o.hover === idx ? 0.55 : 0.2); ctx.fill();
        if (o.hover === idx || hl) { ctx.strokeStyle = hl || S.kindColor(kind); ctx.lineWidth = 1.5; ctx.stroke(); }
        const shown = p.gpio != null && p.label !== String(p.gpio) && !/^(GPIO|IO)?\d+$/.test(p.label) ? p.label + ' · ' + p.gpio : (p.gpio != null ? 'GPIO' + p.gpio : p.label);
        text(ctx, shown, x0 + lw / 2, py + 0.5, { color: hl ? '#fff' : c.text, size: Math.min(11, lh - 4.5), weight: 600, mono: true });
      } else if (hl) { ctx.beginPath(); ctx.arc(px, py, pitch * 0.42, 0, TAU); ctx.strokeStyle = hl; ctx.lineWidth = 2; ctx.stroke(); }
      ctx.restore();
      pins.push({ i: idx, label: p.label, gpio: p.gpio, kind, x: px, y: py, lx, ly, side, raw });
    });
    each(left, 'left'); each(right, 'right');
    return { pins, rect: { x: bx, y: by, w: bw, h: bh }, pitch, labelW: lab };
  };
  /* which pin of a drawn board is under a point: -> its index, or -1 */
  S.boardHit = function (drawn, x, y) {
    const lw = drawn.labelW - 10;
    for (const p of drawn.pins) {
      const x0 = p.side === 'left' ? drawn.rect.x - 6 - lw : drawn.rect.x + drawn.rect.w - drawn.pitch;
      const x1 = p.side === 'left' ? drawn.rect.x + drawn.pitch : drawn.rect.x + drawn.rect.w + 6 + lw;
      if (x >= x0 && x <= x1 && Math.abs(y - p.y) <= drawn.pitch / 2) return p.i;
    }
    return -1;
  };

  /* ---------------------------------------------------------------- parts */
  /* an LED: o: { color (css or hue number), on (true or 0…1), r, label } */
  S.led = function (ctx, x, y, o) {
    o = o || {};
    const r = o.r || 9, on = o.on === true ? 1 : clamp(+o.on || 0, 0, 1);
    const hue = typeof o.color === 'number' ? o.color : null;
    const lit = hue != null ? hsl(hue, 95, 60) : (o.color || '#ff4136'), dim = hue != null ? hsl(hue, 45, 26) : 'rgba(120,60,60,.55)';
    ctx.save();
    if (on > 0.02) {
      const g = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * (1.6 + 1.6 * on));
      if (g && g.addColorStop) { g.addColorStop(0, lit); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.globalAlpha = 0.25 + 0.5 * on; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * (1.6 + 1.6 * on), 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
    }
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = dim; ctx.fill();
    if (on > 0) { ctx.globalAlpha = 0.25 + 0.75 * on; ctx.fillStyle = lit; ctx.fill(); ctx.globalAlpha = 1; }
    ctx.lineWidth = 1.2; ctx.strokeStyle = col().dark ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.35)'; ctx.stroke();
    ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.22, 0, TAU); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill();
    ctx.restore();
    if (o.label != null) text(ctx, o.label, x, y + r + 10, { size: 11 });
  };
  /* a row (or column) of addressable LEDs: colours as css strings or [r, g, b] 0–255. o: { r, gap, vertical, cols (wrap into a matrix), serpentine } */
  S.pixels = function (ctx, x, y, colours, o) {
    o = o || {};
    const r = o.r || 7, gap = o.gap == null ? r * 0.7 : o.gap, step = 2 * r + gap, cols = o.cols || (o.vertical ? 1 : colours.length);
    const pos = [];
    colours.forEach((cc, i) => {
      let row = Math.floor(i / cols), cix = i % cols;
      if (o.serpentine && row % 2) cix = cols - 1 - cix;
      const px = x + r + cix * step, py = y + r + row * step;
      const css = Array.isArray(cc) ? 'rgb(' + cc.map(v => clamp(Math.round(v), 0, 255)).join(',') + ')' : cc;
      const lum = Array.isArray(cc) ? Math.max(cc[0], cc[1], cc[2]) / 255 : 1;
      ctx.save();
      rr(ctx, px - r - 1.5, py - r - 1.5, 2 * r + 3, 2 * r + 3, 3); ctx.fillStyle = '#e8e8e2'; ctx.fill();
      if (lum > 0.03) { ctx.shadowColor = css; ctx.shadowBlur = 4 + 10 * lum; }
      ctx.beginPath(); ctx.arc(px, py, r * 0.8, 0, TAU); ctx.fillStyle = lum > 0.03 ? css : '#3b3f4a'; ctx.fill();
      ctx.restore();
      pos.push([px, py]);
    });
    return pos;
  };
  /* a push button seen from above. o: { pressed, size, label, color } */
  S.button = function (ctx, x, y, o) {
    o = o || {};
    const s = o.size || 26, c = col();
    ctx.save();
    rr(ctx, x - s / 2, y - s / 2, s, s, 4); ctx.fillStyle = c.dark ? '#3a4052' : '#c9cedb'; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, s * (o.pressed ? 0.28 : 0.33), 0, TAU);
    ctx.fillStyle = o.pressed ? (o.color || c.accent) : (c.dark ? '#11141d' : '#454b5c'); ctx.fill();
    ctx.restore();
    if (o.label != null) text(ctx, o.label, x, y + s / 2 + 10, { size: 11 });
    return { x: x - s / 2, y: y - s / 2, w: s, h: s };
  };
  /* a potentiometer knob: frac 0…1 over 270° */
  S.pot = function (ctx, x, y, r, frac, o) {
    o = o || {};
    const c = col(), a = (-135 + 270 * clamp(frac || 0, 0, 1)) * PI / 180 - PI / 2;
    ctx.save();
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = c.dark ? '#2c3244' : '#d5d9e4'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = c.muted; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, r + 4, (-225) * PI / 180, (-225 + 270 * clamp(frac || 0, 0, 1)) * PI / 180); ctx.strokeStyle = o.color || c.accent; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * 0.85, y + Math.sin(a) * r * 0.85); ctx.strokeStyle = c.text; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke();
    ctx.restore();
    if (o.label != null) text(ctx, o.label, x, y + r + 14, { size: 11 });
  };
  /* a relay module: contacts open or closed. o: { label } -> { com, no, nc, coil: points } */
  S.relay = function (ctx, x, y, on, o) {
    o = o || {};
    const c = col(), w = 64, h = 46;
    ctx.save();
    rr(ctx, x, y, w, h, 5); ctx.fillStyle = '#1e5fb3'; ctx.fill();
    text(ctx, o.label || 'RELAY', x + w / 2, y + 10, { color: '#fff', size: 9.5, weight: 600 });
    const com = [x + w - 8, y + h / 2 + 6], no = [x + w - 30, y + h - 9], nc = [x + w - 30, y + h / 2 - 2];
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(com[0], com[1]); const tgt = on ? no : nc; ctx.lineTo(tgt[0] + 3, tgt[1]); ctx.stroke();
    for (const p of [com, no, nc]) { ctx.beginPath(); ctx.arc(p[0], p[1], 2.6, 0, TAU); ctx.fillStyle = '#e9c46a'; ctx.fill(); }
    ctx.beginPath(); ctx.arc(x + 12, y + h - 11, 4, 0, TAU); ctx.fillStyle = on ? '#ff4136' : '#5a2a2a'; ctx.fill();
    ctx.restore();
    return { com, no, nc, coil: [x, y + h / 2], x, y, w, h };
  };
  S.buzzer = function (ctx, x, y, on, o) {
    o = o || {};
    const r = o.r || 13, c = col();
    ctx.save();
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = '#16181d'; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r * 0.22, 0, TAU); ctx.fillStyle = '#4a5060'; ctx.fill();
    if (on) { ctx.strokeStyle = o.color || c.accent; ctx.lineWidth = 1.6; for (let i = 1; i <= 3; i++) { ctx.globalAlpha = 1 - i * 0.25; ctx.beginPath(); ctx.arc(x, y, r + i * 5 + ((o.phase || 0) % 1) * 5, -0.6, 0.6); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, r + i * 5 + ((o.phase || 0) % 1) * 5, PI - 0.6, PI + 0.6); ctx.stroke(); } }
    ctx.restore();
  };
  /* a hobby servo seen from above with its horn at `angle` degrees (0–180). o: { size, label } */
  S.servo = function (ctx, x, y, angle, o) {
    o = o || {};
    const s = o.size || 44, c = col(), a = (clamp(angle || 0, -10, 190) - 90) * PI / 180 - PI / 2;
    ctx.save();
    rr(ctx, x - s * 0.5, y - s * 0.28, s, s * 0.56, 4); ctx.fillStyle = '#2456a6'; ctx.fill();
    rr(ctx, x - s * 0.66, y - s * 0.12, s * 1.32, s * 0.24, 3); ctx.fillStyle = '#1d4688'; ctx.fill();
    const hx = x + s * 0.22, hy = y;
    ctx.translate(hx, hy); ctx.rotate(a + PI / 2);
    rr(ctx, -s * 0.07, -s * 0.52, s * 0.14, s * 0.6, s * 0.07); ctx.fillStyle = '#f2f3f5'; ctx.fill();
    ctx.setTransform ? ctx.restore() : ctx.restore();
    ctx.save();
    ctx.beginPath(); ctx.arc(hx, hy, s * 0.1, 0, TAU); ctx.fillStyle = '#d9dce3'; ctx.fill(); ctx.strokeStyle = '#555'; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();
    if (o.label != null) text(ctx, o.label, x, y + s * 0.5 + 8, { size: 11, color: c.muted });
  };
  /* a motor shaft seen end-on, turned by `angle` radians. o: { label, color, kind: 'dc' | 'step' | 'bldc' } */
  S.motor = function (ctx, x, y, r, angle, o) {
    o = o || {};
    const c = col();
    ctx.save();
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = c.dark ? '#2c3244' : '#d5d9e4'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = c.muted; ctx.stroke();
    if (o.kind === 'step') { ctx.strokeStyle = c.faint; ctx.lineWidth = 1; for (let i = 0; i < 24; i++) { const t = i * TAU / 24; ctx.beginPath(); ctx.moveTo(x + Math.cos(t) * r * 0.86, y + Math.sin(t) * r * 0.86); ctx.lineTo(x + Math.cos(t) * r * 0.98, y + Math.sin(t) * r * 0.98); ctx.stroke(); } }
    ctx.translate(x, y); ctx.rotate(angle || 0);
    ctx.fillStyle = o.color || c.accent;
    rr(ctx, -r * 0.12, -r * 0.8, r * 0.24, r * 1.6, r * 0.1); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -r * 0.62, r * 0.14, 0, TAU); ctx.fillStyle = c.text; ctx.fill();
    ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * 0.16, 0, TAU); ctx.fillStyle = c.text; ctx.fill(); ctx.restore();
    if (o.label != null) text(ctx, o.label, x, y + r + 12, { size: 11 });
  };
  /* a battery with its charge. o: { label, charging, vertical } */
  S.battery = function (ctx, x, y, w, h, frac, o) {
    o = o || {};
    const c = col(), f = clamp(frac == null ? 1 : frac, 0, 1);
    ctx.save();
    rr(ctx, x, y, w, h, 4); ctx.lineWidth = 1.8; ctx.strokeStyle = c.text2 || c.muted; ctx.stroke();
    rr(ctx, x + w, y + h * 0.3, Math.max(3, w * 0.06), h * 0.4, 1.5); ctx.fillStyle = c.text2 || c.muted; ctx.fill();
    rr(ctx, x + 3, y + 3, Math.max(0, (w - 6) * f), h - 6, 2); ctx.fillStyle = f < 0.15 ? c.bad : f < 0.35 ? c.warn : c.ok; ctx.fill();
    if (o.charging) { ctx.fillStyle = c.text; ctx.beginPath(); const cx = x + w / 2, cy = y + h / 2, s = h * 0.32; ctx.moveTo(cx + s * 0.2, cy - s); ctx.lineTo(cx - s * 0.5, cy + s * 0.1); ctx.lineTo(cx, cy + s * 0.1); ctx.lineTo(cx - s * 0.2, cy + s); ctx.lineTo(cx + s * 0.5, cy - s * 0.1); ctx.lineTo(cx, cy - s * 0.1); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    if (o.label != null) text(ctx, o.label, x + w / 2, y + h + 10, { size: 11 });
  };
  /* a dial. frac 0…1. o: { label, value (text in the middle), color, ticks, zones: [[from, to, css], …] (fractions) } */
  S.gauge = function (ctx, cx, cy, r, frac, o) {
    o = o || {};
    const c = col(), a0 = 0.75 * PI, sweep = 1.5 * PI, f = clamp(frac || 0, 0, 1);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineWidth = Math.max(4, r * 0.14);
    ctx.beginPath(); ctx.arc(cx, cy, r, a0, a0 + sweep); ctx.strokeStyle = c.border2 || c.faint; ctx.stroke();
    for (const z of (o.zones || [])) { ctx.beginPath(); ctx.arc(cx, cy, r, a0 + sweep * z[0], a0 + sweep * z[1]); ctx.strokeStyle = z[2]; ctx.globalAlpha = 0.55; ctx.stroke(); ctx.globalAlpha = 1; }
    if (f > 0.001) { ctx.beginPath(); ctx.arc(cx, cy, r, a0, a0 + sweep * f); ctx.strokeStyle = o.color || c.accent; ctx.stroke(); }
    const a = a0 + sweep * f;
    ctx.lineWidth = 2.5; ctx.strokeStyle = c.text; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * r * 0.78, cy + Math.sin(a) * r * 0.78); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, Math.max(2.5, r * 0.07), 0, TAU); ctx.fillStyle = c.text; ctx.fill();
    ctx.restore();
    if (o.value != null) text(ctx, o.value, cx, cy + r * 0.5, { color: c.text, size: Math.max(11, r * 0.26), weight: 650 });
    if (o.label != null) text(ctx, o.label, cx, cy + r * 0.5 + Math.max(13, r * 0.28), { size: 11 });
  };

  /* ---------------------------------------------------------------- wires */
  /* a wire through points. o: { color, width, dash, round (corner radius) } */
  S.wire = function (ctx, pts, o) {
    o = o || {};
    if (!pts || pts.length < 2) return;
    ctx.save();
    ctx.strokeStyle = o.color || col().muted; ctx.lineWidth = o.width || 2.2; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (o.dash) ctx.setLineDash(Array.isArray(o.dash) ? o.dash : [5, 4]);
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    const r = o.round == null ? 6 : o.round;
    for (let i = 1; i < pts.length; i++) { if (i < pts.length - 1 && r > 0 && ctx.arcTo) ctx.arcTo(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], r); else ctx.lineTo(pts[i][0], pts[i][1]); }
    ctx.stroke();
    ctx.restore();
  };
  /* dots moving along a path: advance `phase` (pixels) by speed × dt. o: { color, r, gap } */
  S.flow = function (ctx, pts, phase, o) {
    o = o || {};
    if (!pts || pts.length < 2) return;
    const gap = o.gap || 18, r = o.r || 2.4;
    let total = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); total += d; }
    if (!(total > 0)) return;
    ctx.save(); ctx.fillStyle = o.color || col().accent;
    let s = ((phase % gap) + gap) % gap;
    for (; s < total; s += gap) {
      let d = s, i = 0;
      while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; }
      const f = seg[i] ? d / seg[i] : 0;
      ctx.beginPath(); ctx.arc(pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f, r, 0, TAU); ctx.fill();
    }
    ctx.restore();
  };
  /* a solderless breadboard with `cols` columns: -> { hole(col, row) -> [x, y], w, h }; rows 0–4 above the gap ('a'–'e'), 5–9 below, -1 and 10 the power rails */
  S.breadboard = function (ctx, x, y, cols, o) {
    o = o || {};
    const p = o.pitch || 12, c = col(), w = (cols + 1) * p, h = p * 15;
    const rowY = r => y + p * (r < 0 ? 1 : r < 5 ? 3 + r : r < 10 ? 4.5 + r : 13.9);
    ctx.save();
    rr(ctx, x, y, w, h, 5); ctx.fillStyle = c.dark ? '#d9d6cc' : '#efece2'; ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.10)'; ctx.fillRect(x + 4, y + p * 8, w - 8, p * 1.1);
    ctx.strokeStyle = '#d94a4a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + p * 0.6, y + p * 0.45); ctx.lineTo(x + w - p * 0.6, y + p * 0.45); ctx.moveTo(x + p * 0.6, y + h - p * 0.5); ctx.lineTo(x + w - p * 0.6, y + h - p * 0.5); ctx.stroke();
    ctx.fillStyle = '#3d3d3a';
    for (let i = 0; i < cols; i++) for (const r of [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) { ctx.beginPath(); ctx.arc(x + p * (i + 1), rowY(r), Math.max(1, p * 0.13), 0, TAU); ctx.fill(); }
    ctx.restore();
    return { hole: (i, r) => [x + p * (clamp(i, 0, cols - 1) + 1), rowY(r)], w, h, pitch: p };
  };

  /* ---------------------------------------------------------------- signals */
  /* a digital trace. edges: [[t, level], …] in time order (level 0 or 1; the first entry sets the starting level).
     o: { t0, t1 (the time window), color, label, fill, width, idle (level before the first edge) } */
  S.wave = function (ctx, x, y, w, h, edges, o) {
    o = o || {};
    const c = col(), t0 = o.t0 == null ? (edges.length ? edges[0][0] : 0) : o.t0, t1 = o.t1 == null ? (edges.length ? edges[edges.length - 1][0] : 1) : o.t1;
    const span = t1 - t0 || 1, X = t => x + clamp((t - t0) / span, 0, 1) * w, Y = v => y + h - (v ? 1 : 0) * h;
    let lvl = o.idle == null ? (edges.length ? edges[0][1] : 0) : o.idle;
    for (const [t, v] of edges) { if (t < t0) lvl = v; else break; }      // the level the window opens at
    ctx.save();
    ctx.beginPath(); ctx.moveTo(x, Y(lvl));
    for (const [t, v] of edges) { if (t < t0) continue; if (t > t1) break; ctx.lineTo(X(t), Y(lvl)); lvl = v; ctx.lineTo(X(t), Y(lvl)); }
    ctx.lineTo(x + w, Y(lvl));
    if (o.fill) { ctx.save(); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath(); ctx.globalAlpha = 0.14; ctx.fillStyle = o.color || c.accent; ctx.fill(); ctx.restore(); }
    ctx.strokeStyle = o.color || c.accent; ctx.lineWidth = o.width || 2; ctx.lineJoin = 'miter'; ctx.stroke();
    ctx.restore();
    if (o.label != null) text(ctx, o.label, x - 6, y + h / 2, { align: 'right', size: 11, color: c.text2 || c.muted });
    return { X, Y };
  };
  /* square-wave edges for a PWM signal: -> [[t, level], …] over [t0, t1] */
  S.pwmEdges = function (freq, duty, t0, t1, phase) {
    const out = [], T = 1 / Math.max(1e-9, freq), d = clamp(duty, 0, 1);
    if (d <= 0) return [[t0, 0]];
    if (d >= 1) return [[t0, 1]];
    let k = Math.floor((t0 - (phase || 0)) / T) - 1, guard = 0;
    for (; guard++ < 4000; k++) {
      const a = (phase || 0) + k * T;
      if (a > t1) break;
      out.push([a, 1], [a + d * T, 0]);
    }
    return out;
  };
  /* an analogue trace: pts [[t, v], …] or a function of t. o: { t0, t1, min, max, color, label, zero (draw the zero line), width, steps } */
  S.analog = function (ctx, x, y, w, h, src, o) {
    o = o || {};
    const c = col();
    let pts = src;
    const t0 = o.t0 == null ? (Array.isArray(src) && src.length ? src[0][0] : 0) : o.t0, t1 = o.t1 == null ? (Array.isArray(src) && src.length ? src[src.length - 1][0] : 1) : o.t1;
    if (typeof src === 'function') { pts = []; const n = o.steps || Math.max(40, Math.round(w / 2)); for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; pts.push([t, src(t)]); } }
    const vs = pts.map(p => p[1]).filter(Number.isFinite);
    const lo = o.min != null ? o.min : (vs.length ? Math.min(...vs) : 0), hi = o.max != null ? o.max : (vs.length ? Math.max(...vs) : 1), sp = hi - lo || 1, ts = t1 - t0 || 1;
    const X = t => x + clamp((t - t0) / ts, 0, 1) * w, Y = v => y + h - clamp((v - lo) / sp, 0, 1) * h;
    ctx.save();
    if (o.zero && lo < 0 && hi > 0) { ctx.strokeStyle = c.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, Y(0)); ctx.lineTo(x + w, Y(0)); ctx.stroke(); }
    ctx.beginPath();
    let started = false;
    for (const [t, v] of pts) { if (!Number.isFinite(v) || t < t0 || t > t1) continue; if (started) ctx.lineTo(X(t), Y(v)); else { ctx.moveTo(X(t), Y(v)); started = true; } }
    ctx.strokeStyle = o.color || c.accent; ctx.lineWidth = o.width || 2; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.restore();
    if (o.label != null) text(ctx, o.label, x - 6, y + h / 2, { align: 'right', size: 11, color: c.text2 || c.muted });
    return { X, Y, lo, hi };
  };
  /* a logic analyser: several traces over one time window, with decoded marks above them.
     traces: [{ label, edges: [[t, level], …] | pts: [[t, v], …] (analogue), color, marks: [{ t0, t1, text, color }] }]
     o: { t0, t1, cursor (a time), unit: 's'|'ms'|'µs' (for the scale), grid: divisions, labelW } -> { X(t), rowY(i) } */
  S.logic = function (ctx, x, y, w, h, traces, o) {
    o = o || {};
    const c = col(), lw = o.labelW == null ? 46 : o.labelW, px = x + lw, pw = w - lw, n = Math.max(1, traces.length);
    const t0 = o.t0 || 0, t1 = o.t1 == null ? 1 : o.t1, span = t1 - t0 || 1;
    const rowH = (h - 16) / n, X = t => px + clamp((t - t0) / span, 0, 1) * pw;
    ctx.save();
    rr(ctx, px, y, pw, h - 16, 4); ctx.fillStyle = c.dark ? 'rgba(0,0,0,.28)' : 'rgba(0,0,0,.04)'; ctx.fill();
    const div = o.grid || 10;
    ctx.strokeStyle = c.grid; ctx.lineWidth = 1; ctx.beginPath();
    for (let i = 1; i < div; i++) { const gx = Math.round(px + pw * i / div) + 0.5; ctx.moveTo(gx, y); ctx.lineTo(gx, y + h - 16); }
    ctx.stroke();
    ctx.restore();
    const unit = o.unit || (span < 2e-3 ? 'µs' : span < 2 ? 'ms' : 's'), k = unit === 'µs' ? 1e6 : unit === 'ms' ? 1e3 : 1;
    text(ctx, H.util.fmt(t0 * k, 3) + ' ' + unit, px, y + h - 6, { align: 'left', size: 10 });
    text(ctx, H.util.fmt(t1 * k, 3) + ' ' + unit, px + pw, y + h - 6, { align: 'right', size: 10 });
    text(ctx, H.util.fmt(span / div * k, 3) + ' ' + unit + ' / div', px + pw / 2, y + h - 6, { size: 10 });
    traces.forEach((tr, i) => {
      const ty = y + i * rowH + rowH * 0.34, th = rowH * 0.5;
      text(ctx, tr.label || '', px - 6, ty + th / 2, { align: 'right', size: 11, color: tr.color || c.text2 || c.muted, weight: 600 });
      if (tr.pts) S.analog(ctx, px, ty, pw, th, tr.pts, { t0, t1, min: tr.min, max: tr.max, color: tr.color || c.series && c.series[i % 7] });
      else S.wave(ctx, px, ty, pw, th, tr.edges || [], { t0, t1, color: tr.color || (c.series && c.series[i % 7]) || c.accent, idle: tr.idle, width: 1.8 });
      for (const m of (tr.marks || [])) {
        if (m.t1 < t0 || m.t0 > t1) continue;
        const xa = X(m.t0), xb = X(m.t1), my = y + i * rowH + 1, mh = rowH * 0.27;
        if (xb - xa < 3) continue;
        ctx.save(); rr(ctx, xa + 0.5, my, xb - xa - 1, mh, 3); ctx.fillStyle = m.color || (c.dark ? 'rgba(123,140,255,.28)' : 'rgba(60,90,220,.16)'); ctx.fill(); ctx.restore();
        if (xb - xa > 16 && m.text != null) text(ctx, m.text, (xa + xb) / 2, my + mh / 2 + 0.5, { size: Math.min(10.5, mh - 1), color: c.text, mono: true });
      }
    });
    if (o.cursor != null && o.cursor >= t0 && o.cursor <= t1) { ctx.save(); ctx.strokeStyle = c.warn; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(X(o.cursor), y); ctx.lineTo(X(o.cursor), y + h - 16); ctx.stroke(); ctx.restore(); }
    return { X, rowY: i => y + i * rowH + rowH * 0.34, rowH, plot: { x: px, y, w: pw, h: h - 16 } };
  };
  /* a number as a row of bit boxes. o: { n (bits, default 8), cell, msbFirst (true), labels: ['D7', …] or true for bit numbers, hi: [indexes to tint], color, title } -> width */
  S.bits = function (ctx, x, y, value, o) {
    o = o || {};
    const c = col(), n = o.n || (Array.isArray(value) ? value.length : 8), cell = o.cell || 22;
    const bit = i => Array.isArray(value) ? (value[i] ? 1 : 0) : ((value >>> (o.msbFirst === false ? i : n - 1 - i)) & 1);
    for (let i = 0; i < n; i++) {
      const b = bit(i), bx = x + i * cell, tint = o.hi && o.hi.includes(i);
      ctx.save();
      rr(ctx, bx + 1, y + 1, cell - 2, cell - 2, 3);
      ctx.fillStyle = b ? (o.color || c.accent) : (c.dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)'); ctx.globalAlpha = b ? 0.85 : 1; ctx.fill(); ctx.globalAlpha = 1;
      ctx.lineWidth = tint ? 2 : 1; ctx.strokeStyle = tint ? c.warn : (c.border2 || c.faint); ctx.stroke();
      ctx.restore();
      text(ctx, String(b), bx + cell / 2, y + cell / 2 + 0.5, { color: b ? '#fff' : c.muted, size: Math.min(13, cell * 0.55), weight: 650, mono: true });
      if (o.labels) text(ctx, o.labels === true ? String(o.msbFirst === false ? i : n - 1 - i) : (o.labels[i] || ''), bx + cell / 2, y + cell + 8, { size: 9.5, color: c.faint });
    }
    if (o.title != null) text(ctx, o.title, x - 6, y + cell / 2, { align: 'right', size: 11 });
    return n * cell;
  };
  /* a packet or frame as labelled fields in a row. fields: [{ label, size (relative width), value, color (css or hue), sub }]. o: { h, gap } -> boxes */
  S.frame = function (ctx, x, y, w, fields, o) {
    o = o || {};
    const c = col(), h = o.h || 34, total = fields.reduce((a, f) => a + (f.size || 1), 0) || 1, out = [];
    let fx = x;
    fields.forEach((f, i) => {
      const fw = w * (f.size || 1) / total, hue = typeof f.color === 'number' ? f.color : null;
      ctx.save();
      rr(ctx, fx + 1, y, fw - 2, h, 4);
      ctx.fillStyle = hue != null ? hsl(hue, 60, c.dark ? 32 : 82) : (f.color || c.surface2 || c.surface); ctx.fill();
      ctx.lineWidth = 1.2; ctx.strokeStyle = hue != null ? hsl(hue, 65, c.dark ? 60 : 42) : (c.border2 || c.faint); ctx.stroke();
      ctx.restore();
      if (fw > 22) text(ctx, f.label || '', fx + fw / 2, y + h / 2 - (f.value != null ? 6 : 0), { color: c.text, size: Math.min(11.5, fw / 4 + 6), weight: 600 });
      if (f.value != null && fw > 22) text(ctx, f.value, fx + fw / 2, y + h / 2 + 8, { color: c.text2 || c.muted, size: 10, mono: true });
      if (f.sub != null) text(ctx, f.sub, fx + fw / 2, y + h + 9, { size: 9.5, color: c.faint });
      out.push({ x: fx, y, w: fw, h });
      fx += fw;
    });
    return out;
  };
  /* stacked layers: a memory map, a flash layout, a protocol stack. layers (top to bottom): [{ label, sub, size (relative height), color (css or hue), right (text at the right edge) }]
     o: { h (total height), minRow } -> boxes */
  S.layers = function (ctx, x, y, w, layers, o) {
    o = o || {};
    const c = col(), Hh = o.h || layers.length * 30, total = layers.reduce((a, l) => a + (l.size || 1), 0) || 1, minRow = o.minRow || 16, out = [];
    // give every layer at least minRow, share the rest by size
    const free = Math.max(0, Hh - minRow * layers.length);
    let ly = y;
    layers.forEach(l => {
      const lh = minRow + free * (l.size || 1) / total, hue = typeof l.color === 'number' ? l.color : null;
      ctx.save();
      rr(ctx, x, ly + 1, w, lh - 2, 4);
      ctx.fillStyle = hue != null ? hsl(hue, 58, c.dark ? 30 : 84) : (l.color || c.surface2 || c.surface); ctx.fill();
      ctx.lineWidth = 1.2; ctx.strokeStyle = hue != null ? hsl(hue, 62, c.dark ? 58 : 44) : (c.border2 || c.faint); ctx.stroke();
      ctx.restore();
      text(ctx, l.label || '', x + 10, ly + lh / 2 - (l.sub && lh > 30 ? 6 : 0), { align: 'left', color: c.text, size: 11.5, weight: 600 });
      if (l.sub && lh > 30) text(ctx, l.sub, x + 10, ly + lh / 2 + 8, { align: 'left', size: 10 });
      if (l.right != null) text(ctx, l.right, x + w - 8, ly + lh / 2, { align: 'right', size: 10.5, mono: true, color: c.text2 || c.muted });
      out.push({ x, y: ly, w, h: lh });
      ly += lh;
    });
    return out;
  };
  /* current against time, as a battery sees it. segs: [{ dur (s), mA, label, color }]. o: { log (true: the mA axis is logarithmic), min, max (mA), cursor (s) }
     -> { avg (mA), total (s), X(t), Y(mA) } */
  S.timeline = function (ctx, x, y, w, h, segs, o) {
    o = o || {};
    const c = col(), total = segs.reduce((a, s) => a + Math.max(0, s.dur), 0) || 1;
    const avg = segs.reduce((a, s) => a + Math.max(0, s.dur) * s.mA, 0) / total;
    const log = o.log !== false;
    const lo = o.min || (log ? Math.max(1e-4, Math.min(...segs.map(s => s.mA).filter(v => v > 0), 0.01) / 2) : 0), hi = o.max || Math.max(...segs.map(s => s.mA), lo * 10) * 1.3;
    const Y = v => log ? y + h - clamp(Math.log(Math.max(v, lo) / lo) / Math.log(hi / lo), 0, 1) * h : y + h - clamp((v - lo) / (hi - lo), 0, 1) * h;
    const X = t => x + clamp(t / total, 0, 1) * w;
    ctx.save();
    ctx.strokeStyle = c.grid; ctx.lineWidth = 1;
    if (log) for (let e = Math.ceil(Math.log10(lo)); e <= Math.floor(Math.log10(hi)); e++) { const v = Math.pow(10, e), gy = Math.round(Y(v)) + 0.5; ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x + w, gy); ctx.stroke(); text(ctx, v >= 1 ? v + ' mA' : Math.round(v * 1000) + ' µA', x - 5, gy, { align: 'right', size: 9.5 }); }
    let t = 0;
    segs.forEach((s, i) => {
      const xa = X(t), xb = X(t + Math.max(0, s.dur)), yy = Y(s.mA);
      ctx.fillStyle = s.color || (c.series ? c.series[i % 7] : c.accent); ctx.globalAlpha = 0.55;
      ctx.fillRect(xa, yy, Math.max(1, xb - xa), y + h - yy); ctx.globalAlpha = 1;
      if (xb - xa > 34 && s.label) text(ctx, s.label, (xa + xb) / 2, Math.max(y + 9, yy - 9), { size: 10, color: c.text2 || c.muted });
      t += Math.max(0, s.dur);
    });
    ctx.setLineDash([5, 4]); ctx.strokeStyle = c.warn; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x, Y(avg)); ctx.lineTo(x + w, Y(avg)); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = c.axis; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.stroke();
    if (o.cursor != null) { ctx.strokeStyle = c.text; ctx.beginPath(); ctx.moveTo(X(o.cursor), y); ctx.lineTo(X(o.cursor), y + h); ctx.stroke(); }
    ctx.restore();
    text(ctx, 'average ' + (avg >= 1 ? H.util.fmt(avg, 3) + ' mA' : H.util.fmt(avg * 1000, 3) + ' µA'), x + w - 4, Y(avg) - 8, { align: 'right', size: 10.5, color: c.warn });
    return { avg, total, X, Y };
  };

  /* ---------------------------------------------------------------- networks and radio */
  const ICON = {
    esp(ctx, x, y, r) { rr(ctx, x - r * 0.62, y - r * 0.8, r * 1.24, r * 1.6, r * 0.12); ctx.fill(); ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.75)'; rr(ctx, x - r * 0.4, y - r * 0.62, r * 0.8, r * 0.7, 1.5); ctx.fill(); ctx.restore(); },
    router(ctx, x, y, r) { rr(ctx, x - r * 0.85, y - r * 0.05, r * 1.7, r * 0.6, r * 0.14); ctx.fill(); ctx.lineWidth = Math.max(1.5, r * 0.1); ctx.beginPath(); ctx.moveTo(x - r * 0.5, y - r * 0.05); ctx.lineTo(x - r * 0.72, y - r * 0.85); ctx.moveTo(x + r * 0.5, y - r * 0.05); ctx.lineTo(x + r * 0.72, y - r * 0.85); ctx.stroke(); },
    phone(ctx, x, y, r) { rr(ctx, x - r * 0.45, y - r * 0.85, r * 0.9, r * 1.7, r * 0.16); ctx.fill(); ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.75)'; rr(ctx, x - r * 0.33, y - r * 0.66, r * 0.66, r * 1.2, 2); ctx.fill(); ctx.restore(); },
    laptop(ctx, x, y, r) { rr(ctx, x - r * 0.7, y - r * 0.65, r * 1.4, r * 0.95, r * 0.1); ctx.fill(); rr(ctx, x - r * 0.95, y + r * 0.38, r * 1.9, r * 0.2, r * 0.08); ctx.fill(); ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.75)'; rr(ctx, x - r * 0.57, y - r * 0.53, r * 1.14, r * 0.7, 2); ctx.fill(); ctx.restore(); },
    cloud(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x - r * 0.4, y + r * 0.15, r * 0.42, 0, TAU); ctx.arc(x, y - r * 0.15, r * 0.55, 0, TAU); ctx.arc(x + r * 0.48, y + r * 0.12, r * 0.44, 0, TAU); ctx.rect(x - r * 0.4, y + r * 0.1, r * 0.9, r * 0.47); ctx.fill(); },
    server(ctx, x, y, r) { for (const dy of [-0.75, -0.2, 0.35]) { rr(ctx, x - r * 0.7, y + r * dy, r * 1.4, r * 0.45, r * 0.08); ctx.fill(); } ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.8)'; for (const dy of [-0.53, 0.02, 0.57]) { ctx.beginPath(); ctx.arc(x - r * 0.45, y + r * dy, r * 0.07, 0, TAU); ctx.fill(); } ctx.restore(); },
    db(ctx, x, y, r) { ctx.beginPath(); ctx.ellipse(x, y - r * 0.55, r * 0.65, r * 0.25, 0, 0, TAU); ctx.fill(); ctx.fillRect(x - r * 0.65, y - r * 0.55, r * 1.3, r * 1.1); ctx.beginPath(); ctx.ellipse(x, y + r * 0.55, r * 0.65, r * 0.25, 0, 0, TAU); ctx.fill(); ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1; for (const dy of [-0.55, -0.1, 0.3]) { ctx.beginPath(); ctx.ellipse(x, y + r * dy, r * 0.65, r * 0.25, 0, 0, PI); ctx.stroke(); } ctx.restore(); },
    sensor(ctx, x, y, r) { rr(ctx, x - r * 0.6, y - r * 0.6, r * 1.2, r * 1.2, r * 0.18); ctx.fill(); ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(x, y, r * 0.28, 0, TAU); ctx.fill(); ctx.restore(); },
    bulb(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y - r * 0.2, r * 0.58, 0, TAU); ctx.fill(); rr(ctx, x - r * 0.27, y + r * 0.3, r * 0.54, r * 0.5, r * 0.08); ctx.fill(); },
    motor(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r * 0.7, 0, TAU); ctx.fill(); ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.font = '700 ' + r * 0.8 + 'px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('M', x, y + 1); ctx.restore(); },
    display(ctx, x, y, r) { rr(ctx, x - r * 0.85, y - r * 0.6, r * 1.7, r * 1.2, r * 0.12); ctx.fill(); ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.75)'; rr(ctx, x - r * 0.7, y - r * 0.45, r * 1.4, r * 0.9, 2); ctx.fill(); ctx.restore(); },
    battery(ctx, x, y, r) { rr(ctx, x - r * 0.8, y - r * 0.4, r * 1.5, r * 0.8, r * 0.1); ctx.fill(); rr(ctx, x + r * 0.7, y - r * 0.16, r * 0.16, r * 0.32, 1); ctx.fill(); },
    user(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y - r * 0.4, r * 0.36, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x, y + r * 0.75, r * 0.7, PI, TAU); ctx.fill(); },
    gateway(ctx, x, y, r) { rr(ctx, x - r * 0.75, y - r * 0.5, r * 1.5, r, r * 0.14); ctx.fill(); ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = Math.max(1.3, r * 0.09); ctx.beginPath(); ctx.moveTo(x - r * 0.45, y - r * 0.14); ctx.lineTo(x + r * 0.45, y - r * 0.14); ctx.lineTo(x + r * 0.25, y - r * 0.32); ctx.moveTo(x + r * 0.45, y + r * 0.16); ctx.lineTo(x - r * 0.45, y + r * 0.16); ctx.lineTo(x - r * 0.25, y + r * 0.34); ctx.stroke(); ctx.restore(); },
    broker(ctx, x, y, r) { ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i * TAU / 6 - PI / 2; ctx[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78); } ctx.closePath(); ctx.fill(); },
    lock(ctx, x, y, r) { rr(ctx, x - r * 0.55, y - r * 0.1, r * 1.1, r * 0.85, r * 0.12); ctx.fill(); ctx.lineWidth = Math.max(1.6, r * 0.14); ctx.beginPath(); ctx.arc(x, y - r * 0.15, r * 0.36, PI, TAU); ctx.stroke(); },
    speaker(ctx, x, y, r) { ctx.beginPath(); ctx.moveTo(x - r * 0.7, y - r * 0.25); ctx.lineTo(x - r * 0.3, y - r * 0.25); ctx.lineTo(x + r * 0.2, y - r * 0.7); ctx.lineTo(x + r * 0.2, y + r * 0.7); ctx.lineTo(x - r * 0.3, y + r * 0.25); ctx.lineTo(x - r * 0.7, y + r * 0.25); ctx.closePath(); ctx.fill(); },
    mic(ctx, x, y, r) { rr(ctx, x - r * 0.26, y - r * 0.8, r * 0.52, r, r * 0.26); ctx.fill(); ctx.lineWidth = Math.max(1.5, r * 0.1); ctx.beginPath(); ctx.arc(x, y - r * 0.1, r * 0.5, 0.1 * PI, 0.9 * PI); ctx.moveTo(x, y + r * 0.4); ctx.lineTo(x, y + r * 0.78); ctx.stroke(); },
    camera(ctx, x, y, r) { rr(ctx, x - r * 0.8, y - r * 0.5, r * 1.6, r * 1.1, r * 0.14); ctx.fill(); ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(x, y + r * 0.05, r * 0.32, 0, TAU); ctx.fill(); ctx.restore(); },
    sd(ctx, x, y, r) { ctx.beginPath(); ctx.moveTo(x - r * 0.5, y - r * 0.8); ctx.lineTo(x + r * 0.25, y - r * 0.8); ctx.lineTo(x + r * 0.5, y - r * 0.5); ctx.lineTo(x + r * 0.5, y + r * 0.8); ctx.lineTo(x - r * 0.5, y + r * 0.8); ctx.closePath(); ctx.fill(); },
    tag(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r * 0.5, 0, TAU); ctx.fill(); },
    home(ctx, x, y, r) { ctx.beginPath(); ctx.moveTo(x, y - r * 0.8); ctx.lineTo(x + r * 0.85, y - r * 0.05); ctx.lineTo(x + r * 0.6, y - r * 0.05); ctx.lineTo(x + r * 0.6, y + r * 0.7); ctx.lineTo(x - r * 0.6, y + r * 0.7); ctx.lineTo(x - r * 0.6, y - r * 0.05); ctx.lineTo(x - r * 0.85, y - r * 0.05); ctx.closePath(); ctx.fill(); }
  };
  S.NODE_KINDS = Object.keys(ICON);
  /* a thing in a network picture. o: { kind (see S.NODE_KINDS), label, sub, r, color (css or hue), active, dim } -> { x, y, r } */
  S.node = function (ctx, x, y, o) {
    o = o || {};
    const c = col(), r = o.r || 20, hue = typeof o.color === 'number' ? o.color : null;
    const fill = hue != null ? hsl(hue, 65, c.dark ? 58 : 44) : (o.color || (o.kind === 'esp' ? hsl(4, 72, c.dark ? 58 : 46) : c.accent));
    ctx.save();
    ctx.globalAlpha = o.dim ? 0.35 : 1;
    if (o.active) { ctx.beginPath(); ctx.arc(x, y, r * 1.35, 0, TAU); ctx.fillStyle = fill; ctx.globalAlpha = 0.18; ctx.fill(); ctx.globalAlpha = o.dim ? 0.35 : 1; }
    ctx.fillStyle = fill; ctx.strokeStyle = fill;
    (ICON[o.kind] || ICON.sensor)(ctx, x, y, r);
    ctx.restore();
    if (o.label != null) text(ctx, o.label, x, y + r + 9, { color: o.dim ? c.faint : c.text, size: 11.5, weight: 600 });
    if (o.sub != null) text(ctx, o.sub, x, y + r + 23, { size: 10 });
    return { x, y, r };
  };
  /* a connection between two points. o: { color, width, dash, wireless (dashed, lighter), label, arrow ('end' | 'both'), bend (pixels sideways), gap (start and end clearance) } */
  function linkGeom(x1, y1, x2, y2, bend, gap) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
    const g = Math.min(gap || 0, len * 0.4);
    const a = [x1 + ux * g, y1 + uy * g], b = [x2 - ux * g, y2 - uy * g];
    const m = [(a[0] + b[0]) / 2 - uy * (bend || 0), (a[1] + b[1]) / 2 + ux * (bend || 0)];
    const at = f => { const u = 1 - f; return [u * u * a[0] + 2 * u * f * m[0] + f * f * b[0], u * u * a[1] + 2 * u * f * m[1] + f * f * b[1]]; };
    return { a, b, m, at };
  }
  S.link = function (ctx, x1, y1, x2, y2, o) {
    o = o || {};
    const c = col(), g = linkGeom(x1, y1, x2, y2, o.bend, o.gap);
    ctx.save();
    ctx.strokeStyle = o.color || (o.wireless ? c.faint : c.muted); ctx.lineWidth = o.width || 1.6;
    if (o.dash || o.wireless) ctx.setLineDash(o.wireless ? [3, 5] : [6, 4]);
    ctx.beginPath(); ctx.moveTo(g.a[0], g.a[1]); ctx.quadraticCurveTo(g.m[0], g.m[1], g.b[0], g.b[1]); ctx.stroke();
    ctx.setLineDash([]);
    const head = (p, q) => { const an = Math.atan2(p[1] - q[1], p[0] - q[0]); ctx.fillStyle = o.color || c.muted; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] - 9 * Math.cos(an - 0.4), p[1] - 9 * Math.sin(an - 0.4)); ctx.lineTo(p[0] - 9 * Math.cos(an + 0.4), p[1] - 9 * Math.sin(an + 0.4)); ctx.closePath(); ctx.fill(); };
    if (o.arrow === 'end' || o.arrow === 'both' || o.arrow === true) head(g.b, g.at(0.9));
    if (o.arrow === 'both' || o.arrow === 'start') head(g.a, g.at(0.1));
    ctx.restore();
    if (o.label != null) { const p = g.at(0.5); text(ctx, o.label, p[0], p[1] - 9, { size: 10.5, color: o.labelColor || c.muted, bg: o.labelBg }); }
    return g;
  };
  /* a message on its way from 1 to 2: f runs 0 → 1. o: { color, label, r, bend, gap } */
  S.msg = function (ctx, x1, y1, x2, y2, f, o) {
    o = o || {};
    if (!(f >= 0 && f <= 1)) return;
    const c = col(), p = linkGeom(x1, y1, x2, y2, o.bend, o.gap).at(f), r = o.r || 5;
    ctx.save();
    ctx.shadowColor = o.color || c.accent; ctx.shadowBlur = 8;
    if (o.shape === 'packet') { rr(ctx, p[0] - r * 1.5, p[1] - r, r * 3, r * 2, 2); } else { ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); }
    ctx.fillStyle = o.color || c.accent; ctx.fill();
    ctx.restore();
    if (o.label != null) text(ctx, o.label, p[0], p[1] - r - 9, { size: 10.5, color: c.text, bg: c.dark ? 'rgba(13,16,32,.8)' : 'rgba(255,255,255,.85)' });
  };
  /* radio waves spreading from a point: phase runs 0 → 1 and repeats. o: { r (outer radius), n (rings), color, from, to (angles in radians, for a beam), width } */
  S.radio = function (ctx, x, y, o) {
    o = o || {};
    const c = col(), R = o.r || 60, n = o.n || 3, ph = (((o.phase || 0) % 1) + 1) % 1;
    ctx.save();
    ctx.strokeStyle = o.color || c.accent; ctx.lineWidth = o.width || 1.6;
    for (let i = 0; i < n; i++) {
      const f = (i + ph) / n, r = Math.max(0.5, f * R);
      ctx.globalAlpha = Math.max(0, 0.85 * (1 - f));
      ctx.beginPath(); ctx.arc(x, y, r, o.from == null ? 0 : o.from, o.to == null ? TAU : o.to); ctx.stroke();
    }
    ctx.restore();
  };
  /* an antenna mast. o: { color, kind: 'whip' | 'pcb' | 'dish' } */
  S.antenna = function (ctx, x, y, h, o) {
    o = o || {};
    const c = col();
    ctx.save(); ctx.strokeStyle = o.color || c.text2 || c.muted; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h); ctx.moveTo(x, y - h * 0.55); ctx.lineTo(x - h * 0.3, y - h); ctx.moveTo(x, y - h * 0.55); ctx.lineTo(x + h * 0.3, y - h); ctx.stroke();
    ctx.restore();
    return [x, y - h];
  };
  /* signal-strength bars from an RSSI in dBm (−30 excellent … −90 unusable). o: { w, h, n, label } -> how many bars are lit */
  S.bars = function (ctx, x, y, rssi, o) {
    o = o || {};
    const c = col(), n = o.n || 5, w = o.w || 34, h = o.h || 22, lit = clamp(Math.round((rssi + 92) / 12), 0, n), bw = w / n;
    ctx.save();
    for (let i = 0; i < n; i++) {
      const bh = h * (i + 1) / n;
      rr(ctx, x + i * bw + 1, y + h - bh, bw - 2.5, bh, 1.5);
      ctx.fillStyle = i < lit ? (lit <= 1 ? c.bad : lit <= 2 ? c.warn : c.ok) : (c.border2 || c.faint); ctx.fill();
    }
    ctx.restore();
    if (o.label !== false) text(ctx, o.label || (Math.round(rssi) + ' dBm'), x + w / 2, y + h + 10, { size: 10.5 });
    return lit;
  };

  /* ---------------------------------------------------------------- state machines
     def: { states: [{ id, label, x, y (0…1 inside the box), note (shown under the name) }], transitions: [{ from, to, label, bend }], start: id }
     o: { box: { x, y, w, h }, active: id, fired: index of the transition to highlight, pulse (0…1 for the highlight), r, color } -> { pos: { id: [x, y] }, r, hit(x, y) -> id | null } */
  S.fsm = function (ctx, def, o) {
    o = o || {};
    const c = col(), b = o.box || { x: 0, y: 0, w: 400, h: 260 }, states = def.states || [];
    const rw = o.rw || Math.max(34, Math.min(62, b.w / (states.length + 2.2))), rh = o.rh || rw * 0.58;
    const pos = {};
    states.forEach((s, i) => {
      const fx = s.x != null ? s.x : (0.5 + 0.38 * Math.cos(i * TAU / states.length - PI / 2)), fy = s.y != null ? s.y : (0.5 + 0.36 * Math.sin(i * TAU / states.length - PI / 2));
      pos[s.id] = [b.x + rw + fx * (b.w - 2 * rw), b.y + rh + fy * (b.h - 2 * rh)];
    });
    const edge = (p, q) => {     // where the line from p towards q leaves p's rounded box
      const dx = q[0] - p[0], dy = q[1] - p[1], k = 1 / Math.max(Math.abs(dx) / (rw + 3), Math.abs(dy) / (rh + 3), 1e-9);
      return [p[0] + dx * Math.min(1, k), p[1] + dy * Math.min(1, k)];
    };
    (def.transitions || []).forEach((t, i) => {
      const p = pos[t.from], q = pos[t.to];
      if (!p || !q) return;
      const hot = o.fired === i, colr = hot ? (o.color || c.warn) : c.muted;
      ctx.save();
      ctx.strokeStyle = colr; ctx.fillStyle = colr; ctx.lineWidth = hot ? 2.4 : 1.4;
      if (t.from === t.to) {                          // a self-loop above the state
        const lx = p[0] + rw * 0.35, ly = p[1] - rh;
        ctx.beginPath(); ctx.arc(lx, ly - 10, 13, 0.75 * PI, 2.35 * PI); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(lx + 9, ly - 1); ctx.lineTo(lx + 16, ly - 6); ctx.lineTo(lx + 6, ly - 9); ctx.closePath(); ctx.fill();
        ctx.restore();
        if (t.label != null) text(ctx, t.label, lx, ly - 30, { size: 10.5, color: hot ? colr : c.text2 || c.muted });
        return;
      }
      // two opposite transitions bend apart
      const twin = (def.transitions || []).some(u => u.from === t.to && u.to === t.from);
      const bend = t.bend != null ? t.bend : (twin ? 22 : 0);
      const a = edge(p, q), z = edge(q, p);
      const dx = z[0] - a[0], dy = z[1] - a[1], len = Math.hypot(dx, dy) || 1, m = [(a[0] + z[0]) / 2 - dy / len * bend, (a[1] + z[1]) / 2 + dx / len * bend];
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(m[0], m[1], z[0], z[1]); ctx.stroke();
      const an = Math.atan2(z[1] - m[1], z[0] - m[0]);
      ctx.beginPath(); ctx.moveTo(z[0], z[1]); ctx.lineTo(z[0] - 10 * Math.cos(an - 0.38), z[1] - 10 * Math.sin(an - 0.38)); ctx.lineTo(z[0] - 10 * Math.cos(an + 0.38), z[1] - 10 * Math.sin(an + 0.38)); ctx.closePath(); ctx.fill();
      if (hot && o.pulse != null) { const f = clamp(o.pulse, 0, 1), u = 1 - f; ctx.beginPath(); ctx.arc(u * u * a[0] + 2 * u * f * m[0] + f * f * z[0], u * u * a[1] + 2 * u * f * m[1] + f * f * z[1], 4.5, 0, TAU); ctx.fill(); }
      ctx.restore();
      if (t.label != null) { const lp = [(a[0] + 2 * m[0] + z[0]) / 4, (a[1] + 2 * m[1] + z[1]) / 4]; text(ctx, t.label, lp[0], lp[1] - 8, { size: 10.5, color: hot ? colr : c.text2 || c.muted, bg: c.dark ? 'rgba(16,20,42,.82)' : 'rgba(238,241,248,.88)' }); }
    });
    states.forEach(s => {
      const p = pos[s.id], on = o.active === s.id;
      ctx.save();
      rr(ctx, p[0] - rw, p[1] - rh, 2 * rw, 2 * rh, rh);
      ctx.fillStyle = on ? (o.color || c.accent) : c.surface; ctx.fill();
      ctx.lineWidth = on ? 2.4 : 1.5; ctx.strokeStyle = on ? (o.color || c.accent) : (c.text2 || c.muted); ctx.stroke();
      ctx.restore();
      text(ctx, s.label || s.id, p[0], p[1] - (s.note ? 6 : 0), { color: on ? (c.dark ? '#0d1020' : '#fff') : c.text, size: Math.min(12.5, rw / 3.4 + 3), weight: 650 });
      if (s.note) text(ctx, s.note, p[0], p[1] + 8, { color: on ? (c.dark ? 'rgba(13,16,32,.8)' : 'rgba(255,255,255,.85)') : c.muted, size: 9.5 });
      if (def.start === s.id) { ctx.save(); ctx.fillStyle = c.text; ctx.strokeStyle = c.text; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(p[0] - rw - 22, p[1], 4.5, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(p[0] - rw - 17, p[1]); ctx.lineTo(p[0] - rw - 2, p[1]); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p[0] - rw - 1, p[1]); ctx.lineTo(p[0] - rw - 9, p[1] - 4); ctx.lineTo(p[0] - rw - 9, p[1] + 4); ctx.closePath(); ctx.fill(); ctx.restore(); }
    });
    return { pos, rw, rh, hit: (x, y) => { for (const s of states) { const p = pos[s.id]; if (Math.abs(x - p[0]) <= rw && Math.abs(y - p[1]) <= rh) return s.id; } return null; } };
  };
})(typeof window !== 'undefined' ? window : globalThis);
