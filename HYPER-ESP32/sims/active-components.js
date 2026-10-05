/* HYPER-ESP32 · sims/active-components.js
 *
 * Topic: Active parts around an ESP.
 *
 *   ac-led-resistor    an LED and its resistor: the operating point on the LED curve, and how much the current moves with Vf
 *   ac-bjt-switch      an NPN low-side switch solved as a circuit: base resistor, saturation, heat
 *   ac-mosfet-gate     the same load on a logic-level and on a standard MOSFET, against the gate voltage
 *   ac-flyback         a coil released with and without a flyback diode: the current and the voltage at the switch
 *   ac-level-shift     an I2C edge crossing a BSS138 level shifter, or wired straight to a 5 V pull-up
 *   ac-shift-register  a byte clocked into a 74HC595 and latched onto eight LEDs
 *   ac-opto            a PC817: LED current, CTR, the inverted output, and two grounds that do not meet
 *   ac-adc-resolution  the same small signal read by the ESP's 12-bit ADC and by an ADS1115
 *   ac-opamp-gain      a non-inverting amplifier before the ADC: gain, rails, and the pin's limit
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- helpers */
  const fin = v => (Number.isFinite(v) ? v : 0);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const fmtI = a => {
    const m = Math.abs(fin(a)) * 1e3;
    if (m >= 100) return m.toFixed(0) + ' mA';
    if (m >= 10) return m.toFixed(1) + ' mA';
    if (m >= 0.1) return m.toFixed(2) + ' mA';
    return (m * 1e3).toFixed(0) + ' µA';
  };
  const fmtV = (v, d) => fin(v).toFixed(d == null ? 2 : d) + ' V';
  const fmtR = r => {
    r = fin(r);
    if (r >= 1e6) return (r / 1e6).toFixed(1) + ' MΩ';
    if (r >= 1e3) return (r / 1e3).toFixed(r >= 1e4 ? 0 : 1).replace(/\.0$/, '') + ' kΩ';
    return r.toFixed(0) + ' Ω';
  };
  const fmtP = w => {
    w = fin(w);
    if (w >= 1) return w.toFixed(2) + ' W';
    if (w >= 1e-3) return (w * 1e3).toFixed(w >= 0.01 ? 0 : 1) + ' mW';
    return (w * 1e6).toFixed(0) + ' µW';
  };
  const fmtT = s => {
    s = fin(s);
    if (s >= 1) return s.toFixed(2) + ' s';
    if (s >= 1e-3) return (s * 1e3).toFixed(s >= 0.01 ? 1 : 2) + ' ms';
    if (s >= 1e-6) return (s * 1e6).toFixed(s >= 1e-5 ? 1 : 2) + ' µs';
    return (s * 1e9).toFixed(0) + ' ns';
  };
  const dashed = (c, on) => c.setLineDash(on ? [4, 4] : []);

  // the frame of a graph: grid, axes and tick labels. o: { x0, x1, y0, y1, xt, yt, xf, yf } -> { X, Y }
  function frame(c, C, kit, x, y, w, h, o) {
    const X = v => x + (v - o.x0) / ((o.x1 - o.x0) || 1) * w, Y = v => y + h - (v - o.y0) / ((o.y1 - o.y0) || 1) * h;
    c.save();
    c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
    for (const t of o.xt) { const px = Math.round(X(t)) + 0.5; c.moveTo(px, y); c.lineTo(px, y + h); }
    for (const t of o.yt) { const py = Math.round(Y(t)) + 0.5; c.moveTo(x, py); c.lineTo(x + w, py); }
    c.stroke();
    c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x + 0.5, y); c.lineTo(x + 0.5, y + h + 0.5); c.lineTo(x + w, y + h + 0.5); c.stroke();
    c.restore();
    // tick labels: none that would touch the one before, and the last one stays inside the stage
    let lastX = -1e9;
    for (const t of o.xt.slice().sort((a, b) => a - b)) {
      const s = o.xf ? o.xf(t) : String(t);
      if (s === '') continue;
      const wide = s.length * 5.8, px = X(t), right = px > x + w - wide / 2 - 2;
      if (px - lastX < wide + 6) continue;
      lastX = px;
      kit.label(c, s, right ? px + 2 : px, y + h + 12, { size: 10, color: C.muted, align: right ? 'right' : 'center' });
    }
    let lastY = 1e9;
    for (const t of o.yt.slice().sort((a, b) => a - b)) {
      const s = o.yf ? o.yf(t) : String(t);
      if (s === '' || lastY - Y(t) < 12) continue;
      lastY = Y(t);
      kit.label(c, s, x - 5, Y(t), { size: 10, color: C.muted, align: 'right' });
    }
    return { X, Y };
  }
  // a polyline clipped to a rectangle
  function trace(c, x, y, w, h, pts, X, Y, color, width, dash) {
    c.save();
    c.beginPath(); c.rect(x, y - 2, w + 1, h + 4); c.clip();
    c.strokeStyle = color; c.lineWidth = width || 2; c.lineJoin = 'round';
    if (dash) c.setLineDash([5, 4]);
    c.beginPath();
    let first = true;
    for (const p of pts) {
      if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) { first = true; continue; }
      if (first) { c.moveTo(X(p[0]), Y(p[1])); first = false; } else c.lineTo(X(p[0]), Y(p[1]));
    }
    c.stroke();
    c.restore();
  }
  // a horizontal bar with a label above it and a value at the right
  function bar(c, C, kit, x, y, w, label, frac, value, color, marker, markerText) {
    kit.label(c, label, x, y, { size: 11.5, color: C.text2, weight: 600, align: 'left' });
    kit.label(c, value, x + w, y, { size: 11.5, color: C.text, weight: 600, align: 'right' });
    c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)';
    c.fillRect(x, y + 9, w, 12);
    c.fillStyle = color;
    c.fillRect(x, y + 9, Math.max(1.5, w * clamp(fin(frac), 0, 1)), 12);
    if (marker != null) {
      const mx = x + w * clamp(marker, 0, 1);
      c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(mx, y + 6); c.lineTo(mx, y + 24); c.stroke();
      if (markerText) kit.label(c, markerText, clamp(mx + 4, x, x + w - 10), y + 32, { size: 10, color: C.muted, align: mx + 4 > x + w - 150 ? 'right' : 'left' });
    }
  }

  /* ================================================================ ac-led-resistor */
  // forward voltage at 5 mA of typical LEDs, and the colour they glow with
  const LEDS = {
    red: { name: 'Red', vf: 2.0, glow: '#ff4136' },
    yellow: { name: 'Yellow, amber', vf: 2.1, glow: '#ffd84a' },
    green: { name: 'Green (classic)', vf: 2.2, glow: '#3ddc84' },
    green2: { name: 'Green (bright, InGaN)', vf: 3.0, glow: '#39e58c' },
    blue: { name: 'Blue', vf: 3.0, glow: '#4da3ff' },
    white: { name: 'White', vf: 3.1, glow: '#f4f4f4' }
  };
  const VT = 0.02585, NID = 2;      // thermal voltage at room temperature, ideality factor of an LED
  // the LED voltage at a current, from the diode equation calibrated so that 5 mA gives vf
  const ledV = (i, vf) => { const is = 5e-3 / (Math.exp(vf / (NID * VT)) - 1); return NID * VT * Math.log(i / is + 1); };
  // the operating point of supply -> R -> LED: bisection on the current
  function ledPoint(vs, R, vf) {
    if (!(vs > 0) || !(R > 0)) return { i: 0, v: 0 };
    let lo = 0, hi = vs / R;
    for (let k = 0; k < 70; k++) {
      const mid = (lo + hi) / 2;
      if (mid * R + ledV(mid, vf) > vs) hi = mid; else lo = mid;
    }
    const i = (lo + hi) / 2;
    return { i, v: ledV(i, vf) };
  }

  Hyper.sim('ac-led-resistor', {
    title: 'An LED and its resistor',
    blurb: `The curve is the LED: almost nothing flows until its forward voltage, then the current climbs steeply. The straight line is the resistor: it can only take whatever the supply has left. The dot, where they cross, is the current you get.

**Try this**
- With a **red** LED, 3.3 V and about 270 Ω, read the current: a few milliamps, and the dot sits where the curve is steep, so a small change of voltage makes a small change of current.
- Switch to a **blue** LED at 3.3 V and shrink the resistor: the dot slides to the flat part of the curve, and **the LED varies by ±0.2 V** shows the current swinging between nothing and a great deal.
- Move the supply to 5 V: now the blue LED has room for a sensible resistor.
- Slide **this LED's forward voltage** to see why two LEDs of the same colour can differ in brightness.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.8, maxH: 560 });
      const e12 = v => E.eSeries(v, 'E12');
      const ctl = kit.controls(box.side, [
        { id: 'led', type: 'select', label: 'LED', options: Object.keys(LEDS).map(k => [LEDS[k].name, k]), value: LEDS[params.led] ? params.led : 'red' },
        { id: 'vs', type: 'select', label: 'Supply', options: [['3.3 V (an ESP pin)', 3.3], ['5 V', 5]], value: 3.3 },
        { id: 'R', label: 'Series resistor', min: 22, max: 2200, value: 270, log: true, fmt: v => fmtR(e12(v)) },
        { id: 'dv', label: "This LED's forward voltage differs by", min: -0.3, max: 0.3, step: 0.05, value: 0, unit: 'V' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['i', 'LED current'], ['v', 'Across the LED'], ['p', 'Heat in the resistor'], ['spread', 'If the LED varies by ±0.2 V'], ['verdict', 'Verdict']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, L = LEDS[v.led] || LEDS.red;
        const R = e12(v.R), vf = L.vf + v.dv, pt = ledPoint(v.vs, R, vf);
        const lo = ledPoint(v.vs, R, vf - 0.2), hi = ledPoint(v.vs, R, vf + 0.2);
        const W = st.W, H = st.H;
        // the circuit
        const y0 = 46;
        kit.label(c, v.vs === 5 ? '5 V' : 'pin 3.3 V', 6, y0, { size: 12, weight: 600, color: C.accent, align: 'left' });
        S.wire(c, [[70, y0], [84, y0]]);
        S.resistor(c, 84, y0, 164, y0, { label: 'R', value: fmtR(R) });
        S.wire(c, [[164, y0], [188, y0]]);
        S.diode(c, 188, y0, 238, y0, { kind: 'led', on: pt.i > 2e-4, glow: L.glow });
        S.wire(c, [[238, y0], [266, y0], [266, y0 + 14]]);
        S.ground(c, 266, y0 + 14);
        kit.label(c, fmtI(pt.i), 304, y0, { size: 13, weight: 650, color: C.text, align: 'left' });
        // the graph: LED voltage across, current up
        const gx = 50, gy = 96, gw = Math.max(120, W - gx - 14), gh = Math.max(110, H - gy - 40);
        const IMAX = 30e-3, VMAX = 5.5;
        const g = frame(c, C, kit, gx, gy, gw, gh, { x0: 0, x1: VMAX, y0: 0, y1: IMAX * 1e3, xt: [0, 1, 2, 3, 4, 5], yt: [0, 10, 20, 30], xf: t => t + ' V', yf: t => t + ' mA' });
        // the 10 mA reference
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1; dashed(c, true); c.beginPath(); c.moveTo(gx, g.Y(10)); c.lineTo(gx + gw, g.Y(10)); c.stroke(); c.restore();
        kit.label(c, '10 mA', gx + gw - 4, g.Y(10) - 8, { size: 10, color: C.warn, align: 'right' });
        // the LED curve and the resistor line
        const curve = [], is = 5e-3 / (Math.exp(vf / (NID * VT)) - 1);
        for (let u = 0.3; u <= VMAX; u += 0.02) curve.push([u, is * (Math.exp(u / (NID * VT)) - 1) * 1e3]);
        trace(c, gx, gy, gw, gh, curve, g.X, g.Y, C.accent, 2.4);
        const line = [[0, v.vs / R * 1e3], [v.vs, 0]];
        trace(c, gx, gy, gw, gh, line, g.X, g.Y, C.warn, 2);
        // the operating point
        kit.dot(c, g.X(pt.v), g.Y(clamp(pt.i * 1e3, 0, 30)), 6, C.ok);
        kit.label(c, fmtV(pt.v) + ', ' + fmtI(pt.i), clamp(g.X(pt.v) + 10, gx + 4, gx + gw - 4), clamp(g.Y(clamp(pt.i * 1e3, 0, 30)) - 14, gy + 8, gy + gh - 8), { size: 11, color: C.ok, weight: 600, align: g.X(pt.v) + 150 > gx + gw ? 'right' : 'left' });
        kit.label(c, 'LED', gx + 8, gy + 10, { size: 11, color: C.accent, weight: 600, align: 'left' });
        kit.label(c, 'resistor line', gx + 44, gy + 10, { size: 11, color: C.warn, weight: 600, align: 'left' });
        kit.label(c, 'voltage across the LED', gx + gw / 2, gy + gh + 28, { size: 10.5, color: C.muted, align: 'center' });
        // the numbers
        ro.set('i', fmtI(pt.i));
        ro.set('v', fmtV(pt.v) + ' (R drops ' + fmtV(v.vs - pt.v) + ')');
        ro.set('p', fmtP(pt.i * pt.i * R));
        ro.set('spread', fmtI(lo.i) + ' to ' + fmtI(hi.i));
        let verdict;
        if (pt.i < 3e-4) verdict = 'Barely lit: the supply is hardly above the LED voltage.';
        else if (pt.i > 12e-3) verdict = 'More than a pin should give: use a larger resistor.';
        else if (lo.i > 0 && hi.i / lo.i > 2.2) verdict = 'Works, but the current is very sensitive to the LED itself.';
        else verdict = 'Good: a few milliamps, steady from one LED to the next.';
        ro.set('verdict', verdict);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ac-bjt-switch */
  Hyper.sim('ac-bjt-switch', {
    title: 'An NPN transistor as a switch',
    blurb: `A real circuit, solved at every change: a pin drives the base of an NPN transistor through a resistor, and the transistor switches a load from its own supply. The bars show whether the load gets its full current and what the transistor pays for it.

**Try this**
- Leave the load at 70 mA and the base resistor at 1 kΩ: the transistor is **saturated**, drops about 0.1 V and stays cool.
- Raise the base resistor to 10 kΩ and then 47 kΩ: too little base current, the load starves, and the transistor drops volts and gets hot.
- Raise the load current to 300 mA with 1 kΩ: the rule of a forced beta of ten fails, and the readout says so.
- Untick **pin high** and watch everything go to zero; then raise the supply to 12 V and see the hot case get worse.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.95, maxH: 560 });
      const e12 = v => E.eSeries(v, 'E12');
      const ctl = kit.controls(box.side, [
        { id: 'on', type: 'check', label: 'Pin high (3.3 V)', value: true },
        { id: 'Rb', label: 'Base resistor', min: 47, max: 100000, value: 1000, log: true, fmt: v => fmtR(e12(v)) },
        { id: 'Il', label: 'Load current when fully on', min: 5, max: 800, value: 70, log: true, fmt: v => Math.round(v) + ' mA' },
        { id: 'Vs', type: 'select', label: 'Load supply', options: [['5 V', 5], ['12 V', 12]], value: 5 },
        { id: 'beta', label: 'Transistor gain (hFE)', min: 40, max: 400, value: 100, log: true, fmt: v => String(Math.round(v)) }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['ib', 'Base current'], ['ic', 'Load current'], ['vce', 'Collector to emitter'], ['p', 'Heat in the transistor'], ['state', 'State']]);
      function solve() {
        const v = ctl.values, Rb = e12(v.Rb), Rl = v.Vs / (v.Il / 1000);
        const c = new kit.Circuit();
        c.V('pin', 'gnd', v.on ? 3.3 : 0);
        c.R('pin', 'b', Rb);
        const q = c.NPN('col', 'b', 'gnd', { beta: v.beta });
        c.V('vs', 'gnd', v.Vs);
        c.R('vs', 'col', Rl);
        c.dc();
        const ic = Math.max(0, fin(q.ic)), ib = Math.max(0, fin(q.ib)), vce = clamp(fin(c.v('col')), 0, v.Vs);
        return { ic, ib, vce, Rb, Rl, full: v.Vs / Rl };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, r = solve(), W = st.W;
        const xQ = Math.max(190, Math.min(W * 0.4, 320)), yRail = 42, yc = yRail + 100;
        S.rail(c, xQ + 8, yRail, '+' + v.Vs + ' V', { color: C.text2 });
        S.resistor(c, xQ + 8, yRail, xQ + 8, yc - 30, { label: 'load', value: fmtR(r.Rl) });
        const q = S.npn(c, xQ, yc, {});
        S.resistor(c, q.b[0] - 84, yc, q.b[0], yc, { label: 'Rb', value: fmtR(r.Rb) });
        S.ground(c, q.e[0], q.e[1]);
        kit.label(c, v.on ? 'pin 3.3 V' : 'pin 0 V', q.b[0] - 90, yc, { size: 12, weight: 600, color: v.on ? C.accent : C.muted, align: 'right' });
        kit.label(c, 'Ib ' + fmtI(r.ib), q.b[0] - 42, yc + 18, { size: 11, color: C.text2, align: 'center' });
        kit.label(c, 'Ic ' + fmtI(r.ic), xQ + 28, yRail + 62, { size: 11, color: C.text2, align: 'left' });
        kit.label(c, 'Vce ' + fmtV(r.vce), xQ + 34, yc, { size: 11, color: C.text2, align: 'left' });
        // what the numbers mean
        const sat = v.on && r.vce < 0.4, off = !v.on || r.ic < 1e-4;
        const P = r.vce * r.ic;
        const col = off ? C.muted : sat ? C.ok : C.bad;
        const yB = yRail + 160, bw = W - 28;
        bar(c, C, kit, 14, yB, bw, 'Load current, share of full', r.ic / r.full, fmtI(r.ic) + ' of ' + fmtI(r.full), col);
        bar(c, C, kit, 14, yB + 52, bw, 'Voltage across the transistor', r.vce / v.Vs, fmtV(r.vce), col, 0.4 / v.Vs, 'saturated below 0.4 V');
        bar(c, C, kit, 14, yB + 104, bw, 'Heat in the transistor', P / 0.5, fmtP(P), P > 0.25 ? C.bad : P > 0.08 ? C.warn : C.ok, null);
        ro.set('ib', fmtI(r.ib));
        ro.set('ic', fmtI(r.ic) + ' (' + Math.round(100 * r.ic / r.full) + ' % of full)');
        ro.set('vce', fmtV(r.vce));
        ro.set('p', fmtP(P));
        let state;
        if (off) state = 'Off: no base current.';
        else if (sat) state = 'Saturated: a closed switch.' + (r.ib > 0.012 ? ' The pin is giving more than a pin should.' : '');
        else state = 'Under-driven: the transistor is in its linear region and wastes power as heat.';
        ro.set('state', state);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ac-mosfet-gate */
  // square-law models fitted to the on-resistance of the datasheets: 33 mΩ at 4.5 V (logic level), 44 mΩ at 10 V (standard)
  const FETS = {
    logic: { name: 'Logic level (AO3400-like)', vt: 1.0, k: 8.7 },
    std: { name: 'Standard (IRF540-like)', vt: 3.0, k: 3.2 }
  };
  Hyper.sim('ac-mosfet-gate', {
    title: 'A MOSFET and its gate voltage',
    blurb: `The same 12 V load on two kinds of N-channel MOSFET. The curves show the current that reaches the load as the gate voltage rises. The models are simplified (a square-law fit to typical on-resistance figures), so read the shape, not the third digit.

**Try this**
- Set the gate to **3.3 V**, the level of an ESP pin: the logic-level part is fully on, the standard one barely conducts.
- Set the gate to **10 V**: now the standard part is fully on as well, which is what its datasheet assumes.
- Raise the load current to 5 A and look at the heat in the logic-level part with the gate at 3.3 V.
- Watch **on-resistance** in the readout: it is what turns current into heat.`,
    mount(box, kit) {
      const S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 1.0, maxH: 580 });
      const ctl = kit.controls(box.side, [
        { id: 'part', type: 'select', label: 'MOSFET', options: Object.keys(FETS).map(k => [FETS[k].name, k]), value: 'logic' },
        { id: 'vg', label: 'Gate voltage', min: 0, max: 10, step: 0.1, value: 3.3, unit: 'V' },
        { id: 'Il', type: 'select', label: 'Load current when fully on (12 V)', options: [['0.5 A', 0.5], ['1 A', 1], ['2 A', 2], ['5 A', 5]], value: 2 },
        { type: 'buttons', items: [{ id: 'g33', label: 'Gate 3.3 V', primary: true }, { id: 'g5', label: '5 V' }, { id: 'g10', label: '10 V' }] }
      ], (id, val) => {
        if (id === 'g33') ctl.set('vg', 3.3);
        else if (id === 'g5') ctl.set('vg', 5);
        else if (id === 'g10') ctl.set('vg', 10);
        loop.once();
      });
      const ro = kit.readout(box.side, [['id', 'Load current'], ['vds', 'Across the MOSFET'], ['rds', 'On-resistance'], ['p', 'Heat in the MOSFET'], ['state', 'State']]);
      function solve(part, vg, Rl) {
        const F = FETS[part], c = new kit.Circuit();
        c.V('g', 'gnd', vg);
        c.V('vs', 'gnd', 12);
        c.R('vs', 'd', Rl);
        const m = c.NMOS('d', 'g', 'gnd', { vt: F.vt, k: F.k, lambda: 0.01 });
        c.dc();
        const id = Math.max(0, fin(m.id)), vds = clamp(fin(c.v('d')), 0, 12);
        return { id, vds };
      }
      let cache = null;
      function curves(Il) {
        if (cache && cache.Il === Il) return cache;
        const Rl = 12 / Il, out = { Il, Rl };
        for (const k of Object.keys(FETS)) { out[k] = []; for (let u = 0; u <= 10.001; u += 0.2) out[k].push([u, solve(k, u, Rl).id]); }
        cache = out;
        return out;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const Rl = 12 / v.Il, cv = curves(v.Il), now = solve(v.part, v.vg, Rl);
        // the circuit
        const xM = Math.max(190, Math.min(W * 0.4, 320)), yRail = 42, yM = yRail + 100;
        S.rail(c, xM + 8, yRail, '+12 V', { color: C.text2 });
        S.resistor(c, xM + 8, yRail, xM + 8, yM - 30, { label: 'load', value: fmtR(Rl) });
        const m = S.nmos(c, xM, yM, {});
        S.resistor(c, m.g[0] - 84, m.g[1], m.g[0], m.g[1], { label: 'Rg', value: '150 Ω' });
        S.ground(c, m.s[0], m.s[1]);
        kit.label(c, fmtV(v.vg, 1) + ' pin', m.g[0] - 90, m.g[1], { size: 12, weight: 600, color: C.accent, align: 'right' });
        kit.label(c, 'Id ' + fmtI(now.id), xM + 28, yRail + 62, { size: 11, color: C.text2, align: 'left' });
        kit.label(c, 'Vds ' + fmtV(now.vds), xM + 34, yM, { size: 11, color: C.text2, align: 'left' });
        // the curves
        const gx = 56, gy = yRail + 168, gw = Math.max(120, W - gx - 14), gh = Math.max(100, H - gy - 42);
        const full = v.Il;
        const g = frame(c, C, kit, gx, gy, gw, gh, { x0: 0, x1: 10, y0: 0, y1: full * 1.1, xt: [0, 2, 4, 6, 8, 10], yt: [0, full / 2, full], xf: t => t + ' V', yf: t => fmtI(t) });
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1; dashed(c, true); c.beginPath(); c.moveTo(g.X(3.3), gy); c.lineTo(g.X(3.3), gy + gh); c.stroke(); c.restore();
        kit.label(c, '3.3 V pin', g.X(3.3) + 4, gy + 9, { size: 10, color: C.warn, align: 'left' });
        const other = v.part === 'logic' ? 'std' : 'logic';
        trace(c, gx, gy, gw, gh, cv[other], g.X, g.Y, C.muted, 1.6, true);
        trace(c, gx, gy, gw, gh, cv[v.part], g.X, g.Y, C.accent, 2.6);
        kit.dot(c, g.X(v.vg), g.Y(clamp(now.id, 0, full * 1.1)), 6, C.ok);
        kit.label(c, FETS[v.part].name, gx + gw - 6, gy + gh - 22, { size: 11, color: C.accent, weight: 600, align: 'right' });
        kit.label(c, FETS[other].name, gx + gw - 6, gy + gh - 8, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, 'gate voltage', gx + gw / 2, gy + gh + 28, { size: 10.5, color: C.muted, align: 'center' });
        // the numbers
        const rds = now.id > 1e-3 ? now.vds / now.id : null, P = now.id * now.vds;
        ro.set('id', fmtI(now.id) + ' of ' + fmtI(full));
        ro.set('vds', fmtV(now.vds));
        ro.set('rds', rds == null ? 'not conducting' : rds < 1 ? (rds * 1e3).toFixed(0) + ' mΩ' : rds.toFixed(1) + ' Ω');
        ro.set('p', fmtP(P));
        let state;
        if (now.id < 0.02 * full) state = 'Off or nearly: the gate is below the point where the part conducts.';
        else if (now.vds < 0.35) state = 'Fully on: a closed switch with little loss.';
        else state = 'Partly on: it drops volts and turns the difference into heat.';
        ro.set('state', state);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ac-flyback */
  Hyper.sim('ac-flyback', {
    title: 'Switching off a coil',
    blurb: `A 5 V relay coil (71 Ω, 70 mA) is switched on at 4 ms and off at 36 ms by a transistor. The upper trace is the coil current; the lower one is the voltage at the transistor's collector.

**Try this**
- With **no protection**, the current cannot stop at once: the voltage at the collector climbs until the transistor's breakdown stops it. In a real circuit the spike would be far higher than the scale here, and the transistor would take the energy ½ L I² every time.
- Add the **flyback diode**: the collector rises only to 5.7 V, and the current dies slowly through the diode. Read the **release delay**: the relay lets go a few milliseconds later.
- Choose the **diode with a resistor**: a faster release, at the price of a higher spike.
- Make the coil larger and watch the delay grow.`,
    mount(box, kit, params) {
      const S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 1.0, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'prot', type: 'select', label: 'Protection', options: [['None', 'none'], ['Flyback diode (1N4148)', 'diode'], ['Diode and a 220 Ω resistor in series', 'diodeR']], value: ['none', 'diode', 'diodeR'].indexOf(params.protect) >= 0 ? params.protect : 'none' },
        { id: 'L', label: 'Coil inductance', min: 20, max: 500, value: 200, log: true, fmt: v => Math.round(v) + ' mH' },
        { id: 'vbr', type: 'select', label: "Transistor's breakdown voltage", options: [['30 V', 30], ['45 V (BC547)', 45], ['60 V', 60], ['100 V', 100]], value: 45 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['peak', 'Highest voltage at the transistor'], ['delay', 'Release delay'], ['energy', 'Energy into the transistor'], ['verdict', 'Verdict']]);
      const VS = 5, RC = 71, VD = 0.7, RX = 220, TC = 0.004, TO = 0.036, TEND = 0.072;
      function model() {
        const v = ctl.values, L = v.L / 1000, Iinf = VS / RC, tr = L / RC;
        const i0 = Iinf * (1 - Math.exp(-(TO - TC) / tr));
        const Rt = RC + (v.prot === 'diodeR' ? RX : 0);
        let tau = L / Rt, tz;                                      // time for the current to reach zero after switch-off
        if (v.prot === 'none') tz = L * i0 / Math.max(1e-6, v.vbr - VS);
        else tz = tau * Math.log(1 + i0 * Rt / VD);
        const iAt = t => {                                         // coil current
          if (t < TC) return 0;
          if (t < TO) return Iinf * (1 - Math.exp(-(t - TC) / tr));
          const s = t - TO;
          if (s >= tz) return 0;
          if (v.prot === 'none') return i0 - (v.vbr - VS) / L * s;
          return (i0 + VD / Rt) * Math.exp(-s / tau) - VD / Rt;
        };
        const vAt = t => {                                         // voltage at the collector
          if (t < TC) return VS;
          if (t < TO) return 0.1;
          const s = t - TO;
          if (s >= tz) return VS;
          if (v.prot === 'none') return v.vbr;
          return Math.min(v.vbr, VS + VD + (v.prot === 'diodeR' ? RX * iAt(t) : 0));
        };
        // the time at which the current falls below 20 % of the rated value: about where a relay lets go
        let tRel = tz;
        for (let s = 0; s < tz; s += tz / 400) { if (iAt(TO + s) < 0.2 * Iinf) { tRel = s; break; } }
        const peak = vAt(TO + 1e-9);
        return { L, i0, tz, iAt, vAt, tRel, peak, energy: 0.5 * L * i0 * i0 };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, M = model(), W = st.W, H = st.H;
        // the circuit
        const xc = 74, y1 = 40, y2 = 112;
        S.rail(c, xc, y1, '+5 V', { color: C.text2 });
        S.inductor(c, xc, y1, xc, y2, { label: 'coil', value: Math.round(v.L) + ' mH', core: false });
        S.switch(c, xc, y2, xc, y2 + 36, { closed: false });
        S.ground(c, xc, y2 + 36);
        S.node(c, xc, y1); S.node(c, xc, y2);
        if (v.prot !== 'none') {
          S.wire(c, [[xc, y1], [xc + 80, y1]]);
          S.diode(c, xc + 80, y2, xc + 80, y1, { label: v.prot === 'diodeR' ? 'diode + 220 Ω' : 'diode' });
          S.wire(c, [[xc + 80, y2], [xc, y2]]);
        }
        kit.label(c, 'switch (the transistor)', xc + 8, y2 + 24, { size: 10.5, color: C.muted, align: 'left' });
        const tx = Math.max(xc + 150, W * 0.52);
        kit.label(c, 'coil 5 V, 71 Ω, 70 mA', tx, 26, { size: 11, color: C.text2, align: 'left' });
        kit.label(c, 'on at 4 ms, off at 36 ms', tx, 44, { size: 11, color: C.text2, align: 'left' });
        // the traces
        const gx = 54, gw = Math.max(120, W - gx - 14), top = 166, avail = H - top - 44, gh = Math.max(60, avail / 2 - 18);
        const t0 = 0, t1 = TEND, ts = [0, 12, 24, 36, 48, 60, 72];
        const N = 360, ci = [], vv = [];
        for (let k = 0; k <= N; k++) { const t = t0 + (t1 - t0) * k / N; ci.push([t, M.iAt(t) * 1e3]); vv.push([t, M.vAt(t)]); }
        const yA = top, yB = top + gh + 36;
        const gA = frame(c, C, kit, gx, yA, gw, gh, { x0: 0, x1: t1 * 1e3, y0: 0, y1: 80, xt: [0, 12, 24, 36, 48, 60, 72], yt: [0, 40, 80], xf: () => '', yf: t => t + ' mA' });
        const vmax = Math.max(12, v.vbr * 1.15);
        const gB = frame(c, C, kit, gx, yB, gw, gh, { x0: 0, x1: t1 * 1e3, y0: 0, y1: vmax, xt: ts, yt: [0, 5].concat(v.vbr), xf: t => t + ' ms', yf: t => Math.round(t) + ' V' });
        trace(c, gx, yA, gw, gh, ci.map(p => [p[0] * 1e3, p[1]]), gA.X, gA.Y, C.accent, 2.4);
        trace(c, gx, yB, gw, gh, vv.map(p => [p[0] * 1e3, p[1]]), gB.X, gB.Y, v.prot === 'none' ? C.bad : C.ok, 2.4);
        for (const [g, y] of [[gA, yA], [gB, yB]]) {
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 1; dashed(c, true); c.beginPath();
          c.moveTo(g.X(TC * 1e3), y); c.lineTo(g.X(TC * 1e3), y + gh); c.moveTo(g.X(TO * 1e3), y); c.lineTo(g.X(TO * 1e3), y + gh); c.stroke(); c.restore();
        }
        kit.label(c, 'coil current', gx + 6, yA + 9, { size: 11, color: C.accent, weight: 600, align: 'left' });
        kit.label(c, 'voltage at the collector', gx + 6, yB + 9, { size: 11, color: v.prot === 'none' ? C.bad : C.ok, weight: 600, align: 'left' });
        kit.label(c, 'breakdown ' + v.vbr + ' V', gx + gw - 4, gB.Y(v.vbr) - 8, { size: 10, color: C.muted, align: 'right' });
        // the numbers
        ro.set('peak', v.prot === 'none' ? fmtV(M.peak, 0) + ' and stopped only by breakdown' : fmtV(M.peak, 1));
        ro.set('delay', fmtT(M.tRel) + ' (coil current below 20 %)');
        ro.set('energy', v.prot === 'none' ? (M.energy * 1e3).toFixed(2) + ' mJ at every switch-off' : 'almost none');
        ro.set('verdict', v.prot === 'none' ? 'The transistor is hit by the full kick each time: it will fail.' : v.prot === 'diodeR' ? 'Faster release, higher spike: still within the transistor rating.' : 'Safe: the spike is held at the supply plus 0.7 V; the relay lets go later.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ac-level-shift */
  Hyper.sim('ac-level-shift', {
    title: 'An I2C edge through a level shifter',
    blurb: `One I2C byte (the address of a part, then the acknowledge) on the data line. The top trace is the logical level; below it, the voltage on the ESP's side and on the 5 V device's side. With a BSS138 shifter each side has its own pull-up and swings to its own supply.

**Try this**
- Choose **wired straight to the 5 V side**: the ESP's pin now sees 5 V, which it cannot take.
- With the shifter, raise the **pull-up** and the **bus capacitance**: the edges round off, and the rise time passes the limit of the I2C specification.
- Switch to **400 kHz**: the same edges that were fine at 100 kHz are now too slow.
- Lower the pull-up to 1 kΩ: the edges are crisp, but the parts struggle to pull the line low.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.82, maxH: 540 });
      const e12 = v => E.eSeries(v, 'E12');
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Connection', options: [['BSS138 level shifter', 'fet'], ['Wired straight to the 5 V side', 'direct']], value: 'fet' },
        { id: 'R', label: 'Pull-up on each side', min: 1000, max: 22000, value: 4700, log: true, fmt: v => fmtR(e12(v)) },
        { id: 'C', label: 'Bus capacitance per side', min: 20, max: 400, value: 60, log: true, fmt: v => Math.round(v) + ' pF' },
        { id: 'hz', type: 'select', label: 'Bus speed', options: [['100 kHz', 100000], ['400 kHz', 400000]], value: 100000 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['rise', 'Rise time (30 % to 70 %)'], ['esp', "Highest voltage on the ESP's pin"], ['low', 'Pull-up against the parts'], ['verdict', 'Verdict']]);
      // an analogue trace: the line is pulled low while the logical level is 0, and rises through R·C otherwise
      function analogue(edges, t0, t1, vcc, vlow, tau) {
        const n = 320, pts = [];
        let v = vcc, prev = t0;
        for (let k = 0; k <= n; k++) {
          const t = t0 + (t1 - t0) * k / n, dt = t - prev;
          prev = t;
          if (E.proto.levelAt(edges, t) === 0) v = vlow; else v = vcc - (vcc - v) * Math.exp(-dt / Math.max(1e-12, tau));
          pts.push([t, v]);
        }
        return pts;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const R = e12(v.R), tau = R * v.C * 1e-12, direct = v.mode === 'direct';
        const frm = E.proto.i2c({ addr: 0x48, read: false, data: [], hz: v.hz });
        const edges = frm.sda, t0 = edges.length ? edges[0][0] : 0, t1 = frm.t1 > t0 ? frm.t1 : t0 + 1e-4;
        const espTr = analogue(edges, t0, t1, direct ? 5 : 3.3, 0.12, tau), devTr = analogue(edges, t0, t1, 5, direct ? 0.12 : 0.17, tau);
        // the three blocks
        const bw = (W - 28 - 32) / 3, by = 8, bh = 40;
        const b1 = S.box(c, 14, by, bw, bh, { label: 'ESP32', sub: '3.3 V', color: kit.hue(150), active: true });
        const b2 = S.box(c, 14 + bw + 16, by, bw, bh, direct ? { label: 'a wire', sub: 'no shifter', color: C.bad, dash: true } : { label: 'BSS138', sub: 'and two pull-ups', color: kit.hue(40), active: true });
        const b3 = S.box(c, 14 + 2 * (bw + 16), by, bw, bh, { label: 'sensor', sub: '5 V', color: kit.hue(8), active: true });
        S.wire(c, [b1.r, b2.l], { color: C.muted }); S.wire(c, [b2.r, b3.l], { color: C.muted });
        // the traces
        const gx = 40, gw = Math.max(120, W - gx - 14), top = 64, rows = 3, gap = 14, gh = Math.max(44, (H - top - 30 - gap * (rows - 1)) / rows);
        const y0 = top, y1 = top + gh + gap, y2 = top + 2 * (gh + gap);
        S.wave(c, gx, y0 + 6, gw, gh - 12, edges.map(e => e.slice()), { t0, t1, color: C.text2, width: 1.8 });
        kit.label(c, 'logical level of SDA', gx + 4, y0 - 4, { size: 10.5, color: C.text2, weight: 600, align: 'left' });
        const g1 = frame(c, C, kit, gx, y1, gw, gh, { x0: t0, x1: t1, y0: 0, y1: 5.6, xt: [], yt: [0, 3.3, 5], yf: t => String(t) });
        const g2 = frame(c, C, kit, gx, y2, gw, gh, { x0: t0, x1: t1, y0: 0, y1: 5.6, xt: [t0 + (t1 - t0) * 0.0, t0 + (t1 - t0) * 0.5, t1], yt: [0, 3.3, 5], xf: t => Math.round((t - t0) * 1e6) + ' µs', yf: t => String(t) });
        // above what the pin takes
        c.save(); c.fillStyle = 'rgba(229,72,77,.13)'; c.fillRect(gx, g1.Y(5.6), gw, g1.Y(3.6) - g1.Y(5.6)); c.restore();
        trace(c, gx, y1, gw, gh, espTr, g1.X, g1.Y, direct ? C.bad : kit.hue(150, 1), 2.2);
        trace(c, gx, y2, gw, gh, devTr, g2.X, g2.Y, kit.hue(8, 1), 2.2);
        kit.label(c, "the ESP's side", gx + 4, y1 - 4, { size: 10.5, color: C.text2, weight: 600, align: 'left' });
        kit.label(c, 'the 5 V side', gx + 4, y2 - 4, { size: 10.5, color: C.text2, weight: 600, align: 'left' });
        kit.label(c, 'above 3.6 V: too much for the pin', gx + gw - 4, g1.Y(4.6), { size: 10, color: C.bad, align: 'right' });
        // the numbers
        const peak = Math.max.apply(null, espTr.map(p => p[1]));
        const rise = 0.8473 * R * v.C * 1e-12, lim = v.hz === 100000 ? 1000e-9 : 300e-9, rmin = (5 - 0.4) / 0.003;
        ro.set('rise', fmtT(rise) + ' (limit ' + Math.round(lim * 1e9) + ' ns)');
        ro.set('esp', fmtV(peak, 1));
        ro.set('low', R < rmin ? 'Too strong: below ' + fmtR(rmin) + ', the parts cannot reach a low' : 'Fine: above ' + fmtR(rmin));
        let verdict;
        if (direct) verdict = "The ESP's pin sees 5 V and can be damaged.";
        else if (rise > lim) verdict = 'Edges too slow for this speed: lower the pull-ups, the capacitance or the speed.';
        else if (R < rmin) verdict = 'Crisp edges, but the pull-ups are too strong.';
        else verdict = "Good: each side swings to its own supply and the edges meet the specification.";
        ro.set('verdict', verdict);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ac-shift-register */
  Hyper.sim('ac-shift-register', {
    title: 'A byte clocked into a 74HC595',
    blurb: `The byte is sent most significant bit first. Every pulse on SRCLK moves all the bits in the shift register one place to the right and takes in the next bit. The LEDs are on the output latch, which copies the shift register only when RCLK pulses.

**Try this**
- Press **Send the byte** with the latch after the 8th bit: the LEDs stay as they were until the very end, then all change at once.
- Choose **latch after every bit**: the LEDs flicker through every half-shifted pattern.
- Choose **never latch**: the shift register fills and the LEDs never change.
- Untick **outputs enabled**: /OE high turns every output off whatever the latch holds. That is how you keep them dark at power-up.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.95, maxH: 560 });
      const hex2 = b => b.toString(16).toUpperCase().padStart(2, '0');
      const bin8 = b => b.toString(2).padStart(8, '0');
      let anim = 0, play = true;
      const SPEED = 1.5, DUR = 9.6;
      const ctl = kit.controls(box.side, [
        { id: 'byte', label: 'Byte to send', min: 0, max: 255, step: 1, value: 165, fmt: v => '0x' + hex2(Math.round(v)) + ' = ' + bin8(Math.round(v)) },
        { id: 'latch', type: 'select', label: 'Latch pulse', options: [['After the 8th bit (correct)', 'end'], ['After every bit', 'each'], ['Never', 'never']], value: 'end' },
        { id: 'oe', type: 'check', label: 'Outputs enabled (/OE low)', value: true },
        { type: 'buttons', items: [{ id: 'send', label: 'Send the byte', primary: true }] }
      ], (id) => { if (id !== 'oe') { anim = 0; play = true; loop.start(); } else loop.once(); });
      const ro = kit.readout(box.side, [['sent', 'Bits sent so far'], ['shift', 'Shift register'], ['latch', 'Output latch'], ['note', 'What you see']]);
      // the data bit sent at clock k, most significant first
      const dbit = (byte, k) => (byte >> (7 - k)) & 1;
      // the shift register after n clock pulses: cell 0 (Q0) holds the newest bit
      const cellsAfter = (byte, n) => { const a = []; for (let j = 0; j < 8; j++) { const k = n - 1 - j; a.push(k >= 0 ? dbit(byte, k) : 0); } return a; };
      const nClocks = t => { let n = 0; for (let k = 0; k < 8; k++) if (t >= k + 0.4) n++; return n; };
      // the latch events: [time, clocks done at that moment]
      const latchEvents = mode => { const e = []; if (mode === 'end') e.push([8.2, 8]); else if (mode === 'each') for (let k = 0; k < 8; k++) e.push([k + 0.85, k + 1]); return e; };
      const loop = kit.loop((dt) => {
        if (play) { anim += dt * SPEED; if (anim >= DUR) { anim = DUR; play = false; } }
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H, byte = Math.round(v.byte);
        const n = nClocks(anim), cells = cellsAfter(byte, n);
        let latched = [0, 0, 0, 0, 0, 0, 0, 0], lastLatch = -1;
        for (const [t, k] of latchEvents(v.latch)) if (anim >= t) { latched = cellsAfter(byte, k); lastLatch = t; }
        const xs = 96, cw = Math.max(24, Math.min(40, (W - xs - 10) / 8)), yS = 28, yL = yS + cw + 32, yD = yL + cw + 30;
        const labels = ['Q0', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7'];
        kit.label(c, 'each SRCLK pulse moves every bit one place right', xs, yS - 14, { size: 10, color: C.muted, align: 'left' });
        kit.label(c, 'shift register', 6, yS + cw / 2, { size: 11, color: C.text2, weight: 600, align: 'left' });
        S.bits(c, xs, yS, cells, { n: 8, cell: cw, labels, color: kit.hue(210, 1) });
        const flash = lastLatch >= 0 && anim - lastLatch < 0.3;
        kit.label(c, flash ? '▼ RCLK: the latch copies the byte' : '▼ only an RCLK pulse copies it down', xs, yL - 10, { size: 10, color: flash ? C.ok : C.muted, align: 'left', weight: flash ? 700 : 500 });
        kit.label(c, 'output latch', 6, yL + cw / 2, { size: 11, color: C.text2, weight: 600, align: 'left' });
        S.bits(c, xs, yL, latched, { n: 8, cell: cw, labels, color: kit.hue(150, 1) });
        kit.label(c, 'LEDs', 6, yD + 4, { size: 11, color: C.text2, weight: 600, align: 'left' });
        for (let j = 0; j < 8; j++) S.led(c, xs + j * cw + cw / 2, yD + 4, { color: 8, on: v.oe && latched[j] === 1, r: Math.min(9, cw * 0.28) });
        // the three signals over the whole transfer
        const rowH = 22, y0 = yD + 36, gx = xs, gw = Math.max(100, W - gx - 12), t0 = 0, t1 = DUR;
        const ser = [[0, dbit(byte, 0)]], clk = [[0, 0]], lat = [[0, 0]];
        for (let k = 1; k < 8; k++) ser.push([k, dbit(byte, k)]);
        for (let k = 0; k < 8; k++) clk.push([k + 0.4, 1], [k + 0.7, 0]);
        for (const [t] of latchEvents(v.latch)) lat.push([t, 1], [t + 0.12, 0]);
        const wv = (i, edges, label, color) => S.wave(c, gx, y0 + i * (rowH + 12), gw, rowH, edges, { t0, t1, color, label, width: 1.8 });
        const w1 = wv(0, ser, 'SER', kit.hue(210, 1)), w2 = wv(1, clk, 'SRCLK', kit.hue(40, 1)), w3 = wv(2, lat, 'RCLK', kit.hue(150, 1));
        const cx = w1.X(clamp(anim, t0, t1));
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.4; c.beginPath(); c.moveTo(cx, y0 - 4); c.lineTo(cx, y0 + 3 * (rowH + 12) - 8); c.stroke(); c.restore();
        void w2; void w3;
        // the numbers
        ro.set('sent', n + ' of 8');
        ro.set('shift', bin8(parseInt(cells.slice().reverse().join(''), 2)) + '  (Q7 .. Q0)');
        ro.set('latch', bin8(parseInt(latched.slice().reverse().join(''), 2)) + '  (Q7 .. Q0)');
        let note;
        if (!v.oe) note = 'Every output is off: /OE is high.';
        else if (v.latch === 'never') note = 'The LEDs never change: nothing latches the byte.';
        else if (v.latch === 'each') note = 'The LEDs show every half-shifted pattern as it goes by.';
        else note = anim < 8.2 ? 'The LEDs hold the old byte while the new one is shifted in.' : 'The whole byte appeared at once, on the latch pulse.';
        ro.set('note', note);
        if (!play) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ac-opto */
  Hyper.sim('ac-opto', {
    title: 'An optocoupler between two grounds',
    blurb: `A PC817 on the left carries a field signal (a battery, a 12 V or 24 V input) as light to its transistor on the right, where an ESP pin reads it. Nothing electrical crosses the barrier, so the grounds on the two sides need not meet.

**Try this**
- With 12 V and 2.2 kΩ the LED carries about 5 mA, the transistor pulls the pin **low** (the output is inverted), and with the input at 0 V the pull-up holds it high.
- Raise the resistor to 22 kΩ: too little LED current, and the transistor can no longer sink the pull-up's current, so the pin never gets low.
- Lower the **CTR** to 40 %, as an old or poor part might give, and watch the margin shrink.
- Slide the **surge between the grounds**: the signal does not care, up to the part's rating.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 1.0, maxH: 560 });
      const e12 = v => E.eSeries(v, 'E12');
      const ctl = kit.controls(box.side, [
        { id: 'vin', label: 'Input voltage', min: 0, max: 30, step: 0.5, value: 12, unit: 'V' },
        { id: 'R', label: 'Input resistor', min: 330, max: 33000, value: 2200, log: true, fmt: v => fmtR(e12(v)) },
        { id: 'ctr', label: 'Current transfer ratio', min: 30, max: 400, value: 100, log: true, fmt: v => Math.round(v) + ' %' },
        { id: 'rp', type: 'select', label: 'Pull-up on the pin', options: [['Internal, about 45 kΩ', 45000], ['10 kΩ', 10000], ['4.7 kΩ', 4700]], value: 10000 },
        { id: 'surge', label: 'Surge between the two grounds', min: 0, max: 6000, step: 100, value: 0, unit: 'V' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['if', 'LED current'], ['sink', 'Transistor can sink'], ['pin', 'Voltage at the pin'], ['aged', 'With half the CTR'], ['verdict', 'Verdict']]);
      const VCC = 3.3, VF = 1.2, VSAT = 0.2;
      function out(If, ctrPct, Rp) {
        const sink = ctrPct / 100 * If, need = (VCC - VSAT) / Rp;
        const vout = sink >= need ? VSAT : VCC - sink * Rp;
        const level = vout < 0.8 ? 'LOW' : vout > 2.0 ? 'HIGH' : 'in between';
        return { sink, need, vout, level };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const R = e12(v.R), If = Math.max(0, (v.vin - VF) / R), o = out(If, v.ctr, v.rp), aged = out(If, v.ctr / 2, v.rp);
        const cx = W / 2, xl = 34, xr = 108, xp = Math.max(cx + 70, W - 92), yTop = 62, yBot = yTop + 116;
        // the package, the barrier
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.4; c.strokeRect(xr - 26, yTop + 24, xp + 24 - (xr - 26), yBot - yTop - 30); c.restore();
        kit.label(c, 'PC817', cx, yTop + 14, { size: 11, color: C.text2, weight: 600, align: 'center' });
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.5; dashed(c, true); c.beginPath(); c.moveTo(cx, yTop + 24); c.lineTo(cx, yBot - 6); c.stroke(); c.restore();
        kit.label(c, 'isolation barrier', cx, yBot + 38, { size: 10.5, color: C.warn, align: 'center' });
        // the input side
        S.battery(c, xl, yTop, xl, yBot, { value: v.vin.toFixed(1) + ' V' });
        S.resistor(c, xl, yTop, xr, yTop, { label: 'R', value: fmtR(R) });
        S.diode(c, xr, yTop, xr, yBot, { kind: 'led', on: If > 2e-4, glow: '#ff5a4d' });
        S.wire(c, [[xr, yBot], [xl, yBot]]);
        const gax = (xl + xr) / 2;
        S.node(c, gax, yBot);
        S.ground(c, gax, yBot);
        // the output side
        S.rail(c, xp, yTop, '3.3 V', { color: C.text2 });
        S.resistor(c, xp, yTop, xp, yTop + 56, { label: 'pull-up', value: fmtR(v.rp) });
        const q = S.npn(c, xp - 8, yTop + 86, { labels: false });
        S.wire(c, [[xp, yTop + 56], [xp + 28, yTop + 56]]);
        S.node(c, xp, yTop + 56);
        kit.label(c, 'GPIO', xp + 32, yTop + 56, { size: 11, color: C.text2, weight: 600, align: 'left' });
        const off = clamp(v.surge / 6000, 0, 1) * 18;
        S.wire(c, [q.e, [q.e[0], q.e[1] + off]]);
        S.ground(c, q.e[0], q.e[1] + off);
        // the light
        if (If > 2e-4) { const a = clamp(If / 0.008, 0.25, 1); c.save(); c.globalAlpha = a; kit.arrow(c, xr + 14, yTop + 52, xp - 40, yTop + 52, C.warn, 1.8); kit.arrow(c, xr + 14, yTop + 68, xp - 40, yTop + 68, C.warn, 1.8); c.restore(); }
        kit.label(c, v.surge > 0 ? 'the two grounds differ by ' + Math.round(v.surge) + ' V' : 'ground A and ground B are separate', cx, yBot + 52, { size: 10.5, color: v.surge > 0 ? C.warn : C.muted, align: 'center' });
        // the bars
        const yb = yBot + 80, bw = W - 28, lvlCol = o.level === 'LOW' || o.level === 'HIGH' ? C.ok : C.bad;
        bar(c, C, kit, 14, yb, bw, 'LED current', If / 0.02, fmtI(If), If > 0.012 ? C.warn : C.accent);
        bar(c, C, kit, 14, yb + 52, bw, 'Sink available, against need', o.sink / (2 * o.need), fmtI(o.sink) + ' (needs ' + fmtI(o.need) + ')', o.sink >= o.need ? C.ok : C.bad, 0.5, 'needed');
        bar(c, C, kit, 14, yb + 104, bw, 'Voltage at the pin', o.vout / VCC, fmtV(o.vout) + ' reads as ' + o.level, lvlCol);
        // the numbers
        ro.set('if', fmtI(If));
        ro.set('sink', fmtI(o.sink) + ' against ' + fmtI(o.need) + ' needed');
        ro.set('pin', fmtV(o.vout) + ' (' + o.level + ')');
        ro.set('aged', aged.level + ' at ' + fmtV(aged.vout));
        let verdict;
        if (v.surge > 5000) verdict = "The surge is beyond the part's isolation rating of about 5 kV.";
        else if (v.vin < 2) verdict = 'Input off: the transistor is dark, the pull-up holds the pin high.';
        else if (o.level !== 'LOW') verdict = 'The input is on, but the pin does not reach a clear low: more LED current or a weaker pull-up.';
        else if (aged.level !== 'LOW') verdict = 'Works now, but fails when the part ages: raise the LED current.';
        else verdict = 'The input is on and the pin reads LOW with margin: the signal is inverted.';
        ro.set('verdict', verdict);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ac-adc-resolution */
  Hyper.sim('ac-adc-resolution', {
    title: 'Small signals: ESP ADC and ADS1115',
    blurb: `One slow cycle of a signal that rises from 0 to its peak and back, read by the ESP's 12-bit ADC (about 3.1 V full scale) and by an ADS1115 with the range you choose. The thin line is the true signal; the steps are what each converter reports.

**Try this**
- At a **20 mV** peak the ESP's staircase has about 26 steps and the ADS1115 on ±0.256 V thousands: the curve looks smooth.
- Choose the **±6.144 V** range for the same signal: the ADS1115 steps are 24 times larger, because the gain is thrown away.
- Raise the peak above 256 mV on the ±0.256 V range: the reading clips at the range.
- Tick **the ESP's noise** to see the jitter of a few steps that sits on top of the quantisation.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.66, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'A', label: 'Signal peak', min: 1, max: 3000, value: 20, log: true, fmt: v => (v < 10 ? v.toFixed(1) : String(Math.round(v))) + ' mV' },
        { id: 'fsr', type: 'select', label: 'ADS1115 range', options: [['±6.144 V', 6.144], ['±4.096 V', 4.096], ['±2.048 V', 2.048], ['±1.024 V', 1.024], ['±0.512 V', 0.512], ['±0.256 V', 0.256]], value: 0.256 },
        { id: 'noise', type: 'check', label: "Add the ESP's noise", value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['esp', 'ESP step'], ['espn', 'ESP steps across the signal'], ['ads', 'ADS1115 step'], ['adsn', 'ADS1115 counts across the signal'], ['note', 'Note']]);
      const ESP_FS = 3100, ESP_BITS = 12;                    // mV and bits: the widest range
      const lsbEsp = ESP_FS / Math.pow(2, ESP_BITS);
      const fmtStep = mv => (mv >= 0.1 ? mv.toFixed(mv >= 1 ? 1 : 2) + ' mV' : (mv * 1000).toFixed(mv >= 0.01 ? 0 : 1) + ' µV');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const A = v.A, fsr = v.fsr * 1000, lsbAds = fsr / 32768;
        const sig = t => A / 2 * (1 - Math.cos(2 * Math.PI * t));
        const jitter = t => (v.noise ? lsbEsp * (1.6 * Math.sin(97.3 * t) + 1.1 * Math.sin(211.7 * t + 1) + 0.8 * Math.sin(53.1 * t + 2)) : 0);
        const esp = t => Math.max(0, Math.round((sig(t) + jitter(t)) / lsbEsp) * lsbEsp);
        const ads = t => Math.min(fsr, Math.round(sig(t) / lsbAds) * lsbAds);
        const gx = 62, gy = 18, gw = Math.max(120, W - gx - 14), gh = Math.max(100, H - gy - 48);
        const ymax = Math.max(A, 1e-3) * 1.1;
        const nice = [0, A / 2, A];
        const g = frame(c, C, kit, gx, gy, gw, gh, { x0: 0, x1: 1, y0: 0, y1: ymax, xt: [0, 0.25, 0.5, 0.75, 1], yt: nice, xf: t => '', yf: t => (t < 10 ? t.toFixed(1) : String(Math.round(t))) + ' mV' });
        const N = Math.max(200, Math.round(gw)), pe = [], pa = [], pt = [];
        for (let k = 0; k <= N; k++) { const t = k / N; pe.push([t, esp(t)]); pa.push([t, ads(t)]); pt.push([t, sig(t)]); }
        trace(c, gx, gy, gw, gh, pt, g.X, g.Y, C.muted, 1.2);
        trace(c, gx, gy, gw, gh, pe, g.X, g.Y, C.warn, 2);
        trace(c, gx, gy, gw, gh, pa, g.X, g.Y, C.accent, 2);
        kit.label(c, 'ESP32 ADC, 12 bits', gx + 8, gy + 10, { size: 11, color: C.warn, weight: 600, align: 'left' });
        kit.label(c, 'ADS1115, 16 bits', gx + 8, gy + 25, { size: 11, color: C.accent, weight: 600, align: 'left' });
        kit.label(c, 'the true signal', gx + 8, gy + 40, { size: 11, color: C.muted, weight: 600, align: 'left' });
        kit.label(c, 'one cycle of the signal', gx + gw / 2, gy + gh + 22, { size: 10.5, color: C.muted, align: 'center' });
        ro.set('esp', fmtStep(lsbEsp));
        ro.set('espn', String(Math.max(1, Math.round(A / lsbEsp))));
        ro.set('ads', fmtStep(lsbAds));
        ro.set('adsn', String(Math.max(1, Math.round(Math.min(A, fsr) / lsbAds))));
        ro.set('note', A > fsr ? 'The signal is above the ADS1115 range: the reading clips at ' + fmtV(fsr / 1000, 3) + '.' : lsbAds > lsbEsp ? 'This range is coarser than the ESP: choose a smaller one.' : 'The ADS1115 steps are ' + Math.round(lsbEsp / lsbAds) + ' times finer than the ESP.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ac-opamp-gain */
  Hyper.sim('ac-opamp-gain', {
    title: 'An op-amp in front of the ADC',
    blurb: `A non-inverting amplifier (gain 1 + Rf / Rg, with Rg = 10 kΩ) raises a small sensor signal for the ESP's ADC. The curve is the output against the input: the dashed line is the ideal gain, the solid one is what the op-amp can do between its rails. The green band is the ADC's good range; above 3.6 V the pin is at risk.

**Try this**
- With the **MCP6002** on 3.3 V and a gain of 11, a 120 mV signal gives about 1.3 V: comfortably in the green band.
- Switch to the **LM358**: its output cannot come within about 1.5 V of the supply, so the curve flattens at 1.8 V.
- Power the op-amp from **5 V** with a large gain: the output goes above what the ADC pin takes.
- Raise the **input offset**: it is multiplied by the gain, and appears at the output as an error.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.schem, SY = kit.esym;
      const st = kit.stage(box.stage, { aspect: 1.05, maxH: 580 });
      const e12 = v => E.eSeries(v, 'E12');
      const RG = 10000;
      const ctl = kit.controls(box.side, [
        { id: 'vin', label: 'Sensor signal', min: 0, max: 300, step: 1, value: 120, unit: 'mV' },
        { id: 'Rf', label: 'Feedback resistor Rf', min: 1000, max: 470000, value: 100000, log: true, fmt: v => fmtR(e12(v)) },
        { id: 'vcc', type: 'select', label: 'Op-amp supply', options: [['3.3 V', 3.3], ['5 V', 5]], value: 3.3 },
        { id: 'part', type: 'select', label: 'Op-amp', options: [['MCP6002 (rail to rail)', 'rr'], ['LM358', 'lm']], value: 'rr' },
        { id: 'off', label: 'Input offset', min: 0, max: 5, step: 0.5, value: 1, unit: 'mV' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['gain', 'Gain'], ['out', 'Output voltage'], ['adc', 'At the ADC pin'], ['fit', 'Largest signal that fits'], ['err', 'Error from the offset']]);
      function amp(v, vin) {
        const G = 1 + e12(v.Rf) / RG, ideal = G * (vin + v.off) / 1000;
        const top = v.part === 'rr' ? v.vcc - 0.02 : v.vcc - 1.5, bot = v.part === 'rr' ? 0.02 : 0.03;
        return { G, ideal, out: clamp(ideal, bot, Math.max(bot, top)), top, clipped: ideal > top };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        const a = amp(v, v.vin), Rf = e12(v.Rf);
        // the block diagram
        const ox = Math.max(170, Math.min(W * 0.4, 250)), oy = 92;
        const op = S.opamp(c, ox, oy, {});
        SY.box(c, 6, oy, 56, 30, { label: 'sensor', size: 11 });
        S.wire(c, [[62, oy + 15], op.inp]);
        S.wire(c, [op.out, [ox + 70, oy], [ox + 70, oy - 48]]);
        S.resistor(c, ox + 70, oy - 48, ox - 62, oy - 48, { label: 'Rf', value: fmtR(Rf) });
        S.wire(c, [[ox - 62, oy - 48], [ox - 62, oy - 15], op.inn]);
        S.node(c, ox - 62, oy - 15);
        S.wire(c, [[ox - 62, oy - 15], [ox - 62, oy + 40]]);
        S.resistor(c, ox - 62, oy + 40, ox - 62, oy + 92, { label: 'Rg', value: '10 kΩ' });
        S.ground(c, ox - 62, oy + 92);
        S.wire(c, [[ox + 70, oy], [ox + 100, oy]]);
        const adcOk = a.out <= 3.1 && a.out >= 0.15, adcRisk = a.out > 3.6;
        SY.box(c, ox + 100, oy - 16, Math.max(60, W - ox - 108), 32, { label: 'ADC pin', size: 11, color: adcRisk ? C.bad : adcOk ? C.ok : C.warn, active: true });
        kit.label(c, 'powered from ' + v.vcc + ' V', ox + 8, oy + 52, { size: 10.5, color: C.muted, align: 'center' });
        // the transfer curve
        const gx = 52, gy = 224, gw = Math.max(120, W - gx - 14), gh = Math.max(90, H - gy - 44);
        const g = frame(c, C, kit, gx, gy, gw, gh, { x0: 0, x1: 300, y0: 0, y1: 5.4, xt: [0, 100, 200, 300], yt: [0, 1, 2, 3, 4, 5], xf: t => t + ' mV', yf: t => t + ' V' });
        c.save();
        c.fillStyle = C.dark ? 'rgba(34,179,122,.16)' : 'rgba(34,179,122,.18)'; c.fillRect(gx, g.Y(3.1), gw, g.Y(0.15) - g.Y(3.1));
        c.fillStyle = 'rgba(229,72,77,.14)'; c.fillRect(gx, g.Y(5.4), gw, g.Y(3.6) - g.Y(5.4));
        c.restore();
        kit.label(c, "ADC's good range", gx + gw - 6, g.Y(1.2), { size: 10.5, color: C.ok, align: 'right' });
        kit.label(c, 'above 3.6 V: the pin is at risk', gx + gw - 6, g.Y(4.6), { size: 10.5, color: C.bad, align: 'right' });
        const ideal = [], real = [];
        for (let u = 0; u <= 300; u += 5) { const r = amp(v, u); ideal.push([u, r.ideal]); real.push([u, r.out]); }
        trace(c, gx, gy, gw, gh, ideal, g.X, g.Y, C.muted, 1.5, true);
        trace(c, gx, gy, gw, gh, real, g.X, g.Y, C.accent, 2.6);
        kit.dot(c, g.X(v.vin), g.Y(a.out), 6, adcRisk ? C.bad : adcOk ? C.ok : C.warn);
        kit.label(c, 'sensor signal', gx + gw / 2, gy + gh + 28, { size: 10.5, color: C.muted, align: 'center' });
        // the numbers
        const fitV = Math.min(a.top, 2.8), fit = Math.max(0, fitV / a.G * 1000 - v.off);
        ro.set('gain', a.G.toFixed(a.G < 10 ? 2 : 1));
        ro.set('out', fmtV(a.out) + (a.clipped ? ' (clipped at the rail)' : ''));
        ro.set('adc', adcRisk ? 'Too high: above 3.6 V the pin can be damaged' : a.out > 3.1 ? 'Above the ADC range: it reads flat' : a.out < 0.15 ? 'Below the range where the ADC reads well' : 'Good: inside the range');
        ro.set('fit', Math.round(fit) + ' mV');
        ro.set('err', (a.G * v.off).toFixed(0) + ' mV at the output');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
