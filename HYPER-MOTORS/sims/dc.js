/* HYPER-MOTORS · sims/dc.js — simulations for the brushed DC motor pages (content/dc.js).
 *   dc-pmdc-cutaway     a 2-pole PMDC motor in section: magnets, slots with their commutated currents, commutator and
 *                       brushes; torque ripple against slot count; magnet temperature and the motor constant
 *   dc-wound-field      series, shunt, compound and separately excited motors: wiring that lights up, the curves, run-away
 *   dc-field-weakening  armature-voltage control to base speed, field weakening above it: the torque and power envelope
 *   dc-universal        a universal motor on AC or DC with triac phase control: voltage, current and torque waveforms
 *   dc-commutator       one coil commutating under a brush: reactance voltage, interpoles, brush shift, sparking, wear
 *   dc-pwm-lab          PWM into a motor: switch, freewheel diode, current ripple, whine, losses against frequency
 *   dc-h-bridge         four MOSFETs and their body diodes: drive, brake, coast, PWM decay modes, dead time, bus pumping
 *   dc-driver-lab       a generic 20 A driver board: DIP switches, command inputs, current limit, ramps, heat, power
 *   dc-braking-lab      a flywheel stopped by coasting, dynamic, short-circuit, regenerative, plugging or friction braking
 *   dc-gearmotor-lab    spur, planetary or worm gearhead on a PMDC motor lifting a load; back-driving and gear ratings
 * The motor models come from kit.motor (motors.js); what it lacks (wound fields with saturation, commutation, the
 * universal motor's AC current, the PWM current waveform, the bridge states) is modelled here.
 */
