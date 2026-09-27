/* HYPER-AERODYNAMICS · sims/flow.js — simulations for "How Air Flows" and "Wind on structures".
 *   flow-lines      a stream past a cylinder that swings or switches direction: streamlines of the
 *                   instant, pathlines of single particles and streaklines of dye, drawn together
 *   flow-venturi    a venturi tube with a multi-tube manometer bank, a total-pressure tube and an
 *                   optional lossy diffuser; Bernoulli against the isentropic (compressible) answer
 *   flow-jet        a water jet turned by a vane inside a control volume: momentum in, momentum out,
 *                   the force on the vane against the turning angle
 *   flow-vortex     Rankine, free and solid-body vortices (and a vortex in a stream): circulation
 *                   round a loop you drag, vorticity enclosed, and a paddle wheel that shows rotation
 *   flow-pitot      a pitot-static system feeding an airspeed indicator, altimeter and VSI, with
 *                   iced pitots, blocked drains and ports, alternate static and leaks
 *   flow-airspeeds  IAS, CAS, EAS, TAS and Mach at any height and temperature, with the corrections
 *   flow-flutter    a two-degree-of-freedom wing section (bending and torsion) with unsteady
 *                   aerodynamics (Theodorsen via the Wagner function): damping and frequency of both
 *                   modes against speed, flutter and divergence speeds, the section moving live
 *   flow-gallop     a bluff section on springs in the wind: vortex-induced vibration (a bounded
 *                   resonance near f·D/St) against galloping (self-excited, above a critical speed)
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, KT = 1852 / 3600, FT = 0.3048, FPM = 0.00508;
  const P_SL = 101325, A_SL = Math.sqrt(1.4 * 287.058 * 288.15), RHO_SL = 1.225;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fin = (x, d) => (Number.isFinite(x) ? x : (d || 0));

  /* ---------------------------------------------------------------- airspeed arithmetic */
  // impact pressure qc = p0 - p for a calibrated airspeed (the subsonic formula an airspeed indicator is built to)
  const qcFromCas = V => P_SL * (Math.pow(1 + 0.2 * (V / A_SL) * (V / A_SL), 3.5) - 1);
  const casFromQc = qc => (qc > 0 ? A_SL * Math.sqrt(5 * (Math.pow(qc / P_SL + 1, 2 / 7) - 1)) : 0);
  // Mach number from impact pressure and static pressure; above Mach 1 the pitot sits behind a normal shock (Rayleigh)
  function machFromQc(qc, p) {
    const r = qc / p + 1;
    if (!(r > 1)) return 0;
    const M = Math.sqrt(5 * (Math.pow(r, 2 / 7) - 1));
    if (M <= 1) return M;
    const ray = m => Math.pow(1.2 * m * m, 3.5) * Math.pow(2.4 / (2.8 * m * m - 0.4), 2.5) - r;
    let lo = 1, hi = 10;
    for (let k = 0; k < 80; k++) { const mid = (lo + hi) / 2; if (ray(mid) > 0) hi = mid; else lo = mid; }
    return (lo + hi) / 2;
  }
  // pressure altitude from static pressure (ISA, to 20 km)
  function altFromP(p) {
    if (!(p > 0)) return 20000;
    if (p >= 22632.06) return 288.15 / 0.0065 * (1 - Math.pow(p / P_SL, 0.0065 * 287.058 / 9.80665));
    return 11000 + 287.058 * 216.65 / 9.80665 * Math.log(22632.06 / p);
  }
  const niceUp = x => { if (!(x > 0)) return 1; const e = Math.pow(10, Math.floor(Math.log10(x))), f = x / e; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * e; };
  const graphDiv = box => { const d = document.createElement('div'); d.style.padding = '4px 10px 10px'; box.stage.appendChild(d); return d; };

  /* ================================================================ streamlines, pathlines, streaklines */
  Hyper.sim('flow-lines', {
    title: 'Streamlines, pathlines and streaklines',
    blurb: `A stream of air flows past a cylinder (ideal, inviscid flow — no wake). Its direction can swing from side to side or switch back and forth, which makes the flow **unsteady**. Three kinds of line are drawn at once:
- **Streamlines** (grey): lines everywhere tangent to the velocity *at this instant*. The ones through the dye nozzles are dashed.
- **Pathlines** (orange): the track of one particle released from each nozzle.
- **Streaklines** (blue): all the dye that has come out of each nozzle — what smoke or dye actually shows you.

**Try this**
- Choose the steady stream: the three kinds of line fall on top of each other. In steady flow they are the same thing.
- Swing the stream: the streamlines swing as straight-ish fans, the pathlines are wavy tracks that stay where they were drawn, and the streaklines are waves that travel downstream. Three different pictures of one flow.
- Compare the wavelength of the dye wave with the readout $U \\cdot T$: the pattern is laid down by a nozzle in a stream moving at $U$.
- Switch direction instead of swinging: the dye kinks sharply while the streamlines jump all at once — streamlines can change instantly, particles cannot.
- Remove the cylinder and swing the stream: in a uniform flow every streamline is straight at every instant, yet no particle moves in a straight line.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'The stream', options: [['Steady', 'steady'], ['Swinging from side to side', 'swing'], ['Switching direction', 'switch']], value: (params && params.mode) || 'swing' },
        { id: 'amp', label: 'Swing amplitude', min: 0, max: 35, step: 1, value: 20, unit: '°' },
        { id: 'T', label: 'Period of the swing T', min: 1, max: 10, step: 0.5, value: 4, unit: 's' },
        { id: 'U', label: 'Stream speed U', min: 0.2, max: 1.2, step: 0.05, value: 0.6, unit: 'm/s' },
        { id: 'cyl', type: 'check', label: 'Cylinder in the stream (0.3 m across)', value: true },
        { id: 'sl', type: 'check', label: 'Streamlines (this instant)', value: true },
        { id: 'pl', type: 'check', label: 'Pathlines (one particle each)', value: true },
        { id: 'sk', type: 'check', label: 'Streaklines (dye)', value: true },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart the dye', primary: true }] }
      ], id => { if (id === 'restart' || id === 'mode' || id === 'cyl' || id === 'U' || id === 'T') restart(); loop.once(); });
      const ro = kit.readout(box.side, [['t', 'Time since the dye started'], ['beta', 'Stream direction now'], ['lam', 'Wavelength U·T'], ['state', '']]);
      const V = ctl.values, R = 0.15, XC = 0.35, X0 = -1.2, X1 = 1.9, EMIT = 0.05, XN = X0 + 0.12;
      const NOZ = [-0.42, -0.14, 0.14, 0.42];
      let t = 0, emitT = 0, dye = [], paths = [];
      const beta = tt => {
        if (V.mode === 'steady') return 0;
        const b0 = V.amp * D2R, s = Math.sin(2 * Math.PI * tt / V.T);
        return V.mode === 'swing' ? b0 * s : b0 * Math.tanh(5 * s);
      };
      // ideal flow past a cylinder with the free stream at angle b: W = u - iv = U (e^{-ib} - R² e^{ib} / z²)
      function vel(x, y, tt) {
        const b = beta(tt), U = V.U, cb = Math.cos(b), sb = Math.sin(b);
        if (!V.cyl) return [U * cb, U * sb];
        const dx = x - XC, dy = y, r2 = dx * dx + dy * dy;
        if (r2 < R * R) return null;
        const a = dx * dx - dy * dy, c = 2 * dx * dy, d = a * a + c * c;
        const re = (cb * a + sb * c) / d, im = (sb * a - cb * c) / d;
        return [U * (cb - R * R * re), U * (sb + R * R * im)];
      }
      const ymax = () => (st.H / 2) / (st.W / (X1 - X0));
      function advect(p, h, tt) {
        const k1 = vel(p[0], p[1], tt); if (!k1) return false;
        const k2 = vel(p[0] + h / 2 * k1[0], p[1] + h / 2 * k1[1], tt + h / 2); if (!k2) return false;
        p[0] += h * k2[0]; p[1] += h * k2[1];
        return true;
      }
      function restart() {
        t = 0; emitT = 0;
        dye = NOZ.map(y => [[XN, y, 0]]);
        paths = NOZ.map(y => ({ p: [XN, y], trail: [[XN, y]], alive: true, wait: 0, acc: 0 }));
      }
      function trace(x, y, dir, tt) {
        const pts = [[x, y]], ym = ymax() + 0.1;
        for (let n = 0; n < 420; n++) {
          const w1 = vel(x, y, tt); if (!w1) break;
          const s1 = Math.hypot(w1[0], w1[1]); if (s1 < 1e-6) break;
          const h = 0.02 * dir;
          const w2 = vel(x + h * w1[0] / s1 / 2, y + h * w1[1] / s1 / 2, tt); if (!w2) break;
          const s2 = Math.hypot(w2[0], w2[1]); if (s2 < 1e-6) break;
          x += h * w2[0] / s2; y += h * w2[1] / s2;
          pts.push([x, y]);
          if (x < X0 - 0.05 || x > X1 + 0.05 || Math.abs(y) > ym) break;
        }
        return pts;
      }
      const streamline = (x, y, tt) => trace(x, y, -1, tt).reverse().concat(trace(x, y, 1, tt).slice(1));
      restart();
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), s = st.W / (X1 - X0), oy = st.H / 2, ym = ymax();
        const P = (x, y) => [(x - X0) * s, oy - y * s];
        const out = q => q[0] > X1 + 0.05 || q[0] < X0 - 0.3 || Math.abs(q[1]) > ym + 0.25;
        // ---- physics: fixed sub-steps
        const n = 4, h = dt / n;
        for (let k = 0; k < n; k++) {
          for (const arr of dye) for (const q of arr) if (!q[2] && !advect(q, h, t)) q[2] = 1;
          for (const pa of paths) {
            if (pa.alive) { if (!advect(pa.p, h, t) || out(pa.p)) pa.alive = false; }
            else { pa.wait += h; }
          }
          t += h; emitT += h;
          while (emitT >= EMIT) {
            emitT -= EMIT;
            dye.forEach((arr, i) => { arr.push([XN, NOZ[i], 0]); while (arr.length && (arr[0][2] || out(arr[0]))) arr.shift(); if (arr.length > 500) arr.shift(); });
            paths.forEach((pa, i) => {
              if (pa.alive) { pa.trail.push([pa.p[0], pa.p[1]]); if (pa.trail.length > 600) pa.trail.shift(); }
              else if (pa.wait > 1.2) { pa.p = [XN, NOZ[i]]; pa.trail = [[XN, NOZ[i]]]; pa.alive = true; pa.wait = 0; }
            });
          }
        }
        const b = beta(t);
        // ---- streamlines of this instant
        if (V.sl) {
          const nx = -Math.sin(b), ny = Math.cos(b);
          c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([]);
          for (let sv = -1.75; sv <= 1.76; sv += 0.175) {
            if (V.cyl && Math.abs(sv) < R + 0.02) continue;
            const L = streamline(XC + sv * nx, sv * ny, t);
            c.beginPath(); L.forEach((q, i) => { const [x, y] = P(q[0], q[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
          }
          c.strokeStyle = C.muted; c.lineWidth = 1.3; c.setLineDash([6, 4]);
          for (const yN of NOZ) {
            const L = streamline(XN, yN, t);
            c.beginPath(); L.forEach((q, i) => { const [x, y] = P(q[0], q[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
          }
          c.setLineDash([]);
        }
        // ---- streaklines: the dye, joined in the order it left the nozzle
        if (V.sk) {
          c.strokeStyle = C.series[0]; c.lineWidth = 2.2;
          for (const arr of dye) {
            c.beginPath(); let pen = false, last = null;
            for (let i = arr.length - 1; i >= 0; i--) {
              const q = arr[i];
              if (q[2] || (last && Math.hypot(q[0] - last[0], q[1] - last[1]) > 0.3)) { pen = false; last = null; if (q[2]) continue; }
              const [x, y] = P(q[0], q[1]);
              if (pen) c.lineTo(x, y); else { c.moveTo(x, y); pen = true; }
              last = q;
            }
            c.stroke();
          }
        }
        // ---- pathlines: the track of one particle from each nozzle
        if (V.pl) {
          c.strokeStyle = C.series[1]; c.lineWidth = 2;
          for (const pa of paths) {
            c.beginPath(); pa.trail.forEach((q, i) => { const [x, y] = P(q[0], q[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); });
            if (pa.alive) { const [x, y] = P(pa.p[0], pa.p[1]); c.lineTo(x, y); }
            c.stroke();
            if (pa.alive) { const [x, y] = P(pa.p[0], pa.p[1]); kit.dot(c, x, y, 4.5, C.series[1], C.bg2); }
          }
        }
        // ---- the cylinder and the nozzles
        if (V.cyl) { const [cx, cy] = P(XC, 0); c.beginPath(); c.arc(cx, cy, R * s, 0, 2 * Math.PI); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.stroke(); }
        for (const yN of NOZ) {
          const [x, y] = P(XN, yN);
          c.fillStyle = C.text; c.fillRect(0, y - 1.5, x - 3, 3); c.fillRect(x - 7, y - 4, 7, 8);
        }
        // ---- the free-stream direction
        const ax = st.W - 70, ay = 30, L = 42;
        kit.arrow(c, ax - L / 2 * Math.cos(b), ay + L / 2 * Math.sin(b), ax + L / 2 * Math.cos(b), ay - L / 2 * Math.sin(b), C.accent, 2.4);
        kit.label(c, 'stream now', ax, ay + 24, { align: 'center', size: 11, color: C.muted });
        // legend
        const lg = [[C.faint, 'streamlines (now)', V.sl], [C.series[1], 'pathlines', V.pl], [C.series[0], 'streaklines (dye)', V.sk]];
        let lx = 10;
        for (const [col, txt, on] of lg) {
          if (!on) continue;
          c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(lx, st.H - 12); c.lineTo(lx + 18, st.H - 12); c.stroke();
          kit.label(c, txt, lx + 23, st.H - 12, { size: 11, color: C.text });
          lx += 30 + txt.length * 6.3;
        }
        ro.set('t', t.toFixed(1) + ' s');
        ro.set('beta', (b / D2R).toFixed(1) + '°');
        ro.set('lam', V.mode === 'steady' ? '— (steady flow)' : (V.U * V.T).toFixed(2) + ' m');
        ro.set('state', V.mode === 'steady' || V.amp === 0 ? 'Steady: all three lines coincide' : 'Unsteady: the three lines differ');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ venturi tube and manometers */
  Hyper.sim('flow-venturi', {
    title: 'Venturi tube and manometer bank',
    blurb: `Air is blown through a round duct 100 mm across that narrows to a throat and widens again, and leaves into the room. Tappings in the wall lead to a bank of glass tubes whose liquid rises when the pressure at the tapping is **below** room pressure. The total-pressure tube faces into the flow at the throat. The graph shows the static and total pressure along the duct.

**Try this**
- Raise the inlet speed and watch the throat tube climb: the pressure drop grows with the square of the speed (double the speed, four times the drop).
- Narrow the throat: continuity makes the air faster there ($A_1V_1 = A_2V_2$) and Bernoulli makes its pressure lower.
- Look at the total-pressure tube: it reads the same as the static tube at the inlet plus the dynamic pressure there — $p_0$ is the same all along an ideal duct.
- Tick the real diffuser. The pressure no longer recovers fully and the whole upstream level rises, but the drop from inlet to throat — what a venturi flowmeter uses — is unchanged.
- Push the speed high with a narrow throat: the readout compares Bernoulli with the compressible (isentropic) answer as the throat Mach number passes 0.3.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'distance along the duct (m)', min: 0, max: 1 }, y: { label: 'pressure above room (Pa)' }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'V1', label: 'Inlet speed V₁', min: 2, max: 40, step: 0.5, value: (params && params.V1) || 15, unit: 'm/s' },
        { id: 'ratio', label: 'Throat area ÷ inlet area', min: 0.3, max: 1, step: 0.01, value: (params && params.ratio) || 0.5 },
        { id: 'loss', type: 'check', label: 'Real diffuser (recovers 85 %)', value: false },
        { id: 'pitot', type: 'check', label: 'Total-pressure tube at the throat', value: true },
        { id: 'liq', type: 'select', label: 'Manometer liquid', options: [['Water (1000 kg/m³)', 1000], ['Paraffin (800 kg/m³)', 800]], value: 1000 }
      ], () => update());
      const ro = kit.readout(box.side, [['Q', 'Volume flow Q = A₁V₁'], ['Vt', 'Throat speed'], ['Mt', 'Throat Mach number'], ['dp', 'Drop inlet → throat'], ['meter', 'Venturi meter says V₁ ='], ['rec', 'Pressure recovered at the exit'], ['comp', 'Compressible drop (isentropic)']]);
      const V = ctl.values, rho = 1.225, D1 = 0.1, r1 = D1 / 2, A1 = Math.PI * r1 * r1, g = 9.80665;
      const TAPS = [{ x: 0.07, n: '1' }, { x: 0.25, n: '2' }, { x: 0.385, n: '3' }, { x: 0.55, n: '4' }, { x: 0.7, n: '5' }, { x: 0.93, n: '6' }];
      const XP = 0.425;
      const rt = () => r1 * Math.sqrt(V.ratio);
      function rad(x) {
        const r2 = rt();
        if (x < 0.15 || x > 0.85) return r1;
        if (x < 0.35) { const u = (x - 0.15) / 0.2; return r1 + (r2 - r1) * (1 - Math.cos(Math.PI * u)) / 2; }
        if (x <= 0.45) return r2;
        const u = (x - 0.45) / 0.4; return r2 + (r1 - r2) * (1 - Math.cos(Math.PI * u)) / 2;
      }
      const speed = x => V.V1 * A1 / (Math.PI * rad(x) * rad(x));
      let st0 = null;
      function state() {
        const Vt = V.V1 / V.ratio, Ve = V.V1, eta = V.loss ? 0.85 : 1;
        const lossTot = (1 - eta) * 0.5 * rho * (Vt * Vt - Ve * Ve);
        const p0in = 0.5 * rho * Ve * Ve + lossTot;                  // gauge, the exit is at room pressure
        const lossTo = x => (x < 0.45 ? 0 : x > 0.85 ? lossTot : (1 - eta) * 0.5 * rho * (Vt * Vt - speed(x) ** 2));
        const p0 = x => p0in - lossTo(x);
        const p = x => p0(x) - 0.5 * rho * speed(x) ** 2;
        return { Vt, Ve, lossTot, p0in, p0, p };
      }
      const parts = Array.from({ length: 170 }, () => ({ x: Math.random(), f: (Math.random() * 2 - 1) * 0.88 }));
      function update() {
        st0 = state();
        const S = st0, pts = [], p0s = [];
        for (let i = 0; i <= 200; i++) { const x = i / 200; pts.push([x, S.p(x)]); p0s.push([x, S.p0(x)]); }
        plot.set({ series: [{ pts, label: 'static pressure p' }, { pts: p0s, label: 'total pressure p₀', dash: [6, 4] }],
          marks: TAPS.map(tp => ({ x: tp.x, y: S.p(tp.x), label: tp.n })), hlines: [{ y: 0, label: 'room' }] });
        const Q = A1 * V.V1, dp = S.p(0.07) - S.p(0.4);
        ro.set('Q', (Q * 1000).toFixed(1) + ' L/s (' + (Q * 3600).toFixed(0) + ' m³/h)');
        ro.set('Vt', S.Vt.toFixed(1) + ' m/s');
        const Mt = S.Vt / 340;
        ro.set('Mt', Mt.toFixed(3) + (Mt > 0.3 ? '  — compressibility matters' : ''));
        ro.set('dp', dp.toFixed(0) + ' Pa = ' + (dp / (V.liq * g) * 1000).toFixed(1) + ' mm of liquid');
        const Vm = Math.sqrt(Math.max(0, 2 * dp / (rho * (1 / (V.ratio * V.ratio) - 1 || 1e-9))));
        ro.set('meter', V.ratio > 0.99 ? '— (no throat)' : Vm.toFixed(2) + ' m/s');
        ro.set('rec', V.ratio > 0.99 ? '—' : (100 * (0 - S.p(0.4)) / (S.p(0.07) - S.p(0.4) || 1)).toFixed(0) + ' % of the drop (lost ' + S.lossTot.toFixed(0) + ' Pa)');
        // the same duct with compressible, isentropic flow: stagnation state from the exit
        const Te = 288.15, Me = V.V1 / Math.sqrt(1.4 * 287.058 * Te);
        const AeAs = F.isentropic(Me).AAstar, AtAs = V.ratio * AeAs;
        if (AtAs < 1) ro.set('comp', 'the throat would choke');
        else {
          const Mtc = V.ratio > 0.999 ? Me : F.machFromArea(AtAs, 1.4, false);
          const p0abs = 101325 * F.isentropic(Me).p0p, pt = p0abs / F.isentropic(Mtc).p0p, dpi = 0.5 * rho * (S.Vt * S.Vt - V.V1 * V.V1);
          const dpc = 101325 - pt;
          ro.set('comp', V.ratio > 0.99 ? '—' : dpc.toFixed(0) + ' Pa vs Bernoulli ' + dpi.toFixed(0) + ' Pa (+' + (100 * (dpc / (dpi || 1) - 1)).toFixed(1) + ' %)');
        }
        loop.once();
      }
      const loop = kit.loop(dt => {
        if (!st0) return;
        const c = st.begin(), C = kit.colors(), S = st0, W = st.W, H = st.H;
        const mx = 34, sx = (W - 2 * mx), yc = H * 0.2, sr = H * 0.13 / r1;
        const X = x => mx + x * sx;
        // ---- the duct
        c.beginPath();
        for (let i = 0; i <= 120; i++) { const x = i / 120; c.lineTo(X(x), yc - rad(x) * sr); }
        for (let i = 120; i >= 0; i--) { const x = i / 120; c.lineTo(X(x), yc + rad(x) * sr); }
        c.closePath(); c.fillStyle = C.surface; c.fill();
        c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); for (let i = 0; i <= 120; i++) { const x = i / 120; i ? c.lineTo(X(x), yc - rad(x) * sr) : c.moveTo(X(x), yc - rad(x) * sr); } c.stroke();
        c.beginPath(); for (let i = 0; i <= 120; i++) { const x = i / 120; i ? c.lineTo(X(x), yc + rad(x) * sr) : c.moveTo(X(x), yc + rad(x) * sr); } c.stroke();
        // particles, slowed down 50 times
        for (const q of parts) {
          const v = speed(q.x);
          q.x += v * dt * 0.02;
          if (q.x > 1) { q.x -= 1; q.f = (Math.random() * 2 - 1) * 0.88; }
          const fr = clamp((v / V.V1 - 1) / 2, 0, 1);
          c.fillStyle = 'hsl(' + (215 - 207 * fr) + ' 80% ' + (C.dark ? 62 : 48) + '% / .8)';
          c.fillRect(X(q.x) - 1.3, yc + q.f * rad(q.x) * sr - 1.3, 2.6, 2.6);
        }
        kit.arrow(c, 4, yc, mx - 4, yc, C.muted, 2);
        kit.label(c, 'from the fan', 4, yc - r1 * sr - 10, { size: 11, color: C.muted });
        kit.label(c, 'to the room', W - 4, yc - r1 * sr - 10, { size: 11, color: C.muted, align: 'right' });
        // ---- the manometer bank
        const top = H * 0.46, bot = H * 0.93, zero = H * 0.72;
        const tubes = TAPS.map(tp => ({ x: tp.x, n: tp.n, p: S.p(tp.x) }));
        if (V.pitot) tubes.push({ x: XP, n: 'p₀', p: S.p0(0.4), tot: true });
        const hmax = Math.max(...tubes.map(tb => Math.abs(tb.p) / (V.liq * g) * 1000), 1);
        const fs = niceUp(hmax * 1.05), k = (zero - top - 8) / fs;          // px per mm
        // scale
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (const f of [-0.5, 0, 0.5, 1]) {
          const y = zero - f * fs * k; if (y > bot - 2) continue;
          c.beginPath(); c.moveTo(mx - 8, y); c.lineTo(W - mx + 8, y); c.stroke();
          kit.label(c, (f * fs).toFixed(fs < 4 ? 1 : 0), mx - 10, y, { size: 10, color: C.muted, align: 'right' });
        }
        kit.label(c, 'mm', mx - 10, top - 10, { size: 10, color: C.muted, align: 'right' });
        // reservoir, open to the room
        c.fillStyle = C.series[0];
        c.globalAlpha = 0.5; c.fillRect(X(0) - 20, zero, 14, bot - zero); c.fillRect(X(0) - 20, bot - 6, X(1) - X(0) + 26, 6); c.globalAlpha = 1;
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(X(0) - 20, top + 10, 14, bot - top - 10);
        kit.label(c, 'open', X(0) - 13, top + 2, { size: 9.5, color: C.muted, align: 'center' });
        for (const tb of tubes) {
          const x = X(tb.x), hmm = -tb.p / (V.liq * g) * 1000, lev = clamp(zero - hmm * k, top + 2, bot - 2);
          // the tapping line from the duct wall (or the total-pressure probe) to the top of the tube
          const ytap = tb.tot ? yc : yc + rad(tb.x) * sr;
          c.strokeStyle = tb.tot ? C.series[1] : C.muted; c.lineWidth = 1.4;
          c.beginPath(); c.moveTo(x, ytap); c.lineTo(x, top); c.stroke();
          if (tb.tot) { c.lineWidth = 2.4; c.beginPath(); c.moveTo(x, yc + 1); c.lineTo(x - 16, yc + 1); c.stroke(); kit.dot(c, x - 16, yc + 1, 2.2, C.series[1]); }
          else kit.dot(c, x, ytap, 2.6, C.text);
          c.globalAlpha = 0.75; c.fillStyle = tb.tot ? C.series[1] : C.series[0]; c.fillRect(x - 4, lev, 8, bot - lev); c.globalAlpha = 1;
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(x - 4.5, top, 9, bot - top);
          kit.label(c, tb.n, x, bot + 10, { size: 10.5, align: 'center', color: tb.tot ? C.series[1] : C.text, weight: 700 });
          kit.label(c, hmm.toFixed(Math.abs(hmm) < 10 ? 1 : 0), x + 7, lev - 7, { size: 9.5, color: C.muted });
        }
        kit.label(c, 'liquid rises where the duct pressure is below room pressure', W - mx, top - 12, { size: 10.5, color: C.muted, align: 'right' });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ jet on a vane: the control volume */
  Hyper.sim('flow-jet', {
    title: 'A jet on a vane: the control volume',
    blurb: `A water jet from a nozzle strikes a vane that turns it through an angle θ. Draw a **control volume** round the vane: momentum flows in with the jet ($\\dot m V$ to the right) and out with the turned jet. The difference, per second, is the force the vane must exert on the water — and so, by Newton's third law, the force of the water on the vane, which the spring balance measures.

**Try this**
- Set θ = 90° (a flat plate): the force is $\\dot m V = \\rho A V^2$. Now 180° (a cup that sends the water back): twice as much. The graph is $1 - \\cos\\theta$.
- Double the jet speed: the force quadruples, because both the mass flow and the momentum per kilogram double.
- Make the vane one-sided: the turned jet now also pushes the vane sideways ($F_y$), and the balance only reads the part along the jet.
- Add friction on the vane so the water leaves slower: the force falls, most at 180°. Pelton-wheel buckets are polished for this reason.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 260 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'turning angle θ (°)', min: 0, max: 180 }, y: { label: 'force along the jet Fx (N)', min: 0 }, legend: true }, 160);
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Jet speed V', min: 2, max: 30, step: 0.5, value: 12, unit: 'm/s' },
        { id: 'd', label: 'Nozzle diameter d', min: 5, max: 25, step: 1, value: 12, unit: 'mm' },
        { id: 'th', label: 'Turning angle θ', min: 0, max: 180, step: 5, value: 90, unit: '°' },
        { id: 'vane', type: 'select', label: 'Vane', options: [['Symmetric (splits the jet)', 'sym'], ['One-sided (turns it all)', 'one']], value: 'sym' },
        { id: 'k', label: 'Exit speed ÷ entry speed', min: 0.7, max: 1, step: 0.01, value: 1 },
        { id: 'cv', type: 'check', label: 'Show the control volume', value: true }
      ], () => update());
      const ro = kit.readout(box.side, [['m', 'Mass flow ṁ = ρAV'], ['min', 'Momentum in ṁV'], ['fx', 'Force on the vane Fx'], ['fy', 'Sideways force Fy'], ['kg', 'The balance reads'], ['eq', '']]);
      const V = ctl.values, rho = 1000;
      let S = null;
      function update() {
        const A = Math.PI * (V.d / 1000) ** 2 / 4, md = rho * A * V.V, th = V.th * D2R, V2 = V.k * V.V;
        const Fx = md * (V.V - V2 * Math.cos(th)), Fy = V.vane === 'one' ? -md * V2 * Math.sin(th) : 0;
        S = { A, md, th, V2, Fx, Fy };
        ro.set('m', md.toFixed(3) + ' kg/s');
        ro.set('min', (md * V.V).toFixed(2) + ' N');
        ro.set('fx', Fx.toFixed(2) + ' N');
        ro.set('fy', V.vane === 'one' ? Fy.toFixed(2) + ' N (the vane is pushed away from where the jet goes)' : '0 (the two halves cancel)');
        ro.set('kg', (Fx / 9.80665).toFixed(2) + ' kgf — the weight of ' + (Fx / 9.80665).toFixed(2) + ' kg');
        ro.set('eq', 'Fx = ṁ(V − V₂ cos θ) = ' + md.toFixed(3) + ' × (' + V.V.toFixed(1) + ' − ' + V2.toFixed(1) + ' × ' + Math.cos(th).toFixed(3) + ')');
        const ideal = [], real = [];
        for (let a = 0; a <= 180; a += 3) { ideal.push([a, md * V.V * (1 - Math.cos(a * D2R))]); real.push([a, md * (V.V - V2 * Math.cos(a * D2R))]); }
        plot.set({ series: [{ pts: ideal, label: 'no friction: ρAV²(1 − cos θ)' }, { pts: real, label: 'with this vane', dash: V.k < 1 ? [6, 4] : null }],
          marks: [{ x: V.th, y: Fx, label: Fx.toFixed(1) + ' N' }], y: { label: 'force along the jet Fx (N)', min: 0, max: niceUp(2.05 * md * V.V) } });
        loop.once();
      }
      const parts = [];
      const loop = kit.loop(dt => {
        if (!S) return;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const y0 = H * (V.vane === 'one' ? 0.66 : 0.5), xn = W * 0.12, xa = W * 0.46;
        const R = Math.min(H * (V.vane === 'one' ? 0.27 : 0.2), W * 0.2);
        const t1 = 5 + V.d * 0.85, t2 = t1 / V.k;                     // jet thickness before and on the vane (px)
        const sym = V.vane === 'sym', th = S.th;
        const vis = v => 60 + 9 * v;                                   // drawing speed, px/s
        // centre of the upper arc (screen coordinates, y down): the vane surface starts at the apex heading right
        const yApex = sym ? y0 : y0 + t1 / 2;
        const Cu = [xa, yApex - R];
        // ---- the vane
        const arcPts = (sgn) => { const pts = []; for (let i = 0; i <= 40; i++) { const f = th * i / 40; pts.push([Cu[0] + R * Math.sin(f), sgn > 0 ? Cu[1] + R * Math.cos(f) : 2 * y0 - (Cu[1] + R * Math.cos(f))]); } return pts; };
        c.lineWidth = 5; c.strokeStyle = C.text; c.lineCap = 'round';
        for (const sgn of sym ? [1, -1] : [1]) { const pts = arcPts(sgn); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); }
        c.lineCap = 'butt';
        // the support rod and spring balance behind the vane
        const xs = xa + 8, xw = W - 20;
        c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(xa, yApex); c.lineTo(xs + 40, yApex); c.stroke();
        c.lineWidth = 1.6; c.beginPath(); c.moveTo(xs + 40, yApex);
        const nz = 9, sl = (xw - xs - 60) / nz;
        for (let i = 0; i < nz; i++) { c.lineTo(xs + 40 + (i + 0.5) * sl, yApex + (i % 2 ? 8 : -8)); }
        c.lineTo(xw - 20, yApex); c.lineTo(xw, yApex); c.stroke();
        c.fillStyle = C.faint; c.fillRect(xw, yApex - 26, 8, 52);
        kit.label(c, 'balance: ' + S.Fx.toFixed(1) + ' N', (xs + xw) / 2 + 20, yApex + 24, { align: 'center', size: 12, weight: 700, color: C.text });
        // ---- the nozzle
        c.fillStyle = C.faint; c.fillRect(4, y0 - t1 / 2 - 10, xn - 4, t1 + 20);
        c.beginPath(); c.moveTo(xn - 16, y0 - t1 / 2 - 10); c.lineTo(xn, y0 - t1 / 2); c.lineTo(xn, y0 + t1 / 2); c.lineTo(xn - 16, y0 + t1 / 2 + 10); c.closePath(); c.fill();
        // ---- the water: particles follow the jet, the vane and leave along its exit direction
        const spawn = Math.min(12, Math.round(dt * (40 + 6 * V.d)));
        for (let i = 0; i < spawn && parts.length < 700; i++) parts.push({ s: Math.random() * 6, lane: Math.random(), done: false });
        const L1 = xa - xn;
        c.fillStyle = C.series[0];
        for (const q of parts) {
          const upper = !sym || q.lane >= 0.5, l = sym ? Math.abs(q.lane - 0.5) * 2 : q.lane;   // 0 = against the vane
          const halfT1 = sym ? t1 / 2 : t1, halfT2 = sym ? t2 / 2 : t2;
          const rr = R - l * halfT2;                                      // radius of this lane on the vane
          const La = rr * th;
          let x, y, v;
          if (q.s < L1) {
            v = V.V;
            const blend = clamp((q.s - (L1 - 30)) / 30, 0, 1), off = l * (halfT1 * (1 - blend) + halfT2 * blend);
            x = xn + q.s; y = yApex - off;
          } else if (q.s < L1 + La) {
            const f = (q.s - L1) / rr; v = V.V + (S.V2 - V.V) * f / Math.max(th, 1e-3);
            x = Cu[0] + rr * Math.sin(f); y = Cu[1] + rr * Math.cos(f);
          } else {
            v = S.V2;
            const e = q.s - L1 - La, ex = Cu[0] + rr * Math.sin(th), ey = Cu[1] + rr * Math.cos(th);
            x = ex + e * Math.cos(th); y = ey - e * Math.sin(th);
          }
          if (!upper) y = 2 * y0 - y;
          q.s += vis(v) * dt;
          if (x < -10 || x > W + 10 || y < -10 || y > H + 10 || q.s > 4000) q.done = true;
          else c.fillRect(x - 1.5, y - 1.5, 3, 3);
        }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].done) parts.splice(i, 1);
        // ---- the control volume and the momentum fluxes crossing it
        if (V.cv) {
          const bx0 = xa - 0.45 * R - 20, bx1 = xa + 1.25 * R + 24, by0 = Cu[1] - R - 26, by1 = sym ? 2 * y0 - (Cu[1] - R - 26) : y0 + t1 + 28;
          c.setLineDash([7, 5]); c.strokeStyle = C.accent; c.lineWidth = 1.6; c.strokeRect(bx0, by0, bx1 - bx0, by1 - by0); c.setLineDash([]);
          kit.label(c, 'control volume', bx0 + 4, by0 - 10, { size: 11, color: C.accent });
          const inL = 44;
          kit.arrow(c, bx0 - inL - 6, y0 - t1 - 14, bx0 - 6, y0 - t1 - 14, C.series[1], 2.4);
          kit.label(c, 'in: ṁV = ' + (S.md * V.V).toFixed(1) + ' N', bx0 - inL - 6, y0 - t1 - 30, { size: 11, color: C.series[1] });
          const outL = 40 * S.V2 / V.V, rc = R - (sym ? t2 / 4 : t2 / 2);
          let lx = 0, ly = 0;
          for (const sgn of sym ? [1, -1] : [1]) {
            const ex = Cu[0] + rc * Math.sin(th) + 34 * Math.cos(th), eyr = Cu[1] + rc * Math.cos(th) - 34 * Math.sin(th), ey = sgn > 0 ? eyr : 2 * y0 - eyr;
            const dx = Math.cos(th), dy = -Math.sin(th) * sgn;
            kit.arrow(c, ex, ey, ex + dx * outL, ey + dy * outL, C.series[1], 2.4);
            if (sgn > 0) { lx = ex + dx * outL; ly = ey + dy * outL; }
          }
          kit.label(c, 'out: ' + (sym ? '2 × ½' : '') + 'ṁV₂', clamp(lx + 6, 4, W - 90), clamp(ly - 12, 12, H - 12), { size: 11, color: C.series[1] });
        }
        // the force of the water on the vane
        const fs = 70 / Math.max(2 * S.md * V.V, 1e-9);
        const fxp = xa + R * 0.5, fyp = sym ? y0 : Cu[1] + R * 0.35;
        kit.arrow(c, fxp, fyp, fxp + S.Fx * fs, fyp, C.bad, 3.2);
        if (!sym && Math.abs(S.Fy) > 1e-6) kit.arrow(c, fxp, fyp, fxp, fyp - S.Fy * fs, C.bad, 2.2);
        kit.label(c, 'F on the vane', fxp + S.Fx * fs + 6, fyp - 12, { size: 11.5, color: C.bad, weight: 700 });
        kit.label(c, 'jet ' + V.V.toFixed(1) + ' m/s, ' + V.d + ' mm', 8, 16, { size: 12, color: C.text, weight: 700 });
        kit.label(c, 'θ = ' + V.th + '°', 8, 34, { size: 12, color: C.muted });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ vortices and circulation */
  Hyper.sim('flow-vortex', {
    title: 'Vortices, circulation and a paddle wheel',
    blurb: `Air circling round a centre. The dashed loop is yours: drag its centre anywhere. The readout adds up the velocity along the loop — the **circulation** $\\Gamma = \\oint \\vec V\\cdot d\\vec s$ — and, separately, the **vorticity** inside it; Stokes' theorem says the two are equal. The little paddle wheel floats with the air and turns at half the local vorticity: drag it where you like.

**Try this**
- In the Rankine vortex, put the paddle wheel outside the core. It sails round the centre but keeps pointing the same way: the air there circles without rotating. Inside the core it spins.
- Shrink the loop so that it misses the core: the circulation is zero even though the air round it is moving fast. Make it enclose the core: the circulation is the full Γ, whatever the loop's size.
- In solid-body rotation the circulation grows with the loop's area — the vorticity is spread everywhere.
- Add a stream: the loop still measures Γ, and a wing carrying that circulation would lift ρUΓ per metre of span (the Kutta–Joukowski theorem).`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 260 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'distance from the centre r (m)', min: 0, max: 1.1 }, y: { label: 'v_θ (m/s)  ·  ω (1/s)' }, legend: true }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Flow', options: [['Rankine vortex (core + free)', 'rankine'], ['Free (irrotational) vortex', 'free'], ['Solid-body rotation', 'solid'], ['Stream + vortex', 'stream']], value: 'rankine' },
        { id: 'G', label: 'Circulation Γ', min: 0.2, max: 5, step: 0.1, value: 2, unit: 'm²/s' },
        { id: 'a', label: 'Core radius a', min: 0.05, max: 0.4, step: 0.01, value: 0.18, unit: 'm' },
        { id: 'Om', label: 'Rotation rate Ω', min: 0.2, max: 3, step: 0.1, value: 1, unit: 'rad/s' },
        { id: 'U', label: 'Stream speed U', min: 0, max: 4, step: 0.1, value: 1.5, unit: 'm/s' },
        { id: 'rL', label: 'Loop radius', min: 0.05, max: 0.8, step: 0.01, value: 0.3, unit: 'm' },
        { type: 'buttons', items: [{ id: 'drop', label: 'Drop the paddle wheel again', primary: true }, { id: 'centre', label: 'Loop to the centre' }] }
      ], id => {
        if (id === 'drop') drop();
        if (id === 'centre') { loopC = [0, 0]; }
        if (id === 'mode') { parts.length = 0; drop(); }
        showCtl(); refresh();
      });
      const ro = kit.readout(box.side, [['circ', '∮V·ds round your loop'], ['vort', 'Vorticity inside ∬ω dA'], ['wp', 'Vorticity at the paddle'], ['spin', 'Paddle wheel turns at'], ['lift', 'Lift per metre ρUΓ']]);
      const V = ctl.values, X0 = -1.1, X1 = 1.1, rho = 1.225, A0S = 0.06;
      let loopC = [0.05, 0.02], pad = { x: 0.6, y: 0, ang: 0 };
      const parts = [];
      const coreA = () => (V.mode === 'stream' ? A0S : V.a);
      function vth(r) {
        if (V.mode === 'solid') return V.Om * r;
        if (V.mode === 'free') return V.G / (2 * Math.PI * Math.max(r, 0.03));
        const a = coreA();
        return r < a ? V.G * r / (2 * Math.PI * a * a) : V.G / (2 * Math.PI * r);
      }
      function omega(r) {
        if (V.mode === 'solid') return 2 * V.Om;
        if (V.mode === 'free') return 0;
        const a = coreA(); return r < a ? V.G / (Math.PI * a * a) : 0;
      }
      function vel(x, y) {
        const r = Math.hypot(x, y), w = vth(r), ux = r > 1e-9 ? -w * y / r : 0, uy = r > 1e-9 ? w * x / r : 0;
        return V.mode === 'stream' ? [ux + V.U, uy] : [ux, uy];
      }
      function lens(r1, r2, d) {
        if (d >= r1 + r2) return 0;
        if (d <= Math.abs(r1 - r2)) return Math.PI * Math.min(r1, r2) ** 2;
        const a1 = Math.acos(clamp((d * d + r1 * r1 - r2 * r2) / (2 * d * r1), -1, 1)), a2 = Math.acos(clamp((d * d + r2 * r2 - r1 * r1) / (2 * d * r2), -1, 1));
        return r1 * r1 * (a1 - Math.sin(2 * a1) / 2) + r2 * r2 * (a2 - Math.sin(2 * a2) / 2);
      }
      function enclosed() {
        const d = Math.hypot(loopC[0], loopC[1]);
        if (V.mode === 'solid') return 2 * V.Om * Math.PI * V.rL * V.rL;
        if (V.mode === 'free') return d < V.rL ? V.G : 0;
        const a = coreA(); return V.G / (Math.PI * a * a) * lens(V.rL, a, d);
      }
      function circulation() {
        const N = 360; let s = 0;
        for (let k = 0; k < N; k++) {
          const f = 2 * Math.PI * (k + 0.5) / N, x = loopC[0] + V.rL * Math.cos(f), y = loopC[1] + V.rL * Math.sin(f);
          const [u, v] = vel(x, y); s += (-u * Math.sin(f) + v * Math.cos(f)) * V.rL * 2 * Math.PI / N;
        }
        return s;
      }
      function drop() { pad = { x: V.mode === 'stream' ? -0.8 : 0.6, y: V.mode === 'stream' ? 0.25 : 0, ang: 0 }; }
      function showCtl() {
        ctl.show('G', V.mode !== 'solid'); ctl.show('a', V.mode === 'rankine'); ctl.show('Om', V.mode === 'solid'); ctl.show('U', V.mode === 'stream');
        ro.show('lift', V.mode === 'stream');
      }
      function refresh() {
        const vs = [], ws = [];
        for (let i = 0; i <= 220; i++) { const r = 1.1 * i / 220; vs.push([r, vth(r)]); ws.push([r, omega(r)]); }
        plot.set({ series: [{ pts: vs, label: 'speed round the centre v_θ' }, { pts: ws, label: 'vorticity ω', dash: [6, 4] }], vlines: V.mode === 'rankine' || V.mode === 'stream' ? [{ x: coreA(), label: 'core' }] : [] });
        loop.once();
      }
      const scale = () => st.W / (X1 - X0);
      const toPx = (x, y) => [(x - X0) * scale(), st.H / 2 - y * scale()];
      const toM = p => [p.x / scale() + X0, (st.H / 2 - p.y) / scale()];
      kit.drag(st, {
        hover: true,
        hit(p) { const [px, py] = toPx(pad.x, pad.y); if (Math.hypot(p.x - px, p.y - py) < 18) return 'pad'; const [lx, ly] = toPx(loopC[0], loopC[1]); if (Math.hypot(p.x - lx, p.y - ly) < 16) return 'loop'; return null; },
        move(what, p) { const [x, y] = toM(p), ym = st.H / 2 / scale(); const cx = clamp(x, X0, X1), cy = clamp(y, -ym, ym); if (what === 'pad') { pad.x = cx; pad.y = cy; } else loopC = [cx, cy]; loop.once(); }
      });
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), s = scale(), ym = st.H / 2 / s;
        const P = (x, y) => toPx(x, y);
        // particles
        while (parts.length < 320) parts.push({ x: X0 + Math.random() * (X1 - X0), y: (Math.random() * 2 - 1) * ym, age: Math.random() * 6 });
        const n = 3, h = dt / n;
        for (const q of parts) {
          for (let k = 0; k < n; k++) { const k1 = vel(q.x, q.y), k2 = vel(q.x + h / 2 * k1[0], q.y + h / 2 * k1[1]); q.x += h * k2[0]; q.y += h * k2[1]; }
          q.age += dt;
          if (q.x > X1 || q.x < X0 || Math.abs(q.y) > ym || q.age > 8 || (V.mode === 'free' && Math.hypot(q.x, q.y) < 0.04)) {
            if (V.mode === 'stream' && q.x > X1) { q.x = X0; q.y = (Math.random() * 2 - 1) * ym; } else { q.x = X0 + Math.random() * (X1 - X0); q.y = (Math.random() * 2 - 1) * ym; }
            q.age = 0;
          }
          const sp = Math.hypot(...vel(q.x, q.y)), f = clamp(sp / 3, 0, 1);
          const [x, y] = P(q.x, q.y);
          c.fillStyle = 'hsl(' + (215 - 207 * f) + ' 80% ' + (C.dark ? 62 : 48) + '% / ' + (0.35 + 0.5 * f) + ')';
          c.fillRect(x - 1.4, y - 1.4, 2.8, 2.8);
        }
        // the core
        if (V.mode === 'rankine' || V.mode === 'stream') { const [cx, cy] = P(0, 0); c.beginPath(); c.arc(cx, cy, coreA() * s, 0, 2 * Math.PI); c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.lineWidth = 1; c.stroke(); c.setLineDash([]); kit.label(c, 'core', cx, cy - coreA() * s - 8, { align: 'center', size: 10, color: C.muted }); }
        // the loop, with arrows showing the tangential velocity along it
        const [lx, ly] = P(loopC[0], loopC[1]);
        c.beginPath(); c.arc(lx, ly, V.rL * s, 0, 2 * Math.PI); c.setLineDash([7, 5]); c.strokeStyle = C.accent; c.lineWidth = 1.8; c.stroke(); c.setLineDash([]);
        for (let k = 0; k < 16; k++) {
          const f = 2 * Math.PI * k / 16, x = loopC[0] + V.rL * Math.cos(f), y = loopC[1] + V.rL * Math.sin(f);
          const [u, v] = vel(x, y), vt = -u * Math.sin(f) + v * Math.cos(f), L = clamp(vt * 9, -26, 26);
          const [px, py] = P(x, y);
          if (Math.abs(L) > 1.5) kit.arrow(c, px, py, px - Math.sin(f) * L, py - Math.cos(f) * L, vt > 0 ? C.ok : C.bad, 1.8);
        }
        kit.dot(c, lx, ly, 5, C.accent, C.bg2);
        // the paddle wheel: carried by the flow, turning at ω/2
        for (let k = 0; k < n; k++) {
          const k1 = vel(pad.x, pad.y), k2 = vel(pad.x + h / 2 * k1[0], pad.y + h / 2 * k1[1]);
          pad.x += h * k2[0]; pad.y += h * k2[1];
          pad.ang += omega(Math.hypot(pad.x, pad.y)) / 2 * h;
        }
        if (pad.x > X1 + 0.05 || pad.x < X0 - 0.05 || Math.abs(pad.y) > ym + 0.05 || (V.mode === 'free' && Math.hypot(pad.x, pad.y) < 0.05)) drop();
        const [px, py] = P(pad.x, pad.y), pr = 15;
        c.strokeStyle = C.text; c.lineWidth = 2.2;
        for (let k = 0; k < 4; k++) { const a = pad.ang + k * Math.PI / 2; c.beginPath(); c.moveTo(px, py); c.lineTo(px + pr * Math.cos(a), py - pr * Math.sin(a)); c.stroke(); }
        c.fillStyle = C.warn; const ma = pad.ang; c.beginPath(); c.arc(px + pr * Math.cos(ma), py - pr * Math.sin(ma), 3.5, 0, 2 * Math.PI); c.fill();
        kit.dot(c, px, py, 3, C.text);
        // readouts
        const G = circulation(), Ge = enclosed(), wp = omega(Math.hypot(pad.x, pad.y));
        ro.set('circ', G.toFixed(3) + ' m²/s');
        ro.set('vort', Ge.toFixed(3) + ' m²/s');
        ro.set('wp', wp.toFixed(2) + ' 1/s' + (wp === 0 ? ' (irrotational here)' : ''));
        ro.set('spin', (wp / 2).toFixed(2) + ' rad/s' + (wp === 0 ? ' — it keeps its heading' : ''));
        if (V.mode === 'stream') ro.set('lift', (rho * V.U * V.G).toFixed(2) + ' N/m (U = ' + V.U.toFixed(1) + ' m/s)');
        kit.label(c, 'drag the loop centre or the paddle wheel', 10, st.H - 12, { size: 11, color: C.muted });
      }, box.stage);
      showCtl(); refresh();
      loop.start();
    }
  });

  /* ================================================================ the pitot-static system */
  Hyper.sim('flow-pitot', {
    title: 'Pitot-static system and its faults',
    blurb: `The pitot tube faces the airflow and feeds total pressure $p_0$ to the airspeed indicator; the static port on the side of the fuselage feeds the static pressure $p$ to the airspeed indicator's case, the altimeter and the vertical-speed indicator (VSI). The airspeed indicator shows the difference $p_0 - p$ as a speed. Fly the aircraft with the two sliders, then give the system a fault and watch what each instrument does. The graph compares indicated with true calibrated airspeed.

**Try this**
- Block the pitot with ice but leave its drain hole open: the trapped pressure bleeds away and the airspeed falls to zero.
- Block the pitot *and* its drain, then climb: the airspeed indicator now behaves like an altimeter — it reads higher and higher while the real speed has not changed.
- Block the static port, then climb or descend: the altimeter freezes, the VSI reads zero, and the airspeed reads low in a climb and high in a descent.
- Select the alternate static source (cabin air, slightly below outside pressure): altimeter and airspeed read a little high.
- A static-line leak in a pressurised cabin feeds cabin pressure to the instruments: the aircraft reads lower and slower than it is.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 280 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'time (s)' }, y: { label: 'airspeed (kt)', min: 0 }, legend: true }, 150);
      const FAULTS = [['None', 'none'], ['Pitot iced, drain open', 'pitot'], ['Pitot and drain blocked', 'pitotdrain'], ['Static port blocked', 'static'], ['Alternate static (from the cabin)', 'alt'], ['Static-line leak, pressurised cabin', 'staticleak'], ['Pitot-line leak into the cabin', 'pitotleak']];
      const ctl = kit.controls(box.side, [
        { id: 'cas', label: 'Airspeed flown (CAS)', min: 60, max: 340, step: 5, value: 150, unit: 'kt' },
        { id: 'vs', label: 'Vertical speed flown', min: -3000, max: 3000, step: 100, value: 0, unit: 'ft/min' },
        { id: 'fault', type: 'select', label: 'Fault', options: FAULTS, value: 'none' },
        { id: 'tx', type: 'select', label: 'Speed of time', options: [['×1', 1], ['×5', 5], ['×20', 20]], value: 5 },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear the fault', primary: true }, { id: 'reset', label: 'Back to 5000 ft' }] }
      ], id => {
        if (id === 'clear') ctl.set('fault', 'none');
        if (id === 'reset') reset();
        if (id === 'fault' || id === 'clear') marks.push({ t: s.t, label: ctl.values.fault === 'none' ? 'cleared' : 'fault' });
      });
      const ro = kit.readout(box.side, [['cas', 'Calibrated airspeed (true)'], ['ias', 'Airspeed indicator shows'], ['tas', 'True airspeed, Mach'], ['h', 'Altitude (true)'], ['hi', 'Altimeter shows'], ['vs', 'Vertical speed (true)'], ['vsi', 'VSI shows'], ['pp', 'Pitot line / static line']]);
      const V = ctl.values;
      let s = null, hist = [], marks = [], acc = 0;
      function reset() {
        const h = 5000 * FT, air = F.isa(h), cas = V.cas * KT, qc = qcFromCas(cas);
        s = { t: 0, h, vs: 0, cas, pp: air.p + qc, ps: air.p, hl: h };
        hist = []; marks = [];
      }
      reset();
      function step(h) {
        const tau = { pitot: 0.2, drain: 6, stat: 0.3, leak: 0.6, sleak: 3, vsi: 4 };
        s.cas += (V.cas * KT - s.cas) * Math.min(1, h / 4);
        s.vs += (V.vs * FPM - s.vs) * Math.min(1, h / 2);
        s.h += s.vs * h;
        if (s.h < 0) { s.h = 0; s.vs = Math.max(0, s.vs); }
        if (s.h > 12500) { s.h = 12500; s.vs = Math.min(0, s.vs); }
        const air = F.isa(s.h), qc = qcFromCas(s.cas), p0 = air.p + qc;
        const M = machFromQc(qc, air.p), tas = M * air.a, q = 0.5 * air.rho * tas * tas;
        const pCabUnp = air.p - 0.08 * q;                               // an unpressurised cabin sits a little below outside static
        const pCabPress = F.isa(Math.min(2438, 0.2 * s.h)).p;           // a pressurised cabin: a fifth of the altitude, 8000 ft at most
        const fl = V.fault;
        let dpp = 0, dps = 0;
        if (fl !== 'pitot' && fl !== 'pitotdrain') dpp += (p0 - s.pp) / tau.pitot;
        if (fl === 'pitot') dpp += (air.p - s.pp) / tau.drain;
        if (fl === 'pitotleak') dpp += (pCabUnp - s.pp) / tau.leak;
        if (fl !== 'static' && fl !== 'alt') dps += (air.p - s.ps) / tau.stat;
        if (fl === 'alt') dps += (pCabUnp - s.ps) / tau.stat;
        if (fl === 'staticleak') dps += (pCabPress - s.ps) / tau.sleak;
        s.pp += dpp * h; s.ps += dps * h;
        const hi = altFromP(s.ps);
        s.hl += (hi - s.hl) * Math.min(1, h / tau.vsi);
        s.t += h;
        return { air, qc, M, tas, hi, vsi: (hi - s.hl) / tau.vsi };
      }
      // an instrument dial: angles measured clockwise from 12 o'clock
      function dial(c, C, cx, cy, r, o) {
        c.beginPath(); c.arc(cx, cy, r, 0, 2 * Math.PI); c.fillStyle = C.surface; c.fill(); c.lineWidth = 2; c.strokeStyle = C.text; c.stroke();
        for (const tk of o.ticks) {
          const a = o.ang(tk.v), sx = Math.sin(a), sy = -Math.cos(a), r1 = r * (tk.major ? 0.8 : 0.88);
          c.beginPath(); c.moveTo(cx + sx * r1, cy + sy * r1); c.lineTo(cx + sx * r * 0.96, cy + sy * r * 0.96); c.strokeStyle = C.text; c.lineWidth = tk.major ? 1.6 : 0.9; c.stroke();
          if (tk.label != null) kit.label(c, tk.label, cx + sx * r * 0.64, cy + sy * r * 0.64, { align: 'center', size: Math.max(8.5, r * 0.15), color: C.text });
        }
        kit.label(c, o.title, cx, cy - r * 0.3, { align: 'center', size: Math.max(8.5, r * 0.13), color: C.muted, weight: 700 });
        if (o.sub) kit.label(c, o.sub, cx, cy + r * 0.34, { align: 'center', size: Math.max(9, r * 0.15), color: C.text, weight: 700, bg: C.bg2 });
        for (const nd of o.needles) {
          const a = o.ang(nd.v), sx = Math.sin(a), sy = -Math.cos(a);
          c.beginPath(); c.moveTo(cx - sx * r * 0.12, cy - sy * r * 0.12); c.lineTo(cx + sx * r * nd.len, cy + sy * r * nd.len);
          c.strokeStyle = nd.color || C.accent; c.lineWidth = nd.w || 3; c.lineCap = 'round'; c.stroke(); c.lineCap = 'butt';
        }
        kit.dot(c, cx, cy, 4, C.text);
      }
      const ticks = (a, b, step, majorEvery, lab) => { const out = []; for (let v = a; v <= b + 1e-9; v += step) { const k = Math.round((v - a) / step); out.push({ v, major: k % majorEvery === 0, label: k % majorEvery === 0 && lab ? lab(v) : null }); } return out; };
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const T = dt * V.tx, n = Math.max(1, Math.ceil(T / 0.02)), h = T / n;
        let o = null;
        for (let k = 0; k < n; k++) o = step(h);
        if (!o) o = step(0);
        acc += T;
        if (acc >= 0.5 || !hist.length) { acc = 0; hist.push([s.t, casFromQc(Math.max(0, s.pp - s.ps)) / KT, s.cas / KT]); while (hist.length && hist[0][0] < s.t - 240) hist.shift(); }
        const ias = casFromQc(Math.max(0, s.pp - s.ps)) / KT;
        // ---- the aircraft nose, the pitot tube and the static port
        const yT = H * 0.3, yB = H * 0.64, xN = W * 0.05, xE = W * 0.46;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.8;
        c.beginPath(); c.moveTo(xE, yT); c.lineTo(xN + W * 0.1, yT); c.bezierCurveTo(xN + W * 0.03, yT, xN, (yT + yB) / 2 - 6, xN, (yT + yB) / 2 + 4);
        c.bezierCurveTo(xN, yB - 6, xN + W * 0.05, yB, xN + W * 0.12, yB); c.lineTo(xE, yB); c.stroke(); c.fill();
        c.beginPath(); c.moveTo(xN + W * 0.075, yT + 6); c.lineTo(xN + W * 0.13, yT + 6); c.lineTo(xN + W * 0.13, yT + 26); c.lineTo(xN + W * 0.055, yT + 26); c.closePath(); c.fillStyle = C.bg2; c.fill(); c.stroke();   // windscreen
        // airflow arrows ahead of the nose
        const al = clamp(o.tas / 120 * 24, 8, 46);
        for (let i = 0; i < 5; i++) { const y = yT - 18 + i * (yB - yT + 70) / 4; kit.arrow(c, 2, y, 2 + al, y, C.faint, 1.3); }
        // pitot probe under the nose
        const xm = W * 0.2, ytube = yB + H * 0.09, xtip = W * 0.1;
        const pitotCol = C.series[1], statCol = C.series[0];
        c.strokeStyle = C.text; c.lineWidth = 4; c.beginPath(); c.moveTo(xm, yB); c.lineTo(xm, ytube); c.lineTo(xtip, ytube); c.stroke();
        kit.label(c, 'pitot', xtip, ytube + 14, { size: 11, color: pitotCol, weight: 700 });
        if (V.fault === 'pitot' || V.fault === 'pitotdrain') { c.fillStyle = C.dark ? 'hsl(200 60% 85%)' : 'hsl(200 50% 72%)'; c.beginPath(); c.arc(xtip - 2, ytube, 7, 0, 2 * Math.PI); c.fill(); kit.label(c, 'ice', xtip - 12, ytube - 14, { size: 10.5, color: C.text, align: 'center' }); }
        // drain hole
        const xd = (xm + xtip) / 2 + 10;
        c.fillStyle = V.fault === 'pitotdrain' ? C.bad : C.bg2; c.beginPath(); c.arc(xd, ytube + 2, 2.4, 0, 2 * Math.PI); c.fill();
        kit.label(c, V.fault === 'pitotdrain' ? 'drain blocked' : 'drain', xd, ytube + 14, { size: 9.5, color: V.fault === 'pitotdrain' ? C.bad : C.muted, align: 'center' });
        // static port
        const xs = W * 0.34, ys = (yT + yB) / 2 + 8;
        c.beginPath(); c.arc(xs, ys, 5, 0, 2 * Math.PI); c.fillStyle = C.bg2; c.fill(); c.strokeStyle = statCol; c.lineWidth = 2; c.stroke();
        kit.label(c, 'static port', xs, ys + 16, { size: 11, color: statCol, weight: 700, align: 'center' });
        if (V.fault === 'static') { c.strokeStyle = C.bad; c.lineWidth = 3; c.beginPath(); c.moveTo(xs - 8, ys - 8); c.lineTo(xs + 8, ys + 8); c.moveTo(xs + 8, ys - 8); c.lineTo(xs - 8, ys + 8); c.stroke(); kit.label(c, 'blocked', xs, ys - 16, { size: 10.5, color: C.bad, align: 'center' }); }
        // ---- the instruments
        const r = Math.min(H * 0.17, W * 0.1);
        const cA = [W * 0.62, H * 0.22], cH = [W * 0.86, H * 0.22], cV = [W * 0.74, H * 0.74];
        // pipes: pitot line to the ASI; static line to all three
        const bus = H * 0.47, pbus = H * 0.53;
        c.lineWidth = 2.6; c.setLineDash(V.fault === 'pitot' || V.fault === 'pitotdrain' ? [5, 4] : []);
        c.strokeStyle = pitotCol; c.beginPath(); c.moveTo(xm, yB); c.lineTo(xm, pbus); c.lineTo(cA[0] - 8, pbus); c.lineTo(cA[0] - 8, cA[1] + r); c.stroke();
        c.setLineDash(V.fault === 'static' ? [5, 4] : []);
        c.strokeStyle = statCol; c.beginPath(); c.moveTo(xs, ys); c.lineTo(xs + 20, ys); c.lineTo(xs + 20, bus); c.lineTo(cH[0], bus); c.lineTo(cH[0], cH[1] + r); c.stroke();
        c.beginPath(); c.moveTo(cA[0] + 8, bus); c.lineTo(cA[0] + 8, cA[1] + r); c.stroke();
        c.beginPath(); c.moveTo(cV[0], bus); c.lineTo(cV[0], cV[1] - r); c.stroke();
        c.setLineDash([]);
        for (const x of [cA[0] + 8, cV[0]]) kit.dot(c, x, bus, 3.2, statCol);
        if (V.fault === 'alt') { kit.label(c, 'alternate static ← cabin', xs + 26, bus + 13, { size: 10.5, color: C.warn }); }
        if (V.fault === 'staticleak') { kit.label(c, 'leak ⇄ pressurised cabin', (xs + cA[0]) / 2, bus - 11, { size: 10.5, color: C.bad, align: 'center' }); }
        if (V.fault === 'pitotleak') { kit.label(c, 'leak ⇄ cabin', (xm + cA[0]) / 2, pbus + 12, { size: 10.5, color: C.bad, align: 'center' }); }
        dial(c, C, cA[0], cA[1], r, { title: 'AIRSPEED kt', ticks: ticks(0, 400, 20, 2, v => String(v)), ang: v => clamp(v, 0, 400) / 400 * 330 * D2R, needles: [{ v: ias, len: 0.82 }], sub: ias.toFixed(0) });
        const hift = o.hi / FT;
        dial(c, C, cH[0], cH[1], r, { title: 'ALT ft', ticks: ticks(0, 900, 100, 1, v => String(v / 100)), ang: v => v / 1000 * 2 * Math.PI, needles: [{ v: ((hift % 10000) + 10000) % 10000 / 10, len: 0.5, w: 4.5, color: C.text }, { v: ((hift % 1000) + 1000) % 1000, len: 0.84 }], sub: hift.toFixed(0) });
        const vsiFpm = o.vsi / FPM;
        dial(c, C, cV[0], cV[1], r, { title: 'VERT SPEED', ticks: ticks(-3000, 3000, 500, 2, v => String(Math.abs(v / 1000))), ang: v => (-90 + clamp(v, -3000, 3000) / 3000 * 165) * D2R, needles: [{ v: vsiFpm, len: 0.82 }], sub: (vsiFpm >= 0 ? '+' : '') + (Math.round(vsiFpm / 10) * 10).toFixed(0) });
        kit.label(c, 'UP', cV[0] - r * 0.55, cV[1] - r * 0.62, { size: 9, color: C.muted, align: 'center' });
        kit.label(c, 'DN', cV[0] - r * 0.55, cV[1] + r * 0.62, { size: 9, color: C.muted, align: 'center' });
        const fname = FAULTS.find(f => f[1] === V.fault)[0];
        kit.label(c, V.fault === 'none' ? 'no fault' : 'fault: ' + fname, 10, 16, { size: 12, weight: 700, color: V.fault === 'none' ? C.ok : C.bad });
        // ---- readouts and the graph
        ro.set('cas', (s.cas / KT).toFixed(0) + ' kt');
        ro.set('ias', ias.toFixed(0) + ' kt  (error ' + (ias - s.cas / KT >= 0 ? '+' : '') + (ias - s.cas / KT).toFixed(0) + ')');
        ro.set('tas', (o.tas / KT).toFixed(0) + ' kt, M ' + o.M.toFixed(2));
        ro.set('h', (s.h / FT).toFixed(0) + ' ft');
        ro.set('hi', hift.toFixed(0) + ' ft  (error ' + (hift - s.h / FT >= 0 ? '+' : '') + (hift - s.h / FT).toFixed(0) + ')');
        ro.set('vs', (s.vs / FPM).toFixed(0) + ' ft/min');
        ro.set('vsi', (Math.abs(vsiFpm) < 0.5 ? '0' : vsiFpm.toFixed(0)) + ' ft/min');
        ro.set('pp', (s.pp / 100).toFixed(1) + ' / ' + (s.ps / 100).toFixed(1) + ' hPa');
        const t0 = hist.length ? hist[0][0] : 0;
        plot.set({ series: [{ pts: hist.map(p => [p[0], p[2]]), label: 'calibrated airspeed (true)' }, { pts: hist.map(p => [p[0], p[1]]), label: 'indicated', dash: [6, 4] }],
          x: { label: 'time (s)', min: t0, max: Math.max(t0 + 30, s.t) }, vlines: marks.filter(m => m.t >= t0).map(m => ({ x: m.t, label: m.label })) });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the four airspeeds */
  Hyper.sim('flow-airspeeds', {
    title: 'IAS, CAS, EAS and TAS',
    blurb: `One aircraft, one moment, four airspeeds. The airspeed indicator reads **IAS**; correct it for instrument and position error to get **CAS**; correct CAS for compressibility at this height to get **EAS** (the speed at sea level that would give the same dynamic pressure); scale EAS by $\\sqrt{\\rho_{SL}/\\rho}$ to get **TAS**, the real speed through the air. The graph holds the calibrated airspeed fixed and shows all four against height, from the standard atmosphere.

**Try this**
- At sea level on a standard day CAS, EAS and TAS are equal. Climb and watch TAS pull away — about 2 % per 1000 ft low down.
- Fly 270 kt at 35 000 ft: EAS is about 15 kt below CAS (compressibility) and TAS is over 450 kt.
- Make the day 20 °C hotter than standard: TAS rises for the same CAS, because the air is thinner; the Mach number barely moves, because the speed of sound rises too.
- Hold CAS and climb high: the Mach number climbs towards 1 — why airliners switch from flying a CAS to flying a Mach number as they climb.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'pressure altitude (ft)', min: 0, max: 45000 }, y: { label: 'airspeed (kt)', min: 0 }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'cas', label: 'Calibrated airspeed CAS', min: 60, max: 350, step: 1, value: 250, unit: 'kt' },
        { id: 'h', label: 'Pressure altitude', min: 0, max: 45000, step: 500, value: 20000, unit: 'ft' },
        { id: 'dT', label: 'Temperature vs standard', min: -30, max: 30, step: 1, value: 0, unit: '°C' },
        { id: 'err', label: 'Instrument + position error (IAS − CAS)', min: -8, max: 8, step: 0.5, value: 2, unit: 'kt' }
      ], () => update());
      const ro = kit.readout(box.side, [['air', 'Air: p, T'], ['rho', 'Density ρ (σ = ρ/ρ_SL)'], ['qc', 'Impact pressure q_c = p₀ − p'], ['q', 'Dynamic pressure ½ρV²'], ['M', 'Mach number'], ['tas', 'TAS'], ['rule', 'Rule of thumb IAS·(1 + 2 %/1000 ft)']]);
      const V = ctl.values;
      function speeds(casKt, hFt, dT) {
        const A = F.isa(hFt * FT), T = A.T + dT, p = A.p, rho = p / (287.058 * T), a = Math.sqrt(1.4 * 287.058 * T);
        const qc = qcFromCas(casKt * KT), M = machFromQc(qc, p), tas = M * a, eas = tas * Math.sqrt(rho / RHO_SL);
        return { p, T, rho, a, qc, M, tas: tas / KT, eas: eas / KT, q: 0.5 * rho * tas * tas };
      }
      let S = null;
      function update() {
        S = speeds(V.cas, V.h, V.dT);
        const ias = [], cas = [], eas = [], tas = [];
        for (let hf = 0; hf <= 45000; hf += 1000) { const o = speeds(V.cas, hf, V.dT); ias.push([hf, V.cas + V.err]); cas.push([hf, V.cas]); eas.push([hf, o.eas]); tas.push([hf, o.tas]); }
        plot.set({ series: [{ pts: tas, label: 'TAS' }, { pts: eas, label: 'EAS' }, { pts: cas, label: 'CAS' }, { pts: ias, label: 'IAS', dash: [5, 4] }], vlines: [{ x: V.h, label: 'you' }], marks: [{ x: V.h, y: S.tas }, { x: V.h, y: S.eas }] });
        ro.set('air', (S.p / 100).toFixed(1) + ' hPa, ' + (S.T - 273.15).toFixed(1) + ' °C');
        ro.set('rho', S.rho.toFixed(4) + ' kg/m³ (σ = ' + (S.rho / RHO_SL).toFixed(3) + ')');
        ro.set('qc', (S.qc / 1000).toFixed(2) + ' kPa');
        ro.set('q', (S.q / 1000).toFixed(2) + ' kPa' + (S.M > 0.3 ? ' — less than q_c: compressibility' : ''));
        ro.set('M', S.M.toFixed(3) + (S.M > 1 ? ' (supersonic: the pitot reads behind a shock)' : ''));
        ro.set('tas', S.tas.toFixed(0) + ' kt = ' + (S.tas * KT * 3.6).toFixed(0) + ' km/h = ' + (S.tas * KT).toFixed(1) + ' m/s');
        const rule = (V.cas + V.err) * (1 + 0.02 * V.h / 1000);
        ro.set('rule', rule.toFixed(0) + ' kt (' + (100 * (rule / S.tas - 1) >= 0 ? '+' : '') + (100 * (rule / S.tas - 1)).toFixed(0) + ' %)');
        loop.once();
      }
      const loop = kit.loop(() => {
        if (!S) return;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const ias = V.cas + V.err, rows = [
          ['IAS', 'indicated — what the dial shows', ias, C.series[3]],
          ['CAS', 'calibrated — errors removed', V.cas, C.series[2]],
          ['EAS', 'equivalent — compressibility removed', S.eas, C.series[1]],
          ['TAS', 'true — the real speed through the air', S.tas, C.series[0]]
        ];
        const x0 = W * 0.2, xw = W * 0.62, vmax = niceUp(Math.max(ias, S.tas) * 1.08);
        const steps = ['+ instrument & position correction', '− compressibility (q_c → q)', '× √(ρ_SL/ρ) = × ' + Math.sqrt(RHO_SL / S.rho).toFixed(3)];
        rows.forEach((rw, i) => {
          const y = H * (0.14 + i * 0.235), bh = Math.min(24, H * 0.09);
          c.fillStyle = C.grid; c.fillRect(x0, y - bh / 2, xw, bh);
          c.fillStyle = rw[3]; c.fillRect(x0, y - bh / 2, xw * clamp(rw[2] / vmax, 0, 1), bh);
          kit.label(c, rw[0], 10, y - 7, { size: 15, weight: 800, color: C.text });
          kit.label(c, rw[1], 10, y + 10, { size: 10, color: C.muted });
          kit.label(c, rw[2].toFixed(0) + ' kt', x0 + xw * clamp(rw[2] / vmax, 0, 1) + 6, y, { size: 13, weight: 700, color: C.text });
          if (i < 3) kit.label(c, '↓ ' + steps[i], x0 + 6, y + H * 0.117, { size: 10.5, color: C.muted });
        });
        for (let v = 0; v <= vmax + 1e-9; v += vmax / 5) { const x = x0 + xw * v / vmax; c.fillStyle = C.faint; c.fillRect(x, H - 16, 1, 5); kit.label(c, v.toFixed(0), x, H - 6, { size: 9.5, color: C.muted, align: 'center' }); }
        kit.label(c, 'M ' + S.M.toFixed(2), W - 10, 16, { size: 14, weight: 800, color: S.M > 1 ? C.bad : S.M > 0.7 ? C.warn : C.text, align: 'right' });
        kit.label(c, V.h.toFixed(0) + ' ft, ISA' + (V.dT >= 0 ? '+' : '') + V.dT, W - 10, 34, { size: 11, color: C.muted, align: 'right' });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ flutter of a wing section */
  // the linear model of a two-degree-of-freedom section (plunge h down, pitch α nose-up about the elastic axis)
  // with Theodorsen's unsteady aerodynamics in the time domain (Wagner function, R. T. Jones's two-lag fit)
  function sectionModel(P, U) {
    const { rho, b, a, xa, m, fh, fa, zs, rcg2 } = P;
    const Sa = m * xa * b, Ia = m * b * b * (rcg2 + xa * xa);
    const wh = 2 * Math.PI * fh, wa = 2 * Math.PI * fa;
    const Kh = m * wh * wh, Ka = Ia * wa * wa, ch = 2 * zs * m * wh, ca = 2 * zs * Ia * wa;
    const A1 = 0.165, A2 = 0.335, B1 = 0.0455 * U / b, B2 = 0.3 * U / b, pr = Math.PI * rho;
    const M11 = m + pr * b * b, M12 = Sa - pr * b * b * b * a, M22 = Ia + pr * b ** 4 * (1 / 8 + a * a);
    const det = M11 * M22 - M12 * M12;
    const Mi = [[M22 / det, -M12 / det], [-M12 / det, M11 / det]];
    const cw = [0, U, 1, b * (0.5 - a), 0, 0];                            // 3/4-chord downwash w
    const ce = cw.map(v => v * (1 - A1 - A2)); ce[4] += A1 * B1; ce[5] += A2 * B2;   // effective (lagged) downwash
    const Lc = 2 * pr * U * b, Mc = 2 * pr * U * b * b * (0.5 + a), kg = 1 - A1 - A2;
    const f1 = [-Kh, 0, -ch, -pr * b * b * U, 0, 0].map((v, i) => v - Lc * ce[i]);
    const f2 = [0, -Ka, 0, -ca - pr * b ** 3 * U * (0.5 - a), 0, 0].map((v, i) => v + Mc * ce[i]);
    const A = [[0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0],
      f1.map((v, i) => Mi[0][0] * v + Mi[0][1] * f2[i]), f1.map((v, i) => Mi[1][0] * v + Mi[1][1] * f2[i]),
      cw.map((v, i) => v - (i === 4 ? B1 : 0)), cw.map((v, i) => v - (i === 5 ? B2 : 0))];
    const g1 = -Lc * kg, g2 = Mc * kg;                                   // a vertical gust adds to w
    const Bg = [0, 0, Mi[0][0] * g1 + Mi[0][1] * g2, Mi[1][0] * g1 + Mi[1][1] * g2, 1, 1];
    return { A, Bg, Ka, Ia };
  }
  // det(sI − A) by Faddeev–LeVerrier, roots by the Aberth–Durand–Kerner iteration
  function charPoly(A) {
    const n = A.length;
    let Mk = A.map((r, i) => r.map((_, j) => (i === j ? 1 : 0)));
    const c = [1];
    for (let k = 1; k <= n; k++) {
      const AM = A.map(r => Mk[0].map((_, j) => r.reduce((sum, v, q) => sum + v * Mk[q][j], 0)));
      let tr = 0; for (let i = 0; i < n; i++) tr += AM[i][i];
      const ck = -tr / k; c.push(ck);
      Mk = AM.map((r, i) => r.map((v, j) => v + (i === j ? ck : 0)));
    }
    return c;
  }
  function polyRoots(c) {
    const n = c.length - 1;
    const ev = (zr, zi) => { let pr = 1, pi = 0; for (let k = 1; k <= n; k++) { const r = pr * zr - pi * zi + c[k], i = pr * zi + pi * zr; pr = r; pi = i; } return [pr, pi]; };
    const R = Math.pow(Math.abs(c[n]) || 1, 1 / n) + 1;
    const z = Array.from({ length: n }, (_, k) => [R * Math.cos(2 * Math.PI * k / n + 0.4), R * Math.sin(2 * Math.PI * k / n + 0.4)]);
    for (let it = 0; it < 400; it++) {
      let delta = 0;
      for (let i = 0; i < n; i++) {
        const [pr, pi] = ev(z[i][0], z[i][1]);
        let dr = 1, di = 0;
        for (let j = 0; j < n; j++) if (j !== i) { const xr = z[i][0] - z[j][0], xi = z[i][1] - z[j][1]; const r = dr * xr - di * xi, im = dr * xi + di * xr; dr = r; di = im; }
        const d2 = dr * dr + di * di || 1e-300, qr = (pr * dr + pi * di) / d2, qi = (pi * dr - pr * di) / d2;
        z[i][0] -= qr; z[i][1] -= qi;
        delta = Math.max(delta, Math.hypot(qr, qi) / (Math.hypot(z[i][0], z[i][1]) + 1e-9));
      }
      if (delta < 1e-11) break;
    }
    return z.filter(q => Number.isFinite(q[0]) && Number.isFinite(q[1]));
  }

  Hyper.sim('flow-flutter', {
    title: 'Flutter of a wing section',
    blurb: `A slice of wing, 1.5 m in chord and 45 kg per metre of span, held by two springs: one lets it **bend** (move up and down), the other lets it **twist** about its elastic axis. The air forces are Theodorsen's unsteady aerodynamics (through the Wagner function), so the lift lags the motion as it does on a real wing. The graphs show the damping and frequency of the two vibration modes against airspeed; where a damping curve crosses zero, the air starts feeding energy into the vibration — **flutter**. Motion is drawn three times larger than life.

**Try this**
- Start at 50 m/s with light turbulence: both modes are well damped. Slide the speed up and watch the two frequencies draw together as the damping of one of them collapses; past the flutter speed any disturbance grows.
- Move the centre of mass forward of the elastic axis (below 40 %): the flutter speed shoots up or disappears. This is why ailerons and elevators carry balance weights ahead of their hinges.
- Move the centre of mass aft to 50 %: flutter comes earlier.
- Bring the bending frequency close to the torsion frequency: flutter comes sooner — the modes have less far to travel to meet.
- Climb to 8000 m: the true airspeed at flutter rises, because the air is thinner — but in equivalent airspeed it comes slightly earlier, because the wing is now heavy compared with the air it moves (the mass ratio μ rises). Flutter is not simply a matter of dynamic pressure.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const gd = graphDiv(box);
      const pz = kit.plot(gd, { x: { label: 'true airspeed (m/s)', min: 0, max: 160 }, y: { label: 'damping ratio ζ (%)', min: -20, max: 40 }, legend: true }, 150);
      const pf = kit.plot(gd, { x: { label: 'true airspeed (m/s)', min: 0, max: 160 }, y: { label: 'frequency (Hz)', min: 0 }, legend: true }, 130);
      const ctl = kit.controls(box.side, [
        { id: 'U', label: 'Airspeed (true)', min: 0, max: 160, step: 1, value: 50, unit: 'm/s' },
        { id: 'xcg', label: 'Centre of mass', min: 25, max: 60, step: 1, value: 45, unit: '% chord' },
        { id: 'xea', label: 'Elastic axis', min: 25, max: 50, step: 1, value: 40, unit: '% chord' },
        { id: 'fh', label: 'Bending frequency (still air)', min: 1, max: 7.5, step: 0.1, value: 3.2, unit: 'Hz' },
        { id: 'fa', label: 'Torsion frequency (still air)', min: 5, max: 12, step: 0.1, value: 8, unit: 'Hz' },
        { id: 'alt', label: 'Altitude', min: 0, max: 10000, step: 250, value: 0, unit: 'm' },
        { id: 'zs', label: 'Structural damping', min: 0, max: 3, step: 0.1, value: 0.5, unit: '%' },
        { id: 'turb', type: 'check', label: 'Light turbulence', value: true },
        { id: 'slow', type: 'select', label: 'Slow motion', options: [['Real time', 1], ['× ¼', 0.25], ['× ⅒', 0.1]], value: 0.25 },
        { type: 'buttons', items: [{ id: 'kick', label: 'Kick', primary: true }, { id: 'calm', label: 'Stop the motion' }] }
      ], id => {
        if (id === 'kick') { x[1] += 1.5 * D2R; x[2] += 0.05; }
        else if (id === 'calm') x = [0, 0, 0, 0, 0, 0];
        else if (id !== 'slow' && id !== 'turb') rebuild(id === 'U');
      });
      const ro = kit.readout(box.side, [['U', 'Airspeed'], ['uf', 'Flutter speed'], ['ud', 'Divergence speed'], ['m1', 'Mode 1 (bending-like)'], ['m2', 'Mode 2 (torsion-like)'], ['mu', 'Mass ratio μ = m/(πρb²)'], ['st', '']]);
      const V = ctl.values, chord = 1.5, b = chord / 2, mass = 45, EXAG = 3;
      const foil = F.naca4(0, 0.4, 0.12, 30);
      let x = [0, 1 * D2R, 0, 0, 0, 0], P = null, MD = null, sw = null, wg = 0, trail = [], hist = [], tSim = 0, limited = false;
      function params() {
        const air = F.isa(V.alt);
        return { rho: air.rho, b, a: (V.xea / 100 * chord - b) / b, xa: (V.xcg - V.xea) / 100 * chord / b, m: mass, fh: V.fh, fa: V.fa, zs: V.zs / 100, rcg2: 0.23 };
      }
      function modesAt(Pp, U) {
        const z = polyRoots(charPoly(sectionModel(Pp, U).A)).filter(q => q[1] > 1e-6);
        return z;
      }
      function sweep(Pp) {
        const Us = [], m1 = [], m2 = [];
        let prev = null, uf = null;
        for (let U = 1; U <= 200; U += 1) {
          const z = modesAt(Pp, U);
          let pair = [null, null];
          if (!prev) { const srt = z.slice().sort((p, q) => p[1] - q[1]); pair = [srt[0] || null, srt[1] || null]; }
          else {
            const used = new Set();
            for (let i = 0; i < 2; i++) {
              if (!prev[i]) continue;
              let best = -1, bd = Infinity;
              z.forEach((q, j) => { if (used.has(j)) return; const d = Math.hypot(q[0] - prev[i][0], q[1] - prev[i][1]); if (d < bd) { bd = d; best = j; } });
              if (best >= 0 && bd < 0.5 * Math.hypot(prev[i][0], prev[i][1]) + 5) { pair[i] = z[best]; used.add(best); }
            }
          }
          const out = pair.map(q => (q ? { f: q[1] / (2 * Math.PI), z: -q[0] / Math.hypot(q[0], q[1]) } : null));
          if (uf == null && Us.length) {
            for (let i = 0; i < 2; i++) {
              const o0 = (i ? m2 : m1)[Us.length - 1], o1 = out[i];
              if (o0 && o1 && o0.z >= 0 && o1.z < 0) { const u = U - 1 + o0.z / (o0.z - o1.z); uf = uf == null ? u : Math.min(uf, u); }
            }
          }
          Us.push(U); m1.push(out[0]); m2.push(out[1]);
          prev = pair.map((q, i) => q || (prev && prev[i]) || null);
        }
        const qD = Pp.a > -0.5 ? (Pp.m * Pp.b * Pp.b * (Pp.rcg2 + Pp.xa * Pp.xa) * (2 * Math.PI * Pp.fa) ** 2) / (4 * Math.PI * Pp.b * Pp.b * (0.5 + Pp.a)) : Infinity;
        const ud = Number.isFinite(qD) ? Math.sqrt(2 * qD / Pp.rho) : Infinity;
        return { Us, m1, m2, uf, ud };
      }
      function rebuild(speedOnly) {
        P = params();
        MD = sectionModel(P, V.U);
        if (!speedOnly || !sw) sw = sweep(P);
        const clip = v => clamp(v, -20, 40);
        const ser = (arr, key, f) => arr.map((o, i) => (o ? [sw.Us[i], f(o[key])] : null)).filter(Boolean);
        const vl = [{ x: V.U, label: 'now' }];
        if (sw.uf != null && sw.uf <= 160) vl.push({ x: sw.uf, label: 'flutter', color: C0().bad });
        if (sw.ud <= 160) vl.push({ x: sw.ud, label: 'divergence', color: C0().warn });
        pz.set({ series: [{ pts: ser(sw.m1, 'z', v => clip(100 * v)), label: 'mode 1 (bending-like)' }, { pts: ser(sw.m2, 'z', v => clip(100 * v)), label: 'mode 2 (torsion-like)' }], vlines: vl, hlines: [{ y: 0 }] });
        pf.set({ series: [{ pts: ser(sw.m1, 'f', v => v), label: 'mode 1' }, { pts: ser(sw.m2, 'f', v => v), label: 'mode 2' }], vlines: vl, y: { label: 'frequency (Hz)', min: 0, max: Math.ceil(V.fa * 1.25) } });
        const iu = clamp(Math.round(V.U) - 1, 0, sw.Us.length - 1);
        const fmtM = o => (o ? o.f.toFixed(2) + ' Hz, ζ = ' + (100 * o.z).toFixed(1) + ' %' : 'not oscillating');
        ro.set('U', V.U.toFixed(0) + ' m/s = ' + (V.U / KT).toFixed(0) + ' kt');
        ro.set('uf', sw.uf != null ? sw.uf.toFixed(1) + ' m/s = ' + (sw.uf / KT).toFixed(0) + ' kt' : 'none below 200 m/s');
        ro.set('ud', Number.isFinite(sw.ud) ? sw.ud.toFixed(1) + ' m/s' + (sw.ud > 200 ? ' (beyond the range)' : '') : 'none (axis ahead of ¼ chord)');
        ro.set('m1', V.U >= 1 ? fmtM(sw.m1[iu]) : V.fh.toFixed(2) + ' Hz (still air)');
        ro.set('m2', V.U >= 1 ? fmtM(sw.m2[iu]) : V.fa.toFixed(2) + ' Hz (still air)');
        ro.set('mu', (mass / (Math.PI * P.rho * b * b)).toFixed(1));
        loop.once();
      }
      const C0 = () => kit.colors();
      function deriv(s, w) {
        const A = MD.A, d = new Array(6);
        for (let i = 0; i < 6; i++) { let v = MD.Bg[i] * w; for (let j = 0; j < 6; j++) v += A[i][j] * s[j]; d[i] = v; }
        return d;
      }
      const loop = kit.loop(dt => {
        if (!MD) return;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        // ---- integrate: RK4 in fixed sub-steps, a random gust as an Ornstein–Uhlenbeck process
        const T = dt * V.slow, n = Math.max(1, Math.ceil(T / 0.002)), h = T / n;
        limited = false;
        for (let k = 0; k < n && h > 0; k++) {
          if (V.turb && V.U > 1) { const tau = 0.3, sig = 0.5; wg += (-wg / tau) * h + sig * Math.sqrt(2 * h / tau) * (Math.random() * 2 - 1) * 1.732; } else wg = 0;
          const k1 = deriv(x, wg), k2 = deriv(x.map((v, i) => v + h / 2 * k1[i]), wg), k3 = deriv(x.map((v, i) => v + h / 2 * k2[i]), wg), k4 = deriv(x.map((v, i) => v + h * k3[i]), wg);
          x = x.map((v, i) => v + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
          const amp = Math.max(Math.abs(x[1]) / (8 * D2R), Math.abs(x[0]) / 0.15);
          if (amp > 1 || !x.every(Number.isFinite)) { if (!x.every(Number.isFinite)) x = [0, 1 * D2R, 0, 0, 0, 0]; else x = x.map(v => v / amp); limited = true; }
          tSim += h;
        }
        hist.push([tSim, x[0], x[1]]); while (hist.length > 2 && hist[0][0] < tSim - 3) hist.shift();
        // ---- the section
        const cx = W * 0.4, cy = H * 0.36, sc = W * 0.36 / chord;
        const ea = V.xea / 100 * chord, al = x[1] * EXAG, hh = x[0] * EXAG, ca = Math.cos(al), sa = Math.sin(al);
        const toS = (px, py) => { const dx = px - ea, dy = py; return [cx + (dx * ca + dy * sa) * sc, cy + hh * sc - (-dx * sa + dy * ca) * sc]; };
        // wind arrows
        const al2 = clamp(V.U / 160 * 60, 6, 60);
        for (let i = 0; i < 4; i++) { const y = H * 0.12 + i * H * 0.15; kit.arrow(c, 8, y, 8 + al2, y, C.faint, 1.3); }
        // trailing-edge trail
        trail.push([x[0], x[1]]); if (trail.length > 90) trail.shift();
        c.strokeStyle = C.series[1]; c.lineWidth = 1.4; c.globalAlpha = 0.6; c.beginPath();
        trail.forEach((q, i) => { const a2 = q[1] * EXAG, h2 = q[0] * EXAG, dx = chord - ea; const X = cx + (dx * Math.cos(a2)) * sc, Y = cy + h2 * sc + dx * Math.sin(a2) * sc; i ? c.lineTo(X, Y) : c.moveTo(X, Y); });
        c.stroke(); c.globalAlpha = 1;
        // springs: the bending spring above the elastic axis, the torsion spring as a coil
        const [ex, ey] = toS(ea, 0), topY = H * 0.05;
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(ex, topY);
        const nz = 8, seg = (ey - 12 - topY) / nz;
        for (let i = 0; i < nz; i++) c.lineTo(ex + (i % 2 ? 7 : -7), topY + (i + 0.5) * seg);
        c.lineTo(ex, ey - 12); c.lineTo(ex, ey); c.stroke();
        c.fillStyle = C.faint; c.fillRect(ex - 24, topY - 5, 48, 5);
        // the airfoil
        c.beginPath(); foil.forEach((q, i) => { const [X, Y] = toS(q[0] * chord, q[1] * chord); i ? c.lineTo(X, Y) : c.moveTo(X, Y); }); c.closePath();
        c.fillStyle = limited ? (C.dark ? 'hsl(0 45% 28%)' : 'hsl(0 70% 90%)') : C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
        c.beginPath(); for (let k = 0; k <= 30; k++) { const a2 = -0.3 + 2.2 * Math.PI * k / 30, rr = 5 + k * 0.28; c.lineTo(ex + rr * Math.cos(a2 + al), ey + rr * Math.sin(a2 + al)); } c.strokeStyle = C.accent; c.lineWidth = 1.3; c.stroke();
        kit.dot(c, ex, ey, 4, C.accent, C.bg2);
        const [gx, gy] = toS(V.xcg / 100 * chord, 0);
        c.beginPath(); c.arc(gx, gy, 6, 0, 2 * Math.PI); c.fillStyle = C.bg2; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.3; c.stroke();
        c.beginPath(); c.moveTo(gx, gy); c.arc(gx, gy, 6, 0, Math.PI / 2); c.closePath(); c.fillStyle = C.text; c.fill();
        c.beginPath(); c.moveTo(gx, gy); c.arc(gx, gy, 6, Math.PI, 1.5 * Math.PI); c.closePath(); c.fill();
        kit.label(c, 'elastic axis', ex - 8, ey + 22, { size: 10.5, color: C.accent, align: 'right' });
        kit.label(c, 'centre of mass', gx + 8, gy + 22, { size: 10.5, color: C.text });
        // ---- strip chart: twist and bending, the last 3 s of simulated time
        const sy0 = H * 0.72, sh = H * 0.24, sx0 = 60, sw2 = W - 80;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(sx0, sy0, sw2, sh);
        c.beginPath(); c.moveTo(sx0, sy0 + sh / 2); c.lineTo(sx0 + sw2, sy0 + sh / 2); c.stroke();
        const t0 = tSim - 3, draw = (idx, sc2, col) => { c.strokeStyle = col; c.lineWidth = 1.6; c.beginPath(); hist.forEach((q, i) => { const X = sx0 + (q[0] - t0) / 3 * sw2, Y = sy0 + sh / 2 - clamp(q[idx] * sc2, -1, 1) * sh / 2; i ? c.lineTo(X, Y) : c.moveTo(X, Y); }); c.stroke(); };
        draw(2, 1 / (8 * D2R), C.series[1]); draw(1, 1 / 0.15, C.series[0]);
        kit.label(c, 'twist α (±8°)', 6, sy0 + 10, { size: 10, color: C.series[1] });
        kit.label(c, 'bending h (±150 mm)', 6, sy0 + sh - 8, { size: 10, color: C.series[0] });
        kit.label(c, 'last 3 s', sx0 + sw2, sy0 - 8, { size: 10, color: C.muted, align: 'right' });
        // status
        const iu = clamp(Math.round(V.U) - 1, 0, sw.Us.length - 1), zNow = Math.min(...[sw.m1[iu], sw.m2[iu]].filter(Boolean).map(o => o.z), 1);
        const div = V.U >= sw.ud;
        const msg = V.U < 1 ? 'still air' : div ? 'DIVERGENCE: the twist runs away' : zNow < 0 ? 'FLUTTER: the air feeds the vibration' : zNow < 0.02 ? 'close to flutter: barely damped' : 'stable: vibrations die away';
        kit.label(c, msg, W - 10, 16, { size: 13, weight: 800, align: 'right', color: div || zNow < 0 ? C.bad : zNow < 0.02 ? C.warn : C.ok });
        kit.label(c, V.U.toFixed(0) + ' m/s (' + (V.U / KT).toFixed(0) + ' kt)', W - 10, 34, { size: 11.5, align: 'right', color: C.muted });
        if (limited) kit.label(c, 'motion capped for display — a real wing would break up', W - 10, 52, { size: 11, align: 'right', color: C.bad });
        ro.set('st', 'α = ' + (x[1] / D2R).toFixed(2) + '°, h = ' + (x[0] * 1000).toFixed(0) + ' mm');
      }, box.stage);
      rebuild(false);
      loop.start();
    }
  });

  /* ================================================================ vortex resonance and galloping */
  Hyper.sim('flow-gallop', {
    title: 'Vortex resonance and galloping',
    blurb: `A long section 100 mm across, mounted on springs in a wind tunnel so that it can move across the wind. Two different things can shake it:
- **Vortex-induced vibration** — the wake sheds vortices at $f = \\mathrm{St}\\,U/D$; when that is near the natural frequency they lock on and it resonates. The shaking is limited and happens only in a band of speeds.
- **Galloping** — for some shapes (a square, ice on a cable) moving across the wind tilts the relative wind so that the force pushes the same way as the motion: negative damping. Above a critical speed any motion grows, and it keeps growing with speed.

The wake oscillator is Facchinetti's model; the galloping force is a quasi-steady fit for a square prism (illustrative values). **Sweep** runs the tunnel slowly from 0.5 to 20 m/s and plots the amplitude.

**Try this**
- Sweep with the square prism: a bump near the vortex-resonance speed, calm, then galloping from the critical speed on — two mechanisms, two shapes of curve. (Just above the onset the growth is slow; each point of the sweep waits only 16 s.)
- Set the wind to 18 m/s, choose real time and press **Kick**: within half a minute the square is galloping with an amplitude of more than a diameter. Do the same with the cylinder: the kick dies away.
- Sweep the circular cylinder: only the resonance bump. A circle cannot gallop (its drag always damps motion across the wind).
- Double the structural damping or the mass: the galloping speed doubles (it goes with the Scruton number), and the resonance shrinks.
- Lighten the circular cylinder to 0.5 kg/m and sweep again: a light, lightly damped cylinder locks on strongly.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'wind speed U (m/s)', min: 0, max: 20 }, y: { label: 'amplitude ÷ D', min: 0 }, legend: true }, 160);
      const ctl = kit.controls(box.side, [
        { id: 'U', label: 'Wind speed U', min: 0, max: 20, step: 0.1, value: 3, unit: 'm/s' },
        { id: 'sec', type: 'select', label: 'Section', options: [['Square prism', 'square'], ['Circular cylinder', 'circle']], value: 'square' },
        { id: 'm', label: 'Mass per metre', min: 0.3, max: 6, value: 3, unit: 'kg/m', log: true, sig: 2 },
        { id: 'fn', label: 'Natural frequency', min: 2, max: 10, step: 0.1, value: 5, unit: 'Hz' },
        { id: 'z', label: 'Structural damping ζ', min: 0.1, max: 3, step: 0.05, value: 1, unit: '%' },
        { id: 'slow', type: 'select', label: 'Slow motion', options: [['Real time', 1], ['× ¼', 0.25], ['× ⅒', 0.1]], value: 0.25 },
        { type: 'buttons', items: [{ id: 'sweep', label: 'Sweep 0.5 → 20 m/s', primary: true }, { id: 'kick', label: 'Kick' }] }
      ], id => {
        if (id === 'kick') y[1] += 0.3;
        else if (id === 'sweep') startSweep();
        else if (id !== 'U' && id !== 'slow') { sweepPts = []; sweepU = null; }
        refresh();
      });
      const ro = kit.readout(box.side, [['fs', 'Shedding frequency St·U/D'], ['uv', 'Vortex-resonance speed f·D/St'], ['ug', 'Galloping onset (Den Hartog)'], ['sc', 'Scruton number 4πζm/(ρD²)'], ['amp', 'Amplitude now'], ['st', '']]);
      const V = ctl.values, D = 0.1, rho = 1.225, EPS = 0.3, AW = 12;
      const SEC = { square: { St: 0.13, CL0: 0.6, A1: 2.69, A3: 8 }, circle: { St: 0.2, CL0: 0.3, A1: -1.2, A3: 0 } };
      let y = [0, 0, 0.1, 0], hist = [], wake = [], shedAcc = 0, shedSide = 1, sweepPts = [], sweepU = null, sweepY = null, tS = 0, frame = 0;
      function rhs(s, U, P) {
        const [yy, v, q, qd] = s, S = SEC[V.sec];
        const wn = 2 * Math.PI * P.fn, k = P.m * wn * wn, c = 2 * P.z * P.m * wn;
        const xr = U > 0.05 ? v / U : 0, Cqs = U > 0.05 ? S.A1 * xr - S.A3 * xr * xr * xr : 0;
        const Fy = 0.5 * rho * U * U * D * (S.CL0 / 2 * q + Cqs);
        const a = (Fy - c * v - k * yy) / P.m, ws = 2 * Math.PI * S.St * U / D;
        return [v, a, qd, -EPS * ws * (q * q - 1) * qd - ws * ws * q + AW / D * a];
      }
      function rk4(s, h, U, P) {
        const k1 = rhs(s, U, P), k2 = rhs(s.map((v, i) => v + h / 2 * k1[i]), U, P), k3 = rhs(s.map((v, i) => v + h / 2 * k2[i]), U, P), k4 = rhs(s.map((v, i) => v + h * k3[i]), U, P);
        const o = s.map((v, i) => v + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
        if (Math.abs(o[0]) > 6 * D) { o[0] = Math.sign(o[0]) * 6 * D; o[1] = 0; }
        return o.every(Number.isFinite) ? o : [0, 0, 0.1, 0];
      }
      const pars = () => ({ m: V.m, fn: V.fn, z: V.z / 100 });
      const hstep = (U, P) => 1 / (40 * Math.max(P.fn, SEC[V.sec].St * U / D, 1));
      const ugal = () => { const S = SEC[V.sec]; return S.A1 > 0 ? 8 * Math.PI * V.m * (V.z / 100) * V.fn / (rho * D * S.A1) : Infinity; };
      function startSweep() { sweepPts = []; sweepU = 0.5; sweepY = [0, 0, 0.1, 0]; }
      function sweepStep() {
        if (sweepU == null) return;
        const P = pars(), h = hstep(sweepU, P);
        let t = 0, amp = 0;
        while (t < 16) { sweepY = rk4(sweepY, h, sweepU, P); t += h; if (t > 13) amp = Math.max(amp, Math.abs(sweepY[0])); }
        sweepPts.push([sweepU, amp / D]);
        sweepU = +(sweepU + 0.25).toFixed(2);
        if (sweepU > 20) sweepU = null;
        refresh();
      }
      function refresh() {
        const S = SEC[V.sec], uv = V.fn * D / S.St, ug = ugal();
        const vl = [{ x: uv, label: 'vortex resonance' }];
        if (ug <= 20) vl.push({ x: ug, label: 'galloping onset' });
        const a = hist.length ? Math.max(...hist.map(q => Math.abs(q[1]))) : 0;
        plot.set({ series: [{ pts: sweepPts, label: 'swept amplitude' + (sweepU != null ? ' (sweeping…)' : '') }], vlines: vl, marks: [{ x: V.U, y: a / D, label: 'now' }] });
        ro.set('fs', (S.St * V.U / D).toFixed(2) + ' Hz (natural ' + V.fn.toFixed(1) + ' Hz)');
        ro.set('uv', uv.toFixed(2) + ' m/s (St = ' + S.St + ')');
        ro.set('ug', Number.isFinite(ug) ? ug.toFixed(1) + ' m/s' : 'never — this shape damps cross-wind motion');
        ro.set('sc', (4 * Math.PI * (V.z / 100) * V.m / (rho * D * D)).toFixed(1));
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        sweepStep();
        const P = pars(), T = dt * V.slow, h0 = hstep(V.U, P), n = Math.max(1, Math.ceil(T / h0)), h = T / n;
        for (let k = 0; k < n && h > 0; k++) { y = rk4(y, h, V.U, P); tS += h; }
        hist.push([tS, y[0]]); while (hist.length > 2 && hist[0][0] < tS - 2) hist.shift();
        const amp = Math.max(...hist.map(q => Math.abs(q[1])));
        // ---- the tunnel: body on springs, the wake
        const S = SEC[V.sec], sc = Math.min(W * 0.07, H * 0.14) / D, cx = W * 0.3, cy = H * 0.42;
        const yd = clamp(y[0] * sc, -H * 0.36, H * 0.36), by = cy - yd, half = D * sc / 2;
        // vortices shed alternately, carried downstream (drawn only when slow enough to see)
        const fsv = S.St * V.U / D * V.slow;
        if (V.U > 0.3 && fsv < 14) { shedAcc += dt * fsv * 2; while (shedAcc >= 1) { shedAcc -= 1; shedSide = -shedSide; wake.push({ x: cx + half, y: by + shedSide * half * 0.8, s: shedSide, age: 0 }); } }
        else wake.length = 0;
        const vpx = 0.85 * V.U * sc * V.slow;
        for (const w of wake) { w.x += vpx * dt; w.age += dt; }
        while (wake.length && (wake[0].x > W + 20 || wake.length > 40)) wake.shift();
        for (const w of wake) {
          const r = half * 0.5 + w.age * 3;
          c.beginPath(); c.arc(w.x, w.y, Math.min(r, half * 1.2), 0, 2 * Math.PI); c.strokeStyle = w.s > 0 ? C.series[0] : C.series[1]; c.globalAlpha = Math.max(0.15, 0.8 - w.age * 0.2); c.lineWidth = 1.6; c.stroke();
          const a0 = w.age * 6 * w.s; kit.arrow(c, w.x + Math.cos(a0) * r * 0.9, w.y + Math.sin(a0) * r * 0.9, w.x + Math.cos(a0 + 0.8 * w.s) * r * 0.9, w.y + Math.sin(a0 + 0.8 * w.s) * r * 0.9, w.s > 0 ? C.series[0] : C.series[1], 1.2);
          c.globalAlpha = 1;
        }
        // wind
        const al = clamp(V.U / 20 * 60, 4, 60);
        for (let i = 0; i < 5; i++) { const yy = H * 0.1 + i * H * 0.16; kit.arrow(c, 6, yy, 6 + al, yy, C.faint, 1.3); }
        // springs above and below
        const spring = (x0, y0, y1) => { c.beginPath(); c.moveTo(x0, y0); const nz = 8, sg = (y1 - y0) / nz; for (let i = 0; i < nz; i++) c.lineTo(x0 + (i % 2 ? 7 : -7), y0 + (i + 0.5) * sg); c.lineTo(x0, y1); c.stroke(); };
        c.strokeStyle = C.muted; c.lineWidth = 1.5;
        spring(cx, 8, by - half); spring(cx, H * 0.84, by + half);
        c.fillStyle = C.faint; c.fillRect(cx - 26, 3, 52, 5); c.fillRect(cx - 26, H * 0.84, 52, 5);
        // the body
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2;
        if (V.sec === 'square') { c.fillRect(cx - half, by - half, 2 * half, 2 * half); c.strokeRect(cx - half, by - half, 2 * half, 2 * half); }
        else { c.beginPath(); c.arc(cx, by, half, 0, 2 * Math.PI); c.fill(); c.stroke(); }
        // the relative wind the moving body feels
        if (Math.abs(y[1]) > 0.02 && V.U > 0.3) { const ang = Math.atan2(y[1], V.U); kit.arrow(c, cx - half - 50, by - 50 * Math.tan(clamp(ang, -1, 1)), cx - half - 8, by, C.warn, 1.8); kit.label(c, 'relative wind', cx - half - 52, by - 58 * Math.tan(clamp(ang, -1, 1)) - 10, { size: 10, color: C.warn }); }
        // ---- displacement trace
        const tx0 = W * 0.58, tw = W * 0.4, ty0 = H * 0.14, th = H * 0.56;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(tx0, ty0, tw, th);
        c.beginPath(); c.moveTo(tx0, ty0 + th / 2); c.lineTo(tx0 + tw, ty0 + th / 2); c.stroke();
        const full = Math.max(niceUp(amp / D * 1.1), 0.05);
        c.strokeStyle = C.accent; c.lineWidth = 1.6; c.beginPath();
        hist.forEach((q, i) => { const X = tx0 + (q[0] - (tS - 2)) / 2 * tw, Y = ty0 + th / 2 - clamp(q[1] / D / full, -1, 1) * th / 2; i ? c.lineTo(X, Y) : c.moveTo(X, Y); });
        c.stroke();
        kit.label(c, 'displacement ÷ D, last 2 s (full scale ±' + full + ')', tx0, ty0 - 9, { size: 10.5, color: C.muted });
        const ug = ugal(), uv = V.fn * D / S.St;
        const lock = Math.abs(V.U / uv - 1) < 0.25 && amp / D > 0.02;
        const msg = V.U >= ug ? 'GALLOPING: self-excited, grows with speed' : lock ? 'vortex resonance: locked on, but bounded' : amp / D > 0.02 ? 'moving' : 'calm';
        kit.label(c, msg, W - 10, H - 12, { size: 12.5, weight: 800, align: 'right', color: V.U >= ug ? C.bad : lock ? C.warn : C.ok });
        ro.set('amp', (amp * 1000).toFixed(1) + ' mm = ' + (amp / D).toFixed(2) + ' D');
        ro.set('st', V.U >= ug ? 'above the galloping speed' : lock ? 'in the lock-in band' : '');
        if (sweepU == null && ++frame % 10 === 0) refresh();
      }, box.stage);
      refresh();
      loop.start();
    }
  });
})();
