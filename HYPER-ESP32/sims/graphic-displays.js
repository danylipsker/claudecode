/* HYPER-ESP32 · sims/graphic-displays.js
 *
 * Simulations of "Graphic displays" (topic code gd). Every picture is drawn into a virtual frame buffer (kit.gfx).
 *
 *   gd-framebuffer  a 16 × 16 buffer: paint pixels and read the bytes, in row order or in the SSD1306's pages
 *   gd-depth        one picture in 24, 16, 8, 2 and 1 bits, with a wipe, and one colour as RGB565 bits
 *   gd-primitives   drag the handles of a line, rectangle, circle, triangle or text, see the call, stamp it into the buffer
 *   gd-text         the 5 × 7 font at sizes 1 to 4 with wrapping, the character grid and the memory of a font
 *   gd-flicker      a TFT being written at bus speed: clear-and-redraw, erase-what-moved, or compose-and-push
 *   gd-framerate    frames a second for every bus that could drive the chosen display
 *   gd-epaper       full and partial refresh of e-paper, with the ghost that builds up
 *   gd-hub75        a HUB75 panel scanned row pair by row pair, bit planes, refresh rate and current
 *   gd-backlight    PWM backlight, gamma, battery life; an OLED's current against lit dots
 *   gd-round        a round screen: what the corners waste and how much of a label survives
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- helpers */
  const hex2 = v => (v & 255).toString(16).toUpperCase().padStart(2, '0');
  const bin8 = v => (v & 255).toString(2).padStart(8, '0');
  const grp = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpRGB = (c1, c2, t) => {
    const r = Math.round(lerp((c1 >> 16) & 255, (c2 >> 16) & 255, t)), g = Math.round(lerp((c1 >> 8) & 255, (c2 >> 8) & 255, t)), b = Math.round(lerp(c1 & 255, c2 & 255, t));
    return (r << 16) | (g << 8) | b;
  };
  const fmtFps = v => (v >= 100 ? Math.round(v) : v >= 10 ? (+v.toFixed(1)) : +v.toFixed(2)) + ' fps';
  const fmtMs = s => { const ms = s * 1000; return (ms >= 100 ? Math.round(ms) : ms >= 10 ? +ms.toFixed(1) : +ms.toFixed(2)) + ' ms'; };
  const dim = (C, a) => (C.dark ? 'rgba(255,255,255,' + a + ')' : 'rgba(0,0,0,' + a + ')');
  // a rounded rectangle path that also works where the context has no roundRect
  function rrect(c, x, y, w, h, r) {
    if (c.roundRect) { c.beginPath(); c.roundRect(x, y, w, h, r); return; }
    c.beginPath(); c.rect(x, y, w, h);
  }

  /* ================================================================ gd-framebuffer */
  Hyper.sim('gd-framebuffer', {
    title: 'The frame buffer, bit by bit',
    blurb: `A 16 × 16 screen and the bytes that hold it. **Click or drag** to paint pixels; the hex cells show the bytes of the buffer, and a pixel under the pointer lights the byte it belongs to.

**Try this**
- In *Rows* mode paint the left half of one row: the first byte of that row changes, the second does not. The leftmost pixel is the top bit.
- Switch to *Pages*, the layout of the SSD1306 OLED: now one byte is a vertical strip of eight pixels, with the top pixel as bit 0. Paint a single column and see one byte fill.
- Press **Draw an arrow** and compare the byte lists of the two layouts: the same picture, different numbers.
- Read **A whole 128 × 64 screen**: the same layout scaled up is 1 024 bytes.`,
    mount(box, kit, params) {
      const G = kit.gfx;
      const N = 16;
      let mode = params.mode === 'pages' ? 'pages' : 'rows';
      const fb = G.fb(N, N);
      let hover = null;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 360, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Byte layout', options: [['Rows: 8 pixels side by side', 'rows'], ['Pages: 8 pixels stacked (SSD1306)', 'pages']], value: mode },
        { type: 'buttons', items: [{ id: 'arrow', label: 'Draw an arrow', primary: true }, { id: 'invert', label: 'Invert' }, { id: 'clear', label: 'Clear' }] }
      ], (id, v) => {
        if (id === 'mode') mode = v;
        if (id === 'arrow') { fb.clear(); fb.fillRect(1, 6, 8, 5, 1); fb.fillTriangle(15, 8, 8, 1, 8, 15, 1); }
        if (id === 'invert') fb.invert();
        if (id === 'clear') fb.clear();
        loop.once();
      });
      const ro = kit.readout(box.side, [['size', 'This buffer'], ['byte', 'Byte under the pointer'], ['lit', 'Pixels lit'], ['real', 'A whole 128 × 64 screen']]);

      // the bytes of the buffer in the chosen layout: { v, desc }
      function bytesOf() {
        const out = [];
        if (mode === 'rows') {
          for (let y = 0; y < N; y++) for (let b = 0; b < N / 8; b++) {
            let v = 0;
            for (let i = 0; i < 8; i++) v = (v << 1) | (fb.px[y * N + b * 8 + i] ? 1 : 0);
            out.push(v);
          }
        } else {
          for (let p = 0; p < N / 8; p++) for (let x = 0; x < N; x++) {
            let v = 0;
            for (let j = 0; j < 8; j++) if (fb.px[(p * 8 + j) * N + x]) v |= 1 << j;
            out.push(v);
          }
        }
        return out;
      }
      const indexOf = cell => (mode === 'rows' ? cell.y * (N / 8) + (cell.x >> 3) : (cell.y >> 3) * N + cell.x);
      function geom() {
        const W = st.W, H = st.H, M = 10, rowsMode = mode === 'rows';
        const bytesW = rowsMode ? Math.min(130, W * 0.3) : 0;
        const left = rowsMode ? M : M + 38;
        let c = Math.floor(Math.min(26, (W - M - left - bytesW - (rowsMode ? 12 : 0)) / N, (H - 36 - (rowsMode ? 12 : 70)) / N));
        c = Math.max(8, c);
        return { M, c, gx: left, gy: 28, bytesW };
      }
      const cellAt = p => {
        const g = geom(), x = Math.floor((p.x - g.gx) / g.c), y = Math.floor((p.y - g.gy) / g.c);
        return x >= 0 && y >= 0 && x < N && y < N ? { x, y } : null;
      };
      let paint = 1;
      kit.drag(st, {
        hover: true,
        hit: p => {
          const cell = cellAt(p);
          if ((cell && cell.x) !== (hover && hover.x) || (cell && cell.y) !== (hover && hover.y) || !cell !== !hover) { hover = cell; loop.once(); }
          return cell;
        },
        start: cell => { paint = fb.get(cell.x, cell.y) ? 0 : 1; fb.pixel(cell.x, cell.y, paint); loop.once(); },
        move: (cell, p) => { const q = cellAt(p); if (q) { fb.pixel(q.x, q.y, paint); hover = q; } loop.once(); }
      });

      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), g = geom(), cs = g.c, bytes = bytesOf();
        const off = dim(C, 0.07);
        kit.label(c, mode === 'rows' ? 'Each byte: 8 pixels in a row, leftmost = top bit' : 'Each byte: 8 pixels in a column, top = bit 0', g.M, 12, { size: 11.5, color: C.text2, weight: 600 });
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
          c.fillStyle = fb.px[y * N + x] ? C.accent : off;
          c.fillRect(g.gx + x * cs + 0.5, g.gy + y * cs + 0.5, cs - 1, cs - 1);
        }
        // the byte boundary
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 3]); c.beginPath();
        if (mode === 'rows') { c.moveTo(g.gx + 8 * cs, g.gy - 3); c.lineTo(g.gx + 8 * cs, g.gy + N * cs + 3); }
        else { c.moveTo(g.gx - 3, g.gy + 8 * cs); c.lineTo(g.gx + N * cs + 3, g.gy + 8 * cs); }
        c.stroke(); c.restore();
        const hi = hover ? indexOf(hover) : -1;
        const fs = Math.max(8.5, Math.min(11, cs * 0.55));
        if (mode === 'rows') {
          const bx = g.gx + N * cs + 12, bw = (g.bytesW - 4) / 2;
          kit.label(c, 'bytes', bx, g.gy - 8, { size: 10, color: C.muted });
          for (let y = 0; y < N; y++) for (let b = 0; b < 2; b++) {
            const i = y * 2 + b, v = bytes[i], x0 = bx + b * (bw + 4), y0 = g.gy + y * cs;
            c.fillStyle = i === hi ? C.warn : off; c.fillRect(x0, y0 + 0.5, bw, cs - 1);
            kit.label(c, hex2(v), x0 + bw / 2, y0 + cs / 2, { size: fs, align: 'center', color: i === hi ? '#1b1b1b' : v ? C.text : C.faint, weight: v ? 650 : 500 });
          }
          if (hi >= 0) { const y = Math.floor(hi / 2), b = hi % 2; c.strokeStyle = C.warn; c.lineWidth = 2; c.strokeRect(g.gx + b * 8 * cs, g.gy + y * cs, 8 * cs, cs); }
        } else {
          const by = g.gy + N * cs + 14;
          for (let p = 0; p < 2; p++) {
            kit.label(c, 'page ' + p, g.M, by + p * 22 + 9, { size: 10, color: C.muted });
            for (let x = 0; x < N; x++) {
              const i = p * N + x, v = bytes[i], x0 = g.gx + x * cs, y0 = by + p * 22;
              c.fillStyle = i === hi ? C.warn : off; c.fillRect(x0 + 0.5, y0, cs - 1, 18);
              kit.label(c, hex2(v), x0 + cs / 2, y0 + 9, { size: fs, align: 'center', color: i === hi ? '#1b1b1b' : v ? C.text : C.faint, weight: v ? 650 : 500 });
            }
          }
          kit.label(c, 'page 0 = rows 0–7', g.gx, g.gy + 4 * cs, { size: 9.5, color: C.faint });
          kit.label(c, 'page 1 = rows 8–15', g.gx, g.gy + 12 * cs, { size: 9.5, color: C.faint });
          if (hi >= 0) { const p = Math.floor(hi / N), x = hi % N; c.strokeStyle = C.warn; c.lineWidth = 2; c.strokeRect(g.gx + x * cs, g.gy + p * 8 * cs, cs, 8 * cs); }
        }
        ro.set('size', N + ' × ' + N + ' = ' + (N * N) + ' pixels = ' + (N * N / 8) + ' bytes');
        ro.set('byte', hi >= 0 ? 'byte ' + hi + ' = 0x' + hex2(bytes[hi]) + ' = ' + bin8(bytes[hi]) : 'point at a pixel');
        ro.set('lit', fb.lit() + ' of ' + (N * N));
        ro.set('real', mode === 'rows' ? '16 bytes a row × 64 rows = 1 024 bytes' : '128 columns × 8 pages = 1 024 bytes');
      }, box.stage);
      st.onResize(() => loop.once());
      fb.fillRect(1, 6, 8, 5, 1); fb.fillTriangle(15, 8, 8, 1, 8, 15, 1);
      loop.once();
    }
  });

  /* ================================================================ gd-depth */
  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  const PW = 96, PH = 64;
  function paintScene(G, f, which) {
    if (which === 'gradients') {
      for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) {
        let c;
        if (y < 24) c = G.hsv(x * 330 / PW, 0.85, 1);
        else if (y < 36) { const v = Math.round(x * 255 / (PW - 1)); c = G.rgb(v, v, v); }
        else if (y < 50) { const v = Math.round(x * 255 / (PW - 1)); c = G.rgb(v, Math.round(v * 0.25), Math.round(v * 0.1)); }
        else { const v = Math.round(x * 255 / (PW - 1)); c = G.rgb(Math.round(v * 0.1), Math.round(v * 0.6), v); }
        f.px[y * PW + x] = c;
      }
    } else if (which === 'icon') {
      f.clear(0x1E2D4A);
      f.fillRoundRect(6, 6, 38, 30, 6, 0xF8F8F8);
      f.fillCircle(25, 22, 9, 0xF04040);
      f.fillRect(21, 12, 8, 4, 0xF8F8F8);
      f.fillRect(54, 6, 36, 12, 0x30D060);
      f.fillRect(54, 22, 36, 12, 0xFFB000);
      f.fillRect(54, 38, 36, 8, 0xF8F8F8);
      f.fillTriangle(8, 58, 22, 40, 36, 58, 0x3080FF);
      f.fillTriangle(24, 58, 36, 44, 48, 58, 0x20D0E0);
      f.fillRect(54, 50, 36, 8, 0xE040D0);
    } else {
      for (let y = 0; y < PH; y++) {
        const t = y / 40;
        const c = y < 40 ? lerpRGB(0x1038A0, 0xFF9A40, Math.min(1, t * t)) : lerpRGB(0x0A7E8C, 0x061A40, (y - 40) / 24);
        for (let x = 0; x < PW; x++) f.px[y * PW + x] = c;
      }
      f.fillCircle(66, 36, 10, 0xFFE060);
      f.fillCircle(66, 36, 7, 0xFFF4B0);
      f.fillCircle(18, 46, 22, 0x2E8B4F);
      f.fillCircle(52, 52, 24, 0x1F6A3C);
      f.fillRect(0, 44, PW, 3, 0x0A7E8C);
      f.fillRect(0, 47, PW, PH - 47, 0x08506E);
      f.fillCircle(66, 56, 5, 0xFFC860);
      f.fillRect(60, 49, 14, 3, 0xFF9A40);
      f.text('ESP32', 4, 4, { color: 0xFFFFFF });
    }
  }
  Hyper.sim('gd-depth', {
    title: 'Colour depth: the same picture in fewer bits',
    blurb: `The picture is drawn in full 24-bit colour; the part to the right of the divider is the same picture squeezed into the chosen format. **Drag the wipe** to compare.

**Try this**
- Choose *Smooth gradients* and *16 bits (RGB565)*: the grey and the colour ramps show faint steps — only 32 levels of red and blue, 64 of green.
- Go down to *8 bits*, then *2 bits*, then the two *1 bit* options: *dithered* keeps the picture recognisable with only black and white dots.
- Choose *Flat icon*: flat colours survive 8 bits almost unharmed, which is why icons can use small palettes.
- Mix a colour with the three sliders and read its RGB565 bits: 5 red, 6 green, 5 blue.`,
    mount(box, kit, params) {
      const G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.85, minH: 330, maxH: 540 });
      const FMT = {
        '24': { name: '24 bits', colours: '16.7 million colours', bits: 24 },
        '16': { name: '16 bits (RGB565)', colours: '65 536 colours', bits: 16 },
        '8': { name: '8 bits (3-3-2)', colours: '256 colours', bits: 8 },
        '2': { name: '2 bits, four greys', colours: '4 shades', bits: 2 },
        '1t': { name: '1 bit, threshold', colours: '2 colours', bits: 1 },
        '1d': { name: '1 bit, dithered', colours: '2 colours', bits: 1 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'pic', type: 'select', label: 'Picture', options: [['Landscape', 'landscape'], ['Smooth gradients', 'gradients'], ['Flat icon', 'icon']], value: ['gradients', 'icon'].includes(params.picture) ? params.picture : 'landscape' },
        { id: 'fmt', type: 'select', label: 'Format', options: Object.keys(FMT).map(k => [FMT[k].name, k]), value: FMT[params.format] ? params.format : '16' },
        { id: 'wipe', label: 'Original shown on the left', min: 0, max: 100, step: 1, value: 40, unit: '%' },
        { id: 'r', label: 'Your colour: red', min: 0, max: 255, step: 1, value: 200 },
        { id: 'g', label: 'green', min: 0, max: 255, step: 1, value: 90 },
        { id: 'b', label: 'blue', min: 0, max: 255, step: 1, value: 40 }
      ], (id) => { if (id === 'pic' || id === 'fmt') rebuild(); loop.once(); });
      const ro = kit.readout(box.side, [['col', 'Colours'], ['frame', 'A 320 × 240 screen'], ['err', 'Average error'], ['code', 'Your colour as bits']]);
      const src = G.fb(PW, PH, { depth: 24 }), dst = G.fb(PW, PH, { depth: 24 });
      let err = 0;
      function convert(c, fmt, x, y) {
        const r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255;
        if (fmt === '24') return c;
        if (fmt === '16') return G.quantize565(c);
        if (fmt === '8') return G.rgb(Math.round(Math.round(r / 255 * 7) * 255 / 7), Math.round(Math.round(g / 255 * 7) * 255 / 7), Math.round(Math.round(b / 255 * 3) * 255 / 3));
        const Y = 0.299 * r + 0.587 * g + 0.114 * b;
        if (fmt === '2') { const v = Math.round(Math.round(Y / 255 * 3) * 85); return G.rgb(v, v, v); }
        if (fmt === '1t') return Y >= 128 ? 0xFFFFFF : 0;
        return Y > (BAYER[y & 3][x & 3] + 0.5) / 16 * 255 ? 0xFFFFFF : 0;
      }
      function rebuild() {
        paintScene(G, src, ctl.values.pic);
        let sum = 0;
        for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) {
          const a = src.px[y * PW + x], d = convert(a, ctl.values.fmt, x, y);
          dst.px[y * PW + x] = d;
          sum += Math.abs(((a >> 16) & 255) - ((d >> 16) & 255)) + Math.abs(((a >> 8) & 255) - ((d >> 8) & 255)) + Math.abs((a & 255) - (d & 255));
        }
        err = sum / (3 * PW * PH) / 255 * 100;
      }
      rebuild();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), M = 12;
        const s = Math.max(2, Math.floor(Math.min((st.W - 2 * M) / PW, (st.H - 120) / PH)));
        const x0 = Math.round((st.W - PW * s) / 2), y0 = 30, W = PW * s, Hh = PH * s;
        const wipe = clamp(ctl.values.wipe, 0, 100) / 100, sx = Math.round(W * wipe);
        G.draw(c, dst, x0, y0, s, { style: 'tft', bezel: false });
        if (sx > 0) {
          c.save(); c.beginPath(); c.rect(x0, y0, sx, Hh); c.clip();
          G.draw(c, src, x0, y0, s, { style: 'tft', bezel: false });
          c.restore();
          c.strokeStyle = '#ffffff'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 + sx, y0 - 3); c.lineTo(x0 + sx, y0 + Hh + 3); c.stroke();
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0 - 0.5, y0 - 0.5, W + 1, Hh + 1);
        kit.label(c, 'original · 24 bits', x0, 14, { size: 11, color: C.text2, weight: 600 });
        kit.label(c, FMT[ctl.values.fmt].name, x0 + W, 14, { size: 11, color: C.accent, weight: 600, align: 'right' });
        // your colour: the original and what the format makes of it
        const r = Math.round(ctl.values.r), g = Math.round(ctl.values.g), b = Math.round(ctl.values.b), col = G.rgb(r, g, b);
        const q = convert(col, ctl.values.fmt, 0, 0), sy = y0 + Hh + 16, sw = Math.min(110, (W - 10) / 2);
        c.fillStyle = G.css(col); c.fillRect(x0, sy, sw, 34);
        c.fillStyle = G.css(q); c.fillRect(x0 + sw + 10, sy, sw, 34);
        c.strokeStyle = C.axis; c.strokeRect(x0 + 0.5, sy + 0.5, sw - 1, 33); c.strokeRect(x0 + sw + 10.5, sy + 0.5, sw - 1, 33);
        kit.label(c, 'your colour', x0, sy + 46, { size: 10.5, color: C.muted });
        kit.label(c, 'in this format', x0 + sw + 10, sy + 46, { size: 10.5, color: C.muted });
        const f = ctl.values.fmt;
        ro.set('col', FMT[f].colours);
        ro.set('frame', grp(G.frameBytes(320, 240, FMT[f].bits)) + ' bytes');
        ro.set('err', +err.toFixed(2) + ' % of full scale');
        if (f === '16') {
          const v = G.rgb565(r, g, b);
          ro.set('code', '0x' + v.toString(16).toUpperCase().padStart(4, '0') + ' = ' + (v >> 11).toString(2).padStart(5, '0') + ' ' + ((v >> 5) & 63).toString(2).padStart(6, '0') + ' ' + (v & 31).toString(2).padStart(5, '0'));
        } else if (f === '8') {
          const v = ((r >> 5) << 5) | ((g >> 5) << 2) | (b >> 6);
          ro.set('code', '0x' + hex2(v) + ' = ' + (v >> 5).toString(2).padStart(3, '0') + ' ' + ((v >> 2) & 7).toString(2).padStart(3, '0') + ' ' + (v & 3).toString(2).padStart(2, '0'));
        } else ro.set('code', f === '24' ? '0x' + (col).toString(16).toUpperCase().padStart(6, '0') : 'a grey level, no colour');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ gd-primitives */
  Hyper.sim('gd-primitives', {
    title: 'Drawing primitives, with their coordinates',
    blurb: `A 128 × 64 monochrome screen with its origin at the **top-left**. Pick a tool and **drag its round handles**; the call that would draw it appears below, with the coordinates your handles give. **Stamp** the shape into the buffer to keep it.

**Try this**
- Drag a handle downwards: *y grows downwards*, as on every display.
- With *Rectangle*, read the call: it takes the corner, a width and a height, not the opposite corner. With *Line* it takes both end points.
- Stamp a filled white rectangle, then stamp a *black* circle over it: later calls paint over earlier ones, and black erases.
- Drag a handle past the edge: the shape is clipped, with no error.`,
    mount(box, kit) {
      const G = kit.gfx, W = 128, Hh = 64;
      const fb = G.fb(W, Hh);
      const st = kit.stage(box.stage, { aspect: 0.68, minH: 300, maxH: 520 });
      const NP = { line: 2, rect: 2, round: 2, circle: 2, tri: 3, text: 1 };
      let tool = 'line', ptr = null;
      const pts = [{ x: 14, y: 12 }, { x: 98, y: 48 }, { x: 60, y: 8 }];
      const ctl = kit.controls(box.side, [
        { id: 'tool', type: 'select', label: 'Tool', options: [['Line', 'line'], ['Rectangle', 'rect'], ['Rounded rectangle', 'round'], ['Circle', 'circle'], ['Triangle', 'tri'], ['Text', 'text']], value: 'line' },
        { id: 'fill', type: 'check', label: 'Filled', value: false },
        { id: 'size', label: 'Text size', min: 1, max: 4, step: 1, value: 1 },
        { id: 'ink', type: 'select', label: 'Colour', options: [['white (lit)', 1], ['black (erases)', 0]], value: 1 },
        { id: 'grid', type: 'check', label: 'Coordinate grid', value: true },
        { type: 'buttons', items: [{ id: 'stamp', label: 'Stamp it into the buffer', primary: true }, { id: 'clear', label: 'Clear' }] }
      ], (id, v) => {
        if (id === 'tool') { tool = v; modes(); }
        if (id === 'stamp') shape(fb, ctl.values.ink);
        if (id === 'clear') fb.clear();
        loop.once();
      });
      const ro = kit.readout(box.side, [['call', 'The call'], ['px', 'Pixels it changes'], ['at', 'Pointer at']]);
      function modes() { ctl.show('size', tool === 'text'); ctl.show('fill', tool !== 'line' && tool !== 'text'); }
      modes();
      const rectOf = () => { const a = pts[0], b = pts[1]; return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x) + 1, h: Math.abs(a.y - b.y) + 1 }; };
      const radius = () => Math.round(Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y));
      function shape(f, col) {
        const a = pts[0], b = pts[1], d = pts[2], fill = ctl.values.fill;
        if (tool === 'line') f.line(a.x, a.y, b.x, b.y, col);
        else if (tool === 'rect') { const r = rectOf(); if (fill) f.fillRect(r.x, r.y, r.w, r.h, col); else f.rect(r.x, r.y, r.w, r.h, col); }
        else if (tool === 'round') { const r = rectOf(); if (fill) f.fillRoundRect(r.x, r.y, r.w, r.h, 6, col); else f.roundRect(r.x, r.y, r.w, r.h, 6, col); }
        else if (tool === 'circle') { if (fill) f.fillCircle(a.x, a.y, radius(), col); else f.circle(a.x, a.y, radius(), col); }
        else if (tool === 'tri') { if (fill) f.fillTriangle(a.x, a.y, b.x, b.y, d.x, d.y, col); else f.triangle(a.x, a.y, b.x, b.y, d.x, d.y, col); }
        else f.text('Hello', a.x, a.y, { size: ctl.values.size, color: col });
      }
      function callText() {
        const a = pts[0], b = pts[1], d = pts[2], col = ctl.values.ink ? 'WHITE' : 'BLACK', fill = ctl.values.fill;
        if (tool === 'line') return 'drawLine(' + [a.x, a.y, b.x, b.y, col].join(', ') + ');';
        if (tool === 'rect') { const r = rectOf(); return (fill ? 'fillRect(' : 'drawRect(') + [r.x, r.y, r.w, r.h, col].join(', ') + ');'; }
        if (tool === 'round') { const r = rectOf(); return (fill ? 'fillRoundRect(' : 'drawRoundRect(') + [r.x, r.y, r.w, r.h, 6, col].join(', ') + ');'; }
        if (tool === 'circle') return (fill ? 'fillCircle(' : 'drawCircle(') + [a.x, a.y, radius(), col].join(', ') + ');';
        if (tool === 'tri') return (fill ? 'fillTriangle(' : 'drawTriangle(') + [a.x, a.y, b.x, b.y, d.x, d.y, col].join(', ') + ');';
        return (ctl.values.size > 1 ? 'setTextSize(' + ctl.values.size + '); ' : '') + 'setCursor(' + a.x + ', ' + a.y + '); print("Hello");';
      }
      const geom = () => { const M = 12, s = Math.max(1.5, Math.min((st.W - 2 * M - 16) / W, (st.H - 74) / Hh)); return { s, ox: M + 16, oy: 22 }; };
      const toPix = p => { const g = geom(); return { x: clamp(Math.floor((p.x - g.ox) / g.s), 0, W - 1), y: clamp(Math.floor((p.y - g.oy) / g.s), 0, Hh - 1) }; };
      kit.drag(st, {
        hover: true,
        hit: p => {
          const g = geom();
          const q = { x: (p.x - g.ox) / g.s, y: (p.y - g.oy) / g.s };
          const nptr = q.x >= 0 && q.y >= 0 && q.x < W && q.y < Hh ? { x: Math.floor(q.x), y: Math.floor(q.y) } : null;
          if (!nptr !== !ptr || (nptr && ptr && (nptr.x !== ptr.x || nptr.y !== ptr.y))) { ptr = nptr; loop.once(); }
          for (let i = 0; i < NP[tool]; i++) if (Math.hypot(g.ox + (pts[i].x + 0.5) * g.s - p.x, g.oy + (pts[i].y + 0.5) * g.s - p.y) < 16) return i;
          return null;
        },
        move: (i, p) => { pts[i] = toPix(p); ptr = pts[i]; loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), g = geom(), s = g.s;
        const tmp = G.fb(W, Hh);
        tmp.px.set(fb.px);
        shape(tmp, ctl.values.ink);
        G.draw(c, fb, g.ox, g.oy, s, { style: 'oled', bezel: false });
        let changed = 0;
        for (let i = 0; i < W * Hh; i++) if (tmp.px[i] !== fb.px[i]) {
          changed++;
          c.fillStyle = tmp.px[i] ? C.accent : C.bad;
          c.fillRect(g.ox + (i % W) * s, g.oy + Math.floor(i / W) * s, Math.max(1, s - (s >= 4 ? 1 : 0)), Math.max(1, s - (s >= 4 ? 1 : 0)));
        }
        if (ctl.values.grid) {
          c.save(); c.strokeStyle = 'rgba(255,255,255,.16)'; c.lineWidth = 1; c.beginPath();
          for (let x = 0; x <= W; x += 16) { c.moveTo(g.ox + x * s, g.oy); c.lineTo(g.ox + x * s, g.oy + Hh * s); }
          for (let y = 0; y <= Hh; y += 16) { c.moveTo(g.ox, g.oy + y * s); c.lineTo(g.ox + W * s, g.oy + y * s); }
          c.stroke(); c.restore();
        }
        for (let x = 0; x < W; x += 16) kit.label(c, String(x), g.ox + x * s, g.oy - 8, { size: 9.5, color: C.muted, align: 'center' });
        for (let y = 0; y < Hh; y += 16) kit.label(c, String(y), g.ox - 4, g.oy + y * s + 6, { size: 9.5, color: C.muted, align: 'right' });
        kit.label(c, 'x →', g.ox + W * s, g.oy - 8, { size: 9.5, color: C.faint, align: 'right' });
        kit.label(c, 'y ↓', 4, g.oy + Hh * s / 2, { size: 9.5, color: C.faint });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(g.ox - 0.5, g.oy - 0.5, W * s + 1, Hh * s + 1);
        for (let i = 0; i < NP[tool]; i++) {
          const hx = g.ox + (pts[i].x + 0.5) * s, hy = g.oy + (pts[i].y + 0.5) * s;
          c.beginPath(); c.arc(hx, hy, 6.5, 0, Math.PI * 2); c.fillStyle = 'rgba(255,255,255,.92)'; c.fill(); c.lineWidth = 2; c.strokeStyle = C.accent; c.stroke();
          kit.label(c, String(i + 1), hx, hy, { size: 8.5, color: '#1b1b1b', align: 'center', weight: 700 });
        }
        const call = callText();
        kit.label(c, 'display.' + call, g.ox, g.oy + Hh * s + 18, { size: 11.5, color: C.text, font: 'ui-monospace, Consolas, monospace' });
        ro.set('call', call);
        ro.set('px', changed + (changed === 1 ? ' pixel' : ' pixels'));
        ro.set('at', ptr ? 'x = ' + ptr.x + ', y = ' + ptr.y : 'outside the screen');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ gd-text */
  Hyper.sim('gd-text', {
    title: 'Text in a dot font: sizes, wrapping and memory',
    blurb: `The classic 5 × 7 font on a 128 × 64 screen. Size *n* makes every dot an *n* × *n* block, so the character cell grows from 6 × 8 to 6*n* × 8*n* dots. The lower read-outs estimate what a bigger font costs in memory.

**Try this**
- Raise the **size** and watch the characters per line fall: 21, 10, 7, 5.
- Turn **wrap** off: the line runs off the right edge and is simply cut.
- Show the **character cells**: the dot between letters is part of every cell.
- Pick a 24-dot font in 4 bits per dot and 224 characters: a smooth font of that size is already tens of kilobytes before compression.`,
    mount(box, kit) {
      const G = kit.gfx, W = 128, Hh = 64;
      const fb = G.fb(W, Hh);
      const TEXTS = { temp: 'Temp 23.5 C  Hum 48 %', fox: 'The quick brown fox jumps over the lazy dog', num: '0123456789 ABCDEF abcdef' };
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 300, maxH: 500 });
      const ctl = kit.controls(box.side, [
        { id: 'text', type: 'select', label: 'Text', options: [['A reading', 'temp'], ['A sentence', 'fox'], ['Digits and letters', 'num']], value: 'fox' },
        { id: 'size', label: 'Text size', min: 1, max: 4, step: 1, value: 1 },
        { id: 'wrap', type: 'check', label: 'Wrap at the edge', value: true },
        { id: 'cells', type: 'check', label: 'Show the character cells', value: true },
        { id: 'fh', type: 'select', label: 'Font to estimate: height', options: [['8 dots', 8], ['12 dots', 12], ['16 dots', 16], ['24 dots', 24], ['32 dots', 32], ['48 dots', 48]], value: 16 },
        { id: 'bpp', type: 'select', label: 'Bits per dot', options: [['1 (bitmap)', 1], ['4 (smooth)', 4]], value: 1 },
        { id: 'chars', type: 'select', label: 'Characters', options: [['ASCII, 95', 95], ['digits and signs, 16', 16], ['Latin-1, 224', 224]], value: 95 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['grid', 'Screen holds'], ['fits', 'This text'], ['cell', 'One character cell'], ['font', 'Estimated font data']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), M = 12;
        const size = Math.round(ctl.values.size), str = TEXTS[ctl.values.text];
        fb.clear();
        fb.text(str, 0, 0, { size, wrap: ctl.values.wrap });
        const s = Math.max(2, Math.min((st.W - 2 * M) / W, (st.H - 96) / Hh)), ox = Math.round((st.W - W * s) / 2), oy = 14;
        G.draw(c, fb, ox, oy, s, { style: 'oled', bezel: false });
        const cw = 6 * size, ch = 8 * size, cols = Math.floor(W / cw), rows = Math.floor(Hh / ch);
        if (ctl.values.cells) {
          c.save(); c.strokeStyle = 'rgba(255,255,255,.22)'; c.lineWidth = 1; c.beginPath();
          for (let x = 0; x <= W; x += cw) { c.moveTo(ox + x * s, oy); c.lineTo(ox + x * s, oy + Hh * s); }
          for (let y = 0; y <= Hh; y += ch) { c.moveTo(ox, oy + y * s); c.lineTo(ox + W * s, oy + y * s); }
          c.stroke(); c.restore();
        }
        c.strokeStyle = C.axis; c.strokeRect(ox - 0.5, oy - 0.5, W * s + 1, Hh * s + 1);
        kit.label(c, '128 × 64 dots · size ' + size, ox, 6, { size: 10.5, color: C.muted });
        // the memory of a font, on a log scale from 100 bytes to 100 000
        const hgt = ctl.values.fh, wpx = Math.round(0.75 * hgt), rowBytes = Math.ceil(wpx * ctl.values.bpp / 8), bytes = ctl.values.chars * hgt * rowBytes;
        const by = oy + Hh * s + 34, bw = W * s, X = v => ox + clamp(Math.log10(v / 100) / 3, 0, 1) * bw;
        c.fillStyle = dim(C, 0.08); c.fillRect(ox, by, bw, 14);
        c.fillStyle = bytes > 20000 ? C.warn : C.accent; c.fillRect(ox, by, X(bytes) - ox, 14);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(475), by - 4); c.lineTo(X(475), by + 18); c.stroke();
        kit.label(c, 'built-in 5 × 7 font: 475 bytes', Math.min(X(475) + 6, ox + bw - 160), by - 10, { size: 10, color: C.text2 });
        for (const [v, t] of [[100, '100 B'], [1000, '1 KB'], [10000, '10 KB'], [100000, '100 KB']]) kit.label(c, t, X(v), by + 28, { size: 9.5, color: C.faint, align: v === 100 ? 'left' : v === 100000 ? 'right' : 'center' });
        const need = ctl.values.wrap ? Math.ceil(str.length / cols) : 1, fits = ctl.values.wrap ? need <= rows : str.length <= cols;
        ro.set('grid', cols + ' columns × ' + rows + ' lines');
        ro.set('fits', (fits ? 'fits: ' : 'does not fit: ') + str.length + ' characters' + (ctl.values.wrap ? ' need ' + need + ' lines' : ' on one line of ' + cols));
        ro.set('cell', cw + ' × ' + ch + ' dots');
        ro.set('font', grp(bytes) + ' bytes (' + ctl.values.chars + ' × ' + hgt + ' rows × ' + rowBytes + ' bytes)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ gd-flicker */
  Hyper.sim('gd-flicker', {
    title: 'Why clearing and redrawing flickers',
    blurb: `The screen shows whatever is in the panel's memory, while the ESP writes into that memory at the speed of the bus. A white line marks the last pixel written. The strip underneath splits one update into its steps.

**Try this**
- *Clear, then redraw everything*: the panel is blanked, then refilled. Read **Object seen**: the orange ball is missing for a large part of the time.
- *Erase only what moved*: a handful of pixels per update, no flicker at all.
- *Compose in RAM, push in one go*: the old picture stays until the new one sweeps over it. Look for the **tearing** line where old and new meet when the ball is moving fast.
- Raise the **SPI clock** or pick a **smaller panel**: the blank shrinks, but the pattern remains.
- The model is a small picture standing for the real panel, written at the real bus speed; slow motion lets you watch.`,
    mount(box, kit) {
      const G = kit.gfx, MW = 80, MH = 48, MN = MW * MH, BG = 0x101C40, OBJ = 0xFF8C1A, RAD = 5, OY = 26;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 310, maxH: 520 });
      const PANELS = { '160x128': [160, 128], '240x240': [240, 240], '320x240': [320, 240], '480x320': [480, 320] };
      const ctl = kit.controls(box.side, [
        { id: 'method', type: 'select', label: 'How the program draws', options: [['Clear, then redraw everything', 'A'], ['Erase only what moved', 'B'], ['Compose in RAM, push in one go', 'C']], value: 'A' },
        { id: 'panel', type: 'select', label: 'Panel', options: Object.keys(PANELS).map(k => [k.replace('x', ' × '), k]), value: '320x240' },
        { id: 'hz', type: 'select', label: 'SPI clock', options: [['10 MHz', 10e6], ['20 MHz', 20e6], ['40 MHz', 40e6], ['80 MHz', 80e6]], value: 40e6 },
        { id: 'speed', type: 'select', label: 'Time', options: [['real time', 1], ['1/5 speed', 0.2], ['1/20 speed', 0.05]], value: 0.2 }
      ], (id) => { if (id === 'method') reset(); });
      const ro = kit.readout(box.side, [['cycle', 'One update takes'], ['seen', 'Object seen'], ['bus', 'A full frame on this bus']]);
      const base = G.fb(MW, MH, { depth: 24 }), gram = G.fb(MW, MH, { depth: 24 });
      base.clear(BG);
      [14, 22, 10, 26, 18, 12].forEach((h, i) => base.fillRect(6 + i * 12, 46 - h, 7, h, 0x3A7BD5));
      base.text('TEMP', 2, 2, { color: 0xE8ECF4 });
      const frameWith = x => { const f = G.fb(MW, MH, { depth: 24 }); f.px.set(base.px); f.fillCircle(Math.round(x), OY, RAD, OBJ); return f; };
      const objX = t => 40 + 30 * Math.sin(2 * Math.PI * 0.4 * t);
      let fullObj = 0; { const f = frameWith(40); for (let i = 0; i < MN; i++) if (f.px[i] === OBJ) fullObj++; }
      let simT = 0, budget = 0, cyc = null, prevX = 40, marker = -1, lastTotal = 1, ring = [], visNow = true;
      function reset() { simT = 0; budget = 0; cyc = null; prevX = objX(0); gram.px.set(frameWith(prevX).px); marker = -1; ring = []; lastTotal = newCycleStub().reduce((a, o) => a + o.n, 0); }
      const rateModel = () => {
        const [w, h] = PANELS[ctl.values.panel];
        return (ctl.values.hz / (16 * 1.05)) / (w * h / MN);
      };
      function newCycle(x) {
        const target = frameWith(x), ops = [], m = ctl.values.method;
        const objOp = () => { const o = { name: 'object', idx: [], col: [] }; for (let i = 0; i < MN; i++) if (target.px[i] !== base.px[i]) { o.idx.push(i); o.col.push(target.px[i]); } return o; };
        if (m === 'A') {
          const clear = { name: 'clear', idx: [], col: [] }, back = { name: 'background', idx: [], col: [] };
          for (let i = 0; i < MN; i++) { clear.idx.push(i); clear.col.push(BG); if (base.px[i] !== BG) { back.idx.push(i); back.col.push(base.px[i]); } }
          ops.push(clear, back, objOp());
        } else if (m === 'B') {
          const erase = { name: 'erase', idx: [], col: [] };
          for (let y = Math.max(0, OY - RAD - 1); y <= Math.min(MH - 1, OY + RAD + 1); y++) for (let xx = Math.max(0, Math.floor(prevX) - RAD - 1); xx <= Math.min(MW - 1, Math.floor(prevX) + RAD + 1); xx++) { erase.idx.push(y * MW + xx); erase.col.push(base.px[y * MW + xx]); }
          ops.push(erase, objOp());
        } else {
          const push = { name: 'push the frame', idx: [], col: [] };
          for (let i = 0; i < MN; i++) { push.idx.push(i); push.col.push(target.px[i]); }
          ops.push(push);
        }
        let total = 0; for (const o of ops) total += o.idx.length;
        lastTotal = Math.max(1, total);
        return { ops, oi: 0, ei: 0, total: Math.max(1, total), done: 0, x };
      }
      function advance(sd) {
        budget += rateModel() * sd;
        let guard = 0;
        while (budget >= 1 && guard++ < 300) {
          if (!cyc) cyc = newCycle(objX(simT));
          const op = cyc.ops[cyc.oi], n = Math.min(Math.floor(budget), op.idx.length - cyc.ei);
          for (let k = 0; k < n; k++) { gram.px[op.idx[cyc.ei + k]] = op.col[cyc.ei + k]; marker = op.idx[cyc.ei + k]; }
          cyc.ei += n; cyc.done += n; budget -= n;
          if (cyc.ei >= op.idx.length) { cyc.oi++; cyc.ei = 0; if (cyc.oi >= cyc.ops.length) { prevX = cyc.x; cyc = null; } }
        }
        if (guard >= 300) budget = 0;
      }
      reset();
      const loop = kit.loop((dt) => {
        const sd = dt * ctl.values.speed;
        simT += sd; advance(sd);
        let n = 0; for (let i = 0; i < MN; i++) if (gram.px[i] === OBJ) n++;
        visNow = n >= 0.6 * fullObj;
        ring.push(visNow); if (ring.length > 150) ring.shift();
        const c = st.begin(), C = kit.colors(), M = 12;
        const s = Math.max(2, Math.floor(Math.min((st.W - 2 * M) / MW, (st.H - 110) / MH))), ox = Math.round((st.W - MW * s) / 2), oy = 26;
        G.draw(c, gram, ox, oy, s, { style: 'tft', bezel: false });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(ox - 0.5, oy - 0.5, MW * s + 1, MH * s + 1);
        if (marker >= 0) { const my = oy + (Math.floor(marker / MW) + 0.5) * s; c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(ox, my); c.lineTo(ox + MW * s, my); c.stroke(); }
        kit.label(c, 'the panel\'s memory, as the viewer sees it', ox, 12, { size: 10.5, color: C.muted });
        kit.dot(c, ox + MW * s - 8, 12, 5, visNow ? C.ok : C.bad);
        kit.label(c, visNow ? 'ball there' : 'ball missing', ox + MW * s - 16, 12, { size: 10, color: visNow ? C.ok : C.bad, align: 'right' });
        // the steps of one update
        const ty = oy + MH * s + 20, tw = MW * s, rate = rateModel();
        const stripOps = cyc ? cyc.ops.map(o => ({ name: o.name, n: o.idx.length })) : newCycleStub();
        let tot = 0; for (const o of stripOps) tot += o.n;
        let x = ox; const names = [];
        for (const o of stripOps) {
          const w = Math.max(2, tw * o.n / Math.max(1, tot));
          c.fillStyle = o.name === 'clear' || o.name === 'erase' ? C.bad : o.name === 'object' ? 'rgb(255,140,26)' : o.name === 'background' ? kit.hue(220, 0.7) : C.accent;
          c.fillRect(x, ty, w - 1, 14); x += w;
          names.push(o.name + ' ' + fmtMs(o.n / rate));
        }
        c.strokeStyle = C.text; c.lineWidth = 2; const px = ox + tw * (cyc ? cyc.done / Math.max(1, cyc.total) : 0);
        c.beginPath(); c.moveTo(px, ty - 3); c.lineTo(px, ty + 17); c.stroke();
        kit.label(c, names.join(' · '), ox, ty + 30, { size: 10.5, color: C.text2 });
        const [pw, ph] = PANELS[ctl.values.panel], cycleT = lastTotal / rate;
        const seen = ring.length ? ring.filter(Boolean).length / ring.length * 100 : 100;
        ro.set('cycle', fmtMs(cycleT) + ' · ' + fmtFps(1 / cycleT));
        ro.set('seen', Math.round(seen) + ' % of the time');
        ro.set('bus', pw + ' × ' + ph + ' at ' + ctl.values.hz / 1e6 + ' MHz: ' + fmtFps(G.busFps(pw, ph, 16, ctl.values.hz)));
      }, box.stage);
      // the steps of the next update, for the strip when no update is running
      function newCycleStub() {
        const m = ctl.values.method, back = base.px.reduce((n, v) => n + (v !== BG ? 1 : 0), 0);
        if (m === 'A') return [{ name: 'clear', n: MN }, { name: 'background', n: back }, { name: 'object', n: 81 }];
        if (m === 'B') return [{ name: 'erase', n: 144 }, { name: 'object', n: 81 }];
        return [{ name: 'push the frame', n: MN }];
      }
      loop.start();
    }
  });

  /* ================================================================ gd-framerate */
  const BUSES = [
    { id: 'i2c100', name: 'I2C 100 kHz', hz: 100e3, lanes: 1, pins: '2 pins', i2c: true },
    { id: 'i2c400', name: 'I2C 400 kHz', hz: 400e3, lanes: 1, pins: '2 pins', i2c: true },
    { id: 'i2c1m', name: 'I2C 1 MHz', hz: 1e6, lanes: 1, pins: '2 pins', i2c: true },
    { id: 'spi10', name: 'SPI 10 MHz', hz: 10e6, lanes: 1, pins: '5 pins' },
    { id: 'spi20', name: 'SPI 20 MHz', hz: 20e6, lanes: 1, pins: '5 pins' },
    { id: 'spi40', name: 'SPI 40 MHz', hz: 40e6, lanes: 1, pins: '5 pins' },
    { id: 'spi80', name: 'SPI 80 MHz', hz: 80e6, lanes: 1, pins: '5 pins' },
    { id: 'qspi40', name: 'Quad SPI 40 MHz', hz: 40e6, lanes: 4, pins: '6 pins' },
    { id: 'qspi80', name: 'Quad SPI 80 MHz', hz: 80e6, lanes: 4, pins: '6 pins' },
    { id: 'i80-8', name: 'Parallel 8-bit, 20 MHz', hz: 20e6, lanes: 8, pins: '11 pins' },
    { id: 'i80-16', name: 'Parallel 16-bit, 20 MHz', hz: 20e6, lanes: 16, pins: '19 pins' },
    { id: 'rgb', name: 'RGB panel (streamed)', stream: true, pins: '20 pins', rx: /RGB/ },
    { id: 'mipi', name: 'MIPI-DSI (streamed)', stream: true, pins: 'lane pins', rx: /DSI/ }
  ];
  const FR_DISPLAYS = [
    ['ssd1306-128x64', 'OLED 128 × 64 (SSD1306)'], ['st7735-160x128', 'TFT 160 × 128 (ST7735)'], ['st7789-240x240', 'TFT 240 × 240 (ST7789)'],
    ['ili9341-320x240', 'TFT 320 × 240 (ILI9341)'], ['st7796-480x320', 'TFT 480 × 320 (ST7796, 16 bit)'], ['ili9488-480x320', 'TFT 480 × 320 (ILI9488, 24 bit on SPI)'],
    ['rgb-800x480', 'RGB panel 800 × 480'], ['mipi-1024x600', 'MIPI-DSI panel 1024 × 600']
  ];
  Hyper.sim('gd-framerate', {
    title: 'How many frames a second can the bus carry?',
    blurb: `Frames a second = bits per second on the bus ÷ bits in a frame (with 5 % overhead). The bars show every interface that could drive the chosen display, on a log scale, with its pin count; the one you **highlight** is read out below.

**Try this**
- Take the *320 × 240 ILI9341* on *SPI 40 MHz*: about 31 frames a second, as the page says. Then move **redrawn** down to 10 %: ten times faster.
- Compare the two *480 × 320* screens: the ILI9488 sends 24 bits a pixel over SPI and is about a third slower than the 16-bit ST7796.
- Choose the *OLED* and watch I2C at 100 kHz (about 10 frames), 400 kHz (about 40) and 1 MHz.
- Pick the *800 × 480 RGB panel*: no serial bus comes near; only a streamed RGB or MIPI interface gives 60 Hz — and it needs tens of megabytes a second from the frame buffer.`,
    mount(box, kit, params) {
      const G = kit.gfx, E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 340, maxH: 520 });
      const dispIds = FR_DISPLAYS.filter(d => G.display(d[0]));
      const ctl = kit.controls(box.side, [
        { id: 'disp', type: 'select', label: 'Display', options: dispIds.map(d => [d[1], d[0]]), value: dispIds.some(d => d[0] === params.display) ? params.display : 'ili9341-320x240' },
        { id: 'bus', type: 'select', label: 'Highlight', options: BUSES.map(b => [b.name, b.id]), value: 'spi40' },
        { id: 'part', label: 'Share of the screen redrawn', min: 1, max: 100, value: 100, unit: '%', log: true, sig: 2 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['frame', 'One full frame'], ['fps', 'Frames a second'], ['verdict', 'It feels'], ['chips', 'Chips with it']]);
      const bppOf = d => (d.depth === 1 ? 1 : d.depth <= 16 ? 16 : 24);
      const usable = (b, d) => {
        if (b.i2c) return d.depth === 1 && d.w <= 128;
        if (d.depth === 1 && d.w <= 128 && b.lanes > 1) return false;
        if (b.id === 'rgb') return d.w >= 320 && d.depth > 1;
        if (b.id === 'mipi') return d.w >= 800;
        return true;
      };
      const fpsOf = (b, d, part) => {
        if (b.stream) return 60;
        const full = b.i2c ? G.i2cFps(d.w, d.h, b.hz) : G.busFps(d.w, d.h, bppOf(d), b.hz * b.lanes, 0.05);
        return full / part;
      };
      const chipsFor = b => {
        if (b.i2c || b.id.indexOf('spi') === 0) return 'every chip';
        if (b.id.indexOf('qspi') === 0) return 'chips with a quad-capable SPI host';
        const rx = b.stream ? b.rx : /I80/;
        const names = E.CHIPS.filter(c => !c.coproc && (c.lcd || []).some(l => rx.test(l))).map(c => String(c.name).split(' ')[0]);
        return names.length ? names.join(' · ') : 'none in the catalogue';
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), M = 12;
        const d = G.display(ctl.values.disp);
        const part = clamp(ctl.values.part, 1, 100) / 100;
        const list = BUSES.filter(b => usable(b, d));
        let sel = list.find(b => b.id === ctl.values.bus);
        if (!sel) sel = list.find(b => b.id === 'spi40') || list[0];
        const narrow = st.W < 520, LW = narrow ? 112 : 160, VW = narrow ? 92 : 130, bx = M + LW, bw = Math.max(40, st.W - 2 * M - LW - VW);
        const top = 28, bottom = 34, rh = clamp((st.H - top - bottom) / list.length, 14, 26);
        const X = v => bx + clamp((Math.log10(Math.max(v, 0.1)) + 1) / 4, 0, 1) * bw;
        kit.label(c, d.w + ' × ' + d.h + ' · ' + bppOf(d) + ' bits a pixel on the wire' + (part < 1 ? ' · ' + Math.round(part * 100) + ' % redrawn' : ''), M, 12, { size: 11, color: C.text2, weight: 600 });
        // guides
        c.save(); c.setLineDash([3, 4]); c.lineWidth = 1;
        for (const g of [1, 10, 30, 60, 100]) {
          c.strokeStyle = g === 30 || g === 60 ? C.ok : C.grid;
          c.beginPath(); c.moveTo(X(g), top - 4); c.lineTo(X(g), top + list.length * rh + 2); c.stroke();
          kit.label(c, String(g), X(g), top + list.length * rh + 14, { size: 9.5, color: g === 30 || g === 60 ? C.ok : C.faint, align: 'center' });
        }
        c.restore();
        kit.label(c, 'frames a second (log scale)', bx + bw, top + list.length * rh + 28, { size: 9.5, color: C.faint, align: 'right' });
        list.forEach((b, i) => {
          const y = top + i * rh, v = fpsOf(b, d, part), on = b === sel;
          c.fillStyle = b.stream ? C.ok : on ? C.accent : kit.hue(215, 0.5);
          c.globalAlpha = on ? 1 : 0.8;
          c.fillRect(bx, y + 2, Math.max(2, X(v) - bx), rh - 4);
          c.globalAlpha = 1;
          kit.label(c, b.name, M, y + rh / 2, { size: narrow ? 10 : 10.5, color: on ? C.text : C.text2, weight: on ? 700 : 500 });
          kit.label(c, (b.stream ? '60 Hz' : fmtFps(v)) + ' · ' + b.pins, bx + bw + 8, y + rh / 2, { size: narrow ? 9.5 : 10.5, color: on ? C.text : C.muted, weight: on ? 650 : 500 });
        });
        const bytes = G.frameBytes(d.w, d.h, d.depth), bits = d.w * d.h * bppOf(d);
        ro.set('frame', grp(bytes) + ' bytes · ' + grp(bits) + ' bits on the wire');
        if (sel.stream) {
          const mbs = d.w * d.h * (bppOf(d) / 8) * 60 / 1e6;
          ro.set('fps', '60 Hz, streamed: the chip reads ' + +mbs.toFixed(1) + ' MB/s from the frame buffer');
          ro.set('verdict', 'smooth, if the buffer is in PSRAM and the chip has the interface');
        } else {
          const full = fpsOf(sel, d, 1), eff = fpsOf(sel, d, part);
          ro.set('fps', fmtFps(full) + ' full' + (part < 1 ? ' · ' + fmtFps(eff) + ' at this share' : ''));
          ro.set('verdict', eff >= 30 ? 'smooth: 30 frames a second or more' : eff >= 15 ? 'usable for a user interface, choppy for animation' : eff >= 5 ? 'slow: numbers, menus and still pictures' : 'a slideshow');
        }
        ro.set('chips', chipsFor(sel));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ gd-epaper */
  Hyper.sim('gd-epaper', {
    title: 'E-paper: full refresh, partial refresh and ghosts',
    blurb: `A schematic 128 × 64 e-paper panel. A **full refresh** flashes black and white to reset the pigment, takes about two seconds and leaves a clean picture; a **partial refresh** takes under half a second without flashing but leaves a ghost that grows with every one. The times and the ghost model are typical, not those of one particular panel.

**Try this**
- Press **Change the picture** and then **Partial refresh** five or six times: the old pictures show through, stronger each time.
- Press **Full refresh**: the ghosts are gone, and you wait.
- Move **updates an hour** and read how much of every hour the panel spends refreshing — and why a clock with seconds is a poor idea.
- Notice that between refreshes nothing happens at all: the picture stays with no power.`,
    mount(box, kit) {
      const G = kit.gfx, W = 128, Hh = 64, N = W * Hh, FULL = 2.0, PART = 0.4;
      const fb = G.fb(W, Hh);
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 300, maxH: 520 });
      let n = 0, partials = 0, phase = 'idle', t = 0, dur = 0, ghost = 0;
      const v = new Float32Array(N).fill(1), from = new Float32Array(N), to = new Float32Array(N), shown = new Uint8Array(N);
      const ctl = kit.controls(box.side, [
        { id: 'perHour', label: 'Updates an hour', min: 1, max: 3600, value: 60, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'part', label: 'Partial refresh', primary: true }, { id: 'full', label: 'Full refresh' }, { id: 'next', label: 'Change the picture' }] }
      ], (id) => {
        if (id === 'next') { n++; paint(); }
        if (id === 'full' && phase === 'idle') begin('full');
        if (id === 'part' && phase === 'idle') begin('part');
        loop.start();
      });
      const ro = kit.readout(box.side, [['state', 'The panel'], ['since', 'Partial refreshes since a full one'], ['ghost', 'Ghost left'], ['busy', 'Refreshing, every hour']]);
      function paint() {
        fb.clear();
        const k = n % 3;
        if (k === 0) { fb.text('12:' + (30 + Math.floor(n / 3)), 64, 8, { size: 4, align: 'center' }); fb.text('Tuesday', 64, 48, { size: 2, align: 'center' }); }
        else if (k === 1) { for (let i = 0; i < 8; i++) { const h = 8 + ((n * 7 + i * 13) % 40); fb.fillRect(6 + i * 15, 60 - h, 10, h, 1); } fb.hline(2, 60, 124); }
        else fb.text('Door open\n21.4 C\nBat 87 %', 4, 6, { size: 2 });
      }
      const white = i => (fb.px[i] ? 0 : 1);
      function begin(kind) {
        phase = kind; t = 0; dur = kind === 'full' ? FULL : PART;
        from.set(v);
        const k = Math.min(0.55, 0.06 + 0.035 * partials);
        for (let i = 0; i < N; i++) {
          const target = white(i);
          to[i] = kind === 'full' ? target : (shown[i] !== target ? target + (v[i] - target) * k : v[i]);
        }
      }
      function finish() {
        const wasFull = phase === 'full';
        for (let i = 0; i < N; i++) { v[i] = to[i]; shown[i] = white(i); }
        if (wasFull) partials = 0; else partials++;
        let g = 0, cnt = 0;
        for (let i = 0; i < N; i++) if (white(i) === 1) { g += 1 - v[i]; cnt++; }
        ghost = cnt ? g / cnt * 100 : 0;
        phase = 'idle';
      }
      paint();
      for (let i = 0; i < N; i++) { v[i] = white(i); shown[i] = white(i); }
      const LUT = []; for (let k = 0; k <= 32; k++) { const f = k / 32; LUT.push('rgb(' + Math.round(lerp(27, 233, f)) + ',' + Math.round(lerp(27, 230, f)) + ',' + Math.round(lerp(27, 220, f)) + ')'); }
      const loop = kit.loop((dt) => {
        if (phase !== 'idle') {
          t += dt;
          if (t >= dur) finish();
          else if (phase === 'full') {
            const f = t / dur;
            for (let i = 0; i < N; i++) v[i] = f < 0.2 ? 0 : f < 0.4 ? 1 : f < 0.6 ? 0 : f < 0.8 ? 1 : lerp(1, to[i], (f - 0.8) / 0.2);
          } else for (let i = 0; i < N; i++) v[i] = lerp(from[i], to[i], t / dur);
        }
        const c = st.begin(), C = kit.colors(), M = 14;
        const s = Math.max(2, Math.floor(Math.min((st.W - 2 * M - 12) / W, (st.H - 90) / Hh))), ox = Math.round((st.W - W * s) / 2), oy = 20;
        c.fillStyle = '#c9c5b8'; c.fillRect(ox - 8, oy - 8, W * s + 16, Hh * s + 16);
        for (let y = 0; y < Hh; y++) {
          let x = 0;
          while (x < W) {
            const q = Math.round(clamp(v[y * W + x], 0, 1) * 32);
            let k = x + 1; while (k < W && Math.round(clamp(v[y * W + k], 0, 1) * 32) === q) k++;
            c.fillStyle = LUT[q]; c.fillRect(ox + x * s, oy + y * s, (k - x) * s, s);
            x = k;
          }
        }
        // progress of the refresh
        const py = oy + Hh * s + 22, pw = W * s;
        c.fillStyle = dim(C, 0.1); c.fillRect(ox, py, pw, 10);
        if (phase !== 'idle') { c.fillStyle = phase === 'full' ? C.warn : C.accent; c.fillRect(ox, py, pw * clamp(t / dur, 0, 1), 10); }
        kit.label(c, phase === 'idle' ? 'idle: the picture stays, no power needed' : (phase === 'full' ? 'full refresh: flashing, ' : 'partial refresh: ') + fmtMs(t) + ' of ' + fmtMs(dur), ox, py + 24, { size: 10.5, color: C.text2 });
        const per = ctl.values.perHour;
        ro.set('state', phase === 'idle' ? 'showing a still picture' : phase === 'full' ? 'full refresh, flashing' : 'partial refresh');
        ro.set('since', String(partials));
        ro.set('ghost', +ghost.toFixed(1) + ' % of full contrast');
        ro.set('busy', 'full: ' + +(per * FULL / 60).toFixed(1) + ' min (' + Math.min(100, +(per * FULL / 36).toFixed(1)) + ' %) · partial: ' + +(per * PART / 60).toFixed(1) + ' min (' + Math.min(100, +(per * PART / 36).toFixed(1)) + ' %)');
        if (phase === 'idle') loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ gd-hub75 */
  Hyper.sim('gd-hub75', {
    title: 'A HUB75 panel: scan, bit planes and refresh',
    blurb: `A 64 × 32 HUB75 panel (1/16 scan). With **slow motion** on, only one **row pair** — row *n* and row *n* + 16 — is lit at a time and the controller cycles through all sixteen; the lower strip shows the **bit planes** of one row, each twice as long as the one before. With it off you see what the eye sees: the whole picture.

**Try this**
- Lower the **bits per colour** to 2 or 3: the smooth ramp at the bottom turns to steps, and the refresh rate rises.
- Chain **four panels** and raise the bits: the refresh ceiling falls, and the DMA buffer grows.
- Raise the **brightness** and read the current: about 4 A per panel only at full white; this picture needs much less.
- The rate shown is the ceiling set by shifting data alone; real panels also need time to light the LEDs.`,
    mount(box, kit) {
      const G = kit.gfx, PW2 = 64, PH2 = 32;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 300, maxH: 520 });
      const pic = G.fb(PW2, PH2, { depth: 24 });
      for (let y = 0; y < PH2; y++) for (let x = 0; x < PW2; x++) pic.px[y * PW2 + x] = G.hsv((x * 5 + y * 3) % 360, 0.9, 0.35 + 0.65 * y / 31);
      for (let y = 25; y < PH2; y++) for (let x = 0; x < PW2; x++) { const g = Math.round(x * 255 / 63); pic.px[y * PW2 + x] = G.rgb(g, g, g); }
      pic.text('HUB75', 2, 8, { color: 0xFFFFFF });
      const ctl = kit.controls(box.side, [
        { id: 'bits', label: 'Bits per colour', min: 1, max: 8, step: 1, value: 5 },
        { id: 'fc', type: 'select', label: 'Shift clock', options: [['5 MHz', 5], ['10 MHz', 10], ['20 MHz', 20]], value: 10 },
        { id: 'chain', label: 'Panels chained', min: 1, max: 4, step: 1, value: 1 },
        { id: 'bright', label: 'Brightness', min: 5, max: 100, step: 5, value: 50, unit: '%' },
        { id: 'slow', type: 'check', label: 'Slow motion: show the scan', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['pins', 'Signal pins'], ['col', 'Colours'], ['rate', 'Refresh ceiling'], ['ram', 'DMA buffer (about)'], ['amps', 'Supply']]);
      let leds = [], lum = 0, lastBits = -1;
      function quantise(bits) {
        const lv = Math.pow(2, bits) - 1; let sum = 0;
        leds = new Array(PW2 * PH2);
        for (let i = 0; i < PW2 * PH2; i++) {
          const c = pic.px[i], r = Math.round(Math.round(((c >> 16) & 255) / 255 * lv) * 255 / lv), g = Math.round(Math.round(((c >> 8) & 255) / 255 * lv) * 255 / lv), b = Math.round(Math.round((c & 255) / 255 * lv) * 255 / lv);
          leds[i] = 'rgb(' + r + ',' + g + ',' + b + ')'; sum += (r + g + b) / 765;
        }
        lum = sum / (PW2 * PH2); lastBits = bits;
      }
      const loop = kit.loop((dt, t) => {
        const bits = Math.round(ctl.values.bits);
        if (bits !== lastBits) quantise(bits);
        const c = st.begin(), C = kit.colors(), M = 12;
        const s = Math.max(4, Math.floor(Math.min((st.W - 2 * M) / PW2, (st.H - 112) / PH2))), ox = Math.round((st.W - PW2 * s) / 2), oy = 18;
        const slow = ctl.values.slow, row = Math.floor(t * 3) % 16, frac = (t * 3) % 1;
        c.fillStyle = '#0a0a0c'; c.fillRect(ox - 4, oy - 4, PW2 * s + 8, PH2 * s + 8);
        for (let y = 0; y < PH2; y++) {
          const lit = !slow || y === row || y === row + 16;
          c.globalAlpha = lit ? 1 : 0.1;
          for (let x = 0; x < PW2; x++) { c.fillStyle = leds[y * PW2 + x]; c.beginPath(); c.arc(ox + (x + 0.5) * s, oy + (y + 0.5) * s, s * 0.38, 0, Math.PI * 2); c.fill(); }
        }
        c.globalAlpha = 1;
        kit.label(c, 'one panel, 64 × 32 LEDs' + (slow ? ' · row pair ' + row + ' and ' + (row + 16) + ' lit' : ' · scanning too fast to see'), ox, 8, { size: 10.5, color: C.muted });
        // the sixteen row pairs and the bit planes of one row
        const sy = oy + PH2 * s + 16, sw = PW2 * s, cw = sw / 16;
        for (let i = 0; i < 16; i++) { c.fillStyle = slow && i === row ? C.accent : dim(C, 0.12); c.fillRect(ox + i * cw + 0.5, sy, cw - 1, 12); }
        kit.label(c, 'scan: 16 row pairs', ox, sy + 24, { size: 10, color: C.muted });
        const by = sy + 36, tot = Math.pow(2, bits) - 1; let x = ox, acc = 0;
        const pos = frac * tot;
        for (let i = 0; i < bits; i++) {
          const w = sw * Math.pow(2, i) / tot, active = slow && pos >= acc && pos < acc + Math.pow(2, i);
          c.fillStyle = active ? C.warn : kit.hue(200 + i * 14, 0.55); c.fillRect(x + 0.5, by, Math.max(1, w - 1), 12);
          x += w; acc += Math.pow(2, i);
        }
        kit.label(c, 'bit planes of one row: each twice as long as the one before', ox, by + 24, { size: 10, color: C.muted });
        const chain = Math.round(ctl.values.chain), fc = ctl.values.fc;
        const f = 2 * fc * 1e6 / (PW2 * PH2 * chain * bits), kb = bits * (PW2 * PH2 * chain / 2) * 2 / 1024;
        const amps = 4 * chain * (ctl.values.bright / 100) * lum;
        ro.set('pins', '13 signal pins, plus 5 V and ground');
        ro.set('col', grp(Math.pow(2, 3 * bits)) + ' colours');
        ro.set('rate', (f >= 100 ? Math.round(f) : +f.toFixed(1)) + ' Hz ' + (f >= 300 ? '· steady' : f >= 100 ? '· steady to the eye, bands on a camera' : '· visible flicker'));
        ro.set('ram', (kb >= 10 ? Math.round(kb) : +kb.toFixed(1)) + ' KB per buffer');
        ro.set('amps', 'up to ' + 4 * chain + ' A at full white; about ' + +amps.toFixed(2) + ' A for this picture');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ gd-backlight */
  Hyper.sim('gd-backlight', {
    title: 'Backlight dimming, gamma and power',
    blurb: `On an **LCD** the backlight sets both the brightness and most of the power; a PWM duty cycle dims it. The lower graph shows the duty written (solid) and how bright it looks (dashed). On an **OLED** the lit dots set the current. Figures for the OLED are schematic, anchored at about 20 mA with half the dots lit.

**Try this**
- Turn **gamma correction** off and drag the setting from 0 to 30 %: the picture jumps up quickly then barely changes at the top. Turn it on and the steps even out.
- Lower the **PWM frequency** to a few hundred hertz and read the verdict; raise it and watch the resolution available (the chip's PWM trades bits for frequency).
- Halve the setting on the LCD: the current halves, the battery life doubles.
- Switch to the **OLED** and slide **lit dots**: a dark screen is cheap here, and would not be on the LCD.`,
    mount(box, kit) {
      const G = kit.gfx, E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 400, maxH: 540 });
      const pic = G.fb(64, 40, { depth: 24 });
      pic.clear(0x101C40); pic.fillRect(0, 0, 64, 7, 0x1B2A5E); pic.text('Hello', 2, 0, { color: 0xE8ECF4 });
      for (let i = 0; i < 6; i++) pic.fillRect(4 + i * 10, 38 - (8 + (i * 7) % 20), 7, 8 + (i * 7) % 20, 0x3A7BD5);
      pic.fillCircle(52, 18, 6, 0xFF8C1A);
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Screen', options: [['LCD with a backlight', 'lcd'], ['OLED, no backlight', 'oled']], value: 'lcd' },
        { id: 'set', label: 'Brightness setting', min: 0, max: 100, step: 1, value: 40, unit: '%' },
        { id: 'gamma', type: 'check', label: 'Gamma correction (2.2)', value: true },
        { id: 'f', label: 'PWM frequency', min: 100, max: 20000, value: 5000, unit: 'Hz', log: true, sig: 2 },
        { id: 'I', label: 'Backlight current at full', min: 10, max: 100, step: 1, value: 40, unit: 'mA' },
        { id: 'lit', label: 'Lit dots', min: 0, max: 100, step: 1, value: 50, unit: '%' }
      ], (id) => { if (id === 'kind') modes(); loop.once(); });
      const ro = kit.readout(box.side, [['duty', 'Duty cycle'], ['cur', 'Current'], ['life', 'On a 1 000 mAh cell'], ['bits', 'PWM resolution'], ['flick', 'Flicker']]);
      function modes() { const lcd = ctl.values.kind === 'lcd'; ctl.show('gamma', lcd); ctl.show('f', lcd); ctl.show('I', lcd); ctl.show('lit', !lcd); }
      modes();
      const noise = i => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), M = 12, lcd = ctl.values.kind === 'lcd';
        const set = ctl.values.set / 100, duty = lcd ? (ctl.values.gamma ? Math.pow(set, 2.2) : set) : set, looks = lcd ? Math.pow(duty, 1 / 2.2) : set;
        const wide = st.W >= 560, sc = clamp(Math.floor(st.W * 0.36 / 64), 2, 4), ox = M, oy = 22;
        // the screen
        const shown = G.fb(64, 40, { depth: 24 });
        if (lcd) shown.px.set(pic.px);
        else for (let i = 0; i < 64 * 40; i++) shown.px[i] = noise(i) < ctl.values.lit / 100 ? 0x7FD8FF : 0x05070C;
        G.draw(c, shown, ox, oy, sc, { style: 'tft', bezel: false });
        c.fillStyle = 'rgba(0,0,0,' + (1 - looks) + ')'; c.fillRect(ox, oy, 64 * sc, 40 * sc);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(ox - 0.5, oy - 0.5, 64 * sc + 1, 40 * sc + 1);
        kit.label(c, lcd ? 'LCD: how bright it looks' : 'OLED: lit dots at this setting', ox, 10, { size: 10.5, color: C.muted });
        // the PWM trace, or the current bar
        const wx = wide ? ox + 64 * sc + 24 : ox, wy = wide ? oy + 4 : oy + 40 * sc + 28, ww = st.W - M - wx, wh = wide ? Math.min(90, 40 * sc - 8) : 52;
        const I = lcd ? ctl.values.I * duty : 3 + 34 * (ctl.values.lit / 100) * set;
        if (lcd) {
          const f = ctl.values.f, d = clamp(duty, 0.004, 0.996);
          S.wave(c, wx, wy, ww, wh, S.pwmEdges(f, d, 0, 3 / f), { t0: 0, t1: 3 / f, label: 'BL', fill: true });
          kit.label(c, 'three periods at ' + (f >= 1000 ? +(f / 1000).toFixed(1) + ' kHz' : Math.round(f) + ' Hz') + ' · duty ' + Math.round(duty * 100) + ' %', wx, wy - 10, { size: 10.5, color: C.muted });
        } else {
          c.fillStyle = dim(C, 0.1); c.fillRect(wx, wy + 10, ww, 16);
          c.fillStyle = C.warn; c.fillRect(wx, wy + 10, ww * clamp(I / 40, 0, 1), 16);
          kit.label(c, 'current from 0 to 40 mA', wx, wy - 4, { size: 10.5, color: C.muted });
          kit.label(c, +I.toFixed(1) + ' mA', wx + ww, wy + 40, { size: 11, color: C.text, align: 'right', weight: 650 });
        }
        // the curves
        const gy = (wide ? oy + 40 * sc : wy + wh) + 40, gx = M + 30, gw = st.W - M - gx, gh = Math.max(70, st.H - gy - 34);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(gx + 0.5, gy + 0.5, gw, gh);
        c.save(); c.strokeStyle = C.grid; c.beginPath(); for (let k = 1; k < 4; k++) { c.moveTo(gx + gw * k / 4, gy); c.lineTo(gx + gw * k / 4, gy + gh); c.moveTo(gx, gy + gh * k / 4); c.lineTo(gx + gw, gy + gh * k / 4); } c.stroke(); c.restore();
        const curve = (fn, colour, dash) => {
          c.save(); c.strokeStyle = colour; c.lineWidth = 2; c.setLineDash(dash || []); c.beginPath();
          for (let k = 0; k <= 50; k++) { const x = k / 50, y = fn(x); const px = gx + gw * x, py = gy + gh * (1 - y); k ? c.lineTo(px, py) : c.moveTo(px, py); }
          c.stroke(); c.restore();
        };
        if (lcd) {
          const g = ctl.values.gamma;
          curve(x => (g ? Math.pow(x, 2.2) : x), C.accent);
          curve(x => (g ? x : Math.pow(x, 1 / 2.2)), C.warn, [5, 4]);
          const dx = gx + gw * set;
          kit.dot(c, dx, gy + gh * (1 - duty), 4.5, C.accent); kit.dot(c, dx, gy + gh * (1 - looks), 4.5, C.warn);
          kit.label(c, 'duty written', gx + 6, gy + 10, { size: 10, color: C.accent, weight: 600 });
          kit.label(c, 'how bright it looks', gx + 6, gy + 24, { size: 10, color: C.warn, weight: 600 });
          kit.label(c, 'setting →', gx + gw, gy + gh + 14, { size: 9.5, color: C.faint, align: 'right' });
        } else {
          curve(x => (3 + 34 * x * set) / 40, C.accent);
          kit.dot(c, gx + gw * ctl.values.lit / 100, gy + gh * (1 - clamp(I / 40, 0, 1)), 4.5, C.warn);
          kit.label(c, 'current against lit dots (0 to 40 mA)', gx + 6, gy + 10, { size: 10, color: C.accent, weight: 600 });
          kit.label(c, 'lit dots →', gx + gw, gy + gh + 14, { size: 9.5, color: C.faint, align: 'right' });
        }
        // numbers
        ro.set('duty', lcd ? Math.round(duty * 100) + ' % written · looks ' + Math.round(looks * 100) + ' % as bright' : 'not used: an OLED has no backlight');
        ro.set('cur', lcd ? +I.toFixed(1) + ' mA from the backlight' : +I.toFixed(1) + ' mA for the screen (schematic)');
        ro.set('life', I > 0 ? (1000 / I >= 100 ? Math.round(1000 / I) : +(1000 / I).toFixed(1)) + ' hours, this screen alone' : 'no limit from the screen');
        if (lcd) {
          const f = ctl.values.f;
          ro.set('bits', 'up to ' + E.ledcMaxBits(f) + ' bits; 8 are plenty (a program for any chip: 14 or fewer)');
          ro.set('flick', f < 300 ? 'visible flicker and bands on camera' : f < 1000 ? 'may show on camera' : f <= 20000 ? 'steady' : 'steady and above hearing');
        } else { ro.set('bits', 'not applicable'); ro.set('flick', 'none from a backlight; the OLED refreshes itself'); }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ gd-round */
  Hyper.sim('gd-round', {
    title: 'A round screen is a square with its corners cut off',
    blurb: `The 240 × 240 buffer is a square; the glass shows a disc. The darkened corners are pixels you pay for in memory and bus time but never see. Slide the **orange label** to see how much of it survives, and what width a row has at that height.

**Try this**
- Read **Visible**: for a round screen 78.5 % of the buffer is seen (π/4).
- Move the label to the top of the screen: its corners vanish; the **visible width** of a row there is only a short chord.
- Switch on the **safe square**: anything inside it is always visible.
- Compare *rounded square* and *square*: only a little is lost at the corners of the first, nothing at all in the second.`,
    mount(box, kit) {
      const G = kit.gfx, N = 240, R = 120;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 300, maxH: 560 });
      const fb = G.fb(N, N, { depth: 24 });
      fb.clear(0x101622);
      for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30, len = i % 5 === 0 ? 12 : 6; fb.line(R + Math.sin(a) * (R - 6 - len), R - Math.cos(a) * (R - 6 - len), R + Math.sin(a) * (R - 6), R - Math.cos(a) * (R - 6), i % 5 === 0 ? 0xE8ECF4 : 0x5A6A88); }
      fb.arc(R, R, 96, -135, 100, 8, 0x38A0FF); fb.arc(R, R, 96, 100, 135, 8, 0x2A3A58);
      fb.text('23.5', R, R - 12, { size: 4, align: 'center', color: 0xFFFFFF });
      fb.text('deg C', R, R + 30, { size: 2, align: 'center', color: 0x9FB0D0 });
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Screen', options: [['Round (GC9A01, 1.28″)', 'round'], ['Rounded square', 'rsq'], ['Square', 'sq']], value: 'round' },
        { id: 'ly', label: 'Label: distance from the top', min: 0, max: 216, step: 1, value: 14, unit: 'px' },
        { id: 'lw', label: 'Label: width', min: 40, max: 240, step: 1, value: 150, unit: 'px' },
        { id: 'safe', type: 'check', label: 'Show the safe square', value: true },
        { id: 'guides', type: 'check', label: 'Show the visible row width', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['seen', 'Visible'], ['label', 'Label visible'], ['chord', 'Visible width of its row'], ['ppi', 'Sharpness']]);
      const CR = 40;
      const inside = (shape, x, y) => {
        const px = x + 0.5, py = y + 0.5;
        if (shape === 'sq') return true;
        if (shape === 'round') return (px - R) * (px - R) + (py - R) * (py - R) <= R * R;
        const cx = px < CR ? CR : px > N - CR ? N - CR : px, cy = py < CR ? CR : py > N - CR ? N - CR : py;
        return (px - cx) * (px - cx) + (py - cy) * (py - cy) <= CR * CR;
      };
      const share = {};
      for (const sh of ['round', 'rsq', 'sq']) { let n = 0; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (inside(sh, x, y)) n++; share[sh] = n / (N * N); }
      const chordAt = (shape, y) => { let n = 0; for (let x = 0; x < N; x++) if (inside(shape, x, y)) n++; return n; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), M = 12, shape = ctl.values.shape;
        const wide = st.W >= 560;
        const s = Math.max(1, Math.floor(Math.min((st.W - 2 * M - (wide ? 170 : 0)) / N, (st.H - 50) / N))), ox = M, oy = 24, side = N * s;
        G.draw(c, fb, ox, oy, s, { style: 'tft', bezel: false });
        const ly = Math.round(ctl.values.ly), lw = Math.round(ctl.values.lw), lh = 24, lx = Math.round((N - lw) / 2);
        c.fillStyle = 'rgb(255,140,26)'; c.fillRect(ox + lx * s, oy + ly * s, lw * s, lh * s);
        kit.label(c, 'TITLE', ox + N * s / 2, oy + (ly + lh / 2) * s, { size: Math.max(9, 12 * s * 0.9), color: '#1b1b1b', align: 'center', weight: 700 });
        // the corners nobody sees
        c.save(); c.fillStyle = 'rgba(0,0,0,.72)'; c.beginPath(); c.rect(ox, oy, side, side);
        if (shape === 'round') { c.moveTo(ox + side / 2 + R * s, oy + side / 2); c.arc(ox + side / 2, oy + side / 2, R * s, 0, Math.PI * 2); }
        else if (shape === 'rsq' && c.roundRect) c.roundRect(ox, oy, side, side, CR * s);
        c.fill('evenodd'); c.restore();
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(ox - 0.5, oy - 0.5, side + 1, side + 1);
        const half = (shape === 'round' ? R / Math.SQRT2 : shape === 'rsq' ? (R - CR * (1 - Math.SQRT1_2)) : R);
        if (ctl.values.safe && shape !== 'sq') { c.save(); c.strokeStyle = C.ok; c.lineWidth = 1.5; c.setLineDash([5, 4]); c.strokeRect(ox + (R - half) * s, oy + (R - half) * s, 2 * half * s, 2 * half * s); c.restore(); kit.label(c, 'safe square', ox + (R - half) * s + 4, oy + (R - half) * s + 10, { size: 9.5, color: C.ok }); }
        const rowY = clamp(ly + lh / 2, 0, N - 1), chord = chordAt(shape, Math.floor(rowY));
        if (ctl.values.guides) {
          const gy = oy + rowY * s, x1 = ox + (R - chord / 2) * s, x2 = ox + (R + chord / 2) * s;
          c.save(); c.strokeStyle = '#ffffff'; c.lineWidth = 1.5; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(x1, gy); c.lineTo(x2, gy); c.stroke(); c.restore();
          kit.dot(c, x1, gy, 3.5, '#ffffff'); kit.dot(c, x2, gy, 3.5, '#ffffff');
        }
        if (wide) {   // the visible width of every row
          const cx = ox + side + 28, cwid = 120;
          kit.label(c, 'visible width by row', cx, 12, { size: 10.5, color: C.muted });
          for (let y = 0; y < N; y += 4) {
            const w = chordAt(shape, y) / N * cwid, on = rowY >= y && rowY < y + 4;
            c.fillStyle = on ? C.warn : kit.hue(215, 0.5); c.fillRect(cx, oy + y * s, Math.max(1, w), Math.max(1, 4 * s - 1));
          }
        }
        // numbers
        let vis = 0, tot = 0;
        for (let y = ly; y < ly + lh; y++) for (let x = lx; x < lx + lw; x++) { tot++; if (inside(shape, x, y)) vis++; }
        ro.set('seen', +(share[shape] * 100).toFixed(1) + ' % of the 240 × 240 buffer (' + grp(N * N * share[shape] * 2) + ' of 115 200 bytes)');
        ro.set('label', Math.round(vis / Math.max(1, tot) * 100) + ' % of the label');
        ro.set('chord', chord + ' of 240 pixels');
        ro.set('ppi', +(N / 1.28).toFixed(0) + ' pixels per inch on the 1.28-inch module');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
