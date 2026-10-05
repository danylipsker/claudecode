/* HYPER-ESP32 · sims/camera-and-vision.js
 *
 * Simulations of "Cameras and vision" (topic code: cv).
 *
 *   cv-dvp-signals   the wires of a DVP camera: PCLK, VSYNC, HREF and the data lines for a tiny frame
 *   cv-sampling      a drawn scene sampled at a frame size, a zoom on the real pixels, JPEG quality and size
 *   cv-resolution    frame size, format, quality and buffers against memory, sensor, bus and Wi-Fi limits
 *   cv-mjpeg         an MJPEG stream: the parts on the wire, the frame rate and who limits it
 *   cv-qr            finding a QR code by the 1 : 1 : 3 : 1 : 1 proportion of its finder patterns
 *   cv-motion        frame differencing: noise, thresholds, block averages and a light change
 *   cv-pyramid       a face detector's sliding window over an image pyramid: how many windows
 *   cv-target        pixels per metre at a distance: detect, observe, recognise, identify
 *
 * Chip facts come from the catalogue (kit.esp). The JPEG sizes, the sensor frame rates, the cost of a detector
 * window and the usable memory are teaching figures, and the blurbs say so. The pictures are drawn, not photographs.
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const isNum = v => typeof v === 'number' && Number.isFinite(v);
  const fmt = (v, d) => (isNum(v) ? v.toFixed(d == null ? 1 : d) : '—');
  const commas = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const hex2 = v => (v < 16 ? '0' : '') + v.toString(16).toUpperCase();
  const isNarrow = box => (box && box.stage && box.stage.clientWidth ? box.stage.clientWidth : 760) < 520;
  function wrap(str, n) {
    const words = String(str).split(/\s+/), lines = [];
    let cur = '';
    for (const w of words) { if ((cur + ' ' + w).trim().length > n && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
    if (cur) lines.push(cur);
    return lines;
  }
  /* the frame sizes of the camera driver: [constant, name, width, height] */
  const SIZES = [
    ['FRAMESIZE_96X96', '96 × 96', 96, 96],
    ['FRAMESIZE_QQVGA', 'QQVGA 160 × 120', 160, 120],
    ['FRAMESIZE_QVGA', 'QVGA 320 × 240', 320, 240],
    ['FRAMESIZE_CIF', 'CIF 400 × 296', 400, 296],
    ['FRAMESIZE_VGA', 'VGA 640 × 480', 640, 480],
    ['FRAMESIZE_SVGA', 'SVGA 800 × 600', 800, 600],
    ['FRAMESIZE_XGA', 'XGA 1024 × 768', 1024, 768],
    ['FRAMESIZE_SXGA', 'SXGA 1280 × 1024', 1280, 1024],
    ['FRAMESIZE_UXGA', 'UXGA 1600 × 1200', 1600, 1200],
    ['FRAMESIZE_QXGA', 'QXGA 2048 × 1536', 2048, 1536],
    ['FRAMESIZE_5MP', '5 MP 2592 × 1944', 2592, 1944]
  ];
  const sizeOf = id => SIZES.find(s => s[0] === id) || SIZES[4];
  /* a typical JPEG, in bits per pixel, for the camera's quality number (0 = best, 63 = smallest): a teaching curve
     that gives about 0.65 bits at quality 10 */
  const jpegBpp = q => 5.6 * Math.pow(Math.max(0, q) + 2, -0.867);
  const jpegBytes = (w, h, q, k) => w * h * jpegBpp(q) * (k == null ? 1 : k) / 8;
  /* the sensor's own frame-rate limit by pixel count: a schematic of the OmniVision parts' published maxima */
  const sensorFps = px => (px <= 500000 ? 30 : px <= 1400000 ? 20 : 15);
  /* a seeded pseudo-random number in [0, 1) for a given integer */
  const hash = n => { let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return (x >>> 0) / 4294967296; };

  /* paint an RGBA buffer (w × h) on the canvas as one block of dw × dh with hard edges between its pixels */
  function makeBlitter() {
    let oc = null, ow = 0, oh = 0;
    return function (ctx, rgba, w, h, x, y, dw, dh) {
      try {
        if (!oc || ow !== w || oh !== h) { oc = document.createElement('canvas'); oc.width = w; oc.height = h; ow = w; oh = h; }
        const o = oc.getContext('2d'), id = o.createImageData(w, h);
        id.data.set(rgba);
        o.putImageData(id, 0, 0);
        ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(oc, x, y, dw, dh); ctx.restore();
      } catch (e) {
        const cw = dw / w, ch = dh / h;
        for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
          const k = (j * w + i) * 4;
          ctx.fillStyle = 'rgb(' + rgba[k] + ',' + rgba[k + 1] + ',' + rgba[k + 2] + ')';
          ctx.fillRect(x + i * cw, y + j * ch, cw + 0.5, ch + 0.5);
        }
      }
    };
  }

  /* ================================================================ cv-dvp-signals */
  const TW = 4, TH = 3;                                   // the toy picture
  const TOY = Array.from({ length: TW * TH }, (_, i) => {
    const h = (i * 31) % 360, s = 0.75, v = 0.55 + 0.35 * ((i * 7) % 5) / 4;
    const f = n => { const k = (n + h / 60) % 6; return Math.round(255 * (v - v * s * Math.max(0, Math.min(k, 4 - k, 1)))); };
    return [f(5), f(3), f(1)];
  });
  const JPEG_BYTES = [0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x7A, 0x31, 0xC4, 0x09, 0xFF, 0xD9];
  function toyFrame(fmt) {
    const bytes = [], lines = [], gap = 3;
    let c = 6;
    if (fmt === 'jpeg') {
      for (let l = 0; l < 3; l++) {
        const c0 = c;
        for (let i = 0; i < 6; i++) bytes.push({ c: c++, v: JPEG_BYTES[l * 6 + i], px: -1, n: l * 6 + i });
        lines.push([c0, c]); c += gap;
      }
    } else {
      const bpp = fmt === 'rgb' ? 2 : 1;
      for (let row = 0; row < TH; row++) {
        const c0 = c;
        for (let col = 0; col < TW; col++) {
          const px = row * TW + col, [r, g, b] = TOY[px];
          const word = ((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3);
          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          for (let k = 0; k < bpp; k++) bytes.push({ c: c++, v: fmt === 'rgb' ? (k === 0 ? word >> 8 : word & 255) : gray, px, k });
        }
        lines.push([c0, c]); c += gap;
      }
    }
    return { bytes, lines, total: c + 2 };
  }
  Hyper.sim('cv-dvp-signals', {
    title: 'The wires of a DVP camera',
    blurb: `The coloured squares are a toy picture of 4 × 3 pixels; the traces under them are what the camera sends to show it. The **pixel clock** (PCLK) times everything, **HREF** is high while a line is on the data lines, **VSYNC** pulses once per frame, and the eight data lines carry one byte per clock pulse. The cursor runs through the frame and the boxes show the byte on D7 to D0 at that moment. The numbers beside it are for a *real* frame size and use the pixel clock you set.

**Try this**
- Switch between **RGB565**, **grayscale** and **JPEG**: a pixel takes two bytes, one byte, or no fixed number (JPEG sends a file that starts with FF D8 and ends with FF D9).
- Raise the **pixel clock** and watch the time on the bus fall; at 10 MHz a raw VGA frame in RGB565 cannot go faster than about 16 frames a second.
- Choose **JPEG**: the bus is nearly idle, so the sensor's own speed is the limit, not the wires.
- Stop the cursor and read a byte against the pixel it belongs to.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, { height: 400, minH: 400, maxH: 400 });
      const REAL = [['FRAMESIZE_QVGA'], ['FRAMESIZE_VGA'], ['FRAMESIZE_SVGA'], ['FRAMESIZE_UXGA']].map(a => { const s = sizeOf(a[0]); return [s[1], s[0]]; });
      const ctl = kit.controls(box.side, [
        { id: 'fmt', type: 'select', label: 'Output format', options: [['RGB565, two bytes a pixel', 'rgb'], ['Grayscale, one byte a pixel', 'gray'], ['JPEG, a compressed file', 'jpeg']], value: ['rgb', 'gray', 'jpeg'].includes(params.format) ? params.format : 'rgb' },
        { id: 'size', type: 'select', label: 'Real frame size (for the numbers)', options: REAL, value: 'FRAMESIZE_VGA' },
        { id: 'pclk', label: 'Pixel clock', min: 5, max: 40, step: 1, value: 10, unit: 'MHz' },
        { id: 'run', type: 'check', label: 'Run the cursor through the frame', value: true }
      ], id => { if (id === 'run' && ctl.values.run) loop.start(); loop.once(); });
      const ro = kit.readout(box.side, [['wires', 'Wires'], ['frame', 'Real frame'], ['bytes', 'Bytes per frame'], ['time', 'Time on the bus'], ['fps', 'Bus limit'], ['cur', 'Under the cursor']]);
      let cursor = 8;
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, fr = toyFrame(v.fmt);
        if (v.run && dt > 0) cursor += dt * fr.total / 9;
        if (cursor >= fr.total) cursor -= fr.total;
        const period = 1 / (Math.max(1, v.pclk) * 1e6), T = k => k * period;
        const cur = fr.bytes.find(b => cursor >= b.c && cursor < b.c + 1) || null;
        // the toy picture
        const cell = narrow ? 20 : 24, px0 = 10, py0 = 30;
        kit.label(c, 'Toy picture: 4 × 3 pixels', px0, 14, { size: 11, color: C.muted });
        for (let j = 0; j < TH; j++) for (let i = 0; i < TW; i++) {
          const p = j * TW + i, [r, g, b] = TOY[p], gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          c.fillStyle = v.fmt === 'jpeg' ? (C.dark ? '#3a4060' : '#cfd4e6') : v.fmt === 'gray' ? 'rgb(' + gray + ',' + gray + ',' + gray + ')' : 'rgb(' + r + ',' + g + ',' + b + ')';
          c.fillRect(px0 + i * cell, py0 + j * cell, cell - 2, cell - 2);
          if (cur && cur.px === p) { c.strokeStyle = C.warn; c.lineWidth = 2.5; c.strokeRect(px0 + i * cell - 1, py0 + j * cell - 1, cell, cell); }
          if (v.fmt === 'jpeg') kit.label(c, '?', px0 + i * cell + cell / 2 - 1, py0 + j * cell + cell / 2, { size: 11, color: C.muted, align: 'center' });
        }
        // the byte on the data lines
        const bx = px0 + TW * cell + (narrow ? 14 : 30), cw = narrow ? 17 : 21;
        kit.label(c, cur ? 'Data lines D7 … D0 now' : 'Data lines: nothing valid (HREF low)', bx, 14, { size: 11, color: cur ? C.text2 : C.muted });
        S.bits(c, bx, py0 + 4, cur ? cur.v : 0, { n: 8, cell: cw, labels: ['D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1', 'D0'], color: cur ? C.accent : C.faint });
        if (cur) kit.label(c, '0x' + hex2(cur.v), bx, py0 + cw + 28, { size: 12.5, color: C.text, weight: 650 });
        // the traces
        const total = fr.total;
        const href = [[0, 0]]; for (const [a, b] of fr.lines) href.push([T(a), 1], [T(b), 0]);
        const vsync = [[0, 0], [T(0.5), 1], [T(2.5), 0], [T(total - 2.5), 1], [T(total - 0.5), 0]];
        const pclk = []; for (let k = 0; k < total; k++) pclk.push([T(k), 1], [T(k + 0.5), 0]);
        const lx = 8, ly = 118, lw = st.W - 16, lh = 168;
        const lg = S.logic(c, lx, ly, lw, lh, [
          { label: 'VSYNC', edges: vsync, color: kit.hue(30) },
          { label: 'HREF', edges: href, color: kit.hue(150) },
          { label: 'PCLK', edges: pclk, color: kit.hue(215) }
        ], { t0: 0, t1: T(total), cursor: T(cursor), labelW: 50 });
        // the data bus drawn as boxes under them
        const sy = lg.plot.y + lg.plot.h + 6, sh = 26;
        S.text(c, 'D7–D0', lx + 44, sy + sh / 2, { align: 'right', size: 11, color: C.text2, weight: 600 });
        for (const b of fr.bytes) {
          const xa = lg.X(T(b.c)), xb = lg.X(T(b.c + 1));
          c.fillStyle = cur === b ? (C.dark ? 'rgba(224,160,48,.45)' : 'rgba(224,160,48,.35)') : (C.dark ? 'rgba(123,140,255,.22)' : 'rgba(60,90,220,.13)');
          c.fillRect(xa + 0.5, sy, Math.max(1, xb - xa - 1), sh);
          if (xb - xa > 15) S.text(c, hex2(b.v), (xa + xb) / 2, sy + sh / 2, { size: Math.min(11, (xb - xa) / 1.8), mono: true, color: C.text });
        }
        // a caption for the moment
        const say = !cur ? 'HREF is low: the gap between lines. Nothing on the data lines is valid.'
          : v.fmt === 'rgb' ? 'Pixel ' + (cur.px + 1) + ', ' + (cur.k === 0 ? 'high' : 'low') + ' byte of its RGB565 colour: two clock pulses a pixel.'
            : v.fmt === 'gray' ? 'Pixel ' + (cur.px + 1) + ': its brightness, one byte, one clock pulse.'
              : 'Byte ' + (cur.n + 1) + ' of the JPEG file' + (cur.n < 2 ? ' (FF D8 starts every JPEG file).' : cur.n > 15 ? ' (FF D9 ends it).' : '.');
        wrap(say, narrow ? 46 : 96).slice(0, 2).forEach((ln, i) => kit.label(c, ln, 10, sy + sh + 18 + i * 15, { size: 11.5, color: C.text2 }));
        kit.label(c, 'schematic: a real line has hundreds of pixels', 10, st.H - 10, { size: 10, color: C.faint });
        // the numbers for a real frame
        const real = sizeOf(v.size), px = real[2] * real[3];
        const bytes = v.fmt === 'rgb' ? px * 2 : v.fmt === 'gray' ? px : jpegBytes(real[2], real[3], 12);
        const sec = bytes * period;
        ro.set('wires', '14: 8 data, PCLK, VSYNC, HREF, XCLK, 2 control');
        ro.set('frame', real[2] + ' × ' + real[3] + ' = ' + commas(px) + ' pixels');
        ro.set('bytes', commas(bytes) + (v.fmt === 'jpeg' ? ' (typical)' : ''));
        ro.set('time', fmt(sec * 1000, sec < 0.01 ? 2 : 1) + ' ms');
        ro.set('fps', fmt(1 / sec, 1) + ' a second' + (v.fmt === 'jpeg' ? ' (the sensor limits first)' : ''));
        ro.set('cur', cur ? '0x' + hex2(cur.v) : 'HREF low');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
      loop.once();
    }
  });

  /* ================================================================ cv-resolution */
  const SENSORS = { ov2640: ['OV2640', 'FRAMESIZE_UXGA'], ov3660: ['OV3660', 'FRAMESIZE_QXGA'], ov5640: ['OV5640', 'FRAMESIZE_5MP'] };
  const BOARDS = {
    cam: { name: 'ESP32-CAM, no PSRAM used', chip: 'esp32', psramKB: 0 },
    aithinker: { name: 'AI-Thinker ESP32-CAM, 4 MB PSRAM', chip: 'esp32', psramKB: 4096 },
    s3: { name: 'ESP32-S3 camera board, 8 MB PSRAM', chip: 'esp32-s3', psramKB: 8192 }
  };
  Hyper.sim('cv-resolution', {
    title: 'Frame size, memory and frame rate',
    blurb: `Pick what you would put in the camera configuration and see what the chip can do with it. The rectangles show the frame sizes **to scale**; the bars show the three limits on the frame rate and the memory the buffers need. The JPEG sizes and the sensor rates are typical figures (a real JPEG depends on the scene); usable internal memory is taken as 40 % of the chip's SRAM after the system and Wi-Fi, which is an assumption.

**Try this**
- Choose **RGB565** at **VGA**, the board without PSRAM and the buffers in internal memory: the buffer is bigger than all of it.
- Move the **JPEG quality** number up: frames shrink and the Wi-Fi limit rises. Remember that a higher number means *more* compression.
- With a slow **Wi-Fi link**, see how the link, not the sensor, sets the frame rate at large sizes.
- Pick **UXGA** with an OV2640 and then with an OV3660: the sensor limits what you can ask for.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { height: 520, minH: 520, maxH: 520 } : { height: 400, minH: 400, maxH: 400 });
      const ctl = kit.controls(box.side, [
        { id: 'sensor', type: 'select', label: 'Sensor', options: Object.keys(SENSORS).map(k => [SENSORS[k][0], k]), value: 'ov2640' },
        { id: 'board', type: 'select', label: 'Board', options: Object.keys(BOARDS).map(k => [BOARDS[k].name, k]), value: 'aithinker' },
        { id: 'size', type: 'select', label: 'Frame size', options: SIZES.map(s => [s[1], s[0]]), value: 'FRAMESIZE_SVGA' },
        { id: 'fmt', type: 'select', label: 'Pixel format', options: [['JPEG', 'jpeg'], ['RGB565', 'rgb'], ['Grayscale', 'gray']], value: 'jpeg' },
        { id: 'q', label: 'JPEG quality number (lower is better)', min: 4, max: 63, step: 1, value: 12 },
        { id: 'n', label: 'Frame buffers (fb_count)', min: 1, max: 3, step: 1, value: 2 },
        { id: 'where', type: 'select', label: 'Buffers live in', options: [['PSRAM', 'psram'], ['Internal memory (DRAM)', 'dram']], value: 'psram' },
        { id: 'wifi', label: 'Wi-Fi link, really delivered', min: 1, max: 30, step: 1, value: 8, unit: 'Mbit/s' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['frame', 'One frame'], ['mem', 'Memory for the buffers'], ['fps', 'Frame rate'], ['by', 'Limited by'], ['say', 'So']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const sz = sizeOf(v.size), w = sz[2], h = sz[3], px = w * h, bd = BOARDS[v.board] || BOARDS.aithinker;
        const chip = E.chip(bd.chip), sram = chip && isNum(chip.sram) ? chip.sram : 520;
        const maxSize = sizeOf(SENSORS[v.sensor][1]), tooBig = px > maxSize[2] * maxSize[3];
        const bytes = v.fmt === 'rgb' ? px * 2 : v.fmt === 'gray' ? px : jpegBytes(w, h, v.q);
        const bufBytes = v.fmt === 'jpeg' ? bytes * 2 : bytes;                  // a JPEG buffer needs headroom: an assumption
        const need = bufBytes * v.n / 1024;                                     // KB
        const dramKB = sram * 0.4, avail = v.where === 'psram' ? bd.psramKB : dramKB;
        const fits = avail > 0 && need <= avail;
        const fSensor = sensorFps(px);
        const fBus = v.fmt === 'jpeg' ? Infinity : 20e6 / (px * (v.fmt === 'rgb' ? 2 : 1));
        const fWifi = v.wifi * 1e6 / (bytes * 8);
        const fps = Math.min(fSensor, fBus, fWifi);
        const by = fps === fSensor ? 'the sensor' : fps === fWifi ? 'the Wi-Fi link' : 'the bus';
        // the sizes to scale, in the top-left (or top) area
        const area = narrow ? { x: 10, y: 10, w: st.W - 20, h: 190 } : { x: 10, y: 10, w: Math.min(300, st.W * 0.42), h: st.H - 20 };
        const big = SIZES[SIZES.length - 1], sc = Math.min((area.w - 4) / big[2], (area.h - 22) / big[3]);
        kit.label(c, 'Frame sizes, to scale', area.x, area.y + 6, { size: 11, color: C.muted });
        SIZES.forEach(s => {
          const sel = s[0] === v.size, over = s[2] * s[3] > maxSize[2] * maxSize[3];
          c.strokeStyle = sel ? C.accent : over ? C.faint : C.muted; c.lineWidth = sel ? 2.4 : 1; c.setLineDash(over ? [3, 3] : []);
          c.strokeRect(area.x + 2, area.y + 18, s[2] * sc, s[3] * sc);
          c.setLineDash([]);
          if (sel) { c.fillStyle = C.dark ? 'rgba(123,140,255,.20)' : 'rgba(60,90,220,.12)'; c.fillRect(area.x + 2, area.y + 18, s[2] * sc, s[3] * sc); }
        });
        kit.label(c, 'dashed: beyond the ' + SENSORS[v.sensor][0], area.x, area.y + area.h - 2, { size: 10, color: C.faint });
        // the limits as bars
        const bx = narrow ? 14 : area.x + area.w + 24, bw = st.W - bx - 14, y0 = narrow ? 226 : 30;
        const bar = (y, label, val, color, note) => {
          kit.label(c, label, bx, y, { size: 11.5, color: C.text2, weight: 600 });
          const full = bw - 90, f = isNum(val) ? clamp(val / 60, 0, 1) : 1;
          c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(bx, y + 9, full, 12);
          c.fillStyle = color; c.fillRect(bx, y + 9, full * f, 12);
          kit.label(c, note, bx + full + 6, y + 15, { size: 11, color: C.text2 });
        };
        const pick = n => (by === n ? C.warn : C.accent);
        bar(y0, 'Sensor limit', fSensor, pick('the sensor'), fmt(fSensor, 0) + ' /s');
        bar(y0 + 40, 'Bus limit (20 MHz)', fBus, pick('the bus'), isNum(fBus) && fBus < 1000 ? fmt(fBus, fBus < 10 ? 1 : 0) + ' /s' : 'no limit');
        bar(y0 + 80, 'Wi-Fi limit', fWifi, pick('the Wi-Fi link'), fmt(fWifi, fWifi < 10 ? 1 : 0) + ' /s');
        // memory
        const my = y0 + 130;
        kit.label(c, 'Buffers: ' + commas(need) + ' KB needed in ' + (v.where === 'psram' ? 'PSRAM' : 'internal memory'), bx, my, { size: 11.5, color: C.text2, weight: 600 });
        const full = bw - 90, f = avail > 0 ? clamp(need / avail, 0, 1.15) : 1.15;
        c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(bx, my + 9, full, 12);
        c.fillStyle = fits ? C.ok : C.bad; c.fillRect(bx, my + 9, Math.min(full, full * f), 12);
        kit.label(c, avail > 0 ? commas(avail) + ' KB' : 'no PSRAM', bx + full + 6, my + 15, { size: 11, color: C.text2 });
        const verdict = tooBig ? 'the ' + SENSORS[v.sensor][0] + ' cannot make this size' : !fits ? (avail > 0 ? 'the buffers do not fit' : 'this board has no PSRAM') : fps < 5 ? 'it works, but slowly' : 'it fits';
        S.box(c, bx, my + 36, bw, 30, { label: verdict, color: tooBig || !fits ? C.bad : fps < 5 ? C.warn : C.ok, active: true, size: 12.5 });
        ro.set('frame', w + ' × ' + h + ', ' + commas(bytes) + ' bytes' + (v.fmt === 'jpeg' ? ' (typical)' : ''));
        ro.set('mem', commas(need) + ' KB of ' + (avail > 0 ? commas(avail) + ' KB' : 'none'));
        ro.set('fps', fmt(fps, fps < 10 ? 1 : 0) + ' a second');
        ro.set('by', by);
        ro.set('say', verdict);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cv-sampling */
  /* the scenes: functions of (u, v) on a picture 4/3 wide and 1 high (v runs downwards) -> [r, g, b] */
  const SCENES = {
    street(u, v) {
      let r, g, b;
      if (v < 0.62) { const t = v / 0.62; r = 120 + 110 * t; g = 180 + 55 * t; b = 240 + 8 * t; }
      else { r = g = b = 88 + 18 * (v - 0.62); if (Math.abs(v - 0.82) < 0.012 && (u * 7) % 1 < 0.55) r = g = b = 235; }
      if ((u - 1.12) * (u - 1.12) + (v - 0.16) * (v - 0.16) < 0.0049) { r = 255; g = 226; b = 90; }
      if (u > 0.06 && u < 0.52 && v > 0.2 && v < 0.62) {
        r = 160; g = 74; b = 62;
        const cu = (u - 0.1) / 0.1, cv = (v - 0.26) / 0.11;
        if (cu >= 0 && cu < 4 && cv >= 0 && cv < 3) { const fu = cu % 1, fv = cv % 1; if (fu > 0.2 && fu < 0.8 && fv > 0.25 && fv < 0.8) { r = 240; g = 222; b = 150; } }
      }
      const pu = 0.88;
      if ((u - pu) * (u - pu) + (v - 0.4) * (v - 0.4) < 0.0016) { r = 226; g = 178; b = 140; }
      else if (Math.abs(u - pu) < 0.045 && v > 0.45 && v < 0.62) { r = 40; g = 80; b = 190; }
      else if (v >= 0.62 && v < 0.74 && (Math.abs(u - (pu - 0.02)) < 0.014 || Math.abs(u - (pu + 0.02)) < 0.014)) { r = 30; g = 30; b = 60; }
      return [r, g, b];
    },
    face(u, v) {
      const bg = 60 + 60 * v;
      let r = bg, g = bg + 10, b = bg + 30;
      const x = (u - 0.667) / 0.27, y = (v - 0.5) / 0.38;
      if (x * x + y * y < 1) {
        r = 232; g = 190; b = 160;
        for (const ex of [-0.38, 0.38]) {
          const a = (x - ex) / 0.17, d = (y + 0.18) / 0.09;
          if (a * a + d * d < 1) { r = g = b = 245; if ((a * a + d * d) * 2.5 < 1) { r = 40; g = 30; b = 30; } }
          if (Math.abs(x - ex) < 0.22 && Math.abs(y + 0.45 - 0.05 * (x - ex)) < 0.04) { r = 90; g = 60; b = 40; }
        }
        if (Math.abs(x) < 0.05 && y > -0.1 && y < 0.2) { r = 205; g = 160; b = 130; }
        if ((x / 0.3) * (x / 0.3) + ((y - 0.52) / 0.07) * ((y - 0.52) / 0.07) < 1) { r = 160; g = 50; b = 60; }
      }
      return [r, g, b];
    },
    text(u, v) {
      let k = 235;
      if (v > 0.1 && v < 0.62) {
        const line = Math.floor((v - 0.1) / 0.065), inLine = ((v - 0.1) / 0.065) % 1;
        if (inLine > 0.2 && inLine < 0.8 && u > 0.12 && u < 1.2 - 0.12 * hash(line * 7) && hash(Math.floor(u * 55) * 13 + line * 101) > 0.38) k = 30;
      }
      if (v > 0.7 && v < 0.9 && u > 0.35 && u < 0.98 && hash(Math.floor((u - 0.35) * 110) * 17 + 5) > 0.5) k = 20;
      return [k, k, k < 8 ? 0 : k - 8];
    }
  };
  /* the average colour of a rectangle of real pixels (x0, y0, wr, hr) of a W × H frame */
  function areaAvg(scene, W, H, x0, y0, wr, hr) {
    const visW = Math.min(4 / 3, W / H), u0 = (4 / 3 - visW) / 2;
    let r = 0, g = 0, b = 0;
    for (let sy = 0; sy < 2; sy++) for (let sx = 0; sx < 2; sx++) {
      const c = scene(u0 + (x0 + wr * (0.25 + 0.5 * sx)) / W * visW, (y0 + hr * (0.25 + 0.5 * sy)) / H);
      r += c[0]; g += c[1]; b += c[2];
    }
    return [r / 4, g / 4, b / 4];
  }
  const luma = c => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
  /* the JPEG transform on 8 × 8 blocks, the standard quantisation tables scaled by the quality number */
  const COSM = Array.from({ length: 8 }, (_, u) => Array.from({ length: 8 }, (_, x) => (u === 0 ? Math.SQRT1_2 : 1) * 0.5 * Math.cos((2 * x + 1) * u * Math.PI / 16)));
  const QL = [16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62,
    18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99];
  const QC = [17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99].concat(new Array(32).fill(99));
  function dct2(x, inverse) {
    const t = new Float64Array(64), o = new Float64Array(64);
    if (!inverse) {
      for (let y = 0; y < 8; y++) for (let u = 0; u < 8; u++) { let s = 0; for (let k = 0; k < 8; k++) s += x[y * 8 + k] * COSM[u][k]; t[y * 8 + u] = s; }
      for (let v = 0; v < 8; v++) for (let u = 0; u < 8; u++) { let s = 0; for (let y = 0; y < 8; y++) s += t[y * 8 + u] * COSM[v][y]; o[v * 8 + u] = s; }
    } else {
      for (let y = 0; y < 8; y++) for (let u = 0; u < 8; u++) { let s = 0; for (let v = 0; v < 8; v++) s += x[v * 8 + u] * COSM[v][y]; t[y * 8 + u] = s; }
      for (let y = 0; y < 8; y++) for (let k = 0; k < 8; k++) { let s = 0; for (let u = 0; u < 8; u++) s += t[y * 8 + u] * COSM[u][k]; o[y * 8 + k] = s; }
    }
    return o;
  }
  function codeChannel(ch, w, h, Q, scale) {
    const out = new Float64Array(w * h), blk = new Float64Array(64);
    for (let by = 0; by + 8 <= h; by += 8) for (let bx = 0; bx + 8 <= w; bx += 8) {
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) blk[y * 8 + x] = ch[(by + y) * w + bx + x] - 128;
      const F = dct2(blk, false);
      for (let i = 0; i < 64; i++) { const q = Math.max(1, Math.round(Q[i] * scale)); F[i] = Math.round(F[i] / q) * q; }
      const X = dct2(F, true);
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) out[(by + y) * w + bx + x] = X[y * 8 + x] + 128;
    }
    return out;
  }
  /* rgb: array of [r, g, b] for a w × h patch (both multiples of 16) -> the same patch after JPEG coding */
  function jpegPatch(rgb, w, h, q, gray) {
    const scale = Math.max(0.1, q / 10), n = w * h;
    const Y = new Float64Array(n), cw = w / 2, ch = h / 2, Cb = new Float64Array(cw * ch), Cr = new Float64Array(cw * ch);
    for (let i = 0; i < n; i++) Y[i] = luma(rgb[i]);
    if (!gray) for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
      let b = 0, r = 0;
      for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const p = rgb[(2 * j + dy) * w + 2 * i + dx]; b += -0.168736 * p[0] - 0.331264 * p[1] + 0.5 * p[2] + 128; r += 0.5 * p[0] - 0.418688 * p[1] - 0.081312 * p[2] + 128; }
      Cb[j * cw + i] = b / 4; Cr[j * cw + i] = r / 4;
    }
    const Yq = codeChannel(Y, w, h, QL, scale);
    const Cbq = gray ? Cb : codeChannel(Cb, cw, ch, QC, scale), Crq = gray ? Cr : codeChannel(Cr, cw, ch, QC, scale);
    const out = [];
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const y = Yq[j * w + i];
      if (gray) { const k = clamp(y, 0, 255); out.push([k, k, k]); continue; }
      const cb = Cbq[(j >> 1) * cw + (i >> 1)] - 128, cr = Crq[(j >> 1) * cw + (i >> 1)] - 128;
      out.push([clamp(y + 1.402 * cr, 0, 255), clamp(y - 0.344136 * cb - 0.714136 * cr, 0, 255), clamp(y + 1.772 * cb, 0, 255)]);
    }
    return out;
  }
  const PW = 32, PH = 16;                                // the zoom: 32 × 16 real pixels
  Hyper.sim('cv-sampling', {
    title: 'What a frame size and a JPEG quality do to a picture',
    blurb: `The big picture is a drawn scene as a camera would sample it at the frame size you choose (above 128 pixels across it is shown smaller than real, and says so). The small panel is a **zoom on the real pixels** of the frame under the square: drag the square about the big picture. With the JPEG switch on, the zoom is also put through the same kind of compression a camera does, so you see the blocks it makes. The scene and the byte counts are schematic; the sizes are typical, because a real JPEG depends on what is in the picture.

**Try this**
- Move from **QQVGA** to **UXGA** and watch the squares in the zoom shrink until the window edges are crisp.
- At **96 × 96** you see the centre square of the scene, the input of a small classifier: can you still see the person?
- Raise the **JPEG quality number** to 50: the file shrinks and 8 × 8 blocks appear in the zoom, especially round the text and edges.
- Switch to the **text** scene: fine detail needs far more pixels than a plain wall.
- Tick **grayscale**: the raw frame halves and colour disappears from the blocks too.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { height: 560, minH: 560, maxH: 560 } : { height: 380, minH: 380, maxH: 380 });
      const q0 = params.focus === 'quality' ? 36 : 12;
      const ctl = kit.controls(box.side, [
        { id: 'size', type: 'select', label: 'Frame size', options: SIZES.map(s => [s[1], s[0]]), value: SIZES.some(s => s[0] === params.size) ? params.size : (params.focus === 'quality' ? 'FRAMESIZE_SVGA' : 'FRAMESIZE_QVGA') },
        { id: 'scene', type: 'select', label: 'Scene', options: [['A street with a person', 'street'], ['A face', 'face'], ['Printed text and a barcode', 'text']], value: SCENES[params.scene] ? params.scene : 'street' },
        { id: 'gray', type: 'check', label: 'Grayscale', value: !!params.gray },
        { id: 'jpeg', type: 'check', label: 'Compress the zoom as JPEG', value: true },
        { id: 'q', label: 'JPEG quality number (lower is better)', min: 2, max: 63, step: 1, value: q0 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['frame', 'Frame'], ['raw', 'Raw, RGB565 / gray'], ['jpeg', 'JPEG, typical'], ['zoom', 'The zoom']]);
      const lens = { u: 0.66, v: 0.38 };
      let ovRect = null, cache = { key: '', rgba: null, dw: 0, dh: 0 };
      const blit = makeBlitter();
      const setLens = p => { if (!ovRect) return; lens.u = clamp((p.x - ovRect.x) / ovRect.w, 0, 1); lens.v = clamp((p.y - ovRect.y) / ovRect.h, 0, 1); loop.once(); };
      kit.drag(st, { hit: p => (ovRect && p.x >= ovRect.x && p.x <= ovRect.x + ovRect.w && p.y >= ovRect.y && p.y <= ovRect.y + ovRect.h ? 'lens' : null), start: (t, p) => setLens(p), move: (t, p) => setLens(p), hover: true });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const sz = sizeOf(v.size), W = sz[2], H = sz[3], px = W * H, scene = SCENES[v.scene] || SCENES.street;
        // the overview, rebuilt only when the choice changes
        const dw = Math.min(W, 128), dh = Math.max(1, Math.round(dw * H / W)), key = [v.size, v.scene, v.gray].join('|');
        if (cache.key !== key) {
          const out = new Uint8ClampedArray(dw * dh * 4);
          for (let j = 0; j < dh; j++) for (let i = 0; i < dw; i++) {
            const col = areaAvg(scene, W, H, i * W / dw, j * H / dh, W / dw, H / dh), k = (j * dw + i) * 4;
            const g = v.gray ? luma(col) : null;
            out[k] = g == null ? col[0] : g; out[k + 1] = g == null ? col[1] : g; out[k + 2] = g == null ? col[2] : g; out[k + 3] = 255;
          }
          cache = { key, rgba: out, dw, dh };
        }
        const area = narrow ? { x: 10, y: 22, w: st.W - 20, h: 250 } : { x: 10, y: 22, w: Math.floor(st.W * 0.5), h: st.H - 60 };
        const scale = Math.min(area.w / dw, area.h / dh), ow = dw * scale, oh = dh * scale;
        ovRect = { x: area.x, y: area.y, w: ow, h: oh };
        kit.label(c, 'The frame, ' + W + ' × ' + H + (W > 128 ? ' (shown at ' + dw + ' across)' : ''), area.x, 10, { size: 11, color: C.muted });
        blit(c, cache.rgba, dw, dh, ovRect.x, ovRect.y, ow, oh);
        c.strokeStyle = C.border2 || C.muted; c.lineWidth = 1; c.strokeRect(ovRect.x - 0.5, ovRect.y - 0.5, ow + 1, oh + 1);
        // the lens: which real pixels are zoomed (snapped to the 8-pixel grid of JPEG)
        const px0 = clamp(Math.round((lens.u * W - PW / 2) / 8) * 8, 0, Math.max(0, W - PW)), py0 = clamp(Math.round((lens.v * H - PH / 2) / 8) * 8, 0, Math.max(0, H - PH));
        const lw = Math.max(8, PW / W * ow), lh = Math.max(5, PH / H * oh), lx = ovRect.x + px0 / W * ow + (PW / W * ow - lw) / 2, ly = ovRect.y + py0 / H * oh + (PH / H * oh - lh) / 2;
        c.strokeStyle = C.warn; c.lineWidth = 2; c.strokeRect(lx, ly, lw, lh);
        // the zoom on the real pixels
        const zone = narrow ? { x: 10, y: ovRect.y + oh + 36, w: st.W - 20, h: st.H - (ovRect.y + oh + 36) - 14 } : { x: area.x + area.w + 24, y: 22, w: st.W - area.x - area.w - 34, h: 170 };
        const zc = Math.max(2, Math.floor(Math.min(zone.w / PW, zone.h / PH)));
        const pix = [];
        for (let j = 0; j < PH; j++) for (let i = 0; i < PW; i++) {
          const col = areaAvg(scene, W, H, Math.min(W - 1, px0 + i), Math.min(H - 1, py0 + j), 1, 1);
          pix.push(v.gray ? [luma(col), luma(col), luma(col)] : col);
        }
        const shown = v.jpeg ? jpegPatch(pix, PW, PH, v.q, v.gray) : pix;
        kit.label(c, 'Zoom: ' + PW + ' × ' + PH + ' real pixels' + (v.jpeg ? ', JPEG quality ' + v.q : ''), zone.x, zone.y - 12, { size: 11, color: C.muted });
        for (let j = 0; j < PH; j++) for (let i = 0; i < PW; i++) {
          const k = shown[j * PW + i];
          c.fillStyle = 'rgb(' + Math.round(k[0]) + ',' + Math.round(k[1]) + ',' + Math.round(k[2]) + ')';
          c.fillRect(zone.x + i * zc, zone.y + j * zc, zc, zc);
        }
        if (v.jpeg) {                                   // the 8 × 8 blocks the compressor works in
          c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 1; c.setLineDash([2, 3]);
          for (let i = 8; i < PW; i += 8) { c.beginPath(); c.moveTo(zone.x + i * zc + 0.5, zone.y); c.lineTo(zone.x + i * zc + 0.5, zone.y + PH * zc); c.stroke(); }
          for (let j = 8; j < PH; j += 8) { c.beginPath(); c.moveTo(zone.x, zone.y + j * zc + 0.5); c.lineTo(zone.x + PW * zc, zone.y + j * zc + 0.5); c.stroke(); }
          c.setLineDash([]);
        }
        c.strokeStyle = C.warn; c.lineWidth = 2; c.strokeRect(zone.x - 1, zone.y - 1, PW * zc + 2, PH * zc + 2);
        kit.label(c, 'each square is one pixel of the frame', zone.x, zone.y + PH * zc + 14, { size: 10.5, color: C.faint });
        kit.label(c, 'drag the square on the picture', area.x, area.y + oh + 14, { size: 10.5, color: C.faint });
        const k = v.scene === 'text' ? 1.4 : v.scene === 'face' ? 0.8 : 1;
        const jb = jpegBytes(W, H, v.q, k * (v.gray ? 0.75 : 1));
        ro.set('frame', W + ' × ' + H + ' = ' + commas(px) + ' pixels (' + fmt(px / 1e6, 2) + ' MP)');
        ro.set('raw', commas(v.gray ? px : px * 2) + ' bytes');
        ro.set('jpeg', commas(jb) + ' bytes at quality ' + v.q);
        ro.set('zoom', 'real pixels ' + px0 + '–' + (px0 + PW) + ' across, ' + py0 + '–' + (py0 + PH) + ' down');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cv-mjpeg */
  Hyper.sim('cv-mjpeg', {
    title: 'An MJPEG stream on the wire',
    blurb: `Three lanes show the last second and a half. The **camera** makes a new frame at the sensor's rate; the **Wi-Fi link** carries one part per frame to each viewer, for as long as that takes; the **browser** swaps its picture when a part has arrived. Under them is the text the program sends. When the link is the slower one, frames are dropped (hollow ticks) and the rate falls to what the link can carry. The JPEG sizes and the sensor rates are typical figures, not measurements.

**Try this**
- Lower the **Wi-Fi link** until the link lane is full: the camera ticks go hollow and the frame rate drops.
- Raise the **JPEG quality number** (more compression): parts shrink and the rate recovers.
- Add **viewers**: each gets its own copy of every frame, so the rate for each falls.
- Choose **SVGA** and a fast link: now the *sensor* is the limit, and the link is idle between parts.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { height: 470, minH: 470, maxH: 470 } : { height: 410, minH: 410, maxH: 410 });
      const ctl = kit.controls(box.side, [
        { id: 'size', type: 'select', label: 'Frame size', options: SIZES.slice(1, 9).map(s => [s[1], s[0]]), value: 'FRAMESIZE_VGA' },
        { id: 'q', label: 'JPEG quality number (lower is better)', min: 4, max: 63, step: 1, value: 12 },
        { id: 'wifi', label: 'Wi-Fi link, really delivered', min: 0.5, max: 20, step: 0.5, value: 6, unit: 'Mbit/s' },
        { id: 'viewers', label: 'Viewers', min: 1, max: 4, step: 1, value: 1 }
      ], () => {});
      const ro = kit.readout(box.side, [['bytes', 'Bytes in one part'], ['tx', 'Time on the air per part'], ['fps', 'Frames a second, each viewer'], ['rate', 'Bitrate, all viewers'], ['by', 'Limited by']]);
      const SPAN = 1.5;
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const sz = sizeOf(v.size), bytes = jpegBytes(sz[2], sz[3], v.q) + 110;     // 110: the part's header lines
        const n = Math.round(v.viewers), tx = bytes * 8 / (v.wifi * 1e6), fs = sensorFps(sz[2] * sz[3]), Ts = 1 / fs;
        const Tc = Math.max(Ts, n * tx), fps = 1 / Tc, linkBound = n * tx > Ts + 1e-9;
        const t1 = t, t0 = t - SPAN, x0 = 74, w = st.W - x0 - 14, X = tt => x0 + clamp((tt - t0) / SPAN, 0, 1) * w;
        const laneH = 30, y0 = 30, gap = 14;
        const lanes = [['Camera', y0], ['Wi-Fi link', y0 + laneH + gap], ['Browser', y0 + 2 * (laneH + gap)]];
        lanes.forEach(([name, y]) => {
          c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(x0, y, w, laneH);
          kit.label(c, name, x0 - 8, y + laneH / 2, { size: 11.5, color: C.text2, weight: 600, align: 'right' });
        });
        // the camera's frames: filled when the server takes them, hollow when it is still busy
        const used = new Set();
        for (let k = Math.floor((t0 - 1) / Tc); k * Tc < t1 + Tc; k++) used.add(Math.floor(k * Tc / Ts + 1e-9));
        for (let j = Math.floor(t0 / Ts); j * Ts <= t1; j++) {
          const x = X(j * Ts);
          if (x < x0) continue;
          if (used.has(j)) { c.fillStyle = C.accent; c.fillRect(x - 1.5, lanes[0][1] + 4, 3, laneH - 8); }
          else { c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x - 1.5, lanes[0][1] + 4, 3, laneH - 8); }
        }
        // the parts on the link, one per viewer, and the browser's picture changes (viewer 1)
        for (let k = Math.floor((t0 - 1) / Tc); k * Tc < t1; k++) {
          for (let i = 0; i < n; i++) {
            const a = k * Tc + i * tx, b = a + tx;
            if (b < t0 || a > t1) continue;
            const xa = clamp(X(a), x0, x0 + w), xb = clamp(X(b), x0, x0 + w);
            c.fillStyle = kit.hue(i * 70 + 200, 0.85); c.fillRect(xa, lanes[1][1] + 3, Math.max(1, xb - xa), laneH - 6);
            if (i === 0 && b <= t1 && b >= t0) { c.fillStyle = C.ok; c.fillRect(X(b) - 2, lanes[2][1] + 4, 4, laneH - 8); }
          }
        }
        kit.label(c, 'frames a second, each viewer: ' + fmt(fps, fps < 10 ? 1 : 0) + (linkBound ? '   (the link is full: frames are dropped)' : '   (the sensor sets the pace)'), x0, y0 + 3 * (laneH + gap) - 4, { size: 11, color: linkBound ? C.warn : C.text2 });
        kit.label(c, '1.5 s ago', x0, 16, { size: 10, color: C.faint });
        kit.label(c, 'now', x0 + w, 16, { size: 10, color: C.faint, align: 'right' });
        // the text on the wire
        const ty = y0 + 3 * (laneH + gap) + 22;
        const lines = ['HTTP/1.1 200 OK', 'Content-Type: multipart/x-mixed-replace; boundary=frame', '', '--frame', 'Content-Type: image/jpeg', 'Content-Length: ' + Math.round(bytes - 110), '', '<' + commas(bytes - 110) + ' bytes of JPEG>', '--frame      the next part replaces the picture'];
        c.fillStyle = C.dark ? 'rgba(0,0,0,.28)' : 'rgba(0,0,0,.04)'; c.fillRect(10, ty - 12, st.W - 20, lines.length * 15 + 12);
        lines.forEach((ln, i) => kit.label(c, ln, 18, ty + 2 + i * 15, { size: 11, color: i === 7 ? C.accent : C.text2, font: 'Consolas, "Cascadia Code", monospace' }));
        ro.set('bytes', commas(bytes) + ' (a JPEG of about ' + commas(bytes - 110) + ')');
        ro.set('tx', fmt(tx * 1000, tx < 0.01 ? 1 : 0) + ' ms');
        ro.set('fps', fmt(fps, fps < 10 ? 1 : 0));
        ro.set('rate', fmt(bytes * 8 * fps * n / 1e6, 2) + ' Mbit/s of ' + fmt(v.wifi, 1));
        ro.set('by', linkBound ? 'the Wi-Fi link' : 'the sensor');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ cv-qr */
  /* a code-like pattern, 21 × 21 modules (version 1 in size): three real finder patterns, timing lines, and
     pseudo-random data. It is NOT a decodable code. 1 = dark. */
  const QR_N = 21;
  const QR = (() => {
    const M = Array.from({ length: QR_N }, () => new Array(QR_N).fill(0)), reserved = (x, y) => (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
    for (let y = 0; y < QR_N; y++) for (let x = 0; x < QR_N; x++) if (!reserved(x, y)) M[y][x] = hash(x * 31 + y * 97 + 11) > 0.5 ? 1 : 0;
    for (let i = 8; i <= 12; i++) { M[6][i] = i % 2 === 0 ? 1 : 0; M[i][6] = i % 2 === 0 ? 1 : 0; }
    for (const [ox, oy] of [[0, 0], [14, 0], [0, 14]]) for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      const ring = Math.max(Math.abs(x - 3), Math.abs(y - 3));
      M[oy + y][ox + x] = ring === 3 || ring <= 1 ? 1 : 0;
    }
    return M;
  })();
  function isFinderRatio(r) {
    const total = r[0] + r[1] + r[2] + r[3] + r[4];
    if (total < 7) return false;
    const m = total / 7, slack = m / 2;
    return Math.abs(r[0] - m) < slack && Math.abs(r[1] - m) < slack && Math.abs(r[2] - 3 * m) < 3 * slack && Math.abs(r[3] - m) < slack && Math.abs(r[4] - m) < slack;
  }
  /* the runs of a row of grey values (dark below the threshold) and the places where five of them fit 1:1:3:1:1 */
  function scanRow(row, thr) {
    const runs = [];
    for (let x = 0; x < row.length; x++) {
      const dark = row[x] < thr;
      if (runs.length && runs[runs.length - 1].dark === dark) runs[runs.length - 1].len++; else runs.push({ dark, start: x, len: 1 });
    }
    const hits = [];
    for (let i = 0; i + 4 < runs.length; i++) {
      if (!runs[i].dark) continue;
      const r = [0, 1, 2, 3, 4].map(k => runs[i + k].len);
      if (isFinderRatio(r)) hits.push({ x0: runs[i].start, x1: runs[i + 4].start + runs[i + 4].len, cx: runs[i + 2].start + runs[i + 2].len / 2, c0: runs[i + 2].start, c1: runs[i + 2].start + runs[i + 2].len, runs: r });
    }
    return { runs, hits };
  }
  /* a hit is confirmed when the column through its centre shows the same proportion with its middle run on that row */
  function crossOK(g, N, h, j) {
    const x = clamp(Math.floor(h.cx), 0, N - 1);
    return scanRow(Array.from({ length: N }, (_, y) => g[y * N + x]), 128).hits.some(q => j >= q.c0 && j < q.c1);
  }
  Hyper.sim('cv-qr', {
    title: 'Finding a QR code by its finder patterns',
    blurb: `The picture is a code-like pattern (three real finder patterns, timing lines and random data; it cannot be decoded) as a camera would see it, in grey. The strip under it is **one row of pixels**, cut into runs of dark and light. A finder pattern is any five runs, dark-light-dark-light-dark, in the proportion 1 : 1 : 3 : 1 : 1; where they fit, the strip is marked green. Green dots on the picture are every such place found by scanning all the rows. Random data sometimes fits the proportion by chance, so a real reader also **cross-checks** each hit down its column; switch that off to see the false hits.

**Try this**
- Drag over the picture (or move **Scan line**): through the middle of a corner square the five runs fit; elsewhere they do not.
- Switch the **cross-check** off and on: the stray dots in the data area disappear, leaving the three corners.
- Reduce **pixels per module** towards 1: the runs become too short to measure and the finder patterns stop being found.
- Add **blur** (a share of a module): neighbouring modules merge and the ratio breaks, as when a lens is out of focus.
- **Rotate** the code: the finder patterns are still found, because the proportion holds along any line through the centre.
- Add **noise** until the runs fragment.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { height: 520, minH: 520, maxH: 520 } : { height: 420, minH: 420, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Pixels per module', min: 1, max: 5, step: 0.5, value: 4 },
        { id: 'blur', label: 'Blur', min: 0, max: 1.5, step: 0.25, value: 0, unit: 'modules' },
        { id: 'noise', label: 'Noise', min: 0, max: 140, step: 10, value: 10 },
        { id: 'rot', label: 'Rotation', min: 0, max: 45, step: 1, value: 0, unit: '°' },
        { id: 'row', label: 'Scan line', min: 0, max: 100, step: 1, value: 26, unit: '%' },
        { id: 'cross', type: 'check', label: 'Cross-check each hit down its column', value: true },
        { id: 'all', type: 'check', label: 'Mark every place found in the picture', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['n', 'Picture'], ['runs', 'Runs on this row'], ['fit', 'On this row'], ['found', 'Whole picture']]);
      const blit = makeBlitter();
      let img = { rect: null, N: 0 };
      const setRow = p => { if (!img.rect) return; ctl.set('row', Math.round(clamp((p.y - img.rect.y) / img.rect.h, 0, 1) * 100), true); };
      kit.drag(st, { hit: p => (img.rect && p.x >= img.rect.x && p.x <= img.rect.x + img.rect.w && p.y >= img.rect.y && p.y <= img.rect.y + img.rect.h ? 'row' : null), start: (t, p) => setRow(p), move: (t, p) => setRow(p), hover: true });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const m = v.m, N = Math.max(16, Math.round((QR_N + 8) * m)), th = v.rot * Math.PI / 180, cs = Math.cos(th), sn = Math.sin(th);
        // render the code
        let g = new Float64Array(N * N);
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
          let s = 0;
          for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) {
            const dx = i + 0.25 + 0.5 * a - N / 2 - 0.37, dy = j + 0.25 + 0.5 * b - N / 2 - 0.21;     // never quite aligned with the pixels
            const mx = (dx * cs + dy * sn) / m + (QR_N + 8) / 2 - 4, my = (-dx * sn + dy * cs) / m + (QR_N + 8) / 2 - 4;
            const ix = Math.floor(mx), iy = Math.floor(my);
            s += ix >= 0 && ix < QR_N && iy >= 0 && iy < QR_N && QR[iy][ix] ? 25 : 235;
          }
          g[j * N + i] = s / 4;
        }
        const R = Math.round(v.blur * m);
        if (R > 0) {
          const t = new Float64Array(N * N);
          for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { let s = 0, k = 0; for (let d = -R; d <= R; d++) { const x = i + d; if (x >= 0 && x < N) { s += g[j * N + x]; k++; } } t[j * N + i] = s / k; }
          for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { let s = 0, k = 0; for (let d = -R; d <= R; d++) { const y = j + d; if (y >= 0 && y < N) { s += t[y * N + i]; k++; } } g[j * N + i] = s / k; }
        }
        for (let k = 0; k < N * N; k++) g[k] = clamp(g[k] + (hash(k * 7919 + 13) - 0.5) * 2 * v.noise, 0, 255);
        const rgba = new Uint8ClampedArray(N * N * 4);
        for (let k = 0; k < N * N; k++) { rgba[k * 4] = rgba[k * 4 + 1] = rgba[k * 4 + 2] = g[k]; rgba[k * 4 + 3] = 255; }
        // place it
        const area = narrow ? { x: 10, y: 22, w: st.W - 20, h: 310 } : { x: 10, y: 22, w: Math.min(st.W * 0.56, 360), h: st.H - 80 };
        const s = Math.min(area.w / N, area.h / N);
        img = { rect: { x: area.x, y: area.y, w: N * s, h: N * s }, N };
        kit.label(c, 'What the camera sees: ' + N + ' × ' + N + ' pixels', area.x, 10, { size: 11, color: C.muted });
        blit(c, rgba, N, N, area.x, area.y, N * s, N * s);
        // scan the chosen row
        const rowI = Math.round(v.row / 100 * (N - 1)), thr = 128;
        const rowVals = Array.from({ length: N }, (_, i) => g[rowI * N + i]);
        const sr = scanRow(rowVals, thr);
        c.strokeStyle = C.warn; c.lineWidth = 1.5; c.strokeRect(area.x - 1, area.y + rowI * s - 0.5, N * s + 2, Math.max(1, s) + 1);
        // every row, two pixels apart: the places where the proportion fits
        const dots = [];
        for (let j = 0; j < N; j += 2) {
          const r = scanRow(Array.from({ length: N }, (_, i) => g[j * N + i]), thr);
          for (const h of r.hits) if (!v.cross || crossOK(g, N, h, j)) dots.push({ x: h.cx, y: j + 0.5 });
        }
        const clusters = [];
        for (const d of dots) {
          const cl = clusters.find(k => Math.abs(k.x - d.x) < 4 * m && Math.abs(k.y - d.y) < 5 * m);
          if (cl) { cl.n++; cl.x = (cl.x * (cl.n - 1) + d.x) / cl.n; cl.y = (cl.y * (cl.n - 1) + d.y) / cl.n; } else clusters.push({ x: d.x, y: d.y, n: 1 });
        }
        if (v.all) for (const d of dots) kit.dot(c, area.x + d.x * s, area.y + d.y * s, Math.max(2, Math.min(4, s * 0.5)), C.ok);
        // the strip: the row, enlarged, with its runs
        const sx = area.x, sw = N * s, sy = area.y + N * s + 22, sh = 20;
        kit.label(c, 'The scan line: one row of pixels', sx, sy - 8, { size: 11, color: C.muted });
        for (let i = 0; i < N; i++) { const q = Math.round(g[rowI * N + i]); c.fillStyle = 'rgb(' + q + ',' + q + ',' + q + ')'; c.fillRect(sx + i * s, sy, s + 0.5, sh); }
        c.strokeStyle = C.border2 || C.muted; c.lineWidth = 1; c.strokeRect(sx - 0.5, sy - 0.5, sw + 1, sh + 1);
        let confirmed = 0;
        for (const h of sr.hits) {
          const ok = !v.cross || crossOK(g, N, h, rowI);
          if (ok) confirmed++;
          c.strokeStyle = ok ? C.ok : C.warn; c.lineWidth = 3; c.strokeRect(sx + h.x0 * s, sy - 3, (h.x1 - h.x0) * s, sh + 6);
          kit.label(c, h.runs.join(' · ') + ' px' + (ok ? '' : ' (fails down the column)'), sx + (h.x0 + h.x1) / 2 * s, sy + sh + 14, { size: 10.5, color: ok ? C.ok : C.warn, align: 'center' });
        }
        // the verdict, to the right (or below on a narrow screen)
        const vx = narrow ? 10 : area.x + area.w + 24, vw = st.W - vx - 12, vy = narrow ? sy + sh + 34 : 40;
        const found = clusters.length, col = found >= 3 ? C.ok : found > 0 ? C.warn : C.bad;
        S.box(c, vx, vy, vw, 44, { label: found >= 3 ? 'A code is here: ' + found + ' finder patterns' : found > 0 ? 'Only ' + found + ' finder pattern' + (found > 1 ? 's' : '') + ' found' : 'No finder pattern found', color: col, active: true, size: 12.5 });
        wrap(m < 3 ? 'Under about three pixels per module the runs are too short to measure well.' : 'Each finder pattern should show the same proportion on every row through its middle.', narrow ? 46 : 34).forEach((ln, i) => kit.label(c, ln, vx, vy + 66 + i * 15, { size: 11, color: C.text2 }));
        ro.set('n', N + ' × ' + N + ' pixels, ' + fmt(m, 1) + ' per module');
        ro.set('runs', sr.runs.length + ' runs, the longest ' + Math.max.apply(null, sr.runs.map(r => r.len)) + ' pixels');
        ro.set('fit', sr.hits.length ? sr.hits.length + ' place' + (sr.hits.length > 1 ? 's' : '') + ' fit 1 : 1 : 3 : 1 : 1' + (v.cross ? ', ' + confirmed + ' confirmed down the column' : '') : 'nothing fits');
        ro.set('found', found + ' cluster' + (found === 1 ? '' : 's') + ' of hits' + (found >= 3 ? ': enough for a code' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cv-motion */
  const MW = 64, MH = 48, MB = 4, MBW = MW / MB, MBH = MH / MB;
  const MBG = (() => {                                    // the empty room: a gradient, a window, a door, a picture
    const a = new Float64Array(MW * MH);
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      let v = 95 + 55 * (y / MH);
      if (x >= 6 && x < 22 && y >= 6 && y < 20) v = 200;
      if (x >= 42 && x < 58 && y >= 14 && y < 47) v = 62;
      if (x >= 28 && x < 38 && y >= 8 && y < 16) v = 140 + 30 * ((x + y) % 2);
      a[y * MW + x] = v;
    }
    return a;
  })();
  const blockAvg = f => { const o = new Float64Array(MBW * MBH); for (let by = 0; by < MBH; by++) for (let bx = 0; bx < MBW; bx++) { let s = 0; for (let y = 0; y < MB; y++) for (let x = 0; x < MB; x++) s += f[(by * MB + y) * MW + bx * MB + x]; o[by * MBW + bx] = s / (MB * MB); } return o; };
  Hyper.sim('cv-motion', {
    title: 'Motion detection by frame difference',
    blurb: `A dark disc crosses a room at ten frames a second. Each new frame is compared with the one before: the middle picture shows what changed by more than the **change that counts**, and the graph is the share of the view that changed. When it passes the **share needed**, the motion LED lights for a moment. With **block averaging** the 4 × 4 pixel blocks are compared; without it, single pixels.

**Try this**
- Turn **noise** up with averaging **off**: the graph is full of false alarms. Switch averaging **on**: the noise falls to a quarter and they vanish.
- Press **a cloud passes** with a **light change** of 30 %: every pixel moves and the detector fires although nothing moved.
- Set the **speed** to 0: the disc is still there but the difference is empty, and the detector goes quiet.
- Tick **mains flicker**: the lamp alternates from frame to frame.
- Raise the **change that counts** until the disc is no longer seen.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { height: 470, minH: 470, maxH: 470 } : { height: 420, minH: 420, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'avg', type: 'check', label: 'Average 4 × 4 blocks before comparing', value: true },
        { id: 'delta', label: 'Change that counts', min: 2, max: 60, step: 1, value: 15, unit: 'levels' },
        { id: 'need', label: 'Share of the view needed', min: 0.5, max: 25, step: 0.5, value: 3, unit: '%' },
        { id: 'noise', label: 'Sensor noise', min: 0, max: 25, step: 1, value: 8, unit: 'levels' },
        { id: 'speed', label: 'Speed of the disc', min: 0, max: 80, step: 2, value: 40, unit: 'px/s' },
        { id: 'light', label: 'Light change when a cloud passes', min: 0, max: 50, step: 5, value: 30, unit: '%' },
        { id: 'flicker', type: 'check', label: 'Mains flicker', value: false },
        { type: 'buttons', items: [{ id: 'cloud', label: 'A cloud passes', primary: true }] }
      ], id => { if (id === 'cloud') cloudT = 0; });
      const ro = kit.readout(box.side, [['changed', 'Changed'], ['noise', 'Noise in what is compared'], ['state', 'Detector']]);
      const blitA = makeBlitter(), blitB = makeBlitter();
      let prev = null, acc = 0, fc = 0, tNow = 0, hold = -1, cloudT = 99, last = { pct: 0, n: 0, total: 1, cur: null, diff: null, trig: false };
      const hist = [];
      function frame(t) {
        const v = ctl.values;
        const ox = ((t * v.speed) % (MW + 30)) - 15, oy = 28 + 5 * Math.sin(t * 1.3);
        const cloud = cloudT < 1.6 ? v.light / 100 * Math.sin(Math.PI * cloudT / 1.6) : 0;
        const gain = (1 - cloud) * (v.flicker ? 1 + 0.06 * ((fc % 2) * 2 - 1) : 1);
        const cur = new Float64Array(MW * MH);
        for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
          const i = y * MW + x;
          let p = MBG[i];
          if ((x - ox) * (x - ox) + (y - oy) * (y - oy) < 64) p = 32;
          const nz = (hash(fc * 4099 + i) + hash(fc * 7919 + i * 3 + 1) + hash(fc * 104729 + i * 5 + 2) - 1.5) * 2 * v.noise;
          cur[i] = clamp(p * gain + nz, 0, 255);
        }
        const a = v.avg ? blockAvg(cur) : cur, b = prev ? (v.avg ? blockAvg(prev) : prev) : null;
        const diff = new Float64Array(a.length);
        let n = 0;
        if (b) for (let i = 0; i < a.length; i++) { diff[i] = Math.abs(a[i] - b[i]); if (diff[i] > v.delta) n++; }
        const total = a.length, pct = n / total * 100;
        const trig = !!b && pct >= v.need && t > hold;
        if (trig) hold = t + 1.5;
        last = { pct, n, total, cur, diff, trig, avg: v.avg };
        hist.push({ pct, trig }); if (hist.length > 100) hist.shift();
        prev = cur; fc++;
      }
      const loop = kit.loop((dt, t) => {
        tNow = t; cloudT += dt;
        acc += dt;
        let guard = 0;
        while (acc >= 0.1 && guard++ < 4) { acc -= 0.1; frame(t); }
        if (!last.cur) frame(t);
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const cols = narrow ? 2 : 3, gap = 10, pw = Math.min(250, (st.W - 20 - gap * (cols - 1)) / cols), ph = pw * MH / MW, py = 26;
        const rgba = new Uint8ClampedArray(MW * MH * 4), rgbb = new Uint8ClampedArray(MW * MH * 4);
        for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
          const i = y * MW + x, k = i * 4, g = last.cur[i];
          rgba[k] = rgba[k + 1] = rgba[k + 2] = g; rgba[k + 3] = 255;
          const d = last.avg ? last.diff[Math.floor(y / MB) * MBW + Math.floor(x / MB)] : last.diff[i];
          const over = d > v.delta;
          rgbb[k] = over ? 255 : Math.min(120, d * 3); rgbb[k + 1] = over ? 150 : Math.min(120, d * 3); rgbb[k + 2] = over ? 20 : Math.min(120, d * 3); rgbb[k + 3] = 255;
        }
        kit.label(c, 'The frame now', 10, 12, { size: 11, color: C.muted });
        blitA(c, rgba, MW, MH, 10, py, pw, ph);
        kit.label(c, last.avg ? 'Changed blocks (orange)' : 'Changed pixels (orange)', 10 + pw + gap, 12, { size: 11, color: C.muted });
        blitB(c, rgbb, MW, MH, 10 + pw + gap, py, pw, ph);
        c.strokeStyle = C.border2 || C.muted; c.lineWidth = 1; c.strokeRect(9.5, py - 0.5, pw + 1, ph + 1); c.strokeRect(9.5 + pw + gap, py - 0.5, pw + 1, ph + 1);
        // the motion LED
        const lit = tNow < hold, lx = narrow ? 10 : 10 + 2 * (pw + gap), ly = narrow ? py + ph + 24 : py;
        if (!narrow) {
          S.box(c, lx, ly, pw, ph, { label: lit ? 'MOTION' : 'quiet', sub: fmt(last.pct, 1) + ' % changed', color: lit ? C.ok : C.faint, active: lit, size: 15 });
        }
        // the graph
        const gy = narrow ? ly + 14 : py + ph + 34, gh = st.H - gy - 22, gx = 10, gw = st.W - 20, top = 30;
        kit.label(c, 'Share of the view that changed, last 10 s' + (narrow ? (lit ? '   MOTION' : '   quiet') : ''), gx, gy - 12, { size: 11, color: lit && narrow ? C.ok : C.muted });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)'; c.fillRect(gx, gy, gw, gh);
        const Y = p => gy + gh - clamp(p / top, 0, 1) * gh;
        c.strokeStyle = C.warn; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(gx, Y(v.need)); c.lineTo(gx + gw, Y(v.need)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'share needed', gx + gw - 4, Y(v.need) - 8, { size: 10, color: C.warn, align: 'right' });
        c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
        hist.forEach((h, i) => { const x = gx + (i / 99) * gw; if (i === 0) c.moveTo(x, Y(h.pct)); else c.lineTo(x, Y(h.pct)); });
        c.stroke();
        hist.forEach((h, i) => { if (h.trig) { const x = gx + (i / 99) * gw; c.fillStyle = C.ok; c.fillRect(x - 1.5, gy, 3, 8); } });
        kit.label(c, '0 %', gx + 3, gy + gh - 7, { size: 10, color: C.faint });
        kit.label(c, top + ' %', gx + 3, gy + 8, { size: 10, color: C.faint });
        ro.set('changed', fmt(last.pct, 1) + ' % (' + last.n + ' of ' + last.total + (last.avg ? ' blocks' : ' pixels') + ')');
        ro.set('noise', last.avg ? 'about ' + fmt(v.noise / 4, 1) + ' levels per block (' + v.noise + ' per pixel ÷ 4)' : v.noise + ' levels per pixel');
        ro.set('state', lit ? 'motion' : 'quiet');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ cv-pyramid */
  const PYR_WIN = 24, PYR_C1 = 4, PYR_C2 = 120, PYR_SURV = 0.03;       // window size; µs a cheap and a full test; the share that survives
  function pyramid(W, H, minFace, step, stride) {
    const levels = [];
    for (let F = minFace; F <= Math.min(W, H) + 1e-9; F *= step) {
      const f = PYR_WIN / F, w = W * f, h = H * f;
      const nx = Math.max(0, Math.floor((w - PYR_WIN) / stride) + 1), ny = Math.max(0, Math.floor((h - PYR_WIN) / stride) + 1);
      levels.push({ F, f, w, h, nx, ny, count: nx * ny });
      if (levels.length > 40) break;
    }
    return levels;
  }
  Hyper.sim('cv-pyramid', {
    title: 'Why a face detector tests tens of thousands of windows',
    blurb: `A detector looks at a small **window** (24 pixels square) and asks "is this a face?". To find faces of every size it shrinks the picture again and again (an **image pyramid**) and slides the window over each copy. The left picture shows the window sliding at the face size of the current level; the bars show how many windows each level needs. With **two stages** a cheap test rejects almost every window and only the survivors meet the full network. The times per window are teaching figures, not measurements of any chip or model.

**Try this**
- Lower the **smallest face**: more levels and many more windows, because small faces need the biggest copy of the picture.
- Raise the **window step**: fewer windows and faster, but faces fall between the steps.
- Choose **VGA** against **QVGA**: four times the pixels, about four times the windows.
- Switch **two stages** off and watch the time per frame jump.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { height: 520, minH: 520, maxH: 520 } : { height: 400, minH: 400, maxH: 400 });
      const ctl = kit.controls(box.side, [
        { id: 'size', type: 'select', label: 'Frame size', options: [['QVGA 320 × 240', 'FRAMESIZE_QVGA'], ['VGA 640 × 480', 'FRAMESIZE_VGA'], ['SVGA 800 × 600', 'FRAMESIZE_SVGA']], value: 'FRAMESIZE_VGA' },
        { id: 'minFace', label: 'Smallest face to find', min: 20, max: 200, step: 5, value: 40, unit: 'px' },
        { id: 'scale', label: 'Scale step between levels', min: 1.05, max: 1.6, step: 0.05, value: 1.25 },
        { id: 'stride', label: 'Window step', min: 1, max: 8, step: 1, value: 3, unit: 'px' },
        { id: 'two', type: 'check', label: 'Two stages: a cheap test first', value: true }
      ], () => { lvl = 0; prog = 0; });
      const ro = kit.readout(box.side, [['levels', 'Levels'], ['win', 'Windows per frame'], ['time', 'Time per frame'], ['fps', 'Frame rate'], ['lvl', 'This level']]);
      let lvl = 0, prog = 0;
      const FACE = 70;                                    // a drawn face, in picture pixels
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const sz = sizeOf(v.size), W = sz[2], H = sz[3], L = pyramid(W, H, v.minFace, v.scale, v.stride);
        if (!L.length) { ro.set('levels', '0'); return; }
        lvl = Math.min(lvl, L.length - 1);
        const cur = L[lvl];
        prog += dt / 1.1;
        if (prog >= 1) { prog = 0; lvl = (lvl + 1) % L.length; }
        const total = L.reduce((a, l) => a + l.count, 0);
        const us = v.two ? total * PYR_C1 + total * PYR_SURV * PYR_C2 : total * PYR_C2, sec = us * 1e-6;
        // the picture and the window
        const area = narrow ? { x: 10, y: 24, w: st.W - 20, h: 200 } : { x: 10, y: 24, w: Math.floor(st.W * 0.46), h: st.H - 60 };
        const sc = Math.min(area.w / W, area.h / H), iw = W * sc, ih = H * sc;
        kit.label(c, 'The picture, ' + W + ' × ' + H, area.x, 12, { size: 11, color: C.muted });
        c.fillStyle = C.dark ? '#2a3050' : '#dfe4f2'; c.fillRect(area.x, area.y, iw, ih);
        // a drawn face
        const fx = area.x + iw * 0.62, fy = area.y + ih * 0.5, fr = FACE * sc / 2;
        c.fillStyle = '#e8be9c'; c.beginPath(); c.ellipse(fx, fy, fr * 0.8, fr, 0, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#2a2020'; c.fillRect(fx - fr * 0.42, fy - fr * 0.25, fr * 0.2, fr * 0.14); c.fillRect(fx + fr * 0.22, fy - fr * 0.25, fr * 0.2, fr * 0.14); c.fillRect(fx - fr * 0.25, fy + fr * 0.35, fr * 0.5, fr * 0.1);
        // the window at this level, in picture pixels
        const stepPx = v.stride * cur.F / PYR_WIN, idx = Math.min(cur.count - 1, Math.floor(prog * cur.count)), cx = cur.nx ? idx % cur.nx : 0, cy = cur.nx ? Math.floor(idx / cur.nx) : 0;
        const wx = cx * stepPx, wy = cy * stepPx, hit = Math.abs(cur.F - FACE) / FACE < v.scale - 1 && wx < W * 0.62 + FACE / 2 && wx + cur.F > W * 0.62 - FACE / 2 && wy < H * 0.5 + FACE / 2 && wy + cur.F > H * 0.5 - FACE / 2;
        c.strokeStyle = hit ? C.ok : C.warn; c.lineWidth = hit ? 3 : 2;
        c.strokeRect(area.x + wx * sc, area.y + wy * sc, Math.max(2, cur.F * sc), Math.max(2, cur.F * sc));
        c.strokeStyle = C.border2 || C.muted; c.lineWidth = 1; c.strokeRect(area.x - 0.5, area.y - 0.5, iw + 1, ih + 1);
        kit.label(c, 'level ' + (lvl + 1) + ' of ' + L.length + ': window = a ' + Math.round(cur.F) + ' px face' + (hit ? '  — a match' : ''), area.x, area.y + ih + 14, { size: 11, color: hit ? C.ok : C.text2 });
        // the levels as bars
        const bx = narrow ? 14 : area.x + area.w + 26, by = narrow ? area.y + area.h + 40 : 30, bw = st.W - bx - 14, bh = narrow ? st.H - by - 14 : st.H - by - 28;
        kit.label(c, 'Windows at each level', bx, by - 12, { size: 11, color: C.muted });
        const row = Math.min(20, bh / L.length), maxC = Math.max.apply(null, L.map(l => l.count)) || 1;
        L.forEach((l, i) => {
          const y = by + i * row, f = l.count / maxC, lab = Math.round(l.F) + ' px';
          kit.label(c, lab, bx + 40, y + row / 2, { size: Math.min(10.5, row), color: i === lvl ? C.text : C.muted, align: 'right' });
          c.fillStyle = i === lvl ? C.warn : C.accent; c.fillRect(bx + 46, y + 1, Math.max(1, (bw - 120) * f), Math.max(2, row - 3));
          kit.label(c, commas(l.count), bx + 50 + (bw - 120) * f, y + row / 2, { size: Math.min(10, row), color: C.text2 });
        });
        ro.set('levels', L.length + ', faces from ' + Math.round(L[0].F) + ' to ' + Math.round(L[L.length - 1].F) + ' px');
        ro.set('win', commas(total));
        ro.set('time', sec < 1 ? fmt(sec * 1000, sec < 0.01 ? 1 : 0) + ' ms' : fmt(sec, 1) + ' s');
        ro.set('fps', fmt(1 / sec, 1 / sec < 10 ? 1 : 0) + ' a second');
        ro.set('lvl', commas(cur.count) + ' windows on a picture shrunk to ' + Math.round(cur.f * 100) + ' %');
      }, box.stage);
      st.onResize(() => {});
      loop.start();
    }
  });

  /* ================================================================ cv-target */
  const DORI = [['Identify', 250, 140], ['Recognise', 125, 90], ['Observe', 62.5, 45], ['Detect', 25, 10]];
  Hyper.sim('cv-target', {
    title: 'How many pixels land on a person',
    blurb: `A top view: the camera at the left looks to the right through its **field of view**. The coloured slices mark where the picture has enough pixels per metre to *identify* (250), *recognise* (125), *observe* (62.5) or *detect* (25) a person, the levels of a common surveillance guideline (IEC 62676-4). Beyond the last slice a person is too small to find. The small square is a **neighbour's window**: when it lies inside the cone, it is in the picture too.

**Try this**
- Widen the **field of view** to 120 degrees: the cone sees more, but every slice gets shorter.
- Choose **320** pixels across: the distances at which a person can be recognised shrink to a couple of metres.
- Move the **neighbour's window** outside the cone, or narrow the lens until it drops out: that is how a camera is aimed to avoid recording a neighbour.
- Drag the **person** out to the edge of the *detect* slice.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { height: 400, minH: 400, maxH: 400 } : { height: 380, minH: 380, maxH: 380 });
      const ctl = kit.controls(box.side, [
        { id: 'fov', label: 'Field of view (horizontal)', min: 20, max: 160, step: 0.5, value: 66.5, unit: '°' },
        { id: 'n', type: 'select', label: 'Pixels across the picture', options: [['320', 320], ['640', 640], ['800', 800], ['1280', 1280], ['1600', 1600], ['1920', 1920]], value: 1280 },
        { id: 'd', label: 'Distance to the person', min: 0.5, max: 60, step: 0.5, value: 5, unit: 'm', log: true, sig: 2 },
        { id: 'dn', label: 'Distance to the neighbour\'s window', min: 2, max: 40, step: 1, value: 12, unit: 'm' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['width', 'Scene width at the person'], ['ppm', 'Pixels per metre there'], ['face', 'Pixels across a face (16 cm)'], ['lvl', 'A person here can be'], ['dist', 'Distances for I / R / O / D'], ['nb', 'The neighbour\'s window']]);
      const LAT = 4.5;                                    // the neighbour's window sits 4.5 m to the side
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const half = Math.tan(v.fov * Math.PI / 360), n = v.n;
        const ppm = z => n / (2 * z * half);
        const dist = DORI.map(l => n / (l[1] * 2 * half));
        const Rv = clamp(Math.ceil(Math.min(dist[3] * 1.08, 60) / 2) * 2, 8, 60);
        const x0 = 56, y0 = st.H / 2 - 4, ppu = (st.W - x0 - 18) / Rv;
        const X = z => x0 + z * ppu, Yy = l => y0 - l * ppu;
        c.save();
        c.beginPath(); c.rect(0, 0, st.W, st.H - 44); c.clip();
        // the slices, far to near
        const edges = [Math.min(dist[3], Rv * 1.5), Math.min(dist[2], Rv * 1.5), Math.min(dist[1], Rv * 1.5), Math.min(dist[0], Rv * 1.5), 0];
        for (let i = 0; i < 4; i++) {
          const z0 = edges[i + 1], z1 = edges[i];
          c.fillStyle = kit.hue(DORI[3 - i][2], 0.4);
          c.beginPath(); c.moveTo(X(z0), Yy(z0 * half)); c.lineTo(X(z1), Yy(z1 * half)); c.lineTo(X(z1), Yy(-z1 * half)); c.lineTo(X(z0), Yy(-z0 * half)); c.closePath(); c.fill();
        }
        c.strokeStyle = C.muted; c.lineWidth = 1.2; c.setLineDash([4, 4]);
        c.beginPath(); c.moveTo(X(0), y0); c.lineTo(X(Rv * 1.5), Yy(Rv * 1.5 * half)); c.moveTo(X(0), y0); c.lineTo(X(Rv * 1.5), Yy(-Rv * 1.5 * half)); c.stroke(); c.setLineDash([]);
        c.restore();
        // the axis with the four distances
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(X(0), y0); c.lineTo(X(Rv), y0); c.stroke();
        DORI.forEach((l, i) => {
          const z = dist[i];
          if (z > Rv) return;
          c.strokeStyle = kit.hue(l[2], 0.9); c.lineWidth = 2; c.beginPath(); c.moveTo(X(z), y0 - 7); c.lineTo(X(z), y0 + 7); c.stroke();
          kit.label(c, l[0].charAt(0) + ' ' + fmt(z, z < 10 ? 1 : 0) + ' m', X(z), y0 + 18 + (i % 2) * 13, { size: 10.5, color: C.text2, align: 'center' });
        });
        // the camera, the person, the window
        S.box(c, 10, y0 - 12, 34, 24, { label: '', color: C.text2 });
        kit.dot(c, 44, y0, 4, C.text2);
        kit.label(c, 'camera', 27, y0 + 24, { size: 10, color: C.faint, align: 'center' });
        const pd = Math.min(v.d, Rv), px = X(pd);
        kit.dot(c, px, y0, 6, C.accent, C.text);
        kit.label(c, 'person', px, y0 - 14, { size: 11, color: C.text, align: 'center', weight: 600 });
        const inside = LAT / v.dn <= half, wx = X(Math.min(v.dn, Rv)), wy = Yy(LAT);
        c.fillStyle = inside ? C.bad : C.faint; c.fillRect(wx - 5, wy - 5, 10, 10);
        kit.label(c, 'neighbour\'s window', wx, wy - 12, { size: 10.5, color: inside ? C.bad : C.muted, align: 'center' });
        kit.label(c, 'view from above · scale: ' + Rv + ' m across', 10, st.H - 28, { size: 10.5, color: C.faint });
        // the legend
        DORI.forEach((l, i) => {
          const lx = 10 + i * (narrow ? 96 : 120);
          c.fillStyle = kit.hue(l[2], 0.55); c.fillRect(lx, st.H - 16, 12, 10);
          kit.label(c, l[0] + ' ' + l[1] + ' px/m', lx + 16, st.H - 11, { size: 10, color: C.text2 });
        });
        const p = ppm(v.d), lv = DORI.find(l => p >= l[1]);
        ro.set('width', fmt(2 * v.d * half, 1) + ' m');
        ro.set('ppm', fmt(p, p < 100 ? 1 : 0) + ' px/m');
        ro.set('face', fmt(0.16 * p, 0) + ' px');
        ro.set('lvl', lv ? { Identify: 'identified', Recognise: 'recognised', Observe: 'observed', Detect: 'detected' }[lv[0]] : 'too small to detect');
        ro.set('dist', dist.map(z => fmt(z, z < 10 ? 1 : 0)).join(' / ') + ' m');
        ro.set('nb', inside ? 'in the picture: ' + fmt(ppm(v.dn), 0) + ' px/m' : 'outside the picture');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
