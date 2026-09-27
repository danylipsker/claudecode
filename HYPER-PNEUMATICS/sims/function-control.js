/* HYPER-PNEUMATICS · sims/function-control.js — function valves and basic control circuits.
 *   fv-direct   direct and indirect control of a single-acting cylinder, side by side
 *   fv-meter    meter-out against meter-in on a double-acting cylinder with a load
 *   fv-qev      a quick-exhaust valve: stroke times with and without, long tubes
 *   fv-logic    logic with air: OR, AND (valve and series), NOT, INHIBIT, with a live truth table
 *   fv-delay    a time-delay valve: throttle, reservoir and 3/2 pilot valve (on- and off-delay)
 *   fv-memory   memory with a 5/2 impulse valve: set, reset, both pressed, air failure
 *   fv-pseq     pressure-dependent control: a sequence valve returns a clamp when its force is reached
 *
 * The cylinders follow the pattern of kit.fluid.pneuCylinder (adiabatic chamber balance, ISO 6358 flow
 * through kit.fluid.iso6358), generalised here so that each port can be wired to its own path
 * (meter-in, quick-exhaust valves, single-acting with a spring) and with breakaway (static) friction
 * above sliding friction. Also defined here: a quick-exhaust valve symbol (1 in, 2 up, 3 out with the
 * disc shown), an air-reservoir symbol and a sonic conductance for plastic tubing.
 */
