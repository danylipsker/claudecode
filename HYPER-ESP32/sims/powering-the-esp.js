/* HYPER-ESP32 · sims/powering-the-esp.js
 *
 * The simulations of the topic "Powering the ESP" (every id starts with pw-):
 *
 *   pw-burst        the 3.3 V rail during a transmit burst: supply, resistance, capacitor, brownout threshold
 *   pw-regulators   efficiency of an LDO and a buck converter against the load, with heat and input current
 *   pw-lipo         a lithium discharge curve with the ADC reading and the estimated charge
 *   pw-charge       a constant-current / constant-voltage charge, with a load across the cell if you like
 *   pw-cells        AA and coin cells: how much of their capacity the chip can use, with a capacitor or a converter
 *   pw-solar        a panel and a cell over three days: harvest against consumption
 *   pw-meter        a current meter in series: burden voltage, and what the display shows against the true waveform
 *
 * Numbers come from the catalogue (currents, supply range) and the engine (lithium curve, hold-up charge, battery life).
 * The supply and cell models are schematic: the blurbs say so.
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const fin = (v, d) => (Number.isFinite(v) ? v : d || 0);

  /* ---------------------------------------------------------------- a small graph kit */
  function ticks(a, b, n) {
    const st = Hyper.niceStep(b - a, n || 5), out = [];
    for (let v = Math.ceil(a / st - 1e-9) * st, k = 0; v <= b + st * 1e-9 && k < 40; v += st, k++) out.push(Math.abs(v) < st * 1e-9 ? 0 : v);
    return out;
  }
  function decades(a, b) {
    const out = [];
    for (let e = Math.ceil(Math.log10(a) - 1e-9), k = 0; Math.pow(10, e) <= b * (1 + 1e-9) && k < 20; e++, k++) out.push(Math.pow(10, e));
    return out;
  }
  /* background, grid, tick labels and titles of a graph; returns the data -> pixel mappings.
     o: { x0, x1, y0, y1, logx, nx, ny, xfmt, yfmt, xlabel, ylabel, right: { y0, y1, fmt, label } } */
  function frame(kit, c, x, y, w, h, o) {
    const C = kit.colors(), lx = !!o.logx;
    const tx = v => (lx ? Math.log10(Math.max(v, 1e-12)) : v);
    const X = v => x + (tx(v) - tx(o.x0)) / (tx(o.x1) - tx(o.x0)) * w;
    const Y = v => y + h - (v - o.y0) / (o.y1 - o.y0) * h;
    c.save();
    c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.035)';
    c.fillRect(x, y, w, h);
    c.strokeStyle = C.grid; c.lineWidth = 1;
    const xt = lx ? decades(o.x0, o.x1) : ticks(o.x0, o.x1, o.nx || 6);
    const yt = ticks(o.y0, o.y1, o.ny || 4);
    c.beginPath();
    for (const v of xt) { const px = Math.round(X(v)) + 0.5; c.moveTo(px, y); c.lineTo(px, y + h); }
    for (const v of yt) { const py = Math.round(Y(v)) + 0.5; c.moveTo(x, py); c.lineTo(x + w, py); }
    c.stroke();
    c.strokeStyle = C.axis;
    c.beginPath(); c.moveTo(x + 0.5, y); c.lineTo(x + 0.5, y + h + 0.5); c.lineTo(x + w, y + h + 0.5); c.stroke();
    c.restore();
    const xf = o.xfmt || (v => kit.fmt(v, 3)), yf = o.yfmt || (v => kit.fmt(v, 3));
    for (const v of xt) kit.label(c, xf(v), X(v), y + h + 11, { size: 10, color: C.muted, align: 'center' });
    for (const v of yt) kit.label(c, yf(v), x - 5, Y(v), { size: 10, color: C.muted, align: 'right' });
    if (o.xlabel) kit.label(c, o.xlabel, x + w, y + h + 25, { size: 10.5, color: C.text2, align: 'right' });
    if (o.ylabel) kit.label(c, o.ylabel, x, y - 8, { size: 10.5, color: C.text2 });
    let YR = null;
    if (o.right) {
      YR = v => y + h - (v - o.right.y0) / (o.right.y1 - o.right.y0) * h;
      for (const v of ticks(o.right.y0, o.right.y1, o.ny || 4)) kit.label(c, (o.right.fmt || (q => kit.fmt(q, 3)))(v), x + w + 5, YR(v), { size: 10, color: o.right.color || C.muted });
      if (o.right.label) kit.label(c, o.right.label, x + w, y - 8, { size: 10.5, color: o.right.color || C.text2, align: 'right' });
    }
    return { X, Y, YR, x, y, w, h };
  }
  /* a polyline through [[x, y], …] in data units; clipped to the frame */
  function trace(c, F, pts, color, width, dash) {
    c.save();
    c.beginPath(); c.rect(F.x, F.y - 2, F.w, F.h + 4); c.clip();
    c.strokeStyle = color; c.lineWidth = width || 2; c.lineJoin = 'round';
    if (dash) c.setLineDash(dash);
    c.beginPath();
    let on = false;
    for (const p of pts) {
      if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) { on = false; continue; }
      const px = F.X(p[0]), py = F.Y(p[1]);
      if (on) c.lineTo(px, py); else { c.moveTo(px, py); on = true; }
    }
    c.stroke();
    c.restore();
  }
  /* a horizontal reference line across a frame, with its label at the right end */
  function hline(kit, c, F, v, color, text, above) {
    const py = F.Y(v);
    if (!(py >= F.y - 1 && py <= F.y + F.h + 1)) return;
    c.save(); c.strokeStyle = color; c.lineWidth = 1.4; c.setLineDash([5, 4]);
    c.beginPath(); c.moveTo(F.x, py); c.lineTo(F.x + F.w, py); c.stroke(); c.restore();
    if (text) kit.label(c, text, F.x + F.w - 4, py + (above ? -8 : 9), { size: 10, color, align: 'right' });
  }
  function vline(kit, c, F, v, color, text) {
    const px = F.X(v);
    if (!(px >= F.x - 1 && px <= F.x + F.w + 1)) return;
    c.save(); c.strokeStyle = color; c.lineWidth = 1.4; c.setLineDash([4, 4]);
    c.beginPath(); c.moveTo(px, F.y); c.lineTo(px, F.y + F.h); c.stroke(); c.restore();
    if (text) kit.label(c, text, px + 4, F.y + 9, { size: 10, color });
  }
  const volts = v => (Number.isFinite(v) ? v.toFixed(2) + ' V' : '—');
  /* an interpolated table [[x, y], …] sorted by x */
  function interp(T, x) {
    if (x <= T[0][0]) return T[0][1];
    for (let i = 1; i < T.length; i++) if (x <= T[i][0]) { const f = (x - T[i - 1][0]) / (T[i][0] - T[i - 1][0] || 1); return T[i - 1][1] + f * (T[i][1] - T[i - 1][1]); }
    return T[T.length - 1][1];
  }

  /* ================================================================ pw-burst */
  /* the supplies: source voltage (before any regulator), series resistance upstream (cable, contacts, cell), the regulator
     (dropout in volts, how fast it can follow a load step), and a typical capacitor at the module */
  const SUPPLY = {
    bench: { name: 'Bench supply 3.3 V, short leads', vs: 3.3, rs: 0.05, reg: 'none', c: 10 },
    usb: { name: 'USB 5 V, good cable, AMS1117 on the board', vs: 5.0, rs: 0.3, reg: 'ams', c: 10 },
    'usb-thin': { name: 'USB 4.75 V, long thin cable and hub, AMS1117', vs: 4.75, rs: 1.6, reg: 'ams', c: 10 },
    lipo: { name: 'LiPo cell 3.7 V, low-dropout regulator', vs: 3.7, rs: 0.25, reg: 'ldo', c: 10 },
    'lipo-ams': { name: 'LiPo cell 3.7 V, AMS1117', vs: 3.7, rs: 0.25, reg: 'ams', c: 10 },
    aa2: { name: '2 × AA alkaline, half used, direct', vs: 2.9, rs: 1.0, reg: 'none', c: 10 },
    coin: { name: 'CR2032 coin cell, direct', vs: 2.9, rs: 18, reg: 'none', c: 10, idle: 'sleep' }
  };
  const REG = {
    none: { name: 'no regulator', dropout: 0, g: 0, tau: 0, imax: 0 },
    ams: { name: 'AMS1117 (LDO)', dropout: 1.1, g: 3, tau: 30e-6, imax: 1.0 },
    ldo: { name: 'low-dropout LDO', dropout: 0.2, g: 4, tau: 20e-6, imax: 1.0 }
  };

  Hyper.sim('pw-burst', {
    title: 'The rail during a transmit burst',
    blurb: `The chip listens at its receive current and now and then **transmits**: the rail has to follow. The top graph is the current; the bottom one is the 3.3 V rail **at the module**. The dashed lines are the 3.0 V floor of the supply range and the brownout threshold at which the chip resets itself.

The model is schematic: a source with a series resistance (cable, contacts, cell), an optional regulator that needs tens of microseconds to follow a load step, and a capacitor at the module. The chip's currents come from the catalogue.

**Try this**
- On *USB, long thin cable* drag the **series resistance** up: the rail sags by I × R until it breaks the 3.0 V floor, then the brownout line.
- Choose *LiPo, AMS1117*: even before the burst the rail sits below 3.0 V, because the regulator is in dropout. Swap to *low-dropout* and watch the rail return.
- Raise the **capacitor**: the fast dip at the start of each burst shrinks (a bigger capacitor helps, but never fixes a source that is too weak).
- Choose the *coin cell*, with the chip asleep between bursts: nothing helps except a very large capacitor and a short burst. The later bursts show what happens when they come too close together for the cell to refill the capacitor.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.92, maxH: 640 });
      const chips = ['esp32', 'esp32-s2', 'esp32-s3', 'esp32-c3', 'esp32-c6', 'esp8266'].filter(id => E.chip(id) && E.chip(id).txMa);
      const first = SUPPLY[params.supply] ? params.supply : 'usb';
      const P0 = SUPPLY[first];
      const chip0 = chips.includes(params.chip) ? params.chip : 'esp32-s3';
      const ctl = kit.controls(box.side, [
        { id: 'supply', type: 'select', label: 'Supply', options: Object.keys(SUPPLY).map(k => [SUPPLY[k].name, k]), value: first },
        { id: 'vs', label: 'Source voltage', min: 1.8, max: 5.5, step: 0.05, value: P0.vs, unit: 'V' },
        { id: 'rs', label: 'Series resistance (cable, contacts, cell)', min: 0.02, max: 50, log: true, sig: 2, value: P0.rs, unit: 'Ω' },
        { id: 'c', label: 'Capacitor at the module', min: 0.1, max: 4700, log: true, sig: 2, value: params.cap != null ? params.cap : P0.c, unit: 'µF' },
        { id: 'idle', type: 'select', label: 'Between bursts the chip', options: [['listens (receive current)', 'rx'], ['sleeps (deep-sleep current)', 'sleep']], value: params.idle || P0.idle || 'rx' },
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(id => [E.chip(id).name, id]), value: chip0 },
        { id: 'tb', label: 'Burst length', min: 0.2, max: 6, step: 0.1, value: 2, unit: 'ms' },
        { id: 'bod', type: 'select', label: 'Brownout threshold', options: [['2.43 V (typical default)', 2.43], ['2.6 V', 2.6], ['2.8 V', 2.8]], value: 2.43 }
      ], (id, v) => {
        if (id === 'supply') { const p = SUPPLY[v]; ctl.set('vs', p.vs); ctl.set('rs', p.rs); ctl.set('c', p.c); ctl.set('idle', p.idle || 'rx'); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['vmin', 'Lowest rail voltage, first burst'], ['idle', 'Rail just before the first burst'], ['dip', 'Dip'], ['verdict', 'Verdict'], ['charge', 'Extra charge in one burst'], ['cap', 'Capacitor to carry it alone (0.3 V)']]);

      const T = 0.024, DT = 1e-6, STARTS = [0.002, 0.012, 0.022];
      let cacheKey = '', cacheRun = null;
      const simulate = q => {                       // the run only changes when a control does
        const key = JSON.stringify(q);
        if (key !== cacheKey) { cacheRun = simulateNow(q); cacheKey = key; }
        return cacheRun;
      };
      /* the whole run, from the model: -> { t[], v[], i[], vmin, idle } sampled every 25 µs */
      function simulateNow(q) {
        const reg = REG[q.reg], C = Math.max(q.c, 1e-9), rs = Math.max(q.rs, 1e-3);
        const loadAt = t => {
          let on = 0;
          for (const s0 of STARTS) {
            const a = clamp((t - s0) / 5e-6, 0, 1), b = clamp((t - (s0 + q.tb)) / 5e-6, 0, 1);
            on = Math.max(on, a * (1 - b));
          }
          return q.base + (q.burst - q.base) * on;
        };
        const out = { t: [], v: [], i: [], vmin: 9, idle: 0 };
        let V, Ireg = q.base;
        const vset = I => Math.min(3.3, q.vs - I * rs - reg.dropout);
        V = q.reg === 'none' ? q.vs - rs * q.base : vset(q.base);
        const n = Math.round(T / DT);
        for (let k = 0; k <= n; k++) {
          const t = k * DT, Il = loadAt(t);
          if (q.reg === 'none') {
            const Vt = q.vs - rs * Il;
            V = Vt + (V - Vt) * Math.exp(-DT / (rs * C));
          } else {
            const Icmd = Il + reg.g * (vset(Ireg) - V);
            Ireg += (Icmd - Ireg) / reg.tau * DT;
            Ireg = clamp(Ireg, 0, reg.imax);
            V += (Ireg - Il) / C * DT;
          }
          V = clamp(fin(V, 0), 0, 6);
          if (t > 0.001 && t < 0.011 && V < out.vmin) out.vmin = V;
          if (k === 1900) out.idle = V;
          if (k % 25 === 0) { out.t.push(t * 1000); out.v.push(V); out.i.push(Il * 1000); }
        }
        return out;
      }

      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const v = ctl.values, chip = E.chip(v.chip), preset = SUPPLY[v.supply] || SUPPLY.usb;
        const base = v.idle === 'sleep' ? Math.max(chip.sleepUa || 10, 1) / 1e6 : (chip.rxMa || 80) / 1000, burst = (chip.txMa || 300) / 1000;
        const floor = chip.vdd ? chip.vdd[0] : 3.0;
        const run = simulate({ reg: preset.reg, vs: v.vs, rs: v.rs, c: v.c * 1e-6, base, burst, tb: v.tb / 1000 });
        // the picture of the chain
        const M = 58, W = st.W - M - 16, bw = (W - 3 * 22) / 4, by = 6, bh = 42;
        const boxes = [
          { label: volts(v.vs), sub: 'through ' + kit.eng(v.rs, 'Ω'), color: kit.hue(30) },
          { label: REG[preset.reg].name, sub: preset.reg === 'none' ? '' : 'dropout ' + REG[preset.reg].dropout + ' V', color: preset.reg === 'none' ? C.faint : kit.hue(212), dash: preset.reg === 'none' },
          { label: kit.eng(v.c * 1e-6, 'F'), sub: 'at the module', color: kit.hue(150) },
          { label: chip.name, sub: chip.rxMa + ' mA · ' + chip.txMa + ' mA', color: kit.hue(280), active: true }
        ];
        boxes.forEach((b, i) => {
          const x = M + i * (bw + 22);
          S.box(c, x, by, bw, bh, { label: b.label, sub: b.sub, color: b.color, dash: b.dash, active: b.active, size: 12 });
          if (i < 3) S.wire(c, [[x + bw, by + bh / 2], [x + bw + 22, by + bh / 2]], { color: C.muted });
        });
        // the graphs
        const H = st.H, top = by + bh + 30, hI = Math.max(50, (H - top - 70) * 0.26), gap = 40, hV = Math.max(80, H - top - hI - gap - 36);
        const imax = Math.max(100, Math.ceil(burst * 1000 / 100) * 100);
        const FI = frame(kit, c, M, top, W, hI, { x0: 0, x1: T * 1000, y0: 0, y1: imax, nx: 8, ny: 2, ylabel: 'current (mA)', yfmt: q => String(Math.round(q)), xfmt: q => String(Math.round(q)) });
        trace(c, FI, run.t.map((t, k) => [t, run.i[k]]), C.series[2] || C.warn, 2);
        const vmin = Math.min(...run.v), vmax = Math.max(...run.v, 3.4);
        const y0 = vmin < 1.8 ? 0 : 1.8, y1 = Math.max(3.8, Math.ceil(vmax * 5) / 5 + 0.1);
        const FV = frame(kit, c, M, top + hI + gap, W, hV, { x0: 0, x1: T * 1000, y0, y1, nx: 8, ny: 5, ylabel: 'rail at the module (V)', xlabel: 'time (ms)', yfmt: q => q.toFixed(1), xfmt: q => String(Math.round(q)) });
        hline(kit, c, FV, v.bod, C.bad, 'brownout ' + v.bod + ' V', false);
        hline(kit, c, FV, floor, C.warn, 'supply floor ' + floor + ' V', true);
        trace(c, FV, run.t.map((t, k) => [t, run.v[k]]), C.series[0] || C.accent, 2.4);
        // the part of the trace under the brownout threshold, in red
        c.save(); c.beginPath(); c.rect(FV.x, FV.y, FV.w, FV.h); c.clip();
        c.strokeStyle = C.bad; c.lineWidth = 4; c.beginPath();
        let on = false;
        run.t.forEach((t, k) => {
          if (run.v[k] < v.bod) { const px = FV.X(t), py = FV.Y(run.v[k]); if (on) c.lineTo(px, py); else { c.moveTo(px, py); on = true; } } else on = false;
        });
        c.stroke(); c.restore();
        // the numbers
        const idle = run.idle, m = run.vmin;
        const dI = Math.max(burst - base, 0);
        ro.set('vmin', volts(m));
        ro.set('idle', volts(idle));
        ro.set('dip', Math.round(Math.max(0, idle - m) * 1000) + ' mV');
        ro.set('verdict', m < v.bod ? 'Brownout: the chip resets' : m < floor ? 'Below the ' + floor + ' V floor: outside the specification' : m < floor + 0.15 ? 'Inside the specification with almost no margin' : 'Healthy');
        ro.set('charge', kit.eng(dI * v.tb / 1000, 'C'));
        ro.set('cap', kit.eng(E.holdupCap(dI, v.tb / 1000, 0.3), 'F'));
        if (m < v.bod) kit.label(c, 'reset', FV.x + FV.w / 2, FV.y + FV.h - 12, { size: 12, weight: 700, color: C.bad, align: 'center' });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ pw-regulators */
  /* typical figures of each family (quiescent current as typical, dropout at its rated current); the curves are the model's */
  const REGS = [
    { id: 'ams', name: 'AMS1117-3.3, LDO', kind: 'ldo', iq: 5e-3, dropout: 1.1, imax: 0.8, hue: 8 },
    { id: 'lowdo', name: 'Low-dropout LDO (ME6211 type)', kind: 'ldo', iq: 40e-6, dropout: 0.2, imax: 0.5, hue: 40 },
    { id: 'micro', name: 'Micro-power LDO (MCP1700 type)', kind: 'ldo', iq: 2e-6, dropout: 0.18, imax: 0.25, hue: 150 },
    { id: 'buck', name: 'Buck converter, general', kind: 'buck', eta: 0.92, iq: 30e-6, imax: 1.0, hue: 212 },
    { id: 'nano', name: 'Nano-power buck (TPS62840 type)', kind: 'buck', eta: 0.92, iq: 0.06e-6, imax: 0.75, hue: 280 }
  ];
  const VOUT = 3.3;
  /* one regulator at one input voltage and load (A): -> { vout, pin, pout, eff, heat, iin, drop, over } */
  function regulate(r, vin, il) {
    const gap = r.kind === 'ldo' ? r.dropout : 0.25;
    const vout = Math.max(0, Math.min(VOUT, vin - gap));
    const pout = vout * il;
    const pin = r.kind === 'ldo' ? vin * (il + r.iq) : pout / r.eta + vin * r.iq;
    return { vout, pout, pin, eff: pin > 0 ? pout / pin : 0, heat: pin - pout, iin: vin > 0 ? pin / vin : 0, drop: vout < VOUT - 1e-6, over: il > r.imax };
  }

  Hyper.sim('pw-regulators', {
    title: 'Linear or switching: efficiency, heat and input current',
    blurb: `Each line is the **efficiency** of one regulator type turning your input voltage into 3.3 V, against the load it feeds (a logarithmic axis from 10 µA to 1 A). The dots show your chosen load; the table gives the heat and the current drawn from the source.

The figures are typical for each family (the AMS1117 takes several milliamps, micro-power LDOs a few microamps, nano-power buck converters tens of nanoamps), not for one particular part. A line that stops is a regulator that cannot supply that current.

**Try this**
- Press **Deep sleep**: the AMS1117 uses milliamps to deliver microamps, so its efficiency is near zero, while the micro-power parts keep most of the energy.
- Press **Transmitting** at 5 V in, then at 12 V: the LDOs turn most of the input into heat, the converters barely warm.
- Lower the input towards 3.5 V: the AMS1117 *drops out* and the output falls below 3.3 V.
- Compare the **input current** of the buck with the LDOs at 12 V.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.72, maxH: 520 });
      const ch = E.chip('esp32-s3') || { rxMa: 91, txMa: 340, sleepUa: 7 };
      const ctl = kit.controls(box.side, [
        { id: 'vin', label: 'Input voltage', min: 3, max: 12, step: 0.1, value: 5, unit: 'V' },
        { id: 'il', label: 'Load current', min: 0.01, max: 1000, log: true, sig: 2, value: ch.rxMa, unit: 'mA' },
        { type: 'buttons', items: [{ id: 'sleep', label: 'Deep sleep' }, { id: 'rx', label: 'Listening' }, { id: 'tx', label: 'Transmitting' }] }
      ], (id, v) => {
        if (id === 'sleep') ctl.set('il', Math.max(0.01, (ch.sleepUa || 7) / 1000));
        else if (id === 'rx') ctl.set('il', ch.rxMa);
        else if (id === 'tx') ctl.set('il', ch.txMa);
        loop.once();
      });
      const ro = kit.readout(box.side, REGS.map(r => [r.id, r.name]));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const vin = ctl.values.vin, il = ctl.values.il / 1000;
        const M = 54, top = 24, W = st.W - M - 150, H = st.H - top - 48;
        const F = frame(kit, c, M, top, W, H, { x0: 0.01, x1: 1000, logx: true, y0: 0, y1: 100, ny: 5, ylabel: 'efficiency (%)', xlabel: 'load current (mA)', xfmt: q => (q >= 1 ? String(q) : String(q)), yfmt: q => String(Math.round(q)) });
        const label0 = [];
        REGS.forEach((r, k) => {
          const col = kit.hue(r.hue);
          const pts = [];
          for (let e = -2; e <= 3.0001; e += 0.05) {
            const i = Math.pow(10, e);
            if (i / 1000 > r.imax * 1.0001) break;
            pts.push([i, regulate(r, vin, i / 1000).eff * 100]);
          }
          trace(c, F, pts, col, 2.4);
          const now = regulate(r, vin, il);
          if (!now.over) kit.dot(c, F.X(il * 1000), F.Y(now.eff * 100), 4.5, col, C.bg2);
          // legend
          const ly = top + 6 + k * 18, lx = M + W + 16;
          c.fillStyle = col; c.fillRect(lx, ly + 2, 14, 4);
          kit.label(c, r.name.split(' (')[0].replace(', ', ' '), lx + 20, ly + 5, { size: 10.5, color: C.text2 });
          if (now.over) label0.push(r.name);
        });
        vline(kit, c, F, il * 1000, C.muted, '');
        REGS.forEach(r => {
          const q = regulate(r, vin, il);
          const note = q.over ? 'overloaded (rated ' + Math.round(r.imax * 1000) + ' mA)' : q.drop ? 'dropout: output ' + volts(q.vout) : '';
          ro.set(r.id, q.over ? note : (q.eff * 100 < 10 ? q.eff * 100 < 1 ? '< 1 %' : (q.eff * 100).toFixed(1) + ' %' : Math.round(q.eff * 100) + ' %') + ' · heat ' + kit.eng(Math.max(0, q.heat), 'W') + ' · in ' + kit.eng(q.iin, 'A') + (note ? ' · ' + note : ''));
        });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ pw-lipo */
  const CELLS = {
    lipo: { eid: 'lipo-1000', name: 'LiPo 1000 mAh', cap: 1000, r: 0.15 },
    small: { name: 'Small LiPo 150 mAh', cap: 150, r: 0.9 },
    li18650: { name: '18650, 3000 mAh', cap: 3000, r: 0.06 }
  };
  Hyper.sim('pw-lipo', {
    title: 'A lithium cell: voltage, ADC reading and charge',
    blurb: `The curve is the **resting voltage** of a lithium-ion cell against the charge that remains (from the engine's typical table). The green dot is the cell's true state. The load pulls the terminal voltage down by current × internal resistance, the divider halves it, and the program converts what it sees back into a percentage by reading the *same curve*: the orange dot is its answer.

The model is schematic: real curves shift with temperature, age and the cell's make.

**Try this**
- Set the load to 0 and move the **charge**: between 3.7 and 3.9 V (the shaded band) a third of the capacity lies in 0.2 V, so a small error becomes a big one.
- Add a **load** of 300 mA on the *small LiPo*: the sag makes the program report a much emptier cell, and the load is 2 C.
- Add an **ADC error** of 30 mV: in the flat band it moves the answer by several per cent; near 4.2 V it hardly matters.
- Click on the graph to set the charge.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.74, maxH: 560 });
      const adcView = params.view === 'adc';
      // the resting-voltage curve from the engine: [[charge %, volts], …]
      const CURVE = [];
      for (let v = 3.0; v <= 4.2001; v += 0.01) CURVE.push([E.lipoSoc(v) * 100, v]);
      const ocv = soc => interp(CURVE, clamp(soc, 0, 100));
      const ctl = kit.controls(box.side, [
        { id: 'soc', label: 'Charge remaining', min: 0, max: 100, step: 1, value: 60, unit: '%' },
        { id: 'load', label: 'Load on the cell', min: 0, max: 500, step: 5, value: 0, unit: 'mA' },
        { id: 'cell', type: 'select', label: 'Cell', options: Object.keys(CELLS).map(k => [CELLS[k].name + ' (' + CELLS[k].r + ' Ω)', k]), value: 'lipo' },
        { id: 'err', label: 'ADC and divider error', min: -60, max: 60, step: 5, value: 0, unit: 'mV' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['ocv', 'Resting cell voltage'], ['vload', 'Cell voltage under load'], ['pin', 'At the ADC pin (÷ 2)'], ['est', 'Charge the program reports'], ['true', 'True charge'], ['err', 'Error'], ['crate', 'Load as a C-rate']]);
      if (!adcView) { ctl.show('err', false); ro.show('pin', false); ro.show('est', false); ro.show('err', false); }
      let FF = null;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const v = ctl.values, cell = CELLS[v.cell] || CELLS.lipo;
        const top = 30, bottom = adcView ? 124 : 50, M = 52, W = st.W - M - 150, H = st.H - top - bottom;
        const F = FF = frame(kit, c, M, top, W, H, { x0: 0, x1: 100, y0: 3.0, y1: 4.3, nx: 5, ny: 5, ylabel: 'cell voltage (V)', xlabel: 'charge remaining (%)', yfmt: q => q.toFixed(1) });
        // the flat part of the curve
        const lo = E.lipoSoc(3.7) * 100, hi = E.lipoSoc(3.9) * 100;
        c.fillStyle = C.dark ? 'rgba(224,160,48,.12)' : 'rgba(224,160,48,.16)';
        c.fillRect(F.x, F.Y(3.9), F.w, F.Y(3.7) - F.Y(3.9));
        kit.label(c, 'flat part: 0.2 V holds ' + Math.round(hi - lo) + ' % of the charge', F.x + F.w - 6, F.Y(3.8), { size: 10.5, color: C.warn, align: 'right' });
        trace(c, F, CURVE, C.series[0] || C.accent, 2.6);
        // what the cell does and what the program sees
        const o = ocv(v.soc), vl = Math.max(2.5, o - v.load / 1000 * cell.r), vm = vl + v.err / 1000;
        const pinmv = Math.round(Math.max(0, vm) / 2 * 1000), est = clamp(E.lipoSoc(vm) * 100, 0, 100);
        kit.dot(c, F.X(v.soc), F.Y(o), 6, C.ok, C.bg2);
        if (v.load > 0 || (adcView && v.err !== 0)) {
          // the level the program reads, and the point of the curve it matches
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.setLineDash([5, 4]);
          const yy = clamp(F.Y(vm), F.y, F.y + F.h);
          c.beginPath(); c.moveTo(F.x, yy); c.lineTo(F.X(est), yy); c.lineTo(F.X(est), F.Y(ocv(est))); c.stroke(); c.restore();
          kit.dot(c, F.X(est), F.Y(ocv(est)), 6, C.warn, C.bg2);
          if (v.load > 0) { c.save(); c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(F.X(v.soc), F.Y(o)); c.lineTo(F.X(v.soc), clamp(F.Y(vl), F.y, F.y + F.h)); c.stroke(); c.restore(); kit.dot(c, F.X(v.soc), clamp(F.Y(vl), F.y, F.y + F.h), 4, C.bad); }
        }
        // the battery icon at the right
        const bx = M + W + 22;
        S.battery(c, bx, top + 18, 78, 36, (adcView ? est : v.soc) / 100, { label: Math.round(adcView ? est : v.soc) + ' %' });
        kit.label(c, adcView ? 'what the program shows' : 'true charge', bx + 39, top + 8, { size: 10.5, color: C.muted, align: 'center' });
        // the divider, on the ADC page
        if (adcView) {
          const y = F.y + F.h + 50, x0 = M + 6;
          S.box(c, x0, y - 17, 78, 34, { label: volts(vm), sub: 'at the cell', color: kit.hue(30), size: 12 });
          S.wire(c, [[x0 + 78, y], [x0 + 110, y]]);
          kit.schem.resistor(c, x0 + 110, y, x0 + 190, y, { label: 'R1', value: '100 kΩ' });
          S.wire(c, [[x0 + 190, y], [x0 + 230, y]]);
          kit.dot(c, x0 + 230, y, 3, C.text);
          kit.schem.resistor(c, x0 + 230, y, x0 + 230, y + 46, { label: 'R2', value: '100 kΩ' });
          kit.schem.ground(c, x0 + 230, y + 46);
          S.wire(c, [[x0 + 230, y], [x0 + 290, y]]);
          S.box(c, x0 + 290, y - 17, 110, 34, { label: pinmv + ' mV', sub: 'ADC1 pin', color: kit.hue(150), active: true, size: 12 });
        }
        ro.set('ocv', volts(o));
        ro.set('vload', volts(vl));
        ro.set('pin', pinmv + ' mV');
        ro.set('est', Math.round(est) + ' %');
        ro.set('true', Math.round(v.soc) + ' %');
        ro.set('err', (est - v.soc >= 0 ? '+' : '') + Math.round(est - v.soc) + ' percentage points');
        ro.set('crate', kit.fmt(v.load / cell.cap, 2) + ' C' + (v.load / cell.cap > 1 ? ' (hard on this cell)' : ''));
      }, box.stage);
      kit.click(st, p => { if (FF && p.x >= FF.x && p.x <= FF.x + FF.w) { ctl.set('soc', Math.round(clamp((p.x - FF.x) / FF.w * 100, 0, 100)), true); } }, p => !!FF && p.x >= FF.x && p.x <= FF.x + FF.w && p.y >= FF.y && p.y <= FF.y + FF.h);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ pw-charge */
  Hyper.sim('pw-charge', {
    title: 'Charging a lithium cell: constant current, then constant voltage',
    blurb: `A charger holds a fixed **current** (blue-green) until the cell's terminal voltage (blue) reaches 4.2 V, then holds **4.2 V** while the current falls, and stops when the current has dropped to a tenth of the first value. The programming resistor of a TP4056 sets the current: 1200 divided by the resistance in ohms.

The cell is modelled by its resting-voltage curve plus a series resistance, a schematic stand-in for a real cell.

**Try this**
- Choose the stock **1.2 kΩ** resistor on a 300 mAh cell: the current is more than 3 C. The charge is quick, but the constant-current stage ends with the cell only about three quarters full, because the current × resistance already lifts the terminal to 4.2 V.
- Raise the cell's **resistance**: the constant-current stage ends earlier and the slow constant-voltage tail grows.
- Tick **load across the cell** with 50 mA: the termination level is about 40 mA, so the charger never sees "done".
- Read the heat of the linear charger at the start: (5 V − cell voltage) × current.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.7, maxH: 520 });
      const CURVE = [];
      for (let v = 3.0; v <= 4.2001; v += 0.01) CURVE.push([E.lipoSoc(v) * 100, v]);
      const ocv = soc => interp(CURVE, clamp(soc, 0, 100));
      const ctl = kit.controls(box.side, [
        { id: 'cap', label: 'Cell capacity', min: 100, max: 3000, log: true, sig: 2, value: 1000, unit: 'mAh' },
        { id: 'prog', type: 'select', label: 'Programming resistor (TP4056)', options: [['1.2 kΩ: 1 A', 1000], ['2 kΩ: 600 mA', 600], ['3 kΩ: 400 mA', 400], ['5 kΩ: 240 mA', 240], ['10 kΩ: 120 mA', 120]], value: 400 },
        { id: 'r', label: 'Cell and wiring resistance', min: 0.05, max: 0.8, step: 0.01, value: 0.25, unit: 'Ω' },
        { id: 'start', label: 'Charge at the start', min: 0, max: 80, step: 1, value: 5, unit: '%' },
        { id: 'withLoad', type: 'check', label: 'Load connected across the cell while charging', value: false },
        { id: 'load', label: 'Load current', min: 0, max: 300, step: 5, value: 50, unit: 'mA' }
      ], (id) => { if (id === 'withLoad') ctl.show('load', ctl.values.withLoad); loop.once(); });
      ctl.show('load', false);
      const ro = kit.readout(box.side, [['cc', 'Constant-current stage'], ['cv', 'Constant-voltage stage'], ['total', 'Total'], ['crate', 'Charge current as a C-rate'], ['heat', 'Heat in a linear charger at the start'], ['end', 'How it ends']]);
      let cacheKey = '', cacheRun = null;
      const simulate = q => {
        const key = JSON.stringify(q);
        if (key !== cacheKey) { cacheRun = simulateNow(q); cacheKey = key; }
        return cacheRun;
      };
      function simulateNow(q) {
        const dt = 15, N = Math.round(14 * 3600 / dt), capAh = q.cap / 1000, Iterm = q.ichg / 10;
        let soc = q.start / 100, mode = 'cc', tCV = null, tEnd = null, socCV = null, vStart = null;
        const pts = [];
        for (let k = 0; k <= N; k++) {
          const t = k * dt, o = ocv(soc * 100);
          let icell = 0, iout = 0, v = o;
          if (tEnd == null) {
            if (mode === 'cc') {
              icell = q.ichg - q.load; iout = q.ichg; v = o + icell * q.r;
              if (v >= 4.2) { mode = 'cv'; tCV = t; socCV = soc; }
              else if (vStart == null) vStart = v;
            }
            if (mode === 'cv') {
              v = 4.2; icell = Math.max(0, (4.2 - o) / q.r); iout = icell + q.load;
              if (iout < Iterm) tEnd = t;
            }
            if (vStart == null) vStart = v;
          } else { icell = -q.load; iout = 0; v = o + icell * q.r; }
          pts.push([t / 3600, clamp(v, 2.5, 4.4), iout * 1000]);
          soc = clamp(soc + icell * dt / (3600 * capAh), 0, 1);
          if (tEnd != null && t > tEnd + 900) break;
        }
        return { pts, tCV, tEnd, socCV, socEnd: soc, vStart: vStart == null ? 3.6 : vStart };
      }
      const hours = h => (h < 1 ? Math.round(h * 60) + ' min' : kit.fmt(h, 3) + ' h');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const v = ctl.values, ichg = v.prog / 1000, load = v.withLoad ? v.load / 1000 : 0;
        const run = simulate({ cap: v.cap, ichg, r: v.r, start: v.start, load });
        const tlast = run.pts[run.pts.length - 1][0];
        const x1 = run.tEnd != null ? Math.max(1, Math.ceil(run.tEnd / 3600 * 1.2 * 2) / 2) : Math.ceil(tlast);
        const imax = Math.max(100, Math.ceil(ichg * 1000 * 1.1 / 100) * 100);
        const M = 54, top = 30, W = st.W - M - 60, H = st.H - top - 48;
        const F = frame(kit, c, M, top, W, H, { x0: 0, x1, y0: 3.0, y1: 4.4, nx: 6, ny: 7, ylabel: 'cell voltage (V)', xlabel: 'time (hours)', yfmt: q => q.toFixed(1), right: { y0: 0, y1: imax, fmt: q => String(Math.round(q)), label: 'charger current (mA)', color: C.series[2] || C.ok } });
        hline(kit, c, F, 4.2, C.muted, '4.2 V', true);
        trace(c, F, run.pts.map(p => [p[0], p[1]]), C.series[0] || C.accent, 2.6);
        c.save(); c.beginPath(); c.rect(F.x, F.y - 2, F.w, F.h + 4); c.clip();
        c.strokeStyle = C.series[2] || C.ok; c.lineWidth = 2.4; c.beginPath();
        run.pts.forEach((p, k) => { const px = F.X(p[0]), py = F.YR(p[2]); if (k) c.lineTo(px, py); else c.moveTo(px, py); });
        c.stroke(); c.restore();
        if (run.tCV != null) vline(kit, c, F, run.tCV / 3600, C.muted, 'constant voltage begins');
        if (run.tEnd != null) vline(kit, c, F, run.tEnd / 3600, C.ok, 'charger stops');
        else kit.label(c, 'the charger never sees "done"', F.x + F.w - 8, F.y + F.h * 0.45, { size: 12, weight: 650, color: C.bad, align: 'right' });
        const dd = n => (n == null ? 0 : n);
        const tcc = run.tCV == null ? tlast * 3600 : run.tCV;
        ro.set('cc', hours(tcc / 3600) + (run.socCV != null ? ' · ' + Math.round((run.socCV - v.start / 100) * v.cap) + ' mAh' : ' (never reached 4.2 V)'));
        ro.set('cv', run.tCV == null ? '—' : run.tEnd != null ? hours((run.tEnd - run.tCV) / 3600) : 'goes on for ever');
        ro.set('total', run.tEnd != null ? hours(run.tEnd / 3600) : 'never ends');
        ro.set('crate', kit.fmt(ichg * 1000 / v.cap, 2) + ' C' + (ichg * 1000 / v.cap > 1 ? ' (too fast for most small cells)' : ''));
        ro.set('heat', kit.eng(Math.max(0, (5 - run.vStart) * ichg), 'W'));
        ro.set('end', run.tEnd != null ? 'stops at ' + Math.round(ichg * 100) + ' mA, cell at ' + Math.round(run.socEnd * 100) + ' %' : load > 0 ? 'the load (' + Math.round(load * 1000) + ' mA) exceeds the ' + Math.round(ichg * 100) + ' mA stop level' : 'still charging after 14 h');
        void dd;
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ pw-cells */
  /* typical cells: open-circuit voltage per cell and internal resistance per cell against the fraction of the capacity used */
  const PCELLS = {
    aa2: { eid: 'aa2', name: '2 × AA alkaline', n: 2, cap: 2500, v: [[0, 1.6], [0.1, 1.45], [0.5, 1.3], [0.8, 1.15], [0.95, 1.0], [1, 0.85]], r: [[0, 0.15], [0.5, 0.25], [0.8, 0.45], [1, 1.2]] },
    aa3: { eid: 'aa3', name: '3 × AA alkaline', n: 3, cap: 2500, v: [[0, 1.6], [0.1, 1.45], [0.5, 1.3], [0.8, 1.15], [0.95, 1.0], [1, 0.85]], r: [[0, 0.15], [0.5, 0.25], [0.8, 0.45], [1, 1.2]] },
    cr2032: { eid: 'cr2032', name: 'CR2032 coin cell', n: 1, cap: 225, v: [[0, 3.2], [0.1, 3.0], [0.8, 2.9], [0.9, 2.7], [1, 2.0]], r: [[0, 12], [0.5, 18], [0.8, 30], [1, 80]] },
    cr123a: { eid: 'cr123a', name: 'CR123A lithium', n: 1, cap: 1500, v: [[0, 3.2], [0.1, 3.0], [0.9, 2.8], [1, 2.0]], r: [[0, 0.3], [0.8, 0.6], [1, 2]] },
    lisocl2: { eid: 'lisocl2-aa', name: 'Li-SOCl₂ AA (ER14505)', n: 1, cap: 2400, v: [[0, 3.65], [0.95, 3.6], [1, 3.0]], r: [[0, 8], [0.5, 12], [1, 40]] },
    lifepo4: { eid: 'lifepo4', name: 'LiFePO₄ cell', n: 1, cap: 1500, v: [[0, 3.6], [0.05, 3.4], [0.1, 3.33], [0.9, 3.2], [0.95, 3.0], [1, 2.5]], r: [[0, 0.1], [0.8, 0.15], [1, 0.3]] },
    lipo: { name: 'LiPo 1000 mAh', n: 1, cap: 1000, v: null, r: [[0, 0.15], [0.8, 0.2], [1, 0.4]] }
  };
  Hyper.sim('pw-cells', {
    title: 'Primary cells and the burst: how much of the capacity can the chip use?',
    blurb: `The grey line is the cell's **resting voltage** as it empties; the blue line is its voltage **during a transmit burst** (resting voltage minus current × internal resistance, with the capacitor holding up the start of the burst); the green line is the **rail at the chip** after the regulator. The vertical line marks the first point where the rail breaks the chip's 3.0 V floor: everything to its right is capacity you cannot use.

The curves are typical and schematic: real cells differ with make, age, temperature and storage. The chip's burst currents are in the catalogue.

**Try this**
- *2 × AA alkaline, no regulator*: the rail breaks the floor early. Select the **boost converter**: the usable share jumps.
- *CR2032*: a 340 mA burst is impossible. Lower the **burst** to 15 mA (a Bluetooth LE beacon) and add 470 µF: the burst is now fine, but the chip's 3.0 V floor strands most of the cell.
- *LiPo with no regulator*: the rail is above the chip's 3.6 V limit at the start. Add the low-dropout regulator.
- Compare the **run time** of the cells at the same average current.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.7, maxH: 520 });
      // the LiPo curve from the engine, as [[fraction used, volts], …]
      const lp = [];
      for (let v = 4.2; v >= 2.9999; v -= 0.01) lp.push([1 - E.lipoSoc(v), v]);
      PCELLS.lipo.v = lp;
      const ch = E.chip('esp32-s3') || { txMa: 340 };
      const ctl = kit.controls(box.side, [
        { id: 'cell', type: 'select', label: 'Cell', options: Object.keys(PCELLS).map(k => [PCELLS[k].name, k]), value: 'aa2' },
        { id: 'reg', type: 'select', label: 'Between the cell and the chip', options: [['nothing (direct)', 'none'], ['low-dropout LDO (0.2 V)', 'ldo'], ['boost converter to 3.3 V', 'boost']], value: 'none' },
        { id: 'ib', label: 'Burst current', min: 5, max: 500, log: true, sig: 2, value: ch.txMa, unit: 'mA' },
        { id: 'tb', label: 'Burst length', min: 0.2, max: 10, step: 0.1, value: 2, unit: 'ms' },
        { id: 'c', label: 'Capacitor at the cell', min: 1, max: 4700, log: true, sig: 2, value: 100, unit: 'µF' },
        { id: 'avg', label: 'Average current', min: 0.01, max: 50, log: true, sig: 2, value: 0.1, unit: 'mA' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['use', 'Usable before the rail breaks 3.0 V'], ['mah', 'Usable capacity'], ['life', 'Run time at the average current'], ['droop', 'Droop of the capacitor alone'], ['note', 'Note']]);
      /* the cell and rail at a fraction used, during a burst */
      function at(cell, reg, f, q) {
        const n = cell.n, E0 = n * interp(cell.v, f), R = Math.max(1e-3, n * interp(cell.r, f)), V0 = E0 - R * q.base;
        if (reg === 'boost') {
          const P = 3.3 * q.ib / 0.85, steps = 60, dtt = q.tb / steps;
          let V = Math.max(V0, 0), vmin = V;
          for (let k = 0; k < steps; k++) {
            const Iin = P / Math.max(V, 0.05), Vt = E0 - R * Iin;
            V = Math.max(0, Vt + (V - Vt) * Math.exp(-dtt / (R * q.C)));
            vmin = Math.min(vmin, V);
          }
          const ok = vmin >= 0.9;
          return { rest: E0, vin: vmin, rail: ok ? 3.3 : 0, ok };
        }
        const Vinf = E0 - R * q.ib, Vend = Vinf + (V0 - Vinf) * Math.exp(-q.tb / (R * q.C)), vin = Math.max(0, Vend);
        const rail = reg === 'ldo' ? Math.max(0, Math.min(3.3, vin - 0.2)) : vin;
        return { rest: E0, vin, rail, ok: rail >= 3.0 };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const v = ctl.values, cell = PCELLS[v.cell] || PCELLS.aa2;
        const q = { ib: v.ib / 1000, tb: v.tb / 1000, C: v.c * 1e-6, base: v.avg / 1000 };
        const N = 100, rest = [], vin = [], rail = [];
        let fu = null, over = 0;
        for (let k = 0; k <= N; k++) {
          const f = k / N, a = at(cell, v.reg, f, q);
          rest.push([f * 100, a.rest]); vin.push([f * 100, a.vin]); rail.push([f * 100, a.rail]);
          if (fu == null && !a.ok && !(v.reg === 'none' && a.rail > 3.6)) fu = f;
          if (v.reg === 'none') over = Math.max(over, a.rail);
        }
        if (fu == null) fu = 1;
        const M = 54, top = 30, W = st.W - M - 20, H = st.H - top - 48;
        const ymax = Math.max(4, Math.ceil(Math.max(...rest.map(p => p[1])) * 2) / 2 + 0.5);
        const F = frame(kit, c, M, top, W, H, { x0: 0, x1: 100, y0: 0, y1: ymax, nx: 5, ny: 5, ylabel: 'voltage (V)', xlabel: 'capacity used (% of the rating)', yfmt: q2 => q2.toFixed(1) });
        c.fillStyle = C.dark ? 'rgba(229,72,77,.10)' : 'rgba(229,72,77,.08)';
        c.fillRect(F.X(fu * 100), F.y, F.x + F.w - F.X(fu * 100), F.h);
        hline(kit, c, F, 3.0, C.warn, 'chip floor 3.0 V', false);
        hline(kit, c, F, 3.6, C.bad, 'chip limit 3.6 V', true);
        trace(c, F, rest, C.muted, 2, [5, 4]);
        trace(c, F, vin, C.series[0] || C.accent, 2.4);
        if (v.reg !== 'none') trace(c, F, rail, C.series[2] || C.ok, 3);
        vline(kit, c, F, fu * 100, C.bad, fu >= 1 ? '' : 'usable up to ' + Math.round(fu * 100) + ' %');
        kit.label(c, 'resting', F.x + 8, F.Y(rest[0][1]) - 9, { size: 10.5, color: C.muted });
        kit.label(c, 'at the burst', F.x + F.w * 0.5, F.y + F.h - 10, { size: 10.5, color: C.series[0] || C.accent, align: 'center' });
        const mah = fu * cell.cap;
        const life = E.batteryLife(mah, v.avg, { usable: 1, cell: cell.eid });
        ro.set('use', Math.round(fu * 100) + ' %');
        ro.set('mah', Math.round(mah) + ' mAh of ' + cell.cap);
        ro.set('life', fu <= 0 ? 'none: the cell cannot feed this burst' : life.days < 60 ? kit.fmt(life.days, 3) + ' days' : kit.fmt(life.years, 3) + ' years');
        ro.set('droop', Math.round(v.ib * v.tb / v.c * 1000) + ' mV (I × t ÷ C, no help from the cell)');
        ro.set('note', v.reg === 'none' && over > 3.6 ? 'direct: over 3.6 V at the start, needs a regulator' : v.reg === 'boost' && fu >= 1 ? 'the boost converter uses the whole capacity' : fu <= 0 ? 'the first burst already breaks the floor' : fu < 0.3 ? 'most of the capacity is stranded' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ pw-solar */
  const SEASONS = { summer: { name: 'Midsummer, 16 h of daylight', L: 16, H: 5 }, equinox: { name: 'Spring or autumn, 12 h', L: 12, H: 3 }, winter: { name: 'Midwinter, 8 h of daylight', L: 8, H: 0.8 } };
  Hyper.sim('pw-solar', {
    title: 'A solar panel and a lithium cell over three days',
    blurb: `The green area is the **current the panel puts into the cell** (rated power × the day's light × 0.7 for the charger and the cell's charging efficiency, at 3.7 V). The dashed line is your node's **average load**, and the blue line, on the right-hand scale, is the **charge in the cell**, starting at 50 %. Day 2 can be overcast, with a fifth of the sun.

The daily light is a smooth arc scaled so that its area equals the *peak sun hours* you choose. It is a schematic day: real weather is lumpier.

**Try this**
- With the defaults (1 W, 1 mA, 1000 mAh) the cell stays nearly full. Raise the load to 100 mA, an always-on Wi-Fi board: the panel cannot keep up and the cell runs flat on the first day.
- Choose **midwinter**: the same panel gives about a quarter of the energy. Which loads still survive an overcast day?
- Shrink the **battery**: a dark day now empties it.
- Read **days of autonomy**: how long the cell alone carries the load.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.66, maxH: 500 });
      const ctl = kit.controls(box.side, [
        { id: 'season', type: 'select', label: 'Season', options: Object.keys(SEASONS).map(k => [SEASONS[k].name, k]), value: 'equinox' },
        { id: 'P', label: 'Panel, rated power', min: 0.2, max: 10, log: true, sig: 2, value: 1, unit: 'W' },
        { id: 'H', label: 'Peak sun hours in the day', min: 0.3, max: 6, step: 0.1, value: 3, unit: 'h' },
        { id: 'load', label: 'Average load of the node', min: 0.05, max: 150, log: true, sig: 2, value: 1, unit: 'mA' },
        { id: 'cap', label: 'Cell capacity', min: 200, max: 5000, log: true, sig: 2, value: 1000, unit: 'mAh' },
        { id: 'cloudy', type: 'check', label: 'Day 2 is overcast (a fifth of the sun)', value: true }
      ], (id, v) => { if (id === 'season') ctl.set('H', SEASONS[v].H); loop.once(); });
      const ro = kit.readout(box.side, [['harvest', 'Into the cell on a clear day'], ['use', 'The node uses per day'], ['low', 'Lowest charge in three days'], ['result', 'Result'], ['auto', 'Days of autonomy (80 % of the cell)']]);
      function simulate(q) {
        const dt = 0.1, N = 720, L = SEASONS[q.season].L, scale = clamp(q.H * Math.PI / (2 * L), 0, 1.3);
        let soc = 0.5, dead = null, low = 1, clear = 0;
        const pts = [];
        for (let k = 0; k <= N; k++) {
          const h = k * dt, day = Math.min(2, Math.floor(h / 24)), hh = h - day * 24;
          const a = 12 - L / 2, g = hh >= a && hh <= 12 + L / 2 ? Math.sin(Math.PI * (hh - a) / L) : 0;
          const weather = q.cloudy && day === 1 ? 0.2 : 1;
          const iChg = q.P * scale * g * weather * 0.7 / 3.7 * 1000;
          if (k > 0) {
            soc += (iChg - q.load) * dt / q.cap;
            if (soc > 1) soc = 1;
            if (soc < 0) { soc = 0; if (dead == null) dead = h; }
          }
          low = Math.min(low, soc);
          if (day === 0 && k < 240) clear += iChg * dt;
          pts.push([h, iChg, soc * 100, g]);
        }
        return { pts, dead, low, clear };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const v = ctl.values;
        const run = simulate(v);
        const imax = Math.max(10, Math.max(...run.pts.map(p => p[1])), v.load) * 1.15;
        const M = 54, top = 30, W = st.W - M - 56, H = st.H - top - 50;
        const F = frame(kit, c, M, top, W, H, { x0: 0, x1: 72, y0: 0, y1: imax, nx: 6, ny: 4, ylabel: 'current into the cell (mA)', xlabel: 'time (hours)', xfmt: q => String(Math.round(q)), yfmt: q => (q >= 10 ? String(Math.round(q)) : kit.fmt(q, 2)), right: { y0: 0, y1: 100, fmt: q => Math.round(q) + ' %', label: 'charge in the cell', color: C.series[0] || C.accent } });
        // night
        c.fillStyle = C.dark ? 'rgba(0,0,0,.28)' : 'rgba(0,0,40,.07)';
        let startN = null;
        run.pts.forEach((p, k) => {
          const night = p[3] <= 0;
          if (night && startN == null) startN = p[0];
          if ((!night || k === run.pts.length - 1) && startN != null) { c.fillRect(F.X(startN), F.y, F.X(p[0]) - F.X(startN), F.h); startN = null; }
        });
        for (let d = 0; d < 3; d++) kit.label(c, 'day ' + (d + 1) + (d === 1 && v.cloudy ? ' (overcast)' : ''), F.X(d * 24 + 12), F.y + 10, { size: 10.5, color: C.muted, align: 'center' });
        // harvest area
        c.save(); c.beginPath(); c.rect(F.x, F.y, F.w, F.h); c.clip();
        c.beginPath(); c.moveTo(F.X(0), F.Y(0));
        run.pts.forEach(p => c.lineTo(F.X(p[0]), F.Y(p[1])));
        c.lineTo(F.X(72), F.Y(0)); c.closePath();
        c.fillStyle = C.dark ? 'rgba(34,179,122,.35)' : 'rgba(34,179,122,.30)'; c.fill();
        c.restore();
        hline(kit, c, F, v.load, C.warn, 'load ' + kit.fmt(v.load, 2) + ' mA', true);
        // charge
        c.save(); c.beginPath(); c.rect(F.x, F.y - 2, F.w, F.h + 4); c.clip();
        c.strokeStyle = C.series[0] || C.accent; c.lineWidth = 2.6; c.beginPath();
        run.pts.forEach((p, k) => { const px = F.X(p[0]), py = F.YR(p[2]); if (k) c.lineTo(px, py); else c.moveTo(px, py); });
        c.stroke(); c.restore();
        if (run.dead != null) kit.label(c, 'flat at hour ' + Math.round(run.dead), F.X(run.dead), F.YR(2) - 12, { size: 11, weight: 650, color: C.bad, align: 'center' });
        const perDay = v.load * 24;
        ro.set('harvest', Math.round(run.clear) + ' mAh');
        ro.set('use', Math.round(perDay) + ' mAh');
        ro.set('low', Math.round(run.low * 100) + ' %');
        ro.set('result', run.dead != null ? 'the cell runs flat on day ' + (Math.floor(run.dead / 24) + 1) : run.low < 0.2 ? 'survives, but gets close to flat' : run.clear > perDay ? 'keeps up, with room to spare' : 'survives the three days, but loses ground');
        ro.set('auto', kit.fmt(v.cap * 0.8 / Math.max(perDay, 1e-9), 3) + ' days');
        void E;
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ pw-meter */
  Hyper.sim('pw-meter', {
    title: 'A current meter in series: burden and display',
    blurb: `A Wi-Fi node draws a steady current between bursts and a short, tall **burst**. The top graph (scrolling slowly, much slower than real time) is the **true current**. The instrument in series has a resistance, so its **burden voltage** comes off the node's 3.3 V rail: the bottom graph is the rail **at the chip**, with the 3.0 V floor and the brownout threshold.

A **multimeter** shows the *average* over a quarter of a second, refreshed about three times a second: the orange steps are what its display reads. A **shunt with an oscilloscope** or a **profiler** shows the waveform itself; the profiler's burden is tiny. The supply is taken as stiff, and the meter figures are typical, not those of one model.

**Try this**
- With the defaults, read the multimeter: a calm number far below the 340 mA peak, because the burst is averaged away.
- Raise the **resistance** to 3 Ω: the rail at the chip falls under the brownout line, so the meter itself resets the node.
- Lengthen the **time between bursts** to 2 s: the multimeter's display now jumps up and down as the burst falls in and out of its window.
- Switch to the *shunt* and set 0.1 Ω: the burst is a 34 mV pulse on the scope, with 34 mV of burden.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.84, maxH: 620 });
      const ch = E.chip('esp32-s3') || { txMa: 340 };
      const ctl = kit.controls(box.side, [
        { id: 'method', type: 'select', label: 'Instrument', options: [['Multimeter, mA range', 'dmm'], ['Shunt and oscilloscope', 'scope'], ['Profiler (fast, tiny burden)', 'prof']], value: 'dmm' },
        { id: 'base', label: 'Current between bursts', min: 0.01, max: 100, log: true, sig: 2, value: 30, unit: 'mA' },
        { id: 'burst', label: 'Burst current', min: 50, max: 450, step: 5, value: ch.txMa, unit: 'mA' },
        { id: 'tb', label: 'Burst length', min: 0.2, max: 20, step: 0.1, value: 2, unit: 'ms' },
        { id: 'period', label: 'Time between bursts', min: 20, max: 3000, log: true, sig: 2, value: 100, unit: 'ms' },
        { id: 'R', label: 'Resistance of the meter or shunt', min: 0.01, max: 10, log: true, sig: 2, value: 1, unit: 'Ω' }
      ], () => loop.once());
      ctl.show('R', true);
      const ro = kit.readout(box.side, [['avg', 'True average current'], ['peak', 'True peak current'], ['burden', 'Burden voltage at the peak'], ['rail', 'Rail at the chip at the peak'], ['shows', 'What the instrument shows'], ['verdict', 'Verdict']]);
      const BOD = 2.43, FLOOR = 3.0, VSUP = 3.3, DELTA = 0.33, DWIN = 0.25;
      const model = v => {
        const P = v.period / 1000, tb = Math.min(v.tb / 1000, P * 0.9), burst = Math.max(v.burst, v.base);
        return { P, tb, base: v.base, burst, d: burst - v.base };
      };
      /* the integral of the current (mA·s) from 0 to t, and its mean over [a, b] */
      const integral = (m, t) => { const n = Math.floor(t / m.P); return m.base * t + m.d * (n * m.tb + Math.min(t - n * m.P, m.tb)); };
      const mean = (m, a, b) => (integral(m, b) - integral(m, a)) / Math.max(b - a, 1e-9);
      const now = (m, t) => (t - Math.floor(t / m.P) * m.P < m.tb ? m.burst : m.base);
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors();
        const v = ctl.values, m = model(v);
        const prof = v.method === 'prof', Rb = prof ? 0.02 : v.R;
        const W = Math.max(0.05, 5 * m.P), tNow = W + (t || 0) * W / 6, t0 = tNow - W;
        const avg = mean(m, 0, m.P), peak = m.burst, burdenV = peak / 1000 * Rb, railMin = VSUP - burdenV;
        const Hh = st.H, M = 56, top = 34, Wd = st.W - M - (v.method === 'scope' ? 62 : 20), hI = Math.max(70, (Hh - top - 70) * 0.55), gap = 38, hV = Math.max(60, Hh - top - hI - gap - 36);
        const imax = Math.max(50, Math.ceil(m.burst * 1.15 / 50) * 50);
        const rightScale = v.method === 'scope' ? { y0: 0, y1: imax * Rb, fmt: q => (q >= 100 ? String(Math.round(q)) : kit.fmt(q, 2)), label: 'across the shunt (mV)', color: C.muted } : null;
        const unitMs = W < 1;
        const FI = frame(kit, c, M, top, Wd, hI, { x0: 0, x1: W, y0: 0, y1: imax, nx: 5, ny: 3, ylabel: 'current of the node (mA)', xfmt: q => (unitMs ? String(Math.round(q * 1000)) : kit.fmt(q, 2)), yfmt: q => String(Math.round(q)), right: rightScale });
        // the true waveform
        const pts = [];
        pts.push([0, now(m, t0)]);
        for (let n = Math.floor(t0 / m.P) - 1; n <= Math.ceil(tNow / m.P); n++) {
          for (const [te, lv] of [[n * m.P, m.burst], [n * m.P + m.tb, m.base]]) {
            if (te > t0 && te < tNow) { pts.push([te - t0, pts[pts.length - 1][1]]); pts.push([te - t0, lv]); }
          }
        }
        pts.push([W, pts[pts.length - 1][1]]);
        trace(c, FI, pts, C.series[2] || C.ok, 2.2);
        // what the instrument shows
        let shown = null;
        const kLast = Math.floor(tNow / DELTA);
        if (v.method === 'dmm') {
          const steps = [];
          for (let k = Math.max(1, Math.ceil(t0 / DELTA)); k <= kLast; k++) {
            const tk = k * DELTA, val = mean(m, Math.max(0, tk - DWIN), tk);
            steps.push([tk - t0, val], [Math.min(W, tk + DELTA - t0), val]);
          }
          if (steps.length) trace(c, FI, steps, C.warn, 3.2);
          shown = mean(m, Math.max(0, kLast * DELTA - DWIN), kLast * DELTA);
        } else if (prof) {
          hline(kit, c, FI, avg, C.ok, 'average ' + kit.fmt(avg, 3) + ' mA', true);
        }
        if (shown != null) S.text(c, kit.fmt(shown, 3) + ' mA', M + Wd - 6, top + 22, { size: 22, mono: true, weight: 700, color: C.warn, align: 'right', bg: C.dark ? 'rgba(0,0,0,.45)' : 'rgba(255,255,255,.7)' });
        // the rail at the chip
        const y0 = railMin < 2.2 ? Math.max(0, Math.floor((railMin - 0.3) * 2) / 2) : 2, y1 = 3.5;
        const FV = frame(kit, c, M, top + hI + gap, Wd, hV, { x0: 0, x1: W, y0, y1, nx: 5, ny: 4, ylabel: 'rail at the chip (V)', xlabel: unitMs ? 'time (ms)' : 'time (s)', xfmt: q => (unitMs ? String(Math.round(q * 1000)) : kit.fmt(q, 2)), yfmt: q => q.toFixed(1) });
        hline(kit, c, FV, FLOOR, C.warn, 'supply floor 3.0 V', false);
        hline(kit, c, FV, BOD, C.bad, 'brownout 2.43 V', false);
        trace(c, FV, pts.map(p => [p[0], VSUP - p[1] / 1000 * Rb]), C.series[0] || C.accent, 2.4);
        if (railMin < BOD) kit.label(c, 'the meter resets the node', FV.x + FV.w / 2, FV.y + FV.h / 2, { size: 12, weight: 700, color: C.bad, align: 'center' });
        ro.set('avg', kit.fmt(avg, 3) + ' mA');
        ro.set('peak', kit.fmt(peak, 3) + ' mA');
        ro.set('burden', kit.fmt(burdenV * 1000, 3) + ' mV (' + kit.eng(Rb, 'Ω') + ')');
        ro.set('rail', volts(railMin));
        ro.set('shows', v.method === 'dmm' ? kit.fmt(shown == null ? avg : shown, 3) + ' mA: an average, refreshed three times a second' : v.method === 'scope' ? 'the waveform: ' + kit.fmt(burdenV * 1000, 3) + ' mV at the peak' : 'the waveform, the average and the charge: ' + kit.fmt(avg * m.P * 1000, 3) + ' µC per burst cycle');
        ro.set('verdict', railMin < BOD ? 'The instrument browns the node out' : railMin < FLOOR ? 'The burden pulls the rail under 3.0 V: the node is disturbed' : v.method === 'dmm' && peak > 3 * Math.max(shown == null ? avg : shown, 1e-9) ? 'The burden is harmless, but the display hides the peak' : 'The burden is small enough to ignore');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });
})();
