/* HYPER-ELECTRONICS · sims/fundamentals.js — simulations for Circuit Fundamentals
 * (dc-basics, circuit-analysis, measurement). Every circuit is solved by kit.Circuit
 * and drawn with kit.schem. Filament lamps are resistors whose value follows their
 * voltage (a tungsten model), found by repeating the circuit solution to a fixed point. */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  /* speed of the current dots (px/s): log-compressed so that µA and A both move */
  const spd = i => Math.sign(i) * Math.min(110, 26 * Math.log10(1 + Math.abs(i) / 1e-6));
  /* engineering format that shows round-off and leakage noise (below a nanounit) as zero */
  const eng = (kit, v, u) => kit.eng(Math.abs(v) < 1e-9 ? 0 : v, u);
  const sgn = (v, d) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(d == null ? 2 : d);

  /* A tungsten filament lamp rated L.v volts, L.p watts: hot resistance V²/P, cold
     about a twelfth of that, and in between R rises as |V|^0.45 (so I ∝ V^0.55). */
  function lampR(v, L) {
    const Rh = L.v * L.v / L.p, Rc = Rh / 12;
    return Rc + (Rh - Rc) * Math.pow(Math.min(Math.abs(v) / L.v, 3), 0.45);
  }
  /* solve a circuit whose lamps (resistor elements) follow lampR: damped fixed point */
  function solveLamps(c, lamps) {
    for (let k = 0; k < 150; k++) {
      c.dc();
      let dmax = 0;
      for (const L of lamps) {
        const nr = 0.4 * L.el.r + 0.6 * lampR(c.v(L.a) - c.v(L.b), L.spec);
        dmax = Math.max(dmax, Math.abs(nr - L.el.r) / L.el.r);
        L.el.r = nr;
      }
      if (dmax < 1e-7) break;
    }
    c.dc();
  }
  /* glow colour of a filament at a fraction of its rated power: dull orange to warm white */
  function glowOf(frac) {
    const f = clamp(frac, 0, 1.3);
    const g = Math.round(90 + 150 * Math.min(1, f)), b = Math.round(40 + 140 * Math.max(0, f - 0.5));
    return 'rgb(255,' + g + ',' + Math.min(220, b) + ')';
  }

  /* ================================================================ Ohm's law bench */
  Hyper.sim('fund-ohm', {
    title: 'Ohm\'s law bench: I–V curves',
    blurb: `A variable supply drives the device under test, with the ammeter in series and the voltmeter across the device. The graph traces the device's whole current–voltage curve as the supply sweeps from −12 V to +12 V, and marks where it is now.

- **Resistor**: a straight line through the origin with slope 1/R — Ohm's law. The static resistance V/I and the dynamic resistance ΔV/ΔI agree everywhere. Try a small resistor at 12 V and watch its power.
- **Lamp**: the curve bends over as the filament heats. Compare V/I at 1 V and at 12 V: it more than doubles, and cold tungsten is lower still.
- **Diode and LED** (each protected by a 100 Ω resistor): almost nothing flows until about 0.6 V (1.8 V for the red LED), then the current shoots up. Compare V/I with ΔV/ΔI there: the dynamic resistance is far smaller.
- Reverse the supply: resistor and lamp do not care about polarity; the diodes block.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 250 });
      const S = kit.schem;
      const LAMP = { v: 12, p: 1.2 };
      const ctl = kit.controls(box.side, [
        { id: 'dev', type: 'select', label: 'Device under test', options: [['Resistor', 'res'], ['Filament lamp, 12 V 0.1 A', 'lamp'], ['Silicon diode (with 100 Ω)', 'diode'], ['Red LED (with 100 Ω)', 'led']], value: 'res' },
        { id: 'vs', label: 'Supply voltage', min: -12, max: 12, step: 0.1, value: 5, unit: 'V' },
        { id: 'r', label: 'Resistor value', min: 10, max: 1000, value: 100, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') }
      ], () => solve());
      const ro = kit.readout(box.side, [['v', 'Voltage across device'], ['i', 'Current'], ['rs', 'Static R = V/I'], ['rd', 'Dynamic r = ΔV/ΔI'], ['p', 'Power in device']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'voltage across the device (V)' }, y: { label: 'current (mA)' } }, 200);
      const V = ctl.values;
      let op = { v: 0, i: 0 }, curve = [], key = '', ph = 0;

      const protectedDev = d => d === 'diode' || d === 'led';
      function measure(dev, vs) {
        const c = new kit.Circuit();
        c.V('s', 'gnd', vs);
        const top = protectedDev(dev) ? 'a' : 's';
        if (top === 'a') c.R('s', 'a', 100);
        let el;
        if (dev === 'res') { el = c.R(top, 'gnd', V.r); c.dc(); }
        else if (dev === 'lamp') { el = c.R(top, 'gnd', 60); solveLamps(c, [{ el, spec: LAMP, a: top, b: 'gnd' }]); }
        else { el = c.D(top, 'gnd', dev === 'led' ? { is: 1e-18, n: 2 } : {}); c.dc(); }
        return { v: c.v(top), i: el.i };
      }
      function solve() {
        const dev = V.dev;
        ctl.show('r', dev === 'res');
        const k = dev + (dev === 'res' ? V.r : '');
        if (k !== key) {
          key = k;
          curve = [];
          for (let j = 0; j <= 96; j++) { const m = measure(dev, -12 + 24 * j / 96); curve.push([m.v, m.i * 1000]); }
        }
        op = measure(dev, V.vs);
        const a = measure(dev, V.vs - 0.05), b = measure(dev, V.vs + 0.05);
        const di = b.i - a.i, dv = b.v - a.v;
        ro.set('v', eng(kit, op.v, 'V'));
        ro.set('i', eng(kit, op.i, 'A'));
        ro.set('rs', Math.abs(op.i) > 1e-9 ? kit.eng(op.v / op.i, 'Ω') : 'no current: very large');
        ro.set('rd', Math.abs(di) > 1e-12 && dv / di < 1e9 ? kit.eng(dv / di, 'Ω') : 'very large (blocking)');
        ro.set('p', eng(kit, op.v * op.i, 'W'));
        const vmax = Math.max(...curve.map(p => p[0]));
        const xr = protectedDev(dev) ? [Math.min(-2, op.v - 0.3), vmax + 0.3] : [-12.5, 12.5];
        const pts = curve.filter(p => p[0] >= xr[0] && p[0] <= xr[1]);
        plot.set({
          x: { label: 'voltage across the device (V)', min: xr[0], max: xr[1] },
          y: { label: 'current (mA)' },
          series: [{ pts, label: dev === 'res' ? 'resistor ' + kit.eng(V.r, 'Ω') : dev === 'lamp' ? 'filament lamp' : dev === 'led' ? 'red LED' : 'silicon diode' }],
          marks: [{ x: op.v, y: op.i * 1000 }],
          hlines: [{ y: 0 }], vlines: [{ x: 0 }]
        });
        loop.once();
      }
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const x0 = W * 0.1, xa = W * 0.27, xd = W * 0.62, xv = W * 0.8, top = Hh * 0.2, bot = Hh * 0.84, mid = (top + bot) / 2;
        const dev = V.dev, prot = protectedDev(dev);
        ph += spd(op.i) * (dt || 0);
        // wiring first, then the moving charge, then the parts on top of it
        S.wire(c, [[x0, mid - 26], [x0, top], [xd, top], [xv, top], [xv, mid - 16]]);
        S.wire(c, [[xd, top], [xd, mid - 34]]);
        S.wire(c, [[xd, mid + 34], [xd, bot]]);
        S.wire(c, [[xv, mid + 16], [xv, bot]]);
        S.wire(c, [[x0, mid + 26], [x0, bot], [xv, bot]]);
        S.flow(c, [[x0, mid + 26], [x0, mid - 26], [x0, top], [xd, top], [xd, bot], [x0, bot], [x0, mid + 26]], ph, { color: C.warn });
        S.vsource(c, x0, mid - 26, x0, mid + 26, { label: 'supply', value: eng(kit, V.vs, 'V'), labelOffset: 26 });
        S.meter(c, xa, top, 'A', null, { color: C.warn });
        kit.label(c, eng(kit, op.i, 'A'), xa, top - 26, { align: 'center', color: C.warn, weight: 600 });
        if (prot) {
          const r1 = W * 0.38, r2 = W * 0.52;
          c.fillStyle = C.bg2; c.fillRect(r1 + 2, top - 9, r2 - r1 - 4, 18);
          S.resistor(c, r1, top, r2, top, { label: '100 Ω', value: 'protection', labelOffset: 22 });
        }
        const pw = op.v * op.i;
        if (dev === 'res') S.resistor(c, xd, mid - 34, xd, mid + 34, { label: 'R', value: kit.eng(V.r, 'Ω') });
        else if (dev === 'lamp') {
          const f = pw / LAMP.p;
          S.wire(c, [[xd, mid - 34], [xd, mid - 18]]); S.wire(c, [[xd, mid + 18], [xd, mid + 34]]);
          S.lamp(c, xd, mid - 18, xd, mid + 18, { on: f > 0.01, brightness: Math.pow(clamp(f, 0, 1), 0.6), glow: glowOf(f), label: 'lamp', value: '12 V 0.1 A' });
        } else {
          S.wire(c, [[xd, mid - 34], [xd, mid - 14]]); S.wire(c, [[xd, mid + 14], [xd, mid + 34]]);
          S.diode(c, xd, mid - 14, xd, mid + 14, dev === 'led' ? { kind: 'led', on: op.i > 5e-4, glow: '#ff4040', label: 'LED', labelOffset: 34 } : { label: 'diode', labelOffset: 20 });
        }
        S.node(c, xd, top); S.node(c, xd, bot);
        // voltmeter across the device
        S.meter(c, xv, mid, 'V', null, { color: C.accent });
        kit.label(c, eng(kit, op.v, 'V'), xv + 24, mid, { color: C.accent, weight: 600 });
        S.ground(c, (x0 + xa) / 2, bot);
        // warnings from the bench
        let warn = '';
        if (dev === 'res' && Math.abs(pw) > 0.25) warn = kit.eng(Math.abs(pw), 'W') + ' — a 0.25 W resistor would overheat';
        if (dev === 'led' && op.i > 0.03) warn = 'over 30 mA: an indicator LED would be damaged';
        if (warn) kit.label(c, warn, W * 0.5, Hh - 12, { align: 'center', color: C.bad, weight: 600 });
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      solve();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ lamps in series and parallel */
  Hyper.sim('fund-lamps', {
    title: 'Lamps in series and in parallel',
    blurb: `Three filament lamps on a 12 V battery. The glow shows each lamp's power as a share of its rating (the light itself falls off even faster: a filament at a fifth of its power is a dull orange). The dots show the current.

- **Series**: one current flows through every lamp and they share the voltage. Take lamp 3 out of its socket — the loop is broken and everything goes dark.
- **Parallel**: each lamp has the full battery voltage and draws its own current; the battery supplies the sum. Remove lamp 3 and the others do not notice.
- Make lamp 2 a 21 W lamp. In parallel it is the brightest; in series it barely glows while the 5 W lamps light up — the same current, and the 5 W lamp has four times the resistance.
- In series each lamp gets a third of the voltage but much more than a ninth of the power: a cooler filament has a lower resistance.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const S = kit.schem;
      params = params || {};
      const ctl = kit.controls(box.side, [
        { id: 'conn', type: 'select', label: 'Connection', options: [['In series', 'series'], ['In parallel', 'parallel']], value: params.conn === 'parallel' ? 'parallel' : 'series' },
        { id: 'l2', type: 'select', label: 'Lamp 2', options: [['12 V 5 W, like the others', 5], ['12 V 21 W', 21]], value: params.mixed ? 21 : 5 },
        { id: 'l3', type: 'check', label: 'Lamp 3 in its socket', value: true },
        { id: 'vb', label: 'Battery voltage', min: 0, max: 14, step: 0.1, value: 12, unit: 'V' }
      ], () => solve());
      const ro = kit.readout(box.side, [['i', 'Battery current'], ['p', 'Total power'], ['L1', 'Lamp 1'], ['L2', 'Lamp 2'], ['L3', 'Lamp 3']]);
      const V = ctl.values;
      let res = null;
      const ph = [0, 0, 0, 0];

      function solve() {
        const specs = [{ v: 12, p: 5 }, { v: 12, p: V.l2 }, { v: 12, p: 5 }];
        const c = new kit.Circuit();
        const bat = c.V('p', 'gnd', V.vb, { r: 0.05 });
        let lamps;
        if (V.conn === 'series') {
          lamps = [['p', 'n1'], ['n1', 'n2'], ['n3', 'gnd']];
          c.SW('n2', 'n3', V.l3);
        } else {
          lamps = [['p', 'gnd'], ['p', 'gnd'], ['n3', 'gnd']];
          c.SW('p', 'n3', V.l3);
        }
        lamps = lamps.map((ab, k) => ({ a: ab[0], b: ab[1], spec: specs[k], el: c.R(ab[0], ab[1], specs[k].v * specs[k].v / specs[k].p) }));
        solveLamps(c, lamps);
        res = { bat, lamps: lamps.map(L => { const v = c.v(L.a) - c.v(L.b); return { v, i: L.el.i, p: v * L.el.i, spec: L.spec }; }) };
        ro.set('i', eng(kit, res.bat.i, 'A'));
        ro.set('p', eng(kit, res.bat.p, 'W'));
        res.lamps.forEach((L, k) => ro.set('L' + (k + 1), (k === 2 && !V.l3) ? 'removed' : eng(kit, L.v, 'V') + ', ' + eng(kit, L.p, 'W') + ' (' + Math.round(100 * L.p / L.spec.p) + ' %)'));
        loop.once();
      }
      function lampAt(c, C, k, x1, y1, x2, y2) {
        const L = res.lamps[k];
        const f = L.p / L.spec.p;
        if (k === 2 && !V.l3) {
          // an empty socket
          S.wire(c, [[x1, y1], [x1 + (x2 - x1) * 0.3, y1 + (y2 - y1) * 0.3]]);
          S.wire(c, [[x1 + (x2 - x1) * 0.7, y1 + (y2 - y1) * 0.7], [x2, y2]]);
          S.node(c, x1 + (x2 - x1) * 0.3, y1 + (y2 - y1) * 0.3, { r: 3, color: C.muted });
          S.node(c, x1 + (x2 - x1) * 0.7, y1 + (y2 - y1) * 0.7, { r: 3, color: C.muted });
          return;
        }
        S.lamp(c, x1, y1, x2, y2, { on: f > 0.005, brightness: Math.pow(clamp(f, 0, 1), 0.6), glow: glowOf(f), label: 'L' + (k + 1), value: L.spec.p + ' W', labelOffset: 30 });
      }
      function draw(dt) {
        if (!res) return;
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const x0 = W * 0.1, top = Hh * 0.24, bot = Hh * 0.82, mid = (top + bot) / 2, xr = W * 0.88;
        const I = res.lamps.map(L => L.i);
        S.battery(c, x0, mid - 18, x0, mid + 18, { label: 'battery', value: eng(kit, V.vb, 'V'), labelOffset: 22 });
        S.ground(c, x0 + 30, bot);
        if (V.conn === 'series') {
          const xs = [0.3, 0.5, 0.7].map(f => W * f);
          S.wire(c, [[x0, mid - 18], [x0, top], [xs[0] - 22, top]]);
          for (let k = 0; k < 3; k++) {
            lampAt(c, C, k, xs[k] - 22, top, xs[k] + 22, top);
            S.wire(c, [[xs[k] + 22, top], [k < 2 ? xs[k + 1] - 22 : xr, top]]);
            const L = res.lamps[k];
            if (!(k === 2 && !V.l3)) {
              kit.label(c, eng(kit, L.v, 'V'), xs[k], top + 32, { align: 'center', size: 12, color: C.accent });
              kit.label(c, eng(kit, L.p, 'W'), xs[k], top + 48, { align: 'center', size: 12, color: C.muted });
            }
          }
          S.wire(c, [[xr, top], [xr, bot], [x0, bot], [x0, mid + 18]]);
          ph[0] += spd(res.bat.i) * (dt || 0);
          if (Math.abs(res.bat.i) > 1e-6) S.flow(c, [[x0, mid + 18], [x0, mid - 18], [x0, top], [xr, top], [xr, bot], [x0, bot], [x0, mid + 18]], ph[0], { color: C.warn });
          kit.label(c, V.l3 ? 'the same ' + eng(kit, res.bat.i, 'A') + ' flows through every lamp' : 'lamp 3 is out: the loop is broken and no current flows', W * 0.5, bot + 20, { align: 'center', size: 12, color: V.l3 ? C.warn : C.bad });
        } else {
          const xs = [0.36, 0.58, 0.8].map(f => W * f);
          S.wire(c, [[x0, mid - 18], [x0, top], [xs[2], top]]);
          S.wire(c, [[x0, mid + 18], [x0, bot], [xs[2], bot]]);
          for (let k = 0; k < 3; k++) {
            S.wire(c, [[xs[k], top], [xs[k], mid - 22]]);
            S.wire(c, [[xs[k], mid + 22], [xs[k], bot]]);
            lampAt(c, C, k, xs[k], mid - 22, xs[k], mid + 22);
            if (k < 2) { S.node(c, xs[k], top); S.node(c, xs[k], bot); }
            const L = res.lamps[k];
            if (!(k === 2 && !V.l3)) {
              kit.label(c, eng(kit, L.i, 'A'), xs[k] - 10, top - 12, { align: 'right', size: 12, color: C.warn });
              kit.label(c, 'uses ' + eng(kit, L.p, 'W'), xs[k] + 16, mid + 40, { size: 12, color: C.muted });
            }
            ph[k + 1] += spd(I[k]) * (dt || 0);
            if (Math.abs(I[k]) > 1e-6) S.flow(c, [[x0, mid + 18], [x0, mid - 18], [x0, top], [xs[k], top], [xs[k], bot], [x0, bot], [x0, mid + 18]], ph[k + 1], { color: C.warn });
          }
          kit.label(c, 'every lamp has ' + eng(kit, res.lamps[0].v, 'V') + ' across it; the battery supplies ' + eng(kit, res.bat.i, 'A'), W * 0.5, bot + 20, { align: 'center', size: 12, color: C.accent });
        }
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      solve();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Kirchhoff's laws (and superposition) */
  Hyper.sim('fund-kirchhoff', {
    title: 'Kirchhoff\'s laws: two sources, one load',
    blurb: `Two sources, each behind a resistance, feed one load. The simulator solves the circuit; the arrows are the reference directions — blue when the current really flows that way, red when it flows against the arrow.

- The defaults are the worked example: 12 V behind 2 Ω and 6 V behind 4 Ω on a 6 Ω load. I₂ is negative: the 12 V source is charging the 6 V one.
- Whatever you set, the current law at node A and the voltage law round each window add to zero, and the power the sources deliver equals the power the resistors absorb.
- Raise V₂ past 9 V (with the other values as they start) and I₂ turns positive: now both sources feed the load.
- **Superposition**: switch source 2 off — it becomes a plain wire — and note V_A; then switch source 1 off instead. The read-out adds the two, and the sum equals V_A with both on.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 290 });
      const S = kit.schem;
      const ohm = v => kit.eng(v, 'Ω');
      const ctl = kit.controls(box.side, [
        { id: 'v1', label: 'V₁', min: 0, max: 24, step: 0.5, value: 12, unit: 'V' },
        { id: 'v2', label: 'V₂', min: 0, max: 24, step: 0.5, value: 6, unit: 'V' },
        { id: 'r1', label: 'R₁', min: 0.5, max: 100, value: 2, log: true, sig: 2, fmt: ohm },
        { id: 'r2', label: 'R₂', min: 0.5, max: 100, value: 4, log: true, sig: 2, fmt: ohm },
        { id: 'r3', label: 'R₃ (load)', min: 0.5, max: 100, value: 6, log: true, sig: 2, fmt: ohm },
        { id: 'on1', type: 'check', label: 'Source 1 on', value: true },
        { id: 'on2', type: 'check', label: 'Source 2 on', value: !params.superpose }
      ], () => solve());
      const ro = kit.readout(box.side, [['va', 'Node voltage V_A'], ['i1', 'I₁ (from source 1)'], ['i2', 'I₂ (from source 2)'], ['i3', 'I₃ (down the load)'],
        ['p1', 'Source 1'], ['p2', 'Source 2'], ['pr', 'In the resistors'], ['s1', 'V_A, source 1 alone'], ['s2', 'V_A, source 2 alone'], ['ss', 'Sum of the two']]);
      const V = ctl.values;
      let s = null;
      const ph = [0, 0, 0];

      function run(on1, on2) {
        const c = new kit.Circuit();
        const S1 = c.V('p1', 'gnd', on1 ? V.v1 : 0);
        const R1 = c.R('p1', 'a', V.r1);
        const R3 = c.R('a', 'gnd', V.r3);
        const R2 = c.R('p2', 'a', V.r2);
        const S2 = c.V('p2', 'gnd', on2 ? V.v2 : 0);
        c.dc();
        return { va: c.v('a'), i1: R1.i, i2: R2.i, i3: R3.i, S1, S2, R1, R2, R3 };
      }
      const pw = p => Math.abs(p) < 1e-9 ? '0 W' : (p > 0 ? 'delivers ' : 'absorbs ') + kit.eng(Math.abs(p), 'W');
      function solve() {
        s = run(V.on1, V.on2);
        const a = run(true, false), b = run(false, true);
        ro.set('va', eng(kit, s.va, 'V'));
        ro.set('i1', eng(kit, s.i1, 'A'));
        ro.set('i2', eng(kit, s.i2, 'A'));
        ro.set('i3', eng(kit, s.i3, 'A'));
        ro.set('p1', V.on1 ? pw(s.S1.p) : 'off (a wire)');
        ro.set('p2', V.on2 ? pw(s.S2.p) : 'off (a wire)');
        ro.set('pr', eng(kit, s.R1.p + s.R2.p + s.R3.p, 'W'));
        ro.set('s1', eng(kit, a.va, 'V'));
        ro.set('s2', eng(kit, b.va, 'V'));
        ro.set('ss', eng(kit, a.va + b.va, 'V'));
        loop.once();
      }
      function source(c, C, x, on, name, v) {
        const y1 = st.H * 0.53 - 20, y2 = st.H * 0.53 + 20;
        if (on) S.battery(c, x, y1, x, y2, { label: name, value: kit.eng(v, 'V'), labelOffset: 22 });
        else {
          S.wire(c, [[x, y1], [x, y2]], { color: C.muted });
          kit.label(c, name + ' off', x + 10, (y1 + y2) / 2, { size: 12, color: C.muted });
        }
      }
      function draw(dt) {
        if (!s) return;
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const x0 = W * 0.1, x1 = W * 0.9, xa = W * 0.5, top = Hh * 0.24, bot = Hh * 0.82, mid = Hh * 0.53;
        const ra = W * 0.2, rb = W * 0.36, rc = W * 0.64, rd = W * 0.8;
        // wiring and parts
        source(c, C, x0, V.on1, 'V₁', V.v1);
        source(c, C, x1, V.on2, 'V₂', V.v2);
        S.wire(c, [[x0, mid - 20], [x0, top], [ra, top]]);
        S.resistor(c, ra, top, rb, top, { label: 'R₁', value: kit.eng(V.r1, 'Ω'), labelOffset: 22 });
        S.wire(c, [[rb, top], [rc, top]]);
        S.resistor(c, rc, top, rd, top, { label: 'R₂', value: kit.eng(V.r2, 'Ω'), labelOffset: 22 });
        S.wire(c, [[rd, top], [x1, top], [x1, mid - 20]]);
        S.wire(c, [[xa, top], [xa, mid - 30]]);
        S.resistor(c, xa, mid - 30, xa, mid + 30, { label: 'R₃', value: kit.eng(V.r3, 'Ω') });
        S.wire(c, [[xa, mid + 30], [xa, bot]]);
        S.wire(c, [[x0, mid + 20], [x0, bot], [x1, bot], [x1, mid + 20]]);
        S.node(c, xa, top); S.node(c, xa, bot);
        S.ground(c, xa, bot);
        kit.label(c, 'A: ' + eng(kit, s.va, 'V'), xa, top - 30, { align: 'center', weight: 600, color: C.accent });
        // current arrows (reference directions) with their values
        const col = i => (i >= 0 ? C.accent : C.bad);
        const ay = top + 20;
        kit.arrow(c, (x0 + ra) / 2 - 18, ay, (x0 + ra) / 2 + 18, ay, col(s.i1), 2);
        kit.label(c, 'I₁ = ' + eng(kit, s.i1, 'A'), (x0 + ra) / 2 - 18, ay + 16, { size: 12, color: col(s.i1) });
        kit.arrow(c, (rd + x1) / 2 + 18, ay, (rd + x1) / 2 - 18, ay, col(s.i2), 2);
        kit.label(c, 'I₂ = ' + eng(kit, s.i2, 'A'), (rd + x1) / 2 + 18, ay + 16, { size: 12, color: col(s.i2), align: 'right' });
        kit.arrow(c, xa - 22, mid - 18, xa - 22, mid + 18, col(s.i3), 2);
        kit.label(c, 'I₃ = ' + eng(kit, s.i3, 'A'), xa - 32, mid, { size: 12, color: col(s.i3), align: 'right' });
        // moving charge
        for (const [k, i, pts] of [[0, s.i1, [[xa, bot], [x0, bot], [x0, top], [xa, top]]], [1, s.i2, [[xa, bot], [x1, bot], [x1, top], [xa, top]]], [2, s.i3, [[xa, top], [xa, bot]]]]) {
          ph[k] += spd(i) * (dt || 0);
          S.flow(c, pts, ph[k], { color: C.warn });
        }
        // the laws, checked with the solved numbers
        const e1 = V.on1 ? V.v1 : 0, e2 = V.on2 ? V.v2 : 0;
        const d1 = s.i1 * V.r1, d2 = s.i2 * V.r2, d3 = s.i3 * V.r3;
        const z = v => (Math.abs(v) < 5e-4 ? '0.00' : sgn(v));
        kit.label(c, 'KCL at A:  ' + sgn(s.i1) + ' + (' + sgn(s.i2) + ') − ' + sgn(s.i3) + ' = ' + z(s.i1 + s.i2 - s.i3) + ' A', xa, Hh * 0.06, { align: 'center', size: 12, color: C.text });
        const ly = bot - Hh * 0.12;
        kit.label(c, 'KVL round the left loop', (x0 + xa) / 2 + 6, ly - 9, { align: 'center', size: 11.5, color: C.muted });
        kit.label(c, sgn(e1) + ' − ' + sgn(d1) + ' − ' + sgn(d3) + ' = ' + z(e1 - d1 - d3) + ' V', (x0 + xa) / 2 + 6, ly + 8, { align: 'center', size: 11.5, color: C.muted });
        kit.label(c, 'KVL round the right loop', (xa + x1) / 2 + 6, ly - 9, { align: 'center', size: 11.5, color: C.muted });
        kit.label(c, sgn(e2) + ' − (' + sgn(d2) + ') − ' + sgn(d3) + ' = ' + z(e2 - d2 - d3) + ' V', (xa + x1) / 2 + 6, ly + 8, { align: 'center', size: 11.5, color: C.muted });
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      solve();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Thévenin and Norton */
  Hyper.sim('fund-thevenin', {
    title: 'A network and its Thévenin equivalent',
    blurb: `On the left, a network: a source, a divider and a series resistor. On the right, its equivalent — found by the simulator from two tests on the network: the open-circuit voltage, and the resistance seen with the source switched off. Both drive identical loads.

- Sweep the load over its whole range: the two load voltages and currents stay identical. On the graph, every load of the real network (dots) lands on the equivalent's straight line from V_th to I_N.
- Switch to **Norton**: a current source in parallel with the same resistance does the same job.
- Watch the power *inside* each box: the real divider keeps burning power even with a very large load, the equivalent does not. The equivalent is exact only at the terminals.
- Change R₃: it adds straight onto R_th, and leaves V_th alone.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const S = kit.schem;
      const ohm = v => kit.eng(v, 'Ω');
      const ctl = kit.controls(box.side, [
        { id: 'vs', label: 'Source V_s', min: 0, max: 24, step: 0.5, value: 12, unit: 'V' },
        { id: 'r1', label: 'R₁ (upper)', min: 100, max: 100e3, value: 6000, log: true, sig: 2, fmt: ohm },
        { id: 'r2', label: 'R₂ (lower)', min: 100, max: 100e3, value: 3000, log: true, sig: 2, fmt: ohm },
        { id: 'r3', label: 'R₃ (series)', min: 10, max: 100e3, value: 1000, log: true, sig: 2, fmt: ohm },
        { id: 'rl', label: 'Load R_L', min: 10, max: 1e6, value: 5000, log: true, sig: 2, fmt: ohm },
        { id: 'eq', type: 'select', label: 'Equivalent', options: [['Thévenin (V_th + R_th)', 'th'], ['Norton (I_N ∥ R_th)', 'no']], value: 'th' }
      ], () => solve());
      const ro = kit.readout(box.side, [['vth', 'V_th (open circuit)'], ['rth', 'R_th (sources off)'], ['in', 'I_N = V_th / R_th'], ['ln', 'Network: load gets'], ['le', 'Equivalent: load gets'], ['pn', 'Power inside the network'], ['pe', 'Power inside the equivalent']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'load current (mA)' }, y: { label: 'load voltage (V)' } }, 190);
      const V = ctl.values;
      let n = null, e = null, T = { vth: 0, rth: 1, in: 0 };
      const ph = [0, 0];

      /* the network, with a load (ohms), open (null), or a 1 mA test current and the source off */
      function network(load, test) {
        const c = new kit.Circuit();
        const src = c.V('s', 'gnd', test ? 0 : V.vs);
        const R1 = c.R('s', 'm', V.r1), R2 = c.R('m', 'gnd', V.r2), R3 = c.R('m', 'a', V.r3);
        const RL = load != null ? c.R('a', 'gnd', load) : null;
        if (test) c.I('gnd', 'a', 1e-3);
        c.dc();
        return { v: c.v('a'), i: RL ? RL.i : 0, pin: R1.p + R2.p + R3.p, src };
      }
      function equivalent(load) {
        const c = new kit.Circuit();
        let pin;
        const RL = c.R('a', 'gnd', load);
        if (V.eq === 'th') { c.V('t', 'gnd', T.vth); const Rt = c.R('t', 'a', T.rth); c.dc(); pin = Rt.p; }
        else { c.I('gnd', 'a', T.in); const Rn = c.R('a', 'gnd', T.rth); c.dc(); pin = Rn.p; }
        return { v: c.v('a'), i: RL.i, pin };
      }
      function solve() {
        T.vth = network(null).v;
        T.rth = Math.max(1e-6, network(null, true).v / 1e-3);    // volts per milliamp of test current
        T.in = T.vth / T.rth;
        n = network(V.rl);
        e = equivalent(V.rl);
        ro.set('vth', eng(kit, T.vth, 'V'));
        ro.set('rth', kit.eng(T.rth, 'Ω'));
        ro.set('in', eng(kit, T.in, 'A'));
        ro.set('ln', eng(kit, n.v, 'V') + ', ' + eng(kit, n.i, 'A'));
        ro.set('le', eng(kit, e.v, 'V') + ', ' + eng(kit, e.i, 'A'));
        ro.set('pn', eng(kit, n.pin, 'W'));
        ro.set('pe', eng(kit, e.pin, 'W'));
        const dots = [];
        for (let k = 0; k <= 16; k++) { const r = T.rth * Math.pow(10, -1.3 + 2.6 * k / 16); const m = network(r); dots.push([m.i * 1000, m.v]); }
        plot.set({
          x: { label: 'load current (mA)', min: 0, max: Math.max(1e-6, T.in * 1000 * 1.05) },
          y: { label: 'load voltage (V)', min: 0, max: Math.max(1e-3, T.vth * 1.1) },
          series: [{ pts: [[0, T.vth], [T.in * 1000, 0]], label: 'equivalent: V = V_th − I R_th' }, { pts: dots, label: 'network, many loads', line: false, dots: 3.5 }],
          marks: [{ x: n.i * 1000, y: n.v, label: 'R_L = ' + kit.eng(V.rl, 'Ω') }]
        });
        loop.once();
      }
      function box2(c, C, x1, y1, x2, y2, title) {
        c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.strokeRect(x1, y1, x2 - x1, y2 - y1); c.restore();
        kit.label(c, title, x1 + 2, y1 - 10, { size: 12, color: C.muted, weight: 600 });
      }
      function terminals(c, C, x, top, bot) {
        for (const y of [top, bot]) { c.beginPath(); c.arc(x, y, 4, 0, 7); c.fillStyle = C.bg2; c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke(); }
        kit.label(c, 'A', x + 6, top - 12, { size: 11, color: C.muted });
        kit.label(c, 'B', x + 6, bot + 12, { size: 11, color: C.muted });
      }
      function load(c, C, x, xl, top, bot, r, k, dt) {
        S.wire(c, [[x + 4, top], [xl, top], [xl, (top + bot) / 2 - 26]]);
        S.resistor(c, xl, (top + bot) / 2 - 26, xl, (top + bot) / 2 + 26, { label: 'R_L', value: kit.eng(V.rl, 'Ω') });
        S.wire(c, [[xl, (top + bot) / 2 + 26], [xl, bot], [x + 4, bot]]);
        kit.label(c, 'load: ' + eng(kit, r.v, 'V') + ', ' + eng(kit, r.i, 'A'), xl + 10, bot + 30, { align: 'right', size: 12, color: C.accent, weight: 600 });
        ph[k] += spd(r.i) * (dt || 0);
        S.flow(c, [[x + 4, top], [xl, top], [xl, bot], [x + 4, bot]], ph[k], { color: C.warn });
      }
      function draw(dt) {
        if (!n) return;
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const top = Hh * 0.26, bot = Hh * 0.78, mid = (top + bot) / 2;
        // the network
        const xs = W * 0.04, xd = W * 0.12, xt = W * 0.33, xl = W * 0.41;
        box2(c, C, W * 0.012, top - 44, xt, bot + 12, 'network');
        S.battery(c, xs, mid - 18, xs, mid + 18, { label: 'V_s', value: kit.eng(V.vs, 'V'), labelOffset: 20 });
        S.wire(c, [[xs, mid - 18], [xs, top], [xd, top]]);
        S.resistor(c, xd, top, xd, mid, { label: 'R₁', value: kit.eng(V.r1, 'Ω') });
        S.resistor(c, xd, mid, xd, bot, { label: 'R₂', value: kit.eng(V.r2, 'Ω') });
        S.wire(c, [[xs, mid + 18], [xs, bot], [xt - 4, bot]]);
        S.node(c, xd, mid); S.node(c, xd, bot);
        S.resistor(c, xd, mid, xt - 4, mid, { label: 'R₃', value: kit.eng(V.r3, 'Ω'), labelOffset: 22 });
        S.wire(c, [[xt - 4, mid], [xt - 4, top]]);
        terminals(c, C, xt, top, bot);
        load(c, C, xt, xl, top, bot, n, 0, dt);
        // the equivalent
        const xe = W * 0.57, xr1 = W * 0.63, xr2 = W * 0.74, xt2 = W * 0.8, xl2 = W * 0.88;
        box2(c, C, W * 0.515, top - 44, xt2, bot + 12, V.eq === 'th' ? 'Thévenin equivalent' : 'Norton equivalent');
        if (V.eq === 'th') {
          S.battery(c, xe, mid - 18, xe, mid + 18, { label: 'V_th', value: eng(kit, T.vth, 'V'), labelOffset: 20 });
          S.wire(c, [[xe, mid - 18], [xe, top], [xr1, top]]);
          S.resistor(c, xr1, top, xr2, top, { label: 'R_th', value: kit.eng(T.rth, 'Ω'), labelOffset: 22 });
          S.wire(c, [[xr2, top], [xt2 - 4, top]]);
          S.wire(c, [[xe, mid + 18], [xe, bot], [xt2 - 4, bot]]);
        } else {
          S.isource(c, xe, bot - 20, xe, top + 20, { label: 'I_N', value: eng(kit, T.in, 'A'), labelOffset: 24 });
          S.wire(c, [[xe, top + 20], [xe, top], [xt2 - 4, top]]);
          S.wire(c, [[xe, bot - 20], [xe, bot], [xt2 - 4, bot]]);
          const xn = (xe + xt2) / 2;
          S.resistor(c, xn, top, xn, bot, { label: 'R_th', value: kit.eng(T.rth, 'Ω') });
          S.node(c, xn, top); S.node(c, xn, bot);
        }
        terminals(c, C, xt2, top, bot);
        load(c, C, xt2, xl2, top, bot, e, 1, dt);
        const same = Math.abs(n.v - e.v) <= 1e-6 * Math.max(1, Math.abs(n.v));
        kit.label(c, same ? 'same load voltage and current' : 'different!', W * 0.5, Hh - 10, { align: 'center', size: 12, color: same ? C.ok : C.bad, weight: 600 });
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      solve();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ maximum power transfer */
  Hyper.sim('fund-maxpower', {
    title: 'Maximum power transfer',
    blurb: `A source with internal resistance R_s drives a load R_L. The bar splits the power the source produces into the part that reaches the load (green) and the part burnt inside the source (red); the graph plots the load's power, as a share of the most it could get, and the efficiency.

- Sweep R_L: the load power peaks exactly at R_L = R_s, where the load gets half the source voltage — and the red part of the bar is just as big as the green.
- Beyond the peak the power falls slowly, but the efficiency keeps climbing: large loads are efficient.
- The peak is broad: half or twice R_s still gives 89 %.
- Set R_s to 0.1 Ω and 12 V, like a small battery: matching it would mean hundreds of watts of heat inside the battery. Power systems keep R_L ≫ R_s.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 240 });
      const S = kit.schem;
      const ohm = v => kit.eng(v, 'Ω');
      const ctl = kit.controls(box.side, [
        { id: 'vs', label: 'Source voltage V_s', min: 1, max: 24, step: 0.5, value: 4, unit: 'V' },
        { id: 'rs', label: 'Source resistance R_s', min: 0.1, max: 1000, value: 3, log: true, sig: 2, fmt: ohm },
        { id: 'rl', label: 'Load R_L', min: 0.01, max: 10000, value: 1, log: true, sig: 3, fmt: ohm }
      ], () => solve());
      const ro = kit.readout(box.side, [['i', 'Current'], ['vl', 'Load voltage'], ['pl', 'Load power'], ['ps', 'Lost in the source'], ['eta', 'Efficiency'], ['pm', 'Most possible (R_L = R_s)'], ['fr', 'Load power / maximum']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'load resistance (Ω)', log: true }, y: { label: 'fraction', min: 0, max: 1.05 } }, 190);
      const V = ctl.values;
      let r = null, ph = 0;

      function run(rl) {
        const c = new kit.Circuit();
        const src = c.V('e', 'gnd', V.vs);
        const Rs = c.R('e', 'a', V.rs);
        const RL = c.R('a', 'gnd', rl);
        c.dc();
        return { i: RL.i, vl: c.v('a'), pl: RL.p, ps: Rs.p, pt: src.p };
      }
      function solve() {
        r = run(V.rl);
        const pm = V.vs * V.vs / (4 * V.rs);
        r.pm = pm;
        ro.set('i', eng(kit, r.i, 'A'));
        ro.set('vl', eng(kit, r.vl, 'V'));
        ro.set('pl', eng(kit, r.pl, 'W'));
        ro.set('ps', eng(kit, r.ps, 'W'));
        ro.set('eta', (100 * r.pl / r.pt).toFixed(1) + ' %');
        ro.set('pm', kit.eng(pm, 'W'));
        ro.set('fr', (100 * r.pl / pm).toFixed(1) + ' %');
        const pp = [], pe = [];
        for (let k = 0; k <= 100; k++) {
          const rl = V.rs * Math.pow(10, -2 + 4 * k / 100);
          const m = run(rl);
          pp.push([rl, m.pl / pm]); pe.push([rl, m.pl / m.pt]);
        }
        plot.set({
          x: { label: 'load resistance (Ω)', log: true, min: V.rs / 100, max: V.rs * 100 },
          y: { label: 'fraction', min: 0, max: 1.05 },
          series: [{ pts: pp, label: 'load power / maximum' }, { pts: pe, label: 'efficiency', dash: [6, 4] }],
          vlines: [{ x: V.rs, label: 'R_L = R_s' }],
          marks: V.rl >= V.rs / 100 && V.rl <= V.rs * 100 ? [{ x: V.rl, y: r.pl / pm }] : []
        });
        loop.once();
      }
      function draw(dt) {
        if (!r) return;
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const x0 = W * 0.08, xr1 = W * 0.16, xr2 = W * 0.3, xt = W * 0.36, xl = W * 0.44, top = Hh * 0.3, bot = Hh * 0.8, mid = (top + bot) / 2;
        c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.strokeRect(W * 0.03, top - 44, xt - W * 0.03, bot - top + 58); c.restore();
        kit.label(c, 'source', W * 0.03 + 2, top - 54, { size: 12, color: C.muted, weight: 600 });
        S.battery(c, x0, mid - 18, x0, mid + 18, { label: 'V_s', value: kit.eng(V.vs, 'V'), labelOffset: 22 });
        S.wire(c, [[x0, mid - 18], [x0, top], [xr1, top]]);
        S.resistor(c, xr1, top, xr2, top, { label: 'R_s', value: kit.eng(V.rs, 'Ω'), color: C.bad, labelOffset: 22 });
        S.wire(c, [[xr2, top], [xl, top], [xl, mid - 26]]);
        S.resistor(c, xl, mid - 26, xl, mid + 26, { label: 'R_L', value: kit.eng(V.rl, 'Ω'), color: C.ok });
        S.wire(c, [[xl, mid + 26], [xl, bot], [x0, bot], [x0, mid + 18]]);
        S.ground(c, (x0 + xl) / 2, bot);
        ph += spd(r.i) * (dt || 0);
        S.flow(c, [[x0, mid + 18], [x0, mid - 18], [x0, top], [xl, top], [xl, bot], [x0, bot], [x0, mid + 18]], ph, { color: C.warn });
        // the power bar: the source's total, split into load and loss; full width = V²/R_s (a short circuit)
        const bx = W * 0.54, bw = W * 0.42, by = Hh * 0.34, bh = 26;
        const full = V.vs * V.vs / V.rs;
        const wl = bw * clamp(r.pl / full, 0, 1), ws = bw * clamp(r.ps / full, 0, 1);
        c.fillStyle = C.surface; c.fillRect(bx, by, bw, bh);
        c.fillStyle = C.ok; c.fillRect(bx, by, wl, bh);
        c.fillStyle = C.bad; c.fillRect(bx + wl, by, ws, bh);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(bx, by, bw, bh);
        c.strokeStyle = C.muted; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(bx + bw / 4, by - 6); c.lineTo(bx + bw / 4, by + bh + 6); c.stroke(); c.setLineDash([]);
        kit.label(c, 'power produced by the source', bx, by - 16, { size: 12, color: C.muted });
        kit.label(c, 'P_max', bx + bw / 4 + 4, by + bh + 12, { size: 11, color: C.muted });
        kit.label(c, 'load ' + eng(kit, r.pl, 'W'), bx, by + bh + 30, { size: 12.5, color: C.ok, weight: 600 });
        kit.label(c, 'lost in R_s ' + eng(kit, r.ps, 'W'), bx, by + bh + 50, { size: 12.5, color: C.bad, weight: 600 });
        kit.label(c, 'efficiency ' + (100 * r.pl / r.pt).toFixed(0) + ' %', bx, by + bh + 70, { size: 12.5, color: C.text });
        const k = V.rl / V.rs;
        const note = Math.abs(Math.log10(k)) < 0.01 ? 'matched: the most power, at 50 % efficiency' : k < 1 ? 'R_L < R_s: most of the power is lost inside the source' : 'R_L > R_s: less power, but more efficient';
        kit.label(c, note, W * 0.5, Hh - 12, { align: 'center', size: 12, color: C.accent });
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      solve();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Wheatstone bridge */
  Hyper.sim('fund-bridge', {
    title: 'Balance a Wheatstone bridge',
    blurb: `A Wheatstone bridge with an unknown resistor R_x in the lower right arm. R₁ and R₂ are the ratio arms, R₃ the adjustable "decade box". A centre-zero galvanometer (100 Ω) between the midpoints shows the current through it.

- Choose an unknown and a ratio, then turn R₃ until the needle sits at zero; use the fine trim for the last few per cent. Then R_x = R₃·R₂/R₁ — the read-out works it out; check that it matches.
- At balance, change the supply voltage: the needle stays at zero. Balance depends only on the ratios.
- The needle is most sensitive near balance: a 0.1 % change of R₃ moves it visibly.
- Pick a ratio so that R₃ must be set near the top of a decade: the same step of the dial is then a smaller fraction, and the result more precise.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const S = kit.schem;
      const ohm = v => kit.eng(v, 'Ω');
      const ctl = kit.controls(box.side, [
        { id: 'rx', type: 'select', label: 'Unknown resistor', options: [['Unknown X', 3920], ['Unknown Y', 68.1], ['Unknown Z', 274e3]], value: 3920 },
        { id: 'ratio', type: 'select', label: 'Ratio arms R₂ / R₁ (R₁ = 1 kΩ)', options: [['1 : 100 (R₂ = 10 Ω)', 0.01], ['1 : 10 (R₂ = 100 Ω)', 0.1], ['1 : 1 (R₂ = 1 kΩ)', 1], ['10 : 1 (R₂ = 10 kΩ)', 10], ['100 : 1 (R₂ = 100 kΩ)', 100]], value: 1 },
        { id: 'r3', label: 'R₃ (decade box)', min: 10, max: 100e3, value: 1000, log: true, sig: 3, fmt: ohm },
        { id: 'fine', label: 'R₃ fine trim', min: -5, max: 5, step: 0.01, value: 0, unit: '%' },
        { id: 'vs', label: 'Supply voltage', min: 1, max: 12, step: 0.5, value: 5, unit: 'V' }
      ], () => solve());
      const ro = kit.readout(box.side, [['r3', 'R₃ setting'], ['vab', 'V_A − V_B'], ['ig', 'Galvanometer current'], ['est', 'R₃ · R₂ / R₁'], ['bal', 'State']]);
      const V = ctl.values;
      const R1 = 1000, RG = 100;
      let s = null;
      const ph = [0, 0, 0, 0, 0];

      function solve() {
        const r2 = R1 * V.ratio, r3 = V.r3 * (1 + V.fine / 100);
        const c = new kit.Circuit();
        c.V('t', 'gnd', V.vs);
        const a1 = c.R('t', 'a', R1), a2 = c.R('a', 'gnd', r2), a3 = c.R('t', 'b', r3), a4 = c.R('b', 'gnd', V.rx);
        const g = c.R('a', 'b', RG);
        c.dc();
        s = { r2, r3, vab: c.v('a') - c.v('b'), ig: g.i, i: [a1.i, a2.i, a3.i, a4.i, g.i] };
        const ig = Math.abs(s.ig);
        ro.set('r3', kit.eng(r3, 'Ω'));
        ro.set('vab', eng(kit, s.vab, 'V'));
        ro.set('ig', eng(kit, s.ig, 'A'));
        ro.set('est', kit.eng(r3 * r2 / R1, 'Ω'));
        ro.set('bal', ig < 2.5e-7 ? 'balanced: null' : ig < 2.5e-6 ? 'close to balance' : (s.ig > 0 ? 'R₃ too large' : 'R₃ too small'));
        loop.once();
      }
      function draw(dt) {
        if (!s) return;
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const xs = W * 0.07, xc = W * 0.38, xl = W * 0.2, xr = W * 0.56, top = Hh * 0.13, bot = Hh * 0.87, mid = Hh * 0.5;
        // supply
        S.battery(c, xs, mid - 18, xs, mid + 18, { label: 'V_s', value: kit.eng(V.vs, 'V'), labelOffset: 22 });
        S.wire(c, [[xs, mid - 18], [xs, top], [xc, top]]);
        S.wire(c, [[xs, mid + 18], [xs, bot], [xc, bot]]);
        S.ground(c, xs + 40, bot);
        // the four arms
        S.resistor(c, xc, top, xl, mid, { label: 'R₁', value: '1 kΩ' });
        S.resistor(c, xl, mid, xc, bot, { label: 'R₂', value: kit.eng(s.r2, 'Ω') });
        S.resistor(c, xc, top, xr, mid, { label: 'R₃', value: kit.eng(s.r3, 'Ω'), color: C.accent });
        S.resistor(c, xr, mid, xc, bot, { label: 'R_x', value: '?', color: C.warn });
        for (const [x, y] of [[xc, top], [xl, mid], [xr, mid], [xc, bot]]) S.node(c, x, y);
        kit.label(c, 'A', xl - 16, mid, { size: 12, color: C.muted, weight: 600 });
        kit.label(c, 'B', xr + 10, mid, { size: 12, color: C.muted, weight: 600 });
        // the galvanometer between the midpoints
        S.wire(c, [[xl, mid], [xc - 17, mid]]);
        S.wire(c, [[xc + 17, mid], [xr, mid]]);
        // current dots in each arm and the detector, then the detector on top
        const paths = [[[xc, top], [xl, mid]], [[xl, mid], [xc, bot]], [[xc, top], [xr, mid]], [[xr, mid], [xc, bot]], [[xl, mid], [xr, mid]]];
        paths.forEach((p, k) => { ph[k] += spd(s.i[k]) * (dt || 0); if (k < 4 || Math.abs(s.i[4]) > 1e-8) S.flow(c, p, ph[k], { color: C.warn, r: 2.2 }); });
        S.meter(c, xc, mid, 'G', null, { color: C.accent });
        // the dial: a centre-zero needle, compressed so that both microamps and milliamps show
        const dx = W * 0.8, dy = Hh * 0.62, R = Math.min(W * 0.15, Hh * 0.36);
        c.save();
        c.strokeStyle = C.faint; c.lineWidth = 2;
        c.beginPath(); c.arc(dx, dy, R, -Math.PI / 2 - 1.05, -Math.PI / 2 + 1.05); c.stroke();
        for (let k = -5; k <= 5; k++) {
          const a = -Math.PI / 2 + 1.05 * k / 5;
          const r0 = k === 0 ? R * 0.8 : R * 0.9;
          c.strokeStyle = k === 0 ? C.text : C.faint; c.lineWidth = k === 0 ? 2 : 1;
          c.beginPath(); c.moveTo(dx + r0 * Math.cos(a), dy + r0 * Math.sin(a)); c.lineTo(dx + R * Math.cos(a), dy + R * Math.sin(a)); c.stroke();
        }
        const ang = -Math.PI / 2 + 1.05 * Math.tanh(s.ig / 5e-6);
        c.strokeStyle = C.bad; c.lineWidth = 2.5;
        c.beginPath(); c.moveTo(dx, dy); c.lineTo(dx + R * 0.95 * Math.cos(ang), dy + R * 0.95 * Math.sin(ang)); c.stroke();
        c.restore();
        kit.dot(c, dx, dy, 5, C.text);
        kit.label(c, 'galvanometer', dx, dy + 20, { align: 'center', size: 12, color: C.muted });
        kit.label(c, eng(kit, s.ig, 'A'), dx, dy + 38, { align: 'center', size: 13, color: C.accent, weight: 600 });
        const balanced = Math.abs(s.ig) < 2.5e-7;
        if (balanced) kit.label(c, 'balanced: R_x = R₃·R₂/R₁ = ' + kit.eng(s.r3 * s.r2 / R1, 'Ω'), dx, dy - R - 18, { align: 'center', size: 12.5, color: C.ok, weight: 600 });
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      solve();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ multimeter trainer */
  Hyper.sim('fund-meters', {
    title: 'Multimeter trainer: connections and loading',
    blurb: `A 9 V battery (0.5 Ω inside) drives two equal resistors. Choose where the meter goes — correctly, or in one of the classic wrong ways — which meter, and how big the resistors are. The meter is part of the circuit the simulator solves.

- **Voltmeter across R₂** with 1 kΩ resistors reads the true 4.5 V. Make the resistors 100 kΩ or more, and try the analogue meter: its own resistance joins the circuit and the reading falls — meter loading.
- **Ammeter in series** reads the loop current. With 100 Ω resistors its shunt resistance starts to show.
- **Voltmeter in series**: nothing is harmed, but the current almost stops and the meter reads nearly the whole battery voltage.
- **Ammeter across R₂ or across the battery**: the meter's low resistance becomes a short circuit. Across the battery the fuse blows — replace it with the button.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const S = kit.schem;
      const METERS = {
        dmm: { rv: 10e6, ra: 2, name: 'DMM' },
        analog: { rv: 200e3, ra: 10, name: 'analogue' },
        bench: { rv: 10e9, ra: 1, name: 'bench meter' }
      };
      const FUSE = 0.4, EMF = 9, RB = 0.5;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Meter connection', options: [['Voltmeter across R₂ (right)', 'vr2'], ['Ammeter in series (right)', 'aser'], ['Voltmeter in series (wrong)', 'vser'], ['Ammeter across R₂ (wrong)', 'ar2'], ['Ammeter across the battery (wrong)', 'abat']], value: 'vr2' },
        { id: 'meter', type: 'select', label: 'Meter', options: [['Digital multimeter, 10 MΩ', 'dmm'], ['Analogue, 20 kΩ/V on 10 V (200 kΩ)', 'analog'], ['Bench meter, 10 GΩ', 'bench']], value: METERS[params.meter] ? params.meter : 'dmm' },
        { id: 'scale', type: 'select', label: 'R₁ = R₂ =', options: [['100 Ω', 100], ['1 kΩ', 1e3], ['100 kΩ', 1e5], ['1 MΩ', 1e6], ['10 MΩ', 1e7]], value: [100, 1e3, 1e5, 1e6, 1e7].includes(params.scale) ? params.scale : 1e3 },
        { type: 'buttons', items: [{ id: 'fuse', label: 'Replace the fuse' }] }
      ], id => { if (id === 'fuse') blown = false; solve(); });
      const ro = kit.readout(box.side, [['rd', 'Meter reads'], ['tv', 'True value, no meter'], ['er', 'Error'], ['il', 'Current in R₁'], ['mi', 'Current through the meter']]);
      const V = ctl.values;
      let blown = false, s = null, ph = [0, 0];

      function run(mode, fuseOk) {
        const m = METERS[V.meter], R = V.scale;
        const c = new kit.Circuit();
        c.V('p', 'gnd', EMF, { r: RB });
        const volt = mode === 'vr2' || mode === 'vser';
        const rm = volt ? m.rv : (fuseOk ? m.ra : 1e13);
        let M = null;
        if (mode === 'aser' || mode === 'vser') M = c.R('p', 'q', rm); else c.R('p', 'q', 1e-6);
        const R1 = c.R('q', 'm', R), R2 = c.R('m', 'gnd', R);
        if (mode === 'vr2' || mode === 'ar2') M = c.R('m', 'gnd', rm);
        if (mode === 'abat') M = c.R('p', 'gnd', rm);
        c.dc();
        return { im: M ? M.i : 0, vm: M ? M.i * rm : 0, i1: R1.i, i2: R2.i, volt };
      }
      function solve() {
        const mode = V.mode;
        let r = run(mode, !blown);
        if (!r.volt && Math.abs(r.im) > FUSE && !blown) { blown = true; r = run(mode, false); }
        s = r;
        const R = V.scale, ttrue = EMF / (2 * R + RB);
        let rd, tv, er = '—';
        if (mode === 'vr2') { rd = r.vm; tv = ttrue * R; }
        else if (mode === 'aser') { rd = r.im; tv = ttrue; }
        else { rd = r.volt ? r.vm : r.im; tv = null; }
        s.rd = rd;
        ro.set('rd', blown && !r.volt ? '0 (fuse blown)' : eng(kit, rd, r.volt ? 'V' : 'A'));
        ro.set('tv', tv == null ? 'not a meaningful measurement' : eng(kit, tv, mode === 'vr2' ? 'V' : 'A'));
        if (tv) er = (100 * (rd - tv) / tv).toFixed(Math.abs((rd - tv) / tv) < 0.01 ? 3 : 1) + ' %';
        ro.set('er', blown && !r.volt ? '—' : er);
        ro.set('il', eng(kit, r.i1, 'A'));
        ro.set('mi', eng(kit, r.im, 'A'));
        loop.once();
      }
      function meterAt(c, C, x, y, letter, above) {
        const wrong = ['vser', 'ar2', 'abat'].includes(V.mode);
        const col = wrong ? C.bad : (letter === 'V' ? C.accent : C.warn);
        S.meter(c, x, y, letter, null, { color: col, r: 18 });
        const txt = blown && letter === 'A' ? 'fuse blown' : eng(kit, s.rd, letter === 'V' ? 'V' : 'A');
        if (above) kit.label(c, txt, x, y - 32, { color: col, weight: 700, size: 14, align: 'center' });
        else kit.label(c, txt, x + 26, y - 2, { color: col, weight: 700, size: 14 });
      }
      function draw(dt) {
        if (!s) return;
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const x0 = W * 0.08, xb = W * 0.25, xi = W * 0.34, xr = W * 0.52, xm = W * 0.72, top = Hh * 0.27, bot = Hh * 0.87, mid = (top + bot) / 2;
        const mode = V.mode, rtxt = kit.eng(V.scale, 'Ω'), ym = (mid + bot) / 2;
        // wiring and parts
        S.battery(c, x0, mid - 18, x0, mid + 18, { label: '9 V', value: 'r = 0.5 Ω', labelOffset: 22 });
        S.wire(c, [[x0, mid - 18], [x0, top], [xr, top]]);
        S.wire(c, [[x0, mid + 18], [x0, bot], [xr, bot]]);
        S.ground(c, (x0 + xb) / 2 + 10, bot);
        S.resistor(c, xr, top, xr, mid, { label: 'R₁', value: rtxt });
        S.resistor(c, xr, mid, xr, bot, { label: 'R₂', value: rtxt });
        S.node(c, xr, mid);
        if (mode === 'vr2' || mode === 'ar2') { S.wire(c, [[xr, mid], [xm, mid], [xm, bot], [xr, bot]]); S.node(c, xr, bot); }
        if (mode === 'abat') { S.wire(c, [[xb, top], [xb, bot]]); S.node(c, xb, top); S.node(c, xb, bot); }
        // moving charge: the loop through R₁, and the meter's own path when it takes a real share
        ph[0] += spd(s.i1) * (dt || 0);
        S.flow(c, [[x0, mid + 18], [x0, mid - 18], [x0, top], [xr, top], [xr, bot], [x0, bot], [x0, mid + 18]], ph[0], { color: C.warn });
        const share = Math.abs(s.im) > 0.02 * Math.abs(s.i1) && Math.abs(s.im) > 1e-9;
        ph[1] += spd(s.im) * (dt || 0);
        if (mode === 'abat' && share) S.flow(c, [[xb, top], [xb, bot]], ph[1], { color: C.bad });
        if ((mode === 'ar2' || mode === 'vr2') && share) S.flow(c, [[xr, mid], [xm, mid], [xm, bot], [xr, bot]], ph[1], { color: mode === 'ar2' ? C.bad : C.warn });
        // the meter, on top
        if (mode === 'aser' || mode === 'vser') meterAt(c, C, xi, top, mode === 'vser' ? 'V' : 'A', true);
        if (mode === 'vr2' || mode === 'ar2') meterAt(c, C, xm, ym, mode === 'vr2' ? 'V' : 'A');
        if (mode === 'abat') meterAt(c, C, xb, mid, 'A');
        // what the bench would tell you
        const msg = {
          vr2: ['Voltmeter across the part: correct.', C.ok],
          aser: ['Ammeter in series: correct.', C.ok],
          vser: ['Voltmeter in series: almost no current flows; it reads nearly 9 V.', C.bad],
          ar2: ['Ammeter across R₂: its low resistance shorts R₂ out.', C.bad],
          abat: [blown ? 'A short across the battery: the fuse has blown.' : 'Ammeter across the battery: a short circuit.', C.bad]
        }[mode];
        kit.label(c, msg[0], W * 0.5, Hh * 0.06, { align: 'center', size: 12.5, color: msg[1], weight: 600 });
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      solve();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ oscilloscope trainer */
  Hyper.sim('fund-scope', {
    title: 'Oscilloscope trainer',
    blurb: `A function generator with a 50 Ω output feeds the scope's input: 1 MΩ, with a 22 nF capacitor switched in series for AC coupling. The simulator steps the circuit in time and the scope samples it 500 times per screen, triggering on a rising edge (the small T marks the level, the arrow at the top the trigger point).

- Set volts/div and time/div so that two or three cycles fill most of the screen.
- Move the trigger level above the signal's peak: nothing triggers, auto mode sweeps anyway, and the trace rolls. Bring the level back and the trace locks.
- Add a DC offset: with DC coupling the trace moves up; with AC coupling it stays centred. Then try a 20 Hz square wave, AC coupled, at 10 ms/div: the flat tops droop.
- With a slow time base, raise the frequency: with only a few samples per cycle the screen shows a false, slower wave — aliasing.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 380, maxH: 620 });
      const S = kit.schem;
      const TD = [5e-6, 1e-5, 2e-5, 5e-5, 1e-4, 2e-4, 5e-4, 1e-3, 2e-3, 5e-3, 1e-2, 2e-2];
      const ctl = kit.controls(box.side, [
        { id: 'wave', type: 'select', label: 'Generator waveform', options: [['Sine', 'sin'], ['Square', 'sq'], ['Triangle', 'tri']], value: 'sin' },
        { id: 'f', label: 'Frequency', min: 10, max: 100e3, value: 1000, log: true, sig: 3, fmt: v => kit.eng(v, 'Hz') },
        { id: 'amp', label: 'Amplitude (peak)', min: 0.1, max: 5, step: 0.05, value: 2, unit: 'V' },
        { id: 'off', label: 'DC offset', min: -5, max: 5, step: 0.1, value: 0, unit: 'V' },
        { id: 'vdiv', type: 'select', label: 'Volts / div', options: [['0.1 V', 0.1], ['0.2 V', 0.2], ['0.5 V', 0.5], ['1 V', 1], ['2 V', 2], ['5 V', 5]], value: 1 },
        { id: 'tdiv', type: 'select', label: 'Time / div', options: TD.map(t => [kit.eng(t, 's'), t]), value: 2e-4 },
        { id: 'trig', label: 'Trigger level', min: -10, max: 10, step: 0.1, value: 0.5, unit: 'V' },
        { id: 'coup', type: 'select', label: 'Input coupling', options: [['DC', 'dc'], ['AC', 'ac'], ['GND', 'gnd']], value: 'dc' }
      ], id => { if (id === 'vdiv' || id === 'trig') loop.once(); else rebuild(); });
      const ro = kit.readout(box.side, [['T', 'Period of the signal'], ['scr', 'Screen width (10 div)'], ['cyc', 'Cycles on screen'], ['spc', 'Samples per cycle'], ['vpp', 'Peak to peak, measured'], ['st', 'Trigger']]);
      const V = ctl.values;
      const N = 500, PRE = 50, CC = 22e-9, RIN = 1e6;
      let c, dt, hist, acq, shown, waited, trigd, prev, spf;

      function sig(t) {
        const u = t * V.f, fr = u - Math.floor(u);
        const w = V.wave === 'sq' ? (fr < 0.5 ? 1 : -1) : V.wave === 'tri' ? (fr < 0.5 ? 4 * fr - 1 : 3 - 4 * fr) : Math.sin(2 * Math.PI * u);
        return V.off + V.amp * w;
      }
      function rebuild() {
        c = new kit.Circuit();
        c.V('g', 'gnd', sig, { r: 50 });
        if (V.coup !== 'gnd') {
          c.C('g', 'x', CC, V.off);                       // the coupling capacitor, starting charged to the DC level
          c.SW('g', 'x', V.coup === 'dc');                // DC coupling shorts it out
        }
        c.R('x', 'gnd', RIN);
        c.reset();
        dt = 10 * V.tdiv / N;
        spf = Math.max(1, Math.min(Math.round(1.2 * N), Math.round((1 / 60) / dt)));
        hist = []; acq = null; shown = null; waited = 0; trigd = false; prev = null;
        const T = 1 / V.f;
        ro.set('T', kit.eng(T, 's'));
        ro.set('scr', kit.eng(10 * V.tdiv, 's'));
        ro.set('cyc', (10 * V.tdiv * V.f).toPrecision(3));
        ro.set('spc', (T / dt).toPrecision(3));
        ro.set('vpp', '—');
        ro.set('st', '—');
      }
      function sample(v) {
        if (acq) {
          acq.push(v);
          if (acq.length >= N) { shown = { pts: acq, trig: trigd }; acq = null; waited = 0; }
        } else {
          waited++;
          if (prev != null && prev < V.trig && v >= V.trig && hist.length >= PRE) { acq = hist.slice(-PRE); acq.push(v); trigd = true; }
          else if (waited > 2 * N) { acq = [v]; trigd = false; }       // auto mode: sweep anyway
        }
        hist.push(v); if (hist.length > PRE) hist.shift();
        prev = v;
      }
      function frame(dtf) {
        const n = dtf ? spf : 0;
        for (let k = 0; k < n; k++) { c.step(dt); sample(c.v('x')); }
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        // the schematic across the top: generator, 50 Ω, the scope input
        const y = 46, yb = 112, x0 = W * 0.07, xc1 = W * 0.36, xc2 = W * 0.48, xi = W * 0.58;
        S.vsource(g, x0, yb, x0, y, { ac: true, label: 'generator', value: { sin: 'sine', sq: 'square', tri: 'triangle' }[V.wave] + ', ' + kit.eng(V.f, 'Hz'), labelOffset: 26 });
        S.wire(g, [[x0, y], [x0 + 40, y]]);
        S.resistor(g, x0 + 40, y, x0 + 110, y, { label: '50 Ω', value: 'output', labelOffset: 22 });
        S.wire(g, [[x0 + 110, y], [xc1, y]]);
        if (V.coup === 'gnd') {
          S.node(g, xc1, y, { r: 3, color: C.muted });
          kit.label(g, 'GND: input disconnected', (xc1 + xi) / 2 + 4, y - 18, { align: 'center', size: 11.5, color: C.muted });
          S.wire(g, [[xc2, y], [xi, y]]);
        } else {
          S.capacitor(g, xc1, y, xc2, y, { label: 'C 22 nF', value: V.coup === 'ac' ? 'AC coupling' : 'bypassed (DC)', labelOffset: 28 });
          S.wire(g, [[xc1, y], [xc1, y + 34]]); S.wire(g, [[xc2, y], [xc2, y + 34]]);
          S.switch(g, xc1, y + 34, xc2, y + 34, { closed: V.coup === 'dc', color: V.coup === 'dc' ? C.text : C.muted });
          S.wire(g, [[xc2, y], [xi, y]]);
          S.node(g, xc1, y); S.node(g, xc2, y);
        }
        S.resistor(g, xi, y, xi, yb, { label: '1 MΩ', value: 'scope input' });
        S.node(g, xi, y);
        S.wire(g, [[x0, yb], [xi, yb]]);
        S.ground(g, (x0 + xc1) / 2, yb);
        S.wire(g, [[xi, y], [xi + 12, y]]);
        kit.label(g, 'to the screen', xi + 16, y, { size: 12, color: C.muted });
        // the screen
        const sx = 16, sy = 146, sw = W - 32, sh = Math.max(160, Hh - sy - 24);
        const buf = (V.tdiv >= 5e-3 && acq) ? acq : (shown ? shown.pts : []);
        S.scope(g, sx, sy, sw, sh, { tdiv: V.tdiv, divy: 8, traces: [{ pts: buf.map((v, k) => [k * dt, v]), vdiv: V.vdiv, label: 'CH1' }] });
        // trigger level (T on the right edge) and trigger point (arrow at the top), zero level on the left
        const dy = sh / 8, yl = clamp(sy + sh / 2 - V.trig / V.vdiv * dy, sy + 6, sy + sh - 6);
        g.fillStyle = C.warn;
        g.beginPath(); g.moveTo(sx + sw + 2, yl); g.lineTo(sx + sw + 12, yl - 6); g.lineTo(sx + sw + 12, yl + 6); g.closePath(); g.fill();
        kit.label(g, 'T', sx + sw + 3, yl - 14, { size: 11, color: C.warn, weight: 700 });
        const xt = sx + sw / 10;
        g.beginPath(); g.moveTo(xt, sy + 2); g.lineTo(xt - 5, sy - 6); g.lineTo(xt + 5, sy - 6); g.closePath(); g.fill();
        g.fillStyle = C.muted;
        g.beginPath(); g.moveTo(sx - 2, sy + sh / 2); g.lineTo(sx - 12, sy + sh / 2 - 6); g.lineTo(sx - 12, sy + sh / 2 + 6); g.closePath(); g.fill();
        // status
        const T = 1 / V.f, spc = T / dt;
        let status, col;
        if (V.coup === 'gnd') { status = 'GND: the line shows where 0 V is'; col = C.muted; }
        else if (!shown && !acq) { status = 'waiting for a trigger…'; col = C.muted; }
        else if (shown && !shown.trig) { status = 'auto: not triggered, the trace rolls'; col = C.warn; }
        else { status = 'triggered'; col = C.ok; }
        kit.label(g, status, xt + 12, sy - 10, { size: 12, color: col, weight: 600 });
        if (spc < 8 && V.coup !== 'gnd') kit.label(g, 'only ' + spc.toPrecision(2) + ' samples per cycle: aliasing', sx + sw, sy - 10, { size: 12, color: C.bad, weight: 600, align: 'right' });
        if (dtf) {
          ro.set('st', status);
          if (shown && shown.pts.length) { let lo = Infinity, hi = -Infinity; for (const v of shown.pts) { if (v < lo) lo = v; if (v > hi) hi = v; } ro.set('vpp', kit.eng(hi - lo, 'V')); }
        }
      }
      rebuild();
      const loop = kit.loop(dtf => frame(dtf), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
