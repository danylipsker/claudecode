/* HYPER-MOTORS · sims/hydraulic.js — hydraulic motors and the system around them (prefix hy-).
 *   hy-motor-bench     a hydraulic motor on a test bench: pump flow, relief, load; torque from pressure, speed from flow,
 *                      leakage and friction, starting torque, efficiency against speed (five motor types)
 *   hy-gear-vane       inside a gear motor or a balanced vane motor: pockets carried round, vane springs, leakage with
 *                      temperature (params { type: 'gear' | 'vane' })
 *   hy-axial-piston    swash-plate and bent-axis motors in section, variable displacement, overspeed limit
 *   hy-radial-piston   cam-lobe and crankshaft radial-piston motors, torque ripple, two-speed and freewheel
 *   hy-orbital         a geroler/gerotor set: the star orbits N times per revolution, chambers filling and emptying
 *   hy-sizing          sizing a winch drive: load → motor → pump → electric motor, power flow and losses
 *   hy-power-unit      a hydraulic power unit in ISO 1219 symbols: accumulator, relief, filters with bypass, tank level
 *   hy-motor-valves    a motor with a 4/3 valve, throttle or compensated flow control, centre conditions and crossport
 *                      reliefs; a dynamic model with oil compressibility (stopping a flywheel)
 *   hy-counterbalance  a winch lowering and holding: no valve, pilot-operated check or counterbalance valve, SAHR brake, creep
 *   hy-hydrostatic     a closed-loop hydrostatic drive on a slope: joystick pump, two-speed motor, charge, reliefs, anti-stall
 *   hy-cleanliness     ISO 4406 codes: ingress against filtration, beta ratios, kidney loop, new oil
 *   hy-heat            the heat balance of a power unit, cooler and tank, the viscosity window and cold-start suction
 */