(function () {
  'use strict';

  const TAU = 2 * Math.PI;
  const rpmOf = w => w * 60 / TAU, radOf = n => n * TAU / 60;
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fin = (x, d) => Number.isFinite(x) ? x : (d || 0);
  // a row of graphs under the canvas
  function graphs(box, n) {
    const gb = document.createElement('div');
    gb.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;padding:4px 10px 10px';
    box.stage.appendChild(gb);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  }
  // draw in a fixed W0 × H0 design space, scaled to fit the stage
  function frame(st, W0, H0) {
    const c = st.begin(), s = Math.min(st.W / W0, st.H / H0);
    c.save(); c.translate((st.W - W0 * s) / 2, (st.H - H0 * s) / 2); c.scale(s, s);
    c.font = '12px ' + font(); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    return { c, s, done: () => c.restore() };
  }
  // pointer position in the design space of frame()
  const toDesign = (st, p, W0, H0) => { const s = Math.min(st.W / W0, st.H / H0); return { x: (p.x - (st.W - W0 * s) / 2) / s, y: (p.y - (st.H - H0 * s) / 2) / s }; };
  const txt = (c, s, x, y, col, align, size, weight) => { c.fillStyle = col; c.textAlign = align || 'center'; c.font = (weight || '') + ' ' + (size || 12) + 'px ' + font(); c.fillText(s, x, y); };
  // a horizontal bar with a label
  function bar(c, C, x, y, w, h, frac, col, label) {
    c.fillStyle = C.faint; c.fillRect(x, y, w, h);
    c.fillStyle = col; c.fillRect(x, y, w * clamp(fin(frac), 0, 1), h);
    if (label) txt(c, label, x, y - 4, C.muted, 'left', 11);
  }

  /* ================================================================ dc-pmdc-cutaway */
  // the 24 V, 100 W motor of the reference page; K and R at 20 °C
  const PM = { V: 24, R20: 0.5, K20: 0.055, I0: 0.25, J: 6e-5 };
  // torque of N commutated coils in a sinusoidal field, relative to the mean: sum of |cos| over the slots
  const rippleAt = (N, th) => { let t = 0; for (let k = 0; k < N; k++) t += Math.abs(Math.cos(th + TAU * k / N)); return t / (N * 2 / Math.PI); };
  const rippleOf = N => { let mx = -1, mn = 9; for (let i = 0; i < 720; i++) { const v = rippleAt(N, i / 720 * TAU); mx = Math.max(mx, v); mn = Math.min(mn, v); } return mx - mn; };

  Hyper.sim('dc-pmdc-cutaway', {
    title: 'Inside a permanent-magnet DC motor',
    blurb: `A two-pole PMDC motor cut across: the steel can with its north (red) and south (blue) magnets, the laminated rotor with its slots, and in the middle the commutator with two brushes at the top and bottom. A dot in a slot is current coming out of the screen, a cross current going in; the small arrows are the forces on the conductors. The first graph is the torque against rotor angle for the chosen number of slots (the ripple of commutation); the second is the speed line at the present voltage and temperature.

**Try this**
- Turn on *Slow motion* and follow one slot: its current reverses as it crosses the neutral zone at the top or bottom, exactly when its commutator segment passes under a brush (the segment lights up).
- Compare 3, 4, 5, 7 and 12 slots: odd counts give twice as many torque pulses per turn and much less ripple (14 % for 3, 5 % for 5, 2.5 % for 7).
- Raise the magnet temperature to 80 °C: K falls (ferrite −0.2 %/K), the motor runs faster at light load, but the stall torque on the second graph shrinks. Switch to NdFeB and the change is smaller.
- Raise the load towards stall: the current climbs, the force arrows lengthen, and the back-EMF falls with the speed.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 230 });
      const [g1, g2] = graphs(box, 2);
      let th = 0, disp = 0, w = 0, lastPlot = -1, t = 0, V = null;
      const ctl = kit.controls(box.side, [
        { id: 'N', type: 'select', label: 'Rotor slots (and commutator segments)', options: [['3', 3], ['4', 4], ['5', 5], ['7', 7], ['9', 9], ['12', 12]], value: 5 },
        { id: 'Vs', label: 'Supply voltage', min: 0, max: 24, step: 0.5, value: 12, unit: 'V' },
        { id: 'load', label: 'Load, % of the cold stall torque at 24 V', min: 0, max: 60, step: 1, value: 10, unit: '%' },
        { id: 'mag', type: 'select', label: 'Magnets', options: [['Ferrite (−0.2 %/K)', 'ferrite'], ['Sintered NdFeB (−0.12 %/K)', 'ndfeb']], value: 'ferrite' },
        { id: 'temp', label: 'Magnet and winding temperature', min: -20, max: 120, step: 1, value: 20, unit: '°C' },
        { id: 'slow', type: 'check', label: 'Slow motion (see each commutation)', value: false }
      ], () => { lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed'], ['I', 'Current'], ['E', 'Back-EMF'], ['T', 'Torque (mean)'], ['rip', 'Torque ripple (peak to peak)'], ['K', 'Motor constant K']]);
      const p1 = kit.plot(g1, { x: { label: 'rotor angle (°)', min: 0, max: 360 }, y: { label: 'torque, % of mean', min: 80, max: 110 }, legend: true }, 180);
      const p2 = kit.plot(g2, { x: { label: 'torque (N·m)', min: 0 }, y: { label: 'speed (rpm)', min: 0 }, legend: true }, 180);
      const Ts0 = PM.K20 * (PM.V / PM.R20 - PM.I0);
      const state = () => {
        const a = V.mag === 'ndfeb' ? -0.0012 : -0.002;
        const K = PM.K20 * (1 + a * (V.temp - 20)), R = M.copperR(PM.R20, V.temp);
        return { K: Math.max(1e-4, K), R: Math.max(0.05, R) };
      };
      const loop = kit.loop(dt => {
        t += dt;
        const N = +V.N, { K, R } = state(), TL = V.load / 100 * Ts0;
        const sub = 40, h = dt / sub;
        let I = 0, Tm = 0;
        for (let k = 0; k < sub; k++) {
          I = Math.max(0, (V.Vs - K * w) / R);
          Tm = I > PM.I0 ? K * (I - PM.I0) : 0;
          const Tinst = Tm * rippleAt(N, th);
          w = Math.max(0, w + h * (Tinst - (w > 0.01 || Tinst > TL ? TL : Tinst)) / PM.J);
          th = (th + w * h) % TAU;
        }
        disp += w * dt / (V.slow ? 2000 : 80);
        const n = rpmOf(w), rip = rippleOf(N);
        ro.set('n', n.toFixed(0) + ' rpm'); ro.set('I', I.toFixed(2) + ' A'); ro.set('E', (K * w).toFixed(2) + ' V');
        ro.set('T', Tm.toFixed(3) + ' N·m'); ro.set('rip', (100 * rip).toFixed(1) + ' % (' + (N % 2 ? 2 * N : N) + ' pulses a turn)');
        ro.set('K', K.toFixed(4) + ' V·s/rad = ' + (60 / (TAU * K)).toFixed(0) + ' rpm/V');
        if (t - lastPlot > 0.25 || lastPlot < 0) {
          lastPlot = t;
          const pts = [], p3 = [];
          for (let i = 0; i <= 360; i += 2) { pts.push([i, 100 * rippleAt(N, i * Math.PI / 180)]); p3.push([i, 100 * rippleAt(3, i * Math.PI / 180)]); }
          const ser = [{ pts, label: N + ' slots' }];
          if (N !== 3) ser.push({ pts: p3, label: '3 slots', dash: [5, 4], color: kit.colors().muted });
          p1.set({ series: ser, marks: [{ x: (th * 180 / Math.PI) % 360, y: 100 * rippleAt(N, th) }] });
          const dHot = M.dc({ V: Math.max(0.1, V.Vs), R, K, I0: PM.I0 }), dCold = M.dc({ V: Math.max(0.1, V.Vs), R: PM.R20, K: PM.K20, I0: PM.I0 });
          const line = d => { const a = []; for (let i = 0; i <= 40; i++) { const T = d.stallTorque * i / 40; a.push([T, Math.max(0, d.at(T).n)]); } return a; };
          p2.set({ x: { label: 'torque (N·m)', min: 0, max: Math.max(0.05, dCold.stallTorque, dHot.stallTorque) }, series: [{ pts: line(dHot), label: 'at ' + V.temp.toFixed(0) + ' °C' }, { pts: line(dCold), label: 'at 20 °C', dash: [5, 4], color: kit.colors().muted }], marks: [{ x: Tm, y: n, label: 'running' }] });
        }
        // drawing
        const F = frame(st, 640, 260), c = F.c, C = kit.colors();
        const cx = 170, cy = 128;
        c.fillStyle = C.surface2; c.beginPath(); c.arc(cx, cy, 118, 0, TAU); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, 118, 0, TAU); c.stroke(); c.beginPath(); c.arc(cx, cy, 106, 0, TAU); c.stroke();
        const magnet = (a0, col, lab) => {
          c.fillStyle = col; c.beginPath(); c.arc(cx, cy, 105, a0 - 0.95, a0 + 0.95); c.arc(cx, cy, 84, a0 + 0.95, a0 - 0.95, true); c.closePath(); c.fill();
          txt(c, lab, cx + 94 * Math.cos(a0), cy + 94 * Math.sin(a0) + 5, C.text, 'center', 15, 'bold');
        };
        magnet(Math.PI, 'hsl(0 70% 50% / .6)', 'N'); magnet(0, 'hsl(215 70% 50% / .6)', 'S');
        // rotor lamination with teeth
        c.fillStyle = C.bg2; c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.arc(cx, cy, 78, 0, TAU); c.fill(); c.stroke();
        const Inow = Math.max(0, (V.Vs - K * w) / R), Irel = clamp(Inow / (PM.V / PM.R20) * 3, 0, 1);
        for (let k = 0; k < N; k++) {
          const a = disp + TAU * k / N, x = cx + 62 * Math.cos(a), y = cy + 62 * Math.sin(a), cs = Math.cos(a);
          const comm = Math.abs(cs) < 0.14;
          c.fillStyle = comm ? C.faint : (cs > 0 ? 'hsl(215 70% 55% / .35)' : 'hsl(0 70% 55% / .35)');
          c.beginPath(); c.arc(x, y, 11, 0, TAU); c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1; c.stroke();
          c.strokeStyle = comm ? C.muted : C.text; c.fillStyle = C.text; c.lineWidth = 2;
          if (!comm && Inow > 0.02) {
            if (cs > 0) { c.beginPath(); c.arc(x, y, 3, 0, TAU); c.fill(); }
            else { c.beginPath(); c.moveTo(x - 5, y - 5); c.lineTo(x + 5, y + 5); c.moveTo(x + 5, y - 5); c.lineTo(x - 5, y + 5); c.stroke(); }
            const L = 26 * Math.abs(cs) * Irel;
            if (L > 3) kit.arrow(c, x, y, x - L * Math.sin(a), y + L * Math.cos(a), 'hsl(28 90% 55%)', 2);
          }
        }
        // commutator and brushes
        for (let k = 0; k < N; k++) {
          const a = disp + TAU * k / N, a1 = a - Math.PI / N + 0.06, a2 = a + Math.PI / N - 0.06;
          const under = Math.abs(Math.cos(a)) < Math.sin(Math.PI / N) * 0.9;
          c.fillStyle = under ? 'hsl(28 90% 55%)' : 'hsl(30 60% 45%)';
          c.beginPath(); c.arc(cx, cy, 26, a1, a2); c.arc(cx, cy, 16, a2, a1, true); c.closePath(); c.fill();
        }
        c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 6, 0, TAU); c.fill();
        c.fillStyle = C.muted; c.fillRect(cx - 7, cy - 40, 14, 13); c.fillRect(cx - 7, cy + 27, 14, 13);
        txt(c, '+', cx + 14, cy - 30, C.text, 'left', 13, 'bold'); txt(c, '−', cx + 14, cy + 40, C.text, 'left', 13, 'bold');
        c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(cx, cy - 104); c.lineTo(cx, cy - 44); c.moveTo(cx, cy + 44); c.lineTo(cx, cy + 104); c.stroke(); c.setLineDash([]);
        txt(c, 'neutral zone', cx, 14, C.muted, 'center', 11);
        // legend and numbers
        const x0 = 330;
        txt(c, '⊙ current out of the screen   ⊗ into it', x0, 28, C.muted, 'left', 12);
        txt(c, 'brushes at top (+) and bottom (−); lit segments are commutating', x0, 46, C.muted, 'left', 12);
        txt(c, 'speed ' + n.toFixed(0) + ' rpm', x0, 82, C.text, 'left', 16, 'bold');
        txt(c, 'back-EMF Kω = ' + (K * w).toFixed(1) + ' V of ' + V.Vs.toFixed(1) + ' V', x0, 104, C.text, 'left', 13);
        txt(c, 'current ' + I.toFixed(2) + ' A    torque ' + Tm.toFixed(3) + ' N·m', x0, 124, C.text, 'left', 13);
        const Is = V.Vs / R;
        bar(c, C, x0, 150, 280, 11, Is > 0 ? I / Is : 0, I / Math.max(1e-6, Is) > 0.4 ? C.bad : C.accent, 'current, as a share of the stall current (' + Is.toFixed(0) + ' A)');
        const Ts = K * Math.max(0, V.Vs / R - PM.I0);
        bar(c, C, x0, 188, 280, 11, Ts / Math.max(1e-6, Ts0), 'hsl(28 90% 55%)', 'stall torque now: ' + Ts.toFixed(2) + ' N·m (' + Ts0.toFixed(2) + ' N·m cold at 24 V)');
        txt(c, V.slow ? 'rotor drawn 2000 × slower than it turns' : 'rotor drawn 80 × slower than it turns', x0, 226, C.muted, 'left', 11);
        F.done();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ dc-wound-field */
  // a 220 V, 26 A, 1 500 rpm (about 5 kW) motor wound five ways; every connection has the same rated point
  const WF = { Vr: 220, Ir: 26, wr: radOf(1500), Ra: 0.45, La: 0.01, J: 0.08, sat: 0.6, res: 0.05 };
  const WTYPES = {
    series: { name: 'Series', Rse: 0.12, sh: 0, se: 1, shunt: false },
    shunt: { name: 'Shunt', Rse: 0, sh: 1, se: 0, shunt: true },
    cumulative: { name: 'Cumulative compound', Rse: 0.04, sh: 0.8, se: 0.2, shunt: true },
    differential: { name: 'Differential compound', Rse: 0.04, sh: 1.35, se: -0.35, shunt: true },
    separate: { name: 'Separately excited', Rse: 0, sh: 1, se: 0, shunt: true, sep: true }
  };
  // saturating magnetisation curve, 1 at rated MMF, with a little residual flux
  const phiOf = F => { const a = WF.sat, m = Math.abs(F); return Math.sign(F) * (1 + a) * m / (1 + a * m) * (1 - WF.res) + WF.res; };
  // the motor constant at rated flux, chosen so that each connection runs at 1 500 rpm at rated current and voltage
  const K1of = ty => (WF.Vr - WF.Ir * (WF.Ra + ty.Rse)) / WF.wr;

  Hyper.sim('dc-wound-field', {
    title: 'Series, shunt and compound motors',
    blurb: `A 220 V, 26 A, 1 500 rpm DC motor (about 5 kW) wound five ways, fed through a drive with a current limit. The diagram lights up with the armature current (orange dots) and the field current (blue); the dial shows the speed with the overspeed trip at 3 300 rpm. The graphs show the steady speed against torque for every connection (the chosen one bold, with the running point), and the torque each gives per ampere.

**Try this**
- *Series*: raise the load to 200 % — the torque rises with the square of the current and the speed falls steeply. Then press *Throw off the load*: the flux collapses and the motor races until the overspeed trip opens the supply.
- *Shunt*: the speed hardly changes from no load to full load (about 5 %). Set the load to 0 and tick *Open the shunt field*: the flux decays to its small residual value, the current jumps to the drive's limit and the motor creeps faster and faster until the overspeed trip. With a heavy load it stalls at the current limit instead. Without a current limit the runaway would be violent.
- *Cumulative compound*: more torque per ampere than the shunt motor and a drooping speed, but no runaway without load.
- *Differential compound*: the speed rises as the load rises — unstable; at high currents the flux can collapse.
- *Start from rest* with the current limit at 150 % and 300 %: the series motor starts with far more torque for the same current.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const [g1, g2] = graphs(box, 2);
      let V = null, ty = WTYPES[(params && params.type) || 'series'] || WTYPES.series, w = WF.wr * 0.9, ia = WF.Ir * 0.5, f = 1, trip = false, t = 0, lastPlot = -1, phA = 0, phF = 0;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Connection', options: Object.keys(WTYPES).map(k => [WTYPES[k].name, k]), value: (params && WTYPES[params.type]) ? params.type : 'series' },
        { id: 'Vs', label: 'Supply voltage', min: 0, max: 250, step: 1, value: 220, unit: 'V' },
        { id: 'load', label: 'Load torque, % of rated', min: 0, max: 250, step: 1, value: 100, unit: '%' },
        { id: 'ilim', label: 'Drive current limit, % of rated', min: 100, max: 300, step: 5, value: 200, unit: '%' },
        { id: 'open', type: 'check', label: 'Open the shunt field (a fault)', value: false },
        { type: 'buttons', items: [{ id: 'start', label: 'Start from rest', primary: true }, { id: 'throw', label: 'Throw off the load' }, { id: 'reset', label: 'Reset trip' }] }
      ], id => {
        if (id === 'type') { ty = WTYPES[V.type]; trip = false; }
        if (id === 'start') { w = 0; ia = 0; trip = false; }
        if (id === 'throw') ctl.set('load', 0);
        if (id === 'reset') { trip = false; }
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed'], ['ia', 'Armature current'], ['if', 'Field current · flux'], ['T', 'Torque'], ['P', 'Output power'], ['st', 'State']]);
      const pT = kit.plot(g1, { x: { label: 'torque (N·m)', min: 0, max: 95 }, y: { label: 'speed (rpm)', min: 0, max: 3500 }, legend: true }, 200);
      const pI = kit.plot(g2, { x: { label: 'armature current (A)', min: 0, max: 80 }, y: { label: 'torque (N·m)', min: 0, max: 180 }, legend: true }, 200);
      const Trated = () => K1of(WTYPES.shunt) * WF.Ir;
      const Tfric = ww => 0.4 + 0.5 * Math.pow(ww / WF.wr, 2);   // bearings, brushes and the fan
      const mmf = (tp, fr, a) => tp.sh * fr + tp.se * a;
      const loop = kit.loop(dt => {
        t += dt;
        const K1 = K1of(ty), Rt = WF.Ra + ty.Rse, TL = V.load / 100 * Trated(), Ilim = V.ilim / 100 * WF.Ir;
        const fT = ty.shunt && !V.open && !trip ? (ty.sep ? 1 : V.Vs / WF.Vr) : 0;
        const sub = 200, h = dt / sub;
        let E = 0, Tem = 0, Va = 0;
        for (let k = 0; k < sub; k++) {
          f += h * (fT - f) / (fT < f ? 0.08 : 0.3);
          const phi = phiOf(mmf(ty, f, ia / WF.Ir));
          E = K1 * phi * w;
          Va = trip ? 0 : clamp(Math.min(V.Vs, E + Rt * Ilim), 0, V.Vs);
          ia = Math.max(0, ia + h * (Va - Rt * ia - E) / WF.La);
          if (trip && ia < 1e-3) ia = 0;
          Tem = K1 * phi * ia;
          const Tres = TL + Tfric(w);
          w = Math.max(0, w + h * (Tem - (w > 0.05 || Tem > Tres ? Tres : Tem)) / WF.J);
        }
        if (w > 2.2 * WF.wr) trip = true;
        const n = rpmOf(w), phiNow = phiOf(mmf(ty, f, ia / WF.Ir));
        phA += ia * dt * 4; phF += f * dt * 40;
        ro.set('n', n.toFixed(0) + ' rpm');
        ro.set('ia', ia.toFixed(1) + ' A (' + (100 * ia / WF.Ir).toFixed(0) + ' % of rated)' + (Va < V.Vs - 0.5 && !trip && ia > 0.95 * Ilim ? ' — at the limit' : ''));
        ro.set('if', (ty.shunt ? (f * 1.0).toFixed(2) + ' A shunt · ' : 'series field · ') + (100 * phiNow).toFixed(0) + ' % flux');
        ro.set('T', Tem.toFixed(1) + ' N·m (rated ' + Trated().toFixed(1) + ')');
        ro.set('P', (Math.max(0, Tem - Tfric(w)) * w / 1000).toFixed(2) + ' kW');
        ro.set('st', trip ? 'OVERSPEED TRIP — supply opened; press Reset trip' : V.open && ty.shunt ? 'field open: flux ' + (100 * phiNow).toFixed(0) + ' %' : n < 5 && TL > 0 && Tem < TL ? 'stalled: the load exceeds the torque at this current limit' : 'running');
        if (t - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = t;
          const C = kit.colors(), ser = [], tq = [];
          Object.keys(WTYPES).forEach((key, j) => {
            const tp = WTYPES[key], K = K1of(tp), R = WF.Ra + tp.Rse, pts = [], ti = [], sel = tp === ty;
            const fr = tp.sep ? 1 : V.Vs / WF.Vr;
            for (let i = 1; i <= 120; i++) {
              const I = 3 * WF.Ir * i / 120, ph = phiOf(mmf(tp, tp.shunt ? fr : 0, I / WF.Ir)), T = K * ph * I, om = (V.Vs - I * R) / (K * ph);
              if (ph > 0 && om >= 0 && rpmOf(om) < 3500) pts.push([T, rpmOf(om)]);
              if (T >= 0) ti.push([I, T]);
            }
            const col = sel ? C.accent : C.series[(j + 1) % C.series.length];
            ser.push({ pts, label: tp.name, color: col, width: sel ? 3 : 1.2, dash: sel ? [] : [4, 3] });
            tq.push({ pts: ti, label: tp.name, color: col, width: sel ? 3 : 1.2, dash: sel ? [] : [4, 3] });
          });
          pT.set({ series: ser, marks: [{ x: Tem, y: Math.min(3500, n), label: 'now' }], hlines: [{ y: 3300, label: 'trip' }], vlines: [{ x: Trated(), label: 'rated' }] });
          pI.set({ series: tq, marks: [{ x: Math.min(80, ia), y: Tem }] });
        }
        // drawing: the circuit and the speed dial
        const Fr = frame(st, 640, 260), c = Fr.c, C = kit.colors(), S = kit.schem;
        const top = 40, bot = 220, xs = 40, xa = 300;
        const aCol = 'hsl(28 90% 55%)', fCol = 'hsl(205 80% 55%)';
        S.battery(c, xs, top, xs, bot, { label: 'drive', value: Va.toFixed(0) + ' V' });
        S.wire(c, [[xs, top], [120, top]]);
        if (ty.se !== 0) S.inductor(c, 120, top, 200, top, { label: ty.se > 0 ? 'series field D1–D2' : 'series field (reversed)', core: true });
        else S.wire(c, [[120, top], [200, top]]);
        S.wire(c, [[200, top], [xa, top], [xa, 70]]);
        S.motor(c, xa, 70, xa, 190, { label: 'A1–A2' });
        S.wire(c, [[xa, 190], [xa, bot], [xs, bot]]);
        if (ty.shunt && !ty.sep) {
          S.node(c, 85, top); S.node(c, 85, bot);
          S.wire(c, [[85, top], [85, 70]]);
          if (V.open) { S.wire(c, [[85, 70], [85, 82]]); S.wire(c, [[85, 94], [85, 105]]); txt(c, 'open!', 70, 90, C.bad, 'right', 12, 'bold'); }
          else S.wire(c, [[85, 70], [85, 105]]);
          S.inductor(c, 85, 105, 85, 185, { label: 'shunt E1–E2', core: true });
          S.wire(c, [[85, 185], [85, bot]]);
          S.flow(c, [[85, top], [85, bot]], phF, { color: fCol });
        }
        if (ty.sep) {
          S.battery(c, 420, 60, 420, 200, { label: 'field' });
          S.wire(c, [[420, 60], [470, 60], [470, 80]]);
          if (V.open) txt(c, 'open!', 480, 76, C.bad, 'left', 12, 'bold');
          S.inductor(c, 470, 95, 470, 185, { label: 'F1–F2', core: true });
          S.wire(c, [[470, 185], [470, 200], [420, 200]]);
          if (!V.open) S.flow(c, [[420, 60], [470, 60], [470, 200], [420, 200]], phF, { color: fCol });
        }
        if (ia > 0.05) S.flow(c, [[xs, top], [xa, top], [xa, bot], [xs, bot]], phA, { color: aCol });
        // dial
        const dx = ty.sep ? 575 : 510, dy = 125, rr = 62;
        const ang = v => Math.PI * 0.75 + 1.5 * Math.PI * clamp(v / 3500, 0, 1);
        c.lineWidth = 8; c.strokeStyle = C.faint; c.beginPath(); c.arc(dx, dy, rr, ang(0), ang(3500)); c.stroke();
        c.strokeStyle = C.bad; c.beginPath(); c.arc(dx, dy, rr, ang(3300), ang(3500)); c.stroke();
        c.strokeStyle = C.ok; c.beginPath(); c.arc(dx, dy, rr, ang(1400), ang(1600)); c.stroke();
        c.lineWidth = 1;
        for (let v = 0; v <= 3500; v += 500) { const a = ang(v); txt(c, String(v / 1000), dx + (rr - 18) * Math.cos(a), dy + (rr - 18) * Math.sin(a) + 4, C.muted, 'center', 10); }
        kit.arrow(c, dx, dy, dx + (rr - 6) * Math.cos(ang(n)), dy + (rr - 6) * Math.sin(ang(n)), trip ? C.bad : C.text, 3);
        txt(c, n.toFixed(0) + ' rpm', dx, dy + 34, C.text, 'center', 14, 'bold');
        txt(c, '×1000 rpm', dx, dy + 50, C.muted, 'center', 10);
        if (trip) txt(c, 'OVERSPEED TRIP', dx, dy + 82, C.bad, 'center', 13, 'bold');
        txt(c, ty.name + ' motor', 330, 250, C.muted, 'center', 12);
        Fr.done();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ dc-field-weakening */
  // a 15 kW, 440 V, 38 A separately excited motor, base 1 500 rpm, top 3 000 rpm; L_af = 1.771 H, rated field 1.5 A
  const FW = { V: 440, Ra: 0.6, Ir: 38, Ifr: 1.5, Laf: 1.771, nb: 1500, nmax: 3000, J: 0.5 };
  Hyper.sim('dc-field-weakening', {
    title: 'Base speed and field weakening',
    blurb: `A 15 kW, 440 V separately excited DC motor on a four-quadrant drive. Below the base speed of 1 500 rpm the drive raises the armature voltage with the speed and keeps the field full; above it the armature voltage is at its limit and the drive weakens the field instead. The first graph is the torque the motor can give at rated current (and at the 150 % current limit) against speed, with the load's curve; the second shows armature voltage, field current and available power as percentages.

**Try this**
- Raise the speed set-point from 0 to 1 500 rpm: the armature-voltage bar rises in proportion, the field bar stays full — the constant-torque region.
- Go on to 3 000 rpm: the armature voltage stops at 440 V and the field current falls to about half. The torque available halves; the power stays at about 15 kW — the constant-power region.
- With a constant-torque load of 100 %, try to go above base speed: the current climbs past rated to the limit, and the speed stops at about 2 200 rpm, where the weakened field no longer gives enough torque even at 150 % current. Switch to the winder (constant power) load and it reaches 3 000 rpm within its rated current.
- A fan needs little torque at low speed and a lot at high speed: see how far above base speed it can go.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const [g1, g2] = graphs(box, 2);
      const Tb = FW.Laf * FW.Ifr * FW.Ir, Emax = FW.V - FW.Ra * FW.Ir, wb = radOf(FW.nb);
      let V = null, w = 0, wRef = 0, integ = 0, t = 0, lastPlot = -1, Ia = 0, If = FW.Ifr, Va = 0;
      const ctl = kit.controls(box.side, [
        { id: 'nset', label: 'Speed set-point', min: 0, max: 3000, step: 10, value: 1000, unit: 'rpm' },
        { id: 'ltype', type: 'select', label: 'Load', options: [['Constant torque (conveyor, hoist)', 'const'], ['Constant power (winder, lathe spindle)', 'power'], ['Fan or pump (torque ∝ speed²)', 'fan']], value: 'power' },
        { id: 'load', label: 'Load, % of rated torque at base speed', min: 0, max: 150, step: 1, value: 80, unit: '%' },
        { id: 'ilim', label: 'Current limit, % of rated', min: 100, max: 200, step: 5, value: 150, unit: '%' }
      ], () => { lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed'], ['va', 'Armature voltage'], ['ia', 'Armature current'], ['if', 'Field current · flux'], ['T', 'Motor torque · available'], ['P', 'Power'], ['reg', 'Region']]);
      const pT = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0, max: 3000 }, y: { label: 'torque (N·m)', min: 0, max: 200 }, legend: true }, 190);
      const pP = kit.plot(g2, { x: { label: 'speed (rpm)', min: 0, max: 3000 }, y: { label: '% of rated', min: 0, max: 110 }, legend: true }, 190);
      const loadT = n => { const L = V.load / 100 * Tb; if (V.ltype === 'const') return L; if (V.ltype === 'fan') return L * Math.pow(n / FW.nb, 2); return L * Math.min(1.25, FW.nb / Math.max(1, n)); };   // a winder: tension × radius, limited at low speed
      const fieldFor = ww => Math.min(FW.Ifr, Emax / (FW.Laf * Math.max(ww, 1e-3)));
      const loop = kit.loop(dt => {
        t += dt;
        const target = radOf(V.nset), Ilim = V.ilim / 100 * FW.Ir, rate = radOf(1000);
        wRef = wRef < target ? Math.min(target, wRef + rate * dt) : Math.max(target, wRef - rate * dt);
        const sub = 20, h = dt / sub;
        for (let k = 0; k < sub; k++) {
          const err = wRef - w;
          integ = clamp(integ + 40 * err * h, -Ilim, Ilim);
          Ia = clamp(3 * err + integ, -Ilim, Ilim);
          // the armature voltage may not exceed 440 V: full field while it fits, weakened just enough above base speed
          If = w > 1e-3 ? Math.min(FW.Ifr, (FW.V - FW.Ra * Ia) / (FW.Laf * w)) : FW.Ifr;
          const K = FW.Laf * If, E = K * w;
          Va = E + FW.Ra * Ia;
          const Tm = K * Ia, TL = w > 0.01 ? loadT(rpmOf(w)) : Math.min(Math.max(0, Tm), loadT(0));
          w = Math.max(0, w + h * (Tm - TL) / FW.J);
        }
        const n = rpmOf(w), K = FW.Laf * If, Tm = K * Ia, Tav = FW.Laf * If * FW.Ir;
        ro.set('n', n.toFixed(0) + ' rpm (set ' + V.nset.toFixed(0) + ')');
        ro.set('va', Va.toFixed(0) + ' V of 440 V'); ro.set('ia', Ia.toFixed(1) + ' A (' + (100 * Ia / FW.Ir).toFixed(0) + ' %)' + (Math.abs(Ia) >= 0.99 * Ilim ? ' — at the limit' : ''));
        ro.set('if', If.toFixed(2) + ' A · ' + (100 * If / FW.Ifr).toFixed(0) + ' %');
        ro.set('T', Tm.toFixed(0) + ' N·m · ' + Tav.toFixed(0) + ' N·m at rated current');
        ro.set('P', (Tm * w / 1000).toFixed(1) + ' kW (' + (Tav * w / 1000).toFixed(1) + ' kW available)');
        ro.set('reg', n <= FW.nb + 5 ? 'constant torque: armature voltage control' : 'constant power: field weakening');
        if (t - lastPlot > 0.25 || lastPlot < 0) {
          lastPlot = t;
          const env = [], envL = [], lc = [], va = [], fi = [], pw = [];
          for (let i = 0; i <= 60; i++) {
            const nn = 3000 * i / 60, ww = radOf(nn), f = fieldFor(ww) / FW.Ifr, Il = V.ilim / 100 * FW.Ir;
            env.push([nn, Tb * f]); envL.push([nn, Math.min(FW.Laf * FW.Ifr * Il, (FW.V - FW.Ra * Il) * Il / Math.max(1e-3, ww))]); lc.push([nn, Math.min(200, loadT(nn))]);
            va.push([nn, Math.min(100, 100 * (FW.Laf * FW.Ifr * f * ww + FW.Ra * FW.Ir) / FW.V)]); fi.push([nn, 100 * f]); pw.push([nn, 100 * Tb * f * ww / (Tb * wb)]);
          }
          const C = kit.colors();
          pT.set({ series: [{ pts: env, label: 'at rated current' }, { pts: envL, label: 'at the current limit', dash: [5, 4] }, { pts: lc, label: 'load', color: C.muted, dash: [2, 3] }], marks: [{ x: n, y: Tm, label: 'now' }], vlines: [{ x: FW.nb, label: 'base' }] });
          pP.set({ series: [{ pts: va, label: 'armature voltage' }, { pts: fi, label: 'field current' }, { pts: pw, label: 'power available' }], vlines: [{ x: FW.nb, label: 'base' }, { x: n, label: 'now', color: C.accent }] });
        }
        // drawing: two "knobs" as bars, the flux in the poles and a speed dial
        const Fr = frame(st, 640, 240), c = Fr.c, C = kit.colors();
        const fl = If / FW.Ifr;
        bar(c, C, 30, 50, 250, 16, Va / FW.V, C.accent, 'armature voltage ' + Va.toFixed(0) + ' V');
        bar(c, C, 30, 100, 250, 16, fl, 'hsl(205 80% 55%)', 'field current ' + If.toFixed(2) + ' A');
        bar(c, C, 30, 150, 250, 16, Math.abs(Ia) / (2 * FW.Ir), Math.abs(Ia) > FW.Ir ? C.bad : C.ok, 'armature current ' + Ia.toFixed(1) + ' A (bar = 200 %)');
        c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.moveTo(30 + 125, 146); c.lineTo(30 + 125, 170); c.stroke();
        txt(c, 'rated', 155, 182, C.muted, 'center', 10);
        txt(c, n <= FW.nb + 5 ? 'constant-torque region' : 'constant-power region (field weakened)', 30, 216, n <= FW.nb + 5 ? C.text : 'hsl(28 90% 55%)', 'left', 14, 'bold');
        // motor section: poles whose shading follows the flux
        const mx = 400, my = 115;
        c.fillStyle = C.surface2; c.beginPath(); c.arc(mx, my, 70, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        c.fillStyle = 'hsl(0 70% 50% / ' + (0.15 + 0.6 * fl).toFixed(2) + ')'; c.fillRect(mx - 66, my - 24, 22, 48);
        c.fillStyle = 'hsl(215 70% 50% / ' + (0.15 + 0.6 * fl).toFixed(2) + ')'; c.fillRect(mx + 44, my - 24, 22, 48);
        c.fillStyle = C.bg2; c.beginPath(); c.arc(mx, my, 38, 0, TAU); c.fill(); c.strokeStyle = C.muted; c.stroke();
        kit.arrow(c, mx - 30 * fl - 6, my, mx + 30 * fl + 6, my, 'hsl(205 80% 55%)', 3);
        txt(c, 'flux ' + (100 * fl).toFixed(0) + ' %', mx, my + 60, C.muted, 'center', 11);
        const dx = 560, dy = 120, rr = 58, ang = v => Math.PI * 0.75 + 1.5 * Math.PI * clamp(v / 3000, 0, 1);
        c.lineWidth = 8; c.strokeStyle = C.faint; c.beginPath(); c.arc(dx, dy, rr, ang(0), ang(3000)); c.stroke();
        c.strokeStyle = 'hsl(28 90% 55%)'; c.beginPath(); c.arc(dx, dy, rr, ang(1500), ang(3000)); c.stroke(); c.lineWidth = 1;
        kit.arrow(c, dx, dy, dx + (rr - 6) * Math.cos(ang(n)), dy + (rr - 6) * Math.sin(ang(n)), C.text, 3);
        txt(c, n.toFixed(0) + ' rpm', dx, dy + 34, C.text, 'center', 14, 'bold');
        txt(c, 'orange: field weakening', dx, dy + 80, C.muted, 'center', 10);
        Fr.done();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ dc-universal */
  // a 230 V, about 1 kW universal motor: R = 8 Ω, L = 47.7 mH (X = 15 Ω at 50 Hz), k = 0.01356 V·s/(rad·A)
  const UM = { V: 230, f: 50, R: 8, L: 0.0477, k: 0.01356, J: 2e-4, Tc: 0.01, cf: 6.7e-9 };
  Hyper.sim('dc-universal', {
    title: 'A universal motor on AC and DC',
    blurb: `A 230 V, 1 kW universal motor, as in a vacuum cleaner or an angle grinder, fed through a triac or from DC. The oscilloscope shows the last two mains cycles: the voltage reaching the motor (yellow), the current (blue) and the torque (pink). Field and armature carry the same current, so the torque, proportional to the current squared, is never negative. The graph compares the speed–torque curves on 230 V DC and on 230 V AC with the running point.

**Try this**
- On AC with the firing angle at 0°, look at the torque: humps at 100 Hz, always positive. Switch to DC: the torque is steady and the motor runs a few per cent faster at the same load, because the winding reactance no longer takes part of the voltage.
- Raise the firing angle to 90° and 120°: the voltage arrives in slices, the current becomes pulses and the speed falls — and it falls much further when you add load. That is a plain triac speed control.
- Tick *Hold speed with a tachogenerator*: the controller now moves the firing angle itself; add load and watch it fire earlier to hold the speed.
- Set the load to zero: the speed climbs past 40 000 rpm, limited only by the fan and friction.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const [g1] = graphs(box, 1);
      let V = null, w = radOf(20000), i = 0, tm = 0, cond = false, sgn = 1, alphaT = 60, aInt = 60, lastPlot = -1, t = 0;
      const buf = [], Wbuf = 0.04, hs = 2e-5;
      const ctl = kit.controls(box.side, [
        { id: 'sup', type: 'select', label: 'Supply', options: [['230 V AC, 50 Hz, through a triac', 'ac'], ['230 V DC', 'dc']], value: 'ac' },
        { id: 'alpha', label: 'Triac firing angle', min: 0, max: 150, step: 1, value: 0, unit: '°' },
        { id: 'load', label: 'Load torque', min: 0, max: 0.6, step: 0.01, value: 0.29, unit: 'N·m' },
        { id: 'tacho', type: 'check', label: 'Hold speed with a tachogenerator', value: false },
        { id: 'nset', label: 'Speed set-point (tacho loop)', min: 5000, max: 30000, step: 500, value: 15000, unit: 'rpm' }
      ], id => { if (id === 'sup') { ctl.show('alpha', V.sup === 'ac'); ctl.show('tacho', V.sup === 'ac'); ctl.show('nset', V.sup === 'ac'); } lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed'], ['a', 'Firing angle'], ['I', 'RMS current'], ['T', 'Average torque'], ['P', 'Input power · power factor'], ['eta', 'Useful output · efficiency']]);
      const pl = kit.plot(g1, { x: { label: 'average torque (N·m)', min: 0, max: 0.8 }, y: { label: 'speed (rpm)', min: 0, max: 50000 }, legend: true }, 190);
      const Tf = ww => UM.Tc + UM.cf * ww * ww;
      const Vpk = UM.V * Math.SQRT2, wm = TAU * UM.f;
      const loop = kit.loop(dt => {
        const alpha = V.sup === 'ac' ? (V.tacho ? alphaT : V.alpha) : 0;
        const steps = Math.round(dt / hs);
        for (let k = 0; k < steps; k++) {
          tm += hs;
          let v = 0;
          if (V.sup === 'dc') { v = UM.V; cond = true; sgn = 1; }
          else {
            const ph = (wm * tm) % TAU, half = ph % Math.PI, s = ph < Math.PI ? 1 : -1;
            if (!cond && half >= alpha * Math.PI / 180) { cond = true; sgn = s; }
            v = cond ? Vpk * Math.sin(ph) : 0;
          }
          if (cond) {
            const ni = (i + hs / UM.L * v) / (1 + hs * (UM.R + UM.k * w) / UM.L);
            if (V.sup === 'ac' && ni * sgn <= 0) { i = 0; cond = false; v = 0; } else i = ni;
          } else i = 0;
          const T = UM.k * i * i, TL = V.load;
          w = Math.max(0, w + hs * (T - Tf(w) - (w > 1 || T > TL + Tf(w) ? TL : Math.max(0, T - Tf(w)))) / UM.J);
          if (k % 5 === 0) { buf.push([tm, cond ? v : 0, i, T]); }
        }
        while (buf.length && buf[0][0] < tm - Wbuf) buf.shift();
        t += dt;
        // averages over the last mains cycle
        let n2 = 0, si2 = 0, sT = 0, sP = 0, sv2 = 0;
        for (const b of buf) if (b[0] >= tm - 0.02) { n2++; si2 += b[2] * b[2]; sT += b[3]; sP += b[1] * b[2]; }
        n2 = Math.max(1, n2);
        const Irms = Math.sqrt(si2 / n2), Tav = sT / n2, Pin = sP / n2, n = rpmOf(w);
        sv2 = V.sup === 'dc' ? UM.V : UM.V;
        const pf = Irms > 1e-3 ? Pin / (sv2 * Irms) : 0, Pout = V.load * w;
        if (V.sup === 'ac' && V.tacho) {
          const e = V.nset - n;
          aInt = clamp(aInt - 0.004 * e * dt, 0, 150);
          alphaT = clamp(aInt - 0.001 * e, 0, 150);
        }
        ro.set('n', n.toFixed(0) + ' rpm'); ro.set('a', V.sup === 'dc' ? '— (DC)' : alpha.toFixed(0) + '°' + (V.tacho ? ' (set by the tacho loop)' : ''));
        ro.set('I', Irms.toFixed(2) + ' A'); ro.set('T', Tav.toFixed(3) + ' N·m');
        ro.set('P', Pin.toFixed(0) + ' W · ' + pf.toFixed(2)); ro.set('eta', Pout.toFixed(0) + ' W · ' + (Pin > 1 ? (100 * Pout / Pin).toFixed(0) : '0') + ' %');
        if (t - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = t;
          const ac = [], dcp = [];
          for (let j = 1; j <= 80; j++) {
            const I = 12 * j / 80, T = UM.k * I * I, X = wm * UM.L;
            if (I * X < UM.V) { const om = (Math.sqrt(UM.V * UM.V - I * I * X * X) - I * UM.R) / (UM.k * I); if (om > 0 && rpmOf(om) < 50000) ac.push([T, rpmOf(om)]); }
            const od = (UM.V - I * UM.R) / (UM.k * I); if (od > 0 && rpmOf(od) < 50000) dcp.push([T, rpmOf(od)]);
          }
          pl.set({ series: [{ pts: ac, label: '230 V AC, full wave' }, { pts: dcp, label: '230 V DC', dash: [5, 4] }], marks: [{ x: Tav, y: n, label: 'running' }] });
        }
        // drawing: the motor and the oscilloscope
        const Fr = frame(st, 640, 260), c = Fr.c, C = kit.colors(), S = kit.schem;
        const mx = 95, my = 110;
        c.fillStyle = C.surface2; c.fillRect(mx - 75, my - 70, 150, 140); c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(mx - 75, my - 70, 150, 140);
        for (let y = my - 66; y < my + 70; y += 6) { c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(mx - 73, y); c.lineTo(mx - 50, y); c.moveTo(mx + 50, y); c.lineTo(mx + 73, y); c.stroke(); }
        const fcol = 'hsl(205 80% 55% / ' + (0.2 + 0.7 * clamp(Math.abs(i) / 8, 0, 1)).toFixed(2) + ')';
        c.fillStyle = fcol; c.fillRect(mx - 50, my - 36, 14, 72); c.fillRect(mx + 36, my - 36, 14, 72);
        c.fillStyle = C.bg2; c.beginPath(); c.arc(mx, my, 32, 0, TAU); c.fill(); c.strokeStyle = C.muted; c.stroke();
        const ra = (tm * w / 400) % TAU;
        c.strokeStyle = C.accent; c.lineWidth = 3; for (let k = 0; k < 4; k++) { const a = ra + k * Math.PI / 4; c.beginPath(); c.moveTo(mx - 28 * Math.cos(a), my - 28 * Math.sin(a)); c.lineTo(mx + 28 * Math.cos(a), my + 28 * Math.sin(a)); c.stroke(); }
        txt(c, 'field coil', mx - 43, my + 52, C.muted, 'center', 10); txt(c, 'field coil', mx + 43, my + 52, C.muted, 'center', 10);
        txt(c, 'laminated stator', mx, my - 76, C.muted, 'center', 11);
        txt(c, 'armature drawn 400 × slower', mx, my + 90, C.muted, 'center', 10);
        const t0 = tm - Wbuf;
        S.scope(c, 200, 16, 420, 200, { tdiv: 0.004, t0, traces: [
          { pts: buf.map(b => [b[0], b[1]]), vdiv: 100, label: 'v', unit: 'V' },
          { pts: buf.map(b => [b[0], b[2]]), vdiv: 3, label: 'i', unit: 'A' },
          { pts: buf.map(b => [b[0], b[3]]), vdiv: 0.3, offset: -3, label: 'T', unit: 'N·m' }
        ] });
        txt(c, 'the torque trace (T) is shifted down: its zero is the lowest grid line', 410, 250, C.muted, 'center', 10);
        Fr.done();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ dc-commutator */
  // an industrial DC motor: 150 mm commutator, 10 mm brushes, coils of 60 µH carrying 20 A at rated load, 1 500 rpm.
  // A brush's contact drop hardly changes with current, so its effective resistance falls as the current rises (∝ I^-0.8 here).
  const CM = { D: 0.15, wb: 0.010, L: 60e-6, r: 0.003, Icr: 20, nr: 1500, area: 5 };
  const GRADES = { eg: { name: 'Electrographite', Rb: 0.025 }, mg: { name: 'Copper-graphite (metal-graphite)', Rb: 0.0075 }, rb: { name: 'Resin-bonded graphite', Rb: 0.06 } };
  // one commutation, integrated implicitly: L di/dt = −e_c − r i + R_lead (Ic − i) − R_trail (Ic + i), contact resistance ∝ 1/overlap
  function commutate(Ic, tc, Rb, ec, N) {
    N = N || 300;
    const h = tc / N, pts = [[0, Ic]];
    let i = Ic;
    for (let k = 1; k < N; k++) {
      const tau = k / N, a = CM.L / h + CM.r + Rb / tau + Rb / (1 - tau);
      i = (CM.L / h * i - ec + Rb * Ic / tau - Rb * Ic / (1 - tau)) / a;
      pts.push([tau, i]);
    }
    return { pts, end: i, resid: Ic + i };
  }
  Hyper.sim('dc-commutator', {
    title: 'Commutation under a brush',
    blurb: `The commutator unrolled: copper segments (with mica between them) slide to the left under a carbon brush. While the brush touches two segments, the coil joining them (drawn above) is short-circuited, and in that commutation time its current must reverse from +I to −I. The first graph shows the coil current during commutation: dashed, the ideal straight-line reversal; solid, what the coil's inductance allows. Whatever current is still flowing when the trailing segment leaves the brush jumps the gap as a spark. The second graph shows that leftover current against the load.

**Try this**
- With no compensation, raise the load or the speed: the reactance voltage grows, the reversal lags, and the spark at the trailing edge grows.
- Choose *interpoles*: their voltage follows the current, and the reversal stays clean at every load and speed (the second graph stays near zero). Set the interpole strength to 150 %: over-commutation — the current overshoots and sparks again.
- Choose *brush shift* at 5°: clean at rated load, but at light load it over-commutates and at overload it under-commutates. A shift is right at one load only.
- Compare brush grades: high-resistance resin-bonded brushes force a straighter reversal (resistance commutation) but drop more voltage; copper-graphite drops little but commutates badly here — it belongs in low-voltage motors, whose reactance voltage is small.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const [g1, g2] = graphs(box, 2);
      let V = null, ph = 0, t = 0, lastPlot = -1, res = null;
      const ctl = kit.controls(box.side, [
        { id: 'load', label: 'Armature current, % of rated', min: 10, max: 200, step: 5, value: 100, unit: '%' },
        { id: 'n', label: 'Speed', min: 200, max: 3000, step: 50, value: 1500, unit: 'rpm' },
        { id: 'comp', type: 'select', label: 'Commutation aid', options: [['None', 'none'], ['Brush shift', 'shift'], ['Interpoles', 'ip']], value: 'none' },
        { id: 'shift', label: 'Brush shift (against rotation)', min: 0, max: 10, step: 0.5, value: 5, unit: '°' },
        { id: 'ips', label: 'Interpole strength', min: 50, max: 150, step: 5, value: 100, unit: '%' },
        { id: 'grade', type: 'select', label: 'Brush grade', options: Object.keys(GRADES).map(k => [GRADES[k].name, k]), value: 'eg' }
      ], id => { if (id === 'comp') { ctl.show('shift', V.comp === 'shift'); ctl.show('ips', V.comp === 'ip'); } lastPlot = -1; });
      V = ctl.values; ctl.show('shift', false); ctl.show('ips', false);
      const ro = kit.readout(box.side, [['tc', 'Commutation time'], ['er', 'Reactance voltage'], ['ec', 'Commutating voltage'], ['res', 'Current left at the trailing edge'], ['sp', 'Sparking'], ['drop', 'Brush drop · current density'], ['wear', 'Brush wear (relative)'], ['cps', 'Commutations per second']]);
      const pI = kit.plot(g1, { x: { label: 'fraction of the commutation time', min: 0, max: 1 }, y: { label: 'coil current (A)', min: -50, max: 50 }, legend: true }, 180);
      const pR = kit.plot(g2, { x: { label: 'armature current (% of rated)', min: 0, max: 200 }, y: { label: 'current left, % of coil current', min: -60, max: 100 }, legend: true }, 180);
      const tcOf = n => CM.wb / (Math.PI * CM.D * n / 60);
      const ecOf = (Ic, n) => {
        const tc = tcOf(n), erRated = CM.L * 2 * CM.Icr / tcOf(CM.nr);
        if (V.comp === 'ip') return V.ips / 100 * CM.L * 2 * Ic / tc;
        if (V.comp === 'shift') return erRated / 5 * V.shift * n / CM.nr;
        return 0;
      };
      const RbAt = pct => GRADES[V.grade].Rb * Math.pow(100 / pct, 0.8);
      const solve = (pct, n) => { const Ic = CM.Icr * pct / 100; return commutate(Ic, tcOf(n), RbAt(pct), ecOf(Ic, n)); };
      const loop = kit.loop(dt => {
        t += dt; ph = (ph + dt / 1.6) % 1;
        const Ic = CM.Icr * V.load / 100, tc = tcOf(V.n), er = CM.L * 2 * Ic / tc, ec = ecOf(Ic, V.n);
        if (!res || lastPlot < 0 || t - lastPlot > 0.3) res = solve(V.load, V.n);
        const rf = res.resid / Math.max(1e-9, Ic), ar = Math.abs(rf);
        const spark = ar < 0.1 ? 'none visible (black commutation)' : ar < 0.25 ? 'slight, pinpoint' : ar < 0.5 ? 'clear sparking' : 'heavy — burning the segments';   // illustrative grades
        const Rb = RbAt(V.load);
        ro.set('tc', (tc * 1000).toFixed(2) + ' ms'); ro.set('er', er.toFixed(2) + ' V'); ro.set('ec', ec.toFixed(2) + ' V');
        ro.set('res', res.resid.toFixed(1) + ' A (' + (100 * rf).toFixed(0) + ' %)' + (rf < -0.05 ? ' — over-commutated' : ''));
        ro.set('sp', spark); ro.set('drop', (Rb * 2 * Ic).toFixed(2) + ' V per brush · ' + (2 * Ic / CM.area).toFixed(1) + ' A/cm²');
        ro.set('wear', '× ' + ((V.n / CM.nr) * (1 + 8 * rf * rf)).toFixed(2) + ' (illustrative: rated speed with clean commutation = 1)');
        ro.set('cps', (V.n / 60 * 48).toFixed(0) + ' per brush (48 segments)');
        if (t - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = t;
          const lin = [[0, Ic], [1, -Ic]], rr = [], rn = [], ri = [];
          for (let p = 10; p <= 200; p += 10) {
            const Icp = CM.Icr * p / 100, tcn = tcOf(V.n), Rp = RbAt(p), r0 = commutate(Icp, tcn, Rp, 0, 120), rsel = commutate(Icp, tcn, Rp, ecOf(Icp, V.n), 120);
            rn.push([p, 100 * r0.resid / Icp]); rr.push([p, 100 * rsel.resid / Icp]);
          }
          const C = kit.colors();
          const ser = [{ pts: rr, label: V.comp === 'none' ? 'no aid' : V.comp === 'ip' ? 'interpoles' : 'brush shift ' + V.shift + '°' }];
          if (V.comp !== 'none') ser.push({ pts: rn, label: 'no aid', dash: [5, 4], color: C.muted });
          pI.set({ y: { label: 'coil current (A)', min: -1.4 * CM.Icr * 2, max: 1.4 * CM.Icr * 2 }, series: [{ pts: res.pts, label: 'coil current' }, { pts: lin, label: 'ideal', dash: [5, 4], color: C.muted }], hlines: [{ y: -Ic, label: '−I' }, { y: Ic, label: '+I' }] });
          pR.set({ series: ser, marks: [{ x: V.load, y: 100 * rf }], hlines: [{ y: 0 }] });
        }
        // drawing: the unrolled commutator moving left under the brush
        const Fr = frame(st, 640, 220), c = Fr.c, C = kit.colors();
        const pitch = 90, bx = 320, by = 120, bw = pitch - 8;
        const off = ph * pitch, trailing = ph;
        c.fillStyle = C.faint; c.fillRect(20, by, 600, 40);
        for (let k = -4; k <= 5; k++) {
          const x = bx - bw / 2 + k * pitch - off;
          if (x > 620 || x + pitch - 8 < 20) continue;
          const x0 = Math.max(20, x), x1 = Math.min(620, x + pitch - 8);
          c.fillStyle = 'hsl(30 65% 48%)'; c.fillRect(x0, by, x1 - x0, 40);
          if (x > 20 && x < 620) { c.fillStyle = C.bg2; c.fillRect(x - 8, by, 8, 40); }
        }
        txt(c, '← segments move this way', 110, by + 58, C.muted, 'center', 11);
        txt(c, 'mica', 470, by + 58, C.muted, 'center', 11);
        // the brush and its shunt
        c.fillStyle = C.muted; c.fillRect(bx - bw / 2, by - 58, bw, 58); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(bx - bw / 2, by - 58, bw, 58);
        txt(c, 'brush', bx, by - 64, C.text, 'center', 12, 'bold');
        // the coil under commutation: its current now, from the solved curve
        const idx = Math.min(res.pts.length - 1, Math.floor(trailing * res.pts.length)), iNow = res.pts[idx][1];
        const xT = bx - bw / 2 - off + pitch / 2 - 4 - pitch * 0, xL = xT + pitch;
        c.strokeStyle = 'hsl(28 90% 55%)'; c.lineWidth = 2 + 3 * Math.min(1, Math.abs(iNow) / (2 * CM.Icr));
        c.beginPath(); c.moveTo(xT, by + 40); c.lineTo(xT, 196); c.lineTo(xL, 196); c.lineTo(xL, by + 40); c.stroke();
        txt(c, 'coil current ' + iNow.toFixed(1) + ' A', (xT + xL) / 2, 214, C.text, 'center', 12);
        // contact currents: trailing (Ic + i) and leading (Ic − i)
        const iT = Ic + iNow, iLd = Ic - iNow;
        txt(c, 'trailing edge ' + iT.toFixed(1) + ' A', bx - bw / 2 - 4, by - 20, C.muted, 'right', 11);
        txt(c, 'leading edge ' + iLd.toFixed(1) + ' A', bx + bw / 2 + 4, by - 20, C.muted, 'left', 11);
        // the spark as the trailing segment leaves
        if (trailing > 0.8 && ar > 0.1) {
          const s = 8 + 30 * Math.min(1, ar), sx = bx - bw / 2, sy = by;
          c.fillStyle = 'hsl(48 100% 60% / .9)';
          c.beginPath();
          for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5, r = k % 2 ? s * 0.35 : s * (0.7 + 0.3 * Math.random()); k ? c.lineTo(sx + r * Math.cos(a), sy + r * Math.sin(a)) : c.moveTo(sx + r * Math.cos(a), sy + r * Math.sin(a)); }
          c.closePath(); c.fill();
        }
        txt(c, 'commutation ' + (100 * trailing).toFixed(0) + ' % done (drawn slowed down: really ' + (tc * 1000).toFixed(2) + ' ms)', 320, 18, C.muted, 'center', 12);
        Fr.done();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ dc-pwm-lab */
  const PWMM = {
    iron: { name: 'Iron-core 24 V, 100 W (L = 0.4 mH)', R: 0.5, L: 0.4e-3, K: 0.055, I0: 0.25, J: 6e-5 },
    coreless: { name: 'Coreless 24 V, 40 W (L = 50 µH)', R: 1.1, L: 50e-6, K: 0.03, I0: 0.08, J: 1e-5 }
  };
  // one PWM period of a low-side switch with a freewheeling diode (drop Vd), back-EMF E: the periodic steady state,
  // continuous or discontinuous; returns samples and averages
  function pwmPeriod(m, Vs, D, f, E, n) {
    n = n || 160;
    const T = 1 / f, tau = m.L / m.R, Vd = 0.7, Ion = (Vs - E) / m.R, Ioff = (-Vd - E) / m.R;
    const a = Math.exp(-D * T / tau), b = Math.exp(-(1 - D) * T / tau);
    let i0 = (Ion * (1 - a) * b + Ioff * (1 - b)) / (1 - a * b);   // current at the start of the on-time (continuous)
    let dcm = false;
    if (!(i0 > 0)) { i0 = 0; dcm = true; }
    const pts = [];
    let sI = 0, sI2 = 0, sV = 0, sOn2 = 0, sDiode = 0, iMax = 0, iMin = Infinity, iEdge = 0;
    const iOnEnd = Ion + (i0 - Ion) * a;
    for (let k = 0; k <= n; k++) {
      const tt = k / n * T;
      let i, v;
      if (tt <= D * T) { i = Math.max(0, Ion + (i0 - Ion) * Math.exp(-tt / tau)); v = Vs; }
      else { const u = tt - D * T; i = Ioff + (Math.max(0, iOnEnd) - Ioff) * Math.exp(-u / tau); if (i <= 0) { i = 0; v = E; } else v = -Vd; }
      if (D <= 0) { i = 0; v = E; }
      pts.push([tt, i, v]);
      if (k < n) { sI += i; sI2 += i * i; sV += v; if (tt <= D * T) sOn2 += i * i; else sDiode += i; }
      iMax = Math.max(iMax, i); iMin = Math.min(iMin, i);
    }
    iEdge = Math.max(0, iOnEnd);
    return { pts, dcm: dcm || iMin <= 1e-6 && D > 0 && D < 1, Iavg: sI / n, Irms: Math.sqrt(sI2 / n), Vavg: sV / n, ripple: iMax - iMin, onI2: sOn2 / n, diodeI: sDiode / n, iEdge, T };
  }
  Hyper.sim('dc-pwm-lab', {
    title: 'PWM into a DC motor',
    blurb: `A low-side MOSFET switches a 24 V motor on and off; when it is off, the winding's current carries on through the freewheeling diode. The circuit (animated very slowly) lights the path the current takes; the traces show three PWM periods of the motor voltage and current, drawn at the real time scale. The meter shows where the PWM frequency sits against human hearing. The graphs, against frequency: the current ripple, and the two losses that pull in opposite directions — extra copper loss from ripple, and switching loss.

**Try this**
- Start at 1 kHz and 50 % duty: a big sawtooth ripple (the current even stops in each period), an audible whine and a copper loss far above that of smooth DC. Raise the frequency to 20 kHz: the ripple shrinks in proportion, the current flows continuously and the whine leaves the audible range.
- Move the duty cycle: the ripple is largest at 50 % and vanishes at 0 and 100 %.
- Choose the coreless motor at 20 kHz: its tiny inductance gives a ripple several times its average current. It needs 100 kHz, or a choke.
- Make the edges slow (1 000 ns) and look at the loss graph: the switching loss rises with frequency, and the total has a minimum.
- Set 10 % duty with no load: the current stops in each period (discontinuous), the terminal voltage shows the back-EMF in the gap, and the average voltage is well above 10 % of 24 V.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 240 });
      const [g1, g2] = graphs(box, 2);
      let V = null, m = PWMM.iron, w = 0, t = 0, vis = 0, lastPlot = -1, P = null;
      const ctl = kit.controls(box.side, [
        { id: 'mot', type: 'select', label: 'Motor', options: Object.keys(PWMM).map(k => [PWMM[k].name, k]), value: 'iron' },
        { id: 'Vs', label: 'Supply voltage', min: 6, max: 48, step: 1, value: 24, unit: 'V' },
        { id: 'D', label: 'Duty cycle', min: 0, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'f', label: 'PWM frequency', min: 100, max: 100000, value: 1000, log: true, sig: 2, unit: 'Hz' },
        { id: 'ts', label: 'Switching edges (rise + fall)', min: 20, max: 2000, value: 100, log: true, sig: 2, unit: 'ns' },
        { id: 'load', label: 'Load torque', min: 0, max: 0.5, step: 0.01, value: 0.15, unit: 'N·m' }
      ], id => { if (id === 'mot') { m = PWMM[V.mot]; w = 0; } lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed'], ['v', 'Average motor voltage'], ['i', 'Average current · ripple'], ['rms', 'RMS current · extra copper loss'], ['mode', 'Current'], ['sw', 'Switching loss'], ['cd', 'MOSFET · diode conduction'], ['aud', 'Whine']]);
      const pR = kit.plot(g1, { x: { label: 'PWM frequency (Hz)', min: 100, max: 100000, log: true }, y: { label: 'ripple, peak to peak (A)', min: 0 }, legend: true }, 180);
      const pL = kit.plot(g2, { x: { label: 'PWM frequency (Hz)', min: 100, max: 100000, log: true }, y: { label: 'loss (W)', min: 0 }, legend: true }, 180);
      const Rds = 0.01;
      const loop = kit.loop(dt => {
        t += dt;
        const D = V.D / 100, f = V.f;
        const sub = 10, h = dt / sub;
        for (let k = 0; k < sub; k++) {
          P = pwmPeriod(m, V.Vs, D, f, m.K * w, 60);
          const Tm = m.K * Math.max(0, P.Iavg - m.I0), TL = V.load;
          w = Math.max(0, w + h * (Tm - (w > 0.5 || Tm > TL ? TL : Tm)) / m.J);
        }
        P = pwmPeriod(m, V.Vs, D, f, m.K * w, 200);
        const n = rpmOf(w), extra = P.Iavg > 1e-3 ? m.R * (P.Irms * P.Irms - P.Iavg * P.Iavg) : 0;
        const Psw = 0.5 * V.Vs * P.iEdge * V.ts * 1e-9 * f, Pc = Rds * P.onI2, Pd = 0.7 * P.diodeI;
        const audible = f >= 20 && f < 16000 ? 'loud whine at ' + (f / 1000).toFixed(1) + ' kHz' : f < 20000 ? 'faint whine (young ears)' : 'above hearing';
        ro.set('n', n.toFixed(0) + ' rpm'); ro.set('v', P.Vavg.toFixed(2) + ' V (D·V = ' + (D * V.Vs).toFixed(2) + ' V)');
        ro.set('i', P.Iavg.toFixed(2) + ' A · ' + P.ripple.toFixed(2) + ' A p-p');
        ro.set('rms', P.Irms.toFixed(2) + ' A · +' + (P.Iavg > 1e-3 ? 100 * (P.Irms * P.Irms / (P.Iavg * P.Iavg) - 1) : 0).toFixed(1) + ' % (' + extra.toFixed(2) + ' W)');
        ro.set('mode', P.dcm ? 'discontinuous: it stops in each period' : 'continuous');
        ro.set('sw', Psw.toFixed(3) + ' W'); ro.set('cd', Pc.toFixed(2) + ' W · ' + Pd.toFixed(2) + ' W'); ro.set('aud', audible);
        if (t - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = t;
          const rp = [], ls = [], lc = [], lt = [], E = m.K * w;
          for (let j = 0; j <= 40; j++) {
            const ff = 100 * Math.pow(1000, j / 40), q = pwmPeriod(m, V.Vs, D, ff, E, 80);
            const ex = q.Iavg > 1e-3 ? m.R * (q.Irms * q.Irms - q.Iavg * q.Iavg) : 0, sw = 0.5 * V.Vs * q.iEdge * V.ts * 1e-9 * ff;
            rp.push([ff, q.ripple]); lc.push([ff, ex]); ls.push([ff, sw]); lt.push([ff, ex + sw]);
          }
          const C = kit.colors();
          pR.set({ series: [{ pts: rp, label: 'ripple at this speed and duty' }], marks: [{ x: f, y: P.ripple }], vlines: [{ x: 20000, label: '20 kHz' }] });
          pL.set({ series: [{ pts: lc, label: 'extra copper loss (ripple)' }, { pts: ls, label: 'switching loss' }, { pts: lt, label: 'sum', color: C.text, dash: [5, 4] }], marks: [{ x: f, y: extra + Psw }] });
        }
        // drawing
        const Fr = frame(st, 640, 280), c = Fr.c, C = kit.colors(), S = kit.schem;
        vis = (vis + dt / 2.5) % 1;
        const on = D > 0 && vis < D, cur = P.Iavg > 0.01;
        const aCol = 'hsl(28 90% 55%)';
        S.rail(c, 110, 30, '+' + V.Vs + ' V');
        S.wire(c, [[110, 30], [110, 50]]); S.node(c, 110, 50);
        S.motor(c, 110, 50, 110, 140, { label: 'M' });
        S.wire(c, [[110, 50], [180, 50], [180, 70]]);
        S.diode(c, 180, 130, 180, 70, { label: 'freewheel', on: !on && cur });
        S.wire(c, [[180, 130], [180, 150], [110, 150]]); S.wire(c, [[110, 140], [110, 150]]); S.node(c, 110, 150);
        const q = S.nmos(c, 102, 190, { label: 'Q' });
        S.wire(c, [[110, 150], q.d]); S.ground(c, q.s[0], q.s[1]);
        S.led(c, q.g[0] - 12, q.g[1], on);
        txt(c, on ? 'gate on' : 'gate off', q.g[0] - 12, q.g[1] + 22, on ? C.ok : C.muted, 'center', 11);
        if (cur) {
          if (on) S.flow(c, [[110, 30], [110, 150], [q.d[0], q.d[1]], [q.s[0], q.s[1]]], t * 40, { color: aCol });
          else S.flow(c, [[110, 50], [110, 150], [180, 150], [180, 50], [110, 50]], t * 40, { color: aCol });
        }
        txt(c, 'circuit drawn ≈ ' + Math.max(1, Math.round(2.5 * f)).toLocaleString('en') + ' × slower', 120, 262, C.muted, 'center', 10);
        // three periods at the real time scale
        const gx = 250, gy = 20, gw = 370, gh = 150, per = P.T, Imax = Math.max(0.5, ...P.pts.map(p => p[1])) * 1.15;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
        const vy = v => gy + gh * 0.45 - (v / (V.Vs * 1.1)) * gh * 0.4, iy = i => gy + gh - 4 - (i / Imax) * gh * 0.5;
        c.strokeStyle = 'hsl(48 90% 50%)'; c.lineWidth = 1.8; c.beginPath();
        for (let r = 0; r < 3; r++) P.pts.forEach((p, k) => { const x = gx + gw * (r + p[0] / per) / 3, y = vy(p[2]); (r || k) ? c.lineTo(x, y) : c.moveTo(x, y); });
        c.stroke();
        c.strokeStyle = aCol; c.lineWidth = 2; c.beginPath();
        for (let r = 0; r < 3; r++) P.pts.forEach((p, k) => { const x = gx + gw * (r + p[0] / per) / 3, y = iy(p[1]); (r || k) ? c.lineTo(x, y) : c.moveTo(x, y); });
        c.stroke();
        c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(gx, iy(P.Iavg)); c.lineTo(gx + gw, iy(P.Iavg)); c.stroke(); c.setLineDash([]);
        txt(c, 'motor voltage (0 to ' + V.Vs + ' V)', gx + 4, gy + 12, 'hsl(48 90% 50%)', 'left', 11);
        txt(c, 'current (peak ' + Imax.toFixed(1) + ' A scale), dashed: average', gx + 4, gy + gh - 8 - gh * 0.5, aCol, 'left', 11);
        txt(c, '3 periods = ' + (3000 * per >= 1 ? (3000 * per).toFixed(2) + ' ms' : (3e6 * per).toFixed(0) + ' µs'), gx + gw, gy + gh + 14, C.muted, 'right', 11);
        // hearing meter: 10 Hz to 100 kHz, logarithmic
        const mx0 = 250, mw = 370, my0 = 214, lf = x => mx0 + mw * (Math.log10(x) - 1) / 4;
        c.fillStyle = C.faint; c.fillRect(mx0, my0, mw, 12);
        c.fillStyle = 'hsl(0 70% 55% / .45)'; c.fillRect(lf(20), my0, lf(20000) - lf(20), 12);
        c.fillStyle = 'hsl(0 80% 55% / .7)'; c.fillRect(lf(2000), my0, lf(5000) - lf(2000), 12);
        c.fillStyle = C.text; c.beginPath(); c.moveTo(lf(f), my0 - 2); c.lineTo(lf(f) - 6, my0 - 11); c.lineTo(lf(f) + 6, my0 - 11); c.closePath(); c.fill();
        for (const [x, l] of [[10, '10 Hz'], [100, '100'], [1000, '1 k'], [10000, '10 k'], [100000, '100 kHz']]) txt(c, l, lf(x), my0 + 26, C.muted, 'center', 10);
        txt(c, 'human hearing 20 Hz – 20 kHz (most sensitive 2–5 kHz)', mx0 + mw / 2, my0 + 42, C.muted, 'center', 10);
        Fr.done();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ dc-h-bridge */
  // the 24 V, 100 W motor on a MOSFET bridge (10 mΩ switches, body diodes 0.8 V) at 20 kHz, simulated switch by switch
  const HB = { R: 0.5, L: 0.4e-3, K: 0.055, I0: 0.25, Jm: 6e-5, Rds: 0.01, Vd: 0.8, C: 1e-3, Vsup: 24, Rsup: 0.05, fpwm: 20000, h: 2e-6, Vov: 36, toff: 0.3e-6, Lloop: 20e-9 };
  const HMODES = {
    fwd: { name: 'Forward: Q1 + Q4', on: [1, 0, 0, 1] },
    rev: { name: 'Reverse: Q3 + Q2', on: [0, 1, 1, 0] },
    coast: { name: 'Coast: all off', on: [0, 0, 0, 0] },
    brakeL: { name: 'Brake: Q2 + Q4 (low side)', on: [0, 1, 0, 1] },
    brakeH: { name: 'Brake: Q1 + Q3 (high side)', on: [1, 0, 1, 0] },
    slow: { name: 'PWM forward, slow decay', on: [1, 0, 0, 1], off: [0, 1, 0, 1] },
    fast: { name: 'PWM forward, fast decay', on: [1, 0, 0, 1], off: [0, 0, 0, 0] },
    lap: { name: 'Locked antiphase PWM', on: [1, 0, 0, 1], off: [0, 1, 1, 0] },
    shoot: { name: 'Q1 + Q2 together (shoot-through!)', on: [1, 1, 0, 0] }
  };
  // which element of each leg carries the motor current i (positive A → B): 'H' high channel, 'L' low channel,
  // 'DH' high diode, 'DL' low diode, null when the leg is open; and the leg's output voltage
  function legOf(hi, lo, i, left, Vb) {
    const out = left ? i > 0 : i < 0;          // current leaves the leg's mid-point into the motor
    if (hi) return { e: 'H', v: Vb };
    if (lo) return { e: 'L', v: 0 };
    return out ? { e: 'DL', v: -HB.Vd } : { e: 'DH', v: Vb + HB.Vd };
  }
  Hyper.sim('dc-h-bridge', {
    title: 'The H-bridge',
    blurb: `Four MOSFETs (Q1 and Q3 on the supply side, Q2 and Q4 on the ground side), each with its body diode, around a motor turning a flywheel. The bridge is simulated switch by switch at 20 kHz; the drawing lights the path the current really takes — through a transistor or a diode — slowed right down. The graphs record the speed, the motor current and the supply-rail voltage. On the right, the gate timing of one leg with its dead time.

**Try this**
- *Forward* to spin up, then *Brake (low side)*: the motor is shorted through Q2 and Q4, the current reverses and the flywheel stops quickly. Spin up again and *Coast*: the current dies in a millisecond through two diodes into the supply, then the flywheel spins on.
- Set a big flywheel, spin up with *Forward*, then choose *PWM slow decay* at 20 %: the average voltage drops below the back-EMF, the current turns negative and the flywheel's energy flows back into the rail — with the battery, tens of joules are recovered. Repeat with the *power supply*: the rail climbs within milliseconds until the driver trips on overvoltage. With the *brake chopper* the surplus goes into its resistor.
- Do the same with *fast decay*: its diodes cannot carry reverse current, so it cannot brake — the flywheel just coasts. *Reverse* at full speed is plugging: over 50 A, drawn from the supply.
- *Locked antiphase* at 50 % holds the motor at standstill with current still flowing.
- Shorten the dead time below the transistors' 0.3 µs turn-off time: the timing diagram shows both switches on together and the shoot-through current peaks.
- *Q1 + Q2 together*: the supply is shorted through one leg — the overcurrent protection trips at once.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.47, minH: 250 });
      const [g1, g2] = graphs(box, 2);
      let V = null, i = 0, w = 0, Vb = HB.Vsup, tp = 0, trip = '', chop = false, t = 0, lastPlot = -1, vis = 0, flowPh = 0;
      let Eret = 0, Echop = 0, Eloss = 0, VbMax = HB.Vsup, iAvgShow = 0;
      const hist = [];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Switch state', options: Object.keys(HMODES).map(k => [HMODES[k].name, k]), value: 'fwd' },
        { id: 'D', label: 'PWM duty cycle', min: 0, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'sup', type: 'select', label: 'Supply', options: [['24 V battery (can take energy back)', 'bat'], ['24 V power supply (cannot)', 'psu'], ['Power supply with a brake chopper', 'chop']], value: 'bat' },
        { id: 'Jl', label: 'Flywheel inertia', min: 0, max: 20, step: 0.5, value: 5, unit: 'kg·cm²' },
        { id: 'td', label: 'Dead time (timing diagram)', min: 0, max: 2, step: 0.05, value: 0.5, unit: 'µs' }
      ], id => { if (id === 'mode' || id === 'sup') { trip = ''; Eret = 0; Echop = 0; Eloss = 0; VbMax = Vb; } lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['st', 'State'], ['n', 'Speed'], ['i', 'Motor current (average)'], ['vb', 'Supply rail · highest'], ['e', 'Energy back to supply · in chopper'], ['loss', 'Bridge conduction loss'], ['dt', 'Dead time']]);
      const pS = kit.plot(g1, { x: { label: 'time (s)', min: -4, max: 0 }, y: { label: 'speed (rpm)', min: -4500, max: 4500 } }, 170);
      const pI = kit.plot(g2, { x: { label: 'time (s)', min: -4, max: 0 }, y: { label: 'current (A) · rail (V)', min: -60, max: 60 }, legend: true }, 170);
      const loop = kit.loop(dt => {
        t += dt;
        const md = HMODES[V.mode], J = HB.Jm + V.Jl * 1e-4, D = V.D / 100, steps = Math.round(dt / HB.h);
        let sI = 0, sLoss = 0, legs = null;
        for (let k = 0; k < steps; k++) {
          tp = (tp + HB.h * HB.fpwm) % 1;
          let on = md.off && tp >= D ? md.off : md.on;
          if (trip) on = [0, 0, 0, 0];
          if (on[0] && on[1] || on[2] && on[3]) { trip = 'shoot-through: overcurrent trip'; on = [0, 0, 0, 0]; }
          const E = HB.K * w;
          let dir = i !== 0 ? Math.sign(i) : 0;
          if (dir === 0) {
            // at zero current, see whether the circuit would drive current either way
            const lp = legOf(on[0], on[1], 1, true, Vb), rp = legOf(on[2], on[3], 1, false, Vb), ln = legOf(on[0], on[1], -1, true, Vb), rn = legOf(on[2], on[3], -1, false, Vb);
            if (lp.v - rp.v - E > 0) dir = 1; else if (ln.v - rn.v - E < 0) dir = -1;
          }
          if (dir === 0) { i = 0; legs = { l: { e: null }, r: { e: null } }; }
          else {
            const l = legOf(on[0], on[1], dir, true, Vb), r = legOf(on[2], on[3], dir, false, Vb);
            const nCh = (l.e === 'H' || l.e === 'L' ? 1 : 0) + (r.e === 'H' || r.e === 'L' ? 1 : 0);
            const Rt = HB.R + nCh * HB.Rds, vm = l.v - r.v;
            let ni = (i + HB.h / HB.L * (vm - E)) / (1 + HB.h * Rt / HB.L);
            const diode = l.e === 'DH' || l.e === 'DL' || r.e === 'DH' || r.e === 'DL';
            if (diode && ni * dir < 0) ni = 0;
            i = ni; legs = { l, r };
            // current drawn from the rail by the bridge
            const ib = ((l.e === 'H' || l.e === 'DH') ? i : 0) - ((r.e === 'H' || r.e === 'DH') ? i : 0);
            Vb += -HB.h * ib / HB.C;
            sLoss += nCh * HB.Rds * i * i + (diode ? HB.Vd * Math.abs(i) * ((l.e === 'DH' || l.e === 'DL') + (r.e === 'DH' || r.e === 'DL')) : 0);
          }
          // the supply and the chopper
          let isup = (HB.Vsup - Vb) / HB.Rsup;
          if (V.sup !== 'bat') isup = Math.max(0, isup);
          if (V.sup === 'chop') { if (Vb > 28.5) chop = true; else if (Vb < 27.5) chop = false; }
          const ich = V.sup === 'chop' && chop ? Vb / 2 : 0;
          Vb += HB.h * (isup - ich) / HB.C;
          if (isup < 0) Eret += -isup * Vb * HB.h;
          Echop += ich * Vb * HB.h;
          if (Vb > HB.Vov && !trip) trip = 'overvoltage trip: the rail passed 36 V';
          const Tm = HB.K * (i - Math.sign(i) * 0) - Math.sign(w) * HB.K * HB.I0;
          w += HB.h * Tm / J;
          if (Math.abs(w) < 0.05 && Math.abs(HB.K * i) < HB.K * HB.I0) w = 0;
          sI += i;
        }
        Eloss += sLoss * HB.h;
        VbMax = Math.max(VbMax, Vb);
        const Iav = sI / Math.max(1, steps), n = rpmOf(w);
        iAvgShow = Iav;
        hist.push([t, n, Iav, Vb]); while (hist.length && hist[0][0] < t - 4) hist.shift();
        ro.set('st', trip || md.name);
        ro.set('n', n.toFixed(0) + ' rpm'); ro.set('i', Iav.toFixed(2) + ' A');
        ro.set('vb', Vb.toFixed(1) + ' V · ' + VbMax.toFixed(1) + ' V');
        ro.set('e', Eret.toFixed(1) + ' J · ' + Echop.toFixed(1) + ' J'); ro.set('loss', (sLoss / Math.max(1, steps)).toFixed(2) + ' W');
        const ov = Math.max(0, HB.toff - V.td * 1e-6), ipk = Vb * ov / HB.Lloop;
        ro.set('dt', V.td.toFixed(2) + ' µs = ' + (100 * V.td * 1e-6 * HB.fpwm).toFixed(1) + ' % of the period on a diode' + (ov > 0 ? '; shoot-through peaks ≈ ' + ipk.toFixed(0) + ' A!' : '; no overlap'));
        if (t - lastPlot > 0.1 || lastPlot < 0) {
          lastPlot = t;
          const sp = hist.map(p => [p[0] - t, p[1]]), ip = hist.map(p => [p[0] - t, clamp(p[2], -60, 60)]), vp = hist.map(p => [p[0] - t, p[3]]);
          pS.set({ series: [{ pts: sp, label: 'speed' }] });
          pI.set({ series: [{ pts: ip, label: 'motor current' }, { pts: vp, label: 'supply rail' }], hlines: [{ y: HB.Vov, label: 'trip' }] });
        }
        // drawing the bridge at a slowed display phase
        vis = (vis + dt / 2.5) % 1;
        const onD = trip ? [0, 0, 0, 0] : (md.off && vis >= D ? md.off : md.on);
        const Fr = frame(st, 640, 300), c = Fr.c, C = kit.colors(), S = kit.schem;
        const top = 40, gnd = 270, xl = 180, xr = 330, ym = 150, aCol = 'hsl(28 90% 55%)';
        S.battery(c, 50, top, 50, gnd, { label: V.sup === 'bat' ? 'battery' : 'supply', value: HB.Vsup + ' V' });
        S.wire(c, [[50, top], [400, top]]); S.wire(c, [[50, gnd], [400, gnd]]);
        S.capacitor(c, 110, top, 110, gnd, { label: 'C', value: '1000 µF', polarized: true });
        S.node(c, 110, top); S.node(c, 110, gnd);
        const q = [S.nmos(c, xl - 8, 95, { label: 'Q1' }), S.nmos(c, xl - 8, 205, { label: 'Q2' }), S.nmos(c, xr - 8, 95, { label: 'Q3' }), S.nmos(c, xr - 8, 205, { label: 'Q4' })];
        S.wire(c, [[xl, top], q[0].d]); S.wire(c, [q[0].s, [xl, ym], q[1].d]); S.wire(c, [q[1].s, [xl, gnd]]);
        S.wire(c, [[xr, top], q[2].d]); S.wire(c, [q[2].s, [xr, ym], q[3].d]); S.wire(c, [q[3].s, [xr, gnd]]);
        const dx = [212, 212, 362, 362];
        [[95, 0], [205, 1], [95, 2], [205, 3]].forEach(([y, k]) => {
          const x = dx[k], legX = k < 2 ? xl : xr;
          S.wire(c, [[legX, y - 30], [x, y - 30]]); S.wire(c, [[legX, y + 30], [x, y + 30]]);
          S.diode(c, x, y + 30, x, y - 30, {});
        });
        S.motor(c, xl + 25, ym, xr - 25, ym, { label: 'M' }); S.wire(c, [[xl, ym], [xl + 25, ym]]); S.wire(c, [[xr - 25, ym], [xr, ym]]);
        S.node(c, xl, ym); S.node(c, xr, ym);
        txt(c, 'A', xl - 12, ym + 4, C.muted, 'center', 11); txt(c, 'B', xr + 12, ym + 4, C.muted, 'center', 11);
        q.forEach((p, k) => { S.led(c, p.g[0] - 10, p.g[1], !!onD[k]); });
        // the path of the current, from the leg elements for the present sign of the current
        const dirD = Math.abs(iAvgShow) > 0.05 ? Math.sign(iAvgShow) : 0;
        if (dirD) {
          const l = legOf(onD[0], onD[1], dirD, true, Vb), r = legOf(onD[2], onD[3], dirD, false, Vb);
          const legPath = (e, x, xd) => e === 'H' ? [[x, top], [x, ym]] : e === 'L' ? [[x, gnd], [x, ym]] : e === 'DH' ? [[x, top], [xd, 65], [xd, 125], [x, ym]] : [[x, gnd], [xd, 235], [xd, 175], [x, ym]];
          const lp = legPath(l.e, xl, 212), rp = legPath(r.e, xr, 362);
          // positive current flows from the left leg's source node through the motor into the right leg
          let path = lp.concat([[xr, ym]]).concat(rp.slice().reverse());
          if (dirD < 0) path = path.slice().reverse();
          flowPh += Math.min(40, Math.abs(iAvgShow) * 4) * dt;
          S.flow(c, path, flowPh * 10, { color: aCol });
        }
        if (trip) txt(c, trip.toUpperCase(), 225, 290, C.bad, 'center', 12, 'bold');
        else txt(c, md.off ? 'PWM shown slowed: on-state ' + (100 * D).toFixed(0) + ' % of each cycle' : '', 225, 290, C.muted, 'center', 11);
        // gate timing of one leg with dead time
        const gx = 440, gw = 185, T = 1 / HB.fpwm, sc = gw / T, tdS = V.td * 1e-6, onT = D * T;
        txt(c, 'one PWM period, left leg', gx, 30, C.muted, 'left', 11);
        const hiY = 60, loY = 110, amp = 22;
        c.lineWidth = 2;
        const trace = (y, segs, col) => { c.strokeStyle = col; c.beginPath(); c.moveTo(gx, y); segs.forEach(([a, b]) => { c.lineTo(gx + a * sc, y); c.lineTo(gx + a * sc, y - amp); c.lineTo(gx + b * sc, y - amp); c.lineTo(gx + b * sc, y); }); c.lineTo(gx + gw, y); c.stroke(); };
        const hiOn = [[0, Math.max(0, onT - tdS / 2)]], loOn = onT + tdS / 2 < T - tdS / 2 ? [[onT + tdS / 2, T - tdS / 2]] : [];
        trace(hiY, hiOn, C.accent); trace(loY, loOn, 'hsl(160 70% 45%)');
        txt(c, 'Q1 gate', gx - 4, hiY - 6, C.muted, 'right', 10); txt(c, 'Q2 gate', gx - 4, loY - 6, C.muted, 'right', 10);
        // the real conduction: each switch keeps conducting for its turn-off time after its gate falls
        const hiEnd = hiOn[0][1] + HB.toff, lo0 = loOn.length ? loOn[0][0] : T;
        const overlap = Math.max(0, hiEnd - lo0);
        c.fillStyle = overlap > 0 ? 'hsl(0 80% 55% / .5)' : 'hsl(160 60% 45% / .25)';
        c.fillRect(gx + hiOn[0][1] * sc, loY + 8, Math.max(2, (lo0 - hiOn[0][1]) * sc), 14);
        txt(c, overlap > 0 ? 'both conduct: shoot-through' : 'dead time: body diode conducts', gx, loY + 38, overlap > 0 ? C.bad : C.muted, 'left', 11);
        txt(c, 'Q1 still conducts ' + (HB.toff * 1e6).toFixed(1) + ' µs after its gate falls', gx, loY + 54, C.muted, 'left', 10);
        txt(c, '(time axis 50 µs; dead-time region widened for visibility)', gx, loY + 70, C.muted, 'left', 9);
        Fr.done();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ dc-driver-lab */
  // a generic 20 A (40 A peak) PWM driver board, 10–50 V, 20 kHz, 8 mΩ MOSFETs; three motors to drive
  const DRV = { Imax: 20, Rds: 0.008, ts: 150e-9, f: 20000, uvlo: 10, Tshut: 150, Tback: 120 };
  const DMOT = {
    m100: { name: '24 V, 100 W PMDC', R: 0.5, K: 0.055, I0: 0.25, J: 2e-4 },
    m250: { name: '24 V, 300 W PMDC', R: 0.15, K: 0.08, I0: 0.5, J: 6e-4 },
    m400: { name: '48 V, 400 W PMDC', R: 0.12, K: 0.11, I0: 0.4, J: 1e-3 }
  };
  const SINKS = { none: { name: 'No heatsink (board only)', Rth: 18, Cth: 8 }, small: { name: 'Small heatsink', Rth: 5, Cth: 60 }, large: { name: 'Large heatsink with airflow', Rth: 1.8, Cth: 250 } };
  // the DIP switches from the settings: SW1–2 input, SW3–4 current limit, SW5 ramp, SW6 stop, SW7 invert, SW8 IR compensation
  const INPUTS = ['pwm', 'ana5', 'rc', 'ana10'], LIMITS = [25, 50, 75, 100];
  Hyper.sim('dc-driver-lab', {
    title: 'A DC motor driver on the bench',
    blurb: `A generic 20 A PWM driver board (40 A peak, 10–50 V, 20 kHz) with its terminals, a bank of eight DIP switches, status LEDs and a heatsink. Choose the settings in the panel or click the switches on the board. The command signal is drawn as the input mode expects it: a PWM duty cycle with a direction line, an analogue voltage, or RC pulses of 1–2 ms. The graphs record the motor current against the limit and the transistor temperature against the thermal shutdown. Heating is shown 20 times faster than real time.

**Try this**
- Start with a command of 60 % and a load of 0.5 N·m, then *Stall the motor*: the current rises to the limit and stays there; the LIM LED lights. Lower the current limit with SW3–SW4 and see the stall torque fall with it.
- Choose the 300 W motor, a current limit of 100 %, a 1.2 N·m load and *No heatsink*: at about 15 A the transistors heat up past 150 °C and the driver shuts down, then restarts when cool. Fit the large heatsink and it runs indefinitely.
- Switch the input to *RC pulse*: a command of −50 % becomes 1.25 ms pulses and the motor runs in reverse.
- Compare the *brake* and *coast* stop settings (SW6) with *Enable* unticked: braking stops the motor in a fraction of a second.
- Tick IR compensation (SW8) and add load: the speed sags much less.
- Watch the supply readout: at part speed the supply current is well below the motor current — the driver works like a step-down converter.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 250 });
      const [g1, g2] = graphs(box, 2);
      let V = null, m = DMOT.m100, w = 0, duty = 0, Tj = 25, shut = false, t = 0, lastPlot = -1, Iout = 0, limiting = false, lastLoss = 0;
      const hist = [];
      const ctl = kit.controls(box.side, [
        { id: 'mot', type: 'select', label: 'Motor', options: Object.keys(DMOT).map(k => [DMOT[k].name, k]), value: 'm100' },
        { id: 'Vs', label: 'Supply voltage', min: 8, max: 50, step: 1, value: 24, unit: 'V' },
        { id: 'cmd', label: 'Command (− = reverse)', min: -100, max: 100, step: 1, value: 60, unit: '%' },
        { id: 'en', type: 'check', label: 'Enable (EN input)', value: true },
        { id: 'load', label: 'Load torque', min: 0, max: 3, step: 0.05, value: 0.5, unit: 'N·m' },
        { id: 'stall', type: 'check', label: 'Stall the motor (jam the shaft)', value: false },
        { id: 'inp', type: 'select', label: 'SW1–SW2: input', options: [['PWM + DIR', 'pwm'], ['Analogue 0–5 V + DIR', 'ana5'], ['RC pulse 1–2 ms', 'rc'], ['Analogue 0–10 V + DIR', 'ana10']], value: 'pwm' },
        { id: 'lim', type: 'select', label: 'SW3–SW4: current limit', options: [['25 % (5 A)', 25], ['50 % (10 A)', 50], ['75 % (15 A)', 75], ['100 % (20 A)', 100]], value: 50 },
        { id: 'ramp', type: 'select', label: 'SW5: ramp', options: [['Fast (0.2 s)', 'fast'], ['Slow (2 s)', 'slow']], value: 'fast' },
        { id: 'stop', type: 'select', label: 'SW6: stop mode', options: [['Brake', 'brake'], ['Coast', 'coast']], value: 'brake' },
        { id: 'inv', type: 'check', label: 'SW7: invert direction', value: false },
        { id: 'irc', type: 'check', label: 'SW8: IR compensation', value: false },
        { id: 'sink', type: 'select', label: 'Heatsink', options: Object.keys(SINKS).map(k => [SINKS[k].name, k]), value: 'small' },
        { id: 'Ta', label: 'Air temperature', min: 10, max: 60, step: 1, value: 30, unit: '°C' }
      ], id => { if (id === 'mot') { m = DMOT[V.mot]; w = 0; } lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['stat', 'Status'], ['sig', 'Command signal'], ['vo', 'Output voltage (average)'], ['io', 'Motor current'], ['n', 'Speed · shaft power'], ['loss', 'Driver loss'], ['tj', 'Transistor temperature'], ['sup', 'Supply current · power']]);
      const pI = kit.plot(g1, { x: { label: 'time (s)', min: -10, max: 0 }, y: { label: 'motor current (A)', min: -45, max: 45 }, legend: true }, 170);
      const pT = kit.plot(g2, { x: { label: 'time (s)', min: -10, max: 0 }, y: { label: 'transistor temperature (°C)', min: 0, max: 180 } }, 170);
      const dips = () => {
        const a = INPUTS.indexOf(V.inp), b = LIMITS.indexOf(+V.lim);
        return [!!(a & 1), !!(a & 2), !!(b & 1), !!(b & 2), V.ramp === 'slow', V.stop === 'coast', !!V.inv, !!V.irc];
      };
      // clicking a switch on the drawn board toggles it
      kit.click(st, p => {
        const q = toDesign(st, p, 640, 280), k = Math.floor((q.x - 250) / 22);
        if (q.y < 40 || q.y > 84 || k < 0 || k > 7) return;
        const d = dips(); d[k] = !d[k];
        ctl.set('inp', INPUTS[(d[0] ? 1 : 0) + (d[1] ? 2 : 0)]); ctl.set('lim', LIMITS[(d[2] ? 1 : 0) + (d[3] ? 2 : 0)]);
        ctl.set('ramp', d[4] ? 'slow' : 'fast'); ctl.set('stop', d[5] ? 'coast' : 'brake'); ctl.set('inv', d[6]); ctl.set('irc', d[7]);
        lastPlot = -1;
      }, p => { const q = toDesign(st, p, 640, 280); return q.y > 40 && q.y < 84 && q.x > 250 && q.x < 426; });
      const loop = kit.loop(dt => {
        t += dt;
        const sink = SINKS[V.sink], Ilim = DRV.Imax * V.lim / 100, uv = V.Vs < DRV.uvlo;
        if (Tj >= DRV.Tshut) shut = true; else if (shut && Tj < DRV.Tback) shut = false;
        const active = V.en && !shut && !uv;
        const cmd = (V.inv ? -1 : 1) * V.cmd / 100;
        const rate = V.ramp === 'slow' ? 0.5 : 5;                    // full scale per second
        const target = active ? cmd : 0;
        duty = duty < target ? Math.min(target, duty + rate * dt) : Math.max(target, duty - rate * dt);
        const sub = 20, h = dt / sub;
        let sumI2 = 0, sumI = 0, sumPin = 0;
        limiting = false;
        for (let k = 0; k < sub; k++) {
          const E = m.K * w;
          let vout, I;
          if (!active && V.stop === 'coast') { I = 0; vout = E; }
          else {
            vout = (active ? duty : 0) * V.Vs + (V.irc && active ? m.R * Iout * 0.8 : 0);
            vout = clamp(vout, -V.Vs, V.Vs);
            I = (vout - E) / m.R;
            if (Math.abs(I) > Ilim) { I = Math.sign(I) * Ilim; vout = E + I * m.R; limiting = true; }
          }
          Iout = I;
          const Tm = m.K * I - Math.sign(w) * m.K * m.I0 - (w > 0.01 ? V.load : w < -0.01 ? -V.load : 0);
          if (V.stall) w = 0;
          else {
            const Tdrv = m.K * I, Tres = V.load + m.K * m.I0;
            if (Math.abs(w) < 0.01 && Math.abs(Tdrv) <= Tres) w = 0;
            else w += h * Tm / m.J;
          }
          sumI2 += I * I; sumI += Math.abs(I); sumPin += vout * I;
        }
        const Irms = Math.sqrt(sumI2 / sub), Iav = sumI / sub, Pmot = sumPin / sub;
        const Rds = DRV.Rds * (1 + 0.006 * (Tj - 25));
        const swOn = active || V.stop === 'brake';
        const Pcond = 2 * Irms * Irms * Rds, Psw = swOn ? 0.5 * V.Vs * Iav * DRV.ts * DRV.f : 0, Pq = uv ? 0.1 : 0.4 + 0.012 * V.Vs;
        const Ploss = Pcond + Psw + Pq;
        lastLoss = Ploss;
        Tj += 20 * dt * (Ploss - (Tj - V.Ta) / sink.Rth) / sink.Cth;
        const Psup = Math.max(0, Pmot) + Ploss, Isup = Psup / V.Vs, n = rpmOf(w);
        hist.push([t, Iout, Tj]); while (hist.length && hist[0][0] < t - 10) hist.shift();
        const stat = uv ? 'undervoltage lockout (below 10 V)' : shut ? 'THERMAL SHUTDOWN — cooling' : !V.en ? (V.stop === 'brake' ? 'disabled: braking' : 'disabled: coasting') : limiting ? 'current limiting at ' + Ilim.toFixed(0) + ' A' : 'running';
        const sig = V.inp === 'pwm' ? 'PWM ' + Math.abs(V.cmd).toFixed(0) + ' % duty, DIR ' + (V.cmd >= 0 ? 'high' : 'low')
          : V.inp === 'ana5' ? (5 * Math.abs(V.cmd) / 100).toFixed(2) + ' V on AIN (0–5 V), DIR ' + (V.cmd >= 0 ? 'high' : 'low')
          : V.inp === 'ana10' ? (10 * Math.abs(V.cmd) / 100).toFixed(2) + ' V on AIN (0–10 V), DIR ' + (V.cmd >= 0 ? 'high' : 'low')
          : (1.5 + 0.5 * V.cmd / 100).toFixed(3) + ' ms pulses every 20 ms';
        ro.set('stat', stat); ro.set('sig', sig); ro.set('vo', (Iout !== 0 || active ? (m.K * w + Iout * m.R) : 0).toFixed(1) + ' V');
        ro.set('io', Iout.toFixed(2) + ' A (limit ' + Ilim.toFixed(0) + ' A)'); ro.set('n', n.toFixed(0) + ' rpm · ' + (V.load * Math.abs(w)).toFixed(0) + ' W');
        ro.set('loss', Ploss.toFixed(2) + ' W (conduction ' + Pcond.toFixed(2) + ', switching ' + Psw.toFixed(2) + ', electronics ' + Pq.toFixed(2) + ')');
        ro.set('tj', Tj.toFixed(0) + ' °C'); ro.set('sup', Isup.toFixed(2) + ' A · ' + Psup.toFixed(0) + ' W');
        if (t - lastPlot > 0.2 || lastPlot < 0) {
          lastPlot = t;
          pI.set({ series: [{ pts: hist.map(p => [p[0] - t, p[1]]), label: 'motor current' }], hlines: [{ y: Ilim, label: 'limit' }, { y: -Ilim }] });
          pT.set({ series: [{ pts: hist.map(p => [p[0] - t, p[2]]), label: 'transistors' }], hlines: [{ y: DRV.Tshut, label: 'shutdown' }] });
        }
        // the board
        const Fr = frame(st, 640, 280), c = Fr.c, C = kit.colors();
        c.fillStyle = 'hsl(150 35% 22%)'; c.fillRect(60, 30, 480, 200); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(60, 30, 480, 200);
        txt(c, 'DC MOTOR DRIVER · 10–50 V · 20 A (40 A peak) · 120 × 80 mm', 300, 222, 'hsl(150 20% 80%)', 'center', 10);
        // terminal blocks
        const term = (x, y, labels, side) => labels.forEach((l, k) => {
          c.fillStyle = 'hsl(145 50% 40%)'; c.fillRect(x, y + k * 26, 30, 22); c.fillStyle = C.bg2; c.beginPath(); c.arc(x + 15, y + k * 26 + 11, 6, 0, TAU); c.fill();
          txt(c, l, side < 0 ? x - 6 : x + 36, y + k * 26 + 15, C.text, side < 0 ? 'right' : 'left', 11, 'bold');
        });
        term(62, 90, ['V+', 'GND'], -1); term(508, 90, ['M+', 'M−'], 1);
        txt(c, V.Vs + ' V', 30, 160, C.muted, 'center', 11); txt(c, Iout.toFixed(1) + ' A', 590, 160, C.muted, 'center', 11);
        // DIP switches
        const d = dips();
        c.fillStyle = 'hsl(0 70% 45%)'; c.fillRect(246, 40, 182, 46);
        d.forEach((on, k) => {
          const x = 252 + k * 22;
          c.fillStyle = C.bg2; c.fillRect(x, 46, 14, 30);
          c.fillStyle = '#eee'; c.fillRect(x + 2, on ? 48 : 60, 10, 14);
          txt(c, String(k + 1), x + 7, 94, C.text, 'center', 10);
        });
        txt(c, 'ON ↑', 434, 54, C.text, 'left', 10); txt(c, 'click to toggle', 434, 70, 'hsl(150 20% 80%)', 'left', 9);
        // LEDs
        const led = (x, lab, on, col) => { c.fillStyle = on ? col : C.faint; c.beginPath(); c.arc(x, 120, 6, 0, TAU); c.fill(); txt(c, lab, x, 140, C.text, 'center', 10); };
        led(140, 'PWR', !uv, C.ok); led(175, 'RUN', active && Math.abs(Iout) > 0.05, C.accent); led(210, 'LIM', limiting, C.warn); led(245, 'FLT', shut || uv, C.bad);
        // heatsink coloured by temperature
        const hot = clamp((Tj - 25) / 125, 0, 1);
        c.fillStyle = 'hsl(' + (220 - 220 * hot).toFixed(0) + ' 60% ' + (V.sink === 'none' ? 30 : 45) + '%)';
        if (V.sink !== 'none') for (let k = 0; k < 9; k++) c.fillRect(300 + k * 16, 110, 8, 60);
        else { c.fillRect(310, 140, 24, 18); c.fillRect(350, 140, 24, 18); c.fillRect(390, 140, 24, 18); c.fillRect(430, 140, 24, 18); }
        txt(c, 'MOSFETs ' + Tj.toFixed(0) + ' °C', 375, 186, C.text, 'center', 11, 'bold');
        // control header
        const pins = ['PWM', 'DIR', 'EN', 'AIN', 'RC', 'LIM+', 'LIM−', 'FLT', '+5V', 'GND'];
        pins.forEach((p, k) => { const x = 110 + k * 36; c.fillStyle = '#d4af37'; c.fillRect(x - 4, 196, 8, 8); txt(c, p, x, 190, 'hsl(150 20% 85%)', 'center', 9); });
        // the command signal as the chosen input sees it
        const sx = 110, sy = 262, sw = 330;
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        if (V.inp === 'pwm') { const dd = Math.abs(V.cmd) / 100; for (let k = 0; k < 6; k++) { const x0 = sx + k * sw / 6, x1 = x0 + dd * sw / 6; c.moveTo(x0, sy); c.lineTo(x0, sy - 18); c.lineTo(x1, sy - 18); c.lineTo(x1, sy); c.lineTo(x0 + sw / 6, sy); } }
        else if (V.inp === 'rc') { const pw = (1.5 + 0.5 * V.cmd / 100) / 20; for (let k = 0; k < 2; k++) { const x0 = sx + k * sw / 2, x1 = x0 + pw * sw / 2; c.moveTo(x0, sy); c.lineTo(x0, sy - 18); c.lineTo(x1, sy - 18); c.lineTo(x1, sy); c.lineTo(x0 + sw / 2, sy); } }
        else { const y = sy - 18 * Math.abs(V.cmd) / 100; c.moveTo(sx, y); c.lineTo(sx + sw, y); }
        c.stroke();
        txt(c, 'input', sx - 8, sy - 6, C.muted, 'right', 10);
        Fr.done();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ dc-braking-lab */
  const BR = { V: 24, R: 0.5, K: 0.055, I0: 0.25, Jm: 6e-5, Ilim: 30 };
  const BMETH = {
    coast: 'Coast (switch off)', dyn: 'Dynamic braking into a resistor', short: 'Short-circuit the armature',
    regen: 'Regenerative braking (drive into a battery)', plug: 'Plugging (reverse the supply)', mech: 'Friction brake'
  };
  Hyper.sim('dc-braking-lab', {
    title: 'Stopping a flywheel',
    blurb: `The 24 V, 100 W motor spins a flywheel. Press *Run up*, then *Brake now*: the motor is switched to the chosen braking circuit, drawn beside it. The first graph keeps the speed against time since braking for the last few stops, labelled, so you can compare methods; the second the current. The bars show where the flywheel's kinetic energy went.

**Try this**
- *Coast* first: only bearing and brush friction slow it — a long, straight run-down.
- *Dynamic braking* through 1 Ω: an exponential decay with a time constant J(R + R_b)/K² of about a quarter of a second; two thirds of the energy heats the resistor. Try 0.2 Ω and 5 Ω.
- *Short circuit*: the fastest passive stop, but the first current is close to the 48 A stall current.
- *Regenerative braking* at 10 A: a straight-line deceleration to zero, and more than half the energy goes back to the battery.
- *Plugging*: nearly 100 A at the first instant, and the winding heats with the kinetic energy plus about twice as much again from the supply. Untick *Cut off at zero speed* and it runs up backwards.
- None of these holds the flywheel once stopped — that is the job of a friction (holding) brake.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const [g1, g2] = graphs(box, 2);
      let V = null, w = radOf(4000), state = 'run', t = 0, tb = 0, lastPlot = -1, ang = 0, I = 0, Ipk = 0, tStop = null, E0 = 0;
      let En = { res: 0, cu: 0, ret: 0, sup: 0, fr: 0, brk: 0 };
      const runs = [];
      let cur = null;
      const ctl = kit.controls(box.side, [
        { id: 'meth', type: 'select', label: 'Braking method', options: Object.keys(BMETH).map(k => [BMETH[k], k]), value: 'dyn' },
        { id: 'Rb', label: 'Braking resistor (dynamic) or series resistor (plugging)', min: 0, max: 5, step: 0.1, value: 1, unit: 'Ω' },
        { id: 'Ireg', label: 'Regenerative braking current', min: 2, max: 30, step: 1, value: 10, unit: 'A' },
        { id: 'Tb', label: 'Friction brake torque', min: 0.1, max: 3, step: 0.1, value: 1, unit: 'N·m' },
        { id: 'J', label: 'Flywheel inertia', min: 0.5, max: 20, step: 0.5, value: 5, unit: 'kg·cm²' },
        { id: 'cut', type: 'check', label: 'Cut off at zero speed (plugging)', value: true },
        { type: 'buttons', items: [{ id: 'run', label: 'Run up', primary: true }, { id: 'brake', label: 'Brake now' }, { id: 'clear', label: 'Clear graphs' }] }
      ], id => {
        if (id === 'run') { state = 'run'; }
        if (id === 'brake' && state !== 'brake') {
          state = 'brake'; tb = 0; Ipk = 0; tStop = null; En = { res: 0, cu: 0, ret: 0, sup: 0, fr: 0, brk: 0 };
          const Jt = BR.Jm + V.J * 1e-4; E0 = 0.5 * Jt * w * w;
          cur = { label: BMETH[V.meth].split(' (')[0] + (V.meth === 'dyn' || V.meth === 'plug' ? ' ' + V.Rb.toFixed(1) + ' Ω' : V.meth === 'regen' ? ' ' + V.Ireg + ' A' : ''), sp: [], ip: [] };
          runs.push(cur); while (runs.length > 4) runs.shift();
        }
        if (id === 'clear') { runs.length = 0; cur = null; }
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['st', 'State'], ['n', 'Speed'], ['i', 'Current · peak'], ['ts', 'Time to stop'], ['E', 'Kinetic energy at the start of braking'], ['where', 'Energy went to']]);
      const pS = kit.plot(g1, { x: { label: 'time since braking (s)', min: 0, max: 2 }, y: { label: 'speed (rpm)', min: -1000, max: 4500 }, legend: true }, 180);
      const pI = kit.plot(g2, { x: { label: 'time since braking (s)', min: 0, max: 2 }, y: { label: 'current (A)', min: -110, max: 40 }, legend: true }, 180);
      const loop = kit.loop(dt => {
        t += dt;
        const Jt = BR.Jm + V.J * 1e-4, sub = 50, h = dt / sub;
        for (let k = 0; k < sub; k++) {
          const E = BR.K * w, fr = Math.abs(w) > 0.02 ? Math.sign(w) * BR.K * BR.I0 : 0;
          let Tbrake = 0;
          if (state === 'run') { I = clamp((BR.V - E) / BR.R, -BR.Ilim, BR.Ilim); }
          else if (state === 'brake') {
            const m = V.meth;
            if (m === 'coast') I = 0;
            else if (m === 'dyn') I = -E / (BR.R + V.Rb);
            else if (m === 'short') I = -E / BR.R;
            else if (m === 'regen') I = Math.abs(w) > 0.5 ? -Math.sign(w) * V.Ireg : -E / BR.R;
            else if (m === 'plug') I = (-BR.V - E) / (BR.R + V.Rb);
            else if (m === 'mech') { I = 0; Tbrake = Math.abs(w) > 0.02 ? Math.sign(w) * V.Tb : 0; }
            // energy bookkeeping
            const Rext = m === 'dyn' || m === 'plug' ? V.Rb : 0;
            En.res += Rext * I * I * h; En.cu += BR.R * I * I * h; En.fr += Math.abs(fr * w) * h; En.brk += Math.abs(Tbrake * w) * h;
            if (m === 'regen') En.ret += (E * -I - BR.R * I * I) * h;
            if (m === 'plug') En.sup += BR.V * Math.abs(I) * h;
          } else I = 0;
          const Tm = BR.K * I;
          const wn = w + h * (Tm - fr - Tbrake) / Jt;
          w = (state !== 'run' && (V.meth !== 'plug' || V.cut) && w !== 0 && Math.sign(wn) !== Math.sign(w)) ? 0 : wn;
          if (state === 'brake' && Math.abs(w) < 0.3 && V.meth !== 'plug') w = 0;
          if (state === 'brake' && V.meth === 'plug' && V.cut && w <= 0) { w = 0; state = 'stopped'; if (tStop == null) tStop = tb + (k + 1) * h; }
        }
        if (state === 'brake' || (state === 'stopped' && tb === 0)) {
          tb += dt; Ipk = Math.max(Ipk, Math.abs(I));
          if (tStop == null && Math.abs(w) < radOf(40) && (V.meth !== 'plug' || V.cut)) tStop = tb;
          if (V.meth === 'plug' && V.cut && w <= 0) { w = 0; state = 'stopped'; }
          if (cur && tb <= 6) { cur.sp.push([tb, rpmOf(w)]); cur.ip.push([tb, I]); }
          if (tStop != null && tb > tStop + 0.3 && state === 'brake') state = 'stopped';
        }
        ang += w * dt / 40;
        const n = rpmOf(w);
        ro.set('st', state === 'run' ? 'running up / running on 24 V' : state === 'brake' ? 'braking: ' + BMETH[V.meth] : 'stopped (nothing holds it: a load could turn it)');
        ro.set('n', n.toFixed(0) + ' rpm'); ro.set('i', I.toFixed(1) + ' A · ' + Ipk.toFixed(0) + ' A');
        ro.set('ts', tStop != null ? tStop.toFixed(2) + ' s' : state === 'brake' ? tb.toFixed(1) + ' s …' : '—');
        ro.set('E', E0.toFixed(1) + ' J');
        const parts = [['resistor', En.res], ['winding', En.cu], ['battery', En.ret], ['friction', En.fr], ['brake', En.brk]].filter(p => p[1] > 0.05).map(p => p[0] + ' ' + p[1].toFixed(1) + ' J');
        ro.set('where', (parts.join(', ') || '—') + (En.sup > 0.05 ? '; ' + En.sup.toFixed(1) + ' J drawn from the supply' : ''));
        if (t - lastPlot > 0.1 || lastPlot < 0) {
          lastPlot = t;
          const tmax = Math.max(2, ...runs.map(r => r.sp.length ? r.sp[r.sp.length - 1][0] : 0));
          pS.set({ x: { label: 'time since braking (s)', min: 0, max: Math.min(6, tmax) }, series: runs.map(r => ({ pts: r.sp, label: r.label })) });
          pI.set({ x: { label: 'time since braking (s)', min: 0, max: Math.min(6, tmax) }, series: runs.map(r => ({ pts: r.ip, label: r.label })) });
        }
        // drawing: flywheel, motor, the braking circuit and the energy bars
        const Fr = frame(st, 640, 260), c = Fr.c, C = kit.colors(), S = kit.schem;
        const fx = 110, fy = 120, fr0 = 32 + 9 * Math.sqrt(V.J);
        c.fillStyle = C.surface2; c.beginPath(); c.arc(fx, fy, fr0, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        for (let k = 0; k < 4; k++) { const a = ang + k * Math.PI / 2; c.beginPath(); c.moveTo(fx, fy); c.lineTo(fx + fr0 * Math.cos(a), fy + fr0 * Math.sin(a)); c.stroke(); }
        if (V.meth === 'mech' && state === 'brake') { c.fillStyle = C.bad; c.fillRect(fx - 10, fy - fr0 - 12, 20, 10); c.fillRect(fx - 10, fy + fr0 + 2, 20, 10); }
        txt(c, 'flywheel', fx, fy + fr0 + 30, C.muted, 'center', 11);
        c.fillStyle = C.muted; c.fillRect(fx + fr0 + 4, fy - 5, 30, 10);
        const mx = fx + fr0 + 34;
        c.fillStyle = C.surface2; c.fillRect(mx, fy - 30, 70, 60); c.strokeRect(mx, fy - 30, 70, 60); txt(c, 'M', mx + 35, fy + 6, C.text, 'center', 16, 'bold');
        // circuit
        const ax = 330, top = 50, bot = 200, col = 'hsl(28 90% 55%)';
        S.wire(c, [[mx + 70, fy - 15], [ax, fy - 15], [ax, top]]); S.wire(c, [[mx + 70, fy + 15], [ax + 20, fy + 15], [ax + 20, bot]]);
        const m = state === 'brake' ? V.meth : state === 'run' ? 'run' : 'open';
        if (m === 'run' || m === 'regen') { S.battery(c, ax + 110, top, ax + 110, bot, { label: m === 'regen' ? 'drive + battery' : 'supply', value: '24 V' }); S.wire(c, [[ax, top], [ax + 110, top]]); S.wire(c, [[ax + 20, bot], [ax + 110, bot]]); }
        else if (m === 'dyn') { S.resistor(c, ax + 110, top, ax + 110, bot, { label: 'R_b', value: V.Rb.toFixed(1) + ' Ω' }); S.wire(c, [[ax, top], [ax + 110, top]]); S.wire(c, [[ax + 20, bot], [ax + 110, bot]]); }
        else if (m === 'short') { S.wire(c, [[ax, top], [ax + 110, top], [ax + 110, bot], [ax + 20, bot]]); txt(c, 'short', ax + 120, (top + bot) / 2, C.muted, 'left', 11); }
        else if (m === 'plug') { S.battery(c, ax + 110, bot, ax + 110, top, { label: 'supply reversed', value: '24 V' }); if (V.Rb > 0) S.resistor(c, ax, top, ax + 70, top, { value: V.Rb.toFixed(1) + ' Ω' }); S.wire(c, [[ax + 70, top], [ax + 110, top]]); S.wire(c, [[ax + 20, bot], [ax + 110, bot]]); }
        else txt(c, 'open circuit', ax + 60, (top + bot) / 2, C.muted, 'center', 11);
        if (Math.abs(I) > 0.05 && m !== 'open' && m !== 'coast' && m !== 'mech') S.flow(c, [[mx + 70, fy - 15], [ax, fy - 15], [ax, top], [ax + 110, top], [ax + 110, bot], [ax + 20, bot], [ax + 20, fy + 15], [mx + 70, fy + 15]], t * 30 * Math.sign(I) * Math.min(3, Math.abs(I) / 5), { color: col });
        // energy bars
        const bx = 500, parts2 = [['resistor', En.res, 'hsl(28 90% 55%)'], ['winding', En.cu, C.bad], ['battery', En.ret, C.ok], ['friction', En.fr + En.brk, C.muted], ['from supply', En.sup, 'hsl(265 70% 60%)']];
        const Emax = Math.max(1, E0 + En.sup);
        txt(c, 'where the energy went', bx, 40, C.muted, 'left', 11);
        parts2.forEach(([lab, e, cc], k) => { bar(c, C, bx, 62 + k * 36, 120, 10, e / Emax, cc, lab + ' ' + e.toFixed(1) + ' J'); });
        Fr.done();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ dc-gearmotor-lab */
  const GM = { R: 0.5, K: 0.055, I0: 0.25, Jm: 6e-5, r: 0.025, Jd: 2e-4, H: 1 };
  const GSIZES = { small: { name: 'Small gearhead (5 N·m rated, 10 peak)', Tr: 5 }, medium: { name: 'Medium gearhead (20 N·m rated, 40 peak)', Tr: 20 }, large: { name: 'Large gearhead (60 N·m rated, 120 peak)', Tr: 60 } };
  // worm efficiency from the lead angle (tan λ = 1.6/i) and friction: sliding 0.04, static 0.07 (illustrative values)
  const worm = i => { const l = Math.atan(1.6 / i), rho = Math.atan(0.04), rhoS = Math.atan(0.07); return { eta: Math.tan(l) / Math.tan(l + rho), back: Math.tan(l - rho) / Math.tan(l), backS: Math.tan(l - rhoS) / Math.tan(l), lock: l < rhoS, lead: l * 180 / Math.PI }; };
  const gearOf = (type, i) => {
    if (type === 'worm') { const wv = worm(i); return { eta: wv.eta, back: wv.back, backS: wv.backS, lock: wv.lock, stages: 1, lead: wv.lead, lash: '0.5–2°' }; }
    const perMax = type === 'spur' ? 6 : 5, stages = Math.max(1, Math.ceil(Math.log(i) / Math.log(perMax) - 1e-9)), eta = Math.pow(0.9, stages);
    return { eta, back: eta, backS: eta, lock: false, stages, lash: type === 'spur' ? '1–3°' : '0.5–1.5°' };
  };
  Hyper.sim('dc-gearmotor-lab', {
    title: 'A gearmotor lifting a load',
    blurb: `The 24 V, 100 W PMDC motor drives a 50 mm drum through a spur, planetary or worm gearhead and lifts a weight 1 m, with limit switches at the top and bottom. The first graph is the gearmotor's output line — the motor's torque–speed line multiplied by the ratio and efficiency — with the gearbox's rated and peak torque and the load; the second is the overall efficiency against output torque.

**Try this**
- Lift 20 kg with a planetary gearhead at 30 : 1, then 60 : 1: the output turns slower, the motor current falls, and the operating point moves towards the motor's best efficiency. The limit switches turn the motor round at the top and bottom, so the weight travels up and down.
- Switch the power off while the weight is rising: spur and planetary gearheads let it fall back, back-driving the motor. A worm at 30 : 1 or more holds it — self-locking at rest — while one at 10 : 1 lets it down. Now switch off a 30 : 1 worm while it is lowering: sliding friction is lower than static friction, and the load can keep running down.
- Compare efficiencies at the same ratio: a planetary three-stage 60 : 1 around 73 %, a worm around 40 %.
- Choose the small gearhead at 100 : 1 and read the stall warning: the motor could press several times the gearbox's peak torque. Lower the current limit until the warning clears.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const [g1, g2] = graphs(box, 2);
      let V = null, w = 0, y = 0.2, t = 0, lastPlot = -1, ang = 0, I = 0, status = '', dir = 1;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Gearhead', options: [['Spur (parallel shafts)', 'spur'], ['Planetary (in line)', 'planetary'], ['Worm (right angle)', 'worm']], value: 'planetary' },
        { id: 'i', label: 'Ratio', min: 3, max: 300, value: 30, log: true, sig: 2, unit: ': 1' },
        { id: 'size', type: 'select', label: 'Gearbox size', options: Object.keys(GSIZES).map(k => [GSIZES[k].name, k]), value: 'medium' },
        { id: 'm', label: 'Load mass', min: 0, max: 100, step: 1, value: 20, unit: 'kg' },
        { id: 'V', label: 'Motor voltage (the limit switches reverse it)', min: 0, max: 24, step: 0.5, value: 24, unit: 'V' },
        { id: 'ilim', label: 'Driver current limit', min: 1, max: 48, step: 0.5, value: 20, unit: 'A' },
        { id: 'pw', type: 'check', label: 'Power on', value: true }
      ], () => { lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['st', 'State'], ['out', 'Output speed · lift speed'], ['T', 'Output torque (load)'], ['mot', 'Motor speed · current'], ['eta', 'Gearbox · overall efficiency'], ['gl', 'Gearbox load'], ['stall', 'At stall'], ['lash', 'Typical backlash · back-driving']]);
      const pT = kit.plot(g1, { x: { label: 'output torque (N·m)', min: 0 }, y: { label: 'output speed (rpm)', min: 0 }, legend: true }, 180);
      const pE = kit.plot(g2, { x: { label: 'output torque (N·m)', min: 0 }, y: { label: 'efficiency (%)', min: 0, max: 100 }, legend: true }, 180);
      const loop = kit.loop(dt => {
        t += dt;
        const i = Math.max(1, V.type === 'worm' ? clamp(V.i, 5, 100) : V.i), g = gearOf(V.type, i), size = GSIZES[V.size];
        const Jeff = GM.Jm + (GM.Jd + V.m * GM.r * GM.r) / (i * i);
        const sub = 40, h = dt / sub;
        if (y >= GM.H) dir = -1; else if (y <= 0) dir = 1;
        const Vm = dir * V.V, atTop = y >= GM.H, atBottom = y <= 0;
        for (let k = 0; k < sub; k++) {
          const TLout = atBottom && w <= 0 ? 0 : V.m * 9.81 * GM.r;               // resting on the floor: no load torque
          const on = V.pw && !(atTop && Vm > 0) && !(atBottom && Vm < 0);
          I = on ? clamp((Vm - GM.K * w) / GM.R, -V.ilim, V.ilim) : 0;
          const Tm = GM.K * I, fr = GM.K * GM.I0;
          // load torque seen by the motor: lifting, lowering (negative for a self-locking worm: the motor must drive it down), and at rest
          const up = TLout / (i * g.eta), down = TLout * g.back / i, downS = TLout * (g.lock ? g.backS : g.back) / i;
          let acc;
          if (w > 1e-3) acc = (Tm - fr - up) / Jeff;
          else if (w < -1e-3) acc = (Tm + fr - down) / Jeff;
          else {
            if (Tm - fr > up) acc = (Tm - fr - up) / Jeff;
            else if (Tm + fr < downS) acc = (Tm + fr - down) / Jeff;
            else { acc = 0; w = 0; }
          }
          const wn = w + h * acc;
          w = (w > 0 && wn < 0) || (w < 0 && wn > 0) ? 0 : wn;
          y = clamp(y + h * w / i * GM.r, 0, GM.H);
          if ((y >= GM.H && w > 0) || (y <= 0 && w < 0)) w = 0;
        }
        ang += w * dt / 60;
        const nOut = rpmOf(w) / i, TLout = V.m * 9.81 * GM.r, Tmot = GM.K * I;
        const Tout = w > 0.01 ? Math.max(0, Tmot - GM.K * GM.I0) * i * g.eta : TLout;
        const motEta = I > 0.01 && w > 0 && Vm > 0 ? Math.max(0, (Tmot - GM.K * GM.I0) * w) / (Vm * I) : 0;
        const stallOut = GM.K * (Math.min(V.ilim, 24 / GM.R) - GM.I0) * i * g.eta, peak = 2 * size.Tr;
        status = !V.pw && w < -0.5 ? (g.back > 0 ? 'FALLING — back-driven through the gears' : 'coasting to a stop: the worm resists') : !V.pw && Math.abs(w) < 0.01 && y > 0 && TLout > 0 ? (g.lock ? 'held: the worm is self-locking' : 'held by friction only') : y >= GM.H ? 'top limit switch: reversing' : y <= 0 && V.pw ? 'bottom limit switch: reversing' : Math.abs(w) < 0.01 && V.pw && Math.abs(I) >= V.ilim - 1e-6 ? 'stalled at the current limit' : w > 0.01 ? 'lifting' : w < -0.01 ? 'lowering' : 'standing';
        ro.set('st', status);
        ro.set('out', nOut.toFixed(1) + ' rpm · ' + (1000 * w / i * GM.r).toFixed(0) + ' mm/s');
        ro.set('T', Tout.toFixed(2) + ' N·m (' + TLout.toFixed(2) + ' N·m to hold ' + V.m + ' kg)');
        ro.set('mot', rpmOf(w).toFixed(0) + ' rpm · ' + I.toFixed(2) + ' A');
        ro.set('eta', (100 * g.eta).toFixed(0) + ' % (' + g.stages + (g.stages > 1 ? ' stages' : ' stage') + (g.lead ? ', lead ' + g.lead.toFixed(1) + '°' : '') + ') · ' + (100 * motEta * g.eta).toFixed(0) + ' %');
        ro.set('gl', (100 * Math.abs(Tout) / size.Tr).toFixed(0) + ' % of rated' + (Math.abs(Tout) > peak ? ' — ABOVE PEAK RATING' : Math.abs(Tout) > size.Tr ? ' — overload' : ''));
        ro.set('stall', stallOut.toFixed(0) + ' N·m' + (stallOut > peak ? ' = ' + (stallOut / peak).toFixed(1) + ' × the peak rating: limit the current below ' + (peak / (GM.K * i * g.eta) + GM.I0).toFixed(1) + ' A' : ' (within the peak rating)'));
        ro.set('lash', g.lash + ' · ' + (g.lock ? 'self-locking at rest (not a brake)' : 'back-drivable'));
        if (t - lastPlot > 0.25 || lastPlot < 0) {
          lastPlot = t;
          const d = kit.motor.dc({ V: Math.max(0.5, Math.abs(V.V)), R: GM.R, K: GM.K, I0: GM.I0 }), line = [], eff = [];
          const Tsm = Math.min(d.stallTorque, GM.K * (V.ilim - GM.I0));
          for (let k = 0; k <= 50; k++) { const T = Math.max(0, Tsm) * k / 50, o = d.at(T); if (o.n >= 0) { line.push([T * i * g.eta, o.n / i]); eff.push([T * i * g.eta, 100 * o.eff * g.eta]); } }
          const C = kit.colors();
          pT.set({ series: [{ pts: line, label: 'gearmotor at ' + Math.abs(V.V).toFixed(0) + ' V' }], vlines: [{ x: size.Tr, label: 'rated' }, { x: peak, label: 'peak', color: C.bad }, { x: TLout, label: 'load', color: C.muted }], marks: [{ x: Math.max(0, Tout), y: Math.max(0, nOut) }] });
          pE.set({ series: [{ pts: eff, label: 'motor × gearbox' }], vlines: [{ x: TLout, label: 'load', color: C.muted }] });
        }
        // drawing: motor, gearbox by type, drum, rope, weight and limit switches
        const Fr = frame(st, 640, 260), c = Fr.c, C = kit.colors();
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2;
        c.fillRect(30, 90, 110, 70); c.strokeRect(30, 90, 110, 70); txt(c, 'M', 85, 132, C.text, 'center', 18, 'bold');
        txt(c, '24 V motor', 85, 176, C.muted, 'center', 11);
        const gx = 190, gy = 125;
        const gear = (x, yy, r, n, a, col) => { c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.arc(x, yy, r, 0, TAU); c.stroke(); for (let k = 0; k < n; k++) { const b = a + k * TAU / n; c.beginPath(); c.moveTo(x + r * Math.cos(b), yy + r * Math.sin(b)); c.lineTo(x + (r + 5) * Math.cos(b), yy + (r + 5) * Math.sin(b)); c.stroke(); } };
        if (V.type === 'planetary') {
          gear(gx + 40, gy, 44, 30, -ang / 3, C.muted);
          gear(gx + 40, gy, 12, 8, ang, C.accent);
          for (let k = 0; k < 3; k++) { const b = ang / 4 + k * TAU / 3; gear(gx + 40 + 28 * Math.cos(b), gy + 28 * Math.sin(b), 10, 6, -ang, 'hsl(28 90% 55%)'); }
          txt(c, 'sun, 3 planets, ring', gx + 40, gy + 66, C.muted, 'center', 11);
        } else if (V.type === 'spur') {
          gear(gx + 10, gy - 20, 10, 8, ang, C.accent); gear(gx + 40, gy - 20, 22, 16, -ang / 3, 'hsl(28 90% 55%)');
          gear(gx + 40, gy + 22, 10, 8, -ang / 3, 'hsl(28 90% 55%)'); gear(gx + 70, gy + 22, 22, 16, ang / 9, C.muted);
          txt(c, 'spur stages', gx + 40, gy + 66, C.muted, 'center', 11);
        } else {
          c.strokeStyle = C.accent; c.lineWidth = 2; c.strokeRect(gx - 10, gy - 8, 80, 16);
          for (let k = 0; k < 8; k++) { const x = gx - 6 + ((k * 10 + ang * 3) % 80 + 80) % 80; c.beginPath(); c.moveTo(x, gy - 8); c.lineTo(x + 6, gy + 8); c.stroke(); }
          gear(gx + 30, gy + 38, 26, 20, ang / i, 'hsl(28 90% 55%)');
          txt(c, 'worm and wheel', gx + 30, gy - 18, C.muted, 'center', 11);
        }
        // drum and weight
        const dx = 400, dy = 60;
        c.fillStyle = C.muted; c.beginPath(); c.arc(dx, dy, 22, 0, TAU); c.fill();
        c.strokeStyle = C.bg2; c.lineWidth = 3; c.beginPath(); c.moveTo(dx, dy); c.lineTo(dx + 20 * Math.cos(ang / i), dy + 20 * Math.sin(ang / i)); c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 2; c.beginPath(); c.moveTo(250, 125); c.lineTo(dx, 125); c.lineTo(dx, dy); c.stroke();
        const wy = 235 - 150 * y / GM.H, wh = 14 + V.m * 0.3;
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(dx + 22, dy); c.lineTo(dx + 22, wy - wh); c.stroke();
        c.fillStyle = status.startsWith('FALLING') ? C.bad : 'hsl(28 60% 45%)'; c.fillRect(dx + 8, wy - wh, 28, wh);
        txt(c, V.m + ' kg', dx + 60, wy - wh / 2 + 4, C.text, 'left', 12, 'bold');
        c.fillStyle = y >= GM.H ? C.warn : C.faint; c.fillRect(dx + 44, 82, 16, 8); txt(c, 'top limit', dx + 64, 90, C.muted, 'left', 10);
        c.fillStyle = y <= 0 ? C.warn : C.faint; c.fillRect(dx + 44, 232, 16, 8); txt(c, 'bottom limit', dx + 64, 240, C.muted, 'left', 10);
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(dx - 20, 236); c.lineTo(dx + 60, 236); c.stroke();
        txt(c, 'ratio ' + i.toFixed(0) + ' : 1', gx + 40, 30, C.text, 'center', 13, 'bold');
        Fr.done();
      }, box.stage);
      loop.start();
    }
  });

})();
