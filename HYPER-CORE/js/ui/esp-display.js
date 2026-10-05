/* HYPER-CORE · ui/esp-display.js
 *
 * Hyper ESP32 · Tools → Display & GUI lab: virtual displays with real pixels, and the program for the real thing.
 *
 *   #/tools/displaylab/gui        a GUI designer for a touch screen: widgets on several screens, a Try it mode in which a
 *                                 click is a touch, demo data, and the program (LVGL 9 in C++ and MicroPython, or
 *                                 Adafruit GFX / framebuf for the mono OLED), with touch-target sizes, memory, frame rate
 *   #/tools/displaylab/draw       graphics by hand on any graphic display of the catalogue: a list of drawing commands
 *   #/tools/displaylab/lcd        the character LCD: text, cursor, blink, scrolling, custom characters, number formatting
 *   #/tools/displaylab/segments   seven-segment digits, their bit masks, and multiplexing slowed down until it shows
 *   #/tools/displaylab/touch      how a touch becomes a coordinate: raw readings, calibration, rotation, gestures
 *   #/tools/displaylab/catalogue  the display modules people buy: memory, frame rate, pins — one click opens it in draw
 *
 * Engine: Hyper.gfx (espgfx.js). The GUI design, the drawing and the LCD are kept in localStorage under
 * hyper:esp32:displaylab. T.displaylab.gen exposes the code generators for tools/test-displaylab.js.
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, G = H.gfx;
  const T = H.espTools = H.espTools || {};
  const K = () => H.kit;
  const S = () => H.esym;

  /* ================================================================ shared */
  const KEY = 'hyper:esp32:displaylab';
  const saved = (function () { try { return JSON.parse(window.localStorage.getItem(KEY) || 'null') || {}; } catch (e) { return {}; } })();
  let saveT = 0;
  function persist() {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      try { window.localStorage.setItem(KEY, JSON.stringify({ v: 1, gui: { target: gui.target, designs: gui.designs }, draw: { disp: drw.disp, cmds: drw.cmds }, lcd: lcdState() })); } catch (e) { /* private mode: the lab still works */ }
    }, 250);
  }
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const num = (v, d) => { const x = parseFloat(v); return Number.isFinite(x) ? x : d; };
  const int = (v, d) => Math.round(num(v, d));
  const f = (x, d) => Number.isFinite(x) ? x.toFixed(d == null ? 1 : d) : '—';
  const thou = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const bytes = n => n >= 1024 * 1024 ? f(n / 1048576, 2) + ' MB' : n >= 10240 ? f(n / 1024, 1) + ' KB' : thou(n) + ' bytes';
  const snap = v => Math.round(v / 4) * 4;
  const cq = s => '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';            // a C / Python string literal
  const ident = s => { let t = String(s || '').toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, ''); if (!t) t = 'w'; if (/^[0-9]/.test(t)) t = 'w_' + t; return t.slice(0, 24); };
  const now = () => (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
  const box = (title, html, cls) => '<div class="boxy dl-box' + (cls ? ' ' + cls : '') + '"><h3>' + title + '</h3>' + html + '</div>';
  const more = ids => T.util && T.util.more ? T.util.more(ids) : '';
  const code = (el, entry) => { if (T.util && T.util.code) T.util.code(el, entry); };
  const onTheme = fn => { if (T.util && T.util.onTheme) T.util.onTheme(fn); };

  /* colours of the virtual panels (0xRRGGBB); 'auto' is the screen's text colour, 'panel' a shade of its background */
  const PAL = { auto: null, white: 0xF2F4F8, grey: 0x5A6478, blue: 0x2F7DF6, cyan: 0x22C3D6, teal: 0x14A38B, green: 0x2DBE5A, lime: 0x9ED83A,
    yellow: 0xF5C518, orange: 0xFF8A1F, red: 0xE9443A, pink: 0xF0609E, purple: 0x8E5CF0, dark: 0x1A2030, panel: null };
  const BGS = { dark: 0x101622, black: 0x000000, navy: 0x0B1A3A, slate: 0x2A3140, white: 0xF4F6FA };
  const lum = c => (0.2126 * ((c >> 16) & 255) + 0.7152 * ((c >> 8) & 255) + 0.0722 * (c & 255)) / 255;
  const mix = (a, b, t) => G.rgb(Math.round(((a >> 16) & 255) * (1 - t) + ((b >> 16) & 255) * t), Math.round(((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t), Math.round((a & 255) * (1 - t) + (b & 255) * t));
  const shade = (c, t) => t < 0 ? mix(c, 0, -t) : mix(c, 0xFFFFFF, t);
  const contrast = c => lum(c) > 0.62 ? 0x111622 : 0xFFFFFF;
  const hex6 = c => '0x' + (c & 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
  const hex565 = c => '0x' + G.rgb565((c >> 16) & 255, (c >> 8) & 255, c & 255).toString(16).toUpperCase().padStart(4, '0');

  /* a scaled stage layout for a frame buffer: the largest scale (in steps of ½, or ¼ below 1) that fits */
  function fit(W, H, fw, fh, padB) {
    const m = Math.min((W - 28) / fw, (H - 28 - (padB || 0)) / fh);
    const s = m >= 1 ? Math.max(1, Math.floor(m * 2) / 2) : Math.max(0.25, Math.floor(m * 4) / 4);
    return { s, ox: Math.round((W - fw * s) / 2), oy: Math.round((H - (padB || 0) - fh * s) / 2) };
  }
  /* the icons of the widget kit, as rows of '#' and '.', cut to their size */
  const iconCache = {};
  function iconBits(name) {
    if (iconCache[name]) return iconCache[name];
    const t = G.fb(16, 12);
    G.ui(t).icon(name, 0, 0, { color: 1 });
    let w = 1, h = 1;
    for (let y = 0; y < 12; y++) for (let x = 0; x < 16; x++) if (t.get(x, y)) { w = Math.max(w, x + 1); h = Math.max(h, y + 1); }
    const rows = [];
    for (let y = 0; y < h; y++) { let r = ''; for (let x = 0; x < w; x++) r += t.get(x, y) ? '#' : '.'; rows.push(r); }
    return (iconCache[name] = { w, h, rows });
  }
  const ICONS = (G.ui(G.fb(8, 8)).ICONS || ['wifi']).slice();
  function paintIcon(fb, name, x, y, s, c) {
    const b = iconBits(name);
    b.rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') fb.fillRect(x + i * s, y + j * s, s, s, c); });
  }
  /* rows of '#'/'.' as bytes, most significant bit at the left (Adafruit drawBitmap, framebuf MONO_HLSB) */
  function packRows(rows) {
    const w = rows[0].length, bw = Math.ceil(w / 8), out = [];
    for (const r of rows) for (let k = 0; k < bw; k++) { let v = 0; for (let i = 0; i < 8; i++) if (r[k * 8 + i] === '#') v |= 0x80 >> i; out.push(v); }
    return { w, h: rows.length, bw, bytes: out };
  }
  const hx2 = v => '0x' + v.toString(16).toUpperCase().padStart(2, '0');

  /* ================================================================ the GUI designer: model */
  const TARGETS = [
    { id: 'ili9341', label: '320 × 240 touch TFT (ILI9341)', w: 320, h: 240, depth: 16, disp: 'ili9341-320x240', touch: 'xpt2046', rot: 1, block: 'ILI9341 320×240' },
    { id: 'st7789', label: '240 × 240 TFT (ST7789)', w: 240, h: 240, depth: 16, disp: 'st7789-240x240', touch: 'none', rot: 0, block: 'ST7789 240×240' },
    { id: 'st7796', label: '480 × 320 touch TFT (ST7796)', w: 480, h: 320, depth: 16, disp: 'st7796-480x320', touch: 'cap', rot: 1, block: 'ST7796 480×320' },
    { id: 'oled', label: '128 × 64 mono OLED (SSD1306)', w: 128, h: 64, depth: 1, disp: 'ssd1306-128x64', touch: null, rot: 0, block: 'SSD1306 128×64' }
  ];
  const tgOf = id => TARGETS.find(t => t.id === id) || TARGETS[0];
  const inchOf = tg => { const d = G.display(tg.disp); return d && d.size ? d.size : 2.8; };

  const WT = {
    label: { name: 'Label', pre: 'lbl', resize: '' },
    button: { name: 'Button', pre: 'btn', resize: 'wh' },
    slider: { name: 'Slider', pre: 'sld', resize: 'wh' },
    switch: { name: 'Switch', pre: 'sw', resize: 'wh' },
    checkbox: { name: 'Checkbox', pre: 'chk', resize: '' },
    bar: { name: 'Bar', pre: 'bar', resize: 'wh' },
    gauge: { name: 'Gauge', pre: 'gauge', resize: 'sq' },
    chart: { name: 'Chart', pre: 'chart', resize: 'wh' },
    icon: { name: 'Icon', pre: 'ico', resize: '' },
    list: { name: 'List', pre: 'lst', resize: 'w' },
    header: { name: 'Header', pre: 'hdr', resize: 'h' }
  };
  const TYPES = Object.keys(WT);
  const NUMERIC = ['slider', 'bar', 'gauge'];                 // widgets that hold a value
  const BINDABLE = ['label', 'bar', 'gauge', 'chart'];
  const BINDS = [['none', 'Fixed (no demo data)'], ['room', 'Room temperature (°C)'], ['sine', 'Slow sine across the range'], ['walk', 'Random walk across the range']];

  /* a new widget of a type, sized for the panel */
  function newWidget(type, tg) {
    const k = tg.depth === 1 ? 0.4 : Math.min(tg.w / 320, tg.h / 240), m = tg.depth === 1;
    const S_ = v => Math.max(m ? 4 : 8, snap(v * k));
    const base = {
      label: { text: 'Label', size: 1, color: 'auto', min: 0, max: 100, bind: 'none' },
      button: { text: 'OK', size: 1, color: 'blue', w: m ? 32 : S_(76), h: m ? 13 : S_(36), action: 'none' },
      slider: { w: m ? 60 : S_(140), h: m ? 9 : S_(18), min: 0, max: 100, value: 50, color: 'blue' },
      switch: { w: m ? 22 : S_(48), h: m ? 11 : S_(24), checked: false, color: 'green' },
      checkbox: { text: 'Option', size: 1, checked: true, color: 'blue' },
      bar: { w: m ? 60 : S_(140), h: m ? 7 : S_(14), min: 0, max: 100, value: 60, color: 'green', bind: 'none' },
      gauge: { w: m ? 36 : S_(96), min: 0, max: 100, value: 40, color: 'orange', text: '', bind: 'none' },
      chart: { w: m ? 64 : S_(160), h: m ? 20 : S_(64), min: 0, max: 100, color: 'cyan', bind: 'walk' },
      icon: { icon: 'wifi', size: 1, color: 'auto' },
      list: { w: m ? 60 : S_(110), items: 'First\nSecond\nThird', sel: 0, size: 1, color: 'blue' },
      header: { text: 'Title', h: m ? 10 : S_(22), size: 1, color: 'panel' }
    }[type];
    const w = Object.assign({ type, x: 0, y: 0 }, base);
    if (type === 'gauge') w.h = w.w;
    return w;
  }
  const listItems = w => String(w.items || '').split('\n').map(s => s.trim()).filter(Boolean).slice(0, 12);
  const rowH = (w, mono) => 8 * (w.size || 1) + (mono ? 3 : 10);
  const cbSize = (s, mono) => mono ? 8 * s : 8 * s + 4;
  /* the box a widget covers, in panel pixels */
  function wbox(w, tg) {
    const s = w.size || 1, mono = tg.depth === 1;
    switch (w.type) {
      case 'label': return { x: w.x, y: w.y, w: Math.max(6, G.textWidth(w.text || ' ', s)), h: 8 * s };
      case 'checkbox': { const b = cbSize(s, mono); return { x: w.x, y: w.y, w: b + 5 + G.textWidth(w.text || '', s), h: Math.max(b, 8 * s) }; }
      case 'icon': { const d = iconBits(w.icon); return { x: w.x, y: w.y, w: d.w * s, h: d.h * s }; }
      case 'list': return { x: w.x, y: w.y, w: w.w, h: Math.max(1, listItems(w).length) * rowH(w, mono) };
      case 'header': return { x: 0, y: 0, w: tg.w, h: w.h };
      case 'gauge': return { x: w.x, y: w.y, w: w.w, h: w.w };
      default: return { x: w.x, y: w.y, w: w.w, h: w.h };
    }
  }
  /* the number inside a label's text: "21.5°C" -> { pre: '', num: 21.5, dec: 1, post: '°C' } */
  function numIn(text) {
    const t = String(text || ''), m = /-?\d+(?:\.(\d+))?/.exec(t);
    if (!m) return null;
    return { pre: t.slice(0, m.index), num: parseFloat(m[0]), dec: m[1] ? Math.min(3, m[1].length) : 0, post: t.slice(m.index + m[0].length) };
  }
  function textWith(text, v) {
    const p = numIn(text);
    if (!Number.isFinite(v)) return String(text || '');
    return p ? p.pre + v.toFixed(p.dec) + p.post : (text ? text + ' ' : '') + v.toFixed(1);
  }
  const fracOf = (v, lo, hi) => { lo = num(lo, 0); hi = num(hi, 100); return hi === lo ? 0 : clamp((num(v, lo) - lo) / (hi - lo), 0, 1); };
  const gaugeDec = w => (num(w.max, 100) - num(w.min, 0)) < 10 ? 1 : 0;

  /* the colours of a screen */
  function themeOf(scr, tg) {
    if (tg.depth === 1) return { mono: true, bg: 0, fg: 1, dim: 1, panel: 0, grid: 1 };
    const bg = BGS[scr && scr.bg] != null ? BGS[scr.bg] : BGS.dark, light = lum(bg) > 0.55, fg = light ? 0x1A2030 : 0xE8ECF4;
    return { mono: false, bg, fg, light, dim: mix(bg, fg, light ? 0.2 : 0.22), panel: mix(bg, fg, light ? 0.07 : 0.1), grid: mix(bg, fg, 0.15) };
  }
  const colOf = (name, th) => th.mono ? 1 : name === 'auto' || name == null ? th.fg : name === 'panel' ? th.panel : PAL[name] != null ? PAL[name] : th.fg;

  /* ---------------------------------------------------------------- painting one widget into a frame buffer
     v: the values to show { value, checked, sel, text, data }; st: { pressed, pressRow, active } */
  function paintWidget(fb, w, v, th, tg, st) {
    const mono = th.mono, s = w.size || 1, c = colOf(w.color, th);
    st = st || {};
    switch (w.type) {
      case 'header': {
        const hc = mono ? 1 : c;
        fb.fillRect(0, 0, tg.w, w.h, hc);
        fb.text(w.text || '', mono ? 2 : 6, Math.max(0, (w.h - 7 * s) >> 1), { size: s, color: mono ? 0 : (w.color === 'panel' ? th.fg : contrast(hc)) });
        break;
      }
      case 'label': fb.text(v.text, w.x, w.y, { size: s, color: c }); break;
      case 'button': {
        const down = st.pressed === w.id, r = Math.min(mono ? 3 : 6, w.h >> 1), ty = w.y + ((w.h - 7 * s) >> 1);
        if (mono) {
          if (down) fb.fillRoundRect(w.x, w.y, w.w, w.h, r, 1); else fb.roundRect(w.x, w.y, w.w, w.h, r, 1);
          fb.text(w.text || '', w.x + (w.w >> 1), ty, { size: s, color: down ? 0 : 1, align: 'center' });
        } else {
          const fill = down ? shade(c, -0.3) : c;
          fb.fillRoundRect(w.x, w.y, w.w, w.h, r, fill);
          if (!down && w.w > 2 * r) fb.hline(w.x + r, w.y + w.h - 1, w.w - 2 * r, shade(c, -0.38));
          fb.text(w.text || '', w.x + (w.w >> 1), ty + (down ? 1 : 0), { size: s, color: contrast(fill), align: 'center' });
        }
        break;
      }
      case 'slider': {
        const fr = fracOf(v.value, w.min, w.max), r = clamp(w.h >> 1, mono ? 3 : 4, 12), cy = w.y + (w.h >> 1);
        const x0 = w.x + r, x1 = w.x + w.w - 1 - r, kx = Math.round(x0 + fr * Math.max(0, x1 - x0));
        if (mono) { fb.rect(w.x, cy - 1, w.w, 3, 1); fb.fillCircle(kx, cy, r, 1); fb.fillCircle(kx, cy, Math.max(1, r - 2), 0); }
        else {
          const t2 = Math.max(3, Math.round(w.h / 3)), ty = cy - (t2 >> 1);
          fb.fillRoundRect(w.x, ty, w.w, t2, t2 >> 1, th.dim);
          if (kx > w.x) fb.fillRoundRect(w.x, ty, kx - w.x + 1, t2, t2 >> 1, c);
          if (st.active === w.id) fb.fillCircle(kx, cy, r + 3, mix(th.bg, c, 0.35));
          fb.fillCircle(kx, cy, r, c);
          fb.fillCircle(kx, cy, Math.max(1, r - 4), shade(c, 0.55));
        }
        break;
      }
      case 'switch': {
        const on = !!v.checked, r = w.h >> 1, kr = Math.max(1, r - (mono ? 2 : 3)), kx = on ? w.x + w.w - 1 - r : w.x + r, cy = w.y + r;
        if (mono) { if (on) { fb.fillRoundRect(w.x, w.y, w.w, w.h, r, 1); fb.fillCircle(kx, cy, kr, 0); } else { fb.roundRect(w.x, w.y, w.w, w.h, r, 1); fb.fillCircle(kx, cy, kr, 1); } }
        else { fb.fillRoundRect(w.x, w.y, w.w, w.h, r, on ? c : th.dim); fb.fillCircle(kx, cy, kr, 0xFFFFFF); }
        break;
      }
      case 'checkbox': {
        const b = cbSize(s, mono), on = !!v.checked, bh = Math.max(b, 8 * s), by = w.y + ((bh - b) >> 1);
        if (mono) fb.rect(w.x, by, b, b, 1);
        else if (on) fb.fillRoundRect(w.x, by, b, b, 2, c);
        else { fb.fillRoundRect(w.x, by, b, b, 2, th.panel); fb.roundRect(w.x, by, b, b, 2, th.dim); }
        if (on) {
          const ck = mono ? 1 : contrast(c), p = (a, q) => [w.x + Math.round(a * b), by + Math.round(q * b)];
          const A = p(0.2, 0.52), B = p(0.42, 0.74), Cc = p(0.8, 0.26);
          for (let d = 0; d < Math.max(1, Math.round(b / 7)); d++) { fb.line(A[0], A[1] + d, B[0], B[1] + d, ck); fb.line(B[0], B[1] + d, Cc[0], Cc[1] + d, ck); }
        }
        fb.text(w.text || '', w.x + b + 5, w.y + ((bh - 7 * s) >> 1), { size: s, color: mono ? 1 : th.fg });
        break;
      }
      case 'bar': {
        const fr = fracOf(v.value, w.min, w.max);
        if (mono) { fb.rect(w.x, w.y, w.w, w.h, 1); const fw = Math.round((w.w - 4) * fr); if (fw > 0 && w.h > 4) fb.fillRect(w.x + 2, w.y + 2, fw, w.h - 4, 1); }
        else { const r = Math.min(4, w.h >> 1), fw = Math.round(w.w * fr); fb.fillRoundRect(w.x, w.y, w.w, w.h, r, th.dim); if (fw > 0) fb.fillRoundRect(w.x, w.y, Math.max(fw, 2 * r), w.h, r, c); }
        break;
      }
      case 'gauge': {
        const fr = fracOf(v.value, w.min, w.max), half = w.w >> 1, cx = w.x + half, cy = w.y + half, r = Math.max(4, half - 1);
        const thick = mono ? Math.max(2, Math.round(r / 6)) : Math.max(3, Math.round(r / 7));
        fb.arc(cx, cy, r, -135, 135, mono ? 1 : thick, mono ? 1 : th.dim);
        if (fr > 0) fb.arc(cx, cy, r, -135, -135 + 270 * fr, thick, c);
        const vs = r >= 56 ? 3 : r >= 26 ? 2 : 1, val = Number.isFinite(v.value) ? v.value.toFixed(gaugeDec(w)) : '';
        fb.text(val, cx, cy - ((7 * vs) >> 1), { size: vs, color: mono ? 1 : th.fg, align: 'center' });
        if (w.text && r >= 18) fb.text(w.text, cx, cy + Math.round(r * 0.42), { size: 1, color: mono ? 1 : mix(th.bg, th.fg, 0.7), align: 'center' });
        break;
      }
      case 'chart': {
        const data = v.data || [], lo = num(w.min, 0), hi = num(w.max, 100), span = hi - lo || 1;
        if (mono) fb.rect(w.x, w.y, w.w, w.h, 1);
        else { fb.fillRect(w.x, w.y, w.w, w.h, th.panel); for (let i = 1; i < 4; i++) fb.hline(w.x, w.y + Math.round(w.h * i / 4), w.w, th.grid); }
        if (data.length > 1) {
          const X = i => w.x + 2 + i * (w.w - 5) / (data.length - 1), Y = q => w.y + w.h - 3 - (clamp(q, lo, hi) - lo) / span * (w.h - 6);
          for (let i = 1; i < data.length; i++) { fb.line(X(i - 1), Y(data[i - 1]), X(i), Y(data[i]), c); if (!mono && w.h > 30) fb.line(X(i - 1), Y(data[i - 1]) + 1, X(i), Y(data[i]) + 1, c); }
        }
        break;
      }
      case 'icon': paintIcon(fb, w.icon, w.x, w.y, s, c); break;
      case 'list': {
        const items = listItems(w), rh = rowH(w, mono), maxCh = Math.max(1, Math.floor((w.w - (mono ? 4 : 10)) / (6 * s))), sel = v.sel;
        if (!mono) fb.fillRoundRect(w.x, w.y, w.w, items.length * rh, 4, th.panel);
        items.forEach((t, i) => {
          const yy = w.y + i * rh, on = i === sel, down = st.pressed === w.id && st.pressRow === i;
          if (mono) { if (on || down) fb.fillRect(w.x, yy, w.w, rh, 1); }
          else {
            if (on) fb.fillRoundRect(w.x + 2, yy + 2, w.w - 4, rh - 4, 3, down ? shade(c, -0.3) : c);
            else if (down) fb.fillRoundRect(w.x + 2, yy + 2, w.w - 4, rh - 4, 3, th.dim);
            if (i < items.length - 1 && !on && i + 1 !== sel) fb.hline(w.x + 6, yy + rh - 1, w.w - 12, th.grid);
          }
          fb.text(t.length > maxCh ? t.slice(0, maxCh) : t, w.x + (mono ? 3 : 7), yy + ((rh - 7 * s) >> 1), { size: s, color: mono ? (on || down ? 0 : 1) : on ? contrast(c) : th.fg });
        });
        break;
      }
    }
  }

  /* ---------------------------------------------------------------- demo data: makes gauges, bars, charts and labels move */
  function makeDemo() {
    const walks = {}, hist = {};
    let t = 0, acc = 0;
    const lohi = w => [num(w.min, 0), num(w.max, 100)];
    const walkOf = id => (walks[id] == null ? (walks[id] = 0.35 + 0.3 * Math.random()) : walks[id]);
    const raw = (w, tt) => {
      if (w.bind === 'room') return 21 + 1.5 * Math.sin(tt * 2 * Math.PI / 40) + 0.25 * Math.sin(tt * 2 * Math.PI / 7);
      const [lo, hi] = lohi(w);
      if (w.bind === 'sine') return lo + (hi - lo) * (0.5 + 0.5 * Math.sin(tt * 2 * Math.PI / 20));
      if (w.bind === 'walk') return lo + (hi - lo) * walkOf(w.id);
      return null;
    };
    const d = {
      get t() { return t; },
      /* advance; returns true twice a second, when charts take a new sample */
      step(dt, widgets) {
        t += dt; acc += dt;
        if (acc < 0.5) return false;
        acc = 0;
        for (const w of widgets) {
          if (w.bind === 'walk') walks[w.id] = clamp(walkOf(w.id) + (Math.random() - 0.5) * 0.08, 0, 1);
          if (w.type === 'chart') { const hs = d.series(w); hs.push(d.value(w)); if (hs.length > 30) hs.shift(); }
        }
        return true;
      },
      value(w) {
        if (!w.bind || w.bind === 'none') return null;
        const [lo, hi] = lohi(w), x = raw(w, t);
        return x == null ? null : clamp(x, Math.min(lo, hi), Math.max(lo, hi));
      },
      /* the last 30 samples of a chart; a chart that is not bound shows a calm example curve */
      series(w) {
        if (hist[w.id]) return hist[w.id];
        const [lo, hi] = lohi(w), out = [];
        for (let i = 0; i < 30; i++) {
          const tt = t - (29 - i) * 0.5;
          let x = !w.bind || w.bind === 'none' ? lo + (hi - lo) * (0.5 + 0.3 * Math.sin(i / 4) + 0.08 * Math.sin(i * 1.7)) : w.bind === 'walk' ? lo + (hi - lo) * clamp(0.5 + 0.25 * Math.sin(i / 5 + w.id.length) + 0.06 * Math.sin(i * 1.3), 0, 1) : raw(w, tt);
          out.push(clamp(num(x, lo), Math.min(lo, hi), Math.max(lo, hi)));
        }
        if (w.bind === 'walk') walks[w.id] = fracOf(out[29], lo, hi);
        return (hist[w.id] = out);
      },
      forget(id) { delete hist[id]; delete walks[id]; }
    };
    return d;
  }

  /* the values a widget shows: from the design, from the Try it state, and from the demo data */
  function valuesOf(w, live, demo) {
    const L = live && live[w.id];
    const v = { value: num(w.value, 0), checked: !!w.checked, sel: w.sel | 0, text: w.text || '', data: null };
    if (L) Object.assign(v, L);
    if (demo && w.bind && w.bind !== 'none') { const x = demo.value(w); if (x != null) { v.value = x; if (w.type === 'label') v.text = textWith(w.text, x); } }
    if (w.type === 'chart') v.data = demo ? demo.series(w) : [];
    return v;
  }
  function paintScreen(fb, scr, tg, live, demo, st) {
    const th = themeOf(scr, tg);
    fb.clear(th.bg);
    for (const w of scr.widgets) paintWidget(fb, w, valuesOf(w, live, demo), th, tg, st);
    return th;
  }

  /* ================================================================ the lab */
  T.displaylab = function (el, params, sub) {
    const want = params && params.get && params.get('d');
    if (want && G.display(want)) drw.disp = want;
    const { tab, body } = T.util.subtabs(el, 'displaylab', [['gui', 'GUI designer'], ['draw', 'Draw'], ['lcd', 'Character LCD'], ['segments', 'Seven segments'], ['touch', 'Touch'], ['catalogue', 'Display catalogue']], sub);
    ({ gui: guiTab, draw: drawTab, lcd: lcdTab, segments: segTab, touch: touchTab, catalogue: catTab })[tab](body, params);
  };
  T.displaylab.tabs = ['gui', 'draw', 'lcd', 'segments', 'touch', 'catalogue'];
  T.displaylab.dom = true;
  T.displaylab.gen = {};

  /* ================================================================ the GUI designer: the example and the state */
  /* the example: a thermostat on a 320 × 240 panel, with a second screen for its settings */
  function thermostat320() {
    const L = (id, x, y, text, size, color, extra) => Object.assign({ type: 'label', id, x, y, text, size: size || 1, color: color || 'auto', min: 0, max: 100, bind: 'none' }, extra || {});
    return { cur: 0, screens: [
      { id: 's1', name: 'Main', bg: 'dark', widgets: [
        { type: 'header', id: 'hdr_main', x: 0, y: 0, text: 'Thermostat', h: 22, size: 1, color: 'panel' },
        { type: 'icon', id: 'ico_wifi', x: 300, y: 8, icon: 'wifi', size: 1, color: 'auto' },
        { type: 'gauge', id: 'gauge_room', x: 10, y: 30, w: 124, h: 124, min: 10, max: 30, value: 21, color: 'orange', text: 'Room °C', bind: 'room' },
        L('lbl_set', 150, 36, '21.5°C', 3, 'white', { min: 15, max: 30 }),
        L('lbl_setcap', 152, 64, 'Set point', 1, 'grey'),
        { type: 'button', id: 'btn_minus', x: 150, y: 80, w: 64, h: 44, text: '-', size: 2, color: 'blue', action: 'step', target: 'lbl_set', by: -0.5 },
        { type: 'button', id: 'btn_plus', x: 226, y: 80, w: 64, h: 44, text: '+', size: 2, color: 'blue', action: 'step', target: 'lbl_set', by: 0.5 },
        L('lbl_eco', 152, 142, 'Eco mode'),
        { type: 'switch', id: 'sw_eco', x: 240, y: 134, w: 48, h: 24, checked: false, color: 'green' },
        L('lbl_trend', 10, 160, 'Room temperature', 1, 'grey'),
        { type: 'chart', id: 'chart_room', x: 10, y: 172, w: 196, h: 60, min: 17, max: 25, color: 'cyan', bind: 'room' },
        { type: 'button', id: 'btn_settings', x: 216, y: 184, w: 94, h: 48, text: 'Settings', size: 1, color: 'teal', action: 'goto', screen: 's2' }
      ] },
      { id: 's2', name: 'Settings', bg: 'dark', widgets: [
        { type: 'header', id: 'hdr_settings', x: 0, y: 0, text: 'Settings', h: 22, size: 1, color: 'panel' },
        { type: 'icon', id: 'ico_gear', x: 302, y: 8, icon: 'gear', size: 1, color: 'auto' },
        L('lbl_bright', 12, 34, 'Brightness'),
        { type: 'slider', id: 'sld_bright', x: 12, y: 48, w: 180, h: 20, min: 0, max: 100, value: 70, color: 'blue' },
        { type: 'checkbox', id: 'chk_beep', x: 12, y: 84, text: 'Key beep', size: 1, checked: true, color: 'blue' },
        { type: 'checkbox', id: 'chk_wifi', x: 12, y: 106, text: 'Wi-Fi', size: 1, checked: true, color: 'blue' },
        L('lbl_filter', 12, 134, 'Filter life'),
        { type: 'bar', id: 'bar_filter', x: 12, y: 148, w: 180, h: 14, min: 0, max: 100, value: 65, color: 'green', bind: 'none' },
        L('lbl_mode', 212, 34, 'Mode'),
        { type: 'list', id: 'lst_mode', x: 212, y: 48, w: 96, items: 'Comfort\nEco\nAway\nFrost', sel: 0, size: 1, color: 'blue' },
        { type: 'button', id: 'btn_back', x: 12, y: 184, w: 96, h: 44, text: 'Back', size: 1, color: 'grey', action: 'goto', screen: 's1' }
      ] }
    ] };
  }
  /* the same thermostat on the 128 × 64 OLED */
  function thermostatOled() {
    const L = (id, x, y, text, size, extra) => Object.assign({ type: 'label', id, x, y, text, size: size || 1, color: 'auto', min: 0, max: 100, bind: 'none' }, extra || {});
    return { cur: 0, screens: [
      { id: 's1', name: 'Main', bg: 'black', widgets: [
        { type: 'header', id: 'hdr_main', x: 0, y: 0, text: 'Thermostat', h: 10, size: 1, color: 'panel' },
        L('lbl_set', 2, 14, '21.5°C', 2, { min: 15, max: 30 }),
        { type: 'chart', id: 'chart_room', x: 2, y: 33, w: 78, h: 14, min: 17, max: 25, color: 'cyan', bind: 'room' },
        { type: 'gauge', id: 'gauge_room', x: 88, y: 12, w: 38, h: 38, min: 10, max: 30, value: 21, color: 'orange', text: '', bind: 'room' },
        { type: 'button', id: 'btn_minus', x: 2, y: 50, w: 24, h: 13, text: '-', size: 1, color: 'blue', action: 'step', target: 'lbl_set', by: -0.5 },
        { type: 'button', id: 'btn_plus', x: 30, y: 50, w: 24, h: 13, text: '+', size: 1, color: 'blue', action: 'step', target: 'lbl_set', by: 0.5 },
        { type: 'button', id: 'btn_settings', x: 58, y: 50, w: 30, h: 13, text: 'Menu', size: 1, color: 'teal', action: 'goto', screen: 's2' }
      ] },
      { id: 's2', name: 'Settings', bg: 'black', widgets: [
        { type: 'header', id: 'hdr_settings', x: 0, y: 0, text: 'Settings', h: 10, size: 1, color: 'panel' },
        { type: 'list', id: 'lst_mode', x: 0, y: 12, w: 62, items: 'Comfort\nEco\nAway\nFrost', sel: 0, size: 1, color: 'blue' },
        { type: 'checkbox', id: 'chk_beep', x: 68, y: 13, text: 'Beep', size: 1, checked: true, color: 'blue' },
        L('lbl_bright', 68, 26, 'Bright'),
        { type: 'bar', id: 'bar_bright', x: 68, y: 36, w: 56, h: 7, min: 0, max: 100, value: 70, color: 'green', bind: 'none' },
        { type: 'button', id: 'btn_back', x: 68, y: 48, w: 40, h: 14, text: 'Back', size: 1, color: 'grey', action: 'goto', screen: 's1' }
      ] }
    ] };
  }
  function scaleDesign(d, sx, sy) {
    const k = Math.min(sx, sy);
    for (const scr of d.screens) for (const w of scr.widgets) {
      w.x = Math.round(w.x * sx); w.y = Math.round(w.y * sy);
      if (w.type === 'gauge') w.w = w.h = Math.round(w.w * k);
      else { if (w.w != null) w.w = Math.round(w.w * sx); if (w.h != null) w.h = Math.round(w.h * (w.type === 'header' ? k : sy)); }
      if (w.size) w.size = clamp(Math.round(w.size * k), 1, 4);
    }
    return d;
  }
  function defaultDesign(tid) {
    const tg = tgOf(tid);
    if (tg.depth === 1) return thermostatOled();
    return tg.w === 320 && tg.h === 240 ? thermostat320() : scaleDesign(thermostat320(), tg.w / 320, tg.h / 240);
  }
  /* a design read back from storage, repaired where it must be */
  function cleanDesign(d, tg) {
    if (!d || !Array.isArray(d.screens) || !d.screens.length) return null;
    const ids = new Set(), sids = new Set(), out = { cur: 0, screens: [] };
    d.screens.slice(0, 12).forEach((s, i) => {
      if (!s || !Array.isArray(s.widgets)) return;
      let sid = String(s.id || 's' + (i + 1)); while (sids.has(sid)) sid += 'x'; sids.add(sid);
      const scr = { id: sid, name: String(s.name || 'Screen ' + (i + 1)).slice(0, 24), bg: BGS[s.bg] != null ? s.bg : 'dark', widgets: [] };
      for (const w0 of s.widgets.slice(0, 80)) {
        if (!w0 || !WT[w0.type]) continue;
        const w = Object.assign(newWidget(w0.type, tg), w0);
        let id = ident(w.id || WT[w.type].pre), n = 2; const b = id; while (ids.has(id)) id = b + '_' + n++; ids.add(id); w.id = id;
        for (const k of ['x', 'y', 'w', 'h', 'min', 'max', 'value', 'by', 'sel']) if (w[k] != null) w[k] = num(w[k], 0);
        w.size = clamp(int(w.size, 1), 1, 4);
        if (w.w != null) w.w = clamp(w.w, 4, tg.w); if (w.h != null) w.h = clamp(w.h, 4, tg.h);
        w.x = clamp(w.x, 0, tg.w - 1); w.y = clamp(w.y, 0, tg.h - 1);
        if (w.type === 'gauge') w.h = w.w;
        if (w.type === 'header') { w.x = 0; w.y = 0; }
        if (w.color != null && !(w.color in PAL)) w.color = 'auto';
        if (w.icon != null && !ICONS.includes(w.icon)) w.icon = ICONS[0];
        if (w.bind != null && !BINDS.some(b2 => b2[0] === w.bind)) w.bind = 'none';
        for (const k of ['text', 'items']) if (w[k] != null) w[k] = String(w[k]).slice(0, 200);
        scr.widgets.push(w);
      }
      out.screens.push(scr);
    });
    if (!out.screens.length) return null;
    out.cur = clamp(d.cur | 0, 0, out.screens.length - 1);
    return out;
  }

  const gui = { target: 'ili9341', designs: {}, mode: 'design', sel: null, undo: [], redo: [], live: {}, log: [], pressed: null, hover: null, demo: makeDemo(), t0: now(), dirty: true, acc: 0, onLog: null };
  if (saved.gui) {
    if (TARGETS.some(t => t.id === saved.gui.target)) gui.target = saved.gui.target;
    for (const t of TARGETS) { const d = saved.gui.designs && cleanDesign(saved.gui.designs[t.id], t); if (d) gui.designs[t.id] = d; }
  }
  const design = () => gui.designs[gui.target] || (gui.designs[gui.target] = defaultDesign(gui.target));
  const curScreen = () => { const d = design(); d.cur = clamp(d.cur | 0, 0, d.screens.length - 1); return d.screens[d.cur]; };
  const allWidgets = () => design().screens.reduce((a, s) => a.concat(s.widgets), []);
  const findW = id => allWidgets().find(w => w.id === id) || null;
  const selW = () => gui.sel ? curScreen().widgets.find(w => w.id === gui.sel) || null : null;
  function uniqueId(base, except) { const used = new Set(allWidgets().filter(w => w !== except).map(w => w.id)); const b = ident(base); let id = b, n = 2; while (used.has(id)) id = b + '_' + n++; return id; }
  function freshId(type) { const pre = WT[type].pre, used = new Set(allWidgets().map(w => w.id)); let n = 1; while (used.has(pre + n)) n++; return pre + n; }
  const snapshot = () => JSON.stringify(design());
  function pushUndo(s) { gui.undo.push(s || snapshot()); if (gui.undo.length > 60) gui.undo.shift(); gui.redo.length = 0; }
  function restore(s) { try { const d = cleanDesign(JSON.parse(s), tgOf(gui.target)); if (d) gui.designs[gui.target] = d; } catch (e) { /* a broken snapshot is skipped */ } if (!selW()) gui.sel = null; }
  const gridOf = tg => tg.depth === 1 ? 2 : 4;
  const isTouchable = w => ['button', 'slider', 'switch', 'checkbox', 'list'].includes(w.type);
  function logEv(text, key) {
    const line = { key: key || null, text: f((now() - gui.t0) / 1000, 1).padStart(6) + ' s  ' + text };
    const last = gui.log[gui.log.length - 1];
    if (key && last && last.key === key) gui.log[gui.log.length - 1] = line; else gui.log.push(line);
    if (gui.log.length > 80) gui.log.shift();
    if (gui.onLog) gui.onLog();
  }
  const fbCache = {};
  const fbFor = tg => fbCache[tg.id] || (fbCache[tg.id] = G.fb(tg.w, tg.h, { depth: tg.depth }));

  /* ================================================================ the GUI designer: the tab */
  function guiTab(body) {
    const kit = K();
    body.innerHTML = '<p class="muted" style="margin:0 0 12px">Design the screens of a touch display without the hardware. Add widgets from the palette, drag them into place, drag the square handle to resize, and set their names, texts, values and colours on the right. <b>Try it</b> makes the design live — a click is a touch — and the program under the screen is rewritten as you go: LVGL 9 for the colour panels, Adafruit GFX for the OLED.</p>' +
      '<div class="esplab dl-gui"><div class="side"><div class="dl-top"></div><div class="dl-design"><div class="dl-pal"></div><div class="dl-props"></div></div>' +
      '<div class="dl-try" style="display:none"><div class="dl-tryctl"></div><div class="espout dl-log"></div><p class="small muted dl-tryhint" style="margin:0"></p></div></div>' +
      '<div style="min-width:0"><div class="dl-scrbar"><div class="dl-scrs"></div><div class="dl-scrbtn"></div></div><div class="stage"></div><div class="dl-under"></div></div></div>' +
      '<div class="dl-code" style="margin-top:14px"></div>' +
      more(['gui-concepts', 'lvgl', 'lvgl-widgets', 'lvgl-events-and-screens', 'lvgl-display-and-input-drivers', 'lvgl-styles-and-layouts', 'presenting-data', 'hmi-design-rules', 'gui-in-micropython', 'menus-on-small-displays']);
    const $ = s => ui.$(s, body);
    const top = $('.dl-top'), designEl = $('.dl-design'), palEl = $('.dl-pal'), propsEl = $('.dl-props'), tryEl = $('.dl-try'), tryCtl = $('.dl-tryctl'), logEl = $('.dl-log'), tryHint = $('.dl-tryhint');
    const scrsEl = $('.dl-scrs'), scrBtn = $('.dl-scrbtn'), stageEl = $('.stage'), under = $('.dl-under'), codeEl = $('.dl-code');
    const st = kit.stage(stageEl, { aspect: 0.75, minH: 320, maxH: 660 });
    const tg = () => tgOf(gui.target);
    let L = { s: 1, ox: 0, oy: 0 }, codeT = 0;
    const toP = p => ({ x: (p.x - L.ox) / L.s, y: (p.y - L.oy) / L.s });
    const snapG = v => Math.round(v / gridOf(tg())) * gridOf(tg());
    function hitW(q) {
      const scr = curScreen(), t = tg();
      for (let i = scr.widgets.length - 1; i >= 0; i--) { const w = scr.widgets[i], b = wbox(w, t); if (q.x >= b.x && q.y >= b.y && q.x < b.x + b.w && q.y < b.y + b.h) return w; }
      return null;
    }
    function handlePos(w, t) {
      const r = WT[w.type].resize;
      if (!r) return null;
      const b = wbox(w, t), X = x => L.ox + x * L.s, Y = y => L.oy + y * L.s;
      if (r === 'w') return { x: X(b.x + b.w), y: Y(b.y + b.h / 2) };
      if (r === 'h') return { x: X(b.x + b.w / 2), y: Y(b.y + b.h) };
      return { x: X(b.x + b.w), y: Y(b.y + b.h) };
    }
    const onHandle = (p, w, t) => { const hp = w && handlePos(w, t); return !!hp && Math.abs(p.x - hp.x) <= 9 && Math.abs(p.y - hp.y) <= 9; };

    /* ---- controls */
    const topCtl = kit.controls(top, [
      { id: 'target', type: 'select', label: 'Panel', options: TARGETS.map(t => [t.label, t.id]), value: gui.target },
      { id: 'mode', type: 'select', label: 'Mode', options: [['Design — place and arrange widgets', 'design'], ['Try it — a click is a touch', 'try']], value: gui.mode }
    ], (id, v) => {
      if (id === 'target' && v !== gui.target && TARGETS.some(t => t.id === v)) { gui.target = v; gui.sel = null; gui.undo = []; gui.redo = []; gui.live = {}; gui.pressed = null; gui.demo = makeDemo(); if (gui.mode === 'try') startTry(); changed(true); }
      if (id === 'mode') setMode(v);
    });
    kit.controls(palEl, [
      { type: 'html', html: '<b>Add a widget</b> — it appears in the middle of the screen.' },
      { type: 'buttons', items: TYPES.map(t => ({ id: 'add:' + t, label: WT[t].name })) },
      { type: 'html', html: '<b>The selected widget</b> <span class="faint">(also: Delete, arrow keys, Ctrl+D, Ctrl+Z)</span>' },
      { type: 'buttons', items: [{ id: 'front', label: 'Bring forward' }, { id: 'back', label: 'Send back' }, { id: 'dup', label: 'Duplicate' }, { id: 'del', label: 'Delete' }] }
    ], onEdit);
    kit.controls(tryCtl, [{ type: 'buttons', items: [{ id: 'reset', label: 'Reset values', primary: true }, { id: 'clear', label: 'Clear the log' }] }], id => {
      if (id === 'reset') { gui.live = {}; gui.pressed = null; logEv('— values back to the design —'); }
      if (id === 'clear') { gui.log = []; refreshLog(); }
      gui.dirty = true; loop.once();
    });
    kit.controls(scrBtn, [{ type: 'buttons', items: [{ id: 'addscr', label: '+ Screen' }, { id: 'delscr', label: 'Delete screen' }, { id: 'undo', label: 'Undo' }, { id: 'redo', label: 'Redo' }, { id: 'example', label: 'Reset to the example' }] }], onEdit);

    function onEdit(id) {
      const d = design(), scr = curScreen(), w = selW(), t = tg();
      if (id.indexOf('add:') === 0) { addWidget(id.slice(4)); return; }
      if (id === 'undo') { if (!gui.undo.length) { ui.toast('Nothing to undo'); return; } gui.redo.push(snapshot()); restore(gui.undo.pop()); changed(true); return; }
      if (id === 'redo') { if (!gui.redo.length) { ui.toast('Nothing to redo'); return; } gui.undo.push(snapshot()); restore(gui.redo.pop()); changed(true); return; }
      if (id === 'addscr') {
        if (d.screens.length >= 12) { ui.toast('Twelve screens at most'); return; }
        pushUndo();
        const n = d.screens.length + 1; let sid = 's' + n; while (d.screens.some(s => s.id === sid)) sid += 'x';
        const ns = { id: sid, name: 'Screen ' + n, bg: scr.bg, widgets: [Object.assign(newWidget('header', t), { id: freshId('header'), text: 'Screen ' + n })] };
        d.screens.push(ns); d.cur = d.screens.length - 1; gui.sel = null;
        if (gui.mode === 'try') logEv('show screen ' + ns.name);
        changed(true); return;
      }
      if (id === 'delscr') {
        if (d.screens.length < 2) { ui.toast('A GUI needs at least one screen'); return; }
        pushUndo();
        const gone = d.screens.splice(d.cur, 1)[0];
        for (const x of allWidgets()) if (x.action === 'goto' && x.screen === gone.id) x.action = 'none';
        d.cur = Math.max(0, d.cur - 1); gui.sel = null;
        ui.toast('Deleted the screen “' + gone.name + '” — Undo brings it back');
        changed(true); return;
      }
      if (id === 'example') { pushUndo(); gui.designs[gui.target] = defaultDesign(gui.target); gui.sel = null; gui.live = {}; gui.demo = makeDemo(); ui.toast('The example is back — Undo brings your design back'); changed(true); return; }
      if (!w) { ui.toast('Select a widget first: click it on the screen'); return; }
      const i = scr.widgets.indexOf(w);
      if (id === 'front') { if (i >= scr.widgets.length - 1) return; pushUndo(); scr.widgets.splice(i, 1); scr.widgets.splice(i + 1, 0, w); }
      else if (id === 'back') { if (i <= 0) return; pushUndo(); scr.widgets.splice(i, 1); scr.widgets.splice(i - 1, 0, w); }
      else if (id === 'dup') {
        if (w.type === 'header') { ui.toast('A screen has one header'); return; }
        pushUndo();
        const c = JSON.parse(JSON.stringify(w)), b = wbox(w, t);
        c.id = uniqueId(w.id); c.x = clamp(w.x + 8, 0, Math.max(0, t.w - b.w)); c.y = clamp(w.y + 8, 0, Math.max(0, t.h - b.h));
        scr.widgets.splice(i + 1, 0, c); gui.sel = c.id;
      } else if (id === 'del') {
        pushUndo();
        scr.widgets.splice(i, 1);
        for (const x of allWidgets()) if (x.action === 'step' && x.target === w.id) x.action = 'none';
        gui.demo.forget(w.id); gui.sel = null;
      } else return;
      changed(true);
    }
    function addWidget(type) {
      const t = tg(), scr = curScreen();
      if (gui.mode !== 'design') setMode('design');
      if (type === 'header') { const ex = scr.widgets.find(x => x.type === 'header'); if (ex) { gui.sel = ex.id; ui.toast('This screen already has a header: it is selected'); syncProps(); gui.dirty = true; loop.once(); return; } }
      pushUndo();
      const w = newWidget(type, t);
      w.id = freshId(type);
      if (w.type === 'label') w.text = 'Label ' + w.id.replace(/\D/g, '');
      const b = wbox(w, t);
      let x = snapG((t.w - b.w) / 2), y = snapG((t.h - b.h) / 2), n = 0;
      while (n++ < 12 && scr.widgets.some(o => o.type === type && o.x === x && o.y === y)) { x += gridOf(t) * 2; y += gridOf(t) * 2; }
      w.x = type === 'header' ? 0 : clamp(x, 0, Math.max(0, t.w - b.w)); w.y = type === 'header' ? 0 : clamp(y, 0, Math.max(0, t.h - b.h));
      if (type === 'header') scr.widgets.unshift(w); else scr.widgets.push(w);
      gui.sel = w.id;
      changed(true);
    }
    function startTry() { gui.live = {}; gui.pressed = null; gui.t0 = now(); gui.log = []; logEv('Try it on screen “' + curScreen().name + '”: click the widgets'); }
    function setMode(m) {
      gui.mode = m === 'try' ? 'try' : 'design';
      topCtl.set('mode', gui.mode);
      designEl.style.display = gui.mode === 'design' ? '' : 'none';
      tryEl.style.display = gui.mode === 'try' ? '' : 'none';
      gui.pressed = null; gui.hover = null;
      if (gui.mode === 'try') {
        startTry();
        tryHint.innerHTML = tg().depth === 1 ? 'An OLED has no touch layer: here a click stands in for a press. The program below steps through the screens with the BOOT button instead.'
          : 'Press and release a button for <b>CLICKED</b>; hold it for <b>LONG_PRESSED</b>; slide off before letting go and there is no click. Every line is what the generated program prints on the serial monitor.';
      }
      syncScreens(); gui.dirty = true; loop.once();
    }
    function changed(now_, keepProps) {
      persist(); syncScreens(); if (!keepProps) syncProps(); updateUnder();
      gui.dirty = true; loop.once();
      clearTimeout(codeT);
      if (now_) regen(); else codeT = setTimeout(regen, 350);
    }
    /* a property typed into a field: everything but the panel itself */
    function touched() { persist(); syncScreens(); updateUnder(); gui.dirty = true; loop.once(); clearTimeout(codeT); codeT = setTimeout(regen, 400); }
    function regen() { code(codeEl, genGui(design(), tg())); }
    function syncScreens() {
      const d = design();
      scrsEl.innerHTML = '<span class="small muted">Screens</span>' + d.screens.map((s, i) => '<button class="chip dl-scr' + (i === d.cur ? ' on' : '') + '" data-scr="' + i + '">' + esc(s.name) + ' <small>' + s.widgets.length + '</small></button>').join('');
    }
    scrsEl.addEventListener('click', e => {
      const b = e.target.closest('[data-scr]');
      if (!b) return;
      const d = design(), i = +b.dataset.scr;
      if (i === d.cur || !d.screens[i]) return;
      d.cur = i; gui.sel = null; gui.pressed = null;
      if (gui.mode === 'try') logEv('show screen ' + d.screens[i].name);
      syncScreens(); syncProps(); gui.dirty = true; loop.once();
    });
    function refreshLog() { logEl.textContent = gui.log.map(l => l.text).join('\n'); logEl.scrollTop = 1e6; }
    gui.onLog = refreshLog;
    ui.onLeave(() => { if (gui.onLog === refreshLog) gui.onLog = null; });

    /* ---- the picture */
    function draw() {
      const t = tg(), fb = fbFor(t), scr = curScreen(), c = st.begin(), Cc = kit.colors(), tryOn = gui.mode === 'try';
      const pr = tryOn && gui.pressed ? gui.pressed : {};
      const th = paintScreen(fb, scr, t, tryOn ? gui.live : null, gui.demo, { pressed: pr.id, pressRow: pr.row, active: pr.id });
      L = fit(st.W, st.H, t.w, t.h, 20);
      G.draw(c, fb, L.ox, L.oy, L.s, { style: t.depth === 1 ? 'oled' : 'tft' });
      S().text(c, t.w + ' × ' + t.h + ' pixels · “' + scr.name + '”' + (L.s !== 1 ? ' · drawn ' + L.s + '× larger' : '') + (tryOn ? ' · trying it' : ''), st.W / 2, L.oy + t.h * L.s + 17, { size: 12, color: Cc.muted });
      if (!tryOn) overlay(c, t, scr, th, Cc);
      else if (gui.touchPt) { c.save(); c.strokeStyle = Cc.accent; c.lineWidth = 2; c.globalAlpha = 0.8; c.beginPath(); c.arc(L.ox + gui.touchPt.x * L.s, L.oy + gui.touchPt.y * L.s, 14, 0, Math.PI * 2); c.stroke(); c.restore(); }
    }
    function overlay(c, t, scr, th, Cc) {
      const s = L.s, X = x => L.ox + x * s, Y = y => L.oy + y * s, gs = t.depth === 1 ? 8 : 16;
      if (gs * s >= 12) {
        c.save(); c.fillStyle = th.light ? 'rgba(0,0,0,.2)' : 'rgba(255,255,255,.17)';
        for (let y = gs; y < t.h; y += gs) for (let x = gs; x < t.w; x += gs) c.fillRect(X(x) - 0.75, Y(y) - 0.75, 1.5, 1.5);
        c.restore();
      }
      const hv = gui.hover && gui.hover !== gui.sel && scr.widgets.find(w => w.id === gui.hover);
      if (hv) { const b = wbox(hv, t); c.save(); c.strokeStyle = Cc.accent; c.globalAlpha = 0.65; c.lineWidth = 1; c.strokeRect(X(b.x) - 1.5, Y(b.y) - 1.5, b.w * s + 3, b.h * s + 3); c.restore(); }
      const w = selW();
      if (!w) return;
      const b = wbox(w, t), hp = handlePos(w, t);
      c.save(); c.strokeStyle = Cc.accent; c.lineWidth = 2; c.setLineDash([5, 3]); c.strokeRect(X(b.x) - 2, Y(b.y) - 2, b.w * s + 4, b.h * s + 4); c.setLineDash([]);
      if (hp) { c.fillStyle = Cc.accent; c.fillRect(hp.x - 5, hp.y - 5, 10, 10); c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.strokeRect(hp.x - 5, hp.y - 5, 10, 10); }
      c.restore();
      const tag = w.id + '  x ' + b.x + ' y ' + b.y + (WT[w.type].resize ? '  ' + b.w + ' × ' + b.h : '');
      const ty = Y(b.y) - 13 > 8 ? Y(b.y) - 13 : Y(b.y + b.h) + 13;
      S().text(c, tag, Math.max(6, X(b.x)), ty, { size: 11, align: 'left', color: '#fff', bg: Cc.accent, mono: true });
    }
    const loop = kit.loop(dt => {
      let need = dt === 0 || gui.dirty;
      if (gui.demo.step(dt, allWidgets())) need = true;
      gui.acc += dt;
      if (gui.acc > 0.1) { gui.acc = 0; if (curScreen().widgets.some(w => w.bind && w.bind !== 'none')) need = true; }
      if (gui.pressed && gui.mode === 'try') checkLong();
      if (!need) return;
      gui.dirty = false;
      draw();
    }, stageEl);

    /* ---- the pointer: design (select, move, resize) and Try it (touch) */
    kit.drag(st, {
      hit(p) {
        const q = toP(p), t = tg();
        if (gui.mode === 'try') { const w = hitW(q); return { kind: 'touch', w, q, row: w && w.type === 'list' ? Math.floor((q.y - w.y) / rowH(w, t.depth === 1)) : -1 }; }
        const w0 = selW();
        if (onHandle(p, w0, t)) return { kind: 'resize', w: w0 };
        const w = hitW(q);
        if (!w) return { kind: 'empty' };
        return { kind: w.type === 'header' ? 'pick' : 'move', w, dx: q.x - w.x, dy: q.y - w.y };
      },
      start(d) {
        if (d.kind === 'touch') { touchStart(d); return; }
        d.snap = snapshot();
        const old = gui.sel;
        gui.sel = d.w ? d.w.id : null;
        if (old !== gui.sel) syncProps();
        gui.dirty = true; loop.once();
      },
      move(d, p) {
        const q = toP(p), t = tg(), w = d.w;
        if (d.kind === 'touch') { touchMove(d, q); return; }
        if (!w || (d.kind !== 'move' && d.kind !== 'resize')) return;
        const b = wbox(w, t), mn = t.depth === 1 ? 4 : 8;
        if (d.kind === 'move') { w.x = clamp(snapG(q.x - d.dx), 0, Math.max(0, t.w - b.w)); w.y = clamp(snapG(q.y - d.dy), 0, Math.max(0, t.h - b.h)); }
        else {
          const r = WT[w.type].resize;
          if (r === 'sq') { const sz = clamp(snapG(Math.max(q.x - w.x, q.y - w.y)), t.depth === 1 ? 12 : 24, Math.max(12, Math.min(t.w - w.x, t.h - w.y))); w.w = w.h = sz; }
          if (r === 'wh' || r === 'w') w.w = clamp(snapG(q.x - w.x), mn, Math.max(mn, t.w - w.x));
          if (r === 'wh') w.h = clamp(snapG(q.y - w.y), mn, Math.max(mn, t.h - w.y));
          if (r === 'h') w.h = clamp(snapG(q.y), mn, Math.max(mn, Math.round(t.h / 2)));
        }
        d.moved = true; gui.dirty = true; loop.once();
      },
      end(d, p) {
        if (d.kind === 'touch') { touchEnd(d, p ? toP(p) : d.q); return; }
        if (d.moved && d.snap && d.snap !== snapshot()) { pushUndo(d.snap); changed(true); }
      }
    });
    st.canvas.addEventListener('pointermove', e => {
      const p = st.pos(e), t = tg(), w = hitW(toP(p)), w0 = selW();
      let cur = '';
      if (gui.mode === 'design') { const r = w0 && WT[w0.type].resize; cur = onHandle(p, w0, t) ? (r === 'w' ? 'ew-resize' : r === 'h' ? 'ns-resize' : 'nwse-resize') : w ? (w.type === 'header' ? 'pointer' : 'move') : ''; }
      else cur = w && isTouchable(w) ? 'pointer' : '';
      st.canvas.style.cursor = cur;
      const id = w ? w.id : null;
      if (id !== gui.hover) { gui.hover = id; if (gui.mode === 'design') { gui.dirty = true; loop.once(); } }
    });
    st.canvas.addEventListener('pointerleave', () => { if (gui.hover) { gui.hover = null; gui.dirty = true; loop.once(); } });

    function inBox(w, q, row) {
      const t = tg(), b = wbox(w, t);
      if (!(q.x >= b.x && q.y >= b.y && q.x < b.x + b.w && q.y < b.y + b.h)) return false;
      return w.type !== 'list' || row == null || Math.floor((q.y - w.y) / rowH(w, t.depth === 1)) === row;
    }
    function touchStart(d) {
      gui.touchPt = d.q;
      const w = d.w;
      gui.pressed = w && isTouchable(w) ? { id: w.id, row: d.row, t: now(), lost: false, long: false } : null;
      if (w && w.type === 'button') logEv('button ' + w.id + ' PRESSED');
      if (w && w.type === 'slider') slideTo(w, d.q);
      gui.dirty = true; loop.once();
    }
    function touchMove(d, q) {
      gui.touchPt = q;
      const w = d.w, pr = gui.pressed;
      if (w && pr) {
        if (w.type === 'slider') slideTo(w, q);
        else if (!pr.lost && !inBox(w, q, w.type === 'list' ? pr.row : null)) { pr.lost = true; logEv(w.type + ' ' + w.id + ' PRESS_LOST — the finger slid off: no click'); }
      }
      gui.dirty = true; loop.once();
    }
    function touchEnd(d, q) {
      const w = d.w, pr = gui.pressed;
      gui.pressed = null; gui.touchPt = null;
      if (w && pr && !pr.lost && w.type !== 'slider' && inBox(w, q, w.type === 'list' ? pr.row : null)) {
        const Lv = gui.live[w.id] || (gui.live[w.id] = {});
        if (w.type === 'button') { logEv('button ' + w.id + ' CLICKED'); runAction(w); }
        else if (w.type === 'switch' || w.type === 'checkbox') {
          const v = !(Lv.checked != null ? Lv.checked : !!w.checked);
          Lv.checked = v;
          logEv(w.type + ' ' + w.id + ' VALUE ' + (w.type === 'switch' ? (v ? 'ON' : 'OFF') : (v ? 'checked' : 'unchecked')));
        } else if (w.type === 'list') { const items = listItems(w); if (pr.row >= 0 && pr.row < items.length) { Lv.sel = pr.row; logEv('list ' + w.id + ' CLICKED ' + items[pr.row]); } }
      }
      gui.dirty = true; loop.once();
    }
    function slideTo(w, q) {
      const r = clamp(w.h >> 1, tg().depth === 1 ? 3 : 4, 12), x0 = w.x + r, x1 = w.x + w.w - 1 - r, lo = num(w.min, 0), hi = num(w.max, 100);
      const v = Math.round(lo + (x1 > x0 ? clamp((q.x - x0) / (x1 - x0), 0, 1) : 0) * (hi - lo));
      const Lv = gui.live[w.id] || (gui.live[w.id] = {});
      if (Lv.value !== v) { Lv.value = v; logEv('slider ' + w.id + ' VALUE ' + v, 'v:' + w.id); }
    }
    function checkLong() {
      const pr = gui.pressed, w = pr && findW(pr.id);
      if (w && w.type === 'button' && !pr.long && !pr.lost && now() - pr.t >= 400) { pr.long = true; logEv('button ' + w.id + ' LONG_PRESSED — held for 0.4 s'); gui.dirty = true; }
    }
    function runAction(w) {
      const d = design();
      if (w.action === 'goto') { const i = d.screens.findIndex(s => s.id === w.screen); if (i >= 0 && i !== d.cur) { d.cur = i; logEv('show screen ' + d.screens[i].name); syncScreens(); } }
      else if (w.action === 'step') { const tw = findW(w.target); if (tw) stepLive(tw, num(w.by, 1)); }
    }
    function stepLive(tw, by) {
      const Lv = gui.live[tw.id] || (gui.live[tw.id] = {});
      if (tw.type === 'label') {
        const p = numIn(Lv.text != null ? Lv.text : tw.text);
        if (!p) return;
        const v = clamp(p.num + by, Math.min(num(tw.min, -1e9), num(tw.max, 1e9)), Math.max(num(tw.min, -1e9), num(tw.max, 1e9)));
        Lv.text = textWith(tw.text, v); logEv('label ' + tw.id + ' TEXT ' + Lv.text);
      } else if (NUMERIC.includes(tw.type)) {
        const v = clamp(Math.round((Lv.value != null ? Lv.value : num(tw.value, 0)) + by), num(tw.min, 0), num(tw.max, 100));
        Lv.value = v; logEv(tw.type + ' ' + tw.id + ' VALUE ' + v);
      }
    }

    /* ---- keys: Delete, arrows, Ctrl+Z / Ctrl+Y, Ctrl+D (not while typing in a field) */
    const onKey = e => {
      if (gui.mode !== 'design' || !body.isConnected) return;
      const tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target && e.target.isContentEditable)) return;
      const ctrl = e.ctrlKey || e.metaKey, k = e.key;
      if (ctrl && (k === 'z' || k === 'Z')) { e.preventDefault(); onEdit(e.shiftKey ? 'redo' : 'undo'); return; }
      if (ctrl && (k === 'y' || k === 'Y')) { e.preventDefault(); onEdit('redo'); return; }
      const w = selW();
      if (!w) return;
      if (ctrl && (k === 'd' || k === 'D')) { e.preventDefault(); onEdit('dup'); return; }
      if (k === 'Delete' || k === 'Backspace') { e.preventDefault(); onEdit('del'); return; }
      const mv = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k];
      if (mv && w.type !== 'header') {
        e.preventDefault();
        const t = tg(), b = wbox(w, t), stp = e.shiftKey ? 1 : gridOf(t);
        pushUndo();
        w.x = clamp(w.x + mv[0] * stp, 0, Math.max(0, t.w - b.w)); w.y = clamp(w.y + mv[1] * stp, 0, Math.max(0, t.h - b.h));
        changed(true);
      }
    };
    document.addEventListener('keydown', onKey);
    ui.onLeave(() => document.removeEventListener('keydown', onKey));

    /* ---- what the design costs: touch targets, memory, frame rate */
    function updateUnder() {
      const t = tg(), inch = inchOf(t), mono = t.depth === 1, mm = px => G.pxToMm(px, t.w, t.h, inch);
      const rows = [];
      if (!mono) for (const scr of design().screens) for (const w of scr.widgets) {
        if (!isTouchable(w)) continue;
        const b = wbox(w, t);
        let hp = b.h;
        if (w.type === 'list') hp = rowH(w, false);
        if (w.type === 'slider') hp = Math.max(b.h, 2 * clamp(w.h >> 1, 4, 12));
        rows.push({ w, scr, wmm: mm(b.w), hmm: mm(hp), m: Math.min(mm(b.w), mm(hp)) });
      }
      rows.sort((a, b) => a.m - b.m);
      const bad = rows.filter(r => r.m < 7), small = rows[0];
      const fb = G.frameBytes(t.w, t.h, t.depth), part = t.w * 24 * 2;
      const fps40 = G.busFps(t.w, t.h, mono ? 1 : 16, 40e6), fps80 = G.busFps(t.w, t.h, 16, 80e6), i2c = G.i2cFps(t.w, t.h, 400e3);
      const fact = (k, v, sub) => '<div><span>' + k + '</span><b>' + v + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div>';
      under.innerHTML = '<div class="dl-facts">' +
        fact('Panel', t.w + ' × ' + t.h + ' at ' + inch + '″', f(G.ppi(t.w, t.h, inch), 0) + ' pixels per inch: one pixel is ' + f(mm(1), 2) + ' mm') +
        (mono ? fact('Touch', 'none', 'an OLED is driven with buttons or a rotary encoder; the widgets here are drawn, not touched')
          : fact('Smallest touch target', small ? f(small.wmm, 1) + ' × ' + f(small.hmm, 1) + ' mm' : '—', small ? esc(small.w.id) + ' on “' + esc(small.scr.name) + '”; aim for about 7 mm or more — a fingertip is 8–10 mm wide' : 'no touchable widget yet')) +
        fact('Frame buffer', bytes(fb), mono ? 'the whole frame lives in RAM and is sent at once' : 'too big for many boards without PSRAM, so LVGL draws in a partial buffer: 24 lines = ' + bytes(part)) +
        fact('Full-screen redraw', mono ? f(i2c, 0) + ' per second' : f(fps40, 1) + ' per second', mono ? 'over I2C at 400 kHz (' + f(G.i2cFps(t.w, t.h, 1e6), 0) + ' at 1 MHz, if the module copes)' : 'over SPI at 40 MHz (' + f(fps80, 1) + ' at 80 MHz); LVGL redraws only the parts that change') +
        '</div>' +
        (bad.length ? '<div class="callout co-warn dl-warn"><div class="co-h">Small touch targets</div><ul>' + bad.slice(0, 6).map(r => '<li><b>' + esc(r.w.id) + '</b> (' + esc(r.scr.name) + ') is ' + f(r.wmm, 1) + ' × ' + f(r.hmm, 1) + ' mm on this ' + inch + '″ panel — make it larger or leave space around it.</li>').join('') + '</ul></div>' : '');
    }

    /* ---- start */
    syncScreens();
    propsUi(propsEl, { tg, changed, touched, onEdit });
    function syncProps() { if (propsEl._dlSync) propsEl._dlSync(); }
    updateUnder();
    st.onResize(() => { gui.dirty = true; loop.once(); });
    onTheme(() => { gui.dirty = true; loop.once(); });
    setMode(gui.mode);
    regen();
    loop.start();
  }

  /* ---------------------------------------------------------------- the property panel: the selected widget, or the screen */
  const SIZES = [[1, '1 — 8 px high'], [2, '2 — 16 px'], [3, '3 — 24 px'], [4, '4 — 32 px']];
  function propsUi(el, api) {
    let editSnap = null;
    const fld = (label, inner, cls) => '<label class="dl-f' + (cls ? ' ' + cls : '') + '"><span>' + label + '</span>' + inner + '</label>';
    const inp = (k, v, type, extra) => '<input class="inp" data-f="' + k + '" type="' + (type || 'text') + '" value="' + esc(String(v == null ? '' : v)) + '"' + (extra || '') + '>';
    const sel = (k, v, opts, attr) => '<select class="inp" ' + (attr || 'data-f') + '="' + k + '">' + opts.map(([val, txt]) => '<option value="' + esc(String(val)) + '"' + (String(val) === String(v) ? ' selected' : '') + '>' + esc(txt) + '</option>').join('') + '</select>';
    const stepTargets = () => allWidgets().filter(x => (x.type === 'label' && numIn(x.text)) || NUMERIC.includes(x.type));
    function swatches(attr, cur, keys, th) {
      return '<div class="dl-sw">' + keys.map(k => {
        const c = attr === 'data-bg' ? BGS[k] : colOf(k, th);
        return '<button type="button" ' + attr + '="' + k + '" class="' + (k === cur ? 'on' : '') + '" title="' + (k === 'auto' ? 'the screen\'s text colour' : k === 'panel' ? 'a shade of the background' : k) + '" style="--c:' + G.css(c) + '">' + (k === 'auto' ? 'A' : k === 'panel' ? 'P' : '') + '</button>';
      }).join('') + '</div>';
    }
    function render() {
      const w = selW(), t = api.tg(), mono = t.depth === 1, scr = curScreen(), d = design(), th = themeOf(scr, t);
      if (!w) {
        const into = allWidgets().filter(x => x.action === 'goto' && x.screen === scr.id).map(x => esc(x.id));
        el.innerHTML = box('Screen “' + esc(scr.name) + '”', '<div class="dl-fields">' +
          '<label class="dl-f wide"><span>Name</span><input class="inp" data-sf="name" type="text" value="' + esc(scr.name) + '" maxlength="24"></label>' +
          (mono ? '' : '<div class="dl-f wide"><span>Background</span>' + swatches('data-bg', scr.bg, Object.keys(BGS), th) + '</div>') + '</div>' +
          '<p class="small muted" style="margin:8px 0 0">' + scr.widgets.length + ' widget' + (scr.widgets.length === 1 ? '' : 's') + ' on this screen, screen ' + (d.cur + 1) + ' of ' + d.screens.length + '. ' +
          (into.length ? 'Reached from: ' + into.join(', ') + '. ' : d.cur ? 'No button leads here yet: give one the action “Go to screen ' + esc(scr.name) + '”. ' : '') +
          'Click a widget to edit it; click an empty part of the screen to come back here.</p>');
        return;
      }
      const ty = w.type, rz = WT[ty].resize, f2 = [];
      f2.push(fld('Name in the program', inp('id', w.id, 'text', ' maxlength="24" spellcheck="false"'), 'wide'));
      if (ty === 'list') f2.push(fld('Items, one per line', '<textarea class="inp" data-f="items" rows="4">' + esc(w.items || '') + '</textarea>', 'wide'));
      else if (['label', 'button', 'checkbox', 'header', 'gauge'].includes(ty)) f2.push(fld(ty === 'gauge' ? 'Caption' : 'Text', inp('text', ty === 'gauge' ? w.text : w.text, 'text', ' maxlength="60"'), 'wide'));
      if (['label', 'button', 'checkbox', 'header', 'list'].includes(ty)) f2.push(fld('Text size', sel('size', w.size, SIZES)));
      if (ty === 'icon') { f2.push(fld('Icon', sel('icon', w.icon, ICONS.map(n => [n, n])))); f2.push(fld('Scale', sel('size', w.size, [[1, '1×'], [2, '2×'], [3, '3×']]))); }
      if (ty !== 'header') { f2.push(fld('x', inp('x', w.x, 'number', ' min="0" max="' + t.w + '"'))); f2.push(fld('y', inp('y', w.y, 'number', ' min="0" max="' + t.h + '"'))); }
      if (rz === 'wh' || rz === 'w') f2.push(fld('Width', inp('w', w.w, 'number', ' min="4" max="' + t.w + '"')));
      if (rz === 'wh' || rz === 'h') f2.push(fld('Height', inp('h', w.h, 'number', ' min="4" max="' + t.h + '"')));
      if (rz === 'sq') f2.push(fld('Size', inp('w', w.w, 'number', ' min="12" max="' + t.h + '"')));
      if (NUMERIC.includes(ty)) f2.push(fld('Value', inp('value', w.value, 'number')));
      if (NUMERIC.includes(ty) || ty === 'chart' || ty === 'label') { f2.push(fld('Min', inp('min', w.min, 'number'))); f2.push(fld('Max', inp('max', w.max, 'number'))); }
      if (ty === 'switch' || ty === 'checkbox') f2.push('<label class="dl-f wide dl-chk"><input type="checkbox" data-f="checked"' + (w.checked ? ' checked' : '') + '> ' + (ty === 'switch' ? 'On at the start' : 'Ticked at the start') + '</label>');
      if (ty === 'list') f2.push(fld('Selected', sel('sel', w.sel, listItems(w).map((s, i) => [i, s]))));
      if (BINDABLE.includes(ty)) f2.push(fld('Demo data', sel('bind', w.bind || 'none', BINDS), 'wide'));
      if (ty === 'button') {
        const act = w.action === 'goto' ? 'goto:' + w.screen : w.action || 'none';
        f2.push(fld('When clicked', sel('action', act, [['none', 'Only report CLICKED']].concat(d.screens.map(s => ['goto:' + s.id, 'Go to screen “' + s.name + '”']), [['step', 'Change a number by a step']])), 'wide'));
        if (w.action === 'step') {
          const ts = stepTargets();
          f2.push(fld('Number in', ts.length ? sel('target', w.target, ts.map(x => [x.id, x.id + (x.type === 'label' ? ' (' + x.text + ')' : ' (' + x.type + ')')])) : '<span class="small muted">no label with a number, slider, bar or gauge yet</span>', 'wide'));
          f2.push(fld('Step', inp('by', w.by, 'number', ' step="any"')));
        }
      }
      if (!mono) f2.push('<div class="dl-f wide"><span>Colour</span>' + swatches('data-col', w.color || 'auto', Object.keys(PAL).filter(k => k !== 'panel' || ty === 'header'), th) + '</div>');
      const hint = { label: 'A label with a number in its text (21.5°C) can be stepped by a button or fed with demo data; the program formats the number the same way.', button: 'Give a button an action and try it: it can lead to another screen or change a number.',
        slider: 'Sends VALUE_CHANGED while the finger moves.', switch: 'A switch is a checkbox in another shape: both report VALUE_CHANGED.', gauge: 'Drawn as an LVGL arc without its knob, so it shows and does not take touches.',
        chart: 'The demo adds a point twice a second and keeps the last 30.', list: 'Each item is a button of the list in LVGL.', header: 'A coloured strip across the top. Its height is set with the handle.', icon: 'LVGL draws icons from its symbol font; the program uses the nearest symbol.', bar: 'A bar shows a value and takes no touches.', checkbox: 'The text is part of the touch target, as in LVGL.' }[ty];
      el.innerHTML = box(WT[ty].name + ' <span class="faint" style="font-weight:400;font-family:var(--font-mono);font-size:13px">' + esc(w.id) + '</span>', '<div class="dl-fields">' + f2.join('') + '</div>' + (hint ? '<p class="small muted" style="margin:8px 0 0">' + hint + '</p>' : ''));
    }
    el._dlSync = render;

    /* apply one field; returns true when the panel must be rebuilt */
    function apply(inpEl, final) {
      const w = selW(), t = api.tg(), k = inpEl.dataset.f, v = inpEl.value;
      if (!w || !k) return false;
      const b = wbox(w, t);
      switch (k) {
        case 'id': {
          if (!final) return false;
          const nid = uniqueId(v || WT[w.type].pre, w);
          if (nid !== w.id) { for (const x of allWidgets()) if (x.target === w.id) x.target = nid; gui.demo.forget(w.id); if (gui.sel === w.id) gui.sel = nid; w.id = nid; }
          return true;
        }
        case 'text': w.text = String(v).slice(0, 60); return false;
        case 'items': w.items = String(v).slice(0, 200); if ((w.sel | 0) >= listItems(w).length) w.sel = 0; return final;
        case 'size': w.size = clamp(int(v, 1), 1, 4); return false;
        case 'x': w.x = clamp(int(v, w.x), 0, Math.max(0, t.w - b.w)); break;
        case 'y': w.y = clamp(int(v, w.y), 0, Math.max(0, t.h - b.h)); break;
        case 'w': w.w = clamp(int(v, w.w), w.type === 'gauge' ? 12 : 4, Math.max(4, w.type === 'gauge' ? Math.min(t.w - w.x, t.h - w.y) : t.w - w.x)); if (w.type === 'gauge') w.h = w.w; break;
        case 'h': w.h = clamp(int(v, w.h), 4, Math.max(4, w.type === 'header' ? Math.round(t.h / 2) : t.h - w.y)); break;
        case 'min': case 'max': case 'value': w[k] = num(v, w[k]); break;
        case 'by': w.by = num(v, 1); break;
        case 'checked': w.checked = !!inpEl.checked; return false;
        case 'sel': w.sel = int(v, 0); return false;
        case 'icon': w.icon = ICONS.includes(v) ? v : ICONS[0]; return false;
        case 'bind': w.bind = BINDS.some(x => x[0] === v) ? v : 'none'; gui.demo.forget(w.id); return true;
        case 'target': w.target = v; return false;
        case 'action':
          if (v.indexOf('goto:') === 0) { w.action = 'goto'; w.screen = v.slice(5); }
          else { w.action = v === 'step' ? 'step' : 'none'; if (w.action === 'step') { if (!findW(w.target)) w.target = (stepTargets()[0] || {}).id || ''; if (w.by == null) w.by = 1; } }
          return true;
        default: return false;
      }
      if (final) inpEl.value = String(w[k]);
      return false;
    }
    const commit = rebuild => { if (editSnap && editSnap !== snapshot()) pushUndo(editSnap); editSnap = null; api.changed(true, !rebuild); };
    el.addEventListener('focusin', e => { if (e.target.dataset && (e.target.dataset.f || e.target.dataset.sf)) editSnap = snapshot(); });
    el.addEventListener('input', e => {
      const x = e.target;
      if (x.dataset.sf === 'name') { curScreen().name = String(x.value).slice(0, 24) || 'Screen'; api.touched(); return; }
      if (x.dataset.f && x.tagName !== 'SELECT' && x.type !== 'checkbox') { apply(x, false); api.touched(); }
    });
    el.addEventListener('change', e => {
      const x = e.target;
      if (!editSnap) editSnap = snapshot();
      if (x.dataset.sf === 'name') { curScreen().name = String(x.value).trim().slice(0, 24) || 'Screen'; commit(false); return; }
      if (x.dataset.f) commit(apply(x, true));
    });
    el.addEventListener('click', e => {
      const c = e.target.closest('[data-col],[data-bg]');
      if (!c) return;
      pushUndo();
      if (c.dataset.bg) curScreen().bg = BGS[c.dataset.bg] != null ? c.dataset.bg : 'dark';
      else { const w = selW(); if (w) w.color = c.dataset.col in PAL ? c.dataset.col : 'auto'; }
      api.changed(true);
    });
    render();
  }

  /* ================================================================ the GUI designer: the program
     LVGL 9 names checked against HYPER-ESP32/API-CRIB.md (TASK 29) and the LVGL 9 widget headers; nothing from LVGL 8. */
  const LV_SYM = { wifi: 'WIFI', wifi0: 'WIFI', bt: 'BLUETOOTH', battery: 'BATTERY_FULL', warn: 'WARNING', bell: 'BELL', up: 'UP', down: 'DOWN', play: 'PLAY', pause: 'PAUSE', home: 'HOME', gear: 'SETTINGS' };
  const LV_FONT = { 2: 20, 3: 28, 4: 36 };
  const RESERVED = new Set(('setup loop tft display oled i2c spi buf draw_buf disp indev my_tick flush_cb touch_cb start_display show_number report_press text glyph round_rect ' +
    'int float char bool void static const if else for while return do switch case break default true false none and or not in is def class pass import from global lambda print ' +
    'min max abs round time math random framebuf last walk room sine lv pin screen screens button_pin t e w h x y i j s c n').split(' '));
  const fl = v => { const s = String(+num(v, 0).toFixed(4)); return /[.e]/.test(s) ? s : s + '.0'; };
  const plus = v => (num(v, 0) < 0 ? '- ' + fl(-num(v, 0)) : '+ ' + fl(v));
  const iv = v => String(Math.round(num(v, 0)));
  const fmtOf = text => { const p = numIn(text) || { pre: text ? text + ' ' : '', dec: 1, post: '' }; return p.pre.replace(/%/g, '%%') + '%.' + p.dec + 'f' + p.post.replace(/%/g, '%%'); };
  const blk = s => String(s == null ? '' : s).replace(/\[/g, '(').replace(/\]/g, ')').replace(/\/\//g, '/ /').replace(/\s+v$/, ' V') || ' ';
  const typeName = w => WT[w.type].name.toLowerCase();

  function guiCtx(d, tg) {
    const usedS = new Set(), names = {};
    const scrs = d.screens.map((s, i) => {
      const b = ident(s.name) === 'w' ? 'screen' + (i + 1) : ident(s.name);
      let k = b, n = 2; while (usedS.has(k)) k = b + '_' + n++; usedS.add(k);
      return { s, i, key: k, v: 'scr_' + k, fn: 'build_' + k, draw: 'draw_' + k };
    });
    const all = [];
    for (const sc of scrs) for (const w of sc.s.widgets) { all.push({ w, sc }); names[w.id] = RESERVED.has(w.id) || /^(scr|build|draw|walk)_/.test(w.id) ? w.id + '_w' : w.id; }
    const find = id => (all.find(a => a.w.id === id) || {}).w || null;
    const stepped = new Set(all.filter(a => a.w.type === 'button' && a.w.action === 'step' && find(a.w.target)).map(a => a.w.target));
    const bound = all.filter(a => BINDABLE.includes(a.w.type) && a.w.bind && a.w.bind !== 'none').map(a => a.w);
    return { d, tg, scrs, all, find, stepped, bound, nm: w => names[w.id] || w.id, th: sc => themeOf(sc.s, tg), scrOf: id => scrs.find(x => x.s.id === id) || null };
  }
  /* the demo value of a bound widget as an expression of the program (C++ and Python alike) */
  function demoExpr(c, w) {
    if (w.bind === 'room') return 'room';
    const lo = num(w.min, 0), hi = num(w.max, 100), src = w.bind === 'sine' ? 'sine' : 'walk_' + c.nm(w);
    return '(' + fl(lo) + ' + ' + fl(hi - lo) + ' * ' + src + ')';
  }
  const chartScaled = (w, e, lang) => { const lo = num(w.min, 0), span = num(w.max, 100) - lo || 1, x = '(' + e + ' - ' + fl(lo) + ') * 100 / ' + fl(span); return lang === 'py' ? 'int(min(100, max(0, ' + x + ')))' : '(int32_t)constrain(' + x + ', 0.0, 100.0)'; };
  /* thirty points of an unbound chart, in the chart's default range 0–100 */
  const chartPoints = w => { const lo = num(w.min, 0), span = num(w.max, 100) - lo || 1; return makeDemo().series(Object.assign({}, w, { bind: 'none' })).map(v => Math.round(clamp((v - lo) * 100 / span, 0, 100))); };
  const gaugeFont = w => { const r = Math.max(4, (w.w >> 1) - 1); return r >= 56 ? 3 : r >= 26 ? 2 : 1; };

  function genGui(d, tg) {
    const c = guiCtx(d, tg), mono = tg.depth === 1, disp = G.display(tg.disp);
    const title = (d.screens[0] && d.screens[0].widgets.find(w => w.type === 'header') || { text: 'My GUI' }).text + ' — ' + d.screens.length + ' screen' + (d.screens.length === 1 ? '' : 's') + ' for a ' + tg.w + ' × ' + tg.h + ' ' + (mono ? 'OLED' : 'display');
    if (mono) return {
      title, about: 'The design drawn with Adafruit GFX (C++) or MicroPython\'s built-in framebuf: every widget is a few drawing calls. An OLED has no touch, so the BOOT button steps from screen to screen; the demo values change twice a second.',
      needs: 'An ESP32 board and a 0.96″ SSD1306 OLED on I2C (address 0x3C).', wiring: [['GPIO21 (SDA)', 'OLED SDA'], ['GPIO22 (SCL)', 'OLED SCL'], ['3V3 / GND', 'OLED VCC / GND'], ['GPIO0', 'the BOOT button, already on the board']],
      libs: ['Adafruit SSD1306', 'Adafruit GFX Library'], blocks: oledBlocks(c), cpp: oledCpp(c), py: oledPy(c),
      notes: ['MicroPython: the ssd1306 driver is not in the firmware — install it once with mip.install("ssd1306").', 'Adafruit GFX draws the classic 5 × 7 font, exactly as the preview; framebuf\'s font is 8 × 8, so MicroPython text is a little wider.', 'An SH1106 module looks the same but needs its own driver (the picture shifts by two dots with the SSD1306 one).']
    };
    const touchNote = tg.touch === 'xpt2046' ? 'The touch is the XPT2046 resistive controller on the same SPI bus, read through TFT_eSPI: set TOUCH_CS in its setup file and run its Touch_calibrate example once.'
      : tg.touch === 'cap' ? 'The capacitive touch controller (an FT6336 or a GT911) needs its own library: read it in touch_cb, which the board section leaves for you to fill.'
      : 'Most 240 × 240 modules have no touch layer (touch versions use a CST816S controller with its own library): the GUI shows, but nothing presses it until touch_cb reads a controller.';
    return {
      title, about: 'The design as an LVGL 9 program: one function builds each screen, each touchable widget has a callback that prints what the Try it log shows, and the loop feeds the demo values. The board section at the top is the part to adapt.',
      needs: 'An ESP32 with a ' + (disp ? disp.name : tg.label) + (tg.id === 'ili9341' ? ' — the “Cheap Yellow Display” boards carry one with its touch controller' : '') + '. A board with PSRAM (ESP32-S3) is comfortable; a classic ESP32 works with the partial buffer.',
      libs: ['lvgl (version 9)', 'TFT_eSPI (Bodmer)'], blocks: lvBlocks(c), cpp: lvCpp(c), py: lvPy(c),
      notes: [touchNote, 'LVGL draws with its own fonts (Montserrat, 14 px by default), a little larger than the 5 × 7 font of the preview: leave some room around texts.', 'For the dark look of the preview set LV_THEME_DEFAULT_DARK to 1 in lv_conf.h.',
        'MicroPython: LVGL is not in the official firmware — it needs a build with the LVGL binding (lv_binding_micropython), whose drivers set up the display and the touch.']
    };
  }

  /* ---------------------------------------------------------------- LVGL 9, Arduino C++ */
  function lvCpp(c) {
    const { tg, nm } = c, fonts = new Set(), cbs = [], builds = [];
    const font = (obj, size, ind) => { const pt = LV_FONT[size]; if (!pt) return []; fonts.add(pt); return [(ind || '  ') + 'lv_obj_set_style_text_font(' + obj + ', &lv_font_montserrat_' + pt + ', 0);']; };
    const col = (obj, cname, th, part) => ['  lv_obj_set_style_bg_color(' + obj + ', lv_color_hex(' + hex6(colOf(cname, th)) + '), ' + (part || '0') + ');'];
    let needShow = false, needReport = false;
    const step = (tw, by) => {
      const n = nm(tw);
      if (tw.type === 'label') { needShow = true; const lo = Math.min(num(tw.min, 0), num(tw.max, 100)), hi = Math.max(num(tw.min, 0), num(tw.max, 100)); return ['  ' + n + '_v = constrain(' + n + '_v ' + plus(by) + ', ' + fl(lo) + ', ' + fl(hi) + ');', '  show_number(' + n + ', ' + cq(fmtOf(tw.text)) + ', ' + n + '_v);', '  Serial.printf("label ' + tw.id + ' TEXT %s\\n", lv_label_get_text(' + n + '));']; }
      const get = { slider: 'lv_slider_get_value', bar: 'lv_bar_get_value', gauge: 'lv_arc_get_value' }[tw.type];
      if (!get) return [];
      const set = tw.type === 'gauge' ? 'lv_arc_set_value(' + n + ', ' + get + '(' + n + ') + ' + iv(by) + ');' : 'lv_' + tw.type + '_set_value(' + n + ', ' + get + '(' + n + ') + ' + iv(by) + ', LV_ANIM_OFF);';
      const out = ['  ' + set];
      if (tw.type === 'gauge') { needShow = true; out.push('  show_number(' + n + '_val, "%.0f", (float)' + get + '(' + n + '));'); }
      out.push('  Serial.printf("' + tw.type + ' ' + tw.id + ' VALUE %d\\n", (int)' + get + '(' + n + '));');
      return out;
    };
    for (const { w } of c.all) {
      const n = nm(w);
      if (w.type === 'button') {
        const body = ['  Serial.println("button ' + w.id + ' CLICKED");'];
        if (w.action === 'goto') { const sc = c.scrOf(w.screen); if (sc) body.push('  lv_screen_load(' + sc.v + ');', '  Serial.println(' + cq('show screen ' + sc.s.name) + ');'); }
        if (w.action === 'step') { const tw = c.find(w.target); if (tw) body.push(...step(tw, num(w.by, 1))); }
        cbs.push('static void ' + n + '_clicked(lv_event_t *e) {', ...body, '}');
        needReport = true;
      } else if (w.type === 'slider') cbs.push('static void ' + n + '_changed(lv_event_t *e) {', '  Serial.printf("slider ' + w.id + ' VALUE %d\\n", (int)lv_slider_get_value(' + n + '));', '}');
      else if (w.type === 'switch' || w.type === 'checkbox') {
        const [a, b] = w.type === 'switch' ? ['ON', 'OFF'] : ['checked', 'unchecked'];
        cbs.push('static void ' + n + '_changed(lv_event_t *e) {', '  bool on = lv_obj_has_state(' + n + ', LV_STATE_CHECKED);', '  Serial.printf("' + w.type + ' ' + w.id + ' VALUE %s\\n", on ? "' + a + '" : "' + b + '");', '}');
      } else if (w.type === 'list') cbs.push('static void ' + n + '_clicked(lv_event_t *e) {', '  Serial.printf("list ' + w.id + ' CLICKED %s\\n", (const char *)lv_event_get_user_data(e));', '}');
    }
    for (const sc of c.scrs) {
      const th = c.th(sc), B = ['static void ' + sc.fn + '() {', '  ' + sc.v + ' = lv_obj_create(NULL);',
        '  lv_obj_set_style_bg_color(' + sc.v + ', lv_color_hex(' + hex6(th.bg) + '), 0);', '  lv_obj_set_style_text_color(' + sc.v + ', lv_color_hex(' + hex6(th.fg) + '), 0);', '  lv_obj_remove_flag(' + sc.v + ', LV_OBJ_FLAG_SCROLLABLE);'];
      for (const w of sc.s.widgets) {
        const n = nm(w), pos = '  lv_obj_set_pos(' + n + ', ' + w.x + ', ' + w.y + ');', size = (ww, hh) => '  lv_obj_set_size(' + n + ', ' + ww + ', ' + hh + ');';
        B.push('', '  // ' + typeName(w) + ' ' + w.id);
        switch (w.type) {
          case 'header': {
            const hc = colOf(w.color, th);
            B.push('  ' + n + ' = lv_obj_create(' + sc.v + ');', '  lv_obj_set_pos(' + n + ', 0, 0);', size(tg.w, w.h), '  lv_obj_set_style_radius(' + n + ', 0, 0);', '  lv_obj_set_style_border_width(' + n + ', 0, 0);',
              '  lv_obj_set_style_pad_all(' + n + ', 0, 0);', ...col(n, w.color, th), '  lv_obj_remove_flag(' + n + ', LV_OBJ_FLAG_SCROLLABLE);', '  {', '    lv_obj_t *t = lv_label_create(' + n + ');', '    lv_label_set_text(t, ' + cq(w.text || '') + ');', ...font('t', w.size, '    '),
              ...(w.color !== 'panel' ? ['    lv_obj_set_style_text_color(t, lv_color_hex(' + hex6(contrast(hc)) + '), 0);'] : []), '    lv_obj_align(t, LV_ALIGN_LEFT_MID, 6, 0);', '  }');
            break;
          }
          case 'label':
            B.push('  ' + n + ' = lv_label_create(' + sc.v + ');', pos, '  lv_label_set_text(' + n + ', ' + cq(w.text || '') + ');', ...font(n, w.size), ...(w.color !== 'auto' ? ['  lv_obj_set_style_text_color(' + n + ', lv_color_hex(' + hex6(colOf(w.color, th)) + '), 0);'] : []));
            break;
          case 'button': {
            const cc = colOf(w.color, th);
            B.push('  ' + n + ' = lv_button_create(' + sc.v + ');', pos, size(w.w, w.h), ...col(n, w.color, th), '  {', '    lv_obj_t *t = lv_label_create(' + n + ');', '    lv_label_set_text(t, ' + cq(w.text || '') + ');', ...font('t', w.size, '    '),
              ...(contrast(cc) !== 0xFFFFFF ? ['    lv_obj_set_style_text_color(t, lv_color_hex(' + hex6(contrast(cc)) + '), 0);'] : []), '    lv_obj_center(t);', '  }',
              '  lv_obj_add_event_cb(' + n + ', ' + n + '_clicked, LV_EVENT_CLICKED, nullptr);', ...['PRESSED', 'LONG_PRESSED', 'PRESS_LOST'].map(ev => '  lv_obj_add_event_cb(' + n + ', report_press, LV_EVENT_' + ev + ', (void *)"' + w.id + '");'));
            break;
          }
          case 'slider':
            B.push('  ' + n + ' = lv_slider_create(' + sc.v + ');', pos, size(w.w, w.h), '  lv_slider_set_range(' + n + ', ' + iv(w.min) + ', ' + iv(w.max) + ');', '  lv_slider_set_value(' + n + ', ' + iv(w.value) + ', LV_ANIM_OFF);',
              ...col(n, w.color, th, 'LV_PART_INDICATOR'), ...col(n, w.color, th, 'LV_PART_KNOB'), '  lv_obj_add_event_cb(' + n + ', ' + n + '_changed, LV_EVENT_VALUE_CHANGED, nullptr);');
            break;
          case 'switch':
            B.push('  ' + n + ' = lv_switch_create(' + sc.v + ');', pos, size(w.w, w.h), ...col(n, w.color, th, 'LV_PART_INDICATOR | LV_STATE_CHECKED'), ...(w.checked ? ['  lv_obj_add_state(' + n + ', LV_STATE_CHECKED);'] : []),
              '  lv_obj_add_event_cb(' + n + ', ' + n + '_changed, LV_EVENT_VALUE_CHANGED, nullptr);');
            break;
          case 'checkbox':
            B.push('  ' + n + ' = lv_checkbox_create(' + sc.v + ');', pos, '  lv_checkbox_set_text(' + n + ', ' + cq(w.text || '') + ');', ...font(n, w.size), ...col(n, w.color, th, 'LV_PART_INDICATOR | LV_STATE_CHECKED'),
              ...(w.checked ? ['  lv_obj_add_state(' + n + ', LV_STATE_CHECKED);'] : []), '  lv_obj_add_event_cb(' + n + ', ' + n + '_changed, LV_EVENT_VALUE_CHANGED, nullptr);');
            break;
          case 'bar':
            B.push('  ' + n + ' = lv_bar_create(' + sc.v + ');', pos, size(w.w, w.h), '  lv_bar_set_range(' + n + ', ' + iv(w.min) + ', ' + iv(w.max) + ');', '  lv_bar_set_value(' + n + ', ' + iv(w.value) + ', LV_ANIM_OFF);', ...col(n, w.color, th, 'LV_PART_INDICATOR'));
            break;
          case 'gauge':
            needShow = true;
            B.push('  ' + n + ' = lv_arc_create(' + sc.v + ');', pos, size(w.w, w.w), '  lv_arc_set_range(' + n + ', ' + iv(w.min) + ', ' + iv(w.max) + ');', '  lv_arc_set_value(' + n + ', ' + iv(w.value) + ');',
              '  lv_obj_set_style_arc_color(' + n + ', lv_color_hex(' + hex6(colOf(w.color, th)) + '), LV_PART_INDICATOR);', '  lv_obj_remove_style(' + n + ', NULL, LV_PART_KNOB);      // a gauge shows a value: no knob,', '  lv_obj_remove_flag(' + n + ', LV_OBJ_FLAG_CLICKABLE);  // and it takes no touch',
              '  ' + n + '_val = lv_label_create(' + n + ');', ...font(n + '_val', gaugeFont(w)), '  lv_obj_center(' + n + '_val);', '  show_number(' + n + '_val, "%.' + gaugeDec(w) + 'f", ' + fl(w.value) + ');',
              ...(w.text ? ['  {', '    lv_obj_t *t = lv_label_create(' + n + ');', '    lv_label_set_text(t, ' + cq(w.text) + ');', '    lv_obj_align(t, LV_ALIGN_CENTER, 0, ' + Math.round(((w.w >> 1) - 1) * 0.45) + ');', '  }'] : []));
            break;
          case 'chart':
            B.push('  ' + n + ' = lv_chart_create(' + sc.v + ');', pos, size(w.w, w.h), '  lv_chart_set_type(' + n + ', LV_CHART_TYPE_LINE);', '  lv_chart_set_point_count(' + n + ', 30);',
              '  ' + n + '_ser = lv_chart_add_series(' + n + ', lv_color_hex(' + hex6(colOf(w.color, th)) + '), LV_CHART_AXIS_PRIMARY_Y);');
            if (!w.bind || w.bind === 'none') B.push('  static const int32_t ' + n + '_pts[30] = { ' + chartPoints(w).join(', ') + ' };   // 0–100, the chart\'s default range', '  for (int i = 0; i < 30; i++) lv_chart_set_next_value(' + n + ', ' + n + '_ser, ' + n + '_pts[i]);');
            break;
          case 'icon':
            B.push('  ' + n + ' = lv_label_create(' + sc.v + ');', pos, LV_SYM[w.icon] ? '  lv_label_set_text(' + n + ', LV_SYMBOL_' + LV_SYM[w.icon] + ');' : '  lv_label_set_text(' + n + ', "?");   // LVGL has no "' + w.icon + '" symbol: draw it as an image (lv_image_create)',
              ...font(n, w.size), ...(w.color !== 'auto' ? ['  lv_obj_set_style_text_color(' + n + ', lv_color_hex(' + hex6(colOf(w.color, th)) + '), 0);'] : []));
            break;
          case 'list':
            B.push('  ' + n + ' = lv_list_create(' + sc.v + ');', pos, size(w.w, listItems(w).length * rowH(w, false)), ...listItems(w).map(it => '  lv_obj_add_event_cb(lv_list_add_button(' + n + ', NULL, ' + cq(it) + '), ' + n + '_clicked, LV_EVENT_CLICKED, (void *)' + cq(it) + ');'));
            break;
        }
      }
      B.push('}');
      builds.push(B.join('\n'));
    }
    // demo data in the loop
    const L = [];
    if (c.bound.length) {
      const uses = k => c.bound.some(w => w.bind === k);
      L.push('  static uint32_t last = 0;', '  if (millis() - last >= 500) {                  // the demo data, twice a second: put your sensor readings here', '    last = millis();', '    float t = millis() / 1000.0;');
      if (uses('room')) L.push('    float room = 21 + 1.5 * sin(t * 2 * PI / 40) + 0.25 * sin(t * 2 * PI / 7);   // a room temperature in °C');
      if (uses('sine')) L.push('    float sine = 0.5 + 0.5 * sin(t * 2 * PI / 20);    // 0 … 1, a slow wave');
      for (const w of c.bound) if (w.bind === 'walk') L.push('    walk_' + nm(w) + ' = constrain(walk_' + nm(w) + ' + random(-4, 5) / 100.0, 0.0, 1.0);   // a random walk, 0 … 1');
      for (const w of c.bound) {
        const n = nm(w), e = demoExpr(c, w);
        if (w.type === 'gauge') L.push('    lv_arc_set_value(' + n + ', (int32_t)roundf(' + e + '));', '    show_number(' + n + '_val, "%.' + gaugeDec(w) + 'f", ' + e + ');');
        if (w.type === 'bar') L.push('    lv_bar_set_value(' + n + ', (int32_t)roundf(' + e + '), LV_ANIM_OFF);');
        if (w.type === 'chart') L.push('    lv_chart_set_next_value(' + n + ', ' + n + '_ser, ' + chartScaled(w, e, 'cpp') + ');   // scaled into the default range 0–100');
        if (w.type === 'label') { needShow = true; L.push('    show_number(' + n + ', ' + cq(fmtOf(w.text)) + ', ' + e + ');'); }
      }
      L.push('  }');
    }
    // the program
    const o = [];
    o.push('// ' + c.scrs.length + ' screen' + (c.scrs.length === 1 ? '' : 's') + ', ' + c.all.length + ' widgets for a ' + tg.w + ' × ' + tg.h + ' panel — written by the GUI designer of Hyper ESP32 for LVGL 9');
    o.push('#include <lvgl.h>     // LVGL 9: lv_conf.h goes next to the libraries folder' + (fonts.size ? '; enable ' + [...fonts].sort((a, b) => a - b).map(p => 'LV_FONT_MONTSERRAT_' + p).join(', ') + ' in it' : ''));
    o.push('#include <TFT_eSPI.h>', '');
    o.push('// ======== adapt to your board: the display and the touch ========');
    o.push('// TFT_eSPI takes the driver chip (' + (tg.disp.split('-')[0].toUpperCase()) + ') and the pins from its User_Setup.h or build flags, not from this sketch.');
    o.push('static const uint16_t W = ' + tg.w + ', H = ' + tg.h + ';');
    o.push('static uint8_t draw_buf[W * 24 * 2];            // LVGL draws 24 lines at a time, 2 bytes per pixel (RGB565)');
    o.push('TFT_eSPI tft;', '', 'static uint32_t my_tick() { return millis(); }', '');
    o.push('static void flush_cb(lv_display_t *disp, const lv_area_t *area, uint8_t *px_map) {', '  uint32_t w = lv_area_get_width(area), h = lv_area_get_height(area);', '  tft.startWrite();', '  tft.setAddrWindow(area->x1, area->y1, w, h);',
      '  tft.pushColors((uint16_t *)px_map, w * h, true);   // true: swap the bytes for the SPI panel', '  tft.endWrite();', '  lv_display_flush_ready(disp);', '}', '');
    o.push('static void touch_cb(lv_indev_t *indev, lv_indev_data_t *data) {');
    if (tg.touch === 'xpt2046') o.push('  uint16_t x, y;', '  if (tft.getTouch(&x, &y)) { data->state = LV_INDEV_STATE_PRESSED; data->point.x = x; data->point.y = y; }', '  else data->state = LV_INDEV_STATE_RELEASED;');
    else o.push('  // read your touch controller here (' + (tg.touch === 'cap' ? 'an FT6336 or GT911 library' : 'this panel usually has none') + '): on a touch set', '  // data->state = LV_INDEV_STATE_PRESSED and data->point.x / data->point.y; until then the GUI sees no touch', '  data->state = LV_INDEV_STATE_RELEASED;');
    o.push('}', '');
    o.push('static void start_display() {', '  tft.init();', '  tft.setRotation(' + tg.rot + ');', '  lv_init();', '  lv_tick_set_cb(my_tick);', '  lv_display_t *disp = lv_display_create(W, H);', '  lv_display_set_color_format(disp, LV_COLOR_FORMAT_RGB565);',
      '  lv_display_set_flush_cb(disp, flush_cb);', '  lv_display_set_buffers(disp, draw_buf, nullptr, sizeof(draw_buf), LV_DISPLAY_RENDER_MODE_PARTIAL);', '  lv_indev_t *indev = lv_indev_create();', '  lv_indev_set_type(indev, LV_INDEV_TYPE_POINTER);', '  lv_indev_set_read_cb(indev, touch_cb);', '}');
    o.push('// ======== end of the board section ========', '');
    o.push('lv_obj_t ' + c.scrs.map(s => '*' + s.v).join(', ') + ';');
    const ws = c.all.map(a => a.w), names = ws.map(w => '*' + nm(w)).concat(ws.filter(w => w.type === 'gauge').map(w => '*' + nm(w) + '_val'));
    for (let i = 0; i < names.length; i += 6) o.push('lv_obj_t ' + names.slice(i, i + 6).join(', ') + ';');
    for (const w of ws) if (w.type === 'chart') o.push('lv_chart_series_t *' + nm(w) + '_ser;');
    for (const id of c.stepped) { const w = c.find(id); if (w && w.type === 'label') o.push('float ' + nm(w) + '_v = ' + fl((numIn(w.text) || { num: 0 }).num) + ';   // the number shown in ' + w.id); }
    for (const w of c.bound) if (w.bind === 'walk') o.push('float walk_' + nm(w) + ' = 0.5;');
    o.push('');
    if (needShow) o.push('static void show_number(lv_obj_t *label, const char *fmt, float v) {', '  char buf[32];', '  snprintf(buf, sizeof(buf), fmt, v);', '  lv_label_set_text(label, buf);', '}', '');
    if (needReport) o.push('// PRESSED, LONG_PRESSED and PRESS_LOST of every button, printed as the designer\'s log shows them', 'static void report_press(lv_event_t *e) {', '  lv_event_code_t code = lv_event_get_code(e);',
      '  Serial.printf("button %s %s\\n", (const char *)lv_event_get_user_data(e), code == LV_EVENT_PRESSED ? "PRESSED" : code == LV_EVENT_LONG_PRESSED ? "LONG_PRESSED" : "PRESS_LOST");', '}', '');
    if (cbs.length) o.push(cbs.join('\n').replace(/\n\}\n/g, '\n}\n\n'), '');
    o.push(builds.join('\n\n'), '');
    o.push('void setup() {', '  Serial.begin(115200);', '  start_display();', ...c.scrs.map(s => '  ' + s.fn + '();'), '  lv_screen_load(' + c.scrs[0].v + ');', '}', '');
    o.push('void loop() {', '  lv_timer_handler();                               // LVGL redraws, reads the touch and calls the callbacks', ...L, '  delay(5);', '}');
    return o.join('\n');
  }

  /* ---------------------------------------------------------------- LVGL 9, MicroPython (a firmware built with the LVGL binding) */
  function lvPy(c) {
    const { tg, nm } = c, cbs = [], builds = [];
    const font = (obj, size) => LV_FONT[size] ? [obj + '.set_style_text_font(lv.font_montserrat_' + LV_FONT[size] + ', 0)'] : [];
    const col = (obj, cname, th, part) => [obj + '.set_style_bg_color(lv.color_hex(' + hex6(colOf(cname, th)) + '), ' + (part || '0') + ')'];
    let needShow = false, needReport = false;
    const step = (tw, by) => {
      const n = nm(tw);
      if (tw.type === 'label') { needShow = true; const lo = Math.min(num(tw.min, 0), num(tw.max, 100)), hi = Math.max(num(tw.min, 0), num(tw.max, 100)); return ['    global ' + n + '_v', '    ' + n + '_v = min(max(' + n + '_v ' + plus(by) + ', ' + fl(lo) + '), ' + fl(hi) + ')', '    show_number(' + n + ', ' + cq(fmtOf(tw.text)) + ', ' + n + '_v)', '    print("label ' + tw.id + ' TEXT", ' + n + '.get_text())']; }
      if (!NUMERIC.includes(tw.type)) return [];
      const out = [tw.type === 'gauge' ? '    ' + n + '.set_value(' + n + '.get_value() + ' + iv(by) + ')' : '    ' + n + '.set_value(' + n + '.get_value() + ' + iv(by) + ', lv.ANIM.OFF)'];
      if (tw.type === 'gauge') { needShow = true; out.push('    show_number(' + n + '_val, "%.0f", ' + n + '.get_value())'); }
      out.push('    print("' + tw.type + ' ' + tw.id + ' VALUE", ' + n + '.get_value())');
      return out;
    };
    for (const { w } of c.all) {
      const n = nm(w);
      if (w.type === 'button') {
        const body = ['    print("button ' + w.id + ' CLICKED")'];
        if (w.action === 'goto') { const sc = c.scrOf(w.screen); if (sc) body.push('    lv.screen_load(' + sc.v + ')', '    print(' + cq('show screen ' + sc.s.name) + ')'); }
        if (w.action === 'step') { const tw = c.find(w.target); if (tw) body.push(...step(tw, num(w.by, 1))); }
        cbs.push('def ' + n + '_clicked(e):', ...body.filter(l => /^ *global /.test(l)), ...body.filter(l => !/^ *global /.test(l))); needReport = true;
      } else if (w.type === 'slider') cbs.push('def ' + n + '_changed(e):', '    print("slider ' + w.id + ' VALUE", ' + n + '.get_value())');
      else if (w.type === 'switch' || w.type === 'checkbox') { const [a, b] = w.type === 'switch' ? ['ON', 'OFF'] : ['checked', 'unchecked']; cbs.push('def ' + n + '_changed(e):', '    print("' + w.type + ' ' + w.id + ' VALUE", "' + a + '" if ' + n + '.has_state(lv.STATE.CHECKED) else "' + b + '")'); }
      else if (w.type === 'list') cbs.push('def ' + n + '_clicked(item):', '    return lambda e: print("list ' + w.id + ' CLICKED", item)');
      if (cbs.length && cbs[cbs.length - 1] !== '') cbs.push('');
    }
    for (const sc of c.scrs) {
      const th = c.th(sc), B = ['# ---- screen “' + sc.s.name + '”', sc.v + ' = lv.obj()', sc.v + '.set_style_bg_color(lv.color_hex(' + hex6(th.bg) + '), 0)', sc.v + '.set_style_text_color(lv.color_hex(' + hex6(th.fg) + '), 0)', sc.v + '.remove_flag(lv.obj.FLAG.SCROLLABLE)'];
      for (const w of sc.s.widgets) {
        const n = nm(w), pos = n + '.set_pos(' + w.x + ', ' + w.y + ')', size = (a, b) => n + '.set_size(' + a + ', ' + b + ')';
        B.push('', '# ' + typeName(w) + ' ' + w.id);
        switch (w.type) {
          case 'header': {
            const hc = colOf(w.color, th);
            B.push(n + ' = lv.obj(' + sc.v + ')', n + '.set_pos(0, 0)', size(tg.w, w.h), n + '.set_style_radius(0, 0)', n + '.set_style_border_width(0, 0)', n + '.set_style_pad_all(0, 0)', ...col(n, w.color, th), n + '.remove_flag(lv.obj.FLAG.SCROLLABLE)',
              't = lv.label(' + n + ')', 't.set_text(' + cq(w.text || '') + ')', ...font('t', w.size), ...(w.color !== 'panel' ? ['t.set_style_text_color(lv.color_hex(' + hex6(contrast(hc)) + '), 0)'] : []), 't.align(lv.ALIGN.LEFT_MID, 6, 0)');
            break;
          }
          case 'label': B.push(n + ' = lv.label(' + sc.v + ')', pos, n + '.set_text(' + cq(w.text || '') + ')', ...font(n, w.size), ...(w.color !== 'auto' ? [n + '.set_style_text_color(lv.color_hex(' + hex6(colOf(w.color, th)) + '), 0)'] : [])); break;
          case 'button': {
            const cc = colOf(w.color, th);
            B.push(n + ' = lv.button(' + sc.v + ')', pos, size(w.w, w.h), ...col(n, w.color, th), 't = lv.label(' + n + ')', 't.set_text(' + cq(w.text || '') + ')', ...font('t', w.size), ...(contrast(cc) !== 0xFFFFFF ? ['t.set_style_text_color(lv.color_hex(' + hex6(contrast(cc)) + '), 0)'] : []), 't.center()',
              n + '.add_event_cb(' + n + '_clicked, lv.EVENT.CLICKED, None)', 'for ev in (lv.EVENT.PRESSED, lv.EVENT.LONG_PRESSED, lv.EVENT.PRESS_LOST):', '    ' + n + '.add_event_cb(report_press("' + w.id + '"), ev, None)');
            break;
          }
          case 'slider': B.push(n + ' = lv.slider(' + sc.v + ')', pos, size(w.w, w.h), n + '.set_range(' + iv(w.min) + ', ' + iv(w.max) + ')', n + '.set_value(' + iv(w.value) + ', lv.ANIM.OFF)', ...col(n, w.color, th, 'lv.PART.INDICATOR'), ...col(n, w.color, th, 'lv.PART.KNOB'), n + '.add_event_cb(' + n + '_changed, lv.EVENT.VALUE_CHANGED, None)'); break;
          case 'switch': B.push(n + ' = lv.switch(' + sc.v + ')', pos, size(w.w, w.h), ...col(n, w.color, th, 'lv.PART.INDICATOR | lv.STATE.CHECKED'), ...(w.checked ? [n + '.add_state(lv.STATE.CHECKED)'] : []), n + '.add_event_cb(' + n + '_changed, lv.EVENT.VALUE_CHANGED, None)'); break;
          case 'checkbox': B.push(n + ' = lv.checkbox(' + sc.v + ')', pos, n + '.set_text(' + cq(w.text || '') + ')', ...font(n, w.size), ...col(n, w.color, th, 'lv.PART.INDICATOR | lv.STATE.CHECKED'), ...(w.checked ? [n + '.add_state(lv.STATE.CHECKED)'] : []), n + '.add_event_cb(' + n + '_changed, lv.EVENT.VALUE_CHANGED, None)'); break;
          case 'bar': B.push(n + ' = lv.bar(' + sc.v + ')', pos, size(w.w, w.h), n + '.set_range(' + iv(w.min) + ', ' + iv(w.max) + ')', n + '.set_value(' + iv(w.value) + ', lv.ANIM.OFF)', ...col(n, w.color, th, 'lv.PART.INDICATOR')); break;
          case 'gauge':
            needShow = true;
            B.push(n + ' = lv.arc(' + sc.v + ')', pos, size(w.w, w.w), n + '.set_range(' + iv(w.min) + ', ' + iv(w.max) + ')', n + '.set_value(' + iv(w.value) + ')', n + '.set_style_arc_color(lv.color_hex(' + hex6(colOf(w.color, th)) + '), lv.PART.INDICATOR)',
              n + '.remove_style(None, lv.PART.KNOB)      # a gauge shows a value: no knob,', n + '.remove_flag(lv.obj.FLAG.CLICKABLE)  # and it takes no touch', n + '_val = lv.label(' + n + ')', ...font(n + '_val', gaugeFont(w)), n + '_val.center()', 'show_number(' + n + '_val, "%.' + gaugeDec(w) + 'f", ' + fl(w.value) + ')',
              ...(w.text ? ['t = lv.label(' + n + ')', 't.set_text(' + cq(w.text) + ')', 't.align(lv.ALIGN.CENTER, 0, ' + Math.round(((w.w >> 1) - 1) * 0.45) + ')'] : []));
            break;
          case 'chart':
            B.push(n + ' = lv.chart(' + sc.v + ')', pos, size(w.w, w.h), n + '.set_type(lv.chart.TYPE.LINE)', n + '.set_point_count(30)', n + '_ser = ' + n + '.add_series(lv.color_hex(' + hex6(colOf(w.color, th)) + '), lv.chart.AXIS.PRIMARY_Y)');
            if (!w.bind || w.bind === 'none') B.push('for v in (' + chartPoints(w).join(', ') + '):   # 0-100, the default range', '    ' + n + '.set_next_value(' + n + '_ser, v)');
            break;
          case 'icon': B.push(n + ' = lv.label(' + sc.v + ')', pos, LV_SYM[w.icon] ? n + '.set_text(lv.SYMBOL.' + LV_SYM[w.icon] + ')' : n + '.set_text("?")   # LVGL has no "' + w.icon + '" symbol: use an image (lv.image)', ...font(n, w.size), ...(w.color !== 'auto' ? [n + '.set_style_text_color(lv.color_hex(' + hex6(colOf(w.color, th)) + '), 0)'] : [])); break;
          case 'list':
            B.push(n + ' = lv.list(' + sc.v + ')', pos, size(w.w, listItems(w).length * rowH(w, false)), 'for item in (' + listItems(w).map(cq).join(', ') + (listItems(w).length === 1 ? ',' : '') + '):', '    ' + n + '.add_button(None, item).add_event_cb(' + n + '_clicked(item), lv.EVENT.CLICKED, None)');
            break;
        }
      }
      builds.push(B.join('\n'));
    }
    const o = [];
    o.push('# ' + c.scrs.length + ' screen' + (c.scrs.length === 1 ? '' : 's') + ', ' + c.all.length + ' widgets for a ' + tg.w + ' x ' + tg.h + ' panel - written by the GUI designer of Hyper ESP32 for LVGL 9',
      '# Needs a MicroPython firmware built with LVGL (lv_binding_micropython): the official downloads do not have it.', 'import lvgl as lv', 'import time, math' + (c.bound.some(w => w.bind === 'walk') ? ', random' : ''), '');
    o.push('# ======== adapt to your board: the display and the touch ========', 'lv.init()', '# Create the display and the touch input here with the drivers of your LVGL firmware build',
      '# (its README lists ILI9341, XPT2046 and FT6X36 drivers for the ESP32), for a ' + tg.w + ' x ' + tg.h + ' panel.', '# ======== end of the board section ========', '');
    for (const id of c.stepped) { const w = c.find(id); if (w && w.type === 'label') o.push(nm(w) + '_v = ' + fl((numIn(w.text) || { num: 0 }).num) + '   # the number shown in ' + w.id); }
    for (const w of c.bound) if (w.bind === 'walk') o.push('walk_' + nm(w) + ' = 0.5');
    if (o[o.length - 1] !== '') o.push('');
    if (c.bound.some(w => w.type === 'label')) needShow = true;
    if (needShow) o.push('def show_number(label, fmt, v):', '    label.set_text(fmt % v)', '');
    if (needReport) o.push('def report_press(name):', '    # PRESSED, LONG_PRESSED and PRESS_LOST of a button, printed as the designer\'s log shows them', '    def cb(e):', '        code = e.get_code()',
      '        print("button", name, "PRESSED" if code == lv.EVENT.PRESSED else "LONG_PRESSED" if code == lv.EVENT.LONG_PRESSED else "PRESS_LOST")', '    return cb', '');
    if (cbs.length) o.push(cbs.join('\n'));
    o.push(builds.join('\n\n'), '', 'lv.screen_load(' + c.scrs[0].v + ')', '');
    o.push('last = time.ticks_ms()', 't0 = last', 'while True:', '    lv.timer_handler()                        # LVGL redraws, reads the touch and calls the callbacks');
    if (c.bound.length) {
      const uses = k => c.bound.some(w => w.bind === k);
      o.push('    if time.ticks_diff(time.ticks_ms(), last) >= 500:   # the demo data, twice a second: put your sensor readings here', '        last = time.ticks_ms()', '        t = time.ticks_diff(last, t0) / 1000');
      if (uses('room')) o.push('        room = 21 + 1.5 * math.sin(t * 2 * math.pi / 40) + 0.25 * math.sin(t * 2 * math.pi / 7)');
      if (uses('sine')) o.push('        sine = 0.5 + 0.5 * math.sin(t * 2 * math.pi / 20)');
      for (const w of c.bound) if (w.bind === 'walk') o.push('        walk_' + nm(w) + ' = min(1, max(0, walk_' + nm(w) + ' + random.uniform(-0.04, 0.04)))');
      for (const w of c.bound) {
        const n = nm(w), e = demoExpr(c, w);
        if (w.type === 'gauge') o.push('        ' + n + '.set_value(round(' + e + '))', '        show_number(' + n + '_val, "%.' + gaugeDec(w) + 'f", ' + e + ')');
        if (w.type === 'bar') o.push('        ' + n + '.set_value(round(' + e + '), lv.ANIM.OFF)');
        if (w.type === 'chart') o.push('        ' + n + '.set_next_value(' + n + '_ser, ' + chartScaled(w, e, 'py') + ')');
        if (w.type === 'label') { o.push('        show_number(' + n + ', ' + cq(fmtOf(w.text)) + ', ' + e + ')'); }
      }
    }
    o.push('    time.sleep_ms(5)');
    return o.join('\n');
  }

  /* ---------------------------------------------------------------- the block notation, for both kinds of panel */
  function guiBlocksCreate(c, w) {
    const at = ' at x (' + w.x + ') y (' + w.y + ')', n = w.id;
    switch (w.type) {
      case 'header': return 'create header [' + blk(w.text) + '] height (' + w.h + ')';
      case 'label': return 'create label [' + n + '] text [' + blk(w.text) + ']' + at + (w.size > 1 ? ' size (' + w.size + ')' : '');
      case 'button': return 'create button [' + n + '] text [' + blk(w.text) + ']' + at + ' size (' + w.w + ') × (' + w.h + ')';
      case 'slider': return 'create slider [' + n + ']' + at + ' width (' + w.w + ') from (' + iv(w.min) + ') to (' + iv(w.max) + ') value (' + iv(w.value) + ')';
      case 'switch': return 'create switch [' + n + ']' + at + ' [' + (w.checked ? 'on' : 'off') + ' v]';
      case 'checkbox': return 'create checkbox [' + n + '] text [' + blk(w.text) + ']' + at + ' [' + (w.checked ? 'ticked' : 'clear') + ' v]';
      case 'bar': return 'create bar [' + n + ']' + at + ' size (' + w.w + ') × (' + w.h + ') value (' + iv(w.value) + ')';
      case 'gauge': return 'create gauge [' + n + ']' + at + ' size (' + w.w + ') from (' + iv(w.min) + ') to (' + iv(w.max) + ')';
      case 'chart': return 'create chart [' + n + ']' + at + ' size (' + w.w + ') × (' + w.h + ') from (' + fl(w.min) + ') to (' + fl(w.max) + ')';
      case 'icon': return 'create icon [' + blk(w.icon) + ' v]' + at;
      case 'list': return 'create list [' + n + '] items [' + blk(listItems(w).join(', ')) + ']' + at;
    }
    return '';
  }
  function guiBlocksDemo(c) {
    if (!c.bound.length) return [];
    const out = ['every (0.5) seconds :: time'];
    const src = w => w.bind === 'room' ? '(demo room temperature)' : w.bind === 'sine' ? '(demo slow wave from (' + fl(w.min) + ') to (' + fl(w.max) + '))' : '(demo random walk from (' + fl(w.min) + ') to (' + fl(w.max) + '))';
    for (const w of c.bound) {
      if (w.type === 'chart') out.push('  add ' + src(w) + ' to chart [' + w.id + '] :: display');
      else if (w.type === 'label') out.push('  set label [' + w.id + '] to ' + src(w) + ' :: display');
      else out.push('  set ' + w.type + ' [' + w.id + '] to ' + src(w) + ' :: display');
    }
    return out;
  }
  function lvBlocks(c) {
    const { tg } = c, out = ['when started', '  start display [' + tg.block + ' v]'];
    if (tg.touch === 'xpt2046') out.push('  start touch [XPT2046 v] :: display'); else if (tg.touch === 'cap') out.push('  start touch [FT6336 v] :: display');
    for (const sc of c.scrs) out.push('  build screen [' + blk(sc.s.name) + ' v] :: my');
    out.push('  show screen [' + blk(c.scrs[0].s.name) + ' v]');
    for (const sc of c.scrs) {
      out.push('', 'define build screen [' + blk(sc.s.name) + ']', '  create screen [' + blk(sc.s.name) + '] background [' + sc.s.bg + ' v]');
      for (const w of sc.s.widgets) out.push('  ' + guiBlocksCreate(c, w));
    }
    for (const { w } of c.all) {
      if (w.type === 'button') {
        out.push('', 'when button [' + w.id + '] touched', '  print [button ' + w.id + ' CLICKED]');
        if (w.action === 'goto') { const sc = c.scrOf(w.screen); if (sc) out.push('  show screen [' + blk(sc.s.name) + ' v]'); }
        if (w.action === 'step') {
          const tw = c.find(w.target);
          if (tw && tw.type === 'label') { const p = numIn(tw.text) || { pre: '', post: '' }; out.push('  change [' + tw.id + ' number v] by (' + fl(w.by) + ')', '  set label [' + tw.id + '] to (join ' + (p.pre ? '[' + blk(p.pre) + '] ' : '') + '(' + tw.id + ' number)' + (p.post ? ' [' + blk(p.post) + ']' : '') + ') :: display'); }
          else if (tw) out.push('  change ' + tw.type + ' [' + tw.id + '] by (' + iv(w.by) + ') :: display');
        }
      } else if (w.type === 'slider') out.push('', 'when slider [' + w.id + '] changes', '  print (join [slider ' + w.id + ' VALUE ] (value of slider [' + w.id + ']))');
      else if (w.type === 'switch' || w.type === 'checkbox') out.push('', 'when ' + w.type + ' [' + w.id + '] changes', '  print (join [' + w.type + ' ' + w.id + ' VALUE ] (state of ' + w.type + ' [' + w.id + ']))');
      else if (w.type === 'list') out.push('', 'when list [' + w.id + '] item touched', '  print (join [list ' + w.id + ' CLICKED ] (item text))');
    }
    const demo = guiBlocksDemo(c);
    if (demo.length) out.push('', ...demo);
    return out.join('\n');
  }
  function oledBlocks(c) {
    const out = ['when started', '  start I2C on SDA (21) SCL (22)', '  start display [SSD1306 128×64 v]', '  set [screen v] to (1)', '  draw screen (screen) :: my', '', 'when button [BOOT v] pressed', '  change [screen v] by (1)',
      '  if <(screen) > (' + c.scrs.length + ')> then', '    set [screen v] to (1)', '  end', '  draw screen (screen) :: my'];
    const demo = guiBlocksDemo(c);
    if (demo.length) out.push('', ...demo, '  draw screen (screen) :: my');
    for (const sc of c.scrs) {
      out.push('', 'define draw screen [' + blk(sc.s.name) + ']', '  clear display');
      for (const w of sc.s.widgets) out.push('  ' + guiBlocksCreate(c, w).replace(/^create /, 'draw '));
      out.push('  update display');
    }
    return out.join('\n');
  }

  /* ---------------------------------------------------------------- the mono OLED: Adafruit GFX (C++) and framebuf (MicroPython)
     Each widget is drawn by a small helper that does what the preview does, dot for dot in C++. */
  const CP437 = { '°': 0xF8, 'µ': 0xE6, 'Ω': 0xEA, '±': 0xF1, '²': 0xFD, '·': 0xFA, '→': 0x1A, '←': 0x1B, '↑': 0x18, '↓': 0x19, '♥': 0x03, '█': 0xDB, '÷': 0xF6, '✓': 0xFB };
  const ASCII = { '×': 'x', '–': '-' };
  /* a C string for Adafruit GFX's classic font (code page 437) */
  function gfxStr(s) {
    let out = '', prevHex = false;
    for (const ch0 of String(s)) {
      const ch = ASCII[ch0] || ch0, cp = CP437[ch];
      const code = ch.charCodeAt(0), piece = cp != null ? '\\x' + cp.toString(16).toUpperCase().padStart(2, '0') : code >= 32 && code < 127 ? (ch === '"' || ch === '\\' ? '\\' + ch : ch) : '?';
      if (prevHex && /^[0-9A-Fa-f]/.test(piece)) out += '" "';
      out += piece; prevHex = cp != null;
    }
    return '"' + out + '"';
  }
  const pyAscii = s => [...String(s)].map(ch => ASCII[ch] || (ch === '°' ? '°' : ch.charCodeAt(0) >= 32 && ch.charCodeAt(0) < 127 ? ch : '?')).join('');
  function oledCpp(c) {
    const used = new Set(c.all.map(a => a.w.type)), ws = c.all.map(a => a.w), o = [], icons = [...new Set(ws.filter(w => w.type === 'icon').map(w => w.icon))];
    const H_ = [];
    if (used.has('header')) H_.push('void drawHeader(const char *text, int h, int size) {', '  display.fillRect(0, 0, 128, h, SSD1306_WHITE);', '  display.setTextColor(SSD1306_BLACK);', '  display.setTextSize(size);', '  display.setCursor(2, (h - 7 * size) / 2);', '  display.print(text);', '  display.setTextColor(SSD1306_WHITE);', '}');
    if (used.has('button')) H_.push('void drawButton(int x, int y, int w, int h, const char *text, int size) {', '  display.drawRoundRect(x, y, w, h, min(3, h / 2), SSD1306_WHITE);', '  display.setTextSize(size);', '  display.setCursor(x + (w - (int)strlen(text) * 6 * size) / 2, y + (h - 7 * size) / 2);', '  display.print(text);', '}');
    if (used.has('slider')) H_.push('void drawSlider(int x, int y, int w, int h, float frac) {', '  int r = constrain(h / 2, 3, 12), cy = y + h / 2, kx = x + r + (int)roundf(frac * (w - 1 - 2 * r));', '  display.drawRect(x, cy - 1, w, 3, SSD1306_WHITE);', '  display.fillCircle(kx, cy, r, SSD1306_WHITE);', '  display.fillCircle(kx, cy, max(1, r - 2), SSD1306_BLACK);', '}');
    if (used.has('switch')) H_.push('void drawSwitch(int x, int y, int w, int h, bool on) {', '  int r = h / 2, kr = max(1, r - 2), kx = on ? x + w - 1 - r : x + r;', '  if (on) { display.fillRoundRect(x, y, w, h, r, SSD1306_WHITE); display.fillCircle(kx, y + r, kr, SSD1306_BLACK); }', '  else { display.drawRoundRect(x, y, w, h, r, SSD1306_WHITE); display.fillCircle(kx, y + r, kr, SSD1306_WHITE); }', '}');
    if (used.has('checkbox')) H_.push('void drawCheck(int x, int y, int size, bool on, const char *text) {', '  int b = 8 * size;', '  display.drawRect(x, y, b, b, SSD1306_WHITE);',
      '  if (on) for (int d = 0; d < max(1, (int)roundf(b / 7.0)); d++) {', '    display.drawLine(x + roundf(0.2 * b), y + roundf(0.52 * b) + d, x + roundf(0.42 * b), y + roundf(0.74 * b) + d, SSD1306_WHITE);', '    display.drawLine(x + roundf(0.42 * b), y + roundf(0.74 * b) + d, x + roundf(0.8 * b), y + roundf(0.26 * b) + d, SSD1306_WHITE);', '  }',
      '  display.setTextSize(size);', '  display.setCursor(x + b + 5, y + (b - 7 * size) / 2);', '  display.print(text);', '}');
    if (used.has('bar')) H_.push('void drawBar(int x, int y, int w, int h, float frac) {', '  display.drawRect(x, y, w, h, SSD1306_WHITE);', '  int fw = roundf((w - 4) * frac);', '  if (fw > 0 && h > 4) display.fillRect(x + 2, y + 2, fw, h - 4, SSD1306_WHITE);', '}');
    if (used.has('gauge')) H_.push('// Adafruit GFX has no arc: every dot between radius r - thick and r whose angle (clockwise from 12 o\'clock) lies in a0 … a1',
      'void drawArcDots(int cx, int cy, int r, float a0, float a1, int thick) {', '  for (int dy = -r; dy <= r; dy++)', '    for (int dx = -r; dx <= r; dx++) {', '      float d = sqrtf(dx * dx + dy * dy), a = atan2f(dx, -dy) * 180 / PI;',
      '      if (d <= r + 0.5f && d >= r - thick - 0.5f && a >= a0 && a <= a1) display.drawPixel(cx + dx, cy + dy, SSD1306_WHITE);', '    }', '}',
      'void drawGauge(int x, int y, int w, float frac, const char *value, const char *caption) {', '  int half = w / 2, cx = x + half, cy = y + half, r = max(4, half - 1), thick = max(2, (int)roundf(r / 6.0));', '  drawArcDots(cx, cy, r, -135, 135, 1);', '  if (frac > 0) drawArcDots(cx, cy, r, -135, -135 + 270 * frac, thick);',
      '  int vs = r >= 56 ? 3 : r >= 26 ? 2 : 1;', '  display.setTextSize(vs);', '  display.setCursor(cx - (int)strlen(value) * 3 * vs, cy - 7 * vs / 2);', '  display.print(value);', '  if (caption[0] && r >= 18) { display.setTextSize(1); display.setCursor(cx - (int)strlen(caption) * 3, cy + (int)roundf(r * 0.42)); display.print(caption); }', '}');
    if (used.has('chart')) H_.push('void drawChart(int x, int y, int w, int h, const float *data, int n, float lo, float hi) {', '  display.drawRect(x, y, w, h, SSD1306_WHITE);', '  for (int i = 1; i < n; i++) {', '    float a = constrain(data[i - 1], lo, hi), b = constrain(data[i], lo, hi);',
      '    display.drawLine(x + 2 + roundf((i - 1) * (w - 5) / (float)(n - 1)), y + h - 3 - roundf((a - lo) / (hi - lo) * (h - 6)),', '                     x + 2 + roundf(i * (w - 5) / (float)(n - 1)), y + h - 3 - roundf((b - lo) / (hi - lo) * (h - 6)), SSD1306_WHITE);', '  }', '}');
    if (used.has('list')) H_.push('void drawList(int x, int y, int w, const char *const *items, int n, int sel, int size) {', '  int rh = 8 * size + 3;', '  display.setTextSize(size);', '  for (int i = 0; i < n; i++) {',
      '    if (i == sel) display.fillRect(x, y + i * rh, w, rh, SSD1306_WHITE);', '    display.setTextColor(i == sel ? SSD1306_BLACK : SSD1306_WHITE);', '    display.setCursor(x + 3, y + i * rh + (rh - 7 * size) / 2);', '    display.print(items[i]);', '  }', '  display.setTextColor(SSD1306_WHITE);', '}');
    if (used.has('icon')) H_.push('void drawIcon(int x, int y, const unsigned char *bits, int w, int h, int s) {   // each dot of the bitmap as an s × s square', '  int bw = (w + 7) / 8;', '  for (int j = 0; j < h; j++)', '    for (int i = 0; i < w; i++)',
      '      if (pgm_read_byte(&bits[j * bw + i / 8]) & (0x80 >> (i % 8))) display.fillRect(x + i * s, y + j * s, s, s, SSD1306_WHITE);', '}');
    const needFmt = ws.some(w => w.type === 'gauge' || (w.type === 'label' && w.bind && w.bind !== 'none'));
    if (needFmt) H_.push('const char *fmt(const char *f, float v) {   // a number as text, for the drawing helpers', '  static char buf[24];', '  snprintf(buf, sizeof(buf), f, v);', '  return buf;', '}');
    // the drawing of each screen
    const D = [];
    const frac = (w, e) => 'constrain((' + e + ' - ' + fl(w.min) + ') / ' + fl((num(w.max, 100) - num(w.min, 0)) || 1) + ', 0.0, 1.0)';
    for (const sc of c.scrs) {
      D.push('void ' + sc.draw + '() {', '  display.clearDisplay();', '  display.setTextColor(SSD1306_WHITE);');
      for (const w of sc.s.widgets) {
        const n = c.nm(w), val = w.bind && w.bind !== 'none' ? demoExpr(c, w) : fl(w.value);
        switch (w.type) {
          case 'header': D.push('  drawHeader(' + gfxStr(w.text) + ', ' + w.h + ', ' + w.size + ');'); break;
          case 'label': D.push('  display.setTextSize(' + w.size + ');', '  display.setCursor(' + w.x + ', ' + w.y + ');', w.bind && w.bind !== 'none' ? '  display.print(fmt(' + gfxStr(fmtOf(w.text)) + ', ' + demoExpr(c, w) + '));' : '  display.print(' + gfxStr(w.text) + ');'); break;
          case 'button': D.push('  drawButton(' + [w.x, w.y, w.w, w.h, gfxStr(w.text), w.size].join(', ') + ');'); break;
          case 'slider': D.push('  drawSlider(' + [w.x, w.y, w.w, w.h, frac(w, fl(w.value))].join(', ') + ');'); break;
          case 'switch': D.push('  drawSwitch(' + [w.x, w.y, w.w, w.h, w.checked ? 'true' : 'false'].join(', ') + ');'); break;
          case 'checkbox': D.push('  drawCheck(' + [w.x, w.y, w.size, w.checked ? 'true' : 'false', gfxStr(w.text)].join(', ') + ');'); break;
          case 'bar': D.push('  drawBar(' + [w.x, w.y, w.w, w.h, frac(w, val)].join(', ') + ');'); break;
          case 'gauge': D.push('  drawGauge(' + [w.x, w.y, w.w, frac(w, val), 'fmt("%.' + gaugeDec(w) + 'f", ' + val + ')', gfxStr(w.text || '')].join(', ') + ');'); break;
          case 'chart': D.push('  drawChart(' + [w.x, w.y, w.w, w.h, n + '_data', '30', fl(w.min), fl(w.max)].join(', ') + ');'); break;
          case 'icon': { const b = iconBits(w.icon); D.push('  drawIcon(' + [w.x, w.y, 'icon_' + ident(w.icon), b.w, b.h, w.size].join(', ') + ');'); break; }
          case 'list': D.push('  drawList(' + [w.x, w.y, w.w, n + '_items', listItems(w).length, w.sel | 0, w.size].join(', ') + ');'); break;
        }
      }
      D.push('  display.display();                // nothing shows until the buffer is sent', '}');
    }
    o.push('// ' + c.scrs.length + ' screen' + (c.scrs.length === 1 ? '' : 's') + ' on a 128 × 64 SSD1306 OLED — written by the GUI designer of Hyper ESP32', '#include <Wire.h>', '#include <Adafruit_GFX.h>', '#include <Adafruit_SSD1306.h>', '');
    o.push('// ======== adapt to your board ========', 'Adafruit_SSD1306 display(128, 64, &Wire, -1);   // width, height, the I2C bus, no reset pin', 'const int SDA_PIN = 21, SCL_PIN = 22;            // the I2C pins of a classic ESP32 board', 'const int BUTTON_PIN = 0;                        // the BOOT button: an OLED has no touch, so a button changes the screen', '// ======== end of the board section ========', '');
    o.push('int screen = 0;                                 // ' + c.scrs.map((s, i) => i + ' = ' + s.s.name).join(', '), 'const int SCREENS = ' + c.scrs.length + ';', 'const char *const SCREEN_NAMES[] = { ' + c.scrs.map(s => gfxStr(s.s.name)).join(', ') + ' };');
    if (c.bound.length) { if (c.bound.some(w => w.bind === 'room')) o.push('float room = 21;'); if (c.bound.some(w => w.bind === 'sine')) o.push('float sine = 0.5;'); for (const w of c.bound) if (w.bind === 'walk') o.push('float walk_' + c.nm(w) + ' = 0.5;'); }
    for (const w of ws) if (w.type === 'chart') o.push('float ' + c.nm(w) + '_data[30];                   // the last 30 values, oldest first');
    for (const w of ws) if (w.type === 'list') o.push('const char *const ' + c.nm(w) + '_items[] = { ' + listItems(w).map(gfxStr).join(', ') + ' };');
    for (const name of icons) { const p = packRows(iconBits(name).rows); o.push('const unsigned char icon_' + ident(name) + '[] PROGMEM = { ' + p.bytes.map(hx2).join(', ') + ' };   // ' + p.w + ' × ' + p.h); }
    o.push('', H_.join('\n'), '', D.join('\n'), '');
    o.push('void draw_screen() {', '  switch (screen) {', ...c.scrs.map((s, i) => '    case ' + i + ': ' + s.draw + '(); break;'), '  }', '}', '');
    const charts = ws.filter(w => w.type === 'chart');
    o.push('void setup() {', '  Serial.begin(115200);', '  pinMode(BUTTON_PIN, INPUT_PULLUP);', '  Wire.begin(SDA_PIN, SCL_PIN);', '  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { Serial.println("no SSD1306 at 0x3C"); while (true) delay(1000); }', '  display.cp437(true);                   // the real code page 437, so that \\xF8 is the degree sign');
    for (const w of charts) { const pts = chartPoints(w), lo = num(w.min, 0), span = num(w.max, 100) - lo; o.push('  for (int i = 0; i < 30; i++) ' + c.nm(w) + '_data[i] = ' + (w.bind && w.bind !== 'none' ? fl((lo + num(w.max, 100)) / 2) : fl(lo) + ' + ' + fl(span / 100) + ' * ' + c.nm(w) + '_start[i]') + ';'); if (!w.bind || w.bind === 'none') o.splice(o.length - 1, 0, '  static const uint8_t ' + c.nm(w) + '_start[30] = { ' + pts.join(', ') + ' };'); }
    o.push('  draw_screen();', '}', '');
    o.push('void loop() {', '  static bool was = HIGH;', '  bool now = digitalRead(BUTTON_PIN);', '  if (was == HIGH && now == LOW) {                // pressed: the next screen', '    screen = (screen + 1) % SCREENS;', '    Serial.printf("show screen %s\\n", SCREEN_NAMES[screen]);', '    draw_screen();', '  }', '  was = now;');
    if (c.bound.length) {
      o.push('  static uint32_t last = 0;', '  if (millis() - last >= 500) {                  // the demo data, twice a second: put your sensor readings here', '    last = millis();', '    float t = millis() / 1000.0;');
      if (c.bound.some(w => w.bind === 'room')) o.push('    room = 21 + 1.5 * sin(t * 2 * PI / 40) + 0.25 * sin(t * 2 * PI / 7);');
      if (c.bound.some(w => w.bind === 'sine')) o.push('    sine = 0.5 + 0.5 * sin(t * 2 * PI / 20);');
      for (const w of c.bound) if (w.bind === 'walk') o.push('    walk_' + c.nm(w) + ' = constrain(walk_' + c.nm(w) + ' + random(-4, 5) / 100.0, 0.0, 1.0);');
      for (const w of c.bound) if (w.type === 'chart') o.push('    memmove(' + c.nm(w) + '_data, ' + c.nm(w) + '_data + 1, 29 * sizeof(float));', '    ' + c.nm(w) + '_data[29] = ' + demoExpr(c, w) + ';');
      o.push('    draw_screen();', '  }');
    }
    o.push('  delay(20);', '}');
    return o.join('\n');
  }
  function oledPy(c) {
    const ws = c.all.map(a => a.w), used = new Set(ws.map(w => w.type)), icons = [...new Set(ws.filter(w => w.type === 'icon').map(w => w.icon))], o = [];
    o.push('# ' + c.scrs.length + ' screen' + (c.scrs.length === 1 ? '' : 's') + ' on a 128 x 64 SSD1306 OLED - written by the GUI designer of Hyper ESP32', 'from machine import I2C, Pin', 'import framebuf, math, time' + (c.bound.some(w => w.bind === 'walk') ? ', random' : ''), 'import ssd1306                      # not in the firmware: mip.install("ssd1306") once', '');
    o.push('# ======== adapt to your board ========', 'i2c = I2C(0, scl=Pin(22), sda=Pin(21))', 'oled = ssd1306.SSD1306_I2C(128, 64, i2c)          # address 0x3C', 'button = Pin(0, Pin.IN, Pin.PULL_UP)              # the BOOT button: an OLED has no touch, so a button changes the screen', '# ======== end of the board section ========', '');
    o.push('glyph = framebuf.FrameBuffer(bytearray(8), 8, 8, framebuf.MONO_HLSB)', '', 'def text(s, x, y, size=1, c=1):', '    # framebuf has one 8 x 8 ASCII font: larger sizes are copied dot by dot, and the degree sign is a small ring', '    for ch in s:', '        if ch == "°":', '            oled.ellipse(x + 3 * size, y + 2 * size, 2 * size, 2 * size, c)',
      '        elif size == 1:', '            oled.text(ch, x, y, c)', '        else:', '            glyph.fill(0)', '            glyph.text(ch, 0, 0, 1)', '            for j in range(8):', '                for i in range(8):', '                    if glyph.pixel(i, j):', '                        oled.fill_rect(x + i * size, y + j * size, size, size, c)', '        x += 8 * size', '');
    if (used.has('button') || used.has('switch')) o.push('def round_rect(x, y, w, h, r, c, fill=False):', '    # framebuf has no rounded rectangle: four quarter ellipses and the straight parts', '    for cx, cy, q in ((x + w - 1 - r, y + r, 1), (x + r, y + r, 2), (x + r, y + h - 1 - r, 4), (x + w - 1 - r, y + h - 1 - r, 8)):', '        oled.ellipse(cx, cy, r, r, c, fill, q)',
      '    if fill:', '        oled.fill_rect(x + r, y, w - 2 * r, h, c)', '        oled.fill_rect(x, y + r, w, h - 2 * r, c)', '    else:', '        oled.hline(x + r, y, w - 2 * r, c)', '        oled.hline(x + r, y + h - 1, w - 2 * r, c)', '        oled.vline(x, y + r, h - 2 * r, c)', '        oled.vline(x + w - 1, y + r, h - 2 * r, c)', '');
    if (used.has('header')) o.push('def draw_header(s, h, size):', '    oled.fill_rect(0, 0, 128, h, 1)', '    text(s, 2, (h - 7 * size) // 2, size, 0)', '');
    if (used.has('button')) o.push('def draw_button(x, y, w, h, s, size):', '    round_rect(x, y, w, h, min(3, h // 2), 1)', '    text(s, x + (w - len(s) * 8 * size) // 2, y + (h - 7 * size) // 2, size)', '');
    if (used.has('slider')) o.push('def draw_slider(x, y, w, h, frac):', '    r = min(12, max(3, h // 2))', '    cy = y + h // 2', '    kx = x + r + round(frac * (w - 1 - 2 * r))', '    oled.rect(x, cy - 1, w, 3, 1)', '    oled.ellipse(kx, cy, r, r, 1, True)', '    oled.ellipse(kx, cy, max(1, r - 2), max(1, r - 2), 0, True)', '');
    if (used.has('switch')) o.push('def draw_switch(x, y, w, h, on):', '    r = h // 2', '    kr = max(1, r - 2)', '    kx = x + w - 1 - r if on else x + r', '    round_rect(x, y, w, h, r, 1, on)', '    oled.ellipse(kx, y + r, kr, kr, 0 if on else 1, True)', '');
    if (used.has('checkbox')) o.push('def draw_check(x, y, size, on, s):', '    b = 8 * size', '    oled.rect(x, y, b, b, 1)', '    if on:', '        for d in range(max(1, round(b / 7))):', '            oled.line(x + round(0.2 * b), y + round(0.52 * b) + d, x + round(0.42 * b), y + round(0.74 * b) + d, 1)',
      '            oled.line(x + round(0.42 * b), y + round(0.74 * b) + d, x + round(0.8 * b), y + round(0.26 * b) + d, 1)', '    text(s, x + b + 5, y + (b - 7 * size) // 2, size)', '');
    if (used.has('bar')) o.push('def draw_bar(x, y, w, h, frac):', '    oled.rect(x, y, w, h, 1)', '    fw = round((w - 4) * frac)', '    if fw > 0 and h > 4:', '        oled.fill_rect(x + 2, y + 2, fw, h - 4, 1)', '');
    if (used.has('gauge')) o.push('def arc_dots(cx, cy, r, a0, a1, thick):', '    # framebuf has no arc: every dot between radius r - thick and r whose angle (clockwise from 12 o\'clock) lies in a0 ... a1', '    for dy in range(-r, r + 1):', '        for dx in range(-r, r + 1):', '            d = math.sqrt(dx * dx + dy * dy)', '            a = math.degrees(math.atan2(dx, -dy))',
      '            if r - thick - 0.5 <= d <= r + 0.5 and a0 <= a <= a1:', '                oled.pixel(cx + dx, cy + dy, 1)', '', 'def draw_gauge(x, y, w, frac, value, caption):', '    half = w // 2', '    cx, cy, r = x + half, y + half, max(4, half - 1)', '    arc_dots(cx, cy, r, -135, 135, 1)', '    if frac > 0:', '        arc_dots(cx, cy, r, -135, -135 + 270 * frac, max(2, round(r / 6)))',
      '    vs = 3 if r >= 56 else 2 if r >= 26 else 1', '    text(value, cx - len(value) * 4 * vs, cy - 7 * vs // 2, vs)', '    if caption and r >= 18:', '        text(caption, cx - len(caption) * 4, cy + round(r * 0.42))', '');
    if (used.has('chart')) o.push('def draw_chart(x, y, w, h, data, lo, hi):', '    oled.rect(x, y, w, h, 1)', '    n = len(data)', '    px = lambda i: x + 2 + round(i * (w - 5) / (n - 1))', '    py = lambda v: y + h - 3 - round((min(hi, max(lo, v)) - lo) / (hi - lo) * (h - 6))', '    for i in range(1, n):', '        oled.line(px(i - 1), py(data[i - 1]), px(i), py(data[i]), 1)', '');
    if (used.has('list')) o.push('def draw_list(x, y, w, items, sel, size):', '    rh = 8 * size + 3', '    for i, s in enumerate(items):', '        if i == sel:', '            oled.fill_rect(x, y + i * rh, w, rh, 1)', '        text(s, x + 3, y + i * rh + (rh - 7 * size) // 2, size, 0 if i == sel else 1)', '');
    if (used.has('icon')) {
      o.push('def draw_icon(x, y, fb, w, h, s):', '    for j in range(h):', '        for i in range(w):', '            if fb.pixel(i, j):', '                oled.fill_rect(x + i * s, y + j * s, s, s, 1)', '');
      for (const name of icons) { const p = packRows(iconBits(name).rows); o.push('icon_' + ident(name) + ' = framebuf.FrameBuffer(bytearray(b"' + p.bytes.map(v => '\\x' + v.toString(16).padStart(2, '0')).join('') + '"), ' + p.bw * 8 + ', ' + p.h + ', framebuf.MONO_HLSB)   # ' + p.w + ' x ' + p.h); }
      o.push('');
    }
    o.push('screen = 0                         # ' + c.scrs.map((s, i) => i + ' = ' + s.s.name).join(', '));
    if (c.bound.some(w => w.bind === 'room')) o.push('room = 21');
    if (c.bound.some(w => w.bind === 'sine')) o.push('sine = 0.5');
    for (const w of c.bound) if (w.bind === 'walk') o.push('walk_' + c.nm(w) + ' = 0.5');
    for (const w of ws) if (w.type === 'chart') o.push(c.nm(w) + '_data = [' + (w.bind && w.bind !== 'none' ? fl((num(w.min, 0) + num(w.max, 100)) / 2) + '] * 30' : chartPoints(w).map(p => fl(num(w.min, 0) + p * (num(w.max, 100) - num(w.min, 0)) / 100)).join(', ') + ']'));
    o.push('');
    const frac = (w, e) => 'min(1, max(0, (' + e + ' - ' + fl(w.min) + ') / ' + fl((num(w.max, 100) - num(w.min, 0)) || 1) + '))';
    for (const sc of c.scrs) {
      o.push('def ' + sc.draw + '():', '    oled.fill(0)');
      for (const w of sc.s.widgets) {
        const n = c.nm(w), val = w.bind && w.bind !== 'none' ? demoExpr(c, w) : fl(w.value), s = x => cq(pyAscii(x));
        switch (w.type) {
          case 'header': o.push('    draw_header(' + s(w.text) + ', ' + w.h + ', ' + w.size + ')'); break;
          case 'label': o.push('    text(' + (w.bind && w.bind !== 'none' ? cq(pyAscii(fmtOf(w.text))) + ' % ' + demoExpr(c, w) : s(w.text)) + ', ' + w.x + ', ' + w.y + ', ' + w.size + ')'); break;
          case 'button': o.push('    draw_button(' + [w.x, w.y, w.w, w.h, s(w.text), w.size].join(', ') + ')'); break;
          case 'slider': o.push('    draw_slider(' + [w.x, w.y, w.w, w.h, frac(w, fl(w.value))].join(', ') + ')'); break;
          case 'switch': o.push('    draw_switch(' + [w.x, w.y, w.w, w.h, w.checked ? 'True' : 'False'].join(', ') + ')'); break;
          case 'checkbox': o.push('    draw_check(' + [w.x, w.y, w.size, w.checked ? 'True' : 'False', s(w.text)].join(', ') + ')'); break;
          case 'bar': o.push('    draw_bar(' + [w.x, w.y, w.w, w.h, frac(w, val)].join(', ') + ')'); break;
          case 'gauge': o.push('    draw_gauge(' + [w.x, w.y, w.w, frac(w, val), '"%.' + gaugeDec(w) + 'f" % ' + val, s(w.text || '')].join(', ') + ')'); break;
          case 'chart': o.push('    draw_chart(' + [w.x, w.y, w.w, w.h, n + '_data', fl(w.min), fl(w.max)].join(', ') + ')'); break;
          case 'icon': { const b = iconBits(w.icon); o.push('    draw_icon(' + [w.x, w.y, 'icon_' + ident(w.icon), b.w, b.h, w.size].join(', ') + ')'); break; }
          case 'list': o.push('    draw_list(' + [w.x, w.y, w.w, '(' + listItems(w).map(x => cq(pyAscii(x))).join(', ') + (listItems(w).length === 1 ? ',' : '') + ')', w.sel | 0, w.size].join(', ') + ')'); break;
        }
      }
      o.push('    oled.show()                    # nothing shows until the buffer is sent', '');
    }
    o.push('screens = (' + c.scrs.map(s => s.draw).join(', ') + (c.scrs.length === 1 ? ',' : '') + ')', 'screens[screen]()', 'was = 1', 'last = time.ticks_ms()', 't0 = last', 'while True:', '    now = button.value()', '    if was == 1 and now == 0:            # pressed: the next screen', '        screen = (screen + 1) % len(screens)', '        print("show screen", (' + c.scrs.map(s => cq(s.s.name)).join(', ') + (c.scrs.length === 1 ? ',' : '') + ')[screen])', '        screens[screen]()', '    was = now');
    if (c.bound.length) {
      o.push('    if time.ticks_diff(time.ticks_ms(), last) >= 500:   # the demo data, twice a second: put your sensor readings here', '        last = time.ticks_ms()', '        t = time.ticks_diff(last, t0) / 1000');
      if (c.bound.some(w => w.bind === 'room')) o.push('        room = 21 + 1.5 * math.sin(t * 2 * math.pi / 40) + 0.25 * math.sin(t * 2 * math.pi / 7)');
      if (c.bound.some(w => w.bind === 'sine')) o.push('        sine = 0.5 + 0.5 * math.sin(t * 2 * math.pi / 20)');
      for (const w of c.bound) if (w.bind === 'walk') o.push('        walk_' + c.nm(w) + ' = min(1, max(0, walk_' + c.nm(w) + ' + random.uniform(-0.04, 0.04)))');
      for (const w of c.bound) if (w.type === 'chart') o.push('        ' + c.nm(w) + '_data.pop(0)', '        ' + c.nm(w) + '_data.append(' + demoExpr(c, w) + ')');
      o.push('        screens[screen]()');
    }
    o.push('    time.sleep_ms(20)');
    return o.join('\n');
  }
  T.displaylab.gen.gui = genGui;
  T.displaylab.gen.defaultDesign = defaultDesign;
  T.displaylab.gen.targets = TARGETS;

  /* ================================================================ shared by draw and the catalogue: what a module costs */
  const busOf = d => (d.bus || []).join(' · ');
  /* full-screen refreshes per second, and how that was worked out */
  function rateOf(d) {
    const b = (d.bus || [])[0] || '', all = busOf(d);
    if (d.kind === 'character') return { fps: null, how: 'a few milliseconds per character through the I2C backpack' };
    if (d.kind === 'segment') return { fps: null, how: 'a handful of bytes per update' };
    if (d.epaper) return { fps: null, how: 'limited by the panel: a full refresh takes 1–3 s' };
    if (/HUB75/.test(all)) return { fps: null, how: 'scanned continuously by DMA; the picture is redrawn from RAM' };
    if (/MIPI/.test(all)) return { fps: null, how: 'streamed continuously by the MIPI-DSI interface' };
    if (/RGB parallel/.test(all)) return { fps: G.busFps(d.w, d.h, 1, 16e6, 0.25), how: 'streamed from PSRAM at a 16 MHz pixel clock, blanking included' };
    if (/QSPI/.test(b)) return { fps: G.busFps(d.w, d.h, 16, 4 * 40e6), how: 'over QSPI: four data lines at 40 MHz' };
    if (/one data pin/.test(b)) return { fps: 1 / (d.w * d.h * 24 / 800e3 + 300e-6), how: '24 bits per LED at 800 kHz' };
    if (/SPI-like/.test(b)) return { fps: null, how: '16 bits per row and module; trivial' };
    if (/I2C/.test(b)) return { fps: G.i2cFps(d.w, d.h, 400e3), how: 'over I2C at 400 kHz' };
    if (/parallel/.test(b)) return { fps: G.busFps(d.w, d.h, 2, 20e6), how: 'over the 8-bit parallel bus at 20 MHz (two writes per pixel)' };
    const bits = d.depth === 1 ? 1 : d.depth === 18 ? 24 : d.depth, hz = d.id === 'pcd8544' ? 4e6 : d.depth === 1 ? 10e6 : 40e6;
    return { fps: G.busFps(d.w, d.h, bits, hz), how: 'over SPI at ' + hz / 1e6 + ' MHz' + (d.depth === 18 ? ' (three bytes per pixel)' : d.depth === 1 ? ', the controller\'s limit' : '') };
  }
  function pinsOf(d) {
    const b = (d.bus || [])[0] || '';
    if (d.kind === 'character') return '6 (RS, E, D4–D7), or 2 with the I2C backpack';
    if (/I2C/.test(b)) return '2 (SDA, SCL)';
    if (/CLK\/DIO/.test(b)) return '2 (CLK, DIO)';
    if (/SPI-like/.test(b)) return '3 (DIN, CLK, CS)';
    if (/BUSY/.test(b)) return '6 (SCK, MOSI, CS, DC, RST, BUSY)';
    if (/HUB75/.test(b)) return '13';
    if (/one data pin/.test(b)) return '1';
    if (/MIPI/.test(b)) return 'the dedicated MIPI-DSI pins';
    if (/RGB parallel/.test(b)) return 'about 20 (16 colour, PCLK, HSYNC, VSYNC, DE)';
    if (/QSPI/.test(b)) return '7 (CS, SCK, four data, RST)';
    if (/parallel/.test(b)) return '12–14 (8 data, WR, DC, CS, RST …)';
    return d.depth === 1 ? '5 (SCK, MOSI, CS, DC, RST)' : '5–6 (SCK, MOSI, CS, DC, RST, backlight)';
  }

  /* ================================================================ draw: graphics by hand */
  const OPS = {
    clear: { name: 'Clear the screen', f: [] },
    text: { name: 'Text', f: ['x', 'y', 'size'], text: true },
    pixel: { name: 'Pixel', f: ['x', 'y'] },
    line: { name: 'Line', f: ['x0', 'y0', 'x1', 'y1'] },
    rect: { name: 'Rectangle', f: ['x', 'y', 'w', 'h'] },
    fillRect: { name: 'Filled rectangle', f: ['x', 'y', 'w', 'h'] },
    roundRect: { name: 'Rounded rectangle', f: ['x', 'y', 'w', 'h', 'r'] },
    fillRoundRect: { name: 'Filled rounded rect.', f: ['x', 'y', 'w', 'h', 'r'] },
    circle: { name: 'Circle', f: ['x', 'y', 'r'] },
    fillCircle: { name: 'Filled circle', f: ['x', 'y', 'r'] },
    triangle: { name: 'Triangle', f: ['x0', 'y0', 'x1', 'y1', 'x2', 'y2'] },
    fillTriangle: { name: 'Filled triangle', f: ['x0', 'y0', 'x1', 'y1', 'x2', 'y2'] },
    arc: { name: 'Arc', f: ['x', 'y', 'r', 'a0', 'a1', 't'] },
    icon: { name: 'Icon (bitmap)', f: ['x', 'y'], icon: true }
  };
  const FLABEL = { x: 'x', y: 'y', w: 'w', h: 'h', r: 'r', size: 'size', x0: 'x0', y0: 'y0', x1: 'x1', y1: 'y1', x2: 'x2', y2: 'y2', a0: 'from°', a1: 'to°', t: 'thick' };
  const DCOL = ['white', 'grey', 'red', 'orange', 'yellow', 'lime', 'green', 'cyan', 'blue', 'purple', 'pink', 'black'];
  const dcol = (name, mono) => mono ? (name === 'black' ? 0 : 1) : name === 'black' ? 0x000000 : PAL[name] != null ? PAL[name] : 0xFFFFFF;
  const drawables = () => G.DISPLAYS.filter(d => d.w && d.h);
  function drawExample(d) {
    const k = Math.max(0.3, Math.min(d.w / 128, d.h / 64)), ox = Math.round((d.w - 128 * k) / 2), oy = Math.round((d.h - 64 * k) / 2);
    const X = v => Math.round(ox + v * k), Y = v => Math.round(oy + v * k), R = v => Math.max(1, Math.round(v * k)), mono = d.depth === 1;
    const C = (col, monoCol) => mono ? (monoCol || 'white') : col;
    return [
      { op: 'clear', c: mono ? 'black' : 'black' },
      { op: 'text', x: X(4), y: Y(2), size: Math.max(1, Math.round(k)), text: 'Hello, ESP32!', c: C('white') },
      { op: 'line', x0: X(0), y0: Y(12), x1: X(127), y1: Y(12), c: C('grey') },
      { op: 'circle', x: X(20), y: Y(38), r: R(14), c: C('cyan') },
      { op: 'fillCircle', x: X(20), y: Y(38), r: R(8), c: C('orange') },
      { op: 'fillTriangle', x0: X(40), y0: Y(56), x1: X(56), y1: Y(22), x2: X(72), y2: Y(56), c: C('green') },
      { op: 'roundRect', x: X(80), y: Y(18), w: R(44), h: R(42), r: R(6), c: C('blue') },
      { op: 'arc', x: X(102), y: Y(39), r: R(15), a0: -135, a1: 90, t: R(3), c: C('yellow') },
      { op: 'icon', icon: 'heart', x: X(99), y: Y(36), c: C('red') }
    ];
  }
  const drw = { disp: 'ssd1306-128x64', cmds: null, sel: 0 };
  if (saved.draw) {
    if (saved.draw.disp && G.display(saved.draw.disp) && G.display(saved.draw.disp).w) drw.disp = saved.draw.disp;
    if (Array.isArray(saved.draw.cmds)) drw.cmds = saved.draw.cmds.filter(c => c && OPS[c.op]).slice(0, 60).map(c => { const o = { op: c.op, c: DCOL.includes(c.c) ? c.c : 'white' }; for (const k of OPS[c.op].f) o[k] = int(c[k], 0); if (OPS[c.op].text) o.text = String(c.text || '').slice(0, 40); if (OPS[c.op].icon) o.icon = ICONS.includes(c.icon) ? c.icon : 'heart'; return o; });
  }
  /* run the commands on a frame buffer */
  function runCmds(fb, cmds, mono) {
    for (const c of cmds) {
      const col = dcol(c.c, mono), q = k => num(c[k], 0);
      switch (c.op) {
        case 'clear': fb.clear(col); break;
        case 'text': fb.text(c.text || '', q('x'), q('y'), { size: clamp(q('size'), 1, 8), color: col }); break;
        case 'pixel': fb.pixel(q('x'), q('y'), col); break;
        case 'line': fb.line(q('x0'), q('y0'), q('x1'), q('y1'), col); break;
        case 'rect': fb.rect(q('x'), q('y'), Math.max(0, q('w')), Math.max(0, q('h')), col); break;
        case 'fillRect': fb.fillRect(q('x'), q('y'), Math.max(0, q('w')), Math.max(0, q('h')), col); break;
        case 'roundRect': fb.roundRect(q('x'), q('y'), Math.max(1, q('w')), Math.max(1, q('h')), Math.max(0, q('r')), col); break;
        case 'fillRoundRect': fb.fillRoundRect(q('x'), q('y'), Math.max(1, q('w')), Math.max(1, q('h')), Math.max(0, q('r')), col); break;
        case 'circle': fb.circle(q('x'), q('y'), Math.max(0, q('r')), col); break;
        case 'fillCircle': fb.fillCircle(q('x'), q('y'), Math.max(0, q('r')), col); break;
        case 'triangle': fb.triangle(q('x0'), q('y0'), q('x1'), q('y1'), q('x2'), q('y2'), col); break;
        case 'fillTriangle': fb.fillTriangle(q('x0'), q('y0'), q('x1'), q('y1'), q('x2'), q('y2'), col); break;
        case 'arc': fb.arc(q('x'), q('y'), Math.max(1, q('r')), q('a0'), q('a1'), clamp(q('t'), 1, 200), col); break;
        case 'icon': paintIcon(fb, c.icon, q('x'), q('y'), 1, col); break;
      }
    }
  }
  const drawStyle = d => d.epaper ? 'epaper' : d.id === 'pcd8544' ? 'lcd' : d.kind === 'matrix' && d.depth === 1 ? 'led' : d.depth === 1 ? 'oled' : 'tft';

  function drawTab(body) {
    const kit = K();
    let d = G.display(drw.disp) || G.display('ssd1306-128x64');
    if (!drw.cmds) drw.cmds = drawExample(d);
    body.innerHTML = '<p class="muted" style="margin:0 0 12px">Every graphics library offers the same few calls: clear, pixel, line, rectangle, circle, triangle, text and bitmap. Build a picture from them here, on any display of the catalogue: the dots change as you type, a click on the screen moves the selected command there, and the program below makes the same picture on the real module.</p>' +
      '<div class="esplab"><div class="side"><div class="dr-ctl"></div><div class="dr-ro"></div></div><div style="min-width:0"><div class="stage"></div><div class="dr-list"></div></div></div><div class="dr-code" style="margin-top:14px"></div>' +
      more(['drawing-primitives', 'pixels-and-framebuffers', 'fonts', 'images-and-icons', 'oled-ssd1306', 'colour-tft-displays', 'graphics-libraries', 'frame-rate-and-bus-speed', 'flicker-and-double-buffering']);
    const $ = s => ui.$(s, body), listEl = $('.dr-list'), codeEl = $('.dr-code'), stageEl = $('.stage');
    const st = kit.stage(stageEl, { aspect: 0.62, minH: 300, maxH: 620 });
    const list = drawables();
    let fb = null, L = { s: 1, ox: 0, oy: 0 }, codeT = 0;
    const mono = () => d.depth === 1;
    const ctl = kit.controls($('.dr-ctl'), [
      { id: 'disp', type: 'select', label: 'Display', options: list.map(x => [x.name, x.id]), value: d.id },
      { type: 'html', html: '<b>Add a command</b> — it goes after the selected one' },
      { type: 'buttons', items: Object.keys(OPS).map(k => ({ id: 'add:' + k, label: OPS[k].name })) },
      { type: 'html', html: '<b>The selected command</b>' },
      { type: 'buttons', items: [{ id: 'up', label: 'Earlier' }, { id: 'down', label: 'Later' }, { id: 'del', label: 'Delete' }, { id: 'example', label: 'Example picture' }, { id: 'none', label: 'Start empty' }] }
    ], (id, v) => {
      if (id === 'disp') {
        const nd = G.display(v);
        if (!nd || !nd.w) return;
        const wasMono = mono();
        d = nd; drw.disp = nd.id; fb = null;
        if (wasMono !== mono()) for (const c of drw.cmds) c.c = mono() ? (c.c === 'black' ? 'black' : 'white') : (c.c === 'black' ? 'black' : c.c);
        refresh(true); return;
      }
      if (id.indexOf('add:') === 0) {
        const op = id.slice(4), cx = d.w >> 1, cy = d.h >> 1, m = Math.max(4, Math.round(Math.min(d.w, d.h) / 5));
        const c = { op, c: op === 'clear' ? 'black' : mono() ? 'white' : ['cyan', 'orange', 'green', 'yellow', 'pink', 'blue'][drw.cmds.length % 6] };
        const def = { x: cx - m, y: cy - m, w: 2 * m, h: m + (m >> 1), r: op === 'roundRect' || op === 'fillRoundRect' ? Math.max(2, m >> 2) : m, size: 1, x0: cx - m, y0: cy + m, x1: cx + m, y1: cy - m, x2: cx + m, y2: cy + m, a0: -120, a1: 120, t: Math.max(2, m >> 2) };
        if (op === 'circle' || op === 'fillCircle' || op === 'arc') { def.x = cx; def.y = cy; }
        if (op === 'text') { def.x = Math.max(0, cx - 30); def.y = cy - 4; }
        if (op === 'pixel' || op === 'icon') { def.x = cx; def.y = cy; }
        for (const k of OPS[op].f) c[k] = def[k];
        if (OPS[op].text) c.text = 'Text';
        if (OPS[op].icon) c.icon = 'heart';
        const at = drw.cmds.length ? clamp(drw.sel + 1, 0, drw.cmds.length) : 0;
        drw.cmds.splice(at, 0, c); drw.sel = at;
      } else if (id === 'example') { drw.cmds = drawExample(d); drw.sel = 0; }
      else if (id === 'none') { drw.cmds = [{ op: 'clear', c: 'black' }]; drw.sel = 0; }
      else {
        const i = drw.sel;
        if (!drw.cmds[i]) return;
        if (id === 'up' && i > 0) { const t = drw.cmds[i - 1]; drw.cmds[i - 1] = drw.cmds[i]; drw.cmds[i] = t; drw.sel--; }
        else if (id === 'down' && i < drw.cmds.length - 1) { const t = drw.cmds[i + 1]; drw.cmds[i + 1] = drw.cmds[i]; drw.cmds[i] = t; drw.sel++; }
        else if (id === 'del') { drw.cmds.splice(i, 1); drw.sel = clamp(i, 0, Math.max(0, drw.cmds.length - 1)); }
      }
      refresh(true);
    });
    const ro = kit.readout($('.dr-ro'), [['px', 'Under the pointer'], ['size', 'Pixels'], ['mem', 'Frame buffer'], ['fps', 'Full-screen refresh'], ['calls', 'Drawing calls']]);
    function paint() {
      if (!fb || fb.w !== d.w || fb.h !== d.h) fb = G.fb(d.w, d.h, { depth: mono() ? 1 : 16 });
      fb.clear(0);
      runCmds(fb, drw.cmds, mono());
      if (!mono() && d.depth === 16) for (let i = 0; i < fb.px.length; i++) fb.px[i] = G.quantize565(fb.px[i]);
      const c = st.begin(), Cc = kit.colors();
      L = fit(st.W, st.H, d.w, d.h, 20);
      G.draw(c, fb, L.ox, L.oy, L.s, { style: drawStyle(d), round: d.round, on: d.id.indexOf('ssd1306') === 0 ? '#e8f4ff' : undefined });
      S().text(c, d.name + (L.s !== 1 ? ' · drawn ' + L.s + '×' : ''), st.W / 2, L.oy + d.h * L.s + 17, { size: 12, color: Cc.muted });
      const cmd = drw.cmds[drw.sel];
      if (cmd && cmd.op !== 'clear') {
        const a = anchor(cmd);
        c.save(); c.strokeStyle = Cc.accent; c.lineWidth = 1.5; const ax = L.ox + (a.x + 0.5) * L.s, ay = L.oy + (a.y + 0.5) * L.s;
        c.beginPath(); c.moveTo(ax - 9, ay); c.lineTo(ax - 3, ay); c.moveTo(ax + 3, ay); c.lineTo(ax + 9, ay); c.moveTo(ax, ay - 9); c.lineTo(ax, ay - 3); c.moveTo(ax, ay + 3); c.lineTo(ax, ay + 9); c.stroke(); c.restore();
      }
    }
    const anchor = cmd => cmd.x0 != null ? { x: num(cmd.x0, 0), y: num(cmd.y0, 0) } : { x: num(cmd.x, 0), y: num(cmd.y, 0) };
    const loop = kit.loop(() => paint(), stageEl);
    function facts() {
      const r = rateOf(d), fbB = G.frameBytes(d.w, d.h, d.depth);
      ro.set('size', d.w + ' × ' + d.h + ' = ' + thou(d.w * d.h));
      ro.set('mem', bytes(fbB) + (d.depth === 1 ? ' (1 bit per pixel)' : ' (' + (d.depth <= 16 ? 2 : 3) + ' bytes per pixel)'));
      ro.set('fps', r.fps != null ? f(r.fps, r.fps < 10 ? 1 : 0) + ' per second' : '—');
      ro.set('calls', String(drw.cmds.length));
      ro.set('px', '—');
    }
    function listHtml() {
      const m = mono();
      listEl.innerHTML = '<div class="dr-cmds">' + drw.cmds.map((c, i) => {
        const o = OPS[c.op];
        const fields = o.f.map(k => '<label>' + FLABEL[k] + '<input type="number" data-k="' + k + '" value="' + esc(String(c[k] == null ? 0 : c[k])) + '"></label>').join('');
        const extra = (o.text ? '<label class="wide">text<input type="text" data-k="text" maxlength="40" value="' + esc(c.text || '') + '"></label>' : '') +
          (o.icon ? '<label>icon<select data-k="icon">' + ICONS.map(n => '<option' + (n === c.icon ? ' selected' : '') + '>' + n + '</option>').join('') + '</select></label>' : '');
        const cols = m ? [['white', 'on'], ['black', 'off']] : DCOL.map(k => [k, k]);
        const colSel = '<label>' + (c.op === 'clear' ? 'fill' : 'colour') + '<select data-k="c">' + cols.map(([k, t]) => '<option value="' + k + '"' + (k === (m ? (c.c === 'black' ? 'black' : 'white') : c.c) ? ' selected' : '') + '>' + t + '</option>').join('') + '</select></label>';
        return '<div class="dr-row' + (i === drw.sel ? ' on' : '') + '" data-i="' + i + '"><span class="dr-n">' + (i + 1) + '</span><b>' + o.name + '</b>' + fields + extra + colSel + '<button class="btn sm ghost" data-del="' + i + '" title="Delete">×</button></div>';
      }).join('') + '</div>' + (drw.cmds.length ? '' : '<p class="muted">No commands: add one from the left.</p>');
    }
    listEl.addEventListener('click', e => {
      const del = e.target.closest('[data-del]');
      if (del) { drw.cmds.splice(+del.dataset.del, 1); drw.sel = clamp(drw.sel, 0, Math.max(0, drw.cmds.length - 1)); refresh(true); return; }
      const row = e.target.closest('[data-i]');
      if (row && +row.dataset.i !== drw.sel) { drw.sel = +row.dataset.i; ui.$$('.dr-row', listEl).forEach(r => r.classList.toggle('on', +r.dataset.i === drw.sel)); loop.once(); }
    });
    const edit = (e, final) => {
      const k = e.target.dataset && e.target.dataset.k, row = e.target.closest('[data-i]');
      if (!k || !row) return;
      const c = drw.cmds[+row.dataset.i];
      if (!c) return;
      if (k === 'text') c.text = String(e.target.value).slice(0, 40);
      else if (k === 'icon') c.icon = ICONS.includes(e.target.value) ? e.target.value : 'heart';
      else if (k === 'c') c.c = DCOL.includes(e.target.value) ? e.target.value : 'white';
      else c[k] = clamp(int(e.target.value, c[k] || 0), -4000, 4000);
      if (drw.sel !== +row.dataset.i) { drw.sel = +row.dataset.i; ui.$$('.dr-row', listEl).forEach(r => r.classList.toggle('on', +r.dataset.i === drw.sel)); }
      persist(); loop.once(); ro.set('calls', String(drw.cmds.length));
      clearTimeout(codeT); if (final) regen(); else codeT = setTimeout(regen, 400);
    };
    listEl.addEventListener('input', e => edit(e, false));
    listEl.addEventListener('change', e => edit(e, true));
    kit.click(st, p => {
      const q = G.pick(fb || { w: d.w, h: d.h }, L.ox, L.oy, L.s, p.x, p.y), c = drw.cmds[drw.sel];
      if (!q || !c || c.op === 'clear') return;
      const a = anchor(c), dx = q.x - a.x, dy = q.y - a.y;
      for (const k of OPS[c.op].f) { if (/^x\d?$/.test(k)) c[k] = num(c[k], 0) + dx; else if (/^y\d?$/.test(k)) c[k] = num(c[k], 0) + dy; }
      refresh(true);
    }, p => !!G.pick({ w: d.w, h: d.h }, L.ox, L.oy, L.s, p.x, p.y));
    st.canvas.addEventListener('pointermove', e => {
      const p = st.pos(e), q = fb && G.pick(fb, L.ox, L.oy, L.s, p.x, p.y);
      if (!q) { ro.set('px', '—'); return; }
      const v = fb.get(q.x, q.y);
      ro.set('px', 'x ' + q.x + ', y ' + q.y + ' — ' + (mono() ? (v ? 'lit' : 'dark') : G.css(v)));
    });
    st.canvas.addEventListener('pointerleave', () => ro.set('px', '—'));
    function regen() { code(codeEl, genDraw(d, drw.cmds)); }
    function refresh(withCode) { persist(); listHtml(); facts(); loop.once(); if (withCode) { clearTimeout(codeT); regen(); } }
    st.onResize(() => loop.once());
    onTheme(() => loop.once());
    refresh(true);
  }

  /* ---------------------------------------------------------------- draw: the program */
  function drawDriver(d) {
    if (/^ssd1306/.test(d.id)) return 'ssd1306';
    if (d.epaper) return 'epd';
    if (/^(st7735|st7789|ili9341|ili9488|st7796|gc9a01)/.test(d.id)) return 'tft';
    return 'canvas';
  }
  const DRIVER_HINT = { pcd8544: 'the Adafruit PCD8544 library', 'sh1106-128x64': 'a driver for the SH1106 that speaks the Adafruit GFX calls (Adafruit SH110X), or U8g2', 'ssd1309-128x64': 'U8g2, which has SSD1309 drivers', 'max7219-8x8': 'MD_MAX72XX (and MD_Parola for scrolling text)',
    'rgb-800x480': 'Arduino_GFX (its ESP32 RGB panel bus) or LovyanGFX, on an ESP32-S3 with PSRAM', 'mipi-1024x600': 'ESP-IDF\'s esp_lcd MIPI-DSI driver on an ESP32-P4', 'amoled-536x240': 'Arduino_GFX or LovyanGFX, which have QSPI panel drivers',
    'hub75-64x32': 'ESP32-HUB75-MatrixPanel-DMA, which speaks the Adafruit GFX calls', 'ws2812-matrix': 'Adafruit NeoMatrix (on Adafruit NeoPixel), which speaks the Adafruit GFX calls' };
  const swap565 = c => { const v = G.rgb565((c >> 16) & 255, (c >> 8) & 255, c & 255); return '0x' + (((v & 0xFF) << 8) | (v >> 8)).toString(16).toUpperCase().padStart(4, '0'); };
  function genDraw(d, cmds) {
    const drv = drawDriver(d), mono = d.depth === 1, obj = drv === 'tft' ? 'tft' : 'display';
    const used = new Set(cmds.map(c => c.op)), icons = [...new Set(cmds.filter(c => c.op === 'icon').map(c => c.icon))];
    const q = (c, k) => int(c[k], 0);
    const colC = name => drv === 'ssd1306' ? (dcol(name, true) ? 'SSD1306_WHITE' : 'SSD1306_BLACK') : drv === 'epd' ? (dcol(name, true) ? 'GxEPD_BLACK' : 'GxEPD_WHITE') : mono ? String(dcol(name, true)) : hex565(dcol(name, false));
    const T_ = [];
    for (const c of cmds) {
      const col = colC(c.c);
      switch (c.op) {
        case 'clear': T_.push(obj + '.fillScreen(' + col + ');'); break;
        case 'text': T_.push(obj + '.setTextSize(' + clamp(q(c, 'size'), 1, 8) + ');', obj + '.setTextColor(' + col + ');', obj + '.setCursor(' + q(c, 'x') + ', ' + q(c, 'y') + ');', obj + '.print(' + gfxStr(c.text || '') + ');'); break;
        case 'pixel': T_.push(obj + '.drawPixel(' + q(c, 'x') + ', ' + q(c, 'y') + ', ' + col + ');'); break;
        case 'line': T_.push(obj + '.drawLine(' + ['x0', 'y0', 'x1', 'y1'].map(k => q(c, k)).join(', ') + ', ' + col + ');'); break;
        case 'rect': case 'fillRect': T_.push(obj + '.' + (c.op === 'rect' ? 'drawRect' : 'fillRect') + '(' + ['x', 'y', 'w', 'h'].map(k => q(c, k)).join(', ') + ', ' + col + ');'); break;
        case 'roundRect': case 'fillRoundRect': T_.push(obj + '.' + (c.op === 'roundRect' ? 'drawRoundRect' : 'fillRoundRect') + '(' + ['x', 'y', 'w', 'h', 'r'].map(k => q(c, k)).join(', ') + ', ' + col + ');'); break;
        case 'circle': case 'fillCircle': T_.push(obj + '.' + (c.op === 'circle' ? 'drawCircle' : 'fillCircle') + '(' + ['x', 'y', 'r'].map(k => q(c, k)).join(', ') + ', ' + col + ');'); break;
        case 'triangle': case 'fillTriangle': T_.push(obj + '.' + (c.op === 'triangle' ? 'drawTriangle' : 'fillTriangle') + '(' + ['x0', 'y0', 'x1', 'y1', 'x2', 'y2'].map(k => q(c, k)).join(', ') + ', ' + col + ');'); break;
        case 'arc': T_.push('drawArcDots(' + ['x', 'y', 'r', 'a0', 'a1', 't'].map(k => q(c, k)).join(', ') + ', ' + col + ');'); break;
        case 'icon': { const p = packRows(iconBits(c.icon).rows); T_.push(obj + '.drawBitmap(' + q(c, 'x') + ', ' + q(c, 'y') + ', icon_' + ident(c.icon) + ', ' + p.w + ', ' + p.h + ', ' + col + ');'); break; }
      }
    }
    const colType = drv === 'canvas' && !mono ? 'uint16_t' : 'uint16_t';
    const arcFn = used.has('arc') ? ['// the graphics library has no arc: every dot between radius r - t and r whose angle (clockwise from 12 o\'clock) lies in a0 … a1',
      'void drawArcDots(int cx, int cy, int r, float a0, float a1, int t, ' + colType + ' c) {', '  for (int dy = -r; dy <= r; dy++)', '    for (int dx = -r; dx <= r; dx++) {', '      float d = sqrtf(dx * dx + dy * dy), a = atan2f(dx, -dy) * 180 / PI;',
      '      if (a < a0) a += 360;', '      if (d <= r + 0.5f && d >= r - t - 0.5f && a >= a0 && a <= a1) ' + obj + '.drawPixel(cx + dx, cy + dy, c);', '    }', '}', ''] : [];
    const iconData = icons.map(n => { const p = packRows(iconBits(n).rows); return 'const unsigned char icon_' + ident(n) + '[] PROGMEM = { ' + p.bytes.map(hx2).join(', ') + ' };   // ' + p.w + ' × ' + p.h; });
    const o = ['// A picture of ' + cmds.length + ' drawing calls on a ' + d.name + ' — written by the Draw tab of Hyper ESP32'];
    if (drv === 'ssd1306') {
      o.push('#include <Wire.h>', '#include <Adafruit_GFX.h>', '#include <Adafruit_SSD1306.h>', '', '// ======== adapt to your board ========', 'Adafruit_SSD1306 display(' + d.w + ', ' + d.h + ', &Wire, -1);   // width, height, the I2C bus, no reset pin',
        ...(d.id === 'ssd1306-72x40' ? ['// the 72 × 40 glass sits in the middle of the controller\'s 128 × 64 memory: this driver needs an offset (U8g2 knows the panel)'] : []), '// ======== end of the board section ========', '');
    } else if (drv === 'tft') {
      o.push('#include <TFT_eSPI.h>', '', '// ======== adapt to your board ========', '// TFT_eSPI takes the driver chip (' + d.id.split('-')[0].toUpperCase() + ') and the pins from its User_Setup.h or build flags, not from this sketch.', 'TFT_eSPI tft;', '// ======== end of the board section ========', '');
    } else if (drv === 'epd') {
      o.push('#include <GxEPD2_BW.h>', '', '// ======== adapt to your board: choose your panel\'s class from GxEPD2\'s examples (GxEPD2_display_selection_new_style.h) ========', '#define PANEL GxEPD2_154_D67          // the 1.54″ panel; put the class of your ' + d.size + '″ panel here',
        'GxEPD2_BW<PANEL, PANEL::HEIGHT> display(PANEL(/*CS=*/ 5, /*DC=*/ 17, /*RST=*/ 16, /*BUSY=*/ 4));', '// ======== end of the board section ========', '');
    } else {
      o.push('#include <Adafruit_GFX.h>', '', '// ======== adapt to your board ========', '// The picture is drawn in RAM with Adafruit GFX\'s canvas, which has all the usual drawing calls. To show it, send', '// display.getBuffer() to the panel with ' + (DRIVER_HINT[d.id] || 'a driver for it') + ' — or draw on that driver\'s own object instead.',
        (mono ? 'GFXcanvas1 display(' + d.w + ', ' + d.h + ');               // 1 bit per pixel: ' : 'GFXcanvas16 display(' + d.w + ', ' + d.h + ');              // 2 bytes per pixel (RGB565): ') + bytes(G.frameBytes(d.w, d.h, mono ? 1 : 16)) + (!mono && G.frameBytes(d.w, d.h, 16) > 120000 ? ', so it needs PSRAM' : ''), '// ======== end of the board section ========', '');
    }
    if (iconData.length) o.push(...iconData, '');
    o.push(...arcFn);
    o.push('void drawPicture() {', ...T_.map(l => '  ' + l), '}', '');
    o.push('void setup() {', '  Serial.begin(115200);');
    if (drv === 'ssd1306') o.push('  Wire.begin(21, 22);', '  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { Serial.println("no SSD1306 at 0x3C"); while (true) delay(1000); }', '  display.cp437(true);                   // the real code page 437 (° is \\xF8)', '  drawPicture();', '  display.display();                     // nothing shows until the buffer is sent');
    else if (drv === 'tft') o.push('  tft.init();', '  tft.setRotation(' + (d.w > d.h ? 1 : 0) + ');', '  drawPicture();');
    else if (drv === 'epd') o.push('  display.init(115200);', '  display.setRotation(1);', '  display.cp437(true);', '  display.setFullWindow();', '  display.firstPage();', '  do {', '    drawPicture();                       // GxEPD2 draws a page at a time: the same picture for each page', '  } while (display.nextPage());', '  display.hibernate();                   // the picture stays without power');
    else o.push('  display.cp437(true);', '  drawPicture();', '  // send display.getBuffer() to the panel here (see the board section)');
    o.push('}', '', 'void loop() {', '}');
    return {
      title: 'The picture on a ' + d.name, about: 'The commands of the list as calls of ' + (drv === 'tft' ? 'TFT_eSPI' : drv === 'epd' ? 'GxEPD2' : 'Adafruit GFX') + ' (C++) and of MicroPython\'s built-in framebuf, in the same order — later commands draw over earlier ones.',
      needs: 'An ESP32 board and a ' + d.name + '.', libs: drv === 'ssd1306' ? ['Adafruit SSD1306', 'Adafruit GFX Library'] : drv === 'tft' ? ['TFT_eSPI (Bodmer)'] : drv === 'epd' ? ['GxEPD2', 'Adafruit GFX Library'] : ['Adafruit GFX Library'],
      wiring: drv === 'ssd1306' ? [['GPIO21 (SDA)', 'OLED SDA'], ['GPIO22 (SCL)', 'OLED SCL'], ['3V3 / GND', 'VCC / GND']] : drv === 'epd' ? [['GPIO18 / GPIO23', 'SCK / MOSI (DIN)'], ['GPIO5', 'CS'], ['GPIO17', 'DC'], ['GPIO16', 'RST'], ['GPIO4', 'BUSY']] : undefined,
      blocks: drawBlocks(d, cmds), cpp: o.join('\n'), py: drawPy(d, cmds, drv),
      notes: ['The 5 × 7 font of the preview is Adafruit GFX\'s classic font; MicroPython\'s framebuf has an 8 × 8 font, so its text is wider.', drv === 'tft' ? 'Colours are RGB565: 5 bits of red, 6 of green, 5 of blue — tft.color565(r, g, b) computes them.' : mono ? 'A monochrome panel has two colours: lit (1) and dark (0).' : 'Colours are RGB565 numbers: 5 bits of red, 6 of green, 5 of blue.']
    };
  }
  function drawPy(d, cmds, drv) {
    const mono = d.depth === 1, used = new Set(cmds.map(c => c.op)), icons = [...new Set(cmds.filter(c => c.op === 'icon').map(c => c.icon))], q = (c, k) => int(c[k], 0);
    const col = name => mono ? String(dcol(name, true)) : swap565(dcol(name, false));
    const o = ['# A picture of ' + cmds.length + ' drawing calls on a ' + d.name.replace(/[″×–]/g, m => ({ '″': '"', '×': 'x', '–': '-' })[m]) + ' - written by the Draw tab of Hyper ESP32', 'from machine import Pin, I2C, SPI', 'import framebuf' + (used.has('arc') ? ', math' : '') + (used.has('triangle') || used.has('fillTriangle') ? '\nfrom array import array' : ''), ''];
    o.push('# ======== adapt to your board ========');
    if (drv === 'ssd1306') o.push('import ssd1306                      # not in the firmware: mip.install("ssd1306") once', 'i2c = I2C(0, scl=Pin(22), sda=Pin(21))', 'fb = ssd1306.SSD1306_I2C(' + d.w + ', ' + d.h + ', i2c)        # the driver is a FrameBuffer: draw on it, then fb.show()', 'show = fb.show');
    else {
      const bytesN = mono ? Math.ceil(d.w / 8) * d.h : d.w * d.h * 2;
      o.push('W, H = ' + d.w + ', ' + d.h, mono ? 'buf = bytearray(' + Math.ceil(d.w / 8) + ' * H)            # 1 bit per pixel: ' + thou(bytesN) + ' bytes' : 'buf = bytearray(W * H * 2)            # RGB565, 2 bytes per pixel: ' + thou(bytesN) + ' bytes' + (bytesN > 100000 ? ' - more than a board without PSRAM can spare' : ''),
        'fb = framebuf.FrameBuffer(buf, W, H, framebuf.' + (mono ? 'MONO_HLSB' : 'RGB565') + ')', '# MicroPython has no built-in driver for this panel: copy one to the board (' + (drv === 'tft' ? 'for an ST7789, russhughes\' st7789py' : drv === 'epd' ? 'an e-paper driver for your panel' : 'one for ' + d.name.replace(/[″×–]/g, ' ')) + ')', '# and send buf to it in show().',
        'def show():', '    pass                            # for example: tft.blit_buffer(buf, 0, 0, W, H)');
      if (!mono) o.push('# framebuf keeps the low byte first and SPI panels want the high byte first, so the colours below are byte-swapped');
    }
    o.push('# ======== end of the board section ========', '');
    if (used.has('text') && cmds.some(c => c.op === 'text' && q(c, 'size') > 1)) o.push('glyph = framebuf.FrameBuffer(bytearray(8), 8, 8, framebuf.MONO_HLSB)', 'def big_text(s, x, y, size, c):', '    # framebuf has one 8 x 8 font: each dot is copied as a size x size square', '    for ch in s:', '        glyph.fill(0)', '        glyph.text(ch, 0, 0, 1)', '        for j in range(8):', '            for i in range(8):', '                if glyph.pixel(i, j):', '                    fb.fill_rect(x + i * size, y + j * size, size, size, c)', '        x += 8 * size', '');
    if (used.has('roundRect') || used.has('fillRoundRect')) o.push('def round_rect(x, y, w, h, r, c, fill=False):', '    # framebuf has no rounded rectangle: four quarter ellipses and the straight parts', '    for cx, cy, q in ((x + w - 1 - r, y + r, 1), (x + r, y + r, 2), (x + r, y + h - 1 - r, 4), (x + w - 1 - r, y + h - 1 - r, 8)):', '        fb.ellipse(cx, cy, r, r, c, fill, q)',
      '    if fill:', '        fb.fill_rect(x + r, y, w - 2 * r, h, c)', '        fb.fill_rect(x, y + r, w, h - 2 * r, c)', '    else:', '        fb.hline(x + r, y, w - 2 * r, c)', '        fb.hline(x + r, y + h - 1, w - 2 * r, c)', '        fb.vline(x, y + r, h - 2 * r, c)', '        fb.vline(x + w - 1, y + r, h - 2 * r, c)', '');
    if (used.has('arc')) o.push('def arc_dots(cx, cy, r, a0, a1, t, c):', '    # framebuf has no arc: every dot between radius r - t and r whose angle (clockwise from 12 o\'clock) lies in a0 ... a1', '    for dy in range(-r, r + 1):', '        for dx in range(-r, r + 1):', '            d = math.sqrt(dx * dx + dy * dy)', '            a = math.degrees(math.atan2(dx, -dy))', '            if a < a0:', '                a += 360', '            if r - t - 0.5 <= d <= r + 0.5 and a0 <= a <= a1:', '                fb.pixel(cx + dx, cy + dy, c)', '');
    if (icons.length) {
      o.push('def draw_icon(x, y, bits, w, h, c):', '    for j in range(h):', '        for i in range(w):', '            if bits.pixel(i, j):', '                fb.pixel(x + i, y + j, c)', '');
      for (const n of icons) { const p = packRows(iconBits(n).rows); o.push('icon_' + ident(n) + ' = framebuf.FrameBuffer(bytearray(b"' + p.bytes.map(v => '\\x' + v.toString(16).padStart(2, '0')).join('') + '"), ' + p.bw * 8 + ', ' + p.h + ', framebuf.MONO_HLSB)   # ' + p.w + ' x ' + p.h); }
      o.push('');
    }
    for (const c of cmds) {
      const k = col(c.c);
      switch (c.op) {
        case 'clear': o.push('fb.fill(' + k + ')'); break;
        case 'text': o.push(q(c, 'size') > 1 ? 'big_text(' + cq(pyAscii(c.text || '').replace(/°/g, 'o')) + ', ' + q(c, 'x') + ', ' + q(c, 'y') + ', ' + clamp(q(c, 'size'), 1, 8) + ', ' + k + ')' : 'fb.text(' + cq(pyAscii(c.text || '').replace(/°/g, 'o')) + ', ' + q(c, 'x') + ', ' + q(c, 'y') + ', ' + k + ')'); break;
        case 'pixel': o.push('fb.pixel(' + q(c, 'x') + ', ' + q(c, 'y') + ', ' + k + ')'); break;
        case 'line': o.push('fb.line(' + ['x0', 'y0', 'x1', 'y1'].map(x => q(c, x)).join(', ') + ', ' + k + ')'); break;
        case 'rect': o.push('fb.rect(' + ['x', 'y', 'w', 'h'].map(x => q(c, x)).join(', ') + ', ' + k + ')'); break;
        case 'fillRect': o.push('fb.fill_rect(' + ['x', 'y', 'w', 'h'].map(x => q(c, x)).join(', ') + ', ' + k + ')'); break;
        case 'roundRect': case 'fillRoundRect': o.push('round_rect(' + ['x', 'y', 'w', 'h', 'r'].map(x => q(c, x)).join(', ') + ', ' + k + (c.op === 'fillRoundRect' ? ', True' : '') + ')'); break;
        case 'circle': case 'fillCircle': o.push('fb.ellipse(' + q(c, 'x') + ', ' + q(c, 'y') + ', ' + q(c, 'r') + ', ' + q(c, 'r') + ', ' + k + (c.op === 'fillCircle' ? ', True' : '') + ')'); break;
        case 'triangle': case 'fillTriangle': o.push('fb.poly(0, 0, array("h", [' + ['x0', 'y0', 'x1', 'y1', 'x2', 'y2'].map(x => q(c, x)).join(', ') + ']), ' + k + (c.op === 'fillTriangle' ? ', True' : '') + ')'); break;
        case 'arc': o.push('arc_dots(' + ['x', 'y', 'r', 'a0', 'a1', 't'].map(x => q(c, x)).join(', ') + ', ' + k + ')'); break;
        case 'icon': { const b = iconBits(c.icon); o.push('draw_icon(' + q(c, 'x') + ', ' + q(c, 'y') + ', icon_' + ident(c.icon) + ', ' + b.w + ', ' + b.h + ', ' + k + ')'); break; }
      }
    }
    o.push('show()                              # nothing shows until the buffer is sent');
    return o.join('\n');
  }
  function drawBlocks(d, cmds) {
    const mono = d.depth === 1, o = ['when started', '  start display [' + blk(d.name.replace(/\s*\(.*\)$/, '')) + ' v]'];
    const colr = c => mono ? ' [' + (dcol(c.c, true) ? 'lit' : 'dark') + ' v]' : ' colour [' + c.c + ' v]', q = (c, k) => int(c[k], 0);
    for (const c of cmds) {
      const at = ' at x (' + q(c, 'x') + ') y (' + q(c, 'y') + ')';
      switch (c.op) {
        case 'clear': o.push('  clear display' + colr(c)); break;
        case 'text': o.push('  show [' + blk(c.text) + ']' + at + ' size (' + q(c, 'size') + ')' + colr(c)); break;
        case 'pixel': o.push('  draw pixel' + at + colr(c)); break;
        case 'line': o.push('  draw line from x (' + q(c, 'x0') + ') y (' + q(c, 'y0') + ') to x (' + q(c, 'x1') + ') y (' + q(c, 'y1') + ')' + colr(c)); break;
        case 'rect': case 'fillRect': o.push('  ' + (c.op === 'rect' ? 'draw' : 'fill') + ' rectangle' + at + ' width (' + q(c, 'w') + ') height (' + q(c, 'h') + ')' + colr(c)); break;
        case 'roundRect': case 'fillRoundRect': o.push('  ' + (c.op === 'roundRect' ? 'draw' : 'fill') + ' rounded rectangle' + at + ' width (' + q(c, 'w') + ') height (' + q(c, 'h') + ') radius (' + q(c, 'r') + ')' + colr(c)); break;
        case 'circle': case 'fillCircle': o.push('  ' + (c.op === 'circle' ? 'draw' : 'fill') + ' circle' + at + ' radius (' + q(c, 'r') + ')' + colr(c)); break;
        case 'triangle': case 'fillTriangle': o.push('  ' + (c.op === 'triangle' ? 'draw' : 'fill') + ' triangle (' + q(c, 'x0') + ') (' + q(c, 'y0') + ') (' + q(c, 'x1') + ') (' + q(c, 'y1') + ') (' + q(c, 'x2') + ') (' + q(c, 'y2') + ')' + colr(c) + ' :: display'); break;
        case 'arc': o.push('  draw arc' + at + ' radius (' + q(c, 'r') + ') from (' + q(c, 'a0') + ')° to (' + q(c, 'a1') + ')° thickness (' + q(c, 't') + ')' + colr(c)); break;
        case 'icon': o.push('  draw icon [' + c.icon + ' v]' + at + colr(c)); break;
      }
    }
    o.push('  update display');
    return o.join('\n');
  }
  T.displaylab.gen.draw = genDraw;
  T.displaylab.gen.drawExample = drawExample;
  T.displaylab.gen.rateOf = rateOf;

  /* ================================================================ the character LCD (HD44780 with a PCF8574 I2C backpack) */
  const DEF_CUSTOM = [
    [0b00100, 0b01010, 0b01010, 0b01110, 0b01110, 0b11111, 0b11111, 0b01110], [0b00100, 0b00100, 0b01010, 0b01010, 0b10001, 0b10001, 0b10001, 0b01110],
    [0b00000, 0b01010, 0b11111, 0b11111, 0b11111, 0b01110, 0b00100, 0b00000], [0b00100, 0b01110, 0b01110, 0b01110, 0b11111, 0b00000, 0b00100, 0b00000],
    [0b01110, 0b11011, 0b10001, 0b10001, 0b11111, 0b11111, 0b11111, 0b11111], [0b00100, 0b01110, 0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00000],
    [0b00000, 0b01010, 0b01010, 0b00000, 0b10001, 0b01110, 0b00000, 0b00000], [0b00000, 0b00001, 0b00011, 0b10110, 0b11100, 0b01000, 0b00000, 0b00000]
  ];
  /* characters the A00 character ROM of the HD44780 has beyond ASCII (and two ASCII codes it draws differently) */
  const ROM = { '°': 223, 'µ': 228, 'Ω': 244, '→': 126, '←': 127, '÷': 253, '█': 255 };
  const lcd = { size: '16x2', bl: 'green', lines: ['{0} Temp  23.5°C', '{1} Humidity 48%', 'Hello from the', 'display lab {2}'], col: 0, row: 0, cursor: false, blink: false, shift: 0, slot: 0,
    custom: DEF_CUSTOM.map(r => r.slice()), fv: 23.5, fw: 6, fd: 1, fz: false, frun: true };
  if (saved.lcd && typeof saved.lcd === 'object') {
    const s = saved.lcd;
    if (s.size === '20x4' || s.size === '16x2') lcd.size = s.size;
    if (['green', 'blue', 'off'].includes(s.bl)) lcd.bl = s.bl;
    if (Array.isArray(s.lines)) for (let i = 0; i < 4; i++) if (typeof s.lines[i] === 'string') lcd.lines[i] = s.lines[i].slice(0, 80);
    if (Array.isArray(s.custom) && s.custom.length === 8) lcd.custom = s.custom.map((r, i) => Array.isArray(r) && r.length === 8 ? r.map(v => int(v, 0) & 31) : DEF_CUSTOM[i].slice());
    for (const k of ['col', 'row', 'shift', 'fw', 'fd']) if (Number.isFinite(s[k])) lcd[k] = s[k] | 0;
    for (const k of ['cursor', 'blink', 'fz']) if (typeof s[k] === 'boolean') lcd[k] = s[k];
  }
  function lcdState() { return { size: lcd.size, bl: lcd.bl, lines: lcd.lines, col: lcd.col, row: lcd.row, cursor: lcd.cursor, blink: lcd.blink, shift: lcd.shift, custom: lcd.custom, fw: lcd.fw, fd: lcd.fd, fz: lcd.fz }; }
  const lcdDims = () => lcd.size === '20x4' ? [20, 4] : [16, 2];
  /* a line of text into tokens: plain characters, and {0} … {7} for the custom characters */
  function lcdTokens(s) { const out = []; String(s || '').replace(/\{([0-7])\}|([\s\S])/g, (m, n, ch) => { out.push(n != null ? { custom: +n } : { ch }); return ''; }); return out; }
  /* the controller's memory: two lines of 40 characters. On a 20 × 4 module rows 3 and 4 are the second halves of lines 1 and 2. */
  const rowStart = (r, rows) => rows === 4 ? { line: r % 2, at: r < 2 ? 0 : 20 } : { line: r, at: 0 };
  function lcdMemory() {
    const [, rows] = lcdDims(), mem = [new Array(40).fill(' '), new Array(40).fill(' ')];
    lcd.lines.slice(0, rows).forEach((t, r) => {
      let { line, at } = rowStart(r, rows);
      for (const tk of lcdTokens(t)) { if (at >= 40) { at = 0; line = 1 - line; } mem[line][at++] = tk.custom != null ? { custom: tk.custom } : tk.ch; }
    });
    return mem;
  }
  const mod = (a, n) => ((a % n) + n) % n;
  /* what the glass shows: a G.lcd filled from the memory, the display shift and the cursor */
  function lcdModel() {
    const [cols, rows] = lcdDims(), mem = lcdMemory(), L = G.lcd(cols, rows);
    for (let i = 0; i < 8; i++) L.createChar(i, lcd.custom[i]);
    for (let r = 0; r < rows; r++) { const { line, at } = rowStart(r, rows); for (let c = 0; c < cols; c++) { const ch = mem[line][mod(at + c + lcd.shift, 40)]; L.cells[r][c] = typeof ch === 'string' ? (ch === '~' ? '→' : ch === '\\' ? '¥' : ch) : ch; } }
    const cs = rowStart(clamp(lcd.row, 0, rows - 1), rows), addr = cs.at + clamp(lcd.col, 0, 39);
    L.col = -1; L.row = -1;
    for (let r = 0; r < rows; r++) { const s2 = rowStart(r, rows); if (s2.line !== cs.line) continue; const vc = mod(addr - lcd.shift - s2.at, 40); if (vc < cols) { L.col = vc; L.row = r; break; } }
    L.cursor(lcd.cursor); L.blink(lcd.blink); L.backlight = lcd.bl !== 'off';
    return L;
  }
  /* a number in a fixed width, as printf("%6.1f") or ("%06.1f") does */
  function fixedNum(v, width, dec, zero) {
    let s = Math.abs(v).toFixed(dec);
    const neg = v < 0;
    if (zero) { while (s.length + (neg ? 1 : 0) < width) s = '0' + s; return (neg ? '-' : '') + s; }
    s = (neg ? '-' : '') + s;
    while (s.length < width) s = ' ' + s;
    return s;
  }

  function lcdTab(body, params) {
    const kit = K(), want = params && params.get && params.get('size');
    if (want === '16x2' || want === '20x4') lcd.size = want;
    body.innerHTML = '<p class="muted" style="margin:0 0 12px">The two-line character LCD: 16 characters of 5 × 8 dots, a controller (the HD44780) with room for 40 characters per line, and eight characters you can design yourself. Type the lines, click the glass to move the cursor, scroll the display, draw your own characters on the grid at the right, and see why a number that is printed without a fixed width jumps about and leaves old digits behind.</p>' +
      '<div class="esplab"><div class="side"><div class="lc-ctl"></div><div class="lc-ro"></div></div><div style="min-width:0"><div class="stage"></div><div class="lc-lines"></div></div></div>' +
      '<div class="lc-code" style="margin-top:14px"></div><div class="lc-fcode" style="margin-top:14px"></div>' + more(['character-lcd', 'lcd-i2c-backpack', 'custom-characters', 'formatting-numbers', 'menus-on-small-displays', 'choosing-a-display']);
    const $ = s => ui.$(s, body), stageEl = $('.stage'), linesEl = $('.lc-lines'), codeEl = $('.lc-code'), fcodeEl = $('.lc-fcode');
    const st = kit.stage(stageEl, { aspect: 0.66, minH: 340, maxH: 600 });
    const demo = { naive: 'T=' + ' '.repeat(14), acc: 0, last: lcd.fv };
    let geo = null, codeT = 0;
    const ctl = kit.controls($('.lc-ctl'), [
      { id: 'size', type: 'select', label: 'Module', options: [['16 × 2', '16x2'], ['20 × 4', '20x4']], value: lcd.size },
      { id: 'bl', type: 'select', label: 'Backlight', options: [['Green, dark letters', 'green'], ['Blue, light letters', 'blue'], ['Off (backlight() not called)', 'off']], value: lcd.bl },
      { id: 'cursor', type: 'check', label: 'Underline cursor — lcd.cursor()', value: lcd.cursor },
      { id: 'blink', type: 'check', label: 'Blinking block — lcd.blink()', value: lcd.blink },
      { type: 'buttons', items: [{ id: 'left', label: '← Scroll left' }, { id: 'right', label: 'Scroll right →' }, { id: 'home', label: 'Home' }] },
      { type: 'html', html: '<b>A number that keeps still</b>' },
      { id: 'fv', label: 'Value', min: -20, max: 130, step: 0.1, value: lcd.fv, fmt: v => f(v, 1) },
      { id: 'frun', type: 'check', label: 'Let the value change by itself', value: lcd.frun },
      { id: 'fw', label: 'Width (characters)', min: 3, max: 8, step: 1, value: lcd.fw },
      { id: 'fd', label: 'Decimals', min: 0, max: 3, step: 1, value: lcd.fd },
      { id: 'fz', type: 'check', label: 'Pad with zeros instead of spaces', value: lcd.fz }
    ], (id, v) => {
      if (id === 'size') { lcd.size = v === '20x4' ? '20x4' : '16x2'; const [cols, rows] = lcdDims(); lcd.row = clamp(lcd.row, 0, rows - 1); lcd.col = clamp(lcd.col, 0, cols - 1); linesHtml(); }
      else if (id === 'bl') lcd.bl = v;
      else if (id === 'cursor' || id === 'blink' || id === 'fz' || id === 'frun') lcd[id] = !!v;
      else if (id === 'left') lcd.shift = mod(lcd.shift + 1, 40);
      else if (id === 'right') lcd.shift = mod(lcd.shift - 1, 40);
      else if (id === 'home') { lcd.shift = 0; lcd.col = 0; lcd.row = 0; }
      else if (id === 'fv') { lcd.fv = num(v, 0); writeNaive(); }
      else if (id === 'fw' || id === 'fd') lcd[id] = int(v, 1);
      changed(id !== 'fv');
    });
    const ro = kit.readout($('.lc-ro'), [['cur', 'Cursor'], ['addr', 'Memory address'], ['shift', 'Display shifted by'], ['naive', 'Printed as is'], ['fixed', 'Printed in a fixed width']]);
    /* the naive way: print the number where the last one was, without clearing what was there */
    function writeNaive() { const s = lcd.fv.toFixed(lcd.fd), a = demo.naive.split(''); for (let i = 0; i < s.length && 2 + i < 16; i++) a[2 + i] = s[i]; demo.naive = a.join(''); }
    writeNaive();
    function linesHtml() {
      const [cols, rows] = lcdDims();
      linesEl.innerHTML = '<div class="lc-edit">' + Array.from({ length: rows }, (_, r) => '<label><span>Row ' + (r + 1) + '</span><input class="inp" data-row="' + r + '" type="text" maxlength="80" spellcheck="false" value="' + esc(lcd.lines[r] || '') + '"><small data-len="' + r + '"></small></label>').join('') +
        '<div class="lc-ins"><span class="small muted">Insert a custom character at the text cursor:</span>' + lcd.custom.map((_, i) => '<button class="btn sm" data-ins="' + i + '">{' + i + '}</button>').join('') + '<button class="btn sm ghost" data-clear="1">Clear the text</button></div>' +
        '<p class="small muted" style="margin:6px 0 0">Write <code>{0}</code> … <code>{7}</code> for your own characters. A row longer than ' + cols + ' characters goes on into the controller\'s memory — scroll left to see it' + (rows === 4 ? '; on a 20 × 4 module the overflow of row 1 appears on row 3, because row 3 is the second half of the same memory line.' : '.') + ' The degree sign is character 223 of the LCD\'s own character set; <code>\\</code> and <code>~</code> are drawn as ¥ and → by that set.</p></div>';
      lenHints();
    }
    function lenHints() { const [cols] = lcdDims(); ui.$$('[data-len]', linesEl).forEach(el => { const n = lcdTokens(lcd.lines[+el.dataset.len]).length; el.textContent = n + ' / ' + cols; el.style.color = n > cols ? 'var(--warn)' : ''; }); }
    let lastInput = null;
    linesEl.addEventListener('focusin', e => { if (e.target.dataset && e.target.dataset.row != null) lastInput = e.target; });
    linesEl.addEventListener('input', e => { const r = e.target.dataset && e.target.dataset.row; if (r == null) return; lcd.lines[+r] = String(e.target.value).slice(0, 80); lenHints(); changed(false); });
    linesEl.addEventListener('click', e => {
      const b = e.target.closest('[data-ins]');
      if (b) {
        const inp = lastInput || ui.$('[data-row="0"]', linesEl);
        if (!inp) return;
        const r = +inp.dataset.row, s = lcd.lines[r] || '', p0 = inp.selectionStart == null ? s.length : inp.selectionStart, p1 = inp.selectionEnd == null ? p0 : inp.selectionEnd, tok = '{' + b.dataset.ins + '}';
        lcd.lines[r] = (s.slice(0, p0) + tok + s.slice(p1)).slice(0, 80); inp.value = lcd.lines[r]; inp.focus(); if (inp.setSelectionRange) inp.setSelectionRange(p0 + tok.length, p0 + tok.length);
        lenHints(); changed(true); return;
      }
      if (e.target.closest('[data-clear]')) { lcd.lines = ['', '', '', '']; lcd.shift = 0; linesHtml(); changed(true); }
    });
    function paint(t) {
      const c = st.begin(), Cc = kit.colors(), W = st.W, Hh = st.H, [cols, rows] = lcdDims(), L = lcdModel();
      const d1 = clamp(Math.floor(Math.min((W * 0.62 - 40) / (cols * 6 + 3), (Hh * 0.46 - 40) / (rows * 9 + 3))), 2, 7);
      const mx = 24, my = 40, mw = cols * 6 * d1 + 3 * d1, mh = rows * 9 * d1 + 3 * d1;
      S().text(c, cols + ' × ' + rows + ' character LCD, through a PCF8574 backpack at I2C address 0x27', mx, my - 22, { size: 12, align: 'left', color: Cc.muted });
      G.drawLcd(c, L, mx, my, d1, { backlight: lcd.bl, t });
      // the custom-character editor
      const ex = Math.max(mx + mw + 36, W * 0.66), cell = clamp(Math.floor(Math.min((W - ex - 24) / 5, (Hh * 0.5) / 8)), 8, 26), gx = ex, gy = my;
      S().text(c, 'Custom character ' + lcd.slot + ' — click the dots', gx, gy - 22, { size: 12, align: 'left', color: Cc.muted });
      const rowsBits = lcd.custom[lcd.slot];
      for (let j = 0; j < 8; j++) for (let i = 0; i < 5; i++) {
        const on = (rowsBits[j] >> (4 - i)) & 1;
        c.fillStyle = on ? Cc.accent : Cc.dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)';
        c.fillRect(gx + i * cell + 1, gy + j * cell + 1, cell - 2, cell - 2);
      }
      c.strokeStyle = Cc.border || Cc.grid; c.lineWidth = 1; c.strokeRect(gx + 0.5, gy + 0.5, 5 * cell, 8 * cell);
      const sw = clamp(Math.floor((W - ex - 24) / 8), 12, 34), sy = gy + 8 * cell + 14, sd = Math.max(1, Math.floor((sw - 4) / 6));
      for (let k = 0; k < 8; k++) {
        const x0 = gx + k * sw;
        c.fillStyle = k === lcd.slot ? Cc.accent : Cc.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)';
        c.fillRect(x0, sy, sw - 3, sd * 8 + 14);
        c.fillStyle = k === lcd.slot ? (Cc.dark ? '#0b1020' : '#fff') : Cc.text;
        for (let j = 0; j < 8; j++) for (let i = 0; i < 5; i++) if ((lcd.custom[k][j] >> (4 - i)) & 1) c.fillRect(x0 + (sw - 3 - 5 * sd) / 2 + i * sd, sy + 3 + j * sd, sd, sd);
        S().text(c, String(k), x0 + (sw - 3) / 2, sy + sd * 8 + 9, { size: 10, color: k === lcd.slot ? (Cc.dark ? '#0b1020' : '#fff') : Cc.muted });
      }
      // the number that jumps about, and its cure
      const dy = my + mh + 56, d2 = clamp(Math.floor(Math.min((W * 0.62 - 40) / (16 * 6 + 3), (Hh - dy - 30) / (2 * 9 + 3))), 2, 5);
      const F = G.lcd(16, 2), fixed = 'T=' + fixedNum(lcd.fv, lcd.fw, lcd.fd, lcd.fz);
      F.setCursor(0, 0); F.print(demo.naive); F.setCursor(0, 1); F.print(fixed); F.col = -1; F.row = -1;
      S().text(c, 'The same value printed two ways', mx, dy - 22, { size: 12, align: 'left', color: Cc.muted });
      const fr = G.drawLcd(c, F, mx, dy, d2, { backlight: lcd.bl === 'off' ? 'green' : lcd.bl });
      const lx = mx + fr.w + 16;
      if (lx + 150 < W) {
        S().text(c, 'row 1: lcd.print(value, ' + lcd.fd + ') — shorter numbers leave old digits', lx, dy + 6 * d2, { size: 11.5, align: 'left', color: Cc.text2 || Cc.text });
        S().text(c, 'row 2: snprintf("%' + (lcd.fz ? '0' : '') + lcd.fw + '.' + lcd.fd + 'f") — always ' + lcd.fw + ' characters', lx, dy + 15 * d2, { size: 11.5, align: 'left', color: Cc.text2 || Cc.text });
      }
      geo = { mx, my, d1, cols, rows, gx, gy, cell, sy, sw, sh: sd * 8 + 14 };
      // the read-out
      const addr = rowStart(clamp(lcd.row, 0, rows - 1), rows);
      ro.set('cur', 'column ' + lcd.col + ', row ' + lcd.row + (L.row < 0 ? ' (scrolled out of view)' : ''));
      ro.set('addr', '0x' + ((addr.line ? 0x40 : 0) + addr.at + lcd.col).toString(16).toUpperCase().padStart(2, '0'));
      ro.set('shift', lcd.shift ? lcd.shift + ' to the left' : 'not shifted');
      ro.set('naive', '“' + demo.naive.slice(2).replace(/\s+$/, '') + '”');
      ro.set('fixed', '“' + fixed.slice(2) + '”' + (fixed.length - 2 > lcd.fw ? ' — too wide for ' + lcd.fw : ''));
    }
    const loop = kit.loop((dt, t) => {
      if (lcd.frun) {
        demo.acc += dt;
        if (demo.acc > 0.7) {
          demo.acc = 0;
          const r = Math.random();
          let v = r < 0.12 ? -15 + Math.random() * 140 : demo.last + (Math.random() - 0.5) * (Math.abs(demo.last) > 20 ? 12 : 4);
          v = clamp(Math.round(v * 10) / 10, -20, 130);
          demo.last = v; lcd.fv = v; ctl.set('fv', v); writeNaive();
        }
      }
      paint(t);
      if (!lcd.frun && !lcd.blink) loop.stop();
    }, stageEl);
    kit.click(st, p => {
      if (!geo) return;
      const { mx, my, d1, cols, rows, gx, gy, cell, sy, sw, sh } = geo;
      const c0 = Math.floor((p.x - mx - 2 * d1) / (6 * d1)), r0 = Math.floor((p.y - my - 2 * d1) / (9 * d1));
      if (c0 >= 0 && c0 < cols && r0 >= 0 && r0 < rows) {
        const s0 = rowStart(r0, rows), addr = mod(s0.at + c0 + lcd.shift, 40);
        if (rows === 4) { lcd.row = s0.line + (addr >= 20 ? 2 : 0); lcd.col = addr % 20; } else { lcd.row = r0; lcd.col = addr; }
        changed(true); return;
      }
      const i = Math.floor((p.x - gx) / cell), j = Math.floor((p.y - gy) / cell);
      if (i >= 0 && i < 5 && j >= 0 && j < 8) { lcd.custom[lcd.slot][j] ^= 1 << (4 - i); changed(true); return; }
      const k = Math.floor((p.x - gx) / sw);
      if (p.y >= sy && p.y <= sy + sh && k >= 0 && k < 8) { lcd.slot = k; changed(false); }
    }, p => !!geo && ((p.x >= geo.gx && p.x < geo.gx + 8 * geo.sw && p.y >= geo.gy && p.y <= geo.sy + geo.sh) || (p.x >= geo.mx && p.y >= geo.my && p.x < geo.mx + geo.cols * 6 * geo.d1 + 3 * geo.d1 && p.y < geo.my + geo.rows * 9 * geo.d1 + 3 * geo.d1)));
    function changed(withCode) {
      persist();
      if (lcd.frun || lcd.blink) loop.start(); else loop.once();
      clearTimeout(codeT);
      if (withCode) regen(); else codeT = setTimeout(regen, 400);
    }
    function regen() { code(codeEl, genLcd(lcd)); code(fcodeEl, genLcdFormat(lcd)); }
    st.onResize(() => loop.once());
    onTheme(() => loop.once());
    linesHtml();
    regen();
    loop.once();
    if (lcd.frun || lcd.blink) loop.start();
  }

  /* ---------------------------------------------------------------- the character LCD: the programs */
  function lcdPieces(text) {
    // runs of printable ASCII, the ROM's special characters, and custom characters
    const out = [];
    for (const tk of lcdTokens(text)) {
      if (tk.custom != null) { out.push({ code: tk.custom, custom: true }); continue; }
      const ch = tk.ch, n = ch.charCodeAt(0);
      if (ROM[ch] != null) out.push({ code: ROM[ch], ch });
      else if (n >= 32 && n < 127) { const last = out[out.length - 1]; if (last && last.s != null) last.s += ch; else out.push({ s: ch }); }
      else { const last = out[out.length - 1]; if (last && last.s != null) last.s += '?'; else out.push({ s: '?' }); }
    }
    return out;
  }
  const bin5 = v => '0b' + (v & 31).toString(2).padStart(5, '0');
  function genLcd(s) {
    const [cols, rows] = s.size === '20x4' ? [20, 4] : [16, 2], lines = s.lines.slice(0, rows);
    const slots = [...new Set(lines.reduce((a, t) => a.concat(lcdTokens(t).filter(x => x.custom != null).map(x => x.custom)), []))].sort((a, b) => a - b);
    const C1 = [], P1 = [], B1 = [];
    lines.forEach((t, r) => {
      if (!t) return;
      C1.push('  lcd.setCursor(0, ' + r + ');'); P1.push('lcd.move_to(0, ' + r + ')'); B1.push('  set cursor column (0) row (' + r + ')');
      for (const p of lcdPieces(t)) {
        if (p.s != null) { C1.push('  lcd.print(' + cq(p.s) + ');'); P1.push('lcd.putstr(' + cq(p.s) + ')'); B1.push('  lcd print [' + blk(p.s) + ']'); }
        else if (p.custom) { C1.push('  lcd.write(byte(' + p.code + '));                 // custom character ' + p.code); P1.push('lcd.putchar(chr(' + p.code + '))'); B1.push('  lcd write character (' + p.code + ')'); }
        else { C1.push('  lcd.write(byte(' + p.code + '));               // "' + p.ch + '" is character ' + p.code + ' of the LCD\'s own set'); P1.push('lcd.putchar(chr(' + p.code + '))       # "' + p.ch + '"'); B1.push('  lcd write character (' + p.code + ') // ' + p.ch); }
      }
    });
    const tail = [], ptail = [], btail = [];
    if (s.cursor || s.blink) { tail.push('  lcd.setCursor(' + s.col + ', ' + s.row + ');'); ptail.push('lcd.move_to(' + s.col + ', ' + s.row + ')'); btail.push('  set cursor column (' + s.col + ') row (' + s.row + ')'); }
    if (s.cursor) { tail.push('  lcd.cursor();                         // an underline where the next character goes'); ptail.push('lcd.show_cursor()'); btail.push('  lcd cursor [on v]'); }
    if (s.blink) { tail.push('  lcd.blink();                          // a blinking block'); ptail.push('lcd.blink_cursor_on()'); btail.push('  lcd blink [on v]'); }
    if (s.shift) {
      const left = s.shift <= 20, n = left ? s.shift : 40 - s.shift;
      tail.push('  for (int i = 0; i < ' + n + '; i++) lcd.scroll' + (left ? 'DisplayLeft' : 'DisplayRight') + '();   // move the window over the 40-character memory');
      ptail.push('for _ in range(' + n + '):', '    lcd.hal_write_command(' + (left ? '0x18' : '0x1C') + ')   # python_lcd has no scroll call: the HD44780 command "shift the display ' + (left ? 'left' : 'right') + '"');
      btail.push('  repeat (' + n + ')', '    lcd scroll [' + (left ? 'left' : 'right') + ' v]', '  end');
    }
    const cpp = ['// The character LCD screen of the Character LCD tab of Hyper ESP32', '#include <Wire.h>', '#include <LiquidCrystal_I2C.h>', '', '// ======== adapt to your board ========',
      'LiquidCrystal_I2C lcd(0x27, ' + cols + ', ' + rows + ');        // the backpack\'s address (0x27, or 0x3F: an I2C scan tells), columns, rows', '// ======== end of the board section ========', '',
      ...slots.map(k => 'byte custom' + k + '[8] = { ' + s.custom[k].map(bin5).join(', ') + ' };   // custom character ' + k + ': 8 rows of 5 dots'), ...(slots.length ? [''] : []),
      'void setup() {', '  Wire.begin(21, 22);                   // SDA, SCL', '  lcd.init();', s.bl === 'off' ? '  lcd.noBacklight();' : '  lcd.backlight();', ...slots.map(k => '  lcd.createChar(' + k + ', custom' + k + ');'), ...C1, ...tail, '}', '', 'void loop() {', '}'].join('\n');
    const py = ['# The character LCD screen of the Character LCD tab of Hyper ESP32', 'from machine import I2C, Pin', 'from i2c_lcd import I2cLcd     # not in the firmware: copy lcd_api.py and i2c_lcd.py (dhylands/python_lcd) to the board', '',
      '# ======== adapt to your board ========', 'i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)', 'lcd = I2cLcd(i2c, 0x27, ' + rows + ', ' + cols + ')       # address, rows, columns', '# ======== end of the board section ========', '',
      ...(s.bl === 'off' ? ['lcd.backlight_off()'] : []), ...slots.map(k => 'lcd.custom_char(' + k + ', bytearray([' + s.custom[k].map(bin5).join(', ') + ']))'), ...P1, ...ptail].join('\n');
    const blocks = ['when started', '  start display [LCD ' + cols + '×' + rows + ' I2C 0x27 v]', ...slots.map(k => '  lcd create character (' + k + ') rows [' + s.custom[k].map(v => (v & 31).toString(2).padStart(5, '0')).join(' ') + ']'), ...B1, ...btail].join('\n');
    return { title: 'Your ' + cols + ' × ' + rows + ' LCD screen', about: 'The lines, the custom characters' + (s.cursor || s.blink ? ', the cursor' : '') + (s.shift ? ' and the scrolling' : '') + ' as they are on the screen above.',
      needs: 'An ESP32 board and a ' + cols + ' × ' + rows + ' character LCD with a PCF8574 I2C backpack.', wiring: [['GPIO21 (SDA)', 'backpack SDA'], ['GPIO22 (SCL)', 'backpack SCL'], ['5V / GND', 'backpack VCC / GND', 'a 5 V module: its I2C lines should be pulled up to 3.3 V, not 5 V']],
      libs: ['LiquidCrystal I2C'], blocks, cpp, py,
      notes: ['If nothing shows, turn the contrast trimmer on the backpack: a row of filled blocks means the LCD works but is not yet initialised or the address is wrong.', 'The LiquidCrystal_I2C libraries declare themselves for AVR; the IDE warns, and they normally compile on an ESP32. The hd44780 library (hd44780_I2Cexp) is a sturdier alternative.',
        'MicroPython\'s python_lcd driver goes on to the next row at the end of a row by itself; the Arduino library writes on into the controller\'s hidden memory instead.'] };
  }
  function genLcdFormat(s) {
    const w = s.fw, d = s.fd, z = s.fz ? '0' : '', fmtC = '%' + z + w + '.' + d + 'f', fmtP = '{:' + z + w + '.' + d + 'f}';
    return { title: 'A number that keeps still: always ' + w + ' characters', about: 'Printing a number as it comes (`lcd.print(value, ' + d + ')`) makes it jump left and right as it gains and loses digits, and a shorter number leaves the old digits behind. Formatting it to a fixed width, right-aligned, cures both — the cursor is set to the same column every time and the same number of characters is written.',
      needs: 'The LCD above, and a potentiometer standing in for a sensor.', wiring: [['GPIO34', 'potentiometer wiper', 'ends to 3V3 and GND; GPIO34 is an ADC1 input']], libs: ['LiquidCrystal I2C'],
      blocks: ['when started', '  start display [LCD 16×2 I2C 0x27 v]', '  set cursor column (0) row (0)', '  lcd print [Temp:]', 'forever', '  set [value v] to (((analog read pin (34)) / (4095)) * (150) - (20))', '  set cursor column (6) row (0)',
        '  lcd print (format (value) width (' + w + ') decimals (' + d + ')' + (s.fz ? ' with zeros' : '') + ')', '  wait (0.5) seconds', 'end'].join('\n'),
      cpp: ['#include <Wire.h>', '#include <LiquidCrystal_I2C.h>', '', 'LiquidCrystal_I2C lcd(0x27, 16, 2);', '', 'void setup() {', '  Wire.begin(21, 22);', '  lcd.init();', '  lcd.backlight();', '  lcd.print("Temp:");', '}', '', 'void loop() {',
        '  float value = analogRead(34) / 4095.0 * 150.0 - 20.0;   // -20 … 130: a stand-in for a sensor', '  char buf[17];', '  snprintf(buf, sizeof(buf), "' + fmtC + '", value);    // ' + w + ' characters, ' + d + ' decimal' + (d === 1 ? '' : 's') + ', ' + (s.fz ? 'zeros' : 'spaces') + ' on the left',
        '  lcd.setCursor(6, 0);', '  lcd.print(buf);', '  delay(500);', '}'].join('\n'),
      py: ['from machine import I2C, Pin, ADC', 'from i2c_lcd import I2cLcd     # copy lcd_api.py and i2c_lcd.py (dhylands/python_lcd) to the board', 'import time', '', 'i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)', 'lcd = I2cLcd(i2c, 0x27, 2, 16)', 'adc = ADC(Pin(34), atten=ADC.ATTN_11DB)',
        'lcd.putstr("Temp:")', '', 'while True:', '    value = adc.read_u16() / 65535 * 150 - 20   # -20 ... 130: a stand-in for a sensor', '    lcd.move_to(6, 0)', '    lcd.putstr("' + fmtP + '".format(value))   # ' + w + ' characters, ' + d + ' decimal' + (d === 1 ? '' : 's'), '    time.sleep(0.5)'].join('\n'),
      notes: ['A value wider than ' + w + ' characters is still printed in full and pushes into the next column: choose the width for the largest value, sign included.', 'dtostrf(value, ' + w + ', ' + d + ', buf) does the same as snprintf on Arduino.'] };
  }
  T.displaylab.gen.lcd = genLcd;
  T.displaylab.gen.lcdFormat = genLcdFormat;
  T.displaylab.gen.fixedNum = fixedNum;
  T.displaylab.gen.textWith = textWith;
  T.displaylab.gen.cleanDesign = cleanDesign;
  T.displaylab.gen.newWidget = newWidget;

  /* ================================================================ seven segments */
  const SEGCOL = { red: [255, 59, 48], green: [60, 230, 110], blue: [70, 150, 255], white: [235, 240, 255], amber: [255, 176, 0] };
  const seg = { mode: 'number', value: 23.5, dec: 1, text: 'HELP', raw: [0x76, 0x79, 0x38, 0x73], rate: 3, mux: true, sel: 0, col: 'red', bright: 7, t: 0 };
  const segName = m => 'abcdefg'.split('').filter((_, i) => (m >> i) & 1).join(' ') || 'none';
  /* the four cells shown: [{ seg, dp }], and whether the colon is lit */
  function segCells(now_, s) {
    s = s || seg;
    if (s.mode === 'number') return { cells: G.seg7Number(num(s.value, 0), 4, s.dec | 0), colon: false };
    if (s.mode === 'clock') { const d = now_ || new Date(), hh = d.getHours(), mm = d.getMinutes(); return { cells: [Math.floor(hh / 10), hh % 10, Math.floor(mm / 10), mm % 10].map(n => ({ seg: G.SEG7[String(n)], dp: false })), colon: d.getSeconds() % 2 === 0 }; }
    if (s.mode === 'text') { const t = [...String(s.text || '')].slice(0, 4); while (t.length < 4) t.push(' '); return { cells: t.map(ch => ({ seg: G.seg7(ch), dp: false })), colon: false }; }
    return { cells: (s.raw || [0, 0, 0, 0]).slice(0, 4).map(v => ({ seg: v & 0x7F, dp: !!(v & 0x80) })), colon: false };
  }
  /* how bright each digit looks when they are lit one after the other: the eye averages over about 40 ms */
  function persistence(t, rate, k) {
    const P = 1 / rate, tau = 0.04, t0 = t - 6 * tau;
    let sum = 0, m = Math.floor(t0 / P) - 4;
    for (let guard = 0; guard < 2000; guard++, m++) {
      const a = m * P, b = a + P;
      if (a > t) break;
      if (mod(m, 4) !== k || b < t0) continue;
      const a2 = Math.max(a, t0), b2 = Math.min(b, t);
      sum += Math.exp(-(t - b2) / tau) - Math.exp(-(t - a2) / tau);
    }
    return clamp(sum / 0.25, 0, 1);
  }

  function segTab(body) {
    const kit = K();
    body.innerHTML = '<p class="muted" style="margin:0 0 12px">A seven-segment digit is seven LEDs and a dot; a byte says which are lit. Four digits share their segment lines and are lit <b>one at a time</b>, fast enough that the eye sees all four — slow the scan down and watch it happen. A TM1637 or MAX7219 chip does the scanning for you; a bare four-digit display needs twelve pins and a timer in your program.</p>' +
      '<div class="esplab"><div class="side"><div class="sg-ctl"></div><div class="sg-text"></div><div class="sg-ro"></div></div><div style="min-width:0"><div class="stage"></div><div class="sg-table"></div></div></div><div class="sg-code" style="margin-top:14px"></div>' +
      more(['seven-segment-displays', 'tm1637-and-max7219', 'indicator-leds-and-bar-graphs', 'led-matrices', 'choosing-a-display']);
    const $ = s => ui.$(s, body), stageEl = $('.stage'), tableEl = $('.sg-table'), codeEl = $('.sg-code'), textEl = $('.sg-text');
    const st = kit.stage(stageEl, { aspect: 0.6, minH: 320, maxH: 560 });
    let geo = null, lastSec = -1;
    kit.controls($('.sg-ctl'), [
      { id: 'mode', type: 'select', label: 'Show', options: [['A number', 'number'], ['A clock (this computer\'s time)', 'clock'], ['Letters', 'text'], ['My own segments (click the big digit)', 'raw']], value: seg.mode },
      { id: 'value', label: 'Number', min: -999, max: 9999, step: 0.1, value: seg.value, fmt: v => f(v, seg.dec) },
      { id: 'dec', type: 'select', label: 'Decimals', options: [['0', 0], ['1', 1], ['2', 2], ['3', 3]], value: seg.dec },
      { id: 'col', type: 'select', label: 'Colour', options: [['Red', 'red'], ['Green', 'green'], ['Blue', 'blue'], ['White', 'white'], ['Amber', 'amber']], value: seg.col },
      { id: 'bright', label: 'Brightness (setBrightness)', min: 0, max: 7, step: 1, value: seg.bright },
      { id: 'mux', type: 'check', label: 'Show the multiplexing', value: seg.mux },
      { id: 'rate', label: 'Digits lit per second', min: 0.5, max: 2000, value: seg.rate, log: true, sig: 2, fmt: v => (v < 10 ? f(v, 1) : f(v, 0)) + ' /s' }
    ], (id, v) => {
      if (id === 'value') seg.value = num(v, 0);
      else if (id === 'dec') seg.dec = int(v, 0);
      else if (id === 'mode') { seg.mode = v; textHtml(); }
      else if (id === 'col') seg.col = SEGCOL[v] ? v : 'red';
      else if (id === 'bright') seg.bright = clamp(int(v, 7), 0, 7);
      else if (id === 'mux') seg.mux = !!v;
      else if (id === 'rate') seg.rate = clamp(num(v, 3), 0.5, 2000);
      update();
    });
    const ro = kit.readout($('.sg-ro'), [['dig', 'Digit lit now'], ['byte', 'Its segment byte'], ['refresh', 'Each digit refreshed'], ['eye', 'What the eye sees']]);
    function textHtml() {
      textEl.innerHTML = seg.mode === 'text' ? '<label class="ctl"><span class="small muted">Four characters (digits, A b C c d E F H h L n o P r t U u y - _ °)</span><input class="inp sg-in" type="text" maxlength="4" value="' + esc(seg.text) + '" spellcheck="false"></label>' : '';
    }
    textEl.addEventListener('input', e => { if (e.target.classList.contains('sg-in')) { seg.text = String(e.target.value).slice(0, 4); update(); } });
    function paint(t) {
      const c = st.begin(), Cc = kit.colors(), W = st.W, Hh = st.H, { cells, colon } = segCells();
      const rgb = SEGCOL[seg.col], level = 0.35 + 0.65 * seg.bright / 7;
      const h = clamp(Math.min((W * 0.58) / 2.9, Hh * 0.32), 40, 150), step = h * 0.7, mw = 4 * step + h * 0.3, mx = 20, my = 26;
      // the module
      c.save(); c.fillStyle = '#111317'; c.beginPath(); if (c.roundRect) c.roundRect(mx - 12, my - 12, mw + 24, h + 24, 10); else c.rect(mx - 12, my - 12, mw + 24, h + 24); c.fill(); c.restore();
      const P = 1 / seg.rate, active = mod(Math.floor(t / P), 4);
      const bright = k => seg.mux ? persistence(t, seg.rate, k) : 1;
      for (let k = 0; k < 4; k++) {
        const b = bright(k) * level;
        G.drawSeg7(c, [cells[k]], mx + k * step, my, h, { color: 'rgba(' + rgb.join(',') + ',' + f(Math.max(0.04, b), 3) + ')', off: 'rgba(' + rgb.join(',') + ',0.07)' });
        if (k === seg.sel) { c.fillStyle = Cc.accent; c.fillRect(mx + k * step, my + h + 6, h * 0.5, 3); }
      }
      if (seg.mode === 'clock') { const b = bright(1) * level; c.fillStyle = colon ? 'rgba(' + rgb.join(',') + ',' + f(Math.max(0.04, b), 3) + ')' : 'rgba(' + rgb.join(',') + ',0.07)'; for (const yy of [0.33, 0.67]) { c.beginPath(); c.arc(mx + 2 * step - h * 0.1, my + h * yy, h * 0.055, 0, Math.PI * 2); c.fill(); } }
      // the big digit with its segment names
      const bh = clamp(Math.min(Hh * 0.5, W * 0.3), 60, 230), bx = Math.max(mx + mw + 50, W - bh * 0.5 - 70), by = my, cell = cells[seg.sel] || { seg: 0, dp: false };
      G.drawSeg7(c, [cell], bx, by, bh, { color: Cc.accent, off: Cc.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)' });
      const w = bh * 0.5, tt = bh * 0.1, pos = { a: [bx + w / 2, by + tt / 2], b: [bx + w - tt / 2, by + bh * 0.25], c: [bx + w - tt / 2, by + bh * 0.75], d: [bx + w / 2, by + bh - tt / 2], e: [bx + tt / 2, by + bh * 0.75], f: [bx + tt / 2, by + bh * 0.25], g: [bx + w / 2, by + bh / 2], dp: [bx + w + bh * 0.08, by + bh - tt / 2] };
      const off2 = { a: [0, -14], b: [14, 0], c: [14, 0], d: [0, 14], e: [-14, 0], f: [-14, 0], g: [0, -11], dp: [12, 0] };
      for (const [k, p] of Object.entries(pos)) S().text(c, k, p[0] + off2[k][0], p[1] + off2[k][1], { size: 12, weight: 650, color: Cc.text });
      S().text(c, 'digit ' + (seg.sel + 1) + ' = ' + E_hex(cell.seg | (cell.dp ? 0x80 : 0)) + ' = 0b' + ((cell.seg | (cell.dp ? 0x80 : 0)) >>> 0).toString(2).padStart(8, '0'), bx + w / 2, by + bh + 20, { size: 12, mono: true, color: Cc.muted });
      // the scan: which digit is switched on, over the last eight steps
      const ly = my + h + 40, lh = Math.max(14, Math.min(26, (Hh - ly - 40) / 5)), lx = 58, lw = W - lx - 24, t1 = t, t0w = t - 8 * P;
      S().text(c, seg.mux ? 'Digit lines over the last ' + (8 * P >= 1 ? f(8 * P, 1) + ' s' : f(8 * P * 1000, 8 * P * 1000 < 10 ? 1 : 0) + ' ms') + ' — the same pattern at every speed, only the time scale changes' : 'A driver chip scans the digits for you; here they are shown steadily', lx, ly - 10, { size: 11.5, align: 'left', color: Cc.muted });
      if (seg.mux) for (let k = 0; k < 4; k++) {
        const edges = [], m0 = Math.floor(t0w / P) - 1;
        edges.push([t0w - P, mod(m0, 4) === k ? 1 : 0]);
        for (let m = m0; m * P <= t1 + P; m++) edges.push([m * P, mod(m, 4) === k ? 1 : 0]);
        S().wave(c, lx, ly + 4 + k * (lh + 8), lw, lh, edges, { t0: t0w, t1, color: kit.hue(10 + k * 70), label: 'DIG' + (k + 1), width: 1.6 });
      }
      geo = { mx, my, step, h, bx, by, bh, pos };
      const ab = cells[active] || { seg: 0, dp: false }, perDigit = seg.rate / 4;
      ro.set('dig', seg.mux ? 'digit ' + (active + 1) : 'all four, steadily');
      ro.set('byte', E_hex(ab.seg | (ab.dp ? 0x80 : 0)) + ' — ' + segName(ab.seg) + (ab.dp ? ' + dot' : ''));
      ro.set('refresh', f(perDigit, perDigit < 10 ? 2 : 0) + ' times a second');
      ro.set('eye', !seg.mux ? 'a steady display' : perDigit < 2 ? 'one digit at a time' : perDigit < 25 ? 'all four, flickering' : perDigit < 60 ? 'all four, a slight shimmer' : 'all four, steady');
    }
    const E_hex = v => '0x' + (v & 255).toString(16).toUpperCase().padStart(2, '0');
    function tableHtml() {
      const { cells, colon } = segCells();
      tableEl.innerHTML = T.util.table(['Digit', 'Segments lit', 'Byte (dot g f e d c b a)', 'Hex'], cells.map((cl, k) => {
        const v = cl.seg | (cl.dp || (colon && k === 1) ? 0x80 : 0);
        return { hl: k === seg.sel, cells: ['<b>' + (k + 1) + '</b>', esc(segName(cl.seg)) + (cl.dp ? ' + dot' : colon && k === 1 ? ' + colon' : ''), '<code>0b' + v.toString(2).padStart(8, '0') + '</code>', '<code>' + E_hex(v) + '</code>'] };
      })) + '<p class="small muted" style="margin:6px 0 0">Bit 0 is segment a (the top), going clockwise to f, then g in the middle; bit 7 is the dot — on four-digit clock modules the colon is bit 7 of digit 2. TM1637 and MAX7219 libraries use this order. Click a digit to look at it; in “My own segments” click the segments of the big digit.</p>';
    }
    const loop = kit.loop((dt, t) => {
      seg.t = t;
      paint(t);
      const s = new Date().getSeconds();
      if (seg.mode === 'clock' && s !== lastSec) { lastSec = s; tableHtml(); }
      if (!seg.mux && seg.mode !== 'clock') loop.stop();
    }, stageEl);
    kit.click(st, p => {
      if (!geo) return;
      const k = Math.floor((p.x - geo.mx) / geo.step);
      if (p.y >= geo.my - 6 && p.y <= geo.my + geo.h + 12 && k >= 0 && k < 4) { seg.sel = k; update(); return; }
      let best = null, bd = geo.bh * 0.14;
      for (const [name, q] of Object.entries(geo.pos)) { const dd = Math.hypot(p.x - q[0], p.y - q[1]); if (dd < bd) { bd = dd; best = name; } }
      if (best) {
        if (seg.mode !== 'raw') { const { cells } = segCells(); seg.raw = cells.map(cl => cl.seg | (cl.dp ? 0x80 : 0)); seg.mode = 'raw'; }
        seg.raw[seg.sel] ^= best === 'dp' ? 0x80 : 1 << 'abcdefg'.indexOf(best);
        update();
      }
    }, p => !!geo && ((p.y >= geo.my && p.y <= geo.my + geo.h && p.x >= geo.mx && p.x < geo.mx + 4 * geo.step) || Object.values(geo.pos).some(q => Math.hypot(p.x - q[0], p.y - q[1]) < geo.bh * 0.14)));
    function update() {
      tableHtml();
      code(codeEl, genSeg(seg));
      if (seg.mux || seg.mode === 'clock') loop.start(); else loop.once();
    }
    st.onResize(() => loop.once());
    onTheme(() => loop.once());
    textHtml();
    update();
    loop.once();
  }
  function genSeg(s) {
    const { cells } = segCells(new Date(2026, 9, 4, 12, 34, 0), s), bytes = cells.map(c => c.seg | (c.dp ? 0x80 : 0)), hx = v => '0x' + v.toString(16).toUpperCase().padStart(2, '0');
    const names = cells.map(c => segName(c.seg).replace(/ /g, '')).join(', ');
    const head = ['// Four digits on a TM1637 module — written by the Seven segments tab of Hyper ESP32', '#include <TM1637Display.h>', '', '// ======== adapt to your board ========', 'const int CLK = 25, DIO = 26;                  // any two free GPIOs: the TM1637\'s two wires are not I2C', '// ======== end of the board section ========', 'TM1637Display display(CLK, DIO);', ''];
    const phead = ['import tm1637                       # not in the firmware: copy tm1637.py (mcauser/micropython-tm1637) to the board', 'from machine import Pin', 'import time', '', 'tm = tm1637.TM1637(clk=Pin(25), dio=Pin(26))', 'tm.brightness(' + s.bright + ')                     # 0 (dim) ... 7 (bright)'];
    let cpp, py, blocks;
    if (s.mode === 'clock') {
      cpp = head.concat(['void setup() {', '  display.setBrightness(' + s.bright + ');                // 0 (dim) … 7 (bright)', '}', '', 'void loop() {', '  uint32_t s = millis() / 1000 + 12 * 3600UL;    // a clock that starts at 12:00 — set it from NTP for the real time',
        '  int hh = (s / 3600) % 24, mm = (s / 60) % 60;', '  display.showNumberDecEx(hh * 100 + mm, (s % 2) ? 0 : 0b01000000, true);   // the colon blinks; leading zeros on', '  delay(200);', '}']).join('\n');
      py = phead.concat(['t0 = time.ticks_ms()', 'while True:', '    s = time.ticks_diff(time.ticks_ms(), t0) // 1000 + 12 * 3600   # starts at 12:00: set it from NTP for the real time', '    tm.numbers((s // 3600) % 24, (s // 60) % 60, s % 2 == 0)        # hours, minutes, colon', '    time.sleep_ms(200)']).join('\n');
      blocks = ['when started', '  start display [TM1637 v] on CLK (25) DIO (26) :: display', '  set brightness (' + s.bright + ') :: display', 'forever', '  show time (hours) : (minutes) with colon <(seconds) is even> :: display', '  wait (0.2) seconds', 'end'].join('\n');
    } else if (s.mode === 'number' && !(cells.every(c => c.seg === 0x40) && Math.abs(s.value) >= 1)) {
      const n = Math.round(s.value * Math.pow(10, s.dec)), dots = [0, 0b00100000, 0b01000000, 0b10000000][s.dec] || 0;
      cpp = head.concat(['void setup() {', '  display.setBrightness(' + s.bright + ');                // 0 (dim) … 7 (bright)', '  display.showNumberDecEx(' + n + ', 0b' + dots.toString(2).padStart(8, '0') + ', false);   // ' + f(s.value, s.dec) + (s.dec ? ': the dot after digit ' + (4 - s.dec) + ' (on modules wired with dots)' : ''), '}', '', 'void loop() {', '}']).join('\n');
      py = phead.concat(['tm.write([' + bytes.map(hx).join(', ') + '])    # ' + f(s.value, s.dec) + ': segments ' + names + (s.dec ? '; bit 7 is the dot' : '')]).join('\n');
      blocks = ['when started', '  start display [TM1637 v] on CLK (25) DIO (26) :: display', '  set brightness (' + s.bright + ') :: display', '  show number (' + f(s.value, s.dec) + ') with (' + s.dec + ') decimals :: display'].join('\n');
    } else {
      cpp = head.concat(['const uint8_t segs[] = { ' + bytes.map(hx).join(', ') + ' };   // bit 0 = a … bit 6 = g, bit 7 = dot: ' + names, '', 'void setup() {', '  display.setBrightness(' + s.bright + ');                // 0 (dim) … 7 (bright)', '  display.setSegments(segs);', '}', '', 'void loop() {', '}']).join('\n');
      py = phead.concat(['tm.write([' + bytes.map(hx).join(', ') + '])    # bit 0 = a ... bit 6 = g, bit 7 = dot']).join('\n');
      blocks = ['when started', '  start display [TM1637 v] on CLK (25) DIO (26) :: display', '  set brightness (' + s.bright + ') :: display', '  show segments (' + bytes.map(hx).join(') (') + ') :: display'].join('\n');
    }
    return { title: s.mode === 'clock' ? 'A clock on a TM1637 display' : 'Four digits on a TM1637 display', about: 'The TM1637 holds the four segment bytes and scans the digits itself: the ESP32 sends them once over two wires and is free until the next change.',
      needs: 'An ESP32 board and a four-digit TM1637 module.', wiring: [['GPIO25', 'CLK'], ['GPIO26', 'DIO'], ['3V3 / GND', 'VCC / GND']], libs: ['TM1637 (Avishay Orpaz, TM1637Display)'], blocks, cpp, py,
      notes: ['Four-digit clock modules usually have a colon and no dots; others have dots and no colon. Bit 7 of each digit drives whichever the module has.', 'MicroPython: the tm1637 driver is an add-on file — copy it to the board.', 'A bare display without a driver chip needs 8 segment pins and 4 digit pins, current-limiting resistors, and a timer that lights the digits in turn at a few hundred steps a second.'] };
  }
  T.displaylab.gen.seg = genSeg;
  T.displaylab.gen.persistence = persistence;

  /* ================================================================ touch: how a touch becomes a coordinate
     A 2.8″ ILI9341 panel (240 × 320 in its own portrait orientation) with an XPT2046 resistive controller, or a
     capacitive controller that reports the panel's own pixels. The software rotation turns the picture, not the glass. */
  const NW = 240, NH = 320;
  const tch = { panel: 'res', rot: 1, mode: 'tap', cal: { xMin: 200, xMax: 3900, yMin: 200, yMax: 3900, swap: true, flipX: true, flipY: true }, cap: { swap: false, flipX: false, flipY: false },
    taps: [], calStep: -1, calPts: [], glog: [], press: null, edges: null };
  const scrDims = rot => (rot & 1 ? { w: NH, h: NW } : { w: NW, h: NH });
  /* a point of the rotated screen -> the panel's own coordinates */
  function toNative(x, y, rot) { return [{ x, y }, { x: y, y: NH - 1 - x }, { x: NW - 1 - x, y: NH - 1 - y }, { x: NW - 1 - y, y: x }][rot & 3]; }
  /* what the controller reports for a touch there: the resistive raw readings, or the capacitive pixel */
  function rawAt(x, y, rot, panel, noise) {
    const n = toNative(x, y, rot);
    if (panel === 'cap') return { x: Math.round(n.x), y: Math.round(n.y) };
    const jit = () => (noise ? (Math.random() - 0.5) * 2 * noise : 0);
    return { x: Math.round(clamp(3870 - n.x * 3640 / (NW - 1) + jit(), 0, 4095)), y: Math.round(clamp(250 + n.y * 3540 / (NH - 1) + jit(), 0, 4095)) };
  }
  /* raw -> screen pixel with the reader's settings */
  function mapTouch(raw) {
    const d = scrDims(tch.rot);
    if (tch.panel === 'res') return G.touchMap(raw.x, raw.y, tch.cal, d.w, d.h);
    const c = tch.cap;
    let x = c.swap ? raw.y : raw.x, y = c.swap ? raw.x : raw.y;
    if (c.flipX) x = d.w - 1 - x;
    if (c.flipY) y = d.h - 1 - y;
    return { x: clamp(Math.round(x), 0, d.w - 1), y: clamp(Math.round(y), 0, d.h - 1) };
  }
  /* the calibration that is exactly right for a rotation (the four numbers with no flips, or the swap and flips) */
  function exactCal(rot, panel) {
    const d = scrDims(rot), a = rawAt(0, 0, rot, panel), b = rawAt(d.w - 1, 0, rot, panel), c = rawAt(0, d.h - 1, rot, panel);
    const swap = Math.abs(b.y - a.y) > Math.abs(b.x - a.x), xa = swap ? 'y' : 'x', ya = swap ? 'x' : 'y';
    if (panel === 'cap') return { swap, flipX: b[xa] < a[xa], flipY: c[ya] < a[ya] };
    return { xMin: a[xa], xMax: b[xa], yMin: a[ya], yMax: c[ya], swap, flipX: false, flipY: false };
  }
  /* three touches (raw readings and where they should have been) -> the four numbers and the swap, by least squares */
  function solveCal(pts, w, h) {
    const fit = (us, vs) => {
      const n = us.length, mu = us.reduce((s, v) => s + v, 0) / n, mv = vs.reduce((s, v) => s + v, 0) / n;
      let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (us[i] - mu) * (vs[i] - mv); sxx += (us[i] - mu) * (us[i] - mu); }
      const a = sxx ? sxy / sxx : 0, b = mv - a * mu;
      let err = 0; for (let i = 0; i < n; i++) err += Math.pow(a * us[i] + b - vs[i], 2);
      return { a, b, err };
    };
    let best = null;
    for (const swap of [false, true]) {
      const ux = pts.map(p => swap ? p.raw.y : p.raw.x), uy = pts.map(p => swap ? p.raw.x : p.raw.y);
      const fx = fit(ux, pts.map(p => p.target.x)), fy = fit(uy, pts.map(p => p.target.y));
      if (!fx.a || !fy.a) continue;
      const e = fx.err + fy.err;
      if (!best || e < best.e) best = { e, swap, fx, fy };
    }
    if (!best) return null;
    const r = v => Math.round(clamp(v, 0, 4095));
    return { xMin: r(-best.fx.b / best.fx.a), xMax: r((w - 1 - best.fx.b) / best.fx.a), yMin: r(-best.fy.b / best.fy.a), yMax: r((h - 1 - best.fy.b) / best.fy.a), swap: best.swap, flipX: false, flipY: false, rms: Math.sqrt(best.e / pts.length) };
  }
  const calTargets = d => [{ x: Math.round(d.w * 0.1), y: Math.round(d.h * 0.1) }, { x: Math.round(d.w * 0.9), y: Math.round(d.h * 0.5) }, { x: Math.round(d.w * 0.5), y: Math.round(d.h * 0.9) }];

  function touchTab(body) {
    const kit = K(), E = H.esp;
    body.innerHTML = '<p class="muted" style="margin:0 0 12px">A resistive touch layer is two sheets that meet where you press; its controller measures a voltage on each and reports two raw numbers from 0 to 4095. Four calibration numbers turn them into pixels — and they depend on how the picture is rotated, because rotation turns the picture, not the glass. Click the screen to touch it; calibrate it with three targets; then see how a touch becomes a press, a long press or a drag.</p>' +
      '<div class="esplab"><div class="side"><div class="tc-ctl"></div><div class="tc-ro"></div><div class="espout tc-log" style="display:none"></div></div><div style="min-width:0"><div class="stage"></div><div class="tc-note"></div></div></div><div class="tc-code" style="margin-top:14px"></div>' +
      more(['resistive-touch', 'capacitive-touch-screens', 'touch-calibration-and-rotation', 'gui-concepts', 'lvgl-display-and-input-drivers', 'hmi-design-rules']);
    const $ = s => ui.$(s, body), stageEl = $('.stage'), logEl = $('.tc-log'), noteEl = $('.tc-note'), codeEl = $('.tc-code');
    const st = kit.stage(stageEl, { aspect: 0.62, minH: 340, maxH: 620 });
    let L = { s: 1, ox: 0, oy: 0 }, fb = null;
    const CAL_KEYS = ['xMin', 'xMax', 'yMin', 'yMax'];
    const ctl = kit.controls($('.tc-ctl'), [
      { id: 'panel', type: 'select', label: 'Touch layer', options: [['Resistive (XPT2046): raw 0–4095', 'res'], ['Capacitive (FT6336, GT911): pixels', 'cap']], value: tch.panel },
      { id: 'rot', type: 'select', label: 'Display rotation — setRotation()', options: [['0 — portrait', 0], ['1 — landscape', 1], ['2 — portrait, upside down', 2], ['3 — landscape, upside down', 3]], value: tch.rot },
      { id: 'mode', type: 'select', label: 'What a click does', options: [['Touch: raw and mapped values', 'tap'], ['Calibrate: touch three targets', 'cal'], ['Gestures: press, long press, drag', 'gest']], value: tch.mode },
      { id: 'xMin', label: 'X min (raw at the left edge)', min: 0, max: 4095, step: 1, value: tch.cal.xMin },
      { id: 'xMax', label: 'X max (raw at the right edge)', min: 0, max: 4095, step: 1, value: tch.cal.xMax },
      { id: 'yMin', label: 'Y min (raw at the top edge)', min: 0, max: 4095, step: 1, value: tch.cal.yMin },
      { id: 'yMax', label: 'Y max (raw at the bottom edge)', min: 0, max: 4095, step: 1, value: tch.cal.yMax },
      { id: 'swap', type: 'check', label: 'Swap X and Y', value: tch.cal.swap },
      { id: 'flipX', type: 'check', label: 'Mirror X', value: tch.cal.flipX },
      { id: 'flipY', type: 'check', label: 'Mirror Y', value: tch.cal.flipY },
      { type: 'buttons', items: [{ id: 'calib', label: 'Calibrate now', primary: true }, { id: 'guess', label: 'Datasheet guess' }, { id: 'exact', label: 'Exact numbers' }, { id: 'clear', label: 'Clear' }] }
    ], (id, v) => {
      const cc = tch.panel === 'res' ? tch.cal : tch.cap;
      if (id === 'panel') { tch.panel = v === 'cap' ? 'cap' : 'res'; tch.taps = []; syncCtl(); }
      else if (id === 'rot') { tch.rot = int(v, 1) & 3; tch.taps = []; if (tch.mode === 'cal') startCal(); }
      else if (id === 'mode') { tch.mode = v; tch.press = null; if (v === 'cal') startCal(); }
      else if (CAL_KEYS.includes(id)) tch.cal[id] = clamp(int(v, 0), 0, 4095);
      else if (id === 'swap' || id === 'flipX' || id === 'flipY') cc[id] = !!v;
      else if (id === 'calib') { tch.mode = 'cal'; ctl.set('mode', 'cal'); startCal(); }
      else if (id === 'guess') { if (tch.panel === 'res') Object.assign(tch.cal, { xMin: 200, xMax: 3900, yMin: 200, yMax: 3900, swap: true, flipX: true, flipY: true }); else Object.assign(tch.cap, { swap: false, flipX: false, flipY: false }); syncCtl(); }
      else if (id === 'exact') { Object.assign(cc, exactCal(tch.rot, tch.panel)); syncCtl(); }
      else if (id === 'clear') { tch.taps = []; tch.glog = []; tch.edges = null; refreshLog(); }
      if (tch.mode !== 'gest') tch.press = null;
      logEl.style.display = tch.mode === 'gest' ? '' : 'none';
      noteHtml(); regen(); loop.once();
    });
    const ro = kit.readout($('.tc-ro'), [['true', 'Where the finger is'], ['raw', 'The controller reports'], ['map', 'Mapped to'], ['err', 'Error']]);
    function syncCtl() {
      const cc = tch.panel === 'res' ? tch.cal : tch.cap;
      for (const k of CAL_KEYS) { ctl.set(k, tch.cal[k]); ctl.show(k, tch.panel === 'res'); }
      for (const k of ['swap', 'flipX', 'flipY']) ctl.set(k, cc[k]);
    }
    function startCal() { tch.calStep = 0; tch.calPts = []; tch.taps = []; }
    function refreshLog() { logEl.textContent = tch.glog.map(l => l.text).join('\n') || 'Press the screen: a quick tap, a long hold, a drag.'; logEl.scrollTop = 1e6; }
    function glog(text, key) { const line = { key, text }; const last = tch.glog[tch.glog.length - 1]; if (key && last && last.key === key) tch.glog[tch.glog.length - 1] = line; else tch.glog.push(line); if (tch.glog.length > 60) tch.glog.shift(); refreshLog(); }
    function noteHtml() {
      const d = scrDims(tch.rot), ex = exactCal(tch.rot, tch.panel);
      noteEl.innerHTML = tch.mode === 'cal' ? '<p class="small muted" style="margin:8px 0 0">Touch the centre of each cross as exactly as you can. Your three touches give the raw readings at known places; a straight-line fit through them gives the four numbers and whether X and Y are swapped. A full affine calibration (six numbers from the same three points) would also absorb a slightly rotated glass.</p>'
        : tch.mode === 'gest' ? '<p class="small muted" style="margin:8px 0 0">LVGL reports <b>PRESSED</b> at once, <b>LONG_PRESSED</b> after 0.4 s without moving, and <b>CLICKED</b> on release — unless the finger moved more than 10 pixels, which makes it a drag (a scroll) and no click. The strip shows the first 40 ms of the last touch: a resistive layer bounces as the sheets meet, and a reading is trusted only after it has been steady for 20 ms.</p>'
        : '<p class="small muted" style="margin:8px 0 0">For rotation ' + tch.rot + ' (' + d.w + ' × ' + d.h + ') the exact settings are ' + (tch.panel === 'res' ? 'X ' + ex.xMin + ' → ' + ex.xMax + ', Y ' + ex.yMin + ' → ' + ex.yMax + ', ' : '') + (ex.swap ? 'X and Y swapped' : 'X and Y not swapped') + (tch.panel === 'cap' ? (ex.flipX ? ', X mirrored' : '') + (ex.flipY ? ', Y mirrored' : '') : ' — a range that runs backwards does the mirroring') + '. ' +
          (tch.panel === 'res' ? 'A reversed range (min larger than max) and the mirror switch are two ways of saying the same thing.' : 'A capacitive controller already reports pixels, but in the panel\'s own portrait orientation: only the swap and the mirrors change with the rotation.') + '</p>';
    }
    function paint(t) {
      const c = st.begin(), Cc = kit.colors(), d = scrDims(tch.rot), Wd = st.W, Hd = st.H;
      const leftW = Wd * 0.6;
      if (!fb || fb.w !== d.w || fb.h !== d.h) fb = G.fb(d.w, d.h, { depth: 16 });
      fb.clear(0x101622);
      for (let x = 40; x < d.w; x += 40) fb.vline(x, 0, d.h, 0x252c3a);
      for (let y = 40; y < d.h; y += 40) fb.hline(0, y, d.w, 0x252c3a);
      fb.text('0,0', 3, 3, { color: 0x8a94a8 }); fb.text('x', d.w - 10, 3, { color: 0x8a94a8 }); fb.text('y', 3, d.h - 10, { color: 0x8a94a8 });
      fb.text('rotation ' + tch.rot, d.w >> 1, (d.h >> 1) - 4, { color: 0x3a4458, align: 'center', size: 2 });
      if (tch.mode === 'cal') calTargets(d).forEach((p, i) => { const col = i === tch.calStep ? 0xFFD020 : i < tch.calStep || tch.calStep < 0 ? 0x30D060 : 0x5A6478; fb.hline(p.x - 9, p.y, 19, col); fb.vline(p.x, p.y - 9, 19, col); fb.circle(p.x, p.y, 5, col); });
      const m = Math.min((leftW - 30) / d.w, (Hd - 50) / d.h), s = m >= 1 ? Math.floor(m * 2) / 2 : Math.max(0.5, Math.floor(m * 4) / 4);
      L = { s, ox: Math.round((leftW - d.w * s) / 2), oy: Math.round((Hd - 22 - d.h * s) / 2) };
      G.draw(c, fb, L.ox, L.oy, s, { style: 'tft' });
      S().text(c, d.w + ' × ' + d.h + ' after setRotation(' + tch.rot + ') · the glass is ' + NW + ' × ' + NH, leftW / 2, L.oy + d.h * s + 15, { size: 11.5, color: Cc.muted });
      const X = x => L.ox + (x + 0.5) * s, Y = y => L.oy + (y + 0.5) * s;
      if (tch.mode !== 'gest') tch.taps.forEach((tp, i) => {
        const a = (i + 1) / tch.taps.length, last = i === tch.taps.length - 1;
        c.save(); c.globalAlpha = last ? 1 : 0.25 + 0.4 * a;
        c.strokeStyle = Cc.accent; c.lineWidth = 2; c.beginPath(); c.arc(X(tp.p.x), Y(tp.p.y), 11, 0, Math.PI * 2); c.stroke();
        c.strokeStyle = Cc.bad; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(tp.p.x), Y(tp.p.y)); c.lineTo(X(tp.m.x), Y(tp.m.y)); c.stroke();
        c.fillStyle = Cc.bad; c.beginPath(); c.arc(X(tp.m.x), Y(tp.m.y), 4, 0, Math.PI * 2); c.fill();
        c.restore();
      });
      const rx = leftW + 10, rw = Wd - rx - 16;
      if (tch.mode === 'gest') paintGesture(c, Cc, X, Y, rx, rw, t); else paintRaw(c, Cc, rx, rw);
    }
    /* the raw space: where the touches land among 0 … 4095, and the window the four numbers cut from it */
    function paintRaw(c, Cc, rx, rw) {
      const Hd = st.H, sz = Math.max(60, Math.min(rw - 40, Hd - 90)), x0 = rx + Math.max(30, (rw - sz) / 2), y0 = 34, cap = tch.panel === 'cap', full = cap ? NH : 4096, fx = cap ? NW : 4096;
      const PX = v => x0 + v / fx * sz, PY = v => y0 + v / full * sz;
      S().text(c, cap ? 'Reported pixels (the panel\'s own axes)' : 'Raw readings, 0 … 4095', x0 + sz / 2, y0 - 16, { size: 11.5, color: Cc.muted });
      c.save(); c.strokeStyle = Cc.grid; c.lineWidth = 1; c.strokeRect(x0 + 0.5, y0 + 0.5, sz, sz);
      if (!cap) {
        const k = tch.cal, xr = k.swap ? [k.yMin, k.yMax] : [k.xMin, k.xMax], yr = k.swap ? [k.xMin, k.xMax] : [k.yMin, k.yMax];
        c.fillStyle = Cc.accent; c.globalAlpha = 0.12; c.fillRect(PX(Math.min(...xr)), PY(Math.min(...yr)), Math.abs(PX(xr[1]) - PX(xr[0])), Math.abs(PY(yr[1]) - PY(yr[0])));
        c.globalAlpha = 1; c.strokeStyle = Cc.accent; c.setLineDash([4, 3]); c.strokeRect(PX(Math.min(...xr)), PY(Math.min(...yr)), Math.abs(PX(xr[1]) - PX(xr[0])), Math.abs(PY(yr[1]) - PY(yr[0]))); c.setLineDash([]);
        const ex = exactCal(tch.rot, 'res'), exr = ex.swap ? [ex.yMin, ex.yMax] : [ex.xMin, ex.xMax], eyr = ex.swap ? [ex.xMin, ex.xMax] : [ex.yMin, ex.yMax];
        c.strokeStyle = Cc.ok; c.globalAlpha = 0.8; c.strokeRect(PX(Math.min(...exr)), PY(Math.min(...eyr)), Math.abs(PX(exr[1]) - PX(exr[0])), Math.abs(PY(eyr[1]) - PY(eyr[0]))); c.globalAlpha = 1;
      }
      for (const tp of tch.taps) { c.fillStyle = Cc.bad; c.beginPath(); c.arc(PX(tp.raw.x), PY(tp.raw.y), 3.5, 0, Math.PI * 2); c.fill(); }
      c.restore();
      S().text(c, cap ? 'x 0 … 239' : 'raw X →', x0 + sz / 2, y0 + sz + 14, { size: 11, color: Cc.muted });
      S().text(c, cap ? 'y 0 … 319' : 'raw Y ↓', x0 - 8, y0 + sz / 2, { size: 11, color: Cc.muted, align: 'right' });
      if (!cap) { S().text(c, '— your four numbers', x0, y0 + sz + 32, { size: 11, align: 'left', color: Cc.accent }); S().text(c, '— the exact ones', x0, y0 + sz + 48, { size: 11, align: 'left', color: Cc.ok }); }
    }
    /* gestures: the hold timer against 0.4 s, the path, and the bounce at the start of the touch */
    function paintGesture(c, Cc, X, Y, rx, rw, t) {
      const pr = tch.press;
      if (pr && pr.path.length > 1) { c.save(); c.strokeStyle = Cc.accent; c.lineWidth = 2.5; c.globalAlpha = 0.8; c.beginPath(); pr.path.forEach((p, i) => i ? c.lineTo(X(p.x), Y(p.y)) : c.moveTo(X(p.x), Y(p.y))); c.stroke(); c.restore(); }
      if (pr) { c.save(); c.strokeStyle = Cc.accent; c.lineWidth = 2; c.beginPath(); c.arc(X(pr.p0.x), Y(pr.p0.y), 14, 0, Math.PI * 2); c.stroke(); c.restore(); }
      const held = pr ? (now() - pr.t0) / 1000 : tch.lastHeld || 0, cx = rx + rw / 2, cy = 80, r = Math.min(46, rw / 4);
      c.save(); c.lineWidth = 8; c.strokeStyle = Cc.grid; c.beginPath(); c.arc(cx, cy, r, -Math.PI / 2, Math.PI * 1.5); c.stroke();
      c.strokeStyle = held >= 0.4 ? Cc.warn : Cc.accent; c.beginPath(); c.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, held / 0.8)); c.stroke();
      c.strokeStyle = Cc.text; c.lineWidth = 2; const am = -Math.PI / 2 + Math.PI; c.beginPath(); c.moveTo(cx + Math.cos(am) * (r - 7), cy + Math.sin(am) * (r - 7)); c.lineTo(cx + Math.cos(am) * (r + 7), cy + Math.sin(am) * (r + 7)); c.stroke(); c.restore();
      S().text(c, f(held, 2) + ' s', cx, cy - 4, { size: 15, weight: 650, color: Cc.text });
      S().text(c, pr ? (pr.drag ? 'a drag' : held >= 0.4 ? 'a long press' : 'pressed') : 'last touch', cx, cy + 14, { size: 11, color: Cc.muted });
      S().text(c, '0.4 s: long press', cx, cy + r + 18, { size: 11, color: Cc.muted });
      const sy = cy + r + 44, sh = 26, sw = rw - 50, sx = rx + 44;
      S().text(c, 'The first 40 ms of the touch', sx + sw / 2, sy - 12, { size: 11.5, color: Cc.muted });
      if (tch.edges) {
        S().wave(c, sx, sy, sw, sh, tch.edges.raw, { t0: 0, t1: 0.04, color: Cc.warn, label: 'raw', width: 1.5 });
        S().wave(c, sx, sy + sh + 16, sw, sh, tch.edges.deb, { t0: 0, t1: 0.04, color: Cc.ok, label: 'steady', width: 1.8 });
        for (const ms of [0, 10, 20, 30, 40]) S().text(c, ms + ' ms', sx + sw * ms / 40, sy + 2 * sh + 30, { size: 10, color: Cc.muted });
      } else S().text(c, 'press the screen', sx + sw / 2, sy + sh, { size: 11, color: Cc.faint || Cc.muted });
    }
    function report(p, raw, m) {
      ro.set('true', 'x ' + Math.round(p.x) + ', y ' + Math.round(p.y));
      ro.set('raw', (tch.panel === 'res' ? 'raw X ' : 'x ') + raw.x + (tch.panel === 'res' ? ', raw Y ' : ', y ') + raw.y);
      ro.set('map', 'x ' + m.x + ', y ' + m.y);
      const e = Math.hypot(m.x - p.x, m.y - p.y), mm = G.pxToMm(e, 320, 240, 2.8);
      ro.set('err', f(e, 0) + ' px = ' + f(mm, 1) + ' mm' + (mm < 1.5 ? ' — good' : mm < 4 ? ' — a small button would be missed' : ' — calibrate'));
    }
    const loop = kit.loop((dt, t) => {
      const pr = tch.press;
      if (pr && !pr.long && !pr.drag && now() - pr.t0 >= 400) { pr.long = true; glog('LONG_PRESSED — held 0.4 s without moving'); }
      paint(t);
      if (!tch.press) loop.stop();
    }, stageEl);
    kit.drag(st, {
      hit(p) { const d = scrDims(tch.rot), q = { x: (p.x - L.ox) / L.s, y: (p.y - L.oy) / L.s }; return q.x >= 0 && q.y >= 0 && q.x < d.w && q.y < d.h ? { q } : null; },
      start(o) {
        const q = { x: Math.floor(o.q.x), y: Math.floor(o.q.y) }, raw = rawAt(q.x, q.y, tch.rot, tch.panel, tch.panel === 'res' ? 10 : 0), m = mapTouch(raw);
        report(q, raw, m);
        if (tch.mode === 'gest') {
          tch.press = { t0: now(), p0: q, path: [q], drag: false, long: false, far: 0 };
          const b = E.proto.bounce([[0.003, 1]], { bounceMs: 4 + Math.random() * 6, seed: 1 + Math.floor(Math.random() * 999) }).map(([tt, v]) => [tt, 1 - v]);
          const deb = E.debouncer(20), out = [[0, 0]]; let last = 0;
          for (let ms = 0; ms <= 40; ms += 0.1) { const lv = deb(E.proto.levelAt(b, ms / 1000), ms); if (lv !== last) { out.push([ms / 1000, lv]); last = lv; } }
          tch.edges = { raw: b, deb: out };
          glog('PRESSED at x ' + m.x + ', y ' + m.y);
          loop.start(); return;
        }
        tch.taps.push({ p: q, raw, m }); if (tch.taps.length > 12) tch.taps.shift();
        if (tch.mode === 'cal' && tch.calStep >= 0) {
          const d = scrDims(tch.rot), tg2 = calTargets(d)[tch.calStep];
          tch.calPts.push({ raw, target: tg2 });
          tch.calStep++;
          if (tch.calStep >= 3) {
            const r = solveCal(tch.calPts, d.w, d.h);
            if (r) { Object.assign(tch.cal, { xMin: r.xMin, xMax: r.xMax, yMin: r.yMin, yMax: r.yMax, swap: r.swap, flipX: false, flipY: false }); if (tch.panel === 'cap') Object.assign(tch.cap, exactCal(tch.rot, 'cap')); syncCtl(); ui.toast('Calibrated: X ' + r.xMin + ' → ' + r.xMax + ', Y ' + r.yMin + ' → ' + r.yMax + (r.swap ? ', swapped' : '')); }
            tch.mode = 'tap'; ctl.set('mode', 'tap'); tch.calStep = -1; tch.taps = []; noteHtml(); regen();
          }
        }
        loop.once();
      },
      move(o, p) {
        const pr = tch.press;
        if (!pr) return;
        const d = scrDims(tch.rot), q = { x: clamp((p.x - L.ox) / L.s, 0, d.w - 1), y: clamp((p.y - L.oy) / L.s, 0, d.h - 1) };
        pr.path.push(q); if (pr.path.length > 400) pr.path.shift();
        const dist = Math.hypot(q.x - pr.p0.x, q.y - pr.p0.y);
        pr.far = Math.max(pr.far, dist);
        if (!pr.drag && dist > 10) { pr.drag = true; glog('moved more than 10 px: SCROLL_BEGIN — this will not be a click'); }
        if (pr.drag) glog('dragged ' + f(dist, 0) + ' px', 'drag');
      },
      end() {
        const pr = tch.press;
        if (!pr) return;
        const ms = now() - pr.t0;
        tch.lastHeld = ms / 1000;
        glog('RELEASED after ' + f(ms, 0) + ' ms → ' + (pr.drag ? 'no CLICKED: it was a drag' : pr.long ? 'CLICKED (after a long press)' : 'CLICKED'));
        tch.press = null; loop.once();
      }
    });
    function regen() { code(codeEl, genTouch(tch)); }
    st.onResize(() => loop.once());
    onTheme(() => loop.once());
    syncCtl(); noteHtml(); refreshLog(); regen();
    logEl.style.display = tch.mode === 'gest' ? '' : 'none';
    loop.once();
  }
  function genTouch(s) {
    const d = scrDims(s.rot), b = v => v ? 'true' : 'false', P = v => v ? 'True' : 'False';
    if (s.panel === 'cap') {
      const c = s.cap;
      return { title: 'Read a capacitive touch panel (FT6x36) and map it for rotation ' + s.rot, about: 'The controller reports pixels in the panel\'s own portrait orientation; the swap and the mirrors from the Touch tab turn them into the coordinates of the rotated picture. The registers are read directly over I2C, so no library is needed.',
        needs: 'An ESP32 and a display with an FT6206, FT6236 or FT6336 capacitive touch controller.', wiring: [['GPIO21 (SDA)', 'touch SDA'], ['GPIO22 (SCL)', 'touch SCL']],
        blocks: ['when started', '  start I2C on SDA (21) SCL (22)', 'forever', '  set [data v] to (I2C read (5) bytes from address (0x38) register (0x02))', '  if <((item (1) of [data v]) mod (16)) > (0)> then',
          '    set [x v] to (' + (c.swap ? 'touch y of [data v]' : 'touch x of [data v]') + ') :: variables', '    set [y v] to (' + (c.swap ? 'touch x of [data v]' : 'touch y of [data v]') + ') :: variables', ...(c.flipX ? ['    set [x v] to ((' + (d.w - 1) + ') - (x))'] : []), ...(c.flipY ? ['    set [y v] to ((' + (d.h - 1) + ') - (y))'] : []),
          '    print (join [x ] (join (x) (join [ y ] (y))))', '  end', '  wait (0.05) seconds', 'end'].join('\n'),
        cpp: ['#include <Wire.h>', '', '// ======== adapt to your board ========', 'const int SDA_PIN = 21, SCL_PIN = 22;', 'const int FT6X36 = 0x38;                    // FT6206 / FT6236 / FT6336 answer at 0x38', '// ======== end of the board section ========', '',
          'const int W = ' + d.w + ', H = ' + d.h + ';                    // the picture after setRotation(' + s.rot + ')', 'const bool SWAP_XY = ' + b(c.swap) + ', FLIP_X = ' + b(c.flipX) + ', FLIP_Y = ' + b(c.flipY) + ';   // from the Touch tab', '',
          'void setup() {', '  Serial.begin(115200);', '  Wire.begin(SDA_PIN, SCL_PIN);', '}', '', 'void loop() {', '  Wire.beginTransmission(FT6X36);', '  Wire.write(0x02);                           // from register 2: touch count, X high, X low, Y high, Y low', '  Wire.endTransmission(false);',
          '  if (Wire.requestFrom(FT6X36, 5) == 5) {', '    uint8_t n = Wire.read() & 0x0F, xh = Wire.read(), xl = Wire.read(), yh = Wire.read(), yl = Wire.read();', '    if (n > 0) {', '      int rx = ((xh & 0x0F) << 8) | xl, ry = ((yh & 0x0F) << 8) | yl;   // the panel\'s own pixels',
          '      int x = SWAP_XY ? ry : rx, y = SWAP_XY ? rx : ry;', '      if (FLIP_X) x = W - 1 - x;', '      if (FLIP_Y) y = H - 1 - y;', '      Serial.printf("panel %d %d  ->  x %d  y %d\\n", rx, ry, x, y);', '    }', '  }', '  delay(50);', '}'].join('\n'),
        py: ['from machine import I2C, Pin', 'import time', '', '# ======== adapt to your board ========', 'i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)', 'FT6X36 = 0x38                        # FT6206 / FT6236 / FT6336 answer at 0x38', '# ======== end of the board section ========', '',
          'W, H = ' + d.w + ', ' + d.h + '                         # the picture after rotation ' + s.rot, 'SWAP_XY, FLIP_X, FLIP_Y = ' + P(c.swap) + ', ' + P(c.flipX) + ', ' + P(c.flipY) + '   # from the Touch tab', '', 'while True:',
          '    d = i2c.readfrom_mem(FT6X36, 0x02, 5)      # touch count, X high, X low, Y high, Y low', '    if d[0] & 0x0F:', '        rx = ((d[1] & 0x0F) << 8) | d[2]', '        ry = ((d[3] & 0x0F) << 8) | d[4]', '        x, y = (ry, rx) if SWAP_XY else (rx, ry)', '        if FLIP_X:', '            x = W - 1 - x', '        if FLIP_Y:', '            y = H - 1 - y',
          '        print("panel", rx, ry, " ->  x", x, " y", y)', '    time.sleep_ms(50)'].join('\n'),
        notes: ['A GT911 speaks a different register map (16-bit registers at 0x5D or 0x14): use a library for it.', 'Capacitive panels need no calibration of the scale — only the orientation.'] };
    }
    const k = s.cal, xm = k.xMin, xM = k.xMax === k.xMin ? k.xMax + 1 : k.xMax, ym = k.yMin, yM = k.yMax === k.yMin ? k.yMax + 1 : k.yMax;
    return { title: 'Read the XPT2046 and map it with your calibration (rotation ' + s.rot + ')', about: 'The four numbers, the swap and the mirrors as they are set in the Touch tab, applied to the raw readings: the same arithmetic as the lab, and as TFT_eSPI or LVGL drivers do inside.',
      needs: 'An ESP32 and a resistive touch display with an XPT2046 controller on the SPI bus.', wiring: [['GPIO18 / GPIO23 / GPIO19', 'T_CLK / T_DIN / T_DO', 'the SPI bus, shared with the display'], ['GPIO33', 'T_CS'], ['GPIO36', 'T_IRQ', 'low while touched; an input-only pin is fine']],
      libs: ['XPT2046_Touchscreen (Paul Stoffregen)'],
      blocks: ['when started', '  start touch [XPT2046 v] :: display', 'forever', '  if <screen touched?> then', '    set [rx v] to (raw touch [' + (k.swap ? 'y' : 'x') + ' v])', '    set [ry v] to (raw touch [' + (k.swap ? 'x' : 'y') + ' v])',
        '    set [x v] to (map (rx) from (' + xm + ') (' + xM + ') to (0) (' + (d.w - 1) + '))', '    set [y v] to (map (ry) from (' + ym + ') (' + yM + ') to (0) (' + (d.h - 1) + '))', ...(k.flipX ? ['    set [x v] to ((' + (d.w - 1) + ') - (x))'] : []), ...(k.flipY ? ['    set [y v] to ((' + (d.h - 1) + ') - (y))'] : []),
        '    print (join [x ] (join (x) (join [ y ] (y))))', '  end', '  wait (0.05) seconds', 'end'].join('\n'),
      cpp: ['#include <SPI.h>', '#include <XPT2046_Touchscreen.h>', '', '// ======== adapt to your board ========', 'const int T_CS = 33, T_IRQ = 36;            // on the default SPI bus: SCK 18, MOSI 23, MISO 19', '// ======== end of the board section ========', 'XPT2046_Touchscreen ts(T_CS, T_IRQ);', '',
        '// the calibration of the Touch tab, for the picture after setRotation(' + s.rot + '): ' + d.w + ' × ' + d.h, 'const int W = ' + d.w + ', H = ' + d.h + ';', 'const int X_MIN = ' + xm + ', X_MAX = ' + xM + ', Y_MIN = ' + ym + ', Y_MAX = ' + yM + ';', 'const bool SWAP_XY = ' + b(k.swap) + ', FLIP_X = ' + b(k.flipX) + ', FLIP_Y = ' + b(k.flipY) + ';', '',
        'void setup() {', '  Serial.begin(115200);', '  ts.begin();', '}', '', 'void loop() {', '  if (ts.touched()) {                         // the library already ignores light, unreliable touches', '    TS_Point p = ts.getPoint();               // raw readings 0–4095, and p.z, the pressure',
        '    int rx = SWAP_XY ? p.y : p.x, ry = SWAP_XY ? p.x : p.y;', '    int x = constrain(map(rx, X_MIN, X_MAX, 0, W - 1), 0, W - 1);   // a reversed range is fine for map()', '    int y = constrain(map(ry, Y_MIN, Y_MAX, 0, H - 1), 0, H - 1);', '    if (FLIP_X) x = W - 1 - x;', '    if (FLIP_Y) y = H - 1 - y;',
        '    Serial.printf("raw %d %d  ->  x %d  y %d  (pressure %d)\\n", p.x, p.y, x, y, p.z);', '  }', '  delay(50);', '}'].join('\n'),
      py: ['from machine import SPI, Pin', 'import time', '', '# ======== adapt to your board ========', 'spi = SPI(2, baudrate=1000000, sck=Pin(18), mosi=Pin(23), miso=Pin(19))   # the XPT2046 wants 2 MHz or less', 'cs = Pin(33, Pin.OUT, value=1)', 'irq = Pin(36, Pin.IN)                  # low while the screen is touched', '# ======== end of the board section ========', '',
        'W, H = ' + d.w + ', ' + d.h + '                      # the picture after rotation ' + s.rot, 'X_MIN, X_MAX, Y_MIN, Y_MAX = ' + [xm, xM, ym, yM].join(', '), 'SWAP_XY, FLIP_X, FLIP_Y = ' + P(k.swap) + ', ' + P(k.flipX) + ', ' + P(k.flipY), '',
        'def read(cmd):', '    # one 12-bit reading: 0xD0 measures X, 0x90 measures Y', '    buf = bytearray(3)', '    cs(0)', '    spi.write_readinto(bytes([cmd, 0, 0]), buf)', '    cs(1)', '    return ((buf[1] << 8) | buf[2]) >> 3', '',
        'def scale(v, a, b, n):', '    return min(n - 1, max(0, (v - a) * (n - 1) // (b - a)))', '', 'while True:', '    if irq.value() == 0:', '        px, py = read(0xD0), read(0x90)', '        rx, ry = (py, px) if SWAP_XY else (px, py)', '        x, y = scale(rx, X_MIN, X_MAX, W), scale(ry, Y_MIN, Y_MAX, H)',
        '        if FLIP_X:', '            x = W - 1 - x', '        if FLIP_Y:', '            y = H - 1 - y', '        print("raw", px, py, " ->  x", x, " y", y)', '    time.sleep_ms(50)'].join('\n'),
      notes: ['Calibration numbers belong to one panel and one rotation: store them (Preferences, a file) after a calibration screen rather than in the code.', 'A first reading after the finger lands is often wrong: read two or three times and use them only when they agree, or after the reading has been steady for about 20 ms.', 'MicroPython has no XPT2046 driver: the few lines above read it directly.'] };
  }
  T.displaylab.gen.touch = genTouch;
  T.displaylab.gen.solveCal = solveCal;
  T.displaylab.gen.exactCal = exactCal;
  T.displaylab.gen.touchRaw = rawAt;

  /* ================================================================ the display catalogue */
  const cat = { kind: '', colour: '', bus: '', touch: false, sort: 'name', dir: 1 };
  const KINDS = { graphic: 'Graphic', character: 'Character', segment: 'Seven-segment', matrix: 'LED matrix' };
  function catRow(d) {
    const r = rateOf(d), graphic = d.w && d.h;
    const mem = graphic ? G.frameBytes(d.w, d.h, d.depth) : d.kind === 'character' ? 80 : 6;
    return { d, res: graphic ? d.w + ' × ' + d.h : d.kind === 'character' ? d.cols + ' × ' + d.rows + ' characters' : d.digits + ' digits', px: graphic ? d.w * d.h : d.kind === 'character' ? d.cols * d.rows * 40 : d.digits * 8,
      mem, memText: graphic ? bytes(mem) : d.kind === 'character' ? '80 characters (in the controller)' : '6 bytes (in the chip)', fps: r.fps, fpsText: r.fps != null ? f(r.fps, r.fps < 10 ? 1 : 0) + ' /s' : '—', how: r.how, pins: pinsOf(d),
      href: graphic ? '#/tools/displaylab/draw?d=' + d.id : d.kind === 'character' ? '#/tools/displaylab/lcd?size=' + d.cols + 'x' + d.rows : '#/tools/displaylab/segments', open: graphic ? 'Draw on it' : d.kind === 'character' ? 'Open in the LCD tab' : 'Open in Seven segments' };
  }
  function catTab(body) {
    const kit = K();
    body.innerHTML = '<p class="muted" style="margin:0 0 12px">The display modules people really wire to an ESP32, with what each costs: the RAM of one full frame, how many full frames per second its bus can carry, and the pins it takes. Filter and sort them; click a column title to sort by it; open one to draw on it.</p>' +
      '<div class="dl-catbar"></div><div class="small muted dl-catn" style="margin:8px 0 6px"></div><div class="dl-cat"></div>' +
      '<p class="small faint mt">Frame rates are for redrawing the whole screen over the bus named, before any drawing time: a library that redraws only what changed does better, and e-paper is limited by the panel itself. Frame memory counts 1 bit per pixel for monochrome, 2 bytes for 16-bit colour and 3 for 18 or 24 bits.</p>' +
      more(['choosing-a-display', 'display-interfaces', 'frame-rate-and-bus-speed', 'pixels-and-framebuffers', 'graphics-libraries', 'e-paper', 'round-and-odd-displays', 'hub75-panels']);
    const $ = s => ui.$(s, body), tableEl = $('.dl-cat'), countEl = $('.dl-catn');
    const cctl = kit.controls($('.dl-catbar'), [
      { id: 'kind', type: 'select', label: 'Kind', options: [['Every kind', ''], ['Graphic', 'graphic'], ['Character', 'character'], ['Seven-segment', 'segment'], ['LED matrix', 'matrix']], value: cat.kind },
      { id: 'colour', type: 'select', label: 'Colour', options: [['Any', ''], ['Monochrome', 'mono'], ['Colour', 'colour']], value: cat.colour },
      { id: 'bus', type: 'select', label: 'Bus', options: [['Any bus', ''], ['I2C', 'i2c'], ['SPI', 'spi'], ['Parallel, RGB or MIPI', 'par'], ['Something else', 'other']], value: cat.bus },
      { id: 'touch', type: 'check', label: 'Only modules sold with touch', value: cat.touch },
      { id: 'sort', type: 'select', label: 'Sort by', options: [['Name', 'name'], ['Diagonal', 'size'], ['Pixels', 'px'], ['Frame memory', 'mem'], ['Frame rate', 'fps']], value: cat.sort }
    ], (id, v) => { if (id === 'touch') cat.touch = !!v; else { cat[id] = v; if (id === 'sort') cat.dir = v === 'name' ? 1 : -1; } draw(); });
    const busKind = d => { const b = busOf(d); return { i2c: /I2C/.test(b), spi: /SPI/.test(b) && !/QSPI/.test(b) && !/SPI-like/.test(b), par: /parallel|RGB|MIPI/.test(b) }; };
    const KEY = { name: r => r.d.name.toLowerCase(), size: r => r.d.size || 0, px: r => r.px, mem: r => r.mem, fps: r => r.fps == null ? -1 : r.fps };
    function draw() {
      const rows = G.DISPLAYS.map(catRow).filter(r => {
        const d = r.d, bk = busKind(d);
        if (cat.kind && d.kind !== cat.kind) return false;
        if (cat.colour === 'mono' && !(d.depth === 1 || d.kind === 'character' || /one/.test(d.colour || ''))) return false;
        if (cat.colour === 'colour' && !(d.depth > 1 || /colour|red, green/.test(d.colour || ''))) return false;
        if (cat.bus === 'i2c' && !bk.i2c) return false;
        if (cat.bus === 'spi' && !bk.spi) return false;
        if (cat.bus === 'par' && !bk.par) return false;
        if (cat.bus === 'other' && (bk.i2c || bk.spi || bk.par)) return false;
        if (cat.touch && !d.touch) return false;
        return true;
      });
      const key = KEY[cat.sort] || KEY.name;
      rows.sort((a, b) => { const x = key(a), y = key(b); return (x < y ? -1 : x > y ? 1 : 0) * cat.dir || a.d.name.localeCompare(b.d.name); });
      countEl.textContent = rows.length + ' of ' + G.DISPLAYS.length + ' modules';
      const th = (k, t) => '<th' + (k ? ' data-sort="' + k + '" class="dl-sortable' + (cat.sort === k ? ' on' : '') + '" title="Sort by ' + t.toLowerCase() + '"' : '') + '>' + t + (cat.sort === k ? (cat.dir > 0 ? ' ▲' : ' ▼') : '') + '</th>';
      tableEl.innerHTML = rows.length ? '<div class="tablewrap" style="max-height:720px;overflow:auto"><table class="esptable dl-cattable"><thead><tr>' + th('name', 'Module') + th('', 'Kind') + th('px', 'Resolution') + th('size', 'Size') + th('', 'Colours') + th('', 'Bus') +
        th('mem', 'Frame memory') + th('fps', 'Full frames') + th('', 'Pins') + th('', 'Touch') + '</tr></thead><tbody>' + rows.map(r => {
          const d = r.d;
          return '<tr><th><a href="' + r.href + '">' + esc(d.name) + '</a><div class="small muted" style="font-weight:400;white-space:normal;max-width:300px">' + esc(d.note || '') + '</div><a class="btn sm ghost" href="' + r.href + '">' + r.open + ' →</a></th>' +
            '<td>' + (KINDS[d.kind] || esc(d.kind)) + '</td><td>' + r.res + '</td><td>' + (d.size ? d.size + '″' : '—') + '</td><td>' + esc(d.colour || '') + '</td><td>' + esc(busOf(d)) + (d.volts ? '<div class="small muted">' + esc(d.volts) + '</div>' : '') + '</td>' +
            '<td>' + r.memText + '</td><td title="' + esc(r.how) + '">' + r.fpsText + '<div class="small muted">' + esc(r.how) + '</div></td><td>' + esc(r.pins) + '</td><td>' + esc(d.touch || '—') + '</td></tr>';
        }).join('') + '</tbody></table></div>' : '<p class="muted">No module matches these filters.</p>';
    }
    tableEl.addEventListener('click', e => {
      const h = e.target.closest('[data-sort]');
      if (!h) return;
      const k = h.dataset.sort;
      if (cat.sort === k) cat.dir = -cat.dir; else { cat.sort = k; cat.dir = k === 'name' ? 1 : -1; cctl.set('sort', k); }
      draw();
    });
    draw();
  }
  T.displaylab.gen.catRow = catRow;
})();
