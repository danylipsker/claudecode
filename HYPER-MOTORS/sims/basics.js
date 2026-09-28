/* HYPER-MOTORS · sims/basics.js — simulations for How Motors Work (content/basics.js).
 *   mb-force            a wire in a magnetic field (the catapult field and F = BIL) and a coil on a shaft with a commutator
 *   mb-torque-power     the same power at different speeds: motor, gearbox and load drawn to their torque; log–log graph
 *   mb-back-emf         a DC motor switched on: current, speed and back-EMF with time; overhauling load makes it generate
 *   mb-magnetic-circuit a C-core with a coil and an air gap: DC operating point on the B–H curve, AC saturation and V/f
 *   mb-four-quadrant    a DC hoist in the four quadrants: motoring, lowering, regenerating, and a drive that cannot take power back
 *   mb-loss-flow        where the power goes: a Sankey diagram of the losses and the efficiency against load
 *   mb-power-factor     phasors, waveforms and the power triangle of an induction motor, with correction capacitors
 *   mb-duty             the winding temperature through duty cycles S1, S2, S3 and S6
 *   mb-nameplate        an interactive nameplate (IEC and NEMA): click a field to see what it means and what follows from it
 *   mb-insulation-life  temperatures stacked against the class limit, and insulation life by the 10 K rule
 *   mb-ip-cooling       the IP code (what it keeps out) and IC cooling on a drive at low speed (loadability)
 *   mb-ie-classes       IE1–IE5 minimum efficiencies against power, and the yearly cost of the losses
 *   mb-frames           IEC and NEMA frames drawn to scale with their shafts, feet and flanges
 * Engine additions kept here: none beyond small local models (thermal model, B–H curve, IE1 table, frame tables).
 */
