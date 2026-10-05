/* HYPER-ESP32 · sims/the-soc-series.js
 *
 * Simulations of the chip pages. Every chip page also shows the shared block-diagram simulation (ref-chip).
 *
 *   so-family-grid    chips against features: click features to light the chips that have them all
 *   so-family-tree    which chip replaces which, by year, in lanes; click a chip for its links
 *   so-family-bars    the family ranked by one number (clock, RAM, pins, sleep current …)
 *   so-pin-budget     the GPIOs of a chip, coloured by how safe each is to use; click a pin for its note
 *   so-battery-life   how long a cell lasts for a chip that wakes, sends and sleeps (chip current only)
 *   so-migrate        moving a design from one chip to another: what you gain, what you lose
 *
 * All the numbers are read from the chip catalogue (kit.esp), never typed here.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared helpers */
  const nz = v => (v == null || v === false || v !== v ? 0 : v);
  const hueOf = c => (/risc/i.test(c.arch || '') ? 150 : c.id === 'esp8266' ? 40 : 8);
  const shortName = c => c.id === 'esp8266' ? 'ESP8266' : c.id === 'esp32' ? 'ESP32' : c.name.replace(/^ESP32-/, '').replace(/ \(ESP8684\)/, '');
  const fullName = c => c.name.replace(/ \(ESP8684\)/, '');
  const isProd = c => /^mass production/.test(c.status || '');
  const hasOtg = c => (c.usb || []).some(u => /otg/i.test(u));
  const hasPsram = c => !!c.psramMax || (c.psramIn || []).length > 0;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const clip = (s, maxW, size) => {
    const per = size * 0.56, n = Math.max(1, Math.floor(maxW / per));
    return s.length > n ? s.slice(0, Math.max(1, n - 1)) + '…' : s;
  };
  // a path of a rounded rectangle that works where roundRect does not exist
  const rr = (c, x, y, w, h, r) => {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, Math.max(0, w), Math.max(0, h), Math.max(0, Math.min(r, w / 2, h / 2)));
    else c.rect(x, y, Math.max(0, w), Math.max(0, h));
  };
  const words = (s, per) => {
    const out = []; let line = '';
    for (const w of String(s).split(' ')) {
      if ((line + ' ' + w).trim().length > per && line) { out.push(line); line = w; } else line = (line + ' ' + w).trim();
    }
    if (line) out.push(line);
    return out;
  };
  const fmtNum = v => (v == null ? 'not published' : Number.isInteger(v) ? String(v) : String(Math.round(v * 10) / 10));

  /* ================================================================ so-family-grid */
  Hyper.sim('so-family-grid', {
    title: 'Which chips have it?',
    blurb: `Every row is a chip, every column a feature. A bright dot means the chip has it. **Click a feature** at the top (or pick a need from the list): the chips that have *all* the chosen features stay lit and the rest fade. Click a chip's name for its one-line character.

**Try this**
- Choose *Stream audio to a phone speaker*: only the ESP32, the S31 and the E22 co-processor are left. Then add **USB OTG**: one chip remains.
- Choose *Wi-Fi 6 on the 5 GHz band*: the C5 and the E22 co-processor, nothing else.
- Choose *Camera + PSRAM*, then add **2 cores**: the list shrinks to the chips for pictures and AI.
- Switch to *In mass production only* to drop what is sampling, announced or retired.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 430, maxH: 620 });
      const FEATS = [
        ['Wi-Fi', c => !!c.wifi],
        ['Wi-Fi 6', c => !!c.wifi && c.wifi.gen >= 6],
        ['5 GHz', c => !!c.wifi && c.wifi.bands.includes(5)],
        ['BT Classic', c => !!c.bt && !!c.bt.classic],
        ['Bluetooth LE', c => !!c.bt],
        ['802.15.4', c => !!c.ieee802154],
        ['2 cores', c => c.cores >= 2],
        ['USB OTG', hasOtg],
        ['Camera', c => (c.cam || []).length > 0],
        ['PSRAM', hasPsram],
        ['DAC', c => nz(c.dac) > 0],
        ['Touch', c => nz(c.touch) > 0],
        ['Ethernet', c => !!c.eth]
      ];
      const idx = name => FEATS.findIndex(f => f[0] === name);
      const PRESETS = [
        ['Pick a need …', []],
        ['Stream audio to a phone speaker', ['BT Classic']],
        ['A Zigbee or Thread node with Wi-Fi', ['Wi-Fi', '802.15.4']],
        ['A USB gadget with Wi-Fi', ['Wi-Fi', 'USB OTG']],
        ['A camera with room for pictures', ['Camera', 'PSRAM']],
        ['Wi-Fi 6 on the 5 GHz band', ['Wi-Fi 6', '5 GHz']]
      ];
      let sel = new Set(), pick = null, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'A need', options: PRESETS.map((p, i) => [p[0], i]), value: 0 },
        { id: 'view', type: 'select', label: 'Show', options: [['All 15 chips', 'all'], ['Microcontrollers only', 'mcu'], ['In mass production only', 'prod']], value: params.view || 'all' },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear the features' }] }
      ], (id, v) => {
        if (id === 'preset') sel = new Set(PRESETS[v][1].map(idx).filter(i => i >= 0));
        if (id === 'clear') { sel = new Set(); ctl.set('preset', 0); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['n', 'Chips with all of them'], ['who', 'They are'], ['pick', 'The chip you clicked']]);
      const chipsShown = () => {
        const v = ctl.values.view;
        return E.CHIPS.filter(c => v === 'all' || (v === 'mcu' && !c.coproc) || (v === 'prod' && isProd(c))).slice().sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));
      };
      const lit = c => [...sel].every(i => FEATS[i][1](c));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const list = chipsShown(), W = st.W, H = st.H;
        const labW = clamp(W * 0.22, 76, 128), M = 8, top = 84, bottom = 50;
        const cw = (W - labW - 2 * M) / FEATS.length, rh = clamp((H - top - bottom) / Math.max(1, list.length), 14, 30);
        hits = [];
        // the column headers
        FEATS.forEach(([name], i) => {
          const x = M + labW + i * cw, on = sel.has(i);
          if (on) { c.fillStyle = C.dark ? 'rgba(130,150,255,.16)' : 'rgba(60,80,220,.10)'; c.fillRect(x, 6, cw, top - 6 + rh * list.length + 4); }
          c.save();
          c.translate(x + cw / 2 + 4, top - 8);
          c.rotate(-0.95);
          c.font = (on ? '700 ' : '550 ') + (W < 520 ? 10 : 11.5) + 'px system-ui, "Segoe UI", sans-serif';
          c.textAlign = 'left'; c.textBaseline = 'middle';
          c.fillStyle = on ? C.accent : C.text2;
          c.fillText(name, 0, 0);
          c.restore();
          hits.push({ kind: 'feat', i, x, y: 0, w: cw, h: top });
        });
        // the rows
        let n = 0; const who = [];
        list.forEach((ch, r) => {
          const y = top + r * rh, on = lit(ch);
          if (on) { n++; who.push(shortName(ch)); }
          c.globalAlpha = on ? 1 : 0.22;
          if (pick === ch.id) { c.fillStyle = C.dark ? 'rgba(255,255,255,.10)' : 'rgba(0,0,0,.07)'; c.fillRect(M, y, W - 2 * M, rh); }
          kit.label(c, W < 520 ? shortName(ch) : fullName(ch), M + 2, y + rh / 2, { size: W < 520 ? 10.5 : 11.5, weight: 650, color: C.text });
          FEATS.forEach(([, f], j) => {
            const cx = M + labW + j * cw + cw / 2, cy = y + rh / 2, has = f(ch), rad = Math.max(2.5, Math.min(cw, rh) * 0.32);
            if (has) kit.dot(c, cx, cy, rad, kit.hue(hueOf(ch), 0.95));
            else kit.dot(c, cx, cy, 2, C.faint);
          });
          c.globalAlpha = 1;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(M, Math.round(y + rh) + 0.5); c.lineTo(W - M, Math.round(y + rh) + 0.5); c.stroke();
          hits.push({ kind: 'chip', id: ch.id, x: 0, y, w: labW + M, h: rh });
        });
        // the foot
        const fy = top + list.length * rh + 18;
        const note = sel.size ? n + (n === 1 ? ' chip has' : ' chips have') + ' all ' + sel.size + (sel.size === 1 ? ' feature' : ' features') + ' chosen' : 'Click a feature at the top to start';
        kit.label(c, note, M + 2, fy, { size: 12.5, weight: 650, color: n === 0 && sel.size ? C.bad : C.text });
        const pc = pick ? E.chip(pick) : null;
        kit.label(c, clip(pc ? pc.name + ' · ' + pc.year + ' · ' + pc.tagline : 'Dots are coloured by processor: green RISC-V, red Xtensa, amber ESP8266', W - 2 * M, 11), M + 2, fy + 20, { size: 11, color: C.muted });
        ro.set('n', sel.size ? n + ' of ' + list.length : '— (no feature chosen)');
        ro.set('who', sel.size ? (who.join(', ') || 'none') : '—');
        ro.set('pick', pc ? pc.name + ': ' + pc.tagline : '—');
      }, box.stage);
      kit.click(st, p => {
        const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h);
        if (!h) return;
        if (h.kind === 'feat') { if (sel.has(h.i)) sel.delete(h.i); else sel.add(h.i); ctl.set('preset', 0); }
        else pick = pick === h.id ? null : h.id;
        loop.once();
      }, p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ so-family-tree */
  Hyper.sim('so-family-tree', {
    title: 'Which chip replaces which',
    blurb: `Chips in lanes, placed by the year they appeared. A **solid arrow** means "replaces or takes over from"; a **thin green arrow** means "adds to"; a **dashed amber line** pairs a chip with the radio it is usually sold with. Solid boxes are in mass production, dashed ones are sampling or announced.

**Try this**
- Click the **ESP8266**: three arrows leave it — the old family tree of cheap Wi-Fi.
- Click the **ESP32-S3** and see what feeds it: the original ESP32 and the S2.
- Click the **ESP32-P4**: it has no arrow of descent, only the companions it needs for a radio.
- Watch the lanes: the C series grows towards Wi-Fi 6, the H series towards coin cells.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380, maxH: 540 });
      const LANES = [
        { name: 'The Xtensa line, from the ESP8266', ids: ['esp8266', 'esp32', 'esp32-s2', 'esp32-s3', 'esp32-s31'] },
        { name: 'C series: low cost', ids: ['esp32-c3', 'esp32-c2', 'esp32-c61'] },
        { name: 'C series: Wi-Fi 6 and 802.15.4', ids: ['esp32-c6', 'esp32-c5'] },
        { name: 'H series: no Wi-Fi', ids: ['esp32-h2', 'esp32-h4', 'esp32-h21'] },
        { name: 'No radio, or radio only', ids: ['esp32-p4', 'esp32-e22'] }
      ];
      const EDGES = [
        ['esp8266', 'esp32', 'replaces', 'The ESP32 (2016) took over from the ESP8266: two cores, Bluetooth, more of everything.'],
        ['esp8266', 'esp32-c2', 'replaces', 'Espressif names the ESP8684 (ESP32-C2) as the upgrade from the ESP8266.'],
        ['esp8266', 'esp32-c3', 'replaces', 'The ESP32-C3 replaces the ESP8266 in almost every way and is the usual choice today.'],
        ['esp32', 'esp32-s3', 'replaces', 'The S3 is the successor for new work: it gives up Bluetooth Classic, the DAC and the Ethernet MAC.'],
        ['esp32-s2', 'esp32-s3', 'replaces', 'The S3 does everything the S2 does and adds a second core and Bluetooth LE.'],
        ['esp32-c3', 'esp32-c6', 'adds', 'The C6 adds Wi-Fi 6, an 802.15.4 radio and a low-power core.'],
        ['esp32-c3', 'esp32-c61', 'adds', 'The C61 is the low-cost next step for Wi-Fi 6, with PSRAM.'],
        ['esp32-c6', 'esp32-c5', 'adds', 'The C5 adds 5 GHz, a faster core and PSRAM.'],
        ['esp32-h2', 'esp32-h4', 'adds', 'The H4 adds a second core, LE Audio, touch pins and USB.'],
        ['esp32-h2', 'esp32-h21', 'adds', 'The H21 adds an on-chip DC-DC converter for far lower receive current.'],
        ['esp32-s3', 'esp32-s31', 'adds', 'The S31 adds every radio, gigabit Ethernet and high-speed USB.'],
        ['esp32', 'esp32-s31', 'adds', 'Bluetooth Classic returns with the S31: the only other chip that has it.'],
        ['esp32-c6', 'esp32-p4', 'companion', 'The ESP32-P4 has no radio: boards usually pair it with an ESP32-C6.'],
        ['esp32-c5', 'esp32-p4', 'companion', 'A C5 can be the P4\'s companion when dual-band Wi-Fi is wanted.']
      ];
      let pick = params.chip || null, place = {}, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: [['Click a chip …', '']].concat(E.CHIPS.slice().sort((a, b) => a.year - b.year || a.name.localeCompare(b.name)).map(c => [fullName(c), c.id])), value: E.chip(pick) ? pick : '' },
        { id: 'comp', type: 'check', label: 'Show the companion links', value: true }
      ], (id, v) => { if (id === 'chip') pick = v || null; loop.once(); });
      const ro = kit.readout(box.side, [['chip', 'Chip'], ['status', 'Status'], ['role', 'In a line'], ['links', 'Its links']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const labW = clamp(W * 0.19, 62, 118), M = 8, top = 30, bottom = 40, y0 = 2014, y1 = 2026;
        const laneH = (H - top - bottom) / LANES.length, nodeW = clamp((W - labW - 2 * M) / (y1 - y0 + 1) * 0.92, 26, 74), nodeH = clamp(laneH * 0.52, 22, 36);
        const xOf = yr => M + labW + nodeW / 2 + (yr - y0) * ((W - labW - 2 * M - nodeW) / (y1 - y0));
        // the year axis
        for (let yr = y0; yr <= y1; yr += 2) {
          const x = xOf(yr);
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(Math.round(x) + 0.5, top - 6); c.lineTo(Math.round(x) + 0.5, H - bottom + 6); c.stroke();
          kit.label(c, String(yr), x, 14, { size: 10.5, color: C.muted, align: 'center' });
        }
        place = {};
        LANES.forEach((ln, r) => {
          const cy = top + laneH * (r + 0.5);
          if (r) { c.strokeStyle = C.grid; c.beginPath(); c.moveTo(M, top + laneH * r); c.lineTo(W - M, top + laneH * r); c.stroke(); }
          words(ln.name, W < 520 ? 11 : 20).slice(0, 4).forEach((t, k, a) => kit.label(c, t, M + 2, cy + (k - (a.length - 1) / 2) * 12, { size: W < 520 ? 9.5 : 10.5, color: C.muted }));
          ln.ids.forEach(id => { const ch = E.chip(id); if (ch) place[id] = { x: xOf(ch.year), y: cy, w: nodeW, h: nodeH, ch }; });
        });
        const touches = e => pick && (e[0] === pick || e[1] === pick);
        const anchorEdge = (a, b) => {
          if (b.x - a.x >= (a.w + b.w) / 2 + 4) return [a.x + a.w / 2, a.y, b.x - b.w / 2, b.y, 'h'];
          if (a.x - b.x >= (a.w + b.w) / 2 + 4) return [a.x - a.w / 2, a.y, b.x + b.w / 2, b.y, 'h'];
          return b.y > a.y ? [a.x, a.y + a.h / 2, b.x, b.y - b.h / 2, 'v'] : [a.x, a.y - a.h / 2, b.x, b.y + b.h / 2, 'v'];
        };
        // the edges, behind the boxes
        EDGES.forEach(e => {
          const a = place[e[0]], b = place[e[1]];
          if (!a || !b) return;
          if (e[2] === 'companion' && !ctl.values.comp) return;
          const [x1, y1p, x2, y2p, dir] = anchorEdge(a, b), on = touches(e), dim = pick && !on;
          c.save();
          c.globalAlpha = dim ? 0.16 : on ? 1 : 0.7;
          c.strokeStyle = e[2] === 'replaces' ? C.accent : e[2] === 'adds' ? C.ok : C.warn;
          c.lineWidth = e[2] === 'replaces' ? (on ? 3 : 2.2) : (on ? 2.4 : 1.4);
          if (e[2] === 'companion') c.setLineDash([5, 4]);
          c.beginPath(); c.moveTo(x1, y1p);
          if (dir === 'h') { const k = Math.abs(x2 - x1) * 0.45; c.bezierCurveTo(x1 + (x2 > x1 ? k : -k), y1p, x2 - (x2 > x1 ? k : -k), y2p, x2, y2p); }
          else { const k = Math.abs(y2p - y1p) * 0.45; c.bezierCurveTo(x1, y1p + (y2p > y1p ? k : -k), x2, y2p - (y2p > y1p ? k : -k), x2, y2p); }
          c.stroke(); c.setLineDash([]);
          if (e[2] !== 'companion') {
            const ang = dir === 'h' ? (x2 > x1 ? 0 : Math.PI) : (y2p > y1p ? Math.PI / 2 : -Math.PI / 2);
            c.fillStyle = c.strokeStyle; c.beginPath(); c.moveTo(x2, y2p);
            c.lineTo(x2 - 8 * Math.cos(ang - 0.45), y2p - 8 * Math.sin(ang - 0.45)); c.lineTo(x2 - 8 * Math.cos(ang + 0.45), y2p - 8 * Math.sin(ang + 0.45)); c.closePath(); c.fill();
          }
          c.restore();
        });
        // the chips
        hits = [];
        Object.keys(place).forEach(id => {
          const p = place[id], ch = p.ch, near = pick && (id === pick || EDGES.some(e => touches(e) && (e[0] === id || e[1] === id))), dim = pick && !near;
          const hue = hueOf(ch), solid = isProd(ch), retired = id === 'esp8266';
          c.save();
          c.globalAlpha = dim ? 0.3 : 1;
          rr(c, p.x - p.w / 2, p.y - p.h / 2, p.w, p.h, 7);
          c.fillStyle = retired ? (C.dark ? 'rgba(200,200,200,.18)' : 'rgba(80,80,80,.14)') : solid ? kit.hue(hue, 0.28) : kit.hue(hue, 0.08);
          c.fill();
          if (!solid && !retired) c.setLineDash([4, 3]);
          c.strokeStyle = id === pick ? C.text : retired ? C.muted : kit.hue(hue, 0.95); c.lineWidth = id === pick ? 2.6 : 1.6; c.stroke(); c.setLineDash([]);
          const label = nodeW < 40 ? (id === 'esp8266' ? '8266' : id === 'esp32' ? '32' : shortName(ch)) : shortName(ch);
          kit.label(c, label, p.x, p.y - 4, { size: nodeW < 40 ? 10 : 11.5, weight: 700, align: 'center', color: C.text });
          kit.label(c, String(ch.year), p.x, p.y + 9, { size: 9, align: 'center', color: C.muted });
          c.restore();
          hits.push({ id, x: p.x - p.w / 2, y: p.y - p.h / 2, w: p.w, h: p.h });
        });
        // the key
        const ky = H - 16;
        kit.label(c, clip('solid: in mass production  ·  dashed: sampling or announced  ·  grey: retired', W - 2 * M, 10), M + 2, ky, { size: 10, color: C.muted });
        const pc = pick ? E.chip(pick) : null;
        ro.set('chip', pc ? pc.name + ' (' + pc.year + ')' : '—');
        ro.set('status', pc ? pc.status : '—');
        ro.set('role', pc ? pc.tagline : 'Click a chip in the picture');
        if (pc) {
          const outs = EDGES.filter(e => e[0] === pick).map(e => 'leads to ' + shortName(E.chip(e[1])) + ': ' + e[3]);
          const ins = EDGES.filter(e => e[1] === pick && e[2] !== 'companion').map(e => 'comes from ' + shortName(E.chip(e[0])) + ': ' + e[3]);
          const comp = EDGES.filter(e => e[1] === pick && e[2] === 'companion').map(e => 'is paired with ' + shortName(E.chip(e[0])) + ': ' + e[3]);
          const all = ins.concat(outs, comp);
          ro.set('links', all.length ? all.join('  ') : 'No arrows: it stands alone in this picture.');
        } else ro.set('links', '—');
      }, box.stage);
      kit.click(st, p => {
        const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h);
        pick = h ? (h.id === pick ? null : h.id) : null;
        ctl.set('chip', pick || '');
        loop.once();
      }, p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ so-family-bars */
  Hyper.sim('so-family-bars', {
    title: 'The family ranked by one number',
    blurb: `Pick a number and the whole family lines up by it. Bars are drawn straight from the chip catalogue; where Espressif has published no figure the row says so, and where a chip simply lacks the thing (no Wi-Fi, no ADC) it says *none*.

**Try this**
- **CPU clock**, then **Cores × clock**: the second core moves the original ESP32 well above a C3, and the P4, S31 and the E22 co-processor pull far ahead.
- **Deep-sleep current** (lower is better, so the best is on top): the C3, C2 and H21 sleep at 5 µA; the S2 needs 25 µA.
- **Receive current**: the H21 and H2, which carry no Wi-Fi radio, lead by a wide margin.
- Turn on the **log scale** for Wi-Fi data rate: the co-processor's 2400 Mbit/s no longer hides the rest.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 420, maxH: 620 });
      const METRICS = [
        { id: 'mhz', label: 'CPU clock', unit: 'MHz', get: c => c.mhz, best: 'high' },
        { id: 'total', label: 'Cores × clock', unit: 'MHz', get: c => (c.cores && c.mhz ? c.cores * c.mhz : null), best: 'high' },
        { id: 'ram', label: 'RAM', unit: 'KB', get: c => c.sram, best: 'high' },
        { id: 'gpio', label: 'GPIO pins', unit: '', get: c => c.gpio, best: 'high' },
        { id: 'adc', label: 'ADC channels', unit: '', get: c => (!c.adc ? 0 : c.adc.ch === 0 && c.adc.units > 0 ? null : c.adc.ch), best: 'high' },
        { id: 'sleep', label: 'Deep-sleep current', unit: 'µA', get: c => c.sleepUa, best: 'low' },
        { id: 'rx', label: 'Receive current', unit: 'mA', get: c => c.rxMa, best: 'low' },
        { id: 'tx', label: 'Transmit current', unit: 'mA', get: c => c.txMa, best: 'low' },
        { id: 'rate', label: 'Wi-Fi data rate, at most', unit: 'Mbit/s', get: c => (c.wifi ? c.wifi.mbps : 0), best: 'high' },
        { id: 'year', label: 'Year of introduction', unit: '', get: c => c.year, best: 'old' }
      ];
      const M0 = METRICS.find(m => m.id === params.metric) || METRICS[0];
      let pick = E.chip(params.chip) ? params.chip : null, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'metric', type: 'select', label: 'Rank the chips by', options: METRICS.map(m => [m.label + (m.unit ? ' (' + m.unit + ')' : ''), m.id]), value: M0.id },
        { id: 'log', type: 'check', label: 'Logarithmic scale', value: false },
        { id: 'prod', type: 'check', label: 'Only chips in mass production', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['chip', 'Chip'], ['val', 'Value'], ['rank', 'Place'], ['note', 'Note']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const m = METRICS.find(x => x.id === ctl.values.metric) || METRICS[0];
        let list = E.CHIPS.filter(ch => !ctl.values.prod || isProd(ch)).map(ch => ({ ch, v: m.get(ch) }));
        const known = list.filter(r => r.v != null && r.v > 0), rest = list.filter(r => !(r.v != null && r.v > 0));
        known.sort((a, b) => (m.best === 'low' || m.best === 'old' ? a.v - b.v : b.v - a.v) || a.ch.name.localeCompare(b.ch.name));
        rest.sort((a, b) => (a.v == null ? 1 : 0) - (b.v == null ? 1 : 0));
        list = known.concat(rest);
        const M = 8, labW = clamp(W * 0.23, 82, 140), valW = 84, top = 34, bottom = 30;
        const x0 = M + labW, bw = Math.max(40, W - x0 - M - valW), rh = clamp((H - top - bottom) / Math.max(1, list.length), 16, 30);
        const vmax = known.length ? Math.max(...known.map(r => r.v)) : 1, vmin = known.length ? Math.min(...known.map(r => r.v)) : 1;
        const logOn = ctl.values.log && m.id !== 'year' && vmax > vmin;
        const lo = m.id === 'year' ? 2012 : 0;
        const frac = v => {
          if (m.id === 'year') return clamp((v - lo) / (2027 - lo), 0.02, 1);
          if (logOn) return clamp(Math.log(v / (vmin / 2)) / Math.log(vmax / (vmin / 2)), 0.02, 1);
          return clamp(v / vmax, 0.012, 1);
        };
        kit.label(c, m.label + (m.unit ? ' (' + m.unit + ')' : '') + (m.best === 'low' ? ' — lower is better, best first' : m.best === 'old' ? ' — oldest first' : ' — highest first') + (logOn ? ' · log scale' : ''), M + 2, 14, { size: 12, weight: 650 });
        hits = [];
        list.forEach((r, i) => {
          const y = top + i * rh, ch = r.ch, sel = pick === ch.id, hue = hueOf(ch);
          if (sel) { c.fillStyle = C.dark ? 'rgba(255,255,255,.10)' : 'rgba(0,0,0,.07)'; c.fillRect(M, y, W - 2 * M, rh); }
          kit.label(c, clip(fullName(ch) + (ch.coproc ? ' *' : ''), labW - 6, 11.5), M + 2, y + rh / 2, { size: 11.5, weight: sel ? 750 : 600, color: C.text });
          if (r.v != null && r.v > 0) {
            const wbar = bw * frac(r.v);
            rr(c, x0, y + rh * 0.18, wbar, rh * 0.64, 3); c.fillStyle = sel ? C.accent : kit.hue(hue, isProd(ch) ? 0.85 : 0.4); c.fill();
            kit.label(c, fmtNum(r.v) + (m.unit ? ' ' + m.unit : ''), x0 + wbar + 6, y + rh / 2, { size: 11, weight: 600, color: C.text2 });
          } else kit.label(c, r.v == null ? 'not published' : 'none', x0 + 4, y + rh / 2, { size: 11, color: r.v == null ? C.warn : C.faint });
          hits.push({ id: ch.id, x: 0, y, w: W, h: rh });
        });
        kit.label(c, clip('* a co-processor, not a microcontroller · pale bars: sampling, announced or retired', W - 2 * M, 10), M + 2, H - 12, { size: 10, color: C.muted });
        const pi = list.findIndex(r => r.ch.id === pick), pr = pi >= 0 ? list[pi] : null;
        ro.set('chip', pr ? pr.ch.name : '—');
        ro.set('val', pr ? (pr.v == null ? 'not published at the time of writing' : pr.v === 0 ? 'none' : fmtNum(pr.v) + (m.unit ? ' ' + m.unit : '')) : 'Click a bar');
        ro.set('rank', pr && pr.v ? (pi + 1) + ' of ' + known.length : '—');
        ro.set('note', pr ? pr.ch.tagline : (m.id === 'sleep' || m.id === 'rx' || m.id === 'tx' ? 'These are the chip\'s own currents, not a board\'s.' : 'Figures are from the datasheets in the catalogue.'));
      }, box.stage);
      kit.click(st, p => {
        const h = hits.find(q => p.y >= q.y && p.y <= q.y + q.h && p.x >= q.x && p.x <= q.x + q.w);
        pick = h ? (h.id === pick ? null : h.id) : null;
        loop.once();
      }, p => hits.some(q => p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ so-pin-budget */
  Hyper.sim('so-pin-budget', {
    title: 'How many pins can you really use?',
    blurb: `Each square is one GPIO number of the chip, coloured from the pin table: **green** is free to use, **amber** is usable with care (a strapping pin, the console, the USB or a flash-voltage trap), **red** is not for you (flash and PSRAM). Switch to *What the pin does* for the reason behind each colour. **Click a pin** to read its note.

**Try this**
- The **ESP32-C3**: of 22 pin numbers only two are plain green, and seven are lost to flash.
- The **ESP32-C2**: only 14 pins, but none is red — the flash is inside the package.
- The **ESP32** and **ESP32-S3**: switch to *What the pin does* and see where the flash, strapping and USB pins sit.
- The **ESP32-P4**: 55 pins, none lost to flash — but some sit on other supply voltages.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 490, maxH: 620 });
      const ids = Object.keys(E.PINS).filter(id => E.chip(id));
      let chipId = ids.includes(params.chip) ? params.chip : 'esp32-c3', pick = null, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: ids.map(id => [E.chip(id).name, id]), value: chipId },
        { id: 'mode', type: 'select', label: 'Colour by', options: [['How safe the pin is', 'safe'], ['What the pin does', 'func']], value: 'safe' }
      ], (id, v) => { if (id === 'chip') { chipId = v; pick = null; } loop.once(); });
      const ro = kit.readout(box.side, [['n', 'GPIO numbers listed'], ['free', 'Free to use'], ['care', 'Use with care'], ['avoid', 'Not for you'], ['pin', 'The pin you clicked']]);
      const kindOf = p => p.flash ? 'flash' : p.usb ? 'usb' : p.strap ? 'strap' : p.uart0 ? 'uart' : p.dir === 'I' ? 'input' : p.dac ? 'dac' : p.touch ? 'touch' : p.adc ? 'adc' : 'gpio';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        chipId = ctl.values.chip;
        const cd = E.chip(chipId), P = E.PINS[chipId], pins = P ? P.gpios : [];
        const M = 10, cell = W < 520 ? 30 : 38, gap = 5, cols = Math.max(4, Math.floor((W - 2 * M + gap) / (cell + gap)));
        const gy = 36, rowsN = Math.max(1, Math.ceil(pins.length / cols));
        kit.label(c, clip(cd.name + ' · ' + pins.length + ' GPIO numbers in the pin table' + (cd.gpio != null && cd.gpio !== pins.length ? ' · ' + cd.gpio + ' on the chip' : ''), W - 2 * M, 12), M + 2, 14, { size: 12, weight: 650 });
        const mode = ctl.values.mode, cnt = { yes: 0, caution: 0, avoid: 0 }, kinds = {};
        hits = [];
        pins.forEach((p, i) => {
          const x = M + (i % cols) * (cell + gap), y = gy + Math.floor(i / cols) * (cell + gap), kind = kindOf(p);
          cnt[p.safe] = (cnt[p.safe] || 0) + 1; kinds[kind] = (kinds[kind] || 0) + 1;
          const col = mode === 'safe' ? (p.safe === 'yes' ? C.ok : p.safe === 'avoid' ? C.bad : C.warn) : S.kindColor(kind, 1);
          rr(c, x, y, cell, cell, 6);
          c.globalAlpha = 0.28; c.fillStyle = col; c.fill(); c.globalAlpha = 1;
          c.strokeStyle = col; c.lineWidth = pick === p.n ? 3 : 1.5; c.stroke();
          kit.label(c, String(p.n), x + cell / 2, y + cell / 2, { size: cell > 32 ? 12 : 10.5, weight: 700, align: 'center', color: C.text });
          hits.push({ n: p.n, x, y, w: cell, h: cell });
        });
        // what the colours mean, with counts
        let ly = gy + rowsN * (cell + gap) + 12, lx = M;
        const legend = mode === 'safe'
          ? [['free to use', C.ok, cnt.yes], ['use with care', C.warn, cnt.caution], ['not for you', C.bad, cnt.avoid]]
          : Object.keys(kinds).map(k => [(S.KINDS[k] || { name: k }).name.replace('GPIO, safe to use', 'plain GPIO'), S.kindColor(k, 1), kinds[k]]);
        legend.forEach(([name, col, n]) => {
          const label = name + ' · ' + n, wid = 22 + label.length * 6.1;
          if (lx + wid > W - M) { lx = M; ly += 18; }
          rr(c, lx, ly - 6, 12, 12, 3); c.globalAlpha = 0.35; c.fillStyle = col; c.fill(); c.globalAlpha = 1; c.strokeStyle = col; c.lineWidth = 1.3; c.stroke();
          kit.label(c, label, lx + 17, ly, { size: 11, color: C.text2 });
          lx += wid + 8;
        });
        // the budget as one bar
        const by = ly + 22, bwid = W - 2 * M, tot = Math.max(1, pins.length);
        let bx = M;
        [[cnt.yes, C.ok], [cnt.caution, C.warn], [cnt.avoid, C.bad]].forEach(([n, col]) => { const wd = bwid * (n || 0) / tot; if (wd > 0) { c.fillStyle = col; c.globalAlpha = 0.75; c.fillRect(bx, by, wd, 12); c.globalAlpha = 1; bx += wd; } });
        kit.label(c, clip(nz(cnt.yes) + ' of ' + pins.length + ' pin numbers are plain green' + (nz(cnt.avoid) ? ', ' + cnt.avoid + ' go to flash or PSRAM' : ''), W - 2 * M, 11.5), M + 2, by + 26, { size: 11.5, color: C.text2 });
        // the pin that was clicked
        const sp = pins.find(p => p.n === pick);
        if (sp) {
          const ny = by + 48;
          kit.label(c, 'GPIO' + sp.n + ' · ' + (sp.safe === 'yes' ? 'free to use' : sp.safe === 'avoid' ? 'not for you' : 'use with care'), M + 2, ny, { size: 12, weight: 700 });
          const maxL = Math.max(1, Math.min(5, Math.floor((H - (ny + 17) - 6) / 15) + 1)), wl = words(sp.note || '', Math.max(24, Math.floor((W - 2 * M) / 6.6)));
          wl.slice(0, maxL).forEach((t, k) => kit.label(c, k === maxL - 1 && wl.length > maxL ? t + ' …' : t, M + 2, ny + 17 + k * 15, { size: 11.5, color: C.text2 }));
        } else if (P) kit.label(c, 'Click a pin for its note.', M + 2, by + 48, { size: 11.5, color: C.muted });
        else kit.label(c, 'No pin table is published for this chip yet.', M + 2, gy + 20, { size: 12, color: C.warn });
        ro.set('n', pins.length + (cd.gpio != null ? ' (the chip has ' + cd.gpio + ')' : ''));
        ro.set('free', String(nz(cnt.yes)));
        ro.set('care', String(nz(cnt.caution)));
        ro.set('avoid', String(nz(cnt.avoid)));
        ro.set('pin', sp ? 'GPIO' + sp.n + ': ' + (sp.note || '') : 'Click a square');
      }, box.stage);
      kit.click(st, p => {
        const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h);
        pick = h ? (h.n === pick ? null : h.n) : null;
        loop.once();
      }, p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ so-battery-life */
  Hyper.sim('so-battery-life', {
    title: 'How long will the cell last?',
    blurb: `A node wakes, listens, sends, and sleeps again. The curve shows how long the chosen cell lasts against how often the node wakes; the dot is your setting. Only the **chip's own currents** from the catalogue are used (sleep, receive, transmit): a real board adds its regulator, LEDs and sensors, which often cost more than the chip.

Assumptions: 80 % of the cell's rating is usable, a rechargeable cell loses 3 % a month of its own accord and a non-rechargeable one 0.2 % a month. A Wi-Fi reconnect and send typically keeps the radio on for a few hundred milliseconds; a Zigbee or Thread poll, tens; a BLE advertisement, about ten.

**Try this**
- Start with the **H2**: wake every 10 minutes for 40 ms and the cell lasts for years; then pick a Wi-Fi chip with 400 ms awake and watch the curve fall.
- Compare the **C6** and the **H2** at the same wake time: the radio current decides.
- Pick the **CR2032** cell: the warning appears — a coin cell cannot give a Wi-Fi chip's transmit current.
- Raise the wake interval to a day: the curve flattens, because the cell's own self-discharge takes over.

Lithium cells (LiPo, 18650) need a proper charger and a protection circuit: never charge one from a GPIO or a bare supply, and never use a swollen, punctured or shorted cell.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 420, maxH: 580 });
      const chips = E.CHIPS.filter(c => c.sleepUa != null && c.rxMa != null && c.txMa != null && !c.coproc).sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));
      if (!chips.length) { box.stage.textContent = 'No chip with complete current figures.'; return; }
      const cells = E.CELLS;
      const pickId = (id, def) => (chips.some(c => c.id === id) ? id : def);
      const fmtT = v => (v < 90 ? Math.round(v) + ' s' : v < 5400 ? Math.round(v / 60) + ' min' : v < 172800 ? (Math.round(v / 360) / 10) + ' h' : Math.round(v / 86400) + ' days');
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(c => [fullName(c), c.id]), value: pickId(params.chip, chips[0].id) },
        { id: 'cmp', type: 'select', label: 'Compare with', options: [['—', '']].concat(chips.map(c => [fullName(c), c.id])), value: chips.some(c => c.id === params.compare) ? params.compare : '' },
        { id: 'cell', type: 'select', label: 'Cell', options: cells.map(x => [x.name, x.id]), value: cells.some(x => x.id === params.cell) ? params.cell : 'aa2' },
        { id: 'T', label: 'Wake every', min: 1, max: 86400, value: clamp(params.interval || 600, 1, 86400), log: true, fmt: fmtT },
        { id: 'awake', label: 'Awake each time', min: 5, max: 10000, value: clamp(params.awake || 400, 5, 10000), log: true, unit: 'ms' },
        { id: 'tx', label: 'Of that, transmitting', min: 0, max: 100, step: 5, value: 20, unit: '%' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['avg', 'Average current'], ['life', 'The cell lasts'], ['share', 'Charge spent awake'], ['peak', 'Peak while sending'], ['note', 'The cell']]);
      function model(ch, cell, T, awakeMs, txShare) {
        const awake = Math.min(awakeMs / 1000, T), f = txShare / 100;
        const avgAwake = ch.rxMa * (1 - f) + ch.txMa * f;
        const d = E.dutyCycle([{ mA: avgAwake, s: awake }, { mA: ch.sleepUa / 1000, s: Math.max(0, T - awake) }]);
        const life = E.batteryLife(cell.mAh, d.avg, { usable: 0.8, selfDischarge: cell.rechargeable ? 0.03 : 0.002 });
        return { avg: d.avg, days: life.days, years: life.years, share: d.share[0] };
      }
      const fmtLife = d => (d >= 730 ? (Math.round(d / 36.5) / 10) + ' years' : d >= 60 ? Math.round(d / 30.4) + ' months' : d >= 2 ? Math.round(d) + ' days' : (Math.round(d * 240) / 10) + ' hours');
      const fmtI = mA => (mA >= 1 ? kit.fmt(mA, 3) + ' mA' : kit.fmt(mA * 1000, 3) + ' µA');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, v = ctl.values;
        const A = E.chip(v.chip) || chips[0], B = v.cmp && v.cmp !== A.id ? E.chip(v.cmp) : null, cell = cells.find(x => x.id === v.cell) || cells[0];
        const px = 52, py = 30, pw = W - px - 16, ph = Math.max(150, H - 30 - 150);
        const xT = t => px + clamp(Math.log(t) / Math.log(86400), 0, 1) * pw;
        const Ymin = 1, Ymax = 7300, yD = d => py + ph - clamp(Math.log(Math.max(d, Ymin)) / Math.log(Ymax / Ymin), 0, 1) * ph;
        kit.label(c, 'Cell life against how often the node wakes', px, 13, { size: 12, weight: 650 });
        // the grid
        c.lineWidth = 1;
        [[1, '1 day'], [7, '1 week'], [30, '1 month'], [365, '1 year'], [3650, '10 years']].forEach(([d, t]) => {
          const y = Math.round(yD(d)) + 0.5; c.strokeStyle = C.grid; c.beginPath(); c.moveTo(px, y); c.lineTo(px + pw, y); c.stroke();
          kit.label(c, t, px - 5, y, { size: 10, color: C.muted, align: 'right' });
        });
        [[1, '1 s'], [10, '10 s'], [60, '1 min'], [600, '10 min'], [3600, '1 h'], [86400, '1 day']].forEach(([t, s]) => {
          const x = Math.round(xT(t)) + 0.5; c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x, py); c.lineTo(x, py + ph); c.stroke();
          kit.label(c, s, x, py + ph + 11, { size: 10, color: C.muted, align: 'center' });
        });
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(px, py); c.lineTo(px, py + ph); c.lineTo(px + pw, py + ph); c.stroke();
        kit.label(c, 'wakes every …', px + pw, py + ph + 25, { size: 10.5, color: C.text2, align: 'right' });
        // the curves
        const draw = (ch, col) => {
          c.strokeStyle = col; c.lineWidth = 2.4; c.beginPath();
          for (let i = 0; i <= 90; i++) {
            const T = Math.pow(86400, i / 90), m = model(ch, cell, T, v.awake, v.tx), x = xT(T), y = yD(m.days);
            if (i) c.lineTo(x, y); else c.moveTo(x, y);
          }
          c.stroke();
          const me = model(ch, cell, v.T, v.awake, v.tx);
          kit.dot(c, xT(v.T), yD(me.days), 5.5, col, C.bg2);
          return me;
        };
        const mA = draw(A, C.accent), mB = B ? draw(B, C.warn) : null;
        c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(xT(v.T), py); c.lineTo(xT(v.T), py + ph); c.stroke(); c.setLineDash([]);
        // the legend and the numbers
        let ly = py + ph + 44;
        kit.dot(c, px + 5, ly, 5, C.accent);
        kit.label(c, fullName(A) + ': ' + fmtI(mA.avg) + ' on average → ' + fmtLife(mA.days), px + 16, ly, { size: 11.5, weight: 650 });
        if (B) { ly += 18; kit.dot(c, px + 5, ly, 5, C.warn); kit.label(c, fullName(B) + ': ' + fmtI(mB.avg) + ' on average → ' + fmtLife(mB.days), px + 16, ly, { size: 11.5, weight: 650 }); }
        ly += 20;
        const peak = Math.max(A.txMa, B ? B.txMa : 0), bad = cell.id === 'cr2032' && peak > 15;
        words(bad ? 'A CR2032 can give only a few milliamps: the transmit peak of ' + peak + ' mA would collapse it. It needs a large capacitor, or another cell.' : cell.note, Math.max(30, Math.floor(pw / 6.2))).slice(0, 3).forEach((t, k) => kit.label(c, t, px, ly + k * 14, { size: 10.5, color: bad ? C.bad : C.muted }));
        ro.set('avg', fmtI(mA.avg) + (B ? '  ·  ' + fmtI(mB.avg) : ''));
        ro.set('life', fmtLife(mA.days) + (B ? '  ·  ' + fmtLife(mB.days) : ''));
        ro.set('share', Math.round(mA.share * 100) + ' %' + (B ? '  ·  ' + Math.round(mB.share * 100) + ' %' : ''));
        ro.set('peak', A.txMa + ' mA' + (B ? '  ·  ' + B.txMa + ' mA' : ''));
        ro.set('note', cell.name + ', ' + cell.mAh + ' mAh');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ so-migrate */
  Hyper.sim('so-migrate', {
    title: 'Moving a design to another chip',
    blurb: `Choose the chip a design uses now and the one you are thinking of moving to. The lists are worked out from the catalogue: **what you gain**, **what you lose**, and anything for which a chip's figure is not published. A lost item is not always a problem — only if the design uses it.

**Try this**
- **ESP8266 → ESP32-C2**: Espressif's own upgrade path; see what the ESP8266 had that the C2 does not.
- **ESP32 → ESP32-S3**: more modern, and yet it loses Bluetooth Classic, the DAC and Ethernet.
- **ESP32-C3 → ESP32-C6**: nearly all gain.
- **ESP32-S2 → ESP32-S3**: the "superseded" move, with a few losses (the DACs).`,
    mount(box, kit, params) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 420, maxH: 600 });
      const chips = E.CHIPS.filter(c => !c.coproc).sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));
      const pickId = (id, def) => (chips.some(c => c.id === id) ? id : def);
      const ITEMS = [
        { k: 'num', label: 'Processor cores', get: c => c.cores },
        { k: 'num', label: 'CPU clock (MHz)', get: c => c.mhz },
        { k: 'num', label: 'RAM (KB)', get: c => c.sram },
        { k: 'bool', label: 'Floating-point unit', get: c => !!c.fpu },
        { k: 'bool', label: 'PSRAM support', get: hasPsram },
        { k: 'bool', label: 'A low-power coprocessor', get: c => !!c.lp },
        { k: 'num', label: 'Wi-Fi generation', get: c => (c.wifi ? c.wifi.gen : 0), fmt: v => (v ? 'Wi-Fi ' + v : 'none') },
        { k: 'bool', label: '5 GHz Wi-Fi', get: c => !!c.wifi && c.wifi.bands.includes(5) },
        { k: 'bool', label: 'Bluetooth LE', get: c => !!c.bt },
        { k: 'bool', label: 'Bluetooth Classic', get: c => !!c.bt && !!c.bt.classic },
        { k: 'bool', label: 'Zigbee and Thread', get: c => !!c.ieee802154 },
        { k: 'num', label: 'GPIO pins', get: c => c.gpio },
        { k: 'num', label: 'ADC channels', get: c => (!c.adc ? 0 : c.adc.ch === 0 && c.adc.units > 0 ? null : c.adc.ch) },
        { k: 'num', label: 'DAC channels', get: c => nz(c.dac) },
        { k: 'num', label: 'Touch pins', get: c => nz(c.touch) },
        { k: 'num', label: 'UART', get: c => c.uart },
        { k: 'num', label: 'I2C', get: c => c.i2c },
        { k: 'num', label: 'SPI', get: c => c.spi },
        { k: 'num', label: 'I2S', get: c => c.i2s },
        { k: 'num', label: 'CAN controllers', get: c => c.twai },
        { k: 'num', label: 'PWM channels', get: c => c.ledc },
        { k: 'bool', label: 'USB OTG (keyboard, drive)', get: hasOtg },
        { k: 'bool', label: 'USB of any kind', get: c => (c.usb || []).length > 0 },
        { k: 'bool', label: 'Ethernet MAC', get: c => !!c.eth },
        { k: 'bool', label: 'Camera interface', get: c => (c.cam || []).length > 0 },
        { k: 'bool', label: 'Secure boot in hardware', get: c => (c.security || []).some(x => /secure boot/i.test(x) && !/^none\b/i.test(x)) },
        { k: 'bool', label: 'Flash encryption in hardware', get: c => (c.security || []).some(x => /flash.*encrypt|encrypt.*flash|external.*encrypt/i.test(x) && !/^none\b/i.test(x)) },
        { k: 'low', label: 'Deep sleep (µA)', get: c => c.sleepUa },
        { k: 'low', label: 'Receive (mA)', get: c => c.rxMa },
        { k: 'low', label: 'Transmit (mA)', get: c => c.txMa },
        { k: 'bool', label: 'Arduino-ESP32 core (stable)', get: c => !!c.sw && c.sw.arduino === true },
        { k: 'bool', label: 'MicroPython build', get: c => !!c.sw && !!c.sw.mpy }
      ];
      const ctl = kit.controls(box.side, [
        { id: 'from', type: 'select', label: 'The design uses', options: chips.map(c => [fullName(c), c.id]), value: pickId(params.from, 'esp8266') },
        { id: 'to', type: 'select', label: 'Move it to', options: chips.map(c => [fullName(c), c.id]), value: pickId(params.to, 'esp32-c3') }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['gain', 'You gain'], ['lose', 'You lose'], ['same', 'Unchanged'], ['unk', 'Not published']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const A = E.chip(ctl.values.from), B = E.chip(ctl.values.to);
        const M = 10, colW = (W - 3 * M) / 2, top = 84;
        // the two cards
        [[A, M], [B, M * 2 + colW]].forEach(([ch, x]) => {
          rr(c, x, 8, colW, 54, 8); c.fillStyle = kit.hue(hueOf(ch), 0.14); c.fill(); c.strokeStyle = kit.hue(hueOf(ch), 0.9); c.lineWidth = 1.5; c.stroke();
          kit.label(c, fullName(ch), x + 10, 24, { size: 13.5, weight: 700 });
          kit.label(c, clip(ch.year + ' · ' + ch.status, colW - 20, 11), x + 10, 44, { size: 11, color: isProd(ch) ? C.text2 : C.warn });
        });
        const gain = [], lose = [], same = [], unk = [];
        ITEMS.forEach(it => {
          const a = it.get(A), b = it.get(B), f = it.fmt || (v => fmtNum(v));
          if (a == null || b == null || a !== a || b !== b) { unk.push(it.label); return; }
          if (a === b) { if (a) same.push(it.label); return; }
          if (it.k === 'bool') { (b ? gain : lose).push(it.label); return; }
          const better = it.k === 'low' ? b < a : b > a;
          (better ? gain : lose).push(it.label + ': ' + f(a) + ' → ' + f(b));
        });
        const rowH = 16, maxRows = Math.max(3, Math.floor((H - top - 54) / rowH));
        const col = (title, list, x, color, sign) => {
          kit.label(c, title + ' · ' + list.length, x, top, { size: 12.5, weight: 700, color });
          c.strokeStyle = color; c.globalAlpha = 0.5; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, top + 11); c.lineTo(x + colW, top + 11); c.stroke(); c.globalAlpha = 1;
          if (!list.length) kit.label(c, 'nothing', x, top + 26, { size: 11.5, color: C.faint });
          list.slice(0, maxRows).forEach((t, i) => kit.label(c, clip(sign + ' ' + t, colW, 11.5), x, top + 26 + i * rowH, { size: 11.5, color: C.text }));
          if (list.length > maxRows) kit.label(c, '… and ' + (list.length - maxRows) + ' more', x, top + 26 + maxRows * rowH, { size: 11, color: C.muted });
        };
        if (A.id === B.id) kit.label(c, 'Choose two different chips.', M, top + 10, { size: 12.5, color: C.muted });
        else {
          col('You gain', gain, M, C.ok, '+');
          col('You lose', lose, M * 2 + colW, C.bad, '−');
          kit.label(c, clip(same.length + ' things stay the same' + (unk.length ? ' · not published for one of them: ' + unk.length : ''), W - 2 * M, 11), M, H - 14, { size: 11, color: C.muted });
        }
        const none = A.id === B.id;
        ro.set('gain', none ? '—' : gain.length + ' things');
        ro.set('lose', none ? '—' : lose.length + ' things');
        ro.set('same', none ? '—' : same.length + ' things');
        ro.set('unk', unk.length ? unk.join(', ') : 'nothing');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
