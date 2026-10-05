/* HYPER-ESP32 · sims/radio-and-antennas.js
 *
 * Simulations of the topic "radio-and-antennas" (ids ra-*).
 *
 *   ra-wave       a radio wave drawn to scale beside a ruler, and the quarter-wave rod it needs
 *   ra-db         decibels as a ledger: levels that rise and fall by adding, with the power beside them
 *   ra-link       the link budget as a ledger of bars, against the receiver's sensitivity
 *   ra-rssi       a noisy signal-strength trace, its smoothing, and a threshold with and without hysteresis
 *   ra-keepout    a PCB antenna and an object coming near: the return-loss curve slides and the range falls
 *   ra-cable      the chain module socket, pigtail, antenna: do the connectors fit, and what the cable costs
 *   ra-pattern    polar patterns of a dipole, a patch and a module antenna; the receiver's direction and polarization
 *   ra-floorplan  a floor plan with walls: a signal map from the router, drag the router and the device
 *   ra-fresnel    the Fresnel zone between two masts, an obstacle, its diffraction loss; params none
 *   ra-band       the 2.4 GHz band shared by Wi-Fi, BLE, Zigbee and an oven; params { view: 'five' } shows the 5 GHz plan
 *   ra-eirp       transmit power plus antenna gain minus cable loss against a regional limit
 *   ra-match      the return-loss curve of an antenna, its match and its detuning
 *
 * Numbers about chips come from the catalogue; the antenna, wall and detuning figures are typical, rounded teaching
 * values and are said to be so in each blurb.
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const PI = Math.PI, TAU = 2 * Math.PI;
  const labelBg = C => C.dark ? 'rgba(13,16,32,.78)' : 'rgba(255,255,255,.85)';
  const sgn = (v, d) => (v < 0 ? '−' : '+') + Math.abs(v).toFixed(d == null ? 1 : d);
  const minus = s => String(s).replace('-', '−');

  /* a power in dBm as a readable amount */
  function powerText(kit, dbm) {
    const mw = Math.pow(10, dbm / 10);
    if (mw >= 1000) return kit.fmt(mw / 1000, 3) + ' W';
    if (mw >= 1) return kit.fmt(mw, 3) + ' mW';
    if (mw >= 1e-3) return kit.fmt(mw * 1e3, 3) + ' µW';
    if (mw >= 1e-6) return kit.fmt(mw * 1e6, 3) + ' nW';
    return kit.fmt(mw * 1e9, 3) + ' pW';
  }
  const distText = (kit, m) => m >= 10000 ? '> 10 km' : m >= 1000 ? kit.fmt(m / 1000, 3) + ' km' : kit.fmt(m, 3) + ' m';

  /* a level diagram: bars that rise and fall by decibels.
     R: { x, y, w, h }; steps: [{ label, kind: 'abs' | 'delta', v | d, sub, color }];
     o: { min, max, tick, base (where an 'abs' bar starts), right (a function from a level to the text at the right edge),
          lines: [{ v, label, from, to, color }], size (bottom label size) } */
  function waterfall(c, C, kit, R, steps, o) {
    const min = o.min, max = o.max, Y = v => R.y + (max - v) / (max - min) * R.h, cy = v => clamp(Y(v), R.y, R.y + R.h);
    const base = o.base == null ? min : o.base, size = o.size || 10;
    c.save(); c.lineWidth = 1;
    for (let v = Math.ceil(min / o.tick) * o.tick; v <= max + 1e-9; v += o.tick) {
      c.strokeStyle = v === 0 && base === 0 ? C.axis : C.grid;
      c.beginPath(); c.moveTo(R.x, Math.round(Y(v)) + 0.5); c.lineTo(R.x + R.w, Math.round(Y(v)) + 0.5); c.stroke();
      kit.label(c, minus(v), R.x - 5, Y(v), { size: 9.5, color: C.faint, align: 'right' });
      if (o.right) kit.label(c, o.right(v), R.x + R.w + 5, Y(v), { size: 9.5, color: C.faint, align: 'left' });
    }
    c.restore();
    const n = steps.length, slot = R.w / n, bw = Math.min(54, slot * 0.62);
    let level = base, prevLevel = null;
    steps.forEach((s, i) => {
      const cx = R.x + slot * (i + 0.5), x0 = cx - bw / 2;
      let a, b;
      if (s.kind === 'abs') { a = base; b = s.v; level = s.v; } else { a = level; b = level + s.d; level = b; }
      const yTop = Math.min(cy(a), cy(b)), hgt = Math.max(2, Math.abs(cy(a) - cy(b)));
      const col = s.color || (s.kind === 'abs' ? C.accent : b >= a ? C.ok : C.bad);
      if (prevLevel != null) {
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 3]);
        c.beginPath(); c.moveTo(cx - slot + bw / 2, Math.round(cy(prevLevel)) + 0.5); c.lineTo(x0, Math.round(cy(s.kind === 'abs' ? prevLevel : a)) + 0.5); c.stroke(); c.restore();
      }
      c.save(); c.globalAlpha = s.kind === 'abs' ? 0.85 : 0.72; c.fillStyle = col; c.fillRect(x0, yTop, bw, hgt); c.restore();
      c.strokeStyle = col; c.lineWidth = 1.2; c.strokeRect(x0 + 0.5, yTop + 0.5, bw - 1, hgt - 1);
      const text = s.text || (s.kind === 'abs' ? minus(Math.round(s.v * 10) / 10) : sgn(s.d) + ' dB');
      const above = s.kind === 'abs' || b >= a;
      kit.label(c, text, cx, above ? yTop - 8 : yTop + hgt + 9, { size: 10, color: C.text, align: 'center', weight: 650, bg: labelBg(C) });
      if (s.sub) kit.label(c, s.sub, cx, above ? yTop - 21 : yTop + hgt + 22, { size: 9.5, color: C.muted, align: 'center' });
      String(s.label || '').split('\n').forEach((t, k) => kit.label(c, t, cx, R.y + R.h + 13 + k * 12, { size: size, color: C.text2, align: 'center' }));
      prevLevel = level;
    });
    (o.lines || []).forEach(L => {
      const xa = R.x + slot * (L.from || 0), xb = R.x + slot * ((L.to == null ? n - 1 : L.to) + 1), y = Y(L.v);
      if (y < R.y - 2 || y > R.y + R.h + 2) return;
      c.save(); c.strokeStyle = L.color || C.warn; c.lineWidth = 1.6; c.setLineDash([6, 4]);
      c.beginPath(); c.moveTo(xa, y); c.lineTo(xb, y); c.stroke(); c.restore();
      kit.label(c, L.label, xb - 3, y - 8, { size: 10, color: L.color || C.warn, align: 'right', bg: labelBg(C) });
    });
  }

  /* ================================================================ ra-wave */
  Hyper.sim('ra-wave', {
    title: 'A radio wave, and the antenna it needs',
    blurb: `The wave is drawn to scale against the ruler: **lower frequency, longer wave**. Under the ruler stands a **quarter-wave rod** on a ground plane, the simplest antenna, with the length it needs at this frequency (the usual 0.95 shortening is applied). The motion is slowed down enormously: the real wave repeats billions of times a second.

**Try this**
- Press **2.4 GHz**, then **433 MHz**: the antenna grows from about 3 cm to 16 cm, and the wave no longer fits in the picture twice.
- Press **5 GHz**: the antenna shrinks to little more than a centimetre, which is why a dual-band antenna is a compromise.
- Slide through the range and watch the read-out of the wavelength follow 1 / frequency.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 320, maxH: 480 });
      const BANDS = [[433.92, '433 MHz', 'remote controls, some LoRa'], [868, '868 MHz', 'LoRa, Meshtastic in Europe'], [915, '915 MHz', 'LoRa, Meshtastic in the Americas'],
        [2442, '2.4 GHz', 'Wi-Fi, Bluetooth, Zigbee, Thread'], [5500, '5 GHz', 'Wi-Fi on the ESP32-C5']];
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Frequency', min: 300, max: 6000, value: 2442, unit: 'MHz', log: true, sig: 3 },
        { id: 'jump', type: 'select', label: 'Jump to a band', options: [['—', 0]].concat(BANDS.map(b => [b[1], b[0]])), value: 0 },
        { id: 'run', type: 'check', label: 'Let the wave travel', value: true }
      ], (id, v) => {
        if (id === 'jump' && v) ctl.set('f', v, false);
        if (id === 'f') ctl.set('jump', 0, false);
        if (id === 'run') { if (v) loop.start(); else loop.stop(); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['lam', 'Wavelength'], ['quarter', 'Quarter-wave rod'], ['period', 'One cycle lasts'], ['band', 'Near']]);
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), f = ctl.values.f, W = st.W, H = st.H, M = 18;
        const lamCm = E.wavelength(f) * 100, qCm = E.quarterWave(f) / 10;
        const pxcm = Math.min((W - 2 * M) / 70, (H * 0.3) / 24), spanCm = (W - 2 * M) / pxcm;
        // the wave
        const wy = H * 0.17, amp = Math.min(34, H * 0.08), lamPx = lamCm * pxcm;
        c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath();
        for (let x = 0; x <= W - 2 * M; x += 2) {
          const y = wy - amp * Math.sin(TAU * x / lamPx - t * 3.2);
          if (x) c.lineTo(M + x, y); else c.moveTo(M + x, y);
        }
        c.stroke();
        // one wavelength
        const by = wy + amp + 16, bl = Math.min(lamPx, W - 2 * M);
        c.strokeStyle = C.text2; c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(M, by); c.lineTo(M + bl, by); c.moveTo(M, by - 5); c.lineTo(M, by + 5); c.moveTo(M + bl, by - 5); c.lineTo(M + bl, by + 5); c.stroke();
        kit.label(c, 'one wavelength = ' + kit.fmt(lamCm, 3) + ' cm' + (lamPx > W - 2 * M ? '  (longer than the picture)' : ''), M, by + 14, { size: 11.5, color: C.text2, weight: 600 });
        // the ruler
        const ry = H * 0.43;
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(M, ry); c.lineTo(W - M, ry); c.stroke();
        const stepCm = pxcm >= 3.5 ? 1 : 5;
        for (let cm = 0; cm <= spanCm + 0.01; cm += stepCm) {
          const major = cm % 10 === 0, x = M + cm * pxcm;
          c.beginPath(); c.moveTo(x, ry); c.lineTo(x, ry + (major ? 9 : cm % 5 === 0 ? 6 : 3.5)); c.stroke();
          if (major) kit.label(c, cm === 0 ? '0' : cm + ' cm', x, ry + 19, { size: 10, color: C.muted, align: 'center' });
        }
        // the quarter-wave rod on its ground plane
        const gy = H * 0.93, gx = M + Math.min(60, W * 0.12), rodH = qCm * pxcm;
        c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(gx - 34, gy); c.lineTo(gx + 34, gy); c.stroke();
        c.lineWidth = 1; for (let k = -34; k <= 28; k += 8) { c.beginPath(); c.moveTo(gx + k, gy + 1); c.lineTo(gx + k - 6, gy + 8); c.stroke(); }
        c.strokeStyle = C.warn; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(gx, gy - 3); c.lineTo(gx, gy - rodH); c.stroke(); c.lineCap = 'butt';
        kit.label(c, 'ground plane', gx, gy + 20, { size: 10, color: C.faint, align: 'center' });
        const qText = qCm >= 10 ? kit.fmt(qCm, 3) + ' cm' : kit.fmt(qCm * 10, 3) + ' mm';
        kit.label(c, 'quarter-wave rod ' + qText, gx + 18, gy - Math.max(14, rodH / 2), { size: 11.5, color: C.warn, weight: 600 });
        // what lives here
        const near = BANDS.find(b => Math.abs(Math.log(f / b[0])) < 0.12);
        kit.label(c, near ? near[1] + ' · ' + near[2] : 'between the common bands', W - M, gy - 6, { size: 11.5, color: near ? C.text : C.faint, align: 'right' });
        ro.set('lam', kit.fmt(lamCm, 3) + ' cm');
        ro.set('quarter', qText + ' (with the 0.95 factor)');
        ro.set('period', kit.fmt(1000 / f, 3) + ' ns');
        ro.set('band', near ? near[1] + ' · ' + near[2] : 'between the common bands');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ra-db */
  Hyper.sim('ra-db', {
    title: 'Decibels: adding instead of multiplying',
    blurb: `Follow one transmission from the transmitter to the receiver. Each bar **rises or falls by a number of decibels**, and the level after it is just the sum. The scale on the right shows the same levels as **power**: equal steps in dB are equal *multiplications* in watts.

**Try this**
- Raise the **path loss** in 20 dB steps: each step divides the power by a hundred.
- Tick **a second identical transmitter**: two 20 dBm transmitters make 23 dBm, not 40.
- Add 3 dB to the receiving antenna and read the power ratio: it doubles.
- Read the last bar in milliwatts: how small is what a receiver actually works with?`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 360, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'tx', label: 'Transmit power', min: -10, max: 22, step: 0.5, value: 20, unit: 'dBm' },
        { id: 'two', type: 'check', label: 'Add a second identical transmitter', value: false },
        { id: 'cable', label: 'Cable and connector', min: 0, max: 10, step: 0.5, value: 1.5, unit: 'dB loss' },
        { id: 'gt', label: 'Antenna, sending end', min: -3, max: 12, step: 0.5, value: 3, unit: 'dBi' },
        { id: 'path', label: 'Distance and walls', min: 20, max: 110, step: 1, value: 80, unit: 'dB loss' },
        { id: 'gr', label: 'Antenna, receiving end', min: -3, max: 12, step: 0.5, value: 2, unit: 'dBi' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['sum', 'The sum'], ['out', 'Arrives'], ['ratio', 'Power ratio, end to start'], ['open', 'The path loss equals open air at']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, E = kit.esp, W = st.W, H = st.H;
        const tx0 = v.tx + (v.two ? 10 * Math.log10(2) : 0);
        const steps = [
          { kind: 'abs', v: tx0, label: 'Transmitter', sub: powerText(kit, tx0) },
          { kind: 'delta', d: -v.cable, label: 'Cable', sub: '× ' + kit.fmt(Math.pow(10, -v.cable / 10), 2) },
          { kind: 'delta', d: v.gt, label: 'Antenna\n(sending)', sub: '× ' + kit.fmt(Math.pow(10, v.gt / 10), 2) },
          { kind: 'delta', d: -v.path, label: 'Path:\ndistance\nand walls', sub: '× ' + kit.fmt(Math.pow(10, -v.path / 10), 2) },
          { kind: 'delta', d: v.gr, label: 'Antenna\n(receiving)', sub: '× ' + kit.fmt(Math.pow(10, v.gr / 10), 2) }
        ];
        const end = tx0 - v.cable + v.gt - v.path + v.gr;
        steps.push({ kind: 'abs', v: end, label: 'Arrives', sub: powerText(kit, end), color: C.warn });
        const R = { x: 40, y: 34, w: W - 40 - 78, h: H - 34 - 54 };
        kit.label(c, 'level in dBm', R.x, 14, { size: 10.5, color: C.muted });
        kit.label(c, 'the same, as power', R.x + R.w, 14, { size: 10.5, color: C.muted, align: 'right' });
        waterfall(c, C, kit, R, steps, { min: -110, max: 30, tick: 20, right: lv => powerText(kit, lv), size: W < 520 ? 9 : 10.5 });
        const chain = end - tx0;
        ro.set('sum', minus(v.tx) + (v.two ? ' + 3.0 (two)' : '') + ' − ' + v.cable + ' + ' + v.gt + ' − ' + v.path + ' + ' + v.gr + ' = ' + minus(Math.round(end * 10) / 10) + ' dBm');
        ro.set('out', powerText(kit, end));
        ro.set('ratio', sgn(chain) + ' dB = × ' + kit.fmt(Math.pow(10, chain / 10), 3));
        ro.set('open', distText(kit, Math.pow(10, (v.path - E.fspl(1, 2442)) / 20)) + ' (2.4 GHz, free space)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ra-link */
  Hyper.sim('ra-link', {
    title: 'The link budget as a ledger',
    blurb: `Read the bars left to right: the **power the chip sends**, the cable, the antenna, the **first metre of air** (40 dB at 2.4 GHz), the **distance** (10·n·log₁₀ d), the walls, and the router's antenna. The last bar is the signal that arrives. The dashed lines are what the receiver needs: the chip's **best sensitivity** (from the catalogue) plus the extra decibels a faster data rate asks for, and the **margin** you want on top. The rate offsets, wall and antenna values are typical teaching figures.

**Try this**
- Walk the **distance** out and watch the *distance* bar grow, 20 dB for each tenfold step in open air.
- Switch the **surroundings** from open air to a house: the same distance now costs far more.
- Choose the **fastest rate**: the dashed line jumps up by 25 dB and the range collapses.
- Add 6 dB of antenna gain at both ends and compare the reach with what 6 dB bought in open air.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 400, maxH: 580 });
      const chips = E.CHIPS.filter(x => x.wifi && x.txDbm != null && x.sensDbm != null);
      const short = x => x.name.replace(/ \(.*\)/, '');
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(x => [short(x), x.id]), value: 'esp32-c3' },
        { id: 'tx', label: 'Transmit power (never above the chip\'s)', min: 2, max: 22, step: 0.5, value: 20, unit: 'dBm' },
        { id: 'gt', label: 'Antenna, ESP end', min: -3, max: 9, step: 0.5, value: 0, unit: 'dBi' },
        { id: 'cable', label: 'Cable loss, ESP end', min: 0, max: 6, step: 0.5, value: 0, unit: 'dB' },
        { id: 'd', label: 'Distance', min: 1, max: 1000, value: 40, unit: 'm', log: true, sig: 2 },
        { id: 'n', type: 'select', label: 'Surroundings', options: [['Open air · exponent 2', 2], ['Open-plan office · 2.7', 2.7], ['A house · 3.3', 3.3]], value: 2.7 },
        { id: 'walls', label: 'Walls in the way', min: 0, max: 8, step: 1, value: 1 },
        { id: 'wall', type: 'select', label: 'Wall', options: [['Plasterboard · 3 dB', 3], ['Brick · 7 dB', 7], ['Concrete · 12 dB', 12]], value: 7 },
        { id: 'gr', label: 'Antenna, router end', min: -3, max: 9, step: 0.5, value: 2, unit: 'dBi' },
        { id: 'rate', type: 'select', label: 'Data rate wanted', options: [['Slowest · 1 Mbit/s', 0], ['Medium · about 20 Mbit/s', 10], ['Fastest · about 72 Mbit/s', 25]], value: 0 },
        { id: 'margin', label: 'Margin you want', min: 0, max: 30, step: 1, value: 10, unit: 'dB' }
      ], (id, v) => {
        if (id === 'chip') ctl.set('tx', Math.min(E.chip(v).txDbm, 22), false);
        loop.once();
      });
      const ro = kit.readout(box.side, [['rx', 'Signal that arrives'], ['m', 'Margin over the need'], ['v', 'Verdict'], ['reach', 'Reach with the margin you want'], ['plus6', 'With 6 dB more']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, chip = E.chip(v.chip), W = st.W, H = st.H;
        const tx = Math.min(v.tx, chip.txDbm), sens = chip.sensDbm + v.rate, fs1 = E.fspl(1, 2442), dist = 10 * v.n * Math.log10(Math.max(1, v.d)), wl = v.walls * v.wall;
        const rx = tx - v.cable + v.gt - fs1 - dist - wl + v.gr, need = sens + v.margin;
        const col = rx >= need ? C.ok : rx >= sens ? C.warn : C.bad;
        const steps = [
          { kind: 'abs', v: tx, label: 'Chip\npower' },
          { kind: 'delta', d: -v.cable, label: 'Cable' },
          { kind: 'delta', d: v.gt, label: 'Antenna\nESP end' },
          { kind: 'delta', d: -fs1, label: 'First\nmetre' },
          { kind: 'delta', d: -dist, label: 'Distance\n' + kit.fmt(v.d, 2) + ' m' },
          { kind: 'delta', d: -wl, label: v.walls + (v.walls === 1 ? ' wall' : ' walls') },
          { kind: 'delta', d: v.gr, label: 'Antenna\nrouter' },
          { kind: 'abs', v: rx, label: 'Arrives', color: col }
        ];
        const R = { x: 40, y: 22, w: W - 40 - 12, h: H - 22 - 56 };
        kit.label(c, chip.name + ' · ' + kit.fmt(tx, 3) + ' dBm' + (tx < v.tx ? ' (the chip\'s maximum)' : '') + ' · levels in dBm', R.x, 9, { size: 10.5, color: C.muted });
        waterfall(c, C, kit, R, steps, { min: -120, max: 30, tick: 30, size: W < 520 ? 9 : 10.5, lines: [
          { v: sens, label: 'needs ' + minus(Math.round(sens * 10) / 10) + ' dBm', color: C.warn },
          { v: need, label: '+ margin ' + minus(Math.round(need * 10) / 10), color: C.ok }
        ] });
        const base = { tx, gt: v.gt - v.cable, gr: v.gr, mhz: 2442, n: v.n, walls: v.walls, wallLoss: v.wall, sens, margin: v.margin };
        const reach = E.linkRange(base), reach6 = E.linkRange(Object.assign({}, base, { gt: base.gt + 6 }));
        ro.set('rx', minus(kit.fmt(rx, 3)) + ' dBm (' + powerText(kit, rx) + ')');
        ro.set('m', rx >= sens ? sgn(rx - sens) + ' dB above the sensitivity' : kit.fmt(sens - rx, 3) + ' dB below the sensitivity');
        ro.set('v', rx >= need ? 'works, with the margin you asked for' : rx >= sens ? 'works, but with less margin than you wanted' : 'does not work');
        ro.set('reach', distText(kit, reach));
        ro.set('plus6', distText(kit, reach6) + ' (× ' + kit.fmt(reach6 / reach, 3) + ')');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ra-rssi */
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  Hyper.sim('ra-rssi', {
    title: 'RSSI jumps: smoothing and thresholds',
    blurb: `The grey dots are what the radio reports, five readings a second for twenty seconds. The **true average** (green dotted line) is what you would like to know. The accent line is the **smoothed** value, an exponential average. Under the chart, two strips show a "near / far" decision: one made from each raw reading against a single threshold, one from the smoothed value with **two thresholds** (hysteresis, the dashed lines). The wiggle is a model of multipath fading, not a recording.

**Try this**
- With **people moving**, count the switches of the raw strip against the smoothed one.
- Make the **hysteresis gap** zero and the smoothing weight 0.6: the smoothed strip flickers too.
- Press **Move the board 6 cm** to see a fade dip of several dB from a small movement.
- Choose **walking with the board**: slow swings of the true signal add to the fast jitter.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 360, maxH: 500 });
      const ENV = { still: { sigma: 1.1, swing: 0 }, people: { sigma: 2.6, swing: 0 }, walking: { sigma: 3.4, swing: 7 } };
      const N = 100, DT = 0.2, rand = rng(11);
      const gauss = () => (rand() + rand() + rand() - 1.5) * 2;
      const dev = [];
      let acc = 0, tt = 0, dip = 0;
      const ctl = kit.controls(box.side, [
        { id: 'env', type: 'select', label: 'Surroundings', options: [['A still room', 'still'], ['People moving about', 'people'], ['Walking with the board', 'walking']], value: 'people' },
        { id: 'level', label: 'True average signal', min: -90, max: -40, step: 1, value: -64, unit: 'dBm' },
        { id: 'alpha', label: 'Smoothing weight (α)', min: 0.02, max: 0.6, step: 0.02, value: 0.2 },
        { id: 'thr', label: 'Threshold for "near"', min: -80, max: -50, step: 1, value: -64, unit: 'dBm' },
        { id: 'gap', label: 'Hysteresis gap', min: 0, max: 12, step: 1, value: 6, unit: 'dB' },
        { type: 'buttons', items: [{ id: 'nudge', label: 'Move the board 6 cm', primary: true }] }
      ], id => { if (id === 'nudge') dip = -10; loop.once(); });
      const ro = kit.readout(box.side, [['raw', 'Raw reading now'], ['smooth', 'Smoothed now'], ['spread', 'Spread of the raw readings'], ['f1', 'Switches, raw and one threshold'], ['f2', 'Switches, smoothed and hysteresis']]);
      function push() {
        const e = ENV[ctl.values.env] || ENV.people;
        tt += DT;
        let d = e.swing * Math.sin(TAU * tt / 11) + e.sigma * (0.7 * gauss() + 0.9 * Math.sin(TAU * tt / 2.6 + 1) + 0.5 * Math.sin(TAU * tt / 0.9 + 2)) + dip;
        dip *= 0.8;
        dev.push(d);
        if (dev.length > N) dev.shift();
      }
      for (let i = 0; i < N; i++) push();
      const loop = kit.loop(dt => {
        acc += dt;
        while (acc >= DT) { acc -= DT; push(); }
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const raw = dev.map(d => clamp(Math.round(v.level + d), -100, -20));
        let s = raw[0];
        const sm = raw.map(r => (s += v.alpha * (r - s), s));
        const R = { x: 44, y: 16, w: W - 44 - 12, h: H * 0.5 }, lo = -100, hi = -30;
        const Y = r => R.y + (hi - clamp(r, lo, hi)) / (hi - lo) * R.h, X = i => R.x + (i + 0.5) / N * R.w;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let r = lo; r <= hi; r += 10) { c.beginPath(); c.moveTo(R.x, Math.round(Y(r)) + 0.5); c.lineTo(R.x + R.w, Math.round(Y(r)) + 0.5); c.stroke(); kit.label(c, minus(r), R.x - 5, Y(r), { size: 9.5, color: C.faint, align: 'right' }); }
        // thresholds and the true level
        const on = v.thr + v.gap / 2, off = v.thr - v.gap / 2;
        [[on, 'switch on'], [off, 'switch off']].forEach(([r, t], k) => {
          if (k === 1 && v.gap === 0) return;
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.4; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(R.x, Y(r)); c.lineTo(R.x + R.w, Y(r)); c.stroke(); c.restore();
          kit.label(c, v.gap === 0 ? 'threshold' : t, R.x + 4, Y(r) + (k === 0 ? -8 : 9), { size: 9.5, color: C.warn });
        });
        c.save(); c.strokeStyle = C.ok; c.lineWidth = 1.6; c.setLineDash([2, 4]); c.beginPath(); c.moveTo(R.x, Y(v.level)); c.lineTo(R.x + R.w, Y(v.level)); c.stroke(); c.restore();
        kit.label(c, 'true average', R.x + R.w - 3, Y(v.level) - 8, { size: 9.5, color: C.ok, align: 'right' });
        // raw readings, then the smoothed line
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); raw.forEach((r, i) => { if (i) c.lineTo(X(i), Y(r)); else c.moveTo(X(i), Y(r)); }); c.stroke();
        raw.forEach((r, i) => kit.dot(c, X(i), Y(r), 2.3, C.muted));
        c.strokeStyle = C.accent; c.lineWidth = 2.8; c.beginPath(); sm.forEach((r, i) => { if (i) c.lineTo(X(i), Y(r)); else c.moveTo(X(i), Y(r)); }); c.stroke();
        // the decisions
        const rawNear = raw.map(r => r > v.thr);
        let state = sm[0] > v.thr;
        const smNear = sm.map(r => { if (r > on) state = true; else if (r < off) state = false; return state; });
        const flips = a => a.reduce((n, x, i) => n + (i && x !== a[i - 1] ? 1 : 0), 0);
        const strips = [[rawNear, 'raw readings, one threshold'], [smNear, 'smoothed, two thresholds']];
        strips.forEach(([a, t], k) => {
          const y = R.y + R.h + 26 + k * 34, w = R.w / N;
          a.forEach((near, i) => { c.fillStyle = near ? kit.hue(150, 0.8) : (C.dark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.10)'); c.fillRect(R.x + i * w, y, Math.ceil(w), 16); });
          kit.label(c, t + ' · ' + flips(a) + ' switches', R.x, y - 8, { size: 10, color: C.text2 });
        });
        kit.label(c, '20 s ago', R.x, R.y + R.h + 9, { size: 9.5, color: C.faint });
        kit.label(c, 'now', R.x + R.w, R.y + R.h + 9, { size: 9.5, color: C.faint, align: 'right' });
        const last = raw.slice(-25), mean = last.reduce((p, q) => p + q, 0) / last.length, sd = Math.sqrt(last.reduce((p, q) => p + (q - mean) * (q - mean), 0) / last.length);
        ro.set('raw', minus(raw[raw.length - 1]) + ' dBm');
        ro.set('smooth', minus(Math.round(sm[sm.length - 1] * 10) / 10) + ' dBm');
        ro.set('spread', '± ' + kit.fmt(sd, 2) + ' dB (standard deviation)');
        ro.set('f1', flips(rawNear) + ' in 20 s');
        ro.set('f2', flips(smNear) + ' in 20 s');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ra-keepout */
  // the share of the power an antenna absorbs from the chip at a frequency, a single resonance; and the return loss that gives (dB, capped)
  const absorbed = (f, f0, Q, A0) => A0 / (1 + Math.pow(2 * Q * (f - f0) / f0, 2));
  const rlOf = a => Math.min(40, -10 * Math.log10(Math.max(1e-4, 1 - a)));
  // what an object near the antenna does: how far it pulls the resonance down (MHz) and what it absorbs (dB) at contact, and how fast both fade with distance (mm). Schematic.
  const NEAR = {
    none: { name: 'Nothing', shift: 0, loss: 0, decay: 10 },
    hand: { name: 'A hand', shift: 170, loss: 5, decay: 16 },
    battery: { name: 'A battery', shift: 120, loss: 3.5, decay: 11 },
    copper: { name: 'A copper pour', shift: 240, loss: 7, decay: 7 },
    metal: { name: 'A metal case wall', shift: 190, loss: 5.5, decay: 12 },
    plastic: { name: 'A plastic case wall', shift: 55, loss: 0.4, decay: 9 }
  };
  Hyper.sim('ra-keepout', {
    title: 'An object near a printed antenna',
    blurb: `A printed antenna is a resonator tuned to the middle of the band. The curve is its **return loss**: how much of the power from the chip is *not* reflected. The dip is the resonance, the shaded strip is the Wi-Fi band, and the dashed line is the 10 dB mark below which the antenna is usually called matched. Bring an object near and the dip **slides down in frequency**, and the object soaks up some of the power as well. **The shifts and losses are typical teaching figures, not measurements**: real values depend on the antenna, the object and the board.

**Try this**
- Choose **a hand** and drag it towards the antenna (or use the slider): the dip leaves the band and the range falls by a third or more.
- Try **a copper pour** at contact: the worst case, because it shorts the antenna.
- Choose **a plastic case wall**: a small shift, which is why a thin wall is tolerable.
- Pull any object out to 30 mm: the antenna recovers.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.92, minH: 460, maxH: 640 });
      const ctl = kit.controls(box.side, [
        { id: 'near', type: 'select', label: 'Object near the antenna', options: Object.keys(NEAR).map(k => [NEAR[k].name, k]), value: 'hand' },
        { id: 'd', label: 'Distance from the antenna', min: 0, max: 30, step: 0.5, value: 6, unit: 'mm' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['res', 'Resonance'], ['rl', 'Return loss at 2442 MHz'], ['cover', 'Wi-Fi band matched (10 dB)'], ['loss', 'Total loss at 2442 MHz'], ['range', 'Range left, indoors']]);
      const RES = 2442, Q = 9, A0 = 1 - Math.pow(10, -2.5);        // tuned to the band centre, 25 dB of return loss at the dip
      let geo = { ox: 0, oy: 0, ow: 0, oh: 0, x0: 0, px: 3 };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H, N = NEAR[v.near] || NEAR.none;
        const e = v.near === 'none' ? 0 : Math.exp(-v.d / N.decay), f0 = RES - N.shift * e, absLoss = N.loss * e;
        // the scene: the module's antenna end hanging off the edge of a board, with the keep-out dashed
        const px = 3, mw = 54, mh = 76, mx = Math.max(60, W * 0.22), my = 22, ant = mh * 0.24;
        c.fillStyle = C.dark ? '#1c2a22' : '#cfe3d6'; c.fillRect(mx - 46, my + ant - 2, mw + 92, mh - ant + 44);
        c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.5; c.strokeRect(mx - 12, my - 8, mw + 24, ant + 22); c.restore();
        kit.label(c, 'keep-out', mx - 12, my - 16, { size: 10, color: C.warn });
        S.module(c, mx, my, mw, mh, { label: 'module', antenna: 'pcb' });
        kit.label(c, 'board edge', mx - 6, my + ant - 12, { size: 9.5, color: C.muted, align: 'right' });
        const ow = 58, oh = 64, ox = mx + mw + 14 + v.d * px, oy = my - 8;
        geo = { ox, oy, ow, oh, x0: mx + mw + 14, px };
        if (v.near !== 'none') {
          const style = { hand: { fill: 'rgba(222,170,140,.9)', color: '#c98f70', text: '#2a1d16', label: 'hand' }, battery: { fill: C.dark ? '#46506e' : '#8d97b8', color: C.muted, text: '#ffffff', label: 'battery' },
            copper: { fill: 'rgba(201,162,39,.6)', color: '#c9a227', text: C.text, label: 'copper' }, metal: { fill: C.dark ? '#7b8294' : '#b6bcc9', color: C.muted, text: '#1b1e26', label: 'metal' },
            plastic: { fill: 'rgba(120,160,255,.28)', color: '#7b8cff', text: C.text, label: 'plastic' } }[v.near];
          S.box(c, ox, oy, ow, oh, { label: style.label, fill: style.fill, color: style.color, textColor: style.text });
          c.strokeStyle = C.accent; c.lineWidth = 1.4; c.beginPath(); c.moveTo(mx + mw + 14, oy + oh + 10); c.lineTo(ox, oy + oh + 10); c.stroke();
          kit.label(c, kit.fmt(v.d, 3) + ' mm', mx + mw + 14, oy + oh + 22, { size: 10.5, color: C.accent });
          kit.label(c, 'drag me', ox + ow / 2, oy - 8, { size: 9.5, color: C.faint, align: 'center' });
        }
        // the return-loss curve
        const sceneH = my + mh + 56, pxl = 46, pw = W - pxl - 14, pyt = sceneH + 22, ph = H - pyt - 40, F0 = 2200, F1 = 2700;
        const X = f => pxl + (f - F0) / (F1 - F0) * pw, Y = rl => pyt + clamp(rl, 0, 30) / 30 * ph;
        c.save(); c.globalAlpha = 0.14; c.fillStyle = C.ok; c.fillRect(X(2400), pyt, X(2484) - X(2400), ph); c.restore();
        kit.label(c, 'Wi-Fi band', (X(2400) + X(2484)) / 2, pyt - 8, { size: 10, color: C.ok, align: 'center' });
        c.lineWidth = 1;
        for (const rl of [0, 10, 20, 30]) { c.strokeStyle = C.grid; c.beginPath(); c.moveTo(pxl, Math.round(Y(rl)) + 0.5); c.lineTo(pxl + pw, Math.round(Y(rl)) + 0.5); c.stroke(); kit.label(c, rl ? '−' + rl : '0', pxl - 6, Y(rl), { size: 9.5, color: C.faint, align: 'right' }); }
        for (let f = 2200; f <= 2700; f += 100) kit.label(c, String(f), X(f), pyt + ph + 12, { size: 9.5, color: C.faint, align: 'center' });
        kit.label(c, 'S11 in dB (deeper is better) against MHz', pxl, pyt - 8, { size: 9.5, color: C.faint });
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(pxl, Y(10)); c.lineTo(pxl + pw, Y(10)); c.stroke(); c.restore();
        const curve = (fr, col, lw, dash) => {
          c.save(); c.strokeStyle = col; c.lineWidth = lw; if (dash) c.setLineDash(dash); c.beginPath();
          for (let f = F0; f <= F1; f += 4) { const y = Y(rlOf(absorbed(f, fr, Q, A0))); if (f > F0) c.lineTo(X(f), y); else c.moveTo(X(f), y); }
          c.stroke(); c.restore();
        };
        curve(RES, C.faint, 1.4, [4, 4]);
        curve(f0, C.accent, 2.6);
        kit.dot(c, X(f0), Y(rlOf(absorbed(f0, f0, Q, A0))), 4.5, C.accent, C.bg2);
        kit.label(c, 'resonance ' + Math.round(f0) + ' MHz', clamp(X(f0), pxl + 60, pxl + pw - 60), Y(rlOf(absorbed(f0, f0, Q, A0))) + 13, { size: 10.5, color: C.accent, align: 'center', weight: 650 });
        kit.label(c, 'dashed: the antenna alone', pxl + pw, pyt + ph - 8, { size: 9.5, color: C.faint, align: 'right' });
        // the numbers
        const a0 = absorbed(RES, f0, Q, A0), mismatch = -10 * Math.log10(Math.max(1e-4, a0)), total = mismatch + absLoss;
        let ok = 0, n = 0;
        for (let f = 2400; f <= 2484; f += 2) { n++; if (rlOf(absorbed(f, f0, Q, A0)) >= 10) ok++; }
        ro.set('res', Math.round(f0) + ' MHz' + (f0 < RES - 1 ? ' (' + Math.round(RES - f0) + ' MHz low)' : ''));
        ro.set('rl', kit.fmt(rlOf(a0), 3) + ' dB');
        ro.set('cover', Math.round(100 * ok / n) + ' %');
        ro.set('loss', kit.fmt(total, 2) + ' dB (reflected ' + kit.fmt(mismatch, 2) + ', absorbed ' + kit.fmt(absLoss, 2) + ')');
        ro.set('range', kit.fmt(100 * Math.pow(10, -total / 30), 3) + ' % of the best case');
      }, box.stage);
      kit.drag(st, {
        hit: p => ctl.values.near !== 'none' && p.x >= geo.ox && p.x <= geo.ox + geo.ow && p.y >= geo.oy && p.y <= geo.oy + geo.oh ? 'obj' : null,
        move: (o, p) => { ctl.set('d', clamp(Math.round((p.x - geo.ow / 2 - geo.x0) / geo.px * 2) / 2, 0, 30), false); loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ra-cable */
  const CABLES = [['Thin pigtail coax, about 3 dB per metre', 3], ['RG174, about 1.5 dB per metre', 1.5], ['RG58, about 1 dB per metre', 1], ['Thick low-loss coax, about 0.2 dB per metre', 0.22]];
  const CONN = { ufl: 'U.FL', mhf4: 'MHF4', sma: 'SMA', rpsma: 'RP-SMA' };
  Hyper.sim('ra-cable', {
    title: 'Connectors, pigtail and antenna: do they fit, and what do they cost?',
    blurb: `The chain runs from the socket on the module, through a pigtail, to the antenna. Each **joint** must fit: a U.FL plug does not go in an MHF4 socket, and an RP-SMA antenna *threads* onto an SMA jack without making contact. The bars add up the **gain** of the antenna and subtract the cable and connector losses, to give the net gain at the module, which is compared with a printed antenna of about 0 dBi. **Cable losses per metre and the 0.2 dB per mated pair are typical figures at 2.4 GHz**: read the datasheet of the cable you buy.

**Try this**
- Set the **socket** to MHF4 with a U.FL pigtail: the first joint fails.
- Set the antenna to SMA with an RP-SMA pigtail: the second joint threads but no signal passes.
- Fit a **3 dBi antenna** on 3 m of thin coax: it ends up worse than the printed antenna.
- Switch to thick low-loss coax and lengthen it: how much does each metre cost now?`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 420, maxH: 580 });
      const ctl = kit.controls(box.side, [
        { id: 'sock', type: 'select', label: 'Socket on the module', options: [['U.FL (also MHF1, AMC)', 'ufl'], ['MHF4', 'mhf4']], value: 'ufl' },
        { id: 'plug', type: 'select', label: 'Pigtail plug, module end', options: [['U.FL (also MHF1, AMC)', 'ufl'], ['MHF4', 'mhf4']], value: 'ufl' },
        { id: 'jack', type: 'select', label: 'Pigtail, antenna end', options: [['SMA', 'sma'], ['RP-SMA', 'rpsma']], value: 'rpsma' },
        { id: 'ant', type: 'select', label: 'Antenna connector', options: [['SMA', 'sma'], ['RP-SMA', 'rpsma']], value: 'rpsma' },
        { id: 'cable', type: 'select', label: 'Cable', options: CABLES, value: 3 },
        { id: 'len', label: 'Cable length', min: 0.1, max: 10, value: 0.3, unit: 'm', log: true, sig: 2 },
        { id: 'gain', label: 'Antenna gain', min: 0, max: 9, step: 0.5, value: 3, unit: 'dBi' },
        { id: 'adapt', label: 'Extra adapters in the chain', min: 0, max: 3, step: 1, value: 0 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['fit', 'The joints'], ['cable', 'Cable loss'], ['conn', 'Connector losses'], ['net', 'Net gain at the module'], ['vs', 'Against a printed antenna']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const fit1 = v.sock === v.plug, fit2 = v.jack === v.ant, broken = !(fit1 && fit2);
        const cableLoss = v.cable * v.len, conn = 0.4 + 0.3 * v.adapt, net = v.gain - cableLoss - conn;
        // the chain of three parts, and the joints between them
        const M = 12, gapW = clamp(W * 0.12, 46, 90), bw = (W - 2 * M - 2 * gapW) / 3, bh = 56, y0 = 18, cy = y0 + bh / 2;
        const parts = [['Module', CONN[v.sock] + ' socket'], ['Pigtail', CONN[v.plug] + ' → ' + CONN[v.jack]], ['Antenna', CONN[v.ant] + ' · ' + kit.fmt(v.gain, 2) + ' dBi']];
        parts.forEach(([t, sub], i) => S.box(c, M + i * (bw + gapW), y0, bw, bh, { label: t, sub, size: 12.5 }));
        [[fit1, 'fits', 'sizes differ: no fit'], [fit2, 'fits', 'threads on, no contact']].forEach(([ok, good, bad], i) => {
          const x = M + (i + 1) * bw + i * gapW, mid = x + gapW / 2;
          S.wire(c, [[x, cy], [x + gapW, cy]], { color: ok ? C.ok : C.bad });
          c.fillStyle = ok ? C.ok : C.bad; c.beginPath(); c.arc(mid, cy, 11, 0, TAU); c.fill();
          S.text(c, ok ? '✓' : '✗', mid, cy + 0.5, { size: 13, color: '#ffffff', weight: 700 });
          kit.label(c, ok ? good : bad, mid, y0 + bh + 14, { size: 10.5, color: ok ? C.ok : C.bad, align: 'center', weight: 600 });
        });
        // the gain account
        const ty = y0 + bh + 42, R = { x: 40, y: ty + 20, w: W - 52, h: H - ty - 20 - 50 };
        kit.label(c, 'gain in dB, at the module end of the chain', R.x, ty + 4, { size: 10.5, color: C.muted });
        waterfall(c, C, kit, R, [
          { kind: 'abs', v: v.gain, label: 'Antenna\ngain', color: C.ok },
          { kind: 'delta', d: -cableLoss, label: 'Cable\n' + kit.fmt(v.len, 2) + ' m' },
          { kind: 'delta', d: -conn, label: 'Connectors' },
          { kind: 'abs', v: broken ? -30 : net, label: 'Net at\nthe module', color: broken ? C.bad : net >= 0 ? C.ok : C.warn, text: broken ? 'no signal' : null }
        ], { min: -30, max: 12, tick: 6, base: 0, size: W < 520 ? 9.5 : 10.5, lines: [{ v: 0, label: 'printed antenna: about 0 dBi', color: C.muted }] });
        ro.set('fit', broken ? (fit1 ? '' : 'the module end does not fit') + (!fit1 && !fit2 ? '; ' : '') + (fit2 ? '' : 'the antenna end makes no contact') : 'every joint fits');
        ro.set('cable', kit.fmt(cableLoss, 3) + ' dB');
        ro.set('conn', kit.fmt(conn, 2) + ' dB (about 0.2 dB for each mated pair, 0.3 for an adapter)');
        ro.set('net', broken ? 'nothing gets through' : sgn(net, 1) + ' dB');
        ro.set('vs', broken ? '—' : net >= 0 ? kit.fmt(net, 2) + ' dB better' : kit.fmt(-net, 2) + ' dB worse');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ra-pattern */
  const PAT = {
    dipole: { name: 'Half-wave dipole or whip, upright', peak: 2.15 },
    patch: { name: 'Patch antenna, facing right', peak: 7 },
    pcb: { name: 'Module printed antenna (schematic)', peak: 1 },
    iso: { name: 'Isotropic (imaginary)', peak: 0 }
  };
  // gain in dBi in the direction phi (radians, from the right, counter-clockwise) in the chosen cut
  function gainAt(type, view, phi) {
    if (type === 'iso') return 0;
    if (type === 'dipole') {
      if (view === 'top') return 2.15;
      const th = PI / 2 - phi, s = Math.abs(Math.sin(th));            // th: the angle from the wire
      if (s < 1e-3) return -30;
      return 2.15 + 20 * Math.log10(Math.max(1e-3, Math.abs(Math.cos(PI / 2 * Math.cos(th))) / s));
    }
    if (type === 'patch') {
      const q = view === 'side' ? 3.4 : 2.4;
      return 7 + 10 * Math.log10(Math.max(Math.pow(Math.max(Math.cos(phi), 0), q), Math.pow(10, -2.2)));
    }
    const w = ((phi % TAU) + TAU) % TAU, dn = Math.min(Math.abs(w - 4.1), TAU - Math.abs(w - 4.1));
    return 1 + 2.4 * Math.cos(2 * (phi - 0.5)) + 1.4 * Math.cos(3 * phi + 0.8) - 14 * Math.exp(-dn * dn / 0.08);
  }
  Hyper.sim('ra-pattern', {
    title: 'Radiation pattern, gain and polarization',
    blurb: `The shape is the **gain in each direction**, in dBi: the rings are 5 dB apart, and the dotted ring is the 0 dBi of an isotropic antenna, so anything outside it is stronger than that. A **dipole** is a doughnut, seen edge-on in the side view, with nulls along the wire. A **patch** puts its power into one forward lobe. The **module antenna** is a schematic of a printed antenna: lumps and a deep null. Put the receiver at any angle and **tilt** its antenna to see the polarization loss. **The shapes are idealised**: real antennas are measured.

**Try this**
- Choose the **dipole**, side view, and move the receiver to **90°**, straight above the wire: a null.
- Switch to the **top view**: the same antenna is a circle, the same in every direction.
- Choose the **patch** and move the receiver round the back: 20 dB or more weaker.
- With a receiver at the best angle, **tilt** its antenna to 60°: 6 dB lost, whatever the pattern.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 400, maxH: 580 });
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Antenna', options: Object.keys(PAT).map(k => [PAT[k].name, k]), value: 'dipole' },
        { id: 'view', type: 'select', label: 'Cut', options: [['Side view (a vertical slice)', 'side'], ['Top view (a horizontal slice)', 'top']], value: 'side' },
        { id: 'dir', label: 'Direction of the receiver', min: 0, max: 355, step: 5, value: 20, unit: '°' },
        { id: 'tilt', label: 'Tilt of the receiving antenna', min: 0, max: 90, step: 5, value: 0, unit: '°' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['g', 'Gain towards the receiver'], ['pol', 'Polarization loss'], ['net', 'Net, against an isotropic antenna'], ['rng', 'Free-space range against that'], ['note', 'Note']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H, P = PAT[v.type] || PAT.dipole;
        const R = Math.max(60, Math.min((W - 30) / 2, (H - 56) / 2) - 16), cx = W / 2, cy = (H - 26) / 2 + 8;
        const GMIN = -15, GMAX = 10, rad = g => R * (clamp(g, GMIN, GMAX) - GMIN) / (GMAX - GMIN);
        [-10, -5, 0, 5, 10].forEach(g => {
          c.save(); c.strokeStyle = g === 0 ? C.text2 : C.grid; c.lineWidth = 1; if (g === 0) c.setLineDash([3, 4]);
          c.beginPath(); c.arc(cx, cy, rad(g), 0, TAU); c.stroke(); c.restore();
          kit.label(c, (g > 0 ? '+' : g < 0 ? '−' : '') + Math.abs(g) + (g === 0 ? ' dBi (isotropic)' : ''), cx + rad(g) * 0.7071 + 3, cy - rad(g) * 0.7071, { size: 9, color: g === 0 ? C.text2 : C.faint });
        });
        c.strokeStyle = C.grid; c.beginPath(); c.moveTo(cx - R, cy); c.lineTo(cx + R, cy); c.moveTo(cx, cy - R); c.lineTo(cx, cy + R); c.stroke();
        // the pattern
        c.beginPath();
        for (let i = 0; i <= 360; i++) {
          const phi = i * PI / 180, r = rad(gainAt(v.type, v.view, phi)), x = cx + r * Math.cos(phi), y = cy - r * Math.sin(phi);
          if (i) c.lineTo(x, y); else c.moveTo(x, y);
        }
        c.closePath(); c.save(); c.globalAlpha = 0.22; c.fillStyle = C.accent; c.fill(); c.restore();
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.stroke();
        // the antenna in the middle
        c.strokeStyle = C.warn; c.fillStyle = C.warn; c.lineWidth = 3; c.lineCap = 'round';
        if (v.type === 'dipole' && v.view === 'side') { c.beginPath(); c.moveTo(cx, cy - 14); c.lineTo(cx, cy + 14); c.stroke(); }
        else if (v.type === 'patch') c.fillRect(cx - 5, cy - 12, 5, 24);
        else if (v.type === 'pcb') c.fillRect(cx - 6, cy - 8, 12, 16);
        else { c.beginPath(); c.arc(cx, cy, 3.5, 0, TAU); c.fill(); }
        c.lineCap = 'butt';
        // the receiver
        const phiR = v.dir * PI / 180, ex = cx + (R + 10) * Math.cos(phiR), ey = cy - (R + 10) * Math.sin(phiR);
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(cx, cy); c.lineTo(ex, ey); c.stroke(); c.restore();
        const tl = v.tilt * PI / 180;
        c.strokeStyle = C.ok; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(ex - 9 * Math.sin(tl), ey - 9 * Math.cos(tl)); c.lineTo(ex + 9 * Math.sin(tl), ey + 9 * Math.cos(tl)); c.stroke(); c.lineCap = 'butt';
        const g = gainAt(v.type, v.view, phiR), gr = rad(g);
        kit.dot(c, cx + gr * Math.cos(phiR), cy - gr * Math.sin(phiR), 4.5, C.ok, C.bg2);
        kit.label(c, 'receiver', ex, ey + (ey < cy ? -14 : 14), { size: 10, color: C.ok, align: 'center' });
        kit.label(c, P.name + (v.view === 'side' ? ' · side view' : ' · top view'), 10, H - 14, { size: 10.5, color: C.muted });
        const pol = v.type === 'iso' ? 0 : -20 * Math.log10(Math.max(Math.abs(Math.cos(tl)), 0.0316)), net = Math.max(g, -30) - pol;
        ro.set('g', g <= -29 ? 'a deep null' : sgn(g, 1) + ' dBi');
        ro.set('pol', kit.fmt(pol, 3) + ' dB' + (v.type === 'iso' ? ' (an isotropic antenna has no polarization)' : ''));
        ro.set('net', net <= -29 ? 'almost nothing' : sgn(net, 1) + ' dB');
        ro.set('rng', '× ' + kit.fmt(Math.pow(10, net / 20), 2));
        ro.set('note', g <= P.peak - 12 ? 'the receiver sits in a null' : pol > 5 ? 'polarization mismatch is the main loss' : g >= P.peak - 1 ? 'in the strongest direction' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ra-floorplan */
  const WALL = { plaster: { db: 3, w: 3, name: 'plasterboard' }, brick: { db: 7, w: 5, name: 'brick' }, concrete: { db: 12, w: 7, name: 'concrete' } };
  const PLAN = {
    w: 14, h: 8,
    walls: [
      { a: [5, 0], b: [5, 3.2], t: 'brick' }, { a: [5, 4.4], b: [5, 8], t: 'brick' },
      { a: [9.5, 0], b: [9.5, 5], t: 'plaster' }, { a: [9.5, 6.2], b: [9.5, 8], t: 'plaster' },
      { a: [9.5, 4.2], b: [14, 4.2], t: 'concrete' }
    ],
    cabinet: { x0: 6.6, y0: 1.0, x1: 7.6, y1: 2.5 }
  };
  const CAB_DB = 25, AP_EIRP = 20;
  function segHit(ax, ay, bx, by, cx, cy, dx, dy) {
    const d1x = bx - ax, d1y = by - ay, d2x = dx - cx, d2y = dy - cy, den = d1x * d2y - d1y * d2x;
    if (Math.abs(den) < 1e-9) return false;
    const t = ((cx - ax) * d2y - (cy - ay) * d2x) / den, u = ((cx - ax) * d1y - (cy - ay) * d1x) / den;
    return t > 1e-6 && t < 1 - 1e-6 && u >= 0 && u <= 1;
  }
  function segRect(ax, ay, bx, by, r) {
    let t0 = 0, t1 = 1;
    const dx = bx - ax, dy = by - ay, p = [-dx, dx, -dy, dy], q = [ax - r.x0, r.x1 - ax, ay - r.y0, r.y1 - ay];
    for (let i = 0; i < 4; i++) {
      if (p[i] === 0) { if (q[i] < 0) return false; } else {
        const t = q[i] / p[i];
        if (p[i] < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; }
      }
    }
    return true;
  }
  /* the signal (dBm) at a point from an access point, through the walls of the plan; also what it crossed */
  function planRssi(E, ap, p, cabinet) {
    const d = Math.max(1, Math.hypot(p[0] - ap[0], p[1] - ap[1]));
    let loss = E.fspl(1, 2442) + 24 * Math.log10(d), crossed = [];
    for (const w of PLAN.walls) if (segHit(ap[0], ap[1], p[0], p[1], w.a[0], w.a[1], w.b[0], w.b[1])) { loss += WALL[w.t].db; crossed.push(w.t); }
    if (cabinet && segRect(ap[0], ap[1], p[0], p[1], PLAN.cabinet)) { loss += CAB_DB; crossed.push('cabinet'); }
    return { rssi: AP_EIRP - loss, crossed };
  }
  const heatColor = (C, r) => {
    const t = clamp((r + 95) / 45, 0, 1);
    return 'hsla(' + Math.round(t * 125) + ',72%,' + (C.dark ? 48 : 52) + '%,' + (r < -95 ? 0.3 : 0.62) + ')';
  };
  Hyper.sim('ra-floorplan', {
    title: 'Where to put the device: a signal map',
    blurb: `A floor plan, 14 m by 8 m, with plasterboard, brick and concrete walls and a metal cabinet. The colours are the **signal an ESP would see** from the router: green is strong, red is weak, dark is nothing. **Drag the router and the device.** The device's reading below the map includes its **enclosure**. **The wall and enclosure losses are typical teaching figures** and the map is a simple model (free-space law with an exponent of 2.4, walls added, no reflections): real rooms differ by 10 dB.

**Try this**
- Move the device behind the **cabinet** and into the **right-hand room**: where do the dead spots lie?
- Press **Best place for the router**: it tries every position and keeps the one with the best average coverage.
- Put the device in a **closed metal box**: no position of the router can save it.
- Compare **antenna clear of the walls** with **antenna against the wall**: a few dB for free.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 380, maxH: 560 });
      const ENC = [['Bare board', 0], ['Plastic box, antenna clear of the walls', 1.5], ['Plastic box, antenna against the wall', 3.5], ['A hand over the antenna', 5], ['Closed metal box', 30]];
      const pos = { ap: [2.2, 5.6], dev: [12.2, 6.3] };
      const ctl = kit.controls(box.side, [
        { id: 'enc', type: 'select', label: 'The device is in', options: ENC, value: 1.5 },
        { id: 'cab', type: 'check', label: 'Metal cabinet in the middle room', value: true },
        { type: 'buttons', items: [{ id: 'best', label: 'Best place for the router', primary: true }, { id: 'reset', label: 'Reset positions' }] }
      ], id => {
        if (id === 'best') pos.ap = bestSpot();
        if (id === 'reset') { pos.ap = [2.2, 5.6]; pos.dev = [12.2, 6.3]; }
        dirty = true; loop.once();
      });
      const ro = kit.readout(box.side, [['bare', 'Bare board at the device'], ['boxed', 'In its enclosure'], ['cross', 'The path crosses'], ['v', 'Verdict']]);
      let heat = null, dirty = true, geo = { x0: 0, y0: 0, s: 1 };
      const CELL = 0.25;
      function bestSpot() {
        let best = null;
        for (let x = 0.5; x < PLAN.w; x += 1) for (let y = 0.5; y < PLAN.h; y += 1) {
          let sum = 0, n = 0;
          for (let gx = 0.25; gx < PLAN.w; gx += 0.5) for (let gy = 0.25; gy < PLAN.h; gy += 0.5) { sum += clamp(planRssi(E, [x, y], [gx, gy], ctl.values.cab).rssi, -95, -45); n++; }
          if (!best || sum / n > best.m) best = { m: sum / n, p: [x, y] };
        }
        return best ? best.p : pos.ap;
      }
      function build() {
        const cols = Math.round(PLAN.w / CELL), rows = Math.round(PLAN.h / CELL);
        heat = { cols, rows, v: new Float32Array(cols * rows) };
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) heat.v[j * cols + i] = planRssi(E, pos.ap, [(i + 0.5) * CELL, (j + 0.5) * CELL], ctl.values.cab).rssi;
        dirty = false;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        if (dirty || !heat) build();
        const s = Math.max(10, Math.min((W - 16) / PLAN.w, (H - 74) / PLAN.h)), x0 = (W - PLAN.w * s) / 2, y0 = 12;
        geo = { x0, y0, s };
        for (let j = 0; j < heat.rows; j++) for (let i = 0; i < heat.cols; i++) { c.fillStyle = heatColor(C, heat.v[j * heat.cols + i]); c.fillRect(x0 + i * CELL * s, y0 + j * CELL * s, CELL * s + 0.6, CELL * s + 0.6); }
        c.strokeStyle = C.muted; c.lineWidth = 2; c.strokeRect(x0, y0, PLAN.w * s, PLAN.h * s);
        // the walls and the cabinet
        const wallCol = { plaster: C.muted, brick: kit.hue(22), concrete: C.text };
        PLAN.walls.forEach(w => { c.strokeStyle = wallCol[w.t]; c.lineWidth = WALL[w.t].w; c.lineCap = 'butt'; c.beginPath(); c.moveTo(x0 + w.a[0] * s, y0 + w.a[1] * s); c.lineTo(x0 + w.b[0] * s, y0 + w.b[1] * s); c.stroke(); });
        if (v.cab) { const r = PLAN.cabinet; c.fillStyle = C.dark ? '#7b8294' : '#8d97b8'; c.fillRect(x0 + r.x0 * s, y0 + r.y0 * s, (r.x1 - r.x0) * s, (r.y1 - r.y0) * s); S.text(c, 'metal', x0 + (r.x0 + r.x1) / 2 * s, y0 + (r.y0 + r.y1) / 2 * s, { size: 9.5, color: '#fff' }); }
        // the two things
        const ap = [x0 + pos.ap[0] * s, y0 + pos.ap[1] * s], dv = [x0 + pos.dev[0] * s, y0 + pos.dev[1] * s];
        const here = planRssi(E, pos.ap, pos.dev, v.cab), boxed = here.rssi - v.enc;
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1.2; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(ap[0], ap[1]); c.lineTo(dv[0], dv[1]); c.stroke(); c.restore();
        S.node(c, ap[0], ap[1], { kind: 'router', r: 13, active: true });
        S.node(c, dv[0], dv[1], { kind: 'esp', r: 12, active: true });
        kit.label(c, 'router', ap[0], ap[1] - 22, { size: 10, color: C.text, align: 'center', bg: labelBg(C) });
        kit.label(c, 'device', dv[0], dv[1] - 21, { size: 10, color: C.text, align: 'center', bg: labelBg(C) });
        S.bars(c, clamp(dv[0] + 16, 2, W - 40), dv[1] + 8, boxed, { w: 28, h: 18, label: false });
        // the key
        const ly = y0 + PLAN.h * s + 20, keys = [[-48, '> −55'], [-60, '−55 to −67'], [-72, '−67 to −78'], [-84, '−78 to −90'], [-97, 'none']];
        keys.forEach(([r, t], i) => { const kx = x0 + i * Math.min(112, (PLAN.w * s) / 5); c.fillStyle = heatColor(C, r); c.fillRect(kx, ly - 6, 12, 12); kit.label(c, t, kx + 16, ly, { size: 9.5, color: C.text2 }); });
        kit.label(c, 'colours: dBm at the device', x0, ly + 20, { size: 9.5, color: C.muted });
        kit.label(c, 'walls: plasterboard 3 · brick 7 · concrete 12 · cabinet 25 dB', x0, ly + 34, { size: 9.5, color: C.muted });
        const names = {}; here.crossed.forEach(t => { names[t] = (names[t] || 0) + 1; });
        const list = Object.keys(names).map(t => names[t] + ' ' + (t === 'cabinet' ? 'metal cabinet' : WALL[t].name)).join(', ');
        ro.set('bare', minus(Math.round(here.rssi)) + ' dBm · ' + E.rssiQuality(here.rssi));
        ro.set('boxed', minus(Math.round(boxed)) + ' dBm · ' + E.rssiQuality(boxed));
        ro.set('cross', list || 'nothing: open path');
        ro.set('v', boxed >= -67 ? 'a dependable link' : boxed >= -78 ? 'usable, with little margin' : boxed >= -90 ? 'weak: dropouts likely' : 'no link');
      }, box.stage);
      kit.drag(st, {
        hit: p => {
          const a = [geo.x0 + pos.ap[0] * geo.s, geo.y0 + pos.ap[1] * geo.s], d = [geo.x0 + pos.dev[0] * geo.s, geo.y0 + pos.dev[1] * geo.s];
          if (Math.hypot(p.x - d[0], p.y - d[1]) < 22) return 'dev';
          if (Math.hypot(p.x - a[0], p.y - a[1]) < 22) return 'ap';
          return null;
        },
        move: (w, p) => {
          pos[w] = [clamp((p.x - geo.x0) / geo.s, 0.3, PLAN.w - 0.3), clamp((p.y - geo.y0) / geo.s, 0.3, PLAN.h - 0.3)];
          if (w === 'ap') dirty = true;
          loop.once();
        },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ra-fresnel */
  Hyper.sim('ra-fresnel', {
    title: 'The Fresnel zone, the ground and an obstacle',
    blurb: `Radio does not run along a thread. It fills a **rugby-ball shaped zone** between the antennas, the first Fresnel zone (solid line); keep **60 per cent** of it clear (dashed). The picture is stretched vertically to make the zone visible. The obstacle can be **dragged** sideways and up and down. Its loss is the standard knife-edge diffraction estimate: about **6 dB when it just touches the line** of sight, little when it stays clear of 60 per cent of the zone, a lot when it cuts across. Antennas are at the same height at both ends; the other numbers are for a 15 dBm transmitter and a −90 dBm receiver.

**Try this**
- Lengthen the **link** to 1 km: the zone grows to several metres and the ground enters it unless the masts are tall.
- Raise the **obstacle** until it touches the dashed line, then the solid line, then the line of sight: read the loss at each.
- Switch the band to **5 GHz**: the zone is about two thirds as wide.
- Lower the masts to 0.3 m and watch the ground cut the zone off.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.68, minH: 360, maxH: 500 });
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Link length', min: 10, max: 2000, value: 200, unit: 'm', log: true, sig: 2 },
        { id: 'f', type: 'select', label: 'Band', options: [['2.4 GHz', 2442], ['5 GHz', 5500]], value: 2442 },
        { id: 'hA', label: 'Antenna height, both ends', min: 0.2, max: 15, step: 0.1, value: 3, unit: 'm' },
        { id: 'pos', label: 'Obstacle position along the link', min: 5, max: 95, step: 1, value: 50, unit: '%' },
        { id: 'ho', label: 'Obstacle height', min: 0, max: 20, step: 0.1, value: 2.5, unit: 'm' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['r', 'Zone radius at the obstacle'], ['clear', 'Obstacle against the zone'], ['loss', 'Loss from the obstacle'], ['ground', 'Ground clearance, middle of the link'], ['margin', 'Margin left']]);
      let geo = { xl: 0, xr: 1, gy: 0, vs: 1, D: 1 };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const lam = E.wavelength(v.f), D = v.D, d1 = D * v.pos / 100, d2 = D - d1, rAt = x => Math.sqrt(lam * Math.max(0, x) * Math.max(0, D - x) / D);
        const rMid = rAt(D / 2), r1 = rAt(d1), clearM = v.hA - v.ho, clearFrac = clearM / Math.max(1e-6, r1);
        const xl = 46, xr = W - 46, gy = H - 58, ytop = 28;
        const ymax = Math.max(1.2 * (v.hA + rMid), v.ho * 1.12 + 0.6, 3), vs = (gy - ytop) / ymax;
        const X = m => xl + m / D * (xr - xl), Y = h => gy - h * vs;
        geo = { xl, xr, gy, vs, D };
        c.fillStyle = C.dark ? '#22301f' : '#c5dcbc'; c.fillRect(0, gy, W, H - gy - 28);
        kit.label(c, 'ground', 8, gy + 12, { size: 10, color: C.muted });
        // the first Fresnel zone, cut off by the ground, and the 60 per cent zone inside it
        const zone = k => {
          c.beginPath();
          for (let i = 0; i <= 80; i++) { const m = D * i / 80, y = Y(v.hA + k * rAt(m)); if (i) c.lineTo(X(m), y); else c.moveTo(X(m), y); }
          for (let i = 80; i >= 0; i--) { const m = D * i / 80; c.lineTo(X(m), Y(v.hA - k * rAt(m))); }
          c.closePath();
        };
        c.save(); c.beginPath(); c.rect(0, 0, W, gy); c.clip();
        zone(1); c.globalAlpha = 0.16; c.fillStyle = C.accent; c.fill(); c.globalAlpha = 1; c.strokeStyle = C.accent; c.lineWidth = 1.6; c.stroke();
        zone(0.6); c.setLineDash([5, 4]); c.strokeStyle = C.ok; c.lineWidth = 1.2; c.stroke();
        c.restore();
        // the line of sight and the two masts
        c.save(); c.setLineDash([2, 4]); c.strokeStyle = C.text2; c.lineWidth = 1.2; c.beginPath(); c.moveTo(xl, Y(v.hA)); c.lineTo(xr, Y(v.hA)); c.stroke(); c.restore();
        c.strokeStyle = C.muted; c.lineWidth = 3;
        [xl, xr].forEach(x => { c.beginPath(); c.moveTo(x, gy); c.lineTo(x, Y(v.hA)); c.stroke(); kit.dot(c, x, Y(v.hA), 5, C.warn); });
        kit.label(c, 'ESP', xl, gy + 14, { size: 10.5, color: C.text2, align: 'center' });
        kit.label(c, 'router', xr, gy + 14, { size: 10.5, color: C.text2, align: 'center' });
        // the obstacle
        const ox = X(d1), top = Y(v.ho), col = clearM < 0 ? C.bad : clearFrac < 0.6 ? C.warn : C.ok;
        c.save(); c.globalAlpha = 0.8; c.fillStyle = col; c.fillRect(ox - 8, top, 16, Math.max(2, gy - top)); c.restore();
        c.strokeStyle = col; c.lineWidth = 1.5; c.strokeRect(ox - 8 + 0.5, top + 0.5, 15, Math.max(1, gy - top - 1));
        kit.label(c, 'obstacle (drag me)', clamp(ox, 70, W - 70), Math.max(14, top - 10), { size: 10, color: col, align: 'center', bg: labelBg(C) });
        c.strokeStyle = C.text2; c.lineWidth = 1; c.beginPath(); c.moveTo(ox + 15, Y(v.hA + r1)); c.lineTo(ox + 15, Y(v.hA - r1)); c.stroke();
        kit.label(c, 'r', ox + 20, Y(v.hA + r1 / 2), { size: 10, color: C.text2 });
        kit.label(c, 'first Fresnel zone, radius at the middle ' + kit.fmt(rMid, 3) + ' m', xl, 12, { size: 10.5, color: C.text2 });
        kit.label(c, 'link ' + kit.fmt(D, 3) + ' m · dashed line: 60 % of the zone', W / 2, H - 14, { size: 10.5, color: C.muted, align: 'center' });
        // the numbers: knife-edge diffraction, ITU-R P.526 approximation
        const vv = -clearM * Math.sqrt(2 * D / (lam * Math.max(1e-6, d1 * d2)));
        const loss = vv > -0.78 ? Math.max(0, 6.9 + 20 * Math.log10(Math.sqrt((vv - 0.1) * (vv - 0.1) + 1) + vv - 0.1)) : 0;
        const base = E.link({ tx: 15, gt: 0, gr: 2, mhz: v.f, d: D, n: 2, sens: -90 });
        ro.set('r', kit.fmt(r1, 3) + ' m');
        ro.set('clear', clearM < 0 ? 'cuts the line of sight by ' + kit.fmt(-clearM, 3) + ' m' : clearFrac >= 1 ? 'outside the zone' : kit.fmt(clearFrac * 100, 3) + ' % of the zone radius clear' + (clearFrac < 0.6 ? ' (60 needed)' : ''));
        ro.set('loss', kit.fmt(loss, 3) + ' dB');
        ro.set('ground', kit.fmt(100 * v.hA / Math.max(1e-6, rMid), 3) + ' % of the radius' + (v.hA < 0.6 * rMid ? ': the ground cuts into the zone' : ''));
        ro.set('margin', kit.fmt(base.margin - loss, 3) + ' dB (open air, 15 dBm, 2 dBi at one end, −90 dBm needed)');
      }, box.stage);
      kit.drag(st, {
        hit: p => { const ox = geo.xl + (ctl.values.pos / 100) * (geo.xr - geo.xl), top = geo.gy - ctl.values.ho * geo.vs; return Math.abs(p.x - ox) < 14 && p.y >= top - 8 && p.y <= geo.gy ? 'obs' : null; },
        move: (o, p) => {
          ctl.set('pos', clamp(Math.round((p.x - geo.xl) / (geo.xr - geo.xl) * 100), 5, 95), false);
          ctl.set('ho', clamp(Math.round((geo.gy - p.y) / geo.vs * 10) / 10, 0, 20), false);
          loop.once();
        },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ra-band */
  // the 5 GHz channels (20 MHz) open in two regions, and the groups the wider channels are made of
  const FIVE = {
    us: [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 149, 153, 157, 161, 165],
    eu: [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140]
  };
  const BOND = {
    20: FIVE.us.map(c => [c]),
    40: [[36, 40], [44, 48], [52, 56], [60, 64], [100, 104], [108, 112], [116, 120], [124, 128], [132, 136], [140, 144], [149, 153], [157, 161]],
    80: [[36, 40, 44, 48], [52, 56, 60, 64], [100, 104, 108, 112], [116, 120, 124, 128], [132, 136, 140, 144], [149, 153, 157, 161]],
    160: [[36, 40, 44, 48, 52, 56, 60, 64], [100, 104, 108, 112, 116, 120, 124, 128]]
  };
  const isDfs = ch => (ch >= 52 && ch <= 64) || (ch >= 100 && ch <= 144);
  const UNII = [['U-NII-1', 36, 48, false], ['U-NII-2A', 52, 64, true], ['U-NII-2C', 100, 144, true], ['U-NII-3', 149, 165, false]];
  Hyper.sim('ra-band', {
    title: 'A shared band: who sits where',
    blurb: `**2.4 GHz view.** One scale in MHz for all three radios. The humps are Wi-Fi's 13 channels; your network (accent) is on the channel you choose. The Bluetooth LE channels and the Zigbee or Thread channels that **overlap it turn red**; the green ones are clear. The three BLE advertising channels (37, 38, 39) and Zigbee channels 15, 20, 25 and 26 sit in the gaps. Switch on the **microwave oven** and see what it covers.

**5 GHz view** (the ESP32-C5's other band). The blocks are 20 MHz channels; the bars underneath are the **wider channels** made from them, and the amber ones need radar avoidance (DFS). Note how the whole 2.4 GHz band, drawn on the same scale, is a sliver of it. **The channel lists are the standard plans; which are open depends on the country.**

**Try this**
- Put Wi-Fi on **channel 6** and look for the Zigbee channel that stays green on 1, 6 and 11.
- Move Wi-Fi to **channel 3**: how many more BLE channels turn red?
- In the 5 GHz view, step the width from 20 to 160 MHz and watch the number of clear channels fall.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const five = !!(params && params.view === 'five');
      const st = kit.stage(box.stage, { aspect: five ? 0.62 : 0.74, minH: 380, maxH: 560 });
      const defs = five ? [
        { id: 'region', type: 'select', label: 'Region', options: [['Every channel open (as in the United States)', 'us'], ['Europe: 36 to 64 and 100 to 140', 'eu']], value: 'us' },
        { id: 'width', type: 'select', label: 'Channel width', options: [['20 MHz', 20], ['40 MHz (the most an ESP32-C5 uses)', 40], ['80 MHz', 80], ['160 MHz', 160]], value: 20 },
        { id: 'dfs', type: 'check', label: 'Mark the radar (DFS) channels', value: true }
      ] : [
        { id: 'wifi', label: 'Wi-Fi channel', min: 1, max: 13, step: 1, value: 6 },
        { id: 'zig', label: 'Zigbee or Thread channel', min: 11, max: 26, step: 1, value: 15 },
        { id: 'oven', type: 'check', label: 'Microwave oven running', value: false }
      ];
      const ctl = kit.controls(box.side, defs, () => loop.once());
      const ro = kit.readout(box.side, five ? [['count', 'Clear channels at this width'], ['dfs', 'Of them, needing radar avoidance'], ['vs', 'At 2.4 GHz, 20 MHz'], ['note', 'The ESP32-C5']]
        : [['wifi', 'Your Wi-Fi channel'], ['ble', 'Bluetooth LE channels overlapped'], ['zig', 'Your Zigbee channel'], ['oven', 'The microwave oven']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H, pl = 14, pw = W - 2 * pl;
        if (five) drawFive(c, C, v, W, H, pl, pw); else draw24(c, C, v, W, H, pl, pw);
      }, box.stage);
      function draw24(c, C, v, W, H, pl, pw) {
        const F0 = 2395, F1 = 2490, X = f => pl + (f - F0) / (F1 - F0) * pw, fw = E.wifiChannel(v.wifi);
        const hitW = f => Math.abs(f - fw) < 11;
        const wy = 40, wh = Math.min(96, H * 0.22), base = wy + wh, by = base + 46, bh = 24, zy = by + bh + 46, zh = 24, bottom = zy + zh + 14;
        if (v.oven) {
          c.save(); c.globalAlpha = 0.13; c.fillStyle = C.warn; c.fillRect(X(2425), wy - 10, X(2475) - X(2425), bottom - wy + 10); c.restore();
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(X(2415), base); c.lineTo(X(2450), wy + 6); c.lineTo(X(2485), base); c.stroke(); c.restore();
          kit.label(c, 'microwave oven', X(2450), wy - 2, { size: 10, color: C.warn, align: 'center' });
        }
        // Wi-Fi: 13 humps
        kit.label(c, 'Wi-Fi: 13 channels, each about 20 MHz wide', pl, wy - 22, { size: 10.5, color: C.text2, weight: 600 });
        for (let ch = 1; ch <= 13; ch++) {
          const fc = E.wifiChannel(ch), mine = ch === v.wifi;
          c.beginPath(); c.moveTo(X(fc - 11), base); c.lineTo(X(fc - 9), wy + 14); c.lineTo(X(fc + 9), wy + 14); c.lineTo(X(fc + 11), base);
          if (mine) { c.save(); c.globalAlpha = 0.32; c.fillStyle = C.accent; c.fill(); c.restore(); c.strokeStyle = C.accent; c.lineWidth = 2.4; }
          else { c.strokeStyle = C.faint; c.lineWidth = 1; }
          c.stroke();
          const clear = E.WIFI_CLEAR.includes(ch);
          kit.label(c, String(ch), X(fc), base + 11, { size: clear ? 11 : 9.5, color: mine ? C.accent : clear ? C.text : C.muted, weight: clear || mine ? 700 : 400, align: 'center' });
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(pl, base + 0.5); c.lineTo(pl + pw, base + 0.5); c.stroke();
        // Bluetooth LE: 40 channels
        kit.label(c, 'Bluetooth LE: 40 channels of 2 MHz; 37, 38, 39 advertise', pl, by - 12, { size: 10.5, color: C.text2, weight: 600 });
        let hitData = 0, hitAdv = 0;
        for (let ch = 0; ch < 40; ch++) {
          const fb = E.bleChannel(ch), hit = hitW(fb), adv = ch >= 37;
          if (hit) { if (adv) hitAdv++; else hitData++; }
          c.fillStyle = hit ? C.bad : adv ? C.ok : C.muted; c.globalAlpha = hit || adv ? 0.95 : 0.55;
          c.fillRect(X(fb - 0.9), by, Math.max(2, X(fb + 0.9) - X(fb - 0.9)), bh); c.globalAlpha = 1;
          if (adv) kit.label(c, String(ch), X(fb), by + bh + 10, { size: 9.5, color: hit ? C.bad : C.ok, align: 'center', weight: 700 });
        }
        // Zigbee and Thread: channels 11 to 26
        kit.label(c, 'Zigbee and Thread: channels 11 to 26, 5 MHz apart', pl, zy - 12, { size: 10.5, color: C.text2, weight: 600 });
        let clearAll = true;
        for (let ch = 11; ch <= 26; ch++) {
          const fz = E.zigbeeChannel(ch), hit = hitW(fz), sel = ch === v.zig;
          if (ch === v.zig) clearAll = E.WIFI_CLEAR.every(w => Math.abs(fz - E.wifiChannel(w)) >= 11);
          c.fillStyle = hit ? C.bad : C.ok; c.globalAlpha = sel ? 1 : 0.7; c.fillRect(X(fz - 1.2), zy, Math.max(3, X(fz + 1.2) - X(fz - 1.2)), zh); c.globalAlpha = 1;
          if (sel) { c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(X(fz - 1.2) - 1.5, zy - 1.5, Math.max(3, X(fz + 1.2) - X(fz - 1.2)) + 3, zh + 3); }
          kit.label(c, String(ch), X(fz), zy + zh + 10, { size: 9.5, color: sel ? C.text : C.muted, align: 'center', weight: sel ? 700 : 400 });
        }
        kit.label(c, 'MHz: ' + [2400, 2420, 2440, 2460, 2480].join('  ·  '), pl, bottom + 8, { size: 9.5, color: C.faint });
        // the numbers
        const fz = E.zigbeeChannel(v.zig);
        ro.set('wifi', 'channel ' + v.wifi + ' · ' + (fw - 10) + ' to ' + (fw + 10) + ' MHz');
        ro.set('ble', hitData + ' of 37 data channels · advertising: ' + hitAdv + ' of 3');
        ro.set('zig', 'channel ' + v.zig + ' at ' + fz + ' MHz: ' + (hitW(fz) ? 'overlapped by your Wi-Fi' : 'clear of your Wi-Fi') + (clearAll ? '; clear of 1, 6 and 11' : '; not clear of every standard Wi-Fi channel'));
        if (v.oven) {
          const inOven = f => f > 2425 && f < 2475;
          let nw = 0, nb = 0, nz = 0;
          for (let ch = 1; ch <= 13; ch++) if (Math.abs(E.wifiChannel(ch) - 2450) < 35) nw++;
          for (let ch = 0; ch < 40; ch++) if (inOven(E.bleChannel(ch))) nb++;
          for (let ch = 11; ch <= 26; ch++) if (inOven(E.zigbeeChannel(ch))) nz++;
          ro.set('oven', 'noise from 2425 to 2475 MHz: reaches ' + nw + ' Wi-Fi, ' + nb + ' BLE and ' + nz + ' Zigbee channels');
        } else ro.set('oven', 'off');
      }
      function drawFive(c, C, v, W, H, pl, pw) {
        const F0 = 5150, F1 = 5840, X = f => pl + (f - F0) / (F1 - F0) * pw, avail = FIVE[v.region] || FIVE.us;
        const groups = (BOND[v.width] || BOND[20]).filter(g => g.every(ch => avail.includes(ch)));
        // the 2.4 GHz band at the same scale
        const mw = X(F0 + 84) - X(F0), y24 = 40;
        kit.label(c, '2.4 GHz band, on the same scale', pl, y24 - 14, { size: 10.5, color: C.text2, weight: 600 });
        c.strokeStyle = C.muted; c.lineWidth = 1.4; c.strokeRect(pl, y24, mw, 26);
        [1, 6, 11].forEach(ch => { const fc = E.wifiChannel(ch); c.fillStyle = C.accent; c.globalAlpha = 0.6; c.fillRect(pl + (fc - 10 - 2400) / 84 * mw, y24 + 4, 20 / 84 * mw - 1, 18); c.globalAlpha = 1; });
        kit.label(c, '3 clear channels of 20 MHz', pl + mw + 8, y24 + 13, { size: 10.5, color: C.text2 });
        // the 5 GHz channels
        const y5 = 120, h5 = 40;
        kit.label(c, '5 GHz: 20 MHz channels (frequency = 5000 + 5 × number)', pl, y5 - 44, { size: 10.5, color: C.text2, weight: 600 });
        UNII.forEach(([name, a, b, dfs]) => {
          const xa = X(5000 + 5 * a - 10), xb = X(5000 + 5 * b + 10);
          c.strokeStyle = dfs && v.dfs ? C.warn : C.muted; c.lineWidth = 1.4; c.beginPath(); c.moveTo(xa, y5 - 8); c.lineTo(xa, y5 - 14); c.lineTo(xb, y5 - 14); c.lineTo(xb, y5 - 8); c.stroke();
          kit.label(c, name, (xa + xb) / 2, y5 - 24, { size: 9.5, color: dfs && v.dfs ? C.warn : C.text2, align: 'center' });
        });
        FIVE.us.forEach(ch => {
          const fc = 5000 + 5 * ch, x = X(fc - 10) + 0.5, w = X(fc + 10) - X(fc - 10) - 1, on = avail.includes(ch), dfs = isDfs(ch) && v.dfs;
          if (on) { c.fillStyle = dfs ? C.warn : C.accent; c.globalAlpha = 0.55; c.fillRect(x, y5, w, h5); c.globalAlpha = 1; c.strokeStyle = dfs ? C.warn : C.accent; c.lineWidth = 1; c.strokeRect(x + 0.5, y5 + 0.5, w - 1, h5 - 1); }
          else { c.save(); c.setLineDash([3, 3]); c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x + 0.5, y5 + 0.5, w - 1, h5 - 1); c.restore(); }
        });
        [36, 64, 100, 144, 149, 165].forEach(ch => kit.label(c, String(ch), X(5000 + 5 * ch), y5 + h5 + 10, { size: 9, color: C.muted, align: 'center' }));
        // the wider channels made from them
        kit.label(c, v.width + ' MHz channels: ' + groups.length + ' in this region', pl, y5 + h5 + 34, { size: 10.5, color: C.text2, weight: 600 });
        groups.forEach((g, i) => {
          const xa = X(5000 + 5 * g[0] - 10) + 1, xb = X(5000 + 5 * g[g.length - 1] + 10) - 1, y = y5 + h5 + 44 + (i % 2) * 15, dfs = g.some(isDfs) && v.dfs;
          c.fillStyle = dfs ? C.warn : C.ok; c.globalAlpha = 0.8; c.fillRect(xa, y, Math.max(2, xb - xa), 11); c.globalAlpha = 1;
        });
        kit.label(c, 'MHz: 5200 · 5400 · 5600 · 5800 (channels 40, 80, 120, 160)', pl, H - 12, { size: 9.5, color: C.faint });
        const nd = groups.filter(g => g.some(isDfs)).length;
        ro.set('count', groups.length + ' at ' + v.width + ' MHz');
        ro.set('dfs', nd + ' of ' + groups.length + ' (they must leave if radar is heard)');
        ro.set('vs', '3 clear channels (1, 6, 11)');
        ro.set('note', 'the only microcontroller of the family with 5 GHz Wi-Fi; its Bluetooth LE and 802.15.4 stay on 2.4 GHz');
      }
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ra-eirp */
  const STEPS = [19.5, 19, 18.5, 17, 15, 13, 11, 8.5, 7, 5, 2];     // the named Wi-Fi power steps of the Arduino core, dBm
  Hyper.sim('ra-eirp', {
    title: 'Transmit power, antenna gain and the limit',
    blurb: `Read the bars left to right: the **chip's largest output** (catalogue), the **power setting** you choose, the **cable**, the power **at the antenna socket**, the **antenna gain**, and the **EIRP** that results. The dashed lines are the limit under the rule you pick. The read-out names the **highest named power step** that stays inside the limit. **The limits are summaries to show how each rule works** (Europe: 20 dBm EIRP at 2.4 GHz; United States: 30 dBm conducted, less 1 dB for each dB of antenna gain above 6 dBi); rules change and differ by country, so check yours. This is not legal advice.

**Try this**
- Start at the **chip maximum** with a **0 dBi** antenna in Europe: close to the limit already.
- Raise the antenna to **5 dBi**: over the limit. Read which step brings it back.
- Switch to the **United States** rule and watch the limit move with the antenna gain.
- Add 3 dB of cable loss and see how it buys back some of the antenna's gain.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 380, maxH: 540 });
      const chips = E.CHIPS.filter(x => x.wifi && x.txDbm != null);
      const short = x => x.name.replace(/ \(.*\)/, '');
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(x => [short(x), x.id]), value: 'esp32-s3' },
        { id: 'set', type: 'select', label: 'Power setting', options: [['Chip maximum', 99]].concat(STEPS.map(s => [s + ' dBm', s])), value: 99 },
        { id: 'cable', label: 'Cable and connector loss', min: 0, max: 6, step: 0.5, value: 0.5, unit: 'dB' },
        { id: 'gain', label: 'Antenna gain', min: -3, max: 12, step: 0.5, value: 2, unit: 'dBi' },
        { id: 'rule', type: 'select', label: 'The rule', options: [['Europe: 20 dBm EIRP', 'eu'], ['United States: 30 dBm conducted, antenna up to 6 dBi', 'us'], ['My own limit', 'own']], value: 'eu' },
        { id: 'own', label: 'My own limit (EIRP)', min: 10, max: 36, step: 0.5, value: 20, unit: 'dBm' }
      ], () => { ctl.show('own', ctl.values.rule === 'own'); loop.once(); });
      const ro = kit.readout(box.side, [['eirp', 'EIRP'], ['m', 'Against the limit'], ['v', 'Verdict'], ['step', 'Highest step that stays inside'], ['cost', 'Cut from the chip maximum']]);
      ctl.show('own', false);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, chip = E.chip(v.chip), W = st.W, H = st.H;
        const eff = Math.min(v.set, chip.txDbm), sock = eff - v.cable, eirp = sock + v.gain;
        // the limit: at the socket (conducted) and/or in EIRP
        let limSock = null, limEirp = null;
        if (v.rule === 'eu') limEirp = 20;
        else if (v.rule === 'own') limEirp = v.own;
        else { limSock = 30 - Math.max(0, v.gain - 6); limEirp = limSock + v.gain; }
        const inside = v.rule === 'us' ? sock <= limSock + 1e-9 : eirp <= limEirp + 1e-9;
        const col = inside ? C.ok : C.bad;
        const steps = [
          { kind: 'abs', v: chip.txDbm, label: 'Chip\nmaximum' },
          { kind: 'delta', d: eff - chip.txDbm, label: 'Power\nsetting' },
          { kind: 'delta', d: -v.cable, label: 'Cable' },
          { kind: 'abs', v: sock, label: 'At the\nsocket', color: v.rule === 'us' ? col : C.accent },
          { kind: 'delta', d: v.gain, label: 'Antenna' },
          { kind: 'abs', v: eirp, label: 'EIRP', color: col }
        ];
        const lines = [];
        if (limSock != null) lines.push({ v: limSock, label: 'limit at the socket ' + kit.fmt(limSock, 3), from: 3, to: 3, color: C.warn });
        lines.push({ v: limEirp, label: 'limit ' + kit.fmt(limEirp, 3) + ' dBm EIRP', from: 4, to: 5, color: C.warn });
        const R = { x: 40, y: 26, w: W - 40 - 12, h: H - 26 - 56 };
        kit.label(c, chip.name + ' · levels in dBm', R.x, 10, { size: 10.5, color: C.muted });
        waterfall(c, C, kit, R, steps, { min: -10, max: 42, tick: 10, size: W < 520 ? 9.5 : 10.5, lines });
        // the highest step that stays inside the rule
        const maxSet = v.rule === 'us' ? limSock + v.cable : limEirp + v.cable - v.gain, cap = Math.min(maxSet, chip.txDbm);
        const step = STEPS.find(s => s <= cap + 1e-9);
        ro.set('eirp', kit.fmt(eirp, 3) + ' dBm (' + powerText(kit, eirp) + ')');
        const margin = v.rule === 'us' ? limSock - sock : limEirp - eirp;
        ro.set('m', margin >= 0 ? kit.fmt(margin, 3) + ' dB inside the limit' : kit.fmt(-margin, 3) + ' dB over the limit');
        ro.set('v', inside ? 'inside the limit' : 'over the limit: lower the power or the gain');
        ro.set('step', step == null ? 'no step is low enough' : kit.fmt(step, 3) + ' dBm (EIRP ' + kit.fmt(step - v.cable + v.gain, 3) + ' dBm)');
        ro.set('cost', step == null ? '—' : kit.fmt(chip.txDbm - step, 3) + ' dB lower than the chip maximum');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ra-match */
  Hyper.sim('ra-match', {
    title: 'Match, resonance and detuning, as a VNA shows them',
    blurb: `The top row is the radio chain: the chip, a **pi network** and the antenna, with the share of the power that comes **back** at 2442 MHz. The curve under it is what a **vector network analyser** measures, the return loss (S11). The **antenna length** sets where its resonance is when it is alone (dashed). A **hand or case** pulls it down. The **match** sets how deep the dip is, which is the work of the pi network. **Re-tune with the case on** moves the resonance back to the band centre, which is what tuning in the finished product does. **The model is a single resonance with a typical bandwidth**, not a measurement.

**Try this**
- Set **hand or case** to 80 per cent: the dip leaves the band and the reflected power grows.
- Press **Re-tune with the case on**: the dip returns, though the dashed curve (the antenna alone) is now off.
- Lower the **match** to 6 dB and see that even a perfectly placed dip reflects a quarter of the power.
- Read the **mismatch loss** at 2 : 1 VSWR: it is only about half a decibel.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 400, maxH: 560 });
      const SHIFT = 110, DEF = { trim: 2442, match: 22, near: 40 };
      const ctl = kit.controls(box.side, [
        { id: 'trim', label: 'Antenna length (its resonance, alone)', min: 2300, max: 2600, step: 5, value: DEF.trim, unit: 'MHz' },
        { id: 'match', label: 'Match at the dip (return loss)', min: 4, max: 30, step: 1, value: DEF.match, unit: 'dB' },
        { id: 'near', label: 'Hand or case near the antenna', min: 0, max: 100, step: 5, value: DEF.near, unit: '%' },
        { type: 'buttons', items: [{ id: 'retune', label: 'Re-tune with the case on', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'retune') ctl.set('trim', clamp(Math.round((2442 + SHIFT * ctl.values.near / 100) / 5) * 5, 2300, 2600), false);
        if (id === 'reset') Object.keys(DEF).forEach(k => ctl.set(k, DEF[k], false));
        loop.once();
      });
      const ro = kit.readout(box.side, [['res', 'Resonance'], ['rl', 'Return loss at 2442 MHz'], ['vswr', 'VSWR at 2442 MHz'], ['ml', 'Mismatch loss at 2442 MHz'], ['band', 'Wi-Fi band matched (10 dB)'], ['v', 'Verdict']]);
      const Q = 8;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const f0 = v.trim - SHIFT * v.near / 100, A0 = 1 - Math.pow(10, -v.match / 10);
        const a0 = absorbed(2442, f0, Q, A0), refl = 1 - a0, gam = Math.sqrt(Math.max(0, refl));
        // the chain: chip, pi network, antenna
        const y0 = 16, bh = 46, gap = clamp(W * 0.14, 50, 100), bw = (W - 24 - 2 * gap) / 3, cy = y0 + bh / 2;
        S.box(c, 12, y0, bw, bh, { label: 'Chip', sub: 'RF pin' });
        S.box(c, 12 + bw + gap, y0, bw, bh, { label: 'Pi network', sub: 'shunt · series · shunt', color: C.accent, active: true, dash: true });
        S.box(c, 12 + 2 * (bw + gap), y0, bw, bh, { label: 'Antenna', sub: 'resonance ' + Math.round(f0) + ' MHz' });
        S.wire(c, [[12 + bw, cy - 6], [12 + bw + gap, cy - 6]]);
        S.wire(c, [[12 + 2 * bw + gap, cy - 6], [12 + 2 * bw + 2 * gap, cy - 6]], { color: C.ok });
        kit.label(c, 'sent', 12 + 2 * bw + 1.5 * gap, cy - 16, { size: 9.5, color: C.ok, align: 'center' });
        kit.arrow(c, 12 + 2 * bw + 2 * gap - 2, cy + 10, 12 + 2 * bw + gap + 2, cy + 10, C.bad, 2.2 + 6 * refl);
        kit.label(c, 'back ' + kit.fmt(refl * 100, 2) + ' %', 12 + 2 * bw + 1.5 * gap, cy + 24, { size: 10, color: C.bad, align: 'center', weight: 650 });
        // the return-loss curve
        const pxl = 46, pw = W - pxl - 14, pyt = y0 + bh + 54, ph = H - pyt - 40, F0 = 2200, F1 = 2700;
        const X = f => pxl + (f - F0) / (F1 - F0) * pw, Y = rl => pyt + clamp(rl, 0, 30) / 30 * ph;
        c.save(); c.globalAlpha = 0.14; c.fillStyle = C.ok; c.fillRect(X(2400), pyt, X(2484) - X(2400), ph); c.restore();
        kit.label(c, 'Wi-Fi band', (X(2400) + X(2484)) / 2, pyt - 8, { size: 10, color: C.ok, align: 'center' });
        kit.label(c, 'S11 in dB (deeper is better) against MHz', pxl, pyt - 8, { size: 9.5, color: C.faint });
        c.lineWidth = 1;
        for (const rl of [0, 10, 20, 30]) { c.strokeStyle = C.grid; c.beginPath(); c.moveTo(pxl, Math.round(Y(rl)) + 0.5); c.lineTo(pxl + pw, Math.round(Y(rl)) + 0.5); c.stroke(); kit.label(c, rl ? '−' + rl : '0', pxl - 6, Y(rl), { size: 9.5, color: C.faint, align: 'right' }); }
        for (let f = 2200; f <= 2700; f += 100) kit.label(c, String(f), X(f), pyt + ph + 12, { size: 9.5, color: C.faint, align: 'center' });
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(pxl, Y(10)); c.lineTo(pxl + pw, Y(10)); c.stroke(); c.restore();
        kit.label(c, '−10 dB: the usual aim', pxl + pw, Y(10) - 8, { size: 9.5, color: C.accent, align: 'right' });
        const curve = (fr, col, lw, dash) => {
          c.save(); c.strokeStyle = col; c.lineWidth = lw; if (dash) c.setLineDash(dash); c.beginPath();
          for (let f = F0; f <= F1; f += 4) { const y = Y(rlOf(absorbed(f, fr, Q, A0))); if (f > F0) c.lineTo(X(f), y); else c.moveTo(X(f), y); }
          c.stroke(); c.restore();
        };
        curve(v.trim, C.faint, 1.4, [4, 4]);
        curve(f0, C.accent, 2.6);
        const dipY = Y(rlOf(absorbed(f0, f0, Q, A0)));
        kit.dot(c, X(f0), dipY, 4.5, C.accent, C.bg2);
        kit.label(c, Math.round(f0) + ' MHz', clamp(X(f0), pxl + 30, pxl + pw - 30), dipY + 13, { size: 10.5, color: C.accent, align: 'center', weight: 650 });
        kit.label(c, 'dashed: the antenna alone', pxl + pw, pyt + ph - 8, { size: 9.5, color: C.faint, align: 'right' });
        let ok = 0, n = 0;
        for (let f = 2400; f <= 2484; f += 2) { n++; if (rlOf(absorbed(f, f0, Q, A0)) >= 10) ok++; }
        const share = ok / n;
        ro.set('res', Math.round(f0) + ' MHz');
        ro.set('rl', kit.fmt(rlOf(a0), 3) + ' dB');
        ro.set('vswr', gam < 0.995 ? kit.fmt((1 + gam) / (1 - gam), 3) + ' : 1' : 'very high: almost all reflected');
        ro.set('ml', kit.fmt(-10 * Math.log10(Math.max(1e-4, a0)), 3) + ' dB');
        ro.set('band', Math.round(share * 100) + ' %');
        ro.set('v', share >= 0.99 ? 'matched across the band' : share > 0 ? 'matched over only part of the band' : 'not matched in the band');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
