/* HYPER-ESP32 · sims/m5stack-family.js
 *
 *   m5-family-chart     the 68 catalogued M5Stack products as a chart: product line against chip, or screen against battery
 *   m5-core-layers      a Core pulled apart into its layers, with what the catalogue says each holds
 *   m5-grove-ports      the red, black and blue ports of a controller and whether a unit type suits each, from the pin database
 *   m5-virtual-core2    a Core2-style screen and three keys: M5.update(), edges, a loop that blocks
 *   m5-chooser          which M5Stack for a project: filters the catalogue by needs
 *   m5-mbus-pins        the 30 pins of the M-Bus and who already uses each one
 *   m5-p4-blocks        the three ESP32-P4 products: where the radio, the display and the camera attach
 *
 * Every product fact is read from the board catalogue at run time (Hyper.esp, 68 M5Stack records read from
 * docs.m5stack.com on 2026-10-04); the drawing is schematic.
 */
(function () {
  'use strict';

  /* ================================================================ shared helpers */
  const MAKER = 'M5Stack';
  const CHIP_HUE = { 'esp32': 215, 'esp32-s3': 150, 'esp32-c3': 40, 'esp32-c5': 20, 'esp32-c6': 300, 'esp32-c61': 270, 'esp32-h2': 95, 'esp32-p4': 350 };
  const CHIP_SHORT = { 'esp32': 'ESP32', 'esp32-s3': 'S3', 'esp32-c3': 'C3', 'esp32-c5': 'C5', 'esp32-c6': 'C6', 'esp32-c61': 'C61', 'esp32-h2': 'H2', 'esp32-p4': 'P4' };
  const CHIP_ORDER = ['esp32', 'esp32-s3', 'esp32-c3', 'esp32-c5', 'esp32-c6', 'esp32-c61', 'esp32-h2', 'esp32-p4'];
  const shortName = b => String(b.name || b.id).replace(/^M5Stack\s+/i, '').replace(/^M5/, 'M5').replace(/\s*\(.*\)\s*$/, '');
  const clip = (s, n) => { s = String(s == null ? '' : s); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; };
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const font = size => size + 'px system-ui, "Segoe UI", sans-serif';

  /* the screen of a record: { has, w, h, diag } read from its display string */
  function screenOf(b) {
    const d = b.display || '';
    const m = /(\d{2,4})\s*[×x]\s*(\d{2,4})/.exec(d), g = /([\d.]+)\s*″/.exec(d);
    return { has: !!d && !!m, led: !!d && !m, w: m ? +m[1] : 0, h: m ? +m[2] : 0, diag: g ? +g[1] : 0 };
  }
  const mahOf = b => { const m = /(\d+)\s*mAh/.exec(b.battery || ''); return m ? +m[1] : 0; };
  const hasBattery = b => !!b.battery;
  const hasCamera = b => (b.has || []).indexOf('camera') >= 0;
  const hasPsram = b => !!b.psram;
  /* word-wrap for canvas text */
  function wrapText(c, str, maxW, size) {
    c.save(); c.font = font(size);
    const words = String(str).split(/\s+/), out = [];
    let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (c.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
    }
    if (line) out.push(line);
    c.restore();
    return out;
  }
  function rrect(c, x, y, w, h, r) { c.beginPath(); r = Math.max(0, Math.min(r, w / 2, h / 2)); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); }

  /* the product lines drawn as rows of the chart */
  const LINES = [
    ['Core', ['Core']], ['Core2', ['Core2']], ['CoreS3', ['CoreS3']], ['Stick', ['Stick']], ['Atom', ['Atom']], ['AtomS3', ['AtomS3']], ['Stamp', ['Stamp']],
    ['Cardputer', ['Cardputer']], ['Dial · Din · Capsule · Watch', ['Dial', 'Din', 'Capsule', 'Watch']], ['Paper', ['Paper']], ['Tab · Unit · LLM', ['Tab', 'Unit', 'LLM']],
    ['Nano', ['Nano']], ['Camera', ['Camera']], ['Station · StackChan · Card', ['Station', 'StackChan', 'Card']]
  ];
  const lineIndex = fam => { const i = LINES.findIndex(l => l[1].indexOf(fam) >= 0); return i < 0 ? LINES.length - 1 : i; };

  /* ================================================================ m5-family-chart */
  Hyper.sim('m5-family-chart', {
    title: 'The M5Stack family as a chart',
    blurb: `Every dot is one of the 68 M5Stack products in [the board catalogue](#/tools/boards?maker=M5Stack). **Filled** dots have a screen, **hollow** ones none; a **green ring** means a battery is built in. The chart is drawn from the catalogue at run time.

**Try this**
- In *product line against chip*, find the lines that have only one chip (Atom, Paper) and the line spread over three chips (Stamp).
- Use **Show** to keep only products with a screen, a battery, PSRAM or a camera, and watch which lines survive.
- Switch to *screen against battery*: the Tab5 sits far up and to the right, the Atoms are absent because they have no battery or no screen.
- Move over a dot, or tap it, to read the record.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 420, maxH: 640 });
      const recs = E.family(MAKER).map(b => ({ b, id: b.id, name: shortName(b), chip: b.chip, line: lineIndex(b.family), scr: screenOf(b), mah: mahOf(b) }));
      let sel = null, pts = [];
      const keep = { all: () => true, screen: r => r.scr.has, battery: r => hasBattery(r.b), both: r => r.scr.has && hasBattery(r.b), psram: r => hasPsram(r.b), camera: r => hasCamera(r.b) };
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['Product line against chip', 'grid'], ['Screen size against battery', 'scatter']], value: 'grid' },
        { id: 'show', type: 'select', label: 'Show', options: [['All products', 'all'], ['With a screen', 'screen'], ['With a battery', 'battery'], ['Screen and battery', 'both'], ['With PSRAM', 'psram'], ['With a camera or camera port', 'camera']], value: 'all' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['shown', 'Products shown'], ['sel', 'Selected'], ['chip', 'Chip'], ['scr', 'Screen'], ['bat', 'Battery']]);
      const showSel = () => {
        if (!sel) { ro.set('sel', '—'); ro.set('chip', '—'); ro.set('scr', '—'); ro.set('bat', '—'); return; }
        const b = sel.b, ch = E.chip(b.chip);
        ro.set('sel', b.name); ro.set('chip', (ch ? ch.name : b.chip) + (b.psram ? ' · PSRAM ' + b.psram : ''));
        ro.set('scr', clip(b.display || 'none', 60)); ro.set('bat', clip(b.battery || 'none', 60));
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10;
        const f = keep[ctl.values.show] || keep.all;
        pts = [];
        if (ctl.values.view === 'grid') {
          const labW = Math.min(118, W * 0.25), top = 34, legendH = 38, cols = CHIP_ORDER.length;
          const cw = (W - M - labW - M) / cols;
          // cells
          const cells = LINES.map(() => CHIP_ORDER.map(() => []));
          recs.forEach(r => { const j = CHIP_ORDER.indexOf(r.chip); if (j >= 0) cells[r.line][j].push(r); });
          // pick a dot spacing so that all rows fit
          let sp = 13, rowH = [];
          for (; sp >= 7; sp--) {
            const dpr = Math.max(1, Math.floor((cw - 6) / sp));
            rowH = cells.map(row => 12 + sp * Math.max(1, ...row.map(cell => Math.ceil(cell.length / dpr))));
            if (rowH.reduce((a, v) => a + v, 0) <= H - top - legendH) break;
          }
          const total = rowH.reduce((a, v) => a + v, 0), k = Math.min(1, (H - top - legendH) / total);
          const dpr = Math.max(1, Math.floor((cw - 6) / sp)), r0 = sp * 0.36;
          CHIP_ORDER.forEach((id, j) => {
            const x = M + labW + j * cw;
            kit.label(c, CHIP_SHORT[id], x + cw / 2, 16, { size: 11.5, weight: 650, align: 'center', color: kit.hue(CHIP_HUE[id]) });
            c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x, top - 6); c.lineTo(x, top + total * k); c.stroke();
          });
          let y = top;
          LINES.forEach((ln, i) => {
            const h = rowH[i] * k;
            c.strokeStyle = C.grid; c.beginPath(); c.moveTo(M, y); c.lineTo(W - M, y); c.stroke();
            const nl = wrapText(c, ln[0], labW - 8, 10.5).slice(0, 2);
            nl.forEach((t, q) => kit.label(c, t, M, y + h / 2 + (q - (nl.length - 1) / 2) * 11.5, { size: 10.5, color: C.text2, align: 'left' }));
            CHIP_ORDER.forEach((id, j) => {
              cells[i][j].forEach((r, n) => {
                const px = M + labW + j * cw + 8 + (n % dpr) * sp, py = y + (6 + sp / 2 + Math.floor(n / dpr) * sp) * k;
                const on = f(r);
                c.save(); c.globalAlpha = on ? 1 : 0.14;
                c.beginPath(); c.arc(px, py, r0, 0, 6.2832);
                if (r.scr.has || r.scr.led) { c.fillStyle = kit.hue(CHIP_HUE[id]); c.fill(); } else { c.strokeStyle = kit.hue(CHIP_HUE[id]); c.lineWidth = 1.6; c.stroke(); }
                if (hasBattery(r.b)) { c.beginPath(); c.arc(px, py, r0 + 2.6, 0, 6.2832); c.strokeStyle = C.ok; c.lineWidth = 1.3; c.stroke(); }
                if (sel === r) { c.beginPath(); c.arc(px, py, r0 + 5, 0, 6.2832); c.strokeStyle = C.text; c.lineWidth = 1.6; c.stroke(); }
                c.restore();
                pts.push({ x: px, y: py, r: r0 + 4, rec: r });
              });
            });
            y += h;
          });
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(M, y); c.lineTo(W - M, y); c.stroke();
          // legend
          const ly = H - 20;
          c.fillStyle = C.muted; c.beginPath(); c.arc(M + 8, ly, 4.5, 0, 6.2832); c.fill();
          kit.label(c, 'has a screen', M + 18, ly, { size: 10.5, color: C.muted, align: 'left' });
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.arc(M + 108, ly, 4.5, 0, 6.2832); c.stroke();
          kit.label(c, 'no screen', M + 118, ly, { size: 10.5, color: C.muted, align: 'left' });
          c.strokeStyle = C.ok; c.beginPath(); c.arc(M + 196, ly, 6.5, 0, 6.2832); c.stroke();
          kit.label(c, 'battery built in', M + 206, ly, { size: 10.5, color: C.muted, align: 'left' });
        } else {
          const px0 = 58, py0 = 14, pw = W - px0 - 16, ph = H - py0 - 62;
          const xl = v => Math.log10(v), X = v => px0 + (xl(clamp(v, 2000, 1.3e6)) - xl(2000)) / (xl(1.3e6) - xl(2000)) * pw, Y = v => py0 + ph - (Math.log10(clamp(v, 80, 2800)) - Math.log10(80)) / (Math.log10(2800) - Math.log10(80)) * ph;
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(px0, py0); c.lineTo(px0, py0 + ph); c.lineTo(px0 + pw, py0 + ph); c.stroke();
          [[1e4, '10 k'], [1e5, '100 k'], [1e6, '1 M']].forEach(([v, t]) => { c.strokeStyle = C.grid; c.beginPath(); c.moveTo(X(v), py0); c.lineTo(X(v), py0 + ph); c.stroke(); kit.label(c, t, X(v), py0 + ph + 12, { size: 10.5, color: C.muted, align: 'center' }); });
          [[100, '100'], [300, '300'], [1000, '1000'], [2000, '2000']].forEach(([v, t]) => { c.strokeStyle = C.grid; c.beginPath(); c.moveTo(px0, Y(v)); c.lineTo(px0 + pw, Y(v)); c.stroke(); kit.label(c, t, px0 - 6, Y(v), { size: 10.5, color: C.muted, align: 'right' }); });
          kit.label(c, 'screen pixels (log scale)', px0 + pw / 2, py0 + ph + 28, { size: 11, color: C.text2, align: 'center' });
          kit.label(c, 'battery, mAh (log scale)', 12, py0 + 6, { size: 11, color: C.text2, align: 'left' });
          let drawn = 0;
          recs.forEach((r, i) => {
            if (!(r.scr.has && r.mah)) return;
            const jx = 1 + (((i * 7) % 9) - 4) * 0.013, jy = 1 + (((i * 5) % 7) - 3) * 0.015;
            const x = X(r.scr.w * r.scr.h * jx), y = Y(r.mah * jy), on = f(r);
            c.save(); c.globalAlpha = on ? 0.95 : 0.14;
            c.beginPath(); c.arc(x, y, 5.2, 0, 6.2832); c.fillStyle = kit.hue(CHIP_HUE[r.chip] != null ? CHIP_HUE[r.chip] : 200); c.fill();
            c.lineWidth = 1; c.strokeStyle = C.bg2; c.stroke();
            if (sel === r) { c.beginPath(); c.arc(x, y, 9, 0, 6.2832); c.strokeStyle = C.text; c.lineWidth = 1.6; c.stroke(); }
            c.restore();
            pts.push({ x, y, r: 9, rec: r }); drawn++;
          });
          // legend of chips
          let lx = px0;
          CHIP_ORDER.forEach(id => {
            if (!recs.some(r => r.chip === id && r.scr.has && r.mah)) return;
            c.fillStyle = kit.hue(CHIP_HUE[id]); c.beginPath(); c.arc(lx + 5, H - 12, 4.5, 0, 6.2832); c.fill();
            kit.label(c, CHIP_SHORT[id], lx + 13, H - 12, { size: 10.5, color: C.muted, align: 'left' });
            lx += 22 + CHIP_SHORT[id].length * 6.5;
          });
          kit.label(c, drawn + ' of ' + recs.length + ' have both a pixel count and a mAh figure', W - 16, H - 12, { size: 10, color: C.faint, align: 'right' });
        }
        ro.set('shown', recs.filter(f).length + ' of ' + recs.length);
        showSel();
      }, box.stage);
      const pick = e => {
        const p = st.pos(e); let best = null, bd = 1e9;
        for (const q of pts) { const d = Math.hypot(p.x - q.x, p.y - q.y); if (d <= q.r + 3 && d < bd) { best = q; bd = d; } }
        return best;
      };
      st.canvas.addEventListener('pointermove', e => { const q = pick(e); if (q && q.rec !== sel) { sel = q.rec; loop.once(); } });
      kit.click(st, p => { let best = null, bd = 1e9; for (const q of pts) { const d = Math.hypot(p.x - q.x, p.y - q.y); if (d <= q.r + 6 && d < bd) { best = q; bd = d; } } if (best) { sel = best.rec; loop.once(); } }, p => pts.some(q => Math.hypot(p.x - q.x, p.y - q.y) <= q.r + 6));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ m5-core-layers */
  const CORES = [['Core Basic v2.7', 'm5stack-core-basic-v2-7'], ['Core2', 'm5stack-core2'], ['CoreS3', 'm5stack-cores3'], ['Fire v2.7', 'm5stack-core-fire-v2-7']];
  const SPEAKERISH = /speaker|amplifier|NS4168|AW88298/i, KEYISH = /button|key/i;
  function mbusUse(E, b) {
    const used = {}, gp = [];
    Object.keys(b.pins || {}).forEach(k => { const v = b.pins[k]; if (typeof v === 'number') (used[v] = used[v] || []).push(k); });
    (b.headers || []).forEach(h => (h.pins || []).forEach(p => { const q = E.parsePin(p); if (q && q.gpio != null) gp.push(q.gpio); }));
    return { used, gpios: gp, inUse: gp.filter(g => used[g]).length };
  }
  Hyper.sim('m5-core-layers', {
    title: 'A Core, layer by layer',
    blurb: `A Core pulled apart: the front with the screen and keys, the core board with the ESP32, the M-Bus connector, the bottom with the battery, and an optional stacked module. The **list of parts** on every layer is read from [the board catalogue](#/tools/boards?maker=M5Stack); which layer a part sits on is schematic.

**Try this**
- Slide **Pull apart** to separate the layers, then tap a layer (or its label) to read its entry.
- Switch between the **Core Basic**, the **Core2** and the **CoreS3**: the chip, the memory, the power parts and the battery change.
- Tick **Stack a module** and read how many of the M-Bus pins the Core already uses itself.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 380, maxH: 520 });
      let sel = 'board', hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Controller', options: CORES, value: 'm5stack-core2' },
        { id: 'pull', label: 'Pull apart', min: 0, max: 1, step: 0.02, value: 0.6 },
        { id: 'mod', type: 'check', label: 'Stack a module', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['layer', 'Layer'], ['what', 'What the catalogue says']]);
      function layers(b) {
        const ch = E.chip(b.chip), u = mbusUse(E, b);
        const ons = (b.onboard || []);
        const keys = ons.filter(x => KEYISH.test(x) && !SPEAKERISH.test(x));
        const speaker = ons.filter(x => SPEAKERISH.test(x));
        const rest = ons.filter(x => !SPEAKERISH.test(x) && !keys.includes(x));
        const L = [
          { id: 'front', title: 'Front: screen, keys', hue: 200, h: 14, lines: [b.display || 'no screen listed'].concat(keys.length ? keys : ((b.has || []).indexOf('touch') >= 0 ? ['touch zones under the screen act as keys'] : [])) },
          { id: 'board', title: 'Core board', hue: 150, h: 12, lines: [(ch ? ch.name : b.chip) + ' · ' + (b.part || ''), 'Flash ' + (b.flash || '?') + ' · ' + (b.psram ? 'PSRAM ' + b.psram : 'no PSRAM')].concat(rest.slice(0, 7)) },
          { id: 'mbus', title: 'M-Bus connector', hue: 40, h: 9, lines: ['30 pins in two columns of fifteen: ground, 5 V, 3.3 V, battery, reset, SPI, I2C, serial, DAC, ADC and GPIO', u.inUse + ' of its ' + u.gpios.length + ' GPIO pins are already used by the Core\'s own parts'] },
          { id: 'bottom', title: 'Bottom: battery', hue: 10, h: 24, lines: [b.battery || 'no battery listed'].concat(speaker) }
        ];
        if (ctl.values.mod) L.push({ id: 'module', title: 'Stacked module', hue: 290, h: 14, lines: ['Plugs onto the M-Bus and claims some of the 30 pins', 'Whatever it claims must not be a pin the Core already drives (' + u.inUse + ' of ' + u.gpios.length + ' are in use here)'].concat(/core2$/.test(b.id) ? ['Core2 v1.3: the battery bottom must be removed to stack M-Bus modules'] : [])});
        return L;
      }
      function slab(c, C, x, y, w, h, d, hue, active, dash) {
        const dk = C.dark, fill = dk ? 'hsl(' + hue + ' 40% 28%)' : 'hsl(' + hue + ' 60% 86%)', top = dk ? 'hsl(' + hue + ' 42% 38%)' : 'hsl(' + hue + ' 62% 93%)', side = dk ? 'hsl(' + hue + ' 40% 20%)' : 'hsl(' + hue + ' 50% 74%)', line = dk ? 'hsl(' + hue + ' 65% 62%)' : 'hsl(' + hue + ' 60% 38%)';
        c.save();
        c.lineJoin = 'round'; c.lineWidth = active ? 2.4 : 1.3; c.strokeStyle = active ? C.text : line;
        if (dash) c.setLineDash([5, 4]);
        c.fillStyle = side; c.beginPath(); c.moveTo(x + w, y); c.lineTo(x + w + d, y - d * 0.5); c.lineTo(x + w + d, y - d * 0.5 + h); c.lineTo(x + w, y + h); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = top; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w + d, y - d * 0.5); c.lineTo(x + d, y - d * 0.5); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = fill; c.beginPath(); c.rect(x, y, w, h); c.fill(); c.stroke();
        c.restore();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, b = E.board(ctl.values.model);
        if (!b) return;
        const L = layers(b), n = L.length;
        if (!L.some(l => l.id === sel)) sel = 'board';
        const slabW = Math.min(170, W * 0.33), d = Math.min(46, slabW * 0.28), x0 = 18, gap = 6 + ctl.values.pull * 50;
        const total = L.reduce((a, l) => a + l.h, 0) + gap * (n - 1);
        let y = Math.max(34 + d * 0.5, (H - total) / 2 + d * 0.3);
        hits = [];
        const labX = x0 + slabW + d + 38, labW = Math.max(110, W - labX - 10), lh = (H - 16) / n;
        // bottom layer is drawn first so that upper layers overlap it
        const ys = [];
        L.forEach(l => { ys.push(y); y += l.h + gap; });
        for (let i = n - 1; i >= 0; i--) {
          const l = L[i], yy = ys[i];
          slab(c, C, x0, yy, slabW, l.h, d, l.hue, sel === l.id, l.id === 'module');
          if (l.id === 'front') { const sx = x0 + d * 0.28 + slabW * 0.12, sy = yy - d * 0.32; c.fillStyle = C.dark ? '#0b1020' : '#1a2030'; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + slabW * 0.76, sy); c.lineTo(sx + slabW * 0.76 + d * 0.5, sy - d * 0.25); c.lineTo(sx + d * 0.5, sy - d * 0.25); c.closePath(); c.fill(); }
          if (l.id === 'mbus') { c.fillStyle = C.warn; for (let k = 0; k < 15; k++) { c.beginPath(); c.arc(x0 + 8 + k * (slabW - 16) / 14, yy + l.h / 2, 1.8, 0, 6.2832); c.fill(); } }
          hits.push({ id: l.id, x: x0, y: yy - d * 0.5, w: slabW + d, h: l.h + d * 0.5 });
        }
        // labels with leader lines
        L.forEach((l, i) => {
          const ly = 8 + i * lh, active = sel === l.id, mid = ys[i] + l.h / 2;
          c.strokeStyle = active ? C.text : C.faint; c.lineWidth = active ? 1.6 : 1;
          c.beginPath(); c.moveTo(x0 + slabW + d + 2, mid - d * 0.25); c.lineTo(labX - 8, ly + 10); c.stroke();
          kit.label(c, clip(l.title, Math.max(10, Math.floor(labW / 6.9))), labX, ly + 10, { size: 12, weight: 650, color: active ? C.text : C.text2, align: 'left' });
          const ls = [];
          l.lines.forEach(t => wrapText(c, t, labW, 10.5).forEach(w => ls.push(w)));
          ls.slice(0, 3).forEach((w, k) => kit.label(c, k === 2 && ls.length > 3 ? clip(w, 40) + '…' : w, labX, ly + 25 + k * 13, { size: 10.5, color: C.muted, align: 'left' }));
          hits.push({ id: l.id, x: labX - 4, y: ly, w: labW + 8, h: lh });
        });
        const cur = L.find(l => l.id === sel);
        ro.set('layer', cur.title); ro.set('what', cur.lines.join(' · '));
      }, box.stage);
      kit.click(st, p => { const h = hits.slice().reverse().find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { sel = h.id; loop.once(); } }, p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ m5-grove-ports */
  const PORT_INFO = { A: ['red', '#c0392b', 'I2C'], B: ['black', '#2b2f3a', 'GPIO · analogue'], C: ['blue', '#2f6fdb', 'UART'] };
  const UNITS = [['I2C unit (a sensor or display)', 'i2c'], ['Analogue sensor (a voltage)', 'analog'], ['UART unit (a GPS or serial module)', 'uart'], ['Button (a digital input)', 'button'], ['Relay or LED (a digital output)', 'relay'], ['Servo (a PWM output)', 'servo']];
  const UNIT_HOME = { i2c: 'A', analog: 'B', uart: 'C', button: 'B', relay: 'B', servo: 'B' };
  const GROVE_CONTROLLERS = [['Core Basic v2.7', 'm5stack-core-basic-v2-7'], ['Core2', 'm5stack-core2'], ['CoreS3', 'm5stack-cores3'], ['Dial', 'm5stack-dial']];
  function portsOf(b) {
    const p = b.pins || {}, out = {};
    const a1 = p.grove_a_sda != null ? p.grove_a_sda : p.grove_a_1, a2 = p.grove_a_scl != null ? p.grove_a_scl : p.grove_a_2;
    if (a1 != null && a2 != null) out.A = [a1, a2];
    if (p.grove_b_1 != null && p.grove_b_2 != null) out.B = [p.grove_b_1, p.grove_b_2];
    if (p.grove_c_1 != null && p.grove_c_2 != null) out.C = [p.grove_c_1, p.grove_c_2];
    // the pin map does not list every port: read the rest from the expansion text (for example 'Port B G9/G8')
    (b.expansion || []).forEach(t => { const m = /port\.?\s*([ABC])\b[^G]*G(\d+)\s*\/\s*G?(\d+)/i.exec(String(t)); if (m && !out[m[1].toUpperCase()]) out[m[1].toUpperCase()] = [+m[2], +m[3]]; });
    return out;
  }
  /* does a unit of this kind work on a port with these two pins? -> { v: 'ok' | 'care' | 'no', text } */
  function judge(E, chip, kind, port, pins, wifi) {
    const info = pins.map(n => E.pin(chip, n) || {}), out = info.map(p => p.dir !== 'I'), g = n => 'G' + n;
    const home = UNIT_HOME[kind] === port;
    let ok = true, why = '', care = '', good = '';
    if (kind === 'i2c') { ok = out[0] && out[1]; good = 'both pins can drive the bus'; if (!ok) why = (out[0] ? g(pins[1]) : g(pins[0])) + ' is input-only: it cannot drive an I2C line'; }
    else if (kind === 'uart') { ok = out[0] || out[1]; good = 'one pin can transmit and one can receive'; if (!ok) why = 'both pins are input-only: nothing can transmit'; else if (!(out[0] && out[1])) care = (out[0] ? g(pins[1]) : g(pins[0])) + ' is input-only, so it must be the receive line'; }
    else if (kind === 'analog') {
      const a1 = info.filter(p => /^ADC1/.test(p.adc || '')), a2 = info.filter(p => /^ADC2/.test(p.adc || ''));
      if (a1.length) { good = 'an ADC1 channel (' + a1[0].adc + '): safe with Wi-Fi'; }
      else if (a2.length) { good = 'an ADC2 channel (' + a2[0].adc + ')'; if (wifi) care = 'ADC2 is disturbed while Wi-Fi is on'; }
      else { ok = false; why = 'neither pin has an ADC channel'; }
    }
    else if (kind === 'button') { good = 'any input pin will do'; }
    else { ok = out[0] || out[1]; good = 'a pin that can drive an output'; if (!ok) why = 'both pins are input-only: nothing can drive the unit'; }
    if (!ok) return { v: 'no', text: why };
    if (care) return { v: 'care', text: care + (home ? '' : '; also not the port made for it') };
    if (!home) return { v: 'care', text: 'Possible in software (' + good + '), but not the port made for it' };
    return { v: 'ok', text: 'The port made for it: ' + good };
  }
  Hyper.sim('m5-grove-ports', {
    title: 'Red, black and blue: which unit fits which port',
    blurb: `Pick a controller and a type of unit, and the three ports are judged **from the pin database**: can the two pins drive what the unit needs, and is it the port M5Stack made for it? The pins of each port come from [the board catalogue](#/tools/boards?maker=M5Stack). The sockets carry ground, 5 V and two signal wires; the signals are 3.3 V.

**Try this**
- Choose the **Core Basic** and an *I2C unit*: Port B fails, because one of its pins (G36) is input-only.
- Choose an *analogue sensor* on the **Core2** and tick *Wi-Fi in use*: Port B's G26 sits on ADC2, which Wi-Fi disturbs, but G36 is on ADC1.
- Choose a *UART unit* and see which pin of Port B must be the receive line.
- Switch to the **CoreS3** and the **Dial**: the same colours sit on different pins.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340, maxH: 470 });
      let sel = 'A', hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Controller', options: GROVE_CONTROLLERS, value: 'm5stack-core-basic-v2-7' },
        { id: 'unit', type: 'select', label: 'Unit to plug in', options: UNITS, value: 'i2c' },
        { id: 'wifi', type: 'check', label: 'Wi-Fi in use', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['A', 'Port A (red)'], ['B', 'Port B (black)'], ['C', 'Port C (blue)'], ['pins', 'Selected pins'], ['level', 'Levels']]);
      const pinText = (chip, n) => { const p = E.pin(chip, n) || {}; return 'G' + n + (p.dir === 'I' ? ' input-only' : '') + (p.adc ? ' ' + p.adc : '') + (p.dac ? ' ' + p.dac : ''); };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, b = E.board(ctl.values.model);
        if (!b) return;
        const chip = b.chip, ports = portsOf(b), kind = ctl.values.unit, ch = E.chip(chip);
        const letters = ['A', 'B', 'C'];
        if (!ports[sel]) sel = 'A';
        const bx = 12, bw = Math.min(140, W * 0.26), by = 14, bh = H - 28, rowH = (H - 28) / 3;
        S.box(c, bx, by, bw, bh, { label: shortName(b), sub: ch ? ch.name : chip, color: kit.hue(CHIP_HUE[chip] || 200) });
        hits = [];
        letters.forEach((k, i) => {
          const y = by + i * rowH, cy = y + rowH / 2, sx = bx + bw - 6, info = PORT_INFO[k], p = ports[k];
          if (!p) { kit.label(c, 'no port ' + k, sx + 60, cy, { size: 11, color: C.faint, align: 'left' }); return; }
          const r = judge(E, chip, kind, k, p, ctl.values.wifi), col = r.v === 'ok' ? C.ok : r.v === 'care' ? C.warn : C.bad;
          const active = sel === k;
          if (active) { c.strokeStyle = C.accent; c.lineWidth = 1.6; rrect(c, sx - 2, y + 3, W - sx - 6, rowH - 6, 8); c.stroke(); }
          // the socket
          c.fillStyle = info[1]; rrect(c, sx, cy - 15, 48, 30, 5); c.fill();
          [['#111', 8], ['#d33', 18], ['#e8c93a', 28], ['#f2f2f2', 38]].forEach(q => { c.fillStyle = q[0]; c.beginPath(); c.arc(sx + q[1], cy + 8, 3, 0, 6.2832); c.fill(); });
          kit.label(c, 'Port ' + k, sx + 24, cy - 6, { size: 10.5, color: '#fff', weight: 650, align: 'center' });
          kit.label(c, info[0] + ' · ' + info[2], sx + 56, cy - 20, { size: 10.5, color: C.muted, align: 'left' });
          kit.label(c, 'G' + p[0] + ' · G' + p[1] + (UNIT_HOME[kind] === k ? (W < 460 ? ' ★' : '   ★ made for this unit') : ''), sx + 56, cy - 5, { size: 11, color: C.text2, weight: 600, align: 'left' });
          // the verdict
          c.fillStyle = col; c.beginPath(); c.arc(sx + 62, cy + 14, 5, 0, 6.2832); c.fill();
          const lines = wrapText(c, r.text, Math.max(100, W - (sx + 76) - 12), 10.5);
          lines.slice(0, 3).forEach((t, n) => kit.label(c, t, sx + 74, cy + 14 + n * 13 - (lines.length > 1 ? 4 : 0), { size: 10.5, color: C.text2, align: 'left' }));
          hits.push({ k, x: sx - 2, y: y + 3, w: W - sx - 6, h: rowH - 6 });
          ro.set(k, (r.v === 'ok' ? 'suits' : r.v === 'care' ? 'with care' : 'does not suit') + ': ' + r.text);
        });
        letters.forEach(k => { if (!ports[k]) ro.set(k, 'this controller has no such port'); });
        ro.set('pins', ports[sel] ? 'Port ' + sel + ': ' + pinText(chip, ports[sel][0]) + ' · ' + pinText(chip, ports[sel][1]) : '—');
        ro.set('level', '5 V power on the red wire · 3.3 V on the two signal wires');
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { sel = h.k; loop.once(); } }, p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ m5-virtual-core2 */
  Hyper.sim('m5-virtual-core2', {
    title: 'A Core2-style screen and three keys',
    blurb: `A virtual 320 × 240 screen with the three keys under it, running the counter of the page: **A** counts down, **B** resets, **C** counts up. The loop calls \`M5.update()\` once per pass; the read-outs show what the program sees: a key is *held* for as long as you press it, but *wasPressed* is true for **one pass only**.

**Try this**
- Press and hold a key: the key stays held, the count moves **once**.
- Raise **Loop pass** towards 1000 ms, as if the loop were blocked in \`delay()\`, and tap quickly: presses fall between two passes and are **missed**.
- Tick **Call update() twice**: the second call wipes the edge, so no press is ever seen.
- Tap on the screen: the touch point appears, in screen pixels.`,
    mount(box, kit) {
      const G = kit.gfx, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 400, maxH: 660 });
      const fb = G.fb(320, 240, { depth: 16 }), ui = G.ui(fb);
      let count = 0, touch = null, touchDown = null, missed = 0, clock = 0, nextPass = 0, dirty = true, last = '—';
      const K = ['A', 'B', 'C'];
      const keys = { A: false, B: false, C: false }, prev = { A: false, B: false, C: false }, was = { A: false, B: false, C: false }, pending = { A: false, B: false, C: false }, flash = { A: 0, B: 0, C: 0 };
      let held = null, keyRects = [], lcd = { x: 0, y: 0, scale: 1 };
      const ctl = kit.controls(box.side, [
        { id: 'pass', label: 'Loop pass (a delay in the loop)', min: 10, max: 1000, value: 20, unit: 'ms', log: true, sig: 2 },
        { id: 'twice', type: 'check', label: 'Call update() twice per pass', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset the count', primary: true }] }
      ], id => { if (id === 'reset') { count = 0; missed = 0; dirty = true; } });
      const ro = kit.readout(box.side, [['count', 'Count'], ['btn', 'Keys held'], ['edge', 'wasPressed seen'], ['touch', 'Touch'], ['frame', 'One frame in RAM'], ['missed', 'Presses missed']]);
      function update() { K.forEach(k => { was[k] = keys[k] && !prev[k]; prev[k] = keys[k]; }); }
      function pass() {
        update();
        if (ctl.values.twice) update();
        K.forEach(k => {
          if (was[k]) { count = clamp(count + (k === 'A' ? -1 : k === 'C' ? 1 : -count), -99, 99); flash[k] = 0.3; last = 'wasPressed on ' + k; dirty = true; pending[k] = false; }
          else if (pending[k] && !keys[k]) { missed++; pending[k] = false; }
        });
        if (touchDown && (!touch || touch.x !== touchDown.x || touch.y !== touchDown.y)) { touch = { x: touchDown.x, y: touchDown.y }; dirty = true; }
      }
      function render() {
        ui.screen();
        ui.header('Counter demo');
        ui.batteryIcon(296, 5, 0.8);
        fb.text(String(count), 160, 44, { size: 8, align: 'center', color: 0xFFFFFF });
        ui.bar(30, 124, 260, 14, (clamp(count, -20, 20) + 20) / 40);
        fb.text('A  -1      B  reset      C  +1', 160, 150, { align: 'center', color: 0x8C96AC });
        fb.text(last, 160, 168, { align: 'center', color: 0x38A0FF });
        K.forEach((k, i) => { const x = 40 + i * 100; fb.fillRoundRect(x, 196, 60, 22, 6, keys[k] ? 0x38A0FF : 0x1B2434); fb.text(k, x + 30, 203, { align: 'center', color: keys[k] ? 0x000000 : 0xE8ECF4 }); });
        if (touch) { fb.circle(touch.x, touch.y, 8, G.COLORS.red); fb.hline(touch.x - 14, touch.y, 29, G.COLORS.red); fb.vline(touch.x, touch.y - 14, 29, G.COLORS.red); }
        dirty = false;
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const P = clamp(ctl.values.pass, 5, 1000);
        clock += dt * 1000;
        if (nextPass < clock - 3000) nextPass = clock;
        while (clock >= nextPass) { pass(); nextPass += P; }
        K.forEach(k => { flash[k] = Math.max(0, flash[k] - dt); });
        if (dirty) render();
        const s = Math.max(1, Math.min(Math.floor((W - 24) / 320), Math.floor((H - 100) / 240)));
        const x = Math.round((W - 320 * s) / 2), y = 14;
        lcd = G.draw(c, fb, x, y, s, { style: 'tft' });
        keyRects = [];
        const ky = y + 240 * s + 40;
        K.forEach((k, i) => {
          const kx = x + 320 * s * (i * 2 + 1) / 6;
          const r = S.button(c, kx, ky, { pressed: keys[k], size: 44, label: k, color: C.accent });
          keyRects.push({ k, x: r.x - 8, y: r.y - 8, w: r.w + 16, h: r.h + 16 });
        });
        kit.label(c, 'touch areas under the screen, as on a Core2', W / 2, ky + 42, { size: 10.5, color: C.faint, align: 'center' });
        ro.set('count', String(count));
        ro.set('btn', K.map(k => k + (keys[k] ? ' held' : ' –')).join('   '));
        ro.set('edge', K.filter(k => flash[k] > 0).join(' ') || '—');
        ro.set('touch', touch ? 'x ' + touch.x + ', y ' + touch.y : '—');
        ro.set('frame', kit.fmt(G.frameBytes(320, 240, 16), 6) + ' bytes (320 × 240 × 2)');
        ro.set('missed', String(missed));
      }, box.stage);
      const cv = st.canvas;
      cv.addEventListener('pointerdown', e => {
        const p = st.pos(e), kr = keyRects.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h);
        if (kr) { keys[kr.k] = true; pending[kr.k] = true; held = kr.k; try { cv.setPointerCapture && cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } }
        else { const q = G.pick(fb, lcd.x, lcd.y, lcd.scale, p.x, p.y); if (q) touchDown = q; }
      });
      const release = () => { if (held) { keys[held] = false; held = null; } touchDown = null; };
      cv.addEventListener('pointerup', release); cv.addEventListener('pointercancel', release); cv.addEventListener('pointerleave', release);
      st.onResize(() => { dirty = true; });
      render();
      loop.start();
    }
  });

  /* ================================================================ m5-chooser */
  function radiosOf(E, b) {
    const ch = E.chip(b.chip) || {}, part = String(b.part || ''), on = (b.onboard || []).join(' ');
    const r = { wifi: !!ch.wifi, wifi6: !!(ch.wifi && ch.wifi.gen >= 6), btc: !!(ch.bt && ch.bt.classic), th: !!ch.ieee802154, lora: (b.has || []).indexOf('lora') >= 0 || /LoRa|SX126/i.test(on + ' ' + part), eth: (b.has || []).indexOf('eth') >= 0 || /Ethernet|GbE/i.test(on) };
    if (b.chip === 'esp32-p4' && /ESP32-C6/i.test(part)) { r.wifi = true; r.wifi6 = true; }      // the Tab5: the radio sits on a second chip
    if (/ESP32-H2/i.test(part)) r.th = true;
    return r;
  }
  const maxSide = b => (b.size && b.size.length ? Math.max(b.size[0] || 0, b.size[1] || 0) : 999);
  const NEEDS = {
    screen: [['any', 'any'], ['none needed', 'none'], ['any screen', 'screen'], ['a touch screen', 'touch'], ['e-paper', 'epaper'], ['a round screen', 'round'], ['bigger than 3″', 'big']],
    size: [['any size', 'any'], ['tiny: 30 mm or less', 'tiny'], ['pocket: 60 mm or less', 'pocket']],
    radio: [['any', 'any'], ['Wi-Fi', 'wifi'], ['Wi-Fi 6', 'wifi6'], ['Bluetooth Classic', 'btc'], ['Zigbee or Thread (802.15.4)', 'th'], ['LoRa', 'lora'], ['Ethernet', 'eth']],
    extra: [['nothing in particular', 'any'], ['a camera (or a camera port)', 'camera'], ['a microphone and a speaker', 'voice'], ['a motion sensor (IMU)', 'imu'], ['a keyboard', 'keyboard'], ['a microSD slot', 'sd'], ['a real-time clock', 'rtc'], ['RS485, CAN or relays', 'industrial']]
  };
  Hyper.sim('m5-chooser', {
    title: 'Which M5Stack for my project?',
    blurb: `State what the project needs and the catalogue's 68 M5Stack records are filtered to those that have it. Radios are read from the chip (and, for the Tab5 and the Thread border router, from the second radio chip named in the part). The list is sorted with current products and the most popular boards first.

**Try this**
- Ask for *a touch screen* with *a battery* and *Wi-Fi 6*: see how few survive.
- Choose *tiny* and *a camera* and compare the answers with *pocket*.
- Ask for *Bluetooth Classic*: only the original ESP32 products appear.
- Tap a card to read its record: chip, screen, battery, what it is good for and what to mind.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 380, maxH: 600 });
      const recs = E.family(MAKER).map(b => ({ b, r: radiosOf(E, b), scr: screenOf(b) }));
      let sel = null, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'screen', type: 'select', label: 'Screen', options: NEEDS.screen, value: 'any' },
        { id: 'bat', type: 'check', label: 'Battery built in', value: false },
        { id: 'size', type: 'select', label: 'Size', options: NEEDS.size, value: 'any' },
        { id: 'radio', type: 'select', label: 'Radio', options: NEEDS.radio, value: 'any' },
        { id: 'extra', type: 'select', label: 'Also needs', options: NEEDS.extra, value: 'any' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['n', 'Matches'], ['name', 'Chosen'], ['chip', 'Chip and memory'], ['scr', 'Screen'], ['bat', 'Battery'], ['good', 'Good for'], ['mind', 'Mind']]);
      function matches(x) {
        const b = x.b, v = ctl.values, on = (b.onboard || []).join(' ') + ' ' + shortName(b), has = b.has || [];
        switch (v.screen) {
          case 'none': if (x.scr.has || x.scr.led) return false; break;
          case 'screen': if (!x.scr.has) return false; break;
          case 'touch': if (has.indexOf('touch') < 0) return false; break;
          case 'epaper': if (has.indexOf('epaper') < 0) return false; break;
          case 'round': if (!/round|1\.28″|466 × 466/i.test(b.display || '')) return false; break;
          case 'big': if (!(x.scr.diag > 3)) return false; break;
        }
        if (v.bat && !hasBattery(b)) return false;
        if (v.size === 'tiny' && maxSide(b) > 30) return false;
        if (v.size === 'pocket' && maxSide(b) > 60) return false;
        if (v.radio !== 'any' && !x.r[v.radio]) return false;
        switch (v.extra) {
          case 'camera': if (has.indexOf('camera') < 0) return false; break;
          case 'voice': if (has.indexOf('mic') < 0 || has.indexOf('speaker') < 0) return false; break;
          case 'imu': if (has.indexOf('imu') < 0) return false; break;
          case 'keyboard': if (!/keyboard|56-key|42-key/i.test(on)) return false; break;
          case 'sd': if (has.indexOf('sd') < 0) return false; break;
          case 'rtc': if (has.indexOf('rtc') < 0) return false; break;
          case 'industrial': if (!/RS485|relay|CAN\b/i.test(on)) return false; break;
        }
        return true;
      }
      const cmp = (p, q) => ((p.b.status === 'current' ? 0 : 1) - (q.b.status === 'current' ? 0 : 1)) || ((q.b.pop || 0) - (p.b.pop || 0)) || p.b.name.localeCompare(q.b.name);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10;
        const list = recs.filter(matches).sort(cmp);
        const cols = W < 470 ? 1 : 2, cw = (W - M * (cols + 1)) / cols, chh = 52, gap = 6;
        const cap = Math.max(1, Math.floor((H - 26) / (chh + gap))) * cols;
        hits = [];
        list.slice(0, cap).forEach((x, i) => {
          const b = x.b, cx = M + (i % cols) * (cw + M), cy = M + Math.floor(i / cols) * (chh + gap), ch = E.chip(b.chip), hue = CHIP_HUE[b.chip] != null ? CHIP_HUE[b.chip] : 200;
          c.fillStyle = C.surface; rrect(c, cx, cy, cw, chh, 8); c.fill();
          c.strokeStyle = sel === x ? C.text : kit.hue(hue); c.lineWidth = sel === x ? 2.2 : 1.3; rrect(c, cx, cy, cw, chh, 8); c.stroke();
          const nm = shortName(b) + (b.status && b.status !== 'current' ? ' (superseded)' : '');
          kit.label(c, clip(nm, Math.floor(cw / 7.4)), cx + 10, cy + 13, { size: 12, weight: 650, color: C.text, align: 'left' });
          kit.label(c, (ch ? ch.name : b.chip) + ' · ' + (b.flash || '?') + (b.psram ? ' + ' + b.psram : ''), cx + 10, cy + 29, { size: 10.5, color: kit.hue(hue), align: 'left' });
          kit.label(c, clip((x.scr.has || x.scr.led ? (x.scr.diag ? x.scr.diag + '″ ' : '') + (x.scr.w ? x.scr.w + '×' + x.scr.h : 'LEDs') : 'no screen') + (hasBattery(b) ? ' · ' + (mahOf(b) ? mahOf(b) + ' mAh' : 'battery') : ''), Math.floor(cw / 6.2)), cx + 10, cy + 43, { size: 10.5, color: C.muted, align: 'left' });
          hits.push({ x: cx, y: cy, w: cw, h: chh, rec: x });
        });
        if (list.length > cap) kit.label(c, '+ ' + (list.length - cap) + ' more: narrow the needs', W / 2, H - 12, { size: 11, color: C.muted, align: 'center' });
        if (!list.length) kit.label(c, 'No M5Stack in the catalogue has all of that: relax one need.', W / 2, H / 2, { size: 12.5, color: C.warn, align: 'center' });
        ro.set('n', list.length + ' of ' + recs.length);
        if (sel && !list.includes(sel)) sel = null;
        const s = sel || list[0];
        if (s) {
          const b = s.b, ch = E.chip(b.chip);
          ro.set('name', b.name + (sel ? '' : ' (first match)')); ro.set('chip', (ch ? ch.name : b.chip) + ' · ' + (b.flash || '?') + ' flash' + (b.psram ? ' · ' + b.psram + ' PSRAM' : ' · no PSRAM'));
          ro.set('scr', clip(b.display || 'none', 70)); ro.set('bat', clip(b.battery || 'none', 70));
          ro.set('good', clip((b.good || [])[0] || '—', 80)); ro.set('mind', clip((b.watch || [])[0] || '—', 90));
        } else { ['name', 'chip', 'scr', 'bat', 'good', 'mind'].forEach(k => ro.set(k, '—')); }
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { sel = h.rec; loop.once(); } }, p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ m5-mbus-pins */
  const TOKENS = { lcd: 'screen', sd: 'microSD', i2c: 'I2C', i2s: 'I2S', grove: 'Grove port', a: 'A', b: 'B', c: 'C', cs: 'CS', dc: 'DC', rst: 'reset', bl: 'backlight', uart0: 'UART0', tx: 'TX', rx: 'RX', mic: 'microphone', clk: 'clock', dout: 'out', din: 'in', sda: 'SDA', scl: 'SCL', mosi: 'MOSI', miso: 'MISO', sck: 'SCK', int: 'interrupt', button: 'button', speaker: 'speaker', dac: 'DAC' };
  const humanise = k => String(k).split('_').map(t => TOKENS[t] || t).join(' ');
  Hyper.sim('m5-mbus-pins', {
    title: 'The M-Bus: who already uses each pin?',
    blurb: `The 30 pins of a Core's M-Bus, as two columns of fifteen (row *n* holds pins 2n − 1 and 2n). Each GPIO pin is coloured by **who already uses it** on this Core, from the fixed pin assignments in [the board catalogue](#/tools/boards?maker=M5Stack): amber pins carry the Core's own screen, card slot, audio or I2C, green ones are free. A module that claims an amber pin competes with the Core.

**Try this**
- Look at the SPI trio (MOSI, MISO, SCK): all three are amber, because the screen and the card share them.
- Compare the **Core Basic** with the **Core2** and the **CoreS3**: the same row holds a different GPIO.
- Tap a pin to read who uses it and what the pin database says about that GPIO.
- Switch to *What the pin is* to colour by pin kind instead.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 440, maxH: 620 });
      let sel = { row: 3, side: 0 }, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Core', options: CORES, value: 'm5stack-core2' },
        { id: 'mode', type: 'select', label: 'Colour by', options: [['Who already uses the pin', 'use'], ['What the pin is', 'kind']], value: 'use' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['bus', 'GPIO pins on the bus'], ['used', 'Used by the Core itself'], ['pin', 'Selected pin'], ['by', 'Used by'], ['db', 'Pin database']]);
      function classify(raw, chip, used) {
        const q = E.parsePin(raw) || { label: String(raw), gpio: null };
        if (q.gpio != null) { const us = used[q.gpio] || []; let kind = 'gpio'; try { kind = E.pinKind(chip, q.gpio) || 'gpio'; } catch (e) { kind = 'gpio'; } return { q, type: 'gpio', users: us, kind, name: q.label && q.label !== String(q.gpio) ? q.label + ' ' + q.gpio : 'G' + q.gpio }; }
        const L = String(q.label).toUpperCase();
        const type = L === 'GND' ? 'gnd' : L === 'RST' ? 'ctrl' : L === 'NC' ? 'nc' : 'power';
        return { q, type, users: [], kind: type, name: q.label };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, b = E.board(ctl.values.model);
        if (!b || !b.headers) return;
        const chip = b.chip, mu = mbusUse(E, b), top = 30, rowH = (H - top - 14) / 15, cx = W / 2, off = W < 470 ? 38 : 64;
        hits = [];
        kit.label(c, shortName(b) + ' · M-Bus seen from below', cx, 14, { size: 12, weight: 650, color: C.text2, align: 'center' });
        c.fillStyle = C.surface; rrect(c, cx - off - 14, top - 4, off * 2 + 28, rowH * 15 + 8, 8); c.fill();
        c.strokeStyle = C.border2 || C.faint; c.lineWidth = 1.2; rrect(c, cx - off - 14, top - 4, off * 2 + 28, rowH * 15 + 8, 8); c.stroke();
        const wide = cx - off - 20 > 150;
        for (let r = 0; r < 15; r++) {
          const y = top + r * rowH + rowH / 2;
          kit.label(c, String(2 * r + 1) + ' · ' + String(2 * r + 2), cx, y, { size: 9.5, color: C.faint, align: 'center' });
          [0, 1].forEach(side => {
            const raw = (b.headers[side] && b.headers[side].pins[r]) || 'NC', p = classify(raw, chip, mu.used), x = cx + (side ? off : -off);
            let colr;
            if (p.type === 'gpio') colr = ctl.values.mode === 'use' ? (p.users.length ? C.warn : C.ok) : S.kindColor(p.kind);
            else colr = p.type === 'gnd' ? C.faint : p.type === 'power' ? kit.hue(4) : p.type === 'ctrl' ? kit.hue(330) : C.faint;
            const active = sel.row === r && sel.side === side;
            c.beginPath(); c.arc(x, y, Math.min(6.5, rowH * 0.36), 0, 6.2832);
            if (p.type === 'nc') { c.strokeStyle = C.faint; c.lineWidth = 1.2; c.stroke(); } else { c.fillStyle = colr; c.fill(); }
            if (active) { c.beginPath(); c.arc(x, y, Math.min(6.5, rowH * 0.36) + 3.5, 0, 6.2832); c.strokeStyle = C.text; c.lineWidth = 1.6; c.stroke(); }
            const lab = p.name + (wide && p.users.length ? '  ← ' + clip(humanise(p.users[0]), 18) : '');
            kit.label(c, lab, x + (side ? 12 : -12), y, { size: 10.5, color: p.users.length && ctl.values.mode === 'use' ? C.warn : C.text2, align: side ? 'left' : 'right' });
            hits.push({ x: x - 12, y: y - rowH / 2, w: 24, h: rowH, row: r, side, p });
          });
        }
        ro.set('bus', String(mu.gpios.length)); ro.set('used', mu.inUse + ' of them');
        const hrow = hits.find(h => h.row === sel.row && h.side === sel.side);
        if (hrow) {
          const p = hrow.p, num = 2 * sel.row + 1 + sel.side;
          ro.set('pin', 'pin ' + num + ' · ' + p.name);
          if (p.type === 'gpio') {
            const info = E.pin(chip, p.q.gpio) || {};
            ro.set('by', p.users.length ? p.users.map(humanise).join(', ') : 'nothing on the Core itself');
            ro.set('db', (info.safe ? info.safe + ': ' : '') + clip(info.note || '—', 120));
          } else { ro.set('by', p.type === 'gnd' ? 'ground' : p.type === 'ctrl' ? 'reset of the controller' : p.type === 'nc' ? 'not connected on this Core' : 'power: ' + p.name); ro.set('db', '—'); }
        }
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { sel = { row: h.row, side: h.side }; loop.once(); } }, p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ m5-p4-blocks */
  const P4S = [['Tab5', 'm5stack-tab5'], ['Stamp P4 (with its add-on C6)', 'm5stack-stamp-p4'], ['Unit PoE-P4', 'm5stack-unit-poe-p4']];
  const P4SPEC = {
    'm5stack-tab5': { radio: ['ESP32-C6-MINI-1U', 'Wi-Fi · BLE · on the board', 'board'], display: ['5″ 1280 × 720', 'MIPI-DSI · touch inside'], camera: ['SC2356 2 MP', 'MIPI-CSI'], net: ['USB-C OTG · USB-A host', 'RS485 · microSD · Grove'], path: 'radio' },
    'm5stack-stamp-p4': { radio: ['Stamp-AddOn C6', 'ESP32-C6FH4 · another board', 'addon'], display: ['MIPI-DSI', '2 lanes · on a connector'], camera: ['MIPI-CSI', '2 lanes · on a connector'], net: ['USB 2.0 OTG', 'on pads · SDIO on a connector'], path: 'radio' },
    'm5stack-unit-poe-p4': { radio: ['no radio', 'wired only', 'none'], display: ['MIPI-DSI', 'up to 1920 × 1080 · cable'], camera: ['MIPI-CSI', '2 lanes · flat cable'], net: ['Ethernet + PoE', '10/100 · IEEE 802.3at · 6 W'], path: 'net' }
  };
  Hyper.sim('m5-p4-blocks', {
    title: 'The ESP32-P4 products: where the radio attaches',
    blurb: `The ESP32-P4 has the interfaces for a MIPI-DSI display and a MIPI-CSI camera, and **no radio**. The three M5Stack products built on it solve the radio problem differently: a second chip on the board (Tab5), a separate add-on board (Stamp P4), or no radio at all and a wired network (Unit PoE-P4). The facts come from [the board catalogue](#/tools/boards?maker=M5Stack); the drawing is schematic.

**Try this**
- On the **Tab5**, follow the moving packet: it arrives at the C6 and is handed to the P4.
- Switch to the **Stamp P4**: the radio box is dashed, because it is another board to buy.
- Switch to the **Unit PoE-P4**: the packet arrives by cable, and the same cable powers the unit.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 380, maxH: 520 });
      const ctl = kit.controls(box.side, [{ id: 'model', type: 'select', label: 'Product', options: P4S, value: 'm5stack-tab5' }], () => loop.once());
      const ro = kit.readout(box.side, [['part', 'Chip part'], ['mem', 'Flash and PSRAM'], ['radio', 'Radio'], ['display', 'Display'], ['camera', 'Camera'], ['net', 'Connections'], ['watch', 'The catalogue warns']]);
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, b = E.board(ctl.values.model), sp = P4SPEC[ctl.values.model];
        if (!b || !sp) return;
        const narrow = W < 520, bw = narrow ? 98 : Math.min(150, W * 0.27), bh = 62, cx = W / 2, cy = H / 2, fs = narrow ? 10.5 : 12, nc = Math.floor((bw - 8) / (fs * 0.5)), dy = narrow ? bh * 0.8 : 0;
        // the P4 in the middle
        const p4 = S.box(c, cx - Math.min(bw, 110) / 2, cy - 44, Math.min(bw, 110), 88, { label: 'ESP32-P4', sub: narrow ? 'no radio' : 'no radio of its own', color: kit.hue(CHIP_HUE['esp32-p4']), active: true, size: fs });
        // the four neighbours (on a phone the radio and the display sit a little above and below the middle)
        const rad = S.box(c, 6, cy - bh / 2 - dy, bw, bh, { label: sp.radio[0], sub: clip(sp.radio[1], nc), color: sp.radio[2] === 'none' ? C.faint : kit.hue(CHIP_HUE['esp32-c6']), dash: sp.radio[2] !== 'board', size: fs });
        const dsp = S.box(c, W - bw - 6, cy - bh / 2 + dy, bw, bh, { label: sp.display[0], sub: clip(sp.display[1], nc), color: kit.hue(200), size: fs });
        const cam = S.box(c, cx - bw / 2, H - bh - 12, bw, bh, { label: sp.camera[0], sub: clip(sp.camera[1], nc), color: kit.hue(160), size: fs });
        const net = S.box(c, cx - bw / 2 - 20, 12, bw + 40, bh, { label: sp.net[0], sub: clip(sp.net[1], nc + 6), color: kit.hue(40), size: fs });
        const wired = sp.radio[2] === 'none';
        S.link(c, rad.r[0], rad.r[1], p4.l[0], p4.l[1], { wireless: false, label: wired ? 'no link' : 'link to the P4', arrow: false });
        S.link(c, p4.r[0], p4.r[1], dsp.l[0], dsp.l[1], { label: 'MIPI-DSI' });
        S.link(c, cam.t[0], cam.t[1], p4.b[0], p4.b[1], { label: 'MIPI-CSI' });
        S.link(c, net.b[0], net.b[1], p4.t[0], p4.t[1], { label: sp.path === 'net' ? 'Ethernet' : 'USB · serial' });
        // a packet arriving
        const f = (t * 0.35) % 1;
        if (sp.path === 'radio' && !wired) {
          const air = [rad.l[0] - 2, rad.t[1] - 4];
          S.msg(c, air[0] + 6, air[1] - 8, rad.cx, rad.t[1], Math.min(1, f * 2), { label: 'Wi-Fi' });
          if (f > 0.5) S.msg(c, rad.r[0], rad.r[1], p4.l[0], p4.l[1], (f - 0.5) * 2, { label: '' });
        } else if (wired) S.msg(c, net.cx, net.t[1] - 4, net.cx, net.b[1], f, { label: 'frame' });
        const sd = P4SPEC[ctl.values.model];
        ro.set('part', b.part); ro.set('mem', (b.flash || '?') + ' flash · ' + (b.psram || '?') + ' PSRAM');
        ro.set('radio', sd.radio[0] + (sd.radio[2] === 'none' ? '' : ' (' + sd.radio[1] + ')')); ro.set('display', clip(b.display || sd.display[0], 80));
        ro.set('camera', sd.camera[0] + ', ' + sd.camera[1]); ro.set('net', clip((b.expansion || []).join(' · '), 100)); ro.set('watch', clip((b.watch || [])[0] || '—', 110));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });
})();
