/* HYPER-PNEUMATICS · sims/actuators.js — simulations for the branch "Cylinders and Actuators".
 *   act-single-acting  a spring-return cylinder on a 3/2 valve: the chamber fills and empties by ISO 6358, the piston
 *                      moves against spring, load and friction; the force–stroke line (air force minus spring force)
 *   act-speed          a cylinder speed explorer on kit.fluid.pneuCylinder: start delay, speed profile, stroke time,
 *                      the choked-exhaust speed C·p_ref/A₂, a stroboscope of the rod and the previous run to compare
 *   act-cushion        stopping the load at the end of the stroke: elastic bumpers, an adjustable air cushion (trapped
 *                      air compressed adiabatically, needle flow by ISO 6358) or a shock absorber, against typical ratings
 *   act-air-motor      an air motor's torque and power against speed, a load line, inlet throttling and pressure
 *   act-gripper        the gripping force a friction grip needs, and the gripper bore that gives it
 *   act-muscle         a fluidic muscle's pull against its contraction, lifting a load, beside a cylinder of the same bore
 */
(function () {
  'use strict';
  const PATM = 1.013e5, RAIR = 287.058, TREF = 293.15, GAM = 1.4, G0 = 9.80665;
  const RODS = { 8: 4, 10: 4, 12: 6, 16: 6, 20: 8, 25: 10, 32: 12, 40: 16, 50: 20, 63: 20, 80: 25, 100: 25, 125: 32 };
  const area = d => Math.PI * d * d / 4;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fin = (v, d) => Number.isFinite(v) ? v : (d || 0);
  const series2 = (a, b) => 1 / Math.sqrt(1 / (a * a) + 1 / (b * b));        // sonic conductances in series

  // graphs side by side under the stage
  function graphs(stage, n) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:' + (n === 1 ? '1fr' : '1fr 1fr') + ';gap:8px';
    stage.appendChild(wrap);
    const out = [];
    for (let i = 0; i < (n || 2); i++) { const d = document.createElement('div'); wrap.appendChild(d); out.push(d); }
    return out;
  }
  // a chamber's fill colour from its gauge pressure (compressed air: blue)
  function airFill(C, pg, pmax) {
    if (!(pg > 0.15e5)) return null;
    return (C.dark ? 'rgba(79,141,255,' : 'rgba(29,78,216,') + Math.min(0.55, 0.08 + 0.42 * pg / Math.max(pmax, 1e4)).toFixed(3) + ')';
  }
  // a design grid of W × H units scaled into the stage
  function grid(st, W, H) {
    const c = st.begin(), k = Math.max(1e-3, Math.min(st.W / W, st.H / H));
    c.save(); c.translate((st.W - W * k) / 2, (st.H - H * k) / 2); c.scale(k, k);
    return c;
  }
  const thin = (pts, n) => { if (pts.length <= n) return pts; const k = Math.ceil(pts.length / n); return pts.filter((p, i) => i % k === 0 || i === pts.length - 1); };

  /* ================================================================ act-single-acting */
  const SPR = { 8: [2, 0.05], 10: [3, 0.06], 12: [5, 0.1], 16: [8, 0.25], 20: [12, 0.3], 25: [20, 0.4], 32: [30, 0.6], 40: [45, 0.9], 50: [70, 1.4] };

  Hyper.sim('act-single-acting', {
    title: 'A spring-return cylinder: air against the spring',
    blurb: `A push-type single-acting cylinder worked by a 3/2 valve. Pressing the valve fills the cap end through the valve (flow by ISO 6358, the air compressed and expanded adiabatically as the piston moves); releasing it vents the chamber through the silencer and the spring pushes the rod home. The graph on the left is the cylinder's force–stroke picture: the air force $p\\,A$ is flat, the spring force $F_0 + kx$ rises along the stroke, and what is left for the load — the air force minus the spring — falls. The dot is the piston now: where the chamber pressure has got to, at the position it has reached.

**Try this**
- Raise the load until the "air − spring" line crosses it inside the stroke: the rod stalls there, exactly where the graph says.
- Lower the supply pressure to 2 bar: the same spring now takes a much larger share of the force.
- Stiffen the spring (rate) and lengthen the stroke: the useful force at the end of the stroke drops fast — why single-acting strokes are short.
- Weaken the spring preload below the friction: the rod no longer returns fully.
- Compare the measured free air per cycle with $A\\,s\\,(p_g + p_\\text{atm})/p_\\text{atm}$: only one stroke uses air.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const [g1, g2] = graphs(box.stage);
      let cmd = 1, auto = true;
      const s = { x: 0, v: 0, pA: PATM, air: 0, t: 0, hist: [], tPlot: 1, t0: 0, lastCmd: 1, wait: 0, tExt: '—', tRet: '—', arrived: false, airAt: 0, cycleAir: 0, vstate: 0, ph: {}, status: '' };
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'on', label: 'Press the valve', primary: true }, { id: 'off', label: 'Release' }] },
        { id: 'auto', type: 'check', label: 'Cycle automatically', value: true },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 0.5, max: 10, step: 0.1, value: 6, unit: 'bar' },
        { id: 'bore', type: 'select', label: 'Bore', options: Object.keys(SPR).map(b => [b + ' mm', +b]), value: 25 },
        { id: 'stroke', label: 'Stroke', min: 10, max: 100, step: 5, value: 50, unit: 'mm' },
        { id: 'f0', label: 'Spring force, rod retracted (preload)', min: 1, max: 300, value: 20, unit: 'N', log: true, sig: 2 },
        { id: 'k', label: 'Spring rate', min: 0.02, max: 5, value: 0.4, unit: 'N/mm', log: true, sig: 2 },
        { id: 'load', label: 'Load against extension', min: 0, max: 800, step: 5, value: 60, unit: 'N' },
        { id: 'mass', label: 'Moving mass', min: 0.05, max: 10, value: 0.5, unit: 'kg', log: true },
        { id: 'cv', label: '3/2 valve sonic conductance C', min: 0.05, max: 2, value: 0.4, unit: 'dm³/(s·bar)', log: true },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25], ['Slow motion 1/10', 0.1]], value: 0.25 }
      ], (id, v) => {
        if (id === 'on') { cmd = 1; auto = false; ctl.set('auto', false); }
        if (id === 'off') { cmd = 0; auto = false; ctl.set('auto', false); }
        if (id === 'auto') auto = v;
        if (id === 'bore') { const d = SPR[v] || SPR[25]; ctl.set('f0', d[0]); ctl.set('k', d[1]); }
        if (id === 'stroke' || id === 'bore') s.x = Math.min(s.x, V.stroke / 1000);
      });
      const ro = kit.readout(box.side, [['fair', 'Air force at supply, p·A'], ['fs', 'Spring: retracted → fully extended'], ['fend', 'Air − spring at full stroke'], ['p', 'Chamber pressure'], ['t', 'Extend / return time'], ['air', 'Free air per cycle'], ['st', 'Now']]);
      const pF = kit.plot(g1, { x: { label: 'position along the stroke (mm)' }, y: { label: 'force (N)' }, legend: true }, 150);
      const pT = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'per cent', min: 0, max: 105 }, legend: true }, 150);
      const V = ctl.values;

      function stepModel(dt) {
        const D = V.bore / 1000, A = area(D), L = V.stroke / 1000, ps = V.ps * 1e5 + PATM;
        const Cv = V.cv * 1e-8, b = 0.35, m = V.mass, F0 = V.f0, k = V.k * 1000, FL = V.load;
        const Vd = A * 0.004 + 1.5e-6, fv = 40000 * A;
        const n = Math.max(1, Math.ceil(dt / 2e-5)), h = dt / n;
        for (let i = 0; i < n; i++) {
          const VA = Vd + A * s.x;
          const md = cmd ? F.iso6358({ C: Cv, b, p1: ps, p2: s.pA }).mdot : -F.iso6358({ C: Cv, b, p1: s.pA, p2: PATM }).mdot;
          if (md > 0) s.air += md * h;
          const pg = s.pA - PATM;
          const fc = 1 + 0.02 * A * V.ps * 1e5 + 0.04 * A * Math.max(0, pg);      // lip seals press harder under pressure
          const Fnet = pg * A - (F0 + k * s.x) - FL;
          let a;
          if (Math.abs(s.v) < 1e-4 && Math.abs(Fnet) <= fc) { a = 0; s.v = 0; }
          else a = (Fnet - Math.sign(s.v || Fnet) * fc - fv * s.v) / m;
          s.v += a * h; s.x += s.v * h;
          if (s.x <= 0) { s.x = 0; if (s.v < 0) s.v = 0; }
          if (s.x >= L) { s.x = L; if (s.v > 0) s.v = 0; }
          s.pA += h * GAM * (RAIR * TREF * md - s.pA * A * s.v) / VA;
          if (md > 0 && s.pA > ps) s.pA = ps;
          if (md < 0 && s.pA < PATM) s.pA = PATM;
          s.pA = Math.max(0.3 * PATM, s.pA);
        }
      }

      const loop = kit.loop((dt) => {
        const D = V.bore / 1000, A = area(D), L = V.stroke / 1000, ps = V.ps * 1e5 + PATM, k = V.k, F0 = V.f0;
        const sdt = Math.min(dt, 0.05) * V.slow;
        // automatic cycling: switch 0.4 s after the rod has come to rest at the end of its travel
        const atEnd = cmd ? s.x >= L - 1e-6 : s.x <= 1e-6;
        const settled = Math.abs(s.v) < 1e-4 && (cmd ? s.pA > ps - 0.03e5 : s.pA < PATM + 0.03e5);
        if (auto && (atEnd || settled)) { s.wait += sdt; if (s.wait > 0.4) { cmd = 1 - cmd; s.wait = 0; } } else s.wait = 0;
        if (cmd !== s.lastCmd) {
          if (cmd === 1) { if (s.airAt) s.cycleAir = (s.air - s.airAt) / F.RHO_ANR * 1000; s.airAt = s.air; }
          s.t0 = s.t; s.arrived = false; s.lastCmd = cmd;
        }
        stepModel(sdt);
        s.t += sdt;
        if (!s.arrived && (cmd ? s.x >= L - 1e-6 : s.x <= 1e-6)) { s.arrived = true; const tt = (s.t - s.t0).toFixed(3) + ' s'; if (cmd) s.tExt = tt; else s.tRet = tt; }
        s.vstate += Math.max(-sdt / 0.02, Math.min(sdt / 0.02, (cmd ? 0 : 1) - s.vstate));
        const pg = s.pA - PATM, pAirS = V.ps * 1e5 * A, endOut = pAirS - F0 - k * V.stroke;
        // what is happening
        if (cmd) {
          if (s.x >= L - 1e-6) s.status = 'extended, pressing with ' + Math.max(0, pg * A - F0 - k * V.stroke).toFixed(0) + ' N beyond the spring';
          else if (settled) s.status = s.x < 1e-6 ? 'cannot start: air force below preload + load' : 'stalled at ' + (s.x * 1000).toFixed(1) + ' mm: air − spring = load';
          else s.status = Math.abs(s.v) > 1e-4 ? 'extending at ' + s.v.toFixed(2) + ' m/s' : 'filling the chamber';
        } else {
          if (s.x <= 1e-6) s.status = 'retracted';
          else if (settled) s.status = 'the spring cannot beat friction: stuck at ' + (s.x * 1000).toFixed(1) + ' mm';
          else s.status = Math.abs(s.v) > 1e-4 ? 'returning on the spring' : 'exhausting';
        }
        ro.set('fair', pAirS.toFixed(0) + ' N');
        ro.set('fs', F0.toFixed(1) + ' → ' + (F0 + k * V.stroke).toFixed(1) + ' N');
        ro.set('fend', endOut.toFixed(0) + ' N' + (endOut < V.load ? ' — less than the load' : ''));
        ro.set('p', (pg / 1e5).toFixed(2) + ' bar gauge');
        ro.set('t', s.tExt + ' / ' + s.tRet);
        const ideal = A * L * ps / PATM * 1000;
        ro.set('air', s.cycleAir ? s.cycleAir.toFixed(3) + ' L (A·s·ratio: ' + ideal.toFixed(3) + ' L)' : 'after the first full cycle');
        ro.set('st', s.status);
        // history and graphs
        s.hist.push([s.t, 100 * s.x / L, 100 * pg / Math.max(1, V.ps * 1e5)]);
        while (s.hist.length && s.hist[0][0] < s.t - 4) s.hist.shift();
        s.tPlot += dt;
        if (s.tPlot > 0.07) {
          s.tPlot = 0;
          const lo = Math.min(0, endOut, pAirS - F0), hi = Math.max(pAirS, F0 + k * V.stroke, V.load, 1) * 1.1;
          pF.set({
            series: [
              { pts: [[0, pAirS], [V.stroke, pAirS]], label: 'air force p·A' },
              { pts: [[0, F0], [V.stroke, F0 + k * V.stroke]], label: 'spring F₀ + kx', dash: [5, 4] },
              { pts: [[0, pAirS - F0], [V.stroke, endOut]], label: 'air − spring' },
              { pts: [[0, V.load], [V.stroke, V.load]], label: 'load', dash: [2, 3] }
            ],
            marks: [{ x: s.x * 1000, y: pg * A - F0 - k * s.x * 1000, label: 'now' }],
            x: { label: 'position along the stroke (mm)', min: 0, max: V.stroke }, y: { label: 'force (N)', min: lo - 0.05 * (hi - lo), max: hi }
          });
          const h = s.hist.filter((q, i) => i % 2 === 0);
          pT.set({ series: [{ pts: h.map(q => [q[0], q[1]]), label: 'position, % of stroke' }, { pts: h.map(q => [q[0], q[2]]), label: 'pressure, % of supply', dash: [5, 4] }] });
        }
        // ---- drawing on a 760 × 380 design grid
        const c = grid(st, 760, 380), C = kit.colors();
        const exh = !cmd, lineA = exh ? (pg > 0.2e5 ? 'exhaust' : 'idle') : 'air';
        const LA = [[393.2, 223], [393.2, 170], [258, 170], [258, 113]], LS = [[170, 330], [170, 310], [202, 310]], LM = [[298, 310], [393.2, 310], [393.2, 277]];
        S.line(c, LS, { state: 'air' }); S.line(c, LM, { state: 'air' }); S.line(c, [[345, 300], [345, 310]], { state: 'air' }); S.junction(c, 345, 310);
        S.line(c, LA, { state: lineA });
        // flow dots from the valve flow
        const Cv = V.cv * 1e-8, qref = Cv * ps;
        const q = cmd ? F.iso6358({ C: Cv, b: 0.35, p1: ps, p2: s.pA }).qANR : F.iso6358({ C: Cv, b: 0.35, p1: s.pA, p2: PATM }).qANR;
        const adv = (key, qq) => { s.ph[key] = (s.ph[key] || 0) + dt * 70 * qq / Math.max(qref, 1e-12); return s.ph[key]; };
        if (q > qref * 0.01) {
          S.flow(c, cmd ? LA : LA.slice().reverse(), adv('a', q), { color: S.col(cmd ? 'air' : 'exhaust') });
          if (cmd) S.flow(c, LS.concat(LM), adv('s', q), { color: S.col('air') });
        }
        S.source(c, 170, 350, { pneumatic: true });
        S.frl(c, 250, 310);
        S.gauge(c, 345, 279, { frac: V.ps / 12, value: V.ps.toFixed(1) + ' bar' });
        const vv = S.valve(c, 400, 250, { spec: '3/2 NC', state: s.vstate, left: 'pushbutton', right: 'spring', s: 34, pneumatic: true, labels: true, exhaust: 'silencer' });
        kit.label(c, cmd ? 'pressed' : 'released', vv.xl - 6, 232, { color: cmd ? C.accent : C.muted, size: 11, weight: 700, align: 'right' });
        kit.label(c, '3/2 valve', 470, 250, { color: C.muted, size: 11 });
        // (pos is kept just below 1: fsym.cylinder draws the spring of a 'retract' cylinder with zero length at pos = 1)
        const cy = S.cylinder(c, 250, 80, { len: 280, h: 46, rodLen: 150, pos: L > 0 ? Math.min(0.99, s.x / L) : 0, single: 'retract', fillA: airFill(C, pg, V.ps * 1e5) });
        const mw = 24 + 6 * Math.log2(1 + V.mass);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(cy.tip[0], 80 - mw / 2, mw, mw); c.strokeRect(cy.tip[0], 80 - mw / 2, mw, mw);
        kit.label(c, V.mass.toFixed(2) + ' kg', cy.tip[0] + mw / 2, 80 + mw / 2 + 12, { color: C.muted, size: 11, align: 'center' });
        if (V.load > 0) {
          const la = 22 + 30 * Math.min(1, V.load / Math.max(1, pAirS));
          kit.arrow(c, cy.tip[0] + mw + 8 + la, 80, cy.tip[0] + mw + 6, 80, C.warn, 2.5);
          kit.label(c, 'load ' + V.load.toFixed(0) + ' N', cy.tip[0] + mw + 8 + la / 2, 62, { color: C.warn, size: 11, align: 'center', weight: 700 });
        }
        kit.label(c, (pg / 1e5).toFixed(2) + ' bar', 290, 42, { color: C.text, size: 12, weight: 700, align: 'center' });
        kit.label(c, 'spring ' + (F0 + k * s.x * 1000).toFixed(0) + ' N', 470, 42, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'vent', 522, 110, { color: C.muted, size: 10, align: 'center' });
        kit.label(c, 'x = ' + (s.x * 1000).toFixed(1) + ' mm', 740, 350, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 't = ' + s.t.toFixed(2) + ' s', 740, 368, { color: C.muted, size: 11, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ act-speed */
  const SPEED_BORES = [16, 20, 25, 32, 40, 50, 63, 80, 100];

  Hyper.sim('act-speed', {
    title: 'Cylinder speed explorer',
    blurb: `One extending stroke of a double-acting cylinder, from rest, computed by the engine's cylinder model: a 5/2 valve fills the cap end while the rod end exhausts through the valve and a meter-out throttle, both by ISO 6358; the chamber pressures follow the adiabatic energy balance; friction and the load act on the piston. The dashes above the cylinder are a stroboscope — where the rod end was every 20 ms — so their spacing is the speed. After each change of settings the last finished run stays in the graphs, dashed, for comparison.

**Try this**
- Change the supply pressure from 4 to 8 bar: the steady speed hardly moves. It is set by the exhaust, $v \\approx C\\,p_\\text{ref}/A_2$ (the dashed line), not by the pressure.
- Open the throttle (or pick a bigger valve): the speed rises in proportion to the exhaust path's conductance, until the valve itself limits it.
- Raise the load ratio past 60–70 %: the start delay grows, the back pressure falls, the exhaust stops being choked and the cylinder runs below the dashed line.
- Try a heavy mass: a long acceleration, overshoot, and a much larger impact energy at the end.
- Choose a 100 mm bore with the same valve: the speed falls with the area.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const [g1, g2] = graphs(box.stage);
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'run', label: 'Run the stroke again', primary: true }] },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 2, max: 10, step: 0.5, value: 6, unit: 'bar' },
        { id: 'bore', type: 'select', label: 'Cylinder', options: SPEED_BORES.map(b => [b + ' mm bore, ' + RODS[b] + ' mm rod', b]), value: 50 },
        { id: 'stroke', label: 'Stroke', min: 25, max: 500, step: 5, value: 200, unit: 'mm' },
        { id: 'mass', label: 'Moving mass', min: 0.1, max: 50, value: 5, unit: 'kg', log: true },
        { id: 'lr', label: 'Load against extension (load ratio)', min: 0, max: 90, step: 1, value: 20, unit: '%' },
        { id: 'cv', label: 'Valve sonic conductance C', min: 0.1, max: 5, value: 1.2, unit: 'dm³/(s·bar)', log: true },
        { id: 'thr', label: 'Meter-out throttle conductance', min: 0.05, max: 5, value: 0.6, unit: 'dm³/(s·bar)', log: true },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25], ['Slow motion 1/10', 0.1]], value: 0.25 }
      ], (id) => { if (id !== 'slow') start(id !== 'run'); });
      const ro = kit.readout(box.side, [['lim', 'Exhaust-limited speed C·p_ref/A₂'], ['delay', 'Delay before the piston moves'], ['t', 'Stroke time'], ['v', 'Average / top / impact speed'], ['E', 'Impact energy ½mv²'], ['pB', 'Back pressure at mid-stroke'], ['air', 'Free air for the stroke'], ['prev', 'Previous run (dashed)']]);
      const pv = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'speed (m/s)', min: 0 }, legend: true }, 150);
      const pp = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'gauge pressure (bar)', min: 0 }, legend: true }, 150);
      const V = ctl.values;
      let cyl, run = null, prev = null, tPlot = 1;
      function start(changed) {
        if (changed && run && run.done) prev = run;
        const D = V.bore / 1000, d = RODS[V.bore] / 1000, A1 = area(D), ps = V.ps * 1e5 + PATM;
        cyl = F.pneuCylinder({ bore: D, rod: d, stroke: V.stroke / 1000, mass: V.mass, load: V.lr / 100 * V.ps * 1e5 * A1, psupply: ps, patm: PATM,
          Cvalve: V.cv * 1e-8, CthrottleA: V.thr * 1e-8, CthrottleB: V.thr * 1e-8, dead: A1 * 0.005 + 1e-6, fc: 8 + 0.03 * V.ps * 1e5 * A1 });
        cyl.state.x = 0; cyl.state.v = 0; cyl.state.pA = PATM; cyl.state.pB = ps;
        const Ce = series2(V.cv, V.thr);
        run = { t: 0, tr: [], done: false, tMove: null, tEnd: null, vmax: 0, vimp: 0, pBmid: null, wait: 0, strobe: [], nextStrobe: 0, vlim: Ce * 1e-8 * 1e5 / cyl.AB, L: V.stroke / 1000, mass: V.mass, air0: 0, ph: {}, note: '' };
      }
      start(false);

      const loop = kit.loop((dt) => {
        const P = cyl.params, L = run.L;
        if (!run.done) {
          const chunks = Math.max(1, Math.round(Math.min(dt, 0.05) * V.slow / 1e-3));
          for (let k = 0; k < chunks && !run.done; k++) {
            const vPrev = cyl.state.v;
            cyl.step(1e-3, 1); run.t += 1e-3;
            const s = cyl.state;
            run.tr.push([run.t, s.x, s.v, (s.pA - PATM) / 1e5, (s.pB - PATM) / 1e5]);
            run.vmax = Math.max(run.vmax, s.v);
            if (run.tMove === null && s.x > 5e-4) run.tMove = run.t;
            if (run.pBmid === null && s.x >= L / 2) run.pBmid = s.pB;
            if (run.t >= run.nextStrobe) { run.strobe.push(s.x); run.nextStrobe += 0.02; }
            if (s.x >= L - 1e-9) { run.done = true; run.tEnd = run.t; run.vimp = Math.max(0, vPrev); }
            else if (run.t > 10) { run.done = true; run.note = 'still moving after 10 s'; }
          }
        } else {
          run.wait += dt;
          if (run.wait > 2.5) start(false);
        }
        const s = cyl.state, A1 = cyl.AA, A2 = cyl.AB;
        const pA = s.pA - PATM, pB = s.pB - PATM;
        // read-outs
        ro.set('lim', run.vlim.toFixed(3) + ' m/s (C = ' + series2(V.cv, V.thr).toFixed(2) + ' dm³/(s·bar) in series)');
        ro.set('delay', run.tMove === null ? '…' : (run.tMove * 1000).toFixed(0) + ' ms');
        ro.set('t', run.done ? (run.tEnd ? run.tEnd.toFixed(3) + ' s' : run.note) : '…');
        const vavg = run.tEnd ? L / run.tEnd : 0;
        ro.set('v', run.tEnd ? vavg.toFixed(2) + ' / ' + run.vmax.toFixed(2) + ' / ' + run.vimp.toFixed(2) + ' m/s' : run.vmax.toFixed(2) + ' m/s so far');
        ro.set('E', run.tEnd ? (0.5 * run.mass * run.vimp * run.vimp).toFixed(2) + ' J' : '…');
        if (run.pBmid !== null) {
          const choked = PATM / run.pBmid <= P.bvalve;
          ro.set('pB', ((run.pBmid - PATM) / 1e5).toFixed(2) + ' bar gauge — exhaust ' + (choked ? 'choked' : 'not choked'));
        } else ro.set('pB', '…');
        ro.set('air', cyl.airNl().toFixed(3) + ' L');
        ro.set('prev', prev && prev.tEnd ? prev.tEnd.toFixed(3) + ' s, top ' + prev.vmax.toFixed(2) + ' m/s' : '— (change a setting)');
        // graphs
        tPlot += dt;
        if (tPlot > 0.08) {
          tPlot = 0;
          const tr = thin(run.tr, 400), ser = [{ pts: tr.map(q => [q[0], q[2]]), label: 'speed' }];
          if (prev) ser.push({ pts: thin(prev.tr, 300).map(q => [q[0], q[2]]), label: 'previous run', dash: [5, 4] });
          const tmax = Math.max(0.2, run.tEnd || run.t, prev && prev.tEnd ? prev.tEnd : 0) * 1.05;
          pv.set({ series: ser, hlines: [{ y: run.vlim, label: 'C·p_ref/A₂' }], x: { label: 'time (s)', min: 0, max: tmax }, y: { label: 'speed (m/s)', min: 0, max: Math.max(run.vmax, run.vlim, prev ? prev.vmax : 0, 0.05) * 1.15 } });
          pp.set({ series: [{ pts: tr.map(q => [q[0], q[3]]), label: 'cap end' }, { pts: tr.map(q => [q[0], q[4]]), label: 'rod end', dash: [5, 4] }], x: { label: 'time (s)', min: 0, max: tmax }, y: { label: 'gauge pressure (bar)', min: 0, max: V.ps * Math.max(1.3, A1 / A2 + 0.1) } });
        }
        // ---- drawing on a 760 × 380 design grid
        const c = grid(st, 760, 380), C = kit.colors();
        const cx0 = 60, cyY = 105, len = 400, rodLen = 190, tip0 = cx0 + 11 + rodLen, span = len - 15;
        const tipAt = x => tip0 + span * (L > 0 ? x / L : 0);
        // stroboscope: every 20 ms
        kit.label(c, 'every 20 ms', tip0 - 8, 30, { color: C.muted, size: 10, align: 'right' });
        c.strokeStyle = C.faint || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(tip0, 36); c.lineTo(tip0 + span, 36); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 2;
        for (const x of run.strobe) { const X = tipAt(x); c.beginPath(); c.moveTo(X, 26); c.lineTo(X, 36); c.stroke(); }
        if (prev) {
          c.strokeStyle = C.muted; c.lineWidth = 1.5;
          for (const x of prev.strobe) { const X = tip0 + span * (prev.L > 0 ? x / prev.L : 0); if (X <= tip0 + span + 1) { c.beginPath(); c.moveTo(X, 38); c.lineTo(X, 48); c.stroke(); } }
          kit.label(c, 'previous', tip0 - 8, 44, { color: C.muted, size: 10, align: 'right' });
        }
        // circuit
        const stA = 'air', stB = pB > 0.2e5 ? 'exhaust' : 'idle';
        const LA = [[291, 272], [291, 250], [68, 250], [68, 228]], LB = [[309, 272], [309, 250], [452, 250], [452, 228]], LS = [[160, 342], [160, 350], [300, 350], [300, 328]];
        S.line(c, LS, { state: 'air' }); S.line(c, [[220, 339], [220, 350]], { state: 'air' }); S.junction(c, 220, 350);
        S.line(c, LA, { state: stA }); S.line(c, [[68, 172], [68, 140]], { state: stA });
        S.line(c, LB, { state: stB }); S.line(c, [[452, 172], [452, 140]], { state: stB });
        const qref = P.Cvalve * P.psupply;
        const qA = F.iso6358({ C: P.Cvalve, b: P.bvalve, p1: P.psupply, p2: s.pA }).qANR;
        const qB = F.iso6358({ C: series2(P.Cvalve, P.CthrottleB), b: P.bvalve, p1: s.pB, p2: PATM }).qANR;
        const adv = (key, q) => { run.ph[key] = (run.ph[key] || 0) + dt * 70 * q / Math.max(qref, 1e-12); return run.ph[key]; };
        if (!run.done && qA > qref * 0.01) { S.flow(c, LA.concat([[68, 172], [68, 140]]), adv('a', qA), { color: S.col('air') }); S.flow(c, LS, adv('s', qA), { color: S.col('air') }); }
        if (!run.done && qB > qref * 0.01) S.flow(c, [[452, 140], [452, 172]].concat(LB.slice().reverse()), adv('b', qB), { color: S.col('exhaust') });
        S.source(c, 160, 362, { pneumatic: true });
        S.gauge(c, 220, 318, { frac: V.ps / 12, value: V.ps.toFixed(1) + ' bar' });
        const v52 = S.valve(c, 300, 300, { spec: '5/2', state: 0, left: 'solenoid', right: 'spring', s: 36, pneumatic: true, labels: true, exhaust: 'silencer' });
        kit.label(c, '14', v52.xl - 8, 300, { color: C.bad, size: 11, weight: 700, align: 'right' });
        S.flowControl(c, 68, 200, { free: 'up' }); S.flowControl(c, 452, 200, { free: 'up' });
        kit.label(c, 'meter-out', 500, 200, { color: C.muted, size: 11 });
        const cy = S.cylinder(c, cx0, cyY, { len, h: 50, rodLen, pos: L > 0 ? s.x / L : 0, fillA: airFill(C, pA, V.ps * 1e5), fillB: airFill(C, pB, V.ps * 1e5), cushion: true });
        const mw = 26 + 6 * Math.log2(1 + V.mass);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(cy.tip[0], cyY - mw / 2, mw, mw); c.strokeRect(cy.tip[0], cyY - mw / 2, mw, mw);
        kit.label(c, V.mass.toFixed(1) + ' kg', cy.tip[0] + mw / 2, cyY + mw / 2 + 12, { color: C.muted, size: 11, align: 'center' });
        if (s.v > 0.01) kit.arrow(c, cy.tip[0] + mw + 4, cyY - mw / 2 - 8, cy.tip[0] + mw + 4 + clamp(60 * s.v, 6, 90), cyY - mw / 2 - 8, C.ok, 2.5);
        kit.label(c, (pA / 1e5).toFixed(1) + ' bar', 150, 72, { color: C.text, size: 12, weight: 700, align: 'center' });
        kit.label(c, (pB / 1e5).toFixed(1) + ' bar', 400, 72, { color: C.text, size: 12, weight: 700, align: 'center' });
        let phase = 'pressure building';
        if (run.done) phase = run.tEnd ? 'arrived' : run.note;
        else if (run.tMove !== null) phase = s.v < 0.85 * Math.max(run.vmax, 1e-3) ? (s.x > 0.9 * L ? 'cushioning' : 'accelerating') : 'steady speed';
        kit.label(c, phase, 740, 330, { color: run.done ? C.ok : C.accent, size: 12, weight: 700, align: 'right' });
        kit.label(c, 'v = ' + s.v.toFixed(2) + ' m/s', 740, 348, { color: C.text, size: 12, align: 'right' });
        kit.label(c, 't = ' + run.t.toFixed(3) + ' s', 740, 366, { color: C.muted, size: 11, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ act-cushion */
  // typical ratings for standard cylinders at 6 bar: [elastic bumpers J, adjustable air cushion J, cushion length mm]
  const CUSH = { 16: [0.1, 0.2, 10], 25: [0.3, 0.5, 14], 32: [0.4, 1, 18], 50: [1, 2.5, 20], 63: [1.3, 4, 22], 80: [2, 6, 26], 100: [2.5, 10, 28] };
  // typical shock absorbers: [thread, energy per stroke J, stroke mm]
  const SHOCK = [['M8', 1, 6], ['M10', 3, 8], ['M12', 6, 10], ['M14', 10, 12], ['M20', 30, 16], ['M25', 60, 25], ['M33', 150, 25]];

  Hyper.sim('act-cushion', {
    title: 'Stopping the load: bumpers, air cushion or shock absorber',
    blurb: `A cylinder brings a moving mass to its end position at the speed you set. The bars compare its kinetic energy $\\tfrac12 m v^2$ with what each kind of cushioning typically takes for this bore (for the shock absorber the cylinder's drive force over the absorber's stroke is added). Then the chosen device stops it: **elastic bumpers** deflect about a millimetre; the **air cushion** traps the last of the exhaust air, which is compressed adiabatically and escapes through the needle valve (ISO 6358) — the model computes it step by step; the **shock absorber** brakes with a constant force over its stroke. The event is stretched in time so you can watch it.

**Try this**
- 6 kg at 0.8 m/s on a 50 mm cylinder: too much for bumpers, fine for the air cushion.
- With the air cushion, close the needle: the piston stops short, bounces and creeps home. Open it: it hits the end cap. Find the setting where it just arrives.
- Double the speed: four times the energy. Double the mass instead: twice.
- Turn the cylinder vertical, moving down: the cushion must now fight the weight as well.
- Pick a shock absorber and note how much of its load is the cylinder pushing, not the kinetic energy.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      const [g1, g2] = graphs(box.stage);
      const ctl = kit.controls(box.side, [
        { id: 'mass', label: 'Moving mass', min: 0.1, max: 100, value: 6, unit: 'kg', log: true },
        { id: 'v', label: 'Impact speed', min: 0.05, max: 3, step: 0.05, value: 0.8, unit: 'm/s' },
        { id: 'bore', type: 'select', label: 'Cylinder bore', options: Object.keys(CUSH).map(b => [b + ' mm', +b]), value: 50 },
        { id: 'dev', type: 'select', label: 'End-position cushioning', options: [['Elastic bumpers', 'bump'], ['Adjustable air cushion', 'air'], ['Shock absorber', 'shock']], value: 'air' },
        { id: 'needle', label: 'Cushion needle conductance', min: 0.005, max: 1.5, value: 0.15, unit: 'dm³/(s·bar)', log: true, sig: 2 },
        { id: 'shock', type: 'select', label: 'Shock absorber', options: SHOCK.map((q, i) => [q[0] + ': ≈' + q[1] + ' J, ' + q[2] + ' mm stroke', i]), value: 4 },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 2, max: 10, step: 0.5, value: 6, unit: 'bar' },
        { id: 'orient', type: 'select', label: 'Direction of the stroke', options: [['Horizontal', 0], ['Vertical, moving down', 1], ['Vertical, moving up', -1]], value: 0 }
      ], () => { res = compute(); play = 0; plotIt(); });
      const ro = kit.readout(box.side, [['E', 'Kinetic energy ½mv²'], ['rate', 'Typical rating of this cushioning'], ['use', 'Energy to absorb / rating'], ['stop', 'Braking distance'], ['F', 'Peak braking force'], ['g', 'Peak deceleration'], ['p', 'Peak cushion pressure'], ['res', 'Result']]);
      const pF = kit.plot(g1, { x: { label: 'travel in the cushioning (mm)' }, y: { label: 'braking force (N)', min: 0 } }, 150);
      const pV = kit.plot(g2, { x: { label: 'travel in the cushioning (mm)' }, y: { label: 'speed (m/s)', min: 0 } }, 150);
      const V = ctl.values;
      let res, play = 0;

      function compute() {
        const Dm = V.bore, D = Dm / 1000, d = RODS[Dm] / 1000, A1 = area(D), A2 = A1 - area(d), m = V.mass, v0 = V.v, lim = CUSH[Dm] || CUSH[50];
        const Fg = V.orient * m * G0, ps = V.ps * 1e5, Ffr = 5 + 0.03 * ps * A1, E = 0.5 * m * v0 * v0;
        const r = { E, Etot: E, pts: [], L: 0, rating: 0, peakF: 0, peakP: null, stop: 0, vEnd: 0, tEnd: 0, ok: true, warn: false, text: '', name: '' };
        const push = (t, xm, v, Fb) => r.pts.push([t, xm * 1000, Math.max(0, v), Fb]);
        if (V.dev === 'bump') {
          const dmax = (0.6 + 0.012 * Dm) / 1000, n = 1.5, cB = (n + 1) * lim[0] / Math.pow(dmax, n + 1);
          r.L = dmax * 1000; r.rating = lim[0]; r.name = 'elastic bumpers';
          const dt = Math.max(2e-8, dmax / Math.max(v0, 1e-3) / 3000);
          let x = 0, v = v0, t = 0, k = 0;
          push(0, 0, v0, 0);
          while (v > 0 && x < dmax && t < 0.5) {
            const Fb = cB * Math.pow(x, n);
            v -= Fb / m * dt; x += v * dt; t += dt;
            if (Fb > r.peakF) r.peakF = Fb;
            if (++k % 15 === 0) push(t, x, v, Fb);
          }
          r.tEnd = t; r.stop = Math.min(x, dmax) * 1000;
          if (x >= dmax && v > 0) {
            r.vEnd = v; r.ok = false;
            r.text = 'overloaded: the bumper is crushed flat and metal hits metal at ' + v.toFixed(2) + ' m/s (' + (0.5 * m * v * v).toFixed(2) + ' J left)';
            r.peakF = Math.max(r.peakF, 3 * cB * Math.pow(dmax, n));
          } else r.text = 'stops in ' + r.stop.toFixed(2) + ' mm — a hard but safe stop';
          push(t, Math.min(x, dmax), r.vEnd, r.vEnd > 0 ? r.peakF : cB * Math.pow(Math.min(x, dmax), n));
        } else if (V.dev === 'air') {
          const Lc = lim[2] / 1000, Vd = A2 * 0.003 + 0.5e-6, Cn = V.needle * 1e-8;
          r.L = lim[2]; r.rating = lim[1]; r.name = 'the air cushion';
          // the steady back pressure before the cushion (meter-out), then the trapped air: adiabatic compression by the
          // piston, outflow through the needle by ISO 6358; the drive keeps pushing with the supply on the piston side
          const p0 = PATM + Math.max(0.05e5, (ps * A1 - Ffr + Fg) / A2);
          let pB = p0, x = 0, v = v0, t = 0, k = 0, rebound = false, arrived = false, aOld = -1, xBrake = null, vBrake = null;
          const dt = 5e-6;
          r.peakP = p0; r.vCreep = Cn * 1e5 / A2;
          push(0, 0, v0, 0);
          while (t < 1.2) {
            const vol = Vd + A2 * Math.max(0, Lc - x);
            const mo = F.iso6358({ C: Cn, b: 0.3, p1: pB, p2: PATM }).mdot;
            const Fnet = ps * A1 - (pB - PATM) * A2 + Fg;
            let a;
            if (Math.abs(v) < 1e-5 && Math.abs(Fnet) <= Ffr) { a = 0; v = 0; }
            else a = (Fnet - Math.sign(v || Fnet) * Ffr) / m;
            v += a * dt; x += v * dt; t += dt;
            pB += dt * GAM / vol * (pB * A2 * v - RAIR * TREF * mo);
            if (pB < PATM) pB = PATM;
            if (pB > r.peakP) r.peakP = pB;
            if (-m * a > r.peakF) r.peakF = -m * a;
            if (xBrake === null && aOld < 0 && a >= 0 && k > 10) { xBrake = x; vBrake = v; }     // the end of the first braking
            aOld = a;
            if (v < -1e-3) rebound = true;
            if (++k % 40 === 0) push(t, clamp(x, 0, Lc), v, Math.max(0, -m * a));
            if (x >= Lc) { arrived = true; r.vEnd = Math.max(0, v); break; }
            if (x < -0.02) break;
          }
          r.tEnd = t; r.stop = clamp(x, 0, Lc) * 1000;
          r.brake = xBrake === null ? null : { x: xBrake * 1000, v: Math.max(0, vBrake) };
          push(t, clamp(x, 0, Lc), r.vEnd, 0);
          const Eres = 0.5 * m * r.vEnd * r.vEnd, pk = (r.peakP - PATM) / 1e5;
          if (arrived && (r.vEnd > 0.5 || Eres > 0.25 * lim[0])) {
            r.ok = false;
            r.text = 'hits the end cap at ' + r.vEnd.toFixed(2) + ' m/s (' + Eres.toFixed(2) + ' J left): ' + (E > lim[1] ? 'too much energy for this cushion' : 'close the needle a little');
          } else if (!arrived) {
            r.warn = true;
            r.text = 'brakes' + (rebound ? ', bounces back' : '') + ' and creeps at about ' + (1000 * r.vCreep).toFixed(0) + ' mm/s — not home after 1.2 s: open the needle';
          } else if (t > 0.35) {
            r.warn = true;
            r.text = 'arrives, but only after ' + t.toFixed(2) + ' s' + (rebound ? ' and a rebound' : '') + ': it creeps the last millimetres — open the needle a little';
          } else r.text = 'arrives gently at ' + r.vEnd.toFixed(2) + ' m/s after ' + (t * 1000).toFixed(0) + ' ms of cushioning' + (rebound ? ' (after a slight rebound)' : '');
          if (pk > 20) { r.ok = false; r.text += '; the pressure peak of ' + pk.toFixed(0) + ' bar overloads seals and end cap'; }
        } else {
          const sh = SHOCK[V.shock] || SHOCK[4], cap = sh[1], Ls = sh[2] / 1000, Fd = Math.max(0, ps * A1 + Fg);
          const Ec = E + Fd * Ls;
          r.Etot = Ec; r.L = sh[2]; r.rating = cap; r.name = 'the ' + sh[0] + ' shock absorber';
          const Fb = Ec <= cap ? Ec / Ls : cap / Ls, net = Fb - Fd;
          let t = 0, vOld = v0;
          push(0, 0, v0, net);
          for (let i = 1; i <= 120; i++) {
            const x = Ls * i / 120, v = Math.sqrt(Math.max(0, v0 * v0 - 2 * net * x / m));
            t += (Ls / 120) / Math.max(1e-4, (v + vOld) / 2); vOld = v;
            push(t, x, v, net);
          }
          r.tEnd = t; r.stop = sh[2]; r.peakF = Math.max(0, net);
          if (Ec <= cap) { r.vEnd = 0; r.text = 'stops smoothly over the absorber\'s ' + sh[2] + ' mm stroke'; }
          else { r.vEnd = Math.sqrt(2 * (Ec - cap) / m); r.ok = false; r.text = 'overloaded: bottoms out and hits the stop at ' + r.vEnd.toFixed(2) + ' m/s — take a larger absorber'; }
        }
        r.m = m; r.v0 = v0; r.lim = lim;
        return r;
      }
      function plotIt() {
        const pts = thin(res.pts, 500);
        pF.set({ series: [{ pts: pts.map(q => [q[1], q[3]]), label: 'braking force', fill: true }], x: { label: 'travel in the cushioning (mm)', min: 0, max: Math.max(res.L, 0.1) }, y: { label: 'net braking force on the load (N)', min: 0 } });
        pV.set({ series: [{ pts: pts.map(q => [q[1], q[2]]), label: 'speed' }], x: { label: 'travel in the cushioning (mm)', min: 0, max: Math.max(res.L, 0.1) }, y: { label: 'speed (m/s)', min: 0, max: Math.max(res.v0, res.vEnd) * 1.1 } });
        ro.set('E', res.E.toFixed(2) + ' J');
        ro.set('rate', res.rating.toFixed(res.rating < 1 ? 2 : 1) + ' J (' + res.name + ')');
        ro.set('use', (res.Etot > res.E ? res.Etot.toFixed(1) + ' J with the drive; ' : '') + (100 * res.Etot / Math.max(res.rating, 1e-9)).toFixed(0) + ' %');
        if (V.dev === 'air' && res.brake) ro.set('stop', 'from ' + res.v0.toFixed(2) + ' to ' + res.brake.v.toFixed(2) + ' m/s in ' + res.brake.x.toFixed(1) + ' mm; then ≈ ' + res.vCreep.toFixed(2) + ' m/s (C·p_ref/A₂ of the needle)');
        else ro.set('stop', res.stop.toFixed(res.stop < 2 ? 2 : 1) + ' mm in ' + (res.tEnd * 1000).toFixed(res.tEnd < 0.01 ? 2 : 0) + ' ms');
        ro.set('F', res.peakF > 5e3 ? (res.peakF / 1000).toFixed(1) + ' kN' : res.peakF.toFixed(0) + ' N');
        ro.set('g', (res.peakF / res.m / G0).toFixed(1) + ' g');
        ro.set('p', res.peakP ? ((res.peakP - PATM) / 1e5).toFixed(1) + ' bar gauge' : '—');
        ro.set('res', res.text);
      }
      res = compute(); plotIt();

      const loop = kit.loop((dt) => {
        play += Math.min(dt, 0.05);
        const approach = 0.7, show = 2.2, hold = 0.9, cycle = approach + show + hold;
        if (play > cycle) play = 0;
        // where the piston is, in mm from the start of the cushioning (negative while approaching)
        let u, vNow;
        if (play < approach) { u = -30 * (1 - play / approach); vNow = res.v0; }
        else {
          const te = Math.min(1, (play - approach) / show) * res.tEnd;
          let i = 0; while (i < res.pts.length - 1 && res.pts[i + 1][0] < te) i++;
          const q = res.pts[i], q2 = res.pts[Math.min(i + 1, res.pts.length - 1)], f = q2[0] > q[0] ? clamp((te - q[0]) / (q2[0] - q[0]), 0, 1) : 0;
          u = q[1] + (q2[1] - q[1]) * f; vNow = q[2] + (q2[2] - q[2]) * f;
        }
        // ---- drawing on a 760 × 400 design grid
        const c = grid(st, 760, 400), C = kit.colors(), dev = V.dev;
        // the end of the cylinder, drawn schematically: the moving mass rides on the piston, which approaches the
        // end cap on the right; the cushioning acts between them (the shock absorber drawn as if built into the cap)
        const Lmm = Math.max(res.L, 0.5), sc = clamp(360 / (Lmm + 34), 3, 30);
        const capX = 560, capW = dev === 'shock' ? 90 : 40;
        const endGap = dev === 'shock' ? 3 : 0;                              // with an absorber the piston stops short of the cap
        const pistonR = capX - endGap * sc - (Lmm - u) * sc;                  // the piston's right face
        const cyT = 50, cyB = 150, cyM = 100;
        c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(20, cyT); c.lineTo(capX, cyT); c.moveTo(20, cyB); c.lineTo(capX, cyB); c.stroke();
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(0, cyM - 9, Math.max(0, pistonR - 18), 18); c.strokeRect(-2, cyM - 9, Math.max(0, pistonR - 16), 18);   // the rod, out to the left
        if (dev === 'air' && u >= 0) {                                        // the trapped air, coloured by its pressure
          const pNow = res.peakP ? PATM + (res.peakP - PATM) * clamp(u / Lmm, 0, 1) : PATM;
          const fill = airFill(C, Math.max(0.3e5, pNow - PATM), Math.max(1, res.peakP - PATM));
          if (fill) { c.fillStyle = fill; c.fillRect(pistonR, cyT + 2, Math.max(0, capX - pistonR), cyB - cyT - 4); }
        }
        c.fillStyle = C.text; c.fillRect(pistonR - 18, cyT + 2, 18, cyB - cyT - 4);
        kit.label(c, res.m.toFixed(1) + ' kg moving', pistonR - 9, cyT - 12, { color: C.text, size: 11, align: 'center', weight: 700 });
        if (dev === 'air') { c.fillStyle = C.muted; c.fillRect(pistonR, cyM - 16, Lmm * sc, 32); }   // cushion spigot, entering the cap's seal
        if (dev === 'shock') {                                                 // absorber plunger reaching out of the cap
          const tip = u >= 0 ? pistonR : capX - (Lmm + endGap) * sc;
          c.fillStyle = C.surface; c.fillRect(tip, cyM - 5, capX - tip, 10); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(tip, cyM - 5, capX - tip, 10);
        }
        c.fillStyle = C.bg2 || C.surface; c.fillRect(capX, cyT - 12, capW, cyB - cyT + 24);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(capX, cyT - 12, capW, cyB - cyT + 24);
        if (dev === 'shock') {
          c.fillStyle = C.surface; c.fillRect(capX + 6, cyM - 16, capW - 12, 32); c.lineWidth = 1.5; c.strokeRect(capX + 6, cyM - 16, capW - 12, 32);
          kit.label(c, 'shock absorber', capX + capW / 2, cyB + 26, { color: C.muted, size: 10, align: 'center' });
        }
        if (dev === 'bump') {                                                  // elastic rings on the cap face, squeezed by the piston
          const th = Math.max(1.5, (Lmm + 1) * sc - Math.max(0, u) * sc);
          c.fillStyle = C.warn; c.fillRect(capX - th, cyT + 8, th, 24); c.fillRect(capX - th, cyB - 32, th, 24);
          kit.label(c, 'bumper', capX - 10, cyB + 26, { color: C.muted, size: 10, align: 'center' });
        }
        if (dev === 'air') {                                                   // the needle valve to atmosphere
          const nx = capX + 20;
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(nx, cyT + 8); c.lineTo(nx, cyT - 14); c.stroke();
          kit.fsym.throttle(c, nx, cyT - 30, { adjustable: true });
          kit.fsym.exhaust(c, nx, cyT - 46, { rot: 180 });
          kit.label(c, 'needle', nx + 22, cyT - 30, { color: C.muted, size: 10 });
        }
        kit.label(c, 'v = ' + fin(vNow).toFixed(2) + ' m/s', 20, 180, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'scale: ' + (10 * sc).toFixed(0) + ' px per 10 mm · event slowed ' + (res.tEnd > 0 ? (show / res.tEnd).toFixed(0) : '1') + '×', 740, 180, { color: C.muted, size: 10, align: 'right' });
        const col = res.ok ? (res.warn ? C.warn : C.ok) : C.bad;
        kit.label(c, res.text.length > 90 ? res.text.slice(0, 88) + '…' : res.text, 20, 204, { color: col, size: 11.5, weight: 700 });
        // energy bars on a log scale, 0.01 J to 300 J
        const bx = 200, bw = 500, lx = e => bx + bw * clamp(Math.log10(Math.max(e, 0.01) / 0.01) / Math.log10(30000), 0, 1);
        const sh = SHOCK[V.shock] || SHOCK[4], D2 = res.lim;
        const rows = [['Elastic bumpers', D2[0], res.E, 'bump'], ['Adjustable air cushion', D2[1], res.E, 'air'], ['Shock absorber ' + sh[0], sh[1], V.dev === 'shock' ? res.Etot : res.E + Math.max(0, V.ps * 1e5 * area(V.bore / 1000) + V.orient * res.m * G0) * sh[2] / 1000, 'shock']];
        rows.forEach((rw, i) => {
          const y = 250 + i * 44, okb = rw[2] <= rw[1];
          c.fillStyle = C.grid || 'rgba(128,128,128,.15)'; c.fillRect(bx, y - 9, bw, 18);
          c.fillStyle = okb ? C.ok : C.bad; c.globalAlpha = 0.55; c.fillRect(bx, y - 9, lx(rw[1]) - bx, 18); c.globalAlpha = 1;
          c.strokeStyle = C.text; c.lineWidth = 2.5; c.beginPath(); c.moveTo(lx(rw[2]), y - 14); c.lineTo(lx(rw[2]), y + 14); c.stroke();
          kit.label(c, rw[0], bx - 10, y, { color: V.dev === rw[3] ? C.text : C.muted, size: 11.5, weight: V.dev === rw[3] ? 700 : 500, align: 'right' });
          kit.label(c, 'rating ≈ ' + rw[1] + ' J' + (rw[3] === 'shock' ? ', needs ' + rw[2].toFixed(1) + ' J' : ''), bx + 6, y, { color: C.text, size: 10.5 });
        });
        kit.label(c, 'kinetic energy ' + res.E.toFixed(2) + ' J (black line; log scale 0.01–300 J)', bx, 238 - 8, { color: C.muted, size: 10.5 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ act-air-motor */
  const MOTORS = [
    { name: 'Small vane motor, 0.3 kW', n0: 20000, Ts: 0.6, kind: 'vane' },
    { name: 'Vane motor, 1 kW', n0: 6000, Ts: 6.4, kind: 'vane' },
    { name: 'Vane motor with 10:1 gearbox', n0: 600, Ts: 57.6, kind: 'vane' },
    { name: 'Radial piston motor, 2 kW', n0: 1500, Ts: 50, kind: 'piston' }
  ];

  Hyper.sim('act-air-motor', {
    title: 'An air motor and its load',
    blurb: `The torque of an air motor at a steady supply pressure falls in a nearly straight line from its stall torque to zero at its free speed, so its power $2\\pi n T$ is a parabola that peaks at half the free speed. The motor runs where its torque line meets the load's: a hoist drum needs the same torque at any speed, a mixer more torque the faster it turns, a fan more still (torque ∝ speed²). The air consumption and the compressor's electricity for it (6.5 kW per m³/min) give the overall efficiency.

**Try this**
- Raise the hoist load past the stall torque: the motor stalls — and just holds, without harm. Lower it again and it restarts.
- Throttle the inlet: the free speed falls but the stall torque stays, so it still starts the heavy load. Lower the pressure instead: the torque falls at every speed.
- Find the load that puts the motor at half its free speed: that is its peak power.
- Read the overall efficiency: 10–15 % at best, against about 90 % for an electric motor.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 240 });
      const [g1, g2] = graphs(box.stage);
      const ctl = kit.controls(box.side, [
        { id: 'motor', type: 'select', label: 'Motor', options: MOTORS.map((m, i) => [m.name, i]), value: 1 },
        { id: 'p', label: 'Supply pressure (gauge)', min: 2, max: 8, step: 0.1, value: 6, unit: 'bar' },
        { id: 'thr', label: 'Inlet throttle open', min: 5, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'type', type: 'select', label: 'Load', options: [['Hoist drum (constant torque)', 'const'], ['Mixer (torque ∝ speed)', 'lin'], ['Fan (torque ∝ speed²)', 'quad']], value: 'const' },
        { id: 'load', label: 'Load torque (% of stall torque at 6 bar)', min: 0, max: 150, step: 1, value: 40, unit: '%' }
      ], () => { tPlot = 1; });
      const ro = kit.readout(box.side, [['ts', 'Stall torque / free speed'], ['op', 'Running at'], ['P', 'Shaft power (peak possible)'], ['Q', 'Free-air consumption'], ['eta', 'Compressor power / overall efficiency'], ['st', 'State']]);
      const pT = kit.plot(g1, { x: { label: 'speed (rpm)' }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 160);
      const pP = kit.plot(g2, { x: { label: 'speed (rpm)' }, y: { label: 'power (kW)', min: 0 }, legend: true }, 160);
      const V = ctl.values;
      let nNow = 0, ang = 0, tPlot = 1;
      function model() {
        const M = MOTORS[V.motor] || MOTORS[1], pf = (V.p + 1.013) / 7.013;
        const Ts = M.Ts * V.p / 6, n0full = M.n0 * Math.sqrt(pf), n0 = n0full * V.thr / 100;
        const TL0 = V.load / 100 * M.Ts, nRef = M.n0 / 2;
        const TL = n => V.type === 'const' ? TL0 : V.type === 'lin' ? TL0 * n / nRef : TL0 * (n / nRef) * (n / nRef);
        const Tm = n => Math.max(0, Ts * (1 - n / Math.max(n0, 1e-6)));
        let nOp = 0;
        if (Ts - TL(0) > 0) {
          let lo = 0, hi = n0;
          for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (Tm(mid) - TL(mid) > 0) lo = mid; else hi = mid; }
          nOp = (lo + hi) / 2;
        }
        const Top = nOp > 0 ? Tm(nOp) : Math.min(Ts, TL(0));
        const Pmax0 = Math.PI * (M.n0 / 60) * M.Ts / 2 / 1000;                      // kW at 6 bar
        const Q = 1.2 * Pmax0 * pf * (0.15 + 1.7 * nOp / Math.max(n0full, 1e-6));   // m³/min ANR, typical vane-motor shape
        return { M, Ts, n0, n0full, TL, Tm, nOp, Top, P: 2 * Math.PI * nOp / 60 * Top / 1000, Pmax: Math.PI * (n0 / 60) * Ts / 2 / 1000, Q, stalled: nOp === 0 && TL(0) > 0 };
      }
      const loop = kit.loop((dt) => {
        const m = model(), M = m.M;
        nNow += (m.nOp - nNow) * Math.min(1, dt / 0.25);
        ang += 2 * Math.PI * 1.2 * (nNow / M.n0) * dt;
        const P = 2 * Math.PI * nNow / 60 * m.Tm(nNow) / 1000, comp = m.Q * 6.5;
        ro.set('ts', m.Ts.toFixed(M.Ts < 2 ? 2 : 1) + ' N·m / ' + m.n0.toFixed(0) + ' rpm');
        ro.set('op', m.nOp.toFixed(0) + ' rpm, ' + m.Top.toFixed(M.Ts < 2 ? 2 : 1) + ' N·m');
        ro.set('P', m.P.toFixed(2) + ' kW (' + m.Pmax.toFixed(2) + ' kW at ' + (m.n0 / 2).toFixed(0) + ' rpm)');
        ro.set('Q', (m.Q * 1000 / 60).toFixed(1) + ' L/s ANR (' + m.Q.toFixed(2) + ' m³/min)');
        ro.set('eta', comp.toFixed(1) + ' kW / ' + (m.P > 0 ? (100 * m.P / comp).toFixed(1) + ' %' : '0 %'));
        ro.set('st', m.stalled ? 'stalled — holding ' + m.Ts.toFixed(1) + ' N·m, no harm done' : V.load === 0 ? 'running free' : 'running');
        tPlot += dt;
        if (tPlot > 0.1) {
          tPlot = 0;
          const nMax = M.n0 * 1.15, N = 60, xs = Array.from({ length: N + 1 }, (_, i) => nMax * i / N);
          const ref = n => Math.max(0, M.Ts * (1 - n / M.n0));
          pT.set({
            series: [
              { pts: xs.map(n => [n, m.Tm(n)]), label: 'motor now' },
              { pts: xs.map(n => [n, ref(n)]), label: '6 bar, open', dash: [5, 4] },
              { pts: xs.map(n => [n, m.TL(n)]), label: 'load', dash: [2, 3] }
            ],
            marks: [{ x: m.nOp, y: m.Top, label: m.stalled ? 'stall' : 'runs here' }],
            x: { label: 'speed (rpm)', min: 0, max: nMax }, y: { label: 'torque (N·m)', min: 0, max: M.Ts * 1.6 }
          });
          pP.set({
            series: [
              { pts: xs.map(n => [n, 2 * Math.PI * n / 60 * m.Tm(n) / 1000]), label: 'motor now' },
              { pts: xs.map(n => [n, 2 * Math.PI * n / 60 * ref(n) / 1000]), label: '6 bar, open', dash: [5, 4] }
            ],
            marks: [{ x: m.nOp, y: m.P, label: 'here' }],
            vlines: [{ x: m.n0 / 2, label: 'n₀/2' }],
            x: { label: 'speed (rpm)', min: 0, max: nMax }, y: { label: 'power (kW)', min: 0, max: Math.PI * (M.n0 / 60) * M.Ts / 2 / 1000 * 1.5 }
          });
        }
        // ---- drawing on a 760 × 330 design grid
        const c = grid(st, 760, 330), C = kit.colors();
        const running = nNow > M.n0 * 0.005;
        const Ls = [[80, 268], [80, 200], [102, 200]], Lm = [[198, 200], [214, 200], [214, 150], [234, 150]], Lt = [[266, 150], [380, 150], [380, 174]];
        S.line(c, Ls, { state: 'air' }); S.line(c, Lm, { state: 'air' }); S.line(c, Lt, { state: running || m.stalled ? 'air' : 'idle' });
        S.line(c, [[380, 226], [380, 238]], { state: running ? 'exhaust' : 'idle' });
        if (running) {
          const ph = ang * 40;
          S.flow(c, Ls.concat(Lm), ph, { color: S.col('air') }); S.flow(c, Lt, ph, { color: S.col('air') });
        }
        S.source(c, 80, 288, { pneumatic: true });
        S.frl(c, 150, 200);
        kit.label(c, V.p.toFixed(1) + ' bar', 150, 236, { color: C.text, size: 11, align: 'center', weight: 700 });
        S.throttle(c, 250, 150, { adjustable: true, rot: 90 });
        kit.label(c, 'throttle ' + V.thr.toFixed(0) + ' %', 250, 124, { color: C.muted, size: 11, align: 'center' });
        const pin = m.stalled ? V.p : V.p * clamp(m.Tm(nNow) / Math.max(m.Ts, 1e-9), 0, 1);
        S.gauge(c, 330, 129, { frac: pin / 10, value: pin.toFixed(1) + ' bar' }); S.junction(c, 330, 150);
        const mo = S.motor(c, 380, 200, { pneumatic: true, r: 16 });
        S.exhaust(c, 380, 238, { silencer: true });
        kit.label(c, M.kind === 'piston' ? 'piston motor' : 'vane motor', 380, 262 + 14, { color: C.muted, size: 11, align: 'center' });
        // the shaft and the load
        const sx = mo.shaft[0], sy = mo.shaft[1], lx = 520;
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(sx, sy); c.lineTo(lx - 40, sy); c.stroke();
        c.lineWidth = 2;
        if (V.type === 'quad') {
          for (let i = 0; i < 3; i++) {
            const a = ang + i * 2 * Math.PI / 3;
            c.save(); c.translate(lx, sy); c.rotate(a);
            c.fillStyle = C.accent; c.globalAlpha = 0.6; c.beginPath(); c.ellipse(0, -30, 11, 30, 0.3, 0, 2 * Math.PI); c.fill(); c.globalAlpha = 1;
            c.restore();
          }
          c.fillStyle = C.text; c.beginPath(); c.arc(lx, sy, 7, 0, 2 * Math.PI); c.fill();
          kit.label(c, 'fan', lx, sy + 78, { color: C.muted, size: 11, align: 'center' });
        } else {
          c.strokeStyle = C.text; c.beginPath(); c.arc(lx, sy, 36, 0, 2 * Math.PI); c.stroke();
          for (let i = 0; i < 4; i++) { const a = ang + i * Math.PI / 2; c.beginPath(); c.moveTo(lx, sy); c.lineTo(lx + 36 * Math.cos(a), sy + 36 * Math.sin(a)); c.stroke(); }
          if (V.type === 'const') {
            const hang = 70;
            c.beginPath(); c.moveTo(lx + 36, sy); c.lineTo(lx + 36, sy + hang); c.stroke();
            const bw = 26 + 20 * V.load / 150;
            c.fillStyle = C.surface; c.fillRect(lx + 36 - bw / 2, sy + hang, bw, bw * 0.8); c.strokeRect(lx + 36 - bw / 2, sy + hang, bw, bw * 0.8);
            kit.label(c, 'hoist', lx - 50, sy + 60, { color: C.muted, size: 11, align: 'center' });
          } else kit.label(c, 'mixer', lx, sy + 60, { color: C.muted, size: 11, align: 'center' });
        }
        kit.label(c, nNow.toFixed(0) + ' rpm', 740, 40, { color: C.text, size: 14, weight: 700, align: 'right' });
        kit.label(c, m.Tm(nNow).toFixed(M.Ts < 2 ? 2 : 1) + ' N·m · ' + P.toFixed(2) + ' kW', 740, 62, { color: C.muted, size: 12, align: 'right' });
        if (m.stalled) kit.label(c, 'stalled — holding its torque', 740, 86, { color: C.warn, size: 12, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ act-gripper */
  const GBORES = [6, 8, 10, 12, 16, 20, 25, 32, 40, 50, 63];

  Hyper.sim('act-gripper', {
    title: 'Gripping force for a friction grip',
    blurb: `A two-jaw parallel gripper lifts a part and carries it. Held by friction, the part needs a total gripping force $F_G = S\\,m\\,(g + a)/\\mu$ when lifted vertically, or $S\\,m\\sqrt{g^2 + a^2}/\\mu$ when carried sideways. From it follow the smallest gripper piston ($F_G = i\\,\\eta\\,p_g A$, with η = 0.85) and the next standard bore. Pick a bore yourself to see a gripper that is too small: the arrows show the friction the jaws can hold against the weight and inertia the part brings.

**Try this**
- Notice how many times its own weight the gripping force is — 20 to 40 times with smooth steel jaws.
- Change the jaws to rubber pads: the force needed falls to a fifth, and so does the gripper.
- Double the acceleration of the lift: the force needed grows with g + a.
- Choose a 10 mm gripper for a 0.5 kg steel part and watch it slip.
- Lower the pressure to 4 bar: every gripper loses a third of its force.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Mass of the part', min: 0.01, max: 20, value: 0.5, unit: 'kg', log: true },
        { id: 'a', label: 'Acceleration of the handling axis', min: 0, max: 40, step: 0.5, value: 10, unit: 'm/s²' },
        { id: 'case', type: 'select', label: 'Motion', options: [['Lifting vertically', 'lift'], ['Carrying sideways', 'side']], value: 'lift' },
        { id: 'mu', type: 'select', label: 'Jaws and part', options: [['Smooth steel, oily part (μ ≈ 0.05)', 0.05], ['Smooth steel jaws (μ ≈ 0.1)', 0.1], ['Ground steel, dry (μ ≈ 0.15)', 0.15], ['Serrated jaws (μ ≈ 0.3)', 0.3], ['Rubber pads (μ ≈ 0.5)', 0.5]], value: 0.1 },
        { id: 'S', label: 'Safety factor', min: 1, max: 5, step: 0.1, value: 2 },
        { id: 'p', label: 'Supply pressure (gauge)', min: 2, max: 8, step: 0.5, value: 6, unit: 'bar' },
        { id: 'i', type: 'select', label: 'Jaw mechanism', options: [['Wedge, force ratio 1', 1], ['Lever, force ratio 1.5', 1.5], ['Toggle lever, force ratio 3', 3]], value: 1 },
        { id: 'bore', type: 'select', label: 'Gripper piston', options: [['Smallest that suffices', 0]].concat(GBORES.map(b => [b + ' mm', b])), value: 0 }
      ], () => {});
      const ro = kit.readout(box.side, [['w', 'Weight of the part'], ['need', 'Total gripping force needed'], ['jaw', 'Per jaw'], ['dmin', 'Smallest piston bore'], ['grip', 'Chosen gripper gives'], ['sf', 'Real safety factor'], ['x', 'Gripping force ÷ weight']]);
      const V = ctl.values, eta = 0.85;
      let t = 0;
      const loop = kit.loop((dt) => {
        t += Math.min(dt, 0.05);
        const C = kit.colors(), m = V.m, a = V.a, geff = V.case === 'lift' ? G0 + a : Math.hypot(G0, a);
        const need = V.S * m * geff / V.mu, pg = V.p * 1e5;
        const dmin = Math.sqrt(4 * need / (V.i * eta * pg * Math.PI)) * 1000;
        const auto = GBORES.find(b => b >= dmin - 1e-9);
        const bore = V.bore || auto || 0;
        const FG = bore ? V.i * eta * pg * area(bore / 1000) : 0;
        const sf = FG * V.mu / (m * geff), slips = sf < 1;
        ro.set('w', (m * G0).toFixed(m < 0.1 ? 2 : 1) + ' N');
        ro.set('need', need.toFixed(need < 10 ? 2 : 0) + ' N');
        ro.set('jaw', (need / 2).toFixed(need < 20 ? 2 : 0) + ' N (two jaws)');
        ro.set('dmin', dmin.toFixed(1) + ' mm' + (auto ? ' → ' + auto + ' mm' : ' → larger than 63 mm: use rubber pads, a form fit or less acceleration'));
        ro.set('grip', bore ? FG.toFixed(0) + ' N with a ' + bore + ' mm piston' : 'no standard size is enough');
        ro.set('sf', bore ? sf.toFixed(2) + (slips ? ' — the part slips!' : sf < V.S - 1e-9 ? ' — below the target' : '') : '—');
        ro.set('x', (need / (m * G0)).toFixed(0) + ' × needed' + (bore ? ', ' + (FG / (m * G0)).toFixed(0) + ' × given' : ''));
        // ---- drawing on a 760 × 380 design grid
        const c = grid(st, 760, 380);
        const cyc = 2.4, ph = (t % cyc) / cyc, lift = 0.5 - 0.5 * Math.cos(2 * Math.PI * ph);
        const side = V.case === 'side';
        const gx = side ? 250 + 200 * lift : 380, gy = side ? 90 : 150 - 70 * lift;
        const slip = slips && bore ? 16 + 10 * Math.sin(2 * Math.PI * ph) : 0;
        // floor and axis
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(40, 350); c.lineTo(720, 350); c.stroke();
        c.fillStyle = C.faint || C.muted; c.fillRect(side ? 150 : 370, 10, side ? 500 : 20, side ? 10 : 30);
        // gripper body and jaws
        const pw = 70, ph2 = 64, jw = 18, jh = 86;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.8;
        c.fillRect(gx - 80, gy - 60, 160, 44); c.strokeRect(gx - 80, gy - 60, 160, 44);
        kit.label(c, bore ? 'Ø' + bore + ' gripper' : 'gripper', gx, gy - 38, { color: C.text, size: 11, align: 'center', weight: 700 });
        c.beginPath(); c.moveTo(gx, gy - 60); c.lineTo(gx, 20); c.stroke();
        for (const sgn of [-1, 1]) {
          const jx = gx + sgn * (pw / 2 + jw / 2);
          c.fillStyle = C.bg2 || C.surface; c.fillRect(jx - jw / 2, gy - 16, jw, jh); c.strokeRect(jx - jw / 2, gy - 16, jw, jh);
          if (V.mu >= 0.5) { c.fillStyle = C.warn; c.fillRect(sgn < 0 ? jx + jw / 2 - 4 : jx - jw / 2, gy + 6, 4, ph2 - 4); }
        }
        // the part
        const py = gy + 4 + slip;
        c.fillStyle = slips && bore ? C.bad : C.accent; c.globalAlpha = 0.35; c.fillRect(gx - pw / 2, py, pw, ph2); c.globalAlpha = 1;
        c.strokeStyle = C.text; c.strokeRect(gx - pw / 2, py, pw, ph2);
        kit.label(c, m.toFixed(m < 0.1 ? 3 : 2) + ' kg', gx, py + ph2 / 2, { color: C.text, size: 11, align: 'center', weight: 700 });
        // forces: load (weight and inertia) down, friction up at the jaws, normal forces inwards
        const load = m * geff, hold = bore ? V.mu * FG : 0, ref = Math.max(load, hold, 1e-9), Lr = 90;
        kit.arrow(c, gx, py + ph2, gx, py + ph2 + Lr * load / ref, C.bad, 2.5);
        kit.label(c, (side ? 'm√(g²+a²) ' : 'm(g+a) ') + load.toFixed(1) + ' N', gx + 8, py + ph2 + Lr * load / ref + 10, { color: C.bad, size: 11 });
        if (bore) {
          for (const sgn of [-1, 1]) {
            const fx = gx + sgn * (pw / 2 + 4);
            kit.arrow(c, fx, py + ph2 - 6, fx, py + ph2 - 6 - Lr * hold / 2 / ref, slips ? C.warn : C.ok, 2.5);
            const nx = gx + sgn * (pw / 2 + jw + 46);
            kit.arrow(c, nx, py + 20, gx + sgn * (pw / 2 + jw + 4), py + 20, C.accent, 2.5);
          }
          kit.label(c, 'friction μF_G = ' + hold.toFixed(1) + ' N', gx + pw / 2 + jw + 12, py + ph2 - 16, { color: slips ? C.warn : C.ok, size: 11 });
          kit.label(c, 'F_G/2 = ' + (FG / 2).toFixed(0) + ' N per jaw', gx - pw / 2 - jw - 50, py + 4, { color: C.accent, size: 11, align: 'right' });
        }
        kit.label(c, slips && bore ? 'the part slips out of the jaws' : bore ? 'holds, safety factor ' + sf.toFixed(1) : 'no gripper is large enough', 740, 30, { color: slips || !bore ? C.bad : C.ok, size: 13, weight: 700, align: 'right' });
        kit.label(c, 'peak acceleration ' + a.toFixed(1) + ' m/s² ' + (side ? 'sideways' : 'upwards'), 740, 50, { color: C.muted, size: 11, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ act-muscle */
  const MUSCLE_K = 1.45;          // end-effect factor: real muscles stop at about 25 % contraction

  Hyper.sim('act-muscle', {
    title: 'A fluidic muscle lifting a load',
    blurb: `A fluidic muscle — a rubber tube in a braided sleeve — hangs from a beam and carries a load. Pressurised, it swells and shortens; the braid angle steepens as it does. Its pull follows the braid model $F = p\\,A\\,[3(1 - k\\varepsilon)^2/\\tan^2\\theta_0 - 1/\\sin^2\\theta_0]$: with $k = 1$ the ideal thin braid (dashed), with $k = 1.45$ allowing for the wall and end fittings, which is why real muscles stop at about a quarter of their length. The muscle contracts until its pull equals the weight. The flat line is what a cylinder of the same bore pushes.

**Try this**
- Raise the pressure slowly: the load rises smoothly — no stick-slip — and holds at any height you set.
- Compare the pull at zero contraction with the cylinder of the same bore: several times more.
- Add load: the muscle contracts less, because its pull falls as it shortens.
- Change the braid angle: flatter braids pull harder at the start but give less stroke.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const [g1] = graphs(box.stage, 1);
      const ctl = kit.controls(box.side, [
        { id: 'p', label: 'Pressure (gauge)', min: 0, max: 8, step: 0.1, value: 4, unit: 'bar' },
        { id: 'd', type: 'select', label: 'Muscle bore', options: [['10 mm', 10], ['20 mm', 20], ['40 mm', 40]], value: 20 },
        { id: 'L0', label: 'Length at rest', min: 100, max: 1000, step: 10, value: 400, unit: 'mm' },
        { id: 'th', label: 'Braid angle at rest', min: 15, max: 40, step: 0.5, value: 25, unit: '°' },
        { id: 'mass', label: 'Load', min: 0, max: 300, step: 1, value: 40, unit: 'kg' },
        { id: 'ideal', type: 'check', label: 'Show the ideal braid (k = 1)', value: true }
      ], () => { tPlot = 1; });
      const ro = kit.readout(box.side, [['f0', 'Pull at zero contraction'], ['cyl', 'Cylinder of the same bore'], ['emax', 'Largest contraction'], ['eq', 'Contraction under the load'], ['stroke', 'Lift of the load'], ['d', 'Diameter at rest → now']]);
      const pl = kit.plot(g1, { x: { label: 'contraction (%)' }, y: { label: 'force (N)', min: 0 }, legend: true }, 170);
      const V = ctl.values;
      let eps = 0, tPlot = 1;
      const loop = kit.loop((dt) => {
        const C = kit.colors(), th0 = V.th * Math.PI / 180, A0 = area(V.d / 1000), pg = V.p * 1e5;
        const ac = 3 / Math.pow(Math.tan(th0), 2), bc = 1 / Math.pow(Math.sin(th0), 2);
        const force = (e, k) => pg * A0 * (ac * Math.pow(1 - k * e, 2) - bc);
        const emax = (1 - Math.sqrt(bc / ac)) / MUSCLE_K, emaxIdeal = 1 - Math.sqrt(bc / ac);
        const W = V.mass * G0;
        let eq = 0;
        if (pg > 0) { const r = (W / (pg * A0) + bc) / ac; eq = r < 1 ? Math.max(0, (1 - Math.sqrt(r)) / MUSCLE_K) : 0; }
        eps += (eq - eps) * Math.min(1, dt / 0.3);
        const lifted = pg > 0 && force(0, MUSCLE_K) > W;
        ro.set('f0', force(0, 1).toFixed(0) + ' N (' + (force(0, 1) / Math.max(pg * A0, 1e-9)).toFixed(1) + ' × p·A)');
        ro.set('cyl', (pg * A0).toFixed(0) + ' N');
        ro.set('emax', (100 * emax).toFixed(1) + ' % (ideal braid ' + (100 * emaxIdeal).toFixed(1) + ' %)');
        ro.set('eq', lifted ? (100 * eq).toFixed(1) + ' %' : pg > 0 ? 'none: the load is heavier than the pull' : 'no pressure');
        ro.set('stroke', (eq * V.L0).toFixed(1) + ' mm');
        const cth = clamp((1 - eps) * Math.cos(th0), 0, 1), thNow = Math.acos(cth);
        const dNow = V.d * Math.sin(thNow) / Math.sin(th0);
        ro.set('d', V.d + ' → ' + dNow.toFixed(1) + ' mm');
        tPlot += dt;
        if (tPlot > 0.1) {
          tPlot = 0;
          const N = 60, xs = Array.from({ length: N + 1 }, (_, i) => 0.45 * i / N);
          const ser = [{ pts: xs.map(e => [100 * e, Math.max(0, force(e, MUSCLE_K))]), label: 'muscle (k = 1.45)' }];
          if (V.ideal) ser.push({ pts: xs.map(e => [100 * e, Math.max(0, force(e, 1))]), label: 'ideal braid', dash: [5, 4] });
          ser.push({ pts: [[0, pg * A0], [45, pg * A0]], label: 'cylinder, same bore', dash: [2, 3] });
          ser.push({ pts: [[0, W], [45, W]], label: 'load m·g', dash: [7, 3] });
          pl.set({ series: ser, marks: lifted ? [{ x: 100 * eq, y: W, label: 'holds here' }] : [], vlines: [{ x: 100 * emax, label: 'end of stroke' }],
            x: { label: 'contraction (%)', min: 0, max: 45 }, y: { label: 'force (N)', min: 0, max: Math.max(force(0, 1), W, pg * A0, 10) * 1.1 } });
        }
        // ---- drawing on a 760 × 380 design grid
        const c = grid(st, 760, 380);
        const top = 34, Lpx = 250 * (1 - eps), cx = 300, rpx = (6 + V.d * 0.55) * Math.sin(thNow) / Math.sin(th0);
        c.fillStyle = C.muted; c.fillRect(150, top - 14, 300, 14);
        c.fillStyle = C.text; c.fillRect(cx - rpx - 4, top, 2 * rpx + 8, 12); c.fillRect(cx - rpx - 4, top + 12 + Lpx, 2 * rpx + 8, 12);
        // the tube with its braid, clipped to its outline
        const y0 = top + 12, y1 = y0 + Lpx;
        c.save();
        c.beginPath(); c.moveTo(cx - rpx * 0.6, y0); c.quadraticCurveTo(cx - rpx * 1.15, (y0 + y1) / 2, cx - rpx * 0.6, y1); c.lineTo(cx + rpx * 0.6, y1); c.quadraticCurveTo(cx + rpx * 1.15, (y0 + y1) / 2, cx + rpx * 0.6, y0); c.closePath();
        c.fillStyle = kit.hue(30, 0.25); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        c.clip();
        c.strokeStyle = C.muted; c.lineWidth = 1;
        const pitch = 2 * rpx / Math.max(0.05, Math.tan(thNow)), stepY = Math.max(6, pitch / 3);
        for (let yy = y0 - pitch; yy < y1 + pitch; yy += stepY) {
          c.beginPath(); c.moveTo(cx - rpx * 1.2, yy); c.lineTo(cx + rpx * 1.2, yy + pitch * 1.2); c.stroke();
          c.beginPath(); c.moveTo(cx + rpx * 1.2, yy); c.lineTo(cx - rpx * 1.2, yy + pitch * 1.2); c.stroke();
        }
        c.restore();
        // the load
        const ly = y1 + 12, lw = 40 + 30 * Math.min(1, V.mass / 150);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, ly + 12); c.lineTo(cx, ly + 24); c.stroke();
        if (V.mass > 0) {
          c.fillStyle = C.surface; c.fillRect(cx - lw / 2, ly + 24, lw, 36); c.strokeRect(cx - lw / 2, ly + 24, lw, 36);
          kit.label(c, V.mass.toFixed(0) + ' kg', cx, ly + 42, { color: C.text, size: 11, align: 'center', weight: 700 });
        }
        c.strokeStyle = C.muted; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(cx + 60, top + 12 + 250 + 12); c.lineTo(cx + 120, top + 12 + 250 + 12); c.stroke(); c.setLineDash([]);
        kit.label(c, 'rest length', cx + 124, top + 12 + 250 + 12, { color: C.muted, size: 10 });
        if (eps > 0.002) {
          kit.arrow(c, cx + 90, top + 274, cx + 90, top + 274 - 250 * eps, C.ok, 2);
          kit.label(c, 'lift ' + (eps * V.L0).toFixed(0) + ' mm', cx + 96, top + 274 - 125 * eps, { color: C.ok, size: 11 });
        }
        kit.label(c, V.p.toFixed(1) + ' bar', cx - rpx - 14, (y0 + y1) / 2, { color: C.text, size: 12, align: 'right', weight: 700 });
        kit.label(c, 'braid ' + (thNow * 180 / Math.PI).toFixed(1) + '° to the axis', 740, 40, { color: C.muted, size: 12, align: 'right' });
        kit.label(c, 'pull ' + Math.max(0, force(eps, MUSCLE_K)).toFixed(0) + ' N', 740, 62, { color: C.text, size: 13, weight: 700, align: 'right' });
        kit.label(c, 'a cylinder of ' + V.d + ' mm: ' + (pg * A0).toFixed(0) + ' N', 740, 84, { color: C.muted, size: 12, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
