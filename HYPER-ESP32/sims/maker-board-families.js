/* HYPER-ESP32 · sims/maker-board-families.js
 *
 * Simulations of "Maker board families" (topic code: mb).
 *
 *   mb-form-factors     the outlines of the board families drawn to one scale, with the header holes
 *   mb-feather-pins     the same label on different GPIOs: the pin maps of Feather and Thing Plus boards side by side
 *   mb-label-translator D-labels and GPIO numbers on NodeMCU, D1 mini, the D1 mini ESP32 clone and the Nano ESP32
 *   mb-main-vs-radio    a board whose main chip is not an ESP: where the sketch runs, where the radio stack runs
 *   mb-chooser          a filter over the board catalogue by what the project needs
 *   mb-poe-budget       the power budget of the Olimex PoE boards
 *   mb-sleep-life       battery life with the published deep-sleep currents of the boards
 *
 * Board facts come from the catalogue (kit.esp). The UNO and MKR outlines, the sleep currents (the makers' published
 * figures, collected from the catalogue's notes) and the load figures are marked as such in the blurbs.
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const isNum = v => typeof v === 'number' && Number.isFinite(v);
  const fmt = (v, d) => (isNum(v) ? v.toFixed(d == null ? 1 : d) : '—');
  const str = v => (v == null || v === '' ? '—' : String(v));
  const shorten = (s, n) => { s = String(s == null ? '' : s); return s.length > n ? s.slice(0, Math.max(1, n - 1)) + '…' : s; };
  /* a label shortened until it fits in maxW pixels */
  function fit(c, text, maxW, size, weight) {
    let t = String(text == null ? '' : text);
    c.save(); c.font = (weight || 500) + ' ' + size + 'px system-ui, "Segoe UI", sans-serif';
    let guard = 0;
    while (t.length > 1 && c.measureText(t).width > maxW && guard++ < 200) t = t.slice(0, -2) + '…';
    c.restore();
    return t;
  }
  /* a simple word wrap by character count: -> lines */
  function wrap(text, n) {
    const words = String(text == null ? '' : text).split(/\s+/), lines = [];
    let cur = '';
    for (const w of words) { if ((cur + ' ' + w).trim().length > n && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
    if (cur) lines.push(cur);
    return lines;
  }
  /* the size of a board as [short side, long side] in mm, or null (the catalogue gives it either way round) */
  function sizeOf(b) {
    const s = b && b.size;
    if (!Array.isArray(s) || !isNum(s[0]) || !isNum(s[1]) || s[0] <= 0 || s[1] <= 0) return null;
    return [Math.min(s[0], s[1]), Math.max(s[0], s[1])];
  }
  /* a chip's name without the part in brackets: "ESP32-C2 (ESP8684)" -> "ESP32-C2" */
  function chipName(E, id) { const c = E.chip(id); return c ? String(c.name).replace(/\s*\(.*\)\s*$/, '') : str(id); }
  const boardText = b => [b.name, b.family, (b.expansion || []).join(' ')].join(' | ');

  /* ================================================================ mb-form-factors */
  const FF = [
    { id: 'feather', name: 'Feather', board: 'adafruit-feather-esp32-v2', hue: 300, holes: [12, 16], logic: '3.3 V',
      promise: 'A fixed header order, a LiPo connector with a charger, and wings that stack on top.',
      match: b => b.family === 'Feather' || /feather header/i.test((b.expansion || []).join(' ')) },
    { id: 'thing', name: 'Thing Plus', board: 'sparkfun-thing-plus-esp32-wroom-usb-c', hue: 8, holes: [12, 16], logic: '3.3 V',
      promise: 'The Feather holes on a longer board, with a microSD slot and a Qwiic connector.',
      match: b => /thing plus/i.test(b.name) },
    { id: 'd1', name: 'D1 mini', board: 'lolin-d1-mini', hue: 190, holes: [8, 8], logic: '3.3 V',
      promise: 'Two rows of eight pins; shields stack on top. Copied by the S2, S3 and C3 minis.',
      match: b => /d1 mini/i.test(boardText(b)) },
    { id: 'nano', name: 'Nano', board: 'arduino-nano-esp32', hue: 212, holes: [15, 15], logic: '3.3 V on the ESP boards',
      promise: 'A narrow board with two rows of 15 pins that fits a socket or a breadboard.',
      match: b => b.family === 'Nano' || /nano form factor|nano 2 x 15/i.test((b.expansion || []).join(' ')) },
    { id: 'uno', name: 'UNO', size: [53.4, 68.6], src: 'the makers\' round figure', hue: 150, holes: [18, 14], logic: '5 V in the original',
      promise: 'The shield header of the classic Arduino. Many shields expect 5 V, ESP boards give 3.3 V.',
      match: b => b.family === 'UNO' || /uno (r3 )?(shield )?header/i.test((b.expansion || []).join(' ')) },
    { id: 'mkr', name: 'MKR', size: [25, 61.5], src: 'the makers\' round figure', hue: 100, holes: [14, 14], logic: '3.3 V',
      promise: 'A narrow board with a header down each side.',
      match: b => /\bmkr\b/i.test(boardText(b)) },
    { id: 'xiao', name: 'XIAO', board: 'seeed-xiao-esp32c3', hue: 48, holes: [7, 7], logic: '3.3 V',
      promise: 'Seven castellated pads down each side, thumb-sized.',
      match: b => /xiao/i.test(b.name) && b.maker === 'Seeed Studio' },
    { id: 'qtpy', name: 'QT Py', board: 'adafruit-qt-py-esp32c3', hue: 330, holes: [7, 7], logic: '3.3 V',
      promise: 'The same idea as the XIAO, with a STEMMA QT port.',
      match: b => b.family === 'QT Py' },
    { id: 'pocket', name: 'Qwiic Pocket', board: 'sparkfun-qwiic-pocket-esp32-c6', hue: 20, holes: [4, 4], logic: '3.3 V',
      promise: 'The one-inch Qwiic standard size with eight pins.',
      match: b => /qwiic pocket/i.test(b.name) }
  ];
  const FFGROUPS = {
    stack: ['feather', 'thing', 'd1', 'uno', 'mkr'],
    thumb: ['nano', 'd1', 'xiao', 'qtpy', 'pocket'],
    all: ['feather', 'thing', 'd1', 'nano', 'uno', 'mkr', 'xiao', 'qtpy', 'pocket']
  };

  Hyper.sim('mb-form-factors', {
    title: 'Form factors to scale',
    blurb: `Each outline is drawn from its size in millimetres in the board catalogue, all at one scale with the bottoms aligned; the dots are the header holes at 0.1 inch (2.54 mm). **Click a form factor** to read what it promises and how many boards of the catalogue use it. The UNO and MKR sizes are the makers' round figures, not catalogue values.

**Try this**
- Compare the **Feather** with the **Thing Plus**: the same hole pattern, but the Thing Plus is longer to make room for a microSD slot.
- Look at the **D1 mini** against the **Nano**: one wide and short, the other narrow and long.
- Switch to *narrow and thumb-sized boards*: a XIAO and a QT Py are nearly the same size, within a millimetre.
- Read the **voltage** line of the UNO: the outline is easy to copy, the 5 V logic of its shields is not.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300, maxH: 470 });
      const X = {};
      for (const f of FF) {
        const b = f.board ? E.board(f.board) : null;
        X[f.id] = Object.assign({}, f, { size: sizeOf(b) || f.size || null, src: f.src || 'the catalogue' });
        const list = E.BOARDS.filter(f.match);
        X[f.id].count = list.length;
        X[f.id].names = list.slice(0, 3).map(q => shorten(q.name.replace(/^(Adafruit|SparkFun|Arduino|LOLIN \(WEMOS\)|Seeed Studio) /, ''), 26));
      }
      let sel = 'feather', hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'group', type: 'select', label: 'Show', options: [['boards that take shields and wings', 'stack'], ['narrow and thumb-sized boards', 'thumb'], ['all of them', 'all']], value: FFGROUPS[params && params.group] ? params.group : 'stack' },
        { id: 'holes', type: 'check', label: 'Show the header holes', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['name', 'Form factor'], ['size', 'Size'], ['area', 'Area against a Feather'], ['logic', 'Logic voltage'], ['promise', 'It promises'], ['count', 'In the board catalogue']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const items = (FFGROUPS[v.group] || FFGROUPS.stack).map(id => X[id]).filter(f => f && f.size);
        const gap = 14, M = 12;
        const sumW = items.reduce((a, f) => a + f.size[0], 0), maxH = Math.max.apply(null, items.map(f => f.size[1]).concat([1]));
        const availW = st.W - 2 * M - gap * Math.max(0, items.length - 1), availH = st.H - 2 * M - 62;
        const scale = Math.max(0.3, Math.min(availW / Math.max(1, sumW), availH / maxH));
        const totalW = sumW * scale + gap * Math.max(0, items.length - 1);
        const base = M + 6 + maxH * scale;
        hits = [];
        let x = Math.max(M, (st.W - totalW) / 2);
        items.forEach((f, k) => {
          const w = f.size[0] * scale, h = f.size[1] * scale, y = base - h, on = f.id === sel;
          c.fillStyle = kit.hue(f.hue, 0.26); c.fillRect(x, y, w, h);
          c.strokeStyle = on ? C.accent : kit.hue(f.hue); c.lineWidth = on ? 2.8 : 1.4; c.strokeRect(x, y, w, h);
          if (v.holes) {
            const dot = Math.max(1, 0.5 * scale);
            [[x + 1.5 * scale, f.holes[0]], [x + w - 1.5 * scale, f.holes[1]]].forEach(([px, n]) => {
              const pitch = Math.min(2.54 * scale, (h - 6) / Math.max(1, n)), y0 = y + (h - (n - 1) * pitch) / 2;
              c.fillStyle = C.faint;
              for (let i = 0; i < n; i++) c.fillRect(px - dot / 2, y0 + i * pitch - dot / 2, dot, dot);
            });
          }
          c.fillStyle = C.muted; c.fillRect(x + w * 0.36, base - Math.max(2, 2.2 * scale), w * 0.28, Math.max(2, 2.2 * scale));
          const ly = base + 12 + (k % 2) * 26;
          kit.label(c, fit(c, f.name, w + gap + 6, 10.5, on ? 650 : 500), x + w / 2, ly, { size: 10.5, color: on ? C.accent : C.text2, align: 'center', weight: on ? 650 : 500 });
          kit.label(c, f.size.map(q => fmt(q, 1)).join(' × '), x + w / 2, ly + 11, { size: 9, color: C.faint, align: 'center' });
          hits.push({ x: x - 3, y: y - 3, w: w + 6, h: h + 6, id: f.id });
          x += w + gap;
        });
        const nice = [5, 10, 20, 50].find(m => m * scale >= 40) || 50, sy = st.H - 10;
        c.strokeStyle = C.text2; c.lineWidth = 2; c.beginPath(); c.moveTo(12, sy); c.lineTo(12 + nice * scale, sy); c.moveTo(12, sy - 4); c.lineTo(12, sy + 4); c.moveTo(12 + nice * scale, sy - 4); c.lineTo(12 + nice * scale, sy + 4); c.stroke();
        kit.label(c, nice + ' mm', 18 + nice * scale, sy, { size: 10.5, color: C.text2 });
        const f = X[sel] || X.feather, fa = X.feather.size ? X.feather.size[0] * X.feather.size[1] : 1;
        ro.set('name', f.name);
        ro.set('size', f.size ? f.size.map(q => fmt(q, 1)).join(' × ') + ' mm (' + f.src + ')' : 'not in the catalogue');
        ro.set('area', f.size ? fmt(f.size[0] * f.size[1] / fa, 1) + ' ×' : '—');
        ro.set('logic', f.logic);
        ro.set('promise', f.promise);
        ro.set('count', f.count + ' board' + (f.count === 1 ? '' : 's') + (f.names.length ? ', for example ' + f.names.join(', ') : ''));
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { sel = h.id; loop.once(); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ mb-feather-pins */
  const PSETS = {
    feather: [['adafruit-huzzah32-feather', 'HUZZAH32'], ['adafruit-feather-esp32-v2', 'ESP32 V2'], ['adafruit-feather-esp32s2-tft', 'S2 TFT'], ['adafruit-feather-esp32s3-8mb-nopsram', 'S3'], ['adafruit-feather-esp32c6', 'C6']],
    thing: [['sparkfun-thing-plus-esp32-wroom-usb-c', 'Thing+ ESP32'], ['sparkfun-thing-plus-esp32-s3', 'Thing+ S3'], ['adafruit-huzzah32-feather', 'HUZZAH32'], ['adafruit-feather-esp32-v2', 'Feather V2'], ['adafruit-feather-esp32c6', 'Feather C6']]
  };
  const PROLES = [['SDA', ['sda']], ['SCL', ['scl']], ['SCK', ['sck']], ['MOSI', ['mosi', 'pico']], ['MISO', ['miso', 'poci']], ['RX', ['rx', 'serial1_rx']], ['TX', ['tx', 'serial1_tx']], ['LED', ['led', 'stat_led']], ['RGB LED', ['neopixel', 'rgb_led']]];
  const pinOf = (b, keys) => { const p = (b && b.pins) || {}; for (const k of keys) if (isNum(p[k])) return p[k]; return null; };

  Hyper.sim('mb-feather-pins', {
    title: 'Same label, different GPIO',
    blurb: `Boards in the Feather pattern share the *order* of the holes, not the GPIO numbers behind them. The table lists the pins in the board catalogue, one column per board. **Click a column** to say your sketch was written for that board: with *the same as my board* selected, green cells are pins your numbers still hit, red cells are pins where they land somewhere else. A dash means the catalogue does not list that pin for the board.

**Try this**
- Take the HUZZAH32 as your board and read the **SDA** row: the number is right on no other board of the set.
- Switch to *strapping pins* and look for amber cells: a pin that is also a boot pin on that chip.
- Choose the *SparkFun and Adafruit* set: the WROOM Thing Plus puts SPI on 18, 19 and 23 while the HUZZAH32 uses 5, 18 and 19.
- Count the green cells in the ESP32 V2 column when the sketch is written for the C6.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 440 });
      let ref = 0, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'set', type: 'select', label: 'Boards', options: [['Adafruit Feathers', 'feather'], ['SparkFun and Adafruit', 'thing']], value: PSETS[params && params.set] ? params.set : 'feather' },
        { id: 'mark', type: 'select', label: 'Colour the cells', options: [['by the board my sketch was written for', 'ref'], ['by pin kind', 'num'], ['strapping pins', 'strap']], value: 'ref' }
      ], (id) => { if (id === 'set') ref = 0; loop.once(); });
      const ro = kit.readout(box.side, [['ref', 'Sketch written for'], ['keep', 'Pins still right'], ['sda', 'SDA across these boards']]);
      const cols = () => PSETS[ctl.values.set].map(([id, short]) => ({ b: E.board(id), short, id })).filter(q => q.b);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), mark = ctl.values.mark, list = cols();
        if (!list.length) return;
        if (ref >= list.length) ref = 0;
        const lw = clamp(st.W * 0.15, 52, 74), M = 6, cw = (st.W - lw - 2 * M) / list.length, y0 = 50;
        const rh = clamp((st.H - y0 - 58) / PROLES.length, 17, 30);
        hits = [];
        list.forEach((col, j) => {
          const x = lw + M + j * cw, on = j === ref;
          kit.label(c, fit(c, col.short, cw - 4, 11, on ? 700 : 600), x + cw / 2, 14, { size: 11, weight: on ? 700 : 600, color: on ? C.accent : C.text, align: 'center' });
          kit.label(c, fit(c, chipName(E, col.b.chip), cw - 4, 9.5, 500), x + cw / 2, 28, { size: 9.5, color: C.muted, align: 'center' });
          if (on) kit.label(c, 'my board', x + cw / 2, 41, { size: 9, color: C.accent, align: 'center' });
          hits.push({ x, y: 4, w: cw, h: y0 + PROLES.length * rh, j });
        });
        PROLES.forEach(([role, keys], i) => {
          const y = y0 + i * rh;
          kit.label(c, role, 8, y + rh / 2, { size: 11, weight: 650 });
          const refv = pinOf(list[ref].b, keys);
          list.forEach((col, j) => {
            const x = lw + M + j * cw, g = pinOf(col.b, keys), cx = x + 2, cwid = cw - 4;
            let fill = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)', edge = null;
            if (g != null) {
              if (mark === 'ref' && j !== ref) { fill = g === refv ? 'rgba(34,179,122,.32)' : 'rgba(229,72,77,.30)'; if (refv == null) fill = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; }
              else if (mark === 'num') fill = S.kindColor(E.pinKind(col.b.chip, g), 0.22);
              else if (mark === 'strap') { const pi = E.pin(col.b.chip, g); if (pi && pi.strap) { fill = 'rgba(224,160,48,.40)'; edge = C.warn; } }
            }
            c.fillStyle = fill; c.fillRect(cx, y + 1, cwid, rh - 2);
            if (j === ref) { c.strokeStyle = C.accent; c.lineWidth = 1.4; c.strokeRect(cx, y + 1, cwid, rh - 2); }
            if (edge) { c.strokeStyle = edge; c.lineWidth = 2; c.strokeRect(cx + 1, y + 2, cwid - 2, rh - 4); }
            kit.label(c, g == null ? '—' : String(g), x + cw / 2, y + rh / 2, { size: 11.5, weight: g == null ? 400 : 600, color: g == null ? C.faint : C.text, align: 'center' });
          });
        });
        const ly = y0 + PROLES.length * rh + 16;
        const lines = mark === 'ref' ? ['green: the same GPIO as on your board', 'red: another GPIO, so raw numbers break']
          : mark === 'strap' ? ['amber: a strapping pin of that chip', 'read at reset: mind what is wired to it'] : ['colours: the kind of pin the chip says it is', '(analogue, strapping, serial, plain …)'];
        lines.forEach((t, i) => kit.label(c, t, 8, ly + i * 14, { size: 10.5, color: C.muted }));
        // the readout
        const rb = list[ref], same = PROLES.map(([, keys]) => pinOf(rb.b, keys));
        ro.set('ref', rb.b.name.length > 40 ? shorten(rb.b.name, 40) : rb.b.name);
        ro.set('keep', list.map((col, j) => {
          if (j === ref) return null;
          let known = 0, ok = 0;
          PROLES.forEach(([, keys], i) => { const g = pinOf(col.b, keys); if (g != null && same[i] != null) { known++; if (g === same[i]) ok++; } });
          return col.short + ' ' + ok + '/' + known;
        }).filter(Boolean).join(' · '));
        const sdas = list.map(col => pinOf(col.b, PROLES[0][1])).filter(isNum);
        ro.set('sda', sdas.length ? 'GPIO ' + Math.min.apply(null, sdas) + ' to ' + Math.max.apply(null, sdas) : '—');
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { ref = h.j; loop.once(); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ mb-label-translator */
  const LT_BOARDS = [
    ['NodeMCU DevKit V1.0 (ESP8266)', 'nodemcu-devkit-v1-amica', 'NodeMCU'],
    ['LOLIN D1 mini (ESP8266)', 'lolin-d1-mini', 'D1 mini'],
    ['D1 mini ESP32 clone', 'd1-mini-esp32-clone', 'D1 mini ESP32'],
    ['Arduino Nano ESP32', 'arduino-nano-esp32', 'Nano ESP32']
  ];
  /* the D and A labels of a board with the GPIO behind each: [{ label, gpio (null for the analogue-only A0) }] */
  function labelsOf(E, b) {
    const out = [], seen = new Set();
    const add = (label, gpio) => { if (!seen.has(label)) { seen.add(label); out.push({ label, gpio: isNum(gpio) ? gpio : null }); } };
    if (b && Array.isArray(b.headers)) {
      for (const hd of b.headers) for (const raw of (hd.pins || [])) { const p = E.parsePin(raw); if (p && /^[DA]\d+$/.test(p.label)) add(p.label, p.gpio); }
    } else if (b && b.pins) {
      for (const k of Object.keys(b.pins)) if (/^D\d+$/.test(k) && isNum(b.pins[k])) add(k, b.pins[k]);
    }
    out.sort((a, z) => (a.label[0] === z.label[0] ? +a.label.slice(1) - +z.label.slice(1) : a.label[0] > z.label[0] ? -1 : 1));
    return out;
  }

  Hyper.sim('mb-label-translator', {
    title: 'D-labels and GPIO numbers',
    blurb: `The labels printed on a board and the GPIO numbers of the chip are two different systems. The table on the left lists every D and A label of the chosen board with the GPIO behind it, coloured by what the chip says about that pin. **Click a label**: the panel on the right shows the same label on all four boards, and what a sketch gains or loses by using the label or the number.

**Try this**
- Pick **D2** on the NodeMCU: it is GPIO4. Look on the right: on the D1 mini ESP32 clone the same label is GPIO21.
- Pick **D4** on the NodeMCU and read the verdict: it is GPIO2, the LED and a boot pin.
- Switch to the **Nano ESP32** and click **D13**: it is GPIO48, not 13.
- Check how many boards agree with the number in the second line: usually one or two out of four.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const narrow = (box.stage.clientWidth || 760) < 500;
      const st = kit.stage(box.stage, narrow ? { aspect: 1.35, minH: 520, maxH: 600 } : { aspect: 0.62, minH: 380, maxH: 520 });
      const start = LT_BOARDS.find(q => q[1] === (params && params.board)) || LT_BOARDS[0];
      let sel = 'D2', rows = [];
      const ctl = kit.controls(box.side, [
        { id: 'board', type: 'select', label: 'Board', options: LT_BOARDS.map(q => [q[0], q[1]]), value: start[1] }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['label', 'Label'], ['gpio', 'GPIO'], ['says', 'The catalogue says'], ['same', 'Same GPIO on']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const entry = LT_BOARDS.find(q => q[1] === ctl.values.board) || LT_BOARDS[0], b = E.board(entry[1]);
        if (!b) return;
        const L = labelsOf(E, b);
        if (!L.length) return;
        if (!L.some(q => q.label === sel)) sel = (L.find(q => q.label === 'D2') || L[0]).label;
        const cur = L.find(q => q.label === sel);
        // the table of labels
        const x0 = 10, top = 36, lw = Math.min(300, st.W * 0.5 - 12), rh = clamp((st.H - top - 10) / L.length, 14, 26);
        kit.label(c, 'Labels of the ' + entry[2], x0, 14, { size: 12, weight: 650, color: C.text2 });
        rows = [];
        L.forEach((q, i) => {
          const y = top + i * rh, on = q.label === sel;
          if (on) { c.fillStyle = C.dark ? 'rgba(123,140,255,.16)' : 'rgba(60,90,220,.10)'; c.fillRect(x0 - 4, y, lw + 4, rh - 1); }
          rows.push({ x: x0 - 4, y, w: lw + 4, h: rh, label: q.label });
          kit.label(c, q.label, x0, y + rh / 2, { size: 11.5, weight: 650 });
          const kind = q.gpio == null ? 'adc' : E.pinKind(b.chip, q.gpio);
          c.fillStyle = S.kindColor(kind, on ? 0.5 : 0.22); c.fillRect(x0 + 40, y + 1.5, lw - 44, rh - 3);
          kit.label(c, q.gpio == null ? 'analogue only' : 'GPIO' + q.gpio, x0 + 40 + (lw - 44) / 2, y + rh / 2, { size: 11.5, weight: on ? 700 : 500, align: 'center' });
        });
        // the same label on every board
        const rx = x0 + lw + 14, rw = Math.max(120, st.W - rx - 8), n = Math.max(10, Math.floor(rw / 5.7));
        kit.label(c, 'The label ' + sel + ' on each board', rx, 14, { size: 12, weight: 650, color: C.text2 });
        let agree = 0;
        LT_BOARDS.forEach((q, i) => {
          const bb = E.board(q[1]), y = 36 + i * 26, g = bb ? (labelsOf(E, bb).find(z => z.label === sel) || null) : null, mine = q[1] === entry[1];
          const val = g ? g.gpio : null;
          if (g && cur && val != null && val === cur.gpio) agree++;
          kit.label(c, fit(c, q[2], rw * 0.5, 11, mine ? 700 : 500), rx, y + 10, { size: 11, weight: mine ? 700 : 500, color: mine ? C.accent : C.text });
          c.fillStyle = g && val != null ? S.kindColor(E.pinKind(bb.chip, val), 0.25) : (C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)');
          c.fillRect(rx + rw * 0.52, y, rw * 0.48, 20);
          if (mine) { c.strokeStyle = C.accent; c.lineWidth = 1.5; c.strokeRect(rx + rw * 0.52, y, rw * 0.48, 20); }
          kit.label(c, g ? (val == null ? 'analogue only' : 'GPIO' + val) : 'no such label', rx + rw * 0.76, y + 10, { size: 11, align: 'center', weight: g ? 600 : 400, color: g ? C.text : C.faint });
        });
        // what the chip says, and what the sketch gains
        const v = cur && cur.gpio != null ? E.pinVerdict(b.chip, cur.gpio) : null;
        const says = cur && cur.gpio == null ? 'The only analogue input of the ESP8266. It is not a GPIO, so it cannot be used for digital signals.' : (v && v.text ? v.text : 'The catalogue has no note for this pin.');
        let y = 36 + LT_BOARDS.length * 26 + 14;
        wrap(says, n).slice(0, 5).forEach((t, i) => kit.label(c, t, rx, y + i * 13, { size: 10.5, color: C.muted }));
        y += 5 * 13 + 14;
        if (cur && cur.gpio != null) {
          kit.label(c, 'A sketch that says ' + sel + ':', rx, y, { size: 10.5, weight: 650, color: C.text2 });
          kit.label(c, 'follows the board: GPIO' + cur.gpio + ' here', rx, y + 14, { size: 10.5, color: C.ok });
          kit.label(c, 'A sketch that says ' + cur.gpio + ':', rx, y + 34, { size: 10.5, weight: 650, color: C.text2 });
          kit.label(c, 'is ' + sel + ' on ' + agree + ' of ' + LT_BOARDS.length + ' boards here', rx, y + 48, { size: 10.5, color: agree >= LT_BOARDS.length ? C.ok : C.warn });
        }
        ro.set('label', sel + ' on the ' + entry[2]);
        ro.set('gpio', cur ? (cur.gpio == null ? 'none: the analogue input' : 'GPIO' + cur.gpio) : '—');
        ro.set('says', shorten(says, 170));
        ro.set('same', cur && cur.gpio != null ? agree + ' of ' + LT_BOARDS.length + ' boards' : '—');
      }, box.stage);
      kit.click(st, p => { const r = rows.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (r) { sel = r.label; loop.once(); } },
        p => rows.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ mb-main-vs-radio */
  const MR = [
    { id: 'arduino-uno-r4-wifi', short: 'UNO R4 WiFi', main: 'Renesas RA4M1', sub: 'Cortex-M4 · 48 MHz · 5 V', esp: 'ESP32-S3', link: 'a serial link', note: 'The ESP32-S3 is also the USB bridge to the main chip by default.' },
    { id: 'arduino-uno-wifi-rev2', short: 'UNO WiFi Rev2', main: 'ATmega4809', sub: '8-bit AVR · 5 V', esp: 'NINA-W102 (ESP32)', link: 'SPI or serial', note: 'A small 8-bit main chip cannot buffer much of what the radio delivers.' },
    { id: 'arduino-nano-33-iot', short: 'Nano 33 IoT', main: 'Microchip SAMD21', sub: 'Cortex-M0+ · 48 MHz', esp: 'NINA-W102 (ESP32)', link: 'SPI or serial', note: 'Reprogramming the NINA firmware voids the radio certification.' },
    { id: 'arduino-mkr-wifi-1010', short: 'MKR WiFi 1010', main: 'Microchip SAMD21G18A', sub: 'Cortex-M0+ · 48 MHz', esp: 'NINA-W102 (ESP32)', link: 'SPI or serial', note: 'The charger needs at least 512 mA of supply.' },
    { id: 'arduino-nano-rp2040-connect', short: 'Nano RP2040 Connect', main: 'RP2040', sub: '2 × Cortex-M0+ · 133 MHz', esp: 'NINA-W102 (ESP32)', link: 'SPI or serial', note: 'The NINA also drives A4 to A7 and the RGB LED, so the RP2040 cannot.' },
    { id: 'arduino-portenta-c33', short: 'Portenta C33', main: 'Renesas RA6M5', sub: 'Cortex-M33 · 200 MHz', esp: 'ESP32-C3-MINI-1U', link: 'not stated in the catalogue', note: 'The ESP32-C3 is only the wireless co-processor.' },
    { id: 'adafruit-airlift-featherwing', short: 'AirLift FeatherWing', main: 'Your host board', sub: 'any Feather or UNO host', esp: 'ESP32 (AirLift)', link: 'SPI + CS, BUSY, RESET', note: 'Enterprise Wi-Fi is not supported, says Adafruit.' },
    { id: 'arduino-nano-esp32', short: 'Nano ESP32 (for contrast)', single: true, main: 'ESP32-S3 (NORA-W106)', sub: 'runs the sketch and the radio', esp: 'ESP32-S3', link: '', note: 'Here the ESP is the main chip: all of its pins, cores and ESP-NOW are yours.' }
  ];

  Hyper.sim('mb-main-vs-radio', {
    title: 'Main chip and radio chip',
    blurb: `On these boards the sketch runs on one chip and the Wi-Fi and Bluetooth stack runs on another. The bright box is **where your sketch runs**; the box beside it is the ESP, linked by the labelled arrow. Press **Send a web request** to follow one request from the sketch, over the link, through the radio to the router. The last board, the Nano ESP32, is the contrast: one chip does everything.

**Try this**
- Choose the **UNO R4 WiFi**: the main chip is a Renesas RA4M1 and the ESP32-S3 is only the radio and the USB bridge.
- Send a request and read the **step** line: the ESP's own firmware runs the TCP/IP and the TLS.
- Switch to the **AirLift FeatherWing**: any host can use it, because the link is plain SPI.
- Compare with the **Nano ESP32**: no link, no second chip.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 440 });
      let phase = 99;
      const ctl = kit.controls(box.side, [
        { id: 'board', type: 'select', label: 'Board', options: MR.map(q => [q.short, q.id]), value: MR.some(q => q.id === (params && params.board)) ? params.board : MR[0].id },
        { type: 'buttons', items: [{ id: 'send', label: 'Send a web request', primary: true }] }
      ], (id) => { if (id === 'send') { phase = 0; loop.start(); } else { phase = 99; loop.once(); } });
      const ro = kit.readout(box.side, [['run', 'Your sketch runs on'], ['radio', 'The radio chip'], ['link', 'The link'], ['role', 'The catalogue marks the ESP as'], ['step', 'Now'], ['watch', 'The catalogue warns']]);
      const loop = kit.loop(dt => {
        if (phase < 99) phase += dt;
        const c = st.begin(), C = kit.colors();
        const m = MR.find(q => q.id === ctl.values.board) || MR[0], b = E.board(m.id), chip = b ? E.chip(b.chip) : null;
        const steps = m.single
          ? ['your sketch calls the Wi-Fi library', 'the ESP32-S3 runs TCP/IP and TLS and transmits', 'the router answers']
          : ['your sketch calls the Wi-Fi library', 'the library sends a command over the link', 'the ESP runs TCP/IP and TLS and transmits', 'the router answers'];
        const wide = st.W >= 520, M = 12;
        const nBoxes = m.single ? 1 : 2;
        let pts = [], boxes = [];
        if (wide) {
          const bw = clamp((st.W - 2 * M - 120) / (nBoxes + 0.6), 110, 190), gap = nBoxes === 2 ? Math.min(90, (st.W - 2 * M - 2 * bw - 70) / 2) : 0, y = st.H * 0.30, bh = 76;
          boxes.push({ x: M, y, w: bw, h: bh });
          if (nBoxes === 2) boxes.push({ x: M + bw + gap, y, w: bw, h: bh });
          const last = boxes[boxes.length - 1];
          pts = boxes.map(q => [q.x + q.w / 2, q.y + q.h / 2]);
          pts.push([Math.min(st.W - 40, last.x + last.w + 64), y + bh / 2]);
        } else {
          const bw = Math.min(250, st.W - 40), bh = 56, x = (st.W - bw) / 2, gap = 44;
          for (let i = 0; i < nBoxes; i++) boxes.push({ x, y: 10 + i * (bh + gap), w: bw, h: bh });
          pts = boxes.map(q => [q.x + q.w / 2, q.y + q.h / 2]);
          pts.push([st.W / 2, 10 + nBoxes * (bh + gap) + 12]);
        }
        const mainBox = S.box(c, boxes[0].x, boxes[0].y, boxes[0].w, boxes[0].h, { label: fit(c, m.main, boxes[0].w - 12, 12.5, 600), sub: fit(c, m.sub, boxes[0].w - 12, 10.5, 500), color: C.accent, active: true });
        kit.label(c, 'your sketch runs here', mainBox.cx, boxes[0].y - 8, { size: 10, color: C.accent, align: 'center' });
        let espBox = null;
        if (nBoxes === 2) {
          const cores = chip ? chip.cores + (chip.cores === 1 ? ' core' : ' cores') + ' · ' + chip.mhz + ' MHz' : '';
          espBox = S.box(c, boxes[1].x, boxes[1].y, boxes[1].w, boxes[1].h, { label: fit(c, m.esp, boxes[1].w - 12, 12.5, 600), sub: fit(c, cores, boxes[1].w - 12, 10.5, 500), color: kit.hue(40) });
          kit.label(c, 'Wi-Fi and Bluetooth stack', espBox.cx, boxes[1].y - 8, { size: 10, color: C.warn, align: 'center' });
          // the link between the two chips
          S.wire(c, [mainBox.r, espBox.l], { color: C.text2 });
          const lx = (mainBox.r[0] + espBox.l[0]) / 2, ly = (mainBox.r[1] + espBox.l[1]) / 2;
          if (wide) kit.label(c, fit(c, m.link, Math.max(50, espBox.l[0] - mainBox.r[0] - 4), 10, 500), lx, ly - 10, { size: 10, color: C.text2, align: 'center' });
          else kit.label(c, m.link, lx + 8, ly, { size: 10, color: C.text2, align: 'left' });
        }
        // the router
        const last = pts[pts.length - 1], from = nBoxes === 2 ? espBox : mainBox;
        S.node(c, last[0], last[1], { kind: 'router', label: 'Router' });
        S.link(c, wide ? from.r[0] : from.b[0], wide ? from.r[1] : from.b[1], wide ? last[0] - 22 : last[0], wide ? last[1] : last[1] - 22, { wireless: true });
        // the request on its way
        const path = nBoxes === 2 ? [pts[0], pts[1], pts[2]] : [pts[0], pts[1]];
        if (phase < steps.length) {
          const f = clamp(phase / steps.length, 0, 0.999) * (path.length - 1), i = Math.floor(f), t = f - i;
          const a = path[i], z = path[Math.min(i + 1, path.length - 1)];
          kit.dot(c, a[0] + (z[0] - a[0]) * t, a[1] + (z[1] - a[1]) * t, 6, C.accent);
        }
        // the text under the picture
        const ty = wide ? boxes[0].y + boxes[0].h + 36 : last[1] + 50;
        const step = phase < steps.length ? steps[Math.floor(phase)] : 'idle: press the button';
        kit.label(c, 'Now: ' + step, M, Math.min(ty, st.H - 40), { size: 11.5, color: phase < steps.length ? C.accent : C.muted, weight: 600 });
        kit.label(c, fit(c, m.note, st.W - 2 * M, 10.5, 500), M, Math.min(ty + 20, st.H - 18), { size: 10.5, color: C.muted });
        ro.set('run', m.main + (m.sub ? ' (' + m.sub + ')' : ''));
        ro.set('radio', m.esp);
        ro.set('link', m.single ? 'none: one chip' : m.link);
        ro.set('role', b ? (b.role === 'co' ? 'a radio co-processor' : 'the main chip') : '—');
        ro.set('step', step);
        ro.set('watch', b && b.watch && b.watch[0] ? shorten(b.watch[0], 150) : '—');
        if (phase >= steps.length && phase < 99) { phase = 99; loop.stop(); }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ mb-chooser */
  const CH_MAKERS = ['Adafruit', 'SparkFun', 'Arduino', 'LOLIN (WEMOS)', 'Generic and clones', 'Unexpected Maker', 'DFRobot', 'Olimex'];
  const CH_TAGS = [['qwiic', 'Qwiic or STEMMA QT port', 'Qwiic'], ['battery', 'LiPo connector or charger', 'battery'], ['rgb', 'RGB LED', 'RGB'], ['display', 'a display on the board', 'display'], ['sd', 'microSD slot', 'SD'], ['eth', 'Ethernet', 'Ethernet'], ['relay', 'relays', 'relay'], ['tiny', 'thumb-sized', 'tiny']];
  const mbOf = v => { const m = /(\d+(?:\.\d+)?)\s*MB/i.exec(String(v == null ? '' : v)); return m ? +m[1] : null; };
  const hasPsram = b => !!b.psram && !/^\s*(none|no\b)/i.test(String(b.psram));

  Hyper.sim('mb-chooser', {
    title: 'A board chooser',
    blurb: `Tick what your project needs and the list shrinks to the boards of the catalogue that have it, from the eight makers of this topic. Boards where the ESP is only a radio co-processor are hidden unless you clear that box. The list is ordered by how popular the board is in the catalogue. **Click a board** for its details; the arrows page through long lists.

**Try this**
- Tick **LiPo connector or charger** and **Qwiic or STEMMA QT port**: the Feather and Thing Plus families remain.
- Add **microSD slot**: the list is down to a handful.
- Choose the **ESP32-C6** chip and watch which makers have one.
- Set the longest side to **30 mm** with *thumb-sized* ticked: the boards you could hide in a case.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.75, minH: 380, maxH: 520 });
      const pool = E.BOARDS.filter(b => CH_MAKERS.includes(b.maker));
      const chipIds = []; pool.forEach(b => { if (b.chip && !chipIds.includes(b.chip)) chipIds.push(b.chip); });
      chipIds.sort((a, z) => E.CHIPS.findIndex(c => c.id === a) - E.CHIPS.findIndex(c => c.id === z));
      let page = 0, sel = null, hits = [];
      const defs = [
        { id: 'maker', type: 'select', label: 'Maker', options: [['all eight makers', 'all']].concat(CH_MAKERS.map(m => [m, m])), value: 'all' },
        { id: 'chip', type: 'select', label: 'Chip', options: [['any chip', '']].concat(chipIds.map(id => [chipName(E, id), id])), value: '' }
      ].concat(CH_TAGS.map(t => ({ id: 't_' + t[0], type: 'check', label: t[1], value: false })), [
        { id: 'psram', type: 'check', label: 'has PSRAM', value: false },
        { id: 'flash', type: 'select', label: 'Flash', options: [['any size', 0], ['8 MB or more', 8], ['16 MB or more', 16]], value: 0 },
        { id: 'size', type: 'select', label: 'Longest side', options: [['any', 0], ['up to 30 mm', 30], ['up to 45 mm', 45], ['up to 60 mm', 60]], value: 0 },
        { id: 'main', type: 'check', label: 'hide boards where the ESP is only a radio', value: true },
        { type: 'buttons', items: [{ id: 'prev', label: '◀ Previous' }, { id: 'next', label: 'Next ▶' }] }
      ]);
      const ctl = kit.controls(box.side, defs, id => {
        if (id === 'prev') page = Math.max(0, page - 1); else if (id === 'next') page += 1; else page = 0;
        loop.once();
      });
      const ro = kit.readout(box.side, [['n', 'Boards that match'], ['name', 'Board'], ['chip', 'Chip and memory'], ['size', 'Size and USB'], ['good', 'Good for'], ['watch', 'Watch out']]);
      const matches = (b, v) => {
        if (v.main && b.role === 'co') return false;
        if (v.maker !== 'all' && b.maker !== v.maker) return false;
        if (v.chip && b.chip !== v.chip) return false;
        for (const t of CH_TAGS) if (v['t_' + t[0]] && !(b.has || []).includes(t[0])) return false;
        if (v.psram && !hasPsram(b)) return false;
        if (v.flash > 0) { const f = mbOf(b.flash); if (f == null || f < v.flash) return false; }
        if (v.size > 0) { const s = sizeOf(b); if (!s || s[1] > v.size) return false; }
        return true;
      };
      const memText = b => { const f = mbOf(b.flash), p = mbOf(b.psram); return (f != null ? f + ' MB flash' : 'flash not listed') + (hasPsram(b) ? ' + ' + (p != null ? p + ' MB ' : '') + 'PSRAM' : ''); };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const list = pool.filter(b => matches(b, v)).sort((a, z) => (isNum(z.pop) ? z.pop : 0) - (isNum(a.pop) ? a.pop : 0) || String(a.name).localeCompare(String(z.name)));
        const rh = 36, M = 10, top = 32, per = Math.max(1, Math.floor((st.H - top - 6) / rh)), pages = Math.max(1, Math.ceil(list.length / per));
        page = clamp(page, 0, pages - 1);
        kit.label(c, list.length + ' of ' + pool.length + ' boards match', M, 14, { size: 12.5, weight: 650 });
        kit.label(c, 'page ' + (page + 1) + ' of ' + pages, st.W - M, 14, { size: 10.5, color: C.muted, align: 'right' });
        hits = [];
        if (!list.length) kit.label(c, 'No board has all of that: relax one tick.', M, top + 20, { size: 12, color: C.muted });
        list.slice(page * per, page * per + per).forEach((b, i) => {
          const y = top + i * rh, on = b.id === sel, ch = E.chip(b.chip);
          c.fillStyle = on ? (C.dark ? 'rgba(123,140,255,.18)' : 'rgba(60,90,220,.10)') : (C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.035)');
          c.fillRect(M - 4, y, st.W - 2 * M + 8, rh - 3);
          if (on) { c.strokeStyle = C.accent; c.lineWidth = 1.5; c.strokeRect(M - 4, y, st.W - 2 * M + 8, rh - 3); }
          kit.label(c, fit(c, b.name, st.W - 2 * M - 4, 12, 650), M, y + 11, { size: 12, weight: 650 });
          const tags = CH_TAGS.filter(t => (b.has || []).includes(t[0])).map(t => t[2]).join(' · ');
          kit.label(c, fit(c, (ch ? chipName(E, b.chip) : str(b.chip)) + ' · ' + memText(b) + (tags ? ' · ' + tags : ''), st.W - 2 * M - 4, 10.5, 500), M, y + 25, { size: 10.5, color: C.muted });
          hits.push({ x: M - 4, y, w: st.W - 2 * M + 8, h: rh - 3, id: b.id });
        });
        const b = sel ? E.board(sel) : null;
        ro.set('n', list.length + ' of ' + pool.length);
        if (b) {
          const s = sizeOf(b), ch = E.chip(b.chip);
          ro.set('name', b.name.length > 44 ? shorten(b.name, 44) : b.name);
          ro.set('chip', (ch ? chipName(E, b.chip) : str(b.chip)) + ', ' + memText(b));
          ro.set('size', (s ? s.map(q => fmt(q, 1)).join(' × ') + ' mm' : 'size not listed') + ', ' + (b.usb && b.usb.conn ? shorten(b.usb.conn, 24) : 'USB not listed'));
          ro.set('good', b.good && b.good[0] ? shorten(b.good[0], 120) : '—');
          ro.set('watch', b.watch && b.watch[0] ? shorten(b.watch[0], 140) : '—');
        } else for (const k of ['name', 'chip', 'size', 'good', 'watch']) ro.set(k, '—');
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { sel = h.id; loop.once(); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ mb-poe-budget */
  // The rails of the two Olimex boards, from the catalogue: the POE-ISO's 5 V converter gives 400 mA (2 W); the POE2 gives
  // 0.75 A at 24 V or 1.5 A at 12 V (jumper), 1.5 A at 5 V and 1 A at 3.3 V, 25 W in total.
  const POE_BOARDS = { iso: { name: 'ESP32-POE-ISO', total: 2 }, poe2: { name: 'ESP32-POE2', total: 25 } };
  Hyper.sim('mb-poe-budget', {
    title: 'The power budget of a PoE board',
    blurb: `A PoE board turns the power of the network cable into a few rails, and each rail and the total have a limit. Set the loads you plan to hang on the board and the bars show what is left. The limits are the catalogue's figures for the **ESP32-POE-ISO** (a 5 V converter of 400 mA, which is 2 W) and the **ESP32-POE2** (5 V at 1.5 A, 3.3 V at 1 A, a 12 V or 24 V rail, and 25 W in total). The **board itself** is the ESP32 with Wi-Fi on, taken at the chip's peak transmit current from the catalogue and assumed to come from the 5 V rail: a teaching figure, because the Ethernet chip and the rest add to it. Conversion losses are not modelled.

**Try this**
- On the **POE-ISO** add a 5 V sensor board of 100 mA: nearly half of the 400 mA is gone already.
- Hang a 300 mA fan on the 5 V rail of the ISO: the bar turns red.
- On the **POE2** load all four rails to their limits: the rails add up to more than 25 W, so the total is what you hit first.
- Switch the variable rail from 12 V to 24 V: the same watts, half the current, but only 0.75 A is available.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320, maxH: 420 });
      const chip = E.chip('esp32'), boardMa = chip && isNum(chip.txMa) ? Math.round(chip.txMa) : 240;
      const ctl = kit.controls(box.side, [
        { id: 'board', type: 'select', label: 'Board', options: [['ESP32-POE-ISO (5 V, 400 mA)', 'iso'], ['ESP32-POE2 (25 W)', 'poe2']], value: 'iso' },
        { id: 'vv', type: 'select', label: 'Variable rail of the POE2', options: [['12 V, up to 1.5 A', 12], ['24 V, up to 0.75 A', 24]], value: 12 },
        { id: 'own', label: 'The board itself, at 5 V', min: 0, max: 600, step: 10, value: boardMa, unit: 'mA' },
        { id: 'l5', label: 'Other loads on 5 V', min: 0, max: 1600, step: 10, value: 100, unit: 'mA' },
        { id: 'l33', label: 'Loads on 3.3 V', min: 0, max: 1200, step: 10, value: 0, unit: 'mA' },
        { id: 'lv', label: 'Loads on the variable rail', min: 0, max: 1600, step: 10, value: 0, unit: 'mA' }
      ], () => { sync(); loop.once(); });
      const sync = () => { const iso = ctl.values.board === 'iso'; ctl.show('vv', !iso); ctl.show('l33', !iso); ctl.show('lv', !iso); };
      const ro = kit.readout(box.side, [['r5', '5 V rail'], ['r33', '3.3 V rail'], ['rv', 'Variable rail'], ['tot', 'Total power'], ['say', 'Verdict']]);
      const colour = (C, f) => (f > 1 ? C.bad : f > 0.8 ? C.warn : C.ok);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, iso = v.board === 'iso';
        const rails = [{ key: 'r5', name: '5 V', volts: 5, used: v.own + v.l5, max: iso ? 400 : 1500 }];
        if (!iso) {
          rails.push({ key: 'r33', name: '3.3 V', volts: 3.3, used: v.l33, max: 1000 });
          rails.push({ key: 'rv', name: v.vv + ' V', volts: v.vv, used: v.lv, max: v.vv === 12 ? 1500 : 750 });
        }
        const watts = rails.reduce((a, r) => a + r.volts * r.used / 1000, 0), budget = POE_BOARDS[iso ? 'iso' : 'poe2'].total;
        const M = 12, lw = 46, bw = st.W - 2 * M - lw - 96, bh = 22;
        kit.label(c, POE_BOARDS[iso ? 'iso' : 'poe2'].name + ': what each rail can give', M, 14, { size: 12.5, weight: 650 });
        const problems = [];
        rails.forEach((r, i) => {
          const y = 38 + i * 50, f = r.used / r.max;
          kit.label(c, r.name, M, y + bh / 2, { size: 12, weight: 650 });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(M + lw, y, bw, bh);
          c.fillStyle = colour(C, f); c.fillRect(M + lw, y, Math.min(bw, bw * f), bh);
          kit.label(c, Math.round(r.used) + ' of ' + r.max + ' mA', M + lw + bw + 8, y + bh / 2, { size: 11, color: f > 1 ? C.bad : C.text2, weight: f > 1 ? 700 : 500 });
          kit.label(c, fmt(r.volts * r.used / 1000, 2) + ' W at ' + r.name, M + lw, y + bh + 11, { size: 10, color: C.muted });
          if (f > 1) problems.push('the ' + r.name + ' rail is over by ' + Math.round(r.used - r.max) + ' mA');
          ro.set(r.key, Math.round(r.used) + ' of ' + r.max + ' mA (' + fmt(f * 100, 0) + ' %)');
        });
        if (iso) { ro.set('r33', 'not on this board'); ro.set('rv', 'not on this board'); }
        const ty = 38 + rails.length * 50 + 6, tf = watts / budget;
        kit.label(c, 'Total', M, ty + bh / 2, { size: 12, weight: 650 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(M + lw, ty, bw, bh);
        c.fillStyle = colour(C, tf); c.fillRect(M + lw, ty, Math.min(bw, bw * tf), bh);
        kit.label(c, fmt(watts, 1) + ' of ' + budget + ' W', M + lw + bw + 8, ty + bh / 2, { size: 11, color: tf > 1 ? C.bad : C.text2, weight: tf > 1 ? 700 : 500 });
        if (tf > 1) problems.push('the total of ' + fmt(watts, 1) + ' W is over the ' + budget + ' W budget');
        const sum = rails.reduce((a, r) => a + r.volts * r.max / 1000, 0);
        kit.label(c, iso ? 'one rail: its limit is the whole budget' : 'the rails together could give ' + fmt(sum, 1) + ' W, the total allows ' + budget + ' W', M + lw, ty + bh + 13, { size: 10, color: C.muted });
        ro.set('tot', fmt(watts, 1) + ' of ' + budget + ' W');
        ro.set('say', problems.length ? 'Too much: ' + problems.join('; ') : (tf > 0.8 ? 'Fits, but with little room to spare' : 'Fits'));
      }, box.stage);
      sync();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ mb-sleep-life */
  // Deep-sleep currents in microamps as the makers published them (collected from the catalogue's notes on each board).
  const SLEEP = [
    { name: 'TinyPICO', ua: 19, g: 'um', note: 'about 18 to 20 µA (Unexpected Maker)' },
    { name: 'TinyPICO Nano', ua: 18, g: 'um', note: 'about 18 µA (Unexpected Maker)' },
    { name: 'Feather ESP32 V2', ua: 70, g: 'um', note: 'about 70 µA from a LiPoly (Adafruit)' },
    { name: 'Feather ESP32-S3 (4 MB)', ua: 100, g: 'um', note: 'about 100 µA (Adafruit)' },
    { name: 'Olimex ESP32-DevKit-LiPo', ua: 10, g: 'um', note: 'about 10 µA (Olimex)' },
    { name: 'ESP32 chip alone', chip: 'esp32', g: 'um', note: 'the catalogue\'s figure for the chip' },
    { name: 'FireBeetle 2 C6, V1.0', ua: 16, g: 'df', note: '16 µA on hardware revision V1.0 (DFRobot)' },
    { name: 'FireBeetle 2 C6, V1.2', ua: 36, g: 'df', note: '36 µA on hardware revision V1.2 (DFRobot)' },
    { name: 'Beetle C6, V1.0', ua: 14, g: 'df', note: '14 µA on hardware revision V1.0 (DFRobot)' },
    { name: 'Beetle C6, V1.1', ua: 37, g: 'df', note: '37 µA on hardware revision V1.1 (DFRobot)' },
    { name: 'FireBeetle 2 C5', ua: 21, g: 'df', note: '21 µA (DFRobot)' },
    { name: 'ESP32-C6 chip alone', chip: 'esp32-c6', g: 'df', note: 'the catalogue\'s figure for the chip' },
    { name: 'Olimex ESP32-H2-DevKit-LiPo', ua: 10, g: 'all', note: '10 µA (Olimex)' },
    { name: 'Olimex ESP32-S2-DevKit-LiPo-USB', ua: 20, g: 'all', note: '20 µA, and 65 µA with the WROVER (Olimex)' },
    { name: 'Olimex ESP32-S3-DevKit-LiPo', ua: 200, g: 'all', note: 'about 200 µA, only when powered from the LiPo connector (Olimex)' },
    { name: 'Olimex ESP32-POE', ua: 200, g: 'all', note: 'about 200 µA (Olimex)' }
  ];
  const lifeText = d => (!isNum(d) ? '—' : d < 60 ? fmt(d, 0) + ' days' : d < 700 ? fmt(d / 30.4, 1) + ' months' : fmt(d / 365, 1) + ' years');

  Hyper.sim('mb-sleep-life', {
    title: 'Battery life from the sleep current of a board',
    blurb: `A sensor wakes, works for a few seconds and sleeps again. The bars show how long one cell lasts on each board, on a logarithmic scale from one day to ten years, using the deep-sleep current that the maker publishes for that board (or the chip's own figure). **Click a bar** for the arithmetic. The sleep currents come from the board notes of the catalogue and belong to one revision of each board; the active current and the usable 85 % of the cell are teaching figures.

**Try this**
- Leave the settings alone and compare the TinyPICO with the Feather: at one wake every 15 minutes the sleep current barely matters, because the **awake time** dominates.
- Stretch the interval to 24 hours: now the sleep current decides, and the boards fan out over years.
- In the DFRobot set, put the V1.0 and V1.2 revisions side by side at a long interval: the revision costs months.
- Shorten the awake time to half a second and watch the order of the bars change.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 340, maxH: 480 });
      let sel = 0, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'group', type: 'select', label: 'Boards', options: [['Unexpected Maker against others', 'um'], ['DFRobot revisions', 'df'], ['everything in the list', 'all']], value: params && (params.group === 'df' || params.group === 'all') ? params.group : 'um' },
        { id: 'mah', label: 'Cell capacity', min: 100, max: 5000, value: 1000, unit: 'mAh', log: true, sig: 2 },
        { id: 'every', label: 'Wake every', min: 1, max: 1440, value: 15, unit: 'min', log: true, sig: 2 },
        { id: 'awake', label: 'Awake for', min: 0.5, max: 60, value: 5, unit: 's', log: true, sig: 2 },
        { id: 'act', label: 'Current while awake', min: 10, max: 300, step: 5, value: 80, unit: 'mA' }
      ], id => { if (id === 'group') sel = 0; loop.once(); });
      const ro = kit.readout(box.side, [['name', 'Board'], ['sleep', 'Deep-sleep current'], ['avg', 'Average current'], ['life', 'Battery life'], ['share', 'Share of the charge spent asleep'], ['note', 'Source']]);
      const entries = g => SLEEP.filter(e => g === 'all' || e.g === g).map(e => {
        const ch = e.chip ? E.chip(e.chip) : null;
        return Object.assign({}, e, { ua: e.chip ? (ch && isNum(ch.sleepUa) ? ch.sleepUa : null) : e.ua });
      }).filter(e => isNum(e.ua));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const list = entries(v.group);
        if (!list.length) return;
        sel = clamp(sel, 0, list.length - 1);
        const period = v.every * 60, awake = Math.min(v.awake, period * 0.95);
        const calc = e => {
          const avg = (v.act * awake + (e.ua / 1000) * (period - awake)) / period;
          const life = E.batteryLife(v.mah, avg, { usable: 0.85 });
          return { avg, days: life && isNum(life.days) ? life.days : null, sleepShare: (e.ua / 1000) * (period - awake) / (avg * period) };
        };
        const M = 10, nameW = clamp(st.W * 0.36, 100, 190), valW = 70, bw = st.W - 2 * M - nameW - valW;
        const rh = clamp((st.H - 70) / list.length, 20, 34), top = 24;
        kit.label(c, 'one cell of ' + fmt(v.mah, 0) + ' mAh, a wake every ' + fmt(v.every, 0) + ' min of ' + fmt(awake, 1) + ' s', M, 11, { size: 11, color: C.muted });
        hits = [];
        list.forEach((e, i) => {
          const y = top + i * rh, r = calc(e), on = i === sel, f = r.days ? clamp(Math.log10(Math.max(1, r.days)) / Math.log10(3650), 0, 1) : 0;
          if (on) { c.fillStyle = C.dark ? 'rgba(123,140,255,.16)' : 'rgba(60,90,220,.10)'; c.fillRect(M - 4, y, st.W - 2 * M + 8, rh - 2); }
          kit.label(c, fit(c, e.name, nameW - 6, 10.5, on ? 650 : 500), M, y + rh / 2, { size: 10.5, weight: on ? 650 : 500, color: on ? C.accent : C.text });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(M + nameW, y + 3, bw, rh - 8);
          c.fillStyle = e.chip ? C.faint : kit.hue(e.g === 'df' ? 150 : e.g === 'um' ? 28 : 212, 0.85); c.fillRect(M + nameW, y + 3, Math.max(2, bw * f), rh - 8);
          kit.label(c, lifeText(r.days), M + nameW + bw + 6, y + rh / 2, { size: 10.5, color: C.text2 });
          hits.push({ x: M - 4, y, w: st.W - 2 * M + 8, h: rh, i });
        });
        const ay = top + list.length * rh + 8;
        [1, 10, 100, 1000].forEach(d => { const x = M + nameW + bw * Math.log10(d) / Math.log10(3650); kit.label(c, d === 1 ? '1 day' : d === 10 ? '10' : d === 100 ? '100' : '1000', x, ay + 4, { size: 9, color: C.faint, align: 'center' }); });
        kit.label(c, 'grey: the chip alone', M, ay + 20, { size: 10, color: C.faint });
        const e = list[sel], r = calc(e);
        ro.set('name', e.name);
        ro.set('sleep', fmt(e.ua, 0) + ' µA');
        ro.set('avg', r.avg >= 1 ? fmt(r.avg, 2) + ' mA' : fmt(r.avg * 1000, 0) + ' µA');
        ro.set('life', lifeText(r.days));
        ro.set('share', fmt(r.sleepShare * 100, 0) + ' %' + (r.sleepShare < 0.2 ? ': the awake time sets the life' : r.sleepShare > 0.6 ? ': the sleep current sets the life' : ''));
        ro.set('note', e.note);
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { sel = h.i; loop.once(); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
