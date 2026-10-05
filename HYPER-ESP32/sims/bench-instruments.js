/* HYPER-ESP32 · sims/bench-instruments.js
 *
 * Simulations of the topic "Instruments on the bench". Ids start with bi-.
 *
 *   bi-meter      a multimeter in series: range, burden, fuse, and the mistake of measuring across the supply
 *   bi-supply     a bench supply: constant voltage, constant current, the load line and the operating point
 *   bi-scope      an oscilloscope on a supply rail with a dip: time base, volts per division, trigger, coupling
 *   bi-probe      a x1 and a x10 probe: loading of the source, rise time, compensation
 *   bi-logic      a logic analyser decoding a UART: sample rate, threshold, decoder baud rate
 *   bi-profile    a sleep-wake cycle seen by a profiler, a multimeter and a USB meter, and the battery life each predicts
 *   bi-generator  a function generator into a high-impedance pin: the 50 ohm trap and the safe window
 *   bi-vna        the return loss of an antenna against frequency, and what a case or a hand does to it
 *   bi-reflow     a soldering profile against the melting point of the solder and the limits of the parts
 *   bi-esd        a discharge of the human-body model: body voltage by surface and humidity, current and energy
 */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fin = v => Number.isFinite(v);

  /* a plot frame with a grid and tick labels: -> { X(v), Y(v), x, y, w, h } */
  function frame(kit, c, x, y, w, h, o) {
    const C = kit.colors(), nx = o.nx || 5, ny = o.ny || 4;
    const X = v => x + (v - o.x0) / ((o.x1 - o.x0) || 1) * w, Y = v => y + h - (v - o.y0) / ((o.y1 - o.y0) || 1) * h;
    c.save();
    c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
    for (let i = 0; i <= nx; i++) { const gx = Math.round(x + w * i / nx) + 0.5; c.moveTo(gx, y); c.lineTo(gx, y + h); }
    for (let j = 0; j <= ny; j++) { const gy = Math.round(y + h * j / ny) + 0.5; c.moveTo(x, gy); c.lineTo(x + w, gy); }
    c.stroke();
    c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + h); c.lineTo(x + w, y + h); c.stroke();
    c.restore();
    const xf = o.xfmt || (v => kit.fmt(v, 3)), yf = o.yfmt || (v => kit.fmt(v, 3));
    for (let i = 0; i <= nx; i++) kit.label(c, xf(o.x0 + (o.x1 - o.x0) * i / nx), x + w * i / nx, y + h + 11, { size: 10, color: C.muted, align: 'center' });
    for (let j = 0; j <= ny; j++) kit.label(c, yf(o.y0 + (o.y1 - o.y0) * j / ny), x - 6, y + h - h * j / ny, { size: 10, color: C.muted, align: 'right' });
    if (o.xlabel) kit.label(c, o.xlabel, x + w / 2, y + h + 25, { size: 10.5, color: C.text2 || C.muted, align: 'center' });
    if (o.ylabel) kit.label(c, o.ylabel, x, y - 10, { size: 10.5, color: C.text2 || C.muted });
    return { X, Y, x, y, w, h };
  }
  function trace(c, F, pts, color, width) {
    c.save();
    c.beginPath(); c.rect(F.x - 1, F.y - 2, F.w + 2, F.h + 4); c.clip();
    c.strokeStyle = color; c.lineWidth = width || 2; c.lineJoin = 'round'; c.beginPath();
    let on = false;
    for (const p of pts) {
      if (!fin(p[0]) || !fin(p[1])) { on = false; continue; }
      if (on) c.lineTo(F.X(p[0]), F.Y(p[1])); else { c.moveTo(F.X(p[0]), F.Y(p[1])); on = true; }
    }
    c.stroke(); c.restore();
  }
  function hline(kit, c, F, v, color, label, below) {
    const y = F.Y(v);
    if (y < F.y - 1 || y > F.y + F.h + 1) return;
    c.save(); c.strokeStyle = color; c.lineWidth = 1.3; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(F.x, y); c.lineTo(F.x + F.w, y); c.stroke(); c.restore();
    if (label) kit.label(c, label, F.x + F.w - 4, y + (below ? 9 : -8), { size: 10, color, align: 'right' });
  }
  const volts = v => (fin(v) ? v.toFixed(2) + ' V' : 'no value');

  /* ================================================================ bi-meter */
  Hyper.sim('bi-meter', {
    title: 'A multimeter in series: range, burden and fuse',
    blurb: `A 3.3 V supply feeds a board that draws the **true current** you set. The meter on its **current range** is a small resistor in series: it takes **burden voltage** from the rail and so lowers the current it is measuring. The resistances are typical of a hand-held meter (about 0.2 V of burden at full scale on each range), not those of one model.

**Try this**
- Leave the 200 mA range and 80 mA: the reading is a little low and the rail is a little under 3.3 V.
- Switch to the **200 µA** range: the meter is 1 kΩ, the board starves, and the meter shows OL.
- Raise the current to 500 mA on the 200 mA range: the fuse in the mA jack blows, and the board goes dark. *Fit a new fuse* to continue.
- Choose *Across the supply*: the meter becomes a near-short and its fuse blows, or the supply is overloaded.`,
    mount(box, kit) {
      const S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.8, maxH: 560 });
      const VS = 3.3, ISUP = 3;                                  // the supply, and the most a USB charger gives (A)
      const RANGES = [
        { id: 'ua', name: '200 µA', fs: 0.0002, R: 1000, fuse: 0.4, jack: 'ma' },
        { id: 'ma20', name: '20 mA', fs: 0.02, R: 10, fuse: 0.4, jack: 'ma' },
        { id: 'ma200', name: '200 mA', fs: 0.2, R: 1, fuse: 0.4, jack: 'ma' },
        { id: 'a10', name: '10 A', fs: 10, R: 0.01, fuse: 10, jack: 'a' }
      ];
      const blown = { ma: false, a: false };
      const ctl = kit.controls(box.side, [
        { id: 'range', type: 'select', label: 'Current range', options: RANGES.map(r => [r.name + ' (about ' + kit.eng(r.R, 'Ω') + ')', r.id]), value: 'ma200' },
        { id: 'I', label: 'True current of the board', min: 0.01, max: 1000, log: true, sig: 2, value: 80, unit: 'mA' },
        { id: 'conn', type: 'select', label: 'Where the meter is', options: [['In series with the board', 'series'], ['Across the supply (a mistake)', 'across']], value: 'series' },
        { type: 'buttons', items: [{ id: 'fuse', label: 'Fit new fuses' }] }
      ], id => { if (id === 'fuse') { blown.ma = false; blown.a = false; } loop.once(); });
      const ro = kit.readout(box.side, [['true', 'True current'], ['shows', 'The meter shows'], ['err', 'Error'], ['burden', 'Burden voltage'], ['rail', 'Rail at the board'], ['verdict', 'Verdict']]);
      const solve = v => {
        const r = RANGES.find(q => q.id === v.range) || RANGES[2], It = v.I / 1000, Rb = VS / It;
        const o = { r, It };
        if (blown[r.jack]) { o.Imeter = 0; o.open = true; o.Vb = 0; o.Ibrd = 0; return o; }
        if (v.conn === 'across') {
          o.Iatt = Math.min(VS / r.R, ISUP); o.Imeter = o.Iatt; o.Vb = Math.min(VS, o.Iatt * r.R);
          if (o.Iatt > r.fuse) { blown[r.jack] = true; o.blew = true; }
          return o;
        }
        o.Imeter = VS / (Rb + r.R); o.Ibrd = o.Imeter; o.Vb = o.Imeter * Rb;
        if (o.Imeter > r.fuse) { blown[r.jack] = true; o.blew = true; o.Imeter = 0; o.Vb = 0; o.open = true; }
        return o;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const o = solve(v), r = o.r, series = v.conn === 'series';
        const X0 = 46, X1 = W - 86, ty = 44, by = ty + 100, mx = (X0 + X1) / 2;
        const over = !o.open && o.Imeter > r.fs;
        const shown = o.open ? '0.00 mA' : over ? 'OL' : (r.id === 'ua' ? kit.fmt(o.Imeter * 1e6, 3) + ' µA' : kit.fmt(o.Imeter * 1000, 3) + ' mA');
        const railOk = o.Vb >= 3.0, railBad = o.Vb < 2.4;
        const railCol = railBad ? C.bad : railOk ? C.ok : C.warn;
        // the circuit
        S.vsource(c, X0, ty, X0, by, { label: '3.3 V' });
        S.resistor(c, X1, ty, X1, by, { label: 'board', value: volts(o.Vb) });
        S.wire(c, [[X0, by], [X1, by]]);
        S.ground(c, mx, by);
        if (series) {
          S.wire(c, [[X0, ty], [mx - 16, ty]]); S.wire(c, [[mx + 16, ty], [X1, ty]]);
          S.meter(c, mx, ty, 'A', null, { color: o.open ? C.bad : C.text });
          kit.label(c, shown, mx, ty - 28, { size: 14, weight: 700, color: over || o.open ? C.bad : C.accent, align: 'center' });
          kit.label(c, o.open ? 'fuse blown' : 'in series: ' + kit.eng(r.R, 'Ω'), mx, ty + 28, { size: 10.5, color: o.open ? C.bad : C.muted, align: 'center' });
        } else {
          S.wire(c, [[X0, ty], [X1, ty]]);
          const my = (ty + by) / 2;
          S.wire(c, [[mx, ty], [mx, my - 16]]); S.wire(c, [[mx, my + 16], [mx, by]]);
          S.node(c, mx, ty); S.node(c, mx, by);
          S.meter(c, mx, my, 'A', null, { color: o.open ? C.bad : C.text });
          kit.label(c, shown, mx + 26, my - 8, { size: 14, weight: 700, color: C.bad });
          kit.label(c, o.open ? 'fuse blown' : 'across the supply!', mx + 26, my + 10, { size: 10.5, color: C.bad });
        }
        // the rail at the board, as a bar
        const bx = 46, bw = W - 76, bY = by + 54;
        kit.label(c, 'Rail at the board', bx, bY - 14, { size: 11.5, weight: 600, color: C.text2 || C.text });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(bx, bY, bw, 16);
        c.fillStyle = railCol; c.fillRect(bx, bY, bw * clamp(o.Vb / 3.6, 0, 1), 16);
        for (const [lv, col, lab] of [[2.4, C.bad, 'resets 2.4 V'], [3.0, C.warn, 'min 3.0 V']]) {
          const lx = bx + bw * lv / 3.6;
          c.strokeStyle = col; c.lineWidth = 1.6; c.beginPath(); c.moveTo(lx, bY - 3); c.lineTo(lx, bY + 19); c.stroke();
          kit.label(c, lab, lx, bY + 31, { size: 9.5, color: col, align: 'center' });
        }
        kit.label(c, volts(o.Vb), bx + bw, bY - 14, { size: 11.5, weight: 600, color: railCol, align: 'right' });
        // true against shown, on a logarithmic scale of milliamps
        const cy = bY + 66, lo = 0.001, hi = 3000, L = m => bw * clamp(Math.log(Math.max(m, lo) / lo) / Math.log(hi / lo), 0, 1);
        kit.label(c, 'Current: true and as shown (log scale, mA)', bx, cy - 12, { size: 11.5, weight: 600, color: C.text2 || C.text });
        const rows = [['true', o.It * 1000, kit.hue(150, 0.9)], ['shown', over ? r.fs * 1000 : o.Imeter * 1000, over || o.open ? C.bad : C.warn]];
        rows.forEach(([lab, mA, col], i) => {
          const yy = cy + i * 24;
          c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(bx, yy, bw, 15);
          c.fillStyle = col; c.fillRect(bx, yy, mA > lo ? L(mA) : 0, 15);
          kit.label(c, lab, bx + 4, yy + 8, { size: 10, color: mA > lo * 30 ? '#fff' : C.text });
        });
        // the numbers
        const err = series && !o.open && !over ? (o.Imeter - o.It) / o.It * 100 : null;
        ro.set('true', kit.fmt(o.It * 1000, 3) + ' mA');
        ro.set('shows', shown + (over ? '  (above this range)' : ''));
        ro.set('err', err == null ? 'not meaningful' : (err >= 0 ? '+' : '') + kit.fmt(err, 2) + ' %');
        ro.set('burden', kit.fmt(o.Imeter * r.R * 1000, 3) + ' mV  (' + kit.eng(r.R, 'Ω') + ' range)');
        ro.set('rail', volts(o.Vb) + (railBad ? '  (the board resets)' : railOk ? '' : '  (below 3.0 V)'));
        ro.set('verdict', o.open ? 'Fuse blown: no current flows, the board is off. Fit new fuses.'
          : o.blew ? 'The current went past the fuse: it blew just now.'
          : !series ? 'A near-short across the supply: only the fuse or the supply limit stops it.'
          : over ? 'OL: more than this range can show. Use a higher range; the meter is unharmed.'
          : railBad ? 'The burden of the meter resets the board.'
          : !railOk ? 'The burden pulls the rail under 3.0 V: the board is disturbed.'
          : Math.abs(err) > 5 ? 'The reading is ' + kit.fmt(Math.abs(err), 2) + ' % low: the burden starves the board.'
          : 'A good choice: the burden is small and the reading is close to the truth.');
        void H;
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ bi-supply */
  Hyper.sim('bi-supply', {
    title: 'A bench supply: constant voltage, constant current',
    blurb: `The graph is the **output characteristic** of the supply: the flat part is *constant voltage* and the vertical drop at the **current limit** is *constant current*. The sloping line is the **load** (a resistor, V = I × R). The supply works where the two lines cross.

**Try this**
- Press *Idle board* with the limit at 100 mA: the supply is in constant voltage and the board has 3.3 V.
- Press *Radio burst* (340 mA) with the same limit: constant current takes over and the voltage falls below 3 V. The board browns out.
- Press *Short circuit*: whatever the limit, the voltage collapses and the short dissipates little.
- Raise the limit to 500 mA and press *Radio burst* again.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.66, maxH: 500 });
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Voltage set', min: 0, max: 6, step: 0.1, value: 3.3, unit: 'V' },
        { id: 'Ilim', label: 'Current limit', min: 10, max: 2000, log: true, sig: 2, value: 100, unit: 'mA' },
        { id: 'R', label: 'Load: equivalent resistance', min: 0.05, max: 1000, log: true, sig: 2, value: 47, unit: 'Ω' },
        { type: 'buttons', items: [{ id: 'idle', label: 'Idle board' }, { id: 'tx', label: 'Radio burst' }, { id: 'short', label: 'Short circuit' }, { id: 'light', label: 'Light load' }] }
      ], id => {
        const preset = { idle: 47, tx: 9.7, short: 0.1, light: 1000 }[id];
        if (preset != null) ctl.set('R', preset);
        loop.once();
      });
      const ro = kit.readout(box.side, [['mode', 'Mode'], ['v', 'Output voltage'], ['i', 'Output current'], ['p', 'Power in the load'], ['verdict', 'Verdict']]);
      const solve = v => {
        const Id = v.R > 0 ? v.V / v.R * 1000 : 1e9;              // mA the load would take at the set voltage
        if (Id <= v.Ilim) return { cv: true, V: v.V, I: Id, Id };
        return { cv: false, V: v.Ilim * v.R / 1000, I: v.Ilim, Id };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const o = solve(v), xmax = v.Ilim * 1.5, ymax = 6.5;
        const F = frame(kit, c, 56, 34, W - 56 - 22, H - 34 - 48, { x0: 0, x1: xmax, y0: 0, y1: ymax, nx: 5, ny: 5, xlabel: 'current (mA)', ylabel: 'output voltage (V)', xfmt: q => (q >= 100 ? String(Math.round(q)) : kit.fmt(q, 2)), yfmt: q => q.toFixed(1) });
        // the supply: flat to the limit, then straight down
        const sup = [[0, v.V], [v.Ilim, v.V], [v.Ilim, 0]];
        trace(c, F, sup, C.accent, 3);
        kit.label(c, 'supply', F.X(v.Ilim * 0.5), F.Y(v.V) - 9, { size: 10.5, color: C.accent, align: 'center' });
        kit.label(c, 'limit', F.X(v.Ilim) + 4, F.Y(ymax * 0.12), { size: 10.5, color: C.accent });
        // the load line V = I R
        const iEnd = Math.min(xmax, ymax * 1000 / v.R);
        trace(c, F, [[0, 0], [iEnd, iEnd * v.R / 1000]], C.warn, 2);
        kit.label(c, 'load ' + kit.eng(v.R, 'Ω'), F.X(iEnd * 0.6) + 6, F.Y(iEnd * 0.6 * v.R / 1000) - 8, { size: 10.5, color: C.warn });
        // the operating point
        const col = o.cv ? C.ok : C.bad;
        kit.dot(c, F.X(o.I), F.Y(o.V), 6.5, col, C.bg2);
        // the lamps
        const lx = F.x + F.w - 100;
        S.led(c, lx, F.y + 14, { color: 140, on: o.cv ? 1 : 0.08, r: 7 });
        kit.label(c, 'CV', lx + 12, F.y + 14, { size: 11, weight: 700, color: o.cv ? C.ok : C.faint });
        S.led(c, lx + 50, F.y + 14, { color: 8, on: o.cv ? 0.08 : 1, r: 7 });
        kit.label(c, 'CC', lx + 62, F.y + 14, { size: 11, weight: 700, color: o.cv ? C.faint : C.bad });
        const pw = o.V * o.I;
        ro.set('mode', o.cv ? 'Constant voltage (CV)' : 'Constant current (CC)');
        ro.set('v', volts(o.V));
        ro.set('i', kit.fmt(o.I, 3) + ' mA');
        ro.set('p', kit.fmt(pw, 3) + ' mW');
        ro.set('verdict', o.cv
          ? 'The supply holds ' + volts(v.V) + '; the load takes ' + kit.fmt(o.I, 3) + ' mA, ' + kit.fmt(o.I / v.Ilim * 100, 2) + ' % of the limit.'
          : v.R < 0.5 ? 'A short: the supply holds the limit and the voltage collapses to ' + volts(o.V) + '. The short dissipates only ' + kit.fmt(pw, 2) + ' mW.'
          : o.V < 3.0 && v.V >= 3.0 ? 'The load wants ' + kit.fmt(o.Id, 3) + ' mA but the limit is ' + kit.fmt(v.Ilim, 3) + ' mA: the voltage falls to ' + volts(o.V) + ' and a 3.3 V board browns out.'
          : 'Constant current: the limit holds the current at ' + kit.fmt(v.Ilim, 3) + ' mA and the voltage is ' + volts(o.V) + '.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ bi-scope */
  const hash = n => { const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };
  Hyper.sim('bi-scope', {
    title: 'An oscilloscope on a supply rail with a dip',
    blurb: `The input is a 3.3 V rail on which the radio makes a **burst** at regular intervals: the rail dips for the length of the burst and recovers, with a little ripple on top. The screen is 10 divisions wide and 8 high. The **trigger** starts each sweep when the rail crosses the level you set in the direction you choose; the screen is drawn around that moment.

**Try this**
- With the defaults the dip stands still in the middle of the screen: trigger level 3.0 V, falling edge.
- Raise the trigger level to 3.4 V, above the rail: in *Auto* mode the picture drifts, in *Normal* it waits.
- Set the level to 3.30 V, inside the ripple, and 5 µs per division: the trigger jumps from one ripple edge to another and the trace shakes.
- Switch to **AC coupling**: the 3.3 V disappears, the rail sits at 0 and a trigger level near −0.2 V finds the dip.
- Slow the time base to 50 ms per division: the ripple turns into a smear.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.62, maxH: 460 });
      const TD = [['1 µs', 1e-6], ['5 µs', 5e-6], ['20 µs', 20e-6], ['100 µs', 100e-6], ['500 µs', 500e-6], ['2 ms', 2e-3], ['10 ms', 10e-3], ['50 ms', 50e-3]];
      const VD = [['10 mV', 0.01], ['20 mV', 0.02], ['50 mV', 0.05], ['100 mV', 0.1], ['200 mV', 0.2], ['500 mV', 0.5], ['1 V', 1]];
      const ctl = kit.controls(box.side, [
        { id: 'tdiv', type: 'select', label: 'Time per division', options: TD, value: 500e-6 },
        { id: 'vdiv', type: 'select', label: 'Volts per division', options: VD, value: 0.1 },
        { id: 'vc', label: 'Voltage at the screen centre (DC)', min: 0, max: 4, step: 0.05, value: 3.1, unit: 'V' },
        { id: 'level', label: 'Trigger level', min: -1, max: 4, step: 0.01, value: 3.0, unit: 'V' },
        { id: 'slope', type: 'select', label: 'Trigger edge', options: [['falling', 'fall'], ['rising', 'rise']], value: 'fall' },
        { id: 'mode', type: 'select', label: 'Trigger mode', options: [['Auto', 'auto'], ['Normal', 'normal']], value: 'auto' },
        { id: 'coupling', type: 'select', label: 'Coupling', options: [['DC', 'dc'], ['AC', 'ac']], value: 'dc' },
        { id: 'dip', label: 'Dip depth', min: 0.05, max: 1.5, step: 0.05, value: 0.35, unit: 'V' },
        { id: 'period', label: 'Burst every', min: 20, max: 500, step: 10, value: 100, unit: 'ms' }
      ], () => { if (!loop.running) loop.once(); });
      const ro = kit.readout(box.side, [['trig', 'Trigger'], ['low', 'Lowest point on screen'], ['dip', 'The dip'], ['rate', 'Sample rate']]);
      const TB = 2e-3;                                              // burst length (s)
      const rail = (t, p) => {
        const n = Math.floor(t / p.P), ph = t - n * p.P;
        let v = 3.3;
        if (ph < TB) v -= p.dip * (1 - Math.exp(-ph / 20e-6)); else v -= p.dip * (1 - Math.exp(-TB / 20e-6)) * Math.exp(-(ph - TB) / 300e-6);
        const j = hash(n);
        return v + 0.012 * Math.sin(TAU * 250e3 * t + j * TAU) + 0.0035 * Math.sin(TAU * 1.3e6 * t + j * 3.1) + 0.0015 * Math.sin(TAU * 5.7e6 * t + j * 5.2);
      };
      let vdcKey = '', vdcVal = 3.3, lastT0 = null;
      const dcMean = p => {
        const k = p.P + '/' + p.dip;
        if (k !== vdcKey) { let s = 0; const N = 4000; for (let i = 0; i < N; i++) s += rail(i / N * p.P, p); vdcKey = k; vdcVal = s / N; }
        return vdcVal;
      };
      const findTrigger = (disp, p, s, level, falling, lo, hi) => {
        if (level > hi || level < lo) return null;
        const end = s + 2.2 * p.P;
        let t = s, v = disp(t), prevAbove = v > level, guard = 0;
        while (t < end && guard++ < 150000) {
          const dt = Math.max(0.2e-6, Math.abs(v - level) / 2e5), tn = t + dt, vn = disp(tn), above = vn > level;
          if (above !== prevAbove) {
            if (falling ? !above : above) return t + (tn - t) * (level - v) / ((vn - v) || 1e-9);
            prevAbove = above;
          }
          t = tn; v = vn;
        }
        return null;
      };
      const loop = kit.loop((dt, tl) => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const p = { P: v.period / 1000, dip: v.dip }, ac = v.coupling === 'ac', off = ac ? dcMean(p) : 0;
        const disp = t => rail(t, p) - off;
        const lo = 3.3 - v.dip - 0.0175 - off, hi = 3.3 + 0.0175 - off;
        const span = 10 * v.tdiv;
        const tl2 = tl || 0, start = (tl2 * 0.0731) % (2 * p.P);
        const tt = findTrigger(disp, p, start, v.level, v.slope === 'fall', lo, hi);
        let t0 = null, status;
        if (tt != null) { t0 = tt - span / 2; lastT0 = t0; status = 'triggered on the ' + (v.slope === 'fall' ? 'falling' : 'rising') + ' edge at ' + volts(v.level); }
        else if (v.mode === 'auto') { t0 = (tl2 * 0.0371 + 1) % 5; status = 'AUTO: no trigger, the sweep free-runs and the picture drifts'; }
        else { t0 = lastT0; status = 'WAIT: nothing crosses ' + volts(v.level) + ' (Normal mode holds the last picture)'; }
        const sx = 12, sy = 8, sw = W - 24, sh = H - 44;
        const vcEff = ac ? 0 : v.vc;
        if (t0 != null) S.scope(c, sx, sy, sw, sh, { tdiv: v.tdiv, t0, traces: [{ fn: disp, vdiv: v.vdiv, offset: -vcEff / v.vdiv, label: 'CH1', unit: 'V' }] });
        else S.scope(c, sx, sy, sw, sh, { tdiv: v.tdiv, t0: 0, traces: [] });
        // the trigger level and the trigger point
        const ly = sy + sh / 2 - ((v.level - vcEff) / v.vdiv) * (sh / 8);
        c.save(); c.beginPath(); c.rect(sx, sy, sw, sh); c.clip();
        c.strokeStyle = '#ff9a4d'; c.lineWidth = 1.2; c.setLineDash([4, 4]);
        c.beginPath(); c.moveTo(sx, ly); c.lineTo(sx + sw, ly); c.stroke();
        if (tt != null) { c.strokeStyle = 'rgba(120,200,150,.7)'; c.beginPath(); c.moveTo(sx + sw / 2, sy); c.lineTo(sx + sw / 2, sy + sh); c.stroke(); }
        c.restore();
        kit.label(c, 'T', sx + sw - 8, clamp(ly, sy + 8, sy + sh - 8), { size: 11, weight: 700, color: '#ff9a4d', align: 'center' });
        if (t0 == null) kit.label(c, 'waiting for a trigger', sx + sw / 2, sy + sh / 2, { size: 14, weight: 700, color: '#9fd8b4', align: 'center' });
        // the numbers
        let mn = Infinity;
        if (t0 != null) for (let i = 0; i <= 800; i++) mn = Math.min(mn, disp(t0 + span * i / 800));
        ro.set('trig', status);
        ro.set('low', fin(mn) ? (ac ? kit.fmt(mn * 1000, 3) + ' mV (relative to the mean)' : volts(mn)) : 'nothing drawn');
        ro.set('dip', t0 == null ? 'not shown' : v.dip > 0.08 && mn < (ac ? -0.08 : 3.3 - 0.08) ? 'in view: about ' + kit.fmt(v.dip * 1000, 3) + ' mV deep' : 'not in view');
        ro.set('rate', kit.eng(Math.min(1e9, 1e6 / span), 'S/s') + ' (1 M points of memory)');
        void dt; void E;
      }, box.stage);
      st.onResize(() => { if (!loop.running) loop.once(); });
      loop.start();
    }
  });
  /* ================================================================ bi-probe */
  Hyper.sim('bi-probe', {
    title: 'A ×1 and a ×10 probe: loading and compensation',
    blurb: `A square wave of 3.3 V comes from a source with the **source resistance** you set, through the probe, into a scope input of 1 MΩ. The faint line is the signal as it is; the bold line is what the scope shows. The ×1 probe is a cable: 1 MΩ and about 100 pF. The ×10 probe is a divider of 9 MΩ with an adjustable **trimmer capacitor**; the scope multiplies the reading by ten.

**Try this**
- With the ×10 probe at 1 kHz the trimmer is set right (about 11 pF) and the corners are square. Turn it down: the corners round. Turn it up: spikes appear. This is *compensation*.
- Switch to ×1 and raise the frequency to 1 MHz with a 10 kΩ source: the cable's 100 pF rounds the wave into a ramp.
- Go back to ×10: the edges recover. A ×10 probe loads the circuit with about 10 pF.
- Make the source 1 MΩ: even ×10 reads low, because its 10 MΩ now matters.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, maxH: 460 });
      const CS = 100e-12, RIN = 1e6, RP = 9e6, C1 = 100e-12, R1 = 1e6, CPOK = CS * RIN / RP * 1e12;   // pF
      const ctl = kit.controls(box.side, [
        { id: 'probe', type: 'select', label: 'Probe', options: [['×10', 'x10'], ['×1', 'x1']], value: 'x10' },
        { id: 'f', label: 'Frequency of the square wave', min: 1e3, max: 2e7, log: true, sig: 2, value: 1e3, fmt: q => kit.eng(q, 'Hz') },
        { id: 'Rs', label: 'Source resistance', min: 10, max: 1e6, log: true, sig: 2, value: 1000, fmt: q => kit.eng(q, 'Ω') },
        { id: 'Cp', label: 'Trimmer capacitor of the ×10 probe', min: 4, max: 25, step: 0.1, value: Math.round(CPOK * 10) / 10, unit: 'pF' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['tip', 'Load at the probe tip'], ['rise', 'Rise time, 10 to 90 %'], ['bw', 'Bandwidth that implies'], ['amp', 'Amplitude shown'], ['verdict', 'Verdict']]);
      const simulate = v => {
        const T = 1 / v.f, N = 1500, per = N / 2.5, dt = 2.5 * T / N, warm = Math.round(per), Rs = v.Rs, g = 1 / Rs;
        const x10 = v.probe === 'x10', Cp = v.Cp * 1e-12;
        const pts = [], inp = [];
        let vs = 0, vp = 0, v1 = 0, yLow = 0;
        for (let k = -warm; k <= N; k++) {
          const t = k * dt, u = (((t % T) + T) % T) < T / 2 ? 3.3 : 0;
          let y;
          if (x10) {
            const a = dt / CS, b = dt / Cp, ks = 1 / (1 + a / RIN), kp = 1 / (1 + b / RP);
            const I = g * (u - ks * vs - kp * vp) / (1 + g * (ks * a + kp * b));
            vs = (vs + a * I) * ks; vp = (vp + b * I) * kp; y = 10 * vs;
          } else {
            const q = dt / (Rs * C1), r = dt / (R1 * C1);
            v1 = (v1 + q * u) / (1 + q + r); y = v1;
          }
          if (k === -1) yLow = y;
          if (k >= 0) { pts.push([t, y]); inp.push([t, u]); }
        }
        const half = Math.round(per / 2), yHigh = pts[half - 1][1];
        let rise = null;
        if (yHigh - yLow > 0.07) {
          const a10 = yLow + 0.1 * (yHigh - yLow), a90 = yLow + 0.9 * (yHigh - yLow);
          let t10 = null, t90 = null;
          for (let k = 1; k < half; k++) {
            if (t10 == null && pts[k][1] >= a10) t10 = pts[k - 1][0] + dt * (a10 - pts[k - 1][1]) / ((pts[k][1] - pts[k - 1][1]) || 1e-9);
            if (t90 == null && pts[k][1] >= a90) { t90 = pts[k - 1][0] + dt * (a90 - pts[k - 1][1]) / ((pts[k][1] - pts[k - 1][1]) || 1e-9); break; }
          }
          if (t10 != null && t90 != null) rise = Math.max(0, t90 - t10);
        }
        return { pts, inp, span: 2.5 * T, rise, amp: (yHigh - yLow) / 3.3, T };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const o = simulate(v), x10 = v.probe === 'x10';
        ctl.show('Cp', x10);
        const F = frame(kit, c, 52, 34, W - 52 - 20, H - 34 - 44, { x0: 0, x1: o.span, y0: -0.6, y1: 5, nx: 5, ny: 4, ylabel: 'volts', xlabel: 'time', xfmt: q => kit.eng(q, 's'), yfmt: q => q.toFixed(1) });
        trace(c, F, o.inp, C.muted, 1.4);
        trace(c, F, o.pts, C.accent, 2.6);
        kit.label(c, 'signal at the source', F.x + 8, F.y + 10, { size: 10.5, color: C.muted });
        kit.label(c, 'what the scope shows', F.x + 8, F.y + 25, { size: 10.5, color: C.accent, weight: 600 });
        const d = v.Cp - CPOK, ctip = v.Cp * 1e-12 * CS / (v.Cp * 1e-12 + CS) * 1e12;
        ro.set('tip', x10 ? '10 MΩ in parallel with ' + kit.fmt(ctip, 3) + ' pF' : '1 MΩ in parallel with 100 pF');
        ro.set('rise', o.rise == null ? 'slower than half a period (or too small to measure)' : kit.eng(o.rise, 's'));
        ro.set('bw', o.rise == null ? 'too slow to say' : kit.eng(0.35 / Math.max(o.rise, 1e-12), 'Hz'));
        ro.set('amp', kit.fmt(o.amp * 100, 3) + ' % of the true amplitude');
        ro.set('verdict', x10
          ? (Math.abs(d) < 0.4 ? 'Compensated: the corners are square.' : d < 0 ? 'Under-compensated: rounded corners, and high frequencies are shown too small.' : 'Over-compensated: a spike at every edge.')
          : 'A ×1 probe cannot be trimmed: its cable capacitance with the source resistance makes a low-pass of ' + (o.rise == null ? 'very low bandwidth.' : kit.eng(0.35 / Math.max(o.rise, 1e-12), 'Hz') + ' bandwidth.'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ bi-logic */
  Hyper.sim('bi-logic', {
    title: 'A logic analyser decoding a UART',
    blurb: `The ESP sends the three bytes **E S P** over a UART. The top row is the real line, with the analyser's **threshold** as a dashed line. The second row is what the analyser recorded, one sample at every tick below it, and the decoded characters. A wrong **sample rate**, **threshold** or **decoder baud rate** each breaks the decoding in a different way.

**Try this**
- With the defaults the text decodes as ESP: eight samples per bit at 1 MS/s and 115200 baud.
- Lower the sample rate to 300 kS/s, then 150 kS/s: the start edge is found late and later bits are misread; characters break.
- Choose a 1.8 V line and a threshold of 2 V: the analyser sees a flat zero. Choose 1.2 V and 0.5 V and it works again.
- Leave everything right and set the decoder's baud error to 6 %: the last bits of every byte fall in the wrong place.
- Pick 3 Mbaud: at 1 MS/s there is a third of a sample per bit, and nothing can be decoded.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, maxH: 480 });
      const MSG = [0x45, 0x53, 0x50];
      const ctl = kit.controls(box.side, [
        { id: 'baud', type: 'select', label: 'Baud rate of the ESP', options: [['9600', 9600], ['115200', 115200], ['921600', 921600], ['3 Mbaud', 3000000]], value: 115200 },
        { id: 'fs', label: 'Analyser sample rate', min: 2e4, max: 2.4e7, log: true, sig: 2, value: 1e6, fmt: q => kit.eng(q, 'S/s') },
        { id: 'level', type: 'select', label: 'Logic level of the line', options: [['1.2 V', 1.2], ['1.8 V', 1.8], ['3.3 V', 3.3], ['5 V', 5]], value: 3.3 },
        { id: 'thr', label: 'Analyser threshold', min: 0.3, max: 4.5, step: 0.05, value: 1.5, unit: 'V' },
        { id: 'derr', label: 'Decoder baud error', min: -10, max: 10, step: 0.5, value: 0, unit: '%' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['bit', 'One bit'], ['spb', 'Samples per bit'], ['dec', 'Decoded'], ['verdict', 'Verdict']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const Tb = 1 / v.baud, bits = [1];
        for (const b of MSG) { bits.push(0); for (let i = 0; i < 8; i++) bits.push((b >> i) & 1); bits.push(1, 1, 1); }
        bits.push(1);
        const win = bits.length * Tb, bitAt = t => bits[clamp(Math.floor(t / Tb), 0, bits.length - 1)];
        // the real line as a voltage trace
        const pts = [[0, bitAt(0) * v.level]];
        for (let i = 1; i < bits.length; i++) if (bits[i] !== bits[i - 1]) pts.push([i * Tb, bits[i - 1] * v.level], [i * Tb, bits[i] * v.level]);
        pts.push([win, bits[bits.length - 1] * v.level]);
        // the analyser: samples at fixed instants and compares them with the threshold
        const fs = v.fs, phi = 0.37 / fs, N = clamp(Math.floor(win * fs), 2, 150000), s = new Array(N);
        for (let k = 0; k < N; k++) s[k] = bitAt(phi + k / fs) * v.level > v.thr ? 1 : 0;
        const edges = [[-1, s[0]]];
        for (let k = 1; k < N; k++) if (s[k] !== s[k - 1]) edges.push([phi + k / fs, s[k]]);
        // the decoder: finds a falling edge, then reads each bit at its middle, by its own idea of the bit time
        const Td = 1 / (v.baud * (1 + v.derr / 100)), marks = [];
        let text = '', k = 1;
        while (k < N) {
          if (s[k - 1] === 1 && s[k] === 0) {
            const te = phi + k / fs;
            let val = 0;
            for (let i = 0; i < 8; i++) { const idx = Math.round((te + (1.5 + i) * Td - phi) * fs); val |= (idx < N ? s[idx] : 1) << i; }
            const idxS = Math.round((te + 9.5 * Td - phi) * fs), stop = idxS < N ? s[idxS] : 1;
            const ch = val >= 32 && val < 127 ? String.fromCharCode(val) : '0x' + val.toString(16).toUpperCase();
            marks.push({ t0: te, t1: te + 10 * Td, text: stop ? "'" + ch + "'" : 'ERR', color: stop ? undefined : (C.dark ? 'rgba(229,72,77,.45)' : 'rgba(200,40,50,.25)') });
            text += stop ? ch : '?';
            k = Math.max(k + 1, idxS + 1);
          } else k++;
        }
        // the picture
        const L = S.logic(c, 8, 8, W - 16, H - 16, [
          { label: 'line', pts, min: 0, max: 5.5, color: C.muted },
          { label: 'seen', edges, marks, color: C.accent }
        ], { t0: 0, t1: win, grid: 12, labelW: 46 });
        const p = L.plot, th = L.rowH * 0.5, ty = L.rowY(0);
        const yThr = ty + th - clamp(v.thr / 5.5, 0, 1) * th;
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.2; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(p.x, yThr); c.lineTo(p.x + p.w, yThr); c.stroke(); c.restore();
        kit.label(c, 'threshold ' + v.thr.toFixed(2) + ' V', p.x + p.w - 4, yThr - 7, { size: 10, color: C.warn, align: 'right' });
        const spb = fs / v.baud;
        if (spb <= 14) {
          const sy = L.rowY(1) + L.rowH * 0.5 + 6;
          for (let q = 0; q < N; q++) kit.dot(c, L.X(phi + q / fs), sy, 1.5, C.muted);
        }
        ro.set('bit', kit.eng(Tb, 's') + ' (' + kit.fmt(v.baud, 4) + ' baud)');
        ro.set('spb', kit.fmt(spb, 3));
        ro.set('dec', text.length ? text : 'nothing');
        ro.set('verdict', v.level <= v.thr ? 'The line never rises above the threshold: the analyser sees a flat zero.'
          : text === 'ESP' ? 'Decoded correctly, with about ' + kit.fmt(spb, 2) + ' samples to each bit.'
          : spb < 2 ? 'Fewer than two samples per bit: edges and bits are lost.'
          : Math.abs(v.derr) >= 3 ? 'The decoder\'s baud rate is off by ' + kit.fmt(Math.abs(v.derr), 2) + ' %: later bits fall in the wrong place.'
          : 'Too few samples per bit: the start edge is found up to one sample late and the later bits are misread.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ bi-profile */
  Hyper.sim('bi-profile', {
    title: 'One cycle, three instruments, three battery lives',
    blurb: `A node wakes, connects, sends and sleeps. The bars at the top are the current in each stage on a **log scale**, with the share of the **charge** each one uses. The bars at the bottom are the battery life that each instrument would lead you to predict for a 1000 mAh LiPo cell. The boot and connection currents are typical figures; the transmit and sleep currents come from the chip's catalogue entry.

**Try this**
- With the defaults, read where the charge goes: the wake stages use almost all of it although they last well under a second.
- Raise the *board sleep current* to 3 mA, as with a USB-serial chip and a power LED: the sleep floor now rules, and the USB meter becomes right.
- Lower it to 5 µA: a multimeter on the floor and the USB meter disagree wildly with the truth.
- Make the sleep interval 10 s, then 1 hour, and watch the shares change.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.78, maxH: 560 });
      const chips = E.CHIPS.filter(q => !q.coproc && q.wifi && q.txMa != null && q.sleepUa != null);
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(q => [q.name, q.id]), value: 'esp32' },
        { id: 'conn', label: 'Wi-Fi connection time', min: 100, max: 3000, step: 50, value: 600, unit: 'ms' },
        { id: 'sleep', label: 'Sleep interval', min: 10, max: 3600, log: true, sig: 2, value: 60, unit: 's' },
        { id: 'board', label: 'Board sleep current (all but the chip)', min: 1, max: 5000, log: true, sig: 2, value: 150, unit: 'µA' },
        { id: 'res', type: 'select', label: 'USB meter resolution', options: [['0.1 mA', 0.1], ['1 mA', 1], ['10 mA', 10]], value: 1 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['avg', 'True average current'], ['share', 'Charge used while awake'], ['dmm', 'Multimeter (reads the floor)'], ['usb', 'USB meter shows on average'], ['life', 'Battery life: true · multimeter · USB meter']]);
      const days = mA => (mA > 0 ? E.batteryLife(1000, mA, { cell: 'lipo-1000' }).days : null);
      const daysText = d => (d == null || !fin(d) ? 'unlimited' : d >= 700 ? kit.fmt(d / 365, 3) + ' years' : kit.fmt(d, 3) + ' days');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const ch = E.chip(v.chip) || E.chip('esp32');
        const sleepMa = (ch.sleepUa + v.board) / 1000;
        const ph = [
          { name: 'boot', s: 0.15, mA: 45 },
          { name: 'connect', s: v.conn / 1000, mA: ch.rxMa },
          { name: 'send', s: 0.02, mA: ch.txMa },
          { name: 'sleep', s: v.sleep, mA: sleepMa }
        ];
        const dc = E.dutyCycle(ph.map(q => ({ mA: q.mA, s: q.s })));
        const total = ph.reduce((a, q) => a + q.s, 0);
        const usb = ph.reduce((a, q) => a + q.s * Math.round(q.mA / v.res) * v.res, 0) / total;
        const dTrue = days(dc.avg), dDmm = days(sleepMa), dUsb = days(usb);
        // the stages
        const M = 52, pw = W - M - 16, ph0 = 30, phh = Math.max(120, H * 0.42), lo = 0.01, hi = 1000;
        const Y = m => ph0 + phh - clamp(Math.log(Math.max(m, lo) / lo) / Math.log(hi / lo), 0, 1) * phh;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let e = -2; e <= 3; e++) {
          const gy = Math.round(Y(Math.pow(10, e))) + 0.5;
          c.beginPath(); c.moveTo(M, gy); c.lineTo(M + pw, gy); c.stroke();
          kit.label(c, e >= 0 ? Math.pow(10, e) + ' mA' : Math.round(Math.pow(10, e + 3)) + ' µA', M - 6, gy, { size: 9.5, color: C.muted, align: 'right' });
        }
        kit.label(c, 'current in each stage', M, 14, { size: 11, weight: 600, color: C.text2 || C.text });
        const bw = pw / 4;
        ph.forEach((q, i) => {
          const x = M + i * bw + bw * 0.18, w = bw * 0.64, y = Y(q.mA);
          c.fillStyle = i === 3 ? kit.hue(210, 0.75) : [kit.hue(40, 0.8), kit.hue(200, 0.8), kit.hue(8, 0.85)][i];
          c.fillRect(x, y, w, ph0 + phh - y);
          kit.label(c, q.mA >= 1 ? kit.fmt(q.mA, 3) + ' mA' : kit.fmt(q.mA * 1000, 3) + ' µA', x + w / 2, y - 8, { size: 10.5, weight: 600, align: 'center' });
          kit.label(c, q.name, x + w / 2, ph0 + phh + 11, { size: 10.5, align: 'center', weight: 600 });
          kit.label(c, (q.s >= 1 ? kit.fmt(q.s, 3) + ' s' : Math.round(q.s * 1000) + ' ms') + ' · ' + kit.fmt(dc.share[i] * 100, 3) + ' %', x + w / 2, ph0 + phh + 25, { size: 9.5, color: C.muted, align: 'center' });
        });
        // the battery lives, on a log scale from 1 day to 10 000 days
        const by = ph0 + phh + 56, bx = M, bww = W - M - 16, Lx = d => bww * (d == null ? 1 : clamp(Math.log10(Math.max(d, 1)) / 4, 0, 1));
        kit.label(c, 'battery life each instrument predicts (1000 mAh LiPo, log scale)', bx, by - 12, { size: 11, weight: 600, color: C.text2 || C.text });
        [['profiler (true)', dTrue, C.ok], ['multimeter on the floor', dDmm, C.warn], ['USB meter', dUsb, C.warn]].forEach(([lab, d, col], i) => {
          const yy = by + i * 26;
          c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(bx, yy, bww, 18);
          c.fillStyle = col; c.fillRect(bx, yy, Lx(d), 18);
          kit.label(c, lab + ': ' + daysText(d), bx + 5, yy + 9.5, { size: 10.5, weight: 600, color: C.text });
        });
        const awake = 1 - dc.share[3];
        ro.set('avg', dc.avg >= 1 ? kit.fmt(dc.avg, 3) + ' mA' : kit.fmt(dc.avg * 1000, 3) + ' µA');
        ro.set('share', kit.fmt(awake * 100, 3) + ' % of the charge in ' + kit.fmt((total - v.sleep) / total * 100, 2) + ' % of the time');
        ro.set('dmm', sleepMa >= 1 ? kit.fmt(sleepMa, 3) + ' mA' : kit.fmt(sleepMa * 1000, 3) + ' µA');
        ro.set('usb', usb > 0 ? kit.fmt(usb, 3) + ' mA' : '0.000 A (everything rounded to zero)');
        ro.set('life', daysText(dTrue) + ' · ' + daysText(dDmm) + ' · ' + daysText(dUsb));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ bi-generator */
  Hyper.sim('bi-generator', {
    title: 'A function generator into an ESP pin: the 50 Ω trap',
    blurb: `A bench generator's panel assumes a **50 Ω load**. An ESP pin is a **high-impedance** input, and then the real amplitude and offset are **twice** the panel's figures. The shaded green band is what a 3.3 V GPIO accepts (0 to 3.3 V); the red bands are beyond what its protection diodes can take (below about −0.3 V and above about 3.6 V).

**Try this**
- The defaults are dangerous: 2 V peak to peak with 1 V offset reaches 4 V at a high-impedance pin.
- Switch the load to *50 Ω*: the wave shrinks to what the panel says.
- Make it a positive-only sine that fits: 1.6 V peak to peak, 0.8 V offset, into the high-impedance pin gives 0 to 3.2 V.
- Try the square wave and the triangle: the limits are about the peaks, not about the shape.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, maxH: 440 });
      const ctl = kit.controls(box.side, [
        { id: 'wave', type: 'select', label: 'Waveform', options: [['Sine', 'sine'], ['Square', 'square'], ['Triangle', 'tri']], value: 'sine' },
        { id: 'vpp', label: 'Amplitude set on the panel (peak to peak)', min: 0.2, max: 10, step: 0.1, value: 2, unit: 'V' },
        { id: 'off', label: 'Offset set on the panel', min: -5, max: 5, step: 0.1, value: 1, unit: 'V' },
        { id: 'load', type: 'select', label: 'What the generator drives', options: [['High-impedance input (an ESP pin)', 'hiz'], ['A 50 Ω load', 'r50']], value: 'hiz' },
        { id: 'f', label: 'Frequency', min: 1, max: 1e6, log: true, sig: 2, value: 1000, fmt: q => kit.eng(q, 'Hz') }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['pin', 'At the pin, lowest to highest'], ['factor', 'Real against the panel'], ['verdict', 'Verdict']]);
      const shape = (ph, w) => (w === 'sine' ? Math.sin(TAU * ph) : w === 'square' ? (ph < 0.5 ? 1 : -1) : (ph < 0.5 ? -1 + 4 * ph : 3 - 4 * ph));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const k = v.load === 'hiz' ? 2 : 1, A = k * v.vpp / 2, O = k * v.off;
        const vmin = O - A, vmax = O + A, y0 = Math.min(-1, Math.floor(vmin - 0.5)), y1 = Math.max(4.5, Math.ceil(vmax + 0.5));
        const T = 1 / v.f, F = frame(kit, c, 52, 30, W - 52 - 20, H - 30 - 44, { x0: 0, x1: 2 * T, y0, y1, nx: 4, ny: 5, ylabel: 'voltage at the pin (V)', xlabel: 'time', xfmt: q => kit.eng(q, 's'), yfmt: q => Number(q.toFixed(1)) + '' });
        // the safe window and the danger zones
        c.fillStyle = C.dark ? 'rgba(80,200,120,.16)' : 'rgba(40,160,80,.14)'; c.fillRect(F.x, F.Y(3.3), F.w, F.Y(0) - F.Y(3.3));
        c.fillStyle = C.dark ? 'rgba(229,72,77,.22)' : 'rgba(200,40,50,.14)';
        if (y1 > 3.6) c.fillRect(F.x, F.Y(y1), F.w, F.Y(3.6) - F.Y(y1));
        if (y0 < -0.3) c.fillRect(F.x, F.Y(-0.3), F.w, F.Y(y0) - F.Y(-0.3));
        hline(kit, c, F, 3.3, C.ok, '3.3 V', false);
        hline(kit, c, F, 0, C.ok, '0 V', true);
        const pts = [];
        for (let i = 0; i <= 400; i++) { const t = 2 * T * i / 400; pts.push([t, O + A * shape((t / T) % 1, v.wave)]); }
        trace(c, F, pts, vmax > 3.6 || vmin < -0.3 ? C.bad : C.accent, 2.6);
        const bad = vmax > 3.6 || vmin < -0.3;
        ro.set('pin', vmin.toFixed(2) + ' V to ' + vmax.toFixed(2) + ' V');
        ro.set('factor', v.load === 'hiz' ? '2 × the panel: nothing drops in the 50 Ω output resistance' : '1 ×: the generator sees its 50 Ω load');
        ro.set('verdict', bad ? 'Out of range: the clamp diodes would conduct and the pin or the chip may be damaged. Lower the amplitude and the offset.'
          : vmax > 3.3 || vmin < 0 ? 'Slightly outside 0 to 3.3 V: not logic-clean, but inside what the protection tolerates.'
          : 'Inside 0 to 3.3 V: safe for a GPIO or the ADC.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ bi-vna */
  Hyper.sim('bi-vna', {
    title: 'The match of a 2.4 GHz antenna, as a VNA shows it',
    blurb: `The curve is **S11**, the return loss of the antenna against frequency, drawn as a VNA draws it: the deeper the dip, the less power is reflected. The shaded band is the 2.4 GHz Wi-Fi and Bluetooth band, 2400 to 2483.5 MHz. The dashed line at −10 dB is the usual limit of a usable match (VSWR of about 2).

The antenna is a simple resonator: its **length** sets the resonant frequency, its **resistance at resonance** sets how deep the dip can go (50 Ω is a perfect match to the 50 Ω cable), and the **sharpness** sets how wide the dip is.

**Try this**
- Shorten the antenna by 5 %: the dip moves up in frequency and leaves the band.
- Choose *A hand near it* or *Against a metal plate*: the environment moves and changes the dip. A match measured on a bare board does not hold in the product.
- Raise the sharpness to 40: the dip is deep but narrow, and the band edges fall outside −10 dB.
- Set the resistance to 25 Ω: even at resonance the dip stays shallow.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, maxH: 440 });
      const ENV = { air: [1, 1, 'In free air'], hand: [0.94, 0.6, 'A hand near it'], case: [0.97, 1, 'In a plastic case'], metal: [0.88, 0.4, 'Against a metal plate'] };
      const ctl = kit.controls(box.side, [
        { id: 'len', label: 'Antenna length compared with the design', min: -15, max: 15, step: 0.5, value: 0, unit: '%' },
        { id: 'env', type: 'select', label: 'Surroundings', options: Object.keys(ENV).map(k => [ENV[k][2], k]), value: 'air' },
        { id: 'R', label: 'Resistance at resonance', min: 20, max: 120, step: 1, value: 50, unit: 'Ω' },
        { id: 'Q', label: 'Sharpness of the resonance', min: 4, max: 40, step: 1, value: 14 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['dip', 'Deepest point'], ['mid', 'At 2.44 GHz'], ['bw', 'Below −10 dB'], ['verdict', 'Verdict']]);
      const model = v => {
        const e = ENV[v.env] || ENV.air, f0 = 2440 * e[0] / (1 + v.len / 100), R = v.R * e[1];
        // |Γ| of a series R-L-C resonance in a 50 Ω system; f in MHz
        const gamma = f => { const X = v.Q * R * (f / f0 - f0 / f), a = (R - 50) * (R - 50) + X * X, b = (R + 50) * (R + 50) + X * X; return Math.sqrt(a / b); };
        return { f0, R, gamma, db: f => 20 * Math.log10(Math.max(gamma(f), 0.01)) };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H, m = model(v);
        const F = frame(kit, c, 52, 30, W - 52 - 20, H - 30 - 44, { x0: 2000, x1: 3000, y0: -30, y1: 0, nx: 5, ny: 6, ylabel: 'S11 (dB)', xlabel: 'frequency (MHz)', xfmt: q => String(Math.round(q)), yfmt: q => String(Math.round(q)) });
        c.fillStyle = C.dark ? 'rgba(123,140,255,.16)' : 'rgba(60,90,220,.10)'; c.fillRect(F.X(2400), F.y, F.X(2483.5) - F.X(2400), F.h);
        kit.label(c, 'Wi-Fi and Bluetooth band', F.X(2441.75), F.y + 10, { size: 10, color: C.muted, align: 'center' });
        hline(kit, c, F, -10, C.warn, '−10 dB', true);
        const pts = []; let best = [2000, 0], below = [];
        for (let f = 2000; f <= 3000; f += 2.5) { const d = m.db(f); pts.push([f, d]); if (d < best[1] || best[1] === 0) best = [f, d]; if (d < -10) below.push(f); }
        trace(c, F, pts, C.accent, 2.8);
        kit.dot(c, F.X(best[0]), F.Y(best[1]), 4.5, C.accent, C.bg2);
        const g = m.gamma(2440), swr = (1 + g) / (1 - g), refl = g * g * 100, loss = -10 * Math.log10(1 - g * g);
        const dEdge = Math.max(m.db(2400), m.db(2483.5), m.db(2441.75));
        ro.set('dip', kit.fmt(best[0], 4) + ' MHz, ' + kit.fmt(best[1], 3) + ' dB');
        ro.set('mid', kit.fmt(20 * Math.log10(Math.max(g, 0.01)), 3) + ' dB · VSWR ' + kit.fmt(swr, 3) + ' · ' + kit.fmt(refl, 3) + ' % reflected · mismatch loss ' + kit.fmt(loss, 2) + ' dB');
        ro.set('bw', below.length ? kit.fmt(below[0], 4) + ' to ' + kit.fmt(below[below.length - 1], 4) + ' MHz' : 'nowhere: no usable match');
        ro.set('verdict', dEdge < -10 ? 'Matched across the whole band.'
          : m.db(2441.75) < -10 ? 'Matched at the middle of the band but not at its edges: retune or widen the resonance.'
          : below.length ? 'The match is good at ' + kit.fmt(best[0], 4) + ' MHz, outside the band: retune the antenna.' : 'No usable match: the antenna is badly mistuned or lossy.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ bi-reflow */
  Hyper.sim('bi-reflow', {
    title: 'A soldering profile: preheat, soak, reflow, cool',
    blurb: `The dashed line is the **set temperature** of a reflow oven or hot plate. The bold line is the **board** as a thermocouple would read it: it follows the set temperature with a **thermal lag** (a small module follows fast, a large board with a ground plane slowly). The joint melts only while the board is above the **liquidus**, the melting point of the alloy.

The limits used here are typical, not those of your paste or your module: a **peak** under about 260 °C for most parts, a **time above liquidus** of 30 to 90 seconds, and a heating rate under about 3 °C per second. Read the datasheets of the paste and the part.

**Try this**
- With the defaults the profile passes: SAC305 with a 245 °C setpoint.
- Lower the setpoint to 225 °C: the board never melts the solder, or only briefly, and the joints are cold.
- Raise it to 280 °C: the parts are over their limit.
- Raise the heating rate to 5 °C/s with a long lag, or shorten the lag, and watch the slope.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, maxH: 460 });
      const ALLOYS = [['Lead-free SAC305 (melts at 217 °C)', 217], ['Tin-lead Sn63/Pb37 (melts at 183 °C)', 183], ['Low-temperature tin-bismuth (melts at 138 °C)', 138]];
      const ctl = kit.controls(box.side, [
        { id: 'liq', type: 'select', label: 'Solder', options: ALLOYS, value: 217 },
        { id: 'soak', label: 'Soak temperature', min: 100, max: 200, step: 5, value: 150, unit: '°C' },
        { id: 'soakt', label: 'Soak time', min: 20, max: 120, step: 5, value: 80, unit: 's' },
        { id: 'ramp', label: 'Heating rate of the setpoint', min: 0.5, max: 5, step: 0.1, value: 2, unit: '°C/s' },
        { id: 'peak', label: 'Peak setpoint', min: 150, max: 290, step: 1, value: 245, unit: '°C' },
        { id: 'dwell', label: 'Time at the peak setpoint', min: 0, max: 60, step: 1, value: 20, unit: 's' },
        { id: 'tau', label: 'Thermal lag of the board', min: 3, max: 40, step: 1, value: 12, unit: 's' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['peak', 'Peak of the board'], ['tal', 'Time above liquidus'], ['slope', 'Fastest heating of the board'], ['verdict', 'Verdict']]);
      const profile = v => {
        const T0 = 25, seg = [], pushRamp = (to, rate) => { const last = seg.length ? seg[seg.length - 1][1] : T0, d = Math.abs(to - last) / rate; seg.push([d, to]); };
        seg.push([0, T0]);
        pushRamp(v.soak, v.ramp); seg.push([v.soakt, v.soak]); pushRamp(v.peak, v.ramp); seg.push([v.dwell, v.peak]); pushRamp(T0, 4);
        // the setpoint as a function of time
        let tEnd = 0; const knots = [[0, T0]];
        for (let i = 1; i < seg.length; i++) { tEnd += seg[i][0]; knots.push([tEnd, seg[i][1]]); }
        const setp = t => { for (let i = 1; i < knots.length; i++) if (t <= knots[i][0]) { const a = knots[i - 1], b = knots[i], d = b[0] - a[0]; return d > 0 ? a[1] + (b[1] - a[1]) * (t - a[0]) / d : b[1]; } return T0; };
        const board = [], sp = []; let T = T0, maxSlope = 0, peak = T0, tal = 0, first = null, last = null;
        const dt = 0.25, tMax = tEnd + 30;
        for (let t = 0; t <= tMax; t += dt) {
          const s = setp(t), dT = (s - T) / v.tau * dt;
          T += dT; if (t < tEnd * 0.9) maxSlope = Math.max(maxSlope, dT / dt);
          peak = Math.max(peak, T);
          if (T > v.liq) { tal += dt; if (first == null) first = t; last = t; }
          if (Math.round(t / dt) % 4 === 0) { board.push([t, T]); sp.push([t, s]); }
        }
        return { board, sp, tMax, peak, tal, maxSlope };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H, o = profile(v);
        const F = frame(kit, c, 52, 30, W - 52 - 20, H - 30 - 44, { x0: 0, x1: o.tMax, y0: 0, y1: 300, nx: 6, ny: 6, ylabel: 'temperature (°C)', xlabel: 'time (s)', xfmt: q => String(Math.round(q)), yfmt: q => String(Math.round(q)) });
        c.fillStyle = C.dark ? 'rgba(255,170,60,.12)' : 'rgba(230,140,20,.10)'; c.fillRect(F.x, F.Y(300), F.w, F.Y(v.liq) - F.Y(300));
        hline(kit, c, F, v.liq, C.warn, 'solder melts: ' + v.liq + ' °C', true);
        hline(kit, c, F, 260, C.bad, 'typical parts limit 260 °C', false);
        trace(c, F, o.sp, C.muted, 1.6);
        trace(c, F, o.board, C.accent, 2.8);
        kit.label(c, 'set temperature', F.x + 8, F.y + 10, { size: 10.5, color: C.muted });
        kit.label(c, 'board (thermocouple)', F.x + 8, F.y + 25, { size: 10.5, color: C.accent, weight: 600 });
        const tooHot = o.peak > 260, cold = o.tal < 0.5, shortTal = o.tal < 30, longTal = o.tal > 90, fast = o.maxSlope > 3;
        ro.set('peak', kit.fmt(o.peak, 4) + ' °C');
        ro.set('tal', kit.fmt(o.tal, 3) + ' s');
        ro.set('slope', kit.fmt(o.maxSlope, 2) + ' °C/s');
        ro.set('verdict', cold ? 'Cold joints: the board never reaches the melting point.'
          : tooHot ? 'Too hot: the peak is above about 260 °C and parts may be damaged.'
          : shortTal ? 'The solder is molten for under 30 s: poor wetting is likely.'
          : longTal ? 'Molten for over 90 s: flux burns off and brittle layers grow.'
          : fast ? 'Heating faster than about 3 °C/s: a risk of thermal shock and tombstoning.'
          : 'Inside a typical window: ' + kit.fmt(o.tal, 3) + ' s above liquidus, a peak of ' + kit.fmt(o.peak, 4) + ' °C.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ bi-esd */
  Hyper.sim('bi-esd', {
    title: 'A static discharge: the human-body model',
    blurb: `A person charged by walking or handling plastic carries a voltage that depends on the surface and, strongly, on the **humidity**. The figures are typical handbook values for dry (10 % relative humidity) and humid (65 %) air, which is why winter is the bad season. Touching a pin discharges the body's 100 pF through about 1.5 kΩ (the **human-body model**): the peak current is V / 1.5 kΩ and it decays in about 150 ns. Above roughly 8 kV real discharges arc through the air before the touch, so the largest figures show scale, not a test.

**Try this**
- *Walking across a carpet* at 10 % humidity: tens of kilovolts, and a peak current of many amps.
- Raise the humidity to 65 %: the voltage falls by more than a factor of ten.
- Tick **wrist strap and mat**: the charge drains away and the voltage never builds.
- Press *Touch a pin* and read the peak and the energy; compare the voltage with the part's rating.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.74, maxH: 520 });
      const SURF = { carpet: [35000, 1500, 'Walking across a carpet'], vinyl: [12000, 250, 'Walking on a vinyl floor'], bench: [6000, 100, 'Working at a bench with plastics'], bag: [20000, 1200, 'Picking up a plastic bag'] };
      let anim = 9;                                            // seconds into the discharge animation; 9 = finished
      const ctl = kit.controls(box.side, [
        { id: 'surf', type: 'select', label: 'What charges the person', options: Object.keys(SURF).map(k => [SURF[k][2], k]), value: 'carpet' },
        { id: 'rh', label: 'Relative humidity of the air', min: 10, max: 80, step: 1, value: 20, unit: '%' },
        { id: 'strap', type: 'check', label: 'Wrist strap and mat', value: false },
        { id: 'rate', type: 'select', label: 'HBM rating of the part', options: [['250 V', 250], ['500 V', 500], ['1000 V', 1000], ['2000 V', 2000]], value: 2000 },
        { type: 'buttons', items: [{ id: 'touch', label: 'Touch a pin', primary: true }] }
      ], id => { if (id === 'touch') { anim = 0; loop.start(); } else loop.once(); });
      const ro = kit.readout(box.side, [['v', 'Voltage of the person'], ['i', 'Peak current'], ['e', 'Energy of the discharge'], ['feel', 'Can you feel it?'], ['verdict', 'Verdict']]);
      const bodyV = v => {
        const s = SURF[v.surf] || SURF.carpet, u = clamp((v.rh - 10) / 55, 0, 1);
        const V = Math.exp(Math.log(s[0]) * (1 - u) + Math.log(s[1]) * u);
        return v.strap ? Math.min(V, 5) : V;
      };
      const loop = kit.loop((dt) => {
        if (anim < 9) { anim += dt; if (anim >= 1.4) { anim = 9; loop.stop(); } }
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H, V = bodyV(v), R = 1500, CB = 100e-12, tau = R * CB;
        const Ipk = V / R, E = 0.5 * CB * V * V, ymaxA = Math.max(0.2, Math.pow(10, Math.ceil(Math.log10(Ipk * 1.05 + 1e-9) * 2) / 2));
        // the current pulse
        const gh = Math.max(110, H * 0.5), F = frame(kit, c, 56, 30, W - 56 - 20, gh, { x0: 0, x1: 600e-9, y0: 0, y1: ymaxA, nx: 6, ny: 4, ylabel: 'current of the discharge (A)', xlabel: 'time after the touch', xfmt: q => kit.eng(q, 's'), yfmt: q => kit.fmt(q, 2) });
        const pts = [], upto = anim >= 9 ? 600e-9 : 600e-9 * anim / 1.4;
        for (let i = 0; i <= 120; i++) { const t = 600e-9 * i / 120; if (t <= upto) pts.push([t, Ipk * Math.exp(-t / tau)]); }
        c.save(); c.globalAlpha = 0.18; c.fillStyle = C.bad;
        if (pts.length > 1) { c.beginPath(); c.moveTo(F.X(0), F.Y(0)); pts.forEach(p => c.lineTo(F.X(p[0]), F.Y(p[1]))); c.lineTo(F.X(pts[pts.length - 1][0]), F.Y(0)); c.closePath(); c.fill(); }
        c.restore();
        trace(c, F, pts, C.bad, 2.6);
        kit.label(c, 'peak ' + kit.fmt(Ipk, 3) + ' A, decays with 150 ns', F.x + F.w - 6, F.y + 12, { size: 10.5, color: C.bad, align: 'right' });
        // the voltage against the part's rating, on a log scale from 10 V to 50 kV
        const by = F.y + gh + 58, bw = W - 76, bx = 46, L = q => bw * clamp(Math.log10(Math.max(q, 10) / 10) / Math.log10(5000), 0, 1);
        kit.label(c, 'voltage of the person (log scale)', bx, by - 14, { size: 11, weight: 600, color: C.text2 || C.text });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(bx, by, bw, 18);
        c.fillStyle = V > v.rate ? C.bad : V > v.rate / 2 ? C.warn : C.ok; c.fillRect(bx, by, L(V), 18);
        for (const [lv, lab, col] of [[v.rate, 'part rating', C.bad], [3000, 'you can feel it', C.muted]]) {
          const lx = bx + L(lv); c.strokeStyle = col; c.lineWidth = 1.6; c.beginPath(); c.moveTo(lx, by - 3); c.lineTo(lx, by + 21); c.stroke();
          kit.label(c, lab, lx, by + 33, { size: 9.5, color: col, align: 'center' });
        }
        kit.label(c, kit.fmt(V, 3) + ' V', bx + Math.min(bw - 30, L(V) + 4), by + 9.5, { size: 10.5, weight: 700, color: V > 50 ? '#fff' : C.text });
        ro.set('v', V >= 1000 ? kit.fmt(V / 1000, 3) + ' kV' : kit.fmt(V, 3) + ' V');
        ro.set('i', kit.fmt(Ipk, 3) + ' A for about 150 ns');
        ro.set('e', E >= 1e-3 ? kit.fmt(E * 1000, 3) + ' mJ' : kit.fmt(E * 1e6, 3) + ' µJ');
        ro.set('feel', V >= 3000 ? 'Yes: a spark you notice' : 'No: below about 3 kV a person feels nothing');
        ro.set('verdict', V < 100 ? 'Grounded through the strap: the charge drains away before it can build up.'
          : V > v.rate ? 'The discharge is ' + kit.fmt(V / v.rate, 3) + ' times the part\'s rating: damage is likely, or may show up later.'
          : V > v.rate / 2 ? 'Close to the rating: repeated discharges add up.'
          : 'Inside the rating, but repeated stress still wears a part.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
