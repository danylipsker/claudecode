/* HYPER-ESP32 · sims/modules-and-packages.js
 *
 * Modules and how they are named. Facts come from the module records of the catalogue (kit.esp.MODULES).
 *
 *   mo-anatomy      the parts of a module, with the can on and lifted, and of a system in package (params: { view: 'sip' })
 *   mo-decoder      a module name read piece by piece: click a piece, see what it says and what it costs
 *   mo-sizes        every module of the catalogue drawn to scale (params: { view: 'families' })
 *   mo-memcost      pick a module and its flash and PSRAM and watch the GPIOs disappear (params: { focus: 'flash' | 'psram' })
 *   mo-antenna      PCB antenna against a connector: gain, cable, enclosure and what they do to the range
 *   mo-approval     does the module's approval still cover the product?
 *   mo-placement    the module on a board: antenna at the edge, copper under the antenna, a battery beside it
 *   mo-fakeflash    a flash chip that claims more than it holds, and the write test that shows it
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- helpers */
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const rec = (E, name) => E.MODULES.find(m => m.name === name);
  const family = n => (/PICO-MINI/.test(n) ? 'PICO' : /WROOM/.test(n) ? 'WROOM' : /WROVER/.test(n) ? 'WROVER' : /MINI/.test(n) ? 'MINI' : /SOLO/.test(n) ? 'SOLO' : /PICO/.test(n) ? 'PICO' : 'other');
  // the flash of these modules is inside the chip's package (from the module notes of the catalogue)
  const flashInside = n => /MINI|ESP868[45]|H2-WROOM|PICO/.test(n);
  // a module's size as [short side, long side] in millimetres (a few records list them the other way round)
  const dims = m => (m && m.size ? [Math.min(m.size[0], m.size[1]), Math.max(m.size[0], m.size[1]), m.size[2] || 0] : [18, 25.5, 3.1]);
  const mb = v => (v >= 1 ? v + ' MB' : '—');
  // '2 MB (in package) / 8 MB (in package)' -> '2 / 8 MB'
  const memLabel = str => { const n = (String(str || '').match(/(\d+)\s*MB/g) || []).map(t => parseInt(t, 10)).filter((v, i, a) => a.indexOf(v) === i); return n.length ? n.join(' / ') + ' MB' : '—'; };
  // draws wrapped text, left aligned; returns the y below the last line
  function wrap(S, c, text, x, y, maxW, lh, o) {
    const words = String(text).split(' ');
    let line = '';
    c.save(); c.font = (o.weight || 500) + ' ' + (o.size || 12) + 'px system-ui, "Segoe UI", sans-serif';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (c.measureText(t).width > maxW && line) { S.text(c, line, x, y, { size: o.size, color: o.color, align: 'left', weight: o.weight }); y += lh; line = w; }
      else line = t;
    }
    c.restore();
    if (line) { S.text(c, line, x, y, { size: o.size, color: o.color, align: 'left', weight: o.weight }); y += lh; }
    return y;
  }
  const inRect = (p, r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;

  /* ================================================================ mo-anatomy */
  const PART = {
    antenna: ['The antenna', 'A meandering copper track on the module\'s board, or on a U version a tiny coaxial socket for an antenna of your own. It is what lets the radio reach anything; without a proper one the range is a few centimetres.'],
    keepout: ['The keep-out area', 'The space round the antenna where there must be no copper, no tracks, no parts and no metal. The module was tested and approved with this space empty; fill it and the range and the approval go.'],
    can: ['The shield can', 'A thin metal cover that keeps outside noise out and the module\'s own noise in. It carries the printed name and the marks the markets require. It is lifted in the second view to show what is under it.'],
    pads: ['The pads', 'Each pad is a pin of the chip or a power or ground connection; the datasheet lists them. Pins that serve the flash, and on some versions the PSRAM, never reach a pad.'],
    chip: ['The ESP chip', 'The processor, its RAM, the radio and the peripherals. Everything else on the module exists to feed it, clock it, give it memory and let its radio out.'],
    flash: ['The flash memory', 'Holds the program, the file system and the settings. On a WROOM or WROVER module it is a separate chip on the board, wired to pins the module hides; on a MINI module it sits inside the chip\'s package, so none is drawn here.'],
    psram: ['The PSRAM', 'Extra RAM of 2 to 32 MB, wired like the flash. On a WROVER it is a separate chip; on other modules the optional PSRAM sits in the chip\'s package (drawn dashed). It takes pins from the chip.'],
    crystal: ['The crystal', 'The timing reference for the processor and the radio. Its frequency depends on the chip; 40 MHz is the usual.'],
    match: ['The radio matching network', 'A few tiny capacitors and inductors between the chip\'s radio pin and the antenna. They make the two agree, so that the signal passes with little loss, and filter out stray frequencies.'],
    caps: ['The decoupling capacitors', 'A small reservoir beside each supply pin, so that the chip\'s sudden bursts of current do not make the supply sag.'],
    chipdie: ['The chip die', 'The ESP chip itself, bare, inside the package. Its wires run to the flash die and to the package pads.'],
    flashdie: ['The flash die', 'A second silicon die in the same package, holding the program. Its wires stay inside the package, so the chip pins that serve it are not on the board.'],
    psramdie: ['The PSRAM die', 'On some parts a third die, with 2 or 8 MB of extra RAM, also inside the package.'],
    rfpin: ['The antenna connection', 'The package has no antenna. The radio signal leaves on one pad, and you must lay a 50 ohm track to an antenna of your own, tuned and kept clear. The radio approval of such a product is yours.'],
    package: ['The package pads', 'The pads round the underside of the 7 × 7 mm square. They carry the chip\'s pins that you may use, the supply and the antenna connection.']
  };

  Hyper.sim('mo-anatomy', {
    title: 'Anatomy of a module',
    blurb: `A module drawn from the catalogue's own records: the antenna type, the proportions and whether the flash is a separate chip or sits inside the chip's package all follow the module you pick. **Click a part**, or its name in the list, to read what it does.

**Try this**
- Look at the *can lifted* view of an ESP32-WROOM-32E, then an ESP32-C3-MINI-1: the second has no flash chip, because it is inside the chip.
- Pick the **WROVER-E**: a second chip appears, the PSRAM.
- Compare the PCB-antenna and the U version of the same module: the antenna area is gone, and the module is shorter.
- Switch to the **system in package**: the same parts, but all inside one 7 × 7 mm square, and no antenna.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.7, maxH: 560 });
      const MODS = ['ESP32-WROOM-32E', 'ESP32-WROVER-E', 'ESP32-S3-WROOM-1', 'ESP32-S3-WROOM-1U', 'ESP32-S3-MINI-1', 'ESP32-C3-MINI-1', 'ESP32-C3-MINI-1U', 'ESP32-C6-WROOM-1', 'ESP32-WROOM-32UE'].filter(n => rec(E, n));
      const SIPS = ['ESP32-PICO-D4', 'ESP32-PICO-V3', 'ESP32-PICO-V3-02', 'ESP32-S3-PICO-1'].filter(n => rec(E, n));
      let view = params.view === 'sip' && SIPS.length ? 'sip' : 'can', sel = null, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['Module, can on', 'can'], ['Module, can lifted', 'open'], ['System in package (PICO)', 'sip']], value: view },
        { id: 'mod', type: 'select', label: 'Module', options: MODS.map(n => [n, n]), value: MODS[Math.min(2, MODS.length - 1)] || '' },
        { id: 'sip', type: 'select', label: 'Package', options: SIPS.map(n => [n, n]), value: SIPS[SIPS.length - 1] || '' }
      ], (id, v) => { if (id === 'view') view = v; sel = null; sync(); loop.once(); });
      const ro = kit.readout(box.side, [['rec', 'Part'], ['size', 'Size and pins'], ['mem', 'Flash and PSRAM'], ['status', 'Status'], ['what', 'Selected']]);
      function sync() { ctl.show('mod', view !== 'sip'); ctl.show('sip', view === 'sip'); }
      sync();

      function antennaKind(m) { return /U\.FL|connector/i.test(m.antenna) ? 'ufl' : /PCB/i.test(m.antenna) ? 'pcb' : 'none'; }

      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        hits = [];
        const name = view === 'sip' ? ctl.values.sip : ctl.values.mod, m = rec(E, name);
        if (!m) { S.text(c, 'no module in the catalogue', st.W / 2, st.H / 2, { color: C.muted }); return; }
        const [dw, dl] = dims(m), ant = antennaKind(m);
        const legendX = Math.max(st.W * 0.62, st.W - 215);
        const s = Math.min((st.H - 96) / dl, (legendX - 90) / dw, view === 'sip' ? 40 : 22);
        const w = dw * s, h = dl * s, x = 46, y = 52;
        const add = (key, rx, ry, rw, rh) => hits.push({ key, x: rx, y: ry, w: rw, h: rh });
        const mark = (key, rx, ry, rw, rh) => { add(key, rx, ry, rw, rh); if (sel === key) { c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.5; c.strokeRect(rx - 2, ry - 2, rw + 4, rh + 4); c.restore(); } };
        S.text(c, name, x, 18, { size: 14, weight: 650, align: 'left', color: C.text });
        S.text(c, view === 'sip' ? 'seen from below, 7 × 7 mm' : view === 'open' ? 'seen from above, the can lifted' : 'seen from above', x, 35, { size: 11, align: 'left', color: C.muted });
        if (view === 'sip') {
          // a package: pads round the edge, three dies and the passives inside
          const px = x, py = y + 10, ps = Math.min(w * 1.0, h * 1.0, st.H - 140), n = 12;
          c.fillStyle = C.dark ? '#c9cfdf' : '#8a90a0';
          for (let i = 0; i < n; i++) {
            const f = (i + 0.5) / n, q = Math.max(3, ps * 0.025);
            c.fillRect(px + ps * f - q / 2, py - q * 1.4, q, q * 1.4); c.fillRect(px + ps * f - q / 2, py + ps, q, q * 1.4);
            c.fillRect(px - q * 1.4, py + ps * f - q / 2, q * 1.4, q); c.fillRect(px + ps, py + ps * f - q / 2, q * 1.4, q);
          }
          mark('package', px - 8, py - 8, ps + 16, ps + 16);
          c.fillStyle = '#1b1e26'; c.fillRect(px, py, ps, ps);
          S.box(c, px + ps * 0.08, py + ps * 0.08, ps * 0.5, ps * 0.5, { label: 'chip', sub: 'die', color: kit.hue(8), fill: '#2a2f3a', size: 12, textColor: '#e8ecf4' }); add('chipdie', px + ps * 0.08, py + ps * 0.08, ps * 0.5, ps * 0.5);
          S.box(c, px + ps * 0.08, py + ps * 0.64, ps * 0.4, ps * 0.26, { label: 'flash', sub: memLabel(m.flash), color: kit.hue(96), fill: '#2a2f3a', size: 11, textColor: '#e8ecf4' }); add('flashdie', px + ps * 0.08, py + ps * 0.64, ps * 0.4, ps * 0.26);
          if (m.psram) { S.box(c, px + ps * 0.52, py + ps * 0.64, ps * 0.4, ps * 0.26, { label: 'PSRAM', sub: memLabel(m.psram), color: kit.hue(280), fill: '#2a2f3a', size: 11, textColor: '#e8ecf4' }); add('psramdie', px + ps * 0.52, py + ps * 0.64, ps * 0.4, ps * 0.26); }
          S.box(c, px + ps * 0.66, py + ps * 0.08, ps * 0.26, ps * 0.14, { label: 'xtal', color: kit.hue(46), fill: '#2a2f3a', size: 10, textColor: '#e8ecf4' }); add('crystal', px + ps * 0.66, py + ps * 0.08, ps * 0.26, ps * 0.14);
          for (let i = 0; i < 4; i++) { c.fillStyle = '#c9a227'; c.fillRect(px + ps * (0.66 + i * 0.065), py + ps * 0.3, ps * 0.04, ps * 0.07); }
          add('match', px + ps * 0.66, py + ps * 0.28, ps * 0.26, ps * 0.11);
          S.text(c, 'match', px + ps * 0.79, py + ps * 0.44, { size: 10, color: '#9aa3b8' });
          // the antenna connection: one pad, a track and a question
          const rx = px + ps + 24, ry = py + ps * 0.3;
          S.wire(c, [[px + ps, ry], [rx + 40, ry]], { color: kit.hue(46) });
          S.text(c, 'to your antenna', rx + 4, ry - 12, { size: 11, align: 'left', color: C.text2 });
          S.text(c, '(not in the package)', rx + 4, ry + 14, { size: 10.5, align: 'left', color: C.muted });
          add('rfpin', rx - 14, ry - 20, 130, 40);
          if (sel === 'rfpin') { c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.5; c.strokeRect(rx - 14, ry - 20, 130, 40); c.restore(); }
          S.text(c, 'one 7 × 7 mm part holds the chip, the memory, the crystal and the radio parts', px, py + ps + 34, { size: 10.5, align: 'left', color: C.muted });
        } else {
          const antH = ant === 'pcb' ? h * 0.26 : h * 0.1, open = view === 'open';
          // keep-out area round a PCB antenna
          if (ant === 'pcb') {
            c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.setLineDash([6, 4]); c.strokeRect(x - 8, y - 16, w + 16, antH + 22); c.restore();
            mark('keepout', x - 8, y - 16, w + 16, 16);
            S.text(c, 'keep-out', x + w + 12, y - 8, { size: 10.5, align: 'left', color: C.warn });
          }
          // the board of the module
          c.fillStyle = '#16181d'; c.fillRect(x, y, w, h);
          // pads along the sides and the bottom
          const nSide = clamp(Math.round(m.pins / 3.4), 6, 14), pw = Math.max(3, w * 0.035);
          c.fillStyle = '#c9a227';
          for (let i = 0; i < nSide; i++) {
            const py = y + antH + (h - antH - 8) * (i + 0.5) / nSide;
            c.fillRect(x - pw * 0.6, py - 2, pw, 4); c.fillRect(x + w - pw * 0.4, py - 2, pw, 4);
          }
          for (let i = 0; i < 8; i++) c.fillRect(x + w * 0.12 + (w * 0.76) * i / 7 - 2, y + h - pw * 0.4, 4, pw);
          mark('pads', x - pw, y + antH, pw * 1.6, h - antH);
          // the antenna
          if (ant === 'pcb') {
            c.strokeStyle = '#c9a227'; c.lineWidth = Math.max(1.4, w * 0.03); c.lineJoin = 'miter';
            const ax = x + w * 0.1, aw = w * 0.8, ay = y + antH * 0.18, ah = antH * 0.62, nn = 5;
            c.beginPath(); c.moveTo(ax, ay + ah);
            for (let i = 0; i < nn; i++) { const xa = ax + aw * i / nn, xb = ax + aw * (i + 0.5) / nn, xc = ax + aw * (i + 1) / nn; c.lineTo(xa, ay); c.lineTo(xb, ay); c.lineTo(xb, ay + ah); c.lineTo(xc, ay + ah); }
            c.stroke();
          } else if (ant === 'ufl') {
            c.beginPath(); c.arc(x + w * 0.8, y + antH * 0.5, Math.max(3, w * 0.07), 0, Math.PI * 2); c.fillStyle = '#c9a227'; c.fill();
            c.beginPath(); c.arc(x + w * 0.8, y + antH * 0.5, Math.max(1.5, w * 0.03), 0, Math.PI * 2); c.fillStyle = '#16181d'; c.fill();
          }
          mark('antenna', x, y, w, antH);
          // the can, or what is under it
          const cx = x + w * 0.06, cy = y + antH, cw = w * 0.88, ch = h - antH - h * 0.035;
          if (!open) {
            const g = c.createLinearGradient(cx, cy, cx + cw, cy + ch);
            if (g && g.addColorStop) { g.addColorStop(0, '#d7dbe3'); g.addColorStop(0.5, '#aeb4c0'); g.addColorStop(1, '#c4c9d4'); }
            c.fillStyle = g && g.addColorStop ? g : '#bcc2ce'; c.fillRect(cx, cy, cw, ch);
            S.text(c, name.replace(/^ESP32-?/, ''), cx + cw / 2, cy + ch / 2, { size: Math.max(8, Math.min(12, cw / 9)), color: '#2a2f3a', weight: 650 });
            mark('can', cx, cy, cw, ch);
          } else {
            c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.setLineDash([4, 4]); c.strokeRect(cx, cy, cw, ch); c.restore();
            const chipS = cw * 0.4, chipX = cx + cw * 0.3, chipY = cy + ch * 0.14;
            // matching network between the chip and the antenna
            for (let i = 0; i < 3; i++) { c.fillStyle = '#c9a227'; c.fillRect(chipX + chipS * (0.2 + i * 0.28), cy + ch * 0.045, chipS * 0.14, ch * 0.04); }
            mark('match', chipX + chipS * 0.1, cy + ch * 0.02, chipS * 0.8, ch * 0.09);
            // decoupling capacitors round the chip
            for (let i = 0; i < 4; i++) { c.fillStyle = '#b08d57'; c.fillRect(chipX - cw * 0.07, chipY + chipS * (0.1 + i * 0.22), cw * 0.04, ch * 0.025); }
            mark('caps', chipX - cw * 0.09, chipY, cw * 0.07, chipS);
            S.chip(c, chipX, chipY, chipS, chipS, { label: E.chip(m.chip) ? E.chip(m.chip).name.replace('ESP32-', '') : 'chip', size: 11, pads: 4 });
            add('chip', chipX, chipY, chipS, chipS);
            if (sel === 'chip') { c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.5; c.strokeRect(chipX - 2, chipY - 2, chipS + 4, chipS + 4); c.restore(); }
            // the crystal
            S.box(c, cx + cw * 0.76, cy + ch * 0.2, cw * 0.18, ch * 0.07, { label: '', color: kit.hue(46), fill: '#c4c9d4', r: 2 });
            mark('crystal', cx + cw * 0.76, cy + ch * 0.2, cw * 0.18, ch * 0.07);
            // flash, PSRAM
            const wrover = /WROVER/.test(name);
            if (!flashInside(name)) {
              S.box(c, cx + cw * 0.08, cy + ch * 0.66, cw * 0.38, ch * 0.13, { label: 'flash', color: kit.hue(96), fill: '#2a2f3a', size: 10.5, textColor: '#e8ecf4', r: 2 });
              mark('flash', cx + cw * 0.08, cy + ch * 0.66, cw * 0.38, ch * 0.13);
            }
            if (wrover) {
              S.box(c, cx + cw * 0.54, cy + ch * 0.66, cw * 0.38, ch * 0.13, { label: 'PSRAM', color: kit.hue(280), fill: '#2a2f3a', size: 10.5, textColor: '#e8ecf4', r: 2 });
              mark('psram', cx + cw * 0.54, cy + ch * 0.66, cw * 0.38, ch * 0.13);
            } else if (m.psram) {
              c.save(); c.setLineDash([3, 3]); c.strokeStyle = kit.hue(280); c.strokeRect(chipX + chipS * 0.15, chipY + chipS * 0.55, chipS * 0.7, chipS * 0.3); c.restore();
              S.text(c, 'PSRAM?', chipX + chipS / 2, chipY + chipS * 0.7, { size: 9, color: kit.hue(280) });
              add('psram', chipX + chipS * 0.15, chipY + chipS * 0.55, chipS * 0.7, chipS * 0.3);
            }
          }
          // the scale
          S.wire(c, [[x, y + h + 14], [x + 10 * s, y + h + 14]], { color: C.muted });
          S.text(c, '10 mm', x + 5 * s, y + h + 26, { size: 10, color: C.muted });
        }
        // the legend, which is also a list of buttons
        const keys = view === 'sip' ? ['chipdie', 'flashdie'].concat(m.psram ? ['psramdie'] : [], ['crystal', 'match', 'rfpin', 'package']) : view === 'open' ? ['antenna'].concat(ant === 'pcb' ? ['keepout'] : [], ['chip'], flashInside(name) ? [] : ['flash'], /WROVER/.test(name) || m.psram ? ['psram'] : [], ['crystal', 'match', 'caps', 'pads']) : ['antenna'].concat(ant === 'pcb' ? ['keepout'] : [], ['can', 'pads']);
        keys.forEach((k, i) => {
          const ly = 50 + i * 27, on = sel === k;
          S.box(c, legendX, ly, st.W - legendX - 10, 22, { label: PART[k][0], size: 11, r: 11, active: on, color: on ? C.accent : C.faint });
          hits.push({ key: k, x: legendX, y: ly, w: st.W - legendX - 10, h: 22, legend: true });
        });
        // the read-out
        ro.set('rec', name + ' · ' + (E.chip(m.chip) ? E.chip(m.chip).name : m.chip));
        ro.set('size', (m.size ? m.size.slice(0, 3).join(' × ') + ' mm' : 'size not given') + ' · ' + m.pins + ' pins');
        ro.set('mem', 'flash ' + (m.flash || '—') + ' · PSRAM ' + (m.psram || 'none'));
        ro.set('status', m.status + ' · ' + m.antenna.replace(/\s*\(.*$/, ''));
        ro.set('what', sel ? PART[sel][0] + ': ' + PART[sel][1] : 'Click a part.');
      }, box.stage);
      kit.click(st, p => { const h = hits.slice().reverse().find(q => inRect(p, q)); if (h) { sel = sel === h.key ? null : h.key; loop.once(); } }, p => hits.some(q => inRect(p, q)));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ mo-decoder */
  // kinds of piece, with their colour hue
  const KIND = { chip: ['The chip', 212], family: ['The family', 150], version: ['Version', 46], antenna: ['Antenna', 28], revision: ['Revision', 320], temp: ['Temperature class', 8], flash: ['Flash memory', 96], psram: ['PSRAM', 280], volt: ['Memory voltage', 186] };
  // each example: the name, the catalogue record it belongs to, and its pieces [text, kind, meaning]
  const EXAMPLES = [
    { n: 'ESP32-S3-WROOM-1-N16R8', base: 'ESP32-S3-WROOM-1', octal: true, p: [['ESP32-S3', 'chip', 'The chip inside: an ESP32-S3, dual-core Xtensa with Wi-Fi 4 and Bluetooth LE.'], ['-WROOM', 'family', 'WROOM: the general-purpose module family, 18 × 25.5 mm on this chip, flash on a separate chip.'], ['-1', 'version', 'The generation or layout: it identifies the design, it does not count anything.'], ['-', '', ''], ['N', 'temp', 'Temperature class N: the standard range, up to 85 °C ambient (an H would mean 105 °C). The octal-PSRAM versions are rated only to 65 °C.'], ['16', 'flash', '16 MB of flash memory.'], ['R8', 'psram', '8 MB of PSRAM, octal (eight data lines). It takes GPIO35, GPIO36 and GPIO37.']] },
    { n: 'ESP32-S3-WROOM-1U-N16R8', base: 'ESP32-S3-WROOM-1U', octal: true, p: [['ESP32-S3', 'chip', 'The chip inside: an ESP32-S3.'], ['-WROOM', 'family', 'WROOM: the general-purpose family.'], ['-1', 'version', 'The generation or layout.'], ['U', 'antenna', 'U: a U.FL connector in place of the PCB antenna. The module is shorter, and the antenna is yours to supply.'], ['-', '', ''], ['N', 'temp', 'Temperature class N: up to 85 °C, but 65 °C with octal PSRAM.'], ['16', 'flash', '16 MB of flash memory.'], ['R8', 'psram', '8 MB of octal PSRAM; GPIO35 to GPIO37 are taken.']] },
    { n: 'ESP32-S3-WROOM-1-N4', base: 'ESP32-S3-WROOM-1', octal: false, p: [['ESP32-S3', 'chip', 'The chip inside: an ESP32-S3.'], ['-WROOM', 'family', 'WROOM: the general-purpose family.'], ['-1', 'version', 'The generation or layout.'], ['-', '', ''], ['N', 'temp', 'Temperature class N: standard, up to 85 °C.'], ['4', 'flash', '4 MB of flash. There is no R, so there is no PSRAM, and GPIO35 to GPIO37 stay free.']] },
    { n: 'ESP32-S3-WROOM-1-N8R2', base: 'ESP32-S3-WROOM-1', octal: false, p: [['ESP32-S3', 'chip', 'The chip inside: an ESP32-S3.'], ['-WROOM', 'family', 'WROOM: the general-purpose family.'], ['-1', 'version', 'The generation or layout.'], ['-', '', ''], ['N', 'temp', 'Temperature class N: standard, up to 85 °C.'], ['8', 'flash', '8 MB of flash memory.'], ['R2', 'psram', '2 MB of PSRAM, the quad kind: it costs no GPIO on this module.']] },
    { n: 'ESP32-S3-WROOM-1-N16R16VA', base: 'ESP32-S3-WROOM-1', octal: true, p: [['ESP32-S3', 'chip', 'The chip inside: an ESP32-S3.'], ['-WROOM', 'family', 'WROOM: the general-purpose family.'], ['-1', 'version', 'The generation or layout.'], ['-', '', ''], ['N', 'temp', 'Temperature class N, but octal PSRAM versions are rated to 65 °C ambient.'], ['16', 'flash', '16 MB of flash memory.'], ['R16', 'psram', '16 MB of PSRAM, octal: GPIO35 to GPIO37 are taken.'], ['V', 'volt', 'V: the memory runs at 1.8 V, so GPIO47 and GPIO48 work at 1.8 V instead of 3.3 V.'], ['A', 'volt', 'A trailing letter after the V; the datasheet\'s ordering table says what it adds.']] },
    { n: 'ESP32-S3-WROOM-2-N32R16V', base: 'ESP32-S3-WROOM-2', octal: true, p: [['ESP32-S3', 'chip', 'The chip inside: an ESP32-S3.'], ['-WROOM', 'family', 'WROOM: the general-purpose family.'], ['-2', 'version', 'The second layout: octal flash and PSRAM, 18 × 25.5 mm.'], ['-', '', ''], ['N', 'temp', 'Temperature class N. This module is rated -40 to 65 °C ambient in all versions.'], ['32', 'flash', '32 MB of flash memory.'], ['R16', 'psram', '16 MB of PSRAM, octal. On this module the three pins are not led out at all.'], ['V', 'volt', 'V: 1.8 V memory, so GPIO47 and GPIO48 work at 1.8 V.']] },
    { n: 'ESP32-S3-MINI-1-N4R2', base: 'ESP32-S3-MINI-1', octal: false, p: [['ESP32-S3', 'chip', 'The chip inside: an ESP32-S3.'], ['-MINI', 'family', 'MINI: the small module, 15.4 × 20.5 mm here, with the memory inside the chip\'s package.'], ['-1', 'version', 'The generation or layout.'], ['-', '', ''], ['N', 'temp', 'Temperature class N: standard, up to 85 °C.'], ['4', 'flash', '4 MB of flash, inside the chip\'s package.'], ['R2', 'psram', '2 MB of PSRAM, also inside the package; its chip select takes GPIO26.']] },
    { n: 'ESP32-C3-MINI-1-N4', base: 'ESP32-C3-MINI-1', octal: false, p: [['ESP32-C3', 'chip', 'The chip inside: an ESP32-C3, one RISC-V core, Wi-Fi 4 and Bluetooth LE.'], ['-MINI', 'family', 'MINI: the small module, 13.2 × 16.6 mm, flash inside the chip\'s package.'], ['-1', 'version', 'The generation or layout.'], ['-', '', ''], ['N', 'temp', 'Temperature class N: standard, up to 85 °C.'], ['4', 'flash', '4 MB of flash, inside the chip. No R: the C3 has no PSRAM at all.']] },
    { n: 'ESP32-C3-MINI-1U-N4', base: 'ESP32-C3-MINI-1U', octal: false, p: [['ESP32-C3', 'chip', 'The chip inside: an ESP32-C3.'], ['-MINI', 'family', 'MINI: the small module.'], ['-1', 'version', 'The generation or layout.'], ['U', 'antenna', 'U: a connector in place of the PCB antenna; 4.1 mm shorter.'], ['-', '', ''], ['N', 'temp', 'Temperature class N: standard.'], ['4', 'flash', '4 MB of flash inside the chip.']] },
    { n: 'ESP32-C6-WROOM-1-N16', base: 'ESP32-C6-WROOM-1', octal: false, p: [['ESP32-C6', 'chip', 'The chip inside: an ESP32-C6, with Wi-Fi 6 and Zigbee and Thread.'], ['-WROOM', 'family', 'WROOM: the general-purpose family; the flash is a separate chip.'], ['-1', 'version', 'The generation or layout.'], ['-', '', ''], ['N', 'temp', 'Temperature class N: standard.'], ['16', 'flash', '16 MB of flash. No R: the C6 has no PSRAM.']] },
    { n: 'ESP32-WROOM-32E-N16R2', base: 'ESP32-WROOM-32E', octal: false, p: [['ESP32', 'chip', 'The chip inside: the original ESP32.'], ['-WROOM', 'family', 'WROOM: the general-purpose family.'], ['-32', 'version', 'Here "32" simply names the ESP32 module of this family; it is not a count.'], ['E', 'revision', 'E: a later revision of the module (after the plain and the D versions); the current one.'], ['-', '', ''], ['N', 'temp', 'Temperature class N: standard, up to 85 °C.'], ['16', 'flash', '16 MB of flash memory.'], ['R2', 'psram', '2 MB of PSRAM, inside the chip package.']] },
    { n: 'ESP32-WROOM-32UE-N4', base: 'ESP32-WROOM-32UE', octal: false, p: [['ESP32', 'chip', 'The chip inside: the original ESP32.'], ['-WROOM', 'family', 'WROOM: the general-purpose family.'], ['-32', 'version', 'The ESP32 module of this family.'], ['U', 'antenna', 'U: a connector instead of the PCB antenna.'], ['E', 'revision', 'E: the later revision.'], ['-', '', ''], ['N', 'temp', 'Temperature class N: standard.'], ['4', 'flash', '4 MB of flash memory.']] },
    { n: 'ESP32-WROVER-E-N4R8', base: 'ESP32-WROVER-E', octal: false, p: [['ESP32', 'chip', 'The chip inside: the original ESP32.'], ['-WROVER', 'family', 'WROVER: the family with PSRAM, 18 × 31.4 mm.'], ['-E', 'revision', 'E: the later revision of the module.'], ['-', '', ''], ['N', 'temp', 'Temperature class N: standard.'], ['4', 'flash', '4 MB of flash memory.'], ['R8', 'psram', '8 MB of PSRAM, external, on GPIO16 and GPIO17. The ESP32 can map only 4 MB of it at a time.']] },
    { n: 'ESP32-WROOM-32E-H4', base: 'ESP32-WROOM-32E', octal: false, p: [['ESP32', 'chip', 'The chip inside: the original ESP32.'], ['-WROOM', 'family', 'WROOM: the general-purpose family.'], ['-32', 'version', 'The ESP32 module of this family.'], ['E', 'revision', 'E: the later revision.'], ['-', '', ''], ['H', 'temp', 'Temperature class H: the high-temperature version, up to 105 °C ambient.'], ['4', 'flash', '4 MB of flash memory.']] }
  ];

  Hyper.sim('mo-decoder', {
    title: 'Reading a module name',
    blurb: `The name is cut into its pieces, each coloured by what it says. **Click a piece** to read it; the numbers on the right come from the catalogue's record of the module itself.

**Try this**
- Read **N16R8**, then **N4**: the R is what adds PSRAM.
- Compare the **U** version: the antenna piece appears, and the module is shorter.
- On the S3, notice the temperature line for octal PSRAM (**R8**, **R16**): the class is N, but the datasheet limit is 65 °C.
- Look at the **V** of R16V: the memory voltage changes two of the GPIOs.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, maxH: 520 });
      const list = EXAMPLES.filter(e => rec(E, e.base));
      let idx = 0, sel = 4, hits = [];
      const ctl = kit.controls(box.side, [{ id: 'ex', type: 'select', label: 'Module', options: list.map((e, i) => [e.n, i]), value: 0 }], (id, v) => { idx = v; sel = pick(); loop.once(); });
      const ro = kit.readout(box.side, [['chip', 'Chip'], ['ant', 'Antenna and size'], ['mem', 'Memory in the catalogue'], ['temp', 'Temperature'], ['pins', 'Pins the memory costs'], ['stat', 'Status']]);
      function pick() { const e = list[idx]; const i = e ? e.p.findIndex(q => q[1] === 'flash') : 0; return i < 0 ? 0 : i; }
      sel = pick();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), e = list[idx];
        hits = [];
        if (!e) { S.text(c, 'no record', st.W / 2, st.H / 2, { color: C.muted }); return; }
        const m = rec(E, e.base);
        // the name, drawn piece by piece
        const total = e.p.reduce((a, q) => a + q[0].length, 0), size = clamp((st.W - 40) / (total * 0.62), 14, 30);
        c.save(); c.font = '650 ' + size + 'px Consolas, "Cascadia Code", monospace';
        const widths = e.p.map(q => c.measureText(q[0]).width), sum = widths.reduce((a, b) => a + b, 0);
        c.restore();
        let x = (st.W - sum) / 2; const y = 46;
        e.p.forEach((q, i) => {
          const kind = KIND[q[1]], col = kind ? kit.hue(kind[1]) : C.muted, on = i === sel && q[1];
          if (q[1]) {
            c.fillStyle = col; c.globalAlpha = on ? 0.28 : 0.1; c.fillRect(x - 2, y - size * 0.7, widths[i] + 4, size * 1.45); c.globalAlpha = 1;
            c.fillStyle = col; c.fillRect(x, y + size * 0.82, widths[i], on ? 4 : 2.5);
            hits.push({ i, x: x - 2, y: y - size * 0.7, w: widths[i] + 4, h: size * 2.2 });
          }
          S.text(c, q[0], x + widths[i] / 2, y, { size, mono: true, weight: 650, color: q[1] ? C.text : C.muted });
          x += widths[i];
        });
        // what the selected piece says
        const q = e.p[sel], kind = q && KIND[q[1]];
        const by = 112, bw = st.W - 28;
        if (kind) {
          S.box(c, 14, by, bw, 108, { color: kit.hue(kind[1]), active: true, r: 10 });
          S.text(c, kind[0] + ':  ' + q[0].replace(/^-/, ''), 28, by + 18, { size: 14, weight: 650, align: 'left', color: kit.hue(kind[1]) });
          wrap(S, c, q[2], 28, by + 44, bw - 28, 18, { size: 12.5, color: C.text });
        } else S.text(c, 'Click a coloured piece of the name.', st.W / 2, by + 40, { size: 12, color: C.muted });
        // the whole name in words
        S.text(c, 'in words', 18, by + 132, { size: 11, weight: 650, align: 'left', color: C.text2 });
        let ty = by + 152;
        e.p.filter(p => p[1]).forEach(p => {
          const col = kit.hue(KIND[p[1]][1]);
          c.fillStyle = col; c.fillRect(18, ty - 5, 8, 8);
          S.text(c, p[0].replace(/^-/, ''), 34, ty, { size: 11.5, mono: true, align: 'left', weight: 650, color: C.text });
          S.text(c, KIND[p[1]][0], 96, ty, { size: 11.5, align: 'left', color: kit.hue(KIND[p[1]][1]), weight: 600 });
          S.text(c, p[2].split('. ')[0].replace(/\.$/, '').slice(0, Math.max(20, Math.floor((st.W - 250) / 6.2))), 214, ty, { size: 11, align: 'left', color: C.muted });
          ty += 18;
        });
        // the numbers
        const octal = e.octal, psramPiece = e.p.find(p => p[1] === 'psram'), tempPiece = e.p.find(p => p[1] === 'temp');
        const t = tempPiece ? (tempPiece[0] === 'H' ? '-40 to 105 °C' : octal ? 'class N (85 °C), but 65 °C with octal PSRAM' : '-40 to 85 °C') : '—';
        ro.set('chip', (E.chip(m.chip) ? E.chip(m.chip).name : m.chip) + ' · ' + m.kind);
        ro.set('ant', m.antenna.replace(/\s*\(.*$/, '') + ' · ' + (m.size ? m.size.slice(0, 3).join(' × ') + ' mm' : '—'));
        ro.set('mem', 'flash ' + (m.flash || '—') + ' · PSRAM ' + (m.psram || 'none'));
        ro.set('temp', t + (m.temp ? '  (record: ' + m.temp + ')' : ''));
        ro.set('pins', /WROOM-2/.test(m.name) ? 'none on the pads (IO35 to IO37 are not led out)' : octal ? 'GPIO35, 36, 37 (octal PSRAM)' : psramPiece ? (/MINI/.test(m.name) && /S3/.test(m.name) ? 'GPIO26' : /WROVER/.test(m.name) ? 'GPIO16 and 17' : /WROOM-32/.test(m.name) ? 'an ESP32 with in-package PSRAM uses GPIO16 and 17: see the pin table' : 'none on the pads') : 'none');
        ro.set('stat', m.status);
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => inRect(p, q)); if (h) { sel = h.i; loop.once(); } }, p => hits.some(q => inRect(p, q)));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ mo-sizes */
  const FAMCOL = { WROOM: 150, WROVER: 280, SOLO: 46, MINI: 212, PICO: 8, other: 330 };
  const STATCOL = { 'mass production': 150, NRND: 46, EOL: 8, sample: 212 };
  const ANTCOL = { pcb: 150, ufl: 28, none: 280 };
  const antOf = m => (/U\.FL|connector/i.test(m.antenna) ? 'ufl' : /PCB/i.test(m.antenna) ? 'pcb' : 'none');

  Hyper.sim('mo-sizes', {
    title: 'Modules to scale',
    blurb: `Every part of the catalogue with a published size, drawn at one scale, millimetre for millimetre. Parts of the same size are drawn once, with a count. **Click a rectangle** to see which modules it stands for.

**Try this**
- Show only the **MINI** family, then only **WROOM**: the MINI modules are roughly half the area.
- Colour by **antenna**: the U versions are always the shorter ones of a pair.
- Pick one chip and see how many different sizes of module it has.
- The dashed shape is a USB-C plug (8.9 × 3.3 mm), for a sense of scale.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.78, maxH: 640 });
      const chipIds = E.MODULES.map(m => m.chip).filter((v, i, a) => a.indexOf(v) === i);
      let sel = null, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'fam', type: 'select', label: 'Family', options: [['All families', 'all'], ['WROOM', 'WROOM'], ['WROVER', 'WROVER'], ['SOLO', 'SOLO'], ['MINI', 'MINI'], ['PICO', 'PICO'], ['Other', 'other']], value: 'all' },
        { id: 'chip', type: 'select', label: 'Chip', options: [['Any chip', '']].concat(chipIds.map(id => [E.chip(id) ? E.chip(id).name : id, id])), value: '' },
        { id: 'col', type: 'select', label: 'Colour by', options: [['Family', 'fam'], ['Antenna', 'ant'], ['Status', 'stat']], value: params.view === 'families' ? 'fam' : 'ant' },
        { id: 'ref', type: 'check', label: 'Show a USB-C plug for scale', value: true }
      ], () => { sel = null; loop.once(); });
      const ro = kit.readout(box.side, [['n', 'Shown'], ['mods', 'Modules'], ['size', 'Size'], ['pins', 'Pins'], ['stat', 'Status']]);
      const colorOf = (g, kind) => (kind === 'fam' ? FAMCOL[g.fam] : kind === 'ant' ? ANTCOL[g.ant] : STATCOL[g.stat]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        hits = [];
        const list = E.MODULES.filter(m => m.size && m.size.length >= 2 && (ctl.values.fam === 'all' || family(m.name) === ctl.values.fam) && (!ctl.values.chip || m.chip === ctl.values.chip));
        // modules of one size are drawn once
        const byKey = {};
        for (const m of list) { const d = dims(m), k = d[0] + 'x' + d[1]; (byKey[k] = byKey[k] || { w: d[0], h: d[1], mods: [] }).mods.push(m); }
        const groups = Object.values(byKey).sort((a, b) => b.w * b.h - a.w * a.h);
        for (const g of groups) { const m0 = g.mods[0]; g.fam = family(m0.name); g.ant = antOf(m0); g.stat = m0.status; }
        ro.set('n', list.length + ' modules in ' + groups.length + ' sizes');
        if (!groups.length) { S.text(c, 'nothing matches', st.W / 2, st.H / 2, { color: C.muted }); return; }
        // the largest scale at which the rectangles fit the stage
        const M = 14, cellW = (w, s) => Math.max(w * s, 74), room = st.W - 2 * M;
        const layout = s => {
          let x = M, y = 40, rowH = 0; const pos = [];
          for (const g of groups) {
            const cw = cellW(g.w, s), ch = g.h * s + 20;
            if (x + cw > M + room && x > M) { x = M; y += rowH + 8; rowH = 0; }
            pos.push([x, y]); x += cw + 8; rowH = Math.max(rowH, ch);
          }
          return { pos, bottom: y + rowH };
        };
        let s = 14, L = layout(s);
        while (s > 1.2 && L.bottom > st.H - 34) { s -= 0.25; L = layout(s); }
        S.text(c, 'drawn to scale: 1 mm = ' + kit.fmt(s, 2) + ' px', M, 16, { size: 11, align: 'left', color: C.muted });
        groups.forEach((g, i) => {
          const [x, y] = L.pos[i], w = g.w * s, h = g.h * s, hue = colorOf(g, ctl.values.col), on = sel === g;
          c.fillStyle = kit.hue(hue, on ? 0.55 : 0.28); c.fillRect(x, y, w, h);
          c.strokeStyle = kit.hue(hue); c.lineWidth = on ? 2.5 : 1.4; c.strokeRect(x, y, w, h);
          const short = g.mods[0].name.replace(/^ESP32-/, '').replace(/^ESP/, '') + (g.mods.length > 1 ? ' +' + (g.mods.length - 1) : '');
          S.text(c, short, x, y + h + 10, { size: 9.5, align: 'left', color: on ? C.text : C.text2 });
          if (w > 30) S.text(c, g.w + ' × ' + g.h, x + w / 2, y + h / 2, { size: Math.min(11, w / 5), color: C.text2 });
          hits.push({ x, y, w: Math.max(w, cellW(g.w, s)), h: h + 18, g });
        });
        if (ctl.values.ref) {
          const w = 8.94 * s, h = 3.26 * s, x = st.W - M - w - 4, y = st.H - h - 12;
          c.save(); c.setLineDash([4, 3]); c.strokeStyle = C.muted; c.strokeRect(x, y, w, h); c.restore();
          S.text(c, 'USB-C plug', x + w / 2, y - 7, { size: 9.5, color: C.muted });
        }
        const g = sel && groups.includes(sel) ? sel : null;
        if (g) {
          const names = g.mods.map(m => m.name);
          ro.set('mods', names.slice(0, 6).join(', ') + (names.length > 6 ? ' and ' + (names.length - 6) + ' more' : ''));
          const t = g.mods[0].size[2];
          ro.set('size', g.w + ' × ' + g.h + (t ? ' × ' + t : '') + ' mm');
          const ps = g.mods.map(m => m.pins), lo = Math.min(...ps), hi = Math.max(...ps);
          ro.set('pins', lo === hi ? String(lo) : lo + ' to ' + hi);
          ro.set('stat', g.mods.map(m => m.status).filter((v, i, a) => a.indexOf(v) === i).join(', '));
        } else { ro.set('mods', 'click a rectangle'); ro.set('size', '—'); ro.set('pins', '—'); ro.set('stat', '—'); }
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => inRect(p, q)); sel = h ? h.g : null; loop.once(); }, p => hits.some(q => inRect(p, q)));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ mo-memcost */
  // Module families whose pin costs the catalogue states. take: GPIOs the memory option uses; low: GPIOs that run at 1.8 V.
  // pads: the GPIOs that reach a pad (null: the pad list is not in the catalogue, only the pins that are lost are drawn)
  const classicPads = n => [0, 1, 2, 3, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35, 36, 39].indexOf(n) >= 0;
  const MEMFAM = [
    { id: 's3w1', base: 'ESP32-S3-WROOM-1', chip: 'esp32-s3', pads: n => n <= 21 || (n >= 35 && n <= 48), flash: [4, 8, 16], fkind: 'a separate quad flash chip on the module\'s board', fpins: 'its wires use GPIO26 to GPIO32, which this module does not lead out',
      psram: [{ id: 'none', label: 'none', mb: 0, take: [], temp: 85 }, { id: 'R2', label: 'R2: 2 MB, quad', mb: 2, take: [], temp: 85, note: 'Quad PSRAM uses the same hidden pins as the flash: no GPIO of the pads is lost.' }, { id: 'R8', label: 'R8: 8 MB, octal', mb: 8, take: [35, 36, 37], temp: 65, note: 'Octal PSRAM: ambient limited to 65 °C (85 °C with PSRAM error correction, which costs 1/16 of the memory).' }, { id: 'R16V', label: 'R16V: 16 MB, octal, 1.8 V', mb: 16, take: [35, 36, 37], low: [47, 48], temp: 65, note: 'The memory supply is 1.8 V, so GPIO47 and GPIO48 run at 1.8 V. Ambient limited to 65 °C.' }] },
    { id: 's3w2', base: 'ESP32-S3-WROOM-2', chip: 'esp32-s3', pads: n => n <= 21 || (n >= 38 && n <= 48), flash: [16, 32], fkind: 'octal flash on the module, at 1.8 V', fpins: 'pads for GPIO35 to GPIO37 exist on the WROOM-1 but are not connected here',
      psram: [{ id: 'R8V', label: 'R8V: 8 MB, octal, 1.8 V', mb: 8, take: [], low: [47, 48], temp: 65, note: 'GPIO47 and GPIO48 run at 1.8 V. All versions are rated to 65 °C ambient. The ordering table lists N16R8V and N32R8V (end of life) and N32R16V.' }, { id: 'R16V', label: 'R16V: 16 MB, octal, 1.8 V', mb: 16, take: [], low: [47, 48], temp: 65, note: 'GPIO47 and GPIO48 run at 1.8 V. All versions are rated to 65 °C ambient.' }] },
    { id: 's3m1', base: 'ESP32-S3-MINI-1', chip: 'esp32-s3', pads: null, flash: [4, 8], fkind: 'flash inside the chip\'s package', combos: ['4|R2', '8|none'],
      psram: [{ id: 'none', label: 'none', mb: 0, take: [], temp: 85 }, { id: 'R2', label: 'R2: 2 MB in the package', mb: 2, take: [26], temp: 85, note: 'IO26 is wired to the embedded PSRAM and is not available; it is free on the N8 version.' }] },
    { id: 'w32e', base: 'ESP32-WROOM-32E', chip: 'esp32', pads: classicPads, flash: [4, 8, 16], fkind: 'a separate chip on the module\'s board', fpins: 'GPIO6 to GPIO11 are wired to it and not led out',
      psram: [{ id: 'none', label: 'none', mb: 0, take: [], temp: 85 }, { id: 'R2', label: 'R2: 2 MB in the package', mb: 2, take: [16, 17], temp: 85, note: 'An ESP32 chip with PSRAM in its package uses GPIO16 and GPIO17 (the catalogue\'s pin rules for the D0WDR2-V3 chip); check the module\'s pin table.' }] },
    { id: 'wvre', base: 'ESP32-WROVER-E', chip: 'esp32', pads: classicPads, flash: [4, 8, 16], fkind: 'a separate chip on the module\'s board', fpins: 'GPIO6 to GPIO11 are wired to it and not led out',
      psram: [{ id: 'R2', label: '2 MB', mb: 2, take: [16, 17], temp: 85, note: 'Pins 27 and 28 (GPIO16 and GPIO17) are not connected on the module.' }, { id: 'R8', label: '8 MB (4 MB mapped)', mb: 8, take: [16, 17], temp: 85, note: 'GPIO16 is the PSRAM chip select and GPIO17 its clock. The ESP32 maps only 4 MB of the 8 MB at a time.' }] },
    { id: 'mini1', plain: true, base: 'ESP32-MINI-1', chip: 'esp32', pads: null, flash: [4], fkind: 'flash inside the ESP32-U4WDH chip\'s package', fixedTake: [6, 7, 8, 11, 16, 17],
      psram: [{ id: 'none', label: 'none', mb: 0, take: [], temp: 85, note: 'GPIO9 and GPIO10 are led out and usable here, unlike on most ESP32 modules.' }] },
    { id: 's2m1', base: 'ESP32-S2-MINI-1', chip: 'esp32-s2', pads: null, flash: [4], fkind: 'flash inside the chip\'s package',
      psram: [{ id: 'none', label: 'N4: none', mb: 0, take: [], temp: 85 }, { id: 'R2', label: 'N4R2: 2 MB', mb: 2, take: [26], temp: 85, note: 'IO26 is wired to the embedded PSRAM; it is free on the N4 version.' }] },
    { id: 'c5w1', base: 'ESP32-C5-WROOM-1', chip: 'esp32-c5', pads: null, flash: [4, 8, 16, 32], fkind: 'a separate chip on the module\'s board', fpins: 'GPIO16 to GPIO22 carry the flash and are not on any pad',
      psram: [{ id: 'none', label: 'none', mb: 0, take: [], temp: 85, note: 'Without PSRAM, GPIO15 is an ordinary GPIO.' }, { id: 'R2', label: 'R2: 2 MB', mb: 2, take: [15], temp: 85, note: 'GPIO15 is the chip select of the in-package PSRAM and cannot be used.' }, { id: 'R8', label: 'R8: 8 MB', mb: 8, take: [15], temp: 85, note: 'GPIO15 is the chip select of the in-package PSRAM and cannot be used.' }] },
    { id: 'c61w1', base: 'ESP32-C61-WROOM-1', chip: 'esp32-c61', pads: null, flash: [8], fkind: 'a separate chip on the module\'s board', fpins: 'GPIO15 to GPIO21 carry the flash and are not on any pad',
      psram: [{ id: 'R2', label: 'R2: 2 MB', mb: 2, take: [14], temp: 85, note: 'GPIO14 is the chip select of the PSRAM; with PSRAM fitted it is already used.' }, { id: 'R8', label: 'R8: 8 MB', mb: 8, take: [14], temp: 85, note: 'GPIO14 is the chip select of the PSRAM; with PSRAM fitted it is already used.' }] },
    { id: 'pico', plain: true, base: 'ESP32-PICO-MINI-02', chip: 'esp32', pads: null, flash: [8], fkind: 'flash inside the system-in-package', fixedTake: [6, 11, 9, 10],
      psram: [{ id: 'R2', label: '2 MB in the package', mb: 2, take: [], temp: 85, note: 'GPIO6 and GPIO11 connect the flash, GPIO9 and GPIO10 the PSRAM; none of the four is led out.' }] }
  ];

  Hyper.sim('mo-memcost', {
    title: 'What the memory costs: pins and room',
    blurb: `Pick a module, its flash and its PSRAM. Every GPIO of the chip is a tile: **green** reaches a pad and is free, **red** is taken by the memory, **dashed** never reaches a pad, an **amber** edge runs at 1.8 V. A yellow dot marks a strapping pin, a blue one a USB pin. The bar below shows how the stock flash layout spends the chosen flash.

**Try this**
- ESP32-S3-WROOM-1: step through *none*, *R2* and *R8* and watch GPIO35 to GPIO37 turn red at R8.
- WROVER-E against WROOM-32E: two more pins go to the PSRAM.
- Raise the flash from 4 to 16 MB: the largest program that can still be updated over the air grows from 1.25 to 6.25 MB.
- Some combinations are not sold: the readout says so.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, maxH: 640 });
      const fams = MEMFAM.filter(f => rec(E, f.base));
      const flashFocus = params.focus === 'flash';
      let fam = fams[0], hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'fam', type: 'select', label: 'Module', options: fams.map(f => [f.base, f.id]), value: fams[0].id },
        { id: 'flash', type: 'select', label: 'Flash', options: [2, 4, 8, 16, 32].map(v => [v + ' MB', v]), value: flashFocus ? 16 : 8 },
        { id: 'psram', type: 'select', label: 'PSRAM', options: [['none', 'none'], ['R2', 'R2'], ['R8', 'R8'], ['R16V', 'R16V'], ['R8V', 'R8V']], value: flashFocus ? 'none' : 'R8' }
      ], () => { loop.once(); });
      const ro = kit.readout(box.side, [['code', 'Ordering code'], ['mem', 'Memory'], ['lost', 'GPIOs lost'], ['left', 'GPIOs left on pads'], ['temp', 'Ambient rating'], ['slot', 'Largest update slot'], ['note', 'Note']]);
      const SCHEME = { 4: 'default-4m', 8: 'default-8m', 16: 'default-16m' };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        hits = [];
        fam = fams.find(f => f.id === ctl.values.fam) || fams[0];
        const m = rec(E, fam.base);
        // snap the choices to what the family offers
        const flash = fam.flash.includes(ctl.values.flash) ? ctl.values.flash : fam.flash.find(v => v >= ctl.values.flash) || fam.flash[fam.flash.length - 1];
        const opt = fam.psram.find(o => o.id === ctl.values.psram) || fam.psram.find(o => o.mb === 0) || fam.psram[0];
        if (flash !== ctl.values.flash) ctl.set('flash', flash); if (opt.id !== ctl.values.psram) ctl.set('psram', opt.id);
        const take = (fam.fixedTake || []).concat(opt.take), low = opt.low || [];
        const code = fam.plain ? fam.base : fam.base + '-N' + flash + (opt.mb ? 'R' + opt.id.replace(/^R/, '') : '');
        const combo = !fam.combos || fam.combos.indexOf(flash + '|' + opt.id) >= 0;
        // the tiles
        S.text(c, code, 14, 16, { size: 14, weight: 650, align: 'left', color: C.text });
        S.text(c, E.chip(fam.chip) ? E.chip(fam.chip).name + ' · flash: ' + fam.fkind : fam.fkind, 14, 34, { size: 11, align: 'left', color: C.muted });
        const chipPins = E.PINS[fam.chip] && Array.isArray(E.PINS[fam.chip].gpios) ? E.PINS[fam.chip].gpios.map(g => g.n) : [];
        const nums = fam.pads ? chipPins : take.concat(low).filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b);
        const cols = clamp(Math.floor((st.W - 24) / 40), 6, 16), ts = (st.W - 24) / cols - 4, rows = Math.max(1, Math.ceil(nums.length / cols));
        let padCount = 0, lost = 0, strapLeft = 0, usbLeft = 0;
        nums.forEach((n, i) => {
          const x = 12 + (i % cols) * (ts + 4), y = 50 + Math.floor(i / cols) * (ts + 4);
          const onPad = fam.pads ? fam.pads(n) : true, isLost = take.indexOf(n) >= 0, is18 = low.indexOf(n) >= 0;
          const info = E.pin(fam.chip, n) || {};
          if (onPad && fam.pads) padCount++;
          if (isLost) lost++;
          else if (onPad && fam.pads) { if (info.strap) strapLeft++; if (info.usb) usbLeft++; }
          const col = isLost ? C.bad : !onPad ? C.faint : is18 ? C.warn : kit.hue(150);
          c.save();
          c.fillStyle = isLost ? 'rgba(229,72,77,.22)' : !onPad ? 'rgba(128,128,128,.06)' : kit.hue(150, 0.2);
          c.fillRect(x, y, ts, ts);
          c.strokeStyle = col; c.lineWidth = is18 ? 3 : 1.5; if (!onPad) c.setLineDash([3, 3]); c.strokeRect(x, y, ts, ts);
          c.restore();
          S.text(c, String(n), x + ts / 2, y + ts * 0.42, { size: Math.min(12, ts * 0.38), weight: 650, color: isLost ? C.bad : !onPad ? C.faint : C.text });
          if (isLost) S.text(c, '✕', x + ts / 2, y + ts * 0.74, { size: Math.min(12, ts * 0.3), color: C.bad });
          if (onPad && !isLost && info.strap) { c.fillStyle = C.warn; c.beginPath(); c.arc(x + ts - 6, y + 6, 3, 0, 6.2832); c.fill(); }
          if (onPad && !isLost && info.usb) { c.fillStyle = kit.hue(252); c.beginPath(); c.arc(x + 6, y + 6, 3, 0, 6.2832); c.fill(); }
        });
        let y = 50 + rows * (ts + 4) + 6;
        if (!fam.pads) { S.text(c, 'The pad list of this module is not in the catalogue: only the pins the memory takes are drawn.', 14, y + 4, { size: 10.5, align: 'left', color: C.muted }); y += 18; }
        // the flash, as the stock layout spends it
        y += 8;
        S.text(c, 'Flash: ' + flash + ' MB, laid out by the stock Arduino table', 14, y, { size: 11.5, weight: 650, align: 'left', color: C.text2 });
        y += 14;
        const sc = E.PARTITION_SCHEMES.find(q => q.id === SCHEME[flash]), bw = st.W - 28, bh = 30;
        let appMax = null;
        if (sc) {
          const r = E.partitions(sc.parts, sc.flash);
          appMax = r.appMax;
          const seg = (a, b, label, hue, dash) => {
            const x = 14 + bw * a / sc.flash, w = Math.max(1, bw * (b - a) / sc.flash);
            c.fillStyle = kit.hue(hue, 0.3); c.fillRect(x, y, w, bh); c.strokeStyle = kit.hue(hue); c.lineWidth = 1.2; c.strokeRect(x, y, w, bh);
            if (w > 38) S.text(c, label, x + w / 2, y + bh / 2, { size: Math.min(11, w / 5), color: C.text });
          };
          seg(0, r.rows[0].offset, '', 350);
          const hue = { nvs: 46, otadata: 46, app0: 212, app1: 212, spiffs: 150, coredump: 8 };
          r.rows.forEach(q => seg(q.offset, q.end, q.name === 'spiffs' ? 'files' : q.name === 'app0' || q.name === 'app1' ? 'program ' + (q.name === 'app0' ? 'A' : 'B') : q.name === 'otadata' ? '' : q.name === 'nvs' ? '' : '', hue[q.name] || 280));
          S.text(c, 'two program slots of ' + kit.fmt(appMax / 1048576, 3) + ' MB, a file system of ' + kit.fmt(r.rows.find(q => q.name === 'spiffs').size / 1048576, 3) + ' MB', 14, y + bh + 14, { size: 10.5, align: 'left', color: C.muted });
        } else {
          c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.strokeRect(14, y, bw, bh); c.restore();
          S.text(c, 'no stock table for ' + flash + ' MB: a custom partition table is needed', 14 + bw / 2, y + bh / 2, { size: 11, color: C.muted });
        }
        // the numbers
        const known = fam.pads ? padCount : null;
        ro.set('code', code + (combo ? '' : '  (not sold: see the ordering table)'));
        ro.set('mem', flash + ' MB flash · ' + (opt.mb ? opt.mb + ' MB PSRAM' : 'no PSRAM'));
        ro.set('lost', take.length ? take.map(n => 'GPIO' + n).join(', ') : 'none' + (fam.fpins ? ' (' + fam.fpins + ')' : ''));
        ro.set('left', known != null ? (known - lost) + ' of ' + known + ' on pads' + (strapLeft ? ' · ' + strapLeft + ' strapping' : '') + (usbLeft ? ' · ' + usbLeft + ' USB' : '') : 'see the module\'s pin table');
        ro.set('temp', opt.temp + ' °C' + (opt.temp < 85 ? ' (datasheet limit for this memory)' : ' (class N)'));
        ro.set('slot', appMax ? kit.fmt(appMax / 1048576, 3) + ' MB for a program that is updated over the air' : '—');
        ro.set('note', opt.note || (fam.fpins ? 'Flash: ' + fam.fpins + '.' : '—'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ mo-antenna */
  const RATES = [['1 Mbit/s (802.11b, longest reach)', 0], ['54 Mbit/s (802.11g)', 1], ['MCS7, 72 Mbit/s (802.11n)', 2]];
  const RATE = [{ sens: -98 }, { sens: -75 }, { sens: -72 }];            // receiver sensitivity at each rate, typical datasheet-class values, rounded
  const ANTS = [
    { id: 'pcb', label: 'PCB antenna on the module', gain: 0, connector: false },
    { id: 'whip2', label: 'U.FL + small whip, 2 dBi', gain: 2, connector: true },
    { id: 'ant5', label: 'U.FL + 5 dBi antenna', gain: 5, connector: true },
    { id: 'ant9', label: 'U.FL + 9 dBi antenna', gain: 9, connector: true },
    { id: 'none', label: 'U.FL socket, nothing attached', gain: -35, connector: true }
  ];
  const BOX = { none: ['No enclosure', 0], plastic: ['Plastic box', 3], metal: ['Metal box, closed', 40] };

  Hyper.sim('mo-antenna', {
    title: 'PCB antenna or connector: the range',
    blurb: `The bars are the distance at which the Wi-Fi link just fails, for each antenna choice under the settings you pick, on a logarithmic scale (each gridline is ten times the last). The picture shows the selected set-up. **The numbers are typical, rounded values** — a PCB antenna of about 0 dBi, a pigtail of 0.7 dB per 10 cm, plastic costing 3 dB, a metal box shutting a radio in — not measurements of any one product.

**Try this**
- Put the module in a **metal box**: the PCB antenna collapses, the connector with its antenna *outside* does not.
- Untick *antenna outside the box* for a connector module and see it behave like the PCB one.
- Lengthen the **cable**: each 10 cm takes a bite out of the gain.
- Choose the **9 dBi** antenna: the range grows, but the EIRP line turns red — over the European limit of 20 dBm.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.74, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'ant', type: 'select', label: 'Antenna', options: ANTS.map(a => [a.label, a.id]), value: 'ant5' },
        { id: 'enc', type: 'select', label: 'Enclosure', options: Object.keys(BOX).map(k => [BOX[k][0], k]), value: 'plastic' },
        { id: 'out', type: 'check', label: 'Connector antenna outside the box', value: true },
        { id: 'cable', label: 'Cable length', min: 0, max: 50, step: 1, value: 15, unit: 'cm' },
        { id: 'env', type: 'select', label: 'Surroundings', options: [['Open air, line of sight (n = 2)', 2], ['A house (n = 3)', 3], ['A cluttered building (n = 3.5)', 3.5]], value: 3 },
        { id: 'walls', label: 'Walls in the way', min: 0, max: 5, step: 1, value: 1 },
        { id: 'rate', type: 'select', label: 'Data rate', options: RATES, value: 0 },
        { id: 'tx', label: 'Transmit power at the antenna socket', min: 5, max: 20, step: 0.5, value: 15, unit: 'dBm' }
      ], () => { sync(); loop.once(); });
      const ro = kit.readout(box.side, [['gain', 'Antenna gain'], ['loss', 'Losses'], ['eirp', 'EIRP'], ['range', 'Range'], ['vs', 'Against the PCB antenna in plastic']]);
      function sync() { const a = ANTS.find(q => q.id === ctl.values.ant); ctl.show('out', !!a.connector); ctl.show('cable', !!a.connector); }
      sync();
      // net gain (dB, after cable and enclosure) and range in metres for one antenna choice
      function calc(a, enc) {
        const v = ctl.values, r = RATE[v.rate] || RATE[0];
        const outside = a.connector && v.out;
        const encl = outside ? 0 : BOX[enc || v.enc][1];
        const cable = a.connector ? 0.07 * v.cable : 0;
        const net = a.gain - cable - encl;                       // the gain that leaves the product, in dB
        const range = E.linkRange({ tx: v.tx, gt: net, gr: 2, mhz: 2437, n: v.env, walls: v.walls, wallLoss: 5, sens: r.sens });
        return { net, encl, cable, eirp: v.tx + net, range, outside };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const sel = ANTS.find(q => q.id === ctl.values.ant), cur = calc(sel), base = calc(ANTS[0], 'plastic');
        // the set-up: an enclosure, the module in it, the antenna
        const bx = 14, by = 46, bw = Math.min(190, st.W * 0.3), bh = 124;
        const boxCol = ctl.values.enc === 'metal' ? C.muted : ctl.values.enc === 'plastic' ? kit.hue(212) : C.faint;
        c.save(); if (ctl.values.enc === 'none') c.setLineDash([4, 4]);
        c.strokeStyle = boxCol; c.lineWidth = ctl.values.enc === 'metal' ? 6 : 2.5; c.strokeRect(bx, by, bw, bh); c.restore();
        S.text(c, 'the set-up', bx, 18, { size: 11.5, weight: 650, align: 'left', color: C.text2 });
        S.text(c, BOX[ctl.values.enc][0], bx + 4, by + bh + 14, { size: 10.5, align: 'left', color: C.muted });
        const mw = 56, mh = 88, mx = bx + 14, my = by + 20;
        S.module(c, mx, my, mw, mh, { label: 'module', antenna: sel.connector ? 'ufl' : 'pcb' });
        let tipX, tipY;                                           // where the radiating end is
        if (sel.connector) {
          const sx = mx + mw * 0.78, sy = my + mh * 0.13, baseY = by + bh * 0.62;
          const ex = cur.outside ? bx + bw + 30 : bx + bw - 26;     // a cable to an antenna outside the wall, or inside the box
          S.wire(c, [[sx, sy], [sx, baseY], [ex, baseY]], { color: C.muted });
          [tipX, tipY] = S.antenna(c, ex, baseY, 36);
        } else { tipX = mx + mw / 2; tipY = my + 4; }
        // the radiation: weakened by plastic, shut in by metal, small when the antenna is poor
        const lvl = clamp(1 - cur.encl / 40, 0.05, 1) * clamp((cur.net + 20) / 20, 0.15, 1);
        c.save(); c.globalAlpha = Math.max(0.1, lvl);
        S.radio(c, tipX, tipY, { r: 26, phase: 0.5, n: 3, from: -2.4, to: -0.75 });
        c.restore();
        // the range bars on a log axis
        const gx = Math.max(bx + bw + 100, st.W * 0.5), gw = st.W - gx - 20, rows = ANTS.length;
        const rangeAt = r => clamp(Math.log10(Math.max(0.3, r)) / 4.3 + 0.12, 0, 1);       // 0.3 m .. 20 km
        S.text(c, 'range at which the link just fails', gx, 16, { size: 11.5, weight: 650, align: 'left', color: C.text2 });
        for (let k = 0; k <= 4; k++) {
          const x = gx + gw * rangeAt(Math.pow(10, k)), lab = k === 0 ? '1 m' : k === 1 ? '10 m' : k === 2 ? '100 m' : k === 3 ? '1 km' : '10 km';
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x, 28); c.lineTo(x, 28 + rows * 40 + 4); c.stroke();
          S.text(c, lab, x, 28 + rows * 40 + 16, { size: 9.5, color: C.faint });
        }
        ANTS.forEach((a, i) => {
          const r = calc(a), y = 34 + i * 40, on = a.id === sel.id, w = gw * rangeAt(r.range) - 0;
          const over = r.eirp > 20.05;
          S.text(c, a.label, gx, y + 2, { size: 10.5, align: 'left', color: on ? C.text : C.muted, weight: on ? 650 : 500 });
          c.fillStyle = over ? 'rgba(229,72,77,.55)' : kit.hue(150, on ? 0.85 : 0.4); c.fillRect(gx, y + 11, Math.max(2, w), 14);
          S.text(c, kit.fmt(r.range, 3) + ' m', gx + Math.max(2, w) + 4, y + 18, { size: 10, align: 'left', color: on ? C.text : C.muted });
        });
        S.text(c, 'red bar: more than 20 dBm EIRP', gx, st.H - 14, { size: 10, align: 'left', color: C.bad });
        // the numbers
        ro.set('gain', kit.fmt(sel.gain, 3) + ' dBi' + (sel.connector ? ' (after the cable: ' + kit.fmt(sel.gain - cur.cable, 3) + ')' : ''));
        ro.set('loss', 'enclosure ' + kit.fmt(cur.encl, 3) + ' dB' + (sel.connector ? ' · cable ' + kit.fmt(cur.cable, 3) + ' dB' : ''));
        ro.set('eirp', kit.fmt(cur.eirp, 3) + ' dBm' + (cur.eirp > 20.05 ? '  over the European limit of 20 dBm' : '  within 20 dBm'));
        ro.set('range', kit.fmt(cur.range, 3) + ' m');
        ro.set('vs', kit.fmt(cur.range / Math.max(0.01, base.range), 3) + ' × the range');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ mo-approval */
  // An illustrative model of modular approval: the module was approved at 17 dBm with antennas of up to 3 dBi, so 20 dBm EIRP.
  const APPROVED_TX = 17, EIRP_LIMIT = 20;
  Hyper.sim('mo-approval', {
    title: 'Does the module\'s approval still cover it?',
    blurb: `A **simplified model** of modular approval. The module was tested as a radio with its antenna: here, 17 dBm at the antenna and antennas of up to 3 dBi, which makes 20 dBm EIRP, the European limit for this band. Change the set-up and watch which conditions fail. Real rules differ by country and by module; read the approval documents of your own.

**Try this**
- Start from the PCB antenna and a plastic box: the radio part is covered, and the finished product still has its own tasks.
- Fit the **9 dBi antenna**: two conditions fail at once, the antenna and the EIRP.
- Put the antenna inside a **metal enclosure**, or a battery in the keep-out area.
- Tick *software raises the transmit power*: even the right antenna now radiates too much.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, maxH: 620 });
      const ctl = kit.controls(box.side, [
        { id: 'ant', type: 'select', label: 'Antenna', options: [['PCB antenna, as designed', 'pcb'], ['A listed external antenna, 3 dBi', 'listed'], ['An unlisted external antenna, 9 dBi', 'big']], value: 'pcb' },
        { id: 'place', type: 'select', label: 'Round the antenna', options: [['Board edge, keep-out clear', 'ok'], ['Copper and a battery in the keep-out area', 'bad']], value: 'ok' },
        { id: 'enc', type: 'select', label: 'Enclosure', options: [['Plastic', 'plastic'], ['Metal, round the antenna', 'metal']], value: 'plastic' },
        { id: 'mod', type: 'check', label: 'Shield can removed or the module altered', value: false },
        { id: 'pow', type: 'check', label: 'Software raises the transmit power by 6 dB', value: false },
        { id: 'lab', type: 'check', label: 'Product marked and documented as the rules ask', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['verdict', 'Radio part'], ['eirp', 'EIRP'], ['why', 'Because']]);
      const GAIN = { pcb: 2, listed: 3, big: 9 };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const eirp = APPROVED_TX + GAIN[v.ant] + (v.pow ? 6 : 0);
        const checks = [
          [v.ant !== 'big', 'The antenna', 'is one the approval covers', 'is not one the approval lists'],
          [v.place === 'ok', 'The surroundings', 'are as tested: keep-out area clear', 'are not as tested: copper or a battery in the keep-out area'],
          [v.enc === 'plastic', 'The enclosure', 'does not shield the antenna', 'shields the antenna: it is not the tested situation'],
          [!v.mod, 'The module', 'is unchanged', 'has been altered'],
          [eirp <= EIRP_LIMIT + 0.05, 'The radiated power', 'stays within ' + EIRP_LIMIT + ' dBm EIRP', 'is ' + eirp + ' dBm EIRP, over the ' + EIRP_LIMIT + ' dBm limit'],
          [!!v.lab, 'The marking', 'and documents are in place', 'and documents are missing']
        ];
        const covered = checks.every(q => q[0]);
        const W = st.W, M = 14;
        // the verdict
        const col = covered ? C.ok : C.bad;
        S.box(c, M, M, W - 2 * M, 50, { label: covered ? 'The module\'s approval still covers the radio part' : 'The module\'s approval does not cover this product\'s radio', color: col, active: true, size: 14, textColor: col });
        // the six conditions
        let y = 84;
        checks.forEach(q => {
          const ok = q[0], cc = ok ? C.ok : C.bad;
          S.text(c, ok ? '✓' : '✗', M + 14, y + 12, { size: 20, weight: 700, color: cc });
          S.text(c, q[1], M + 40, y + 6, { size: 12.5, weight: 650, align: 'left', color: C.text });
          S.text(c, ok ? q[2] : q[3], M + 40, y + 22, { size: 11.5, align: 'left', color: ok ? C.muted : C.bad });
          y += 38;
        });
        // the EIRP scale: 0 to 30 dBm, with the limit marked
        y += 6;
        const bx = M + 40, bw = W - bx - M - 16, X = d => bx + bw * clamp(d / 30, 0, 1);
        S.text(c, 'EIRP', M, y + 6, { size: 11.5, weight: 650, align: 'left', color: C.text2 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.10)' : 'rgba(0,0,0,.08)'; c.fillRect(bx, y, bw, 12);
        c.fillStyle = eirp <= EIRP_LIMIT + 0.05 ? kit.hue(150, 0.8) : 'rgba(229,72,77,.75)'; c.fillRect(bx, y, X(eirp) - bx, 12);
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(X(EIRP_LIMIT), y - 6); c.lineTo(X(EIRP_LIMIT), y + 18); c.stroke();
        S.text(c, 'limit 20 dBm', X(EIRP_LIMIT), y + 28, { size: 10, color: C.warn });
        S.text(c, eirp + ' dBm', Math.min(X(eirp) + 24, W - M - 20), y - 10, { size: 10.5, weight: 650, color: C.text });
        S.text(c, '0', bx, y + 28, { size: 10, color: C.faint }); S.text(c, '30', bx + bw, y + 28, { size: 10, color: C.faint });
        // what remains the product's own
        y += 52;
        const rest = ['the noise of your own electronics (regulator, motor driver, display)', 'electrical and battery safety, mains parts, radio exposure near the body', 'labelling, instructions, the environment rules, and for connected devices the security rules'];
        const h = 28 + rest.length * 18;
        c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.4; c.strokeRect(M, y, W - 2 * M, h); c.restore();
        S.text(c, 'Whatever the verdict, the finished product still needs its own assessment of:', M + 10, y + 14, { size: 11.5, weight: 650, align: 'left', color: C.text2 });
        rest.forEach((t, i) => S.text(c, '· ' + t, M + 14, y + 34 + i * 18, { size: 11, align: 'left', color: C.muted }));
        ro.set('verdict', covered ? 'covered, if used as tested' : 'not covered');
        ro.set('eirp', eirp + ' dBm (limit ' + EIRP_LIMIT + ')');
        const bad = checks.filter(q => !q[0]).map(q => q[1].toLowerCase());
        ro.set('why', covered ? 'every condition holds' : bad.join(', ') + (bad.length > 1 ? ' fail' : ' fails'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ mo-placement */
  Hyper.sim('mo-placement', {
    title: 'The module on the board: the antenna end',
    blurb: `A top view of a board with an ESP32-S3-WROOM-1 on it (18 × 25.5 mm). The copper pour is the hatched area. **The dB figures are schematic**: they show how the loss grows as the antenna is crowded, not what a particular board measures. Range left assumes indoor surroundings (path-loss exponent 3).

**Try this**
- Slide the module so its antenna end **overhangs** the board edge: the best case.
- Pull it **inboard** with the keep-out clear: a small loss that grows with the distance.
- Tick *copper pour under the antenna* and watch the loss jump; it vanishes when the antenna hangs completely off the board.
- Add the **battery** beside the antenna, and remove the ground plane under the module body.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.78, maxH: 600 });
      const m = rec(E, 'ESP32-S3-WROOM-1'), [mw, ml] = dims(m);
      const ANT = 6.5;                                            // length of the antenna end, mm
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Antenna end from the board edge', min: -7, max: 25, step: 0.5, value: 0, unit: 'mm' },
        { id: 'body', type: 'check', label: 'Ground plane under the module body', value: true },
        { id: 'under', type: 'check', label: 'Copper pour under the antenna', value: false },
        { id: 'batt', type: 'check', label: 'Battery beside the antenna', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['edge', 'The antenna end'], ['loss', 'Loss'], ['range', 'Range left'], ['advice', 'Verdict']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const bw = 60, bh = 46;                                    // the board, mm
        const s = Math.min((st.W - 30) / bw, (st.H - 70) / (bh + 6), 10);
        const x0 = (st.W - bw * s) / 2, y0 = 36;
        // loss model (schematic)
        const over = Math.max(0, -v.d), out = clamp(over / ANT, 0, 1);       // the share of the antenna end beyond the edge
        let loss = 0;
        if (v.under) loss += (1 - out) * 10 + (out < 1 ? 2 : 0);
        else if (v.d > 0) loss += Math.min(4, v.d * 0.25);
        if (v.batt) loss += 5;
        if (!v.body) loss += 2;
        const range = Math.pow(10, -loss / 30);
        // the board and its copper
        c.fillStyle = C.dark ? '#1c2a22' : '#cfe3d6'; c.fillRect(x0, y0, bw * s, bh * s);
        c.save(); c.beginPath(); c.rect(x0, y0, bw * s, bh * s); c.clip();
        const mx = x0 + (bw - mw) * s / 2;
        // the antenna end is the top of the module: its top edge is d mm below the board edge (negative: beyond it)
        const modTop = y0 + v.d * s;
        const pourFill = C.dark ? 'rgba(201,162,39,.30)' : 'rgba(176,141,87,.38)';
        c.fillStyle = pourFill;
        // pour everywhere except the keep-out round the antenna end (unless pour under the antenna is ticked)
        const keepTop = modTop - 4 * s, keepBot = modTop + ANT * s + 3 * s, keepL = mx - 4 * s, keepR = mx + mw * s + 4 * s;
        if (v.under) c.fillRect(x0, y0, bw * s, bh * s);
        else {
          c.fillRect(x0, y0, bw * s, Math.max(0, keepTop - y0));
          c.fillRect(x0, Math.max(y0, keepTop), Math.max(0, keepL - x0), bh * s);
          c.fillRect(keepR, Math.max(y0, keepTop), Math.max(0, x0 + bw * s - keepR), bh * s);
          c.fillRect(x0, keepBot, bw * s, Math.max(0, y0 + bh * s - keepBot));
        }
        c.restore();
        c.strokeStyle = C.muted; c.lineWidth = 2; c.strokeRect(x0, y0, bw * s, bh * s);
        // the keep-out area
        if (!v.under) { c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.5; c.strokeRect(keepL, keepTop, keepR - keepL, keepBot - keepTop); c.restore(); }
        // the battery beside the antenna
        if (v.batt) {
          const bx = mx + mw * s + 6 * s * 0.5, by = modTop + ANT * s + 8;
          c.fillStyle = C.dark ? '#46506e' : '#8d97b8'; c.fillRect(bx, by, 9 * s, 14 * s);
          S.text(c, 'battery', bx + 4.5 * s, by + 7 * s, { size: 10.5, color: '#fff' });
        }
        // the module
        S.module(c, mx, modTop, mw * s, ml * s, { label: 'ESP32-S3-WROOM-1', antenna: 'pcb' });
        // the distance from the edge
        c.strokeStyle = C.accent; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(x0 - 8, y0); c.lineTo(x0 - 8, modTop); c.stroke();
        S.text(c, (v.d >= 0 ? '+' : '') + kit.fmt(v.d, 3) + ' mm', x0 - 12, (y0 + modTop) / 2 + (v.d === 0 ? -8 : 0), { size: 10.5, align: 'right', color: C.accent });
        S.text(c, 'board edge', x0 + bw * s - 4, y0 - 12, { size: 10.5, align: 'right', color: C.muted });
        S.text(c, 'the dashed area must stay free of copper, parts and metal', x0 + 4, y0 + bh * s + 14, { size: 10.5, align: 'left', color: C.muted });
        ro.set('edge', v.d < -0.01 ? 'overhangs the edge by ' + kit.fmt(over, 2) + ' mm' + (out >= 1 ? ' (fully off the board)' : '') : v.d < 0.01 ? 'flush with the edge' : kit.fmt(v.d, 3) + ' mm inboard');
        ro.set('loss', kit.fmt(loss, 3) + ' dB');
        ro.set('range', kit.fmt(range * 100, 3) + ' % of the best case');
        ro.set('advice', loss < 1 ? 'as the datasheet intends' : loss < 4 ? 'a noticeable loss' : loss < 9 ? 'a bad layout: expect a fraction of the range' : 'the antenna is smothered');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ mo-fakeflash */
  Hyper.sim('mo-fakeflash', {
    title: 'A flash chip that claims more than it holds',
    blurb: `The top bar is the address range the chip's ID code **claims**, one cell per megabyte. The bottom bar is what is **really inside**. Addresses beyond the real size wrap round: a write at 12 MB lands at 0 on a 4 MB chip. The test writes a numbered stamp into the claimed range and reads each back.

**Try this**
- Leave a 4 MB chip claiming 16 MB and run *a stamp at every megabyte*: only the last stamp that lands in each cell survives, and cell 0 (the bootloader) is overwritten.
- Run *one stamp at the very end*: it reads back correctly, even on this fake. A single stamp has nothing to collide with, so it proves nothing.
- Set the real size equal to the claim: every stamp survives.
- Choose *the ID code only*: it passes on a fake, because the fake lies about its ID.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, maxH: 520 });
      let run = null;          // { stamps: [k…], anim }
      const ctl = kit.controls(box.side, [
        { id: 'claim', type: 'select', label: 'The ID code claims', options: [4, 8, 16, 32].map(v => [v + ' MB', v]), value: 16 },
        { id: 'real', type: 'select', label: 'Really inside', options: [1, 2, 4, 8, 16].map(v => [v + ' MB', v]), value: 4 },
        { id: 'test', type: 'select', label: 'Test', options: [['Read the ID code only', 'id'], ['One stamp at the very end', 'end'], ['A stamp at every megabyte', 'all']], value: 'all' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run the test', primary: true }, { id: 'reset', label: 'Fresh chip' }] }
      ], (id) => { if (id === 'run') start(); else run = null; loop.start(); });
      const ro = kit.readout(box.side, [['claims', 'ID code claims'], ['real', 'Really holds'], ['stamps', 'Stamps'], ['bad', 'Stamps lost'], ['boot', 'Bootloader'], ['verdict', 'Verdict']]);
      const STEP = 0.32, READ = 0.2;
      function stampsFor() {
        const v = ctl.values, n = v.claim;
        if (v.test === 'end') return [n - 1];
        if (v.test === 'all') { const a = []; for (let k = 1; k < n; k++) a.push(k); return a; }
        return [];
      }
      function start() { run = { stamps: stampsFor(), anim: 0 }; }
      // the real chip's cells after the first n stamps were written
      function memAfter(n) {
        const real = Math.min(ctl.values.real, ctl.values.claim), mem = [];
        for (let i = 0; i < real; i++) mem.push(i === 0 ? 'boot' : '');
        for (let i = 0; i < n && run; i++) { const k = run.stamps[i]; mem[k % real] = 'S' + k; }
        return mem;
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const claim = v.claim, real = Math.min(v.real, claim), fake = real < claim;
        let written = 0, readCount = 0, done = true;
        if (run) {
          run.anim += dt;
          const n = run.stamps.length;
          written = Math.min(n, Math.floor(run.anim / STEP));
          const t1 = n * STEP + 0.4;
          readCount = run.anim < t1 ? 0 : Math.min(n, Math.floor((run.anim - t1) / READ) + 1);
          done = run.anim >= t1 + n * READ + 0.2;
        }
        const M = 14, cw = Math.min(46, (st.W - 2 * M) / claim);
        const topY = 70, botY = 220, ch = 44;
        S.text(c, 'What the ID code claims: ' + claim + ' MB', M, 40, { size: 12.5, weight: 650, align: 'left', color: C.text });
        S.text(c, 'What is really inside: ' + real + ' MB', M, botY - 22, { size: 12.5, weight: 650, align: 'left', color: fake ? C.bad : C.text });
        const stamps = run ? run.stamps : [], mem = memAfter(written);
        // which stamps survive the read-back: only the last one written into each real cell
        const finalMem = []; for (let i = 0; i < real; i++) finalMem.push(i === 0 ? 'boot' : '');
        stamps.forEach(k => { finalMem[k % real] = 'S' + k; });
        const lostSet = new Set(); stamps.forEach(k => { if (finalMem[k % real] !== 'S' + k) lostSet.add(k); });
        // the claimed range
        for (let k = 0; k < claim; k++) {
          const x = M + k * cw, idx = stamps.indexOf(k), isW = idx >= 0 && idx < written, hue = (k * 47) % 360;
          const beyond = k >= real;
          c.fillStyle = isW ? kit.hue(hue, 0.4) : beyond ? 'rgba(128,128,128,.10)' : kit.hue(150, 0.12);
          c.fillRect(x, topY, cw - 2, ch);
          c.strokeStyle = beyond ? C.faint : C.muted; c.lineWidth = 1; c.strokeRect(x, topY, cw - 2, ch);
          S.text(c, String(k), x + (cw - 2) / 2, topY + ch + 10, { size: 9, color: C.faint });
          if (isW) S.text(c, 'S' + k, x + (cw - 2) / 2, topY + ch / 2, { size: Math.min(11, cw / 3.2), weight: 650, color: C.text });
          if (idx >= 0 && idx < readCount) S.text(c, lostSet.has(k) ? '✗' : '✓', x + (cw - 2) / 2, topY - 10, { size: 15, weight: 700, color: lostSet.has(k) ? C.bad : C.ok });
          if (isW) { // the wrap-round arrow to the real cell
            const rx = M + (k % real) * cw + (cw - 2) / 2;
            c.strokeStyle = kit.hue(hue, 0.7); c.lineWidth = 1.2; c.beginPath(); c.moveTo(x + (cw - 2) / 2, topY + ch + 18); c.lineTo(rx, botY - 4); c.stroke();
          }
        }
        // the real chip
        for (let i = 0; i < real; i++) {
          const x = M + i * cw, label = mem[i], over = label && label !== 'boot';
          c.fillStyle = label === 'boot' ? kit.hue(8, 0.3) : over ? kit.hue((parseInt(label.slice(1), 10) * 47) % 360, 0.4) : kit.hue(150, 0.12);
          c.fillRect(x, botY, cw - 2, ch); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.strokeRect(x, botY, cw - 2, ch);
          S.text(c, label === 'boot' ? 'boot' : label || '', x + (cw - 2) / 2, botY + ch / 2, { size: Math.min(11, cw / 3.2), weight: 650, color: C.text });
          S.text(c, String(i), x + (cw - 2) / 2, botY + ch + 10, { size: 9, color: C.faint });
        }
        const bootLost = run && stamps.some(k => k % real === 0 && k !== 0);
        if (bootLost && written > 0 && memAfter(written)[0] !== 'boot') S.text(c, 'the bootloader in cell 0 has been overwritten', M, botY + ch + 34, { size: 12, weight: 650, align: 'left', color: C.bad });
        if (!run) S.text(c, 'Press "Run the test".', M, botY + ch + 34, { size: 12, align: 'left', color: C.muted });
        // the numbers
        const nStamps = stamps.length, lost = lostSet.size;
        ro.set('claims', claim + ' MB (' + kit.fmt(Math.log2(claim * 1048576), 3) + ' address lines)');
        ro.set('real', real + ' MB (' + kit.fmt(Math.log2(real * 1048576), 3) + ' address lines)' + (fake ? ': a fake' : ''));
        ro.set('stamps', run ? (v.test === 'id' ? 'none: the ID code is only read' : written + ' of ' + nStamps + ' written, ' + readCount + ' read back') : '—');
        ro.set('bad', run && done && nStamps ? lost + ' of ' + nStamps : run && v.test === 'id' ? 'not tested' : '—');
        ro.set('boot', run && done && nStamps ? (bootLost ? 'overwritten: the board will not boot' : 'intact') : '—');
        ro.set('verdict', !run ? '—' : !done ? 'testing …' : v.test === 'id' ? 'the ID code says ' + claim + ' MB: it looks fine, whatever is inside' : lost === 0 ? (fake ? 'passed, but this test cannot expose a fake: a single stamp has nothing to collide with' : 'every stamp read back: the chip really holds ' + claim + ' MB') : 'FAKE: ' + lost + ' stamps were overwritten; the chip holds ' + real + ' MB, not ' + claim);
        if (run && done) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
