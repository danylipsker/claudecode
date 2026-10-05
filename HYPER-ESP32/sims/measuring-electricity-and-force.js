/* HYPER-ESP32 · sims/measuring-electricity-and-force.js
 *
 * Simulations of the topic "Measuring electricity and force":
 *   me-adc-curve    the ADC against an ideal converter: counts, and the error of straight scaling against the calibrated reading
 *   me-attenuation  which of the four attenuation settings fits a sensor's output, and how many counts it gets
 *   me-noise        raw readings against averaged or median-filtered ones: scatter, bias, dither and spikes
 *   me-divider      a divider into the ADC: the ratio, the drain, the source resistance, and what it costs a sleeping battery product
 *   me-shunt        a shunt and the INA219: shunt voltage against its range, the step, the burden and the heat
 *   me-clamp        the pin voltage of a Hall chip or a current clamp against the ADC window, and the RMS the program reads
 *   me-power        voltage and current waveforms of four loads: real, apparent and reactive power, and the cost of sampling skew
 *   me-loadcell     a load cell and an HX711: bridge millivolts, counts, tare, scale factor and noise
 *   me-pulses       an edge counter in an interrupt against the pulse counter hardware, with dead time and contact bounce
 *   me-frequency    the error of counting in a gate, timing a period and timing whole periods, against frequency
 *   me-loop         a 4–20 mA loop (or a 0–10 V signal) into the ADC: range, faults and what the protection saves
 *
 * Numbers come from kit.esp (ADC ranges and curve, battery life, E-series, chip sleep currents); everything is drawn in theme
 * colours; static pictures redraw on demand (loop.once), and nothing runs by itself. Models marked "schematic" in a blurb are
 * representative, not measurements of a particular chip.
 */
