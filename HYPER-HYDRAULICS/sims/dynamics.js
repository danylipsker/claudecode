/* HYPER-HYDRAULICS · sims/dynamics.js — water hammer, surge protection and electro-hydraulic control.
 *   dyn-moc          reservoir – pipe – valve: water hammer by the method of characteristics (50 reaches,
 *                    Courant number 1, friction, discrete gas-cavity model for column separation), pressure along the
 *                    pipe and at the valve
 *   dyn-wave-speed   pressure-wave fronts racing along a rigid pipe, the chosen pipe and the pipe with free air;
 *                    Korteweg wave speed against D/e for several materials
 *   dyn-surge-tank   mass oscillation in a hydropower surge tank after a load rejection or acceptance (RK4)
 *   dyn-oil-spring   a blocked cylinder as a mass on an oil spring: natural frequency along the stroke; a knock,
 *                    a step load, a valve closing on a moving load (chamber pressures, cavitation, relief valves)
 *   dyn-servo        a closed-loop position axis: P control (+ feed-forward), 2nd-order valve, nonlinear orifice
 *                    flows, the oil spring; stable, ringing or unstable, with the gain margin from the frequency response
 *   dyn-profile      sizing a valve for a trapezoidal move out and back: speed, load pressure, valve drop, rated flow
 */