(function () {
  'use strict';
  const PATM = 1.013e5, RG = 287.058, TREF = 293.15, PREF = 1e5, BCRIT = 0.3;
  let FL = null;                                   // kit.fluid, set by every mount

  /* ---------------------------------------------------------------- flow and models */
  // signed mass flow (kg/s) through sonic conductance C (m³/(s·Pa)) from pressure pFrom to pTo (absolute), ISO 6358
  function mflow(C, pFrom, pTo, b) {
    if (!(C > 0)) return 0;
    const bb = b == null ? BCRIT : b;
    if (pFrom >= pTo) return FL.iso6358({ C, b: bb, p1: pFrom, p2: pTo }).mdot;
    return -FL.iso6358({ C, b: bb, p1: pTo, p2: pFrom }).mdot;
  }
  // restrictions in series: 1/C² add
  function ser() {
    let s = 0;
    for (let i = 0; i < arguments.length; i++) { const c = arguments[i]; if (!(c > 0)) return 0; s += 1 / (c * c); }
    return 1 / Math.sqrt(s);
  }
  // a plastic tube of bore d and length L (m): the sonic limit of its bore in series with isothermal pipe
  // friction (Darcy f ≈ 0.025), as a sonic conductance, m³/(s·Pa)
  function tubeC(d, L) {
    const A = Math.PI * d * d / 4, Cn = 1.99e-3 * A;
    if (!(L > 0)) return Cn;
    return ser(Cn, A * Math.sqrt(d / (0.025 * L * RG * TREF)) / 1.185);
  }
  // a cylinder whose ports are wired by the caller: step(dt, flows) with flows(state) -> [mA, mB] kg/s into
  // the chambers. Breakaway friction fsr × fc must be beaten from rest; a single-acting cylinder has its rod
  // side open to the room and a return spring k0 + k1·x.
  function cylModel(o) {
    const P = Object.assign({ bore: 0.032, rod: 0.012, stroke: 0.1, mass: 1, load: 0, deadA: 5e-6, deadB: 5e-6, fc: 15, fsr: 1.3, fv: 30,
      T: TREF, g: 1.4, single: false, k0: 0, k1: 0, fcAt: null }, o || {});
    const AA = Math.PI * P.bore * P.bore / 4, AB = AA - Math.PI * P.rod * P.rod / 4;
    const s = { x: 0, v: 0, pA: PATM, pB: PATM, t: 0, mA: 0, mB: 0 };
    function step(dt, flows) {
      if (!(dt > 0)) return s;
      const sub = Math.max(1, Math.ceil(dt / 2e-5)), h = dt / sub, g = P.g, RT = RG * P.T;
      for (let k = 0; k < sub; k++) {
        const m = flows(s), mA = m[0] || 0, mB = P.single ? 0 : (m[1] || 0);
        s.mA = mA; s.mB = mB;
        const VA = P.deadA + AA * s.x, VB = P.deadB + AB * (P.stroke - s.x);
        const pB = P.single ? PATM : s.pB;
        const load = typeof P.load === 'function' ? P.load(s.x) : P.load;
        const fc = P.fcAt ? P.fcAt(s.x) : P.fc, fs = fc * P.fsr;
        const Fp = s.pA * AA - pB * AB - PATM * (AA - AB) - load - (P.single ? P.k0 + P.k1 * s.x : 0);
        if (s.v === 0) {
          // at rest: it breaks away only when the force beats the static friction (and not into an end stop)
          if (Math.abs(Fp) > fs && !(s.x <= 0 && Fp < 0) && !(s.x >= P.stroke && Fp > 0)) s.v = (Fp - Math.sign(Fp) * fc) / P.mass * h;
        } else {
          const a = (Fp - Math.sign(s.v) * fc - P.fv * s.v) / P.mass, v2 = s.v + a * h;
          s.v = v2 * s.v < 0 ? 0 : v2;             // it sticks when the velocity would reverse
        }
        s.x += s.v * h;
        if (s.x <= 0) { s.x = 0; if (s.v < 0) s.v = 0; }
        if (s.x >= P.stroke) { s.x = P.stroke; if (s.v > 0) s.v = 0; }
        s.pA = Math.max(1000, s.pA + h * (g * RT * mA - g * s.pA * AA * s.v) / VA);
        if (!P.single) s.pB = Math.max(1000, s.pB + h * (g * RT * mB + g * s.pB * AB * s.v) / VB);
        s.t += h;
      }
      return s;
    }
    return { P, s, AA, AB, step };
  }
  const toward = (cur, target, dt, T) => { const d = target - cur, m = dt / T; return Math.abs(d) <= m ? target : cur + Math.sign(d) * m; };
  const lag = (cur, target, dt, tau) => cur + (target - cur) * (1 - Math.exp(-dt / tau));

  /* ---------------------------------------------------------------- drawing helpers */
  function frameOf(st, W, H) { const k = Math.min(st.W / W, st.H / H); return { k, ox: (st.W - W * k) / 2, oy: (st.H - H * k) / 2 }; }
  function graphs(box, n) {
    const g = document.createElement('div');
    g.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:' + (n > 1 ? '1fr 1fr' : '1fr') + ';gap:8px';
    box.stage.appendChild(g);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); g.appendChild(d); out.push(d); }
    return out;
  }
  // push buttons held with the pointer: zones in design coordinates, { x0, y0, x1, y1, on }
  function holdPads(st, getFrame, zones, onPress) {
    const cv = st.canvas;
    const hits = e => {
      const f = getFrame(), p = st.pos(e), x = (p.x - f.ox) / f.k, y = (p.y - f.oy) / f.k;
      return zones.filter(z => x >= z.x0 && x <= z.x1 && y >= z.y0 && y <= z.y1);
    };
    cv.addEventListener('pointerdown', e => {
      const h = hits(e);
      if (!h.length) return;
      h.forEach(z => { z.on = true; });
      if (onPress) onPress(h);
      try { cv.setPointerCapture(e.pointerId); } catch (err) { /* not captured */ }
      e.preventDefault();
    });
    const up = () => zones.forEach(z => { z.on = false; });
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
    cv.addEventListener('pointermove', e => { cv.style.cursor = hits(e).length ? 'pointer' : ''; });
  }
  // a cylinder chamber shaded by its gauge pressure (as in the reference simulation)
  const shade = (C, pg, pmax) => pg > 0.2e5 ? (C.dark ? 'rgba(79,141,255,' : 'rgba(29,78,216,') + Math.min(0.5, 0.08 + 0.42 * pg / Math.max(pmax, 1e4)) + ')' : null;
  const airState = (pg, venting) => pg > 0.15e5 ? (venting ? 'exhaust' : 'air') : 'idle';
  const sigState = (pg, venting) => pg > 0.15e5 ? (venting ? 'exhaust' : 'pilot') : 'idle';
  function sigLine(S, c, pts, pg, venting) { S.line(c, pts, { state: sigState(pg, venting), kind: 'pilot' }); }
  // moving dots on a path, advanced by a flow relative to a reference flow
  function dots(S, c, ph, key, pts, q, qref, dt, color) {
    if (!(Math.abs(q) > qref * 0.01)) return;
    ph[key] = (ph[key] || 0) + dt * 70 * Math.min(3, Math.abs(q) / qref);
    S.flow(c, q > 0 ? pts : pts.slice().reverse(), ph[key], { color });
  }
  // quick-exhaust valve: inlet 1 on the left, outlet 2 on top, exhaust 3 to the right; the ball closes the
  // exhaust while air flows 1 → 2, and the inlet while the cylinder vents 2 → 3
  function qevSym(S, c, x, y, venting, color, labels) {
    const w = 40, h = 20;
    S.line(c, [[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2], [x - w / 2, y - h / 2]], { color, width: 1.8 });
    S.line(c, [[x - w / 2 - 10, y], [x - w / 2, y]], { color, width: 1.8 });
    S.line(c, [[x, y - h / 2 - 10], [x, y - h / 2]], { color, width: 1.8 });
    S.line(c, [[x + w / 2, y], [x + w / 2 + 6, y]], { color, width: 1.8 });
    S.exhaust(c, x + w / 2 + 6, y, { color, rot: -90 });
    S.line(c, [[x - 9, y - 6], [x - 14, y], [x - 9, y + 6]], { color, width: 1.4 });
    S.line(c, [[x + 9, y - 6], [x + 14, y], [x + 9, y + 6]], { color, width: 1.4 });
    S.line(c, [[x, y - h / 2], [x, y - 2]], { color, width: 1.2 });
    c.setLineDash([]); c.strokeStyle = color; c.lineWidth = 1.6;
    c.beginPath(); c.arc(x + (venting ? -8 : 8), y, 5, 0, Math.PI * 2); c.stroke();
    if (labels) {
      S.text(c, '1', x - w / 2 - 6, y - 8, { size: 10 });
      S.text(c, '2', x + 7, y - h / 2 - 7, { size: 10 });
      S.text(c, '3', x + w / 2 + 12, y - 9, { size: 10 });
    }
    return { in: [x - w / 2 - 10, y], out: [x, y - h / 2 - 10], ex: [x + w / 2 + 17, y] };
  }
  // an air reservoir (a capsule), filled by its pressure; port at the bottom
  function reservoirSym(c, x, y, w, h, fill, color) {
    c.setLineDash([]);
    c.beginPath();
    if (c.roundRect) c.roundRect(x - w / 2, y - h / 2, w, h, w / 2); else c.rect(x - w / 2, y - h / 2, w, h);
    if (fill) { c.fillStyle = fill; c.fill(); }
    c.strokeStyle = color; c.lineWidth = 1.8; c.stroke();
    c.beginPath(); c.moveTo(x, y + h / 2); c.lineTo(x, y + h / 2 + 10); c.stroke();
    return { P: [x, y + h / 2 + 10] };
  }
  // a 3/2 normally closed valve drawn with its normal box on the left, for a pilot on the right
  const NC_R = { top: [['A', 0.3]], bottom: [['P', 0.3], ['R', 0.7]], boxes: [['A>R', 'P|'], ['P>A', 'R|']], normal: 0 };
  // a 3/2 normally open valve likewise (INHIBIT: the pilot on the right closes it)
  const NO_R = { top: [['A', 0.3]], bottom: [['P', 0.3], ['R', 0.7]], boxes: [['P>A', 'R|'], ['A>R', 'P|']], normal: 0 };
  // fsym draws a single-acting cylinder's spring from the piston to the head: keep it a hair short of
  // full stroke so the spring never has zero length
  const spos = f => Math.max(0, Math.min(0.985, f));
  const secs = v => (typeof v === 'number' && isFinite(v)) ? (v < 10 ? v.toFixed(3) : v.toFixed(1)) + ' s' : '—';
  const bar = (pa, d) => (pa / 1e5).toFixed(d == null ? 2 : d) + ' bar';

  /* ================================================================ direct and indirect control */
  Hyper.sim('fv-direct', {
    title: 'Direct and indirect control',
    blurb: `Two ways for a push button to move a single-acting cylinder, side by side and pressed together. **Left, direct control:** the 3/2 push-button valve carries the working air to the cylinder and lets it out again when released. **Right, indirect control:** the same small push-button valve only fills a thin signal tube (dashed, orange while pressurised); the signal pilots a large 3/2 power valve (port 12) beside the cylinder, and that valve carries the working air. Each chamber fills and empties by ISO 6358, the signal tube is a small volume, and the piston moves against its return spring, friction and the air.

**Try this**
- Hold a push button (on the drawing, or with the check box) and compare the stroke times: on a 50 mm cylinder the small valve throttles the direct circuit, while the indirect one waits for its signal and then snaps out.
- Choose the 25 mm cylinder: now direct control is as quick or quicker — the signal delay is all that indirect control adds.
- Lengthen the signal tube to 20 or 30 m: the delay grows with the tube's volume ($\\tau = V/(C\\,p_\\text{ref})$), but the stroke itself stays fast.
- Release the button and compare the return strokes: the spring must push the air out through the same valve, so a small valve makes the return slow as well.
- Lower the supply to 3 bar: the power valve needs about 2 bar on its pilot, and the signal takes longer to reach it.`,
    mount(box, kit) {
      FL = kit.fluid;
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const [g1, g2] = graphs(box, 2);
      let auto = true, pulse = 0;
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'press', label: 'Press for 0.6 s', primary: true }] },
        { id: 'hold', type: 'check', label: 'Hold the push buttons down', value: false },
        { id: 'auto', type: 'check', label: 'Press and release automatically', value: true },
        { id: 'bore', type: 'select', label: 'Single-acting cylinder, 50 mm stroke', options: [['25 mm bore', 25], ['50 mm bore', 50], ['80 mm bore', 80]], value: 50 },
        { id: 'len', label: 'Signal tube to the power valve (4 mm bore)', min: 0.5, max: 30, step: 0.5, value: 3, unit: 'm' },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 3, max: 8, step: 0.5, value: 6, unit: 'bar' },
        { id: 'cb', label: 'Push-button valve C', min: 0.05, max: 0.6, step: 0.01, value: 0.2, unit: 'dm³/(s·bar)' },
        { id: 'cp', label: 'Power valve C', min: 0.5, max: 5, step: 0.1, value: 2, unit: 'dm³/(s·bar)' },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25], ['Slow motion 1/10', 0.1]], value: 0.25 }
      ], (id, v) => {
        if (id === 'press') { pulse = 0.6; auto = false; ctl.set('auto', false); }
        if (id === 'hold' && v) { auto = false; ctl.set('auto', false); }
        if (id === 'auto') auto = v;
        if (id === 'bore') build();
      });
      const ro = kit.readout(box.side, [['d', 'Direct: extend / return'], ['i', 'Indirect: signal / extend / return'], ['sig', 'Signal tube: volume, τ = V/(C·p_ref)'], ['F', 'Push at full stroke (air − spring)']]);
      const pPos = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'position (mm)', min: 0, max: 52 }, legend: true }, 130);
      const pPr = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'gauge pressure (bar)', min: 0 }, legend: true }, 130);
      const V = ctl.values, STROKE = 0.05;
      const pads = [{ x0: 70, y0: 250, x1: 205, y1: 325, on: false }, { x0: 388, y0: 292, x1: 505, y1: 358, on: false }];
      let fr = frameOf(st, 760, 420);
      holdPads(st, () => fr, pads, () => { auto = false; ctl.set('auto', false); });
      let cD, cI, s;
      function mk(D) {
        const A = Math.PI * D * D / 4, Fn = 6e5 * A;       // spring and friction sized for a 6 bar cylinder
        return cylModel({ bore: D, rod: D * 0.4, stroke: STROKE, mass: 0.3 + 30 * D, single: true, k0: 0.08 * Fn, k1: 0.08 * Fn / STROKE,
          fc: 3 + 0.03 * Fn, fsr: 1.3, fv: 30, deadA: 2e-6 + A * 0.003 });
      }
      function build() {
        cD = mk(V.bore / 1000); cI = mk(V.bore / 1000);
        s = { t: 0, sig: PATM, pv: false, pvPos: 1, bvPos: 1, pressed: false, tPress: 0, tRel: 0, fD: true, fI: true, fS: true, rD: true, rI: true,
          dExt: null, dRet: null, iSig: null, iExt: null, iRet: null, hist: [], tPlot: 0, ph: {}, autoT: 0 };
      }
      build();
      const loop = kit.loop(dt => {
        fr = frameOf(st, 760, 420);
        const sdt = Math.min(dt, 0.05) * V.slow;
        const psup = V.ps * 1e5 + PATM, cb = V.cb * 1e-8, cp = V.cp * 1e-8;
        const Vsig = Math.PI / 4 * 0.004 * 0.004 * V.len + 2e-6;          // tube + pilot chamber
        if (auto) s.autoT += sdt;
        pulse = Math.max(0, pulse - sdt);
        const pressed = !!(V.hold || pads[0].on || pads[1].on || pulse > 0 || (auto && (s.autoT % 2.6) < 1.2));
        if (pressed && !s.pressed) { s.tPress = s.t; s.fD = s.fI = s.fS = false; }
        if (!pressed && s.pressed) { s.tRel = s.t; s.rD = cD.s.x < 1e-3; s.rI = cI.s.x < 1e-3; }
        s.pressed = pressed;
        let rem = sdt;
        while (rem > 1e-12) {
          const h = Math.min(rem, 1e-3); rem -= h;
          // the signal tube fills and vents through the push-button valve (isothermal: a thin tube)
          for (let k = 0; k < 10; k++) {
            const m = pressed ? mflow(cb, psup, s.sig) : mflow(cb, PATM, s.sig);
            s.sig += m * RG * TREF / Vsig * h / 10;
            s.sig = pressed ? Math.min(Math.max(s.sig, PATM * 0.99), psup) : Math.max(PATM, s.sig);
          }
          if (!s.pv && s.sig - PATM > 2.0e5) s.pv = true;
          if (s.pv && s.sig - PATM < 1.2e5) s.pv = false;
          cD.step(h, q => [pressed ? mflow(cb, psup, q.pA) : mflow(cb, PATM, q.pA), 0]);
          cI.step(h, q => [s.pv ? mflow(cp, psup, q.pA) : mflow(cp, PATM, q.pA), 0]);
          s.t += h;
          if (pressed) {
            if (!s.fS && s.pv) { s.fS = true; s.iSig = s.t - s.tPress; }
            if (!s.fD && cD.s.x >= STROKE - 5e-4) { s.fD = true; s.dExt = s.t - s.tPress; }
            if (!s.fI && cI.s.x >= STROKE - 5e-4) { s.fI = true; s.iExt = s.t - s.tPress; }
          } else {
            if (!s.rD && cD.s.x <= 5e-4) { s.rD = true; s.dRet = s.t - s.tRel; }
            if (!s.rI && cI.s.x <= 5e-4) { s.rI = true; s.iRet = s.t - s.tRel; }
          }
        }
        s.bvPos = toward(s.bvPos, pressed ? 0 : 1, sdt, 0.015);
        s.pvPos = toward(s.pvPos, s.pv ? 0 : 1, sdt, 0.015);
        const pgD = cD.s.pA - PATM, pgI = cI.s.pA - PATM, pgS = s.sig - PATM;
        ro.set('d', secs(s.dExt) + ' / ' + secs(s.dRet));
        ro.set('i', secs(s.iSig) + ' / ' + secs(s.iExt) + ' / ' + secs(s.iRet));
        ro.set('sig', (Vsig * 1e6).toFixed(0) + ' cm³, τ = ' + (Vsig / (cb * PREF)).toFixed(3) + ' s');
        ro.set('F', Math.max(0, V.ps * 1e5 * cD.AA - (cD.P.k0 + cD.P.k1 * STROKE)).toFixed(0) + ' N');
        s.hist.push([s.t, cD.s.x * 1000, cI.s.x * 1000, pgD / 1e5, pgI / 1e5, pgS / 1e5]);
        while (s.hist.length && s.hist[0][0] < s.t - 3) s.hist.shift();
        s.tPlot += dt;
        if (s.tPlot > 0.06) {
          s.tPlot = 0;
          const hh = s.hist.filter((q, i) => i % 2 === 0);
          pPos.set({ series: [{ pts: hh.map(q => [q[0], q[1]]), label: 'direct', dash: [5, 4] }, { pts: hh.map(q => [q[0], q[2]]), label: 'indirect' }] });
          pPr.set({ series: [{ pts: hh.map(q => [q[0], q[3]]), label: 'direct, cylinder', dash: [5, 4] }, { pts: hh.map(q => [q[0], q[4]]), label: 'indirect, cylinder' }, { pts: hh.map(q => [q[0], q[5]]), label: 'signal tube', dash: [2, 3] }],
            y: { label: 'gauge pressure (bar)', min: 0, max: V.ps + 0.5 }, hlines: [{ y: 2, label: 'pilot switches' }] });
        }
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin(), C = kit.colors();
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const pmax = V.ps * 1e5, qref = cp * psup * 1.185;
        S.line(c, [[380, 34], [380, 404]], { color: C.faint, width: 1, kind: 'drain' });
        kit.label(c, 'Direct control', 190, 16, { color: C.text, size: 13, weight: 700 });
        kit.label(c, 'Indirect control', 570, 16, { color: C.text, size: 13, weight: 700 });
        // left: the push-button valve feeds the cylinder
        const LD = [[143.2, 258], [143.2, 190], [58, 190], [58, 122]];
        S.line(c, [[143.2, 372], [143.2, 312]], { state: 'air' });
        S.line(c, LD, { state: airState(pgD, !pressed) });
        dots(S, c, s.ph, 'd', LD, cD.s.mA, qref, dt, S.col(pressed ? 'air' : 'exhaust'));
        if (pressed) dots(S, c, s.ph, 'ds', [[143.2, 372], [143.2, 312]], cD.s.mA, qref, dt, S.col('air'));
        S.source(c, 143.2, 392, { pneumatic: true });
        const bv = S.valve(c, 150, 285, { spec: '3/2 NC', state: s.bvPos, left: 'pushbutton', right: 'spring', s: 34, pneumatic: true, labels: true, exhaust: 'silencer' });
        S.cylinder(c, 50, 90, { len: 200, h: 44, rodLen: 90, pos: spos(cD.s.x / STROKE), single: 'retract', fillA: shade(C, pgD, pmax) });
        kit.label(c, '1S1', bv.xr + 8, 285, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'hold to press', 118, 322, { color: C.faint, size: 10 });
        kit.label(c, '1A1', 42, 90, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, (pgD / 1e5).toFixed(1) + ' bar', 150, 56, { color: C.text, size: 12, weight: 700 });
        // right: signal valve → pilot 12 of the power valve → cylinder
        S.line(c, [[400, 372], [400, 382], [553.2, 382], [553.2, 252]], { state: 'air' });
        S.line(c, [[454, 382], [454, 350]], { state: 'air' }); S.junction(c, 454, 382);
        const LI = [[553.2, 198], [553.2, 170], [438, 170], [438, 122]];
        S.line(c, LI, { state: airState(pgI, !s.pv) });
        dots(S, c, s.ph, 'i', LI, cI.s.mA, qref, dt, S.col(s.pv ? 'air' : 'exhaust'));
        if (s.pv) dots(S, c, s.ph, 'is', [[400, 372], [400, 382], [553.2, 382], [553.2, 252]], cI.s.mA, qref, dt, S.col('air'));
        S.source(c, 400, 392, { pneumatic: true });
        const pvv = S.valve(c, 560, 225, { spec: '3/2 NC', state: s.pvPos, left: 'pilot', right: 'spring', s: 34, pneumatic: true, labels: true, exhaust: 'silencer' });
        const LS = [[454, 300], [454, 225], [pvv.pilotL[0], 225]];
        sigLine(S, c, LS, pgS, !pressed);
        const sv = S.valve(c, 460, 325, { spec: '3/2 NC', state: s.bvPos, left: 'pushbutton', right: 'spring', s: 30, pneumatic: true, labels: true, exhaust: 'silencer' });
        S.cylinder(c, 430, 90, { len: 200, h: 44, rodLen: 90, pos: spos(cI.s.x / STROKE), single: 'retract', fillA: shade(C, pgI, pmax) });
        kit.label(c, '12', pvv.pilotL[0] + 4, 212, { color: s.pv ? C.warn : C.muted, size: 11, weight: 700 });
        kit.label(c, '1V1', pvv.xr + 10, 225, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, '1S1', sv.xr + 8, 325, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'hold to press', 420, 365, { color: C.faint, size: 10 });
        kit.label(c, '1A1', 422, 90, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'signal tube ' + V.len.toFixed(1) + ' m', 446, 262, { color: S.col('pilot'), size: 11, align: 'right' });
        kit.label(c, 'signal ' + (pgS / 1e5).toFixed(1) + ' bar', 470, 240, { color: C.text, size: 11, align: 'left' });
        kit.label(c, (pgI / 1e5).toFixed(1) + ' bar', 530, 56, { color: C.text, size: 12, weight: 700 });
        kit.label(c, pressed ? 'buttons pressed' : 'buttons released', 380, 412, { color: pressed ? C.warn : C.muted, size: 11 });
        kit.label(c, 't = ' + s.t.toFixed(2) + ' s', 750, 412, { color: C.muted, size: 11, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ meter-in or meter-out */
  Hyper.sim('fv-meter', {
    title: 'Meter-out or meter-in?',
    blurb: `The same 32 mm double-acting cylinder (200 mm stroke) and 5/2 valve, run twice at once: once with its two one-way flow controls throttling the air **leaving** the cylinder (meter-out), once throttling the air **entering** it (meter-in). One circuit is drawn — its flow-control checks point the other way — and both positions are plotted. The model integrates the air in each chamber by ISO 6358 and moves the piston against the load and a seal friction whose breakaway value is 30 % above its sliding value. The two throttles start set for about the same free speed.

**Try this**
- With the stiff patch (extra friction over the middle third of the stroke): meter-in stalls at the patch while the cap end fills, then the stored air throws the load forward at several times the set speed. Meter-out stalls only briefly and carries on at its set speed.
- Choose the opposing load: the meter-in speed falls to less than half; the meter-out speed hardly changes. While the exhaust throttle is choked, the speed is $v = C\\,p_\\text{ref}/A$, whatever the load (see the read-out).
- Choose the aiding load, which pulls the rod out: meter-in cannot hold it back and the load runs away; the meter-out back-pressure holds it.
- Watch the pressure plot of each circuit: with meter-out both chambers stay high (the piston rides between two air cushions); with meter-in the driving chamber hovers just above what the load needs.
- Close the meter-out throttles below about 5 %: at a few centimetres a second even meter-out starts to judder — stick-slip, the limit of pneumatic slow motion.`,
    mount(box, kit) {
      FL = kit.fluid;
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const [g1, g2] = graphs(box, 2);
      let cmd = 1, auto = true;
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'ext', label: 'Extend (14)' }, { id: 'ret', label: 'Retract' }, { id: 'restart', label: 'Restart' }] },
        { id: 'auto', type: 'check', label: 'Cycle automatically', value: true },
        { id: 'show', type: 'select', label: 'Circuit drawn', options: [['Meter-out: throttling the exhaust', 'out'], ['Meter-in: throttling the supply', 'in']], value: 'out' },
        { id: 'load', type: 'select', label: 'Load', options: [['Friction only', 'none'], ['A stiff patch in mid-stroke', 'patch'], ['Opposing load, 30 % of the force', 'oppose'], ['Aiding load, 30 % (pulls the rod out)', 'aid']], value: 'patch' },
        { id: 'tout', label: 'Meter-out throttles open', min: 2, max: 100, step: 1, value: 10, unit: '%' },
        { id: 'tin', label: 'Meter-in throttles open', min: 0.5, max: 100, step: 0.5, value: 2, unit: '%', log: true },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 3, max: 8, step: 0.5, value: 6, unit: 'bar' },
        { id: 'mass', label: 'Moving mass', min: 0.5, max: 20, step: 0.1, value: 3, unit: 'kg', log: true },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ½', 0.5], ['Slow motion ¼', 0.25]], value: 0.5 }
      ], (id, v) => {
        if (id === 'ext') { cmd = 1; auto = false; ctl.set('auto', false); }
        if (id === 'ret') { cmd = 0; auto = false; ctl.set('auto', false); }
        if (id === 'auto') auto = v;
        if (id === 'restart' || id === 'load') build();
      });
      const ro = kit.readout(box.side, [['t', 'Stroke time: meter-out / meter-in'], ['v', 'Top speed: meter-out / meter-in'], ['pred', 'Meter-out speed while choked, C·p_ref/A'], ['p', 'Cap / rod end (circuit drawn)']]);
      const pPos = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'position (mm)', min: 0, max: 200 }, legend: true }, 130);
      const pPr = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'gauge pressure (bar)', min: 0 }, legend: true }, 130);
      const V = ctl.values, STROKE = 0.2, CV = 1.2e-8, CFREE = 1.5e-8, CTMAX = 1.5e-8;
      let cO, cI, s;
      function mk() {
        const cy = cylModel({ bore: 0.032, rod: 0.012, stroke: STROKE, mass: V.mass, fc: 20, fsr: 1.3, fv: 30 });
        cy.P.fcAt = x => 20 + (V.load === 'patch' && x > 0.35 * STROKE && x < 0.65 * STROKE ? 0.2 * V.ps * 1e5 * cy.AA : 0);
        cy.P.load = () => (V.load === 'oppose' ? 0.3 : V.load === 'aid' ? -0.3 : 0) * V.ps * 1e5 * cy.AA;
        cy.s.pB = V.ps * 1e5 + PATM;
        return cy;
      }
      function build() {
        cO = mk(); cI = mk(); cmd = 1;
        s = { t: 0, t0: 0, wait: 0, lastCmd: 1, hist: [], tPlot: 0, ph: {}, tO: null, tI: null, arrO: false, arrI: false, vO: 0, vI: 0, vOs: 0, vIs: 0 };
      }
      build();
      const paths = mode => {
        const ct = Math.max(0.005, (mode === 'out' ? V.tout : V.tin) / 100) * CTMAX;
        return { fill: mode === 'in' ? ser(CV, ct) : ser(CV, CFREE + ct), vent: mode === 'in' ? ser(CV, CFREE + ct) : ser(CV, ct), ct };
      };
      const atEnd = cy => cmd === 1 ? cy.s.x >= STROKE - 1e-6 : cy.s.x <= 1e-6;
      const loop = kit.loop(dt => {
        const sdt = Math.min(dt, 0.05) * V.slow, psup = V.ps * 1e5 + PATM;
        cO.P.mass = cI.P.mass = V.mass;
        if (auto) {
          if ((atEnd(cO) && atEnd(cI)) || s.t - s.t0 > 8) { s.wait += sdt; if (s.wait > 0.4) { cmd = 1 - cmd; s.wait = 0; } } else s.wait = 0;
        }
        if (cmd !== s.lastCmd) { s.lastCmd = cmd; s.t0 = s.t; s.arrO = s.arrI = false; s.vOs = s.vIs = 0; }
        const po = paths('out'), pi = paths('in');
        const fo = cmd ? q => [mflow(po.fill, psup, q.pA), mflow(po.vent, PATM, q.pB)] : q => [mflow(po.vent, PATM, q.pA), mflow(po.fill, psup, q.pB)];
        const fi = cmd ? q => [mflow(pi.fill, psup, q.pA), mflow(pi.vent, PATM, q.pB)] : q => [mflow(pi.vent, PATM, q.pA), mflow(pi.fill, psup, q.pB)];
        cO.step(sdt, fo); cI.step(sdt, fi);
        s.t += sdt;
        s.vOs = Math.max(s.vOs, Math.abs(cO.s.v)); s.vIs = Math.max(s.vIs, Math.abs(cI.s.v));
        if (!s.arrO && atEnd(cO)) { s.arrO = true; s.tO = s.t - s.t0; s.vO = s.vOs; }
        if (!s.arrI && atEnd(cI)) { s.arrI = true; s.tI = s.t - s.t0; s.vI = s.vIs; }
        const shown = V.show === 'in' ? cI : cO, pth = V.show === 'in' ? pi : po;
        const pA = shown.s.pA - PATM, pB = shown.s.pB - PATM;
        ro.set('t', secs(s.tO) + ' / ' + secs(s.tI));
        ro.set('v', s.vO.toFixed(2) + ' / ' + s.vI.toFixed(2) + ' m/s');
        const Aout = cmd ? cO.AB : cO.AA;
        ro.set('pred', (po.vent * PREF / Aout).toFixed(3) + ' m/s ' + (cmd ? 'extending' : 'retracting'));
        ro.set('p', bar(pA) + ' / ' + bar(pB));
        s.hist.push([s.t, cO.s.x * 1000, cI.s.x * 1000, pA / 1e5, pB / 1e5]);
        while (s.hist.length && s.hist[0][0] < s.t - 4) s.hist.shift();
        s.tPlot += dt;
        if (s.tPlot > 0.06) {
          s.tPlot = 0;
          const hh = s.hist.filter((q, i) => i % 2 === 0);
          pPos.set({ series: [{ pts: hh.map(q => [q[0], q[1]]), label: 'meter-out' }, { pts: hh.map(q => [q[0], q[2]]), label: 'meter-in', dash: [5, 4] }] });
          pPr.set({ series: [{ pts: hh.map(q => [q[0], q[3]]), label: 'cap end (' + (V.show === 'in' ? 'meter-in' : 'meter-out') + ')' }, { pts: hh.map(q => [q[0], q[4]]), label: 'rod end', dash: [5, 4] }],
            y: { label: 'gauge pressure (bar)', min: 0, max: V.ps + 1.5 } });
        }
        // ---- drawing (the reference layout)
        const c = st.begin(), C = kit.colors(), k = Math.min(st.W / 760, st.H / 420);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 420 * k) / 2); c.scale(k, k);
        const exA = cmd !== 1, exB = cmd === 1;
        const L = {
          supply: [[170, 360], [170, 352], [212, 352]], main: [[308, 352], [390, 352], [390, 297]],
          A: [[258, 111], [258, 142]], A2: [[258, 198], [258, 220], [381.5, 220], [381.5, 243]],
          B: [[522, 111], [522, 142]], B2: [[522, 198], [522, 220], [398.5, 220], [398.5, 243]]
        };
        const stA = airState(pA, exA), stB = airState(pB, exB);
        S.line(c, L.supply, { state: 'air' }); S.line(c, L.main, { state: 'air' }); S.line(c, [[330, 343], [330, 352]], { state: 'air' }); S.junction(c, 330, 352);
        S.line(c, L.A, { state: stA }); S.line(c, L.A2, { state: stA }); S.line(c, L.B, { state: stB }); S.line(c, L.B2, { state: stB });
        const qref = pth.fill * psup * 1.185;
        const pathA = L.A2.slice().reverse().concat(L.A.slice().reverse()), pathB = L.B2.slice().reverse().concat(L.B.slice().reverse());
        dots(S, c, s.ph, 'a', pathA, shown.s.mA, qref, dt, S.col(exA ? 'exhaust' : 'air'));
        dots(S, c, s.ph, 'b', pathB, shown.s.mB, qref, dt, S.col(exB ? 'exhaust' : 'air'));
        dots(S, c, s.ph, 's', L.supply.concat(L.main), Math.max(shown.s.mA, shown.s.mB, 0), qref, dt, S.col('air'));
        S.source(c, 170, 380, { pneumatic: true });
        S.frl(c, 260, 352);
        S.gauge(c, 330, 322, { frac: V.ps / 12, value: V.ps.toFixed(1) + ' bar' });
        const v52 = S.valve(c, 390, 270, { spec: '5/2', state: toward(s.vpos == null ? 0 : s.vpos, cmd === 1 ? 0 : 1, sdt, 0.02), left: 'solenoid', right: 'spring', s: 34, pneumatic: true, labels: true, exhaust: 'silencer' });
        s.vpos = toward(s.vpos == null ? 0 : s.vpos, cmd === 1 ? 0 : 1, sdt, 0.02);
        kit.label(c, '14', v52.xl - 8, 270, { color: cmd === 1 ? C.bad : C.muted, size: 11, weight: 700, align: 'right' });
        const free = V.show === 'in' ? 'down' : 'up';
        S.flowControl(c, 258, 170, { free }); S.flowControl(c, 522, 170, { free });
        kit.label(c, (V.show === 'in' ? V.tin : V.tout).toFixed(V.show === 'in' ? 1 : 0) + ' % open', 590, 170, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, V.show === 'in' ? 'meter-in: checks let the air out freely' : 'meter-out: checks let the air in freely', 590, 188, { color: C.faint, size: 10, align: 'left' });
        const cy = S.cylinder(c, 250, 80, { len: 280, h: 42, rodLen: 150, pos: shown.s.x / STROKE, fillA: shade(C, pA, V.ps * 1e5), fillB: shade(C, pB, V.ps * 1e5), cushion: true });
        // the slide, the load and the other circuit's load as a ghost
        const mw = 26 + 6 * Math.log2(1 + V.mass), gy = 80 + 30;
        const tipX = p => 411 + 265 * p;
        S.line(c, [[405, gy], [745, gy]], { color: C.muted, width: 1.4 });
        if (V.load === 'patch') {
          const x0 = tipX(0.35), x1 = tipX(0.65);
          c.fillStyle = C.dark ? 'rgba(224,160,48,.18)' : 'rgba(217,115,13,.14)'; c.fillRect(x0, gy, x1 - x0, 8);
          c.strokeStyle = C.warn; c.lineWidth = 1; c.setLineDash([]);
          for (let x = x0; x < x1; x += 7) { c.beginPath(); c.moveTo(x, gy + 8); c.lineTo(x + 6, gy); c.stroke(); }
          kit.label(c, 'stiff patch', (x0 + x1) / 2, gy + 18, { color: C.warn, size: 10 });
        }
        const other = V.show === 'in' ? cO : cI;
        c.strokeStyle = C.faint; c.lineWidth = 1.2; c.setLineDash([4, 3]);
        c.strokeRect(tipX(other.s.x / STROKE), gy - mw, mw, mw); c.setLineDash([]);
        kit.label(c, V.show === 'in' ? 'meter-out' : 'meter-in', tipX(other.s.x / STROKE) + mw / 2, gy - mw - 8, { color: C.faint, size: 10 });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(cy.tip[0], gy - mw, mw, mw); c.strokeRect(cy.tip[0], gy - mw, mw, mw);
        kit.label(c, V.mass.toFixed(1) + ' kg', cy.tip[0] + mw / 2, gy - mw / 2, { color: C.muted, size: 10 });
        if (V.load === 'oppose' || V.load === 'aid') {
          const xa = cy.tip[0] + mw / 2, ya = gy - mw - 12, d = V.load === 'oppose' ? -1 : 1;
          kit.arrow(c, xa - d * 22, ya, xa + d * 22, ya, C.bad, 2);
          kit.label(c, (V.load === 'oppose' ? 'opposing ' : 'aiding ') + (0.3 * V.ps * 1e5 * cO.AA).toFixed(0) + ' N', xa, ya - 12, { color: C.bad, size: 10 });
        }
        kit.label(c, (pA / 1e5).toFixed(1) + ' bar', 300, 48, { color: C.text, size: 12, weight: 700 });
        kit.label(c, (pB / 1e5).toFixed(1) + ' bar', 480, 48, { color: C.text, size: 12, weight: 700 });
        kit.label(c, V.show === 'in' ? 'METER-IN' : 'METER-OUT', 20, 22, { color: C.accent, size: 13, weight: 700, align: 'left' });
        kit.label(c, 't = ' + s.t.toFixed(2) + ' s', 740, 400, { color: C.muted, size: 11, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ quick-exhaust valve */
  const BORES = { 32: 12, 50: 20, 63: 20, 80: 25 };
  Hyper.sim('fv-qev', {
    title: 'A quick-exhaust valve',
    blurb: `A double-acting cylinder whose 5/2 valve sits some metres away at the end of two tubes. A quick-exhaust valve screwed into a cylinder port lets that chamber empty straight into the room through its own large port 3, instead of pushing its air back through the tube and the valve. The same cylinder without quick-exhaust valves runs alongside (dashed in the position plot), so the stroke times can be compared. Tubes are modelled by their bore's sonic limit in series with pipe friction; chambers and valves as in the other simulations.

**Try this**
- With the valve on the rod end, compare the extension times with and without: the gain is largest with a small valve, long thin tubes and a long stroke.
- Choose a large valve (C = 5) with short 10 mm tubes (7.5 mm bore, 0.5 m): the quick-exhaust valve no longer helps — it even costs a little, because the incoming air has to pass through it too. It pays only where the exhaust path is the bottleneck.
- Put quick-exhaust valves on both ports: both strokes speed up, and the impact speed at the end cap rises — watch the top-speed read-out and think of the cushions.
- Look at the pressure plot: with the rod end emptying freely, the cap end no longer has to fight a back-pressure, so the piston starts sooner.`,
    mount(box, kit) {
      FL = kit.fluid;
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const [g1, g2] = graphs(box, 2);
      let cmd = 1, auto = true;
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'ext', label: 'Extend (14)' }, { id: 'ret', label: 'Retract' }] },
        { id: 'auto', type: 'check', label: 'Cycle automatically', value: true },
        { id: 'qev', type: 'select', label: 'Quick-exhaust valve', options: [['On the rod end: faster extension', 'B'], ['On the cap end: faster retraction', 'A'], ['On both ports', 'AB']], value: 'B' },
        { id: 'cv', label: 'Directional valve C', min: 0.3, max: 5, step: 0.05, value: 1, unit: 'dm³/(s·bar)', log: true },
        { id: 'tl', label: 'Tube length, valve to cylinder (each)', min: 0.2, max: 10, step: 0.1, value: 3, unit: 'm' },
        { id: 'td', type: 'select', label: 'Tube bore', options: [['2.5 mm (4 mm tube)', 2.5], ['4 mm (6 mm tube)', 4], ['5.5 mm (8 mm tube)', 5.5], ['7.5 mm (10 mm tube)', 7.5]], value: 4 },
        { id: 'bore', type: 'select', label: 'Cylinder', options: Object.keys(BORES).map(b => [b + ' mm bore, ' + BORES[b] + ' mm rod', +b]), value: 50 },
        { id: 'stroke', label: 'Stroke', min: 50, max: 500, step: 10, value: 300, unit: 'mm' },
        { id: 'mass', label: 'Moving mass', min: 0.5, max: 40, step: 0.1, value: 5, unit: 'kg', log: true },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 3, max: 8, step: 0.5, value: 6, unit: 'bar' },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25], ['Slow motion 1/10', 0.1]], value: 0.25 }
      ], (id, v) => {
        if (id === 'ext') { cmd = 1; auto = false; ctl.set('auto', false); }
        if (id === 'ret') { cmd = 0; auto = false; ctl.set('auto', false); }
        if (id === 'auto') auto = v;
        if (id === 'bore' || id === 'stroke' || id === 'tl' || id === 'td' || id === 'qev') build();
      });
      const ro = kit.readout(box.side, [['c', 'Valve + tube in series'], ['e', 'Extend: with / without'], ['r', 'Retract: with / without'], ['v', 'Top speed: with / without'], ['g', 'Time saved per cycle']]);
      const pPos = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'position (mm)', min: 0 }, legend: true }, 130);
      const pPr = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'gauge pressure (bar)', min: 0 }, legend: true }, 130);
      const V = ctl.values, CQ_EX = 3e-8, CQ_PASS = 2.5e-8;
      let cQ, cN, s;
      function mk() {
        const D = V.bore / 1000, Vt = Math.PI / 4 * Math.pow(V.td / 1000, 2) * V.tl, A = Math.PI * D * D / 4;
        const cy = cylModel({ bore: D, rod: BORES[V.bore] / 1000, stroke: V.stroke / 1000, mass: V.mass, fc: 10 + 0.03 * 6e5 * A, fsr: 1.3, fv: 40, deadA: 1e-5 + Vt, deadB: 1e-5 + Vt });
        cy.s.pB = V.ps * 1e5 + PATM;
        return cy;
      }
      function build() {
        const x0 = cQ ? cQ.s.x : 0;
        cQ = mk(); cN = mk(); cmd = x0 > 0 ? 0 : 1;
        if (x0 > 0) { cQ.s.x = cN.s.x = cQ.P.stroke; cQ.s.pA = cN.s.pA = V.ps * 1e5 + PATM; cQ.s.pB = cN.s.pB = PATM; }
        s = { t: 0, t0: 0, wait: 0, lastCmd: cmd, hist: [], tPlot: 0, ph: {}, eQ: null, eN: null, rQ: null, rN: null, aQ: false, aN: false, vQ: 0, vN: 0, vpos: cmd ? 0 : 1 };
      }
      build();
      const atEnd = cy => cmd === 1 ? cy.s.x >= cy.P.stroke - 1e-6 : cy.s.x <= 1e-6;
      const loop = kit.loop(dt => {
        const sdt = Math.min(dt, 0.05) * V.slow, psup = V.ps * 1e5 + PATM;
        cQ.P.mass = cN.P.mass = V.mass;
        const cline = ser(V.cv * 1e-8, tubeC(V.td / 1000, V.tl));
        const qa = V.qev === 'A' || V.qev === 'AB', qb = V.qev === 'B' || V.qev === 'AB';
        if (auto) {
          if ((atEnd(cQ) && atEnd(cN)) || s.t - s.t0 > 8) { s.wait += sdt; if (s.wait > 0.5) { cmd = 1 - cmd; s.wait = 0; } } else s.wait = 0;
        }
        if (cmd !== s.lastCmd) { s.lastCmd = cmd; s.t0 = s.t; s.aQ = s.aN = false; }
        const fillA = qa ? ser(cline, CQ_PASS) : cline, fillB = qb ? ser(cline, CQ_PASS) : cline;
        const fQ = cmd ? q => [mflow(fillA, psup, q.pA), qb ? mflow(CQ_EX, PATM, q.pB) : mflow(cline, PATM, q.pB)]
          : q => [qa ? mflow(CQ_EX, PATM, q.pA) : mflow(cline, PATM, q.pA), mflow(fillB, psup, q.pB)];
        const fN = cmd ? q => [mflow(cline, psup, q.pA), mflow(cline, PATM, q.pB)] : q => [mflow(cline, PATM, q.pA), mflow(cline, psup, q.pB)];
        cQ.step(sdt, fQ); cN.step(sdt, fN);
        s.t += sdt;
        s.vQ = Math.max(s.vQ * 0.9995, Math.abs(cQ.s.v)); s.vN = Math.max(s.vN * 0.9995, Math.abs(cN.s.v));
        if (!s.aQ && atEnd(cQ)) { s.aQ = true; if (cmd) s.eQ = s.t - s.t0; else s.rQ = s.t - s.t0; }
        if (!s.aN && atEnd(cN)) { s.aN = true; if (cmd) s.eN = s.t - s.t0; else s.rN = s.t - s.t0; }
        s.vpos = toward(s.vpos, cmd === 1 ? 0 : 1, sdt, 0.02);
        const pA = cQ.s.pA - PATM, pB = cQ.s.pB - PATM;
        ro.set('c', (cline * 1e8).toFixed(2) + ' dm³/(s·bar) (QEV ' + (CQ_EX * 1e8).toFixed(1) + ')');
        ro.set('e', secs(s.eQ) + ' / ' + secs(s.eN));
        ro.set('r', secs(s.rQ) + ' / ' + secs(s.rN));
        ro.set('v', s.vQ.toFixed(2) + ' / ' + s.vN.toFixed(2) + ' m/s');
        const saved = (s.eN != null && s.eQ != null && s.rN != null && s.rQ != null) ? (s.eN + s.rN) - (s.eQ + s.rQ) : null;
        ro.set('g', saved == null ? 'after a full cycle' : saved.toFixed(3) + ' s (' + (100 * saved / Math.max(1e-6, s.eN + s.rN)).toFixed(0) + ' %)');
        s.hist.push([s.t, cQ.s.x * 1000, cN.s.x * 1000, pA / 1e5, pB / 1e5]);
        while (s.hist.length && s.hist[0][0] < s.t - 3) s.hist.shift();
        s.tPlot += dt;
        if (s.tPlot > 0.06) {
          s.tPlot = 0;
          const hh = s.hist.filter((q, i) => i % 2 === 0);
          pPos.set({ series: [{ pts: hh.map(q => [q[0], q[1]]), label: 'with QEV' }, { pts: hh.map(q => [q[0], q[2]]), label: 'without', dash: [5, 4] }], y: { label: 'position (mm)', min: 0, max: V.stroke } });
          pPr.set({ series: [{ pts: hh.map(q => [q[0], q[3]]), label: 'cap end' }, { pts: hh.map(q => [q[0], q[4]]), label: 'rod end', dash: [5, 4] }], y: { label: 'gauge pressure (bar)', min: 0, max: V.ps + 1 } });
        }
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin(), C = kit.colors(), k = Math.min(st.W / 760, st.H / 420);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 420 * k) / 2); c.scale(k, k);
        const exA = cmd !== 1, exB = cmd === 1, pmax = V.ps * 1e5, qref = cline * psup * 1.185;
        const stA = airState(pA, exA), stB = airState(pB, exB);
        const LA = qa ? [[381.5, 263], [381.5, 245], [130, 245], [130, 185], [148, 185]] : [[381.5, 263], [381.5, 245], [178, 245], [178, 113]];
        const LB = qb ? [[398.5, 263], [398.5, 230], [430, 230], [430, 185], [452, 185]] : [[398.5, 263], [398.5, 230], [482, 230], [482, 113]];
        // with a QEV venting, the tube empties back through the valve on its own; the cylinder air leaves at port 3
        S.line(c, LA, { state: qa && exA ? 'idle' : stA });
        S.line(c, LB, { state: qb && exB ? 'idle' : stB });
        if (qa) S.line(c, [[178, 165], [178, 113]], { state: stA });
        if (qb) S.line(c, [[482, 165], [482, 113]], { state: stB });
        const main = [[170, 360], [170, 352], [212, 352]], main2 = [[308, 352], [390, 352], [390, 317]];
        S.line(c, main, { state: 'air' }); S.line(c, main2, { state: 'air' });
        const vA = !(qa && exA), vB = !(qb && exB);
        if (vA) dots(S, c, s.ph, 'a', LA.slice().reverse(), cQ.s.mA, qref, dt, S.col(exA ? 'exhaust' : 'air'));
        if (vB) dots(S, c, s.ph, 'b', LB.slice().reverse(), cQ.s.mB, qref, dt, S.col(exB ? 'exhaust' : 'air'));
        if (qa) dots(S, c, s.ph, 'a2', [[178, 165], [178, 113]].reverse(), cQ.s.mA, qref, dt, S.col(exA ? 'exhaust' : 'air'));
        if (qb) dots(S, c, s.ph, 'b2', [[482, 165], [482, 113]].reverse(), cQ.s.mB, qref, dt, S.col(exB ? 'exhaust' : 'air'));
        if (qa && exA) dots(S, c, s.ph, 'qa', [[215, 185], [245, 185]], -cQ.s.mA, qref, dt, S.col('exhaust'));
        if (qb && exB) dots(S, c, s.ph, 'qb', [[519, 185], [549, 185]], -cQ.s.mB, qref, dt, S.col('exhaust'));
        dots(S, c, s.ph, 's', main.concat(main2), Math.max(cQ.s.mA, cQ.s.mB, 0), qref, dt, S.col('air'));
        S.source(c, 170, 380, { pneumatic: true });
        S.frl(c, 260, 352);
        const v52 = S.valve(c, 390, 290, { spec: '5/2', state: s.vpos, left: 'solenoid', right: 'spring', s: 34, pneumatic: true, labels: true, exhaust: 'silencer' });
        kit.label(c, '14', v52.xl - 8, 290, { color: cmd === 1 ? C.bad : C.muted, size: 11, weight: 700, align: 'right' });
        if (qa) qevSym(S, c, 178, 185, exA && pA > 0.05e5, C.text, true);
        if (qb) qevSym(S, c, 482, 185, exB && pB > 0.05e5, C.text, true);
        const cy = S.cylinder(c, 170, 80, { len: 320, h: 46, rodLen: 150, pos: cQ.s.x / cQ.P.stroke, fillA: shade(C, pA, pmax), fillB: shade(C, pB, pmax), cushion: true });
        const mw = 24 + 6 * Math.log2(1 + V.mass);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(cy.tip[0], 80 - mw / 2, mw, mw); c.strokeRect(cy.tip[0], 80 - mw / 2, mw, mw);
        // the cylinder without QEV, as a ghost of its load
        const tipN = 170 + 4 + (cN.s.x / cN.P.stroke) * (320 - 15) + 7 + 150;
        c.strokeStyle = C.faint; c.setLineDash([4, 3]); c.strokeRect(tipN, 80 - mw / 2, mw, mw); c.setLineDash([]);
        kit.label(c, 'without QEV', tipN + mw / 2, 80 + mw / 2 + 12, { color: C.faint, size: 10 });
        kit.label(c, 'tubes ' + V.tl.toFixed(1) + ' m × ' + V.td + ' mm bore', 560, 262, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'QEV at the cylinder port', 560, 280, { color: C.faint, size: 10, align: 'left' });
        kit.label(c, (pA / 1e5).toFixed(1) + ' bar', 240, 48, { color: C.text, size: 12, weight: 700 });
        kit.label(c, (pB / 1e5).toFixed(1) + ' bar', 440, 48, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 't = ' + s.t.toFixed(2) + ' s', 740, 400, { color: C.muted, size: 11, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ logic with air */
  const LOGIC = {
    or: { name: 'OR: shuttle valve', expr: 'OUT = S1 ∨ S2', f: (a, b) => a || b, two: true },
    and: { name: 'AND: two-pressure valve', expr: 'OUT = S1 ∧ S2', f: (a, b) => a && b, two: true },
    series: { name: 'AND: two valves in series', expr: 'OUT = S1 ∧ S2', f: (a, b) => a && b, two: true },
    not: { name: 'NOT: 3/2 normally open valve', expr: 'OUT = ¬S1', f: a => !a, two: false },
    inhibit: { name: 'INHIBIT: S1 AND NOT S2', expr: 'OUT = S1 ∧ ¬S2', f: (a, b) => a && !b, two: true }
  };
  Hyper.sim('fv-logic', {
    title: 'Logic with air',
    blurb: `Two 3/2 push-button valves, S1 and S2, feed a logic element; its output pilots a 5/2 power valve (port 14) that drives a double-acting cylinder. Choose the element: a **shuttle valve** (OR), a **two-pressure valve** (AND), two valves **in series** (also AND), a pilot-operated **3/2 normally open** valve (NOT), or a normally open valve fed by S1 and piloted by S2 (INHIBIT). Signal lines are dashed and turn orange when pressurised; the row of the truth table that is true right now lights up.

**Try this**
- Press and hold the push buttons on the drawing (or tick the boxes) in every combination and read the output off the cylinder.
- Take the OR case and imagine a plain T-junction instead of the shuttle valve: the air from S1 would escape through the open exhaust of S2. The shuttle's ball shuts the unused input.
- In the two-pressure valve, press S1 first: the spool is pushed across and seals S1's own path; only when S2 arrives does air reach the output.
- Choose NOT: with nothing pressed, the cylinder is already out — a normally open valve passes air until its pilot shuts it.
- Choose INHIBIT: S2 blocks S1 whatever S1 does — the pneumatic form of an interlock.`,
    mount(box, kit, params) {
      FL = kit.fluid;
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const start = params && LOGIC[params.mode] ? params.mode : 'or';
      let auto = true, p1 = 0, p2 = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Logic element', options: Object.keys(LOGIC).map(k => [LOGIC[k].name, k]), value: start },
        { type: 'buttons', items: [{ id: 'p1', label: 'Pulse S1' }, { id: 'p2', label: 'Pulse S2' }] },
        { id: 'h1', type: 'check', label: 'Hold S1', value: false },
        { id: 'h2', type: 'check', label: 'Hold S2', value: false },
        { id: 'auto', type: 'check', label: 'Step through the truth table', value: true },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 3, max: 8, step: 0.5, value: 6, unit: 'bar' },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25]], value: 1 }
      ], (id, v) => {
        if (id === 'p1') { p1 = 0.8; stopAuto(); }
        if (id === 'p2') { p2 = 0.8; stopAuto(); }
        if ((id === 'h1' || id === 'h2') && v) stopAuto();
        if (id === 'auto') { auto = v; s.autoT = 0; }
      });
      function stopAuto() { auto = false; ctl.set('auto', false); }
      const ro = kit.readout(box.side, [['in', 'Signals S1 / S2'], ['out', 'Logic output (pilot 14)'], ['cyl', 'Cylinder']]);
      const V = ctl.values;
      const pads = [{ x0: 70, y0: 280, x1: 175, y1: 322, on: false }, { x0: 280, y0: 280, x1: 385, y1: 322, on: false }];
      let fr = frameOf(st, 760, 420);
      holdPads(st, () => fr, pads, () => stopAuto());
      const cyl = cylModel({ bore: 0.032, rod: 0.012, stroke: 0.1, mass: 1, fc: 15, fsr: 1.3, fv: 30 });
      cyl.s.pB = V.ps * 1e5 + PATM;
      const s = { t: 0, autoT: 0, pS1: PATM, pS2: PATM, pOut: PATM, el: false, elPos: 1, v5: false, v5Pos: 1, b1: 1, b2: 1, ph: {} };
      const loop = kit.loop(dt => {
        fr = frameOf(st, 760, 420);
        const sdt = Math.min(dt, 0.05) * V.slow, psup = V.ps * 1e5 + PATM, M = LOGIC[V.mode] || LOGIC.or;
        p1 = Math.max(0, p1 - sdt); p2 = Math.max(0, p2 - sdt);
        if (auto) s.autoT += sdt;
        const step = Math.floor(s.autoT / 1.6) % 4, a1 = auto && (step === 1 || step === 3), a2 = auto && (step === 2 || step === 3);
        const on1 = !!(V.h1 || pads[0].on || p1 > 0 || a1), on2 = !!(V.h2 || pads[1].on || p2 > 0 || a2);
        const series = V.mode === 'series';
        // signal pressures (fast first-order lags: small signal volumes)
        s.pS1 = lag(s.pS1, on1 ? psup : PATM, sdt, 0.025);
        s.pS2 = lag(s.pS2, on2 ? (series ? s.pS1 : psup) : PATM, sdt, 0.025);
        const g1 = s.pS1 - PATM, g2 = s.pS2 - PATM;
        let target;
        if (V.mode === 'or') target = Math.max(s.pS1, s.pS2);
        else if (V.mode === 'and') target = Math.min(s.pS1, s.pS2);
        else if (series) target = s.pS2;
        else {
          const pil = V.mode === 'not' ? g1 : g2;
          if (!s.el && pil > 1.5e5) s.el = true;
          if (s.el && pil < 1.0e5) s.el = false;
          target = s.el ? PATM : (V.mode === 'not' ? psup : s.pS1);
        }
        s.pOut = lag(s.pOut, target, sdt, 0.025);
        const go = s.pOut - PATM;
        if (!s.v5 && go > 2.0e5) s.v5 = true;
        if (s.v5 && go < 1.2e5) s.v5 = false;
        const CV = 1e-8;
        cyl.step(sdt, s.v5 ? q => [mflow(CV, psup, q.pA), mflow(CV, PATM, q.pB)] : q => [mflow(CV, PATM, q.pA), mflow(CV, psup, q.pB)]);
        s.t += sdt;
        s.b1 = toward(s.b1, on1 ? 0 : 1, sdt, 0.015); s.b2 = toward(s.b2, on2 ? 0 : 1, sdt, 0.015);
        s.v5Pos = toward(s.v5Pos, s.v5 ? 0 : 1, sdt, 0.02);
        const elTarget = V.mode === 'inhibit' ? (s.el ? 1 : 0) : (s.el ? 0 : 1);
        s.elPos = toward(s.elPos, elTarget, sdt, 0.015);
        ro.set('in', (on1 ? '1' : '0') + ' / ' + (M.two ? (on2 ? '1' : '0') : '–') + '   (' + (g1 / 1e5).toFixed(1) + ' / ' + (g2 / 1e5).toFixed(1) + ' bar)');
        ro.set('out', (go > 1e5 ? '1' : '0') + '   (' + (go / 1e5).toFixed(1) + ' bar)');
        ro.set('cyl', cyl.s.x >= 0.0995 ? 'extended' : cyl.s.x <= 5e-4 ? 'retracted' : 'moving');
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin(), C = kit.colors();
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const pA = cyl.s.pA - PATM, pB = cyl.s.pB - PATM, pmax = V.ps * 1e5;
        // truth table
        const rows = M.two ? [[0, 0], [1, 0], [0, 1], [1, 1]] : [[0, 0], [1, 0]];
        const tx = 22, ty = 22, cw = 52, rh = 22;
        kit.label(c, M.name, tx, ty - 6, { color: C.text, size: 12, weight: 700, align: 'left' });
        ['S1', 'S2', 'OUT'].forEach((h, i) => kit.label(c, h, tx + cw * i + cw / 2, ty + 12, { color: C.muted, size: 11, weight: 700 }));
        rows.forEach((r, j) => {
          const y = ty + 24 + j * rh, out = M.f(!!r[0], !!r[1]) ? 1 : 0;
          const cur = r[0] === (on1 ? 1 : 0) && (!M.two || r[1] === (on2 ? 1 : 0));
          if (cur) { c.fillStyle = C.dark ? 'rgba(123,140,255,.28)' : 'rgba(79,70,229,.16)'; c.fillRect(tx, y, cw * 3, rh - 2); }
          kit.label(c, String(r[0]), tx + cw / 2, y + rh / 2, { color: C.text, size: 12 });
          kit.label(c, M.two ? String(r[1]) : '–', tx + cw * 1.5, y + rh / 2, { color: C.text, size: 12 });
          kit.label(c, String(out), tx + cw * 2.5, y + rh / 2, { color: out ? C.ok : C.muted, size: 12, weight: 700 });
        });
        kit.label(c, M.expr, tx, ty + 24 + rows.length * rh + 12, { color: C.accent, size: 12, weight: 700, align: 'left' });
        // supply main
        const junc = [[124, 385]];
        const mainPts = [[50, 375], [50, 385], [585, 385], [585, 282]];
        S.line(c, mainPts, { state: 'air' });
        S.source(c, 50, 395, { pneumatic: true });
        S.line(c, [[124, 385], [124, 325]], { state: 'air' });
        if (!series) { S.line(c, [[334, 385], [334, 325]], { state: M.two ? 'air' : 'idle' }); junc.push([334, 385]); }
        if (V.mode === 'not') { S.line(c, [[244, 385], [244, 225]], { state: 'air' }); junc.push([244, 385]); }
        junc.forEach(j => S.junction(c, j[0], j[1]));
        // the logic element and its signal lines
        const v5 = S.valve(c, 585, 255, { spec: '5/2', state: s.v5Pos, left: 'pilot', right: 'spring', s: 34, pneumatic: true, labels: true, exhaust: 'silencer' });
        const toPilot = [[450, 125], [450, 255], [v5.pilotL[0], 255]];
        let outPts;
        if (V.mode === 'or' || V.mode === 'and') {
          sigLine(S, c, [[124, 275], [124, 170], [210, 170]], g1, !on1);
          sigLine(S, c, [[334, 275], [334, 170], [270, 170]], g2, !on2);
          const side = s.pS1 > s.pS2 + 0.05e5 ? 1 : s.pS2 > s.pS1 + 0.05e5 ? -1 : 0;
          if (V.mode === 'or') S.shuttle(c, 240, 170, { side }); else S.andValve(c, 240, 170, { side });
          outPts = [[240, 151], [240, 125]].concat(toPilot);
          kit.label(c, V.mode === 'or' ? 'shuttle valve' : 'two-pressure valve', 240, 196, { color: C.muted, size: 10 });
          kit.label(c, '1', 205, 160, { color: C.muted, size: 10 }); kit.label(c, '1', 275, 160, { color: C.muted, size: 10 }); kit.label(c, '2', 250, 143, { color: C.muted, size: 10 });
        } else if (series) {
          sigLine(S, c, [[124, 275], [124, 250], [230, 250], [230, 352], [334, 352], [334, 325]], g1, !on1);
          outPts = [[334, 275], [334, 125]].concat(toPilot);
          kit.label(c, 'S2 is fed from S1', 250, 342, { color: C.muted, size: 10, align: 'left' });
        } else if (V.mode === 'not') {
          const ev = S.valve(c, 250, 200, { spec: '3/2 NO', state: s.elPos, left: 'pilot', right: 'spring', s: 30, pneumatic: true, labels: true, exhaust: 'silencer' });
          sigLine(S, c, [[124, 275], [124, 200], [ev.pilotL[0], 200]], g1, !on1);
          outPts = [[244, 175], [244, 125]].concat(toPilot);
          kit.label(c, '3/2 NO', ev.xr + 6, 200, { color: C.muted, size: 10, align: 'left' });
        } else {
          sigLine(S, c, [[124, 275], [124, 250], [244, 250], [244, 225]], g1, !on1);
          const ev = S.valve(c, 250, 200, { spec: NO_R, state: s.elPos, left: 'spring', right: 'pilot', s: 30, pneumatic: true, labels: true, exhaust: 'silencer' });
          sigLine(S, c, [[334, 275], [334, 200], [ev.pilotR[0], 200]], g2, !on2);
          outPts = [[244, 175], [244, 125]].concat(toPilot);
          kit.label(c, '3/2 NO', ev.xl - 6, 186, { color: C.muted, size: 10, align: 'right' });
        }
        sigLine(S, c, outPts, go, target < s.pOut - 0.02e5);
        // push-button valves
        const b1 = S.valve(c, 130, 300, { spec: '3/2 NC', state: s.b1, left: 'pushbutton', right: 'spring', s: 30, pneumatic: true, labels: true, exhaust: 'silencer' });
        const b2 = S.valve(c, 340, 300, { spec: '3/2 NC', state: s.b2, left: 'pushbutton', right: 'spring', s: 30, pneumatic: true, labels: true, exhaust: 'silencer', color: M.two ? undefined : C.faint });
        kit.label(c, 'S1', b1.xr + 8, 300, { color: on1 ? C.warn : C.text, size: 12, weight: 700, align: 'left' });
        kit.label(c, 'S2', b2.xr + 8, 300, { color: !M.two ? C.faint : on2 ? C.warn : C.text, size: 12, weight: 700, align: 'left' });
        if (!M.two) kit.label(c, 'not used', 340, 270, { color: C.faint, size: 10 });
        kit.label(c, 'hold to press', 230, 410, { color: C.faint, size: 10 });
        // power valve and cylinder
        const LA = [[478, 100], [478, 160], [576.5, 160], [576.5, 228]], LB = [[682, 100], [682, 185], [593.5, 185], [593.5, 228]];
        S.line(c, LA, { state: airState(pA, !s.v5) }); S.line(c, LB, { state: airState(pB, s.v5) });
        const qref = CV * psup * 1.185;
        dots(S, c, s.ph, 'a', LA.slice().reverse(), cyl.s.mA, qref, dt, S.col(s.v5 ? 'air' : 'exhaust'));
        dots(S, c, s.ph, 'b', LB.slice().reverse(), cyl.s.mB, qref, dt, S.col(s.v5 ? 'exhaust' : 'air'));
        S.cylinder(c, 470, 70, { len: 220, h: 40, rodLen: 45, pos: cyl.s.x / 0.1, fillA: shade(C, pA, pmax), fillB: shade(C, pB, pmax) });
        kit.label(c, '14', v5.pilotL[0] + 4, 242, { color: s.v5 ? C.warn : C.muted, size: 11, weight: 700 });
        kit.label(c, 'power valve', v5.xr + 8, 255, { color: C.muted, size: 10, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ time-delay valve */
  // time to drain a reservoir from absolute pressure p1 to p2 into the atmosphere through conductance C: τ = V/(C p_ref)
  function drainTime(tau, p1, p2) {
    if (!(p1 > p2) || !(p2 > PATM)) return Infinity;
    let p = p1, t = 0;
    const n = 4000, dlp = Math.log(p1 / p2) / n;
    for (let i = 0; i < n; i++) {
      const pm = p * Math.exp(-dlp / 2), r = PATM / pm;
      const phi = r <= BCRIT ? 1 : Math.sqrt(Math.max(1e-9, 1 - Math.pow((r - BCRIT) / (1 - BCRIT), 2)));
      t += tau * dlp / phi; p *= Math.exp(-dlp);
    }
    return t;
  }
  // on-delay by ISO 6358, isothermal: t = τ[(b − r0) + (1 − b)·asin((rs − b)/(1 − b))], r = p/p1
  function fillTime(tau, p1, p0, ps) {
    const r0 = p0 / p1, rs = ps / p1;
    if (!(rs < 1)) return Infinity;
    if (rs <= BCRIT) return tau * (rs - r0);
    return tau * ((BCRIT - Math.min(r0, BCRIT)) + (1 - BCRIT) * (Math.asin((rs - BCRIT) / (1 - BCRIT)) - Math.asin(Math.max(0, (r0 - BCRIT) / (1 - BCRIT)))));
  }
  Hyper.sim('fv-delay', {
    title: 'A time-delay valve',
    blurb: `A pneumatic timer is three parts in one body: a one-way flow control, a small reservoir, and a 3/2 valve piloted by the reservoir's pressure. As an **on-delay**, the signal from S1 fills the reservoir through the throttle; when the pressure reaches the switching pressure the 3/2 valve opens and the cylinder extends. Removing the signal empties the reservoir at once through the check valve, so the timer resets. As an **off-delay** the check valve faces the other way: the reservoir fills at once, and after the signal goes the throttle bleeds it down until the valve closes. The reservoir is filled and emptied by ISO 6358 (isothermal: a slow fill); the plot shows its pressure against the switching and resetting pressures.

**Try this**
- Halve the throttle's conductance or double the reservoir: the delay doubles, because it scales with the time constant $\\tau = V/(C\\,p_\\text{ref})$.
- Raise the switching pressure towards the supply pressure: the delay grows fast, because the last bar fills slowly (the flow is no longer choked). Timers are set with the switching pressure well below the supply.
- Change the supply pressure by 1 bar and watch the delay change: a timer's accuracy is only as good as the steadiness of its air.
- Give a short pulse to an on-delay: if the signal goes before the delay is over, nothing happens — the timer filters short signals.
- Switch to off-delay and pulse S1: the output comes on at once and stays on for the delay after the pulse ends.`,
    mount(box, kit) {
      FL = kit.fluid;
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const [g1] = graphs(box, 1);
      let auto = true, pulse = 0;
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'pulse', label: 'Pulse S1 (1 s)', primary: true }, { id: 'reset', label: 'Reset' }] },
        { id: 'hold', type: 'check', label: 'Hold S1', value: false },
        { id: 'auto', type: 'check', label: 'Signal on and off automatically', value: true },
        { id: 'type', type: 'select', label: 'Timer', options: [['On-delay (throttle into the reservoir)', 'on'], ['Off-delay (throttle out of the reservoir)', 'off']], value: 'on' },
        { id: 'ct', label: 'Throttle conductance C', min: 0.002, max: 0.2, step: 0.001, value: 0.01, unit: 'dm³/(s·bar)', log: true },
        { id: 'vr', label: 'Reservoir volume', min: 0.01, max: 1, step: 0.01, value: 0.1, unit: 'L', log: true },
        { id: 'psw', label: 'Switching pressure (gauge)', min: 1, max: 5, step: 0.1, value: 3, unit: 'bar' },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 3, max: 8, step: 0.1, value: 6, unit: 'bar' },
        { id: 'speed', type: 'select', label: 'Time', options: [['Real time', 1], ['Fast ×4', 4], ['Fast ×10', 10]], value: 1 }
      ], (id, v) => {
        if (id === 'pulse') { pulse = 1; stopAuto(); }
        if (id === 'hold' && v) stopAuto();
        if (id === 'auto') { auto = v; }
        if (id === 'reset' || id === 'type') reset();
      });
      function stopAuto() { auto = false; ctl.set('auto', false); }
      const ro = kit.readout(box.side, [['tau', 'Time constant τ = V/(C·p_ref)'], ['pred', 'Delay by the formula'], ['meas', 'Delay measured'], ['p', 'Reservoir pressure'], ['out', 'Output']]);
      const plot = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'gauge pressure (bar)', min: 0 }, legend: true }, 150);
      const V = ctl.values;
      const pads = [{ x0: 55, y0: 300, x1: 150, y1: 340, on: false }];
      let fr = frameOf(st, 760, 420);
      holdPads(st, () => fr, pads, () => stopAuto());
      const cyl = cylModel({ bore: 0.02, rod: 0.008, stroke: 0.04, mass: 0.3, single: true, k0: 8, k1: 250, fc: 3, fsr: 1.3, fv: 10, deadA: 2e-6 });
      let s;
      function reset() {
        s = { t: 0, pin: PATM, pres: PATM, on: false, vpos: 1, bpos: 1, sig: false, tEdge: 0, meas: null, pending: false, autoPhase: 0, autoT: 0, hist: [], tPlot: 0, ph: {}, tOutEdge: -1 };
        cyl.s.x = 0; cyl.s.v = 0; cyl.s.pA = PATM;
      }
      reset();
      const loop = kit.loop(dt => {
        fr = frameOf(st, 760, 420);
        const sdt = Math.min(dt, 0.05) * V.speed, psup = V.ps * 1e5 + PATM, Ct = V.ct * 1e-8, Vr = V.vr * 1e-3, Cs1 = 0.2e-8, Cc = 0.5e-8, Vin = 5e-6;
        const pSw = PATM + V.psw * 1e5, pRs = PATM + 0.6 * V.psw * 1e5, off = V.type === 'off';
        const tau = Vr / (Ct * PREF);
        const pred = off ? drainTime(tau, psup, pRs) : fillTime(tau, psup, PATM, pSw);
        // automatic signal: on until the timer has acted plus 1.5 s, then off likewise
        pulse = Math.max(0, pulse - sdt);
        // phase 0 = signal on, phase 1 = signal off; each lasts until the timer has acted, plus 1.5 s
        if (auto) {
          s.autoT += sdt;
          if (s.autoPhase === 0 && (off ? s.autoT > 1.5 : (s.on && s.t - (s.tOn || s.t) > 1.5))) { s.autoPhase = 1; s.autoT = 0; }
          else if (s.autoPhase === 1 && s.autoT > 0.2 && (off ? (!s.on && s.t - (s.tOff || s.t) > 1.5) : (s.autoT > 1.5 && s.pres < PATM + 0.1e5))) { s.autoPhase = 0; s.autoT = 0; }
        }
        const sig = !!(V.hold || pads[0].on || pulse > 0 || (auto && s.autoPhase === 0));
        if (sig !== s.sig) { s.sig = sig; s.tEdge = s.t; s.pending = sig ? !off : off; }
        // the input line, the throttle, the check valve and the reservoir (isothermal), in sub-steps of 0.2 ms
        const n = Math.max(1, Math.ceil(sdt / 2e-4)), h = sdt / n, RT = RG * TREF, crack = 0.05e5;
        for (let i = 0; i < n; i++) {
          const mIn = sig ? mflow(Cs1, psup, s.pin) : mflow(Cs1, PATM, s.pin);
          const mT = mflow(Ct, s.pin, s.pres);                        // positive into the reservoir
          let mC = 0;                                                 // check valve, positive into the reservoir
          if (!off && s.pres > s.pin + crack) mC = -mflow(Cc, s.pres, s.pin);
          if (off && s.pin > s.pres + crack) mC = mflow(Cc, s.pin, s.pres);
          s.pin = Math.max(1000, s.pin + h * RT / Vin * (mIn - mT - mC));
          s.pres = Math.max(1000, s.pres + h * RT / Vr * (mT + mC)); s.mRes = mT + mC;
          if (!s.on && s.pres >= pSw) { s.on = true; s.tOn = s.t + h * i; if (s.pending && sig) { s.meas = s.tOn - s.tEdge; s.pending = false; } }
          if (s.on && s.pres < pRs) { s.on = false; s.tOff = s.t + h * i; if (s.pending && !sig) { s.meas = s.tOff - s.tEdge; s.pending = false; } }
        }
        const Cv = 0.5e-8;
        cyl.step(sdt, q => [s.on ? mflow(Cv, psup, q.pA) : mflow(Cv, PATM, q.pA), 0]);
        s.t += sdt;
        s.vpos = toward(s.vpos, s.on ? 0 : 1, sdt, 0.02);
        s.bpos = toward(s.bpos, sig ? 0 : 1, sdt, 0.015);
        const gin = s.pin - PATM, gres = s.pres - PATM, gcyl = cyl.s.pA - PATM;
        ro.set('tau', tau < 100 ? tau.toFixed(2) + ' s' : tau.toFixed(0) + ' s');
        ro.set('pred', isFinite(pred) ? secs(pred) + (off ? ' (numerical)' : '') : 'never: switching pressure not reached');
        ro.set('meas', s.pending ? 'timing… ' + (s.t - s.tEdge).toFixed(2) + ' s' : secs(s.meas));
        ro.set('p', bar(gres) + ' (switches at ' + V.psw.toFixed(1) + ', resets at ' + (0.6 * V.psw).toFixed(1) + ')');
        ro.set('out', s.on ? 'ON — cylinder out' : 'off');
        s.hist.push([s.t, gres / 1e5, s.on ? V.ps : 0, gin / 1e5]);
        const span = Math.max(8, Math.min(120, 2.4 * (isFinite(pred) ? pred : 8) + 4));
        while (s.hist.length && s.hist[0][0] < s.t - span) s.hist.shift();
        s.tPlot += dt;
        if (s.tPlot > 0.08) {
          s.tPlot = 0;
          const step = Math.max(1, Math.floor(s.hist.length / 400));
          const hh = s.hist.filter((q, i) => i % step === 0);
          plot.set({ series: [{ pts: hh.map(q => [q[0], q[1]]), label: 'reservoir' }, { pts: hh.map(q => [q[0], q[3]]), label: 'signal S1', dash: [2, 3] }, { pts: hh.map(q => [q[0], q[2]]), label: 'output', dash: [6, 4] }],
            y: { label: 'gauge pressure (bar)', min: 0, max: V.ps + 0.5 }, hlines: [{ y: V.psw, label: 'switch' }, { y: 0.6 * V.psw, label: 'reset' }] });
        }
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin(), C = kit.colors();
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const qref = Cs1 * psup * 1.185;
        // the time-delay valve's outline
        S.line(c, [[188, 62], [470, 62], [470, 280], [188, 280], [188, 62]], { color: C.muted, width: 1.2, kind: 'drain' });
        kit.label(c, 'time-delay valve', 196, 74, { color: C.muted, size: 11, align: 'left' });
        // supply
        S.line(c, [[40, 378], [40, 388], [403.2, 388], [403.2, 227]], { state: 'air' });
        S.line(c, [[104, 388], [104, 345]], { state: 'air' }); S.junction(c, 104, 388);
        S.source(c, 40, 398, { pneumatic: true });
        // S1 → throttle → reservoir; reservoir → pilot
        const inPts = [[104, 295], [104, 260], [250, 260], [250, 228]];
        sigLine(S, c, inPts, gin, !sig);
        dots(S, c, s.ph, 'in', inPts, s.mRes || 0, Math.max(1e-9, Math.max(Ct, 0.02e-8) * psup * 1.185), dt, S.col(sig ? 'pilot' : 'exhaust'));
        sigLine(S, c, [[250, 152], [250, 172]], gres, gres < gin);
        sigLine(S, c, [[250, 160], [310, 160], [310, 200]], gres, false);
        S.junction(c, 250, 160);
        S.flowControl(c, 250, 200, { free: off ? 'up' : 'down' });
        const fill = gres > 0.05e5 ? (C.dark ? 'rgba(255,159,64,' : 'rgba(217,115,13,') + (0.12 + 0.5 * Math.min(1, gres / (V.ps * 1e5))).toFixed(2) + ')' : null;
        reservoirSym(c, 250, 110, 34, 64, fill, C.text);
        kit.label(c, (V.vr * 1000).toFixed(0) + ' cm³', 275, 96, { color: C.muted, size: 10, align: 'left' });
        kit.label(c, (gres / 1e5).toFixed(2) + ' bar', 275, 112, { color: C.text, size: 12, weight: 700, align: 'left' });
        kit.label(c, 'C = ' + V.ct.toFixed(3), 196, 200, { color: C.muted, size: 10, align: 'left' });
        const v3 = S.valve(c, 410, 200, { spec: '3/2 NC', state: s.vpos, left: 'pilot', right: 'spring', s: 34, pneumatic: true, labels: true, exhaust: 'silencer' });
        sigLine(S, c, [[310, 200], [v3.pilotL[0], 200]], gres, false);
        kit.label(c, '12', v3.pilotL[0] + 4, 188, { color: s.on ? C.warn : C.muted, size: 11, weight: 700 });
        // adjustable switching spring
        S.line(c, [[v3.xr - 4, 214], [v3.xr + 14, 186]], { color: C.text, width: 1.2 }); S.head(c, v3.xr + 16, 183, Math.atan2(-28, 18), 6, C.text);
        kit.label(c, V.psw.toFixed(1) + ' bar', v3.xr + 18, 212, { color: C.muted, size: 10, align: 'left' });
        // output to a small single-acting cylinder
        const outPts = [[403.2, 173], [403.2, 125], [560, 125], [560, 90]];
        S.line(c, outPts, { state: airState(gcyl, !s.on) });
        dots(S, c, s.ph, 'o', outPts, cyl.s.mA, 0.5e-8 * psup * 1.185, dt, S.col(s.on ? 'air' : 'exhaust'));
        S.cylinder(c, 552, 62, { len: 150, h: 36, rodLen: 40, pos: spos(cyl.s.x / 0.04), single: 'retract', fillA: shade(C, gcyl, V.ps * 1e5) });
        kit.label(c, s.on ? 'OUTPUT ON' : 'output off', 620, 118, { color: s.on ? C.ok : C.muted, size: 12, weight: 700 });
        // S1
        const b1 = S.valve(c, 110, 320, { spec: '3/2 NC', state: s.bpos, left: 'pushbutton', right: 'spring', s: 30, pneumatic: true, labels: true, exhaust: 'silencer' });
        kit.label(c, 'S1', b1.xr + 8, 320, { color: sig ? C.warn : C.text, size: 12, weight: 700, align: 'left' });
        kit.label(c, 'hold to press', 100, 356, { color: C.faint, size: 10, align: 'right' });
        kit.label(c, s.pending ? 'timing ' + (s.t - s.tEdge).toFixed(2) + ' s' : (s.meas != null ? 'last delay ' + secs(s.meas) : ''), 480, 330, { color: C.accent, size: 14, weight: 700, align: 'left' });
        kit.label(c, 't = ' + s.t.toFixed(1) + ' s', 750, 410, { color: C.muted, size: 11, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ memory: the impulse valve */
  Hyper.sim('fv-memory', {
    title: 'Memory with an impulse valve',
    blurb: `A 5/2 valve piloted from both sides and with no spring — an **impulse valve** — stays in whichever position its last signal put it. S1 sets it (pilot 14: the cylinder extends), S2 resets it (pilot 12: the cylinder retracts). A short pulse is enough; with both signals present the spool, pushed equally from both ends, does not move. Switch to a **spring-return** valve to compare: it only stays switched while S1 is held.

**Try this**
- Pulse S1, then S2: a moment's signal switches the valve and the cylinder completes its stroke on its own.
- Hold S1 and press S2 as well: nothing happens. Release S1 while still holding S2: now the valve resets. The later signal waits for the earlier one to go — the root of signal overlap in sequences.
- Turn the air off in mid-stroke, press the manual override, and turn the air on again: the cylinder moves at once to where the valve now points. An impulse valve remembers through a power cut — which is why restarting a machine needs care.
- Repeat with the spring-return valve: after the air comes back, it always starts from its spring position.`,
    mount(box, kit) {
      FL = kit.fluid;
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      let p1 = 0, p2 = 0;
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'set', label: 'Set: pulse S1', primary: true }, { id: 'rst', label: 'Reset: pulse S2' }, { id: 'ovr', label: 'Manual override' }] },
        { id: 'h1', type: 'check', label: 'Hold S1', value: false },
        { id: 'h2', type: 'check', label: 'Hold S2', value: false },
        { id: 'air', type: 'check', label: 'Air supply on', value: true },
        { id: 'type', type: 'select', label: 'Valve', options: [['Impulse valve (double pilot, bistable)', 'impulse'], ['Spring-return valve (monostable)', 'spring']], value: 'impulse' },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 3, max: 8, step: 0.5, value: 6, unit: 'bar' },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25]], value: 0.25 }
      ], id => {
        if (id === 'set') p1 = 0.3;
        if (id === 'rst') p2 = 0.3;
        if (id === 'ovr') s.pos = s.pos > 0.5 ? 0 : 1;
      });
      const ro = kit.readout(box.side, [['sig', 'Pilot 14 / pilot 12'], ['v', 'Valve position'], ['c', 'Cylinder'], ['air', 'Air']]);
      const V = ctl.values;
      const pads = [{ x0: 55, y0: 300, x1: 150, y1: 340, on: false }, { x0: 465, y0: 300, x1: 560, y1: 340, on: false }];
      let fr = frameOf(st, 760, 420);
      holdPads(st, () => fr, pads);
      const cyl = cylModel({ bore: 0.04, rod: 0.016, stroke: 0.15, mass: 2, fc: 20, fsr: 1.3, fv: 30 });
      cyl.s.pB = V.ps * 1e5 + PATM;
      const s = { t: 0, p14: PATM, p12: PATM, pos: 1, vpos: 1, b1: 1, b2: 1, ph: {}, psup: V.ps * 1e5 + PATM };
      const loop = kit.loop(dt => {
        fr = frameOf(st, 760, 420);
        const sdt = Math.min(dt, 0.05) * V.slow, spring = V.type === 'spring';
        p1 = Math.max(0, p1 - sdt); p2 = Math.max(0, p2 - sdt);
        const on1 = !!(V.h1 || pads[0].on || p1 > 0), on2 = !!(V.h2 || pads[1].on || p2 > 0);
        // the supply: exhausted to the room when switched off (as a 3/2 shut-off valve does)
        s.psup = lag(s.psup, V.air ? V.ps * 1e5 + PATM : PATM, sdt, 0.05);
        s.p14 = lag(s.p14, on1 ? s.psup : PATM, sdt, 0.025);
        s.p12 = lag(s.p12, on2 && !spring ? s.psup : PATM, sdt, 0.025);
        const d = (s.p14 - PATM) - (spring ? 0 : s.p12 - PATM);
        if (spring) { if (s.p14 - PATM > 2.0e5) s.pos = 0; else if (s.p14 - PATM < 1.2e5) s.pos = 1; }
        else { if (d > 1.5e5) s.pos = 0; else if (d < -1.5e5) s.pos = 1; }
        s.vpos = toward(s.vpos, s.pos, sdt, 0.02);
        const CV = 0.4e-8, ext = s.pos === 0, ps = s.psup;
        cyl.step(sdt, ext ? q => [mflow(CV, ps, q.pA), mflow(CV, PATM, q.pB)] : q => [mflow(CV, PATM, q.pA), mflow(CV, ps, q.pB)]);
        s.t += sdt;
        s.b1 = toward(s.b1, on1 ? 0 : 1, sdt, 0.015); s.b2 = toward(s.b2, on2 ? 0 : 1, sdt, 0.015);
        const g14 = s.p14 - PATM, g12 = s.p12 - PATM, gs = s.psup - PATM;
        ro.set('sig', bar(g14, 1) + ' / ' + (spring ? '(spring)' : bar(g12, 1)));
        ro.set('v', ext ? '14: 1 → 4, extend' : '12: 1 → 2, retract');
        ro.set('c', cyl.s.x >= 0.1495 ? 'extended' : cyl.s.x <= 5e-4 ? 'retracted' : (Math.abs(cyl.s.v) > 1e-3 ? 'moving' : 'stopped at ' + (cyl.s.x * 1000).toFixed(0) + ' mm'));
        ro.set('air', V.air ? bar(gs, 1) : 'OFF, ' + bar(gs, 1) + ' left');
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin(), C = kit.colors();
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const pA = cyl.s.pA - PATM, pB = cyl.s.pB - PATM, pmax = V.ps * 1e5, sup = gs > 0.15e5 ? 'air' : 'idle';
        const main = [[40, 375], [40, 385], [514, 385], [514, 345]];
        S.line(c, main, { state: sup });
        S.line(c, [[104, 385], [104, 345]], { state: sup }); S.line(c, [[330, 385], [330, 267]], { state: sup });
        S.junction(c, 104, 385); S.junction(c, 330, 385);
        S.source(c, 40, 395, { pneumatic: true });
        if (!V.air) kit.label(c, 'AIR OFF', 60, 362, { color: C.bad, size: 12, weight: 700, align: 'left' });
        const LA = [[158, 101], [158, 165], [321.5, 165], [321.5, 213]], LB = [[402, 101], [402, 180], [338.5, 180], [338.5, 213]];
        S.line(c, LA, { state: airState(pA, !ext) }); S.line(c, LB, { state: airState(pB, ext) });
        const qref = CV * (V.ps * 1e5 + PATM) * 1.185;
        dots(S, c, s.ph, 'a', LA.slice().reverse(), cyl.s.mA, qref, dt, S.col(ext ? 'air' : 'exhaust'));
        dots(S, c, s.ph, 'b', LB.slice().reverse(), cyl.s.mB, qref, dt, S.col(ext ? 'exhaust' : 'air'));
        const v5 = S.valve(c, 330, 240, { spec: '5/2', state: s.vpos, left: 'pilot', right: spring ? 'spring' : 'pilot', s: 34, pneumatic: true, labels: true, exhaust: 'silencer' });
        sigLine(S, c, [[104, 295], [104, 240], [v5.pilotL[0], 240]], g14, !on1);
        kit.label(c, '14', v5.pilotL[0] + 4, 227, { color: g14 > 1e5 ? C.warn : C.muted, size: 11, weight: 700 });
        if (!spring) {
          sigLine(S, c, [[514, 295], [514, 240], [v5.pilotR[0], 240]], g12, !on2);
          kit.label(c, '12', v5.pilotR[0] - 4, 227, { color: g12 > 1e5 ? C.warn : C.muted, size: 11, weight: 700 });
        } else {
          S.line(c, [[514, 295], [514, 282]], { state: 'idle' }); S.plug(c, 514, 282);
        }
        kit.label(c, spring ? 'spring-return valve' : 'impulse valve', 330, 290, { color: C.muted, size: 10 });
        const b1 = S.valve(c, 110, 320, { spec: '3/2 NC', state: s.b1, left: 'pushbutton', right: 'spring', s: 30, pneumatic: true, labels: true, exhaust: 'silencer' });
        const b2 = S.valve(c, 520, 320, { spec: '3/2 NC', state: s.b2, left: 'pushbutton', right: 'spring', s: 30, pneumatic: true, labels: true, exhaust: 'silencer', color: spring ? C.faint : undefined });
        kit.label(c, 'S1 set', b1.xr + 8, 320, { color: on1 ? C.warn : C.text, size: 12, weight: 700, align: 'left' });
        kit.label(c, 'S2 reset', b2.xr + 8, 320, { color: spring ? C.faint : on2 ? C.warn : C.text, size: 12, weight: 700, align: 'left' });
        kit.label(c, 'hold to press', 300, 410, { color: C.faint, size: 10 });
        S.cylinder(c, 150, 70, { len: 260, h: 42, rodLen: 130, pos: cyl.s.x / 0.15, fillA: shade(C, pA, pmax), fillB: shade(C, pB, pmax) });
        // the state table
        const tx = 566, ty = 20, cw = [34, 34, 118];
        const rows = spring
          ? [['1', '0', 'switched: extends'], ['0', '0', 'spring: retracts'], ['0', '1', '(no pilot 12)'], ['1', '1', 'switched: extends']]
          : [['1', '0', 'set: extends'], ['0', '0', 'stays: memory'], ['0', '1', 'reset: retracts'], ['1', '1', 'no change']];
        kit.label(c, 'S1', tx + cw[0] / 2, ty, { color: C.muted, size: 11, weight: 700 });
        kit.label(c, 'S2', tx + cw[0] + cw[1] / 2, ty, { color: C.muted, size: 11, weight: 700 });
        kit.label(c, 'valve', tx + cw[0] + cw[1] + 6, ty, { color: C.muted, size: 11, weight: 700, align: 'left' });
        rows.forEach((r, j) => {
          const y = ty + 12 + j * 22, cur = r[0] === (on1 ? '1' : '0') && r[1] === (on2 ? '1' : '0');
          if (cur) { c.fillStyle = C.dark ? 'rgba(123,140,255,.28)' : 'rgba(79,70,229,.16)'; c.fillRect(tx, y, cw[0] + cw[1] + cw[2], 20); }
          kit.label(c, r[0], tx + cw[0] / 2, y + 10, { color: C.text, size: 12 });
          kit.label(c, r[1], tx + cw[0] + cw[1] / 2, y + 10, { color: C.text, size: 12 });
          kit.label(c, r[2], tx + cw[0] + cw[1] + 6, y + 10, { color: C.text, size: 11, align: 'left' });
        });
        kit.label(c, 't = ' + s.t.toFixed(2) + ' s', 750, 410, { color: C.muted, size: 11, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pressure-dependent control */
  Hyper.sim('fv-pseq', {
    title: 'Clamp until the force is reached',
    blurb: `A clamp cylinder (50 mm bore, 100 mm stroke) is started by S1 through an impulse valve (pilot 14). When the jaw meets the part, the cap-end pressure climbs towards the supply; when it reaches the setting of the **pressure sequence valve** 1V2 — a 3/2 valve held shut by an adjustable spring and piloted by the cap-end pressure — 1V2 passes air through the roller limit valve 1S2 (actuated at the end of the stroke: an AND) to pilot 12, and the clamp releases. The model is the same as in the other circuits: chambers by ISO 6358, piston against friction; the gauges are live.

**Try this**
- As set, the clamp presses the part, the cap end climbs to the setting and the clamp lets go with about $p_s\\,A_1$ — compare the two read-outs.
- Untick the limit valve 1S2 and lower the setting to 4.5 bar: the clamp turns back halfway. A starting cylinder's driving chamber shoots up towards the supply pressure before the rod side has emptied enough to let the piston move, and it stays high while moving, so a cap-end pressure alone cannot tell "moving" from "clamped".
- With 1S2 back in, close the meter-out throttles to 20 %: now the cap end runs above the setting for the whole stroke, 1V2 is already open when the rod presses 1S2, and the clamp lets go the instant it arrives — with a tenth of the force, because the rod end has not emptied. The real clamping force is $p_A A_1 - p_B A_2$; the setting must lie above the running pressure.
- Lower the supply below the setting: the clamp never lets go. The setting must stay below the lowest supply pressure the machine will ever see.`,
    mount(box, kit) {
      FL = kit.fluid;
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const [g1, g2] = graphs(box, 2);
      let auto = true, p1 = 0;
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'start', label: 'Start: pulse S1', primary: true }] },
        { id: 'auto', type: 'check', label: 'Restart automatically', value: true },
        { id: 'lim', type: 'check', label: 'Limit valve 1S2 in series (AND)', value: true },
        { id: 'set', label: 'Sequence valve setting (gauge)', min: 1, max: 7, step: 0.1, value: 5.6, unit: 'bar' },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 3, max: 8, step: 0.1, value: 6, unit: 'bar' },
        { id: 'thr', label: 'Meter-out throttles open', min: 5, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'mass', label: 'Moving mass', min: 0.5, max: 20, step: 0.1, value: 2, unit: 'kg', log: true },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25]], value: 0.25 }
      ], (id, v) => {
        if (id === 'start') { p1 = 0.1; auto = false; ctl.set('auto', false); }
        if (id === 'auto') auto = v;
      });
      const ro = kit.readout(box.side, [['fs', 'Setting × piston area, p_s·A₁'], ['run', 'Cap end: at breakaway / while moving'], ['rel', 'Released'], ['frel', 'Clamp force at release (rod end)'], ['cl', 'Time pressed on the part']]);
      const pPos = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'position (mm)', min: 0, max: 100 } }, 130);
      const pPr = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'gauge pressure (bar)', min: 0 }, legend: true }, 130);
      const V = ctl.values, STROKE = 0.1, CV = 1.2e-8, CT = 2e-8;
      const pads = [{ x0: 15, y0: 310, x1: 110, y1: 350, on: false }];
      let fr = frameOf(st, 760, 420);
      holdPads(st, () => fr, pads, () => { auto = false; ctl.set('auto', false); });
      const cyl = cylModel({ bore: 0.05, rod: 0.02, stroke: STROKE, mass: 2, fc: 15 + 0.03 * 6e5 * Math.PI * 0.05 * 0.05 / 4, fsr: 1.3, fv: 40, deadA: 1e-5, deadB: 1e-5 });
      cyl.s.pB = V.ps * 1e5 + PATM;
      const s = { t: 0, p14: PATM, p12: PATM, pos: 1, vpos: 1, seq: false, seqPos: 0, lim: false, limPos: 1, b1: 1, idle: 0, brk: null, run: 0, rel: null, relX: null, relB: null, clampT: null, tHit: null, hist: [], tPlot: 0, ph: {}, waiting: false };
      const loop = kit.loop(dt => {
        fr = frameOf(st, 760, 420);
        const sdt = Math.min(dt, 0.05) * V.slow, psup = V.ps * 1e5 + PATM, ct = V.thr / 100 * CT;
        cyl.P.mass = V.mass;
        p1 = Math.max(0, p1 - sdt);
        // automatic start: 1 s after the clamp is back
        if (auto && s.pos === 1 && cyl.s.x <= 5e-4) { s.idle += sdt; if (s.idle > 1) { p1 = 0.1; s.idle = 0; } } else s.idle = 0;
        const on1 = !!(pads[0].on || p1 > 0);
        const pAg = cyl.s.pA - PATM;
        // 1V2 opens at its setting and closes 0.5 bar lower; 1S2 is pressed by the rod in its last millimetre
        if (!s.seq && pAg >= V.set * 1e5) s.seq = true;
        if (s.seq && pAg < Math.max(0.3, V.set - 0.5) * 1e5) s.seq = false;
        s.lim = cyl.s.x >= STROKE - 1e-3;
        const sig12 = s.seq && (!V.lim || s.lim);
        s.p14 = lag(s.p14, on1 ? psup : PATM, sdt, 0.02);
        s.p12 = lag(s.p12, sig12 ? psup : PATM, sdt, 0.02);
        const d = s.p14 - s.p12;
        const was = s.pos;
        if (d > 1.5e5) s.pos = 0; else if (d < -1.5e5) s.pos = 1;
        if (s.pos === 0 && was === 1) { s.run = 0; s.brk = null; s.tHit = null; s.rel = null; s.relX = null; s.relB = null; s.clampT = null; }
        if (s.pos === 1 && was === 0) {               // released: record where and with what force
          s.rel = (cyl.s.pA - PATM) * cyl.AA - (cyl.s.pB - PATM) * cyl.AB; s.relX = cyl.s.x; s.relB = cyl.s.pB - PATM;
          s.clampT = s.tHit != null ? s.t - s.tHit : null;
        }
        const ext = s.pos === 0;
        cyl.step(sdt, ext ? q => [mflow(ser(CV, CT + ct), psup, q.pA), mflow(ser(CV, ct), PATM, q.pB)] : q => [mflow(ser(CV, ct), PATM, q.pA), mflow(ser(CV, CT + ct), psup, q.pB)]);
        s.t += sdt;
        if (ext && s.brk == null && cyl.s.x > 5e-4) s.brk = cyl.s.pA - PATM;
        if (ext && cyl.s.x > 0.1 * STROKE && cyl.s.x < 0.95 * STROKE) s.run = Math.max(s.run, cyl.s.pA - PATM);
        if (ext && s.tHit == null && cyl.s.x >= STROKE - 1e-4) s.tHit = s.t;
        s.waiting = ext && cyl.s.x >= STROKE - 1e-4 && V.set > V.ps - 0.05;
        s.vpos = toward(s.vpos, s.pos, sdt, 0.02);
        s.seqPos = toward(s.seqPos, s.seq ? 1 : 0, sdt, 0.015);
        s.limPos = toward(s.limPos, s.lim ? 0 : 1, sdt, 0.015);
        s.b1 = toward(s.b1, on1 ? 0 : 1, sdt, 0.015);
        const pA = cyl.s.pA - PATM, pB = cyl.s.pB - PATM;
        ro.set('fs', (V.set * 1e5 * cyl.AA).toFixed(0) + ' N');
        ro.set('run', (s.brk == null ? '—' : bar(s.brk, 1)) + ' / ' + (s.run > 0 ? bar(s.run, 1) : '—'));
        ro.set('rel', s.waiting ? 'never: the setting is above the supply' : s.relX == null ? '—' : (s.relX < STROKE - 1e-3 ? 'EARLY, at ' + (s.relX * 1000).toFixed(0) + ' mm, before the part' : 'at the part'));
        ro.set('frel', s.relX == null || s.relX < STROKE - 1e-3 ? '—' : s.rel.toFixed(0) + ' N (rod end ' + bar(Math.max(0, s.relB), 1) + ')');
        ro.set('cl', s.clampT == null ? '—' : secs(s.clampT));
        s.hist.push([s.t, cyl.s.x * 1000, pA / 1e5, pB / 1e5]);
        while (s.hist.length && s.hist[0][0] < s.t - 4) s.hist.shift();
        s.tPlot += dt;
        if (s.tPlot > 0.06) {
          s.tPlot = 0;
          const hh = s.hist.filter((q, i) => i % 2 === 0);
          pPos.set({ series: [{ pts: hh.map(q => [q[0], q[1]]), label: 'position' }] });
          pPr.set({ series: [{ pts: hh.map(q => [q[0], q[2]]), label: 'cap end' }, { pts: hh.map(q => [q[0], q[3]]), label: 'rod end', dash: [5, 4] }],
            y: { label: 'gauge pressure (bar)', min: 0, max: Math.max(V.ps, V.set) + 1 }, hlines: [{ y: V.set, label: '1V2 setting' }] });
        }
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin(), C = kit.colors();
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const pmax = V.ps * 1e5, qref = CV * psup * 1.185;
        // supply
        S.line(c, [[40, 378], [40, 385], [594, 385], [594, 345]], { state: 'air' });
        S.line(c, [[64, 385], [64, 355]], { state: 'air' }); S.line(c, [[330, 385], [330, 277]], { state: 'air' });
        S.junction(c, 64, 385); S.junction(c, 330, 385);
        S.source(c, 40, 398, { pneumatic: true });
        // cylinder lines through the meter-out flow controls
        const LA = [[158, 102], [158, 112]], LA2 = [[158, 168], [158, 190], [321.5, 190], [321.5, 223]];
        const LB = [[402, 102], [402, 112]], LB2 = [[402, 168], [402, 205], [338.5, 205], [338.5, 223]];
        const sA = airState(pA, !ext), sB = airState(pB, ext);
        S.line(c, LA, { state: sA }); S.line(c, LA2, { state: sA }); S.line(c, LB, { state: sB }); S.line(c, LB2, { state: sB });
        dots(S, c, s.ph, 'a', LA2.slice().reverse().concat(LA.slice().reverse()), cyl.s.mA, qref, dt, S.col(ext ? 'air' : 'exhaust'));
        dots(S, c, s.ph, 'b', LB2.slice().reverse().concat(LB.slice().reverse()), cyl.s.mB, qref, dt, S.col(ext ? 'exhaust' : 'air'));
        S.flowControl(c, 158, 140, { free: 'up' }); S.flowControl(c, 402, 140, { free: 'up' });
        kit.label(c, V.thr.toFixed(0) + ' %', 430, 140, { color: C.muted, size: 10, align: 'left' });
        // the sensing line from the cap end to 1V2's pilot
        const v2 = S.valve(c, 600, 320, { spec: NC_R, state: s.seqPos, left: 'spring', right: 'pilot', s: 30, pneumatic: true, labels: true, exhaust: 'silencer' });
        sigLine(S, c, [[158, 106], [120, 106], [120, 30], [690, 30], [690, 320], [v2.pilotR[0], 320]], pA, false);
        S.junction(c, 158, 106);
        S.line(c, [[v2.xl + 2, 334], [v2.xl + 20, 306]], { color: C.text, width: 1.2 }); S.head(c, v2.xl + 22, 303, Math.atan2(-28, 18), 6, C.text);
        kit.label(c, '1V2 ' + V.set.toFixed(1) + ' bar', 640, 352, { color: s.seq ? C.warn : C.muted, size: 11, weight: 700, align: 'left' });
        kit.label(c, 'cap end', 697, 190, { color: C.muted, size: 10, align: 'left' });
        kit.label(c, (pA / 1e5).toFixed(2) + ' bar', 697, 206, { color: C.text, size: 11, weight: 700, align: 'left' });
        // the impulse valve and its two pilots; 1V2's output reaches pilot 12 through the limit valve 1S2 (AND)
        const v5 = S.valve(c, 330, 250, { spec: '5/2', state: s.vpos, left: 'pilot', right: 'pilot', s: 34, pneumatic: true, labels: true, exhaust: 'silencer' });
        sigLine(S, c, [[64, 305], [64, 250], [v5.pilotL[0], 250]], s.p14 - PATM, !on1);
        const to12 = [[594, 175], [470, 175], [470, 250], [v5.pilotR[0], 250]];
        const g2 = s.seq ? V.ps * 1e5 : 0;
        if (V.lim) {
          sigLine(S, c, [[594, 295], [594, 245]], g2, false);
          sigLine(S, c, [[594, 195]].concat(to12), s.p12 - PATM, !(s.seq && s.lim));
          const lv = S.valve(c, 600, 220, { spec: '3/2 NC', state: s.limPos, left: 'roller', right: 'spring', s: 30, pneumatic: true, labels: true, exhaust: 'silencer' });
          kit.label(c, '1S2', lv.xr + 8, 220, { color: s.lim ? C.warn : C.muted, size: 11, weight: 700, align: 'left' });
          // where 1S2 sits: at the end of the stroke
          S.line(c, [[494, 96], [494, 112]], { color: s.lim ? C.warn : C.muted, width: 1.6 });
          kit.label(c, '1S2', 494, 122, { color: s.lim ? C.warn : C.muted, size: 10 });
        } else {
          sigLine(S, c, [[594, 295]].concat(to12), s.p12 - PATM, !s.seq);
        }
        kit.label(c, '14', v5.pilotL[0] + 4, 237, { color: s.p14 - PATM > 1e5 ? C.warn : C.muted, size: 11, weight: 700 });
        kit.label(c, '12', v5.pilotR[0] - 4, 237, { color: s.p12 - PATM > 1e5 ? C.warn : C.muted, size: 11, weight: 700 });
        const b1 = S.valve(c, 70, 330, { spec: '3/2 NC', state: s.b1, left: 'pushbutton', right: 'spring', s: 30, pneumatic: true, labels: true, exhaust: 'silencer' });
        kit.label(c, 'S1 start', b1.xr + 8, 330, { color: on1 ? C.warn : C.text, size: 12, weight: 700, align: 'left' });
        // clamp, part and jaw
        const cy = S.cylinder(c, 150, 70, { len: 260, h: 44, rodLen: 90, pos: cyl.s.x / STROKE, fillA: shade(C, pA, pmax), fillB: shade(C, pB, pmax) });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(cy.tip[0], 58, 10, 24); c.strokeRect(cy.tip[0], 58, 10, 24);
        c.fillStyle = C.dark ? 'rgba(224,160,48,.35)' : 'rgba(217,115,13,.25)'; c.fillRect(508, 50, 32, 40); c.strokeRect(508, 50, 32, 40);
        kit.label(c, 'part', 524, 100, { color: C.muted, size: 10 });
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let y = 42; y < 100; y += 7) { c.beginPath(); c.moveTo(540, y + 7); c.lineTo(552, y); c.stroke(); }
        S.line(c, [[540, 40], [540, 100]], { color: C.muted, width: 1.6 });
        if (cyl.s.x >= STROKE - 1e-4) kit.label(c, 'force ' + Math.max(0, pA * cyl.AA - pB * cyl.AB).toFixed(0) + ' N', 560, 70, { color: C.accent, size: 12, weight: 700, align: 'left' });
        kit.label(c, 't = ' + s.t.toFixed(2) + ' s', 750, 410, { color: C.muted, size: 11, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