(function () {
  'use strict';
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const fmt = (v, s) => Hyper.util.fmt(v, s);
  const tText = s => { const a = Math.abs(s); return a >= 1 ? fmt(s, 3) + ' s' : a >= 1e-3 ? fmt(s * 1e3, 3) + ' ms' : a >= 1e-6 ? fmt(s * 1e6, 3) + ' µs' : fmt(s * 1e9, 3) + ' ns'; };
  const fText = f => f >= 1e6 ? fmt(f / 1e6, 3) + ' MHz' : f >= 1e3 ? fmt(f / 1e3, 3) + ' kHz' : fmt(f, 3) + ' Hz';
  const rText = r => r >= 1e6 ? fmt(r / 1e6, 3) + ' MΩ' : r >= 1e3 ? fmt(r / 1e3, 3) + ' kΩ' : r >= 1 ? fmt(r, 3) + ' Ω' : fmt(r * 1e3, 3) + ' mΩ';
  const shade = C => C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';
  /* a seeded random generator, so a picture repeats until the reader asks for another */
  const rng = seed => { let s = (seed * 2654435761) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };
  const gauss = r => { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };
  const dash = (c, x0, y0, x1, y1, color, w) => { c.save(); c.setLineDash([5, 4]); c.strokeStyle = color; c.lineWidth = w || 1.4; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.restore(); };
  const line = (c, x0, y0, x1, y1, color, w) => { c.strokeStyle = color; c.lineWidth = w || 1; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); };
  const rgba = (C, ok) => ok ? (C.dark ? 'rgba(34,179,122,.22)' : 'rgba(34,179,122,.16)') : (C.dark ? 'rgba(229,72,77,.20)' : 'rgba(229,72,77,.12)');
  const CHIPS = [['ESP32', 'esp32'], ['ESP32-S2', 'esp32-s2'], ['ESP32-S3', 'esp32-s3'], ['ESP32-C3', 'esp32-c3'], ['ESP32-C6', 'esp32-c6']];
  const DBS = [['0 dB', 0], ['2.5 dB', 2.5], ['6 dB', 6], ['11 dB', 11]];
  /* where the converter of an original ESP32 reaches 4095 (schematic); for the others the top of the recommended range */
  const SAT = { 0: 1.1, 2.5: 1.45, 6: 2.1, 11: 3.2 };
  const satOf = (chip, db) => chip === 'esp32' ? SAT[db] : Hyper.esp.ADC_RANGE[chip][db][1];
  const rangeOf = (chip, db) => Hyper.esp.ADC_RANGE[chip][db];

  /* ================================================================ me-adc-curve */
  Hyper.sim('me-adc-curve', {
    title: 'The converter against the ideal, with and without calibration',
    blurb: `The upper graph is the count the converter reports for each voltage on the pin; the dotted line is an ideal converter. The lower graph is the **error in millivolts** of two ways to read it: straight scaling of the raw count (orange) and the calibrated millivolt function (the green band is the error that is left).

For the **original ESP32** the orange curve is a representative model of its uncalibrated converter: nothing below about 0.1 V, and a bend near the top. The other chips are drawn with a gentle bow of about one percent. Both are **schematic**: every real chip differs a little, which is why the factory calibration exists. The width of the green band is schematic too.

**Try this**
- Choose the ESP32 at 11 dB and slide the voltage towards zero: the orange error grows to about −100 mV, because the converter reads zero below 0.1 V.
- Compare the **0 dB** setting: the same shape, but the dead zone and the bend now sit at lower voltages.
- Choose the **ESP32-S3** or the C3: the dead zone is gone, and what remains is the bow.
- Click on a graph to move the input. Watch the two readings in the read-out: only one of them is good to a percent.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: params && params.view === 'error' ? 0.9 : 0.84, maxH: 620 });
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: CHIPS, value: 'esp32' },
        { id: 'db', type: 'select', label: 'Attenuation', options: DBS, value: 11 },
        { id: 'vin', label: 'Input voltage', min: 0, max: 3.3, step: 0.01, value: 1.2, unit: 'V' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['count', 'Raw count'], ['straight', 'Straight scaling'], ['cal', 'Calibrated reading'], ['err1', 'Error, straight scaling'], ['err2', 'Error, calibrated (about)'], ['win', 'Recommended range']]);
      let geo = null;
      const uncal = (chip, db, V) => {
        const sat = satOf(chip, db);
        if (chip === 'esp32') return Math.round(E.adcEsp32Raw(V * 3.2 / sat));
        const x = clamp(V / sat, 0, 1);
        return Math.round(clamp(x + 0.012 * Math.sin(Math.PI * x), 0, 1) * 4095);
      };
      const straight = (chip, db, V) => uncal(chip, db, V) / 4095 * satOf(chip, db) * 1000;           // mV from straight scaling
      const resid = V => 0.006 * V * 1000 * Math.sin(6.3 * V + 1) + 4 * Math.cos(11 * V);               // mV left after calibration (schematic)
      const calRead = (chip, db, V) => {
        const r = rangeOf(chip, db);
        if (V < r[0]) return 0;
        if (V <= r[1]) return V * 1000 + resid(V);
        return (r[1] + 0.5 * (V - r[1])) * 1000;                                                       // above the range the curve flattens
      };
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, r = rangeOf(v.chip, v.db), sat = satOf(v.chip, v.db);
        const lx = 58, rx = 14, pw = st.W - lx - rx, big = params && params.view === 'error';
        const y1 = 24, h1 = Math.round((st.H - 100) * (big ? 0.34 : 0.48)), y2 = y1 + h1 + 44, h2 = st.H - y2 - 36;
        const X = V => lx + pw * V / 3.3;
        geo = { lx, pw, y1, h1, y2, h2 };
        // upper graph: counts
        c.fillStyle = rgba(C, false); c.fillRect(lx, y1, pw, h1);
        c.fillStyle = rgba(C, true); c.fillRect(X(r[0]), y1, X(r[1]) - X(r[0]), h1);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(lx + 0.5, y1 + 0.5, pw, h1);
        for (let V = 0; V <= 3.3001; V += 0.5) { const x = Math.round(X(V)) + 0.5; line(c, x, y1, x, y1 + h1, C.grid); kit.label(c, fmt(V, 2), x, y1 + h1 + 11, { size: 10, color: C.muted, align: 'center' }); }
        kit.label(c, 'count (12 bits)', lx, y1 - 11, { size: 10.5, color: C.muted });
        kit.label(c, '4095', lx - 6, y1 + 2, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, '0', lx - 6, y1 + h1, { size: 10, color: C.muted, align: 'right' });
        const Y1 = n => y1 + h1 - h1 * n / 4095;
        c.save(); c.setLineDash([2, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.6; c.beginPath(); c.moveTo(X(0), Y1(0)); c.lineTo(X(Math.min(3.3, sat)), Y1(4095 * Math.min(1, 3.3 / sat))); c.stroke(); c.restore();
        c.strokeStyle = kit.hue(30); c.lineWidth = 2.2; c.beginPath();
        for (let i = 0; i <= pw; i++) { const V = 3.3 * i / pw, n = uncal(v.chip, v.db, V); if (i) c.lineTo(lx + i, Y1(n)); else c.moveTo(lx + i, Y1(n)); }
        c.stroke();
        const n0 = uncal(v.chip, v.db, v.vin), x0 = X(v.vin);
        dash(c, x0, y1 + h1, x0, Y1(n0), C.warn, 1.4); kit.dot(c, x0, Y1(n0), 4.5, C.warn, C.text);
        kit.label(c, 'dotted: ideal · orange: the chip · green: range', lx + 6, y1 + 12, { size: 10.5, color: C.muted });
        // lower graph: errors in mV
        let emax = 20;
        for (let i = 0; i <= 160; i++) { const V = 3.3 * i / 160; emax = Math.max(emax, Math.abs(straight(v.chip, v.db, V) - V * 1000), Math.abs(calRead(v.chip, v.db, V) - V * 1000) * (V <= r[1] ? 1 : 0)); }
        const em = Math.ceil(emax * 1.15 / 10) * 10, Y2 = e => y2 + h2 / 2 - (h2 / 2) * clamp(e / em, -1, 1);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(lx + 0.5, y2 + 0.5, pw, h2);
        line(c, lx, Y2(0), lx + pw, Y2(0), C.axis, 1);
        for (let V = 0; V <= 3.3001; V += 0.5) { const x = Math.round(X(V)) + 0.5; line(c, x, y2, x, y2 + h2, C.grid); kit.label(c, fmt(V, 2) + ' V', x, y2 + h2 + 11, { size: 10, color: C.muted, align: 'center' }); }
        kit.label(c, 'error in mV (reading − true)', lx, y2 - 11, { size: 10.5, color: C.muted });
        kit.label(c, '+' + em, lx - 6, y2 + 2, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, '−' + em, lx - 6, y2 + h2 - 2, { size: 10, color: C.muted, align: 'right' });
        // the band left after calibration (inside the recommended range), then straight scaling
        c.fillStyle = C.dark ? 'rgba(34,179,122,.30)' : 'rgba(34,179,122,.26)'; c.beginPath();
        const band = [];
        for (let i = 0; i <= pw; i++) { const V = 3.3 * i / pw; if (V >= r[0] && V <= r[1]) band.push([lx + i, 0.012 * V * 1000 + 8]); }
        if (band.length > 1) {
          band.forEach((p, i) => { if (i) c.lineTo(p[0], Y2(p[1])); else c.moveTo(p[0], Y2(p[1])); });
          for (let i = band.length - 1; i >= 0; i--) c.lineTo(band[i][0], Y2(-band[i][1]));
          c.closePath(); c.fill();
        }
        c.strokeStyle = kit.hue(30); c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= pw; i++) { const V = 3.3 * i / pw, e = straight(v.chip, v.db, V) - V * 1000; if (i) c.lineTo(lx + i, Y2(e)); else c.moveTo(lx + i, Y2(e)); }
        c.stroke();
        const e0 = straight(v.chip, v.db, v.vin) - v.vin * 1000;
        dash(c, x0, y2, x0, y2 + h2, C.warn, 1.2); kit.dot(c, x0, Y2(e0), 4.5, C.warn, C.text);
        kit.label(c, 'orange: straight scaling · green: after calibration', lx + 6, y2 + 12, { size: 10.5, color: C.muted });
        // numbers
        const cal = calRead(v.chip, v.db, v.vin), stv = straight(v.chip, v.db, v.vin);
        ro.set('count', n0 + ' of 4095');
        ro.set('straight', fmt(stv, 4) + ' mV');
        ro.set('cal', fmt(cal, 4) + ' mV' + (v.vin > r[1] ? '  (above the range)' : v.vin < r[0] ? '  (below the range)' : ''));
        ro.set('err1', (e0 >= 0 ? '+' : '') + fmt(e0, 3) + ' mV' + (v.vin > 0.05 ? ' (' + fmt(100 * e0 / (v.vin * 1000), 2) + ' %)' : ''));
        ro.set('err2', v.vin >= r[0] && v.vin <= r[1] ? '± ' + fmt(0.012 * v.vin * 1000 + 8, 2) + ' mV' : 'not specified');
        ro.set('win', fmt(r[0], 3) + ' to ' + fmt(r[1], 3) + ' V');
      };
      const loop = kit.loop(draw, box.stage);
      kit.click(st, p => { if (geo && p.x >= geo.lx && p.x <= geo.lx + geo.pw) ctl.set('vin', Math.round(clamp((p.x - geo.lx) / geo.pw * 3.3, 0, 3.3) * 100) / 100, true); }, p => !!geo && p.x >= geo.lx && p.x <= geo.lx + geo.pw);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ me-attenuation */
  Hyper.sim('me-attenuation', {
    title: 'Which attenuation fits the sensor?',
    blurb: `Each row is one attenuation setting: the green bar is the voltage range the chip recommends for it, and the blue band is the output of your sensor. A setting **fits** when the band lies inside the bar; the **best** one is the smallest range that fits, because its counts are the finest. A red end is a part of the sensor's range the converter cannot see.

The counts per volt use the converter's full scale for each setting (for the original ESP32 a representative figure, since its top is soft), so treat them as a guide.

**Try this**
- Set the sensor to 0.05 to 1.1 V on an **ESP32-S3**: 0 dB clips, 2.5 dB is the best fit, and 11 dB wastes more than half the counts.
- Choose the **original ESP32** and set the minimum to 0 V: every setting loses the bottom 0.1 to 0.15 V (red at the left).
- Set the maximum above 2.5 V on the **C3**: nothing fits.
- Compare **how many counts** the sensor's span gets at the best setting and at the default 11 dB.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.62, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: CHIPS.concat([['ESP32-H2', 'esp32-h2']]), value: 'esp32-s3' },
        { id: 'lo', label: 'Sensor output, lowest', min: 0, max: 3.2, step: 0.01, value: 0.05, unit: 'V' },
        { id: 'hi', label: 'Sensor output, highest', min: 0.1, max: 3.3, step: 0.01, value: 1.1, unit: 'V' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['best', 'Best setting'], ['counts', 'Counts over the span there'], ['step', 'One count there'], ['def', 'Counts at 11 dB (the default)']]);
      const verdict = (chip, db, lo, hi) => {
        const r = rangeOf(chip, db);
        const below = lo < r[0] - 1e-9, above = hi > r[1] + 1e-9;
        return { r, below, above, fits: !below && !above };
      };
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, lo = Math.min(v.lo, v.hi - 0.05), hi = v.hi;
        const lx = 64, rx = 16, pw = st.W - lx - rx, top = 30, rowH = Math.max(40, Math.min(66, (st.H - top - 60) / 4)), X = V => lx + pw * V / 3.3;
        const fitting = DBS.filter(d => verdict(v.chip, d[1], lo, hi).fits);
        const best = fitting.length ? fitting[0][1] : null;
        // the sensor's band behind all rows
        c.fillStyle = C.dark ? 'rgba(80,140,255,.20)' : 'rgba(40,100,230,.12)'; c.fillRect(X(lo), top - 8, Math.max(2, X(hi) - X(lo)), rowH * 4 + 12);
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.strokeRect(X(lo) + 0.5, top - 7.5, Math.max(2, X(hi) - X(lo)), rowH * 4 + 11);
        for (let V = 0; V <= 3.3001; V += 0.5) { const x = Math.round(X(V)) + 0.5; line(c, x, top - 8, x, top + rowH * 4 + 4, C.grid); kit.label(c, fmt(V, 2) + ' V', x, top + rowH * 4 + 16, { size: 10, color: C.muted, align: 'center' }); }
        kit.label(c, 'sensor: ' + fmt(lo, 2) + ' to ' + fmt(hi, 2) + ' V', X(lo) + 4, top - 18, { size: 10.5, color: C.accent });
        DBS.forEach(([name, db], i) => {
          const y = top + i * rowH, vd = verdict(v.chip, db, lo, hi), r = vd.r, sat = satOf(v.chip, db);
          const bh = rowH * 0.46, by = y + rowH * 0.18;
          c.fillStyle = shade(C); c.fillRect(X(0), by, X(3.3) - X(0), bh);
          c.fillStyle = vd.fits ? (C.dark ? 'rgba(34,179,122,.55)' : 'rgba(34,179,122,.50)') : (C.dark ? 'rgba(34,179,122,.30)' : 'rgba(34,179,122,.28)'); c.fillRect(X(r[0]), by, X(r[1]) - X(r[0]), bh);
          // the parts of the sensor range outside the bar
          c.fillStyle = C.bad;
          if (lo < r[0]) c.fillRect(X(lo), by, X(Math.min(hi, r[0])) - X(lo), bh);
          if (hi > r[1]) c.fillRect(X(Math.max(lo, r[1])), by, X(hi) - X(Math.max(lo, r[1])), bh);
          if (best === db) { c.strokeStyle = C.ok; c.lineWidth = 2.4; c.strokeRect(X(r[0]) - 1, by - 2, X(r[1]) - X(r[0]) + 2, bh + 4); }
          kit.label(c, name, lx - 8, by + bh / 2, { size: 12, weight: 650, align: 'right' });
          const counts = Math.round(clamp(Math.min(hi, r[1]) - Math.max(lo, r[0]), 0, 9) / sat * 4096);
          const txt = vd.fits ? (best === db ? 'best fit · ' : 'fits · ') + counts + ' counts' : (vd.above ? 'clips above ' + fmt(r[1], 3) + ' V' : '') + (vd.above && vd.below ? ', ' : '') + (vd.below ? 'blind below ' + fmt(r[0], 3) + ' V' : '');
          kit.label(c, txt, X(r[0]) + 4, by + bh + 11, { size: 10.5, color: vd.fits ? (best === db ? C.ok : C.text2) : C.bad });
        });
        // numbers
        const span = hi - lo;
        if (best != null) {
          const sat = satOf(v.chip, best);
          ro.set('best', DBS.find(d => d[1] === best)[0]);
          ro.set('counts', Math.round(span / sat * 4096) + ' of 4096');
          ro.set('step', fmt(sat / 4096 * 1000, 3) + ' mV');
        } else { ro.set('best', 'none fits'); ro.set('counts', '—'); ro.set('step', '—'); }
        const s11 = satOf(v.chip, 11), r11 = rangeOf(v.chip, 11);
        ro.set('def', verdict(v.chip, 11, lo, hi).fits ? Math.round(span / s11 * 4096) + ' of 4096' : 'the sensor does not fit (' + fmt(r11[0], 3) + ' to ' + fmt(r11[1], 3) + ' V)');
      };
      const loop = kit.loop(draw, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ me-noise */
  Hyper.sim('me-noise', {
    title: 'Noise, averaging, median and oversampling',
    blurb: `A steady input sits at a **true level** between two steps of a 12-bit converter. The top graph shows 120 raw readings (the level plus noise, rounded to whole counts); the middle graph shows 120 results of the filter, each made from the number of readings you choose; the bottom graph compares the two distributions around the true level.

**Try this**
- Set the noise to 2 counts and raise the **readings averaged** from 1 to 64: the scatter of the result falls by the square root, and the read-out agrees with σ / √N.
- Put the noise at **0** and the true level at 2000.4: every reading is 2000, and averaging cannot find the 0.4. Add one count of noise and it can: that is **dither**.
- Switch on **radio bursts** and use the plain average: the spikes smear into the result. Change to the median.
- Count the **bits gained**: 4 readings give one bit, 16 give two, 256 give four.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.86, maxH: 620 });
      let seed = 7;
      const ctl = kit.controls(box.side, [
        { id: 'lvl', label: 'True level', min: 0, max: 1, step: 0.05, value: 0.4, unit: 'of a step above 2000' },
        { id: 'sig', label: 'Noise of one reading', min: 0, max: 6, step: 0.1, value: 2, unit: 'counts rms' },
        { id: 'n', label: 'Readings averaged (N)', min: 1, max: 256, value: 16, log: true, sig: 2 },
        { id: 'flt', type: 'select', label: 'Filter', options: [['Average', 'avg'], ['Median', 'med']], value: 'avg' },
        { id: 'spk', type: 'check', label: 'Radio bursts (3 % of readings jump by +25 counts)', value: false },
        { type: 'buttons', items: [{ id: 'new', label: 'New readings', primary: true }] }
      ], (id) => { if (id === 'new') seed++; loop.once(); });
      const ro = kit.readout(box.side, [['s1', 'Scatter, one reading'], ['sN', 'Scatter of the result'], ['pred', 'Predicted σ / √N'], ['bias', 'Offset of the result'], ['bits', 'Bits gained at best']]);
      const stats = a => { const m = a.reduce((p, q) => p + q, 0) / a.length; return { m, s: Math.sqrt(a.reduce((p, q) => p + (q - m) * (q - m), 0) / a.length) }; };
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, N = Math.max(1, Math.round(v.n)), TRUE = 2000 + v.lvl;
        const r = rng(seed * 101 + 13), M = 120;
        const raws = [], outs = [];
        for (let i = 0; i < M; i++) {
          const grp = [];
          for (let k = 0; k < N; k++) {
            let x = TRUE + v.sig * gauss(r);
            if (v.spk && r() < 0.03) x += 25;
            grp.push(Math.round(x));
          }
          raws.push(grp[0]);
          if (v.flt === 'avg') outs.push(grp.reduce((p, q) => p + q, 0) / N);
          else { grp.sort((p, q) => p - q); outs.push(N % 2 ? grp[(N - 1) / 2] : (grp[N / 2 - 1] + grp[N / 2]) / 2); }
        }
        const s1 = stats(raws), sN = stats(outs), pred = v.sig / Math.sqrt(N);
        const lx = 56, rx = 14, pw = st.W - lx - rx, half = v.spk ? 14 : Math.max(5, v.sig * 3 + 1.5);
        const y0 = 24, h0 = Math.round((st.H - 120) * 0.34), y1 = y0 + h0 + 30, h1 = h0, y2 = y1 + h1 + 30, h2 = st.H - y2 - 24;
        const panel = (y, h, label) => {
          c.fillStyle = shade(C); c.fillRect(lx, y, pw, h);
          const Y = x => y + h / 2 - (x - TRUE) / half * (h / 2);
          for (let k = Math.ceil(TRUE - half); k <= TRUE + half; k++) { const yy = Y(k); if (yy < y || yy > y + h) continue; line(c, lx, yy, lx + pw, yy, (k === 2000 || k === 2001) ? C.axis : C.grid, k === 2000 || k === 2001 ? 1 : 0.6); if ((k - 2000) % Math.max(1, Math.round(half / 3)) === 0) kit.label(c, String(k), lx - 6, yy, { size: 9.5, color: C.muted, align: 'right' }); }
          dash(c, lx, Y(TRUE), lx + pw, Y(TRUE), C.warn, 1.4);
          kit.label(c, label, lx, y - 11, { size: 10.5, color: C.muted });
          return Y;
        };
        const Y0 = panel(y0, h0, 'raw readings (counts)');
        raws.forEach((x, i) => kit.dot(c, lx + 6 + (pw - 12) * i / (M - 1), clamp(Y0(x), y0 + 2, y0 + h0 - 2), 2.2, Math.abs(x - TRUE) > half ? C.bad : kit.hue(210)));
        const Y1 = panel(y1, h1, 'result of the filter (' + (v.flt === 'avg' ? 'average' : 'median') + ' of ' + N + ')');
        c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
        outs.forEach((x, i) => { const px = lx + 6 + (pw - 12) * i / (M - 1), py = clamp(Y1(x), y1 + 1, y1 + h1 - 1); if (i) c.lineTo(px, py); else c.moveTo(px, py); });
        c.stroke();
        outs.forEach((x, i) => kit.dot(c, lx + 6 + (pw - 12) * i / (M - 1), clamp(Y1(x), y1 + 1, y1 + h1 - 1), 2, C.accent));
        kit.label(c, 'dashed: the true level ' + fmt(TRUE, 6), lx + pw, y0 - 11, { size: 10.5, color: C.warn, align: 'right' });
        // the two distributions
        c.fillStyle = shade(C); c.fillRect(lx, y2, pw, h2);
        const bins = 60, hist = (a) => { const hh = new Array(bins).fill(0); a.forEach(x => { const b = Math.floor((x - (TRUE - half)) / (2 * half) * bins); if (b >= 0 && b < bins) hh[b]++; }); return hh; };
        const hr = hist(raws), ho = hist(outs), hm = Math.max(1, ...hr, ...ho);
        const bw = pw / bins;
        for (let b = 0; b < bins; b++) {
          c.fillStyle = C.dark ? 'rgba(120,170,255,.45)' : 'rgba(40,100,230,.35)'; c.fillRect(lx + b * bw, y2 + h2 - h2 * hr[b] / hm, bw - 0.6, h2 * hr[b] / hm);
          c.fillStyle = C.dark ? 'rgba(255,180,60,.65)' : 'rgba(230,130,0,.55)'; c.fillRect(lx + b * bw, y2 + h2 - h2 * ho[b] / hm, bw - 0.6, h2 * ho[b] / hm);
        }
        const xt = lx + pw * (TRUE - (TRUE - half)) / (2 * half);
        dash(c, xt, y2, xt, y2 + h2, C.warn, 1.4);
        kit.label(c, 'distributions: blue raw readings, orange the filter result', lx, y2 - 11, { size: 10.5, color: C.muted });
        ro.set('s1', fmt(s1.s, 3) + ' counts');
        ro.set('sN', fmt(sN.s, 3) + ' counts');
        ro.set('pred', v.flt === 'avg' ? fmt(pred, 3) + ' counts' : 'about ' + fmt(pred * 1.25, 3) + ' counts (a median is a little noisier)');
        ro.set('bias', (sN.m - TRUE >= 0 ? '+' : '') + fmt(sN.m - TRUE, 3) + ' counts' + (v.sig < 0.3 && v.flt === 'avg' ? '  (no noise: no dither)' : ''));
        ro.set('bits', v.sig >= 0.3 ? fmt(Math.log(N) / Math.log(4), 2) + ' bits' : '0: the input is not dithered');
      };
      const loop = kit.loop(draw, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ me-divider */
  Hyper.sim('me-divider', {
    title: 'A divider into the ADC',
    blurb: `Choose the source and the chip; the divider is calculated so that the **top of the source's range** lands at the chosen fraction of the ADC's 11 dB range (standard E24 resistor values are used). The picture shows the circuit, where the pin voltage falls inside the ADC range, and what the same divider would cost a **sleeping battery product**: a 1000 mAh lithium cell, the chip in deep sleep, and the divider draining its current all day.

**Try this**
- Take the **12 V battery** with the default total of 200 kΩ, then lower the total to 5 kΩ: the pin gets stiffer, but the drain grows. Raise it to 10 MΩ: no drain, but the source resistance is far too high without the capacitor.
- Push the fraction above 100 %: the top of the source range goes past the end of the ADC range and turns red.
- Take the **lithium cell** and compare the battery life with and without the divider; then tick the MOSFET switch.
- Choose the **ESP32-C3** and the 12 V battery at 90 %: the range is a little smaller than on the S3, so the divider changes.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 360, maxH: 470 });
      const SRC = [['Lithium cell, 3.0 to 4.2 V', 0, 3.0, 4.2], ['12 V battery, 10.5 to 14.4 V', 1, 10.5, 14.4], ['24 V supply, 20 to 28 V', 2, 20, 28], ['5 V sensor output, 0 to 5 V', 3, 0, 5]];
      const ctl = kit.controls(box.side, [
        { id: 'src', type: 'select', label: 'Source', options: SRC.map(s => [s[0], s[1]]), value: 1 },
        { id: 'chip', type: 'select', label: 'Chip', options: CHIPS.filter(c => c[1] !== 'esp32-s2'), value: 'esp32' },
        { id: 'fill', label: 'Top of the source lands at', min: 50, max: 120, step: 1, value: 90, unit: '% of the ADC range' },
        { id: 'rt', label: 'R1 + R2', min: 5000, max: 1e7, value: 2e5, log: true, sig: 2, fmt: rText },
        { id: 'cap', type: 'check', label: 'Add 100 nF from the pin to ground', value: true },
        { id: 'sw', type: 'check', label: 'Connect the divider only while measuring (MOSFET)', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['parts', 'R1 and R2 (E24)'], ['pin', 'Pin voltage, lowest to highest'], ['span', 'Counts over the source range'], ['res', 'One count, on the source side'], ['drain', 'Divider current at the top'], ['rs', 'Source resistance seen by the ADC'], ['life', 'Cell life in deep sleep']]);
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, sr = SRC[v.src] || SRC[1], vlo = sr[2], vhi = sr[3];
        const r = rangeOf(v.chip, 11), top = r[1], sat = satOf(v.chip, 11);
        const ratio0 = clamp(v.fill / 100 * top / vhi, 0.001, 1), R2i = v.rt * ratio0, R1i = v.rt - R2i;
        const R1 = E.eSeries(R1i, 'E24') || R1i, R2 = E.eSeries(R2i, 'E24') || R2i, ratio = R2 / (R1 + R2);
        const pLo = vlo * ratio, pHi = vhi * ratio, over = pHi > top + 1e-9, under = pLo < r[0] - 1e-9 && pLo > 0;
        const drain = vhi / (R1 + R2), rs = R1 * R2 / (R1 + R2);
        const chip = E.chip(v.chip), sleepMa = chip && chip.sleepUa != null ? chip.sleepUa / 1000 : 0.01;
        const lifeWith = E.batteryLife(1000, sleepMa + (v.sw ? 0 : drain * 1000), { cell: 'lipo-1000' }).years, lifeWithout = E.batteryLife(1000, sleepMa, { cell: 'lipo-1000' }).years;
        // the circuit, scaled to the width
        const f = Math.min(1, (st.W - 16) / 430), X = x => 8 + x * f, rail = 56, drop = 64;
        S.battery(c, X(34), rail, X(34), rail + drop, { label: '' });
        kit.label(c, fmt(vhi, 3) + ' V', X(34), rail - 20, { size: 11, color: C.text2, align: 'center' });
        S.wire(c, [[X(34), rail], [X(100), rail]]);
        S.resistor(c, X(100), rail, X(190), rail, { label: 'R1', value: rText(R1) });
        S.wire(c, [[X(190), rail], [X(260), rail]]);
        S.node(c, X(230), rail);
        S.resistor(c, X(230), rail, X(230), rail + drop, { label: 'R2', value: rText(R2) });
        if (v.cap) { S.wire(c, [[X(260), rail], [X(260), rail + 14]]); S.capacitor(c, X(260), rail + 14, X(260), rail + drop, { label: '' }); kit.label(c, '100 nF', X(268), rail + drop / 2, { size: 10, color: C.muted }); }
        S.wire(c, [[X(260), rail], [X(318), rail]]);
        kit.esym.box(c, X(318), rail - 20, Math.max(56, 86 * f), 40, { label: 'GPIO', sub: 'ADC1', color: over ? C.bad : kit.hue(210) });
        S.wire(c, [[X(34), rail + drop], [X(260), rail + drop]]);
        S.ground(c, X(150), rail + drop);
        kit.label(c, fmt(pHi, 3) + ' V at the top', X(318), rail + 36, { size: 11, color: over ? C.bad : C.ok });
        // where the pin voltage falls in the ADC range
        const by = rail + drop + 62, bx = 64, bw = st.W - bx - 16, VX = V => bx + bw * V / 3.3;
        c.fillStyle = shade(C); c.fillRect(bx, by, bw, 18);
        c.fillStyle = rgba(C, true); c.fillRect(VX(r[0]), by, VX(r[1]) - VX(r[0]), 18);
        c.fillStyle = over || under ? C.bad : C.accent; c.fillRect(VX(Math.min(pLo, 3.3)), by + 3, Math.max(3, VX(Math.min(pHi, 3.3)) - VX(Math.min(pLo, 3.3))), 12);
        for (let V = 0; V <= 3.3001; V += 0.5) kit.label(c, fmt(V, 2), VX(V), by + 30, { size: 9.5, color: C.muted, align: 'center' });
        kit.label(c, 'ADC', bx - 8, by + 9, { size: 11, color: C.text2, align: 'right', weight: 650 });
        kit.label(c, over ? 'the top of the range is past the end of the 11 dB range' : 'inside the 11 dB range of the ' + (chip ? chip.name : 'chip'), bx, by - 10, { size: 10.5, color: over ? C.bad : C.muted });
        // battery life with and without
        const ly = by + 62, lmax = Math.max(lifeWithout, 0.01), lbx = 112, lbw = st.W - lbx - 16;
        kit.label(c, 'life of a 1000 mAh cell, chip in deep sleep', 10, ly - 14, { size: 10.5, color: C.muted });
        [['no divider', lifeWithout, C.ok], [v.sw ? 'switched divider' : 'with the divider', lifeWith, lifeWith < lifeWithout * 0.9 ? C.bad : C.ok]].forEach((row, i) => {
          const yy = ly + i * 24;
          c.fillStyle = shade(C); c.fillRect(lbx, yy, lbw, 16);
          c.fillStyle = row[2]; c.globalAlpha = 0.75; c.fillRect(lbx, yy, lbw * clamp(row[1] / lmax, 0, 1), 16); c.globalAlpha = 1;
          kit.label(c, row[0], lbx - 8, yy + 8, { size: 10.5, color: C.text2, align: 'right' });
          kit.label(c, fmt(row[1], 3) + ' years', lbx + 6, yy + 8, { size: 10.5, color: C.text });
        });
        ro.set('parts', rText(R1) + ' and ' + rText(R2) + '  (ratio ' + fmt(ratio, 3) + ')');
        ro.set('pin', fmt(pLo, 3) + ' to ' + fmt(pHi, 3) + ' V' + (over ? '  (above the range)' : ''));
        const span = (vhi - vlo) * ratio / sat * 4096;
        ro.set('span', fmt(span, 4) + ' of 4096');
        ro.set('res', fmt(sat / 4096 / ratio * 1000, 3) + ' mV');
        ro.set('drain', v.sw ? 'zero while asleep' : fmt(drain * 1e6, 3) + ' µA (the chip sleeps at ' + fmt(sleepMa * 1000, 2) + ' µA)');
        ro.set('rs', rText(rs) + (v.cap ? '  · settles in about ' + tText(5 * rs * 100e-9) : rs > 20e3 ? '  · too high: add 100 nF' : '  · fine'));
        ro.set('life', fmt(lifeWith, 3) + ' years' + (lifeWith < lifeWithout * 0.99 ? ' (instead of ' + fmt(lifeWithout, 3) + ')' : ''));
      };
      const loop = kit.loop(draw, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ me-shunt */
  Hyper.sim('me-shunt', {
    title: 'A shunt, the INA219 and the burden',
    blurb: `The load's current flows through the shunt; the chip measures the small voltage across it. The bar shows that voltage against the **range** of the INA219 (±40, ±80, ±160 or ±320 mV, always 4096 steps) or, in the other mode, against the range of the ESP's own ADC (about 0.1 to 2.45 V, steps of about 0.8 mV).

**Try this**
- Start with 0.3 A, 0.1 Ω and the ±40 mV range: the shunt gives 30 mV, well inside, and the step is about 0.1 mA. Raise the current to 0.5 A: the red bar says the reading is clipped; pick the next range.
- Lower the current to 5 mA: on the ±320 mV range the step (0.8 mA) is 16 % of the reading.
- Switch to the **ESP's ADC**: the same 5 mA gives 0.5 mV, below one count, and at 0.1 Ω nothing below an ampere reads sensibly.
- Raise the current to 3 A and watch the **burden** and the **heat** in the shunt.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 330, maxH: 440 });
      const ctl = kit.controls(box.side, [
        { id: 'sup', type: 'select', label: 'Supply', options: [['3.3 V', 3.3], ['5 V', 5], ['12 V', 12]], value: 5 },
        { id: 'cur', label: 'Load current', min: 0.001, max: 5, value: 0.3, log: true, sig: 2, unit: 'A' },
        { id: 'r', label: 'Shunt resistance', min: 0.01, max: 2, value: 0.1, log: true, sig: 2, unit: 'Ω' },
        { id: 'pga', type: 'select', label: 'INA219 range', options: [['±40 mV  (gain /1)', 1], ['±80 mV  (gain /2)', 2], ['±160 mV  (gain /4)', 4], ['±320 mV  (gain /8)', 8]], value: 1 },
        { id: 'mode', type: 'select', label: 'Measured with', options: [['an INA219', 'ina'], ['the ESP\'s own ADC, no amplifier', 'adc']], value: 'ina' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['vs', 'Voltage across the shunt'], ['read', 'The reading'], ['step', 'One step'], ['err', 'Error of the reading'], ['burden', 'The load loses'], ['heat', 'Heat in the shunt']]);
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, I = v.cur, R = v.r, Vs = I * R;
        const ina = v.mode === 'ina', range = ina ? 0.04 * v.pga : 2.45, step = ina ? range / 4096 : 3.2 / 4096, floor = ina ? 0 : 0.1;
        let Vq = Vs > range ? range : Vs < floor ? 0 : Math.round(Vs / step) * step;
        const Imeas = Vq / R, err = Imeas - I, clipped = Vs > range, dead = Vs < floor && !ina;
        const burden = Vs, heat = I * I * R;
        // the circuit: supply - shunt - load
        const f = Math.min(1, (st.W - 16) / 440), X = x => 8 + x * f, rail = 50, drop = 60;
        S.battery(c, X(30), rail, X(30), rail + drop);
        kit.label(c, fmt(v.sup, 2) + ' V', X(30), rail - 20, { size: 11, color: C.text2, align: 'center' });
        S.wire(c, [[X(30), rail], [X(110), rail]]);
        S.resistor(c, X(110), rail, X(200), rail, { label: 'shunt', value: rText(R) });
        S.wire(c, [[X(200), rail], [X(290), rail]]);
        kit.esym.box(c, X(290), rail - 4, Math.max(70, 110 * f), drop + 8, { label: 'load', sub: fmt(I, 3) + ' A', color: kit.hue(30) });
        S.wire(c, [[X(30), rail + drop], [Math.max(X(290), X(290) + 35 * f), rail + drop]]);
        S.ground(c, X(200), rail + drop);
        kit.esym.box(c, X(120), rail + drop + 20, Math.max(100, 140 * f), 34, { label: ina ? 'INA219' : 'ESP32 ADC', sub: ina ? 'I2C, 0x40' : 'GPIO34', color: clipped || dead ? C.bad : kit.hue(210), active: true });
        line(c, X(122), rail, X(122), rail + drop + 20, C.accent, 1.6); line(c, X(198), rail, X(198), rail + drop + 20, C.accent, 1.6);
        kit.label(c, 'sense', X(205), rail + drop + 12, { size: 10, color: C.accent });
        kit.label(c, 'Vs = ' + fmt(Vs * 1000, 3) + ' mV', X(155), rail - 14, { size: 11, color: C.warn, align: 'center' });
        // the range bar
        const bx = 20, bw = st.W - 40, by = rail + drop + 86, vmax = Math.max(range, Vs) * 1.15, VX = V => bx + bw * V / vmax;
        c.fillStyle = shade(C); c.fillRect(bx, by, bw, 20);
        c.fillStyle = rgba(C, true); c.fillRect(VX(floor), by, VX(range) - VX(floor), 20);
        c.fillStyle = clipped || dead ? C.bad : C.accent; c.fillRect(bx, by + 4, Math.max(2, VX(Vs) - bx), 12);
        dash(c, VX(range), by - 6, VX(range), by + 26, C.ok, 1.6);
        kit.label(c, 'range ends at ' + fmt(range * 1000, 3) + ' mV', Math.min(VX(range), bx + bw - 4), by - 12, { size: 10.5, color: C.ok, align: VX(range) > bx + bw * 0.6 ? 'right' : 'left' });
        kit.label(c, clipped ? 'the shunt voltage is past the range: the reading is clipped' : dead ? 'below 0.1 V the ADC reads zero' : 'the shunt voltage against the range of the chip', bx, by + 36, { size: 10.5, color: clipped || dead ? C.bad : C.muted });
        ro.set('vs', fmt(Vs * 1000, 3) + ' mV');
        ro.set('read', fmt(Imeas * 1000, 4) + ' mA' + (clipped ? '  (clipped)' : dead ? '  (below the dead zone)' : ''));
        ro.set('step', fmt(step / R * 1000, 3) + ' mA  (' + fmt(step * 1e6, 3) + ' µV)');
        ro.set('err', clipped || dead ? 'wrong: ' + fmt(100 * Math.abs(err) / I, 3) + ' %' : (err >= 0 ? '+' : '−') + fmt(100 * Math.abs(err) / I, 2) + ' %');
        ro.set('burden', fmt(burden * 1000, 3) + ' mV  (' + fmt(100 * burden / v.sup, 2) + ' % of the supply)');
        ro.set('heat', fmt(heat * 1000, 3) + ' mW' + (heat > 0.5 ? ' (use a rated shunt)' : ''));
      };
      const loop = kit.loop(draw, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ me-clamp */
  Hyper.sim('me-clamp', {
    title: 'A current sensor at the ADC pin',
    blurb: `The trace is the voltage at the ADC pin over two mains cycles (40 ms). The green band is the 11 dB range of the chosen chip, the dashed line the pin voltage at **zero current**, and the orange dots are what the ADC sees, one every 500 µs, quantised and with a little noise. The read-out gives the RMS current a program would compute from 400 such samples.

For the **ACS712** (a 5 V part) the output is scaled by 2:3 before the pin. For the **clamp** the pin sits at a 1.65 V bias and the burden resistor sets the swing.

**Try this**
- Take the **clamp** with 56 Ω on the original ESP32 and raise the current: at about 20 A the peaks leave the green band and the reading falls short.
- Switch to the **ESP32-S3**: the band is much wider, so the same clamp takes more.
- Choose **direct current**: the Hall sensor shows a steady offset and the clamp shows nothing.
- Pick the **ACS712-30A** and a small current: 0.5 A moves the pin by only about 22 mV, a few dozen counts.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320, maxH: 440 });
      const SENS = { acs5: 0.185, acs20: 0.100, acs30: 0.066 };
      const ctl = kit.controls(box.side, [
        { id: 'sensor', type: 'select', label: 'Sensor', options: [['ACS712-05B, 185 mV/A', 'acs5'], ['ACS712-20A, 100 mV/A', 'acs20'], ['ACS712-30A, 66 mV/A', 'acs30'], ['SCT-013-000 clamp, 100 A : 50 mA', 'ct']], value: 'ct' },
        { id: 'chip', type: 'select', label: 'Chip (11 dB)', options: CHIPS, value: 'esp32' },
        { id: 'wave', type: 'select', label: 'Current', options: [['Alternating, 50 Hz', 'ac'], ['Direct', 'dc']], value: 'ac' },
        { id: 'irms', label: 'Size (RMS, or the DC value)', min: 0.1, max: 40, value: 10, log: true, sig: 2, unit: 'A' },
        { id: 'rb', label: 'Burden resistor (clamp)', min: 10, max: 200, step: 1, value: 56, unit: 'Ω' }
      ], () => { ctl.show('rb', ctl.values.sensor === 'ct'); loop.once(); });
      const ro = kit.readout(box.side, [['peak', 'Pin voltage, lowest to highest'], ['head', 'Room left in the ADC range'], ['res', 'One count is'], ['read', 'RMS read from 400 samples'], ['err', 'Error']]);
      const model = () => {
        const v = ctl.values, ct = v.sensor === 'ct', ac = v.wave === 'ac', r = rangeOf(v.chip, 11), sat = satOf(v.chip, 11), lsb = sat / 4096;
        const zero = ct ? 1.65 : 2.5 * 2 / 3;
        const perA = ct ? v.rb / 2000 : SENS[v.sensor] * 2 / 3;              // volts at the pin per ampere
        const i = t => ac ? Math.SQRT2 * v.irms * Math.sin(2 * Math.PI * 50 * t) : v.irms;
        const pin = t => ct ? (ac ? zero + perA * i(t) : zero) : clamp(2.5 + SENS[v.sensor] * i(t), 0.3, 4.7) * 2 / 3;
        return { v, ct, ac, r, sat, lsb, zero, perA, pin };
      };
      const draw = () => {
        const c = st.begin(), C = kit.colors(), m = model(), v = m.v;
        const lx = 52, rx = 14, pw = st.W - lx - rx, y0 = 24, ph = st.H - y0 - 40, T = 0.04;
        const Y = V => y0 + ph - ph * clamp(V, 0, 3.3) / 3.3, X = t => lx + pw * t / T;
        c.fillStyle = rgba(C, false); c.fillRect(lx, y0, pw, ph);
        c.fillStyle = rgba(C, true); c.fillRect(lx, Y(m.r[1]), pw, Y(m.r[0]) - Y(m.r[1]));
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(lx + 0.5, y0 + 0.5, pw, ph);
        for (let V = 0; V <= 3.3001; V += 0.5) { const yy = Math.round(Y(V)) + 0.5; line(c, lx, yy, lx + pw, yy, C.grid); kit.label(c, fmt(V, 2), lx - 6, yy, { size: 10, color: C.muted, align: 'right' }); }
        for (let t = 0; t <= T + 1e-9; t += 0.01) kit.label(c, Math.round(t * 1000) + ' ms', X(t), y0 + ph + 12, { size: 10, color: C.muted, align: t === 0 ? 'left' : t >= T - 1e-9 ? 'right' : 'center' });
        dash(c, lx, Y(m.zero), lx + pw, Y(m.zero), C.muted, 1.2);
        kit.label(c, 'zero current', lx + 6, Y(m.zero) - 8, { size: 10, color: C.muted });
        kit.label(c, 'ADC range, 11 dB', lx + pw - 6, Y(m.r[1]) + 10, { size: 10, color: C.ok, align: 'right' });
        // the pin voltage; the parts outside the range in red
        let lo = 9, hi = -9;
        c.lineWidth = 2.2; c.strokeStyle = C.accent; c.beginPath();
        const n = Math.max(60, Math.round(pw / 2));
        for (let k = 0; k <= n; k++) { const t = T * k / n, V = m.pin(t); lo = Math.min(lo, V); hi = Math.max(hi, V); const px = X(t), py = Y(V); if (k) c.lineTo(px, py); else c.moveTo(px, py); }
        c.stroke();
        c.strokeStyle = C.bad; c.lineWidth = 3;
        for (let k = 1; k <= n; k++) { const t0 = T * (k - 1) / n, t1 = T * k / n, a = m.pin(t0), b = m.pin(t1); if (a > m.r[1] || b > m.r[1] || a < m.r[0] || b < m.r[0]) { c.beginPath(); c.moveTo(X(t0), Y(a)); c.lineTo(X(t1), Y(b)); c.stroke(); } }
        // what the ADC sees: samples every 500 us
        const r = rng(11), clip = V => clamp(V, m.r[0], m.r[1]);
        for (let k = 0; k * 0.0005 <= T + 1e-9; k++) { const t = k * 0.0005, V = Math.round((clip(m.pin(t)) + m.lsb * 1.5 * gauss(r)) / m.lsb) * m.lsb; kit.dot(c, X(t), Y(V), 2, C.warn); }
        // the program's reading: 400 samples
        const rr = rng(3); let sum = 0, sum2 = 0;
        for (let k = 0; k < 400; k++) { const V = Math.round((clip(m.pin(k * 0.0005)) + m.lsb * 1.5 * gauss(rr)) / m.lsb) * m.lsb; sum += V; sum2 += V * V; }
        const mean = sum / 400, rms = Math.sqrt(Math.max(0, sum2 / 400 - mean * mean));
        const read = m.ac ? rms / m.perA : (m.ct ? 0 : (mean - m.zero) / m.perA);
        const clipped = hi > m.r[1] + 1e-9 || lo < m.r[0] - 1e-9;
        ro.set('peak', fmt(lo, 3) + ' to ' + fmt(hi, 3) + ' V' + (clipped ? '  (outside the range)' : ''));
        ro.set('head', fmt(Math.min(m.r[1] - hi, lo - m.r[0]) * 1000, 3) + ' mV' + (clipped ? '  (clipped)' : ''));
        ro.set('res', fmt(m.lsb / m.perA * 1000, 3) + ' mA at the pin');
        ro.set('read', fmt(read, 3) + ' A' + (m.ct && !m.ac ? '  (a clamp cannot see DC)' : ''));
        ro.set('err', v.irms > 0 ? (read >= v.irms ? '+' : '−') + fmt(100 * Math.abs(read - v.irms) / v.irms, 3) + ' %' : '—');
        c.save(); kit.label(c, (m.ct ? 'clamp, ' + v.rb + ' Ω burden' : 'ACS712 through a 2:3 divider') + ' · ' + fmt(v.irms, 3) + ' A ' + (m.ac ? 'RMS' : 'DC'), lx + 6, y0 + 12, { size: 10.5, color: C.text2 }); c.restore();
      };
      const loop = kit.loop(draw, box.stage);
      st.onResize(() => loop.once());
      ctl.show('rb', true);
      loop.once();
    }
  });

  /* ================================================================ me-power */
  Hyper.sim('me-power', {
    title: 'Real, apparent and reactive power',
    blurb: `The upper graph is the voltage (blue) and the current (orange) of a load over two mains cycles. The lower graph is their product, the **instantaneous power**: green when energy flows to the load, red when it flows back. **Real power** is the *average* of that graph; **apparent power** is the product of the two RMS values; the ratio is the **power factor**.

The four current shapes are idealised: a heater, a motor whose current lags by 45°, a phone charger whose current flows in short pulses near the voltage peaks, and a dimmer that switches on at 90° of each half cycle.

**Try this**
- Take the **heater**: current and voltage are in step, the power is never negative and the power factor is 1.
- Take the **motor**: part of each cycle is red. Apparent power is bigger than the real power by the power factor.
- Take the **charger** and look at the pulses: its power factor is low although its current is small.
- Raise the **delay between the two samples** to a few hundred microseconds and watch the measured power drift away from the true one: the error is worst for loads that already have a low power factor.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 330, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'load', type: 'select', label: 'Load', options: [['Heater (resistive)', 'heater'], ['Induction motor (lagging 45°)', 'motor'], ['Phone charger (rectifier and capacitor)', 'charger'], ['Dimmer (phase cut at 90°)', 'dimmer']], value: 'motor' },
        { id: 'mains', type: 'select', label: 'Mains', options: [['230 V, 50 Hz', 230], ['120 V, 60 Hz', 120]], value: 230 },
        { id: 'irms', label: 'Current (RMS)', min: 0.1, max: 10, value: 1, log: true, sig: 2, unit: 'A' },
        { id: 'skew', label: 'Delay between the voltage sample and the current sample', min: 0, max: 800, step: 10, value: 0, unit: 'µs' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['p', 'Real power P'], ['s', 'Apparent power S = V × I'], ['q', 'Reactive power Q'], ['pf', 'Power factor'], ['day', 'Energy in a day at this load'], ['meas', 'P measured with the delay']]);
      // the shape of the current over a phase θ (before scaling)
      const shape = (kind, th) => {
        const s = Math.sin(th);
        if (kind === 'heater') return s;
        if (kind === 'motor') return Math.sin(th - Math.PI / 4);
        if (kind === 'charger') { const a = Math.abs(s); return a > 0.93 ? Math.sign(s) * Math.pow((a - 0.93) / 0.07, 1.2) : 0; }
        const ph = ((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        return (ph >= Math.PI / 2 && ph <= Math.PI) || (ph >= 1.5 * Math.PI) ? s : 0;
      };
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, f = v.mains === 120 ? 60 : 50, Vr = v.mains, W2 = 2 * Math.PI;
        const M = 720;
        let rms2 = 0;
        for (let k = 0; k < M; k++) rms2 += Math.pow(shape(v.load, W2 * k / M), 2);
        const k0 = v.irms / Math.sqrt(rms2 / M);                                   // scale the shape to the wanted RMS current
        const vt = th => Math.SQRT2 * Vr * Math.sin(th), it = th => k0 * shape(v.load, th);
        let P = 0, Pm = 0; const w = W2 * f * v.skew * 1e-6;
        for (let k = 0; k < M; k++) { const th = W2 * k / M; P += vt(th) * it(th); Pm += vt(th) * it(th + w); }
        P /= M; Pm /= M;
        const S = Vr * v.irms, Q = Math.sqrt(Math.max(0, S * S - P * P)), PF = S > 0 ? P / S : 0;
        // the pictures
        const lx = 48, rx = 14, pw = st.W - lx - rx, y0 = 22, h0 = Math.round((st.H - 80) * 0.5), y1 = y0 + h0 + 36, h1 = st.H - y1 - 26, T = 2 / f;
        const X = t => lx + pw * t / T;
        let ipk = 0, ppk = 0;
        for (let k = 0; k < M; k++) { const th = W2 * k / M; ipk = Math.max(ipk, Math.abs(it(th))); ppk = Math.max(ppk, Math.abs(vt(th) * it(th))); }
        ipk = Math.max(ipk, 1e-9); ppk = Math.max(ppk, 1e-9);
        c.fillStyle = shade(C); c.fillRect(lx, y0, pw, h0); c.fillRect(lx, y1, pw, h1);
        line(c, lx, y0 + h0 / 2, lx + pw, y0 + h0 / 2, C.axis); line(c, lx, y1 + h1 / 2, lx + pw, y1 + h1 / 2, C.axis);
        for (let t = 0; t <= T + 1e-9; t += 0.01) { kit.label(c, Math.round(t * 1000) + ' ms', X(t), y1 + h1 + 12, { size: 10, color: C.muted, align: t === 0 ? 'left' : t >= T - 1e-9 ? 'right' : 'center' }); line(c, X(t), y0, X(t), y0 + h0, C.grid); line(c, X(t), y1, X(t), y1 + h1, C.grid); }
        kit.label(c, 'voltage and current (each to its own scale)', lx, y0 - 10, { size: 10.5, color: C.muted });
        kit.label(c, 'power = voltage × current, instant by instant', lx, y1 - 10, { size: 10.5, color: C.muted });
        const trace = (fn, y, h, amp, color, wd, dsh) => { c.save(); if (dsh) c.setLineDash([4, 3]); c.strokeStyle = color; c.lineWidth = wd; c.beginPath(); const n = Math.round(pw); for (let k = 0; k <= n; k++) { const t = T * k / n, val = fn(W2 * f * t), py = y + h / 2 - (h / 2 - 3) * val / amp; if (k) c.lineTo(lx + k, py); else c.moveTo(lx, py); } c.stroke(); c.restore(); };
        trace(th => vt(th), y0, h0, Math.SQRT2 * Vr, kit.hue(210), 2);
        trace(th => it(th), y0, h0, ipk, kit.hue(30), 2);
        if (v.skew > 0) trace(th => it(th + w), y0, h0, ipk, kit.hue(30), 1.4, true);
        // the instantaneous power, filled
        const Yp = p => y1 + h1 / 2 - (h1 / 2 - 3) * p / ppk, n = Math.round(pw);
        for (let k = 0; k < n; k++) { const t = T * k / n, th = W2 * f * t, p = vt(th) * it(th); c.fillStyle = p >= 0 ? (C.dark ? 'rgba(34,179,122,.55)' : 'rgba(34,179,122,.45)') : (C.dark ? 'rgba(229,72,77,.6)' : 'rgba(229,72,77,.5)'); c.fillRect(lx + k, Math.min(Yp(0), Yp(p)), 1.2, Math.abs(Yp(p) - Yp(0))); }
        dash(c, lx, Yp(P), lx + pw, Yp(P), C.warn, 1.8);
        kit.label(c, 'average = real power ' + fmt(P, 3) + ' W', lx + pw - 6, clamp(Yp(P) - 10, y1 + 8, y1 + h1 - 8), { size: 10.5, color: C.warn, align: 'right', bg: C.bg2 });
        ro.set('p', fmt(P, 4) + ' W');
        ro.set('s', fmt(S, 4) + ' VA');
        ro.set('q', fmt(Q, 4) + ' var');
        ro.set('pf', fmt(PF, 3));
        ro.set('day', fmt(P * 24 / 1000, 3) + ' kWh');
        ro.set('meas', v.skew > 0 ? fmt(Pm, 4) + ' W  (' + (Pm >= P ? '+' : '−') + fmt(100 * Math.abs(Pm - P) / Math.max(1e-9, Math.abs(P)), 2) + ' %)' : 'no delay: equal to P');
      };
      const loop = kit.loop(draw, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ me-loadcell */
  Hyper.sim('me-loadcell', {
    title: 'A load cell, an HX711, a tare and a scale factor',
    blurb: `The chain is a load cell (a few millivolts), the HX711 (a 24-bit number) and the program (grams). Before you calibrate the program sees only counts. **Tare** with the pan empty; put the **known weight** on (move the load to it) and press **Calibrate**; then weigh.

The HX711's reading is proportional to the load as a fraction of the cell's capacity, whatever the supply: the supply only changes the **noise**, which is drawn from the HX711's input noise (about 50 nV rms, a datasheet-type figure) at the chosen gain.

**Try this**
- Tare, set the load to the known weight, calibrate, then change the load: the reading follows. Press **Read again** to see the noise move the last digit.
- Calibrate with the load **not** equal to the known weight: every later reading is off by the same factor.
- Raise the load above 100 % of capacity: the cell is overloaded (and with 3 mV/V at gain 128 the HX711 can clip).
- Change the **supply** from 5 V to 3.3 V, or the **gain** to 64: the noise in grams changes, the counts per gram only with the gain.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 360, maxH: 470 });
      let seed = 5, tare = null, scale = null;
      const ctl = kit.controls(box.side, [
        { id: 'cap', type: 'select', label: 'Cell capacity', options: [['0.5 kg', 500], ['1 kg', 1000], ['5 kg', 5000], ['20 kg', 20000], ['50 kg', 50000]], value: 1000 },
        { id: 'sens', label: 'Rated output', min: 1, max: 3, step: 0.1, value: 2, unit: 'mV/V' },
        { id: 'vex', type: 'select', label: 'Supply of the module', options: [['3.3 V', 3.3], ['5 V', 5]], value: 3.3 },
        { id: 'gain', type: 'select', label: 'HX711 gain', options: [['128', 128], ['64', 64]], value: 128 },
        { id: 'plate', label: 'Pan and its fixtures', min: 0, max: 300, step: 1, value: 120, unit: 'g' },
        { id: 'load', label: 'Load on the pan', min: 0, max: 130, step: 0.5, value: 50, unit: '% of capacity' },
        { id: 'known', type: 'select', label: 'Known weight for the calibration', options: [['100 g', 100], ['200 g', 200], ['500 g', 500], ['1000 g', 1000]], value: 500 },
        { id: 'avg', type: 'select', label: 'Readings averaged', options: [['1', 1], ['4', 4], ['10', 10], ['40', 40]], value: 4 },
        { type: 'buttons', items: [{ id: 'read', label: 'Read again' }, { id: 'tare', label: 'Tare', primary: true }, { id: 'cal', label: 'Calibrate' }, { id: 'forget', label: 'Forget both' }] }
      ], (id) => {
        if (id === 'read') seed++;
        if (id === 'tare') { tare = measure().raw; scale = null; }
        if (id === 'cal') { if (tare != null) { const m = measure(); scale = (m.raw - tare) / ctl.values.known; } }
        if (id === 'forget') { tare = null; scale = null; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['vo', 'Bridge output'], ['counts', 'HX711 reading'], ['used', 'Part of the HX711 range'], ['res', 'Noise, peak to peak'], ['tare', 'Tare (empty scale)'], ['scale', 'Scale factor'], ['out', 'The program shows'], ['err', 'Error']]);
      const measure = () => {
        const v = ctl.values, capG = v.cap, mTot = v.plate + v.load / 100 * capG, S = v.sens / 1000, G = v.gain;
        const Vo = S * v.vex * mTot / capG;                                       // volts
        const ideal = Math.pow(2, 24) * G * S * mTot / capG;                       // counts: independent of the supply
        const sigma = 50e-9 * Math.pow(2, 24) * G / v.vex / Math.sqrt(v.avg);      // counts rms after averaging
        const r = rng(seed * 31 + 7);
        const raw = clamp(Math.round(ideal + sigma * gauss(r)), -8388608, 8388607);
        return { mTot, Vo, ideal, sigma, raw, perG: Math.pow(2, 24) * G * S / capG, clipped: ideal > 8388607 };
      };
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, m = measure(), loadG = v.load / 100 * v.cap;
        const W = st.W;
        // the mechanics: a bar fixed at the left, loaded at the free end
        const bx = 24, by = 112, bw = Math.min(W * 0.5, 280), bh = 18;
        c.fillStyle = C.faint; c.fillRect(bx - 14, by - 14, 14, bh + 28);
        kit.esym.box(c, bx, by, bw, bh, { label: '', color: kit.hue(210), active: true });
        kit.label(c, 'load cell', bx + 8, by + bh / 2, { size: 10.5, color: C.text2 });
        const px = bx + bw - 34, pw2 = 68;
        c.fillStyle = C.surface2 || C.surface; c.strokeStyle = C.axis; c.lineWidth = 1.4; c.fillRect(px, by - 12, pw2, 8); c.strokeRect(px + 0.5, by - 11.5, pw2, 8);
        const mh = clamp(8 + 40 * Math.sqrt(loadG / v.cap), 0, 52), over = v.load > 100;
        c.fillStyle = over ? C.bad : kit.hue(30, 0.8); c.fillRect(px + 14, by - 12 - mh, pw2 - 28, mh);
        kit.label(c, fmt(loadG, 4) + ' g' + (over ? ' · overloaded' : ''), px + pw2 / 2, by - 12 - mh - 9, { size: 10.5, color: over ? C.bad : C.text2, align: 'center' });
        kit.label(c, '+ ' + v.plate + ' g pan', bx + bw + 8, by - 8, { size: 10, color: C.muted });
        // the chain of three boxes
        const cy = by + bh + 40, gap = 22, bw3 = (W - 20 - 2 * gap) / 3;
        const out = tare == null ? (m.raw + ' counts') : scale == null ? ((m.raw - tare) + ' counts, net') : fmt((m.raw - tare) / scale, 5) + ' g';
        const boxes = [['Load cell', fmt(m.Vo * 1000, 3) + ' mV', kit.hue(210)], ['HX711', m.raw + ' counts', m.clipped ? C.bad : kit.hue(150)], ['Program', out, kit.hue(30)]];
        boxes.forEach((b, i) => { const x = 10 + i * (bw3 + gap); kit.esym.box(c, x, cy, bw3, 48, { label: b[0], sub: b[1], color: b[2], active: true, size: 12 }); if (i < 2) kit.arrow(c, x + bw3 + 2, cy + 24, x + bw3 + gap - 2, cy + 24, C.text2, 2); });
        // how much of the HX711's range is used
        const ry = cy + 78, rw = W - 40, used = clamp(Math.abs(m.ideal) / 8388608, 0, 1.2);
        kit.label(c, 'part of the HX711 range (±8 388 608 counts)', 20, ry - 12, { size: 10.5, color: C.muted });
        c.fillStyle = shade(C); c.fillRect(20, ry, rw, 16);
        c.fillStyle = used > 1 ? C.bad : C.accent; c.fillRect(20, ry, Math.min(rw, rw * used), 16);
        kit.label(c, fmt(Math.min(used, 9.99) * 100, 3) + ' %', 26, ry + 8, { size: 10.5, color: C.text });
        // numbers
        const gPer = m.perG, ppG = 6.6 * m.sigma / gPer;
        ro.set('vo', fmt(m.Vo * 1000, 4) + ' mV  (rated ' + fmt(v.sens * v.vex, 3) + ' mV at full load)');
        ro.set('counts', m.raw + (m.clipped ? '  (clipped)' : ''));
        ro.set('used', fmt(used * 100, 3) + ' %');
        ro.set('res', fmt(ppG, 3) + ' g  (' + fmt(6.6 * m.sigma, 3) + ' counts); ' + fmt(gPer, 4) + ' counts per gram');
        ro.set('tare', tare == null ? 'not taken' : tare + ' counts');
        ro.set('scale', scale == null ? 'not set' : fmt(scale, 5) + ' counts per gram  (true: ' + fmt(gPer, 5) + ')');
        ro.set('out', out);
        ro.set('err', tare != null && scale != null ? fmt((m.raw - tare) / scale - loadG, 3) + ' g' : '—');
      };
      const loop = kit.loop(draw, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ me-pulses */
  Hyper.sim('me-pulses', {
    title: 'Counting pulses: interrupt against hardware',
    blurb: `Pulses arrive at the frequency you choose. Every pulse is a falling edge; with **contact bounce** switched on each pulse is followed by five more edges 150 µs apart. An **interrupt** handler counts an edge only if the previous counted edge is far enough back: the handler's own time (latency and run) or the **dead time** you set, whichever is longer. The **pulse counter** counts every edge in hardware.

The strips show the first few pulses: ticks are edges (green counted, red lost because the handler was busy, grey ignored by the dead time); amber is the time the handler holds the CPU. The totals are for one second. The handler time is an assumption of your own; real values depend on the core, the cache and what else the chip is doing.

**Try this**
- Leave the settings and raise the frequency from 225 Hz towards 100 kHz: at some point the interrupt starts to miss pulses and the CPU load climbs; the pulse counter never does.
- Switch **bounce** on at 100 Hz: both methods now count the bounce as pulses. Set a dead time of 5 ms: the interrupt is right again, the pulse counter is not.
- With the dead time at 5 ms, raise the frequency above 200 Hz: the dead time now swallows real pulses.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 340, maxH: 470 });
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Pulse frequency', min: 1, max: 200000, value: 225, log: true, sig: 3, fmt: fText },
        { id: 'L', label: 'Interrupt: latency and handler', min: 2, max: 300, step: 1, value: 10, unit: 'µs' },
        { id: 'D', label: 'Dead time in the handler', min: 0, max: 20, step: 0.5, value: 0, unit: 'ms' },
        { id: 'bounce', type: 'check', label: 'Contact bounce (five extra edges after each pulse)', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['true', 'Real pulses per second'], ['isr', 'Counted by the interrupt'], ['pcnt', 'Counted by the pulse counter'], ['load', 'CPU time spent in the handler'], ['note', 'What happens']]);
      const simulate = v => {
        const f = v.f, Tsim = Math.min(1, 20000 / f), P = Math.max(1, Math.floor(f * Tsim)), B = v.bounce ? 5 : 0, lock = Math.max(v.D * 1e-3, v.L * 1e-6);
        const edges = []; let last = -1, counted = 0;
        for (let k = 0; k < P; k++) {
          const t0 = (k + 0.5) / f, tn = (k + 1.5) / f;
          for (let j = 0; j <= B; j++) {
            const t = t0 + j * 150e-6;
            if (j > 0 && t > tn - 20e-6) break;
            let state;
            if (last < 0 || t - last >= lock - 1e-12) { state = 'counted'; last = t; counted++; }
            else state = t - last < v.D * 1e-3 - 1e-12 ? 'ignored' : 'lost';
            edges.push([t, state]);
          }
        }
        return { P, Tsim, edges, counted, scale: 1 / Tsim, lock };
      };
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, s = simulate(v);
        const total = s.edges.length, perSec = x => x * s.scale;
        const lx = 70, rx = 14, pw = st.W - lx - rx, win = v.f >= 400 ? 5 / v.f : 0.012, t0 = 0.5 / v.f - 0.1 * win, X = t => lx + pw * (t - t0) / win;
        const rows = [['pin', 'edges at the pin'], ['isr', 'interrupt'], ['pcnt', 'pulse counter']], y0 = 34, rh = 54;
        rows.forEach((r, i) => { const y = y0 + i * (rh + 18); c.fillStyle = shade(C); c.fillRect(lx, y, pw, rh); kit.label(c, r[1], lx, y - 9, { size: 10.5, color: C.muted }); });
        // busy bars of the handler (counted edges only)
        s.edges.forEach(([t, state]) => {
          if (t < t0 - 1e-3 || t > t0 + win) return;
          const col = state === 'counted' ? C.ok : state === 'lost' ? C.bad : C.muted, x = Math.round(X(t)) + 0.5;
          const ya = y0, yb = y0 + (rh + 18) * 1, yc = y0 + (rh + 18) * 2;
          line(c, x, ya + 6, x, ya + rh, col, state === 'counted' ? 2 : 1.4);
          if (state === 'counted') {
            c.fillStyle = C.dark ? 'rgba(255,180,60,.55)' : 'rgba(230,130,0,.45)'; c.fillRect(X(t), yb + rh - 24, Math.max(1.5, pw * v.L * 1e-6 / win), 18);
            if (v.D > 0) { c.fillStyle = C.dark ? 'rgba(255,255,255,.10)' : 'rgba(0,0,0,.08)'; c.fillRect(X(t), yb + 6, Math.max(1.5, pw * v.D * 1e-3 / win), 10); }
            line(c, x, yb + 6, x, yb + 16, C.ok, 2);
          }
          line(c, x, yc + 6, x, yc + rh, C.ok, 1.6);
        });
        kit.label(c, 'window: ' + tText(win), 10, y0 + 3 * (rh + 18) - 6, { size: 10, color: C.muted });
        kit.label(c, 'green counted · red lost · grey ignored · amber handler', 10, y0 + 3 * (rh + 18) + 8, { size: 10, color: C.muted });
        const isrN = perSec(s.counted), pcN = perSec(total), trueN = v.f;
        const loadPct = Math.min(100, isrN * v.L * 1e-6 * 100);
        ro.set('true', fmt(trueN, 4) + ' pulses');
        ro.set('isr', fmt(isrN, 4) + '  (' + (isrN >= trueN ? '+' : '−') + fmt(100 * Math.abs(isrN - trueN) / trueN, 3) + ' %)');
        ro.set('pcnt', fmt(pcN, 4) + '  (' + (pcN >= trueN ? '+' : '−') + fmt(100 * Math.abs(pcN - trueN) / trueN, 3) + ' %)');
        ro.set('load', fmt(loadPct, 3) + ' % of one core');
        const lost = isrN < trueN * 0.995, over = isrN > trueN * 1.005;
        ro.set('note', over ? 'the bounce is counted as extra pulses' : lost ? (v.D * 1e-3 > v.L * 1e-6 ? 'the dead time swallows real pulses' : 'the handler cannot keep up: pulses are lost') : 'the interrupt counts every pulse');
      };
      const loop = kit.loop(draw, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ me-frequency */
  const errText = e => e >= 0.001 ? fmt(e * 100, 3) + ' %' : e >= 1e-6 ? fmt(e * 1e6, 3) + ' ppm' : fmt(e * 1e9, 3) + ' ppb';
  Hyper.sim('me-frequency', {
    title: 'Counting in a gate against timing the period',
    blurb: `Both axes are logarithmic. The **blue** line is the worst-case error of counting edges in a gate (one edge too many or too few: 1 / (f × T)); the **orange** line is the error of timing the period with a clock of the chosen tick (f / (f_clk × N)); the **green** line is reciprocal counting, which times whole periods over the gate and keeps the clock's resolution at every frequency. The grey line is the crystal: whatever the method, the answer cannot be better than the clock behind it (taken here as 20 ppm).

**Try this**
- At 1 kHz with a 1 s gate and the 1 µs clock the two methods are equally good (0.1 %): that is the **cross-over**. Move the frequency down: timing wins; up: counting wins.
- Raise the clock to 80 MHz: the cross-over moves up and the orange line drops.
- Lengthen the gate to 10 s: the blue line falls, at the price of a slower answer.
- Raise the **periods timed together**: the orange error shrinks, as does the update rate.
- Look at the green line: with a 1 s gate it stays under the grey crystal line at every frequency, which is why instruments count reciprocally.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 330, maxH: 470 });
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Signal frequency', min: 0.1, max: 1e6, value: 1000, log: true, sig: 3, fmt: fText },
        { id: 'T', label: 'Gate time', min: 0.01, max: 10, value: 1, log: true, sig: 2, fmt: tText },
        { id: 'clk', type: 'select', label: 'Clock for timing', options: [['micros(): 1 MHz', 1e6], ['timer peripheral: 80 MHz', 80e6], ['CPU cycle counter: 240 MHz', 240e6]], value: 1e6 },
        { id: 'N', label: 'Periods timed together', min: 1, max: 1000, value: 1, log: true, sig: 2 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['n', 'Edges in the gate'], ['a', 'Gate count: error at most'], ['b', 'Period timing: error at most'], ['c', 'Reciprocal counting: error at most'], ['best', 'Better of the first two'], ['time', 'Time to an answer'], ['x', 'Cross-over']]);
      const crystal = 20e-6;
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, N = Math.max(1, Math.round(v.N)), f = v.f, T = v.T, clk = v.clk;
        const eA = F => 1 / (F * T), eB = F => F / (clk * N), eC = F => 1 / (clk * Math.max(T, 1 / F));
        const lx = 62, rx = 14, pw = st.W - lx - rx, y0 = 22, ph = st.H - y0 - 76;
        const LX0 = Math.log10(0.1), LX1 = Math.log10(1e6), LY0 = -9, LY1 = 1;
        const X = F => lx + pw * (Math.log10(F) - LX0) / (LX1 - LX0), Y = e => y0 + ph - ph * (clamp(Math.log10(Math.max(e, 1e-12)), LY0, LY1) - LY0) / (LY1 - LY0);
        c.fillStyle = shade(C); c.fillRect(lx, y0, pw, ph);
        for (let d = -1; d <= 6; d++) { const x = Math.round(X(Math.pow(10, d))) + 0.5; line(c, x, y0, x, y0 + ph, C.grid); kit.label(c, fText(Math.pow(10, d)).replace(' ', ''), x, y0 + ph + 12, { size: 9.5, color: C.muted, align: d === -1 ? 'left' : d === 6 ? 'right' : 'center' }); }
        [[1e1, '1000 %'], [1, '100 %'], [1e-2, '1 %'], [1e-4, '100 ppm'], [1e-6, '1 ppm'], [1e-8, '0.01 ppm']].forEach(([e, t]) => { const y = Math.round(Y(e)) + 0.5; line(c, lx, y, lx + pw, y, C.grid); kit.label(c, t, lx - 6, y, { size: 9.5, color: C.muted, align: 'right' }); });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(lx + 0.5, y0 + 0.5, pw, ph);
        const curve = (fn, color, w, dsh) => { c.save(); if (dsh) c.setLineDash(dsh); c.strokeStyle = color; c.lineWidth = w; c.beginPath(); const n = Math.round(pw / 2); for (let k = 0; k <= n; k++) { const F = Math.pow(10, LX0 + (LX1 - LX0) * k / n), px = X(F), py = Y(fn(F)); if (k) c.lineTo(px, py); else c.moveTo(px, py); } c.stroke(); c.restore(); };
        curve(() => crystal, C.faint, 1.6, [6, 4]);
        curve(eA, kit.hue(210), 2.2); curve(eB, kit.hue(30), 2.2); curve(eC, C.ok, 3, [2, 3]);
        const fx = Math.sqrt(clk * N / T);
        if (fx > 0.1 && fx < 1e6) { c.strokeStyle = C.text2; c.lineWidth = 1.4; c.beginPath(); c.arc(X(fx), Y(eA(fx)), 5, 0, 2 * Math.PI); c.stroke(); }
        const xf = X(f);
        dash(c, xf, y0, xf, y0 + ph, C.warn, 1.4);
        [[eA, kit.hue(210)], [eB, kit.hue(30)], [eC, C.ok]].forEach(([fn, col]) => kit.dot(c, xf, Y(fn(f)), 4, col, C.text));
        kit.label(c, 'blue: count in the gate', 10, y0 + ph + 30, { size: 10.5, color: kit.hue(210) });
        kit.label(c, 'orange: time the period', st.W / 2, y0 + ph + 30, { size: 10.5, color: kit.hue(30) });
        kit.label(c, 'green: reciprocal counting', 10, y0 + ph + 45, { size: 10.5, color: C.ok });
        kit.label(c, 'grey: crystal, ±20 ppm', st.W / 2, y0 + ph + 45, { size: 10.5, color: C.muted });
        kit.label(c, 'frequency (log scale)', st.W - 14, y0 + ph + 60, { size: 10.5, color: C.text2, align: 'right' });
        const a = eA(f), b = eB(f), cc = eC(f);
        ro.set('n', fmt(f * T, 4) + (f * T < 1 ? '  (less than one: the gate is too short)' : ''));
        ro.set('a', errText(a));
        ro.set('b', errText(b));
        ro.set('c', errText(cc) + (cc < crystal ? '  (the crystal now limits)' : ''));
        ro.set('best', a < b ? 'counting in the gate' : 'timing the period');
        ro.set('time', 'gate ' + tText(T) + '  ·  period timing ' + tText(N / f));
        ro.set('x', fText(fx));
      };
      const loop = kit.loop(draw, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ me-loop */
  Hyper.sim('me-loop', {
    title: 'A 4–20 mA loop (or a 0–10 V signal) into the ADC',
    blurb: `A pressure transmitter spans 0 to 10 bar. In the **loop** mode it sets the current between 4 and 20 mA and the shunt turns it into a voltage; in the **0–10 V** mode a divider of 33 kΩ and 10 kΩ scales the signal. The bar at the bottom is the 11 dB range of the chosen chip: the green part is where the converter reads well.

The faults are the ones that happen: a **broken wire** (0 mA is below the live zero: a fault, not a zero), a transmitter that goes **over range** (21.5 mA), and a **24 V** fault that reaches the input (the shunt comes unsoldered, or the 0–10 V cable touches a 24 V line). The 1 kΩ and the clamp at the pin decide whether the chip survives it.

**Try this**
- In the loop mode choose the original **ESP32** and set the shunt to 150 Ω: at 20 mA the pin reaches 3.0 V, above its 2.45 V range. Go back to 100 Ω.
- Choose the **ESP32-S3**: 150 Ω now fits and the steps are finer.
- Switch on each fault and read the diagnosis. Then switch the protection off and apply the **24 V** fault.
- Look at **0–10 V** mode with the same faults: a broken cable reads 0 V, which looks like a real zero.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 370, maxH: 500 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Signal', options: [['4–20 mA loop', 'ma'], ['0–10 V', 'v']], value: 'ma' },
        { id: 'chip', type: 'select', label: 'Chip (11 dB)', options: CHIPS.filter(c => c[1] !== 'esp32-s2'), value: 'esp32' },
        { id: 'rsh', label: 'Shunt resistor (loop)', min: 50, max: 300, step: 10, value: 100, unit: 'Ω' },
        { id: 'pv', label: 'Process value', min: 0, max: 100, step: 1, value: 50, unit: '% of the span' },
        { id: 'fault', type: 'select', label: 'Fault', options: [['None', 'none'], ['Wire broken', 'open'], ['Source over range', 'over'], ['24 V reaches the input', 'hv']], value: 'none' },
        { id: 'clamp', type: 'check', label: 'Series 1 kΩ and a clamp at the pin', value: true }
      ], () => { ctl.show('rsh', ctl.values.mode === 'ma'); loop.once(); });
      const ro = kit.readout(box.side, [['src', 'The signal'], ['pin', 'Voltage at the pin'], ['fs', 'Full scale at the pin'], ['span', 'Counts over the span'], ['reads', 'The program reads'], ['diag', 'Diagnosis']]);
      const RATIO = 10 / 43;                                      // 33 kΩ and 10 kΩ
      const model = () => {
        const v = ctl.values, ma = v.mode === 'ma', r = rangeOf(v.chip, 11), sat = satOf(v.chip, 11), frac = v.pv / 100;
        let src = ma ? 4 + 16 * frac : 10 * frac;
        if (v.fault === 'open') src = 0; else if (v.fault === 'over') src = ma ? 21.5 : 11;
        let pin = ma ? src * v.rsh / 1000 : src * RATIO;
        if (v.fault === 'hv') pin = ma ? 24 : 24 * RATIO;
        const destroyed = pin > 3.6 && !v.clamp, shown = v.clamp ? Math.min(pin, 3.6) : pin, seen = Math.min(shown, sat);
        const fs = ma ? 0.020 * v.rsh : 10 * RATIO, rd = ma ? seen / v.rsh * 1000 : seen / RATIO;
        return { v, ma, r, sat, src, pin, shown, seen, destroyed, fs, rd };
      };
      const draw = () => {
        const c = st.begin(), C = kit.colors(), m = model(), v = m.v, ma = m.ma;
        const f = Math.min(1, (st.W - 16) / 450), X = x => 8 + x * f, rail = 50, drop = 62;
        // the source
        if (ma) S.battery(c, X(26), rail, X(26), rail + drop); else S.vsource(c, X(26), rail, X(26), rail + drop);
        kit.label(c, ma ? '24 V' : '0–10 V', X(26), rail - 20, { size: 11, color: C.text2, align: 'center' });
        S.wire(c, [[X(26), rail], [X(66), rail]], { color: v.fault === 'open' ? C.bad : undefined });
        if (v.fault === 'open') kit.label(c, 'break', X(46), rail - 10, { size: 10, color: C.bad, align: 'center' });
        if (ma) kit.esym.box(c, X(66), rail - 16, Math.max(70, 84 * f), 32, { label: 'transmitter', sub: '4–20 mA', color: kit.hue(30), active: true, size: 11 });
        else S.resistor(c, X(66), rail, X(140), rail, { label: 'R1', value: '33 kΩ' });
        S.wire(c, [[ma ? X(66) + Math.max(70, 84 * f) : X(140), rail], [X(190), rail]]);
        S.node(c, X(190), rail);
        if (ma) S.resistor(c, X(190), rail, X(190), rail + drop, { label: 'shunt', value: v.rsh + ' Ω' }); else S.resistor(c, X(190), rail, X(190), rail + drop, { label: 'R2', value: '10 kΩ' });
        S.wire(c, [[X(26), rail + drop], [X(190), rail + drop]]);
        S.ground(c, X(110), rail + drop);
        // the path to the pin: 1 kΩ, a capacitor and a clamp
        if (v.clamp) S.resistor(c, X(190), rail, X(262), rail, { label: '1 kΩ', value: '' }); else S.wire(c, [[X(190), rail], [X(262), rail]]);
        S.wire(c, [[X(262), rail], [X(380), rail]]);
        if (v.clamp) {
          S.node(c, X(300), rail);
          S.diode(c, X(300), rail, X(300), rail + drop, { kind: 'zener' });
          S.wire(c, [[X(190), rail + drop], [X(300), rail + drop]]);
          kit.label(c, '3.3 V clamp', X(306), rail + drop / 2, { size: 10, color: C.muted });
        }
        kit.esym.box(c, X(380), rail - 20, Math.max(56, 66 * f), 40, { label: 'GPIO', sub: 'ADC1', color: m.destroyed ? C.bad : kit.hue(210), active: true });
        kit.label(c, fmt(m.shown, 3) + ' V', X(380) + Math.max(56, 66 * f) / 2, rail - 30, { size: 11, color: m.destroyed ? C.bad : m.shown > m.r[1] ? C.warn : C.ok, align: 'center' });
        // the pin voltage against the ADC range
        const by = rail + drop + 70, bx = 54, bw = st.W - bx - 18, VX = V => bx + bw * clamp(V, 0, 3.3) / 3.3;
        c.fillStyle = shade(C); c.fillRect(bx, by, bw, 20);
        c.fillStyle = rgba(C, true); c.fillRect(VX(m.r[0]), by, VX(m.r[1]) - VX(m.r[0]), 20);
        kit.label(c, 'ADC', bx - 8, by + 10, { size: 11, color: C.text2, align: 'right', weight: 650 });
        for (let V = 0; V <= 3.3001; V += 0.5) kit.label(c, fmt(V, 2), VX(V), by + 32, { size: 9.5, color: C.muted, align: 'center' });
        // the span of the signal (4 to 20 mA, or 0 to 10 V) and the present value
        const sLo = ma ? 0.004 * v.rsh : 0, sHi = m.fs;
        c.fillStyle = C.dark ? 'rgba(80,140,255,.35)' : 'rgba(40,100,230,.25)'; c.fillRect(VX(sLo), by + 4, Math.max(2, VX(Math.min(sHi, 3.3)) - VX(sLo)), 12);
        const px = VX(m.shown);
        kit.dot(c, px, by + 10, 6, m.destroyed ? C.bad : m.shown > m.r[1] ? C.warn : C.accent, C.text);
        if (m.pin > 3.3) kit.label(c, m.shown > 3.3 ? '→' : '', bx + bw - 10, by - 10, { size: 11, color: C.bad, align: 'right' });
        kit.label(c, 'blue band: the signal from its minimum to full scale', bx, by - 12, { size: 10.5, color: C.muted });
        const msg = m.destroyed ? 'the pin sees ' + fmt(m.pin, 3) + ' V: the input is destroyed' : (v.fault === 'hv' ? 'the clamp holds the pin near 3.6 V: it survives' : m.fs > m.r[1] ? 'full scale ' + fmt(m.fs, 3) + ' V: above the range, the top is lost' : 'full scale (' + fmt(m.fs, 3) + ' V) fits the range of this chip');
        kit.label(c, msg, bx, by + 52, { size: 11, color: m.destroyed ? C.bad : (v.fault === 'hv' || m.fs > m.r[1]) ? C.warn : C.ok, weight: 600 });
        // numbers
        ro.set('src', ma ? fmt(m.src, 4) + ' mA' : fmt(m.src, 4) + ' V');
        ro.set('pin', m.destroyed ? fmt(m.pin, 3) + ' V (destroyed)' : fmt(m.shown, 3) + ' V');
        ro.set('fs', fmt(m.fs, 3) + ' V' + (m.fs > m.r[1] ? '  (above the range)' : ''));
        const span = (ma ? 16 * v.rsh / 1000 : 10 * RATIO) / m.sat * 4096;
        ro.set('span', fmt(span, 4) + ' of 4096');
        ro.set('reads', m.destroyed ? '—' : ma ? fmt(m.rd, 4) + ' mA = ' + fmt(clamp((m.rd - 4) / 16 * 10, -9, 99), 3) + ' bar' : fmt(m.rd, 4) + ' V = ' + fmt(m.rd, 3) + ' bar');
        let diag;
        if (m.destroyed) diag = 'the chip is damaged: add the series resistor and the clamp';
        else if (ma) diag = m.rd < 3.6 ? 'wire broken or transmitter dead (below 3.6 mA)' : m.rd > 21 ? 'over range (above 21 mA)' : m.fs > m.r[1] && v.pv > 90 ? 'valid, but the converter runs out of range near the top' : 'valid reading';
        else diag = m.rd < 0.05 ? 'zero volts: a real zero or a broken cable, no way to tell' : m.rd > 10.2 ? 'above 10 V: over range' : 'valid reading';
        ro.set('diag', diag);
      };
      const loop = kit.loop(draw, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
