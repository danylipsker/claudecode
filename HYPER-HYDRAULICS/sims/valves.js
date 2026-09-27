/* HYPER-HYDRAULICS · sims/valves.js — simulations for the Hydraulic Valves branch (content/valves.js)
 *   valve-43-explorer     a spring-centred 4/3 valve with five centre conditions (closed, tandem, float, open,
 *                         regenerative) lifting a load on a vertical cylinder; quasi-steady: the pump flow splits
 *                         between the valve paths and the relief valve so that the pressures balance
 *   valve-spool-cutaway   a 4/3 spool valve in section (grooves T B P A T, lands, overlap) beside its ISO 1219
 *                         symbol, with the opening area of every metering edge against the spool position
 *   valve-relief-direct   a direct-acting poppet relief valve in section: spring preload, lift, override and the
 *                         p–Q characteristic with its operating point
 *   valve-relief-compare  a pilot-operated (two-stage) relief valve against a direct-acting one of the same
 *                         setting; venting the spring chamber to unload the pump
 *   valve-reducing-clamp  a clamp fed through a pressure-reducing valve while a press on the same pump climbs to
 *                         full pressure; with or without a check valve to hold the clamp
 *   valve-counterbalance  lowering a load on a cylinder with nothing, a plain check, a pilot-operated check or a
 *                         counterbalance valve in the cap-end line; a dynamic model (oil compressibility,
 *                         cavitation, valve lags) because the runaway and the chatter are the point
 * Mineral hydraulic oil throughout: ρ = 870 kg/m³.
 */
