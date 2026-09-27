/* HYPER-PNEUMATICS · sims/valves.js — simulations for the Valves branch (directional valves, valve flow, symbols).
 *   valve-explorer         3/2, 5/2 and 5/3 valves (spring return, impulse, three centres) driving a cylinder:
 *                          operate the solenoids, watch the flow paths in the working box and the rod respond
 *   valve-poppet-spool     a poppet valve and a spool valve in section beside their symbol: opening areas against
 *                          travel, overlap, operating force, leakage
 *   valve-solenoid-timing  a pilot-operated solenoid valve switching on and off: coil current, pilot pressure, main
 *                          spool; response times, minimum pilot pressure, internal and external pilot air
 *   valve-flow-curve       the ISO 6358 flow characteristic: flow against downstream pressure, choked and subsonic,
 *                          with C, b and the subsonic index m
 *   valve-sizing           stroke time against valve conductance for a cylinder (kit.fluid.pneuCylinder), tubes in
 *                          series: the valve a stroke time needs, against typical valve sizes
 *   valve-symbols          a working ISO 1219 circuit: click any symbol for its name, meaning and port numbers
 *   valve-terminal         a valve terminal on a fieldbus: output bits drive the coils; shared supply and exhaust channels
 * Physics: chamber pressures by the adiabatic energy balance, every restriction by ISO 6358 (kit.fluid.iso6358).
 */
