/* HYPER-ESP32 · sims/passive-components.js
 *
 * The simulations of the topic "passive-components" (every id starts with pc-):
 *
 *   pc-led-resistor   an LED, a resistor and a pin: the current against the resistor, and the spread between LEDs
 *   pc-decoupling     the supply at the chip pin during a radio burst or logic switching, with and without capacitors
 *   pc-divider        a voltage divider into the ADC: the window of the ADC, the current, the source resistance
 *   pc-rc-filter      an RC low-pass: smoothing a noisy analogue input, and debouncing a button
 *   pc-pot            a potentiometer into the ADC: taper, series resistor and the dead zones of the ADC
 *   pc-ntc            an NTC thermistor (or an LDR) in a divider: the voltage against temperature (or light)
 *   pc-crystal        the error of the slow clock against temperature: internal RC, 32 kHz crystal, compensated RTC
 *   pc-ferrite        a supply filter with a bead or an inductor: attenuation against frequency, resonance, DC drop
 *   pc-protect        a fault voltage on an input: series resistor, the pin's own diodes and an external clamp
 *   pc-breadboard     which holes of a breadboard are joined, and the classic mistakes
 */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const fin = (x, d) => (Number.isFinite(x) ? x : d);
  const logspace = (a, b, n) => Array.from({ length: n + 1 }, (_, k) => a * Math.pow(b / a, k / n));

  /* ================================================================ pc-led-resistor */
  const LEDS = {
    red: { name: 'Red (about 2.0 V)', vf: 2.0, hue: 5 },
    green: { name: 'Green (about 2.2 V)', vf: 2.2, hue: 140 },
    blue: { name: 'Blue (about 3.0 V)', vf: 3.0, hue: 225 },
    white: { name: 'White (about 3.0 V)', vf: 3.0, hue: 55 }
  };
  const NVT = 2 * 0.02585;                        // an LED: ideality factor 2 at room temperature
  /* the current through a resistor and an LED whose forward voltage is vf5 at 5 mA, from a supply vcc (bisection) */
  function ledCurrent(vcc, vf5, R) {
    const is = 5e-3 / Math.exp(vf5 / NVT);
    let lo = 0, hi = Math.max(vcc / Math.max(R, 1e-3), 1e-9);
    for (let k = 0; k < 90; k++) {
      const I = (lo + hi) / 2, vd = NVT * Math.log(I / is + 1);
      if (vd + I * R > vcc) hi = I; else lo = I;
    }
    return (lo + hi) / 2;
  }

  Hyper.sim('pc-led-resistor', {
    title: 'An LED, a resistor and a pin',
    blurb: `A pin gives 3.3 V; the LED keeps about 2 – 3 V for itself; the resistor takes the rest and so sets the current. The bar shows the current against what is sensible for a pin, and the graph shows how the same resistor treats three LEDs whose forward voltages differ by 0.15 V.

**Try this**
- Pick **Red** and move the resistor from 100 Ω to 1 kΩ: the current falls from about 13 mA to 1.3 mA, and the LED is still lit.
- Pick **Blue** or **White** with the same resistor: only 0.3 V is left for the resistor, so the current is tiny or huge depending on the LED. Watch the three lines in the graph spread out.
- Switch **Round to the nearest E12 value** off and on to see what a real resistor does to the calculated current.
- Make the resistor very small: the current goes beyond what a pin should give. The pin does not protect the LED; the resistor does.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym, SC = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250, maxH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'led', type: 'select', label: 'LED colour', options: Object.keys(LEDS).map(k => [LEDS[k].name, k]), value: 'red' },
        { id: 'r', label: 'Series resistor', min: 10, max: 10000, value: 330, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'e12', type: 'check', label: 'Round to the nearest E12 value', value: true },
        { id: 'dv', label: 'This LED differs from typical by', min: -0.2, max: 0.2, step: 0.05, value: 0, unit: 'V' }
      ], () => update());
      const ro = kit.readout(box.side, [['i', 'LED current'], ['vr', 'Across the resistor'], ['p', 'Heat in the resistor'], ['spread', 'Current if the LED is ±0.15 V off'], ['verdict', 'Verdict']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'series resistor (Ω)', log: true }, y: { label: 'LED current (mA)', min: 0 } }, 190);
      const VCC = 3.3;
      let s = null;

      function solve() {
        const v = ctl.values, led = LEDS[v.led] || LEDS.red;
        const R = v.e12 ? E.eSeries(v.r, 'E12') : v.r;
        const vf = led.vf + v.dv;
        const I = ledCurrent(VCC, vf, R);
        const lo = ledCurrent(VCC, led.vf + v.dv - 0.15, R), hi = ledCurrent(VCC, led.vf + v.dv + 0.15, R);
        s = { led, R, I, vf, lo: Math.min(lo, hi), hi: Math.max(lo, hi), vr: I * R, p: I * I * R };
      }
      function update() {
        solve();
        const mA = s.I * 1000;
        ro.set('i', kit.fmt(mA, 3) + ' mA');
        ro.set('vr', kit.fmt(s.vr, 3) + ' V (the LED keeps ' + kit.fmt(VCC - s.vr, 3) + ' V)');
        ro.set('p', kit.fmt(s.p * 1000, 3) + ' mW');
        ro.set('spread', kit.fmt(s.lo * 1000, 3) + ' – ' + kit.fmt(s.hi * 1000, 3) + ' mA');
        ro.set('verdict', mA < 0.3 ? 'Barely visible' : mA < 1 ? 'Dim' : mA <= 10 ? 'Good: bright and gentle on the pin' : mA <= 20 ? 'Bright; near the limit of a pin' : 'Too much for a pin: raise the resistor');
        const led = s.led, base = led.vf + ctl.values.dv;
        const series = [[-0.15, 'LED 0.15 V lower', true], [0, 'this LED', false], [0.15, 'LED 0.15 V higher', true]].map(([d, label, dash]) => ({
          label, dash, pts: logspace(10, 10000, 80).map(R => [R, ledCurrent(VCC, base + d, R) * 1000])
        }));
        plot.set({
          x: { label: 'series resistor (Ω)', log: true, min: 10, max: 10000 },
          y: { label: 'LED current (mA)', min: 0, max: 30 },
          series,
          hlines: [{ y: 20, label: 'about the most a pin should give' }],
          marks: [{ x: s.R, y: Math.min(30, mA) }]
        });
        loop.once();
      }
      const loop = kit.loop(() => {
        if (!s) solve();
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const mA = s.I * 1000, glow = clamp(Math.sqrt(mA / 10), 0, 1);
        // the circuit: pin, resistor, LED, ground
        const y0 = H * 0.3, x0 = Math.max(70, W * 0.17);
        S.box(c, x0 - 56, y0 - 24, 112, 48, { label: 'ESP32 pin', sub: 'high: 3.3 V', color: kit.hue(8) });
        S.wire(c, [[x0 + 56, y0], [x0 + 100, y0]], { color: C.accent });
        SC.resistor(c, x0 + 100, y0, x0 + 176, y0, { label: 'R', value: kit.eng(s.R, 'Ω') });
        S.wire(c, [[x0 + 176, y0], [x0 + 222, y0]], { color: C.accent });
        S.led(c, x0 + 238, y0, { color: s.led.hue, on: glow, r: 12 });
        S.wire(c, [[x0 + 252, y0], [x0 + 290, y0], [x0 + 290, y0 + 20]]);
        SC.ground(c, x0 + 290, y0 + 20);
        kit.label(c, kit.fmt(s.vr, 3) + ' V', x0 + 138, y0 - 20, { size: 11, color: C.text2, align: 'center' });
        kit.label(c, kit.fmt(VCC - s.vr, 3) + ' V', x0 + 238, y0 - 28, { size: 11, color: C.text2, align: 'center' });
        // the current against what a pin can give: dim, good, bright, too much
        const gx = 16, gw = W - 32, gy = H * 0.66, gh = 16, MAXMA = 25, X = m => gx + clamp(m / MAXMA, 0, 1) * gw;
        const zones = [[0, 1, C.faint], [1, 10, C.ok], [10, 20, C.warn], [20, MAXMA, C.bad]];
        c.save();
        for (const [a, b, colr] of zones) { c.globalAlpha = 0.35; c.fillStyle = colr; c.fillRect(X(a), gy, X(b) - X(a), gh); }
        c.globalAlpha = 1; c.restore();
        for (const m of [0, 10, 20]) kit.label(c, m + (m === 20 ? ' mA' : ''), X(m), gy + gh + 11, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'dim', X(0.5), gy - 8, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'good', X(5.5), gy - 8, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'bright', X(15), gy - 8, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'too much', X(22.5), gy - 8, { size: 10, color: C.muted, align: 'center' });
        const mx = X(mA);
        c.fillStyle = C.text; c.beginPath(); c.moveTo(mx, gy - 2); c.lineTo(mx - 6, gy - 11); c.lineTo(mx + 6, gy - 11); c.closePath(); c.fill();
        kit.label(c, kit.fmt(mA, 3) + ' mA', clamp(mx, 34, W - 34), gy - 26, { size: 12, weight: 700, align: 'center' });
        kit.label(c, 'current against what a pin can sensibly give', gx, H - 12, { size: 10.5, color: C.faint });
      }, box.stage);
      st.onResize(() => loop.once());
      update();
    }
  });

  /* ================================================================ pc-decoupling */
  Hyper.sim('pc-decoupling', {
    title: 'Why the capacitors sit next to the chip',
    blurb: `The supply (3.3 V behind a cable and a regulator) reaches the chip's pin through some resistance and inductance. A **bulk capacitor** and a **100 nF ceramic** are the chip's own local reservoirs. The graph is the voltage **at the pin**, solved from the circuit with the wiring inductance included.

**Try this**
- In *Radio burst* mode switch the **bulk capacitor** off: the rail sags the moment the burst starts, and the thicker the cable (higher resistance) the lower it goes.
- Fit it again and raise it from 1 µF to 100 µF: the first dip shrinks.
- Change to *Logic switching*. The bulk capacitor is now too slow to matter: only the **100 nF** helps. Move it from 2 mm to 50 mm away and watch it lose its power, because its wire has inductance (the chip's own few nanofarads then do the work alone).
- Compare with the floor of the chip's supply range, from the catalogue.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.2, minH: 90, maxH: 130 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'What the chip does', options: [['Radio burst: 340 mA for 100 µs', 'burst'], ['Logic switching: 200 mA spikes, a few ns wide', 'logic']], value: 'burst' },
        { id: 'rs', label: 'Cable and regulator resistance', min: 0.05, max: 3, value: 0.5, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'bulk', type: 'check', label: 'Fit a bulk capacitor', value: true },
        { id: 'cb', label: 'Bulk capacitor', min: 1, max: 470, value: 22, log: true, sig: 2, fmt: v => kit.eng(v * 1e-6, 'F') },
        { id: 'dec', type: 'check', label: 'Fit a 100 nF ceramic', value: true },
        { id: 'dist', label: '100 nF: distance from the pin', min: 1, max: 50, step: 1, value: 3, unit: 'mm' }
      ], () => update());
      const ro = kit.readout(box.side, [['vmin', 'Lowest voltage at the pin'], ['dip', 'Dip below 3.3 V'], ['verdict', 'Verdict'], ['q', 'Charge in one burst']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'time (µs)' }, y: { label: 'voltage at the pin (V)' } }, 240);
      const chip = E.chip('esp32-s3') || {};
      const floor = chip.vdd ? chip.vdd[0] : 3.0, IB = (chip.txMa || 340) / 1000, I0 = 0.03;
      let res = null;

      // the circuit, from the supply to the pin; -> { t[], v[], vmin }
      function simulate(q) {
        const burst = q.mode === 'burst';
        const c = new kit.Circuit();
        const i0 = burst ? I0 : 0.02;
        const J = [0, 7, -3, 11, 2, -5, 9, -1, 4];            // the spikes do not come at an exact rhythm
        c.V('src', 'gnd', 3.3);
        c.R('src', 'a', q.rs);
        c.L('a', 'pin', 0.5e-6, i0);                       // regulator and wiring: half a microhenry
        const vdc = 3.3 - i0 * q.rs;
        if (q.bulk) {                                       // bulk capacitor: a few centimetres away, ESR 30 mΩ
          c.L('pin', 'b1', 15e-9, 0); c.R('b1', 'b2', 0.05); c.C('b2', 'gnd', q.cb * 1e-6, vdc);
        }
        if (q.dec) {                                        // 100 nF: half a nanohenry of its own plus about 0.7 nH per millimetre of wire
          c.L('pin', 'd1', (0.5 + 0.7 * q.dist) * 1e-9, 0); c.R('d1', 'd2', 0.05); c.C('d2', 'gnd', 100e-9, vdc);
        }
        c.R('pin', 'od', 0.2); c.C('od', 'gnd', 4e-9, vdc);   // the chip's own capacitance: about 4 nF behind 0.2 Ω
        const T = burst ? 300e-6 : 750e-9, dt = burst ? 0.1e-6 : 0.25e-9;
        const spike = ph => (ph >= 0 && ph < 3e-9 ? ph / 3e-9 : ph >= 3e-9 && ph < 8e-9 ? 1 - (ph - 3e-9) / 5e-9 : 0);
        const load = burst
          ? t => i0 + (IB - i0) * clamp((t - 20e-6) / 1e-6, 0, 1) * (1 - clamp((t - 120e-6) / 1e-6, 0, 1))
          : t => { const k = Math.floor(t / 25e-9); let a = 0; for (let j = Math.max(0, k - 1); j <= k; j++) a = Math.max(a, spike(t - (j * 25e-9 + J[j % J.length] * 1e-9))); return i0 + 0.2 * a; };
        c.I('pin', 'gnd', load);
        c.reset();
        const n = Math.round(T / dt), every = Math.max(1, Math.round(n / 300)), out = { t: [], v: [], vmin: 9, vmax: 0 };
        for (let k = 0; k <= n; k++) {
          const v = fin(c.v('pin'), 3.3);
          if (k > 5 && v < out.vmin) out.vmin = v;
          if (k > 5 && v > out.vmax) out.vmax = v;
          if (k % every === 0) { out.t.push(c.t * (burst ? 1e6 : 1e9)); out.v.push(v); }
          c.step(dt);
        }
        return out;
      }
      function update() {
        const v = ctl.values, burst = v.mode === 'burst';
        res = simulate({ mode: v.mode, rs: v.rs, bulk: v.bulk, cb: v.cb, dec: v.dec, dist: v.dist });
        const vmin = Math.min(res.vmin, 3.3), dip = Math.max(0, 3.3 - vmin);
        ro.set('vmin', kit.fmt(vmin, 4) + ' V');
        ro.set('dip', Math.round(dip * 1000) + ' mV');
        ro.set('verdict', vmin < floor ? 'Below the ' + floor + ' V floor of the chip' : dip > 0.15 ? 'Inside the range, but with little margin' : 'Healthy');
        ro.set('q', burst ? kit.eng((IB - I0) * 100e-6, 'C') + ' above the idle current' : 'about 0.8 nC per spike');
        plot.set({
          x: { label: burst ? 'time (µs)' : 'time (ns)', min: 0, max: res.t[res.t.length - 1] },
          y: { label: 'voltage at the pin (V)', min: Math.min(2.4, Math.floor(vmin * 10) / 10 - 0.1), max: Math.max(3.4, Math.ceil(res.vmax * 10) / 10 + 0.1) },
          series: [{ pts: res.t.map((t, k) => [t, res.v[k]]), label: 'pin voltage' }],
          hlines: [{ y: floor, label: 'supply floor ' + floor + ' V' }]
        });
        ctl.show('dist', v.dec);
        ctl.show('cb', v.bulk);
        loop.once();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, v = ctl.values;
        // a block diagram: supply, the pin with its two reservoirs
        const bw = Math.max(70, Math.min(110, (W - 40) / 4.4)), by = 4, bh = Math.max(34, H * 0.5), gap = (W - 12 - 4 * bw) / 3;
        const xs = [6, 6 + bw + gap, 6 + 2 * (bw + gap)], items = [
          { label: 'supply', sub: kit.eng(v.rs, 'Ω') + ' + wire', color: kit.hue(30) },
          { label: v.bulk ? kit.eng(v.cb * 1e-6, 'F') : 'no bulk', sub: 'bulk', color: v.bulk ? kit.hue(150) : C.faint, dash: !v.bulk },
          { label: v.dec ? '100 nF' : 'no 100 nF', sub: v.dec ? v.dist + ' mm away' : 'ceramic', color: v.dec ? kit.hue(212) : C.faint, dash: !v.dec }
        ];
        items.forEach((it, i) => S.box(c, xs[i], by, bw, bh, { label: it.label, sub: it.sub, color: it.color, dash: it.dash, size: 11.5 }));
        const cx = W - bw - 6, ry = by + bh + 14;
        S.box(c, cx, by, bw, bh, { label: 'chip pin', sub: 'ESP32-S3', color: kit.hue(280), active: true, size: 11.5 });
        S.wire(c, [[xs[0] + bw / 2, ry], [cx + bw / 2, ry]], { color: C.text });
        for (const x of [xs[0], xs[1], xs[2], cx]) S.wire(c, [[x + bw / 2, by + bh], [x + bw / 2, ry]], { color: C.text });
        kit.label(c, 'all four meet at the supply pin of the chip', 6, H - 6, { size: 10, color: C.faint });
      }, box.stage);
      st.onResize(() => loop.once());
      update();
    }
  });

  /* ================================================================ pc-divider */
  const ADC_CHIPS = ['esp32', 'esp32-s3', 'esp32-c3', 'esp32-c6'];
  Hyper.sim('pc-divider', {
    title: 'A divider in front of the ADC',
    blurb: `Two resistors scale a voltage so that it fits inside the ADC's window. The bar shows the window of the chosen chip at the highest attenuation (from the catalogue): above it the reading stops rising, and above 3.6 V the pin is in danger. The graph shows the pin voltage for every input voltage.

**Try this**
- Start with the **lithium cell** and the two 100 kΩ resistors: the pin sees half of 4.2 V, well inside the window.
- Raise the **input** to 12 V (a car battery's neighbourhood): the pin goes past the top of the window, and the reading saturates — "recovered input" no longer follows.
- Make both resistors 10 kΩ and read the **current**: the divider alone now uses about twenty times what the chip needs asleep.
- Make both 1 MΩ: the current is tiny, but the **source resistance** is high — the verdict asks for a capacitor.
- Compare the **chips**: the ESP32-C6's window is wider than the ESP32's.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym, SC = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 280, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: ADC_CHIPS.filter(id => E.chip(id)).map(id => [E.chip(id).name, id]), value: 'esp32' },
        { id: 'vin', label: 'Input voltage', min: 0, max: 15, step: 0.1, value: 4.2, unit: 'V' },
        { id: 'r1', label: 'R1 (upper)', min: 1e3, max: 2e6, value: 100e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'r2', label: 'R2 (lower)', min: 1e3, max: 2e6, value: 100e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'cap', type: 'check', label: '100 nF at the pin', value: true }
      ], () => update());
      const ro = kit.readout(box.side, [['vout', 'Voltage at the pin'], ['adc', 'The ADC reads'], ['rec', 'Recovered input (reading × ratio)'], ['i', 'Divider current'], ['rth', 'Source resistance'], ['verdict', 'Verdict']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'input voltage (V)' }, y: { label: 'pin voltage (V)' } }, 190);
      let s = null;

      function solve() {
        const v = ctl.values, chip = E.chip(v.chip) || E.chip('esp32');
        const rng = (E.ADC_RANGE[chip.id] || E.ADC_RANGE.esp32)['11'] || [0.1, 2.45];
        const ratio = v.r2 / (v.r1 + v.r2), vout = v.vin * ratio;
        const reads = clamp(vout, 0, rng[1]), rec = ratio > 0 ? reads / ratio : 0;
        const i = v.vin / (v.r1 + v.r2), rth = v.r1 * v.r2 / (v.r1 + v.r2);
        s = { chip, rng, ratio, vout, reads, rec, i, rth, sleep: chip.sleepUa || 10 };
      }
      function update() {
        solve();
        const v = ctl.values;
        ro.set('vout', kit.fmt(s.vout, 3) + ' V');
        ro.set('adc', s.vout > s.rng[1] ? 'stuck at the top: ' + kit.fmt(s.rng[1], 3) + ' V' : s.vout < s.rng[0] && s.rng[0] > 0.05 ? 'zero: below ' + kit.fmt(s.rng[0], 3) + ' V' : kit.fmt(s.reads, 3) + ' V');
        ro.set('rec', kit.fmt(s.rec, 3) + ' V' + (s.vout > s.rng[1] ? '  (too low: clipped)' : ''));
        ro.set('i', kit.eng(s.i, 'A') + '  (' + kit.fmt(s.i * 1e6 / s.sleep, 2) + ' × the ' + s.sleep + ' µA of deep sleep)');
        ro.set('rth', kit.eng(s.rth, 'Ω'));
        ro.set('verdict', s.vout > 3.6 ? 'Danger: more than 3.6 V on the pin' : s.vout > s.rng[1] ? 'Reading clipped: scale the input down more' : s.rth > 200e3 ? 'Source resistance very high: expect sag and noise' : s.rth > 20e3 && !v.cap ? 'Add 100 nF at the pin' : s.vout > 0.92 * s.rng[1] ? 'Inside the window, but close to the top' : 'Good');
        const pts = [[0, 0], [15, 15 * s.ratio]];
        plot.set({
          x: { label: 'input voltage (V)', min: 0, max: 15 },
          y: { label: 'pin voltage (V)', min: 0, max: Math.max(4, Math.min(8, 15 * s.ratio * 1.05)) },
          series: [{ pts, label: 'pin voltage' }],
          hlines: [{ y: s.rng[1], label: 'top of the ADC window' }, { y: 3.6, label: 'absolute maximum 3.6 V' }],
          marks: [{ x: v.vin, y: s.vout }]
        });
        loop.once();
      }
      const loop = kit.loop(() => {
        if (!s) solve();
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, v = ctl.values;
        // the circuit
        const xb = 40, xm = Math.max(120, W * 0.4), top = H * 0.12, bot = H * 0.62, mid = (top + bot) / 2, xp = xm + 100;
        SC.wire(c, [[xb, mid - 22], [xb, top], [xm, top], [xm, top + 24]]);
        SC.battery(c, xb, mid - 22, xb, mid + 22, { label: 'Vin', value: kit.fmt(v.vin, 3) + ' V' });
        SC.wire(c, [[xb, mid + 22], [xb, bot], [xm, bot]]);
        SC.resistor(c, xm, top + 24, xm, mid - 4, { label: 'R1', value: kit.eng(v.r1, 'Ω') });
        SC.resistor(c, xm, mid + 4, xm, bot - 24, { label: 'R2', value: kit.eng(v.r2, 'Ω') });
        SC.wire(c, [[xm, mid - 4], [xm, mid + 4]]); SC.wire(c, [[xm, bot - 24], [xm, bot]]);
        SC.ground(c, xm, bot);
        SC.wire(c, [[xm, mid], [xp, mid]]); SC.node(c, xm, mid);
        if (v.cap) { SC.wire(c, [[xp - 22, mid], [xp - 22, mid + 18]]); SC.capacitor(c, xp - 22, mid + 18, xp - 22, mid + 44, { value: '100 nF' }); SC.wire(c, [[xp - 22, mid + 44], [xp - 22, bot]]); SC.wire(c, [[xm, bot], [xp - 22, bot]]); SC.node(c, xp - 22, mid); }
        S.box(c, xp, mid - 20, Math.min(110, W - xp - 8), 40, { label: 'ADC pin', sub: s.chip.name, color: kit.hue(280), active: true, size: 11.5 });
        kit.label(c, kit.fmt(s.vout, 3) + ' V', xm + 8, mid - 10, { size: 12, weight: 700, color: s.vout > 3.6 ? C.bad : s.vout > s.rng[1] ? C.warn : C.ok });
        // the window of the ADC: a bar from 0 to 4 V
        const gx = 16, gw = W - 32, gy = H * 0.82, gh = 16, VMAX = 4, X = q => gx + clamp(q / VMAX, 0, 1) * gw;
        c.save();
        c.globalAlpha = 0.35; c.fillStyle = C.ok; c.fillRect(X(s.rng[0]), gy, X(s.rng[1]) - X(s.rng[0]), gh);
        c.fillStyle = C.faint; c.fillRect(X(0), gy, X(s.rng[0]) - X(0), gh); c.fillRect(X(s.rng[1]), gy, X(3.6) - X(s.rng[1]), gh);
        c.fillStyle = C.bad; c.fillRect(X(3.6), gy, X(VMAX) - X(3.6), gh);
        c.restore();
        for (const q of [0, 1, 2, 3, 4]) kit.label(c, q + ' V', X(q), gy + gh + 11, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'ADC window', (X(s.rng[0]) + X(s.rng[1])) / 2, gy - 8, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'danger', (X(3.6) + X(VMAX)) / 2, gy - 8, { size: 10, color: C.bad, align: 'center' });
        const mx = X(s.vout);
        c.fillStyle = C.text; c.beginPath(); c.moveTo(mx, gy - 1); c.lineTo(mx - 6, gy - 10); c.lineTo(mx + 6, gy - 10); c.closePath(); c.fill();
      }, box.stage);
      st.onResize(() => loop.once());
      update();
    }
  });

  /* ================================================================ pc-rc-filter */
  Hyper.sim('pc-rc-filter', {
    title: 'An RC filter: smoothing and debouncing',
    blurb: `One resistor and one capacitor, two uses. **Smoothing:** a slow wanted signal (grey) is buried in 50 Hz hum and noise; the filtered signal (blue) is what the ADC would see. **Debouncing:** the button's contacts bounce for a few milliseconds; the RC turns that into a slow, single change, and a Schmitt-trigger gate turns it into one clean edge. The traces come from solving the circuit.

**Try this**
- In *smoothing*, raise **C** from 100 nF to 10 µF: the hum disappears, and so does the speed of the wanted signal if its frequency is above the cutoff.
- Raise the **wanted signal frequency** to 20 Hz with the filter at 1.6 Hz: the filter removes the thing you wanted.
- In *debouncing*, set **C** to 100 nF (τ = 1 ms): the node follows the bounce and the pin counts several edges. Set 1 µF (τ = 10 ms): the node stays low until the real release.
- Leave the **Schmitt gate** off: the slow edge crosses the single threshold with a little noise on it, and the pin chatters. Switch it on: one clean edge. Raise C and see the delay grow.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym, SC = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 400, maxH: 560 });
      let mode = params && params.mode === 'debounce' ? 'debounce' : 'filter', seed = 7;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Use', options: [['Smoothing a noisy analogue input', 'filter'], ['Debouncing a button', 'debounce']], value: mode },
        { id: 'r', label: 'R', min: 100, max: 1e6, value: 10e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'c', label: 'C', min: 10e-9, max: 100e-6, value: mode === 'filter' ? 4.7e-6 : 1e-6, log: true, sig: 2, fmt: v => kit.eng(v, 'F') },
        { id: 'f', label: 'Wanted signal frequency', min: 0.2, max: 20, value: 1, log: true, sig: 2, unit: 'Hz' },
        { id: 'bounce', label: 'Contact bounce lasts', min: 1, max: 15, step: 0.5, value: 5, unit: 'ms' },
        { id: 'schmitt', type: 'check', label: 'Schmitt-trigger gate after the RC', value: false },
        { id: 'noise', type: 'check', label: 'A little noise on the node (±40 mV)', value: true },
        { type: 'buttons', items: [{ id: 'again', label: 'Press again (new bounce)', primary: true }] }
      ], (id) => {
        if (id === 'mode') { mode = ctl.values.mode; ctl.set('c', mode === 'filter' ? 4.7e-6 : 1e-6); }
        if (id === 'again') seed++;
        update();
      });
      const ro = kit.readout(box.side, [['tau', 'Time constant τ = RC'], ['fc', 'Cutoff 1/(2πRC)']]);
      const roF = kit.readout(box.side, [['hum', '50 Hz hum left'], ['sig', 'Wanted signal passed'], ['lag', 'Delay of the wanted signal']]);
      const roD = kit.readout(box.side, [['raw', 'Edges on the contact'], ['pin', 'Edges the pin counts'], ['late', 'Press seen after']]);
      let data = null;
      const VCC = 3.3, VT = [1.1, 2.0];                       // the Schmitt gate's typical thresholds on 3.3 V
      const rng = n => { let s = n * 2654435761 >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
      const count = pts => { let n = 0; for (let k = 1; k < pts.length; k++) if (pts[k][1] !== pts[k - 1][1]) n++; return n; };

      function simulate() {
        const v = ctl.values, tau = v.r * v.c, fc = 1 / (2 * Math.PI * tau);
        if (mode === 'filter') {
          const rnd = rng(3), N = 4000, dt = 0.5e-3, f = v.f;
          const noise = []; for (let k = 0; k <= N + 1; k++) noise.push((rnd() - 0.5) * 0.12);
          const vin = t => 1.65 + 0.5 * Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * 50 * t) + noise[Math.floor(t / dt)];
          const c = new kit.Circuit();
          c.V('in', 'gnd', vin); c.R('in', 'out', v.r); c.C('out', 'gnd', v.c, 1.65);
          c.reset();
          const a = [], b = [];
          for (let k = 0; k < N; k++) { c.step(dt); if (c.t >= 1) { a.push([c.t - 1, vin(c.t)]); b.push([c.t - 1, fin(c.v('out'), 1.65)]); } }
          const gain = fq => 1 / Math.sqrt(1 + Math.pow(fq / fc, 2));
          return { tau, fc, a, b, hum: gain(50), sig: gain(f), lag: Math.atan(f / fc) / (2 * Math.PI * f) };
        }
        // debouncing: the node of a pull-up, a capacitor and a button; the contact bounces
        const edges = E.proto.bounce([[0.008, 0.040]], { bounceMs: v.bounce, seed });
        const T = 0.06, dt = 20e-6, c = new kit.Circuit();
        c.V('vcc', 'gnd', VCC); c.R('vcc', 'n', v.r); c.C('n', 'gnd', v.c, VCC);
        const sw = c.SW('n', 'gnd', false);
        c.reset();
        const node = [], one = [], two = [], rnd = rng(11);
        let hy = 1;
        for (let k = 0; k < Math.round(T / dt); k++) {
          sw.closed = E.proto.levelAt(edges, c.t) === 0;
          c.step(dt);
          const vn = fin(c.v('n'), VCC), vp = vn + (v.noise ? (rnd() - 0.5) * 0.08 : 0);
          node.push([c.t, vn]);
          one.push([c.t, vp > VCC / 2 ? 1 : 0]);
          if (hy === 1 && vp < VT[0]) hy = 0; else if (hy === 0 && vp > VT[1]) hy = 1;
          two.push([c.t, hy]);
        }
        const dig = pts => { const out = []; let last = null; for (const p of pts) if (p[1] !== last) { out.push(p); last = p[1]; } return out; };
        return { tau, fc, edges, node, one: dig(one), two: dig(two), nRaw: edges.length - 1, nOne: count(one), nTwo: count(two) };
      }
      function update() {
        data = simulate();
        ctl.show('f', mode === 'filter');
        ctl.show('bounce', mode === 'debounce');
        ctl.show('schmitt', mode === 'debounce');
        ctl.show('noise', mode === 'debounce');
        ctl.show('again', mode === 'debounce');
        ro.set('tau', kit.eng(data.tau, 's'));
        ro.set('fc', kit.eng(data.fc, 'Hz'));
        roF.show(mode === 'filter');
        roD.show(mode === 'debounce');
        if (mode === 'filter') {
          roF.set('hum', kit.fmt(data.hum * 100, 3) + ' %  (' + kit.fmt(20 * Math.log10(Math.max(data.hum, 1e-6)), 3) + ' dB)');
          roF.set('sig', kit.fmt(data.sig * 100, 3) + ' %');
          roF.set('lag', kit.fmt(data.lag * 1000, 3) + ' ms');
        } else {
          const th = ctl.values.schmitt;
          roD.set('raw', data.nRaw + ' (one press and one release is 2)');
          roD.set('pin', (th ? data.nTwo : data.nOne) + (th ? '  (Schmitt gate)' : '  (one threshold at 1.65 V)'));
          const seen = (th ? data.two : data.one).find(p => p[1] === 0);
          roD.set('late', seen ? kit.fmt((seen[0] - 0.008) * 1000, 3) + ' ms after the first touch' : 'never');
        }
        loop.once();
      }
      const loop = kit.loop(() => {
        if (!data) data = simulate();
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, v = ctl.values;
        // the circuit, small, across the top
        if (mode === 'filter') {
          const y = 34;
          kit.label(c, 'signal + hum + noise', 8, y - 22, { size: 10.5, color: C.muted });
          SC.resistor(c, 24, y, 112, y, { label: 'R', value: kit.eng(v.r, 'Ω') });
          SC.wire(c, [[112, y], [170, y]]); SC.node(c, 170, y);
          SC.capacitor(c, 170, y, 170, y + 36, { label: 'C', value: kit.eng(v.c, 'F') });
          SC.ground(c, 170, y + 36);
          SC.wire(c, [[170, y], [236, y]]);
          kit.label(c, 'to the ADC pin', 242, y, { size: 11, color: C.muted });
        } else {
          SC.rail(c, 56, 8, '3.3 V');
          SC.resistor(c, 56, 8, 56, 52, { label: 'R', value: kit.eng(v.r, 'Ω') });
          SC.wire(c, [[56, 52], [210, 52]]); SC.node(c, 56, 52);
          SC.capacitor(c, 112, 52, 112, 82, { label: 'C', value: kit.eng(v.c, 'F') }); SC.node(c, 112, 52);
          SC.switch(c, 164, 52, 164, 82, { closed: E.proto.levelAt(data.edges, 0.008) === 0 }); SC.node(c, 164, 52);
          SC.wire(c, [[112, 82], [164, 82]]); SC.ground(c, 138, 82);
          kit.label(c, v.schmitt ? 'Schmitt gate → pin' : 'to the pin', 216, 52, { size: 11, color: C.muted });
        }
        const px = 70, pw = W - px - 14, top = 108;
        if (mode === 'filter') {
          const ph = H - top - 40, lo = 0.8, hi = 2.5;
          S.analog(c, px, top, pw, ph, data.a, { t0: 0, t1: 1, min: lo, max: hi, color: C.faint, label: 'volts', width: 1.2 });
          S.analog(c, px, top, pw, ph, data.b, { t0: 0, t1: 1, min: lo, max: hi, color: C.accent, width: 2.4 });
          kit.label(c, 'before the filter (grey) and after it (blue): one second', px, top + ph + 14, { size: 10.5, color: C.muted });
          kit.label(c, hi.toFixed(1) + ' V', px - 6, top + 4, { size: 10, color: C.faint, align: 'right' });
          kit.label(c, lo.toFixed(1) + ' V', px - 6, top + ph - 4, { size: 10, color: C.faint, align: 'right' });
        } else {
          const rows = 3, gap = 22, rh = Math.max(34, (H - top - 30 - gap * (rows - 1)) / rows), t1 = 0.06;
          const y0 = top, y1 = top + rh + gap, y2 = top + 2 * (rh + gap);
          S.wave(c, px, y0, pw, rh, data.edges, { t0: 0, t1, label: 'contact', color: C.text2 });
          const an = S.analog(c, px, y1, pw, rh, data.node, { t0: 0, t1, min: 0, max: VCC, color: C.accent, label: 'RC node', width: 2.2 });
          void an;
          c.save(); c.setLineDash([4, 4]); c.lineWidth = 1; c.strokeStyle = C.warn;
          const ty = q => y1 + rh - q / VCC * rh;
          const th = v.schmitt ? VT : [VCC / 2];
          for (const q of th) { c.beginPath(); c.moveTo(px, ty(q)); c.lineTo(px + pw, ty(q)); c.stroke(); }
          c.restore();
          kit.label(c, v.schmitt ? 'thresholds 1.1 V and 2.0 V' : 'threshold 1.65 V', px + pw, y1 - 6, { size: 10, color: C.warn, align: 'right' });
          S.wave(c, px, y2, pw, rh, v.schmitt ? data.two : data.one, { t0: 0, t1, label: 'pin reads', color: C.ok, fill: true });
          kit.label(c, 'one press (at 8 ms) and one release (at 40 ms); 60 ms in all', px, y2 + rh + 14, { size: 10.5, color: C.muted });
        }
      }, box.stage);
      st.onResize(() => loop.once());
      update();
    }
  });

  /* ================================================================ pc-pot */
  Hyper.sim('pc-pot', {
    title: 'A potentiometer into the ADC',
    blurb: `The pot is a divider whose tap you turn. The graph shows what the **ADC reads** (0 – 4095) against the turn of the knob; the straight dashed line is what you hoped for. The ADC window of the chosen chip, at the highest attenuation, comes from the catalogue.

**Try this**
- Choose the **ESP32** with the pot straight across 3.3 V: the top quarter of the turn reads the same, and so does a sliver at the bottom. These are the ADC's dead zones.
- Add the **4.7 kΩ resistor** above the pot: the top of the turn comes inside the window; only a small dead zone is left at the bottom.
- Choose a **logarithmic (A) taper**: half the turn gives only about a tenth of the range.
- Compare the **ESP32-C6**: its window reaches 3.3 V, so the pot needs no help.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym, SC = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250, maxH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: ADC_CHIPS.filter(id => E.chip(id)).map(id => [E.chip(id).name, id]), value: 'esp32' },
        { id: 'taper', type: 'select', label: 'Taper', options: [['Linear (B)', 'lin'], ['Logarithmic (A, audio)', 'log']], value: 'lin' },
        { id: 'rt', type: 'select', label: 'Resistor between 3.3 V and the pot', options: [['None', 0], ['2.2 kΩ', 2200], ['4.7 kΩ', 4700], ['10 kΩ', 10000]], value: 0 },
        { id: 'pos', label: 'Knob position', min: 0, max: 100, step: 1, value: 50, unit: '%' }
      ], () => update());
      const ro = kit.readout(box.side, [['vw', 'Voltage at the wiper'], ['adc', 'The ADC reads'], ['top', 'Travel lost at the top'], ['bot', 'Travel lost at the bottom'], ['i', 'Current through the track']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'knob position (%)' }, y: { label: 'ADC reading (0 – 4095)' } }, 200);
      const RP = 10e3, VCC = 3.3;
      const frac = (x, taper) => taper === 'log' ? (Math.exp(4 * x) - 1) / (Math.exp(4) - 1) : x;     // the part of the track below the wiper
      const volts = (x, q) => VCC * frac(x, q.taper) * RP / (q.rt + RP);
      const reading = (V, rg) => Math.round(4095 * clamp((V - rg[0]) / (rg[1] - rg[0]), 0, 1));
      let s = null;
      function solve() {
        const v = ctl.values, chip = E.chip(v.chip) || E.chip('esp32');
        const rg = (E.ADC_RANGE[chip.id] || E.ADC_RANGE.esp32)['11'] || [0.1, 2.45];
        const q = { taper: v.taper, rt: Number(v.rt) || 0 }, x = v.pos / 100;
        let first = null, lastZero = null;
        const pts = [];
        for (let k = 0; k <= 200; k++) {
          const xx = k / 200, V = volts(xx, q), r = reading(V, rg);
          pts.push([xx * 100, r]);
          if (first == null && r >= 4095) first = xx;
          if (r <= 0) lastZero = xx;
        }
        s = { chip, rg, q, x, pts, V: volts(x, q), top: first == null ? 0 : 1 - first, bot: lastZero == null ? 0 : lastZero };
      }
      function update() {
        solve();
        ro.set('vw', kit.fmt(s.V, 3) + ' V');
        const r = reading(s.V, s.rg);
        ro.set('adc', r + (r >= 4095 ? '  (the top: stuck)' : r <= 0 && s.rg[0] > 0.02 ? '  (zero: below ' + kit.fmt(s.rg[0], 2) + ' V)' : ''));
        ro.set('top', Math.round(s.top * 100) + ' % of the turn');
        ro.set('bot', Math.round(s.bot * 100) + ' % of the turn');
        ro.set('i', kit.eng(VCC / (s.q.rt + RP), 'A'));
        plot.set({
          x: { label: 'knob position (%)', min: 0, max: 100 },
          y: { label: 'ADC reading (0 – 4095)', min: 0, max: 4200 },
          series: [{ pts: [[0, 0], [100, 4095]], label: 'what you hoped for', dash: true }, { pts: s.pts, label: 'what the ADC reads' }],
          marks: [{ x: ctl.values.pos, y: r }]
        });
        loop.once();
      }
      const loop = kit.loop(() => {
        if (!s) solve();
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const xp = Math.max(190, W * 0.5), y1 = 8, ytop = s.q.rt > 0 ? 62 : 24, ytrk = H - 30;
        SC.rail(c, xp, y1, '3.3 V');
        if (s.q.rt > 0) { SC.resistor(c, xp, y1, xp, 62, { label: 'R', value: kit.eng(s.q.rt, 'Ω') }); SC.node(c, xp, 62); }
        SC.wire(c, [[xp, s.q.rt > 0 ? 62 : y1], [xp, ytop + 6]]);
        const p1 = ytop + 6, p2 = Math.max(p1 + 70, ytrk - 8);
        SC.pot(c, xp, p1, xp, p2, { label: 'pot', value: '10 kΩ', wiper: 1 - frac(s.x, s.q.taper) });
        SC.wire(c, [[xp, p2], [xp, H - 6]]);
        SC.ground(c, xp, H - 6);
        const wy = (p1 + p2) / 2 + ((1 - frac(s.x, s.q.taper)) - 0.5) * 36;
        SC.wire(c, [[xp - 22, wy], [xp - 56, wy]]);
        S.box(c, 8, wy - 20, xp - 64, 40, { label: 'ADC pin', sub: s.chip.name, color: kit.hue(280), active: true, size: 11.5 });
        kit.label(c, kit.fmt(s.V, 3) + ' V', xp - 28, wy - 22, { size: 11.5, weight: 700, align: 'center', color: s.V > s.rg[1] ? C.warn : C.ok });
        S.pot(c, W - 52, H * 0.5, 26, s.x, { label: 'knob' });
      }, box.stage);
      st.onResize(() => loop.once());
      update();
    }
  });

  /* ================================================================ pc-ntc */
  Hyper.sim('pc-ntc', {
    title: 'A thermistor or an LDR in a divider',
    blurb: `A sensor whose resistance changes, in series with a fixed resistor: the middle of the pair is a voltage that follows the world. The graph shows that voltage against temperature (or light) with the ADC's window drawn in; outside the window the reading stops following.

**Try this**
- With the **NTC**, leave the fixed resistor equal to the thermistor's 10 kΩ and read **sensitivity** near 25 °C: about 36 mV per kelvin.
- Pick the **ESP32**: its window ends near 2.45 V, and with the NTC to ground the cold end flattens out. Swap the **position** so that the NTC is on top and watch the problem move to the hot end.
- Change the fixed resistor to 1 kΩ: the curve shifts hot, and the sensitivity at room temperature collapses.
- Switch to the **LDR**: the same divider turns light into a voltage on a logarithmic scale. The dashed lines are two other LDRs of the same type, with half and twice the resistance.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym, SC = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 150, maxH: 210 });
      let mode = params && params.mode === 'ldr' ? 'ldr' : 'ntc';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Sensor', options: [['NTC thermistor, 10 kΩ', 'ntc'], ['Light-dependent resistor (LDR)', 'ldr']], value: mode },
        { id: 'chip', type: 'select', label: 'Chip (ADC window)', options: ADC_CHIPS.filter(id => E.chip(id)).map(id => [E.chip(id).name, id]), value: 'esp32' },
        { id: 'rf', label: 'Fixed resistor', min: 1e3, max: 1e5, value: 10e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'low', type: 'select', label: 'Position of the sensor', options: [['Sensor to ground', 'low'], ['Sensor to 3.3 V', 'high']], value: 'low' },
        { id: 'beta', label: 'Beta of the NTC', min: 3000, max: 4300, step: 10, value: 3950, unit: 'K' },
        { id: 'temp', label: 'Temperature', min: -30, max: 110, step: 1, value: 25, unit: '°C' },
        { id: 'lux', label: 'Light', min: 0.1, max: 10000, value: 100, log: true, sig: 2, unit: 'lux' }
      ], () => update());
      const ro = kit.readout(box.side, [['rs', 'Sensor resistance'], ['v', 'Voltage at the pin'], ['sens', 'Sensitivity here'], ['range', 'Range inside the ADC window'], ['heat', 'Self-heating']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'temperature (°C)' }, y: { label: 'voltage at the pin (V)' } }, 230);
      const VCC = 3.3, GAMMA = 0.8, R10 = 10e3;
      const rsens = (x, q) => q.mode === 'ntc' ? E.ntcR(x, 10e3, q.beta) : R10 * q.k * Math.pow(10 / x, GAMMA);
      const vpin = (x, q) => { const rs = rsens(x, q); return q.low === 'low' ? VCC * rs / (rs + q.rf) : VCC * q.rf / (rs + q.rf); };
      let s = null;
      function update() {
        const v = ctl.values;
        mode = v.mode;
        const chip = E.chip(v.chip) || E.chip('esp32');
        const rg = (E.ADC_RANGE[chip.id] || E.ADC_RANGE.esp32)['11'] || [0.1, 2.45];
        const q = { mode, beta: v.beta, rf: v.rf, low: v.low, k: 1 };
        const x = mode === 'ntc' ? v.temp : v.lux;
        const xs = mode === 'ntc' ? Array.from({ length: 141 }, (_, k) => -30 + k) : logspace(0.1, 10000, 120);
        const curve = k => xs.map(t => [t, vpin(t, Object.assign({}, q, { k }))]);
        const V = vpin(x, q), rs = rsens(x, q);
        const dx = mode === 'ntc' ? 0.5 : x * 0.05;
        const slope = mode === 'ntc' ? (vpin(x + dx, q) - vpin(x - dx, q)) / (2 * dx) * 1000 : (vpin(x + dx, q) - vpin(x - dx, q)) / (Math.log10(x + dx) - Math.log10(x - dx));
        const inside = xs.filter(t => { const w = vpin(t, q); return w > rg[0] + 0.02 && w < rg[1] - 0.02; });
        const vs = V, rsn = fin(rs, 1e9), pheat = q.low === 'low' ? Math.pow(vs, 2) / rsn : Math.pow(VCC - vs, 2) / rsn;
        s = { rg, V, rs: rsn };
        ro.set('rs', kit.eng(rsn, 'Ω'));
        ro.set('v', kit.fmt(V, 3) + ' V' + (V > rg[1] ? '  (above the ADC window)' : V < rg[0] && rg[0] > 0.02 ? '  (below it)' : ''));
        ro.set('sens', mode === 'ntc' ? kit.fmt(slope, 3) + ' mV per kelvin' : kit.fmt(slope, 3) + ' V per decade of light');
        ro.set('range', inside.length ? (mode === 'ntc' ? kit.fmt(inside[0], 3) + ' °C to ' + kit.fmt(inside[inside.length - 1], 3) + ' °C' : kit.fmt(inside[0], 2) + ' to ' + kit.fmt(inside[inside.length - 1], 3) + ' lux') : 'none');
        ro.set('heat', mode === 'ntc' ? kit.fmt(pheat * 1000, 3) + ' mW: about ' + kit.fmt(pheat * 1000 / 2, 2) + ' K of warming at 2 mW/K' : kit.fmt(pheat * 1000, 3) + ' mW (negligible)');
        ctl.show('beta', mode === 'ntc'); ctl.show('temp', mode === 'ntc'); ctl.show('lux', mode === 'ldr');
        plot.set({
          x: mode === 'ntc' ? { label: 'temperature (°C)', min: -30, max: 110 } : { label: 'light (lux)', log: true, min: 0.1, max: 10000 },
          y: { label: 'voltage at the pin (V)', min: 0, max: 3.4 },
          series: mode === 'ntc' ? [{ pts: curve(1), label: 'pin voltage' }]
            : [{ pts: curve(1), label: 'typical LDR' }, { pts: curve(0.5), label: 'half the resistance', dash: true }, { pts: curve(2), label: 'twice the resistance', dash: true }],
          hlines: [{ y: rg[1], label: 'top of the ADC window' }].concat(rg[0] > 0.02 ? [{ y: rg[0], label: 'bottom of the window' }] : []),
          marks: [{ x, y: V }]
        });
        loop.once();
      }
      const loop = kit.loop(() => {
        if (!s) return;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, v = ctl.values;
        const xc = Math.max(110, W * 0.3), top = 8, bot = H - 10, mid = (top + bot) / 2;
        const sensor = mode === 'ntc' ? 'NTC' : 'LDR', sval = kit.eng(s.rs, 'Ω'), fixed = kit.eng(v.rf, 'Ω');
        const high = v.low === 'high';
        SC.rail(c, xc, top, '3.3 V');
        SC.resistor(c, xc, top, xc, mid - 3, high ? { label: sensor, value: sval } : { label: 'R', value: fixed });
        SC.resistor(c, xc, mid + 3, xc, bot - 14, high ? { label: 'R', value: fixed } : { label: sensor, value: sval });
        SC.wire(c, [[xc, mid - 3], [xc, mid + 3]]); SC.node(c, xc, mid);
        SC.wire(c, [[xc, bot - 14], [xc, bot]]); SC.ground(c, xc, bot);
        SC.wire(c, [[xc, mid], [xc + 70, mid]]);
        S.box(c, xc + 70, mid - 18, Math.min(104, W - xc - 78), 36, { label: 'ADC pin', sub: kit.fmt(s.V, 3) + ' V', color: kit.hue(280), active: true, size: 11.5 });
      }, box.stage);
      st.onResize(() => loop.once());
      update();
    }
  });

  /* ================================================================ pc-crystal */
  // schematic models, in parts per million (1 ppm is 0.0864 s a day): the shape is real, the numbers are typical
  const RC_PPM = T => 2000 + 1000 * Math.abs(T - 25);                       // internal RC after calibration: 0.2 % plus 0.1 % per degree
  const XTAL_PPM = (T, off) => Math.abs(off - 0.034 * Math.pow(T - 25, 2));  // a watch crystal: its own offset, then a parabola
  const RTC_PPM = T => (T >= 0 && T <= 40 ? 2 : 3.5);                       // a temperature-compensated RTC chip
  Hyper.sim('pc-crystal', {
    title: 'How far does the sleep clock wander?',
    blurb: `While the chip sleeps, a slow clock counts the time to the next wake-up. The graph shows the error of three clocks against temperature, in **seconds per day** on a logarithmic scale; the bars show the error after one sleep interval. This is a **schematic**: real internal oscillators differ from chip to chip, and the point is the order of magnitude: percent for the internal oscillator, tens of ppm for the crystal, a few ppm for a compensated RTC chip.

**Try this**
- Drag the temperature to 25 °C: the internal oscillator is already minutes a day out; the crystal, about a second.
- Move it to −20 °C or 60 °C: the crystal's error grows with the square of the distance from 25 °C, the internal oscillator's linearly.
- At 45 °C set the sleep interval to **24 hours**: the internal clock is half an hour wrong when it wakes.
- Compare the error after **one minute** with the gateway's listening window of a few milliseconds.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.26, minH: 120, maxH: 170 });
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature', min: -20, max: 80, step: 1, value: 45, unit: '°C' },
        { id: 'int', type: 'select', label: 'Sleep interval', options: [['1 minute', 60], ['10 minutes', 600], ['1 hour', 3600], ['24 hours', 86400]], value: 3600 },
        { id: 'off', label: 'This crystal\'s own offset', min: -20, max: 20, step: 1, value: 10, unit: 'ppm' }
      ], () => update());
      const ro = kit.readout(box.side, [['rc', 'Internal oscillator'], ['x', '32.768 kHz crystal'], ['rtc', 'Compensated RTC chip'], ['note', 'In a day']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'temperature (°C)' }, y: { label: 'error (seconds per day)', log: true } }, 230);
      const DAY = 0.0864;
      let s = null;
      const fmtT = t => t < 1 ? kit.fmt(t * 1000, 3) + ' ms' : t < 120 ? kit.fmt(t, 3) + ' s' : t < 7200 ? kit.fmt(t / 60, 3) + ' min' : kit.fmt(t / 3600, 3) + ' h';
      function update() {
        const v = ctl.values, T = v.T;
        const ppm = [RC_PPM(T), XTAL_PPM(T, v.off), RTC_PPM(T)];
        s = { ppm, err: ppm.map(p => p * 1e-6 * v.int), day: ppm.map(p => p * DAY) };
        ro.set('rc', fmtT(s.err[0]) + '  (' + kit.fmt(ppm[0], 3) + ' ppm)');
        ro.set('x', fmtT(s.err[1]) + '  (' + kit.fmt(ppm[1], 3) + ' ppm)');
        ro.set('rtc', fmtT(s.err[2]) + '  (' + kit.fmt(ppm[2], 3) + ' ppm)');
        ro.set('note', 'RC ' + fmtT(s.day[0]) + ', crystal ' + fmtT(s.day[1]) + ', RTC ' + fmtT(s.day[2]));
        const xs = Array.from({ length: 101 }, (_, k) => -20 + k);
        const line = f => xs.map(t => [t, Math.max(0.01, f(t) * DAY)]);
        plot.set({
          x: { label: 'temperature (°C)', min: -20, max: 80 },
          y: { label: 'error (seconds per day)', log: true, min: 0.1, max: 10000 },
          series: [{ pts: line(RC_PPM), label: 'internal oscillator' }, { pts: line(t => XTAL_PPM(t, v.off)), label: '32.768 kHz crystal' }, { pts: line(RTC_PPM), label: 'compensated RTC chip' }],
          vlines: [{ x: T }]
        });
        loop.once();
      }
      const loop = kit.loop(() => {
        if (!s) return;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        // bars on a logarithmic time scale from 1 ms to one day
        const lx = 118, bx = lx + 8, bw = W - bx - 12, lo = -3, hi = 5, X = t => bx + clamp((Math.log10(Math.max(t, 1e-3)) - lo) / (hi - lo), 0, 1) * bw;
        const names = ['internal RC', '32 kHz crystal', 'compensated RTC'], cols = [C.bad, C.warn, C.ok], bh = Math.max(12, (H - 34) / 3 - 6);
        names.forEach((nm, i) => {
          const y = 4 + i * (bh + 6);
          kit.label(c, nm, lx, y + bh / 2, { size: 11, color: C.text2, align: 'right' });
          c.save(); c.globalAlpha = 0.8; c.fillStyle = cols[i]; c.fillRect(bx, y, Math.max(2, X(s.err[i]) - bx), bh); c.restore();
          kit.label(c, fmtT(s.err[i]), Math.min(X(s.err[i]) + 6, W - 60), y + bh / 2, { size: 10.5, weight: 600 });
        });
        const ay = 4 + 3 * (bh + 6) + 2;
        [[1e-3, '1 ms'], [1, '1 s'], [60, '1 min'], [3600, '1 h'], [86400, '1 day']].forEach(([t, lab]) => kit.label(c, lab, X(t), ay + 8, { size: 9.5, color: C.faint, align: 'center' }));
      }, box.stage);
      st.onResize(() => loop.once());
      update();
    }
  });

  /* ================================================================ pc-ferrite */
  Hyper.sim('pc-ferrite', {
    title: 'A supply filter with an inductor or a ferrite bead',
    blurb: `Noise rides on a supply rail; a series inductor or ferrite bead and a capacitor to ground form a low-pass filter for the quiet side. The graph is the **gain** from the noisy side to the filtered side, from 10 kHz to 1 GHz, solved from the circuit. The supply behind the filter has 50 mΩ of output resistance; the bead is modelled as 1.2 µH in parallel with 800 Ω (about 550 Ω at 100 MHz) plus its DC resistance; the plain inductor has 3 pF of winding capacitance; the capacitor has 10 mΩ of ESR and 0.7 nH of its own inductance. It is a schematic: real parts differ.

**Try this**
- Compare **capacitor only**, **inductor** and **bead**: the series part is what attenuates, the capacitor is what shorts the noise away.
- Look for the **peak** with the inductor or the bead: above 0 dB, noise near the resonance is made larger. Raise the **DC resistance** to 1 Ω and see it damp (and the drop grow).
- Compare the curves above 100 MHz: the plain inductor stops working beyond its self-resonance and becomes a capacitor; the lossy **bead** keeps attenuating.
- Raise the **load current** to 340 mA and read the **DC drop**: a bead in the path of the radio's burst current costs millivolts the chip needs.`,
    mount(box, kit) {
      const SC = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 120, maxH: 170 });
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Series part', options: [['None: capacitor only', 'none'], ['Inductor 1 µH', 'ind'], ['Ferrite bead (≈ 550 Ω at 100 MHz)', 'bead']], value: 'bead' },
        { id: 'c', label: 'Capacitor to ground', min: 0.1, max: 100, value: 10, log: true, sig: 2, fmt: v => kit.eng(v * 1e-6, 'F') },
        { id: 'dcr', label: 'DC resistance of the part', min: 0.02, max: 1, value: 0.1, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'i', label: 'Load current', min: 5, max: 500, value: 50, log: true, sig: 2, unit: 'mA' }
      ], () => update());
      const ro = kit.readout(box.side, [['a1', 'Attenuation at 1 MHz'], ['a100', 'Attenuation at 100 MHz'], ['a500', 'Attenuation at 500 MHz'], ['peak', 'Highest gain'], ['drop', 'DC drop at the load'], ['rail', 'Rail at the load']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'frequency (Hz)', log: true }, y: { label: 'gain (dB)' } }, 240);
      let q = null;
      function gainAt(f, circ) { const m = circ.ac(f).v('out'); return 20 * Math.log10(Math.max(fin(m.mag, 0), 1e-7)); }
      function build(v) {
        const c = new kit.Circuit();
        c.V('src', 'gnd', 3.3, { ac: 1 });
        c.R('src', 'in', 0.05);
        if (v.kind === 'none') c.R('in', 'out', 1e-3);
        else {
          c.L('in', 'm1', v.kind === 'ind' ? 1e-6 : 1.2e-6);
          if (v.kind === 'bead') c.R('in', 'm1', 800);
          c.C('in', 'm1', v.kind === 'ind' ? 3e-12 : 0.3e-12);
          c.R('m1', 'out', v.dcr);
        }
        c.L('out', 'k1', 0.7e-9); c.R('k1', 'k2', 0.01); c.C('k2', 'gnd', v.c * 1e-6);
        c.R('out', 'gnd', 3.3 / (v.i / 1000));
        return c;
      }
      function update() {
        const v = ctl.values, circ = build(v);
        const fs = logspace(1e4, 1e9, 120), pts = fs.map(f => [f, gainAt(f, circ)]);
        let peak = pts[0];
        for (const p of pts) if (p[1] > peak[1]) peak = p;
        const g1 = gainAt(1e6, circ), g100 = gainAt(1e8, circ), g500 = gainAt(5e8, circ), drop = v.kind === 'none' ? 0 : v.i / 1000 * v.dcr;
        q = { v, drop };
        ro.set('a1', kit.fmt(-g1, 3) + ' dB' + (g1 > 0 ? ' (the noise grows)' : ''));
        ro.set('a100', kit.fmt(-g100, 3) + ' dB' + (g100 > 0 ? ' (the noise grows)' : ''));
        ro.set('a500', kit.fmt(-g500, 3) + ' dB' + (g500 > 0 ? ' (the noise grows)' : ''));
        ro.set('peak', peak[1] > 0.5 ? '+' + kit.fmt(peak[1], 3) + ' dB at ' + kit.eng(peak[0], 'Hz') + ': a resonance' : 'no peak above 0 dB');
        ro.set('drop', Math.round(drop * 1000) + ' mV');
        ro.set('rail', kit.fmt(3.3 - drop, 4) + ' V');
        plot.set({
          x: { label: 'frequency (Hz)', log: true, min: 1e4, max: 1e9 },
          y: { label: 'gain (dB)', min: -100, max: Math.max(20, Math.ceil(peak[1] / 10) * 10 + 10) },
          series: [{ pts, label: 'gain from the noisy side to the load' }],
          hlines: [{ y: 0, label: '0 dB: no attenuation' }],
          vlines: [{ x: 1e6, label: '1 MHz' }, { x: 1e8, label: '100 MHz' }]
        });
        loop.once();
      }
      const loop = kit.loop(() => {
        if (!q) return;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, v = q.v;
        const y = H * 0.4, x0 = 18, xm = Math.max(120, W * 0.4), xc = xm + 60;
        kit.label(c, 'noisy rail', x0, y - 24, { size: 10.5, color: C.muted });
        SC.wire(c, [[x0, y], [x0 + 22, y]]);
        if (v.kind === 'none') SC.wire(c, [[x0 + 22, y], [xm + 40, y]]);
        else {
          SC.inductor(c, x0 + 22, y, xm + 40, y, { label: v.kind === 'ind' ? 'inductor' : 'ferrite bead', value: v.kind === 'ind' ? '1 µH' : 'DCR ' + kit.eng(v.dcr, 'Ω') });
        }
        SC.wire(c, [[xm + 40, y], [xc + 60, y]]); SC.node(c, xc, y);
        SC.capacitor(c, xc, y, xc, y + H * 0.38, { label: 'C', value: kit.eng(v.c * 1e-6, 'F') });
        SC.ground(c, xc, y + H * 0.38);
        kit.label(c, 'quiet rail at the load: ' + kit.fmt(3.3 - q.drop, 4) + ' V', x0, H - 8, { size: 11, color: C.text2 });
        void W;
      }, box.stage);
      st.onResize(() => loop.once());
      update();
    }
  });

  /* ================================================================ pc-protect */
  const CLAMPS = { none: { name: 'None: only the pin\'s own diodes' }, tvs: { name: 'TVS diode, 3.3 V type (breaks down near 4 V)', vz: 4.0, rs: 0.5 }, zener: { name: 'Zener diode, 5.1 V', vz: 5.1, rs: 2 } };
  Hyper.sim('pc-protect', {
    title: 'A fault voltage on an input pin',
    blurb: `Something puts a wrong voltage on an input: 5 V from a sensor, 12 V from a wiring slip, a negative swing. The pin has diodes to the rails inside, which conduct beyond about 0.6 V past each rail but are small (modelled here with 20 Ω in series). A **series resistor** limits what they must carry; an **external clamp** takes the big currents. The graph shows the pin voltage for every fault voltage; the circuit is solved exactly, with typical, schematic diode values.

**Try this**
- With **no resistor to speak of** (10 Ω) put 12 V on the input: hundreds of milliamps go through the pin's own diodes and the pin voltage climbs far above the rail.
- Raise the **series resistor** to 4.7 kΩ and then 10 kΩ: the current falls under the milliamp guideline.
- Go back to 10 Ω and add the **TVS diode**: it takes most of the current and holds the pin near 4 – 5 V (and the resistor now dissipates watts: a real design uses a larger resistor too).
- Try the **5.1 V Zener** with 10 Ω: it clamps, but at a voltage a 3.3 V pin should not see. A clamp must be chosen for the pin.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym, SC = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.32, minH: 130, maxH: 190 });
      const ctl = kit.controls(box.side, [
        { id: 'vf', label: 'Voltage put on the input', min: -24, max: 24, step: 0.5, value: 12, unit: 'V' },
        { id: 'r', label: 'Series resistor', min: 10, max: 100e3, value: 4700, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'clamp', type: 'select', label: 'External clamp at the pin', options: Object.keys(CLAMPS).map(k => [CLAMPS[k].name, k]), value: 'none' }
      ], () => update());
      const ro = kit.readout(box.side, [['vp', 'Voltage at the pin'], ['ir', 'Current in the series resistor'], ['ic', 'Into the pin\'s own diodes'], ['ie', 'Into the external clamp'], ['pr', 'Heat in the resistor'], ['verdict', 'Verdict']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'voltage put on the input (V)' }, y: { label: 'voltage at the pin (V)' } }, 220);
      let s = null;
      function solve(vf, R, clamp) {
        const c = new kit.Circuit();
        c.V('vdd', 'gnd', 3.3);
        c.V('in', 'gnd', vf);
        const Rs = c.R('in', 'pin', R);
        const up = c.D('pin', 'vdd', { rs: 20 }), dn = c.D('gnd', 'pin', { rs: 20 });          // the pin's own clamp diodes to the rails
        const ext = CLAMPS[clamp] && CLAMPS[clamp].vz ? c.D('gnd', 'pin', { vz: CLAMPS[clamp].vz, rs: CLAMPS[clamp].rs }) : null;
        c.dc();
        return { vp: fin(c.v('pin'), 0), ir: fin(Rs.i, 0), iUp: fin(up.i, 0), iDn: fin(dn.i, 0), iExt: ext ? fin(ext.i, 0) : 0, p: fin(Rs.p, 0) };
      }
      function update() {
        const v = ctl.values, r = solve(v.vf, v.r, v.clamp);
        const into = Math.abs(r.iUp) + Math.abs(r.iDn);
        s = { v, r };
        ro.set('vp', kit.fmt(r.vp, 3) + ' V');
        ro.set('ir', kit.eng(Math.abs(r.ir), 'A'));
        ro.set('ic', kit.eng(into, 'A') + (into > 1e-3 ? '  (over the 1 mA guideline)' : ''));
        ro.set('ie', CLAMPS[v.clamp].vz ? kit.eng(Math.abs(r.iExt), 'A') : 'no external clamp');
        ro.set('pr', kit.fmt(r.p * 1000, 3) + ' mW');
        ro.set('verdict', r.vp > 3.6 ? 'More than 3.6 V on the pin: this clamp does not protect it' : into > 1e-3 ? 'The pin\'s diodes carry more than a milliamp: raise R or add a clamp' : Math.abs(v.vf) > 3.6 ? 'Safe: the resistor and the diodes absorb the fault' : 'Normal operation: no fault');
        const pts = []; for (let k = 0; k <= 96; k++) { const vf = -24 + k * 0.5; pts.push([vf, solve(vf, v.r, v.clamp).vp]); }
        plot.set({
          x: { label: 'voltage put on the input (V)', min: -24, max: 24 },
          y: { label: 'voltage at the pin (V)', min: -2, max: 8 },
          series: [{ pts, label: 'pin voltage' }],
          hlines: [{ y: 3.6, label: 'absolute maximum 3.6 V' }, { y: 3.3, label: '3.3 V rail' }],
          marks: [{ x: v.vf, y: clamp(r.vp, -2, 8) }]
        });
        loop.once();
      }
      const loop = kit.loop(() => {
        if (!s) return;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, v = s.v, r = s.r;
        const arm = Math.min(40, H * 0.3), xs = 22, y = H * 0.55, xr0 = xs + 40, xr1 = xr0 + 92, xp = xr1 + 40, bw = Math.min(96, W - xp - 70);
        kit.label(c, kit.fmt(v.vf, 3) + ' V', xs, y - 26, { size: 11.5, weight: 700, color: Math.abs(v.vf) > 3.6 ? C.warn : C.ok, align: 'left' });
        SC.wire(c, [[xs, y], [xr0, y]]);
        SC.resistor(c, xr0, y, xr1, y, { label: 'R', value: kit.eng(v.r, 'Ω') });
        SC.wire(c, [[xr1, y], [xp, y]]); SC.node(c, xp - 14, y);
        // the clamps: the pin's own diodes (dim) and the external one
        const dcol = Math.abs(r.iUp) + Math.abs(r.iDn) > 1e-3 ? C.bad : C.muted;
        SC.rail(c, xp - 14, y - arm, '3.3 V');
        SC.diode(c, xp - 14, y, xp - 14, y - arm, { color: dcol });
        SC.diode(c, xp - 14, y + arm, xp - 14, y, { color: dcol });
        SC.ground(c, xp - 14, y + arm);
        if (CLAMPS[v.clamp].vz) { SC.diode(c, xp - 40, y + arm, xp - 40, y, { kind: 'zener', color: C.accent }); SC.ground(c, xp - 40, y + arm); SC.node(c, xp - 40, y); }
        S.box(c, xp, y - 18, bw, 36, { label: 'pin', sub: kit.fmt(r.vp, 3) + ' V', color: kit.hue(280), active: true, size: 11.5 });
        void E;
      }, box.stage);
      st.onResize(() => loop.once());
      update();
    }
  });

  /* ================================================================ pc-breadboard */
  const BB_COLS = 30;
  const BB = {
    good: { name: 'Correct: rail, resistor, LED, ground', parts: [['wire', [2, -1], [2, 0]], ['res', [2, 2], [6, 2]], ['led', [6, 3], [9, 3]], ['wire', [9, 4], [9, 10]]] },
    resShort: { name: 'Mistake: both resistor legs in one column', parts: [['wire', [2, -1], [2, 0]], ['res', [2, 2], [2, 3]], ['led', [2, 4], [9, 3]], ['wire', [9, 4], [9, 10]]] },
    ledShort: { name: 'Mistake: both LED legs in one column', parts: [['wire', [2, -1], [2, 0]], ['res', [2, 2], [6, 2]], ['led', [6, 3], [6, 4]], ['wire', [9, 4], [9, 10]]] },
    offOne: { name: 'Mistake: the ground wire is one column off', parts: [['wire', [2, -1], [2, 0]], ['res', [2, 2], [6, 2]], ['led', [6, 3], [9, 3]], ['wire', [10, 4], [10, 10]]] },
    wrongHalf: { name: 'Mistake: the LED leg is below the centre gap', parts: [['wire', [2, -1], [2, 0]], ['res', [2, 2], [6, 2]], ['led', [6, 3], [9, 6]], ['wire', [9, 4], [9, 10]]] },
    split: { name: 'Mistake: wires taken to the far half of a split rail', split: true, parts: [['wire', [20, -1], [20, 0]], ['res', [20, 2], [24, 2]], ['led', [24, 3], [27, 3]], ['wire', [27, 4], [27, 10]]] }
  };
  Hyper.sim('pc-breadboard', {
    title: 'Which holes of a breadboard are joined?',
    blurb: `On the board, the five holes above the centre gap in one column are joined, the five below are joined, and each power rail runs the length of the board (many are **split in the middle**). Wires are drawn in colour. The circuit is 3.3 V from the top rail, a resistor, an LED, and ground at the bottom rail. The simulation traces what is really connected and tells you whether the LED lights.

**Try this**
- Start with the *correct* build and **click a hole**: everything the board joins to it lights up.
- Walk through the mistakes one by one: a resistor with both legs in a column, an LED across one column, a ground wire one hole off, a leg on the wrong side of the gap.
- Switch **the rails are split** on in the correct build: it still works, because everything is on the left half. Choose the last mistake to see how a wire on the far half fails.`,
    mount(box, kit) {
      const S = kit.esym, SC = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 300, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'scen', type: 'select', label: 'Build', options: Object.keys(BB).map(k => [BB[k].name, k]), value: 'good' },
        { id: 'split', type: 'check', label: 'The power rails are split in the middle', value: false }
      ], (id, val) => { if (id === 'scen') { ctl.set('split', !!BB[val].split); } sel = null; update(); });
      const ro = kit.readout(box.side, [['res', 'The LED'], ['why', 'Because'], ['sel', 'Selected hole']]);
      let sel = null, geo = null;
      const key = (c, r, split) => r < 0 ? 'RT' + (split ? (c >= BB_COLS / 2 ? 'R' : 'L') : '') : r > 9 ? 'RB' + (split ? (c >= BB_COLS / 2 ? 'R' : 'L') : '') : (r < 5 ? 'T' : 'B') + c;
      const finder = () => { const p = new Map(); const f = k => { if (!p.has(k)) p.set(k, k); while (p.get(k) !== k) { p.set(k, p.get(p.get(k))); k = p.get(k); } return k; }; return { f, u: (a, b) => p.set(f(a), f(b)) }; };
      function analyse() {
        const sc = BB[ctl.values.scen] || BB.good, split = !!ctl.values.split, uf = finder();
        for (const [kind, a, b] of sc.parts) if (kind === 'wire') uf.u(key(a[0], a[1], split), key(b[0], b[1], split));
        const net = h => uf.f(key(h[0], h[1], split));
        const plus = net([0, -1]), gnd = net([0, 10]);
        const res = sc.parts.filter(p => p[0] === 'res'), led = sc.parts.find(p => p[0] === 'led');
        let out;
        if (plus === gnd) out = { kind: 'short', text: 'Supply shorted', why: 'The 3.3 V rail and ground are joined by a wire: a short circuit.' };
        else if (!led) out = { kind: 'open', text: 'No LED', why: '' };
        else {
          const na = net(led[1]), nc = net(led[2]);
          const r = res[0], e1 = r ? net(r[1]) : null, e2 = r ? net(r[2]) : null;
          if (na === nc) out = { kind: 'ledShort', text: 'LED dark: shorted out', why: 'Both legs of the LED are in the same column of five holes. That is one connection, so the current bypasses the LED.' };
          else if (r && e1 === e2 && na === e1 && e1 === plus && nc === gnd) out = { kind: 'resShort', text: 'LED too bright: no resistor', why: 'Both legs of the resistor are in one column, so it is shorted out and the LED sits straight across 3.3 V: too much current, for a pin or a supply.' };
          else if (r && nc === gnd && ((e1 === plus && e2 === na) || (e2 === plus && e1 === na))) out = { kind: 'lit', text: 'LED lights', why: 'The current runs from the 3.3 V rail through the resistor and the LED to ground: every join is where it should be.' };
          else out = { kind: 'open', text: 'LED dark: a gap in the path', why: split ? 'Part of the circuit hangs on the far half of a split rail, which is not connected to the supply. Bridge the split or move the wires.' : 'One of the legs or wires is in a column or on a side of the gap that is not joined to the rest. Click holes to see what each one joins.' };
        }
        return { sc, split, net, uf, out };
      }
      let A = null;
      function update() {
        A = analyse();
        ro.set('res', A.out.text);
        ro.set('why', A.out.why || '—');
        ro.set('sel', sel ? 'column ' + (sel[0] + 1) + ', ' + (sel[1] < 0 ? 'top rail' : sel[1] > 9 ? 'bottom rail' : 'row ' + 'abcdefghij'[sel[1]]) : 'click a hole');
        loop.once();
      }
      const loop = kit.loop(() => {
        if (!A) A = analyse();
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const p = Math.max(9, Math.min(22, (W - 56) / (BB_COLS + 1), (H - 70) / 15)), bx = 46, by = 16;
        const b = S.breadboard(c, bx, by, BB_COLS, { pitch: p });
        geo = b;
        // the holes joined to the selected one (by the board alone)
        if (sel) {
          const split = A.split, k0 = key(sel[0], sel[1], split);
          c.save(); c.fillStyle = C.accent; c.globalAlpha = 0.85;
          for (let col = 0; col < BB_COLS; col++) for (let r = -1; r <= 10; r++) {
            if (r < 0 && false) continue;
            if (key(col, r, split) === k0) { const [x, y] = b.hole(col, r); c.beginPath(); c.arc(x, y, p * 0.3, 0, 7); c.fill(); }
          }
          c.restore();
        }
        // the rails' names, and the split
        kit.label(c, '3.3 V', bx - 6, b.hole(0, -1)[1], { size: 10.5, color: C.bad, align: 'right', weight: 600 });
        kit.label(c, 'GND', bx - 6, b.hole(0, 10)[1], { size: 10.5, color: C.text2, align: 'right', weight: 600 });
        if (A.split) for (const r of [-1, 10]) { const [x, y] = b.hole(BB_COLS / 2 - 0.5, r); c.save(); c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y - p * 0.45); c.lineTo(x, y + p * 0.45); c.stroke(); c.restore(); }
        kit.label(c, 'centre gap', bx + p * 2.2, by + p * 8.3, { size: 9.5, color: '#6b6a64', align: 'left' });
        // the parts
        const wcol = [kit.hue(8), kit.hue(40), kit.hue(212)];
        let wi = 0;
        for (const [kind, a, h2] of A.sc.parts) {
          const [x1, y1] = b.hole(a[0], a[1]), [x2, y2] = b.hole(h2[0], h2[1]);
          if (kind === 'wire') { S.wire(c, [[x1, y1], [x2, y2]], { color: wcol[wi++ % 3] }); kit.dot(c, x1, y1, p * 0.2, '#222'); kit.dot(c, x2, y2, p * 0.2, '#222'); }
          else if (kind === 'res') { SC.resistor(c, x1, y1, x2, y2, { color: '#8a5a2b', label: '', value: '' }); }
          else { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2; S.wire(c, [[x1, y1], [mx, my], [x2, y2]], { color: '#555' }); S.led(c, mx, my, { color: 5, on: A.out.kind === 'lit' ? 1 : A.out.kind === 'resShort' ? 1 : 0, r: Math.max(5, p * 0.5) }); }
        }
        const col = A.out.kind === 'lit' ? C.ok : A.out.kind === 'resShort' ? C.warn : C.bad;
        kit.label(c, A.out.text, bx, by + b.h + 16, { size: 12.5, weight: 700, color: col, align: 'left' });
        kit.label(c, 'click a hole to see what the board joins to it', bx, by + b.h + 32, { size: 10.5, color: C.faint, align: 'left' });
      }, box.stage);
      kit.click(st, pt => {
        if (!geo) return;
        let best = null, bd = 1e9;
        for (let col = 0; col < BB_COLS; col++) for (let r = -1; r <= 10; r++) { const [x, y] = geo.hole(col, r), d = Math.hypot(pt.x - x, pt.y - y); if (d < bd) { bd = d; best = [col, r]; } }
        if (best && bd <= geo.pitch * 0.6) { sel = best; update(); }
      }, pt => {
        if (!geo) return false;
        for (let col = 0; col < BB_COLS; col++) for (let r = -1; r <= 10; r++) { const [x, y] = geo.hole(col, r); if (Math.hypot(pt.x - x, pt.y - y) <= geo.pitch * 0.6) return true; }
        return false;
      });
      st.onResize(() => loop.once());
      update();
    }
  });
})();
