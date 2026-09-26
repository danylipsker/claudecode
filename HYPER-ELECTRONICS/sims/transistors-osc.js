/* HYPER-ELECTRONICS · sims/transistors-osc.js — simulations for the Transistors branch
 * (BJT characteristics, the transistor switch, the common-emitter amplifier, the MOSFET
 * switch, the H-bridge) and for Oscillators and RF (the 555 astable, a Wien-bridge
 * oscillator starting from noise, reflections on a transmission line).
 * Every circuit is solved by kit.Circuit and drawn with kit.schem. */
(function () {
  'use strict';

  const TAU = 2 * Math.PI;
  const VT = 0.025852;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* the smallest 1-2-5 step at or above x (volts per division on a scope) */
  function step125(x) {
    if (!(x > 0) || !Number.isFinite(x)) return 1;
    const e = Math.pow(10, Math.floor(Math.log10(x)));
    const m = x / e;
    return (m <= 1.0001 ? 1 : m <= 2.0001 ? 2 : m <= 5.0001 ? 5 : 10) * e;
  }
  /* dot speed for S.flow: signed and log-compressed, so microamps and amperes both move */
  const flowSpeed = i => (Number.isFinite(i) ? Math.sign(i) * Math.min(140, 22 * Math.log10(1 + Math.abs(i) / 1e-6)) : 0);
  function dashed(c, pts, color, w, dash) {
    c.save();
    c.strokeStyle = color; c.lineWidth = w || 1.2; c.setLineDash(dash || [5, 4]);
    c.beginPath();
    pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
    c.stroke();
    c.restore();
  }
  /* deterministic pseudo-noise in [−1, 1] from an integer (same value on every Newton pass) */
  function hash(k) {
    const s = Math.sin(k * 12.9898 + 78.233) * 43758.5453;
    return 2 * (s - Math.floor(s)) - 1;
  }
  /* a small graph drawn on the stage: grid, frame and tick labels; returns the mapping */
  function axes(c, kit, r, xr, yr, o) {
    o = o || {};
    const C = kit.colors();
    const tr = (v, log) => (log ? Math.log10(Math.max(v, 1e-300)) : v);
    const lx0 = tr(xr[0], o.xlog), lx1 = tr(xr[1], o.xlog), ly0 = tr(yr[0], o.ylog), ly1 = tr(yr[1], o.ylog);
    const X = v => r.x + (tr(v, o.xlog) - lx0) / ((lx1 - lx0) || 1) * r.w;
    const Y = v => r.y + r.h - (tr(v, o.ylog) - ly0) / ((ly1 - ly0) || 1) * r.h;
    const ticks = (lo, hi, log, n) => {
      const out = [];
      if (!(hi > lo)) return out;
      if (log) { for (let e = Math.ceil(lo - 1e-9); e <= hi + 1e-9 && out.length < 20; e++) out.push(Math.pow(10, e)); }
      else {
        const s = Hyper.niceStep(hi - lo, n);
        for (let v = Math.ceil(lo / s - 1e-9) * s; v <= hi + s * 1e-9 && out.length < 30; v += s) out.push(Math.abs(v) < s * 1e-9 ? 0 : v);
      }
      return out;
    };
    const xt = ticks(lx0, lx1, o.xlog, o.nx || 6), yt = ticks(ly0, ly1, o.ylog, o.ny || 5);
    c.save();
    c.fillStyle = C.surface; c.fillRect(r.x, r.y, r.w, r.h);
    c.strokeStyle = C.grid; c.lineWidth = 1;
    c.beginPath();
    for (const v of xt) { const x = Math.round(X(v)) + 0.5; c.moveTo(x, r.y); c.lineTo(x, r.y + r.h); }
    for (const v of yt) { const y = Math.round(Y(v)) + 0.5; c.moveTo(r.x, y); c.lineTo(r.x + r.w, y); }
    c.stroke();
    c.strokeStyle = C.axis; c.strokeRect(r.x + 0.5, r.y + 0.5, r.w, r.h);
    c.restore();
    const fx = o.fx || (v => kit.fmt(v, 3)), fy = o.fy || (v => kit.fmt(v, 3));
    for (const v of xt) kit.label(c, fx(v), X(v), r.y + r.h + 11, { size: 10.5, color: C.muted, align: 'center' });
    for (const v of yt) kit.label(c, fy(v), r.x - 5, Y(v), { size: 10.5, color: C.muted, align: 'right' });
    if (o.xlabel) kit.label(c, o.xlabel, r.x + r.w, r.y + r.h + 26, { size: 11, color: C.muted, align: 'right' });
    if (o.ylabel) kit.label(c, o.ylabel, r.x + 4, r.y - 10, { size: 11, color: C.muted });
    return { X, Y };
  }

  /* ================================================================ BJT characteristics */
  Hyper.sim('tr-bjt-curves', {
    title: 'Transistor characteristics and the load line',
    blurb: `The curves are computed by the circuit simulator (an Ebers–Moll transistor): collector current against collector–emitter voltage, one curve per base current. The straight line is the load line of $R_C$ and $V_{CC}$; the transistor has to sit where its curve and the line cross — the Q-point.

- **Drag the Q-point** along the load line (or move the base-current slider). Near the bottom the transistor is cut off; in the middle it is active and $I_C = \\beta I_B$; at the top-left end it saturates and $I_C/I_B$ falls below β.
- Change $R_C$: the line pivots about $V_{CC}$. A larger resistor saturates at a smaller current.
- Watch the power $V_{CE}I_C$: largest in the middle of the line, small at both ends — which is why a switch runs cool. With a small $R_C$ the load line crosses the dashed 625 mW limit.
- The simulated transistor has no Early effect, so its curves are perfectly flat; real curves tilt up slightly.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'vcc', label: 'Supply V_CC', min: 3, max: 24, step: 0.5, value: 12, unit: 'V' },
        { id: 'rc', label: 'Collector resistor R_C', min: 100, max: 10e3, value: 1e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'ib', label: 'Base current I_B', min: 1e-7, max: 1e-2, value: 40e-6, log: true, sig: 2, fmt: v => kit.eng(v, 'A') },
        { id: 'beta', label: 'Current gain β', min: 50, max: 400, step: 10, value: 150 },
        { id: 'pmax', type: 'check', label: 'Show the 625 mW limit of a TO-92 part', value: true }
      ], id => { if (id !== 'ib' && id !== 'pmax') sweep(); solveQ(); loop.once(); });
      const ro = kit.readout(box.side, [['ic', 'Collector current I_C'], ['vce', 'Collector–emitter V_CE'], ['ratio', 'I_C / I_B'], ['p', 'Power V_CE · I_C'], ['reg', 'Region']]);
      const V = ctl.values;
      const PMAX = 0.625;
      let curves = [], q = { ic: 0, vce: 0, reg: 'cut-off' }, xmax = 13.8, ymax = 0.016, map = null, qpx = null, phC = 0, phB = 0;

      /* the family of curves: a base current source and a swept collector voltage */
      function sweep() {
        const c = new kit.Circuit();
        const Ib = c.I('gnd', 'b', 0);
        const Vc = c.V('c', 'gnd', 0);
        const Q = c.NPN('c', 'b', 'gnd', { beta: V.beta });
        const icEnd = V.vcc / V.rc;
        xmax = V.vcc * 1.15;
        ymax = icEnd * 1.35;
        const ibStep = Hyper.niceStep(icEnd / V.beta, 5);
        curves = [];
        for (let k = 1; k <= 6; k++) {
          Ib.iv = k * ibStep;
          const pts = [];
          for (let j = 0; j <= 70; j++) {
            Vc.v = j < 20 ? 0.6 * j / 20 : 0.6 + (xmax - 0.6) * (j - 20) / 50;
            c.dc();
            pts.push([Vc.v, Math.max(0, Q.ic)]);
          }
          curves.push({ ib: k * ibStep, pts });
        }
      }
      /* the operating point of the real circuit: V_CC, R_C and the base current */
      function solveQ() {
        const c = new kit.Circuit();
        c.V('vcc', 'gnd', V.vcc);
        const Rc = c.R('vcc', 'c', V.rc);
        c.I('gnd', 'b', V.ib);
        c.NPN('c', 'b', 'gnd', { beta: V.beta });
        c.dc();
        const icEnd = V.vcc / V.rc;
        q = { ic: Math.max(0, Rc.i), vce: Math.max(0, c.v('c')) };
        q.reg = q.ic < 0.01 * icEnd ? 'cut-off' : q.ic < 0.9 * V.beta * V.ib ? 'saturation' : 'active';
        ro.set('ic', kit.eng(q.ic, 'A'));
        ro.set('vce', kit.eng(q.vce, 'V'));
        ro.set('ratio', (q.ic / V.ib).toFixed(0) + (q.reg === 'saturation' ? '  (forced β, below β)' : ''));
        ro.set('p', kit.eng(q.ic * q.vce, 'W') + (q.ic * q.vce > PMAX ? '  — over the 625 mW rating!' : ''));
        ro.set('reg', q.reg);
      }
      function drawSchematic(c, C, w, Hh, dt) {
        const cx = Math.round(w * 0.66), top = Math.round(Hh * 0.15), bot = Math.round(Hh * 0.86), cy = Math.round(Hh * 0.55);
        const bx = Math.round(w * 0.2);
        S.rail(c, cx, top, '+' + kit.fmt(V.vcc, 3) + ' V');
        const pins = S.npn(c, cx - 8, cy, {});
        S.resistor(c, cx, top, cx, pins.c[1], { label: 'R_C', value: kit.eng(V.rc, 'Ω') });
        S.wire(c, [pins.e, [cx, bot]]);
        S.ground(c, cx, bot);
        S.isource(c, bx, bot, bx, cy + 6, { label: 'I_B', value: kit.eng(V.ib, 'A') });
        S.wire(c, [[bx, cy + 6], [bx, cy], pins.b]);
        S.ground(c, bx, bot);
        phC += dt * flowSpeed(q.ic); phB += dt * flowSpeed(V.ib);
        S.flow(c, [[cx, top], [cx, pins.c[1]], [cx - 6, cy], [cx, pins.e[1]], [cx, bot]], phC, { color: C.warn });
        S.flow(c, [[bx, bot], [bx, cy], pins.b, [cx - 6, cy]], phB, { color: C.warn, gap: 22 });
        kit.label(c, 'V_CE = ' + kit.eng(q.vce, 'V'), cx + 28, cy + 46, { size: 12, color: C.accent });
      }
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const wide = W >= 540;
        const gx = wide ? Math.round(W * 0.42) : 58, gy = 26, gw = W - gx - 14, gh = Hh - gy - 46;
        if (wide) drawSchematic(c, C, W * 0.42 - 20, Hh, dt || 0);
        map = axes(c, kit, { x: gx, y: gy, w: gw, h: gh }, [0, xmax], [0, ymax], { xlabel: 'V_CE (V)', ylabel: 'I_C', fy: v => kit.eng(v, 'A') });
        const X = map.X, Y = map.Y;
        c.save(); c.beginPath(); c.rect(gx, gy, gw, gh); c.clip();
        for (const cv of curves) {
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath();
          cv.pts.forEach((p, j) => (j ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))));
          c.stroke();
        }
        if (V.pmax) {
          const pts = [];
          for (let k = 1; k <= 90; k++) { const v = xmax * k / 90; pts.push([X(v), Y(Math.min(PMAX / v, ymax * 3))]); }
          dashed(c, pts, C.warn, 1.6);
        }
        c.strokeStyle = C.accent; c.lineWidth = 2.4;
        c.beginPath(); c.moveTo(X(V.vcc), Y(0)); c.lineTo(X(0), Y(V.vcc / V.rc)); c.stroke();
        c.restore();
        for (const cv of curves) {
          const last = cv.pts[cv.pts.length - 1];
          if (last[1] < ymax * 0.95 && last[1] > ymax * 0.04) kit.label(c, kit.eng(cv.ib, 'A'), gx + gw - 4, Y(last[1]) - 8, { size: 10.5, color: C.muted, align: 'right' });
        }
        kit.label(c, 'curves: base current I_B', gx + gw - 4, gy + 12, { size: 11, color: C.faint, align: 'right' });
        if (V.pmax && PMAX / (xmax * 0.9) < ymax * 0.92) kit.label(c, '625 mW', X(xmax * 0.9), Y(PMAX / (xmax * 0.9)) - 10, { size: 10.5, color: C.warn, align: 'center' });
        kit.label(c, 'load line', X(V.vcc * 0.62) + 8, Y(V.vcc * 0.38 / V.rc) - 6, { size: 11, color: C.accent });
        const qx = X(clamp(q.vce, 0, xmax)), qy = Y(clamp(q.ic, 0, ymax));
        qpx = [qx, qy];
        dashed(c, [[qx, qy], [qx, gy + gh]], C.faint, 1);
        dashed(c, [[gx, qy], [qx, qy]], C.faint, 1);
        const col = q.reg === 'active' ? C.ok : q.reg === 'saturation' ? C.bad : C.muted;
        kit.dot(c, qx, qy, 7.5, col, C.text);
        kit.label(c, 'Q · ' + q.reg, qx + 11, qy - 13, { size: 12, color: col, weight: 600 });
        kit.label(c, 'drag Q along the load line', gx + 8, gy + gh - 12, { size: 11, color: C.faint });
      }
      kit.drag(st, {
        hover: true,
        hit: p => (qpx && Math.hypot(p.x - qpx[0], p.y - qpx[1]) < 18 ? 'q' : null),
        move: (t, p) => {
          if (!map) return;
          // project the pointer onto the load line, in pixels
          const x0 = map.X(V.vcc), y0 = map.Y(0), x1 = map.X(0), y1 = map.Y(V.vcc / V.rc);
          const dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy || 1;
          const u = clamp(((p.x - x0) * dx + (p.y - y0) * dy) / L2, 0, 1);
          let ib = u * V.vcc / V.rc / V.beta;
          if (u > 0.985) ib *= 1.6;                     // pulled to the end: drive it into saturation
          ctl.set('ib', Number(clamp(ib, 1e-7, 1e-2).toPrecision(2)));
          solveQ();
          loop.once();
        }
      });
      sweep();
      solveQ();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ BJT (and Darlington) switch */
  Hyper.sim('tr-bjt-switch', {
    title: 'The transistor as a switch',
    blurb: `A logic pin switches a 12 V load through a transistor: on for 5 ms, off for 5 ms. The scope shows the pin (yellow) and the collector (blue); the read-outs give the on-state, all solved by the circuit simulator.

- Raise $R_B$ until the state reads **not saturated**: the collector no longer falls to a few tenths of a volt and the transistor heats up. With the 0.5 A lamp and a single transistor, even 820 Ω is too much — work out $R_B$ for a forced β of 10–20.
- Choose the **relay** and untick the flyback diode: at every turn-off the coil drives the collector far above the supply, until the transistor breaks down (modelled at 50 V). With the diode the spike is clamped near 12.7 V, and the coil current dies away more slowly.
- Choose the **TIP120 Darlington**: a milliamp of base current is plenty even for the lamp, but its collector never falls below about 0.7 V, so it dissipates more than a saturated single transistor.`,
    mount(box, kit, params) {
      const darl0 = !!(params && params.part === 'tip120');
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 430 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'part', type: 'select', label: 'Transistor', options: [['2N2222A (single, β ≈ 150)', 'single'], ['TIP120 (Darlington)', 'darl']], value: darl0 ? 'darl' : 'single' },
        { id: 'load', type: 'select', label: 'Load on the 12 V supply', options: [['LED + 470 Ω (≈ 20 mA)', 'led'], ['Relay coil, 400 Ω (30 mA)', 'relay'], ['Lamp or solenoid, 24 Ω (0.5 A)', 'lamp']], value: darl0 ? 'lamp' : 'relay' },
        { id: 'vd', type: 'select', label: 'Logic pin', options: [['3.3 V', 3.3], ['5 V', 5]], value: darl0 ? 5 : 3.3 },
        { id: 'rb', label: 'Base resistor R_B', min: 100, max: 100e3, value: darl0 ? 680 : 820, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'diode', type: 'check', label: 'Flyback diode across the load', value: true }
      ], () => rebuild());
      const ro = kit.readout(box.side, [['il', 'Load current (on)'], ['ib', 'Base current'], ['fb', 'Forced β = I_C / I_B'], ['vce', 'V_CE when on'], ['pq', 'Transistor dissipation'], ['sat', 'State'], ['pk', 'Peak collector voltage']]);
      const V = ctl.values;
      const VCC = 12, TP = 10e-3, DT = 5e-6, SPF = 24;
      let c = null, parts = null, buf = [], tStart = 0, pk = 0, phL = 0, phF = 0;

      /* the whole circuit; pin is the logic level (a number, or a function of time) */
      function build(cc, pin) {
        cc.V('vcc', 'gnd', VCC);
        cc.V('pin', 'gnd', pin);
        const Rb = cc.R('pin', 'b', V.rb);
        const Rpd = cc.R('b', 'gnd', 47e3);                         // pull-down
        if (V.part === 'darl') {
          cc.NPN('c', 'b', 'm', { beta: 40 });                       // driver
          cc.NPN('cq', 'm', 'gnd', { beta: 40, is: 1e-12 });         // output transistor
          cc.R('b', 'm', 8e3); cc.R('m', 'gnd', 120);                // the TIP120's internal resistors
          cc.R('c', 'cq', 0.15);
        } else {
          cc.NPN('cq', 'b', 'gnd', { beta: 150 });
          cc.R('c', 'cq', 0.4);                                      // bulk collector resistance
        }
        cc.D('gnd', 'c', { vz: 50 });                                // collector–emitter breakdown
        let load;
        if (V.load === 'led') { cc.R('vcc', 'l', 470); load = cc.D('l', 'c', { is: 1e-18, n: 2 }); }
        else if (V.load === 'relay') { cc.R('vcc', 'l', 400); load = cc.L('l', 'c', 0.4, 0); }
        else load = cc.R('vcc', 'c', 24);
        const fly = V.diode ? cc.D('c', 'vcc') : null;
        return { Rb, Rpd, load, fly };
      }
      function onState() {
        const cc = new kit.Circuit();
        const p = build(cc, V.vd);
        cc.dc();
        const il = p.load.i, ib = p.Rb.i - p.Rpd.i, vce = cc.v('c');
        // the same load with a perfect switch, for comparison
        const ci = new kit.Circuit();
        ci.V('vcc', 'gnd', VCC);
        let li;
        if (V.load === 'led') { ci.R('vcc', 'l', 470); li = ci.D('l', 'c', { is: 1e-18, n: 2 }); }
        else if (V.load === 'relay') { ci.R('vcc', 'l', 400); li = ci.L('l', 'c', 0.4, 0); }
        else li = ci.R('vcc', 'c', 24);
        ci.R('c', 'gnd', 1e-3);
        ci.dc();
        const pq = vce * il + cc.v('b') * Math.max(ib, 0);
        const full = V.part === 'darl' ? vce < 1.3 : vce < 0.35;
        ro.set('il', kit.eng(il, 'A') + '   (ideal switch: ' + kit.eng(li.i, 'A') + ')');
        ro.set('ib', kit.eng(ib, 'A') + (ib > 0.02 ? '  — too much for a logic pin' : ''));
        ro.set('fb', ib > 1e-9 ? (il / ib).toFixed(il / ib < 20 ? 1 : 0) : '—');
        ro.set('vce', kit.eng(vce, 'V'));
        ro.set('pq', kit.eng(pq, 'W'));
        ro.set('sat', full ? (V.part === 'darl' ? 'fully on (as far as a Darlington goes)' : 'saturated: a good switch') : 'NOT saturated — needs more base current');
      }
      function rebuild() {
        c = new kit.Circuit();
        parts = build(c, t => { const u = t % TP; return u >= 1e-3 && u < 6e-3 ? V.vd : 0; });
        c.dc();
        buf = []; tStart = 0; pk = 0;
        onState();
        ro.set('pk', '…');
      }
      function draw(dt) {
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const s = Math.min(1.15, W / 540);
        const il = parts.load.i, ifl = parts.fly ? parts.fly.i : 0;
        g.save();
        g.translate(Math.max(0, (W - 540 * s) / 2), 0);
        g.scale(s, s);
        const xc = 330, yr = 40, yc = 190, yg = 300, xf = xc + 120;
        S.rail(g, xc, yr, '+12 V');
        if (V.load === 'led') {
          S.resistor(g, xc, yr, xc, 108, { label: 'R', value: '470 Ω' });
          S.wire(g, [[xc, 108], [xc, 116]]);
          S.diode(g, xc, 116, xc, 178, { kind: 'led', on: il > 2e-3, label: 'LED' });
          S.wire(g, [[xc, 178], [xc, yc]]);
        } else if (V.load === 'relay') {
          S.inductor(g, xc, yr, xc, yc, { core: true, label: 'relay coil', value: '400 Ω, 0.4 H' });
        } else {
          S.lamp(g, xc, yr, xc, yc, { on: il > 0.05, brightness: clamp(il / 0.5, 0, 1), label: 'lamp', value: '24 Ω' });
        }
        if (V.diode) {
          S.wire(g, [[xc, yr], [xf, yr], [xf, 76]]);
          S.diode(g, xf, 156, xf, 76, { label: 'flyback', color: Math.abs(ifl) > 1e-4 ? C.warn : undefined });
          S.wire(g, [[xf, 156], [xf, yc], [xc, yc]]);
        }
        S.node(g, xc, yc);
        let yb, bpin;
        if (V.part === 'darl') {
          const q1 = S.npn(g, xc - 48, 220, {});
          const q2 = S.npn(g, xc - 8, 266, { label: 'TIP120' });
          S.wire(g, [q1.c, [xc - 40, yc], [xc, yc]]);
          S.wire(g, [[xc, yc], q2.c]);
          S.wire(g, [q1.e, q2.b]);
          S.wire(g, [q2.e, [xc, yg]]);
          yb = 220; bpin = q1.b;
        } else {
          const q = S.npn(g, xc - 8, 232, { label: '2N2222A' });
          S.wire(g, [[xc, yc], q.c]);
          S.wire(g, [q.e, [xc, yg]]);
          yb = 232; bpin = q.b;
        }
        S.ground(g, xc, yg);
        const xn = bpin[0] - 34, xs = xn - 160;
        S.wire(g, [[xn, yb], bpin]);
        S.node(g, xn, yb);
        S.resistor(g, xn, yb, xn, yg, { label: '47k' });
        S.ground(g, xn, yg);
        S.resistor(g, xn - 120, yb, xn, yb, { label: 'R_B', value: kit.eng(V.rb, 'Ω') });
        S.wire(g, [[xn - 120, yb], [xs, yb], [xs, yb + 12]]);
        S.vsource(g, xs, yb + 12, xs, yg, { label: 'pin', value: V.vd + ' V' });
        S.ground(g, xs, yg);
        const pinOn = c.v('pin') > 1;
        S.led(g, xs, yb - 22, pinOn);
        kit.label(g, pinOn ? 'HIGH' : 'LOW', xs + 12, yb - 22, { size: 11, color: pinOn ? C.ok : C.muted });
        phL += (dt || 0) * flowSpeed(il);
        phF += (dt || 0) * flowSpeed(ifl);
        S.flow(g, [[xc, yr], [xc, yc], [xc, yg]], phL, { color: C.warn });
        if (V.diode && ifl > 1e-4) S.flow(g, [[xc, yc], [xf, yc], [xf, yr], [xc, yr]], phF, { color: C.warn });
        kit.label(g, 'I = ' + kit.eng(Math.abs(il) < 1e-6 ? 0 : il, 'A'), xc + 12, yc + 14, { size: 12, color: C.warn });
        g.restore();
        const sy = Math.round(322 * s), sh = Math.max(110, Hh - sy - 26);
        S.scope(g, 14, sy, W - 28, sh, {
          tdiv: 1e-3, divy: 8,
          traces: [
            { pts: buf.map(p => [p[0], p[1]]), vdiv: 2, offset: -3, label: 'PIN' },
            { pts: buf.map(p => [p[0], p[2]]), vdiv: 10, offset: -3, label: 'COLLECTOR' }
          ]
        });
      }
      function frame(dt) {
        for (let k = 0; k < SPF; k++) {
          c.step(DT);
          const vc = c.v('c');
          if (c.t - tStart >= TP - 1e-9) { ro.set('pk', kit.eng(pk, 'V')); buf = []; tStart = c.t; pk = 0; }
          pk = Math.max(pk, vc);
          buf.push([c.t - tStart, c.v('pin'), vc]);
        }
        draw(dt);
      }
      rebuild();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
    }
  });

  /* ================================================================ common-emitter amplifier */
  Hyper.sim('tr-ce-amp', {
    title: 'Common-emitter amplifier on the scope',
    blurb: `A common-emitter stage from a 12 V supply: bias from a 100 kΩ / 18 kΩ divider, $R_C$ = 5.6 kΩ and 1.22 kΩ of emitter resistance, part of which can be bypassed by 100 µF. The scope shows the input (yellow) and the output after the coupling capacitor (blue); the simulator steps the whole circuit in time.

- With the bypass capacitor in, change the unbypassed emitter resistance: the gain follows $-R_C/(r_e + R_E)$ — about −22 with 220 Ω, near −190 with none.
- Raise the input until the output clips: the bottom flattens when the transistor saturates, the top when it cuts off. With the emitter fully bypassed even a 20 mV input comes out lopsided, because $r_e$ changes with the current.
- Change β from 100 to 400: the operating point hardly moves. That is what the divider and the emitter resistor are for.
- Lower the frequency towards 10 Hz: the bypass and coupling capacitors stop working and the gain falls. Load the output with 2.2 kΩ: the gain drops, since $R_L$ is in parallel with $R_C$.
- Tick **show the emitter**: the emitter follows the input almost exactly — an emitter follower is hiding inside every common-emitter stage.`,
    mount(box, kit, params) {
      const follower = !!(params && params.view === 'follower');
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 440 });
      const S = kit.schem;
      const VCC = 12, R1 = 100e3, R2 = 18e3, RC = 5.6e3, RE = 1220, CIN = 1e-6, COUT = 10e-6, CE = 100e-6;
      const ctl = kit.controls(box.side, [
        { id: 'amp', label: 'Input amplitude', min: 1e-3, max: 2, value: follower ? 0.5 : 0.05, log: true, sig: 2, fmt: v => kit.eng(v, 'V') },
        { id: 'f', label: 'Frequency', min: 10, max: 20e3, value: 1000, log: true, sig: 2, fmt: v => kit.eng(v, 'Hz') },
        { id: 'byp', type: 'check', label: 'Emitter bypass capacitor (100 µF)', value: !follower },
        { id: 'reu', label: 'Unbypassed emitter resistance', min: 0, max: 1000, step: 10, value: 220, unit: 'Ω' },
        { id: 'beta', type: 'select', label: 'Transistor β', options: [['100', 100], ['200', 200], ['400', 400]], value: 200 },
        { id: 'rl', type: 'select', label: 'Load on the output', options: [['1 MΩ (scope probe)', 1e6], ['10 kΩ', 1e4], ['2.2 kΩ', 2200]], value: 1e6 },
        { id: 'em', type: 'check', label: 'Show the emitter (follower output)', value: follower }
      ], () => rebuild());
      const ro = kit.readout(box.side, [['q', 'Q-point I_C'], ['v', 'V_B · V_E · V_C'], ['gp', 'Gain, mid-band formula'], ['gm', 'Gain, measured'], ['rin', 'Input resistance'], ['clip', 'Output']]);
      const V = ctl.values;
      let c, Q, dc = { ic: 1e-3, vb: 0, ve: 0, vc: 0 }, gainPred = -1, reu = RE, dts = 5e-6, tdiv = 5e-4, spf = 1, buf = [], tStart = 0, acc = null, last = null;
      const fresh = () => ({ inMax: -1e9, inMin: 1e9, outMax: -1e9, outMin: 1e9, vceMin: 1e9, icMin: 1e9 });

      function rebuild() {
        c = new kit.Circuit();
        c.V('vcc', 'gnd', VCC);
        const A = V.amp, w = TAU * V.f;
        c.V('sig', 'gnd', t => A * Math.sin(w * t));
        c.C('sig', 'b', CIN, 0);
        c.R('vcc', 'b', R1);
        c.R('b', 'gnd', R2);
        c.R('vcc', 'c', RC);
        Q = c.NPN('c', 'b', 'e', { beta: V.beta });
        reu = V.byp ? Math.max(V.reu, 0.5) : RE;
        if (V.byp) { c.R('e', 'e2', reu); c.R('e2', 'gnd', RE - Math.min(V.reu, 1000)); c.C('e2', 'gnd', CE, 0); }
        else c.R('e', 'gnd', RE);
        c.C('c', 'out', COUT, 0);
        c.R('out', 'gnd', V.rl);
        c.dc();                                              // start from the operating point
        dc = { ic: Q.ic, vb: c.v('b'), ve: c.v('e'), vc: c.v('c') };
        const re = VT / Math.max(dc.ic, 1e-9);
        const rcl = RC * V.rl / (RC + V.rl);
        gainPred = -rcl / (re + reu);
        const rin = 1 / (1 / R1 + 1 / R2 + 1 / ((V.beta + 1) * (re + reu)));
        const T = 1 / V.f;
        dts = T / 200;
        tdiv = Hyper.niceStep(2.5 * T, 10);
        spf = Math.max(1, Math.round(10 * tdiv / dts / 90));
        buf = []; tStart = 0; acc = fresh(); last = null;
        ctl.show('reu', V.byp);
        ro.set('q', kit.eng(dc.ic, 'A') + '   (r_e = ' + kit.eng(re, 'Ω') + ')');
        ro.set('v', kit.fmt(dc.vb, 3) + ' · ' + kit.fmt(dc.ve, 3) + ' · ' + kit.fmt(dc.vc, 3) + ' V');
        ro.set('gp', gainPred.toFixed(Math.abs(gainPred) < 10 ? 2 : 1));
        ro.set('gm', '…');
        ro.set('rin', kit.eng(rin, 'Ω'));
        ro.set('clip', '…');
      }
      function finish() {
        const ppi = acc.inMax - acc.inMin, ppo = acc.outMax - acc.outMin;
        if (ppi > 0 && ppo >= 0) ro.set('gm', (-(ppo / ppi)).toFixed(ppo / ppi < 10 ? 2 : 1));
        let clip = 'clean';
        if (acc.vceMin < 0.3) clip = 'bottom clipped: the transistor saturates';
        else if (acc.icMin < 0.03 * dc.ic) clip = 'top clipped: the transistor cuts off';
        else if (ppo > 0 && Math.abs((acc.outMax + acc.outMin) / ppo) > 0.08) clip = 'lopsided: r_e changes with the current';
        ro.set('clip', clip);
        last = { ppo, ppi };
        acc = fresh();
      }
      function drawSchematic(g, C) {
        const xs = 30, xb = 150, xq = 240, xcol = xq + 8, xo1 = 330, xo2 = 380, xrl = 430;
        const yTop = 40, yB = 132, yBot = 266, ye2 = 208, yc = yB - 30;
        S.wire(g, [[xb, yTop], [xcol, yTop]]);
        S.rail(g, 200, yTop, '+12 V');
        S.resistor(g, xb, yTop, xb, yB, { label: 'R₁', value: '100 kΩ' });
        S.resistor(g, xb, yB, xb, yBot, { label: 'R₂', value: '18 kΩ' });
        S.vsource(g, xs, yB + 12, xs, yBot, { ac: true });
        kit.label(g, 'IN', xs - 20, yB + 60, { size: 11, color: '#d8c33a', align: 'center' });
        S.wire(g, [[xs, yB + 12], [xs, yB], [62, yB]]);
        S.capacitor(g, 62, yB, 112, yB, { label: 'C_in', value: '1 µF' });
        const pins = S.npn(g, xq, yB, {});
        S.wire(g, [[112, yB], pins.b]);
        S.node(g, xb, yB);
        S.resistor(g, xcol, yTop, xcol, pins.c[1], { label: 'R_C', value: '5.6 kΩ' });
        if (V.byp) {
          S.resistor(g, xcol, pins.e[1], xcol, ye2, { label: 'R_E1', value: Math.round(V.reu) + ' Ω' });
          S.resistor(g, xcol, ye2, xcol, yBot, { label: 'R_E2', value: Math.round(RE - V.reu) + ' Ω' });
          S.wire(g, [[xcol, ye2], [xcol + 72, ye2]]);
          S.capacitor(g, xcol + 72, ye2, xcol + 72, yBot, { polarized: true, label: 'C_E' });
          S.node(g, xcol, ye2);
        } else S.resistor(g, xcol, pins.e[1], xcol, yBot, { label: 'R_E', value: '1.22 kΩ' });
        if (V.em) kit.label(g, 'E', xcol - 16, pins.e[1] + 8, { size: 12, color: '#f47ad6', weight: 700 });
        S.wire(g, [[xcol, yc], [xo1, yc]]);
        S.node(g, xcol, yc);
        S.capacitor(g, xo1, yc, xo2, yc, { label: 'C_out', value: '10 µF' });
        S.wire(g, [[xo2, yc], [xrl, yc]]);
        S.resistor(g, xrl, yc, xrl, yBot, { label: 'R_L', value: kit.eng(V.rl, 'Ω') });
        kit.label(g, 'OUT', xrl + 8, yc - 12, { size: 11, color: '#4dd6f4' });
        S.wire(g, [[xs, yBot], [xrl, yBot]]);
        S.ground(g, 200, yBot);
        void C;
      }
      function frame() {
        for (let k = 0; k < spf; k++) {
          c.step(dts);
          if (c.t - tStart > 10 * tdiv) { finish(); buf = []; tStart = c.t; }
          const vi = c.v('sig'), vo = c.v('out');
          if (vi > acc.inMax) acc.inMax = vi;
          if (vi < acc.inMin) acc.inMin = vi;
          if (vo > acc.outMax) acc.outMax = vo;
          if (vo < acc.outMin) acc.outMin = vo;
          if (Q.vce < acc.vceMin) acc.vceMin = Q.vce;
          if (Q.ic < acc.icMin) acc.icMin = Q.ic;
          buf.push([c.t - tStart, vi, vo, c.v('e') - dc.ve]);
        }
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const s = Math.min(1.15, W / 480);
        g.save();
        g.translate(Math.max(0, (W - 470 * s) / 2), 0);
        g.scale(s, s);
        drawSchematic(g, C);
        g.restore();
        const vin = step125(V.amp / 3.2);
        const vout = last ? step125(Math.max(last.ppo / 2, 1e-4) / 3.2) : step125(Math.max(Math.min(Math.abs(gainPred) * V.amp, 6), 1e-4) / 3.2);
        const traces = [
          { pts: buf.map(p => [p[0], p[1]]), vdiv: vin, label: 'IN' },
          { pts: buf.map(p => [p[0], p[2]]), vdiv: vout, label: 'OUT' }
        ];
        if (V.em) traces.push({ pts: buf.map(p => [p[0], p[3]]), vdiv: vin, label: 'EMITTER (AC)' });
        const sy = Math.round(300 * s), sh = Math.max(120, Hh - sy - 26);
        S.scope(g, 14, sy, W - 28, sh, { tdiv, divy: 8, traces });
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
    }
  });

  /* ================================================================ MOSFET switch */
  Hyper.sim('tr-mosfet-switch', {
    title: 'MOSFET switch: gate voltage, heat and switching loss',
    blurb: `A MOSFET switches a 12 V load with PWM. The circuit simulator finds the on-state with a square-law model fitted to each part; then the losses are added up — conduction $D\\,V_{DS}I_D$, with $R_{DS(on)}$ rising as the junction heats, and switching $V I\\,t_{sw} f$, where $t_{sw}$ is the time the driver needs to deliver the Miller charge $Q_{gd}$.

- Choose the **IRF540N** and set the gate to 5 V, then 3.3 V: the upper graph shows the drain stuck at volts, not millivolts — it is only partly on, and it cooks. The logic-level **IRLZ44N** is fully on at 3–5 V.
- Raise the load current and watch the junction temperature: conduction loss grows with the square of the current. Try the heat sinks.
- Raise the PWM frequency with the gate driven from a **microcontroller pin**: the lower graph shows switching loss overtaking conduction loss within the audio range. A **gate-driver IC** moves that crossover up by more than a decade.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const S = kit.schem;
      const VS = 12;
      const PARTS = {
        irlz: { name: 'IRLZ44N', vt: 1.5, k: 13, qg: 48e-9, qgd: 25e-9 },
        irf: { name: 'IRF540N', vt: 3.5, k: 3.5, qg: 71e-9, qgd: 21e-9 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'part', type: 'select', label: 'MOSFET', options: [['IRLZ44N (logic level)', 'irlz'], ['IRF540N (standard, 10 V gate)', 'irf']], value: 'irlz' },
        { id: 'vg', label: 'Gate drive voltage', min: 0, max: 12, step: 0.1, value: 5, unit: 'V' },
        { id: 'il', label: 'Load current when fully on', min: 0.5, max: 20, step: 0.5, value: (params && params.load) || 5, unit: 'A' },
        { id: 'th', type: 'select', label: 'Mounting (junction to air)', options: [['TO-220 in free air, 62 °C/W', 62], ['Small clip-on heat sink, ≈ 22 °C/W', 22], ['Large heat sink, ≈ 5 °C/W', 5]], value: (params && params.mount) || 62 },
        { id: 'drv', type: 'select', label: 'Gate driven by', options: [['Microcontroller pin via 220 Ω', 'mcu'], ['Gate-driver IC via 4.7 Ω', 'ic']], value: (params && params.drv) || 'mcu' },
        { id: 'f', label: 'PWM frequency', min: 100, max: 500e3, value: (params && params.f) || 1e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Hz') },
        { id: 'd', label: 'PWM duty cycle', min: 0, max: 100, step: 1, value: 50, unit: '%' }
      ], () => { solve(); loop.once(); });
      const ro = kit.readout(box.side, [['id', 'Drain current (on)'], ['vds', 'V_DS when on'], ['rds', 'R_DS(on), hot'], ['pc', 'Conduction loss'], ['ps', 'Switching loss'], ['pg', 'Gate-drive power'], ['tj', 'Junction temperature'], ['st', 'State']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'PWM frequency (Hz)', log: true }, y: { label: 'loss (W)', log: true } }, 190);
      const V = ctl.values;
      let P = PARTS.irlz, res = { id: 0, vds: VS }, curve = [], tj = 25, ph = 0, curveKey = '';

      function onState(k, vg) {
        const c = new kit.Circuit();
        c.V('vs', 'gnd', VS);
        c.R('vs', 'd', VS / V.il);
        const M = c.NMOS('d', 'g', 'gnd', { vt: P.vt, k, lambda: 0 });
        c.V('g', 'gnd', vg);
        c.dc();
        return { id: Math.max(0, M.id), vds: clamp(c.v('d'), 0, VS) };
      }
      function solve() {
        P = PARTS[V.part] || PARTS.irlz;
        const D = V.d / 100, rg = V.drv === 'ic' ? 4.7 + 7 : 220 + 25;   // plus the driver's own output resistance
        let pc = 0, ps = 0, tsw = 0, conv = false, weak = false, t = 25;
        for (let it = 0; it < 60; it++) {
          const k = P.k / (1 + 0.007 * (Math.min(t, 400) - 25));          // R_DS(on) rises about 0.7 %/°C
          res = onState(k, V.vg);
          const vpl = P.vt + Math.sqrt(2 * res.id / k);                     // the Miller plateau at this current
          weak = V.vg - vpl < 0.1;
          tsw = weak ? 0 : P.qgd * rg / (V.vg - vpl);
          pc = D * res.vds * res.id;
          ps = D > 0 && D < 1 && !weak ? VS * res.id * tsw * V.f : 0;
          const tn = 25 + (pc + ps) * V.th;
          if (Math.abs(tn - t) < 0.02) { t = tn; conv = true; break; }
          t += 0.5 * (tn - t);
          if (t > 400) break;
        }
        tj = t;
        const off = res.id < 1e-3;
        ro.set('id', kit.eng(res.id, 'A'));
        ro.set('vds', kit.eng(res.vds, 'V'));
        ro.set('rds', res.id > 0.01 ? kit.eng(res.vds / res.id, 'Ω') : '—');
        ro.set('pc', kit.eng(pc, 'W'));
        ro.set('ps', kit.eng(ps, 'W') + (weak && !off ? '  (never fully on)' : ''));
        ro.set('pg', kit.eng(P.qg * V.vg * V.f, 'W'));
        ro.set('tj', !conv || tj > 200 ? 'over 200 °C' : tj.toFixed(0) + ' °C');
        ro.set('st', off ? 'off: gate below the threshold' : !conv || tj > 175 ? 'DESTROYED: junction beyond 175 °C' : weak ? 'only partly on: gate too low for this current' : tj > 125 ? 'fully on, but running too hot' : 'fully on');
        // V_DS against V_GS at this load (25 °C), for the upper graph
        const key = V.part + ':' + V.il;
        if (key !== curveKey) {
          curve = [];
          for (let j = 0; j <= 120; j++) { const vg = 12 * j / 120; curve.push([vg, Math.max(onState(P.k, vg).vds, 1e-3)]); }
          curveKey = key;
        }
        // losses against frequency, for the lower graph
        const f0 = 100, f1 = 1e6, cond = [], sw = [], tot = [];
        for (let j = 0; j <= 60; j++) {
          const f = f0 * Math.pow(f1 / f0, j / 60);
          const p2 = D > 0 && D < 1 && !weak ? VS * res.id * tsw * f : 0;
          cond.push([f, Math.max(pc, 1e-4)]); sw.push([f, Math.max(p2, 1e-4)]); tot.push([f, Math.max(pc + p2, 1e-4)]);
        }
        const top = Math.max(1, tot[tot.length - 1][1]);
        plot.set({
          x: { label: 'PWM frequency (Hz)', log: true, min: f0, max: f1 },
          y: { label: 'loss (W)', log: true, min: 1e-3, max: Math.pow(10, Math.ceil(Math.log10(top))) },
          series: [{ pts: cond, label: 'conduction' }, { pts: sw, label: 'switching', dash: [5, 4] }, { pts: tot, label: 'total' }],
          vlines: [{ x: V.f, label: kit.eng(V.f, 'Hz') }]
        });
      }
      function draw(dt) {
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const s = Math.min(1.1, W / 720, Hh / 300);
        g.save();
        g.scale(s, s);
        const xd = 250, yr = 36, yg = 262, yd = 132, ym = 176;
        S.rail(g, xd, yr, '+12 V');
        S.lamp(g, xd, yr, xd, yd - 10, { on: res.id > 0.2, brightness: clamp(res.id / V.il, 0, 1), label: 'load', value: kit.eng(V.il, 'A') });
        S.wire(g, [[xd, yd - 10], [xd, yd]]);
        const m = S.nmos(g, xd - 8, ym, { label: P.name });
        S.wire(g, [[xd, yd], m.d]);
        S.wire(g, [m.s, [xd, yg]]);
        S.ground(g, xd, yg);
        const xn = m.g[0] - 26, xsrc = 60;
        S.wire(g, [[xn, m.g[1]], m.g]);
        S.node(g, xn, m.g[1]);
        S.resistor(g, xn, m.g[1], xn, yg, { label: '100k' });
        S.ground(g, xn, yg);
        S.resistor(g, xsrc + 30, m.g[1], xn, m.g[1], { label: 'R_G', value: V.drv === 'ic' ? '4.7 Ω' : '220 Ω' });
        S.wire(g, [[xsrc + 30, m.g[1]], [xsrc, m.g[1]], [xsrc, m.g[1] + 14]]);
        S.vsource(g, xsrc, m.g[1] + 14, xsrc, yg, { label: V.drv === 'ic' ? 'driver' : 'MCU', value: kit.fmt(V.vg, 3) + ' V' });
        S.ground(g, xsrc, yg);
        ph += (dt || 0) * flowSpeed(res.id);
        S.flow(g, [[xd, yr], [xd, yd], [xd, yg]], ph, { color: C.warn });
        // the junction temperature as a thermometer
        const tx = 356, ty0 = 60, ty1 = 240, frac = clamp((tj - 25) / 175, 0, 1);
        const col = tj > 175 ? C.bad : tj > 125 ? C.warn : C.ok;
        g.fillStyle = C.surface; g.fillRect(tx - 7, ty0, 14, ty1 - ty0);
        g.fillStyle = col; g.fillRect(tx - 7, ty1 - frac * (ty1 - ty0), 14, frac * (ty1 - ty0));
        g.strokeStyle = C.muted; g.lineWidth = 1.2; g.strokeRect(tx - 7, ty0, 14, ty1 - ty0);
        kit.label(g, 'T_J', tx, ty0 - 12, { size: 11, color: C.muted, align: 'center' });
        kit.label(g, tj > 200 ? '>200 °C' : tj.toFixed(0) + ' °C', tx, ty1 + 13, { size: 12, color: col, align: 'center', weight: 600 });
        g.restore();
        // V_DS against V_GS: how far on is it?
        const r = { x: Math.round(W * 0.6), y: 30, w: Math.round(W * 0.37), h: Math.max(80, Hh - 76) };
        const mp = axes(g, kit, r, [0, 12], [1e-3, 20], { ylog: true, xlabel: 'V_GS (V)', ylabel: 'V_DS when on (log)', fy: v => kit.eng(v, 'V'), nx: 6 });
        g.save(); g.beginPath(); g.rect(r.x, r.y, r.w, r.h); g.clip();
        g.strokeStyle = C.accent; g.lineWidth = 2; g.beginPath();
        curve.forEach((p, j) => (j ? g.lineTo(mp.X(p[0]), mp.Y(p[1])) : g.moveTo(mp.X(p[0]), mp.Y(p[1]))));
        g.stroke();
        g.restore();
        kit.dot(g, mp.X(V.vg), mp.Y(Math.max(res.vds, 1e-3)), 6, col, C.text);
        kit.label(g, P.name + ', ' + kit.eng(V.il, 'A') + ' load', r.x + r.w - 4, r.y + 12, { size: 11, color: C.muted, align: 'right' });
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ H-bridge */
  Hyper.sim('tr-hbridge', {
    title: 'An H-bridge driving a DC motor',
    blurb: `Four MOSFETs around a DC motor (1.5 Ω, 1 mH, back-EMF 0.02 V per rad/s), each with its body diode. The simulator steps the circuit and the motor's rotation together, at about half real time; the graph records the motor current and speed.

- **Forward**, then **Brake**: both low-side switches short the motor; its back-EMF drives a reverse current that stops it in about a second.
- **Forward**, then **Coast**: the current dies away through two body diodes in a fraction of a millisecond, and the motor spins down slowly, on friction alone.
- **Forward**, then straight to **Reverse**: the back-EMF now adds to the supply, and the current jumps to about twice the stall current.
- **Shoot-through** turns on both switches of the left leg: about 60 A flows straight from the supply to ground, limited only by the MOSFETs themselves, and they would dissipate hundreds of watts. A real bridge would be destroyed within milliseconds — dead time exists to prevent exactly this.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const S = kit.schem;
      const MODES = { fwd: 'forward', rev: 'reverse', brake: 'brake (both low sides on)', coast: 'coast (all off)', shoot: 'SHOOT-THROUGH (left leg)' };
      const GATES = { fwd: [1, 0, 0, 1], rev: [0, 1, 1, 0], brake: [0, 1, 0, 1], coast: [0, 0, 0, 0], shoot: [1, 1, 0, 0] };   // high L, low L, high R, low R
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'fwd', label: 'Forward', primary: true }, { id: 'rev', label: 'Reverse' }, { id: 'brake', label: 'Brake' }, { id: 'coast', label: 'Coast' }] },
        { type: 'buttons', items: [{ id: 'shoot', label: 'Shoot-through!' }] },
        { id: 'vs', label: 'Supply voltage', min: 6, max: 24, step: 0.5, value: 12, unit: 'V' },
        { id: 'tl', label: 'Load torque', min: 0, max: 0.1, step: 0.002, value: 0.01, fmt: v => kit.fmt(v * 1000, 3) + ' mN·m' }
      ], id => { if (MODES[id]) setMode(id); else if (id === 'vs') Vsup.v = V.vs; });
      const ro = kit.readout(box.side, [['mode', 'State'], ['im', 'Motor current'], ['rpm', 'Speed'], ['emf', 'Back-EMF'], ['is', 'Supply current'], ['pq', 'Heat in the switches']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'time (s)' }, y: { label: 'current (A), speed (1000 rpm)' } }, 170);
      const V = ctl.values;
      const KE = 0.02, RM = 1.5, LM = 1e-3, J = 8e-5, B = 2e-5, DT = 1e-4, SPF = 80;
      let mode = 'coast', gates = GATES.coast, w = 0, ang = 0, simT = 0, hist = [], frameN = 0;
      const ph = [0, 0, 0, 0, 0];

      const c = new kit.Circuit();
      const Vsup = c.V('vs', 'gnd', V.vs, { r: 0.05 });
      c.C('vs', 'gnd', 470e-6, V.vs);                                    // bulk capacitor
      const gHi = i => () => (gates[i] ? V.vs - Math.min(V.vs, 12) : V.vs); // P-channel: gate pulled below its source
      const gLo = i => () => (gates[i] ? Math.min(V.vs, 12) : 0);
      c.V('gA', 'gnd', gHi(0)); c.V('gB', 'gnd', gLo(1)); c.V('gC', 'gnd', gHi(2)); c.V('gD', 'gnd', gLo(3));
      const MA = c.PMOS('a', 'gA', 'vs', { vt: 2, k: 2.5, lambda: 0 });      // 40 mΩ when on
      const MB = c.NMOS('a', 'gB', 'gnd', { vt: 2, k: 5, lambda: 0 });      // 20 mΩ when on
      const MC = c.PMOS('b', 'gC', 'vs', { vt: 2, k: 2.5, lambda: 0 });
      const MD = c.NMOS('b', 'gD', 'gnd', { vt: 2, k: 5, lambda: 0 });
      const BD = { is: 1e-10, n: 1.2 };                                     // body diodes
      const dA = c.D('a', 'vs', BD), dB = c.D('gnd', 'a', BD), dC = c.D('b', 'vs', BD), dD = c.D('gnd', 'b', BD);
      c.R('a', 'm1', RM);
      const Lm = c.L('m1', 'm2', LM, 0);
      c.V('m2', 'b', () => KE * w);                                        // back-EMF
      c.dc();

      function setMode(m) { mode = m; gates = GATES[m]; }
      function stepAll() {
        c.step(DT);
        const i = Lm.i;
        const tl = V.tl * Math.tanh(w / 5);
        w += DT * (KE * i - B * w - tl) / J;
        simT += DT;
      }
      const legs = () => [-MA.id - dA.i, MB.id - dB.i, -MC.id - dC.i, MD.id - dD.i];    // downward current in each switch
      function draw(dt) {
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const yTop = 44, yBot = Hh - 36, yMid = Math.round((yTop + yBot) / 2);
        const xL = Math.round(W * 0.27), xR = Math.round(W * 0.73);
        const yH = yTop + 62, yLo = yBot - 62;
        const lg = legs(), im = Lm.i;
        S.wire(g, [[xL, yTop], [xR, yTop]]);
        S.rail(g, (xL + xR) / 2, yTop, kit.fmt(V.vs, 3) + ' V');
        S.wire(g, [[xL, yBot], [xR, yBot]]);
        S.ground(g, (xL + xR) / 2, yBot);
        const sw = (x, y, i, hi, name) => {
          const on = gates[i];
          const col = mode === 'shoot' && on && i < 2 ? C.bad : on ? C.ok : C.faint;
          const m = hi ? S.pmos(g, x - 8, y, { color: col, labels: false }) : S.nmos(g, x - 8, y, { color: col, labels: false });
          S.wire(g, [[x, hi ? yTop : yMid], hi ? m.s : m.d]);
          S.wire(g, [hi ? m.d : m.s, [x, hi ? yMid : yBot]]);
          kit.label(g, name + (on ? ' on' : ' off'), m.g[0] - 4, m.g[1], { size: 11.5, color: on ? col : C.muted, align: 'right', weight: 600 });
          const d = [dA, dB, dC, dD][i];
          const dcol = d.i > 0.05 ? C.warn : C.faint;
          S.wire(g, [[x, y + 30], [x + 30, y + 30], [x + 30, y + 22]], { color: dcol });
          S.diode(g, x + 30, y + 22, x + 30, y - 22, { color: dcol });
          S.wire(g, [[x + 30, y - 22], [x + 30, y - 30], [x, y - 30]], { color: dcol });
        };
        sw(xL, yH, 0, true, 'A'); sw(xL, yLo, 1, false, 'B'); sw(xR, yH, 2, true, 'C'); sw(xR, yLo, 3, false, 'D');
        S.wire(g, [[xL, yMid], [xL + 50, yMid]]);
        S.wire(g, [[xR - 50, yMid], [xR, yMid]]);
        S.motor(g, xL + 50, yMid, xR - 50, yMid, {});
        S.node(g, xL, yMid); S.node(g, xR, yMid);
        // a spoke that turns with the motor (slowed down so it is visible)
        ang += (dt || 0) * w * 0.05;
        const mx = (xL + xR) / 2, my = yMid + 46;
        g.strokeStyle = C.muted; g.lineWidth = 1.5; g.beginPath(); g.arc(mx, my, 13, 0, TAU); g.stroke();
        g.strokeStyle = C.accent; g.lineWidth = 2.5; g.beginPath(); g.moveTo(mx, my); g.lineTo(mx + 13 * Math.cos(ang), my + 13 * Math.sin(ang)); g.stroke();
        const d = dt || 0;
        ph[4] += d * flowSpeed(im);
        S.flow(g, [[xL, yMid], [xR, yMid]], ph[4], { color: C.warn });
        const paths = [[[xL, yTop], [xL, yMid]], [[xL, yMid], [xL, yBot]], [[xR, yTop], [xR, yMid]], [[xR, yMid], [xR, yBot]]];
        for (let i = 0; i < 4; i++) { ph[i] += d * flowSpeed(lg[i]); if (Math.abs(lg[i]) > 0.01) S.flow(g, paths[i], ph[i], { color: C.warn }); }
        kit.label(g, 'motor ' + kit.eng(Math.abs(im) < 1e-4 ? 0 : im, 'A'), mx, yMid - 30, { size: 12, color: C.warn, align: 'center' });
        if (mode === 'shoot') kit.label(g, 'SHOOT-THROUGH: ' + kit.eng(Math.abs(lg[1]), 'A') + ' from supply to ground', W / 2, 18, { size: 13, color: C.bad, align: 'center', weight: 700 });
      }
      function frame(dt) {
        for (let k = 0; k < SPF; k++) stepAll();
        const im = Lm.i, rpm = w * 60 / TAU;
        let pq = 0;
        for (const e of [MA, MB, MC, MD, dA, dB, dC, dD]) pq += Math.abs(e.p || 0);
        ro.set('mode', MODES[mode]);
        ro.set('im', kit.eng(Math.abs(im) < 1e-4 ? 0 : im, 'A'));
        ro.set('rpm', Math.round(rpm) + ' rpm');
        ro.set('emf', kit.eng(KE * w, 'V'));
        ro.set('is', kit.eng(Math.abs(Vsup.i) < 1e-4 ? 0 : Vsup.i, 'A'));
        ro.set('pq', kit.eng(pq, 'W'));
        hist.push([simT, im, rpm / 1000]);
        while (hist.length && hist[0][0] < simT - 3) hist.shift();
        if (++frameN % 3 === 0) {
          plot.set({
            x: { label: 'time (s)', min: Math.max(0, simT - 3), max: Math.max(3, simT) },
            series: [{ pts: hist.map(p => [p[0], p[1]]), label: 'current (A)' }, { pts: hist.map(p => [p[0], p[2]]), label: 'speed (1000 rpm)' }]
          });
        }
        draw(dt);
      }
      setMode('fwd');
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
    }
  });

  /* ================================================================ 555 astable */
  Hyper.sim('tr-555', {
    title: 'The 555 astable on the scope',
    blurb: `The timing network ($R_1$, $R_2$, $C$ and, optionally, a steering diode) is solved by the circuit simulator; the 555's two comparators and its flip-flop act on the capacitor voltage at every time step, and the discharge transistor is the switch they close. The scope shows the capacitor (blue) swinging between the dashed thresholds, and the output (yellow).

- Change $R_1$, $R_2$ and $C$ and compare the measured frequency with $1.44/((R_1 + 2R_2)C)$. The first high period is longer: the capacitor starts from 0 V, not from ⅓ $V_{CC}$.
- Change the supply: the thresholds move with it, and the frequency stays put.
- The duty cycle is always above 50 % — unless you add the diode across $R_2$. Then the high time depends on $R_1$ alone (a little longer than $0.693R_1C$, because of the diode's drop).
- Drive pin 5: moving the upper threshold changes the frequency — a voltage-controlled oscillator.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 440 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'vcc', label: 'Supply V_CC', min: 4.5, max: 15, step: 0.5, value: 9, unit: 'V' },
        { id: 'r1', label: 'R₁', min: 1e3, max: 1e6, value: 10e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'r2', label: 'R₂', min: 1e3, max: 1e6, value: 68e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'c', label: 'C', min: 1e-9, max: 100e-6, value: 10e-6, log: true, sig: 2, fmt: v => kit.eng(v, 'F') },
        { id: 'diode', type: 'check', label: 'Diode across R₂ (duty below 50 %)', value: false },
        { id: 'cv', type: 'check', label: 'Drive pin 5 (control voltage)', value: false },
        { id: 'vcv', label: 'Pin 5 voltage', min: 1, max: 14, step: 0.1, value: 7, unit: 'V' }
      ], () => rebuild());
      const ro = kit.readout(box.side, [['ff', 'f = 1.44/((R₁+2R₂)C)'], ['fm', 'f, simulated'], ['th', 'High time'], ['tl', 'Low time'], ['du', 'Duty cycle'], ['lev', 'Thresholds']]);
      const V = ctl.values;
      let c, sw, q = 1, thr = { up: 6, lo: 3 }, dt = 1e-3, spf = 10, tdiv = 0.2, buf = [], tStart = 0, tRise = -1, tFall = -1, lastHigh = 0;

      function rebuild() {
        const up = V.cv ? clamp(V.vcv, 1, V.vcc - 0.5) : V.vcc * 2 / 3;
        thr = { up, lo: up / 2 };
        c = new kit.Circuit();
        c.V('vcc', 'gnd', V.vcc);
        c.R('vcc', 'dis', V.r1);
        c.R('dis', 'th', V.r2);
        if (V.diode) c.D('dis', 'th');
        c.C('th', 'gnd', V.c, 0);
        sw = c.SW('dis', 'gnd', false, { ron: 20 });                       // the discharge transistor, pin 7
        c.reset();
        q = 1; tRise = 0; tFall = -1; lastHigh = 0;
        const ln2 = Math.LN2;
        const tH = V.diode ? ln2 * V.r1 * V.c : ln2 * (V.r1 + V.r2) * V.c, tL = ln2 * V.r2 * V.c, T = tH + tL;
        dt = T / 500;
        const win = 2.5 * T;
        tdiv = Hyper.niceStep(win, 10);
        const frames = clamp(10 * tdiv * 60, 90, 1200);                 // real time when slow, at most 20 s a sweep
        spf = Math.max(1, Math.ceil(10 * tdiv / dt / frames));
        buf = []; tStart = 0;
        ro.set('ff', kit.eng(1 / T, 'Hz') + (V.diode ? '  (diode: 1.44/((R₁+R₂)C))' : ''));
        ro.set('fm', '…'); ro.set('th', '…'); ro.set('tl', '…'); ro.set('du', '…');
        ro.set('lev', kit.fmt(thr.lo, 3) + ' V and ' + kit.fmt(thr.up, 3) + ' V');
        ctl.show('vcv', V.cv);
      }
      function stepOnce() {
        c.step(dt);
        const v = c.v('th');
        if (q && v >= thr.up) {                                            // threshold comparator resets the flip-flop
          q = 0; sw.closed = true; tFall = c.t; lastHigh = tFall - tRise;
        } else if (!q && v <= thr.lo) {                                    // trigger comparator sets it
          q = 1; sw.closed = false;
          const T = c.t - tRise, tLow = c.t - tFall;
          if (tRise > 0) {
            ro.set('fm', kit.eng(1 / T, 'Hz'));
            ro.set('th', kit.eng(lastHigh, 's'));
            ro.set('tl', kit.eng(tLow, 's'));
            ro.set('du', (100 * lastHigh / T).toFixed(1) + ' %');
          }
          tRise = c.t;
        }
      }
      function frame() {
        for (let k = 0; k < spf; k++) {
          stepOnce();
          if (c.t - tStart > 10 * tdiv) { buf = []; tStart = c.t; }
          buf.push([c.t - tStart, c.v('th'), q ? V.vcc - 1.7 : 0.1]);
        }
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const s = Math.min(1.1, W / 560);
        g.save();
        g.translate(Math.max(0, (W - 540 * s) / 2), 0);
        g.scale(s, s);
        const x0 = 190, y0 = 60, cw = 250, ch = 220, xe = 110, xd = 70, yr = 34;
        // the external timing network
        S.wire(g, [[xe, yr], [x0 + 200, yr], [x0 + 200, y0]]);
        S.rail(g, x0 + 60, yr, '+' + kit.fmt(V.vcc, 3) + ' V');
        S.resistor(g, xe, yr, xe, y0 + 30, { label: 'R₁', value: kit.eng(V.r1, 'Ω') });
        S.wire(g, [[xe, y0 + 30], [x0, y0 + 30]]);
        S.node(g, xe, y0 + 30);
        S.resistor(g, xe, y0 + 30, xe, y0 + 116, { label: 'R₂', value: kit.eng(V.r2, 'Ω') });
        if (V.diode) {
          S.wire(g, [[xe, y0 + 30], [xd, y0 + 30]]);
          S.diode(g, xd, y0 + 30, xd, y0 + 116, {});
          S.wire(g, [[xd, y0 + 116], [xe, y0 + 116]]);
        }
        S.wire(g, [[xe, y0 + 116], [x0 - 20, y0 + 116]]);
        S.wire(g, [[x0 - 20, y0 + 74], [x0 - 20, y0 + 158]]);
        S.wire(g, [[x0 - 20, y0 + 74], [x0, y0 + 74]]);
        S.wire(g, [[x0 - 20, y0 + 158], [x0, y0 + 158]]);
        S.node(g, xe, y0 + 116); S.node(g, x0 - 20, y0 + 116);
        S.capacitor(g, xe, y0 + 116, xe, y0 + ch + 10, { label: 'C', value: kit.eng(V.c, 'F') });
        S.ground(g, xe, y0 + ch + 10);
        // the chip
        g.fillStyle = C.surface; g.fillRect(x0, y0, cw, ch);
        g.strokeStyle = C.text; g.lineWidth = 2; g.strokeRect(x0, y0, cw, ch);
        kit.label(g, '555', x0 + cw - 10, y0 + ch - 14, { size: 14, color: C.muted, align: 'right', weight: 700 });
        const pin = (t, x, y) => kit.label(g, t, x, y, { size: 10.5, color: C.muted, align: 'center' });
        pin('7', x0 - 7, y0 + 22); pin('6', x0 - 7, y0 + 66); pin('2', x0 - 7, y0 + 150); pin('3', x0 + cw + 8, y0 + 109); pin('8', x0 + 208, y0 - 8); pin('1', x0 + 208, y0 + ch + 8);
        const A = S.opamp(g, x0 + 95, y0 + 65, { size: 0.6 });
        const Bc = S.opamp(g, x0 + 95, y0 + 167, { size: 0.6 });
        S.wire(g, [[x0, y0 + 74], A.inp]);
        S.wire(g, [A.inn, [x0 + 52, A.inn[1]]]);
        kit.label(g, kit.fmt(thr.up, 3) + ' V', x0 + 50, A.inn[1], { size: 10.5, color: C.muted, align: 'right' });
        S.wire(g, [[x0, y0 + 158], Bc.inn]);
        S.wire(g, [Bc.inp, [x0 + 52, Bc.inp[1]]]);
        kit.label(g, kit.fmt(thr.lo, 3) + ' V', x0 + 50, Bc.inp[1], { size: 10.5, color: C.muted, align: 'right' });
        S.wire(g, [A.out, [x0 + 135, A.out[1]], [x0 + 135, y0 + 105], [x0 + 150, y0 + 105]]);
        S.wire(g, [Bc.out, [x0 + 135, Bc.out[1]], [x0 + 135, y0 + 135], [x0 + 150, y0 + 135]]);
        g.strokeStyle = C.text; g.lineWidth = 2; g.strokeRect(x0 + 150, y0 + 95, 60, 50);
        kit.label(g, 'R', x0 + 157, y0 + 105, { size: 11, color: C.text });
        kit.label(g, 'S', x0 + 157, y0 + 135, { size: 11, color: C.text });
        kit.label(g, 'Q', x0 + 200, y0 + 120, { size: 11, color: C.text, align: 'right' });
        kit.label(g, 'flip-flop', x0 + 180, y0 + 155, { size: 10, color: C.muted, align: 'center' });
        S.wire(g, [[x0 + 210, y0 + 120], [x0 + cw, y0 + 120]], { color: q ? C.ok : C.text });
        S.wire(g, [[x0, y0 + 30], [x0 + 170, y0 + 30]]);
        S.switch(g, x0 + 170, y0 + 30, x0 + 170, y0 + 66, { closed: !q, color: !q ? C.warn : C.text });
        S.ground(g, x0 + 170, y0 + 66);
        dashed(g, [[x0 + 190, y0 + 95], [x0 + 190, y0 + 48], [x0 + 178, y0 + 48]], C.muted, 1.2, [3, 3]);
        kit.label(g, 'discharge', x0 + 196, y0 + 40, { size: 10, color: C.muted });
        S.ground(g, x0 + 200, y0 + ch);
        kit.label(g, V.cv ? 'pin 5 driven at ' + kit.fmt(thr.up, 3) + ' V' : 'pin 5: 10 nF to ground', x0 + 8, y0 + ch - 14, { size: 10.5, color: C.muted });
        S.wire(g, [[x0 + cw, y0 + 120], [x0 + cw + 46, y0 + 120]]);
        S.led(g, x0 + cw + 56, y0 + 120, !!q, { r: 9 });
        kit.label(g, 'OUT', x0 + cw + 70, y0 + 120, { size: 11, color: C.muted });
        g.restore();
        // the scope: capacitor in the lower part, output above it
        const vC = step125(V.vcc / 4.5), vO = step125((V.vcc - 1.7) / 2.6);
        const sy = Math.round((y0 + ch + 40) * s), sh = Math.max(120, Hh - sy - 26), sx = 14, swd = W - 28;
        S.scope(g, sx, sy, swd, sh, {
          tdiv, divy: 8,
          traces: [
            { pts: buf.map(p => [p[0], p[2]]), vdiv: vO, offset: 1.2, label: 'OUT' },
            { pts: buf.map(p => [p[0], p[1]]), vdiv: vC, offset: -3.8, label: 'C' }
          ]
        });
        for (const v of [thr.up, thr.lo]) {
          const y = sy + sh / 2 - (v / vC - 3.8) * sh / 8;
          dashed(g, [[sx, y], [sx + swd, y]], 'rgba(77, 214, 244, 0.55)', 1, [4, 4]);
        }
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
    }
  });

  /* ================================================================ Wien-bridge oscillator */
  Hyper.sim('tr-wien', {
    title: 'A Wien-bridge oscillator starting from noise',
    blurb: `An op-amp (±12 V rails) with a Wien network of two resistors $R$ and two 10 nF capacitors. A tiny noise current is injected into the network all the time; the circuit simulator does the rest. The lower graph shows the peak amplitude on a logarithmic scale, so exponential growth is a straight line.

- With the gain below 3 (loop gain below 1) nothing but noise remains. Set it a little above 3 and a sine wave grows out of the noise; its slope on the graph is the growth per cycle, $e^{\\pi(A-3)}$. (The simulator's time step adds a little damping, so the threshold sits a hair above 3.)
- With **clipping at the rails**, growth stops only when the output hits ±12 V: a flattened sine. With **diodes** across part of $R_f$, the gain falls as the amplitude rises, and the oscillator settles at a couple of volts with a much cleaner shape.
- Change $R$: the frequency follows $1/(2\\pi RC)$.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 420 });
      const S = kit.schem;
      const CW = 10e-9, RG = 10e3, NI = 5e-9, SPF = 400;
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'Amplifier gain A = 1 + R_f / R_g', min: 2.7, max: 3.6, step: 0.01, value: 3.1 },
        { id: 'r', label: 'Wien resistors R', min: 1.6e3, max: 160e3, value: 16e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'lim', type: 'select', label: 'Amplitude limiting', options: [['Diodes across part of R_f', 'diodes'], ['None: clipping at the rails', 'rails']], value: 'diodes' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart from noise', primary: true }] }
      ], id => { if (id === 'a') setGain(); else if (id === 'r') setR(); else rebuild(); });
      const ro = kit.readout(box.side, [['lg', 'Loop gain Aβ at f₀ (A/3)'], ['gp', 'Growth per cycle, e^π(A−3)'], ['gm', 'Growth per cycle, simulated'], ['f0', 'f₀ = 1/(2πRC)'], ['fm', 'Frequency, simulated'], ['amp', 'Peak amplitude']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'cycles' }, y: { label: 'peak amplitude (V)', log: true, min: 1e-6, max: 30 } }, 170);
      const V = ctl.values;
      let c, rs, rp, rf, rf1, rf2, T0 = 1e-3, dt = 1e-6, tdiv = 3e-4, buf = [], tStart = 0, hist = [], halfPeak = 0, prevV = 0, ups = [], peakShow = 0, sweepPeak = 0, sweepPeakLast = 1e-5, frameN = 0;

      function setGain() {
        const tot = (V.a - 1) * RG;
        if (rf) rf.r = tot;
        if (rf1) { rf1.r = 0.6 * tot; rf2.r = 0.4 * tot; }
        ro.set('lg', (V.a / 3).toFixed(3));
        ro.set('gp', Math.exp(Math.PI * (V.a - 3)).toFixed(3));
      }
      function setR() {
        rs.r = V.r; rp.r = V.r;
        T0 = TAU * V.r * CW; dt = T0 / 1000;
        tdiv = Hyper.niceStep(3 * T0, 10);
        hist = []; ups = []; buf = []; tStart = c.t;
        ro.set('f0', kit.eng(1 / T0, 'Hz'));
      }
      function rebuild() {
        c = new kit.Circuit();
        // no gbw: the engine's single-pole op-amp would slew at only about 1 V/ms here
        c.OPAMP('p', 'n', 'out', { vpos: 12, vneg: -12, gain: 5e3 });
        rs = c.R('out', 'x', V.r);
        c.C('x', 'p', CW, 0);
        rp = c.R('p', 'gnd', V.r);
        c.C('p', 'gnd', CW, 0);
        c.I('gnd', 'p', t => NI * hash(Math.round(t / dt)));          // noise
        c.R('n', 'gnd', RG);
        rf = rf1 = rf2 = null;
        if (V.lim === 'diodes') {
          rf1 = c.R('out', 'f', 1); rf2 = c.R('f', 'n', 1);
          c.D('f', 'n'); c.D('n', 'f');
        } else rf = c.R('out', 'n', 1);
        c.reset();
        setGain();
        T0 = TAU * V.r * CW; dt = T0 / 1000;
        tdiv = Hyper.niceStep(3 * T0, 10);
        hist = []; ups = []; buf = []; tStart = 0; halfPeak = 0; prevV = 0; peakShow = 0; sweepPeak = 0;
        ro.set('f0', kit.eng(1 / T0, 'Hz'));
        ro.set('gm', '—'); ro.set('fm', '—'); ro.set('amp', '—');
      }
      function stepOnce() {
        c.step(dt);
        const v = c.v('out');
        halfPeak = Math.max(halfPeak, Math.abs(v));
        if ((v >= 0) !== (prevV >= 0)) {                                   // a zero crossing ends a half-cycle
          hist.push([c.t / T0, Math.max(halfPeak, 1e-7)]);
          if (hist.length > 700) hist.shift();
          if (v >= 0) { ups.push(c.t); if (ups.length > 8) ups.shift(); }
          peakShow = halfPeak;
          halfPeak = 0;
        }
        prevV = v;
        if (Math.abs(v) > sweepPeak) sweepPeak = Math.abs(v);
        if (c.t - tStart > 10 * tdiv) { buf = []; tStart = c.t; sweepPeakLast = Math.max(sweepPeak, 1e-6); sweepPeak = 0; }
        buf.push([c.t - tStart, v]);
      }
      function measure() {
        ro.set('amp', kit.eng(peakShow, 'V'));
        if (ups.length >= 4 && peakShow > 1e-3) ro.set('fm', kit.eng((ups.length - 1) / (ups[ups.length - 1] - ups[0]), 'Hz'));
        else ro.set('fm', '—');
        // growth per cycle from the envelope, while it is growing and not yet limited
        let g = null;
        const n = hist.length;
        if (n > 12) {
          const a = hist[n - 1], b = hist[n - 11];
          if (a[1] > 1e-4 && a[1] < 1 && b[1] > 1e-5 && a[0] - b[0] > 2) g = Math.pow(a[1] / b[1], 1 / (a[0] - b[0]));
        }
        ro.set('gm', g ? g.toFixed(3) : '—');
      }
      function draw() {
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const s = Math.min(1.1, W / 470);
        g.save();
        g.translate(Math.max(0, (W - 440 * s) / 2), 0);
        g.scale(s, s);
        const a = S.opamp(g, 270, 150, {});
        const O = [340, 150], N = [200, a.inn[1]];
        S.wire(g, [a.out, O]);
        S.node(g, O[0], O[1]);
        kit.label(g, 'OUT', O[0] + 10, O[1] - 12, { size: 11, color: '#d8c33a' });
        S.wire(g, [a.inn, N]);
        S.wire(g, [N, [N[0], 84]]);
        S.wire(g, [[O[0], O[1]], [O[0], 84]]);
        if (V.lim === 'diodes') {
          S.resistor(g, N[0], 84, 265, 84, { label: 'R_f2' });
          S.resistor(g, 265, 84, O[0], 84, { label: 'R_f1' });
          S.wire(g, [[N[0], 84], [N[0], 30]]);
          S.wire(g, [[265, 84], [265, 30]]);
          S.diode(g, N[0], 56, 265, 56, {});
          S.diode(g, 265, 30, N[0], 30, {});
          S.node(g, 265, 84);
        } else S.resistor(g, N[0], 84, O[0], 84, { label: 'R_f', value: kit.eng((V.a - 1) * RG, 'Ω') });
        S.node(g, N[0], N[1]);
        S.resistor(g, N[0], N[1], 140, N[1], { label: 'R_g', value: '10 kΩ' });
        S.wire(g, [[140, N[1]], [140, N[1] + 16]]);
        S.ground(g, 140, N[1] + 16);
        // the Wien network
        const yw = 240, P = [180, yw];
        S.wire(g, [O, [O[0], yw]]);
        S.resistor(g, O[0], yw, 276, yw, { label: 'R', value: kit.eng(V.r, 'Ω') });
        S.capacitor(g, 276, yw, P[0], yw, { label: 'C', value: '10 nF' });
        S.wire(g, [a.inp, [P[0], a.inp[1]], P]);
        S.node(g, P[0], P[1]);
        S.resistor(g, P[0], yw, P[0], 300, { label: 'R' });
        S.ground(g, P[0], 300);
        S.wire(g, [P, [130, yw]]);
        S.capacitor(g, 130, yw, 130, 300, { label: 'C' });
        S.ground(g, 130, 300);
        S.wire(g, [[130, yw], [70, yw]]);
        S.isource(g, 70, 300, 70, yw, { label: 'noise', color: C.muted });
        S.ground(g, 70, 300);
        g.restore();
        const vdiv = clamp(step125(sweepPeakLast / 3.4), 1e-6, 10);
        const sy = Math.round(330 * s), sh = Math.max(110, Hh - sy - 26);
        S.scope(g, 14, sy, W - 28, sh, { tdiv, divy: 8, traces: [{ pts: buf, vdiv, label: 'OUT' }] });
        void C;
      }
      function frame() {
        for (let k = 0; k < SPF; k++) stepOnce();
        measure();
        if (++frameN % 4 === 0) {
          const now = c.t / T0;
          plot.set({
            x: { label: 'cycles', min: Math.max(0, now - 150), max: Math.max(150, now) },
            y: { label: 'peak amplitude (V)', log: true, min: 1e-6, max: 30 },
            series: [{ pts: hist.slice(), label: 'peak' }],
            hlines: [{ y: 12, label: 'rails' }]
          });
        }
        draw();
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
    }
  });

  /* ================================================================ transmission line */
  Hyper.sim('tr-tline', {
    title: 'Pulses and standing waves on a transmission line',
    blurb: `A generator with source resistance $R_S$ drives 10 ns of line — about 2 m of coax. The line is modelled exactly as two travelling waves with a delay (the way SPICE treats a lossless line), and the generator and the load are solved by the circuit simulator at every time step. The graph above the line shows the voltage along it: the total (bold) and the forward and reflected waves (thin). The scope shows the two ends.

- **Pulse** into an open end: it comes back upright. A short: it comes back inverted. A matched load: it vanishes into the load.
- Choose a resistor load and compare the returning pulse with $\\Gamma = (R_L - Z_0)/(R_L + Z_0)$.
- **Step** is time-domain reflectometry: the input first rises to half; one round trip later it moves to full (open end) or back to zero (short).
- Make the source resistance 10 Ω: the reflection now bounces off the source too, and the line rings.
- **Sine**: the forward and reflected waves form a standing wave. The dashed envelope's maximum over its minimum is the SWR; nodes are a quarter-wavelength apart.`,
    mount(box, kit, params) {
      const sine0 = !!(params && params.mode === 'sine');
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 430 });
      const S = kit.schem;
      const TD = 10e-9, N = 200, DT = TD / N, MASK = 1023, M = 100;
      const ctl = kit.controls(box.side, [
        { id: 'src', type: 'select', label: 'Source', options: [['Pulse', 'pulse'], ['Step (reflectometer)', 'step'], ['Sine wave', 'sine']], value: sine0 ? 'sine' : 'pulse' },
        { id: 'load', type: 'select', label: 'Far end', options: [['Open circuit', 'open'], ['Short circuit', 'short'], ['Matched (R = Z₀)', 'match'], ['Resistor R_L', 'res'], ['Capacitor, 20 pF', 'cap']], value: sine0 ? 'res' : 'open' },
        { id: 'rl', label: 'Load resistor R_L', min: 5, max: 1000, value: 150, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'z0', type: 'select', label: 'Line impedance Z₀', options: [['50 Ω', 50], ['75 Ω', 75], ['100 Ω', 100]], value: 50 },
        { id: 'rs', type: 'select', label: 'Source resistance R_S', options: [['Matched (= Z₀)', 0], ['10 Ω', 10], ['200 Ω', 200]], value: 0 },
        { id: 'len', label: 'Sine: line length in wavelengths', min: 0.25, max: 3, step: 0.05, value: 1.25 },
        { id: 'spd', label: 'Animation speed', min: 1, max: 10, step: 1, value: 3 }
      ], id => { if (id !== 'spd') rebuild(); });
      const ro = kit.readout(box.side, [['g', 'Γ = (Z_L − Z₀)/(Z_L + Z₀)'], ['swr', 'SWR = (1+|Γ|)/(1−|Γ|)'], ['rl', 'Return loss'], ['swrm', 'SWR measured (sine)'], ['gs', 'Γ at the source']]);
      const V = ctl.values;
      const F = new Float64Array(MASK + 1), Bw = new Float64Array(MASK + 1);
      let c, Z0 = 50, Rs = 50, Ea = 0, Eb = 0, k = 0, buf = [], tStart = 0, env = new Float64Array(M + 1), envShown = null, envN = 0;

      function srcV(t) {
        if (V.src === 'pulse') { const u = t % (4 * TD), w = 2e-9; return u < w ? 1 - Math.cos(TAU * u / w) : 0; }
        if (V.src === 'step') {
          const u = t % (6 * TD), r = 0.4e-9;
          if (u < 3 * TD) return u < r ? 1 - Math.cos(Math.PI * u / r) : 2;
          const v = u - 3 * TD;
          return v < r ? 1 + Math.cos(Math.PI * v / r) : 0;
        }
        return 2 * Math.min(1, t / TD) * Math.sin(TAU * V.len / TD * t);
      }
      const period = () => (V.src === 'pulse' ? 4 * TD : V.src === 'step' ? 6 * TD : 3 * TD / V.len);
      const fmtG = g => (g >= 0 ? '+' : '−') + Math.abs(g).toFixed(3);
      function rebuild() {
        Z0 = V.z0; Rs = V.rs || Z0;
        c = new kit.Circuit();
        c.V('g', 'gnd', t => srcV(t));
        c.R('g', 'a', Rs);
        c.R('a', 'gnd', Z0); c.I('gnd', 'a', () => Ea / Z0);              // line input: Z₀ and the wave arriving back
        c.R('b', 'gnd', Z0); c.I('gnd', 'b', () => Eb / Z0);              // line output: Z₀ and the wave arriving
        if (V.load === 'short') c.R('b', 'gnd', 1e-3);
        else if (V.load === 'match') c.R('b', 'gnd', Z0);
        else if (V.load === 'res') c.R('b', 'gnd', V.rl);
        else if (V.load === 'cap') c.C('b', 'gnd', 20e-12, 0);
        c.reset();
        F.fill(0); Bw.fill(0); k = 0; Ea = 0; Eb = 0;
        buf = []; tStart = 0; env = new Float64Array(M + 1); envShown = null; envN = 0;
        const zl = V.load === 'short' ? 0 : V.load === 'match' ? Z0 : V.load === 'res' ? V.rl : Infinity;
        ctl.show('rl', V.load === 'res');
        ctl.show('len', V.src === 'sine');
        if (V.load === 'cap') {
          ro.set('g', '−1 at first, then +1 (τ = Z₀C = ' + kit.eng(Z0 * 20e-12, 's') + ')');
          ro.set('swr', '—'); ro.set('rl', '—');
        } else {
          const G = zl === Infinity ? 1 : (zl - Z0) / (zl + Z0), aG = Math.abs(G);
          ro.set('g', fmtG(G));
          ro.set('swr', aG > 0.9999 ? '∞' : ((1 + aG) / (1 - aG)).toFixed(2));
          ro.set('rl', aG < 1e-6 ? '∞ (no reflection)' : (-20 * Math.log10(aG)).toFixed(1) + ' dB');
        }
        ro.set('gs', fmtG((Rs - Z0) / (Rs + Z0)));
        ro.set('swrm', V.src === 'sine' ? '…' : '— (choose the sine source)');
      }
      const profile = s => F[(k - Math.round(s * N)) & MASK] + Bw[(k - Math.round((1 - s) * N)) & MASK];
      function stepLine() {
        const kk = k + 1;
        Ea = 2 * Bw[(kk - N) & MASK];                                       // the backward wave arriving at the input
        Eb = 2 * F[(kk - N) & MASK];                                        // the forward wave arriving at the far end
        c.step(DT);
        k = kk;
        const va = c.v('a'), vb = c.v('b');
        F[k & MASK] = va - Ea / 2;                                          // total minus arriving = wave sent out
        Bw[k & MASK] = vb - Eb / 2;
        if (V.src === 'sine') {
          for (let j = 0; j <= M; j++) { const v = Math.abs(profile(j / M)); if (v > env[j]) env[j] = v; }
          if (++envN >= Math.round(N / V.len)) {                            // one period of the sine
            envShown = env; env = new Float64Array(M + 1); envN = 0;
            if (c.t > 2 * TD) {
              let mx = 0, mn = Infinity;
              for (const v of envShown) { mx = Math.max(mx, v); mn = Math.min(mn, v); }
              ro.set('swrm', mn < mx * 1e-3 ? 'very large (true nodes)' : (mx / mn).toFixed(2) + (V.len < 0.5 ? '  (line too short to show a max and a min)' : ''));
            }
          }
        }
        if (c.t - tStart >= period() - DT / 2) { buf = []; tStart = c.t; }
        buf.push([c.t - tStart, va, vb]);
      }
      function frame() {
        for (let j = 0; j < V.spd; j++) stepLine();
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const xa = 130, xb = W - 76, y1 = 48, y2 = 84, gx0 = 26;
        // generator, source resistor, line, load
        S.vsource(g, gx0, y1 + 14, gx0, y2, { ac: true });
        S.wire(g, [[gx0, y1 + 14], [gx0, y1]]);
        S.resistor(g, gx0, y1, xa, y1, { label: 'R_S', value: kit.eng(Rs, 'Ω') });
        S.wire(g, [[gx0, y2], [xa, y2]]);
        g.fillStyle = C.surface; g.fillRect(xa, y1, xb - xa, y2 - y1);
        S.wire(g, [[xa, y1], [xb, y1]], { width: 3 });
        S.wire(g, [[xa, y2], [xb, y2]], { width: 3 });
        kit.label(g, 'Z₀ = ' + Z0 + ' Ω, delay 10 ns (≈ 2 m of coax)', (xa + xb) / 2, (y1 + y2) / 2, { size: 11.5, color: C.muted, align: 'center' });
        const xl = xb + 34;
        if (V.load === 'open') { S.node(g, xb, y1); S.node(g, xb, y2); kit.label(g, 'open', xb + 8, (y1 + y2) / 2, { size: 11, color: C.muted }); }
        else if (V.load === 'short') S.wire(g, [[xb, y1], [xb + 16, y1], [xb + 16, y2], [xb, y2]]);
        else {
          S.wire(g, [[xb, y1], [xl, y1]]); S.wire(g, [[xb, y2], [xl, y2]]);
          if (V.load === 'cap') S.capacitor(g, xl, y1, xl, y2, { label: '20p' });
          else S.resistor(g, xl, y1, xl, y2, { label: kit.eng(V.load === 'match' ? Z0 : V.rl, 'Ω') });
        }
        // the voltage along the line
        const gy = 116, gh = Math.max(100, Math.min(200, Hh * 0.34)), mid = gy + gh / 2, sc = gh / 2 / 2.2;
        g.fillStyle = C.surface; g.fillRect(xa, gy, xb - xa, gh);
        g.strokeStyle = C.grid; g.lineWidth = 1; g.beginPath();
        for (const v of [-2, -1, 1, 2]) { g.moveTo(xa, mid - v * sc); g.lineTo(xb, mid - v * sc); }
        g.stroke();
        g.strokeStyle = C.axis; g.beginPath(); g.moveTo(xa, mid); g.lineTo(xb, mid); g.stroke();
        for (const v of [-2, -1, 0, 1, 2]) kit.label(g, v + ' V', xa - 6, mid - v * sc, { size: 10.5, color: C.muted, align: 'right' });
        const X = s => xa + s * (xb - xa);
        const line = (fn, col, w, dash) => {
          const pts = [];
          for (let j = 0; j <= M; j++) pts.push([X(j / M), mid - clamp(fn(j / M), -2.6, 2.6) * sc]);
          if (dash) dashed(g, pts, col, w, dash);
          else { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke(); }
        };
        line(s => F[(k - Math.round(s * N)) & MASK], C.series[1], 1.3);
        line(s => Bw[(k - Math.round((1 - s) * N)) & MASK], C.series[2], 1.3);
        line(profile, C.accent, 2.6);
        if (V.src === 'sine' && envShown) {
          const e = envShown;
          line(s => e[Math.round(s * M)], C.warn, 1.3, [5, 4]);
          line(s => -e[Math.round(s * M)], C.warn, 1.3, [5, 4]);
        }
        kit.label(g, 'forward', xa + 6, gy + 12, { size: 11, color: C.series[1] });
        kit.label(g, 'reflected', xa + 70, gy + 12, { size: 11, color: C.series[2] });
        kit.label(g, 'total', xa + 146, gy + 12, { size: 11, color: C.accent, weight: 600 });
        // the scope: both ends of the line
        const sy = Math.round(gy + gh + 22), sh = Math.max(100, Hh - sy - 26);
        S.scope(g, 14, sy, W - 28, sh, {
          tdiv: period() / 10, divy: 8,
          traces: [{ pts: buf.map(p => [p[0], p[1]]), vdiv: 0.5, label: 'INPUT' }, { pts: buf.map(p => [p[0], p[2]]), vdiv: 0.5, label: 'FAR END' }]
        });
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
    }
  });
})();
