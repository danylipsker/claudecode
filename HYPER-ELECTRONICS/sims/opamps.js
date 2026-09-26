/* HYPER-ELECTRONICS · sims/opamps.js — simulations for the Operational Amplifiers branch:
 * a configuration lab, the virtual earth, comparator against Schmitt trigger, integrator
 * and differentiator, an instrumentation amplifier on a bridge, a photodiode
 * transimpedance amplifier, gain–bandwidth Bode plots and slew-rate distortion.
 * Every circuit is solved by kit.Circuit and drawn with kit.schem. */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared helpers */
  const TAU = 2 * Math.PI;
  const frac = p => p - Math.floor(p);
  const WAVES = {
    sine: p => Math.sin(TAU * p),
    square: p => (frac(p) < 0.5 ? 1 : -1),
    triangle: p => { const q = frac(p); return q < 0.25 ? 4 * q : q < 0.75 ? 2 - 4 * q : 4 * q - 4; },
    none: () => 0
  };
  const VSTEPS = [1e-3, 2e-3, 5e-3, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50];
  /* volts per division (1-2-5) so that a peak fills about `divs` divisions */
  function vdivFor(peak, divs) {
    const want = Math.abs(peak) / (divs || 3.5);
    if (!(want > 0)) return VSTEPS[0];
    for (const s of VSTEPS) if (s >= want) return s;
    return 50;
  }

  /* One transient step of a circuit whose op-amps work with negative feedback. The
     op-amp model saturates smoothly at its output limits; starting Newton's method from
     zero at each step (c.x = null — capacitor states are kept) lets it come out of
     saturation cleanly instead of bouncing between the limits. Not for circuits with
     positive feedback (the Schmitt trigger), whose memory is the previous solution. */
  function tick(c, dt) { c.x = null; c.step(dt); }

  /* Real op-amp dynamics from the simulator's dominant-pole model. Its output moves at
     most (Vh ∓ v)/τ with τ = A0/(2π·GBW); with internal limits at ±Vh = ±500 V and
     A0 = 2π·GBW·Vh/SR the large-signal slewing is almost linear at the part's slew rate,
     while small signals see the part's gain–bandwidth product. (No output clipping: the
     signals in these simulations stay well inside the rails.) */
  const VH = 500;
  function dynOpamp(c, p, n, out, part) {
    return c.OPAMP(p, n, out, { gain: TAU * part.gbw * VH / part.sr, gbw: part.gbw, vpos: VH, vneg: -VH });
  }

  /* 32-bit hash to [0, 1), and smooth pseudo-random noise in [−1, 1] (same value for the same t) */
  function hash01(k) {
    let x = Math.imul(k | 0, 0x9E3779B1) ^ 0x85EBCA6B;
    x = Math.imul(x ^ (x >>> 15), 0x2C1B3C6D);
    x = Math.imul(x ^ (x >>> 12), 0x297A2D39);
    x ^= x >>> 15;
    return (x >>> 0) / 4294967296;
  }
  function noise(t, rate) {
    const u = t * rate, k = Math.floor(u), f = u - k;
    const a = hash01(k) + hash01(k + 1000003) - 1, b = hash01(k + 1) + hash01(k + 1000004) - 1;
    return a + (b - a) * f;
  }

  /* a dashed level across a scope screen drawn by S.scope(x, y, w, h) with 8 divisions */
  function scopeLevel(kit, g, sc, v, vdiv, off, color, text) {
    const y = sc.y + sc.h / 2 - (v / vdiv + off) * sc.h / 8;
    if (!(y >= sc.y && y <= sc.y + sc.h)) return;
    g.save();
    if (g.setLineDash) g.setLineDash([6, 5]);
    g.strokeStyle = color; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(sc.x, y); g.lineTo(sc.x + sc.w, y); g.stroke();
    g.restore();
    if (text) kit.label(g, text, sc.x + sc.w - 6, y - 8, { size: 10.5, color, align: 'right' });
  }
  /* an input or output terminal: a small open circle with a name */
  function terminal(S, g, C, x, y, text, right) {
    g.beginPath(); g.arc(x, y, 4, 0, 7);
    g.fillStyle = C.bg2; g.fill(); g.strokeStyle = C.text; g.lineWidth = 2; g.stroke();
    if (text) S.text(g, text, right ? x + 9 : x - 9, y, { size: 11.5, align: right ? 'left' : 'right' });
  }
  /* ground, or a node held at a reference voltage */
  function refMark(S, g, C, kit, x, y, vref) {
    if (vref) { S.wire(g, [[x, y], [x, y + 6]]); S.node(g, x, y + 6); S.text(g, kit.eng(vref, 'V') + ' ref', x, y + 18, { size: 10, weight: 500, color: C.muted }); }
    else S.ground(g, x, y);
  }
  /* fit a design box of w × h into the canvas area (x0, y0, W, H): a scale and an origin */
  function fitBox(w, h, x0, y0, W, H, kmax) {
    const k = Math.max(0.3, Math.min(kmax || 1.3, W / w, H / h));
    return { k, ox: x0 + (W - w * k) / 2, oy: y0 };
  }

  /* The classic configurations, drawn in a 400 × 200 design box (op-amp centre x = 250).
     cfg: inv, noninv, follower, sum, diff. o: { r1, rf (value labels), vref, part } */
  function drawAmp(S, g, C, kit, cfg, o) {
    const xo = 238;
    const ref = (x, y) => refMark(S, g, C, kit, x, y, o.vref || 0);
    if (cfg === 'inv' || cfg === 'sum' || cfg === 'diff') {
      const yo = 95, a = S.opamp(g, xo, yo, { label: o.part || '' }), N = [xo - 70, yo - 15];
      S.wire(g, [N, a.inn]); S.node(g, N[0], N[1]);
      S.wire(g, [N, [N[0], yo - 65]]);
      S.resistor(g, N[0], yo - 65, xo + 70, yo - 65, { label: 'R_f', value: o.rf });
      S.wire(g, [[xo + 70, yo - 65], [xo + 70, yo]]);
      S.wire(g, [a.out, [xo + 110, yo]]); S.node(g, xo + 70, yo);
      terminal(S, g, C, xo + 114, yo, 'V_out', true);
      if (cfg === 'diff') {
        terminal(S, g, C, xo - 200, yo - 15, 'V₂');
        S.resistor(g, xo - 196, yo - 15, N[0], yo - 15, { label: 'R₁', value: o.r1 });
        const P = [xo - 60, yo + 15];
        terminal(S, g, C, xo - 200, yo + 15, 'V₁');
        S.resistor(g, xo - 196, yo + 15, P[0], P[1], { label: 'R₁', value: o.r1, labelOffset: -16 });
        S.wire(g, [P, a.inp]); S.node(g, P[0], P[1]);
        S.resistor(g, P[0], P[1], P[0], yo + 80, { label: 'R_f', value: o.rf });
        ref(P[0], yo + 80);
      } else {
        S.wire(g, [a.inp, [xo - 60, yo + 15], [xo - 60, yo + 40]]);
        ref(xo - 60, yo + 40);
        if (cfg === 'sum') {
          const J = [xo - 110, yo - 15];
          terminal(S, g, C, xo - 200, yo - 15, 'V₁');
          S.resistor(g, xo - 196, yo - 15, J[0], J[1], { label: 'R₁', value: o.r1 });
          S.wire(g, [J, N]); S.node(g, J[0], J[1]);
          terminal(S, g, C, xo - 200, yo + 35, 'V₂');
          S.resistor(g, xo - 196, yo + 35, J[0], yo + 35, { label: 'R₁', value: o.r1, labelOffset: -16 });
          S.wire(g, [[J[0], yo + 35], J]);
        } else {
          terminal(S, g, C, xo - 200, yo - 15, 'V_in');
          S.resistor(g, xo - 196, yo - 15, N[0], N[1], { label: 'R₁', value: o.r1 });
        }
      }
    } else {
      const yo = cfg === 'noninv' ? 55 : 70, a = S.opamp(g, xo, yo, { flip: true, label: o.part || '' });
      terminal(S, g, C, xo - 200, yo - 15, 'V_in');
      S.wire(g, [[xo - 196, yo - 15], a.inp]);
      S.wire(g, [a.out, [xo + 110, yo]]); S.node(g, xo + 70, yo);
      terminal(S, g, C, xo + 114, yo, 'V_out', true);
      if (cfg === 'noninv') {
        const N2 = [xo - 60, yo + 60];
        S.wire(g, [a.inn, [xo - 60, yo + 15], N2]); S.node(g, N2[0], N2[1]);
        S.resistor(g, N2[0], N2[1], xo + 70, N2[1], { label: 'R_f', value: o.rf });
        S.wire(g, [[xo + 70, N2[1]], [xo + 70, yo]]);
        S.resistor(g, N2[0], N2[1], N2[0], yo + 120, { label: 'R₁', value: o.r1 });
        ref(N2[0], yo + 120);
      } else {
        S.wire(g, [a.out, [xo + 70, yo], [xo + 70, yo + 50], [xo - 60, yo + 50], [xo - 60, yo + 15], a.inn]);
      }
    }
  }

  /* Op-amps with their data-sheet figures (typical values) */
  const PARTS = {
    lm358: { name: 'LM358', gbw: 1e6, sr: 0.3e6, a0: 1e5 },
    ua741: { name: 'µA741', gbw: 1e6, sr: 0.5e6, a0: 2e5 },
    tl072: { name: 'TL072', gbw: 3e6, sr: 13e6, a0: 2e5 },
    ne5532: { name: 'NE5532', gbw: 10e6, sr: 9e6, a0: 1e5 },
    opa2134: { name: 'OPA2134', gbw: 8e6, sr: 20e6, a0: 1e6 },
    mcp6002: { name: 'MCP6002', gbw: 1e6, sr: 0.6e6, a0: 1e5 },
    opa380: { name: 'OPA380', gbw: 90e6, sr: 80e6, a0: 1e6 }
  };

  /* ================================================================ 1. configuration lab */
  Hyper.sim('oa-config-lab', {
    title: 'Op-amp configuration lab',
    blurb: `Pick a configuration, set the resistors and drive it from a signal generator. The circuit is solved by the simulator (op-amp gain 200 000) and the oscilloscope shows the input (yellow) and the output (cyan); the dashed lines are the limits the output cannot pass.

- **Inverting:** gain $-R_f/R_1$. Make $R_f$ smaller than $R_1$ for an attenuator; raise the amplitude until the output flattens on a dashed line — that is clipping.
- **Non-inverting** and **follower:** in phase, gain $1 + R_f/R_1$, never below 1.
- **Summing** and **difference:** input 2 is a DC level. The summer shifts the whole output; the difference amplifier subtracts it.
- **Single +5 V supply:** a signal centred on 0 V loses its negative half. Tick *mid-supply* to centre everything on 2.5 V, then compare the three output-swing styles.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 380, maxH: 640 });
      const S = kit.schem;
      const fr = v => kit.eng(v, 'Ω');
      const ctl = kit.controls(box.side, [
        { id: 'config', type: 'select', label: 'Configuration', options: [['Inverting', 'inv'], ['Non-inverting', 'noninv'], ['Voltage follower', 'follower'], ['Summing (two inputs)', 'sum'], ['Difference', 'diff']], value: params.config || 'inv' },
        { id: 'wave', type: 'select', label: 'Input waveform', options: [['Sine', 'sine'], ['Triangle', 'triangle'], ['Square', 'square']], value: params.wave || 'sine' },
        { id: 'amp', label: 'Input amplitude (peak)', min: 0.05, max: 10, value: params.amp || 1, log: true, sig: 2, fmt: v => kit.eng(v, 'V') },
        { id: 'f', label: 'Frequency', min: 10, max: 10e3, value: params.f || 1000, log: true, sig: 2, fmt: v => kit.eng(v, 'Hz') },
        { id: 'r1', label: 'R₁ (input)', min: 1e3, max: 100e3, value: params.r1 || 10e3, log: true, sig: 2, fmt: fr },
        { id: 'rf', label: 'R_f (feedback)', min: 1e3, max: 1e6, value: params.rf || 47e3, log: true, sig: 2, fmt: fr },
        { id: 'v2', label: 'Input 2 (DC)', min: -5, max: 5, step: 0.05, value: params.v2 != null ? params.v2 : 1, unit: 'V' },
        { id: 'supply', type: 'select', label: 'Supply', options: [['±15 V', 'd15'], ['±5 V', 'd5'], ['Single +5 V', 'single']], value: params.supply || 'd15' },
        { id: 'part', type: 'select', label: 'Output swing', options: [['1.5 V from each rail (TL072-like)', 'tl072'], ['Down to V−, 1.5 V below V+ (LM358-like)', 'lm358'], ['Rail-to-rail output (MCP6002-like)', 'rro']], value: params.part || 'tl072' },
        { id: 'bias', type: 'check', label: 'Signals referred to mid-supply (2.5 V)', value: !!params.bias }
      ], () => rebuild());
      const ro = kit.readout(box.side, [['ideal', 'Ideal gain'], ['meas', 'Measured gain (p-p ratio)'], ['range', 'Output range'], ['lim', 'Output limits'], ['rin', 'Input resistance'], ['state', 'State']]);
      const V = ctl.values;
      let c, dt, tdiv, spf, buf = [], t0 = 0, vpos = 13.5, vneg = -13.5, vref = 0, mm = null, vdIn = 1, vdOut = 1, supTxt = '';

      const resetMM = () => { mm = { iMin: Infinity, iMax: -Infinity, oMin: Infinity, oMax: -Infinity }; };
      const sign = () => (V.config === 'inv' || V.config === 'sum' ? -1 : 1);
      function idealText() {
        const g = V.rf / V.r1, f = x => kit.fmt(x, 3);
        switch (V.config) {
          case 'inv': return '−R_f/R₁ = ' + f(-g);
          case 'noninv': return '1 + R_f/R₁ = ' + f(1 + g);
          case 'follower': return '1';
          case 'sum': return '−R_f/R₁ = ' + f(-g) + ' on each input';
          default: return 'R_f/R₁ = ' + f(g) + ' on V₁ − V₂';
        }
      }
      function rebuild() {
        const cfg = V.config, T = 1 / V.f;
        const sup = V.supply === 'd15' ? [15, -15] : V.supply === 'd5' ? [5, -5] : [5, 0];
        const hr = V.part === 'tl072' ? [1.5, 1.5] : V.part === 'lm358' ? [1.5, 0.02] : [0.025, 0.025];
        vpos = sup[0] - hr[0]; vneg = sup[1] + hr[1];
        const single = V.supply === 'single';
        vref = single && V.bias ? sup[0] / 2 : 0;
        supTxt = (single ? 'single +5 V supply' : 'supply ±' + sup[0] + ' V');
        c = new kit.Circuit();
        const ref = vref ? 'ref' : 'gnd';
        if (vref) c.V('ref', 'gnd', vref);
        const w = WAVES[V.wave] || WAVES.sine, A = V.amp, f = V.f;
        c.V('in', ref, t => A * w(f * t));
        const oa = { vpos, vneg, gain: 2e5 };
        const R1 = V.r1, Rf = V.rf;
        if (cfg === 'inv') { c.R('in', 'n', R1); c.R('n', 'out', Rf); c.OPAMP(ref, 'n', 'out', oa); }
        else if (cfg === 'noninv') { c.R('n', ref, R1); c.R('n', 'out', Rf); c.OPAMP('in', 'n', 'out', oa); }
        else if (cfg === 'follower') { c.OPAMP('in', 'out', 'out', oa); }
        else if (cfg === 'sum') { c.V('in2', ref, V.v2); c.R('in', 'n', R1); c.R('in2', 'n', R1); c.R('n', 'out', Rf); c.OPAMP(ref, 'n', 'out', oa); }
        else { c.V('in2', ref, V.v2); c.R('in', 'p', R1); c.R('p', ref, Rf); c.R('in2', 'n', R1); c.R('n', 'out', Rf); c.OPAMP('p', 'n', 'out', oa); }
        c.reset();
        dt = T / 400;
        tdiv = Hyper.niceStep(2 * T, 10);
        spf = Math.max(1, Math.round(10 * tdiv / dt / 90));
        buf = []; t0 = 0; resetMM();
        // scales from the ideal behaviour until a sweep has been measured
        const g = V.rf / V.r1;
        const est = cfg === 'inv' ? g * A : cfg === 'noninv' ? (1 + g) * A : cfg === 'follower' ? A : g * (A + Math.abs(V.v2));
        vdIn = vdivFor(A, 3.6);
        vdOut = vdivFor(Math.max(0.02, Math.min(est, Math.max(vpos - vref, vref - vneg))), 3.6);
        ctl.show('v2', cfg === 'sum' || cfg === 'diff');
        ctl.show('r1', cfg !== 'follower'); ctl.show('rf', cfg !== 'follower');
        ctl.show('bias', single);
        ro.set('ideal', idealText());
        ro.set('lim', kit.eng(vneg, 'V') + ' … ' + kit.eng(vpos, 'V'));
        ro.set('rin', cfg === 'inv' ? fr(R1) + ' (R₁ to the virtual earth)' : cfg === 'sum' ? fr(R1) + ' on each input' : cfg === 'diff' ? 'V₁: ' + fr(R1 + Rf) + ', V₂: about ' + fr(R1) : 'very high (the op-amp input)');
        ro.set('meas', '…'); ro.set('range', '…'); ro.set('state', '…');
      }
      function endSweep() {
        if (!(mm.iMax > mm.iMin) || !Number.isFinite(mm.oMax)) return;
        const gain = sign() * (mm.oMax - mm.oMin) / (mm.iMax - mm.iMin);
        ro.set('meas', kit.fmt(gain, 3));
        ro.set('range', kit.eng(mm.oMin, 'V') + ' … ' + kit.eng(mm.oMax, 'V'));
        const top = mm.oMax > vpos - 0.02, bot = mm.oMin < vneg + 0.02;
        ro.set('state', top && bot ? 'clipping at both limits' : top ? 'clipping at the upper limit' : bot ? 'clipping at the lower limit' : 'linear');
        vdOut = vdivFor(Math.max(0.02, mm.oMax - vref, vref - mm.oMin), 3.6);
      }
      function frame() {
        for (let k = 0; k < spf; k++) {
          tick(c, dt);
          if (c.t - t0 > 10 * tdiv) { endSweep(); buf = []; t0 = c.t; resetMM(); }
          const vi = c.v('in'), vo = c.v('out');
          if (!Number.isFinite(vi) || !Number.isFinite(vo)) continue;
          buf.push([c.t - t0, vi, vo]);
          if (vi < mm.iMin) mm.iMin = vi; if (vi > mm.iMax) mm.iMax = vi;
          if (vo < mm.oMin) mm.oMin = vo; if (vo > mm.oMax) mm.oMax = vo;
        }
        draw();
      }
      function draw() {
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const fb = fitBox(400, 200, 0, 6, W, Hh * 0.38, 1.3);
        g.save(); g.translate(fb.ox, fb.oy); g.scale(fb.k, fb.k);
        drawAmp(S, g, C, kit, V.config, { r1: fr(V.r1), rf: fr(V.rf), vref });
        g.restore();
        kit.label(g, supTxt, W - 10, 14, { size: 11.5, color: C.muted, align: 'right' });
        const sc = { x: 12, y: fb.oy + 200 * fb.k + 12, w: W - 24, h: 0 };
        sc.h = Math.max(100, Hh - sc.y - 26);
        const offI = -vref / vdIn, offO = -vref / vdOut;
        S.scope(g, sc.x, sc.y, sc.w, sc.h, {
          tdiv, divy: 8,
          traces: [
            { pts: buf.map(p => [p[0], p[1]]), vdiv: vdIn, offset: offI, label: 'IN' },
            { pts: buf.map(p => [p[0], p[2]]), vdiv: vdOut, offset: offO, label: 'OUT' }
          ]
        });
        scopeLevel(kit, g, sc, vpos, vdOut, offO, '#ff8a80', 'output limit ' + kit.eng(vpos, 'V'));
        scopeLevel(kit, g, sc, vneg, vdOut, offO, '#ff8a80', 'output limit ' + kit.eng(vneg, 'V'));
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 2. the virtual earth */
  Hyper.sim('oa-virtual-earth', {
    title: 'The virtual earth',
    blurb: `An inverting amplifier solved at its DC operating point. The dots show the current: it flows through $R_1$ **and on through $R_f$** — none enters the op-amp's input — so the output must sit at $-I R_f$. The inverting input stays within microvolts of 0 V although it is connected to nothing but resistors: a *virtual earth*.

- Change the open-loop gain: the voltage at the − input is $-V_\\text{out}/A$ — smaller as $A$ grows, never exactly zero.
- Push the input until the output hits its limit (±13.5 V on ±15 V): the − input leaves 0 V at once. The golden rules hold only while the output is free to move.
- Connect the load: the output current rises, the input current does not — the op-amp's supply pins provide it.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300, maxH: 460 });
      const S = kit.schem;
      const fr = v => kit.eng(v, 'Ω');
      const ctl = kit.controls(box.side, [
        { id: 'vin', label: 'Input voltage', min: -3, max: 3, step: 0.01, value: params.vin != null ? params.vin : 0.5, unit: 'V' },
        { id: 'r1', label: 'R₁', min: 1e3, max: 100e3, value: params.r1 || 10e3, log: true, sig: 2, fmt: fr },
        { id: 'rf', label: 'R_f', min: 1e3, max: 1e6, value: params.rf || 47e3, log: true, sig: 2, fmt: fr },
        { id: 'a0', type: 'select', label: 'Open-loop gain A', options: [['100', 100], ['1 000', 1e3], ['10 000', 1e4], ['100 000 (LM358)', 1e5], ['1 000 000', 1e6]], value: params.a0 || 1e5 },
        { id: 'load', type: 'check', label: 'Load of 1 kΩ on the output', value: false },
        { id: 'sweep', type: 'check', label: 'Sweep the input slowly', value: false }
      ], id => { if (id !== 'sweep') { solve(); curves(); } });
      const ro = kit.readout(box.side, [['vn', 'Voltage at the − input'], ['i1', 'Current in R₁'], ['if', 'Current in R_f'], ['iin', 'Into the op-amp input'], ['vo', 'Output'], ['io', 'Op-amp output current'], ['g', 'Gain: actual (ideal)'], ['lg', 'Loop gain Aβ']]);
      const pbox = document.createElement('div');
      pbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(pbox);
      const p1 = kit.plot(pbox, { x: { label: 'input (V)' }, y: { label: 'output (V)' } }, 160);
      const p2 = kit.plot(pbox, { x: { label: 'input (V)' }, y: { label: 'V at − input (mV)' } }, 150);
      const V = ctl.values;
      let sol = null, ph1 = 0, ph2 = 0, tt = 0;
      const LIM = 13.5;

      function build(vin) {
        const c = new kit.Circuit();
        c.V('in', 'gnd', vin);
        const R1 = c.R('in', 'n', V.r1), Rf = c.R('n', 'out', V.rf);
        const RL = V.load ? c.R('out', 'gnd', 1e3) : null;
        const oa = c.OPAMP('gnd', 'n', 'out', { gain: V.a0, vpos: LIM, vneg: -LIM });
        c.dc();
        return { c, R1, Rf, RL, oa, vn: c.v('n'), vo: c.v('out') };
      }
      function solve() {
        sol = build(V.vin);
        const beta = V.r1 / (V.r1 + V.rf), ideal = -V.rf / V.r1;
        ro.set('vn', kit.eng(sol.vn, 'V'));
        ro.set('i1', kit.eng(sol.R1.i, 'A'));
        ro.set('if', kit.eng(sol.Rf.i, 'A'));
        const iin = sol.R1.i - sol.Rf.i;
        ro.set('iin', Math.abs(iin) < 1e-12 ? '0 (none)' : kit.eng(iin, 'A'));
        ro.set('vo', kit.eng(sol.vo, 'V'));
        ro.set('io', kit.eng(sol.oa.i, 'A'));
        ro.set('g', Math.abs(V.vin) > 1e-6 ? kit.fmt(sol.vo / V.vin, 4) + ' (' + kit.fmt(ideal, 4) + ')' : '— (' + kit.fmt(ideal, 4) + ')');
        const lg = V.a0 * beta;
        ro.set('lg', kit.fmt(lg, 3) + ' = ' + kit.fmt(20 * Math.log10(lg), 3) + ' dB');
      }
      function curves() {
        const t = [], u = [];
        for (let k = 0; k <= 120; k++) {
          const vi = -3 + 6 * k / 120, s = build(vi);
          t.push([vi, s.vo]); u.push([vi, s.vn * 1e3]);
        }
        p1.set({ x: { label: 'input (V)', min: -3, max: 3 }, y: { label: 'output (V)', min: -15, max: 15 }, series: [{ pts: t, label: 'V_out' }], marks: sol ? [{ x: V.vin, y: sol.vo }] : [], hlines: [{ y: LIM, label: 'limit' }, { y: -LIM }] });
        p2.set({ x: { label: 'input (V)', min: -3, max: 3 }, y: { label: 'V at − input (mV)' }, series: [{ pts: u, label: 'V−' }], marks: sol ? [{ x: V.vin, y: sol.vn * 1e3 }] : [] });
      }
      function draw(dt) {
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const fb = fitBox(470, 235, 0, 8, W, Hh - 12, 1.45);
        const speed = i => Math.sign(i) * Math.min(120, 30 * Math.log10(1 + Math.abs(i) / 1e-7));
        ph1 += (dt || 0) * speed(sol ? sol.R1.i : 0);
        ph2 += (dt || 0) * speed(sol && sol.RL ? sol.RL.i : 0);
        g.save(); g.translate(fb.ox, fb.oy); g.scale(fb.k, fb.k);
        const xo = 275, yo = 125, N = [175, 110];
        const sat = sol && Math.abs(sol.vo) > LIM - 0.05;
        const a = S.opamp(g, xo, yo);
        S.wire(g, [[60, 130], [60, 110], [80, 110]]);
        S.vsource(g, 60, 130, 60, 190, {});
        S.ground(g, 60, 190);
        S.resistor(g, 80, 110, N[0], N[1], { label: 'R₁', value: fr(V.r1) });
        S.wire(g, [N, a.inn]); S.node(g, N[0], N[1]);
        S.wire(g, [a.inp, [221, 140], [221, 165]]); S.ground(g, 221, 165);
        S.wire(g, [N, [N[0], 50]]);
        S.resistor(g, N[0], 50, 345, 50, { label: 'R_f', value: fr(V.rf) });
        S.wire(g, [[345, 50], [345, yo]]);
        S.wire(g, [a.out, [405, yo]]); S.node(g, 345, yo);
        terminal(S, g, C, 409, yo, '', true);
        if (V.load) {
          S.wire(g, [[380, yo], [380, 150]]); S.node(g, 380, yo);
          S.resistor(g, 380, 150, 380, 205, { label: 'R_L', value: '1 kΩ' });
          S.ground(g, 380, 205);
        }
        // current, as moving dots: through R₁, on through R_f into the output
        S.flow(g, [[60, 190], [60, 110], [N[0], 110], [N[0], 50], [345, 50], [345, yo], [a.out[0], yo]], ph1, { color: C.warn });
        if (V.load && sol && sol.RL) S.flow(g, [[a.out[0], yo], [380, yo], [380, 205]], ph2, { color: C.warn });
        g.restore();
        // call-outs in canvas pixels
        const P = (x, y) => [fb.ox + x * fb.k, fb.oy + y * fb.k];
        if (sol) {
          const [vx, vy] = P(20, 90);
          kit.label(g, 'V_in = ' + kit.eng(V.vin, 'V'), vx, vy, { size: 12, color: C.text, weight: 600 });
          const [nx, ny] = P(207, 152);
          kit.label(g, 'V− = ' + kit.eng(sol.vn, 'V'), nx, ny, { size: 12, align: 'right', color: sat ? C.bad : C.ok, bg: C.surface, weight: 600 });
          kit.label(g, sat ? 'lost: output limited' : 'virtual earth', nx, ny + 20 * fb.k, { size: 11, align: 'right', color: sat ? C.bad : C.muted });
          const [ix, iy] = P(128, 126);
          kit.label(g, 'I₁ = ' + kit.eng(sol.R1.i, 'A'), ix, iy, { size: 11.5, align: 'center', color: C.warn });
          const [fx, fy] = P(262, 68);
          kit.label(g, 'I_f = ' + kit.eng(sol.Rf.i, 'A'), fx, fy, { size: 11.5, align: 'center', color: C.warn });
          const [qx, qy] = P(205, 97);
          kit.label(g, '0 A in', qx, qy, { size: 10.5, align: 'center', color: C.muted });
          const [ox, oy] = P(353, yo - 20);
          kit.label(g, 'V_out = ' + kit.eng(sol.vo, 'V'), ox, oy, { size: 12, color: C.accent, bg: C.surface, weight: 600 });
        }
      }
      solve(); curves();
      const loop = kit.loop(dt => {
        if (V.sweep) {
          tt += dt;
          const v = Math.round(300 * Math.sin(0.5 * tt)) / 100;
          if (v !== V.vin) { ctl.set('vin', v); solve(); p1.set({ marks: [{ x: v, y: sol.vo }] }); p2.set({ marks: [{ x: v, y: sol.vn * 1e3 }] }); }
        }
        draw(dt);
      }, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 3. comparator and Schmitt trigger */
  Hyper.sim('oa-schmitt', {
    title: 'Comparator or Schmitt trigger?',
    blurb: `The same slow, noisy signal (yellow) drives a plain comparator (top trace) and a Schmitt trigger (bottom trace), both on a single 5 V supply with a 2.5 V reference. The dashed lines are the Schmitt trigger's two thresholds.

- With noise on, watch the comparator **chatter**: every wiggle across 2.5 V is a new edge. Count them in the read-out.
- The Schmitt trigger switches once each way as long as its **hysteresis** (the gap between the dashed lines) is larger than the noise's peak-to-peak size.
- Lower $R_2$ for more hysteresis — and notice the price: the switching points move away from 2.5 V.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 380, maxH: 640 });
      const S = kit.schem;
      const R1 = 10e3, VREF = 2.5, VCC = 5;
      const ctl = kit.controls(box.side, [
        { id: 'noise', label: 'Noise on the input (peak)', min: 0, max: 0.4, step: 0.005, value: params.noise != null ? params.noise : 0.12, fmt: v => kit.eng(v, 'V') },
        { id: 'r2', label: 'Feedback R₂ (R₁ = 10 kΩ)', min: 20e3, max: 2e6, value: params.r2 || 150e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'wave', type: 'select', label: 'Slow signal (5 Hz)', options: [['Sine', 'sine'], ['Triangle', 'triangle']], value: 'sine' },
        { id: 'amp', label: 'Signal amplitude', min: 0.2, max: 2, step: 0.05, value: 1.5, unit: 'V' }
      ], () => rebuild());
      const ro = kit.readout(box.side, [['vth', 'Upper threshold V_TH'], ['vtl', 'Lower threshold V_TL'], ['hys', 'Hysteresis'], ['ec', 'Comparator: edges per sweep'], ['es', 'Schmitt: edges per sweep']]);
      const V = ctl.values;
      const dt = 5e-5, tdiv = 0.02, spf = 45;
      let c, buf = [], t0 = 0, ec = 0, es = 0, lastC = null, lastS = null, vth = 0, vtl = 0;

      function rebuild() {
        c = new kit.Circuit();
        const A = V.amp, w = WAVES[V.wave] || WAVES.sine, nz = V.noise;
        c.V('in', 'gnd', t => VREF + A * w(5 * t) + nz * noise(t, 4000));
        c.V('ref', 'gnd', VREF);
        c.OPAMP('in', 'ref', 'oc', { vpos: VCC, vneg: 0, gain: 1e5 });
        c.R('in', 'sp', R1);
        c.R('oS', 'sp', V.r2);
        c.OPAMP('sp', 'ref', 'oS', { vpos: VCC, vneg: 0, gain: 1e5 });
        // Power-up: with the input inside the hysteresis band the circuit has two stable
        // states (and an unstable one between them). Hold the output low for the first
        // operating point, then release it and step on from that solution.
        const hold = c.SW('oS', 'gnd', true);
        c.dc();
        hold.closed = false;
        buf = []; t0 = 0; ec = 0; es = 0; lastC = null; lastS = null;
        vth = VREF * (1 + R1 / V.r2);
        vtl = vth - VCC * R1 / V.r2;
        ro.set('vth', kit.eng(vth, 'V'));
        ro.set('vtl', kit.eng(vtl, 'V'));
        ro.set('hys', kit.eng(vth - vtl, 'V') + ' (noise ' + kit.eng(2 * nz, 'V') + ' p-p)');
        ro.set('ec', '…'); ro.set('es', '…');
      }
      function frame() {
        for (let k = 0; k < spf; k++) {
          c.step(dt);                               // positive feedback: keep the previous solution
          if (c.t - t0 > 10 * tdiv) { ro.set('ec', String(ec)); ro.set('es', String(es)); buf = []; t0 = c.t; ec = 0; es = 0; }
          const vi = c.v('in'), vc = c.v('oc'), vs = c.v('oS');
          const hc = vc > VCC / 2, hs = vs > VCC / 2;
          if (lastC !== null && hc !== lastC) ec++;
          if (lastS !== null && hs !== lastS) es++;
          lastC = hc; lastS = hs;
          if (Number.isFinite(vi) && Number.isFinite(vc) && Number.isFinite(vs)) buf.push([c.t - t0, vi, vc, vs]);
        }
        draw();
      }
      function draw() {
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const fb = fitBox(560, 150, 0, 4, W, Hh * 0.3, 1.25);
        g.save(); g.translate(fb.ox, fb.oy); g.scale(fb.k, fb.k);
        // the comparator
        let a = S.opamp(g, 170, 70, { flip: true });
        terminal(S, g, C, 52, 55, 'V_in');
        S.wire(g, [[56, 55], a.inp]);
        terminal(S, g, C, 52, 85, '2.5 V');
        S.wire(g, [[56, 85], a.inn]);
        S.wire(g, [a.out, [256, 70]]); terminal(S, g, C, 260, 70, '', true);
        S.text(g, 'Comparator', 160, 136, { size: 12.5 });
        // the Schmitt trigger
        const X = 300;
        a = S.opamp(g, X + 150, 70, { flip: true });
        terminal(S, g, C, X + 22, 55, 'V_in');
        S.resistor(g, X + 26, 55, X + 80, 55, { label: 'R₁', value: '10 kΩ', labelOffset: -16 });
        S.wire(g, [[X + 80, 55], a.inp]); S.node(g, X + 80, 55);
        S.wire(g, [[X + 80, 55], [X + 80, 26]]);
        S.resistor(g, X + 80, 26, X + 214, 26, { label: 'R₂', value: kit.eng(V.r2, 'Ω') });
        S.wire(g, [[X + 214, 26], [X + 214, 70]]); S.node(g, X + 214, 70);
        terminal(S, g, C, X + 22, 105, '2.5 V');
        S.wire(g, [[X + 26, 105], [X + 96, 105], [X + 96, 85], a.inn]);
        S.wire(g, [a.out, [X + 230, 70]]); terminal(S, g, C, X + 234, 70, '', true);
        S.text(g, 'Schmitt trigger', X + 130, 136, { size: 12.5 });
        g.restore();
        const sc = { x: 12, y: fb.oy + 150 * fb.k + 10, w: W - 24, h: 0 };
        sc.h = Math.max(120, Hh - sc.y - 26);
        S.scope(g, sc.x, sc.y, sc.w, sc.h, {
          tdiv, divy: 8,
          traces: [
            { pts: buf.map(p => [p[0], p[1]]), vdiv: 1, offset: -2.5, label: 'IN' },
            { pts: buf.map(p => [p[0], p[2]]), vdiv: 5, offset: 2.5, label: 'COMPARATOR' },
            { pts: buf.map(p => [p[0], p[3]]), vdiv: 5, offset: -3.5, label: 'SCHMITT' }
          ]
        });
        scopeLevel(kit, g, sc, vth, 1, -2.5, '#ffb86b', 'V_TH');
        scopeLevel(kit, g, sc, vtl, 1, -2.5, '#ffb86b', 'V_TL');
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 4. integrator and differentiator */
  Hyper.sim('oa-integrator', {
    title: 'Integrator and differentiator',
    blurb: `A capacitor in the feedback path makes an **integrator**; swap it with the input resistor for a **differentiator**. Input yellow, output cyan.

- Integrator: a square wave becomes a triangle, a triangle becomes smooth parabolic arcs, a sine becomes a (shifted) sine. Double the frequency: the output halves.
- Give the op-amp an **offset** $V_{os}$ of a few millivolts and watch the output creep to a limit — pick *None* as the input to see pure drift. The leak resistor $R_f$ stops it at $V_{os}(1 + R_f/R)$.
- Differentiator: a triangle becomes a square. Add high-frequency noise: the output is swamped, because the gain rises with frequency. The practical version limits that gain.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 380, maxH: 640 });
      const S = kit.schem;
      const fr = v => kit.eng(v, 'Ω'), fc = v => kit.eng(v, 'F');
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Circuit', options: [['Integrator', 'int'], ['Differentiator', 'dif']], value: params.mode || 'int' },
        { id: 'wave', type: 'select', label: 'Input', options: [['Square', 'square'], ['Triangle', 'triangle'], ['Sine', 'sine'], ['None (input grounded)', 'none']], value: params.wave || 'square' },
        { id: 'amp', label: 'Amplitude', min: 0.1, max: 5, step: 0.05, value: params.amp || 1, unit: 'V' },
        { id: 'f', label: 'Frequency', min: 10, max: 10e3, value: params.f || 500, log: true, sig: 2, fmt: v => kit.eng(v, 'Hz') },
        { id: 'r', label: 'R', min: 1e3, max: 1e6, value: params.r || 10e3, log: true, sig: 2, fmt: fr },
        { id: 'c', label: 'C', min: 1e-9, max: 10e-6, value: params.c || 100e-9, log: true, sig: 2, fmt: fc },
        { id: 'vos', label: 'Op-amp offset V_os', min: -10, max: 10, step: 0.1, value: params.vos || 0, unit: 'mV' },
        { id: 'leak', type: 'check', label: 'Leak resistor R_f across C', value: !!params.leak },
        { id: 'rf', label: 'R_f', min: 10e3, max: 10e6, value: params.rf || 1e6, log: true, sig: 2, fmt: fr },
        { id: 'noise', label: 'High-frequency noise on the input', min: 0, max: 0.1, step: 0.002, value: params.noise || 0, fmt: v => kit.eng(v, 'V') },
        { id: 'tame', type: 'check', label: 'Practical version (R_s = R/10, C_f = C/10)', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Discharge C and restart' }] }
      ], () => rebuild());
      const ro = kit.readout(box.side, [['rc', 'Time constant RC'], ['fu', 'Unity-gain frequency 1/(2πRC)'], ['exp', 'Expected output'], ['drift', 'Drift'], ['range', 'Output range'], ['state', 'State']]);
      const V = ctl.values;
      const LIM = 13.5;
      let c, dt, tdiv, spf, buf = [], t0 = 0, mm = null, vdIn = 1, vdOut = 1;
      const resetMM = () => { mm = { lo: Infinity, hi: -Infinity }; };

      function rebuild() {
        const integ = V.mode === 'int', A = V.amp, f = V.f, R = V.r, Cc = V.c, w = WAVES[V.wave] || WAVES.square;
        const ph = integ ? 0.25 : 0;              // start at a peak, so an integrator's output is centred
        const nz = integ ? 0 : V.noise;
        c = new kit.Circuit();
        c.V('in', 'gnd', t => A * w(f * t + ph) + nz * (0.5 * Math.sin(TAU * 31 * f * t) + 0.35 * Math.sin(TAU * 53 * f * t + 1) + 0.25 * Math.sin(TAU * 79 * f * t + 2)));
        c.V('p', 'gnd', integ ? V.vos * 1e-3 : 0);     // the offset, as a source in series with the + input
        if (integ) {
          c.R('in', 'n', R); c.C('n', 'out', Cc, 0);
          if (V.leak) c.R('n', 'out', V.rf);
        } else {
          if (V.tame) { c.R('in', 'm', R / 10); c.C('m', 'n', Cc, 0); c.C('n', 'out', Cc / 10, 0); }
          else c.C('in', 'n', Cc, 0);
          c.R('n', 'out', R);
        }
        c.OPAMP('p', 'n', 'out', { vpos: LIM, vneg: -LIM, gain: 2e5 });
        c.reset();
        const T = 1 / f, RC = R * Cc, fu = 1 / (TAU * RC);
        const still = integ && V.wave === 'none';
        if (still) {
          // no signal: a time base long enough to watch the drift reach a limit (or settle)
          const rate = Math.abs(V.vos) * 1e-3 / RC;
          const span = V.leak ? 6 * V.rf * Cc : rate > 0 ? 1.3 * LIM / rate : 2 * T;
          tdiv = Hyper.niceStep(Math.min(20, Math.max(2e-4, span)), 10);
          dt = tdiv / 200;
        } else {
          dt = T / 1000;
          tdiv = Hyper.niceStep(2 * T, 10);
        }
        spf = Math.max(1, Math.round(10 * tdiv / dt / 90));
        buf = []; t0 = 0; resetMM();
        let exp = '', peak = 0;
        if (integ) {
          if (V.wave === 'square') { peak = A / (4 * f * RC); exp = 'triangle, ' + kit.eng(2 * peak, 'V') + ' p-p'; }
          else if (V.wave === 'sine') { peak = A / (TAU * f * RC); exp = 'sine, ' + kit.eng(peak, 'V') + ' peak'; }
          else if (V.wave === 'triangle') { peak = A / (8 * f * RC); exp = 'parabolic arcs, ' + kit.eng(peak, 'V') + ' peak'; }
          else exp = '0 V (nothing to integrate)';
        } else {
          if (V.wave === 'triangle') { peak = 4 * A * f * RC; exp = 'square, ±' + kit.eng(peak, 'V'); }
          else if (V.wave === 'sine') { peak = TAU * f * RC * A; exp = 'sine, ' + kit.eng(peak, 'V') + ' peak'; }
          else if (V.wave === 'square') { peak = LIM; exp = 'spikes at every edge'; }
          else exp = '0 V';
        }
        if (peak > LIM) exp += ' — beyond the ±13.5 V limit';
        ro.set('rc', kit.eng(RC, 's'));
        ro.set('fu', kit.eng(fu, 'Hz'));
        ro.set('exp', exp);
        const vos = V.vos * 1e-3;
        ro.set('drift', !integ ? '—' : V.leak ? 'settles at V_os(1 + R_f/R) = ' + kit.eng(vos * (1 + V.rf / R), 'V') : vos ? kit.eng(vos / RC, 'V') + '/s towards a limit' : 'none (V_os = 0)');
        ro.set('range', '…'); ro.set('state', '…');
        vdIn = vdivFor(A + nz, 3.4);
        vdOut = vdivFor(Math.max(0.05, Math.min(LIM, peak || 0.2)), 3.4);
        ctl.show('vos', integ); ctl.show('leak', integ); ctl.show('rf', integ && V.leak);
        ctl.show('noise', !integ); ctl.show('tame', !integ);
        ctl.show('amp', V.wave !== 'none'); ctl.show('f', !still);
      }
      function endSweep() {
        if (!Number.isFinite(mm.hi)) return;
        ro.set('range', kit.eng(mm.lo, 'V') + ' … ' + kit.eng(mm.hi, 'V'));
        const sat = mm.hi > LIM - 0.05 || mm.lo < -LIM + 0.05;
        ro.set('state', sat ? 'at a limit (saturated)' : 'linear');
        vdOut = vdivFor(Math.max(0.05, Math.abs(mm.hi), Math.abs(mm.lo)), 3.4);
      }
      function frame() {
        for (let k = 0; k < spf; k++) {
          tick(c, dt);
          if (c.t - t0 > 10 * tdiv) { endSweep(); buf = []; t0 = c.t; resetMM(); }
          const vi = c.v('in'), vo = c.v('out');
          if (!Number.isFinite(vi) || !Number.isFinite(vo)) continue;
          buf.push([c.t - t0, vi, vo]);
          if (vo < mm.lo) mm.lo = vo; if (vo > mm.hi) mm.hi = vo;
        }
        draw();
      }
      function draw() {
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const fb = fitBox(420, 225, 0, 4, W, Hh * 0.38, 1.25);
        g.save(); g.translate(fb.ox, fb.oy); g.scale(fb.k, fb.k);
        const integ = V.mode === 'int', xo = 270, yo = 125, N = [190, 110];
        const a = S.opamp(g, xo, yo);
        terminal(S, g, C, 36, 110, 'V_in');
        if (integ) S.resistor(g, 40, 110, N[0], 110, { label: 'R', value: fr(V.r) });
        else if (V.tame) { S.resistor(g, 40, 110, 110, 110, { label: 'R_s', value: fr(V.r / 10) }); S.capacitor(g, 110, 110, N[0], 110, { label: 'C', value: fc(V.c) }); }
        else S.capacitor(g, 40, 110, N[0], 110, { label: 'C', value: fc(V.c) });
        S.wire(g, [N, a.inn]); S.node(g, N[0], N[1]);
        S.wire(g, [N, [N[0], 70]]);
        if (integ) S.capacitor(g, N[0], 70, 340, 70, { label: 'C', value: fc(V.c) });
        else S.resistor(g, N[0], 70, 340, 70, { label: 'R', value: fr(V.r) });
        S.wire(g, [[340, 70], [340, yo]]);
        const par = integ ? V.leak : V.tame;
        if (par) {
          S.wire(g, [[N[0], 70], [N[0], 30]]); S.wire(g, [[340, 70], [340, 30]]);
          S.node(g, N[0], 70); S.node(g, 340, 70);
          if (integ) S.resistor(g, N[0], 30, 340, 30, { label: 'R_f', value: fr(V.rf) });
          else S.capacitor(g, N[0], 30, 340, 30, { label: 'C_f', value: fc(V.c / 10) });
        }
        S.wire(g, [a.out, [385, yo]]); S.node(g, 340, yo);
        terminal(S, g, C, 389, yo, 'V_out', true);
        // + input: through the offset source (a model of the op-amp's own offset) to ground
        if (integ && V.vos) {
          S.wire(g, [a.inp, [216, 140], [216, 150]]);
          S.battery(g, 216, 150, 216, 185, { label: 'V_os', value: V.vos.toFixed(1) + ' mV' });
          S.ground(g, 216, 185);
        } else { S.wire(g, [a.inp, [216, 140], [216, 165]]); S.ground(g, 216, 165); }
        g.restore();
        const sc = { x: 12, y: fb.oy + 225 * fb.k + 8, w: W - 24, h: 0 };
        sc.h = Math.max(100, Hh - sc.y - 26);
        S.scope(g, sc.x, sc.y, sc.w, sc.h, {
          tdiv, divy: 8,
          traces: [
            { pts: buf.map(p => [p[0], p[1]]), vdiv: vdIn, label: 'IN' },
            { pts: buf.map(p => [p[0], p[2]]), vdiv: vdOut, label: 'OUT' }
          ]
        });
        scopeLevel(kit, g, sc, LIM, vdOut, 0, '#ff8a80', 'limit +13.5 V');
        scopeLevel(kit, g, sc, -LIM, vdOut, 0, '#ff8a80', 'limit −13.5 V');
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 5. instrumentation amplifier */
  Hyper.sim('oa-inamp', {
    title: 'Instrumentation amplifier on a bridge',
    blurb: `A 350 Ω load-cell bridge (2 mV/V at 5 V excitation, so 10 mV at full load) sits on 2.5 V of common-mode voltage plus 50 Hz hum picked up by its cable. Two amplifiers read identical copies of it: a **difference amplifier** built from four resistors, one of them off by the mismatch you set, and a **three-op-amp instrumentation amplifier** (INA128-style, $G = 1 + 50\\,\\text{k}\\Omega/R_G$, trimmed resistors).

The scope shows the common-mode voltage (yellow) and both outputs **centred on the ideal value** $G V_d$, so what you see is each amplifier's error.

- Hum on the difference amplifier's output grows with the mismatch; the INA barely notices it.
- Set the mismatch to zero: the difference amplifier still reads low: its 10 kΩ input resistors load the bridge (175 Ω source resistance), a gain error of about 1.7 %.
- Compare the CMRR figures as you change the gain.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 400, maxH: 660 });
      const S = kit.schem;
      const VEX = 5, OA = { vpos: 13.5, vneg: -13.5, gain: 1e6 };
      const ctl = kit.controls(box.side, [
        { id: 'load', label: 'Load on the cell', min: 0, max: 100, step: 1, value: params.load != null ? params.load : 50, unit: '%' },
        { id: 'hum', label: 'Hum, common-mode (50 Hz peak)', min: 0, max: 2, step: 0.05, value: params.hum != null ? params.hum : 1, unit: 'V' },
        { id: 'g', type: 'select', label: 'Gain of both amplifiers', options: [['10', 10], ['100', 100], ['1000', 1000]], value: params.g || 100 },
        { id: 'mis', label: 'Resistor mismatch (difference amp)', min: 0, max: 2, step: 0.05, value: params.mis != null ? params.mis : 1, unit: '%' }
      ], () => rebuild());
      const ro = kit.readout(box.side, [['vd', 'True bridge output V_d'], ['ideal', 'Ideal output G·V_d'], ['dErr', 'Difference amp: DC error (at input)'], ['dHum', 'Difference amp: hum (at input, p-p)'], ['dCm', 'Difference amp: CMRR'], ['iErr', 'INA: DC error (at input)'], ['iHum', 'INA: hum (at input, p-p)'], ['iCm', 'INA: CMRR']]);
      const V = ctl.values;
      let c, buf = [], t0 = 0, vd = 0, G = 100, mm = null, vdD = 0.01, vdI = 0.01;
      const dt = 1e-4, tdiv = 4e-3, spf = 8;
      const resetMM = () => { mm = { dLo: Infinity, dHi: -Infinity, iLo: Infinity, iHi: -Infinity }; };

      function bridge(cc, s, x) {
        cc.R('ex', 'A' + s, 350); cc.R('A' + s, 'cm', 350 * (1 + x));       // the gauge: A rises with load
        cc.R('ex', 'B' + s, 350); cc.R('B' + s, 'cm', 350);
      }
      function build(hum) {
        const cc = new kit.Circuit();
        const x = 0.008 * V.load / 100, m = V.mis / 100;
        cc.V('cm', 'gnd', hum);
        cc.V('ex', 'cm', VEX);
        // copy 1 of the bridge: a difference amplifier, R₁ = R₃ = 10 kΩ, R₂ = R₄ = G·10 kΩ
        bridge(cc, '1', x);
        cc.R('B1', 'n4', 10e3); cc.R('n4', 'oD', G * 10e3);
        cc.R('A1', 'p4', 10e3); cc.R('p4', 'gnd', G * 10e3 * (1 + m));
        cc.OPAMP('p4', 'n4', 'oD', OA);
        // copy 2: three-op-amp instrumentation amplifier, 25 kΩ first stage, 40 kΩ trimmed difference stage
        bridge(cc, '2', x);
        cc.OPAMP('A2', 'g1', 'o1', OA); cc.R('o1', 'g1', 25e3);
        cc.OPAMP('B2', 'g2', 'o2', OA); cc.R('o2', 'g2', 25e3);
        cc.R('g1', 'g2', 50e3 / (G - 1));
        cc.R('o2', 'n3', 40e3); cc.R('n3', 'oI', 40e3);
        cc.R('o1', 'p3', 40e3); cc.R('p3', 'gnd', 40e3 * (1 + 1e-4));
        cc.OPAMP('p3', 'n3', 'oI', OA);
        return cc;
      }
      const cmrr = acm => (acm > 1e-12 ? kit.fmt(20 * Math.log10(G / acm), 3) + ' dB' : 'over 200 dB');
      function rebuild() {
        G = V.g;
        const x = 0.008 * V.load / 100;
        vd = VEX * ((1 + x) / (2 + x) - 0.5);
        // DC: with no hum and with 1 V of extra common-mode, for the errors and the CMRR
        const c0 = build(0); c0.dc();
        const c1 = build(1); c1.dc();
        const d0 = c0.v('oD'), i0 = c0.v('oI');
        const acmD = Math.abs(c1.v('oD') - d0), acmI = Math.abs(c1.v('oI') - i0);
        ro.set('vd', kit.eng(vd, 'V'));
        ro.set('ideal', kit.eng(G * vd, 'V'));
        ro.set('dErr', kit.eng(d0 / G - vd, 'V'));
        ro.set('iErr', kit.eng(i0 / G - vd, 'V'));
        ro.set('dCm', cmrr(acmD)); ro.set('iCm', cmrr(acmI));
        ro.set('dHum', '…'); ro.set('iHum', '…');
        const hum = V.hum;
        c = build(t => hum * Math.sin(TAU * 50 * t));
        c.reset();
        buf = []; t0 = 0; resetMM();
        vdD = vdivFor(Math.max(1e-3, Math.abs(d0 - G * vd) + acmD * hum), 3.4);
        vdI = vdivFor(Math.max(1e-3, Math.abs(i0 - G * vd) + acmI * hum), 3.4);
      }
      function endSweep() {
        if (!Number.isFinite(mm.dHi)) return;
        ro.set('dHum', kit.eng((mm.dHi - mm.dLo) / G, 'V'));
        ro.set('iHum', kit.eng((mm.iHi - mm.iLo) / G, 'V'));
        const ideal = G * vd;
        vdD = vdivFor(Math.max(1e-3, Math.abs(mm.dHi - ideal), Math.abs(mm.dLo - ideal)), 3.4);
        vdI = vdivFor(Math.max(1e-3, Math.abs(mm.iHi - ideal), Math.abs(mm.iLo - ideal)), 3.4);
      }
      function frame() {
        for (let k = 0; k < spf; k++) {
          tick(c, dt);
          if (c.t - t0 > 10 * tdiv) { endSweep(); buf = []; t0 = c.t; resetMM(); }
          const cmv = (c.v('A2') + c.v('B2')) / 2, od = c.v('oD'), oi = c.v('oI');
          if (![cmv, od, oi].every(Number.isFinite)) continue;
          buf.push([c.t - t0, cmv, od, oi]);
          if (od < mm.dLo) mm.dLo = od; if (od > mm.dHi) mm.dHi = od;
          if (oi < mm.iLo) mm.iLo = oi; if (oi > mm.iHi) mm.iHi = oi;
        }
        draw();
      }
      function draw() {
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const fb = fitBox(470, 215, 0, 6, W, Hh * 0.38, 1.3);
        g.save(); g.translate(fb.ox, fb.oy); g.scale(fb.k, fb.k);
        // the bridge, excitation left to right; outputs at the top (A) and bottom (B)
        const LX = [50, 110], RX = [150, 110], TA = [100, 40], BB = [100, 180];
        S.resistor(g, LX[0], LX[1], TA[0], TA[1], {});
        S.resistor(g, TA[0], TA[1], RX[0], RX[1], { label: 'gauge', color: C.warn, labelColor: C.warn });
        S.resistor(g, LX[0], LX[1], BB[0], BB[1], {});
        S.resistor(g, BB[0], BB[1], RX[0], RX[1], {});
        terminal(S, g, C, 36, 110, '5 V');
        S.wire(g, [[40, 110], LX]);
        S.node(g, LX[0], LX[1]); S.node(g, RX[0], RX[1]);
        S.wire(g, [RX, [180, 110]]);
        S.vsource(g, 180, 110, 180, 150, { ac: true });
        S.text(g, 'hum', 200, 130, { size: 10.5, align: 'left', color: C.muted });
        S.ground(g, 180, 150);
        S.node(g, TA[0], TA[1]); S.node(g, BB[0], BB[1]);
        S.text(g, 'A', TA[0], TA[1] - 12, { size: 11 }); S.text(g, 'B', BB[0], BB[1] + 14, { size: 11 });
        // A runs along the top and down x = 240; B along the bottom and up x = 260
        S.wire(g, [TA, [240, 40], [240, 142]]);
        S.wire(g, [BB, [260, 180], [260, 92]]);
        // difference amplifier (top) and INA (bottom), + input on top
        let a = S.opamp(g, 350, 77, { flip: true, label: 'diff' });
        S.wire(g, [[240, 62], a.inp]); S.node(g, 240, 62);
        S.wire(g, [[260, 92], a.inn]);
        S.wire(g, [a.out, [420, 77]]); terminal(S, g, C, 424, 77, 'diff', true);
        S.text(g, '4 resistors, ' + kit.fmt(V.mis, 2) + ' % mismatch', 350, 36, { size: 10, weight: 500, color: C.muted });
        a = S.opamp(g, 350, 157, { flip: true, label: 'INA' });
        S.wire(g, [[240, 142], a.inp]);
        S.wire(g, [[260, 172], a.inn]); S.node(g, 260, 172);
        S.wire(g, [a.out, [420, 157]]); terminal(S, g, C, 424, 157, 'INA', true);
        S.text(g, 'R_G = ' + kit.eng(50e3 / (G - 1), 'Ω') + '  (G = ' + G + ')', 350, 200, { size: 10, weight: 500, color: C.muted });
        g.restore();
        const sc = { x: 12, y: fb.oy + 215 * fb.k + 10, w: W - 24, h: 0 };
        sc.h = Math.max(110, Hh - sc.y - 26);
        const ideal = G * vd;
        S.scope(g, sc.x, sc.y, sc.w, sc.h, {
          tdiv, divy: 8,
          traces: [
            { pts: buf.map(p => [p[0], p[1]]), vdiv: 1, offset: -2.5, label: 'CM' },
            { pts: buf.map(p => [p[0], p[2]]), vdiv: vdD, offset: -ideal / vdD, label: 'DIFF' },
            { pts: buf.map(p => [p[0], p[3]]), vdiv: vdI, offset: -ideal / vdI, label: 'INA' }
          ]
        });
        kit.label(g, 'outputs centred on G·V_d = ' + kit.eng(ideal, 'V'), sc.x + 8, sc.y + 12, { size: 10.5, color: '#cfe8d8' });
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 6. transimpedance amplifier */
  Hyper.sim('oa-tia', {
    title: 'Photodiode transimpedance amplifier',
    blurb: `Light pulses on a photodiode give a current $I_\\text{ph}$; the op-amp turns it into $V_\\text{out} = I_\\text{ph} R_f$ while holding the diode at 0 V. The pulse is scaled so the ideal output step is 1 V (yellow); the real output is cyan. Below, the transimpedance against frequency, from the simulator's AC analysis.

- With **no feedback capacitor** the diode's capacitance and the op-amp's gain–bandwidth make the loop ring: overshoot on the scope, a peak in the frequency response.
- Add $C_f$ until the ringing stops; *recommended* sets $C_f = \\sqrt{C_j/(\\pi R_f\\,\\text{GBW})}$ for a flat response.
- Too much $C_f$ is slow: the edges become exponential with $\\tau = R_f C_f$.
- A faster op-amp or a smaller diode (less $C_j$) buys bandwidth.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 360, maxH: 580 });
      const S = kit.schem;
      const fr = v => kit.eng(v, 'Ω'), fcap = v => kit.eng(v, 'F');
      const ctl = kit.controls(box.side, [
        { id: 'part', type: 'select', label: 'Op-amp', options: [['MCP6002 (1 MHz)', 'mcp6002'], ['OPA2134 (8 MHz)', 'opa2134'], ['OPA380 (90 MHz)', 'opa380']], value: params.part || 'opa2134' },
        { id: 'rf', label: 'R_f', min: 10e3, max: 10e6, value: params.rf || 100e3, log: true, sig: 2, fmt: fr },
        { id: 'cj', label: 'Photodiode capacitance C_j', min: 1e-12, max: 200e-12, value: params.cj || 20e-12, log: true, sig: 2, fmt: fcap },
        { id: 'auto', type: 'check', label: 'Use the recommended C_f', value: !!params.auto },
        { id: 'cf', label: 'Feedback capacitor C_f', min: 0, max: 20e-12, step: 0.1e-12, value: params.cf || 0, fmt: v => (v > 0 ? fcap(v) : 'none') }
      ], () => rebuild());
      const ro = kit.readout(box.side, [['iph', 'Photocurrent (1 V step)'], ['fz', 'Noise-gain zero 1/(2πR_f C_j)'], ['cfr', 'Recommended C_f'], ['cf', 'C_f in use'], ['f3p', 'Bandwidth, flat design'], ['f3', 'Measured −3 dB'], ['pk', 'Peaking'], ['os', 'Overshoot on the scope']]);
      const pbox = document.createElement('div');
      pbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(pbox);
      const plot = kit.plot(pbox, { x: { label: 'frequency (Hz)', log: true }, y: { label: '|V_out / I_ph| (Ω)', log: true } }, 210);
      const V = ctl.values;
      let c, dt, tdiv, spf, buf = [], t0 = 0, cf = 0, i0 = 1e-5, part = PARTS.opa2134, peakOut = 0;

      function acCircuit(cfv) {
        const cc = new kit.Circuit();
        cc.I('n', 'gnd', 0, { ac: 1 });
        cc.C('n', 'gnd', V.cj);
        cc.R('n', 'out', V.rf);
        if (cfv > 0) cc.C('n', 'out', cfv);
        cc.OPAMP('gnd', 'n', 'out', { gain: part.a0, gbw: part.gbw });
        cc.dc();
        return cc;
      }
      function sweep(cfv, fmin, fmax) {
        const cc = acCircuit(cfv), pts = [];
        for (let k = 0; k <= 160; k++) {
          const f = fmin * Math.pow(fmax / fmin, k / 160);
          pts.push([f, Math.max(1e-3, cc.ac(f).v('out').mag)]);
        }
        return pts;
      }
      function rebuild() {
        part = PARTS[V.part] || PARTS.opa2134;
        const Rf = V.rf, Cj = V.cj;
        const fz = 1 / (TAU * Rf * Cj), f3p = Math.sqrt(part.gbw * fz);
        const cfr = Math.sqrt(Cj / (Math.PI * Rf * part.gbw));
        cf = V.auto ? cfr : V.cf;
        ctl.show('cf', !V.auto);
        i0 = 1 / Rf;
        // transient: a light pulse, on for the first half of the screen
        c = new kit.Circuit();
        const tau = Math.max(1 / (TAU * f3p), Rf * cf);
        tdiv = Hyper.niceStep(40 * tau, 10);
        const T = 10 * tdiv;
        dt = T / 2000;
        spf = Math.max(1, Math.round(2000 / 90));
        c.I('n', 'gnd', t => (frac(t / T) < 0.5 ? i0 : 0));
        c.C('n', 'gnd', Cj, 0);
        c.R('n', 'out', Rf);
        if (cf > 0) c.C('n', 'out', cf, 0);
        dynOpamp(c, 'gnd', 'n', 'out', part);
        c.reset();
        buf = []; t0 = 0; peakOut = 0;
        // frequency response
        const fmin = Math.pow(10, Math.floor(Math.log10(f3p / 300))), fmax = fmin * 1e6;
        const pts = sweep(cf, fmin, fmax);
        let pk = 0, f3 = null;
        for (const p of pts) pk = Math.max(pk, p[1]);
        for (let k = 1; k < pts.length; k++) {
          if (pts[k][1] < Rf / Math.SQRT2 && pts[k - 1][1] >= Rf / Math.SQRT2) {
            const a = Math.log(pts[k - 1][1]), b = Math.log(pts[k][1]), u = (Math.log(Rf / Math.SQRT2) - a) / (b - a);
            f3 = pts[k - 1][0] * Math.pow(pts[k][0] / pts[k - 1][0], u);
            break;
          }
        }
        const series = [{ pts, label: cf > 0 ? 'with C_f' : 'no C_f' }];
        if (cf > 0) series.push({ pts: sweep(0, fmin, fmax), label: 'no C_f', dash: [5, 4] });
        plot.set({
          x: { label: 'frequency (Hz)', log: true, min: fmin, max: fmax },
          y: { label: '|V_out / I_ph| (Ω)', log: true, min: Rf / 300, max: Rf * 30 },
          series,
          hlines: [{ y: Rf, label: 'R_f' }],
          vlines: [{ x: fz, label: 'f_z' }, { x: f3p, label: 'flat design' }].filter(v => v.x > fmin && v.x < fmax),
          marks: f3 ? [{ x: f3, y: Rf / Math.SQRT2, label: '−3 dB' }] : []
        });
        ro.set('iph', kit.eng(i0, 'A'));
        ro.set('fz', kit.eng(fz, 'Hz'));
        ro.set('cfr', fcap(cfr));
        ro.set('cf', cf > 0 ? fcap(cf) : 'none');
        ro.set('f3p', kit.eng(f3p, 'Hz'));
        ro.set('f3', f3 ? kit.eng(f3, 'Hz') : 'beyond the plot');
        const pkdB = 20 * Math.log10(Math.max(pk, 1e-12) / Rf);
        ro.set('pk', (Math.abs(pkdB) < 0.05 ? '0.0' : pkdB.toFixed(1)) + ' dB');
        ro.set('os', '…');
      }
      function frame() {
        for (let k = 0; k < spf; k++) {
          tick(c, dt);
          if (c.t - t0 > 10 * tdiv) {
            ro.set('os', kit.fmt(Math.max(0, (peakOut - 1) * 100), 3) + ' %');
            buf = []; t0 = c.t; peakOut = 0;
          }
          const vo = c.v('out'), vi = frac(c.t / (10 * tdiv)) < 0.5 ? 1 : 0;
          if (!Number.isFinite(vo)) continue;
          buf.push([c.t - t0, vi, vo]);
          if (vo > peakOut) peakOut = vo;
        }
        draw();
      }
      function draw() {
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const fb = fitBox(420, 210, 0, 4, W, Hh * 0.42, 1.25);
        g.save(); g.translate(fb.ox, fb.oy); g.scale(fb.k, fb.k);
        const xo = 270, yo = 135, N = [190, 120];
        const a = S.opamp(g, xo, yo);
        // photodiode (anode to ground, cathode to the summing node) and its capacitance
        S.diode(g, 150, 195, 150, 150, { kind: 'photo' });
        S.wire(g, [[150, 150], [150, 120], N]);
        S.capacitor(g, 80, 150, 80, 195, { label: 'C_j', value: fcap(V.cj), color: C.muted, labelColor: C.muted });
        S.wire(g, [[80, 150], [80, 120], [150, 120]]); S.node(g, 150, 120);
        S.wire(g, [[80, 195], [150, 195]]); S.ground(g, 115, 195);
        kit.label(g, 'light', 162, 178, { size: 10.5, color: C.warn });
        S.wire(g, [N, a.inn]); S.node(g, N[0], N[1]);
        S.wire(g, [a.inp, [216, 150], [216, 170]]); S.ground(g, 216, 170);
        S.wire(g, [N, [N[0], 80]]);
        S.resistor(g, N[0], 80, 340, 80, { label: 'R_f', value: fr(V.rf) });
        S.wire(g, [[340, 80], [340, yo]]);
        S.wire(g, [[N[0], 80], [N[0], 42]]); S.wire(g, [[340, 80], [340, 42]]);
        S.node(g, N[0], 80); S.node(g, 340, 80);
        S.capacitor(g, N[0], 42, 340, 42, { label: 'C_f', value: cf > 0 ? fcap(cf) : 'none', color: cf > 0 ? C.text : C.faint });
        S.wire(g, [a.out, [385, yo]]); S.node(g, 340, yo);
        terminal(S, g, C, 389, yo, 'V_out', true);
        S.text(g, part.name, xo - 2, yo + 44, { size: 10.5, weight: 500, color: C.muted });
        g.restore();
        const sc = { x: 12, y: fb.oy + 210 * fb.k + 8, w: W - 24, h: 0 };
        sc.h = Math.max(100, Hh - sc.y - 26);
        S.scope(g, sc.x, sc.y, sc.w, sc.h, {
          tdiv, divy: 8,
          traces: [
            { pts: buf.map(p => [p[0], p[1]]), vdiv: 0.5, offset: -1.5, label: 'I_ph × R_f' },
            { pts: buf.map(p => [p[0], p[2]]), vdiv: 0.5, offset: -1.5, label: 'OUT' }
          ]
        });
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 7. gain–bandwidth */
  Hyper.sim('oa-gbw', {
    title: 'Gain–bandwidth: closed loop against open loop',
    blurb: `The simulator's AC analysis of a real op-amp model (DC gain and gain–bandwidth product from the data sheet). The dashed curve is the op-amp's own open-loop gain, measured as $V_\\text{out}/(V_+ - V_-)$; the solid curve is the amplifier's closed-loop gain.

- The closed-loop curve is flat until it meets the open-loop curve, then follows it down: bandwidth $\\approx \\text{GBW}/G$.
- Tick the family: gains of 1, 10, 100 and 1000 each end on the same sloping line.
- Switch to **inverting**: at the same $|G|$ the bandwidth is lower, because it is set by the *noise gain* $1 + R_f/R_1$. Compare $G = -1$ with a follower.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 200, maxH: 280 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'part', type: 'select', label: 'Op-amp', options: [['LM358 (1 MHz)', 'lm358'], ['TL072 (3 MHz)', 'tl072'], ['OPA2134 (8 MHz)', 'opa2134'], ['NE5532 (10 MHz)', 'ne5532']], value: params.part || 'tl072' },
        { id: 'cfg', type: 'select', label: 'Configuration', options: [['Non-inverting', 'noninv'], ['Inverting', 'inv']], value: params.cfg || 'noninv' },
        { id: 'g', label: 'Gain magnitude |G|', min: 1, max: 1000, value: params.g || 10, log: true, sig: 2 },
        { id: 'fam', type: 'check', label: 'Show gains 1, 10, 100, 1000', value: params.fam != null ? !!params.fam : true }
      ], () => update());
      const ro = kit.readout(box.side, [['gbw', 'Gain–bandwidth product'], ['a0', 'DC open-loop gain'], ['ng', 'Noise gain 1/β'], ['pred', 'Predicted bandwidth GBW/(1/β)'], ['meas', 'Measured −3 dB'], ['e1', 'Gain error at 1 kHz'], ['e10', 'Gain error at 10 kHz'], ['tr', 'Rise time 0.35/f₋₃dB']]);
      const pbox = document.createElement('div');
      pbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(pbox);
      const plot = kit.plot(pbox, { x: { label: 'frequency (Hz)', log: true }, y: { label: 'gain (dB)' } }, 300);
      const V = ctl.values;
      const FMIN = 1, FMAX = 1e8, NPT = 200;
      let part = PARTS.tl072;

      function curve(G, inverting) {
        const c = new kit.Circuit();
        c.V('in', 'gnd', 0, { ac: 1 });
        const oa = { gain: part.a0, gbw: part.gbw, vpos: 13.5, vneg: -13.5 };
        let pn;
        if (inverting) { c.R('in', 'n', 1e3); c.R('n', 'out', G * 1e3); c.OPAMP('gnd', 'n', 'out', oa); pn = ['gnd', 'n']; }
        else if (G < 1.0001) { c.OPAMP('in', 'out', 'out', oa); pn = ['in', 'out']; }
        else { c.R('n', 'gnd', 1e3); c.R('n', 'out', (G - 1) * 1e3); c.OPAMP('in', 'n', 'out', oa); pn = ['in', 'n']; }
        c.dc();
        const cl = [], ol = [];
        for (let k = 0; k <= NPT; k++) {
          const f = FMIN * Math.pow(FMAX / FMIN, k / NPT);
          const h = c.ac(f), vo = h.v('out'), vp = h.v(pn[0]), vn = h.v(pn[1]);
          cl.push([f, 20 * Math.log10(Math.max(vo.mag, 1e-9))]);
          const dm = Math.hypot(vp.re - vn.re, vp.im - vn.im);
          if (dm > 0 && vo.mag > 0) ol.push([f, 20 * Math.log10(vo.mag / dm)]);
        }
        return { c, cl, ol };
      }
      function gainAt(c, f) { return c.ac(f).v('out').mag; }
      function update() {
        part = PARTS[V.part] || PARTS.tl072;
        const G = V.g, inv = V.cfg === 'inv';
        const ng = inv ? 1 + G : G;
        const main = curve(G, inv);
        const series = [];
        if (V.fam) for (const gf of [1, 10, 100, 1000]) series.push({ pts: curve(gf, inv).cl, width: 1, color: 'rgba(150,160,190,0.55)', label: '' + (inv ? -gf : gf) });
        series.push({ pts: main.ol, dash: [6, 4], label: 'open loop A' });
        series.push({ pts: main.cl, width: 2.5, label: 'closed loop' });
        // the measured −3 dB point
        const dc = main.cl[0][1];
        let f3 = null;
        for (let k = 1; k < main.cl.length; k++) {
          if (main.cl[k][1] < dc - 3 && main.cl[k - 1][1] >= dc - 3) {
            const a = main.cl[k - 1], b = main.cl[k], u = (dc - 3 - a[1]) / (b[1] - a[1]);
            f3 = a[0] * Math.pow(b[0] / a[0], u);
            break;
          }
        }
        const pred = part.gbw / ng;
        plot.set({
          x: { label: 'frequency (Hz)', log: true, min: FMIN, max: FMAX },
          y: { label: 'gain (dB)', min: -20, max: Math.max(110, 20 * Math.log10(part.a0) + 10) },
          series,
          vlines: [{ x: pred, label: 'GBW/(1/β)' }],
          marks: f3 ? [{ x: f3, y: dc - 3, label: '−3 dB' }] : []
        });
        const e = f => { const m = gainAt(main.c, f); return kit.fmt((m / G - 1) * 100, 3) + ' %'; };
        ro.set('gbw', kit.eng(part.gbw, 'Hz'));
        ro.set('a0', kit.fmt(part.a0, 3) + ' = ' + kit.fmt(20 * Math.log10(part.a0), 3) + ' dB');
        ro.set('ng', kit.fmt(ng, 3));
        ro.set('pred', kit.eng(pred, 'Hz'));
        ro.set('meas', f3 ? kit.eng(f3, 'Hz') : '—');
        ro.set('e1', e(1e3)); ro.set('e10', e(1e4));
        ro.set('tr', f3 ? kit.eng(0.35 / f3, 's') : '—');
        loop.once();
      }
      function draw() {
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const cfg = V.cfg === 'inv' ? 'inv' : V.g < 1.0001 ? 'follower' : 'noninv';
        const fb = fitBox(400, 200, 0, 4, W, Hh - 8, 1.2);
        g.save(); g.translate(fb.ox, fb.oy); g.scale(fb.k, fb.k);
        drawAmp(S, g, C, kit, cfg, { r1: '1 kΩ', rf: kit.eng((V.cfg === 'inv' ? V.g : V.g - 1) * 1e3, 'Ω'), part: '' });
        g.restore();
        kit.label(g, part.name + ',  G = ' + (V.cfg === 'inv' ? '−' : '') + kit.fmt(V.g, 3), 12, 16, { size: 12.5, color: C.accent, weight: 600 });
      }
      const loop = kit.loop(() => draw(), box.stage);
      update();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 8. slew rate */
  Hyper.sim('oa-slew', {
    title: 'Slew rate: when a sine turns into a triangle',
    blurb: `A voltage follower driven by a large signal. The op-amp model has the part's gain–bandwidth product **and** its slew rate, the fastest its output can move. Input yellow, output cyan.

- LM358, 10 V peak: fine at 1 kHz, a triangle by 20 kHz. The read-out compares the slope the sine needs, $2\\pi f V_p$, with the slew rate.
- Halve the amplitude: the full-power bandwidth doubles — slewing is a *large-signal* limit.
- Switch to a square wave: the output ramps at exactly the slew rate. That is how data sheets measure it.
- Try the TL072 or OPA2134: tens of volts per microsecond move the limit to hundreds of kilohertz.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 360, maxH: 600 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'part', type: 'select', label: 'Op-amp', options: [['LM358 (0.3 V/µs)', 'lm358'], ['µA741 (0.5 V/µs)', 'ua741'], ['NE5532 (9 V/µs)', 'ne5532'], ['TL072 (13 V/µs)', 'tl072'], ['OPA2134 (20 V/µs)', 'opa2134']], value: params.part || 'lm358' },
        { id: 'wave', type: 'select', label: 'Input', options: [['Sine', 'sine'], ['Square', 'square']], value: params.wave || 'sine' },
        { id: 'amp', label: 'Amplitude (peak)', min: 0.1, max: 10, value: params.amp || 10, log: true, sig: 2, fmt: v => kit.eng(v, 'V') },
        { id: 'f', label: 'Frequency', min: 100, max: 1e6, value: params.f || 10e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Hz') }
      ], () => rebuild());
      const ro = kit.readout(box.side, [['sr', 'Slew rate'], ['need', 'Slope the sine needs, 2πfV_p'], ['fpbw', 'Full-power bandwidth SR/(2πV_p)'], ['bw', 'Small-signal bandwidth (GBW)'], ['out', 'Output amplitude'], ['slope', 'Steepest output slope'], ['state', 'State']]);
      const V = ctl.values;
      let c, dt, tdiv, spf, buf = [], t0 = 0, part = PARTS.lm358, mm = null, vd = 1;
      const resetMM = () => { mm = { lo: Infinity, hi: -Infinity, s: 0, prev: null }; };

      function rebuild() {
        part = PARTS[V.part] || PARTS.lm358;
        const A = V.amp, f = V.f, w = WAVES[V.wave] || WAVES.sine;
        c = new kit.Circuit();
        c.V('in', 'gnd', t => A * w(f * t));
        dynOpamp(c, 'in', 'out', 'out', part);
        c.reset();
        const T = 1 / f;
        dt = T / 400;
        tdiv = Hyper.niceStep(2 * T, 10);
        spf = Math.max(1, Math.round(10 * tdiv / dt / 90));
        buf = []; t0 = 0; resetMM();
        vd = vdivFor(A, 3.4);
        const need = TAU * f * A;
        ro.set('sr', kit.eng(part.sr / 1e6, 'V') + '/µs');
        ro.set('need', V.wave === 'sine' ? kit.eng(need / 1e6, 'V') + '/µs' : 'a step: far more');
        ro.set('fpbw', kit.eng(part.sr / (TAU * A), 'Hz'));
        ro.set('bw', kit.eng(part.gbw, 'Hz'));
        ro.set('out', '…'); ro.set('slope', '…'); ro.set('state', '…');
      }
      function endSweep() {
        if (!Number.isFinite(mm.hi)) return;
        const amp = (mm.hi - mm.lo) / 2;
        ro.set('out', kit.eng(amp, 'V') + ' peak (input ' + kit.eng(V.amp, 'V') + ')');
        ro.set('slope', kit.eng(mm.s / 1e6, 'V') + '/µs');
        const limited = mm.s > 0.9 * part.sr;
        ro.set('state', limited ? 'slew-rate limited' : 'following the input');
      }
      function frame() {
        for (let k = 0; k < spf; k++) {
          tick(c, dt);
          if (c.t - t0 > 10 * tdiv) { endSweep(); buf = []; t0 = c.t; resetMM(); }
          const vi = c.v('in'), vo = c.v('out');
          if (!Number.isFinite(vi) || !Number.isFinite(vo)) continue;
          buf.push([c.t - t0, vi, vo]);
          if (vo < mm.lo) mm.lo = vo; if (vo > mm.hi) mm.hi = vo;
          if (mm.prev !== null) mm.s = Math.max(mm.s, Math.abs(vo - mm.prev) / dt);
          mm.prev = vo;
        }
        draw();
      }
      function draw() {
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const fb = fitBox(400, 140, 0, 2, W, Hh * 0.3, 1.2);
        g.save(); g.translate(fb.ox, fb.oy - 10); g.scale(fb.k, fb.k);
        drawAmp(S, g, C, kit, 'follower', { part: '' });
        S.text(g, part.name, 238, 32, { size: 11, weight: 500, color: C.muted });
        g.restore();
        const sc = { x: 12, y: fb.oy + 140 * fb.k + 6, w: W - 24, h: 0 };
        sc.h = Math.max(110, Hh - sc.y - 26);
        S.scope(g, sc.x, sc.y, sc.w, sc.h, {
          tdiv, divy: 8,
          traces: [
            { pts: buf.map(p => [p[0], p[1]]), vdiv: vd, label: 'IN' },
            { pts: buf.map(p => [p[0], p[2]]), vdiv: vd, label: 'OUT' }
          ]
        });
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
