/* HYPER-HYDRAULICS · sims/reference.js — reference simulations for hydraulics authors.
 *   ref-hyd-circuit  a working circuit in ISO 1219 symbols (kit.fsym): motor and fixed pump, relief valve,
 *                    4/3 solenoid valve (closed or tandem centre), double-acting cylinder against a load.
 *                    A quasi-steady model: the pump flow divides between the cylinder and the relief valve
 *                    so that the pressures balance; lines coloured by what they carry, flow shown as dots.
 *   ref-cylinder     a cylinder in section: bore, rod, pressure and flow → force, speed, area ratio,
 *                    extend / retract / regenerative
 */
(function () {
  'use strict';

  Hyper.sim('ref-hyd-circuit', {
    title: 'A cylinder circuit, working',
    blurb: `A motor drives a fixed-displacement pump (16 cm³/rev). A relief valve limits the pressure; a spring-centred 4/3 solenoid valve sends the oil to either end of a 63/36 mm cylinder, which pushes against a load. Lines are coloured by what they carry — **red** pressure, **blue** return to tank, **green** suction — and the dots move with the flow.

**Try this**
- Watch the gauge during a stroke: the pressure is set by the load, not by the pump. Raise the load and the pressure follows.
- Let the rod reach the end of its stroke with the valve still shifted: the pressure jumps to the relief setting and all the pump's power becomes heat.
- Stop in mid-stroke with the closed centre, then with the tandem centre. Compare the heat: the tandem centre lets the pump unload to the tank at a few bar.
- Raise the load above what the relief setting allows (about 50 kN at 160 bar): the cylinder stalls. Raise the relief setting to move it again.
- Halve the pump speed: the rod moves at half the speed, with the same force.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '4px 10px 10px';
      box.stage.appendChild(graphBox);
      let cmd = 1, auto = true, wait = 0;
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'ext', label: 'Extend (Y1)' }, { id: 'stop', label: 'Stop' }, { id: 'ret', label: 'Retract (Y2)' }] },
        { id: 'auto', type: 'check', label: 'Cycle automatically', value: true },
        { id: 'F', label: 'Load against extension', min: 0, max: 70, step: 1, value: 20, unit: 'kN' },
        { id: 'relief', label: 'Relief-valve setting', min: 40, max: 250, step: 5, value: 160, unit: 'bar' },
        { id: 'rpm', label: 'Pump speed', min: 0, max: 1800, step: 50, value: 1450, unit: 'rpm' },
        { id: 'centre', type: 'select', label: 'Valve centre', options: [['Closed centre', 'closed'], ['Tandem centre (pump unloads)', 'tandem']], value: 'closed' }
      ], (id, v) => {
        if (id === 'ext') { cmd = 1; ctl.set('auto', false); auto = false; }
        if (id === 'stop') { cmd = 0; ctl.set('auto', false); auto = false; }
        if (id === 'ret') { cmd = -1; ctl.set('auto', false); auto = false; }
        if (id === 'auto') auto = v;
      });
      const ro = kit.readout(box.side, [['p', 'Pump pressure'], ['pab', 'Cap end / rod end'], ['q', 'Flow to cylinder / over relief'], ['v', 'Rod speed'], ['pw', 'Useful power / pump power'], ['heat', 'Heat into the oil']]);
      const plot = kit.plot(graphBox, { x: { label: 'time (s)' }, y: { label: 'pressure (bar)', min: 0 }, legend: true }, 150);
      const V = ctl.values;
      // the machine
      const Vg = 16e-6, etaV = 0.95, D = 0.063, d = 0.036, stroke = 0.4, fr = 800;
      const A1 = Math.PI * D * D / 4, A2 = Math.PI * (D * D - d * d) / 4;
      const kv = 6e5 / Math.pow(3.67e-4, 2);                 // each valve path drops 6 bar at 22 L/min
      const dpv = q => kv * q * q;
      const s = { x: 0.05, vstate: 1, t: 0, ph: {}, hist: [], tPlot: 0 };
      let out = {};
      function solveFlow(Qp, need, pSet) {
        const pc = pSet - 10e5;                               // the relief cracks 10 bar below its full-flow setting
        const Qr = p => p <= pc ? 0 : Qp * Math.min(1.5, (p - pc) / (pSet - pc));
        if (Qp <= 0) return { Q: 0, p: Math.max(0, need(0)), Qr: 0 };
        if (Qr(need(0)) >= Qp) return { Q: 0, p: pSet, Qr: Qp };   // stalled: everything over the relief valve
        let lo = 0, hi = Qp;
        for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (m + Qr(need(m)) > Qp) hi = m; else lo = m; }
        return { Q: lo, p: need(lo), Qr: Qr(need(lo)) };
      }
      function step(dt) {
        const Qp = Vg * V.rpm / 60 * etaV, pSet = V.relief * 1e5, F = V.F * 1000;
        // automatic cycling: reverse a moment after reaching each end
        if (auto) {
          if (cmd === 1 && s.x >= stroke - 1e-6) { wait += dt; if (wait > 0.8) { cmd = -1; wait = 0; } }
          else if (cmd === -1 && s.x <= 1e-6) { wait += dt; if (wait > 0.8) { cmd = 1; wait = 0; } }
          else if (cmd === 0) cmd = 1;
        }
        const target = cmd === 1 ? 0 : cmd === -1 ? 2 : 1;       // valve box: 0 = P→A, B→T; 1 = centre; 2 = P→B, A→T
        s.vstate += Math.max(-dt / 0.08, Math.min(dt / 0.08, target - s.vstate));
        const box = Math.round(s.vstate);
        let r, v = 0, pA = 0, pB = 0, Qin = 0, Qout = 0;
        if (box === 0 && s.x < stroke) {
          r = solveFlow(Qp, Q => (F + fr + dpv(Q * A2 / A1) * A2) / A1 + dpv(Q), pSet);
          Qin = r.Q; Qout = Qin * A2 / A1; v = Qin / A1; pA = r.p - dpv(Qin); pB = dpv(Qout);
        } else if (box === 2 && s.x > 0) {
          r = solveFlow(Qp, Q => (fr + dpv(Q * A1 / A2) * A1) / A2 + dpv(Q), pSet);
          Qin = r.Q; Qout = Qin * A1 / A2; v = -Qin / A2; pB = r.p - dpv(Qin); pA = dpv(Qout);
        } else if (box === 1 && V.centre === 'tandem') {
          r = { Q: 0, p: 3e5 * Math.pow(Qp / 3.67e-4, 2), Qr: 0 };   // P connected to T in the centre: the pump unloads
          pA = s.x > 0 && s.x < stroke ? F / A1 : 0; pB = 0;                                   // the blocked A and B ports still hold the load
        } else {
          r = { Q: 0, p: Qp > 0 ? pSet : 0, Qr: Qp };                // dead-headed: all flow over the relief valve
          if (box === 1) { pA = s.x > 0 && s.x < stroke ? F / A1 : 0; pB = 0; }                 // oil trapped by the closed centre holds the load
          else if (box === 0) { pA = r.p; pB = 0; }
          else { pB = r.p; pA = 0; }
        }
        s.x = Math.max(0, Math.min(stroke, s.x + v * dt));
        const heat = r.p * r.Qr + dpv(Qin) * Qin + dpv(Qout) * Qout + (box === 1 && V.centre === 'tandem' ? r.p * Qp : 0);
        out = { Qp, r, v, pA, pB, Qin, Qout, box, useful: Math.max(0, F * v), input: r.p * Qp, heat };
        s.t += dt;
      }
      const pbar = p => (p / 1e5).toFixed(0) + ' bar';
      const lpm = q => (q * 60000).toFixed(1) + ' L/min';
      const loop = kit.loop((dt) => {
        for (let k = 0; k < 4; k++) step(dt / 4);
        const o = out, C = kit.colors();
        ro.set('p', pbar(o.r.p) + (o.r.Qr > 1e-6 && o.r.p > (V.relief - 10) * 1e5 ? '  (relief open)' : ''));
        ro.set('pab', pbar(o.pA) + ' / ' + pbar(o.pB));
        ro.set('q', lpm(o.Qin) + ' / ' + lpm(o.r.Qr));
        ro.set('v', (Math.abs(o.v) * 1000).toFixed(0) + ' mm/s ' + (o.v > 1e-6 ? 'out' : o.v < -1e-6 ? 'in' : '(stopped)'));
        ro.set('pw', (o.useful / 1000).toFixed(2) + ' kW / ' + (o.input / 1000).toFixed(2) + ' kW');
        ro.set('heat', (o.heat / 1000).toFixed(2) + ' kW');
        s.tPlot += dt;
        if (s.tPlot > 0.1) {
          s.tPlot = 0; s.hist.push([s.t, o.r.p / 1e5, o.pA / 1e5]); if (s.hist.length > 150) s.hist.shift();
          plot.set({ series: [{ pts: s.hist.map(h => [h[0], h[1]]), label: 'pump' }, { pts: s.hist.map(h => [h[0], h[2]]), label: 'cap end', dash: [5, 4] }], hlines: [{ y: V.relief, label: 'relief setting' }] });
        }
        // ---- drawing, on a 760 × 440 design grid
        const c = st.begin(), k = Math.min(st.W / 760, st.H / 440);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 440 * k) / 2); c.scale(k, k);
        const col = S.col, moving = Math.abs(o.v) > 1e-6, hp = o.r.p > 20e5;
        const lineA = o.box === 0 && moving ? 'pressure' : o.box === 2 && moving ? 'return' : o.pA > 20e5 ? 'metered' : 'idle';
        const lineB = o.box === 2 && moving ? 'pressure' : o.box === 0 && moving ? 'return' : 'idle';
        const cyl = { x: 300, y: 80 }, pos = s.x / stroke;
        const paths = {
          suction: [[200, 356], [200, 370]],
          header: [[200, 304], [200, 292], [403.2, 292], [403.2, 277]],
          gauge: [[250, 283], [250, 292]],
          relief: [[290, 292], [290, 311]],
          reliefOut: [[290, 369], [290, 370]],
          tankLine: [[416.8, 277], [416.8, 370]],
          A: [[308, 110], [308, 150], [403.2, 150], [403.2, 223]],
          B: [[492, 110], [492, 175], [416.8, 175], [416.8, 223]]
        };
        S.line(c, paths.suction, { state: V.rpm > 0 ? 'suction' : 'idle' });
        S.line(c, paths.header, { state: hp ? 'pressure' : 'idle' });
        S.line(c, paths.gauge, { state: hp ? 'pressure' : 'idle' });
        S.line(c, paths.relief, { state: hp ? 'pressure' : 'idle' });
        S.line(c, paths.reliefOut, { state: o.r.Qr > 1e-7 ? 'return' : 'idle' });
        S.line(c, paths.tankLine, { state: (o.Qout > 1e-7 || (o.box === 1 && V.centre === 'tandem')) ? 'return' : 'idle' });
        S.line(c, paths.A, { state: lineA });
        S.line(c, paths.B, { state: lineB });
        S.junction(c, 250, 292); S.junction(c, 290, 292);
        // flow dots: speed proportional to the flow in each line
        const adv = (key, q) => { s.ph[key] = (s.ph[key] || 0) + dt * 90 * q / 3.67e-4; return s.ph[key]; };
        if (o.Qp > 0) { S.flow(c, paths.suction, adv('su', o.Qp), { color: col('suction') }); S.flow(c, paths.header, adv('he', o.Qp), { color: col('pressure') }); }
        if (o.r.Qr > 1e-7) { S.flow(c, paths.relief.concat(paths.reliefOut), adv('re', o.r.Qr), { color: col('pressure') }); }
        if (o.box === 0 && moving) { S.flow(c, paths.A.slice().reverse(), adv('a', o.Qin), { color: col('pressure') }); S.flow(c, paths.B.concat([[416.8, 277], [416.8, 370]]), adv('b', o.Qout), { color: col('return') }); }
        if (o.box === 2 && moving) { S.flow(c, paths.B.slice().reverse(), adv('b', o.Qin), { color: col('pressure') }); S.flow(c, paths.A.concat([[403.2, 277], [416.8, 277], [416.8, 370]]), adv('a', o.Qout), { color: col('return') }); }
        if (o.box === 1 && V.centre === 'tandem' && o.Qp > 0) S.flow(c, [[416.8, 277], [416.8, 370]], adv('t', o.Qp), { color: col('return') });
        // symbols
        S.pump(c, 200, 330, { motor: true, label: '' });
        S.tank(c, 200, 380); S.tank(c, 290, 380); S.tank(c, 416.8, 380);
        S.pressureValve(c, 290, 340, { kind: 'relief', rot: 180, open: Math.min(1, o.r.Qr / Math.max(o.Qp, 1e-9)) });
        S.gauge(c, 250, 262, { frac: o.r.p / 400e5, value: pbar(o.r.p) });
        const v4 = S.valve(c, 410, 250, { spec: V.centre === 'tandem' ? '4/3 tandem' : '4/3 closed', state: s.vstate, left: 'spring+solenoid', right: 'spring+solenoid', s: 34, labels: true });
        kit.label(c, 'Y1', v4.xl - 10, 250, { color: cmd === 1 ? C.bad : C.muted, size: 12, weight: 700, align: 'right' });
        kit.label(c, 'Y2', v4.xr + 10, 250, { color: cmd === -1 ? C.bad : C.muted, size: 12, weight: 700, align: 'left' });
        const fillP = p => p > 20e5 ? (C.dark ? 'rgba(255,92,92,' : 'rgba(214,40,40,') + Math.min(0.45, 0.1 + p / 400e5) + ')' : null;
        const cy = S.cylinder(c, cyl.x, cyl.y, { len: 200, h: 40, pos, fillA: fillP(o.pA), fillB: fillP(o.pB) });
        // the load: a block the rod pushes against
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(cy.tip[0], cyl.y - 22, 40, 44); c.strokeRect(cy.tip[0], cyl.y - 22, 40, 44);
        if (V.F > 0) kit.arrow(c, cy.tip[0] + 40 + 10 + Math.min(60, V.F), cyl.y, cy.tip[0] + 44, cyl.y, C.warn, 2.5);
        kit.label(c, 'load ' + V.F.toFixed(0) + ' kN', cy.tip[0] + 20, cyl.y - 34, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'relief ' + V.relief + ' bar', 304, 402, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, (V.rpm / 60 * Vg * etaV * 60000).toFixed(1) + ' L/min', 150, 300, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'A', 300, 150, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'B', 500, 175, { color: C.muted, size: 11, align: 'left' });
        const msg = o.box !== 1 && !moving && o.Qp > 0 ? (s.x >= stroke - 1e-6 || s.x <= 1e-6 ? 'end of stroke: pump flow over the relief valve' : 'stalled: the load needs more than the relief setting') : o.box === 1 ? (V.centre === 'tandem' ? 'centre: pump unloads to tank' : 'centre: pump flow over the relief valve') : '';
        if (msg) kit.label(c, msg, 740, 420, { color: o.heat > 2000 ? C.bad : C.muted, size: 12, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  Hyper.sim('ref-cylinder', {
    title: 'Cylinder force and speed',
    blurb: `A double-acting cylinder in section. Choose the bore, the rod, the pressure and the flow; the cylinder strokes in the mode you pick, with its force, speed and return flow.

**Try this**
- Compare extend and retract: the pull is smaller and the return faster, both by the area ratio φ = A₁/A₂.
- Make the rod half the bore (φ ≈ 1.33), then 0.7 of it (φ = 2): a 2:1 cylinder retracts twice as fast as it extends.
- Switch to regenerative extend: the rod-end oil joins the pump flow, so the rod moves out much faster — with only the rod's area pushing.
- Double the pressure: force doubles, speed does not change. Double the flow: speed doubles, force does not change.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Bore D', min: 25, max: 200, step: 1, value: 63, unit: 'mm' },
        { id: 'dr', label: 'Rod d (fraction of bore)', min: 0.3, max: 0.8, step: 0.01, value: 0.57 },
        { id: 'p', label: 'Pressure (gauge)', min: 10, max: 350, step: 5, value: 160, unit: 'bar' },
        { id: 'Q', label: 'Pump flow', min: 2, max: 200, step: 1, value: 22, unit: 'L/min', log: true },
        { id: 'L', label: 'Stroke', min: 100, max: 1500, step: 10, value: 400, unit: 'mm' },
        { id: 'mode', type: 'select', label: 'Mode', options: [['Extend', 'ext'], ['Retract', 'ret'], ['Regenerative extend', 'regen'], ['Cycle: extend then retract', 'cycle']], value: 'cycle' }
      ], () => {});
      const ro = kit.readout(box.side, [['A', 'A₁ / A₂'], ['phi', 'Area ratio φ = A₁/A₂'], ['F', 'Force'], ['v', 'Speed'], ['t', 'Stroke time'], ['ret', 'Flow out of the other end'], ['P', 'Power p·Q']]);
      const V = ctl.values;
      let x = 0, dir = 1;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        const D = V.D / 1000, d = V.D * V.dr / 1000, A1 = Math.PI * D * D / 4, A2 = A1 - Math.PI * d * d / 4, Ar = A1 - A2;
        const p = V.p * 1e5, Q = V.Q / 60000, L = V.L / 1000;
        let mode = V.mode === 'cycle' ? (dir > 0 ? 'ext' : 'ret') : V.mode;
        const F = mode === 'ext' ? p * A1 : mode === 'ret' ? p * A2 : p * Ar;
        const v = mode === 'ext' ? Q / A1 : mode === 'ret' ? Q / A2 : Q / Ar;
        const qOther = mode === 'ext' ? v * A2 : mode === 'ret' ? v * A1 : 0;
        const sgn = mode === 'ret' ? -1 : 1;
        // animate in scaled time so every stroke takes 1.5–4 s on screen
        const T = L / v, show = Math.min(4, Math.max(1.5, T));
        x += sgn * dt / show;
        if (V.mode === 'cycle') { if (x >= 1) { x = 1; dir = -1; } if (x <= 0) { x = 0; dir = 1; } }
        else { if (x >= 1 && sgn > 0) x = 0; if (x <= 0 && sgn < 0) x = 1; }
        ro.set('A', (A1 * 1e4).toFixed(1) + ' cm² / ' + (A2 * 1e4).toFixed(1) + ' cm²');
        ro.set('phi', (A1 / A2).toFixed(2));
        ro.set('F', (F / 1000).toFixed(1) + ' kN ' + (sgn > 0 ? 'push' : 'pull') + '  (' + (F / 9806.65).toFixed(2) + ' t)');
        ro.set('v', (v * 1000).toFixed(0) + ' mm/s');
        ro.set('t', T.toFixed(2) + ' s');
        ro.set('ret', mode === 'regen' ? 'rod-end oil joins the inlet: ' + (v * A2 * 60000).toFixed(1) + ' L/min' : (qOther * 60000).toFixed(1) + ' L/min to tank');
        ro.set('P', (p * Q / 1000).toFixed(2) + ' kW');
        // drawing: barrel height from the bore (log-ish), rod proportional
        const W = st.W, H = st.H, bx = W * 0.1, bw = W * 0.5, bh = Math.min(H * 0.55, 40 + 60 * Math.log10(V.D / 20)), cy = H * 0.52;
        const rh = bh * V.dr, pw = 10, px = bx + 6 + x * (bw - 12 - pw);
        const red = C.dark ? 'rgba(255,92,92,.45)' : 'rgba(214,40,40,.3)', blue = C.dark ? 'rgba(90,162,255,.35)' : 'rgba(31,99,214,.22)';
        const capFill = mode === 'ret' ? blue : red, rodFill = mode === 'ext' ? blue : red;
        c.fillStyle = capFill; c.fillRect(bx, cy - bh / 2, px - bx, bh);
        c.fillStyle = rodFill; c.fillRect(px + pw, cy - bh / 2, bx + bw - px - pw, bh);
        c.strokeStyle = C.text; c.lineWidth = 3; c.strokeRect(bx, cy - bh / 2, bw, bh);
        c.fillStyle = C.text; c.fillRect(px, cy - bh / 2 + 2, pw, bh - 4);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(px + pw, cy - rh / 2, bw * 0.95, rh); c.strokeRect(px + pw, cy - rh / 2, bw * 0.95, rh);
        // ports and flow arrows
        const inCap = mode !== 'ret', q = kit.colors();
        kit.arrow(c, bx + 16, cy + bh / 2 + 34, bx + 16, cy + bh / 2 + 4, inCap ? C.bad : q.accent, 2.5);
        if (!inCap) kit.arrow(c, bx + 16, cy + bh / 2 + 4, bx + 16, cy + bh / 2 + 34, q.accent, 2.5);
        const rx = bx + bw - 16;
        if (mode === 'ext') kit.arrow(c, rx, cy + bh / 2 + 4, rx, cy + bh / 2 + 34, q.accent, 2.5);
        else if (mode === 'ret') kit.arrow(c, rx, cy + bh / 2 + 34, rx, cy + bh / 2 + 4, C.bad, 2.5);
        else { kit.arrow(c, rx, cy + bh / 2 + 4, rx, cy + bh / 2 + 28, C.bad, 2.5); c.strokeStyle = C.bad; c.lineWidth = 2; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(rx, cy + bh / 2 + 34); c.lineTo(bx + 16, cy + bh / 2 + 34); c.stroke(); c.setLineDash([]); }
        const tip = px + pw + bw * 0.95, fl = Math.min(90, 20 + 25 * Math.log10(1 + F / 1000));
        kit.arrow(c, tip + 6, cy, tip + 6 + sgn * fl, cy, C.ok, 3.5);
        kit.label(c, (F / 1000).toFixed(1) + ' kN', tip + 10 + (sgn > 0 ? fl : 0), cy - 16, { color: C.text, size: 13, weight: 700, align: 'left' });
        kit.label(c, 'cap end  p on A₁', bx + 4, cy - bh / 2 - 12, { color: C.muted, size: 12, align: 'left' });
        kit.label(c, 'rod end  p on A₂', bx + bw - 4, cy - bh / 2 - 12, { color: C.muted, size: 12, align: 'right' });
        kit.label(c, mode === 'regen' ? 'regenerative: both ends at pump pressure, net area = rod area' : mode === 'ext' ? 'extending' : 'retracting', W / 2, H - 14, { color: C.text, size: 12, weight: 700 });
      }, box.stage);
      loop.start();
    }
  });
})();
