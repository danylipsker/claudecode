/* HYPER-ELECTRONICS · sims/reference.js — the reference simulations for electronics
 * authors: a circuit solved by kit.Circuit, drawn with kit.schem, with meters, moving
 * current and a live graph; and a transient on the oscilloscope screen. */
(function () {
  'use strict';

  Hyper.sim('ref-divider', {
    title: 'Voltage divider on the bench',
    blurb: `The circuit is solved exactly as you change it. The dots show the current (their speed is its size); the voltmeter reads the output.

- Change $R_1$ and $R_2$ together: the output stays put, the current changes.
- Connect the load and make it smaller: watch the output sag. The graph shows why — below about $10\\,R_\\text{th}$ the divider is no longer a divider.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'vin', label: 'Input voltage', min: 1, max: 24, step: 0.5, value: 12, unit: 'V' },
        { id: 'r1', label: 'R₁ (upper)', min: 100, max: 1e6, value: 30e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'r2', label: 'R₂ (lower)', min: 100, max: 1e6, value: 10e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'load', type: 'check', label: 'Connect the load', value: false },
        { id: 'rl', label: 'Load R_L', min: 100, max: 1e7, value: 100e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') }
      ], () => { solve(); draw(); });
      const ro = kit.readout(box.side, [['vo', 'Output'], ['vu', 'Output, no load'], ['i', 'Divider current'], ['il', 'Load current'], ['rth', 'R_th = R₁ ∥ R₂'], ['p', 'Power in R₁ + R₂']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'load resistance (Ω)', log: true }, y: { label: 'output (V)', min: 0 } }, 180);
      const V = ctl.values;
      let sol = null, phase = 0;

      function circuit(rl) {
        const c = new kit.Circuit();
        c.V('top', 'gnd', V.vin);
        const R1 = c.R('top', 'out', V.r1);
        const R2 = c.R('out', 'gnd', V.r2);
        const RL = rl ? c.R('out', 'gnd', rl) : null;
        c.dc();
        return { c, R1, R2, RL, vout: c.v('out') };
      }
      function solve() {
        sol = circuit(V.load ? V.rl : 0);
        const vu = V.vin * V.r2 / (V.r1 + V.r2);
        const rth = V.r1 * V.r2 / (V.r1 + V.r2);
        ro.set('vo', kit.eng(sol.vout, 'V'));
        ro.set('vu', kit.eng(vu, 'V'));
        ro.set('i', kit.eng(sol.R1.i, 'A'));
        ro.set('il', V.load ? kit.eng(sol.RL.i, 'A') : '—');
        ro.set('rth', kit.eng(rth, 'Ω'));
        ro.set('p', kit.eng(sol.R1.p + sol.R2.p, 'W'));
        ctl.show('rl', V.load);
        // output against load resistance: the loading curve
        const pts = [];
        for (let k = 0; k <= 120; k++) {
          const rl = rth / 100 * Math.pow(1e5, k / 120);
          pts.push([rl, V.vin * (V.r2 * rl / (V.r2 + rl)) / (V.r1 + V.r2 * rl / (V.r2 + rl))]);
        }
        plot.set({
          x: { label: 'load resistance (Ω)', log: true, min: rth / 100, max: rth * 1000 },
          y: { label: 'output (V)', min: 0, max: vu * 1.15 },
          series: [{ pts, label: 'V_out' }],
          hlines: [{ y: vu, label: 'no load' }],
          vlines: [{ x: rth, label: 'R_th' }, { x: 10 * rth, label: '10 R_th' }],
          marks: V.load ? [{ x: V.rl, y: sol.vout }] : []
        });
      }

      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const x0 = W * 0.14, xm = W * 0.44, xo = W * 0.64, xl = W * 0.8, top = Hh * 0.16, bot = Hh * 0.86, mid = (top + bot) / 2;
        // the current, drawn as moving dots: speed proportional to the current (log-compressed so both mA and µA move)
        const i1 = sol ? sol.R1.i : 0, il = sol && sol.RL ? sol.RL.i : 0;
        const speed = i => Math.sign(i) * Math.min(120, 30 * Math.log10(1 + Math.abs(i) / 1e-6));
        phase += (dt || 0);
        S.wire(c, [[x0, mid - 30], [x0, top], [xm, top], [xm, top + 30]]);
        S.battery(c, x0, mid - 30, x0, mid + 30, { label: 'Vin', value: kit.eng(V.vin, 'V') });
        S.wire(c, [[x0, mid + 30], [x0, bot], [xm, bot]]);
        S.resistor(c, xm, top + 30, xm, mid - 6, { label: 'R₁', value: kit.eng(V.r1, 'Ω') });
        S.resistor(c, xm, mid + 6, xm, bot - 30, { label: 'R₂', value: kit.eng(V.r2, 'Ω') });
        S.wire(c, [[xm, mid - 6], [xm, mid + 6]]);
        S.wire(c, [[xm, bot - 30], [xm, bot]]);
        S.wire(c, [[xm, mid], [xo, mid]]);
        S.node(c, xm, mid);
        // voltmeter across the output
        S.wire(c, [[xo, mid], [xo, mid + 24]]);
        S.meter(c, xo, mid + 42, 'V', kit.eng(sol ? sol.vout : 0, 'V'));
        S.wire(c, [[xo, mid + 60], [xo, bot]]);
        S.node(c, xo, mid);
        S.wire(c, [[xm, bot], [xl, bot]]);
        // the load, through a switch
        S.wire(c, [[xo, mid], [xl - 36, mid]]);
        S.switch(c, xl - 36, mid, xl, mid, { closed: V.load });
        S.resistor(c, xl, mid, xl, bot, { label: 'R load', value: kit.eng(V.rl, 'Ω'), color: V.load ? C.text : C.faint });
        S.ground(c, xm, bot);
        // current
        const loop = [[x0, mid + 30], [x0, mid - 30], [x0, top], [xm, top], [xm, bot], [x0, bot], [x0, mid + 30]];
        S.flow(c, loop.slice(1).concat([loop[1]]), phase * speed(i1), { color: C.warn });
        if (V.load && il) S.flow(c, [[xm, mid], [xl, mid], [xl, bot], [xm, bot]], phase * speed(il), { color: C.warn });
        kit.label(c, 'current ' + kit.eng(i1, 'A'), x0 + 8, top - 12, { size: 12, color: C.warn });
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  Hyper.sim('ref-rc-scope', {
    title: 'RC circuit on the oscilloscope',
    blurb: `A square wave drives a resistor and capacitor; the scope shows the input (yellow) and the capacitor voltage (blue). The circuit is stepped in time by the simulator.

- When the half-period is much longer than $\\tau = RC$ the capacitor charges fully: sharp corners, rounded.
- Raise the frequency past $1/(2\\pi RC)$: the output shrinks to a small triangle — the circuit is a low-pass filter.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 320 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'r', label: 'R', min: 100, max: 100e3, value: 10e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'c', label: 'C', min: 1e-9, max: 100e-6, value: 100e-9, log: true, sig: 2, fmt: v => kit.eng(v, 'F') },
        { id: 'f', label: 'Square-wave frequency', min: 1, max: 20e3, value: 250, log: true, sig: 2, fmt: v => kit.eng(v, 'Hz') }
      ], () => rebuild());
      const ro = kit.readout(box.side, [['tau', 'τ = RC'], ['fc', 'Corner 1/(2πRC)'], ['ratio', 'Half-period / τ']]);
      const V = ctl.values;
      let c, cap, buf, dt, tdiv, stepsPerFrame, tStart;

      function rebuild() {
        const T = 1 / V.f;
        c = new kit.Circuit();
        c.V('in', 'gnd', t => ((t % T) < T / 2 ? 5 : 0));
        c.R('in', 'out', V.r);
        cap = c.C('out', 'gnd', V.c, 0);
        c.reset();
        dt = T / 200;
        tdiv = Hyper.niceStep(2 * T, 10);           // about two periods across ten divisions
        stepsPerFrame = Math.max(1, Math.round((10 * tdiv / dt) / 90));   // one sweep ≈ 1.5 s
        buf = []; tStart = 0;
        const tau = V.r * V.c;
        ro.set('tau', kit.eng(tau, 's'));
        ro.set('fc', kit.eng(1 / (2 * Math.PI * tau), 'Hz'));
        ro.set('ratio', (T / 2 / tau).toPrecision(3));
      }
      function frame() {
        for (let k = 0; k < stepsPerFrame; k++) {
          c.step(dt);
          if (c.t - tStart > 10 * tdiv) { buf = []; tStart = c.t; }
          buf.push([c.t - tStart, c.v('in'), c.v('out')]);
        }
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        // the schematic across the top
        const y = 40, x0 = W * 0.12;
        S.vsource(g, x0, y + 70, x0, y, { ac: true, label: 'square', value: '0–5 V' });
        S.wire(g, [[x0, y], [x0 + 40, y]]);
        S.resistor(g, x0 + 40, y, x0 + 160, y, { label: 'R', value: kit.eng(V.r, 'Ω') });
        S.wire(g, [[x0 + 160, y], [x0 + 230, y]]);
        S.node(g, x0 + 230, y);
        S.capacitor(g, x0 + 230, y, x0 + 230, y + 70, { label: 'C', value: kit.eng(V.c, 'F') });
        S.wire(g, [[x0, y + 70], [x0 + 230, y + 70]]);
        S.ground(g, x0 + 115, y + 70);
        S.wire(g, [[x0 + 230, y], [x0 + 290, y]]);
        kit.label(g, 'to scope', x0 + 296, y, { size: 12, color: C.muted });
        void cap;
        // the scope
        const sy = 140, sh = Math.max(120, Hh - sy - 30);
        S.scope(g, 16, sy, W - 32, sh, {
          tdiv, divy: 8,
          traces: [
            { pts: buf.map(p => [p[0], p[1]]), vdiv: 2, offset: -2, label: 'IN' },
            { pts: buf.map(p => [p[0], p[2]]), vdiv: 2, offset: -2, label: 'C' }
          ]
        });
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
    }
  });
})();