(function () {
  'use strict';
  const PATM = 1.013e5, T0 = 293.15, RG = 287.058, GAM = 1.4, RHO0 = 1.185;
  const BORES = { 16: 6, 20: 8, 25: 10, 32: 12, 40: 16, 50: 20, 63: 20, 80: 25, 100: 25 };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // signed mass flow (kg/s) from pressure pa to pb through a restriction of sonic conductance C (m³/(s·Pa)), by ISO 6358
  function mflow(F, C, b, pa, pb) {
    if (!(C > 0)) return 0;
    return pa >= pb ? F.iso6358({ C, b, p1: pa, p2: pb }).mdot : -F.iso6358({ C, b, p1: pb, p2: pa }).mdot;
  }
  // two restrictions in series (the approximate rule 1/C² = 1/C1² + 1/C2²)
  const series = (a, b) => (!(a > 0) || !(b > 0)) ? 0 : 1 / Math.sqrt(1 / (a * a) + 1 / (b * b));

  /* A cylinder whose two ports can each be fed, exhausted or blocked (kit.fluid.pneuCylinder only knows
     "extend" and "retract", and a 5/3 valve needs its centre positions). Same equations as pneuCylinder:
     adiabatic filling and emptying, the piston's work, Coulomb and viscous friction, end stops. */
  function cylModel(o) {
    const P = Object.assign({ bore: 0.032, rod: 0.012, stroke: 0.1, mass: 1, dead: 1.2e-5, fc: 12, fv: 30,
      single: false, k0: 0, k1: 0, C: 0.5e-8, Cex: 0, b: 0.3, Cvent: 5e-8 }, o || {});   // Cex: exhaust path if it differs (meter-out)
    P.AA = Math.PI * P.bore * P.bore / 4;
    P.AB = P.AA - Math.PI * P.rod * P.rod / 4;
    return { P, s: { x: 0, v: 0, pA: PATM, pB: PATM, mA: 0, mB: 0, air: 0, Fair: 0 } };
  }
  // one step of h seconds; modes 'supply' | 'exhaust' | 'closed'; ps and pex absolute (Pa); load pushes the rod in
  function cylStep(F, cy, h, modeA, modeB, ps, pex, load) {
    const P = cy.P, s = cy.s;
    const VA = P.dead + P.AA * s.x, VB = P.dead + P.AB * (P.stroke - s.x);
    const port = (mode, p) => mode === 'supply' ? mflow(F, P.C, P.b, ps, p) : mode === 'exhaust' ? -mflow(F, P.Cex || P.C, P.b, p, pex) : 0;
    const mA = port(modeA, s.pA);
    const mB = P.single ? -mflow(F, P.Cvent, 0.5, s.pB, PATM) : port(modeB, s.pB);
    if (mA > 0 && modeA === 'supply') s.air += mA * h;
    if (mB > 0 && modeB === 'supply') s.air += mB * h;
    s.Fair = s.pA * P.AA - s.pB * P.AB - PATM * (P.AA - P.AB);
    const Fp = s.Fair - load - (P.single ? P.k0 + P.k1 * s.x : 0);
    let a;
    if (Math.abs(s.v) < 1e-4 && Math.abs(Fp) <= P.fc) { a = 0; s.v = 0; }
    else a = (Fp - Math.sign(s.v || Fp) * P.fc - P.fv * s.v) / P.mass;
    s.v += a * h; s.x += s.v * h;
    if (s.x <= 0) { s.x = 0; if (s.v < 0) s.v = 0; }
    if (s.x >= P.stroke) { s.x = P.stroke; if (s.v > 0) s.v = 0; }
    s.pA += h * (GAM * RG * T0 * mA - GAM * s.pA * P.AA * s.v) / VA;
    s.pB += h * (GAM * RG * T0 * mB + GAM * s.pB * P.AB * s.v) / VB;
    s.pA = Math.max(1000, s.pA); s.pB = Math.max(1000, s.pB);
    s.mA = mA; s.mB = mB;
    return s;
  }

  // the flow paths of one box of a valve symbol drawn at (x, y) with box size s: polylines from port to port
  function boxPaths(S, spec, box, x, y, s) {
    const sp = S.SPEC[spec], slot = {};
    for (const [n, f] of sp.top) slot[n] = [x - s / 2 + f * s, y - s / 2, true];
    for (const [n, f] of sp.bottom) slot[n] = [x - s / 2 + f * s, y + s / 2, false];
    const out = [];
    for (const k of sp.boxes[box] || []) {
      if (k.endsWith('|')) continue;
      if (k.includes('+')) {
        const names = k.split('+'), p0 = slot[names[0]];
        for (const n of names.slice(1)) { const q = slot[n]; if (p0 && q) out.push({ from: names[0], to: n, pts: [[p0[0], p0[1]], [p0[0], y], [q[0], y], [q[0], q[1]]] }); }
      } else {
        const [a, b] = k.split('>'), A = slot[a], B = slot[b];
        if (!A || !B) continue;
        const d = A[2] ? 1 : -1;
        out.push({ from: a, to: b, pts: A[2] === B[2] ? [[A[0], A[1]], [A[0], A[1] + d * s * 0.42], [B[0], B[1] + d * s * 0.42], [B[0], B[1]]] : [[A[0], A[1]], [B[0], B[1]]] });
      }
    }
    return out;
  }
  // a translucent blue for a chamber at gauge pressure p (Pa), relative to pmax
  const airFill = (C, p, pmax) => p > 0.2e5 ? (C.dark ? 'rgba(79,141,255,' : 'rgba(29,78,216,') + Math.min(0.5, 0.08 + 0.42 * p / Math.max(pmax, 1e4)).toFixed(3) + ')' : null;

  /* ================================================================ valve-explorer */
  const KINDS = {
    nc: { spec: '3/2 NC', left: 'solenoid', right: 'spring', coils: 1, sig: '12', single: true },
    no: { spec: '3/2 NO', left: 'solenoid', right: 'spring', coils: 1, sig: '10', single: true },
    s52: { spec: '5/2', left: 'solenoid', right: 'spring', coils: 1, sig: '14' },
    i52: { spec: '5/2', left: 'solenoid', right: 'solenoid', coils: 2, sig: '14', sigR: '12', memory: true },
    c53: { spec: '5/3 closed', left: 'spring+solenoid', right: 'spring+solenoid', coils: 2, sig: '14', sigR: '12', centre: true },
    e53: { spec: '5/3 exhaust', left: 'spring+solenoid', right: 'spring+solenoid', coils: 2, sig: '14', sigR: '12', centre: true },
    p53: { spec: '5/3 pressure', left: 'spring+solenoid', right: 'spring+solenoid', coils: 2, sig: '14', sigR: '12', centre: true }
  };
  // what the cylinder's ports see in each box: [cap end (port 4, or 2 on a 3/2), rod end (port 2)]
  const MODES = {
    '3/2 NC': [['supply'], ['exhaust']],
    '3/2 NO': [['exhaust'], ['supply']],
    '5/2': [['supply', 'exhaust'], ['exhaust', 'supply']],
    '5/3 closed': [['supply', 'exhaust'], ['closed', 'closed'], ['exhaust', 'supply']],
    '5/3 exhaust': [['supply', 'exhaust'], ['exhaust', 'exhaust'], ['exhaust', 'supply']],
    '5/3 pressure': [['supply', 'exhaust'], ['supply', 'supply'], ['exhaust', 'supply']]
  };
  const CONN = {
    '3/2 NC': ['1 → 2, port 3 blocked', '2 → 3, port 1 blocked'],
    '3/2 NO': ['2 → 3, port 1 blocked', '1 → 2, port 3 blocked'],
    '5/2': ['1 → 4 and 2 → 3, port 5 blocked', '1 → 2 and 4 → 5, port 3 blocked'],
    '5/3 closed': ['1 → 4 and 2 → 3', 'centre: all five ports blocked', '1 → 2 and 4 → 5'],
    '5/3 exhaust': ['1 → 4 and 2 → 3', 'centre: 2 → 3 and 4 → 5, port 1 blocked', '1 → 2 and 4 → 5'],
    '5/3 pressure': ['1 → 4 and 2 → 3', 'centre: 1 → 2 and 1 → 4, ports 3 and 5 blocked', '1 → 2 and 4 → 5']
  };

  Hyper.sim('valve-explorer', {
    title: 'Directional valves at work',
    blurb: `A 32 mm cylinder (12 mm rod, 160 mm stroke) driven by the valve you choose: a 3/2 valve with a single-acting, spring-return cylinder, or a 5/2 or 5/3 valve with a double-acting one. Tick a solenoid to hold it energised, or pulse it for 0.15 s. The box at the ports is the one working; its flow paths light up — **blue** where supply air flows, **light blue** where air exhausts through the silencers. The chambers are simulated with real air: filling and emptying by ISO 6358, compression as the piston moves.

**Try this**
- 5/2 with spring return: pulse the left solenoid. The rod starts out and comes straight back — the spring returns the valve as soon as the signal ends.
- 5/2 impulse valve: pulse left, then right. The valve stays where the last pulse left it: a memory. Energise both at once and nothing changes.
- 5/3 closed centre: stop the rod in mid-stroke, then move the external force slider. The rod gives way and springs back: it is held by trapped air, not by something rigid.
- 5/3 exhausted centre: stop in mid-stroke with a force pushing the rod in. Nothing holds it but friction.
- 5/3 pressurised centre: the rod creeps out with (supply pressure × rod area), about 68 N at 6 bar, unless the load is bigger.
- 3/2 normally open: the cylinder is out with no signal at all. Think about which you would want if the power failed.`,
    mount(box, kit, params) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const gb = document.createElement('div');
      gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:1fr 1fr;gap:8px';
      box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div');
      gb.appendChild(g1); gb.appendChild(g2);
      const start = params && KINDS[params.kind] ? params.kind : 's52';
      let K, cyl, vstate = 1, mem = 1, pulseL = 0, pulseR = 0, hist = [], t = 0, tPlot = 0;
      const ph = {};
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Valve', options: [['3/2 normally closed, spring return (single-acting cylinder)', 'nc'], ['3/2 normally open, spring return (single-acting cylinder)', 'no'],
          ['5/2 solenoid, spring return', 's52'], ['5/2 double solenoid: impulse (memory) valve', 'i52'], ['5/3 closed centre', 'c53'], ['5/3 exhausted centre', 'e53'], ['5/3 pressurised centre', 'p53']], value: start },
        { id: 'L', type: 'check', label: 'Left solenoid energised', value: false },
        { id: 'R', type: 'check', label: 'Right solenoid energised', value: false },
        { type: 'buttons', items: [{ id: 'pl', label: 'Pulse left' }, { id: 'pr', label: 'Pulse right' }] },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 2, max: 8, step: 0.5, value: 6, unit: 'bar' },
        { id: 'F', label: 'External force pushing the rod in', min: -300, max: 300, step: 10, value: 30, unit: 'N' },
        { id: 'mass', label: 'Moving mass', min: 0.3, max: 20, step: 0.1, value: 2, unit: 'kg', log: true },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25], ['Slow motion 1/10', 0.1]], value: 0.25 }
      ], (id) => {
        if (id === 'kind') build();
        if (id === 'pl') pulseL = 0.15;
        if (id === 'pr') pulseR = 0.15;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['box', 'Working box'], ['p', 'Cap end / rod end (gauge)'], ['x', 'Rod position / speed'], ['f', 'Net force of the air on the piston'], ['note', 'What is happening']]);
      const pPos = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'rod position (mm)', min: 0, max: 160 } }, 120);
      const pPr = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'gauge pressure (bar)', min: 0 }, legend: true }, 120);
      function build() {
        K = KINDS[V.kind] || KINDS.s52;
        cyl = cylModel({ bore: 0.032, rod: 0.012, stroke: 0.16, mass: V.mass, single: !!K.single, k0: 40, k1: 250 });
        cyl.s.pB = K.single ? PATM : V.ps * 1e5 + PATM;
        vstate = 1; mem = 1; hist = []; t = 0; pulseL = pulseR = 0;
        ctl.show('R', K.coils === 2); ctl.show('pr', K.coils === 2);
        if (K.coils === 1) ctl.set('R', false);
      }
      build();
      const loop = kit.loop((dt) => {
        const sdt = Math.min(dt, 0.05) * V.slow;
        pulseL = Math.max(0, pulseL - sdt); pulseR = Math.max(0, pulseR - sdt);
        const onL = !!V.L || pulseL > 0, onR = K.coils === 2 && (!!V.R || pulseR > 0);
        let target;
        if (K.coils === 1) target = onL ? 0 : 1;
        else if (K.memory) { if (onL && !onR) mem = 0; else if (onR && !onL) mem = 1; target = mem; }
        else target = onL && !onR ? 0 : onR && !onL ? 2 : 1;
        cyl.P.mass = V.mass;
        const ps = V.ps * 1e5 + PATM, n = Math.max(1, Math.ceil(sdt / 2e-5)), h = sdt / n;
        for (let k = 0; k < n; k++) {
          vstate += clamp(target - vstate, -h / 0.015, h / 0.015);
          const md = MODES[K.spec][Math.round(vstate)];
          cylStep(F, cyl, h, md[0], md[1] || 'closed', ps, PATM, V.F);
        }
        t += sdt;
        const s = cyl.s, P = cyl.P, pA = s.pA - PATM, pB = s.pB - PATM;
        const wb = Math.round(vstate), settled = Math.abs(vstate - wb) < 0.03, md = MODES[K.spec][wb];
        // read-outs
        const moving = Math.abs(s.v) > 0.005;
        let note;
        if (!settled) note = 'the valve is switching';
        else if (K.centre && wb === 1) {
          if (K.spec === '5/3 closed') note = moving ? 'centre: air trapped on both sides brakes the rod' : 'centre: every port blocked; trapped air holds the rod, springily';
          else if (K.spec === '5/3 exhaust') note = moving ? 'centre: both sides vented; the rod coasts or yields to the load' : 'centre: both sides vented; only friction holds the rod';
          else note = 'centre: supply on both sides; net push ' + (V.ps * 1e5 * Math.PI * P.rod * P.rod / 4).toFixed(0) + ' N outwards (p × rod area)';
        } else note = moving ? (s.v > 0 ? 'extending' : 'retracting') : s.x >= P.stroke - 1e-4 ? 'at the front end stop' : s.x <= 1e-4 ? 'at the back end stop' : 'stopped in mid-stroke';
        ro.set('box', settled ? CONN[K.spec][wb] : 'switching…');
        ro.set('p', (pA / 1e5).toFixed(2) + (K.single ? ' bar / vented' : ' / ' + (pB / 1e5).toFixed(2) + ' bar'));
        ro.set('x', (s.x * 1000).toFixed(0) + ' mm / ' + s.v.toFixed(2) + ' m/s');
        ro.set('f', s.Fair.toFixed(0) + ' N' + (K.single ? ' (spring ' + (P.k0 + P.k1 * s.x).toFixed(0) + ' N back)' : ''));
        ro.set('note', note);
        hist.push([t, s.x * 1000, pA / 1e5, pB / 1e5]);
        while (hist.length && hist[0][0] < t - 3) hist.shift();
        tPlot += dt;
        if (tPlot > 0.08) {
          tPlot = 0;
          const hh = hist.filter((q, i) => i % 2 === 0);
          pPos.set({ series: [{ pts: hh.map(q => [q[0], q[1]]), label: 'rod position' }] });
          const ser = [{ pts: hh.map(q => [q[0], q[2]]), label: 'cap end' }];
          if (!K.single) ser.push({ pts: hh.map(q => [q[0], q[3]]), label: 'rod end', dash: [5, 4] });
          pPr.set({ series: ser, y: { label: 'gauge pressure (bar)', min: 0, max: V.ps + 0.5 } });
        }
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin(), C = kit.colors(), k = Math.min(st.W / 760, st.H / 420);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 420 * k) / 2); c.scale(k, k);
        const sv = 40, vx = 390, vy = 250;
        // (fsym draws a single-acting cylinder's spring with zero length at full stroke, so stop the picture just short of it)
        const cy = S.cylinder(c, 250, 80, { len: 280, h: 42, rodLen: 150, pos: Math.min(K.single ? 0.985 : 1, s.x / P.stroke), fillA: airFill(C, pA, V.ps * 1e5), fillB: K.single ? null : airFill(C, pB, V.ps * 1e5), single: K.single ? 'retract' : undefined });
        const v = S.valve(c, vx, vy, { spec: K.spec, state: vstate, left: K.left, right: K.right, s: sv, pneumatic: true, labels: true, exhaust: 'silencer' });
        const capPort = K.single ? v.A : v.B, rodPort = K.single ? null : v.A;
        const Lcap = [cy.A, [cy.A[0], 180], [capPort[0], 180], capPort];
        const Lrod = rodPort ? [cy.B, [cy.B[0], 196], [rodPort[0], 196], rodPort] : null;
        const lineState = (mode, p) => mode === 'supply' ? 'air' : mode === 'exhaust' ? (p > 0.15e5 ? 'exhaust' : 'idle') : (p > 0.2e5 ? 'air' : 'idle');
        S.line(c, Lcap, { state: lineState(md[0], pA) });
        if (Lrod) S.line(c, Lrod, { state: lineState(md[1], pB) });
        const Lsup = [[160, 365], [160, 355], [202, 355]], Lmain = [[298, 355], [v.P[0], 355], v.P];
        S.line(c, Lsup, { state: 'air' }); S.line(c, Lmain, { state: 'air' }); S.line(c, [[330, 343], [330, 355]], { state: 'air' }); S.junction(c, 330, 355);
        // flow: dots along the lines and through the working box, at speeds that follow the mass flows
        const mref = RHO0 * P.C * ps;
        const adv = (key, m) => { ph[key] = (ph[key] || 0) + dt * 80 * Math.min(2, Math.abs(m) / mref); return ph[key]; };
        const chamberOf = { A: K.single ? 'cap' : 'rod', B: 'cap' }, flowOf = { cap: s.mA, rod: s.mB };
        if (Math.abs(s.mA) > 0.01 * mref) S.flow(c, s.mA > 0 ? Lcap.slice().reverse() : Lcap, adv('cap', s.mA), { color: S.col(s.mA > 0 ? 'air' : 'exhaust') });
        if (Lrod && Math.abs(s.mB) > 0.01 * mref) S.flow(c, s.mB > 0 ? Lrod.slice().reverse() : Lrod, adv('rod', s.mB), { color: S.col(s.mB > 0 ? 'air' : 'exhaust') });
        let supplyFlow = 0;
        if (settled) {
          for (const pth of boxPaths(S, K.spec, wb, vx, vy, sv)) {
            const fromSupply = pth.from === 'P', ch = chamberOf[fromSupply ? pth.to : pth.from];
            if (!ch) continue;
            const m = fromSupply ? flowOf[ch] : -flowOf[ch], stateName = fromSupply ? 'air' : 'exhaust';
            const pts = pth.pts.slice();
            if (fromSupply) { pts.unshift([pts[0][0], pts[0][1] + 10]); pts.push([pts[pts.length - 1][0], pts[pts.length - 1][1] - 10]); supplyFlow += Math.max(0, m); }
            else { pts.unshift([pts[0][0], pts[0][1] - 10]); pts.push([pts[pts.length - 1][0], pts[pts.length - 1][1] + 24]); }
            if (fromSupply || m > 0.01 * mref) S.line(c, pts, { state: stateName, width: 2.6 });
            if (m > 0.01 * mref) S.flow(c, pts, adv('in' + pth.from + pth.to, m), { color: S.col(stateName) });
          }
        }
        if (supplyFlow > 0.01 * mref) S.flow(c, Lsup.concat(Lmain), adv('sup', supplyFlow), { color: S.col('air') });
        S.source(c, 160, 385, { pneumatic: true });
        S.frl(c, 250, 355);
        S.gauge(c, 330, 322, { frac: V.ps / 10, value: V.ps.toFixed(1) + ' bar' });
        kit.label(c, K.sig, v.xl - 6, vy - 16, { color: onL ? C.bad : C.muted, size: 12, weight: 700, align: 'right' });
        if (K.sigR) kit.label(c, K.sigR, v.xr + 6, vy - 16, { color: onR ? C.bad : C.muted, size: 12, weight: 700, align: 'left' });
        if (onL) kit.label(c, 'on', v.xl - 6, vy + 16, { color: C.bad, size: 11, weight: 700, align: 'right' });
        if (onR) kit.label(c, 'on', v.xr + 6, vy + 16, { color: C.bad, size: 11, weight: 700, align: 'left' });
        // the moving mass and the external force
        const mw = 24 + 6 * Math.log2(1 + V.mass);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(cy.tip[0], 80 - mw / 2, mw, mw); c.strokeRect(cy.tip[0], 80 - mw / 2, mw, mw);
        if (Math.abs(V.F) >= 5) {
          const La = 18 + 50 * Math.abs(V.F) / 300, x0 = cy.tip[0] + mw + 6;
          if (V.F > 0) kit.arrow(c, x0 + La, 80, x0, 80, C.warn, 2.5); else kit.arrow(c, x0, 80, x0 + La, 80, C.warn, 2.5);
          kit.label(c, Math.abs(V.F).toFixed(0) + ' N', x0 + La / 2, 64, { color: C.warn, size: 11, weight: 700, align: 'center' });
        }
        kit.label(c, (pA / 1e5).toFixed(1) + ' bar', 300, 44, { color: C.text, size: 12, weight: 700, align: 'center' });
        if (!K.single) kit.label(c, (pB / 1e5).toFixed(1) + ' bar', 480, 44, { color: C.text, size: 12, weight: 700, align: 'center' });
        kit.label(c, 'Working box: ' + (settled ? CONN[K.spec][wb] : 'switching…'), 20, 402, { color: C.muted, size: 12 });
        kit.label(c, 't = ' + t.toFixed(2) + ' s', 740, 402, { color: C.muted, size: 11, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ valve-poppet-spool */
  // a 5/2 spool (mm): pitch between the port grooves, groove width, spool diameter, the most a path can open (neck and port)
  const SP = { pitch: 5, gw: 3, D: 8, amax: 20 };
  const LAPS = { pos: 0.6, zero: 0, neg: -0.6 };
  // opening areas (mm²) at spool travel d (mm): 1→2 and 4→5 close, 1→4 and 2→3 open; the land is the groove width plus the lap
  function spoolOpen(d, lap) {
    const dc = SP.pitch / 2 - lap / 2, dO = SP.pitch / 2 + lap / 2, k = Math.PI * SP.D;
    const closing = Math.min(SP.amax, k * Math.max(0, dc - d)), opening = Math.min(SP.amax, k * Math.max(0, d - dO));
    return { a12: closing, a45: closing, a14: opening, a23: opening };
  }
  // a 3/2 poppet (mm): seat, stem outside and bore, free travel before the stem meets the disc, full travel
  const PP = { seat: 5, stem: 3, bore: 2.2, gap: 0.6, travel: 2.2 };
  function poppetOpen(tr) {
    const lift = Math.max(0, tr - PP.gap);
    const a12 = Math.min(Math.PI * PP.seat * lift, Math.PI * (PP.seat * PP.seat - PP.stem * PP.stem) / 4);   // curtain, then the annulus round the stem
    const a23 = Math.min(Math.PI * PP.bore * Math.max(0, PP.gap - tr), Math.PI * PP.bore * PP.bore / 4);
    return { a12, a23, lift };
  }
  const areaC = a => a * 2e-9;          // effective area (mm²) → sonic conductance (m³/(s·Pa)): C ≈ S/5 in dm³/(s·bar)

  /* a 5/2 spool valve in section. o: { x: centre of the port-1 groove, y: bore axis, px: pixels per mm, lap, d: travel (mm),
     fill: { 1..5: colour or null }, left: 'button' | 'pilot', pilotFill } — the grooves read 5 4 1 2 3 like the symbol */
  function drawSpool(c, kit, S, o) {
    const C = kit.colors(), px = o.px, P = SP.pitch * px, gw = SP.gw * px, lw = (SP.gw + o.lap) * px;
    const y = o.y, rb = 13, rg = 24, x0 = o.x - 2.5 * P - 40, x1 = o.x + 2.5 * P + 60, top = y - 62, bot = y + 62;
    const X = { 5: o.x - 2 * P, 4: o.x - P, 1: o.x, 2: o.x + P, 3: o.x + 2 * P }, UP = { 4: true, 2: true };
    c.fillStyle = C.surface; c.fillRect(x0, top, x1 - x0, bot - top);
    c.strokeStyle = C.faint || C.muted; c.lineWidth = 1;
    c.save(); c.beginPath(); c.rect(x0, top, x1 - x0, bot - top); c.clip();
    for (let hx = x0 - 140; hx < x1; hx += 12) { c.beginPath(); c.moveTo(hx, bot); c.lineTo(hx + 124, top); c.stroke(); }
    c.restore();
    // cavities: the bore, the five grooves and their port channels
    c.fillStyle = C.bg2;
    c.fillRect(x0 + 20, y - rb, x1 - x0 - 40, 2 * rb);
    for (const k of [5, 4, 1, 2, 3]) {
      c.fillStyle = C.bg2; c.fillRect(X[k] - gw / 2, y - rg, gw, 2 * rg);
      c.fillRect(X[k] - gw * 0.3, UP[k] ? top : y, gw * 0.6, UP[k] ? y - top : bot - y);
      if (o.fill && o.fill[k]) { c.fillStyle = o.fill[k]; c.fillRect(X[k] - gw / 2, y - rg, gw, 2 * rg); c.fillRect(X[k] - gw * 0.3, UP[k] ? top : y, gw * 0.6, UP[k] ? y - top : bot - y); }
      kit.label(c, String(k), X[k], UP[k] ? top - 10 : bot + 11, { color: C.text, size: 12, weight: 700, align: 'center' });
    }
    c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(x0, top, x1 - x0, bot - top);
    // the spool: a rod with three lands, moving right by d
    const sx = o.d * px;
    c.fillStyle = C.muted; c.fillRect(x0 + 6 + sx, y - 5, x1 - x0 - 80, 10);
    for (const f of [-2.5, -0.5, 1.5]) {
      const cx = o.x + f * P + sx;
      c.fillStyle = C.text; c.fillRect(cx - lw / 2, y - rb + 1, lw, 2 * rb - 2);
    }
    // the spring on the right and the actuator on the left
    S.zigzag(c, x1 - 74 + sx, y, x1 - 3, y, 8, 4, C.text);
    if (o.left === 'pilot') {
      c.fillStyle = o.pilotFill || C.bg2; c.fillRect(x0 - 34, y - 26, 34, 52);
      c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(x0 - 34, y - 26, 34, 52);
      c.fillStyle = C.text; c.fillRect(x0 - 26 + sx * 0.9, y - 24, 8, 48);
    } else {
      c.fillStyle = C.text; c.fillRect(x0 - 16 + sx, y - 4, 22, 8);
      c.beginPath(); c.arc(x0 - 22 + sx, y, 12, Math.PI / 2, 3 * Math.PI / 2); c.fill();
    }
    return { X, top, bot, y };
  }

  Hyper.sim('valve-poppet-spool', {
    title: 'Poppet and spool valves in section',
    blurb: `Two ways to open and close an air path. A **poppet** lifts a disc off a seat: a short stroke, a rubber face that seals completely and shrugs off dirt, but the supply pressure pushes on the disc, so the operating force grows with the seat size. A **spool** slides lands past port grooves: longer stroke, forces balanced by the pressure, one body for 3, 4 or 5 ports — but it either rubs on seals or leaks through a few micrometres of clearance. The graph shows how much each path is open along the travel; the symbol on the right shifts with the section.

**Try this**
- Poppet: watch the stem meet the disc. The exhaust 2→3 closes first, then the supply 1→2 opens: there is never a moment when supply blows straight to exhaust.
- Read the operating force of the poppet, then raise the supply pressure: the button gets harder to press. The spool's force does not change.
- Spool with positive overlap: in mid-travel every path is shut for a moment. With negative overlap supply air blows straight through to exhaust while the spool passes the middle — read the exhaust flow.
- Compare the travel needed to open fully: about a millimetre for the poppet, several for the spool.
- Choose the lapped metal spool: no seal friction, but a steady leak at rest of about a litre a minute.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const gdiv = document.createElement('div'); gdiv.style.padding = '4px 10px 10px'; box.stage.appendChild(gdiv);
      let auto = true, u = 0, tAuto = 0;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Valve', options: [['Poppet valve, 3/2 normally closed', 'poppet'], ['Spool valve, 5/2, soft seals', 'soft'], ['Spool valve, 5/2, lapped metal spool', 'metal']], value: 'poppet' },
        { id: 'lap', type: 'select', label: 'Spool overlap', options: [['Positive (all closed in mid-travel)', 'pos'], ['Zero', 'zero'], ['Negative (all open in mid-travel)', 'neg']], value: 'pos' },
        { id: 'auto', type: 'check', label: 'Switch back and forth', value: true },
        { id: 'u', label: 'Actuator travel', min: 0, max: 100, step: 1, value: 0, unit: '%' },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 1, max: 10, step: 0.5, value: 6, unit: 'bar' },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25], ['Slow motion 1/10', 0.1]], value: 0.25 }
      ], (id, v) => {
        if (id === 'u') { auto = false; ctl.set('auto', false); u = v / 100; }
        if (id === 'auto') { auto = v; tAuto = 0; }
        if (id === 'type' || id === 'lap') { curves(); ctl.show('lap', V.type !== 'poppet'); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['paths', 'Open paths'], ['open', 'Open areas'], ['force', 'Force to hold it at this travel'], ['flow', 'Air from supply / to exhaust'], ['p', 'Outputs (gauge)'], ['leak', 'Leakage at rest']]);
      const plot = kit.plot(gdiv, { x: { label: 'actuator travel (mm)' }, y: { label: 'open area (mm²)', min: 0 }, legend: true }, 150);
      const s = { p2: PATM, p4: PATM, m12: 0, m14: 0, m23: 0, m45: 0, ph: {} };
      let series = [];
      const full = () => V.type === 'poppet' ? PP.travel : SP.pitch;
      function curves() {
        const lap = LAPS[V.lap] || 0, pts = { a: [], b: [] };
        for (let i = 0; i <= 120; i++) {
          const d = full() * i / 120;
          if (V.type === 'poppet') { const r = poppetOpen(d); pts.a.push([d, r.a12]); pts.b.push([d, r.a23]); }
          else { const r = spoolOpen(d, lap); pts.a.push([d, r.a12]); pts.b.push([d, r.a14]); }
        }
        series = V.type === 'poppet' ? [{ pts: pts.a, label: 'supply 1 → 2' }, { pts: pts.b, label: 'exhaust 2 → 3', dash: [5, 4] }]
          : [{ pts: pts.a, label: '1 → 2 and 4 → 5 (closing)' }, { pts: pts.b, label: '1 → 4 and 2 → 3 (opening)', dash: [5, 4] }];
        s.p2 = s.p4 = PATM;
      }
      curves(); ctl.show('lap', false);
      let tPlot = 1;
      const lmin = m => (Math.abs(m) / RHO0 * 60000).toFixed(0);
      const loop = kit.loop((dt) => {
        const sdt = Math.min(dt, 0.05) * V.slow;
        if (auto) {
          tAuto = (tAuto + sdt) % 4;
          const q = tAuto;
          u = q < 1.2 ? 0 : q < 1.8 ? (q - 1.2) / 0.6 : q < 3.2 ? 1 : q < 3.8 ? 1 - (q - 3.2) / 0.6 : 0;
        }
        const ps = V.ps * 1e5 + PATM, d = u * full(), lap = LAPS[V.lap] || 0, poppet = V.type === 'poppet';
        const o = poppet ? poppetOpen(d) : spoolOpen(d, lap);
        // the output volumes (15 cm³ each: channel, tube and a little more) filled and emptied through the open paths
        const n = Math.max(1, Math.ceil(sdt / 2e-5)), h = sdt / n, Vol = 15e-6, avg = { m12: 0, m14: 0, m23: 0, m45: 0 };
        for (let k = 0; k < n; k++) {
          s.m12 = mflow(F, areaC(o.a12), 0.3, ps, s.p2); s.m23 = mflow(F, areaC(o.a23), 0.3, s.p2, PATM);
          s.p2 = Math.max(PATM * 0.9, s.p2 + h * GAM * RG * T0 * (s.m12 - s.m23) / Vol);
          if (!poppet) {
            s.m14 = mflow(F, areaC(o.a14), 0.3, ps, s.p4); s.m45 = mflow(F, areaC(o.a45), 0.3, s.p4, PATM);
            s.p4 = Math.max(PATM * 0.9, s.p4 + h * GAM * RG * T0 * (s.m14 - s.m45) / Vol);
          } else { s.m14 = s.m45 = 0; s.p4 = PATM; }
          for (const key in avg) avg[key] += s[key] / n;
        }
        Object.assign(s, avg);                      // flows averaged over the frame (the last sub-step can chatter near equilibrium)
        const pg2 = s.p2 - PATM, pg4 = s.p4 - PATM, supply = s.m12 + s.m14, exhaust = s.m23 + s.m45;
        // read-outs
        const open = [];
        const add = (a, name) => { if (a > 0.05) open.push(name); };
        add(o.a12, '1→2'); add(o.a23, '2→3'); if (!poppet) { add(o.a14, '1→4'); add(o.a45, '4→5'); }
        ro.set('paths', open.length ? open.join(', ') : 'none: every path is shut');
        ro.set('open', poppet ? o.a12.toFixed(1) + ' / ' + o.a23.toFixed(1) + ' mm²  (1→2 / 2→3)' : o.a12.toFixed(1) + ' / ' + o.a14.toFixed(1) + ' mm²  (1→2 / 1→4)');
        let force;
        if (poppet) force = 2 + 1.5 * d + (o.lift > 0 || d >= PP.gap ? V.ps * 1e5 * Math.PI * Math.pow(PP.seat / 1000, 2) / 4 + 3 + 2 * o.lift : 0);
        else force = 8 + 2 * d + (V.type === 'soft' ? 6 : 1);
        ro.set('force', force.toFixed(1) + ' N' + (poppet ? (d >= PP.gap ? ' (pressure on the seat + springs)' : ' (stem spring only)') : ' (spring + ' + (V.type === 'soft' ? 'seal' : 'slight') + ' friction; pressures balance)'));
        ro.set('flow', lmin(supply) + ' / ' + lmin(exhaust) + ' L/min ANR' + ((o.a12 > 0 && o.a23 > 0) || (o.a14 > 0 && o.a45 > 0) ? '  (supply blowing straight to exhaust!)' : ''));
        ro.set('p', poppet ? '2: ' + (pg2 / 1e5).toFixed(2) + ' bar' : '2: ' + (pg2 / 1e5).toFixed(2) + ' bar, 4: ' + (pg4 / 1e5).toFixed(2) + ' bar');
        if (V.type === 'metal') {
          const mu = 1.81e-5, cl = 4e-6, Ls = 1e-3, Dm = SP.D / 1000;
          const leak = 2 * Math.PI * Dm * cl * cl * cl * (ps * ps - PATM * PATM) / (24 * mu * RG * T0 * Ls) / RHO0 * 60000;
          ro.set('leak', leak.toFixed(2) + ' L/min ANR through the clearances (4 µm radial, 2 lands)');
        } else ro.set('leak', poppet ? 'none: elastomer face on the seat' : 'none: elastomer seals on the lands, at the cost of friction');
        tPlot += dt;
        if (tPlot > 0.1) { tPlot = 0; plot.set({ series, vlines: [{ x: d, label: d.toFixed(2) + ' mm' }], x: { label: 'actuator travel (mm)', min: 0, max: full() } }); }
        // ---- drawing on a 760 × 380 design grid
        const c = st.begin(), C = kit.colors(), k = Math.min(st.W / 760, st.H / 380);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 380 * k) / 2); c.scale(k, k);
        const pmax = V.ps * 1e5, exCol = C.dark ? 'rgba(156,195,255,.35)' : 'rgba(107,156,224,.35)';
        const adv = (key, m) => { s.ph[key] = (s.ph[key] || 0) + dt * 60 * Math.min(2.5, Math.abs(m) / (RHO0 * 2e-8 * ps)); return s.ph[key]; };
        if (poppet) {
          const cx = 250, pxm = 12, lift = o.lift * pxm, tip = 216 - PP.gap * pxm + d * pxm;
          c.fillStyle = C.surface; c.fillRect(150, 70, 200, 260);
          c.save(); c.beginPath(); c.rect(150, 70, 200, 260); c.clip(); c.strokeStyle = C.faint || C.muted; c.lineWidth = 1;
          for (let hx = 10; hx < 360; hx += 12) { c.beginPath(); c.moveTo(hx, 330); c.lineTo(hx + 260, 70); c.stroke(); }
          c.restore();
          const f1 = airFill(C, pmax, pmax), f2 = airFill(C, pg2, pmax);
          const cav = (x, y, w, hh, f) => { c.fillStyle = C.bg2; c.fillRect(x, y, w, hh); if (f) { c.fillStyle = f; c.fillRect(x, y, w, hh); } };
          cav(185, 216, 130, 76, f1); cav(230, 292, 40, 38, f1);                                 // chamber 1 and its port
          cav(190, 110, 120, 90, f2); cav(310, 140, 40, 30, f2);                                 // chamber 2 and its port
          cav(cx - PP.seat * pxm / 2, 200, PP.seat * pxm, 16, f2);                               // the seat hole
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(150, 70, 200, 260);
          // disc and its spring
          c.fillStyle = C.text; c.fillRect(cx - 45, 216 + lift, 90, 12);
          c.fillStyle = C.bad; c.fillRect(cx - 34, 216 + lift, 68, 3);
          S.zigzag(c, cx, 228 + lift, cx, 290, 12, 4, C.text);
          // the hollow stem, its button and return spring
          const sw = PP.stem * pxm, bw = PP.bore * pxm, stTop = 30 + d * pxm;
          c.fillStyle = C.text; c.fillRect(cx - sw / 2, stTop, sw, tip - stTop);
          c.fillStyle = o.a23 > 0.05 && s.m23 > 1e-5 ? exCol : C.bg2; c.fillRect(cx - bw / 2, stTop + 12, bw, tip - stTop - 12);
          c.fillStyle = C.bg2; c.fillRect(cx - sw / 2 - 1, stTop + 14, sw / 2 - bw / 2 + 1, 8);   // the side hole: port 3
          c.fillStyle = C.text; c.beginPath(); c.ellipse(cx, stTop, 30, 11, 0, Math.PI, 2 * Math.PI); c.fill(); c.fillRect(cx - 30, stTop - 1, 60, 5);
          S.zigzag(c, cx + 22, stTop + 4, cx + 22, 70, 5, 4, C.text);
          kit.label(c, '1', 250, 346, { color: C.text, size: 13, weight: 700, align: 'center' });
          kit.label(c, '2', 364, 155, { color: C.text, size: 13, weight: 700, align: 'center' });
          kit.label(c, '3', cx - 34, stTop + 18, { color: C.text, size: 13, weight: 700, align: 'right' });
          kit.label(c, 'seat Ø ' + PP.seat + ' mm', 400, 208, { color: C.muted, size: 11 });
          kit.label(c, 'lift ' + o.lift.toFixed(2) + ' mm', 400, 226, { color: C.muted, size: 11 });
          if (s.m12 > 1e-5) { S.flow(c, [[250, 330], [250, 296]], adv('p1', s.m12), { color: S.col('air') }); S.flow(c, [[310, 155], [350, 155]], adv('p2', s.m12), { color: S.col('air') }); }
          if (s.m23 > 1e-5) S.flow(c, [[cx, tip - 2], [cx, stTop + 18], [cx - 40, stTop + 18]], adv('p3', s.m23), { color: S.col('exhaust') });
        } else {
          const fill = { 1: airFill(C, pmax, pmax), 2: airFill(C, pg2, pmax), 4: airFill(C, pg4, pmax), 3: s.m23 > 1e-5 ? exCol : null, 5: s.m45 > 1e-5 ? exCol : null };
          const g = drawSpool(c, kit, S, { x: 250, y: 175, px: 13, lap, d, fill, left: 'button' });
          const path = (a, b) => [[g.X[a], a === 4 || a === 2 ? g.top : g.bot], [g.X[a], g.y], [g.X[b], g.y], [g.X[b], b === 4 || b === 2 ? g.top : g.bot]];
          if (s.m12 > 1e-5) S.flow(c, path(1, 2), adv('s12', s.m12), { color: S.col('air') });
          if (s.m14 > 1e-5) S.flow(c, path(1, 4), adv('s14', s.m14), { color: S.col('air') });
          if (s.m23 > 1e-5) S.flow(c, path(2, 3), adv('s23', s.m23), { color: S.col('exhaust') });
          if (s.m45 > 1e-5) S.flow(c, path(4, 5), adv('s45', s.m45), { color: S.col('exhaust') });
          kit.label(c, 'travel ' + d.toFixed(2) + ' mm of ' + SP.pitch + ' mm', 250, 290, { color: C.muted, size: 11, align: 'center' });
          kit.label(c, 'lap ' + (lap > 0 ? '+' : '') + lap.toFixed(1) + ' mm', 250, 306, { color: C.muted, size: 11, align: 'center' });
        }
        // the symbol, shifting with the section
        const sym = S.valve(c, 620, 170, { spec: poppet ? '3/2 NC' : '5/2', state: 1 - u, left: 'pushbutton', right: 'spring', s: 38, pneumatic: true, labels: true, exhaust: true });
        kit.label(c, poppet ? 'poppet 3/2 NC' : 'spool 5/2', 620, sym.top - 30, { color: C.text, size: 12, weight: 700, align: 'center' });
        kit.label(c, 'the same valve as a symbol', 620, sym.bottom + 44, { color: C.muted, size: 11, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ valve-solenoid-timing */
  /* A pilot-operated 5/2 valve. A 24 V DC coil (time constant L/R = 3 ms) pulls an armature that lifts a 0.8 mm pilot
     seat; pilot air fills a 12 mm piston that shifts the main spool (4 mm) against its spring and seal friction. The magnet
     force goes with the square of the current and with the coil power; with the armature closed it holds three times as hard. */
  const SOL = { U: 24, tau: 3e-3, aF: 2.4, hold: 3, Fsp: 0.7, seatA: Math.PI * 0.8e-3 * 0.8e-3 / 4, tArm: 0.8e-3,
    Cp: 0.06e-8, Cpx: 0.15e-8, Vp: 0.4e-6, Ap: Math.PI * 0.012 * 0.012 / 4, ms: 0.025, stroke: 4e-3, F0: 14, kS: 1500, ff: 5, cv: 8 };
  function solenoidRun(F, o) {
    const R = SOL.U * SOL.U / o.P, I = SOL.U / R, L = SOL.tau * R, pPil = o.ext ? 6e5 + PATM : o.ps;
    const Fopen = i => SOL.aF * o.P * (i / I) * (i / I);
    const Fhold = SOL.Fsp + Math.max(0, pPil - PATM) * SOL.seatA;          // the pilot seat is held shut by its spring and the pilot pressure
    const dt = 2e-6, trace = [];
    let i = 0, arm = 0, pulled = false, pp = PATM, x = 0, v = 0, tPull = null, tRel = null, tOn = null, tOffEnd = null, maxX = 0, maxP = PATM, k = 0;
    for (let t = 0; t <= o.tEnd + 1e-12; t += dt, k++) {
      const on = t < o.tOff;
      // the coil: an RL circuit; switched off, the current keeps flowing through the diode (≈ 0.7 V) or the diode and a 36 V Zener
      if (on) i += dt * (SOL.U - i * R) / L;
      else i = Math.max(0, i - dt * (i * R + (o.zener ? 36.7 : 0.7)) / L);
      if (!pulled && on && Fopen(i) > Fhold) { pulled = true; if (tPull == null) tPull = t; }
      if (pulled && SOL.hold * Fopen(i) < SOL.Fsp) { pulled = false; if (tRel == null && !on) tRel = t - o.tOff; }
      arm = clamp(arm + (pulled ? 1 : -1) * dt / SOL.tArm, 0, 1);
      // the pilot chamber fills through the open pilot seat and vents through the pilot exhaust as it closes
      const Vp = SOL.Vp + SOL.Ap * x;
      const mIn = mflow(F, SOL.Cp * arm, 0.35, pPil, pp), mOut = mflow(F, SOL.Cpx * (1 - arm), 0.35, pp, PATM);
      pp = Math.max(PATM * 0.95, pp + dt * (GAM * RG * T0 * (mIn - mOut) - GAM * pp * SOL.Ap * v) / Vp);
      // the main spool: pilot force against the spring, Coulomb and viscous friction, end stops
      const Fn = (pp - PATM) * SOL.Ap - (SOL.F0 + SOL.kS * x);
      let a;
      if (Math.abs(v) < 1e-4 && Math.abs(Fn) <= SOL.ff) { a = 0; v = 0; } else a = (Fn - Math.sign(v || Fn) * SOL.ff - SOL.cv * v) / SOL.ms;
      v += a * dt; x += v * dt;
      if (x <= 0) { x = 0; if (v < 0) v = 0; }
      if (x >= SOL.stroke) { x = SOL.stroke; if (v > 0) v = 0; }
      maxX = Math.max(maxX, x); maxP = Math.max(maxP, pp);
      if (on && tOn == null && x >= 0.9 * SOL.stroke) tOn = t;
      if (!on && tOffEnd == null && maxX >= 0.9 * SOL.stroke && x <= 0.1 * SOL.stroke) tOffEnd = t - o.tOff;
      if (k % 50 === 0) trace.push([t * 1000, i * 1000, (pp - PATM) / 1e5, x / SOL.stroke, arm]);
    }
    return { R, I, L, trace, tPull, tRel, tOn, tOffEnd, maxX, maxP, pPil, pStart: (SOL.F0 + SOL.ff) / SOL.Ap, pFull: (SOL.F0 + SOL.kS * SOL.stroke + SOL.ff) / SOL.Ap };
  }

  Hyper.sim('valve-solenoid-timing', {
    title: 'A solenoid pilot valve switching, millisecond by millisecond',
    blurb: `A pilot-operated 5/2 valve on 24 V DC, switched on at 0 ms and off at 25 ms, shown in slow motion. The coil current rises with the time constant L/R; when the magnet force beats the pilot spring and the pressure on the tiny pilot seat, the armature lifts, pilot air fills the piston behind the main spool, and the spool shifts once the pilot force beats its spring and friction. Switching off runs the chain backwards: the current must decay, the armature drop, the pilot chamber empty, the spring push the spool home.

**Try this**
- Read the switch-on and switch-off times: each is several steps in a row, and together they are typically 5–30 ms.
- Change the suppression from the diode to diode + Zener: the current collapses faster and the valve switches off several milliseconds sooner.
- Lower the supply to 1.5 bar with the internal pilot: the pilot pressure cannot beat the spool spring and the valve does not switch. Choose external pilot air and it works again.
- Try a 0.5 W coil at 10 bar: the magnet can no longer lift the pilot seat against the pressure. That is where a valve's maximum pressure comes from.
- Stronger coils switch on sooner — but they cost power all the time they are on.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 250 });
      const gdiv = document.createElement('div'); gdiv.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px';
      box.stage.appendChild(gdiv);
      const gd = [0, 1, 2].map(() => { const d = document.createElement('div'); gdiv.appendChild(d); return d; });
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Coil power (24 V DC)', min: 0.5, max: 4, step: 0.1, value: 1.5, unit: 'W' },
        { id: 'ps', label: 'Supply pressure at port 1 (gauge)', min: 1, max: 10, step: 0.5, value: 6, unit: 'bar' },
        { id: 'pil', type: 'select', label: 'Pilot air', options: [['Internal, from port 1', 'int'], ['External, 6 bar (port 12/14)', 'ext']], value: 'int' },
        { id: 'sup', type: 'select', label: 'Coil suppression', options: [['Freewheeling diode', 'diode'], ['Diode + 36 V Zener', 'zener']], value: 'diode' },
        { id: 'rate', type: 'select', label: 'Slow motion', options: [['1 ms takes 0.1 s', 0.01], ['1 ms takes 0.25 s', 0.004], ['1 ms takes 1 s', 0.001]], value: 0.004 },
        { type: 'buttons', items: [{ id: 'replay', label: 'Replay', primary: true }] }
      ], (id) => { if (id === 'replay') tc = 0; else run(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['coil', 'Coil'], ['pull', 'Armature pulls in / drops out'], ['on', 'Switch-on time (90 % of spool travel)'], ['off', 'Switch-off time (back to 10 %)'], ['pmin', 'Pilot pressure the spool needs'], ['status', 'Result']]);
      const pl = [kit.plot(gd[0], { x: { label: 'time (ms)', min: 0, max: 50 }, y: { label: 'coil current (mA)', min: 0 } }, 110),
        kit.plot(gd[1], { x: { label: 'time (ms)', min: 0, max: 50 }, y: { label: 'pilot pressure (bar)', min: 0 } }, 110),
        kit.plot(gd[2], { x: { label: 'time (ms)', min: 0, max: 50 }, y: { label: 'spool travel (%)', min: 0, max: 100 } }, 110)];
      const T_OFF = 0.025, T_END = 0.05;
      let res, curves = [[], [], []], tc = 0, pause = 0, tPlot = 1;
      function run() {
        res = solenoidRun(F, { P: V.P, ps: V.ps * 1e5 + PATM, ext: V.pil === 'ext', zener: V.sup === 'zener', tOff: T_OFF, tEnd: T_END });
        const ms = x => x == null ? null : (x * 1000).toFixed(1) + ' ms';
        ro.set('coil', (res.I * 1000).toFixed(1) + ' mA, ' + res.R.toFixed(0) + ' Ω, L = ' + res.L.toFixed(2) + ' H, τ = L/R = 3.0 ms');
        ro.set('pull', (ms(res.tPull) || 'never') + ' / ' + (res.tPull == null ? '—' : ms(res.tRel) || 'later') + ' after switch-off');
        ro.set('on', ms(res.tOn) || 'did not switch');
        ro.set('off', ms(res.tOffEnd) || (res.tOn == null ? '—' : 'not back within 25 ms'));
        ro.set('pmin', 'starts to move at ' + (res.pStart / 1e5).toFixed(1) + ' bar, full travel at ' + (res.pFull / 1e5).toFixed(1) + ' bar (gauge)');
        let status;
        if (res.tPull == null) status = 'the magnet cannot lift the pilot seat against ' + ((res.pPil - PATM) / 1e5).toFixed(1) + ' bar: pressure too high for this coil';
        else if (res.maxX < 0.02 * SOL.stroke) status = 'pilot air at ' + ((res.pPil - PATM) / 1e5).toFixed(1) + ' bar cannot move the spool: use external pilot air';
        else if (res.maxX < 0.9 * SOL.stroke) status = 'the spool stops part-way: dangerous, both paths half open';
        else status = 'switches normally';
        ro.set('status', status);
        const col = (j, sc) => res.trace.map(r => [r[0], r[j] * (sc || 1)]);
        curves = [col(1), col(2), col(3, 100)];
        tPlot = 1;
      }
      run();
      const loop = kit.loop((dt) => {
        if (tc >= T_END * 1000) { pause += dt; if (pause > 1) { pause = 0; tc = 0; } }
        else tc = Math.min(T_END * 1000, tc + dt * V.rate * 1000);
        tPlot += dt;
        if (tPlot > 0.1) {
          tPlot = 0;
          const vl = [{ x: tc }, { x: T_OFF * 1000, label: 'off' }];
          pl[0].set({ series: [{ pts: curves[0], label: 'current' }], vlines: vl });
          pl[1].set({ series: [{ pts: curves[1], label: 'pilot' }], vlines: vl, hlines: [{ y: res.pFull / 1e5, label: 'full travel' }] });
          pl[2].set({ series: [{ pts: curves[2], label: 'spool' }], vlines: vl });
        }
        // the state at the cursor
        const tr = res.trace, j = clamp(Math.round(tc / (T_END * 1000) * (tr.length - 1)), 0, tr.length - 1), r = tr[j];
        const iNow = r[1] / 1000, pg = r[2] * 1e5, xf = r[3], arm = r[4], on = tc < T_OFF * 1000;
        // ---- drawing on a 760 × 340 design grid
        const c = st.begin(), C = kit.colors(), k = Math.min(st.W / 760, st.H / 340);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 340 * k) / 2); c.scale(k, k);
        const pilotFill = airFill(C, pg, 6e5), ppil = V.pil === 'ext' ? 6 : V.ps;
        // the pilot head: coil, armature, seat
        c.fillStyle = C.surface; c.fillRect(70, 20, 90, 100); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(70, 20, 90, 100);
        const heat = clamp(iNow / Math.max(res.I, 1e-6), 0, 1);
        c.fillStyle = 'rgba(229,72,77,' + (0.12 + 0.5 * heat).toFixed(3) + ')'; c.fillRect(76, 28, 22, 70); c.fillRect(132, 28, 22, 70);
        c.strokeStyle = C.text; c.lineWidth = 1;
        for (let yy = 32; yy < 98; yy += 6) { c.beginPath(); c.moveTo(76, yy); c.lineTo(98, yy + 4); c.moveTo(132, yy); c.lineTo(154, yy + 4); c.stroke(); }
        c.fillStyle = C.text; c.fillRect(104, 40 - arm * 8, 22, 60);
        c.fillStyle = C.bad; c.fillRect(106, 98 - arm * 8, 18, 3);
        kit.label(c, (iNow * 1000).toFixed(0) + ' mA', 115, 12, { color: on ? C.bad : C.muted, size: 11, weight: 700, align: 'center' });
        kit.label(c, 'coil ' + (on ? 'on' : 'off'), 170, 30, { color: on ? C.bad : C.muted, size: 11, weight: 700 });
        kit.label(c, 'armature ' + (arm > 0.5 ? 'up: pilot open' : 'down: pilot shut'), 170, 48, { color: C.muted, size: 11 });
        // pilot supply and pilot line to the piston
        S.line(c, [[20, 108], [70, 108]], { state: ppil >= 0.5 ? 'air' : 'idle' });
        kit.label(c, V.pil === 'ext' ? 'external pilot air, 6 bar' : 'pilot air from port 1: ' + V.ps.toFixed(1) + ' bar', 20, 132, { color: C.muted, size: 11 });
        S.line(c, [[115, 120], [115, 160], [135, 160], [135, 194]], { state: pg > 0.2e5 ? 'pilot' : 'idle', kind: 'pilot' });
        S.line(c, [[160, 108], [196, 108]], { state: arm < 0.5 && pg > 0.1e5 ? 'exhaust' : 'idle', kind: 'pilot' });
        S.exhaust(c, 196, 108, { rot: -90 });
        kit.label(c, 'pilot exhaust', 214, 108, { color: C.muted, size: 11 });
        // the main valve
        const d = xf * SOL.stroke * 1000, oa = spoolOpen(d, LAPS.pos), pmax = V.ps * 1e5;
        drawSpool(c, kit, S, { x: 330, y: 250, px: 11, lap: LAPS.pos, d, left: 'pilot', pilotFill, fill: { 1: airFill(C, pmax, pmax), 2: oa.a12 > 0 ? airFill(C, pmax, pmax) : null, 4: oa.a14 > 0 ? airFill(C, pmax, pmax) : null } });
        kit.label(c, 'pilot ' + (pg / 1e5).toFixed(2) + ' bar', 135, 322, { color: C.text, size: 11, weight: 700, align: 'center' });
        // the symbol
        S.valve(c, 650, 130, { spec: '5/2', state: 1 - xf, left: 'solenoid+pilot', right: 'spring', s: 34, pneumatic: true, labels: true, exhaust: 'silencer' });
        kit.label(c, 't = ' + tc.toFixed(1) + ' ms', 740, 250, { color: C.text, size: 14, weight: 700, align: 'right' });
        kit.label(c, 'spool ' + (xf * 100).toFixed(0) + ' %', 740, 272, { color: C.muted, size: 12, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ valve-flow-curve */
  // ISO 6358-1:2013 flow with the subsonic index m (m = 0.5 is the ellipse that kit.fluid.iso6358 computes); free air, m³/s ANR
  function isoFlow(F, C, b, m, p1, p2, T1) {
    const r = F.iso6358({ C, b, p1, p2, T1 });
    if (!(r.qANR > 0)) return 0;
    if (r.choked || Math.abs(m - 0.5) < 1e-9) return r.qANR;
    const q0 = F.iso6358({ C, b, p1, p2: 0, T1 }).qANR;
    return q0 * Math.pow(r.qANR / q0, 2 * m);
  }
  const SCFM = 0.028316846592 / 60 * 1.0288;       // m³/s ANR in one SCFM (as units.js)

  Hyper.sim('valve-flow-curve', {
    title: 'Flow through a valve: the ISO 6358 characteristic',
    blurb: `Air flows through a valve from an upstream pressure p₁ to a downstream pressure p₂. Lower p₂ and the flow grows — until the pressure ratio p₂/p₁ (absolute) falls to the critical ratio *b*. From there on the air reaches the speed of sound in the narrowest passage and the flow is **choked**: it depends only on p₁ (and its temperature), $Q = C\\,p_1$, however low p₂ goes. Above *b* the flow falls along a quarter-ellipse to zero at p₂ = p₁. Two numbers, C and b, describe a valve at every pair of pressures; the 2013 edition of ISO 6358-1 adds a subsonic index *m* for components whose curve is not quite an ellipse. The graph shows real flows; the inset the same curve as a fraction of the choked flow.

**Try this**
- Lower p₂ from p₁ towards zero and watch the flow level off at the critical ratio.
- Double C: every flow doubles. Change b: the choked flow stays, the subsonic part changes shape.
- Keep p₂ at 5 bar and raise p₁ from 6 to 8 bar: the flow grows more than in proportion — the pressure drop and the density both rise.
- Heat the upstream air to 80 °C: about 6 % less free air passes (the flow goes with √(293 K/T₁)).
- Read the rough equivalents: Cv ≈ C/4, and the nominal flow at 6 → 5 bar.
- For your own numbers use the [valve flow calculator](#/tools/pneu/valve).`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const gdiv = document.createElement('div'); gdiv.style.padding = '4px 10px 10px'; box.stage.appendChild(gdiv);
      const ctl = kit.controls(box.side, [
        { id: 'C', label: 'Sonic conductance C', min: 0.1, max: 10, value: 1.5, unit: 'dm³/(s·bar)', log: true, sig: 3 },
        { id: 'b', label: 'Critical pressure ratio b', min: 0.05, max: 0.6, step: 0.01, value: 0.3 },
        { id: 'm', label: 'Subsonic index m (0.5: ellipse)', min: 0.3, max: 0.8, step: 0.01, value: 0.5 },
        { id: 'p1', label: 'Upstream pressure p₁ (gauge)', min: 1, max: 10, step: 0.1, value: 6, unit: 'bar' },
        { id: 'p2', label: 'Downstream pressure p₂ (gauge)', min: 0, max: 10, step: 0.05, value: 4, unit: 'bar' },
        { id: 'T', label: 'Upstream air temperature', min: -10, max: 80, step: 1, value: 20, unit: '°C' }
      ], () => { dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['q', 'Flow (free air)'], ['r', 'Pressure ratio p₂/p₁ (absolute)'], ['md', 'Mass flow'], ['qc', 'Choked flow at this p₁'], ['qn', 'Nominal flow (6 → 5 bar)'], ['eq', 'Rough equivalents']]);
      const plot = kit.plot(gdiv, { x: { label: 'downstream pressure p₂ (bar, gauge)', min: 0 }, y: { label: 'flow (L/min ANR)', min: 0 } }, 190);
      let dirty = true, phase = 0;
      const loop = kit.loop((dt) => {
        const C = V.C * 1e-8, T1 = V.T + 273.15, p1 = V.p1 * 1e5 + PATM, p2 = Math.min(V.p2, V.p1) * 1e5 + PATM;
        const q = isoFlow(F, C, V.b, V.m, p1, p2, T1), qc = isoFlow(F, C, V.b, V.m, p1, 0, T1), r = p2 / p1, choked = r <= V.b;
        if (dirty) {
          dirty = false;
          const curve = (pg, n) => { const pts = []; const pa = pg * 1e5 + PATM; for (let i = 0; i <= n; i++) { const x = pg * i / n; pts.push([x, isoFlow(F, C, V.b, V.m, pa, x * 1e5 + PATM, T1) * 60000]); } return pts; };
          const Cm = kit.colors();
          const series = [2, 4, 6, 8, 10].filter(pg => Math.abs(pg - V.p1) > 0.05).map(pg => ({ pts: curve(pg, 80), color: Cm.muted, dash: [3, 4] }));
          series.push({ pts: curve(V.p1, 160), label: 'p₁ = ' + V.p1.toFixed(1) + ' bar', color: Cm.accent });
          const pCh = V.b * p1 - PATM;
          plot.set({ series, marks: [{ x: Math.min(V.p2, V.p1), y: q * 60000, label: (q * 60000).toFixed(0) + ' L/min' }], vlines: pCh > 0 ? [{ x: pCh / 1e5, label: 'choked below' }] : [], x: { label: 'downstream pressure p₂ (bar, gauge)', min: 0, max: 10 } });
          ro.set('q', (q * 60000).toFixed(0) + ' L/min ANR  (' + (q / SCFM).toFixed(1) + ' SCFM)');
          ro.set('r', r.toFixed(3) + (V.p2 >= V.p1 ? ' — no pressure difference, no flow' : choked ? ' ≤ b: choked (sonic in the valve)' : ' > b: subsonic'));
          ro.set('md', (q * RHO0 * 1000).toFixed(2) + ' g/s');
          ro.set('qc', (qc * 60000).toFixed(0) + ' L/min ANR = C × p₁' + (Math.abs(V.T - 20) > 0.5 ? ' × √(293 K/T₁)' : ''));
          const qn = isoFlow(F, C, V.b, V.m, 7.013e5, 6.013e5, T0);
          ro.set('qn', (qn * 60000).toFixed(0) + ' L/min ANR');
          const Cv = V.C / 4;
          ro.set('eq', 'Cv ≈ ' + Cv.toFixed(2) + ', Kv ≈ ' + (0.865 * Cv).toFixed(2) + ' m³/h, effective area ≈ ' + (5 * V.C).toFixed(1) + ' mm² (Ø ' + Math.sqrt(4 * 5 * V.C / Math.PI).toFixed(1) + ' mm nozzle)');
        }
        // ---- drawing on a 760 × 320 design grid
        const c = st.begin(), Cc = kit.colors(), k = Math.min(st.W / 760, st.H / 320);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 320 * k) / 2); c.scale(k, k);
        const v = S.valve(c, 130, 190, { spec: '2/2 NC', state: 0, left: 'solenoid', right: 'spring', s: 36, pneumatic: true, labels: true });
        const up = [[130, 280], [130, 260], v.P], dn = [v.A, [130, 110], [130, 96]];
        S.line(c, up, { state: 'air' }); S.line(c, dn, { state: q > 0 ? 'air' : 'idle' });
        S.line(c, [[130, 240], [80, 240], [80, 231]], { state: 'air' }); S.junction(c, 130, 240);
        S.line(c, [[130, 130], [180, 130], [180, 121]], { state: q > 0 ? 'air' : 'idle' }); S.junction(c, 130, 130);
        S.gauge(c, 80, 210, { frac: V.p1 / 10, value: 'p₁ ' + V.p1.toFixed(1) + ' bar' });
        S.gauge(c, 180, 100, { frac: Math.min(V.p2, V.p1) / 10, value: 'p₂ ' + Math.min(V.p2, V.p1).toFixed(1) + ' bar' });
        S.throttle(c, 130, 80, { adjustable: true });
        S.exhaust(c, 130, 64, { rot: 180 });
        S.source(c, 130, 300, { pneumatic: true });
        phase += dt * 90 * Math.min(2, q / Math.max(1e-9, C * 7e5));
        if (q > 0) S.flow(c, [[130, 280], [130, v.P[1]], [130, v.A[1]], [130, 96]], phase, { color: S.col('air') });
        kit.label(c, choked ? 'choked: sonic in the valve' : q > 0 ? 'subsonic' : 'no flow', 200, 190, { color: choked ? Cc.warn : Cc.muted, size: 12, weight: 700 });
        kit.label(c, 'downstream throttle sets p₂', 150, 44, { color: Cc.muted, size: 11 });
        // inset: the normalised characteristic, flow / choked flow against p₂/p₁
        const X0 = 400, Y0 = 270, W = 320, Hh = 220;
        c.strokeStyle = Cc.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(X0, Y0 - Hh); c.lineTo(X0, Y0); c.lineTo(X0 + W, Y0); c.stroke();
        if (V.b > 0) { c.fillStyle = Cc.dark ? 'rgba(224,160,48,.10)' : 'rgba(224,160,48,.14)'; c.fillRect(X0, Y0 - Hh, W * V.b, Hh); }
        c.strokeStyle = Cc.accent; c.lineWidth = 2.2; c.beginPath();
        for (let i = 0; i <= 100; i++) {
          const rr = i / 100, phi = rr <= V.b ? 1 : Math.pow(Math.max(0, 1 - Math.pow((rr - V.b) / (1 - V.b), 2)), V.m);
          const X = X0 + W * rr, Y = Y0 - Hh * phi;
          if (i) c.lineTo(X, Y); else c.moveTo(X, Y);
        }
        c.stroke();
        const phiNow = qc > 0 ? q / qc : 0;
        kit.dot(c, X0 + W * Math.min(1, r), Y0 - Hh * phiNow, 5, Cc.bad);
        kit.label(c, 'b = ' + V.b.toFixed(2), X0 + W * V.b, Y0 + 14, { color: Cc.warn, size: 11, align: 'center' });
        kit.label(c, '0', X0, Y0 + 14, { color: Cc.muted, size: 11, align: 'center' });
        kit.label(c, '1', X0 + W, Y0 + 14, { color: Cc.muted, size: 11, align: 'center' });
        kit.label(c, 'p₂/p₁ (absolute)', X0 + W / 2, Y0 + 32, { color: Cc.muted, size: 11, align: 'center' });
        kit.label(c, 'Q / Q_choked', X0 + 6, Y0 - Hh - 12, { color: Cc.muted, size: 11 });
        kit.label(c, 'choked', X0 + W * V.b / 2, Y0 - Hh + 16, { color: Cc.warn, size: 11, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ valve-sizing */
  // a tube as a restriction: compressible flow with wall friction (Fanno), choked at its outlet; C in m³/(s·Pa)
  function tubeC(F, L, d) {
    if (!(L > 0)) return Infinity;
    const A = Math.PI * d * d / 4, g = GAM, p0 = 7e5;
    const fanno = M => (1 - M * M) / (g * M * M) + (g + 1) / (2 * g) * Math.log((g + 1) * M * M / (2 + (g - 1) * M * M));
    let f = 0.02, C = 0;
    for (let it = 0; it < 6; it++) {
      const K = f * L / d;
      let lo = 1e-4, hi = 1;
      for (let j = 0; j < 50; j++) { const m = (lo + hi) / 2; if (fanno(m) > K) lo = m; else hi = m; }
      const M = (lo + hi) / 2, md = A * p0 * Math.sqrt(g / (RG * T0)) * M * Math.pow(1 + (g - 1) / 2 * M * M, -(g + 1) / (2 * (g - 1)));
      C = md / (RHO0 * p0);
      const fr = F.friction(md / A * d / 1.81e-5, 1.5e-6 / d);
      if (Number.isFinite(fr) && fr > 0) f = fr;
    }
    return C;
  }
  // typical sonic conductance of a directional valve by its port size (rounded, for comparison only)
  const SIZES = [['M5', 0.35], ['G1/8', 1.6], ['G1/4', 3.5], ['G3/8', 6], ['G1/2', 10], ['G3/4', 16]];

  Hyper.sim('valve-sizing', {
    title: 'Sizing a valve for a stroke time',
    blurb: `How big must the valve be for this cylinder to finish its stroke in time? Each point of the graph is a full simulation of the extending stroke (kit.fluid.pneuCylinder: chambers filling and emptying by ISO 6358, the load, the mass, friction) with a valve of that sonic conductance, in series with the tube to the cylinder and the tube back — so the time includes the pressure build-up before the piston moves. Where the curve crosses your target time is the conductance the valve needs; add a margin and pick the next size up. The quick rule beside it: choked exhaust gives a running speed $v \\approx C\\,p_\\text{ref}/A$, so aim for about 1.5 times the average speed.

**Try this**
- Halve the target time: the valve needed grows by more than twice — the start-up delay does not shrink with it.
- Lengthen the tubes to 5 m with a 4 mm bore: past some point no valve helps, because the tubes are the bottleneck (conductances in series).
- Load the cylinder to 60 % of its force: it needs a bigger valve for the same time.
- Compare the quick rule with the simulation for a short stroke: the rule forgets the time to build pressure.
- Watch the cylinder below run with the valve suggested.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const gdiv = document.createElement('div'); gdiv.style.padding = '4px 10px 10px'; box.stage.appendChild(gdiv);
      const ctl = kit.controls(box.side, [
        { id: 'bore', type: 'select', label: 'Cylinder', options: Object.keys(BORES).map(b => [b + ' mm bore, ' + BORES[b] + ' mm rod', +b]), value: 50 },
        { id: 'stroke', label: 'Stroke', min: 25, max: 1000, step: 5, value: 300, unit: 'mm', log: true },
        { id: 'tt', label: 'Target stroke time', min: 0.05, max: 3, value: 0.6, unit: 's', log: true, sig: 2 },
        { id: 'mass', label: 'Moving mass', min: 0.1, max: 50, value: 5, unit: 'kg', log: true, sig: 2 },
        { id: 'lr', label: 'Load (share of the force)', min: 0, max: 70, step: 5, value: 30, unit: '%' },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 3, max: 8, step: 0.5, value: 6, unit: 'bar' },
        { id: 'tl', label: 'Tube length, each way', min: 0, max: 5, step: 0.1, value: 1, unit: 'm' },
        { id: 'td', type: 'select', label: 'Tube bore', options: [['2.5 mm (4 mm tube)', 2.5], ['4 mm (6 mm tube)', 4], ['5.5 mm (8 mm tube)', 5.5], ['7.5 mm (10 mm tube)', 7.5]], value: 5.5 },
        { id: 'mg', label: 'Margin on the conductance', min: 0, max: 100, step: 5, value: 25, unit: '%' }
      ], () => reset());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['avg', 'Average speed needed'], ['tube', 'Each tube as a restriction'], ['rule', 'Quick rule (1.5 × average speed)'], ['sim', 'Simulation: valve C for the target'], ['pick', 'With margin: choose'], ['demo', 'Stroke time with that choice']]);
      const plot = kit.plot(gdiv, { x: { label: 'valve sonic conductance C (dm³/(s·bar))', log: true, min: 0.05, max: 30 }, y: { label: 'extend stroke time (s)', min: 0 } }, 180);
      const NG = 18, grid = Array.from({ length: NG }, (_, i) => 0.05 * Math.pow(600, i / (NG - 1)));
      let times = [], next = 0, Ct = Infinity, need = null, pick = null, demo = null, demoInfo = { t0: 0, last: null, cmd: 1, wait: 0 }, t = 0;
      const geom = () => {
        const bore = V.bore / 1000, rod = BORES[V.bore] / 1000, AA = Math.PI * bore * bore / 4;
        return { bore, rod, AA, AB: AA - Math.PI * rod * rod / 4, stroke: V.stroke / 1000, ps: V.ps * 1e5, tubeV: V.tl * Math.PI * Math.pow(V.td / 1000, 2) / 4 };
      };
      const makeCyl = (Cvalve) => {
        const g = geom();
        return F.pneuCylinder({ bore: g.bore, rod: g.rod, stroke: g.stroke, mass: V.mass, load: V.lr / 100 * g.ps * g.AA, psupply: g.ps + PATM, patm: PATM,
          Cvalve: series(Cvalve * 1e-8, Ct), bvalve: 0.3, CthrottleA: 1, CthrottleB: 1, dead: 5e-6 + g.tubeV, fc: 8 + 0.03 * g.ps * g.AA, fv: 50 });
      };
      function strokeTime(Cv) {
        const cyl = makeCyl(Cv), L = cyl.params.stroke;
        let tt = 0;
        while (tt < 5 && cyl.state.x < L - 1e-6) { cyl.step(0.002, 1); tt += 0.002; }
        return tt >= 5 ? null : tt;
      }
      function reset() { Ct = tubeC(F, V.tl, V.td / 1000); times = []; next = 0; need = pick = null; demo = null; }
      reset();
      const loop = kit.loop((dt) => {
        // four simulated strokes per frame until the curve is complete
        for (let j = 0; j < 4 && next < NG; j++, next++) times[next] = strokeTime(grid[next]);
        const g = geom(), done = next >= NG;
        const vbar = g.stroke / V.tt, Cpath = g.AB * 1.5 * vbar / 1e5;
        ro.set('avg', vbar.toFixed(2) + ' m/s');
        ro.set('tube', Number.isFinite(Ct) ? 'C ≈ ' + (Ct * 1e8).toFixed(2) + ' dm³/(s·bar) (' + V.tl.toFixed(1) + ' m × ' + V.td + ' mm bore)' : 'no tube');
        const ruleValve = Ct > Cpath ? 1 / Math.sqrt(1 / (Cpath * Cpath) - (Number.isFinite(Ct) ? 1 / (Ct * Ct) : 0)) : null;
        ro.set('rule', 'path C = A₂ v / p_ref = ' + (Cpath * 1e8).toFixed(2) + (ruleValve ? ', valve ' + (ruleValve * 1e8).toFixed(2) + ' dm³/(s·bar)' : ': more than the tubes can pass'));
        if (done && need == null) {
          const ok = times.map(x => x != null && x <= V.tt);
          const i = ok.indexOf(true);
          if (i < 0) need = { none: true };
          else if (i === 0) need = { C: grid[0] };
          else {
            const a = times[i - 1], b = times[i];
            const la = a == null ? Math.log(5) : Math.log(a), lb = Math.log(b), w = (Math.log(V.tt) - la) / (lb - la);
            need = { C: Math.exp(Math.log(grid[i - 1]) + clamp(w, 0, 1) * (Math.log(grid[i]) - Math.log(grid[i - 1]))) };
          }
          if (!need.none) {
            const want = need.C * (1 + V.mg / 100);
            pick = SIZES.find(sz => sz[1] >= want) || null;
            demo = makeCyl(pick ? pick[1] : want); demoInfo = { t0: 0, last: null, cmd: 1, wait: 0, t: 0 };
          }
          const pts = []; times.forEach((x, k) => { if (x != null) pts.push([grid[k], x]); });
          const vl = SIZES.map(sz => ({ x: sz[1], label: sz[0] }));
          plot.set({ series: [{ pts, label: 'simulated stroke time', dots: 3 }], hlines: [{ y: V.tt, label: 'target ' + V.tt.toFixed(2) + ' s' }], vlines: vl,
            marks: need.none ? [] : [{ x: need.C, y: V.tt, label: 'needs ' + need.C.toFixed(2) }] });
        }
        if (!done) { ro.set('sim', 'simulating… ' + Math.round(100 * next / NG) + ' %'); ro.set('pick', '—'); ro.set('demo', '—'); }
        else if (need.none) {
          const best = times[NG - 1];
          ro.set('sim', 'not reachable: even C = 30 gives ' + (best == null ? 'more than 5 s' : best.toFixed(2) + ' s'));
          ro.set('pick', Number.isFinite(Ct) && Ct * 1e8 < 3 * Cpath * 1e8 ? 'shorten or widen the tubes first' : 'more force (pressure, bore) or less mass');
          ro.set('demo', '—');
        } else {
          ro.set('sim', need.C.toFixed(2) + ' dm³/(s·bar)');
          ro.set('pick', (need.C * (1 + V.mg / 100)).toFixed(2) + ' → ' + (pick ? 'a ' + pick[0] + ' valve (typically C ≈ ' + pick[1] + ')' : 'larger than G3/4: use two valves or a bigger drive'));
          ro.set('demo', demoInfo.last != null ? demoInfo.last.toFixed(2) + ' s (target ' + V.tt.toFixed(2) + ' s)' : 'running…');
        }
        // the demonstration cylinder, cycling in real time with the suggested valve
        if (demo) {
          const L = demo.params.stroke, sdt = Math.min(dt, 0.05);
          const atEnd = demoInfo.cmd === 1 ? demo.state.x >= L - 1e-6 : demo.state.x <= 1e-6;
          if (atEnd) { demoInfo.wait += sdt; if (demoInfo.wait > 0.4) { demoInfo.cmd = 1 - demoInfo.cmd; demoInfo.wait = 0; demoInfo.t0 = demoInfo.t; } }
          demo.step(sdt, demoInfo.cmd); demoInfo.t += sdt;
          if (demoInfo.cmd === 1 && demo.state.x >= L - 1e-6 && demoInfo.wait === 0) demoInfo.last = demoInfo.t - demoInfo.t0;
        }
        t += dt;
        // ---- drawing on a 760 × 300 design grid
        const c = st.begin(), C = kit.colors(), k = Math.min(st.W / 760, st.H / 300);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 300 * k) / 2); c.scale(k, k);
        const pos = demo ? demo.state.x / demo.params.stroke : 0, pmax = g.ps;
        const cy = S.cylinder(c, 60, 60, { len: 260, h: 38, rodLen: 140, pos, cushion: true, fillA: demo ? airFill(C, demo.state.pA - PATM, pmax) : null, fillB: demo ? airFill(C, demo.state.pB - PATM, pmax) : null });
        const v = S.valve(c, 190, 220, { spec: '5/2', state: demo && demoInfo.cmd === 1 ? 0 : 1, left: 'solenoid', right: 'spring', s: 32, pneumatic: true, labels: true, exhaust: 'silencer' });
        const ext = demo && demoInfo.cmd === 1;
        S.line(c, [cy.A, [cy.A[0], 150], [v.B[0], 150], v.B], { state: ext ? 'air' : 'exhaust' });
        S.line(c, [cy.B, [cy.B[0], 165], [v.A[0], 165], v.A], { state: ext ? 'exhaust' : 'air' });
        S.line(c, [v.P, [v.P[0], 285], [40, 285]], { state: 'air' });
        kit.label(c, 'tubes ' + V.tl.toFixed(1) + ' m, ' + V.td + ' mm bore', 330, 158, { color: C.muted, size: 11 });
        kit.label(c, V.bore + ' × ' + V.stroke.toFixed(0) + ' mm, ' + V.mass.toFixed(1) + ' kg', 190, 22, { color: C.text, size: 12, weight: 700, align: 'center' });
        // a log scale of valve sizes with the conductance needed
        const lx = C2 => 420 + 320 * (Math.log10(C2) - Math.log10(0.1)) / (Math.log10(30) - Math.log10(0.1));
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(420, 220); c.lineTo(740, 220); c.stroke();
        for (const [nm, cc] of SIZES) { const X = lx(cc); c.beginPath(); c.moveTo(X, 214); c.lineTo(X, 226); c.stroke(); kit.label(c, nm, X, 240, { color: C.text, size: 11, align: 'center' }); kit.label(c, String(cc), X, 256, { color: C.muted, size: 10, align: 'center' }); }
        kit.label(c, 'typical valve C by port size (dm³/(s·bar))', 580, 276, { color: C.muted, size: 11, align: 'center' });
        if (need && !need.none) {
          const X1 = lx(clamp(need.C, 0.1, 30)), X2 = lx(clamp(need.C * (1 + V.mg / 100), 0.1, 30));
          kit.arrow(c, X1, 180, X1, 212, C.bad, 2); kit.label(c, 'needed ' + need.C.toFixed(2), X1, 170, { color: C.bad, size: 11, weight: 700, align: 'center' });
          if (V.mg > 0) { kit.arrow(c, X2, 130, X2, 212, C.accent, 2); kit.label(c, '+ margin ' + (need.C * (1 + V.mg / 100)).toFixed(2), X2, 120, { color: C.accent, size: 11, weight: 700, align: 'center' }); }
        }
        if (ruleValve) { const X3 = lx(clamp(ruleValve * 1e8, 0.1, 30)); c.fillStyle = C.warn; c.beginPath(); c.arc(X3, 220, 4, 0, 2 * Math.PI); c.fill(); kit.label(c, 'rule', X3, 204, { color: C.warn, size: 10, align: 'center' }); }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ valve-symbols */
  const PARTS = {
    '1A1': ['1A1 · double-acting cylinder', 'A barrel with piston and rod and a port at each end; the small rectangles at both ends are end-position cushions. In the designation 1 is the control chain, A the kind of component (actuator), 1 its number.'],
    '1V1': ['1V1 · 5/2 valve, pneumatic pilot on both sides: an impulse valve', 'Two squares, two positions; the square at the ports is the one working now. Ports: 1 supply, 2 and 4 outputs, 3 and 5 exhausts with silencers. The hollow triangles are pneumatic pilots: a signal at 14 connects 1 to 4 and extends the rod, a signal at 12 connects 1 to 2 and retracts it. There is no spring, so the valve stays where the last signal put it: a memory.'],
    '1V2': ['1V2 · one-way flow control valve (speed controller)', 'An adjustable throttle (the arrow across the restriction) with a non-return valve beside it. Air flows freely into the cap end through the non-return valve and is throttled on its way out: meter-out speed control for the extending stroke.'],
    '1V3': ['1V3 · one-way flow control valve (speed controller)', 'The same at the rod end: free flow in, throttled flow out, so it sets the speed of the retracting stroke.'],
    '1S1': ['1S1 · 3/2 valve, push button, spring return, normally closed', 'The start signal. At rest port 2 is vented to 3 and port 1 is blocked; pressing the button connects 1 to 2 and sends a pilot signal to 14 of 1V1. Click it to press it.'],
    '1S2': ['1S2 · 3/2 valve, roller, spring return, normally closed', 'A limit valve. The cam on the rod presses its roller at the end of the stroke (the mark 1S2 at the cylinder shows where); it then signals 12 of 1V1 and the cylinder returns.'],
    'mark': ['The mark of limit valve 1S2', 'Limit valves are drawn with the other signal elements at the bottom of the diagram, in their rest position; a short stroke with the valve\'s name at the cylinder shows where the rod operates it.'],
    '0Z1': ['0Z1 · service unit: filter, regulator with gauge, lubricator', 'A dash-dot frame round several symbols means one assembly. Diamond with a dashed line: filter; square with an arrow and a gauge: pressure regulator; diamond with a dot: lubricator. The 0 marks the energy supply.'],
    'src': ['Compressed-air supply', 'Drawn here as a circle with a dot: a source of pneumatic pressure. A compressor would be a circle with a hollow triangle pointing out.'],
    'sil': ['Silencers', 'The small rectangles on exhaust ports 3 and 5 are silencers. A plain open triangle on a port, as on 1S1 and 1S2, is an exhaust straight to the atmosphere.'],
    'p14': ['Pilot line to 14', 'Dashed lines are control (pilot) lines: they carry signals, not working air. Drawn orange here while it is pressurised.'],
    'p12': ['Pilot line to 12', 'The signal from the limit valve 1S2 to port 12 of 1V1: when both 14 and 12 are pressurised at once, an impulse valve simply stays where it is.'],
    'main': ['Working lines', 'Solid lines carry working air. A dot marks a junction; lines that cross without a dot are not connected. The supply is at the bottom and air flows upwards to the actuator, the layout ISO 1219-2 uses.']
  };
  const HITS = [['1A1', 296, 48, 268, 44], ['1V1', 348, 230, 164, 40], ['1V2', 290, 120, 46, 60], ['1V3', 534, 120, 46, 60], ['1S1', 122, 322, 100, 36], ['1S2', 626, 322, 100, 36],
    ['mark', 668, 30, 44, 36], ['0Z1', 70, 372, 82, 50], ['src', 26, 404, 28, 30], ['sil', 410, 280, 40, 20], ['p14', 190, 243, 150, 14], ['p12', 520, 243, 125, 14], ['main', 200, 393, 200, 14]];

  Hyper.sim('valve-symbols', {
    title: 'An ISO 1219 circuit that works',
    blurb: `A classic pneumatic circuit in ISO 1219 symbols: press the start button 1S1 and the cylinder 1A1 extends; at the end of its stroke the rod operates the limit valve 1S2 and the cylinder returns. The final control valve 1V1 is an impulse valve, piloted from both sides, so it remembers the last signal. **Click any symbol** to read what it is and what its port numbers mean; clicking 1S1 also presses it. Working lines are solid, pilot lines dashed; **blue** carries supply air, **light blue** exhausting air, **orange** a pilot signal.

**Try this**
- Press 1S1 briefly: one complete cycle, out and back.
- Tick "Hold 1S1 down" and press again: the cylinder goes out and stays out. At the end both 14 and 12 are pressurised and the impulse valve keeps its position — the problem of signal overlap that sequencing methods exist to solve.
- Close the speed controllers: both strokes slow down, because each throttles the air leaving the cylinder.
- Turn the port numbers on and off and name every port of 1V1 yourself.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      let sel = '1V1', press = 0, mem = 1, vstate = 1, p14 = 0, p12 = 0, t = 0, view = { ox: 0, oy: 0, k: 1 };
      const ph = {};
      const ctl = kit.controls(box.side, [
        { id: 'info', type: 'html', html: '' },
        { type: 'buttons', items: [{ id: 'start', label: 'Press start button 1S1', primary: true }] },
        { id: 'hold', type: 'check', label: 'Hold 1S1 down', value: false },
        { id: 'thr', label: 'Speed controllers 1V2, 1V3 open', min: 5, max: 100, step: 1, value: 40, unit: '%' },
        { id: 'ports', type: 'check', label: 'Show port numbers', value: true },
        { id: 'names', type: 'check', label: 'Show designations (1A1, 1V1 …)', value: true },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25], ['Slow motion 1/10', 0.1]], value: 0.25 }
      ], (id) => { if (id === 'start') { press = 0.4; select('1S1'); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['v', '1V1 position'], ['x', 'Cylinder'], ['sig', 'Signals 14 / 12']]);
      const cyl = cylModel({ bore: 0.032, rod: 0.012, stroke: 0.2, mass: 1.5, C: 0.5e-8 });
      cyl.s.pB = 6e5 + PATM;
      function select(id) {
        sel = id;
        const d = PARTS[id];
        if (d) ctl.set('info', '<b>' + d[0] + '</b><br>' + d[1]);
      }
      select('1V1');
      const toDesign = p => ({ x: (p.x - view.ox) / view.k, y: (p.y - view.oy) / view.k });
      const hitAt = p => { const q = toDesign(p); const h = HITS.find(r => q.x >= r[1] && q.x <= r[1] + r[3] && q.y >= r[2] && q.y <= r[2] + r[4]); return h ? h[0] : null; };
      kit.click(st, p => { const id = hitAt(p); if (id) { select(id); if (id === '1S1') press = 0.4; } }, p => !!hitAt(p));
      const loop = kit.loop((dt) => {
        const sdt = Math.min(dt, 0.05) * V.slow, ps = 6e5 + PATM, P = cyl.P, s = cyl.s;
        press = Math.max(0, press - sdt);
        const s1 = press > 0 || !!V.hold, s2 = s.x >= P.stroke - 0.002;
        P.Cex = series(P.C, Math.max(0.03, V.thr / 100) * 0.8e-8);
        const n = Math.max(1, Math.ceil(sdt / 2e-5)), h = sdt / n;
        for (let k = 0; k < n; k++) {
          p14 += ((s1 ? 1 : 0) - p14) * Math.min(1, h / 0.02); p12 += ((s2 ? 1 : 0) - p12) * Math.min(1, h / 0.02);
          if (p14 > 0.5 && p12 < 0.5) mem = 0; else if (p12 > 0.5 && p14 < 0.5) mem = 1;
          vstate += clamp(mem - vstate, -h / 0.02, h / 0.02);
          const ext = Math.round(vstate) === 0;
          cylStep(F, cyl, h, ext ? 'supply' : 'exhaust', ext ? 'exhaust' : 'supply', ps, PATM, 20);
        }
        t += sdt;
        const pA = s.pA - PATM, pB = s.pB - PATM, ext = Math.round(vstate) === 0;
        ro.set('v', ext ? '14 side: 1 → 4, 2 → 3 (extend)' : '12 side: 1 → 2, 4 → 5 (retract)');
        ro.set('x', (s.x * 1000).toFixed(0) + ' mm, ' + s.v.toFixed(2) + ' m/s');
        ro.set('sig', (p14 > 0.5 ? 'on' : 'off') + ' / ' + (p12 > 0.5 ? 'on' : 'off') + (p14 > 0.5 && p12 > 0.5 ? ': both on, the valve holds' : ''));
        // ---- drawing on a 760 × 440 design grid
        const c = st.begin(), C = kit.colors(), k = Math.min(st.W / 760, st.H / 440);
        view = { ox: (st.W - 760 * k) / 2, oy: (st.H - 440 * k) / 2, k };
        c.save(); c.translate(view.ox, view.oy); c.scale(k, k);
        const labels = !!V.ports;
        const cy = S.cylinder(c, 300, 70, { len: 260, h: 40, rodLen: 130, pos: s.x / P.stroke, cushion: true, fillA: airFill(C, pA, 6e5), fillB: airFill(C, pB, 6e5) });
        const v = S.valve(c, 430, 250, { spec: '5/2', state: vstate, left: 'pilot', right: 'pilot', s: 36, pneumatic: true, labels, exhaust: 'silencer' });
        const b1 = S.valve(c, 190, 340, { spec: '3/2 NC', state: s1 ? 0 : 1, left: 'pushbutton', right: 'spring', s: 30, pneumatic: true, labels, exhaust: true });
        const b2 = S.valve(c, 660, 340, { spec: '3/2 NC', state: s2 ? 0 : 1, left: 'roller', right: 'spring', s: 30, pneumatic: true, labels, exhaust: true });
        const f1 = S.flowControl(c, 308, 150, { free: 'up' }), f2 = S.flowControl(c, 552, 150, { free: 'up' });
        const st1 = ext ? 'air' : (pA > 0.15e5 ? 'exhaust' : 'idle'), st2 = ext ? (pB > 0.15e5 ? 'exhaust' : 'idle') : 'air';
        const La = [f1.a, [f1.a[0], 196], [v.B[0], 196], v.B], Lb = [f2.a, [f2.a[0], 206], [v.A[0], 206], v.A];
        S.line(c, [cy.A, f1.b], { state: st1 }); S.line(c, La, { state: st1 });
        S.line(c, [cy.B, f2.b], { state: st2 }); S.line(c, Lb, { state: st2 });
        const main = [[158, 400], [b2.P[0], 400], b2.P];
        S.line(c, [[40, 400], [62, 400]], { state: 'air' }); S.line(c, main, { state: 'air' });
        S.line(c, [[b1.P[0], 400], b1.P], { state: 'air' }); S.line(c, [[430, 400], v.P], { state: 'air' });
        S.junction(c, b1.P[0], 400); S.junction(c, 430, 400);
        S.line(c, [b1.A, [b1.A[0], 250], v.pilotL], { state: p14 > 0.5 ? 'pilot' : 'idle', kind: 'pilot' });
        S.line(c, [b2.A, [b2.A[0], 250], v.pilotR], { state: p12 > 0.5 ? 'pilot' : 'idle', kind: 'pilot' });
        S.source(c, 40, 420, { pneumatic: true });
        S.frl(c, 110, 400);
        // flow dots in the cylinder lines
        const mref = RHO0 * P.C * ps, adv = (key, m) => { ph[key] = (ph[key] || 0) + dt * 80 * Math.min(2, Math.abs(m) / mref); return ph[key]; };
        const pa = [cy.A, f1.b, f1.a, [f1.a[0], 196], [v.B[0], 196], v.B], pb = [cy.B, f2.b, f2.a, [f2.a[0], 206], [v.A[0], 206], v.A];
        if (Math.abs(s.mA) > 0.01 * mref) S.flow(c, s.mA > 0 ? pa.slice().reverse() : pa, adv('a', s.mA), { color: S.col(s.mA > 0 ? 'air' : 'exhaust') });
        if (Math.abs(s.mB) > 0.01 * mref) S.flow(c, s.mB > 0 ? pb.slice().reverse() : pb, adv('b', s.mB), { color: S.col(s.mB > 0 ? 'air' : 'exhaust') });
        // the limit valve's mark at the end of the stroke
        const xm = 300 + 4 + (260 - 15) + 7 + 130;
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(xm, 50); c.lineTo(xm, 62); c.stroke();
        kit.label(c, '1S2', xm, 40, { color: s2 ? C.bad : C.text, size: 11, weight: 700, align: 'center' });
        if (labels) {
          kit.label(c, '14', v.pilotL[0] + 2, 238, { color: p14 > 0.5 ? C.warn : C.muted, size: 11, weight: 700, align: 'center' });
          kit.label(c, '12', v.pilotR[0] - 2, 238, { color: p12 > 0.5 ? C.warn : C.muted, size: 11, weight: 700, align: 'center' });
        }
        if (V.names) {
          const nm = (tx, x, y, al) => kit.label(c, tx, x, y, { color: C.accent, size: 12, weight: 700, align: al || 'left' });
          nm('1A1', 290, 70, 'right'); nm('1V1', 470, 292); nm('1V2', 282, 150, 'right'); nm('1V3', 580, 150);
          nm('1S1', 120, 332, 'right'); nm('1S2', 702, 332); nm('0Z1', 110, 436, 'center');
        }
        // the selection
        const hsel = HITS.find(r => r[0] === sel);
        if (hsel) { c.strokeStyle = C.accent; c.lineWidth = 2; c.setLineDash([5, 4]); c.strokeRect(hsel[1] - 3, hsel[2] - 3, hsel[3] + 6, hsel[4] + 6); c.setLineDash([]); }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ valve-terminal */
  const NST = 6;
  Hyper.sim('valve-terminal', {
    title: 'A valve terminal on a fieldbus',
    blurb: `Six 5/2 solenoid valves on one manifold, each driving a 25 mm cylinder. The controller sends one output byte over the fieldbus; each bit is one coil (Y0 to Y5). All valves share the manifold's supply channel, fed through one connection, and its exhaust channel, which vents through one silencer. Click a bit to switch its valve, or run a pattern. The graph shows the two channel pressures.

**Try this**
- Run "all six together" and watch the supply channel dip and the exhaust channel rise each time they switch.
- Make the supply connection small (C = 0.8): the dip deepens and every cylinder slows. Feeding a long terminal from both ends is the usual cure.
- Make the silencer small: back-pressure builds in the exhaust channel — at worst enough to nudge a cylinder whose valve is not even switching.
- Walking bit: one valve at a time barely disturbs the channels.
- Read the output byte in binary and hexadecimal, as the controller sees it.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const gdiv = document.createElement('div'); gdiv.style.padding = '4px 10px 10px'; box.stage.appendChild(gdiv);
      const bits = new Array(NST).fill(false);
      let tPat = 0, step = 0, t = 0, hist = [], tPlot = 0, view = { ox: 0, oy: 0, k: 1 }, pmin = Infinity, pmax = 0, tWin = 0;
      const ctl = kit.controls(box.side, [
        { id: 'pat', type: 'select', label: 'Pattern', options: [['Manual: click the bits', 'manual'], ['Walking bit', 'walk'], ['All six together', 'all'], ['Alternate halves', 'half']], value: 'all' },
        { type: 'buttons', items: [{ id: 'on', label: 'All on' }, { id: 'off', label: 'All off' }] },
        { id: 'Cs', label: 'Supply connection C', min: 0.5, max: 10, value: 4, unit: 'dm³/(s·bar)', log: true, sig: 2 },
        { id: 'Cx', label: 'Exhaust silencer C', min: 0.5, max: 10, value: 6, unit: 'dm³/(s·bar)', log: true, sig: 2 },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 3, max: 8, step: 0.5, value: 6, unit: 'bar' },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25]], value: 1 }
      ], (id) => {
        if (id === 'on' || id === 'off') { ctl.set('pat', 'manual'); bits.fill(id === 'on'); }
        if (id === 'pat') { tPat = 0; step = 0; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['byte', 'Output byte'], ['pch', 'Supply channel (now / lowest)'], ['pex', 'Exhaust channel (now / highest)'], ['q', 'Air into the terminal now'], ['need', 'Supply C for six at once (≤ 10 % dip)']]);
      const plot = kit.plot(gdiv, { x: { label: 'time (s)' }, y: { label: 'channel pressure (bar, gauge)' }, legend: true }, 140);
      const cyls = [], vst = new Array(NST).fill(1);
      for (let i = 0; i < NST; i++) { const cy = cylModel({ bore: 0.025, rod: 0.01, stroke: 0.08, mass: 0.6, C: 0.5e-8, dead: 8e-6 }); cy.s.pB = V.ps * 1e5 + PATM; cyls.push(cy); }
      const node = { pch: V.ps * 1e5 + PATM, pex: PATM, qin: 0 };
      const X = i => 190 + i * 96;
      const toDesign = p => ({ x: (p.x - view.ox) / view.k, y: (p.y - view.oy) / view.k });
      const bitAt = p => { const q = toDesign(p); for (let i = 0; i < NST; i++) if (Math.abs(q.x - X(i)) <= 14 && q.y >= 396 && q.y <= 424) return i; return -1; };
      kit.click(st, p => { const i = bitAt(p); if (i >= 0) { ctl.set('pat', 'manual'); bits[i] = !bits[i]; } }, p => bitAt(p) >= 0);
      const loop = kit.loop((dt) => {
        const sdt = Math.min(dt, 0.05) * V.slow, ps = V.ps * 1e5 + PATM;
        if (V.pat !== 'manual') {
          tPat += sdt;
          if (tPat > 0.8) { tPat = 0; step++; }
          for (let i = 0; i < NST; i++) bits[i] = V.pat === 'walk' ? step % NST === i : V.pat === 'all' ? step % 2 === 1 : (step % 2 === 1) === (i < NST / 2);
        }
        const n = Math.max(1, Math.ceil(sdt / 2e-5)), h = sdt / n, Vch = 40e-6, Vex = 40e-6;
        let qin = 0;
        for (let k = 0; k < n; k++) {
          let draw = 0, dump = 0;
          for (let i = 0; i < NST; i++) {
            vst[i] += clamp((bits[i] ? 0 : 1) - vst[i], -h / 0.012, h / 0.012);
            const ext = Math.round(vst[i]) === 0, s = cylStep(F, cyls[i], h, ext ? 'supply' : 'exhaust', ext ? 'exhaust' : 'supply', node.pch, node.pex, 10);
            draw += ext ? s.mA : s.mB; dump += ext ? -s.mB : -s.mA;
          }
          const min = mflow(F, V.Cs * 1e-8, 0.3, ps, node.pch), mout = mflow(F, V.Cx * 1e-8, 0.4, node.pex, PATM);
          node.pch = Math.max(PATM, node.pch + h * GAM * RG * T0 * (min - draw) / Vch);
          node.pex = Math.max(PATM * 0.98, node.pex + h * GAM * RG * T0 * (dump - mout) / Vex);
          qin += min / n;
        }
        t += sdt; tWin += sdt;
        const pc = Math.max(0, node.pch - PATM), pe = Math.max(0, node.pex - PATM);
        if (tWin > 2) { tWin = 0; pmin = pc; pmax = pe; } else { pmin = Math.min(pmin, pc); pmax = Math.max(pmax, pe); }
        let byte = 0; bits.forEach((b, i) => { if (b) byte |= 1 << i; });
        ro.set('byte', '0b' + byte.toString(2).padStart(8, '0') + ' = 0x' + byte.toString(16).toUpperCase().padStart(2, '0') + ' = ' + byte);
        ro.set('pch', (pc / 1e5).toFixed(2) + ' / ' + (pmin / 1e5).toFixed(2) + ' bar');
        ro.set('pex', (pe / 1e5).toFixed(2) + ' / ' + (pmax / 1e5).toFixed(2) + ' bar');
        ro.set('q', (Math.max(0, qin) / RHO0 * 60000).toFixed(0) + ' L/min ANR (average over the frame)');
        const r = 0.9, phi = Math.sqrt(1 - Math.pow((r - 0.3) / 0.7, 2));
        ro.set('need', 'about ' + (NST * 0.5 * r / phi).toFixed(1) + ' dm³/(s·bar) (valves C = 0.5 each)');
        hist.push([t, pc / 1e5, pe / 1e5]);
        while (hist.length && hist[0][0] < t - 3) hist.shift();
        tPlot += dt;
        if (tPlot > 0.08) {
          tPlot = 0;
          const hh = hist.filter((q, i) => i % 2 === 0);
          plot.set({ series: [{ pts: hh.map(q => [q[0], q[1]]), label: 'supply channel' }, { pts: hh.map(q => [q[0], q[2]]), label: 'exhaust channel', dash: [5, 4] }], y: { label: 'channel pressure (bar, gauge)', min: 0, max: V.ps + 0.3 } });
        }
        // ---- drawing on a 760 × 440 design grid
        const c = st.begin(), C = kit.colors(), k = Math.min(st.W / 760, st.H / 440);
        view = { ox: (st.W - 760 * k) / 2, oy: (st.H - 440 * k) / 2, k };
        c.save(); c.translate(view.ox, view.oy); c.scale(k, k);
        // the manifold with its two channels
        S.line(c, [[40, 345], [150, 345], [X(NST - 1), 345]], { state: 'air' });
        S.line(c, [[X(0) - 8, 362], [730, 362], [730, 372]], { state: pe > 0.05e5 ? 'exhaust' : 'idle' });
        S.exhaust(c, 730, 372, { silencer: true });
        c.strokeStyle = C.muted; c.lineWidth = 1.2; c.setLineDash([10, 3, 2, 3]); c.strokeRect(140, 318, 610, 62); c.setLineDash([]);
        kit.label(c, 'manifold', 146, 330, { color: C.muted, size: 10 });
        S.source(c, 40, 365, { pneumatic: true });
        kit.label(c, (pc / 1e5).toFixed(2) + ' bar', 60, 332, { color: C.text, size: 11, weight: 700 });
        for (let i = 0; i < NST; i++) {
          const x = X(i), cy = cyls[i], s = cy.s;
          const v = S.valve(c, x, 290, { spec: '5/2', state: vst[i], left: 'solenoid', right: 'spring', s: 22, pneumatic: true, labels: i === 0 });
          S.line(c, [v.P, [x, 345]], { state: 'air' }); S.junction(c, x, 345);
          S.line(c, [v.S, [v.S[0], 362]], { state: 'idle' }); S.line(c, [v.R, [v.R[0], 362]], { state: 'idle' });
          S.junction(c, v.S[0], 362); S.junction(c, v.R[0], 362);
          const cyl = S.cylinder(c, x - 5.5 - 22, 250, { len: 110, h: 24, rodLen: 60, pos: s.x / cy.P.stroke, rot: -90, fillA: airFill(C, s.pA - PATM, 6e5), fillB: airFill(C, s.pB - PATM, 6e5) });
          const ext = Math.round(vst[i]) === 0;
          S.line(c, [v.B, cyl.A], { state: ext ? 'air' : (s.pA - PATM > 0.15e5 ? 'exhaust' : 'idle') });
          S.line(c, [v.A, [v.A[0], 262], [x + 16, 262], [x + 16, cyl.B[1]], cyl.B], { state: ext ? (s.pB - PATM > 0.15e5 ? 'exhaust' : 'idle') : 'air' });
          kit.label(c, 'Y' + i, v.xl - 3, 278, { color: bits[i] ? C.bad : C.muted, size: 10, weight: 700, align: 'right' });
          // the output bit
          c.fillStyle = bits[i] ? C.bad : C.surface; c.strokeStyle = C.text; c.lineWidth = 1.2;
          c.fillRect(x - 13, 397, 26, 26); c.strokeRect(x - 13, 397, 26, 26);
          kit.label(c, bits[i] ? '1' : '0', x, 410, { color: bits[i] ? '#fff' : C.text, size: 13, weight: 700, align: 'center' });
          kit.label(c, 'bit ' + i, x, 432, { color: C.muted, size: 10, align: 'center' });
        }
        kit.label(c, 'fieldbus output byte (click a bit)', 20, 404, { color: C.muted, size: 11 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
