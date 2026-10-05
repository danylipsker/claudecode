/* HYPER-CORE · ui/esp-signals.js
 *
 * Hyper ESP32 · Tools → Signal lab: a virtual logic analyser. The reader chooses what to send and sees the real
 * waveforms with their decoding, the picture a ten-dollar logic analyser shows on the bench.
 *
 *   #/tools/signals/uart      text or bytes on a UART frame by frame, and a receiver whose clock is off
 *   #/tools/signals/i2c       SCL and SDA with start, address, ACK, data, stop; a register read; the pull-up rise time
 *   #/tools/signals/spi       the four modes, CS, SCK, MOSI, MISO, the sampling edge
 *   #/tools/signals/pwm       frequency, resolution, duty; the average; a servo; an RC filter making a voltage
 *   #/tools/signals/pixels    the WS2812 bit stream and how each LED keeps its 24 bits
 *   #/tools/signals/can       a CAN frame field by field with stuffed bits, and two nodes arbitrating
 *   #/tools/signals/inputs    a bouncing button, a rotary encoder, an infrared (NEC) code
 *   #/tools/signals/onewire   reset and presence, the slots of a bit, a DS18B20 conversion and read
 *
 * Every tab has the same machinery (lab() below): a stage with the traces, a zoom and a position slider (and the
 * mouse wheel and a drag), a cursor with the time under the mouse, a read-out, a note, and the program that
 * produces this very signal in three languages. The signals come from Hyper.esp.proto (esp32-calc.js); the drawing
 * is Hyper.esym.logic (espsym.js). Trace colours follow the role of the signal in every tab (HUE below).
 *
 * The pure parts (parsing, models, code generators) are in T.signals.lib so that tools/test-signals.js can check them.
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, E = H.esp, G = H.gfx, C = H.code;
  const T = H.espTools = H.espTools || {};
  const S = () => H.esym;
  const K = () => H.kit;
  const P = () => E.proto;

  /* ================================================================ small helpers */
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const fmt = (v, s) => U.fmt(v, s || 3);
  const hex = (v, d) => '0x' + (v >>> 0).toString(16).toUpperCase().padStart(d || 2, '0');
  const fmtT = s => {
    const a = Math.abs(s);
    if (!Number.isFinite(s)) return '—';
    if (a === 0) return '0 s';
    if (a < 1e-6) return fmt(s * 1e9) + ' ns';
    if (a < 1e-3) return fmt(s * 1e6) + ' µs';
    if (a < 1) return fmt(s * 1e3) + ' ms';
    return fmt(s) + ' s';
  };
  const fmtHz = hz => (hz >= 1e6 ? fmt(hz / 1e6) + ' MHz' : hz >= 1e3 ? fmt(hz / 1e3) + ' kHz' : fmt(hz) + ' Hz');
  const fmtOhm = r => (r >= 1e6 ? fmt(r / 1e6) + ' MΩ' : r >= 1e3 ? fmt(r / 1e3) + ' kΩ' : fmt(r) + ' Ω');
  const hexList = (bytes, sep) => bytes.map(b => hex(b, 2).slice(2)).join(sep == null ? ' ' : sep);
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many || one + 's');

  /* The colour of a signal follows its role, in every tab: the clock is amber, the main data line blue, the line coming
     back green, chip select pink, a second data line violet, an analogue or averaged value orange. */
  const HUE = { clock: 48, data: 205, back: 160, cs: 330, second: 280, analog: 28, bad: 4, ok: 150, ctrl: 280, addr: 215, other: 100 };

  /* hex typed by the reader -> { bytes, bad }: "48 65 6C", "0x48,0x65" or "48656C" */
  function parseHex(str) {
    const bytes = [], bad = [];
    for (let t of String(str == null ? '' : str).split(/[\s,;:]+/).filter(Boolean)) {
      t = t.replace(/^0x/i, '');
      if (/^[0-9a-f]{1,2}$/i.test(t)) bytes.push(parseInt(t, 16));
      else if (/^[0-9a-f]+$/i.test(t) && t.length % 2 === 0) { for (let i = 0; i < t.length; i += 2) bytes.push(parseInt(t.slice(i, i + 2), 16)); }
      else bad.push(t);
    }
    return { bytes, bad };
  }
  /* UTF-8 of a string, as a list of bytes */
  function utf8(str) {
    const out = [];
    for (const ch of String(str)) {
      const c = ch.codePointAt(0);
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xC0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else out.push(0xF0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  }
  /* text typed by the reader -> bytes: UTF-8, with \n \r \t \0 \\ and \xHH written as in a C string */
  function textBytes(s) {
    const out = [], str = String(s == null ? '' : s);
    for (let i = 0; i < str.length;) {
      if (str[i] === '\\' && i + 1 < str.length) {
        const m = /^\\(?:x([0-9a-fA-F]{2})|([nrt0\\]))/.exec(str.slice(i));
        if (m) { out.push(m[1] != null ? parseInt(m[1], 16) : { n: 10, r: 13, t: 9, '0': 0, '\\': 92 }[m[2]]); i += m[0].length; continue; }
      }
      const cp = str.codePointAt(i);
      i += cp > 0xFFFF ? 2 : 1;
      out.push(...utf8(String.fromCodePoint(cp)));
    }
    return out;
  }
  /* bytes -> the text of a C or Python string literal body (printable ASCII, \r \n \t, \xHH for the rest) */
  function escBytes(bytes, lang) {
    return bytes.map(b => {
      if (b === 34) return '\\"';
      if (b === 92) return '\\\\';
      if (b === 10) return '\\n';
      if (b === 13) return '\\r';
      if (b === 9) return '\\t';
      if (b >= 32 && b < 127) return String.fromCharCode(b);
      return '\\x' + hex(b, 2).slice(2).toLowerCase();
    }).join('');
  }
  const ASCII = { 0: 'NUL', 7: 'BEL', 8: 'BS', 9: 'TAB', 10: 'LF', 13: 'CR', 27: 'ESC', 32: 'SP', 127: 'DEL' };
  const byteName = b => ASCII[b] || (b > 32 && b < 127 ? "'" + String.fromCharCode(b) + "'" : '');
  /* the label of a decoded byte, long to short */
  const byteTexts = (b, n) => { const nm = byteName(b), h = hex(b, n || 2); return nm ? [nm + ' ' + h, h, nm, ''] : [h, h.slice(2), '']; };

  /* a mark of the decoded row: texts from long to short (the longest that fits is drawn), a hue and an opacity */
  const M = (t0, t1, texts, h, a, extra) => Object.assign({ t0, t1, texts: [].concat(texts), h: h == null ? HUE.data : h, a: a == null ? 0.3 : a }, extra || {});

  /* the marks that fit the window: each gets the longest of its texts that fits its width, and the theme's colour */
  function fitMarks(marks, w, pxPerS) {
    const out = [], k = K();
    for (const m of marks || []) {
      if (m.t1 < w.w0 || m.t0 > w.w1) continue;
      const vis = (Math.min(m.t1, w.w1) - Math.max(m.t0, w.w0)) * pxPerS;
      if (vis < 3) continue;
      let text = '';
      for (const t of m.texts) { if (t != null && String(t).length * 6.3 + 8 <= vis) { text = String(t); break; } }
      out.push({ t0: m.t0, t1: m.t1, text, color: k.hue(m.h, m.a) });
    }
    return out;
  }
  /* the mark under a time, if any */
  const markAt = (marks, t) => (marks || []).find(m => t >= m.t0 && t < m.t1);
  /* an edge list from a list of bit levels, one bit time each, starting at t0 */
  function edgesOfBits(vals, tb, t0, idle) {
    const e = [[t0 - tb, idle == null ? 1 : idle]];
    let last = e[0][1];
    vals.forEach((v, i) => { if (v !== last) { e.push([t0 + i * tb, v]); last = v; } });
    return e;
  }
  /* the part of an edge list inside a window, starting with the level at its left edge: Hyper.esym.wave draws from the first
     level of the list, so a list that starts before a zoomed-in window would show a slanted line at the left */
  function clipEdges(edges, w0, w1) {
    const n = edges.length;
    if (!n) return edges;
    let i = 0, lvl = edges[0][1];
    while (i < n && edges[i][0] <= w0) lvl = edges[i++][1];
    const out = [[w0, lvl]];
    while (i < n && edges[i][0] <= w1) out.push(edges[i++]);
    return out;
  }
  /* the same for an analogue trace [[t, v], …]: the points inside the window, and the interpolated values at its two edges */
  function clipPts(pts, w0, w1) {
    if (pts.length < 2) return pts;
    const out = [[w0, interp(pts, w0)]];
    for (const p of pts) if (p[0] > w0 && p[0] < w1) out.push(p);
    out.push([w1, interp(pts, w1)]);
    return out;
  }
  /* y of a level (0…1) on the waveform of trace i of a drawn analyser */
  const lvlY = (g, i, v) => g.rowY(i) + g.rowH * 0.5 * (1 - v);

  /* ================================================================ state kept while the app is open */
  const VIEW = {};             // zoom and position of every tab
  const ST = {
    uart: { text: 'Hello', mode: 'text', crlf: false, baud: 9600, bits: 8, parity: 'none', stop: 1, gap: 0, err: 3 },
    i2c: { part: 0x3C, addr: 0x3C, mode: 'write', data: '00 AF', reg: 0x75, hz: 100000, nack: false, c: 100, r: 4700, rcZoom: 1 },
    spi: { mode: 0, hz: 1000000, out: '9F 00 00 00', inn: '00 EF 40 18', lsb: false },
    pwm: { kind: 'duty', freq: 5000, bits: 8, duty: 50, clock: 80, filter: false, tau: 6, angle: 90, range: 'nom' },
    pixels: { n: 3, sel: 0, colors: [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 160, 0], [255, 0, 255], [0, 255, 255], [255, 255, 255], [90, 20, 160]] },
    can: { id: 0x123, data: 'AB CD', rate: 500000, ack: true, kind: 'one', id2: 0x120 },
    inputs: { what: 'button', bounce: 5, win: 30, tau: 2, presses: 'two', dir: 1, detents: 3, speed: 150, poll: 0, addr: 0x00, cmd: 0x45, noise: false },
    onewire: { temp: 25, res: 12, missing: false, corrupt: false }
  };
  try { const saved = JSON.parse(localStorage.getItem('hyper:esp32:signals') || 'null'); if (saved && typeof saved.text === 'string') ST.uart.text = saved.text.slice(0, 80); } catch (e) { /* no storage */ }
  const save = () => { try { localStorage.setItem('hyper:esp32:signals', JSON.stringify({ text: ST.uart.text })); } catch (e) { /* no storage */ } };

  /* ================================================================ the analyser shared by every tab */
  /* def: {
   *   id, intro, aspect, state (an object kept between visits), note (html), more [concept ids], focusLabel, view { zoom, pos },
   *   pre(side, api) / post(side, api)    extra page elements before / after the controls
   *   controls(state) -> kit.controls definitions;  change(id, value, state, api) after a control moved;  btn { id(state, api) } buttons
   *   readout [[key, label], …] or { name: […] };   build(state, api) -> model
   *   code(state, model) -> a program entry;   extra(el, api) -> { update(state, model) } for what sits under the picture
   * }
   * model: {
   *   t0, t1                   the whole signal, in seconds
   *   traces: [{ label, h (hue), edges | pts (+ min, max), marks }]    marks: M(t0, t1, texts, hue, alpha)
   *   overlay(ctx, g, w, info) extra drawing on top of the traces; g from Hyper.esym.logic
   *   top: { h(W, H), draw(ctx, x, y, w, h, info) }     drawing above the traces
   *   hover(t) -> text, focus: { t0, span }, ro: { which, v: { key: text } }
   * } */
  function lab(body, def) {
    const kit = K();
    const V = VIEW[def.id] || (VIEW[def.id] = Object.assign({ zoom: 1, pos: 0 }, def.view || {}));
    const L = T.util.lab(body, def.intro, def.aspect || 0.62, { minH: def.minH || 380, maxH: 780 });
    const side = L.side, st = L.st;
    let model = null, ctl = null, loop = null, extra = null, cur = null, codeKey = '', codeTimer = 0;
    const state = def.state;
    const api = { st, state, side, under: L.under, rebuild, redraw: () => loop.once(), setView: (z, p) => setView(z, p), get ctl() { return ctl; }, view: V };
    const ZW = { x0: 8, lw: 64 };
    const geom = () => ({ plotX: ZW.x0 + ZW.lw, plotW: Math.max(40, st.W - 2 * ZW.x0 - ZW.lw) });
    const win = () => {
      const full = Math.max(1e-15, model.t1 - model.t0), span = full / clamp(V.zoom, 1, 1000);
      const w0 = model.t0 + clamp(V.pos, 0, 1) * (full - span);
      return { w0, w1: w0 + span, span, full };
    };
    const setView = (zoom, pos) => { V.zoom = clamp(zoom, 1, 1000); V.pos = clamp(pos, 0, 1); if (ctl) { ctl.set('zoom', V.zoom); ctl.set('pos', V.pos); } loop.once(); };
    const posFor = (start, span, full) => (full - span > 1e-15 ? clamp((start - model.t0) / (full - span), 0, 1) : 0);

    /* controls */
    const viewDefs = [
      { type: 'html', html: '<b>Time axis</b> — the mouse wheel zooms, dragging the picture pans' },
      { id: 'zoom', label: 'Zoom', min: 1, max: 1000, value: V.zoom, log: true, fmt: v => '× ' + fmt(v, 2) },
      { id: 'pos', label: 'Position', min: 0, max: 1, step: 0.001, value: V.pos, fmt: v => Math.round(v * 100) + ' %' },
      { type: 'buttons', items: [{ id: 'fit', label: 'Whole signal' }, { id: 'focus', label: def.focusLabel || 'Zoom to the first unit' }] }
    ];
    const onChange = (id, v, all) => {
      if (id === 'zoom') { V.zoom = v; loop.once(); return; }
      if (id === 'pos') { V.pos = v; loop.once(); return; }
      if (id === 'fit') { setView(1, 0); return; }
      if (id === 'focus') {
        const f = model && model.focus;
        if (!f) return;
        const full = model.t1 - model.t0, z = clamp(full / (f.span * 1.12), 1, 1000), span = full / z;
        const start = clamp(f.t0 - (span - f.span) / 2, model.t0, model.t1 - span);
        setView(z, posFor(start, span, full));
        return;
      }
      if (def.btn && def.btn[id]) def.btn[id](state, api);
      else {
        for (const k of Object.keys(all)) if (k !== 'zoom' && k !== 'pos') state[k] = all[k];
        if (def.change) def.change(id, v, state, api);
      }
      rebuild();
    };

    /* the page */
    if (def.pre) def.pre(side, api);
    ctl = kit.controls(side, def.controls(state).concat(viewDefs), onChange);
    const roDefs = Array.isArray(def.readout) ? { main: def.readout } : def.readout, ros = {};
    for (const k of Object.keys(roDefs)) ros[k] = kit.readout(side, roDefs[k].concat([['cur', 'Under the cursor']]));
    if (def.post) def.post(side, api);
    L.under.innerHTML = '<p class="small sig-note">' + def.note + '</p><div class="sig-x"></div><div class="sig-code"></div>' + T.util.more(def.more || []);
    const codeEl = ui.$('.sig-code', L.under);
    if (def.extra) extra = def.extra(ui.$('.sig-x', L.under), api);

    function renderCode(entry) {
      const key = JSON.stringify(entry);
      if (key === codeKey) return;
      const first = !codeKey;
      codeKey = key;
      const go = () => T.util.code(codeEl, entry);
      if (first) go(); else { clearTimeout(codeTimer); codeTimer = setTimeout(go, 160); }
    }
    function rebuild() {
      model = def.build(state, api);
      V.zoom = clamp(V.zoom, 1, 1000); V.pos = clamp(V.pos, 0, 1);
      const which = (model.ro && model.ro.which) || 'main';
      for (const k of Object.keys(ros)) ros[k].show(k === which);
      if (model.ro) {
        for (const [k, v] of Object.entries(model.ro.v)) ros[which].set(k, v);
        const hide = model.ro.hide || [];
        for (const [k] of roDefs[which]) ros[which].show(k, !hide.includes(k));
      }
      if (def.code) renderCode(def.code(state, model));
      if (extra && extra.update) extra.update(state, model);
      loop.once();
    }

    /* drawing */
    const draw = () => {
      const ctx = st.begin(), W = st.W, Hh = st.H, c = kit.colors();
      if (!model) return;
      const w = win(), gm = geom(), pxPerS = gm.plotW / w.span;
      const topH = model.top ? Math.min(Math.round(model.top.h(W, Hh)), Math.round(Hh * 0.46)) : 0;
      const curT = cur && cur.x >= gm.plotX && cur.x <= gm.plotX + gm.plotW ? w.w0 + (cur.x - gm.plotX) / gm.plotW * w.span : null;
      const info = { curT, pxPerS, c, W, H: Hh };
      if (model.top) model.top.draw(ctx, ZW.x0, 6, W - 2 * ZW.x0, topH - 8, info, w);
      const traces = model.traces.map(tr => ({ label: tr.label, edges: tr.edges ? clipEdges(tr.edges, w.w0, w.w1) : undefined, pts: tr.pts ? clipPts(tr.pts, w.w0, w.w1) : undefined, min: tr.min, max: tr.max, color: kit.hue(tr.h == null ? HUE.data : tr.h), marks: fitMarks(tr.marks, w, pxPerS) }));
      const g = S().logic(ctx, ZW.x0, topH, W - 2 * ZW.x0, Hh - topH - 4, traces, { t0: w.w0, t1: w.w1, cursor: curT, labelW: ZW.lw });
      if (model.overlay) model.overlay(ctx, g, w, info);
      const which = (model.ro && model.ro.which) || 'main';
      if (curT != null) {
        kit.label(ctx, fmtT(curT), clamp(cur.x, gm.plotX + 24, gm.plotX + gm.plotW - 24), g.plot.y + g.plot.h + 8, { size: 10.5, align: 'center', color: c.warn, bg: c.surface2 });
        const hv = model.hover ? model.hover(curT) : '';
        ros[which].set('cur', fmtT(curT) + (hv ? ' · ' + hv : ''));
      } else ros[which].set('cur', '— (move the mouse over the picture)');
    };
    loop = kit.loop(draw, L.stage);
    st.onResize(() => loop.once());
    T.util.onTheme(() => loop.once());

    /* mouse: the cursor, the wheel, dragging */
    const cv = st.canvas;
    cv.addEventListener('pointermove', e => { cur = st.pos(e); loop.once(); });
    cv.addEventListener('pointerleave', () => { cur = null; loop.once(); });
    cv.addEventListener('wheel', e => {
      if (!model) return;
      const p = st.pos(e), gm = geom();
      if (p.x < gm.plotX || p.x > gm.plotX + gm.plotW) return;
      e.preventDefault();
      const w = win(), f = (p.x - gm.plotX) / gm.plotW, tc = w.w0 + f * w.span;
      const z = clamp(V.zoom * (e.deltaY < 0 ? 1.3 : 1 / 1.3), 1, 1000), span = w.full / z;
      setView(z, posFor(clamp(tc - f * span, model.t0, model.t1 - span), span, w.full));
    }, { passive: false });
    kit.drag(st, {
      hit: p => { const gm = geom(); return model && V.zoom > 1.001 && p.x >= gm.plotX && p.x <= gm.plotX + gm.plotW ? { x0: p.x, start0: win().w0 } : null; },
      move: (h, p) => {
        const w = win(), gm = geom();
        setView(V.zoom, posFor(clamp(h.start0 - (p.x - h.x0) / gm.plotW * w.span, model.t0, model.t1 - w.span), w.span, w.full));
      },
      hover: true
    });
    rebuild();
    return api;
  }

  /* a text box in the side column: { label, value, placeholder, onInput(value) } -> { hint(text), set(value) } */
  function textBox(side, o) {
    const box = ui.el('<div class="ctl"><div class="cl"><span>' + esc(o.label) + '</span></div><input type="text" class="inp sigtxt" spellcheck="false" autocomplete="off" maxlength="' + (o.max || 120) + '" placeholder="' + esc(o.placeholder || '') + '"><div class="small faint sighint"></div></div>');
    const inp = box.querySelector('input'), hint = box.querySelector('.sighint');
    inp.value = o.value;
    inp.addEventListener('input', () => o.onInput(inp.value));
    side.appendChild(box);
    return { input: inp, set: v => { inp.value = v; }, hint: t => { hint.textContent = t; } };
  }

  /* ================================================================ UART */
  const BAUDS = [9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600];
  const PARITY_LETTER = { none: 'N', even: 'E', odd: 'O' };
  function uartBytesOf(s) {
    let bytes = s.mode === 'hex' ? parseHex(s.text).bytes : textBytes(s.text);
    if (s.crlf) bytes = bytes.concat([13, 10]);
    if (!bytes.length) bytes = [0x55];
    return bytes.slice(0, 24);
  }
  /* what the lab draws for a UART setting: the frames, and a receiver whose clock is off by s.err per cent */
  function uartModel(s) {
    const bytes = uartBytesOf(s), nb = s.bits, mask = (1 << nb) - 1, tb = 1 / s.baud;
    const edges = [[-tb, 1]], bitMarks = [], byteMarks = [], frames = [];
    let t = 0;
    for (const b0 of bytes) {
      const f = P().uart(b0, { baud: s.baud, bits: nb, parity: s.parity, stop: s.stop, t });
      for (const e of f.edges.slice(1)) edges.push(e);
      const frame = { byte: b0 & mask, t0: t, t1: f.t1, bits: f.bits };
      frames.push(frame);
      for (const bit of f.bits) {
        if (bit.kind === 'start') bitMarks.push(M(bit.t0, bit.t1, ['start', 'S'], HUE.clock));
        else if (bit.kind === 'data') bitMarks.push(M(bit.t0, bit.t1, ['D' + bit.i + ' = ' + bit.v, 'D' + bit.i, String(bit.i)], HUE.data, bit.v ? 0.45 : 0.2));
        else if (bit.kind === 'parity') bitMarks.push(M(bit.t0, bit.t1, ['parity ' + bit.v, 'P'], HUE.second));
        else bitMarks.push(M(bit.t0, bit.t1, ['stop', '■'], HUE.ok));
      }
      byteMarks.push(M(t, f.t1, byteTexts(frame.byte), HUE.data));
      t = f.t1 + s.gap * tb;
    }
    const tEnd = frames[frames.length - 1].t1, frameBits = frames[0].bits.length;
    // the receiver: it finds the start edge, then samples each bit in the middle of ITS bit time
    const rxBaud = s.baud * (1 + s.err / 100), rtb = 1 / rxBaud;
    const samples = [], rxMarks = [];
    let wrong = 0, firstWrong = -1;
    frames.forEach((f, idx) => {
      let byte = 0, ones = 0, framing = false, parityBad = false;
      f.bits.forEach((bit, k) => {
        const ts = f.t0 + (k + 0.5) * rtb, lv = P().levelAt(edges, ts);
        samples.push({ t: ts, v: lv, want: bit.v });
        if (bit.kind === 'start') { if (lv !== 0) framing = true; }
        else if (bit.kind === 'data') { byte |= lv << bit.i; ones += lv; }
        else if (bit.kind === 'parity') { if ((ones + lv) % 2 !== (s.parity === 'even' ? 0 : 1)) parityBad = true; }
        else if (lv !== 1) framing = true;
      });
      if (byte === f.byte && !framing && !parityBad) rxMarks.push(M(f.t0, f.t1, byteTexts(byte), HUE.back));
      else {
        wrong++; if (firstWrong < 0) firstWrong = idx + 1;
        const why = framing ? 'framing error' : parityBad ? 'parity error' : 'wrong bits', h = hex(byte);
        rxMarks.push(M(f.t0, f.t1, [h + ' ' + why, h + ' ✗', '✗'], HUE.bad, 0.45));
      }
    });
    const be = E.baudError(s.baud, rxBaud, frameBits), act = E.uartActualBaud(s.baud), actErr = (act - s.baud) / s.baud * 100;
    const frameT = frameBits * tb;
    return {
      bytes, frames, tb, frameBits, samples, wrong, firstWrong, be, act, actErr, rxBaud, tEnd,
      t0: -tb, t1: tEnd + tb,
      traces: [
        { label: 'TX', h: HUE.data, edges, marks: bitMarks },
        { label: 'bytes', h: HUE.data, pts: [], marks: byteMarks },
        { label: 'RX ' + (s.err < 0 ? '−' : '+') + fmt(Math.abs(s.err), 2) + '%', h: HUE.back, edges, marks: [] },
        { label: 'RX reads', h: HUE.back, pts: [], marks: rxMarks }
      ],
      focus: { t0: 0, span: frameT },
      hover(t) {
        const f = frames.find(fr => t >= fr.t0 && t < fr.t1);
        if (!f) return 'idle: the line rests high';
        const bit = f.bits.find(b => t >= b.t0 && t < b.t1) || f.bits[f.bits.length - 1];
        const what = bit.kind === 'data' ? 'bit D' + bit.i + ' = ' + bit.v : bit.kind === 'start' ? 'start bit' : bit.kind === 'parity' ? 'parity bit = ' + bit.v : 'stop bit';
        return 'byte ' + (frames.indexOf(f) + 1) + ' ' + (byteName(f.byte) ? byteName(f.byte) + ' ' : '') + hex(f.byte) + ' · ' + what;
      },
      overlay(ctx, g, w, info) {
        const c = info.c, kit = K();
        if (tb * info.pxPerS >= 9) {
          ctx.save(); ctx.strokeStyle = c.faint; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.beginPath();
          for (const f of frames) {
            if (f.t1 < w.w0 || f.t0 > w.w1) continue;
            for (let k = 0; k <= f.bits.length; k++) { const x = Math.round(g.X(f.t0 + k * tb)) + 0.5; ctx.moveTo(x, g.rowY(2) - 2); ctx.lineTo(x, g.rowY(2) + g.rowH * 0.55); }
          }
          ctx.stroke(); ctx.restore();
        }
        for (const sm of samples) {
          if (sm.t < w.w0 || sm.t > w.w1) continue;
          kit.dot(ctx, g.X(sm.t), lvlY(g, 2, sm.v), 3.8, sm.v === sm.want ? c.ok : c.bad, c.bg2);
        }
      },
      ro: {
        v: {
          bit: fmtT(tb) + ' (1 / ' + s.baud + ')',
          frame: frameBits + ' bits = ' + fmtT(frameT) + ' · ' + nb + ' of ' + frameBits + ' carry data (' + Math.round(nb / frameBits * 100) + ' %)',
          rate: fmt(s.baud / (frameBits + s.gap), 4) + ' bytes per second',
          msg: plural(bytes.length, 'byte') + ' take ' + fmtT(tEnd),
          div: fmt(act, 6) + ' baud made by the ESP32 divider (' + (actErr >= 0 ? '+' : '−') + fmt(Math.abs(actErr), 2) + ' %)',
          rx: 'receiver at ' + fmt(rxBaud, 6) + ' baud · drift ' + fmt(be.drift, 2) + ' bit times at the last bit',
          verdict: wrong ? plural(wrong, 'byte') + ' read wrongly, the first is byte ' + firstWrong : 'all ' + plural(bytes.length, 'byte') + ' read correctly'
        }
      }
    };
  }
  function uartCode(s, bytes) {
    const cfg = 'SERIAL_' + s.bits + PARITY_LETTER[s.parity] + s.stop;
    const printable = bytes.every(b => (b >= 32 && b < 127) || b === 9 || b === 10 || b === 13);
    const pyParity = { none: 'None', even: '0', odd: '1' }[s.parity];
    const shown = hexList(bytes.slice(0, 8)) + (bytes.length > 8 ? ' …' : '');
    const cpp = 'const int TX_PIN = 17, RX_PIN = 16;\n' + (printable ? '' : 'const uint8_t MSG[] = { ' + bytes.map(b => hex(b)).join(', ') + ' };\n') +
      '\nvoid setup() {\n  Serial1.begin(' + s.baud + ', ' + cfg + ', RX_PIN, TX_PIN);   // baud, frame format, RX pin, TX pin\n}\n\nvoid loop() {\n  ' +
      (printable ? 'Serial1.print("' + escBytes(bytes) + '");' : 'Serial1.write(MSG, sizeof(MSG));') + '\n  delay(1000);\n}\n';
    const py = 'from machine import UART\nimport time\n\nuart = UART(1, baudrate=' + s.baud + ', bits=' + s.bits + ', parity=' + pyParity + ', stop=' + s.stop + ', tx=17, rx=16)\n\nwhile True:\n  ' +
      '  uart.write(b"' + escBytes(bytes) + '")\n    time.sleep(1)\n';
    const blocks = 'when started\n  start UART (1) at (' + s.baud + ') baud\n  set UART (1) to (' + s.bits + ') data bits, parity [' + s.parity + ' v], (' + s.stop + ') stop bits :: bus\nforever\n  send bytes [' + shown + '] on UART (1) :: bus\n  wait (1) seconds\nend\n';
    return {
      title: 'Send this message on a UART', about: 'The program that puts exactly this frame format on the wire, once a second. The other end must use the same settings.',
      needs: 'An ESP32 DevKit, and a second device or a USB-serial adapter set to ' + s.baud + ' baud, ' + s.bits + ' data bits, parity ' + s.parity + ', ' + s.stop + ' stop bit' + (s.stop > 1 ? 's' : '') + '.',
      wiring: [['GPIO17 (TX)', 'RX of the other device'], ['GPIO16 (RX)', 'TX of the other device'], ['GND', 'GND', 'the grounds must be joined']],
      blocks, cpp, py,
      output: 'The other device receives ' + plural(bytes.length, 'byte') + ': ' + hexList(bytes.slice(0, 12)) + (bytes.length > 12 ? ' …' : ''),
      notes: ['The frame format is written ' + s.bits + PARITY_LETTER[s.parity] + s.stop + ': data bits, parity (N, E or O), stop bits.', 'On a module with PSRAM (a WROVER, or an S3 with octal PSRAM) some of GPIO16 and 17 are taken: choose other pins.']
    };
  }
  function uart(body) {
    const s = ST.uart;
    lab(body, {
      id: 'uart', state: s, aspect: 0.66, focusLabel: 'Zoom to one frame',
      intro: 'A UART has no clock wire. The sender puts a start bit, the data bits (least significant first), perhaps a parity bit and the stop bits on one wire, and the receiver samples them with a clock of its own. Type a message and choose the frame format.',
      note: 'The line rests <b>high</b>. A frame begins with a <b>start bit</b> (low); the receiver finds that falling edge and then samples each bit in the middle of its time slot, using its own clock — the dots on the <b>RX</b> row. If the clocks disagree the dots drift across the bit cells: green dots read what was sent, red ones read the neighbour. Try ±3 %, then ±6 %, with 8N1 (the last bit is sampled after 9½ bit times, so about ±5 % is the limit); then add parity or a second stop bit and see how the frame grows.',
      more: ['uart-on-the-esp', 'serial-communication-basics', 'uart', 'the-logic-analyser'],
      pre(side, api) {
        api.tb = textBox(side, { label: 'Message to send', value: s.text, placeholder: 'Hello, or 48 65 6C 6C 6F in hex mode', max: 80, onInput(v) { s.text = v; save(); api.rebuild(); } });
      },
      controls: st => [
        { id: 'mode', type: 'select', label: 'The box holds', options: [['Text (\\n \\r \\xHH allowed)', 'text'], ['Hex bytes', 'hex']], value: st.mode },
        { id: 'crlf', type: 'check', label: 'Add CR LF at the end (println)', value: st.crlf },
        { type: 'buttons', items: [{ id: 'p_hello', label: 'Hello' }, { id: 'p_at', label: 'AT\\r\\n' }, { id: 'p_55', label: '0x55 0x55' }] },
        { id: 'baud', type: 'select', label: 'Baud rate', options: BAUDS.map(b => [b + ' baud', b]), value: st.baud },
        { id: 'bits', type: 'select', label: 'Data bits', options: [['5', 5], ['6', 6], ['7', 7], ['8', 8]], value: st.bits },
        { id: 'parity', type: 'select', label: 'Parity', options: [['none', 'none'], ['even', 'even'], ['odd', 'odd']], value: st.parity },
        { id: 'stop', type: 'select', label: 'Stop bits', options: [['1', 1], ['2', 2]], value: st.stop },
        { id: 'gap', label: 'Idle gap between bytes', min: 0, max: 12, step: 1, value: st.gap, unit: 'bit times' },
        { id: 'err', label: 'Receiver clock error', min: -12, max: 12, step: 0.1, value: st.err, fmt: v => (v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v), 2) + ' %' }
      ],
      btn: {
        p_hello(st, api) { st.mode = 'text'; st.text = 'Hello'; st.crlf = false; sync(api); },
        p_at(st, api) { st.mode = 'text'; st.text = 'AT\\r\\n'; st.crlf = false; sync(api); },
        p_55(st, api) { st.mode = 'hex'; st.text = '55 55'; st.crlf = false; sync(api); }
      },
      readout: [['bit', 'One bit'], ['frame', 'One frame'], ['rate', 'Throughput'], ['msg', 'The message'], ['div', 'The ESP32 makes'], ['rx', 'The receiver'], ['verdict', 'The receiver reads']],
      build(st, api) {
        const m = uartModel(st);
        if (api.tb) {
          const bad = st.mode === 'hex' ? parseHex(st.text).bad : [];
          api.tb.hint(bad.length ? 'Not hex: ' + bad.slice(0, 3).join(', ') : (st.text.trim() ? plural(m.bytes.length, 'byte') + ': ' + hexList(m.bytes.slice(0, 10)) + (m.bytes.length > 10 ? ' …' : '') : 'Nothing typed: showing 0x55'));
        }
        return m;
      },
      code: (st, m) => uartCode(st, m.bytes)
    });
    function sync(api) { api.tb.set(s.text); api.ctl.set('mode', s.mode); api.ctl.set('crlf', s.crlf); save(); }
  }

  /* ================================================================ I2C */
  const I2C_PARTS = Object.keys(E.I2C_ADDR).map(Number).sort((a, b) => a - b);
  const i2cName = a => (E.I2C_ADDR[a] || [])[0] || '';
  /* the transfer the reader asked for: write, read, or a register read (write the register, REPEATED start, read) */
  function i2cModel(s) {
    const hz = s.hz, tb = 1 / hz, q = tb / 4;
    const data = parseHex(s.data).bytes.slice(0, 8);
    if (!data.length) data.push(s.mode === 'read' || s.mode === 'reg' ? 0xFF : 0x00);
    const o = { addr: s.addr, hz, addrAck: !s.nack };
    let scl, sda, raw = [], t1, regRead = false;
    if (s.mode === 'reg' && !s.nack) {
      const A = P().i2c(Object.assign({}, o, { read: false, data: [s.reg] }));
      const Ta = A.marks.find(m => m.kind === 'stop').t0 - q;               // the instant the STOP would begin
      const B = P().i2c(Object.assign({}, o, { read: true, data, t: Ta + 2 * q }));
      const cut = l => l.filter(e => e[0] < Ta - 1e-15);
      scl = cut(A.scl).concat([[Ta + q, 1]], B.scl.slice(1));                // SDA is let go, SCL rises, SDA falls: a repeated START
      sda = cut(A.sda).concat([[Ta, 1]], B.sda.slice(1));
      raw = A.marks.filter(m => m.kind !== 'stop').map((m, i) => (m.kind === 'data' ? Object.assign({}, m, { reg: true }) : m)).concat(B.marks.map((m, i) => (i === 0 ? Object.assign({}, m, { text: 'Sr', kind: 'restart' }) : m)));
      t1 = B.t1; regRead = true;
    } else {
      const X = P().i2c(Object.assign({}, o, { read: s.mode === 'read', data: s.mode === 'reg' ? [s.reg] : data }));
      scl = X.scl; sda = X.sda; raw = X.marks; t1 = X.t1;
    }
    const reading = s.mode === 'read', marks = [], samples = [];
    let seenAddr = 0, lastFromDevice = false;
    for (const m of raw) {
      if (m.kind === 'start') marks.push(M(m.t0, m.t1, [m.text === 'S' ? 'START' : m.text, 'S'], HUE.clock, 0.35, { info: 'START: SDA falls while SCL is high' }));
      else if (m.kind === 'restart') marks.push(M(m.t0, m.t1, ['Sr', 'S'], HUE.clock, 0.35, { info: 'repeated START: the controller keeps the bus and starts again' }));
      else if (m.kind === 'stop') marks.push(M(m.t0, m.t1, ['STOP', 'P'], HUE.clock, 0.35, { info: 'STOP: SDA rises while SCL is high' }));
      else if (m.kind === 'addr') {
        const [a, rw] = m.text.split(' ');
        seenAddr++;
        marks.push(M(m.t0, m.t0 + 7 * tb, ['address ' + a, a, ''], HUE.addr, 0.32, { info: 'the 7-bit address ' + a + ' (most significant bit first)' + (i2cName(s.addr) ? ', e.g. ' + i2cName(s.addr) : '') }));
        marks.push(M(m.t0 + 7 * tb, m.t1, [rw === 'W' ? 'write' : 'read', rw], HUE.second, 0.4, { info: 'the eighth bit: 0 = the controller writes, 1 = it reads' }));
        for (let k = 0; k < 8; k++) samples.push(m.t0 + k * tb + q);
      } else if (m.kind === 'data') {
        const h = m.text, fromDevice = (reading || (regRead && !m.reg && seenAddr > 1));
        marks.push(M(m.t0, m.t1, m.reg ? ['register ' + h, h, ''] : [h, h.slice(2), ''], fromDevice ? HUE.back : HUE.data, 0.32, { info: m.reg ? 'the register number ' + h + ' the controller writes' : (fromDevice ? 'a byte the DEVICE puts on SDA: ' : 'a byte the controller sends: ') + h }));
        for (let k = 0; k < 8; k++) samples.push(m.t0 + k * tb + q);
      } else {
        const ack = m.kind === 'ack';
        // a NACK after a byte the device sent is the controller saying "that was the last one": not an error
        const ending = !ack && lastFromDevice;
        marks.push(M(m.t0, m.t1, [ack ? 'ACK' : 'NACK', ack ? 'A' : 'N'], ack ? HUE.ok : ending ? HUE.analog : HUE.bad, ack ? 0.35 : 0.5,
          { info: ack ? 'ACK: the receiver pulls SDA low during the ninth clock' : ending ? 'NACK from the controller: "that was the last byte", so the device lets go of SDA' : 'NACK: nobody pulls SDA low, it stays high' }));
        samples.push(m.t0 + q);
      }
      if (m.kind !== 'ack' && m.kind !== 'nack') lastFromDevice = m.kind === 'data' && (reading || (regRead && !m.reg && seenAddr > 1));
    }
    const nBytes = raw.filter(m => m.kind === 'addr' || m.kind === 'data').length, payload = s.nack ? 0 : (s.mode === 'write' ? data.length : s.mode === 'read' ? data.length : data.length + 1);
    const addrMark = raw.find(m => m.kind === 'addr');
    const result = s.nack ? 'NACK: nobody answers to ' + hex(s.addr) + '. The controller stops. Arduino: endTransmission() returns 2; MicroPython raises OSError.'
      : s.mode === 'write' ? 'ACK: the device accepted the address and ' + plural(data.length, 'byte') + '.'
        : s.mode === 'read' ? 'ACK; the device sent ' + plural(data.length, 'byte') + ' and the controller NACKed the last one to end the read.'
          : 'ACK, ACK; then a repeated START and ' + plural(data.length, 'byte') + ' read back — the register number was never separated from the read by a STOP.';
    return {
      data, scl, sda, marks, hz, tb, tXfer: t1,
      t0: -tb, t1: t1 + tb,
      traces: [{ label: 'SCL', h: HUE.clock, edges: scl, marks: [] }, { label: 'SDA', h: HUE.data, edges: sda, marks }],
      focus: { t0: addrMark.t0, span: 9 * tb },
      hover(t) { const m = markAt(marks, t); return m ? m.info : 'the bus is idle: both lines high'; },
      overlay(ctx, g, w, info) {
        if (tb * info.pxPerS < 14) return;
        const c = info.c, kit = K();
        ctx.save(); ctx.strokeStyle = c.faint; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.beginPath();
        for (const ts of samples) { if (ts < w.w0 || ts > w.w1) continue; const x = Math.round(g.X(ts)) + 0.5; ctx.moveTo(x, lvlY(g, 0, 1)); ctx.lineTo(x, lvlY(g, 1, 0)); }
        ctx.stroke(); ctx.restore();
        for (const ts of samples) { if (ts < w.w0 || ts > w.w1) continue; kit.dot(ctx, g.X(ts), lvlY(g, 1, P().levelAt(sda, ts)), 3.6, c.warn, c.bg2); }
      },
      ro: {
        v: {
          part: i2cName(s.addr) ? hex(s.addr) + ' is usually ' + (E.I2C_ADDR[s.addr] || []).join(', ') : hex(s.addr) + ': not a common address; look in the part\'s datasheet',
          clock: 'SCL ' + fmtHz(hz) + ' · ' + fmtT(tb) + ' per bit',
          bytes: plural(nBytes, 'byte') + ' on the wire, 9 clock pulses each (8 bits and the ACK)',
          time: fmtT(t1 - 0) + ' from START to STOP',
          rate: s.nack ? 'nothing transferred' : fmt(payload / t1, 4) + ' payload bytes per second',
          result
        }
      }
    };
  }
  function i2cCode(s, m) {
    const a = hex(s.addr), nm = i2cName(s.addr), data = m.data;
    const wlist = data.map(b => hex(b)).join(', '), pyBytes = 'b"' + data.map(b => '\\x' + hex(b).slice(2).toLowerCase()).join('') + '"';
    const cmt = nm ? '   // ' + nm : '';
    const head = '#include <Wire.h>\n\nconst int SDA_PIN = 21, SCL_PIN = 22;\nconst uint8_t ADDR = ' + a + ';' + cmt + '\n\nvoid setup() {\n  Serial.begin(115200);\n  Wire.begin(SDA_PIN, SCL_PIN, ' + s.hz + ');   // sda, scl, clock in Hz\n}\n\nvoid loop() {\n';
    let cpp, py, blocks, about;
    const pyHead = 'from machine import I2C, Pin\nimport time\n\ni2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=' + s.hz + ')\n\nwhile True:\n    try:\n';
    const pyTail = '    except OSError:\n        print("no ACK from ' + a + '")\n    time.sleep(1)\n';
    if (s.mode === 'write') {
      about = 'One write transfer: START, the address with the write bit, ' + plural(data.length, 'byte') + ', STOP.';
      cpp = head + '  Wire.beginTransmission(ADDR);\n' + data.map(b => '  Wire.write(' + hex(b) + ');').join('\n') + '\n  uint8_t err = Wire.endTransmission();   // 0 = acknowledged, 2 = nobody answered\n  Serial.println(err);\n  delay(1000);\n}\n';
      py = pyHead + '        i2c.writeto(' + a + ', ' + pyBytes + ')\n        print("ok")\n' + pyTail;
      blocks = 'when started\n  start I2C on SDA (21) SCL (22)\nforever\n  I2C write [' + hexList(data) + '] to address (' + a + ') :: bus\n  wait (1) seconds\nend\n';
    } else if (s.mode === 'read') {
      about = 'One read transfer: START, the address with the read bit, ' + plural(data.length, 'byte') + ' from the device, STOP.';
      cpp = head + '  size_t got = Wire.requestFrom(ADDR, (size_t)' + data.length + ');   // START, address + R, bytes, STOP\n  while (Wire.available()) Serial.println(Wire.read(), HEX);\n  Serial.println(got);\n  delay(1000);\n}\n';
      py = pyHead + '        data = i2c.readfrom(' + a + ', ' + data.length + ')\n        print(data)\n' + pyTail;
      blocks = 'when started\n  start I2C on SDA (21) SCL (22)\nforever\n  set [data] to (I2C read (' + data.length + ') bytes from address (' + a + ')) :: bus\n  print (data)\n  wait (1) seconds\nend\n';
    } else {
      about = 'A register read: write the register number, repeat START (no STOP in between), then read ' + plural(data.length, 'byte') + '.';
      cpp = head + '  Wire.beginTransmission(ADDR);\n  Wire.write(' + hex(s.reg) + ');                 // the register number\n  Wire.endTransmission(false);           // false: repeated START, no STOP\n  Wire.requestFrom(ADDR, (size_t)' + data.length + ');\n  while (Wire.available()) Serial.println(Wire.read(), HEX);\n  delay(1000);\n}\n';
      py = pyHead + '        data = i2c.readfrom_mem(' + a + ', ' + hex(s.reg) + ', ' + data.length + ')   # register, then read\n        print(data)\n' + pyTail;
      blocks = 'when started\n  start I2C on SDA (21) SCL (22)\nforever\n  set [data] to (I2C read (' + data.length + ') bytes from address (' + a + ') register (' + hex(s.reg) + ')) :: bus\n  print (data)\n  wait (1) seconds\nend\n';
    }
    return {
      title: s.mode === 'write' ? 'Write bytes to an I2C device' : s.mode === 'read' ? 'Read bytes from an I2C device' : 'Read a register of an I2C device', about,
      needs: 'An ESP32 DevKit and an I2C device at ' + a + (nm ? ' (' + nm + ')' : '') + ', with pull-up resistors on SDA and SCL (most breakout boards have them).',
      wiring: [['GPIO21', 'SDA'], ['GPIO22', 'SCL'], ['3V3 and GND', 'the device\'s supply']],
      blocks, cpp, py,
      output: s.nack ? 'Nobody answers at ' + a + ': err = 2 (Arduino), or "no ACK from ' + a + '" (MicroPython).' : 'The address is acknowledged' + (s.mode === 'write' ? ': err = 0.' : ' and the device sends its bytes.'),
      notes: ['Wire.begin(sda, scl, clock) takes the SDA pin first; with a single argument it would make the ESP32 a slave.', 'To find out which addresses answer, try every address from 1 to 126: the ones that acknowledge are present.']
    };
  }
  /* the small second picture: the rising edge of SCL through the pull-up, for the bus capacitance and resistor chosen */
  function i2cRise(el) {
    const kit = K(), s = ST.i2c, vcc = 3.3;
    el.innerHTML = '<div class="boxy"><h3>Why the pull-up matters: the rising edge</h3><p class="small muted" style="margin:0 0 10px">The devices only pull a line down; the resistor pulls it up again, charging the wiring capacitance. A big resistor or a long bus makes a slow, rounded edge. The bus counts a level above 70 % of the supply as high and below 30 % as low, and the standard allows the climb from 30 % to 70 % to take at most 1000 ns at 100 kHz and 300 ns at 400 kHz.</p><div class="esplab"><div class="side rc-side"></div><div><div class="stage rc-stage"></div></div></div></div>';
    const side = ui.$('.rc-side', el), stg = ui.$('.rc-stage', el);
    const st = kit.stage(stg, { aspect: 0.52, minH: 300, maxH: 400 });
    let info = null;
    const ctl = kit.controls(side, [
      { id: 'c', label: 'Bus capacitance (wires, pins, connectors)', min: 10, max: 400, step: 5, value: s.c, unit: 'pF' },
      { id: 'r', label: 'Pull-up resistor', min: 1000, max: 47000, log: true, value: s.r, fmt: v => fmtOhm(v) },
      { id: 'rcZoom', label: 'Zoom on the rising edge', min: 1, max: 20, log: true, value: s.rcZoom, fmt: v => '× ' + fmt(v, 2) }
    ], (id, v) => { s[id] = v; update(); });
    const ro = kit.readout(side, [['tr', 'Rise time, 30 % to 70 %'], ['limit', 'The limit'], ['range', 'Pull-up range for this bus'], ['sink', 'Current when pulled low'], ['verdict', 'Verdict']]);
    const compute = () => {
      const hz = s.hz, per = 1 / hz, Cb = s.c * 1e-12, tau = s.r * Cb, tauF = 100 * Cb, pu = E.i2cPullup(vcc, Cb, hz, s.r);
      const phases = [[0, per / 2, 0], [per / 2, per, 1], [per, 1.5 * per, 0], [1.5 * per, 2 * per, 1], [2 * per, 2.5 * per, 0]];
      const vAt = t => {
        let v0 = 0;
        for (const [a, b, hi] of phases) {
          const ta = hi ? tau : tauF, tg = hi ? vcc : 0;
          if (t < b) return tg + (v0 - tg) * Math.exp(-Math.max(0, t - a) / ta);
          v0 = tg + (v0 - tg) * Math.exp(-(b - a) / ta);
        }
        return v0;
      };
      const reach = vAt(per - 1e-12);                                      // the level the first high phase reaches
      const sink = (vcc - 0.4) / s.r * 1000;
      const ok = pu.rise <= pu.limit && s.r >= pu.min && reach >= 0.7 * vcc;
      info = { per, tau, pu, vAt, reach, sink, ok, ideal: [[-per, 0], [per / 2, 1], [per, 0], [1.5 * per, 1], [2 * per, 0]] };
      ro.set('tr', fmtT(pu.rise));
      ro.set('limit', fmtT(pu.limit) + (hz > 100e3 ? ' (fast mode, 400 kHz)' : ' (standard mode, 100 kHz)'));
      ro.set('range', fmtOhm(pu.min) + ' to ' + fmtOhm(pu.max) + (s.r < pu.min ? ' — yours is too small' : s.r > pu.max ? ' — yours is too large' : ' — yours fits'));
      ro.set('sink', fmt(sink, 2) + ' mA' + (sink > 3 ? ' — more than the 3 mA a pin must sink' : ' — within 3 mA'));
      ro.set('verdict', ok ? 'The edge is fast enough for ' + fmtHz(hz) + '.' : reach < 0.7 * vcc ? 'The edge does not even reach 70 % before the clock falls: the bus fails.' : s.r < pu.min ? 'The resistor is so small that a device cannot pull the line below 0.4 V.' : 'Too slow for ' + fmtHz(hz) + ': use a smaller resistor, a shorter bus, or a slower clock.');
    };
    const draw = () => {
      const ctx = st.begin(), c = kit.colors();
      if (!info) return;
      const { per, vAt, pu, ok } = info, total = 2.5 * per, span = total / s.rcZoom;
      const t0 = clamp(per / 2 - 0.35 * span, 0, total - span), t1 = t0 + span;
      const ts = [];
      for (let i = 0; i <= 480; i++) ts.push(t0 + span * i / 480);
      for (const b of [per / 2, per, 1.5 * per, 2 * per]) if (b > t0 && b < t1) ts.push(b - 1e-12, b);
      ts.sort((a, b) => a - b);
      const vmax = vcc * 1.12, pts = ts.map(t => [t, vAt(t)]);
      const g = S().logic(ctx, 8, 6, st.W - 16, st.H - 10, [{ label: 'ideal', color: kit.hue(HUE.clock, 0.5), edges: clipEdges(info.ideal, t0, t1), marks: [] }, { label: 'SCL pin', color: kit.hue(HUE.clock), pts, min: 0, max: vmax, marks: [] }], { t0, t1, labelW: 64 });
      const Y = v => g.rowY(1) + g.rowH * 0.5 * (1 - v / vmax);
      ctx.save(); ctx.setLineDash([5, 4]); ctx.lineWidth = 1; ctx.strokeStyle = c.muted;
      for (const f of [0.3, 0.7]) { ctx.beginPath(); ctx.moveTo(g.plot.x, Y(f * vcc)); ctx.lineTo(g.plot.x + g.plot.w, Y(f * vcc)); ctx.stroke(); }
      ctx.restore();
      kit.label(ctx, '70 % = ' + fmt(0.7 * vcc, 3) + ' V: a 1 above this', g.plot.x + g.plot.w - 4, Y(0.7 * vcc) - 8, { size: 10.5, align: 'right', color: c.muted });
      kit.label(ctx, '30 % = ' + fmt(0.3 * vcc, 3) + ' V: a 0 below this', g.plot.x + g.plot.w - 4, Y(0.3 * vcc) + 9, { size: 10.5, align: 'right', color: c.muted });
      // the 30 % to 70 % climb of the first edge, against the limit
      const a30 = per / 2 + 0.35667 * info.tau, a70 = per / 2 + 1.20397 * info.tau;
      if (a30 < t1 && a70 > t0) {
        const X = t => g.X(clamp(t, t0, t1)), yb = Y(0.7 * vcc) - 26, col = ok ? c.ok : c.bad;
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(a30), yb); ctx.lineTo(X(a70), yb); ctx.moveTo(X(a30), yb - 4); ctx.lineTo(X(a30), yb + 4); ctx.moveTo(X(a70), yb - 4); ctx.lineTo(X(a70), yb + 4); ctx.stroke();
        ctx.setLineDash([3, 3]); ctx.lineWidth = 1; ctx.strokeStyle = c.muted; ctx.beginPath(); ctx.moveTo(X(a30 + pu.limit), yb - 8); ctx.lineTo(X(a30 + pu.limit), yb + 8); ctx.stroke(); ctx.restore();
        kit.label(ctx, 'rise ' + fmtT(pu.rise) + ' (limit ' + fmtT(pu.limit) + ')', clamp((X(a30) + X(a70)) / 2, g.plot.x + 90, g.plot.x + g.plot.w - 90), yb - 12, { size: 11, align: 'center', color: col, weight: 600 });
      }
    };
    const loop = kit.loop(draw, stg);
    st.onResize(() => loop.once());
    T.util.onTheme(() => loop.once());
    function update() { compute(); loop.once(); }
    return { update };
  }
  function i2c(body) {
    const s = ST.i2c;
    lab(body, {
      id: 'i2c', state: s, aspect: 0.5, minH: 340, focusLabel: 'Zoom to the address byte',
      intro: 'I2C uses two wires, SCL (clock) and SDA (data). Both rest high through pull-up resistors and are only ever pulled low, by whoever is talking. Pick a device address and a transfer; the analyser decodes it the way a logic analyser would.',
      note: 'A transfer starts with SDA falling while SCL is high (<b>START</b>). The next eight bits are the 7-bit address and the read/write bit, most significant first; on the ninth clock the receiver pulls SDA low (<b>ACK</b>) or leaves it high (<b>NACK</b>). SDA only changes while SCL is low — the dotted lines show where it is read, on each rising edge of SCL. Tick <i>nobody answers</i> to see a NACK on the address, or pick <i>register read</i> to see why the bus is not released between writing the register and reading it.',
      more: ['i2c', 'i2c-addresses-and-scanning', 'i2c-pull-ups-and-bus-problems', 'pull-ups-and-pull-downs'],
      pre(side, api) {
        api.tb = textBox(side, { label: 'Data bytes (hex)', value: s.data, placeholder: '00 AF', max: 40, onInput(v) { s.data = v; api.rebuild(); } });
      },
      controls: st => [
        { id: 'part', type: 'select', label: 'Device', options: I2C_PARTS.map(a => [hex(a) + ' — ' + i2cName(a), a]).concat([['Another address…', -1]]), value: st.part },
        { id: 'addr', label: 'Address (7 bits)', min: 8, max: 119, step: 1, value: st.addr, fmt: v => hex(Math.round(v)) },
        { id: 'mode', type: 'select', label: 'Transfer', options: [['Write bytes', 'write'], ['Read bytes', 'read'], ['Register read (write, repeated start, read)', 'reg']], value: st.mode },
        { id: 'reg', label: 'Register number', min: 0, max: 255, step: 1, value: st.reg, fmt: v => hex(Math.round(v)) },
        { id: 'hz', type: 'select', label: 'Clock', options: [['100 kHz (standard mode)', 100000], ['400 kHz (fast mode)', 400000]], value: st.hz },
        { id: 'nack', type: 'check', label: 'Nobody answers (NACK)', value: st.nack }
      ],
      change(id, v, st, api) {
        if (id === 'part' && v >= 0) { st.addr = v; api.ctl.set('addr', v); }
        if (id === 'addr') { st.part = E.I2C_ADDR[Math.round(v)] ? Math.round(v) : -1; api.ctl.set('part', st.part); }
      },
      readout: [['part', 'This address'], ['clock', 'The clock'], ['bytes', 'On the wire'], ['time', 'The transfer'], ['rate', 'Payload rate'], ['result', 'Result']],
      build(st, api) {
        const m = i2cModel(st);
        api.ctl.show('reg', st.mode === 'reg');
        const bad = parseHex(st.data).bad;
        api.tb.hint(bad.length ? 'Not hex: ' + bad.slice(0, 3).join(', ') : st.mode === 'write' ? 'bytes the controller sends' : 'bytes the device sends back');
        return m;
      },
      code: (st, m) => i2cCode(st, m),
      extra: el => i2cRise(el)
    });
  }

  /* ================================================================ SPI */
  const SPI_SPEEDS = [100000, 400000, 1000000, 4000000, 10000000, 20000000, 40000000, 80000000];
  const SPI_MODE_TEXT = [
    'Mode 0: the clock rests low (CPOL 0); the data is read on the rising edge and changes on the falling edge (CPHA 0)',
    'Mode 1: the clock rests low (CPOL 0); the data is read on the falling edge and changes on the rising edge (CPHA 1)',
    'Mode 2: the clock rests high (CPOL 1); the data is read on the falling edge and changes on the rising edge (CPHA 0)',
    'Mode 3: the clock rests high (CPOL 1); the data is read on the rising edge and changes on the falling edge (CPHA 1)'];
  function spiBytes(s) {
    const out = parseHex(s.out).bytes.slice(0, 8);
    if (!out.length) out.push(0x00);
    const inn = parseHex(s.inn).bytes.slice(0, 8);
    while (inn.length < out.length) inn.push(0x00);
    return { out, inn: inn.slice(0, out.length) };
  }
  function spiModel(s) {
    const { out, inn } = spiBytes(s), hz = s.hz, tb = 1 / hz;
    const X = P().spi({ mode: s.mode, hz, bytes: out, miso: inn, lsbFirst: s.lsb });
    const rising = X.sample === 'rising', samples = X.sck.slice(1).filter(e => e[1] === (rising ? 1 : 0)).map(e => e[0]);
    const mosiMarks = X.marks.map((m, k) => M(m.t0, m.t1, [hex(out[k]), hex(out[k]).slice(2), ''], HUE.data, 0.32, { k, who: 'MOSI' }));
    const misoMarks = X.marks.map((m, k) => M(m.t0, m.t1, [hex(inn[k]), hex(inn[k]).slice(2), ''], HUE.back, 0.32, { k, who: 'MISO' }));
    const csLow = X.cs[2][0] - X.cs[1][0];
    return {
      out, inn, X, samples, rising, tb,
      t0: -tb, t1: X.t1 + tb,
      traces: [
        { label: 'CS', h: HUE.cs, edges: X.cs, marks: [] },
        { label: 'SCK', h: HUE.clock, edges: X.sck, marks: [] },
        { label: 'MOSI', h: HUE.data, edges: X.mosi, marks: mosiMarks },
        { label: 'MISO', h: HUE.back, edges: X.miso, marks: misoMarks }
      ],
      focus: { t0: X.marks[0].t0 - tb / 4, span: 8.5 * tb },
      hover(t) {
        const k = X.marks.findIndex(m => t >= m.t0 - tb / 4 && t < m.t1 + tb / 4);
        if (k < 0) return t < X.cs[1][0] || t > X.cs[2][0] ? 'CS is high: the device ignores the bus' : 'CS is low, between bytes';
        const bit = clamp(Math.floor((t - X.marks[k].t0) / tb), 0, 7), n = s.lsb ? bit : 7 - bit;
        return 'byte ' + (k + 1) + ': MOSI ' + hex(out[k]) + ', MISO ' + hex(inn[k]) + ' · bit ' + n + ' goes out and comes in now';
      },
      overlay(ctx, g, w, info) {
        if (tb * info.pxPerS < 7) return;
        const c = info.c, kit = K(), px = tb * info.pxPerS >= 14;
        ctx.save(); ctx.strokeStyle = c.faint; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.beginPath();
        for (const ts of samples) { if (ts < w.w0 || ts > w.w1) continue; const x = Math.round(g.X(ts)) + 0.5; ctx.moveTo(x, g.rowY(1) - 10); ctx.lineTo(x, lvlY(g, 3, 0) + 2); }
        ctx.stroke(); ctx.restore();
        for (const ts of samples) {
          if (ts < w.w0 || ts > w.w1) continue;
          const x = g.X(ts), top = g.rowY(1) - 4;
          kit.arrow(ctx, x, top - 14, x, top, c.warn, 2, 7);
          kit.dot(ctx, x, lvlY(g, 2, P().levelAt(X.mosi, ts + 1e-12)), 3.4, c.warn, c.bg2);
          kit.dot(ctx, x, lvlY(g, 3, P().levelAt(X.miso, ts + 1e-12)), 3.4, c.warn, c.bg2);
        }
        if (px) { const t = samples.find(ts => ts >= w.w0 && ts <= w.w1); if (t != null) kit.label(ctx, 'read here', g.X(t) + 6, g.rowY(1) - 22, { size: 10, color: c.warn }); }
      },
      ro: {
        v: {
          mode: SPI_MODE_TEXT[s.mode],
          clock: fmtHz(hz) + ' · ' + fmtT(tb) + ' per bit · ' + fmtT(8 * tb) + ' per byte',
          rate: fmt(hz / 8, 4) + ' bytes per second at best (' + (s.lsb ? 'least' : 'most') + ' significant bit first)',
          xfer: plural(out.length, 'byte') + ' in both directions in ' + fmtT(csLow) + ' with CS low',
          limit: hz > 40e6 ? 'above 40 MHz only the default pins of the SPI peripheral can keep up (80 MHz at most)' : 'within what the ESP32 can drive; wiring and the device usually set the limit first',
          got: 'the controller read ' + hexList(inn) + ' from MISO'
        }
      }
    };
  }
  function spiCode(s, m) {
    const hz = s.hz, mode = 'SPI_MODE' + s.mode, order = s.lsb ? 'LSBFIRST' : 'MSBFIRST', cpol = s.mode >> 1, cpha = s.mode & 1;
    const arr = m.out.map(b => hex(b)).join(', ');
    const cpp = '#include <SPI.h>\n\nconst int PIN_SCK = 18, PIN_MISO = 19, PIN_MOSI = 23, PIN_CS = 5;\nconst uint8_t OUT[] = { ' + arr + ' };\nuint8_t in[sizeof(OUT)];\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(PIN_CS, OUTPUT);\n  digitalWrite(PIN_CS, HIGH);                         // CS rests high\n  SPI.begin(PIN_SCK, PIN_MISO, PIN_MOSI, PIN_CS);\n}\n\nvoid loop() {\n' +
      '  SPI.beginTransaction(SPISettings(' + hz + ', ' + order + ', ' + mode + '));   // clock, bit order, mode\n  digitalWrite(PIN_CS, LOW);\n  SPI.transferBytes(OUT, in, sizeof(OUT));            // sends OUT while reading into in\n  digitalWrite(PIN_CS, HIGH);\n  SPI.endTransaction();\n  for (size_t i = 0; i < sizeof(in); i++) Serial.printf("%02X ", in[i]);\n  Serial.println();\n  delay(1000);\n}\n';
    const py = 'from machine import Pin, SPI\nimport time\n\ncs = Pin(5, Pin.OUT, value=1)                         # CS rests high\nspi = SPI(2, baudrate=' + hz + ', polarity=' + cpol + ', phase=' + cpha + ', bits=8, firstbit=SPI.' + (s.lsb ? 'LSB' : 'MSB') + ',\n          sck=Pin(18), mosi=Pin(23), miso=Pin(19))\n\nout = bytes([' + arr + '])\ninp = bytearray(len(out))\n\nwhile True:\n    cs(0)\n    spi.write_readinto(out, inp)                       # sends out while reading into inp\n    cs(1)\n    print(inp)\n    time.sleep(1)\n';
    const blocks = 'when started\n  start SPI at (' + hz + ') Hz, mode (' + s.mode + '), [' + (s.lsb ? 'LSB' : 'MSB') + ' first v] :: bus\n  set pin (5) as [output v]\nforever\n  set pin (5) to [LOW v]\n  transfer bytes [' + hexList(m.out) + '] over SPI :: bus\n  set pin (5) to [HIGH v]\n  wait (1) seconds\nend\n';
    return {
      title: 'One SPI transfer, as drawn', about: 'Chip select goes low, ' + plural(m.out.length, 'byte') + ' are shifted out while ' + plural(m.out.length, 'byte') + ' are shifted in, chip select goes high.',
      needs: 'An ESP32 DevKit and an SPI device set to mode ' + s.mode + ' (check its datasheet).',
      wiring: [['GPIO18', 'SCK'], ['GPIO23', 'MOSI (to the device\'s input)'], ['GPIO19', 'MISO (from the device\'s output)'], ['GPIO5', 'CS'], ['3V3 and GND', 'the device\'s supply']],
      blocks, cpp, py,
      output: 'MISO bytes read: ' + hexList(m.inn),
      notes: ['The transfer is full duplex: every byte sent also reads one back. To only read, send zeros.', 'SPISettings(clock, bit order, mode): the mode number is CPOL × 2 + CPHA.']
    };
  }
  function spi(body) {
    const s = ST.spi;
    lab(body, {
      id: 'spi', state: s, aspect: 0.62, focusLabel: 'Zoom to one byte',
      intro: 'SPI has a clock wire from the controller, one data wire each way (MOSI out, MISO in) and a chip-select wire for each device. A byte goes out and a byte comes back at the same time, one bit per clock cycle.',
      note: '<b>CS</b> goes low to wake one device. On every clock cycle one bit leaves on MOSI and one arrives on MISO. Where the clock rests, and which of its edges reads the data, is the <b>mode</b>: the amber arrows mark the sampling edge and the dots show the bit read there. Switch between modes 0 and 3, or 1 and 2: the data lines move by half a clock cycle against the clock. A device set to the wrong mode reads every bit half a cycle early or late and returns nonsense.',
      more: ['spi', 'spi-modes-and-speed', 'uart-i2c-spi', 'choosing-a-bus'],
      pre(side, api) {
        api.tbOut = textBox(side, { label: 'Bytes out on MOSI (hex)', value: s.out, placeholder: '9F 00 00 00', max: 40, onInput(v) { s.out = v; api.rebuild(); } });
        api.tbIn = textBox(side, { label: 'Bytes the device answers on MISO (hex)', value: s.inn, placeholder: '00 EF 40 18', max: 40, onInput(v) { s.inn = v; api.rebuild(); } });
      },
      controls: st => [
        { id: 'mode', type: 'select', label: 'SPI mode', options: [['Mode 0 — rests low, read on rising', 0], ['Mode 1 — rests low, read on falling', 1], ['Mode 2 — rests high, read on falling', 2], ['Mode 3 — rests high, read on rising', 3]], value: st.mode },
        { id: 'hz', type: 'select', label: 'Clock speed', options: SPI_SPEEDS.map(h => [fmtHz(h), h]), value: st.hz },
        { id: 'lsb', type: 'check', label: 'Least significant bit first', value: st.lsb }
      ],
      readout: [['mode', 'The mode'], ['clock', 'The clock'], ['rate', 'Speed'], ['xfer', 'The transfer'], ['limit', 'On the ESP32'], ['got', 'What came back']],
      build(st, api) {
        const m = spiModel(st);
        const a = parseHex(st.out).bad, b = parseHex(st.inn).bad;
        api.tbOut.hint(a.length ? 'Not hex: ' + a.slice(0, 3).join(', ') : plural(m.out.length, 'byte') + ' (at most 8)');
        api.tbIn.hint(b.length ? 'Not hex: ' + b.slice(0, 3).join(', ') : 'missing bytes are read as 00');
        return m;
      },
      code: (st, m) => spiCode(st, m)
    });
  }

  /* ================================================================ PWM */
  const SERVO_RANGES = { nom: [1000, 2000, '1000–2000 µs (the nominal range)'], ard: [544, 2400, '544–2400 µs (Arduino Servo library)'], wide: [500, 2500, '500–2500 µs (wide, many hobby servos)'] };
  const PWM_PERIODS = 64, PWM_VCC = 3.3;
  const capText = c => (c < 1e-9 ? fmt(c * 1e12) + ' pF' : c < 1e-6 ? fmt(c * 1e9) + ' nF' : fmt(c * 1e6) + ' µF');
  function pwmModel(s) {
    const servo = s.kind === 'servo', vcc = PWM_VCC, clockHz = s.clock * 1e6, cap = s.clock === 80 ? 20 : 14;
    const rng = SERVO_RANGES[s.range] || SERVO_RANGES.nom, freq = servo ? 50 : s.freq;
    const maxBits = E.ledcMaxBits(freq, clockHz, cap), wantBits = servo ? Math.min(16, cap) : s.bits;
    const over = wantBits > maxBits, bits = Math.max(1, Math.min(wantBits, maxBits)), full = Math.pow(2, bits) - 1;
    const T0 = 1 / freq;
    let raw, frac, sv = null;
    if (servo) { sv = E.servo(s.angle, { minUs: rng[0], maxUs: rng[1], freq: 50, bits }); frac = sv.us * 1e-6 * freq; raw = Math.round(sv.us * full / 20000); }
    else { raw = Math.round(clamp(s.duty / 100, 0, 1) * full); frac = raw / full; }
    const tOn = frac * T0, total = PWM_PERIODS * T0, avg = vcc * frac, step = T0 / full;
    const edges = S().pwmEdges(freq, frac, 0, total, 0);
    const pct = fmt(frac * 100, 3) + ' %';
    const marks = [];
    for (let k = 0; k < PWM_PERIODS; k++) marks.push(M(k * T0, (k + 1) * T0, ['period ' + fmtT(T0) + ' · high ' + pct, 'T ' + fmtT(T0) + ' · ' + pct, fmtT(T0), ''], HUE.data, k % 2 ? 0.12 : 0.24));
    const traces = [{ label: 'GPIO', h: HUE.data, edges, marks: [] }, { label: 'period', h: HUE.data, pts: [], marks }];
    let rc = null;
    if (s.filter) {
      const tau = s.tau * T0, pts = [[0, 0]];
      let v = 0, t = 0;
      const seg = (dur, tg) => { for (let i = 1; i <= 8; i++) { const dt = dur * i / 8; pts.push([t + dt, tg + (v - tg) * Math.exp(-dt / tau)]); } v = tg + (v - tg) * Math.exp(-dur / tau); t += dur; };
      for (let k = 0; k < PWM_PERIODS; k++) { if (tOn > 0) seg(tOn, vcc); if (T0 - tOn > 1e-15 * T0) seg(T0 - tOn, 0); }
      const a = tOn / tau, b = (T0 - tOn) / tau;
      rc = { tau, pts, ripple: vcc * (1 - Math.exp(-a)) * (1 - Math.exp(-b)) / (1 - Math.exp(-(a + b))), final: v };
      traces.push({ label: 'RC out', h: HUE.analog, pts, min: 0, max: vcc * 1.08, marks: [] });
    }
    const status = over ? (maxBits < 1 ? '✗ the timer clock is not even fast enough for one bit at ' + fmtHz(freq) : '✗ ' + wantBits + ' bits do not fit at ' + fmtHz(freq) + ': Arduino’s ledcAttach() returns false and the pin stays silent; MicroPython quietly falls back to ' + maxBits + ' bits')
      : '✓ ' + bits + ' bits fit (the timer could do up to ' + maxBits + ' here)';
    const hide = [].concat(servo ? [] : ['servo'], rc ? [] : ['filter']);
    const ro = { period: fmtT(T0) + ' (' + fmtHz(freq) + ')', high: fmtT(tOn) + ' high, ' + fmtT(T0 - tOn) + ' low · duty ' + pct, avg: fmt(avg, 3) + ' V on a ' + vcc + ' V pin', step: fmtT(step) + ' = ' + fmt(100 / full, 3) + ' % of the period, ' + fmt(vcc / full * 1000, 3) + ' mV of average', value: 'duty value ' + raw + ' of ' + full + ' (' + bits + ' bits)', max: maxBits + ' bits: ' + fmt(clockHz / freq, 6) + ' timer ticks fit in one period of ' + fmtHz(freq), status };
    if (servo) ro.servo = fmt(sv.us, 4) + ' µs pulse for ' + s.angle + '°; one step moves the arm ' + fmt(sv.stepDeg, 3) + '°';
    if (rc) ro.filter = 'time constant ' + fmtT(rc.tau) + ' (e.g. 10 kΩ and ' + capText(rc.tau / 1e4) + ') · cut-off ' + fmtHz(1 / (2 * Math.PI * rc.tau)) + ' · ripple ' + fmt(rc.ripple * 1000, 3) + ' mV · settles in about ' + fmtT(4.6 * rc.tau);
    return {
      servo, freq, bits, maxBits, over, raw, full, frac, avg, step, T0, tOn, sv, rc, wantBits, clockHz, cap, rng,
      t0: 0, t1: total, traces,
      focus: { t0: 0, span: T0 },
      top: servo ? { h: () => 96, draw(ctx, x, y, w, h, info) {
        const c = info.c;
        S().servo(ctx, x + 62, y + h * 0.5, s.angle, { size: 72 });
        S().text(ctx, s.angle + '°', x + 140, y + h * 0.5 - 14, { size: 22, color: c.text, weight: 650, align: 'left' });
        S().text(ctx, 'pulse ' + fmt(sv.us, 4) + ' µs in a 20 ms frame (' + fmt(frac * 100, 3) + ' %)', x + 140, y + h * 0.5 + 12, { size: 12, color: c.text2, align: 'left' });
        S().text(ctx, rng[2], x + 140, y + h * 0.5 + 30, { size: 11, color: c.muted, align: 'left' });
      } } : null,
      hover(t) {
        const ph = ((t % T0) + T0) % T0;
        return (ph < tOn ? 'HIGH' : 'LOW') + ', ' + fmtT(ph) + ' into period ' + (Math.floor(t / T0) + 1) + (rc ? ' · filtered output ≈ ' + fmt(interp(rc.pts, t), 3) + ' V' : '');
      },
      overlay(ctx, g, w, info) {
        const c = info.c, kit = K();
        ctx.save(); ctx.strokeStyle = kit.hue(HUE.analog); ctx.lineWidth = 1.6; ctx.setLineDash([6, 4]);
        const ya = lvlY(g, 0, frac);
        ctx.beginPath(); ctx.moveTo(g.plot.x, ya); ctx.lineTo(g.plot.x + g.plot.w, ya);
        if (rc) { const yb = g.rowY(2) + g.rowH * 0.5 * (1 - avg / (vcc * 1.08)); ctx.moveTo(g.plot.x, yb); ctx.lineTo(g.plot.x + g.plot.w, yb); }
        ctx.stroke(); ctx.restore();
        kit.label(ctx, 'average ' + fmt(avg, 3) + ' V', g.plot.x + g.plot.w - 6, ya + (frac > 0.5 ? 12 : -10), { size: 10.5, align: 'right', color: kit.hue(HUE.analog), weight: 600 });
        if (step * info.pxPerS >= 4) {
          ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.beginPath();
          const base = lvlY(g, 0, 0) + 3;
          for (let k = Math.ceil(w.w0 / step), n = 0; k * step <= w.w1 && n < 600; k++, n++) { const x = Math.round(g.X(k * step)) + 0.5; ctx.moveTo(x, base); ctx.lineTo(x, base + (k % 8 === 0 ? 8 : 5)); }
          ctx.stroke(); ctx.restore();
          kit.label(ctx, 'ticks: one timer step each, ' + fmtT(step), g.plot.x + 6, lvlY(g, 0, 0) + 18, { size: 10, color: c.muted });
        }
      },
      ro: { v: ro, hide }
    };
  }
  const interp = (pts, t) => {
    if (!pts.length) return 0;
    if (t <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) if (pts[i][0] >= t) { const a = pts[i - 1], b = pts[i], f = b[0] > a[0] ? (t - a[0]) / (b[0] - a[0]) : 1; return a[1] + (b[1] - a[1]) * f; }
    return pts[pts.length - 1][1];
  };
  function pwmCode(s, m) {
    const pct = fmt(m.frac * 100, 3);
    let cpp, py, blocks, about, title, needs, wiring, output, notes;
    if (m.servo) {
      const us = Math.round(m.sv.us), bits = m.wantBits;
      title = 'Point a servo at ' + s.angle + '°'; about = 'A 50 Hz signal whose pulse is ' + us + ' µs wide: the pulse width is the angle.';
      cpp = 'const int SERVO_PIN = 18;\nconst int FREQ = 50, BITS = ' + bits + ';                    // 20 ms period, 2^' + bits + ' steps\n\nuint32_t usToDuty(uint32_t us) { return (uint64_t)us * ((1u << BITS) - 1) / 20000u; }\n\nvoid setup() {\n  ledcAttach(SERVO_PIN, FREQ, BITS);\n  ledcWrite(SERVO_PIN, usToDuty(' + us + '));          // ' + s.angle + ' degrees\n}\n\nvoid loop() {}\n';
      py = 'from machine import Pin, PWM\n\nservo = PWM(Pin(18), freq=50)           # 50 Hz = 20 ms period\nservo.duty_ns(' + us + ' * 1000)          # pulse width in nanoseconds: ' + s.angle + ' degrees\n';
      blocks = 'when started\n  set servo on pin (18) to (' + s.angle + ') degrees\n';
      needs = 'An ESP32 DevKit and a hobby servo with its own 5 V supply.'; wiring = [['GPIO18', 'servo signal (orange or white)'], ['5 V supply', 'servo red'], ['GND', 'servo brown or black, joined to the ESP32 GND']];
      output = 'The servo turns to ' + s.angle + '° and holds it.';
      notes = ['The servo is powered from its own supply, never from a GPIO; the signal is 3.3 V logic.', 'The chips with a 14-bit LEDC timer cannot do 16 bits: use BITS = 14 there. The pulse range of your servo may differ: check its datasheet.'];
    } else {
      title = 'Output this PWM signal'; about = 'A ' + fmtHz(s.freq) + ' signal with ' + m.bits + '-bit resolution and a duty value of ' + m.raw + ' of ' + m.full + '.';
      cpp = 'const int PWM_PIN  = 4;\nconst int PWM_FREQ = ' + Math.round(s.freq) + ';      // Hz\nconst int PWM_BITS = ' + s.bits + ';         // duty values 0 … ' + (Math.pow(2, s.bits) - 1) + '\n\nvoid setup() {\n  Serial.begin(115200);\n  if (!ledcAttach(PWM_PIN, PWM_FREQ, PWM_BITS)) Serial.println("ledcAttach failed: this frequency and resolution do not fit");\n  ledcWrite(PWM_PIN, ' + Math.round(clamp(s.duty / 100, 0, 1) * (Math.pow(2, s.bits) - 1)) + ');         // ' + fmt(s.duty, 3) + ' %\n}\n\nvoid loop() {}\n';
      py = 'from machine import Pin, PWM\n\npwm = PWM(Pin(4), freq=' + Math.round(s.freq) + ', duty_u16=' + Math.round(clamp(s.duty / 100, 0, 1) * 65535) + ')   # duty_u16 runs 0 … 65535: ' + fmt(s.duty, 3) + ' %\n';
      blocks = 'when started\n  set PWM on pin (4) frequency (' + Math.round(s.freq) + ') resolution (' + s.bits + ')\n  set PWM on pin (4) to (' + Math.round(clamp(s.duty / 100, 0, 1) * (Math.pow(2, s.bits) - 1)) + ')\n';
      needs = 'An ESP32 DevKit' + (s.filter ? ', a resistor (about 10 kΩ) and a capacitor (about ' + capText(m.rc.tau / 1e4) + ') for the filter.' : ' and an LED with a resistor, a MOSFET or a motor driver on GPIO4.');
      wiring = s.filter ? [['GPIO4', '10 kΩ → filter output'], ['filter output', 'capacitor → GND']] : [['GPIO4', '220 Ω → LED → GND']];
      output = 'The pin averages ' + fmt(m.avg, 3) + ' V.';
      notes = ['ledcAttach() takes the pin, the frequency and the resolution; ledcWrite() takes the pin and the duty value. It returns false when the frequency and resolution do not fit one timer.', 'MicroPython has no resolution argument: duty_u16() always runs 0 … 65535 and the port picks the real step size.'];
    }
    return { title, about, needs, wiring, blocks, cpp, py, output, notes };
  }
  function pwm(body) {
    const s = ST.pwm;
    lab(body, {
      id: 'pwm', state: s, aspect: 0.6, focusLabel: 'Zoom to one period', view: { zoom: 16 },
      intro: 'PWM switches a pin between 3.3 V and 0 V so fast that a lamp, a motor or a filter only sees the average. The share of each period spent high is the duty cycle. The ESP32’s timer counts a fixed clock, so how fine the duty can be depends on how fast the period is.',
      note: 'The dashed line is the <b>average voltage</b>: duty × 3.3 V. Zoom in and the ticks under the waveform are the timer’s steps — the pulse can only change by a whole step, and each extra bit halves the step. Raise the frequency and the best resolution falls (graph below; the highest frequency that still gives a resolution is the clock divided by 2<sup>bits</sup>). Switch to <i>servo</i>: a 1–2 ms pulse in a 20 ms frame; its width is the angle. Add the <i>RC filter</i> and the pulses turn into a steady voltage, a cheap analogue output — a longer time constant means less ripple but a slower response.',
      more: ['pwm-with-ledc', 'servos', 'driving-leds-with-pwm', 'rc-filters-and-debounce', 'motor-pwm-frequency'],
      controls: st => [
        { id: 'kind', type: 'select', label: 'What to show', options: [['General PWM (LEDs, motors)', 'duty'], ['Hobby servo (50 Hz)', 'servo']], value: st.kind },
        { id: 'clock', type: 'select', label: 'Timer clock', options: [['80 MHz: the original ESP32 (up to 20 bits)', 80], ['40 MHz: ESP32-S3, C3, C6 … (up to 14 bits)', 40]], value: st.clock },
        { id: 'freq', label: 'Frequency', min: 1, max: 40e6, log: true, sig: 3, value: st.freq, fmt: v => fmtHz(v) },
        { id: 'bits', label: 'Resolution', min: 1, max: 16, step: 1, value: st.bits, unit: 'bits' },
        { id: 'duty', label: 'Duty cycle', min: 0, max: 100, step: 0.1, value: st.duty, unit: '%' },
        { id: 'angle', label: 'Servo angle', min: 0, max: 180, step: 1, value: st.angle, unit: '°' },
        { id: 'range', type: 'select', label: 'Pulse range of the servo', options: Object.keys(SERVO_RANGES).map(k => [SERVO_RANGES[k][2], k]), value: st.range },
        { id: 'filter', type: 'check', label: 'Add an RC low-pass filter', value: st.filter },
        { id: 'tau', label: 'Filter time constant', min: 0.2, max: 40, log: true, sig: 2, value: st.tau, fmt: v => fmt(v, 2) + ' periods' }
      ],
      change(id, v, st, api) { if (id === 'filter') api.setView(v ? 1 : 16, 0); },
      readout: [['period', 'The period'], ['high', 'High and low'], ['avg', 'The average'], ['step', 'The smallest step'], ['value', 'The duty value'], ['max', 'The timer can give'], ['status', 'This setting'], ['servo', 'The servo'], ['filter', 'The filter']],
      build(st, api) {
        const m = pwmModel(st), c = api.ctl;
        c.show('freq', !m.servo); c.show('bits', !m.servo); c.show('duty', !m.servo); c.show('angle', m.servo); c.show('range', m.servo); c.show('tau', st.filter);
        return m;
      },
      code: (st, m) => pwmCode(st, m),
      extra(el) {
        const kit = K();
        el.innerHTML = '<div class="boxy"><h3>How fine can the duty be at each frequency?</h3><p class="small muted" style="margin:0 0 8px">The timer divides its clock by at least 1, so one period can hold at most clock ÷ frequency steps: the highest resolution is the whole number of bits that fits. Your setting is the marked point; above the line it does not fit.</p><div class="sig-plot"></div></div>';
        const plot = kit.plot(ui.$('.sig-plot', el), { x: { label: 'PWM frequency (Hz)', log: true, min: 1, max: 4e7 }, y: { label: 'highest resolution (bits)', min: 0, max: 21 }, series: [], marks: [] }, 220);
        return {
          update(st, m) {
            const pts = [];
            for (let i = 0; i < 64; i++) { const f = Math.pow(10, Math.log10(4e7) * i / 63); pts.push([f, E.ledcMaxBits(f, m.clockHz, m.cap)]); }
            plot.set({ series: [{ pts, label: 'the timer’s limit' }], marks: [{ x: m.freq, y: m.wantBits, label: m.wantBits + ' bits' }] });
          }
        };
      }
    });
  }

  /* ================================================================ WS2812 pixels */
  const WS_TB = 1.25e-6, WS_T0H = 0.4e-6, WS_T1H = 0.8e-6;
  const hsv = (h, s, v) => { const f = n => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5), f(3), f(1)].map(x => Math.round(x * 255)); };
  function pixelsModel(s) {
    const n = clamp(Math.round(s.n), 1, 8), cols = s.colors.slice(0, n).map(c => c.map(v => clamp(Math.round(v), 0, 255)));
    const W = P().ws2812(cols), TB = WS_TB, LED_T = 24 * TB;
    const bitMarks = [], byteMarks = [], ledMarks = [];
    let t = 0;
    cols.forEach((c, i) => {
      const a = t;
      for (const [nm, v, hu] of [['G', c[1], 140], ['R', c[0], 4], ['B', c[2], 225]]) {
        const b0 = t;
        for (let k = 7; k >= 0; k--) { const bit = (v >> k) & 1; bitMarks.push(M(t, t + TB, [String(bit)], HUE.data, bit ? 0.5 : 0.16, { bit })); t += TB; }
        byteMarks.push(M(b0, t, [nm + ' = ' + v + ' (' + hex(v) + ')', nm + ' ' + hex(v), nm + ' ' + v, nm, ''], hu, 0.4));
      }
      ledMarks.push(M(a, t, ['LED ' + (i + 1) + ': green ' + c[1] + ', red ' + c[0] + ', blue ' + c[2], 'LED ' + (i + 1), String(i + 1), ''], HUE.clock, i % 2 ? 0.22 : 0.34));
    });
    const tData = t;
    ledMarks.push(M(t, W.t1, ['reset: low for at least 50 µs, the LEDs now show their colours', 'reset ≥ 50 µs', 'reset', ''], HUE.bad, 0.28));
    const mA = cols.reduce((a, c) => a + E.pixelCurrent(1, (c[0] + c[1] + c[2]) / 765, 60), 0);
    const ledAt = tt => (tt >= 0 && tt < tData ? Math.floor(tt / LED_T) : -1);
    return {
      n, cols, W, tData, mA,
      t0: -2e-6, t1: W.t1 + 2e-6,
      traces: [
        { label: 'DIN', h: HUE.data, edges: W.edges, marks: bitMarks },
        { label: 'bytes', h: HUE.data, pts: [], marks: byteMarks },
        { label: 'LED', h: HUE.data, pts: [], marks: ledMarks }
      ],
      focus: { t0: 0, span: LED_T },
      hover(tt) {
        const i = ledAt(tt);
        if (i < 0) return tt >= tData ? 'the reset gap: the line rests low' : 'idle';
        const inLed = tt - i * LED_T, byte = Math.floor(inLed / (8 * TB)), bitN = Math.floor((inLed - byte * 8 * TB) / TB), v = [cols[i][1], cols[i][0], cols[i][2]][byte], bit = (v >> (7 - bitN)) & 1;
        return 'LED ' + (i + 1) + ', ' + ['green', 'red', 'blue'][byte] + ' byte ' + hex(v) + ', bit ' + (7 - bitN) + ' = ' + bit + ': high for ' + (bit ? '0.8' : '0.4') + ' µs, low for ' + (bit ? '0.45' : '0.85') + ' µs';
      },
      top: {
        h: () => 168,
        draw(ctx, x, y, w, h, info) {
          const c = info.c, Sx = S(), kit = K(), r = 13, step = clamp((w - 64) / n, 2 * r + 10, 84), x0 = x + 56 + (w - 56 - n * step) / 2, cy = y + h - 30;
          const act = ledAt(info.curT == null ? -1 : info.curT);
          Sx.text(ctx, 'Each LED keeps the first 24 bits and passes the rest on, reshaped', x + w / 2, y + 8, { size: 11.5, color: c.text2 });
          Sx.pixels(ctx, x0, cy - r, cols, { r, gap: step - 2 * r });
          kit.arrow(ctx, x + 6, cy, x0 + r - 14, cy, kit.hue(HUE.data), 2, 8);
          Sx.text(ctx, 'DIN', x + 18, cy - 12, { size: 11, color: kit.hue(HUE.data), weight: 650 });
          for (let k = 0; k < n; k++) {
            const cx = x0 + r + k * step;
            if (k < n - 1) kit.arrow(ctx, cx + r + 3, cy, cx + step - r - 3, cy, kit.hue(HUE.data), 1.6, 6);
            Sx.text(ctx, 'LED ' + (k + 1), cx, cy + r + 11, { size: 10.5, color: act === k ? c.warn : c.muted, weight: act === k ? 700 : 500 });
            const left = n - k, bw = Math.min(step - 14, 46);
            for (let j = 0; j < left; j++) {
              const by = cy - r - 12 - j * 9;
              ctx.save();
              ctx.beginPath(); ctx.rect(cx - bw / 2, by, bw, 7);
              if (j === 0) { ctx.fillStyle = 'rgb(' + cols[k].join(',') + ')'; ctx.fill(); ctx.lineWidth = act === k ? 2.4 : 1.2; ctx.strokeStyle = act === k ? c.warn : c.text2; ctx.stroke(); }
              else { ctx.fillStyle = c.border2 || c.faint; ctx.globalAlpha = 0.55; ctx.fill(); }
              ctx.restore();
            }
            Sx.text(ctx, left * 24 + ' bits', cx, cy - r - 16 - left * 9, { size: 10, color: c.muted });
          }
          const lx = x + w - 6;
          ctx.save();
          ctx.fillStyle = c.text2; ctx.fillRect(lx - 168, y + 25, 9, 7); ctx.globalAlpha = 0.55; ctx.fillStyle = c.border2 || c.faint; ctx.fillRect(lx - 168, y + 39, 9, 7);
          ctx.restore();
          Sx.text(ctx, 'bits this LED keeps', lx - 154, y + 29, { size: 10.5, color: c.muted, align: 'left' });
          Sx.text(ctx, 'bits it passes on', lx - 154, y + 43, { size: 10.5, color: c.muted, align: 'left' });
        }
      },
      overlay(ctx, g, w, info) {
        const c = info.c, kit = K(), ppb = TB * info.pxPerS;
        if (ppb < 70) return;
        const first = Math.max(0, Math.floor((w.w0 - 0) / TB)), last = Math.min(n * 24 - 1, Math.ceil((w.w1) / TB));
        let count = 0;
        for (let b = first; b <= last && count < 14; b++, count++) {
          const led = Math.floor(b / 24), inLed = b % 24, byte = Math.floor(inLed / 8), v = [cols[led][1], cols[led][0], cols[led][2]][byte], bit = (v >> (7 - inLed % 8)) & 1;
          const tc = b * TB + TB / 2, y = lvlY(g, 0, 0) + 11;
          kit.label(ctx, ppb >= 150 ? (bit ? 'high 0.8 µs · low 0.45 µs' : 'high 0.4 µs · low 0.85 µs') : (bit ? '1: 0.8 µs high' : '0: 0.4 µs high'), g.X(tc), y, { size: 10, align: 'center', color: c.muted });
        }
      },
      ro: {
        v: {
          bit: '1.25 µs per bit (800 kHz): a 0 is high for 0.4 µs, a 1 for 0.8 µs, each within about 150 ns',
          led: '24 bits = 30 µs per LED, in the order green, red, blue',
          frame: plural(n, 'LED') + ': ' + fmtT(tData) + ' of data, then at least 50 µs of low to latch (some newer LEDs want up to 280 µs)',
          fps: 'at most ' + fmt(1 / (tData + 50e-6), 4) + ' updates per second for this strip',
          current: 'about ' + fmt(mA, 3) + ' mA from these colours (20 mA per colour at full brightness)'
        }
      }
    };
  }
  function pixelsCode(s, m) {
    const cols = m.cols, n = m.n;
    const cpp = '#include <Adafruit_NeoPixel.h>\n\n#define LED_PIN   5\n#define LED_COUNT ' + n + '\n\nAdafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);\n\nvoid setup() {\n  strip.begin();\n}\n\nvoid loop() {\n' +
      cols.map((c, i) => '  strip.setPixelColor(' + i + ', strip.Color(' + c.join(', ') + '));').join('\n') + '\n  strip.show();                 // sends 24 bits per LED, then the reset gap\n  delay(1000);\n}\n';
    const py = 'from machine import Pin\nfrom neopixel import NeoPixel\n\nnp = NeoPixel(Pin(5), ' + n + ')\n' + cols.map((c, i) => 'np[' + i + '] = (' + c.join(', ') + ')' + (i === 0 ? '        # (R, G, B)' : '')).join('\n') + '\nnp.write()                 # nothing is sent until write()\n';
    const blocks = 'when started\n' + cols.map((c, i) => '  set pixel (' + i + ') to colour (' + c.join(') (') + ')').join('\n') + '\n  show pixels\n';
    return {
      title: 'Show these ' + plural(n, 'colour') + ' on a WS2812 strip', about: 'The calls that put exactly this bit stream on the data wire: 24 bits per LED, then the reset gap.',
      needs: 'An ESP32 DevKit and ' + plural(n, 'WS2812 (NeoPixel) LED') + ' on a 5 V supply.',
      wiring: [['GPIO5', '330 Ω → DIN of the first LED', 'a 3.3 V signal; 5 V strips are happier with a level shifter'], ['5 V and GND', 'the strip\'s supply, with a 470–1000 µF capacitor across it'], ['GND', 'the ESP32 GND, joined to the strip\'s']],
      libs: ['Adafruit NeoPixel'], blocks, cpp, py,
      output: 'The LEDs light in this order: ' + cols.map((c, i) => (i + 1) + ' = (' + c.join(', ') + ')').join(', ') + '.',
      notes: ['The library takes red, green, blue and sends green, red, blue for you (NEO_GRB). Some strips want another order.', 'The pulses are far too fast for digitalWrite(): the library uses the ESP32\'s RMT peripheral or carefully timed code to make them.']
    };
  }
  function pixels(body) {
    const s = ST.pixels;
    lab(body, {
      id: 'pixels', state: s, aspect: 0.8, minH: 460, focusLabel: 'Zoom to the first LED',
      intro: 'A WS2812 (“NeoPixel”) LED has one data input and one data output. The ESP32 sends every LED’s colour down a single wire as one long stream of very short pulses; each LED takes its share and passes on the rest. Choose up to eight colours.',
      note: 'Each bit is a pulse of fixed length (1.25 µs) whose <b>high time</b> is the value: short for 0, long for 1 — zoom in with the wheel until you can see them, and the labels under the trace show their widths. The bytes go out as <b>green, red, blue</b>, most significant bit first. The first LED keeps the first 24 bits and reshapes and sends everything else on, so the order of the colours is the order of the LEDs. A pause of more than about 50 µs with the line low is the <b>reset</b>: every LED shows what it holds. The pulses must be right within about 150 ns, which a <code>digitalWrite()</code> loop cannot promise (one call takes a good part of the shortest pulse, and any interrupt in the middle ruins a bit), so the ESP32 plays the pulses from its <b>RMT</b> peripheral, which sends a list of pulse widths without the CPU.',
      more: ['addressable-leds', 'the-rmt-peripheral', 'powering-led-strips', 'pixels-and-framebuffers'],
      controls: st => [
        { id: 'n', label: 'Number of LEDs', min: 1, max: 8, step: 1, value: st.n },
        { id: 'sel', type: 'select', label: 'Colour of', options: [0, 1, 2, 3, 4, 5, 6, 7].map(i => ['LED ' + (i + 1), i]), value: st.sel },
        { id: 'r', label: 'Red', min: 0, max: 255, step: 1, value: st.colors[st.sel][0] },
        { id: 'g', label: 'Green', min: 0, max: 255, step: 1, value: st.colors[st.sel][1] },
        { id: 'b', label: 'Blue', min: 0, max: 255, step: 1, value: st.colors[st.sel][2] },
        { type: 'buttons', items: [{ id: 'rainbow', label: 'Rainbow' }, { id: 'traffic', label: 'Traffic light' }, { id: 'white', label: 'All white' }, { id: 'random', label: 'Random' }] }
      ],
      change(id, v, st, api) {
        if (id === 'sel' && st.sel >= st.n) { st.n = st.sel + 1; api.ctl.set('n', st.n); }
        if (id === 'n' && st.sel >= st.n) { st.sel = st.n - 1; api.ctl.set('sel', st.sel); }
        if (id === 'r' || id === 'g' || id === 'b') st.colors[st.sel][{ r: 0, g: 1, b: 2 }[id]] = Math.round(v);
        if (id === 'sel' || id === 'n') fillSliders(st, api);
      },
      btn: {
        rainbow(st, api) { for (let i = 0; i < 8; i++) st.colors[i] = hsv(i / st.n * 360, 1, 1); fillSliders(st, api); },
        traffic(st, api) { const t = [[255, 0, 0], [255, 140, 0], [0, 255, 0]]; for (let i = 0; i < 8; i++) st.colors[i] = t[i % 3].slice(); fillSliders(st, api); },
        white(st, api) { for (let i = 0; i < 8; i++) st.colors[i] = [255, 255, 255]; fillSliders(st, api); },
        random(st, api) { for (let i = 0; i < 8; i++) st.colors[i] = hsv(Math.random() * 360, 0.6 + Math.random() * 0.4, 0.5 + Math.random() * 0.5); fillSliders(st, api); }
      },
      readout: [['bit', 'One bit'], ['led', 'One LED'], ['frame', 'The strip'], ['fps', 'Refresh'], ['current', 'Current']],
      build: st => pixelsModel(st),
      code: (st, m) => pixelsCode(st, m)
    });
    function fillSliders(st, api) { const c = st.colors[st.sel]; api.ctl.set('r', c[0]); api.ctl.set('g', c[1]); api.ctl.set('b', c[2]); }
  }

  /* ================================================================ CAN */
  const CAN_RATES = [125000, 250000, 500000, 1000000];
  const CAN_HUE = { SOF: 48, ID: 215, RTR: 280, IDE: 280, r0: 280, DLC: 280, DATA: 205, CRC: 330, 'CRC del': 150, ACK: 150, 'ACK del': 150, EOF: 48 };
  /* a standard data frame as bits (with the stuffed ones flagged) and edges; ack false leaves the ACK slot recessive (no receiver) */
  function canFrame(id, data, rate, ack) {
    const f = P().can(id, data, { bitrate: rate }), tb = 1 / rate;
    const bits = f.bits.map((b, i) => Object.assign({}, b, { t0: i * tb, t1: (i + 1) * tb }));
    if (!ack) { const a = bits.find(b => b.field === 'ACK'); if (a) a.v = 1; }
    return { bits, edges: edgesOfBits(bits.map(b => b.v), tb, 0, 1), tb, t1: bits.length * tb, crc: f.crc, stuffed: f.stuffed, n: Math.min(8, data.length), data: data.slice(0, 8) };
  }
  /* the bits grouped into fields (a data byte each), with their values, as marks of the decoded row */
  function canFields(bits, ack) {
    const groups = [];
    let cur = null, dataBits = 0;
    for (const b of bits) {
      if (b.stuffed && cur) { cur.bits.push(b); cur.t1 = b.t1; continue; }
      const key = b.field === 'DATA' ? 'DATA' + Math.floor(dataBits / 8) : b.field;
      if (!cur || cur.key !== key) { cur = { key, field: b.field, bits: [], t0: b.t0 }; groups.push(cur); }
      cur.bits.push(b); cur.t1 = b.t1;
      if (b.field === 'DATA') dataBits++;
    }
    return groups.map(g => {
      const val = g.bits.filter(b => !b.stuffed).reduce((a, b) => a * 2 + b.v, 0), st = g.bits.filter(b => b.stuffed).length;
      const f = g.field, tail = st ? ' (' + plural(st, 'stuffed bit') + ')' : '';
      let texts, info;
      if (f === 'SOF') { texts = ['start of frame', 'SOF', 'S']; info = 'start of frame: one dominant (0) bit; every node synchronises on its falling edge'; }
      else if (f === 'ID') { texts = ['ID ' + hex(val, 3), hex(val, 3), 'ID']; info = 'the 11-bit identifier ' + hex(val, 3) + ': it names the message, and the lowest number wins the bus' + tail; }
      else if (f === 'RTR') { texts = ['RTR', 'R']; info = 'remote transmission request: 0 = a data frame'; }
      else if (f === 'IDE') { texts = ['IDE', 'E']; info = 'identifier extension: 0 = the 11-bit (standard) format'; }
      else if (f === 'r0') { texts = ['r0', '']; info = 'a reserved bit, sent dominant'; }
      else if (f === 'DLC') { texts = ['DLC ' + val, String(val), 'L']; info = 'data length code: ' + plural(val, 'data byte') + tail; }
      else if (f === 'DATA') { texts = [hex(val, 2), hex(val, 2).slice(2), '']; info = 'data byte ' + hex(val, 2) + ', most significant bit first' + tail; }
      else if (f === 'CRC') { texts = ['CRC ' + hex(val, 4), hex(val, 4), 'CRC']; info = 'the 15-bit CRC ' + hex(val, 4) + ' over everything from SOF to the data: receivers recompute it' + tail; }
      else if (f === 'CRC del') { texts = ['CRC delimiter', 'del', 'd']; info = 'CRC delimiter: one recessive (1) bit'; }
      else if (f === 'ACK') { texts = [ack ? 'ACK slot' : 'no ACK', ack ? 'ACK' : '!']; info = ack ? 'ACK slot: the sender leaves it recessive and any receiver that got the frame pulls it dominant (0)' : 'ACK slot: nobody pulled it low: an ACK error, so the sender will try again'; }
      else if (f === 'ACK del') { texts = ['ACK delimiter', 'del', 'd']; info = 'ACK delimiter: recessive'; }
      else { texts = ['end of frame', 'EOF', '']; info = 'end of frame: seven recessive bits (then three more of intermission before the next frame)'; }
      return M(g.t0, g.t1, texts, f === 'ACK' && !ack ? HUE.bad : CAN_HUE[f], 0.34, { info, field: f });
    });
  }
  function canBitMarks(bits, upTo) {
    const out = [];
    bits.forEach((b, i) => { if (i < upTo) out.push(b.stuffed ? M(b.t0, b.t1, ['stuffed ' + b.v, 's' + b.v, 's'], HUE.bad, 0.5) : M(b.t0, b.t1, [String(b.v)], CAN_HUE[b.field] || HUE.data, 0.2)); });
    return out;
  }
  function canModel(s) {
    const tb = 1 / s.rate, data = parseHex(s.data).bytes.slice(0, 8), rateText = fmt(s.rate / 1000, 4) + ' kbit/s';
    if (s.kind === 'arb') {
      const A = canFrame(s.id, data, s.rate, true), B = canFrame(s.id2, [0xDE, 0xAD], s.rate, true), n = Math.min(A.bits.length, B.bits.length);
      let lose = -1;
      for (let k = 0; k < n; k++) if (A.bits[k].v !== B.bits[k].v) { lose = k; break; }
      const inId = lose >= 0 && (A.bits[lose].field === 'ID'), loser = inId ? (A.bits[lose].v === 1 ? 'A' : 'B') : null;
      const win = loser === 'A' ? B : A, lost = loser === 'A' ? A : loser === 'B' ? B : null;
      const own = (F, isLoser) => F.bits.map((b, k) => (isLoser && k > lose ? 1 : b.v));
      const vA = own(A, loser === 'A'), vB = own(B, loser === 'B');
      const bus = [];
      for (let k = 0; k < Math.max(A.bits.length, B.bits.length); k++) bus.push((k < vA.length ? vA[k] : 1) & (k < vB.length ? vB[k] : 1));
      const busEdges = edgesOfBits(bus, tb, 0, 1), eA = edgesOfBits(vA, tb, 0, 1), eB = edgesOfBits(vB, tb, 0, 1);
      const arbBits = 13, mk = (F, isLoser) => {
        const marks = canBitMarks(F.bits, isLoser ? lose : arbBits);
        if (isLoser) { marks.push(M(lose * tb, (lose + 1) * tb, ['lost', 'L'], HUE.bad, 0.6)); marks.push(M((lose + 1) * tb, F.t1, ['sees a dominant 0 where it sent 1: stops and only listens', 'stops, listens', ''], HUE.bad, 0.14)); }
        else if (F === win && loser) marks.push(M(arbBits * tb, F.t1, ['wins the bus and sends the rest of its frame as if nothing happened', 'wins, sends on', 'wins', ''], HUE.ok, 0.25));
        return marks;
      };
      const idBit = lose < 0 ? -1 : 10 - A.bits.slice(0, lose).filter(b => b.field === 'ID' && !b.stuffed).length;
      const text = loser ? 'Node ' + (loser === 'A' ? 'B' : 'A') + ' wins: identifier ' + hex(loser === 'A' ? s.id2 : s.id, 3) + ' is lower than ' + hex(loser === 'A' ? s.id : s.id2, 3) + '. They first differ at identifier bit ' + idBit + ' (bit ' + lose + ' of the frame).'
        : lose < 0 ? 'Identical frames: nothing tells the nodes apart. A real network gives every node its own identifiers.' : 'The identifiers are equal, so they differ later, in the data: a bit error, which is why identifiers must be unique.';
      return {
        kind: 'arb', A, B, lose, loser, bus,
        t0: -tb, t1: Math.max(A.t1, B.t1) + 2 * tb,
        traces: [
          { label: 'A ' + hex(s.id, 3), h: HUE.second, edges: eA, marks: mk(A, loser === 'A') },
          { label: 'B ' + hex(s.id2, 3), h: HUE.other, edges: eB, marks: mk(B, loser === 'B') },
          { label: 'bus', h: HUE.data, edges: busEdges, marks: canFields(win.bits, true) }
        ],
        focus: { t0: 0, span: 14 * tb },
        hover(t) {
          const k = Math.floor(t / tb);
          if (k < 0 || k >= bus.length) return 'the bus is idle (recessive, high)';
          const dom = vA[k] === 0 || vB[k] === 0;
          return 'bit ' + k + ': A sends ' + (k < vA.length ? vA[k] : '—') + ', B sends ' + (k < vB.length ? vB[k] : '—') + ' → the bus is ' + bus[k] + (dom ? ' (a dominant 0 wins over a recessive 1)' : ' (both recessive)');
        },
        overlay(ctx, g, w, info) {
          if (lose < 0) return;
          const c = info.c, kit = K(), x = g.X(lose * tb);
          if (lose * tb < w.w0 || lose * tb > w.w1) return;
          ctx.save(); ctx.strokeStyle = c.bad; ctx.lineWidth = 1.4; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(x, g.plot.y); ctx.lineTo(x, g.plot.y + g.plot.h); ctx.stroke(); ctx.restore();
          kit.label(ctx, 'the first bit where they differ', x + 6, g.plot.y + g.plot.h - 8, { size: 10.5, color: c.bad });
        },
        top: null,
        ro: { which: 'arb', v: { rate: rateText + ' · ' + fmtT(tb) + ' per bit', result: text, frame: 'the winner’s frame: ' + win.bits.length + ' bits on the wire = ' + fmtT(win.t1), retry: lost ? 'node ' + loser + ' simply sends its frame again once the bus is free: no data is lost and no time wasted on a collision' : 'no loser' } }
      };
    }
    const F = canFrame(s.id, data, s.rate, s.ack), nominal = F.bits.length - F.stuffed, fields = canFields(F.bits, s.ack);
    const sizes = [['SOF', 4], ['ID', 11], ['RTR', 4], ['IDE', 4], ['r0', 4], ['DLC', 4], ['DATA', Math.max(8, F.n * 8)], ['CRC', 15], ['CRC del', 4], ['ACK', 4], ['ACK del', 4], ['EOF', 7]];
    const valOf = f => (f === 'ID' ? hex(s.id, 3) : f === 'DLC' ? String(F.n) : f === 'DATA' ? (F.n ? hexList(F.data.slice(0, 4)) + (F.n > 4 ? '…' : '') : 'none') : f === 'CRC' ? hex(F.crc, 4) : null);
    const dataBits = F.n * 8;
    return {
      kind: 'one', F, fields,
      t0: -tb, t1: F.t1 + 2 * tb,
      traces: [
        { label: 'CAN bus', h: HUE.data, edges: F.edges, marks: canBitMarks(F.bits, F.bits.length) },
        { label: 'fields', h: HUE.data, pts: [], marks: fields }
      ],
      focus: { t0: 0, span: 14 * tb },
      hover(t) {
        const k = Math.floor(t / tb);
        if (k < 0 || k >= F.bits.length) return 'the bus is idle (recessive, high)';
        const f = fields.find(m => t >= m.t0 && t < m.t1), b = F.bits[k];
        return 'bit ' + k + ' = ' + b.v + (b.stuffed ? ' (stuffed)' : '') + ' · ' + (f ? f.info : '');
      },
      top: {
        h: () => 86,
        draw(ctx, x, y, w, h, info) {
          const c = info.c, Sx = S();
          Sx.text(ctx, 'The frame field by field (boxes not to scale)', x + w / 2, y + 6, { size: 11.5, color: c.text2 });
          Sx.frame(ctx, x + 4, y + 16, w - 8, sizes.map(([f, z]) => ({ label: f === 'CRC del' || f === 'ACK del' ? 'del' : f, size: z, value: valOf(f), color: f === 'ACK' && !s.ack ? HUE.bad : CAN_HUE[f] })), { h: 36 });
          Sx.text(ctx, F.stuffed + ' of the ' + F.bits.length + ' bits are stuffing: one opposite bit after every five equal ones', x + w / 2, y + 68, { size: 10.5, color: c.muted });
        }
      },
      ro: { which: 'one', v: { rate: rateText + ' · ' + fmtT(tb) + ' per bit', frame: F.bits.length + ' bits = ' + fmtT(F.t1) + ' (' + nominal + ' plus ' + plural(F.stuffed, 'stuffed bit') + ')', crc: hex(F.crc, 4) + ' · a 15-bit CRC of every bit from SOF to the data', ack: s.ack ? 'a receiver pulls the ACK slot low' : 'no receiver: the ACK slot stays high, an ACK error, and the sender retries', eff: dataBits + ' data bits of ' + F.bits.length + ' (' + Math.round(dataBits / F.bits.length * 100) + ' %) · at most ' + fmt(1 / (F.t1 + 3 * tb), 4) + ' frames per second' } }
    };
  }
  function canCode(s, m) {
    const F = m.kind === 'arb' ? m.A : m.F, data = F.data, n = data.length, id = hex(s.id, 3);
    const rate = { 125000: '125KBITS', 250000: '250KBITS', 500000: '500KBITS', 1000000: '1MBITS' }[s.rate];
    const cpp = '#include "driver/twai.h"\n\n#define TX_PIN 5\n#define RX_PIN 4\n\nvoid setup() {\n  Serial.begin(115200);\n  twai_general_config_t g = TWAI_GENERAL_CONFIG_DEFAULT((gpio_num_t)TX_PIN, (gpio_num_t)RX_PIN, TWAI_MODE_NORMAL);\n  twai_timing_config_t  t = TWAI_TIMING_CONFIG_' + rate + '();\n  twai_filter_config_t  f = TWAI_FILTER_CONFIG_ACCEPT_ALL();\n  if (twai_driver_install(&g, &t, &f) != ESP_OK) { Serial.println("install failed"); return; }\n  if (twai_start() != ESP_OK)                    { Serial.println("start failed");   return; }\n}\n\nvoid loop() {\n' +
      '  twai_message_t tx = {};                       // zero-initialised: clears the extended and remote flags\n  tx.identifier = ' + id + ';\n  tx.data_length_code = ' + n + ';\n' + data.map((b, i) => '  tx.data[' + i + '] = ' + hex(b) + ';').join('\n') + (n ? '\n' : '') + '  twai_transmit(&tx, pdMS_TO_TICKS(1000));      // waits for the bus, and for an ACK\n  delay(1000);\n}\n';
    const blocks = 'when started\n  start CAN at (' + s.rate / 1000 + ') kbit/s on TX (5) RX (4) :: bus\nforever\n  send CAN frame id (' + id + ') bytes [' + hexList(data) + '] :: bus\n  wait (1) seconds\nend\n';
    return {
      title: 'Send this CAN frame', about: 'One standard frame with the identifier ' + id + ' and ' + plural(n, 'data byte') + ', ' + (s.rate / 1000) + ' kbit/s. If another node sends at the same time, the lower identifier wins and the other waits.',
      needs: 'Two ESP32 boards, each with a CAN transceiver (an SN65HVD230 runs on 3.3 V; a 5 V one such as the TJA1050 needs a level shifter on RXD), and 120 Ω across CANH and CANL at both ends of the bus.',
      wiring: [['GPIO5', 'transceiver TXD'], ['GPIO4', 'transceiver RXD'], ['CANH, CANL', 'the bus: twisted pair, 120 Ω at each end'], ['GND', 'a common ground for the nodes']],
      blocks, cpp, na: { py: 'The official MicroPython 1.29 for the ESP32 has no CAN (TWAI) driver: use the C++ version, or an external SPI CAN controller with a community driver.' },
      output: 'The receiving node prints: id ' + id + ' len ' + n,
      notes: ['The Arduino core has no wrapper for CAN: the sketch uses the ESP-IDF driver (driver/twai.h), which the Arduino sketch can call directly. Newer ESP-IDF versions have a node-based API.', 'Both ends must use the same bit rate; 125, 250 and 500 kbit/s are the common ones.']
    };
  }
  function can(body) {
    const s = ST.can;
    lab(body, {
      id: 'can', state: s, aspect: 0.66, minH: 400, focusLabel: 'Zoom to the identifier',
      intro: 'CAN is a two-wire bus where every node can send, built for noisy places like cars. A frame carries an 11-bit identifier that says what the message is, not who sent it, and up to eight data bytes. Choose both, or let two nodes talk at once.',
      note: 'The bus rests <b>recessive</b> (1); a node can pull it <b>dominant</b> (0) but not push it high, so when two nodes send at once the bus shows the AND of their bits. In the <i>one frame</i> view the red marks are <b>stuffed bits</b> (after five equal bits the sender adds one of the opposite level so the receivers keep seeing edges), then come the CRC and the ACK slot, which the sender leaves recessive and any receiver pulls low. In the <i>two nodes</i> view the identifiers are sent first, most significant bit first: the node that sends a 1 and reads a 0 knows a more important message is on the bus, drops out without disturbing it, and tries again later. So the lower identifier always wins, and no time is lost in a collision.',
      more: ['can-bus-twai', 'fieldbuses-and-other-links', 'choosing-a-bus'],
      pre(side, api) {
        api.tb = textBox(side, { label: 'Data bytes of node A (hex, up to 8)', value: s.data, placeholder: 'AB CD', max: 40, onInput(v) { s.data = v; api.rebuild(); } });
      },
      controls: st => [
        { id: 'kind', type: 'select', label: 'Show', options: [['One frame, field by field', 'one'], ['Two nodes sending at once (arbitration)', 'arb']], value: st.kind },
        { id: 'id', label: 'Identifier of node A (11 bits)', min: 0, max: 2047, step: 1, value: st.id, fmt: v => hex(Math.round(v), 3) },
        { id: 'id2', label: 'Identifier of node B', min: 0, max: 2047, step: 1, value: st.id2, fmt: v => hex(Math.round(v), 3) },
        { id: 'rate', type: 'select', label: 'Bit rate', options: CAN_RATES.map(r => [fmt(r / 1000, 4) + ' kbit/s', r]), value: st.rate },
        { id: 'ack', type: 'check', label: 'Another node acknowledges the frame', value: st.ack }
      ],
      readout: { one: [['rate', 'The bit rate'], ['frame', 'The frame'], ['crc', 'The CRC'], ['ack', 'The ACK slot'], ['eff', 'Efficiency']], arb: [['rate', 'The bit rate'], ['result', 'Who wins'], ['frame', 'The winning frame'], ['retry', 'The loser']] },
      build(st, api) {
        const m = canModel(st);
        api.ctl.show('id2', st.kind === 'arb'); api.ctl.show('ack', st.kind === 'one');
        const bad = parseHex(st.data).bad;
        api.tb.hint(bad.length ? 'Not hex: ' + bad.slice(0, 3).join(', ') : st.kind === 'arb' ? 'node B always sends DE AD' : plural(Math.min(8, parseHex(st.data).bytes.length), 'data byte'));
        return m;
      },
      code: (st, m) => canCode(st, m)
    });
  }

  /* ================================================================ inputs: a button, an encoder, an infrared code */
  const countFalls = edges => { let n = 0, last = edges.length ? edges[0][1] : 1; for (const e of edges) { if (last === 1 && e[1] === 0) n++; last = e[1]; } return n; };
  const ENC_STEP = [0, -1, 1, 0, 1, 0, 0, -1, -1, 0, 0, 1, 0, 1, -1, 0];    // index (previous AB << 2) | new AB: +1, −1, or 0 for no move or an impossible jump
  /* ---- the button */
  function buttonModel(s) {
    const presses = s.presses === 'one' ? [[0.030, 0.150]] : [[0.030, 0.150], [0.220, 0.235]], total = 0.34, bms = s.bounce / 1000;
    // a bounce longer than the tap makes the engine's list overlap itself: put it in time order and drop repeated levels
    const sorted = P().bounce(presses, { bounceMs: s.bounce, seed: 11 }).slice().sort((a, b) => a[0] - b[0]), raw = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) if (sorted[i][1] !== raw[raw.length - 1][1]) raw.push(sorted[i]);
    // the firmware: look at the pin every 0.5 ms, accept a change after it has stood still for the window
    const dt = 0.0005, deb = E.debouncer(s.win), soft = [[raw[0][0], 1]];
    let ptr = 0, last = 1;
    for (let i = 0; i * dt <= total; i++) {
      const t = i * dt;
      while (ptr + 1 < raw.length && raw[ptr + 1][0] <= t) ptr++;
      const o = deb(raw[ptr][1], t * 1000);
      if (o !== last) { soft.push([t, o]); last = o; }
    }
    // the RC filter: the pull-up charges the capacitor, the closed contact empties it at once
    const tau = s.tau / 1000, tauF = tau / 50, pts = [[raw[0][0], 1]];
    let v = 1;
    raw.forEach((e, i) => {
      const t1 = i + 1 < raw.length ? raw[i + 1][0] : total, dur = t1 - e[0], tg = e[1], tc = e[1] ? tau : tauF, n = clamp(Math.ceil(dur / (tc * 0.5)), 1, 20);
      for (let j = 1; j <= n; j++) { const d = dur * Math.pow(j / n, 2); pts.push([e[0] + d, tg + (v - tg) * Math.exp(-d / tc)]); }
      v = tg + (v - tg) * Math.exp(-dur / tc);
    });
    const th = E.hysteresis(0.25, 0.75, true), rcPin = [[pts[0][0], 1]];
    let lastO = 1;
    for (const [t, y] of pts) { const o = th(y) ? 1 : 0; if (o !== lastO) { rcPin.push([t, o]); lastO = o; } }
    const rawN = countFalls(raw), softN = countFalls(soft), rcN = countFalls(rcPin), real = presses.length;
    const softMarks = [], rawMarks = [];
    let n = 0;
    for (let i = 1; i < soft.length; i++) if (soft[i][1] === 0) { n++; softMarks.push(M(soft[i][0], soft[i][0] + 0.014, ['press ' + n, '#' + n, ''], HUE.ok, 0.4)); }
    for (const [d, u] of presses) { if (bms > 0) { rawMarks.push(M(d, d + bms, ['bounce', ''], HUE.bad, 0.4)); rawMarks.push(M(u, u + bms, ['bounce', ''], HUE.bad, 0.4)); } }
    const firstDown = presses[0][0], softDelay = (soft.find((e, i) => i > 0 && e[1] === 0) || [firstDown])[0] - firstDown, rcDelay = (rcPin.find((e, i) => i > 0 && e[1] === 0) || [firstDown])[0] - firstDown;
    const verdict = softN === real ? 'the software debounce reports every press once' : softN > real ? 'the window is shorter than the gaps in the chatter, so bounces still get through' : 'the window is longer than the quick tap: it was swallowed';
    return {
      what: 'button', raw, soft, pts, rcPin, rawN, softN, rcN, real, presses,
      t0: -0.01, t1: total,
      traces: [
        { label: 'button', h: HUE.data, edges: raw, marks: rawMarks },
        { label: 'software', h: HUE.back, edges: soft, marks: softMarks },
        { label: 'RC', h: HUE.analog, pts, min: 0, max: 1.1, marks: [] },
        { label: 'RC → pin', h: HUE.back, edges: rcPin, marks: [] }
      ],
      focus: { t0: firstDown - 0.002, span: Math.max(0.008, 2 * bms + 0.004) },
      hover(t) { return 'button pin ' + P().levelAt(raw, t) + ' · software ' + P().levelAt(soft, t) + ' · RC at ' + fmt(interp(pts, t) * 3.3, 3) + ' V · RC → pin ' + P().levelAt(rcPin, t); },
      overlay(ctx, g, w, info) {
        const c = info.c, Y = f => g.rowY(2) + g.rowH * 0.5 * (1 - f / 1.1);
        ctx.save(); ctx.setLineDash([5, 4]); ctx.lineWidth = 1; ctx.strokeStyle = c.muted; ctx.beginPath();
        for (const f of [0.25, 0.75]) { ctx.moveTo(g.plot.x, Y(f)); ctx.lineTo(g.plot.x + g.plot.w, Y(f)); }
        ctx.stroke(); ctx.restore();
        K().label(ctx, 'the pin reads high above 75 % and low below 25 %', g.plot.x + g.plot.w - 4, Y(0.75) - 9, { size: 10, align: 'right', color: c.muted });
      },
      ro: { which: 'button', v: {
        bounce: s.bounce > 0 ? 'the contact chatters for ' + fmt(s.bounce, 3) + ' ms after every press and release' : 'an ideal contact: no bounce',
        raw: 'counting falling edges of the raw pin gives ' + rawN + ' press' + (rawN === 1 ? '' : 'es') + ' for ' + real + ' real',
        soft: 'window ' + fmt(s.win, 3) + ' ms: ' + softN + ' counted, reported ' + fmtT(softDelay) + ' after the touch · ' + verdict,
        rc: 'time constant ' + fmtT(tau) + ' (e.g. 10 kΩ and ' + capText(tau / 1e4) + '): ' + rcN + ' counted, ' + fmtT(rcDelay) + ' late'
      } }
    };
  }
  function buttonCode(s) {
    const ms = Math.round(s.win);
    const cpp = 'const int BTN_PIN = 0;                 // the BOOT button on most DevKits (active low)\nconst uint32_t DEBOUNCE_MS = ' + ms + ';\n\nbool stableState = HIGH;               // HIGH = released (pull-up)\nbool lastReading = HIGH;\nuint32_t lastChange = 0;\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(BTN_PIN, INPUT_PULLUP);\n}\n\nvoid loop() {\n  bool reading = digitalRead(BTN_PIN);\n  if (reading != lastReading) { lastReading = reading; lastChange = millis(); }\n  if (millis() - lastChange > DEBOUNCE_MS && reading != stableState) {\n    stableState = reading;\n    if (stableState == LOW) Serial.println("pressed");\n  }\n}\n';
    const py = 'from machine import Pin\nimport time\n\nDEBOUNCE_MS = ' + ms + '\nbtn = Pin(0, Pin.IN, Pin.PULL_UP)      # active low\nstable = 1\nlast = btn.value()\nt_change = time.ticks_ms()\nwhile True:\n    v = btn.value()\n    if v != last:\n        last = v\n        t_change = time.ticks_ms()\n    elif time.ticks_diff(time.ticks_ms(), t_change) > DEBOUNCE_MS and v != stable:\n        stable = v\n        if stable == 0:\n            print("pressed")\n    time.sleep_ms(1)\n';
    const blocks = 'when started\n  set pin (0) as [input with pull-up v]\n  set [stable v] to (1)\n  set [last v] to (1)\n  set [changed v] to (0)\nforever\n  set [reading v] to (read pin (0))\n  if <(reading) ≠ (last)> then\n    set [last v] to (reading)\n    set [changed v] to (milliseconds since start)\n  end\n  if <<((milliseconds since start) - (changed)) > (' + ms + ')> and <(reading) ≠ (stable)>> then\n    set [stable v] to (reading)\n    if <(stable) = (0)> then\n      print [pressed]\n    end\n  end\nend\n';
    return {
      title: 'Read a button and ignore its bounce', about: 'A change of the pin is only believed after it has stood still for ' + ms + ' ms: the chatter of the contact never lasts that long.',
      needs: 'An ESP32 DevKit and a push button.', wiring: [['GPIO0', 'button → GND', 'the internal pull-up of about 45 kΩ keeps the pin high']],
      blocks, cpp, py, output: 'pressed (once per press)',
      notes: ['A hardware filter works too: a capacitor of 100 nF across the button, with the pull-up, gives a time constant of about 1–5 ms; the pin’s Schmitt trigger input turns the slow edge into a clean one.', 'GPIO0 is a strapping pin: do not hold it low while the ESP32 starts, or it enters download mode.']
    };
  }
  /* ---- the rotary encoder */
  function encoderModel(s) {
    const dir = s.dir < 0 ? -1 : 1, counts = 4 * Math.round(s.detents) * dir, rate = s.speed, dt = 1 / rate, poll = s.poll;
    const Q = P().quadrature(counts, rate), tEnd = Q.t1;
    let prev = 0, count = 0, bad = 0;
    const moves = [];
    const feed = (t, a, b) => {
      const ns = (a << 1) | b;
      if (ns === prev) return;
      const d = ENC_STEP[(prev << 2) | ns];
      if (d === 0) bad++;
      count += d; moves.push({ t, d, count, bad: d === 0 }); prev = ns;
    };
    if (poll === 0) {
      const ts = Q.a.slice(1).concat(Q.b.slice(1)).map(e => e[0]).sort((x, y) => x - y);
      for (const t of ts) feed(t, P().levelAt(Q.a, t + 1e-12), P().levelAt(Q.b, t + 1e-12));
    } else {
      for (let k = 0; k * poll <= tEnd + dt; k++) { const t = k * poll; feed(t, P().levelAt(Q.a, t), P().levelAt(Q.b, t)); }
    }
    const marks = moves.map((m, i) => { const t1 = i + 1 < moves.length ? moves[i + 1].t : m.t + Math.max(dt, poll || 0); return m.bad ? M(m.t, t1, ['? jump', '?'], HUE.bad, 0.5, { info: 'an impossible jump: two lines changed between looks, so the direction is unknown' }) : M(m.t, t1, [(m.d > 0 ? '+1' : '−1') + ' → ' + m.count, m.d > 0 ? '+1' : '−1', ''], m.d > 0 ? HUE.ok : HUE.analog, 0.38, { info: 'one step ' + (m.d > 0 ? 'forwards' : 'backwards') + ': the count is now ' + m.count }); });
    const rawRange = Math.abs(counts);
    return {
      what: 'encoder', Q, moves, count, bad, counts, dt, poll,
      t0: -2 * dt, t1: tEnd + 2 * dt + (poll || 0),
      traces: [
        { label: 'A', h: HUE.data, edges: Q.a, marks: [] },
        { label: 'B', h: HUE.second, edges: Q.b, marks: [] },
        { label: 'count', h: HUE.back, pts: [], marks }
      ],
      focus: { t0: -dt, span: 6 * dt },
      hover(t) {
        const m = moves.filter(x => x.t <= t), cnt = m.length ? m[m.length - 1].count : 0;
        return 'A = ' + P().levelAt(Q.a, t) + ', B = ' + P().levelAt(Q.b, t) + ' · the firmware has counted ' + cnt;
      },
      overlay(ctx, g, w, info) {
        if (!poll || poll * info.pxPerS < 5) return;
        const c = info.c, kit = K();
        for (let k = Math.max(0, Math.ceil(w.w0 / poll)); k * poll <= w.w1; k++) {
          const t = k * poll;
          kit.dot(ctx, g.X(t), lvlY(g, 0, P().levelAt(Q.a, t)), 3, c.warn, c.bg2);
          kit.dot(ctx, g.X(t), lvlY(g, 1, P().levelAt(Q.b, t)), 3, c.warn, c.bg2);
        }
      },
      ro: { which: 'encoder', v: {
        truth: Math.round(s.detents) + ' detents = ' + rawRange + ' counts (four per detent), turned ' + (dir > 0 ? 'clockwise: A leads B' : 'counter-clockwise: B leads A'),
        speed: fmt(rate, 4) + ' counts per second = ' + fmt(rate / 4, 3) + ' detents per second: one count every ' + fmtT(dt),
        look: poll ? 'the firmware looks every ' + fmtT(poll) + ': ' + fmt(dt / poll, 3) + ' looks per count (it needs well over 1)' : 'an interrupt on every edge: nothing can be missed, if the handler is fast enough',
        read: 'the firmware counted ' + count + ' (' + fmt(count / 4, 3) + ' detents) for ' + counts + ' · ' + (count === counts ? 'exactly right' : plural(bad, 'impossible jump') + ': it lost ' + (Math.abs(counts) - Math.abs(count)) + ' counts')
      } }
    };
  }
  function encoderCode(s) {
    const tbl = ENC_STEP.join(', ');
    const cpp = 'const int PIN_A = 32, PIN_B = 33;\nvolatile int32_t count = 0;\nvolatile uint8_t prevState = 0;\n// index = (previous AB << 2) | new AB; value = +1, -1, or 0 (no move, or an impossible jump)\nconst int8_t STEP[16] = { ' + tbl + ' };\n\nvoid IRAM_ATTR onEdge() {\n  uint8_t s = (digitalRead(PIN_A) << 1) | digitalRead(PIN_B);\n  count = count + STEP[(prevState << 2) | s];\n  prevState = s;\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(PIN_A, INPUT_PULLUP);\n  pinMode(PIN_B, INPUT_PULLUP);\n  prevState = (digitalRead(PIN_A) << 1) | digitalRead(PIN_B);\n  attachInterrupt(PIN_A, onEdge, CHANGE);\n  attachInterrupt(PIN_B, onEdge, CHANGE);\n}\n\nvoid loop() {\n  Serial.println(count / 4);              // four counts per detent\n  delay(200);\n}\n';
    const py = 'from machine import Pin\nimport time\n\npin_a = Pin(32, Pin.IN, Pin.PULL_UP)\npin_b = Pin(33, Pin.IN, Pin.PULL_UP)\n# index = (previous AB << 2) | new AB; value = +1, -1, or 0 (no move, or an impossible jump)\nSTEP = (' + tbl + ')\ncount = 0\nprev = (pin_a.value() << 1) | pin_b.value()\n\ndef on_edge(pin):\n    global count, prev\n    s = (pin_a.value() << 1) | pin_b.value()\n    count += STEP[(prev << 2) | s]\n    prev = s\n\npin_a.irq(handler=on_edge, trigger=Pin.IRQ_FALLING | Pin.IRQ_RISING)\npin_b.irq(handler=on_edge, trigger=Pin.IRQ_FALLING | Pin.IRQ_RISING)\n\nwhile True:\n    print(count // 4)                 # four counts per detent\n    time.sleep_ms(200)\n';
    const blocks = 'when started\n  set pin (32) as [input with pull-up v]\n  set pin (33) as [input with pull-up v]\n  set [count v] to (0)\n  set [prev v] to (state of A and B)\nwhen pin (32) changes :: events\n  look up the step for (prev) and the new state of A and B :: my\n  change [count v] by (step)\nwhen pin (33) changes :: events\n  look up the step for (prev) and the new state of A and B :: my\n  change [count v] by (step)\nforever\n  print ((count) / (4))\n  wait (0.2) seconds\nend\n';
    return {
      title: 'Count the steps of a rotary encoder', about: 'Both pins interrupt on every edge. The table says which way each change of A and B moves; a jump of two steps at once has no direction and counts nothing.',
      needs: 'An ESP32 DevKit and a mechanical or optical rotary encoder (A, B and common).', wiring: [['GPIO32', 'encoder A', 'internal pull-up'], ['GPIO33', 'encoder B', 'internal pull-up'], ['encoder common', 'GND']],
      blocks, cpp, py, output: 'The count in detents: 0, 1, 2 … going up one way and down the other.',
      notes: ['Pins 34–39 of the original ESP32 have no internal pull-up: use 32 and 33 or add resistors.', 'The MicroPython handler is scheduled rather than run at the edge: when the shaft spins very fast, edges are lost — the PCNT hardware counter of the ESP32 never loses one.', 'Many encoders give one or two counts per detent instead of four: divide accordingly.']
    };
  }
  /* ---- the infrared code (NEC) */
  const NEC_BYTES = (addr, cmd) => [addr & 255, ~addr & 255, cmd & 255, ~cmd & 255];
  /* a NEC frame from its four bytes: the envelope of the burst (1 while the 38 kHz carrier runs) */
  function necFrame(bytes, t0) {
    let t = t0 || 0;
    const edges = [[t - 1e-3, 0], [t, 1], [t + 9e-3, 0]], spans = [], bits = [], lead = [t, t + 13.5e-3];
    t += 13.5e-3;
    for (const b of bytes) {
      const a = t;
      for (let i = 0; i < 8; i++) { const v = (b >> i) & 1, d = v ? 2.25e-3 : 1.125e-3; edges.push([t, 1], [t + 560e-6, 0]); bits.push({ t0: t, t1: t + d, v }); t += d; }
      spans.push([a, t]);
    }
    edges.push([t, 1], [t + 560e-6, 0]);
    return { edges, spans, bits, lead, tStop: t, t1: t + 1e-3 };
  }
  function irModel(s) {
    const sent = NEC_BYTES(s.addr, s.cmd), got = sent.slice();
    if (s.noise) got[2] ^= 0x08;                                  // a bit of the command is hit in the air; its inverse is not
    const F = necFrame(got, 0), pin = F.edges.map(e => [e[0], 1 - e[1]]);
    const addrOk = (got[0] ^ got[1]) === 0xFF, cmdOk = (got[2] ^ got[3]) === 0xFF, ok = addrOk && cmdOk;
    const names = ['address', '~address', 'command', '~command'];
    const byteMarks = [M(F.lead[0], F.lead[1], ['leader: 9 ms burst, 4.5 ms gap', 'leader', ''], HUE.clock, 0.35, { info: 'the leader: a 9 ms burst and a 4.5 ms gap tell the receiver a code is coming and set its gain' })];
    F.spans.forEach((sp, i) => {
      const bad = (i === 2 || i === 3) && !cmdOk || (i < 2 && !addrOk);
      byteMarks.push(M(sp[0], sp[1], [names[i] + ' ' + hex(got[i]), hex(got[i]), ''], bad ? HUE.bad : (i % 2 ? HUE.second : HUE.data), bad ? 0.5 : 0.32, { info: names[i] + ' byte ' + hex(got[i]) + ', least significant bit first' + (i % 2 ? ' (the logical inverse of the byte before: it is the check)' : '') }));
    });
    byteMarks.push(M(F.tStop, F.tStop + 560e-6, ['', ''], HUE.clock, 0.35, { info: 'the final burst closes the last bit' }));
    const bitMarks = [M(F.lead[0], F.lead[1], ['leader', ''], HUE.clock, 0.3)];
    F.bits.forEach(b => bitMarks.push(M(b.t0, b.t1, [String(b.v)], HUE.data, b.v ? 0.45 : 0.16, { info: 'bit ' + b.v + ': a 560 µs burst, then a gap of ' + (b.v ? '1.69' : '0.565') + ' ms: ' + (b.v ? '2.25' : '1.125') + ' ms in all' })));
    return {
      what: 'ir', F, sent, got, ok,
      t0: -2e-3, t1: F.t1 + 2e-3,
      traces: [
        { label: 'IR LED', h: HUE.data, edges: F.edges, marks: bitMarks },
        { label: 'pin', h: HUE.back, edges: pin, marks: [] },
        { label: 'bytes', h: HUE.data, pts: [], marks: byteMarks }
      ],
      focus: { t0: -0.5e-3, span: 15e-3 },
      hover(t) { const b = F.bits.find(x => t >= x.t0 && t < x.t1), m = markAt(byteMarks, t); return (m && m.info) || (b ? 'a bit' : 'idle'); },
      overlay(ctx, g, w, info) {
        const cyc = 1 / 38000, c = info.c, kit = K();
        if (cyc * info.pxPerS < 3.2) { if (F.edges.some(e => e[0] > w.w0 && e[0] < w.w1)) kit.label(ctx, 'zoom in further to see the 38 kHz carrier inside each burst', g.plot.x + g.plot.w - 6, lvlY(g, 0, 0) + 12, { size: 10, align: 'right', color: c.muted }); return; }
        ctx.save(); ctx.fillStyle = kit.hue(HUE.data, 0.55);
        let n = 0;
        for (let i = 1; i + 1 < F.edges.length; i++) {
          if (F.edges[i][1] !== 1) continue;
          const a = F.edges[i][0], b = F.edges[i + 1][0];
          if (b < w.w0 || a > w.w1) continue;
          for (let t = Math.max(a, Math.floor(w.w0 / cyc) * cyc); t < Math.min(b, w.w1) && n < 500; t += cyc, n++) ctx.fillRect(g.X(t), lvlY(g, 0, 1), Math.max(1, g.X(t + cyc / 3) - g.X(t)), g.rowH * 0.5);
        }
        ctx.restore();
      },
      ro: { which: 'ir', v: {
        frame: fmtT(F.tStop + 560e-6) + ' for this code: a 0 takes 1.125 ms, a 1 takes 2.25 ms',
        bytes: names.map((n, i) => n + ' ' + hex(got[i])).join(' · '),
        check: ok ? 'both inverse checks pass: address ' + hex(got[0]) + ', command ' + hex(got[2]) : 'an inverse check fails (' + (cmdOk ? '' : 'command and ~command do not match') + (addrOk ? '' : 'address and ~address do not match') + '): the receiver drops the frame',
        repeat: 'while the key is held the remote repeats a short frame (9 ms, 2.25 ms, stop bit) every 108 ms',
        pin: 'the receiver module inverts and demodulates: its output rests high and goes low during a burst'
      } }
    };
  }
  function irCode(s) {
    const cpp = 'const int IR_PIN = 15;                   // receiver module output: rests HIGH, goes LOW during each 38 kHz burst\n\nvolatile uint32_t lastFall = 0, frame = 0;\nvolatile int bitCount = -1;              // -1: waiting for the leader\nvolatile bool ready = false;\n\nvoid IRAM_ATTR onFall() {\n  uint32_t now = micros();\n  uint32_t dt = now - lastFall;          // time since the previous falling edge\n  lastFall = now;\n  if (dt > 12000 && dt < 15000) { bitCount = 0; frame = 0; return; }   // 9 ms burst + 4.5 ms gap: the leader\n  int n = bitCount;\n  if (n < 0) return;\n  uint32_t f = frame >> 1;               // bits arrive least significant first\n  if (dt > 1900) f |= 0x80000000UL;      // 2.25 ms = 1, 1.125 ms = 0\n  frame = f;\n  bitCount = n + 1;\n  if (n + 1 == 32) { bitCount = -1; ready = true; }\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(IR_PIN, INPUT);\n  attachInterrupt(IR_PIN, onFall, FALLING);\n}\n\nvoid loop() {\n  if (ready) {\n    uint32_t f = frame;\n    ready = false;\n    uint8_t addr = f & 0xFF, naddr = (f >> 8) & 0xFF, cmd = (f >> 16) & 0xFF, ncmd = (f >> 24) & 0xFF;\n    if ((uint8_t)(addr ^ naddr) == 0xFF && (uint8_t)(cmd ^ ncmd) == 0xFF) Serial.printf("address 0x%02X command 0x%02X\\n", addr, cmd);\n    else Serial.println("bad frame");\n  }\n}\n';
    const blocks = 'when started\n  set pin (15) as [input v]\nwhen pin (15) goes [low v]\n  set [gap v] to (microseconds since the last falling edge)\n  if <(gap) > (12000)> then\n    set [bits v] to (0)\n  else\n    add <(gap) > (1900)> to the frame as bit (bits) :: my\n    change [bits v] by (1)\n  end\n  if <(bits) = (32)> then\n    print (join [address ] (frame byte (0)) [ command ] (frame byte (2)))\n  end\n';
    return {
      title: 'Decode an infrared remote (NEC) by hand', about: 'An interrupt on every falling edge of the receiver module measures the time since the last one: about 13.5 ms is the leader, over 1.9 ms is a 1, below it a 0.',
      needs: 'An ESP32 DevKit and an infrared receiver module (a 38 kHz demodulating type) on 3.3 V.', wiring: [['GPIO15', 'receiver OUT'], ['3V3', 'receiver VCC'], ['GND', 'receiver GND']],
      blocks, cpp, na: { py: 'MicroPython’s pin handlers on the ESP32 are scheduled, not run at the edge, so microsecond timing of a remote’s pulses is unreliable. Use the C++ version, or a library that reads the pulses with the RMT peripheral.' },
      output: s.noise ? 'bad frame' : 'address ' + hex(s.addr) + ' command ' + hex(s.cmd),
      notes: ['Libraries such as IRremote do this for many protocols at once; the sketch shows what they do underneath.', 'A remote with a 16-bit address (extended NEC) has no inverse byte for the address: only the command is checked.']
    };
  }
  function inputs(body) {
    const s = ST.inputs;
    lab(body, {
      id: 'inputs', state: s, aspect: 0.7, minH: 420, focusLabel: 'Zoom to the start',
      intro: 'Some signals come in by themselves: a button that bounces, a knob that turns, a remote control that blinks an infrared LED. Pick one and watch what the pin sees, and what the firmware makes of it.',
      note: '<b>Button:</b> a real contact chatters for a few milliseconds, so the raw pin shows several presses for one. Counting falling edges is wrong; the software window accepts a change only after it stands still, and an RC filter does the same with a capacitor — try a window longer than the 15 ms tap. <b>Encoder:</b> A and B are the same square wave a quarter of a period apart; which one leads tells the direction. Poll them too slowly (or spin too fast) and two lines change between looks. <b>Infrared:</b> the remote keys a 38 kHz carrier on and off; the receiver module hides the carrier, and the lengths of the gaps are the bits. Each byte is followed by its inverse, so the receiver can tell a damaged code from a good one.',
      more: ['debouncing', 'buttons-and-switches', 'rotary-encoders', 'encoders-and-speed', 'infrared-remotes', 'rc-filters-and-debounce'],
      controls: st => [
        { id: 'what', type: 'select', label: 'The signal', options: [['A bouncing button', 'button'], ['A rotary encoder', 'encoder'], ['An infrared remote (NEC)', 'ir']], value: st.what },
        { id: 'presses', type: 'select', label: 'Pressing', options: [['One press', 'one'], ['A press, then a quick 15 ms tap', 'two']], value: st.presses },
        { id: 'bounce', label: 'Contact bounce', min: 0, max: 20, step: 0.5, value: st.bounce, unit: 'ms' },
        { id: 'win', label: 'Software debounce window', min: 0, max: 60, step: 1, value: st.win, unit: 'ms' },
        { id: 'tau', label: 'RC filter time constant', min: 0.1, max: 20, log: true, sig: 2, value: st.tau, fmt: v => fmt(v, 2) + ' ms' },
        { id: 'dir', type: 'select', label: 'Direction', options: [['Clockwise (A leads B)', 1], ['Counter-clockwise (B leads A)', -1]], value: st.dir },
        { id: 'detents', label: 'Detents turned', min: 1, max: 8, step: 1, value: st.detents },
        { id: 'speed', label: 'Speed', min: 10, max: 20000, log: true, sig: 3, value: st.speed, fmt: v => fmt(v, 3) + ' counts/s' },
        { id: 'poll', type: 'select', label: 'The firmware looks', options: [['at every edge (interrupt)', 0], ['every 0.1 ms', 1e-4], ['every 1 ms', 1e-3], ['every 5 ms', 5e-3], ['every 20 ms', 2e-2]], value: st.poll },
        { id: 'addr', label: 'Address', min: 0, max: 255, step: 1, value: st.addr, fmt: v => hex(Math.round(v)) },
        { id: 'cmd', label: 'Command (the key)', min: 0, max: 255, step: 1, value: st.cmd, fmt: v => hex(Math.round(v)) },
        { id: 'noise', type: 'check', label: 'A bit is damaged in the air', value: st.noise }
      ],
      readout: {
        button: [['bounce', 'The contact'], ['raw', 'Raw pin'], ['soft', 'Software window'], ['rc', 'RC filter']],
        encoder: [['truth', 'What happened'], ['speed', 'The speed'], ['look', 'The firmware'], ['read', 'What it counted']],
        ir: [['frame', 'The frame'], ['bytes', 'The four bytes'], ['check', 'The check'], ['repeat', 'A held key'], ['pin', 'At the pin']]
      },
      build(st, api) {
        const c = api.ctl, w = st.what;
        for (const id of ['presses', 'bounce', 'win', 'tau']) c.show(id, w === 'button');
        for (const id of ['dir', 'detents', 'speed', 'poll']) c.show(id, w === 'encoder');
        for (const id of ['addr', 'cmd', 'noise']) c.show(id, w === 'ir');
        return w === 'encoder' ? encoderModel(st) : w === 'ir' ? irModel(st) : buttonModel(st);
      },
      code: (st, m) => (st.what === 'encoder' ? encoderCode(st) : st.what === 'ir' ? irCode(st) : buttonCode(st))
    });
  }

  /* ================================================================ 1-Wire: a DS18B20 converts and is read */
  const OW_CONV = { 9: 93.75e-3, 10: 187.5e-3, 11: 375e-3, 12: 750e-3 }, OW_CFG = { 9: 0x1F, 10: 0x3F, 11: 0x5F, 12: 0x7F }, OW_MASK = { 9: 0xFFF8, 10: 0xFFFC, 11: 0xFFFE, 12: 0xFFFF };
  const OW_PAD = ['temperature, least significant byte', 'temperature, most significant byte', 'TH, the high alarm', 'TL, the low alarm', 'configuration: the resolution', 'reserved (always 0xFF)', 'reserved', 'reserved (always 0x10)', 'CRC-8 of the first eight bytes'];
  const OW_SHORT = ['T low', 'T high', 'TH', 'TL', 'config', 'rsvd', 'rsvd', 'rsvd', 'CRC'];
  /* the nine scratchpad bytes of a DS18B20 at a temperature and resolution; the last is the CRC-8 of the others */
  function owScratch(temp, res) {
    const raw = Math.round(temp * 16) & 0xFFFF & OW_MASK[res];
    const sp = [raw & 255, (raw >> 8) & 255, 0x4B, 0x46, OW_CFG[res], 0xFF, 0x0C, 0x10];
    sp.push(E.crc8(sp));
    return sp;
  }
  function owModel(s) {
    const SLOT = 70e-6, GAP = 3e-3, conv = OW_CONV[s.res];
    const sp = owScratch(s.temp, s.res), got = sp.slice();
    if (s.corrupt) got[1] ^= 0x04;                                     // one bit of the temperature is hit; the CRC byte is not
    const crcCalc = E.crc8(got.slice(0, 8)), crcOk = crcCalc === got[8], raw = got[0] | (got[1] << 8), T = E.signed(raw, 16) / 16;
    const marks = [], slots = [], samples = [];
    let edges, tEnd;
    const addBytes = (P1, names) => {                          // marks of one P.onewire result: reset, presence, then bytes
      P1.marks.forEach((m, i) => {
        if (m.text === 'reset') marks.push(M(m.t0, m.t1, ['reset: low for 480 µs', 'reset', ''], HUE.clock, 0.35, { info: 'reset: the controller holds DQ low for at least 480 µs' }));
        else if (m.text === 'presence') marks.push(M(m.t0, m.t1, ['presence', 'P', ''], HUE.back, 0.45, { info: 'presence pulse: the sensor pulls DQ low for 60 to 240 µs to say “I am here”' }));
        else {
          const k = i - 2, byte = parseInt(m.text, 16);
          const nm = k < 2 ? names[k] : OW_SHORT[k - 2], long = k < 2 ? names[k] : OW_PAD[k - 2];
          marks.push(M(m.t0, m.t1, [nm + ' ' + hex(byte), hex(byte), ''], k < 2 ? HUE.data : (k - 2 === 8 && !crcOk ? HUE.bad : HUE.back), 0.34, { info: (k < 2 ? 'the controller sends ' + hex(byte) + ': ' + long : 'the sensor sends scratchpad byte ' + (k - 1) + ' = ' + hex(byte) + ': ' + long) + ', least significant bit first' }));
          for (let b = 0; b < 8; b++) { const bit = (byte >> b) & 1, t0 = m.t0 + b * SLOT; slots.push(M(t0, t0 + SLOT, [String(bit)], k < 2 ? HUE.data : HUE.back, bit ? 0.45 : 0.16)); samples.push([t0 + 15e-6, bit]); }
        }
      });
    };
    if (s.missing) {
      edges = [[-100e-6, 1], [0, 0], [480e-6, 1]];
      marks.push(M(0, 480e-6, ['reset: low for 480 µs', 'reset', ''], HUE.clock, 0.35, { info: 'reset: the controller holds DQ low for at least 480 µs' }));
      marks.push(M(480e-6, 1500e-6, ['no presence pulse: nobody is there', 'nobody answers', '?'], HUE.bad, 0.45, { info: 'the line stays high: no sensor pulled it low, so there is nobody on the bus' }));
      tEnd = 1500e-6;
    } else {
      const P1 = P().onewire([0xCC, 0x44], { t: 0 }), P2 = P().onewire([0xCC, 0xBE].concat(got), { t: P1.t1 + GAP });
      addBytes(P1, ['Skip ROM', 'Convert T']);
      marks.push(M(P1.t1, P2.edges[0][0] + 100e-6, ['wait ' + fmtT(conv) + ' (not to scale)', 'conversion', '…', ''], HUE.analog, 0.3, { info: 'the sensor measures: ' + fmtT(conv) + ' at ' + s.res + ' bits. The picture shortens this wait.' }));
      addBytes(P2, ['Skip ROM', 'Read Scratchpad']);
      edges = P1.edges.concat(P2.edges.slice(1));
      tEnd = P2.t1;
    }
    for (const m of marks) if (m.texts[0].indexOf('0xCC') >= 0) m.info = 'Skip ROM (0xCC): “every device, listen”, fine when there is only one sensor on the wire';
    const busT = s.missing ? 1500e-6 : tEnd - 100e-6;
    return {
      sp, got, crcOk, crcCalc, T, raw, conv, edges, marks, slots, samples,
      t0: -200e-6, t1: tEnd + 300e-6,
      traces: [{ label: 'DQ', h: HUE.data, edges, marks }, { label: 'bits', h: HUE.data, pts: [], marks: slots }],
      focus: { t0: -150e-6, span: 850e-6 },
      hover(t) { const m = markAt(marks, t) || markAt(slots, t); return m && m.info ? m.info : (m ? 'one bit slot of 70 µs' : 'the line rests high through the pull-up'); },
      top: {
        h: () => 110,
        draw(ctx, x, y, w, h, info) {
          const c = info.c, Sx = S(), kit = K(), mw = clamp(w * 0.3, 140, 220), x0 = x + 70;
          const one = [[-8e-6, 1], [0, 0], [6e-6, 1], [78e-6, 1]], zero = [[-8e-6, 1], [0, 0], [60e-6, 1], [78e-6, 1]];
          [['a 1', one, y + 16], ['a 0', zero, y + 58]].forEach(([lab, e, yy]) => {
            const Wv = Sx.wave(ctx, x0, yy, mw, 24, e, { t0: -8e-6, t1: 78e-6, color: kit.hue(HUE.data), width: 2 });
            Sx.text(ctx, lab, x0 - 8, yy + 12, { align: 'right', size: 12, color: kit.hue(HUE.data), weight: 650 });
            ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = c.warn; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(Wv.X(15e-6), yy - 4); ctx.lineTo(Wv.X(15e-6), yy + 28); ctx.stroke(); ctx.restore();
          });
          Sx.text(ctx, 'amber: where a slot is read, about 15 µs in', x0, y + 96, { size: 10.5, color: c.warn, align: 'left' });
          const tx = x0 + mw + 18, size = clamp((x + w - tx) / 52 / 0.56, 9, 11);
          ['A 1: the line is pulled low for 6 µs, then released', 'A 0: the line is held low for about 60 µs', 'Read slot: the controller pulls low for 6 µs;', 'a sensor sending 0 holds the line low until 60 µs,', 'one sending 1 does nothing. The controller reads', 'the line about 15 µs after the falling edge.'].forEach((t, i) => Sx.text(ctx, t, tx, y + 10 + i * 15, { size, color: i < 2 ? c.text : c.text2, align: 'left' }));
        }
      },
      overlay(ctx, g, w, info) {
        if (SLOT * info.pxPerS < 12) return;
        const c = info.c, kit = K();
        for (const [ts, bit] of samples) { if (ts < w.w0 || ts > w.w1) continue; kit.dot(ctx, g.X(ts), lvlY(g, 0, bit), 3.6, c.warn, c.bg2); }
      },
      ro: { which: 'ow', hide: s.missing ? ['temp', 'pad', 'crc'] : [], v: {
        slot: 'a bit takes a 70 µs slot here (at least 60 µs): a 1 holds the line low for 6 µs, a 0 for 60 µs',
        reset: s.missing ? 'reset, then nothing: DQ stays high, so reset() reports that no sensor answered' : 'reset 480 µs low, then the sensor’s presence pulse (120 µs here)',
        bus: fmtT(busT) + ' of bus time, not counting the ' + fmtT(conv) + ' conversion',
        temp: 'bytes ' + hex(got[0]) + ' ' + hex(got[1]) + ' = raw ' + E.signed(raw, 16) + ' = ' + fmt(T, 6) + ' °C (one step is ' + fmt(0.0625 * Math.pow(2, 12 - s.res), 4) + ' °C at ' + s.res + ' bits)',
        pad: hexList(got),
        crc: 'CRC-8 of the first eight bytes = ' + hex(crcCalc) + ', received ' + hex(got[8]) + (crcOk ? ': they match' : ': they differ, so the reading is thrown away')
      } }
    };
  }
  function owCode(s) {
    const conv = Math.ceil(OW_CONV[s.res] * 1000), cfg = hex(OW_CFG[s.res]);
    const setNote = s.res === 12 ? '' : '// the sensor was set to ' + s.res + ' bits earlier (Write Scratchpad 0x4E with configuration ' + cfg + ')\n  ';
    const cpp = '#include <OneWire.h>\n\nOneWire ow(4);                       // DQ on GPIO 4 with a 4.7 kOhm pull-up to 3V3\n\nvoid setup() {\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  ' + setNote + 'if (!ow.reset()) { Serial.println("no sensor"); delay(1000); return; }   // reset, then the presence pulse\n  ow.skip();                          // Skip ROM (0xCC): talk to the only device\n  ow.write(0x44);                     // Convert T\n  delay(' + conv + ');                       // the conversion time at ' + s.res + ' bits\n  ow.reset();\n  ow.skip();\n  ow.write(0xBE);                     // Read Scratchpad\n  uint8_t sp[9];\n  for (int i = 0; i < 9; i++) sp[i] = ow.read();\n  if (OneWire::crc8(sp, 8) != sp[8]) { Serial.println("CRC error"); delay(1000); return; }\n  int16_t raw = (sp[1] << 8) | sp[0];\n  Serial.printf("%.4f C\\n", raw / 16.0);\n  delay(1000);\n}\n';
    const py = 'from machine import Pin\nimport onewire, time\n\now = onewire.OneWire(Pin(4))          # DQ on GPIO 4 with a 4.7 kOhm pull-up to 3V3\n\nwhile True:\n    if not ow.reset():                # reset, then the presence pulse\n        print("no sensor")\n        time.sleep(1)\n        continue\n    ow.writebyte(0xCC)                # Skip ROM: talk to the only device\n    ow.writebyte(0x44)                # Convert T\n    time.sleep_ms(' + conv + ')' + (s.res === 12 ? '' : '            # the sensor was set to ' + s.res + ' bits earlier') + '\n    ow.reset()\n    ow.writebyte(0xCC)\n    ow.writebyte(0xBE)                # Read Scratchpad\n    sp = bytearray(9)\n    ow.readinto(sp)                   # nine bytes, least significant bit first\n    if onewire.crc8(sp[:8]) != sp[8]:\n        print("CRC error")\n    else:\n        raw = sp[0] | (sp[1] << 8)\n        if raw & 0x8000:\n            raw -= 0x10000\n        print(raw / 16)\n    time.sleep(1)\n';
    const blocks = 'when started\n  set pin (4) as [input v]\nforever\n  reset the 1-Wire bus on pin (4) :: bus\n  write bytes [CC 44] to the 1-Wire bus :: bus\n  wait (' + fmt(conv / 1000, 3) + ') seconds\n  reset the 1-Wire bus on pin (4) :: bus\n  write bytes [CC BE] to the 1-Wire bus :: bus\n  set [pad v] to (read (9) bytes from the 1-Wire bus) :: bus\n  if <(CRC-8 of (pad)) = (0)> then\n    print ((signed 16 bit of (pad) bytes (1) and (2)) / (16))\n  end\n  wait (1) seconds\nend\n';
    return {
      title: 'Read a DS18B20 over 1-Wire, byte by byte', about: 'The exchange of the picture: reset, Skip ROM, Convert T, wait, reset, Skip ROM, Read Scratchpad, nine bytes back, and the CRC check.',
      needs: 'An ESP32 DevKit and a DS18B20 temperature sensor with a 4.7 kΩ resistor from DQ to 3V3.', wiring: [['GPIO4', 'DQ (the data wire)', 'with 4.7 kΩ to 3V3'], ['3V3', 'VDD'], ['GND', 'GND']],
      libs: ['OneWire'], blocks, cpp, py,
      output: s.missing ? 'no sensor' : s.corrupt ? 'CRC error' : fmt(Math.round(s.temp * 16) / 16, 6) + ' C',
      notes: ['Skip ROM only works with one sensor on the wire. With several, each is addressed by its own 64-bit ROM code (Match ROM, 0x55).', 'The DallasTemperature library wraps all of this: requestTemperatures() and getTempCByIndex(0).']
    };
  }
  function onewire(body) {
    const s = ST.onewire;
    lab(body, {
      id: 'onewire', state: s, aspect: 0.74, minH: 440, focusLabel: 'Zoom to the reset',
      intro: '1-Wire carries data in both directions, and even power, on a single wire plus ground. The wire is pulled up; the controller and the sensors only ever pull it low, for carefully measured times. Here a DS18B20 temperature sensor is told to measure and then read out.',
      note: 'The line rests high through a 4.7 kΩ resistor. <b>Reset</b>: the controller holds it low for at least 480 µs; a sensor that is there answers with a <b>presence pulse</b>. After that every bit is a time slot: a short low (about 6 µs) is a 1, a long low (60 µs) is a 0 — bytes go out <b>least significant bit first</b>. When the sensor is the one talking, it holds the line low for its 0s while the controller reads the line about 15 µs after the falling edge (the dots). The exchange: reset, <i>Skip ROM</i> (0xCC), <i>Convert T</i> (0x44), a wait (up to 750 ms, drawn short here), reset, Skip ROM, <i>Read Scratchpad</i> (0xBE), then nine bytes come back, the last a CRC-8 of the other eight. Tick <i>damage a bit</i> and the CRC check catches it.',
      more: ['one-wire', 'temperature-sensors'],
      controls: st => [
        { id: 'temp', label: 'Temperature of the sensor', min: -55, max: 125, step: 0.0625, value: st.temp, fmt: v => fmt(v, 5) + ' °C' },
        { id: 'res', type: 'select', label: 'Resolution', options: [['9 bits (0.5 °C), 94 ms', 9], ['10 bits (0.25 °C), 188 ms', 10], ['11 bits (0.125 °C), 375 ms', 11], ['12 bits (0.0625 °C), 750 ms', 12]], value: st.res },
        { id: 'missing', type: 'check', label: 'No sensor connected', value: st.missing },
        { id: 'corrupt', type: 'check', label: 'Damage a bit of the answer', value: st.corrupt }
      ],
      readout: { ow: [['slot', 'A bit'], ['reset', 'The reset'], ['bus', 'The exchange'], ['temp', 'The temperature'], ['pad', 'The nine bytes'], ['crc', 'The CRC check']] },
      build(st, api) { api.ctl.show('res', !st.missing); api.ctl.show('temp', !st.missing); api.ctl.show('corrupt', !st.missing); return owModel(st); },
      code: st => owCode(st)
    });
  }

  /* ================================================================ the Tools page */
  const TABS = [['uart', 'UART'], ['i2c', 'I2C'], ['spi', 'SPI'], ['pwm', 'PWM'], ['pixels', 'Pixels (WS2812)'], ['can', 'CAN'], ['inputs', 'Inputs'], ['onewire', '1-Wire']];
  T.signals = function (el, params, sub) {
    const { tab, body } = T.util.subtabs(el, 'signals', TABS, sub);
    ({ uart, i2c, spi, pwm, pixels, can, inputs, onewire })[tab](body);
  };
  T.signals.tabs = TABS.map(t => t[0]);
  T.signals.lib = Object.assign({ parseHex, utf8, textBytes, escBytes, fitMarks, edgesOfBits, byteTexts, M, HUE, fmtT, fmtHz, uartModel, uartCode, uartBytesOf, i2cModel, i2cCode, spiModel, spiCode, pwmModel, pwmCode, pixelsModel, pixelsCode, canModel, canCode, canFrame, buttonModel, buttonCode, encoderModel, encoderCode, irModel, irCode, necFrame, NEC_BYTES, ENC_STEP, countFalls, owModel, owCode, owScratch }, T.signals.lib);
})();