(function () {
  'use strict';
  const G = 9.80665;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  function plotBox(box) { const d = document.createElement('div'); d.style.padding = '4px 10px 10px'; box.stage.appendChild(d); return d; }
  // scale a W × H design grid into the stage, centred; call c.restore() when done
  function fit(st, c, W, H) { const k = Math.min(st.W / W, st.H / H); c.save(); c.translate((st.W - W * k) / 2, (st.H - H * k) / 2); c.scale(k, k); return k; }
  function polyline(c, pts, color, width, dash) {
    c.strokeStyle = color; c.lineWidth = width || 2; c.setLineDash(dash || []); c.lineJoin = 'round';
    c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.setLineDash([]);
  }
  const f2 = (v, d) => (Math.abs(v) < 0.5 * Math.pow(10, -(d == null ? 1 : d)) ? 0 : v).toFixed(d == null ? 1 : d);

  /* ================================================================ water hammer by characteristics */
  Hyper.sim('dyn-moc', {
    title: 'Water hammer in a pipe, by the method of characteristics',
    blurb: `A reservoir feeds a 300 mm pipe that ends in a valve discharging to the air. When the valve closes, the pipe is solved by the **method of characteristics** on 50 reaches (one reach per wave time step), with pipe friction and — if you allow them — vapour cavities: each node carries a trace of free gas (a discrete gas-cavity model) that grows into a cavity as the pressure approaches vapour pressure. Above the pipe: the pressure along it now (solid), the highest and lowest so far (dashed), the static, Joukowsky and vapour-pressure levels. The pipe is tinted red where the pressure is above its starting value and blue where it is below; green arrows show the local velocity. Below: the pressure at the valve and at mid-pipe against time.

**Try this**
- Shut the valve instantly (closing time 0): a square wave, up by ρav₀ for 2L/a, then down for 2L/a. Compare the peak with the Joukowsky read-out.
- Lengthen the closing time past 2L/a: the peak falls roughly as Michaud's 2ρLv₀/t_c (a little below it here, because the rising pressure keeps pushing water through the closing valve); at ten pipe periods it is about a tenth of the Joukowsky surge.
- Keep that slow closing time but choose the gate valve, which throttles mostly at the end of its stroke: the surge comes back, because the flow only falls in the last part of the stroke. Then try the two-stage closure of the same valve.
- Switch to PVC or PE: the wave slows, the surge falls four- or five-fold, and the pipe period grows.
- Raise the velocity to 1.5 m/s with a reservoir only 40 m up: one pipe period after closure the valve reaches vapour pressure, a cavity opens, and its collapse throws a spike above the Joukowsky level. Untick the cavities to see the impossible pressures the model would otherwise predict.`,
    mount(box, kit, params) {
      const P = params || {}, F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const plot = kit.plot(plotBox(box), { x: { label: 'time (s)', min: 0 }, y: { label: 'pressure (bar, gauge)' }, legend: true }, 190);
      const MATS = {
        steel: { E: 200e9, e: 0.008, eps: 4.5e-5, name: 'steel' },
        iron: { E: 170e9, e: 0.007, eps: 1e-4, name: 'ductile iron' },
        pvc: { E: 3e9, e: 0.0143, eps: 7e-6, name: 'PVC' },
        pe: { E: 1.0e9, e: 0.0273, eps: 7e-6, name: 'PE100' }
      };
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Pipe (300 mm bore)', options: [['Steel, 8 mm wall', 'steel'], ['Ductile iron, 7 mm wall', 'iron'], ['PVC, D/e ≈ 21', 'pvc'], ['PE100, D/e ≈ 11', 'pe']], value: MATS[P.mat] ? P.mat : 'steel' },
        { id: 'L', label: 'Pipe length L', min: 100, max: 3000, step: 50, value: P.L || 800, unit: 'm' },
        { id: 'v0', label: 'Flow velocity v₀', min: 0.2, max: 3, step: 0.05, value: P.v0 || 0.6, unit: 'm/s' },
        { id: 'H0', label: 'Reservoir level above the pipe', min: 10, max: 200, step: 5, value: P.H0 || 80, unit: 'm' },
        { id: 'tc', label: 'Valve closing time', min: 0, max: 10, step: 0.05, value: P.tc != null ? P.tc : 0.5, unit: 's' },
        { id: 'law', type: 'select', label: 'How the valve closes', options: [['Ideal: the flow falls evenly with the stroke', 'linear'], ['Gate valve: throttles mostly at the end', 'late'], ['Gate valve, two-stage: 70 % of the stroke fast, the rest slowly', 'two']], value: P.law || 'linear' },
        { id: 'cav', type: 'check', label: 'Vapour cavities (column separation)', value: P.cav != null ? !!P.cav : true },
        { id: 'rep', type: 'check', label: 'Repeat automatically', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Close the valve again', primary: true }] }
      ], id => { if (id !== 'rep') build(); });
      const ro = kit.readout(box.side, [['a', 'Wave speed a'], ['T', 'Pipe period 2L/a'], ['J', 'Joukowsky ρ·a·v₀'], ['M', 'Michaud 2ρLv₀/t_c'], ['pk', 'Highest / lowest at the valve'], ['st', 'Now']]);
      const V = ctl.values;
      const N = 50, K = 2.2e9, rho = 998, D = 0.3, Ap = Math.PI * D * D / 4, nu = 1.0e-6;
      const Hv = (2340 - 101325) / (rho * G);                 // vapour pressure as a gauge head: about −10.1 m
      const toBar = h => rho * G * h / 1e5;
      let m = null, plotT = 0;

      // fraction of the valve's full-open flow coefficient, against time
      function tau(t) {
        if (t < m.t0) return 1;
        const s = m.tc > 0 ? (t - m.t0) / m.tc : 1;
        if (s >= 1) return 0;
        if (m.law === 'linear') return 1 - s;
        // a gate valve barely throttles until late in its stroke: τ = 1 − x⁴ for the stroke fraction x
        const x = m.law === 'two' ? (s < 0.15 ? 0.7 * s / 0.15 : 0.7 + 0.3 * (s - 0.15) / 0.85) : s;
        return 1 - x * x * x * x;
      }
      function build() {
        const mat = MATS[V.mat] || MATS.steel;
        const a = F.waveSpeed({ K, rho, D, e: mat.e, E: mat.E });
        const L = V.L, dx = L / N, dt = dx / a;               // Courant number 1: the characteristics meet the grid exactly
        // pipe friction; the velocity may not need more than 80 % of the reservoir head
        let v0 = V.v0, f = F.friction(v0 * D / nu, mat.eps / D);
        const vLim = Math.sqrt(0.8 * V.H0 * 2 * G * D / (f * L));
        const limited = v0 > vLim;
        if (limited) { v0 = vLim; f = F.friction(v0 * D / nu, mat.eps / D); }
        const Q0 = v0 * Ap, B = a / (G * Ap), R = f * dx / (2 * G * D * Ap * Ap);
        const H = new Float64Array(N + 1), Qu = new Float64Array(N + 1), Qd = new Float64Array(N + 1), Vc = new Float64Array(N + 1);
        const K3 = 1e-7 * Ap * dx * (0 - Hv);                  // free gas: void fraction 1e-7 at atmospheric pressure
        for (let i = 0; i <= N; i++) { H[i] = V.H0 - i * R * Q0 * Q0; Qu[i] = Qd[i] = Q0; Vc[i] = V.cav ? K3 / (H[i] - Hv) : 0; }
        const Tr = 2 * L / a, t0 = Math.max(0.05, 0.25 * Tr), tc = V.tc;
        const pJ = F.joukowsky(rho, a, v0) / 1e5, p0 = toBar(H[N]), pRes = toBar(V.H0);
        const hi = Math.max(pRes, p0 + pJ) * 1.18 + 0.5;
        const lo = V.cav ? Math.min(-2, -0.12 * hi) : Math.min(-2, p0 - pJ - 0.1 * hi);
        m = {
          a, L, dt, v0, f, limited, Q0, B, R, H, Qu, Qd, Vc, K3, Hres: V.H0,
          Hn: new Float64Array(N + 1), Qun: new Float64Array(N + 1), Qdn: new Float64Array(N + 1), Vcn: new Float64Array(N + 1),
          H0s: Float64Array.from(H), Hmax: Float64Array.from(H), Hmin: Float64Array.from(H),
          Cv: Q0 / Math.sqrt(H[N]), Tr, t0, tc, tEnd: t0 + tc + 10 * Tr, t: 0, simT: 0, n: 0,
          hist: [[0, p0, toBar(H[N >> 1])]], done: false, wait: 0, pJ, p0, pRes, hi, lo,
          pMaxV: p0, pMinV: p0, tauNow: 1, qValve: Q0, law: V.law, cav: V.cav
        };
        m.every = Math.max(1, Math.ceil((m.tEnd / dt) / 1500));
        m.speed = Math.max(4 * L / a / 3, tc / 6, 0.02);      // simulated seconds per real second: a wave cycle in about 3 s
        plotT = 1;
      }
      function step() {
        const M = m, H = M.H, Qu = M.Qu, Qd = M.Qd, Vc = M.Vc, B = M.B, R = M.R, dt = M.dt, cav = M.cav;
        const Hn = M.Hn, Qun = M.Qun, Qdn = M.Qdn, Vcn = M.Vcn;
        const t = M.t + dt;
        // upstream: the reservoir holds its level; the C− characteristic arrives from node 1
        const CM0 = H[1] - B * Qu[1] + R * Qu[1] * Math.abs(Qu[1]);
        Hn[0] = M.Hres; Qun[0] = Qdn[0] = (M.Hres - CM0) / B; Vcn[0] = 0;
        // interior nodes: C+ from the left, C− from the right. With cavities allowed, each node holds a trace of free
        // gas (discrete gas-cavity model, void fraction 1e-7 at atmospheric pressure, ψ = 1): its volume K3/(H − H_v)
        // is negligible at normal pressures and grows into a vapour cavity as the head approaches H_v.
        for (let i = 1; i < N; i++) {
          const qa = Qd[i - 1], qb = Qu[i + 1];
          const CP = H[i - 1] + B * qa - R * qa * Math.abs(qa);
          const CM = H[i + 1] - B * qb + R * qb * Math.abs(qb);
          let h, vc = 0;
          if (cav) {
            const c2 = 2 * dt / B, A0 = Vc[i] + dt * (2 * Hv - CP - CM) / B, disc = Math.sqrt(A0 * A0 + 4 * c2 * M.K3);
            const y = A0 > 0 ? 2 * M.K3 / (A0 + disc) : (-A0 + disc) / (2 * c2);   // head above vapour, > 0
            h = y + Hv; vc = M.K3 / y;
          } else h = (CP + CM) / 2;
          Hn[i] = h; Qun[i] = (CP - h) / B; Qdn[i] = (h - CM) / B; Vcn[i] = vc;
        }
        // downstream: the valve discharging to the air, Q = τ·Cv·√H, meets the C+ characteristic
        {
          const qa = Qd[N - 1];
          const CP = H[N - 1] + B * qa - R * qa * Math.abs(qa);
          const cvt = M.Cv * tau(t);
          let h, q, vc = 0;
          if (cvt > 0 && CP > 0) { const s = (-B * cvt + Math.sqrt(B * B * cvt * cvt + 4 * CP)) / 2; q = cvt * s; h = s * s; if (cav) vc = M.K3 / (h - Hv); }
          else if (cav) {                                        // shut, or below atmospheric: no outflow; the gas volume balances
            const c1 = dt / B, A0 = Vc[N] - dt * (CP - Hv) / B, disc = Math.sqrt(A0 * A0 + 4 * c1 * M.K3);
            const y = A0 > 0 ? 2 * M.K3 / (A0 + disc) : (-A0 + disc) / (2 * c1);
            h = y + Hv; q = 0; vc = M.K3 / y;
          } else { q = 0; h = CP; }
          Hn[N] = h; Qun[N] = (CP - h) / B; Qdn[N] = q; Vcn[N] = vc;
          M.qValve = q;
        }
        M.H = Hn; M.Hn = H; M.Qu = Qun; M.Qun = Qu; M.Qd = Qdn; M.Qdn = Qd; M.Vc = Vcn; M.Vcn = Vc;
        for (let i = 0; i <= N; i++) { const h = M.H[i]; if (h > M.Hmax[i]) M.Hmax[i] = h; if (h < M.Hmin[i]) M.Hmin[i] = h; }
        const pv = toBar(M.H[N]);
        if (t >= M.t0) { if (pv > M.pMaxV) M.pMaxV = pv; if (pv < M.pMinV) M.pMinV = pv; }
        M.t = t; M.n++; M.tauNow = tau(t);
        if (M.n % M.every === 0) M.hist.push([t, pv, toBar(M.H[N >> 1])]);
      }
      function updatePlot() {
        const hl = [{ y: m.p0 + m.pJ, label: 'Joukowsky p₀ + ρav₀' }, { y: toBar(Hv), label: 'vapour pressure' }];
        if (m.tc > m.Tr) hl.push({ y: m.p0 + 2 * rho * m.L * m.v0 / m.tc / 1e5, label: 'Michaud' });
        const vl = [{ x: m.t0, label: 'closing starts' }, { x: m.t0 + m.Tr, label: '+ 2L/a' }];
        if (m.tc > 0.02) vl.push({ x: m.t0 + m.tc, label: 'shut' });
        plot.set({
          x: { label: 'time (s)', min: 0, max: m.tEnd },
          y: { label: 'pressure (bar, gauge)', min: Math.min(m.lo, m.pMinV - 0.5), max: Math.max(m.hi, m.pMaxV + 0.5) },
          series: [{ pts: m.hist.map(h => [h[0], h[1]]), label: 'at the valve' }, { pts: m.hist.map(h => [h[0], h[2]]), label: 'mid-pipe', dash: [5, 4] }],
          hlines: hl, vlines: vl
        });
      }
      function readouts() {
        ro.set('a', m.a.toFixed(0) + ' m/s');
        ro.set('T', m.Tr.toFixed(2) + ' s — this closure (' + m.tc.toFixed(2) + ' s) is ' + (m.tc <= m.Tr ? 'fast' : 'slow'));
        ro.set('J', m.pJ.toFixed(2) + ' bar (' + (m.pJ * 1e5 / (rho * G)).toFixed(0) + ' m of head)');
        ro.set('M', m.tc > m.Tr ? (2 * rho * m.L * m.v0 / m.tc / 1e5).toFixed(2) + ' bar' : '— (shut within 2L/a)');
        ro.set('pk', f2(m.pMaxV) + ' / ' + f2(m.pMinV) + ' bar (gauge)');
        let cavN = 0, below = false;
        for (let i = 0; i <= N; i++) { if (m.cav && m.H[i] - Hv < 0.5) cavN++; if (m.H[i] < Hv - 0.01) below = true; }
        let s = 't = ' + m.t.toFixed(2) + ' s · ';
        s += m.t < m.t0 ? 'steady flow at ' + m.v0.toFixed(2) + ' m/s' : m.tauNow > 0 ? 'closing, ' + (m.tauNow * 100).toFixed(0) + ' % open' : 'shut';
        if (cavN) s += ' · vapour cavity at ' + cavN + (cavN > 1 ? ' points' : ' point');
        if (below) s += ' · below vapour pressure (impossible)';
        if (m.limited) s += ' · v₀ limited by friction to ' + m.v0.toFixed(2) + ' m/s';
        if (m.done) s += ' · finished';
        ro.set('st', s);
      }
      function draw() {
        const c = st.begin(), C = kit.colors();
        fit(st, c, 760, 300);
        const X0 = 130, X1 = 650, yT = 16, yB = 250, span = m.hi - m.lo;
        const yOf = p => yT + (m.hi - p) / span * (yB - yT), xOf = i => X0 + (X1 - X0) * i / N;
        const y0 = yOf(0);
        // pressure grid
        const stp = Hyper.niceStep(span, 5);
        for (let p = Math.ceil(m.lo / stp) * stp; p <= m.hi; p += stp) {
          const y = yOf(p);
          polyline(c, [[X0, y], [X1, y]], C.grid, 1);
          kit.label(c, (+p.toFixed(6)).toString(), X0 - 6, y, { color: C.muted, size: 10, align: 'right' });
        }
        kit.label(c, 'bar (gauge)', X0 - 6, yT - 8, { color: C.muted, size: 10, align: 'right' });
        // the reservoir: its water surface sits at its head on the same pressure scale
        const ys = yOf(m.pRes);
        c.fillStyle = kit.hue(205, 0.28); c.fillRect(24, ys, X0 - 30, y0 + 14 - ys);
        polyline(c, [[22, ys - 16], [22, y0 + 16], [X0 - 4, y0 + 16], [X0 - 4, y0 + 8]], C.text, 2);
        polyline(c, [[X0 - 4, y0 - 8], [X0 - 4, ys - 16]], C.text, 2);
        polyline(c, [[24, ys], [X0 - 6, ys]], kit.hue(205), 2);
        kit.label(c, 'reservoir', (22 + X0) / 2 - 2, Math.max(10, ys - 26), { color: C.text, size: 11, weight: 700 });
        // reference levels
        c.save(); c.beginPath(); c.rect(X0, yT - 4, X1 - X0 + 2, yB - yT + 8); c.clip();
        polyline(c, [[X0, ys], [X1, ys]], C.muted, 1.2, [2, 4]);
        polyline(c, [[X0, yOf(m.p0 + m.pJ)], [X1, yOf(m.p0 + m.pJ)]], C.bad, 1.2, [6, 5]);
        polyline(c, [[X0, yOf(toBar(Hv))], [X1, yOf(toBar(Hv))]], kit.hue(215), 1.2, [6, 5]);
        // envelopes and the pressure along the pipe now
        const prof = arr => Array.from(arr, (h, i) => [xOf(i), yOf(toBar(h))]);
        polyline(c, prof(m.Hmax), C.warn, 1.4, [4, 4]);
        polyline(c, prof(m.Hmin), kit.hue(215, 0.8), 1.4, [4, 4]);
        polyline(c, prof(m.H), C.accent, 2.6);
        c.restore();
        kit.label(c, 'static (no flow)', X1 - 4, ys - 8, { color: C.muted, size: 10, align: 'right' });
        kit.label(c, 'p₀ + ρav₀', X1 - 4, yOf(m.p0 + m.pJ) - 8, { color: C.bad, size: 10, align: 'right' });
        kit.label(c, 'vapour', X1 - 4, yOf(toBar(Hv)) + 9, { color: kit.hue(215), size: 10, align: 'right' });
        // the pipe, tinted by the change of pressure
        for (let i = 0; i < N; i++) {
          const dev = (toBar(m.H[i]) + toBar(m.H[i + 1]) - toBar(m.H0s[i]) - toBar(m.H0s[i + 1])) / 2, k = Math.min(0.85, 0.08 + Math.abs(dev) / Math.max(m.pJ, 0.1));
          c.fillStyle = dev >= 0 ? kit.hue(0, k) : kit.hue(215, k);
          c.fillRect(xOf(i), y0 - 6, xOf(i + 1) - xOf(i) + 0.6, 12);
        }
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(X0, y0 - 6, X1 - X0, 12);
        // vapour cavities
        for (let i = 0; i <= N; i++) if (m.cav && m.H[i] - Hv < 0.5) {
          const r = clamp(2 + 3 * Math.cbrt(m.Vc[i] / 0.01), 2, 7);
          c.fillStyle = C.bg2; c.strokeStyle = kit.hue(215); c.lineWidth = 1.5;
          c.beginPath(); c.arc(xOf(i), y0, r, 0, Math.PI * 2); c.fill(); c.stroke();
        }
        // local velocity arrows
        for (const i of [5, 15, 25, 35, 45]) {
          const v = m.Qd[i] / Ap, L = clamp(24 * v / Math.max(m.v0, 0.2), -30, 30), x = xOf(i);
          if (Math.abs(L) > 1.5) kit.arrow(c, x - L / 2, y0 + 20, x + L / 2, y0 + 20, C.ok, 2);
        }
        kit.label(c, 'velocity', X0, y0 + 34, { color: C.ok, size: 10, align: 'left' });
        // the valve and its jet
        const xv = X1 + 16, cl = 1 - m.tauNow;
        c.fillStyle = kit.hue(0, 0.15 + 0.6 * cl); c.strokeStyle = C.text; c.lineWidth = 1.8;
        c.beginPath(); c.moveTo(X1, y0 - 9); c.lineTo(X1, y0 + 9); c.lineTo(xv, y0); c.closePath(); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(xv + 16, y0 - 9); c.lineTo(xv + 16, y0 + 9); c.lineTo(xv, y0); c.closePath(); c.fill(); c.stroke();
        polyline(c, [[xv, y0], [xv, y0 - 20]], C.text, 1.8); polyline(c, [[xv - 7, y0 - 20], [xv + 7, y0 - 20]], C.text, 2.2);
        if (m.qValve > 1e-6) {
          const w = 1 + 5 * m.qValve / m.Q0;
          c.strokeStyle = kit.hue(205, 0.8); c.lineWidth = w; c.beginPath(); c.moveTo(xv + 17, y0);
          c.quadraticCurveTo(xv + 50, y0, xv + 62, y0 + 40); c.stroke();
        }
        kit.label(c, 'valve ' + (m.tauNow * 100).toFixed(0) + ' % open', xv + 8, y0 - 32, { color: C.text, size: 11, weight: 700 });
        kit.label(c, '0', X0, y0 + 48, { color: C.muted, size: 10 });
        kit.label(c, 'x = L = ' + m.L.toFixed(0) + ' m', X1, y0 + 48, { color: C.muted, size: 10 });
        kit.label(c, 't = ' + m.t.toFixed(2) + ' s', 752, 10, { color: C.text, size: 12, weight: 700, align: 'right' });
        c.restore();
      }
      build();
      const loop = kit.loop(dt => {
        if (!m.done) {
          m.simT = Math.min(m.simT + dt * m.speed, m.t + 4000 * m.dt);
          let k = 0;
          while (m.t + m.dt <= m.simT && k < 4000) { step(); k++; }
          if (m.t >= m.tEnd) { m.done = true; plotT = 1; }
        } else if (V.rep) { m.wait += dt; if (m.wait > 2.5) build(); }
        plotT += dt;
        if (plotT > 0.2) { plotT = 0; updatePlot(); }
        readouts();
        draw();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ wave speed: a race of pressure fronts */
  Hyper.sim('dyn-wave-speed', {
    title: 'Pressure waves racing along pipes',
    blurb: `Three pressure-wave fronts set off together from a valve along a kilometre of pipe: in a perfectly rigid pipe (the speed of sound in the liquid), in the pipe you choose, and in that pipe with free air in the liquid. Behind each front the liquid has been stopped and compressed (red). The graph shows Korteweg's wave speed against the pipe's diameter-to-wall ratio for several materials, with your pipe marked.

**Try this**
- Compare steel and PE at their usual D/e: the PE front arrives about four times later, and its Joukowsky surge per m/s is four times smaller.
- Make the steel pipe thinner (D/e from 20 to 100): the wave slows only a little — steel is stiff compared with water. Do the same in PVC and it slows a lot.
- Add 0.1 % of free air at 1 bar absolute: the third front crawls at about 300 m/s. Raise the pressure to 10 bar and watch it catch up.
- Switch to hydraulic oil: the rigid-pipe speed drops to about 1360 m/s.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const plot = kit.plot(plotBox(box), { x: { label: 'diameter / wall thickness, D/e', log: true, min: 5, max: 150 }, y: { label: 'wave speed a (m/s)', min: 0 }, legend: true }, 210);
      const LIQ = { water: { K: 2.2e9, rho: 998, name: 'water' }, sea: { K: 2.34e9, rho: 1025, name: 'sea water' }, oil: { K: 1.6e9, rho: 870, name: 'mineral oil' } };
      const MAT = {
        steel: { E: 200e9, nu: 0.3, name: 'steel', De: 37.5 }, iron: { E: 170e9, nu: 0.28, name: 'ductile iron', De: 43 },
        conc: { E: 30e9, nu: 0.2, name: 'concrete', De: 12 }, grp: { E: 20e9, nu: 0.3, name: 'GRP', De: 60 },
        pvc: { E: 3e9, nu: 0.38, name: 'PVC', De: 21 }, pe: { E: 1.0e9, nu: 0.46, name: 'PE100', De: 11 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'liq', type: 'select', label: 'Liquid', options: [['Water, 20 °C (K = 2.2 GPa)', 'water'], ['Sea water (K = 2.34 GPa)', 'sea'], ['Mineral hydraulic oil (K = 1.6 GPa)', 'oil']], value: 'water' },
        { id: 'mat', type: 'select', label: 'Pipe material', options: [['Steel (E = 200 GPa)', 'steel'], ['Ductile iron (170 GPa)', 'iron'], ['Concrete (30 GPa)', 'conc'], ['GRP (20 GPa)', 'grp'], ['PVC (3 GPa)', 'pvc'], ['PE100 (1 GPa)', 'pe']], value: 'steel' },
        { id: 'De', label: 'Diameter / wall thickness D/e', min: 5, max: 150, value: 37.5, log: true, sig: 3 },
        { id: 'air', type: 'select', label: 'Free air in the liquid', options: [['none', 0], ['0.01 % by volume', 1e-4], ['0.1 % by volume', 1e-3], ['1 % by volume', 1e-2]], value: 1e-3 },
        { id: 'p', label: 'Pressure (absolute)', min: 1, max: 40, step: 0.5, value: 1, unit: 'bar' },
        { id: 'anch', type: 'check', label: 'Anchored against axial movement (c₁ = 1 − ν²)', value: false },
        { type: 'buttons', items: [{ id: 'go', label: 'Start the race', primary: true }] }
      ], (id, v) => { if (id === 'mat') ctl.set('De', (MAT[v] || MAT.steel).De); race = 0; replot(); });
      const ro = kit.readout(box.side, [['a0', 'Rigid pipe √(K/ρ)'], ['ap', 'In this pipe (Korteweg)'], ['aa', 'With the free air'], ['K', 'Bulk modulus with air'], ['J', 'Surge per 1 m/s: pipe / with air'], ['T', 'Pipe period for 1 km: pipe / with air']]);
      const V = ctl.values;
      let race = 0;
      function speeds() {
        const l = LIQ[V.liq] || LIQ.water, mt = MAT[V.mat] || MAT.steel;
        const c1 = V.anch ? 1 - mt.nu * mt.nu : 1;
        const a0 = Math.sqrt(l.K / l.rho);
        const ap = F.waveSpeed({ K: l.K, rho: l.rho, D: V.De * c1, e: 1, E: mt.E });
        const alpha = +V.air || 0, Keff = 1 / (1 / l.K + alpha / (V.p * 1e5)), rhoM = l.rho * (1 - alpha);
        const aa = F.waveSpeed({ K: Keff, rho: rhoM, D: V.De * c1, e: 1, E: mt.E });
        return { l, mt, a0, ap, aa, alpha, Keff, rhoM };
      }
      function replot() {
        const s = speeds(), series = [];
        const keys = ['steel', 'iron', 'conc', 'grp', 'pvc', 'pe'];
        for (const k of keys) {
          const mt = MAT[k], c1 = V.anch ? 1 - mt.nu * mt.nu : 1, pts = [];
          for (let i = 0; i <= 40; i++) { const De = 5 * Math.pow(30, i / 40); pts.push([De, F.waveSpeed({ K: s.l.K, rho: s.l.rho, D: De * c1, e: 1, E: mt.E })]); }
          series.push({ pts, label: mt.name, width: k === V.mat ? 3 : 1.5 });
        }
        const marks = [{ x: V.De, y: s.ap, label: 'your pipe' }];
        if (s.alpha > 0) marks.push({ x: V.De, y: s.aa, label: 'with air' });
        plot.set({ series, marks, hlines: [{ y: s.a0, label: 'rigid pipe' }], y: { label: 'wave speed a (m/s)', min: 0, max: s.a0 * 1.1 } });
        ro.set('a0', s.a0.toFixed(0) + ' m/s');
        ro.set('ap', s.ap.toFixed(0) + ' m/s');
        ro.set('aa', s.alpha > 0 ? s.aa.toFixed(0) + ' m/s' : '— (no air)');
        ro.set('K', s.alpha > 0 ? (s.Keff / 1e6).toFixed(0) + ' MPa (liquid alone ' + (s.l.K / 1e9).toFixed(2) + ' GPa)' : (s.l.K / 1e9).toFixed(2) + ' GPa');
        ro.set('J', (F.joukowsky(s.l.rho, s.ap, 1) / 1e5).toFixed(2) + ' / ' + (F.joukowsky(s.rhoM, s.aa, 1) / 1e5).toFixed(2) + ' bar');
        ro.set('T', (2000 / s.ap).toFixed(2) + ' / ' + (2000 / s.aa).toFixed(2) + ' s');
      }
      replot();
      const loop = kit.loop(dt => {
        const s = speeds(), C = kit.colors();
        race += dt;
        const tShow = 1.6;                                       // the rigid-pipe front crosses in 1.6 s
        const tEnd = Math.min(14, tShow * s.a0 / Math.min(s.ap, s.aa)) + 1;
        if (race > tEnd) race = 0;
        const c = st.begin();
        fit(st, c, 760, 230);
        const X0 = 150, X1 = 690;
        const lanes = [['rigid pipe', s.a0, 'the liquid alone'], ['this pipe', s.ap, s.mt.name + ', D/e = ' + V.De.toFixed(0)], ['with free air', s.aa, s.alpha > 0 ? (s.alpha * 100) + ' % at ' + V.p.toFixed(1) + ' bar abs' : 'no air']];
        lanes.forEach(([name, a, sub], i) => {
          const y = 40 + i * 68, wall = clamp(70 / V.De, 1.2, 7);
          const frac = clamp(race * a / (s.a0 * tShow), 0, 1), xf = X1 - frac * (X1 - X0);
          c.fillStyle = kit.hue(205, 0.18); c.fillRect(X0, y - 9, X1 - X0, 18);
          c.fillStyle = kit.hue(0, 0.5); c.fillRect(xf, y - 9, X1 - xf, 18);
          c.fillStyle = C.text; c.fillRect(X0, y - 9 - wall, X1 - X0, wall); c.fillRect(X0, y + 9, X1 - X0, wall);
          polyline(c, [[xf, y - 12], [xf, y + 12]], C.bad, 2.5);
          polyline(c, [[X1 + 2, y - 14], [X1 + 2, y + 14]], C.text, 3);
          kit.label(c, name, X0 - 10, y - 7, { color: C.text, size: 12, weight: 700, align: 'right' });
          kit.label(c, sub, X0 - 10, y + 9, { color: C.muted, size: 10, align: 'right' });
          kit.label(c, a.toFixed(0) + ' m/s · ' + (1000 / a).toFixed(2) + ' s per km', X0 + 4, y + 25, { color: C.muted, size: 10, align: 'left' });
          if (frac >= 1) kit.label(c, 'arrived', X0 + 6, y - 20, { color: C.ok, size: 10, weight: 700, align: 'left' });
        });
        kit.label(c, 'valve', X1 + 2, 14, { color: C.muted, size: 10 });
        kit.label(c, '1 km of pipe — slowed down ' + (s.a0 * tShow / 1000).toFixed(1) + ' times', (X0 + X1) / 2, 222, { color: C.muted, size: 10 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a surge tank */
  Hyper.sim('dyn-surge-tank', {
    title: 'A surge tank swinging',
    blurb: `A reservoir feeds a long headrace tunnel that ends in a vertical surge tank; from there a steep penstock drops to the turbines. When the turbines shut down (in 8 s), the water in the tunnel keeps coming and rises in the tank until the head decelerates it; then it flows back, and the level swings up and down for many minutes — a **mass oscillation**, integrated here with the tunnel's friction and an optional throttle at the tank's entrance. The dashed line is the hydraulic grade line along the tunnel. Time runs so that one period takes about seven seconds.

**Try this**
- Run a full load rejection and compare the first peak with the frictionless estimate v₀√(LA_p/gA_t); friction takes a few metres off it.
- Make the tank twice as wide: the swing halves and the period doubles.
- Add a throttle of 5–10 m at the tank's entrance: the oscillation dies much faster (a throttled surge tank).
- Choose load acceptance: the level first falls — the tank feeds the turbines while the tunnel's water is still speeding up. Here friction makes the down-swing slightly *deeper* than the estimate, since it slows the tunnel's acceleration. Too small a tank would let air into the penstock.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 240 });
      const plot = kit.plot(plotBox(box), { x: { label: 'time (s)', min: 0 }, y: { label: 'tank level above the reservoir (m)' }, legend: true }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Tunnel length', min: 500, max: 6000, step: 100, value: 2000, unit: 'm' },
        { id: 'Dp', label: 'Tunnel diameter', min: 2, max: 8, step: 0.1, value: 4, unit: 'm' },
        { id: 'Dt', label: 'Surge-tank diameter', min: 4, max: 30, step: 0.5, value: 12, unit: 'm' },
        { id: 'v0', label: 'Tunnel velocity at full load', min: 0.5, max: 4, step: 0.1, value: 2, unit: 'm/s' },
        { id: 'hf', label: 'Tunnel friction loss at full load', min: 0, max: 10, step: 0.5, value: 3, unit: 'm' },
        { id: 'ho', label: 'Throttle at the tank (loss at full flow)', min: 0, max: 20, step: 0.5, value: 0, unit: 'm' },
        { id: 'ev', type: 'select', label: 'Event', options: [['Full load rejection: turbines shut', 'rej'], ['Half load rejection', 'half'], ['Load acceptance: 0 → full', 'acc']], value: 'rej' },
        { type: 'buttons', items: [{ id: 'go', label: 'Run the event', primary: true }] }
      ], () => build());
      const ro = kit.readout(box.side, [['T', 'Period 2π√(LA_t/gA_p)'], ['z', 'Swing estimate Δv√(LA_p/gA_t)'], ['hl', 'Highest / lowest level'], ['now', 'Tunnel velocity / level now']]);
      const V = ctl.values;
      let s = null, plotT = 0;
      function build() {
        const Ap = Math.PI * V.Dp * V.Dp / 4, At = Math.PI * V.Dt * V.Dt / 4, Q0 = V.v0 * Ap;
        const cf = V.hf / (V.v0 * V.v0), ko = V.ho / (Q0 * Q0);
        const Qa = V.ev === 'acc' ? 0 : Q0, Qb = V.ev === 'rej' ? 0 : V.ev === 'half' ? Q0 / 2 : Q0;
        const T = 2 * Math.PI * Math.sqrt(V.L * At / (G * Ap)), zEst = Math.abs(Qa - Qb) / Ap * Math.sqrt(V.L * Ap / (G * At));
        const v = Qa / Ap;
        s = { Ap, At, Q0, cf, ko, Qa, Qb, T, zEst, v, z: -cf * v * v, t: 0, t0: Math.min(10, 0.04 * T), tg: Math.min(8, 0.1 * T), hist: [], simT: 0, tEnd: 4.5 * T, done: false, wait: 0, zHi: -1e9, zLo: 1e9 };
        s.h = Math.min(0.05, T / 3000);
        s.speed = T / 7;
        s.hist.push([0, s.z]);
        plotT = 1;
      }
      const QT = t => s.Qa + (s.Qb - s.Qa) * clamp((t - s.t0) / s.tg, 0, 1);   // turbine flow: the gates move over t_g
      function deriv(t, v, z) {
        const Qt = s.Ap * v - QT(t), Hj = z + s.ko * Qt * Math.abs(Qt);      // flow into the tank; head where the tunnel meets it
        return [G / V.L * (-Hj - s.cf * v * Math.abs(v)), Qt / s.At];
      }
      function step() {
        const h = s.h, t = s.t, v = s.v, z = s.z;
        const k1 = deriv(t, v, z), k2 = deriv(t + h / 2, v + h / 2 * k1[0], z + h / 2 * k1[1]);
        const k3 = deriv(t + h / 2, v + h / 2 * k2[0], z + h / 2 * k2[1]), k4 = deriv(t + h, v + h * k3[0], z + h * k3[1]);
        s.v += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
        s.z += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
        s.t += h;
        if (s.t > s.t0) { s.zHi = Math.max(s.zHi, s.z); s.zLo = Math.min(s.zLo, s.z); }
        if (s.hist.length === 0 || s.t - s.hist[s.hist.length - 1][0] >= s.tEnd / 600) s.hist.push([s.t, s.z]);
      }
      build();
      const loop = kit.loop(dt => {
        if (!s.done) {
          s.simT = Math.min(s.simT + dt * s.speed, s.t + 5000 * s.h);
          let n = 0;
          while (s.t + s.h <= s.simT && n < 5000) { step(); n++; }
          if (s.t >= s.tEnd) { s.done = true; plotT = 1; }
        } else { s.wait += dt; if (s.wait > 3) build(); }
        const C = kit.colors();
        plotT += dt;
        if (plotT > 0.25) {
          plotT = 0;
          const hl = [{ y: 0, label: 'reservoir level' }];
          if (s.zEst > 0) hl.push({ y: s.Qb < s.Qa ? s.zEst : -s.zEst, label: 'no-friction estimate' });
          plot.set({ x: { label: 'time (s)', min: 0, max: s.tEnd }, series: [{ pts: s.hist, label: 'level in the surge tank' }], hlines: hl });
        }
        ro.set('T', s.T.toFixed(0) + ' s (' + (s.T / 60).toFixed(1) + ' min)');
        ro.set('z', s.zEst.toFixed(2) + ' m');
        ro.set('hl', s.zHi > -1e8 ? s.zHi.toFixed(2) + ' / ' + s.zLo.toFixed(2) + ' m' : '—');
        ro.set('now', s.v.toFixed(2) + ' m/s / ' + s.z.toFixed(2) + ' m (t = ' + s.t.toFixed(0) + ' s)');
        // drawing on a 760 × 280 grid
        const c = st.begin();
        fit(st, c, 760, 280);
        const zR = Math.max(s.zEst * 1.35, V.hf * 1.6 + 2, 4);
        const yz = z => 28 + (zR - z) / (2 * zR) * 180;
        const yRes = yz(0), xs = 470, w = 14 + 1.5 * V.Dt, yTop = 14, yBot = 244;
        // reservoir
        c.fillStyle = kit.hue(205, 0.3); c.fillRect(14, yRes, 106, 250 - yRes);
        polyline(c, [[12, yRes - 20], [12, 252], [120, 252], [120, 246]], C.text, 2);
        polyline(c, [[120, 230], [120, yRes - 20]], C.text, 2);
        kit.label(c, 'reservoir', 66, yRes - 12, { color: C.text, size: 11, weight: 700 });
        // tunnel
        c.fillStyle = kit.hue(205, 0.25); c.beginPath(); c.moveTo(120, 230); c.lineTo(xs, 238); c.lineTo(xs, 250); c.lineTo(120, 246); c.closePath(); c.fill();
        polyline(c, [[120, 230], [xs, 238]], C.text, 1.8); polyline(c, [[120, 246], [xs, 250]], C.text, 1.8);
        const vr = s.v / Math.max(V.v0, 0.1), aL = clamp(60 * vr, -70, 70);
        if (Math.abs(aL) > 2) kit.arrow(c, 290 - aL / 2, 240, 290 + aL / 2, 240, C.ok, 2.5);
        kit.label(c, 'tunnel ' + V.L + ' m, Ø ' + V.Dp.toFixed(1) + ' m', 290, 262, { color: C.muted, size: 10 });
        // the surge tank
        const yw = clamp(yz(s.z), yTop, yBot);
        c.fillStyle = kit.hue(205, 0.35); c.fillRect(xs, yw, w, 250 - yw);
        polyline(c, [[xs, yTop], [xs, 238]], C.text, 2); polyline(c, [[xs + w, yTop], [xs + w, 250]], C.text, 2);
        polyline(c, [[xs, yw], [xs + w, yw]], kit.hue(205), 2.2);
        kit.label(c, 'surge tank Ø ' + V.Dt + ' m', xs + w / 2, yTop - 6, { color: C.text, size: 11, weight: 700 });
        // level scale on the tank
        const stp = Hyper.niceStep(2 * zR, 6);
        for (let z = Math.ceil(-zR / stp) * stp; z <= zR; z += stp) {
          polyline(c, [[xs + w, yz(z)], [xs + w + 5, yz(z)]], C.muted, 1);
          kit.label(c, (+z.toFixed(4)) + ' m', xs + w + 8, yz(z), { color: C.muted, size: 9, align: 'left' });
        }
        polyline(c, [[14, yRes], [xs + w + 40, yRes]], C.muted, 1, [2, 4]);
        // hydraulic grade line along the tunnel: from the reservoir level to the head at the tank
        const Qt = s.Ap * s.v - QT(s.t), Hj = s.z + s.ko * Qt * Math.abs(Qt);
        polyline(c, [[120, yRes], [xs, clamp(yz(Hj), yTop, yBot)]], C.warn, 1.6, [6, 4]);
        kit.label(c, 'grade line', 200, yRes - 8, { color: C.warn, size: 10 });
        // penstock and turbine
        c.fillStyle = kit.hue(205, 0.25); c.beginPath(); c.moveTo(xs + w, 240); c.lineTo(690, 262); c.lineTo(690, 272); c.lineTo(xs + w, 250); c.closePath(); c.fill();
        polyline(c, [[xs + w, 240], [690, 262]], C.text, 1.6); polyline(c, [[xs + w, 250], [690, 272]], C.text, 1.6);
        const open = QT(s.t) / s.Q0;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(708, 266, 12, 0, Math.PI * 2); c.stroke();
        c.fillStyle = open > 0.01 ? C.ok : C.bad; c.beginPath(); c.arc(708, 266, 5, 0, Math.PI * 2); c.fill();
        kit.label(c, 'turbines ' + (open * 100).toFixed(0) + ' %', 708, 244, { color: C.text, size: 10, weight: 700 });
        kit.label(c, 'penstock', 630, 240, { color: C.muted, size: 10 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a cylinder on an oil spring */
  Hyper.sim('dyn-oil-spring', {
    title: 'A cylinder on an oil spring',
    blurb: `A double-acting cylinder with its valve centred: oil is trapped on both sides of the piston, and the load on the rod sits on two oil springs. The curve above the cylinder is the hydraulic natural frequency at every point of the stroke, lined up with the piston. Press a button and the response is computed with the chamber pressures (compressibility, cavitation, optional relief valves) and played back in slow motion — the movement is magnified to be visible; the graphs show it in real time units.

**Try this**
- Knock the load at mid-stroke, then near either end: the ringing is fastest near the ends and slowest a little past the middle.
- Double the mass: the frequency falls by √2. Add oil in the lines (long hoses): it falls again. Lower β to 0.8 GPa (air in the oil, soft hoses): lower still.
- Stop the load from 0.3 m/s: the rod-side pressure spikes while the cap side falls — usually to vapour pressure, where it cavitates and stops helping; the spike then approaches v√(k₂m)/A₂, with k₂ the rod side's own stiffness. Tick the relief valves: the spike is cut at 120 bar and make-up checks refill the other side from the tank.
- Apply the step load and read the static deflection F/k — a few hundredths of a millimetre: hydraulic stiffness is high, but it is not infinite.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 290 });
      const pb = plotBox(box);
      const plotX = kit.plot(pb, { x: { label: 'time (ms)' }, y: { label: 'rod movement (mm)' } }, 130);
      const plotP = kit.plot(pb, { x: { label: 'time (ms)' }, y: { label: 'pressure (bar, gauge)' }, legend: true }, 150);
      const SIZES = { 40: [0.040, 0.022], 63: [0.063, 0.036], 100: [0.100, 0.056], 160: [0.160, 0.090] };
      let kind = 'knock';
      const ctl = kit.controls(box.side, [
        { id: 'size', type: 'select', label: 'Cylinder bore × rod', options: [['40 × 22 mm', '40'], ['63 × 36 mm', '63'], ['100 × 56 mm', '100'], ['160 × 90 mm', '160']], value: '63' },
        { id: 'stroke', label: 'Stroke', min: 100, max: 2000, step: 50, value: 500, unit: 'mm' },
        { id: 'pos', label: 'Piston position (fraction of stroke)', min: 0.02, max: 0.98, step: 0.01, value: 0.5 },
        { id: 'm', label: 'Moving mass', min: 10, max: 20000, value: 1000, unit: 'kg', log: true, sig: 2 },
        { id: 'beta', label: 'Effective bulk modulus β', min: 0.5, max: 1.8, step: 0.05, value: 1.4, unit: 'GPa' },
        { id: 'Vl', label: 'Oil in each line', min: 0, max: 3, step: 0.05, value: 0.3, unit: 'L' },
        { id: 'zeta', label: 'Damping ratio ζ (friction, leakage)', min: 0.02, max: 0.4, step: 0.01, value: 0.06 },
        { id: 'rv', type: 'check', label: 'Relief valves at 120 bar with make-up checks', value: false },
        { type: 'buttons', items: [{ id: 'knock', label: 'Knock' }, { id: 'step', label: 'Step load' }, { id: 'stop', label: 'Stop from 0.3 m/s', primary: true }] }
      ], id => { if (id === 'knock' || id === 'step' || id === 'stop') kind = id; run(); });
      const ro = kit.readout(box.side, [['V', 'Oil volumes V₁ / V₂'], ['k', 'Stiffness k'], ['f', 'Natural frequency f_h'], ['fmin', 'Softest point of the stroke'], ['ev', 'This event'], ['pk', 'Pressures: cap side / rod side']]);
      const V = ctl.values;
      const pv = -0.99e5, pset = 120e5, Kr = 1e-9, Km = 3e-8;  // vapour pressure (gauge), relief setting, relief and make-up gains (m³/s per Pa)
      let g = null, res = null, play = 0, plotT = 0;
      function geom(pos) {
        const [Db, dr] = SIZES[V.size] || SIZES['63'];
        const A1 = Math.PI * Db * Db / 4, A2 = A1 - Math.PI * dr * dr / 4, s = V.stroke / 1000, beta = V.beta * 1e9, Vl = V.Vl * 1e-3 + 2e-5;
        const V1 = A1 * s * pos + Vl, V2 = A2 * s * (1 - pos) + Vl, k = beta * (A1 * A1 / V1 + A2 * A2 / V2);
        return { A1, A2, s, beta, Vl, V1, V2, k, fh: Math.sqrt(k / V.m) / (2 * Math.PI) };
      }
      function run() {
        g = geom(V.pos);
        const { A1, A2, beta } = g, m = V.m, c = 2 * V.zeta * Math.sqrt(g.k * m), rv = V.rv;
        const p20 = 50e5, p10 = p20 * A2 / A1;                  // trapped pressures in balance
        const Fs = 15e5 * A1;                                    // the step load: 15 bar's worth on the piston
        const Twin = clamp(12 / g.fh, 0.04, 3), dt = Math.min(2e-5, 1 / (g.fh * 400)), n = Math.ceil(Twin / dt), every = Math.max(1, Math.ceil(n / 700));
        let x = 0, v = kind === 'knock' ? 0.02 : kind === 'stop' ? 0.3 : 0, p1 = p10, p2 = p20, c1 = 0, c2 = 0;
        const chamber = (p, cav, dV, Vol) => {
          if (cav > 0) {
            cav += dV;
            if (cav > 0) {
              if (!rv) return [pv, cav];
              cav = Math.max(0, cav - Km * (0 - pv) * dt);       // the make-up check refills the cavity from the tank
              if (cav > 0) return [pv, cav];
              p = pv;
            } else { p = pv - beta * cav / Vol; cav = 0; }
          } else p -= beta * dV / Vol;
          if (rv) {
            if (p > pset) p = pset + (p - pset) / (1 + beta * Kr * dt / Vol);
            else if (p < 0) p = p / (1 + beta * Km * dt / Vol);
          }
          if (p < pv) { cav = (pv - p) * Vol / beta; p = pv; }
          return [p, cav];
        };
        const out = { t: [], x: [], p1: [], p2: [], p1max: p10, p2max: p20, p1min: p10, p2min: p20, xmax: 0, cav: false, Fs, Twin };
        for (let i = 0; i <= n; i++) {
          if (i % every === 0) { out.t.push(i * dt * 1000); out.x.push(x * 1000); out.p1.push(p1 / 1e5); out.p2.push(p2 / 1e5); }
          const Fext = kind === 'step' ? Fs : 0;
          const acc = (p1 * A1 - p2 * A2 + Fext - c * v) / m;
          v += acc * dt;
          const dx = v * dt; x += dx;
          [p1, c1] = chamber(p1, c1, A1 * dx, g.V1 + A1 * x);
          [p2, c2] = chamber(p2, c2, -A2 * dx, g.V2 - A2 * x);
          if (c1 > 0 || c2 > 0) out.cav = true;
          out.p1max = Math.max(out.p1max, p1); out.p2max = Math.max(out.p2max, p2); out.p1min = Math.min(out.p1min, p1); out.p2min = Math.min(out.p2min, p2);
          out.xmax = Math.max(out.xmax, Math.abs(x));
        }
        res = out; play = 0; plotT = 1;
        // stiffness along the stroke
        const curve = [];
        let fmin = Infinity, pmin = 0.5;
        for (let i = 0; i <= 80; i++) { const pos = 0.01 + 0.98 * i / 80, gg = geom(pos); curve.push([pos, gg.fh]); if (gg.fh < fmin) { fmin = gg.fh; pmin = pos; } }
        g.curve = curve; g.fmin = fmin; g.pmin = pmin;
        plotX.set({ series: [{ pts: out.t.map((t, i) => [t, out.x[i]]), label: 'movement' }], x: { label: 'time (ms)', min: 0, max: Twin * 1000 } });
        const hl = V.rv ? [{ y: pset / 1e5, label: 'relief 120 bar' }] : [];
        hl.push({ y: pv / 1e5, label: 'vapour' });
        plotP.set({ series: [{ pts: out.t.map((t, i) => [t, out.p1[i]]), label: 'cap side p₁' }, { pts: out.t.map((t, i) => [t, out.p2[i]]), label: 'rod side p₂', dash: [5, 4] }], x: { label: 'time (ms)', min: 0, max: Twin * 1000 }, hlines: hl });
        ro.set('V', (g.V1 * 1000).toFixed(2) + ' L / ' + (g.V2 * 1000).toFixed(2) + ' L');
        ro.set('k', (g.k / 1e6).toFixed(1) + ' kN/mm');
        ro.set('f', g.fh.toFixed(1) + ' Hz (period ' + (1000 / g.fh).toFixed(1) + ' ms)');
        ro.set('fmin', fmin.toFixed(1) + ' Hz at ' + (pmin * 100).toFixed(0) + ' % of the stroke');
        ro.set('ev', kind === 'step' ? 'step load ' + (Fs / 1000).toFixed(1) + ' kN: static deflection F/k = ' + (Fs / g.k * 1000).toFixed(3) + ' mm' :
          kind === 'stop' ? 'stop from 0.3 m/s: rod side +' + ((out.p2max - p20) / 1e5).toFixed(0) + ' bar; v√(k₂m)/A₂ = ' + (0.3 * Math.sqrt(beta * A2 * A2 / g.V2 * V.m) / A2 / 1e5).toFixed(0) + ' bar' + (out.cav ? ' · cap side cavitates' : '') :
          'knock (20 mm/s): largest movement ' + (out.xmax * 1000).toFixed(3) + ' mm');
        ro.set('pk', (out.p1min / 1e5).toFixed(0) + '…' + (out.p1max / 1e5).toFixed(0) + ' / ' + (out.p2min / 1e5).toFixed(0) + '…' + (out.p2max / 1e5).toFixed(0) + ' bar');
      }
      run();
      const colP = (p, C) => p <= pv + 1e3 ? kit.hue(215, 0.35) : kit.hue(0, clamp(0.08 + p / 300e5 * 0.6, 0.08, 0.7));
      const loop = kit.loop(dt => {
        const C = kit.colors(), n = res.t.length;
        play += dt;
        const T = 6, frac = (play % (T + 1)) / T, idx = Math.min(n - 1, Math.floor(clamp(frac, 0, 1) * (n - 1)));
        plotT += dt;
        if (plotT > 0.1) { plotT = 0; plotX.set({ vlines: [{ x: res.t[idx] }] }); }
        const c = st.begin();
        fit(st, c, 760, 300);
        // natural frequency along the stroke, lined up with the piston
        const cx = 70, len = 420, xp = pos => cx + 4 + pos * (len - 15) + 3.5;
        const fmax = Math.max(...g.curve.map(p => p[1])), yc = f => 64 - 48 * f / fmax;
        polyline(c, [[xp(0), 64], [xp(1), 64]], C.grid, 1);
        polyline(c, g.curve.map(p => [xp(p[0]), yc(p[1])]), C.accent, 2);
        kit.dot(c, xp(V.pos), yc(g.fh), 4, C.accent);
        kit.label(c, 'f_h = ' + g.fh.toFixed(1) + ' Hz', xp(V.pos) + 8, yc(g.fh) - 8, { color: C.text, size: 11, weight: 700, align: 'left' });
        kit.label(c, 'softest ' + g.fmin.toFixed(1) + ' Hz', xp(g.pmin), 74, { color: C.muted, size: 10 });
        kit.label(c, 'natural frequency along the stroke', cx, 8, { color: C.muted, size: 10, align: 'left' });
        // the cylinder, the load, the magnified movement
        const [Db] = SIZES[V.size] || SIZES['63'], h = 26 + 40 * Db / 0.16, yCy = 128;
        const mag = res.xmax > 0 ? 12 / (res.xmax * 1000) : 0, off = res.x[idx] * mag;   // drawn px per mm of real movement
        const pos = clamp(V.pos + off / (len - 15), 0, 1);
        const p1 = res.p1[idx] * 1e5, p2 = res.p2[idx] * 1e5;
        const cy = kit.fsym.cylinder(c, cx, yCy, { len, h, pos, rodLen: 70, fillA: colP(p1, C), fillB: colP(p2, C) });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(cy.tip[0], yCy - 24, 60, 48); c.strokeRect(cy.tip[0], yCy - 24, 60, 48);
        kit.label(c, (V.m >= 1000 ? (V.m / 1000).toFixed(V.m >= 10000 ? 0 : 1) + ' t' : V.m.toFixed(0) + ' kg'), cy.tip[0] + 30, yCy, { color: C.text, size: 11, weight: 700 });
        if (kind === 'step') kit.arrow(c, cy.tip[0] + 110, yCy, cy.tip[0] + 64, yCy, C.warn, 2.5);
        if (kind === 'stop' && idx < 2) kit.arrow(c, cy.tip[0] + 64, yCy - 32, cy.tip[0] + 110, yCy - 32, C.ok, 2.5);
        kit.label(c, (p1 / 1e5).toFixed(0) + ' bar', cx + 30, yCy - h / 2 - 10, { color: C.text, size: 11, weight: 700 });
        kit.label(c, (p2 / 1e5).toFixed(0) + ' bar', cx + len - 40, yCy - h / 2 - 10, { color: C.text, size: 11, weight: 700 });
        if (mag > 0) kit.label(c, 'movement magnified ×' + Math.round(mag / ((len - 15) / V.stroke)), cx + len + 70, yCy + 40, { color: C.muted, size: 10, align: 'left' });
        // the centred valve blocks A and B
        const vv = S.valve(c, 300, 262, { spec: '4/3 closed', state: 1, left: 'spring+solenoid', right: 'spring+solenoid', s: 26, labels: true });
        const lineA = [cy.A, [cy.A[0], 212], [vv.A[0], 212], vv.A], lineB = [cy.B, [cy.B[0], 222], [vv.B[0], 222], vv.B];
        S.line(c, lineA, { state: p1 > 2e5 ? 'metered' : 'idle' });
        S.line(c, lineB, { state: p2 > 2e5 ? 'metered' : 'idle' });
        S.line(c, [vv.P, [vv.P[0], vv.P[1] + 8]], { state: 'idle' }); S.plug(c, vv.P[0], vv.P[1] + 8);
        S.line(c, [vv.T, [vv.T[0], vv.T[1] + 8]], { state: 'idle' }); S.plug(c, vv.T[0], vv.T[1] + 8);
        kit.label(c, 'line ' + V.Vl.toFixed(2) + ' L', cy.A[0] + 6, 200, { color: C.muted, size: 10, align: 'left' });
        kit.label(c, 'line ' + V.Vl.toFixed(2) + ' L', cy.B[0] - 6, 200, { color: C.muted, size: 10, align: 'right' });
        kit.label(c, 'valve centred: A and B blocked' + (V.rv ? ' · relief 120 bar + make-up checks on both lines' : ''), 360, 292, { color: C.muted, size: 10, align: 'left' });
        kit.label(c, 't = ' + res.t[idx].toFixed(1) + ' ms', 752, 10, { color: C.text, size: 12, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a closed-loop position servo */
  Hyper.sim('dyn-servo', {
    title: 'A closed-loop position axis',
    blurb: `A double-rod cylinder (50/28 mm, 200 mm stroke) moves a mass under position control. The controller compares the set point with the measured position and opens the valve in proportion to the error (gain K_v, in 1/s); the valve has its own dynamics, the oil in the cylinder and lines is a spring, and the supply is 140 bar. Everything runs in real time with the full nonlinear flows. The read-outs give the hydraulic natural frequency, the stability limit 2ζω_h, and the limit with this valve's lag, from the frequency response.

**Try this**
- Raise K_v slowly on the steps: the response gets quicker, then overshoots and rings at f_h, then goes unstable and keeps oscillating by itself.
- Halve the line volume or the mass: f_h rises, and so does the gain you can use.
- Switch to the proportional valve (15 Hz) and compare the two limits: the valve's lag now shapes the loop. Raise the damping to 0.4 — the oil spring would allow about 140 1/s, but the valve only about 74 1/s: the valve is now the weak link.
- Follow the trapezoidal moves and read the following error, v/K_v. Tick velocity feed-forward: the error almost vanishes without raising the gain.
- Push the load: the axis holds its position against the force, with only a small, brief deflection.`,
    mount(box, kit, params) {
      const P = params || {}, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230 });
      const pb = plotBox(box);
      const plotX = kit.plot(pb, { x: { label: 'time (s)' }, y: { label: 'position (mm)' }, legend: true }, 150);
      const plotE = kit.plot(pb, { x: { label: 'time (s)' }, y: { label: 'error (mm)' } }, 120);
      const VALVES = { servo: { f: 150, name: 'servo valve' }, sp: { f: 60, name: 'servo-proportional valve' }, prop: { f: 15, name: 'proportional valve' } };
      const ctl = kit.controls(box.side, [
        { id: 'Kv', label: 'Loop gain K_v', min: 2, max: 150, value: P.Kv || 20, unit: '1/s', log: true, sig: 2 },
        { id: 'valve', type: 'select', label: 'Valve', options: [['Servo valve (about 150 Hz)', 'servo'], ['Servo-proportional (about 60 Hz)', 'sp'], ['Proportional valve (about 15 Hz)', 'prop']], value: VALVES[P.valve] ? P.valve : 'sp' },
        { id: 'm', label: 'Moving mass', min: 50, max: 5000, value: 500, unit: 'kg', log: true, sig: 2 },
        { id: 'Vl', label: 'Oil in each line', min: 0.02, max: 3, value: 0.2, unit: 'L', log: true, sig: 2 },
        { id: 'zeta', label: 'Hydraulic damping ζ_h', min: 0.03, max: 0.5, step: 0.01, value: 0.15 },
        { id: 'cmd', type: 'select', label: 'Set point', options: [['Steps of 20 mm', 'step'], ['Trapezoidal moves of 60 mm', 'ramp'], ['Sine, ±20 mm at 1 Hz', 'sine']], value: 'step' },
        { id: 'ff', type: 'check', label: 'Velocity feed-forward', value: false },
        { type: 'buttons', items: [{ id: 'push', label: 'Push the load (2 kN)' }, { id: 'reset', label: 'Reset' }] }
      ], id => { if (id === 'push') s.push = 0.5; else if (id === 'reset') reset(); else analyse(); });
      const ro = kit.readout(box.side, [['fh', 'Hydraulic natural frequency f_h'], ['lim', 'Limit 2ζω_h / with this valve'], ['kv', 'K_v · valve fully open at'], ['ver', 'Verdict'], ['err', 'Error now / valve opening'], ['p', 'Chamber pressures']]);
      const V = ctl.values;
      // the axis
      const D = 0.05, d = 0.028, A = Math.PI * (D * D - d * d) / 4, half = 0.1, ps = 140e5, beta = 1.4e9;
      const QN = 40 / 60000, Kq = QN / Math.sqrt(35e5), DL = 1e5;   // rated 40 L/min at 35 bar per land
      const vmax0 = Kq * Math.sqrt(ps / 2) / A;                     // no-load speed at full opening
      const orf = (pa, pb, open) => { if (open <= 0) return 0; const dd = pa - pb, ad = Math.abs(dd); return Kq * open * (ad < DL ? dd / Math.sqrt(DL) : Math.sign(dd) * Math.sqrt(ad)); };
      let s = null, a = null, plotT = 0;
      function analyse() {
        const Vh = A * half + V.Vl * 1e-3, k = 2 * beta * A * A / Vh, wh = Math.sqrt(k / V.m), wv = 2 * Math.PI * (VALVES[V.valve] || VALVES.sp).f;
        // gain margin from the open-loop frequency response K_v/(jω) · G_h(jω) · G_v(jω)
        let gm = Infinity, w180 = 0;
        const den = (w, wn, z) => [1 - (w / wn) * (w / wn), 2 * z * w / wn];
        for (let i = 0; i <= 4000; i++) {
          const w = Math.pow(10, -1 + 5 * i / 4000), h = den(w, wh, V.zeta), vv = den(w, wv, 0.7);
          const ph = -Math.PI / 2 - Math.atan2(h[1], h[0]) - Math.atan2(vv[1], vv[0]);
          if (ph <= -Math.PI) { const mag = V.Kv / w / Math.hypot(h[0], h[1]) / Math.hypot(vv[0], vv[1]); gm = 1 / mag; w180 = w; break; }
        }
        a = { k, wh, wv, fh: wh / (2 * Math.PI), lim0: 2 * V.zeta * wh, limV: V.Kv * gm, gm, w180, b: 2 * V.zeta * Math.sqrt(k * V.m) };
        const ver = gm > 2.5 ? 'stable, well damped' : gm > 1.25 ? 'stable, but it rings' : gm > 1 ? 'barely stable: long ringing' : 'unstable — it keeps oscillating by itself';
        ro.set('fh', a.fh.toFixed(1) + ' Hz (ω_h = ' + wh.toFixed(0) + ' rad/s)');
        ro.set('lim', a.lim0.toFixed(1) + ' / ' + a.limV.toFixed(1) + ' 1/s');
        ro.set('kv', V.Kv.toFixed(1) + ' 1/s · error of ' + (vmax0 / V.Kv * 1000).toFixed(1) + ' mm');
        ro.set('ver', ver + ' (gain margin ' + (gm === Infinity ? '∞' : gm.toFixed(2)) + ')');
      }
      function reset() { s = { t: 0, x: 0, v: 0, p1: ps / 2, p2: ps / 2, xv: 0, dxv: 0, hist: [], push: 0, next: 0, u: 0 }; analyse(); }
      function ref(t) {
        if (V.cmd === 'sine') { const w = 2 * Math.PI; return [0.02 * Math.sin(w * t), 0.02 * w * Math.cos(w * t)]; }
        const T = 3, tt = t % T;
        if (V.cmd === 'ramp') {
          const Dm = 0.06, Tm = 0.6, ta = 0.1, vm = Dm / (Tm - ta), am = vm / ta;
          const prof = u => u <= 0 ? [0, 0] : u < ta ? [0.5 * am * u * u, am * u] : u < Tm - ta ? [0.5 * am * ta * ta + vm * (u - ta), vm] : u < Tm ? [Dm - 0.5 * am * (Tm - u) * (Tm - u), am * (Tm - u)] : [Dm, 0];
          if (tt < 1.5) { const p = prof(tt); return [-0.03 + p[0], p[1]]; }
          const p = prof(tt - 1.5); return [0.03 - p[0], -p[1]];
        }
        return [tt < 1.5 ? 0.01 : -0.01, 0];
      }
      function step(h) {
        const [xr, vr] = ref(s.t);
        const Kp = V.Kv / vmax0;
        s.u = clamp(Kp * (xr - s.x) + (V.ff ? vr / vmax0 : 0), -1, 1);
        // the valve spool: second order, damping 0.7
        const wv = a.wv;
        s.dxv += h * (wv * wv * (s.u - s.xv) - 1.4 * wv * s.dxv);
        s.xv = clamp(s.xv + h * s.dxv, -1, 1);
        const up = Math.max(0, s.xv), dn = Math.max(0, -s.xv);
        const Q1 = orf(ps, s.p1, up) - orf(s.p1, 0, dn), Q2 = orf(ps, s.p2, dn) - orf(s.p2, 0, up);
        const Fext = s.push > 0 ? -2000 : 0;
        const acc = ((s.p1 - s.p2) * A - a.b * s.v + Fext) / V.m;
        s.v += h * acc; s.x += h * s.v;
        if (s.x > half) { s.x = half; if (s.v > 0) s.v = 0; }
        if (s.x < -half) { s.x = -half; if (s.v < 0) s.v = 0; }
        const V1 = A * (half + s.x) + V.Vl * 1e-3, V2 = A * (half - s.x) + V.Vl * 1e-3;
        s.p1 = Math.max(-0.99e5, s.p1 + h * beta / V1 * (Q1 - A * s.v));
        s.p2 = Math.max(-0.99e5, s.p2 + h * beta / V2 * (Q2 + A * s.v));
        s.t += h;
        if (s.push > 0) s.push -= h;
        if (s.t >= s.next) { s.next = s.t + 0.002; s.hist.push([s.t, xr * 1000, s.x * 1000]); while (s.hist.length && s.hist[0][0] < s.t - 3) s.hist.shift(); }
      }
      reset();
      const colState = (inflow) => inflow ? 'pressure' : 'return';
      const phase = { a: 0, b: 0 };
      const loop = kit.loop(dt => {
        const h = 1e-5, n = Math.round(dt / h);
        for (let i = 0; i < n; i++) step(h);
        const C = kit.colors();
        plotT += dt;
        if (plotT > 0.05 && s.hist.length > 1) {
          plotT = 0;
          const t1 = s.t, t0 = t1 - 3;
          plotX.set({ x: { label: 'time (s)', min: t0, max: t1 }, y: { label: 'position (mm)', min: -40, max: 40 }, series: [{ pts: s.hist.map(p => [p[0], p[1]]), label: 'set point', dash: [5, 4] }, { pts: s.hist.map(p => [p[0], p[2]]), label: 'position' }] });
          plotE.set({ x: { label: 'time (s)', min: t0, max: t1 }, series: [{ pts: s.hist.map(p => [p[0], p[1] - p[2]]), label: 'error' }] });
        }
        const err = (ref(s.t)[0] - s.x) * 1000;
        ro.set('err', f2(err, 2) + ' mm / ' + (s.xv * 100).toFixed(0) + ' %');
        ro.set('p', (s.p1 / 1e5).toFixed(0) + ' / ' + (s.p2 / 1e5).toFixed(0) + ' bar');
        // drawing on a 760 × 260 grid
        const c = st.begin();
        fit(st, c, 760, 260);
        const cyx = 300, cyy = 70, len = 220;
        const fill = p => kit.hue(0, clamp(0.1 + p / ps * 0.5, 0.1, 0.6));
        const cy = S.cylinder(c, cyx, cyy, { len, h: 34, pos: 0.5 + s.x / (2 * half), through: true, rodLen: 50, fillA: fill(s.p1), fillB: fill(s.p2) });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(cy.tip[0], cyy - 22, 56, 44); c.strokeRect(cy.tip[0], cyy - 22, 56, 44);
        kit.label(c, V.m.toFixed(0) + ' kg', cy.tip[0] + 28, cyy, { color: C.text, size: 11, weight: 700 });
        if (s.push > 0) kit.arrow(c, cy.tip[0] + 110, cyy, cy.tip[0] + 60, cyy, C.warn, 3);
        // position sensor and the feedback signal
        c.strokeStyle = C.accent; c.lineWidth = 1.4; c.strokeRect(cy.tip[0] + 18, 12, 20, 14);
        kit.label(c, 'x', cy.tip[0] + 28, 19, { color: C.accent, size: 10, weight: 700 });
        polyline(c, [[cy.tip[0] + 28, 26], [cy.tip[0] + 28, cyy - 22]], C.accent, 1.2, [3, 3]);
        polyline(c, [[cy.tip[0] + 18, 19], [70, 19], [70, 163]], C.accent, 1.4);
        kit.label(c, 'position sensor', cy.tip[0] + 44, 19, { color: C.muted, size: 10, align: 'left' });
        // the controller
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.arc(70, 175, 12, 0, Math.PI * 2); c.stroke();
        kit.label(c, 'Σ', 70, 175, { color: C.text, size: 12, weight: 700 });
        kit.arrow(c, 14, 175, 57, 175, C.accent, 1.6);
        kit.label(c, 'x_ref', 18, 162, { color: C.muted, size: 10, align: 'left' });
        kit.label(c, '+', 50, 166, { color: C.text, size: 11 }); kit.label(c, '−', 80, 156, { color: C.text, size: 12 });
        kit.arrow(c, 70, 150, 70, 162, C.accent, 1.4);
        c.strokeRect(110, 160, 52, 30); kit.label(c, 'K_p', 136, 175, { color: C.text, size: 12, weight: 700 });
        kit.arrow(c, 82, 175, 109, 175, C.accent, 1.6);
        // the valve, shifted by its spool position
        const vv = S.valve(c, 420, 190, { spec: '4/3 closed', state: 1 - s.xv, left: 'spring+prop', right: 'spring+prop', s: 28, labels: true });
        polyline(c, [[162, 175], [vv.xl - 4, 175], [vv.xl - 4, 190]], C.accent, 1.4);
        kit.label(c, 'u = ' + (s.u * 100).toFixed(0) + ' %', 200, 164, { color: C.muted, size: 10 });
        kit.label(c, (VALVES[V.valve] || VALVES.sp).name, vv.xr + 10, 204, { color: C.muted, size: 10, align: 'left' });
        const src = S.source(c, vv.P[0], vv.P[1] + 22), tk = S.tank(c, vv.T[0] + 22, vv.T[1] + 14);
        S.line(c, [vv.P, src.P], { state: 'pressure' });
        S.line(c, [vv.T, [vv.T[0], vv.T[1] + 4], [tk.T[0], vv.T[1] + 4], tk.T], { state: Math.abs(s.xv) > 0.02 ? 'return' : 'idle' });
        const moving = Math.abs(s.xv) > 0.02;
        const pa = [cy.A, [cy.A[0], 130], [vv.A[0], 130], vv.A], pbl = [cy.B, [cy.B[0], 142], [vv.B[0], 142], vv.B];
        S.line(c, pa, { state: moving ? colState(s.xv > 0) : 'metered' });
        S.line(c, pbl, { state: moving ? colState(s.xv < 0) : 'metered' });
        if (moving) {
          const q = Math.abs(s.v * A) / (vmax0 * A);
          phase.a += dt * 120 * q; phase.b += dt * 120 * q;
          S.flow(c, s.xv > 0 ? pa.slice().reverse() : pa, phase.a, { color: S.col(s.xv > 0 ? 'pressure' : 'return') });
          S.flow(c, s.xv < 0 ? pbl.slice().reverse() : pbl, phase.b, { color: S.col(s.xv < 0 ? 'pressure' : 'return') });
        }
        kit.label(c, (s.p1 / 1e5).toFixed(0) + ' bar', cy.A[0] - 6, 118, { color: C.text, size: 10, align: 'right' });
        kit.label(c, (s.p2 / 1e5).toFixed(0) + ' bar', cy.B[0] + 6, 118, { color: C.text, size: 10, align: 'left' });
        kit.label(c, 'supply 140 bar', src.P[0] - 14, src.P[1] + 20, { color: C.muted, size: 10, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ valve sizing for a move */
  Hyper.sim('dyn-profile', {
    title: 'Sizing a valve for a move',
    blurb: `A double-rod cylinder moves a mass out and back on trapezoidal profiles against an external force (it opposes the outward move and helps the return). For every instant the page works out the speed, the load pressure p_L = (ma + F)/A, what is left of the supply across the valve, and the valve's rated flow that this requires; the worst instant sizes the valve. The bars show how the supply is shared between the load and the valve as the axis runs.

**Try this**
- Shorten the ramps: the peak speed falls a little, but the acceleration and the load pressure jump — watch the needed rated flow.
- Raise the external force until the load pressure passes ⅔ of the supply: the check turns red, although the axis could still just move.
- On the return the force helps: the load pressure goes negative while braking and the valve's drop exceeds the supply pressure. Make the force large and the move fast to see the inlet reach cavitation.
- Switch between a servo valve rated at 70 bar and a proportional valve rated at 10 bar: the same flow needs a far smaller "rated" size at 10 bar.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 220 });
      const pb = plotBox(box);
      const plotV = kit.plot(pb, { x: { label: 'time (s)' }, y: { label: 'speed (mm/s)' }, legend: true }, 140);
      const plotP = kit.plot(pb, { x: { label: 'time (s)' }, y: { label: 'pressure (bar)' }, legend: true }, 170);
      const CYL = { 50: [0.050, 0.028], 63: [0.063, 0.036], 80: [0.080, 0.045], 100: [0.100, 0.056], 125: [0.125, 0.070] };
      const SIZES = [5, 10, 20, 32, 40, 63, 80, 100, 125, 160, 200, 250, 320, 400, 630, 1000];
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Moving mass', min: 50, max: 10000, value: 800, unit: 'kg', log: true, sig: 2 },
        { id: 's', label: 'Distance of the move', min: 50, max: 1000, step: 10, value: 300, unit: 'mm' },
        { id: 'T', label: 'Time for the move', min: 0.2, max: 3, step: 0.05, value: 0.8, unit: 's' },
        { id: 'ta', label: 'Ramp time at each end', min: 0.02, max: 1, step: 0.01, value: 0.15, unit: 's' },
        { id: 'F', label: 'External force against extension', min: -30, max: 60, step: 1, value: 15, unit: 'kN' },
        { id: 'cyl', type: 'select', label: 'Double-rod cylinder', options: [['50/28 mm (13.5 cm²)', 50], ['63/36 mm (21.0 cm²)', 63], ['80/45 mm (34.4 cm²)', 80], ['100/56 mm (53.9 cm²)', 100], ['125/70 mm (84.2 cm²)', 125]], value: 80 },
        { id: 'ps', label: 'Supply pressure', min: 50, max: 315, step: 5, value: 140, unit: 'bar' },
        { id: 'vt', type: 'select', label: 'Valve rating', options: [['Servo / servo-proportional (Δp_N = 70 bar)', 70], ['Proportional (Δp_N = 10 bar)', 10]], value: 70 }
      ], () => compute());
      const ro = kit.readout(box.side, [['v', 'Peak speed / acceleration'], ['q', 'Peak flow'], ['pl', 'Load pressure: highest / lowest'], ['qn', 'Rated flow needed'], ['sug', 'A valve that fits'], ['fh', 'f_h at mid-stroke · ramp length'], ['ver', 'Checks']]);
      const V = ctl.values;
      let R = null, tt = 0;
      function compute() {
        const [Db, dr] = CYL[V.cyl] || CYL[80];
        const A = Math.PI * (Db * Db - dr * dr) / 4, s = V.s / 1000, T = V.T, ta = Math.min(V.ta, T / 2), m = V.m, F = V.F * 1000, ps = V.ps * 1e5, dpN = +V.vt * 1e5, Ff = 500;
        const vmax = s / (T - ta), am = vmax / ta, dwell = 0.4, period = 2 * T + 2 * dwell;
        const pts = [];
        let qnMax = 0, tWorst = 0, pLmax = -Infinity, pLmin = Infinity, qMax = 0, cav = false, over = false;
        for (let i = 0; i <= 600; i++) {
          const t = period * i / 600;
          let dir = 0, u = 0;
          if (t < T) { dir = 1; u = t; } else if (t >= T + dwell && t < 2 * T + dwell) { dir = -1; u = t - T - dwell; }
          let w = 0, acc = 0;
          if (dir) {
            if (u < ta) { w = am * u; acc = am; } else if (u < T - ta) { w = vmax; acc = 0; } else { w = am * (T - u); acc = -am; }
          }
          const pL = dir ? (m * acc + dir * F + Ff) / A : 0, dpv = ps - pL, Q = w * A;
          const qn = dir && Q > 0 ? (dpv > 0 ? Q * Math.sqrt(dpN / dpv) : Infinity) : 0;
          if (dir) { pLmax = Math.max(pLmax, pL); pLmin = Math.min(pLmin, pL); if (pL > ps) over = true; if (pL < -ps) cav = true; }
          if (qn > qnMax) { qnMax = qn; tWorst = t; }
          qMax = Math.max(qMax, Q);
          pts.push({ t, dir, w, acc, pL, dpv, Q, qn });
        }
        // natural frequency at mid-stroke (β = 1.4 GPa, 0.2 L of line each side, 50 mm of dead stroke)
        const Vh = A * (s / 2 + 0.05) + 0.2e-3, k = 2 * 1.4e9 * A * A / Vh, fh = Math.sqrt(k / m) / (2 * Math.PI);
        const need = qnMax * 60000 * 1.1, pick = SIZES.find(x => x >= need);
        R = { A, s, T, ta, vmax, am, period, pts, qnMax, tWorst, pLmax, pLmin, qMax, cav, over, fh, pick, ps, dpN, dwell };
        plotV.set({ x: { label: 'time (s)', min: 0, max: period }, series: [{ pts: pts.map(p => [p.t, p.dir * p.w * 1000]), label: 'speed' }] });
        const hl = [{ y: V.ps, label: 'supply p_s' }, { y: V.ps * 2 / 3, label: '⅔ p_s' }];
        if (pLmin < -0.5 * ps) hl.push({ y: -V.ps, label: '−p_s: cavitation' });
        plotP.set({
          x: { label: 'time (s)', min: 0, max: period },
          series: [{ pts: pts.map(p => [p.t, p.dir ? p.pL / 1e5 : 0]), label: 'load pressure p_L' }, { pts: pts.map(p => [p.t, p.dir ? p.dpv / 1e5 : 0]), label: 'valve drop p_s − p_L', dash: [5, 4] }],
          hlines: hl, vlines: [{ x: tWorst, label: 'sizes the valve' }]
        });
        ro.set('v', (vmax * 1000).toFixed(0) + ' mm/s / ' + am.toFixed(2) + ' m/s²');
        ro.set('q', (qMax * 60000).toFixed(1) + ' L/min');
        ro.set('pl', (pLmax / 1e5).toFixed(1) + ' / ' + (pLmin / 1e5).toFixed(1) + ' bar');
        ro.set('qn', isFinite(qnMax) ? (qnMax * 60000).toFixed(1) + ' L/min at ' + V.vt + ' bar' : 'none will do: the load needs more than the supply');
        ro.set('sug', isFinite(qnMax) ? (pick ? pick + ' L/min (with 10 % reserve)' : 'over 1000 L/min: use a larger valve family or two valves') : '—');
        ro.set('fh', fh.toFixed(1) + ' Hz · a ramp of ' + (ta * fh).toFixed(1) + ' periods');
        const notes = [];
        if (over) notes.push('✗ the load needs more than the supply pressure');
        else if (pLmax > ps * 2 / 3) notes.push('✗ p_L above ⅔ p_s: little left to control with');
        else notes.push('✓ p_L within ⅔ p_s');
        if (cav) notes.push('✗ braking below −p_s: the inlet side cavitates');
        if (ta * fh < 3) notes.push('! ramps shorter than 3 periods of f_h: expect ringing');
        ro.set('ver', notes.join(' · '));
      }
      compute();
      const loop = kit.loop(dt => {
        tt = (tt + dt) % R.period;
        const i = Math.min(R.pts.length - 1, Math.round(tt / R.period * 600)), p = R.pts[i], C = kit.colors();
        // position along the cycle
        let x = 0;
        for (let j = 1; j <= i; j++) x += R.pts[j].dir * R.pts[j].w * (R.period / 600);
        const pos = clamp(x / R.s, 0, 1);
        const c = st.begin();
        fit(st, c, 760, 230);
        const cy = S.cylinder(c, 60, 60, { len: 260, h: 34, pos, through: true, rodLen: 50, fillA: p.dir > 0 ? kit.hue(0, 0.35) : null, fillB: p.dir < 0 ? kit.hue(0, 0.35) : null });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(cy.tip[0], 38, 56, 44); c.strokeRect(cy.tip[0], 38, 56, 44);
        kit.label(c, V.m.toFixed(0) + ' kg', cy.tip[0] + 28, 60, { color: C.text, size: 11, weight: 700 });
        if (Math.abs(V.F) > 0.5) { const L = clamp(Math.abs(V.F) * 1.5, 16, 60), sg = V.F > 0 ? -1 : 1; kit.arrow(c, cy.tip[0] + 58 + (sg < 0 ? L + 6 : 6), 60, cy.tip[0] + 58 + (sg < 0 ? 6 : L + 6), 60, C.warn, 2.5); kit.label(c, Math.abs(V.F).toFixed(0) + ' kN', cy.tip[0] + 92, 42, { color: C.warn, size: 10, weight: 700 }); }
        // valve opening needed now, for the valve chosen
        const qnSel = (R.pick || 1000) / 60000;
        const open = p.dir && p.dpv > 0 ? clamp(p.Q / (qnSel * Math.sqrt(p.dpv / R.dpN)), 0, 1) : 0;
        const vv = S.valve(c, 200, 176, { spec: '4/3 closed', state: 1 - p.dir * open, left: 'spring+prop', right: 'spring+prop', s: 26, labels: true });
        const stA = p.dir > 0 ? 'pressure' : p.dir < 0 ? 'return' : 'metered', stB = p.dir < 0 ? 'pressure' : p.dir > 0 ? 'return' : 'metered';
        S.line(c, [cy.A, [cy.A[0], 118], [vv.A[0], 118], vv.A], { state: stA });
        S.line(c, [cy.B, [cy.B[0], 128], [vv.B[0], 128], vv.B], { state: stB });
        S.line(c, [vv.P, [vv.P[0], vv.P[1] + 10]], { state: 'pressure' }); S.line(c, [vv.T, [vv.T[0], vv.T[1] + 10]], { state: 'return' });
        kit.label(c, 'P ' + V.ps + ' bar', vv.P[0] - 4, vv.P[1] + 18, { color: C.muted, size: 10, align: 'right' });
        kit.label(c, 'valve ' + (R.pick || '>1000') + ' L/min · opening ' + (open * 100).toFixed(0) + ' %', 290, 176, { color: C.text, size: 11, align: 'left' });
        // how the supply is shared: load pressure and valve drop
        const bx = 560, y0 = 150, sc = 110 / Math.max(V.ps, R.pLmax / 1e5, V.ps - R.pLmin / 1e5), pL = p.dir ? p.pL / 1e5 : 0, dv = p.dir ? p.dpv / 1e5 : 0;
        polyline(c, [[bx - 10, y0], [bx + 150, y0]], C.muted, 1);
        polyline(c, [[bx - 10, y0 - V.ps * sc], [bx + 150, y0 - V.ps * sc]], C.bad, 1, [4, 4]);
        polyline(c, [[bx - 10, y0 - V.ps * 2 / 3 * sc], [bx + 150, y0 - V.ps * 2 / 3 * sc]], C.warn, 1, [2, 3]);
        c.fillStyle = kit.hue(0, 0.55); c.fillRect(bx + 10, pL >= 0 ? y0 - pL * sc : y0, 40, Math.abs(pL) * sc);
        c.fillStyle = kit.hue(40, 0.55); c.fillRect(bx + 80, y0 - dv * sc, 40, dv * sc);
        kit.label(c, 'p_L ' + pL.toFixed(0) + ' bar', bx + 30, y0 + 12 + (pL < 0 ? Math.abs(pL) * sc : 0), { color: C.text, size: 10 });
        kit.label(c, 'valve ' + dv.toFixed(0) + ' bar', bx + 100, y0 + 12, { color: C.text, size: 10 });
        kit.label(c, 'p_s', bx + 152, y0 - V.ps * sc, { color: C.bad, size: 10, align: 'left' });
        kit.label(c, '⅔ p_s', bx + 152, y0 - V.ps * 2 / 3 * sc, { color: C.warn, size: 10, align: 'left' });
        kit.label(c, p.dir > 0 ? 'extending' : p.dir < 0 ? 'retracting' : 'waiting', 60, 12, { color: C.text, size: 12, weight: 700, align: 'left' });
        kit.label(c, (p.w * 1000).toFixed(0) + ' mm/s · ' + (p.acc > 0 ? 'accelerating' : p.acc < 0 ? 'braking' : p.dir ? 'constant speed' : ''), 60, 28, { color: C.muted, size: 11, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
