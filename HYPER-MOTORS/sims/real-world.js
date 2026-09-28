/* HYPER-MOTORS · sims/real-world.js — simulations for Motors in the Real World (content/real-world.js).
 *   rw-heating        a TEFC motor heating up: two-body thermal model, duty, ambient, altitude, locked rotor, relay, insulation life
 *   rw-friction       where friction lives in a motor: bearings, grease, seal, brushes, fan, cogging; a coast-down test
 *   rw-noise          motor noise by octave band: magnetic, PWM, bearings, fan; A-weighting, distance, dB(A) total
 *   rw-vibration      a motor on its mounts: unbalance, misalignment, looseness, electrical 2×LF; resonance, spectrum, ISO zones
 *   rw-bearing        a ball bearing with a defect: impacts, time signal, envelope spectrum, BPFO/BPFI/BSF/FTF, L10, grease life
 *   rw-faults         a 7.5 kW motor with a lost phase, unbalance, low voltage, overload or locked rotor; currents, heating, relay
 *   rw-insulation     a 10-minute insulation-resistance test: absorption, leakage, PI, temperature correction
 *   rw-linear         a linear-motor axis: commutated coils over a magnet track, force profile, RMS force and heat
 *   rw-voice-coil     a moving-coil actuator under PID control: position, current, back-EMF, force–stroke curve
 *   rw-piezo          a stick-slip drive stepping, and a travelling-wave ultrasonic motor with elliptical surface motion
 *   rw-direct-drive   a rotary table indexed by a torque motor and by a servo with a compliant, backlashed gearbox
 *   rw-coreless       an iron-core and a coreless DC motor side by side: start-up, cogging, PWM ripple, winding heat
 *   rw-vibration-motors  an ERM and an LRA shaking a handheld device: spin-up, resonance, overdrive and braking
 *   rw-solenoid       a DC solenoid: current rise and dip, plunger motion, force–stroke curve, hold current, flyback release
 * Models are typical, rounded values for teaching; real datasheets, nameplates and manuals govern.
 */
