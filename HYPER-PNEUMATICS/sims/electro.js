/* HYPER-PNEUMATICS · sims/electro.js — simulations for Electro-pneumatics (prefix ep-).
 *   ep-coil       a 24 V valve coil switched on and off: current rise, pull-in, the switch-off spike and suppression, PWM holding
 *   ep-ladder     a relay ladder (self-holding start/stop, two reed switches) running a cylinder through a 5/2 valve
 *   ep-reed       a magnetic piston passing reed or magneto-resistive switches, and whether a PLC sees the pulse
 *   ep-plc-scan   a PLC scan cycle running the sequence A+ B+ A− B−: process images, step chart and timing
 *   ep-prop-reg   a proportional pressure regulator (sensor, controller, fill and vent valves) and its step response
 *   ep-servo      a servo-pneumatic axis: proportional 5/3 valve, chamber pressures by the energy balance, state control
 *   ep-leak-test  a pressure-decay leak test with the air cooling after filling
 * Cylinders use kit.fluid.pneuCylinder; valve and orifice flows kit.fluid.iso6358; symbols kit.fsym and kit.schem. */
(function () {
  'use strict';
  const PATM = 1.013e5, RAIR = 287.058, TREF = 293.15;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const num = (v, d) => (Number.isFinite(v) ? v : 0).toFixed(d);
  // draw on a fixed design grid scaled into the stage; returns a mapper from pointer to design coordinates
  function design(st, c, DW, DH) {
    const k = Math.min(st.W / DW, st.H / DH) || 1, ox = (st.W - DW * k) / 2, oy = (st.H - DH * k) / 2;
    c.save(); c.translate(ox, oy); c.scale(k, k);
    return { k, map: p => ({ x: (p.x - ox) / k, y: (p.y - oy) / k }) };
  }
  // n graph boxes under the stage
  function graphs(box, n) {
    const d = document.createElement('div');
    d.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:' + (n > 1 ? '1fr 1fr' : '1fr') + ';gap:8px';
    box.stage.appendChild(d);
    const out = [];
    for (let i = 0; i < n; i++) { const g = document.createElement('div'); d.appendChild(g); out.push(g); }
    return out;
  }
  // thin a history for plotting
  const thin = (a, n) => { if (a.length <= n) return a; const k = Math.ceil(a.length / n); return a.filter((q, i) => i % k === 0 || i === a.length - 1); };

  /* ================================================================ ep-coil */
  Hyper.sim('ep-coil', {
    title: 'Switching a solenoid coil',
    blurb: `A 24 V valve coil switched by a controller output (a positive-switching, PNP-type output). The model integrates the coil current, $L\\,di/dt = v - iR$; when the switch opens, the current carries on through the suppressor, which clamps the coil at $-V_c$. The armature pulls in when the current passes 60 % of its full value and drops out below 20 %; the pilot air then shifts the valve's main spool about 6 ms later, and its spring returns it about 8 ms after release.

**Try this**
- With a plain **diode** the switch sees only about 25 V, but the current dies slowly: read the release time.
- Choose **diode + Zener**: the spike rises to 50–60 V and the valve releases several times sooner.
- Choose **none**: the spike reaches hundreds of volts — enough to arc across a relay contact or destroy a transistor output.
- Turn on **PWM holding** and lower the duty: the power falls with D² and the release gets quicker — below about 20 % the armature drops out by itself.
- Raise the inductance: pull-in and release both slow down, because everything scales with τ = L/R.`,
    mount(box, kit) {
      const S = kit.schem, F = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250 });
      const [g1, g2] = graphs(box, 2);
      const pI = kit.plot(g1, { x: { label: 'time (ms)' }, y: { label: 'coil current (mA)', min: 0 } }, 150);
      const pV = kit.plot(g2, { x: { label: 'time (ms)' }, y: { label: 'voltage across the switch (V)', min: 0 } }, 150);
      const SUP = [['None (breakdown at about 300 V)', 300], ['Diode (0.8 V)', 0.8], ['Diode + 24 V Zener', 24.8], ['Diode + 36 V Zener', 36.8], ['Varistor (about 50 V)', 50]];
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'on', label: 'Switch on', primary: true }, { id: 'off', label: 'Switch off' }] },
        { id: 'auto', type: 'check', label: 'Switch on and off by itself (60 ms each)', value: true },
        { id: 'sup', type: 'select', label: 'Suppressor across the coil', options: SUP, value: 0.8 },
        { id: 'P', label: 'Coil power at 24 V', min: 0.5, max: 8, step: 0.1, value: 2.5, unit: 'W' },
        { id: 'L', label: 'Coil inductance', min: 0.05, max: 2, value: 0.46, unit: 'H', log: true, sig: 2 },
        { id: 'pwm', type: 'check', label: 'Hold with PWM after 30 ms', value: false },
        { id: 'D', label: 'Holding duty', min: 10, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'slow', type: 'select', label: 'Time', options: [['20 ms per second', 0.02], ['5 ms per second', 0.005], ['50 ms per second', 0.05]], value: 0.02 }
      ], (id) => {
        if (id === 'on') { ctl.set('auto', false); setCmd(1); }
        if (id === 'off') { ctl.set('auto', false); setCmd(0); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['R', 'Resistance / full current'], ['tau', 'Time constant L/R'], ['pull', 'Armature in / valve switched'], ['rel', 'Armature out / valve back'], ['vpk', 'Peak voltage across the switch'], ['P', 'Coil power now'], ['E', 'Energy stored, ½LI²']]);
      const V = ctl.values, VS = 24;
      const s = { t: 0, i: 0, cmd: 0, tCmd: -1, armOn: false, arm: 0, valve: 0, vTarget: 0, pend: null, vNode: 0, vpk: 0, vpkOff: 0,
        wait: '', pull: '—', pullV: '—', rel: '—', relV: '—', drop: false, hist: [], tS: 0, tP: 0, ph: 0 };
      function setCmd(c) {
        if (c === s.cmd) return;
        s.cmd = c; s.tCmd = s.t; s.drop = false;
        if (c) { s.wait = 'pull'; s.pull = s.pullV = '…'; } else { s.wait = 'rel'; s.rel = s.relV = '…'; s.vpkOff = 0; }
      }
      const ms = t => (t * 1000).toFixed(1) + ' ms';
      function step(h) {
        const R = VS * VS / V.P, tau = V.L / R, Ifull = VS / R, Vc = V.sup;
        if (V.auto && s.t - s.tCmd >= 0.06) setCmd(1 - s.cmd);
        let iInf;
        if (s.cmd) {
          const d = (V.pwm && s.t - s.tCmd > 0.03) ? V.D / 100 : 1;
          iInf = d * VS / R; s.vNode = d * VS;
        } else if (s.i > 1e-7) { iInf = -Vc / R; s.vNode = -Vc; }
        else { iInf = 0; s.vNode = 0; s.i = 0; }
        s.i = iInf + (s.i - iInf) * Math.exp(-h / tau);
        if (!s.cmd && s.i < 0) s.i = 0;
        const vsw = VS - s.vNode;
        if (!s.cmd) s.vpkOff = Math.max(s.vpkOff, vsw);
        // the armature: pulls in above 60 % of the full current, drops out below 20 %
        if (!s.armOn && s.i >= 0.6 * Ifull) {
          s.armOn = true; s.pend = { at: s.t + 0.006, v: 1 };
          if (s.wait === 'pull') { s.pull = ms(s.t - s.tCmd); s.wait = 'pullV'; }
        } else if (s.armOn && s.i <= 0.2 * Ifull) {
          s.armOn = false; s.pend = { at: s.t + 0.008, v: 0 };
          if (s.cmd) s.drop = true;
          if (s.wait === 'rel') { s.rel = ms(s.t - s.tCmd); s.wait = 'relV'; }
        }
        if (s.pend && s.t >= s.pend.at) { s.vTarget = s.pend.v; s.pend = null; }
        s.arm += clamp((s.armOn ? 1 : 0) - s.arm, -h / 0.002, h / 0.002);
        s.valve += clamp(s.vTarget - s.valve, -h / 0.004, h / 0.004);
        if (s.wait === 'pullV' && s.valve >= 0.98) { s.pullV = ms(s.t - s.tCmd); s.wait = ''; }
        if (s.wait === 'relV' && s.valve <= 0.02) { s.relV = ms(s.t - s.tCmd); s.wait = ''; }
        s.t += h;
        s.tS += h;
        if (s.tS >= 1e-4) { s.tS = 0; s.hist.push([s.t * 1000, s.i * 1000, vsw]); }
      }
      const loop = kit.loop((dt) => {
        const R = VS * VS / V.P, Ifull = VS / R, tau = V.L / R;
        const sdt = Math.min(dt, 0.05) * V.slow, h = 2e-5;
        for (let k = 0, n = Math.round(sdt / h); k < n; k++) step(h);
        while (s.hist.length && s.hist[0][0] < s.t * 1000 - 240) s.hist.shift();
        s.vpk = s.vpkOff;
        const d = (s.cmd && V.pwm && s.t - s.tCmd > 0.03) ? V.D / 100 : (s.cmd ? 1 : 0);
        ro.set('R', num(R, 0) + ' Ω, ' + num(Ifull * 1000, 0) + ' mA');
        ro.set('tau', num(tau * 1000, 2) + ' ms');
        ro.set('pull', s.pull + ' / ' + s.pullV);
        ro.set('rel', s.drop ? 'dropped out while on!' : s.rel + ' / ' + s.relV);
        ro.set('vpk', num(s.vpk, 1) + ' V');
        ro.set('P', num(s.i * s.i * R, 2) + ' W' + (d > 0 && d < 1 ? ' (PWM ' + num(d * 100, 0) + ' %)' : ''));
        ro.set('E', num(0.5 * V.L * s.i * s.i * 1000, 2) + ' mJ');
        s.tP += dt;
        if (s.tP > 0.06 || !dt) {
          s.tP = 0;
          const h1 = thin(s.hist, 500), t0 = s.t * 1000 - 240;
          pI.set({ series: [{ pts: h1.map(q => [q[0], q[1]]), label: 'current' }], x: { label: 'time (ms)', min: t0, max: s.t * 1000 },
            hlines: [{ y: 600 * Ifull, label: 'pull-in' }, { y: 200 * Ifull, label: 'drop-out' }], y: { label: 'coil current (mA)', min: 0, max: Ifull * 1150 } });
          pV.set({ series: [{ pts: h1.map(q => [q[0], q[2]]), label: 'switch voltage', color: kit.colors().bad }], x: { label: 'time (ms)', min: t0, max: s.t * 1000 } });
        }
        // ---- drawing on a 760 × 350 design grid
        const c = st.begin(), C = kit.colors();
        design(st, c, 760, 350);
        const on = s.cmd === 1, live = C.ok;
        S.rail(c, 120, 52, '+24 V');
        S.switch(c, 120, 52, 120, 122, { closed: on, label: 'output', value: on ? 'on' : 'off' });
        S.wire(c, [[120, 122], [120, 134]]);
        S.node(c, 120, 134);
        S.wire(c, [[120, 134], [120, 150]]);
        S.inductor(c, 120, 150, 120, 250, { label: 'Y1', value: num(R, 0) + ' Ω', color: s.i > 1e-4 ? live : C.text });
        S.wire(c, [[120, 250], [120, 292]]); S.ground(c, 120, 292);
        // the suppressor branch
        const bx = 240;
        S.wire(c, [[120, 134], [bx, 134], [bx, 150]]); S.wire(c, [[bx, 250], [bx, 292], [120, 292]]); S.node(c, 120, 292);
        const sup = V.sup, bcol = (!on && s.i > 1e-4) ? live : C.text;
        if (sup === 0.8) S.diode(c, bx, 250, bx, 150, { color: bcol });
        else if (sup === 24.8 || sup === 36.8) {
          S.diode(c, bx, 150, bx, 198, { kind: 'zener', color: bcol }); S.wire(c, [[bx, 198], [bx, 204]], { color: bcol });
          S.diode(c, bx, 250, bx, 204, { color: bcol });
          kit.label(c, (sup === 24.8 ? 24 : 36) + ' V', bx + 22, 174, { size: 11, color: C.muted });
        } else if (sup === 50) {
          S.resistor(c, bx, 150, bx, 250, { iec: true, color: bcol }); c.strokeStyle = bcol; c.lineWidth = 1.5; c.beginPath(); c.moveTo(bx - 12, 222); c.lineTo(bx + 12, 178); c.stroke();
          kit.label(c, 'VDR', bx + 22, 200, { size: 11, color: C.muted });
        } else { S.wire(c, [[bx, 150], [bx, 176]]); S.wire(c, [[bx, 224], [bx, 250]]); kit.label(c, 'no', bx, 192, { align: 'center', size: 11, color: C.muted }); kit.label(c, 'suppressor', bx, 208, { align: 'center', size: 11, color: C.muted }); }
        // current dots: through the switch while on, round the coil and suppressor while decaying
        s.ph += dt * 90 * s.i / Math.max(1e-9, Ifull);
        if (s.i > Ifull * 0.01) {
          if (on) S.flow(c, [[120, 42], [120, 134], [120, 292]], s.ph, { color: C.accent });
          else if (sup < 250) S.flow(c, [[120, 134], [120, 292], [bx, 292], [bx, 134], [120, 134]], s.ph, { color: C.accent });
        }
        const vs = VS - s.vNode;
        kit.label(c, 'coil: ' + (s.vNode >= 0 ? '+' : '−') + num(Math.abs(s.vNode), 1) + ' V', 136, 146, { size: 12, color: s.vNode < -1 ? C.bad : C.text, weight: 600 });
        if (!on && vs > 100 && s.i > 1e-4) {                      // a spark across the open switch
          c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(112, 78); c.lineTo(128, 86); c.lineTo(114, 92); c.lineTo(130, 100); c.stroke();
          kit.label(c, num(vs, 0) + ' V!', 60, 88, { size: 13, color: C.bad, weight: 700 });
        }
        // the armature inside its coil
        const ax = 330, ay = 120;
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(ax, ay, 90, 44);
        for (let k = 0; k < 6; k++) { c.beginPath(); c.moveTo(ax + 8 + k * 13, ay); c.lineTo(ax + 14 + k * 13, ay + 44); c.strokeStyle = s.i > 1e-4 ? live : C.muted; c.lineWidth = 1.2; c.stroke(); }
        const px = ax + 22 - 16 * s.arm;
        c.fillStyle = C.surface; c.fillRect(px, ay + 12, 60, 20); c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(px, ay + 12, 60, 20);
        F.zigzag(c, px + 60, ay + 22, ax + 100, ay + 22, 5, 3, C.text);
        c.fillStyle = C.text; c.fillRect(ax - 10, ay + 10, 8, 24);
        kit.label(c, 'armature ' + (s.armOn ? 'pulled in' : 'released'), ax + 45, ay + 62, { align: 'center', size: 12, color: s.armOn ? C.ok : C.muted });
        kit.label(c, 'pilot seat ' + (s.arm > 0.5 ? 'open' : 'closed'), ax + 45, ay + 80, { align: 'center', size: 11, color: C.muted });
        // the valve it pilots
        const vv = F.valve(c, 610, 190, { spec: '5/2', state: 1 - s.valve, left: 'solenoid', right: 'spring', s: 34, pneumatic: true, labels: true, exhaust: 'silencer' });
        kit.label(c, 'Y1', vv.xl - 6, 172, { size: 11, weight: 700, color: s.armOn ? C.ok : C.muted, align: 'right' });
        const shifted = s.valve > 0.5;
        F.line(c, [vv.B, [vv.B[0], 110]], { state: shifted ? 'air' : 'exhaust' });
        F.line(c, [vv.A, [vv.A[0], 110]], { state: shifted ? 'exhaust' : 'air' });
        kit.label(c, 'to the cylinder', 610, 98, { align: 'center', size: 11, color: C.muted });
        F.line(c, [vv.P, [vv.P[0], 262]], { state: 'air' }); F.source(c, vv.P[0], 282, { pneumatic: true });
        kit.label(c, 'main spool ' + (s.valve > 0.98 ? 'switched' : s.valve < 0.02 ? 'at rest' : 'moving'), 610, 318, { align: 'center', size: 12, color: C.text });
        kit.label(c, 't = ' + num(s.t * 1000, 1) + ' ms', 750, 340, { size: 11, color: C.muted, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ep-ladder */
  const CT = (n, nc, tag) => ({ t: 'c', n, nc: !!nc, tag });
  const SER = (...a) => ({ t: 's', a }), PAR = (...a) => ({ t: 'p', a });
  const RUNGS = [
    { el: SER(CT('S0', true), PAR(CT('S1'), CT('K1'))), coil: 'K1', kind: 'relay' },
    { el: CT('B2'), coil: 'K3', kind: 'relay' },
    { el: SER(PAR(SER(PAR(CT('K1'), CT('S2')), CT('B1')), CT('K2', false, 'hold')), CT('K3', true)), coil: 'K2', kind: 'relay' },
    { el: CT('K2'), coil: 'Y1', kind: 'sol' },
    { el: CT('K1'), coil: 'H1', kind: 'lamp' }
  ];
  const size = e => {
    if (e.t === 'c') return { w: 1, h: 1 };
    const z = e.a.map(size);
    return e.t === 's' ? { w: z.reduce((a, b) => a + b.w, 0), h: Math.max(...z.map(q => q.h)) } : { w: Math.max(...z.map(q => q.w)), h: z.reduce((a, b) => a + b.h, 0) };
  };
  // contacts used, per coil, for the cross-reference under each coil
  const XREF = {};
  (function walk() {
    const add = (e, r) => { if (e.t === 'c') { if (/^K/.test(e.n)) (XREF[e.n] = XREF[e.n] || new Set()).add(r); } else e.a.forEach(x => add(x, r)); };
    RUNGS.forEach((g, i) => add(g.el, i + 1));
  })();

  Hyper.sim('ep-ladder', {
    title: 'A relay ladder that runs a cylinder',
    blurb: `The relay circuit of this page, live. Rung 1 is the self-holding start/stop circuit (K1); rung 2 turns the front reed switch B2 into a relay contact (K3); rung 3 holds the extend command K2 from the rear switch B1 until the front; rung 4 drives the valve solenoid Y1; rung 5 lights the running lamp. Closed contacts, live wires and energised coils are shown in **green**. The cylinder is simulated with its air (kit.fluid.pneuCylinder) through a single-solenoid 5/2 valve with spring return.

**Try this**
- Press **Start**: K1 holds itself, and the cylinder runs back and forth on its own. Watch B1 open as the piston leaves — only K2's self-holding contact keeps Y1 on.
- Press **Stop** in mid-stroke: the cylinder finishes its cycle and stops at the rear.
- **One cycle** (S2) runs a single stroke out and back.
- Choose the fault **K2 self-holding contact missing** and start: the cylinder only buzzes near the rear.
- **Stop circuit open** (a broken wire): the machine cannot be started at all — the fail-safe reason stop buttons are normally closed.
- **B2 out of position**: the cylinder extends and stays out, waiting for a signal that never comes.
- You can also click the buttons S0, S1 and S2 in the diagram.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'S1', label: 'Start (S1)', primary: true }, { id: 'S0', label: 'Stop (S0)' }, { id: 'S2', label: 'One cycle (S2)' }] },
        { id: 'fault', type: 'select', label: 'Fault', options: [['No fault', 0], ['K2 self-holding contact missing', 3], ['Stop circuit open (broken wire)', 2], ['B2 out of position (never switches)', 1]], value: 0 },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Half speed', 0.5], ['Slow motion ¼', 0.25]], value: 0.5 }
      ], (id) => { if (id === 'S0' || id === 'S1' || id === 'S2') press(id); loop.once(); });
      const ro = kit.readout(box.side, [['state', 'Machine'], ['rel', 'Relays K1 / K2 / K3'], ['io', 'Sensors B1 / B2, solenoid Y1'], ['n', 'Cycles'], ['tc', 'Last cycle time']]);
      const V = ctl.values;
      const cyl = F.pneuCylinder({ bore: 0.032, rod: 0.012, stroke: 0.15, mass: 1.5, psupply: 6e5 + PATM, patm: PATM, Cvalve: 1.0e-8, CthrottleA: 0.35e-8, CthrottleB: 0.35e-8, fc: 20 });
      const s = { held: { S0: 0, S1: 0, S2: 0 }, coil: {}, kc: { K1: false, K2: false, K3: false }, kt: { K1: 0, K2: 0, K3: 0 }, sig: {}, valveCmd: 0, vt: 0, valve: 0,
        n: 0, tLast: null, tc: '—', t: 0, prevB1: true, ph: {}, hits: [] };
      function press(id) { s.held[id] = 0.35; }
      const stroke = cyl.params.stroke;
      function signals() {
        const x = cyl.state.x, g = s.sig, f = V.fault;
        g.S0 = s.held.S0 > 0 || f === 2; g.S1 = s.held.S1 > 0; g.S2 = s.held.S2 > 0;
        g.B1 = x <= 0.004; g.B2 = f !== 1 && x >= stroke - 0.004;
      }
      const stateOf = n => /^K/.test(n) ? s.kc[n] : !!s.sig[n];
      const conducts = e => e.tag === 'hold' && V.fault === 3 ? false : (e.nc ? !stateOf(e.n) : stateOf(e.n));
      function evalEl(e) {
        if (e.t === 'c') return conducts(e);
        return e.t === 's' ? e.a.every(evalEl) : e.a.some(evalEl);
      }
      function logic(h) {
        signals();
        for (const r of RUNGS) s.coil[r.coil] = evalEl(r.el);
        for (const k of ['K1', 'K2', 'K3']) {                // operate 10 ms, release 6 ms
          if (s.coil[k] !== s.kc[k]) { s.kt[k] += h; if (s.kt[k] >= (s.coil[k] ? 0.010 : 0.006)) { s.kc[k] = s.coil[k]; s.kt[k] = 0; } } else s.kt[k] = 0;
        }
        // the valve: pilot and spool, 12 ms to switch, 20 ms to spring back
        if ((s.coil.Y1 ? 1 : 0) !== s.valveCmd) { s.vt += h; if (s.vt >= (s.coil.Y1 ? 0.012 : 0.020)) { s.valveCmd = s.coil.Y1 ? 1 : 0; s.vt = 0; } } else s.vt = 0;
        s.valve += clamp(s.valveCmd - s.valve, -h / 0.004, h / 0.004);
        if (s.sig.B1 && !s.prevB1) { s.n++; if (s.tLast != null) s.tc = num(s.t - s.tLast, 2) + ' s'; s.tLast = s.t; }
        s.prevB1 = s.sig.B1;
      }
      let hit = [], lastMap = null;
      kit.click(st, p => { if (!lastMap) return; const q = lastMap(p); for (const b of hit) if (Math.abs(q.x - b.x) < 22 && Math.abs(q.y - b.y) < 18) { press(b.n); loop.once(); } },
        p => { if (!lastMap) return false; const q = lastMap(p); return hit.some(b => Math.abs(q.x - b.x) < 22 && Math.abs(q.y - b.y) < 18); });
      const loop = kit.loop((dt) => {
        for (const k in s.held) s.held[k] = Math.max(0, s.held[k] - dt);
        const sdt = Math.min(dt, 0.05) * V.slow, h = 0.001;
        signals();
        for (let t = 0; t < sdt - 1e-9; t += h) { logic(h); cyl.step(h, s.valve > 0.5 ? 1 : 0); s.t += h; }
        if (!sdt) { signals(); for (const r of RUNGS) s.coil[r.coil] = evalEl(r.el); }
        const g = s.sig, K = s.kc;
        ro.set('state', V.fault === 2 && !K.K1 ? 'stop circuit open: cannot start' : K.K1 ? 'running — ' + (s.valve > 0.5 ? 'extending' : 'retracting') : (g.B1 ? 'stopped at the rear' : (s.valve > 0.5 ? 'stopping: extending' : 'stopping: retracting')));
        ro.set('rel', (K.K1 ? 'on' : 'off') + ' / ' + (K.K2 ? 'on' : 'off') + ' / ' + (K.K3 ? 'on' : 'off'));
        ro.set('io', (g.B1 ? 'closed' : 'open') + ' / ' + (g.B2 ? 'closed' : 'open') + ', ' + (s.coil.Y1 ? 'on' : 'off'));
        ro.set('n', String(s.n));
        ro.set('tc', s.tc);
        // ---- drawing on a 760 × 440 design grid
        const c = st.begin(), C = kit.colors();
        lastMap = design(st, c, 760, 440).map;
        hit = [];
        const XL = 40, XR = 392, CW = 46, RH = 30, live = C.ok, dead = C.muted;
        const ln = (pts, on) => { c.strokeStyle = on ? live : dead; c.lineWidth = on ? 2.2 : 1.6; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); };
        c.strokeStyle = live; c.lineWidth = 3; c.beginPath(); c.moveTo(XL, 30); c.lineTo(XL, 420); c.stroke();
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(XR, 30); c.lineTo(XR, 420); c.stroke();
        kit.label(c, '+24 V', XL, 18, { align: 'center', size: 12, weight: 700, color: live });
        kit.label(c, '0 V', XR, 18, { align: 'center', size: 12, weight: 700 });
        // draw an element with its top-left cell at (x, y); pin: powered from the left; returns powered at its right end
        function draw(e, x, y, pin) {
          const z = size(e), ym = y + RH / 2;
          if (e.t === 'c') {
            const cond = conducts(e), pout = pin && cond, xm = x + CW / 2;
            ln([[x, ym], [xm - 6, ym]], pin); ln([[xm + 6, ym], [x + CW, ym]], pout);
            c.strokeStyle = cond ? live : C.text; c.lineWidth = 2;
            c.beginPath(); c.moveTo(xm - 6, ym - 8); c.lineTo(xm - 6, ym + 8); c.moveTo(xm + 6, ym - 8); c.lineTo(xm + 6, ym + 8); c.stroke();
            if (e.nc) { c.beginPath(); c.moveTo(xm - 10, ym + 8); c.lineTo(xm + 10, ym - 8); c.stroke(); }
            if (cond) { c.fillStyle = live; c.globalAlpha = 0.35; c.fillRect(xm - 5, ym - 7, 10, 14); c.globalAlpha = 1; }
            const push = /^S/.test(e.n);
            kit.label(c, e.n + (e.tag === 'hold' && V.fault === 3 ? ' ✕' : ''), xm, ym - 13, { align: 'center', size: 10.5, weight: 700, color: push ? C.accent : C.text });
            if (push) hit.push({ n: e.n, x: xm, y: ym });
            return pout;
          }
          if (e.t === 's') { let p = pin, xx = x; for (const a of e.a) { p = draw(a, xx, y, p); xx += size(a).w * CW; } return p; }
          let yy = y, pout = false, last = ym;
          for (const a of e.a) {
            const za = size(a), yc = yy + RH / 2;
            const po = draw(a, x, yy, pin);
            if (za.w < z.w) ln([[x + za.w * CW, yc], [x + z.w * CW, yc]], po);
            pout = pout || po; last = yc; yy += za.h * RH;
          }
          ln([[x, ym], [x, last]], pin); ln([[x + z.w * CW, ym], [x + z.w * CW, last]], pout);
          return pout;
        }
        let y = 36;
        RUNGS.forEach((r, i) => {
          const z = size(r.el), ym = y + RH / 2;
          kit.label(c, String(i + 1), XL - 18, ym, { align: 'center', size: 11, color: C.muted });
          ln([[XL, ym], [XL + 6, ym]], true);
          const p = draw(r.el, XL + 6, y, true);
          const xc = XR - 58, on = !!s.coil[r.coil];
          ln([[XL + 6 + z.w * CW, ym], [xc - 12, ym]], p);
          if (r.kind === 'lamp') {
            if (on) { c.fillStyle = C.warn; c.globalAlpha = 0.5; c.beginPath(); c.arc(xc, ym, 15, 0, 7); c.fill(); c.globalAlpha = 1; }
            c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); c.arc(xc, ym, 10, 0, 7); c.stroke();
            c.beginPath(); c.moveTo(xc - 7, ym - 7); c.lineTo(xc + 7, ym + 7); c.moveTo(xc - 7, ym + 7); c.lineTo(xc + 7, ym - 7); c.stroke();
          } else {
            if (on) { c.fillStyle = live; c.globalAlpha = 0.3; c.fillRect(xc - 11, ym - 10, 22, 20); c.globalAlpha = 1; }
            c.strokeStyle = on ? live : C.text; c.lineWidth = 2;
            c.beginPath(); c.arc(xc + 6, ym, 12, Math.PI * 0.72, Math.PI * 1.28); c.stroke();
            c.beginPath(); c.arc(xc - 6, ym, 12, -Math.PI * 0.28, Math.PI * 0.28); c.stroke();
            if (r.kind === 'sol') { c.beginPath(); c.moveTo(xc - 5, ym + 6); c.lineTo(xc + 5, ym - 6); c.stroke(); }
          }
          ln([[xc + 12, ym], [XR, ym]], on);
          kit.label(c, r.coil, xc, ym - 18, { align: 'center', size: 11, weight: 700, color: on ? live : C.text });
          if (XREF[r.coil]) kit.label(c, 'contacts in ' + [...XREF[r.coil]].join(', '), xc - 20, ym + 20, { align: 'right', size: 9.5, color: C.muted });
          y += z.h * RH + 14;
        });
        // ---- the pneumatics
        const P = cyl.params, pA = cyl.state.pA - PATM, pB = cyl.state.pB - PATM, ext = s.valve > 0.5;
        const fillC = p => p > 0.2e5 ? (C.dark ? 'rgba(79,141,255,' : 'rgba(29,78,216,') + Math.min(0.5, 0.08 + 0.42 * p / 6e5) + ')' : null;
        const cy = S.cylinder(c, 440, 84, { len: 170, h: 34, rodLen: 110, pos: cyl.state.x / P.stroke, fillA: fillC(pA), fillB: fillC(pB) });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(cy.tip[0], 70, 24, 28); c.strokeRect(cy.tip[0], 70, 24, 28);
        const reed = (x, name, on) => {
          c.fillStyle = C.surface; c.fillRect(x - 10, 56, 20, 9); c.strokeStyle = C.text; c.lineWidth = 1.3; c.strokeRect(x - 10, 56, 20, 9);
          kit.dot(c, x + 5, 60.5, 3, on ? C.ok : C.surface, C.muted);
          kit.label(c, name, x, 46, { align: 'center', size: 11, weight: 700, color: on ? C.ok : C.text });
        };
        reed(452, 'B1', s.sig.B1); reed(V.fault === 1 ? 578 : 603, 'B2', s.sig.B2);
        if (V.fault === 1) kit.label(c, 'slipped', 578, 34, { align: 'center', size: 10, color: C.bad });
        const vv = S.valve(c, 560, 220, { spec: '5/2', state: 1 - s.valve, left: 'solenoid', right: 'spring', s: 30, pneumatic: true, labels: true, exhaust: 'silencer' });
        kit.label(c, 'Y1', vv.xl - 6, 202, { size: 11, weight: 700, color: s.coil.Y1 ? C.ok : C.muted, align: 'right' });
        const Lb = [vv.B, [vv.B[0], 146], [cy.A[0], 146], cy.A], La = [vv.A, [vv.A[0], 156], [cy.B[0], 156], cy.B];
        S.line(c, Lb, { state: ext ? 'air' : (pA > 0.2e5 ? 'exhaust' : 'idle') });
        S.line(c, La, { state: ext ? (pB > 0.2e5 ? 'exhaust' : 'idle') : 'air' });
        const Ls = [[430, 330], [430, 310]], Lm = [[526, 310], [560, 310], vv.P];
        S.line(c, Ls, { state: 'air' }); S.line(c, Lm, { state: 'air' });
        S.source(c, 430, 350, { pneumatic: true }); S.frl(c, 478, 310);
        const sp = Math.abs(cyl.state.v);
        if (sp > 0.01) {
          const adv = k => { s.ph[k] = (s.ph[k] || 0) + dt * 110 * sp; return s.ph[k]; };
          S.flow(c, ext ? Lb.slice().reverse() : La.slice().reverse(), adv('in'), { color: S.col('air') });
          S.flow(c, ext ? La : Lb, adv('out'), { color: S.col('exhaust') });
          S.flow(c, Ls.concat(Lm), adv('sup'), { color: S.col('air') });
        }
        kit.label(c, (pA / 1e5).toFixed(1) + ' bar', 470, 118, { size: 11, color: C.muted });
        kit.label(c, (pB / 1e5).toFixed(1) + ' bar', 560, 118, { size: 11, color: C.muted });
        kit.label(c, 'push-buttons S0, S1, S2 are clickable', 750, 430, { size: 10.5, color: C.muted, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  // a digital signal drawn from its edges [[t, value], ...] between t0 and t1
  function lane(c, edges, init, t0, t1, x0, x1, y, h, color, fill) {
    const X = t => x0 + (t - t0) / (t1 - t0) * (x1 - x0);
    let v = init, xs = x0;
    c.strokeStyle = color; c.lineWidth = 1.8; c.beginPath(); c.moveTo(x0, v ? y : y + h);
    const seg = (xa, xb, val) => { if (fill && val) { c.save(); c.fillStyle = fill; c.fillRect(xa, y, Math.max(0.8, xb - xa), h); c.restore(); } };
    for (const [t, val] of edges) {
      if (t < t0) { v = val; c.moveTo(x0, v ? y : y + h); continue; }
      if (t > t1) break;
      const x = X(t);
      seg(xs, x, v);
      c.lineTo(x, v ? y : y + h); c.lineTo(x, val ? y : y + h);
      v = val; xs = x;
    }
    seg(xs, x1, v);
    c.lineTo(x1, v ? y : y + h); c.stroke();
  }
  const initOf = (edges, t0, dflt) => { let v = dflt; for (const [t, val] of edges) { if (t >= t0) break; v = val; } return v; };

  /* ================================================================ ep-reed */
  const REED = { reed: { on: 6, hy: 2, bounce: true }, mr: { on: 3, hy: 1, bounce: false } };
  Hyper.sim('ep-reed', {
    title: 'A magnet passing the sensors',
    blurb: `A cylinder with a magnetic piston runs back and forth over a 200 mm stroke at constant speed. Three switches sit on its barrel: B1 at the rear, B3 at the front, and B2 in mid-stroke. A switch turns on when the magnet comes within its switching range and off a little later (hysteresis), so the pulse at B2 lasts about $w/v$. Below, B2's output is traced against time together with what a PLC's input image makes of it: the input is filtered (a new level is accepted only once it has been steady for the filter time) and read once per scan. Passes the PLC never sees are marked in **red**.

**Try this**
- Raise the speed until B2 passes are missed: compare the pulse length with the filter time plus one scan in the read-out.
- At high speed, shorten the scan or the filter: the same pulse is caught again.
- Switch to the magneto-resistive sensor: its switching range is half as long, so its pulses are half as long.
- Watch the reed switch's contact bounce in the inset as it closes: a short filter hides it from the program.
- Missed pulses come and go with the timing — the worst kind of fault to find on a machine.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'v', label: 'Piston speed', min: 0.05, max: 3, value: 0.8, unit: 'm/s', log: true, sig: 2 },
        { id: 'pos', label: 'Mid-stroke sensor B2 at', min: 30, max: 170, step: 1, value: 100, unit: 'mm' },
        { id: 'type', type: 'select', label: 'Sensor', options: [['Reed switch: range 12 mm, hysteresis 2 mm', 'reed'], ['Magneto-resistive: range 6 mm, hysteresis 1 mm', 'mr']], value: 'reed' },
        { id: 'ts', label: 'PLC scan time', min: 1, max: 50, value: 10, unit: 'ms', log: true, sig: 2 },
        { id: 'tf', label: 'PLC input filter', min: 0, max: 10, step: 0.5, value: 3, unit: 'ms' },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ⅕', 0.2], ['Slow motion 1/20', 0.05]], value: 0.2 }
      ], (id) => { if (id !== 'slow') reset(); loop.once(); });
      const ro = kit.readout(box.side, [['pulse', 'B2 pulse length'], ['need', 'Pulse the PLC is sure to see'], ['res', 'B2 passes seen by the PLC'], ['vmax', 'Fastest speed it is sure to see'], ['stroke', 'Stroke time']]);
      const V = ctl.values, STROKE = 0.2, DWELL = 0.15;
      let s;
      function reset() {
        const x = s ? s.x : 0, dir = s ? s.dir : 1, t = s ? s.t : 0;
        s = { t, x, vel: 0, dir, dwell: 0, raw: [x <= 0.006, false, x >= STROKE - 0.006], out: false, lastOut: false, tChange: t, filt: false, img: false, tOn: -1,
          nextScan: t + 0.0037, pulses: [], cur: null, seen: 0, missed: 0, eOut: [], eImg: [], scans: [], xs: [], tX: 0 };
      }
      reset();
      function step(h) {
        const P = REED[V.type], v = V.v, a = Math.max(2, v * v / (2 * 0.012)), ts = V.ts / 1000, tf = V.tf / 1000;
        // motion: accelerate, cruise, brake into the end; dwell; reverse
        if (s.dwell > 0) { s.dwell -= h; if (s.dwell <= 0) s.dir = -s.dir; s.vel = 0; }
        else {
          const rem = s.dir > 0 ? STROKE - s.x : s.x;
          if (s.vel * s.vel / (2 * a) >= rem) s.vel = Math.max(0.02, s.vel - a * h); else s.vel = Math.min(v, s.vel + a * h);
          s.x += s.dir * s.vel * h;
          if (s.x >= STROKE) { s.x = STROKE; s.dwell = DWELL; }
          if (s.x <= 0) { s.x = 0; s.dwell = DWELL; }
        }
        const xmm = s.x * 1000, pos = [0, V.pos, 200];
        for (let k = 0; k < 3; k++) {
          const d = Math.abs(xmm - pos[k]);
          if (!s.raw[k] && d <= P.on) {
            s.raw[k] = true;
            if (k === 1) { s.tOn = s.t; s.cur = { t0: s.t, t1: null, seen: false }; s.pulses.push(s.cur); }
          } else if (s.raw[k] && d > P.on + P.hy) {
            s.raw[k] = false;
            if (k === 1 && s.cur) s.cur.t1 = s.t;
          }
        }
        // the reed contact bounces as it closes
        let out = s.raw[1];
        if (out && P.bounce) { const u = (s.t - s.tOn) * 1000; if ((u >= 0.1 && u < 0.16) || (u >= 0.26 && u < 0.3)) out = false; }
        if (out !== s.lastOut) { s.lastOut = out; s.tChange = s.t; s.eOut.push([s.t, out]); }
        if (s.filt !== out && s.t - s.tChange >= tf - 1e-9) s.filt = out;
        if (s.t >= s.nextScan) {
          s.nextScan += ts; if (s.nextScan < s.t) s.nextScan = s.t + ts;
          s.scans.push(s.t);
          if (s.img !== s.filt) { s.img = s.filt; s.eImg.push([s.t, s.img]); }
          if (s.img && s.cur && !s.cur.seen) s.cur.seen = true;
        }
        if (s.cur && s.cur.t1 != null && !s.cur.done && (s.cur.seen || s.t > s.cur.t1 + tf + ts + 0.001)) { s.cur.done = true; if (s.cur.seen) s.seen++; else s.missed++; }
        s.t += h;
      }
      const loop = kit.loop((dt) => {
        const P = REED[V.type], v = V.v, a = Math.max(2, v * v / (2 * 0.012));
        const tStroke = STROKE / v + v / a, win = 2 * (tStroke + DWELL);
        const sdt = Math.min(dt, 0.05) * V.slow, h = 2e-5;
        for (let k = 0, n = Math.round(sdt / h); k < n; k++) step(h);
        s.tX += sdt;
        if (s.tX >= win / 700 || !s.xs.length) { s.tX = 0; s.xs.push([s.t, s.x * 1000]); }
        const t0 = s.t - win;
        const trim = arr => { while (arr.length > 2 && arr[1][0] < t0) arr.shift(); };
        trim(s.eOut); trim(s.eImg); trim(s.xs);
        while (s.scans.length && s.scans[0] < t0) s.scans.shift();
        while (s.pulses.length && s.pulses[0].t0 < t0 - 1) s.pulses.shift();
        const len = 2 * P.on + P.hy, tp = len / v, need = V.tf + V.ts;
        ro.set('pulse', num(tp, tp < 10 ? 1 : 0) + ' ms (' + len + ' mm at ' + num(v, 2) + ' m/s)');
        ro.set('need', num(need, 1) + ' ms (filter + one scan)');
        ro.set('res', s.seen + ' seen, ' + s.missed + ' missed');
        ro.set('vmax', num(len / need, 2) + ' m/s');
        ro.set('stroke', num(tStroke * 1000, 0) + ' ms');
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin(), C = kit.colors();
        design(st, c, 760, 420);
        const K = 2.6, X = mm => 84 + mm * K, bx0 = 60, bx1 = 640, by = 96, bh = 40;
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.strokeRect(bx0, by, bx1 - bx0, bh);
        c.fillStyle = C.text; c.fillRect(bx0, by, 8, bh); c.fillRect(bx1 - 8, by, 8, bh);
        const xp = X(s.x * 1000) - 7;
        // the magnet's field, faintly
        c.save(); c.globalAlpha = 0.14; c.fillStyle = C.accent; c.beginPath(); c.ellipse(xp + 7, by + bh / 2, 34, 36, 0, 0, 7); c.fill(); c.restore();
        c.fillStyle = C.surface; c.fillRect(xp + 14, by + bh / 2 - 5, 150, 10); c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(xp + 14, by + bh / 2 - 5, 150, 10);
        c.fillStyle = C.text; c.fillRect(xp, by + 1, 14, bh - 2);
        c.fillStyle = C.bad; c.fillRect(xp + 2, by + 4, 10, 6); c.fillStyle = C.accent; c.fillRect(xp + 2, by + bh - 10, 10, 6);
        kit.label(c, 'magnet', xp + 7, by + bh + 12, { align: 'center', size: 10.5, color: C.muted });
        const names = ['B1', 'B2', 'B3'], pos = [0, V.pos, 200];
        for (let k = 0; k < 3; k++) {
          const x = X(pos[k]);
          c.save(); c.globalAlpha = 0.25; c.fillStyle = C.ok; c.fillRect(X(pos[k] - P.on), by - 3, 2 * P.on * K, 3); c.restore();
          c.fillStyle = C.surface; c.fillRect(x - 13, by - 14, 26, 10); c.strokeStyle = C.text; c.lineWidth = 1.3; c.strokeRect(x - 13, by - 14, 26, 10);
          const on = k === 1 ? s.lastOut : s.raw[k];
          kit.dot(c, x + 7, by - 9, 3.2, on ? C.ok : C.surface, C.muted);
          kit.label(c, names[k], x, by - 24, { align: 'center', size: 11, weight: 700, color: on ? C.ok : C.text });
        }
        // inset: inside B2
        const ix = 470, iy = 8;
        kit.label(c, V.type === 'reed' ? 'inside B2: reed contact' : 'B2: magneto-resistive, no contact', ix, iy + 6, { size: 11, color: C.muted });
        if (V.type === 'reed') {
          c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.roundRect ? c.roundRect(ix, iy + 16, 150, 26, 12) : c.rect(ix, iy + 16, 150, 26); c.stroke();
          const cl = s.lastOut ? 0 : 5;
          c.strokeStyle = s.lastOut ? C.ok : C.text; c.lineWidth = 2.4;
          c.beginPath(); c.moveTo(ix - 12, iy + 29); c.lineTo(ix + 80, iy + 29 - cl); c.stroke();
          c.beginPath(); c.moveTo(ix + 162, iy + 29); c.lineTo(ix + 70, iy + 29 + cl); c.stroke();
          // the last closing, zoomed: 1 ms
          const zx = ix + 172, zw = 100;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(zx, iy + 14, zw, 30);
          c.strokeStyle = C.ok; c.lineWidth = 1.5; c.beginPath();
          const lev = u => (u < 0.1 || (u >= 0.16 && u < 0.26) || u >= 0.3) ? (u < 0 ? 0 : 1) : 0;
          for (let k = 0; k <= 200; k++) { const u = -0.2 + k / 200 * 1.0, yv = iy + 40 - 22 * (u < 0 ? 0 : lev(u)); k ? c.lineTo(zx + k / 200 * zw, yv) : c.moveTo(zx, yv); }
          c.stroke();
          kit.label(c, '1 ms: bounce', zx + zw / 2, iy + 52, { align: 'center', size: 9.5, color: C.muted });
        } else {
          c.fillStyle = C.surface; c.fillRect(ix, iy + 18, 60, 22); c.strokeStyle = C.text; c.lineWidth = 1.3; c.strokeRect(ix, iy + 18, 60, 22);
          kit.label(c, 'PNP output: clean edges', ix + 70, iy + 29, { size: 11, color: s.lastOut ? C.ok : C.text });
        }
        // ---- timing diagram
        const x0 = 96, x1 = 748, T = t => x0 + (t - t0) / win * (x1 - x0);
        kit.label(c, 'piston', 12, 200, { size: 11, color: C.muted });
        kit.label(c, 'B2 output', 12, 276, { size: 11, color: C.muted });
        kit.label(c, 'PLC sees', 12, 322, { size: 11, color: C.muted });
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(x0, 168, x1 - x0, 64);
        const yB2 = 232 - V.pos / 200 * 64;
        c.setLineDash([4, 4]); c.beginPath(); c.moveTo(x0, yB2); c.lineTo(x1, yB2); c.stroke(); c.setLineDash([]);
        kit.label(c, 'B2', x1 + 2, yB2, { size: 9.5, color: C.muted });
        c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
        s.xs.forEach((q, i) => { const px = T(q[0]), py = 232 - q[1] / 200 * 64; i ? c.lineTo(px, py) : c.moveTo(px, py); });
        c.stroke();
        const ok = C.ok, fillOk = C.dark ? 'rgba(34,179,122,.25)' : 'rgba(18,146,90,.18)';
        lane(c, s.eOut, initOf(s.eOut, t0, false), t0, s.t, x0, x1, 266, 20, ok, fillOk);
        lane(c, s.eImg, initOf(s.eImg, t0, false), t0, s.t, x0, x1, 312, 20, C.accent, C.dark ? 'rgba(79,141,255,.25)' : 'rgba(29,78,216,.15)');
        c.strokeStyle = C.muted; c.lineWidth = 1;
        if (s.scans.length < 400) { c.beginPath(); for (const ts of s.scans) { const px = T(ts); c.moveTo(px, 334); c.lineTo(px, 340); } c.stroke(); }
        kit.label(c, s.scans.length < 400 ? 'ticks: input reads, one per scan' : 'input reads too dense to draw', x0, 352, { size: 10, color: C.muted });
        for (const p of s.pulses) if (p.done && !p.seen && p.t0 >= t0) {
          const px = T(p.t0);
          c.strokeStyle = C.bad; c.lineWidth = 1.5; c.strokeRect(px - 4, 262, Math.max(8, T(p.t1) - px + 8), 74);
          kit.label(c, 'missed', px, 256, { size: 10.5, weight: 700, color: C.bad });
        }
        kit.label(c, '← ' + num(win, 2) + ' s', x0, 380, { size: 10.5, color: C.muted });
        kit.label(c, 'now', x1, 380, { size: 10.5, color: C.muted, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ep-plc-scan */
  const PH = [['read inputs', 0, 0.1], ['run program', 0.1, 0.6], ['write outputs', 0.6, 0.7], ['communicate', 0.7, 1]];
  const INS = ['st', 'a0', 'a1', 'b0', 'b1'], INN = ['Start', 'a0', 'a1', 'b0', 'b1'], INA = ['I0.0', 'I0.1', 'I0.2', 'I0.3', 'I0.4'];
  const OUTS = ['Y1', 'Y3', 'Y2', 'Y4'], OUTN = ['Y1 A+', 'Y3 B+', 'Y2 A−', 'Y4 B−'], OUTA = ['Q0.0', 'Q0.2', 'Q0.1', 'Q0.3'];
  Hyper.sim('ep-plc-scan', {
    title: 'Inside a PLC scan: A+ B+ A− B−',
    blurb: `Two cylinders with double-solenoid 5/2 valves and four end-position sensors, run by a PLC through the sequence A+ B+ A− B−. The dial shows where the controller is in its scan: it copies the input terminals into the **input image**, runs the step program on that image, copies the **output image** to the terminals, then communicates. The chart in the middle is the program: five steps, each with its action and the condition that leads to the next. The timeline below shows, for each sensor, the terminal (line) and what the program sees (band), and the outputs as written to the terminals. Inputs pass a 3 ms filter; valves switch 15 ms after their coil.

**Try this**
- Press **Start** in slow motion and follow one transition: a1 closes, waits for the next input read, the program moves to step 2 and writes Y3 at the end of the scan, and 15 ms later valve B switches.
- Raise the scan time to 100 ms or more: every step now waits visibly, and the cycle time grows — read "time lost to the controls".
- At 1–10 ms the scan is a small part of each step: the air, not the PLC, sets the pace.
- Tick **Repeat** for a continuous cycle; untick it to stop at the end of the cycle.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320, maxH: 580 });
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'start', label: 'Start', primary: true }] },
        { id: 'cont', type: 'check', label: 'Repeat (continuous cycle)', value: false },
        { id: 'ts', label: 'Scan time', min: 1, max: 200, value: 10, unit: 'ms', log: true, sig: 2 },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ⅕', 0.2], ['Slow motion 1/20', 0.05]], value: 0.2 }
      ], (id) => { if (id === 'start') s.startHold = Math.max(0.3, 2.5 * V.ts / 1000); loop.once(); });
      const ro = kit.readout(box.side, [['step', 'Active step'], ['chain', 'Last transition: seen / output / valve'], ['cyc', 'Last cycle time'], ['lost', 'Time lost to the controls, per cycle'], ['scan', 'Scans per cycle']]);
      const V = ctl.values;
      const mk = () => F.pneuCylinder({ bore: 0.025, rod: 0.01, stroke: 0.1, mass: 0.8, psupply: 6e5 + PATM, patm: PATM, Cvalve: 0.6e-8, CthrottleA: 0.3e-8, CthrottleB: 0.3e-8, fc: 15 });
      const cA = mk(), cB = mk();
      const s = { t: 0, scanStart: 0, nextScan: 0, prog: true, out: true, step: 0, startHold: 0,
        term: { st: false, a0: true, a1: false, b0: true, b1: false }, filt: {}, tch: {}, img: {}, oImg: { Y1: false, Y2: false, Y3: false, Y4: false }, oTerm: { Y1: false, Y2: false, Y3: false, Y4: false },
        vA: 0, vB: 0, tvA: 0, tvB: 0, hist: [], tH: 0, scans: [], ev: null, chain: '—', cycStart: null, cyc: '—', lostNow: 0, lost: '—', nScan: 0, scanCyc: '—', ph: {} };
      for (const k of INS) { s.filt[k] = s.term[k]; s.tch[k] = 0; s.img[k] = s.term[k]; }
      const TF = 0.003, TV = 0.015;
      const ms = x => num(x * 1000, 0) + ' ms';
      function program(I, O) {
        const cont = V.cont;
        if (s.step === 0 && I.st && I.a0 && I.b0) { s.step = 1; s.cycStart = s.t; s.lostNow = 0; s.nScan = 0; }
        else if (s.step === 1 && I.a1) s.step = 2;
        else if (s.step === 2 && I.b1) s.step = 3;
        else if (s.step === 3 && I.a0) s.step = 4;
        else if (s.step === 4 && I.b0) {
          if (s.cycStart != null) { s.cyc = num(s.t - s.cycStart, 2) + ' s'; s.lost = ms(s.lostNow); s.scanCyc = String(s.nScan); }
          if (cont) { s.step = 1; s.cycStart = s.t; s.lostNow = 0; s.nScan = 0; } else s.step = 0;
        }
        O.Y1 = s.step === 1; O.Y3 = s.step === 2; O.Y2 = s.step === 3; O.Y4 = s.step === 4;
      }
      function tick(h) {
        const ts = V.ts / 1000;
        s.startHold = Math.max(0, s.startHold - h);
        const xA = cA.state.x, xB = cB.state.x, L = cA.params.stroke;
        const nt = { st: s.startHold > 0, a0: xA <= 0.001, a1: xA >= L - 0.001, b0: xB <= 0.001, b1: xB >= L - 0.001 };
        for (const k of INS) {
          if (nt[k] !== s.term[k]) { s.term[k] = nt[k]; s.tch[k] = s.t; if (nt[k] && k !== 'st' && !s.ev && s.step > 0) s.ev = { n: k, t0: s.t }; }
          if (s.filt[k] !== s.term[k] && s.t - s.tch[k] >= TF) s.filt[k] = s.term[k];
        }
        if (s.t >= s.nextScan) {
          s.scanStart = s.t; s.nextScan = s.t + ts; s.prog = false; s.out = false; s.scans.push(s.t); s.nScan++;
          for (const k of INS) s.img[k] = s.filt[k];
          if (s.ev && s.ev.t1 == null && s.img[s.ev.n]) s.ev.t1 = s.t;
        }
        if (!s.prog && s.t >= s.scanStart + 0.6 * ts) { s.prog = true; program(s.img, s.oImg); }
        if (!s.out && s.t >= s.scanStart + 0.7 * ts) {
          s.out = true;
          let changed = false;
          for (const k of OUTS) { if (s.oTerm[k] !== s.oImg[k]) changed = true; s.oTerm[k] = s.oImg[k]; }
          if (changed && s.ev && s.ev.t1 != null && s.ev.t2 == null) s.ev.t2 = s.t;
        }
        // double-solenoid valves: switch 15 ms after one coil alone is energised; otherwise stay (memory)
        const want = (pos, neg, cur) => pos && !neg ? 1 : neg && !pos ? 0 : cur;
        const wA = want(s.oTerm.Y1, s.oTerm.Y2, s.vA), wB = want(s.oTerm.Y3, s.oTerm.Y4, s.vB);
        if (wA !== s.vA) { s.tvA += h; if (s.tvA >= TV) { s.vA = wA; s.tvA = 0; if (s.ev && s.ev.t2 != null) fin(); } } else s.tvA = 0;
        if (wB !== s.vB) { s.tvB += h; if (s.tvB >= TV) { s.vB = wB; s.tvB = 0; if (s.ev && s.ev.t2 != null) fin(); } } else s.tvB = 0;
        cA.step(h, s.vA); cB.step(h, s.vB);
        s.t += h;
      }
      function fin() {
        const e = s.ev;
        s.chain = e.n + ': +' + ms(e.t1 - e.t0) + ' / +' + ms(e.t2 - e.t0) + ' / +' + ms(s.t - e.t0);
        s.lostNow += s.t - e.t0;
        s.ev = null;
      }
      const loop = kit.loop((dt) => {
        const sdt = Math.min(dt, 0.05) * V.slow, h = 5e-4;
        for (let k = 0, n = Math.round(sdt / h); k < n; k++) {
          tick(h);
          s.tH += h;
          if (s.tH >= 1e-3) {
            s.tH = 0;
            let b = 0;
            INS.slice(1).forEach((k2, i) => { if (s.term[k2]) b |= 1 << i; if (s.img[k2]) b |= 1 << (4 + i); });
            OUTS.forEach((k2, i) => { if (s.oTerm[k2]) b |= 1 << (8 + i); });
            s.hist.push([s.t, b]);
          }
        }
        const win = clamp(0.5 + 6 * V.ts / 1000, 0.5, 2.5), t0 = s.t - win;
        while (s.hist.length && s.hist[0][0] < t0) s.hist.shift();
        while (s.scans.length && s.scans[0] < t0) s.scans.shift();
        ro.set('step', s.step + (s.step ? ' — ' + ['', 'A+', 'B+', 'A−', 'B−'][s.step] : ' (waiting for Start)'));
        ro.set('chain', s.chain);
        ro.set('cyc', s.cyc); ro.set('lost', s.lost); ro.set('scan', s.scanCyc);
        // ---- drawing on a 760 × 460 design grid
        const c = st.begin(), C = kit.colors();
        design(st, c, 760, 460);
        const ts = V.ts / 1000, phase = clamp((s.t - s.scanStart) / ts, 0, 1);
        // the scan dial
        const wx = 72, wy = 96, wr = 46, pcol = [C.accent, C.series[2], C.series[1], C.muted];
        PH.forEach(([name, a0, a1], i) => {
          const act = phase >= a0 && phase < a1;
          c.save(); c.globalAlpha = act ? 0.85 : 0.22; c.fillStyle = pcol[i];
          c.beginPath(); c.moveTo(wx, wy); c.arc(wx, wy, wr, -Math.PI / 2 + a0 * 2 * Math.PI, -Math.PI / 2 + a1 * 2 * Math.PI); c.closePath(); c.fill(); c.restore();
        });
        const pa = -Math.PI / 2 + phase * 2 * Math.PI;
        c.strokeStyle = C.text; c.lineWidth = 2.4; c.beginPath(); c.moveTo(wx, wy); c.lineTo(wx + (wr + 6) * Math.cos(pa), wy + (wr + 6) * Math.sin(pa)); c.stroke();
        kit.dot(c, wx, wy, 4, C.text);
        const cur = PH.find(p => phase >= p[1] && phase < p[2]) || PH[3];
        kit.label(c, 'scan ' + num(V.ts, V.ts < 10 ? 1 : 0) + ' ms', wx, wy - wr - 16, { align: 'center', size: 12, weight: 700 });
        kit.label(c, cur[0], wx, wy + wr + 14, { align: 'center', size: 11.5, color: pcol[PH.indexOf(cur)], weight: 700 });
        // process images
        const tx = 136;
        kit.label(c, 'input', tx + 58, 20, { align: 'center', size: 10, color: C.muted }); kit.label(c, 'term.', tx + 58, 32, { align: 'center', size: 10, color: C.muted }); kit.label(c, 'image', tx + 88, 32, { align: 'center', size: 10, color: C.muted });
        INS.forEach((k, i) => {
          const y = 48 + i * 17;
          kit.label(c, INA[i] + ' ' + INN[i], tx - 4, y, { size: 10.5 });
          kit.dot(c, tx + 58, y, 5, s.term[k] ? C.ok : C.surface, C.muted);
          kit.dot(c, tx + 88, y, 5, s.img[k] ? C.accent : C.surface, C.muted);
        });
        kit.label(c, 'output', tx + 58, 142, { align: 'center', size: 10, color: C.muted }); kit.label(c, 'image', tx + 58, 154, { align: 'center', size: 10, color: C.muted }); kit.label(c, 'term.', tx + 88, 154, { align: 'center', size: 10, color: C.muted });
        OUTS.forEach((k, i) => {
          const y = 170 + i * 17;
          kit.label(c, OUTA[i] + ' ' + OUTN[i], tx - 4, y, { size: 10.5 });
          kit.dot(c, tx + 58, y, 5, s.oImg[k] ? C.accent : C.surface, C.muted);
          kit.dot(c, tx + 88, y, 5, s.oTerm[k] ? C.ok : C.surface, C.muted);
        });
        // the step chart (SFC)
        const sx = 262, stepY = i => 22 + i * 52, ACT = ['', 'Y1: A+', 'Y3: B+', 'Y2: A−', 'Y4: B−'], TR = ['Start · a0 · b0', 'a1', 'b1', 'a0', 'b0'];
        c.strokeStyle = C.text; c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(sx + 16, stepY(0) + 22); c.lineTo(sx + 16, stepY(4) + 22 + 18); c.lineTo(sx - 8, stepY(4) + 40); c.lineTo(sx - 8, stepY(0) - 8); c.lineTo(sx + 16, stepY(0) - 8); c.lineTo(sx + 16, stepY(0)); c.stroke();
        for (let i = 0; i < 5; i++) {
          const y = stepY(i), act = s.step === i;
          c.fillStyle = act ? C.accent : C.surface; c.fillRect(sx, y, 32, 22); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(sx, y, 32, 22);
          if (i === 0) c.strokeRect(sx + 3, y + 3, 26, 16);
          kit.label(c, String(i), sx + 16, y + 11, { align: 'center', size: 12, weight: 700, color: act ? C.bg2 : C.text });
          if (i) { c.beginPath(); c.moveTo(sx + 32, y + 11); c.lineTo(sx + 44, y + 11); c.stroke(); c.strokeRect(sx + 44, y + 1, 62, 20); kit.label(c, ACT[i], sx + 75, y + 11, { align: 'center', size: 10.5, color: act ? C.ok : C.text, weight: act ? 700 : 500 }); }
          const ty = y + 36;
          c.lineWidth = 2.4; c.beginPath(); c.moveTo(sx + 8, ty); c.lineTo(sx + 24, ty); c.stroke();
          kit.label(c, TR[i], sx + 30, ty, { size: 10, color: C.muted });
        }
        // the machine
        const P = cA.params;
        const drawAxis = (cyl, y, name, v, on1, on2, sens0, sens1) => {
          const pA = cyl.state.pA - PATM, pB = cyl.state.pB - PATM;
          const cy = S.cylinder(c, 470, y, { len: 150, h: 26, rodLen: 88, pos: cyl.state.x / P.stroke });
          kit.label(c, name, 458, y, { align: 'right', size: 13, weight: 700 });
          const rs = (x, n, on) => { c.fillStyle = C.surface; c.fillRect(x - 8, y - 22, 16, 7); c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(x - 8, y - 22, 16, 7); kit.dot(c, x + 4, y - 18.5, 2.5, on ? C.ok : C.surface, C.muted); kit.label(c, n, x, y - 30, { align: 'center', size: 10, weight: 700, color: on ? C.ok : C.text }); };
          rs(480, sens0[0], sens0[1]); rs(608, sens1[0], sens1[1]);
          const vv = S.valve(c, 560, y + 68, { spec: '5/2', state: 1 - v, left: 'solenoid', right: 'solenoid', s: 22, pneumatic: true, exhaust: 'silencer' });
          kit.label(c, on1[0], vv.xl - 4, y + 56, { size: 9.5, weight: 700, align: 'right', color: on1[1] ? C.ok : C.muted });
          kit.label(c, on2[0], vv.xr + 4, y + 56, { size: 9.5, weight: 700, color: on2[1] ? C.ok : C.muted });
          const L1 = [vv.B, [vv.B[0], y + 30], [cy.A[0], y + 30], cy.A], L2 = [vv.A, [vv.A[0], y + 36], [cy.B[0], y + 36], cy.B];
          S.line(c, L1, { state: v ? 'air' : (pA > 0.2e5 ? 'exhaust' : 'idle') });
          S.line(c, L2, { state: v ? (pB > 0.2e5 ? 'exhaust' : 'idle') : 'air' });
          S.source(c, vv.P[0] + 40, y + 110, { pneumatic: true }); S.line(c, [[vv.P[0] + 40, y + 100], [vv.P[0] + 40, vv.P[1]], vv.P], { state: 'air' });
          const sp = Math.abs(cyl.state.v);
          if (sp > 0.01) { s.ph[name] = (s.ph[name] || 0) + dt * 120 * sp; S.flow(c, v ? L1.slice().reverse() : L2.slice().reverse(), s.ph[name], { color: S.col('air') }); }
        };
        drawAxis(cA, 50, 'A', s.vA, ['Y1', s.oTerm.Y1], ['Y2', s.oTerm.Y2], ['a0', s.term.a0], ['a1', s.term.a1]);
        drawAxis(cB, 186, 'B', s.vB, ['Y3', s.oTerm.Y3], ['Y4', s.oTerm.Y4], ['b0', s.term.b0], ['b1', s.term.b1]);
        // ---- the timeline
        const x0 = 72, x1 = 748, top = 322, lh = 15, T = t => x0 + (t - t0) / win * (x1 - x0);
        const names = ['a0', 'a1', 'b0', 'b1', 'A+ Y1', 'B+ Y3', 'A− Y2', 'B− Y4'];
        c.strokeStyle = C.grid; c.lineWidth = 1;
        if (s.scans.length < 250) { c.beginPath(); for (const q of s.scans) { const px = T(q); c.moveTo(px, top - 4); c.lineTo(px, top + 8 * lh); } c.stroke(); }
        names.forEach((n, i) => {
          const y = top + i * lh;
          kit.label(c, n, 10, y + lh / 2, { size: 10, color: i < 4 ? C.text : C.muted });
          const bitT = i < 4 ? i : 8 + (i - 4), bitI = 4 + i;
          if (i < 4) {
            c.fillStyle = C.dark ? 'rgba(79,141,255,.35)' : 'rgba(29,78,216,.22)';
            let startX = null;
            s.hist.forEach((q, j) => {
              const on = (q[1] >> bitI) & 1, px = T(q[0]);
              if (on && startX == null) startX = px;
              if ((!on || j === s.hist.length - 1) && startX != null) { c.fillRect(startX, y + 2, Math.max(1, px - startX), lh - 4); startX = null; }
            });
          }
          c.strokeStyle = i < 4 ? C.ok : C.warn; c.lineWidth = 1.5; c.beginPath();
          s.hist.forEach((q, j) => { const on = (q[1] >> bitT) & 1, px = T(q[0]), py = on ? y + 2 : y + lh - 2; j ? c.lineTo(px, py) : c.moveTo(px, py); });
          c.stroke();
        });
        kit.label(c, (s.scans.length < 250 ? 'grey ticks: scans · ' : '') + 'line: terminal · band: input image · last ' + num(win, 2) + ' s', x0, top + 8 * lh + 10, { size: 10, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  // mass flow through a restriction by ISO 6358, zero if there is no pressure drop
  const q6358 = (F, C, b, p1, p2) => (C > 0 && p1 > p2) ? F.iso6358({ C, b, p1, p2, T1: TREF }).mdot : 0;

  /* ================================================================ ep-prop-reg */
  Hyper.sim('ep-prop-reg', {
    title: 'A proportional pressure regulator, step by step',
    blurb: `A small proportional regulator for 0–6 bar, fed at 8 bar gauge: a pressure sensor, a controller (proportional plus integral, with a dead band of ±0.01 bar) and two 2/2 pilot-sized valves — **fill** from the supply, **vent** to atmosphere — with a sonic conductance of up to 1.5 dm³/(s·bar) each. The valves react 4 ms after the controller and the sensor has a 3 ms lag. The outlet feeds a volume (tubes and a cylinder chamber); the pressure in it follows the air flowing in and out (polytropic, n = 1.2). Larger regulators use the same loop to pilot a main stage.

**Try this**
- Watch a 1 → 5 bar step: the outlet rises at a steady rate while the fill flow is choked, then slows as it nears the set-point.
- Make the volume ten times larger: the response is ten times slower. Make it tiny (0.05 L): the dead time now matters and the pressure overshoots.
- Raise the gain: faster at first, then overshoot and ringing — at the smallest volumes the pressure never settles.
- Add a consumer: the controller holds the pressure by keeping the fill valve partly open; the integral action removes the offset.
- Read the force this pressure gives on a 50 mm cylinder: that is what a controller programs.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250 });
      const [g1] = graphs(box, 1);
      const pl = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'gauge pressure (bar)', min: 0, max: 6.5 }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Set-point', options: [['Steps 1 ↔ 5 bar every 1.5 s', 'steps'], ['Slow ramp up and down', 'ramp'], ['The slider below', 'hold']], value: 'steps' },
        { id: 'U', label: 'Set-point voltage (0–10 V = 0–6 bar)', min: 0, max: 10, step: 0.05, value: 5, unit: 'V' },
        { id: 'V', label: 'Volume fed', min: 0.05, max: 5, value: 0.5, unit: 'L', log: true, sig: 2 },
        { id: 'K', label: 'Controller gain', min: 0.2, max: 20, value: 2, unit: 'per bar', log: true, sig: 2 },
        { id: 'bleed', type: 'select', label: 'Air taken downstream', options: [['None', 0], ['Small bleed, C = 0.05 dm³/(s·bar)', 0.05], ['Large bleed, C = 0.3 dm³/(s·bar)', 0.3]], value: 0 },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25]], value: 1 }
      ], (id) => { if (id === 'U' && V.mode !== 'hold') ctl.set('mode', 'hold'); loop.once(); });
      const ro = kit.readout(box.side, [['w', 'Set-point'], ['p', 'Outlet pressure'], ['rise', 'Last step: rise time 10–90 %'], ['os', 'Last step: overshoot'], ['set', 'Last step: within ±0.06 bar after'], ['F', 'Force on a 50 mm cylinder']]);
      const V = ctl.values, PS = 8e5 + PATM, CV = 1.5e-8, B = 0.3, N = 1.2, TI = 0.15;
      const s = { t: 0, p: PATM + 1e5, pm: PATM + 1e5, I: 0, u: 0, buf: [], hist: [], tH: 0, w: 1, step: null, rise: '—', os: '—', set: '—', ph: {} };
      function setpoint(t) {
        if (V.mode === 'steps') return (Math.floor(t / 1.5) % 2) ? 5 : 1;
        if (V.mode === 'ramp') { const q = (t % 8) / 8; return 0.5 + 5 * (q < 0.5 ? 2 * q : 2 - 2 * q); }
        return 6 * V.U / 10;
      }
      function step(h) {
        const w = setpoint(s.t), Vm = V.V * 1e-3;
        if (Math.abs(w - s.w) > 0.3) s.step = { t0: s.t, p0: (s.pm - PATM) / 1e5, w, t10: null, t90: null, max: -1e9, exit: s.t };
        s.w = w;
        s.pm += (s.p - s.pm) * h / 0.003;                       // the sensor
        const e = w - (s.pm - PATM) / 1e5;
        if (Math.abs(e) > 0.01) s.I = clamp(s.I + V.K / TI * e * h, -0.5, 0.5);
        const uc = Math.abs(e) > 0.01 ? clamp(V.K * e + s.I, -1, 1) : 0;
        s.buf.push(uc); s.u = s.buf.length > 40 ? s.buf.shift() : 0;   // 4 ms before the valves respond
        const mIn = q6358(F, CV * Math.max(0, s.u), B, PS, s.p), mOut = q6358(F, CV * Math.max(0, -s.u), B, s.p, PATM), mB = q6358(F, V.bleed * 1e-8, 0.5, s.p, PATM);
        s.p = clamp(s.p + h * N * RAIR * TREF * (mIn - mOut - mB) / Vm, PATM, PS);
        s.t += h;
        const g = s.step, pg = (s.p - PATM) / 1e5;
        if (g) {
          const d = g.w - g.p0, fr = (pg - g.p0) / d;
          if (g.t10 == null && fr >= 0.1) g.t10 = s.t;
          if (g.t90 == null && fr >= 0.9) { g.t90 = s.t; s.rise = num((g.t90 - g.t10) * 1000, 0) + ' ms'; }
          g.max = Math.max(g.max, fr);
          s.os = num(Math.max(0, g.max - 1) * 100, 1) + ' %';
          if (Math.abs(pg - g.w) > 0.06) { g.exit = s.t; s.set = '…'; } else if (s.t - g.exit > 0.2) s.set = num((g.exit - g.t0) * 1000, 0) + ' ms';
        }
      }
      const loop = kit.loop((dt) => {
        const sdt = Math.min(dt, 0.05) * V.slow, h = 1e-4;
        for (let k = 0, n = Math.round(sdt / h); k < n; k++) {
          step(h);
          s.tH += h; if (s.tH >= 0.005) { s.tH = 0; s.hist.push([s.t, s.w, (s.p - PATM) / 1e5, s.u]); }
        }
        while (s.hist.length && s.hist[0][0] < s.t - 4) s.hist.shift();
        const pg = (s.p - PATM) / 1e5, A50 = Math.PI * 0.05 * 0.05 / 4;
        ro.set('w', num(s.w / 6 * 10, 2) + ' V → ' + num(s.w, 2) + ' bar');
        ro.set('p', num(pg, 2) + ' bar (error ' + num(s.w - pg, 2) + ')');
        ro.set('rise', s.rise); ro.set('os', s.os); ro.set('set', s.set);
        ro.set('F', num(Math.max(0, pg) * 1e5 * A50, 0) + ' N');
        const h1 = thin(s.hist, 500);
        pl.set({ series: [{ pts: h1.map(q => [q[0], q[1]]), label: 'set-point', dash: [5, 4] }, { pts: h1.map(q => [q[0], q[2]]), label: 'outlet pressure' }],
          x: { label: 'time (s)', min: Math.max(0, s.t - 4), max: Math.max(4, s.t) } });
        // ---- drawing on a 760 × 310 design grid
        const c = st.begin(), C = kit.colors();
        design(st, c, 760, 310);
        const fillO = clamp(s.u, 0, 1), ventO = clamp(-s.u, 0, 1);
        // controller and set-point
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(40, 24, 120, 46);
        kit.label(c, 'controller', 100, 40, { align: 'center', size: 12, weight: 700 });
        kit.label(c, 'PI, ±0.01 bar', 100, 57, { align: 'center', size: 10.5, color: C.muted });
        kit.arrow(c, 4, 47, 38, 47, C.accent, 1.8);
        kit.label(c, 'w', 10, 36, { size: 12, weight: 700, color: C.accent });
        // valves
        const fv = S.valve(c, 210, 196, { spec: '2/2 NC', state: 1 - fillO, left: 'solenoid', right: 'spring', s: 30, pneumatic: true, labels: true });
        const vv = S.valve(c, 340, 62, { spec: '2/2 NC', state: 1 - ventO, left: 'solenoid', right: 'spring', s: 30, pneumatic: true, labels: true });
        kit.label(c, 'fill', fv.xr + 10, 196, { size: 11, weight: 700, color: fillO > 0.02 ? C.ok : C.muted });
        kit.label(c, 'vent', vv.xr + 10, 62, { size: 11, weight: 700, color: ventO > 0.02 ? C.ok : C.muted });
        S.exhaust(c, vv.A[0], vv.A[1], { rot: 180 });
        const pil = st2 => ({ state: 'pilot', color: st2 ? C.ok : C.muted });
        S.line(c, [[100, 70], [100, 196], [fv.xl, 196]], pil(fillO > 0.02));
        S.line(c, [[130, 70], [130, 62], [vv.xl, 62]], pil(ventO > 0.02));
        // supply, outlet header, sensor, bleed, volume
        const hdr = 120, Ls = [[80, 268], [80, 250], [210, 250], fv.P];
        S.source(c, 80, 288, { pneumatic: true });
        S.line(c, Ls, { state: 'air' });
        kit.label(c, '8 bar supply', 92, 290, { size: 10.5, color: C.muted });
        const out = pg > 0.05 ? 'air' : 'idle';
        const Lf = [fv.A, [210, hdr], [600, hdr]];
        S.line(c, Lf, { state: out }); S.line(c, [vv.P, [340, hdr]], { state: out }); S.junction(c, 340, hdr);
        const gg = S.gauge(c, 450, 86, { frac: pg / 7, value: num(pg, 2) + ' bar' });
        S.line(c, [gg.P, [450, hdr]], { state: out }); S.junction(c, 450, hdr);
        S.line(c, [[450, 76], [450, 10], [180, 10], [180, 36], [160, 36]], { state: 'pilot', color: C.accent });
        kit.label(c, 'sensor', 462, 20, { size: 10.5, color: C.accent });
        if (V.bleed > 0) {
          const th = S.throttle(c, 530, 160, {});
          S.line(c, [[530, hdr], th.b], { state: out }); S.junction(c, 530, hdr);
          S.line(c, [th.a, [530, 190]], { state: 'exhaust' }); S.exhaust(c, 530, 190, {});
          kit.label(c, 'consumer', 544, 160, { size: 10.5, color: C.muted });
        }
        const vs = 26 + 30 * Math.cbrt(V.V / 0.5);
        c.fillStyle = C.dark ? 'rgba(79,141,255,' + (0.08 + 0.3 * clamp(pg / 6, 0, 1)) + ')' : 'rgba(29,78,216,' + (0.06 + 0.25 * clamp(pg / 6, 0, 1)) + ')';
        c.fillRect(600, hdr - vs / 2, vs * 1.6, vs); c.strokeStyle = C.text; c.lineWidth = 1.8; c.strokeRect(600, hdr - vs / 2, vs * 1.6, vs);
        kit.label(c, 'V = ' + num(V.V, 2) + ' L', 600 + vs * 0.8, hdr + vs / 2 + 14, { align: 'center', size: 11.5 });
        // flows
        const adv = (k, f) => { s.ph[k] = (s.ph[k] || 0) + dt * 90 * f; return s.ph[k]; };
        if (fillO > 0.02) { S.flow(c, Ls, adv('s', fillO), { color: S.col('air') }); S.flow(c, Lf, adv('f', fillO), { color: S.col('air') }); }
        if (ventO > 0.02) S.flow(c, [[600, hdr], [340, hdr], vv.P, vv.A], adv('v', ventO), { color: S.col('exhaust') });
        kit.label(c, 'spool command ' + num(s.u * 100, 0) + ' %', 750, 296, { size: 11, color: C.muted, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ep-servo */
  const SBORE = { 25: 10, 32: 12, 50: 20, 63: 20 };
  Hyper.sim('ep-servo', {
    title: 'A servo-pneumatic axis',
    blurb: `A double-acting cylinder (300 mm stroke, 6 bar supply) positioned by a proportional 5/3 valve with a closed centre. The air in each chamber is integrated with the energy balance of the pneumatic cylinder model — flows by ISO 6358, compression by the moving piston — so the air spring, its stiffness and its natural frequency come out by themselves; seal friction sticks and slips. The controller runs at 1 kHz: spool command = position gain × error − velocity gain × speed − pressure feedback × (the change in the pressure difference across the piston).

**Try this**
- With the defaults the axis settles within about ±0.2 mm of each target in half a second or so.
- Untick **pressure feedback**: the same gains now leave the axis hunting around its target — the air spring has lost its damping.
- Raise the **position gain** step by step: faster, then overshoot, then above about 5–10 %/mm a violent oscillation.
- Set the velocity feedback to zero: overshoot grows.
- Increase the **moving mass** to 20–40 kg without changing the gains: the natural frequency falls and the axis rings — a controller must know its payload.
- Compare the natural frequency in the read-out at mid-stroke and near an end.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250 });
      const [g1, g2] = graphs(box, 2);
      const pX = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'position (mm)', min: 0, max: 300 }, legend: true }, 160);
      const pP = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'gauge pressure (bar)', min: 0, max: 6.5 }, legend: true }, 160);
      const ctl = kit.controls(box.side, [
        { id: 'auto', type: 'check', label: 'Step between 60 and 240 mm every 2 s', value: true },
        { id: 'xt', label: 'Target position', min: 10, max: 290, step: 1, value: 150, unit: 'mm' },
        { id: 'Kp', label: 'Position gain', min: 0.1, max: 10, value: 1, unit: '%/mm', log: true, sig: 2 },
        { id: 'Kv', label: 'Velocity feedback', min: 0, max: 100, step: 1, value: 25, unit: '% per m/s' },
        { id: 'pfb', type: 'check', label: 'Pressure feedback (32 % per bar of Δp change)', value: true },
        { id: 'm', label: 'Moving mass', min: 0.5, max: 40, value: 5, unit: 'kg', log: true, sig: 2 },
        { id: 'bore', type: 'select', label: 'Cylinder', options: Object.keys(SBORE).map(b => [b + ' mm bore', +b]), value: 32 },
        { id: 'fr', type: 'select', label: 'Seals', options: [['Standard seals', 1], ['Low-friction seals', 0.35]], value: 1 },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25]], value: 1 }
      ], (id) => { if (id === 'xt') ctl.set('auto', false); if (id === 'bore') build(); loop.once(); });
      const ro = kit.readout(box.side, [['x', 'Position / target'], ['f0', 'Air spring here: stiffness, natural frequency'], ['os', 'Last step: overshoot'], ['ts', 'Last step: within ±0.2 mm after'], ['u', 'Spool command'], ['p', 'Chamber pressures (gauge)']]);
      const V = ctl.values, L = 0.3, V0 = 1e-5, PS = 6e5 + PATM, B = 0.35, G = 1.4;
      let m;
      function build() {
        const D = V.bore / 1000, d = SBORE[V.bore] / 1000, AA = Math.PI * D * D / 4, AB = AA - Math.PI * d * d / 4, sc = (D / 0.032) ** 2;
        const x = m ? m.x : 0.15;
        m = { D, AA, AB, Cmax: 1.0e-8 * sc, Cl: 0.004e-8 * sc, x, v: 0, pA: 0.55 * PS, pB: 0.55 * PS * AA / AB, u: 0, uc: 0, tc: 0, aLow: null, t: 0,
          target: m ? m.target : 0.15, stepT: 0, x0: x, max: 0, exit: 0, os: '—', ts: '—', hist: [], tH: 0, ph: 0 };
      }
      build();
      function step(h) {
        const A32 = Math.PI * 0.032 * 0.032 / 4, fc = 20 * m.AA / A32 * V.fr, fv = 60 * (m.D / 0.032) ** 2;
        const tgt = V.auto ? ((Math.floor(m.t / 2) % 2) ? 0.24 : 0.06) : V.xt / 1000;
        if (Math.abs(tgt - m.target) > 1e-6) { m.target = tgt; m.stepT = m.t; m.x0 = m.x; m.max = 0; m.exit = m.t; m.os = m.ts = '…'; }
        // the controller, sampled at 1 kHz
        m.tc += h;
        if (m.tc >= 1e-3) {
          m.tc -= 1e-3;
          const e = (m.target - m.x) * 1000;
          const dp = (m.pA * m.AA - m.pB * m.AB - PATM * (m.AA - m.AB)) / m.AA / 1e5;
          m.aLow = m.aLow == null ? dp : m.aLow + (dp - m.aLow) * 1e-3 / 0.1;
          m.uc = clamp(V.Kp / 100 * e - V.Kv / 100 * m.v - (V.pfb ? 0.32 * (dp - m.aLow) : 0), -1, 1);
        }
        m.u += (m.uc - m.u) * Math.min(1, h / 0.004);             // the spool follows in about 4 ms
        const u = m.u, cp = m.Cmax * Math.max(0, u), cn = m.Cmax * Math.max(0, -u);
        const mA = q6358(F, m.Cl + cp, B, PS, m.pA) - q6358(F, m.Cl + cn, B, m.pA, PATM);
        const mB = q6358(F, m.Cl + cn, B, PS, m.pB) - q6358(F, m.Cl + cp, B, m.pB, PATM);
        const Fp = m.pA * m.AA - m.pB * m.AB - PATM * (m.AA - m.AB);
        if (Math.abs(m.v) < 1e-4 && Math.abs(Fp) <= 1.3 * fc) m.v = 0;
        else m.v += h * (Fp - Math.sign(m.v || Fp) * fc - fv * m.v) / V.m;
        m.x += m.v * h;
        if (m.x < 0) { m.x = 0; if (m.v < 0) m.v = 0; }
        if (m.x > L) { m.x = L; if (m.v > 0) m.v = 0; }
        const VA = V0 + m.AA * m.x, VB = V0 + m.AB * (L - m.x);
        m.pA = clamp(m.pA + h * (G * RAIR * TREF * mA - G * m.pA * m.AA * m.v) / VA, 0.9 * PATM, 1.02 * PS);
        m.pB = clamp(m.pB + h * (G * RAIR * TREF * mB + G * m.pB * m.AB * m.v) / VB, 0.9 * PATM, 1.02 * PS);
        m.t += h;
        const dir = Math.sign(m.target - m.x0) || 1;
        m.max = Math.max(m.max, (m.x - m.target) * dir);
        if (Math.abs(m.x - m.target) > 2e-4) m.exit = m.t;
        if (m.t - m.stepT > 0.05) m.os = num(Math.max(0, m.max) * 1000, 1) + ' mm';
        m.ts = m.t - m.exit > 0.3 ? num(m.exit - m.stepT, 2) + ' s' : '…';
      }
      const loop = kit.loop((dt) => {
        const sdt = Math.min(dt, 0.05) * V.slow, h = 2e-5;
        for (let k = 0, n = Math.round(sdt / h); k < n; k++) {
          step(h);
          m.tH += h; if (m.tH >= 0.004) { m.tH = 0; m.hist.push([m.t, m.x * 1000, m.target * 1000, (m.pA - PATM) / 1e5, (m.pB - PATM) / 1e5]); }
        }
        while (m.hist.length && m.hist[0][0] < m.t - 5) m.hist.shift();
        const VA = V0 + m.AA * m.x, VB = V0 + m.AB * (L - m.x);
        const k = G * (m.pA * m.AA * m.AA / VA + m.pB * m.AB * m.AB / VB), f0 = Math.sqrt(k / V.m) / (2 * Math.PI);
        ro.set('x', num(m.x * 1000, 1) + ' / ' + num(m.target * 1000, 0) + ' mm (error ' + num((m.target - m.x) * 1000, 2) + ')');
        ro.set('f0', num(k / 1000, 1) + ' N/mm, ' + num(f0, 1) + ' Hz');
        ro.set('os', m.os); ro.set('ts', m.ts);
        ro.set('u', num(m.u * 100, 1) + ' %');
        ro.set('p', num((m.pA - PATM) / 1e5, 2) + ' / ' + num((m.pB - PATM) / 1e5, 2) + ' bar');
        const h1 = thin(m.hist, 500), tmin = Math.max(0, m.t - 5), tmax = Math.max(5, m.t);
        pX.set({ series: [{ pts: h1.map(q => [q[0], q[2]]), label: 'target', dash: [5, 4] }, { pts: h1.map(q => [q[0], q[1]]), label: 'position' }], x: { label: 'time (s)', min: tmin, max: tmax } });
        pP.set({ series: [{ pts: h1.map(q => [q[0], q[3]]), label: 'cap end' }, { pts: h1.map(q => [q[0], q[4]]), label: 'rod end', dash: [5, 4] }], x: { label: 'time (s)', min: tmin, max: tmax } });
        // ---- drawing on a 760 × 310 design grid
        const c = st.begin(), C = kit.colors();
        design(st, c, 760, 310);
        const pA = m.pA - PATM, pB = m.pB - PATM;
        const fillC = p => p > 0.2e5 ? (C.dark ? 'rgba(79,141,255,' : 'rgba(29,78,216,') + Math.min(0.5, 0.08 + 0.42 * p / 6e5) + ')' : null;
        const cy = S.cylinder(c, 150, 110, { len: 320, h: 44, rodLen: 200, pos: m.x / L, fillA: fillC(pA), fillB: fillC(pB) });
        const mw = 24 + 5 * Math.log2(1 + V.m);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(cy.tip[0], 110 - mw / 2, mw, mw); c.strokeRect(cy.tip[0], 110 - mw / 2, mw, mw);
        kit.label(c, num(V.m, 1) + ' kg', cy.tip[0] + mw / 2, 110 + mw / 2 + 12, { align: 'center', size: 11, color: C.muted });
        // position scale and target mark
        const X = mm => 150 + 4 + mm / 300 * (320 - 15) + 3.5;
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(X(0), 70); c.lineTo(X(300), 70); c.stroke();
        for (let mm = 0; mm <= 300; mm += 50) { c.beginPath(); c.moveTo(X(mm), 66); c.lineTo(X(mm), 74); c.stroke(); kit.label(c, String(mm), X(mm), 60, { align: 'center', size: 9.5, color: C.muted }); }
        kit.label(c, 'position sensor (mm)', X(0) - 6, 44, { size: 10.5, color: C.muted });
        c.fillStyle = C.warn; c.beginPath(); c.moveTo(X(m.target * 1000), 74); c.lineTo(X(m.target * 1000) - 5, 82); c.lineTo(X(m.target * 1000) + 5, 82); c.closePath(); c.fill();
        kit.dot(c, X(m.x * 1000), 70, 3.5, C.accent);
        // valve and lines
        const vv = S.valve(c, 310, 232, { spec: '5/3 closed', state: 1 - m.u, left: 'spring+prop', right: 'spring+prop', s: 30, pneumatic: true, labels: true, exhaust: 'silencer' });
        const L1 = [vv.B, [vv.B[0], 170], [cy.A[0], 170], cy.A], L2 = [vv.A, [vv.A[0], 180], [cy.B[0], 180], cy.B];
        const act = Math.abs(m.u) > 0.02;
        S.line(c, L1, { state: m.u > 0.02 ? 'air' : m.u < -0.02 ? 'exhaust' : 'idle' });
        S.line(c, L2, { state: m.u < -0.02 ? 'air' : m.u > 0.02 ? 'exhaust' : 'idle' });
        S.line(c, [vv.P, [310, 290]], { state: 'air' }); S.source(c, 330, 292, { pneumatic: true }); S.line(c, [[310, 290], [330, 290], [330, 282]], { state: 'air' });
        if (act) {
          m.ph += dt * 200 * Math.abs(m.u);
          S.flow(c, m.u > 0 ? L1.slice().reverse() : L2.slice().reverse(), m.ph, { color: S.col('air') });
          S.flow(c, m.u > 0 ? L2 : L1, m.ph, { color: S.col('exhaust') });
        }
        kit.label(c, num(pA / 1e5, 2) + ' bar', cy.A[0] + 6, 150, { size: 11, color: C.text });
        kit.label(c, num(pB / 1e5, 2) + ' bar', cy.B[0] - 6, 150, { size: 11, color: C.text, align: 'right' });
        // the controller
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(560, 200, 150, 60);
        kit.label(c, 'controller, 1 kHz', 635, 216, { align: 'center', size: 11.5, weight: 700 });
        kit.label(c, 'u = ' + num(m.u * 100, 0) + ' %', 635, 238, { align: 'center', size: 12, color: act ? C.ok : C.muted });
        S.line(c, [[X(300) + 6, 70], [740, 70], [740, 230], [710, 230]], { state: 'pilot', color: C.accent });
        kit.label(c, 'x', 746, 150, { size: 11, color: C.accent });
        S.line(c, [[560, 248], [520, 248], [520, 190], [cy.B[0] + 20, 190]], { state: 'pilot', color: C.muted });
        kit.label(c, 'pA, pB', 524, 200, { size: 10, color: C.muted });
        S.line(c, [[560, 232], [vv.xr + 2, 232]], { state: 'pilot', color: act ? C.ok : C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ep-leak-test */
  Hyper.sim('ep-leak-test', {
    title: 'A pressure-decay leak test',
    blurb: `A machine section of volume V is charged through a solenoid shut-off valve, the valve closes, and a pressure sensor watches the pressure fall through a leak (a sharp-edged hole: ISO 6358 flow with C ≈ 0.1·d² dm³/(s·bar), d in mm). The model integrates the mass and the energy of the air: filling heats it, and it then cools towards the walls with a time constant of 10–30 s, which lowers the pressure with no leak at all. After a settling time the test measures the drop over a measuring time and reports $Q = V\\,\\Delta p/(p_0\\,\\Delta t)$, compared with the true leak.

**Try this**
- Set the settling time to zero: the cooling air is counted as leakage and the result is far too high.
- Wait 30–60 s before measuring: the reading converges on the true leak.
- Set the leak to zero: with no settling the test still "finds" a leak.
- A larger volume gives a smaller pressure drop for the same leak — longer measuring times are needed.
- Read what the leak costs a year, running around the clock.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 230 });
      const [g1, g2] = graphs(box, 2);
      const pP = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'gauge pressure (bar)' } }, 160);
      const pT = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'air temperature (°C)' } }, 160);
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'go', label: 'Run the test again', primary: true }] },
        { id: 'V', label: 'Volume under test', min: 1, max: 200, value: 20, unit: 'L', log: true, sig: 2 },
        { id: 'd', label: 'Leak: equivalent hole', min: 0, max: 2, step: 0.05, value: 0.6, unit: 'mm' },
        { id: 'p', label: 'Test pressure (gauge)', min: 2, max: 8, step: 0.5, value: 6, unit: 'bar' },
        { id: 'ts', label: 'Settling time before measuring', min: 0, max: 60, step: 1, value: 5, unit: 's' },
        { id: 'tm', label: 'Measuring time', min: 5, max: 60, step: 1, value: 20, unit: 's' },
        { id: 'fast', type: 'select', label: 'Time', options: [['Real time', 1], ['5 × faster', 5], ['20 × faster', 20]], value: 5 }
      ], (id) => { if (id === 'go' || id === 'V' || id === 'p') reset(); loop.once(); });
      const ro = kit.readout(box.side, [['ph', 'Phase'], ['p', 'Pressure / air temperature'], ['dp', 'Measured drop'], ['qm', 'Leak by the decay formula'], ['qt', 'True leak (from the mass lost)'], ['err', 'Error of the test'], ['cost', 'The true leak, a year around the clock']]);
      const V = ctl.values, CP = 1005, CVh = 718, CCH = 5e-8;
      let s;
      function reset() {
        const Vm = V.V * 1e-3;
        s = { t: 0, phase: 'charging', p: PATM, T: TREF, m: PATM * Vm / (RAIR * TREF), tClose: null, m1: null, p1: null, t1: null, res: null, hist: [], tH: 0, ph: 0 };
      }
      reset();
      function step(h) {
        const Vm = V.V * 1e-3, psup = V.p * 1e5 + PATM, hA = 90 * Math.pow(Vm, 2 / 3);
        const Cl = 0.1016e-8 * V.d * V.d;
        let mIn = 0;
        if (s.phase === 'charging') {
          mIn = q6358(F, CCH, 0.3, psup, s.p);
          if (s.p >= psup - 0.003e5 || s.t > 600) { s.phase = 'settling'; s.tClose = s.t; }
        }
        const mOut = q6358(F, Cl, 0.5, s.p, PATM);
        // mass and energy of the air: filling at the supply temperature, leaking at its own, exchanging heat with the walls
        // (the jet stirs the air while charging: about ten times the still-air heat transfer)
        const hx = s.phase === 'charging' ? 10 * hA : hA;
        const dT = (mIn * (CP * TREF - CVh * s.T) - mOut * RAIR * s.T + hx * (TREF - s.T)) / (s.m * CVh);
        s.m = Math.max(1e-9, s.m + h * (mIn - mOut));
        s.T += h * dT;
        s.p = s.m * RAIR * s.T / Vm;
        s.t += h;
        if (s.phase === 'settling' && s.t - s.tClose >= V.ts) { s.phase = 'measuring'; s.m1 = s.m; s.p1 = s.p; s.t1 = s.t; }
        if (s.phase === 'measuring' && s.t - s.t1 >= V.tm) {
          const dp = s.p1 - s.p, tm = s.t - s.t1;
          s.res = { dp, qm: Vm * dp / (1e5 * tm), qt: (s.m1 - s.m) / F.RHO_ANR / tm };
          s.phase = 'done'; s.tDone = s.t;
        }
      }
      const loop = kit.loop((dt) => {
        if (s.phase !== 'done' || s.t - s.tDone < 5) {
          const sdt = Math.min(dt, 0.05) * V.fast, h = 0.002;
          for (let k = 0, n = Math.round(sdt / h); k < n; k++) {
            step(h);
            s.tH += h; if (s.tH >= 0.05) { s.tH = 0; s.hist.push([s.t, (s.p - PATM) / 1e5, s.T - 273.15]); }
          }
        }
        const pg = (s.p - PATM) / 1e5, r = s.res;
        const lbl = { charging: 'charging through the shut-off valve', settling: 'valve closed: settling (' + num(V.ts - (s.t - s.tClose), 0) + ' s left)', measuring: 'measuring (' + num(V.tm - (s.t - s.t1), 0) + ' s left)', done: 'done — press "Run the test again"' };
        ro.set('ph', lbl[s.phase]);
        ro.set('p', num(pg, 3) + ' bar, ' + num(s.T - 273.15, 1) + ' °C');
        ro.set('dp', r ? num(r.dp / 100, 1) + ' mbar in ' + V.tm + ' s' : (s.phase === 'measuring' ? num((s.p1 - s.p) / 100, 1) + ' mbar so far' : '—'));
        ro.set('qm', r ? num(r.qm * 60000, 2) + ' L/min ANR' : '—');
        ro.set('qt', r ? num(r.qt * 60000, 2) + ' L/min ANR' : '—');
        ro.set('err', r ? (r.qt > 1e-9 ? (r.qm >= r.qt ? '+' : '−') + num(Math.abs(r.qm / r.qt - 1) * 100, 0) + ' %' : 'no leak, but ' + num(r.qm * 60000, 2) + ' L/min "found"') : '—');
        ro.set('cost', r ? kit.money(r.qt * 3600 * 8760 * 0.11 * 0.15, 0) + ' at 0.11 kWh/m³ and ¤0.15 per kWh' : '—');
        const marks = [];
        if (s.tClose != null) marks.push({ x: s.tClose, label: 'valve closed' });
        if (s.t1 != null) marks.push({ x: s.t1, label: 'measure' });
        if (s.t1 != null && (s.res || s.phase === 'done')) marks.push({ x: s.t1 + V.tm, label: 'end' });
        const h1 = thin(s.hist, 600);
        pP.set({ series: [{ pts: h1.map(q => [q[0], q[1]]), label: 'pressure' }], vlines: marks });
        pT.set({ series: [{ pts: h1.map(q => [q[0], q[2]]), label: 'air temperature', color: kit.colors().warn }], vlines: marks });
        // ---- drawing on a 760 × 270 design grid
        const c = st.begin(), C = kit.colors();
        design(st, c, 760, 270);
        const open = s.phase === 'charging';
        S.source(c, 70, 200, { pneumatic: true }); kit.label(c, 'supply ' + V.p + ' bar', 86, 222, { size: 10.5, color: C.muted });
        const Ls = [[70, 180], [70, 150], [150, 150]];
        S.frl(c, 198, 150);
        const vv = S.valve(c, 330, 130, { spec: '2/2 NC', state: open ? 0 : 1, left: 'solenoid', right: 'spring', s: 30, pneumatic: true, labels: true });
        kit.label(c, 'shut-off valve', 330, 88, { align: 'center', size: 11, color: C.muted });
        S.line(c, Ls, { state: 'air' }); S.line(c, [[246, 150], [300, 150], [300, 170], [330, 170], vv.P], { state: 'air' });
        const Lv = [vv.A, [330, 60], [520, 60]];
        S.line(c, Lv, { state: pg > 0.05 ? 'air' : 'idle' });
        const gg = S.gauge(c, 430, 30, { frac: pg / 9, value: num(pg, 3) + ' bar' });
        S.line(c, [gg.P, [430, 60]], { state: pg > 0.05 ? 'air' : 'idle' }); S.junction(c, 430, 60);
        kit.label(c, 'pressure sensor', 446, 12, { size: 10.5, color: C.muted });
        const w = 70 + 40 * Math.cbrt(V.V / 20), hgt = 60 + 30 * Math.cbrt(V.V / 20), vx = 520, vy = 60 - 20;
        const heat = clamp((s.T - TREF) / 30, 0, 1);
        c.fillStyle = heat > 0.02 ? 'rgba(229,72,77,' + (0.08 + 0.4 * heat) + ')' : (C.dark ? 'rgba(79,141,255,.15)' : 'rgba(29,78,216,.1)');
        c.beginPath(); c.roundRect ? c.roundRect(vx, vy, w, hgt, 14) : c.rect(vx, vy, w, hgt); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); c.roundRect ? c.roundRect(vx, vy, w, hgt, 14) : c.rect(vx, vy, w, hgt); c.stroke();
        kit.label(c, num(V.V, 0) + ' L', vx + w / 2, vy + hgt / 2 - 8, { align: 'center', size: 13, weight: 700 });
        kit.label(c, num(s.T - 273.15, 1) + ' °C', vx + w / 2, vy + hgt / 2 + 10, { align: 'center', size: 11.5, color: heat > 0.02 ? C.bad : C.muted });
        if (V.d > 0) {
          const lx = vx + w, ly = vy + hgt - 12;
          c.strokeStyle = C.bad; c.lineWidth = 1.5;
          s.ph += dt * 40 * Math.min(1, V.d) * (pg > 0.05 ? 1 : 0);
          for (let k = 0; k < 4; k++) { const a = ((s.ph / 20 + k / 4) % 1); c.globalAlpha = 1 - a; c.beginPath(); c.arc(lx + 6 + a * 40, ly, 3 + a * 6, -0.8, 0.8); c.stroke(); }
          c.globalAlpha = 1;
          kit.label(c, 'leak ' + V.d + ' mm', lx + 8, ly + 18, { size: 10.5, color: C.bad });
        }
        if (open) { s.ph += dt * 60; S.flow(c, Ls.concat([[246, 150], [300, 150], [300, 170], [330, 170], vv.P, vv.A, [330, 60], [520, 60]]), s.ph, { color: S.col('air') }); }
        kit.label(c, 't = ' + num(s.t, 1) + ' s', 750, 262, { size: 11, color: C.muted, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
