/* HYPER-MOTORS · sims/air-selection.js — simulations for the air-motor and the selection topics.
 *   as-air-curves   an air motor on a brake dynamometer: torque line, power parabola, air use, pressure, running cost
 *   as-vane-motor   inside a vane motor: chambers filling, expanding and exhausting, displacement and torque ripple
 *   (more below: piston, turbine, control, air vs electric, family comparison, move sizing, pump, hoist, spindle,
 *    traction, robot joints and drones)
 */
(function () {
  'use strict';

  const TAU = 2 * Math.PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const font = () => { try { return getComputedStyle(document.body).fontFamily || 'sans-serif'; } catch (e) { return 'sans-serif'; } };
  // plot containers under the canvas, side by side when there is room
  function graphs(stage, n) {
    const gb = document.createElement('div');
    gb.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;padding:4px 10px 10px';
    stage.appendChild(gb);
    const out = [];
    for (let i = 0; i < (n || 2); i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  }
  // draw on a fixed design grid W0 × H0, centred and scaled to the stage; the caller restores
  function design(st, W0, H0) {
    const c = st.begin(), s = Math.max(1e-3, Math.min(st.W / W0, st.H / H0));
    c.save(); c.translate((st.W - W0 * s) / 2, (st.H - H0 * s) / 2); c.scale(s, s);
    c.font = '12px ' + font(); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    return c;
  }
  const rpmOf = w => w * 60 / TAU;

  /* ================================================================ as-air-curves */
  const AIR = [
    { name: 'Small vane motor, 0.3 kW, 20 000 rpm', P: 300, n0: 20000, kind: 'vane' },
    { name: 'Vane motor, 1 kW, 6000 rpm', P: 1000, n0: 6000, kind: 'vane' },
    { name: 'Vane gearmotor 20:1, 0.9 kW, 300 rpm', P: 905, n0: 300, kind: 'gear' },
    { name: 'Radial piston motor, 2 kW, 1500 rpm', P: 2000, n0: 1500, kind: 'piston' }
  ];
  const PREF = 6.3, PATM = 1.013, QK = 1.2, WSPEC = 6.5;   // catalogue pressure, atmosphere (bar); m³/min of free air per kW at peak; compressor kW per m³/min
  // a typical air motor: torque ∝ gauge pressure, free speed ∝ √(absolute pressure), air ∝ absolute pressure × (leakage + speed)
  function airModel(m, p) {
    const Ts0 = 4 * m.P / (m.n0 * TAU / 60);
    const Ts = Ts0 * Math.max(0, p) / PREF, n0 = m.n0 * Math.sqrt((p + PATM) / (PREF + PATM));
    const qPeak = QK * m.P / 1000 * (p + PATM) / (PREF + PATM);
    return {
      Ts0, Ts, n0, Pmax: Math.PI * n0 / 60 * Ts / 2,
      T: n => Math.max(0, Ts * (1 - n / n0)),
      Q: n => p > 0 ? qPeak * (0.2 + 1.6 * clamp(n / n0, 0, 1.2)) : 0
    };
  }

  Hyper.sim('as-air-curves', {
    title: 'An air motor on the dynamometer',
    blurb: `An air motor fed through a filter–regulator–lubricator drives a brake (or a mixer, or a fan). The first graph is torque against speed: the motor's straight line at the pressure its inlet gets, the load's line, and where they meet. The second graph shows the shaft power — a parabola — and the free air the motor swallows, which keeps rising right up to the free speed. The readouts turn the air into compressor electricity and money.

**Try this**
- Press *Dyno sweep*: the brake load rises step by step and the recorded points trace the straight torque line down to stall. Note the speed of peak power: half the free speed.
- Raise the brake past the stall torque: the motor stops and holds — no heat, no harm. Lower it and it starts again.
- Set the load to about 5 % and watch the air: near free speed the motor uses the most air for almost no power. Read the *air per kW* line.
- Drop the inlet pressure from 6.3 to 4 bar: the stall torque falls in proportion, the free speed much less, the peak power to about half.
- Choose the fan: its torque grows with speed squared, so it settles high on the line, near free speed.
- Read the cost per hour of running, and compare it with an electric motor of the same shaft power (about 90 % efficient).`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const [g1, g2] = graphs(box.stage, 2);
      let V = null, w = 0, ang = 0, puff = 0, sweep = -1, rec = [], lastPlot = -1, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'motor', type: 'select', label: 'Motor', options: AIR.map((m, i) => [m.name, i]), value: 1 },
        { id: 'p', label: 'Gauge pressure at the motor inlet', min: 2, max: 8, step: 0.1, value: 6.3, unit: 'bar' },
        { id: 'type', type: 'select', label: 'Load', options: [['Brake (constant torque)', 'const'], ['Mixer (torque ∝ speed)', 'lin'], ['Fan (torque ∝ speed²)', 'fan']], value: 'const' },
        { id: 'load', label: 'Load, % of stall torque at 6.3 bar (mixer, fan: at half free speed)', min: 0, max: 150, step: 1, value: 40, unit: '%' },
        { id: 'price', label: 'Electricity price, ¤ per kWh', min: 0.05, max: 0.5, step: 0.01, value: 0.15 },
        { type: 'buttons', items: [{ id: 'sweep', label: 'Dyno sweep', primary: true }, { id: 'clear', label: 'Clear points' }] }
      ], id => {
        if (id === 'sweep') { sweep = 0; rec = []; ctl.set('type', 'const'); }
        if (id === 'clear') rec = [];
        if (id === 'motor') { rec = []; w = 0; }
        if (id === 'load' || id === 'type') sweep = -1;
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['ts', 'Stall torque · free speed (this pressure)'], ['op', 'Running at'], ['P', 'Shaft power'], ['Q', 'Free air used'], ['sq', 'Air per kW of shaft power'], ['el', 'Compressor electricity · overall efficiency'], ['cost', 'Cost per hour: air motor · electric motor'], ['st', 'State']]);
      const pT = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 190);
      const pP = kit.plot(g2, { x: { label: 'speed (rpm)', min: 0 }, y: { label: 'kW  ·  m³/min of free air', min: 0 }, legend: true }, 190);
      const loop = kit.loop(dt => {
        t += dt;
        const m = AIR[V.motor] || AIR[1], am = airModel(m, V.p);
        if (sweep >= 0) { sweep += dt; const f = Math.min(1.1, sweep / 9); ctl.set('load', Math.round(f * 100)); if (sweep > 10) sweep = -1; }
        const nref = m.n0 / 2, T0 = V.load / 100 * am.Ts0;
        const TL = n => V.type === 'const' ? T0 : V.type === 'lin' ? T0 * n / nref : T0 * (n / nref) * (n / nref);
        const J = 0.35 * am.Ts0 / (m.n0 * TAU / 60);           // gives a time constant of about a third of a second
        const sub = 30, h = dt / sub;
        for (let k = 0; k < sub; k++) {
          const n = rpmOf(w), Tm = am.T(n), Tl = TL(n);
          if (w <= 0 && Tm <= Tl) { w = 0; continue; }         // stalled: the motor holds, the load cannot turn it back
          w = Math.max(0, w + h * (Tm - Tl) / J);
        }
        const n = rpmOf(w), Tm = w > 0 ? am.T(n) : Math.min(am.Ts, TL(0)), P = Tm * w, Q = am.Q(n);
        const stalled = w === 0 && TL(0) >= am.Ts && T0 > 0, Pel = Q * WSPEC, eta = Pel > 0 ? P / (Pel * 1000) : 0;
        if (sweep >= 0 && (!rec.length || sweep - rec.tLast > 0.3)) { rec.push([n, Tm]); rec.tLast = sweep; }
        ro.set('ts', am.Ts.toFixed(am.Ts < 2 ? 2 : 1) + ' N·m · ' + am.n0.toFixed(0) + ' rpm (peak ' + (am.Pmax / 1000).toFixed(2) + ' kW at ' + (am.n0 / 2).toFixed(0) + ' rpm)');
        ro.set('op', n.toFixed(0) + ' rpm, ' + Tm.toFixed(am.Ts < 2 ? 2 : 1) + ' N·m (' + (100 * n / Math.max(1, am.n0)).toFixed(0) + ' % of free speed)');
        ro.set('P', (P / 1000).toFixed(3) + ' kW (' + (am.Pmax > 0 ? 100 * P / am.Pmax : 0).toFixed(0) + ' % of the peak)');
        ro.set('Q', (Q * 1000 / 60).toFixed(1) + ' L/s ANR = ' + Q.toFixed(2) + ' m³/min');
        ro.set('sq', P > 5 ? (Q / (P / 1000)).toFixed(2) + ' m³/min per kW' : 'no power delivered');
        ro.set('el', Pel.toFixed(2) + ' kW · ' + (100 * eta).toFixed(1) + ' %');
        ro.set('cost', kit.money(Pel * V.price) + ' · ' + kit.money(P / 1000 / 0.9 * V.price));
        ro.set('st', stalled ? 'stalled — holding ' + am.Ts.toFixed(1) + ' N·m, nothing overheats' : T0 === 0 ? 'running free: most air, no work' : 'running');
        if (t - lastPlot > 0.12 || lastPlot < 0) {
          lastPlot = t;
          const ref = airModel(m, PREF), nMax = ref.n0 * Math.sqrt((8 + PATM) / (PREF + PATM)) * 1.05, N = 70, xs = [];
          for (let i = 0; i <= N; i++) xs.push(nMax * i / N);
          const C = kit.colors();
          pT.set({ x: { label: 'speed (rpm)', min: 0, max: nMax }, y: { label: 'torque (N·m)', min: 0, max: ref.Ts * 1.45 },
            series: [{ pts: xs.map(x => [x, am.T(x)]), label: 'motor at ' + V.p.toFixed(1) + ' bar' }, { pts: xs.map(x => [x, ref.T(x)]), label: '6.3 bar', dash: [5, 4], color: C.muted },
              { pts: xs.map(x => [x, Math.min(TL(x), ref.Ts * 1.45)]), label: 'load', dash: [2, 3], color: C.series[1] }].concat(rec.length ? [{ pts: rec.slice(), label: 'dyno points', line: false, dots: true, color: C.series[3] }] : []),
            marks: [{ x: n, y: Tm, label: stalled ? 'stall' : 'runs here' }] });
          pP.set({ x: { label: 'speed (rpm)', min: 0, max: nMax }, y: { label: 'kW  ·  m³/min of free air', min: 0 },
            series: [{ pts: xs.map(x => [x, am.T(x) * x * TAU / 60 / 1000]), label: 'shaft power (kW)' }, { pts: xs.map(x => [x, x <= am.n0 * 1.001 ? am.Q(x) : NaN]).filter(q => Number.isFinite(q[1])), label: 'free air (m³/min)', color: C.series[2] }],
            marks: [{ x: n, y: P / 1000 }, { x: n, y: Q }], vlines: [{ x: am.n0 / 2, label: 'n₀/2' }] });
        }
        // drawing: supply, FRL, inlet gauge, the motor, its exhaust and the load
        const c = design(st, 700, 280), C = kit.colors();
        ang += w * dt / Math.max(1, m.n0 * TAU / 60 / 6); puff += dt * (0.5 + 4 * Q / Math.max(0.05, QK * m.P / 1000));
        const running = w > 0.5, lineSt = running || stalled ? 'air' : 'idle';
        const Ls = [[60, 220], [60, 150], [92, 150]], Lm = [[188, 150], [300, 150], [300, 92], [330, 92]];
        S.line(c, Ls, { state: 'air' }); S.line(c, Lm, { state: lineSt });
        if (running) S.flow(c, Ls.concat(Lm), puff * 30, { color: S.col('air') });
        S.source(c, 60, 240, { pneumatic: true });
        S.frl(c, 140, 150);
        S.gauge(c, 262, 129, { frac: V.p / 10, value: V.p.toFixed(1) + ' bar' }); S.junction(c, 262, 150);
        const mo = S.motor(c, 356, 118, { pneumatic: true, r: 18 });
        S.line(c, [[356, 146], [356, 160]], { state: running ? 'exhaust' : 'idle' });
        S.exhaust(c, 356, 160, { silencer: true });
        if (running) for (let k = 0; k < 4; k++) { const ph = (puff + k / 4) % 1; c.globalAlpha = 0.6 * (1 - ph); c.fillStyle = S.col('exhaust'); c.beginPath(); c.arc(356 + (k % 2 ? 8 : -8) * ph, 182 + 40 * ph, 3 + 7 * ph, 0, TAU); c.fill(); }
        c.globalAlpha = 1;
        kit.label(c, m.kind === 'piston' ? 'radial piston motor' : m.kind === 'gear' ? 'vane motor + gearbox' : 'vane motor', 356, 250, { color: C.muted, size: 11, align: 'center' });
        const sx = mo.shaft[0], sy = mo.shaft[1], lx = 540;
        c.strokeStyle = C.text; c.lineWidth = 4; c.beginPath(); c.moveTo(sx, sy); c.lineTo(lx - 40, sy); c.stroke();
        if (V.type === 'fan') {
          for (let i = 0; i < 3; i++) { c.save(); c.translate(lx, sy); c.rotate(ang + i * TAU / 3); c.fillStyle = C.accent; c.globalAlpha = 0.6; c.beginPath(); c.ellipse(0, -30, 10, 30, 0.3, 0, TAU); c.fill(); c.restore(); }
          c.globalAlpha = 1; kit.label(c, 'fan', lx, sy + 80, { color: C.muted, size: 11, align: 'center' });
        } else {
          c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(lx, sy, 38, 0, TAU); c.fill(); c.stroke();
          c.strokeStyle = C.muted; c.lineWidth = 2;
          for (let i = 0; i < 6; i++) { const a = ang + i * TAU / 6; c.beginPath(); c.moveTo(lx + 12 * Math.cos(a), sy + 12 * Math.sin(a)); c.lineTo(lx + 34 * Math.cos(a), sy + 34 * Math.sin(a)); c.stroke(); }
          if (V.type === 'const') {
            // a band brake with a torque arm on a load cell
            c.strokeStyle = C.warn; c.lineWidth = 4; c.beginPath(); c.arc(lx, sy, 42, -2.6, 0.5); c.stroke();
            c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(lx + 42 * Math.cos(0.5), sy + 42 * Math.sin(0.5)); c.lineTo(lx + 110, sy + 40); c.stroke();
            c.fillStyle = C.muted; c.fillRect(lx + 102, sy + 40, 16, 34);
            kit.label(c, 'brake ' + TL(0).toFixed(TL(0) < 2 ? 2 : 1) + ' N·m', lx + 110, sy + 92, { color: C.text, size: 11, align: 'center' });
          } else kit.label(c, 'mixer', lx, sy + 58, { color: C.muted, size: 11, align: 'center' });
        }
        kit.label(c, n.toFixed(0) + ' rpm', lx, 38, { color: C.text, size: 14, weight: 700, align: 'center' });
        // air bar
        const qf = clamp(Q / (QK * m.P / 1000 * 2.2), 0, 1);
        c.fillStyle = C.faint; c.fillRect(60, 262, 220, 10); c.fillStyle = S.col('air'); c.fillRect(60, 262, 220 * qf, 10);
        kit.label(c, 'free air ' + (Q * 1000 / 60).toFixed(1) + ' L/s', 60, 256, { color: C.muted, size: 11, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ as-vane-motor */
  Hyper.sim('as-vane-motor', {
    title: 'Inside a vane motor',
    blurb: `A cross-section of a vane motor. The rotor turns off-centre in the bore, so the chambers between its vanes grow on one side and shrink on the other. Dark blue is air at the supply pressure, lighter shades are air expanding after the inlet closes, pale blue is air leaving through the exhaust. The graph shows the torque the air puts on the rotor as it turns — the sum, over every chamber, of its gauge pressure acting on the difference between the exposed areas of its two vanes.

**Try this**
- Increase the eccentricity: the chambers deepen, the displacement and the torque rise almost in proportion.
- Close the inlet earlier (a smaller *inlet closes at* angle): the air expands in the closed chamber, so less air is used per revolution — and the torque falls. Full admission gives the most torque and wastes the most air.
- Try three vanes, then eight: with few vanes the torque ripples and dips; more vanes smooth it, but each vane takes up room.
- Untick *vane springs*, press *Stop* then *Start*: the vanes lie in their slots and the air blows straight through. *Give it a spin*: once turning, centrifugal force throws them out and it runs.
- Reverse it: air enters at the other port, the rotor turns the other way, and on a reversible motor the idle port vents the residual air.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 250 });
      const [g1] = graphs(box.stage, 1);
      let V = null, phi = 0, spin = 1, running = true, torq = null, lastPlot = -1, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Bore diameter', min: 30, max: 80, step: 1, value: 50, unit: 'mm' },
        { id: 'e', label: 'Eccentricity', min: 1, max: 8, step: 0.1, value: 4, unit: 'mm' },
        { id: 'L', label: 'Rotor length', min: 20, max: 100, step: 1, value: 50, unit: 'mm' },
        { id: 'z', label: 'Number of vanes', min: 3, max: 10, step: 1, value: 5 },
        { id: 'p', label: 'Supply pressure (gauge)', min: 1, max: 8, step: 0.1, value: 6, unit: 'bar' },
        { id: 'cut', label: 'Inlet closes when the leading vane reaches (from the sealing line)', min: 90, max: 180, step: 1, value: 150, unit: '°' },
        { id: 'dir', type: 'select', label: 'Direction', options: [['Forward (clockwise)', 1], ['Reverse (anticlockwise)', -1]], value: 1 },
        { id: 'rev', type: 'check', label: 'Reversible motor (residual exhaust port)', value: true },
        { id: 'spr', type: 'check', label: 'Vane springs (vanes held out at rest)', value: true },
        { type: 'buttons', items: [{ id: 'start', label: 'Start', primary: true }, { id: 'stop', label: 'Stop' }, { id: 'push', label: 'Give it a spin' }] }
      ], id => {
        if (id === 'start') running = true;
        if (id === 'stop') running = false;
        if (id === 'push') { spin = Math.max(spin, 0.6); running = true; }
        torq = null; lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['V', 'Displacement 2eL(πD − zs)'], ['T', 'Torque from the air: mean (min – max)'], ['Ti', 'Full-admission torque Vp/2π'], ['air', 'Free air per revolution'], ['tpa', 'Torque per litre of free air'], ['st', 'State']]);
      const pl = kit.plot(g1, { x: { label: 'rotor angle (°)', min: 0, max: 360 }, y: { label: 'torque (N·m)' }, legend: true }, 170);
      const s = 3;                                             // vane thickness, mm
      const PA = 1.013;
      // distance from the rotor centre to the bore along angle psi, measured from the sealing line (mm)
      const geo = () => { const R = V.D / 2, e = Math.min(V.e, R * 0.3); return { R, e, r: R - e }; };
      const rho = (g, psi) => { const sn = Math.cos(psi); return -g.e * sn + Math.sqrt(g.e * g.e * sn * sn - g.e * g.e + g.R * g.R); };
      // chamber area between two vane angles (mm²), by the polar area rule
      const areaBetween = (g, a, b) => { let A = 0; const N = 16, d = (b - a) / N; for (let i = 0; i < N; i++) { const m = a + (i + 0.5) * d, q = rho(g, m); A += (q * q - g.r * g.r) / 2 * d; } return A; };
      // the port windows, as angles from the sealing line in the direction of rotation. A one-direction motor opens its
      // exhaust just after the chambers are largest and keeps it open almost to the sealing line; a reversible motor has
      // symmetrical ports, so its main exhaust sits around the top and the other direction's inlet vents what is left
      // the inlet stays open to a chamber until its trailing vane passes a2, i.e. until its leading vane reaches the cut-off
      function ports() {
        const a1 = 0.12, pitch = TAU / V.z;
        const eS = V.rev ? Math.PI - 0.25 : Math.PI + 0.1, eE = V.rev ? Math.PI + 0.6 : TAU - 0.15;
        const a2 = Math.max(a1 + 0.05, Math.min(V.cut * Math.PI / 180, eS) - pitch);
        return V.rev ? { a1, a2, eS, eE, r1: Math.max(eE, TAU - a2), r2: TAU - a1 } : { a1, a2, eS, eE, r1: TAU, r2: TAU };
      }
      // every chamber (split in two where it straddles the sealing line) with its gauge pressure (bar) and its torque (N·m):
      // the pressure acts on the leading vane's exposed area minus the trailing vane's, T = p L (ρ_lead² − ρ_trail²)/2
      function chambers(ph) {
        const g = geo(), z = V.z, pitch = TAU / z, P = ports(), out = [], fv = (Math.PI * V.D - z * s) / (Math.PI * V.D);   // fv: room the vanes take
        const seg = (a, b, pg, kind) => out.push({ a, b, pg, kind, T: fv * pg * 1e5 * (V.L * 1e-3) * ((Math.pow(rho(g, b), 2) - Math.pow(rho(g, a), 2)) / 2) * 1e-6 });
        const state = (tr, ld) => {
          if (tr < P.a2 && ld > P.a1) return seg(tr, ld, V.p, 'supply');
          if (tr >= P.a2 && ld <= P.eS) {
            const v0 = areaBetween(g, P.a2, P.a2 + pitch), vol = areaBetween(g, tr, ld);
            return seg(tr, ld, Math.max(0, (V.p + PA) * Math.pow(v0 / Math.max(1e-6, vol), 1.4) - PA), 'expand');
          }
          if (ld > P.eS && tr < P.eE) return seg(tr, ld, 0, 'exhaust');
          if (ld > P.r1 && tr < P.r2) return seg(tr, ld, 0, 'residual');
          const v0 = areaBetween(g, P.eE, Math.min(TAU, P.eE + pitch)), vol = areaBetween(g, tr, ld);   // trapped: squeezed towards the seal
          return seg(tr, ld, clamp(PA * Math.pow(v0 / Math.max(1e-6, vol), 1.4) - PA, 0, V.p), 'trapped');
        };
        for (let k = 0; k < z; k++) {
          const tr = ((ph + k * pitch) % TAU + TAU) % TAU, ld = tr + pitch;
          if (ld > TAU) { const b = ld - TAU; seg(0, b, b > P.a1 ? V.p : 0, b > P.a1 ? 'supply' : 'exhaust'); state(tr, TAU); }
          else state(tr, ld);
        }
        return out;
      }
      function torqueCurve() {
        const pts = []; let sum = 0, mn = Infinity, mx = -Infinity;
        for (let i = 0; i <= 180; i++) { const ph = TAU * i / 180, T = chambers(ph).reduce((a, ch) => a + ch.T, 0); pts.push([i * 2, T]); if (i < 180) { sum += T; mn = Math.min(mn, T); mx = Math.max(mx, T); } }
        return { pts, mean: sum / 180, mn, mx };
      }
      const loop = kit.loop(dt => {
        t += dt;
        const g = geo(), Vd = 2 * g.e * V.L * (Math.PI * V.D - V.z * s) / 1000;          // cm³/rev
        if (!torq) torq = torqueCurve();
        const sealed = V.spr || spin > 0.3;                    // without springs the vanes seal only once centrifugal force holds them out
        if (running && sealed) spin = Math.min(1, spin + dt * 1.5);
        else spin = Math.max(0, spin - dt * (running ? 0.4 : 1.2));
        phi += V.dir * spin * dt * 1.6;
        const Ti = Vd * 1e-6 * V.p * 1e5 / TAU, a2 = ports().a2;
        const vClose = areaBetween(g, a2, a2 + TAU / V.z) * V.L / 1e6 * (Math.PI * V.D - V.z * s) / (Math.PI * V.D);   // litres in a chamber as the inlet closes
        const airRev = V.z * vClose * (V.p + PA) / PA;
        ro.set('V', Vd.toFixed(1) + ' cm³/rev');
        ro.set('T', torq.mean.toFixed(2) + ' N·m (' + torq.mn.toFixed(2) + ' – ' + torq.mx.toFixed(2) + ')');
        ro.set('Ti', Ti.toFixed(2) + ' N·m');
        ro.set('air', (airRev).toFixed(3) + ' L ANR per rev (' + (airRev * 1000 / 60).toFixed(1) + ' L/s at 1000 rpm)');
        ro.set('tpa', airRev > 0 ? (torq.mean / airRev).toFixed(1) + ' N·m per L/rev' : '—');
        ro.set('st', !running ? 'stopped' : !sealed ? 'vanes in their slots: air blows through, no torque — give it a spin' : spin < 1 ? 'starting' : 'running');
        if (t - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = t;
          pl.set({ series: [{ pts: torq.pts, label: 'torque from the air' }, { pts: [[0, Ti], [360, Ti]], label: 'full admission Vp/2π', dash: [5, 4], color: kit.colors().muted }],
            hlines: [{ y: torq.mean, label: 'mean' }], marks: [{ x: ((((V.dir > 0 ? phi : -phi) % TAU) + TAU) % TAU) * 180 / Math.PI, y: chambers(V.dir > 0 ? phi : -phi).reduce((a, ch) => a + ch.T, 0) }] });
        }
        // drawing: the bore, the chambers coloured by pressure, the rotor and its vanes, the ports
        const c = design(st, 640, 330), C = kit.colors(), S = kit.fsym;
        const cx = 200, cy = 160, k = 105 / g.R;                    // px per mm
        const ph = V.dir > 0 ? phi : -phi;
        // the rotor centre sits e below the bore centre, so the sealing line is at the bottom
        const rc = [cx, cy + g.e * k];
        const P = (psi, rr) => { const th = Math.PI / 2 + V.dir * psi; return [rc[0] + rr * k * Math.cos(th), rc[1] + rr * k * Math.sin(th)]; };
        // ports, outside the bore
        const port = (a, b, col, label) => {
          c.strokeStyle = col; c.lineWidth = 10; c.beginPath();
          const th1 = Math.PI / 2 + V.dir * a, th2 = Math.PI / 2 + V.dir * b;
          c.arc(cx, cy, g.R * k + 7, Math.min(th1, th2), Math.max(th1, th2)); c.stroke();
          const m = (a + b) / 2, th = Math.PI / 2 + V.dir * m;
          kit.label(c, label, cx + (g.R * k + 30) * Math.cos(th), cy + (g.R * k + 30) * Math.sin(th) + 4, { color: C.text, size: 11, align: 'center' });
        };
        const pw = ports();
        port(pw.a1, pw.a2, S.col('air'), 'inlet');
        port(pw.eS, pw.eE, S.col('exhaust'), 'exhaust');
        if (V.rev) port(pw.r1, pw.r2, S.col('idle'), 'idle port');
        const chs = sealed ? chambers(ph) : [];
        for (const ch of chs) {
          const f = clamp(ch.pg / Math.max(0.1, V.p), 0, 1);
          c.fillStyle = ch.kind === 'supply' ? S.col('air') : ch.kind === 'expand' || ch.kind === 'trapped' ? 'hsl(215 80% ' + (72 - 27 * f).toFixed(0) + '%)' : S.col('exhaust');
          c.globalAlpha = ch.kind === 'exhaust' || ch.kind === 'residual' ? 0.35 : 0.85;
          c.beginPath();
          const N = 16;
          for (let i = 0; i <= N; i++) { const a = ch.a + (ch.b - ch.a) * i / N, q = P(a, g.r); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }
          for (let i = N; i >= 0; i--) { const a = ch.a + (ch.b - ch.a) * i / N, q = P(a, rho(g, a)); c.lineTo(q[0], q[1]); }
          c.closePath(); c.fill();
        }
        c.globalAlpha = 1;
        if (!sealed && running) { c.fillStyle = S.col('exhaust'); c.globalAlpha = 0.4; c.beginPath(); c.arc(cx, cy, g.R * k, 0, TAU); c.fill(); c.globalAlpha = 1; }
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, g.R * k, 0, TAU); c.stroke();
        c.fillStyle = C.surface2 || C.bg2; c.beginPath(); c.arc(rc[0], rc[1], g.r * k, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        c.fillStyle = C.text; c.beginPath(); c.arc(rc[0], rc[1], 7, 0, TAU); c.fill();
        // vanes
        const out = sealed ? 1 : 0;
        for (let j = 0; j < V.z; j++) {
          const a = ((ph + j * TAU / V.z) % TAU + TAU) % TAU, tip = out ? rho(g, a) : g.r, base = tip - (2 * g.e + 3);
          const p1 = P(a, Math.max(2, base)), p2 = P(a, tip);
          c.strokeStyle = C.warn; c.lineWidth = Math.max(2, s * k * 0.8); c.lineCap = 'butt'; c.beginPath(); c.moveTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]); c.stroke();
          if (V.spr) { const q = P(a, Math.max(2, base - 2)); c.fillStyle = C.muted; c.beginPath(); c.arc(q[0], q[1], 2, 0, TAU); c.fill(); }
        }
        c.lineCap = 'round';
        // direction arrow
        const ar = g.R * k + 48, a0 = -Math.PI / 2 - 0.5 * V.dir, a1e = -Math.PI / 2 + 0.5 * V.dir;
        c.strokeStyle = C.accent; c.lineWidth = 2.5; c.beginPath(); c.arc(cx, cy, ar, Math.min(a0, a1e), Math.max(a0, a1e)); c.stroke();
        kit.arrow(c, cx + ar * Math.cos(a1e - 0.05 * V.dir), cy + ar * Math.sin(a1e - 0.05 * V.dir), cx + ar * Math.cos(a1e), cy + ar * Math.sin(a1e), C.accent, 2.5);
        kit.label(c, 'sealing line', cx, cy + g.R * k + 22, { color: C.muted, size: 11, align: 'center' });
        // legend and numbers
        const lx = 400;
        const key = [[S.col('air'), 'supply pressure ' + V.p.toFixed(1) + ' bar'], ['hsl(215 80% 60%)', 'expanding (inlet closed)'], [S.col('exhaust'), 'exhausting']];
        key.forEach((q, i) => { c.fillStyle = q[0]; c.fillRect(lx, 40 + i * 22, 14, 14); kit.label(c, q[1], lx + 22, 52 + i * 22, { color: C.text, size: 12, align: 'left' }); });
        kit.label(c, 'bore ' + V.D + ' mm, e = ' + g.e.toFixed(1) + ' mm, ' + V.z + ' vanes', lx, 132, { color: C.text, size: 12, align: 'left' });
        kit.label(c, 'displacement ' + Vd.toFixed(1) + ' cm³/rev', lx, 154, { color: C.text, size: 12, align: 'left' });
        kit.label(c, 'mean torque ' + torq.mean.toFixed(2) + ' N·m', lx, 176, { color: C.accent, size: 13, weight: 700, align: 'left' });
        kit.label(c, 'chambers of ' + V.L + ' mm rotor, drawn to scale', lx, 206, { color: C.muted, size: 11, align: 'left' });
        if (!sealed && running) kit.label(c, 'no seal: air blows through', lx, 240, { color: C.bad, size: 13, weight: 700, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ as-piston-motor */
  Hyper.sim('as-piston-motor', {
    title: 'A radial piston air motor',
    blurb: `A radial piston motor seen from the end: the cylinders stand round the crank like spokes, a distributor admits air to each piston on its working stroke (blue) and opens it to the exhaust on the way back (pale). The graph shows the torque on the crank against its angle — a thin line for each cylinder, the thick line for their sum, the dashed line for the load. The motor can start only where the thick line is above the load.

**Try this**
- Set one cylinder, then two: the total falls to zero at the dead centres. Press *Stop at the worst angle* and *Run*: it cannot start.
- Try three, four, five and six cylinders and read the ripple: five is smoothest of these, and six is no better than three, because opposite cylinders work in pairs.
- With five cylinders raise the load to 95 % of the mean torque, stop at the worst angle and run again: it still starts.
- Close the inlet earlier (*cut-off* 50 %): the air expands in the cylinder, the air per revolution falls a lot, the torque less — the economy of a piston motor at low speed.
- Lower the pressure: every torque falls in proportion to the gauge pressure.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const [g1] = graphs(box.stage, 1);
      let V = null, th = 0, w = 0, running = true, curve = null, lastPlot = -1, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'z', label: 'Number of cylinders', min: 1, max: 7, step: 1, value: 5 },
        { id: 'd', label: 'Bore', min: 30, max: 80, step: 1, value: 60, unit: 'mm' },
        { id: 's', label: 'Stroke', min: 20, max: 80, step: 1, value: 45, unit: 'mm' },
        { id: 'p', label: 'Supply pressure (gauge)', min: 1, max: 8, step: 0.1, value: 6, unit: 'bar' },
        { id: 'cut', label: 'Inlet cut-off, % of the working stroke', min: 40, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'load', label: 'Load, % of the full-admission mean torque', min: 0, max: 130, step: 1, value: 60, unit: '%' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run', primary: true }, { id: 'stop', label: 'Stop' }, { id: 'worst', label: 'Stop at the worst angle' }] }
      ], id => {
        if (id === 'run') running = true;
        if (id === 'stop') { running = false; w = 0; }
        if (id === 'worst') { running = false; w = 0; if (curve) th = curve.worst; }
        curve = null; lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['V', 'Displacement'], ['Tm', 'Mean torque (full admission Vp/2π)'], ['rip', 'Lowest – highest torque, ripple'], ['wst', 'Worst starting position'], ['air', 'Free air per revolution'], ['st', 'State']]);
      const pl = kit.plot(g1, { x: { label: 'crank angle (°)', min: 0, max: 360 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 180);
      const PA = 1.013, X0 = 0.05;                              // dead volume as a fraction of the stroke
      const dims = () => ({ A: Math.PI * V.d * V.d / 4 * 1e-6, r: V.s / 2 * 1e-3 });
      // gauge pressure (bar) in a cylinder at its own crank angle a (0 = top dead centre)
      const pressure = a => {
        a = ((a % TAU) + TAU) % TAU;
        if (a >= Math.PI) return 0;
        const x = (1 - Math.cos(a)) / 2, c = V.cut / 100, ps = V.p + PA;
        return Math.max(0, (x <= c ? ps : ps * Math.pow((c + X0) / (x + X0), 1.4)) - PA);
      };
      const cylT = (k, a) => { const D = dims(), ak = a - k * TAU / V.z; return pressure(ak) * 1e5 * D.A * D.r * Math.max(0, Math.sin(((ak % TAU) + TAU) % TAU)); };
      const total = a => { let s = 0; for (let k = 0; k < V.z; k++) s += cylT(k, a); return s; };
      function build() {
        const N = 360, tot = [], each = []; let sum = 0, mn = Infinity, mx = -Infinity, worst = 0;
        for (let k = 0; k < Math.min(V.z, 7); k++) each.push([]);
        for (let i = 0; i <= N; i++) {
          const a = TAU * i / N, T = total(a); tot.push([i, T]);
          for (let k = 0; k < each.length; k++) each[k].push([i, cylT(k, a)]);
          if (i < N) { sum += T; if (T < mn) { mn = T; worst = a; } mx = Math.max(mx, T); }
        }
        const D = dims(), Vd = V.z * D.A * 2 * D.r;
        return { tot, each, mean: sum / N, mn, mx, worst, Vd, Tfa: Vd * V.p * 1e5 / TAU };
      }
      const loop = kit.loop(dt => {
        t += dt;
        if (!curve) curve = build();
        const TL = V.load / 100 * curve.Tfa, w0 = 1500 * TAU / 60, J = Math.max(1e-4, curve.Tfa * 0.004);
        const sub = 20, h = dt / sub;
        for (let k = 0; k < sub; k++) {
          const Tm = running ? total(th) * (1 - w / w0) : 0;
          if (w <= 0 && Tm <= TL) { w = 0; break; }
          w = Math.max(0, w + h * (Tm - TL) / J);
          th += w * h / 25;                                       // drawn 25 × slower than it turns
        }
        const Tnow = total(th), rip = curve.mean > 0 ? (curve.mx - curve.mn) / curve.mean : 0;
        const airRev = V.z * dims().A * 2 * dims().r * (V.cut / 100 + X0) * (V.p + PA) / PA * 1000;
        ro.set('V', (curve.Vd * 1e6).toFixed(0) + ' cm³/rev');
        ro.set('Tm', curve.mean.toFixed(1) + ' N·m (' + curve.Tfa.toFixed(1) + ')');
        ro.set('rip', curve.mn.toFixed(1) + ' – ' + curve.mx.toFixed(1) + ' N·m, ' + (curve.mn <= 1e-9 ? 'dead points' : (100 * rip).toFixed(0) + ' %'));
        ro.set('wst', (curve.worst * 180 / Math.PI).toFixed(0) + '°: ' + curve.mn.toFixed(1) + ' N·m = ' + (curve.mean > 0 ? 100 * curve.mn / curve.mean : 0).toFixed(0) + ' % of the mean');
        ro.set('air', airRev.toFixed(2) + ' L ANR (' + (airRev > 0 ? curve.mean / airRev : 0).toFixed(1) + ' N·m per L/rev)');
        ro.set('st', !running ? 'stopped at ' + ((((th % TAU) + TAU) % TAU) * 180 / Math.PI).toFixed(0) + '° — torque here ' + Tnow.toFixed(1) + ' N·m' : w === 0 ? (Tnow <= 1e-3 * curve.Tfa ? 'stuck on a dead point: no cylinder can push' : 'stalled: the load is above the torque at this angle') : 'running, ' + rpmOf(w).toFixed(0) + ' rpm');
        if (t - lastPlot > 0.25 || lastPlot < 0) {
          lastPlot = t;
          const C = kit.colors(), ser = curve.each.map((pts, k) => ({ pts, label: k === 0 ? 'one cylinder' : undefined, color: C.faint || C.muted, width: 1 }));
          ser.push({ pts: curve.tot, label: 'sum of ' + V.z, width: 2.5 });
          ser.push({ pts: [[0, TL], [360, TL]], label: 'load', dash: [5, 4], color: C.series[1] });
          const a = ((th % TAU) + TAU) % TAU;
          pl.set({ series: ser, marks: [{ x: a * 180 / Math.PI, y: Tnow, label: 'now' }], hlines: [{ y: curve.mean, label: 'mean' }] });
        }
        // drawing
        const c = design(st, 640, 320), C = kit.colors(), S = kit.fsym;
        const cx = 200, cy = 160, r = V.s / 2, l = 2.4 * r, kpx = 140 / (r + l + 0.7 * V.d + 8);
        for (let k = 0; k < V.z; k++) {
          const phi = -Math.PI / 2 + k * TAU / V.z, ak = th - k * TAU / V.z, akn = ((ak % TAU) + TAU) % TAU;
          const dist = r * Math.cos(akn) + Math.sqrt(Math.max(0, l * l - Math.pow(r * Math.sin(akn), 2)));
          const ux = Math.cos(phi), uy = Math.sin(phi), vx = -uy, vy = ux, hw = V.d / 2 * kpx;
          const inner = (l - r - 4) * kpx, outer = (r + l + 0.7 * V.d + 6) * kpx, pin = [cx + r * kpx * Math.cos(-Math.PI / 2 + th), cy + r * kpx * Math.sin(-Math.PI / 2 + th)];
          const pg = pressure(akn), work = akn < Math.PI;
          const q = (a, b) => [cx + ux * a + vx * b, cy + uy * a + vy * b];
          // cylinder barrel, gas space, piston and rod
          const gasIn = (dist + 0.35 * V.d) * kpx;
          c.fillStyle = work ? S.col('air') : S.col('exhaust'); c.globalAlpha = work ? 0.25 + 0.6 * clamp(pg / Math.max(0.1, V.p), 0, 1) : 0.25;
          c.beginPath(); const g1p = q(gasIn, -hw), g2p = q(outer, -hw), g3p = q(outer, hw), g4p = q(gasIn, hw);
          c.moveTo(g1p[0], g1p[1]); c.lineTo(g2p[0], g2p[1]); c.lineTo(g3p[0], g3p[1]); c.lineTo(g4p[0], g4p[1]); c.closePath(); c.fill(); c.globalAlpha = 1;
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath();
          let e1 = q(inner, -hw - 3), e2 = q(outer, -hw - 3); c.moveTo(e1[0], e1[1]); c.lineTo(e2[0], e2[1]);
          e1 = q(inner, hw + 3); e2 = q(outer, hw + 3); c.moveTo(e1[0], e1[1]); c.lineTo(e2[0], e2[1]);
          e1 = q(outer, -hw - 3); e2 = q(outer, hw + 3); c.moveTo(e1[0], e1[1]); c.lineTo(e2[0], e2[1]); c.stroke();
          const pc = q(dist * kpx, 0), p1 = q((dist - 0.35 * V.d) * kpx, -hw + 1), p2 = q((dist + 0.35 * V.d) * kpx, hw - 1);
          c.fillStyle = C.muted; c.beginPath(); c.moveTo(p1[0], p1[1]);
          const p3 = q((dist + 0.35 * V.d) * kpx, -hw + 1), p4 = q((dist - 0.35 * V.d) * kpx, hw - 1);
          c.lineTo(p3[0], p3[1]); c.lineTo(p2[0], p2[1]); c.lineTo(p4[0], p4[1]); c.closePath(); c.fill();
          c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(pc[0], pc[1]); c.lineTo(pin[0], pin[1]); c.stroke();
          const lab = q(outer + 14, 0);
          kit.label(c, work ? pg.toFixed(1) + ' bar' : 'exh', lab[0], lab[1] + 4, { color: work ? C.text : C.muted, size: 10, align: 'center' });
        }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, r * kpx + 6, 0, TAU); c.stroke();
        const pin = [cx + r * kpx * Math.cos(-Math.PI / 2 + th), cy + r * kpx * Math.sin(-Math.PI / 2 + th)];
        c.strokeStyle = C.warn; c.lineWidth = 6; c.beginPath(); c.moveTo(cx, cy); c.lineTo(pin[0], pin[1]); c.stroke();
        kit.dot(c, pin[0], pin[1], 5, C.warn); kit.dot(c, cx, cy, 4, C.text);
        const lx = 430;
        kit.label(c, V.z + ' cylinder' + (V.z > 1 ? 's' : '') + ', ' + V.d + ' × ' + V.s + ' mm', lx, 50, { color: C.text, size: 13, weight: 700, align: 'left' });
        kit.label(c, 'torque now ' + Tnow.toFixed(1) + ' N·m', lx, 80, { color: C.accent, size: 13, weight: 700, align: 'left' });
        kit.label(c, 'load ' + TL.toFixed(1) + ' N·m', lx, 104, { color: C.text, size: 12, align: 'left' });
        c.fillStyle = S.col('air'); c.fillRect(lx, 128, 14, 14); kit.label(c, 'working stroke', lx + 22, 140, { color: C.text, size: 12, align: 'left' });
        c.fillStyle = S.col('exhaust'); c.globalAlpha = 0.5; c.fillRect(lx, 150, 14, 14); c.globalAlpha = 1; kit.label(c, 'exhausting', lx + 22, 162, { color: C.text, size: 12, align: 'left' });
        kit.label(c, 'drawn 25 × slower than it turns', lx, 200, { color: C.muted, size: 11, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ as-turbine */
  const CP = 1005, RAIR = 287.06, GAM = 1.4, PATMB = 1.013, T0K = 293.15;
  // mass flow through a nozzle of throat area A (m²) from p0 to pa (Pa), choked or not
  function nozzleFlow(A, p0, pa) {
    const pr = pa / p0, crit = Math.pow(2 / (GAM + 1), GAM / (GAM - 1));
    if (p0 <= pa) return 0;
    if (pr <= crit) return A * p0 / Math.sqrt(T0K) * Math.sqrt(GAM / RAIR) * Math.pow(2 / (GAM + 1), (GAM + 1) / (2 * (GAM - 1)));
    return A * p0 * Math.sqrt(2 * GAM / ((GAM - 1) * RAIR * T0K) * (Math.pow(pr, 2 / GAM) - Math.pow(pr, (GAM + 1) / GAM)));
  }
  const jetSpeed = (p0, pa) => p0 > pa ? Math.sqrt(2 * CP * T0K * (1 - Math.pow(pa / p0, (GAM - 1) / GAM))) : 0;

  Hyper.sim('as-turbine', {
    title: 'An air turbine and its governor',
    blurb: `Air from the supply expands through a nozzle into a jet (its ideal speed is shown) and drives the buckets of a small wheel. The force on each bucket is proportional to the jet speed minus the bucket speed, so the torque falls in a straight line with speed, and the power — first graph — is a parabola that peaks when the buckets move at half the jet speed. The second graph is the efficiency against the speed ratio u/v.

**Try this**
- With no load and no governor, press *Start*: the wheel races towards its runaway speed — for a 15 mm blade radius, a couple of hundred thousand rpm.
- Tick the governor: a valve throttles the nozzle as the speed passes the set-point, and the speed stays nearly constant as you add load.
- Make the wheel smaller: the best speed rises in inverse proportion — dental turbines are a few millimetres across and turn at hundreds of thousands of rpm.
- Load it until the dot sits at the top of the parabola (u/v = 0.5): that is the most power this jet can give.
- Lower the supply pressure: the jet slows, the mass flow falls, and the power drops faster than the pressure. Read the jet temperature — far below freezing.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const [g1, g2] = graphs(box.stage, 2);
      let V = null, w = 0, ang = 0, gv = 1, lastPlot = -1, t = 0, on = true;
      const ctl = kit.controls(box.side, [
        { id: 'p', label: 'Supply pressure (gauge)', min: 0.5, max: 7, step: 0.1, value: 6, unit: 'bar' },
        { id: 'A', label: 'Nozzle throat area', min: 1, max: 30, step: 0.5, value: 6, unit: 'mm²' },
        { id: 'r', label: 'Blade-ring radius', min: 3, max: 40, step: 0.5, value: 15, unit: 'mm' },
        { id: 'load', label: 'Load, % of the stall torque at 6 bar', min: 0, max: 100, step: 1, value: 25, unit: '%' },
        { id: 'gov', type: 'check', label: 'Governor', value: false },
        { id: 'set', label: 'Governor set-point, % of the best speed', min: 20, max: 150, step: 1, value: 100, unit: '%' },
        { type: 'buttons', items: [{ id: 'start', label: 'Start', primary: true }, { id: 'stop', label: 'Shut off the air' }] }
      ], id => {
        if (id === 'start') { on = true; w = 0; }
        if (id === 'stop') on = false;
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['jet', 'Jet speed (ideal) · jet temperature'], ['m', 'Air: mass flow · free air'], ['n', 'Speed · best · runaway'], ['T', 'Torque · power'], ['eta', 'Share of the jet\'s power taken'], ['g', 'Governor valve']]);
      const pP = kit.plot(g1, { x: { label: 'speed (1000 rpm)', min: 0 }, y: { label: 'power (W)', min: 0 }, legend: true }, 180);
      const pE = kit.plot(g2, { x: { label: 'blade speed / jet speed  u/v', min: 0, max: 1.1 }, y: { label: 'efficiency (%)', min: 0, max: 100 } }, 180);
      const PHI = 0.95, ETAB = 0.85;                          // nozzle velocity coefficient, bucket efficiency
      const loop = kit.loop(dt => {
        t += dt;
        const r = V.r * 1e-3, A = V.A * 1e-6, pa = PATMB * 1e5, pFull = (V.p + PATMB) * 1e5;
        const ref = (() => { const p6 = (6 + PATMB) * 1e5; return 2 * nozzleFlow(A, p6, pa) * r * ETAB * PHI * jetSpeed(p6, pa); })();   // stall torque at 6 bar
        const TL = V.load / 100 * ref;
        const J = 0.5 * 7800 * Math.PI * Math.pow(1.1 * r, 4) * (0.4 * r) + 1e-10;
        const vFull = PHI * jetSpeed(pFull, pa), wBest = vFull / (2 * r);
        const sub = 80, h = dt / sub;
        let m = 0, v = 0, Tm = 0;
        for (let k = 0; k < sub; k++) {
          // a proportional governor: fully open below the set-point, closed 4 % above it
          if (V.gov) { const wSet = wBest * V.set / 100; gv = clamp(1 - (w - wSet) / (0.04 * wSet), 0, 1); }
          else gv = 1;
          const p0 = on ? pa + (pFull - pa) * gv : pa;
          m = nozzleFlow(A, p0, pa); v = PHI * jetSpeed(p0, pa);
          const u = w * r;
          Tm = v > 0 ? 2 * m * r * ETAB * (v - u - 0.05 * u * u / v) : -0.05 * ref * Math.min(1, w / Math.max(1, wBest));   // bucket force, minus a little windage
          const net = Tm - (w > 0 ? TL : Math.min(TL, Math.max(0, Tm)));
          if (w <= 0 && Tm <= TL) { w = 0; continue; }
          w = Math.max(0, w + h * net / J);
        }
        const u = w * r, P = Math.max(0, (Tm) * w), Pjet = m * v * v / 2, n = rpmOf(w);
        const p0now = on ? pa + (pFull - pa) * gv : pa, Tj = T0K * Math.pow(pa / p0now, (GAM - 1) / GAM) - 273.15;
        const nRun = rpmOf(vFull / r * 0.97), nBest = rpmOf(wBest);
        ro.set('jet', (v / PHI).toFixed(0) + ' m/s · ' + Tj.toFixed(0) + ' °C');
        ro.set('m', (m * 1000).toFixed(2) + ' g/s · ' + (m / 1.188 * 1000).toFixed(1) + ' L/s ANR');
        ro.set('n', (n / 1000).toFixed(1) + ' · ' + (nBest / 1000).toFixed(0) + ' · ≈ ' + (nRun / 1000).toFixed(0) + ' thousand rpm');
        ro.set('T', (Tm * 1000).toFixed(1) + ' mN·m · ' + P.toFixed(0) + ' W');
        ro.set('eta', Pjet > 0 ? (100 * P / Pjet).toFixed(0) + ' % (u/v = ' + (v > 0 ? u / v : 0).toFixed(2) + ')' : '—');
        ro.set('g', V.gov ? (100 * gv).toFixed(0) + ' % open' : 'none: fully open');
        if (t - lastPlot > 0.15 || lastPlot < 0) {
          lastPlot = t;
          const mF = nozzleFlow(A, pFull, pa), pts = [], N = 60, nMax = rpmOf(vFull / r) * 1.05;
          for (let i = 0; i <= N; i++) { const ww = (vFull / r) * 1.05 * i / N, uu = ww * r, TT = 2 * mF * r * ETAB * (vFull - uu - 0.05 * uu * uu / vFull); pts.push([rpmOf(ww) / 1000, Math.max(0, TT * ww)]); }
          const ef = []; for (let i = 0; i <= 50; i++) { const x = i / 50; ef.push([x, Math.max(0, 100 * ETAB * 4 * x * (1 - x - 0.05 * x * x))]); }
          pP.set({ x: { label: 'speed (1000 rpm)', min: 0, max: nMax / 1000 }, series: [{ pts, label: 'full supply, no governor' }], marks: [{ x: n / 1000, y: P, label: 'now' }], vlines: [{ x: nBest / 1000, label: 'u = v/2' }].concat(V.gov ? [{ x: nBest * V.set / 100 / 1000, label: 'set' }] : []) });
          pE.set({ series: [{ pts: ef, label: 'efficiency' }], marks: [{ x: v > 0 ? u / v : 0, y: Pjet > 0 ? 100 * P / Pjet : 0 }] });
        }
        // drawing: nozzle, jet, bucket wheel, governor valve
        const c = design(st, 640, 270), C = kit.colors(), S = kit.fsym;
        ang += w * dt / 3000;
        const cx = 330, cy = 140, R = 90;
        c.strokeStyle = on ? S.col('air') : S.col('idle'); c.lineWidth = 6; c.beginPath(); c.moveTo(40, 58); c.lineTo(150, 58); c.stroke();
        // governor valve
        c.fillStyle = C.surface2 || C.bg2; c.fillRect(150, 44, 34, 28); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(150, 44, 34, 28);
        c.fillStyle = S.col('air'); c.fillRect(154, 70 - 22 * gv, 26, 22 * gv);
        kit.label(c, V.gov ? 'governor ' + (100 * gv).toFixed(0) + ' %' : 'no governor', 167, 36, { color: C.muted, size: 11, align: 'center' });
        c.strokeStyle = on ? S.col('air') : S.col('idle'); c.lineWidth = 6; c.beginPath(); c.moveTo(184, 58); c.lineTo(230, 58); c.stroke();
        // nozzle
        c.fillStyle = C.muted; c.beginPath(); c.moveTo(230, 46); c.lineTo(282, 53); c.lineTo(282, 63); c.lineTo(230, 70); c.closePath(); c.fill();
        const jl = clamp(v / 520, 0, 1) * 70;
        if (on && v > 0) { for (let i = 0; i < 6; i++) { const f = ((t * 6 + i / 6) % 1); c.fillStyle = S.col('exhaust'); c.globalAlpha = 0.8; c.beginPath(); c.arc(284 + f * jl, 58 + (i % 2 ? 1.5 : -1.5), 2.5, 0, TAU); c.fill(); } c.globalAlpha = 1; kit.arrow(c, 284, 58, 284 + jl, 58, S.col('air'), 2.5); }
        kit.label(c, 'jet ' + (v / PHI).toFixed(0) + ' m/s', 300, 36, { color: C.text, size: 12, align: 'center' });
        // wheel with buckets (jet hits the top)
        c.strokeStyle = C.text; c.lineWidth = 2; c.fillStyle = C.surface2 || C.bg2; c.beginPath(); c.arc(cx, cy, R - 10, 0, TAU); c.fill(); c.stroke();
        for (let i = 0; i < 20; i++) {
          const a = ang + i * TAU / 20, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
          c.save(); c.translate(x, y); c.rotate(a + Math.PI / 2); c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 8, 0, Math.PI); c.stroke(); c.restore();
        }
        kit.dot(c, cx, cy, 6, C.text);
        kit.arrow(c, cx + 20, cy - R - 16, cx + 20 + clamp(u / 520, 0, 1) * 70, cy - R - 16, C.warn, 2.5);
        kit.label(c, 'blades u = ' + u.toFixed(0) + ' m/s', cx, cy + R + 26, { color: C.warn, size: 12, align: 'center' });
        kit.label(c, (n / 1000).toFixed(1) + ' thousand rpm', 540, 120, { color: C.text, size: 15, weight: 700, align: 'center' });
        kit.label(c, 'wheel drawn thousands of times slower', 540, 146, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'blade radius ' + V.r.toFixed(1) + ' mm', 540, 170, { color: C.muted, size: 11, align: 'center' });
        if (V.load > 0) kit.label(c, 'load ' + (TL * 1000).toFixed(1) + ' mN·m', 540, 196, { color: C.text, size: 12, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ as-air-control */
  // atmospheric dew point (°C) of air dried to a pressure dew point pdp (°C) at gauge pressure p (bar), by the Magnus formula
  const es = T => 6.112 * Math.exp(17.62 * T / (243.12 + T));
  const dewOf = e => { const L = Math.log(e / 6.112); return 243.12 * L / (17.62 - L); };
  const atmDew = (pdp, p) => dewOf(es(pdp) * 1.013 / (p + 1.013));

  Hyper.sim('as-air-control', {
    title: 'Controlling an air winch',
    blurb: `A reversible 1 kW vane motor drives a winch drum through a 5/3 valve, with a flow control (throttle plus bypass check valve) in each motor line and a spring-applied brake that is released only while the valve is shifted. The graph shows the motor's torque against its speed in the direction the valve drives it: the dashed line at 6.3 bar with the throttles open, the solid line as you have set it, and the load. Below free speed the motor drives; beyond it, when the load pulls, the motor brakes — hard if its exhaust is throttled, weakly if only its inlet is.

**Try this**
- *Lift* with the inlet throttled to 30 %: the free speed drops but the stall torque stays — the load still starts.
- Switch to *Lower*: the load now drives the motor. With inlet throttling it runs away far beyond free speed; choose *meter-out* and the throttled exhaust holds the speed.
- Use the regulator instead: the stall torque falls with the pressure. Set the load above it and lift: the drum turns backwards — the motor is too weak and the load wins.
- *Centre* the valve with the brake off: with an exhaust centre the load runs down; with a closed centre the motor brakes on trapped air, but the load still creeps. Tick the brake: it holds.
- Change the dryer and watch the exhaust line: expanding air can fall below the air's dew point and below freezing — ice in the silencer.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const [g1] = graphs(box.stage, 1);
      const TS = 6.4, N0 = 6000, PR = 6.3, PA = 1.013, QR = 1.2;          // the 1 kW vane motor of the text, at 6.3 bar
      let V = null, v = 0, ph = 0, lastPlot = -1, t = 0, lastDir = 1, drop = 0, ang = 0;
      const ctl = kit.controls(box.side, [
        { id: 'dir', type: 'select', label: 'Valve', options: [['Lift (1 → 2)', 1], ['Centre', 0], ['Lower (1 → 4)', -1]], value: 1 },
        { id: 'method', type: 'select', label: 'Speed control', options: [['Throttle the inlet (meter-in)', 'in'], ['Throttle the exhaust (meter-out)', 'out'], ['Regulator only (throttles open)', 'reg']], value: 'in' },
        { id: 'thr', label: 'Throttle opening', min: 5, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'p', label: 'Regulator setting (pressure at the motor)', min: 2, max: 7, step: 0.1, value: 6.3, unit: 'bar' },
        { id: 'load', label: 'Hanging load, % of the stall torque at 6.3 bar', min: 0, max: 120, step: 1, value: 40, unit: '%' },
        { id: 'centre', type: 'select', label: 'Valve centre', options: [['Exhaust centre', 'exh'], ['Closed centre', 'closed']], value: 'exh' },
        { id: 'brake', type: 'check', label: 'Spring-applied brake (released while the valve is shifted)', value: true },
        { id: 'dryer', type: 'select', label: 'Air drying', options: [['None: saturated at 25 °C in the line', 25], ['Refrigerant dryer, +3 °C pressure dew point', 3], ['Desiccant dryer, −40 °C pressure dew point', -40]], value: 3 }
      ], id => { if (id === 'dir' && V.dir !== 0) lastDir = V.dir; lastPlot = -1; });
      V = ctl.values;
      ctl.show('thr', V.method !== 'reg');
      const ro = kit.readout(box.side, [['line', 'Torque line: stall · free speed'], ['v', 'Drum (motor) speed'], ['T', 'Motor torque · load torque'], ['q', 'Chamber pressure · free air used'], ['ex', 'Exhaust: estimate · ideal limit · dew point'], ['st', 'State']]);
      const pl = kit.plot(g1, { x: { label: 'speed in the driven direction (rpm)', min: 0, max: 15000 }, y: { label: 'torque (N·m)' }, legend: true }, 190);
      const J = 0.35 * TS / (N0 * TAU / 60);
      const lineOf = () => {
        const ps = V.p, Ts = TS * ps / PR, n0 = N0 * Math.sqrt((ps + PA) / (PR + PA));
        const n0e = V.method === 'reg' ? n0 : n0 * V.thr / 100, kover = V.method === 'out' ? 3 : 0.25;
        // below the (throttled) free speed the line runs from the stall torque; beyond it the motor is driven and brakes
        const T = s => s < 0 ? Ts : s < n0e ? Ts * (1 - s / n0e) : -kover * Ts * (s - n0e) / n0e;
        return { ps, Ts, n0, n0e, T };
      };
      const loop = kit.loop(dt => {
        t += dt;
        ctl.show('thr', V.method !== 'reg');
        const L = lineOf(), G = V.load / 100 * TS, dir = V.dir, sub = 30, h = dt / sub;
        const brakeSet = V.brake && dir === 0;
        let Tmot = 0;
        for (let k = 0; k < sub; k++) {
          // v: drum speed in rpm, positive when lifting; the load always pulls it downwards with G
          if (dir !== 0) Tmot = dir * L.T(dir * v);
          else Tmot = V.centre === 'closed' ? -clamp(2 * L.Ts * v / (0.05 * N0), -1.5 * L.Ts, 1.5 * L.Ts) : 0;
          let net = Tmot - G;
          if (brakeSet) {
            const Tb = 3 * TS;
            if (Math.abs(v) < 5 && Math.abs(net) < Tb) { v = 0; continue; }
            net -= Math.sign(v) * Tb;
          }
          v += h * net / J * 60 / TAU;
          v = clamp(v, -2.5 * N0, 2.5 * N0);
        }
        const s = dir * v, running = dir !== 0 && Math.abs(v) > 1;
        let pch = 0;
        if (dir !== 0 && s >= 0) pch = V.method === 'in' ? (s < L.n0e ? L.ps * (1 - s / L.n0e) / Math.max(1e-3, 1 - s / L.n0) : 0) : L.ps;
        if (dir !== 0 && s < 0) pch = L.ps;
        const sFlow = clamp(Math.abs(s), 0, L.n0e);
        const Q = dir === 0 ? 0 : QR * (0.2 * (L.ps + PA) / (PR + PA) + 1.6 * sFlow / N0 * (pch + PA) / (PR + PA));
        // the air leaves colder by the work it did (steady flow, no heat from the housing): ΔT = P/(ṁ c_p); the ideal expansion is the floor
        const Tlim = 293.15 * Math.pow(PA / (pch + PA), 0.2857) - 273.15, Pw = Math.max(0, Tmot * v * TAU / 60), mdot = Q / 60 * 1.188;
        const Tex = dir === 0 || mdot <= 0 ? 20 : Math.max(Tlim, 20 - Pw / (mdot * 1005)), adp = atmDew(+V.dryer, L.ps);
        const icing = dir !== 0 && pch > 0.5 && Tex < Math.min(0, adp);
        ro.set('line', L.Ts.toFixed(2) + ' N·m · ' + L.n0e.toFixed(0) + ' rpm' + (V.method === 'reg' ? '' : ' (throttled from ' + L.n0.toFixed(0) + ')'));
        ro.set('v', Math.abs(v).toFixed(0) + ' rpm ' + (v > 1 ? 'lifting' : v < -1 ? 'lowering' : 'stopped') + (Math.abs(v) > 1.2 * N0 ? ' — overspeed!' : ''));
        ro.set('T', Tmot.toFixed(2) + ' · ' + (-G).toFixed(2) + ' N·m (lifting sense)');
        ro.set('q', pch.toFixed(1) + ' bar · ' + (Q * 1000 / 60).toFixed(1) + ' L/s ANR');
        ro.set('ex', dir === 0 ? '—' : Tex.toFixed(0) + ' °C · ' + Tlim.toFixed(0) + ' °C · ' + adp.toFixed(0) + ' °C at 1 bar');
        let msg;
        if (dir === 0) msg = brakeSet ? (v === 0 ? 'brake set: the load is held' : 'brake stopping the drum') : V.centre === 'closed' ? 'closed centre: braking on trapped air — the load creeps down ' + Math.abs(v).toFixed(0) + ' rpm' : 'exhaust centre, no brake: the load runs down!';
        else if (dir === 1 && v < -1) msg = 'the load is heavier than the stall torque: it pulls the drum down';
        else if (Math.abs(v) > 1.2 * N0) msg = 'the load drives the motor far beyond its free speed — throttle the exhaust';
        else if (icing) msg = 'exhaust colder than the air\'s dew point and below 0 °C: ice can form';
        else msg = running ? (dir === 1 ? 'lifting' : 'lowering under control') : 'stalled — holding without harm';
        ro.set('st', msg);
        if (t - lastPlot > 0.15 || lastPlot < 0) {
          lastPlot = t;
          const C = kit.colors(), ref = (() => { const Ts = TS, n0 = N0; return s2 => s2 < n0 ? Ts * (1 - s2 / n0) : -0.25 * Ts * (s2 - n0) / n0; })();
          const xs = []; for (let i = 0; i <= 90; i++) xs.push(15000 * i / 90);
          const dd = dir !== 0 ? dir : lastDir, TLs = dd === 1 ? G : -G;
          pl.set({ y: { label: 'torque (N·m)', min: -1.4 * TS, max: 1.5 * TS },
            series: [{ pts: xs.map(x => [x, L.T(x)]), label: 'motor as set' }, { pts: xs.map(x => [x, ref(x)]), label: '6.3 bar, open', dash: [5, 4], color: C.muted },
              { pts: [[0, TLs], [15000, TLs]], label: dd === 1 ? 'load (lifting)' : 'load (lowering, it drives)', dash: [2, 3], color: C.series[1] }],
            hlines: [{ y: 0 }], marks: dir !== 0 ? [{ x: clamp(Math.abs(s), 0, 15000) * (s < 0 ? 0 : 1), y: Tmot * dir, label: 'now' }] : [] });
        }
        // drawing the circuit
        const c = design(st, 700, 300), C = kit.colors();
        ph += dt * (running ? 1 : 0) * 60;
        const stA = dir === 1 ? 'air' : dir === -1 ? 'exhaust' : V.centre === 'closed' ? 'air' : 'idle';
        const stB = dir === -1 ? 'air' : dir === 1 ? 'exhaust' : V.centre === 'closed' ? 'air' : 'idle';
        const supply = [[60, 270], [60, 250], [72, 250]], toP = [[168, 250], [230, 250], [230, 288], [300, 288], [300, 263]];
        S.line(c, supply, { state: 'air' }); S.line(c, toP, { state: 'air' });
        const lineA = [[309, 207], [309, 192], [440, 192], [440, 178]], upA = [[440, 122], [440, 70], [386, 70]];
        const lineB = [[291, 207], [291, 192], [220, 192], [220, 178]], upB = [[220, 122], [220, 70], [334, 70]];
        if (V.method === 'reg') { S.line(c, [[440, 178], [440, 122]], { state: stA }); S.line(c, [[220, 178], [220, 122]], { state: stB }); }
        S.line(c, lineA, { state: stA }); S.line(c, upA, { state: stA }); S.line(c, lineB, { state: stB }); S.line(c, upB, { state: stB });
        if (running) { const inl = dir === 1 ? lineA.concat(upA) : lineB.concat(upB); S.flow(c, toP.concat(inl), ph, { color: S.col('air') }); }
        S.source(c, 60, 290, { pneumatic: true });
        S.frl(c, 120, 250);
        kit.label(c, 'regulator ' + V.p.toFixed(1) + ' bar', 120, 290, { color: C.text, size: 11, align: 'center' });
        S.valve(c, 300, 235, { spec: V.centre === 'closed' ? '5/3 closed' : '5/3 exhaust', state: dir === 1 ? 2 : dir === -1 ? 0 : 1, s: 36, left: 'lever', right: 'spring', pneumatic: true, exhaust: 'silencer', labels: true });
        if (V.method !== 'reg') {
          S.flowControl(c, 440, 150, { free: V.method === 'out' ? 'up' : 'down' });
          S.flowControl(c, 220, 150, { free: V.method === 'out' ? 'up' : 'down' });
          kit.label(c, V.method === 'out' ? 'meter-out: throttles the air leaving the motor' : 'meter-in: throttles the air entering the motor', 330, 20, { color: C.muted, size: 11, align: 'center' });
        }
        S.motor(c, 360, 70, { pneumatic: true, bidir: true, rot: 90 });
        // drum, rope, load and brake
        ang += v * TAU / 60 * dt / 20;
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(360, 98); c.lineTo(360, 112); c.stroke();
        c.fillStyle = C.surface2 || C.bg2; c.beginPath(); c.arc(360, 128, 16, 0, TAU); c.fill(); c.lineWidth = 2; c.stroke();
        c.strokeStyle = C.muted; c.beginPath(); c.moveTo(360, 128); c.lineTo(360 + 14 * Math.cos(ang), 128 + 14 * Math.sin(ang)); c.stroke();
        drop = clamp(drop - v * dt / 600, -8, 30);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(376, 128); c.lineTo(376, 150 + drop * 0.3); c.stroke();
        c.fillStyle = C.muted; c.fillRect(368, 150 + drop * 0.3, 16, 14);
        c.fillStyle = brakeSet ? C.bad : C.ok; c.fillRect(330, 120, 10, 16);
        kit.label(c, brakeSet ? 'brake set' : 'brake released', 300, 116, { color: brakeSet ? C.bad : C.ok, size: 10, align: 'center' });
        // right: numbers
        const rx = 520;
        kit.label(c, Math.abs(v).toFixed(0) + ' rpm', rx + 70, 70, { color: C.text, size: 16, weight: 700, align: 'center' });
        kit.label(c, v > 1 ? '▲ lifting' : v < -1 ? '▼ lowering' : 'stopped', rx + 70, 94, { color: v < -1 && dir !== -1 ? C.bad : C.muted, size: 12, align: 'center' });
        kit.label(c, 'exhaust about ' + (dir === 0 ? '—' : Tex.toFixed(0) + ' °C'), rx + 70, 150, { color: icing ? C.bad : C.muted, size: 11, align: 'center' });
        kit.label(c, 'dew point at 1 bar ' + adp.toFixed(0) + ' °C', rx + 70, 168, { color: C.muted, size: 11, align: 'center' });
        if (icing) kit.label(c, 'ice risk in the silencer', rx + 70, 190, { color: C.bad, size: 12, weight: 700, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ as-air-vs-electric */
  Hyper.sim('as-air-vs-electric', {
    title: 'Air motor or electric motor: where the energy goes',
    blurb: `Two bars drawn to the same scale: the electricity each drive takes from the meter for every kilowatt it delivers at the shaft. The air bar breaks down into the compressor's heat, the air lost to leaks, and the losses in the motor and its cold exhaust; the electric bar into the motor's losses. The graph shows the yearly energy cost of both against running hours, and the break-even point of an electric drive that costs more to buy.

**Try this**
- With the default numbers, read the ratio: about eight kilowatts of electricity per shaft kilowatt for air against about 1.2 for electric.
- Raise the leaks to 30 % (common in old plants): the air bar grows by almost half.
- Set 200 hours a year: the electric drive's extra price takes many years to pay back — air is fine. At 4000 hours it pays back in weeks.
- Lower the electricity price: the gap in money shrinks, but not the ratio.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200 });
      const [g1] = graphs(box.stage, 1);
      let V = null, dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Shaft power', min: 0.1, max: 10, value: 0.75, unit: 'kW', log: true, sig: 2 },
        { id: 'h', label: 'Running hours per year', min: 100, max: 8000, step: 50, value: 1500, unit: 'h' },
        { id: 'c', label: 'Electricity price, ¤ per kWh', min: 0.05, max: 0.4, step: 0.01, value: 0.2 },
        { id: 'a', label: 'Air motor: free air per shaft kW', min: 1, max: 1.6, step: 0.05, value: 1.3, unit: 'm³/min' },
        { id: 'w', label: 'Compressor specific power, kW per m³/min', min: 5.5, max: 8.5, step: 0.1, value: 6.5 },
        { id: 'leak', label: 'Leaks, share of the air produced', min: 0, max: 40, step: 1, value: 15, unit: '%' },
        { id: 'eta', label: 'Electric motor and drive efficiency', min: 60, max: 96, step: 1, value: 82, unit: '%' },
        { id: 'dK', label: 'Extra purchase cost of the electric drive, ¤', min: 0, max: 5000, step: 50, value: 900 }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['e', 'Electricity per shaft kW: air · electric'], ['eff', 'Overall efficiency: air · electric'], ['kwh', 'Energy per year: air · electric'], ['cost', 'Cost per year: air · electric'], ['be', 'Break-even hours per year'], ['pb', 'Payback of the electric drive']]);
      const pl = kit.plot(g1, { x: { label: 'running hours per year', min: 0, max: 8000 }, y: { label: 'energy cost per year', min: 0, fmt: v => kit.money(v, 0, true) }, fmtY: v => kit.money(v), legend: true }, 180);
      const WISO = 3.5;                                        // kW per m³/min: isothermal compression to about 7 bar gauge
      const loop = kit.loop(() => {
        if (!dirty) return;
        dirty = false;
        const L = V.leak / 100, Ea = V.a * V.w / (1 - L), Ee = 100 / V.eta;
        const heat = V.a / (1 - L) * (V.w - WISO), leaks = WISO * V.a * L / (1 - L), motor = Math.max(0, WISO * V.a - 1);
        const Ca = V.P * Ea * V.h * V.c, Ce = V.P * Ee * V.h * V.c, save = V.P * V.c * (Ea - Ee);
        const be = save > 0 ? V.dK / save : Infinity;
        ro.set('e', Ea.toFixed(1) + ' kW · ' + Ee.toFixed(2) + ' kW (' + (Ea / Ee).toFixed(1) + ' ×)');
        ro.set('eff', (100 / Ea).toFixed(1) + ' % · ' + V.eta.toFixed(0) + ' %');
        ro.set('kwh', (V.P * Ea * V.h).toFixed(0) + ' · ' + (V.P * Ee * V.h).toFixed(0) + ' kWh');
        ro.set('cost', kit.money(Ca, 0) + ' · ' + kit.money(Ce, 0));
        ro.set('be', Number.isFinite(be) ? be.toFixed(0) + ' h' : 'never');
        ro.set('pb', save > 0 && V.h > 0 ? (V.dK / (save * V.h) < 1 ? (12 * V.dK / (save * V.h)).toFixed(1) + ' months' : (V.dK / (save * V.h)).toFixed(1) + ' years') : '—');
        const hs = [0, 8000], C = kit.colors();
        pl.set({ series: [{ pts: hs.map(x => [x, V.P * Ea * x * V.c]), label: 'air motor' }, { pts: hs.map(x => [x, V.P * Ee * x * V.c]), label: 'electric motor', color: C.series[2] },
          { pts: hs.map(x => [x, V.P * Ee * x * V.c + V.dK]), label: 'electric + extra price (first year)', dash: [5, 4], color: C.series[2] }],
          vlines: [{ x: V.h, label: 'you' }].concat(Number.isFinite(be) && be < 8000 ? [{ x: be, label: 'break-even' }] : []) });
        // the two energy bars
        const c = design(st, 700, 230);
        const x0 = 120, W = 540, sc = W / Math.max(Ea, 1e-6);
        const parts = [[heat, 'compressor heat', 'hsl(28 85% 55%)'], [leaks, 'leaks', C.bad], [motor, 'motor and exhaust losses', C.muted], [1, 'shaft', C.ok]];
        let x = x0;
        kit.label(c, 'air', 60, 70, { color: C.text, size: 14, weight: 700, align: 'center' });
        for (const [val, name, col] of parts) {
          const w2 = val * sc; c.fillStyle = col; c.fillRect(x, 50, Math.max(0, w2 - 1), 34);
          if (w2 > 60) kit.label(c, name, x + w2 / 2, 72, { color: C.bg || '#000', size: 11, align: 'center', weight: 700 });
          x += w2;
        }
        kit.label(c, Ea.toFixed(1) + ' kW of electricity for each shaft kW', x0, 104, { color: C.text, size: 12, align: 'left' });
        kit.label(c, 'electric', 60, 160, { color: C.text, size: 14, weight: 700, align: 'center' });
        c.fillStyle = C.muted; c.fillRect(x0, 140, Math.max(0, (Ee - 1) * sc - 1), 34);
        c.fillStyle = C.ok; c.fillRect(x0 + (Ee - 1) * sc, 140, Math.max(0, sc - 1), 34);
        kit.label(c, Ee.toFixed(2) + ' kW for each shaft kW', x0, 194, { color: C.text, size: 12, align: 'left' });
        // legend
        const lg = [['hsl(28 85% 55%)', 'compressor heat'], [C.bad, 'leaks'], [C.muted, 'losses'], [C.ok, 'shaft']];
        lg.forEach((q, i) => { c.fillStyle = q[0]; c.fillRect(x0 + i * 140, 212, 12, 12); kit.label(c, q[1], x0 + 18 + i * 140, 222, { color: C.text, size: 11, align: 'left' }); });
        c.restore();
      }, box.stage);
      st.onResize && st.onResize(() => { dirty = true; });
      loop.start();
    }
  });

  /* ================================================================ as-family-compare */
  const CRIT = ['precision', 'speed range', 'torque per kg', 'efficiency', 'low price', 'low upkeep', 'hostile places', 'quiet', 'simple set-up'];
  // typical 1–5 ratings (5 best) for each criterion, in the order above — a teaching summary of the comparison table
  const FAM = [
    { name: 'Brushed PM DC', s: [2, 4, 3, 3, 5, 2, 1, 3, 5], dc: 1 },
    { name: 'Universal', s: [1, 3, 4, 2, 5, 1, 1, 1, 4] },
    { name: 'Brushless DC / PMSM', s: [3, 5, 5, 5, 2, 5, 2, 4, 3], dc: 1, pos: 1 },
    { name: 'Induction, on line', s: [1, 1, 2, 4, 5, 5, 4, 4, 5], ex: 1 },
    { name: 'Induction + VFD', s: [2, 4, 2, 4, 4, 4, 4, 3, 3], ex: 1, pos: 1 },
    { name: 'Single-phase induction', s: [1, 1, 1, 2, 5, 4, 3, 4, 5] },
    { name: 'Hybrid stepper', s: [4, 2, 3, 1, 4, 5, 2, 2, 4], dc: 1, pos: 1 },
    { name: 'AC servo', s: [5, 5, 4, 5, 2, 4, 2, 4, 2], dc: 1, pos: 1 },
    { name: 'Hydraulic motor', s: [3, 4, 5, 2, 2, 2, 5, 2, 2], ex: 1, pos: 1 },
    { name: 'Air motor', s: [1, 3, 4, 1, 4, 3, 5, 1, 4], ex: 1 }
  ];
  const USES = {
    custom: null,
    pump: { w: [0, 2, 1, 5, 4, 5, 2, 3, 4], ex: false, dc: false, pos: false },
    cnc: { w: [5, 4, 3, 3, 2, 3, 1, 2, 1], ex: false, dc: false, pos: true },
    printer: { w: [4, 0, 1, 0, 5, 3, 0, 1, 5], ex: false, dc: true, pos: true },
    mixer: { w: [0, 2, 2, 2, 3, 3, 5, 1, 4], ex: true, dc: false, pos: false },
    tool: { w: [0, 3, 5, 4, 3, 4, 1, 3, 3], ex: false, dc: true, pos: false },
    winch: { w: [0, 2, 4, 2, 3, 3, 5, 1, 3], ex: false, dc: false, pos: false }
  };

  Hyper.sim('as-family-compare', {
    title: 'A decision matrix for motor families',
    blurb: `Each row is a motor family, each column a quality, rated 1 to 5 from the comparison table (bigger dot, better). Set how much each quality matters to you — or pick an application — and the families are ranked by their weighted score. Hard requirements (an explosive atmosphere, a battery supply, positioning) strike out the families that cannot meet them.

**Try this**
- Pick *pump or fan*: the induction motor, on line or with a VFD, comes out on top — cheap, efficient, long-lived.
- Pick *CNC axis*: the servo leads, with the brushless motor close behind — a servo is a brushless motor with a position loop. Tick *battery only* and see who is left.
- Pick *paint mixer in a hazardous zone*: only the Ex-capable families remain. A certified induction motor leads on running cost; the air motor is close, and wins if the mixer stalls or needs simple variable speed.
- Pick *3-D printer axis*: cheap, simple positioning — the stepper's home ground.
- Raise *efficiency* to 5 and watch the air and hydraulic motors sink; raise *low price* and the universal and brushed motors climb.
- Remember what a score is: a way to shortlist, not a proof. Size the winner before you buy it.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      let V = null, dirty = true;
      const defs = [{ id: 'use', type: 'select', label: 'Application', options: [['Your own weights', 'custom'], ['Pump or fan', 'pump'], ['CNC machine axis', 'cnc'], ['3-D printer axis', 'printer'], ['Paint mixer in a hazardous zone', 'mixer'], ['Battery power tool', 'tool'], ['Deck winch at sea', 'winch']], value: 'custom' }];
      CRIT.forEach((cname, i) => defs.push({ id: 'w' + i, label: 'Weight: ' + cname, min: 0, max: 5, step: 1, value: [2, 3, 3, 3, 3, 3, 1, 2, 2][i] }));
      defs.push({ id: 'ex', type: 'check', label: 'Explosive atmosphere (Ex-capable only)', value: false });
      defs.push({ id: 'dc', type: 'check', label: 'Battery or DC supply only', value: false });
      defs.push({ id: 'pos', type: 'check', label: 'Must position (move to set points)', value: false });
      const ctl = kit.controls(box.side, defs, id => {
        if (id === 'use' && USES[V.use]) { const u = USES[V.use]; u.w.forEach((x, i) => ctl.set('w' + i, x)); ctl.set('ex', u.ex); ctl.set('dc', u.dc); ctl.set('pos', u.pos); }
        else if (id !== 'use') ctl.set('use', 'custom');
        dirty = true;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['r1', 'First'], ['r2', 'Second'], ['r3', 'Third'], ['out', 'Struck out']]);
      const loop = kit.loop(() => {
        if (!dirty) return;
        dirty = false;
        const w = CRIT.map((_, i) => V['w' + i]), sw = w.reduce((a, b) => a + b, 0) || 1;
        const rows = FAM.map(f => {
          let why = '';
          if (V.ex && !f.ex) why = 'not Ex-capable';
          else if (V.dc && !f.dc) why = 'needs mains, air or oil';
          else if (V.pos && !f.pos) why = 'cannot position';
          return { f, score: f.s.reduce((a, s, i) => a + s * w[i], 0) / (5 * sw), why };
        }).sort((a, b) => (a.why ? 1 : 0) - (b.why ? 1 : 0) || b.score - a.score);
        const ok = rows.filter(r => !r.why);
        ['r1', 'r2', 'r3'].forEach((k, i) => ro.set(k, ok[i] ? ok[i].f.name + ' — ' + (100 * ok[i].score).toFixed(0) + ' %' : '—'));
        ro.set('out', rows.filter(r => r.why).map(r => r.f.name).join(', ') || 'none');
        const c = design(st, 760, 430), C = kit.colors();
        const x0 = 190, cw = 44, y0 = 96, rh = 31;
        // column heads, slanted
        CRIT.forEach((cn, i) => {
          c.save(); c.translate(x0 + i * cw + cw / 2, y0 - 12); c.rotate(-0.7); c.fillStyle = w[i] ? C.text : C.faint || C.muted; c.font = '12px ' + font(); c.textAlign = 'left';
          c.fillText(cn + ' ×' + w[i], 0, 0); c.restore();
        });
        kit.label(c, 'weighted score', x0 + CRIT.length * cw + 90, y0 - 16, { color: C.text, size: 12, align: 'center' });
        rows.forEach((r, j) => {
          const y = y0 + j * rh + rh / 2, out = !!r.why;
          if (j % 2 === 0) { c.fillStyle = C.bg2; c.fillRect(8, y - rh / 2, 744, rh); }
          kit.label(c, (out ? '' : (j + 1) + '. ') + r.f.name, 14, y + 4, { color: out ? C.muted : C.text, size: 12, align: 'left', weight: j < 3 && !out ? 700 : 400 });
          r.f.s.forEach((s, i) => {
            const cx = x0 + i * cw + cw / 2;
            c.globalAlpha = out ? 0.2 : w[i] ? 0.9 : 0.25;
            kit.dot(c, cx, y, 2.5 + s * 2.2, s >= 4 ? C.ok : s <= 2 ? C.bad : C.warn);
          });
          c.globalAlpha = 1;
          const bx = x0 + CRIT.length * cw + 20, bw = 140;
          c.fillStyle = C.faint || C.grid; c.fillRect(bx, y - 7, bw, 14);
          c.fillStyle = out ? C.muted : j === 0 ? C.accent : C.series[2]; c.fillRect(bx, y - 7, bw * r.score, 14);
          kit.label(c, out ? r.why : (100 * r.score).toFixed(0) + ' %', bx + bw + 8, y + 4, { color: out ? C.muted : C.text, size: 11, align: 'left' });
          if (out) { c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(12, y); c.lineTo(bx + bw, y); c.stroke(); }
        });
        kit.label(c, 'dot size: rating 1–5 (green good, red poor); faded columns carry no weight', 14, y0 + rows.length * rh + 18, { color: C.muted, size: 11, align: 'left' });
        c.restore();
      }, box.stage);
      st.onResize && st.onResize(() => { dirty = true; });
      loop.start();
    }
  });

  /* ================================================================ as-move-check */
  Hyper.sim('as-move-check', {
    title: 'Sizing a ball-screw axis: stepper, servo or VFD?',
    blurb: `A carriage on a ball screw makes a point-to-point move — a third of the time accelerating, a third cruising, a third braking — then rests. The sim works out the motor speed, acceleration, reflected inertia and torque in each phase, and checks three candidates: a NEMA 23 stepper on a 48 V driver (used to 70 % of its pull-out curve), a 400 W AC servo, and a 0.37 kW induction motor on a VFD. The graph plots the move as a path on the chosen motor's torque–speed map: every point must stay under the peak line, and the RMS torque (the square) under the continuous line.

**Try this**
- With the 10 mm lead the move needs 2250 rpm: the stepper's torque has collapsed there. Change to a 20 mm lead: 1125 rpm, and the stepper fits.
- Shorten the move time: the acceleration torque grows with the square of the speed-up; watch the servo's peak line.
- Choose the VFD motor: its own rotor inertia (8 kg·cm²) takes most of the accelerating torque, and it cannot stop on a position without an encoder.
- Make the axis vertical: gravity adds a steady torque in every phase and while resting, so the RMS torque rises — and a brake becomes mandatory.
- Raise the mass to 50 kg on a 40 mm lead: the inertia ratio climbs past 10 and the stepper or an untuned servo will struggle.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.26, minH: 150 });
      const [g1, g2] = graphs(box.stage, 2);
      const STP = M.stepper({ steps: 200, I: 2.8, R: 0.9, L: 2.5e-3, Vs: 48, Th: 1.26 });
      const MOT = {
        step: { name: 'NEMA 23 stepper, 48 V', Jm: 0.3e-4, nmax: 1600, peak: n => 0.7 * STP.torque(n), cont: n => 0.7 * STP.torque(n), raw: n => STP.torque(n) },
        servo: { name: '400 W AC servo', Jm: 0.34e-4, nmax: 5000, peak: n => n <= 3000 ? 3.8 : Math.max(0, 3.8 - 2.3 * (n - 3000) / 2000), cont: n => n <= 3000 ? 1.27 : Math.max(0, 1.27 - 0.27 * (n - 3000) / 2000) },
        vfd: { name: '0.37 kW motor + VFD', Jm: 8e-4, nmax: 2800, peak: n => 1.5 * 2.58 * Math.min(1, 1370 / Math.max(n, 1)), cont: n => 2.58 * (n < 1370 ? Math.min(1, 0.6 + 0.8 * n / 1370) : 1370 / n) }
      };
      let V = null, res = null, tau = 0, play = true, lastPlot = -1, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mot', type: 'select', label: 'Show the map of', options: [['NEMA 23 stepper (48 V)', 'step'], ['400 W AC servo', 'servo'], ['0.37 kW induction motor + VFD', 'vfd']], value: 'step' },
        { id: 'orient', type: 'select', label: 'Axis', options: [['Horizontal', 'hor'], ['Vertical, moving up', 'vert']], value: 'hor' },
        { id: 'm', label: 'Moving mass', min: 1, max: 60, step: 1, value: 20, unit: 'kg' },
        { id: 'lead', type: 'select', label: 'Screw lead', options: [['5 mm', 5], ['10 mm', 10], ['20 mm', 20], ['40 mm', 40]], value: 10 },
        { id: 'dist', label: 'Move distance', min: 20, max: 800, step: 10, value: 200, unit: 'mm' },
        { id: 'time', label: 'Move time', min: 0.1, max: 3, step: 0.05, value: 0.8, unit: 's' },
        { id: 'dwell', label: 'Rest after the move', min: 0, max: 3, step: 0.1, value: 0.5, unit: 's' },
        { type: 'buttons', items: [{ id: 'play', label: 'Play / pause', primary: true }] }
      ], id => { if (id === 'play') play = !play; res = null; lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['mv', 'Carriage: top speed · acceleration'], ['ms', 'Motor: top speed · acceleration'], ['jl', 'Load inertia at the motor'], ['tl', 'Friction and gravity torque'], ['step', 'Stepper'], ['servo', 'Servo'], ['vfd', 'VFD motor']]);
      const pT = kit.plot(g1, { x: { label: 'motor speed (rpm)', min: 0 }, y: { label: 'torque (N·m)' }, legend: true }, 200);
      const pt = kit.plot(g2, { x: { label: 'time (s)', min: 0 }, y: { label: 'N·m  ·  1000 rpm' }, legend: true }, 200);
      function calc() {
        const p = V.lead / 1000, d = V.dist / 1000, T = V.time, eta = 0.9, m = V.m, g = 9.81, vert = V.orient === 'vert';
        const vmax = 1.5 * d / T, ta = T / 3, a = vmax / ta, n = vmax / p * 60, alpha = a / p * TAU;
        const JL = m * Math.pow(p / TAU, 2) + 0.4e-4;
        const F = 0.01 * m * g + 10 + (vert ? m * g : 0), TL = F * p / (TAU * eta), Thold = vert ? m * g * p / TAU * eta : 0;
        const out = { p, vmax, a, n, alpha, JL, TL, Thold, ta, T, per: {} };
        for (const k of Object.keys(MOT)) {
          const mo = MOT[k], Tacc = (mo.Jm + JL / eta) * alpha + TL, Tdec = TL - (mo.Jm + JL * eta) * alpha;
          const rms = Math.sqrt((Tacc * Tacc * ta + TL * TL * ta + Tdec * Tdec * ta + Thold * Thold * V.dwell) / (T + V.dwell));
          const peakNeed = Math.max(Math.abs(Tacc), Math.abs(Tdec)), ratio = JL / mo.Jm;
          const msgs = [];
          if (n > mo.nmax) msgs.push('too slow: needs ' + n.toFixed(0) + ' rpm, max ' + mo.nmax);
          else if (peakNeed > mo.peak(n)) msgs.push('peak ' + peakNeed.toFixed(2) + ' > ' + mo.peak(n).toFixed(2) + ' N·m at ' + n.toFixed(0) + ' rpm');
          if (k !== 'step' && rms > mo.cont(n / 2)) msgs.push('RMS ' + rms.toFixed(2) + ' > ' + mo.cont(n / 2).toFixed(2) + ' N·m continuous');
          if (k === 'step' && ratio > 10) msgs.push('inertia ratio ' + ratio.toFixed(0) + ':1 — resonance risk');
          if (k === 'servo' && ratio > 30) msgs.push('inertia ratio ' + ratio.toFixed(0) + ':1 — hard to tune');
          const fits = !msgs.length || (msgs.length === 1 && /ratio/.test(msgs[0]) && k === 'servo' && ratio <= 30);
          let txt = fits ? 'fits — peak ' + peakNeed.toFixed(2) + ' of ' + mo.peak(Math.min(n, mo.nmax)).toFixed(2) + ' N·m, ratio ' + ratio.toFixed(1) + ':1' : 'NO — ' + msgs.join('; ');
          if (k === 'vfd' && fits) txt += '; positions only with an encoder';
          if (vert && fits) txt += '; needs a holding brake';
          out.per[k] = { Tacc, Tdec, rms, ratio, txt };
        }
        return out;
      }
      const posAt = (r, u) => {                                // carriage position (m) at time u into the cycle
        const T = r.T, ta = r.ta, a = r.a, v = r.vmax;
        if (u <= 0) return 0;
        if (u < ta) return a * u * u / 2;
        if (u < 2 * ta) return a * ta * ta / 2 + v * (u - ta);
        if (u < T) { const s = u - 2 * ta; return a * ta * ta / 2 + v * ta + v * s - a * s * s / 2; }
        return V.dist / 1000;
      };
      const loop = kit.loop(dt => {
        t += dt;
        if (!res) res = calc();
        const cyc = V.time + V.dwell;
        if (play) tau = (tau + dt * 0.5) % (2 * cyc);             // out and back, at half speed
        ro.set('mv', res.vmax.toFixed(3) + ' m/s · ' + res.a.toFixed(2) + ' m/s²');
        ro.set('ms', res.n.toFixed(0) + ' rpm · ' + res.alpha.toFixed(0) + ' rad/s²');
        ro.set('jl', (res.JL * 1e4).toFixed(2) + ' kg·cm²');
        ro.set('tl', res.TL.toFixed(3) + ' N·m' + (res.Thold ? ' (holding ' + res.Thold.toFixed(2) + ' N·m at rest)' : ''));
        for (const k of Object.keys(MOT)) ro.set(k, res.per[k].txt);
        if (t - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = t;
          const mo = MOT[V.mot], pr = res.per[V.mot], C = kit.colors(), nTop = Math.max(res.n * 1.2, mo.nmax * 1.05), xs = [];
          for (let i = 0; i <= 80; i++) xs.push(nTop * i / 80);
          const env = n => n <= mo.nmax ? mo.peak(n) : 0, cont = n => n <= mo.nmax ? mo.cont(n) : 0;
          const ser = [{ pts: xs.map(x => [x, env(x)]), label: V.mot === 'step' ? '70 % of pull-out (usable)' : 'peak torque' },
            { pts: xs.map(x => [x, cont(x)]), label: 'continuous', dash: [5, 4], color: C.muted }];
          if (mo.raw) ser.push({ pts: xs.map(x => [x, x <= mo.nmax ? mo.raw(x) : 0]), label: 'pull-out (model)', dash: [2, 3], color: C.faint || C.muted });
          ser.push({ pts: [[0, pr.Tacc], [res.n, pr.Tacc], [res.n, res.TL], [res.n, pr.Tdec], [0, pr.Tdec]], label: 'the move', color: C.series[1], dots: true });
          pT.set({ x: { label: 'motor speed (rpm)', min: 0, max: nTop }, y: { label: 'torque (N·m)', min: Math.min(0, pr.Tdec * 1.2), max: Math.max(env(0), pr.Tacc) * 1.15 },
            series: ser, marks: [{ x: res.n / 2, y: pr.rms, label: 'RMS' }], hlines: [{ y: 0 }] });
          const tp = [], sp = [], cycT = V.time + V.dwell;
          for (let i = 0; i <= 120; i++) {
            const u = cycT * i / 120, ph = u < res.ta ? 0 : u < 2 * res.ta ? 1 : u < res.T ? 2 : 3;
            tp.push([u, ph === 0 ? pr.Tacc : ph === 1 ? res.TL : ph === 2 ? pr.Tdec : res.Thold]);
            const nn = ph === 0 ? res.n * u / res.ta : ph === 1 ? res.n : ph === 2 ? res.n * (1 - (u - 2 * res.ta) / res.ta) : 0;
            sp.push([u, nn / 1000]);
          }
          pt.set({ x: { label: 'time (s)', min: 0, max: cycT }, series: [{ pts: tp, label: 'motor torque (N·m)' }, { pts: sp, label: 'speed (1000 rpm)', color: C.series[2] }], hlines: [{ y: 0 }] });
        }
        // drawing: motor, coupling, screw and the moving carriage
        const c = design(st, 760, 150), C = kit.colors();
        const cyc2 = V.time + V.dwell, u = tau % cyc2, back = tau >= cyc2, x = posAt(res, u) / (V.dist / 1000), frac = back ? 1 - x : x;
        const sx0 = 150, sx1 = 700, cx = sx0 + 40 + frac * (sx1 - sx0 - 120);
        c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(30, 45, 90, 60); c.strokeRect(30, 45, 90, 60);
        kit.label(c, V.mot === 'step' ? 'stepper' : V.mot === 'servo' ? 'servo' : 'VFD motor', 75, 80, { color: C.text, size: 12, align: 'center', weight: 700 });
        c.fillStyle = C.muted; c.fillRect(120, 68, 30, 14);
        c.strokeStyle = C.muted; c.lineWidth = 8; c.beginPath(); c.moveTo(sx0, 75); c.lineTo(sx1, 75); c.stroke();
        c.strokeStyle = C.text; c.lineWidth = 1;
        const turns = (sx1 - sx0) / 10, off = (frac * V.dist / V.lead) % 1;
        for (let i = 0; i < turns; i++) { const xx = sx0 + (i + off) * 10; if (xx < sx1) { c.beginPath(); c.moveTo(xx, 70); c.lineTo(xx + 5, 80); c.stroke(); } }
        c.fillStyle = C.accent; c.globalAlpha = 0.85; c.fillRect(cx - 40, 48, 80, 54); c.globalAlpha = 1;
        kit.label(c, V.m + ' kg', cx, 80, { color: C.bg || '#fff', size: 12, weight: 700, align: 'center' });
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(sx0, 112); c.lineTo(sx1, 112); c.stroke();
        kit.label(c, V.dist + ' mm in ' + V.time.toFixed(2) + ' s, lead ' + V.lead + ' mm' + (V.orient === 'vert' ? ' — vertical axis (drawn flat)' : ''), 400, 135, { color: C.muted, size: 12, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ as-pump-vfd */
  // a centrifugal pump at 2900 rpm: shut-off head 40 m, 28 m at 60 m³/h; best efficiency 75 % at 55 m³/h (scaled with speed)
  const PH0 = 40, PKP = 12 / 3600, PQB = 55, PEMAX = 0.75, PN1 = 2900;
  const pumpH = (Q, r) => PH0 * r * r - PKP * Q * Q;
  const pumpEta = (Q, r) => Math.max(0.05, PEMAX * (1 - Math.pow(Q / (PQB * Math.max(r, 0.05)) - 1, 2)));

  Hyper.sim('as-pump-vfd', {
    title: 'A pump: throttle valve or VFD?',
    blurb: `A centrifugal pump lifts water from a lower tank to an upper one through a pipe. The first graph shows head against flow: the pump's curve at full speed, its curve at the speed the VFD chooses, and the system's curve (static head plus friction). Where a pump curve crosses the system curve, the pump runs. Throttling adds a valve loss, so the pump stays on its full-speed curve at a higher head; the VFD lowers the curve instead. The second graph is the electrical power for each method across the whole flow range.

**Try this**
- Set 40 m³/h and switch between *throttle* and *VFD*: the same flow for about half the electricity.
- Move the demand from 60 down to 20 m³/h and watch the two power lines part: the saving grows as the flow falls.
- Raise the static head to 25 m: the VFD saves much less, and the minimum speed rises — below it the pump delivers nothing.
- Read the pump efficiency: throttled, the pump is pushed away from its best point; with the VFD it slides along with it.
- Change the hours or the price and read the yearly saving.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 180 });
      const [g1, g2] = graphs(box.stage, 2);
      let V = null, dirty = true, ph = 0;
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Flow wanted', min: 5, max: 60, step: 1, value: 40, unit: 'm³/h' },
        { id: 'how', type: 'select', label: 'Flow control', options: [['Throttle valve, pump at full speed', 'thr'], ['VFD, valve fully open', 'vfd']], value: 'thr' },
        { id: 'Hs', label: 'Static head (height lifted)', min: 0, max: 25, step: 1, value: 10, unit: 'm' },
        { id: 'h', label: 'Running hours per year', min: 500, max: 8760, step: 10, value: 6000, unit: 'h' },
        { id: 'c', label: 'Electricity price, ¤ per kWh', min: 0.05, max: 0.4, step: 0.01, value: 0.15 }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Pump speed'], ['H', 'Pump head (lost in the valve)'], ['eta', 'Pump efficiency'], ['P', 'Shaft power'], ['el', 'Electrical power: throttle · VFD'], ['yr', 'Cost per year: throttle · VFD'], ['min', 'Minimum useful speed']]);
      const pH = kit.plot(g1, { x: { label: 'flow (m³/h)', min: 0, max: 75 }, y: { label: 'head (m)', min: 0, max: 45 }, legend: true }, 190);
      const pP = kit.plot(g2, { x: { label: 'flow (m³/h)', min: 0, max: 60 }, y: { label: 'electrical power (kW)', min: 0 }, legend: true }, 190);
      const ETAM = 0.9, ETAV = 0.97;
      // both ways of delivering a flow Q through a system with static head Hs
      function point(Q, Hs, how) {
        const ks = (28 - Hs) / 3600, Hsys = Hs + ks * Q * Q;
        if (how === 'thr') {
          const H = pumpH(Q, 1), eta = pumpEta(Q, 1), P = 9810 * Q / 3600 * H / eta;
          return { r: 1, H, drop: Math.max(0, H - Hsys), eta, P, Pel: P / ETAM, ok: H >= Hsys - 1e-9 };
        }
        const r = Math.sqrt((Hsys + PKP * Q * Q) / PH0), eta = pumpEta(Q, r), P = 9810 * Q / 3600 * Hsys / eta;
        return { r, H: Hsys, drop: 0, eta, P, Pel: P / (ETAM * ETAV), ok: r <= 1 + 1e-9 };
      }
      const loop = kit.loop(dt => {
        ph += dt * V.Q * 1.2;
        if (dirty) {
          dirty = false;
          const a = point(V.Q, V.Hs, V.how), th = point(V.Q, V.Hs, 'thr'), vf = point(V.Q, V.Hs, 'vfd'), C = kit.colors();
          ro.set('n', (a.r * PN1).toFixed(0) + ' rpm (' + (50 * a.r).toFixed(1) + ' Hz)' + (a.ok ? '' : ' — beyond the pump'));
          ro.set('H', a.H.toFixed(1) + ' m (' + a.drop.toFixed(1) + ' m)');
          ro.set('eta', (100 * a.eta).toFixed(0) + ' %');
          ro.set('P', (a.P / 1000).toFixed(2) + ' kW');
          ro.set('el', (th.Pel / 1000).toFixed(2) + ' · ' + (vf.Pel / 1000).toFixed(2) + ' kW');
          ro.set('yr', kit.money(th.Pel / 1000 * V.h * V.c, 0) + ' · ' + kit.money(vf.Pel / 1000 * V.h * V.c, 0) + ' (saves ' + kit.money((th.Pel - vf.Pel) / 1000 * V.h * V.c, 0) + ')');
          ro.set('min', (PN1 * Math.sqrt(V.Hs / PH0)).toFixed(0) + ' rpm (' + (50 * Math.sqrt(V.Hs / PH0)).toFixed(1) + ' Hz)');
          const qs = []; for (let i = 0; i <= 60; i++) qs.push(75 * i / 60);
          const ks = (28 - V.Hs) / 3600, series = [{ pts: qs.map(q => [q, pumpH(q, 1)]).filter(p => p[1] >= 0), label: 'pump, 2900 rpm' },
            { pts: qs.map(q => [q, V.Hs + ks * q * q]).filter(p => p[1] <= 45), label: 'system', color: C.series[2] }];
          if (V.how === 'vfd') series.push({ pts: qs.map(q => [q, pumpH(q, vf.r)]).filter(p => p[1] >= 0), label: 'pump at ' + (vf.r * PN1).toFixed(0) + ' rpm', dash: [5, 4] });
          else { const kv = th.drop / Math.max(1, V.Q * V.Q); series.push({ pts: qs.map(q => [q, V.Hs + (ks + kv) * q * q]).filter(p => p[1] <= 45), label: 'system + valve', dash: [5, 4], color: C.series[1] }); }
          pH.set({ series, marks: [{ x: V.Q, y: a.H, label: V.how === 'vfd' ? 'VFD' : 'throttled' }] });
          const fl = []; for (let q = 5; q <= 60; q += 1) fl.push(q);
          pP.set({ series: [{ pts: fl.map(q => [q, point(q, V.Hs, 'thr').Pel / 1000]), label: 'throttle' }, { pts: fl.map(q => [q, point(q, V.Hs, 'vfd').Pel / 1000]), label: 'VFD', color: C.series[2] }],
            marks: [{ x: V.Q, y: th.Pel / 1000 }, { x: V.Q, y: vf.Pel / 1000 }] });
        }
        // drawing: tanks, pump and motor, valve or VFD, pipe
        const c = design(st, 760, 200), C = kit.colors(), S = kit.fsym, a = point(V.Q, V.Hs, V.how);
        const topY = 150 - V.Hs * 4.4;
        c.fillStyle = 'hsl(205 70% 50% / .35)'; c.fillRect(30, 140, 110, 45); c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(30, 120, 110, 65);
        c.fillStyle = 'hsl(205 70% 50% / .35)'; c.fillRect(620, topY - 20, 110, 30); c.strokeRect(620, topY - 40, 110, 50);
        kit.label(c, 'lift ' + V.Hs + ' m', 675, topY + 26, { color: C.muted, size: 11, align: 'center' });
        const pipe = [[140, 170], [230, 170], [230, 110], [420, 110], [520, 110], [560, 110], [560, topY - 10], [620, topY - 10]];
        c.strokeStyle = 'hsl(205 70% 50%)'; c.lineWidth = 6; c.beginPath(); pipe.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
        S.flow(c, pipe, ph * 3, { color: C.bg2 });
        // pump and motor
        c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(230, 150, 20, 0, TAU); c.fill(); c.stroke();
        c.save(); c.translate(230, 150); c.rotate(ph * a.r * 0.5); for (let k = 0; k < 5; k++) { c.rotate(TAU / 5); c.beginPath(); c.moveTo(0, 0); c.lineTo(15, 5); c.stroke(); } c.restore();
        c.fillRect(250, 140, 20, 20); c.fillStyle = C.surface2 || C.bg2; c.fillRect(270, 132, 70, 36); c.strokeRect(270, 132, 70, 36);
        kit.label(c, 'motor', 305, 154, { color: C.text, size: 11, align: 'center' });
        kit.label(c, (a.r * PN1).toFixed(0) + ' rpm', 305, 186, { color: C.text, size: 12, weight: 700, align: 'center' });
        if (V.how === 'vfd') { c.fillStyle = C.accent; c.fillRect(360, 136, 46, 30); kit.label(c, 'VFD', 383, 155, { color: C.bg || '#fff', size: 11, weight: 700, align: 'center' }); kit.label(c, (50 * a.r).toFixed(1) + ' Hz', 383, 182, { color: C.text, size: 11, align: 'center' }); }
        // the valve (a bow tie), closed in proportion to the head it burns
        const open = V.how === 'vfd' ? 1 : clamp(1 - a.drop / 30, 0.1, 1);
        c.fillStyle = V.how === 'vfd' ? C.muted : C.warn; c.beginPath(); c.moveTo(455, 96); c.lineTo(485, 124); c.lineTo(485, 96); c.lineTo(455, 124); c.closePath(); c.fill();
        kit.label(c, V.how === 'vfd' ? 'valve open' : 'valve ' + (100 * open).toFixed(0) + ' % — burns ' + a.drop.toFixed(1) + ' m', 470, 86, { color: C.text, size: 11, align: 'center' });
        kit.label(c, V.Q + ' m³/h · ' + (a.Pel / 1000).toFixed(2) + ' kW from the mains', 420, 20, { color: C.text, size: 13, weight: 700, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ as-hoist */
  Hyper.sim('as-hoist', {
    title: 'A VFD hoist and its brake sequence',
    blurb: `A 4 kW brake motor on a closed-loop VFD lifts and lowers a load through a gearbox and rope drum (8 m/min at 1450 rpm). The drive's speed controller holds the speed; the spring-applied brake holds the load at rest. The graphs record the last few seconds: hook speed and height, and the motor and brake torques as a share of the motor's rated torque. Upper and lower limit switches stop the hook at the ends of the lift.

**Try this**
- *Lift*, *Stop*, *Lower* with the correct sequence: the drive magnetises and takes the load's torque before the brake opens, and holds zero speed until the brake has set. No drop.
- Choose *brake released before the drive is ready* and lift: the load drops for a moment before the motor catches it — read the rollback.
- Choose *drive switched off before the brake has set* and stop: the drop happens at the end instead.
- Lower a heavy load and watch the motor torque: the load drives the motor, which generates; the braking resistor takes the power. Untick the resistor: the DC bus climbs, the drive trips on overvoltage, the brake slams in.
- Put 2500 kg on: the motor needs more than its rated torque — fine for the drive's 150 % for a short lift, but it heats (the hoist would be rated for intermittent duty).`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const [g1, g2] = graphs(box.stage, 2);
      const TN = 4000 / (1450 * TAU / 60), WN = 1450 * TAU / 60, KH = (8 / 60) / WN, ETA = 0.85, JM = 0.015, TB = 2 * TN;
      let V = null, w = 0, h = 1.5, drive = false, tEn = 0, brake = 'set', tBr = -10, ref = 0, target = 0, phase = 'idle', t = 0, integ = 0;
      let Tm = 0, Tbrk = 0, vdc = 560, Ebr = 0, trip = '', hStart = 1.5, roll = 0, lastRec = 0, pendingEnable = -1;
      const hist = [];
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Load on the hook', min: 0, max: 2500, step: 50, value: 1500, unit: 'kg' },
        { id: 'spd', label: 'Speed', min: 10, max: 100, step: 5, value: 100, unit: '%' },
        { id: 'logic', type: 'select', label: 'Brake logic', options: [['Correct: prove torque, hold until the brake sets', 'ok'], ['Brake released before the drive is ready', 'early'], ['Drive switched off before the brake has set', 'late']], value: 'ok' },
        { id: 'res', type: 'check', label: 'Braking resistor fitted', value: true },
        { type: 'buttons', items: [{ id: 'up', label: 'Lift', primary: true }, { id: 'stop', label: 'Stop' }, { id: 'down', label: 'Lower', primary: true }] }
      ], id => {
        if (id === 'up' || id === 'down') start(id === 'up' ? 1 : -1);
        if (id === 'stop') stopCmd();
      });
      V = ctl.values;
      function start(dir) {
        if (phase !== 'idle' && phase !== 'run') return;
        if (phase === 'run') { target = dir; return; }
        target = dir; trip = ''; hStart = h; roll = 0; integ = 0; vdc = 560;
        if (V.logic === 'early') { brake = 'releasing'; tBr = t; pendingEnable = t + 0.3; phase = 'start'; }
        else { drive = true; tEn = t; phase = 'proving'; }
      }
      function stopCmd() { if (phase === 'run' || phase === 'start' || phase === 'proving' || phase === 'opening') { target = 0; phase = 'stopping'; } }
      function tripNow(why) { trip = why; drive = false; if (brake !== 'set') { brake = 'setting'; tBr = t; } phase = 'closing'; target = 0; ref = 0; }
      const ro = kit.readout(box.side, [['ph', 'State'], ['v', 'Hook speed · height'], ['T', 'Motor torque · load torque'], ['b', 'Brake'], ['p', 'Power to the braking resistor · DC bus'], ['roll', 'Drop at the last start or stop']]);
      const p1 = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'm/min  ·  cm' }, legend: true }, 170);
      const p2 = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: '% of rated torque', min: -220, max: 220 }, legend: true }, 170);
      const loop = kit.loop(dt => {
        const m = V.m, g = 9.81, Tg = m * g * KH, Tf = Tg * (1 / ETA - 1), J = JM + m * KH * KH;
        const sub = 40, hh = dt / sub;
        for (let k = 0; k < sub; k++) {
          t += hh;
          if (pendingEnable > 0 && t >= pendingEnable) { drive = true; tEn = t; pendingEnable = -1; }
          // sequencing
          const cap = drive ? 1.5 * TN * clamp((t - tEn) / 0.3, 0, 1) : 0;
          if (phase === 'proving' && t - tEn > 0.35) { brake = 'releasing'; tBr = t; phase = 'opening'; }
          if ((phase === 'opening' || phase === 'start') && brake === 'releasing' && t - tBr > 0.2) { brake = 'open'; }
          if ((phase === 'opening' || phase === 'start') && brake === 'open' && drive && t - tEn > 0.3) phase = target ? 'run' : 'stopping';
          if (phase === 'stopping' && Math.abs(ref) < 1e-6 && Math.abs(w) < 0.5) {
            if (brake !== 'set') { brake = 'setting'; tBr = t; } else tBr = t - 0.17;
            phase = 'closing'; hStart = h; roll = 0;
            if (V.logic === 'late') drive = false;
          }
          if (phase === 'closing' && brake === 'setting' && t - tBr > 0.17) brake = 'set';
          if (phase === 'closing' && brake === 'set' && t - tBr > 0.35) { drive = false; phase = 'idle'; }
          // limits
          if (h >= 3 && w > 0 && phase === 'run') { target = 0; phase = 'stopping'; }
          if (h <= 0.1 && w < 0 && phase === 'run') { target = 0; phase = 'stopping'; }
          // speed reference ramps (1 s from 0 to full speed)
          const want = phase === 'run' ? target * V.spd / 100 * WN : 0;
          const rr = WN / 1.0 * hh; ref = ref < want ? Math.min(want, ref + rr) : Math.max(want, ref - rr);
          // speed controller (PI), limited by the drive's torque capability
          if (drive) {
            const Kp = J * 60, Ki = Kp * 12, e = ref - w;
            integ = clamp(integ + e * hh, -cap / Ki, cap / Ki);
            Tm = clamp(Kp * e + Ki * integ, -cap, cap);
          } else { Tm = 0; integ = 0; }
          // brake torque: full when set, ramping while it opens or closes
          const bt = brake === 'set' ? TB : brake === 'open' ? 0 : brake === 'releasing' ? TB * clamp(1 - (t - tBr - 0.05) / 0.15, 0, 1) : TB * clamp((t - tBr - 0.12) / 0.05, 0, 1);   // a coil's dead time, then the springs act
          const other = Tm - Tg - (Math.abs(w) > 1e-3 ? Math.sign(w) * Tf : 0);
          if (bt > 0 && Math.abs(w) < 0.05 && Math.abs(Tm - Tg) <= bt + Tf) { w = 0; Tbrk = -(Tm - Tg); }
          else { Tbrk = bt > 0 ? -Math.sign(w || other) * bt : 0; w += hh * (other + Tbrk) / J; }
          h += w * KH * hh;
          // regeneration and the DC bus
          const Pg = Math.max(0, -Tm * w) * 0.9;
          if (V.res) { vdc = 560 + Math.min(140, Pg / 30); Ebr += Pg * hh; }
          else { vdc = Math.max(560, vdc + hh * (Pg / (0.002 * vdc) - (vdc - 560) * 2)); if (vdc > 800 && drive) tripNow('overvoltage trip: no braking resistor'); }
          if (phase !== 'run' && phase !== 'idle') roll = Math.max(roll, (hStart - h) * 1000);
        }
        if (phase === 'run') hStart = h;
        if (t - lastRec > 0.04) {
          lastRec = t;
          hist.push([t, w * KH * 60, (h - 1.5) * 100, 100 * Tm / TN, 100 * Tbrk / TN, 100 * Tg / TN]);
          while (hist.length && hist[0][0] < t - 8) hist.shift();
          const C = kit.colors();
          p1.set({ x: { label: 'time (s)', min: t - 8, max: t }, series: [{ pts: hist.map(r => [r[0], r[1]]), label: 'hook speed (m/min)' }, { pts: hist.map(r => [r[0], r[2]]), label: 'height change (cm)', color: C.series[2] }] });
          p2.set({ x: { label: 'time (s)', min: t - 8, max: t }, series: [{ pts: hist.map(r => [r[0], r[3]]), label: 'motor' }, { pts: hist.map(r => [r[0], r[4]]), label: 'brake', color: C.bad }, { pts: hist.map(r => [r[0], r[5]]), label: 'load (gravity)', dash: [4, 4], color: C.muted }] });
        }
        const Pg = Math.max(0, -Tm * w) * 0.9;
        ro.set('ph', trip ? trip : { idle: 'at rest: brake set, drive off', proving: 'drive magnetising and proving torque', opening: 'brake opening, motor holding', start: 'brake opening — drive not ready!', run: target > 0 ? 'lifting' : target < 0 ? 'lowering' : 'running', stopping: 'decelerating to zero speed', closing: 'brake setting' + (drive ? ', motor holding' : ', motor OFF') }[phase] || phase);
        ro.set('v', (w * KH * 60).toFixed(2) + ' m/min · ' + h.toFixed(2) + ' m' + (h >= 2.99 ? ' (upper limit)' : h <= 0.11 ? ' (lower limit)' : ''));
        ro.set('T', (100 * Tm / TN).toFixed(0) + ' % · ' + (100 * Tg / TN).toFixed(0) + ' % of rated (' + TN.toFixed(1) + ' N·m)');
        ro.set('b', brake === 'set' ? 'set' : brake === 'open' ? 'released' : brake);
        ro.set('p', (Pg / 1000).toFixed(2) + ' kW (' + (Ebr / 1000).toFixed(1) + ' kJ so far) · ' + vdc.toFixed(0) + ' V');
        ro.set('roll', roll.toFixed(0) + ' mm');
        // drawing: drum, motor, brake, VFD, rope, hook and load
        const c = design(st, 700, 290), C = kit.colors();
        const dx = 230, dy = 50, yLoad = 250 - (h / 3) * 170;
        c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.text; c.lineWidth = 2;
        c.fillRect(dx - 60, dy - 24, 120, 48); c.strokeRect(dx - 60, dy - 24, 120, 48);
        c.strokeStyle = C.muted; for (let i = 0; i < 12; i++) { c.beginPath(); c.moveTo(dx - 60 + i * 10 + ((h * 40) % 10), dy - 24); c.lineTo(dx - 60 + i * 10 + ((h * 40) % 10), dy + 24); c.stroke(); }
        kit.label(c, 'drum', dx, dy - 30, { color: C.muted, size: 11, align: 'center' });
        c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.text; c.fillRect(dx + 70, dy - 20, 70, 40); c.strokeRect(dx + 70, dy - 20, 70, 40);
        kit.label(c, 'gearbox', dx + 105, dy + 4, { color: C.text, size: 11, align: 'center' });
        c.fillRect(dx + 150, dy - 22, 90, 44); c.strokeRect(dx + 150, dy - 22, 90, 44); kit.label(c, 'motor 4 kW', dx + 195, dy + 4, { color: C.text, size: 11, align: 'center' });
        c.fillStyle = brake === 'set' ? C.bad : brake === 'open' ? C.ok : C.warn; c.fillRect(dx + 244, dy - 22, 22, 44);
        kit.label(c, 'brake ' + (brake === 'set' ? 'SET' : brake === 'open' ? 'open' : brake), dx + 255, dy + 38, { color: C.text, size: 11, align: 'center' });
        // VFD and braking resistor
        c.fillStyle = drive ? C.accent : C.muted; c.fillRect(560, 30, 70, 50); kit.label(c, drive ? 'VFD on' : 'VFD off', 595, 60, { color: C.bg || '#fff', size: 12, weight: 700, align: 'center' });
        const hot = V.res ? clamp(Pg / 3000, 0, 1) : 0;
        c.fillStyle = V.res ? 'hsl(10 90% ' + (30 + 30 * hot).toFixed(0) + '% / ' + (0.3 + 0.7 * hot).toFixed(2) + ')' : C.faint || C.bg2; c.fillRect(560, 96, 70, 16);
        kit.label(c, V.res ? 'braking resistor' : 'no resistor', 595, 128, { color: C.muted, size: 11, align: 'center' });
        c.fillStyle = C.faint || C.grid; c.fillRect(648, 30, 12, 90); c.fillStyle = vdc > 760 ? C.bad : C.series[2]; const fr = clamp((vdc - 500) / 320, 0, 1); c.fillRect(648, 120 - 90 * fr, 12, 90 * fr);
        kit.label(c, 'DC bus ' + vdc.toFixed(0) + ' V', 654, 140, { color: C.text, size: 10, align: 'center' });
        // rope, limits, hook, load
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(dx - 20, dy + 24); c.lineTo(dx - 20, yLoad - 12); c.moveTo(dx + 20, dy + 24); c.lineTo(dx + 20, yLoad - 12); c.stroke();
        c.strokeStyle = C.warn; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(dx - 90, 250 - 170); c.lineTo(dx + 90, 250 - 170); c.moveTo(dx - 90, 250 - 0.1 / 3 * 170); c.lineTo(dx + 90, 250 - 0.1 / 3 * 170); c.stroke(); c.setLineDash([]);
        kit.label(c, 'upper limit', dx - 130, 250 - 166, { color: C.warn, size: 10, align: 'center' });
        kit.label(c, 'lower limit', dx - 130, 250 - 2, { color: C.warn, size: 10, align: 'center' });
        const bw = 30 + Math.sqrt(Math.max(m, 1)) * 1.2;
        c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.text; c.fillRect(dx - 24, yLoad - 14, 48, 10); c.strokeRect(dx - 24, yLoad - 14, 48, 10);
        if (m > 0) { c.fillStyle = C.muted; c.fillRect(dx - bw / 2, yLoad, bw, 26); kit.label(c, m + ' kg', dx, yLoad + 18, { color: C.bg || '#fff', size: 11, weight: 700, align: 'center' }); }
        if (roll > 2) kit.label(c, 'dropped ' + roll.toFixed(0) + ' mm', dx + 150, 200, { color: C.bad, size: 14, weight: 700, align: 'center' });
        if (trip) kit.label(c, trip, dx + 150, 230, { color: C.bad, size: 12, weight: 700, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ as-spindle */
  const SPN = {
    belt: { name: 'Machining centre, belt-driven', P1: 11, P6: 15, nb: 1500, nmax: 10000, nmin: 20, ct: false },
    built: { name: 'Motorised spindle', P1: 15, P6: 20, nb: 3000, nmax: 18000, nmin: 100, ct: false },
    router: { name: 'Router spindle, 2.2 kW at 24 000 rpm', P1: 2.2, P6: 2.2, nb: 24000, nmax: 24000, nmin: 6000, ct: true }
  };
  // specific cutting energy (W·s/mm³) and a typical carbide cutting speed (m/min) — rounded, teaching values
  const MAT = { al: ['Aluminium alloy', 0.8, 400], ci: ['Cast iron', 2.0, 150], st: ['Carbon steel', 3.0, 200], ss: ['Stainless steel', 3.5, 150], ti: ['Titanium alloy', 3.5, 60] };

  Hyper.sim('as-spindle', {
    title: 'A cut on the spindle\'s curves',
    blurb: `A milling cutter of four teeth takes a cut; the sim works out the spindle speed from the cutting speed, the metal removed per minute, the power from the material's specific cutting energy, and the torque — and puts the point on the spindle's power and torque curves (S1 continuous, S6 periodic). Belt-driven and motorised spindles give constant torque up to their base speed and constant power above; a router spindle gives constant torque all the way, so its power grows with speed.

**Try this**
- On the machining centre, face-mill steel with an 80 mm cutter: the point sits in the constant-torque region, using a fraction of the spindle.
- Switch to the router spindle with the same cut: far below its minimum speed and with only a fraction of a kilowatt available.
- Put a 10 mm cutter in aluminium on the router spindle: now it runs near 24 000 rpm, where it has its full power.
- Raise the feed until the point crosses the S1 line: the cut would overheat the motor if held — S6 allows it for a part of each cycle.
- Try titanium: a slow cutting speed, high specific energy — torque, not power, is the limit.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190 });
      const [g1, g2] = graphs(box.stage, 2);
      let V = null, dirty = true, ang = 0, feedX = 0;
      const ctl = kit.controls(box.side, [
        { id: 'sp', type: 'select', label: 'Spindle', options: Object.entries(SPN).map(([k, s]) => [s.name, k]), value: 'belt' },
        { id: 'mat', type: 'select', label: 'Material', options: Object.entries(MAT).map(([k, m]) => [m[0], k]), value: 'st' },
        { id: 'D', label: 'Cutter diameter', min: 3, max: 125, value: 80, unit: 'mm', log: true, sig: 2 },
        { id: 'vc', label: 'Cutting speed', min: 20, max: 1200, step: 5, value: 200, unit: 'm/min' },
        { id: 'ap', label: 'Depth of cut', min: 0.1, max: 10, step: 0.1, value: 2, unit: 'mm' },
        { id: 'ae', label: 'Width of cut, % of the cutter', min: 5, max: 100, step: 1, value: 75, unit: '%' },
        { id: 'vf', label: 'Feed rate', min: 20, max: 8000, value: 400, unit: 'mm/min', log: true, sig: 2 }
      ], id => { if (id === 'mat') ctl.set('vc', MAT[V.mat][2]); dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Spindle speed'], ['fz', 'Feed per tooth (4 teeth)'], ['Q', 'Metal removed'], ['P', 'Power at the cutter · from the motor'], ['T', 'Torque at the spindle'], ['av', 'Available at this speed (S1 · S6)'], ['st', 'Verdict']]);
      const pP = kit.plot(g1, { x: { label: 'spindle speed (rpm)', min: 0 }, y: { label: 'power (kW)', min: 0 }, legend: true }, 180);
      const pT = kit.plot(g2, { x: { label: 'spindle speed (rpm)', min: 0 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 180);
      const avail = (s, n, P) => n < s.nmin || n > s.nmax ? 0 : s.ct ? P * n / s.nmax : P * Math.min(1, n / s.nb);
      let res = null;
      const loop = kit.loop(dt => {
        const s = SPN[V.sp];
        if (dirty || !res) {
          dirty = false;
          const nWant = 1000 * V.vc / (Math.PI * V.D), n = clamp(nWant, s.nmin, s.nmax), ae = V.ae / 100 * V.D;
          const Q = V.ap * ae * V.vf / 1000, u = MAT[V.mat][1], P = u * Q / 60, Pm = P / 0.9, T = n > 0 ? 9550 * P / n : 0;
          const a1 = avail(s, n, s.P1), a6 = avail(s, n, s.P6);
          res = { nWant, n, Q, P, Pm, T, a1, a6 };
          ro.set('n', n.toFixed(0) + ' rpm' + (nWant > s.nmax ? ' (the cut wants ' + nWant.toFixed(0) + ': spindle at its top speed)' : nWant < s.nmin ? ' (the cut wants ' + nWant.toFixed(0) + ': below the spindle\'s minimum)' : ''));
          ro.set('fz', (V.vf / (n * 4)).toFixed(3) + ' mm');
          ro.set('Q', Q.toFixed(1) + ' cm³/min');
          ro.set('P', P.toFixed(2) + ' kW · ' + Pm.toFixed(2) + ' kW');
          ro.set('T', T.toFixed(1) + ' N·m');
          ro.set('av', a1.toFixed(1) + ' · ' + a6.toFixed(1) + ' kW');
          ro.set('st', Pm <= a1 ? 'within S1: ' + (100 * Pm / Math.max(a1, 1e-9)).toFixed(0) + ' % of the continuous rating' : Pm <= a6 ? 'above S1, within S6: only for part of each cycle' : 'beyond the spindle: it would stall or trip');
          const xs = [], nTop = s.nmax * 1.05; for (let i = 0; i <= 120; i++) xs.push(nTop * i / 120);
          const C = kit.colors();
          pP.set({ x: { label: 'spindle speed (rpm)', min: 0, max: nTop }, series: [{ pts: xs.map(x => [x, avail(s, x, s.P1)]), label: 'S1' }, { pts: xs.map(x => [x, avail(s, x, s.P6)]), label: 'S6', dash: [5, 4], color: C.series[1] }],
            marks: [{ x: n, y: Pm, label: 'your cut' }] });
          pT.set({ x: { label: 'spindle speed (rpm)', min: 0, max: nTop }, y: { label: 'torque (N·m)', min: 0, max: Math.max(9550 * s.P6 / Math.max(s.nb, 1) * 1.15, T * 1.2) },
            series: [{ pts: xs.filter(x => x >= s.nmin).map(x => [x, 9550 * avail(s, x, s.P1) / Math.max(x, 1)]), label: 'S1' }, { pts: xs.filter(x => x >= s.nmin).map(x => [x, 9550 * avail(s, x, s.P6) / Math.max(x, 1)]), label: 'S6', dash: [5, 4], color: C.series[1] }],
            marks: [{ x: n, y: T / 0.9, label: 'your cut' }] });
        }
        // drawing: spindle head, cutter, workpiece moving under the feed, chips
        const c = design(st, 760, 190), C = kit.colors();
        ang += res.n / 60 * TAU * dt / 200; feedX = (feedX + V.vf / 60 * dt * 0.6) % 200;
        c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(150, 10, 100, 60); c.strokeRect(150, 10, 100, 60);
        kit.label(c, SPN[V.sp].ct ? 'router spindle' : 'spindle', 200, 44, { color: C.text, size: 12, align: 'center' });
        const Dpx = clamp(V.D * 0.9, 8, 110), cx = 200;
        c.fillStyle = C.muted; c.fillRect(cx - 6, 70, 12, 22);
        c.fillStyle = C.accent; c.fillRect(cx - Dpx / 2, 92, Dpx, 18);
        c.strokeStyle = C.bg2; c.lineWidth = 2;
        for (let k = 0; k < 4; k++) { const x = cx + Math.cos(ang + k * TAU / 4) * Dpx / 2; if (Math.sin(ang + k * TAU / 4) > 0) { c.beginPath(); c.moveTo(x, 92); c.lineTo(x, 110); c.stroke(); } }
        const cutDepth = clamp(V.ap * 3, 2, 28);
        c.fillStyle = 'hsl(210 10% 55%)'; c.fillRect(20 + feedX - 200, 110 - cutDepth + cutDepth, 720, 60);
        c.fillStyle = 'hsl(210 10% 65%)'; c.fillRect(Math.max(20, cx + Dpx / 2), 110 - cutDepth, 720, cutDepth);
        const nChip = Math.min(20, Math.round(res.Q / 5) + 1);
        for (let k = 0; k < nChip; k++) { const a = ang * 3 + k * 1.7; kit.dot(c, cx - Dpx / 2 - 10 - (k * 13 + (ang * 40) % 13) % 80, 100 - ((k * 29) % 40), 2, C.warn); }
        kit.arrow(c, 520, 150, 440, 150, C.text, 2);
        kit.label(c, 'feed ' + V.vf.toFixed(0) + ' mm/min', 480, 175, { color: C.text, size: 12, align: 'center' });
        kit.label(c, res.n.toFixed(0) + ' rpm · ' + res.Pm.toFixed(2) + ' kW · ' + res.T.toFixed(1) + ' N·m', 520, 40, { color: C.text, size: 15, weight: 700, align: 'center' });
        const fr = clamp(res.Pm / Math.max(res.a6, 1e-9), 0, 1.2);
        c.fillStyle = C.faint || C.grid; c.fillRect(420, 60, 200, 12); c.fillStyle = res.Pm <= res.a1 ? C.ok : res.Pm <= res.a6 ? C.warn : C.bad; c.fillRect(420, 60, 200 * Math.min(1, fr), 12);
        kit.label(c, 'load against S6 power at this speed', 520, 90, { color: C.muted, size: 11, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ as-traction */
  const VEH = {
    car: { name: 'Car, 1800 kg, 150 kW', m: 1800, crr: 0.010, cda: 0.644, r: 0.33, i: 9, eta: 0.95, Tp: 310, Pp: 150e3, Tc: 160, Pc: 70e3, nmax: 16000, adh: 0.9 * 0.5, cut: 0, marks: [50, 100], cruise: 100 },
    bike: { name: 'Pedelec, 105 kg with rider, 250 W hub motor', m: 105, crr: 0.006, cda: 0.5, r: 0.35, i: 1, eta: 0.9, Tp: 45, Pp: 500, Tc: 25, Pc: 250, nmax: 330, adh: 0.7 * 0.5, cut: 25, marks: [10, 20], cruise: 25 },
    tram: { name: 'Tram, 40 t, 4 × 120 kW', m: 40000, crr: 0.002, cda: 5, r: 0.33, i: 6.5, eta: 0.97, Tp: 3200, Pp: 480e3, Tc: 2000, Pc: 300e3, nmax: 4500, adh: 0.25 * 0.67, cut: 0, marks: [30, 60], cruise: 60 }
  };

  Hyper.sim('as-traction', {
    title: 'Traction: the motor against the road',
    blurb: `The rising lines are what the road asks — rolling resistance, the grade and air drag — as force at the wheels against speed. The falling line is what the motor can give through its reduction: constant up to its base speed, then constant power, then nothing above its top speed (and never more than the wheels' grip allows). Where they cross is the top speed; the gap below it accelerates the vehicle. Press *Accelerate* for a run from rest.

**Try this**
- Car on the level: top speed where the power curve meets the drag; about 13 kW would hold 100 km/h. Now a 20 % grade: the crossing moves far left.
- Switch to *continuous* ratings: the long hill the car can climb for minutes is much gentler than the one it can take for seconds.
- Change the reduction: a higher ratio gives more pull at low speed but a lower top speed, where the motor reaches its maximum rpm.
- The pedelec: the motor stops helping at 25 km/h, as EU rules require; add rider power and see what the hill costs.
- The tram: grip on the rails, not the motors, limits the starting pull.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 170 });
      const [g1, g2] = graphs(box.stage, 2);
      let V = null, dirty = true, run = null, lastPlot = -1, t = 0, wheel = 0;
      const ctl = kit.controls(box.side, [
        { id: 'veh', type: 'select', label: 'Vehicle', options: Object.entries(VEH).map(([k, v]) => [v.name, k]), value: 'car' },
        { id: 'grade', label: 'Grade', min: 0, max: 30, step: 0.5, value: 0, unit: '%' },
        { id: 'rate', type: 'select', label: 'Motor rating', options: [['Peak (seconds)', 'peak'], ['Continuous', 'cont']], value: 'peak' },
        { id: 'ratio', label: 'Reduction, % of standard', min: 50, max: 200, step: 5, value: 100, unit: '%' },
        { id: 'load', label: 'Extra load', min: 0, max: 100, step: 5, value: 0, unit: '% of mass' },
        { id: 'rider', label: 'Rider power (pedelec)', min: 0, max: 300, step: 10, value: 100, unit: 'W' },
        { type: 'buttons', items: [{ id: 'go', label: 'Accelerate from rest', primary: true }] }
      ], id => { if (id === 'go') run = { v: 0, t: 0, pts: [[0, 0]], hit: {} }; dirty = true; if (id === 'veh') { run = null; ctl.show('rider', V.veh === 'bike'); } });
      V = ctl.values; ctl.show('rider', false);
      const ro = kit.readout(box.side, [['top', 'Top speed on this grade'], ['nm', 'Motor speed at top speed'], ['F0', 'Starting pull · grip limit'], ['gr', 'Steepest grade it can climb (at 10 % of top speed)'], ['cr', 'Power to cruise'], ['acc', 'Acceleration run']]);
      const pF = kit.plot(g1, { x: { label: 'speed (km/h)', min: 0 }, y: { label: 'force at the wheels (kN)', min: 0 }, legend: true }, 190);
      const pV = kit.plot(g2, { x: { label: 'time (s)', min: 0 }, y: { label: 'speed (km/h)', min: 0 }, legend: true }, 190);
      const model = () => {
        const d = VEH[V.veh], m = d.m * (1 + V.load / 100), i = d.i * V.ratio / 100, th = Math.atan(V.grade / 100), g = 9.81;
        const T = V.rate === 'peak' ? d.Tp : d.Tc, P = V.rate === 'peak' ? d.Pp : d.Pc, wmax = d.nmax * TAU / 60;
        const Fadh = d.adh * m * g * Math.cos(th);
        const Ftr = v => {
          const w = v * i / d.r;
          let F = w > wmax ? 0 : Math.min(T, P / Math.max(w, 1e-6)) * i * d.eta / d.r;
          if (d.cut && v * 3.6 >= d.cut) F = 0;
          if (V.veh === 'bike') F += Math.min(250, V.rider / Math.max(v, 0.5));
          return Math.min(F, Fadh + (V.veh === 'bike' ? 0 : 0));
        };
        const Fres = v => m * g * (d.crr * Math.cos(th) + Math.sin(th)) + 0.5 * 1.2 * d.cda * v * v;
        let top = 0; const vMax = Math.max(wmax * d.r / i, (d.cut || 0) / 3.6) * 1.3 + 5;
        for (let k = 0; k <= 2000; k++) { const v = vMax * k / 2000; if (Ftr(v) >= Fres(v)) top = v; else if (k > 5 && top > 0) break; }
        return { d, m, i, th, Ftr, Fres, top, vMax, Fadh, wmax };
      };
      let M0 = model();
      const loop = kit.loop(dt => {
        t += dt;
        if (dirty) { M0 = model(); dirty = false; lastPlot = -1; }
        const Mo = M0, d = Mo.d;
        if (run && !run.done) {
          const sub = 20, h = dt * 2 / sub;                     // run at twice real time
          for (let k = 0; k < sub; k++) {
            const a = (Mo.Ftr(run.v) - Mo.Fres(run.v)) / (Mo.m * 1.05);
            run.v = Math.max(0, run.v + a * h); run.t += h;
          }
          if (run.t - run.pts[run.pts.length - 1][0] > 0.2) run.pts.push([run.t, run.v * 3.6]);
          for (const mk of d.marks) if (!run.hit[mk] && run.v * 3.6 >= mk) run.hit[mk] = run.t;
          if (run.t > 120 || (Mo.top > 0 && run.v > Mo.top * 0.995)) run.done = true;
        }
        wheel += (run ? run.v : 0) / d.r * dt / 4;
        const topK = Mo.top * 3.6, nTop = Mo.top * Mo.i / d.r * 60 / TAU;
        let steep = 0; const v10 = Math.max(0.5, 0.1 * Mo.top);
        for (let gpc = 0; gpc <= 100; gpc += 0.5) { const th = Math.atan(gpc / 100), need = Mo.m * 9.81 * (d.crr * Math.cos(th) + Math.sin(th)) + 0.5 * 1.2 * d.cda * v10 * v10; if (Mo.Ftr(v10) >= need) steep = gpc; else break; }
        const vc = d.cruise / 3.6, Pcr = Mo.Fres(vc) * vc;
        ro.set('top', topK > 0.5 ? topK.toFixed(1) + ' km/h' : 'cannot move on this grade');
        ro.set('nm', topK > 0.5 ? nTop.toFixed(0) + ' rpm (max ' + d.nmax + ')' : '—');
        ro.set('F0', (Mo.Ftr(0.3) / 1000).toFixed(2) + ' kN · ' + (Mo.Fadh / 1000).toFixed(1) + ' kN');
        ro.set('gr', steep.toFixed(1) + ' %');
        ro.set('cr', (Pcr / 1000).toFixed(2) + ' kW at ' + d.cruise + ' km/h on this grade');
        ro.set('acc', run ? d.marks.map(mk => '0–' + mk + ': ' + (run.hit[mk] != null ? run.hit[mk].toFixed(1) + ' s' : '…')).join(' · ') : 'press Accelerate');
        if (t - lastPlot > 0.2 || lastPlot < 0) {
          lastPlot = t;
          const C = kit.colors(), xs = []; for (let k = 0; k <= 150; k++) xs.push(Mo.vMax * k / 150);
          pF.set({ x: { label: 'speed (km/h)', min: 0, max: Mo.vMax * 3.6 }, series: [{ pts: xs.map(v => [v * 3.6, Mo.Ftr(v) / 1000]), label: 'motor (' + V.rate + ')' }, { pts: xs.map(v => [v * 3.6, Mo.Fres(v) / 1000]), label: 'road at ' + V.grade + ' %', color: C.series[1] }],
            marks: Mo.top > 0 ? [{ x: topK, y: Mo.Fres(Mo.top) / 1000, label: 'top speed' }] : [] });
          pV.set({ series: run ? [{ pts: run.pts.slice(), label: 'speed' }] : [], hlines: Mo.top > 0 ? [{ y: topK, label: 'top' }] : [] });
        }
        // drawing: the vehicle on its grade
        const c = design(st, 760, 170), C = kit.colors(), th = Mo.th;
        c.save(); c.translate(380, 120); c.rotate(-th);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(-360, 20); c.lineTo(360, 20); c.stroke();
        const L = V.veh === 'tram' ? 220 : V.veh === 'car' ? 130 : 70, Hh = V.veh === 'tram' ? 60 : V.veh === 'car' ? 38 : 30;
        c.fillStyle = C.accent; c.globalAlpha = 0.8;
        if (V.veh === 'bike') { c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(-25, 6); c.lineTo(0, -22); c.lineTo(25, 6); c.moveTo(-8, -22); c.lineTo(10, -22); c.stroke(); kit.dot(c, 0, -34, 7, C.muted); }
        else { c.fillRect(-L / 2, 8 - Hh, L, Hh); }
        c.globalAlpha = 1;
        const wr = V.veh === 'bike' ? 13 : 11;
        for (const wx of V.veh === 'bike' ? [-25, 25] : [-L / 2 + 22, L / 2 - 22]) { c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(wx, 20 - wr, wr, 0, TAU); c.stroke(); c.beginPath(); c.moveTo(wx, 20 - wr); c.lineTo(wx + wr * Math.cos(wheel), 20 - wr + wr * Math.sin(wheel)); c.stroke(); }
        const vNow = run ? run.v : 0, drag = 0.5 * 1.2 * d.cda * vNow * vNow;
        if (drag > 1) kit.arrow(c, L / 2 + 70, -10, L / 2 + 70 - clamp(drag / Math.max(1, Mo.Fadh) * 300, 10, 120), -10, C.series[1], 2);
        c.restore();
        kit.label(c, (vNow * 3.6).toFixed(1) + ' km/h', 110, 30, { color: C.text, size: 16, weight: 700, align: 'center' });
        kit.label(c, 'grade ' + V.grade + ' %  ·  ' + d.name, 110, 52, { color: C.muted, size: 11, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ as-robot-drone */
  const RMOT = {
    m100: { name: '100 W servo', Tc: 0.32, Tp: 0.95, J: 0.05e-4, nr: 3000, nmax: 6000 },
    m200: { name: '200 W servo', Tc: 0.64, Tp: 1.91, J: 0.17e-4, nr: 3000, nmax: 6000 },
    m400: { name: '400 W servo', Tc: 1.27, Tp: 3.82, J: 0.34e-4, nr: 3000, nmax: 6000 },
    m750: { name: '750 W servo', Tc: 2.39, Tp: 7.16, J: 1.1e-4, nr: 3000, nmax: 5000 }
  };
  const envP = (mo, n) => n > mo.nmax ? 0 : n <= mo.nr ? mo.Tp : mo.Tp - (mo.Tp - mo.Tc) * (n - mo.nr) / (mo.nmax - mo.nr);
  const envC = (mo, n) => n > mo.nmax ? 0 : n <= mo.nr ? mo.Tc : mo.Tc * (1 - 0.25 * (n - mo.nr) / (mo.nmax - mo.nr));

  Hyper.sim('as-robot-drone', {
    title: 'Sizing a robot joint or a drone',
    blurb: `Two machines at opposite ends of the motor world.

**Robot joint**: an arm with a payload swings 90° (from 45° below to 45° above horizontal) in the time you set — a third accelerating, a third cruising, a third braking — then holds. The joint torque is gravity plus acceleration; through the reducer it becomes the motor's torque and speed, drawn as a path on the servo's torque–speed map.

**Drone**: the propeller's thrust grows with speed² and diameter⁴, its power with speed³ and diameter⁵. The sim finds the speed each rotor needs to hover, the power and current, how much of full throttle that is for your motor's Kv and cell count, and how long the battery lasts — counting the battery's own weight.

**Try this**
- Robot: halve the move time — the acceleration torque quadruples; watch the path leave the peak envelope. Lower the ratio: less motor speed, but more motor torque.
- Robot: choose a strain-wave gear, then a planetary: the efficiency changes the motor torque.
- Drone: raise the prop diameter at the same mass — hover power falls; then Kv must fall too, or the current soars.
- Drone: double the battery capacity: the flight time does not double, because the drone must now carry the extra weight.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const [g1, g2] = graphs(box.stage, 2);
      let V = null, dirty = true, tau = 0, spin = 0, lastPlot = -1, t = 0, R = null;
      const RB = ['pay', 'arm', 'len', 'mt', 'ratio', 'red', 'mot'], DR = ['dm', 'rot', 'prop', 'cells', 'kv', 'ah'];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Machine', options: [['Robot joint', 'robot'], ['Multirotor drone', 'drone']], value: 'robot' },
        { id: 'pay', label: 'Payload', min: 0, max: 10, step: 0.5, value: 3, unit: 'kg' },
        { id: 'arm', label: 'Arm mass', min: 0.5, max: 10, step: 0.5, value: 4, unit: 'kg' },
        { id: 'len', label: 'Arm length', min: 0.2, max: 1.2, step: 0.05, value: 0.5, unit: 'm' },
        { id: 'mt', label: 'Time for the 90° swing', min: 0.3, max: 4, step: 0.05, value: 1.5, unit: 's' },
        { id: 'ratio', type: 'select', label: 'Reducer ratio', options: [['50:1', 50], ['80:1', 80], ['100:1', 100], ['120:1', 120], ['160:1', 160]], value: 100 },
        { id: 'red', type: 'select', label: 'Reducer', options: [['Strain-wave, 75 %', 0.75], ['Cycloidal, 85 %', 0.85], ['Planetary, 92 %', 0.92]], value: 0.75 },
        { id: 'mot', type: 'select', label: 'Motor', options: Object.entries(RMOT).map(([k, m]) => [m.name, k]), value: 'm200' },
        { id: 'dm', label: 'Mass without battery', min: 0.3, max: 15, value: 1.5, unit: 'kg', log: true, sig: 2 },
        { id: 'rot', type: 'select', label: 'Rotors', options: [['4', 4], ['6', 6], ['8', 8]], value: 4 },
        { id: 'prop', label: 'Propeller diameter', min: 5, max: 30, step: 0.5, value: 10, unit: 'in' },
        { id: 'cells', label: 'Battery cells (LiPo, 3.7 V each)', min: 3, max: 12, step: 1, value: 4 },
        { id: 'kv', label: 'Motor Kv', min: 100, max: 3000, step: 10, value: 900, unit: 'rpm/V' },
        { id: 'ah', label: 'Battery capacity', min: 1, max: 30, step: 0.5, value: 5, unit: 'Ah' }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['a', ''], ['b', ''], ['c', ''], ['d', ''], ['e', ''], ['f', '']]);
      const p1 = kit.plot(g1, { x: { label: '' }, y: { label: '' }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: '' }, y: { label: '' }, legend: true }, 190);
      const setMode = () => { RB.forEach(k => ctl.show(k, V.mode === 'robot')); DR.forEach(k => ctl.show(k, V.mode === 'drone')); };
      setMode();
      function robot() {
        const mo = RMOT[V.mot], i = +V.ratio, eta = +V.red, L = V.len, mp = V.pay, ma = V.arm, g = 9.81;
        const J = mp * L * L + ma * L * L / 3, G = (mp * L + ma * L / 2) * g, T = V.mt, ta = T / 3, span = Math.PI / 2;
        const wmax = span / (2 * ta), al = wmax / ta;                  // trapezoid with equal thirds
        const ang = u => u < ta ? al * u * u / 2 : u < 2 * ta ? al * ta * ta / 2 + wmax * (u - ta) : u < T ? span - al * (T - u) * (T - u) / 2 : span;
        const vel = u => u < ta ? al * u : u < 2 * ta ? wmax : u < T ? al * (T - u) : 0;
        const acc = u => u < ta ? al : u < 2 * ta ? 0 : u < T ? -al : 0;
        const pts = [], path = []; let sq = 0, pk = 0, npk = 0, jpk = 0; const hold = 0.5, N = 200;
        for (let k = 0; k <= N; k++) {
          const u = (T + hold) * k / N, th = -Math.PI / 4 + ang(u), w = vel(u), a = acc(u);
          const Tj = G * Math.cos(th) + J * a;                          // joint torque, positive lifting
          const Tm = (Tj * w >= 0 ? Tj / (i * eta) : Tj * eta / i) + mo.J * i * a;   // through the reducer, plus the rotor's own inertia
          const n = Math.abs(w) * i * 60 / TAU;
          pts.push([u, Tj, Tm, n]); path.push([n, Math.abs(Tm)]);
          if (k) sq += Tm * Tm * (T + hold) / N;
          pk = Math.max(pk, Math.abs(Tm)); npk = Math.max(npk, n); jpk = Math.max(jpk, Math.abs(Tj));
        }
        const rms = Math.sqrt(sq / (T + hold));
        let ok = true; for (const [n, Tm] of path) if (Tm > envP(mo, n) + 1e-9) ok = false;
        return { mo, i, eta, J, G, pts, path, rms, pk, npk, jpk, ok, okR: rms <= mo.Tc, okN: npk <= mo.nmax, ang, T, hold };
      }
      const CT = 0.11, CPw = 0.045, RHO = 1.225;
      function drone() {
        const D = V.prop * 0.0254, N = +V.rot, Vb = V.cells * 3.7, E = Vb * V.ah, mb = E / 150;   // LiPo packs of about 150 Wh/kg
        const m = V.dm + mb, Th = m * 9.81 / N;
        const nh = Math.sqrt(Th / (CT * RHO * Math.pow(D, 4))), Ph = CPw * RHO * Math.pow(nh, 3) * Math.pow(D, 5);   // n in rev/s
        const Pid = Math.sqrt(Math.pow(Th, 3) / (2 * RHO * Math.PI * D * D / 4));
        const nmax = 0.85 * V.kv * Vb / 60, Tmax = CT * RHO * nmax * nmax * Math.pow(D, 4), Pmax = CPw * RHO * Math.pow(nmax, 3) * Math.pow(D, 5);
        const Pel = N * Ph / 0.8, time = 60 * E * 0.8 / Pel, Imax = Pmax / (0.8 * Vb), Ih = Ph / (0.8 * Vb);
        return { D, N, Vb, E, mb, m, Th, nh, Ph, Pid, nmax, Tmax, Pmax, Pel, time, Imax, Ih, tw: N * Tmax / (m * 9.81), thr: nh / nmax };
      }
      const loop = kit.loop(dt => {
        t += dt;
        if (dirty) { setMode(); R = V.mode === 'robot' ? robot() : drone(); dirty = false; lastPlot = -1; }
        const C = kit.colors();
        if (V.mode === 'robot') {
          const r = R, mo = r.mo;
          tau = (tau + dt) % (2 * (r.T + r.hold));
          ro.set('a', 'Joint torque: peak ' + r.jpk.toFixed(1) + ' N·m · holding at horizontal ' + r.G.toFixed(1) + ' N·m (the brake must hold this)');
          ro.set('b', 'Motor peak ' + r.pk.toFixed(2) + ' N·m of ' + mo.Tp + (r.ok ? ' — within the envelope' : ' — OUTSIDE the peak envelope'));
          ro.set('c', 'Motor RMS ' + r.rms.toFixed(2) + ' N·m of ' + mo.Tc + ' continuous' + (r.okR ? '' : ' — too hot'));
          ro.set('d', 'Motor top speed ' + r.npk.toFixed(0) + ' rpm of ' + mo.nmax + (r.okN ? '' : ' — too fast'));
          ro.set('e', 'Inertia at the motor: arm ' + (r.J / (r.i * r.i) * 1e4).toFixed(2) + ' kg·cm², rotor ' + (mo.J * 1e4).toFixed(2) + ' kg·cm² (ratio ' + (r.J / (r.i * r.i) / mo.J).toFixed(1) + ':1)');
          ro.set('f', r.ok && r.okR && r.okN ? 'Verdict: the ' + mo.name + ' fits' : 'Verdict: choose a bigger motor, a slower move or another ratio');
          if (lastPlot < 0) {
            lastPlot = t;
            const xs = []; for (let k = 0; k <= 60; k++) xs.push(mo.nmax * 1.05 * k / 60);
            p1.set({ x: { label: 'motor speed (rpm)', min: 0, max: mo.nmax * 1.05 }, y: { label: 'motor torque (N·m)', min: 0, max: Math.max(mo.Tp, r.pk) * 1.15 },
              series: [{ pts: xs.map(n => [n, envP(mo, n)]), label: 'peak' }, { pts: xs.map(n => [n, envC(mo, n)]), label: 'continuous', dash: [5, 4], color: C.muted }, { pts: r.path, label: 'the move', color: C.series[1], line: false, dots: true }],
              marks: [{ x: r.npk / 2, y: r.rms, label: 'RMS' }], hlines: [], vlines: [] });
            p2.set({ x: { label: 'time (s)', min: 0, max: r.T + r.hold }, y: { label: 'N·m' }, series: [{ pts: r.pts.map(p => [p[0], p[1]]), label: 'joint torque' }, { pts: r.pts.map(p => [p[0], p[2] * 10]), label: 'motor torque × 10', color: C.series[1] }], hlines: [{ y: 0 }], vlines: [] });
          }
          // drawing: the arm swinging
          const u = tau < r.T + r.hold ? tau : 2 * (r.T + r.hold) - tau, th = -Math.PI / 4 + r.ang(Math.min(u, r.T));
          const c = design(st, 760, 300), cx = 250, cy = 170, Lp = 200 * V.len / 1.2 + 60;
          c.strokeStyle = C.faint || C.grid; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(cx - 20, cy); c.lineTo(cx + Lp + 40, cy); c.stroke(); c.setLineDash([]);
          c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(cx - 50, cy - 30, 40, 60); c.strokeRect(cx - 50, cy - 30, 40, 60);
          kit.label(c, 'motor', cx - 30, cy + 48, { color: C.muted, size: 11, align: 'center' });
          c.beginPath(); c.arc(cx, cy, 22, 0, TAU); c.fillStyle = C.muted; c.fill();
          const ex = cx + Lp * Math.cos(-th), ey = cy + Lp * Math.sin(-th);
          c.strokeStyle = C.accent; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(cx, cy); c.lineTo(ex, ey); c.stroke(); c.lineCap = 'butt';
          if (V.pay > 0) { const s = 12 + 3 * Math.sqrt(V.pay); c.fillStyle = C.warn; c.fillRect(ex - s / 2, ey - s / 2, s, s); }
          kit.arrow(c, ex, ey + 14, ex, ey + 50, C.bad, 2);
          kit.label(c, 'g', ex + 10, ey + 42, { color: C.bad, size: 11, align: 'left' });
          kit.label(c, (th * 180 / Math.PI).toFixed(0) + '°', cx + 40, cy + 26, { color: C.text, size: 12, align: 'left' });
          kit.label(c, r.i + ':1 ' + (r.eta === 0.75 ? 'strain-wave' : r.eta === 0.85 ? 'cycloidal' : 'planetary'), cx, cy - 36, { color: C.text, size: 11, align: 'center' });
          kit.label(c, r.ok && r.okR && r.okN ? 'fits' : 'does not fit', 620, 60, { color: r.ok && r.okR && r.okN ? C.ok : C.bad, size: 18, weight: 700, align: 'center' });
          c.restore();
        } else {
          const r = R;
          spin += dt * 30;
          ro.set('a', 'All-up mass ' + r.m.toFixed(2) + ' kg (battery ' + r.mb.toFixed(2) + ' kg, ' + r.E.toFixed(0) + ' Wh)');
          ro.set('b', 'Hover: ' + (r.nh * 60).toFixed(0) + ' rpm per rotor, ' + (100 * r.thr).toFixed(0) + ' % of full-throttle speed');
          ro.set('c', 'Hover power ' + r.Pel.toFixed(0) + ' W from the battery (ideal ' + (r.N * r.Pid).toFixed(0) + ' W) · ' + (r.m * 1000 / r.Pel).toFixed(1) + ' g/W');
          ro.set('d', 'Current per motor: hover ' + r.Ih.toFixed(1) + ' A, full throttle ' + r.Imax.toFixed(0) + ' A' + (r.Imax > 60 ? ' — very high: lower Kv or prop' : ''));
          ro.set('e', 'Thrust-to-weight ' + r.tw.toFixed(1) + (r.tw < 1.5 ? ' — cannot manoeuvre (or even lift)' : r.tw < 2 ? ' — marginal' : ''));
          ro.set('f', 'Hover time about ' + (r.tw >= 1.05 ? r.time.toFixed(1) + ' min' : '— it cannot take off'));
          if (lastPlot < 0) {
            lastPlot = t;
            const ns = []; for (let k = 0; k <= 60; k++) ns.push(r.nmax * 1.05 * k / 60);
            p1.set({ x: { label: 'rotor speed (1000 rpm)', min: 0, max: r.nmax * 60 * 1.05 / 1000 }, y: { label: 'thrust per rotor (N)', min: 0 },
              series: [{ pts: ns.map(n => [n * 60 / 1000, CT * RHO * n * n * Math.pow(r.D, 4)]), label: 'thrust' }],
              marks: [{ x: r.nh * 60 / 1000, y: r.Th, label: 'hover' }, { x: r.nmax * 60 / 1000, y: r.Tmax, label: 'full throttle' }], hlines: [{ y: r.Th }], vlines: [] });
            const caps = [], save = V.ah; for (let a = 1; a <= 30; a += 0.5) { V.ah = a; const q = drone(); caps.push([a, q.tw >= 1.05 ? q.time : 0]); } V.ah = save;
            p2.set({ x: { label: 'battery capacity (Ah)', min: 0, max: 30 }, y: { label: 'hover time (min)', min: 0 }, series: [{ pts: caps, label: 'hover time' }], hlines: [], vlines: [{ x: V.ah, label: 'yours' }] });
          }
          const c = design(st, 760, 300), cx = 300, cy = 150, N = r.N, arm = 95, pr = clamp(V.prop * 3.2, 14, 70);
          for (let k = 0; k < N; k++) {
            const a = k * TAU / N + Math.PI / N, x = cx + arm * Math.cos(a), y = cy + arm * Math.sin(a);
            c.strokeStyle = C.text; c.lineWidth = 5; c.beginPath(); c.moveTo(cx, cy); c.lineTo(x, y); c.stroke();
            c.fillStyle = C.accent; c.globalAlpha = 0.18 + 0.3 * r.thr; c.beginPath(); c.arc(x, y, pr, 0, TAU); c.fill(); c.globalAlpha = 1;
            const b = spin * (k % 2 ? 1 : -1);
            c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(x - pr * Math.cos(b), y - pr * Math.sin(b)); c.lineTo(x + pr * Math.cos(b), y + pr * Math.sin(b)); c.stroke();
            kit.dot(c, x, y, 6, C.muted);
          }
          c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(cx - 26, cy - 18, 52, 36); c.strokeRect(cx - 26, cy - 18, 52, 36);
          const bx = 560;
          kit.label(c, 'hover throttle', bx + 60, 50, { color: C.muted, size: 11, align: 'center' });
          c.fillStyle = C.faint || C.grid; c.fillRect(bx, 60, 120, 14); c.fillStyle = r.thr > 0.8 ? C.bad : r.thr > 0.65 ? C.warn : C.ok; c.fillRect(bx, 60, 120 * clamp(r.thr, 0, 1), 14);
          kit.label(c, (100 * r.thr).toFixed(0) + ' %', bx + 60, 92, { color: C.text, size: 14, weight: 700, align: 'center' });
          kit.label(c, r.tw >= 1.05 ? r.time.toFixed(1) + ' min hover' : 'cannot lift off', bx + 60, 140, { color: r.tw >= 1.05 ? C.text : C.bad, size: 16, weight: 700, align: 'center' });
          kit.label(c, V.cells + 'S ' + V.ah + ' Ah · Kv ' + V.kv + ' · ' + V.prop + ' in props', bx + 60, 166, { color: C.muted, size: 11, align: 'center' });
          c.restore();
        }
      }, box.stage);
      loop.start();
    }
  });

})();