(function () {
  'use strict';

  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const TAU = 2 * Math.PI;
  // a drawing area of W0 × H0 virtual pixels, scaled to fit and centred on the stage (restore with c.restore())
  function view(st, W0, H0) {
    const c = st.begin(), s = Math.min(st.W / W0, st.H / H0);
    c.save(); c.translate((st.W - W0 * s) / 2, (st.H - H0 * s) / 2); c.scale(s, s);
    c.font = '12px ' + font(); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    return c;
  }
  // n graph boxes under the canvas, side by side when there is room
  function graphs(box, n) {
    const gb = document.createElement('div');
    gb.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;padding:4px 10px 10px';
    box.stage.appendChild(gb);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  }
  // cool blue → hot red
  const heatCol = (f, a) => 'hsl(' + (220 - 220 * clamp(f, 0, 1)).toFixed(0) + ' 80% 52%' + (a != null ? ' / ' + a : '') + ')';
  function text(c, s, x, y, o) {
    o = o || {};
    c.save(); c.font = (o.weight ? o.weight + ' ' : '') + (o.size || 12) + 'px ' + font();
    c.fillStyle = o.color || kitColors().text; c.textAlign = o.align || 'center'; c.fillText(s, x, y); c.restore();
  }
  let kitColors = () => ({ text: '#888' });
  // a vertical thermometer from lo to hi °C with a limit line
  function thermometer(c, C, x, y, h, T, lo, hi, limit, label) {
    const f = clamp((T - lo) / (hi - lo), 0, 1), yl = y + h - h * clamp((limit - lo) / (hi - lo), 0, 1);
    c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(x - 7, y, 14, h);
    c.fillStyle = T > limit ? C.bad : heatCol((T - lo) / (hi - lo)); c.fillRect(x - 6, y + h - h * f, 12, h * f);
    c.strokeStyle = C.bad; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(x - 14, yl); c.lineTo(x + 14, yl); c.stroke(); c.setLineDash([]);
    text(c, label, x, y - 6, { color: C.muted, size: 11 });
    text(c, T.toFixed(0) + ' °C', x, y + h + 15, { color: T > limit ? C.bad : C.text, size: 12, weight: 600 });
  }
  const fmtTime = s => s < 120 ? s.toFixed(0) + ' s' : s < 7200 ? (s / 60).toFixed(1) + ' min' : (s / 3600).toFixed(2) + ' h';

  /* ================================================================ rw-heating */
  // TEFC 4-pole IE3 motors: rated losses from the IE3 efficiency; at rated load the frame rises 50 K over the air and the
  // winding 30 K over the frame (an 80 K "class B" rise). Loss split at rated load: stator copper 40 %, rotor copper and
  // stray 28 %, iron and friction 32 % (fixed). tauF and tauW: the frame's and the winding's own time constants.
  const HEAT = {
    small: { name: '0.75 kW, 4-pole, IE3 (frame 80)', kW: 0.75, tauF: 18 * 60, tauW: 90 },
    mid: { name: '7.5 kW, 4-pole, IE3 (frame 132M)', kW: 7.5, tauF: 40 * 60, tauW: 240 },
    big: { name: '75 kW, 4-pole, IE3 (frame 280S)', kW: 75, tauF: 80 * 60, tauW: 480 }
  };
  Hyper.sim('rw-heating', {
    title: 'Heating up a motor',
    blurb: `A totally enclosed, fan-cooled induction motor as two bodies: the winding (which gets the stator copper loss) and the iron frame (which gets everything else and passes all the heat to the air through its fins and fan). The upper graph traces the winding hot spot and the frame over time; the lower one is the insulation life at each hot-spot temperature by the 10-kelvin rule, with the motor's present point.

**Try this**
- Run the 7.5 kW motor at 100 % at ×600: the frame creeps up with a time constant of about 40 min, the winding sits about 30 K above it; the hot spot settles near 130 °C — class F insulation with a class B rise and decades of life.
- Set 120 % load: 10–20 K hotter, the life halves or quarters, and the class 10 overload relay trips after a while.
- Raise the air to 50 °C or the altitude to 3000 m and read the *Permissible load here*.
- Choose S3 duty (stop between loads): the fan stops too, so the motor cools slowly; compare with S6 (running unloaded between loads).
- Press *Lock the rotor* (time drops to real time): 6.5 times the current, the winding climbs several kelvin a second — watch the relay trip in about 10 s. Untick the relay and try again.`,
    mount(box, kit) {
      const M = kit.motor;
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 210 });
      const [g1, g2] = graphs(box, 2);
      let V = null, m = null, Tw = 40, Tf = 40, tSim = 0, used = 0, stalled = false, tripped = false, burnt = false, relay = 0;
      let hist = [], lastSample = -1e9, fanAng = 0, lastPlot = -1, tReal = 0, Pnow = 0, Inow = 0, runningNow = true, loadOnNow = true;
      const setup = () => {
        const p = HEAT[V.preset], eff = M.ieAt('IE3', p.kW) / 100, Pl = p.kW * 1000 * (1 / eff - 1), Rfa = 50 / Pl, Rwf = 30 / (0.4 * Pl);
        m = { p, eff, Pl, Rfa, Rwf, Cf: p.tauF / Rfa, Cw: p.tauW / Rwf };
      };
      const reset = () => { Tw = Tf = V.Ta; tSim = 0; used = 0; stalled = false; tripped = false; burnt = false; relay = 0; hist = []; lastSample = -1e9; lastPlot = -1; };
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Motor', options: Object.entries(HEAT).map(([k, p]) => [p.name, k]), value: 'mid' },
        { id: 'load', label: 'Load (% of rated)', min: 0, max: 150, step: 5, value: 100, unit: '%' },
        { id: 'duty', type: 'select', label: 'Duty', options: [['S1: continuous', 'S1'], ['S3: load, then stop (10-min cycle)', 'S3'], ['S6: load, then run unloaded (10-min cycle)', 'S6']], value: 'S1' },
        { id: 'dutyPct', label: 'Time on load in each cycle', min: 10, max: 100, step: 5, value: 50, unit: '%' },
        { id: 'Ta', label: 'Air temperature', min: -20, max: 60, step: 1, value: 40, unit: '°C' },
        { id: 'alt', label: 'Altitude', min: 0, max: 4000, step: 100, value: 0, unit: 'm' },
        { id: 'cls', type: 'select', label: 'Insulation class', options: [['B (130 °C)', 'B'], ['F (155 °C)', 'F'], ['H (180 °C)', 'H']], value: 'F' },
        { id: 'relay', type: 'check', label: 'Overload relay, class 10, set to rated current', value: true },
        { id: 'speed', type: 'select', label: 'Time', options: [['real time', 1], ['× 60', 60], ['× 600', 600]], value: 600 },
        { type: 'buttons', items: [{ id: 'lock', label: 'Lock the rotor', primary: true }, { id: 'resetRelay', label: 'Reset relay' }, { id: 'cold', label: 'Restart cold' }] }
      ], id => {
        if (id === 'preset') { setup(); reset(); }
        if (id === 'cold') reset();
        if (id === 'lock' && !burnt) { stalled = !stalled; if (stalled) { tripped = false; ctl.set('speed', 1); } }
        if (id === 'resetRelay') { tripped = false; relay = Math.min(relay, 1); }
        if (id === 'duty') ctl.show('dutyPct', V.duty !== 'S1');
        lastPlot = -1;
      });
      V = ctl.values; setup(); reset(); ctl.show('dutyPct', false);
      const ro = kit.readout(box.side, [['t', 'Time (simulated)'], ['P', 'Losses now'], ['hs', 'Winding hot spot'], ['Tf', 'Frame'], ['life', 'Insulation life at this temperature'], ['used', 'Life used so far'], ['der', 'Permissible load here'], ['rel', 'Overload relay']]);
      const p1 = kit.plot(g1, { x: { label: 'time (min)', min: 0 }, y: { label: 'temperature (°C)' }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'hot-spot temperature (°C)', min: 80, max: 220 }, y: { label: 'insulation life (years, continuous)', log: true, min: 0.01, max: 1000 }, legend: true }, 190);
      const loop = kit.loop(dt => {
        tReal += dt;
        const Tc = M.INSULATION[V.cls], ka = 1 + Math.max(0, V.alt - 1000) / 10000;
        const simDt = dt * V.speed, nSub = Math.max(1, Math.ceil(simDt / 1)), h = simDt / nSub;
        for (let k = 0; k < nSub; k++) {
          const phase = (tSim % 600) / 600;
          const loadOn = V.duty === 'S1' || phase < V.dutyPct / 100;
          const running = !tripped && !burnt && (stalled || V.duty !== 'S3' || loadOn);
          const x = loadOn ? V.load / 100 : 0, r = M.copperR(1, Tw) / M.copperR(1, 120);
          let Pw = 0, Pfr = 0, Ir = 0;
          if (running && stalled) { Ir = 6.5; Pw = 0.40 * m.Pl * Ir * Ir * r; Pfr = 0.5 * 0.28 * m.Pl * Ir * Ir + 0.25 * m.Pl; }
          else if (running) { Ir = Math.sqrt(0.09 + 0.91 * x * x); Pw = 0.40 * m.Pl * x * x * r; Pfr = 0.28 * m.Pl * x * x + 0.32 * m.Pl; }
          const fanOn = running && !stalled, Rfa = m.Rfa * ka * (fanOn ? 1 : 3), Rwf = m.Rwf * ka;
          const q = (Tw - Tf) / Rwf;
          Tw += h * (Pw - q) / m.Cw;
          Tf += h * (Pfr + q - (Tf - V.Ta) / Rfa) / m.Cf;
          if (V.relay) { relay += h * (Ir * Ir - relay) / 310; if (relay >= 1.3225 && Ir > 0) { tripped = true; stalled = false; } }
          else relay = 0;
          if (Tw + 10 > Tc + 120) { burnt = true; stalled = false; }
          used += h / 3600 * Math.pow(2, (Tw + 10 - Tc) / 10);
          tSim += h; Pnow = Pw + Pfr; Inow = Ir; runningNow = running; loadOnNow = loadOn;
        }
        const every = V.speed >= 600 ? 20 : V.speed >= 60 ? 3 : 0.25;
        if (tSim - lastSample >= every) { lastSample = tSim; hist.push([tSim / 60, Tw + 10, Tf]); if (hist.length > 1800) hist.shift(); }
        const hs = Tw + 10, lifeH = 20000 * Math.pow(2, (Tc - hs) / 10), der = Math.sqrt(Math.max(0, ((120 - V.Ta) / ka - 16) / 64));
        ro.set('t', fmtTime(tSim));
        ro.set('P', Pnow.toFixed(0) + ' W (rated losses ' + m.Pl.toFixed(0) + ' W)');
        ro.set('hs', burnt ? 'insulation destroyed — restart cold' : hs.toFixed(0) + ' °C' + (hs > Tc ? ' — above class ' + V.cls + '!' : ''));
        ro.set('Tf', Tf.toFixed(0) + ' °C (' + (Tf * 9 / 5 + 32).toFixed(0) + ' °F)');
        ro.set('life', lifeH > 876000 ? 'over 100 years' : lifeH > 8760 ? (lifeH / 8760).toFixed(1) + ' years' : lifeH.toFixed(0) + ' h');
        ro.set('used', used.toFixed(1) + ' h of 20 000 h at class temperature');
        ro.set('der', (100 * Math.min(1.2, der)).toFixed(0) + ' % = ' + (m.p.kW * Math.min(1.2, der)).toFixed(2) + ' kW (keeps the rated winding temperature)');
        ro.set('rel', !V.relay ? 'not fitted' : tripped ? 'TRIPPED — reset to run' : 'thermal image at ' + (100 * relay / 1.3225).toFixed(0) + ' % of trip');
        if (tReal - lastPlot > 0.25 || lastPlot < 0) {
          lastPlot = tReal;
          const C = kit.colors(), lp = [];
          for (let T = 80; T <= 220; T += 2) lp.push([T, 20000 * Math.pow(2, (Tc - T) / 10) / 8760]);
          p1.set({ series: [{ pts: hist.map(p => [p[0], p[1]]), label: 'winding hot spot' }, { pts: hist.map(p => [p[0], p[2]]), label: 'frame', color: C.series[1] }],
            hlines: [{ y: Tc, label: 'class ' + V.cls + ' ' + Tc + ' °C' }, { y: V.Ta, label: 'air' }] });
          p2.set({ series: [{ pts: lp, label: 'class ' + V.cls + ', 20 000 h at ' + Tc + ' °C' }], marks: [{ x: clamp(hs, 80, 220), y: clamp(lifeH / 8760, 0.01, 1000), label: 'now' }], vlines: [{ x: Tc, label: 'class' }] });
        }
        // drawing
        const C = kit.colors(), c = view(st, 660, 240);
        if (runningNow && !stalled) fanAng += dt * (V.speed > 1 ? 6 : 12);
        const x0 = 150, x1 = 420, y0 = 60, y1 = 180;
        c.fillStyle = heatCol((Tf - 20) / 140, 0.35); c.fillRect(x0, y0, x1 - x0, y1 - y0);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(x0, y0, x1 - x0, y1 - y0);
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let y = y0 + 6; y < y1; y += 8) { if (y > 82 && y < 158) continue; c.beginPath(); c.moveTo(x0 + 4, y); c.lineTo(x1 - 4, y); c.stroke(); }
        c.fillStyle = C.bg2; c.fillRect(185, 84, 200, 72); c.strokeStyle = C.faint; c.strokeRect(185, 84, 200, 72);
        c.fillStyle = C.surface2; c.fillRect(215, 88, 140, 14); c.fillRect(215, 138, 140, 14);
        c.fillStyle = heatCol((hs - 20) / 160); c.fillRect(192, 88, 23, 64); c.fillRect(355, 88, 23, 64); c.fillRect(215, 90, 140, 8); c.fillRect(215, 142, 140, 8);
        c.fillStyle = C.muted; c.fillRect(218, 106, 134, 28);
        c.strokeStyle = C.text; c.lineWidth = 6; c.beginPath(); c.moveTo(80, 120); c.lineTo(470, 120); c.stroke();
        text(c, 'winding', 285, 80, { color: C.muted, size: 11 });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(x1, y0 + 6); c.lineTo(470, y0 + 22); c.lineTo(470, y1 - 22); c.lineTo(x1, y1 - 6); c.closePath(); c.fill(); c.stroke();
        c.save(); c.translate(446, 120); c.strokeStyle = runningNow && !stalled ? C.accent : C.faint; c.lineWidth = 3;
        for (let k = 0; k < 6; k++) { const a = fanAng + k * Math.PI / 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 44 * Math.sin(a)); c.stroke(); }
        c.restore();
        c.fillStyle = C.surface2; c.fillRect(250, 40, 60, 20); c.strokeStyle = C.text; c.strokeRect(250, 40, 60, 20);
        c.fillStyle = C.text; c.fillRect(170, 180, 30, 10); c.fillRect(370, 180, 30, 10);
        const waves = clamp(Math.round((Tf - V.Ta) / 12), 0, 6);
        c.strokeStyle = heatCol(0.9, 0.7); c.lineWidth = 1.5;
        for (let k = 0; k < waves; k++) { const xx = 170 + k * 40; c.beginPath(); for (let j = 0; j <= 20; j++) { const yy = 36 - j * 1.2, xw = xx + 4 * Math.sin(j / 3 + tReal * 3 + k); j ? c.lineTo(xw, yy) : c.moveTo(xw, yy); } c.stroke(); }
        // the air and the altitude
        c.fillStyle = C.faint; c.beginPath(); c.moveTo(20, 200); c.lineTo(55, 140); c.lineTo(90, 200); c.closePath(); c.fill();
        text(c, 'air ' + V.Ta + ' °C', 55, 222, { size: 12 }); text(c, V.alt + ' m', 55, 236, { color: C.muted, size: 11 });
        thermometer(c, C, 530, 40, 150, Math.max(-20, hs), 0, 220, Tc, 'hot spot');
        thermometer(c, C, 600, 40, 150, Math.max(-20, Tf), 0, 220, Tc, 'frame');
        const status = burnt ? 'the winding has burnt out' : tripped ? 'OVERLOAD RELAY TRIPPED — motor stopped, fan still' : stalled ? 'ROTOR LOCKED: ' + Inow.toFixed(1) + ' × rated current, fan still' :
          !runningNow ? 'stopped between loads: no fan, slow cooling' : V.duty === 'S1' ? 'running at ' + V.load + ' % load' : (loadOnNow ? 'on load (' + V.load + ' %)' : 'running unloaded') + ' — ' + ((tSim % 600) / 60).toFixed(1) + ' min into the 10-min cycle';
        text(c, status, 285, 222, { color: stalled || tripped || burnt ? C.bad : C.text, size: 13, weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rw-friction */
  // friction torque = bearings (½ μ F d) + grease (viscous, stiffer when cold) + seal + brushes + iron drag + fan (∝ ω²),
  // with cogging (position-dependent, zero mean) on the magnet motor. A coast-down integrates J dω/dt = −T_f − T_cog.
  const FRI = {
    im: { name: '7.5 kW induction motor, 4-pole', J: 0.04, nMax: 3000, n0: 1450, brg: [[0.040, 1500], [0.035, 600]], grease: 0.03, lip: 0.12, shield: 0.004, fanW: 60, brush: 0, iron: 0, cog: 0, cogN: 1 },
    dc: { name: '24 V, 100 W brushed PM motor', J: 6e-5, nMax: 4500, n0: 4000, brg: [[0.008, 30], [0.008, 20]], grease: 0.0006, lip: 0.008, shield: 0.0003, fanW: 1.2, brush: 0.0024, iron: 0.004, cog: 0.006, cogN: 14 }
  };
  Hyper.sim('rw-friction', {
    title: 'Where the friction is',
    blurb: `A shaft in its two bearings with a seal and a fan (an induction motor), or a small brushed magnet motor with brushes on a commutator and cogging from its slots. The graph on the left splits the friction torque into its parts against speed; the one on the right is a coast-down: switch off and let friction alone stop the rotor. Each part of the drawing glows with the power it wastes.

**Try this**
- On the induction motor, slide the speed from 0 to 3000 rpm: the bearings and seal give a nearly constant torque, the fan's torque grows as speed² — at 1450 rpm it already takes the largest share.
- Choose a lip seal, then a shield: tens of watts disappear.
- Set the grease to −20 °C: the viscous drag multiplies, and the breakaway torque with it. Try *over-greased* and *dry*.
- Double the bearing load (an over-tight belt) or tick misalignment.
- Press *Coast down*: the speed falls fast at first (fan) and then almost linearly (constant friction). On the magnet motor watch the rotor stop in a cogging detent and rock there.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 200 });
      const [g1, g2] = graphs(box, 2);
      let V = null, m = FRI.im, w = 0, th = 0, coasting = false, tc = 0, trace = [], cdTime = null, lastPlot = -1, tReal = 0, vis = 0;
      const ctl = kit.controls(box.side, [
        { id: 'motor', type: 'select', label: 'Motor', options: Object.entries(FRI).map(([k, p]) => [p.name, k]), value: 'im' },
        { id: 'n', label: 'Speed', min: 0, max: 4500, step: 10, value: 1450, unit: 'rpm' },
        { id: 'seal', type: 'select', label: 'Shaft seal', options: [['Contact lip seal', 'lip'], ['Shield (non-contact)', 'shield'], ['None', 'none']], value: 'lip' },
        { id: 'lube', type: 'select', label: 'Lubrication', options: [['Good', 'good'], ['Over-greased', 'over'], ['Dry, aged grease', 'dry']], value: 'good' },
        { id: 'T', label: 'Grease temperature', min: -20, max: 90, step: 1, value: 40, unit: '°C' },
        { id: 'loadf', label: 'Bearing load (% of normal)', min: 50, max: 300, step: 10, value: 100, unit: '%' },
        { id: 'mis', type: 'check', label: 'Misaligned coupling', value: false },
        { type: 'buttons', items: [{ id: 'coast', label: 'Coast down', primary: true }, { id: 'run', label: 'Run again' }] }
      ], id => {
        if (id === 'motor') { m = FRI[V.motor]; ctl.set('n', m.n0); w = m.n0 * TAU / 60; coasting = false; trace = []; cdTime = null; }
        if (id === 'coast') { w = Math.min(V.n, m.nMax) * TAU / 60; coasting = true; tc = 0; trace = [[0, Math.min(V.n, m.nMax)]]; cdTime = null; }
        if (id === 'run') { coasting = false; }
        lastPlot = -1;
      });
      V = ctl.values; w = m.n0 * TAU / 60;
      const ro = kit.readout(box.side, [['n', 'Speed'], ['T', 'Friction torque'], ['P', 'Friction power'], ['brk', 'Breakaway torque (at rest)'], ['E', 'Energy a year (8000 h)'], ['cd', 'Coast-down time']]);
      const p1 = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0 }, y: { label: 'friction torque (N·m)', min: 0 }, legend: true }, 200);
      const p2 = kit.plot(g2, { x: { label: 'time (s)', min: 0 }, y: { label: 'speed (rpm)', min: 0 }, legend: true }, 200);
      // the parts of the friction torque at angular speed ww (rad/s)
      const parts = ww => {
        const w0 = m.n0 * TAU / 60, a = Math.abs(ww), lf = V.loadf / 100 * (V.mis ? 1.8 : 1), mis = V.mis ? 1.3 : 1;
        const lubC = V.lube === 'dry' ? 3 : V.lube === 'over' ? 1.2 : 1, lubV = V.lube === 'dry' ? 0.3 : V.lube === 'over' ? 4 : 1;
        const brg = m.brg.reduce((s, [d, F], i) => s + 0.5 * 0.0015 * F * (i === 0 ? lf : 1 + 0.3 * (lf - 1)) * d, 0) * lubC * mis;
        const grease = m.grease * lubV * Math.pow(2, (40 - V.T) / 15) * a / w0;
        const seal = V.seal === 'lip' ? m.lip * (V.lube === 'dry' ? 1.3 : 1) : V.seal === 'shield' ? m.shield : 0;
        const fan = m.fanW / w0 * Math.pow(a / w0, 2), iron = m.iron * (0.5 + 0.5 * a / w0);
        return { brg, grease, seal, brush: m.brush, iron: m.iron ? iron : 0, fan };
      };
      const coulomb = () => { const p = parts(0); return p.brg + p.seal + p.brush + (m.iron ? 0.5 * m.iron : 0); };
      const total = p => p.brg + p.grease + p.seal + p.brush + p.iron + p.fan;
      const step = (h, tcog) => {
        const Tc = coulomb();
        if (w === 0) { if (Math.abs(tcog) > 1.3 * Tc) w += h * (tcog - Math.sign(tcog) * Tc) / m.J; }
        else { const Tf = total(parts(w)), wn = w + h * (tcog - Math.sign(w) * Tf) / m.J; w = wn * w < 0 ? 0 : wn; }
        th += w * h;
      };
      const predict = () => {  // the coast-down without cogging, for comparison
        let ww = Math.min(V.n, m.nMax) * TAU / 60, t = 0; const pts = [[0, ww * 60 / TAU]], h = m.J > 0.001 ? 0.01 : 0.0005;
        for (let k = 0; k < 40000 && ww > 0; k++) { const Tf = total(parts(ww)); ww = Math.max(0, ww - h * Tf / m.J); t += h; if (k % 20 === 0 || ww === 0) pts.push([t, ww * 60 / TAU]); }
        return { pts, t };
      };
      let pred = predict();
      const loop = kit.loop(dt => {
        tReal += dt;
        if (!coasting) { w = Math.min(V.n, m.nMax) * TAU / 60; th += w * dt; }
        else {
          const h = m.J > 0.001 ? 0.002 : 0.0002, n = Math.round(dt / h);
          for (let k = 0; k < n; k++) step(h, -m.cog * Math.sin(m.cogN * th));
          tc += dt;
          if (tc - (trace.length ? trace[trace.length - 1][0] : 0) > 0.02) trace.push([tc, w * 60 / TAU]);
          if (cdTime == null && w === 0) cdTime = tc;
          if (trace.length > 3000) trace.shift();
        }
        const p = parts(w), Tt = total(p), rpmNow = w * 60 / TAU, P = Tt * Math.abs(w);
        ro.set('n', rpmNow.toFixed(0) + ' rpm' + (coasting ? ' (coasting)' : ''));
        ro.set('T', (Tt < 0.1 ? (1000 * Tt).toFixed(1) + ' mN·m' : Tt.toFixed(3) + ' N·m'));
        ro.set('P', P.toFixed(P < 10 ? 2 : 0) + ' W');
        const Tb = 1.3 * coulomb() + m.cog;
        ro.set('brk', Tb < 0.1 ? (1000 * Tb).toFixed(1) + ' mN·m' : Tb.toFixed(3) + ' N·m');
        ro.set('E', (P * 8000 / 1000).toFixed(P * 8 < 10 ? 1 : 0) + ' kWh');
        ro.set('cd', cdTime != null ? cdTime.toFixed(2) + ' s' : coasting ? tc.toFixed(1) + ' s …' : 'model: ' + pred.t.toFixed(2) + ' s');
        if (tReal - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = tReal; pred = predict();
          const C = kit.colors(), N = 60, names = [['brg', 'bearings'], ['grease', 'grease (viscous)'], ['seal', 'seal'], ['brush', 'brushes'], ['iron', 'iron-loss drag'], ['fan', 'fan'], ['tot', 'total']];
          const ser = {}; names.forEach(([k]) => { ser[k] = []; });
          for (let i = 0; i <= N; i++) { const nn = m.nMax * i / N, pp = parts(nn * TAU / 60); names.forEach(([k]) => ser[k].push([nn, k === 'tot' ? total(pp) : pp[k]])); }
          const series = names.filter(([k]) => k === 'tot' || ser[k].some(q => q[1] > 0)).map(([k, lab], i) => ({ pts: ser[k], label: lab, color: k === 'tot' ? C.text : C.series[i % 7], dash: k === 'tot' ? undefined : [4, 3] }));
          p1.set({ x: { label: 'speed (rpm)', min: 0, max: m.nMax }, series, marks: [{ x: rpmNow, y: Tt, label: 'now' }] });
          p2.set({ series: [{ pts: pred.pts, label: 'model (no cogging)', color: C.muted, dash: [5, 4] }, { pts: trace.slice(), label: 'coast-down' }] });
        }
        // drawing: shaft, seal, two bearings, fan or commutator; each part glows with its power
        const C = kit.colors(), c = view(st, 660, 220), total0 = Math.max(1e-9, Tt), glow = v => heatCol(clamp(v / total0 * 1.6, 0, 1), 0.25 + 0.6 * clamp(v / total0 * 1.6, 0, 1));
        vis += w * dt / (m.J > 0.001 ? 20 : 60);
        c.strokeStyle = C.text; c.lineWidth = 10; c.beginPath(); c.moveTo(60, 110); c.lineTo(600, 110); c.stroke();
        c.strokeStyle = C.bg2; c.lineWidth = 3; for (let k = 0; k < 6; k++) { const xx = 70 + ((vis * 40 + k * 90) % 530 + 530) % 530; c.beginPath(); c.moveTo(xx, 106); c.lineTo(xx, 114); c.stroke(); }
        const pw = v => (v * Math.abs(w)).toFixed(v * Math.abs(w) < 10 ? 1 : 0) + ' W';
        const bearing = (x, v, lab) => {
          c.fillStyle = glow(v); c.fillRect(x - 32, 70, 64, 80);
          c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(x - 32, 70, 64, 18); c.strokeRect(x - 32, 132, 64, 18);
          for (let k = 0; k < 4; k++) { const xx = x - 24 + ((k * 16 + vis * 8) % 64 + 64) % 64 * 0.75; c.fillStyle = C.muted; c.beginPath(); c.arc(xx, 94, 5, 0, TAU); c.fill(); c.beginPath(); c.arc(xx, 126, 5, 0, TAU); c.fill(); }
          text(c, lab, x, 62, { size: 11, color: C.muted }); text(c, pw(v), x, 168, { size: 12, weight: 600 });
        };
        const pb = parts(w), share = pb.brg / 2;
        if (V.seal !== 'none') { c.fillStyle = glow(pb.seal); c.fillRect(110, 96, 18, 28); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(110, 96, 18, 28); text(c, 'seal', 119, 88, { size: 11, color: C.muted }); text(c, pw(pb.seal), 119, 142, { size: 12, weight: 600 }); }
        bearing(200, share + pb.grease / 2, 'bearing (DE)');
        bearing(400, share + pb.grease / 2, 'bearing (NDE)');
        if (m.brush) {
          c.fillStyle = C.surface2; c.fillRect(470, 92, 50, 36); c.strokeStyle = C.text; c.strokeRect(470, 92, 50, 36);
          c.strokeStyle = C.muted; for (let k = 0; k < 5; k++) { const xx = 470 + ((k * 10 + vis * 20) % 50 + 50) % 50; c.beginPath(); c.moveTo(xx, 92); c.lineTo(xx, 128); c.stroke(); }
          c.fillStyle = glow(pb.brush); c.fillRect(485, 70, 20, 22); c.fillRect(485, 128, 20, 22);
          text(c, 'brushes', 495, 62, { size: 11, color: C.muted }); text(c, pw(pb.brush), 495, 168, { size: 12, weight: 600 });
          text(c, 'iron drag ' + pw(pb.iron) + ', cogging ' + (1000 * m.cog).toFixed(0) + ' mN·m × ' + m.cogN + ' per turn', 300, 200, { size: 12, color: C.muted });
        }
        c.save(); c.translate(560, 110); c.strokeStyle = glow(pb.fan); c.lineWidth = 6;
        for (let k = 0; k < 6; k++) { const a = vis + k * Math.PI / 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 48 * Math.sin(a)); c.stroke(); }
        c.restore(); text(c, 'fan', 560, 52, { size: 11, color: C.muted }); text(c, pw(pb.fan), 560, 178, { size: 12, weight: 600 });
        text(c, 'total ' + (Tt * Math.abs(w)).toFixed(1) + ' W at ' + rpmNow.toFixed(0) + ' rpm', 300, 30, { size: 14, weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rw-noise */
  // octave bands, A-weighting (IEC 61672-1 values at the band centres), and a 7.5 kW TEFC motor's four noise sources, each
  // given as an A-weighted sound power and a spectral shape: fan (∝ 50 log n), magnetic (flux, load), PWM (at the carrier),
  // bearings (speed, wear). Sound pressure at r over a reflecting floor: Lp = Lw − 10 log(2π r²).
  const BANDS = [63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  const AW = [-26.2, -16.1, -8.6, -3.2, 0, 1.2, 1.0, -1.1, -6.6];
  const dbSum = ls => { let s = 0; for (const l of ls) if (Number.isFinite(l)) s += Math.pow(10, l / 10); return s > 0 ? 10 * Math.log10(s) : -Infinity; };
  const shaped = (LA, shape) => { const off = LA - dbSum(shape.map((s, i) => s + AW[i])); return shape.map(s => s + off); };   // unweighted band levels
  const SHAPE = {
    fan: [-14, -9, -5, -3, -3, -5, -9, -14, -20],
    mag: [-22, -4, -12, -5, -3, -7, -15, -24, -30],
    brg: [-32, -28, -22, -14, -7, -3, -3, -6, -12]
  };
  const bandOf = f => { let b = 0; for (let i = 0; i < BANDS.length; i++) if (Math.abs(Math.log2(f / BANDS[i])) < Math.abs(Math.log2(f / BANDS[b]))) b = i; return b; };
  Hyper.sim('rw-noise', {
    title: 'What makes a motor loud',
    blurb: `A 7.5 kW TEFC induction motor on the mains or on a VFD, heard from a distance above a hard floor. The bars are the A-weighted sound pressure in each octave band, coloured by source; the thin outline is the unweighted level. The graph shows each source's contribution, in dB(A), across the drive's frequency range.

**Try this**
- On the mains, compare a 4-pole and a 2-pole motor: the fan roars about 8 dB(A) louder at twice the speed.
- Switch to the VFD with a 2 kHz carrier: a whine appears in the 2 kHz band and dominates the total. Step the carrier up to 16 kHz: A-weighting and the ear let it fade away.
- On the VFD, sweep the frequency from 25 to 100 Hz: the fan grows about 15 dB(A) per doubling of speed while the magnetic hum falls above 50 Hz as the field weakens.
- Choose *worn* bearings and a low speed: the high bands rise.
- Double the distance (−6 dB), or close an enclosure: low frequencies escape, high ones are stopped.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230 });
      const [g1] = graphs(box, 1);
      let V = null, lastKey = '', ang = 0, tReal = 0;
      const ctl = kit.controls(box.side, [
        { id: 'poles', type: 'select', label: 'Motor', options: [['7.5 kW, 4-pole (1450 rpm at 50 Hz)', 4], ['7.5 kW, 2-pole (2900 rpm at 50 Hz)', 2]], value: 4 },
        { id: 'supply', type: 'select', label: 'Supply', options: [['Mains, 50 Hz sine', 'mains'], ['VFD (PWM inverter)', 'vfd']], value: 'mains' },
        { id: 'f', label: 'VFD output frequency', min: 5, max: 100, step: 1, value: 50, unit: 'Hz' },
        { id: 'fsw', type: 'select', label: 'VFD switching (carrier) frequency', options: [['2 kHz', 2000], ['4 kHz', 4000], ['8 kHz', 8000], ['16 kHz', 16000]], value: 4000 },
        { id: 'rnd', type: 'check', label: 'Random (spread-spectrum) PWM', value: false },
        { id: 'load', label: 'Load', min: 0, max: 100, step: 5, value: 75, unit: '%' },
        { id: 'brg', type: 'select', label: 'Bearings', options: [['Good', 'good'], ['Worn / dry', 'worn']], value: 'good' },
        { id: 'r', label: 'Distance to the listener', min: 0.5, max: 20, step: 0.1, value: 1, unit: 'm', log: true },
        { id: 'encl', type: 'check', label: 'Acoustic enclosure', value: false }
      ], id => { if (id === 'supply') { ctl.show('f', V.supply === 'vfd'); ctl.show('fsw', V.supply === 'vfd'); ctl.show('rnd', V.supply === 'vfd'); } lastKey = ''; });
      V = ctl.values; ctl.show('f', false); ctl.show('fsw', false); ctl.show('rnd', false);
      const ro = kit.readout(box.side, [['n', 'Speed'], ['LA', 'Sound level at the listener'], ['Lz', 'Unweighted level'], ['src', 'Fan · magnetic · PWM · bearings'], ['dom', 'Loudest source'], ['exp', 'If heard all day']]);
      const p1 = kit.plot(g1, { x: { label: 'supply frequency (Hz)', min: 5, max: 100 }, y: { label: 'sound level at the listener (dB(A))' }, legend: true }, 200);
      const ENC = [2, 4, 8, 15, 18, 20, 22, 24, 25];
      // band levels (unweighted sound power) of each source at supply frequency f
      const sources = (f, vfd) => {
        const p = V.poles, n = 120 * f / p * 0.97, flux = f > 50 ? 50 / f : 1, x = V.load / 100;
        const fanRef = p === 2 ? [2900, 74] : [1450, 66];
        const out = {
          fan: n > 30 ? shaped(fanRef[1] + 50 * Math.log10(n / fanRef[0]), SHAPE.fan) : SHAPE.fan.map(() => -Infinity),
          mag: shaped(60 + 20 * Math.log10(flux) + 3 * x, SHAPE.mag),
          brg: n > 30 ? shaped(52 + 30 * Math.log10(n / 1450) + (V.brg === 'worn' ? 14 : 0), SHAPE.brg) : SHAPE.brg.map(() => -Infinity),
          pwm: BANDS.map(() => -Infinity)
        };
        if (vfd) {
          const L0 = { 2000: 80, 4000: 74, 8000: 66, 16000: 58 }[V.fsw] + 20 * Math.log10(flux) + 2 * x, b = bandOf(V.fsw), b2 = bandOf(2 * V.fsw);
          if (V.rnd) { for (const d of [-1, 0, 1]) if (b + d >= 0 && b + d < BANDS.length) out.pwm[b + d] = L0 - 4.8; }
          else { out.pwm[b] = L0; if (b2 !== b) out.pwm[b2] = L0 - 8; }
        }
        if (V.encl) for (const k in out) out[k] = out[k].map((l, i) => l - ENC[i]);
        return out;
      };
      const atListener = Lw => Lw - 10 * Math.log10(TAU * V.r * V.r);
      let cur = null;
      const loop = kit.loop(dt => {
        tReal += dt;
        const vfd = V.supply === 'vfd', f = vfd ? V.f : 50, n = 120 * f / V.poles * 0.97;
        const key = [V.poles, V.supply, f, V.fsw, V.rnd, V.load, V.brg, V.r, V.encl].join('|');
        if (key !== lastKey) {
          lastKey = key;
          const s = sources(f, vfd), names = ['fan', 'mag', 'pwm', 'brg'];
          const bandA = BANDS.map((_, i) => atListener(dbSum(names.map(k => s[k][i]))) + AW[i]);
          const bandZ = BANDS.map((_, i) => atListener(dbSum(names.map(k => s[k][i]))));
          const perA = {}; names.forEach(k => { perA[k] = atListener(dbSum(s[k].map((l, i) => l + AW[i]))); });
          cur = { s, bandA, bandZ, perA, LA: dbSum(bandA), LZ: dbSum(bandZ) };
          const lines = { fan: [], mag: [], pwm: [], brg: [], tot: [] };
          for (let ff = 5; ff <= 100; ff += 2.5) {
            const ss = sources(ff, vfd); let tot = [];
            names.forEach(k => { const L = atListener(dbSum(ss[k].map((l, i) => l + AW[i]))); if (Number.isFinite(L)) lines[k].push([ff, L]); tot.push(L); });
            lines.tot.push([ff, dbSum(tot)]);
          }
          const C = kit.colors();
          p1.set({ series: [{ pts: lines.tot, label: 'total', color: C.text }, { pts: lines.fan, label: 'fan', color: C.series[0], dash: [4, 3] }, { pts: lines.mag, label: 'magnetic', color: C.series[1], dash: [4, 3] },
            { pts: lines.pwm, label: 'PWM', color: C.series[3], dash: [4, 3] }, { pts: lines.brg, label: 'bearings', color: C.series[2], dash: [4, 3] }],
            marks: [{ x: f, y: cur.LA, label: 'now' }], vlines: [{ x: 50, label: '50 Hz' }] });
          const fmtL = L => Number.isFinite(L) ? L.toFixed(0) : '—';
          ro.set('n', n.toFixed(0) + ' rpm at ' + f.toFixed(0) + ' Hz');
          ro.set('LA', cur.LA.toFixed(1) + ' dB(A) at ' + V.r.toFixed(1) + ' m');
          ro.set('Lz', cur.LZ.toFixed(1) + ' dB');
          ro.set('src', fmtL(cur.perA.fan) + ' · ' + fmtL(cur.perA.mag) + ' · ' + fmtL(cur.perA.pwm) + ' · ' + fmtL(cur.perA.brg) + ' dB(A)');
          const dom = names.reduce((a, k) => (cur.perA[k] > cur.perA[a] ? k : a), 'fan');
          ro.set('dom', { fan: 'the cooling fan', mag: 'magnetic hum', pwm: 'PWM whine at ' + (V.fsw / 1000) + ' kHz', brg: 'the bearings' }[dom]);
          const L = cur.LA, hrs = 8 / Math.pow(2, (L - 85) / 3);
          ro.set('exp', L < 80 ? 'below the EU lower action value (80 dB(A))' : L < 85 ? 'above 80 dB(A): hearing protection available' : 'reaches the 85 dB(A) daily dose in ' + (hrs >= 1 ? hrs.toFixed(1) + ' h' : (hrs * 60).toFixed(0) + ' min'));
        }
        // drawing: the motor radiating, the listener, and the octave-band bars coloured by source
        const C = kit.colors(), c = view(st, 680, 260), cols = { fan: C.series[0], mag: C.series[1], pwm: C.series[3], brg: C.series[2] };
        ang += n * TAU / 60 * dt / 40;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(30, 110, 110, 60); c.strokeRect(30, 110, 110, 60);
        c.beginPath(); c.moveTo(140, 116); c.lineTo(165, 124); c.lineTo(165, 156); c.lineTo(140, 164); c.closePath(); c.stroke();
        c.save(); c.translate(153, 140); c.strokeStyle = C.accent; c.lineWidth = 2; for (let k = 0; k < 5; k++) { const a = ang + k * TAU / 5; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 13 * Math.sin(a)); c.stroke(); } c.restore();
        c.fillStyle = C.text; c.fillRect(10, 137, 20, 6); c.fillRect(40, 170, 16, 8); c.fillRect(114, 170, 16, 8);
        if (V.encl) { c.strokeStyle = C.muted; c.setLineDash([6, 4]); c.strokeRect(18, 92, 160, 92); c.setLineDash([]); }
        const LA = cur ? cur.LA : 60, rings = clamp(Math.round((LA - 40) / 8), 1, 7);
        c.strokeStyle = C.accent; c.lineWidth = 1.5;
        for (let k = 0; k < rings; k++) { const rr = 20 + ((tReal * 30 + k * 18) % (rings * 18)); c.globalAlpha = clamp(1 - rr / (rings * 18 + 20), 0, 1); c.beginPath(); c.arc(100, 140, 60 + rr, -0.9, 0.9); c.stroke(); }
        c.globalAlpha = 1;
        const lx = 180 + clamp(Math.log10(V.r / 0.5) / Math.log10(40), 0, 1) * 40;
        c.fillStyle = C.text; c.beginPath(); c.arc(lx, 118, 7, 0, TAU); c.fill(); c.fillRect(lx - 4, 126, 8, 30);
        text(c, V.r.toFixed(1) + ' m', lx, 176, { size: 11, color: C.muted });
        c.fillStyle = C.bg; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(30, 20, 150, 50); c.strokeRect(30, 20, 150, 50);
        text(c, (cur ? cur.LA.toFixed(1) : '—') + ' dB(A)', 105, 52, { size: 20, weight: 700, color: LA >= 85 ? C.bad : LA >= 80 ? C.warn : C.text });
        text(c, 'sound level meter, A-weighted', 105, 86, { size: 10, color: C.muted });
        // bars
        const bx = 250, bw = 44, by = 220, sy = 2.1, top = 100;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let L = 0; L <= top; L += 20) { const y = by - L * sy; c.beginPath(); c.moveTo(bx - 6, y); c.lineTo(bx + BANDS.length * bw, y); c.stroke(); text(c, String(L), bx - 18, y + 4, { size: 10, color: C.muted }); }
        if (cur) {
          BANDS.forEach((fb, i) => {
            const x = bx + i * bw + 5, LAi = Math.max(0, cur.bandA[i]), ptot = Math.pow(10, cur.bandA[i] / 10);
            let y = by;
            ['fan', 'mag', 'pwm', 'brg'].forEach(k => {
              const Lk = atListener(cur.s[k][i]) + AW[i], share = Number.isFinite(Lk) && ptot > 0 ? Math.pow(10, Lk / 10) / ptot : 0, hgt = LAi * sy * share;
              c.fillStyle = cols[k]; c.fillRect(x, y - hgt, bw - 10, hgt); y -= hgt;
            });
            const hz = Math.max(0, cur.bandZ[i]) * sy; c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(x - 1, by - hz, bw - 8, hz);
            text(c, fb >= 1000 ? fb / 1000 + 'k' : String(fb), x + (bw - 10) / 2, by + 14, { size: 10, color: C.muted });
          });
        }
        text(c, 'octave band (Hz); bars dB(A), outline unweighted', bx + BANDS.length * bw / 2, by + 32, { size: 11, color: C.muted });
        [['fan', 'fan'], ['mag', 'magnetic'], ['pwm', 'PWM'], ['brg', 'bearings']].forEach(([k, lab], i) => { c.fillStyle = cols[k]; c.fillRect(bx + i * 100, 12, 12, 12); text(c, lab, bx + i * 100 + 18, 22, { size: 11, align: 'left' }); });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rw-vibration */
  // a motor on its mounts as a one-degree-of-freedom system; each exciting harmonic answers with
  // X = (F/k) / √((1 − r²)² + (2ζr)²); velocity v = 2π f X; overall RMS = √(Σ v²/2) plus a small residual floor.
  const MOUNTS = {
    rigid: { name: 'Rigid concrete base (f_n ≈ 100 Hz)', fn: 100, m: 15, zones: [1.4, 2.8, 4.5], found: 'rigid' },
    weak: { name: 'Weak steel baseplate (f_n ≈ 40 Hz)', fn: 40, m: 15, zones: [1.4, 2.8, 4.5], found: 'rigid' },
    soft: { name: 'Anti-vibration mounts (f_n ≈ 12 Hz)', fn: 12, m: 60, zones: [2.3, 4.5, 7.1], found: 'flexible' }
  };
  Hyper.sim('rw-vibration', {
    title: 'A motor on its mounts',
    blurb: `A 4-pole motor on a VFD, sitting on its mounts. Its rotor carries an unbalance (the dot); you can add misalignment, looseness or an uneven air gap. Each fault shakes at its own frequency; the mounts answer each one according to how close it is to their natural frequency. Left graph: the vibration spectrum (velocity at each frequency). Right graph: the overall RMS velocity against speed — a run-up curve — with the ISO 20816-3 zone boundaries for machines of 15–300 kW.

**Try this**
- With unbalance only, sweep the speed: the force grows as speed², so the vibration climbs steeply — the single line in the spectrum sits at 1×.
- Choose the weak baseplate and run through 2400 rpm (40 Hz): resonance. Add damping and watch the peak fall. On a VFD you would set a skip frequency here.
- On anti-vibration mounts the motor moves more (zones for flexible foundations apply) but the force reaching the floor drops far below the unbalance force.
- Add misalignment (2× appears), looseness (a comb of harmonics and ½×) or an uneven air gap (a line at twice line frequency, 4× speed on a 4-pole motor). Tick *Power off*: the electrical line vanishes at once, the mechanical ones stay.
- Press *Balance*: the unbalance falls to a G 2.5 level.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 220 });
      const [g1, g2] = graphs(box, 2);
      let V = null, ang = 0, tt = 0, lastKey = '', comps = [], vr = 0;
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Speed', min: 0, max: 3000, step: 10, value: 1480, unit: 'rpm' },
        { id: 'mount', type: 'select', label: 'Mounting', options: Object.entries(MOUNTS).map(([k, p]) => [p.name, k]), value: 'rigid' },
        { id: 'U', label: 'Unbalance', min: 0, max: 6000, step: 50, value: 2000, unit: 'g·mm' },
        { id: 'zeta', label: 'Damping ratio', min: 0.02, max: 0.3, step: 0.01, value: 0.05 },
        { id: 'mis', label: 'Coupling misalignment', min: 0, max: 0.5, step: 0.01, value: 0, unit: 'mm' },
        { id: 'loose', type: 'check', label: 'Loose foot bolt (looseness)', value: false },
        { id: 'ecc', type: 'check', label: 'Uneven air gap (electrical)', value: false },
        { id: 'off', type: 'check', label: 'Power off (coasting through this speed)', value: false },
        { type: 'buttons', items: [{ id: 'bal', label: 'Balance to G 2.5', primary: true }] }
      ], id => { if (id === 'bal') ctl.set('U', 160); lastKey = ''; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed · 1× frequency'], ['v', 'Overall velocity (RMS)'], ['x', 'Displacement (peak to peak)'], ['F1', 'Unbalance force'], ['FT', 'Force into the floor'], ['fn', 'Natural frequency · speed ratio']]);
      const p1 = kit.plot(g1, { x: { label: 'frequency (Hz)', min: 0, max: 220 }, y: { label: 'velocity (mm/s RMS)', min: 0 }, legend: false }, 200);
      const p2 = kit.plot(g2, { x: { label: 'speed (rpm)', min: 0, max: 3000 }, y: { label: 'overall velocity (mm/s RMS)', min: 0 }, legend: true }, 200);
      // the exciting harmonics at speed n: [label, frequency Hz, force amplitude N]
      const excite = n => {
        const f1 = n / 60, w = TAU * f1, F1 = V.U * 1e-6 * w * w, Fm = 2500 * V.mis * Math.pow(Math.min(1, f1 / 25), 2), out = [];
        if (f1 <= 0) return out;
        out.push(['1×', f1, Math.hypot(F1, 0.4 * Fm)]);
        if (Fm > 0) out.push(['2×', 2 * f1, Fm]);
        if (V.loose) { const Fb = Math.max(F1, 25); [[0.5, 0.3], [2, 0.6], [3, 0.5], [4, 0.4], [5, 0.3], [6, 0.25]].forEach(([k, a]) => out.push([k === 0.5 ? '½×' : k + '×', k * f1, a * Fb])); }
        if (V.ecc && !V.off) out.push(['2×LF', 2 * (2 * f1 / 0.98), 120]);
        return out;
      };
      const respond = (n, mt) => {
        const k = mt.m * Math.pow(TAU * mt.fn, 2);
        return excite(n).map(([lab, f, F]) => {
          const r = f / mt.fn, den = Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(2 * V.zeta * r, 2)), X = F / k / den;
          return { lab, f, F, X, v: TAU * f * X * 1000 / Math.SQRT2, FT: F * Math.sqrt(1 + Math.pow(2 * V.zeta * r, 2)) / den };
        });
      };
      const overall = cs => Math.sqrt(0.3 * 0.3 + cs.reduce((s, q) => s + q.v * q.v, 0));
      const loop = kit.loop(dt => {
        tt += dt;
        const mt = MOUNTS[V.mount], key = [V.n, V.mount, V.U, V.zeta, V.mis, V.loose, V.ecc, V.off].join('|');
        if (key !== lastKey) {
          lastKey = key; comps = respond(V.n, mt); vr = overall(comps);
          const C = kit.colors(), spec = [], run = [];
          comps.forEach(q => { spec.push([q.f - 0.01, 0], [q.f, q.v], [q.f + 0.01, 0]); });
          for (let nn = 0; nn <= 3000; nn += 15) run.push([nn, overall(respond(nn, mt))]);
          const Z = mt.zones;
          p1.set({ x: { label: 'frequency (Hz)', min: 0, max: Math.max(120, 1.15 * Math.max(0, ...comps.map(q => q.f))) }, series: [{ pts: spec, label: 'spectrum' }], marks: comps.map(q => ({ x: q.f, y: q.v, label: q.lab })) });
          p2.set({ series: [{ pts: run, label: 'run-up at these settings' }], marks: [{ x: V.n, y: vr, label: 'now' }],
            hlines: [{ y: Z[0], label: 'A/B' }, { y: Z[1], label: 'B/C' }, { y: Z[2], label: 'C/D' }], vlines: [{ x: mt.fn * 60, label: 'f_n' }] });
          const zone = vr <= Z[0] ? 'A' : vr <= Z[1] ? 'B' : vr <= Z[2] ? 'C' : 'D';
          const xpp = 2e6 * Math.sqrt(comps.reduce((s, q) => s + q.X * q.X, 0));
          const u = comps.find(q => q.lab === '1×');
          ro.set('n', V.n.toFixed(0) + ' rpm · ' + (V.n / 60).toFixed(1) + ' Hz');
          ro.set('v', vr.toFixed(2) + ' mm/s — zone ' + zone + ' (' + mt.found + ' foundation)');
          ro.set('x', xpp.toFixed(1) + ' µm (all lines added)');
          ro.set('F1', (u ? u.F : 0).toFixed(0) + ' N at 1×');
          ro.set('FT', Math.sqrt(comps.reduce((s, q) => s + q.FT * q.FT, 0)).toFixed(0) + ' N (all lines)');
          ro.set('fn', mt.fn + ' Hz = ' + (mt.fn * 60).toFixed(0) + ' rpm · r = ' + (V.n / 60 / mt.fn).toFixed(2));
        }
        // drawing: the motor bouncing (displacement exaggerated), the rotating heavy spot and its force, and the velocity trace
        const C = kit.colors(), c = view(st, 680, 250);
        ang += V.n / 60 * TAU * dt / 30;
        let xNow = 0; comps.forEach(q => { xNow += q.X * Math.sin(TAU * q.f * tt / 30 + (q.lab === '1×' ? 0 : 1)); });
        const pxPerM = 20 / 50e-6, dy = clamp(xNow * pxPerM, -30, 30), zc = vr <= mt.zones[0] ? C.ok : vr <= mt.zones[1] ? C.accent : vr <= mt.zones[2] ? C.warn : C.bad;
        c.fillStyle = C.faint; c.fillRect(20, 200, 300, 12);
        for (const fx of [70, 250]) {
          if (V.mount === 'soft') { c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(fx, 200); for (let j = 1; j <= 8; j++) c.lineTo(fx + (j % 2 ? 8 : -8), 200 - j * (38 + dy) / 8); c.stroke(); }
          else { c.fillStyle = V.mount === 'weak' ? C.muted : C.text; c.fillRect(fx - 12, 162 + dy, 24, 38 - dy); }
        }
        c.save(); c.translate(0, dy);
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(40, 60, 240, 100); c.strokeRect(40, 60, 240, 100);
        c.fillStyle = C.text; c.fillRect(280, 105, 60, 10);
        c.fillStyle = C.bg2; c.beginPath(); c.arc(160, 110, 38, 0, TAU); c.fill(); c.strokeStyle = C.muted; c.stroke();
        const hx = 160 + 28 * Math.cos(ang), hy = 110 + 28 * Math.sin(ang);
        c.fillStyle = C.bad; c.beginPath(); c.arc(hx, hy, 6, 0, TAU); c.fill();
        const u = comps.find(q => q.lab === '1×'), Fl = u ? clamp(Math.sqrt(u.F) * 3, 0, 60) : 0;
        if (Fl > 3) kit.arrow(c, hx, hy, hx + Fl * Math.cos(ang), hy + Fl * Math.sin(ang), C.bad, 2);
        if (V.mis > 0) { c.strokeStyle = C.warn; c.lineWidth = 3; c.beginPath(); c.moveTo(340, 110); c.lineTo(370, 110 + 40 * V.mis); c.stroke(); text(c, 'offset', 360, 95, { size: 10, color: C.warn }); }
        c.restore();
        text(c, 'motion drawn ' + (pxPerM * 1e-6).toFixed(1) + ' px per µm, 30 × slower', 170, 236, { size: 10, color: C.muted });
        // velocity trace over 4 revolutions
        const tx = 400, tw = 260, ty = 110, T4 = V.n > 0 ? 4 * 60 / V.n : 0.2;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(tx, 40, tw, 140); c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx + tw, ty); c.stroke();
        const vmax = Math.max(1, ...comps.map(q => q.v * Math.SQRT2)) * 1.5;
        c.strokeStyle = zc; c.lineWidth = 1.5; c.beginPath();
        for (let i = 0; i <= 200; i++) { const t = T4 * i / 200; let v = 0; comps.forEach(q => { v += q.v * Math.SQRT2 * Math.cos(TAU * q.f * t + (q.lab === '1×' ? 0 : 1)); }); const y = ty - clamp(v / vmax, -1, 1) * 65; i ? c.lineTo(tx + tw * i / 200, y) : c.moveTo(tx, y); }
        c.stroke();
        text(c, 'velocity over 4 revolutions', tx + tw / 2, 32, { size: 11, color: C.muted });
        c.fillStyle = zc; c.fillRect(tx, 196, tw, 26);
        text(c, vr.toFixed(2) + ' mm/s RMS — ISO zone ' + (vr <= mt.zones[0] ? 'A' : vr <= mt.zones[1] ? 'B' : vr <= mt.zones[2] ? 'C' : 'D'), tx + tw / 2, 214, { size: 13, weight: 700, color: C.bg });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rw-bearing */
  // defect frequencies of a deep-groove ball bearing (contact angle 0); an idealised acceleration signal: every ball
  // passing a defect rings the housing at a 3 kHz resonance; the envelope spectrum shows the repetition rates.
  const BRG = {
    small: { name: '25 mm bore: 9 balls of 7.9 mm, 39 mm pitch circle (C ≈ 14 kN)', N: 9, d: 7.94, D: 39.0, C: 14 },
    large: { name: '40 mm bore: 8 balls of 15.1 mm, 65 mm pitch circle (C ≈ 41 kN)', N: 8, d: 15.08, D: 65.0, C: 41 }
  };
  const rng = seed => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 - 0.5; }; };
  Hyper.sim('rw-bearing', {
    title: 'A bearing with a defect',
    blurb: `A deep-groove ball bearing seen from the side: the inner ring turns with the shaft, the balls and cage go round at a little under half speed, and the load presses them into the bottom of the outer race (the load zone). Choose a defect: each time a ball meets it, the housing rings like a struck bell (a 3 kHz resonance). The trace is an idealised acceleration signal; the graph is its **envelope spectrum** — the repetition rates of the impacts, which is how analysts find bearing faults.

**Try this**
- *Outer race*: evenly spaced impacts at BPFO and a comb of harmonics — not a whole multiple of the speed.
- *Inner race*: the defect turns with the shaft through the load zone, so the impacts swell and fade once per revolution: lines at BPFI with sidebands at ± the shaft frequency.
- *Ball* defect: lines at twice the ball-spin frequency, modulated by the cage.
- *Fluting* (VFD bearing currents): a washboard across the outer race — strong BPFO harmonics and a raised floor. *Dry* grease: no lines, just a noisy floor.
- Raise the load or the temperature and watch the L10 life and the grease life fall.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230 });
      const [g1, g2] = graphs(box, 2);
      let V = null, lastKey = '', sig = [], lines = [], F = null, tv = 0, flash = 0;
      const ctl = kit.controls(box.side, [
        { id: 'geo', type: 'select', label: 'Bearing', options: Object.entries(BRG).map(([k, p]) => [p.name, k]), value: 'small' },
        { id: 'n', label: 'Shaft speed', min: 300, max: 3600, step: 10, value: 1480, unit: 'rpm' },
        { id: 'fault', type: 'select', label: 'Condition', options: [['Healthy', 'none'], ['Outer-race defect', 'outer'], ['Inner-race defect', 'inner'], ['Ball defect', 'ball'], ['Cage damage', 'cage'], ['Fluting (bearing currents)', 'flute'], ['Dry, aged grease', 'dry']], value: 'outer' },
        { id: 'sev', label: 'Severity', min: 0.1, max: 1, step: 0.05, value: 0.5 },
        { id: 'P', label: 'Radial load', min: 0.2, max: 10, step: 0.1, value: 1.5, unit: 'kN', log: true },
        { id: 'T', label: 'Bearing temperature', min: 40, max: 110, step: 1, value: 70, unit: '°C' }
      ], () => { lastKey = ''; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['fr', 'Shaft frequency f_r'], ['o', 'BPFO · BPFI'], ['b', 'BSF · FTF'], ['L', 'L10 rating life'], ['g', 'Grease life (rule of thumb)'], ['see', 'What the analyst sees']]);
      const p1 = kit.plot(g1, { x: { label: 'frequency (Hz)', min: 0 }, y: { label: 'envelope amplitude (g)', min: 0 }, legend: false }, 200);
      const p2 = kit.plot(g2, { x: { label: 'radial load (kN)', min: 0.2, max: 10, log: true }, y: { label: 'L10 life (h)', log: true }, legend: true }, 200);
      const TW = 0.06, NS = 1500, FRES = 3000, TAUR = 0.0006;
      const build = () => {
        const b = BRG[V.geo], fr = V.n / 60, q = b.d / b.D;
        F = { fr, bpfo: b.N / 2 * fr * (1 - q), bpfi: b.N / 2 * fr * (1 + q), bsf: b.D / (2 * b.d) * fr * (1 - q * q), ftf: fr / 2 * (1 - q), b };
        const s = V.sev, R = rng(7);
        lines = [[fr, 0.03, '1×']];
        const imp = [];   // [time, amplitude]
        if (V.fault === 'outer' || V.fault === 'flute') {
          const hm = V.fault === 'flute' ? 8 : 5;
          for (let k = 1; k <= hm; k++) lines.push([k * F.bpfo, s * (V.fault === 'flute' ? 0.9 : 1) / Math.sqrt(k), k === 1 ? 'BPFO' : '']);
          for (let t = 0.002; t < TW; t += 1 / F.bpfo) imp.push([t, s * (V.fault === 'flute' ? 0.8 : 1)]);
        } else if (V.fault === 'inner') {
          for (let k = 1; k <= 4; k++) { lines.push([k * F.bpfi, s * 0.8 / Math.sqrt(k), k === 1 ? 'BPFI' : '']); lines.push([k * F.bpfi - fr, s * 0.35 / Math.sqrt(k), '']); lines.push([k * F.bpfi + fr, s * 0.35 / Math.sqrt(k), '']); }
          lines.push([fr, 0.03 + 0.2 * s, '1×']);
          for (let t = 0.002; t < TW; t += 1 / F.bpfi) imp.push([t, s * (0.2 + 0.8 * Math.max(0, Math.cos(TAU * fr * t)))]);
        } else if (V.fault === 'ball') {
          for (let k = 1; k <= 3; k++) { lines.push([2 * k * F.bsf, s * 0.6 / k, k === 1 ? '2×BSF' : '']); lines.push([2 * k * F.bsf - F.ftf, s * 0.25 / k, '']); lines.push([2 * k * F.bsf + F.ftf, s * 0.25 / k, '']); }
          lines.push([F.ftf, 0.2 * s, 'FTF']);
          for (let t = 0.002; t < TW; t += 1 / (2 * F.bsf)) imp.push([t, s * 0.6 * (0.4 + 0.6 * Math.max(0, Math.cos(TAU * F.ftf * t)))]);
        } else if (V.fault === 'cage') {
          for (let k = 1; k <= 4; k++) lines.push([k * F.ftf, s * 0.5 / k, k === 1 ? 'FTF' : '']);
          for (let t = 0.002; t < TW; t += 1 / (3 * F.ftf)) imp.push([t, s * 0.25]);
        }
        const floor = V.fault === 'dry' ? 0.05 + 0.3 * s : V.fault === 'flute' ? 0.1 : 0.02;
        sig = [];
        for (let i = 0; i < NS; i++) {
          const t = TW * i / NS; let a = floor * 2 * R() * (V.fault === 'dry' ? 2 : 1);
          for (const [t0, A] of imp) { const u = t - t0; if (u >= 0 && u < 6 * TAUR) a += A * Math.exp(-u / TAUR) * Math.sin(TAU * FRES * u); }
          sig.push(a);
        }
        const fmax = Math.max(6 * F.bpfi, 2.5 * F.bpfo + 10), spec = [];
        const R2 = rng(11); for (let f = 1; f <= fmax; f += fmax / 300) spec.push([f, floor * (0.6 + 0.8 * Math.abs(R2()))]);
        for (const [f, A] of lines) if (f > 0 && f < fmax) spec.push([f - 0.3, 0], [f, A + floor], [f + 0.3, 0]);
        spec.sort((p, r) => p[0] - r[0]);
        const C = kit.colors();
        p1.set({ x: { label: 'frequency (Hz)', min: 0, max: fmax }, series: [{ pts: spec, label: 'envelope spectrum' }], marks: lines.filter(l => l[2] && l[0] < fmax).map(l => ({ x: l[0], y: l[1] + floor, label: l[2] })),
          vlines: [{ x: F.bpfo, label: 'BPFO', color: C.muted }, { x: F.bpfi, label: 'BPFI', color: C.muted }] });
        const life = [], L10 = P => Math.pow(b.C / P, 3) * 1e6 / (60 * V.n);
        for (let P = 0.2; P <= 10.001; P *= 1.1) life.push([P, L10(P)]);
        p2.set({ series: [{ pts: life, label: 'L10 at ' + V.n + ' rpm (C ≈ ' + b.C + ' kN)' }], marks: [{ x: V.P, y: L10(V.P), label: 'now' }], hlines: [{ y: 20000, label: '20 000 h' }] });
        const Lh = L10(V.P), gl = 10000 * Math.pow(2, (70 - Math.max(70, V.T)) / 15);
        ro.set('fr', fr.toFixed(2) + ' Hz (' + V.n + ' rpm)');
        ro.set('o', F.bpfo.toFixed(1) + ' Hz (' + (F.bpfo / fr).toFixed(2) + '×) · ' + F.bpfi.toFixed(1) + ' Hz (' + (F.bpfi / fr).toFixed(2) + '×)');
        ro.set('b', F.bsf.toFixed(1) + ' Hz · ' + F.ftf.toFixed(2) + ' Hz');
        ro.set('L', (Lh > 1e6 ? '> 1 000 000' : Lh.toFixed(0)) + ' h (' + (Lh / 8760).toFixed(1) + ' years continuous)');
        ro.set('g', 'about ' + gl.toFixed(0) + ' h at ' + V.T + ' °C (halves every 15 K above 70 °C)');
        ro.set('see', { none: 'a low, flat envelope spectrum', outer: 'BPFO and harmonics, evenly spaced impacts', inner: 'BPFI with ±1× sidebands, impacts swelling once a turn', ball: '2×BSF lines with cage sidebands', cage: 'low lines at the cage frequency', flute: 'strong BPFO harmonics, raised floor, a washboard race', dry: 'no defect lines — a high, noisy floor' }[V.fault]);
      };
      const loop = kit.loop(dt => {
        const key = [V.geo, V.n, V.fault, V.sev, V.P, V.T].join('|');
        if (key !== lastKey) { lastKey = key; build(); }
        const C = kit.colors(), c = view(st, 680, 250), b = F.b;
        // slow motion: the cage turns about 0.25 turns per second on screen
        const slow = 0.25 / F.ftf; tv += dt * slow;
        const cx = 140, cy = 125, Ro = 105, Ri = 58, Rp = (Ro + Ri) / 2, rb = (Ro - Ri) / 2 - 5;
        const cageA = TAU * F.ftf * tv, innerA = TAU * F.fr * tv;
        c.fillStyle = C.surface2; c.beginPath(); c.arc(cx, cy, Ro + 14, 0, TAU); c.fill();
        c.fillStyle = C.bg2; c.beginPath(); c.arc(cx, cy, Ro, 0, TAU); c.fill();
        c.fillStyle = C.surface2; c.beginPath(); c.arc(cx, cy, Ri, 0, TAU); c.fill();
        c.fillStyle = C.bg2; c.beginPath(); c.arc(cx, cy, Ri - 16, 0, TAU); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1.5; [Ro + 14, Ro, Ri, Ri - 16].forEach(r => { c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke(); });
        c.fillStyle = 'hsl(0 70% 55% / .12)'; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, Ro + 14, Math.PI * 0.25, Math.PI * 0.75); c.closePath(); c.fill();
        text(c, 'load zone', cx, cy + Ro + 30, { size: 11, color: C.muted });
        c.save(); c.translate(cx, cy); c.rotate(innerA); c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(Ri - 14, 0); c.lineTo(Ri - 2, 0); c.stroke(); c.restore();
        const defAngO = Math.PI / 2, defAngI = innerA + Math.PI / 2;
        if (V.fault === 'outer') { c.fillStyle = C.bad; c.beginPath(); c.arc(cx + Ro * Math.cos(defAngO), cy + Ro * Math.sin(defAngO), 5, 0, TAU); c.fill(); }
        if (V.fault === 'inner') { c.fillStyle = C.bad; c.beginPath(); c.arc(cx + Ri * Math.cos(defAngI), cy + Ri * Math.sin(defAngI), 5, 0, TAU); c.fill(); }
        if (V.fault === 'flute') { c.strokeStyle = C.bad; c.lineWidth = 1; for (let k = 0; k < 60; k++) { const a = k * TAU / 60; c.beginPath(); c.moveTo(cx + (Ro - 1) * Math.cos(a), cy + (Ro - 1) * Math.sin(a)); c.lineTo(cx + (Ro + 6) * Math.cos(a), cy + (Ro + 6) * Math.sin(a)); c.stroke(); } }
        let hit = false;
        for (let k = 0; k < b.N; k++) {
          const a = cageA + k * TAU / b.N, bx = cx + Rp * Math.cos(a), by = cy + Rp * Math.sin(a);
          c.fillStyle = V.fault === 'ball' && k === 0 ? C.warn : C.muted; c.beginPath(); c.arc(bx, by, rb, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1; c.stroke();
          if (V.fault === 'ball' && k === 0) { const sp = a * (b.D / b.d); c.fillStyle = C.bad; c.beginPath(); c.arc(bx + rb * 0.7 * Math.cos(sp), by + rb * 0.7 * Math.sin(sp), 3, 0, TAU); c.fill(); }
          const near = (x, y) => Math.abs(Math.atan2(Math.sin(x - y), Math.cos(x - y))) < 0.06;
          if ((V.fault === 'outer' || V.fault === 'flute') && near(a, defAngO)) hit = true;
          if (V.fault === 'inner' && near(a, defAngI)) hit = true;
        }
        if (hit) flash = 1; flash = Math.max(0, flash - dt * 4);
        if (flash > 0) { c.strokeStyle = 'hsl(0 85% 55% / ' + flash.toFixed(2) + ')'; c.lineWidth = 4; c.beginPath(); c.arc(cx, cy, Ro + 22 + 10 * (1 - flash), 0, TAU); c.stroke(); }
        text(c, 'slow motion', cx, 16, { size: 11, color: C.muted });
        // the acceleration trace
        const tx = 300, tw = 360, ty = 110, amax = Math.max(0.2, ...sig.map(Math.abs));
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(tx, 30, tw, 160); c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx + tw, ty); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 1; c.beginPath();
        sig.forEach((a, i) => { const x = tx + tw * i / NS, y = ty - 75 * a / amax; i ? c.lineTo(x, y) : c.moveTo(x, y); });
        c.stroke();
        text(c, 'acceleration at the housing, 60 ms (idealised)', tx + tw / 2, 22, { size: 11, color: C.muted });
        text(c, '1 revolution = ' + (1000 / F.fr).toFixed(1) + ' ms', tx + tw / 2, 208, { size: 11, color: C.muted });
        const x1 = tx + tw * Math.min(1, (1 / F.fr) / TW); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(tx, 196); c.lineTo(x1, 196); c.stroke();
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rw-faults */
  // the 7.5 kW, 400 V, 4-pole cage motor of the reference simulation (kit.motor.induction), with its supply and
  // protection: voltage level and unbalance (negative-sequence current through the locked-rotor impedance), a lost
  // phase (two lines at about √3 times the current, or a hum and locked-rotor current if it cannot run), overload
  // and a locked rotor; the two-body heating model of rw-heating, and a class 10 thermal-image relay per phase.
  const IMF = { V_LL: 400, f: 50, poles: 4, R1: 0.7, X1: 1.1, R2: 0.55, X2: 1.6, Xm: 45, Pfw: 120, deepBar: 1 };
  Hyper.sim('rw-faults', {
    title: 'A motor in trouble',
    blurb: `A 7.5 kW, 400 V, star-connected motor driving a conveyor (constant torque) through a contactor and an overload relay set to its rated current. Choose what goes wrong and watch the three line currents, the winding temperature and the relay's thermal image for each phase. Time runs faster than real (choose how much).

**Try this**
- *Lose phase L3 while running* at 100 % load: the other two lines jump to about twice their current, the winding heats — and the relay trips in a minute or two. At 40–50 % load the currents stay below the relay's trip level: an ordinary relay never trips while the two live phases and the rotor run hotter than at full load. Now choose the *phase-loss-sensitive* relay.
- *Lose a phase at standstill*: the motor only hums at locked-rotor current.
- Set 3 % voltage unbalance: the current unbalance is several times larger, and the winding runs hotter (about 2u² % more rise).
- Lower the voltage to 85 % at full load: the current rises, the slip grows, the winding warms.
- *Lock the rotor*: about 5.5 times the rated current; the class 10 relay trips in about 15 s — choose *None* for the protection to see why it matters.`,
    mount(box, kit) {
      const M = kit.motor;
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 220 });
      const [g1, g2] = graphs(box, 2);
      const Trated = 7500 / (1450 * TAU / 60), Pl = 797;
      const im100 = M.induction(IMF);
      const ratedOp = (() => { let lo = 1e-4, hi = im100.sMax; for (let i = 0; i < 60; i++) { const s = (lo + hi) / 2; if (im100.at(s).T < Trated) lo = s; else hi = s; } return im100.at(lo); })();
      const Irated = ratedOp.I1, Ilr = im100.at(1).I1;
      const Rfa = 50 / Pl, Rwf = 30 / (0.4 * Pl), Cf = 2400 / Rfa, Cw = 240 / Rwf;
      let V = null, imCache = null, imKey = '', Tw = 40, Tf = 40, relay = [0, 0, 0], tripped = false, tripWhy = '', tSim = 0, hist = [], lastSample = -1e9, ang = 0, tReal = 0, lastPlot = -1, state = null, lossT = 0;
      const ctl = kit.controls(box.side, [
        { id: 'fault', type: 'select', label: 'What goes wrong', options: [['Nothing', 'none'], ['Lose phase L3 while running', 'loss'], ['Lose phase L3 at standstill, then start', 'lossStart'], ['Lock the rotor (jammed conveyor)', 'locked']], value: 'none' },
        { id: 'load', label: 'Load (% of rated torque)', min: 0, max: 150, step: 5, value: 100, unit: '%' },
        { id: 'volt', label: 'Supply voltage (% of 400 V)', min: 80, max: 110, step: 1, value: 100, unit: '%' },
        { id: 'unb', label: 'Voltage unbalance', min: 0, max: 6, step: 0.1, value: 0, unit: '%' },
        { id: 'prot', type: 'select', label: 'Protection', options: [['Thermal overload relay, class 10', 'th'], ['Phase-loss-sensitive relay, class 10', 'pl'], ['None', 'none']], value: 'th' },
        { id: 'speed', type: 'select', label: 'Time', options: [['real time', 1], ['× 10', 10], ['× 60', 60]], value: 10 },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset relay and restart', primary: true }, { id: 'cool', label: 'Cool down' }] }
      ], id => {
        if (id === 'reset') { tripped = false; tripWhy = ''; relay = relay.map(r => Math.min(r, 1)); lossT = 0; }
        if (id === 'cool') { Tw = Tf = 40; relay = [0, 0, 0]; tripped = false; tripWhy = ''; hist = []; tSim = 0; lastSample = -1e9; lossT = 0; }
        if (id === 'fault') { lossT = 0; if (V.fault === 'locked') ctl.set('speed', 1); }
        lastPlot = -1;
      });
      V = ctl.values;
      const imAt = () => { const k = V.volt + '|'; if (k !== imKey) { imKey = k; imCache = M.induction(Object.assign({}, IMF, { V_LL: 400 * V.volt / 100 })); } return imCache; };
      const ro = kit.readout(box.side, [['I', 'Line currents L1 · L2 · L3'], ['cu', 'Current unbalance'], ['n', 'Speed · torque'], ['Tw', 'Winding hot spot'], ['rel', 'Overload relay'], ['life', 'Insulation ageing rate']]);
      const p1 = kit.plot(g1, { x: { label: 'time (s)', min: 0 }, y: { label: 'line current (A)', min: 0 }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'time (s)', min: 0 }, y: { label: 'winding hot spot (°C)' }, legend: true }, 190);
      // currents and losses now
      const operate = () => {
        const im = imAt(), TL = V.load / 100 * Trated, u = V.unb / 100;
        if (tripped) return { I: [0, 0, 0], n: 0, T: 0, Pw: 0, Pfr: 0, what: 'stopped by the relay' };
        const steady = () => { let lo = 1e-5, hi = im.sMax; const g = s => im.at(s).T - TL; if (g(hi) < 0) return null; for (let i = 0; i < 50; i++) { const s = (lo + hi) / 2; if (g(s) < 0) lo = s; else hi = s; } return im.at(hi); };
        const lr = im.at(1);
        if (V.fault === 'locked') { const I = lr.I1; return { I: [I, I, I], n: 0, T: lr.T, Pw: 0.4 * Pl * Math.pow(I / Irated, 2), Pfr: 0.14 * Pl * Math.pow(I / Irated, 2) + 0.25 * Pl, what: 'rotor locked' }; }
        if (V.fault === 'lossStart' || (V.fault === 'loss' && TL > 0.45 * im.Tmax)) {
          const I = 0.866 * lr.I1; return { I: [I, I, 0], n: 0, T: 0, Pw: 0.4 * Pl * Math.pow(I / Irated, 2) * 1.2, Pfr: 0.2 * Pl * Math.pow(I / Irated, 2) + 0.2 * Pl, what: V.fault === 'loss' ? 'single-phased and stalled: humming' : 'humming at standstill: no rotating field' };
        }
        const op = steady();
        if (!op) { const I = lr.I1; return { I: [I, I, I], n: 0, T: lr.T, Pw: 0.4 * Pl * Math.pow(I / Irated, 2), Pfr: 0.14 * Pl * Math.pow(I / Irated, 2) + 0.25 * Pl, what: 'stalled: the load is above the breakdown torque' }; }
        const x = op.I1 / Irated, iron = 0.25 * Pl * Math.pow(V.volt / 100, 2);
        if (V.fault === 'loss') {
          const IL = Math.sqrt(3) * op.I1 * 1.1, ns = im.ns, n = ns - 2 * (ns - op.n);
          // the hottest phase carries IL; the counter-rotating field adds heavy rotor losses
          return { I: [IL, IL, 0], n, T: TL, Pw: 0.4 * Pl * Math.pow(IL / Irated, 2), Pfr: 0.28 * Pl * x * x * 4 + iron + 0.07 * Pl, what: 'running on two lines (single-phasing)' };
        }
        const I2 = u * im.at(2 - op.s).I1, d = Math.PI / 6;
        const I = [0, 1, 2].map(k => Math.sqrt(op.I1 * op.I1 + I2 * I2 + 2 * op.I1 * I2 * Math.cos(d + k * TAU / 3)));
        const extra = 1 + 2 * V.unb * V.unb / 100, xm = Math.max(...I) / Irated;
        return { I, n: op.n, T: op.T, Pw: 0.4 * Pl * xm * xm * extra, Pfr: (0.28 * Pl * x * x) * extra + iron + 0.07 * Pl, what: V.unb > 0 ? 'running on an unbalanced supply' : V.volt < 95 ? 'running on low voltage' : V.volt > 105 ? 'running on high voltage' : 'running normally' };
      };
      const loop = kit.loop(dt => {
        tReal += dt;
        const simDt = dt * V.speed, nSub = Math.max(1, Math.ceil(simDt / 0.25)), h = simDt / nSub;
        for (let k = 0; k < nSub; k++) {
          state = operate();
          const r = M.copperR(1, Tw) / M.copperR(1, 120), q = (Tw - Tf) / Rwf;
          Tw += h * (state.Pw * r - q) / Cw;
          Tf += h * (state.Pfr + q - (Tf - 40) / (Rfa * (state.n > 100 ? 1 : 3))) / Cf;
          if (V.prot !== 'none' && !tripped) {
            for (let p = 0; p < 3; p++) { const xr = state.I[p] / Irated; relay[p] += h * (xr * xr - relay[p]) / 310; }
            if (Math.max(...relay) >= 1.3225) { tripped = true; tripWhy = 'thermal overload'; }
            const Imax = Math.max(...state.I), Imin = Math.min(...state.I);
            if (V.prot === 'pl' && Imax > 0.2 * Irated && Imin < 0.6 * Imax) { lossT += h; if (lossT > 2) { tripped = true; tripWhy = 'phase loss / unbalance'; } } else lossT = 0;
          } else if (V.prot === 'none') relay = [0, 0, 0];
          if (tripped) relay = relay.map(rr => rr + h * (0 - rr) / 310);
          tSim += h;
        }
        state = operate();
        const every = V.speed >= 60 ? 2 : V.speed >= 10 ? 0.4 : 0.05;
        if (tSim - lastSample >= every) { lastSample = tSim; hist.push([tSim, state.I[0], state.I[1], state.I[2], Tw + 10, 40 + 100 * Math.max(...relay) / 1.3225]); if (hist.length > 1500) hist.shift(); }
        const Imax = Math.max(...state.I), Iavg = (state.I[0] + state.I[1] + state.I[2]) / 3, cu = Iavg > 0 ? 100 * Math.max(...state.I.map(i => Math.abs(i - Iavg))) / Iavg : 0;
        ro.set('I', state.I.map(i => i.toFixed(1)).join(' · ') + ' A (rated ' + Irated.toFixed(1) + ' A)');
        ro.set('cu', cu.toFixed(1) + ' %' + (V.unb > 0 ? ' from ' + V.unb.toFixed(1) + ' % voltage unbalance' : ''));
        ro.set('n', state.n.toFixed(0) + ' rpm · ' + state.T.toFixed(1) + ' N·m (' + state.what + ')');
        ro.set('Tw', (Tw + 10).toFixed(0) + ' °C' + (Tw + 10 > 155 ? ' — above class F!' : ''));
        ro.set('rel', V.prot === 'none' ? 'none fitted' : tripped ? 'TRIPPED: ' + tripWhy + ' at ' + fmtTime(tSim) : 'hottest phase at ' + (100 * Math.max(...relay) / 1.3225).toFixed(0) + ' % of trip');
        ro.set('life', '× ' + Math.pow(2, (Tw + 10 - 130) / 10).toFixed(2) + ' of the normal rate (10-kelvin rule)');
        if (tReal - lastPlot > 0.25 || lastPlot < 0) {
          lastPlot = tReal; const C = kit.colors();
          p1.set({ series: [0, 1, 2].map(p => ({ pts: hist.map(q => [q[0], q[1 + p]]), label: 'L' + (p + 1), color: ['hsl(0 70% 50%)', C.series[4], 'hsl(215 70% 55%)'][p] })), hlines: [{ y: Irated, label: 'setting' }] });
          p2.set({ series: [{ pts: hist.map(q => [q[0], q[4]]), label: 'winding hot spot' }, { pts: hist.map(q => [q[0], q[5]]), label: 'relay image (140 = trip)', color: C.muted, dash: [4, 3] }], hlines: [{ y: 155, label: 'class F' }] });
        }
        // drawing: supply, fuses, contactor, relay, star-connected windings and the rotor
        const C = kit.colors(), c = view(st, 680, 240), cols = ['hsl(0 70% 50%)', C.series[4], 'hsl(215 70% 55%)'];
        ang += state.n * TAU / 60 * dt / 30;
        const lossDrawn = V.fault === 'loss' || V.fault === 'lossStart';
        for (let p = 0; p < 3; p++) {
          const y = 50 + p * 55, live = !(lossDrawn && p === 2) && !tripped, Ir = state.I[p] / Irated;
          text(c, 'L' + (p + 1), 20, y + 4, { weight: 600, color: cols[p] });
          c.strokeStyle = live ? cols[p] : C.faint; c.lineWidth = 2.5; c.beginPath(); c.moveTo(34, y); c.lineTo(80, y); c.moveTo(110, y); c.lineTo(160, y); c.moveTo(190, y); c.lineTo(230, y); c.moveTo(310, y); c.lineTo(420, y); c.stroke();
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(80, y - 7, 30, 14);
          if (lossDrawn && p === 2) { c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(84, y - 9); c.lineTo(106, y + 9); c.moveTo(106, y - 9); c.lineTo(84, y + 9); c.stroke(); }
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(160, y); c.lineTo(188, tripped ? y - 12 : y); c.stroke();
          const fr = clamp(relay[p] / 1.3225, 0, 1); c.fillStyle = C.bg2; c.fillRect(234, y - 9, 72, 18); c.fillStyle = fr > 0.9 ? C.bad : C.accent; c.fillRect(234, y - 9, 72 * fr, 18); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(234, y - 9, 72, 18);
          c.fillStyle = C.bg; c.fillRect(340, y - 22, 66, 16); text(c, state.I[p].toFixed(1) + ' A', 373, y - 10, { size: 12, weight: 600, color: Ir > 1.05 ? C.bad : C.text });
        }
        text(c, 'fuses', 95, 30, { size: 11, color: C.muted }); text(c, 'contactor', 175, 30, { size: 11, color: C.muted }); text(c, 'relay image', 270, 30, { size: 11, color: C.muted });
        const mx = 540, my = 110;
        c.fillStyle = C.surface2; c.beginPath(); c.arc(mx, my, 92, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        for (let p = 0; p < 3; p++) {
          const a = -Math.PI / 2 + p * TAU / 3, ex = mx + 70 * Math.cos(a), ey = my + 70 * Math.sin(a), Ir = state.I[p] / Irated;
          c.strokeStyle = heatCol(clamp((Tw + 10 - 40) / 140, 0, 1) * 0.5 + clamp(Ir / 3, 0, 0.5)); c.lineWidth = 9; c.beginPath(); c.moveTo(mx + 26 * Math.cos(a), my + 26 * Math.sin(a)); c.lineTo(ex, ey); c.stroke();
          c.strokeStyle = cols[p]; c.lineWidth = 2; c.beginPath(); c.moveTo(ex, ey); c.lineTo(420, 50 + p * 55); c.stroke();
        }
        c.fillStyle = C.text; c.beginPath(); c.arc(mx, my, 6, 0, TAU); c.fill();
        c.save(); c.translate(mx, my); c.rotate(ang); c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 20, 0, 4); c.stroke(); c.restore();
        text(c, 'star point', mx, my + 36, { size: 10, color: C.muted });
        text(c, (tripped ? 'TRIPPED (' + tripWhy + ') — ' : '') + state.what, 340, 232, { size: 13, weight: 600, color: tripped || state.n === 0 ? C.bad : C.text });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rw-insulation */
  // an insulation tester on a winding: current = capacitive charging (fast) + absorption (∝ t^−n, the slow alignment of
  // dipoles) + leakage (V/R_leak). IR(t) = V / I(t); both leakage and absorption conductance double every 10 K.
  const INS = {
    clean: { name: 'Clean and dry', Rl: 50e9, a: 2e9, n: 0.5, look: 'clean' },
    dirty: { name: 'Dirty surfaces (dust and oil)', Rl: 0.8e9, a: 2e9, n: 0.5, look: 'dirt' },
    damp: { name: 'Damp (stood in humid air)', Rl: 15e6, a: 2e9, n: 0.5, look: 'damp' },
    aged: { name: 'Aged, dried-out and brittle', Rl: 20e9, a: 5e9, n: 0.2, look: 'aged' },
    fault: { name: 'Cracked to earth (a fault)', Rl: 0.3e6, a: 2e9, n: 0.5, look: 'crack' }
  };
  Hyper.sim('rw-insulation', {
    title: 'An insulation-resistance test',
    blurb: `An insulation tester applies a DC voltage between the three bridged motor terminals and the earthed frame for ten minutes (run here thirty times faster). The current falls as the insulation absorbs charge, so the resistance reading climbs — unless leakage across damp or dirty surfaces swamps it. The upper graph is the reading against time (log scale), with the other conditions faint for comparison; the lower one splits the current into its parts.

**Try this**
- Test the clean winding: the reading climbs steadily; the polarisation index IR₁₀/IR₁ is near 3.
- Try the damp winding: low and flat, PI near 1 and below the 5 MΩ minimum at 40 °C — dry it out before energising.
- Dirty surfaces: acceptable IR but a PI of about 1.2 — clean it.
- Change the winding temperature: the raw reading halves every 10 K, but the value corrected to 40 °C (and the PI) stay the same.
- After the test the winding is charged like a capacitor: press *Discharge* before touching the leads.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 220 });
      const [g1, g2] = graphs(box, 2);
      let V = null, tTest = 0, running = false, done = false, Vw = 0, disch = false, lastPlot = -1, tReal = 0, trace = [];
      const ctl = kit.controls(box.side, [
        { id: 'cond', type: 'select', label: 'Winding condition', options: Object.entries(INS).map(([k, p]) => [p.name, k]), value: 'clean' },
        { id: 'T', label: 'Winding temperature', min: 5, max: 60, step: 1, value: 20, unit: '°C' },
        { id: 'Vt', type: 'select', label: 'Test voltage', options: [['500 V DC (windings below 1 kV)', 500], ['1000 V DC', 1000]], value: 500 },
        { id: 'type', type: 'select', label: 'Winding', options: [['Random-wound, below 1 kV (minimum 5 MΩ)', 5], ['Form-wound, built after 1970 (minimum 100 MΩ)', 100]], value: 5 },
        { type: 'buttons', items: [{ id: 'start', label: 'Start 10-min test', primary: true }, { id: 'dis', label: 'Discharge' }] }
      ], id => {
        if (id === 'start') { tTest = 0; running = true; done = false; disch = false; trace = []; }
        if (id === 'dis') { running = false; disch = true; }
        if (id === 'cond' || id === 'T' || id === 'Vt') { running = false; done = false; tTest = 0; trace = []; }
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Test time'], ['IR', 'Reading now'], ['IR1', 'IR₁ (1 min) · at 40 °C'], ['IR10', 'IR₁₀ (10 min)'], ['PI', 'Polarisation index'], ['ver', 'Verdict'], ['Vw', 'Winding voltage']]);
      const p1 = kit.plot(g1, { x: { label: 'time (min)', min: 0, max: 10 }, y: { label: 'insulation resistance (MΩ)', log: true, min: 0.1, max: 100000 }, legend: true }, 200);
      const p2 = kit.plot(g2, { x: { label: 'time (min)', min: 0, max: 10 }, y: { label: 'current (µA)', log: true, min: 1e-4, max: 1000 }, legend: true }, 200);
      const Cw = 20e-9, Rint = 0.5e6;
      const parts = (k, t) => {   // currents in A at time t (s) for condition k at the chosen temperature and voltage
        const p = INS[k], f = Math.pow(2, (V.T - 20) / 10), Vt = V.Vt;
        const il = Vt / p.Rl * f, ia = Vt / p.a * f * Math.pow(Math.max(1, t) / 60, -p.n), ic = Vt / Rint * Math.exp(-t / (Rint * Cw));
        return { il, ia, ic, IR: Vt / (il + ia + ic) };
      };
      const loop = kit.loop(dt => {
        tReal += dt;
        if (running) { tTest += dt * 30; Vw = V.Vt; if (tTest >= 600) { tTest = 600; running = false; done = true; } }
        if (disch) { Vw = Math.max(0, Vw * Math.exp(-dt / 0.3) - dt * 2); if (Vw <= 0.5) { Vw = 0; disch = false; } }
        const now = parts(V.cond, tTest), IR1 = parts(V.cond, 60).IR, IR10 = parts(V.cond, 600).IR, PI = IR10 / IR1, IR40 = IR1 * Math.pow(2, (V.T - 40) / 10);
        if (running) trace.push([tTest / 60, now.IR / 1e6]);
        const mohm = r => r >= 1e9 ? (r / 1e9).toFixed(2) + ' GΩ' : (r / 1e6).toFixed(r < 1e7 ? 2 : 0) + ' MΩ';
        ro.set('t', (tTest / 60).toFixed(2) + ' min' + (running ? ' (running, ×30)' : done ? ' — complete' : ''));
        ro.set('IR', tTest > 0 ? mohm(now.IR) : 'press Start');
        ro.set('IR1', tTest >= 60 ? mohm(IR1) + ' · ' + mohm(IR40) + ' at 40 °C' : '—');
        ro.set('IR10', tTest >= 600 ? mohm(IR10) : '—');
        ro.set('PI', tTest >= 600 ? PI.toFixed(2) + (IR1 > 5e9 ? ' (IR₁ above 5000 MΩ: PI not meaningful)' : '') : '—');
        let verdict = '—';
        if (tTest >= 60) {
          if (IR40 < V.type * 1e6) verdict = 'FAIL: below ' + V.type + ' MΩ at 40 °C — do not energise; dry, clean or repair';
          else if (tTest < 600) verdict = 'IR₁ above the minimum; wait for the 10-minute reading';
          else if (PI < 1.5 && IR1 < 5e9) verdict = 'questionable: PI ' + PI.toFixed(1) + ' — moisture or dirt; clean and dry, retest';
          else if (PI < 2 && IR1 < 5e9) verdict = 'acceptable IR, PI below 2 — trend it; a surge test would say more';
          else verdict = 'good: clean, dry insulation';
        }
        ro.set('ver', verdict);
        ro.set('Vw', Vw > 1 ? Vw.toFixed(0) + ' V — charged: discharge before touching!' : 'discharged');
        if (tReal - lastPlot > 0.2 || lastPlot < 0) {
          lastPlot = tReal; const C = kit.colors(), ref = [], cur = { il: [], ia: [], ic: [] };
          Object.keys(INS).forEach(k => { if (k === V.cond) return; const pts = []; for (let t = 1; t <= 600; t *= 1.08) pts.push([t / 60, parts(k, t).IR / 1e6]); ref.push({ pts, label: INS[k].name, color: C.faint, dash: [3, 3] }); });
          for (let t = 0.001; t <= Math.max(1, tTest); t *= 1.08) { const q = parts(V.cond, t); cur.il.push([t / 60, q.il * 1e6]); cur.ia.push([t / 60, q.ia * 1e6]); cur.ic.push([t / 60, Math.max(1e-4, q.ic * 1e6)]); }
          p1.set({ series: ref.concat([{ pts: trace.slice(), label: INS[V.cond].name, color: C.accent }]), hlines: [{ y: V.type * Math.pow(2, (40 - V.T) / 10), label: 'minimum (at this temperature)' }] });
          p2.set({ series: [{ pts: cur.il, label: 'leakage' }, { pts: cur.ia, label: 'absorption', color: C.series[1] }, { pts: cur.ic, label: 'capacitive charging', color: C.series[2] }] });
        }
        // drawing: the tester, its leads to the bridged terminals and the frame, the winding's insulation
        const C = kit.colors(), c = view(st, 680, 240), look = INS[V.cond].look;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(20, 40, 180, 150); c.strokeRect(20, 40, 180, 150);
        c.fillStyle = C.bg; c.fillRect(35, 55, 150, 60); c.strokeRect(35, 55, 150, 60);
        text(c, tTest > 0 ? mohm(now.IR) : '— MΩ', 110, 88, { size: 20, weight: 700 });
        text(c, (running || Vw > 1 ? Vw.toFixed(0) : '0') + ' V   ' + (tTest / 60).toFixed(1) + ' min', 110, 107, { size: 12, color: C.muted });
        text(c, 'insulation tester', 110, 140, { size: 12, color: C.muted });
        c.fillStyle = Vw > 1 ? C.bad : C.faint; c.beginPath(); c.arc(60, 165, 8, 0, TAU); c.fill(); text(c, 'HV', 60, 185, { size: 10, color: C.muted });
        // the motor
        c.fillStyle = C.surface; c.fillRect(380, 70, 240, 120); c.strokeRect(380, 70, 240, 120);
        c.fillStyle = C.surface2; c.fillRect(440, 40, 110, 30); c.strokeRect(440, 40, 110, 30);
        ['U', 'V', 'W'].forEach((s, i) => { const x = 465 + i * 30; c.fillStyle = C.text; c.beginPath(); c.arc(x, 55, 5, 0, TAU); c.fill(); text(c, s, x, 36, { size: 11 }); });
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(465, 55); c.lineTo(525, 55); c.stroke();
        // the insulation between copper and iron, as a band
        c.fillStyle = C.muted; c.fillRect(400, 110, 200, 14);
        c.fillStyle = 'hsl(28 85% 50%)'; c.fillRect(400, 124, 200, 12);
        c.fillStyle = look === 'aged' ? 'hsl(45 60% 35%)' : 'hsl(50 80% 60% / .8)'; c.fillRect(400, 136, 200, 8);
        c.fillStyle = C.muted; c.fillRect(400, 144, 200, 14);
        text(c, 'copper', 612, 134, { size: 10, align: 'left', color: C.muted }); text(c, 'insulation', 612, 146, { size: 10, align: 'left', color: C.muted }); text(c, 'iron (earthed)', 612, 158, { size: 10, align: 'left', color: C.muted });
        if (look === 'damp') { c.fillStyle = 'hsl(205 80% 55% / .8)'; for (let k = 0; k < 14; k++) { c.beginPath(); c.arc(408 + k * 14, 140 + 3 * Math.sin(k), 3, 0, TAU); c.fill(); } }
        if (look === 'dirt') { c.fillStyle = C.text; for (let k = 0; k < 40; k++) { c.fillRect(402 + (k * 37) % 196, 137 + (k * 13) % 6, 2, 2); } }
        if (look === 'aged' || look === 'crack') { c.strokeStyle = look === 'crack' ? C.bad : C.text; c.lineWidth = 1.5; for (let k = 0; k < (look === 'crack' ? 2 : 6); k++) { const x = 420 + k * 32; c.beginPath(); c.moveTo(x, 136); c.lineTo(x + 4, 140); c.lineTo(x - 2, 144); c.stroke(); } }
        // leads
        c.strokeStyle = 'hsl(0 75% 50%)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(200, 80); c.bezierCurveTo(300, 20, 420, 20, 465, 50); c.stroke();
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(200, 160); c.bezierCurveTo(280, 220, 360, 220, 390, 186); c.stroke();
        text(c, 'line (+)', 300, 30, { size: 11, color: 'hsl(0 75% 50%)' }); text(c, 'earth: frame', 300, 222, { size: 11, color: C.muted });
        // current through the insulation
        if (running) { const I = now.il + now.ia + now.ic, k = clamp(Math.log10(I * 1e9) / 5, 0.1, 1); c.fillStyle = C.accent; for (let j = 0; j < 8; j++) { const y = 124 + ((tReal * 40 * k + j * 5) % 34); c.globalAlpha = k; c.fillRect(420 + j * 22, y, 3, 3); } c.globalAlpha = 1; }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rw-linear */
  // a linear servo axis repeating a point-to-point move (kit.motor.move), with the force it needs (m a + friction + m g),
  // the RMS force over the cycle against the continuous rating, and the coil heat (F/Km)²
  const LIN = {
    iron: { name: 'Iron-core (flat), 300 N continuous', Kf: 60, Fc: 300, Fp: 900, Km: 25, mf: 3.0, attract: 2500, pitch: 0.016, cog: 0.015 },
    ironless: { name: 'Ironless (U-channel), 120 N continuous', Kf: 25, Fc: 120, Fp: 480, Km: 12, mf: 0.8, attract: 0, pitch: 0.015, cog: 0 }
  };
  Hyper.sim('rw-linear', {
    title: 'A linear-motor axis',
    blurb: `A forcer rides on a magnet track, repeating a move out and back with a pause at each end. Its coils light up with their phase currents as it passes the magnets — the drive commutates from the encoder position. The graphs show the force the move needs (with the motor's continuous and peak ratings and the RMS force of the whole cycle) and the speed profile.

**Try this**
- Raise the acceleration: the peak force rises in proportion, the RMS force and the heat (∝ force²) climb faster.
- Add payload until the peak force passes the motor's peak rating (red), or the RMS passes the continuous rating.
- Compare the iron-core motor (more force, heavy forcer, thousands of newtons of magnetic attraction on the guides) with the ironless one (light, no attraction, no cogging, less force).
- Tick *vertical axis*: the motor now holds the weight all the time — even at rest the coil heats.
- A short stroke with a high top speed becomes a triangle profile: the axis never reaches its top speed.`,
    mount(box, kit) {
      const M = kit.motor;
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.32, minH: 200 });
      const [g1, g2] = graphs(box, 2);
      let V = null, t = 0, lastKey = '', cyc = null, lastPlot = -1, tReal = 0;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Motor', options: Object.entries(LIN).map(([k, p]) => [p.name, k]), value: 'iron' },
        { id: 'mass', label: 'Payload and carriage', min: 0, max: 40, step: 0.5, value: 8, unit: 'kg' },
        { id: 'dist', label: 'Stroke', min: 20, max: 1000, step: 10, value: 400, unit: 'mm' },
        { id: 'vmax', label: 'Top speed', min: 0.1, max: 5, step: 0.1, value: 2, unit: 'm/s' },
        { id: 'acc', label: 'Acceleration', min: 1, max: 100, step: 1, value: 20, unit: 'm/s²', log: true },
        { id: 'dwell', label: 'Pause at each end', min: 0, max: 1, step: 0.05, value: 0.2, unit: 's' },
        { id: 'fric', label: 'Guide friction', min: 0, max: 60, step: 1, value: 20, unit: 'N' },
        { id: 'vert', type: 'check', label: 'Vertical axis (gravity)', value: false }
      ], () => { lastKey = ''; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['mt', 'Move time · cycle'], ['vp', 'Peak speed'], ['Fp', 'Peak force · current'], ['Fr', 'RMS force · continuous rating'], ['P', 'Coil heat (RMS)'], ['at', 'Magnetic attraction on the guides']]);
      const p1 = kit.plot(g1, { x: { label: 'time (s)', min: 0 }, y: { label: 'force (N)' }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'time (s)', min: 0 }, y: { label: 'speed (m/s)' }, legend: true }, 190);
      const build = () => {
        const mo = LIN[V.type], m = V.mass + mo.mf, mv = M.move({ dist: V.dist / 1000, vmax: V.vmax, acc: V.acc });
        const T = 2 * (mv.tTotal + V.dwell), g = V.vert ? 9.81 : 0;
        const at = tt => {   // out, pause, back, pause
          tt = ((tt % T) + T) % T;
          if (tt < mv.tTotal) { const s = mv.at(tt); return { x: s.x, v: s.v, a: s.a }; }
          if (tt < mv.tTotal + V.dwell) return { x: V.dist / 1000, v: 0, a: 0 };
          if (tt < 2 * mv.tTotal + V.dwell) { const s = mv.at(tt - mv.tTotal - V.dwell); return { x: V.dist / 1000 - s.x, v: -s.v, a: -s.a }; }
          return { x: 0, v: 0, a: 0 };
        };
        const force = s => m * s.a + (Math.abs(s.v) > 1e-6 ? Math.sign(s.v) * V.fric : 0) + m * g;
        const N = 600, fp = [], vp = []; let s2 = 0, fmax = 0;
        for (let i = 0; i <= N; i++) { const tt = T * i / N, s = at(tt), F = force(s); fp.push([tt, F]); vp.push([tt, s.v]); s2 += F * F; fmax = Math.max(fmax, Math.abs(F)); }
        const Frms = Math.sqrt(s2 / (N + 1));
        cyc = { mo, m, mv, T, at, force, fp, vp, Frms, fmax };
      };
      const loop = kit.loop(dt => {
        tReal += dt;
        const key = [V.type, V.mass, V.dist, V.vmax, V.acc, V.dwell, V.fric, V.vert].join('|');
        if (key !== lastKey) { lastKey = key; build(); lastPlot = -1; }
        t += dt;
        const { mo, m, mv, T, Frms, fmax } = cyc, s = cyc.at(t), F = cyc.force(s), I = F / mo.Kf;
        ro.set('mt', mv.tTotal.toFixed(3) + ' s' + (mv.triangle ? ' (triangle: top speed not reached)' : '') + ' · cycle ' + T.toFixed(2) + ' s');
        ro.set('vp', mv.vPeak.toFixed(2) + ' m/s');
        ro.set('Fp', fmax.toFixed(0) + ' N (peak rating ' + mo.Fp + ' N' + (fmax > mo.Fp ? ' — EXCEEDED' : '') + ') · ' + (fmax / mo.Kf).toFixed(1) + ' A');
        ro.set('Fr', Frms.toFixed(0) + ' N of ' + mo.Fc + ' N continuous (' + (100 * Frms / mo.Fc).toFixed(0) + ' %)' + (Frms > mo.Fc ? ' — OVERHEATS' : ''));
        ro.set('P', Math.pow(Frms / mo.Km, 2).toFixed(0) + ' W (at the continuous rating ' + Math.pow(mo.Fc / mo.Km, 2).toFixed(0) + ' W)');
        ro.set('at', mo.attract ? mo.attract + ' N, always — the guides must carry it' : 'none (ironless)');
        if (tReal - lastPlot > 0.5 || lastPlot < 0) {
          lastPlot = tReal; const C = kit.colors(), tc = ((t % T) + T) % T;
          p1.set({ x: { label: 'time (s)', min: 0, max: T }, series: [{ pts: cyc.fp, label: 'force needed' }], hlines: [{ y: mo.Fc, label: 'continuous', color: C.warn }, { y: -mo.Fc, color: C.warn }, { y: mo.Fp, label: 'peak', color: C.bad }, { y: -mo.Fp, color: C.bad }, { y: Frms, label: 'RMS', color: C.muted }], vlines: [{ x: tc }] });
          p2.set({ x: { label: 'time (s)', min: 0, max: T }, series: [{ pts: cyc.vp, label: 'speed' }], vlines: [{ x: tc }] });
        }
        // drawing: the magnet track, the forcer with its three-phase coils, the payload and the force arrow
        const C = kit.colors(), c = view(st, 700, 200), x0 = 60, x1 = 640, span = x1 - x0 - 110;
        const px = x0 + 10 + span * clamp(s.x / Math.max(1e-6, V.dist / 1000), 0, 1), pitchPx = 18;
        for (let x = x0, k = 0; x < x1; x += pitchPx, k++) { c.fillStyle = k % 2 ? 'hsl(215 70% 55% / .7)' : 'hsl(0 70% 55% / .7)'; c.fillRect(x, 130, pitchPx - 2, 22); text(c, k % 2 ? 'S' : 'N', x + pitchPx / 2 - 1, 146, { size: 10, color: C.bg }); }
        c.fillStyle = C.muted; c.fillRect(x0, 152, x1 - x0, 10);
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(px, 88, 100, 38); c.strokeRect(px, 88, 100, 38);
        const thE = Math.PI * (px - x0 - 10) / pitchPx;
        for (let k = 0; k < 6; k++) {
          const ph = k % 3, i = Math.sin(thE - ph * TAU / 3) * I, a = clamp(Math.abs(i) / Math.max(1e-6, mo.Fp / mo.Kf), 0.08, 1);
          c.fillStyle = (i >= 0 ? 'hsl(28 90% 55% / ' : 'hsl(190 80% 50% / ') + a.toFixed(2) + ')'; c.fillRect(px + 6 + k * 15.5, 96, 12, 24);
          text(c, ['U', 'V', 'W'][ph], px + 12 + k * 15.5, 112, { size: 9, color: C.text });
        }
        const pay = clamp(V.mass / 40, 0.1, 1); c.fillStyle = C.faint; c.fillRect(px + 20, 88 - 40 * pay, 60, 40 * pay); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(px + 20, 88 - 40 * pay, 60, 40 * pay);
        text(c, V.mass + ' kg', px + 50, 84, { size: 11 });
        const fl = clamp(F / Math.max(1, mo.Fp) * 90, -90, 90);
        if (Math.abs(fl) > 3) kit.arrow(c, px + 50, 70 - 40 * pay, px + 50 + fl, 70 - 40 * pay, Math.abs(F) > mo.Fp ? C.bad : C.accent, 3);
        if (mo.attract) { kit.arrow(c, px + 50, 126, px + 50, 134, C.warn, 2); text(c, 'attraction ' + mo.attract + ' N', px + 50, 182, { size: 10, color: C.warn }); }
        text(c, 'F = ' + F.toFixed(0) + ' N, I = ' + I.toFixed(1) + ' A, v = ' + s.v.toFixed(2) + ' m/s' + (V.vert ? ' (vertical: holding ' + (m * 9.81).toFixed(0) + ' N)' : ''), 350, 24, { size: 13, weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rw-voice-coil */
  // a moving-coil actuator: L di/dt = u − R i − Ke v (u from a fast current loop, clamped to the supply), m x'' = Kf(x) i − k x − c v,
  // position PID tuned to a chosen bandwidth; Kf(x) falls towards the ends of the ±12.5 mm stroke as the coil leaves the gap
  const VCA = { Kf: 8, R: 4, L: 2e-3, mc: 0.03, xs: 0.0125, Imax: 4, c: 2 };
  const kfAt = x => VCA.Kf * (1 - 0.18 * Math.pow(clamp(Math.abs(x) / VCA.xs, 0, 1), 4));
  Hyper.sim('rw-voice-coil', {
    title: 'A voice-coil actuator under control',
    blurb: `A moving coil in the annular gap of a magnet pot (cross-section): the field crosses the gap radially, current in the coil makes an axial force F = B L I, and the coil carries the load on a rod. A position controller (PID with a feed of the encoder position) steps it between two positions every 100 ms; time runs ten times slower on screen. The graphs show the last step (position against target, and the coil current) and the force–stroke curve at the present current, with an ideal solenoid's curve for comparison.

**Try this**
- Raise the bandwidth: faster steps, larger current peaks — until the current limit or the supply voltage (with the back-EMF at speed) holds it back.
- Add payload: slower and more current for the same move.
- Lower the supply to 12 V with a large step: the driver runs out of voltage (R I + Ke v) and the move stretches.
- Tick the return spring: the coil now holds a steady current (and makes steady heat) away from centre.
- Look at the force–stroke curve: flat in the middle, a little lower at the ends — nothing like a solenoid's steep rise.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 210 });
      const [g1, g2] = graphs(box, 2);
      let V = null, x = 0, v = 0, i = 0, integ = 0, tS = 0, lastPlot = -1, tReal = 0, rec = [], recStart = 0, tStep = 0, settled = null, iPk = 0, vPk = 0, pAcc = 0, pT = 0, Pavg = 0, lastSet = null;
      const ctl = kit.controls(box.side, [
        { id: 'amp', label: 'Step (± from centre)', min: 1, max: 10, step: 0.5, value: 5, unit: 'mm' },
        { id: 'bw', label: 'Position-loop bandwidth', min: 5, max: 120, step: 1, value: 40, unit: 'Hz' },
        { id: 'load', label: 'Payload', min: 0, max: 0.5, step: 0.01, value: 0.07, unit: 'kg' },
        { id: 'Vs', label: 'Supply voltage', min: 12, max: 48, step: 1, value: 24, unit: 'V' },
        { id: 'spring', type: 'check', label: 'Return spring (400 N/m)', value: false }
      ], () => { lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['kf', 'Force constant here'], ['st', 'Settling time (to 2 %)'], ['ip', 'Peak current · force'], ['vp', 'Peak speed · back-EMF'], ['u', 'Voltage needed at peak'], ['P', 'Average coil heat']]);
      const p1 = kit.plot(g1, { x: { label: 'time after the step (ms)', min: 0, max: 100 }, y: { label: 'position (mm) · current (A)' }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'coil position (mm)', min: -12.5, max: 12.5 }, y: { label: 'force at this current (N)' }, legend: true }, 190);
      const loop = kit.loop(dt => {
        tReal += dt;
        const m = VCA.mc + V.load, wb = TAU * V.bw, Kp = m * wb * wb, Kd = 2 * 0.7 * m * wb, Ki = Kp * wb / 8, k = V.spring ? 400 : 0;
        const simDt = dt / 10, h = 1e-5, n = Math.round(simDt / h);
        for (let s = 0; s < n; s++) {
          const setp = (Math.floor(tS / 0.1) % 2 ? -1 : 1) * V.amp / 1000;
          if (setp !== lastSet) { lastSet = setp; tStep = tS; settled = null; rec = []; recStart = tS; iPk = 0; vPk = 0; }
          const e = setp - x;
          integ = clamp(integ + e * h, -0.02, 0.02);
          const Fcmd = Kp * e + Ki * integ - Kd * v, kf = kfAt(x), Icmd = clamp(Fcmd / kf, -VCA.Imax, VCA.Imax);
          const u = clamp(VCA.R * Icmd + VCA.Kf * v + VCA.L * TAU * 2000 * (Icmd - i), -V.Vs, V.Vs);
          i += h * (u - VCA.R * i - VCA.Kf * v) / VCA.L;
          const a = (kf * i - k * x - VCA.c * v) / m;
          v += a * h; x += v * h;
          if (Math.abs(x) >= VCA.xs) { x = Math.sign(x) * VCA.xs; v = 0; }
          if (settled == null && Math.abs(e) < 0.02 * 2 * V.amp / 1000 && Math.abs(v) < 0.01) settled = tS - tStep;
          iPk = Math.max(iPk, Math.abs(i)); vPk = Math.max(vPk, Math.abs(v));
          pAcc += i * i * VCA.R * h; pT += h; if (pT > 0.2) { Pavg = pAcc / pT; pAcc = 0; pT = 0; }
          if ((tS - recStart) * 1000 <= 100 && s % 20 === 0) rec.push([(tS - recStart) * 1000, x * 1000, i, setp * 1000]);
          tS += h;
        }
        ro.set('kf', kfAt(x).toFixed(2) + ' N/A at ' + (x * 1000).toFixed(1) + ' mm');
        ro.set('st', settled != null ? (settled * 1000).toFixed(1) + ' ms' : 'moving …');
        ro.set('ip', iPk.toFixed(2) + ' A (limit ' + VCA.Imax + ' A) · ' + (iPk * VCA.Kf).toFixed(1) + ' N');
        ro.set('vp', vPk.toFixed(2) + ' m/s · ' + (vPk * VCA.Kf).toFixed(1) + ' V');
        const uNeed = VCA.R * iPk + VCA.Kf * vPk;
        ro.set('u', uNeed.toFixed(1) + ' V of ' + V.Vs + ' V' + (uNeed > V.Vs * 0.98 ? ' — voltage-limited' : ''));
        ro.set('P', Pavg.toFixed(2) + ' W');
        if (tReal - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = tReal; const C = kit.colors(), fs = [], sol = [], iNow = Math.max(0.2, Math.abs(i));
          for (let xx = -12.5; xx <= 12.5; xx += 0.5) { fs.push([xx, kfAt(xx / 1000) * iNow]); sol.push([xx, Math.min(4 * kfAt(0) * iNow, kfAt(0) * iNow * Math.pow(3 / (12.5 - xx + 3), 2) * 4)]); }
          p1.set({ series: [{ pts: rec.map(q => [q[0], q[3]]), label: 'target (mm)', color: C.muted, dash: [5, 4] }, { pts: rec.map(q => [q[0], q[1]]), label: 'position (mm)' }, { pts: rec.map(q => [q[0], q[2]]), label: 'current (A)', color: C.series[1] }] });
          p2.set({ series: [{ pts: fs, label: 'voice coil at ' + iNow.toFixed(2) + ' A' }, { pts: sol, label: 'a solenoid (pulls towards +12.5 mm)', color: C.muted, dash: [5, 4] }], marks: [{ x: x * 1000, y: kfAt(x) * Math.abs(i), label: 'now' }] });
        }
        // drawing: the magnet pot in section, the coil in the gap with its current, the rod, payload, spring and force arrow
        const C = kit.colors(), c = view(st, 680, 220), sc = 8, cx = 230 + x * 1000 * sc;
        c.fillStyle = C.muted; c.fillRect(60, 30, 260, 26); c.fillRect(60, 164, 260, 26); c.fillRect(60, 30, 26, 160);
        c.fillStyle = 'hsl(0 70% 55% / .75)'; c.fillRect(86, 82, 40, 56); text(c, 'N', 106, 115, { color: C.bg, weight: 700 });
        c.fillStyle = C.muted; c.fillRect(126, 90, 200, 40);
        c.strokeStyle = C.accent; c.lineWidth = 1;
        for (let xx = 140; xx < 320; xx += 20) { kit.arrow(c, xx, 88, xx, 60, 'hsl(28 90% 55% / .6)', 1.2); kit.arrow(c, xx, 132, xx, 160, 'hsl(28 90% 55% / .6)', 1.2); }
        text(c, 'field across the gap', 190, 22, { size: 11, color: C.muted });
        const ci = clamp(Math.abs(i) / VCA.Imax, 0.1, 1), ccol = i >= 0 ? 'hsl(28 90% 55% / ' + ci.toFixed(2) + ')' : 'hsl(190 80% 50% / ' + ci.toFixed(2) + ')';
        c.fillStyle = C.surface2; c.fillRect(cx - 50, 58, 100, 30); c.fillRect(cx - 50, 132, 100, 30);
        c.fillStyle = ccol; c.fillRect(cx - 46, 62, 92, 22); c.fillRect(cx - 46, 136, 92, 22);
        for (let k = 0; k < 5; k++) {
          const px = cx - 38 + k * 19;
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.arc(px, 73, 5, 0, TAU); c.stroke(); c.beginPath(); c.arc(px, 147, 5, 0, TAU); c.stroke();
          if (Math.abs(i) > 0.05) {
            const top = i > 0; c.fillStyle = C.text;
            if (top) { c.beginPath(); c.arc(px, 73, 1.8, 0, TAU); c.fill(); c.beginPath(); c.moveTo(px - 3, 144); c.lineTo(px + 3, 150); c.moveTo(px + 3, 144); c.lineTo(px - 3, 150); c.stroke(); }
            else { c.beginPath(); c.arc(px, 147, 1.8, 0, TAU); c.fill(); c.beginPath(); c.moveTo(px - 3, 70); c.lineTo(px + 3, 76); c.moveTo(px + 3, 70); c.lineTo(px - 3, 76); c.stroke(); }
          }
        }
        c.fillStyle = C.text; c.fillRect(cx + 50, 106, 200, 8);
        const lx = cx + 250; c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; const ls = 20 + 60 * clamp(V.load / 0.5, 0, 1); c.fillRect(lx, 110 - ls / 2, 40, ls); c.strokeRect(lx, 110 - ls / 2, 40, ls);
        text(c, (V.load * 1000).toFixed(0) + ' g', lx + 20, 110 + ls / 2 + 14, { size: 11 });
        if (V.spring) { c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(lx + 40, 110); for (let j = 1; j <= 10; j++) c.lineTo(lx + 40 + j * (660 - lx - 40) / 10, 110 + (j % 2 ? -10 : 10)); c.stroke(); }
        const F = kfAt(x) * i, fl = clamp(F * 3, -90, 90);
        if (Math.abs(fl) > 3) kit.arrow(c, lx + 20, 50, lx + 20 + fl, 50, C.accent, 3);
        text(c, 'F = ' + F.toFixed(1) + ' N', lx + 20, 40, { size: 12, weight: 600 });
        const sx = 230 + (lastSet || 0) * 1000 * sc; c.strokeStyle = C.warn; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(sx, 196); c.lineTo(sx, 214); c.stroke(); c.setLineDash([]);
        text(c, 'target', sx, 212, { size: 10, color: C.warn, align: 'left' });
        text(c, 'position ' + (x * 1000).toFixed(2) + ' mm   current ' + i.toFixed(2) + ' A   (10 × slower)', 190, 212, { size: 11, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rw-piezo */
  // stick-slip: a piezo stack drives a rod with a sawtooth (slow rise, fast flyback); a slider clamped on the rod by friction
  // (static μ 0.2, kinetic 0.16) follows it while the friction can accelerate it, and slips when it cannot.
  // ultrasonic: a travelling bending wave A sin(kx − ωt) in the stator; surface points at height h move in ellipses and
  // drag the rotor against the wave at h k A ω, with the amplitude set by how close the drive is to the stator's resonance.
  const SS = { dL: 1.5e-6, m: 0.005, mus: 0.2, muk: 0.16 };
  function stickSlip(p, cycles, rec) {
    const T = 1 / p.f, h = T / 800, dL = SS.dL * p.V / 100 * p.dir, fl = p.fr;
    const rodX = t => { const ph = (t % T) / T; return ph < 1 - fl ? dL * ph / (1 - fl) : dL * (1 - (ph - (1 - fl)) / fl); };
    let x = 0, v = 0, t = 0, stuck = true; const starts = [];
    const Fl = -p.dir * p.FL, Ns = SS.mus * p.N;
    for (let k = 0; k < cycles * 800; k++) {
      if (k % 800 === 0) starts.push(x);
      const vr = (rodX(t + h) - rodX(t)) / h;
      if (stuck) { const need = SS.m * (vr - v) / h - Fl; if (Math.abs(need) <= Ns) v = vr; else stuck = false; }   // friction needed to follow the rod
      if (!stuck) {
        const dv = vr - v, vn = v + h * (SS.muk * p.N * Math.sign(dv) + Fl) / SS.m;
        if ((vr - vn) * dv <= 0) { v = vr; stuck = true; } else v = vn;
      }
      x += v * h; t += h;
      if (rec && k % 8 === 0) rec.push([t, rodX(t), x]);
    }
    starts.push(x);
    const n = starts.length, step = n > 3 ? (starts[n - 1] - starts[n - 3]) / 2 : starts[n - 1] - starts[0];
    return { step, x };
  }
  Hyper.sim('rw-piezo', {
    title: 'Piezo motors: stick-slip and ultrasonic',
    blurb: `**Stick-slip drive**: a piezo stack extends slowly under a sawtooth voltage, carrying a slider clamped to its rod by friction, then snaps back so fast that the slider cannot follow and slips. Net result: a step of up to a micrometre or so per cycle. The drawing is enormously magnified and slowed down; the graph shows the rod and the slider over three cycles, and the speed against drive frequency.

**Ultrasonic motor**: a bending wave travels round the stator at tens of kilohertz. Points on the stator's toothed surface move in small ellipses; at the crests they move against the wave and drag the rotor with them.

**Try this**
- Stick-slip at 1 kHz: watch the slider stick (green pads) during the slow rise and slip (red) at the flyback. Lower the frequency to 100 Hz: the flyback is too slow, the slider follows the rod back, and the drive stops stepping.
- Lengthen the flyback (a less asymmetric sawtooth): more back-slip, smaller steps.
- Add an opposing load or reduce the clamping force: the steps shrink — then the slider slides back.
- Ultrasonic: tune the frequency towards the stator's resonance (40 kHz) and the wave, the ellipses and the speed grow; load it and the speed falls.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 210 });
      const [g1, g2] = graphs(box, 2);
      let V = null, lastKey = '', res = null, tv = 0, xs = 0, lastPlot = -1, tReal = 0, rotorPos = 0, sweep = [];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Motor', options: [['Stick-slip (inertia) drive', 'ss'], ['Travelling-wave ultrasonic motor', 'us']], value: 'ss' },
        { id: 'V', label: 'Sawtooth amplitude', min: 20, max: 100, step: 5, value: 100, unit: 'V' },
        { id: 'f', label: 'Sawtooth frequency', min: 50, max: 10000, step: 10, value: 1000, unit: 'Hz', log: true },
        { id: 'fr', label: 'Flyback (share of the cycle)', min: 0.02, max: 0.4, step: 0.01, value: 0.1 },
        { id: 'N', label: 'Clamping (preload) force', min: 0.5, max: 5, step: 0.1, value: 2, unit: 'N' },
        { id: 'FL', label: 'Opposing load', min: 0, max: 0.35, step: 0.01, value: 0, unit: 'N' },
        { id: 'dir', type: 'select', label: 'Direction', options: [['Forward', 1], ['Reverse', -1]], value: 1 },
        { id: 'fu', label: 'Drive frequency', min: 38, max: 46, step: 0.05, value: 41, unit: 'kHz' },
        { id: 'Tl', label: 'Load torque', min: 0, max: 1, step: 0.02, value: 0.2, unit: 'N·m' }
      ], id => {
        if (id === 'mode') { const ss = V.mode === 'ss'; ['V', 'f', 'fr', 'N', 'FL', 'dir'].forEach(k => ctl.show(k, ss)); ['fu', 'Tl'].forEach(k => ctl.show(k, !ss)); }
        lastKey = '';
      });
      V = ctl.values; ctl.show('fu', false); ctl.show('Tl', false);
      const ro = kit.readout(box.side, [['a', 'Stroke · wave amplitude'], ['s', 'Net step per cycle'], ['v', 'Speed'], ['r', 'Why']]);
      const p1 = kit.plot(g1, { x: { label: 'time (µs)', min: 0 }, y: { label: 'position (µm)' }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'frequency', min: 0 }, y: { label: 'speed' }, legend: true }, 190);
      // ultrasonic stator: 60 mm ring, 9 wavelengths, teeth 2 mm above the neutral plane, Q = 20 at 40 kHz, 2 µm at resonance
      const US = { f0: 40, Q: 20, A0: 2e-6, h: 0.002, lam: Math.PI * 0.06 / 9, rr: 0.0275, Tst: 1.0 };
      const usAmp = f => { const r = f / US.f0; return US.A0 / US.Q / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(r / US.Q, 2)); };
      const usSpeed = (f, Tl) => { const k = TAU / US.lam, v0 = US.h * k * usAmp(f) * TAU * f * 1000; return Math.max(0, v0 * (1 - Tl / (US.Tst * usAmp(f) / US.A0))); };
      const loop = kit.loop(dt => {
        tReal += dt;
        const C = kit.colors(), key = V.mode === 'ss' ? [V.V, V.f, V.fr, V.N, V.FL, V.dir].join('|') : [V.fu, V.Tl].join('|');
        if (key !== lastKey) {
          lastKey = key; const C2 = kit.colors();
          if (V.mode === 'ss') {
            const p = { V: V.V, f: V.f, fr: V.fr, N: V.N, FL: V.FL, dir: V.dir }, rec = [];
            res = stickSlip(p, 6, rec);
            const T = 1 / V.f, last = rec.filter(q => q[0] >= 3 * T).map(q => [(q[0] - 3 * T) * 1e6, q[1] * 1e6, q[2] * 1e6]), x0 = last.length ? last[0][2] : 0;
            sweep = []; for (let f = 50; f <= 10000; f *= 1.4) { const r = stickSlip(Object.assign({}, p, { f }), 5); sweep.push([f, Math.abs(r.step) * f * 1000 * Math.sign(r.step * V.dir)]); }
            p1.set({ x: { label: 'time over three cycles (µs)', min: 0, max: 3e6 * T }, y: { label: 'position (µm)' }, series: [{ pts: last.map(q => [q[0], q[1]]), label: 'rod (stack)', color: C2.muted }, { pts: last.map(q => [q[0], q[2] - x0 + last[0][1]]), label: 'slider' }] });
            p2.set({ x: { label: 'sawtooth frequency (Hz)', min: 50, max: 10000, log: true }, y: { label: 'speed (mm/s, + = intended direction)' }, series: [{ pts: sweep, label: 'speed' }], marks: [{ x: V.f, y: res.step * V.f * 1000 * V.dir, label: 'now' }] });
            ro.set('a', (SS.dL * V.V / 100 * 1e6).toFixed(2) + ' µm stack stroke at ' + V.V + ' V');
            ro.set('s', (res.step * 1e9 * V.dir).toFixed(0) + ' nm per cycle');
            ro.set('v', (res.step * V.f * 1000 * V.dir).toFixed(3) + ' mm/s');
            const fly = SS.dL * V.V / 100 / (V.fr / V.f), acc = SS.muk * V.N / SS.m;
            ro.set('r', res.step * V.dir < 0.05 * SS.dL * V.V / 100 ? (V.FL > SS.muk * V.N * 0.9 ? 'the load beats the friction' : 'flyback too slow: friction (' + acc.toFixed(0) + ' m/s²) drags the slider back with the rod') : 'flyback ' + (fly * 1000).toFixed(1) + ' mm/s: friction can only give ' + acc.toFixed(0) + ' m/s², so the slider slips');
          } else {
            const fs = []; for (let f = 38; f <= 46; f += 0.1) fs.push([f, usSpeed(f, V.Tl) / US.rr * 60 / TAU]);
            p1.set({ x: { label: 'drive frequency (kHz)', min: 38, max: 46 }, y: { label: 'wave amplitude (µm)' }, series: [{ pts: fs.map(q => [q[0], usAmp(q[0]) * 1e6]), label: 'amplitude' }], marks: [{ x: V.fu, y: usAmp(V.fu) * 1e6, label: 'now' }], vlines: [{ x: US.f0, label: 'resonance' }] });
            p2.set({ x: { label: 'drive frequency (kHz)', min: 38, max: 46 }, y: { label: 'rotor speed (rpm)' }, series: [{ pts: fs, label: 'at ' + V.Tl.toFixed(2) + ' N·m' }], marks: [{ x: V.fu, y: usSpeed(V.fu, V.Tl) / US.rr * 60 / TAU, label: 'now' }] });
            const vs = usSpeed(V.fu, V.Tl);
            ro.set('a', (usAmp(V.fu) * 1e6).toFixed(2) + ' µm wave at ' + V.fu.toFixed(2) + ' kHz');
            ro.set('s', 'surface speed ' + (US.h * TAU / US.lam * usAmp(V.fu) * TAU * V.fu * 1000).toFixed(3) + ' m/s at the crests (no load)');
            ro.set('v', (vs / US.rr * 60 / TAU).toFixed(0) + ' rpm on a 55 mm rotor');
            ro.set('r', vs <= 0 ? 'load above the stall torque at this amplitude: the rotor stops (and holds)' : 'the crests push the rotor against the travelling wave');
          }
        }
        const c = view(st, 680, 220);
        if (V.mode === 'ss') {
          const T = 1 / V.f, slow = 0.7 * T; tv += dt * slow;
          const dL = SS.dL * V.V / 100 * V.dir, ph = (tv % T) / T, u = ph < 1 - V.fr ? dL * ph / (1 - V.fr) : dL * (1 - (ph - (1 - V.fr)) / V.fr);
          const cycNow = Math.floor(tv / T); xs = cycNow * res.step + (ph < 1 - V.fr ? u : u + (res.step - dL) * clamp((ph - (1 - V.fr)) / V.fr, 0, 1));
          const px = 40, sU = 40e6, rodX = 150 + u * sU;
          for (let k = 0; k < 8; k++) { c.fillStyle = k % 2 ? 'hsl(45 80% 55%)' : 'hsl(45 60% 45%)'; c.fillRect(px + k * (12 + u * sU / 8), 70, 12 + u * sU / 8, 60); }
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(px, 70, 96 + u * sU, 60); text(c, 'piezo stack', px + 48, 60, { size: 11, color: C.muted });
          c.fillStyle = C.muted; c.fillRect(rodX - 14, 94, 540, 12);
          for (let k = 0; k < 12; k++) { c.fillStyle = C.bg2; c.fillRect(rodX + k * 45, 96, 2, 8); }
          const slid = 330 + (((xs * sU) % 300) + 300) % 300 - 150, slipping = ph >= 1 - V.fr - 0.02;
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(slid - 40, 64, 80, 72); c.strokeRect(slid - 40, 64, 80, 72);
          c.fillStyle = slipping ? C.bad : C.ok; c.fillRect(slid - 36, 88, 72, 5); c.fillRect(slid - 36, 107, 72, 5);
          text(c, 'slider', slid, 58, { size: 11, color: C.muted });
          text(c, slipping ? 'slipping' : 'sticking', slid, 152, { size: 12, weight: 600, color: slipping ? C.bad : C.ok });
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
          for (let k = 0; k <= 200; k++) { const pp = k / 200 * 2, q = pp % 1, yy = q < 1 - V.fr ? q / (1 - V.fr) : 1 - (q - (1 - V.fr)) / V.fr; const X = 440 + k, Y = 205 - 35 * yy * V.V / 100; k ? c.lineTo(X, Y) : c.moveTo(X, Y); }
          c.stroke(); text(c, 'drive voltage (two cycles)', 540, 162, { size: 10, color: C.muted });
          text(c, 'net travel ' + (xs * 1e6).toFixed(2) + ' µm (drawn 40 px per µm, ' + (1 / 0.7).toFixed(1) + ' s per cycle)', 200, 205, { size: 11, color: C.muted });
        } else {
          tv += dt;
          const A = usAmp(V.fu), k = TAU / US.lam, sA = 8 / US.A0, vis = 1.2, vs = usSpeed(V.fu, V.Tl);
          rotorPos += dt * vs / Math.max(1e-9, US.h * k * US.A0 * TAU * US.f0 * 1000) * 60;
          const ys = 130, lamPx = 160;
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
          c.beginPath(); for (let X = 40; X <= 640; X += 4) { const y = ys - A * sA * Math.sin(TAU * (X - 40) / lamPx - vis * TAU * tv); X === 40 ? c.moveTo(X, y) : c.lineTo(X, y); }
          for (let X = 640; X >= 40; X -= 4) { const y = ys + 30 - A * sA * Math.sin(TAU * (X - 40) / lamPx - vis * TAU * tv); c.lineTo(X, y); }
          c.closePath(); c.fill(); c.stroke();
          let crestY = 999;
          for (let X = 50; X <= 630; X += 20) {
            const th = TAU * (X - 40) / lamPx - vis * TAU * tv, yb = ys - A * sA * Math.sin(th), ux = -12 * A / US.A0 * Math.cos(th), top = yb - 14;
            c.strokeStyle = C.muted; c.lineWidth = 5; c.beginPath(); c.moveTo(X, yb); c.lineTo(X + ux, top); c.stroke();
            c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.ellipse(X, ys - 14, Math.max(0.5, 12 * A / US.A0), Math.max(0.5, A * sA), 0, 0, TAU); c.stroke();
            crestY = Math.min(crestY, top);
          }
          c.fillStyle = C.muted; c.fillRect(40, crestY - 26, 600, 22);
          for (let k2 = 0; k2 < 10; k2++) { const X = 40 + ((k2 * 60 - rotorPos) % 600 + 600) % 600; c.fillStyle = C.bg2; c.fillRect(X, crestY - 24, 3, 18); }
          text(c, 'rotor (pressed on the teeth)', 340, crestY - 32, { size: 11, color: C.muted });
          kit.arrow(c, 560, 200, 630, 200, C.accent, 2); text(c, 'wave travels →', 560, 214, { size: 10, color: C.accent });
          if (vs > 0) kit.arrow(c, 140, crestY - 40, 70, crestY - 40, C.warn, 2); text(c, vs > 0 ? '← rotor moves against the wave' : 'rotor stalled (held by friction)', 170, crestY - 44, { size: 10, color: C.warn, align: 'left' });
          text(c, 'amplitude ' + (A * 1e6).toFixed(2) + ' µm, drawn ' + (sA * 1e-6).toFixed(0) + ' px/µm; the wave is slowed about 40 000 ×', 300, 214, { size: 10, color: C.muted });
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rw-direct-drive */
  // the same rotary table indexed 90° and then loaded by a cutting torque, driven two ways at once:
  // A: a torque motor on the table (encoder on the table), PID + acceleration feed-forward;
  // B: a servo motor through a gearbox with backlash and torsional stiffness, controlled from the motor encoder
  //    (semi-closed loop) with a bandwidth kept below the gear resonance.
  const DD = { Jdd: 0.05, TpkDD: 300, KmDD: 4, Jm: 0.0012, TpkM: 20, KmM: 0.5, r: 0.3 };
  Hyper.sim('rw-direct-drive', {
    title: 'Direct drive or gearbox?',
    blurb: `Two identical rotary tables index 90° and back, and while they stand still a milling cutter loads them with a pulsing torque. Table A sits on a direct-drive torque motor with its encoder on the table; table B is driven by a small servo motor through a gearbox that has backlash and some torsional springiness, controlled from the motor's encoder. The graphs compare the position error at 300 mm radius and the heat in each motor.

**Try this**
- With 3 arcmin of backlash, watch table B's error during cutting: the gear winds up and the table rattles in the backlash, while the motor encoder sees little of it — around a millimetre at the rim. Table A, with its encoder on the table and a fast loop, holds within a few tens of micrometres.
- Set the backlash to 0: B improves only a little — its gear still winds up under the cutting torque, and its loop must stay slow (8 Hz here) because of the gear resonance.
- Make the gear stiffer: the resonance rises, the loop can be faster and B's error shrinks.
- Push the acceleration up with a heavy table and a low ratio: the small servo reaches its torque limit and the axis cannot follow.
- Raise the cutting torque: A's heat rises steeply (holding torque costs (T/K_m)²), B's barely — the gearbox multiplies the small motor's torque.
- Raise the table inertia: A's motor sees it directly; B's sees it divided by the ratio squared.`,
    mount(box, kit) {
      const M = kit.motor;
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 200 });
      const [g1, g2] = graphs(box, 2);
      let V = null, t = 0, A = null, B = null, hist = [], lastPlot = -1, tReal = 0, key = '', prof = null, stats = null;
      const ctl = kit.controls(box.side, [
        { id: 'JL', label: 'Table inertia', min: 0.5, max: 8, step: 0.1, value: 4, unit: 'kg·m²' },
        { id: 'Tc', label: 'Cutting torque (mean)', min: 0, max: 100, step: 1, value: 40, unit: 'N·m' },
        { id: 'N', label: 'Gear ratio (table B)', min: 10, max: 100, step: 1, value: 50 },
        { id: 'bl', label: 'Gearbox backlash', min: 0, max: 10, step: 0.5, value: 3, unit: '′' },
        { id: 'kg', label: 'Gearbox stiffness', min: 5, max: 50, step: 1, value: 20, unit: 'N·m/′' },
        { id: 'acc', label: 'Indexing acceleration', min: 5, max: 30, step: 1, value: 15, unit: 'rad/s²' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }] }
      ], () => { key = ''; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['eA', 'Error at 300 mm now: A · B'], ['pk', 'Worst error while cutting: A · B'], ['st', 'Settling after the index (to 20 µm): A · B'], ['tq', 'Peak motor torque: A · B'], ['ht', 'Motor heat (RMS over the cycle): A · B'], ['bw', 'Loop bandwidth: A · B']]);
      const p1 = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'error at 300 mm radius (µm)' }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'motor heat (W)' }, legend: true }, 190);
      const reset = () => {
        const arc = Math.PI / 180 / 60, kg = V.kg / arc, JL = V.JL, N = V.N;
        prof = M.move({ dist: Math.PI / 2, vmax: 4, acc: V.acc });
        const cyc = 2 * (prof.tTotal + 1.5);
        const wcA = TAU * 60, JA = JL + DD.Jdd;
        const Jt = JL + DD.Jm * N * N, wres = Math.sqrt(kg * (1 / JL + 1 / (DD.Jm * N * N))), wcB = Math.min(TAU * 60, 0.25 * wres);
        A = { th: 0, w: 0, I: 0, J: JA, Kp: JA * wcA * wcA, Kd: 1.6 * JA * wcA, Ki: JA * wcA * wcA * wcA / 6, wc: wcA };
        B = { thm: 0, wm: 0, thL: 0, wL: 0, I: 0, Jt, Kp: Jt * wcB * wcB, Kd: 1.6 * Jt * wcB, Ki: Jt * wcB * wcB * wcB / 6, wc: wcB, kg, cg: 2 * 0.05 * Math.sqrt(kg * JL), bh: V.bl * arc / 2, N, fres: wres / TAU };
        t = 0; hist = []; stats = { cyc, pkA: 0, pkB: 0, sA: null, sB: null, tqA: 0, tqB: 0, hA: 0, hB: 0, ht: 0, TA: 0, TB: 0 };
      };
      // reference: +90°, dwell 1.5 s (cutting), back, dwell 1.5 s (cutting)
      const ref = tt => {
        const T1 = prof.tTotal, cyc = stats.cyc, q = ((tt % cyc) + cyc) % cyc;
        if (q < T1) { const s = prof.at(q); return { th: s.x, w: s.v, a: s.a, cut: false, tin: -1 }; }
        if (q < T1 + 1.5) return { th: Math.PI / 2, w: 0, a: 0, cut: true, tin: q - T1 };
        if (q < 2 * T1 + 1.5) { const s = prof.at(q - T1 - 1.5); return { th: Math.PI / 2 - s.x, w: -s.v, a: -s.a, cut: false, tin: -1 }; }
        return { th: 0, w: 0, a: 0, cut: true, tin: q - 2 * T1 - 1.5 };
      };
      const loop = kit.loop(dt => {
        tReal += dt;
        const k2 = [V.JL, V.Tc, V.N, V.bl, V.kg, V.acc].join('|');
        if (k2 !== key) { key = k2; reset(); }
        const h = 1e-4, n = Math.round(dt / h);
        for (let s = 0; s < n; s++) {
          const r = ref(t), Td = r.cut && r.tin > 0.4 ? V.Tc * (1 + 0.5 * Math.sin(TAU * 12 * t)) : 0;   // the cutter engages 0.4 s into the dwell
          // A: direct drive
          const eA = r.th - A.th; A.I = clamp(A.I + eA * h, -DD.TpkDD / A.Ki, DD.TpkDD / A.Ki);
          const TA = clamp(A.J * r.a + A.Kp * eA + A.Kd * (r.w - A.w) + A.Ki * A.I, -DD.TpkDD, DD.TpkDD);
          A.w += h * (TA - Td) / A.J; A.th += A.w * h;
          // B: servo + gearbox with backlash, controlled from the motor encoder
          const eB = r.th - B.thm / B.N; B.I = clamp(B.I + eB * h, -DD.TpkM * B.N / B.Ki, DD.TpkM * B.N / B.Ki);
          const TmL = B.Jt * r.a + B.Kp * eB + B.Kd * (r.w - B.wm / B.N) + B.Ki * B.I, Tm = clamp(TmL / B.N, -DD.TpkM, DD.TpkM);
          const d = B.thm / B.N - B.thL, de = d > B.bh ? d - B.bh : d < -B.bh ? d + B.bh : 0, dd = B.wm / B.N - B.wL;
          const Tg = de !== 0 ? B.kg * de + B.cg * dd : 0;
          B.wm += h * (Tm - Tg / B.N) / DD.Jm; B.thm += B.wm * h;
          B.wL += h * (Tg - Td) / V.JL; B.thL += B.wL * h;
          const errA = (A.th - r.th) * DD.r * 1e6, errB = (B.thL - r.th) * DD.r * 1e6;
          if (r.cut && r.tin > 0.4) { stats.pkA = Math.max(stats.pkA, Math.abs(errA)); stats.pkB = Math.max(stats.pkB, Math.abs(errB)); }
          if (!r.cut) { stats.stored = false; stats.TA = 0; stats.TB = 0; }
          else if (r.tin < 0.4) { if (Math.abs(errA) > 20) stats.TA = r.tin; if (Math.abs(errB) > 20) stats.TB = r.tin; }
          else if (!stats.stored) { stats.sA = stats.TA; stats.sB = stats.TB; stats.stored = true; }
          stats.tqA = Math.max(stats.tqA, Math.abs(TA)); stats.tqB = Math.max(stats.tqB, Math.abs(Tm));
          stats.hA += Math.pow(TA / DD.KmDD, 2) * h; stats.hB += Math.pow(Tm / DD.KmM, 2) * h; stats.ht += h;
          if (s % 100 === 0) { hist.push([t, errA, errB, Math.pow(TA / DD.KmDD, 2), Math.pow(Tm / DD.KmM, 2)]); if (hist.length > 1200) hist.shift(); }
          t += h;
        }
        const r = ref(t), eAn = (A.th - r.th) * DD.r * 1e6, eBn = (B.thL - r.th) * DD.r * 1e6, um = x => (Math.abs(x) >= 1000 ? (x / 1000).toFixed(2) + ' mm' : x.toFixed(1) + ' µm');
        ro.set('eA', um(eAn) + ' · ' + um(eBn));
        ro.set('pk', um(stats.pkA) + ' · ' + um(stats.pkB));
        const sett = v => v == null ? '…' : v >= 0.399 ? 'not within 400 ms' : (v * 1000).toFixed(0) + ' ms';
        ro.set('st', sett(stats.sA) + ' · ' + sett(stats.sB));
        ro.set('tq', stats.tqA.toFixed(0) + ' N·m (table)' + (stats.tqA >= 0.999 * DD.TpkDD ? ' AT ITS LIMIT' : '') + ' · ' + stats.tqB.toFixed(1) + ' N·m (motor, ×' + V.N + ')' + (stats.tqB >= 0.999 * DD.TpkM ? ' AT ITS LIMIT — the axis cannot follow' : ''));
        ro.set('ht', stats.ht > 0 ? (stats.hA / stats.ht).toFixed(0) + ' W · ' + (stats.hB / stats.ht).toFixed(1) + ' W' : '—');
        ro.set('bw', (A.wc / TAU).toFixed(0) + ' Hz · ' + (B.wc / TAU).toFixed(1) + ' Hz (gear resonance ' + B.fres.toFixed(0) + ' Hz)');
        if (tReal - lastPlot > 0.25 || lastPlot < 0) {
          lastPlot = tReal; const C = kit.colors(), t0 = Math.max(0, t - 6), w = hist.filter(q => q[0] >= t0);
          p1.set({ x: { label: 'time (s)', min: t0, max: t0 + 6 }, series: [{ pts: w.map(q => [q[0], q[2]]), label: 'B: gearbox', color: C.series[1] }, { pts: w.map(q => [q[0], q[1]]), label: 'A: direct drive' }] });
          p2.set({ x: { label: 'time (s)', min: t0, max: t0 + 6 }, series: [{ pts: w.map(q => [q[0], q[3]]), label: 'A: torque motor' }, { pts: w.map(q => [q[0], q[4]]), label: 'B: servo motor', color: C.series[1] }] });
        }
        // drawing: two tables seen from above, with the error drawn 200 times larger at the rim
        const C = kit.colors(), c = view(st, 680, 220);
        const table = (cx, th, err, lab, sub) => {
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, 110, 80, 0, TAU); c.fill(); c.stroke();
          for (let k = 0; k < 8; k++) { const a = th + k * Math.PI / 4; c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(cx + 20 * Math.cos(a), 110 + 20 * Math.sin(a)); c.lineTo(cx + 78 * Math.cos(a), 110 + 78 * Math.sin(a)); c.stroke(); }
          const ra = r.th - Math.PI / 2;
          c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(cx + 84 * Math.cos(ra), 110 + 84 * Math.sin(ra)); c.lineTo(cx + 98 * Math.cos(ra), 110 + 98 * Math.sin(ra)); c.stroke();
          const ea = ra + clamp(err * 1e-6 / DD.r * 200, -0.6, 0.6);
          c.fillStyle = Math.abs(err) > 50 ? C.bad : C.ok; c.beginPath(); c.arc(cx + 72 * Math.cos(ea), 110 + 72 * Math.sin(ea), 6, 0, TAU); c.fill();
          text(c, lab, cx, 16, { size: 13, weight: 600 }); text(c, sub, cx, 208, { size: 11, color: C.muted });
          text(c, (Math.abs(err) >= 1000 ? (err / 1000).toFixed(2) + ' mm' : err.toFixed(0) + ' µm'), cx, 114, { size: 13, weight: 600, color: Math.abs(err) > 50 ? C.bad : C.text });
        };
        table(170, A.th - Math.PI / 2, eAn, 'A: direct-drive torque motor', 'no gear: the error is the servo\'s alone');
        table(510, B.thL - Math.PI / 2, eBn, 'B: servo + ' + V.N + ':1 gearbox', V.bl + '′ backlash, ' + V.kg + ' N·m/′');
        c.strokeStyle = C.accent; c.lineWidth = 6; c.beginPath(); c.arc(170, 110, 88, 0, TAU); c.stroke();
        c.fillStyle = C.muted; c.fillRect(600, 96, 40, 28); c.fillRect(640, 102, 26, 16); text(c, 'gear', 620, 90, { size: 10, color: C.muted });
        if (r.cut) text(c, 'cutting', 340, 110, { size: 13, weight: 700, color: C.warn });
        text(c, 'dot: table position, error ×200 · tick: target', 340, 130, { size: 10, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rw-coreless */
  // two small 24 V DC motors with the same R and K: an iron-core one (J 60 g·cm², L 1.5 mH, cogging) and a coreless one
  // (J 10 g·cm², L 0.1 mH, no cogging). Averaged PWM model for the motion, with the cogging torque; triangular ripple
  // ΔI = V D (1 − D)/((L + L_choke) f) for the current waveform and its extra heat; single-body winding heating.
  const CL = {
    iron: { name: 'iron-core', J: 6e-6, L: 1.5e-3, cog: 0.0008, cogN: 14, I0: 0.06, tau: 150 },
    core: { name: 'coreless', J: 1e-6, L: 1e-4, cog: 0, cogN: 1, I0: 0.03, tau: 20 }
  };
  const CLR = 2.5, CLK = 0.025, CLRth = 40, CLTmax = 125;
  Hyper.sim('rw-coreless', {
    title: 'Coreless against iron-core',
    blurb: `Two small DC motors with the same resistance and torque constant, side by side: an ordinary iron-core rotor with slots, and a coreless rotor — a thin bell of copper wire. The left graph is the start-up from rest after a voltage step; the right one is the current in the winding over three PWM periods at your switching frequency.

**Try this**
- Compare the start-ups: the coreless rotor has a sixth of the inertia, so it reaches speed about six times faster.
- Set the load to zero and the duty to a few per cent: the iron-core motor's speed ripples as its rotor passes each cogging position; the coreless one turns smoothly.
- Set the PWM to 20 kHz: the coreless motor's current swings by amperes (its inductance is tiny) and the ripple heats it. Raise the frequency, or add a choke.
- Load both to three times the rated torque (75 mN·m): the coreless winding reaches its 125 °C limit in about two seconds, the iron-core one takes several times longer.`,
    mount(box, kit) {
      const M = kit.motor;
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 210 });
      const [g1, g2] = graphs(box, 2);
      let V = null, key = '', lastPlot = -1, tReal = 0;
      const S = { iron: { w: 0, th: 0, T: 25, wmin: 1e9, wmax: 0, tw: 0, tLim: null }, core: { w: 0, th: 0, T: 25, wmin: 1e9, wmax: 0, tw: 0, tLim: null } };
      const ctl = kit.controls(box.side, [
        { id: 'Vs', label: 'Supply', min: 6, max: 24, step: 1, value: 24, unit: 'V' },
        { id: 'D', label: 'PWM duty', min: 1, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'f', label: 'PWM frequency', min: 5, max: 200, step: 1, value: 20, unit: 'kHz', log: true },
        { id: 'Lc', label: 'Series choke', min: 0, max: 500, step: 10, value: 0, unit: 'µH' },
        { id: 'TL', label: 'Load torque (rated 25 mN·m)', min: 0, max: 80, step: 1, value: 10, unit: 'mN·m' },
        { type: 'buttons', items: [{ id: 'cool', label: 'Cool both down', primary: true }] }
      ], id => { if (id === 'cool') for (const k in S) { S[k].T = 25; S[k].tLim = null; } key = ''; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['tm', 'Mechanical time constant: iron · coreless'], ['n', 'Speed (ripple): iron · coreless'], ['dI', 'PWM ripple p-p: iron · coreless'], ['ph', 'Extra heat from ripple: iron · coreless'], ['T', 'Winding: iron · coreless'], ['lim', 'Time to reach 125 °C at this load (from 25 °C)']]);
      const p1 = kit.plot(g1, { x: { label: 'time after the voltage step (ms)', min: 0 }, y: { label: 'speed (rpm)', min: 0 }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'time (µs)', min: 0 }, y: { label: 'winding current (A)' }, legend: true }, 190);
      const ripple = m => V.Vs * (V.D / 100) * (1 - V.D / 100) / ((m.L + V.Lc * 1e-6) * V.f * 1000);
      const loop = kit.loop(dt => {
        tReal += dt;
        const Va = V.Vs * V.D / 100, TL = V.TL / 1000;
        const k2 = [V.Vs, V.D, V.f, V.Lc, V.TL].join('|');
        if (k2 !== key) {
          key = k2; const C = kit.colors(), su = {}, wave = {};
          for (const k of ['iron', 'core']) {
            const m = CL[k], Tf = m.I0 * CLK;
            const run = M.dcSim({ V: Va, R: CLR, L: m.L + V.Lc * 1e-6, K: CLK, J: m.J, b: 0, TL: (tt, w) => (w > 0.01 ? TL + Tf : 0), T: 0.12, dt: 2e-5 });
            su[k] = run.filter((q, i) => i % 25 === 0).map(q => [q[0] * 1000, Math.max(0, q[2]) * 60 / TAU]);
            const Iav = Math.max(0, (Va - CLK * S[k].w) / CLR), dI = ripple(m), Tp = 1 / (V.f * 1000), D = V.D / 100, pts = [];
            for (let j = 0; j <= 300; j++) { const tt = 3 * Tp * j / 300, ph = (tt % Tp) / Tp, tri = ph < D ? -0.5 + ph / Math.max(1e-6, D) : 0.5 - (ph - D) / Math.max(1e-6, 1 - D); pts.push([tt * 1e6, Iav + dI * tri]); }
            wave[k] = pts;
          }
          p1.set({ series: [{ pts: su.iron, label: 'iron-core', color: C.series[1] }, { pts: su.core, label: 'coreless' }] });
          p2.set({ x: { label: 'time (µs), three PWM periods at ' + V.f + ' kHz', min: 0, max: 3e3 / V.f }, series: [{ pts: wave.iron, label: 'iron-core', color: C.series[1] }, { pts: wave.core, label: 'coreless' }] });
        }
        const h = 1e-4, n = Math.round(dt / h);
        for (const k of ['iron', 'core']) {
          const m = CL[k], s = S[k], Tf = m.I0 * CLK;
          for (let j = 0; j < n; j++) {
            const i = clamp((Va - CLK * s.w) / (CLR * M.copperR(1, s.T) / M.copperR(1, 25)), -5, 5), Tm = CLK * i, Tc = -m.cog * Math.sin(m.cogN * s.th);
            const drive = Tm + Tc - TL;
            if (s.w <= 0 && Math.abs(drive) <= Tf) s.w = 0; else s.w = Math.max(0, s.w + h * (drive - Tf) / m.J);
            s.th += s.w * h;
            const dI = ripple(m), P = (i * i + dI * dI / 12) * CLR * M.copperR(1, s.T) / M.copperR(1, 25), C = m.tau / CLRth;
            s.T += h * (P - (s.T - 25) / CLRth) / C;
            if (s.tLim == null && s.T >= CLTmax) s.tLim = tReal;
          }
          s.tw += dt; s.wmin = Math.min(s.wmin, s.w); s.wmax = Math.max(s.wmax, s.w);
          if (s.tw > 0.5) { s.rip = s.wmax > 0 ? (s.wmax - s.wmin) / Math.max(1e-6, (s.wmax + s.wmin) / 2) : 0; s.tw = 0; s.wmin = 1e9; s.wmax = 0; }
        }
        const tm = k => CL[k].J * CLR / (CLK * CLK), rpm = k => S[k].w * 60 / TAU, ripS = k => S[k].rip != null ? ' (±' + (50 * S[k].rip).toFixed(1) + ' %)' : '';
        ro.set('tm', (1000 * tm('iron')).toFixed(1) + ' ms · ' + (1000 * tm('core')).toFixed(1) + ' ms');
        ro.set('n', rpm('iron').toFixed(0) + ripS('iron') + ' · ' + rpm('core').toFixed(0) + ripS('core'));
        ro.set('dI', ripple(CL.iron).toFixed(2) + ' A · ' + ripple(CL.core).toFixed(2) + ' A');
        ro.set('ph', (CLR * Math.pow(ripple(CL.iron), 2) / 12).toFixed(2) + ' W · ' + (CLR * Math.pow(ripple(CL.core), 2) / 12).toFixed(2) + ' W');
        ro.set('T', S.iron.T.toFixed(0) + ' °C · ' + S.core.T.toFixed(0) + ' °C' + (S.core.T > CLTmax || S.iron.T > CLTmax ? ' — above the 125 °C limit!' : ''));
        const x = (TL / CLK + 0.03) / 1.0, tl = k => x <= 1 ? 'never (within rating)' : (CL[k].tau * Math.log(x * x / (x * x - 1))).toFixed(1) + ' s';
        ro.set('lim', 'iron ' + tl('iron') + ' · coreless ' + tl('core'));
        // drawing: the two rotors in section, turning (slowed), coloured by winding temperature
        const C = kit.colors(), c = view(st, 680, 220);
        const draw = (cx, k) => {
          const s = S[k], a = s.th / 40, hot = heatCol((s.T - 25) / 100);
          c.fillStyle = C.muted; c.beginPath(); c.arc(cx, 105, 82, 0, TAU); c.fill(); c.fillStyle = C.bg2; c.beginPath(); c.arc(cx, 105, 68, 0, TAU); c.fill();
          c.fillStyle = 'hsl(0 70% 55% / .6)'; c.beginPath(); c.arc(cx, 105, 68, Math.PI * 0.15, Math.PI * 0.85); c.arc(cx, 105, 60, Math.PI * 0.85, Math.PI * 0.15, true); c.fill();
          c.fillStyle = 'hsl(215 70% 55% / .6)'; c.beginPath(); c.arc(cx, 105, 68, Math.PI * 1.15, Math.PI * 1.85); c.arc(cx, 105, 60, Math.PI * 1.85, Math.PI * 1.15, true); c.fill();
          if (k === 'iron') {
            c.fillStyle = C.surface2; c.beginPath(); c.arc(cx, 105, 56, 0, TAU); c.fill();
            for (let j = 0; j < 7; j++) { const aa = a + j * TAU / 7; c.fillStyle = hot; c.save(); c.translate(cx, 105); c.rotate(aa); c.fillRect(34, -6, 20, 12); c.restore(); }
            c.fillStyle = C.text; c.beginPath(); c.arc(cx, 105, 8, 0, TAU); c.fill();
          } else {
            c.fillStyle = C.muted; c.beginPath(); c.arc(cx, 105, 40, 0, TAU); c.fill();
            c.strokeStyle = hot; c.lineWidth = 7; c.beginPath(); c.arc(cx, 105, 51, 0, TAU); c.stroke();
            c.strokeStyle = C.bg2; c.lineWidth = 1.5; for (let j = 0; j < 24; j++) { const aa = a + j * TAU / 24; c.beginPath(); c.moveTo(cx + 47 * Math.cos(aa), 105 + 47 * Math.sin(aa)); c.lineTo(cx + 55 * Math.cos(aa + 0.12), 105 + 55 * Math.sin(aa + 0.12)); c.stroke(); }
            text(c, 'magnet', cx, 109, { size: 10, color: C.bg });
          }
          text(c, CL[k].name + ': ' + (s.w * 60 / TAU).toFixed(0) + ' rpm, ' + s.T.toFixed(0) + ' °C', cx, 208, { size: 12, weight: 600, color: s.T > CLTmax ? C.bad : C.text });
        };
        draw(170, 'iron'); draw(510, 'core');
        text(c, 'slotted iron rotor: cogs, heavy, high L', 170, 12, { size: 11, color: C.muted });
        text(c, 'copper bell in the air gap: smooth, light, low L', 510, 12, { size: 11, color: C.muted });
        text(c, 'rotors drawn 40 × slower', 340, 110, { size: 10, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rw-vibration-motors */
  // ERM: a coin motor (R 30 Ω, K 0.0022 V·s/rad, J 3e-9 kg·m², 0.3 g at 2 mm) — F = m r ω², rotating;
  // LRA: a 1.5 g magnet on a spring (f0 = 175 Hz + drift, Q 12) driven by a coil (BL 1 N/A, 25 Ω) with back-EMF damping.
  // The device (mass M) feels the reaction; a 60 ms pulse, optionally with overdrive and active braking.
  const ERM = { R: 30, K: 0.0022, J: 3e-9, I0: 0.02, mr: 6e-7, drag: 2e-11 };
  const LRA = { m: 0.0015, f0: 175, Q: 12, BL: 1.0, R: 25 };
  Hyper.sim('rw-vibration-motors', {
    title: 'ERM and LRA: making a device buzz',
    blurb: `A handheld device with a vibration motor inside. The **ERM** spins an off-centre mass: its force grows with speed squared and turns with it. The **LRA** bounces a magnet on a spring, driven by a coil at the spring's resonance. Press *Buzz* for a 60 ms pulse (time runs ten times slower on screen); the left graph is the device's acceleration in one direction, the right graph how the steady vibration depends on the drive.

**Try this**
- ERM at 3 V: it takes tens of milliseconds to spin up and as long to coast down — a soft, blurred buzz. Tick *overdrive and braking*: a short over-voltage kick and a reverse-voltage brake sharpen it.
- Lower the ERM voltage: the vibration becomes both slower and much weaker (∝ ω²).
- LRA: tick *overdrive and braking* and compare the crisp envelope. Then shift the resonance by 15 Hz (temperature, mounting) with tracking off: the output collapses; tick *track the resonance* to recover it.
- Make the device heavier: the same force gives less acceleration.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 210 });
      const [g1, g2] = graphs(box, 2);
      let V = null, tS = 0, pulseT = -1, trace = [], w = 0, th = 0, x = 0, v = 0, iNow = 0, lastPlot = -1, tReal = 0, key = '', shake = 0, pk = 0;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Actuator', options: [['ERM (coin motor, eccentric mass)', 'erm'], ['LRA (linear resonant actuator)', 'lra']], value: 'erm' },
        { id: 'Ve', label: 'ERM voltage', min: 0.5, max: 3.6, step: 0.1, value: 3, unit: 'V' },
        { id: 'Vl', label: 'LRA drive (RMS)', min: 0.2, max: 2.5, step: 0.05, value: 2, unit: 'V' },
        { id: 'fd', label: 'LRA drive frequency', min: 120, max: 240, step: 1, value: 175, unit: 'Hz' },
        { id: 'drift', label: 'Resonance shift (temperature, mounting)', min: -20, max: 20, step: 1, value: 0, unit: 'Hz' },
        { id: 'track', type: 'check', label: 'Track the resonance (auto-resonance)', value: false },
        { id: 'od', type: 'check', label: 'Overdrive and braking', value: false },
        { id: 'M', label: 'Device mass', min: 50, max: 300, step: 10, value: 100, unit: 'g' },
        { id: 'cont', type: 'check', label: 'Run continuously', value: false },
        { type: 'buttons', items: [{ id: 'buzz', label: 'Buzz (60 ms)', primary: true }] }
      ], id => {
        if (id === 'buzz') { pulseT = tS; trace = []; pk = 0; }
        if (id === 'type') { const e = V.type === 'erm'; ctl.show('Ve', e); ['Vl', 'fd', 'drift', 'track'].forEach(k => ctl.show(k, !e)); w = 0; x = 0; v = 0; trace = []; }
        key = '';
      });
      V = ctl.values; ['Vl', 'fd', 'drift', 'track'].forEach(k => ctl.show(k, false));
      const ro = kit.readout(box.side, [['f', 'Vibration frequency'], ['a', 'Steady acceleration of the device'], ['I', 'Current now'], ['rt', 'Rise to 90 % · stop to 10 %'], ['note', 'Note']]);
      const p1 = kit.plot(g1, { x: { label: 'time from the start of the pulse (ms)', min: 0, max: 200 }, y: { label: 'device acceleration (g)' }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'drive' }, y: { label: 'steady acceleration (g)', min: 0 }, legend: true }, 190);
      const f0 = () => LRA.f0 + V.drift, kL = () => LRA.m * Math.pow(TAU * f0(), 2), cL = () => LRA.m * TAU * f0() / LRA.Q;
      const fdrive = () => V.track ? f0() : V.fd;
      const ermSteady = Vv => { let ww = 0; for (let k = 0; k < 60; k++) ww = Math.max(0, (ERM.K * (Vv - ERM.R * ERM.I0) / ERM.R - ERM.drag * ww * ww) / (ERM.K * ERM.K / ERM.R)); return ww; };   // fixed point: K(V − K ω)/R = T_f + drag ω²
      const lraSteady = (f, Vr) => { const wd = TAU * f, Vamp = Vr * Math.SQRT2, cc = cL() + LRA.BL * LRA.BL / LRA.R, X = (LRA.BL * Vamp / LRA.R) / Math.hypot(kL() - LRA.m * wd * wd, wd * cc); return LRA.m * wd * wd * X; };
      const loop = kit.loop(dt => {
        tReal += dt;
        const erm = V.type === 'erm', Mdev = V.M / 1000, k2 = [V.type, V.Ve, V.Vl, V.fd, V.drift, V.track, V.M].join('|');
        if (k2 !== key) {
          key = k2; const C = kit.colors();
          if (erm) {
            const pa = [], pf = []; for (let Vv = 0.5; Vv <= 3.6; Vv += 0.1) { const ww = ermSteady(Vv); pa.push([Vv, ERM.mr * ww * ww / Mdev / 9.81]); pf.push([Vv, ww / TAU / 100]); }
            p2.set({ x: { label: 'ERM voltage (V)', min: 0.5, max: 3.6 }, series: [{ pts: pa, label: 'acceleration (g)' }, { pts: pf, label: 'frequency (×100 Hz)', color: C.series[1], dash: [5, 4] }], marks: [{ x: V.Ve, y: ERM.mr * Math.pow(ermSteady(V.Ve), 2) / Mdev / 9.81, label: 'now' }], vlines: [] });
          } else {
            const pa = []; for (let f = 120; f <= 240; f += 1) pa.push([f, lraSteady(f, V.Vl) / Mdev / 9.81]);
            p2.set({ x: { label: 'LRA drive frequency (Hz)', min: 120, max: 240 }, series: [{ pts: pa, label: 'at ' + V.Vl.toFixed(2) + ' V RMS' }], marks: [{ x: fdrive(), y: lraSteady(fdrive(), V.Vl) / Mdev / 9.81, label: 'drive' }], vlines: [{ x: f0(), label: 'resonance' }] });
          }
        }
        const simDt = dt / 10, h = erm ? 1e-4 : 2e-5, n = Math.max(1, Math.round(simDt / h));
        let aDev = 0;
        for (let s = 0; s < n; s++) {
          const tp = pulseT >= 0 ? tS - pulseT : 1e9, on = V.cont || tp < 0.06, brakeWin = V.od && !V.cont && tp >= 0.06 && tp < 0.08;
          if (erm) {
            let u = on ? V.Ve : 0;
            if (V.od && on && tp < 0.015) u = Math.min(5, 1.6 * V.Ve);
            if (brakeWin && w > 20) u = -V.Ve;
            const i = (u - ERM.K * w) / ERM.R, Tm = ERM.K * i, Tf = (w > 0 ? ERM.I0 * ERM.K : 0) + ERM.drag * w * w;
            w = Math.max(0, w + h * (Tm - Tf) / ERM.J); th += w * h; iNow = i;
            aDev = ERM.mr * w * w * Math.cos(th) / Mdev;
          } else {
            const wd = TAU * fdrive(), amp = V.Vl * Math.SQRT2 * (V.od && on && tp < 0.012 ? 2 : 1);
            let u = on ? amp * Math.sin(wd * tS) : 0;
            if (brakeWin) u = clamp(-60 * v, -2 * amp, 2 * amp);   // active braking: drive against the motion
            const i = (u - LRA.BL * v) / LRA.R, Fm = LRA.BL * i - kL() * x - cL() * v;
            v += h * Fm / LRA.m; x += v * h; iNow = i;
            aDev = -Fm / Mdev;
          }
          const tr = pulseT >= 0 ? tS - pulseT : -1;
          if (tr >= 0 && tr <= 0.2 && s % (erm ? 2 : 10) === 0) trace.push([tr * 1000, aDev / 9.81]);
          tS += h;
        }
        shake = aDev / 9.81;
        // envelope timing from the trace
        let rt = '—';
        if (trace.length > 20) {
          const env = []; let mx = 0;
          for (let j = 0; j < trace.length; j++) { let m = 0; for (let q = Math.max(0, j - 30); q <= j; q++) m = Math.max(m, Math.abs(trace[q][1])); env.push([trace[j][0], m]); mx = Math.max(mx, m); }
          const t90 = env.find(q => q[1] >= 0.9 * mx), off = env.filter(q => q[0] > 60), t10 = off.find(q => q[1] <= 0.1 * mx);
          rt = (t90 ? t90[0].toFixed(0) + ' ms' : '…') + ' · ' + (t10 ? (t10[0] - 60).toFixed(0) + ' ms after the pulse' : (off.length ? 'still ringing' : '…'));
          pk = mx;
        }
        const fz = erm ? ermSteady(V.Ve) / TAU : fdrive(), aS = erm ? ERM.mr * Math.pow(ermSteady(V.Ve), 2) / Mdev : lraSteady(fdrive(), V.Vl) / Mdev;
        ro.set('f', fz.toFixed(0) + ' Hz' + (erm ? ' (' + (fz * 60).toFixed(0) + ' rpm)' : ''));
        ro.set('a', (aS / 9.81).toFixed(2) + ' g (' + aS.toFixed(1) + ' m/s²) on ' + V.M + ' g');
        ro.set('I', (1000 * Math.abs(iNow)).toFixed(0) + ' mA');
        ro.set('rt', V.cont ? 'continuous' : rt);
        ro.set('note', erm ? 'frequency and strength are tied: both follow the voltage' : Math.abs(fdrive() - f0()) > 5 ? 'driven ' + (fdrive() - f0()).toFixed(0) + ' Hz off resonance: weak' : 'driven at resonance');
        if (tReal - lastPlot > 0.2 || lastPlot < 0) {
          lastPlot = tReal; const C = kit.colors();
          p1.set({ series: [{ pts: trace.slice(), label: erm ? 'ERM' : 'LRA' }], vlines: [{ x: 60, label: 'pulse ends', color: C.muted }] });
        }
        // drawing: the device shaking (exaggerated) with the actuator inside
        const C = kit.colors(), c = view(st, 680, 220), dx = clamp(shake * 6, -12, 12), dy = erm ? clamp(ERM.mr * w * w * Math.sin(th) / Mdev / 9.81 * 6, -12, 12) : 0;
        c.save(); c.translate(dx, dy);
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(110, 20); c.lineTo(250, 20); c.quadraticCurveTo(270, 20, 270, 40); c.lineTo(270, 190); c.quadraticCurveTo(270, 210, 250, 210); c.lineTo(110, 210); c.quadraticCurveTo(90, 210, 90, 190); c.lineTo(90, 40); c.quadraticCurveTo(90, 20, 110, 20); c.fill(); c.stroke();
        c.fillStyle = C.bg2; c.fillRect(102, 34, 156, 120);
        if (erm) {
          c.fillStyle = C.muted; c.beginPath(); c.arc(180, 180, 16, 0, TAU); c.fill();
          const a = th / 200; c.fillStyle = C.warn; c.beginPath(); c.moveTo(180, 180); c.arc(180, 180, 14, a, a + 2.2); c.closePath(); c.fill();
          text(c, 'ERM', 180, 207, { size: 10, color: C.muted });
        } else {
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(140, 168, 80, 26);
          const mx0 = 180 + clamp(x * 3e4, -22, 22);
          c.strokeStyle = C.text; c.beginPath(); c.moveTo(141, 181); for (let j = 1; j <= 6; j++) c.lineTo(141 + j * (mx0 - 12 - 141) / 6, 181 + (j % 2 ? -5 : 5)); c.stroke();
          c.beginPath(); c.moveTo(219, 181); for (let j = 1; j <= 6; j++) c.lineTo(219 - j * (219 - mx0 - 12) / 6, 181 + (j % 2 ? -5 : 5)); c.stroke();
          c.fillStyle = 'hsl(0 70% 55% / .8)'; c.fillRect(mx0 - 12, 172, 24, 18);
          text(c, 'LRA', 180, 207, { size: 10, color: C.muted });
        }
        c.restore();
        text(c, 'device motion ×thousands; time ×10 slower', 180, 16 + 200 + 2, { size: 10, color: C.muted });
        text(c, (Math.abs(shake)).toFixed(2) + ' g', 180, 100, { size: 20, weight: 700, color: Math.abs(shake) > 0.05 ? C.accent : C.muted });
        // a skin-sensitivity band for reference
        const bx = 330, bw = 320;
        c.fillStyle = C.faint; c.fillRect(bx, 150, bw, 14);
        const fx = f => bx + bw * clamp((Math.log10(f) - Math.log10(20)) / (Math.log10(1000) - Math.log10(20)), 0, 1);
        c.fillStyle = 'hsl(150 60% 45% / .5)'; c.fillRect(fx(150), 150, fx(300) - fx(150), 14);
        c.fillStyle = C.accent; c.beginPath(); c.arc(fx(Math.max(20, fz)), 157, 7, 0, TAU); c.fill();
        [20, 50, 100, 200, 500, 1000].forEach(f => text(c, String(f), fx(f), 180, { size: 10, color: C.muted }));
        text(c, 'vibration frequency (Hz); green: where fingertips feel best', bx + bw / 2, 140, { size: 11, color: C.muted });
        text(c, erm ? 'rotating force m r ω² = ' + (ERM.mr * w * w).toFixed(2) + ' N' : 'magnet travel ' + (Math.abs(x) * 1000).toFixed(2) + ' mm, coil ' + (1000 * Math.abs(iNow)).toFixed(0) + ' mA', bx + bw / 2, 60, { size: 13, weight: 600 });
        text(c, V.cont ? 'running continuously' : pulseT < 0 ? 'press Buzz' : '60 ms pulse' + (V.od ? ' with overdrive and braking' : ''), bx + bw / 2, 86, { size: 12, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rw-solenoid */
  // a DC tubular solenoid: flux linkage λ = L(g) i with L(g) = N² μ0 A/(g + g0); dλ/dt = u − R i; pull F = ½ i² N² μ0 A/(g + g0)²
  // (softly limited by saturation); a plunger with spring and load between end stops; the switch-off path sets u when off.
  // g0: the iron path plus a 0.2 mm non-magnetic shim that stops the plunger sticking by residual magnetism
  const SOL = { N: 1000, A: 150e-6, g0: 2e-4, R: 48, m: 0.02, pre: 0.8, ks: 100, c: 0.5, mu0: 4e-7 * Math.PI };
  SOL.NA = SOL.N * SOL.N * SOL.mu0 * SOL.A; SOL.Fsat = 1.5 * 1.5 * SOL.A / (2 * SOL.mu0);
  Hyper.sim('rw-solenoid', {
    title: 'A solenoid switching',
    blurb: `A 24 V DC tubular solenoid pulling an iron plunger against a spring and a load, switched on and off repeatedly (time runs twenty times slower). The upper trace is the coil current and the plunger travel; the lower graph is the pull against the stroke at the present current, with the spring-plus-load line it must beat.

**Try this**
- Watch the current after switch-on: it rises, then **dips** as the plunger moves (its inductance jumps) — the sign that it has pulled in — then rises slowly to V/R.
- Lengthen the stroke: the pull at the open end falls with the gap squared; at 5 mm with a heavy load it cannot start at all.
- Tick *peak and hold*: after pull-in the current drops to 30 % — the plunger stays in, the heat falls by a factor of ten.
- Switch-off: with a plain diode the current decays slowly and the plunger lets go late; a diode plus Zener releases several times faster; with no protection, the voltage spike is hundreds of volts.
- Lower the supply to 18 V (a hot coil or a weak supply): pull-in gets slower, and marginal loads are no longer lifted.`,
    mount(box, kit) {
      kitColors = kit.colors;
      const S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 220 });
      const [g1, g2] = graphs(box, 2);
      let V = null, lam = 0, i = 0, xp = 0, vp = 0, on = false, tS = 0, tSwitch = 0, pullIn = null, release = null, uNow = 0, trace = [], lastPlot = -1, tReal = 0, closedAt = null, energyOn = 0, spike = 0;
      const ctl = kit.controls(box.side, [
        { id: 'Vs', label: 'Supply voltage', min: 12, max: 36, step: 1, value: 24, unit: 'V' },
        { id: 'stroke', label: 'Stroke (open air gap)', min: 1, max: 5, step: 0.1, value: 3, unit: 'mm' },
        { id: 'load', label: 'Load to lift', min: 0, max: 5, step: 0.1, value: 0.5, unit: 'N' },
        { id: 'sup', type: 'select', label: 'Switch-off protection', options: [['Flyback diode', 'diode'], ['Diode + 36 V Zener', 'zener'], ['None', 'none']], value: 'diode' },
        { id: 'hold', type: 'check', label: 'Peak and hold (30 % after pull-in)', value: false },
        { id: 'auto', type: 'check', label: 'Repeat: 120 ms on, 120 ms off', value: true },
        { type: 'buttons', items: [{ id: 'on', label: 'On', primary: true }, { id: 'off', label: 'Off' }] }
      ], id => {
        if (id === 'on' && !on) { on = true; tSwitch = tS; pullIn = null; closedAt = null; trace = []; }
        if (id === 'off' && on) { on = false; tSwitch = tS; release = null; }
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['pi', 'Pull-in time'], ['rl', 'Release time'], ['I', 'Current now'], ['u', 'Voltage across the coil'], ['P', 'Coil power: pulling · holding'], ['F', 'Pull now · spring + load']]);
      const p1 = kit.plot(g1, { x: { label: 'time since the last switching (ms)', min: 0, max: 120 }, y: { label: 'current (A) · travel (mm/5)' }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'air gap (mm)', min: 0 }, y: { label: 'force (N)', min: 0, max: 20 }, legend: true }, 190);
      const Lg = g => SOL.NA / (g + SOL.g0);
      const pull = (ii, g) => { const F = 0.5 * ii * ii * SOL.NA / Math.pow(g + SOL.g0, 2); return F / (1 + F / SOL.Fsat); };
      const loop = kit.loop(dt => {
        tReal += dt;
        const go = V.stroke / 1000, h = 1e-5, n = Math.round(dt / 20 / h);
        for (let s = 0; s < n; s++) {
          if (V.auto && tS - tSwitch >= 0.12) { on = !on; tSwitch = tS; if (on) { pullIn = null; closedAt = null; trace = []; } else release = null; }
          const g = go - xp, L = Lg(g);
          i = Math.max(0, lam / L);
          const held = V.hold && closedAt != null && tS - closedAt > 0.01;
          if (on) uNow = V.Vs * (held ? 0.3 : 1);
          else if (i > 1e-6) uNow = V.sup === 'diode' ? -0.7 : V.sup === 'zener' ? -36.7 : -Math.min(400, 2000 * i + 50);
          else uNow = 0;
          if (!on && V.sup === 'none') spike = Math.max(spike, -uNow);
          lam = Math.max(0, lam + h * (uNow - SOL.R * i));
          if (!on && lam < 1e-9) lam = 0;
          const F = pull(i, g), Fs = SOL.pre + SOL.ks * xp + V.load;
          let acc = (F - Fs - SOL.c * vp) / SOL.m;
          if (xp <= 0 && acc < 0 && vp <= 0) { acc = 0; vp = 0; }
          vp += acc * h; xp += vp * h;
          if (xp >= go) { xp = go; if (vp > 0) vp = 0; if (closedAt == null && on) { closedAt = tS; pullIn = tS - tSwitch; } }
          if (xp <= 0) { xp = 0; if (vp < 0) vp = 0; if (!on && release == null && closedAt != null) { release = tS - tSwitch; closedAt = null; } }
          const tr = tS - tSwitch;
          if (tr <= 0.12 && s % 20 === 0) trace.push([tr * 1000, i, xp * 1000 / 5, uNow]);
          tS += h;
        }
        const g = go - xp, Fnow = pull(i, g), Fs = SOL.pre + SOL.ks * xp + V.load;
        ro.set('pi', pullIn != null ? (pullIn * 1000).toFixed(1) + ' ms' : on ? (tS - tSwitch > 0.1 ? 'does not pull in!' : '…') : '—');
        ro.set('rl', release != null ? (release * 1000).toFixed(1) + ' ms' : '—');
        ro.set('I', i.toFixed(3) + ' A (steady V/R = ' + (V.Vs / SOL.R).toFixed(2) + ' A)');
        ro.set('u', uNow.toFixed(1) + ' V' + (V.sup === 'none' && spike > 100 ? ' — last spike ' + spike.toFixed(0) + ' V: arcs the switch, kills a transistor' : ''));
        ro.set('P', (V.Vs * V.Vs / SOL.R).toFixed(1) + ' W · ' + (V.hold ? (Math.pow(0.3 * V.Vs, 2) / SOL.R).toFixed(1) + ' W' : 'same (no hold circuit)'));
        ro.set('F', Fnow.toFixed(2) + ' N · ' + Fs.toFixed(2) + ' N');
        if (tReal - lastPlot > 0.2 || lastPlot < 0) {
          lastPlot = tReal; const C = kit.colors(), fc = [], fh = [], sp = [], Iss = V.Vs / SOL.R;
          for (let gg = 0; gg <= V.stroke; gg += V.stroke / 60) { fc.push([gg, pull(Iss, gg / 1000)]); fh.push([gg, pull(0.3 * Iss, gg / 1000)]); sp.push([gg, SOL.pre + SOL.ks * (go - gg / 1000) + V.load]); }
          p1.set({ series: [{ pts: trace.map(q => [q[0], q[1]]), label: 'current (A)' }, { pts: trace.map(q => [q[0], q[2]]), label: 'travel (mm ÷ 5)', color: C.series[1] }], hlines: [{ y: V.Vs / SOL.R, label: 'V/R', color: C.muted }] });
          p2.set({ x: { label: 'air gap (mm): open at the right, closed at 0', min: 0, max: V.stroke }, series: [{ pts: fc, label: 'pull at full current' }, { pts: fh, label: 'pull at 30 % (hold)', color: C.series[2], dash: [4, 3] }, { pts: sp, label: 'spring + load', color: C.series[1] }],
            marks: [{ x: g * 1000, y: Math.min(20, Fnow), label: 'now' }] });
        }
        // drawing: the solenoid in section with its plunger, spring and load; the drive circuit
        const C = kit.colors(), c = view(st, 700, 230), sc = 14, px = 330 - (V.stroke - xp * 1000) * sc;
        const ci = clamp(i / (V.Vs / SOL.R), 0, 1);
        c.fillStyle = C.muted; c.fillRect(150, 50, 200, 16); c.fillRect(150, 154, 200, 16); c.fillRect(330, 50, 20, 120);
        c.fillStyle = 'hsl(28 85% ' + (40 + 20 * ci).toFixed(0) + '% / ' + (0.35 + 0.6 * ci).toFixed(2) + ')'; c.fillRect(160, 66, 170, 22); c.fillRect(160, 132, 170, 22);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(160, 66, 170, 22); c.strokeRect(160, 132, 170, 22);
        text(c, 'coil', 245, 81, { size: 11 });
        c.fillStyle = C.text; c.fillRect(px - 200, 92, 200, 36);
        c.fillStyle = C.bg2; c.fillRect(px, 92, Math.max(0, 330 - px), 36);
        text(c, 'gap ' + (V.stroke - xp * 1000).toFixed(2) + ' mm', 340, 44, { size: 11, color: C.muted, align: 'left' });
        c.strokeStyle = C.series[1]; c.lineWidth = 2; c.beginPath(); c.moveTo(px - 200, 110); for (let j = 1; j <= 8; j++) c.lineTo(px - 200 - j * 8, 110 + (j % 2 ? -8 : 8)); c.stroke();
        kit.arrow(c, px - 280, 110, px - 320, 110, C.warn, 2); text(c, 'load ' + V.load.toFixed(1) + ' N', px - 300, 96, { size: 10, color: C.warn });
        if (Fnow > 0.05) kit.arrow(c, 260, 110, 260 + clamp(Fnow * 4, 0, 60), 110, C.accent, 3);
        // the circuit: supply, switch, coil and the switch-off path
        const X0 = 450;
        S.wire(c, [[X0, 40], [X0 + 200, 40]]); S.wire(c, [[X0, 200], [X0 + 200, 200]]);
        S.battery(c, X0, 170, X0, 70, { label: V.Vs + ' V' }); S.wire(c, [[X0, 70], [X0, 40]]); S.wire(c, [[X0, 170], [X0, 200]]);
        S.inductor(c, X0 + 120, 40, X0 + 120, 120, { label: 'coil' });
        S.switch(c, X0 + 120, 130, X0 + 120, 200, { closed: on });
        S.wire(c, [[X0 + 120, 120], [X0 + 120, 130]]);
        if (V.sup !== 'none') {
          S.wire(c, [[X0 + 120, 40], [X0 + 190, 40]]); S.wire(c, [[X0 + 120, 125], [X0 + 190, 125]]);
          S.diode(c, X0 + 190, 125, X0 + 190, 40, { on: !on && i > 1e-4, kind: V.sup === 'zener' ? 'zener' : undefined });
          text(c, V.sup === 'zener' ? 'diode + Zener' : 'flyback diode', X0 + 190, 150, { size: 10, color: C.muted });
        } else if (!on && spike > 100) text(c, 'spike!', X0 + 160, 170, { size: 13, weight: 700, color: C.bad });
        text(c, (on ? 'ON' : 'OFF') + '  ' + i.toFixed(2) + ' A', X0 + 60, 222, { size: 12, weight: 600, color: on ? C.accent : C.muted });
        text(c, 'plunger travel ' + (xp * 1000).toFixed(2) + ' of ' + V.stroke + ' mm (time ×20 slower)', 250, 222, { size: 11, color: C.muted });
        if (on) spike = 0;
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

})();