(function () {
  'use strict';

  const G0 = 9.80665, RHO = 870, CP = 1880;            // oil density (kg/m³) and specific heat (J/(kg·K))
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const fin = (x, d) => (Number.isFinite(x) ? x : (d || 0));
  const bar = (p, dec) => (fin(p) / 1e5).toFixed(dec == null ? 0 : dec) + ' bar';
  const lpm = (q, dec) => (fin(q) * 60000).toFixed(dec == null ? 1 : dec) + ' L/min';
  const SIN45 = Math.SQRT1_2;
  // draw on a fixed design grid, scaled and centred on the stage (call c.restore() when done)
  function grid(st, W, H) {
    const c = st.begin(), k = Math.min(st.W / W, st.H / H) || 1;
    c.save(); c.translate((st.W - W * k) / 2, (st.H - H * k) / 2); c.scale(k, k);
    return c;
  }
  function fillA(c, color, alpha, x, y, w, h) { c.save(); c.globalAlpha = alpha; c.fillStyle = color; c.fillRect(x, y, w, h); c.restore(); }
  // translucent red for a chamber under pressure, as in the reference circuit
  const fillP = (C, p) => (p > 5e5 ? (C.dark ? 'rgba(255,92,92,' : 'rgba(214,40,40,') + Math.min(0.45, 0.1 + p / 400e5).toFixed(3) + ')' : null);
  // a turbulent orifice Q = K·√Δp with the sign of Δp, smoothed below dpt so that the dynamic model stays stable
  const orf = (K, dp, dpt) => K * dp / Math.sqrt(Math.abs(dp) + (dpt || 1e5));
  function graphDiv(box) {
    const d = document.createElement('div');
    d.style.padding = '4px 10px 10px';
    box.stage.appendChild(d);
    return d;
  }
  // the load on a vertical cylinder: a block on the rod tip with its mass and weight
  function loadBlock(c, kit, C, tip, m) {
    c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
    c.fillRect(tip[0] - 40, tip[1] - 40, 80, 40); c.strokeRect(tip[0] - 40, tip[1] - 40, 80, 40);
    kit.label(c, m.toFixed(0) + ' kg', tip[0], tip[1] - 20, { color: C.text, size: 12, weight: 700 });
    if (m > 0) kit.arrow(c, tip[0] + 54, tip[1] - 34, tip[0] + 54, tip[1] - 34 + Math.min(40, 10 + m / 100), C.warn, 2.5);
  }

  /* ================================================================ 4/3 valve explorer */
  Hyper.sim('valve-43-explorer', {
    title: 'A 4/3 valve and its centre conditions',
    blurb: `A spring-centred 4/3 solenoid valve drives a 63/36 mm cylinder that lifts a load. Choose the valve's **centre condition**, then raise, stop and lower the load, or let it cycle. The working box slides to the ports; lines are coloured by what they carry — **red** pressure, **blue** return to tank, **yellow** oil trapped under the load, **green** oil being sucked — and the read-outs say what the pump and the cylinder are doing in each position.

**Try this**
- *Closed centre*: stop in mid-stroke. The trapped oil holds the load (it creeps less than a millimetre a minute through the spool's clearance), and the whole pump flow crosses the relief valve — watch the heat.
- *Tandem centre*: the same hold, but the pump now unloads to tank at about 5 bar: the heat falls from about 6 kW to under 200 W.
- *Float centre*: A and B are joined to the tank, so the load sinks as soon as the valve centres. That suits a blade that must follow the ground, never a raised load.
- *Open centre*: the pump unloads *and* the load sinks.
- *Regenerative centre*: with T blocked and P, A and B joined, the centre position pushes the rod **out**, the rod-end oil joining the pump flow — fast, but only the rod's area pushes, and the doubled flow through the spool costs a lot of pressure. Above about 1600 kg (at 160 bar) it cannot lift, and the load sinks back over the relief valve.
- Raise the mass above about 500 kg and lower it: the load falls faster than the pump can fill the rod end, which cavitates. Controlling that is the job of a counterbalance valve.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      let cmd = 1, auto = true, phase = 0, tPhase = 0, dwell = 0;
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'up', label: 'Raise (Y1)' }, { id: 'mid', label: 'Centre' }, { id: 'down', label: 'Lower (Y2)' }] },
        { id: 'auto', type: 'check', label: 'Cycle automatically', value: true },
        { id: 'centre', type: 'select', label: 'Centre condition', options: [['Closed: all ports blocked', 'closed'], ['Tandem: P→T, A and B blocked', 'tandem'], ['Float: P blocked, A and B to T', 'float'], ['Open: all four ports joined', 'open'], ['Regenerative: P, A, B joined, T blocked', 'regen']], value: 'closed' },
        { id: 'm', label: 'Load mass', min: 0, max: 3000, step: 50, value: 400, unit: 'kg' },
        { id: 'relief', label: 'Relief-valve setting', min: 40, max: 250, step: 5, value: 160, unit: 'bar' },
        { id: 'Q', label: 'Pump flow', min: 0, max: 40, step: 1, value: 22, unit: 'L/min' }
      ], (id, v) => {
        if (id === 'up' || id === 'mid' || id === 'down') { cmd = id === 'up' ? 1 : id === 'down' ? -1 : 0; auto = false; ctl.set('auto', false); }
        if (id === 'auto') { auto = v; phase = 0; tPhase = 0; dwell = 0; }
      });
      const ro = kit.readout(box.side, [['box', 'Valve'], ['pump', 'Pump'], ['cyl', 'Cylinder'], ['pab', 'Cap end / rod end'], ['heat', 'Heat into the oil']]);
      const V = ctl.values;
      // the machine: 63/36 cylinder, 500 mm stroke; each valve path drops 6 bar at 22 L/min; the relief valve cracks
      // 10 bar below its setting and passes 22 L/min at the setting
      const D = 0.063, d = 0.036, A1 = Math.PI * D * D / 4, A2 = A1 - Math.PI * d * d / 4, Ar = A1 - A2, L = 0.5, fr = 600;
      const Qn = 22 / 60000, kv = 6e5 / (Qn * Qn), PV = -0.9e5, Gr = Qn / 10e5, cL = 3.3e-14;
      const dps = q => kv * q * Math.abs(q);
      const sg = v => (v > 1e-9 ? 1 : v < -1e-9 ? -1 : 0);
      const s = { x: 0.05, vs: 1, ph: {} };
      let o = null;
      const CENTRE = { closed: '4/3 closed', tandem: '4/3 tandem', float: '4/3 float', open: '4/3 open' };
      const REGEN = { top: [['A', 0.3], ['B', 0.7]], bottom: [['P', 0.3], ['T', 0.7]], boxes: [S.SPEC['4/3 closed'].boxes[0], ['P+A+B', 'T|'], S.SPEC['4/3 closed'].boxes[2]], normal: 1 };
      const NAMES = { closed: 'closed — all ports blocked', tandem: 'tandem — P to T, A and B blocked', float: 'float — P blocked, A and B to T', open: 'open — all ports joined', regen: 'regenerative — P, A, B joined, T blocked' };

      // the flow Q from the pump line into the valve (negative: pushed back by the load) that balances the pump, the
      // relief valve and what the actuator needs; need(Q) is the pump-line pressure the actuator path requires
      function pumpSolve(need, Qp, pc) {
        const Qr = p => (p > pc ? (p - pc) * Gr : 0);
        let lo = -0.01, hi = Math.max(Qp, 0);
        for (let k = 0; k < 64; k++) { const m = (lo + hi) / 2; if (m + Qr(need(m)) > Qp) hi = m; else lo = m; }
        const Q = lo, qr = Math.max(0, Qp - Q);
        return { Q, p: qr > 1e-8 ? pc + qr / Gr : need(Q), Qr: qr };
      }
      function model(box, W, Qp, pc) {
        const out = { v: 0, pA: 0, pB: 0, pp: 0, Qv: 0, Qr: 0, QT: 0, over: false, drift: false, unload: false, sinkBack: false };
        const top = s.x >= L - 1e-6, bottom = s.x <= 1e-6;
        const dead = () => (Qp > 0 ? pc + Qp / Gr : 0);
        if (box === 0) {                                            // P→A, B→T: raise
          const need = Q => { const v = Q / A1, pB = Math.max(PV, dps(A2 * v)); return (W + fr * sg(v) + pB * A2) / A1 + dps(Q); };
          let r = pumpSolve(need, Qp, pc), v = r.Q / A1;
          if ((top && v > 0) || (bottom && v < 0)) { v = 0; r = { Q: 0, p: dead(), Qr: Qp }; }
          out.v = v; out.Qv = r.Q; out.pp = r.p; out.Qr = r.Qr;
          out.pA = v === 0 ? r.p : r.p - dps(r.Q); out.pB = v === 0 ? 0 : Math.max(PV, dps(A2 * v)); out.QT = A2 * v;
          out.sinkBack = v < -1e-5;
        } else if (box === 2) {                                     // P→B, A→T: lower
          const pAf = (W - fr + PV * A2) / A1;                      // cap end if the load falls with the rod end cavitating
          const vFree = pAf > 0 ? -Math.sqrt(pAf / kv) / A1 : 0;
          if (!bottom && -vFree * A2 > Qp) {
            out.v = vFree; out.over = true; out.pA = pAf; out.pB = PV; out.Qv = Qp; out.pp = PV + dps(Qp); out.QT = -vFree * A1;
          } else {
            const need = Q => { const v = -Q / A2, pA = Math.max(PV, dps(A1 * Q / A2)); return Math.max(PV, (pA * A1 - W - fr * sg(v)) / A2) + dps(Q); };
            let r = pumpSolve(need, Qp, pc), v = -r.Q / A2;
            if ((bottom && v < 0) || (top && v > 0)) { v = 0; r = { Q: 0, p: dead(), Qr: Qp }; }
            out.v = v; out.Qv = r.Q; out.pp = r.p; out.Qr = r.Qr;
            out.pA = v === 0 ? (bottom ? 0 : W / A1) : Math.max(PV, dps(-A1 * v)); out.pB = v === 0 ? r.p : r.p - dps(r.Q); out.QT = -A1 * v;
          }
        } else {
          const cen = V.centre;
          if (cen === 'closed' || cen === 'tandem') {               // A and B blocked: the trapped oil holds the load
            const pH = bottom ? 0 : W / A1;
            out.pA = pH; out.v = bottom ? 0 : -cL * pH / A1; out.drift = !bottom && pH > 0;
            if (cen === 'closed') { out.pp = dead(); out.Qr = Qp; } else { out.pp = 0.8 * dps(Qp); out.QT = Qp; out.unload = true; }
          } else if (cen === 'float' || cen === 'open') {           // A, B (and P) joined to T at a node
            const Qin = cen === 'open' ? Qp : 0;
            const pres = v => { const pn = Math.max(PV, dps(Qin - Ar * v)); return { pn, pA: Math.max(PV, pn - dps(A1 * v)), pB: Math.max(PV, pn + dps(A2 * v)) }; };
            const res = (v, sgn) => { const q = pres(v); return q.pA * A1 - q.pB * A2 - W - fr * sgn; };
            const r0 = res(0, 0);
            let v = 0;
            if (r0 > fr && !top) { let lo = 0, hi = 5; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (res(m, 1) > 0) lo = m; else hi = m; } v = (lo + hi) / 2; }
            else if (r0 < -fr && !bottom) { let lo = -5, hi = 0; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (res(m, -1) > 0) lo = m; else hi = m; } v = (lo + hi) / 2; }
            const q = pres(v);
            out.v = v; out.pA = q.pA; out.pB = q.pB; out.QT = Qin - Ar * v;
            if (cen === 'open') { out.pp = q.pn + dps(Qp); out.unload = true; } else { out.pp = dead(); out.Qr = Qp; }
          } else {                                                  // regenerative: P, A, B joined, T blocked
            const need = Q => { const v = Q / Ar; return (W + fr * sg(v) + dps(A1 * v) * A1 + dps(A2 * v) * A2) / Ar + dps(Q); };
            let r = pumpSolve(need, Qp, pc), v = r.Q / Ar;
            if ((top && v > 0) || (bottom && v < 0)) { v = 0; r = { Q: 0, p: dead(), Qr: Qp }; }
            const pn = r.p - dps(r.Q);
            out.v = v; out.Qv = r.Q; out.pp = r.p; out.Qr = r.Qr;
            out.pA = v === 0 ? r.p : Math.max(PV, pn - dps(A1 * v)); out.pB = v === 0 ? r.p : Math.max(PV, pn + dps(A2 * v));
            out.sinkBack = v < -1e-5;
          }
        }
        out.heat = Math.max(0, out.pp * Qp - W * out.v);
        return out;
      }
      function step(dt) {
        const Qp = V.Q / 60000, pc = V.relief * 1e5 - 10e5, W = V.m * G0;
        if (auto) {
          tPhase += dt;
          const atTop = s.x >= L - 1e-6, atBottom = s.x <= 0.02 * L;
          if (phase === 0) { cmd = 1; if (atTop) dwell += dt; if (dwell > 0.5 || tPhase > 10) { phase = 1; tPhase = 0; dwell = 0; } }
          else if (phase === 1) { cmd = 0; if (tPhase > 2.5) { phase = 2; tPhase = 0; } }
          else if (phase === 2) { cmd = -1; if (atBottom) dwell += dt; if (dwell > 0.3 || tPhase > 10) { phase = 3; tPhase = 0; dwell = 0; } }
          else { cmd = 0; if (tPhase > 1.5) { phase = 0; tPhase = 0; } }
        }
        const target = cmd === 1 ? 0 : cmd === -1 ? 2 : 1;
        s.vs += clamp(target - s.vs, -dt / 0.08, dt / 0.08);
        const bx = Math.round(s.vs);
        o = model(bx, W, Qp, pc);
        o.box = bx; o.Qp = Qp;
        s.x = clamp(s.x + o.v * dt, 0, L);
      }
      const loop = kit.loop((dt) => {
        for (let k = 0; k < 4; k++) step(dt / 4);
        const C = kit.colors(), W = V.m * G0;
        // ---- read-outs
        const cen = V.centre;
        ro.set('box', o.box === 0 ? 'raise: P→A, B→T' : o.box === 2 ? 'lower: P→B, A→T' : 'centre: ' + NAMES[cen]);
        let pumpTxt;
        if (o.Qp <= 0) pumpTxt = 'stopped';
        else if (o.unload) pumpTxt = bar(o.pp, 1) + ' — unloading to tank';
        else if (o.Qr > 1e-7 && Math.abs(o.Qv) < 1e-7) pumpTxt = bar(o.pp) + ' — all ' + lpm(o.Qp) + ' over the relief valve';
        else if (o.Qr > 1e-7) pumpTxt = bar(o.pp) + ' — ' + lpm(Math.max(0, o.Qv)) + ' to the valve, ' + lpm(o.Qr) + ' over the relief';
        else pumpTxt = bar(o.pp) + ' — all its flow to the cylinder';
        ro.set('pump', pumpTxt);
        const mms = Math.abs(o.v) * 1000;
        let cylTxt, warn = false;
        if (o.over) { cylTxt = 'falling ' + mms.toFixed(0) + ' mm/s — faster than the pump fills the rod end, which cavitates'; warn = true; }
        else if (o.drift && mms * 60 < 30) cylTxt = 'held by trapped oil — creeps ' + (mms * 60).toFixed(1) + ' mm/min through the spool clearance';
        else if (o.v > 1e-5) cylTxt = 'rising ' + mms.toFixed(0) + ' mm/s' + (o.box === 1 && cen === 'regen' ? ' (regenerative: rod area only)' : o.box === 1 ? ' (pushed by the unloading pressure)' : '');
        else if (o.v < -1e-5) { cylTxt = 'sinking ' + mms.toFixed(0) + ' mm/s' + (o.sinkBack ? ' — too heavy: the load pushes oil back over the relief valve' : o.box === 1 ? ' — the load floats down' : ''); warn = o.sinkBack || o.box === 1; }
        else if (s.x >= L - 1e-6) cylTxt = 'at the top of its stroke';
        else if (s.x <= 1e-6) cylTxt = 'at the bottom of its stroke';
        else cylTxt = o.box === 0 ? 'stalled: the load needs more than the relief setting' : 'at rest';
        ro.set('cyl', cylTxt);
        ro.set('pab', bar(o.pA, 1) + ' / ' + bar(o.pB, 1));
        ro.set('heat', o.heat >= 1000 ? (o.heat / 1000).toFixed(2) + ' kW' : o.heat.toFixed(0) + ' W');
        // ---- drawing, on a 760 × 460 design grid
        const c = grid(st, 760, 460);
        const moving = Math.abs(o.v) > 1e-5, run = o.Qp > 0;
        const qA = A1 * o.v, qB = A2 * o.v;                         // into A, out of B
        let stA = 'idle', stB = 'idle';
        if (o.box === 0) { stA = run || o.pA > 2e5 ? 'pressure' : 'idle'; stB = moving ? 'return' : 'idle'; }
        else if (o.box === 2) { stA = moving ? 'return' : o.pA > 2e5 ? 'metered' : 'idle'; stB = o.over ? 'suction' : run ? 'pressure' : 'idle'; }
        else if (cen === 'closed' || cen === 'tandem') { stA = o.pA > 2e5 ? 'metered' : 'idle'; }
        else if (cen === 'regen') { stA = stB = run || o.pA > 2e5 ? 'pressure' : 'idle'; }
        else { stA = stB = moving ? 'return' : 'idle'; }
        const paths = {
          pump: [[395, 344], [395, 306], [462.8, 306], [462.8, 258]],
          relief: [[445, 306], [445, 312]],
          A: [[462.8, 202], [462.8, 170], [330, 170], [330, 402], [202, 402]],
          B: [[202, 268], [300, 268], [300, 150], [477.2, 150], [477.2, 202]],
          T: [[477.2, 258], [477.2, 404]]
        };
        S.line(c, paths.pump, { state: !run ? 'idle' : o.unload ? 'return' : 'pressure' });
        S.line(c, paths.relief, { state: run && !o.unload ? 'pressure' : 'idle' });
        S.line(c, paths.A, { state: stA });
        S.line(c, paths.B, { state: stB });
        S.line(c, paths.T, { state: o.QT > 1e-7 || o.QT < -1e-7 ? 'return' : 'idle' });
        S.junction(c, 445, 306); S.junction(c, 420, 306);
        const adv = (key, q) => { s.ph[key] = (s.ph[key] || 0) + dt * 90 * q / Qn; return s.ph[key]; };
        if (run) S.flow(c, paths.pump.slice(0, 2), adv('pu', o.Qp), { color: S.col(o.unload ? 'return' : 'pressure') });
        if (Math.abs(o.Qv) > 1e-7 || o.unload) S.flow(c, paths.pump.slice(1), adv('pv', o.unload ? o.Qp : o.Qv), { color: S.col(o.unload ? 'return' : 'pressure') });
        if (o.Qr > 1e-7) S.flow(c, [[445, 306], [445, 372]], adv('re', o.Qr), { color: S.col('pressure') });
        if (Math.abs(qA) > 1e-7) S.flow(c, paths.A, adv('a', qA), { color: S.col(stA === 'metered' ? 'metered' : stA) });
        if (Math.abs(qB) > 1e-7) S.flow(c, paths.B, adv('b', qB), { color: S.col(stB) });
        if (Math.abs(o.QT) > 1e-7) S.flow(c, paths.T, adv('t', o.QT), { color: S.col('return') });
        // symbols
        S.pump(c, 395, 370, { motor: true });
        S.tank(c, 395, 406); S.tank(c, 445, 380); S.tank(c, 477.2, 414);
        S.pressureValve(c, 445, 341, { kind: 'relief', rot: 180, open: clamp(o.Qr / Math.max(o.Qp, 1e-9), 0, 1) });
        S.gauge(c, 420, 285, { frac: o.pp / 250e5 });
        kit.label(c, bar(o.pp), 404, 285, { color: C.text, size: 11, align: 'right' });
        const spec = cen === 'regen' ? REGEN : CENTRE[cen];
        const v4 = S.valve(c, 470, 230, { spec, state: s.vs, left: 'spring+solenoid', right: 'spring+solenoid', s: 36, labels: true });
        kit.label(c, 'Y1', v4.xl - 8, 230, { color: cmd === 1 ? C.bad : C.muted, size: 12, weight: 700, align: 'right' });
        kit.label(c, 'Y2', v4.xr + 8, 230, { color: cmd === -1 ? C.bad : C.muted, size: 12, weight: 700, align: 'left' });
        const cy = S.cylinder(c, 170, 410, { rot: 270, len: 150, h: 44, pos: s.x / L, fillA: fillP(C, o.pA), fillB: fillP(C, o.pB) });
        loadBlock(c, kit, C, cy.tip, V.m);
        kit.label(c, 'p_A ' + bar(o.pA), 210, 418, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'p_B ' + bar(o.pB), 210, 256, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'A', 336, 190, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'B', 306, 190, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, lpm(o.Qp) + ' pump', 395, 440, { color: C.muted, size: 11 });
        kit.label(c, V.relief.toFixed(0) + ' bar', 470, 346, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'Centre: ' + NAMES[cen], 740, 22, { color: C.text, size: 12, weight: 700, align: 'right' });
        kit.label(c, cylTxt.split(' — ')[0], 740, 444, { color: warn ? C.bad : C.muted, size: 12, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      step(0.01);
      loop.start();
    }
  });

  /* ================================================================ a spool valve in section */
  Hyper.sim('valve-spool-cutaway', {
    title: 'Inside a spool valve',
    blurb: `A 4/3 spool valve cut open, beside its ISO 1219 symbol. The body has five annular grooves — tank, B, pressure, A, tank — and the spool carries two metering **lands** that cover the A and B grooves in the centre. Pushed right by solenoid *a*, the spool opens P→A and B→T (the symbol's left box); pushed left by *b*, P→B and A→T. Each land is a little wider than its groove: that **overlap** seals the centre but gives a dead band before any flow starts. The graph below shows the opening area of every metering edge against the spool position.

**Try this**
- Move the spool slowly from the centre: nothing opens until the travel passes the overlap. Set the overlap to zero and the dead band disappears — but a real spool then leaks across the lands in the centre.
- Choose the *float* spool: the lands are narrowed on the tank side, so in the centre A and B are already open to T while P stays blocked.
- Choose the *open* spool: every edge is underlapped, so all four ports meet in the centre and the pump unloads.
- Raise the pressure drop per edge: the flow through the same opening grows with its square root (four times the drop, twice the flow).`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 250 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'spool position (mm), + to the right', min: -2, max: 2 }, y: { label: 'opening area (mm²)', min: 0 }, legend: true }, 170);
      let auto = true, tt = 0, tPlot = 1;
      const ctl = kit.controls(box.side, [
        { id: 'pos', label: 'Spool position (+ = pushed by a)', min: -100, max: 100, step: 1, value: 0, unit: '%' },
        { id: 'auto', type: 'check', label: 'Sweep the spool automatically', value: true },
        { id: 'spool', type: 'select', label: 'Spool', options: [['Closed centre (lands overlapped)', 'closed'], ['Float centre (A and B to T in the centre)', 'float'], ['Open centre (lands underlapped)', 'open']], value: 'closed' },
        { id: 'ov', label: 'Overlap of the lands', min: 0, max: 1.2, step: 0.05, value: 0.6, unit: 'mm' },
        { id: 'dp', label: 'Pressure drop per metering edge', min: 2, max: 30, step: 1, value: 10, unit: 'bar' }
      ], (id, v) => {
        if (id === 'pos') { auto = false; ctl.set('auto', false); }
        if (id === 'auto') auto = v;
        tPlot = 1;
      });
      const ro = kit.readout(box.side, [['pos', 'Spool position'], ['paths', 'Open paths'], ['open', 'Largest opening'], ['q', 'Flow through it'], ['dead', 'Dead band']]);
      const V = ctl.values;
      const SMAX = 2, DS = 10, UNDER = -0.3, CD = 0.61;       // stroke ±2 mm, spool Ø10 mm, underlap 0.3 mm
      const ph = {};
      const area = o => (o > 0 ? Math.PI * DS * o : 0);          // mm², a full-circumference groove edge
      const flow = (o, dp) => CD * area(o) * 1e-6 * Math.sqrt(2 * dp / RHO);
      const laps = () => ({ P: V.spool === 'open' ? UNDER : V.ov, T: V.spool === 'closed' ? V.ov : UNDER });
      const edges = (sm, lp) => ({ PA: sm - lp.P, BT: sm - lp.T, PB: -sm - lp.P, AT: -sm - lp.T });
      const loop = kit.loop((dt) => {
        tt += dt;
        const sm = auto ? SMAX * Math.sin(tt * 2 * Math.PI / 8) : V.pos / 100 * SMAX;
        if (auto) ctl.set('pos', Math.round(sm / SMAX * 100));
        const lp = laps(), e = edges(sm, lp), dp = V.dp * 1e5, C = kit.colors();
        const open = {}; for (const k in e) open[k] = e[k] > 0;
        // ---- read-outs
        ro.set('pos', (sm >= 0 ? '+' : '−') + Math.abs(sm).toFixed(2) + ' mm (' + (sm / SMAX * 100).toFixed(0) + ' % of the stroke)');
        const list = ['PA', 'PB', 'AT', 'BT'].filter(k => open[k]).map(k => k[0] + '→' + k[1]);
        ro.set('paths', list.length ? list.join(', ') + (open.PA && open.PB ? ' — P meets T: the pump unloads' : '') : 'none: every port blocked');
        let best = 'PA'; for (const k of ['PB', 'AT', 'BT']) if (e[k] > e[best]) best = k;
        ro.set('open', e[best] > 0 ? best[0] + '→' + best[1] + ': ' + e[best].toFixed(2) + ' mm × π·10 mm = ' + area(e[best]).toFixed(1) + ' mm²' : 'closed');
        ro.set('q', e[best] > 0 ? lpm(flow(e[best], dp), 0) + ' at ' + V.dp.toFixed(0) + ' bar' : '0 L/min');
        ro.set('dead', lp.P > 0 ? '±' + lp.P.toFixed(2) + ' mm of ±2 mm: ' + (lp.P / SMAX * 100).toFixed(0) + ' % of the stroke gives no flow' : 'none: P is open to both sides in the centre');
        tPlot += dt;
        if (tPlot > 0.12) {
          tPlot = 0;
          const pts = { PA: [], BT: [], PB: [], AT: [] };
          for (let k = 0; k <= 80; k++) { const x = -SMAX + k * SMAX / 40, ee = edges(x, lp); for (const q in pts) pts[q].push([x, area(ee[q])]); }
          plot.set({
            series: [
              { pts: pts.PA, label: 'P→A', color: S.col('pressure') }, { pts: pts.BT, label: 'B→T', color: S.col('return') },
              { pts: pts.PB, label: 'P→B', color: S.col('pressure'), dash: [6, 4] }, { pts: pts.AT, label: 'A→T', color: S.col('return'), dash: [6, 4] }
            ],
            vlines: [{ x: sm, label: 'spool' }]
          });
        }
        // ---- drawing on a 760 × 330 grid: the valve in section
        const c = grid(st, 760, 330);
        const yc = 170, rb = 24, gd = 16, gw = 28, px = sm * 10;   // 10 px per mm of spool travel
        const G = [{ n: 'T', x: 138, st: 'return' }, { n: 'B', x: 194 }, { n: 'P', x: 250, st: 'pressure' }, { n: 'A', x: 306 }, { n: 'T', x: 362, st: 'return' }];
        const grooveState = (toP, toT) => (toP && toT ? 'metered' : toP ? 'pressure' : toT ? 'return' : 'idle');
        G[1].st = grooveState(open.PB, open.BT); G[3].st = grooveState(open.PA, open.AT);
        const landB = [194 - gw / 2 - lp.T * 10 + px, 194 + gw / 2 + lp.P * 10 + px];
        const landA = [306 - gw / 2 - lp.P * 10 + px, 306 + gw / 2 + lp.T * 10 + px];
        const endL = [100 + px, 120 + px], endR = [380 + px, 400 + px];
        // body
        c.fillStyle = C.surface; c.fillRect(60, 80, 380, 180);
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.strokeRect(60, 80, 380, 180);
        // oil in the bore, the grooves and the passages
        const OIL = 0.42;
        const bore = (x1, x2, state) => { if (x2 > x1) fillA(c, S.col(state), OIL, x1, yc - rb, x2 - x1, 2 * rb); };
        bore(62, endL[0], 'return'); bore(endL[1], landB[0], 'return'); bore(landB[1], landA[0], 'pressure'); bore(landA[1], endR[0], 'return'); bore(endR[1], 438, 'return');
        for (const g of G) {
          fillA(c, S.col(g.st), OIL + 0.1, g.x - gw / 2, yc - rb - gd, gw, 2 * (rb + gd));
          if (g.n === 'A' || g.n === 'B') fillA(c, S.col(g.st), OIL + 0.1, g.x - 6, 80, 12, yc - rb - gd - 80);
          else fillA(c, S.col(g.st), OIL + 0.1, g.x - 6, yc + rb + gd, 12, 260 - yc - rb - gd);
          c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(g.x - gw / 2, yc - rb - gd, gw, 2 * (rb + gd));
          kit.label(c, g.n, g.x, g.n === 'A' || g.n === 'B' ? 68 : 272, { color: C.text, size: 13, weight: 700 });
        }
        c.strokeStyle = C.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(62, yc - rb); c.lineTo(438, yc - rb); c.moveTo(62, yc + rb); c.lineTo(438, yc + rb); c.stroke();
        // flow dots in the passages
        const qP = (open.PA ? flow(e.PA, dp) : 0) + (open.PB ? flow(e.PB, dp) : 0);
        const qA = (open.PA ? flow(e.PA, dp) : 0) - (open.AT ? flow(e.AT, dp) : 0);
        const qB = (open.PB ? flow(e.PB, dp) : 0) - (open.BT ? flow(e.BT, dp) : 0);
        const qT1 = open.BT ? flow(e.BT, dp) : 0, qT2 = open.AT ? flow(e.AT, dp) : 0;
        const adv = (k, q) => { ph[k] = (ph[k] || 0) + dt * q * 60000 * 1.2; return ph[k]; };
        if (qP > 0) S.flow(c, [[250, 258], [250, yc + rb + 4]], adv('P', qP), { color: S.col('pressure') });
        if (Math.abs(qA) > 0) S.flow(c, [[306, yc - rb - 4], [306, 82]], adv('A', qA), { color: S.col(qA > 0 ? 'pressure' : 'return') });
        if (Math.abs(qB) > 0) S.flow(c, [[194, yc - rb - 4], [194, 82]], adv('B', qB), { color: S.col(qB > 0 ? 'pressure' : 'return') });
        if (qT1 > 0) S.flow(c, [[138, yc + rb + 4], [138, 258]], adv('T1', qT1), { color: S.col('return') });
        if (qT2 > 0) S.flow(c, [[362, yc + rb + 4], [362, 258]], adv('T2', qT2), { color: S.col('return') });
        // the spool: a neck with lands, drawn as solid steel
        c.fillStyle = C.muted; c.strokeStyle = C.text; c.lineWidth = 1.4;
        c.fillRect(endL[0], yc - 8, endR[1] - endL[0], 16); c.strokeRect(endL[0], yc - 8, endR[1] - endL[0], 16);
        for (const l of [endL, landB, landA, endR]) { c.fillRect(l[0], yc - rb + 1, l[1] - l[0], 2 * rb - 2); c.strokeRect(l[0], yc - rb + 1, l[1] - l[0], 2 * rb - 2); }
        // metering jets at the open edges (top and bottom of the annulus)
        const jet = (x, up, state) => { for (const sgn of [-1, 1]) { const y0 = yc + sgn * (rb - 6), y1 = yc + sgn * (rb + 10); kit.arrow(c, x, up ? y0 : y1, x, up ? y1 : y0, S.col(state), 2); } };
        if (open.PA) jet((306 - gw / 2 + landA[0]) / 2, true, 'pressure');
        if (open.AT) jet((306 + gw / 2 + landA[1]) / 2, false, 'return');
        if (open.PB) jet((194 + gw / 2 + landB[1]) / 2, true, 'pressure');
        if (open.BT) jet((194 - gw / 2 + landB[0]) / 2, false, 'return');
        // centring springs and solenoids
        S.zigzag(c, 62, yc, endL[0], yc, 9, 4, C.text);
        S.zigzag(c, endR[1], yc, 438, yc, 9, 4, C.text);
        const solA = sm > 0.05, solB = sm < -0.05;
        for (const [x, on, nm] of [[22, solA, 'a'], [442, solB, 'b']]) {
          if (on) fillA(c, C.warn, 0.35, x, 146, 36, 48);
          c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(x, 146, 36, 48);
          c.beginPath(); c.moveTo(x, 194); c.lineTo(x + 36, 146); c.stroke();
          kit.label(c, nm, x + 18, 136, { color: on ? C.bad : C.muted, size: 12, weight: 700 });
        }
        // the ISO symbol, its boxes following the spool
        const spec = V.spool === 'closed' ? '4/3 closed' : V.spool === 'float' ? '4/3 float' : '4/3 open';
        const sv = S.valve(c, 630, 150, { spec, state: clamp(1 - sm / SMAX, 0, 2), left: 'spring+solenoid', right: 'spring+solenoid', s: 34, labels: true });
        kit.label(c, 'a', sv.xl - 6, 150, { color: solA ? C.bad : C.muted, size: 12, weight: 700, align: 'right' });
        kit.label(c, 'b', sv.xr + 6, 150, { color: solB ? C.bad : C.muted, size: 12, weight: 700, align: 'left' });
        kit.label(c, 'ISO 1219 symbol', 630, 70, { color: C.muted, size: 11 });
        kit.label(c, sm > 0.05 ? 'left box moving in: P→A, B→T' : sm < -0.05 ? 'right box moving in: P→B, A→T' : 'centre box at the ports', 630, 230, { color: C.text, size: 12, weight: 700 });
        kit.label(c, list.length ? 'open: ' + list.join(', ') : 'all ports blocked', 630, 252, { color: C.muted, size: 12 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ direct-acting relief valve */
  // a poppet with a 45° cone on a sharp seat: pressure force p·A against the spring F0 + k·x; flow through the
  // conical gap Q = Cd·π·d·x·sin45°·√(2p/ρ)
  function directRelief(Q, pc, d, k) {
    const A = Math.PI * d * d / 4, Cq = 0.61 * Math.PI * d * SIN45;
    if (Q <= 1e-9) return { p: pc, x: 0 };
    let lo = 0, hi = 0.02;
    for (let it = 0; it < 60; it++) { const x = (lo + hi) / 2, p = pc + k * x / A; if (Cq * x * Math.sqrt(2 * p / RHO) > Q) hi = x; else lo = x; }
    const x = (lo + hi) / 2;
    return { p: pc + k * x / A, x };
  }
  Hyper.sim('valve-relief-direct', {
    title: 'A direct-acting relief valve',
    blurb: `A poppet relief valve in section. The inlet pressure pushes on the poppet's seat area; the spring, preloaded by the adjusting screw, pushes back. When $p\\,A$ exceeds the preload the poppet **cracks** open and oil jets through the conical gap to the tank port. To pass more flow the gap must open wider, which compresses the spring further — so the pressure rises with flow: the **override**. The graph is the valve's p–Q characteristic, with the operating point for the flow arriving now.

**Try this**
- Let the flow ramp and watch the pressure climb above the cracking pressure: that rise is the override.
- Halve the spring rate: the characteristic flattens, but a softer spring needs a much longer preload for the same setting (see the read-out) — why big direct-acting valves are impractical.
- Enlarge the seat: the preload force for the same pressure grows with the area, and the override falls.
- Watch the oil temperature rise across the valve: throttled from 200 bar to the tank, oil warms by about 12 K on every pass.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 250 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'flow through the valve (L/min)', min: 0, max: 120 }, y: { label: 'inlet pressure (bar)' }, legend: false }, 170);
      let auto = true, tt = 0, tPlot = 1;
      const ph = {};
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Flow arriving at the valve', min: 0, max: 120, step: 1, value: 60, unit: 'L/min' },
        { id: 'auto', type: 'check', label: 'Ramp the flow up and down', value: true },
        { id: 'pset', label: 'Cracking pressure (spring preload)', min: 20, max: 350, step: 5, value: 200, unit: 'bar' },
        { id: 'k', label: 'Spring rate', min: 20, max: 200, step: 5, value: 60, unit: 'N/mm' },
        { id: 'd', label: 'Seat diameter', min: 3, max: 10, step: 0.5, value: 6, unit: 'mm' }
      ], (id) => { if (id === 'Q') { auto = false; ctl.set('auto', false); } if (id === 'auto') auto = ctl.values.auto; tPlot = 1; });
      const ro = kit.readout(box.side, [['pc', 'Cracking pressure / preload'], ['p', 'Inlet pressure now'], ['ov', 'Override'], ['x', 'Poppet lift'], ['F', 'Spring force'], ['heat', 'Heat p·Q'], ['dT', 'Oil warms by']]);
      const V = ctl.values;
      const loop = kit.loop((dt) => {
        tt += dt;
        let Qlpm = V.Q;
        if (auto) { Qlpm = 120 * (0.5 - 0.5 * Math.cos(tt * 2 * Math.PI / 9)); ctl.set('Q', Math.round(Qlpm)); }
        const d = V.d / 1000, A = Math.PI * d * d / 4, k = V.k * 1000, pc = V.pset * 1e5, Q = Qlpm / 60000;
        const r = directRelief(Q, pc, d, k), F0 = pc * A, pre = F0 / k * 1000;
        ro.set('pc', V.pset.toFixed(0) + ' bar / ' + F0.toFixed(0) + ' N, spring compressed ' + pre.toFixed(1) + ' mm' + (pre > 25 ? ' (impractically long)' : ''));
        ro.set('p', bar(r.p, 1) + ' at ' + Qlpm.toFixed(0) + ' L/min');
        ro.set('ov', bar(r.p - pc, 1) + ' (' + ((r.p - pc) / pc * 100).toFixed(1) + ' %)');
        ro.set('x', (r.x * 1000).toFixed(3) + ' mm');
        ro.set('F', (F0 + k * r.x).toFixed(0) + ' N');
        ro.set('heat', (r.p * Q / 1000).toFixed(2) + ' kW');
        ro.set('dT', (Q > 0 ? r.p / (RHO * CP) : 0).toFixed(1) + ' K per pass');
        tPlot += dt;
        if (tPlot > 0.1) {
          tPlot = 0;
          const pts = []; for (let i = 0; i <= 60; i++) { const q = i * 2; pts.push([q, directRelief(q / 60000, pc, d, k).p / 1e5]); }
          plot.set({ series: [{ pts, label: 'p–Q characteristic', color: S.col('pressure') }], marks: [{ x: Qlpm, y: r.p / 1e5, label: 'now' }], hlines: [{ y: V.pset, label: 'cracking' }] });
        }
        // ---- drawing on a 760 × 340 grid
        const C = kit.colors(), c = grid(st, 760, 340), cx = 190;
        const lift = Math.min(40, r.x * 1000 * 25), opn = r.x > 0;
        c.fillStyle = C.surface; c.fillRect(90, 50, 210, 270); c.strokeStyle = C.text; c.lineWidth = 1.8; c.strokeRect(90, 50, 210, 270);
        fillA(c, S.col('pressure'), 0.45, cx - 15, 250, 30, 70);                          // inlet
        fillA(c, S.col('return'), 0.28, cx - 38, 80, 76, 170);                            // spring chamber, drained to T
        fillA(c, S.col('return'), 0.28, cx + 38, 205, 300 - cx - 38, 30);                  // outlet
        c.strokeStyle = C.text; c.lineWidth = 1.4;
        c.strokeRect(cx - 38, 80, 76, 170); c.strokeRect(cx - 15, 250, 30, 70);
        kit.label(c, 'P', cx, 332, { color: C.text, size: 13, weight: 700 });
        kit.label(c, 'T', 312, 220, { color: C.text, size: 13, weight: 700 });
        // oil jets through the gap
        if (opn) {
          const sp = dt * Q * 60000 * 2.2;
          ph.j = (ph.j || 0) + sp;
          S.flow(c, [[cx + 5, 318], [cx + 5, 262 - lift], [cx + 30, 246 - lift * 0.3], [cx + 32, 222], [300, 220]], ph.j, { color: S.col('pressure'), gap: 12 });
          S.flow(c, [[cx - 5, 318], [cx - 5, 262 - lift], [cx - 30, 246 - lift * 0.3], [cx - 32, 226]], ph.j, { color: S.col('pressure'), gap: 12 });
        }
        // poppet: a cone on the seat, a guide and a spring plate
        c.fillStyle = C.muted; c.strokeStyle = C.text; c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(cx - 20, 245 - lift); c.lineTo(cx + 20, 245 - lift); c.lineTo(cx, 265 - lift); c.closePath(); c.fill(); c.stroke();
        c.fillRect(cx - 20, 215 - lift, 40, 30); c.strokeRect(cx - 20, 215 - lift, 40, 30);
        c.fillRect(cx - 30, 209 - lift, 60, 6); c.strokeRect(cx - 30, 209 - lift, 60, 6);
        // spring and adjusting screw
        const yS = 79 + Math.min(3 * pre, 60);
        S.zigzag(c, cx, yS, cx, 209 - lift, 22, 6, C.text);
        c.fillStyle = C.muted; c.fillRect(cx - 8, 34, 16, yS - 34); c.strokeRect(cx - 8, 34, 16, yS - 34);
        c.fillRect(cx - 24, 22, 48, 12); c.strokeRect(cx - 24, 22, 48, 12);
        c.fillRect(cx - 16, 42, 32, 8); c.strokeRect(cx - 16, 42, 32, 8);
        kit.label(c, 'adjusting screw', cx + 32, 28, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'spring', cx + 46, 140, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'poppet', cx + 46, 232 - lift, { color: C.muted, size: 11, align: 'left' });
        kit.arrow(c, cx - 58, 306, cx - 58, 268, C.bad, 2.5);
        kit.label(c, 'p·A', cx - 64, 288, { color: C.bad, size: 12, weight: 700, align: 'right' });
        kit.label(c, 'lift ×25', 104, 64, { color: C.muted, size: 10, align: 'left' });
        // symbol and gauge on the right
        S.line(c, [[400, 150], [470, 150], [470, 171]], { state: 'pressure' });
        S.line(c, [[470, 229], [470, 229]], { state: opn ? 'return' : 'idle' });
        S.junction(c, 440, 150);
        S.gauge(c, 440, 129, { frac: r.p / 400e5 });
        kit.label(c, bar(r.p), 456, 122, { color: C.text, size: 11, align: 'left' });
        S.pressureValve(c, 470, 200, { kind: 'relief', rot: 180, open: clamp(r.x / 0.001, 0, 1) });
        S.tank(c, 470, 239);
        kit.label(c, 'from the pump', 398, 162, { color: C.muted, size: 11, align: 'left' });
        const tx = 560;
        kit.label(c, 'cracking ' + V.pset.toFixed(0) + ' bar', tx, 150, { color: C.muted, size: 12, align: 'left' });
        kit.label(c, 'now ' + bar(r.p) + ' at ' + Qlpm.toFixed(0) + ' L/min', tx, 172, { color: C.text, size: 13, weight: 700, align: 'left' });
        kit.label(c, 'override ' + bar(r.p - pc, 1), tx, 194, { color: C.warn, size: 12, weight: 700, align: 'left' });
        kit.label(c, opn ? 'open: all this flow becomes heat' : 'closed', tx, 216, { color: opn ? C.bad : C.muted, size: 12, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pilot-operated against direct-acting */
  // two-stage valve: main poppet Ø16 mm with a Ø0.8 mm orifice and a light spring (≈3 bar); pilot poppet Ø2.5 mm
  const PO = { Am: Math.PI * 0.016 * 0.016 / 4, Cm: 0.61 * Math.PI * 0.016 * SIN45, Fm0: 60, km: 10e3,
    Ap: Math.PI * 0.0025 * 0.0025 / 4, Cp: 0.61 * Math.PI * 0.0025 * SIN45, kp: 30e3,
    Ao: Math.PI * 0.0008 * 0.0008 / 4, Av: Math.PI * 0.0015 * 0.0015 / 4 };
  const dpOrf = (q, A) => RHO / 2 * Math.pow(q / (0.7 * A), 2);
  function pilotStage(pcham, pS) { if (pcham <= pS) return { q: 0, x: 0 }; const x = (pcham - pS) * PO.Ap / PO.kp; return { q: PO.Cp * x * Math.sqrt(2 * pcham / RHO), x }; }
  function mainFlow(p, pc) { const xm = Math.max(0, ((p - pc) * PO.Am - PO.Fm0) / PO.km); return { xm, Qm: PO.Cm * xm * Math.sqrt(2 * Math.max(p, 0) / RHO) }; }
  function pilotRelief(Q, pS, vent) {
    if (Q <= 1e-9) return { p: vent ? 0 : pS, pc: vent ? 0 : pS, q: 0, xm: 0, xp: 0 };
    const at = (u) => {                    // vented: u is the orifice flow; otherwise u is the spring-chamber pressure
      let pc, q, xp = 0;
      if (vent) { q = u; pc = dpOrf(q, PO.Av); } else { const r = pilotStage(u, pS); pc = u; q = r.q; xp = r.x; }
      const p = pc + dpOrf(q, PO.Ao), m = mainFlow(p, pc);
      return { p, pc, q, xm: m.xm, xp, tot: q + m.Qm };
    };
    let lo = vent ? 0 : pS, hi = vent ? 2e-3 : pS + 80e5;
    for (let it = 0; it < 70; it++) { const m = (lo + hi) / 2; if (at(m).tot > Q) hi = m; else lo = m; }
    return at((lo + hi) / 2);
  }
  const DA = { d: 0.010, k: 400e3 };      // a direct-acting valve for the same flow: Ø10 mm seat, 400 N/mm spring
  Hyper.sim('valve-relief-compare', {
    title: 'Pilot-operated and direct-acting relief valves',
    blurb: `A two-stage (pilot-operated) relief valve in section, compared with a direct-acting valve of the same setting and size. In the two-stage valve the large **main poppet** is held shut by a light spring and by the oil in the spring chamber above it, which reaches it through a tiny **orifice**. A small **pilot poppet** limits that chamber's pressure. Once the pilot opens, oil flows through the orifice, the pressure under the main poppet exceeds the pressure above it by the few bar of the light spring, and the main poppet opens as wide as the flow needs — with almost no rise in pressure. Venting the spring chamber (port X) to tank lets the main poppet open at about 5 bar: the pump **unloads**.

**Try this**
- Sweep the flow: the direct-acting valve's pressure climbs by tens of bar, the pilot-operated valve's by a few bar. That flat characteristic is why large systems use pilot-operated valves.
- Tick *vent X to tank*: the main poppet opens against its light spring alone and the pump circulates at about 5 bar — the heat drops forty-fold.
- Watch the pilot flow: well under 1 L/min passes the orifice and pilot poppet; everything else goes through the main stage.
- Lower the setting: the pilot spring's preload changes; the main stage is unchanged.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 250 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'flow through the valve (L/min)', min: 0, max: 250 }, y: { label: 'inlet pressure (bar)', min: 0 }, legend: true }, 180);
      let auto = true, tt = 0, tPlot = 1;
      const ph = {};
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Flow through the valve', min: 0, max: 250, step: 5, value: 120, unit: 'L/min' },
        { id: 'auto', type: 'check', label: 'Sweep the flow', value: true },
        { id: 'pset', label: 'Setting (pilot spring)', min: 50, max: 350, step: 5, value: 200, unit: 'bar' },
        { id: 'vent', type: 'check', label: 'Vent X to tank (unload)', value: false }
      ], (id) => { if (id === 'Q') { auto = false; ctl.set('auto', false); } if (id === 'auto') auto = ctl.values.auto; tPlot = 1; });
      const ro = kit.readout(box.side, [['po', 'Pilot-operated: pressure'], ['da', 'Direct-acting: pressure'], ['pc', 'Spring-chamber pressure'], ['qp', 'Pilot flow'], ['xm', 'Main poppet lift'], ['heat', 'Heat (pilot-operated)']]);
      const V = ctl.values;
      const loop = kit.loop((dt) => {
        tt += dt;
        let Qlpm = V.Q;
        if (auto) { Qlpm = 250 * (0.5 - 0.5 * Math.cos(tt * 2 * Math.PI / 10)); ctl.set('Q', Math.round(Qlpm)); }
        const Q = Qlpm / 60000, pS = V.pset * 1e5;
        const r = pilotRelief(Q, pS, V.vent), dA = directRelief(Q, pS, DA.d, DA.k);
        ro.set('po', bar(r.p, 1) + (V.vent ? ' (vented: unloading)' : ' — override ' + bar(r.p - pS, 1)));
        ro.set('da', bar(dA.p, 1) + ' — override ' + bar(dA.p - pS, 1) + ' (' + ((dA.p - pS) / pS * 100).toFixed(0) + ' %)');
        ro.set('pc', bar(r.pc, 1) + ' — difference across the main poppet ' + bar(r.p - r.pc, 1));
        ro.set('qp', lpm(r.q, 2));
        ro.set('xm', (r.xm * 1000).toFixed(2) + ' mm');
        ro.set('heat', (r.p * Q / 1000).toFixed(2) + ' kW (direct-acting ' + (dA.p * Q / 1000).toFixed(2) + ' kW)');
        tPlot += dt;
        if (tPlot > 0.15) {
          tPlot = 0;
          const a = [], b = [], v = [];
          for (let i = 1; i <= 50; i++) { const q = i * 5 / 60000; a.push([i * 5, directRelief(q, pS, DA.d, DA.k).p / 1e5]); b.push([i * 5, pilotRelief(q, pS, false).p / 1e5]); v.push([i * 5, pilotRelief(q, pS, true).p / 1e5]); }
          plot.set({
            series: [{ pts: a, label: 'direct-acting', color: S.col('pilot') }, { pts: b, label: 'pilot-operated', color: S.col('pressure') }, { pts: v, label: 'pilot-operated, vented', color: S.col('return'), dash: [6, 4] }],
            marks: [{ x: Qlpm, y: dA.p / 1e5, label: '' }, { x: Qlpm, y: r.p / 1e5, label: 'now' }],
            hlines: [{ y: V.pset, label: 'setting' }]
          });
        }
        // ---- drawing on a 760 × 330 grid
        const C = kit.colors(), c = grid(st, 760, 330);
        const Lm = Math.min(24, r.xm * 1000 * 16), Lp = r.xp > 0 ? Math.min(10, 3 + r.xp * 1e5) : 0, cx = 160;
        c.fillStyle = C.surface; c.fillRect(60, 60, 360, 250); c.strokeStyle = C.text; c.lineWidth = 1.8; c.strokeRect(60, 60, 360, 250);
        const pil = S.col('pilot');
        fillA(c, S.col('pressure'), 0.45, cx - 18, 236, 36, 74);                                   // inlet P
        fillA(c, S.col('return'), 0.3, 116, 216, 88, 20); fillA(c, S.col('return'), 0.3, 204, 216, 216, 20);   // cavity and T
        fillA(c, pil, 0.35, 128, 76, 64, 170 - Lm - 76);                                           // spring chamber
        fillA(c, pil, 0.35, 192, 84, 70, 12);                                                     // pilot passage
        fillA(c, S.col('return'), 0.3, 262, 72, 134, 36); fillA(c, S.col('return'), 0.3, 300, 108, 12, 108);   // pilot cavity, drain
        fillA(c, pil, 0.35, 222, 60, 10, 24);                                                     // X port
        c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.strokeRect(128, 76, 64, 160); c.strokeRect(cx - 18, 236, 36, 74); c.strokeRect(116, 216, 88, 20); c.strokeRect(262, 72, 134, 36);
        kit.label(c, 'P', cx, 322, { color: C.text, size: 13, weight: 700 });
        kit.label(c, 'T', 432, 226, { color: C.text, size: 13, weight: 700 });
        kit.label(c, 'X', 244, 48, { color: C.text, size: 13, weight: 700 });
        // flow: main jets, and the pilot flow through the orifice and pilot seat
        if (r.xm > 0) { ph.m = (ph.m || 0) + dt * Qlpm * 0.6; S.flow(c, [[cx + 6, 308], [cx + 6, 250 - Lm], [cx + 34, 228], [420, 226]], ph.m, { color: S.col('pressure'), gap: 12 }); S.flow(c, [[cx - 6, 308], [cx - 6, 250 - Lm], [cx - 34, 228]], ph.m, { color: S.col('pressure'), gap: 12 }); }
        if (r.q > 1e-9) {
          ph.p = (ph.p || 0) + dt * 40;
          const pts = V.vent ? [[cx, 250 - Lm], [cx, 90], [227, 90], [227, 62]] : [[cx, 250 - Lm], [cx, 90], [264, 90], [306, 110], [306, 214]];
          S.flow(c, pts, ph.p, { color: pil, gap: 10, r: 2 });
        }
        // main poppet with its orifice, and the light main spring
        c.fillStyle = C.muted; c.strokeStyle = C.text; c.lineWidth = 1.4;
        c.fillRect(130, 170 - Lm, 60, 56); c.strokeRect(130, 170 - Lm, 60, 56);
        c.beginPath(); c.moveTo(132, 226 - Lm); c.lineTo(188, 226 - Lm); c.lineTo(cx, 254 - Lm); c.closePath(); c.fill(); c.stroke();
        c.strokeStyle = pil; c.lineWidth = 2; c.beginPath(); c.moveTo(cx, 250 - Lm); c.lineTo(cx, 170 - Lm); c.stroke();
        S.zigzag(c, cx, 78, cx, 170 - Lm, 14, 4, C.text);
        kit.label(c, 'main poppet', 124, 196 - Lm, { color: C.muted, size: 10, align: 'right' });
        kit.label(c, 'orifice', cx + 6, 160 - Lm, { color: pil, size: 10, align: 'left' });
        // pilot poppet, spring and screw
        const ys = 90, xs = 392 - 6 * Math.min(6, pS * PO.Ap / PO.kp * 1000);
        c.fillStyle = C.muted; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(258 + Lp, ys); c.lineTo(270 + Lp, ys - 10); c.lineTo(270 + Lp, ys + 10); c.closePath(); c.fill(); c.stroke();
        c.fillRect(270 + Lp, ys - 4, 20, 8); c.fillRect(290 + Lp, ys - 13, 4, 26); c.strokeRect(290 + Lp, ys - 13, 4, 26);
        S.zigzag(c, 294 + Lp, ys, xs, ys, 10, 5, C.text);
        c.fillRect(xs, ys - 5, 436 - xs, 10); c.strokeRect(xs, ys - 5, 436 - xs, 10); c.fillRect(420, ys - 11, 16, 22); c.strokeRect(420, ys - 11, 16, 22);
        kit.label(c, 'pilot poppet', 280, 120, { color: C.muted, size: 10, align: 'left' });
        // X: vented to a tank, or plugged
        if (V.vent) { S.line(c, [[227, 60], [227, 34], [190, 34]], { state: 'return' }); S.tank(c, 190, 44); kit.label(c, 'vented', 262, 30, { color: C.bad, size: 11, weight: 700 }); }
        else S.plug(c, 227, 56);
        // two bars: the pressure each valve needs at this flow
        const bx = [520, 640], ps = [dA.p, r.p], nm = ['direct-acting', 'pilot-operated'], y0 = 290, sc = 210 / 400e5;
        for (let i = 0; i < 2; i++) {
          fillA(c, S.col(i ? 'pressure' : 'pilot'), 0.55, bx[i] - 26, y0 - ps[i] * sc, 52, ps[i] * sc);
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(bx[i] - 26, y0 - ps[i] * sc, 52, ps[i] * sc);
          kit.label(c, bar(ps[i]), bx[i], y0 - ps[i] * sc - 12, { color: C.text, size: 12, weight: 700 });
          kit.label(c, nm[i], bx[i], y0 + 14, { color: C.muted, size: 11 });
        }
        c.strokeStyle = C.muted; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(478, y0 - pS * sc); c.lineTo(700, y0 - pS * sc); c.stroke(); c.setLineDash([]);
        kit.label(c, 'setting', 704, y0 - pS * sc, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'at ' + Qlpm.toFixed(0) + ' L/min', 580, 40, { color: C.text, size: 12, weight: 700 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ reducing valve holding a clamp */
  Hyper.sim('valve-reducing-clamp', {
    title: 'A reducing valve holds the clamp',
    blurb: `One pump feeds a press (80 mm bore) and a clamp (50 mm bore, spring return) that holds the part while it is pressed. The press needs full pressure; the part would be crushed if the clamp got it too. So the clamp is fed through a **pressure-reducing valve**: normally open, it senses its *outlet* and throttles to hold that pressure at its setting however high the main pressure climbs. Its spring chamber is drained to tank through its own line (dashed). The cycle runs by itself: clamp, press down, press, press up, unclamp.

**Try this**
- Watch the two gauges during pressing: the main pressure climbs to over 100 bar; the clamp stays at the setting.
- Set the reducing valve above the press's working pressure: the valve stays wide open and the clamp simply follows the main pressure.
- Untick the check valve: while the press approaches at low pressure, oil flows back out of the clamp through the open reducing valve and the clamp force sags — the part could move.
- Lower the setting while the clamp is holding: a plain (two-way) reducing valve cannot let oil out of its outlet, so the clamp keeps the higher pressure until the next cycle.
- Ask the press for more force than the relief allows: it stalls at the relief setting — and the clamp still gets only its setting.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'time (s)' }, y: { label: 'pressure (bar)', min: 0 }, legend: true }, 160);
      const ctl = kit.controls(box.side, [
        { id: 'pr', label: 'Reducing-valve setting', min: 10, max: 150, step: 5, value: 40, unit: 'bar' },
        { id: 'relief', label: 'Relief-valve setting', min: 60, max: 250, step: 5, value: 180, unit: 'bar' },
        { id: 'F', label: 'Pressing force needed', min: 10, max: 100, step: 1, value: 70, unit: 'kN' },
        { id: 'check', type: 'check', label: 'Check valve after the reducing valve', value: true },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart the cycle' }] }
      ], (id) => { if (id === 'restart') { s.phase = 0; s.tp = 0; } });
      const ro = kit.readout(box.side, [['phase', 'Step'], ['p1', 'Main (press) pressure'], ['p2', 'Clamp pressure'], ['fc', 'Clamp force'], ['fp', 'Press force'], ['rv', 'Reducing valve']]);
      const V = ctl.values;
      const Qp = 16 / 60000, Ap1 = Math.PI * 0.08 * 0.08 / 4, Ap2 = Ap1 - Math.PI * 0.045 * 0.045 / 4, Ac = Math.PI * 0.05 * 0.05 / 4;
      const Lp = 0.15, touchP = 0.85, Lc = 0.06, touchC = 0.8, pApp = 15e5, pRet = 25e5;
      const spring = xc => (150 + 5000 * xc) / Ac;                // clamp return spring, as a pressure
      const s = { phase: 0, tp: 0, t: 0, xc: 0, xp: 0, p1: 0, pO: 0, pC: 0, hist: [], tPlot: 0, ph: {}, vPress: 1, vClamp: 1 };
      const STEPS = ['clamping', 'press moving down', 'pressing', 'press returning', 'unclamping', 'pause'];
      let info = {};
      function step(dt) {
        const pR = V.pr * 1e5, pRel = V.relief * 1e5, pNeed = V.F * 1000 / Ap1;
        s.tp += dt; s.t += dt;
        let p1T, clampOn = s.phase <= 3, pressCmd = 0, qClamp = 0, qPress = 0;
        if (s.phase === 0) {                                         // clamp extends through the reducing valve
          const need = spring(s.xc * Lc) + 1e5;
          if (s.xc < touchC && need < pR) { const v = Qp / Ac; s.xc = Math.min(touchC, s.xc + v * dt / Lc); qClamp = Qp; }
          if (s.xc >= touchC) { if (s.tp > 0.6) { s.phase = 1; s.tp = 0; } } else s.tp = 0;
          p1T = qClamp > 0 ? need + 7e5 : pRel;
        } else if (s.phase === 1) {                                  // press approaches the part
          pressCmd = 1; qPress = Qp; s.xp = Math.min(touchP, s.xp + Qp / Ap1 * dt / Lp); p1T = pApp;
          if (s.xp >= touchP) { s.phase = 2; s.tp = 0; }
        } else if (s.phase === 2) {                                  // pressing: the pressure climbs as the part resists
          pressCmd = 1; p1T = Math.min(pRel, pApp + (Math.max(pNeed, pApp) - pApp) * Math.min(1, s.tp / 2.2));
          if (s.tp > 3.2) { s.phase = 3; s.tp = 0; }
        } else if (s.phase === 3) {                                  // press returns
          pressCmd = -1; qPress = Qp; s.xp = Math.max(0, s.xp - Qp / Ap2 * dt / Lp); p1T = pRet;
          if (s.xp <= 0) { s.phase = 4; s.tp = 0; }
        } else if (s.phase === 4) {                                  // clamp valve released: the spring returns the clamp
          s.xc = Math.max(0, s.xc - 0.12 * dt / Lc); p1T = pRel;
          if (s.xc <= 0) { s.phase = 5; s.tp = 0; }
        } else { p1T = pRel; if (s.tp > 1.2) { s.phase = 0; s.tp = 0; } }
        const lag = (a, b, tau) => a + (b - a) * Math.min(1, dt / tau);
        s.p1 = lag(s.p1, p1T, 0.08);
        // the reducing valve's outlet line (up to the clamp valve), and the clamp itself
        let pOT;
        if (qClamp > 0) pOT = spring(s.xc * Lc) + 1e5;              // wide open, passing the clamp flow
        else if (s.p1 >= s.pO) pOT = Math.min(pR, s.p1);             // fills up to the setting (or to p1 if lower)
        else pOT = V.check ? s.pO : Math.min(s.pO, s.p1 < pR ? s.p1 : s.pO);   // p1 below the outlet: back-flow unless the check holds
        s.pO = lag(s.pO, pOT, 0.1);
        s.pC = clampOn ? s.pO : lag(s.pC, spring(s.xc * Lc) * (s.xc > 0 ? 1 : 0), 0.1);
        s.vPress += clamp((pressCmd === 1 ? 0 : pressCmd === -1 ? 2 : 1) - s.vPress, -dt / 0.08, dt / 0.08);
        s.vClamp += clamp((clampOn ? 0 : 1) - s.vClamp, -dt / 0.08, dt / 0.08);
        const regulating = qClamp === 0 && s.p1 > pR + 1e5 && Math.abs(s.pO - pR) < 2e5;
        info = { qClamp, qPress, regulating, pR, pRel, pNeed };
        s.tPlot += dt;
        if (s.tPlot > 0.08) { s.tPlot = 0; s.nHist = (s.nHist || 0) + 1; s.hist.push([s.t, s.p1 / 1e5, s.pC / 1e5]); if (s.hist.length > 180) s.hist.shift(); }
      }
      const loop = kit.loop((dt) => {
        for (let k = 0; k < 4; k++) step(dt / 4);
        const C = kit.colors(), pR = info.pR;
        ro.set('phase', STEPS[s.phase]);
        ro.set('p1', bar(s.p1, 1) + (s.phase === 2 && info.pNeed > info.pRel ? ' — stalled at the relief setting' : ''));
        ro.set('p2', bar(s.pC, 1) + ' (setting ' + V.pr.toFixed(0) + ' bar)');
        ro.set('fc', ((s.pC * Ac - 150 - 5000 * s.xc * Lc) / 1000 > 0 ? ((s.pC * Ac - 150 - 5000 * s.xc * Lc) / 1000).toFixed(1) : '0.0') + ' kN — fed from the main line it would be ' + (s.p1 * Ac / 1000).toFixed(1) + ' kN');
        ro.set('fp', (s.phase === 2 ? s.p1 * Ap1 / 1000 : 0).toFixed(1) + ' kN');
        let rvTxt;
        if (info.qClamp > 0) rvTxt = 'wide open: passing ' + lpm(info.qClamp) + ' to the clamp';
        else if (info.regulating) rvTxt = 'regulating: holds its outlet at the setting, ' + bar(s.p1 - s.pO) + ' below the inlet';
        else if (s.p1 < s.pO - 1e5 && V.check) rvTxt = 'inlet below the outlet: the check valve holds the clamp';
        else if (s.pO > pR + 2e5) rvTxt = 'outlet above the setting: a two-way valve cannot relieve it';
        else rvTxt = 'open: outlet follows the inlet (below the setting)';
        ro.set('rv', rvTxt);
        if (s.nHist !== s.drawn) {
          s.drawn = s.nHist;
          plot.set({
            series: [{ pts: s.hist.map(h => [h[0], h[1]]), label: 'main (press)', color: S.col('pressure') }, { pts: s.hist.map(h => [h[0], h[2]]), label: 'clamp', color: S.col('metered') }],
            hlines: [{ y: V.pr, label: 'reducing setting' }, { y: V.relief, label: 'relief' }]
          });
        }
        // ---- drawing on a 760 × 460 grid
        const c = grid(st, 760, 460);
        const hp = s.p1 > 20e5, adv = (k, q) => { s.ph[k] = (s.ph[k] || 0) + dt * 90 * q / Qp; return s.ph[k]; };
        const header = [[70, 379], [70, 370], [433.6, 370], [433.6, 359]];
        S.line(c, header, { state: 'pressure' });
        S.line(c, [[130, 370], [130, 376]], { state: 'pressure' });
        S.line(c, [[293.6, 370], [293.6, 276]], { state: 'pressure' });
        const pressA = [[293.6, 224], [293.6, 48], [596, 48]], pressB = [[306.4, 224], [306.4, 100], [575, 100], [575, 152], [596, 152]];
        const pc = Math.round(s.vPress);
        S.line(c, pressA, { state: pc === 0 ? 'pressure' : pc === 2 ? 'return' : s.xp > 0.01 ? 'metered' : 'idle' });
        S.line(c, pressB, { state: pc === 2 ? 'pressure' : pc === 0 && info.qPress > 0 ? 'return' : 'idle' });
        S.line(c, [[306.4, 276], [306.4, 276]], { state: 'return' });
        const stO = s.pO > 2e5 ? 'metered' : 'idle';
        if (V.check) { S.line(c, [[433.6, 301], [433.6, 274]], { state: stO }); S.line(c, [[433.6, 238], [433.6, 226]], { state: stO }); }
        else S.line(c, [[433.6, 301], [433.6, 226]], { state: stO });
        S.line(c, [[470, 283], [433.6, 283]], { state: stO });
        const clampLine = [[433.6, 174], [433.6, 158], [505, 158]];
        S.line(c, clampLine, { state: s.phase === 4 && s.xc > 0 ? 'return' : s.pC > 2e5 ? 'metered' : 'idle' });
        S.line(c, [[460.6, 301], [480, 301], [480, 320]], { state: info.regulating ? 'return' : 'idle', kind: 'drain' });
        S.junction(c, 130, 370); S.junction(c, 190, 370); S.junction(c, 293.6, 370); S.junction(c, 433.6, 283);
        S.flow(c, header.slice(0, 3), adv('h', Qp), { color: S.col('pressure') });
        if (info.qClamp > 0) S.flow(c, [[433.6, 370], [433.6, 226]].concat(clampLine.slice(0)), adv('c', info.qClamp), { color: S.col('pressure') });
        if (info.qPress > 0 && pc === 0) S.flow(c, [[293.6, 370], [293.6, 224]].concat(pressA.slice(1)), adv('pa', Qp), { color: S.col('pressure') });
        if (info.qPress > 0 && pc === 2) S.flow(c, [[293.6, 370], [293.6, 276], [306.4, 224]].concat(pressB.slice(1)), adv('pb', Qp), { color: S.col('pressure') });
        const overRelief = info.qClamp === 0 && info.qPress === 0;
        if (overRelief) S.flow(c, [[130, 370], [130, 436]], adv('r', Qp), { color: S.col('pressure') });
        // symbols
        S.pump(c, 70, 405, { motor: true });
        S.tank(c, 70, 441); S.tank(c, 130, 444); S.tank(c, 306.4, 286); S.tank(c, 446.4, 236); S.tank(c, 480, 330);
        S.pressureValve(c, 130, 405, { kind: 'relief', rot: 180, open: overRelief ? 1 : 0 });
        S.gauge(c, 190, 349, { frac: s.p1 / 250e5, value: bar(s.p1) });
        S.gauge(c, 470, 262, { frac: s.pO / 250e5, value: bar(s.pO) });
        S.pressureValve(c, 433.6, 330, { kind: 'reducing', open: info.qClamp > 0 || s.p1 < pR ? 1 : info.regulating ? 0.08 : 0 });
        kit.label(c, 'reducing ' + V.pr.toFixed(0) + ' bar', 448, 352, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'relief ' + V.relief.toFixed(0) + ' bar', 146, 424, { color: C.muted, size: 11, align: 'left' });
        if (V.check) { S.check(c, 433.6, 256, { rot: 0 }); }
        const pv = S.valve(c, 300, 250, { spec: '4/3 closed', state: s.vPress, left: 'spring+solenoid', right: 'spring+solenoid', s: 32, labels: true });
        kit.label(c, 'Y1', pv.xl - 6, 250, { color: pc === 0 ? C.bad : C.muted, size: 11, weight: 700, align: 'right' });
        kit.label(c, 'Y2', pv.xr + 6, 250, { color: pc === 2 ? C.bad : C.muted, size: 11, weight: 700, align: 'left' });
        const cv = S.valve(c, 440, 200, { spec: '3/2 NC', state: s.vClamp, left: 'solenoid', right: 'spring', s: 32, labels: true });
        kit.label(c, 'Y3', cv.xl - 6, 200, { color: s.phase <= 3 ? C.bad : C.muted, size: 11, weight: 700, align: 'right' });
        // the machine: part on a table, press from above, clamp beside it
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(480, 360, 220, 40); c.strokeRect(480, 360, 220, 40);
        kit.label(c, 'part', 590, 380, { color: C.muted, size: 11 });
        c.beginPath(); c.moveTo(470, 400); c.lineTo(740, 400); c.stroke();
        for (let x = 476; x < 740; x += 12) { c.beginPath(); c.moveTo(x, 400); c.lineTo(x - 8, 410); c.stroke(); }
        const pressCyl = S.cylinder(c, 630, 40, { rot: 90, len: 120, h: 48, rodLen: 208, pos: s.xp, fillA: fillP(C, pc === 0 || s.phase === 2 ? s.p1 : 0), fillB: fillP(C, pc === 2 ? s.p1 : 0) });
        c.fillStyle = C.surface; c.fillRect(600, pressCyl.tip[1], 60, 12); c.strokeRect(600, pressCyl.tip[1], 60, 12);
        const clampCyl = S.cylinder(c, 530, 150, { rot: 90, len: 80, h: 30, rodLen: 139, single: 'retract', pos: s.xc, fillA: fillP(C, s.pC) });
        c.fillStyle = C.surface; c.fillRect(518, clampCyl.tip[1], 24, 8); c.strokeRect(518, clampCyl.tip[1], 24, 8);
        if (s.phase === 2) kit.arrow(c, 630, 300, 630, 340, C.bad, 3);
        kit.label(c, 'press', 690, 60, { color: C.text, size: 12, weight: 700, align: 'left' });
        kit.label(c, 'clamp', 548, 170, { color: C.text, size: 12, weight: 700, align: 'left' });
        kit.label(c, STEPS[s.phase], 740, 440, { color: C.text, size: 12, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ lowering a load: counterbalance */
  Hyper.sim('valve-counterbalance', {
    title: 'Lowering a load: counterbalance or check?',
    blurb: `A 63/36 mm cylinder lifts and lowers a load. The oil from the cap end must pass whatever sits in its line: **nothing**, a **plain check valve**, a **pilot-operated check valve** (3:1) or a **counterbalance valve** (pilot ratio and setting adjustable). This simulation integrates the oil's compressibility, the load's inertia and cavitation in fine time steps, so what you see — runaway, chatter, pressure spikes — is the physics, not a script. With a holding valve fitted, the directional valve has a float centre (A and B to tank) so the holding valve can close; without one it has a closed centre.

**Try this**
- *Nothing*: lowering, gravity pulls the load down at about 300 mm/s against the 175 mm/s the pump would give; the rod end cavitates (pressure below zero). Held in the centre, it creeps through the spool clearance.
- *Plain check*: it holds without creeping — but it cannot be opened, so the load cannot come down and the trapped cap end is squeezed far above the load pressure.
- *Pilot check*: lowering starts, the rod-end pressure collapses, the check slams shut, the pressure builds and it opens again: jerky stop-go lowering with pressure spikes.
- *Counterbalance*: smooth lowering at the speed the pump sets, with a few bar at the rod end. Raise the mass to 3000 kg and the setting to 125 bar, then compare 3:1 with 8:1: the higher ratio makes the lowering hunt. Set the valve below the load pressure to see the load sink by itself.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const gd = graphDiv(box);
      const plotP = kit.plot(gd, { x: { label: 'time (s)' }, y: { label: 'pressure (bar)' }, legend: true }, 140);
      const plotV = kit.plot(gd, { x: { label: 'time (s)' }, y: { label: 'rod speed (mm/s)' }, legend: false }, 110);
      let cmd = 1, auto = true, phase = 0, tPhase = 0, peak = 0;
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'up', label: 'Raise' }, { id: 'mid', label: 'Hold' }, { id: 'down', label: 'Lower' }] },
        { id: 'auto', type: 'check', label: 'Cycle automatically', value: true },
        { id: 'hv', type: 'select', label: 'In the cap-end line', options: [['Nothing', 'none'], ['A plain check valve', 'check'], ['A pilot-operated check (3:1)', 'pocv'], ['A counterbalance valve', 'cbv']], value: 'cbv' },
        { id: 'm', label: 'Load mass', min: 200, max: 3000, step: 50, value: 1500, unit: 'kg' },
        { id: 'ps', label: 'Counterbalance setting', min: 30, max: 200, step: 5, value: 65, unit: 'bar' },
        { id: 'R', type: 'select', label: 'Counterbalance pilot ratio', options: [['3:1', 3], ['4:1', 4], ['8:1', 8]], value: 4 }
      ], (id, v) => {
        if (id === 'up' || id === 'mid' || id === 'down') { cmd = id === 'up' ? 1 : id === 'down' ? -1 : 0; auto = false; ctl.set('auto', false); if (cmd === -1) peak = 0; }
        if (id === 'auto') { auto = v; phase = 0; tPhase = 0; }
      });
      const ro = kit.readout(box.side, [['pl', 'Load-holding pressure'], ['pab', 'Cap end / rod end'], ['v', 'Rod speed'], ['hv', 'Holding valve'], ['peak', 'Highest cap-end pressure while lowering']]);
      const V = ctl.values;
      const D = 0.063, d = 0.036, A1 = Math.PI * D * D / 4, A2 = A1 - Math.PI * d * d / 4, L = 0.5;
      const BETA = 1.0e9, VA0 = 2.5e-4, VB0 = 1e-3, VL = 3e-4, VP = 3e-4, FC = 500, CV = 4000, PV = -0.95e5;
      const Qp = 22 / 60000, pSet = 160e5, pcr = pSet - 10e5, Gr = Qp / 10e5;
      const Kd = Qp / Math.sqrt(6e5), Kh = (40 / 60000) / Math.sqrt(3e5), Kn = 4 * Kh, cL = 3.3e-14, H = 1e-5;
      const s = { x: 0.1, v: 0, pA: 0, pB: 0, pL: 0, pP: 0, vA: 0, vB: 0, vL: 0, vP: 0, y: 0, yc: 0, spool: 1, t: 0, hist: [], tPlot: 0, ph: {}, qH: 0, qT: 0 };
      s.pA = V.m * G0 / A1;
      let lastHv = V.hv;
      function node(key, p, dV, Vol) {         // dV: oil pushed into the node this step (m³); a void opens below the vapour limit
        let vd = s[key];
        if (vd > 0) { vd -= dV; if (vd < 0) { p = PV + BETA / Vol * (-vd); vd = 0; } else p = PV; }
        else { p += BETA / Vol * dV; if (p < PV) { vd = (PV - p) * Vol / BETA; p = PV; } }
        s[key] = vd;
        return p;
      }
      function sub() {
        const hv = V.hv, R = hv === 'pocv' ? 3 : +V.R, ps = V.ps * 1e5, W = V.m * G0, M = V.m + 25;
        const floatC = hv !== 'none';
        const u0 = clamp(1 - s.spool, 0, 1), u2 = clamp(s.spool - 1, 0, 1), uc = floatC ? clamp(1 - 2 * Math.abs(s.spool - 1), 0, 1) : 0;
        const Qr = s.pP > pcr ? (s.pP - pcr) * Gr : 0;
        const qPA = orf(Kd * u0, s.pP - s.pL), qBT = orf(Kd * u0, s.pB), qPB = orf(Kd * u2, s.pP - s.pB), qAT = orf(Kd * u2, s.pL);
        const qAc = orf(Kd * 0.5 * uc, s.pL), qBc = orf(Kd * 0.5 * uc, s.pB), qLk = cL * Math.max(0, s.pL);
        let qH;                                                   // out of the cap end, into the line
        if (hv === 'none') qH = orf(Kn, s.pA - s.pL);
        else {
          const ckT = clamp((s.pL - s.pA - 0.5e5) / 1e5, 0, 1);
          s.yc += (ckT - s.yc) * Math.min(1, H / 0.002);
          let yT = 0;
          if (hv === 'pocv') yT = clamp((R * s.pB - (s.pA - s.pL) - 1e5) / 2e5, 0, 1);
          else if (hv === 'cbv') yT = clamp((s.pA + R * s.pB - ps) / 300e5, 0, 1);   // fully open 300 bar above cracking
          s.y += (yT - s.y) * Math.min(1, H / (hv === 'cbv' ? 0.1 : 0.004));        // the counterbalance valve is damped
          const main = orf(Kh * s.y, s.pA - s.pL);
          qH = (hv === 'cbv' ? Math.max(0, main) : main) - Math.max(0, orf(Kh * s.yc, s.pL - s.pA));
        }
        s.pP = node('vP', s.pP, (Qp - Qr - qPA - qPB) * H, VP);
        s.pL = node('vL', s.pL, (qPA + qH - qAT - qAc - qLk) * H, VL);
        const F = s.pA * A1 - s.pB * A2 - W;
        let a;
        if (Math.abs(s.v) < 1e-4 && Math.abs(F) <= FC) { s.v = 0; a = 0; }
        else a = (F - FC * Math.sign(s.v || F) - CV * s.v) / M;
        s.v += a * H; s.x += s.v * H;
        if (s.x <= 0) { s.x = 0; if (s.v < 0) s.v = 0; }
        if (s.x >= L) { s.x = L; if (s.v > 0) s.v = 0; }
        s.pA = node('vA', s.pA, (-qH - A1 * s.v) * H, VA0 + A1 * s.x);
        s.pB = node('vB', s.pB, (qPB - qBT - qBc + A2 * s.v) * H, VB0 + A2 * (L - s.x));
        s.qH = qH; s.qT = qAT + qAc + qBT + qBc; s.qR = Qr; s.qPA = qPA; s.qPB = qPB;
        s.t += H;
      }
      function step(dt) {
        if (V.hv !== lastHv) { lastHv = V.hv; s.y = 0; s.yc = 0; s.vA = s.vB = s.vL = 0; peak = 0; }
        if (auto) {
          tPhase += dt;
          if (phase === 0) { cmd = 1; if (s.x >= L - 0.03 || tPhase > 8) { phase = 1; tPhase = 0; } }
          else if (phase === 1) { cmd = 0; if (tPhase > 1.5) { phase = 2; tPhase = 0; peak = 0; } }
          else if (phase === 2) { cmd = -1; if (s.x <= 0.1 * L || tPhase > 6) { phase = 3; tPhase = 0; } }
          else { cmd = 0; if (tPhase > 1.5) { phase = 0; tPhase = 0; } }
        }
        const target = cmd === 1 ? 0 : cmd === -1 ? 2 : 1;
        const n = Math.max(1, Math.round(dt / H));
        for (let k = 0; k < n; k++) {
          s.spool += clamp(target - s.spool, -H / 0.1, H / 0.1);
          sub();
          if (cmd === -1 && s.pA > peak) peak = s.pA;
        }
        s.tPlot += dt;
        if (s.tPlot > 0.03) { s.tPlot = 0; s.hist.push([s.t, s.pA / 1e5, s.pB / 1e5, s.v * 1000]); if (s.hist.length > 270) s.hist.shift(); }
      }
      const loop = kit.loop((dt) => {
        step(Math.min(dt, 0.05));
        const C = kit.colors(), W = V.m * G0, pLoad = W / A1, hv = V.hv;
        ro.set('pl', bar(pLoad, 1) + ' — a counterbalance valve is set to about 1.3 × this: ' + bar(1.3 * pLoad));
        ro.set('pab', bar(s.pA, 1) + ' / ' + bar(s.pB, 1));
        const mms = s.v * 1000;
        ro.set('v', Math.abs(mms) < 0.5 ? 'stopped' : (mms > 0 ? 'rising ' : 'falling ') + Math.abs(mms).toFixed(0) + ' mm/s' + (mms < -1 ? '  (pump-driven: ' + (Qp / A2 * 1000).toFixed(0) + ' mm/s)' : ''));
        let hvTxt;
        if (hv === 'none') hvTxt = 'none: the spool alone holds and meters the load';
        else if (s.yc > 0.05) hvTxt = 'check part open: free flow into the cap end';
        else if (hv === 'check') hvTxt = 'closed' + (cmd === -1 && s.pB > 20e5 ? ': it cannot be opened — the load cannot come down' : ' (leak-free)');
        else if (s.y > 0.02) hvTxt = (hv === 'cbv' ? 'metering, ' + (s.y * 100).toFixed(0) + ' % open' : 'piloted open');
        else hvTxt = 'closed (leak-free)' + (hv === 'cbv' && V.ps * 1e5 < pLoad ? ' — but the setting is below the load pressure!' : '');
        ro.set('hv', hvTxt);
        ro.set('peak', peak > 0 ? bar(peak) + ' (load pressure ' + bar(pLoad) + ')' : '—');
        if (s.hist.length > 1 && s.t - (s.tDrawn || 0) > 0.1) {
          s.tDrawn = s.t;
          plotP.set({ series: [{ pts: s.hist.map(h => [h[0], h[1]]), label: 'cap end p_A', color: S.col('pressure') }, { pts: s.hist.map(h => [h[0], h[2]]), label: 'rod end p_B', color: S.col('return') }], hlines: hv === 'cbv' ? [{ y: V.ps, label: 'setting' }] : [] });
          plotV.set({ series: [{ pts: s.hist.map(h => [h[0], h[3]]), label: 'speed', color: C.accent }], hlines: [{ y: -Qp / A2 * 1000, label: 'pump-driven' }] });
        }
        // ---- drawing on a 760 × 460 grid
        const c = grid(st, 760, 460);
        const box0 = Math.round(s.spool), lowering = box0 === 2, raising = box0 === 0;
        const moving = Math.abs(s.v) > 1e-3;
        const stA = raising ? 'pressure' : lowering && moving ? 'return' : s.pA > 5e5 ? 'metered' : 'idle';
        const stL = raising ? 'pressure' : lowering && s.qH > 1e-6 ? 'return' : s.pL > 5e5 ? 'metered' : 'idle';
        const stB = lowering ? (s.pB < 0 ? 'suction' : 'pressure') : raising && moving ? 'return' : 'idle';
        const hvY = 320;
        const cylSide = hv === 'none' ? [[202, 402], [262, 402], [262, hvY]] : hv === 'cbv' ? [[202, 402], [262, 402], [262, hvY + 29]] : [[202, 402], [262, 402], [262, hvY + 18]];
        const lineSide = hv === 'none' ? [[262, hvY], [262, 170], [462.8, 170], [462.8, 202]] : hv === 'cbv' ? [[262, hvY - 29], [262, 170], [462.8, 170], [462.8, 202]] : [[262, hvY - 18], [262, 170], [462.8, 170], [462.8, 202]];
        const pathB = [[202, 268], [225, 268], [225, 150], [477.2, 150], [477.2, 202]];
        S.line(c, cylSide, { state: stA });
        S.line(c, lineSide, { state: stL });
        S.line(c, pathB, { state: stB });
        S.line(c, [[395, 344], [395, 306], [462.8, 306], [462.8, 258]], { state: 'pressure' });
        S.line(c, [[445, 306], [445, 312]], { state: 'pressure' });
        S.line(c, [[477.2, 258], [477.2, 404]], { state: s.qT > 1e-6 ? 'return' : 'idle' });
        S.junction(c, 445, 306); S.junction(c, 420, 306);
        if (hv === 'pocv' || hv === 'cbv') { S.line(c, hv === 'pocv' ? [[225, 268], [225, 308], [246, 308]] : [[225, 268], [225, 308], [247, 308]], { state: 'pilot' }); S.junction(c, 225, 268); }
        const adv = (k, q) => { s.ph[k] = (s.ph[k] || 0) + dt * 90 * q / Qp; return s.ph[k]; };
        S.flow(c, [[395, 344], [395, 306]], adv('pu', Qp), { color: S.col('pressure') });
        if (Math.abs(s.qPA + s.qPB) > 1e-6) S.flow(c, [[395, 306], [462.8, 306], [462.8, 258]], adv('pv', s.qPA + s.qPB), { color: S.col('pressure') });
        if (s.qR > 1e-6) S.flow(c, [[445, 306], [445, 372]], adv('re', s.qR), { color: S.col('pressure') });
        if (Math.abs(s.v) > 1e-3) {
          S.flow(c, cylSide.slice().reverse().concat(lineSide), adv('a', -A1 * s.v), { color: S.col(stA === 'idle' ? 'return' : stA) });
          S.flow(c, pathB, adv('b', A2 * s.v), { color: S.col(stB === 'idle' ? 'return' : stB) });
        }
        if (s.qT > 1e-6) S.flow(c, [[477.2, 258], [477.2, 404]], adv('t', s.qT), { color: S.col('return') });
        // the holding valve
        if (hv === 'check' || hv === 'pocv') S.check(c, 262, hvY, { rot: 180, spring: true, pilot: hv === 'pocv', open: s.yc > 0.3 || s.y > 0.3 });
        else if (hv === 'cbv') {
          S.pressureValve(c, 262, hvY, { kind: 'relief', open: s.y });
          S.line(c, [[262, hvY + 40], [312, hvY + 40], [312, hvY + 18]], { state: stA });
          S.line(c, [[312, hvY - 18], [312, hvY - 38], [262, hvY - 38]], { state: stL });
          S.check(c, 312, hvY, { rot: 180, spring: true, open: s.yc > 0.3 });
          S.junction(c, 262, hvY + 40); S.junction(c, 262, hvY - 38);
          kit.label(c, V.ps.toFixed(0) + ' bar  ' + V.R + ':1', 326, hvY + 58, { color: C.muted, size: 11, align: 'left' });
        }
        kit.label(c, hv === 'none' ? '' : hv === 'check' ? 'check' : hv === 'pocv' ? 'pilot check 3:1' : 'counterbalance', 326, hvY - 52, { color: C.text, size: 12, weight: 700, align: 'left' });
        // the rest of the circuit
        S.pump(c, 395, 370, { motor: true });
        S.tank(c, 395, 406); S.tank(c, 445, 380); S.tank(c, 477.2, 414);
        S.pressureValve(c, 445, 341, { kind: 'relief', rot: 180, open: clamp(s.qR / Qp, 0, 1) });
        S.gauge(c, 420, 285, { frac: s.pP / 250e5 });
        kit.label(c, bar(s.pP), 404, 285, { color: C.text, size: 11, align: 'right' });
        const v4 = S.valve(c, 470, 230, { spec: hv === 'none' ? '4/3 closed' : '4/3 float', state: s.spool, left: 'spring+solenoid', right: 'spring+solenoid', s: 36, labels: true });
        kit.label(c, 'raise', v4.xl - 8, 230, { color: cmd === 1 ? C.bad : C.muted, size: 11, weight: 700, align: 'right' });
        kit.label(c, 'lower', v4.xr + 8, 230, { color: cmd === -1 ? C.bad : C.muted, size: 11, weight: 700, align: 'left' });
        const cy = S.cylinder(c, 170, 410, { rot: 270, len: 150, h: 44, pos: s.x / L, fillA: fillP(C, s.pA), fillB: fillP(C, s.pB) });
        loadBlock(c, kit, C, cy.tip, V.m);
        kit.label(c, 'p_A ' + bar(s.pA), 210, 418, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'p_B ' + bar(s.pB), 232, 256, { color: s.pB < 0 ? C.bad : C.muted, size: 11, align: 'left' });
        kit.label(c, 'relief 160 bar', 470, 346, { color: C.muted, size: 11, align: 'left' });
        const msg = lowering && s.pB < -0.5e5 ? 'rod end cavitating: the load is running ahead of the pump' : lowering && hv === 'check' && s.pB > 50e5 ? 'the check valve will not open: the cap end is squeezed to ' + bar(s.pA) : '';
        if (msg) kit.label(c, msg, 740, 444, { color: C.bad, size: 12, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