(function () {
  'use strict';

  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const TAU = 2 * Math.PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rpmOf = w => w * 60 / TAU, radOf = n => n * TAU / 60;
  // a row of graph slots under the stage
  function graphs(box, n) {
    const gb = document.createElement('div');
    gb.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;padding:4px 10px 10px';
    box.stage.appendChild(gb);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  }
  // scale a fixed W0 × H0 design into the stage, centred; returns the scale
  function fit(c, st, W0, H0) {
    const s = Math.min(st.W / W0, st.H / H0);
    c.translate((st.W - W0 * s) / 2, (st.H - H0 * s) / 2); c.scale(s, s);
    return s;
  }
  // canvas point to design coordinates (inverse of fit)
  function toDesign(st, p, W0, H0) {
    const s = Math.min(st.W / W0, st.H / H0);
    return { x: (p.x - (st.W - W0 * s) / 2) / s, y: (p.y - (st.H - H0 * s) / 2) / s };
  }
  const fmt = (v, d) => (Number.isFinite(v) ? v : 0).toFixed(d == null ? 1 : d);

  /* ================================================================ mb-force */
  Hyper.sim('mb-force', {
    title: 'Force on a wire, torque on a coil',
    blurb: `**A straight wire.** A wire runs across the field between a north and a south pole, seen end-on: a dot means current coming out of the screen, a cross current going in. The field lines are traced from the magnets' field plus the wire's own circular field (drawn much stronger than it really is, so that you can see it). They crowd on one side and thin out on the other, and the wire is pushed towards the thin side with $F = BIL$.

**A coil on a shaft.** The same force on the two sides of a coil makes a torque. Try a single coil without a commutator, then add the commutator, curved pole faces and three coils — the steps that turn a rocking coil into a motor. The graph is the torque against the rotor angle; the shaft drives a heavy damper so that you can follow it.

**Try this**
- Reverse the current: the crowding moves to the other side and the force reverses. Set B to zero: no force, however large the current.
- Double the current or the length: the force doubles (the readout shows $F$ in newtons).
- Coil mode, no commutator: press *Give it a push* — the coil swings and settles facing the poles, where the torque is zero.
- Tick the commutator: now the torque never reverses and the coil keeps turning, but it pulses.
- Choose curved poles (radial field): full torque under the poles, nothing in the gaps. Then three coils: the gaps fill in and the torque is almost smooth.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.47, minH: 240 });
      const [g1] = graphs(box, 1);
      const pl = kit.plot(g1, { x: { label: 'rotor angle (°)', min: 0, max: 360 }, y: { label: 'torque (N·m)' }, legend: true }, 180);
      const N = 50, Lc = 0.1, Dc = 0.1, J = 0.004, bd = 0.6, fc = 0.05, POLE = 55 * Math.PI / 180;
      let V = null, th = 0.9, w = 0, lastPlot = -1;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['A straight wire across the field', 'wire'], ['A coil on a shaft', 'coil']], value: 'wire' },
        { id: 'B', label: 'Flux density B', min: 0, max: 1.2, step: 0.05, value: 0.8, unit: 'T' },
        { id: 'I', label: 'Wire current (+ out of the screen)', min: -20, max: 20, step: 0.5, value: 10, unit: 'A' },
        { id: 'L', label: 'Length of wire in the field', min: 0.05, max: 1, step: 0.05, value: 0.2, unit: 'm' },
        { id: 'Ic', label: 'Coil current (50 turns)', min: 0, max: 10, step: 0.1, value: 5, unit: 'A' },
        { id: 'field', type: 'select', label: 'Pole faces', options: [['Flat poles: uniform field', 'uni'], ['Curved poles: radial field', 'rad']], value: 'uni' },
        { id: 'coils', type: 'select', label: 'Coils on the rotor', options: [['One coil', 1], ['Three coils, 60° apart', 3]], value: 1 },
        { id: 'comm', type: 'check', label: 'Commutator (reverses each coil current every half turn)', value: false },
        { type: 'buttons', items: [{ id: 'push', label: 'Give it a push', primary: true }] }
      ], id => { if (id === 'mode') showMode(); if (id === 'push') w += 8; lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['F', 'Force'], ['T', 'Torque now'], ['Ta', 'Average torque over a turn'], ['n', 'Speed']]);
      function showMode() {
        const coil = V.mode === 'coil';
        ['Ic', 'field', 'coils', 'comm', 'push'].forEach(k => ctl.show(k, coil));
        ['I', 'L'].forEach(k => ctl.show(k, !coil));
        ro.show('T', coil); ro.show('Ta', coil); ro.show('n', coil);
      }
      showMode();
      // torque of one coil whose side A sits at math angle a (side B opposite, current reversed)
      const coilT = a => {
        const c = Math.cos(a);
        const g = V.field === 'uni' ? c : (Math.abs(c) > Math.cos(POLE) ? Math.sign(c) : 0);
        const sgn = V.comm ? (c >= 0 ? 1 : -1) : 1;
        return N * V.B * V.Ic * Lc * Dc * g * sgn;
      };
      const totalT = a => { let s = 0; for (let k = 0; k < V.coils; k++) s += coilT(a + k * Math.PI / 3); return s; };
      // field line tracing (design coordinates, y down): uniform field to the right plus the wire's circulating field
      const fieldAt = (x, y, cx, cy) => {
        const dx = x - cx, dy = y - cy, r2 = Math.max(dx * dx + dy * dy, 150);
        const k = (V.I / 20) * 40;                       // exaggerated wire field: equals 1 (the magnets at 0.8 T) at 40 px for 20 A
        const b0 = V.B / 0.8;
        return [b0 + k * dy / r2, -k * dx / r2];         // current out of the screen circulates anticlockwise on screen
      };
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W0 = 640, H0 = 300;
        c.save(); fit(c, st, W0, H0);
        c.font = '12px ' + font(); c.textAlign = 'center';
        if (V.mode === 'wire') {
          const cx = 320, cy = 150;
          // poles
          c.fillStyle = 'hsl(0 70% 50% / .5)'; c.fillRect(20, 30, 60, 240); c.fillStyle = 'hsl(215 70% 50% / .5)'; c.fillRect(560, 30, 60, 240);
          c.fillStyle = C.text; c.font = 'bold 20px ' + font(); c.fillText('N', 50, 157); c.fillText('S', 590, 157); c.font = '12px ' + font();
          // field lines
          c.strokeStyle = C.muted; c.lineWidth = 1.2;
          for (let y0 = 38; y0 <= 262; y0 += 14) {
            let x = 84, y = y0; c.beginPath(); c.moveTo(x, y);
            for (let k = 0; k < 500; k++) {
              const f = fieldAt(x, y, cx, cy), m = Math.hypot(f[0], f[1]);
              if (m < 1e-6) break;
              x += 3 * f[0] / m; y += 3 * f[1] / m;
              if (x > 556 || x < 84 || y < 28 || y > 272 || Math.hypot(x - cx, y - cy) < 17) break;
              c.lineTo(x, y);
            }
            c.stroke();
          }
          if (V.B < 0.01 && Math.abs(V.I) > 0) { c.strokeStyle = C.faint; for (const r of [30, 55, 85]) { c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke(); } }
          // the wire
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, 15, 0, TAU); c.fill(); c.stroke();
          c.fillStyle = C.accent; c.strokeStyle = C.accent; c.lineWidth = 3;
          if (V.I > 0) { c.beginPath(); c.arc(cx, cy, 4, 0, TAU); c.fill(); }
          else if (V.I < 0) { c.beginPath(); c.moveTo(cx - 7, cy - 7); c.lineTo(cx + 7, cy + 7); c.moveTo(cx + 7, cy - 7); c.lineTo(cx - 7, cy + 7); c.stroke(); }
          const F = V.B * V.I * V.L, len = Math.sign(F) * Math.min(110, 18 * Math.sqrt(Math.abs(F)));
          if (Math.abs(F) > 1e-6) kit.arrow(c, cx, cy - Math.sign(F) * 18, cx, cy - Math.sign(F) * 18 - len, C.warn, 4);
          c.fillStyle = C.text; c.textAlign = 'left';
          c.fillText('F = B I L = ' + fmt(V.B, 2) + ' × ' + fmt(V.I, 1) + ' × ' + fmt(V.L, 2) + ' = ' + fmt(Math.abs(F), 2) + ' N ' + (F > 0 ? 'upwards' : F < 0 ? 'downwards' : ''), 96, 22);
          c.fillStyle = C.muted; c.fillText(V.I === 0 ? 'no current: no force' : 'lines crowd on the ' + (F > 0 ? 'lower' : 'upper') + ' side and push the wire ' + (F > 0 ? 'up' : 'down'), 96, 292);
          ro.set('F', fmt(Math.abs(F), 2) + ' N ' + (F > 0 ? '(up)' : F < 0 ? '(down)' : ''));
          if (lastPlot < 0) {
            lastPlot = 1;
            const pts = []; for (let i = -20; i <= 20; i++) pts.push([i, V.B * i * V.L]);
            pl.set({ x: { label: 'current (A)', min: -20, max: 20 }, y: { label: 'force (N), + upwards' }, series: [{ pts, label: 'F = BIL at ' + fmt(V.B, 2) + ' T, ' + fmt(V.L, 2) + ' m' }], marks: [{ x: V.I, y: F, label: 'now' }], hlines: [] });
          }
        } else {
          // dynamics of the coil and damper
          const sub = 20, h = dt / sub;
          for (let k = 0; k < sub; k++) {
            const Tm = totalT(th);
            if (Math.abs(w) < 0.02 && Math.abs(Tm) <= fc) w = 0;
            else { w += h * (Tm - bd * w - fc * Math.sign(w || Tm)) / J; th += h * w; }
          }
          th = ((th % TAU) + TAU) % TAU;
          const cx = 250, cy = 150, R = 72, Tnow = totalT(th);
          // stator poles
          if (V.field === 'uni') {
            c.fillStyle = 'hsl(0 70% 50% / .5)'; c.fillRect(60, 40, 70, 220); c.fillStyle = 'hsl(215 70% 50% / .5)'; c.fillRect(370, 40, 70, 220);
            c.strokeStyle = C.faint; c.lineWidth = 1; for (let y = 55; y <= 245; y += 19) { c.beginPath(); c.moveTo(130, y); c.lineTo(370, y); c.stroke(); }
          } else {
            c.lineWidth = 34;
            c.strokeStyle = 'hsl(0 70% 50% / .5)'; c.beginPath(); c.arc(cx, cy, 112, Math.PI - POLE, Math.PI + POLE); c.stroke();
            c.strokeStyle = 'hsl(215 70% 50% / .5)'; c.beginPath(); c.arc(cx, cy, 112, -POLE, POLE); c.stroke();
            c.lineWidth = 1; c.strokeStyle = C.faint;
            for (let a = -POLE; a <= POLE + 1e-6; a += POLE / 3) for (const s of [0, Math.PI]) { const aa = a + s; c.beginPath(); c.moveTo(cx + 94 * Math.cos(aa), cy + 94 * Math.sin(aa)); c.lineTo(cx + 82 * Math.cos(aa), cy + 82 * Math.sin(aa)); c.stroke(); }
            c.fillStyle = C.surface2; c.beginPath(); c.arc(cx, cy, 80, 0, TAU); c.fill();
          }
          c.fillStyle = C.text; c.font = 'bold 18px ' + font(); c.fillText('N', V.field === 'uni' ? 95 : cx - 112, cy + 6); c.fillText('S', V.field === 'uni' ? 405 : cx + 112, cy + 6); c.font = '12px ' + font();
          // coils
          const hues = [28, 160, 265];
          for (let k = 0; k < V.coils; k++) {
            const a = th + k * Math.PI / 3, cs = Math.cos(a), sgnI = V.comm ? (cs >= 0 ? 1 : -1) : 1;
            const pA = [cx + R * Math.cos(a), cy - R * Math.sin(a)], pB = [cx - R * Math.cos(a), cy + R * Math.sin(a)];
            c.strokeStyle = 'hsl(' + hues[k] + ' 70% 55% / .6)'; c.lineWidth = 2; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(pA[0], pA[1]); c.lineTo(pB[0], pB[1]); c.stroke(); c.setLineDash([]);
            [[pA, sgnI, a], [pB, -sgnI, a + Math.PI]].forEach(([p, s, ang]) => {
              c.fillStyle = 'hsl(' + hues[k] + ' 70% 55%)'; c.beginPath(); c.arc(p[0], p[1], 9, 0, TAU); c.fill();
              c.strokeStyle = C.bg2; c.fillStyle = C.bg2; c.lineWidth = 2;
              if (V.Ic > 0) { if (s > 0) { c.beginPath(); c.arc(p[0], p[1], 3, 0, TAU); c.fill(); } else { c.beginPath(); c.moveTo(p[0] - 4, p[1] - 4); c.lineTo(p[0] + 4, p[1] + 4); c.moveTo(p[0] + 4, p[1] - 4); c.lineTo(p[0] - 4, p[1] + 4); c.stroke(); } }
              // force on this side: uniform field → vertical; radial field → tangential while under a pole
              const Fm = N * V.B * V.Ic * Lc * s;
              let fx = 0, fy = 0;
              if (V.field === 'uni') fy = -Fm;
              else if (Math.abs(Math.cos(ang)) > Math.cos(POLE)) { const tg = Math.sign(Math.cos(ang)); fx = -Math.sin(ang) * Fm * tg; fy = -Math.cos(ang) * Fm * tg; }
              const m = Math.hypot(fx, fy);
              if (m > 1e-6) { const l = Math.min(40, 5 * Math.sqrt(m)); kit.arrow(c, p[0], p[1], p[0] + fx / m * l, p[1] + fy / m * l, C.warn, 2.5); }
            });
          }
          c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 6, 0, TAU); c.fill();
          if (V.comm) { c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, 16, th + 0.15, th + Math.PI - 0.15); c.stroke(); c.beginPath(); c.arc(cx, cy, 16, th + Math.PI + 0.15, th + TAU - 0.15); c.stroke(); c.fillStyle = C.faint; c.fillRect(cx - 28, cy - 4, 8, 8); c.fillRect(cx + 20, cy - 4, 8, 8); }
          // text panel
          c.textAlign = 'left'; c.fillStyle = C.text; c.font = '13px ' + font();
          c.fillText('torque now: ' + fmt(Tnow, 2) + ' N·m', 460, 70);
          c.fillText('speed: ' + fmt(Math.abs(rpmOf(w)), 0) + ' rpm', 460, 94);
          c.font = '12px ' + font(); c.fillStyle = C.muted;
          const msg = V.Ic === 0 || V.B === 0 ? 'no current or no field: no torque' : w === 0 && Math.abs(Tnow) <= fc ? (V.comm ? 'stuck in a dead spot: push it' : 'at rest facing the poles: torque zero') : V.comm ? 'the commutator keeps the torque one way' : 'without a commutator the torque reverses';
          c.fillText(msg, 460, 120);
          c.fillText('arrows: force on each coil side', 460, 146);
          c.fillText('50 turns, sides 0.1 m long, 0.1 m apart', 460, 166);
          let sum = 0; for (let i = 0; i < 360; i++) sum += totalT(i * Math.PI / 180); const Tavg = sum / 360;
          ro.set('F', fmt(Math.abs(N * V.B * V.Ic * Lc), 2) + ' N on each coil side');
          ro.set('T', fmt(Tnow, 2) + ' N·m'); ro.set('Ta', fmt(Tavg, 2) + ' N·m'); ro.set('n', fmt(Math.abs(rpmOf(w)), 0) + ' rpm');
          if (lastPlot < 0 || (lastPlot++ % 6 === 0)) {
            const pts = []; for (let i = 0; i <= 360; i += 2) pts.push([i, totalT(i * Math.PI / 180)]);
            pl.set({ x: { label: 'rotor angle (°)', min: 0, max: 360 }, y: { label: 'torque (N·m)' }, series: [{ pts, label: 'torque against angle' }], marks: [{ x: th * 180 / Math.PI, y: Tnow, label: 'now' }], hlines: [{ y: Tavg, label: 'average' }] });
            if (lastPlot < 0) lastPlot = 1;
          }
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mb-torque-power */
  Hyper.sim('mb-torque-power', {
    title: 'The same power at different speeds',
    blurb: `A motor drives a load through a gearbox. The motor, the shafts and the gearbox are drawn to scale with the torque they carry — a motor's size grows with its torque, a shaft's diameter with the cube root of its torque — and they turn at their real speeds slowed down 40 times. The graph is torque against speed on logarithmic axes, where every constant power is a straight line.

**Try this**
- Keep 7.5 kW and change the motor from 2-pole to 8-pole: the speed quarters, the torque quadruples and the motor swells.
- Choose the 12,000 rpm high-speed motor with a ratio of 50: a small motor gives the same output torque as a big slow one.
- Raise the ratio: the output point slides down the power line — lower speed, higher torque — and drops slightly below it by the gearbox loss.
- Lower the gearbox efficiency to 60 % (a high-ratio worm gear): 40 % of the power leaves as heat.
- Compare the power in kW, hp and PS in the readout.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const [g1] = graphs(box, 1);
      const pl = kit.plot(g1, { x: { label: 'speed (rpm)', min: 1, max: 20000, log: true }, y: { label: 'torque (N·m)', min: 0.01, max: 1e5, log: true }, legend: true }, 220);
      let V = null, a1 = 0, a2 = 0, dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Motor output power', min: 0.1, max: 200, value: 7.5, unit: 'kW', log: true, sig: 2 },
        { id: 'n', type: 'select', label: 'Motor', options: [['2-pole, 2900 rpm', 2900], ['4-pole, 1455 rpm', 1455], ['6-pole, 970 rpm', 970], ['8-pole, 720 rpm', 720], ['High-speed PM motor, 12,000 rpm', 12000]], value: 1455 },
        { id: 'i', label: 'Gear ratio', min: 1, max: 100, value: 20, log: true, sig: 3 },
        { id: 'eta', label: 'Gearbox efficiency', min: 50, max: 99, step: 1, value: 95, unit: '%' }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Power'], ['m', 'Motor torque'], ['o', 'Output speed'], ['ot', 'Output torque'], ['loss', 'Gearbox loss (heat)'], ['d', 'Shaft diameters (relative)']]);
      const loop = kit.loop(dt => {
        const C = kit.colors(), P = V.P * 1000, n1 = V.n, T1 = P / radOf(n1), n2 = n1 / V.i, T2 = T1 * V.i * V.eta / 100, P2 = P * V.eta / 100;
        a1 += radOf(n1) * dt / 40; a2 += radOf(n2) * dt / 40;
        const c = st.begin(); c.save(); fit(c, st, 680, 260); c.font = '12px ' + font(); c.textAlign = 'center';
        const sz = T => clamp(Math.cbrt(T / 49.2), 0.25, 3.2);     // 1 for the 49 N·m of a 7.5 kW 4-pole motor
        // motor body scaled with torque^(1/3) (its linear size), shaft with torque^(1/3)
        const mS = sz(T1), mh = 34 + 36 * mS, mw = 60 + 50 * mS, mx = 20, my = 130 - mh / 2;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(mx, my, mw, mh); c.strokeRect(mx, my, mw, mh);
        c.strokeStyle = C.faint; c.lineWidth = 1; for (let x = mx + 8; x < mx + mw - 4; x += 7) { c.beginPath(); c.moveTo(x, my + 3); c.lineTo(x, my + mh - 3); c.stroke(); }
        c.fillStyle = C.text; c.fillText('motor', mx + mw / 2, my - 8);
        const d1 = 4 + 7 * sz(T1), d2 = 4 + 7 * sz(T2), gx = mx + mw + 60, gw = 70, gh = Math.max(mh, 40 + 30 * sz(T2));
        c.fillStyle = C.muted; c.fillRect(mx + mw, 130 - d1 / 2, gx - mx - mw, d1);
        // rotating marks on the shafts
        const mark = (x, d, a) => { c.strokeStyle = C.accent; c.lineWidth = 2; const y = 130 + Math.sin(a) * d / 2; c.beginPath(); c.moveTo(x - 6, y); c.lineTo(x + 6, y); c.stroke(); };
        mark(mx + mw + 30, d1, a1);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(gx, 130 - gh / 2, gw, gh); c.strokeRect(gx, 130 - gh / 2, gw, gh);
        c.fillStyle = C.text; c.fillText('gearbox ' + fmt(V.i, V.i < 10 ? 1 : 0) + ':1', gx + gw / 2, 130 - gh / 2 - 8);
        c.fillStyle = C.muted; c.fillText('η ' + V.eta + ' %', gx + gw / 2, 134);
        const ox = gx + gw, dr = 26 + 20 * clamp(Math.cbrt(T2 / 1000), 0.3, 2.2);
        c.fillStyle = C.muted; c.fillRect(ox, 130 - d2 / 2, 80, d2); mark(ox + 30, d2, a2);
        c.save(); c.translate(ox + 80 + dr, 130); c.rotate(a2); c.fillStyle = C.surface2; c.strokeStyle = C.text; c.beginPath(); c.arc(0, 0, dr, 0, TAU); c.fill(); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(dr - 4, 0); c.stroke(); c.restore();
        c.fillStyle = C.text; c.fillText('load', ox + 80 + dr, 130 + dr + 16);
        // torque arrows (curved), size on a log scale
        const tArrow = (x, T, col) => { const r = 10 + 5 * clamp(Math.log10(Math.max(T, 0.01)) + 2, 0, 7); c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath(); c.arc(x, 130, r, -2.4, -0.7); c.stroke(); kit.arrow(c, x + r * Math.cos(-0.9), 130 + r * Math.sin(-0.9), x + r * Math.cos(-0.7), 130 + r * Math.sin(-0.7), col, 2.5); return r; };
        const r1 = tArrow(mx + mw + 30, T1, C.warn), r2 = tArrow(ox + 30, T2, C.warn);
        c.fillStyle = C.text; c.fillText(fmt(T1, T1 < 10 ? 2 : 1) + ' N·m', mx + mw + 30, 130 - r1 - 8); c.fillText(fmt(n1, 0) + ' rpm', mx + mw + 30, 130 + 34);
        c.fillText(fmt(T2, T2 < 10 ? 2 : 0) + ' N·m', ox + 30, 130 - r2 - 8); c.fillText(fmt(n2, n2 < 10 ? 1 : 0) + ' rpm', ox + 30, 130 + 38);
        c.fillStyle = C.muted; c.textAlign = 'left'; c.fillText('sizes: motor ∝ torque^1/3, shafts ∝ torque^1/3; rotation drawn 40 × slower', 20, 250);
        if (P - P2 > 0) { c.fillStyle = C.bad; c.textAlign = 'center'; c.fillText('heat ' + fmt((P - P2) / 1000, 2) + ' kW', gx + gw / 2, 130 + gh / 2 + 16); }
        c.restore();
        ro.set('p', fmt(V.P, 2) + ' kW = ' + fmt(P / kit.motor.HP, 2) + ' hp = ' + fmt(P / kit.motor.PS, 2) + ' PS');
        ro.set('m', fmt(T1, 2) + ' N·m = ' + fmt(T1 / 1.3558, 2) + ' lbf·ft at ' + fmt(n1, 0) + ' rpm');
        ro.set('o', fmt(n2, 1) + ' rpm'); ro.set('ot', fmt(T2, 1) + ' N·m = ' + fmt(T2 / 1.3558, 1) + ' lbf·ft');
        ro.set('loss', fmt(P - P2, 0) + ' W'); ro.set('d', 'output shaft ' + fmt(Math.cbrt(T2 / T1), 2) + ' × the motor shaft');
        if (dirty) {
          dirty = false;
          const lines = [0.1, 1, 10, 100].map((kw, k) => ({ pts: [[1, kw * 1000 / radOf(1)], [20000, kw * 1000 / radOf(20000)]], label: k === 0 ? 'constant power 0.1, 1, 10, 100 kW' : undefined, color: C.faint, dash: [4, 4] }));
          pl.set({ series: lines.concat([{ pts: [[1, P / radOf(1)], [20000, P / radOf(20000)]], label: fmt(V.P, 2) + ' kW', color: C.accent }]),
            marks: [{ x: n1, y: T1, label: 'motor' }, { x: n2, y: T2, label: 'output', color: C.warn }] });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mb-back-emf */
  const DCM = {
    m24: { name: '24 V, 100 W brushed PM motor', V: 24, R: 0.5, L: 1.5e-3, K: 0.055, I0: 0.25, Jm: 6e-5, Tr: 0.25 },
    m48: { name: '48 V, 400 W brushed PM motor', V: 48, R: 0.12, L: 0.6e-3, K: 0.11, I0: 0.4, Jm: 4e-4, Tr: 1.0 }
  };
  Hyper.sim('mb-back-emf', {
    title: 'Back-EMF: switching on a DC motor',
    blurb: `A permanent-magnet DC motor with a flywheel. The bar on the left splits the terminal voltage into the part used by the back-EMF $E = K\\omega$ and the part that drives the current through the winding resistance, $IR$. The graphs trace the current and the three voltages against time.

**Try this**
- Press *Start from rest*: at first $E = 0$ and the whole voltage drives current — a spike of $V/R$ (48 A for the 24 V motor). As the speed builds, $E$ takes over and the current falls to what the load needs.
- Make the flywheel heavier: the start lasts longer (the mechanical time constant $JR/K^2$ grows) and the spike lasts longer too. Tick *current limit* to see how a driver tames it.
- Set the load to a negative value (the load drives the shaft, like a descending hoist): the speed rises above no-load, $E$ exceeds $V$ and the current reverses — the motor is now a generator feeding the supply.
- Choose *Open circuit*: the current stops, the motor coasts, and its terminals show the back-EMF alone. Choose *Terminals shorted*: the back-EMF drives a large reverse current and brakes the flywheel hard.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const [g1, g2] = graphs(box, 2);
      const p1 = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'current (A)' }, legend: true }, 180);
      const p2 = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'volts' }, legend: true }, 180);
      let m = DCM.m24, V = null, i = 0, w = 0, t = 0, ang = 0, trace = [], lastPlot = -1;
      const ctl = kit.controls(box.side, [
        { id: 'motor', type: 'select', label: 'Motor', options: Object.entries(DCM).map(([k, p]) => [p.name, k]), value: 'm24' },
        { id: 'Vp', label: 'Supply voltage, % of rated', min: 0, max: 125, step: 1, value: 100, unit: '%' },
        { id: 'TL', label: 'Load torque, % of rated (negative: the load drives the shaft)', min: -150, max: 200, step: 5, value: 100, unit: '%' },
        { id: 'J', label: 'Flywheel inertia', min: 1e-4, max: 0.02, value: 0.002, unit: 'kg·m²', log: true, sig: 2 },
        { id: 'conn', type: 'select', label: 'Terminals', options: [['Connected to the supply', 'on'], ['Open circuit (switched off)', 'open'], ['Shorted (dynamic braking)', 'short']], value: 'on' },
        { id: 'lim', type: 'check', label: 'Driver current limit at 3 × rated current', value: false },
        { type: 'buttons', items: [{ id: 'start', label: 'Start from rest', primary: true }] }
      ], id => {
        if (id === 'motor') { m = DCM[V.motor]; i = 0; w = 0; trace = []; t = 0; }
        if (id === 'start') { i = 0; w = 0; trace = []; t = 0; ctl.set('conn', 'on'); }
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed'], ['I', 'Current'], ['E', 'Back-EMF E = Kω'], ['bal', 'V = E + IR'], ['P', 'Electrical in · mechanical out · heat'], ['st', 'The machine is']]);
      const Irated = () => m.Tr / m.K + m.I0;
      const loop = kit.loop(dt => {
        t += dt;
        const Vs = m.V * V.Vp / 100, TL = V.TL / 100 * m.Tr, J = m.Jm + V.J, sub = 200, h = dt / sub, tauE = m.L / m.R, ex = Math.exp(-h / tauE);
        let Vt = Vs;
        for (let k = 0; k < sub; k++) {
          const E = m.K * w;
          if (V.conn === 'open') { i = 0; Vt = E; }
          else {
            Vt = V.conn === 'short' ? 0 : Vs;
            if (V.conn === 'on' && V.lim) { const Il = 3 * Irated(); Vt = clamp(Vt, E - Il * m.R, E + Il * m.R); }
            const iss = (Vt - E) / m.R; i = iss + (i - iss) * ex;      // exact for a fixed speed over the sub-step
          }
          const Tf = m.K * m.I0, Tm = m.K * i;
          const drive = Tm - TL;
          if (Math.abs(w) < 1e-3 && Math.abs(drive) <= Tf) w = 0;
          else w += h * (drive - Tf * Math.sign(w || drive) - 1e-5 * w) / J;
        }
        const E = m.K * w, n = rpmOf(w), Tm = m.K * i, Pin = Vt * i, Pout = (Tm - m.K * m.I0 * Math.sign(w)) * w, Pcu = i * i * m.R;
        trace.push([t, i, Vt, E, i * m.R]); while (trace.length && trace[0][0] < t - 4) trace.shift();
        ro.set('n', fmt(n, 0) + ' rpm (no-load ≈ ' + fmt(rpmOf(Vs / m.K), 0) + ')');
        ro.set('I', fmt(i, 2) + ' A (rated ' + fmt(Irated(), 1) + ' A)');
        ro.set('E', fmt(E, 2) + ' V');
        ro.set('bal', V.conn === 'open' ? 'open: terminals show E = ' + fmt(E, 1) + ' V' : fmt(Vt, 1) + ' = ' + fmt(E, 1) + ' + ' + fmt(i * m.R, 1) + ' V');
        ro.set('P', fmt(Pin, 0) + ' W · ' + fmt(Pout, 0) + ' W · ' + fmt(Pcu, 0) + ' W');
        const state = V.conn === 'open' ? 'coasting (no current)' : i < -0.05 ? 'a generator: current flows back (E > V)' : i > 0.05 && w > 0.5 ? 'a motor (V > E)' : i > 0.05 ? 'stalled: all the voltage drives current' : 'idle';
        ro.set('st', state);
        if (t - lastPlot > 0.1 || lastPlot < 0) {
          lastPlot = t;
          const t0 = Math.max(0, t - 4);
          p1.set({ x: { label: 'time (s)', min: t0, max: t0 + 4 }, series: [{ pts: trace.map(p => [p[0], p[1]]), label: 'current' }], hlines: [{ y: Irated(), label: 'rated' }, { y: 0 }] });
          p2.set({ x: { label: 'time (s)', min: t0, max: t0 + 4 }, series: [{ pts: trace.map(p => [p[0], p[2]]), label: 'terminal V' }, { pts: trace.map(p => [p[0], p[3]]), label: 'back-EMF E' }, { pts: trace.map(p => [p[0], p[4]]), label: 'I·R' }] });
        }
        // drawing
        const c = st.begin(), C = kit.colors(); c.save(); fit(c, st, 640, 250); c.font = '12px ' + font(); c.textAlign = 'center';
        // the voltage bar: 0..Vmax
        const Vmax = m.V * 1.6, bx = 40, by = 30, bh = 190, yv = v => by + bh - bh * clamp(v, -0.2 * Vmax, Vmax) / Vmax;
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(bx, by, 40, bh);
        const y0 = yv(0);
        if (V.conn !== 'open') {
          c.fillStyle = C.accent; c.fillRect(bx + 2, Math.min(y0, yv(E)), 17, Math.abs(yv(E) - y0));
          c.fillStyle = C.warn; c.fillRect(bx + 21, Math.min(yv(E), yv(E + i * m.R)), 17, Math.abs(yv(E + i * m.R) - yv(E)));
          c.strokeStyle = C.bad; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(bx - 8, yv(Vt)); c.lineTo(bx + 48, yv(Vt)); c.stroke(); c.setLineDash([]);
          c.fillStyle = C.bad; c.textAlign = 'right'; c.fillText('V ' + fmt(Vt, 1), bx - 10, yv(Vt) + 4);
        } else { c.fillStyle = C.accent; c.fillRect(bx + 2, Math.min(y0, yv(E)), 36, Math.abs(yv(E) - y0)); }
        c.textAlign = 'left'; c.fillStyle = C.accent; c.fillText('E', bx + 46, (y0 + yv(E)) / 2 + 4);
        if (V.conn !== 'open') { c.fillStyle = C.warn; c.fillText('IR', bx + 46, (yv(E) + yv(E + i * m.R)) / 2 + 4); }
        c.fillStyle = C.muted; c.textAlign = 'center'; c.fillText('volts', bx + 20, by + bh + 16);
        // motor and flywheel
        ang += w * dt / 30;
        const mx = 290, my = 120;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(mx - 70, my - 50, 140, 100); c.strokeRect(mx - 70, my - 50, 140, 100);
        c.fillStyle = 'hsl(0 70% 50% / .5)'; c.fillRect(mx - 68, my - 48, 136, 14); c.fillStyle = 'hsl(215 70% 50% / .5)'; c.fillRect(mx - 68, my + 34, 136, 14);
        c.save(); c.translate(mx, my); c.rotate(ang); c.strokeStyle = C.accent; c.lineWidth = 3; for (let k = 0; k < 3; k++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(-26, 0); c.lineTo(26, 0); c.stroke(); } c.restore();
        c.fillStyle = C.text; c.fillRect(mx + 70, my - 4, 80, 8);
        const fr = 22 + 26 * clamp(Math.log10(V.J / 1e-4) / 2.3, 0, 1);
        c.save(); c.translate(mx + 150 + fr, my); c.rotate(ang); c.fillStyle = C.muted; c.beginPath(); c.arc(0, 0, fr, 0, TAU); c.fill(); c.strokeStyle = C.bg2; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -fr + 4); c.stroke(); c.restore();
        c.fillStyle = C.muted; c.fillText('flywheel and load', mx + 150 + fr, my + fr + 16); c.fillText('armature drawn 30 × slower', mx, my + 70);
        // wires with current direction
        const wireY = 32; c.strokeStyle = V.conn === 'open' ? C.faint : i < 0 ? C.ok : C.warn; c.lineWidth = 2 + clamp(Math.abs(i) / Irated(), 0, 4);
        c.beginPath(); c.moveTo(bx + 40, wireY + 10); c.lineTo(mx - 30, wireY + 10); c.lineTo(mx - 30, my - 50); c.stroke();
        if (Math.abs(i) > 0.05 && V.conn !== 'open') kit.arrow(c, i > 0 ? 140 : 200, wireY + 10, i > 0 ? 200 : 140, wireY + 10, i > 0 ? C.warn : C.ok, 2.5);
        c.fillStyle = C.text; c.fillText(V.conn === 'open' ? 'switch open' : fmt(Math.abs(i), 1) + ' A ' + (i < -0.05 ? 'back to the supply' : 'into the motor'), 170, wireY + 2);
        c.textAlign = 'left'; c.fillStyle = C.text; c.font = '13px ' + font();
        c.fillText(fmt(n, 0) + ' rpm', 470, 40);
        c.fillStyle = i < -0.05 ? C.ok : C.muted; c.font = '12px ' + font(); c.fillText(state, 470, 60);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mb-magnetic-circuit */
  // a model of non-oriented electrical steel: B = μ0 H + Js (2/π) atan(π μi μ0 H / 2Js) — knee about 1.4–1.6 T
  const MU0 = 4e-7 * Math.PI, JS = 1.75, MUI = 3000;
  const steelB = H => MU0 * H + JS * (2 / Math.PI) * Math.atan(Math.PI * MUI * MU0 * H / (2 * JS));
  const steelH = B => { if (B <= 0) return 0; let lo = 0, hi = 1e7; for (let k = 0; k < 60; k++) { const md = (lo + hi) / 2; if (steelB(md) < B) lo = md; else hi = md; } return (lo + hi) / 2; };
  Hyper.sim('mb-magnetic-circuit', {
    title: 'A magnetic circuit: gap, steel and saturation',
    blurb: `A C-shaped steel core, 0.3 m round and 4 cm² in section, with a coil and an adjustable air gap. The coil's ampere-turns are shared between the gap and the steel, $NI = H_{\\mathrm{Fe}}\\,l + B\\,g/\\mu_0$; the steel follows a B–H curve with a knee near 1.5 T.

In **DC** mode you set the coil current and read the flux density. In **AC** mode the supply voltage and frequency set the flux, $\\hat B = V/(4.44\\,f\\,N A)$, and the current is whatever the core needs — watch its shape.

**Try this**
- DC: close the gap to zero, then open it to 0.5 mm: the same current now gives far less flux — half a millimetre of air outweighs 300 mm of steel.
- DC, no gap: raise the current. The operating point climbs the B–H curve and bends over: doubling the current above 1.6 T hardly changes B.
- AC: at 100 % voltage and 50 Hz the current is nearly sinusoidal. Raise the voltage to 120 % or lower the frequency to 35 Hz: the peak flux reaches the knee and the current becomes tall narrow spikes — the magnetising current of an over-fluxed motor.
- AC: tick *Keep V/f constant* and lower the frequency: the flux stays put and the current keeps its shape — what a VFD does.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const [g1, g2] = graphs(box, 2);
      const p1 = kit.plot(g1, { x: { label: 'H in the steel (A/m)', min: 0, max: 6000 }, y: { label: 'B (T)', min: 0, max: 2 }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'ampere-turns NI' }, y: { label: 'B (T)', min: 0, max: 2 }, legend: true }, 190);
      const lFe = 0.3, A = 4e-4;
      let V = null, dirty = true, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Supply', options: [['DC: set the coil current', 'dc'], ['AC: voltage and frequency set the flux', 'ac']], value: 'dc' },
        { id: 'N', type: 'select', label: 'Turns on the coil', options: [['100', 100], ['200', 200], ['500', 500]], value: 200 },
        { id: 'g', label: 'Air gap', min: 0, max: 3, step: 0.05, value: 0.5, unit: 'mm' },
        { id: 'I', label: 'Coil current (DC)', min: 0, max: 20, step: 0.1, value: 2, unit: 'A' },
        { id: 'Vp', label: 'AC voltage, % of rated (25 V at 50 Hz)', min: 20, max: 140, step: 1, value: 100, unit: '%' },
        { id: 'f', label: 'AC frequency', min: 10, max: 60, step: 1, value: 50, unit: 'Hz' },
        { id: 'vf', type: 'check', label: 'Keep V/f constant (as a VFD does)', value: false }
      ], id => { if (id === 'mode') show(); dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['B', 'Flux density in the core'], ['phi', 'Flux Φ = B A'], ['gap', 'Ampere-turns: gap'], ['fe', 'Ampere-turns: steel'], ['mu', 'Steel permeability μr'], ['ac', 'Magnetising current']]);
      function show() { const ac = V.mode === 'ac'; ctl.show('I', !ac); ctl.show('Vp', ac); ctl.show('f', ac); ctl.show('vf', ac); ro.show('ac', ac); }
      show();
      const NIof = (B, g) => steelH(B) * lFe + B * g / MU0;
      const solveB = (NI, g) => { let lo = 0, hi = 2.5; if (NIof(hi, g) < NI) return hi; for (let k = 0; k < 50; k++) { const md = (lo + hi) / 2; if (NIof(md, g) < NI) lo = md; else hi = md; } return (lo + hi) / 2; };
      let cur = { B: 0, H: 0, wave: [], Bpk: 0, Ipk: 0, Irms: 0 };
      function compute() {
        const g = V.g / 1000;
        if (V.mode === 'dc') {
          const B = solveB(V.N * V.I, g); cur = { B, H: steelH(B), wave: [] };
        } else {
          const f = V.f, Vr = 25 * V.Vp / 100 * (V.vf ? f / 50 : 1), Bpk = Math.min(2.3, Vr / (4.44 * f * V.N * A));
          const wave = []; let s2 = 0, ipk = 0;
          for (let k = 0; k <= 120; k++) { const ph = TAU * k / 120, B = Bpk * Math.sin(ph), iA = Math.sign(B) * NIof(Math.abs(B), g) / V.N; wave.push([1000 * k / 120 / f, iA]); if (k < 120) s2 += iA * iA; ipk = Math.max(ipk, Math.abs(iA)); }
          cur = { B: Bpk, H: steelH(Bpk), wave, Bpk, Ipk: ipk, Irms: Math.sqrt(s2 / 120), Vr };
        }
      }
      const loop = kit.loop(dt => {
        t += dt;
        if (dirty) {
          dirty = false; compute();
          const C = kit.colors(), g = V.g / 1000;
          const bh = []; for (let k = 0; k <= 120; k++) { const H = 6000 * k / 120; bh.push([H, steelB(H)]); }
          p1.set({ series: [{ pts: bh, label: 'steel B–H (model)' }], marks: [{ x: Math.min(cur.H, 6000), y: cur.B, label: V.mode === 'dc' ? 'operating point' : 'peak of the cycle' }], hlines: [{ y: 1.5, label: 'knee' }] });
          if (V.mode === 'dc') {
            const NImax = Math.max(4000, V.N * V.I * 1.3), withGap = [], noGap = [];
            for (let k = 0; k <= 100; k++) { const NI = NImax * k / 100; withGap.push([NI, solveB(NI, g)]); noGap.push([NI, solveB(NI, 0)]); }
            p2.set({ x: { label: 'ampere-turns NI', min: 0, max: NImax }, y: { label: 'B (T)', min: 0, max: 2 }, series: [{ pts: noGap, label: 'no gap', color: C.muted, dash: [5, 4] }, { pts: withGap, label: 'with a ' + fmt(V.g, 2) + ' mm gap' }], marks: [{ x: V.N * V.I, y: cur.B, label: 'now' }] });
          } else {
            const T = 1000 / V.f, sine = cur.wave.map(p => [p[0], cur.Irms * Math.SQRT2 * Math.sin(TAU * p[0] / T)]);
            p2.set({ x: { label: 'time (ms), one cycle', min: 0, max: T }, y: { label: 'magnetising current (A)', min: undefined, max: undefined }, series: [{ pts: cur.wave, label: 'current' }, { pts: sine, label: 'a sine of the same RMS', color: C.muted, dash: [5, 4] }], marks: [] });
          }
        }
        const g = V.g / 1000, NIgap = cur.B * g / MU0, NIfe = cur.H * lFe;
        ro.set('B', fmt(cur.B, 3) + ' T' + (V.mode === 'ac' ? ' (peak)' : '') + (cur.B > 1.6 ? ' — saturated' : ''));
        ro.set('phi', fmt(cur.B * A * 1e3, 3) + ' mWb');
        ro.set('gap', fmt(NIgap, 0) + ' A'); ro.set('fe', fmt(NIfe, 0) + ' A');
        ro.set('mu', cur.H > 0 ? fmt(cur.B / (MU0 * cur.H), 0) : '—');
        if (V.mode === 'ac') ro.set('ac', 'peak ' + fmt(cur.Ipk, 2) + ' A, RMS ' + fmt(cur.Irms, 2) + ' A (peak/RMS ' + fmt(cur.Irms > 0 ? cur.Ipk / cur.Irms : 0, 2) + '; a sine is 1.41) at ' + fmt(cur.Vr, 1) + ' V');
        // drawing: the core
        const c = st.begin(), C = kit.colors(); c.save(); fit(c, st, 640, 270); c.font = '12px ' + font(); c.textAlign = 'center';
        const x0 = 120, y0 = 35, w0 = 300, h0 = 200, th = 44, gpx = Math.min(60, V.g * 18);
        const Bnow = V.mode === 'ac' ? cur.B * Math.sin(TAU * V.f * t / 25) : cur.B;   // AC shown 25 × slower
        c.fillStyle = C.muted;
        c.fillRect(x0, y0, w0, th); c.fillRect(x0, y0 + h0 - th, w0, th); c.fillRect(x0, y0, th, h0);
        const gy = y0 + h0 / 2;
        c.fillRect(x0 + w0 - th, y0, th, h0 / 2 - gpx / 2); c.fillRect(x0 + w0 - th, gy + gpx / 2, th, h0 / 2 - gpx / 2);
        // coil on the left leg
        c.strokeStyle = C.warn; c.lineWidth = 3;
        for (let k = 0; k < 9; k++) { const y = y0 + 45 + k * 13; c.beginPath(); c.moveTo(x0 - 8, y); c.lineTo(x0 + th + 8, y + 5); c.stroke(); }
        c.fillStyle = C.text; c.fillText(V.N + ' turns', x0 - 40, gy); c.fillText(V.mode === 'dc' ? fmt(V.I, 1) + ' A DC' : fmt(cur.Vr || 0, 1) + ' V, ' + V.f + ' Hz', x0 - 40, gy + 16);
        // flux lines round the core, their number ∝ |B|
        const nl = Math.round(clamp(Math.abs(Bnow) / 0.2, 0, 10)), dir = Bnow >= 0 ? 1 : -1;
        c.strokeStyle = 'hsl(265 70% 60% / .8)'; c.lineWidth = 1.5; c.setLineDash([8, 6]); c.lineDashOffset = -dir * t * 30;
        for (let k = 0; k < nl; k++) {
          const inset = 6 + k * (th - 12) / Math.max(1, nl - 1 || 1);
          const bulge = gpx > 2 ? 4 + gpx * 0.5 * (1 - k / Math.max(1, nl)) : 0;
          c.beginPath();
          c.moveTo(x0 + inset, y0 + h0 - inset); c.lineTo(x0 + inset, y0 + inset); c.lineTo(x0 + w0 - inset, y0 + inset);
          c.lineTo(x0 + w0 - inset, gy - gpx / 2);
          if (gpx > 2) c.quadraticCurveTo(x0 + w0 - inset + bulge, gy, x0 + w0 - inset, gy + gpx / 2);
          c.lineTo(x0 + w0 - inset, y0 + h0 - inset); c.closePath(); c.stroke();
        }
        c.setLineDash([]); c.lineDashOffset = 0;
        c.fillStyle = C.text; c.textAlign = 'left';
        c.fillText('gap ' + fmt(V.g, 2) + ' mm (drawn 18 × wider)', x0 + w0 + 10, gy + 4);
        const tx = 460; c.font = '13px ' + font();
        c.fillText('B = ' + fmt(Math.abs(V.mode === 'ac' ? cur.B : cur.B), 2) + ' T' + (V.mode === 'ac' ? ' peak' : ''), tx, 60);
        c.font = '12px ' + font(); c.fillStyle = C.muted;
        const tot = Math.max(1e-9, NIgap + NIfe);
        c.fillText('ampere-turns used by', tx, 88);
        c.fillStyle = C.accent; c.fillRect(tx, 96, 150 * NIgap / tot, 12); c.fillStyle = C.warn; c.fillRect(tx + 150 * NIgap / tot, 96, 150 * NIfe / tot, 12);
        c.fillStyle = C.muted; c.fillText('gap ' + fmt(100 * NIgap / tot, 0) + ' %   steel ' + fmt(100 * NIfe / tot, 0) + ' %', tx, 124);
        if (cur.B > 1.6) { c.fillStyle = C.bad; c.fillText('the steel is saturating', tx, 150); }
        if (V.mode === 'ac') { c.fillStyle = C.muted; c.fillText('flux drawn 25 × slower', tx, 176); }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mb-four-quadrant */
  Hyper.sim('mb-four-quadrant', {
    title: 'Four quadrants: a DC hoist motoring and generating',
    blurb: `A 48 V permanent-magnet DC motor lifts and lowers a load through a 20:1 gearbox and a 0.2 m drum. You set the armature voltage; the load pulls down with a constant torque. The chart on the right is torque (across) against speed (up): the motor's straight line meets the load where the hoist runs. The arrows show which way power flows — from the supply to the load when motoring, from the falling load back to the supply when generating.

**Try this**
- Start at 40 V with 20 kg: quadrant I, lifting — electrical power in, mechanical power out, a little heat.
- Lower the voltage slowly. Below the resistive drop $IR$ (about 1 V here) the load wins and sinks while the motor still pulls up: quadrant IV. Between 0 V and $IR$ the supply and the falling load *both* feed the winding — pure braking heat.
- Make the voltage negative: the load comes down fast and the supply *receives* power (the battery charges) — regeneration.
- Choose *Drive without braking*: regenerate again and watch the DC-bus voltage climb until the drive trips. The holding brake drops and the load stops — without it, the load would fall.
- Choose the conveyor (friction) load and reverse the voltage: quadrants I and III — driving forwards and backwards.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 250 });
      const [g1] = graphs(box, 1);
      const pl = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'power (W), + from the supply' }, legend: true }, 180);
      const R = 0.12, K = 0.11, ratio = 20, rd = 0.1, Jm = 4e-4, g = 9.81, Vbus0 = 60, Cbus = 0.2;
      let V = null, w = 0, i = 0, y = 1, t = 0, trace = [], Eret = 0, Eres = 0, Vbus = Vbus0, tripped = false, lastPlot = -1;
      const ctl = kit.controls(box.side, [
        { id: 'Va', label: 'Armature voltage', min: -48, max: 48, step: 0.5, value: 40, unit: 'V' },
        { id: 'load', type: 'select', label: 'Load', options: [['Hoist: a hanging mass', 'hoist'], ['Conveyor: friction opposes motion', 'fric']], value: 'hoist' },
        { id: 'm', label: 'Mass on the hook (hoist) or friction load (conveyor, as kg on the drum)', min: 0, max: 40, step: 1, value: 20, unit: 'kg' },
        { id: 'sup', type: 'select', label: 'Supply', options: [['Battery: accepts power back', 'batt'], ['Drive with a braking resistor', 'res'], ['Drive without braking (diode rectifier)', 'none']], value: 'batt' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset trip and counters', primary: true }] }
      ], id => { if (id === 'reset' || id === 'sup') { tripped = false; Vbus = Vbus0; Eret = 0; Eres = 0; } lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['q', 'Quadrant'], ['n', 'Motor speed · hook speed'], ['I', 'Current · torque'], ['P', 'Electrical · mechanical · heat'], ['E', 'Energy returned · burnt in resistor'], ['bus', 'Supply / DC bus']]);
      const loadT = ww => { const Tg = V.m * g * rd / ratio; return V.load === 'hoist' ? Tg : (Math.abs(ww) < 1e-3 ? 0 : Tg * Math.sign(ww)); };
      const loop = kit.loop(dt => {
        t += dt;
        const J = Jm + V.m * rd * rd / (ratio * ratio) + 2e-4, sub = 60, h = dt / sub;
        for (let k = 0; k < sub; k++) {
          if (tripped) { i = 0; w = 0; break; }
          i = (V.Va - K * w) / R;
          const Tm = K * i;
          let TL = loadT(w);
          if (V.load === 'fric' && Math.abs(w) < 1e-3) { TL = Math.abs(Tm) <= V.m * g * rd / ratio ? Tm : Math.sign(Tm) * V.m * g * rd / ratio; }
          w += h * (Tm - TL - 2e-4 * w) / J;
          const Pe = V.Va * i;
          if (Pe < 0) {
            if (V.sup === 'batt') Eret += -Pe * h;
            else if (V.sup === 'res') Eres += -Pe * h;
            else { Vbus = Math.sqrt(Math.max(Vbus0 * Vbus0, Vbus * Vbus + 2 * (-Pe) * h / Cbus)); if (Vbus > 1.3 * Vbus0) { tripped = true; i = 0; w = 0; } }
          } else if (V.sup === 'none' && Vbus > Vbus0) Vbus = Math.max(Vbus0, Vbus - 20 * h);
        }
        const Tm = K * i, n = rpmOf(w), vHook = w * rd / ratio;
        y += vHook * dt; if (y > 5 || y < -3) y = 1;
        const Pe = V.Va * i, Pm = Tm * w, Pcu = i * i * R;
        trace.push([t, Pe, Pm, Pcu]); while (trace.length && trace[0][0] < t - 6) trace.shift();
        const q = tripped ? '—' : Math.abs(w) < 0.5 ? 'standstill' : (Tm >= 0 ? (w > 0 ? 'I: forward motoring (lifting)' : 'IV: reverse braking (lowering, generating)') : (w > 0 ? 'II: forward braking (generating)' : 'III: reverse motoring'));
        ro.set('q', q);
        ro.set('n', fmt(n, 0) + ' rpm · ' + fmt(vHook, 2) + ' m/s ' + (vHook > 0.001 ? 'up' : vHook < -0.001 ? 'down' : ''));
        ro.set('I', fmt(i, 1) + ' A · ' + fmt(Tm, 2) + ' N·m');
        ro.set('P', fmt(Pe, 0) + ' · ' + fmt(Pm, 0) + ' · ' + fmt(Pcu, 0) + ' W');
        ro.set('E', fmt(Eret / 1000, 2) + ' kJ · ' + fmt(Eres / 1000, 2) + ' kJ');
        ro.set('bus', V.sup === 'none' ? (tripped ? 'TRIPPED on overvoltage — brake applied' : 'DC bus ' + fmt(Vbus, 1) + ' V (trip at ' + fmt(1.3 * Vbus0, 0) + ' V)') : V.sup === 'batt' ? 'battery: ' + (Pe < 0 ? 'charging' : 'discharging') : 'resistor ' + (Pe < 0 ? 'taking ' + fmt(-Pe, 0) + ' W' : 'idle'));
        if (t - lastPlot > 0.15 || lastPlot < 0) {
          lastPlot = t;
          const t0 = Math.max(0, t - 6);
          pl.set({ x: { label: 'time (s)', min: t0, max: t0 + 6 }, series: [{ pts: trace.map(p => [p[0], p[1]]), label: 'electrical V·I' }, { pts: trace.map(p => [p[0], p[2]]), label: 'mechanical T·ω' }, { pts: trace.map(p => [p[0], p[3]]), label: 'heat I²R' }], hlines: [{ y: 0 }] });
        }
        // drawing
        const c = st.begin(), C = kit.colors(); c.save(); fit(c, st, 680, 300); c.font = '12px ' + font(); c.textAlign = 'center';
        // supply
        c.strokeStyle = C.text; c.lineWidth = 2; c.fillStyle = C.surface2; c.fillRect(20, 100, 90, 80); c.strokeRect(20, 100, 90, 80);
        c.fillStyle = C.text; c.fillText(V.sup === 'batt' ? 'battery' : V.sup === 'res' ? 'drive + resistor' : 'drive, no brake', 65, 95);
        c.fillText(fmt(V.Va, 1) + ' V', 65, 145);
        if (V.sup === 'none') { const f = clamp((Vbus - Vbus0) / (0.3 * Vbus0), 0, 1); c.fillStyle = C.faint; c.fillRect(30, 160, 70, 8); c.fillStyle = f > 0.7 ? C.bad : C.warn; c.fillRect(30, 160, 70 * f, 8); }
        if (V.sup === 'res' && Pe < 0) { c.fillStyle = C.bad; c.fillText('resistor hot', 65, 198); }
        if (tripped) { c.fillStyle = C.bad; c.font = 'bold 13px ' + font(); c.fillText('TRIPPED', 65, 215); c.font = '12px ' + font(); }
        // power arrows: supply ↔ motor ↔ load
        const pa = (x1, x2, yy, P, lab) => { if (Math.abs(P) < 1) return; const wdt = clamp(Math.sqrt(Math.abs(P)) / 3, 1.5, 12); const col = P > 0 ? C.warn : C.ok; if (P > 0) kit.arrow(c, x1, yy, x2, yy, col, wdt); else kit.arrow(c, x2, yy, x1, yy, col, wdt); c.fillStyle = col; c.fillText(lab + ' ' + fmt(Math.abs(P), 0) + ' W', (x1 + x2) / 2, yy - 12); };
        pa(115, 195, 140, Pe, 'elec.');
        // motor
        const mx = 235, my = 140;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(mx, my, 36, 0, TAU); c.fill(); c.stroke();
        c.save(); c.translate(mx, my); c.rotate(-y * 40); c.strokeStyle = C.accent; c.lineWidth = 3; for (let k = 0; k < 3; k++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(-24, 0); c.lineTo(24, 0); c.stroke(); } c.restore();
        c.fillStyle = C.bad; c.fillText('heat ' + fmt(Pcu, 0) + ' W', mx, my + 54);
        pa(275, 330, 140, Pm, 'mech.');
        // drum, rope and mass
        const dx = 365, dy = 70;
        c.fillStyle = C.muted; c.beginPath(); c.arc(dx, dy, 22, 0, TAU); c.fill();
        c.save(); c.translate(dx, dy); c.rotate(-y * 4); c.strokeStyle = C.bg2; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -18); c.stroke(); c.restore();
        if (V.load === 'hoist') {
          const my2 = 250 - 110 * clamp((y + 3) / 8, 0, 1);
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(dx + 22, dy); c.lineTo(dx + 22, my2 - 14); c.stroke();
          c.fillStyle = C.surface; c.strokeStyle = C.text; c.fillRect(dx + 4, my2 - 14, 36, 28); c.strokeRect(dx + 4, my2 - 14, 36, 28);
          c.fillStyle = C.text; c.fillText(V.m + ' kg', dx + 22, my2 + 4);
          if (Math.abs(vHook) > 0.005) kit.arrow(c, dx + 56, my2, dx + 56, my2 - Math.sign(vHook) * 26, C.accent, 2);
        } else {
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(dx - 20, dy + 26); c.lineTo(dx + 150, dy + 26); c.stroke();
          for (let k = 0; k < 4; k++) { const bxp = dx - 10 + ((k * 45 + y * 200) % 180 + 180) % 180; c.fillStyle = C.surface; c.fillRect(bxp, dy + 8, 26, 18); c.strokeRect(bxp, dy + 8, 26, 18); }
          c.fillStyle = C.muted; c.fillText('conveyor with friction', dx + 60, dy + 44);
        }
        // the quadrant chart
        const qx = 470, qy = 30, qs = 190, cxq = qx + qs / 2, cyq = qy + qs / 2, Tmax = 3, nmax = 4500;
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.strokeRect(qx, qy, qs, qs);
        c.beginPath(); c.moveTo(qx, cyq); c.lineTo(qx + qs, cyq); c.moveTo(cxq, qy); c.lineTo(cxq, qy + qs); c.stroke();
        c.fillStyle = C.faint; c.font = '11px ' + font();
        c.fillText('I motoring', qx + qs * 0.75, qy + 14); c.fillText('II braking', qx + qs * 0.25, qy + 14); c.fillText('III motoring', qx + qs * 0.25, qy + qs - 6); c.fillText('IV braking', qx + qs * 0.75, qy + qs - 6);
        c.fillStyle = C.muted; c.fillText('torque →', qx + qs - 26, cyq + 14); c.save(); c.translate(cxq - 8, qy + 34); c.rotate(-Math.PI / 2); c.fillText('speed →', 0, 0); c.restore();
        const tq = T => cxq + clamp(T / Tmax, -1, 1) * qs / 2, nq = nn => cyq - clamp(nn / nmax, -1, 1) * qs / 2;
        // motor line for this voltage and load line
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(tq(-Tmax), nq(rpmOf((V.Va + R * Tmax / K) / K))); c.lineTo(tq(Tmax), nq(rpmOf((V.Va - R * Tmax / K) / K))); c.stroke();
        c.strokeStyle = C.muted; c.setLineDash([5, 4]); c.lineWidth = 1.5; c.beginPath();
        const Tg = V.m * g * rd / ratio;
        if (V.load === 'hoist') { c.moveTo(tq(Tg), qy); c.lineTo(tq(Tg), qy + qs); } else { c.moveTo(tq(-Tg), qy + qs); c.lineTo(tq(-Tg), cyq); c.lineTo(tq(Tg), cyq); c.lineTo(tq(Tg), qy); }
        c.stroke(); c.setLineDash([]);
        kit.dot(c, tq(Tm), nq(n), 6, tripped ? C.bad : C.warn, C.text);
        c.fillStyle = C.muted; c.font = '11px ' + font(); c.fillText('motor line at ' + fmt(V.Va, 1) + ' V (solid), load (dashed)', cxq, qy + qs + 16);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mb-loss-flow */
  // minimum efficiencies (%), 4-pole 50 Hz: IE2–IE4 from kit.motor.IE; IE1 from IEC 60034-30-1 for the same powers
  const IE1_4P = { 0.75: 72.1, 7.5: 86.0, 75: 92.7 };
  const LOSS_SHARE = [['stator copper', 0.38, true], ['iron (core)', 0.20, false], ['rotor copper', 0.18, true], ['stray load', 0.15, true], ['friction and windage', 0.09, false]];
  Hyper.sim('mb-loss-flow', {
    title: 'Where the power goes',
    blurb: `A power-flow (Sankey) diagram of a 4-pole induction motor: electrical power enters on the left, the losses peel off as heat, and the shaft power leaves on the right. Band widths are to scale. The motor's full-load efficiency is the minimum of the class you choose; the losses are split in shares typical of a mid-size motor — iron and friction stay constant, copper and stray losses grow with the square of the load.

**Try this**
- Move the load from 100 % down to 25 %: the output shrinks, the constant losses do not — efficiency sags. Find the load where the efficiency peaks (the constant and load losses are then equal).
- Change the class from IE1 to IE4 at 7.5 kW: the output band is the same, the loss branches thin — IE4 has about half the losses of IE1.
- Switch between 0.75, 7.5 and 75 kW: bigger motors lose a smaller share.
- Show the powers in hp or PS: the same arrow, measured three ways.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 250 });
      const [g1, g2] = graphs(box, 2);
      const p1 = kit.plot(g1, { x: { label: 'load (% of rated)', min: 0, max: 125 }, y: { label: 'efficiency (%)', min: 50, max: 100 }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'load (% of rated)', min: 0, max: 125 }, y: { label: 'losses (W)', min: 0 }, legend: true }, 190);
      let V = null, dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'P', type: 'select', label: 'Motor (4-pole, 50 Hz)', options: [['0.75 kW', 0.75], ['7.5 kW', 7.5], ['75 kW', 75]], value: 7.5 },
        { id: 'cls', type: 'select', label: 'Efficiency class', options: [['IE1', 'IE1'], ['IE2', 'IE2'], ['IE3', 'IE3'], ['IE4', 'IE4']], value: 'IE3' },
        { id: 'x', label: 'Load', min: 0, max: 125, step: 1, value: 100, unit: '%' },
        { id: 'u', type: 'select', label: 'Show powers in', options: [['kW', 'kW'], ['hp', 'hp'], ['PS', 'PS']], value: 'kW' }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['in', 'Electrical input'], ['out', 'Shaft output'], ['loss', 'Losses (heat)'], ['eta', 'Efficiency'], ['best', 'Best efficiency at']]);
      const etaFull = (cls, kW) => (cls === 'IE1' ? IE1_4P[kW] : M.ieAt(cls, kW)) / 100;
      const model = (cls, kW) => { const Pn = kW * 1000, Lt = Pn * (1 / etaFull(cls, kW) - 1); const P0 = Lt * 0.29, Pc = Lt * 0.71; return { Pn, Lt, P0, Pc, at: x => { const out = x * Pn, parts = LOSS_SHARE.map(([nm, sh, load]) => [nm, Lt * sh * (load ? x * x : 1)]); const L = parts.reduce((s, p) => s + p[1], 0); return { out, parts, L, inp: out + L, eta: out > 0 ? out / (out + L) : 0 }; } }; };
      const unitDiv = () => V.u === 'hp' ? M.HP : V.u === 'PS' ? M.PS : 1000;
      const pw = W => { const v = W / unitDiv(); return (v < 1 ? fmt(v, 3) : v < 10 ? fmt(v, 2) : fmt(v, 1)) + ' ' + V.u; };
      let tick = 0;
      const loop = kit.loop(() => {
        if (!dirty && ++tick % 30 !== 0) return;
        dirty = false;
        const md = model(V.cls, V.P), x = V.x / 100, r = md.at(x), C = kit.colors();
        const xs = Math.sqrt(md.P0 / md.Pc);
        ro.set('in', pw(r.inp)); ro.set('out', pw(r.out)); ro.set('loss', fmt(r.L, 0) + ' W (' + fmt(100 * r.L / Math.max(1e-9, r.inp), 1) + ' % of input)');
        ro.set('eta', fmt(100 * r.eta, 1) + ' %'); ro.set('best', fmt(100 * xs, 0) + ' % load (' + fmt(100 * md.at(xs).eta, 1) + ' %)');
        // Sankey
        const c = st.begin(); c.save(); fit(c, st, 680, 300); c.font = '12px ' + font(); c.textAlign = 'center';
        const scale = 150 / md.at(1.25).inp, top = 40;
        let bot = top + r.inp * scale;
        const xsK = [150, 230, 310, 390, 470], xEnd = 600;
        c.fillStyle = C.accent; c.globalAlpha = 0.75;
        // band from the input to the first branch
        c.fillRect(40, top, xsK[0] - 40, bot - top);
        let xPrev = xsK[0];
        LOSS_SHARE.forEach((ls, k) => {
          const hk = Math.max(0.8, r.parts[k][1] * scale), xk = xsK[k];
          if (k > 0) { c.fillStyle = C.accent; c.globalAlpha = 0.75; c.fillRect(xPrev, top, xk - xPrev, bot - top); }
          // the loss ribbon turning down
          c.globalAlpha = 0.8; c.fillStyle = 'hsl(' + (8 + k * 9) + ' 80% 55%)';
          c.beginPath(); c.moveTo(xk, bot - hk); c.quadraticCurveTo(xk + hk, bot - hk, xk + hk, bot); c.lineTo(xk + hk, 238); c.lineTo(xk, 238); c.closePath(); c.fill();
          c.globalAlpha = 1; c.fillStyle = C.text; c.font = '11px ' + font();
          c.fillText(ls[0], xk + hk / 2, 254); c.fillText(fmt(r.parts[k][1], 0) + ' W', xk + hk / 2, 268);
          bot -= hk; xPrev = xk;
        });
        c.globalAlpha = 0.85; c.fillStyle = C.ok; c.fillRect(xPrev, top, xEnd - xPrev, Math.max(0.5, bot - top));
        c.beginPath(); c.moveTo(xEnd, top - 6); c.lineTo(xEnd + 30, (top + bot) / 2); c.lineTo(xEnd, bot + 6); c.closePath(); c.fill(); c.globalAlpha = 1;
        c.font = '13px ' + font(); c.fillStyle = C.text;
        c.fillText('input ' + pw(r.inp), 90, top - 12); c.fillText('shaft ' + pw(r.out), 590, top - 12);
        c.font = '12px ' + font(); c.fillStyle = C.muted;
        c.fillText(V.P + ' kW ' + V.cls + ' at ' + V.x + ' % load: efficiency ' + fmt(100 * r.eta, 1) + ' %', 340, 292);
        c.restore();
        // graphs
        const curves = ['IE1', 'IE2', 'IE3', 'IE4'].map(cl => { const m2 = model(cl, V.P), pts = []; for (let k = 2; k <= 125; k += 1) pts.push([k, 100 * m2.at(k / 100).eta]); return { pts, label: cl, width: cl === V.cls ? 3 : 1.2, dash: cl === V.cls ? null : [4, 3] }; });
        p1.set({ series: curves, marks: [{ x: V.x, y: 100 * r.eta, label: V.cls }], vlines: [{ x: 100 * xs, label: 'best' }] });
        const cst = [], ld = [], tot = [];
        for (let k = 0; k <= 125; k += 2) { const q = md.at(k / 100); cst.push([k, md.P0]); ld.push([k, q.L - md.P0]); tot.push([k, q.L]); }
        p2.set({ series: [{ pts: tot, label: 'total losses' }, { pts: cst, label: 'constant (iron, friction)', dash: [5, 4] }, { pts: ld, label: 'load losses (copper, stray)', dash: [2, 3] }], marks: [{ x: V.x, y: r.L }] });
      }, box.stage);
      loop.start();
      st.onResize(() => { dirty = true; });
    }
  });

  /* ================================================================ mb-power-factor */
  // a typical 7.5 kW, 400 V, 50 Hz, 4-pole IE3 cage motor (per-phase equivalent circuit, star): about 14.6 A, cos φ 0.82, 90.6 % at full load
  const IM75 = { V_LL: 400, f: 50, poles: 4, R1: 0.6, X1: 1.15, R2: 0.48, X2: 1.7, Xm: 32, Rc: 1250, Pfw: 65, deepBar: 1 };
  Hyper.sim('mb-power-factor', {
    title: 'Power factor of an induction motor',
    blurb: `A 7.5 kW, 400 V, 4-pole motor, computed from its equivalent circuit. Left: the phasors of one phase — the voltage, the motor current lagging by φ, split into its active part (in step with the voltage, doing the work) and its reactive part (magnetising the motor). Middle: the power triangle of kW, kvar and kVA. Right: one cycle of voltage, current and instantaneous power. A capacitor bank at the motor supplies reactive current locally.

**Try this**
- Slide the load from 100 % to 0: the active current shrinks, the reactive current hardly changes, so φ opens up and cos φ collapses (0.82 → about 0.06).
- At 25 % load look at the instantaneous power: it dips below zero each half-cycle — energy sloshing back to the supply.
- Add capacitors: the line current falls while the motor current stays the same. Push past about 4 kvar and the warning appears: more than the motor's no-load reactive power risks self-excitation.
- Overcorrect at light load: the line current leads the voltage.`,
    mount(box, kit) {
      const M = kit.motor, im = M.induction(IM75), SQ3 = Math.sqrt(3), Vph = 400 / SQ3;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 250 });
      const [g1, g2] = graphs(box, 2);
      const p1 = kit.plot(g1, { x: { label: 'load (% of rated)', min: 0, max: 125 }, y: { label: 'power factor', min: 0, max: 1 }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'load (% of rated)', min: 0, max: 125 }, y: { label: 'current (A)', min: 0 }, legend: true }, 190);
      const opAt = x => { const target = x * 7500; let lo = 1e-7, hi = im.sMax; for (let k = 0; k < 60; k++) { const md = (lo + hi) / 2; if (im.at(md).Pmech < target) lo = md; else hi = md; } return im.at(hi); };
      const q0 = (() => { const o = opAt(0); const S = SQ3 * 400 * o.I1; return Math.sqrt(Math.max(0, S * S - o.Pin * o.Pin)); })();
      let V = null, t = 0, dirty = true, cache = null;
      const ctl = kit.controls(box.side, [
        { id: 'x', label: 'Load', min: 0, max: 125, step: 1, value: 100, unit: '%' },
        { id: 'qc', label: 'Correction capacitors', min: 0, max: 8, step: 0.1, value: 0, unit: 'kvar' }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['pf', 'Motor cos φ · efficiency'], ['P', 'P · Q · S (motor)'], ['Im', 'Motor current'], ['Il', 'Line current · line power factor'], ['warn', 'Capacitor check']]);
      const lineOf = (o, Qc) => { const S = SQ3 * 400 * o.I1, P = o.Pin, Q = Math.sqrt(Math.max(0, S * S - P * P)), Ql = Q - Qc, Sl = Math.hypot(P, Ql); return { P, Q, S, Ql, Sl, Il: Sl / (SQ3 * 400), pfl: Sl > 0 ? P / Sl : 1 }; };
      const loop = kit.loop(dt => {
        t += dt;
        const C = kit.colors();
        if (dirty) {
          dirty = false;
          const o = opAt(V.x / 100), L = lineOf(o, V.qc * 1000);
          cache = { o, L };
          const pfm = [], pfl = [], im1 = [], il = [];
          for (let k = 0; k <= 125; k += 2.5) { const oo = opAt(k / 100), LL = lineOf(oo, V.qc * 1000); pfm.push([k, oo.pf]); pfl.push([k, LL.pfl]); im1.push([k, oo.I1]); il.push([k, LL.Il]); }
          p1.set({ series: [{ pts: pfm, label: 'motor cos φ' }, { pts: pfl, label: 'line, with ' + fmt(V.qc, 1) + ' kvar', dash: [5, 4] }], marks: [{ x: V.x, y: o.pf }] });
          p2.set({ series: [{ pts: im1, label: 'motor current' }, { pts: il, label: 'line current', dash: [5, 4] }], marks: [{ x: V.x, y: o.I1 }, { x: V.x, y: L.Il, color: C.ok }] });
          ro.set('pf', fmt(o.pf, 3) + ' · ' + fmt(100 * Math.max(0, o.eff), 1) + ' %');
          ro.set('P', fmt(L.P / 1000, 2) + ' kW · ' + fmt(L.Q / 1000, 2) + ' kvar · ' + fmt(L.S / 1000, 2) + ' kVA');
          ro.set('Im', fmt(o.I1, 2) + ' A');
          ro.set('Il', fmt(L.Il, 2) + ' A · ' + fmt(L.pfl, 3) + (L.Ql < -1 ? ' leading' : ' lagging'));
          ro.set('warn', V.qc * 1000 > 0.9 * q0 ? 'over the limit: ' + fmt(V.qc, 1) + ' kvar > 90 % of the no-load ' + fmt(q0 / 1000, 1) + ' kvar — self-excitation risk' : 'within 90 % of the no-load ' + fmt(q0 / 1000, 1) + ' kvar');
        }
        const { o, L } = cache, phi = Math.acos(clamp(o.pf, 0, 1)), Ip = o.I1, Ic = V.qc * 1000 / (SQ3 * 400);
        const c = st.begin(); c.save(); fit(c, st, 700, 300); c.font = '12px ' + font(); c.textAlign = 'center';
        // phasors (one phase; current scale: 20 A = 120 px)
        const ox = 30, oy = 120, ks = 120 / 20;
        c.fillStyle = C.muted; c.fillText('phasors (one phase)', 115, 20);
        kit.arrow(c, ox, oy, ox + 190, oy, C.text, 2.5); c.fillStyle = C.text; c.textAlign = 'left'; c.fillText('V', ox + 194, oy + 4);
        const ia = [Ip * Math.cos(phi), -Ip * Math.sin(phi)];           // motor current: lagging (drawn downwards)
        c.setLineDash([4, 3]); c.strokeStyle = C.accent; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(ox, oy); c.lineTo(ox + ia[0] * ks, oy); c.lineTo(ox + ia[0] * ks, oy - ia[1] * ks); c.stroke(); c.setLineDash([]);
        kit.arrow(c, ox, oy, ox + ia[0] * ks, oy - ia[1] * ks, C.warn, 3);
        c.fillStyle = C.warn; c.fillText('I motor ' + fmt(Ip, 1) + ' A', ox + ia[0] * ks + 6, oy - ia[1] * ks + 14);
        c.fillStyle = C.accent; c.fillText('active ' + fmt(Ip * Math.cos(phi), 1) + ' A', ox + 4, oy - 8);
        c.fillText('reactive ' + fmt(Ip * Math.sin(phi), 1) + ' A', ox + ia[0] * ks + 4, oy + Math.min(60, Ip * Math.sin(phi) * ks / 2));
        if (Ic > 0.01) {
          kit.arrow(c, ox + ia[0] * ks, oy - ia[1] * ks, ox + ia[0] * ks, oy - ia[1] * ks - Ic * ks, C.ok, 2.5);
          const Il = [ia[0], ia[1] + Ic];
          kit.arrow(c, ox, oy, ox + Il[0] * ks, oy - Il[1] * ks, C.ok, 2.5);
          c.fillStyle = C.ok; c.fillText('I line', ox + Il[0] * ks + 6, oy - Il[1] * ks - 4);
        }
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.arc(ox, oy, 34, 0, phi); c.stroke(); c.fillStyle = C.muted; c.fillText('φ = ' + fmt(phi * 180 / Math.PI, 1) + '°', ox + 38, oy + 20);
        // power triangle
        const tx = 260, ty = 60, pk = 150 / 12000;
        c.textAlign = 'center'; c.fillStyle = C.muted; c.fillText('power triangle (whole motor)', 350, 20);
        const Pw = L.P * pk, Qh = L.Q * pk, Qlh = L.Ql * pk;
        c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx + Pw, ty); c.stroke();
        c.strokeStyle = C.series[3] || C.warn; c.beginPath(); c.moveTo(tx + Pw, ty); c.lineTo(tx + Pw, ty + Qh); c.stroke();
        c.strokeStyle = C.warn; c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx + Pw, ty + Qh); c.stroke();
        if (V.qc > 0.01) { c.strokeStyle = C.ok; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx + Pw, ty + Qlh); c.stroke(); c.setLineDash([]); }
        c.textAlign = 'left'; c.fillStyle = C.accent; c.fillText('P ' + fmt(L.P / 1000, 2) + ' kW', tx, ty - 8);
        c.fillStyle = C.text; c.fillText('Q ' + fmt(L.Q / 1000, 2) + ' kvar', tx + Pw + 6, ty + Qh / 2);
        c.fillStyle = C.warn; c.fillText('S ' + fmt(L.S / 1000, 2) + ' kVA', tx + 4, ty + Qh / 2 + 30);
        if (V.qc > 0.01) { c.fillStyle = C.ok; c.fillText('line S ' + fmt(L.Sl / 1000, 2) + ' kVA', tx + 4, ty + Qh / 2 + 46); }
        // waveforms: one cycle, moving cursor
        const wx = 470, wy = 150, ww = 210, wh = 90, T = 0.02, tc = (t / 25) % T;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(wx, wy); c.lineTo(wx + ww, wy); c.stroke();
        c.textAlign = 'center'; c.fillStyle = C.muted; c.fillText('one cycle: v, i and p = v·i', wx + ww / 2, 20);
        const Vp = Math.SQRT2 * Vph, Imax = Math.SQRT2 * 20, pmax = Vp * Imax;
        const tr = (fn, col, lw) => { c.strokeStyle = col; c.lineWidth = lw; c.beginPath(); for (let k = 0; k <= 100; k++) { const tt = T * k / 100, yv = fn(tt); k ? c.lineTo(wx + ww * k / 100, wy - yv * wh) : c.moveTo(wx, wy - yv * wh); } c.stroke(); };
        const vf = tt => Math.sin(TAU * 50 * tt), ifn = tt => Math.SQRT2 * Ip * Math.sin(TAU * 50 * tt - phi) / Imax;
        c.fillStyle = 'hsl(160 60% 45% / .25)';
        c.beginPath(); c.moveTo(wx, wy); for (let k = 0; k <= 100; k++) { const tt = T * k / 100; c.lineTo(wx + ww * k / 100, wy - Vp * vf(tt) * ifn(tt) * Imax / pmax * wh); } c.lineTo(wx + ww, wy); c.closePath(); c.fill();
        tr(vf, C.text, 1.8); tr(ifn, C.warn, 2);
        c.strokeStyle = C.muted; c.beginPath(); c.moveTo(wx + ww * tc / T, wy - wh); c.lineTo(wx + ww * tc / T, wy + wh); c.stroke();
        c.textAlign = 'left'; c.font = '11px ' + font();
        c.fillStyle = C.text; c.fillText('v', wx + 4, wy - wh + 6); c.fillStyle = C.warn; c.fillText('i (motor)', wx + 20, wy - wh + 6); c.fillStyle = C.ok; c.fillText('p shaded: below the axis = power flowing back', wx, wy + wh + 14);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mb-duty */
  Hyper.sim('mb-duty', {
    title: 'Duty cycles and winding temperature',
    blurb: `A model 7.5 kW fan-cooled motor designed for an 80 K rise (class F insulation used at class B rise): 231 W of constant losses and 565 W of load losses at rated load, a thermal time constant of 30 minutes running and 90 minutes at standstill (its fan stops). Time runs fast. The graph shows the average winding temperature through the chosen duty cycle, with the 120 °C design limit (80 K above a 40 °C ambient) and the 145 °C average that puts the hot spot at class F's 155 °C.

**Try this**
- S1 at 100 %: the temperature climbs along an exponential and settles at 120 °C after two hours or so (four time constants).
- S2 30 min at 130 %: the winding stops short of the limit, then cools to ambient before the next run. Try 60 min: it overshoots.
- S3 40 % at 130 % load: the temperature saw-tooths up to a steady band near the limit — the model motor carries about 1.3 times its S1 load, not the ideal 1/√0.4 = 1.58.
- Switch the same cycle to S6 (no-load running instead of rest): the fan keeps cooling and the band is lower — S6 allows more.
- S3 at 15 % and 200 %: allowed thermally, but look at the torque: twice rated torque is near the limits of many motors and gearboxes.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200 });
      const [g1, g2] = graphs(box, 2);
      const p1 = kit.plot(g1, { x: { label: 'time (min)' }, y: { label: 'winding temperature (°C)', min: 20, max: 170 }, legend: true }, 200);
      const p2 = kit.plot(g2, { x: { label: 'time (min)' }, y: { label: 'load (%)', min: 0, max: 210 } }, 200);
      const P0 = 231, Pc = 565, Rth = 80 / 796, tauRun = 1800, Cth = tauRun / Rth, Ta = 40;
      let V = null, T = Ta, tm = 0, Tmax = Ta, trace = [], lastPlot = -1, s2rest = false, s2t = 0, fanA = 0;
      const ctl = kit.controls(box.side, [
        { id: 'duty', type: 'select', label: 'Duty type', options: [['S1 continuous', 'S1'], ['S2 short-time, then rest until cold', 'S2'], ['S3 intermittent: load, then rest', 'S3'], ['S6 continuous: load, then no load', 'S6']], value: 'S1' },
        { id: 'x', label: 'Load while on', min: 0, max: 200, step: 5, value: 100, unit: '%' },
        { id: 'D', label: 'Cyclic duration factor (10-min cycle)', min: 5, max: 100, step: 5, value: 40, unit: '%' },
        { id: 's2', type: 'select', label: 'S2 run time', options: [['10 min', 10], ['30 min', 30], ['60 min', 60], ['90 min', 90]], value: 30 },
        { id: 'sp', type: 'select', label: 'Time runs at', options: [['2 min per second', 2], ['5 min per second', 5], ['15 min per second', 15]], value: 5 },
        { type: 'buttons', items: [{ id: 'cold', label: 'Start cold', primary: true }] }
      ], id => { if (id === 'duty') show(); if (id === 'cold' || id === 'duty') { T = Ta; tm = 0; Tmax = Ta; trace = []; s2rest = false; s2t = 0; } lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['des', 'Duty designation'], ['T', 'Winding temperature (average)'], ['mx', 'Highest so far'], ['st', 'Motor now'], ['id', 'Ideal limit for this cycle (1/√D)']]);
      function show() { ctl.show('D', V.duty === 'S3' || V.duty === 'S6'); ctl.show('s2', V.duty === 'S2'); }
      show();
      // what the motor is doing at a time (minutes) → 'on' | 'rest' | 'noload'
      const phase = () => {
        if (V.duty === 'S1') return 'on';
        if (V.duty === 'S2') return s2rest ? 'rest' : 'on';
        const inCycle = tm % 10;
        return inCycle < 10 * V.D / 100 ? 'on' : (V.duty === 'S3' ? 'rest' : 'noload');
      };
      const loop = kit.loop(dt => {
        const simDt = dt * V.sp * 60, sub = 20, h = simDt / sub;
        let ph = phase();
        for (let k = 0; k < sub; k++) {
          ph = phase();
          const x = V.x / 100;
          if (ph === 'on') T += h * (P0 + Pc * x * x - (T - Ta) / Rth) / Cth;
          else if (ph === 'noload') T += h * (P0 - (T - Ta) / Rth) / Cth;
          else T += h * (-(T - Ta) / (3 * Rth)) / Cth;
          tm += h / 60;
          if (V.duty === 'S2') { s2t += h / 60; if (!s2rest && s2t >= V.s2) { s2rest = true; } else if (s2rest && T - Ta < 2) { s2rest = false; s2t = 0; } }
        }
        Tmax = Math.max(Tmax, T);
        trace.push([tm, T, ph === 'on' ? V.x : 0]); while (trace.length && trace[0][0] < tm - 240) trace.shift();
        const des = V.duty === 'S1' ? 'S1' : V.duty === 'S2' ? 'S2 ' + V.s2 + ' min' : V.duty + ' ' + V.D + ' %';
        ro.set('des', des + ' at ' + V.x + ' % load');
        ro.set('T', fmt(T, 1) + ' °C (rise ' + fmt(T - Ta, 1) + ' K)');
        ro.set('mx', fmt(Tmax, 1) + ' °C' + (Tmax > 145 ? ' — beyond class F!' : Tmax > 120.5 ? ' — above the 80 K design rise' : ''));
        ro.set('st', ph === 'on' ? 'running at ' + V.x + ' % load' : ph === 'noload' ? 'running unloaded (fan cooling)' : 'stopped: fan stopped, cooling slowly');
        ro.set('id', V.duty === 'S3' || V.duty === 'S6' ? fmt(100 / Math.sqrt(V.D / 100), 0) + ' % current if all losses were copper and cooling unchanged' : '—');
        if (tm - lastPlot > 0.5 || lastPlot < 0) {
          lastPlot = tm;
          const t0 = Math.max(0, tm - 240);
          p1.set({ x: { label: 'time (min)', min: t0, max: t0 + 240 }, series: [{ pts: trace.map(p => [p[0], p[1]]), label: 'winding' }], hlines: [{ y: 120, label: '120 °C: 80 K design rise' }, { y: 145, label: '145 °C: class F limit (average)' }] });
          p2.set({ x: { label: 'time (min)', min: t0, max: t0 + 240 }, series: [{ pts: trace.map(p => [p[0], p[2]]), label: 'load' }] });
        }
        // drawing: motor with fan and a thermometer
        const c = st.begin(), C = kit.colors(); c.save(); fit(c, st, 640, 220); c.font = '12px ' + font(); c.textAlign = 'center';
        const heat = clamp((T - Ta) / 110, 0, 1);
        c.fillStyle = 'hsl(' + (210 - 200 * heat) + ' 70% 50% / .55)'; c.strokeStyle = C.text; c.lineWidth = 2;
        c.fillRect(120, 60, 220, 110); c.strokeRect(120, 60, 220, 110);
        c.strokeStyle = C.faint; c.lineWidth = 1; for (let x = 130; x < 340; x += 10) { c.beginPath(); c.moveTo(x, 64); c.lineTo(x, 166); c.stroke(); }
        c.fillStyle = C.text; c.fillRect(340, 110, 60, 10);
        if (ph !== 'rest') fanA += dt * 10;
        c.save(); c.translate(100, 115); c.strokeStyle = C.muted; c.lineWidth = 3; for (let k = 0; k < 4; k++) { c.rotate(Math.PI / 2); c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(fanA) * 20, Math.sin(fanA) * 20); c.stroke(); } c.restore();
        c.fillStyle = C.muted; c.fillText(ph === 'rest' ? 'fan stopped' : 'fan turning', 100, 150);
        c.fillStyle = C.text; c.font = '14px ' + font(); c.fillText(des, 230, 40); c.font = '12px ' + font();
        c.fillText(ph === 'on' ? 'loaded ' + V.x + ' %' : ph === 'noload' ? 'no load' : 'at rest', 230, 195);
        // thermometer 20–170 °C
        const tx = 480, tyb = 190, tyt = 30, yT = v => tyb - (tyb - tyt) * clamp((v - 20) / 150, 0, 1);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(tx - 7, tyt, 14, tyb - tyt);
        c.fillStyle = T > 145 ? C.bad : T > 120.5 ? C.warn : 'hsl(20 85% 55%)'; c.fillRect(tx - 6, yT(T), 12, tyb - yT(T));
        [[120, 'design 120 °C'], [145, 'class F 145 °C']].forEach(([v, lab]) => { c.strokeStyle = C.bad; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(tx - 16, yT(v)); c.lineTo(tx + 16, yT(v)); c.stroke(); c.setLineDash([]); c.fillStyle = C.muted; c.textAlign = 'left'; c.fillText(lab, tx + 22, yT(v) + 4); });
        c.textAlign = 'center'; c.fillStyle = C.text; c.fillText(fmt(T, 0) + ' °C', tx, tyb + 18);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mb-nameplate */
  // part-load efficiency from the full-load value with the two-part loss model (29 % constant losses)
  const etaPart = (eta1, x) => { const L = 1 / eta1 - 1, P0 = 0.29 * L, Pc = 0.71 * L; return x / (x + P0 + Pc * x * x); };
  const PLATES = {
    iec075: { std: 'iec', name: 'IEC 0.75 kW, 4-pole', P: 0.75, frame: '80', im: 'B3', ip: 'IP55', ic: 'IC411', cls: '155 (F)', rise: 80, duty: 'S1', V: [[230, 'Δ'], [400, 'Y']], I: [3.03, 1.75], f: 50, n: 1430, pf: 0.75, ie: 'IE3', eta: 0.825, mass: '≈ 10 kg' },
    iec75: { std: 'iec', name: 'IEC 7.5 kW, 4-pole', P: 7.5, frame: '132M', im: 'B3', ip: 'IP55', ic: 'IC411', cls: '155 (F)', rise: 80, duty: 'S1', V: [[400, 'Δ'], [690, 'Y']], I: [14.6, 8.4], f: 50, n: 1455, pf: 0.82, ie: 'IE3', eta: 0.904, mass: '≈ 55 kg' },
    iec750: { std: 'iec', name: 'IEC 75 kW, 4-pole', P: 75, frame: '280S', im: 'B3', ip: 'IP55', ic: 'IC411', cls: '155 (F)', rise: 80, duty: 'S1', V: [[400, 'Δ'], [690, 'Y']], I: [132.5, 76.5], f: 50, n: 1485, pf: 0.86, ie: 'IE3', eta: 0.95, mass: '≈ 500 kg' },
    nema10: { std: 'nema', name: 'NEMA 10 hp, 4-pole', hp: 10, P: 10 * 0.7457, frame: '215T', encl: 'TEFC', ins: 'F', duty: 'CONT.', V: [[230, ''], [460, '']], I: [24.8, 12.4], f: 60, n: 1765, pf: 0.82, sf: 1.15, sfa: '≈ 14.2', code: 'H', design: 'B', eff: 91.7, eta: 0.917 }
  };
  const INFO = {
    type: 'Three-phase (3~) induction motor. The supply must match: three phases at the voltage and frequency below.',
    std: 'The standard the ratings follow: IEC 60034-1 for IEC motors, NEMA MG 1 in North America. Tolerances on the plate values come from it too (for example ±20 % on slip).',
    frame: 'Frame: for IEC the number is the shaft height in mm and S/M/L the length; for NEMA T-frames the first two digits over four give the shaft height in inches. It fixes shaft, feet and flange dimensions.',
    im: 'Mounting (IEC 60034-7): B3 = feet, shaft horizontal. B5 flange, B14 face flange, B35 feet + flange, V1 vertical shaft down.',
    ip: 'Degree of protection: IP55 = dust-protected and protected against water jets. Only as good as the seals, glands and drain holes.',
    ic: 'Cooling: IC411 = totally enclosed, a fan on the shaft blows air over the fins. Its cooling falls at low speed on a VFD.',
    cls: 'Thermal class of the insulation: F = 155 °C hot spot. With a class B rise (80 K) the winding runs about 25 K below its limit — several times the insulation life.',
    rise: 'The temperature rise the motor is designed for, measured by resistance above a 40 °C ambient.',
    duty: 'Duty type: S1 = continuous at the rated output. S2 (short-time) and S3 (intermittent) ratings allow more for part of the time.',
    amb: 'The rating holds for cooling air up to 40 °C and altitudes up to 1000 m; beyond that, derate.',
    V: 'Rated voltage for each connection. The lower voltage is always delta (Δ), the higher star (Y). Connect for the voltage of your supply.',
    Hz: 'Rated frequency. At 60 Hz a 50 Hz motor turns 20 % faster; the voltage must rise in proportion to keep the flux (V/f).',
    A: 'Full-load line current at rated voltage for that connection — the basis for cables, fuses, overload relays and the drive\'s motor data.',
    kW: 'Rated output: mechanical power at the shaft, continuously. The input is larger by the losses.',
    rpm: 'Speed at full load. The synchronous speed just above it gives the poles; the difference is the slip.',
    pf: 'cos φ: the power factor at full load, kW/kVA. It falls at part load. It is not a "COP" (that is a heat-pump figure).',
    ie: 'Efficiency class and efficiency (IEC 60034-30-1), with the 75 % and 50 % load values: η = P out / P in at those loads.',
    mass: 'Mass, for handling and lifting (use the lifting eyes).',
    brg: 'Bearing sizes, grease type and relubrication interval (where regreasable) — for maintenance.',
    hp: 'Rated output in horsepower (1 hp = 745.7 W), at the shaft, continuously.',
    sf: 'Service factor: the motor may carry this multiple of rated load at rated voltage and frequency, running hotter and with shorter insulation life. A margin, not spare capacity.',
    sfa: 'The current at service-factor load.',
    code: 'Locked-rotor code letter: the starting kVA per hp. H = 6.3–7.1 kVA/hp, so the starting current is about 6–7 times FLA.',
    design: 'NEMA design letter: B = normal starting torque and current (most general-purpose motors). A, C and D have other torque–speed shapes; D has high slip.',
    encl: 'Enclosure: TEFC = totally enclosed, fan-cooled (about IP54/55, IC411).',
    ins: 'Insulation class F: 155 °C hot spot.',
    eff: 'NEMA nominal efficiency at full load; 91.7 % is the NEMA Premium level for a 10 hp 4-pole enclosed motor.',
    ph: 'Number of phases.',
    ser: 'Model and serial number: quote them when ordering spares.'
  };
  Hyper.sim('mb-nameplate', {
    title: 'A motor nameplate, field by field',
    blurb: `An illustrative rating plate — every maker lays it out differently, but the contents are set by IEC 60034-1 or NEMA MG 1. **Click any field** to see what it means. The readout works out what follows from the plate: poles and slip, rated torque, input power and losses, apparent power, and whether the numbers check each other.

**Try this**
- Click *rpm* on the 7.5 kW plate: 1455 rpm on 50 Hz means 4 poles and 3 % slip.
- Click the voltage line: 400 V Δ / 690 V Y. On a 400 V supply you connect delta; the 0.75 kW motor (230 Δ / 400 Y) must be star on the same supply.
- Compare the input power worked out from V, I and cos φ with the output: the efficiency on the plate should come back.
- Switch to the NEMA plate: find the service factor, code letter and design letter, and see the starting current they imply.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      let V = null, sel = 'kW', cells = [];
      const ctl = kit.controls(box.side, [
        { id: 'pl', type: 'select', label: 'Plate', options: Object.entries(PLATES).map(([k, p]) => [p.name, k]), value: 'iec75' },
        { id: 'info', type: 'html', html: '' }
      ], () => { sel = 'kW'; draw(); });
      V = ctl.values;
      const ro = kit.readout(box.side, [['poles', 'Poles · synchronous speed · slip'], ['T', 'Rated torque'], ['Pin', 'Input √3·V·I·cos φ'], ['chk', 'Losses · efficiency check'], ['S', 'Apparent power'], ['x', 'Also']]);
      const layout = p => {
        const out = [], add = (key, label, value, x, y, w) => out.push({ key, label, value, x, y, w, h: 34 });
        const r1 = 64, r2 = 104, r3 = 144, r4 = 184, r5 = 224;
        if (p.std === 'iec') {
          add('type', '', '3~ Mot.', 40, 24, 110); add('std', '', 'IEC 60034-1', 160, 24, 130); add('ser', '', 'No. (serial)', 300, 24, 150); add('mass', '', p.mass, 460, 24, 140);
          add('frame', 'Frame', p.frame, 40, r1, 110); add('im', 'IM', p.im, 160, r1, 70); add('ip', '', p.ip, 240, r1, 80); add('ic', '', p.ic, 330, r1, 80); add('cls', 'Th.Cl.', p.cls, 420, r1, 90); add('rise', 'ΔT', p.rise + ' K', 520, r1, 80);
          add('duty', '', p.duty, 40, r2, 70); add('amb', '', 'Amb. −20…+40 °C, ≤ 1000 m', 120, r2, 250); add('brg', '', 'DE / NDE bearings, grease', 380, r2, 220);
          p.V.forEach((v, k) => { const y = r3 + 40 * k; add('V', k ? '' : 'V', v[0] + ' ' + v[1], 40, y, 90); add('Hz', k ? '' : 'Hz', String(p.f), 140, y, 60); add('A', k ? '' : 'A', String(p.I[k]), 210, y, 80); add('kW', k ? '' : 'kW', String(p.P), 300, y, 70); add('rpm', k ? '' : 'rpm', String(p.n), 380, y, 80); add('pf', k ? '' : 'cos φ', p.pf.toFixed(2), 470, y, 70); });
          add('ie', '', p.ie + ' · ' + (100 * p.eta).toFixed(1) + ' % (100 %) · ' + (100 * etaPart(p.eta, 0.75)).toFixed(1) + ' % (75 %) · ' + (100 * etaPart(p.eta, 0.5)).toFixed(1) + ' % (50 %)', 40, r5 + 40, 560);
        } else {
          add('ser', '', 'MODEL / SER. NO.', 40, 24, 200); add('std', '', 'NEMA MG 1', 250, 24, 120); add('encl', 'ENCL.', p.encl, 380, 24, 100); add('ph', 'PH', '3', 490, 24, 110);
          add('hp', 'HP', String(p.hp), 40, r1, 90); add('rpm', 'RPM', String(p.n), 140, r1, 100); add('frame', 'FRAME', p.frame, 250, r1, 110); add('sf', 'S.F.', p.sf.toFixed(2), 370, r1, 90); add('Hz', 'HZ', String(p.f), 470, r1, 130);
          add('V', 'VOLTS', p.V.map(v => v[0]).join('/'), 40, r2, 150); add('A', 'AMPS', p.I.join('/'), 200, r2, 150); add('sfa', 'S.F. AMPS', p.sfa, 360, r2, 120); add('duty', 'DUTY', p.duty, 490, r2, 110);
          add('code', 'CODE', p.code, 40, r3, 90); add('design', 'DESIGN', p.design, 140, r3, 100); add('ins', 'INS. CL.', p.ins, 250, r3, 110); add('amb', 'AMB.', '40 °C', 370, r3, 100); add('pf', 'P.F.', String(Math.round(p.pf * 100)), 480, r3, 120);
          add('eff', 'NEMA NOM. EFF.', p.eff.toFixed(1) + ' %', 40, r4, 260); add('brg', '', 'BEARINGS DE / ODE, GREASE', 310, r4, 290);
        }
        return out;
      };
      function draw() {
        const p = PLATES[V.pl];
        cells = layout(p);
        const c = st.begin(), C = kit.colors(); c.save(); fit(c, st, 640, 320);
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.roundRect ? c.roundRect(20, 10, 600, 300, 10) : c.rect(20, 10, 600, 300); c.fill(); c.stroke();
        for (const cl of cells) {
          const on = cl.key === sel;
          c.fillStyle = on ? kit.hue(48, 0.35) : C.surface; c.strokeStyle = on ? C.warn : C.faint; c.lineWidth = on ? 2 : 1;
          c.fillRect(cl.x, cl.y, cl.w, cl.h); c.strokeRect(cl.x, cl.y, cl.w, cl.h);
          c.textAlign = 'left'; c.fillStyle = C.muted; c.font = '10px ' + font(); if (cl.label) c.fillText(cl.label, cl.x + 4, cl.y + 11);
          c.fillStyle = C.text; c.font = (cl.w > 300 ? '12px ' : '13px ') + font(); c.fillText(cl.value, cl.x + 5, cl.y + (cl.label ? 27 : 22));
        }
        c.fillStyle = C.muted; c.font = '11px ' + font(); c.textAlign = 'center'; c.fillText('illustrative plate — click a field', 320, 306);
        c.restore();
        ctl.rows.info.set('<b>' + (cells.find(x => x.key === sel) || { value: '' }).value + '</b><br>' + (INFO[sel] || ''));
        // what follows from the plate
        const nsList = [2, 4, 6, 8, 10, 12].map(pp => [pp, 120 * p.f / pp]).filter(q => q[1] > p.n);
        const [poles, ns] = nsList[nsList.length - 1] || [2, 120 * p.f / 2];
        const Pw = p.P * 1000, T = Pw / radOf(p.n), Vl = p.V[0][0], Il = p.I[0], Pin = Math.sqrt(3) * Vl * Il * p.pf, S = Math.sqrt(3) * Vl * Il;
        ro.set('poles', poles + ' poles · ' + fmt(ns, 0) + ' rpm · slip ' + fmt(100 * (ns - p.n) / ns, 1) + ' %');
        ro.set('T', fmt(T, T < 10 ? 2 : 1) + ' N·m (' + fmt(T / 1.3558, 1) + ' lbf·ft)');
        ro.set('Pin', fmt(Pin / 1000, 2) + ' kW at ' + Vl + ' V, ' + Il + ' A');
        ro.set('chk', fmt(Pin - Pw, 0) + ' W · ' + fmt(100 * Pw / Pin, 1) + ' % (plate ' + fmt(100 * p.eta, 1) + ' %)');
        ro.set('S', fmt(S / 1000, 2) + ' kVA');
        ro.set('x', p.std === 'nema' ? 'starting current ≈ ' + fmt(6.3 * p.hp * 1000 / (Math.sqrt(3) * p.V[1][0]), 0) + '–' + fmt(7.1 * p.hp * 1000 / (Math.sqrt(3) * p.V[1][0]), 0) + ' A at ' + p.V[1][0] + ' V (code ' + p.code + ')' : 'on a ' + Vl + ' V supply connect ' + (p.V[0][1] === 'Δ' ? 'delta' : 'star') + '; on ' + p.V[1][0] + ' V connect ' + (p.V[1][1] === 'Y' ? 'star' : 'delta'));
      }
      kit.click(st, pt => { const d = toDesign(st, pt, 640, 320); const hit = cells.find(cl => d.x >= cl.x && d.x <= cl.x + cl.w && d.y >= cl.y && d.y <= cl.y + cl.h); if (hit) { sel = hit.key; draw(); } },
        pt => { const d = toDesign(st, pt, 640, 320); return cells.some(cl => d.x >= cl.x && d.x <= cl.x + cl.w && d.y >= cl.y && d.y <= cl.y + cl.h); });
      st.onResize(() => draw());
      draw();
      const loop = kit.loop(() => {}, box.stage);   // static: redrawn on clicks and resizes
      return () => loop.stop();
    }
  });

  /* ================================================================ mb-insulation-life */
  const CLASS_T = { B: 130, F: 155, H: 180 }, HOT = { B: 10, F: 10, H: 15 };
  Hyper.sim('mb-insulation-life', {
    title: 'Temperature and insulation life',
    blurb: `A fan-cooled motor with class F insulation designed for an 80 K rise (or choose another class and rise). The bar stacks the ambient, the winding's average rise and the hot-spot allowance against the class limit. Life follows the 10 K rule from a reference of 20,000 hours at the class temperature — a rule of thumb for comparing conditions, not a promise. The rise here grows with the losses (29 % constant, 71 % as load squared), with dirty fins, with altitude (about 1 % per 100 m above 1000 m) and with voltage unbalance (about 2 × the square of the percentage unbalance).

**Try this**
- At 100 % load, 40 °C and clean fins the hot spot sits at 130 °C: 25 K of margin, over 100,000 hours.
- Raise the ambient to 50 °C, or clog the fins: each 10 K costs half the life. Find the load that brings the hot spot back to 130 °C.
- Add 3 % voltage unbalance: about 18 % more rise — a hidden cause of burnt motors.
- Choose a class F motor designed for the full class F rise (105 K): no margin left, and about 20,000 hours at full load.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230 });
      const [g1, g2] = graphs(box, 2);
      const p1 = kit.plot(g1, { x: { label: 'hot-spot temperature (°C)', min: 80, max: 220 }, y: { label: 'insulation life (h)', min: 100, max: 1e7, log: true }, legend: true }, 200);
      const p2 = kit.plot(g2, { x: { label: 'load (% of rated)', min: 0, max: 130 }, y: { label: 'hot spot (°C)', min: 20, max: 230 }, legend: true }, 200);
      let V = null, dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'cls', type: 'select', label: 'Insulation class', options: [['B (130 °C)', 'B'], ['F (155 °C)', 'F'], ['H (180 °C)', 'H']], value: 'F' },
        { id: 'rise', type: 'select', label: 'Designed temperature rise at full load', options: [['80 K (class B rise)', 80], ['105 K (class F rise)', 105], ['125 K (class H rise)', 125]], value: 80 },
        { id: 'x', label: 'Load', min: 0, max: 130, step: 1, value: 100, unit: '%' },
        { id: 'Ta', label: 'Ambient (cooling air)', min: -20, max: 60, step: 1, value: 40, unit: '°C' },
        { id: 'alt', label: 'Altitude', min: 0, max: 4000, step: 100, value: 0, unit: 'm' },
        { id: 'cool', type: 'select', label: 'Cooling', options: [['Clean fins, free air inlet', 1], ['Fins 30 % clogged with dust', 1.3], ['Fan cover blocked (thermal resistance × 2)', 2]], value: 1 },
        { id: 'unb', label: 'Voltage unbalance', min: 0, max: 5, step: 0.5, value: 0, unit: '%' }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['rise', 'Average winding rise'], ['hot', 'Hot spot · class limit'], ['life', 'Expected insulation life'], ['note', 'Verdict']]);
      const hotAt = x => { const f = (0.29 + 0.71 * x * x) * V.cool * (1 + Math.max(0, V.alt - 1000) / 10000) * (1 + 2 * V.unb * V.unb / 100); const rise = V.rise * f; return { rise, hot: V.Ta + rise + HOT[V.cls] }; };
      const lifeAt = (Th, cls) => 20000 * Math.pow(2, (CLASS_T[cls] - Th) / 10);
      let tick = 0;
      const loop = kit.loop(() => {
        if (!dirty && ++tick % 30 !== 0) return;
        dirty = false;
        const C = kit.colors(), r = hotAt(V.x / 100), L = lifeAt(r.hot, V.cls), Tc = CLASS_T[V.cls];
        ro.set('rise', fmt(r.rise, 1) + ' K');
        ro.set('hot', fmt(r.hot, 1) + ' °C · ' + Tc + ' °C (margin ' + fmt(Tc - r.hot, 1) + ' K)');
        ro.set('life', L > 1e6 ? 'over 1,000,000 h — other failures (bearings) come first' : fmt(L, 0) + ' h ≈ ' + fmt(L / 8760, 1) + ' years running continuously');
        ro.set('note', r.hot > Tc ? 'over the class limit: rapid ageing — thermistors should trip' : Tc - r.hot < 10 ? 'little margin' : 'healthy margin');
        const lines = ['B', 'F', 'H'].map(cl => { const pts = []; for (let T = 80; T <= 220; T += 2) pts.push([T, lifeAt(T, cl)]); return { pts, label: 'class ' + cl, width: cl === V.cls ? 3 : 1.2, dash: cl === V.cls ? null : [4, 3] }; });
        p1.set({ series: lines, marks: [{ x: clamp(r.hot, 80, 220), y: clamp(L, 100, 1e7), label: 'now' }], vlines: [{ x: Tc, label: V.cls + ' ' + Tc + ' °C' }] });
        const hp = []; for (let k = 0; k <= 130; k += 2) hp.push([k, hotAt(k / 100).hot]);
        p2.set({ series: [{ pts: hp, label: 'hot spot at these conditions' }], marks: [{ x: V.x, y: r.hot }], hlines: [{ y: Tc, label: 'class ' + V.cls + ' limit' }] });
        // the stacked bar
        const c = st.begin(); c.save(); fit(c, st, 640, 250); c.font = '12px ' + font(); c.textAlign = 'center';
        const bx = 120, bw = 90, yb = 225, sc = 190 / 240, yOf = T => yb - (T + 20) * sc;
        c.strokeStyle = C.faint; c.lineWidth = 1; for (let T = 0; T <= 220; T += 20) { c.beginPath(); c.moveTo(bx - 8, yOf(T)); c.lineTo(bx + bw + 8, yOf(T)); c.stroke(); c.fillStyle = C.muted; c.textAlign = 'right'; c.fillText(T + ' °C', bx - 12, yOf(T) + 4); }
        const seg = (t0, t1, col, lab) => { c.fillStyle = col; c.fillRect(bx, yOf(t1), bw, yOf(t0) - yOf(t1)); if (yOf(t0) - yOf(t1) > 12) { c.fillStyle = C.text; c.textAlign = 'center'; c.fillText(lab, bx + bw / 2, (yOf(t0) + yOf(t1)) / 2 + 4); } };
        seg(-20, V.Ta, 'hsl(210 60% 55% / .6)', 'ambient ' + V.Ta + ' °C');
        seg(V.Ta, V.Ta + r.rise, 'hsl(30 85% 55% / .75)', 'rise ' + fmt(r.rise, 0) + ' K');
        seg(V.Ta + r.rise, r.hot, 'hsl(0 75% 55% / .8)', 'hot spot +' + HOT[V.cls]);
        c.strokeStyle = C.bad; c.lineWidth = 2; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(bx - 20, yOf(Tc)); c.lineTo(bx + bw + 60, yOf(Tc)); c.stroke(); c.setLineDash([]);
        c.fillStyle = C.bad; c.textAlign = 'left'; c.fillText('class ' + V.cls + ': ' + Tc + ' °C', bx + bw + 14, yOf(Tc) - 6);
        c.fillStyle = C.text; c.fillText('hot spot ' + fmt(r.hot, 0) + ' °C', bx + bw + 14, yOf(r.hot) + 4);
        // life as a row of year blocks (one block = 2 years, up to 30 years)
        const yrs = L / 8760; c.fillStyle = C.muted; c.fillText('insulation life at this temperature, running continuously (a block is 2 years):', 330, 40);
        for (let k = 0; k < 15; k++) { const f = clamp(yrs / 2 - k, 0, 1); c.strokeStyle = C.faint; c.strokeRect(330 + k * 19, 52, 16, 22); if (f > 0) { c.fillStyle = r.hot > Tc ? C.bad : C.ok; c.fillRect(330 + k * 19, 52 + 22 * (1 - f), 16, 22 * f); } }
        c.fillStyle = C.text; c.font = '14px ' + font(); c.fillText(L > 1e6 ? 'more than 100 years' : fmt(yrs, 1) + ' years', 330, 100);
        c.font = '12px ' + font(); c.fillStyle = C.muted;
        c.fillText('each 10 K hotter halves it; each 10 K cooler doubles it', 330, 122);
        c.fillText('cooling: ' + (V.cool === 1 ? 'clean' : V.cool === 1.3 ? 'fins clogged (+30 % thermal resistance)' : 'fan cover blocked (× 2)'), 330, 150);
        if (V.alt > 1000) c.fillText('altitude ' + V.alt + ' m: thinner air cools less', 330, 170);
        if (V.unb > 0) c.fillText(V.unb + ' % unbalance: rise × ' + fmt(1 + 2 * V.unb * V.unb / 100, 2), 330, 190);
        c.restore();
      }, box.stage);
      loop.start();
      st.onResize(() => { dirty = true; });
    }
  });

  /* ================================================================ mb-ip-cooling */
  const IP1 = [['0', 'no protection against solids'], ['1', 'objects over 50 mm — the back of a hand'], ['2', 'over 12.5 mm — a finger'], ['3', 'over 2.5 mm — tools, thick wires'], ['4', 'over 1 mm — wires'], ['5', 'dust-protected: some dust may enter, not enough to harm'], ['6', 'dust-tight']];
  const IP2 = [['0', 'no protection against water'], ['1', 'vertically dripping water'], ['2', 'dripping water with the motor tilted up to 15°'], ['3', 'spraying water up to 60° from vertical'], ['4', 'splashing water from any direction'], ['5', 'water jets from any direction'], ['6', 'powerful water jets'], ['7', 'temporary immersion (to 1 m)'], ['8', 'continuous immersion, as agreed with the maker']];
  const IC = {
    IC411: { name: 'IC411 — fan on the shaft (TEFC)', G: n => 0.3 + 0.7 * Math.pow(Math.max(0, n), 0.8), fw: n => 70 * n * n },
    IC416: { name: 'IC416 — separately powered fan', G: () => 1, fw: n => 20 * n },
    IC410: { name: 'IC410 — no fan (TENV)', G: () => 0.55, fw: n => 20 * n },
    IC418: { name: 'IC418 — air-over, cooled by the driven fan\'s air', G: n => 0.15 + 1.0 * Math.max(0, n), fw: n => 20 * n }
  };
  Hyper.sim('mb-ip-cooling', {
    title: 'IP protection and cooling on a drive',
    blurb: `**IP code.** Pick the two digits and watch the test they stand for: probes and dust for the first, drips, sprays, jets and immersion for the second.

**Cooling on a drive.** A model 7.5 kW motor designed for an 80 K rise runs on a VFD at any speed. Its losses: iron loss falling with frequency below base speed, friction and windage, and copper and stray losses with the square of the torque (and of the current above base speed, where the field is weakened), all 5 % higher for the drive's ripple. How much heat it can shed depends on the cooling method. The first graph is the continuous torque it can give at each speed — its *loadability*; the second its winding temperature at the torque you set.

**Try this**
- IP: 5 then 6 as the first digit (dust-protected and dust-tight); 5, 6 and 7 as the second (jets, powerful jets, immersion).
- Cooling IC411 at 100 % torque: fine at 100 % speed, but at 20 % speed the fan hardly blows and the winding overheats.
- Switch to IC416 (a separate fan): full torque at any speed below base.
- IC410 (no fan): the same frame gives only about two-thirds of the torque. IC418 (air-over): excellent in the fan's air stream, useless without it.
- Above 100 % speed the drive runs out of voltage: available torque falls roughly as 1/speed.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const [g1, g2] = graphs(box, 2);
      const p1 = kit.plot(g1, { x: { label: 'speed (% of base)', min: 0, max: 150 }, y: { label: 'continuous torque (% of rated)', min: 0, max: 110 }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'speed (% of base)', min: 0, max: 150 }, y: { label: 'winding (°C)', min: 20, max: 220 }, legend: true }, 190);
      const Pfe = 160, Pc = 565, Lr = 796, Ta = 40;
      let V = null, t = 0, fanA = 0, parts = [], dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['IP code', 'ip'], ['Cooling on a drive (IC code)', 'ic']], value: 'ip' },
        { id: 'd1', type: 'select', label: 'First digit (solids)', options: IP1.map((d, k) => [d[0] + ' — ' + d[1], k]), value: 5 },
        { id: 'd2', type: 'select', label: 'Second digit (water)', options: IP2.map((d, k) => [d[0] + ' — ' + d[1], k]), value: 5 },
        { id: 'ic', type: 'select', label: 'Cooling method', options: Object.entries(IC).map(([k, v]) => [v.name, k]), value: 'IC411' },
        { id: 'n', label: 'Speed', min: 5, max: 150, step: 1, value: 100, unit: '% of base' },
        { id: 'tq', label: 'Load torque', min: 0, max: 110, step: 1, value: 100, unit: '% of rated' }
      ], id => { if (id === 'mode') show(); parts = []; dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['code', 'Code'], ['m1', 'Meaning'], ['m2', ''], ['use', 'Typical use']]);
      function show() { const ip = V.mode === 'ip'; ctl.show('d1', ip); ctl.show('d2', ip); ctl.show('ic', !ip); ctl.show('n', !ip); ctl.show('tq', !ip); }
      show();
      const losses = (method, n, tq) => { const m = IC[method], fe = Pfe * Math.pow(Math.min(n, 1), 1.5), cur = tq * Math.max(1, n); return 1.05 * (fe + m.fw(n) + Pc * cur * cur); };
      const riseOf = (method, n, tq) => 80 * losses(method, n, tq) / (IC[method].G(n) * Lr);
      const allowed = (method, n) => { const m = IC[method], room = m.G(n) * Lr / 1.05 - Pfe * Math.pow(Math.min(n, 1), 1.5) - m.fw(n); const tq = room > 0 ? Math.sqrt(room / Pc) / Math.max(1, n) : 0; return Math.min(tq, n > 1 ? 1 / n : 1); };
      const useOf = code => { const a = +code[2], b = +code[3]; if (a >= 6 && b >= 7) return 'submersible pumps, flood-prone pits'; if (a >= 6 || b >= 6) return 'washdown, dusty and outdoor sites (food, mining)'; if (a >= 5 && b >= 5) return 'standard industrial TEFC motors (IP55)'; if (a >= 5 || b >= 4) return 'enclosed motors in workshops'; if (b <= 3 && a <= 2) return 'open drip-proof motors in clean, dry rooms (IP23)'; return 'light protection only'; };
      const loop = kit.loop(dt => {
        t += dt;
        const c = st.begin(), C = kit.colors(); c.save(); fit(c, st, 680, 280); c.font = '12px ' + font(); c.textAlign = 'center';
        // the motor (side view)
        const mx = 150, my = 150, mw = 220, mh = 110;
        const drawMotor = (heat) => {
          c.fillStyle = heat == null ? C.surface2 : 'hsl(' + (210 - 200 * clamp(heat, 0, 1)) + ' 70% 50% / .55)'; c.strokeStyle = C.text; c.lineWidth = 2;
          c.fillRect(mx, my - mh / 2, mw, mh); c.strokeRect(mx, my - mh / 2, mw, mh);
          c.strokeStyle = C.faint; c.lineWidth = 1; for (let x = mx + 10; x < mx + mw - 5; x += 9) { c.beginPath(); c.moveTo(x, my - mh / 2 + 3); c.lineTo(x, my + mh / 2 - 3); c.stroke(); }
          c.fillStyle = C.muted; c.fillRect(mx - 40, my - mh / 2 + 8, 40, mh - 16);   // fan cover
          c.fillStyle = C.text; c.fillRect(mx + mw, my - 6, 50, 12);                     // shaft
          c.fillStyle = C.surface; c.strokeStyle = C.text; c.fillRect(mx + 70, my - mh / 2 - 26, 70, 26); c.strokeRect(mx + 70, my - mh / 2 - 26, 70, 26);   // terminal box
        };
        if (V.mode === 'ip') {
          drawMotor(null);
          const a = V.d1, b = V.d2, code = 'IP' + a + b;
          // solids test
          c.textAlign = 'left'; c.fillStyle = C.text; c.font = 'bold 22px ' + font(); c.fillText(code, 470, 60); c.font = '12px ' + font();
          if (a >= 1 && a <= 4) { const sizes = [0, 50, 12.5, 2.5, 1], r = Math.max(1.5, sizes[a] * 0.6), px = mx - 70 + 20 * Math.sin(t * 2); c.fillStyle = C.warn; if (a === 1) { c.beginPath(); c.arc(px, my + 20, r, 0, TAU); c.fill(); } else { c.fillRect(px - 50, my + 20 - r / 2, 50, Math.max(2, r)); } c.fillStyle = C.muted; c.fillText('probe ' + sizes[a] + ' mm kept out', px - 70, my + 60); }
          if (a >= 5) { for (let k = 0; k < 40; k++) { const px = mx - 30 + ((k * 37 + t * 40) % 300), py = my - 70 + ((k * 53) % 140); c.fillStyle = 'hsl(35 30% 55% / .6)'; c.beginPath(); c.arc(px, py, 1.6, 0, TAU); c.fill(); } c.fillStyle = C.muted; c.fillText(a === 5 ? 'dust: a little may enter, harmlessly' : 'dust: none enters', mx, my + 95); }
          // water test
          c.fillStyle = 'hsl(205 80% 55% / .8)'; c.strokeStyle = 'hsl(205 80% 55% / .8)';
          if (b >= 1 && b <= 4) { const n = 18; for (let k = 0; k < n; k++) { const ang = b === 1 ? 0 : b === 2 ? 0.26 : b === 3 ? (k % 5 - 2) * 0.5 : (k / n) * TAU; const ph = ((t * 1.2 + k / n) % 1); const x0 = mx + mw / 2 + (b === 4 ? 0 : (k - n / 2) * 12), y0 = b === 4 ? my : my - 130; const x = b === 4 ? x0 + Math.cos(ang) * (60 + 90 * ph) : x0 + Math.sin(ang) * 90 * ph, y = b === 4 ? y0 + Math.sin(ang) * (60 + 90 * ph) : y0 + Math.cos(ang) * 90 * ph; c.beginPath(); c.arc(x, y, 2.2, 0, TAU); c.fill(); } }
          if (b === 5 || b === 6) { const w0 = b === 5 ? 3 : 7; c.lineWidth = w0; for (let k = 0; k < 6; k++) { const ph = ((t * 2 + k / 6) % 1); c.beginPath(); c.moveTo(mx + mw + 150 - 140 * ph, my - 90 + 60 * ph); c.lineTo(mx + mw + 150 - 140 * ph - 14, my - 90 + 60 * ph + 6); c.stroke(); } c.fillStyle = C.muted; c.textAlign = 'center'; c.fillText(b === 5 ? 'nozzle 6.3 mm' : 'nozzle 12.5 mm', mx + mw + 150, my - 100); }
          if (b >= 7) { c.fillStyle = 'hsl(205 80% 55% / .25)'; c.fillRect(mx - 60, my - mh / 2 - (b === 8 ? 60 : 36), mw + 130, mh + (b === 8 ? 100 : 70)); c.fillStyle = C.muted; c.textAlign = 'center'; c.fillText(b === 7 ? 'under water, up to 1 m, 30 min' : 'under water continuously (conditions by agreement)', mx + mw / 2, my + mh / 2 + 34); }
          c.textAlign = 'left'; c.fillStyle = C.text;
          c.fillText(a + ': ' + IP1[a][1], 470, 90); c.fillText(b + ': ' + IP2[b][1].slice(0, 36), 470, 112); if (IP2[b][1].length > 36) c.fillText('   ' + IP2[b][1].slice(36), 470, 128);
          c.fillStyle = C.muted; c.fillText('IP says nothing about corrosion, UV,', 470, 170); c.fillText('chemicals or explosive atmospheres.', 470, 186);
          ro.set('code', code); ro.set('m1', a + ' — ' + IP1[a][1]); ro.set('m2', b + ' — ' + IP2[b][1]); ro.set('use', useOf(code));
        } else {
          const n = V.n / 100, tq = V.tq / 100, m = IC[V.ic], rise = riseOf(V.ic, n, tq), Tw = Ta + rise, avail = allowed(V.ic, n);
          drawMotor(rise / 120);
          // fan and air
          const fanSpeed = V.ic === 'IC416' ? 1 : V.ic === 'IC410' ? 0 : n;
          fanA += dt * 12 * fanSpeed;
          if (V.ic !== 'IC410' && V.ic !== 'IC418') { c.save(); c.translate(mx - 20, my); c.strokeStyle = C.text; c.lineWidth = 2; for (let k = 0; k < 4; k++) { const aa = fanA + k * Math.PI / 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 40 * Math.sin(aa)); c.stroke(); } c.restore(); }
          if (V.ic === 'IC416') { c.fillStyle = C.surface; c.strokeStyle = C.text; c.fillRect(mx - 80, my - 22, 36, 44); c.strokeRect(mx - 80, my - 22, 36, 44); c.fillStyle = C.muted; c.fillText('fan motor', mx - 62, my + 38); }
          const flow = V.ic === 'IC410' ? 0 : V.ic === 'IC418' ? n * 1.2 : V.ic === 'IC416' ? 1 : n;
          if (flow > 0.02) { c.strokeStyle = 'hsl(200 70% 60% / .8)'; c.lineWidth = 2; for (let k = 0; k < 4; k++) { const ph = (t * 1.5 * flow + k / 4) % 1, x = mx + ph * mw, len = 30 * clamp(flow, 0.1, 1.3); kit.arrow(c, x, my - mh / 2 - 8 - (k % 2) * 6, x + len, my - mh / 2 - 8 - (k % 2) * 6, 'hsl(200 70% 60% / .8)', 2); kit.arrow(c, x, my + mh / 2 + 8 + (k % 2) * 6, x + len, my + mh / 2 + 8 + (k % 2) * 6, 'hsl(200 70% 60% / .8)', 2); } }
          if (V.ic === 'IC418') { c.fillStyle = C.muted; c.fillText('air from the driven fan', mx + mw / 2, my + mh / 2 + 40); }
          c.textAlign = 'left'; c.fillStyle = C.text; c.font = '13px ' + font();
          c.fillText(m.name, 440, 50);
          c.font = '12px ' + font(); c.fillStyle = Tw > 145 ? C.bad : Tw > 120.5 ? C.warn : C.ok;
          c.fillText('winding ' + fmt(Tw, 0) + ' °C (rise ' + fmt(rise, 0) + ' K; design 80 K)', 440, 76);
          c.fillStyle = C.text; c.fillText('continuous torque available here: ' + fmt(100 * avail, 0) + ' %', 440, 100);
          c.fillStyle = C.muted; c.fillText('losses ' + fmt(losses(V.ic, n, tq), 0) + ' W, cooling ' + fmt(100 * m.G(n), 0) + ' % of the', 440, 124); c.fillText('shaft fan\'s at base speed', 440, 140);
          ro.set('code', V.ic); ro.set('m1', 'at ' + V.n + ' % speed and ' + V.tq + ' % torque: winding ' + fmt(Tw, 0) + ' °C'); ro.set('m2', 'continuous torque available: ' + fmt(100 * avail, 0) + ' %'); ro.set('use', Tw > 120.5 ? 'too hot for this duty: derate, or use forced cooling (IC416)' : 'within the design rise');
          if (dirty) {
            dirty = false;
            const curves = Object.keys(IC).map(k => { const pts = []; for (let s = 2; s <= 150; s += 2) pts.push([s, 100 * allowed(k, s / 100)]); return { pts, label: k, width: k === V.ic ? 3 : 1.2, dash: k === V.ic ? null : [4, 3] }; });
            p1.set({ series: curves, marks: [{ x: V.n, y: V.tq, label: 'your load' }] });
            const tp = []; for (let s = 2; s <= 150; s += 2) tp.push([s, Math.min(230, Ta + riseOf(V.ic, s / 100, tq))]);
            p2.set({ series: [{ pts: tp, label: V.ic + ' at ' + V.tq + ' % torque' }], marks: [{ x: V.n, y: Math.min(230, Tw) }], hlines: [{ y: 120, label: 'design 120 °C' }, { y: 145, label: 'class F limit' }] });
          }
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mb-ie-classes */
  const IE1_TABLE = [72.1, 75.0, 77.2, 79.7, 81.5, 83.1, 84.7, 86.0, 87.6, 88.7, 89.3, 89.9, 90.7, 91.2, 91.7, 92.1, 92.7, 93.0, 93.3];
  Hyper.sim('mb-ie-classes', {
    title: 'Efficiency classes and the cost of losses',
    blurb: `The minimum full-load efficiencies of 4-pole, 50 Hz motors in classes IE1 to IE4 (IEC 60034-30-1, rounded), with IE5 drawn by its definition as about 20 % lower losses than IE4. Choose your motor's power, class, load, hours and electricity price (in any currency): the bars show what its losses cost a year in each class, and the lower graph adds up the cost of an upgrade over the years — where the lines cross, it has paid for itself.

**Try this**
- 7.5 kW, 6000 h a year: going from IE2 to IE3 saves roughly 700 kWh a year; the upgrade pays back in a year or two.
- Now 500 h a year: the same upgrade takes many years — the saving is proportional to running time.
- Look along the efficiency curves: the gap between classes is widest for small motors (in points of efficiency) but the energy at stake is largest for big ones.
- 75 kW at 8000 h: every class step is worth a great deal every year.`,
    mount(box, kit) {
      const M = kit.motor, KW = M.IE.kW;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 210 });
      const [g1, g2] = graphs(box, 2);
      const p1 = kit.plot(g1, { x: { label: 'rated power (kW)', min: 0.75, max: 110, log: true }, y: { label: 'minimum efficiency (%)', min: 70, max: 100 }, legend: true }, 200);
      const p2 = kit.plot(g2, { x: { label: 'years', min: 0, max: 10 }, y: { label: 'cost (your currency)', min: 0 }, legend: true }, 200);
      const effOf = (cls, i) => cls === 'IE1' ? IE1_TABLE[i] : cls === 'IE5' ? 100 - 0.8 * (100 - M.IE.IE4[i]) : M.IE[cls][i];
      let V = null, dirty = true, tick = 0;
      const ctl = kit.controls(box.side, [
        { id: 'k', type: 'select', label: 'Rated power (4-pole)', options: KW.map((k, i) => [k + ' kW', i]), value: 7 },
        { id: 'cls', type: 'select', label: 'Your motor now', options: [['IE1', 'IE1'], ['IE2', 'IE2'], ['IE3', 'IE3'], ['IE4', 'IE4']], value: 'IE2' },
        { id: 'up', type: 'select', label: 'Upgrade to', options: [['IE3', 'IE3'], ['IE4', 'IE4'], ['IE5', 'IE5']], value: 'IE3' },
        { id: 'x', label: 'Average load', min: 25, max: 100, step: 5, value: 75, unit: '%' },
        { id: 'h', label: 'Running hours a year', min: 100, max: 8760, step: 100, value: 6000, unit: 'h' },
        { id: 'c', label: 'Electricity price per kWh', min: 0.03, max: 0.5, step: 0.01, value: 0.15 },
        { id: 'dp', label: 'Extra price of the upgrade', min: 0, max: 5000, step: 10, value: 150 }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['eta', 'Efficiency now → upgraded (at your load)'], ['loss', 'Losses now → upgraded'], ['save', 'Energy and money saved a year'], ['pb', 'Simple payback']]);
      const loop = kit.loop(() => {
        if (!dirty && ++tick % 30 !== 0) return;
        dirty = false;
        const C = kit.colors(), i = V.k, Pn = KW[i] * 1000, x = V.x / 100, Pout = x * Pn;
        const yearly = cls => { const e = etaPart(effOf(cls, i) / 100, x); const lossW = Pout * (1 / e - 1); return { e, lossW, kWh: lossW * V.h / 1000, cost: lossW * V.h / 1000 * V.c }; };
        const now = yearly(V.cls), up = yearly(V.up), dE = now.kWh - up.kWh, dC = dE * V.c;
        ro.set('eta', fmt(100 * now.e, 1) + ' % → ' + fmt(100 * up.e, 1) + ' %');
        ro.set('loss', fmt(now.lossW, 0) + ' W → ' + fmt(up.lossW, 0) + ' W');
        ro.set('save', fmt(dE, 0) + ' kWh · ' + fmt(dC, 0) + ' a year');
        ro.set('pb', dC > 0 ? fmt(V.dp / dC, 1) + ' years' : 'no saving');
        const series = ['IE1', 'IE2', 'IE3', 'IE4', 'IE5'].map(cl => ({ pts: KW.map((k, j) => [k, effOf(cl, j)]), label: cl, width: cl === V.cls || cl === V.up ? 3 : 1.2, dash: cl === 'IE5' ? [5, 4] : null }));
        p1.set({ series, marks: [{ x: KW[i], y: effOf(V.cls, i), label: V.cls }, { x: KW[i], y: effOf(V.up, i), label: V.up, color: C.ok }] });
        const yrs = [0, 10], lineNow = yrs.map(y => [y, now.cost * y]), lineUp = yrs.map(y => [y, V.dp + up.cost * y]);
        p2.set({ series: [{ pts: lineNow, label: 'keep ' + V.cls + ': cost of losses' }, { pts: lineUp, label: V.up + ': extra price + losses', color: C.ok }], vlines: dC > 0 && V.dp / dC < 10 ? [{ x: V.dp / dC, label: 'payback' }] : [] });
        // bars: yearly cost of losses per class
        const c = st.begin(); c.save(); fit(c, st, 640, 230); c.font = '12px ' + font(); c.textAlign = 'center';
        const cls = ['IE1', 'IE2', 'IE3', 'IE4', 'IE5'], ys = cls.map(yearly), mx = Math.max(...ys.map(q => q.cost), 1e-9);
        c.fillStyle = C.muted; c.fillText('yearly cost of the losses of a ' + KW[i] + ' kW motor at ' + V.x + ' % load, ' + V.h + ' h a year', 320, 20);
        cls.forEach((cl, k) => {
          const x0 = 70 + k * 105, h = 140 * ys[k].cost / mx;
          c.fillStyle = cl === V.cls ? C.warn : cl === V.up ? C.ok : C.faint; c.fillRect(x0, 190 - h, 70, h);
          c.fillStyle = C.text; c.fillText(cl, x0 + 35, 206); c.fillText(fmt(ys[k].cost, 0), x0 + 35, 184 - h);
          c.fillStyle = C.muted; c.fillText(fmt(ys[k].kWh, 0) + ' kWh', x0 + 35, 222);
        });
        c.restore();
      }, box.stage);
      loop.start();
      st.onResize(() => { dirty = true; });
    }
  });

  /* ================================================================ mb-frames */
  // IEC 60072-1 frame data used here: shaft height H, shaft D × E, B5 flange (FF), B14 flange (FT, small frames), foot holes A × B (mm)
  const IECF = {
    '71': [71, 14, 30, 130, 85, 112, 90], '80': [80, 19, 40, 165, 100, 125, 100], '90S': [90, 24, 50, 165, 115, 140, 100], '90L': [90, 24, 50, 165, 115, 140, 125],
    '100L': [100, 28, 60, 215, 130, 160, 140], '112M': [112, 28, 60, 215, 130, 190, 140], '132S': [132, 38, 80, 265, 165, 216, 140], '132M': [132, 38, 80, 265, 165, 216, 178],
    '160M': [160, 42, 110, 300, 0, 254, 210], '160L': [160, 42, 110, 300, 0, 254, 254], '180M': [180, 48, 110, 300, 0, 279, 241], '180L': [180, 48, 110, 300, 0, 279, 279],
    '200L': [200, 55, 110, 350, 0, 318, 305], '225S': [225, 60, 140, 400, 0, 356, 286], '225M': [225, 60, 140, 400, 0, 356, 311], '250M': [250, 65, 140, 500, 0, 406, 349],
    '280S': [280, 75, 140, 500, 0, 457, 368], '280M': [280, 75, 140, 500, 0, 457, 419]
  };
  // NEMA: hp → 1800 rpm TEFC T-frame; frame → [shaft height in, shaft diameter in]
  const NEMA_HP = [[0.5, '56'], [0.75, '56'], [1, '143T'], [1.5, '145T'], [2, '145T'], [3, '182T'], [5, '184T'], [7.5, '213T'], [10, '215T'], [15, '254T'], [20, '256T'], [25, '284T'], [30, '286T'], [40, '324T'], [50, '326T'], [60, '364T'], [75, '365T'], [100, '405T'], [125, '444T']];
  const NEMA_F = { '56': [3.5, 0.625], '143T': [3.5, 0.875], '145T': [3.5, 0.875], '182T': [4.5, 1.125], '184T': [4.5, 1.125], '213T': [5.25, 1.375], '215T': [5.25, 1.375], '254T': [6.25, 1.625], '256T': [6.25, 1.625], '284T': [7, 1.875], '286T': [7, 1.875], '324T': [8, 2.125], '326T': [8, 2.125], '364T': [9, 2.375], '365T': [9, 2.375], '405T': [10, 2.875], '444T': [11, 3.375] };
  const KW_HP = { 0.37: 0.5, 0.55: 0.75, 0.75: 1, 1.1: 1.5, 1.5: 2, 2.2: 3, 3: 5, 4: 5, 5.5: 7.5, 7.5: 10, 11: 15, 15: 20, 18.5: 25, 22: 30, 30: 40, 37: 50, 45: 60, 55: 75, 75: 100, 90: 125 };
  Hyper.sim('mb-frames', {
    title: 'IEC and NEMA frames side by side',
    blurb: `Pick a power and a mounting: the IEC frame that usually carries it (4-pole, 50 Hz) is drawn to scale beside the NEMA T-frame of the matching horsepower (4-pole, 60 Hz, TEFC). The standard dimensions — shaft height, shaft, feet, flange — are exact; the body outline is only indicative, since the standards leave it to the maker.

**Try this**
- 7.5 kW: an IEC 132M against a NEMA 215T — almost the same shaft height (132 against 133.4 mm) but a 38 mm shaft against 1⅜ in (34.9 mm).
- Step through the powers: the IEC frame number is the shaft height in millimetres; for NEMA, the first two digits over four give inches.
- Change the mounting from B3 (feet) to B5 (flange), B14 (face flange, small frames only), B35 (both) and V1 (vertical, shaft down).`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      let V = null, dirty = true, tick = 0;
      const powers = Object.keys(KW_HP).map(Number).sort((a, b) => a - b);
      const ctl = kit.controls(box.side, [
        { id: 'P', type: 'select', label: 'Motor power (4-pole)', options: powers.map(p => [p + ' kW (≈ ' + KW_HP[p] + ' hp)', p]), value: 7.5 },
        { id: 'im', type: 'select', label: 'Mounting (IM)', options: [['B3 — feet', 'B3'], ['B5 — flange with through-holes', 'B5'], ['B14 — face flange, tapped holes', 'B14'], ['B35 — feet and flange', 'B35'], ['V1 — flange, shaft down', 'V1']], value: 'B3' },
        { id: 'nema', type: 'check', label: 'Show the NEMA equivalent', value: true }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'IEC frame'], ['sh', 'Shaft D × E'], ['fl', 'Flange · feet A × B'], ['n', 'NEMA frame'], ['ns', 'NEMA shaft height · shaft'], ['cmp', 'Compared']]);
      const frameFor = kW => { const e = M.IEC_FRAMES.find(q => q[1] >= kW - 1e-9); return e ? e[0] : '280M'; };
      // draw one motor, side view, in mm × s, with the shaft axis at height H above the base line yb, shaft end at x0
      function motor(c, C, x0, yb, s, H, D, E, im, label, dashed, flangeD) {
        const R = 0.95 * H, Lb = 2.9 * H + 60, bodyTop = yb - (H + R) * s, axis = yb - H * s;
        c.save(); if (dashed) c.setLineDash([5, 4]);
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.fillStyle = dashed ? 'transparent' : C.surface2;
        const bx = x0 - E * s - Lb * s;
        c.fillRect(bx, bodyTop, Lb * s, 2 * R * s); c.strokeRect(bx, bodyTop, Lb * s, 2 * R * s);
        c.strokeStyle = C.faint; c.lineWidth = 1; for (let x = bx + 6; x < bx + Lb * s * 0.85; x += 6) { c.beginPath(); c.moveTo(x, bodyTop + 3); c.lineTo(x, bodyTop + 2 * R * s - 3); c.stroke(); }
        c.strokeStyle = C.text; c.lineWidth = 1.8;
        c.fillStyle = C.muted; c.fillRect(bx - 0.25 * H * s, axis - 0.8 * R * s, 0.25 * H * s, 1.6 * R * s);        // fan cover
        c.fillStyle = C.text; c.fillRect(x0 - E * s, axis - D / 2 * s, E * s, Math.max(1.5, D * s));                // shaft
        if (im === 'B3' || im === 'B35') { const fw = Math.min(Lb * 0.7, 1.6 * H); c.fillStyle = C.muted; c.fillRect(bx + (Lb - fw) / 2 * s, yb - 0.12 * H * s, fw * s, 0.12 * H * s); c.fillRect(bx + (Lb - fw) / 2 * s + fw * s * 0.1, bodyTop + 2 * R * s, fw * s * 0.8, yb - 0.12 * H * s - bodyTop - 2 * R * s); }
        if (im === 'B5' || im === 'B35' || im === 'B14') { const fd = flangeD * (im === 'B14' ? 1.15 : 1.2); c.fillStyle = C.muted; c.fillRect(x0 - E * s - 0.08 * H * s, axis - fd / 2 * s, 0.08 * H * s, fd * s); }
        // shaft-height dimension
        c.strokeStyle = C.accent; c.lineWidth = 1; c.beginPath(); c.moveTo(x0 + 12, yb); c.lineTo(x0 + 12, axis); c.stroke();
        kit.arrow(c, x0 + 12, yb - 6, x0 + 12, yb, C.accent, 1); kit.arrow(c, x0 + 12, axis + 6, x0 + 12, axis, C.accent, 1);
        c.setLineDash([]); c.fillStyle = C.text; c.textAlign = 'left'; c.fillText(label, bx, bodyTop - 8);
        c.restore();
      }
      const loop = kit.loop(() => {
        if (!dirty && ++tick % 30 !== 0) return;
        dirty = false;
        const C = kit.colors(), P = V.P, fr = frameFor(P), d = IECF[fr] || IECF['280M'], [H, D, E, FF, FT, A, B] = d;
        const hp = KW_HP[P], nf = (NEMA_HP.find(q => q[0] >= hp) || NEMA_HP[NEMA_HP.length - 1])[1], [nh, nd] = NEMA_F[nf];
        const im = V.im === 'B14' && !FT ? 'B5' : V.im, flange = im === 'B14' ? FT : FF;
        ro.set('f', fr + ' (shaft height ' + H + ' mm)');
        ro.set('sh', D + ' × ' + E + ' mm');
        ro.set('fl', (im === 'B3' ? '—' : im === 'B14' ? 'FT' + FT : 'FF' + FF) + ' · ' + A + ' × ' + B + ' mm' + (V.im === 'B14' && !FT ? ' (B14 is not usual above frame 132: shown as B5)' : ''));
        ro.set('n', nf + ' for ' + hp + ' hp');
        ro.set('ns', nh + ' in = ' + fmt(nh * 25.4, 1) + ' mm · Ø ' + nd + ' in = ' + fmt(nd * 25.4, 1) + ' mm');
        ro.set('cmp', 'height ' + (nh * 25.4 > H ? '+' : '') + fmt(nh * 25.4 - H, 1) + ' mm, shaft ' + (nd * 25.4 > D ? '+' : '') + fmt(nd * 25.4 - D, 1) + ' mm: not a drop-in swap');
        const c = st.begin(); c.save(); fit(c, st, 680, 330); c.font = '12px ' + font();
        const Hmax = Math.max(H, nh * 25.4), s = Math.min(150 / (2.1 * Hmax), 290 / (3.4 * Hmax + 200));
        const yb = 300;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(10, yb); c.lineTo(670, yb); c.stroke();
        if (V.im === 'V1') {
          // vertical: rotate the IEC motor so the shaft points down onto a flange plate
          c.save(); c.translate(200, 40); c.rotate(Math.PI / 2); motor(c, C, 250, 120, s, H, D, E, 'B5', 'IEC ' + fr + ' V1', false, FF); c.restore();
          c.fillStyle = C.muted; c.textAlign = 'center'; c.fillText('vertical, shaft down, carried by its flange', 200, 318);
        } else motor(c, C, 300, yb, s, H, D, E, im, 'IEC ' + fr + ' ' + im, false, flange);
        if (V.nema) { const nh_mm = nh * 25.4, nd_mm = nd * 25.4, ns = nf === '56' ? 47.6 : 63.5 + 25 * (nh - 3.5); motor(c, C, 640, yb, s, nh_mm, nd_mm, ns, V.im === 'B5' || V.im === 'B14' ? (V.im === 'B5' ? 'B5' : 'B14') : 'B3', 'NEMA ' + nf + (V.im === 'B14' ? 'C' : V.im === 'B5' ? ' D-flange' : ''), true, 1.7 * nh_mm); }
        // a 100 mm scale bar
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(20, 20); c.lineTo(20 + 100 * s, 20); c.stroke(); c.fillStyle = C.muted; c.textAlign = 'left'; c.fillText('100 mm', 24 + 100 * s, 24);
        c.fillText('outlines indicative; H, shafts, feet and flanges to scale', 20, 42);
        c.restore();
      }, box.stage);
      loop.start();
      st.onResize(() => { dirty = true; });
    }
  });
})();
