/* HYPER-FEYNMAN · sims/vibrations-waves.js — rotation, oscillators and waves (FLP I-18 to I-25, I-47 to I-51).
 *   osc-spin-wheel   a turntable with sliding weights: torque changes L, pulling the weights in keeps L and raises ω
 *   osc-gyroscope    a spinning wheel on a pivot in 3-D: spin, torque and precession vectors; nutation from a release at rest
 *   osc-phasor       a mass on a spring beside the rotating arrow whose shadow is the motion, x = Re(A e^{iωt})
 *   osc-complex      complex numbers as arrows: multiplying, e^(iθ) round the circle, Euler's series term by term, small steps
 *   osc-resonance    a driven, damped oscillator: motion, force and response arrows, the resonance curve and the phase lag
 *   osc-transient    switching on a drive or releasing: the free and forced motions adding, as two arrows
 *   osc-superpose    three identical oscillators: response to A, to B, and to A + B — superposition, and how a nonlinear spring breaks it
 *   osc-string       the wave equation on a string (or air in a pipe): plucks, pulses crossing, reflections at fixed and free ends
 *   osc-beats        two tones beating (with their arrows), and wave groups in space: phase and group velocity for several media
 *   osc-modes        standing modes of a string, a rectangular membrane and a circular drum, in 3-D
 *   osc-fourier      Fourier synthesis of square, sawtooth, triangle and a voice-like wave from harmonics (with sound)
 *   osc-wake         a moving source: Doppler crowding, the Mach cone of a supersonic plane, and Kelvin's wake behind a ship
 */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fin = (x, d) => (Number.isFinite(x) ? x : (d || 0));
  const fontOf = () => { try { return (getComputedStyle(document.body).fontFamily) || 'sans-serif'; } catch (e) { return 'sans-serif'; } };
  // draw in a fixed logical frame (W0 × H0) scaled to fit the stage
  function frame(st, W0, H0) { const s = Math.min(st.W / W0, st.H / H0) || 1; return { s, ox: (st.W - W0 * s) / 2, oy: (st.H - H0 * s) / 2 }; }
  function begin(st, W0, H0) { const c = st.begin(), f = frame(st, W0, H0); c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s); c.font = '12px ' + fontOf(); return c; }
  // pointer position in the logical frame
  function local(st, W0, H0, p) { const f = frame(st, W0, H0); return { x: (p.x - f.ox) / f.s, y: (p.y - f.oy) / f.s }; }
  function spring(c, x1, y1, x2, y2, coils, amp) {
    const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, n = coils * 2;
    c.beginPath(); c.moveTo(x1, y1);
    const lead = Math.min(10, L * 0.1);
    c.lineTo(x1 + ux * lead, y1 + uy * lead);
    for (let i = 1; i < n; i++) { const t = lead + (L - 2 * lead) * i / n, s = (i % 2 ? 1 : -1) * amp; c.lineTo(x1 + ux * t - uy * s, y1 + uy * t + ux * s); }
    c.lineTo(x2 - ux * lead, y2 - uy * lead); c.lineTo(x2, y2); c.stroke();
  }
  function arcArrow(c, x, y, r, a0, a1, col, w) {
    if (Math.abs(a1 - a0) < 0.05) return;
    c.strokeStyle = col; c.fillStyle = col; c.lineWidth = w || 2;
    c.beginPath(); c.arc(x, y, r, a0, a1, a1 < a0); c.stroke();
    const dir = a1 > a0 ? 1 : -1, ex = x + r * Math.cos(a1), ey = y + r * Math.sin(a1), tx = -Math.sin(a1) * dir, ty = Math.cos(a1) * dir;
    c.beginPath(); c.moveTo(ex + tx * 8, ey + ty * 8); c.lineTo(ex - ty * 4.5, ey + tx * 4.5); c.lineTo(ex + ty * 4.5, ey - tx * 4.5); c.closePath(); c.fill();
  }

  /* ================================================================ osc-spin-wheel */
  Hyper.sim('osc-spin-wheel', {
    title: 'A turntable: torque, angular momentum and moment of inertia',
    blurb: `A turntable (a disc of 4 kg and radius 0.5 m) carries two 2 kg weights that slide along a rod. Seen from above on the left; on the right, seen from the side, the **angular momentum** $L = I\\omega$ and the **torque** $\\tau$ are drawn as [[?vector|vectors]] along the axle (right-hand rule: anticlockwise from above means up).

**Try this**
- Press *Push for 1 s*. A hand pushes the rim tangentially: the torque arrow appears and the $L$ arrow grows — but only while the push lasts ($\\Delta L = \\tau\\,\\Delta t$).
- While it spins, slide the weights in. The $L$ arrow keeps its length while the turntable speeds up: $I\\omega$ is conserved. Watch the kinetic energy rise, and read off the work your "arms" did.
- Slide them out again: it slows down, and the energy comes back.
- Push with a negative torque to brake it, or switch on bearing friction and watch $L$ drain away.`,
    mount(box, kit) {
      const W0 = 640, H0 = 330, CX = 185, CY = 165, RPX = 135, M = 4, R = 0.5, m = 2, Id = 0.5 * M * R * R;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'ω (rad/s) and L (kg·m²/s)' }, legend: true }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'r', label: 'Distance of the weights from the axle', min: 0.08, max: 0.45, step: 0.01, value: 0.40, unit: 'm' },
        { id: 'tau', label: 'Torque of the push', min: -4, max: 4, step: 0.1, value: 2, unit: 'N·m' },
        { id: 'fric', type: 'check', label: 'Bearing friction', value: false },
        { type: 'buttons', items: [{ id: 'push', label: 'Push for 1 s', primary: true }, { id: 'stop', label: 'Stop the turntable' }] }
      ], id => {
        if (id === 'push') pushLeft = 1;
        if (id === 'stop') { L = 0; work = 0; hist = []; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['I', 'Moment of inertia I'], ['w', 'Angular velocity ω'], ['L', 'Angular momentum L = Iω'], ['K', 'Kinetic energy ½Iω²'], ['t', 'Torque now'], ['W', 'Work done moving the weights']]);
      let r = V.r, L = (Id + 2 * m * r * r) * 3, phi = 0, pushLeft = 0, work = 0, t = 0, hist = [], tauNow = 0;
      const I = () => Id + 2 * m * r * r;
      const loop = kit.loop(dt => {
        const n = 10, h = dt / n;
        for (let k = 0; k < n; k++) {
          // the weights slide towards the chosen radius; L is unchanged by this (internal forces), so ω = L/I changes
          const K0 = L * L / (2 * I());
          const dr = V.r - r; r += clamp(dr, -0.25 * h, 0.25 * h);
          work += L * L / (2 * I()) - K0;
          tauNow = 0;
          if (pushLeft > 0) { tauNow += V.tau; pushLeft -= h; }
          const w = L / I();
          if (V.fric) tauNow += -0.08 * Math.sign(w) - 0.03 * w;
          L += tauNow * h;
          if (V.fric && Math.abs(L) < 0.002 && pushLeft <= 0) L = 0;
          phi += (L / I()) * h;
          t += h;
        }
        phi %= TAU;
        const Iv = I(), w = L / Iv, K = L * L / (2 * Iv);
        if (!hist.length || t - hist[hist.length - 1][0] > 0.1) { hist.push([t, w, L]); if (hist.length > 300) hist.shift(); }
        if (Math.floor(t * 5) !== Math.floor((t - dt) * 5)) {
          const t0 = hist.length ? hist[0][0] : 0;
          plot.set({ x: { label: 'time (s)', min: t0, max: Math.max(t0 + 10, t) }, series: [{ pts: hist.map(p => [p[0], p[1]]), label: 'ω (rad/s)' }, { pts: hist.map(p => [p[0], p[2]]), label: 'L (kg·m²/s)', dash: [5, 3] }] });
        }
        ro.set('I', Iv.toFixed(3) + ' kg·m²'); ro.set('w', w.toFixed(2) + ' rad/s = ' + (w * 60 / TAU).toFixed(1) + ' rpm');
        ro.set('L', L.toFixed(3) + ' kg·m²/s'); ro.set('K', K.toFixed(2) + ' J'); ro.set('t', tauNow.toFixed(2) + ' N·m'); ro.set('W', work.toFixed(2) + ' J');
        // ---- drawing
        const c = begin(st, W0, H0), C = kit.colors();
        // top view: disc with marks, rod and weights
        c.fillStyle = C.surface2 || C.surface; c.strokeStyle = C.border || C.faint; c.lineWidth = 2;
        c.beginPath(); c.arc(CX, CY, RPX, 0, TAU); c.fill(); c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1;
        for (let k = 0; k < 12; k++) { const a = -phi + k * TAU / 12; c.beginPath(); c.moveTo(CX + 0.86 * RPX * Math.cos(a), CY + 0.86 * RPX * Math.sin(a)); c.lineTo(CX + RPX * Math.cos(a), CY + RPX * Math.sin(a)); c.stroke(); }
        const ca = Math.cos(-phi), sa = Math.sin(-phi), rp = r / R * RPX;
        c.strokeStyle = C.muted; c.lineWidth = 5; c.beginPath(); c.moveTo(CX - 0.95 * RPX * ca, CY - 0.95 * RPX * sa); c.lineTo(CX + 0.95 * RPX * ca, CY + 0.95 * RPX * sa); c.stroke();
        for (const sgn of [1, -1]) kit.dot(c, CX + sgn * rp * ca, CY + sgn * rp * sa, 13, C.series[1], C.text);
        kit.dot(c, CX, CY, 5, C.text);
        // spin direction arrow round the disc (anticlockwise on screen = positive L)
        if (Math.abs(w) > 0.05) arcArrow(c, CX, CY, RPX + 14, -Math.PI * 0.35, -Math.PI * 0.35 - Math.sign(w) * clamp(Math.abs(w) / 6, 0.2, 1.6), C.accent, 2.5);
        kit.label(c, 'ω', CX + (RPX + 26) * Math.cos(-1.1), CY + (RPX + 26) * Math.sin(-1.1), { color: C.accent, weight: 700 });
        // the push: a tangential force at the rightmost point of the rim
        if (pushLeft > 0 && Math.abs(V.tau) > 0.01) {
          const F = V.tau / R, len = clamp(Math.abs(F) * 8, 14, 70), dir = -Math.sign(F);
          c.setLineDash([4, 3]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(CX, CY); c.lineTo(CX + RPX, CY); c.stroke(); c.setLineDash([]);
          kit.label(c, 'lever arm R = 0.5 m', CX + RPX / 2, CY + 12, { size: 11, color: C.muted, align: 'center' });
          kit.arrow(c, CX + RPX + 6, CY, CX + RPX + 6, CY + dir * len, C.bad, 3);
          kit.label(c, 'F = ' + Math.abs(F).toFixed(1) + ' N', CX + RPX + 14, CY + dir * len * 0.6, { color: C.bad, weight: 600 });
        }
        kit.label(c, 'seen from above', CX, 14, { color: C.muted, align: 'center', size: 11 });
        // side view: axle, disc edge-on, L and τ as vectors along the axle
        const SX = 470, SY = 250;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(SX, SY + 50); c.lineTo(SX, SY - 10); c.stroke();
        c.fillStyle = C.surface2 || C.surface; c.strokeStyle = C.border || C.faint;
        c.beginPath(); c.ellipse(SX, SY, 110, 16, 0, 0, TAU); c.fill(); c.stroke();
        for (const sgn of [1, -1]) { const xw = SX + sgn * (r / R) * 110 * Math.cos(phi); kit.dot(c, xw, SY - 4 - 3 * Math.sin(phi) * sgn, 7, C.series[1], C.text); }
        const Ls = clamp(L * 45, -200, 200);
        kit.arrow(c, SX - 16, SY, SX - 16, SY - Ls, C.accent, 4);
        kit.label(c, 'L = ' + L.toFixed(2), SX - 22, SY - Ls - (Ls >= 0 ? 10 : -10), { color: C.accent, weight: 700, align: 'right' });
        if (Math.abs(tauNow) > 0.005) { const Ts = clamp(tauNow * 30, -140, 140); kit.arrow(c, SX + 16, SY, SX + 16, SY - Ts, C.bad, 4); kit.label(c, 'τ = ' + tauNow.toFixed(2), SX + 22, SY - Ts - (Ts >= 0 ? 10 : -10), { color: C.bad, weight: 700 }); }
        kit.label(c, 'seen from the side', SX, 14, { color: C.muted, align: 'center', size: 11 });
        kit.label(c, 'ΔL = τ Δt', SX + 60, SY + 44, { color: C.muted, size: 11 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ osc-gyroscope */
  Hyper.sim('osc-gyroscope', {
    title: 'The gyroscope: spin, torque and precession',
    blurb: `A wheel (1 kg, radius 10 cm) spins on an axle whose end rests on a pivot. The motion is computed exactly for a symmetric top (Lagrange's equations), so nothing is assumed about precession — it comes out. Three [[?vector|vectors]] are drawn: the spin angular momentum **L** along the axle, the **torque** τ = r × Mg of the weight (always horizontal, at right angles to the axle), and the precession **Ω** (vertical). Drag the picture to turn it.

**Try this**
- *Released from rest*: the axle dips a little, then bobs up and down (nutation) while it drifts round — the orange trace of the axle's end draws scallops. Compare the measured precession with Mgl/(Iω).
- Choose *Given the right push*: the axle goes round smoothly from the start, with no bobbing.
- Lower the spin to 300 rpm: the precession speeds up, and the dip and the scallops grow (the dip goes as 1/ω²). At 3000 rpm the axle hardly moves.
- Make the arm longer: more torque, faster precession.
- Tilt the axle up or down: the precession rate stays nearly the same, because the torque and the horizontal part of L both carry sin θ.
- Switch on friction at the pivot: the nutation dies away and the gyroscope settles into steady precession, a little lower than it started.`,
    mount(box, kit) {
      const W0 = 640, H0 = 360, Mw = 1.0, Rw = 0.1, g = 9.81, I3 = 0.5 * Mw * Rw * Rw;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'axle below its start (°)' } }, 140);
      const ctl = kit.controls(box.side, [
        { id: 'spin', label: 'Spin of the wheel', min: 200, max: 3000, step: 50, value: 1000, unit: 'rpm' },
        { id: 'l', label: 'Arm: pivot to the wheel\'s centre', min: 0.05, max: 0.2, step: 0.005, value: 0.1, unit: 'm' },
        { id: 'tilt', label: 'Axle angle from the vertical at release', min: 40, max: 140, step: 1, value: 90, unit: '°' },
        { id: 'start', type: 'select', label: 'Start', options: [['Released from rest', 'rest'], ['Given the right push', 'push']], value: 'rest' },
        { id: 'fric', type: 'check', label: 'Friction at the pivot (damps the nutation)', value: false },
        { id: 'slow', type: 'select', label: 'Speed', options: [['Real time', 1], ['Half speed', 0.5], ['Quarter speed', 0.25]], value: 1 },
        { type: 'buttons', items: [{ id: 'go', label: 'Release', primary: true }, { id: 'clear', label: 'Clear the trace' }] }
      ], id => { if (id === 'clear') trace = []; else if (id !== 'slow' && id !== 'fric') release(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['L', 'Spin angular momentum L = I₃ω'], ['tau', 'Torque of the weight'], ['pred', 'Predicted Ω = τ/L (for sin θ = 1)'], ['meas', 'Measured precession'], ['dip', 'Axle below its start'], ['nut', 'Nutation rate I₃ω/I₁']]);
      let th, thd, ph, psiVis, pPsi, pPhi, I1, Mgl, t, trace, hist, phHist;
      function release() {
        const w = V.spin * TAU / 60, l = V.l;
        I1 = 0.25 * Mw * Rw * Rw + Mw * l * l; Mgl = Mw * g * l; pPsi = I3 * w;
        th = V.tilt * Math.PI / 180; thd = 0; ph = 0; psiVis = 0; t = 0;
        // the steady precession rate at this tilt (the slow root of I1 φ'² cos θ − pψ φ' + Mgl = 0)
        let phd0 = 0;
        if (V.start === 'push') {
          const a = I1 * Math.cos(th), b = -pPsi, cc = Mgl;
          phd0 = Math.abs(a) < 1e-9 ? Mgl / pPsi : (-b - Math.sqrt(Math.max(0, b * b - 4 * a * cc))) / (2 * a);
          if (!Number.isFinite(phd0)) phd0 = Mgl / pPsi;
        }
        const s = Math.sin(th);
        pPhi = I1 * phd0 * s * s + pPsi * Math.cos(th);
        trace = []; hist = []; phHist = [];
      }
      const phidot = th_ => { const s = Math.sin(th_), s2 = Math.max(1e-4, s * s); return (pPhi - pPsi * Math.cos(th_)) / (I1 * s2); };
      const acc = (th_, thd_) => { const pd = phidot(th_), s = Math.sin(th_), c = Math.cos(th_); return (I1 * pd * pd * s * c - pPsi * pd * s + Mgl * s) / I1 - (V.fric ? 4 * thd_ : 0); };
      release();
      let az = 0.55, el = 0.32;
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, az, el }), move: (o, p) => { az = o.az + (p.x - o.x) * 0.01; el = clamp(o.el + (p.y - o.y) * 0.006, -0.1, 1.2); if (!loop.running) loop.once(); } });
      const loop = kit.loop(dt => {
        // RK4 on θ; φ follows from the conserved p_φ
        const h = 0.0004; let n = Math.min(400, Math.round(dt * V.slow / h));
        for (let k = 0; k < n; k++) {
          const k1t = thd, k1v = acc(th, thd), k1p = phidot(th);
          const k2t = thd + 0.5 * h * k1v, k2v = acc(th + 0.5 * h * k1t, k2t), k2p = phidot(th + 0.5 * h * k1t);
          const k3t = thd + 0.5 * h * k2v, k3v = acc(th + 0.5 * h * k2t, k3t), k3p = phidot(th + 0.5 * h * k2t);
          const k4t = thd + h * k3v, k4v = acc(th + h * k3t, k4t), k4p = phidot(th + h * k3t);
          th += h * (k1t + 2 * k2t + 2 * k3t + k4t) / 6; thd += h * (k1v + 2 * k2v + 2 * k3v + k4v) / 6; ph += h * (k1p + 2 * k2p + 2 * k3p + k4p) / 6;
          th = clamp(th, 0.02, Math.PI - 0.02); t += h;
        }
        th = fin(th, Math.PI / 2); thd = fin(thd); ph = fin(ph);
        psiVis += (V.spin * TAU / 60) / 40 * dt * V.slow;
        const l = V.l, n3 = [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)];
        const tip = n3.map(v => v * l);
        if (!trace.length || Math.hypot(tip[0] - trace[trace.length - 1][0], tip[1] - trace[trace.length - 1][1], tip[2] - trace[trace.length - 1][2]) > 0.0015) { trace.push(tip); if (trace.length > 900) trace.shift(); }
        const dipDeg = (th - V.tilt * Math.PI / 180) * 180 / Math.PI;
        if (!hist.length || t - hist[hist.length - 1][0] > 0.004) { hist.push([t, dipDeg]); if (hist.length > 700) hist.shift(); }
        phHist.push([t, ph]); while (phHist.length > 2 && t - phHist[0][0] > 1.5) phHist.shift();
        const meas = phHist.length > 2 && t - phHist[0][0] > 0.2 ? (ph - phHist[0][1]) / (t - phHist[0][0]) : phidot(th);
        const tau = Mgl * Math.sin(th);
        if (hist.length && Math.floor(t * 10) !== Math.floor((t - dt * V.slow) * 10)) plot.set({ x: { label: 'time (s)', min: hist[0][0], max: Math.max(hist[0][0] + 2, t) }, series: [{ pts: hist, label: 'dip' }] });
        ro.set('L', pPsi.toFixed(3) + ' kg·m²/s'); ro.set('tau', tau.toFixed(3) + ' N·m'); ro.set('pred', (Mgl / pPsi).toFixed(2) + ' rad/s');
        ro.set('meas', meas.toFixed(2) + ' rad/s (one turn in ' + (Math.abs(meas) > 1e-3 ? (TAU / Math.abs(meas)).toFixed(1) + ' s)' : '—)'));
        ro.set('dip', dipDeg.toFixed(2) + '°'); ro.set('nut', (pPsi / I1).toFixed(1) + ' rad/s');
        // ---- drawing: a simple orthographic view, z up
        const c = begin(st, W0, H0), C = kit.colors(), S = 620, cx = W0 / 2, cy = 150;
        const ca = Math.cos(az), sa = Math.sin(az), ce = Math.cos(el), se = Math.sin(el);
        const P = q => { const X = q[0] * ca - q[1] * sa, Y = q[0] * sa + q[1] * ca; return [cx + S * X, cy - S * (q[2] * ce + Y * se), Y * ce - q[2] * se]; };
        const line = (a, b, col, w) => { const A = P(a), B = P(b); c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.stroke(); };
        const arrow3 = (a, b, col, lab) => { const A = P(a), B = P(b); kit.arrow(c, A[0], A[1], B[0], B[1], col, 3.2); if (lab) kit.label(c, lab, B[0] + 6, B[1] - 6, { color: col, weight: 700 }); };
        // floor and post
        const zf = -0.2;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath();
        for (let k = 0; k <= 48; k++) { const a = k * TAU / 48, q = P([0.24 * Math.cos(a), 0.24 * Math.sin(a), zf]); if (k) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }
        c.stroke();
        line([0, 0, zf], [0, 0, 0], C.text, 4);
        // trace of the axle's end
        if (trace.length > 1) { c.strokeStyle = C.series[1]; c.lineWidth = 1.5; c.beginPath(); trace.forEach((q, i) => { const A = P(q); if (i) c.lineTo(A[0], A[1]); else c.moveTo(A[0], A[1]); }); c.stroke(); }
        // the wheel: a circle at right angles to the axle, with spokes
        const u = [-Math.sin(ph), Math.cos(ph), 0], wv = [-Math.cos(th) * Math.cos(ph), -Math.cos(th) * Math.sin(ph), Math.sin(th)];
        const rim = a => [tip[0] + Rw * (Math.cos(a) * u[0] + Math.sin(a) * wv[0]), tip[1] + Rw * (Math.cos(a) * u[1] + Math.sin(a) * wv[1]), tip[2] + Rw * (Math.cos(a) * u[2] + Math.sin(a) * wv[2])];
        line([0, 0, 0], n3.map(v => v * (l + 0.035)), C.muted, 4);
        c.fillStyle = C.dark ? 'rgba(120,160,220,.18)' : 'rgba(60,100,180,.14)'; c.strokeStyle = C.text; c.lineWidth = 2.2; c.beginPath();
        for (let k = 0; k <= 60; k++) { const q = P(rim(k * TAU / 60)); if (k) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }
        c.closePath(); c.fill(); c.stroke();
        for (let k = 0; k < 6; k++) line(tip, rim(psiVis + k * TAU / 6), C.muted, 1.2);
        kit.dot(c, P([0, 0, 0])[0], P([0, 0, 0])[1], 4.5, C.text);
        // the three vectors
        const Llen = 0.05 + 0.1 * Math.min(1, pPsi / 1.6);
        arrow3(tip, tip.map((v, i) => v + n3[i] * Llen), C.accent, 'L');
        const tl = 0.03 + 0.07 * Math.min(1, tau / 2);
        arrow3(tip, [tip[0] + u[0] * tl, tip[1] + u[1] * tl, tip[2]], C.bad, 'τ');
        const pd = phidot(th), ol = clamp(pd * 0.018, -0.16, 0.16);
        if (Math.abs(ol) > 0.004) arrow3([0, 0, 0.012], [0, 0, 0.012 + ol], C.ok, 'Ω');
        // the weight
        arrow3(tip, [tip[0], tip[1], tip[2] - 0.06], C.muted, 'Mg');
        kit.label(c, 'drag to turn the view · spokes drawn 40× slower than the spin', 10, H0 - 12, { size: 11, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ osc-phasor */
  Hyper.sim('osc-phasor', {
    title: 'The oscillator and its rotating arrow',
    blurb: `Above: an arrow of length $A$ turning steadily at $\\omega_0 = \\sqrt{k/m}$ radians per second — a [[?rotating-arrow|rotating arrow]] $\\hat A e^{i\\omega_0 t}$ in the [[?complex-number|complex plane]]. Below: a mass on a spring. The dashed line drops from the tip of the arrow to the mass: the motion **is** the shadow of the arrow on the real axis, $x = \\mathrm{Re}(\\hat A e^{i\\omega_0 t})$. Under the mass, a pen draws $x$ on paper that runs downwards, so the trace is a cosine in time. On the right, the energy sloshes between the spring and the motion.

**Try this**
- Drag the mass sideways and let go: the arrow starts pointing along the real axis ($\\phi = 0$).
- Set the starting position to 0 and give it a starting velocity: the arrow starts a quarter turn back — same motion, shifted in [[?phase]].
- Double the amplitude: the arrow is longer but turns at the same rate — the period does not change.
- Make the mass 4 times heavier: the arrow turns half as fast.
- Show the velocity arrow: it is always a quarter turn ahead, and its shadow is $v/\\omega_0$ — largest when the mass passes the centre.`,
    mount(box, kit) {
      const W0 = 640, H0 = 390, CX = 250, CY = 100, RMAX = 82, YM = 212, PAPER0 = 240, PAPER1 = 380, PPS = 45;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'k', label: 'Spring constant k', min: 10, max: 400, step: 5, value: 100, unit: 'N/m' },
        { id: 'm', label: 'Mass m', min: 0.25, max: 4, step: 0.05, value: 1, unit: 'kg' },
        { id: 'x0', label: 'Starting position x₀', min: -10, max: 10, step: 0.5, value: 8, unit: 'cm' },
        { id: 'v0', label: 'Starting velocity v₀', min: -1, max: 1, step: 0.05, value: 0, unit: 'm/s' },
        { id: 'vel', type: 'check', label: 'Show the velocity arrow (÷ω₀)', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Release', primary: true }, { id: 'pause', label: 'Pause / go on' }] }
      ], id => { if (id === 'pause') paused = !paused; else if (id !== 'vel') release(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['w', 'ω₀ = √(k/m)'], ['T', 'Period T = 2π/ω₀'], ['A', 'Amplitude A (arrow length)'], ['ph', 'Starting phase φ'], ['x', 'Position x now'], ['E', 'Energy ½kA²']]);
      let w0 = 10, Ar = 0, Ai = 0, t = 0, scale = 700, paused = false, drag = null, hist = [];
      function release() {
        w0 = Math.sqrt(V.k / V.m);
        Ar = V.x0 / 100; Ai = -V.v0 / w0;        // Â = x₀ − i v₀/ω₀
        const A = Math.hypot(Ar, Ai);
        scale = RMAX / Math.max(0.04, A * 1.05);
        t = 0; hist = []; paused = false; drag = null;
      }
      release();
      kit.drag(st, {
        hit: p => { const q = local(st, W0, H0, p); const x = CX + scale * (Ar * Math.cos(w0 * t) - Ai * Math.sin(w0 * t)); return Math.abs(q.x - x) < 26 && Math.abs(q.y - YM) < 26 ? 1 : null; },
        move: (o, p) => { const q = local(st, W0, H0, p); drag = clamp((q.x - CX) / scale, -0.1, 0.1); ctl.set('x0', Math.round(drag * 200) / 2); ctl.set('v0', 0); },
        end: () => { release(); }
      });
      const loop = kit.loop(dt => {
        if (!paused && drag == null) t += dt;
        const ct = Math.cos(w0 * t), stt = Math.sin(w0 * t);
        let zr = Ar * ct - Ai * stt, zi = Ar * stt + Ai * ct;
        if (drag != null) { zr = drag; zi = 0; }
        const A = Math.hypot(zr, zi), x = zr, v = drag != null ? 0 : -w0 * zi;   // v = Re(iω Â e^{iωt}) = −ω Im(…)
        if (!paused && drag == null) { hist.push([t, x]); while (hist.length && t - hist[0][0] > (PAPER1 - PAPER0) / PPS) hist.shift(); }
        const E = 0.5 * V.k * A * A, KE = 0.5 * V.m * v * v, PE = 0.5 * V.k * x * x;
        ro.set('w', w0.toFixed(2) + ' rad/s (f = ' + (w0 / TAU).toFixed(2) + ' Hz)'); ro.set('T', (TAU / w0).toFixed(3) + ' s');
        ro.set('A', (100 * A).toFixed(1) + ' cm'); ro.set('ph', (Math.atan2(Ai, Ar) * 180 / Math.PI).toFixed(0) + '°');
        ro.set('x', (100 * x).toFixed(1) + ' cm'); ro.set('E', E.toFixed(3) + ' J');
        // ---- drawing
        const c = begin(st, W0, H0), C = kit.colors();
        // the complex plane
        c.strokeStyle = C.grid; c.lineWidth = 1;
        c.beginPath(); c.moveTo(CX - RMAX - 30, CY); c.lineTo(CX + RMAX + 30, CY); c.moveTo(CX, CY - RMAX - 12); c.lineTo(CX, CY + RMAX + 12); c.stroke();
        kit.label(c, 'Re', CX + RMAX + 34, CY, { color: C.muted, size: 11 }); kit.label(c, 'Im', CX + 6, CY - RMAX - 10, { color: C.muted, size: 11 });
        c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.arc(CX, CY, scale * A, 0, TAU); c.stroke(); c.setLineDash([]);
        const tx = CX + scale * zr, ty = CY - scale * zi;
        if (V.vel && drag == null) {
          const vx = CX + scale * (-zi), vy = CY - scale * zr;       // i·Â e^{iωt}: a quarter turn ahead
          kit.arrow(c, CX, CY, vx, vy, C.series[2], 2.2);
          kit.label(c, 'v/ω₀', vx + 6, vy - 6, { color: C.series[2], size: 11, weight: 600 });
          c.strokeStyle = C.series[2]; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(vx, vy); c.lineTo(vx, CY); c.stroke(); c.setLineDash([]);
        }
        kit.arrow(c, CX, CY, tx, ty, C.accent, 3.2);
        kit.label(c, 'Â e^(iω₀t)', tx + 8, ty - 8, { color: C.accent, weight: 700 });
        if (drag == null && A > 1e-4) arcArrow(c, CX, CY, 18, 0, -Math.atan2(zi, zr) || 0.001, C.muted, 1.4);
        // shadow line to the mass
        c.strokeStyle = C.accent; c.setLineDash([5, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx, YM - 16); c.stroke(); c.setLineDash([]);
        // wall, spring, mass
        c.fillStyle = C.faint; c.fillRect(40, YM - 26, 8, 52);
        c.strokeStyle = C.text; c.lineWidth = 1.6; spring(c, 48, YM, tx - 16, YM, 12, 8);
        c.fillStyle = C.series[1]; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(tx - 16, YM - 16, 32, 32); c.strokeRect(tx - 16, YM - 16, 32, 32);
        kit.label(c, 'm', tx, YM, { align: 'center', color: C.dark ? '#111' : '#fff', weight: 700 });
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(CX, YM + 20); c.lineTo(CX, YM + 26); c.stroke();
        kit.label(c, 'x = 0', CX, YM + 32, { align: 'center', size: 10, color: C.muted });
        // the paper: x against time, time running down
        c.strokeStyle = C.border || C.faint; c.strokeRect(CX - RMAX - 30, PAPER0, 2 * RMAX + 60, PAPER1 - PAPER0);
        if (hist.length > 1) {
          c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
          hist.forEach((q, i) => { const X = CX + scale * q[1], Y = PAPER0 + (t - q[0]) * PPS; if (i) c.lineTo(X, Y); else c.moveTo(X, Y); });
          c.stroke();
        }
        c.strokeStyle = C.accent; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(tx, YM + 16); c.lineTo(tx, PAPER0); c.stroke(); c.setLineDash([]);
        kit.label(c, 'time ↓ (1 s = ' + PPS + ' px)', CX - RMAX - 26, PAPER1 - 10, { size: 10, color: C.muted });
        // scale bar
        const bar = scale * 0.05;
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(40, H0 - 8); c.lineTo(40 + bar, H0 - 8); c.stroke();
        kit.label(c, '5 cm', 44 + bar, H0 - 8, { size: 10, color: C.muted });
        // energy bars
        const BX = 470, BY = 330, BH = 230, Em = Math.max(E, 1e-9);
        const bars = [['kinetic', KE, C.series[2]], ['spring', PE, C.series[1]], ['total', KE + PE, C.accent]];
        bars.forEach((b, i) => {
          const h = BH * clamp(b[1] / Em, 0, 1.05), x0 = BX + i * 50;
          c.fillStyle = b[2]; c.fillRect(x0, BY - h, 32, h);
          kit.label(c, b[0], x0 + 16, BY + 12, { align: 'center', size: 11, color: C.muted });
        });
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(BX - 8, BY); c.lineTo(BX + 150, BY); c.stroke();
        kit.label(c, 'energy', BX + 66, BY - BH - 18, { align: 'center', color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ osc-complex */
  Hyper.sim('osc-complex', {
    title: 'Complex numbers as arrows',
    blurb: `Four views of the [[?complex-number|complex numbers]], drawn as arrows in a plane (real part across, imaginary part up).

- **Multiply two arrows**: drag the tips of $z_1$ and $z_2$. The product has length $r_1 r_2$ and angle $\\theta_1 + \\theta_2$. Put $z_2$ at $i$: multiplying by $i$ is a quarter turn.
- **$e^{i\\theta}$ goes round**: the arrow of length 1 at angle $\\theta$ (in [[?radian|radians]]); its shadows on the two axes are $\\cos\\theta$ and $\\sin\\theta$, drawn against $\\theta$ on the right.
- **Euler's series**: the terms $1,\\ i\\theta,\\ (i\\theta)^2/2!,\\ \\dots$ laid head to tail. Each turns a quarter turn from the last and shrinks; they spiral in onto $e^{i\\theta}$ on the unit circle ([[?euler-formula|Euler's formula]]).
- **Small steps**: multiply 1 by $(1 + i\\theta/n)$ again and again. With many small steps the walk hugs the unit circle and ends at $e^{i\\theta}$ — the idea behind Feynman's route through imaginary powers.

**Try this**
- Series at $\\theta = \\pi$: add terms one by one and watch the partial sums swing wildly before closing in on $-1$.
- Series at $\\theta = 6$: the first terms go far out (they grow until $n \\approx \\theta$) — but the factorials always win.
- Small steps with $n = 4$, then 40: the length of the final arrow falls towards 1.`,
    mount(box, kit, params) {
      const W0 = 640, H0 = 380, OX = 220, OY = 190;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Multiply two arrows', 'mul'], ['e^(iθ) goes round the circle', 'circle'], ['Euler\'s series, term by term', 'series'], ['Small steps: (1 + iθ/n)ⁿ', 'steps']], value: (params && params.mode) || 'series' },
        { id: 'theta', label: 'Angle θ', min: 0, max: 6.3, step: 0.01, value: Math.PI, unit: 'rad' },
        { id: 'N', label: 'Terms of the series', min: 1, max: 20, step: 1, value: 20 },
        { id: 'n', label: 'Number of steps n', min: 1, max: 60, step: 1, value: 8 },
        { type: 'buttons', items: [{ id: 'play', label: 'Play', primary: true }, { id: 'pi', label: 'θ = π' }, { id: 'i', label: 'z₂ = i' }] }
      ], id => {
        if (id === 'mode') { show(); anim = 0; }
        if (id === 'play') { anim = 1; animT = 0; if (V.mode === 'series') ctl.set('N', 1); if (V.mode === 'steps') shown = 0; }
        if (id === 'pi') ctl.set('theta', Math.PI);
        if (id === 'i') { z2 = [0, 1]; }
        if (id === 'n') shown = V.n;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', ''], ['b', ''], ['c', ''], ['d', '']]);
      let z1 = [1.2, 0.5], z2 = [0.6, 0.9], anim = 0, animT = 0, shown = V.n, dragging = null;
      function show() {
        const m = V.mode;
        ctl.show('theta', m !== 'mul'); ctl.show('N', m === 'series'); ctl.show('n', m === 'steps'); ctl.show('i', m === 'mul'); ctl.show('pi', m !== 'mul');
      }
      show();
      const unitPx = () => V.mode === 'mul' ? 62 : V.mode === 'circle' ? 120 : 0;
      kit.drag(st, {
        hit: p => {
          if (V.mode !== 'mul') return null;
          const q = local(st, W0, H0, p), u = unitPx();
          for (const [k, z] of [[1, z1], [2, z2]]) if (Math.hypot(q.x - (OX + u * z[0]), q.y - (OY - u * z[1])) < 16) return k;
          return null;
        },
        move: (k, p) => { const q = local(st, W0, H0, p), u = unitPx(); const z = [clamp((q.x - OX) / u, -2.5, 2.5), clamp((OY - q.y) / u, -2.5, 2.5)]; if (k === 1) z1 = z; else z2 = z; },
        hover: true
      });
      const fmtZ = z => z[0].toFixed(3) + (z[1] < 0 ? ' − ' : ' + ') + Math.abs(z[1]).toFixed(3) + 'i';
      const polar = z => '|z| = ' + Math.hypot(z[0], z[1]).toFixed(3) + ', ∠ ' + (Math.atan2(z[1], z[0]) * 180 / Math.PI).toFixed(1) + '°';
      const loop = kit.loop(dt => {
        const C = kit.colors(), m = V.mode;
        // animation
        if (anim) {
          animT += dt;
          if (m === 'circle') { let th = V.theta + 0.9 * dt; if (th > 6.3) th -= 6.3; ctl.set('theta', th); }
          else if (m === 'series' && animT > 0.7) { animT = 0; if (V.N < 20) ctl.set('N', V.N + 1); else anim = 0; }
          else if (m === 'steps' && animT > Math.max(0.05, 2.4 / V.n)) { animT = 0; if (shown < V.n) shown++; else anim = 0; }
          else if (m === 'mul') { const a = 0.6 * dt, ca = Math.cos(a), sa = Math.sin(a); z2 = [z2[0] * ca - z2[1] * sa, z2[0] * sa + z2[1] * ca]; }
        }
        const th = V.theta;
        const c = begin(st, W0, H0);
        // choose the scale
        let u = unitPx(), pts = null, terms = null, sums = null;
        if (m === 'series') {
          terms = []; sums = [[0, 0]]; let tr = 1, ti = 0, sr = 0, si = 0;
          for (let k = 0; k < V.N; k++) { if (k > 0) { const nr = -ti * th / k, ni = tr * th / k; tr = nr; ti = ni; } terms.push([tr, ti]); sr += tr; si += ti; sums.push([sr, si]); }
          let ext = 1.2; for (const s of sums) ext = Math.max(ext, Math.abs(s[0]), Math.abs(s[1]));
          u = Math.min(130, 165 / ext);
        } else if (m === 'steps') {
          pts = [[1, 0]]; const n = V.n, sr = 1, si = th / n;
          for (let k = 1; k <= n; k++) { const p = pts[k - 1]; pts.push([p[0] * sr - p[1] * si, p[0] * si + p[1] * sr]); }
          let ext = 1.2; for (const p of pts) ext = Math.max(ext, Math.abs(p[0]), Math.abs(p[1]));
          u = Math.min(130, 165 / ext);
        }
        const X = z => OX + u * z[0], Y = z => OY - u * z[1];
        // axes and the unit circle
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(20, OY); c.lineTo(420, OY); c.moveTo(OX, 12); c.lineTo(OX, H0 - 12); c.stroke();
        kit.label(c, 'Re', 424, OY, { size: 11, color: C.muted }); kit.label(c, 'Im', OX + 6, 14, { size: 11, color: C.muted });
        c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.arc(OX, OY, u, 0, TAU); c.stroke(); c.setLineDash([]);
        kit.label(c, '1', X([1, 0]) + 3, OY + 10, { size: 10, color: C.muted }); kit.label(c, 'i', OX + 5, Y([0, 1]) - 7, { size: 10, color: C.muted });
        if (m === 'mul') {
          const p = [z1[0] * z2[0] - z1[1] * z2[1], z1[0] * z2[1] + z1[1] * z2[0]];
          const a1 = Math.atan2(z1[1], z1[0]), a2 = Math.atan2(z2[1], z2[0]);
          arcArrow(c, OX, OY, 26, 0, -a1, C.series[1], 1.5); arcArrow(c, OX, OY, 36, -a1, -a1 - a2, C.series[2], 1.5);
          kit.arrow(c, OX, OY, X(z1), Y(z1), C.series[1], 3); kit.arrow(c, OX, OY, X(z2), Y(z2), C.series[2], 3); kit.arrow(c, OX, OY, X(p), Y(p), C.accent, 3.6);
          kit.dot(c, X(z1), Y(z1), 6, C.series[1], C.text); kit.dot(c, X(z2), Y(z2), 6, C.series[2], C.text);
          kit.label(c, 'z₁', X(z1) + 9, Y(z1) - 9, { color: C.series[1], weight: 700 }); kit.label(c, 'z₂', X(z2) + 9, Y(z2) - 9, { color: C.series[2], weight: 700 });
          kit.label(c, 'z₁z₂', X(p) + 9, Y(p) - 9, { color: C.accent, weight: 700 });
          const r1 = Math.hypot(...z1), r2 = Math.hypot(...z2);
          const lines = ['lengths multiply:', r1.toFixed(2) + ' × ' + r2.toFixed(2) + ' = ' + (r1 * r2).toFixed(2), '', 'angles add:', (a1 * 180 / Math.PI).toFixed(0) + '° + ' + (a2 * 180 / Math.PI).toFixed(0) + '° = ' + ((a1 + a2) * 180 / Math.PI).toFixed(0) + '°', '', 'drag the tips of z₁ and z₂', 'Play turns z₂ round'];
          lines.forEach((s, i) => kit.label(c, s, 450, 60 + i * 20, { color: i === 0 || i === 3 ? C.muted : C.text, weight: i === 1 || i === 4 ? 700 : 500 }));
          ro.set('a', 'z₁ = ' + fmtZ(z1)); ro.set('b', 'z₂ = ' + fmtZ(z2)); ro.set('c', 'z₁z₂ = ' + fmtZ(p)); ro.set('d', polar(p));
        } else if (m === 'circle') {
          const z = [Math.cos(th), Math.sin(th)];
          arcArrow(c, OX, OY, 24, 0, -th, C.muted, 1.5);
          c.setLineDash([4, 3]); c.lineWidth = 1.4;
          c.strokeStyle = C.series[1]; c.beginPath(); c.moveTo(X(z), Y(z)); c.lineTo(X(z), OY); c.stroke();
          c.strokeStyle = C.series[2]; c.beginPath(); c.moveTo(X(z), Y(z)); c.lineTo(OX, Y(z)); c.stroke(); c.setLineDash([]);
          c.lineWidth = 5; c.strokeStyle = C.series[1]; c.beginPath(); c.moveTo(OX, OY + 2); c.lineTo(X(z), OY + 2); c.stroke();
          c.strokeStyle = C.series[2]; c.beginPath(); c.moveTo(OX - 2, OY); c.lineTo(OX - 2, Y(z)); c.stroke();
          kit.arrow(c, OX, OY, X(z), Y(z), C.accent, 3.4);
          kit.label(c, 'e^(iθ)', X(z) + 8, Y(z) - 8, { color: C.accent, weight: 700 });
          kit.label(c, 'cos θ', (OX + X(z)) / 2, OY + 16, { color: C.series[1], align: 'center', size: 11, weight: 600 });
          kit.label(c, 'sin θ', OX - 8, (OY + Y(z)) / 2, { color: C.series[2], align: 'right', size: 11, weight: 600 });
          // cos and sin against θ, on the right
          const GX = 440, GW = 185, GY1 = 110, GY2 = 270, GA = 50;
          [[GY1, 'cos θ', Math.cos, C.series[1]], [GY2, 'sin θ', Math.sin, C.series[2]]].forEach(([gy, lab, f, col]) => {
            c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(GX, gy); c.lineTo(GX + GW, gy); c.moveTo(GX, gy - GA); c.lineTo(GX, gy + GA); c.stroke();
            c.strokeStyle = col; c.lineWidth = 1.8; c.beginPath();
            for (let k = 0; k <= 100; k++) { const a = 6.3 * k / 100, x = GX + GW * k / 100, y = gy - GA * f(a); if (k) c.lineTo(x, y); else c.moveTo(x, y); }
            c.stroke();
            kit.dot(c, GX + GW * th / 6.3, gy - GA * f(th), 4.5, col, C.text);
            kit.label(c, lab, GX + 4, gy - GA - 8, { color: col, weight: 600, size: 11 });
          });
          kit.label(c, 'θ from 0 to 2π →', GX + GW / 2, GY2 + GA + 14, { align: 'center', color: C.muted, size: 11 });
          ro.set('a', 'θ = ' + th.toFixed(3) + ' rad = ' + (th * 180 / Math.PI).toFixed(1) + '°'); ro.set('b', 'cos θ = ' + z[0].toFixed(4)); ro.set('c', 'sin θ = ' + z[1].toFixed(4)); ro.set('d', '|e^(iθ)| = 1 always');
        } else if (m === 'series') {
          const target = [Math.cos(th), Math.sin(th)];
          for (let k = 0; k < terms.length; k++) {
            const a = sums[k], b = sums[k + 1], col = k % 2 ? C.series[2] : C.series[1];
            kit.arrow(c, X(a), Y(a), X(b), Y(b), col, k === terms.length - 1 ? 3 : 2);
            if (k < 6 && Math.hypot(terms[k][0], terms[k][1]) * u > 26) {
              const lab = ['1', 'iθ', '(iθ)²/2!', '(iθ)³/3!', '(iθ)⁴/4!', '(iθ)⁵/5!'][k];
              kit.label(c, lab, (X(a) + X(b)) / 2 + 6, (Y(a) + Y(b)) / 2 - 8, { size: 11, color: col, weight: 600 });
            }
          }
          for (let k = 1; k < sums.length; k++) kit.dot(c, X(sums[k]), Y(sums[k]), 2.6, C.text);
          kit.dot(c, X(target), Y(target), 6, 'transparent', C.accent);
          kit.arrow(c, OX, OY, X(target), Y(target), C.accent, 1.5);
          kit.label(c, 'e^(iθ)', X(target) + 8, Y(target) + 12, { color: C.accent, weight: 700 });
          const s = sums[sums.length - 1], last = terms[terms.length - 1];
          const rows = [['terms', 'partial sum']];
          for (let k = 1; k < sums.length && rows.length < 15; k++) rows.push([String(k), fmtZ(sums[k])]);
          rows.forEach((r, i) => { kit.label(c, r[0], 452, 24 + i * 17, { size: 11, color: i ? C.text : C.muted, align: 'right' }); kit.label(c, r[1], 462, 24 + i * 17, { size: 11, color: i ? C.text : C.muted }); });
          ro.set('a', 'Sum of ' + terms.length + ' terms: ' + fmtZ(s)); ro.set('b', 'e^(iθ) = ' + fmtZ(target));
          ro.set('c', 'Error: ' + Math.hypot(s[0] - target[0], s[1] - target[1]).toExponential(2)); ro.set('d', 'Last term\'s size: ' + Math.hypot(last[0], last[1]).toExponential(2));
        } else {
          const n = V.n, k = Math.min(shown, n), target = [Math.cos(th), Math.sin(th)];
          c.strokeStyle = C.accent; c.lineWidth = 3; c.globalAlpha = 0.35; c.beginPath(); c.arc(OX, OY, u, 0, -th, true); c.stroke(); c.globalAlpha = 1;
          for (let j = 0; j < k; j++) {
            const a = pts[j], b = pts[j + 1];
            kit.arrow(c, X(a), Y(a), X(b), Y(b), j % 2 ? C.series[2] : C.series[1], 2);
            c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(OX, OY); c.lineTo(X(b), Y(b)); c.stroke();
          }
          kit.dot(c, X(target), Y(target), 6, 'transparent', C.accent);
          kit.label(c, 'e^(iθ)', X(target) + 8, Y(target) + 12, { color: C.accent, weight: 700 });
          const e = pts[k], R = Math.hypot(e[0], e[1]);
          ['each step: × (1 + iθ/n)', 'turns by atan(θ/n) ≈ θ/n', 'and stretches by √(1 + θ²/n²)', '', 'after ' + k + ' of ' + n + ' steps:', 'length ' + R.toFixed(4), 'angle ' + Math.atan2(e[1], e[0]).toFixed(4) + ' rad']
            .forEach((s, i) => kit.label(c, s, 440, 60 + i * 20, { color: i < 3 ? C.muted : C.text, weight: i >= 5 ? 700 : 500 }));
          ro.set('a', '(1 + iθ/n)^' + k + ' = ' + fmtZ(e)); ro.set('b', 'e^(iθ) = ' + fmtZ(target)); ro.set('c', 'Length: ' + R.toFixed(4) + ' (→ 1 as n grows)'); ro.set('d', 'Distance from e^(iθ): ' + Math.hypot(e[0] - target[0], e[1] - target[1]).toFixed(4));
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  // the steady response of m ẍ + mγ ẋ + kx = F₀ e^{iωt}: x̂ = (F₀/m)/(ω₀² − ω² + iγω), as {re, im}
  function response(F0m, w0, w, gamma) {
    const dr = w0 * w0 - w * w, di = gamma * w, d2 = dr * dr + di * di || 1e-12;
    return { re: F0m * dr / d2, im: -F0m * di / d2 };
  }

  /* ================================================================ osc-resonance */
  Hyper.sim('osc-resonance', {
    title: 'Resonance: a driven, damped oscillator',
    blurb: `A 1 kg mass on a 100 N/m spring ($\\omega_0 = 10$ rad/s) with friction, pushed by a force $F_0\\cos\\omega t$ ($F_0 = 1$ N, red arrow). The motion is computed step by step from rest, so you see the start-up too. In the circle, the force and the steady response are drawn as [[?rotating-arrow|rotating arrows]] turning together at the drive frequency; the angle between them is the [[?phase]] lag. Below, the resonance curve and the lag against frequency, with a dot for where you are.

**Try this**
- Start well below 10 rad/s: the mass follows the force, in step, barely more than the static stretch of 10 mm.
- Move to 10 rad/s: after a few seconds the swing is $Q$ times bigger and the arrows are a quarter turn apart — the force is in step with the *velocity*.
- Go well above: the mass hardly moves, and moves *against* the force (lag near 180°).
- Press *Sweep* and watch the response grow and fall as the frequency passes through resonance, with the lag swinging from 0 to 180°.
- Reduce the damping: the peak gets taller and narrower, and it takes longer to settle.`,
    mount(box, kit) {
      const W0 = 640, H0 = 300, m = 1, k = 100, w0 = 10, F0 = 1;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 220 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const pA = kit.plot(gb, { x: { label: 'driving frequency ω (rad/s)', min: 0, max: 20 }, y: { label: 'amplitude (mm)', min: 0 }, legend: true }, 150);
      const pP = kit.plot(gb, { x: { label: 'driving frequency ω (rad/s)', min: 0, max: 20 }, y: { label: 'lag (°)', min: 0, max: 180 } }, 110);
      const ctl = kit.controls(box.side, [
        { id: 'w', label: 'Driving frequency ω', min: 2, max: 20, step: 0.05, value: 7, unit: 'rad/s' },
        { id: 'gamma', label: 'Damping γ', min: 0.2, max: 6, step: 0.1, value: 1, unit: '1/s' },
        { type: 'buttons', items: [{ id: 'sweep', label: 'Sweep 4 → 16 rad/s', primary: true }, { id: 'rest', label: 'Start from rest' }] }
      ], id => {
        if (id === 'sweep') { sweeping = true; ctl.set('w', 4); }
        if (id === 'rest') { x = 0; v = 0; }
        if (id === 'gamma') curves();
        if (id === 'w') { sweeping = false; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r', 'ω/ω₀'], ['Q', 'Q = ω₀/γ'], ['th', 'Steady amplitude (theory)'], ['ms', 'Amplitude now'], ['lag', 'Lag of x behind F'], ['P', 'Average power absorbed']]);
      let x = 0, v = 0, ph = 0, t = 0, sweeping = false, peak = 0, peakT = 0, lastPeak = 0;
      function curves() {
        const amp = [], lag = [];
        for (let i = 1; i <= 400; i++) { const w = 20 * i / 400, r = response(F0 / m, w0, w, V.gamma); amp.push([w, 1000 * Math.hypot(r.re, r.im)]); lag.push([w, -Math.atan2(r.im, r.re) * 180 / Math.PI]); }
        pA.set({ series: [{ pts: amp, label: 'steady amplitude' }] });
        pP.set({ series: [{ pts: lag }], hlines: [{ y: 90, label: '90°' }] });
      }
      curves();
      const loop = kit.loop(dt => {
        if (sweeping) { const w = V.w + 0.2 * dt; if (w >= 16) { sweeping = false; ctl.set('w', 16); } else ctl.set('w', w); }
        const w = V.w, g = V.gamma, n = 40, h = dt / n;
        for (let i = 0; i < n; i++) {
          // semi-implicit (symplectic) Euler with small steps: stable, no spurious energy gain
          const F = F0 * Math.cos(ph);
          v += h * (F / m - g * v - (k / m) * x);
          x += h * v; ph += w * h; t += h;
        }
        ph %= TAU;
        // amplitude now: the largest |x| over the last period
        peak = Math.max(peak, Math.abs(x)); peakT += dt;
        if (peakT > TAU / w) { lastPeak = peak; peak = 0; peakT = 0; }
        const r = response(F0 / m, w0, w, g), A = Math.hypot(r.re, r.im), lag = -Math.atan2(r.im, r.re);
        const P = 0.5 * F0 * w * A * Math.sin(lag);
        ro.set('r', (w / w0).toFixed(3)); ro.set('Q', (w0 / g).toFixed(1)); ro.set('th', (1000 * A).toFixed(1) + ' mm (static: 10 mm)');
        ro.set('ms', (1000 * lastPeak).toFixed(1) + ' mm'); ro.set('lag', (lag * 180 / Math.PI).toFixed(1) + '°'); ro.set('P', (1000 * P).toFixed(1) + ' mW');
        if (Math.floor(t * 8) !== Math.floor((t - dt) * 8)) {
          pA.set({ marks: [{ x: w, y: 1000 * A, label: 'steady' }, { x: w, y: 1000 * lastPeak, label: 'now' }] });
          pP.set({ marks: [{ x: w, y: lag * 180 / Math.PI }] });
        }
        // ---- drawing
        const c = begin(st, W0, H0), C = kit.colors();
        const xres = F0 / (m * g * w0), s = 120 / Math.max(xres, 0.012), X0 = 190, YM = 150;
        // the mass on its spring, and the force on it
        c.fillStyle = C.faint; c.fillRect(20, YM - 30, 8, 60);
        const mx = X0 + clamp(s * x, -150, 150);
        c.strokeStyle = C.text; c.lineWidth = 1.6; spring(c, 28, YM, mx - 18, YM, 12, 9);
        c.fillStyle = C.series[1]; c.strokeStyle = C.text; c.fillRect(mx - 18, YM - 18, 36, 36); c.strokeRect(mx - 18, YM - 18, 36, 36);
        const Fn = Math.cos(ph);
        kit.arrow(c, mx, YM - 30, mx + 45 * Fn, YM - 30, C.bad, 3);
        kit.label(c, 'F', mx + 45 * Fn + (Fn >= 0 ? 6 : -14), YM - 30, { color: C.bad, weight: 700 });
        c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X0, YM + 24); c.lineTo(X0, YM + 50); c.stroke(); c.setLineDash([]);
        kit.label(c, 'x = 0', X0, YM + 58, { size: 10, align: 'center', color: C.muted });
        const bar = s * 0.01; c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(30, H0 - 14); c.lineTo(30 + bar, H0 - 14); c.stroke();
        kit.label(c, '10 mm (static stretch)', 36 + bar, H0 - 14, { size: 10, color: C.muted });
        // the arrows: force e^{iφ} and steady response x̂ e^{iφ}, turning together
        const PX = 500, PY = 140, PR = 105;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(PX - PR - 10, PY); c.lineTo(PX + PR + 10, PY); c.moveTo(PX, PY - PR - 10); c.lineTo(PX, PY + PR + 10); c.stroke();
        const fz = [Math.cos(ph), Math.sin(ph)], xz = [r.re * fz[0] - r.im * fz[1], r.re * fz[1] + r.im * fz[0]];
        const xs = PR / Math.max(xres, 0.012);
        arcArrow(c, PX, PY, 30, -ph, -ph + lag, C.muted, 1.4);
        kit.arrow(c, PX, PY, PX + 0.8 * PR * fz[0], PY - 0.8 * PR * fz[1], C.bad, 3);
        kit.arrow(c, PX, PY, PX + xs * xz[0], PY - xs * xz[1], C.accent, 3.2);
        kit.label(c, 'force', PX + 0.8 * PR * fz[0] + 6, PY - 0.8 * PR * fz[1] - 8, { color: C.bad, size: 11, weight: 700 });
        kit.label(c, 'response x̂', PX + xs * xz[0] + 6, PY - xs * xz[1] + 12, { color: C.accent, size: 11, weight: 700 });
        kit.label(c, 'lag ' + (lag * 180 / Math.PI).toFixed(0) + '°', PX - PR, PY + PR + 4, { color: C.muted, size: 11 });
        kit.label(c, 'arrows turn together at ω', PX, 12, { color: C.muted, size: 11, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ osc-transient */
  Hyper.sim('osc-transient', {
    title: 'Transients: free and forced motion adding',
    blurb: `An oscillator with $\\omega_0 = 10$ rad/s. **Switch on a drive**: the motion is the steady forced motion (a [[?rotating-arrow|rotating arrow]] of fixed length turning at the drive's $\\omega$, orange) plus a free motion (green, turning at its own $\\omega_d$ and shrinking as $e^{-\\gamma t/2}$), laid head to tail. The free arrow starts exactly opposite the forced one, so the mass starts at rest; then it dies, and only the forced motion is left. **Release** shows the free motion alone: the arrow spirals in.

**Try this**
- Drive at $\\omega = 0.9\\,\\omega_0$ with $Q = 30$: the amplitude beats several times before it settles — the two arrows turn at different rates and drift in and out of line.
- Drive exactly at $\\omega_0$: no beats; the amplitude just grows and levels off over a time of about $2/\\gamma$.
- Low $Q$ (strong damping): the free arrow vanishes almost at once and the steady state arrives quickly.
- Release: follow the spiral traced by the tip, and the energy falling as $e^{-\\gamma t}$ in the read-out.`,
    mount(box, kit) {
      const W0 = 640, H0 = 330, w0 = 10;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'time (s)', min: 0 }, y: { label: 'displacement (relative)' }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Experiment', options: [['Switch on a drive', 'drive'], ['Release and let it ring', 'free']], value: 'drive' },
        { id: 'r', label: 'Drive frequency ω/ω₀', min: 0.5, max: 1.5, step: 0.01, value: 0.9 },
        { id: 'Q', label: 'Quality factor Q = ω₀/γ', min: 0.6, max: 60, value: 30, log: true, sig: 2 },
        { id: 'speed', type: 'select', label: 'Speed', options: [['Real time', 1], ['Half speed', 0.5], ['Quarter speed', 0.25]], value: 0.5 },
        { type: 'buttons', items: [{ id: 'go', label: 'Start again', primary: true }] }
      ], id => { if (id !== 'speed') setup(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['g', 'Damping rate γ'], ['wd', 'Free frequency ω_d'], ['f', 'Forced arrow |x̂|'], ['h', 'Free arrow now'], ['E', 'Energy (relative to start)']]);
      let S = null, t = 0, trail = [];
      function setup() {
        const g = w0 / V.Q, wd = Math.sqrt(Math.max(1e-6, w0 * w0 - g * g / 4)), w = V.r * w0, drive = V.mode === 'drive';
        const X = drive ? response(1, w0, w, g) : { re: 0, im: 0 };
        // free part e^{−γt/2}(a cos ω_d t + b sin ω_d t) chosen so that x(0) = x0 and v(0) = 0
        const x0 = drive ? 0 : 1, xf0 = X.re, vf0 = -w * X.im;
        const a = x0 - xf0, b = (-vf0 + g * a / 2) / wd;
        const unit = drive ? Math.hypot(X.re, X.im) : 1;
        S = { g, wd, w, X, a, b, unit, drive };
        t = 0; trail = [];
        const Tw = Math.min(20, Math.max(4, 10 / g)), pts = [], pf = [], ph = [];
        for (let i = 0; i <= 600; i++) { const tt = Tw * i / 600, q = at(tt); pts.push([tt, q.x / unit]); pf.push([tt, q.xf / unit]); ph.push([tt, q.xh / unit]); }
        const series = drive ? [{ pts, label: 'motion x = forced + free', width: 2 }, { pts: pf, label: 'forced (steady)', dash: [5, 3] }, { pts: ph, label: 'free (dying)', dash: [2, 3] }] : [{ pts, label: 'motion x (free)', width: 2 }, { pts: pts.map(p => [p[0], Math.exp(-g * p[0] / 2)]), label: 'envelope e^(−γt/2)', dash: [4, 3] }];
        plot.set({ x: { label: 'time (s)', min: 0, max: Tw }, series });
        S.Tw = Tw;
      }
      function at(tt) {
        const e = Math.exp(-S.g * tt / 2), cw = Math.cos(S.wd * tt), sw = Math.sin(S.wd * tt);
        const xh = e * (S.a * cw + S.b * sw), cf = Math.cos(S.w * tt), sf = Math.sin(S.w * tt);
        const zf = { re: S.X.re * cf - S.X.im * sf, im: S.X.re * sf + S.X.im * cf };
        // the free part as an arrow: H e^{(−γ/2 + iω_d)t} with H = a − ib
        const zh = { re: e * (S.a * cw + S.b * sw), im: e * (S.a * sw - S.b * cw) };
        return { x: zf.re + xh, xf: zf.re, xh, zf, zh, v: 0 };
      }
      setup();
      const loop = kit.loop(dt => {
        if (t < S.Tw) t = Math.min(S.Tw, t + dt * V.speed);
        const q = at(t), u = S.unit, g = S.g;
        if (Math.floor(t * 10) !== Math.floor((t - dt * V.speed) * 10)) plot.set({ vlines: [{ x: t, label: 't' }] });
        ro.set('g', g.toFixed(3) + ' 1/s (2/γ = ' + (2 / g).toFixed(1) + ' s)'); ro.set('wd', S.wd.toFixed(3) + ' rad/s');
        ro.set('f', S.drive ? (Math.hypot(S.X.re, S.X.im) * w0 * w0).toFixed(2) + ' × static stretch' : '— (no drive)');
        ro.set('h', (Math.hypot(q.zh.re, q.zh.im) / u).toFixed(3) + ' (relative)');
        ro.set('E', S.drive ? '—' : Math.exp(-g * t).toFixed(4) + ' = e^(−γt)');
        // ---- drawing
        const c = begin(st, W0, H0), C = kit.colors(), PX = 230, PY = 130, s = S.drive ? 55 : 100;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(PX - 200, PY); c.lineTo(PX + 200, PY); c.moveTo(PX, PY - 120); c.lineTo(PX, PY + 120); c.stroke();
        kit.label(c, 'Re', PX + 204, PY, { size: 11, color: C.muted });
        const f = [q.zf.re / u, q.zf.im / u], hh = [q.zh.re / u, q.zh.im / u], tot = [f[0] + hh[0], f[1] + hh[1]];
        trail.push(tot); if (trail.length > 900) trail.shift();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); trail.forEach((p, i) => { const X = PX + s * p[0], Y = PY - s * p[1]; if (i) c.lineTo(X, Y); else c.moveTo(X, Y); }); c.stroke();
        if (S.drive) {
          c.strokeStyle = C.series[1]; c.setLineDash([3, 4]); c.beginPath(); c.arc(PX, PY, s, 0, TAU); c.stroke(); c.setLineDash([]);
          kit.arrow(c, PX, PY, PX + s * f[0], PY - s * f[1], C.series[1], 3);
          kit.label(c, 'forced', PX + s * f[0] * 0.5 - 20, PY - s * f[1] * 0.5 - 10, { color: C.series[1], size: 11, weight: 700 });
        }
        const fx = S.drive ? f : [0, 0];
        if (Math.hypot(hh[0], hh[1]) * s > 1) kit.arrow(c, PX + s * fx[0], PY - s * fx[1], PX + s * tot[0], PY - s * tot[1], C.series[2], 3);
        kit.label(c, 'free', PX + s * (fx[0] + tot[0]) / 2 + 8, PY - s * (fx[1] + tot[1]) / 2 + 12, { color: C.series[2], size: 11, weight: 700 });
        kit.dot(c, PX + s * tot[0], PY - s * tot[1], 4, C.accent);
        // shadow line to the mass
        const MX = PX + s * clamp(tot[0], -3.6, 3.6), YM = 285;
        c.strokeStyle = C.accent; c.setLineDash([5, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(PX + s * tot[0], PY - s * tot[1]); c.lineTo(MX, YM - 14); c.stroke(); c.setLineDash([]);
        c.fillStyle = C.faint; c.fillRect(8, YM - 22, 7, 44);
        c.strokeStyle = C.text; c.lineWidth = 1.5; spring(c, 15, YM, MX - 14, YM, 14, 7);
        c.fillStyle = C.accent; c.fillRect(MX - 14, YM - 14, 28, 28);
        // a legend on the right
        const lines = S.drive ? ['forced arrow: fixed length,', '  turns at ω = ' + S.w.toFixed(2) + ' rad/s', 'free arrow: shrinks as e^(−γt/2),', '  turns at ω_d = ' + S.wd.toFixed(2) + ' rad/s', 'x = shadow of the sum', '', 't = ' + t.toFixed(2) + ' s'] : ['free arrow: shrinks as e^(−γt/2),', '  turns at ω_d = ' + S.wd.toFixed(2) + ' rad/s', 'its tip spirals in', 'x = its shadow', '', 't = ' + t.toFixed(2) + ' s'];
        lines.forEach((l, i) => kit.label(c, l, 455, 30 + i * 19, { size: 11.5, color: i === lines.length - 1 ? C.text : C.muted, weight: i === lines.length - 1 ? 700 : 500 }));
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ osc-superpose */
  Hyper.sim('osc-superpose', {
    title: 'Superposition: A, B and A + B',
    blurb: `Three identical oscillators (1 kg on a 100 N/m spring, with a little friction). The first is pushed by force **A**, the second by force **B**, the third by **A + B** together. The dashed outline on the third row sits where $x_A + x_B$ says it should be. For a linear spring it never leaves the real mass: the response to a [[?sum]] of forces is the sum of the responses. The graph below compares the two for the whole run.

**Try this**
- Any pair of forces with the stiffening switched off: the curves $x_{A+B}$ and $x_A + x_B$ lie exactly on top of each other.
- Give the spring a cubic stiffening ($F = kx + k_3x^3$): now the outline and the mass part company — two causes no longer add. Make the forces stronger and the failure grows (nonlinearity matters for big motions).
- A kick plus a sine: the response is a free, dying ring plus the steady forced motion — the transient of the previous page, built by superposition.`,
    mount(box, kit) {
      const W0 = 640, H0 = 300, m = 1, k = 100, T = 10, NS = 1000;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'time (s)', min: 0, max: T }, y: { label: 'displacement (cm)' }, legend: true }, 170);
      const forces = [['A kick at 0.5 s (impulse 0.5 N·s)', 'kick'], ['A sine at 5 rad/s (1 N)', 'sin5'], ['A sine at 15 rad/s (1 N)', 'sin15'], ['A steady push from 1 s (5 N)', 'step'], ['A sine near resonance, 9.5 rad/s (0.5 N)', 'res']];
      const ctl = kit.controls(box.side, [
        { id: 'A', type: 'select', label: 'Force A', options: forces, value: 'kick' },
        { id: 'B', type: 'select', label: 'Force B', options: forces, value: 'sin15' },
        { id: 'gain', label: 'Strength of both forces', min: 0.25, max: 4, step: 0.05, value: 1, unit: '×' },
        { id: 'k3', label: 'Spring stiffening k₃ (0 = linear)', min: 0, max: 40000, step: 500, value: 0, unit: 'N/m³' },
        { id: 'gamma', label: 'Friction γ', min: 0.1, max: 3, step: 0.05, value: 0.6, unit: '1/s' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run again', primary: true }] }
      ], () => compute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['d', 'Largest gap between x(A + B) and x(A) + x(B)'], ['r', 'Relative to the motion'], ['msg', '']]);
      const force = (id, t) => {
        const g = V.gain;
        if (id === 'kick') return t > 0.5 && t < 0.55 ? 10 * g : 0;
        if (id === 'sin5') return g * Math.sin(5 * t);
        if (id === 'sin15') return g * Math.sin(15 * t);
        if (id === 'step') return t > 1 ? 5 * g : 0;
        return 0.5 * g * Math.sin(9.5 * t);
      };
      let xa = [], xb = [], xab = [], fa = [], fb = [], t = 0;
      function run(F) {
        // semi-implicit Euler with a fine fixed step; stored every T/NS seconds
        const h = 1e-4, every = Math.round(T / NS / h), out = [0];
        let x = 0, v = 0, time = 0;
        for (let i = 1; i <= NS * every; i++) {
          v += h * (F(time) / m - V.gamma * v - (k * x + V.k3 * x * x * x) / m);
          x += h * v; time += h;
          if (!Number.isFinite(x)) { x = 0; v = 0; }
          if (i % every === 0) out.push(x);
        }
        return out;
      }
      function compute() {
        xa = run(tt => force(V.A, tt)); xb = run(tt => force(V.B, tt)); xab = run(tt => force(V.A, tt) + force(V.B, tt));
        fa = []; fb = [];
        for (let i = 0; i <= NS; i++) { fa.push(force(V.A, T * i / NS)); fb.push(force(V.B, T * i / NS)); }
        let gap = 0, big = 1e-9;
        for (let i = 0; i <= NS; i++) { gap = Math.max(gap, Math.abs(xab[i] - xa[i] - xb[i])); big = Math.max(big, Math.abs(xab[i])); }
        ro.set('d', (100 * gap).toFixed(gap < 1e-4 ? 4 : 2) + ' cm'); ro.set('r', (100 * gap / big).toFixed(gap / big < 1e-3 ? 4 : 1) + ' %');
        ro.set('msg', gap / big < 1e-6 ? 'Superposition holds exactly.' : gap / big < 0.02 ? 'Nearly linear: superposition almost holds.' : 'Superposition fails: the spring is nonlinear.');
        const ts = i => T * i / NS;
        plot.set({ series: [
          { pts: xab.map((x, i) => [ts(i), 100 * x]), label: 'x with A + B together', width: 2.4 },
          { pts: xa.map((x, i) => [ts(i), 100 * (x + xb[i])]), label: 'x(A) + x(B)', dash: [5, 4], width: 1.6 },
          { pts: xab.map((x, i) => [ts(i), 100 * (x - xa[i] - xb[i])]), label: 'difference', dash: [1, 3] }
        ] });
        t = 0;
      }
      compute();
      const loop = kit.loop(dt => {
        t += dt; if (t > T + 1.5) t = 0;
        const i = Math.min(NS, Math.floor(t / T * NS));
        if (Math.floor(t * 8) !== Math.floor((t - dt) * 8)) plot.set({ vlines: [{ x: Math.min(t, T) }] });
        const c = begin(st, W0, H0), C = kit.colors();
        let big = 0.01; for (let j = 0; j <= NS; j++) big = Math.max(big, Math.abs(xab[j]), Math.abs(xa[j]), Math.abs(xb[j]));
        const s = 150 / big, X0 = 330;
        const rows = [['A only', xa[i], fa[i], C.series[1]], ['B only', xb[i], fb[i], C.series[2]], ['A + B', xab[i], fa[i] + fb[i], C.accent]];
        rows.forEach(([lab, x, F, col], r) => {
          const y = 55 + r * 95, mx = X0 + s * x;
          c.fillStyle = C.faint; c.fillRect(100, y - 24, 7, 48);
          c.strokeStyle = C.text; c.lineWidth = 1.5; spring(c, 107, y, mx - 16, y, 12, 7);
          c.fillStyle = col; c.fillRect(mx - 16, y - 16, 32, 32);
          if (Math.abs(F) > 1e-3) { const L = clamp(F * 18, -70, 70); kit.arrow(c, mx, y - 24, mx + L, y - 24, C.bad, 2.5); }
          kit.label(c, lab, 16, y, { weight: 700, color: col });
          c.strokeStyle = C.faint; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(X0, y - 30); c.lineTo(X0, y + 30); c.stroke(); c.setLineDash([]);
          if (r === 2) {
            const gx = X0 + s * (xa[i] + xb[i]);
            c.strokeStyle = C.text; c.setLineDash([4, 3]); c.lineWidth = 1.5; c.strokeRect(gx - 19, y - 19, 38, 38); c.setLineDash([]);
            kit.label(c, 'x(A) + x(B)', gx, y + 30, { align: 'center', size: 10, color: C.muted });
          }
        });
        kit.label(c, 'red arrows: the force on each mass · t = ' + Math.min(t, T).toFixed(2) + ' s', 16, H0 - 10, { size: 11, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ osc-string */
  Hyper.sim('osc-string', {
    title: 'The wave equation on a string (or in a pipe)',
    blurb: `A string 1 m long, solved step by step with the [[?wave-equation]] $\\partial^2 y/\\partial t^2 = v^2\\,\\partial^2 y/\\partial x^2$, $v = \\sqrt{F/\\mu}$ — the acceleration of each bit is proportional to how sharply the string curves there. Time runs in slow motion. Switch the view to **air in a pipe** and the same numbers become the lengthways displacement of layers of air: bunched layers (dark) are high pressure, spread layers (light) low pressure.

**Try this**
- *Send a pulse*: it runs to the right end and comes back **upside down** from the fixed end. Make the right end free (a ring sliding on a rod, or the open end of a pipe): it comes back **the right way up**.
- *Two pulses*, one of them upside down: at the moment they meet, the string is flat — then both emerge unchanged. Superposition.
- Drag the string anywhere into a peak and let go (a pluck): the triangle splits into two halves that run apart and reflect.
- Raise the tension or lighten the string: everything speeds up as $\\sqrt{F/\\mu}$.`,
    mount(box, kit) {
      const W0 = 640, H0 = 300, N = 240, XL = 40, XR = 600, YC = 150, AMP = 3;   // AMP px per mm
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 220 });
      const ctl = kit.controls(box.side, [
        { id: 'F', label: 'Tension F', min: 20, max: 400, step: 5, value: 100, unit: 'N' },
        { id: 'mu', label: 'Mass per length μ', min: 2, max: 20, step: 0.5, value: 10, unit: 'g/m' },
        { id: 'end', type: 'select', label: 'Right-hand end', options: [['Fixed (tied / closed pipe)', 'fixed'], ['Free (ring on a rod / open pipe)', 'free']], value: 'fixed' },
        { id: 'view', type: 'select', label: 'Show as', options: [['A string (sideways)', 'string'], ['Air in a pipe (lengthways)', 'pipe']], value: 'string' },
        { id: 'flip', type: 'check', label: 'Second pulse upside down', value: true },
        { id: 'slow', type: 'select', label: 'Slow motion', options: [['1/100', 100], ['1/300', 300], ['1/1000', 1000]], value: 300 },
        { type: 'buttons', items: [{ id: 'pulse', label: 'Send a pulse', primary: true }, { id: 'two', label: 'Two pulses' }, { id: 'pluck', label: 'Pluck' }, { id: 'flat', label: 'Flatten' }] }
      ], id => {
        if (id === 'pulse') { flat(); addPulse(0.18, 1, 1); }
        if (id === 'two') { flat(); addPulse(0.2, 1, 1); addPulse(0.8, -1, V.flip ? -1 : 1); }
        if (id === 'pluck') { flat(); triangle(Math.round(N * 0.3), 12); }
        if (id === 'flat') flat();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['v', 'Wave speed v = √(F/μ)'], ['cross', 'Time to cross 1 m'], ['f1', 'Lowest natural frequency'], ['t', 'Real time elapsed']]);
      let y = new Float64Array(N + 1), yp = new Float64Array(N + 1), acc = 0, tReal = 0, dragI = null;
      function flat() { y.fill(0); yp.fill(0); tReal = 0; }
      // a Gaussian pulse centred at x0 (m), height h (mm), moving dir = +1 (right) or −1 (left); exact on the grid at Courant number 1
      function addPulse(x0, dir, h) {
        const w = 0.035;
        for (let i = 1; i < N; i++) {
          const x = i / N, xp = (i + dir) / N;
          y[i] += 10 * h * Math.exp(-Math.pow((x - x0) / w, 2));
          yp[i] += 10 * h * Math.exp(-Math.pow((xp - x0) / w, 2));
        }
      }
      function triangle(i0, h) {
        for (let i = 0; i <= N; i++) { y[i] = i <= i0 ? h * i / i0 : h * (N - i) / (N - i0); if (V.end === 'free' && i > i0) y[i] = h; }
        y[0] = 0; if (V.end === 'fixed') y[N] = 0; yp.set(y);
      }
      addPulse(0.18, 1, 1);
      const X = i => XL + (XR - XL) * i / N;
      kit.drag(st, {
        hit: p => { const q = local(st, W0, H0, p); if (q.x < XL || q.x > XR || Math.abs(q.y - YC) > 110) return null; return 1; },
        move: (o, p) => {
          const q = local(st, W0, H0, p); dragI = clamp(Math.round((q.x - XL) / (XR - XL) * N), 2, N - 2);
          triangle(dragI, clamp((YC - q.y) / AMP, -30, 30));
        },
        end: () => { dragI = null; }
      });
      const loop = kit.loop(dt => {
        const v = Math.sqrt(V.F / (V.mu / 1000)), dx = 1 / N, dtc = dx / v;   // one grid cell per step (Courant number 1)
        if (dragI == null) {
          acc += dt / V.slow / dtc;
          let n = Math.min(40, Math.floor(acc)); acc -= n; if (acc > 5) acc = 0;
          while (n-- > 0) {
            const yn = new Float64Array(N + 1);
            for (let i = 1; i < N; i++) yn[i] = y[i + 1] + y[i - 1] - yp[i];
            yn[0] = 0;
            yn[N] = V.end === 'fixed' ? 0 : 2 * y[N - 1] - yp[N];
            yp = y; y = yn; tReal += dtc;
          }
        }
        ro.set('v', v.toFixed(1) + ' m/s'); ro.set('cross', (1000 / v).toFixed(2) + ' ms');
        ro.set('f1', (V.end === 'fixed' ? v / 2 : v / 4).toFixed(1) + ' Hz (' + (V.end === 'fixed' ? 'v/2L' : 'v/4L') + ')');
        ro.set('t', (1000 * tReal).toFixed(2) + ' ms');
        const c = begin(st, W0, H0), C = kit.colors();
        // ends
        c.fillStyle = C.faint; c.fillRect(XL - 12, YC - 90, 10, 180);
        if (V.end === 'fixed') c.fillRect(XR + 2, YC - 90, 10, 180);
        else { c.strokeStyle = C.faint; c.lineWidth = 3; c.beginPath(); c.moveTo(XR + 4, YC - 100); c.lineTo(XR + 4, YC + 100); c.stroke(); }
        if (V.view === 'string') {
          c.strokeStyle = C.grid; c.lineWidth = 1; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(XL, YC); c.lineTo(XR, YC); c.stroke(); c.setLineDash([]);
          c.strokeStyle = C.accent; c.lineWidth = 2.6; c.beginPath();
          for (let i = 0; i <= N; i++) { const yy = YC - AMP * clamp(y[i], -32, 32); if (i) c.lineTo(X(i), yy); else c.moveTo(X(i), yy); }
          c.stroke();
          if (V.end === 'free') { kit.dot(c, XR + 4, YC - AMP * clamp(y[N], -32, 32), 5, C.surface || '#fff', C.text); }
          kit.label(c, 'displacement exaggerated · drag the string to pluck it', XL, H0 - 12, { size: 11, color: C.muted });
        } else {
          // air layers: displacement to the right is y (mm, exaggerated); pressure ∝ −∂y/∂x
          const top = YC - 60, hgt = 120;
          for (let i = 0; i < N; i++) {
            const p = -(y[i + 1] - y[i]) * N / 1000;   // −∂χ/∂x (dimensionless, with χ in mm and exaggerated)
            const L = clamp(55 - 100 * p, 15, 90);
            c.fillStyle = 'hsl(205 60% ' + (C.dark ? L * 0.6 : L) + '%)';
            c.fillRect(X(i), top, (XR - XL) / N + 0.6, hgt);
          }
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(XL, top); c.lineTo(XR, top); c.moveTo(XL, top + hgt); c.lineTo(XR, top + hgt); c.stroke();
          c.strokeStyle = C.dark ? 'rgba(255,255,255,.75)' : 'rgba(0,0,0,.65)'; c.lineWidth = 1;
          for (let j = 0; j <= 60; j++) {
            const i = Math.round(j * N / 60), xx = X(i) + 1.2 * clamp(y[i], -25, 25);
            c.beginPath(); c.moveTo(xx, top + 3); c.lineTo(xx, top + hgt - 3); c.stroke();
          }
          kit.label(c, 'lines: layers of air (displacement exaggerated) · dark = squeezed (high pressure), light = spread (low)', XL, H0 - 12, { size: 11, color: C.muted });
          kit.label(c, V.end === 'fixed' ? 'closed end' : 'open end', XR - 4, top - 12, { size: 11, color: C.muted, align: 'right' });
          kit.label(c, 'closed end', XL + 4, top - 12, { size: 11, color: C.muted });
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  // play a few sine tones for a moment, where the browser can (no-op elsewhere)
  function playTones(freqs, seconds, amps) {
    try {
      const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
      if (!AC) return false;
      const ac = new AC(), g = ac.createGain(), t0 = ac.currentTime;
      g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.15, t0 + 0.05); g.gain.setValueAtTime(0.15, t0 + seconds - 0.2); g.gain.linearRampToValueAtTime(0, t0 + seconds);
      g.connect(ac.destination);
      freqs.forEach((f, i) => { const o = ac.createOscillator(), a = ac.createGain(); o.frequency.value = f; a.gain.value = amps ? amps[i] : 1 / freqs.length; o.connect(a); a.connect(g); o.start(t0); o.stop(t0 + seconds); });
      setTimeout(() => { try { ac.close(); } catch (e) { /* already closed */ } }, seconds * 1000 + 300);
      return true;
    } catch (e) { return false; }
  }

  /* ================================================================ osc-beats */
  Hyper.sim('osc-beats', {
    title: 'Beats, and wave groups in space',
    blurb: `**Two tones in time.** Two sine waves of nearly the same frequency are added. The big panel shows two seconds: the loudness (the envelope) swells and fades $|f_1 - f_2|$ times a second. The close-up shows 20 ms of the actual wave around the moving cursor. The circle shows the two tones as [[?rotating-arrow|rotating arrows]], seen from a frame turning with the first: the second arrow drifts round at the difference frequency, and their sum grows and shrinks.

**Wave groups in space.** A group made of many waves close to one wavelength travels along. The orange dot rides on one crest (it moves at the **phase velocity** $\\omega/k$); the green marker follows the middle of the group (the **group velocity** $d\\omega/dk$).

**Try this**
- Set the difference to 1 Hz, then 4 Hz: the beats speed up. At 0 they stop — which is how instruments are tuned. Press *Play* to hear them.
- Space, deep water: crests are born at the back of the group, run through it and die at the front ($v_g = v_p/2$).
- Space, a plasma: the crests outrun the group; they go faster than "light" (here $c = 0.6$), the group slower.
- Space, sound: no dispersion — crest and group move together and the group keeps its shape.`,
    mount(box, kit) {
      const W0 = 640, H0 = 330;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const media = [['Sound, or light in vacuum: ω = ck', 'sound'], ['Deep water: ω = √(gk)', 'water'], ['Ripples (surface tension): ω ∝ k^1.5', 'ripple'], ['Plasma or waveguide: ω² = ω_p² + c²k²', 'plasma'], ['Quantum particle (slow): ω ∝ k²', 'particle']];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Two tones in time', 'time'], ['Wave groups in space', 'space']], value: 'time' },
        { id: 'f1', label: 'Frequency f₁', min: 200, max: 1000, step: 1, value: 440, unit: 'Hz' },
        { id: 'df', label: 'Difference f₂ − f₁', min: 0, max: 8, step: 0.1, value: 2, unit: 'Hz' },
        { id: 'med', type: 'select', label: 'Medium', options: media, value: 'water' },
        { id: 'spd', label: 'Speed (wave periods per second)', min: 0.5, max: 4, step: 0.1, value: 1.5 },
        { type: 'buttons', items: [{ id: 'play', label: 'Play the two tones', primary: true }, { id: 'restart', label: 'Restart the group' }] }
      ], id => {
        if (id === 'mode') show();
        if (id === 'play') playTones([V.f1, V.f1 + V.df], 4);
        if (id === 'restart' || id === 'med') { tau = 0; crestN = 0; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', ''], ['b', ''], ['c', '']]);
      function show() { const tm = V.mode === 'time'; ['f1', 'df', 'play'].forEach(k => ctl.show(k, tm)); ['med', 'spd', 'restart'].forEach(k => ctl.show(k, !tm)); }
      show();
      // dispersion relations in units where λ₀ = 1 and T₀ = 1 at the central wave number k₀ = 2π (so v_p(k₀) = 1)
      const K0 = TAU, CP = 0.6;
      const omega = (med, k) => {
        const q = k / K0;
        if (med === 'water') return TAU * Math.sqrt(q);
        if (med === 'ripple') return TAU * Math.pow(q, 1.5);
        if (med === 'plasma') return Math.sqrt(0.64 * TAU * TAU + CP * CP * k * k);
        if (med === 'particle') return TAU * q * q;
        return TAU * q;
      };
      const NC = 25, SIG = 0.07, X0 = 4, XMAX = 30;
      let t = 0, tau = 0, crestN = 0;
      const loop = kit.loop(dt => {
        t += dt;
        const c = begin(st, W0, H0), C = kit.colors();
        if (V.mode === 'time') {
          const f1 = V.f1, df = V.df, f2 = f1 + df, Tw = 2, cur = t % Tw;
          // big panel: 2 s of envelope, the carrier drawn as a dense fill
          const PX = 20, PW = 420, PY = 230, PH = 70;
          c.fillStyle = C.dark ? 'rgba(90,150,255,.25)' : 'rgba(40,90,200,.18)';
          c.beginPath();
          for (let i = 0; i <= 300; i++) { const tt = Tw * i / 300, e = Math.abs(2 * Math.cos(Math.PI * df * tt)); const x = PX + PW * i / 300, yv = PY - PH / 2 * e; if (i) c.lineTo(x, yv); else c.moveTo(x, yv); }
          for (let i = 300; i >= 0; i--) { const tt = Tw * i / 300, e = Math.abs(2 * Math.cos(Math.PI * df * tt)); c.lineTo(PX + PW * i / 300, PY + PH / 2 * e); }
          c.closePath(); c.fill();
          c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath();
          for (let i = 0; i <= 300; i++) { const tt = Tw * i / 300, e = Math.abs(2 * Math.cos(Math.PI * df * tt)); const x = PX + PW * i / 300; if (i) c.lineTo(x, PY - PH / 2 * e); else c.moveTo(x, PY - PH / 2 * e); }
          c.stroke();
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(PX, PY); c.lineTo(PX + PW, PY); c.stroke();
          const cx = PX + PW * cur / Tw;
          c.strokeStyle = C.bad; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, PY - PH / 2 - 10); c.lineTo(cx, PY + PH / 2 + 6); c.stroke();
          kit.label(c, '2 seconds: the envelope beats ' + df.toFixed(1) + ' times a second', PX, PY + PH / 2 + 22, { size: 11, color: C.muted });
          // close-up: 20 ms of the actual waves around the cursor
          const QX = 20, QW = 420, QY = 75, QH = 90, win = 0.02;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(QX, QY - QH / 2 - 8, QW, QH + 16);
          const wave = (f, a, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); for (let i = 0; i <= 400; i++) { const tt = cur + win * (i / 400 - 0.5), yv = QY - QH / 4 * a(tt); const x = QX + QW * i / 400; if (i) c.lineTo(x, yv); else c.moveTo(x, yv); } c.stroke(); };
          wave(0, tt => Math.cos(TAU * f1 * tt), C.series[1], 1);
          wave(0, tt => Math.cos(TAU * f2 * tt), C.series[2], 1);
          wave(0, tt => Math.cos(TAU * f1 * tt) + Math.cos(TAU * f2 * tt), C.accent, 2.2);
          kit.label(c, 'close-up: 20 ms around the red cursor (thin: each tone; thick: their sum)', QX, QY - QH / 2 - 18, { size: 11, color: C.muted });
          // arrows in the frame turning with tone 1
          const AX = 540, AY = 150, AR = 55, ph = TAU * df * cur;
          c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.arc(AX, AY, AR, 0, TAU); c.stroke(); c.setLineDash([]);
          const a2 = [AR * Math.cos(ph), AR * Math.sin(ph)];
          kit.arrow(c, AX, AY, AX + AR, AY, C.series[1], 2.6);
          kit.arrow(c, AX + AR, AY, AX + AR + a2[0], AY - a2[1], C.series[2], 2.6);
          kit.arrow(c, AX, AY, AX + AR + a2[0], AY - a2[1], C.accent, 3.2);
          kit.label(c, 'tone 1', AX + 6, AY + 14, { size: 10, color: C.series[1] });
          kit.label(c, 'sum: length ' + (2 * Math.abs(Math.cos(ph / 2))).toFixed(2), AX, AY + AR + 34, { size: 11, color: C.accent, align: 'center', weight: 600 });
          kit.label(c, 'arrows, seen turning with tone 1', AX, 40, { size: 11, color: C.muted, align: 'center' });
          ro.set('a', 'Pitch heard: ' + ((f1 + f2) / 2).toFixed(1) + ' Hz'); ro.set('b', 'Beats: ' + df.toFixed(1) + ' per second'); ro.set('c', df > 0 ? 'One beat every ' + (1 / df).toFixed(2) + ' s' : 'No beats: in tune');
        } else {
          const med = V.med, h = 1e-4, w0 = omega(med, K0), vp = w0 / K0, vg = (omega(med, K0 * (1 + h)) - omega(med, K0 * (1 - h))) / (2 * K0 * h);
          tau += dt * V.spd;
          const xg = X0 + vg * tau;
          if (xg > XMAX - 2 || tau > 90) { tau = 0; crestN = 0; }
          // the packet
          const comps = [];
          for (let j = 0; j < NC; j++) { const d = -0.25 + 0.5 * j / (NC - 1), k = K0 * (1 + d); comps.push([k, omega(med, k), Math.exp(-(d / SIG) * (d / SIG))]); }
          const norm = comps.reduce((s, q) => s + q[2], 0);
          const PX = 20, PW = 600, PY = 150, PA = 95, sx = PW / XMAX;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(PX, PY); c.lineTo(PX + PW, PY); c.stroke();
          const ys = [], env = [];
          for (let i = 0; i <= 900; i++) {
            const x = XMAX * i / 900; let re = 0, im = 0;
            for (const [k, w, a] of comps) { const p = k * (x - X0) - w * tau; re += a * Math.cos(p); im += a * Math.sin(p); }
            ys.push(re / norm); env.push(Math.hypot(re, im) / norm);
          }
          c.strokeStyle = C.faint; c.setLineDash([4, 3]); c.lineWidth = 1.2;
          for (const sg of [1, -1]) { c.beginPath(); env.forEach((e, i) => { const X = PX + PW * i / 900, Y = PY - sg * PA * e; if (i) c.lineTo(X, Y); else c.moveTo(X, Y); }); c.stroke(); }
          c.setLineDash([]); c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
          ys.forEach((yv, i) => { const X = PX + PW * i / 900, Y = PY - PA * yv; if (i) c.lineTo(X, Y); else c.moveTo(X, Y); });
          c.stroke();
          // a crest of the central wave: x = X0 + n + v_p τ; keep it near the group
          let xc = X0 + crestN + vp * tau;
          const wdt = 1 / (K0 * SIG) * 2.4;
          if (xc - xg > wdt) { crestN -= Math.ceil((xc - xg + wdt * 0.8) / 1); xc = X0 + crestN + vp * tau; }
          if (xg - xc > wdt) { crestN += Math.ceil((xg - xc + wdt * 0.8) / 1); xc = X0 + crestN + vp * tau; }
          const ic = clamp(Math.round(xc / XMAX * 900), 0, 900);
          kit.dot(c, PX + sx * xc, PY - PA * ys[ic], 6, C.series[1], C.text);
          const gx = PX + sx * xg;
          c.fillStyle = C.ok; c.beginPath(); c.moveTo(gx, PY + PA + 8); c.lineTo(gx - 8, PY + PA + 22); c.lineTo(gx + 8, PY + PA + 22); c.closePath(); c.fill();
          kit.label(c, 'group', gx, PY + PA + 32, { size: 11, color: C.ok, align: 'center', weight: 600 });
          kit.label(c, '● a crest (phase velocity)   ▲ the middle of the group (group velocity)   x in wavelengths, 0 to ' + XMAX, PX, 16, { size: 11, color: C.muted });
          const inC = med === 'plasma' ? ' = ' + (vp / CP).toFixed(2) + ' c' : '';
          const inCg = med === 'plasma' ? ' = ' + (vg / CP).toFixed(2) + ' c' : '';
          ro.set('a', 'Phase velocity ω/k: ' + vp.toFixed(2) + ' λ/T' + inC); ro.set('b', 'Group velocity dω/dk: ' + vg.toFixed(2) + ' λ/T' + inCg); ro.set('c', 'Group ÷ phase: ' + (vg / vp).toFixed(2));
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  // Bessel function of the first kind, J_m(x), from its integral (exact to many digits with 64 points: the integrand is periodic)
  function besselJ(m, x) { let s = 0; const N = 64; for (let i = 0; i < N; i++) { const t = Math.PI * (i + 0.5) / N; s += Math.cos(m * t - x * Math.sin(t)); } return s / N; }
  function besselZeros(m, count) {
    const z = []; let a = 0.3, fa = besselJ(m, a);
    for (let x = 0.35; x < 30 && z.length < count; x += 0.05) {
      const fx = besselJ(m, x);
      if (fa * fx < 0) { let lo = x - 0.05, hi = x; for (let k = 0; k < 50; k++) { const mid = (lo + hi) / 2; if (besselJ(m, lo) * besselJ(m, mid) <= 0) hi = mid; else lo = mid; } z.push((lo + hi) / 2); }
      fa = fx;
    }
    return z;
  }

  /* ================================================================ osc-modes */
  Hyper.sim('osc-modes', {
    title: 'Modes of a string, a membrane and a drum',
    blurb: `Standing waves in one and two dimensions, each swinging at its own natural frequency (time runs so that the lowest mode of each shape swings once a second; higher modes swing faster in proportion). Dashed lines on the floor are the **nodal lines**, which never move; the small map shows the mode from above (warm up, cool down).

**Try this**
- String: step through modes 1, 2, 3… — one more node each time, and the frequency goes up in whole steps: a harmonic series.
- String: mix two modes. The shape no longer keeps its form: it changes all the time, because the two modes swing at different rates. Any motion of the string is such a mix.
- Rectangle: mode (2, 1) has one nodal line, (2, 2) two crossing ones. Make the rectangle square and notice that (1, 2) and (2, 1) have the same frequency.
- Drum: the frequencies read 1, 1.59, 2.14, 2.30… — not whole numbers, which is why a drum sounds less "musical" than a string.`,
    mount(box, kit) {
      const W0 = 640, H0 = 340;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Vibrating thing', options: [['String', 'string'], ['Rectangular membrane', 'rect'], ['Circular drum', 'drum']], value: 'string' },
        { id: 'n', label: 'Mode n (string) / half-waves across (rectangle)', min: 1, max: 6, step: 1, value: 1 },
        { id: 'mix', type: 'check', label: 'String: add a second mode', value: false },
        { id: 'n2', label: 'Second mode (string)', min: 1, max: 6, step: 1, value: 3 },
        { id: 'm', label: 'Half-waves along (rectangle)', min: 1, max: 5, step: 1, value: 1 },
        { id: 'ratio', label: 'Rectangle: width ÷ length', min: 0.5, max: 2, step: 0.05, value: 1.25 },
        { id: 'dm', label: 'Drum: nodal diameters', min: 0, max: 3, step: 1, value: 0 },
        { id: 'dn', label: 'Drum: rings (1 = edge only)', min: 1, max: 3, step: 1, value: 1 },
        { id: 'spd', label: 'Speed', min: 0.1, max: 1.5, step: 0.05, value: 0.6 }
      ], () => { show(); build(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Frequency ÷ lowest mode'], ['abs', 'For a real example'], ['nodes', 'Nodal lines']]);
      function show() { const s = V.shape; ctl.show('n', s !== 'drum'); ctl.show('mix', s === 'string'); ctl.show('n2', s === 'string' && V.mix); ctl.show('m', s === 'rect'); ctl.show('ratio', s === 'rect'); ctl.show('dm', s === 'drum'); ctl.show('dn', s === 'drum'); }
      const ZER = [0, 1, 2, 3].map(m => besselZeros(m, 3));
      let grid = null, ratio = 1, t = 0;
      function build() {
        const s = V.shape;
        if (s === 'rect') {
          const aspect = V.ratio, NU = 26, NV = 26, g = [];
          for (let i = 0; i <= NU; i++) { const row = []; for (let j = 0; j <= NV; j++) row.push(Math.sin(V.n * Math.PI * i / NU) * Math.sin(V.m * Math.PI * j / NV)); g.push(row); }
          // frequency ∝ √((n/a)² + (m/b)²) with a = aspect·b; the lowest is (1, 1)
          const f = (p, q) => Math.sqrt(Math.pow(p / aspect, 2) + q * q);
          ratio = f(V.n, V.m) / f(1, 1);
          grid = { kind: 'rect', g, NU, NV, aspect };
          ro.set('abs', (125 * f(V.n, V.m)).toFixed(0) + ' Hz for waves at 100 m/s on a ' + (0.4 * aspect).toFixed(2) + ' × 0.40 m sheet');
          ro.set('nodes', (V.n - 1) + ' across + ' + (V.m - 1) + ' along (straight lines)');
        } else if (s === 'drum') {
          const m = V.dm, n = V.dn, j = ZER[m][n - 1], NR = 16, NA = 48, g = [];
          for (let i = 0; i <= NR; i++) { const row = [], r = i / NR, jr = besselJ(m, j * r); for (let a = 0; a <= NA; a++) row.push(jr * Math.cos(m * TAU * a / NA)); g.push(row); }
          let mx = 1e-9; g.forEach(row => row.forEach(v => { mx = Math.max(mx, Math.abs(v)); })); g.forEach(row => row.forEach((v, a) => { row[a] = v / mx; }));
          ratio = j / ZER[0][0];
          grid = { kind: 'drum', g, NR, NA, m, n, j };
          ro.set('abs', (j * 100 / (TAU * 0.18)).toFixed(0) + ' Hz for a drumhead of radius 0.18 m, waves at 100 m/s (j = ' + j.toFixed(3) + ')');
          ro.set('nodes', m + ' diameter' + (m === 1 ? '' : 's') + ' + ' + (n - 1) + ' circle' + (n === 2 ? '' : 's') + ' inside the rim');
        } else {
          ratio = V.n;
          grid = { kind: 'string' };
          ro.set('abs', V.mix ? 'modes at ' + (329.6 * V.n).toFixed(0) + ' and ' + (329.6 * V.n2).toFixed(0) + ' Hz on a guitar\'s high E string' : (329.6 * V.n).toFixed(1) + ' Hz on a guitar\'s high E string');
          ro.set('nodes', V.mix ? 'none that stay still for both modes (unless shared)' : (V.n - 1) + ' node' + (V.n === 2 ? '' : 's') + ' between the ends');
        }
        ro.set('f', s === 'string' && V.mix ? V.n + ' and ' + V.n2 + ' (the shape changes)' : ratio.toFixed(3));
      }
      show(); build();
      const heat = (v, C) => v >= 0 ? 'hsl(22 85% ' + (C.dark ? 30 + 30 * v : 88 - 38 * v) + '%)' : 'hsl(210 80% ' + (C.dark ? 30 - 30 * v : 88 + 38 * v) + '%)';
      const loop = kit.loop(dt => {
        t += dt * V.spd;
        const c = begin(st, W0, H0), C = kit.colors();
        if (grid.kind === 'string') {
          const XL = 50, XR = 590, YC = 170, A = 80, N = 300;
          const n1 = V.n, n2 = V.n2, c1 = Math.cos(TAU * n1 * t), c2 = Math.cos(TAU * n2 * t);
          const yf = x => V.mix ? 0.5 * (Math.sin(n1 * Math.PI * x) * c1 + Math.sin(n2 * Math.PI * x) * c2) : Math.sin(n1 * Math.PI * x) * c1;
          if (!V.mix) {
            c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.lineWidth = 1;
            for (const sg of [1, -1]) { c.beginPath(); for (let i = 0; i <= N; i++) { const x = i / N, X = XL + (XR - XL) * x, Y = YC - sg * A * Math.sin(n1 * Math.PI * x); if (i) c.lineTo(X, Y); else c.moveTo(X, Y); } c.stroke(); }
            c.setLineDash([]);
            for (let k = 1; k < n1; k++) { kit.dot(c, XL + (XR - XL) * k / n1, YC, 5, C.bad); }
          }
          c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath();
          for (let i = 0; i <= N; i++) { const x = i / N, X = XL + (XR - XL) * x, Y = YC - A * yf(x); if (i) c.lineTo(X, Y); else c.moveTo(X, Y); }
          c.stroke();
          c.fillStyle = C.faint; c.fillRect(XL - 10, YC - 100, 8, 200); c.fillRect(XR + 2, YC - 100, 8, 200);
          kit.label(c, V.mix ? 'modes ' + n1 + ' and ' + n2 + ' together: the shape keeps changing' : 'mode ' + n1 + ': ' + n1 + ' half-wavelength' + (n1 > 1 ? 's' : '') + ' fit' + (n1 > 1 ? '' : 's') + ' · red dots: nodes', XL, 24, { color: C.muted, size: 12 });
        } else {
          const w = TAU * t * ratio, ct = Math.cos(w);
          // isometric view of a surface z(u, v) on the square [−1, 1]² (or the disc)
          const CX = 250, CY = 190, SU = 130, HZ = 55;
          const P = (u, v, z) => [CX + (u - v) * SU * 0.866, CY + (u + v) * SU * 0.4 - HZ * z];
          const quads = [];
          if (grid.kind === 'rect') {
            const { g, NU, NV, aspect } = grid, ax = Math.min(1, aspect), bx = Math.min(1, 1 / aspect);
            const uv = (i, j) => [(-1 + 2 * i / NU) * ax, (-1 + 2 * j / NV) * bx];
            for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) {
              const p = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]].map(([a, b]) => { const q = uv(a, b); return P(q[0], q[1], g[a][b] * ct); });
              const q0 = uv(i + 0.5, j + 0.5);
              quads.push({ d: q0[0] + q0[1], p, v: 0.25 * (g[i][j] + g[i + 1][j] + g[i + 1][j + 1] + g[i][j + 1]) * ct });
            }
            // nodal lines on the floor
            c.strokeStyle = C.muted; c.setLineDash([4, 3]); c.lineWidth = 1.2;
            for (let k = 1; k < V.n; k++) { const u = (-1 + 2 * k / V.n) * ax, a = P(u, -bx, -1.25), b = P(u, bx, -1.25); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
            for (let k = 1; k < V.m; k++) { const v = (-1 + 2 * k / V.m) * bx, a = P(-ax, v, -1.25), b = P(ax, v, -1.25); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
            c.setLineDash([]);
            const fl = [P(-ax, -bx, -1.25), P(ax, -bx, -1.25), P(ax, bx, -1.25), P(-ax, bx, -1.25)];
            c.strokeStyle = C.faint; c.beginPath(); fl.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.stroke();
          } else {
            const { g, NR, NA, m, n } = grid;
            const xy = (i, a) => [i / NR * Math.cos(TAU * a / NA), i / NR * Math.sin(TAU * a / NA)];
            for (let i = 0; i < NR; i++) for (let a = 0; a < NA; a++) {
              const p = [[i, a], [i + 1, a], [i + 1, a + 1], [i, a + 1]].map(([r, b]) => { const q = xy(r, b); return P(q[0], q[1], g[r][b] * ct); });
              const q0 = xy(i + 0.5, a + 0.5);
              quads.push({ d: q0[0] + q0[1], p, v: 0.25 * (g[i][a] + g[i + 1][a] + g[i + 1][a + 1] + g[i][a + 1]) * ct });
            }
            c.strokeStyle = C.muted; c.setLineDash([4, 3]); c.lineWidth = 1.2;
            for (let k = 1; k < n; k++) { const r = ZER[m][k - 1] / ZER[m][n - 1]; c.beginPath(); for (let a = 0; a <= 64; a++) { const q = P(r * Math.cos(TAU * a / 64), r * Math.sin(TAU * a / 64), -1.25); if (a) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); } c.stroke(); }
            for (let k = 0; k < m; k++) { const ph = (Math.PI / 2 + k * Math.PI) / m, a = P(-Math.cos(ph), -Math.sin(ph), -1.25), b = P(Math.cos(ph), Math.sin(ph), -1.25); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
            c.setLineDash([]);
            c.strokeStyle = C.faint; c.beginPath(); for (let a = 0; a <= 64; a++) { const q = P(Math.cos(TAU * a / 64), Math.sin(TAU * a / 64), -1.25); if (a) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); } c.stroke();
          }
          quads.sort((a, b) => a.d - b.d);
          c.lineWidth = 0.6; c.strokeStyle = C.dark ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.25)';
          for (const q of quads) { c.fillStyle = heat(clamp(q.v, -1, 1), C); c.beginPath(); c.moveTo(q.p[0][0], q.p[0][1]); for (let k = 1; k < 4; k++) c.lineTo(q.p[k][0], q.p[k][1]); c.closePath(); c.fill(); c.stroke(); }
          // the map from above
          const MX = 520, MY = 110, MR = 70;
          kit.label(c, 'from above', MX, MY - MR - 14, { size: 11, color: C.muted, align: 'center' });
          if (grid.kind === 'rect') {
            const { g, NU, NV, aspect } = grid, ax = Math.min(1, aspect), bx = Math.min(1, 1 / aspect);
            for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) { c.fillStyle = heat(clamp(g[i][j] * ct, -1, 1), C); c.fillRect(MX - MR * ax + 2 * MR * ax * i / NU, MY - MR * bx + 2 * MR * bx * j / NV, 2 * MR * ax / NU + 0.6, 2 * MR * bx / NV + 0.6); }
          } else {
            const { g, NR, NA } = grid;
            for (let i = 0; i < NR; i++) for (let a = 0; a < NA; a++) {
              c.fillStyle = heat(clamp(g[i][a] * ct, -1, 1), C); c.beginPath();
              c.arc(MX, MY, MR * (i + 1) / NR, TAU * a / NA, TAU * (a + 1) / NA); c.arc(MX, MY, MR * i / NR, TAU * (a + 1) / NA, TAU * a / NA, true); c.closePath(); c.fill();
            }
          }
          kit.label(c, grid.kind === 'rect' ? 'mode (' + V.n + ', ' + V.m + ')' : 'mode (' + grid.m + ' diameters, ' + grid.n + ' ring' + (grid.n > 1 ? 's' : '') + ')', MX, MY + MR + 18, { size: 12, align: 'center', weight: 600 });
          kit.label(c, 'frequency × ' + ratio.toFixed(3), MX, MY + MR + 38, { size: 12, align: 'center', color: C.accent, weight: 700 });
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ osc-fourier */
  // harmonics of each wave, as amplitude c_n and phase φ_n in Σ c_n sin(nωt + φ_n), n = 1..NH
  const NH = 40;
  function harmonicsOf(kind) {
    const c = [0], ph = [0];
    if (kind === 'voice') {
      // a vowel like "ah" on a 120 Hz voice: a source falling as 1/n, shaped by three resonances of the throat and mouth (formants)
      const F = [[730, 8, 1], [1090, 10, 0.55], [2440, 14, 0.25]], f0 = 120;
      for (let n = 1; n <= NH; n++) {
        let re = 0, im = 0; const f = n * f0;
        for (const [Fk, Qk, gk] of F) { const a = 1 - (f / Fk) * (f / Fk), b = f / (Fk * Qk), d = a * a + b * b; re += gk * a / d; im -= gk * b / d; }
        c.push(Math.hypot(re, im) / n); ph.push(Math.atan2(im, re));
      }
    } else {
      for (let n = 1; n <= NH; n++) {
        let a = 0, p = 0;
        if (kind === 'square') a = n % 2 ? 4 / (Math.PI * n) : 0;
        else if (kind === 'saw') { a = 2 / (Math.PI * n); p = n % 2 ? 0 : Math.PI; }
        else if (kind === 'triangle') { a = n % 2 ? 8 / (Math.PI * Math.PI * n * n) : 0; p = (n % 4 === 3) ? Math.PI : 0; }
        c.push(a); ph.push(p);
      }
    }
    return { c, ph };
  }
  Hyper.sim('osc-fourier', {
    title: 'Fourier synthesis: building a wave from harmonics',
    blurb: `A repeating wave (dashed) and the [[?fourier|sum of its first N harmonics]] (thick). Below, the spectrum: the size of each harmonic $n$, at $n$ times the fundamental frequency; the bars in colour are the ones included in the sum. Press *Play* to hear the sum (in browsers that allow sound).

**Try this**
- Square wave: build it up one harmonic at a time. Only odd harmonics appear, falling as $1/n$. Look at the corners: the overshoot stays near 9 % of the jump however many you add (Gibbs), it only gets narrower.
- Sawtooth: every harmonic, falling as $1/n$ — a bright, buzzy sound, like a bowed string.
- Triangle: harmonics fall as $1/n^2$, so a handful already look right — and it sounds soft, almost like a flute.
- Voice-like: a vowel "ah" on a 120 Hz voice. The spectrum has humps (formants) near 730 and 1090 Hz; the wave looks nothing like a sine, yet it is just 40 harmonics.
- Watch the *energy captured*: with a few harmonics most of the power is already there (the energy theorem).`,
    mount(box, kit) {
      const W0 = 640, H0 = 360;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Wave', options: [['Square', 'square'], ['Sawtooth', 'saw'], ['Triangle', 'triangle'], ['Voice-like (vowel "ah")', 'voice']], value: 'square' },
        { id: 'N', label: 'Harmonics included, N', min: 1, max: NH, step: 1, value: 5 },
        { id: 'each', type: 'check', label: 'Draw the harmonics one by one', value: true },
        { id: 'f0', label: 'Fundamental (for listening)', min: 80, max: 440, step: 1, value: 220, unit: 'Hz' },
        { type: 'buttons', items: [{ id: 'build', label: 'Build up', primary: true }, { id: 'add', label: 'Add one' }, { id: 'play', label: 'Play' }] }
      ], id => {
        if (id === 'kind') setup();
        if (id === 'add') ctl.set('N', Math.min(NH, V.N + 1));
        if (id === 'build') { building = true; ctl.set('N', 1); tb = 0; }
        if (id === 'N') building = false;
        if (id === 'play') play();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['N', 'Harmonics'], ['over', 'Highest point of the sum'], ['err', 'Root-mean-square error'], ['E', 'Energy captured (energy theorem)']]);
      let H = null, target = null, scale = 1, building = false, tb = 0, t = 0;
      const NP = 400;
      const sumTo = (N, x) => { let s = 0; for (let n = 1; n <= N; n++) if (H.c[n]) s += H.c[n] * Math.sin(n * x + H.ph[n]); return s; };
      function setup() {
        H = harmonicsOf(V.kind);
        target = [];
        for (let i = 0; i <= NP; i++) {
          const x = TAU * 2 * i / NP, u = ((x % TAU) + TAU) % TAU;
          if (V.kind === 'square') target.push(u < Math.PI ? 1 : -1);
          else if (V.kind === 'saw') target.push(u < Math.PI ? u / Math.PI : u / Math.PI - 2);
          else if (V.kind === 'triangle') target.push(u < Math.PI / 2 ? u / (Math.PI / 2) : u < 1.5 * Math.PI ? 2 - u / (Math.PI / 2) : u / (Math.PI / 2) - 4);
          else target.push(sumTo(NH, x));
        }
        scale = 1; if (V.kind === 'voice') { let m = 1e-9; target.forEach(v => { m = Math.max(m, Math.abs(v)); }); scale = 1 / m; }
      }
      function play() {
        try {
          const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
          if (!AC) return;
          const ac = new AC(), N = V.N, re = new Float32Array(N + 1), im = new Float32Array(N + 1);
          for (let n = 1; n <= N; n++) { re[n] = H.c[n] * Math.sin(H.ph[n]); im[n] = H.c[n] * Math.cos(H.ph[n]); }
          const o = ac.createOscillator(), g = ac.createGain(), t0 = ac.currentTime;
          o.setPeriodicWave(ac.createPeriodicWave(re, im)); o.frequency.value = V.kind === 'voice' ? 120 : V.f0;
          g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.15, t0 + 0.04); g.gain.setValueAtTime(0.15, t0 + 1.3); g.gain.linearRampToValueAtTime(0, t0 + 1.5);
          o.connect(g); g.connect(ac.destination); o.start(t0); o.stop(t0 + 1.5);
          setTimeout(() => { try { ac.close(); } catch (e) { /* closed */ } }, 1900);
        } catch (e) { /* no sound here */ }
      }
      setup();
      const loop = kit.loop(dt => {
        t += dt;
        if (building) { tb += dt; if (tb > 0.45) { tb = 0; if (V.N < (V.kind === 'triangle' ? 15 : NH)) ctl.set('N', V.N + 1); else building = false; } }
        const N = V.N, c = begin(st, W0, H0), C = kit.colors();
        const GX = 30, GW = 580, GY = 115, GA = 80;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(GX, GY); c.lineTo(GX + GW, GY); c.moveTo(GX, GY - GA - 12); c.lineTo(GX, GY + GA + 12); c.stroke();
        // target
        c.strokeStyle = C.muted; c.setLineDash([5, 4]); c.lineWidth = 1.4; c.beginPath();
        target.forEach((v, i) => { const X = GX + GW * i / NP, Y = GY - GA * v * scale; if (i) c.lineTo(X, Y); else c.moveTo(X, Y); }); c.stroke(); c.setLineDash([]);
        // the harmonics one by one (the first eight present)
        if (V.each) {
          let shown = 0;
          for (let n = 1; n <= N && shown < 8; n++) {
            if (!H.c[n]) continue; shown++;
            c.strokeStyle = C.series[1 + (shown % 5)]; c.globalAlpha = 0.55; c.lineWidth = 1; c.beginPath();
            for (let i = 0; i <= NP; i++) { const x = TAU * 2 * i / NP, X = GX + GW * i / NP, Y = GY - GA * scale * H.c[n] * Math.sin(n * x + H.ph[n]); if (i) c.lineTo(X, Y); else c.moveTo(X, Y); }
            c.stroke(); c.globalAlpha = 1;
          }
        }
        // the partial sum
        let top = -1e9, err = 0;
        c.strokeStyle = C.accent; c.lineWidth = 2.6; c.beginPath();
        for (let i = 0; i <= NP; i++) { const x = TAU * 2 * i / NP, v = sumTo(N, x) * scale; top = Math.max(top, v); err += (v - target[i] * scale) * (v - target[i] * scale); const X = GX + GW * i / NP, Y = GY - GA * v; if (i) c.lineTo(X, Y); else c.moveTo(X, Y); }
        c.stroke();
        kit.label(c, 'two periods · dashed: the wave · thick: sum of the first ' + N + ' harmonic' + (N > 1 ? 's' : ''), GX + 4, 14, { size: 11, color: C.muted });
        // the spectrum
        const SX = 40, SW = 560, SY = 340, SH = 90, bw = SW / NH;
        let cmax = 1e-9; for (let n = 1; n <= NH; n++) cmax = Math.max(cmax, H.c[n]);
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(SX, SY); c.lineTo(SX + SW, SY); c.stroke();
        for (let n = 1; n <= NH; n++) {
          const h = SH * H.c[n] / cmax;
          c.fillStyle = n <= N ? C.accent : C.faint; c.fillRect(SX + (n - 1) * bw + 2, SY - h, bw - 4, h);
          if (n === 1 || n % 5 === 0) kit.label(c, String(n), SX + (n - 0.5) * bw, SY + 9, { size: 10, align: 'center', color: C.muted });
        }
        kit.label(c, 'spectrum: size of harmonic n' + (V.kind === 'voice' ? ' (n × 120 Hz; formants near 730 and 1090 Hz)' : ' (n × ' + V.f0 + ' Hz)'), SX, SY - SH - 12, { size: 11, color: C.muted });
        let eIn = 0, eAll = 0; for (let n = 1; n <= NH; n++) { eAll += H.c[n] * H.c[n]; if (n <= N) eIn += H.c[n] * H.c[n]; }
        const nz = []; for (let n = 1; n <= N; n++) if (H.c[n] > 1e-12) nz.push(n);
        ro.set('N', N + ' (non-zero: ' + nz.length + ')');
        ro.set('over', V.kind === 'square' ? top.toFixed(3) + ' (overshoot ' + (100 * (top - 1) / 2).toFixed(1) + ' % of the jump)' : top.toFixed(3));
        ro.set('err', Math.sqrt(err / (NP + 1)).toFixed(3));
        ro.set('E', (100 * eIn / eAll).toFixed(2) + ' %');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ osc-wake */
  Hyper.sim('osc-wake', {
    title: 'Bow waves: the Mach cone and Kelvin\'s wake',
    blurb: `**A moving source of sound.** The source sends out a wavelet every tenth of a second; each spreads as a circle from where the source was. Below the speed of sound the circles crowd together in front (a higher pitch ahead, a lower one behind: Doppler). Above it, the source outruns them and they pile up on a cone with $\\sin\\theta = c/v = 1/M$ (see [[?sine-cosine]]).

**A ship on deep water.** Water waves are dispersive, and the pattern is quite different: crests (drawn from Kelvin's theory) curve back from the bow and fill a wedge of 19.47°. The scale bar shows how big it is.

**Try this**
- Sound: raise the Mach number slowly from 0.5 to 1 — the wavefronts in front bunch up into a wall — and then to 2: a cone of 30°.
- Ship: change the speed from 2 to 12 m/s. The wedge keeps its angle; only the scale changes (the waves grow as $U^2$).
- Ship: show Kelvin's construction — the energy from one point of the path lies on a circle a quarter of the distance travelled across, and the tangents to all such circles make the 19.47° lines.`,
    mount(box, kit) {
      const W0 = 640, H0 = 340;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['A moving source of sound', 'sound'], ['A ship on deep water', 'ship']], value: 'sound' },
        { id: 'M', label: 'Mach number v/c', min: 0, max: 2.5, step: 0.05, value: 1.6 },
        { id: 'U', label: 'Speed of the ship', min: 1, max: 12, step: 0.5, value: 5, unit: 'm/s' },
        { id: 'kel', type: 'check', label: 'Show Kelvin\'s construction', value: false },
        { type: 'buttons', items: [{ id: 'again', label: 'Start again', primary: true }] }
      ], id => { if (id === 'mode') show(); if (id === 'again' || id === 'mode') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', ''], ['b', ''], ['c', '']]);
      function show() { const s = V.mode === 'sound'; ctl.show('M', s); ctl.show('U', !s); ctl.show('kel', !s); }
      show();
      const CS = 70, TE = 0.1;        // sound: 70 px per second, a wavelet every 0.1 s
      let t = 0, xs = 60, waves = [], lastE = -1, flow = [];
      function reset() { t = 0; xs = V.M > 0.05 ? 60 : W0 / 2; waves = []; lastE = -1; }
      reset();
      for (let i = 0; i < 90; i++) flow.push([(i * 97) % W0, 20 + (i * 53) % (H0 - 40)]);
      const loop = kit.loop(dt => {
        const c = begin(st, W0, H0), C = kit.colors();
        if (V.mode === 'sound') {
          t += dt;
          const v = V.M * CS, YS = H0 / 2;
          xs += v * dt;
          if (xs > W0 + 40 || (v < 1 && t > 8)) reset();
          if (Math.floor(t / TE) !== lastE) { lastE = Math.floor(t / TE); waves.push([xs, t]); if (waves.length > 60) waves.shift(); }
          c.strokeStyle = C.accent; c.lineWidth = 1.3;
          for (const [x0, t0] of waves) { const r = CS * (t - t0); if (r > 0.5) { c.globalAlpha = Math.max(0.15, 1 - r / 500); c.beginPath(); c.arc(x0, YS, r, 0, TAU); c.stroke(); } }
          c.globalAlpha = 1;
          if (V.M > 1) {
            const th = Math.asin(1 / V.M), L = 700;
            c.strokeStyle = C.bad; c.lineWidth = 2.4;
            for (const sg of [1, -1]) { c.beginPath(); c.moveTo(xs, YS); c.lineTo(xs - L * Math.cos(th), YS + sg * L * Math.sin(th)); c.stroke(); }
            arcArrow(c, xs, YS, 60, Math.PI, Math.PI - th, C.bad, 1.4);
            kit.label(c, 'θ = ' + (th * 180 / Math.PI).toFixed(1) + '°', xs - 95, YS - 30, { color: C.bad, weight: 700 });
          }
          // the source: a small aircraft shape
          c.fillStyle = C.text; c.beginPath(); c.moveTo(xs + 12, YS); c.lineTo(xs - 10, YS - 6); c.lineTo(xs - 6, YS); c.lineTo(xs - 10, YS + 6); c.closePath(); c.fill();
          c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(0, YS); c.lineTo(W0, YS); c.stroke(); c.setLineDash([]);
          kit.label(c, 'wavelets from the points the source passed · the source moves →', 10, 14, { size: 11, color: C.muted });
          ro.set('a', 'Mach number M = v/c: ' + V.M.toFixed(2));
          ro.set('b', V.M > 1 ? 'Cone half-angle θ = arcsin(1/M) = ' + (Math.asin(1 / V.M) * 180 / Math.PI).toFixed(1) + '°' : 'No cone: the source is slower than its waves');
          ro.set('c', V.M < 1 ? 'Pitch ahead × ' + (1 / (1 - V.M)).toFixed(2) + ', behind × ' + (1 / (1 + V.M)).toFixed(2) : V.M === 1 ? 'M = 1: the wavefronts pile up into a wall' : 'Ahead of the cone, nothing is heard yet');
        } else {
          t += dt;
          const U = V.U, lam = TAU * U * U / 9.81, NF = 6, sx = 470 / (1.12 * NF * lam), SX = 560, SY = H0 / 2;
          // water drifting past (the ship's frame): dots move to the left at the ship's speed, scaled
          c.fillStyle = C.faint;
          for (const p of flow) { p[0] -= U * sx * dt; if (p[0] < 0) p[0] += W0; c.fillRect(p[0], p[1], 2, 2); }
          // Kelvin's crests: x = −a cos θ (1 + sin²θ), y = a cos²θ sin θ, with a = n λ
          for (let n = 1; n <= NF; n++) {
            const a = n * lam; c.strokeStyle = C.accent; c.lineWidth = 2; c.globalAlpha = Math.max(0.35, 1 - n * 0.09); c.beginPath();
            for (let i = 0; i <= 120; i++) { const th = -Math.PI / 2 + Math.PI * i / 120, X = SX - sx * a * Math.cos(th) * (1 + Math.sin(th) * Math.sin(th)), Y = SY + sx * a * Math.cos(th) * Math.cos(th) * Math.sin(th); if (i) c.lineTo(X, Y); else c.moveTo(X, Y); }
            c.stroke();
          }
          c.globalAlpha = 1;
          // the 19.47° lines
          const al = Math.asin(1 / 3), L = 560;
          c.strokeStyle = C.bad; c.setLineDash([6, 4]); c.lineWidth = 1.6;
          for (const sg of [1, -1]) { c.beginPath(); c.moveTo(SX, SY); c.lineTo(SX - L * Math.cos(al), SY + sg * L * Math.sin(al)); c.stroke(); }
          c.setLineDash([]);
          kit.label(c, '19.47°', SX - 150, SY - 26, { color: C.bad, weight: 700 });
          if (V.kel) {
            const d = 3.2 * lam * sx, P = SX - d;      // a point the ship passed: distance Ut
            c.strokeStyle = C.ok; c.lineWidth = 1.6; c.beginPath(); c.arc(SX - 0.75 * d, SY, d / 4, 0, TAU); c.stroke();
            kit.dot(c, P, SY, 4, C.ok); kit.label(c, 'P', P - 4, SY + 14, { color: C.ok, weight: 700, align: 'right' });
            const tx = SX - 0.75 * d + (d / 4) * Math.sin(al), ty = SY - (d / 4) * Math.cos(al);
            c.strokeStyle = C.ok; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(SX, SY); c.lineTo(tx, ty); c.stroke(); c.setLineDash([]);
            kit.label(c, 'energy from P: circle of radius Ut/4, centre 3Ut/4 behind', P - 10, SY + 36, { size: 11, color: C.ok });
          }
          // the ship
          c.fillStyle = C.text; c.beginPath(); c.moveTo(SX + 14, SY); c.lineTo(SX - 10, SY - 7); c.lineTo(SX - 16, SY - 7); c.lineTo(SX - 16, SY + 7); c.lineTo(SX - 10, SY + 7); c.closePath(); c.fill();
          // scale bar
          const nice = Hyper.niceStep ? Hyper.niceStep(lam * 2, 1) : lam, bar = nice * sx;
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(20, H0 - 16); c.lineTo(20 + bar, H0 - 16); c.stroke();
          kit.label(c, kit.fmt(nice, 3) + ' m', 26 + bar, H0 - 16, { size: 11 });
          kit.label(c, 'seen from above, moving with the ship →', 10, 14, { size: 11, color: C.muted });
          ro.set('a', 'Transverse wavelength 2πU²/g = ' + lam.toFixed(1) + ' m');
          ro.set('b', 'Wedge half-angle: 19.47° at every speed');
          ro.set('c', 'Crest speed of the transverse waves = U = ' + U.toFixed(1) + ' m/s');
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

})();