(function () {
  'use strict';

  const TAU = 2 * Math.PI;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fin = (x, d) => (Number.isFinite(x) ? x : (d || 0));
  const bar = p => (p / 1e5).toFixed(0) + ' bar';
  const lpm = q => (q * 60000).toFixed(1) + ' L/min';
  const kw = p => (p / 1000).toFixed(p < 10000 ? 2 : 1) + ' kW';
  // a row of graphs under the stage
  function graphs(box, n) {
    const gb = document.createElement('div');
    gb.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;padding:4px 10px 10px';
    box.stage.appendChild(gb);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  }
  // start a frame on a W0 × H0 design grid, centred and scaled to fit; the caller restores
  function frame(st, W0, H0) {
    const c = st.begin(), s = Math.min(st.W / W0, st.H / H0);
    c.save(); c.translate((st.W - W0 * s) / 2, (st.H - H0 * s) / 2); c.scale(s, s);
    return c;
  }
  // translucent fills for oil at pressure (red) and returning (blue)
  const redA = (C, a) => (C.dark ? 'rgba(255,92,92,' : 'rgba(214,40,40,') + clamp(a, 0, 1).toFixed(2) + ')';
  const blueA = (C, a) => (C.dark ? 'rgba(90,162,255,' : 'rgba(31,99,214,') + clamp(a, 0, 1).toFixed(2) + ')';
  const metal = C => (C.dark ? '#59627f' : '#aab1c4');
  // a rolling history for time plots
  function history(max) {
    const h = [];
    return { push(row) { h.push(row); if (h.length > max) h.shift(); }, col(i) { return h.map(r => [r[0], r[i]]); }, clear() { h.length = 0; }, get length() { return h.length; } };
  }
  // an orifice, linear below 2 bar so the solver stays smooth near zero: Q = K·sign(Δp)·√|Δp|
  const orf = (K, dp) => { const a = Math.abs(dp), t = 2e5; return K * Math.sign(dp) * (a > t ? Math.sqrt(a) : a / Math.sqrt(t)); };

  /* ================================================================ motor models shared by several sims */
  // typical data of five motor families at a rated point (pressure pr, speed nr) — for teaching
  const MT = {
    gear: { name: 'External gear motor', Vg: 16, pr: 200, nr: 2000, ev: 0.92, ehm: 0.86, es: 0.75, nmin: 400, nmax: 3500 },
    vane: { name: 'Balanced vane motor', Vg: 50, pr: 160, nr: 1500, ev: 0.93, ehm: 0.88, es: 0.82, nmin: 80, nmax: 2500 },
    axial: { name: 'Axial-piston motor (bent axis)', Vg: 28, pr: 350, nr: 3000, ev: 0.97, ehm: 0.94, es: 0.9, nmin: 30, nmax: 5000 },
    radial: { name: 'Radial-piston motor (cam lobe)', Vg: 1000, pr: 300, nr: 100, ev: 0.97, ehm: 0.95, es: 0.93, nmin: 1, nmax: 250 },
    orbital: { name: 'Orbital motor (geroler)', Vg: 160, pr: 175, nr: 300, ev: 0.9, ehm: 0.86, es: 0.8, nmin: 15, nmax: 600 }
  };
  // leakage ∝ Δp (laminar, independent of speed); friction torque = a constant part + a part ∝ Δp + a part ∝ speed
  function hydModel(t, VgCC) {
    const Vg = VgCC * 1e-6, pr = t.pr * 1e5, Tr = Vg * pr / TAU, f = 1 - t.ehm;
    const cL = (1 - t.ev) * Vg * t.nr / 60 / pr;
    const loss = (dp, n) => Tr * f * (0.25 + 0.6 * dp / pr + 0.15 * Math.abs(n) / t.nr);
    const torque = (dp, n) => Vg * dp / TAU - loss(dp, n);
    const dpFor = (T, n) => (T + Tr * f * (0.25 + 0.15 * Math.abs(n) / t.nr)) / (Vg / TAU - Tr * f * 0.6 / pr);
    const dpStart = T => TAU * T / (Vg * t.es);
    return { Vg, pr, Tr, cL, loss, torque, dpFor, dpStart, t };
  }

  /* ================================================================ hy-motor-bench */
  Hyper.sim('hy-motor-bench', {
    title: 'A hydraulic motor on the test bench',
    blurb: `An electric motor drives a fixed pump; a relief valve limits the pressure; the hydraulic motor turns a brake drum that loads it with a constant torque. Its internal leakage leaves through the dashed case-drain line. The left graph is the motor's speed against the load torque at this flow (and at half of it); the right graph is its efficiency against speed at the present pressure.

**Try this**
- Raise the load: the gauge climbs in step with the torque, while the speed hardly changes — only the extra leakage slows it.
- Raise the flow: the speed rises in proportion; the pressure stays where the load puts it.
- Turn the flow down to a few litres a minute: the volumetric efficiency collapses, because the leakage is the same few litres whatever the speed. Compare the gear motor with the radial-piston motor.
- Set a load near the relief limit and press *Stop and restart*: static friction makes the starting torque lower than the running torque, and the motor may not break away. The relief valve takes all the flow and it becomes heat.
- Raise the load above the relief setting: the motor stalls and every kilowatt of the pump goes into the oil.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const [g1, g2] = graphs(box, 2);
      let V = null, n = 0, stopped = true, ph = {}, ang = 0, lastPlot = -1, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Motor', options: Object.keys(MT).map(k => [MT[k].name, k]), value: 'axial' },
        { id: 'Vg', label: 'Displacement', min: 4, max: 2000, step: 1, value: 28, unit: 'cm³/rev', log: true },
        { id: 'Q', label: 'Pump flow', min: 1, max: 150, step: 0.5, value: 60, unit: 'L/min', log: true },
        { id: 'load', label: 'Load torque, % of the theoretical torque at 250 bar', min: 0, max: 130, step: 1, value: 50, unit: '%' },
        { id: 'relief', label: 'Relief-valve setting', min: 50, max: 400, step: 5, value: 250, unit: 'bar' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Stop and restart', primary: true }] }
      ], id => {
        if (id === 'type') { ctl.set('Vg', MT[V.type].Vg); const t0 = MT[V.type]; ctl.set('Q', clamp(Math.round(t0.Vg * t0.nr * 0.6 / 1000), 2, 140)); ctl.set('relief', Math.min(400, t0.pr + 30)); n = 0; stopped = true; }
        if (id === 'restart') { n = 0; stopped = true; }
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['dp', 'Pressure difference'], ['n', 'Speed'], ['T', 'Torque (theoretical at this Δp)'], ['q', 'Flow: motor / leakage / over relief'], ['P', 'Hydraulic in / shaft out'], ['eff', 'η_v · η_hm = η_t'], ['heat', 'Heat into the oil'], ['st', 'State']]);
      const p1 = kit.plot(g1, { x: { label: 'load torque (N·m)', min: 0 }, y: { label: 'speed (rpm)', min: 0 }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'speed (rpm)', log: true }, y: { label: 'efficiency (%)', min: 0, max: 100 }, legend: true }, 190);
      let out = { dp: 0, Qr: 0, Qm: 0, leak: 0, TL: 0 };
      function step(dt) {
        const m = hydModel(MT[V.type], V.Vg), Q = V.Q / 60000, pset = V.relief * 1e5;
        const TL = V.load / 100 * m.Vg * 250e5 / TAU;
        const dpCap = Math.min(pset, Q / m.cL);                 // with less flow than the leakage, pressure cannot build
        let dp;
        if (stopped) {
          const need = m.dpStart(TL);
          if (need <= dpCap && Q > m.cL * need) { stopped = false; dp = need; }
          else dp = dpCap;
        }
        if (!stopped) {
          const dpRun = m.dpFor(TL, n);
          if (dpRun <= dpCap) {
            dp = dpRun;
            const nT = Math.max(0, (Q - m.cL * dp) / m.Vg * 60);
            n += (nT - n) * Math.min(1, dt / 0.3);
          } else {
            dp = dpCap;
            const Tav = m.torque(dp, n), rate = Math.max(m.t.nr, 60) / 0.8;
            n -= dt * rate * clamp((TL - Tav) / Math.max(TL, 1e-6), 0.05, 1);
            if (n <= 0) { n = 0; stopped = true; }
          }
        }
        const Qm = m.Vg * n / 60, leak = m.cL * dp, Qr = Math.max(0, Q - Qm - leak);
        out = { m, dp, Qr, Qm, leak, TL, Q, pset };
      }
      const loop = kit.loop(dt => {
        t += dt;
        for (let k = 0; k < 4; k++) step(dt / 4);
        const o = out, m = o.m, C = kit.colors(), w = n * TAU / 60;
        const Pin = o.dp * o.Q, Pout = o.TL * w, Pm = o.dp * (o.Qm + o.leak);
        const ev = o.Qm + o.leak > 0 ? o.Qm / (o.Qm + o.leak) : 0, ehm = o.dp > 0 && n > 0 ? o.TL / (m.Vg * o.dp / TAU) : 0, et = Pm > 0 ? Pout / Pm : 0;
        ro.set('dp', bar(o.dp) + (o.Qr > 1e-7 ? '  (relief open)' : ''));
        ro.set('n', n.toFixed(n < 20 ? 1 : 0) + ' rpm' + (n > 0 && n < m.t.nmin ? ' — below smooth running' : n > m.t.nmax ? ' — above the maximum!' : ''));
        ro.set('T', o.TL.toFixed(1) + ' N·m (' + (m.Vg * o.dp / TAU).toFixed(1) + ')');
        ro.set('q', lpm(o.Qm) + ' / ' + lpm(o.leak) + ' / ' + lpm(o.Qr));
        ro.set('P', kw(Pin) + ' / ' + kw(Pout));
        ro.set('eff', (100 * ev).toFixed(0) + ' % · ' + (100 * ehm).toFixed(0) + ' % = ' + (100 * et).toFixed(0) + ' %');
        ro.set('heat', kw(Math.max(0, Pin - Pout)));
        ro.set('st', stopped ? (o.TL > 0 && m.dpStart(o.TL) > o.dp ? 'stalled: starting torque not reached' : 'stopped') : o.Qr > 1e-7 && n < 1 ? 'stalling' : 'running');
        if (t - lastPlot > 0.25 || lastPlot < 0) {
          lastPlot = t;
          const curve = (Q) => {
            const pts = [], Tmax = Math.max(1e-3, m.torque(Math.min(o.pset, Q / m.cL), 0));
            for (let i = 0; i <= 60; i++) {
              const T = Tmax * i / 60; let nn = Q / m.Vg * 60, dp = 0;
              for (let it = 0; it < 3; it++) { dp = m.dpFor(T, nn); nn = Math.max(0, (Q - m.cL * dp) / m.Vg * 60); }
              if (dp > Math.min(o.pset, Q / m.cL)) break;
              pts.push([T, nn]);
            }
            return pts;
          };
          p1.set({ series: [{ pts: curve(o.Q), label: 'at ' + (o.Q * 60000).toFixed(0) + ' L/min' }, { pts: curve(o.Q / 2), label: 'at half the flow', dash: [5, 4] }],
            marks: [{ x: o.TL, y: n, label: 'now' }], vlines: [{ x: m.Vg * o.pset * m.t.es / TAU, label: 'start limit' }] });
          const dpE = Math.max(o.dp, 20e5), ev1 = [], eh1 = [], et1 = [];
          const n0 = Math.max(0.3, m.t.nmin / 5), n1 = m.t.nmax;
          for (let i = 0; i <= 50; i++) {
            const nn = n0 * Math.pow(n1 / n0, i / 50), q = m.Vg * nn / 60, evv = q / (q + m.cL * dpE), ehh = Math.max(0, m.torque(dpE, nn) / (m.Vg * dpE / TAU));
            ev1.push([nn, 100 * evv]); eh1.push([nn, 100 * ehh]); et1.push([nn, 100 * evv * ehh]);
          }
          p2.set({ x: { label: 'speed (rpm) at ' + (dpE / 1e5).toFixed(0) + ' bar', log: true, min: n0, max: n1 },
            series: [{ pts: ev1, label: 'volumetric' }, { pts: eh1, label: 'hydromechanical' }, { pts: et1, label: 'overall' }],
            marks: n > n0 ? [{ x: n, y: 100 * et, label: 'now' }] : [], vlines: [{ x: m.t.nmin, label: 'min smooth' }] });
        }
        // ---- the bench, on a 700 × 290 design grid
        const c = frame(st, 700, 290), col = S.col, hp = o.dp > 5e5;
        const adv = (key, q, sc) => { ph[key] = (ph[key] || 0) + dt * (sc || 60) * clamp(q / 1e-3, 0, 3); return ph[key]; };
        const header = [[110, 194], [110, 80], [360, 80], [360, 124]];
        S.line(c, [[110, 246], [110, 256]], { state: o.Q > 0 ? 'suction' : 'idle' });
        S.line(c, header, { state: hp ? 'pressure' : 'idle' });
        S.line(c, [[150, 76], [150, 80]], { state: hp ? 'pressure' : 'idle' });
        S.line(c, [[200, 80], [200, 101]], { state: hp ? 'pressure' : 'idle' });
        S.line(c, [[200, 159], [200, 160]], { state: o.Qr > 1e-7 ? 'return' : 'idle' });
        S.line(c, [[360, 176], [360, 250]], { state: n > 0.05 ? 'return' : 'idle' });
        S.line(c, [[374, 160], [410, 160], [410, 250]], { state: o.leak > 1e-8 ? 'return' : 'idle', kind: 'drain' });
        S.junction(c, 150, 80); S.junction(c, 200, 80);
        if (o.Q > 0) S.flow(c, header, adv('h', o.Q), { color: col('pressure') });
        if (o.Qr > 1e-7) S.flow(c, [[200, 80], [200, 160]], adv('r', o.Qr), { color: col('pressure') });
        if (o.Qm > 1e-8) S.flow(c, [[360, 176], [360, 250]], adv('m', o.Qm), { color: col('return') });
        if (o.leak > 1e-8) S.flow(c, [[374, 160], [410, 160], [410, 250]], adv('l', o.leak, 400), { color: col('return'), r: 1.8 });
        S.pump(c, 110, 220, { motor: true });
        S.tank(c, 110, 256); S.tank(c, 200, 170); S.tank(c, 360, 260); S.tank(c, 410, 260);
        S.pressureValve(c, 200, 130, { kind: 'relief', rot: 180, open: clamp(o.Qr / Math.max(o.Q, 1e-9), 0, 1) });
        S.gauge(c, 150, 55, { frac: o.dp / 400e5, value: bar(o.dp) });
        ang += TAU * (n / 60) / Math.max(1, n / 40) * dt;              // drawn at most about 0.7 rev/s
        S.motor(c, 360, 150, { angle: ang });
        kit.label(c, (o.Q * 60000).toFixed(1) + ' L/min', 102, 150, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'relief ' + V.relief + ' bar', 218, 180, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'case drain ' + (o.leak * 60000).toFixed(2) + ' L/min', 418, 205, { color: C.muted, size: 10, align: 'left' });
        // the brake drum
        const dx = 540, dy = 150, R = 58;
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(388, dy); c.lineTo(dx, dy); c.stroke();
        c.fillStyle = C.surface2 || C.bg2; c.beginPath(); c.arc(dx, dy, R, 0, TAU); c.fill(); c.stroke();
        c.save(); c.translate(dx, dy); c.rotate(ang);
        c.strokeStyle = C.muted; c.lineWidth = 2; for (let k = 0; k < 6; k++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(0, 0); c.lineTo(R - 8, 0); c.stroke(); }
        c.restore();
        c.strokeStyle = C.warn; c.lineWidth = 6; c.beginPath(); c.arc(dx, dy, R + 5, -Math.PI * 0.85, -Math.PI * 0.15); c.stroke();
        if (o.TL > 0) kit.arrow(c, dx + R + 26, dy - 30, dx + R + 26, dy + 20, C.warn, 2.5);
        kit.label(c, 'brake: load ' + o.TL.toFixed(0) + ' N·m', dx, dy - R - 20, { color: C.text, size: 12, weight: 700 });
        kit.label(c, n.toFixed(n < 20 ? 1 : 0) + ' rpm', dx, dy + R + 22, { color: C.accent, size: 16, weight: 700 });
        kit.label(c, MT[V.type].name + ', ' + V.Vg.toFixed(0) + ' cm³/rev', 360, 20, { color: C.text, size: 12, weight: 700 });
        if (o.Qr > 1e-7) kit.label(c, 'relief open: ' + kw(o.dp * o.Qr) + ' becomes heat', 230, 282, { color: C.bad, size: 12, weight: 700, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ hy-gear-vane */
  const GEAR = { m: 2.5, z: 12, name: 'External gear motor', ev: 0.92, pr: 200, nr: 2000, ehm: 0.86 };
  const VANE = { R: 40, r: 35, z: 10, name: 'Balanced vane motor', ev: 0.93, pr: 160, nr: 1500, ehm: 0.88 };
  function gearPath(c, cx, cy, z, ra, rf, a0) {
    const p = TAU / z; c.beginPath();
    for (let k = 0; k < z; k++) {
      const a = a0 + k * p;
      [[a - 0.5 * p, rf], [a - 0.24 * p, rf], [a - 0.12 * p, ra], [a + 0.12 * p, ra], [a + 0.24 * p, rf]].forEach(([aa, r], i) => {
        const x = cx + r * Math.cos(aa), y = cy + r * Math.sin(aa);
        if (k === 0 && i === 0) c.moveTo(x, y); else c.lineTo(x, y);
      });
    }
    c.closePath();
  }
  Hyper.sim('hy-gear-vane', {
    title: 'Inside a gear motor and a vane motor',
    blurb: `A cut through the motor, looking along the shaft. Oil at the load's pressure enters at the bottom (red) and leaves at the top (blue). In the **gear motor** the tooth spaces carry it round the outside of both gears; the teeth leaving the mesh on the pressure side are pushed round. In the **vane motor** the chambers between vanes grow where the oval ring widens — those are fed with pressure oil — and shrink where it narrows. The graph is the volumetric efficiency against speed.

**Try this**
- Make the gears (or rotor) wider: the displacement grows in proportion — that is how a series of sizes shares one frame.
- Lower the flow until the motor crawls: leakage takes a bigger and bigger share, and the efficiency curve shows why gear motors are poor below a few hundred rpm.
- Heat the oil to 80 °C: it thins, the leakage rises and the motor slows at the same flow.
- In the vane motor, untick *vane springs* and press *Stop and restart*: at a standstill nothing pushes the vanes out, the oil short-circuits round the rotor and the motor cannot start. Tick them again.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const [g1] = graphs(box, 1);
      const type0 = params && params.type === 'vane' ? 'vane' : 'gear';
      let V = null, n = 0, ang = 0, vaneOut = 1, lastPlot = -1, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Motor', options: [['External gear motor', 'gear'], ['Balanced vane motor', 'vane']], value: type0 },
        { id: 'b', label: 'Width of gears or rotor', min: 10, max: 50, step: 1, value: type0 === 'vane' ? 25 : 24, unit: 'mm' },
        { id: 'Q', label: 'Flow into the motor', min: 0.5, max: 100, step: 0.5, value: 30, unit: 'L/min', log: true },
        { id: 'dp', label: 'Pressure difference (set by the load)', min: 10, max: 250, step: 5, value: 150, unit: 'bar' },
        { id: 'T', label: 'Oil temperature (VG 46)', min: 10, max: 90, step: 1, value: 50, unit: '°C' },
        { id: 'springs', type: 'check', label: 'Vane springs (vane motor)', value: true },
        { type: 'buttons', items: [{ id: 'restart', label: 'Stop and restart', primary: true }] }
      ], id => {
        if (id === 'restart') { n = 0; if (!V.springs) vaneOut = 0; }
        if (id === 'type') { ctl.show('springs', V.type === 'vane'); n = 0; vaneOut = 1; ctl.set('b', V.type === 'vane' ? 25 : 24); }
        lastPlot = -1;
      });
      V = ctl.values; ctl.show('springs', V.type === 'vane');
      const ro = kit.readout(box.side, [['Vg', 'Displacement'], ['T', 'Torque'], ['n', 'Speed'], ['leak', 'Leakage'], ['eff', 'η_v · η_hm'], ['nu', 'Oil viscosity'], ['st', 'State']]);
      const plot = kit.plot(g1, { x: { label: 'speed (rpm)', log: true, min: 20, max: 4000 }, y: { label: 'volumetric efficiency (%)', min: 0, max: 100 }, legend: true }, 180);
      const nu = T => kit.fluid.oilViscosity(46, T) * 1e6;
      const model = () => {
        const g = V.type === 'gear', P = g ? GEAR : VANE;
        const VgCC = g ? TAU * P.m * P.m * P.z * V.b / 1000 : TAU * V.b * (P.R * P.R - P.r * P.r) / 1000;
        // leakage grows as the oil thins; clearances and film effects make it weaker than the 1/ν of a fixed gap
        const Vg = VgCC * 1e-6, cL = (1 - P.ev) * Vg * P.nr / 60 / (P.pr * 1e5) * Math.sqrt(46 / Math.max(1, nu(V.T)));
        const ehm = clamp(P.ehm - 0.03 * Math.log10(Math.max(1, nu(V.T)) / 46), 0.6, 0.95);
        return { g, P, VgCC, Vg, cL, ehm };
      };
      const loop = kit.loop(dt => {
        t += dt;
        const M = model(), C = kit.colors(), dp = V.dp * 1e5, Q = V.Q / 60000;
        if (M.g || V.springs) vaneOut = 1;
        else vaneOut = Math.max(vaneOut > 0.99 && n > 150 ? 1 : 0, clamp((n - 100) / 150, 0, 1));
        const leak = Math.min(Q, M.cL * dp), nT = vaneOut * Math.max(0, (Q - leak) / M.Vg * 60);
        n += (nT - n) * Math.min(1, dt / 0.3);
        const T = vaneOut * M.Vg * dp * M.ehm / TAU, ev = Q > 0 ? (M.Vg * n / 60) / Q : 0;
        ro.set('Vg', M.VgCC.toFixed(1) + ' cm³/rev');
        ro.set('T', T.toFixed(1) + ' N·m');
        ro.set('n', n.toFixed(0) + ' rpm');
        ro.set('leak', lpm(vaneOut < 0.5 ? Q : leak));
        ro.set('eff', (100 * clamp(ev, 0, 1)).toFixed(0) + ' % · ' + (100 * M.ehm).toFixed(0) + ' %');
        ro.set('nu', nu(V.T).toFixed(0) + ' mm²/s at ' + V.T + ' °C');
        ro.set('st', vaneOut < 0.5 ? 'does not start: the vanes are not out, the oil bypasses them' : n < (M.g ? 400 : 80) ? 'below smooth running speed' : 'running');
        if (t - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = t;
          const s1 = [], s2 = [], cHot = (1 - M.P.ev) * M.Vg * M.P.nr / 60 / (M.P.pr * 1e5) * Math.sqrt(46 / nu(80));
          for (let i = 0; i <= 50; i++) { const nn = 20 * Math.pow(200, i / 50), q = M.Vg * nn / 60; s1.push([nn, 100 * q / (q + M.cL * dp)]); s2.push([nn, 100 * q / (q + cHot * dp)]); }
          plot.set({ series: [{ pts: s1, label: 'at ' + V.T + ' °C, ' + V.dp + ' bar' }, { pts: s2, label: 'at 80 °C', dash: [5, 4] }], marks: n > 20 ? [{ x: n, y: 100 * ev, label: 'now' }] : [] });
        }
        // ---- drawing, 640 × 300 design grid
        const c = frame(st, 640, 300), cx = 300, cy = 150;
        const shown = n / 60 * TAU / Math.max(1, n / 40);            // drawn at most about 0.7 rev/s
        ang += shown * dt;
        c.lineWidth = 2;
        if (M.g) {
          const k = 3.2, rp = M.P.m * M.P.z / 2 * k, ra = rp + M.P.m * k, rf = rp - 1.25 * M.P.m * k, xl = cx - rp, xr = cx + rp;
          // housing: the pressure side below, the outlet side above
          c.save(); c.beginPath(); c.arc(xl, cy, ra + 4, 0, TAU); c.moveTo(xr + ra + 4, cy); c.arc(xr, cy, ra + 4, 0, TAU); c.clip();
          c.fillStyle = blueA(C, 0.35); c.fillRect(cx - 200, cy - 120, 400, 120);
          c.fillStyle = redA(C, 0.45); c.fillRect(cx - 200, cy, 400, 120);
          c.restore();
          c.strokeStyle = C.text; c.beginPath(); c.arc(xl, cy, ra + 4, Math.PI * 0.2, Math.PI * 1.8); c.stroke(); c.beginPath(); c.arc(xr, cy, ra + 4, -Math.PI * 0.8, Math.PI * 0.8); c.stroke();
          c.fillStyle = metal(C); c.strokeStyle = C.text; c.lineWidth = 1.5;
          gearPath(c, xl, cy, M.P.z, ra, rf, ang); c.fill(); c.stroke();
          gearPath(c, xr, cy, M.P.z, ra, rf, Math.PI + Math.PI / M.P.z - ang); c.fill(); c.stroke();
          // oil carried in the tooth spaces
          for (const [gx, a0, s] of [[xl, ang, 1], [xr, Math.PI + Math.PI / M.P.z - ang, -1]]) {
            for (let j = 0; j < M.P.z; j++) {
              const a = a0 + (j + 0.5) * TAU / M.P.z, x = gx + (ra + rf) / 2 * Math.cos(a), y = cy + (ra + rf) / 2 * Math.sin(a);
              if (Math.abs(x - cx) < rp * 0.6) continue;
              kit.dot(c, x, y, 3.2, y > cy ? S_col(kit, 'pressure') : S_col(kit, 'return'));
            }
            c.fillStyle = C.text; c.beginPath(); c.arc(gx, cy, 7, 0, TAU); c.fill();
            if (s > 0) { c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.arc(gx, cy, 18, -1.2, 1.2); c.stroke(); kit.arrow(c, gx + 18 * Math.cos(1.0), cy + 18 * Math.sin(1.0), gx + 18 * Math.cos(1.25), cy + 18 * Math.sin(1.25), C.accent, 3); }
          }
          kit.label(c, 'output shaft', xl, cy - ra - 22, { color: C.text, size: 11, weight: 700 });
          kit.label(c, 'idler', xr, cy - ra - 22, { color: C.muted, size: 11 });
        } else {
          const k = 2.6, R = M.P.R * k, r = M.P.r * k, r0 = r - 4, z = M.P.z;
          const rho = th => (R + r) / 2 - (R - r) / 2 * Math.cos(2 * th);
          const dr = th => (R - r) * Math.sin(2 * th);
          // chambers between vanes
          for (let j = 0; j < z; j++) {
            const a1 = ang + j * TAU / z, a2 = a1 + TAU / z, am = (a1 + a2) / 2, sgn = dr(am);
            c.beginPath();
            for (let i = 0; i <= 12; i++) { const a = a1 + (a2 - a1) * i / 12; const x = cx + rho(a) * Math.cos(a), y = cy + rho(a) * Math.sin(a); i ? c.lineTo(x, y) : c.moveTo(x, y); }
            for (let i = 12; i >= 0; i--) { const a = a1 + (a2 - a1) * i / 12; c.lineTo(cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)); }
            c.closePath();
            c.fillStyle = vaneOut < 0.5 ? 'hsl(300 40% 55% / .35)' : Math.abs(sgn) < (R - r) * 0.25 ? 'hsl(270 30% 60% / .25)' : sgn > 0 ? redA(C, 0.5) : blueA(C, 0.4);
            c.fill();
          }
          // the cam ring
          c.strokeStyle = C.text; c.lineWidth = 2.5; c.beginPath();
          for (let i = 0; i <= 120; i++) { const a = TAU * i / 120, x = cx + rho(a) * Math.cos(a), y = cy + rho(a) * Math.sin(a); i ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.stroke();
          c.beginPath(); c.arc(cx, cy, R + 16, 0, TAU); c.stroke();
          // ports: inlet (pressure) where the ring widens, outlet where it narrows
          for (const [a, s] of [[Math.PI / 4, 1], [5 * Math.PI / 4, 1], [3 * Math.PI / 4, -1], [7 * Math.PI / 4, -1]]) {
            c.fillStyle = s > 0 ? redA(C, 0.8) : blueA(C, 0.8);
            c.beginPath(); c.arc(cx + (R + 9) * Math.cos(a), cy + (R + 9) * Math.sin(a), 6, 0, TAU); c.fill();
          }
          c.fillStyle = metal(C); c.beginPath(); c.arc(cx, cy, r0, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
          for (let j = 0; j < z; j++) {
            const a = ang + j * TAU / z, tip = r0 + (rho(a) - r0) * vaneOut, base = r0 - 18;
            c.save(); c.translate(cx, cy); c.rotate(a);
            c.fillStyle = C.text; c.fillRect(base, -2.5, tip - base, 5);
            if (!M.g && V.springs) { c.strokeStyle = C.warn; c.lineWidth = 1; c.beginPath(); for (let i = 0; i <= 6; i++) c.lineTo(base - 12 + 12 * i / 6, (i % 2 ? 3 : -3)); c.stroke(); }
            c.restore();
          }
          c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 9, 0, TAU); c.fill();
          kit.label(c, 'inlet zones red, outlet zones blue — two of each, facing: balanced', cx, 292, { color: C.muted, size: 11 });
        }
        kit.label(c, 'IN ' + V.dp + ' bar', cx, 286 - (M.g ? 0 : 16), { color: C.bad, size: 12, weight: 700 });
        kit.label(c, 'OUT', cx, 14, { color: C.accent, size: 12, weight: 700 });
        c.textAlign = 'left';
        kit.label(c, M.P.name, 470, 60, { color: C.text, size: 13, weight: 700, align: 'left' });
        kit.label(c, M.VgCC.toFixed(1) + ' cm³/rev', 470, 84, { color: C.text, size: 12, align: 'left' });
        kit.label(c, n.toFixed(0) + ' rpm', 470, 108, { color: C.accent, size: 16, weight: 700, align: 'left' });
        kit.label(c, (vaneOut * M.Vg * V.dp * 1e5 * M.ehm / TAU).toFixed(1) + ' N·m', 470, 132, { color: C.text, size: 13, align: 'left' });
        kit.label(c, 'drawn ' + Math.max(1, n / 40).toFixed(0) + '× slower', 470, 156, { color: C.muted, size: 11, align: 'left' });
        if (vaneOut < 0.5) kit.label(c, 'vanes retracted: no torque', 470, 190, { color: C.bad, size: 12, weight: 700, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
  const S_col = (kit, s) => kit.fsym.col(s);

  /* ================================================================ hy-axial-piston */
  const AX = {
    swash: { name: 'Swash-plate motor', z: 9, d: 16, D: 60, amax: 18, f: a => Math.tan(a), inv: x => Math.atan(x), ev: 0.96, ehm: 0.93, nmax1: 4500 },
    bent: { name: 'Bent-axis motor', z: 7, d: 20, D: 70, amax: 40, f: a => Math.sin(a), inv: x => Math.asin(clamp(x, -1, 1)), ev: 0.97, ehm: 0.95, nmax1: 3600 }
  };
  Hyper.sim('hy-axial-piston', {
    title: 'Axial-piston motors: swash plate and bent axis',
    blurb: `A section through an axial-piston motor. The pistons turn with the cylinder block; those on the pressure side (red chambers) are pushed out against the inclined swash plate — or, in the bent-axis motor, push on the drive flange through their rods — and the sideways part of that force turns the shaft. On the other side the incline pushes the pistons back and they expel their oil (blue). The graphs show speed and torque against the displacement setting at the present flow and pressure.

**Try this**
- Reduce the displacement setting: the angle and the pistons' stroke shrink, the speed rises and the torque falls — the power stays the same. This is how a variable motor works as a stepless gearbox.
- Keep going towards the minimum: the speed passes the motor's limit (red). A variable motor on a big flow must never swivel back unloaded.
- Raise the pressure: torque rises, speed does not.
- Switch to the bent-axis design: the block tilts to 40°, so the same pistons give more stroke — and more displacement.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const [g1, g2] = graphs(box, 2);
      let V = null, phi = 0, lastPlot = -1, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'design', type: 'select', label: 'Design', options: [['Swash plate (9 pistons, up to 18°)', 'swash'], ['Bent axis (7 pistons, up to 40°)', 'bent']], value: 'swash' },
        { id: 'x', label: 'Displacement setting, % of maximum', min: 5, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'dp', label: 'Pressure difference', min: 20, max: 420, step: 5, value: 300, unit: 'bar' },
        { id: 'Q', label: 'Flow into the motor', min: 5, max: 250, step: 1, value: 100, unit: 'L/min', log: true }
      ], () => { lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Angle'], ['Vg', 'Displacement'], ['n', 'Speed (limit)'], ['T', 'Torque'], ['P', 'Shaft power'], ['f', 'Piston passing frequency']]);
      const pn = kit.plot(g1, { x: { label: 'displacement setting (%)', min: 0, max: 100 }, y: { label: 'speed (rpm)', min: 0 }, legend: true }, 170);
      const pt = kit.plot(g2, { x: { label: 'displacement setting (%)', min: 0, max: 100 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 170);
      const loop = kit.loop(dt => {
        t += dt;
        const A = AX[V.design], C = kit.colors(), x = V.x / 100;
        const Ak = Math.PI * A.d * A.d / 4, VgMax = A.z * Ak * A.D * A.f(A.amax * Math.PI / 180) / 1000;
        const alpha = A.inv(x * A.f(A.amax * Math.PI / 180)), Vg = x * VgMax;
        const ehm = A.ehm - 0.1 * (1 - x) * (1 - x), nmax = x2 => A.nmax1 * (1 + 0.5 * (1 - x2));
        const n = V.Q * 1000 * A.ev / Vg, T = Vg * 1e-6 * V.dp * 1e5 * ehm / TAU, over = n > nmax(x);
        ro.set('a', (alpha * 180 / Math.PI).toFixed(1) + '°');
        ro.set('Vg', Vg.toFixed(1) + ' of ' + VgMax.toFixed(1) + ' cm³/rev');
        ro.set('n', n.toFixed(0) + ' rpm (' + nmax(x).toFixed(0) + ')' + (over ? ' — OVERSPEED' : ''));
        ro.set('T', T.toFixed(0) + ' N·m');
        ro.set('P', kw(T * n * TAU / 60));
        ro.set('f', (A.z * n / 60).toFixed(0) + ' Hz');
        if (t - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = t;
          const sn = [], sl = [], stq = [];
          for (let i = 1; i <= 50; i++) { const xx = 0.05 + 0.95 * i / 50; sn.push([100 * xx, V.Q * 1000 * A.ev / (xx * VgMax)]); sl.push([100 * xx, nmax(xx)]); stq.push([100 * xx, xx * VgMax * 1e-6 * V.dp * 1e5 * (A.ehm - 0.1 * (1 - xx) * (1 - xx)) / TAU]); }
          pn.set({ y: { label: 'speed (rpm)', min: 0, max: Math.min(3 * A.nmax1, Math.max(nmax(0.05), n) * 1.1) }, series: [{ pts: sn, label: 'speed at ' + V.Q + ' L/min' }, { pts: sl, label: 'speed limit', dash: [5, 4] }], marks: [{ x: V.x, y: Math.min(n, 3 * A.nmax1), label: 'now' }] });
          pt.set({ series: [{ pts: stq, label: 'torque at ' + V.dp + ' bar' }], marks: [{ x: V.x, y: T, label: 'now' }] });
        }
        // ---- drawing on a 700 × 280 grid
        phi += TAU * (n / 60) / Math.max(1, n / 30) * dt;
        const c = frame(st, 700, 280), cy = 140, Rp = 62, sa = Math.sin(alpha), ta = Math.tan(alpha);
        const pist = [];
        for (let k = 0; k < A.z; k++) { const f = phi + k * TAU / A.z; pist.push({ f, y: Rp * Math.cos(f), s: Math.sin(f) }); }
        pist.sort((p, q) => p.s - q.s);                                  // far side first
        c.strokeStyle = C.text; c.lineWidth = 4; c.beginPath(); c.moveTo(30, cy); c.lineTo(V.design === 'swash' ? 250 : 180, cy); c.stroke();
        kit.label(c, 'output shaft', 40, cy - 12, { color: C.muted, size: 11, align: 'left' });
        const drawPiston = (x0, x1, y, p, chamberEnd) => {
          const a = p.s > 0 ? 1 : 0.35, hgt = 11 + 4 * p.s;
          c.globalAlpha = a;
          c.fillStyle = p.s > 0 ? redA(C, 0.55) : blueA(C, 0.45); c.fillRect(x1, y - hgt / 2, chamberEnd - x1, hgt);
          c.fillStyle = metal(C); c.strokeStyle = C.text; c.lineWidth = 1; c.fillRect(x0, y - hgt / 2, x1 - x0, hgt); c.strokeRect(x0, y - hgt / 2, x1 - x0, hgt);
          c.globalAlpha = 1;
        };
        if (V.design === 'swash') {
          const xs = 176;
          c.save(); c.translate(xs - 6, cy); c.rotate(-alpha); c.fillStyle = metal(C); c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(-6, -95, 12, 190); c.strokeRect(-6, -95, 12, 190); c.restore();
          c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.strokeRect(250, cy - Rp - 22, 180, 2 * Rp + 44); c.setLineDash([]);
          for (const p of pist) {
            const yy = cy + p.y, xc = xs + p.y * ta, x1 = xc + 120;
            drawPiston(xc + 8, x1, yy, p, 430);
            c.globalAlpha = p.s > 0 ? 1 : 0.35; c.fillStyle = C.text; c.fillRect(xc, yy - 8, 8, 16); c.globalAlpha = 1;   // slipper
          }
          kit.label(c, 'swash plate ' + (alpha * 180 / Math.PI).toFixed(1) + '°', 176, cy + 118, { color: C.text, size: 12, weight: 700 });
          kit.label(c, 'cylinder block (turns)', 340, cy - Rp - 32, { color: C.muted, size: 11 });
        } else {
          const O = [180, cy];
          c.fillStyle = metal(C); c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(174, cy - Rp - 20, 14, 2 * Rp + 40); c.strokeRect(174, cy - Rp - 20, 14, 2 * Rp + 40);
          c.save(); c.translate(O[0], O[1]); c.rotate(-alpha);
          c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.strokeRect(70, -Rp - 22, 180, 2 * Rp + 44); c.setLineDash([]);
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(0, 0); c.lineTo(280, 0); c.stroke();
          for (const p of pist) {
            const uj = -Rp * Math.cos(p.f) * sa, vj = Rp * Math.cos(p.f) * Math.cos(alpha), up = uj + 70, vb = p.y;
            c.globalAlpha = p.s > 0 ? 1 : 0.35; c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(uj + 10, vj); c.lineTo(up, vb); c.stroke();
            kit.dot(c, uj + 10, vj, 3.5, C.text); c.globalAlpha = 1;
            drawPiston(up, up + 70, vb, p, 250);
          }
          c.fillStyle = C.text; c.fillRect(250, -Rp - 22, 10, 2 * Rp + 44);
          c.restore();
          kit.label(c, 'block tilted ' + (alpha * 180 / Math.PI).toFixed(1) + '°', 330, 268, { color: C.text, size: 12, weight: 700 });
          kit.label(c, 'drive flange', 181, cy + Rp + 34, { color: C.muted, size: 11 });
        }
        if (V.design === 'swash') { c.fillStyle = C.text; c.fillRect(430, cy - Rp - 22, 10, 2 * Rp + 44); kit.label(c, 'valve plate', 435, cy + Rp + 36, { color: C.muted, size: 11 }); }
        kit.label(c, 'red: pressure side, pistons pushed out', 480, 40, { color: C.bad, size: 12, weight: 700, align: 'left' });
        kit.label(c, 'blue: pistons pushed back, oil out', 480, 60, { color: C.accent, size: 12, align: 'left' });
        kit.label(c, n.toFixed(0) + ' rpm', 480, 110, { color: over ? C.bad : C.accent, size: 20, weight: 700, align: 'left' });
        kit.label(c, T.toFixed(0) + ' N·m', 480, 140, { color: C.text, size: 16, weight: 700, align: 'left' });
        kit.label(c, Vg.toFixed(1) + ' cm³/rev', 480, 168, { color: C.text, size: 13, align: 'left' });
        if (over) kit.label(c, 'overspeed: reduce the flow or the swivel range', 480, 196, { color: C.bad, size: 12, weight: 700, align: 'left' });
        kit.label(c, 'drawn ' + Math.max(1, n / 30).toFixed(0) + '× slower', 480, 222, { color: C.muted, size: 11, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ hy-radial-piston */
  const RAD = {
    cam10: { name: 'Cam-lobe motor: 10 pistons, 8-lobe cam', kind: 'cam', z: 10, k: 8, d: 40, h: 20 },
    cam12: { name: 'Wheel motor: 14 pistons, 12-lobe cam', kind: 'cam', z: 14, k: 12, d: 32, h: 20 },
    crank: { name: 'Crankshaft motor: 5 pistons, 1 stroke', kind: 'crank', z: 5, k: 1, d: 60, h: 40 }
  };
  Hyper.sim('hy-radial-piston', {
    title: 'Radial-piston motors: cam lobes and crankshafts',
    blurb: `A radial-piston motor seen along its shaft. In the **cam-lobe** motor the pistons turn with the block and their rollers run over a cam ring with many lobes: each piston is pressurised (red) while its roller climbs outwards along a lobe flank and pushes the block round, and vented (blue) on the way back. In the **crankshaft** motor five fixed pistons push in turn on a turning eccentric. The graph is the shaft torque over one revolution, with its average.

**Try this**
- Compare the designs: 10 pistons on 8 lobes give 80 strokes per revolution — a huge displacement from a compact motor; the crank motor needs bigger pistons for a fraction of it. In both, overlapping pistons keep the torque ripple to a few per cent.
- Tick *two-speed (half displacement)*: every other lobe is idled, the speed doubles and the torque halves — and the torque ripple grows.
- Lower the flow to 5 L/min: the big motor still turns smoothly at a few rpm, with 90 %-plus of its theoretical torque.
- Tick *freewheel*: the case is pressurised, the pistons retract from the cam and the shaft turns freely — for towing.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 240 });
      const [g1] = graphs(box, 1);
      let V = null, phi = 0, lastPlot = -1, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'design', type: 'select', label: 'Design', options: Object.keys(RAD).map(k => [RAD[k].name, k]), value: 'cam10' },
        { id: 'dp', label: 'Pressure difference', min: 20, max: 350, step: 5, value: 250, unit: 'bar' },
        { id: 'Q', label: 'Flow', min: 2, max: 250, step: 1, value: 60, unit: 'L/min', log: true },
        { id: 'half', type: 'check', label: 'Two-speed: half displacement', value: false },
        { id: 'free', type: 'check', label: 'Freewheel (pistons retracted)', value: false }
      ], () => { lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['Vg', 'Displacement'], ['T', 'Average torque'], ['n', 'Speed'], ['rip', 'Torque ripple (max − min) / mean'], ['P', 'Shaft power'], ['w', 'Pistons working now']]);
      const plot = kit.plot(g1, { x: { label: 'shaft angle (°)', min: 0, max: 360 }, y: { label: 'torque (kN·m)', min: 0 }, legend: true }, 170);
      const ehm = 0.94, ev = 0.97;
      // two-speed: every other cam lobe is switched to idle (both of its ports joined), so pistons work on half the lobes
      const active = (D, i, f) => {
        if (!(V.half && D.kind === 'cam')) return true;
        const th = ((f + TAU * i / D.z) % TAU + TAU) % TAU;
        return Math.floor(D.k * th / TAU) % 2 === 0;
      };
      const torqueAt = (D, f) => {                          // instantaneous torque shape, N·m per Pa of pressure
        const A = Math.PI * D.d * D.d / 4 * 1e-6, hh = D.h / 2 * 1e-3; let s = 0;
        for (let i = 0; i < D.z; i++) { if (!active(D, i, f)) continue; const psi = D.k * (f + TAU * i / D.z); s += Math.max(0, hh * D.k * Math.sin(psi)); }
        return s * A;
      };
      const loop = kit.loop(dt => {
        t += dt;
        const D = RAD[V.design], C = kit.colors(), dp = V.dp * 1e5;
        const nAct = D.z, kAct = D.kind === 'cam' && V.half ? D.k / 2 : D.k;
        const Vg = nAct * kAct * Math.PI * D.d * D.d / 4 * D.h / 1000;          // cm³/rev
        const n = V.free ? 0 : V.Q * 1000 * ev / Vg, T = V.free ? 0 : Vg * 1e-6 * dp * ehm / TAU;
        let tmin = Infinity, tmax = 0, tsum = 0; const pts = [];
        for (let i = 0; i <= 180; i++) { const f = TAU * i / 180, tq = torqueAt(D, f) * dp * ehm; tmin = Math.min(tmin, tq); tmax = Math.max(tmax, tq); if (i < 180) tsum += tq; pts.push([i * 2, tq / 1000]); }
        const mean = tsum / 180, rip = mean > 0 ? (tmax - tmin) / mean : 0;
        let working = 0; for (let i = 0; i < D.z; i++) if (active(D, i, phi) && Math.sin(D.k * (phi + TAU * i / D.z)) > 0) working++;
        ro.set('Vg', (Vg / 1000).toFixed(2) + ' L/rev');
        ro.set('T', V.free ? '0 — freewheeling' : (T / 1000).toFixed(2) + ' kN·m');
        ro.set('n', V.free ? 'free to turn' : n.toFixed(n < 10 ? 1 : 0) + ' rpm');
        ro.set('rip', V.free ? '—' : (100 * rip).toFixed(1) + ' %');
        ro.set('P', kw(T * n * TAU / 60));
        ro.set('w', V.free ? 'none (retracted)' : working + ' of ' + D.z);
        if (t - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = t;
          plot.set({ series: [{ pts: V.free ? pts.map(p => [p[0], 0]) : pts, label: 'torque at ' + V.dp + ' bar' }], hlines: V.free ? [] : [{ y: mean / 1000, label: 'mean' }], y: { label: 'torque (kN·m)', min: 0, max: Math.max(0.1, tmax / 1000 * 1.15) } });
        }
        // ---- drawing on a 700 × 300 grid
        const shownRate = V.free ? 0.3 : TAU * (n / 60) / Math.max(1, n / 20);
        phi += shownRate * dt;
        const c = frame(st, 700, 300), cx = 170, cy = 150;
        if (D.kind === 'cam') {
          const R0 = 86, rr = 9, hp = 16, prof = th => R0 + rr + hp / 2 * (1 - Math.cos(D.k * th));
          c.beginPath(); c.arc(cx, cy, 142, 0, TAU);
          for (let i = 120; i >= 0; i--) { const a = TAU * i / 120, r = prof(a); const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); i === 120 ? c.moveTo(x, y) : c.lineTo(x, y); }
          c.closePath(); c.fillStyle = metal(C); c.fill('evenodd'); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
          c.fillStyle = C.surface2 || C.bg2; c.beginPath(); c.arc(cx, cy, R0 - 30, 0, TAU); c.fill(); c.stroke();
          for (let i = 0; i < D.z; i++) {
            const a = phi + TAU * i / D.z, s = V.free ? -12 : hp / 2 * (1 - Math.cos(D.k * a)), rc = R0 + s;
            const on = active(D, i, phi), press = on && !V.free && Math.sin(D.k * a) > 0;
            c.save(); c.translate(cx, cy); c.rotate(a);
            c.fillStyle = V.free || !on ? 'hsl(270 20% 60% / .35)' : press ? redA(C, 0.6) : blueA(C, 0.45);
            c.fillRect(30, -9, rc - 26 - 30, 18);
            c.fillStyle = metal(C); c.strokeStyle = C.text; c.lineWidth = 1; c.fillRect(rc - 26, -9, 26 - rr + 2, 18); c.strokeRect(rc - 26, -9, 26 - rr + 2, 18);
            c.beginPath(); c.arc(rc, 0, rr, 0, TAU); c.fillStyle = C.text; c.fill();
            c.restore();
          }
          c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 12, 0, TAU); c.fill();
          kit.label(c, 'fixed cam ring, ' + D.k + ' lobes', cx, 12, { color: C.muted, size: 11 });
        } else {
          const e = 15, Re = 42, Lp = 36, Rh = 128;
          for (let i = 0; i < D.z; i++) {
            const th = -Math.PI / 2 + TAU * i / D.z, dph = th - phi;
            const r = e * Math.cos(dph) + Math.sqrt(Re * Re - e * e * Math.sin(dph) * Math.sin(dph));
            const press = !V.free && Math.sin(phi - th) > 0, rr = V.free ? Re + e + 6 : r;
            c.save(); c.translate(cx, cy); c.rotate(th);
            c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(Re - e - 4, -15, Rh - (Re - e - 4), 30);
            c.fillStyle = V.free ? 'hsl(270 20% 60% / .35)' : press ? redA(C, 0.6) : blueA(C, 0.45); c.fillRect(rr + Lp, -13, Rh - rr - Lp, 26);
            c.fillStyle = metal(C); c.fillRect(rr, -13, Lp, 26); c.strokeRect(rr, -13, Lp, 26);
            c.restore();
          }
          c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.text; c.lineWidth = 2;
          c.beginPath(); c.arc(cx + e * Math.cos(phi), cy + e * Math.sin(phi), Re, 0, TAU); c.fill(); c.stroke();
          c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 8, 0, TAU); c.fill();
          kit.label(c, 'turning eccentric; fixed cylinders', cx, 12, { color: C.muted, size: 11 });
        }
        kit.label(c, D.name, 360, 40, { color: C.text, size: 13, weight: 700, align: 'left' });
        kit.label(c, (Vg / 1000).toFixed(2) + ' L/rev = ' + nAct + ' pistons × ' + kAct + ' strokes × ' + (Math.PI * D.d * D.d / 4 * D.h / 1000).toFixed(1) + ' cm³', 360, 64, { color: C.text, size: 12, align: 'left' });
        kit.label(c, V.free ? 'freewheeling' : n.toFixed(n < 10 ? 1 : 0) + ' rpm', 360, 104, { color: C.accent, size: 20, weight: 700, align: 'left' });
        kit.label(c, V.free ? 'no torque' : (T / 1000).toFixed(2) + ' kN·m', 360, 136, { color: C.text, size: 18, weight: 700, align: 'left' });
        kit.label(c, 'red: pressurised, piston moving out along the flank', 360, 176, { color: C.bad, size: 12, align: 'left' });
        kit.label(c, 'blue: returning, oil to the outlet', 360, 196, { color: C.accent, size: 12, align: 'left' });
        kit.label(c, 'drawn ' + Math.max(1, n / 20).toFixed(0) + '× slower', 360, 222, { color: C.muted, size: 11, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ hy-orbital */
  const ORB = {
    g67: { name: 'Geroler: 6-lobe star, 7 rollers', N: 6, roll: true, ehm: 0.88, ev: 0.92, es: 0.8 },
    t67: { name: 'Gerotor: 6-lobe star, 7 fixed lobes', N: 6, roll: false, ehm: 0.8, ev: 0.9, es: 0.7 },
    g89: { name: 'Geroler: 8-lobe star, 9 rollers', N: 8, roll: true, ehm: 0.88, ev: 0.92, es: 0.8 }
  };
  // the star's outline, found as the region no ring roller ever enters while the star rolls (centre orbiting at e,
  // turning −1/N of the orbit angle); in the star's own frame, as a radius for each of 360 directions
  const starCache = {};
  function starProfile(N) {
    if (starCache[N]) return starCache[N];
    const e = 7, Rr = 92, rr = N > 6 ? 13 : 16, M = N + 1, bins = 360, r = new Array(bins).fill(Rr), steps = 150 * N;
    for (let s = 0; s < steps; s++) {
      const phi = TAU * N * s / steps, psi = -phi / N, cp = Math.cos(psi), sp = Math.sin(psi);
      const ox = e * Math.cos(phi), oy = e * Math.sin(phi);
      for (let j = 0; j < M; j++) {
        const aj = TAU * j / M, wx = Rr * Math.cos(aj) - ox, wy = Rr * Math.sin(aj) - oy;
        const lx = wx * cp + wy * sp, ly = -wx * sp + wy * cp, d = Math.hypot(lx, ly), al = Math.atan2(ly, lx);
        if (!(d > rr)) continue;
        const half = Math.asin(rr / d), b0 = Math.floor((al - half) / TAU * bins), b1 = Math.ceil((al + half) / TAU * bins);
        for (let b = b0; b <= b1; b++) {
          const dth = b * TAU / bins - al, sn = d * Math.sin(dth);
          if (Math.abs(sn) >= rr) continue;
          const dist = d * Math.cos(dth) - Math.sqrt(rr * rr - sn * sn), bi = ((b % bins) + bins) % bins;
          if (dist > 0 && dist < r[bi]) r[bi] = dist;
        }
      }
    }
    return (starCache[N] = { r, e, Rr, rr, bins });
  }
  Hyper.sim('hy-orbital', {
    title: 'An orbital motor: the star that orbits',
    blurb: `The gear set of an orbital motor, looking along the shaft (the orbit is drawn to scale, so it is small). The star rolls inside the ring: its centre (the small dot) circles the ring's centre N times for every single turn of the star — and of the output shaft, which the star drives through a wobbling cardan shaft. The chambers that are growing are fed with pressure oil (red); those shrinking return oil (blue). The graph compares the running and starting torque of gerolers and gerotors.

**Try this**
- Watch the centre dot orbit six times while the marked (orange) lobe of the star turns once: that is $f_{orb} = N\\,n$.
- Count the chambers: 7 of them fill and empty once per orbit, 6 orbits per turn — 42 fillings, hence a big displacement from a small set.
- Switch to the gerotor: sliding lobes instead of rollers cost torque, most of all when starting.
- Raise the pressure towards 250 bar: the torque grows, but the efficiency falls and the motor's continuous rating (about 175–200 bar) is exceeded.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250 });
      const [g1] = graphs(box, 1);
      let V = null, th = 0, lastPlot = -1, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'set', type: 'select', label: 'Gear set', options: Object.keys(ORB).map(k => [ORB[k].name, k]), value: 'g67' },
        { id: 'Vg', label: 'Displacement (length of the set)', min: 50, max: 800, step: 5, value: 200, unit: 'cm³/rev', log: true },
        { id: 'dp', label: 'Pressure difference', min: 10, max: 250, step: 5, value: 140, unit: 'bar' },
        { id: 'Q', label: 'Flow', min: 2, max: 80, step: 0.5, value: 35, unit: 'L/min', log: true }
      ], () => { lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['Vg', 'Displacement'], ['n', 'Shaft speed'], ['orb', 'Star orbits'], ['T', 'Running / starting torque'], ['eff', 'η_v · η_hm'], ['P', 'Shaft power']]);
      const plot = kit.plot(g1, { x: { label: 'pressure difference (bar)', min: 0, max: 250 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 180);
      const ehmAt = (O, dp) => O.ehm - 0.05 * dp / 200e5;
      const loop = kit.loop(dt => {
        t += dt;
        const O = ORB[V.set], C = kit.colors(), dp = V.dp * 1e5, Vg = V.Vg * 1e-6, N = O.N;
        const cL = (1 - O.ev) * Vg * 300 / 60 / 175e5, Q = V.Q / 60000;
        const n = Math.max(0, (Q - cL * dp) / Vg * 60), ehm = ehmAt(O, dp), T = Vg * dp * ehm / TAU, Ts = Vg * dp * O.es / TAU, ev = Q > 0 ? Vg * n / 60 / Q : 0;
        ro.set('Vg', V.Vg.toFixed(0) + ' cm³/rev = ' + (N * (N + 1)) + ' fillings × ' + (V.Vg / (N * (N + 1))).toFixed(2) + ' cm³');
        ro.set('n', n.toFixed(0) + ' rpm');
        ro.set('orb', (N * n).toFixed(0) + ' per minute (N × n)');
        ro.set('T', T.toFixed(0) + ' / ' + Ts.toFixed(0) + ' N·m');
        ro.set('eff', (100 * ev).toFixed(0) + ' % · ' + (100 * ehm).toFixed(0) + ' %' + (V.dp > 200 ? ' — above a typical continuous rating' : ''));
        ro.set('P', kw(T * n * TAU / 60));
        if (t - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = t;
          const s = {};
          for (const k of ['g67', 't67']) { s[k] = [[], []]; for (let i = 0; i <= 25; i++) { const p = 250e5 * i / 25; s[k][0].push([p / 1e5, Vg * p * ehmAt(ORB[k], p) / TAU]); s[k][1].push([p / 1e5, Vg * p * ORB[k].es / TAU]); } }
          plot.set({ series: [{ pts: s.g67[0], label: 'geroler, running' }, { pts: s.g67[1], label: 'geroler, starting', dash: [5, 4] }, { pts: s.t67[0], label: 'gerotor, running' }, { pts: s.t67[1], label: 'gerotor, starting', dash: [2, 3] }],
            marks: [{ x: V.dp, y: T, label: 'now' }], vlines: [{ x: 175, label: 'typical continuous' }] });
        }
        // ---- drawing on a 640 × 290 grid
        th += TAU * (n / 60) / Math.max(1, n / 8) * dt;              // the shaft, drawn at most about 0.13 rev/s
        const P = starProfile(N), c = frame(st, 640, 290), cx = 150, cy = 145, psi = th, phi = -N * th;
        const Rin = P.Rr + 3, Rout = P.Rr + P.rr + 22;
        // chambers between neighbouring rollers
        for (let j = 0; j <= N; j++) {
          const a1 = TAU * j / (N + 1), a2 = TAU * (j + 1) / (N + 1), beta = (a1 + a2) / 2, sg = Math.sin(beta - phi);
          c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, Rin, a1, a2); c.closePath();
          c.fillStyle = n < 0.5 ? 'hsl(270 20% 60% / .3)' : Math.abs(sg) < 0.2 ? 'hsl(270 25% 60% / .35)' : sg > 0 ? redA(C, 0.55) : blueA(C, 0.45);
          c.fill();
        }
        c.beginPath(); c.arc(cx, cy, Rout, 0, TAU); c.arc(cx, cy, Rin, 0, TAU, true); c.fillStyle = metal(C); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        for (let j = 0; j <= N; j++) {
          const a = TAU * j / (N + 1), x = cx + P.Rr * Math.cos(a), y = cy + P.Rr * Math.sin(a);
          c.beginPath(); c.arc(x, y, P.rr, 0, TAU); c.fillStyle = metal(C); c.fill();
          if (O.roll) { c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke(); c.beginPath(); c.moveTo(x, y); c.lineTo(x + P.rr * 0.8 * Math.cos(-6 * th + a), y + P.rr * 0.8 * Math.sin(-6 * th + a)); c.stroke(); }
        }
        // the star
        const sx = cx + P.e * Math.cos(phi), sy = cy + P.e * Math.sin(phi), cs = Math.cos(psi), sn = Math.sin(psi);
        c.beginPath();
        for (let b = 0; b < P.bins; b++) { const a = TAU * b / P.bins, r = P.r[b], lx = r * Math.cos(a), ly = r * Math.sin(a); const x = sx + lx * cs - ly * sn, y = sy + lx * sn + ly * cs; b ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.closePath(); c.fillStyle = C.dark ? '#7a86a8' : '#c9cedb'; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        // spline bore for the cardan, a mark on one lobe, and the orbiting centre
        c.beginPath(); c.arc(sx, sy, 22, 0, TAU); c.fillStyle = C.surface2 || C.bg2; c.fill(); c.stroke();
        const mx = sx + (P.r[0] - 14) * cs, my = sy + (P.r[0] - 14) * sn;
        kit.dot(c, mx, my, 5, C.warn);
        c.setLineDash([3, 3]); c.strokeStyle = C.muted; c.beginPath(); c.arc(cx, cy, P.e, 0, TAU); c.stroke(); c.setLineDash([]);
        kit.dot(c, sx, sy, 3.5, C.dark ? '#ffffff' : '#222222');
        // the output shaft, turning with the star
        const ox = 330, oy = 145;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(ox, oy, 28, 0, TAU); c.stroke();
        kit.arrow(c, ox, oy, ox + 24 * Math.cos(psi), oy + 24 * Math.sin(psi), C.warn, 3);
        kit.label(c, 'output shaft', ox, oy + 46, { color: C.muted, size: 11 });
        kit.label(c, O.name, 400, 40, { color: C.text, size: 13, weight: 700, align: 'left' });
        kit.label(c, 'star orbits ' + N + '× per shaft turn', 400, 66, { color: C.text, size: 12, align: 'left' });
        kit.label(c, n.toFixed(0) + ' rpm', 400, 106, { color: C.accent, size: 20, weight: 700, align: 'left' });
        kit.label(c, T.toFixed(0) + ' N·m', 400, 136, { color: C.text, size: 18, weight: 700, align: 'left' });
        kit.label(c, 'red: chambers growing (inlet)', 400, 176, { color: C.bad, size: 12, align: 'left' });
        kit.label(c, 'blue: chambers shrinking (outlet)', 400, 196, { color: C.accent, size: 12, align: 'left' });
        kit.label(c, 'drawn ' + Math.max(1, n / 8).toFixed(0) + '× slower', 400, 222, { color: C.muted, size: 11, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ hy-sizing */
  const DRIVES = {
    radial: { name: 'Radial-piston motor, direct', sizes: [250, 400, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300], prated: 300, ev: 0.96, ehm: 0.94, nmin: 1, nmax: v => Math.min(400, 300 * Math.sqrt(1000 / v)), geared: false },
    orbital: { name: 'Orbital motor, direct', sizes: [50, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800], prated: 175, ev: 0.9, ehm: 0.85, nmin: 10, nmax: v => Math.min(1000, 60000 / v), geared: false },
    axial: { name: 'Axial-piston motor + planetary gearbox', sizes: [10, 12, 16, 23, 28, 32, 45, 56, 63, 80, 90, 107, 125, 160], prated: 350, ev: 0.96, ehm: 0.93, nmin: 50, nmax: v => 16000 / Math.cbrt(v), geared: true },
    gear: { name: 'Gear motor + planetary gearbox', sizes: [4, 6, 8, 11, 14, 17, 20, 22, 26, 31, 38, 45], prated: 200, ev: 0.9, ehm: 0.85, nmin: 500, nmax: v => (v < 10 ? 4000 : 3000), geared: true }
  };
  const PUMPS = [4, 6, 8, 11, 14, 16, 19, 22, 25, 28, 32, 38, 45, 56, 63, 71, 80, 100, 125, 160];
  Hyper.sim('hy-sizing', {
    title: 'Size a hydraulic winch drive',
    blurb: `A winch lifts a load. From the rope pull and the line speed the drum needs a torque and a speed; the chosen drive turns them into a motor size, a flow, a pump and an electric motor — each rounded up to a standard size — and the power is followed from the mains to the rope, with what every element loses. The graph shows the motor's working area (torque up to its rated pressure, speed between its limits) with the operating point.

**Try this**
- Compare the four drives at 15 kN and 20 m/min: a big direct radial-piston motor, an orbital motor, or a small fast motor behind a gearbox. The flow — and so the pump and electric motor — hardly change: the load's power sets them.
- Raise the line speed until the orbital motor runs out of speed, or lower it until the gear motor falls below its smooth speed.
- Lower the relief setting: less pressure means a bigger motor for the same torque.
- Watch the losses: of the electric power drawn, typically only 60–75 % reaches the rope.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const [g1] = graphs(box, 1);
      let V = null, hook = 0, drumA = 0, lastPlot = -1, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'F', label: 'Rope pull', min: 1, max: 60, step: 0.5, value: 15, unit: 'kN' },
        { id: 'D', label: 'Drum diameter (to rope centre)', min: 150, max: 600, step: 10, value: 300, unit: 'mm' },
        { id: 'v', label: 'Line speed', min: 2, max: 60, step: 1, value: 20, unit: 'm/min' },
        { id: 'drive', type: 'select', label: 'Drive', options: Object.keys(DRIVES).map(k => [DRIVES[k].name, k]), value: 'radial' },
        { id: 'i', label: 'Gearbox ratio (geared drives)', min: 5, max: 80, step: 1, value: 30 },
        { id: 'relief', label: 'Relief-valve setting', min: 120, max: 350, step: 5, value: 210, unit: 'bar' },
        { id: 'np', type: 'select', label: 'Pump speed', options: [['1450 rpm (4-pole, 50 Hz)', 1450], ['1750 rpm (4-pole, 60 Hz)', 1750], ['2900 rpm (2-pole, 50 Hz)', 2900]], value: 1450 }
      ], id => { if (id === 'drive') ctl.show('i', DRIVES[V.drive].geared); lastPlot = -1; });
      V = ctl.values; ctl.show('i', DRIVES[V.drive].geared);
      const ro = kit.readout(box.side, [['drum', 'Drum torque · speed · power'], ['mot', 'Motor torque · speed'], ['Vg', 'Motor size (needed → chosen)'], ['dp', 'Pressure across the motor'], ['Q', 'Flow'], ['pump', 'Pump'], ['em', 'Electric motor'], ['chk', 'Checks']]);
      const plot = kit.plot(g1, { x: { label: 'motor speed (rpm)', min: 0 }, y: { label: 'motor torque (N·m)', min: 0 }, legend: true }, 180);
      const loop = kit.loop(dt => {
        t += dt;
        const Dr = DRIVES[V.drive], C = kit.colors(), D = V.D / 1000, ig = Dr.geared ? V.i : 1, eg = Dr.geared ? 0.95 : 1;
        const Tdrum = V.F * 1000 * D / 2, ndrum = V.v / (Math.PI * D), Tm = Tdrum / (ig * eg), nm = ndrum * ig;
        const dpDesign = Math.min(0.9 * V.relief - 20, Dr.prated) * 1e5;
        const VgNeed = TAU * Tm / (dpDesign * Dr.ehm) * 1e6;
        let Vg = Dr.sizes.find(s => s >= VgNeed); const tooBig = Vg == null; if (tooBig) Vg = Dr.sizes[Dr.sizes.length - 1];
        const dp = TAU * Tm / (Vg * 1e-6 * Dr.ehm), Qm = Vg * nm / Dr.ev / 1000;                   // Pa, L/min
        const pp = dp + 20e5, VpNeed = Qm * 1000 / (V.np * 0.93);
        let Vp = PUMPS.find(s => s >= 0.95 * VpNeed); if (Vp == null) Vp = PUMPS[PUMPS.length - 1];     // a few per cent slow is accepted
        const Qp = Vp * V.np * 0.93 / 1000, vAct = V.v * Qp / Math.max(Qm, 1e-9);
        const Pshaft = pp * Qp / 60000 / 0.87, fr = M.IEC_FRAMES.find(f => f[1] >= Pshaft / 1000 * 0.999);
        const kW = fr ? fr[1] : Pshaft / 1000, effE = M.ieAt('IE3', kW) / 100, Pel = Pshaft / effE;
        const Phyd = pp * Qp / 60000, Pmin = dp * Qp / 60000, wm = nm * vAct / V.v * TAU / 60, Pmout = Tm * wm, Prope = V.F * 1000 * vAct / 60;
        const dpStart = dp * Dr.ehm / (Dr.ehm - 0.05), checks = [];
        if (tooBig) checks.push('no size big enough: add a gearbox or a second motor');
        if (dp > Dr.prated * 1e5) checks.push('above the rated pressure');
        if (dpStart > (V.relief - 20) * 1e5) checks.push('starting needs ' + bar(dpStart) + ': raise the relief or enlarge the motor');
        if (nm < Dr.nmin) checks.push('below the motor\'s smooth speed');
        if (nm > Dr.nmax(Vg)) checks.push('above the motor\'s maximum speed (' + Dr.nmax(Vg).toFixed(0) + ' rpm)');
        if (!fr) checks.push('more than 90 kW: a large unit');
        ro.set('drum', Tdrum.toFixed(0) + ' N·m · ' + ndrum.toFixed(1) + ' rpm · ' + kw(V.F * 1000 * V.v / 60));
        ro.set('mot', Tm.toFixed(0) + ' N·m · ' + nm.toFixed(nm < 10 ? 1 : 0) + ' rpm' + (Dr.geared ? ' (through ' + ig + ':1)' : ''));
        ro.set('Vg', VgNeed.toFixed(0) + ' → ' + Vg + ' cm³/rev');
        ro.set('dp', bar(dp) + ' (pump ' + bar(pp) + ')');
        ro.set('Q', Qm.toFixed(1) + ' L/min needed');
        ro.set('pump', Vp + ' cm³/rev → ' + Qp.toFixed(1) + ' L/min, line speed ' + vAct.toFixed(1) + ' m/min');
        ro.set('em', (fr ? fr[1] + ' kW (frame ' + fr[0] + ')' : (Pshaft / 1000).toFixed(0) + ' kW') + ', draws ' + kw(Pel));
        ro.set('chk', checks.length ? checks.join('; ') : 'all within limits');
        if (t - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = t;
          const Tmax = Vg * 1e-6 * Dr.prated * 1e5 * Dr.ehm / TAU, nx = Dr.nmax(Vg);
          plot.set({ x: { label: 'motor speed (rpm)', min: 0, max: Math.max(nx, nm) * 1.15 }, y: { label: 'motor torque (N·m)', min: 0, max: Math.max(Tmax, Tm) * 1.2 },
            series: [{ pts: [[Dr.nmin, 0], [Dr.nmin, Tmax], [nx, Tmax], [nx, 0]], label: Vg + ' cm³/rev at ' + Dr.prated + ' bar' }],
            marks: [{ x: nm, y: Tm, label: 'winch' }] });
        }
        // ---- drawing on a 760 × 300 grid: the chain of power
        const c = frame(st, 760, 300), blocks = [['electric motor', Pel, C.text], ['pump', Pshaft, C.text], ['valves, hoses', Phyd, C.text], ['hydraulic motor', Pmin, C.text]];
        if (Dr.geared) blocks.push(['gearbox ' + ig + ':1', Pmout, C.text]);
        const outs = [Pshaft, Phyd, Pmin, Pmout].concat(Dr.geared ? [Prope] : []);
        const bw = 92, gap = 18, x0 = 16, maxP = Math.max(Pel, 1);
        blocks.forEach((b, k) => {
          const x = x0 + k * (bw + gap);
          c.fillStyle = C.surface2 || C.bg2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(x, 60, bw, 50); c.strokeRect(x, 60, bw, 50);
          kit.label(c, b[0], x + bw / 2, 78, { color: C.text, size: 11, weight: 700 });
          kit.label(c, kw(b[1]), x + bw / 2, 97, { color: C.muted, size: 11 });
          const h1 = 110 * b[1] / maxP, h2 = 110 * outs[k] / maxP;
          c.fillStyle = C.accent; c.globalAlpha = 0.7; c.fillRect(x + 8, 280 - h2, bw - 16, h2); c.globalAlpha = 1;
          c.fillStyle = C.bad; c.globalAlpha = 0.6; c.fillRect(x + 8, 280 - h1, bw - 16, h1 - h2); c.globalAlpha = 1;
          kit.label(c, '−' + kw(b[1] - outs[k]), x + bw / 2, 280 - h1 - 8, { color: C.bad, size: 10 });
          if (k < blocks.length - 1 || true) kit.arrow(c, x + bw, 85, x + bw + gap, 85, C.muted, 2);
        });
        kit.label(c, 'power in (bar height) and lost in each element (red)', 16, 150, { color: C.muted, size: 11, align: 'left' });
        // the winch
        const wx = x0 + blocks.length * (bw + gap) + 50, wy = 70, R = 30;
        drumA += ndrum * TAU / 60 * dt * vAct / V.v;
        hook = (hook + vAct / 60 * dt * 60) % 180;
        c.fillStyle = metal(C); c.strokeStyle = C.text; c.beginPath(); c.arc(wx, wy, R, 0, TAU); c.fill(); c.stroke();
        c.save(); c.translate(wx, wy); c.rotate(-drumA); c.strokeStyle = C.text; c.beginPath(); c.moveTo(0, 0); c.lineTo(R - 4, 0); c.stroke(); c.restore();
        const hy = 270 - hook;
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(wx + R, wy); c.lineTo(wx + R, hy); c.stroke();
        c.fillStyle = C.warn; c.fillRect(wx + R - 22, hy, 44, 26);
        kit.label(c, (V.F / 9.81).toFixed(1) + ' t', wx + R, hy + 14, { color: '#000', size: 11, weight: 700 });
        kit.label(c, kw(Prope) + ' at the rope', wx + R, 22, { color: C.ok, size: 12, weight: 700 });
        kit.label(c, 'overall ' + (100 * Prope / Math.max(Pel, 1)).toFixed(0) + ' % from the mains to the rope', 16, 30, { color: C.text, size: 13, weight: 700, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ hy-power-unit */
  Hyper.sim('hy-power-unit', {
    title: 'A hydraulic power unit at work',
    blurb: `A power unit in ISO 1219 symbols (inside the dash-dot line) feeding a machine that works in bursts: every 8 s its valve opens for 2 s and its motor takes the demand flow at the load pressure. The pump draws through a suction strainer and delivers through a check valve; the relief valve limits the pressure; a 10 L nitrogen accumulator stores oil between bursts; the return passes a filter with a bypass valve and a clogging indicator, then a cooler, and enters the tank below the oil level. The breather lets air in and out as the level changes.

**Try this**
- With the accumulator, a 16 cm³/rev pump (22 L/min) keeps up with a 60 L/min demand: the accumulator empties during the burst and refills between. Untick it: the machine starves during every burst, and between bursts the whole pump flow blows over the relief valve.
- Watch the tank level fall as the accumulator fills, and the breather draw air in.
- Tick *unloading*: when the accumulator is full the pump is switched to the tank at low pressure — compare the heat.
- Raise the filter clogging: the pressure drop grows, the indicator trips, then the bypass opens and dirty oil goes round the filter.
- Lower the precharge far below the load pressure, or raise it above: the usable volume shrinks either way.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const [g1, g2] = graphs(box, 2);
      let V = null, t = 0, tPlot = 0, p = 0, unl = false, Ecyc = 0, Eprev = 0, cycT = 0, ph = {}, lastQ = {};
      const hist = history(220);
      const ctl = kit.controls(box.side, [
        { id: 'Vp', type: 'select', label: 'Pump (at 1450 rpm)', options: [['8 cm³/rev (11 L/min)', 8], ['16 cm³/rev (22 L/min)', 16], ['28 cm³/rev (39 L/min)', 28], ['45 cm³/rev (62 L/min)', 45]], value: 16 },
        { id: 'Qd', label: 'Machine demand during a burst', min: 10, max: 100, step: 1, value: 60, unit: 'L/min' },
        { id: 'pL', label: 'Load pressure of the machine', min: 40, max: 200, step: 5, value: 120, unit: 'bar' },
        { id: 'relief', label: 'Relief setting', min: 100, max: 250, step: 5, value: 180, unit: 'bar' },
        { id: 'acc', type: 'check', label: 'Accumulator, 10 L', value: true },
        { id: 'p0', label: 'Accumulator precharge (nitrogen)', min: 30, max: 170, step: 5, value: 100, unit: 'bar' },
        { id: 'unl', type: 'check', label: 'Unloading: pump to tank when the accumulator is full', value: false },
        { id: 'clog', label: 'Return-filter clogging', min: 0, max: 95, step: 1, value: 20, unit: '%' }
      ], () => {});
      V = ctl.values; p = 0.9 * V.relief * 1e5;
      const ro = kit.readout(box.side, [['p', 'System pressure'], ['flows', 'Pump / machine / relief'], ['acc', 'Oil in the accumulator'], ['tank', 'Tank oil'], ['filt', 'Return filter'], ['m', 'Machine speed during the burst'], ['heat', 'Heat now / average over a cycle']]);
      const pp = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'pressure (bar)', min: 0 }, legend: true }, 160);
      const pq = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'flow (L/min)' }, legend: true }, 160);
      const V0 = 10e-3, Cl = 1.5e-3 / 1.3e9, Vtank0 = 160;
      function step(h) {
        const Qp = V.Vp * 1450 * 0.95 / 60e6, pset = V.relief * 1e5, work = (t % 8) < 2;
        const pabs = p + 1.013e5, p0abs = V.p0 * 1e5 + 1.013e5, accOn = V.acc && pabs > p0abs;
        if (V.unl && V.acc) { if (p > pset - 15e5) unl = true; else if (p < 0.85 * (pset - 15e5)) unl = false; } else unl = false;
        const Qin = unl ? 0 : Qp;
        const Qc = work ? V.Qd / 60000 * clamp((p - V.pL * 1e5) / 10e5, 0, 1) : 0;
        const Qr = Qp * clamp((p - (pset - 8e5)) / 8e5, 0, 4) * (unl ? 0 : 1);
        const Ctot = Cl + (accOn ? V0 * p0abs / (pabs * pabs) : 0);
        p = Math.max(0, p + h * (Qin - Qc - Qr) / Ctot);
        // heat: the pump's own losses, the relief valve, the unloading flow at 3 bar, and the drop from system to load pressure
        const Pshaft = (unl ? 3e5 * Qp : p * Qp) / 0.87, useful = V.pL * 1e5 * Qc;
        const heat = Pshaft * 0.13 + p * Qr + (unl ? 3e5 * Qp : 0) + Math.max(0, p - V.pL * 1e5) * Qc;
        Ecyc += h * heat;
        lastQ = { Qp, Qin, Qc, Qr, work, Pshaft, useful, accOn, p0abs, heat };
      }
      const loop = kit.loop(dt => {
        const sub = Math.ceil(dt / 2e-4), h = dt / sub;
        for (let k = 0; k < sub; k++) { step(h); t += h; }
        cycT += dt; if (cycT >= 8) { Eprev = Ecyc / cycT; Ecyc = 0; cycT = 0; }
        const o = lastQ, C = kit.colors(), pabs = p + 1.013e5;
        const Voil = V.acc && pabs > o.p0abs ? V0 * (1 - o.p0abs / pabs) : 0, Vtank = Vtank0 - Voil * 1000;
        const kf = 0.6e5 / 1e-3 / Math.pow(1 - 0.97 * V.clog / 100, 2), dpf = kf * o.Qc, byp = dpf > 3e5, dpShown = Math.min(dpf, 3.2e5);
        const bypFrac = byp ? 1 - 3e5 / dpf : 0;
        const heatNow = o.heat;
        ro.set('p', bar(p) + (o.Qr > 1e-7 ? ' (relief open)' : unl ? ' (pump unloaded)' : ''));
        ro.set('flows', lpm(o.Qin) + ' / ' + lpm(o.Qc) + ' / ' + lpm(o.Qr));
        ro.set('acc', V.acc ? (Voil * 1000).toFixed(2) + ' L' : 'none');
        ro.set('tank', Vtank.toFixed(1) + ' L');
        ro.set('filt', (dpShown / 1e5).toFixed(2) + ' bar' + (byp ? ' — BYPASS OPEN, ' + (100 * bypFrac).toFixed(0) + ' % unfiltered' : dpf > 2.2e5 ? ' — indicator tripped' : ''));
        ro.set('m', o.work ? (100 * o.Qc / (V.Qd / 60000)).toFixed(0) + ' % of the demanded speed' : 'waiting (valve closed)');
        ro.set('heat', kw(heatNow) + ' / ' + (Eprev > 0 ? kw(Eprev) : '…'));
        tPlot += dt;
        if (tPlot > 0.08) {
          tPlot = 0; hist.push([t, p / 1e5, o.Qin * 60000, o.Qc * 60000, o.Qr * 60000]);
          pp.set({ series: [{ pts: hist.col(1), label: 'system pressure' }], hlines: [{ y: V.relief, label: 'relief' }, { y: V.pL, label: 'load' }] });
          pq.set({ series: [{ pts: hist.col(2), label: 'pump in' }, { pts: hist.col(3), label: 'machine' }, { pts: hist.col(4), label: 'over relief', dash: [4, 3] }] });
        }
        // ---- drawing on a 780 × 430 grid
        const c = frame(st, 780, 430), col = S.col, hp = p > 5e5;
        const adv = (key, q) => { ph[key] = (ph[key] || 0) + dt * 70 * clamp(q / 1e-3, 0, 2.5); return ph[key]; };
        // the reservoir, drawn as the steel tank it is
        const lvl = 405 - 62 * Vtank / Vtank0;
        c.fillStyle = C.dark ? 'rgba(210,170,60,.18)' : 'rgba(200,150,30,.16)'; c.fillRect(50, lvl, 410, 405 - lvl);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(50, 330, 410, 75);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(50, lvl); c.lineTo(460, lvl); c.stroke();
        c.beginPath(); c.moveTo(255, 405); c.lineTo(255, 355); c.stroke();
        kit.label(c, 'baffle', 262, 362, { color: C.muted, size: 10, align: 'left' });
        kit.label(c, 'tank ' + Vtank.toFixed(0) + ' L', 70, 395, { color: C.text, size: 11, align: 'left' });
        // suction side
        const suc = [[120, 385], [120, 328]];
        S.line(c, suc, { state: o.Qp > 0 ? 'suction' : 'idle' }); S.line(c, [[120, 282], [120, 276]], { state: 'suction' });
        S.filter(c, 120, 305); kit.label(c, 'strainer', 104, 305, { color: C.muted, size: 10, align: 'right' });
        S.pump(c, 120, 250, { motor: true });
        // pressure side
        const pl = [[120, 224], [120, 218]], hdr = [[120, 182], [120, 110], [520, 110], [520, 255], [600, 255], [600, 240]];
        S.line(c, pl, { state: unl ? 'return' : 'pressure' });
        S.line(c, hdr, { state: hp ? 'pressure' : 'idle' });
        S.check(c, 120, 200, { open: o.Qin > 0 });
        S.line(c, [[200, 110], [200, 151]], { state: hp ? 'pressure' : 'idle' });
        S.line(c, [[200, 209], [200, 385]], { state: o.Qr > 1e-7 ? 'return' : 'idle' });
        S.pressureValve(c, 200, 180, { kind: 'relief', rot: 180, open: clamp(o.Qr / Math.max(o.Qp, 1e-9), 0, 1) });
        kit.label(c, unl ? 'relief / unloading: pump to tank' : 'relief ' + V.relief + ' bar', 222, 212, { color: C.muted, size: 10, align: 'left' });
        S.line(c, [[260, 96], [260, 110]], { state: hp ? 'pressure' : 'idle' }); S.gauge(c, 260, 75, { frac: p / 250e5, value: bar(p) });
        if (V.acc) { S.line(c, [[370, 91], [370, 110]], { state: hp ? 'pressure' : 'idle' }); S.accumulator(c, 370, 62, { level: clamp(Voil / (0.6 * V0), 0, 1), label: '10 L, N₂ ' + V.p0 + ' bar' }); S.junction(c, 370, 110); }
        S.junction(c, 200, 110); S.junction(c, 260, 110);
        // breather
        S.line(c, [[320, 323], [320, 330]], {}); S.filter(c, 320, 300); kit.label(c, 'breather', 336, 292, { color: C.muted, size: 10, align: 'left' });
        const dVdt = (o.Qin - o.Qc - o.Qr);
        if (V.acc && Math.abs(dVdt) > 2e-5 && o.accOn) kit.arrow(c, 300, dVdt > 0 ? 270 : 300, 300, dVdt > 0 ? 300 : 270, C.muted, 1.5);
        // the machine: a 2/2 valve and a motor
        const v2 = S.valve(c, 600, 215, { spec: '2/2 NC', state: o.work ? 0 : 1, left: 'solenoid', right: 'spring', s: 30 });
        S.line(c, [[600, v2.A[1]], [600, 166]], { state: o.work && o.Qc > 1e-7 ? 'pressure' : 'idle' });
        S.motor(c, 600, 140, { rot: 180, angle: t * 3 * (o.Qc / Math.max(V.Qd / 60000, 1e-9)) });
        kit.label(c, 'machine: ' + V.Qd + ' L/min at ' + V.pL + ' bar for 2 s in every 8 s', 600, 30, { color: C.text, size: 11, weight: 700 });
        // return: filter with bypass, cooler, back into the tank below the level
        const ret1 = [[600, 114], [600, 70], [700, 70], [700, 257]], ret2 = [[700, 303], [700, 318], [583, 318]], ret3 = [[537, 318], [420, 318], [420, 390]];
        const rs = o.Qc > 1e-7 ? 'return' : 'idle';
        S.line(c, ret1, { state: rs }); S.line(c, ret2, { state: rs }); S.line(c, ret3, { state: rs });
        S.filter(c, 700, 280); S.line(c, [[700, 245], [745, 245], [745, 262]], { state: byp ? 'return' : 'idle' }); S.line(c, [[745, 298], [745, 312], [700, 312]], { state: byp ? 'return' : 'idle' });
        S.check(c, 745, 280, { rot: 180, spring: true, open: byp }); S.junction(c, 700, 245); S.junction(c, 700, 312);
        kit.label(c, 'Δp ' + (dpShown / 1e5).toFixed(1) + ' bar', 690, 280, { color: byp ? C.bad : dpf > 2.2e5 ? C.warn : C.muted, size: 10, align: 'right' });
        c.fillStyle = dpf > 2.2e5 ? C.bad : C.ok; c.beginPath(); c.arc(760, 232, 5, 0, TAU); c.fill();
        kit.label(c, 'indicator', 768, 222, { color: C.muted, size: 9, align: 'right' });
        S.cooler(c, 560, 318, { rot: 90 }); kit.label(c, 'cooler', 560, 345, { color: C.muted, size: 10 });
        if (byp) kit.label(c, 'BYPASS: unfiltered oil', 700, 360, { color: C.bad, size: 12, weight: 700 });
        // flows
        if (o.Qin > 0) { S.flow(c, suc.concat([[120, 282], [120, 276]]), adv('s', o.Qin), { color: col('suction') }); S.flow(c, [[120, 182], [120, 110], [520, 110]], adv('h', o.Qin), { color: col('pressure') }); }
        if (o.Qr > 1e-7) S.flow(c, [[200, 110], [200, 385]], adv('r', o.Qr), { color: col('pressure') });
        if (o.Qc > 1e-7) { S.flow(c, [[520, 110], [520, 255], [600, 255], [600, 166]], adv('c', o.Qc), { color: col('pressure') }); S.flow(c, ret1.concat(ret2, ret3), adv('rt', o.Qc), { color: col('return') }); }
        // the power unit's boundary
        c.setLineDash([12, 4, 2, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.strokeRect(36, 40, 440, 380); c.setLineDash([]);
        kit.label(c, 'hydraulic power unit', 44, 52, { color: C.muted, size: 11, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ hy-motor-valves */
  Hyper.sim('hy-motor-valves', {
    title: 'Controlling a motor: direction, speed and stopping',
    blurb: `A fixed pump (40 L/min) feeds a 100 cm³/rev motor through a spring-centred 4/3 valve. In line A sits a speed control; the motor turns a flywheel against a friction-type load. This model includes the oil's compressibility, so pressures build and fall as they do in real lines — the graphs show them over the last few seconds.

**Try this**
- Run *Forward* with the throttle, then raise the load: the motor slows, because a plain throttle's flow follows the square root of the pressure drop across it. Switch to the pressure-compensated valve and repeat: the speed holds.
- With the throttle, look at the heat: the surplus flow goes over the relief valve at full pressure.
- Stop with the *float* centre: the flywheel coasts down, braked only by its load. Stop with the *closed* or *tandem* centre: the motor becomes a pump into a blocked line — the crossport relief catches the pressure at 230 bar and brakes the flywheel hard.
- Untick the crossport reliefs and stop with a closed centre: the pressure spikes far above any relief setting while the other line is sucked to vacuum and cavitates; the flywheel rocks on the oil's springiness.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.54, minH: 280 });
      const [g1, g2] = graphs(box, 2);
      let V = null, cmd = 0, t = 0, tPlot = 0, ang = 0;
      const s = { pP: 0, pA: 0, pB: 0, w: 0, u: 0, cav: 0, peak: 0, ph: {}, heat: 0, qR: 0, qA: 0, qB: 0, qX: 0 };
      const hist = history(200);
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'fwd', label: 'Forward (Y1)', primary: true }, { id: 'stop', label: 'Stop' }, { id: 'rev', label: 'Reverse (Y2)' }] },
        { id: 'centre', type: 'select', label: 'Valve centre', options: [['Float: A and B to tank', 'float'], ['Tandem: P to tank, A and B blocked', 'tandem'], ['Closed: all ports blocked', 'closed']], value: 'float' },
        { id: 'fc', type: 'select', label: 'Speed control in line A', options: [['None: full pump flow', 'none'], ['Throttle with bypass check', 'thr'], ['Pressure-compensated flow control', 'comp']], value: 'thr' },
        { id: 'open', label: 'Throttle opening / flow setting', min: 5, max: 100, step: 1, value: 40, unit: '%' },
        { id: 'TL', label: 'Load torque (friction-type)', min: 0, max: 280, step: 5, value: 60, unit: 'N·m' },
        { id: 'xrel', type: 'check', label: 'Crossport reliefs (230 bar) and make-up checks', value: true },
        { id: 'relief', label: 'Pump relief setting', min: 100, max: 250, step: 5, value: 180, unit: 'bar' }
      ], id => {
        if (id === 'fwd') { cmd = 1; s.peak = 0; s.cav = 0; }
        if (id === 'rev') { cmd = -1; s.peak = 0; s.cav = 0; }
        if (id === 'stop') { cmd = 0; s.peak = 0; s.cav = 0; }
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['pP', 'Pump pressure'], ['pAB', 'Motor ports A / B'], ['n', 'Motor speed'], ['q', 'Flow to motor / over relief'], ['heat', 'Heat now'], ['peak', 'Peak port pressure since the last command'], ['st', 'State']]);
      const pp = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'pressure (bar)' }, legend: true }, 160);
      const pn = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'motor speed (rpm)' }, legend: true }, 160);
      const Vg = 100e-6, J = 2, Tf0 = 6, bv = 0.03, beta = 1.2e9, VP = 0.3e-3, VA = 0.6e-3, VB = 0.6e-3, Qp = 40 / 60000;
      const K = Qp / Math.sqrt(5e5), cL = (1 / 60000) / 200e5, pmin = -0.9e5;
      function step(h) {
        s.u += clamp(cmd - s.u, -h / 0.12, h / 0.12);
        const u = s.u, up = Math.max(0, u), un = Math.max(0, -u), cw = Math.max(0, 1 - Math.abs(u) * 1.6);
        let qPA = 0, qPB = 0, qAT = 0, qBT = 0, qPT = 0;
        if (up > 0) {
          const dp = s.pP - s.pA, qv = orf(K * up, dp);
          if (V.fc === 'none' || dp <= 0) qPA = qv;
          else if (V.fc === 'thr') { const Kt = 2.5e-7 * V.open / 100, Ke = 1 / Math.sqrt(1 / Math.pow(K * up, 2) + 1 / (Kt * Kt)); qPA = orf(Ke, dp); }
          else { const Qset = V.open / 100 * 50 / 60000; qPA = Math.min(qv, Math.min(Qset, orf(Qset / Math.sqrt(8e5), dp))); }
          qBT = orf(K * up, s.pB);
        }
        if (un > 0) { qPB = orf(K * un, s.pP - s.pB); qAT = orf(K * un, s.pA); }
        if (cw > 0) {
          if (V.centre === 'float') { qAT += orf(K * cw, s.pA); qBT += orf(K * cw, s.pB); }
          else if (V.centre === 'tandem') qPT = orf(K * cw, s.pP);
        }
        const pc = V.relief * 1e5 - 10e5, qR = s.pP > pc ? Qp * (s.pP - pc) / 10e5 : 0;
        const qM = Vg * s.w / TAU, qL = cL * (s.pA - s.pB);
        let qX = 0, mA = 0, mB = 0;
        if (V.xrel) {
          const px = 230e5, Kx = Qp / 10e5, d = s.pA - s.pB;
          if (d > px) qX = Kx * (d - px); else if (-d > px) qX = -Kx * (-d - px);
          if (s.pA < -0.3e5) mA = 2e-9 * (-0.3e5 - s.pA);
          if (s.pB < -0.3e5) mB = 2e-9 * (-0.3e5 - s.pB);
        }
        s.pP += h * beta / VP * (Qp - qR - qPA - qPB - qPT);
        s.pA += h * beta / VA * (qPA - qAT - qM - qL - qX + mA);
        s.pB += h * beta / VB * (qPB - qBT + qM + qL + qX + mB);
        for (const k of ['pP', 'pA', 'pB']) if (s[k] < pmin) { s[k] = pmin; if (k !== 'pP') s.cav = 1; }
        const Tm = Vg * (s.pA - s.pB) / TAU, Tres = V.TL + Tf0;
        if (s.w === 0) { if (Math.abs(Tm) > Tres) s.w += h * (Tm - Tres * Math.sign(Tm)) / J; }
        else { const sg = Math.sign(s.w), w1 = s.w + h * (Tm - Tres * sg - bv * s.w) / J; s.w = w1 * sg <= 0 ? 0 : w1; }
        s.peak = Math.max(s.peak, s.pA, s.pB);
        s.qR = qR; s.qA = qPA - qAT; s.qB = qPB - qBT; s.qX = qX;
        s.heat = s.pP * qR + Math.max(0, s.pP - s.pA) * Math.max(0, qPA) + Math.max(0, s.pP - s.pB) * Math.max(0, qPB) + Math.abs(s.pA - s.pB) * Math.abs(qX) + s.pP * Math.max(0, qPT) + Math.max(0, s.pA) * Math.max(0, qAT) + Math.max(0, s.pB) * Math.max(0, qBT);
      }
      const loop = kit.loop(dt => {
        const sub = Math.ceil(dt / 2e-5), h = dt / sub;
        for (let k = 0; k < sub; k++) step(h);
        t += dt;
        const C = kit.colors(), n = s.w * 60 / TAU;
        ro.set('pP', bar(s.pP) + (s.qR > 1e-6 ? ' (relief open)' : ''));
        ro.set('pAB', bar(s.pA) + ' / ' + bar(s.pB));
        ro.set('n', n.toFixed(0) + ' rpm');
        ro.set('q', lpm(Math.abs(s.w) * Vg / TAU) + ' / ' + lpm(s.qR));
        ro.set('heat', kw(s.heat));
        ro.set('peak', bar(s.peak) + (s.peak > 300e5 ? ' — hoses and motor overloaded!' : ''));
        ro.set('st', s.cav ? 'cavitation on the low-pressure port' : cmd === 0 ? (Math.abs(n) > 1 ? 'stopping' : 'stopped') : Math.abs(n) < 1 ? 'stalled or starting' : 'running');
        tPlot += dt;
        if (tPlot > 0.03) {
          tPlot = 0; hist.push([t, s.pP / 1e5, s.pA / 1e5, s.pB / 1e5, n]);
          pp.set({ series: [{ pts: hist.col(1), label: 'pump' }, { pts: hist.col(2), label: 'port A' }, { pts: hist.col(3), label: 'port B', dash: [5, 4] }], hlines: [{ y: V.relief, label: 'relief' }] });
          pn.set({ series: [{ pts: hist.col(4), label: 'motor speed' }] });
        }
        // ---- drawing on a 760 × 400 grid
        const c = frame(st, 760, 400), col = S.col, st8 = p => (p > 20e5 ? 'pressure' : p < -0.3e5 ? 'suction' : 'idle');
        const adv = (key, q) => { s.ph[key] = (s.ph[key] || 0) + dt * 70 * clamp(q / 1e-3, -2.5, 2.5); return s.ph[key]; };
        const pumpL = [[100, 304], [100, 285], [323.2, 285], [323.2, 257]];
        S.line(c, [[100, 356], [100, 366]], { state: 'suction' });
        S.line(c, pumpL, { state: st8(s.pP) });
        S.line(c, [[180, 285], [180, 293]], { state: st8(s.pP) }); S.line(c, [[180, 351], [180, 351]], {});
        S.line(c, [[240, 276], [240, 285]], { state: st8(s.pP) });
        S.line(c, [[336.8, 257], [336.8, 300]], { state: 'return' });
        const lineA = [[323.2, 203], [323.2, 178]], lineA2 = [[323.2, 122], [323.2, 60], [520, 60], [520, 124]], lineB = [[336.8, 203], [336.8, 195], [470, 195], [470, 240], [520, 240], [520, 176]];
        S.line(c, lineA, { state: st8(s.pA) }); S.line(c, lineA2, { state: st8(s.pA) }); S.line(c, lineB, { state: st8(s.pB) });
        if (V.fc === 'none') S.line(c, [[323.2, 178], [323.2, 122]], { state: st8(s.pA) });
        else S.flowControl(c, 323.2, 150, { free: 'down', compensated: V.fc === 'comp' });
        if (V.xrel) {
          S.line(c, [[410, 60], [410, 99]], { state: st8(s.pA) }); S.line(c, [[410, 157], [410, 195]], { state: st8(s.pB) });
          S.line(c, [[450, 195], [450, 157]], { state: st8(s.pB) }); S.line(c, [[450, 99], [450, 60]], { state: st8(s.pA) });
          S.pressureValve(c, 410, 128, { kind: 'relief', rot: 180, open: s.qX > 1e-6 ? 1 : 0 });
          S.pressureValve(c, 450, 128, { kind: 'relief', open: s.qX < -1e-6 ? 1 : 0 });
          S.junction(c, 410, 60); S.junction(c, 450, 60); S.junction(c, 410, 195); S.junction(c, 450, 195);
          kit.label(c, 'crossport reliefs 230 bar (+ make-up checks)', 430, 214, { color: C.muted, size: 10 });
        }
        S.junction(c, 180, 285); S.junction(c, 240, 285);
        S.pump(c, 100, 330, { motor: true }); S.tank(c, 100, 366); S.tank(c, 180, 361); S.tank(c, 336.8, 310);
        S.pressureValve(c, 180, 322, { kind: 'relief', rot: 180, open: clamp(s.qR / Qp, 0, 1) });
        S.gauge(c, 240, 255, { frac: s.pP / 300e5, value: bar(s.pP) });
        const v4 = S.valve(c, 330, 230, { spec: V.centre === 'float' ? '4/3 float' : V.centre === 'tandem' ? '4/3 tandem' : '4/3 closed', state: 1 - s.u, left: 'spring+solenoid', right: 'spring+solenoid', s: 34, labels: true });
        kit.label(c, 'Y1', v4.xl - 8, 230, { color: cmd === 1 ? C.bad : C.muted, size: 12, weight: 700, align: 'right' });
        kit.label(c, 'Y2', v4.xr + 8, 230, { color: cmd === -1 ? C.bad : C.muted, size: 12, weight: 700, align: 'left' });
        ang += s.w * dt / 6;
        S.motor(c, 520, 150, { bidir: true });
        kit.label(c, 'A ' + bar(s.pA), 528, 100, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'B ' + bar(s.pB), 528, 200, { color: C.muted, size: 11, align: 'left' });
        // flywheel and load
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(548, 150); c.lineTo(640, 150); c.stroke();
        c.fillStyle = C.surface2 || C.bg2; c.beginPath(); c.arc(660, 150, 62, 0, TAU); c.fill(); c.stroke();
        c.save(); c.translate(660, 150); c.rotate(ang); c.strokeStyle = C.muted; c.lineWidth = 2; for (let k = 0; k < 5; k++) { c.rotate(TAU / 5); c.beginPath(); c.moveTo(10, 0); c.lineTo(56, 0); c.stroke(); } c.restore();
        c.strokeStyle = C.warn; c.lineWidth = 5; c.beginPath(); c.arc(660, 150, 68, Math.PI * 0.15, Math.PI * 0.85); c.stroke();
        kit.label(c, 'flywheel 2 kg·m², load ' + V.TL + ' N·m', 660, 238, { color: C.text, size: 11 });
        kit.label(c, n.toFixed(0) + ' rpm', 660, 66, { color: C.accent, size: 16, weight: 700 });
        if (s.cav) kit.label(c, 'cavitation: a port is at vacuum', 560, 380, { color: C.bad, size: 12, weight: 700 });
        if (s.peak > 300e5) kit.label(c, 'pressure spike ' + bar(s.peak) + '!', 560, 360, { color: C.bad, size: 13, weight: 700 });
        // flows
        const qm = Math.abs(s.w) * Vg / TAU;
        if (Qp > 0) S.flow(c, pumpL, adv('p', Qp), { color: col('pressure') });
        if (s.qR > 1e-6) S.flow(c, [[180, 285], [180, 351]], adv('r', s.qR), { color: col('pressure') });
        if (qm > 1e-6) { const d = s.w > 0 ? 1 : -1; S.flow(c, lineA2.slice().reverse(), adv('a', -d * qm), { color: col(s.pA > s.pB ? 'pressure' : 'return') }); S.flow(c, lineB, adv('b', -d * qm), { color: col(s.pB > s.pA ? 'pressure' : 'return') }); }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ hy-counterbalance */
  Hyper.sim('hy-counterbalance', {
    title: 'A winch: counterbalance valve and brake',
    blurb: `A 250 cm³/rev motor drives a winch drum (300 mm, through a 5:1 gear) from a 30 L/min pump and a 4/3 valve. Line A lifts; the load's weight pressurises it whenever the load hangs. Between the valve and the motor you can fit nothing, a pilot-operated check valve, or a counterbalance valve piloted from line B; a spring-applied brake on the shaft is released by pressure from the valve lines. The model includes the oil's compressibility.

**Try this**
- With **no valve**, press *Lower*: the load overruns the pump, runs away and line B is sucked to vacuum (cavitation); press *Hold* and it keeps sinking.
- With the **pilot-operated check**, lower again: it opens, the load overruns, the pilot pressure collapses, it slams shut — the load comes down in jerks.
- With the **counterbalance valve**, lower: the pump needs only a small pilot pressure, the load descends smoothly at the pump's pace, and the valve turns the load's energy into heat. Try pilot ratios 3 and 8, and a setting too close to the load pressure.
- Untick the **brake** and hold the load: the motor's leakage lets it creep down. With the **closed-centre** valve, trapped pressure can even keep the counterbalance valve and brake open.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      const [g1, g2] = graphs(box, 2);
      let V = null, cmd = 0, t = 0, tPlot = 0;
      const s = { pP: 0, pA: 0, pM: 0, pB: 0, w: 0, u: 0, x: 0, h: 3, cav: 0, q: 0, heat: 0, brake: 1, ph: {} };
      const hist = history(220);
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'up', label: 'Raise' }, { id: 'hold', label: 'Hold', primary: true }, { id: 'down', label: 'Lower' }] },
        { id: 'prot', type: 'select', label: 'Load-holding valve on line A', options: [['None', 'none'], ['Pilot-operated check valve (4:1)', 'pocv'], ['Counterbalance valve', 'cbv']], value: 'cbv' },
        { id: 'm', label: 'Load mass', min: 0, max: 2000, step: 50, value: 1500, unit: 'kg' },
        { id: 'pset', label: 'Counterbalance setting', min: 100, max: 300, step: 5, value: 200, unit: 'bar' },
        { id: 'R', type: 'select', label: 'Pilot ratio', options: [['3:1 (stable, more heat)', 3], ['4.5:1', 4.5], ['8:1 (less heat)', 8]], value: 3 },
        { id: 'brake', type: 'check', label: 'Spring-applied brake (released at 8–14 bar)', value: true },
        { id: 'centre', type: 'select', label: 'Valve centre', options: [['Float: A and B to tank', 'float'], ['Closed', 'closed']], value: 'float' }
      ], id => {
        if (id === 'up') cmd = 1; if (id === 'down') cmd = -1; if (id === 'hold') cmd = 0;
        if (id === 'up' || id === 'down' || id === 'hold') s.cav = 0;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['pM', 'Load side (motor port A)'], ['pB', 'Line B (pilot) / pump'], ['v', 'Hook speed'], ['hgt', 'Hook height'], ['br', 'Brake'], ['cbv', 'Holding valve opening · heat'], ['st', 'State']]);
      const pp = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'pressure (bar)' }, legend: true }, 160);
      const pv = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'hook speed (m/min)' }, legend: true }, 160);
      const Vg = 250e-6, r = 0.15, ig = 5, beta = 1.2e9, VP = 0.3e-3, VA = 0.3e-3, VM = 0.3e-3, VB = 0.6e-3, Qp = 30 / 60000;
      const K = Qp / Math.sqrt(5e5), cL = (0.5 / 60000) / 150e5, Tf0 = 10, bv = 0.05, pmin = -0.9e5, Tbmax = 900;
      function step(h) {
        s.u += clamp(cmd - s.u, -h / 0.15, h / 0.15);
        const u = s.u, up = Math.max(0, u), un = Math.max(0, -u), cw = Math.max(0, 1 - 1.6 * Math.abs(u));
        const Tg = s.h > 0 ? V.m * 9.81 * r / ig : 0, J = 0.05 + V.m * r * r / (ig * ig);
        let qPA = 0, qPB = 0, qAT = 0, qBT = 0;
        if (up > 0) { qPA = orf(K * up, s.pP - s.pA); qBT = orf(K * up, s.pB); }
        if (un > 0) { qPB = orf(K * un, s.pP - s.pB); qAT = orf(K * un, s.pA); }
        if (cw > 0 && V.centre === 'float') { qAT += orf(K * cw, s.pA); qBT += orf(K * cw, s.pB); }
        const pc = 200e5, qR = s.pP > pc ? Qp * (s.pP - pc) / 10e5 : 0;
        // the load-holding element between A (valve side) and M (motor side); positive q flows A → M
        let q = 0;
        if (V.prot === 'none') q = orf(5 * K, s.pA - s.pM);
        else {
          const chk = s.pA > s.pM ? orf(2 * K, s.pA - s.pM) : 0;
          let xt;
          if (V.prot === 'pocv') { xt = 4 * s.pB > s.pM + 2e5 ? 1 : 0; s.x += clamp(xt - s.x, -h / 0.03, h / 0.03); }
          else s.x = clamp((s.pM + V.R * s.pB - V.pset * 1e5) / 20e5, 0, 1);
          q = chk - (s.pM > s.pA ? orf(1.3 * K * s.x, s.pM - s.pA) : 0);
        }
        const qm = Vg * s.w / TAU, qL = cL * (s.pM - s.pB);
        s.pP += h * beta / VP * (Qp - qR - qPA - qPB);
        s.pA += h * beta / VA * (qPA - qAT - q);
        s.pM += h * beta / VM * (q - qm - qL);
        s.pB += h * beta / VB * (qPB - qBT + qm + qL);
        s.cav = Math.max(0, s.cav - h);
        for (const k of ['pP', 'pA', 'pM', 'pB']) if (s[k] < pmin) { s[k] = pmin; if (k === 'pM' || k === 'pB') s.cav = 0.6; }
        // the brake: springs apply it; pressure from the higher valve line (shuttle) releases it between 8 and 14 bar,
        // through a restrictor (slow release, so torque builds first) and a check (quick application)
        const prel = Math.max(s.pA, s.pB), bt = V.brake ? clamp((14e5 - prel) / 6e5, 0, 1) : 0;
        s.brake += bt < s.brake ? Math.max(bt - s.brake, -h / 0.3) : Math.min(bt - s.brake, h / 0.05);
        const Tb = s.brake * Tbmax + Tf0, Tnet = Vg * (s.pM - s.pB) / TAU - Tg;
        if (s.w === 0) { if (Math.abs(Tnet) > Tb) s.w += h * (Tnet - Tb * Math.sign(Tnet)) / J; }
        else { const sg = Math.sign(s.w), w1 = s.w + h * (Tnet - Tb * sg - bv * s.w) / J; s.w = w1 * sg <= 0 ? 0 : w1; }
        s.h += h * s.w / ig * r;
        if (s.h > 6) { s.h = 6; if (s.w > 0) s.w = 0; }
        if (s.h < 0) { s.h = 0; if (s.w < 0) s.w = 0; }
        s.q = q; s.heat = Math.max(0, s.pM - s.pA) * Math.max(0, -q);
      }
      const loop = kit.loop(dt => {
        const sub = Math.ceil(dt / 1e-5), h = dt / sub;
        for (let k = 0; k < sub; k++) step(h);
        t += dt;
        const C = kit.colors(), v = s.w / ig * r * 60, pL = V.m * 9.81 * r / ig * TAU / Vg;
        ro.set('pM', bar(s.pM) + ' (the load alone makes ' + bar(pL) + ')');
        ro.set('pB', bar(s.pB) + ' / ' + bar(s.pP));
        ro.set('v', (v >= 0 ? '+' : '') + v.toFixed(2) + ' m/min');
        ro.set('hgt', s.h.toFixed(3) + ' m' + (s.h <= 0 ? ' — on the ground' : ''));
        ro.set('br', !V.brake ? 'none' : s.brake > 0.99 ? 'applied' : s.brake > 0.01 ? 'dragging (' + (100 * s.brake).toFixed(0) + ' %)' : 'released');
        ro.set('cbv', V.prot === 'none' ? '—' : (100 * s.x).toFixed(0) + ' % · ' + kw(s.heat));
        const creep = cmd === 0 && v < -0.001;
        ro.set('st', s.cav ? 'cavitation in line B: the load overran the pump' : v < -3 && V.prot !== 'cbv' ? 'load running away' : creep ? 'creeping down ' + (-v * 1000).toFixed(0) + ' mm/min' : cmd === 0 ? 'holding' : cmd > 0 ? 'raising' : 'lowering');
        tPlot += dt;
        if (tPlot > 0.04) {
          tPlot = 0; hist.push([t, s.pM / 1e5, s.pB / 1e5, s.pP / 1e5, v]);
          pp.set({ series: [{ pts: hist.col(1), label: 'load side A' }, { pts: hist.col(2), label: 'line B' }, { pts: hist.col(3), label: 'pump', dash: [4, 3] }] });
          pv.set({ series: [{ pts: hist.col(4), label: 'hook speed (+ up)' }] });
        }
        // ---- drawing on a 760 × 400 grid
        const c = frame(st, 760, 400), col = S.col, sp = p => (p > 20e5 ? 'pressure' : p < -0.3e5 ? 'suction' : p > 2e5 ? 'metered' : 'idle');
        const adv = (key, qq) => { s.ph[key] = (s.ph[key] || 0) + dt * 70 * clamp(qq / 1e-3, -2.5, 2.5); return s.ph[key]; };
        S.line(c, [[100, 356], [100, 366]], { state: 'suction' });
        S.line(c, [[100, 304], [100, 285], [323.2, 285], [323.2, 257]], { state: sp(s.pP) });
        S.line(c, [[180, 285], [180, 293]], { state: sp(s.pP) }); S.line(c, [[240, 276], [240, 285]], { state: sp(s.pP) });
        S.line(c, [[336.8, 257], [336.8, 300]], { state: 'return' });
        S.junction(c, 180, 285); S.junction(c, 240, 285);
        S.pump(c, 100, 330, { motor: true }); S.tank(c, 100, 366); S.tank(c, 180, 361); S.tank(c, 336.8, 310);
        S.pressureValve(c, 180, 322, { kind: 'relief', rot: 180 });
        S.gauge(c, 240, 255, { frac: s.pP / 250e5, value: bar(s.pP) });
        S.valve(c, 330, 230, { spec: V.centre === 'float' ? '4/3 float' : '4/3 closed', state: 1 - s.u, left: 'spring+lever', right: 'spring', s: 34, labels: true });
        const lineA = [[323.2, 203], [323.2, 185], [420, 185], [420, 158]], lineM = [[420, 122], [420, 70], [520, 70], [520, 104]], lineB = [[336.8, 203], [336.8, 215], [520, 215], [520, 156]];
        S.line(c, lineA, { state: sp(s.pA) }); S.line(c, lineM, { state: sp(s.pM) }); S.line(c, lineB, { state: sp(s.pB) });
        if (V.prot === 'none') S.line(c, [[420, 158], [420, 122]], { state: sp(s.pM) });
        else if (V.prot === 'pocv') { S.check(c, 420, 140, { pilot: true, open: s.x > 0.5 || s.q > 1e-6 }); S.line(c, [[470, 215], [470, 152], [436, 152]], { state: 'pilot' }); }
        else {
          S.check(c, 420, 140, { open: s.q > 1e-6 });
          S.line(c, [[380, 185], [380, 169]], { state: sp(s.pA) }); S.line(c, [[380, 111], [380, 95], [420, 95]], { state: sp(s.pM) });
          S.pressureValve(c, 380, 140, { kind: 'relief', rot: 180, open: s.x });
          S.line(c, [[470, 215], [470, 140], [398, 140]], { state: 'pilot' });
          S.junction(c, 380, 185); S.junction(c, 420, 95);
          kit.label(c, 'counterbalance ' + V.pset + ' bar, ' + V.R + ':1', 372, 40, { color: C.muted, size: 10 });
        }
        S.junction(c, 470, 215);
        S.motor(c, 520, 130, { bidir: true });
        // brake, drum, rope and load
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(548, 130); c.lineTo(630, 130); c.stroke();
        if (V.brake) {
          c.fillStyle = s.brake > 0.5 ? C.bad : C.ok; c.globalAlpha = 0.5; c.fillRect(566, 112, 24, 36); c.globalAlpha = 1; c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(566, 112, 24, 36);
          S.zigzag(c, 578, 150, 578, 170, 4, 3, C.text);
          S.line(c, [[578, 215], [578, 170]], { state: 'pilot' }); S.junction(c, 578, 215);
          kit.label(c, 'brake', 578, 104, { color: C.text, size: 10 });
        }
        const dx = 660, dy = 130, R = 30;
        c.fillStyle = metal(C); c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(dx, dy, R, 0, TAU); c.fill(); c.stroke();
        const ang = s.h / r * 0.3; c.save(); c.translate(dx, dy); c.rotate(-ang); c.beginPath(); c.moveTo(0, 0); c.lineTo(R - 4, 0); c.stroke(); c.restore();
        const hy = 385 - s.h * 36;
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(dx + R, dy); c.lineTo(dx + R, hy - 26); c.stroke();
        c.fillStyle = C.warn; c.fillRect(dx + R - 22, hy - 26, 44, 26);
        kit.label(c, V.m + ' kg', dx + R, hy - 13, { color: '#000', size: 11, weight: 700 });
        c.strokeStyle = C.muted; c.beginPath(); c.moveTo(600, 386); c.lineTo(750, 386); c.stroke();
        kit.label(c, 'A ' + bar(s.pM), 528, 84, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'B ' + bar(s.pB), 528, 200, { color: C.muted, size: 11, align: 'left' });
        if (s.cav) kit.label(c, 'cavitation: line B at vacuum', 380, 380, { color: C.bad, size: 12, weight: 700 });
        const qm = Math.abs(s.w) * Vg / TAU;
        if (qm > 1e-6) { const d = s.w > 0 ? 1 : -1; S.flow(c, lineM, adv('m', d * qm), { color: col(s.pM > 20e5 ? 'pressure' : 'return') }); S.flow(c, lineB, adv('b', -d * qm), { color: col(s.pB > 20e5 ? 'pressure' : 'return') }); }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ hy-hydrostatic */
  Hyper.sim('hy-hydrostatic', {
    title: 'A hydrostatic drive on a slope',
    blurb: `A closed-loop hydrostatic transmission drives a machine: an engine turns a variable, reversible pump (45 cm³/rev) and a charge pump; the loop feeds a two-speed motor (80 or 40 cm³/rev) that drives the wheels through a 20:1 final drive. The joystick swings the pump's swash plate. Two high-pressure reliefs protect the loop; two checks let charge oil (25 bar) into whichever line is low. The graph is the tractive force the drive can give at each speed, with the machine's operating point and the force the slope and rolling resistance demand.

**Try this**
- Push the joystick forward slowly: the machine moves off smoothly with full force from standstill. Pull it back past zero: it slows, stops and reverses — no clutch, no directional valve.
- Put the machine on a 20 % slope and drive down: the high pressure moves to the *other* line — the motor is pumping and the engine brakes the machine.
- Climb with a heavy load in low range: the pressure rises towards the relief; with *anti-stall* the pump destrokes instead of pulling the engine down, and the speed falls along the power curve.
- Switch to high range: twice the speed, half the force. On a steep slope it may no longer climb.
- Let go of the joystick on a slope: the machine creeps down through the leakage — the parking brake's job.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      const [g1] = graphs(box, 1);
      let V = null, t = 0, lastPlot = -1, wheelA = 0, groundOff = 0;
      const s = { v: 0, dp: 0, x: 0, rel: 0, ph: {} };
      const ctl = kit.controls(box.side, [
        { id: 'joy', label: 'Joystick (pump swash plate)', min: -100, max: 100, step: 1, value: 40, unit: '%' },
        { id: 'ne', label: 'Engine speed', min: 900, max: 2400, step: 50, value: 2200, unit: 'rpm' },
        { id: 'range', type: 'select', label: 'Motor range', options: [['Low: 80 cm³/rev', 80], ['High: 40 cm³/rev', 40]], value: 80 },
        { id: 'grade', label: 'Slope (+ uphill forwards)', min: -25, max: 25, step: 1, value: 0, unit: '%' },
        { id: 'm', label: 'Machine mass', min: 2, max: 12, step: 0.5, value: 5, unit: 't' },
        { id: 'prel', label: 'High-pressure relief', min: 250, max: 450, step: 10, value: 420, unit: 'bar' },
        { id: 'anti', type: 'check', label: 'Anti-stall (power limiting)', value: true }
      ], () => { lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['v', 'Speed'], ['F', 'Tractive force / needed to hold speed'], ['p', 'Loop pressures A / B'], ['x', 'Pump displacement'], ['P', 'Engine power used / available'], ['st', 'State']]);
      const plot = kit.plot(g1, { x: { label: 'speed (km/h)', min: 0 }, y: { label: 'tractive force (kN)', min: 0 }, legend: true }, 190);
      const Vp = 45e-6, ig = 20, eg = 0.95, rw = 0.5, pch = 25e5, beta = 1.2e9, VL = 2e-3, eta = 0.93;
      const Peng = () => 45000 * Math.min(1, V.ne / 2200);
      const cL = 0.06 * (Vp * 2200 / 60) / 400e5;
      function step(h) {
        const Vm = V.range * 1e-6, qmax = Vp * V.ne / 60, m = V.m * 1000;
        let xt = V.joy / 100;
        if (V.anti && s.dp * xt > 0) { const lim = 0.9 * Peng() / Math.max(1, Math.abs(s.dp) * qmax); xt = Math.sign(xt) * Math.min(Math.abs(xt), lim); }
        s.x += clamp(xt - s.x, -h / 1.0, h / 1.0);
        const Qp = s.x * qmax, wm = s.v * ig / rw, Qm = Vm * wm / TAU, pr = V.prel * 1e5 - pch;
        const Qrel = Math.abs(s.dp) > pr ? Math.sign(s.dp) * qmax / 10e5 * (Math.abs(s.dp) - pr) : 0;
        s.rel = Math.abs(Qrel);
        s.dp += h * beta / VL * (Qp - Qm - cL * s.dp - Qrel);
        const F = Vm * s.dp / TAU * eta * ig * eg / rw, th = Math.atan(V.grade / 100);
        const Fg = m * 9.81 * Math.sin(th), Fr = 0.03 * m * 9.81 * Math.cos(th);
        if (s.v === 0) { if (Math.abs(F - Fg) > Fr) s.v += h * (F - Fg - Fr * Math.sign(F - Fg)) / m; }
        else { const sg = Math.sign(s.v), v1 = s.v + h * (F - Fg - Fr * sg) / m; s.v = v1 * sg <= 0 ? 0 : v1; }
        s.F = F; s.Fneed = Fg + Fr * (s.v !== 0 ? Math.sign(s.v) : 0); s.Qp = Qp;
      }
      const loop = kit.loop(dt => {
        const sub = Math.ceil(dt / 5e-4), h = dt / sub;
        for (let k = 0; k < sub; k++) step(h);
        t += dt;
        const C = kit.colors(), kmh = s.v * 3.6, pA = pch + Math.max(0, s.dp), pB = pch + Math.max(0, -s.dp);
        const Puse = Math.abs(s.dp * s.Qp) / 0.9, braking = s.dp * s.Qp < -1 || (Math.abs(s.v) > 0.05 && s.dp * s.v < 0 && Math.abs(s.dp) > 20e5);
        ro.set('v', kmh.toFixed(1) + ' km/h');
        ro.set('F', (s.F / 1000).toFixed(1) + ' kN / ' + (s.Fneed / 1000).toFixed(1) + ' kN');
        ro.set('p', bar(pA) + ' / ' + bar(pB));
        ro.set('x', (100 * s.x).toFixed(0) + ' %' + (V.anti && Math.abs(s.x) < Math.abs(V.joy / 100) - 0.02 && s.dp * s.x > 0 ? ' (anti-stall holding it back)' : ''));
        ro.set('P', kw(Puse) + ' / ' + kw(Peng()));
        ro.set('st', s.rel > 1e-6 ? 'relief open: the drive is at its force limit' : Math.abs(V.joy) < 1 && Math.abs(s.x) < 0.01 ? (Math.abs(s.v) < 0.01 ? 'stopped (apply the parking brake)' : 'creeping through the leakage: the parking brake\'s job') : braking ? 'dynamic braking: the motor pumps, the engine is driven' : Math.abs(s.v) < 0.01 ? 'stalled' : 'driving');
        if (t - lastPlot > 0.3 || lastPlot < 0) {
          lastPlot = t;
          const Vm = V.range * 1e-6, Fmax = (V.prel * 1e5 - pch) * Vm / TAU * eta * ig * eg / rw, vmax = Vp * V.ne / 60 * 0.95 / Vm * TAU * rw / ig;
          const env = [];
          for (let i = 0; i <= 60; i++) { const vv = vmax * i / 60, Fp = vv > 0 ? 0.9 * Peng() * eta * eg * 0.95 / vv : Infinity; env.push([vv * 3.6, Math.min(Fmax, Fp) / 1000]); }
          env.push([vmax * 3.6, 0]);
          const th = Math.atan(V.grade / 100), need = V.m * 1000 * 9.81 * (Math.abs(Math.sin(th)) + 0.03 * Math.cos(th)) / 1000;
          plot.set({ x: { label: 'speed (km/h)', min: 0, max: Math.max(5, vmax * 3.6 * 1.1) }, series: [{ pts: env, label: 'what the drive can give (' + V.range + ' cm³/rev)' }],
            hlines: [{ y: need, label: 'slope + rolling' }], marks: [{ x: Math.abs(kmh), y: Math.abs(s.F) / 1000, label: 'now' }] });
        }
        // ---- drawing on a 760 × 380 grid
        const c = frame(st, 760, 380), hiA = s.dp > 5e5, hiB = s.dp < -5e5;
        const adv = (key, q) => { s.ph[key] = (s.ph[key] || 0) + dt * 60 * clamp(q / 1e-3, -2.5, 2.5); return s.ph[key]; };
        const lA = [[80, 144], [80, 80], [380, 80], [380, 144]], lB = [[80, 196], [80, 260], [380, 260], [380, 196]];
        S.line(c, lA, { state: hiA ? 'pressure' : 'return' }); S.line(c, lB, { state: hiB ? 'pressure' : 'return' });
        S.line(c, [[210, 80], [210, 141]], { state: hiA ? 'pressure' : 'return' }); S.line(c, [[210, 199], [210, 260]], { state: hiB ? 'pressure' : 'return' });
        S.line(c, [[250, 260], [250, 199]], { state: hiB ? 'pressure' : 'return' }); S.line(c, [[250, 141], [250, 80]], { state: hiA ? 'pressure' : 'return' });
        S.pressureValve(c, 210, 170, { kind: 'relief', rot: 180, open: s.rel > 1e-6 && s.dp > 0 ? 1 : 0 });
        S.pressureValve(c, 250, 170, { kind: 'relief', open: s.rel > 1e-6 && s.dp < 0 ? 1 : 0 });
        S.line(c, [[150, 102], [150, 80]], { state: 'suction' }); S.line(c, [[150, 238], [150, 260]], { state: 'suction' });
        S.line(c, [[150, 138], [150, 202]], { state: 'suction' }); S.line(c, [[150, 170], [170, 170], [170, 309]], { state: 'suction' });
        S.check(c, 150, 120, { open: s.dp < 0 }); S.check(c, 150, 220, { rot: 180, open: s.dp > 0 });
        S.line(c, [[170, 290], [230, 290], [230, 291]], { state: 'suction' });
        S.pressureValve(c, 230, 320, { kind: 'relief', rot: 180, open: 0.5 });
        S.line(c, [[170, 351], [170, 356]], { state: 'suction' });
        S.pump(c, 170, 330, { r: 11 }); S.tank(c, 170, 366); S.tank(c, 230, 359);
        kit.label(c, 'charge pump', 150, 330, { color: C.muted, size: 10, align: 'right' });
        kit.label(c, 'charge relief 25 bar', 250, 322, { color: C.muted, size: 10, align: 'left' });
        for (const [x, y] of [[80, 80], [210, 80], [250, 80], [150, 80], [80, 260], [210, 260], [250, 260], [150, 260], [150, 170], [170, 290]]) S.junction(c, x, y);
        S.pump(c, 80, 170, { variable: true, bidir: true, motor: true });
        kit.label(c, 'engine ' + V.ne + ' rpm', 38, 204, { color: C.muted, size: 10 });
        S.motor(c, 380, 170, { bidir: true, variable: true });
        S.line(c, [[390, 196], [400, 214], [440, 214], [440, 330]], { kind: 'drain', state: 'return' }); S.tank(c, 440, 340);
        kit.label(c, 'case drain, flushing → cooler → tank', 448, 300, { color: C.muted, size: 10, align: 'left' });
        kit.label(c, 'A ' + bar(pA), 300, 70, { color: hiA ? C.bad : C.muted, size: 11, weight: 700 });
        kit.label(c, 'B ' + bar(pB), 300, 276, { color: hiB ? C.bad : C.muted, size: 11, weight: 700 });
        const q = s.Qp || 0;
        if (Math.abs(q) > 1e-6) { S.flow(c, lA, adv('a', q), { color: S.col(hiA ? 'pressure' : 'return') }); S.flow(c, lB.slice().reverse(), adv('b', q), { color: S.col(hiB ? 'pressure' : 'return') }); }
        // the machine on its slope
        const th = Math.atan(V.grade / 100), cx = 610, cy = 250, L = 150;
        c.save(); c.translate(cx, cy); c.rotate(-th);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(-L, 0); c.lineTo(L, 0); c.stroke();
        groundOff = (groundOff + s.v * dt * 30) % 24;
        c.strokeStyle = C.muted; c.lineWidth = 1; for (let x = -L - 24; x < L; x += 24) { const xx = x - groundOff; if (xx < -L || xx > L - 8) continue; c.beginPath(); c.moveTo(xx, 4); c.lineTo(xx + 8, 12); c.stroke(); }
        c.fillStyle = C.warn; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(-60, -58, 120, 36); c.strokeRect(-60, -58, 120, 36); c.fillRect(-10, -86, 44, 28); c.strokeRect(-10, -86, 44, 28);
        wheelA += s.v / rw * dt;
        for (const wx of [-38, 38]) { c.fillStyle = C.text; c.beginPath(); c.arc(wx, -18, 18, 0, TAU); c.fill(); c.strokeStyle = C.bg2 || '#111'; c.lineWidth = 2; c.beginPath(); c.moveTo(wx, -18); c.lineTo(wx + 14 * Math.cos(wheelA), -18 + 14 * Math.sin(wheelA)); c.stroke(); }
        if (Math.abs(s.F) > 100) kit.arrow(c, 0, -40, clamp(s.F / 1000 * 3, -90, 90), -40, s.F * s.v < 0 ? C.bad : C.ok, 3);
        c.restore();
        kit.label(c, kmh.toFixed(1) + ' km/h', 610, 40, { color: C.accent, size: 18, weight: 700 });
        kit.label(c, 'slope ' + V.grade + ' %, ' + V.m + ' t', 610, 64, { color: C.muted, size: 11 });
        if (braking) kit.label(c, 'braking through the pump', 610, 88, { color: C.bad, size: 12, weight: 700 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ hy-cleanliness */
  // a filter's beta ratio against particle size, from its rating β(x0) = b0: log β grows as (x/x0)^1.5 (a teaching model)
  const FILT = { none: null, coarse: [25, 2], b75: [10, 75], b200: [10, 200], b1000: [5, 1000] };
  const betaAt = (spec, x) => (spec ? Math.min(1e4, Math.pow(10, Math.log10(spec[1]) * Math.pow(x / spec[0], 1.5))) : 1);
  const isoCode = N => (N < 0.01 ? 0 : Math.max(0, 13 + Math.ceil(Math.log2(N / 80) - 1e-9)));
  const SIZES = [4, 6, 14], INGRESS = [88, 27, 3.6];                    // particles ≥ 4, 6, 14 µm(c) per mL per minute, clean site
  Hyper.sim('hy-cleanliness', {
    title: 'Keeping the oil clean: ISO 4406',
    blurb: `A tank of oil with particles of three sizes (≥ 4, ≥ 6 and ≥ 14 µm) — drawn fewer than there are, so you can see them change. Dirt keeps coming in (through the breather, the cylinder rod seals, wear); the pump circulates the oil through the filter, which removes a fraction $1 - 1/\\beta$ of each size on every pass. The counts settle where ingress and removal balance, and the ISO 4406 code is read from them: each step of the code doubles the count.

**Try this**
- Start from new, unfiltered oil (19/17/14): watch the counts fall to the level this filter can hold, and compare it with the target for a piston motor.
- Change the filter from β₁₀ = 200 to 75 and to a coarse 25 µm element: the 14 µm count barely changes, the 4 µm count rises — fine particles are the hard ones.
- Make the site dusty or the seals worn: the code climbs by several steps whatever the filter; stopping dirt getting in matters as much as filtering it out.
- Add a kidney loop with a fine filter, or open the tank for service and see the jump.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const [g1] = graphs(box, 1);
      let V = null, N = [4000, 1000, 120], tmin = 0, lastPlot = -1, ph = 0;
      const hist = history(240);
      const rnd = (() => { let a = 12345; return () => ((a = (a * 1103515245 + 12345) % 2147483648) / 2147483648); })();
      const dots = [0, 1, 2].map(() => Array.from({ length: 200 }, () => ({ x: rnd(), y: rnd(), vx: rnd() - 0.5, vy: rnd() - 0.5 })));
      const ctl = kit.controls(box.side, [
        { id: 'filt', type: 'select', label: 'Filter element', options: [['No filter', 'none'], ['Coarse, 25 µm nominal (β₂₅ ≈ 2)', 'coarse'], ['β₁₀(c) = 75', 'b75'], ['β₁₀(c) = 200', 'b200'], ['β₅(c) = 1000', 'b1000']], value: 'b200' },
        { id: 'r', label: 'Flow through the filter, tank volumes per minute', min: 0.05, max: 1, step: 0.05, value: 0.3 },
        { id: 'ing', type: 'select', label: 'Dirt coming in', options: [['Clean site, good breather and wipers', 1], ['Worn cylinder rod seals', 5], ['Dusty site, no breather filter', 20]], value: 1 },
        { id: 'kid', type: 'check', label: 'Kidney loop: β₃(c) = 1000 at 0.1 volume/min', value: false },
        { id: 'target', type: 'select', label: 'Target', options: [['Servo valves 16/14/11', 16], ['Proportional valves 17/15/12', 17], ['Piston pumps and motors 18/16/13', 18], ['Gear and vane units 19/17/14', 19]], value: 18 },
        { id: 'speed', type: 'select', label: 'Time', options: [['1 s = 1 min', 1], ['1 s = 10 min', 10]], value: 1 },
        { type: 'buttons', items: [{ id: 'fill', label: 'Fill with new, unfiltered oil', primary: true }, { id: 'open', label: 'Open the tank for service' }] }
      ], id => {
        if (id === 'fill') { N = [4000, 1000, 120]; hist.clear(); tmin = 0; }
        if (id === 'open') N = N.map((v, i) => v + [3000, 900, 150][i]);
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['code', 'ISO 4406 code now'], ['cnt', 'Particles per mL ≥ 4 / 6 / 14 µm'], ['E', 'Filter capture per pass at 4 / 6 / 14 µm'], ['eq', 'Where it settles'], ['t', 'Time']]);
      const plot = kit.plot(g1, { x: { label: 'time (min)', min: 0 }, y: { label: 'particles per mL', log: true, min: 1, max: 1e5 }, legend: true }, 190);
      const loop = kit.loop(dt => {
        const C = kit.colors(), spec = FILT[V.filt], dtm = dt * V.speed;
        const lam = SIZES.map(x => V.r * (1 - 1 / betaAt(spec, x)) + (V.kid ? 0.1 * (1 - 1 / betaAt([3, 1000], x)) : 0));
        const eq = SIZES.map((x, i) => (lam[i] > 0 ? INGRESS[i] * V.ing / lam[i] : Infinity));
        N = N.map((n, i) => (lam[i] > 0 ? eq[i] + (n - eq[i]) * Math.exp(-lam[i] * dtm) : n + INGRESS[i] * V.ing * dtm));
        tmin += dtm;
        const codes = N.map(isoCode), tgt = [V.target, V.target - 2, V.target - 5], ok = codes.every((cc, i) => cc <= tgt[i]);
        const eqc = eq.map(e => (Number.isFinite(e) ? isoCode(e) : '—'));
        ro.set('code', codes.join('/') + (ok ? ' — meets ' : ' — above ') + tgt.join('/'));
        ro.set('cnt', N.map(n => n.toFixed(n < 10 ? 1 : 0)).join(' / '));
        ro.set('E', SIZES.map(x => (100 * (1 - 1 / betaAt(spec, x))).toFixed(1) + ' %').join(' / '));
        ro.set('eq', eqc.join('/') + (lam[0] > 0 ? ', in about ' + (3 / Math.min(...lam)).toFixed(0) + ' min' : ' — no filter: it only gets dirtier'));
        ro.set('t', tmin < 120 ? tmin.toFixed(1) + ' min' : (tmin / 60).toFixed(1) + ' h');
        if (lastPlot < 0 || tmin - lastPlot > 0.25 * V.speed) {
          lastPlot = tmin; hist.push([tmin, N[0], N[1], N[2]]);
          const ub = cc => 80 * Math.pow(2, cc - 13);
          plot.set({ series: [{ pts: hist.col(1).map(p => [p[0], Math.max(1, p[1])]), label: '≥ 4 µm' }, { pts: hist.col(2).map(p => [p[0], Math.max(1, p[1])]), label: '≥ 6 µm' }, { pts: hist.col(3).map(p => [p[0], Math.max(1, p[1])]), label: '≥ 14 µm' }],
            hlines: [{ y: ub(tgt[0]), label: 'target ' + tgt[0] }, { y: ub(tgt[1]), label: tgt[1] }, { y: ub(tgt[2]), label: tgt[2] }] });
        }
        // ---- drawing on a 700 × 300 grid
        const c = frame(st, 700, 300), tx = 40, ty = 60, tw = 300, th = 200;
        c.fillStyle = C.dark ? 'rgba(210,170,60,.16)' : 'rgba(200,150,30,.14)'; c.fillRect(tx, ty + 20, tw, th - 20);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(tx, ty, tw, th);
        const sizes = [1.3, 2.2, 3.8], cols = [C.muted, C.warn, C.bad];
        for (let k = 0; k < 3; k++) {
          const n = Math.min(200, Math.round(1.5 * Math.sqrt(N[k])));
          for (let j = 0; j < n; j++) {
            const d = dots[k][j]; d.x = (d.x + d.vx * dt * 0.02 + 1) % 1; d.y = (d.y + d.vy * dt * 0.02 + 1) % 1;
            kit.dot(c, tx + 6 + d.x * (tw - 12), ty + 26 + d.y * (th - 32), sizes[k], cols[k]);
          }
        }
        kit.label(c, 'reservoir: ≥ 4 µm grey, ≥ 6 µm amber, ≥ 14 µm red (dots ∝ √count)', tx, ty - 10, { color: C.muted, size: 10, align: 'left' });
        // circulation through the filter
        const loopPath = [[tx + tw, ty + 170], [430, ty + 170], [430, ty + 40], [tx + tw, ty + 40]];
        c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); loopPath.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke();
        ph += dt * 40 * V.r;
        kit.fsym.flow(c, loopPath, ph, { color: C.accent });
        c.fillStyle = C.surface2 || C.bg2; c.fillRect(405, ty + 70, 50, 80); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(405, ty + 70, 50, 80);
        if (spec) { c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); for (let i = 0; i <= 10; i++) { c.lineTo(410 + 40 * i / 10, ty + 78 + (i % 2) * 64); } c.stroke(); }
        kit.label(c, spec ? 'filter' : 'no filter', 430, ty + 164, { color: C.muted, size: 10 });
        // the code
        kit.label(c, codes.join('/'), 580, 110, { color: ok ? C.ok : C.bad, size: 30, weight: 700 });
        kit.label(c, 'ISO 4406 now', 580, 72, { color: C.muted, size: 12 });
        kit.label(c, 'target ' + tgt.join('/'), 580, 150, { color: C.text, size: 13 });
        kit.label(c, 'settles at ' + eqc.join('/'), 580, 176, { color: C.text, size: 13 });
        kit.label(c, 'each code step = twice the particles', 580, 220, { color: C.muted, size: 11 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ hy-heat */
  Hyper.sim('hy-heat', {
    title: 'Heat balance and the viscosity window',
    blurb: `A power unit's losses heat the oil; the tank's walls and an optional cooler (with a thermostat that opens at 45–50 °C) carry the heat away. Time runs 60 times faster: one second is one minute. The left graph is the oil temperature; the right graph the oil's viscosity against temperature, with the window a piston motor or pump wants and the present point. The pump's inlet pressure is worked out from the suction line, the strainer and the oil's viscosity.

**Try this**
- Start with a proportional-valve system of 30 kW and no cooler: the tank alone cannot shed the heat and the oil passes 80 °C. Add a cooler.
- Switch to a load-sensing system: less loss, less heat — the cheapest cooler is a more efficient circuit.
- Try a small 60 L tank: it warms faster, and settles at the same temperature only if a cooler does the work.
- Set the ambient to −15 °C and press *Cold start*: the viscosity is far above the window and the pump inlet pressure falls below its limit — cavitation. A bigger suction line, a thinner or HV oil, or a heater cures it.
- Compare VG 32, 46 and 68 at the working temperature you reach.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 240 });
      const [g1, g2] = graphs(box, 2);
      let V = null, T = 25, tmin = 0, tPlot = -1, fan = 0;
      const hist = history(240);
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Power into the pump', min: 2, max: 100, step: 1, value: 30, unit: 'kW', log: true },
        { id: 'eff', type: 'select', label: 'Circuit', options: [['Load sensing, variable pump (≈ 80 % efficient)', 0.8], ['Proportional valve, fixed pump (≈ 55 %)', 0.55], ['Fixed pump, mostly over the relief (≈ 25 %)', 0.25]], value: 0.55 },
        { id: 'V', label: 'Tank volume', min: 40, max: 1000, step: 10, value: 250, unit: 'L', log: true },
        { id: 'cool', type: 'select', label: 'Cooler', options: [['None', 0], ['Air–oil, 200 W/K', 200], ['Air–oil, 500 W/K', 500], ['Air–oil, 1000 W/K', 1000]], value: 0 },
        { id: 'Ta', label: 'Ambient air', min: -20, max: 45, step: 1, value: 25, unit: '°C' },
        { id: 'grade', type: 'select', label: 'Oil', options: [['ISO VG 32', 32], ['ISO VG 46', 46], ['ISO VG 68', 68]], value: 46 },
        { id: 'Q', label: 'Pump flow (for the suction line)', min: 10, max: 200, step: 5, value: 60, unit: 'L/min', log: true },
        { id: 'd', type: 'select', label: 'Suction line bore', options: [['19 mm', 19], ['25 mm', 25], ['32 mm', 32], ['40 mm', 40], ['50 mm', 50]], value: 32 },
        { type: 'buttons', items: [{ id: 'cold', label: 'Cold start', primary: true }] }
      ], id => { if (id === 'cold') { T = V.Ta; tmin = 0; hist.clear(); } tPlot = -1; });
      V = ctl.values; T = V.Ta;
      const ro = kit.readout(box.side, [['T', 'Oil temperature'], ['heat', 'Heat made / tank / cooler'], ['bal', 'Where it settles'], ['nu', 'Viscosity'], ['pin', 'Pump inlet (absolute)'], ['t', 'Time']]);
      const pT = kit.plot(g1, { x: { label: 'time (min)', min: 0 }, y: { label: 'oil temperature (°C)' }, legend: true }, 180);
      const pv = kit.plot(g2, { x: { label: 'temperature (°C)', min: -20, max: 100 }, y: { label: 'viscosity (mm²/s)', log: true, min: 4, max: 20000 }, legend: true }, 180);
      const area = () => 5.5 * Math.pow(V.V / 1000, 2 / 3);
      const flows = TT => { const tank = 12 * area() * (TT - V.Ta), th = clamp((TT - 45) / 5, 0, 1), cool = V.cool * Math.max(0, TT - V.Ta) * th; return { tank, cool }; };
      const loop = kit.loop(dt => {
        const C = kit.colors(), Ploss = V.P * 1000 * (1 - V.eff), Ceff = V.V * 0.87 * 1900 + V.V * 0.4 * 460;
        const sub = 10, h = dt * 60 / sub;                          // 1 s shown = 60 s simulated
        for (let k = 0; k < sub; k++) { const f = flows(T); T += h * (Ploss - f.tank - f.cool) / Ceff; }
        T = clamp(T, -40, 150); tmin += dt;
        let lo = V.Ta, hi = V.Ta + 400; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2, f = flows(m); if (f.tank + f.cool < Ploss) lo = m; else hi = m; }
        const Tbal = lo, f = flows(T), nu = F.oilViscosity(V.grade, T) * 1e6;
        // suction: 1 m of line, the oil 0.3 m above the inlet, a 125 µm strainer
        const d = V.d / 1000, Q = V.Q / 60000, vel = Q / (Math.PI * d * d / 4), Re = vel * d / (nu * 1e-6), fr = F.friction(Re, 5e-5 / d);
        const dpl = fr * (1.0 / d) * 870 * vel * vel / 2 + 1.5 * 870 * vel * vel / 2, dps = 0.05e5 * Math.pow(nu / 46, 0.6) * (V.Q / 60);
        const pin = 1.013e5 + 870 * 9.81 * 0.3 - dpl - dps, cav = pin < 0.8e5;
        const win = nu > 1000 ? 'too thick even for a cold start' : nu > 36 ? 'thicker than the best range' : nu >= 16 ? 'in the best range (16–36)' : nu >= 10 ? 'thin: leakage and wear rise' : 'below 10 — too thin';
        ro.set('T', T.toFixed(1) + ' °C' + (T > 80 ? ' — too hot!' : T > 60 ? ' — hot: oil ages fast' : ''));
        ro.set('heat', kw(Ploss) + ' / ' + kw(Math.max(0, f.tank)) + ' / ' + kw(f.cool));
        ro.set('bal', Tbal > 150 ? 'above 150 °C — it needs a cooler (or fewer losses)' : Tbal.toFixed(0) + ' °C');
        ro.set('nu', nu.toFixed(nu < 100 ? 1 : 0) + ' mm²/s — ' + win);
        ro.set('pin', (pin < 0.1e5 ? 'below 0.1' : (pin / 1e5).toFixed(2)) + ' bar, line ' + vel.toFixed(2) + ' m/s' + (cav ? ' — CAVITATION (limit about 0.8 bar)' : ''));
        ro.set('t', tmin.toFixed(0) + ' min');
        if (tPlot < 0 || tmin - tPlot > 0.5) {
          tPlot = tmin; hist.push([tmin, T]);
          pT.set({ series: [{ pts: hist.col(1), label: 'oil' }], hlines: [{ y: 60, label: '60 °C' }, { y: 80, label: '80 °C' }, { y: V.Ta, label: 'air' }] });
          const vc = []; for (let x = -20; x <= 100; x += 2) vc.push([x, F.oilViscosity(V.grade, x) * 1e6]);
          pv.set({ series: [{ pts: vc, label: 'ISO VG ' + V.grade }], hlines: [{ y: 1000, label: 'cold-start limit' }, { y: 36, label: '36' }, { y: 16, label: '16' }, { y: 10, label: 'min' }], marks: [{ x: clamp(T, -20, 100), y: nu, label: 'now' }] });
        }
        // ---- drawing on a 700 × 290 grid
        const c = frame(st, 700, 290), hue = clamp(220 - (T - 10) * 3, 0, 220);
        c.fillStyle = 'hsl(' + hue.toFixed(0) + ' 70% 50% / .35)'; c.fillRect(180, 110, 240, 130);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(180, 90, 240, 150);
        kit.label(c, V.V + ' L tank, ' + area().toFixed(2) + ' m²', 300, 258, { color: C.muted, size: 11 });
        kit.label(c, T.toFixed(0) + ' °C', 300, 172, { color: C.text, size: 22, weight: 700 });
        // heat in: the losses
        const nIn = clamp(Math.round(Ploss / 2000) + 1, 1, 8);
        for (let i = 0; i < nIn; i++) kit.arrow(c, 60, 120 + i * 14, 176, 140 + i * 6, C.bad, 2);
        kit.label(c, 'losses ' + kw(Ploss), 70, 100, { color: C.bad, size: 12, weight: 700, align: 'left' });
        // heat out through the walls
        const nOut = clamp(Math.round(Math.max(0, f.tank) / 300), 0, 6);
        for (let i = 0; i < nOut; i++) kit.arrow(c, 200 + i * 38, 88, 200 + i * 38, 60, C.warn, 2);
        kit.label(c, 'walls ' + kw(Math.max(0, f.tank)), 300, 48, { color: C.warn, size: 12, align: 'center' });
        // the cooler and its fan
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(470, 100, 70, 110);
        for (let y = 108; y < 206; y += 8) { c.beginPath(); c.moveTo(474, y); c.lineTo(536, y); c.stroke(); }
        fan += dt * (f.cool > 0 ? 12 : 0);
        c.save(); c.translate(600, 155); c.rotate(fan); c.fillStyle = V.cool ? C.accent : C.faint; for (let k = 0; k < 4; k++) { c.rotate(Math.PI / 2); c.beginPath(); c.ellipse(0, -16, 6, 15, 0, 0, TAU); c.fill(); } c.restore();
        kit.label(c, V.cool ? 'cooler ' + kw(f.cool) + (f.cool <= 0 ? ' (thermostat closed)' : '') : 'no cooler', 505, 226, { color: C.text, size: 12 });
        c.strokeStyle = C.muted; c.beginPath(); c.moveTo(420, 200); c.lineTo(470, 200); c.moveTo(420, 120); c.lineTo(470, 120); c.stroke();
        // suction
        c.strokeStyle = cav ? C.bad : S_col(kit, 'suction'); c.lineWidth = 3; c.beginPath(); c.moveTo(220, 240); c.lineTo(220, 275); c.lineTo(120, 275); c.stroke();
        kit.label(c, 'pump inlet ' + Math.max(0, pin / 1e5).toFixed(2) + ' bar abs', 116, 262, { color: cav ? C.bad : C.muted, size: 11, align: 'right' });
        if (cav) for (let i = 0; i < 8; i++) { c.strokeStyle = C.bad; c.lineWidth = 1; c.beginPath(); c.arc(130 + i * 11, 275 + ((i * 7 + Math.floor(tmin * 5)) % 5) - 2, 2.5, 0, TAU); c.stroke(); }
        kit.label(c, nu.toFixed(0) + ' mm²/s', 300, 200, { color: nu > 36 || nu < 16 ? C.warn : C.ok, size: 13 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
