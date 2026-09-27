/* HYPER-HYDRAULICS · sims/fluid-power.js — simulations for the fluid-power introduction, symbols and applications:
 *   fp-symbols    an ISO 1219 symbol gallery: click a symbol; valves shift in a small working circuit showing their paths
 *   fp-trace      trace the circuit: explore a cylinder circuit, name its components, identify line kinds and states
 *   fp-sankey     the power flow from motor to cylinder as a Sankey diagram, for three kinds of supply, with the oil heat
 *   fp-jack       a bottle jack in section: lever, plunger pump, two check valves, ram and release valve
 *   fp-brakes     car brakes: pedal → booster → master cylinder → calipers → tyre forces, ABS, a stop from 100 km/h
 *   fp-excavator  an excavator's boom, arm and bucket: cylinder strokes → geometry, reach, cylinder forces and pressures
 *   fp-press      a press cycle: prefill, pressing (oil and frame compliance), dwell, decompression, return
 * Circuits are drawn with kit.fsym on fixed design grids scaled to the stage, lines coloured by what they carry.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared helpers */
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  function fit(st, W0, H0) { const k = Math.min(st.W / W0, st.H / H0) || 1; return { k, ox: (st.W - W0 * k) / 2, oy: (st.H - H0 * k) / 2 }; }
  function begin(st, g) { const c = st.begin(); c.save(); c.translate(g.ox, g.oy); c.scale(g.k, g.k); return c; }
  const toDesign = (g, p) => ({ x: (p.x - g.ox) / g.k, y: (p.y - g.oy) / g.k });
  function segDist(p, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
    const t = L2 ? clamp(((p.x - a[0]) * dx + (p.y - a[1]) * dy) / L2, 0, 1) : 0;
    return Math.hypot(p.x - a[0] - t * dx, p.y - a[1] - t * dy);
  }
  function polyDist(p, pts) { let d = Infinity; for (let i = 1; i < pts.length; i++) d = Math.min(d, segDist(p, pts[i - 1], pts[i])); return d; }
  const inBox = (p, b) => p.x >= b[0] && p.x <= b[2] && p.y >= b[1] && p.y <= b[3];
  function wrap(c, text, maxW, size, weight) {
    c.save(); c.font = (weight || 500) + ' ' + size + 'px system-ui, sans-serif';
    const out = []; let line = '';
    for (const w of String(text).split(/\s+/)) {
      const t = line ? line + ' ' + w : w;
      if (line && c.measureText(t).width > maxW) { out.push(line); line = w; } else line = t;
    }
    if (line) out.push(line);
    c.restore();
    return out;
  }
  function para(kit, c, text, x, y, maxW, o) {
    o = o || {};
    const size = o.size || 12, lh = o.lh || size + 4, lines = wrap(c, text, maxW, size, o.weight);
    lines.forEach((l, i) => kit.label(c, l, x, y + i * lh, Object.assign({ size }, o)));
    return y + lines.length * lh;
  }
  function rrect(c, x, y, w, h, r) { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); }
  function phaser() { const ph = {}; return (key, speed, dt) => (ph[key] = (ph[key] || 0) + speed * dt); }
  const tint = (C, dark, light, a) => 'rgba(' + (C.dark ? dark : light) + ',' + a + ')';
  const RED = ['255,92,92', '214,40,40'], BLUE = ['90,162,255', '31,99,214'];
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ================================================================ fp-symbols */
  const SYMBOLS = [
    { key: 'lines', name: 'Lines and connections', tile: 'Lines',
      desc: '<b>Lines.</b> Solid: working lines — pressure, return, suction. Long dashes: pilot (control) lines. Short dashes: drains carrying leakage to the tank. A dot joins lines; a crossing without a dot is not a connection. An arc is a flexible hose; a dash-dot outline groups parts built as one unit.' },
    { key: 'pump', name: 'Fixed-displacement pump', tile: 'Pump',
      desc: '<b>Fixed-displacement hydraulic pump.</b> A circle is energy conversion; the filled triangle points <i>out</i>: energy leaves with a liquid. The two short lines are the shaft, here driven by an electric motor (M). It delivers a fixed volume per revolution; the pressure is set by whatever lies downstream — here an adjustable throttle.' },
    { key: 'vpump', name: 'Variable-displacement pump', tile: 'Variable pump',
      desc: '<b>Variable-displacement pump.</b> The diagonal arrow across the circle means the displacement can be changed — by hand, by a pressure compensator or electrically — so the flow varies at constant shaft speed.' },
    { key: 'motor', name: 'Hydraulic motor', tile: 'Motor',
      desc: '<b>Hydraulic motor.</b> The same circle with the triangle pointing <i>in</i>: energy arrives with the liquid and leaves through the shaft. Torque = displacement × pressure drop ÷ 2π; speed = flow ÷ displacement. Two triangles would mean it turns both ways.' },
    { key: 'cyl', name: 'Double-acting cylinder', tile: 'Cylinder',
      desc: '<b>Double-acting cylinder.</b> Oil into the cap end (A) pushes the piston out while the rod end (B) returns to the tank; oil into B pulls it in. Force = pressure × area, speed = flow ÷ area.' },
    { key: 'cyl1', name: 'Single-acting cylinder, spring return', tile: 'Single-acting',
      desc: '<b>Single-acting cylinder with spring return.</b> Pressure on A extends it; the spring (or the load\'s weight) pushes it back while the oil returns through A. The rod side breathes to the air.' },
    { key: 'v43c', name: '4/3 valve, closed centre', tile: '4/3 closed', spec: '4/3 closed', left: 'spring+solenoid', right: 'spring+solenoid', act: 'double',
      desc: '<b>4/3 directional valve, closed centre.</b> Four ports (P, T, A, B), three squares. Solenoid a brings the left square to the ports (P→A, B→T: extend), solenoid b the right square (P→B, A→T: retract). The springs centre it, blocking every port: the cylinder is held, and a fixed pump\'s flow must cross the relief valve.' },
    { key: 'v43t', name: '4/3 valve, tandem centre', tile: '4/3 tandem', spec: '4/3 tandem', left: 'spring+solenoid', right: 'spring+solenoid', act: 'double',
      desc: '<b>4/3 valve, tandem centre.</b> Same outer squares; in the centre P is joined to T while A and B are blocked. The cylinder is held and the pump unloads to the tank at a few bar — far less heat than over a relief valve.' },
    { key: 'v43f', name: '4/3 valve, float centre', tile: '4/3 float', spec: '4/3 float', left: 'spring+solenoid', right: 'spring+solenoid', act: 'double',
      desc: '<b>4/3 valve, float centre.</b> In the centre A and B are joined to T and P is blocked. The cylinder is free to be moved by outside forces — a dozer blade or a loader bucket following the ground. The pump flow meets a blocked port and crosses the relief valve.' },
    { key: 'v42', name: '4/2 valve, spring return', tile: '4/2', spec: '4/2', left: 'solenoid', right: 'spring', act: 'double',
      desc: '<b>4/2 valve.</b> Two positions, spring return. At rest (right square) P→B and A→T, so the cylinder retracts; energised (left square) P→A and B→T, so it extends. There is no middle position: the cylinder always drives one way or the other.' },
    { key: 'v32', name: '3/2 valve, normally closed', tile: '3/2 NC', spec: '3/2 NC', left: 'solenoid', right: 'spring', act: 'single',
      desc: '<b>3/2 valve, normally closed.</b> Ports P, A and T (drawn R on the symbol). At rest P is blocked and A is vented to the tank; energised, P→A. It drives a single-acting cylinder, which its spring returns.' },
    { key: 'v22', name: '2/2 valve, normally closed', tile: '2/2 NC', spec: '2/2 NC', left: 'solenoid', right: 'spring', act: 'motor',
      desc: '<b>2/2 valve, normally closed.</b> An on/off valve: two ports, two positions. At rest it blocks; energised it connects P→A. Here it starts and stops a hydraulic motor whose outlet returns to the tank.' },
    { key: 'check', name: 'Check (non-return) valve', tile: 'Check valve',
      desc: '<b>Check valve.</b> A ball on a V-shaped seat. Flow in the free direction (upwards here) lifts the ball; reverse pressure presses it onto its seat and blocks the flow. With a spring drawn on the ball, it needs a small opening pressure.' },
    { key: 'relief', name: 'Pressure-relief valve', tile: 'Relief valve',
      desc: '<b>Pressure-relief valve.</b> Normally closed: the arrow is offset from the ports. The dashed pilot line brings the <i>inlet</i> pressure to push against the adjustable spring; near the setting the valve opens to the tank. It sets the highest pressure in the system.' },
    { key: 'reducing', name: 'Pressure-reducing valve', tile: 'Reducing valve',
      desc: '<b>Pressure-reducing valve.</b> Normally open, with its pilot taken from the <i>outlet</i>: as the outlet pressure approaches the setting the valve throttles, holding a lower, steady pressure downstream whatever the inlet does — for a clamp or a pilot supply.' },
    { key: 'throttle', name: 'Throttle (adjustable)', tile: 'Throttle',
      desc: '<b>Adjustable throttle.</b> A waist between two arcs; the arrow means adjustable. The flow depends on the opening and on the pressure drop, so the speed it sets changes with the load unless it is pressure-compensated. With a check valve beside it, it is a one-way flow control.' },
    { key: 'accu', name: 'Accumulator', tile: 'Accumulator',
      desc: '<b>Accumulator.</b> A capsule with a separating line: gas (nitrogen) above, oil below. It stores oil under pressure — energy — to cover peak flows, absorb shocks or keep pressure when the pump stops. It stays charged after shutdown: discharge it before any work.' },
    { key: 'filter', name: 'Filter', tile: 'Filter',
      desc: '<b>Filter.</b> A diamond (conditioning) with a dashed line across it: the element. Return filters of about 10 µm keep the oil clean; the pressure drop across the element grows as it clogs, and an indicator says when to change it.' },
    { key: 'cooler', name: 'Cooler', tile: 'Cooler',
      desc: '<b>Cooler.</b> A diamond with arrows pointing out: heat leaves the oil (a heater has them pointing in). Coolers carry away the heat made by every loss in the system.' },
    { key: 'gauge', name: 'Pressure gauge', tile: 'Gauge',
      desc: '<b>Pressure gauge.</b> A small circle with a needle or arrow. Gauges read gauge pressure — above atmospheric — usually in bar and psi.' }
  ];

  Hyper.sim('fp-symbols', {
    title: 'ISO 1219 symbol gallery',
    blurb: `Twenty ISO 1219 symbols on the left; click one (or choose it in the list) to see it working on the right, with lines coloured by what they carry — **red** pressure, **blue** return, **yellow** throttled, **green** suction — and dots moving with the flow. Valves are shown in a small circuit: pump, relief valve, the valve and its actuator.

**Try this**
- Pick the closed-centre 4/3 valve and watch the squares slide: the ports stay still, and the square under them decides the paths. Use **a**, **Rest** and **b** to shift it yourself.
- Compare the centre positions: closed (cylinder held, pump over the relief valve), tandem (pump unloads to tank), float (cylinder free, ports joined to tank).
- The relief valve cracks near its setting and opens further as the pressure rises; the reducing valve holds its outlet steady while the demand changes.
- Look at the triangles: filled for oil, pointing out of a pump and into a motor.`,
    mount(box, kit, params) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const W0 = 760, H0 = 456;
      let sel = Math.max(0, SYMBOLS.findIndex(s => s.key === ((params && params.pick) || 'v43c')));
      const sv = { state: 1, target: 1, pos: 0.3, ang: 0, seq: 0, t: 0, hold: 0 };
      const ph = phaser();
      let g = fit(st, W0, H0), T = 0;
      const ctl = kit.controls(box.side, [
        { id: 'pick', type: 'select', label: 'Symbol', options: SYMBOLS.map(s => [s.name, s.key]), value: SYMBOLS[sel].key },
        { type: 'buttons', items: [{ id: 'a', label: '◀ a (Y1)' }, { id: 'rest', label: 'Rest' }, { id: 'b', label: 'b (Y2) ▶' }] },
        { id: 'auto', type: 'check', label: 'Shift the valve automatically', value: true },
        { id: 'desc', type: 'html', html: '' }
      ], (id, v) => {
        const it = SYMBOLS[sel], spec = it.spec ? S.SPEC[it.spec] : null;
        if (id === 'pick') select(SYMBOLS.findIndex(s => s.key === v));
        if (spec && (id === 'a' || id === 'rest' || id === 'b')) {
          ctl.set('auto', false); V.auto = false;
          sv.target = id === 'a' ? 0 : id === 'b' && spec.boxes.length === 3 ? 2 : spec.normal;
        }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pos', 'Valve position'], ['paths', 'Connections'], ['act', 'Actuator']]);
      function select(i) {
        if (i < 0) return;
        sel = i;
        const it = SYMBOLS[i];
        ctl.set('pick', it.key);
        sv.state = sv.target = it.spec ? S.SPEC[it.spec].normal : 1;
        sv.pos = 0.3; sv.seq = 0; sv.t = 0; sv.hold = 0;
        if (ctl.rows.desc && ctl.rows.desc.set) ctl.rows.desc.set(it.desc);
        for (const b of ['a', 'rest', 'b']) ctl.show(b, !!it.spec);
        ctl.show('auto', !!it.spec);
        ro.show(!!it.spec);
      }
      select(sel);
      // gallery tiles: 4 columns × 5 rows
      const TW = 104, TH = 89.6, tileAt = i => [6 + (i % 4) * TW, 4 + Math.floor(i % 20 / 4) * TH];
      const hitTile = p => { const q = toDesign(g, p); for (let i = 0; i < SYMBOLS.length; i++) { const [x, y] = tileAt(i); if (inBox(q, [x, y, x + TW - 4, y + TH - 4])) return i; } return -1; };
      kit.click(st, p => { const i = hitTile(p); if (i >= 0) select(i); }, p => hitTile(p) >= 0);

      function drawTile(c, it, x, y) {
        switch (it.key) {
          case 'lines': S.line(c, [[x - 38, y - 16], [x + 38, y - 16]], {}); S.line(c, [[x - 38, y], [x + 38, y]], { kind: 'pilot' }); S.line(c, [[x - 38, y + 16], [x + 38, y + 16]], { kind: 'drain' }); break;
          case 'pump': S.pump(c, x, y, {}); break;
          case 'vpump': S.pump(c, x, y, { variable: true }); break;
          case 'motor': S.motor(c, x, y, {}); break;
          case 'cyl': S.cylinder(c, x - 42, y - 6, { len: 62, h: 22, pos: 0.35, rodLen: 60 }); break;
          case 'cyl1': S.cylinder(c, x - 42, y - 6, { len: 62, h: 22, pos: 0.35, rodLen: 60, single: 'retract' }); break;
          case 'check': S.check(c, x, y, {}); break;
          case 'relief': S.pressureValve(c, x - 8, y, { kind: 'relief' }); break;
          case 'reducing': S.pressureValve(c, x - 8, y, { kind: 'reducing' }); break;
          case 'throttle': S.throttle(c, x, y, { adjustable: true }); break;
          case 'accu': S.accumulator(c, x, y - 8, {}); break;
          case 'filter': S.filter(c, x, y, {}); break;
          case 'cooler': S.cooler(c, x, y, {}); break;
          case 'gauge': S.gauge(c, x, y - 6, {}); break;
          default: S.valve(c, x, y, { spec: it.spec, s: 18, left: it.left, right: it.right });
        }
      }

      /* ---- valves: which paths are open, and what the actuator does */
      function flowsOf(conns) {
        const has = k => conns.indexOf(k) >= 0;
        return { pA: has('P>A'), pB: has('P>B'), aT: has('A>T') || has('A>R'), bT: has('B>T'), pT: has('P+T') || has('P+T+A+B'), fl: has('A+B+T') || has('P+T+A+B') };
      }
      function dirOf(it, f) {
        if (it.act === 'double') return f.pA && f.bT ? 1 : f.pB && f.aT ? -1 : 0;
        if (it.act === 'single') return f.pA ? 1 : f.aT ? -1 : 0;
        return f.pA ? 1 : 0;
      }
      function connText(conns) {
        if (conns.every(k => k.endsWith('|'))) return 'all ports blocked';
        return conns.map(k => { const t = k.replace(/R/g, 'T'); return t.endsWith('|') ? t[0] + ' blocked' : t.indexOf('+') >= 0 ? t.split('+').join('–') + ' joined' : t.replace('>', '→'); }).join(', ');
      }
      function stepValve(it, dt) {
        const spec = S.SPEC[it.spec], n = spec.boxes.length;
        if (V.auto) {
          const seq = n === 3 ? [0, 1, 2, 1] : [0, 1];
          sv.target = seq[sv.seq % seq.length];
          sv.t += dt;
          const f = flowsOf(spec.boxes[sv.target]), dir = dirOf(it, f);
          const still = it.act === 'motor' ? false : dir === 0 || (dir > 0 && sv.pos >= 1) || (dir < 0 && sv.pos <= 0);
          if (still) sv.hold += dt;
          const done = it.act === 'motor' ? sv.t > 2.6 : sv.hold > (dir === 0 ? 1.4 : 0.8);
          if (done) { sv.seq++; sv.t = 0; sv.hold = 0; }
        }
        sv.state += clamp(sv.target - sv.state, -dt / 0.15, dt / 0.15);
        const bx = clamp(Math.round(sv.state), 0, n - 1), f = flowsOf(spec.boxes[bx]), dir = dirOf(it, f);
        if (it.act === 'motor') sv.ang += dir * dt * 5;
        else sv.pos = clamp(sv.pos + dir * dt * 0.45, 0, 1);
        const moving = it.act === 'motor' ? dir !== 0 : (dir > 0 && sv.pos < 1) || (dir < 0 && sv.pos > 0);
        return { spec, n, bx, f, dir, moving, relief: !f.pT && !moving };
      }
      function drawValveCircuit(c, it, dt, C) {
        const o = stepValve(it, dt), f = o.f, col = S.col, vx = 595, vy = 238;
        const hp = 'pressure';
        // actuator
        let aPort, bPort = null;
        if (it.act === 'motor') { const m = S.motor(c, 595, 128, { angle: sv.ang }); aPort = m.b; }
        else {
          const cy = S.cylinder(c, 500, 92, { len: 110, h: 30, pos: sv.pos, rodLen: 115, single: it.act === 'single' ? 'retract' : undefined,
            fillA: f.pA ? tint(C, RED[0], RED[1], 0.3) : null, fillB: f.pB ? tint(C, RED[0], RED[1], 0.3) : null });
          aPort = cy.A; if (it.act === 'double') bPort = cy.B;
          kit.label(c, 'A', aPort[0] - 6, aPort[1] + 8, { size: 11, color: C.muted, align: 'right' });
          if (bPort) kit.label(c, 'B', bPort[0] + 6, bPort[1] + 8, { size: 11, color: C.muted, align: 'left' });
        }
        const v = S.valve(c, vx, vy, { spec: it.spec, state: sv.state, left: it.left, right: it.right, s: 38 });
        const Tp = v.T || v.R;
        // port letters
        kit.label(c, 'P', v.P[0] - 6, v.P[1] - 2, { size: 11, color: C.muted, align: 'right' });
        if (Tp) kit.label(c, 'T', Tp[0] + 6, Tp[1] - 2, { size: 11, color: C.muted, align: 'left' });
        kit.label(c, 'A', v.A[0] - 6, v.A[1] + 3, { size: 11, color: C.muted, align: 'right' });
        if (v.B) kit.label(c, 'B', v.B[0] + 6, v.B[1] + 3, { size: 11, color: C.muted, align: 'left' });
        kit.label(c, 'a', v.xl - 6, vy, { size: 12, weight: 700, color: Math.round(sv.state) === 0 ? C.bad : C.muted, align: 'right' });
        if (o.n === 3) kit.label(c, 'b', v.xr + 6, vy, { size: 12, weight: 700, color: Math.round(sv.state) === 2 ? C.bad : C.muted, align: 'left' });
        // supply: motor-pump, relief valve, tanks
        const px = 520, rx = 565;
        const suction = [[px, 391], [px, 405]], pumpToJ = [[px, 339], [px, 305], [rx, 305]], jToP = [[rx, 305], [v.P[0], 305], [v.P[0], v.P[1]]];
        const rOut = [[rx, 363], [rx, 380]];
        const tLine = Tp ? [[Tp[0], Tp[1]], [Tp[0], 290], [690, 290], [690, 395]] : null;
        const lineA = it.act === 'motor' ? [[v.A[0], v.A[1]], aPort] : [[v.A[0], v.A[1]], [v.A[0], 172], [aPort[0], 172], aPort];
        const lineB = bPort ? [[v.B[0], v.B[1]], [v.B[0], 152], [bPort[0], 152], bPort] : null;
        const motorOut = it.act === 'motor' ? [[595, 102], [595, 70], [720, 70], [720, 395]] : null;
        const stA = f.pA ? hp : (o.dir < 0 && o.moving && f.aT) ? 'return' : 'idle';
        const stB = f.pB ? hp : (o.dir > 0 && o.moving && f.bT) ? 'return' : 'idle';
        const tFlow = f.pT || (o.moving && ((o.dir < 0 && f.aT) || (o.dir > 0 && f.bT)));
        S.line(c, suction, { state: 'suction' });
        S.line(c, pumpToJ, { state: f.pT ? 'return' : hp });
        S.line(c, jToP, { state: f.pT ? 'return' : hp });
        S.line(c, rOut, { state: o.relief ? 'return' : 'idle' });
        S.line(c, lineA, { state: stA });
        if (lineB) S.line(c, lineB, { state: stB });
        if (tLine) S.line(c, tLine, { state: tFlow ? 'return' : 'idle' });
        if (motorOut) S.line(c, motorOut, { state: o.moving ? 'return' : 'idle' });
        S.junction(c, rx, 305);
        const sp = 70;
        S.flow(c, suction, ph('su', sp, dt), { color: col('suction') });
        S.flow(c, pumpToJ, ph('pj', sp, dt), { color: col(f.pT ? 'return' : hp) });
        if (o.moving || f.pT) S.flow(c, jToP, ph('jp', sp, dt), { color: col(f.pT ? 'return' : hp) });
        if (o.relief) S.flow(c, [[rx, 305], [rx, 330], [rx, 363], [rx, 380]], ph('rv', sp, dt), { color: col(hp) });
        if (o.moving) {
          if (f.pA) S.flow(c, lineA, ph('a', sp, dt), { color: col(hp) });
          else if (o.dir < 0) S.flow(c, lineA.slice().reverse(), ph('a', sp, dt), { color: col('return') });
          if (lineB) { if (f.pB) S.flow(c, lineB, ph('b', sp, dt), { color: col(hp) }); else if (o.dir > 0) S.flow(c, lineB.slice().reverse(), ph('b', sp, dt), { color: col('return') }); }
          if (motorOut) S.flow(c, motorOut, ph('mo', sp, dt), { color: col('return') });
        }
        if (tLine && tFlow) S.flow(c, tLine, ph('t', sp, dt), { color: col('return') });
        S.pump(c, px, 365, { motor: true });
        S.pressureValve(c, rx, 334, { kind: 'relief', rot: 180, open: o.relief ? 1 : 0 });
        S.tank(c, px, 415); S.tank(c, rx, 390);
        if (tLine) S.tank(c, 690, 405);
        if (motorOut) S.tank(c, 720, 405);
        // readouts
        const conns = o.spec.boxes[o.bx];
        const posName = o.n === 3 ? ['a — left square (Y1)', 'centre — normal (springs)', 'b — right square (Y2)'][o.bx] : ['a — left square (energised)', 'normal — right square (spring)'][o.bx];
        ro.set('pos', posName);
        ro.set('paths', connText(conns));
        let act;
        if (it.act === 'motor') act = o.moving ? 'motor turning' : 'motor stopped; pump flow over the relief valve';
        else if (o.moving) act = o.dir > 0 ? 'extending' : 'retracting';
        else if (f.pT) act = 'held; pump unloads to tank at low pressure';
        else if (f.fl) act = 'floating: free to be moved from outside';
        else if (o.dir !== 0) act = 'at the end of its stroke: pump flow over the relief valve';
        else act = 'held (ports blocked); pump flow over the relief valve';
        ro.set('act', act);
        kit.label(c, act, 595, 440, { size: 11.5, color: o.relief ? C.warn : C.muted, align: 'center' });
      }

      /* ---- the other symbols, drawn around (0, 0) at 1.5× in the detail panel */
      function drawOther(c, it, dt, C) {
        const col = S.col, L = (t, x, y, o) => kit.label(c, t, x, y, Object.assign({ size: 8, color: C.muted }, o || {}));
        const w = 0.5 + 0.5 * Math.sin(T * 0.9);
        switch (it.key) {
          case 'lines': {
            const l1 = [[-95, -112], [-8, -112]];
            S.line(c, l1, { state: 'pressure' }); S.flow(c, l1, ph('l1', 40, dt), { color: col('pressure') }); L('working line', -2, -112);
            S.line(c, [[-95, -84], [-8, -84]], { state: 'pilot' }); L('pilot (control) line', -2, -84);
            S.line(c, [[-95, -56], [-8, -56]], { kind: 'drain', state: 'return' }); L('drain (leakage) line', -2, -56);
            S.line(c, [[-95, -22], [-8, -22]], {}); S.line(c, [[-52, -22], [-52, 0]], {}); S.junction(c, -52, -22); L('joined: a dot', -2, -22);
            S.line(c, [[-95, 30], [-8, 30]], {}); S.line(c, [[-52, 12], [-52, 48]], {}); L('crossing: not joined', -2, 30);
            c.strokeStyle = C.text; c.lineWidth = 2.2; c.setLineDash([]); c.beginPath(); c.moveTo(-95, 82); c.quadraticCurveTo(-52, 50, -8, 82); c.stroke();
            L('flexible hose (arc)', -2, 76);
            c.setLineDash([8, 3, 2, 3]); c.lineWidth = 1.3; c.strokeRect(-95, 100, 88, 34); c.setLineDash([]);
            S.check(c, -52, 117, { rot: 90 }); L('one assembly (dash-dot)', -2, 117);
            break;
          }
          case 'pump': case 'vpump': {
            const disp = it.key === 'vpump' ? 0.15 + 0.85 * w : 1, sp = 55 * disp;
            const out = [[0, 24], [0, -40]], after = [[0, -72], [0, -100], [75, -100], [75, 85]], suc = [[0, 76], [0, 85]];
            S.line(c, suc, { state: 'suction' }); S.line(c, out, { state: 'pressure' }); S.line(c, after, { state: 'return' });
            S.line(c, [[35, -8], [35, 0], [0, 0]], { state: 'pressure' }); S.junction(c, 0, 0);
            S.flow(c, suc, ph('ps', sp, dt), { color: col('suction') }); S.flow(c, out, ph('po', sp, dt), { color: col('pressure') }); S.flow(c, after, ph('pa', sp, dt), { color: col('return') });
            S.pump(c, 0, 50, { motor: true, variable: it.key === 'vpump' });
            S.throttle(c, 0, -56, { adjustable: true }); S.tank(c, 0, 95); S.tank(c, 75, 95);
            S.gauge(c, 35, -29, { frac: 0.3 * disp + 0.1, value: (60 * disp * disp).toFixed(0) + ' bar' });
            L(it.key === 'vpump' ? 'displacement ' + (disp * 100).toFixed(0) + ' %: flow ' + (40 * disp).toFixed(0) + ' L/min' : 'flow 40 L/min, whatever the pressure', -95, 118, { align: 'left' });
            L('the throttle downstream sets the pressure', -95, 130, { align: 'left' });
            break;
          }
          case 'motor': {
            sv.ang += dt * 4;
            const inl = [[0, 100], [0, 26]], out = [[0, -26], [0, -70], [75, -70], [75, 90]];
            S.line(c, inl, { state: 'pressure' }); S.line(c, out, { state: 'return' });
            S.flow(c, inl, ph('mi', 55, dt), { color: col('pressure') }); S.flow(c, out, ph('mo', 55, dt), { color: col('return') });
            S.motor(c, 0, 0, { angle: sv.ang }); S.tank(c, 75, 100);
            L('from the valve: 200 bar', 6, 80, { align: 'left' }); L('to tank', 80, 40, { align: 'left' });
            L('torque = V_g Δp / 2π, speed = Q / V_g', -95, 125, { align: 'left' });
            break;
          }
          case 'cyl': case 'cyl1': {
            const cyc = (T % 6) / 6, ext = cyc < 0.5, pos = ext ? clamp(cyc / 0.4, 0, 1) : clamp(1 - (cyc - 0.5) / 0.4, 0, 1);
            const moving = ext ? cyc < 0.4 : cyc < 0.9;
            const cy = S.cylinder(c, -95, -20, { len: 100, h: 30, pos, rodLen: 95, single: it.key === 'cyl1' ? 'retract' : undefined,
              fillA: ext ? tint(C, RED[0], RED[1], 0.3) : null, fillB: !ext && it.key === 'cyl' ? tint(C, RED[0], RED[1], 0.3) : null });
            const a = [[cy.A[0], 90], cy.A], b = [[cy.B[0], 90], cy.B];
            S.line(c, a, { state: ext ? 'pressure' : moving ? 'return' : 'idle' });
            if (it.key === 'cyl') S.line(c, b, { state: !ext ? 'pressure' : moving ? 'return' : 'idle' });
            if (moving) {
              S.flow(c, ext ? a : a.slice().reverse(), ph('ca', 45, dt), { color: col(ext ? 'pressure' : 'return') });
              if (it.key === 'cyl') S.flow(c, ext ? b.slice().reverse() : b, ph('cb', 45, dt), { color: col(ext ? 'return' : 'pressure') });
            }
            L('A', cy.A[0] - 5, 70, { align: 'right' }); if (it.key === 'cyl') L('B', cy.B[0] + 5, 70, { align: 'left' });
            L(ext ? (moving ? 'oil into A: extending' : 'extended') : moving ? (it.key === 'cyl' ? 'oil into B: retracting' : 'spring returns it; oil back out of A') : 'retracted', -95, 118, { align: 'left' });
            break;
          }
          case 'check': {
            const dp = 40 * Math.sin(T * 1.1), open = dp > 0.5, p1 = 60 + dp, p2 = 60 - dp;
            const inl = [[0, 100], [0, 18]], out = [[0, -18], [0, -100]];
            S.line(c, inl, { state: open || p1 > 30 ? 'pressure' : 'idle' }); S.line(c, out, { state: 'pressure' });
            if (open) { S.flow(c, inl, ph('ci', 40, dt), { color: col('pressure') }); S.flow(c, out, ph('co', 40, dt), { color: col('pressure') }); }
            S.check(c, 0, 0, { open });
            L('p₁ = ' + p1.toFixed(0) + ' bar', 8, 70, { align: 'left' }); L('p₂ = ' + p2.toFixed(0) + ' bar', 8, -70, { align: 'left' });
            L(open ? 'p₁ > p₂: the ball lifts, oil flows up' : 'p₂ > p₁: the ball is pressed onto its seat — blocked', -95, 122, { align: 'left', color: open ? C.ok : C.warn });
            break;
          }
          case 'relief': {
            const pset = 160, p = pset * 1.06 * ((T % 5) / 5), open = clamp((p - 0.9 * pset) / (0.16 * pset), 0, 1);
            const inl = [[0, 100], [0, 29]], out = [[0, -29], [0, -70], [75, -70], [75, 90]];
            S.line(c, inl, { state: 'pressure' }); S.line(c, [[-50, 61], [-50, 70], [0, 70]], { state: 'pressure' }); S.junction(c, 0, 70);
            S.line(c, out, { state: open > 0 ? 'return' : 'idle' });
            if (open > 0) { S.flow(c, inl, ph('ri', 50 * open, dt), { color: col('pressure') }); S.flow(c, out, ph('ro', 50 * open, dt), { color: col('return') }); }
            S.pressureValve(c, 0, 0, { kind: 'relief', open });
            S.gauge(c, -50, 40, { frac: p / 250, value: p.toFixed(0) + ' bar' }); S.tank(c, 75, 100);
            L('setting ' + pset + ' bar: cracks near ' + (0.9 * pset).toFixed(0) + ', wide open at the setting', -95, 122, { align: 'left', color: open > 0 ? C.warn : C.muted });
            break;
          }
          case 'reducing': {
            const demand = w, open = 0.15 + 0.75 * demand, pout = 80 - 3 * demand;
            const inl = [[0, 100], [0, 29]], out = [[0, -29], [0, -100]];
            S.line(c, inl, { state: 'pressure' }); S.line(c, out, { state: 'metered' });
            S.flow(c, inl, ph('di', 15 + 50 * demand, dt), { color: col('pressure') }); S.flow(c, out, ph('do', 15 + 50 * demand, dt), { color: col('metered') });
            S.line(c, [[-50, 61], [-50, 70], [0, 70]], { state: 'pressure' }); S.junction(c, 0, 70);
            S.line(c, [[-50, -74], [-50, -60], [0, -60]], { state: 'metered' }); S.junction(c, 0, -60);
            S.pressureValve(c, 0, 0, { kind: 'reducing', open });
            S.gauge(c, -50, 40, { frac: 200 / 250, value: '200 bar' });
            S.gauge(c, -50, -95, { frac: pout / 250, value: pout.toFixed(0) + ' bar' });
            L('outlet flow demand ' + (demand * 100).toFixed(0) + ' %: the valve opens more, the outlet stays near 80 bar', -95, 122, { align: 'left' });
            break;
          }
          case 'throttle': {
            const op = 0.2 + 0.8 * w, q = 25 * op;
            const inl = [[0, 100], [0, 16]], out = [[0, -16], [0, -100]];
            S.line(c, inl, { state: 'pressure' }); S.line(c, out, { state: 'metered' });
            S.flow(c, inl, ph('ti', 60 * op, dt), { color: col('pressure') }); S.flow(c, out, ph('to', 60 * op, dt), { color: col('metered') });
            S.throttle(c, 0, 0, { adjustable: true });
            L('150 bar', 8, 70, { align: 'left' }); L('50 bar', 8, -70, { align: 'left' });
            L('opening ' + (op * 100).toFixed(0) + ' % → ' + q.toFixed(1) + ' L/min across 100 bar', -95, 122, { align: 'left' });
            L('heat: ' + (100 * q / 600).toFixed(2) + ' kW', -95, 134, { align: 'left', color: C.warn });
            break;
          }
          case 'accu': {
            const lvl = 0.5 + 0.38 * Math.sin(T * 0.8), charging = Math.cos(T * 0.8) > 0, p = 90 / (1 - 0.8 * lvl);
            const ln = [[0, -11], [0, 90]];
            S.line(c, ln, { state: 'pressure' });
            S.flow(c, charging ? ln.slice().reverse() : ln, ph('ac', 40 * Math.abs(Math.cos(T * 0.8)), dt), { color: col('pressure') });
            S.accumulator(c, 0, -40, { level: lvl });
            L('gas', 16, -58, { align: 'left' }); L('oil', 16, -28, { align: 'left' });
            L((charging ? 'charging' : 'discharging') + ': ' + p.toFixed(0) + ' bar', 8, 40, { align: 'left', color: C.text });
            L('pre-charge 90 bar; the gas is squeezed as oil enters', -95, 122, { align: 'left' });
            break;
          }
          case 'filter': case 'cooler': {
            const inl = [[0, -100], [0, -23]], out = [[0, 23], [0, 90]];
            S.line(c, inl, { state: 'return' }); S.line(c, out, { state: 'return' });
            S.flow(c, inl, ph('fi', 45, dt), { color: col('return') }); S.flow(c, out, ph('fo', 45, dt), { color: col('return') });
            if (it.key === 'filter') { S.filter(c, 0, 0, {}); const dp = 0.6 + 2.6 * ((T % 12) / 12); L('Δp across the element ' + dp.toFixed(1) + ' bar' + (dp > 2.5 ? ': change it' : ''), -95, 122, { align: 'left', color: dp > 2.5 ? C.warn : C.muted }); }
            else { S.cooler(c, 0, 0, {}); L('in 58 °C', 8, -60, { align: 'left' }); L('out 49 °C', 8, 60, { align: 'left' }); L('heat out = ρ c Q ΔT', -95, 122, { align: 'left' }); }
            S.tank(c, 0, 100);
            break;
          }
          case 'gauge': {
            const p = 120 + 60 * Math.sin(T * 1.3);
            c.save(); c.scale(2.2, 2.2);
            S.gauge(c, 0, -12, { frac: p / 250, value: p.toFixed(0) + ' bar' });
            c.restore();
            L('gauge pressure: 0 at atmospheric', -95, 122, { align: 'left' });
            break;
          }
        }
      }

      const loop = kit.loop((dt) => {
        T += dt;
        g = fit(st, W0, H0);
        const c = begin(st, g), C = kit.colors();
        // gallery
        SYMBOLS.forEach((it, i) => {
          const [x, y] = tileAt(i);
          rrect(c, x, y, TW - 4, TH - 4, 7);
          c.fillStyle = i === sel ? tint(C, '123,140,255', '60,80,220', 0.16) : C.surface; c.fill();
          c.strokeStyle = i === sel ? C.accent : C.grid; c.lineWidth = i === sel ? 2 : 1; c.stroke();
          c.save(); drawTile(c, it, x + (TW - 4) / 2, y + 36); c.restore();
          kit.label(c, it.tile, x + (TW - 4) / 2, y + TH - 14, { size: 10.5, color: i === sel ? C.text : C.muted, align: 'center', weight: i === sel ? 700 : 500 });
        });
        // detail panel
        rrect(c, 432, 4, 324, 448, 8); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.grid; c.lineWidth = 1; c.stroke();
        const it = SYMBOLS[sel];
        kit.label(c, it.name, 594, 22, { size: 13, weight: 700, align: 'center' });
        if (it.spec) drawValveCircuit(c, it, dt, C);
        else { c.save(); c.translate(596, 250); c.scale(1.5, 1.5); drawOther(c, it, dt, C); c.restore(); }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fp-trace */
  const TRACE_COMP = [
    { id: '0M1', name: 'Electric motor', box: [94, 346, 122, 374], wrong: ['Hydraulic motor', 'Pressure gauge', 'Fixed pump'],
      desc: '<b>0M1 — electric motor</b>, the prime mover. It turns the pump at about 1450 rpm; the pump turns its rotation into flow.' },
    { id: '0P1', name: 'Variable pump', box: [132, 342, 170, 378], wrong: ['Hydraulic motor', 'Fixed pump', 'Compressor'],
      desc: '<b>0P1 — variable-displacement pump</b> (a piston pump, set by hand here). Filled triangle pointing out: it delivers oil. Its internal leakage returns to the tank through the case-drain line (short dashes).' },
    { id: '0V2', name: 'Check valve', box: [140, 286, 160, 320], wrong: ['Pilot-operated check', 'Shuttle valve', 'Throttle'],
      desc: '<b>0V2 — check valve.</b> Oil may leave the pump but never be pushed back into it, for example by a load when the pump stops.' },
    { id: '0Z1', name: 'Pressure gauge', box: [100, 242, 124, 266], wrong: ['Flow meter', 'Pressure switch', 'Thermometer'],
      desc: '<b>0Z1 — pressure gauge</b> on the pump line: it shows what the load (or the relief valve) demands.' },
    { id: '0V1', name: 'Relief valve', box: [205, 300, 266, 340], wrong: ['Pressure-reducing valve', 'Sequence valve', 'Throttle'],
      desc: '<b>0V1 — pressure-relief valve.</b> Normally closed, piloted from its inlet: it caps the pressure. Whenever the pump flow has nowhere else to go — valve centred, cylinder at the end of its stroke — it all crosses this valve to the tank, as heat.' },
    { id: '1V1', name: '4/3 directional valve', box: [224, 215, 407, 255], wrong: ['4/2 directional valve', '5/3 directional valve', '4/3 tandem-centre valve'],
      desc: '<b>1V1 — 4/3 directional valve</b>, closed centre, solenoids 1Y1 and 1Y2, spring-centred. 1Y1: P→A and B→T (extend). 1Y2: P→B and A→T (retract). Centre: every port blocked.' },
    { id: '1V2', name: 'Pilot-operated check', box: [228, 120, 262, 160], wrong: ['Check valve', 'Counterbalance valve', 'Relief valve'],
      desc: '<b>1V2 — pilot-operated check valve.</b> Free flow into the cap end; blocks flow out, so the load is held without creeping in the centre position. Pressure in the pilot line from B lifts it off its seat so the cap end can empty when the rod retracts.' },
    { id: '1V3', name: 'One-way flow control', box: [380, 110, 430, 170], wrong: ['Throttle only', 'Pressure-compensated flow control', 'Check valve'],
      desc: '<b>1V3 — one-way flow control.</b> Oil leaving the rod end must squeeze through the throttle — meter-out speed control while extending. Oil entering the rod end bypasses it through the check valve.' },
    { id: '1A1', name: 'Double-acting cylinder', box: [230, 44, 400, 80], wrong: ['Single-acting cylinder', 'Rotary actuator', 'Telescopic cylinder'],
      desc: '<b>1A1 — double-acting cylinder</b> pushing a load. Cap end on the left (A), rod end on the right (B).' },
    { id: '0Z2', name: 'Filter', box: [436, 316, 464, 344], wrong: ['Cooler', 'Heater', 'Water separator'],
      desc: '<b>0Z2 — return-line filter.</b> Everything returning to the tank is filtered, typically to 10 µm.' },
    { id: '0Z3', name: 'Cooler', box: [428, 370, 472, 400], wrong: ['Filter', 'Heater', 'Flow meter'],
      desc: '<b>0Z3 — oil cooler.</b> Arrows pointing out: it removes the heat made by the losses — above all by the relief valve and the throttle.' },
    { id: '0Z4', name: 'Tank', box: [136, 405, 164, 428], more: [[176, 405, 204, 428], [226, 360, 254, 383], [436, 418, 464, 441]], wrong: ['Accumulator', 'Filter', 'Pressurised reservoir'],
      desc: '<b>0Z4 — reservoir (tank)</b>, at atmospheric pressure. Every tank symbol on the drawing is the same tank: drawing it several times saves long return lines.' }
  ];
  const TRACE_LINES = [
    { id: 'suction', kind: 'work', pts: [[150, 386], [150, 405]], name: 'Suction line: tank to pump inlet, short and wide so the inlet stays full.' },
    { id: 'pumpOut', kind: 'work', pts: [[150, 334], [150, 321]], name: 'Pump outlet, to the check valve 0V2.' },
    { id: 'header', kind: 'work', pts: [[150, 285], [307.8, 285], [307.8, 263]], name: 'Pressure line: pump to port P of the valve, guarded by the relief valve and the gauge.' },
    { id: 'gaugeL', kind: 'work', pts: [[112, 275], [112, 285], [150, 285]], name: 'Gauge connection.', small: true },
    { id: 'reliefIn', kind: 'work', pts: [[240, 285], [240, 291]], name: 'Relief-valve inlet.', small: true },
    { id: 'reliefOut', kind: 'work', pts: [[240, 349], [240, 360]], name: 'Relief-valve outlet to the tank.' },
    { id: 'drain', kind: 'drain', pts: [[164, 368], [190, 368], [190, 405]], name: 'Case drain (short dashes): the pump\'s internal leakage, returned to the tank at almost no pressure.' },
    { id: 'Amid', kind: 'work', pts: [[307.8, 207], [307.8, 190], [238, 190], [238, 158]], name: 'Line A: valve port A to the pilot-operated check valve.' },
    { id: 'Atop', kind: 'work', pts: [[238, 122], [238, 89]], name: 'Cap-end line, between the pilot-operated check and the cylinder.' },
    { id: 'Bmid', kind: 'work', pts: [[322.2, 207], [322.2, 196], [392, 196], [392, 168]], name: 'Line B: valve port B to the flow control.' },
    { id: 'Btop', kind: 'work', pts: [[392, 112], [392, 89]], name: 'Rod-end line, between the flow control and the cylinder. Extending, it is at the back-pressure the throttle makes — which the area ratio can push above the pump pressure.' },
    { id: 'pilot', kind: 'pilot', pts: [[254, 152], [275, 152], [275, 176], [350, 176], [350, 196]], name: 'Pilot line (long dashes): pressure in line B opens the pilot-operated check.' },
    { id: 'Tline', kind: 'work', pts: [[322.2, 263], [322.2, 300], [450, 300], [450, 307]], name: 'Return line: port T to the filter.' },
    { id: 'F2C', kind: 'work', pts: [[450, 353], [450, 362]], name: 'Filter to cooler.', small: true },
    { id: 'C2T', kind: 'work', pts: [[450, 408], [450, 418]], name: 'Cooler to tank.' }
  ];
  const STATE_ANS = ['Pressure oil from the pump', 'Return oil to the tank', 'Suction oil', 'No flow (blocked or closed)'];
  const KIND_ANS = ['Working line', 'Pilot (control) line', 'Drain (leakage) line', 'Flexible hose'];

  Hyper.sim('fp-trace', {
    title: 'Trace the circuit',
    blurb: `A cylinder circuit drawn to ISO 1219, laid out the usual way: power supply at the bottom, valves in the middle, the cylinder at the top. Components carry codes in the style of ISO 1219-2 (circuit number, letter, running number).

**Try this**
- **Explore**: click any component or line to read what it does; shift the valve with **Y1**, **centre** and **Y2** and watch the colours: **red** pressure, **blue** return, **yellow** throttled, **orange** pilot, **green** suction, grey no flow.
- Centre the valve with the rod mid-stroke: the pilot-operated check holds the load, and the pump flow crosses the relief valve.
- **Name the component**: a component is ringed; pick its name. The wrong answers are the usual confusions.
- **Line kinds and states**: a line is highlighted and the valve is set; say what kind of line it is, or what it carries now. The colours are revealed after you answer.`,
    mount(box, kit, params) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const W0 = 760, H0 = 450;
      const s = { mode: (params && params.mode) || 'explore', box: 1, state: 1, pos: 0.35, auto: false, autoT: 0, autoSeq: 0, sel: null, score: 0, total: 0, q: null };
      const ph = phaser();
      let g = fit(st, W0, H0), T = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Mode', options: [['Explore', 'explore'], ['Name the component', 'name'], ['Line kinds and states', 'lines']], value: s.mode },
        { type: 'buttons', items: [{ id: 'y1', label: 'Y1 (extend)' }, { id: 'y0', label: 'Centre' }, { id: 'y2', label: 'Y2 (retract)' }] },
        { id: 'auto', type: 'check', label: 'Cycle automatically', value: false },
        { type: 'buttons', items: [{ id: 'next', label: 'Next question' }] },
        { id: 'info', type: 'html', html: '' }
      ], (id, v) => {
        if (id === 'mode') setMode(v);
        if (id === 'y1' || id === 'y0' || id === 'y2') { if (s.mode === 'explore') { s.box = id === 'y1' ? 0 : id === 'y2' ? 2 : 1; s.auto = false; ctl.set('auto', false); } }
        if (id === 'auto') s.auto = v;
        if (id === 'next' && s.mode !== 'explore') newQuestion();
      });
      const ro = kit.readout(box.side, [['score', 'Score'], ['valve', 'Valve 1V1'], ['cyl', 'Cylinder']]);
      const info = h => { if (ctl.rows.info && ctl.rows.info.set) ctl.rows.info.set(h); };
      function setMode(m) {
        s.mode = m; s.sel = null; s.score = 0; s.total = 0; s.q = null;
        const ex = m === 'explore';
        for (const b of ['y1', 'y0', 'y2', 'auto']) ctl.show(b, ex);
        ctl.show('next', !ex);
        if (ex) { s.box = 1; info('Click a component or a line to see what it does.'); }
        else newQuestion();
      }
      function lineState(id, bx, moving, relief) {
        switch (id) {
          case 'suction': return 'suction';
          case 'pumpOut': case 'header': case 'gaugeL': case 'reliefIn': return 'pressure';
          case 'reliefOut': return relief ? 'return' : 'none';
          case 'drain': return 'return';
          case 'Amid': case 'Atop': return bx === 0 ? 'pressure' : bx === 2 && moving ? 'return' : 'none';
          case 'Bmid': return bx === 2 ? 'pressure' : bx === 0 && moving ? 'return' : 'none';
          case 'Btop': return bx === 2 ? 'pressure' : bx === 0 && moving ? 'metered' : 'none';
          case 'pilot': return bx === 2 ? 'pilot' : 'none';
          default: return bx !== 1 && moving ? 'return' : 'none';
        }
      }
      const SCEN = ['1Y1 energised: the rod is extending.', 'Valve centred: the rod is stopped in mid-stroke, holding the load.', '1Y2 energised: the rod is retracting.'];
      function newQuestion() {
        const q = { answered: -1, t: 0 };
        if (s.mode === 'name') {
          let comp; do { comp = TRACE_COMP[Math.floor(Math.random() * TRACE_COMP.length)]; } while (s.q && s.q.comp === comp && TRACE_COMP.length > 1);
          q.comp = comp; q.choices = shuffle([comp.name].concat(comp.wrong)); q.ans = q.choices.indexOf(comp.name);
          q.prompt = 'What is the ringed component?';
          s.box = [0, 1, 2][Math.floor(Math.random() * 3)];
        } else {
          const kindQ = Math.random() < 0.35;
          const pool = TRACE_LINES.filter(l => !l.small && (kindQ || l.kind === 'work'));
          let line; do { line = pool[Math.floor(Math.random() * pool.length)]; } while (s.q && s.q.line === line && pool.length > 1);
          q.line = line; q.kindQ = kindQ;
          s.box = [0, 1, 2][Math.floor(Math.random() * 3)];
          if (kindQ) { q.choices = KIND_ANS.slice(); q.ans = line.kind === 'pilot' ? 1 : line.kind === 'drain' ? 2 : 0; q.prompt = 'What kind of line is the highlighted one?'; }
          else {
            const stt = lineState(line.id, s.box, s.box !== 1, s.box === 1);
            q.choices = STATE_ANS.slice(); q.ans = stt === 'pressure' ? 0 : stt === 'suction' ? 2 : stt === 'none' ? 3 : 1;
            q.prompt = SCEN[s.box] + ' What does the highlighted line carry now?';
          }
        }
        s.pos = s.box === 2 ? 0.65 : 0.35;
        s.q = q;
        info(s.mode === 'name' ? 'Pick the name of the ringed component on the right.' : 'Pick an answer on the right. Colours appear once you have answered.');
      }
      const answerBox = i => [540, 244 + i * 46, 750, 244 + i * 46 + 38];
      function answer(i) {
        const q = s.q; if (!q || q.answered >= 0) return;
        q.answered = i; q.t = 0; s.total++;
        const ok = i === q.ans; if (ok) s.score++;
        const what = q.comp ? q.comp.desc : q.line.name;
        info((ok ? '<b>Right.</b> ' : '<b>Not quite</b> — it is: ' + q.choices[q.ans] + '. ') + what);
      }
      function hitThing(p) {
        for (const cmp of TRACE_COMP) if (inBox(p, cmp.box) || (cmp.more || []).some(b => inBox(p, b))) return { comp: cmp };
        let best = null, bd = 7;
        for (const l of TRACE_LINES) { const d = polyDist(p, l.pts); if (d < bd) { bd = d; best = l; } }
        return best ? { line: best } : null;
      }
      kit.click(st, pp => {
        const p = toDesign(g, pp);
        if (s.mode === 'explore') {
          const h = hitThing(p); if (!h) return;
          s.sel = h;
          if (h.comp) info(h.comp.desc);
          else { const stt = lineState(h.line.id, Math.round(s.state), moving(), reliefFlow()); info('<b>' + (h.line.kind === 'work' ? 'Working line' : h.line.kind === 'pilot' ? 'Pilot line' : 'Drain line') + '.</b> ' + h.line.name + ' Now: ' + ({ pressure: 'pressure oil from the pump', return: 'return oil to the tank', metered: 'return oil held back by the throttle', suction: 'suction', pilot: 'pilot pressure', none: 'no flow' })[stt] + '.'); }
        } else if (s.q) {
          for (let i = 0; i < 4; i++) if (inBox(p, answerBox(i))) { answer(i); return; }
        }
      }, pp => { const p = toDesign(g, pp); return s.mode === 'explore' ? !!hitThing(p) : [0, 1, 2, 3].some(i => inBox(p, answerBox(i))); });
      const moving = () => { const bx = Math.round(s.state); return (bx === 0 && s.pos < 1) || (bx === 2 && s.pos > 0); };
      const reliefFlow = () => !moving();
      setMode(s.mode);

      const loop = kit.loop((dt) => {
        T += dt;
        // valve: automatic cycling in explore mode
        if (s.mode === 'explore' && s.auto) {
          s.autoT += dt;
          const bx = Math.round(s.state), still = !moving();
          if ((bx === 1 && s.autoT > 1.5) || (bx !== 1 && still && s.autoT > 0.8)) { s.autoSeq = (s.autoSeq + 1) % 4; s.box = [0, 1, 2, 1][s.autoSeq]; s.autoT = 0; }
          if (bx !== 1 && !still) s.autoT = 0;
        }
        s.state += clamp(s.box - s.state, -dt / 0.12, dt / 0.12);
        const bx = Math.round(s.state);
        const speed = s.mode === 'lines' ? 0.03 : 0.2;
        if (bx === 0) s.pos = Math.min(1, s.pos + speed * dt); else if (bx === 2) s.pos = Math.max(0, s.pos - speed * dt);
        if (s.mode === 'lines') { if (bx === 0 && s.pos > 0.9) s.pos = 0.35; if (bx === 2 && s.pos < 0.1) s.pos = 0.65; }
        const mv = moving(), rel = reliefFlow();
        if (s.q) { s.q.t += dt; if (s.q.answered >= 0 && s.q.t > 2.2) newQuestion(); }
        const reveal = s.mode !== 'lines' || (s.q && s.q.answered >= 0);
        ro.set('score', s.mode === 'explore' ? '—' : s.score + ' / ' + s.total);
        ro.set('valve', ['1Y1: P→A, B→T', 'centre: all ports blocked', '1Y2: P→B, A→T'][bx]);
        ro.set('cyl', mv ? (bx === 0 ? 'extending' : 'retracting') : bx === 1 ? 'held by 1V2' : 'at the end of its stroke');

        g = fit(st, W0, H0);
        const c = begin(st, g), C = kit.colors(), col = S.col;
        const pulse = 0.5 + 0.5 * Math.sin(T * 6);
        // highlight under the drawing
        if (s.q && s.q.line) { c.globalAlpha = 0.35 + 0.35 * pulse; S.line(c, s.q.line.pts, { color: C.accent, width: 9 }); c.globalAlpha = 1; }
        if (s.mode === 'explore' && s.sel && s.sel.line) { c.globalAlpha = 0.35; S.line(c, s.sel.line.pts, { color: C.accent, width: 8 }); c.globalAlpha = 1; }
        // lines
        for (const l of TRACE_LINES) {
          const stt = lineState(l.id, bx, mv, rel);
          const o = { kind: l.kind };
          if (reveal) o.state = stt === 'none' ? 'idle' : stt; else o.color = C.text;
          S.line(c, l.pts, o);
          if (reveal && stt !== 'none' && stt !== 'pilot' && l.id !== 'gaugeL') {
            let pts = l.pts;
            if ((l.id === 'Amid' || l.id === 'Atop') && bx === 2) pts = pts.slice().reverse();
            if ((l.id === 'Bmid' || l.id === 'Btop') && bx === 0) pts = pts.slice().reverse();
            if (l.id === 'header' && !mv) pts = [[150, 285], [240, 285]];
            const always = l.id === 'suction' || l.id === 'pumpOut' || l.id === 'drain' || l.id === 'reliefOut' || l.id === 'header';
            const flowing = always || (l.id === 'reliefIn' ? rel : mv);
            if (flowing) S.flow(c, pts, ph(l.id, l.id === 'drain' ? 12 : 60, dt), { color: col(stt) });
          }
        }
        S.junction(c, 150, 285); S.junction(c, 240, 285); S.junction(c, 350, 196);
        // components
        const fill = on => on ? tint(C, RED[0], RED[1], 0.3) : null;
        const cy = S.cylinder(c, 230, 62, { len: 170, h: 34, pos: s.pos, rodLen: 175, fillA: reveal && (bx === 0 || bx === 1) ? fill(true) : null, fillB: reveal && bx === 2 ? fill(true) : null });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(cy.tip[0], 42, 40, 40); c.strokeRect(cy.tip[0], 42, 40, 40);
        kit.arrow(c, cy.tip[0] + 72, 62, cy.tip[0] + 44, 62, C.warn, 2.4);
        kit.label(c, 'load', cy.tip[0] + 20, 32, { size: 11, color: C.muted, align: 'center' });
        S.check(c, 238, 140, { pilot: true, open: bx === 0 && mv || bx === 2 });
        S.flowControl(c, 392, 140, { free: 'up' });
        const v = S.valve(c, 315, 235, { spec: '4/3 closed', s: 36, state: s.state, left: 'spring+solenoid', right: 'spring+solenoid' });
        kit.label(c, '1Y1', v.xl - 4, 235, { size: 10.5, weight: 700, color: bx === 0 ? C.bad : C.muted, align: 'right' });
        kit.label(c, '1Y2', v.xr + 4, 235, { size: 10.5, weight: 700, color: bx === 2 ? C.bad : C.muted, align: 'left' });
        for (const [t, x, y, a] of [['A', 302, 200, 'right'], ['B', 328, 200, 'left'], ['P', 302, 270, 'right'], ['T', 328, 270, 'left']]) kit.label(c, t, x, y, { size: 9.5, color: C.muted, align: a });
        S.pump(c, 150, 360, { motor: true, variable: true });
        S.check(c, 150, 303, { open: true });
        S.gauge(c, 112, 254, { frac: (rel ? 160 : 95) / 250, value: reveal ? (rel ? '160 bar' : '95 bar') : '' });
        S.pressureValve(c, 240, 320, { kind: 'relief', rot: 180, open: rel ? 1 : 0 });
        S.filter(c, 450, 330); S.cooler(c, 450, 385);
        S.tank(c, 150, 415); S.tank(c, 190, 415); S.tank(c, 240, 370); S.tank(c, 450, 428);
        // codes
        const code = (t, x, y, a) => kit.label(c, t, x, y, { size: 10, color: C.muted, align: a || 'left', weight: 600 });
        if (s.mode !== 'name') {
          code('1A1', 232, 34); code('1V2', 222, 140, 'right'); code('1V3', 436, 128); code('1V1', 380, 272); code('0V2', 134, 303, 'right');
          code('0V1', 272, 322); code('0P1', 178, 352); code('0M1', 108, 386, 'center'); code('0Z1', 112, 232, 'center'); code('0Z2', 472, 330); code('0Z3', 478, 385); code('0Z4', 150, 440, 'center');
        }
        // selection / question ring
        const ring = (cmp, a) => { for (const b of [cmp.box].concat(cmp.more || [])) { rrect(c, b[0] - 4, b[1] - 4, b[2] - b[0] + 8, b[3] - b[1] + 8, 6); c.strokeStyle = C.accent; c.globalAlpha = a; c.lineWidth = 2.5; c.stroke(); c.globalAlpha = 1; } };
        if (s.q && s.q.comp) ring(s.q.comp, 0.5 + 0.5 * pulse);
        if (s.mode === 'explore' && s.sel && s.sel.comp) ring(s.sel.comp, 0.9);
        // right-hand panel
        if (s.mode === 'explore') {
          kit.label(c, 'Line colours', 540, 150, { size: 12, weight: 700 });
          [['pressure', 'pressure from the pump'], ['return', 'return to the tank'], ['metered', 'throttled (metered)'], ['pilot', 'pilot pressure'], ['suction', 'suction'], ['idle', 'no flow']].forEach(([k, t], i) => {
            S.line(c, [[540, 176 + i * 24], [578, 176 + i * 24]], { state: k, kind: k === 'pilot' ? 'pilot' : 'work' });
            kit.label(c, t, 586, 176 + i * 24, { size: 11.5, color: C.text });
          });
          kit.label(c, 'Click a component or a line.', 540, 330, { size: 11.5, color: C.muted });
          kit.label(c, 'Dashes: long = pilot, short = drain.', 540, 350, { size: 11.5, color: C.muted });
        } else if (s.q) {
          const q = s.q;
          kit.label(c, 'Score ' + s.score + ' / ' + s.total, 750, 128, { size: 12, weight: 700, align: 'right', color: C.muted });
          para(kit, c, q.prompt, 540, 156, 210, { size: 12.5, weight: 600, lh: 17 });
          q.choices.forEach((t, i) => {
            const b = answerBox(i), done = q.answered >= 0, right = i === q.ans, picked = i === q.answered;
            rrect(c, b[0], b[1], b[2] - b[0], b[3] - b[1], 7);
            c.fillStyle = done && right ? tint(C, '34,179,122', '18,146,90', 0.25) : done && picked ? tint(C, '229,72,77', '214,40,40', 0.22) : C.surface; c.fill();
            c.strokeStyle = done && right ? C.ok : done && picked ? C.bad : C.grid; c.lineWidth = 1.5; c.stroke();
            para(kit, c, t, b[0] + 10, (b[1] + b[3]) / 2 - (wrap(c, t, 190, 11.5).length - 1) * 7, 190, { size: 11.5, lh: 14 });
          });
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fp-sankey */
  /* A quasi-steady model of a power unit driving an 80/45 mm cylinder against a load, through a 4/3 valve
     (5 bar per path at 40 L/min) and 6 m of hose each way (Darcy with kit.fluid.friction and the viscosity of
     ISO VG 46 oil at the chosen temperature). Pump leakage grows with pressure and falls with viscosity. */
  function powerFlow(F, o) {
    const D = 0.08, dr = 0.045, A1 = Math.PI * D * D / 4, A2 = A1 - Math.PI * dr * dr / 4, rho = 870;
    const nu = F.oilViscosity(46, o.T), nu40 = F.oilViscosity(46, 40);
    const load = o.F, Ff = 0.03 * load + 400, pr = o.pr, Qmax = o.Qmax, d = o.d;
    const dpv = Q => 5e5 * Math.pow(Q / (40 / 60000), 2);
    const dpl = Q => {
      if (Q <= 1e-9) return 0;
      const A = Math.PI * d * d / 4, v = Q / A, Re = v * d / nu, f = F.friction(Math.max(Re, 1), 5e-5);
      return f * (6 / d) * rho * v * v / 2;
    };
    const need = Q => {
      const v = Q / A1, Qr = v * A2, pb = dpv(Qr) + dpl(Qr), pc = (load + Ff + pb * A2) / A1;
      return { v, Qr, pb, pc, p: pc + dpv(Q) + dpl(Q) };
    };
    const leak = p => 0.05 * Qmax * Math.max(p, 0) / 2.5e7 * nu40 / nu;
    const Qwant = o.v * A1;
    let Qc = 0, ps = 0, Qth = 0, Qrel = 0, dpth = 0, stalled = false, limited = false;
    const maxQ = cond => { let lo = 0, hi = Qwant; if (cond(hi)) return hi; for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (cond(m)) lo = m; else hi = m; } return lo; };
    if (o.mode === 'fixed') {
      Qth = Qmax;
      const Qp = p => Qth - leak(p);
      if (need(0).p >= pr) { stalled = Qwant > 0; ps = pr; Qc = 0; }
      else if (Qwant <= Qp(pr) && need(Qwant).p <= pr) { ps = pr; Qc = Qwant; dpth = pr - need(Qc).p; }
      else { Qc = maxQ(Q => need(Q).p <= pr && Q <= Qp(need(Q).p)); ps = need(Qc).p; limited = true; }
      Qrel = Math.max(0, Qp(ps) - Qc);
    } else {
      const margin = o.mode === 'ls' ? 20e5 : 0;
      if (Qwant > 0 && need(0).p + margin >= pr) { stalled = true; Qc = 0; ps = pr; }
      else {
        Qc = maxQ(Q => need(Q).p + margin <= pr && Q + leak(need(Q).p + margin) <= Qmax);
        limited = Qc < Qwant - 1e-9;
        ps = Qc > 0 ? need(Qc).p + margin : margin > 0 ? margin : need(0).p * 0;
      }
      dpth = Qc > 0 ? margin : 0;
      Qth = Qc + leak(ps);
    }
    const nd = need(Qc), Qp = Qth - leak(ps);
    const spd = o.mode === 'vsd' ? Qth / Qmax : 1;
    const Pshaft = ps * Qth / 0.93 + 200 * spd + 20;
    const Pe = Pshaft / (o.mode === 'vsd' ? 0.9 : 0.93);
    const r = {
      mode: o.mode, Pe, Pshaft, ps, Qth, Qp, Qc, Qrel, dpth, stalled, limited, v: nd.v, pc: Qc > 0 ? nd.pc : (load + Ff) / A1, nu,
      lMotor: Pe - Pshaft, lPump: Pshaft - ps * Qp, lRelief: ps * Qrel, lThrottle: dpth * Qc,
      lLines: (dpv(Qc) + dpl(Qc)) * Qc + nd.pb * nd.Qr, lFric: Ff * nd.v, useful: load * nd.v, dpLine: dpl(Qc)
    };
    r.heat = r.lPump + r.lRelief + r.lThrottle + r.lLines + r.lFric;
    r.eta = r.useful / Math.max(Pe, 1);
    return r;
  }

  Hyper.sim('fp-sankey', {
    title: 'Where the power goes',
    blurb: `A power unit drives an 80/45 mm cylinder against a load, through a directional valve and 6 m of hose each way. The band is the power, from the electricity going in to the useful work $F v$ coming out; every loss peels off downwards, and all but the motor's own loss ends up as **heat in the oil**. The graph below compares the overall efficiency of the three kinds of supply over the whole speed range, with your operating point marked.

**Try this**
- Fixed pump: set the wanted speed to zero. Nothing moves, yet the relief valve turns almost all the power into heat.
- Still with the fixed pump, raise the speed until the throttle has nothing left to do: the efficiency is best when the pump flow just matches the cylinder's needs.
- Switch to load sensing: the relief loss disappears; only the 20 bar margin is throttled. The variable-speed drive loses even that.
- Cool the oil to 10 °C: the viscosity rises steeply and the hose losses grow. Heat it to 90 °C: the pump leaks more.
- Raise the load above what the relief setting allows: the cylinder stalls.`,
    mount(box, kit) {
      const Fl = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const plotBox = document.createElement('div'); plotBox.style.padding = '4px 10px 10px'; box.stage.appendChild(plotBox);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Supply', options: [['Fixed pump + relief valve, meter-in throttle', 'fixed'], ['Load-sensing variable pump (20 bar margin)', 'ls'], ['Variable-speed pump drive', 'vsd']], value: 'fixed' },
        { id: 'F', label: 'Load force', min: 0, max: 100, step: 1, value: 40, unit: 'kN' },
        { id: 'v', label: 'Wanted cylinder speed', min: 0, max: 200, step: 1, value: 80, unit: 'mm/s' },
        { id: 'pr', label: 'Relief (maximum) pressure', min: 60, max: 250, step: 5, value: 180, unit: 'bar' },
        { id: 'Q', label: 'Pump size (flow at full speed)', min: 20, max: 100, step: 1, value: 40, unit: 'L/min' },
        { id: 'T', label: 'Oil temperature', min: 10, max: 90, step: 1, value: 45, unit: '°C' },
        { id: 'd', type: 'select', label: 'Hose bore', options: [['10 mm', 0.010], ['13 mm', 0.013], ['16 mm', 0.016], ['19 mm', 0.019]], value: 0.013 }
      ], () => sweep());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pe', 'Electrical input'], ['use', 'Useful power F·v'], ['eta', 'Overall efficiency'], ['heat', 'Heat into the oil'], ['pq', 'Pump pressure, flow'], ['cyl', 'Cylinder speed, cap pressure'], ['dT', 'Oil warming at the largest drop'], ['nu', 'Oil viscosity']]);
      const plot = kit.plot(plotBox, { x: { label: 'wanted cylinder speed (mm/s)', min: 0, max: 200 }, y: { label: 'overall efficiency (%)', min: 0 }, legend: true }, 170);
      const opts = mode => ({ mode, F: V.F * 1000, v: V.v / 1000, pr: V.pr * 1e5, Qmax: V.Q / 60000, T: V.T, d: V.d });
      function sweep() {
        const names = { fixed: 'fixed pump + relief', ls: 'load sensing', vsd: 'variable speed' };
        const series = ['fixed', 'ls', 'vsd'].map((m, i) => {
          const pts = [];
          for (let vv = 0; vv <= 200; vv += 5) { const o = opts(m); o.v = vv / 1000; pts.push([vv, powerFlow(Fl, o).eta * 100]); }
          return { pts, label: names[m], dash: i === 1 ? [6, 4] : i === 2 ? [2, 3] : undefined };
        });
        const r = powerFlow(Fl, opts(V.mode));
        plot.set({ series, marks: [{ x: V.v, y: r.eta * 100, label: (r.eta * 100).toFixed(0) + ' %' }] });
      }
      sweep();
      const kw = w => (w / 1000).toFixed(w < 9950 ? 2 : 1) + ' kW';
      const loop = kit.loop(() => {
        const r = powerFlow(Fl, opts(V.mode));
        ro.set('pe', kw(r.Pe));
        ro.set('use', kw(r.useful));
        ro.set('eta', (r.eta * 100).toFixed(1) + ' %');
        ro.set('heat', kw(r.heat));
        ro.set('pq', (r.ps / 1e5).toFixed(0) + ' bar, ' + (r.Qp * 60000).toFixed(1) + ' L/min');
        ro.set('cyl', (r.v * 1000).toFixed(0) + ' mm/s, ' + (r.pc / 1e5).toFixed(0) + ' bar');
        const bigDrop = r.lRelief > 1 ? r.ps : r.dpth;
        ro.set('dT', (bigDrop / (870 * 1900)).toFixed(1) + ' K per pass');
        ro.set('nu', (r.nu * 1e6).toFixed(0) + ' mm²/s');
        // ---- the Sankey diagram, on a 760 × 420 design grid
        const g = fit(st, 760, 420), c = begin(st, g), C = kit.colors();
        const Pe = Math.max(r.Pe, 1), sc = 100 / Pe, y0 = 92, yB = 322, r0 = 8, xs = [120, 220, 320, 420, 520, 620], xe = 690;
        const losses = [
          { k: 'Electric motor', v: r.lMotor, col: C.muted, note: 'heat to the air' },
          { k: 'Pump', v: r.lPump, col: C.warn, note: 'leakage, friction' },
          { k: 'Relief valve', v: r.lRelief, col: C.bad, note: r.mode === 'fixed' ? 'surplus flow' : 'closed' },
          { k: r.mode === 'ls' ? 'LS margin' : 'Throttle', v: r.lThrottle, col: C.bad, note: r.mode === 'vsd' ? 'none needed' : r.mode === 'ls' ? 'compensator' : 'meter-in' },
          { k: 'Valve, hoses', v: r.lLines, col: C.warn, note: 'both ways' },
          { k: 'Cylinder seals', v: r.lFric, col: C.warn, note: 'friction' }
        ];
        const captions = ['electrical', 'pump shaft', 'hydraulic', 'past the relief', 'to the valve', 'into the cylinder', 'useful F·v'];
        let Tk = Pe * sc, x = 24, rem = Pe;
        c.save();
        for (let j = 0; j <= 6; j++) {
          const xEnd = j < 6 ? xs[j] : xe;
          c.globalAlpha = 0.55; c.fillStyle = j === 6 ? C.ok : C.accent;
          c.fillRect(x, y0, xEnd - x + 0.5, Math.max(Tk, 0.8));
          c.globalAlpha = 1;
          kit.label(c, (rem / 1000).toFixed(2) + ' kW', (x + xEnd) / 2, y0 - 22, { size: 11, weight: 700, align: 'center', color: j === 6 ? C.ok : C.text });
          kit.label(c, captions[j], (x + xEnd) / 2, y0 - 8, { size: 9.5, align: 'center', color: C.muted });
          if (j === 6) {
            c.globalAlpha = 0.55; c.fillStyle = C.ok; c.beginPath(); c.moveTo(xe, y0 - 6); c.lineTo(xe + 34, y0 + Tk / 2); c.lineTo(xe, y0 + Tk + 6); c.closePath(); c.fill(); c.globalAlpha = 1;
            break;
          }
          const L = losses[j], l = Math.max(0, L.v) * sc, xj = xs[j];
          if (l > 0.3) {
            const top = y0 + Tk - l, cyy = y0 + Tk + r0, R = r0 + l;
            c.globalAlpha = 0.55; c.fillStyle = L.col;
            c.beginPath(); c.moveTo(xj, top); c.arc(xj, cyy, R, -Math.PI / 2, 0); c.lineTo(xj + R, yB); c.lineTo(xj + r0, yB); c.lineTo(xj + r0, cyy); c.arc(xj, cyy, r0, 0, -Math.PI / 2, true); c.closePath(); c.fill();
            c.globalAlpha = 1;
          }
          const lx = xj + r0 + Math.max(l, 4) / 2;
          kit.label(c, L.k, lx, yB + 16, { size: 10.5, weight: 700, align: 'center', color: L.v > 0.02 * Pe ? C.text : C.muted });
          kit.label(c, (L.v / 1000).toFixed(2) + ' kW', lx, yB + 32, { size: 11, align: 'center', color: L.v > 0.1 * Pe ? L.col : C.text });
          kit.label(c, (L.v / Pe * 100).toFixed(0) + ' % · ' + L.note, lx, yB + 47, { size: 9.5, align: 'center', color: C.muted });
          Tk -= l; rem -= Math.max(0, L.v); x = xj;
        }
        c.restore();
        const modeTxt = { fixed: 'Fixed pump: full flow at the relief setting; the throttle meters what the cylinder gets.', ls: 'Load sensing: the pump holds 20 bar above the load and makes only the flow used.', vsd: 'Variable-speed drive: the pump turns just fast enough, at just the pressure needed.' }[r.mode];
        kit.label(c, modeTxt, 24, 24, { size: 12, color: C.text });
        let warn = '';
        if (r.stalled) warn = 'Stalled: the load needs more than the maximum pressure — all the pump power becomes heat.';
        else if (r.limited && V.v > 0) warn = 'The supply cannot give the wanted speed: the cylinder moves at ' + (r.v * 1000).toFixed(0) + ' mm/s.';
        else if (V.v === 0) warn = 'Waiting: nothing moves.';
        if (warn) kit.label(c, warn, 24, 44, { size: 11.5, weight: 600, color: r.stalled ? C.bad : C.warn });
        kit.label(c, 'heat into the oil ' + kw(r.heat), 740, 24, { size: 12, weight: 700, color: C.bad, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fp-jack */
  Hyper.sim('fp-jack', {
    title: 'A bottle jack, in section',
    blurb: `A hand lever drives a small plunger pump. On each down-stroke the **outlet check valve** opens and oil is pushed under the ram; on each up-stroke the **inlet check valve** opens and the pump chamber refills from the reservoir. The **release valve** lets the oil back to lower the load. The overall multiplication is the lever ratio times the area ratio, less friction (85 % efficiency here).

**Try this**
- Load 2 t with a 12 mm plunger and a 40 mm ram: about 208 N at the handle lifts it, 2.2 mm a stroke. Count the strokes for 100 mm.
- Double the ram diameter: four times the force for the same hand force — and a quarter of the rise per stroke.
- Make the load too heavy for your hand force: the handle will not go down. A smaller plunger or a longer lever fixes it, at the price of more strokes.
- Compare the work in and out per stroke: they differ only by the friction.
- Open the release valve: the ram sinks at a speed set by the orifice and the pressure — faster under a heavy load.`,
    mount(box, kit) {
      const Fl = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 280 });
      const s = { h: 0, u: 0, strokes: 0, manual: 0, stall: false, out: 0, inl: 0, relQ: 0 };
      const ctl = kit.controls(box.side, [
        { id: 'Fh', label: 'Hand force', min: 50, max: 500, step: 5, value: 250, unit: 'N' },
        { id: 'r', label: 'Lever ratio a : b', min: 4, max: 15, step: 0.5, value: 10 },
        { id: 'd', label: 'Plunger diameter d', min: 8, max: 25, step: 1, value: 12, unit: 'mm' },
        { id: 'D', label: 'Ram diameter D', min: 20, max: 80, step: 1, value: 40, unit: 'mm' },
        { id: 'm', label: 'Load', min: 0, max: 8000, step: 50, value: 2000, unit: 'kg' },
        { id: 'auto', type: 'check', label: 'Pump continuously', value: true },
        { id: 'rel', type: 'check', label: 'Release valve open', value: false },
        { type: 'buttons', items: [{ id: 'one', label: 'One stroke', primary: true }, { id: 'zero', label: 'Lower fully' }] }
      ], (id) => {
        if (id === 'one') { ctl.set('auto', false); V.auto = false; s.manual = 1; }
        if (id === 'zero') { s.h = 0; s.strokes = 0; s.u = 0; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Pressure under the ram'], ['mult', 'Force multiplication'], ['need', 'Hand force needed'], ['rise', 'Rise per stroke'], ['n', 'Strokes for 100 mm'], ['work', 'Work per stroke: hand / load'], ['h', 'Ram raised (strokes)']]);
      const SP = 0.025, ETA = 0.85, HMAX = 150, MRAM = 3, A0 = 0.4e-6, g0 = 9.81;
      const tri = u => u < 0.5 ? u / 0.5 : 1 - (u - 0.5) / 0.5;
      const loop = kit.loop((dt) => {
        const Ap = Math.PI * Math.pow(V.d / 1000, 2) / 4, Ar = Math.PI * Math.pow(V.D / 1000, 2) / 4;
        const W = (V.m + MRAM) * g0, pNeed = W / Ar, pHand = V.Fh * V.r * ETA / Ap, canLift = pHand >= pNeed;
        const need = pNeed * Ap / (V.r * ETA);
        s.out = 0; s.inl = 0; s.relQ = 0;
        const pumping = (V.auto || s.manual > 0);
        if (pumping) {
          const down = s.u < 0.5;
          s.stall = down && !canLift && !V.rel && s.h < HMAX;
          if (!s.stall) {
            const x0 = tri(s.u);
            s.u += dt / 1.4;
            if (s.u >= 1) { s.u -= 1; if (s.manual > 0) { s.manual = 0; s.u = 0; } if (!V.rel && s.h < HMAX) s.strokes++; }
            const dx = tri(s.u) - x0;
            if (dx > 0) { s.out = dx / dt; if (!V.rel) s.h = Math.min(HMAX, s.h + Ap * SP * dx / Ar * 1000); }
            else if (dx < 0) s.inl = -dx / dt;
          }
        } else s.stall = false;
        if (V.rel && s.h > 0) {
          const Q = Fl.orifice(0.62, A0, pNeed, 870);
          s.relQ = Q; s.h = Math.max(0, s.h - Q / Ar * 1000 * dt);
          if (s.h <= 0) s.strokes = 0;
        }
        const mult = V.r * Math.pow(V.D / V.d, 2) * ETA, rise = SP * 1000 * Math.pow(V.d / V.D, 2);
        ro.set('p', (pNeed / 1e5).toFixed(0) + ' bar');
        ro.set('mult', mult.toFixed(0) + ' ×  (lever ' + V.r + ' × area ' + Math.pow(V.D / V.d, 2).toFixed(1) + ' × 0.85)');
        ro.set('need', need.toFixed(0) + ' N' + (canLift ? '' : ' — more than you push'));
        ro.set('rise', rise.toFixed(2) + ' mm');
        ro.set('n', Math.ceil(100 / rise).toString());
        ro.set('work', (need * SP * V.r).toFixed(1) + ' J / ' + (W * rise / 1000).toFixed(1) + ' J');
        ro.set('h', s.h.toFixed(1) + ' mm (' + s.strokes + ')');
        // ---- drawing on a 760 × 440 grid
        const g = fit(st, 760, 440), c = begin(st, g), C = kit.colors(), S = kit.fsym;
        const oil = tint(C, BLUE[0], BLUE[1], 0.32), hot = tint(C, RED[0], RED[1], 0.42), loaded = pNeed > 2e5;
        const bw = 30 + V.D * 1.3, rx = 470, hpx = s.h;
        // base and release passage
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(90, 392, 490, 18); c.strokeRect(90, 392, 490, 18);
        // reservoir
        const lvl = 325 + s.h * 0.25 * Math.pow(V.D / 40, 2);
        c.fillStyle = oil; c.fillRect(112, Math.min(lvl, 380), 126, 386 - Math.min(lvl, 380));
        c.strokeRect(110, 305, 130, 87);
        kit.label(c, 'reservoir', 175, 316, { size: 11, color: C.muted, align: 'center' });
        // pump barrel and plunger
        const pw = 8 + V.d * 0.9, px = 280;
        const th = -0.25 + 0.4 * tri(s.u), piv = [355, 262], lk = [px, piv[1] + 75 * Math.sin(th)];
        const pb = lk[1] + 58;
        c.fillStyle = s.out > 0 && loaded && !V.rel ? hot : oil; c.fillRect(px - pw / 2, pb, pw, 386 - pb);
        c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(px - pw / 2 - 6, 290); c.lineTo(px - pw / 2 - 6, 392); c.moveTo(px + pw / 2 + 6, 290); c.lineTo(px + pw / 2 + 6, 392); c.stroke();
        c.fillStyle = C.surface; c.lineWidth = 1.5; c.fillRect(px - pw / 2, lk[1], pw, 58); c.strokeRect(px - pw / 2, lk[1], pw, 58);
        // ram barrel, oil, ram and load
        const yb = 382 - hpx, rtop = yb - 172;
        c.fillStyle = loaded ? hot : oil; c.fillRect(rx - bw / 2, yb, bw, 386 - yb);
        c.strokeStyle = C.text; c.lineWidth = 2.4;
        c.beginPath(); c.moveTo(rx - bw / 2 - 6, 214); c.lineTo(rx - bw / 2 - 6, 392); c.moveTo(rx + bw / 2 + 6, 214); c.lineTo(rx + bw / 2 + 6, 392); c.stroke();
        c.fillStyle = C.surface; c.lineWidth = 1.5; c.fillRect(rx - bw / 2 + 2, rtop, bw - 4, 172); c.strokeRect(rx - bw / 2 + 2, rtop, bw - 4, 172);
        c.fillStyle = C.surface; c.fillRect(rx - 55, rtop - 42, 110, 42); c.strokeStyle = C.text; c.strokeRect(rx - 55, rtop - 42, 110, 42);
        kit.label(c, V.m.toFixed(0) + ' kg', rx, rtop - 28, { size: 12, weight: 700, align: 'center' });
        kit.label(c, (V.m * g0 / 1000).toFixed(1) + ' kN', rx, rtop - 12, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'ram D = ' + V.D + ' mm', rx + bw / 2 + 14, 360, { size: 11, color: C.muted });
        kit.label(c, 'plunger d = ' + V.d + ' mm', px - pw / 2 - 12, 300, { size: 11, color: C.muted, align: 'right' });
        // passages with their check valves
        const col = S.col;
        const pIn = [[240, 380], [px - pw / 2, 380]], pOut = [[px + pw / 2, 372], [rx - bw / 2, 372]], pRel = [[rx - bw / 2 + 10, 386], [rx - bw / 2 + 10, 401], [180, 401], [180, 392]];
        S.line(c, pIn, { state: s.inl > 0 ? 'suction' : 'idle' });
        S.line(c, pOut, { state: loaded || s.out > 0 ? 'pressure' : 'idle' });
        S.line(c, pRel, { state: V.rel && s.h > 0 ? 'return' : 'idle' });
        if (s.inl > 0) S.flow(c, pIn, loopPh('in', 40, dt), { color: col('suction') });
        if (s.out > 0 && !V.rel) S.flow(c, pOut, loopPh('out', 60, dt), { color: col('pressure') });
        if (V.rel && s.relQ > 0) S.flow(c, pRel, loopPh('rel', 20 + 3e6 * s.relQ, dt), { color: col('return') });
        const ball = (x, y, open, label) => {
          c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x - 7, y - 7); c.lineTo(x - 2, y); c.lineTo(x - 7, y + 7); c.stroke();
          kit.dot(c, x + (open ? 6 : 2), y, 4.5, open ? C.ok : C.text);
          kit.label(c, label, x, y - 16, { size: 10, color: open ? C.ok : C.muted, align: 'center' });
        };
        ball(257, 380, s.inl > 0, 'inlet');
        ball(335, 372, s.out > 0 && !V.rel && !s.stall, 'outlet');
        // release needle
        c.strokeStyle = V.rel ? C.warn : C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(330, 401); c.lineTo(330, 422); c.moveTo(318, 422); c.lineTo(342, 422); c.stroke();
        kit.label(c, V.rel ? 'release valve: OPEN' : 'release valve: closed', 316, 426, { size: 11, color: V.rel ? C.warn : C.muted, align: 'right' });
        // lever
        const L = 270, hx = piv[0] - L * Math.cos(th), hy = piv[1] + L * Math.sin(th);
        c.strokeStyle = C.text; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(hx, hy); c.lineTo(piv[0], piv[1]); c.stroke(); c.lineCap = 'butt';
        c.lineWidth = 2; c.beginPath(); c.moveTo(piv[0], piv[1]); c.lineTo(rx - bw / 2 - 6, piv[1]); c.stroke();
        kit.dot(c, piv[0], piv[1], 5, C.surface, C.text); kit.dot(c, lk[0], lk[1], 4, C.text);
        kit.arrow(c, hx, hy - 46, hx, hy - 6, s.stall ? C.bad : C.warn, 3);
        kit.label(c, 'F_h = ' + V.Fh + ' N', hx + 8, hy - 34, { size: 11.5, weight: 700 });
        kit.label(c, 'a : b = ' + V.r + ' : 1', 200, 238, { size: 11, color: C.muted, align: 'center' });
        let msg = '';
        if (V.rel) msg = s.h > 0 ? 'Lowering: ' + (s.relQ / Ar * 1000).toFixed(1) + ' mm/s through the release valve' : 'Fully lowered';
        else if (s.stall) msg = 'Too heavy for this push: the handle needs ' + need.toFixed(0) + ' N';
        else if (s.h >= HMAX) msg = 'Fully raised';
        else if (pumping) msg = 'Lifting ' + rise.toFixed(2) + ' mm per stroke at ' + (pNeed / 1e5).toFixed(0) + ' bar';
        if (msg) kit.label(c, msg, 740, 424, { size: 12, weight: 700, align: 'right', color: s.stall ? C.bad : C.text });
        c.restore();
      }, box.stage);
      const loopPh = phaser();
      loop.start();
    }
  });

  /* ================================================================ fp-brakes */
  /* Pedal lever × booster (assist limited to 3.5 kN at run-out) → tandem master cylinder → front calipers 57 mm,
     rear 38 mm (optionally limited above 30 bar), pads μ = 0.4, radii 0.11 / 0.10 m, tyres 0.31 m. Axle loads follow
     the deceleration (wheelbase 2.7 m, centre of mass 0.55 m high, 60 % on the front at rest); a wheel whose brake
     asks for more than μ_road × its load locks (sliding at 0.8 of the grip) or, with ABS, is held near the limit. */
  function brakeModel(V) {
    const g0 = 9.81, L = 2.7, hc = 0.55, lf = 0.4 * L, lr = 0.6 * L, m = V.m;
    const Amc = Math.PI * Math.pow(V.dmc / 1000, 2) / 4, Acf = Math.PI * 0.057 * 0.057 / 4, Acr = Math.PI * 0.038 * 0.038 / 4;
    const Fin = V.Fp * V.i, want = Fin * (V.k - 1), assist = Math.min(want, 3500), Frod = Fin + assist;
    const p = Math.max(0, Frod - 60) / Amc, knee = 30e5;
    const pr = V.ebd && p > knee ? knee + 0.35 * (p - knee) : p;
    const Bf = 2 * 0.4 * p * Acf * 0.11 / 0.31, Br = 2 * 0.4 * pr * Acr * 0.10 / 0.31;
    let a = 0, fF = 0, fR = 0, lockF = false, lockR = false, Gf = 0, Gr = 0;
    for (let k = 0; k < 40; k++) {
      const Nf = m * g0 * lr / L + m * a * hc / L, Nr = Math.max(0, m * g0 * lf / L - m * a * hc / L);
      Gf = V.mu * Nf / 2; Gr = V.mu * Nr / 2;
      lockF = Bf > Gf; lockR = Br > Gr;
      fF = lockF ? (V.abs ? 0.95 * Gf : 0.8 * Gf) : Bf;
      fR = lockR ? (V.abs ? 0.95 * Gr : 0.8 * Gr) : Br;
      a = 0.5 * a + 0.5 * 2 * (fF + fR) / m;
    }
    const vol = 2 * (Acf + Acr) * 3e-4 * Math.min(1, p / 5e5) + 4e-13 * p;
    return { p, pr, Frod, assist, runout: want > 3500, Fcf: p * Acf, Fcr: pr * Acr, Bf, Br, fF, fR, lockF, lockR, Gf, Gr, a,
      pLockF: Bf > 0 ? p * Gf / Bf : 0, pedal: vol / Amc * V.i };
  }

  Hyper.sim('fp-brakes', {
    title: 'Car brakes: from pedal to tyre',
    blurb: `The pedal lever and the booster push the tandem master cylinder; its two circuits feed the front calipers (57 mm pistons) and the rear ones (38 mm). The pads clamp the discs, and the braking force at each tyre is limited by what the road can take: the load on each axle shifts forward as the car slows. **Brake from 100 km/h** runs a stop with your settings and draws the speed and the front line pressure.

**Try this**
- A firm 150 N push with the booster at ×5 gives about 58 bar and 0.7 g on a dry road. Take the booster away: the same push gives a fifth of the pressure.
- Push harder than the booster can help (past its run-out): the pressure now rises only with your own extra effort.
- Choose a larger master cylinder: less pressure for the same push, but a shorter pedal.
- Snow, ABS off, 300 N: the wheels lock — the fronts cannot steer, and locked rears would make the car spin. Switch ABS on and watch the pressure saw-tooth as the valves hold, release and reapply.
- Dry road, ABS and rear pressure limiting off, 150–175 N: the rears lock first. Switch the limiting back on and they keep rolling.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 260 });
      const plotBox = document.createElement('div'); plotBox.style.padding = '4px 10px 10px'; box.stage.appendChild(plotBox);
      const run = { on: false, done: false, v: 0, x: 0, t: 0, hist: [], tRec: 0 };
      const ctl = kit.controls(box.side, [
        { id: 'Fp', label: 'Pedal force', min: 0, max: 600, step: 5, value: 150, unit: 'N' },
        { id: 'i', label: 'Pedal ratio', min: 2, max: 6, step: 0.1, value: 3.5 },
        { id: 'k', type: 'select', label: 'Booster', options: [['none (× 1)', 1], ['× 3', 3], ['× 5', 5], ['× 7', 7]], value: 5 },
        { id: 'dmc', type: 'select', label: 'Master-cylinder bore', options: [['19.05 mm (¾ in)', 19.05], ['20.64 mm (13/16 in)', 20.64], ['22.22 mm (⅞ in)', 22.22], ['23.81 mm (15/16 in)', 23.81], ['25.40 mm (1 in)', 25.4]], value: 23.81 },
        { id: 'mu', type: 'select', label: 'Road', options: [['dry asphalt (μ 0.9)', 0.9], ['wet asphalt (μ 0.6)', 0.6], ['snow (μ 0.2)', 0.2]], value: 0.9 },
        { id: 'm', label: 'Car mass', min: 800, max: 2500, step: 50, value: 1500, unit: 'kg' },
        { id: 'abs', type: 'check', label: 'ABS', value: true },
        { id: 'ebd', type: 'check', label: 'Rear pressure limiting (EBD)', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Brake from 100 km/h', primary: true }] }
      ], (id) => { if (id === 'go') { run.on = true; run.done = false; run.v = 100 / 3.6; run.x = 0; run.t = 0; run.hist = []; run.tRec = 0; } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rod', 'Push on the master cylinder'], ['p', 'Line pressure front / rear'], ['fc', 'Clamp force, one front caliper'], ['fb', 'Braking force, four wheels'], ['a', 'Deceleration'], ['trav', 'Pedal travel'], ['stop', 'Stop from 100 km/h']]);
      const plot = kit.plot(plotBox, { x: { label: 'time (s)', min: 0 }, y: { label: 'speed (km/h) · front pressure (bar)', min: 0 }, legend: true }, 150);
      let T = 0, lastPlot = -1;
      const ph = phaser();
      const loop = kit.loop((dt) => {
        T += dt;
        const r = brakeModel(V), saw = (T * 8) % 1;
        const absF = V.abs && r.lockF, absR = V.abs && r.lockR;
        const pShowF = absF ? r.pLockF * (0.72 + 0.28 * saw) : r.p;
        if (run.on) {
          for (let k = 0; k < 4; k++) { const h = dt / 4; run.v = Math.max(0, run.v - r.a * h); run.x += run.v * h; run.t += h; if (run.v <= 0) break; }
          run.tRec += dt;
          if (run.tRec > 0.05 || run.v <= 0) { run.tRec = 0; run.hist.push([run.t, run.v * 3.6, pShowF / 1e5]); }
          if (run.v <= 0 || r.a <= 1e-6 && run.t > 20) { run.on = false; run.done = true; }
          if (run.hist.length > 1) {
            plot.set({ series: [{ pts: run.hist.map(q => [q[0], q[1]]), label: 'speed (km/h)' }, { pts: run.hist.map(q => [q[0], q[2]]), label: 'front line pressure (bar)', dash: [5, 4] }] });
            lastPlot = T;
          }
        }
        ro.set('rod', (r.Frod / 1000).toFixed(2) + ' kN' + (V.k > 1 ? (r.runout ? ' (booster at run-out)' : ' (booster adds ' + (r.assist / 1000).toFixed(2) + ' kN)') : ''));
        ro.set('p', (r.p / 1e5).toFixed(0) + ' / ' + (r.pr / 1e5).toFixed(0) + ' bar');
        ro.set('fc', (r.Fcf / 1000).toFixed(1) + ' kN');
        ro.set('fb', ((2 * r.fF + 2 * r.fR) / 1000).toFixed(1) + ' kN');
        ro.set('a', r.a.toFixed(2) + ' m/s² (' + (r.a / 9.81).toFixed(2) + ' g)');
        ro.set('trav', (r.pedal * 1000).toFixed(0) + ' mm');
        ro.set('stop', run.done ? run.x.toFixed(1) + ' m in ' + run.t.toFixed(1) + ' s' : run.on ? (run.v * 3.6).toFixed(0) + ' km/h…' : r.a > 0.05 ? 'about ' + (Math.pow(100 / 3.6, 2) / (2 * r.a)).toFixed(0) + ' m (press the button)' : 'no braking');

        // ---- drawing on a 760 × 400 grid
        const g = fit(st, 760, 400), c = begin(st, g), C = kit.colors(), col = S.col;
        const red = tint(C, RED[0], RED[1], clamp(0.12 + r.p / 150e5, 0.12, 0.6));
        // pedal
        const phi = clamp(r.pedal * 1000 / 150, 0, 0.6), piv = [70, 36];
        const pad = [piv[0] + 150 * Math.sin(phi), piv[1] + 150 * Math.cos(phi)], rodPt = [piv[0] + 42 * Math.sin(phi), piv[1] + 42 * Math.cos(phi)];
        c.strokeStyle = C.text; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(piv[0], piv[1]); c.lineTo(pad[0], pad[1]); c.stroke(); c.lineCap = 'butt';
        c.lineWidth = 7; c.beginPath(); c.moveTo(pad[0], pad[1] - 12); c.lineTo(pad[0] + 3, pad[1] + 12); c.stroke();
        kit.dot(c, piv[0], piv[1], 5, C.surface, C.text);
        if (V.Fp > 0) kit.arrow(c, pad[0] - 58, pad[1], pad[0] - 7, pad[1], C.warn, 3);
        kit.label(c, 'F_p = ' + V.Fp + ' N', pad[0] - 60, pad[1] + 20, { size: 11.5, weight: 700 });
        kit.label(c, 'pedal ratio ' + V.i.toFixed(1), 20, 214, { size: 11, color: C.muted });
        const shift = r.pedal * 1000 / V.i * 0.8;
        c.lineWidth = 3; c.beginPath(); c.moveTo(rodPt[0], rodPt[1]); c.lineTo(122 + shift, 80); c.stroke();
        // booster and master cylinder
        c.lineWidth = 1.8; c.strokeStyle = V.k > 1 ? C.text : C.muted; c.beginPath(); c.arc(160, 80, 36, 0, Math.PI * 2); c.stroke();
        kit.label(c, V.k > 1 ? 'booster × ' + V.k : 'no booster', 160, 80, { size: 11, weight: 700, align: 'center', color: V.k > 1 ? (r.runout ? C.warn : C.text) : C.muted });
        if (r.runout) kit.label(c, 'run-out', 160, 128, { size: 10.5, color: C.warn, align: 'center' });
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(196, 80); c.lineTo(206 + shift, 80); c.stroke();
        c.fillStyle = red; c.fillRect(214 + shift, 70, 96 - shift, 20);
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.strokeRect(204, 68, 108, 24);
        c.fillStyle = C.text; c.fillRect(206 + shift, 70, 8, 20); c.fillRect(252 + shift * 0.9, 70, 8, 20);
        c.strokeRect(222, 40, 70, 20); c.fillStyle = tint(C, BLUE[0], BLUE[1], 0.3); c.fillRect(224, 48, 66, 11);
        c.beginPath(); c.moveTo(240, 60); c.lineTo(240, 68); c.moveTo(280, 60); c.lineTo(280, 68); c.stroke();
        kit.label(c, 'master cylinder ' + V.dmc + ' mm', 258, 106, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'reservoir', 257, 30, { size: 10, color: C.muted, align: 'center' });
        // the car (front at the left), wheels and lines
        const lineF = [[300, 92], [300, 175], [470, 175]], lineR = [[270, 92], [270, 215], [680, 215]];
        const stF = r.p > 1e5 ? 'pressure' : 'idle', stR = r.pr > 1e5 ? 'pressure' : 'idle';
        rrect(c, 400, 78, 345, 194, 30); c.strokeStyle = C.grid; c.lineWidth = 1.5; c.stroke();
        kit.label(c, '← travel', 572, 246, { size: 11, color: C.muted, align: 'center' });
        S.line(c, lineF, { state: stF }); S.line(c, lineR, { state: stR });
        for (const [x, st2] of [[470, stF], [680, stR]]) { S.line(c, [[x, 86], [x, 264]], { state: st2 }); }
        S.junction(c, 470, 175); S.junction(c, 680, 215);
        if (run.on && r.p > 1e5) { S.flow(c, lineF, ph('f', 8, dt), { color: col('pressure') }); S.flow(c, lineR, ph('r', 8, dt), { color: col('pressure') }); }
        kit.label(c, 'circuit 1: front', 380, 166, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, 'circuit 2: rear', 380, 226, { size: 10, color: C.muted, align: 'right' });
        const wheel = (x, y, force, lock, abs, top) => {
          const moving = !run.done;
          c.fillStyle = lock && !abs ? tint(C, '229,72,77', '214,40,40', 0.45) : abs ? tint(C, '123,140,255', '60,80,220', 0.3) : C.surface;
          rrect(c, x - 32, y - 13, 64, 26, 6); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
          c.fillStyle = red; c.fillRect(x - 8, top ? y + 13 : y - 23, 16, 10); c.strokeRect(x - 8, top ? y + 13 : y - 23, 16, 10);
          const len = clamp(force / 8000 * 70, 0, 80);
          if (len > 2) kit.arrow(c, x + 36, y, x + 36 + len, y, C.ok, 3);
          kit.label(c, (force / 1000).toFixed(1) + ' kN', x + 40, top ? y - 20 : y + 22, { size: 10.5, color: C.text });
          if (lock && !abs) kit.label(c, 'LOCKED', x, y + (top ? -24 : 26), { size: 10.5, weight: 700, color: C.bad, align: 'center' });
          else if (abs) kit.label(c, 'ABS', x, y + (top ? -24 : 26), { size: 10.5, weight: 700, color: C.accent, align: 'center' });
          if (moving && !lock) { c.strokeStyle = C.muted; c.lineWidth = 1; const o = ((T * 60) % 12); for (let q = -30 + o; q < 30; q += 12) { c.beginPath(); c.moveTo(x + q, y - 10); c.lineTo(x + q, y + 10); c.stroke(); } }
        };
        wheel(470, 62, r.fF, r.lockF, absF, true); wheel(470, 288, r.fF, r.lockF, absF, false);
        wheel(680, 62, r.fR, r.lockR, absR, true); wheel(680, 288, r.fR, r.lockR, absR, false);
        // caliper close-up
        const cx0 = 180, cy0 = 330;
        c.fillStyle = C.muted; c.fillRect(cx0 - 5, cy0 - 50, 10, 100);
        kit.label(c, 'disc', cx0, cy0 - 60, { size: 10, color: C.muted, align: 'center' });
        const gap = r.p > 1e5 ? 0 : 4;
        c.fillStyle = C.text; c.fillRect(cx0 - 17 - gap, cy0 - 26, 10, 52); c.fillRect(cx0 + 7 + gap, cy0 - 26, 10, 52);
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.strokeRect(cx0 - 80, cy0 - 36, 50, 72);
        c.fillStyle = red; c.fillRect(cx0 - 78, cy0 - 34, 30, 68);
        c.fillStyle = C.surface; c.fillRect(cx0 - 48, cy0 - 28, 30 - gap, 56); c.strokeRect(cx0 - 48, cy0 - 28, 30 - gap, 56);
        c.beginPath(); c.moveTo(cx0 - 30, cy0 - 36); c.lineTo(cx0 - 30, cy0 - 44); c.lineTo(cx0 + 30, cy0 - 44); c.lineTo(cx0 + 30, cy0 + 44); c.lineTo(cx0 - 30, cy0 + 44); c.lineTo(cx0 - 30, cy0 + 36); c.stroke();
        if (r.Fcf > 50) { kit.arrow(c, cx0 - 60, cy0, cx0 - 20, cy0, C.bad, 3); kit.arrow(c, cx0 + 44, cy0, cx0 + 19, cy0, C.bad, 3); }
        kit.label(c, 'front caliper, piston 57 mm', cx0 - 80, cy0 + 58, { size: 10.5, color: C.muted });
        kit.label(c, 'p = ' + (pShowF / 1e5).toFixed(0) + ' bar', cx0 + 50, cy0 - 14, { size: 11.5, weight: 700 });
        kit.label(c, 'clamp ' + (r.Fcf / 1000).toFixed(1) + ' kN', cx0 + 50, cy0 + 4, { size: 11.5 });
        // status
        let msg = '', mc = C.text;
        if (!V.abs && r.lockR && !r.lockF) { msg = 'Rear wheels locked first: the car can spin.'; mc = C.bad; }
        else if (!V.abs && r.lockF) { msg = 'Front wheels locked: no steering.' + (r.lockR ? ' All four sliding.' : ''); mc = C.bad; }
        else if (absF || absR) { msg = 'ABS holds the wheels near the grip limit: still steerable.'; mc = C.accent; }
        else msg = r.a > 0.05 ? 'All wheels rolling: braking below the grip limit.' : 'Press the pedal.';
        kit.label(c, msg, 740, 392, { size: 12, weight: 700, align: 'right', color: mc });
        kit.label(c, 'decel ' + (r.a / 9.81).toFixed(2) + ' g', 740, 372, { size: 12, align: 'right', color: C.text });
        c.restore();
        if (lastPlot < 0 && !run.on) { plot.set({ series: [{ pts: [[0, 100], [Math.max(1, 100 / 3.6 / Math.max(r.a, 0.5)), 0]], label: 'speed (km/h), estimate', dash: [2, 3] }] }); lastPlot = 0; }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fp-excavator */
  /* A 20-tonne-class excavator in side view, in metres (x forward from the swing centre, y up from the ground).
     Each cylinder joins two bodies at fixed points; its length fixes the angle between them by the law of cosines.
     Statics: the moment of everything beyond a joint about its pin is carried by that joint's cylinder. */
  const EXC = {
    O: [0.15, 1.95], Lb: 5.7, La: 2.9, Lk: 1.45,
    cb0: [0.35, 1.05], cb1: [2.3, -0.40],            // boom cylinders: base on the house (world), rod end on the boom (boom frame)
    ca0: [2.9, 0.95], ca1: [-0.62, 0.30],            // arm cylinder: base on the boom (boom frame), rod end on the arm's tail (arm frame)
    ck0: [0.35, 0.28], ck1: [-0.40, 0.10],           // bucket cylinder: base on the arm (arm frame), rod end on the bucket lever (bucket frame)
    Lmin: [1.62, 2.39, 2.38], Lmax: [2.92, 3.59, 2.95],
    mb: 1800, gb: [2.9, 0.25], ma: 900, ga: [1.1, 0], mk: 750, gk: [0.65, 0.28], gl: [0.7, 0.22],
    bore: [[0.12, 0.085, 2], [0.14, 0.10, 1], [0.12, 0.085, 1]]   // bore, rod, number of cylinders
  };
  const v2 = {
    rot: (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)],
    add: (a, b) => [a[0] + b[0], a[1] + b[1]], sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
    ang: v => Math.atan2(v[1], v[0]), len: v => Math.hypot(v[0], v[1]), cross: (a, b) => a[0] * b[1] - a[1] * b[0]
  };
  function excPose(s) {
    const E = EXC, R = v2.rot, A = v2.add, Sb = v2.sub, ang = v2.ang, len = v2.len;
    const L = [0, 1, 2].map(i => E.Lmin[i] + clamp(s[i], 0, 1) * (E.Lmax[i] - E.Lmin[i]));
    const law = (a, b, l) => Math.acos(clamp((a * a + b * b - l * l) / (2 * a * b), -1, 1));
    const u0 = Sb(E.cb0, E.O), phb = ang(u0) + law(len(u0), len(E.cb1), L[0]) - ang(E.cb1);
    const J1 = A(E.O, R([E.Lb, 0], phb));
    const u1 = Sb(E.ca0, [E.Lb, 0]), pha = phb + ang(u1) - law(len(u1), len(E.ca1), L[1]) - ang(E.ca1);
    const J2 = A(J1, R([E.La, 0], pha));
    const u2 = Sb(E.ck0, [E.La, 0]), phk = pha + ang(u2) - law(len(u2), len(E.ck1), L[2]) - ang(E.ck1);
    return {
      L, phb, pha, phk, J1, J2, tip: A(J2, R([E.Lk, 0], phk)),
      cb0: E.cb0, cb1: A(E.O, R(E.cb1, phb)), ca0: A(E.O, R(E.ca0, phb)), ca1: A(J1, R(E.ca1, pha)), ck0: A(J1, R(E.ck0, pha)), ck1: A(J2, R(E.ck1, phk)),
      Gb: A(E.O, R(E.gb, phb)), Ga: A(J1, R(E.ga, pha)), Gk: A(J2, R(E.gk, phk)), Gl: A(J2, R(E.gl, phk))
    };
  }
  function excForces(P, mload) {
    const E = EXC, g0 = 9.81;
    const W = (pt, m, pin) => (pt[0] - pin[0]) * (-m * g0);
    const cyl = (base, rod, pin, M) => { const u = v2.sub(rod, base), l = v2.len(u), arm = v2.cross(v2.sub(rod, pin), [u[0] / l, u[1] / l]); return Math.abs(arm) > 1e-6 ? -M / arm : 0; };
    const Mk = W(P.Gk, E.mk, P.J2) + W(P.Gl, mload, P.J2);
    const Ma = W(P.Ga, E.ma, P.J1) + W(P.Gk, E.mk, P.J1) + W(P.Gl, mload, P.J1);
    const Mb = W(P.Gb, E.mb, E.O) + W(P.Ga, E.ma, E.O) + W(P.Gk, E.mk, E.O) + W(P.Gl, mload, E.O);
    return { F: [cyl(P.cb0, P.cb1, E.O, Mb), cyl(P.ca0, P.ca1, P.J1, Ma), cyl(P.ck0, P.ck1, P.J2, Mk)], Mb };
  }

  Hyper.sim('fp-excavator', {
    title: 'Excavator arm: strokes, reach and cylinder forces',
    blurb: `A 20-tonne-class excavator. Each slider sets a cylinder's stroke; the cylinder's length fixes the angle of its joint through the triangle it forms with the two pins (the [[math:law-of-cosines|law of cosines]]). The forces are found joint by joint: everything beyond a pin — structure, bucket and load — makes a moment about it, and the cylinder must balance it with its force times its lever arm ([[physics:torque|torque]]). A cylinder that **pushes** is held by pressure in its cap end (red), one that **pulls** by pressure in its rod end. The bars compare the holding pressures with the main relief (343 bar) and the port reliefs (380 bar). The dots show where the bucket tip can reach.

**Try this**
- Reach far out with the arm extended and the boom low, then lift a 2-tonne bucket: the boom cylinders' pressure climbs. Pull the load in close and it falls.
- Swing the arm past vertical: its cylinder changes from pulling to pushing, and the pressure moves from the rod end to the cap end.
- Raise the boom high with the arm fully out: the arm cylinder's pull on the small annulus needs much more pressure than the same force pushing.
- **Play a dig cycle**: dig, curl, lift, dump — and watch the loads change through the cycle.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.63, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'sb', label: 'Boom cylinders stroke', min: 0, max: 100, step: 1, value: 55, unit: '%' },
        { id: 'sa', label: 'Arm cylinder stroke', min: 0, max: 100, step: 1, value: 45, unit: '%' },
        { id: 'sk', label: 'Bucket cylinder stroke', min: 0, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'm', label: 'Load in the bucket', min: 0, max: 3000, step: 50, value: 1500, unit: 'kg' },
        { id: 'cycle', type: 'check', label: 'Play a dig cycle', value: false }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['reach', 'Bucket tip: reach / height'], ['boom', 'Boom cylinders (2)'], ['arm', 'Arm cylinder'], ['bkt', 'Bucket cylinder'], ['mom', 'Moment about the boom foot']]);
      const KEYS = [[45, 10, 10, 0], [22, 22, 15, 0], [18, 75, 55, 0.6], [28, 85, 95, 1], [85, 70, 100, 1], [85, 35, 90, 1], [80, 35, 20, 0]];
      const cyc = { t: 0 };
      const cloud = [];
      for (let i = 0; i <= 14; i++) for (let j = 0; j <= 14; j++) cloud.push(excPose([i / 14, j / 14, 0.55]).tip);
      const names = ['boom', 'arm', 'bkt'];
      const loop = kit.loop((dt) => {
        let load = V.m;
        if (V.cycle) {
          cyc.t = (cyc.t + dt / 2.2) % KEYS.length;
          const i = Math.floor(cyc.t), f = cyc.t - i, a = KEYS[i], b = KEYS[(i + 1) % KEYS.length], sm = f * f * (3 - 2 * f);
          ctl.set('sb', lerp(a[0], b[0], sm)); ctl.set('sa', lerp(a[1], b[1], sm)); ctl.set('sk', lerp(a[2], b[2], sm));
          load = V.m * lerp(a[3], b[3], sm);
        }
        const P = excPose([V.sb / 100, V.sa / 100, V.sk / 100]), Fo = excForces(P, load);
        const info = Fo.F.map((F, i) => {
          const [D, d, n] = EXC.bore[i], A1 = Math.PI * D * D / 4, A2 = A1 - Math.PI * d * d / 4, f = F / n;
          const p = f >= 0 ? f / A1 : -f / A2;
          return { f, p, push: f >= 0 };
        });
        ro.set('reach', P.tip[0].toFixed(2) + ' m / ' + P.tip[1].toFixed(2) + ' m');
        info.forEach((q, i) => ro.set(names[i], (Math.abs(q.f) / 1000).toFixed(0) + ' kN ' + (q.push ? 'push' : 'pull') + (i === 0 ? ' each' : '') + ' → ' + (q.p / 1e5).toFixed(0) + ' bar ' + (q.push ? 'cap end' : 'rod end')));
        ro.set('mom', (Math.abs(Fo.Mb) / 1000).toFixed(0) + ' kN·m');
        // ---- drawing: 31 px per metre on a 760 × 480 grid
        const g = fit(st, 760, 480), c = begin(st, g), C = kit.colors();
        const K = 31, X0 = 100, Y0 = 272, T = p => [X0 + p[0] * K, Y0 - p[1] * K];
        const poly = (pts, fill, stroke) => { c.beginPath(); pts.forEach((p, i) => { const q = T(p); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.6; c.stroke(); } };
        const body = (org, phi, pts) => pts.map(p => v2.add(org, v2.rot(p, phi)));
        // ground, trench and reach cloud
        c.fillStyle = tint(C, '160,120,70', '150,110,60', 0.18); c.fillRect(X0 + 3.2 * K, Y0, 6.4 * K, 5.8 * K);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(8, Y0); c.lineTo(420, Y0); c.stroke();
        c.fillStyle = C.muted; for (const p of cloud) { const q = T(p); c.fillRect(q[0] - 1, q[1] - 1, 2, 2); }
        // undercarriage and house
        poly([[-2.2, 0.05], [2.2, 0.05], [2.45, 0.45], [2.2, 0.9], [-2.2, 0.9], [-2.45, 0.45]], C.surface, C.text);
        poly([[-2.7, 1.0], [1.05, 1.0], [1.05, 2.15], [-2.7, 2.15], [-2.85, 1.6]], C.surface, C.text);
        poly([[-0.25, 2.15], [0.95, 2.15], [0.95, 3.05], [0.05, 3.05], [-0.25, 2.6]], C.surface, C.text);
        kit.label(c, 'counterweight', X0 - 1.9 * K, Y0 - 1.55 * K, { size: 10, color: C.muted, align: 'center' });
        // links
        const boomPts = body(EXC.O, P.phb, [[-0.25, -0.3], [2.4, -0.58], [5.75, -0.22], [5.9, 0.18], [3.1, 0.92], [0.05, 0.32]]);
        const armPts = body(P.J1, P.pha, [[-0.78, 0.36], [-0.5, 0.48], [0.6, 0.36], [2.95, 0.12], [3.0, -0.12], [0.4, -0.3], [-0.35, -0.22]]);
        const bktPts = body(P.J2, P.phk, [[-0.47, 0.03], [-0.32, 0.24], [0.25, 0.54], [0.75, 0.66], [1.2, 0.52], [1.45, 0.04], [1.52, -0.04], [1.3, -0.05], [0.2, -0.1], [0, -0.13]]);
        poly(boomPts, C.surface, C.text); poly(armPts, C.surface, C.text); poly(bktPts, C.surface, C.text);
        if (load > 1) poly(body(P.J2, P.phk, [[0.25, 0.12], [0.55, 0.5], [0.95, 0.5], [1.3, 0.1]]), tint(C, '190,140,80', '150,100,40', 0.6), null);
        // cylinders: barrel from the base, rod from the rod end; the pressurised side in red
        const drawCyl = (a, b, i) => {
          const q = info[i], A = T(a), B = T(b), dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
          const bar = EXC.Lmin[i] * 0.9 * K, hot = tint(C, RED[0], RED[1], clamp(0.2 + q.p / 400e5, 0.2, 0.75));
          c.lineCap = 'butt';
          c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(A[0] + ux * bar * 0.6, A[1] + uy * bar * 0.6); c.lineTo(B[0], B[1]); c.stroke();
          c.lineWidth = 10; c.strokeStyle = C.text; c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(A[0] + ux * bar, A[1] + uy * bar); c.stroke();
          c.lineWidth = 7; c.strokeStyle = q.push ? hot : C.surface; c.beginPath(); c.moveTo(A[0] + ux * 3, A[1] + uy * 3); c.lineTo(A[0] + ux * bar * 0.55, A[1] + uy * bar * 0.55); c.stroke();
          c.strokeStyle = q.push ? C.surface : hot; c.beginPath(); c.moveTo(A[0] + ux * bar * 0.55, A[1] + uy * bar * 0.55); c.lineTo(A[0] + ux * (bar - 3), A[1] + uy * (bar - 3)); c.stroke();
          kit.dot(c, A[0], A[1], 3, C.surface, C.text); kit.dot(c, B[0], B[1], 3, C.surface, C.text);
        };
        drawCyl(P.cb0, P.cb1, 0); drawCyl(P.ca0, P.ca1, 1); drawCyl(P.ck0, P.ck1, 2);
        for (const pin of [EXC.O, P.J1, P.J2]) { const q = T(pin); kit.dot(c, q[0], q[1], 4, C.surface, C.text); }
        const tp = T(P.tip);
        kit.dot(c, tp[0], tp[1], 4, C.accent);
        c.strokeStyle = C.accent; c.lineWidth = 1; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(X0, tp[1]); c.lineTo(tp[0], tp[1]); c.stroke(); c.setLineDash([]);
        kit.label(c, P.tip[0].toFixed(1) + ' m', (X0 + tp[0]) / 2, tp[1] - 9, { size: 10.5, color: C.accent, align: 'center' });
        if (load > 1) { const gl = T(P.Gl); kit.arrow(c, gl[0], gl[1], gl[0], gl[1] + 16 + load / 150, C.warn, 2.5); kit.label(c, (load / 1000).toFixed(1) + ' t', gl[0] + 8, gl[1] + 22, { size: 10.5, weight: 700 }); }
        // pressure bars
        const titles = ['Boom (2 × 120/85)', 'Arm (140/100)', 'Bucket (120/85)'];
        kit.label(c, 'Holding pressure', 440, 30, { size: 12.5, weight: 700 });
        info.forEach((q, i) => {
          const y = 62 + i * 92, x = 440, w = 300, pb = q.p / 1e5, frac = clamp(pb / 450, 0, 1);
          kit.label(c, titles[i], x, y, { size: 11.5, weight: 700 });
          kit.label(c, (Math.abs(q.f) / 1000).toFixed(0) + ' kN ' + (q.push ? 'push' : 'pull') + (i === 0 ? ' each' : ''), x + w, y, { size: 11, align: 'right', color: C.muted });
          rrect(c, x, y + 12, w, 16, 4); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.grid; c.lineWidth = 1; c.stroke();
          c.fillStyle = pb > 380 ? C.bad : pb > 343 ? C.warn : tint(C, RED[0], RED[1], 0.55); c.fillRect(x, y + 12, w * frac, 16);
          for (const [lim, lab] of [[343, 'main relief'], [380, 'port relief']]) { const lx = x + w * lim / 450; c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.moveTo(lx, y + 9); c.lineTo(lx, y + 31); c.stroke(); if (i === 2) kit.label(c, lab, lx, y + 40, { size: 9, color: C.muted, align: 'center' }); }
          kit.label(c, pb.toFixed(0) + ' bar in the ' + (q.push ? 'cap end' : 'rod end') + (pb > 380 ? ': load sinks' : pb > 343 ? ': cannot lift' : ''), x, y + 44, { size: 10.5, color: pb > 343 ? C.bad : C.text });
        });
        kit.label(c, 'tip height ' + P.tip[1].toFixed(2) + ' m', 440, 350, { size: 11.5 });
        kit.label(c, 'dots: where the tip can reach', 440, 370, { size: 10.5, color: C.muted });
        kit.label(c, 'joint angles: boom ' + (P.phb * 180 / Math.PI).toFixed(0) + '°, arm ' + (P.pha * 180 / Math.PI).toFixed(0) + '°', 440, 390, { size: 10.5, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fp-press */
  /* A 320 mm press cylinder (about 205 t at 250 bar). Pressing: the pump flow compresses the oil (bulk modulus K)
     and lets the ram sink into the frame-and-work spring (stiffness k): dp/dt = Q / (V/K + A²/k). Decompression
     through an orifice: Q = Cd a √(2p/ρ). Fixed sub-steps of 0.1 ms while the pressure is released. */
  Hyper.sim('fp-press', {
    title: 'A press cycle: pressing and decompression',
    blurb: `A down-stroking press with a 320 mm cylinder. The ram falls fast while a prefill valve lets the cylinder suck oil from a tank above; on contact the prefill valve closes and the high-pressure pump must first **compress the oil** and **stretch the frame and the work** before the full force appears. After the dwell the stored energy is let out — gently through a small valve, or all at once.

**Try this**
- Watch the pressing phase: with a stiff steel die the pressure climbs quickly; on a soft pad the ram sinks further and the pump needs several times longer.
- Lower the bulk modulus (air in the oil, long hoses): the pressure rises more slowly and more energy is stored.
- Switch decompression to **abrupt**: the pressure collapses in a few hundredths of a second and the peak flow jumps to thousands of litres a minute — the bang that bursts hoses and shakes the frame.
- Compare the stored energy in the oil with that in the stretched frame and work.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280 });
      const plotBox = document.createElement('div'); plotBox.style.padding = '4px 10px 10px'; box.stage.appendChild(plotBox);
      const ctl = kit.controls(box.side, [
        { id: 'p', label: 'Pressing pressure', min: 50, max: 350, step: 5, value: 250, unit: 'bar' },
        { id: 'Q', label: 'High-pressure pump flow', min: 5, max: 60, step: 1, value: 40, unit: 'L/min' },
        { id: 'k', type: 'select', label: 'Frame and work stiffness', options: [['soft work (rubber pad), 40 MN/m', 4e7], ['medium, 150 MN/m', 1.5e8], ['stiff steel die, 600 MN/m', 6e8]], value: 1.5e8 },
        { id: 'K', label: 'Effective bulk modulus of the oil', min: 0.6, max: 1.8, step: 0.05, value: 1.5, unit: 'GPa' },
        { id: 'dec', type: 'select', label: 'Decompression', options: [['controlled: small valve first', 'soft'], ['abrupt: main valve at once', 'hard']], value: 'soft' }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['phase', 'Phase'], ['p', 'Pressure'], ['F', 'Press force'], ['dv', 'Oil compressed'], ['E', 'Stored energy: oil / frame and work'], ['tb', 'Time to build pressure'], ['dec', 'Decompression: time, peak flow']]);
      const plot = kit.plot(plotBox, { x: { label: 'time in the cycle (s)', min: 0 }, y: { label: 'pressure (bar) · ram travel (mm)', min: 0 }, legend: true }, 150);
      const A = Math.PI * 0.32 * 0.32 / 4, XC = 0.3, M = 2500, G0 = 9.81, RHO = 870, CD = 0.7;
      const Vol = x => 0.015 + A * (x + 0.05);
      const s = { ph: 0, tc: 0, tp: 0, x: 0, p: 0, tb0: 0, tBuild: 0, E: [0, 0], dV: 0, dec: { t0: 0, dur: 0, Qpk: 0, rate: 0 }, bang: 0, hist: [], rec: 0 };
      const PH = ['Rapid approach — prefill valve open', 'Pressing — compressing oil, stretching frame and work', 'Dwell at pressure', 'Decompression', 'Return stroke', 'Pause'];
      function step(h) {
        const K = V.K * 1e9, k = V.k, pset = V.p * 1e5;
        s.tc += h; s.tp += h;
        const C = Vol(s.x) / K + A * A / k;
        switch (s.ph) {
          case 0: s.x += 0.15 * h; if (s.x >= XC) { s.x = XC; s.ph = 1; s.tp = 0; s.tb0 = s.tc; } break;
          case 1:
            s.p += V.Q / 60000 / C * h;
            if (s.p >= pset) { s.p = pset; s.ph = 2; s.tp = 0; s.tBuild = s.tc - s.tb0; s.E = [Vol(s.x) * pset * pset / (2 * K), Math.pow(pset * A, 2) / (2 * k)]; s.dV = Vol(s.x) * pset / K; }
            s.x = XC + (s.p * A + M * G0) / k; break;
          case 2: if (s.tp > 1) { s.ph = 3; s.tp = 0; s.dec = { t0: s.tc, dur: 0, Qpk: 0, rate: 0 }; } break;
          case 3: {
            const a = V.dec === 'hard' ? 3e-4 : 1.2e-5, Q = CD * a * Math.sqrt(2 * Math.max(s.p, 0) / RHO);
            s.dec.Qpk = Math.max(s.dec.Qpk, Q); s.dec.rate = Math.max(s.dec.rate, Q / C);
            s.p -= Q / C * h;
            if (s.p <= 1e5) { s.p = 0; s.ph = 4; s.tp = 0; s.dec.dur = s.tc - s.dec.t0; if (s.dec.rate > 5e8) s.bang = 1; }
            s.x = XC + (Math.max(s.p, 0) * A + M * G0) / k; break;
          }
          case 4: s.x -= 0.25 * h; if (s.x <= 0) { s.x = 0; s.ph = 5; s.tp = 0; } break;
          default: if (s.tp > 0.8) { s.ph = 0; s.tc = 0; s.tp = 0; s.hist = []; }
        }
      }
      const loop = kit.loop((dt) => {
        const n = s.ph === 3 ? Math.max(1, Math.ceil(dt / 1e-4)) : 4;
        for (let i = 0; i < n; i++) { step(dt / n); if (s.ph === 3 && s.hist.length && s.tc - s.hist[s.hist.length - 1][0] > 0.004) s.hist.push([s.tc, s.p / 1e5, s.x * 1000]); }
        s.bang = Math.max(0, s.bang - dt / 1.2);
        s.rec += dt;
        if (s.rec > 0.05) { s.rec = 0; s.hist.push([s.tc, s.p / 1e5, s.x * 1000]); if (s.hist.length > 1) plot.set({ series: [{ pts: s.hist.map(q => [q[0], q[1]]), label: 'pressure (bar)' }, { pts: s.hist.map(q => [q[0], q[2]]), label: 'ram travel (mm)', dash: [5, 4] }] }); }
        const F = s.p * A;
        ro.set('phase', PH[s.ph]);
        ro.set('p', (s.p / 1e5).toFixed(0) + ' bar');
        ro.set('F', (F / 1000).toFixed(0) + ' kN (' + (F / 9806.65).toFixed(0) + ' t)');
        ro.set('dv', s.dV > 0 ? (s.dV * 1000).toFixed(2) + ' L of ' + (Vol(XC) * 1000).toFixed(0) + ' L' : '—');
        ro.set('E', s.E[0] > 0 ? (s.E[0] / 1000).toFixed(1) + ' kJ / ' + (s.E[1] / 1000).toFixed(1) + ' kJ' : '—');
        ro.set('tb', s.tBuild > 0 ? s.tBuild.toFixed(2) + ' s' : '…');
        ro.set('dec', s.dec.dur > 0 ? s.dec.dur.toFixed(s.dec.dur < 0.2 ? 3 : 2) + ' s, ' + (s.dec.Qpk * 60000).toFixed(0) + ' L/min' : s.ph === 3 ? 'releasing…' : '—');
        // ---- drawing on a 760 × 420 grid
        const g = fit(st, 760, 420), c = begin(st, g), C = kit.colors();
        const hot = tint(C, RED[0], RED[1], clamp(0.12 + s.p / 350e5 * 0.6, 0.12, 0.7)), oil = tint(C, BLUE[0], BLUE[1], 0.3);
        const defl = Math.min(22, Math.max(0, s.x - XC) * 1000 * 0.9), yPl = 190 + Math.min(s.x, XC) * 350 + defl;
        // frame: crown, columns, bed
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.8;
        c.fillRect(110, 60, 320, 50); c.strokeRect(110, 60, 320, 50);
        c.fillRect(130, 110, 22, 262); c.strokeRect(130, 110, 22, 262); c.fillRect(388, 110, 22, 262); c.strokeRect(388, 110, 22, 262);
        c.fillRect(100, 372, 340, 34); c.strokeRect(100, 372, 340, 34);
        // cylinder in the crown, piston, ram and platen
        const pistonY = 40 + Math.min(s.x, XC + 0.06) * 350;
        c.fillStyle = s.ph === 0 || s.ph === 4 ? oil : hot; c.fillRect(214, 22, 112, pistonY - 22);
        c.strokeRect(210, 18, 120, 172);
        c.fillStyle = C.text; c.fillRect(214, pistonY, 112, 8);
        c.fillStyle = C.surface; c.fillRect(240, pistonY + 8, 60, yPl - pistonY - 30); c.strokeRect(240, pistonY + 8, 60, yPl - pistonY - 30);
        c.fillRect(165, yPl - 22, 210, 22); c.strokeRect(165, yPl - 22, 210, 22);
        // work piece, squeezed (deflection drawn about 1000 times larger)
        const wTop = 300 + defl;
        c.fillStyle = tint(C, '160,120,70', '150,110,60', 0.45); c.fillRect(215, wTop, 110, 372 - wTop); c.strokeRect(215, wTop, 110, 372 - wTop);
        kit.label(c, 'work', 270, 340, { size: 11, color: C.text, align: 'center' });
        if (F > 1e4) { kit.arrow(c, 270, yPl - 70, 270, yPl - 26, C.bad, 3); }
        // prefill tank and valve
        c.strokeRect(120, 8, 70, 40); c.fillStyle = oil; c.fillRect(122, 22, 66, 24);
        kit.label(c, 'prefill tank', 112, 20, { size: 10, color: C.muted, align: 'right' });
        const pre = s.ph === 0 || s.ph === 4;
        S.line(c, [[155, 48], [155, 72], [210, 72]], { state: pre ? (s.ph === 0 ? 'suction' : 'return') : 'idle' });
        S.check(c, 155, 60, { rot: 180, open: pre });
        kit.label(c, pre ? 'prefill open' : 'prefill closed', 112, 40, { size: 10.5, color: pre ? C.ok : C.muted, align: 'right' });
        kit.label(c, 'deflection drawn ×1000', 270, 416, { size: 10, color: C.muted, align: 'center' });
        // phases and gauge
        PH.forEach((t, i) => {
          const y = 34 + i * 22, on = i === s.ph;
          kit.dot(c, 478, y, 5, on ? C.accent : C.grid);
          kit.label(c, t, 490, y, { size: 11.5, weight: on ? 700 : 500, color: on ? C.text : C.muted });
        });
        c.save(); c.translate(530, 230); c.scale(2.2, 2.2); S.gauge(c, 0, 0, { frac: s.p / 400e5 }); c.restore();
        kit.label(c, (s.p / 1e5).toFixed(0) + ' bar', 578, 222, { size: 16, weight: 700 });
        kit.label(c, (F / 9806.65).toFixed(0) + ' tonnes-force', 578, 244, { size: 12, color: C.muted });
        if (s.E[0] > 0) {
          const tot = s.E[0] + s.E[1], w = 250;
          kit.label(c, 'energy stored at full pressure: ' + (tot / 1000).toFixed(1) + ' kJ', 478, 300, { size: 11.5, weight: 700 });
          c.fillStyle = tint(C, BLUE[0], BLUE[1], 0.6); c.fillRect(478, 312, w * s.E[0] / tot, 16);
          c.fillStyle = tint(C, '224,160,48', '184,120,10', 0.6); c.fillRect(478 + w * s.E[0] / tot, 312, w * s.E[1] / tot, 16);
          kit.label(c, 'oil', 480, 340, { size: 10.5, color: C.muted }); kit.label(c, 'frame and work', 478 + w, 340, { size: 10.5, color: C.muted, align: 'right' });
        }
        if (s.bang > 0) kit.label(c, 'SHOCK: ' + (s.dec.rate / 1e8).toFixed(0) + ' bar per ms', 478, 372, { size: 14, weight: 700, color: C.bad });
        else if (s.dec.dur > 0) kit.label(c, 'released in ' + s.dec.dur.toFixed(s.dec.dur < 0.2 ? 3 : 2) + ' s, peak ' + (s.dec.Qpk * 60000).toFixed(0) + ' L/min', 478, 372, { size: 11.5, color: C.text });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });


})();
