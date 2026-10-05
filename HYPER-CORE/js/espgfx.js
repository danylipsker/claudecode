/* HYPER-CORE · espgfx.js
 *
 * Virtual displays for Hyper ESP32 (Hyper.gfx, kit.gfx in simulations): a frame buffer with the drawing calls every
 * graphics library offers (pixel, line, rectangle, circle, arc, text in the classic 5 × 7 font), a character LCD
 * with its cursor and custom characters, seven-segment digits, a small widget kit for teaching GUIs, and the
 * catalogue of the display modules people really wire to an ESP32.
 *
 *   const fb = G.fb(128, 64, { depth: 1 });          a 128 × 64 monochrome buffer (depth 16: colour)
 *   fb.clear(); fb.text('Hello', 0, 0, { size: 2 }); fb.rect(0, 20, 60, 12, 1); fb.fillCircle(100, 40, 10, 1);
 *   G.draw(ctx, fb, x, y, scale, { style: 'oled' }); paint it on a canvas, pixel by pixel
 *
 * The data and the arithmetic touch no DOM (tools/test-esp32.js runs them under Node); G.draw* take a 2-D context.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const G = H.gfx = {};

  /* ---------------------------------------------------------------- the 5 × 7 font, ASCII 32–126
     five column bytes per character, bit 0 at the top */
  const FONT_HEX =
    '0000000000' + '00005F0000' + '0007000700' + '147F147F14' + '242A7F2A12' + '2313086462' + '3649552250' + '0005030000' +
    '001C224100' + '0041221C00' + '14083E0814' + '08083E0808' + '0050300000' + '0808080808' + '0060600000' + '2010080402' +
    '3E5149453E' + '00427F4000' + '4261514946' + '2141454B31' + '1814127F10' + '2745454539' + '3C4A494930' + '0171090503' +
    '3649494936' + '064949291E' + '0036360000' + '0056360000' + '0814224100' + '1414141414' + '0041221408' + '0201510906' +
    '324979413E' + '7E1111117E' + '7F49494936' + '3E41414122' + '7F4141221C' + '7F49494941' + '7F09090901' + '3E4149497A' +
    '7F0808087F' + '00417F4100' + '2040413F01' + '7F08142241' + '7F40404040' + '7F020C027F' + '7F0408107F' + '3E4141413E' +
    '7F09090906' + '3E4151215E' + '7F09192946' + '4649494931' + '01017F0101' + '3F4040403F' + '1F2040201F' + '3F4038403F' +
    '6314081463' + '0708700807' + '6151494543' + '007F414100' + '0204081020' + '0041417F00' + '0402010204' + '4040404040' +
    '0001020400' + '2054545478' + '7F48444438' + '3844444420' + '384444487F' + '3854545418' + '087E090102' + '0C5252523E' +
    '7F08040478' + '00447D4000' + '2040443D00' + '7F10284400' + '00417F4000' + '7C04180478' + '7C08040478' + '3844444438' +
    '7C14141408' + '081414187C' + '7C08040408' + '4854545420' + '043F444020' + '3C4040207C' + '1C2040201C' + '3C4030403C' +
    '4428102844' + '0C5050503C' + '4464544C44' + '0008364100' + '00007F0000' + '0041360800' + '0804081008';
  const FONT = new Uint8Array(FONT_HEX.length / 2);
  for (let i = 0; i < FONT.length; i++) FONT[i] = parseInt(FONT_HEX.substr(i * 2, 2), 16);
  // a few symbols beyond ASCII that sensor read-outs need
  const EXTRA = {
    '°': [0x00, 0x06, 0x09, 0x09, 0x06], 'µ': [0x7C, 0x10, 0x20, 0x20, 0x1C], 'Ω': [0x4E, 0x71, 0x01, 0x71, 0x4E], '→': [0x08, 0x08, 0x2A, 0x1C, 0x08],
    '←': [0x08, 0x1C, 0x2A, 0x08, 0x08], '↑': [0x04, 0x02, 0x7F, 0x02, 0x04], '↓': [0x10, 0x20, 0x7F, 0x20, 0x10], '█': [0x7F, 0x7F, 0x7F, 0x7F, 0x7F],
    '±': [0x44, 0x44, 0x5F, 0x44, 0x44], '²': [0x00, 0x09, 0x0D, 0x0A, 0x00], '·': [0x00, 0x00, 0x08, 0x00, 0x00], '–': [0x08, 0x08, 0x08, 0x08, 0x08],
    '♥': [0x0C, 0x1E, 0x3C, 0x1E, 0x0C], '✓': [0x10, 0x20, 0x10, 0x08, 0x04], '×': [0x22, 0x14, 0x08, 0x14, 0x22], '÷': [0x08, 0x08, 0x2A, 0x08, 0x08]
  };
  /* the five column bytes of a character (bit 0 = top row); unknown characters draw as a hollow box */
  G.glyph = function (ch) {
    if (EXTRA[ch]) return EXTRA[ch];
    const c = ch.charCodeAt(0);
    if (c >= 32 && c <= 126) return FONT.subarray((c - 32) * 5, (c - 32) * 5 + 5);
    return [0x7F, 0x41, 0x41, 0x41, 0x7F];
  };
  G.CHAR_W = 6; G.CHAR_H = 8;       // the cell of the font at size 1: 5 × 7 dots plus one of spacing

  /* ---------------------------------------------------------------- colours */
  G.rgb = (r, g, b) => ((r & 255) << 16) | ((g & 255) << 8) | (b & 255);
  G.rgb565 = (r, g, b) => ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
  G.from565 = v => G.rgb(((v >> 11) & 31) * 255 / 31 | 0, ((v >> 5) & 63) * 255 / 63 | 0, (v & 31) * 255 / 31 | 0);
  /* what a 24-bit colour becomes on a 16-bit (RGB565) panel */
  G.quantize565 = c => G.from565(G.rgb565((c >> 16) & 255, (c >> 8) & 255, c & 255));
  G.css = c => '#' + (c & 0xFFFFFF).toString(16).padStart(6, '0');
  G.hsv = function (h, s, v) {
    h = ((h % 360) + 360) % 360 / 60;
    const i = Math.floor(h), f = h - i, p = v * (1 - s), q = v * (1 - s * f), t = v * (1 - s * (1 - f));
    const [r, g, b] = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][i % 6];
    return G.rgb(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
  };
  G.COLORS = { black: 0x000000, white: 0xFFFFFF, red: 0xF04040, green: 0x30D060, blue: 0x3080FF, yellow: 0xFFD020, orange: 0xFF8C1A, cyan: 0x20D0E0,
    magenta: 0xE040D0, grey: 0x808890, dark: 0x202630, navy: 0x101C40, lime: 0xA0E020, pink: 0xFF70A0, teal: 0x109080, amber: 0xFFB000 };

  /* ---------------------------------------------------------------- the frame buffer */
  G.fb = function (w, h, opts) {
    opts = opts || {};
    const depth = opts.depth || 1;
    const px = depth === 1 ? new Uint8Array(w * h) : new Uint32Array(w * h);
    const fb = { w, h, depth, px, version: 0, calls: 0 };
    const col = c => depth === 1 ? (c ? 1 : 0) : (c === true ? 0xFFFFFF : c === false || c == null ? 0 : c >>> 0);
    const set = (x, y, c) => { x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < w && y < h) px[y * w + x] = c; };
    fb.clear = c => { px.fill(col(c || 0)); fb.version++; fb.calls++; return fb; };
    fb.get = (x, y) => (x >= 0 && y >= 0 && x < w && y < h ? px[(y | 0) * w + (x | 0)] : 0);
    fb.pixel = (x, y, c) => { set(x, y, col(c == null ? 1 : c)); fb.version++; return fb; };
    fb.hline = (x, y, len, c) => { c = col(c == null ? 1 : c); for (let i = 0; i < len; i++) set(x + i, y, c); fb.version++; return fb; };
    fb.vline = (x, y, len, c) => { c = col(c == null ? 1 : c); for (let i = 0; i < len; i++) set(x, y + i, c); fb.version++; return fb; };
    fb.line = (x0, y0, x1, y1, c) => {
      c = col(c == null ? 1 : c);
      x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
      const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
      let err = dx + dy, guard = 0;
      while (guard++ < 20000) {                      // Bresenham
        set(x0, y0, c);
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 >= dy) { err += dy; x0 += sx; }
        if (e2 <= dx) { err += dx; y0 += sy; }
      }
      fb.version++; fb.calls++; return fb;
    };
    fb.rect = (x, y, rw, rh, c) => { fb.hline(x, y, rw, c); fb.hline(x, y + rh - 1, rw, c); fb.vline(x, y, rh, c); fb.vline(x + rw - 1, y, rh, c); fb.calls++; return fb; };
    fb.fillRect = (x, y, rw, rh, c) => {
      c = col(c == null ? 1 : c);
      const xa = Math.max(0, x | 0), ya = Math.max(0, y | 0), xb = Math.min(w, (x + rw) | 0), yb = Math.min(h, (y + rh) | 0);
      for (let j = ya; j < yb; j++) for (let i = xa; i < xb; i++) px[j * w + i] = c;
      fb.version++; fb.calls++; return fb;
    };
    fb.circle = (cx, cy, r, c) => {
      c = col(c == null ? 1 : c);
      let x = Math.round(r), y = 0, err = 1 - x;
      while (x >= y) {                               // the midpoint circle
        for (const [a, b] of [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]]) set(cx + a, cy + b, c);
        y++;
        if (err < 0) err += 2 * y + 1; else { x--; err += 2 * (y - x) + 1; }
      }
      fb.version++; fb.calls++; return fb;
    };
    fb.fillCircle = (cx, cy, r, c) => {
      c = col(c == null ? 1 : c);
      const R = Math.round(r);
      for (let dy = -R; dy <= R; dy++) { const dx = Math.floor(Math.sqrt(R * R - dy * dy + 0.5)); for (let i = -dx; i <= dx; i++) set(cx + i, cy + dy, c); }
      fb.version++; fb.calls++; return fb;
    };
    fb.roundRect = (x, y, rw, rh, r, c) => {
      r = Math.max(0, Math.min(r, Math.floor(Math.min(rw, rh) / 2)));
      fb.hline(x + r, y, rw - 2 * r, c); fb.hline(x + r, y + rh - 1, rw - 2 * r, c); fb.vline(x, y + r, rh - 2 * r, c); fb.vline(x + rw - 1, y + r, rh - 2 * r, c);
      const cc = col(c == null ? 1 : c);
      let px_ = r, py_ = 0, err = 1 - px_;
      while (px_ >= py_) {
        for (const [a, b] of [[px_, py_], [py_, px_]]) {
          set(x + rw - 1 - r + a, y + rh - 1 - r + b, cc); set(x + r - a, y + rh - 1 - r + b, cc); set(x + rw - 1 - r + a, y + r - b, cc); set(x + r - a, y + r - b, cc);
        }
        py_++;
        if (err < 0) err += 2 * py_ + 1; else { px_--; err += 2 * (py_ - px_) + 1; }
      }
      fb.calls++; return fb;
    };
    fb.fillRoundRect = (x, y, rw, rh, r, c) => {
      r = Math.max(0, Math.min(r, Math.floor(Math.min(rw, rh) / 2)));
      const cc = col(c == null ? 1 : c);
      for (let j = 0; j < rh; j++) {
        let inset = 0;
        const d = j < r ? r - j : j >= rh - r ? j - (rh - 1 - r) : 0;
        if (d > 0) inset = r - Math.floor(Math.sqrt(r * r - d * d + 0.5));
        for (let i = inset; i < rw - inset; i++) set(x + i, y + j, cc);
      }
      fb.version++; fb.calls++; return fb;
    };
    fb.triangle = (x0, y0, x1, y1, x2, y2, c) => { fb.line(x0, y0, x1, y1, c); fb.line(x1, y1, x2, y2, c); fb.line(x2, y2, x0, y0, c); return fb; };
    fb.fillTriangle = (x0, y0, x1, y1, x2, y2, c) => {
      const cc = col(c == null ? 1 : c);
      const ya = Math.max(0, Math.floor(Math.min(y0, y1, y2))), yb = Math.min(h - 1, Math.ceil(Math.max(y0, y1, y2)));
      const edge = (ax, ay, bx, by, y) => (ay === by ? null : (y - ay) / (by - ay) >= 0 && (y - ay) / (by - ay) <= 1 ? ax + (bx - ax) * (y - ay) / (by - ay) : null);
      for (let y = ya; y <= yb; y++) {
        const xs = [edge(x0, y0, x1, y1, y), edge(x1, y1, x2, y2, y), edge(x2, y2, x0, y0, y)].filter(v => v != null);
        if (xs.length < 2) continue;
        const xa = Math.round(Math.min(...xs)), xb = Math.round(Math.max(...xs));
        for (let x = xa; x <= xb; x++) set(x, y, cc);
      }
      fb.version++; fb.calls++; return fb;
    };
    /* an arc of thickness th from angle a0 to a1 (degrees, clockwise from 12 o'clock): gauges and progress rings */
    fb.arc = (cx, cy, r, a0, a1, th, c) => {
      const cc = col(c == null ? 1 : c);
      const r0 = Math.max(0, r - (th || 1)), R = Math.ceil(r);
      const norm = a => ((a % 360) + 360) % 360;
      const span = Math.min(360, Math.max(0, a1 - a0)), s0 = norm(a0);
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > r + 0.5 || d < r0 - 0.5) continue;
        const a = norm(Math.atan2(dx, -dy) * 180 / Math.PI);
        if (span >= 360 || norm(a - s0) <= span) set(cx + dx, cy + dy, cc);
      }
      fb.version++; fb.calls++; return fb;
    };
    /* text in the 5 × 7 font; size multiplies the dots, as in Adafruit GFX. opts: { size, color, bg, align: 'left'|'center'|'right', wrap } */
    fb.text = (str, x, y, o) => {
      o = o || {};
      const size = Math.max(1, o.size | 0 || 1), cc = col(o.color == null ? 1 : o.color), bg = o.bg == null ? null : col(o.bg);
      str = String(str);
      const tw = G.textWidth(str, size);
      let cx = o.align === 'center' ? Math.round(x - tw / 2) : o.align === 'right' ? x - tw : x, cy = y;
      const x0 = cx;
      for (const ch of str) {
        if (ch === '\n') { cx = x0; cy += 8 * size; continue; }
        if (o.wrap && cx + 6 * size > w) { cx = x0; cy += 8 * size; }
        const g = G.glyph(ch);
        for (let i = 0; i < 6; i++) {
          const bits = i < 5 ? g[i] : 0;
          for (let j = 0; j < 8; j++) {
            const on = (bits >> j) & 1;
            if (!on && bg == null) continue;
            const c2 = on ? cc : bg;
            if (size === 1) set(cx + i, cy + j, c2);
            else for (let a = 0; a < size; a++) for (let b = 0; b < size; b++) set(cx + i * size + a, cy + j * size + b, c2);
          }
        }
        cx += 6 * size;
      }
      fb.version++; fb.calls++; return fb;
    };
    /* a bitmap: rows of strings ('#' or '1' = on) or of numbers (bit masks, most significant bit at the left, width given) */
    fb.bitmap = (x, y, rows, c, bw) => {
      const cc = col(c == null ? 1 : c);
      rows.forEach((r, j) => {
        if (typeof r === 'string') { for (let i = 0; i < r.length; i++) if (r[i] === '#' || r[i] === '1') set(x + i, y + j, cc); }
        else { const n = bw || 8; for (let i = 0; i < n; i++) if ((r >> (n - 1 - i)) & 1) set(x + i, y + j, cc); }
      });
      fb.version++; fb.calls++; return fb;
    };
    fb.invert = () => { if (depth === 1) for (let i = 0; i < px.length; i++) px[i] ^= 1; else for (let i = 0; i < px.length; i++) px[i] ^= 0xFFFFFF; fb.version++; return fb; };
    /* shift the picture by (dx, dy) dots, filling with the background: scrolling text, a moving chart */
    fb.scroll = (dx, dy, bg) => {
      const copy = px.slice(), b = col(bg || 0);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const sx = x - dx, sy = y - dy; px[y * w + x] = sx >= 0 && sy >= 0 && sx < w && sy < h ? copy[sy * w + sx] : b; }
      fb.version++; return fb;
    };
    fb.lit = () => { let n = 0; for (let i = 0; i < px.length; i++) if (px[i]) n++; return n; };
    return fb;
  };
  G.textWidth = (str, size) => String(str).split('\n').reduce((m, l) => Math.max(m, [...l].length), 0) * 6 * (size || 1);

  /* ---------------------------------------------------------------- bytes and frame rates */
  /* the RAM of one full frame, in bytes: depth 1, 4 (grey e-paper), 8, 16 (RGB565), 18/24 (stored as 3 bytes) */
  G.frameBytes = (w, h, depth) => Math.ceil(w * h * (depth <= 8 ? depth : depth <= 16 ? 16 : 24) / 8);
  /* full-screen refreshes per second over a serial bus: bus clock in Hz, bits on the wire per pixel, protocol overhead as a fraction */
  G.busFps = function (w, h, bitsPerPixel, hz, overhead) {
    const bits = w * h * bitsPerPixel * (1 + (overhead == null ? 0.05 : overhead));
    return hz / bits;
  };
  /* I2C sends 9 clock periods per byte and an SSD1306 frame carries a control byte per chunk */
  G.i2cFps = (w, h, hz) => hz / (Math.ceil(w * h / 8) * 9 * 1.07);

  /* ---------------------------------------------------------------- the character LCD (HD44780) */
  G.lcd = function (cols, rows) {
    cols = cols || 16; rows = rows || 2;
    const lcd = { cols, rows, cells: [], custom: {}, col: 0, row: 0, cursorOn: false, blinkOn: false, backlight: true, shift: 0 };
    lcd.clear = () => { lcd.cells = Array.from({ length: rows }, () => new Array(cols).fill(' ')); lcd.col = 0; lcd.row = 0; lcd.shift = 0; return lcd; };
    lcd.home = () => { lcd.col = 0; lcd.row = 0; lcd.shift = 0; return lcd; };
    lcd.setCursor = (c, r) => { lcd.col = Math.max(0, Math.min(cols - 1, c | 0)); lcd.row = Math.max(0, Math.min(rows - 1, r | 0)); return lcd; };
    /* characters past the end of a row are lost, exactly as on the real module (its memory is 40 per row, the glass shows 16 or 20) */
    lcd.print = s => { for (const ch of String(s)) { if (lcd.col < cols) lcd.cells[lcd.row][lcd.col] = ch; lcd.col++; } return lcd; };
    lcd.write = n => { if (lcd.col < cols) lcd.cells[lcd.row][lcd.col] = { custom: n & 7 }; lcd.col++; return lcd; };
    /* a custom character: eight rows of five bits (0b01110 …), slots 0–7 */
    lcd.createChar = (n, rows8) => { lcd.custom[n & 7] = rows8.slice(0, 8); return lcd; };
    lcd.cursor = on => { lcd.cursorOn = on !== false; return lcd; };
    lcd.blink = on => { lcd.blinkOn = on !== false; return lcd; };
    lcd.scrollLeft = () => { for (const r of lcd.cells) { r.push(r.shift()); } return lcd; };
    lcd.scrollRight = () => { for (const r of lcd.cells) { r.unshift(r.pop()); } return lcd; };
    lcd.text = () => lcd.cells.map(r => r.map(c => typeof c === 'string' ? c : '▯').join('')).join('\n');
    /* the 5 × 8 dots of a cell: eight row masks, bit 4 at the left */
    lcd.dots = (r, c) => {
      const cell = lcd.cells[r][c];
      if (typeof cell !== 'string') return (lcd.custom[cell.custom] || [0, 0, 0, 0, 0, 0, 0, 0]).slice();
      const g = G.glyph(cell), out = [0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 5; i++) for (let j = 0; j < 8; j++) if ((g[i] >> j) & 1) out[j] |= 1 << (4 - i);
      return out;
    };
    return lcd.clear();
  };

  /* ---------------------------------------------------------------- seven segments
     bit 0 = a (top), 1 = b, 2 = c, 3 = d (bottom), 4 = e, 5 = f, 6 = g (middle) — the order of TM1637 tables (a MAX7219 in raw mode
     numbers them the other way: bit 7 = decimal point, 6 = a … 0 = g) */
  G.SEG7 = { '0': 0x3F, '1': 0x06, '2': 0x5B, '3': 0x4F, '4': 0x66, '5': 0x6D, '6': 0x7D, '7': 0x07, '8': 0x7F, '9': 0x6F,
    'A': 0x77, 'b': 0x7C, 'C': 0x39, 'c': 0x58, 'd': 0x5E, 'E': 0x79, 'F': 0x71, 'H': 0x76, 'h': 0x74, 'L': 0x38, 'n': 0x54, 'o': 0x5C, 'P': 0x73,
    'r': 0x50, 't': 0x78, 'U': 0x3E, 'u': 0x1C, 'y': 0x6E, '-': 0x40, '_': 0x08, ' ': 0x00, '°': 0x63, '=': 0x48 };
  G.seg7 = ch => { const s = String(ch); return G.SEG7[s] != null ? G.SEG7[s] : G.SEG7[s.toUpperCase()] != null ? G.SEG7[s.toUpperCase()] : G.SEG7[s.toLowerCase()] != null ? G.SEG7[s.toLowerCase()] : 0; };
  /* a number for an n-digit display: -> [{ seg, dp }] right-aligned; too wide gives dashes */
  G.seg7Number = function (value, digits, decimals) {
    let s = Number(value).toFixed(decimals || 0);
    const out = [];
    for (const ch of s) { if (ch === '.') { if (out.length) out[out.length - 1].dp = true; } else out.push({ seg: G.seg7(ch), dp: false }); }
    if (out.length > digits) return Array.from({ length: digits }, () => ({ seg: G.SEG7['-'], dp: false }));
    while (out.length < digits) out.unshift({ seg: 0, dp: false });
    return out;
  };

  /* ---------------------------------------------------------------- display modules people really use */
  G.DISPLAYS = [
    { id: 'hd44780-16x2', name: 'Character LCD 16 × 2 (HD44780)', kind: 'character', cols: 16, rows: 2, bus: ['parallel 4-bit (6 pins)', 'I2C through a PCF8574 backpack (address 0x27 or 0x3F)'], volts: '5 V (3.3 V versions exist)', colour: 'one, by the backlight', note: 'Letters and digits only, eight custom characters. Needs its contrast trimmer set; a 5 V module on a 3.3 V ESP needs level care on I2C.' },
    { id: 'hd44780-20x4', name: 'Character LCD 20 × 4 (HD44780)', kind: 'character', cols: 20, rows: 4, bus: ['parallel 4-bit', 'I2C backpack'], volts: '5 V', colour: 'one', note: 'Rows 3 and 4 continue rows 1 and 2 in the controller\'s memory.' },
    { id: 'tm1637-4', name: 'Four-digit seven-segment (TM1637)', kind: 'segment', digits: 4, bus: ['two-wire CLK/DIO (not I2C)'], volts: '3.3–5 V', colour: 'red, green, blue or white', note: 'Digits, a colon, eight brightness steps. Ideal clocks and counters.' },
    { id: 'max7219-8x8', name: 'LED matrix 8 × 8 (MAX7219)', kind: 'matrix', w: 8, h: 8, depth: 1, bus: ['SPI-like, daisy-chained'], volts: '5 V', colour: 'one', note: 'Chains into scrolling signs of 32 × 8 and more; each module can draw 300 mA at full brightness.' },
    { id: 'pcd8544', name: 'Nokia 5110 LCD 84 × 48 (PCD8544)', kind: 'graphic', w: 84, h: 48, depth: 1, size: 1.5, bus: ['SPI'], volts: '3.3 V', colour: 'mono', note: 'Reflective: readable in sunlight, microamps without the backlight.' },
    { id: 'ssd1306-128x64', name: 'OLED 0.96″ 128 × 64 (SSD1306)', kind: 'graphic', w: 128, h: 64, depth: 1, size: 0.96, bus: ['I2C (0x3C)', 'SPI'], volts: '3.3 V', colour: 'white, blue, or yellow strip over blue', note: 'The maker\'s default small screen. 1 KB frame buffer; about 20 mA with half the dots lit.' },
    { id: 'ssd1306-128x32', name: 'OLED 0.91″ 128 × 32 (SSD1306)', kind: 'graphic', w: 128, h: 32, depth: 1, size: 0.91, bus: ['I2C (0x3C)'], volts: '3.3 V', colour: 'white or blue', note: 'Two to four lines of text; often on the board itself.' },
    { id: 'ssd1306-72x40', name: 'OLED 0.42″ 72 × 40 (SSD1306)', kind: 'graphic', w: 72, h: 40, depth: 1, size: 0.42, bus: ['I2C'], volts: '3.3 V', colour: 'white', note: 'The tiny screen soldered on some ESP32-C3 boards; libraries need an offset.' },
    { id: 'sh1106-128x64', name: 'OLED 1.3″ 128 × 64 (SH1106)', kind: 'graphic', w: 128, h: 64, depth: 1, size: 1.3, bus: ['I2C', 'SPI'], volts: '3.3 V', colour: 'white or blue', note: 'Looks like an SSD1306 but is not: its memory is 132 wide, so the wrong driver shifts the picture by two dots.' },
    { id: 'ssd1309-128x64', name: 'OLED 2.42″ 128 × 64 (SSD1309)', kind: 'graphic', w: 128, h: 64, depth: 1, size: 2.42, bus: ['SPI', 'I2C'], volts: '3.3 V', colour: 'white, yellow, green', note: 'The same picture, readable across a room.' },
    { id: 'st7735-160x128', name: 'TFT 1.8″ 160 × 128 (ST7735)', kind: 'graphic', w: 160, h: 128, depth: 16, size: 1.8, bus: ['SPI'], volts: '3.3 V', colour: '65 536 colours', note: 'Several "tab" variants with different offsets and colour orders.' },
    { id: 'st7789-240x135', name: 'TFT 1.14″ 240 × 135 (ST7789)', kind: 'graphic', w: 240, h: 135, depth: 16, size: 1.14, bus: ['SPI'], volts: '3.3 V', colour: '65 536 colours, IPS', note: 'The screen of many stick-shaped boards.' },
    { id: 'st7789-240x240', name: 'TFT 1.3″ / 1.54″ 240 × 240 (ST7789)', kind: 'graphic', w: 240, h: 240, depth: 16, size: 1.3, bus: ['SPI'], volts: '3.3 V', colour: '65 536 colours, IPS', note: 'Some modules have no chip-select pin and need SPI mode 3.' },
    { id: 'st7789-320x170', name: 'TFT 1.9″ 320 × 170 (ST7789)', kind: 'graphic', w: 320, h: 170, depth: 16, size: 1.9, bus: ['8-bit parallel', 'SPI'], volts: '3.3 V', colour: '65 536 colours, IPS', note: 'Driven in 8-bit parallel on some ESP32-S3 boards for speed.' },
    { id: 'st7789-320x240', name: 'TFT 2.0″ 320 × 240 (ST7789)', kind: 'graphic', w: 320, h: 240, depth: 16, size: 2.0, bus: ['SPI'], volts: '3.3 V', colour: '65 536 colours, IPS', note: 'The sharper successor of the ILI9341 modules.' },
    { id: 'gc9a01-240', name: 'Round TFT 1.28″ 240 × 240 (GC9A01)', kind: 'graphic', w: 240, h: 240, depth: 16, size: 1.28, round: true, bus: ['SPI'], volts: '3.3 V', colour: '65 536 colours, IPS', note: 'A circle: the corners of the buffer are never seen. Gauges, watches, dials.' },
    { id: 'ili9341-320x240', name: 'TFT 2.4″–3.2″ 320 × 240 (ILI9341)', kind: 'graphic', w: 320, h: 240, depth: 16, size: 2.8, bus: ['SPI', '8/16-bit parallel'], volts: '3.3 V logic', colour: '65 536 colours', touch: 'resistive (XPT2046) on most modules', note: 'The classic touch screen of maker projects; 153 600 bytes for one full frame.' },
    { id: 'ili9488-480x320', name: 'TFT 3.5″ 480 × 320 (ILI9488)', kind: 'graphic', w: 480, h: 320, depth: 18, size: 3.5, bus: ['SPI (18-bit only)', 'parallel'], volts: '3.3 V logic', colour: '262 144 colours over SPI', touch: 'resistive or capacitive', note: 'Over SPI it wants three bytes per pixel: slow. Parallel versions are much faster.' },
    { id: 'st7796-480x320', name: 'TFT 3.5″–4″ 480 × 320 (ST7796)', kind: 'graphic', w: 480, h: 320, depth: 16, size: 3.5, bus: ['SPI', 'parallel'], volts: '3.3 V logic', colour: '65 536 colours', touch: 'capacitive (FT6336, GT911) or resistive', note: '16-bit colour over SPI, unlike the ILI9488.' },
    { id: 'rgb-800x480', name: 'RGB panel 4.3″–7″ 800 × 480', kind: 'graphic', w: 800, h: 480, depth: 16, size: 5, bus: ['16-bit RGB parallel with HSYNC/VSYNC/DE (ESP32-S3)'], volts: '3.3 V logic', colour: '65 536 colours', touch: 'capacitive (GT911)', note: 'No memory in the panel: the ESP32-S3 streams the frame from PSRAM continuously and spends about twenty pins doing it.' },
    { id: 'mipi-1024x600', name: 'MIPI-DSI panel 7″ 1024 × 600', kind: 'graphic', w: 1024, h: 600, depth: 24, size: 7, bus: ['MIPI-DSI, two lanes (ESP32-P4)'], volts: '—', colour: '16.7 million colours', touch: 'capacitive (GT911)', note: 'Phone-class displays; only the ESP32-P4 has the interface.' },
    { id: 'amoled-536x240', name: 'AMOLED 1.91″ 536 × 240 (RM67162)', kind: 'graphic', w: 536, h: 240, depth: 16, size: 1.91, bus: ['QSPI'], volts: '3.3 V', colour: '65 536 colours, true black', note: 'Four data lines of SPI; deep contrast, burn-in over years.' },
    { id: 'epd-213', name: 'E-paper 2.13″ 250 × 122', kind: 'graphic', w: 250, h: 122, depth: 1, size: 2.13, epaper: true, bus: ['SPI + BUSY/RST/DC'], volts: '3.3 V', colour: 'black/white (some add red or yellow)', note: 'Holds its picture with no power. A full refresh takes one to three seconds; partial refresh is faster but leaves ghosts.' },
    { id: 'epd-290', name: 'E-paper 2.9″ 296 × 128', kind: 'graphic', w: 296, h: 128, depth: 1, size: 2.9, epaper: true, bus: ['SPI + BUSY/RST/DC'], volts: '3.3 V', colour: 'black/white', note: 'The price-tag display.' },
    { id: 'epd-420', name: 'E-paper 4.2″ 400 × 300', kind: 'graphic', w: 400, h: 300, depth: 1, size: 4.2, epaper: true, bus: ['SPI + BUSY/RST/DC'], volts: '3.3 V', colour: 'black/white, or four greys', note: '15 000 bytes per frame.' },
    { id: 'epd-750', name: 'E-paper 7.5″ 800 × 480', kind: 'graphic', w: 800, h: 480, depth: 1, size: 7.5, epaper: true, bus: ['SPI + BUSY/RST/DC'], volts: '3.3 V', colour: 'black/white, or with red', note: 'Wall calendars and dashboards on a battery for months.' },
    { id: 'hub75-64x32', name: 'RGB LED matrix panel 64 × 32 (HUB75)', kind: 'graphic', w: 64, h: 32, depth: 24, size: 7.6, bus: ['HUB75: 6 colour lines, 4–5 address lines, CLK, LAT, OE'], volts: '5 V, up to 4 A', colour: 'full colour by PWM', note: 'Thirteen pins and constant refreshing — the ESP32\'s I2S/parallel output with DMA does it. Needs a real power supply.' },
    { id: 'ws2812-matrix', name: 'Addressable LED matrix 8 × 8 / 16 × 16 (WS2812)', kind: 'matrix', w: 16, h: 16, depth: 24, bus: ['one data pin'], volts: '5 V, 60 mA per LED at full white', colour: 'full colour', note: 'Wired in a zigzag: odd rows run backwards. 256 LEDs at full white would want 15 A — limit the brightness.' }
  ];
  G.display = id => G.DISPLAYS.find(d => d.id === id) || null;

  /* ---------------------------------------------------------------- touch */
  /* A resistive panel read through an XPT2046 gives raw numbers (0–4095) that must be mapped to pixels:
     cal = { xMin, xMax, yMin, yMax, swap, flipX, flipY } */
  G.touchMap = function (rawX, rawY, cal, w, h) {
    let x = rawX, y = rawY;
    if (cal.swap) { const t = x; x = y; y = t; }
    let px = (x - cal.xMin) / (cal.xMax - cal.xMin) * (w - 1), py = (y - cal.yMin) / (cal.yMax - cal.yMin) * (h - 1);
    if (cal.flipX) px = w - 1 - px;
    if (cal.flipY) py = h - 1 - py;
    return { x: Math.round(Math.max(0, Math.min(w - 1, px))), y: Math.round(Math.max(0, Math.min(h - 1, py))) };
  };
  /* what the panel reports for a pixel, the other way round (to simulate a touch) */
  G.touchRaw = function (px, py, cal, w, h) {
    let x = cal.flipX ? w - 1 - px : px, y = cal.flipY ? h - 1 - py : py;
    let rx = cal.xMin + x / (w - 1) * (cal.xMax - cal.xMin), ry = cal.yMin + y / (h - 1) * (cal.yMax - cal.yMin);
    if (cal.swap) { const t = rx; rx = ry; ry = t; }
    return { x: Math.round(rx), y: Math.round(ry) };
  };
  /* the physical size of a touch target: pixels -> millimetres on a panel of `diag` inches */
  G.pxToMm = (px, w, h, diagInch) => px * diagInch * 25.4 / Math.hypot(w, h);
  G.ppi = (w, h, diagInch) => Math.hypot(w, h) / diagInch;

  /* ---------------------------------------------------------------- a small widget kit (for teaching GUIs)
     const ui = G.ui(fb, { fg, bg, accent, dim });  every widget returns its box { x, y, w, h } for hit-testing */
  G.ui = function (fb, theme) {
    const mono = fb.depth === 1;
    const T = Object.assign(mono ? { fg: 1, bg: 0, accent: 1, dim: 1, ok: 1, warn: 1, bad: 1 } :
      { fg: 0xE8ECF4, bg: 0x101622, accent: 0x38A0FF, dim: 0x3A4458, ok: 0x30D060, warn: 0xFFB000, bad: 0xF04848, panel: 0x1B2434 }, theme || {});
    const ui = { theme: T, hits: [] };
    const box = (x, y, w, h, id) => { const b = { x, y, w, h, id }; if (id) ui.hits.push(b); return b; };
    ui.screen = () => { fb.clear(T.bg); ui.hits = []; return ui; };
    ui.label = (x, y, text, o) => { o = o || {}; fb.text(text, x, y, { size: o.size || 1, color: o.color == null ? T.fg : o.color, align: o.align, bg: o.bg }); return box(x, y, G.textWidth(text, o.size || 1), 8 * (o.size || 1)); };
    ui.button = (x, y, w, h, text, o) => {
      o = o || {};
      const r = Math.min(mono ? 3 : 6, h >> 1);
      if (o.pressed || o.filled) { fb.fillRoundRect(x, y, w, h, r, o.color == null ? T.accent : o.color); fb.text(text, x + (w >> 1), y + ((h - 8 * (o.size || 1)) >> 1) + (o.size > 1 ? 1 : 0), { size: o.size || 1, color: mono ? 0 : (o.textColor == null ? 0xFFFFFF : o.textColor), align: 'center' }); }
      else { if (!mono) fb.fillRoundRect(x, y, w, h, r, T.panel); fb.roundRect(x, y, w, h, r, o.color == null ? T.accent : o.color); fb.text(text, x + (w >> 1), y + ((h - 8 * (o.size || 1)) >> 1), { size: o.size || 1, color: T.fg, align: 'center' }); }
      return box(x, y, w, h, o.id);
    };
    ui.bar = (x, y, w, h, frac, o) => {
      o = o || {};
      frac = Math.max(0, Math.min(1, frac || 0));
      if (!mono) fb.fillRect(x, y, w, h, T.dim);
      fb.rect(x, y, w, h, mono ? 1 : T.dim);
      const fw = Math.round((w - 4) * frac);
      if (fw > 0) fb.fillRect(x + 2, y + 2, fw, h - 4, o.color == null ? T.accent : o.color);
      return box(x, y, w, h, o.id);
    };
    ui.slider = (x, y, w, frac, o) => {
      o = o || {};
      frac = Math.max(0, Math.min(1, frac || 0));
      const cy = y + 6, kx = x + Math.round(frac * w);
      fb.fillRect(x, cy - 1, w, 3, mono ? 1 : T.dim);
      if (!mono) fb.fillRect(x, cy - 1, kx - x, 3, T.accent);
      fb.fillCircle(kx, cy, mono ? 4 : 6, mono ? 1 : T.accent);
      if (mono) fb.fillCircle(kx, cy, 2, 0);
      return box(x - 6, y, w + 12, 13, o.id);
    };
    ui.toggle = (x, y, on, o) => {
      o = o || {};
      const w = 26, h = 14;
      if (mono) { fb.roundRect(x, y, w, h, 7, 1); fb.fillCircle(on ? x + w - 8 : x + 7, y + 7, 4, 1); if (on) fb.fillRect(x + 4, y + 5, 8, 4, 1); }
      else { fb.fillRoundRect(x, y, w, h, 7, on ? T.ok : T.dim); fb.fillCircle(on ? x + w - 8 : x + 7, y + 7, 5, 0xFFFFFF); }
      return box(x, y, w, h, o.id);
    };
    ui.check = (x, y, on, text, o) => {
      o = o || {};
      fb.rect(x, y, 10, 10, mono ? 1 : T.fg);
      if (on) { fb.line(x + 2, y + 5, x + 4, y + 7, mono ? 1 : T.ok); fb.line(x + 4, y + 7, x + 8, y + 2, mono ? 1 : T.ok); }
      if (text) fb.text(text, x + 14, y + 1, { color: T.fg });
      return box(x, y, 14 + G.textWidth(text || '', 1), 10, o.id);
    };
    /* a dial: an arc from −135° to +135° with a needle; frac 0…1 */
    ui.gauge = (cx, cy, r, frac, o) => {
      o = o || {};
      frac = Math.max(0, Math.min(1, frac || 0));
      const th = o.thick || Math.max(2, Math.round(r / 5));
      if (!mono) fb.arc(cx, cy, r, -135, 135, th, T.dim); else fb.arc(cx, cy, r, -135, 135, 1, 1);
      if (frac > 0) fb.arc(cx, cy, r, -135, -135 + 270 * frac, th, o.color == null ? T.accent : o.color);
      const a = (-135 + 270 * frac) * Math.PI / 180;
      if (o.needle !== false) fb.line(cx, cy, cx + Math.sin(a) * (r - th - 2), cy - Math.cos(a) * (r - th - 2), T.fg);
      if (o.text != null) fb.text(o.text, cx, cy + Math.round(r * 0.45), { align: 'center', color: T.fg, size: o.size || 1 });
      return box(cx - r, cy - r, 2 * r, 2 * r, o.id);
    };
    /* a line chart of the last values, auto-scaled unless min/max are given */
    ui.chart = (x, y, w, h, data, o) => {
      o = o || {};
      fb.rect(x, y, w, h, mono ? 1 : T.dim);
      if (data && data.length > 1) {
        const lo = o.min != null ? o.min : Math.min(...data), hi = o.max != null ? o.max : Math.max(...data), span = hi - lo || 1;
        const X = i => x + 1 + i * (w - 3) / (data.length - 1), Y = v => y + h - 2 - (Math.max(lo, Math.min(hi, v)) - lo) / span * (h - 4);
        for (let i = 1; i < data.length; i++) fb.line(X(i - 1), Y(data[i - 1]), X(i), Y(data[i]), o.color == null ? T.accent : o.color);
      }
      return box(x, y, w, h, o.id);
    };
    /* a menu list with one row selected */
    ui.list = (x, y, w, items, sel, o) => {
      o = o || {};
      const rh = o.rowH || 11;
      items.forEach((t, i) => {
        const yy = y + i * rh;
        if (i === sel) { fb.fillRect(x, yy, w, rh, mono ? 1 : T.accent); fb.text(t, x + 3, yy + ((rh - 7) >> 1), { color: mono ? 0 : 0xFFFFFF }); }
        else fb.text(t, x + 3, yy + ((rh - 7) >> 1), { color: T.fg });
        if (o.id) ui.hits.push({ x, y: yy, w, h: rh, id: o.id + ':' + i });
      });
      return box(x, y, w, items.length * rh);
    };
    /* small pictograms for a status bar, about 11 × 9 dots */
    const ICONS = {
      wifi: ['..#####....', '.#.....#...', '#..###..#..', '..#...#....', '....#......', '...###.....', '....#......'],
      wifi0: ['...........', '...........', '...........', '...........', '....#......', '...###.....', '....#......'],
      bt: ['..#....', '..##...', '#.#.#..', '.###...', '..#....', '.###...', '#.#.#..', '..##...', '..#....'],
      battery: ['.#########.', '#.........##', '#.........##', '#.........##', '#.........##', '.#########.'],
      temp: ['..#..', '.#.#.', '.#.#.', '.#.#.', '.###.', '#####', '#####', '.###.'],
      drop: ['..#..', '..#..', '.###.', '.###.', '#####', '#####', '.###.'],
      warn: ['....#....', '...#.#...', '...#.#...', '..#.#.#..', '..#.#.#..', '.#.....#.', '.#..#..#.', '#########'],
      bell: ['...#...', '..###..', '.#####.', '.#####.', '.#####.', '#######', '...#...'],
      sun: ['#..#..#', '.#...#.', '..###..', '#.###.#', '..###..', '.#...#.', '#..#..#'],
      heart: ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'],
      up: ['..#..', '.###.', '#####', '..#..', '..#..', '..#..'], down: ['..#..', '..#..', '..#..', '#####', '.###.', '..#..'],
      play: ['#....', '##...', '###..', '####.', '###..', '##...', '#....'], pause: ['##.##', '##.##', '##.##', '##.##', '##.##', '##.##'],
      lock: ['.###.', '#...#', '#...#', '#####', '##.##', '##.##', '#####'], home: ['...#...', '..###..', '.#####.', '#######', '.#...#.', '.#.#.#.', '.#####.'],
      gear: ['.#.#.#.', '#######', '.##.##.', '##...##', '.##.##.', '#######', '.#.#.#.'], cloud: ['...###....', '.##...##..', '#.......##', '#.........#', '.#########.']
    };
    ui.icon = (name, x, y, o) => { o = o || {}; const rows = ICONS[name] || ICONS.warn; fb.bitmap(x, y, rows, o.color == null ? T.fg : o.color); return box(x, y, rows[0].length, rows.length, o.id); };
    ui.ICONS = Object.keys(ICONS);
    ui.batteryIcon = (x, y, frac, o) => { o = o || {}; ui.icon('battery', x, y, o); const n = Math.round(Math.max(0, Math.min(1, frac)) * 8); if (n) fb.fillRect(x + 2, y + 2, n, 2, o.color == null ? (mono ? 1 : frac < 0.2 ? T.bad : T.ok) : o.color); return box(x, y, 12, 6); };
    /* a title bar across the top */
    ui.header = (text, o) => { o = o || {}; const hh = o.h || (mono ? 10 : 18); if (mono) { fb.fillRect(0, 0, fb.w, hh, 1); fb.text(text, 2, 1, { color: 0 }); } else { fb.fillRect(0, 0, fb.w, hh, T.panel); fb.text(text, 5, (hh - 7) >> 1, { color: T.fg }); } return box(0, 0, fb.w, hh); };
    /* which widget with an id is under a point (the last drawn wins) */
    ui.hit = (x, y) => { for (let i = ui.hits.length - 1; i >= 0; i--) { const b = ui.hits[i]; if (x >= b.x && y >= b.y && x < b.x + b.w && y < b.y + b.h) return b.id; } return null; };
    return ui;
  };

  /* ---------------------------------------------------------------- painting on a canvas */
  /* G.draw(ctx, fb, x, y, scale, { style: 'oled' | 'lcd' | 'tft' | 'epaper' | 'led', on: css colour of a lit dot, gap: true, round, bezel })
     One buffer dot becomes scale × scale canvas pixels. Monochrome styles: oled (lit dots on black), lcd (dark dots on
     a grey-green glass), epaper (black on paper white), led (round dots). */
  G.draw = function (ctx, fb, x, y, scale, o) {
    o = o || {};
    const s = scale || 2, W = fb.w * s, Hh = fb.h * s, style = o.style || (fb.depth === 1 ? 'oled' : 'tft');
    const PAL = { oled: ['#05070c', o.on || '#7fd8ff'], lcd: ['#aab89a', '#1d2a1a'], epaper: ['#e9e6dc', '#1b1b1b'], led: ['#12060a', o.on || '#ff3b30'], tft: ['#000', '#fff'] }[style] || ['#000', '#fff'];
    ctx.save();
    if (o.bezel !== false) {
      const b = o.bezel == null ? Math.max(3, Math.round(s * 1.5)) : o.bezel;
      ctx.fillStyle = style === 'epaper' ? '#c9c5b8' : '#1a1d24';
      if (o.round) { ctx.beginPath(); ctx.arc(x + W / 2, y + Hh / 2, W / 2 + b, 0, Math.PI * 2); ctx.fill(); }
      else { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x - b, y - b, W + 2 * b, Hh + 2 * b, b); else ctx.rect(x - b, y - b, W + 2 * b, Hh + 2 * b); ctx.fill(); }
    }
    if (o.round) { ctx.beginPath(); ctx.arc(x + W / 2, y + Hh / 2, W / 2, 0, Math.PI * 2); ctx.clip(); }
    ctx.fillStyle = PAL[0];
    ctx.fillRect(x, y, W, Hh);
    const gap = o.gap !== false && s >= 4 ? 1 : 0;
    if (fb.depth === 1) {
      ctx.fillStyle = PAL[1];
      for (let j = 0; j < fb.h; j++) {
        // runs of lit dots are drawn as one rectangle when there is no gap
        let i = 0;
        while (i < fb.w) {
          if (!fb.px[j * fb.w + i]) { i++; continue; }
          if (style === 'led') { ctx.beginPath(); ctx.arc(x + i * s + s / 2, y + j * s + s / 2, s * 0.38, 0, Math.PI * 2); ctx.fill(); i++; continue; }
          if (gap) { ctx.fillRect(x + i * s, y + j * s, s - gap, s - gap); i++; continue; }
          let k = i; while (k < fb.w && fb.px[j * fb.w + k]) k++;
          ctx.fillRect(x + i * s, y + j * s, (k - i) * s, s);
          i = k;
        }
      }
    } else {
      for (let j = 0; j < fb.h; j++) {
        let i = 0;
        while (i < fb.w) {
          const c = fb.px[j * fb.w + i];
          let k = i + 1; while (k < fb.w && fb.px[j * fb.w + k] === c) k++;
          if (c) { ctx.fillStyle = G.css(c); ctx.fillRect(x + i * s, y + j * s, (k - i) * s, s); }
          i = k;
        }
      }
    }
    ctx.restore();
    return { x, y, w: W, h: Hh, scale: s };
  };
  /* the canvas point (px, py) as a dot of a buffer drawn at (x, y, scale): -> { x, y } or null when outside */
  G.pick = function (fb, x, y, scale, px, py) {
    const i = Math.floor((px - x) / scale), j = Math.floor((py - y) / scale);
    return i >= 0 && j >= 0 && i < fb.w && j < fb.h ? { x: i, y: j } : null;
  };

  /* a character LCD on a canvas: every cell is 5 × 8 dots. o: { backlight: 'green' | 'blue' | 'off', t (seconds, for the blinking cursor) } */
  G.drawLcd = function (ctx, lcd, x, y, dot, o) {
    o = o || {};
    const d = dot || 3, cw = 5 * d + d, chh = 8 * d + d, pad = 2 * d;
    const W = lcd.cols * cw - d + 2 * pad, Hh = lcd.rows * chh - d + 2 * pad;
    const bl = lcd.backlight === false ? 'off' : (o.backlight || 'green');
    const [glass, cell, ink] = { green: ['#9bc53d', '#8fb834', '#1e2a0c'], blue: ['#1f4fd8', '#2a5ae6', '#eef4ff'], off: ['#5c6650', '#566049', '#252b1e'] }[bl] || ['#9bc53d', '#8fb834', '#1e2a0c'];
    ctx.save();
    ctx.fillStyle = '#20242c';
    ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x - d * 2, y - d * 2, W + 4 * d, Hh + 4 * d, d * 1.5); else ctx.rect(x - d * 2, y - d * 2, W + 4 * d, Hh + 4 * d); ctx.fill();
    ctx.fillStyle = glass; ctx.fillRect(x, y, W, Hh);
    for (let r = 0; r < lcd.rows; r++) for (let c = 0; c < lcd.cols; c++) {
      const x0 = x + pad + c * cw, y0 = y + pad + r * chh;
      ctx.fillStyle = cell; ctx.fillRect(x0, y0, 5 * d, 8 * d);
      const rows = lcd.dots(r, c);
      const here = lcd.row === r && lcd.col === c;
      const block = here && lcd.blinkOn && Math.floor((o.t || 0) * 2) % 2 === 0;
      ctx.fillStyle = ink;
      for (let j = 0; j < 8; j++) for (let i = 0; i < 5; i++) {
        if (block || (rows[j] >> (4 - i)) & 1 || (here && lcd.cursorOn && j === 7)) ctx.fillRect(x0 + i * d, y0 + j * d, d - (d > 2 ? 1 : 0), d - (d > 2 ? 1 : 0));
      }
    }
    ctx.restore();
    return { x, y, w: W, h: Hh };
  };

  /* seven-segment digits: cells from G.seg7Number, or a string. o: { color, off, colon } -> width drawn */
  G.drawSeg7 = function (ctx, cells, x, y, h, o) {
    o = o || {};
    if (typeof cells === 'string') cells = [...cells].map(ch => ({ seg: G.seg7(ch), dp: false }));
    const w = h * 0.5, t = h * 0.1, gapX = h * 0.2, on = o.color || '#ff3b30', off = o.off || 'rgba(255,60,48,.10)';
    ctx.save();
    const segPoly = (pts) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fill(); };
    const hseg = (cx, cy) => segPoly([[cx - w / 2 + t, cy], [cx - w / 2 + t * 1.6, cy - t / 2], [cx + w / 2 - t * 1.6, cy - t / 2], [cx + w / 2 - t, cy], [cx + w / 2 - t * 1.6, cy + t / 2], [cx - w / 2 + t * 1.6, cy + t / 2]]);
    const vseg = (cx, cy) => { const l = h / 2 - t; segPoly([[cx, cy - l / 2], [cx + t / 2, cy - l / 2 + t * 0.6], [cx + t / 2, cy + l / 2 - t * 0.6], [cx, cy + l / 2], [cx - t / 2, cy + l / 2 - t * 0.6], [cx - t / 2, cy - l / 2 + t * 0.6]]); };
    cells.forEach((cell, k) => {
      const x0 = x + k * (w + gapX), cx = x0 + w / 2;
      const S = cell.seg, col = b => { ctx.fillStyle = (S >> b) & 1 ? on : off; };
      col(0); hseg(cx, y + t / 2);
      col(1); vseg(x0 + w - t / 2, y + h * 0.25 + t / 4);
      col(2); vseg(x0 + w - t / 2, y + h * 0.75 - t / 4);
      col(3); hseg(cx, y + h - t / 2);
      col(4); vseg(x0 + t / 2, y + h * 0.75 - t / 4);
      col(5); vseg(x0 + t / 2, y + h * 0.25 + t / 4);
      col(6); hseg(cx, y + h / 2);
      ctx.fillStyle = cell.dp ? on : off;
      ctx.beginPath(); ctx.arc(x0 + w + gapX * 0.4, y + h - t / 2, t * 0.55, 0, Math.PI * 2); ctx.fill();
      if (o.colon != null && k === 1) { ctx.fillStyle = o.colon ? on : off; for (const yy of [0.33, 0.67]) { ctx.beginPath(); ctx.arc(x0 + w + gapX * 0.5, y + h * yy, t * 0.55, 0, Math.PI * 2); ctx.fill(); } }
    });
    ctx.restore();
    return cells.length * (w + gapX);
  };
})(typeof window !== 'undefined' ? window : globalThis);
