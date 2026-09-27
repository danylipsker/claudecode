/* HYPER-HYDRAULICS · sims/flow.js — simulations for Liquids in Motion (content/flow.js)
 *   flow-continuity  a pipe that narrows and widens again: velocities, standpipes, HGL and EGL, losses, cavitation
 *   flow-hgl         the grade lines of a pipeline over a ridge between two reservoirs: Colebrook friction,
 *                    a pump (with its curve), a valve, siphon sections and column separation
 *   flow-laminar     Reynolds' dye experiment: laminar flow, turbulent puffs, full turbulence; velocity profiles
 *                    and the friction factor
 *   flow-jet         a jet on a splitter vane or on a wheel of buckets: force, power, efficiency and the
 *                    velocity triangle at the exit, against the vane speed
 *   flow-bend        pressure and momentum thrust on a pipe bend and the thrust block that holds it
 *   flow-tank        a tank draining through an orifice (Torricelli), with an inflow and the jet's path
 *   flow-venturi     a venturi tube or an orifice plate with a U-tube manometer, and the pressure along the meter
 * Water is at 20 °C throughout unless a sim says otherwise.
 */
(function () {
  'use strict';

  const G = 9.80665, PATM = 101325;
  const WATER = { rho: 998, nu: 1.0e-6, pv: 2339 };               // 20 °C: density, kinematic viscosity, vapour pressure
  const area = d => Math.PI * d * d / 4;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fin = (x, d) => (Number.isFinite(x) ? x : (d || 0));
  const f1 = (v, n) => fin(v).toFixed(n == null ? 1 : n);
  // fit a fixed design grid into the stage
  function frameOf(st, W, H) { const k = Math.min(st.W / W, st.H / H) || 1; return { k, ox: (st.W - W * k) / 2, oy: (st.H - H * k) / 2 }; }
  const waterCol = (C, a) => (C.dark ? 'rgba(90,162,255,' : 'rgba(31,99,214,') + (a == null ? (C.dark ? 0.3 : 0.18) : a) + ')';
  function fmtForce(N) {
    const a = Math.abs(fin(N));
    if (a >= 1e6) return f1(N / 1e6, 2) + ' MN';
    if (a >= 1e3) return f1(N / 1e3, a >= 1e5 ? 0 : a >= 1e4 ? 1 : 2) + ' kN';
    return f1(N, 0) + ' N';
  }
  function fmtPower(W) { const a = Math.abs(fin(W)); return a >= 1e6 ? f1(W / 1e6, 2) + ' MW' : a >= 1e3 ? f1(W / 1e3, a >= 1e5 ? 0 : 1) + ' kW' : f1(W, 0) + ' W'; }
  function fmtFlow(q) { const L = fin(q) * 1000; return (L >= 100 ? f1(L, 0) : L >= 10 ? f1(L, 1) : f1(L, 2)) + ' L/s'; }
  function fmtTime(s) {
    if (!Number.isFinite(s)) return '—';
    if (s < 120) return f1(s, 1) + ' s';
    if (s < 7200) return Math.floor(s / 60) + ' min ' + Math.floor(s % 60) + ' s';
    if (s < 172800) return f1(s / 3600, 1) + ' h';
    return f1(s / 86400, 1) + ' days';
  }
  function niceCeil(v) {
    v = Math.max(fin(v, 1), 1e-9);
    const e = Math.pow(10, Math.floor(Math.log10(v)));
    for (const s of [1, 2, 2.5, 5, 10]) if (s * e >= v - 1e-12) return s * e;
    return 10 * e;
  }
  // a small seeded random source, so the pictures are the same on every visit
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function graphDiv(box) { const d = document.createElement('div'); d.style.padding = '4px 10px 10px'; box.stage.appendChild(d); return d; }
  function polyline(c, pts) { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); }

  /* ================================================================ continuity and pressure along a pipe */
  Hyper.sim('flow-continuity', {
    title: 'Continuity and pressure along a pipe',
    blurb: `Water at 20 °C flows through a pipe that narrows to a throat and widens again (the diameters are drawn enlarged). The dots move at the local mean velocity; the glass standpipes show the pressure head; the solid line is the **hydraulic grade line** (HGL) and the dashed line the **energy grade line** (EGL). The graph below gives the heads along the pipe.

**Try this**
- Halve the throat bore: the water there goes four times faster and the pressure falls — continuity and Bernoulli together.
- Switch the losses off: the EGL runs level and the pressure recovers completely after the throat.
- Choose a sudden change of bore at the outlet: the EGL drops at the step — energy destroyed in eddies — and less pressure is recovered.
- Lower the inlet pressure and raise the flow with a small throat: when the throat reaches the vapour pressure the water boils there, and the flow will not rise any further — the throat chokes.
- Make the outlet narrower than the inlet: the pressure ends lower even without losses, because velocity head was bought with pressure.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'distance along the pipe (m)', min: 0, max: 7 }, y: { label: 'head (m of water)' }, legend: true }, 170);
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Flow', min: 1, max: 60, step: 0.5, value: 15, unit: 'L/s' },
        { id: 'D1', label: 'Inlet bore D₁', min: 50, max: 200, step: 5, value: 100, unit: 'mm' },
        { id: 'D2', label: 'Throat bore D₂', min: 20, max: 200, step: 1, value: 60, unit: 'mm' },
        { id: 'D3', label: 'Outlet bore D₃', min: 40, max: 200, step: 5, value: 100, unit: 'mm' },
        { id: 'p1', label: 'Inlet pressure (gauge)', min: 10, max: 500, step: 5, value: 50, unit: 'kPa' },
        { id: 'exit', type: 'select', label: 'Throat to outlet', options: [['Gradual cone (1 m long)', 'cone'], ['Sudden change of bore', 'sudden']], value: 'cone' },
        { id: 'fric', type: 'check', label: 'Friction and fitting losses', value: true }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['V', 'Velocity V₁ / V₂ / V₃'], ['p', 'Pressure p₁ / p₂ / p₃ (gauge)'], ['hv', 'Velocity head in the throat'], ['loss', 'Head lost, inlet to outlet'], ['Re', 'Reynolds number in the throat'], ['pabs', 'Lowest absolute pressure'], ['anim', 'Dots']]);
      const V = ctl.values;
      const N = 281, LEN = 7, dx = LEN / (N - 1), ROUGH = 2e-5;   // drawn copper-like tube, 0.02 mm
      const idx = x => clamp(Math.round(x / dx), 0, N - 1);
      let M = null;
      function boreAt(x, D1, D2, D3, sudden) {
        if (x < 2) return D1;
        if (x < 2.5) return D1 + (D2 - D1) * (x - 2) / 0.5;
        if (x < 3.5) return D2;
        if (sudden) return D3;
        if (x < 4.5) return D2 + (D3 - D2) * (x - 3.5);
        return D3;
      }
      // heads along the pipe for a flow Q (m³/s)
      function compute(Q) {
        const sudden = V.exit === 'sudden', rho = WATER.rho;
        const D1 = V.D1 / 1000, D2 = V.D2 / 1000, D3 = V.D3 / 1000;
        const Ds = new Float64Array(N), Vs = new Float64Array(N), hv = new Float64Array(N), loss = new Float64Array(N);
        for (let i = 0; i < N; i++) { Ds[i] = boreAt(i * dx, D1, D2, D3, sudden); Vs[i] = Q / area(Ds[i]); hv[i] = Vs[i] * Vs[i] / (2 * G); }
        if (V.fric && Q > 0) {
          for (let i = 1; i < N; i++) {
            const Dm = (Ds[i] + Ds[i - 1]) / 2, vm = Q / area(Dm), f = fin(kit.fluid.friction(vm * Dm / WATER.nu, ROUGH / Dm), 0.02);
            loss[i] = loss[i - 1] + f * dx / Dm * vm * vm / (2 * G);
          }
          // a change of bore: Borda–Carnot for a sudden enlargement, Gibson's cone factor for a gradual one, small losses for contractions
          const transition = (xa, xb, va, vb, halfAngle, isSudden) => {
            let h;
            if (vb < va) h = (isSudden ? 1 : Math.min(1, 2.6 * Math.sin(halfAngle))) * (va - vb) * (va - vb) / (2 * G);
            else h = (isSudden ? 0.5 * (1 - va / vb) : 0.04) * vb * vb / (2 * G);
            const ia = idx(xa), ib = idx(xb);
            for (let i = ia; i < N; i++) loss[i] += h * (isSudden || ib <= ia ? 1 : clamp((i - ia) / (ib - ia), 0, 1));
          };
          const v1 = Q / area(D1), v2 = Q / area(D2), v3 = Q / area(D3);
          transition(2, 2.5, v1, v2, Math.atan(Math.abs(D2 - D1) / 2 / 0.5), false);
          transition(3.5, 4.5, v2, v3, Math.atan(Math.abs(D3 - D2) / 2 / 1.0), sudden);
        }
        const H0 = V.p1 * 1000 / (rho * G) + hv[0];
        const E = new Float64Array(N), Hh = new Float64Array(N);
        let pmin = Infinity, imin = 0;
        for (let i = 0; i < N; i++) { E[i] = H0 - loss[i]; Hh[i] = E[i] - hv[i]; const p = rho * G * Hh[i]; if (p < pmin) { pmin = p; imin = i; } }
        return { Ds, Vs, hv, E, Hh, loss: loss[N - 1], pmin, imin, Q, H0, ReT: Q / area(D2) * D2 / WATER.nu };
      }
      function model() {
        const rho = WATER.rho, Qset = V.Q / 1000, pvG = WATER.pv - PATM;       // the vapour pressure as a gauge pressure
        let m = compute(Qset), choked = false;
        if (m.pmin < pvG) {
          // the liquid cannot go below its vapour pressure: the throat fills with vapour and the flow chokes
          let lo = 0, hi = Qset;
          for (let k = 0; k < 50; k++) { const q = (lo + hi) / 2; if (compute(q).pmin < pvG) hi = q; else lo = q; }
          m = compute(lo); choked = true;
        }
        M = m; M.choked = choked; M.Qset = Qset;
        const { E, Hh, hv, Vs } = M;
        // the graph
        const pick = a => { const o = []; for (let i = 0; i < N; i += 4) o.push([i * dx, a[i]]); o.push([LEN, a[N - 1]]); return o; };
        const lo = Math.min(...Hh), vapour = pvG / (rho * G), nearVap = lo < 3;
        plot.set({
          series: [{ pts: pick(E), label: 'EGL (total head)', dash: [6, 4] }, { pts: pick(Hh), label: 'HGL (pressure head, pipe axis = datum)' }, { pts: pick(hv), label: 'velocity head V²/2g' }],
          hlines: nearVap ? [{ y: vapour, label: 'vapour pressure (water boils)' }] : [],
          y: { label: 'head (m of water)', min: nearVap ? vapour - 1 : 0 }
        });
        const kpa = i => f1(rho * G * Hh[i] / 1000, 0);
        const i1 = idx(1), i2 = idx(3), i3 = idx(6);
        ro.set('V', f1(Vs[i1], 2) + ' / ' + f1(Vs[i2], 2) + ' / ' + f1(Vs[i3], 2) + ' m/s');
        ro.set('p', kpa(i1) + ' / ' + kpa(i2) + ' / ' + kpa(i3) + ' kPa');
        ro.set('hv', f1(hv[i2], 2) + ' m');
        ro.set('loss', f1(M.loss, 2) + ' m (' + f1(rho * G * M.loss / 1000, 1) + ' kPa)');
        ro.set('Re', Math.round(M.ReT).toLocaleString('en-GB') + (M.ReT > 4000 ? ' (turbulent)' : M.ReT < 2300 ? ' (laminar)' : ' (transitional)'));
        ro.set('pabs', choked ? f1(WATER.pv / 1000, 1) + ' kPa: vapour pressure — the flow is choked at ' + f1(M.Q * 1000, 1) + ' L/s' : f1((M.pmin + PATM) / 1000, 1) + ' kPa');
      }
      // tracer dots: position along the pipe and position across it
      const R = rng(7), dots = [];
      for (let i = 0; i < 120; i++) dots.push({ x: R() * LEN, e: (R() * 2 - 1) * 0.85 });
      const loop = kit.loop(dt => {
        if (dirty || !M) { dirty = false; model(); }
        const c = st.begin(), C = kit.colors(), fr = frameOf(st, 760, 380);
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const X = x => 60 + 680 * x / LEN, yc = 300, rp = D => 5 + D * 220;
        const Emax = Math.max(...M.E), Hmin = Math.min(0, ...M.Hh), Htop = niceCeil(Math.max(Emax, 2) * 1.05);
        const sy = Math.min((yc - 34) / Htop, Hmin < 0 ? 70 / -Hmin : Infinity);          // room below the axis for negative heads
        const Y = h => clamp(yc - h * sy, 20, 376);
        // head axis
        const stp = Hyper.niceStep ? Hyper.niceStep(Htop, 5) : Htop / 5;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let h = Math.ceil(Hmin / stp) * stp; h <= Htop + 1e-9; h += stp) { c.beginPath(); c.moveTo(56, Y(h)); c.lineTo(740, Y(h)); c.stroke(); kit.label(c, f1(h, stp < 1 ? 1 : 0), 50, Y(h), { color: C.muted, size: 10.5, align: 'right' }); }
        kit.label(c, 'head (m)', 8, 14, { color: C.muted, size: 11 });
        // standpipes
        const stations = [1.0, 2.25, 3.0, 4.0, 6.0];
        for (const s of stations) {
          const i = idx(s), x = X(s), top = yc - rp(M.Ds[i]), yh = Y(M.Hh[i]);
          if (yh < top) { c.fillStyle = waterCol(C, 0.45); c.fillRect(x - 4, yh, 8, top - yh); }
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(x - 4, top); c.lineTo(x - 4, 30); c.moveTo(x + 4, top); c.lineTo(x + 4, 30); c.stroke();
          const p = WATER.rho * G * M.Hh[i];
          kit.label(c, f1(p / 1000, 0) + ' kPa', x, 22, { color: p < 0 ? C.bad : C.text, size: 10.5, align: 'center', weight: 600 });
        }
        // the pipe: water, walls, dots
        const up = [], dn = [];
        for (let i = 0; i < N; i += 2) { up.push([X(i * dx), yc - rp(M.Ds[i])]); dn.push([X(i * dx), yc + rp(M.Ds[i])]); }
        up.push([X(LEN), yc - rp(M.Ds[N - 1])]); dn.push([X(LEN), yc + rp(M.Ds[N - 1])]);
        c.fillStyle = waterCol(C); polyline(c, up.concat(dn.slice().reverse())); c.closePath(); c.fill();
        const cav = M.choked;
        if (cav) {                                                    // vapour where the absolute pressure is below the vapour pressure
          c.strokeStyle = C.bad; c.lineWidth = 1;
          for (let i = 0; i < N; i += 3) if (WATER.rho * G * M.Hh[i] + PATM < WATER.pv + 3000) { const r = rp(M.Ds[i]); for (const e of [-0.5, 0.1, 0.6]) { c.beginPath(); c.arc(X(i * dx), yc + e * r * 0.8, 2.2, 0, Math.PI * 2); c.stroke(); } }
        }
        const vmax = Math.max(...M.Vs), anim = Math.min(1, 2.6 / Math.max(vmax, 1e-6));
        ro.set('anim', anim < 0.999 ? 'slowed ×' + f1(1 / anim, 1) + ' to follow' : 'at the true speed (drawing scale)');
        for (const d of dots) {
          const i = idx(d.x);
          d.x += M.Vs[i] * anim * dt; if (d.x > LEN) d.x -= LEN;
          kit.dot(c, X(d.x), yc + d.e * rp(M.Ds[idx(d.x)]), 2.1, C.accent);
        }
        c.strokeStyle = C.text; c.lineWidth = 2.2; polyline(c, up); c.stroke(); polyline(c, dn); c.stroke();
        c.beginPath(); c.moveTo(X(0), yc - rp(M.Ds[0])); c.lineTo(X(0), yc + rp(M.Ds[0])); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 3]); c.stroke(); c.setLineDash([]);
        // grade lines
        const hgl = [], egl = [];
        for (let i = 0; i < N; i += 2) { hgl.push([X(i * dx), Y(M.Hh[i])]); egl.push([X(i * dx), Y(M.E[i])]); }
        c.strokeStyle = kit.fsym.col('return'); c.lineWidth = 2.2; polyline(c, hgl); c.stroke();
        c.strokeStyle = C.accent; c.setLineDash([7, 5]); polyline(c, egl); c.stroke(); c.setLineDash([]);
        kit.label(c, 'EGL', 744, Y(M.E[N - 1]) - 9, { color: C.accent, size: 11, weight: 700, align: 'right' });
        kit.label(c, 'HGL', 744, Y(M.Hh[N - 1]) + 10, { color: kit.fsym.col('return'), size: 11, weight: 700, align: 'right' });
        // velocities under the pipe
        for (const s of [1, 3, 6]) { const i = idx(s); kit.label(c, f1(M.Vs[i], 2) + ' m/s', X(s), clamp(yc + rp(M.Ds[i]) + 13, 0, 372), { color: C.text, size: 11, align: 'center' }); }
        if (cav) kit.label(c, 'the water boils here (cavitation): the flow is choked at ' + f1(M.Q * 1000, 1) + ' L/s, not ' + f1(M.Qset * 1000, 1), clamp(X(M.imin * dx), 250, 510), 50, { color: C.bad, size: 11.5, weight: 700, align: 'center', bg: C.surface });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ grade lines of a pipeline */
  Hyper.sim('flow-hgl', {
    title: 'Grade lines of a pipeline',
    blurb: `A pipe runs from an upper reservoir over a ridge to a lower one, with an optional pump and a valve near the end. The flow is found from the energy equation with Colebrook friction (and the pump's curve, when there is one). The dashed line is the **energy grade line**, the solid blue line the **hydraulic grade line**; the pipe turns **amber** where its pressure is below atmospheric and **red** where it would fall to the vapour pressure. The graph below shows the head the system needs and the head the pump gives, against the flow.

**Try this**
- With no pump, raise the ridge until the pipe crosses above the HGL: a siphon section, needing air valves. Raise it further until the pipe turns red — the column would separate and the calculated flow cannot happen.
- Put a pump before the ridge: the grade lines jump up at the pump and lift the HGL clear of the crest.
- Close the valve to 20 %: the EGL drops sharply at the valve, the flow falls, and the HGL over the ridge rises.
- Swap new steel for old cast iron: the grade lines steepen and the flow drops.
- Make the lower reservoir higher than the upper one: only a pump can drive the flow, and the operating point is where the curves cross.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'flow (L/s)', min: 0 }, y: { label: 'head (m)' }, legend: true }, 170);
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'zA', label: 'Upper reservoir level', min: 5, max: 80, step: 1, value: 50, unit: 'm' },
        { id: 'zB', label: 'Lower reservoir level', min: 0, max: 80, step: 1, value: 20, unit: 'm' },
        { id: 'hump', label: 'Height of the ridge', min: 0, max: 70, step: 1, value: 38, unit: 'm' },
        { id: 'D', label: 'Pipe bore', min: 100, max: 600, step: 10, value: 250, unit: 'mm' },
        { id: 'L', label: 'Pipe length', min: 200, max: 5000, step: 50, value: 2000, unit: 'm' },
        { id: 'rough', type: 'select', label: 'Pipe', options: [['PE or PVC (k = 0.007 mm)', 0.007], ['New steel (0.045 mm)', 0.045], ['Lined ductile iron (0.1 mm)', 0.1], ['Old cast iron, tuberculated (1 mm)', 1]], value: 0.045 },
        { id: 'pump', type: 'select', label: 'Pump', options: [['No pump', 'none'], ['Pump near the start', 'start'], ['Pump before the ridge', 'mid'], ['Pump near the end', 'end']], value: 'none' },
        { id: 'H0', label: 'Pump shut-off head', min: 5, max: 100, step: 1, value: 40, unit: 'm' },
        { id: 'open', label: 'Valve opening', min: 5, max: 100, step: 1, value: 100, unit: '%' }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['Q', 'Flow'], ['V', 'Velocity / Reynolds number'], ['f', 'Friction factor / friction loss'], ['pump', 'Pump head / shaft power (η 75 %)'], ['pmin', 'Lowest pressure (gauge)'], ['state', 'State']]);
      const V = ctl.values;
      const NS = 241, SPUMP = { start: 0.06, mid: 0.3, end: 0.8 }, SVALVE = 0.93, KENT = 0.5, KEXIT = 1.0;
      const VAPOUR_HEAD = (WATER.pv - PATM) / (WATER.rho * G);          // about −10.1 m (gauge)
      const zPipe = s => V.hump * Math.exp(-Math.pow((s - 0.5) / 0.14, 2));
      const valveK = o => 0.2 + 8 * Math.pow(100 / clamp(o, 1, 100) - 1, 2);
      let M = null, phase = 0;
      function model() {
        const D = V.D / 1000, A = area(D), L = V.L, rr = V.rough / 1000 / D, Kv = valveK(V.open);
        const pumpOn = V.pump !== 'none', Qm = 4 * A;                    // the pump is sized for the pipe: run-out at 4 m/s
        const hp = q => (pumpOn ? V.H0 * (1 - (q / Qm) * (q / Qm)) : 0);
        const fOf = q => { const Re = q / A * D / WATER.nu; return Re > 1 ? fin(kit.fluid.friction(Re, rr), 0.02) : 64; };
        const need = q => { const v = q / A; return V.zB - V.zA + (KENT + KEXIT + Kv + fOf(q) * L / D) * v * v / (2 * G); };
        const gap = q => hp(q) - need(q);
        let Q = 0;
        if (gap(1e-9) > 0) {
          let hi = A * 0.5, k = 0;
          while (gap(hi) > 0 && k++ < 60) hi *= 2;
          let lo = 0;
          for (let i = 0; i < 70; i++) { const m = (lo + hi) / 2; if (gap(m) > 0) lo = m; else hi = m; }
          Q = (lo + hi) / 2;
        }
        const v = Q / A, hv = v * v / (2 * G), f = Q > 0 ? fOf(Q) : 0, Sf = f * hv / D, sP = pumpOn ? SPUMP[V.pump] : -1;
        const s = [], z = [], E = [], Hh = [];
        let e = V.zA - KENT * hv, pminH = Infinity, sMin = 0.5;
        for (let i = 0; i < NS; i++) {
          const si = i / (NS - 1), sPrev = (i - 1) / (NS - 1);
          if (i > 0) {
            e -= Sf * L / (NS - 1);
            if (sP >= 0 && sPrev < sP && si >= sP) e += hp(Q);
            if (sPrev < SVALVE && si >= SVALVE) e -= Kv * hv;
          }
          let E_ = e, H_ = e - hv;
          if (Q <= 0) { const sc = pumpOn ? sP : 0.02; H_ = E_ = si < sc ? V.zA : V.zB; }   // no flow: a non-return valve holds the line
          s.push(si); z.push(zPipe(si)); E.push(E_); Hh.push(H_);
          const ph = H_ - z[i];
          if (i > 2 && i < NS - 3 && ph < pminH) { pminH = ph; sMin = si; }
        }
        const hpQ = Q > 0 ? hp(Q) : 0;
        M = { Q, v, hv, f, s, z, E, Hh, pminH, sMin, hpQ, pumpOn, sP, Kv, Re: v * D / WATER.nu, hf: Sf * L, Qm };
        // pump and system curves
        const qTop = Math.max(Q * 1.6, pumpOn ? Qm * 1.02 : A * 3, 1e-3), sys = [], pumpPts = [];
        for (let i = 0; i <= 60; i++) { const q = qTop * i / 60; sys.push([q * 1000, need(q)]); if (pumpOn) pumpPts.push([q * 1000, hp(q)]); }
        const series = [{ pts: sys, label: 'head the system needs' }];
        if (pumpOn) series.push({ pts: pumpPts, label: 'pump curve' });
        else series.push({ pts: [[0, 0], [qTop * 1000, 0]], label: 'no pump: zero head', dash: [5, 4] });
        plot.set({ series, marks: Q > 0 ? [{ x: Q * 1000, y: need(Q), label: f1(Q * 1000, 0) + ' L/s' }] : [], x: { label: 'flow (L/s)', min: 0, max: qTop * 1000 } });
        // read-outs
        ro.set('Q', Q > 0 ? fmtFlow(Q) + ' (' + f1(Q * 3600, 0) + ' m³/h)' : 'none');
        ro.set('V', f1(v, 2) + ' m/s / ' + (Q > 0 ? Math.round(M.Re).toLocaleString('en-GB') : '—'));
        ro.set('f', Q > 0 ? f1(f, 4) + ' / ' + f1(M.hf, 1) + ' m' : '—');
        ro.set('pump', !pumpOn ? 'no pump' : Q > 0 ? f1(hpQ, 1) + ' m / ' + fmtPower(WATER.rho * G * Q * Math.max(hpQ, 0) / 0.75) : 'shut-off head ' + f1(V.H0, 0) + ' m is not enough');
        ro.set('pmin', (pminH < VAPOUR_HEAD ? 'would be ' : '') + f1(WATER.rho * G * pminH / 1000, 0) + ' kPa at ' + f1(sMin * L / 1000, 2) + ' km' + (pminH < VAPOUR_HEAD ? ' — below the vapour pressure' : ''));
        ro.set('state', Q <= 0 ? 'no flow: the upper level (plus any pump) cannot reach the lower' : pminH < VAPOUR_HEAD ? 'column separation — this flow cannot happen' : pminH < 0 ? 'siphon section: below atmospheric, air valves needed' : 'all of the pipe above atmospheric pressure');
      }
      const loop = kit.loop(dt => {
        if (dirty || !M) { dirty = false; model(); }
        const c = st.begin(), C = kit.colors(), fr = frameOf(st, 760, 420);
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const X = s => 95 + 570 * s;
        const zLo = -6, zHi = Math.max(20, Math.ceil((Math.max(V.zA, V.zB, V.hump, ...M.E, ...M.Hh) + 4) / 10) * 10);
        const Y = zz => 395 - (clamp(zz, zLo - 20, zHi + 20) - zLo) / (zHi - zLo) * 360;
        // elevation grid
        const stp = Hyper.niceStep ? Hyper.niceStep(zHi - zLo, 6) : 10;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let zz = Math.ceil(zLo / stp) * stp; zz <= zHi + 1e-9; zz += stp) { c.beginPath(); c.moveTo(40, Y(zz)); c.lineTo(752, Y(zz)); c.stroke(); kit.label(c, f1(zz, 0), 34, Y(zz), { color: C.muted, size: 10.5, align: 'right' }); }
        kit.label(c, 'elevation (m)', 8, 14, { color: C.muted, size: 11 });
        // ground over the pipe (1.5 m of cover)
        c.fillStyle = C.surface; c.strokeStyle = C.faint; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(X(0), Y(zLo)); for (let i = 0; i < NS; i += 4) c.lineTo(X(M.s[i]), Y(M.z[i] + 1.5)); c.lineTo(X(1), Y(M.z[NS - 1] + 1.5)); c.lineTo(X(1), Y(zLo)); c.closePath(); c.fill();
        c.beginPath(); for (let i = 0; i < NS; i += 4) (i ? c.lineTo(X(M.s[i]), Y(M.z[i] + 1.5)) : c.moveTo(X(M.s[i]), Y(M.z[i] + 1.5))); c.stroke();
        // reservoirs
        const basin = (x0, x1, zs, name) => {
          const top = Math.max(zs + 4, 8);
          c.fillStyle = waterCol(C); c.fillRect(x0, Y(zs), x1 - x0, Y(-4) - Y(zs));
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, Y(top)); c.lineTo(x0, Y(-4)); c.lineTo(x1, Y(-4)); c.lineTo(x1, Y(top)); c.stroke();
          c.strokeStyle = waterCol(C, 0.9); c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0, Y(zs)); c.lineTo(x1, Y(zs)); c.stroke();
          kit.label(c, name + '  ' + f1(zs, 0) + ' m', (x0 + x1) / 2, Y(top) - 10, { color: C.text, size: 11, weight: 700, align: 'center' });
        };
        basin(15, 95, V.zA, 'A'); basin(665, 745, V.zB, 'B');
        // the pipe, coloured by its pressure
        for (let i = 1; i < NS; i++) {
          const ph = (M.Hh[i] + M.Hh[i - 1]) / 2 - (M.z[i] + M.z[i - 1]) / 2;
          c.strokeStyle = ph < VAPOUR_HEAD ? C.bad : ph < 0 ? C.warn : C.text; c.lineWidth = 5; c.lineCap = 'round';
          c.beginPath(); c.moveTo(X(M.s[i - 1]), Y(M.z[i - 1])); c.lineTo(X(M.s[i]), Y(M.z[i])); c.stroke();
        }
        c.lineCap = 'butt';
        if (M.Q > 0) {
          const pts = []; for (let i = 0; i < NS; i += 6) pts.push([X(M.s[i]), Y(M.z[i])]); pts.push([X(1), Y(M.z[NS - 1])]);
          phase += dt * 28 * Math.min(M.v, 4);
          S.flow(c, pts, phase, { color: C.dark ? '#e7ecff' : '#ffffff', r: 1.6, gap: 16 });
        }
        // standpipes
        for (const sx of [0.2, 0.5, 0.72]) {
          const i = Math.round(sx * (NS - 1)), x = X(M.s[i]), yp = Y(M.z[i]), yh = Y(M.Hh[i]), p = WATER.rho * G * (M.Hh[i] - M.z[i]);
          c.strokeStyle = p < 0 ? C.warn : waterCol(C, 0.8); c.lineWidth = 3; c.setLineDash(p < 0 ? [3, 3] : []);
          c.beginPath(); c.moveTo(x, yp); c.lineTo(x, yh); c.stroke(); c.setLineDash([]);
          kit.label(c, f1(p / 1000, 0) + ' kPa', x + 8, p < 0 ? Math.min(yp, yh) - 16 : (yp + yh) / 2, { color: p < 0 ? C.warn : C.text, size: 10.5, align: 'left', bg: C.bg2 });
        }
        // grade lines, with the reservoir surfaces at their ends
        const egl = [[55, Y(V.zA)]], hgl = [[55, Y(V.zA)]];
        for (let i = 0; i < NS; i += 2) { egl.push([X(M.s[i]), Y(M.E[i])]); hgl.push([X(M.s[i]), Y(M.Hh[i])]); }
        egl.push([X(1), Y(M.E[NS - 1])], [705, Y(V.zB)]); hgl.push([X(1), Y(M.Hh[NS - 1])], [705, Y(V.zB)]);
        c.strokeStyle = S.col('return'); c.lineWidth = 2.2; polyline(c, hgl); c.stroke();
        c.strokeStyle = C.accent; c.setLineDash([7, 5]); polyline(c, egl); c.stroke(); c.setLineDash([]);
        const iL = Math.round(0.85 * (NS - 1));
        kit.label(c, 'EGL', X(0.85), Y(M.E[iL]) - 10, { color: C.accent, size: 11, weight: 700, align: 'center' });
        kit.label(c, 'HGL', X(0.85), Y(M.Hh[iL]) + 11, { color: S.col('return'), size: 11, weight: 700, align: 'center' });
        // pump and valve
        if (M.pumpOn) { const x = X(M.sP), y = Y(zPipe(M.sP)); c.fillStyle = C.bg2; c.beginPath(); c.arc(x, y, 11, 0, Math.PI * 2); c.fill(); S.pump(c, x, y, { r: 10, rot: 90 }); }
        {
          const x = X(SVALVE), y = Y(zPipe(SVALVE)), a = 8, shut = 1 - V.open / 100;
          c.fillStyle = C.bg2; c.fillRect(x - a - 2, y - a - 2, 2 * a + 4, 2 * a + 4);
          c.beginPath(); c.moveTo(x - a, y - a); c.lineTo(x - a, y + a); c.lineTo(x + a, y - a); c.lineTo(x + a, y + a); c.closePath();
          c.fillStyle = shut > 0.05 ? C.warn : C.bg2; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.stroke();
          kit.label(c, 'valve ' + V.open + ' %', x, y + 18, { color: C.muted, size: 10.5, align: 'center' });
        }
        // the lowest pressure
        { const i = Math.round(M.sMin * (NS - 1)); kit.dot(c, X(M.s[i]), Y(M.z[i]), 4.5, M.pminH < VAPOUR_HEAD ? C.bad : M.pminH < 0 ? C.warn : C.ok, C.bg2); }
        const msg = M.Q <= 0 ? 'No flow: a non-return valve holds the line at the level of B' : M.pminH < VAPOUR_HEAD ? 'Red: the pressure would fall to the vapour pressure — the water column separates' : M.pminH < 0 ? 'Amber: pipe above the HGL — pressure below atmospheric (siphon)' : 'The whole pipe lies below its HGL';
        kit.label(c, msg, 430, 14, { color: M.Q <= 0 || M.pminH < VAPOUR_HEAD ? C.bad : M.pminH < 0 ? C.warn : C.muted, size: 12, weight: 700, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ laminar and turbulent flow: Reynolds' experiment */
  Hyper.sim('flow-laminar', {
    title: 'Laminar and turbulent pipe flow',
    blurb: `Reynolds' experiment: a thread of dye enters the centre of a glass pipe. Set the Reynolds number; the liquid and the bore only change the numbers (what velocity and flow that Re means). The lower panel shows the velocity profile at the marked section, and the graph the friction factor.

**Try this**
- Start at Re = 1500: the dye stays a thin straight line, and the profile is a parabola with its centre at twice the mean.
- Go to 3000 with ordinary pipework: turbulent **puffs** come and go — the flow is transitional. Watch the profile flatten as a puff passes the section.
- Go above 4000: the dye is torn up within a few diameters and fills the pipe; the profile is flat, α drops from 2 to about 1.05.
- Choose a very smooth inlet and go to 8000: the flow stays laminar — until you press *Disturb the inlet* and a puff grows and spreads. Below about 2000 a puff dies away.
- Pick hydraulic oil at 0 °C: the same Re needs a far higher velocity — cold oil is laminar where water would be turbulent.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'Reynolds number', log: true, min: 100, max: 1e5 }, y: { label: 'friction factor f', log: true, min: 0.01, max: 0.8 }, legend: true }, 160);
      const FLUIDS = { water: { nu: 1.0e-6, rho: 998 }, oil40: { nu: 46e-6, rho: 870 }, oil0: { nu: 570e-6, rho: 885 }, glyc: { nu: 1.12e-3, rho: 1260 } };
      const puffs = [], dye = [];
      let dirty = true;
      const X0 = 40, X1 = 720, YC = 128, RP = 52, NEEDLE = 96, SECTION = 560, VM = 62;   // design grid; VM = mean speed in px/s
      function addPuff(x, len) { puffs.push({ a: x, b: x + len }); }
      const ctl = kit.controls(box.side, [
        { id: 'Re', label: 'Reynolds number', min: 100, max: 100000, value: 1500, log: true, sig: 3 },
        { id: 'inlet', type: 'select', label: 'Inlet', options: [['Ordinary pipework (disturbed)', 'normal'], ['Very smooth inlet, still water', 'smooth']], value: 'normal' },
        { type: 'buttons', items: [{ id: 'poke', label: 'Disturb the inlet' }, { id: 'clear', label: 'Clear the dye' }] },
        { id: 'fluid', type: 'select', label: 'Liquid (for the numbers)', options: [['Water at 20 °C', 'water'], ['Hydraulic oil VG 46 at 40 °C', 'oil40'], ['Hydraulic oil VG 46 at 0 °C', 'oil0'], ['Glycerine at 20 °C', 'glyc']], value: 'water' },
        { id: 'D', label: 'Pipe bore', min: 5, max: 100, step: 1, value: 20, unit: 'mm' }
      ], id => {
        if (id === 'poke') addPuff(NEEDLE + 10, 70);
        if (id === 'clear') dye.length = 0;
        dirty = true;
      });
      const ro = kit.readout(box.side, [['Re', 'Reynolds number'], ['reg', 'Regime'], ['V', 'Mean velocity / flow'], ['um', 'Centreline ÷ mean'], ['f', 'Friction factor'], ['dp', 'Pressure drop per metre'], ['ab', 'α (energy) / β (momentum)']]);
      const V = ctl.values, rand = rng(11);
      // the turbulent power-law exponent against Re (Schlichting's values)
      const NT = [[4e3, 6.0], [2.3e4, 6.6], [1.1e5, 7.0], [1.1e6, 8.8], [3.2e6, 10]];
      function nOf(Re) {
        const L = Math.log10(Math.max(Re, 4000));
        for (let i = 1; i < NT.length; i++) { const a = Math.log10(NT[i - 1][0]), b = Math.log10(NT[i][0]); if (L <= b) return NT[i - 1][1] + (NT[i][1] - NT[i - 1][1]) * (L - a) / (b - a); }
        return 10;
      }
      const ratio = n => 2 * n * n / ((n + 1) * (2 * n + 1));                      // V / u_max
      const alphaOf = n => Math.pow(n + 1, 3) * Math.pow(2 * n + 1, 3) / (4 * Math.pow(n, 4) * (n + 3) * (2 * n + 3));
      const betaOf = n => Math.pow(n + 1, 2) * Math.pow(2 * n + 1, 2) / (2 * n * n * (n + 2) * (2 * n + 2));
      function mode() {
        const Re = V.Re;
        if (V.inlet === 'normal') return Re >= 4000 ? 'turb' : Re > 2300 ? 'trans' : 'lam';
        return Re >= 12000 ? 'turb' : 'lam';
      }
      const inPuff = x => puffs.some(p => x >= p.a && x <= p.b);
      function info() {
        const Re = V.Re, fl = FLUIDS[V.fluid] || FLUIDS.water, D = V.D / 1000, v = Re * fl.nu / D, m = mode(), n = nOf(Re);
        const fl64 = 64 / Re, ft = kit.fluid.colebrook(Math.max(Re, 2300), 0);
        const f = m === 'lam' ? fl64 : m === 'turb' ? ft : null;
        ro.set('Re', Math.round(Re).toLocaleString('en-GB'));
        ro.set('reg', m === 'lam' ? (Re > 2300 ? 'laminar, but unstable: a disturbance will grow' : 'laminar') : m === 'turb' ? 'turbulent' : 'transitional: turbulent puffs');
        ro.set('V', kit.fmt(v, 3) + ' m/s / ' + kit.fmt(v * area(D) * 60000, 3) + ' L/min' + (v > 30 ? ' — impractically fast' : ''));
        ro.set('um', m === 'turb' ? f1(1 / ratio(n), 2) + '  (n = ' + f1(n, 1) + ')' : m === 'lam' ? '2.00' : '2.00 laminar, ' + f1(1 / ratio(n), 2) + ' in a puff');
        ro.set('f', f != null ? f1(f, 4) : 'between ' + f1(fl64, 4) + ' and ' + f1(ft, 4));
        const dpl = fl.rho * v * v / (2 * D) * (f != null ? f : Math.max(fl64, ft));
        ro.set('dp', dpl >= 1000 ? kit.fmt(dpl / 1000, 3) + ' kPa/m' : kit.fmt(dpl, 3) + ' Pa/m');
        ro.set('ab', m === 'turb' ? f1(alphaOf(n), 3) + ' / ' + f1(betaOf(n), 3) : '2 / 1.333 (laminar)');
        const lam = [], tur = [];
        for (let i = 0; i <= 50; i++) { const r = Math.pow(10, 2 + 3 * i / 50); if (r <= 4000) lam.push([r, 64 / r]); if (r >= 2300) tur.push([r, kit.fluid.colebrook(r, 0)]); }
        plot.set({ series: [{ pts: lam, label: 'laminar: 64/Re' }, { pts: tur, label: 'turbulent, smooth pipe (Colebrook)' }],
          marks: [{ x: Re, y: f != null ? f : kit.fluid.friction(Re, 0), label: 'Re = ' + Math.round(Re) }], vlines: [{ x: 2300, label: '2300' }, { x: 4000, label: '4000' }] });
      }
      let acc = 0, tSim = 0;
      function advance(dt) {
        tSim += dt;
        const Re = V.Re, m = mode(), n = nOf(Re), full = m === 'turb';
        // puffs: born at the inlet in transitional flow, growing above about 2300 and dying below about 2000
        if (!full) {
          const gam = clamp((Re - 2300) / 1700, 0, 1);
          if (m === 'trans' && !inPuff(NEEDLE + 6) && rand() < (0.1 + 0.5 * gam) * dt) addPuff(NEEDLE + 4, 25 + 40 * rand());
          const grow = Re < 2000 ? -0.3 : Re < 2300 ? -0.05 : V.inlet === 'smooth' && Re > 4000 ? 0.6 : 0.03 + 0.15 * gam;
          for (const p of puffs) { p.a += VM * (1 - Math.max(grow, -0.5) * 0.5) * dt; p.b += VM * (1 + grow * 0.5) * dt; }
          puffs.sort((p, q) => p.a - q.a);
          for (let i = puffs.length - 1; i > 0; i--) if (puffs[i].a <= puffs[i - 1].b) { puffs[i - 1].b = Math.max(puffs[i - 1].b, puffs[i].b); puffs.splice(i, 1); }
          for (let i = puffs.length - 1; i >= 0; i--) if (puffs[i].b - puffs[i].a < 4 || puffs[i].a > X1) puffs.splice(i, 1);
        } else puffs.length = 0;
        // dye released at the needle
        const um = full ? VM / ratio(n) : 2 * VM;
        acc += dt * um / (full || inPuff(NEEDLE + 2) ? 0.7 : 2.4);
        while (acc >= 1) { acc -= 1; if (dye.length < 1800) dye.push({ x: NEEDLE + rand() * 2, r: (rand() - 0.5) * 0.02 }); }
        // move the dye
        const umT = VM / ratio(n);
        for (let i = dye.length - 1; i >= 0; i--) {
          const d = dye[i], turb = full || inPuff(d.x);
          let u;
          if (!turb) { u = 2 * VM * (1 - d.r * d.r); d.r += (rand() - 0.5) * 0.004; }
          else {
            const ph = (d.x - VM * tSim);
            const eddy = Math.sin(ph / 14 + 1.3 + 4 * d.r) + 0.7 * Math.sin(ph / 8.7 + 4.1 - 5.3 * d.r) + 0.5 * Math.sin(ph / 5.3 + 0.7 + 7 * d.r + 0.3 * tSim);
            u = umT * Math.pow(Math.max(1e-4, 1 - Math.abs(d.r)), 1 / n) * (1 + 0.12 * Math.sin(ph / 6.1 + 5 * d.r));
            const gs = (rand() + rand() + rand() - 1.5) * 2;
            d.r += 0.5 * eddy * (1 - d.r * d.r) * dt + 0.7 * gs * Math.sqrt(dt);
            if (d.r > 0.97) d.r = 1.94 - d.r; if (d.r < -0.97) d.r = -1.94 - d.r;
            d.r = clamp(d.r, -0.97, 0.97);
          }
          d.x += u * dt;
          if (d.x > X1) dye.splice(i, 1);
        }
      }
      for (let i = 0; i < 480; i++) advance(1 / 60);                     // start with the dye already down the pipe
      const loop = kit.loop(dt => {
        if (dirty) { dirty = false; info(); }
        advance(dt);
        const Re = V.Re, m = mode(), n = nOf(Re), full = m === 'turb';
        // ---- drawing on a 760 × 400 grid
        const c = st.begin(), C = kit.colors(), fr = frameOf(st, 760, 400);
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        c.fillStyle = waterCol(C, C.dark ? 0.14 : 0.08); c.fillRect(X0, YC - RP, X1 - X0, 2 * RP);
        c.fillStyle = kit.hue(38, C.dark ? 0.16 : 0.12);
        if (full) c.fillRect(X0, YC - RP, X1 - X0, 2 * RP);
        else for (const p of puffs) { const a = clamp(p.a, X0, X1), b = clamp(p.b, X0, X1); if (b > a) c.fillRect(a, YC - RP, b - a, 2 * RP); }
        const dyeCol = kit.hue(325);
        for (const d of dye) kit.dot(c, d.x, YC + d.r * RP, 1.6, dyeCol);
        c.strokeStyle = C.text; c.lineWidth = 2.5; c.beginPath(); c.moveTo(X0, YC - RP); c.lineTo(X1, YC - RP); c.moveTo(X0, YC + RP); c.lineTo(X1, YC + RP); c.stroke();
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(NEEDLE - 14, 30); c.lineTo(NEEDLE - 14, YC); c.lineTo(NEEDLE, YC); c.stroke();
        kit.label(c, 'dye', NEEDLE - 10, 24, { color: dyeCol, size: 11, weight: 700 });
        kit.arrow(c, 46, YC, 76, YC, C.muted, 2);
        kit.label(c, 'flow', 48, YC - 12, { color: C.muted, size: 10.5 });
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(SECTION, YC - RP - 8); c.lineTo(SECTION, YC + RP + 8); c.stroke(); c.setLineDash([]);
        kit.label(c, 'section', SECTION, YC + RP + 16, { color: C.muted, size: 10.5, align: 'center' });
        kit.label(c, full ? 'turbulent' : puffs.length ? 'laminar, with turbulent puffs' : 'laminar', X1, YC - RP - 12, { color: full ? C.warn : C.text, size: 12, weight: 700, align: 'right' });
        // velocity profile at the section
        const turbHere = full || inPuff(SECTION), PX = 110, PY = 318, SC = 80;   // SC px per mean velocity
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(PX - 20, PY - RP); c.lineTo(PX + 250, PY - RP); c.moveTo(PX - 20, PY + RP); c.lineTo(PX + 250, PY + RP); c.stroke();
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(PX, PY - RP); c.lineTo(PX, PY + RP); c.stroke();
        const uAt = (r, t) => (t ? 1 / ratio(n) * Math.pow(Math.max(0, 1 - Math.abs(r)), 1 / n) : 2 * (1 - r * r));
        const curve = t => { const pts = []; for (let i = 0; i <= 40; i++) { const r = -1 + i / 20; pts.push([PX + uAt(r, t) * SC, PY + r * RP]); } return pts; };
        c.strokeStyle = C.faint; c.setLineDash([4, 4]); polyline(c, curve(!turbHere)); c.stroke(); c.setLineDash([]);
        for (let r = -0.9; r <= 0.91; r += 0.15) kit.arrow(c, PX, PY + r * RP, PX + uAt(r, turbHere) * SC, PY + r * RP, C.accent, 1.6);
        c.strokeStyle = C.accent; c.lineWidth = 2.2; polyline(c, curve(turbHere)); c.stroke();
        c.strokeStyle = C.ok; c.lineWidth = 1.4; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(PX + SC, PY - RP); c.lineTo(PX + SC, PY + RP); c.stroke(); c.setLineDash([]);
        kit.label(c, 'mean V', PX + SC + 4, PY + RP - 8, { color: C.ok, size: 10.5 });
        kit.label(c, (turbHere ? 'turbulent: centreline ' + f1(1 / ratio(n), 2) : 'laminar: centreline 2.00') + ' × mean', PX, PY - RP - 14, { color: C.text, size: 11.5, weight: 700 });
        kit.label(c, 'dashed grey: the other regime', PX, PY + RP + 14, { color: C.muted, size: 10.5 });
        // the Reynolds number on a scale
        const BX = 430, BW = 300, BY = 300, lx = r => BX + BW * (Math.log10(r) - 2) / 3;
        c.fillStyle = kit.hue(150, 0.35); c.fillRect(BX, BY - 8, lx(2300) - BX, 16);
        c.fillStyle = kit.hue(40, 0.45); c.fillRect(lx(2300), BY - 8, lx(4000) - lx(2300), 16);
        c.fillStyle = kit.hue(0, 0.35); c.fillRect(lx(4000), BY - 8, BX + BW - lx(4000), 16);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(BX, BY - 8, BW, 16);
        for (const t of [100, 1000, 10000, 100000]) kit.label(c, t >= 1000 ? (t / 1000) + 'k' : String(t), lx(t), BY + 20, { color: C.muted, size: 10.5, align: 'center' });
        kit.label(c, 'laminar', (BX + lx(2300)) / 2, BY - 18, { color: C.text, size: 10.5, align: 'center' });
        kit.label(c, 'turbulent', (lx(4000) + BX + BW) / 2, BY - 18, { color: C.text, size: 10.5, align: 'center' });
        const mx = lx(clamp(Re, 100, 1e5));
        c.fillStyle = C.text; c.beginPath(); c.moveTo(mx, BY + 9); c.lineTo(mx - 6, BY + 3 + 14); c.lineTo(mx + 6, BY + 3 + 14); c.closePath(); c.fill();
        kit.label(c, 'Re = ' + Math.round(Re).toLocaleString('en-GB'), BX + BW / 2, BY + 44, { color: C.text, size: 12.5, weight: 700, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a jet on a vane or a wheel of buckets */
  Hyper.sim('flow-jet', {
    title: 'A jet on a vane',
    blurb: `A water jet strikes a splitter vane that turns each half of it through the angle θ. The picture is drawn **as seen from the vane**, which moves away from the nozzle at speed $u$: the water arrives at the relative speed $w = V - u$ and leaves along the vane's lip at $w$. The arrows at the lip add the vane's speed to give the water's real (absolute) velocity $V_2$. The graph shows the efficiency against $u/V$.

**Try this**
- Set θ = 90° (a flat plate) and then 180° (a cup) with the vane held still: the force doubles.
- On a wheel of buckets, move $u/V$ to 0.5 with θ = 180°: the water leaves with no absolute velocity and the efficiency reaches 100 %.
- Switch to a single vane: the best speed drops to a third of the jet speed and the best efficiency to 16/27, about 59 % (with θ = 180°).
- Set θ = 165°, as on a Pelton bucket: 98 % ideally, and the water clears the next bucket.
- Double the jet speed: force ×4, power ×8 at the same $u/V$.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 260 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'vane speed ÷ jet speed, u/V', min: 0, max: 1 }, y: { label: 'efficiency (%)', min: 0, max: 105 }, legend: true }, 160);
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Jet speed V', min: 5, max: 100, step: 1, value: 30, unit: 'm/s' },
        { id: 'd', label: 'Jet diameter', min: 10, max: 100, step: 1, value: 50, unit: 'mm' },
        { id: 'th', label: 'Deflection θ', min: 10, max: 180, step: 1, value: 165, unit: '°' },
        { id: 'k', label: 'Vane speed u/V', min: 0, max: 0.95, step: 0.01, value: 0.46 },
        { id: 'mode', type: 'select', label: 'Vanes', options: [['A wheel of buckets (all the flow used)', 'wheel'], ['A single vane running away', 'single']], value: 'wheel' }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['Q', 'Jet flow'], ['Pj', 'Jet power ½ρQV²'], ['uw', 'Vane speed u / relative speed w'], ['F', 'Force on the vane(s)'], ['P', 'Power to the vane(s)'], ['eta', 'Efficiency'], ['V2', 'Water leaving (absolute)']]);
      const V = ctl.values, rho = WATER.rho, rand = rng(5);
      let out = null;
      function model() {
        const Vj = V.V, A = area(V.d / 1000), Q = Vj * A, u = V.k * Vj, w = Vj - u, th = V.th * Math.PI / 180, turn = 1 - Math.cos(th);
        const mdot = V.mode === 'wheel' ? rho * Q : rho * A * w;
        const F = mdot * w * turn, P = F * u, Pj = 0.5 * rho * Q * Vj * Vj;
        const v2x = u + w * Math.cos(th), v2y = w * Math.sin(th);
        out = { Vj, A, Q, u, w, th, F, P, Pj, eta: P / Pj, v2x, v2y, v2: Math.hypot(v2x, v2y) };
        ro.set('Q', fmtFlow(Q));
        ro.set('Pj', fmtPower(Pj));
        ro.set('uw', f1(u, 1) + ' m/s / ' + f1(w, 1) + ' m/s');
        ro.set('F', fmtForce(F) + (V.th === 90 && V.k === 0 ? '  (= ρQV, flat plate)' : ''));
        ro.set('P', fmtPower(P));
        ro.set('eta', f1(out.eta * 100, 1) + ' %');
        ro.set('V2', f1(out.v2, 1) + ' m/s' + (out.v2 < 0.02 * Vj ? ' — the water simply drops away' : ''));
        const wheel = [], single = [];
        for (let i = 0; i <= 50; i++) { const k = i / 50; wheel.push([k, 200 * k * (1 - k) * turn]); single.push([k, 200 * k * (1 - k) * (1 - k) * turn]); }
        plot.set({ series: [{ pts: wheel, label: 'wheel of buckets' }, { pts: single, label: 'single vane', dash: [5, 4] }], marks: [{ x: V.k, y: out.eta * 100, label: f1(out.eta * 100, 0) + ' %' }] });
      }
      const drops = [], YJ = 180, XV = 420, RV = 62;
      let acc = 0, rail = 0;
      // the droplets: along the jet, round the vane, then away from its lip (all relative to the vane)
      function advance(dt) {
        const o = out, wb = clamp(6 + V.d * 0.28, 6, 34) / 2, spx = o.w * clamp(170 / o.Vj, 1.5, 12);
        acc += dt * spx / 5;
        while (acc >= 1) { acc -= 1; if (drops.length < 900) drops.push({ ph: 0, x: 118, e: rand() * 2 - 1 }); }
        for (let i = drops.length - 1; i >= 0; i--) {
          const d = drops[i];
          if (d.ph === 0) { d.x += spx * dt; if (d.x >= XV) { d.ph = 1; d.br = d.e < 0 ? 1 : -1; d.r = RV - Math.abs(d.e) * wb * 0.95; d.phi = 0; } }
          else if (d.ph === 1) { d.phi += spx * dt / Math.max(d.r, 5); if (d.phi >= o.th) { d.ph = 2; d.px = XV + d.r * Math.sin(o.th); d.py = YJ - d.br * (RV - d.r * Math.cos(o.th)); } }
          else { d.px += spx * dt * Math.cos(o.th); d.py -= d.br * spx * dt * Math.sin(o.th); if (d.px < -20 || d.px > 780 || d.py < -20 || d.py > 380) drops.splice(i, 1); }
        }
      }
      model();
      for (let i = 0; i < 400; i++) advance(1 / 50);                    // start with the water already flowing
      const loop = kit.loop(dt => {
        if (dirty || !out) { dirty = false; model(); }
        advance(dt);
        const o = out, c = st.begin(), C = kit.colors(), fr = frameOf(st, 760, 360);
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const wpx = clamp(6 + V.d * 0.28, 6, 34), wb = wpx / 2, vis = clamp(170 / o.Vj, 1.5, 12);
        // nozzle and jet
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(20, YJ - wpx * 1.6); c.lineTo(88, YJ - wpx * 1.6); c.lineTo(118, YJ - wb); c.lineTo(118, YJ + wb); c.lineTo(88, YJ + wpx * 1.6); c.lineTo(20, YJ + wpx * 1.6); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = waterCol(C); c.fillRect(118, YJ - wb, XV - 118, wpx);
        // the water sheet on the vane (each branch half the jet)
        c.strokeStyle = waterCol(C); c.lineWidth = wb;
        for (const br of [1, -1]) {
          c.beginPath();
          for (let i = 0; i <= 30; i++) { const ph = o.th * i / 30, rr = RV - wb / 2, x = XV + rr * Math.sin(ph), y = YJ - br * (RV - rr * Math.cos(ph)); i ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.stroke();
        }
        for (const d of drops) {
          let x, y;
          if (d.ph === 0) { x = d.x; y = YJ + d.e * wb; }
          else if (d.ph === 1) { x = XV + d.r * Math.sin(d.phi); y = YJ - d.br * (RV - d.r * Math.cos(d.phi)); }
          else { x = d.px; y = d.py; }
          kit.dot(c, x, y, 1.8, C.accent);
        }
        // the vane: two arcs from a splitter ridge
        c.strokeStyle = C.text; c.lineWidth = 4;
        for (const br of [1, -1]) {
          c.beginPath();
          for (let i = 0; i <= 40; i++) { const ph = o.th * i / 40, rr = RV + 3, x = XV + rr * Math.sin(ph), y = YJ - br * (RV - rr * Math.cos(ph)); i ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.stroke();
        }
        c.fillStyle = C.text; c.beginPath(); c.moveTo(XV - 8, YJ); c.lineTo(XV + 2, YJ - 5); c.lineTo(XV + 2, YJ + 5); c.closePath(); c.fill();
        // force on the vane
        const Fmax = 2 * rho * o.Q * o.Vj, fl = 20 + 110 * clamp(o.F / Math.max(Fmax, 1e-9), 0, 1), fx = XV + RV + 24;
        kit.arrow(c, fx, YJ, fx + fl, YJ, C.warn, 4);
        kit.label(c, 'F = ' + fmtForce(o.F), fx + fl + 8, YJ, { color: C.warn, size: 12.5, weight: 700 });
        // the velocity triangle at the lip, in an inset: relative velocity w along the lip, plus the vane's u, gives V₂
        {
          const bx = 545, by = 8, bw = 210, bh = 112, ox = 650, oy = 110, as = 90 / o.Vj;
          c.fillStyle = C.surface; c.strokeStyle = C.faint; c.lineWidth = 1; c.fillRect(bx, by, bw, bh); c.strokeRect(bx, by, bw, bh);
          kit.label(c, 'velocity triangle at the lip', bx + 6, by + 10, { color: C.muted, size: 10.5 });
          const wx = o.w * Math.cos(o.th) * as, wy = -o.w * Math.sin(o.th) * as, vx = o.v2x * as, vy = -o.v2y * as;
          kit.arrow(c, ox, oy, ox + wx, oy + wy, C.muted, 2);
          kit.arrow(c, ox + wx, oy + wy, ox + wx + o.u * as, oy + wy, C.accent, 2);
          kit.arrow(c, ox, oy, ox + vx, oy + vy, C.ok, 2.6);
          kit.label(c, 'w', ox + wx / 2 - 8, oy + wy / 2 - 4, { color: C.muted, size: 11, weight: 700, align: 'right' });
          kit.label(c, 'u', ox + wx + o.u * as / 2, oy + wy - 8, { color: C.accent, size: 11, weight: 700, align: 'center' });
          kit.label(c, 'V₂ ' + f1(o.v2, 1) + ' m/s', clamp(ox + vx + 6, bx + 4, bx + bw - 70), clamp(oy + vy + 10, by + 22, by + bh - 8), { color: C.ok, size: 11, weight: 700 });
        }
        // the ground slides backwards at u in the vane's frame
        rail = (rail + o.u * vis * dt) % 24;
        c.strokeStyle = C.faint; c.lineWidth = 1.5; c.beginPath(); c.moveTo(20, 330); c.lineTo(740, 330); c.stroke();
        c.beginPath(); for (let x = 20 - rail + 24; x < 740; x += 24) { c.moveTo(x, 330); c.lineTo(x - 8, 340); } c.stroke();
        kit.label(c, 'seen from the vane: the vane moves right at u = ' + f1(o.u, 1) + ' m/s; the water reaches it at w = ' + f1(o.w, 1) + ' m/s', 380, 352, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'V = ' + f1(o.Vj, 0) + ' m/s', 130, YJ - wb - 12, { color: C.text, size: 11.5, weight: 700 });
        kit.label(c, 'θ = ' + V.th + '°  (' + (V.mode === 'wheel' ? 'wheel of buckets' : 'single vane') + ')', XV - 16, YJ + RV + 22, { color: C.text, size: 11.5, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ thrust on a pipe bend */
  Hyper.sim('flow-bend', {
    title: 'Thrust on a pipe bend',
    blurb: `A horizontal bend in a water main, seen from above. On the water inside, the pressure pushes in at both cut faces (red arrows) and the bend turns the momentum flux (blue arrows); the resultant force of the water **on the bend** (amber) points outwards along the bisector, and a concrete thrust block carries it into undisturbed ground. The graph shows the thrust against the bend angle.

**Try this**
- Compare the red and blue arrows at 10 bar and 1.5 m/s: the momentum term is a fraction of a per cent. Tick *magnify the momentum arrows* to see it at all.
- Set the flow to zero: the thrust hardly changes — it is a pressure force.
- Raise the pressure to a 15 bar test: the block must grow by half.
- Try 45°, 90° and 180°: the thrust grows as sin(θ/2); a 180° return bend takes twice the end force pA.
- Pick soft clay: the same thrust needs six times the bearing area it needs against dense gravel.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'bend angle θ (°)', min: 0, max: 180 }, y: { label: 'thrust (kN)', min: 0 }, legend: true }, 150);
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Pipe bore', min: 100, max: 1200, step: 10, value: 600, unit: 'mm' },
        { id: 'p', label: 'Pressure (gauge)', min: 0, max: 25, step: 0.5, value: 10, unit: 'bar' },
        { id: 'v', label: 'Water velocity', min: 0, max: 5, step: 0.1, value: 1.5, unit: 'm/s' },
        { id: 'th', label: 'Bend angle θ', min: 5, max: 180, step: 1, value: 90, unit: '°' },
        { id: 'soil', type: 'select', label: 'Ground behind the block', options: [['Soft clay (50 kPa)', 50], ['Firm clay (100 kPa)', 100], ['Sand (150 kPa)', 150], ['Dense gravel (300 kPa)', 300]], value: 150 },
        { id: 'mag', type: 'check', label: 'Magnify the momentum arrows ×100', value: false }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['Q', 'Flow'], ['pA', 'Pressure force pA'], ['mom', 'Momentum flux ρQV'], ['R', 'Thrust on the bend'], ['t', 'In tonnes-force'], ['Ab', 'Bearing area of the block']]);
      const V = ctl.values;
      let o = null;
      function model() {
        const A = area(V.D / 1000), Q = A * V.v, pA = V.p * 1e5 * A, mom = WATER.rho * Q * V.v, th = V.th * Math.PI / 180;
        const R = 2 * (pA + mom) * Math.sin(th / 2), Ab = R / (V.soil * 1000);
        o = { A, Q, pA, mom, th, R, Ab };
        ro.set('Q', fmtFlow(Q) + ' (' + f1(Q * 3600, 0) + ' m³/h)');
        ro.set('pA', fmtForce(pA));
        ro.set('mom', fmtForce(mom) + (pA > 0 ? '  (' + f1(100 * mom / pA, 2) + ' % of pA)' : ''));
        ro.set('R', fmtForce(R));
        ro.set('t', f1(R / 9806.65, 1) + ' t');
        ro.set('Ab', f1(Ab, 2) + ' m² (e.g. ' + f1(Math.sqrt(Ab), 2) + ' m square)');
        const pts = [], ptsP = [];
        for (let a = 0; a <= 180; a += 3) { const s = Math.sin(a * Math.PI / 360); pts.push([a, 2 * (pA + mom) * s / 1000]); ptsP.push([a, 2 * pA * 1.5 * s / 1000]); }
        plot.set({ series: [{ pts, label: 'at ' + V.p + ' bar, ' + V.v + ' m/s' }, { pts: ptsP, label: 'test at 1.5 × the pressure, no flow', dash: [5, 4] }], marks: [{ x: V.th, y: R / 1000, label: fmtForce(R) }] });
      }
      const loop = kit.loop(() => {
        if (dirty || !o) { dirty = false; model(); }
        const c = st.begin(), C = kit.colors(), fr = frameOf(st, 760, 400);
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const BX = 330, BY = 300, RB = 60, wp = clamp(12 + V.D / 22, 14, 66), th = o.th;
        // the centreline: straight in from the left, an arc turning anticlockwise (up the screen), straight out
        const cl = [[40, BY]];
        for (let i = 0; i <= 30; i++) { const a = th * i / 30; cl.push([BX + RB * Math.sin(a), BY - RB + RB * Math.cos(a)]); }
        const ex = cl[cl.length - 1], dir = [Math.cos(th), -Math.sin(th)], Lout = 175;
        cl.push([ex[0] + dir[0] * Lout, ex[1] + dir[1] * Lout]);
        const pts = [[40, BY], [BX, BY]].concat(cl.slice(1));
        // offset the centreline for the walls
        const side = sg => pts.map((p, i) => {
          const q = pts[Math.min(i + 1, pts.length - 1)], r = pts[Math.max(i - 1, 0)], tx = q[0] - r[0], ty = q[1] - r[1], L = Math.hypot(tx, ty) || 1;
          return [p[0] - sg * ty / L * wp / 2, p[1] + sg * tx / L * wp / 2];
        });
        const w1 = side(1), w2 = side(-1);
        // the thrust block, on the outside of the bend, against hatched undisturbed ground
        const nb = [Math.sin(th / 2), Math.cos(th / 2)];                 // outward (screen) along the bisector
        const mid = [BX + RB * Math.sin(th / 2), BY - RB + RB * Math.cos(th / 2)];
        const bw = clamp(40 + 55 * Math.sqrt(o.Ab), 40, 230), bd = 34, t = [nb[1], -nb[0]];
        const c0 = [mid[0] + nb[0] * (wp / 2), mid[1] + nb[1] * (wp / 2)], c1 = [c0[0] + nb[0] * bd, c0[1] + nb[1] * bd];
        const blk = [[c0[0] - t[0] * bw * 0.35, c0[1] - t[1] * bw * 0.35], [c0[0] + t[0] * bw * 0.35, c0[1] + t[1] * bw * 0.35], [c1[0] + t[0] * bw / 2, c1[1] + t[1] * bw / 2], [c1[0] - t[0] * bw / 2, c1[1] - t[1] * bw / 2]];
        c.strokeStyle = C.faint; c.lineWidth = 1;
        for (let k = -8; k <= 8; k++) { const b = [c1[0] + t[0] * k * bw / 14, c1[1] + t[1] * k * bw / 14]; c.beginPath(); c.moveTo(b[0], b[1]); c.lineTo(b[0] + nb[0] * 12 + t[0] * 6, b[1] + nb[1] * 12 + t[1] * 6); c.stroke(); }
        c.fillStyle = C.dark ? 'rgba(170,170,170,0.35)' : 'rgba(120,120,120,0.28)'; c.strokeStyle = C.muted; c.lineWidth = 1.5;
        polyline(c, blk); c.closePath(); c.fill(); c.stroke();
        // pipe
        c.fillStyle = waterCol(C); polyline(c, w1.concat(w2.slice().reverse())); c.closePath(); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 2.2; polyline(c, w1); c.stroke(); polyline(c, w2); c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([6, 4]); polyline(c, pts); c.stroke(); c.setLineDash([]);
        // the control volume's faces and the forces on the water there
        const inF = [BX - 130, BY], outF = [ex[0] + dir[0] * 110, ex[1] + dir[1] * 110];
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.setLineDash([3, 3]);
        c.beginPath(); c.moveTo(inF[0], inF[1] - wp / 2 - 8); c.lineTo(inF[0], inF[1] + wp / 2 + 8); c.stroke();
        c.beginPath(); c.moveTo(outF[0] - dir[1] * (wp / 2 + 8), outF[1] + dir[0] * (wp / 2 + 8)); c.lineTo(outF[0] + dir[1] * (wp / 2 + 8), outF[1] - dir[0] * (wp / 2 + 8)); c.stroke(); c.setLineDash([]);
        const unit = 80 / Math.max(o.pA, o.mom * (V.mag ? 100 : 1), 1), lp = o.pA * unit, lm = o.mom * unit * (V.mag ? 100 : 1);
        const red = S.col('pressure'), blue = S.col('return');
        const nx = -dir[1] * 7, ny = dir[0] * 7;                          // side-by-side at the outlet face
        if (lp > 1) { kit.arrow(c, inF[0] - lp, inF[1] - 6, inF[0], inF[1] - 6, red, 3); kit.arrow(c, outF[0] + dir[0] * lp - nx, outF[1] + dir[1] * lp - ny, outF[0] - nx, outF[1] - ny, red, 3); }
        if (lm > 1) { kit.arrow(c, inF[0] - lm, inF[1] + 8, inF[0], inF[1] + 8, blue, 3); kit.arrow(c, outF[0] + nx, outF[1] + ny, outF[0] + dir[0] * lm + nx, outF[1] + dir[1] * lm + ny, blue, 3); }
        kit.label(c, 'pA', inF[0] - lp / 2, inF[1] - wp / 2 - 16, { color: red, size: 11.5, weight: 700, align: 'center' });
        kit.label(c, 'ρQV' + (V.mag ? ' ×100' : ''), inF[0] - Math.max(lm, 20) / 2, inF[1] + wp / 2 + 18, { color: blue, size: 11.5, weight: 700, align: 'center' });
        // resultant on the bend
        const lr = 40 + 100 * clamp(o.R / Math.max(2 * (o.pA + o.mom), 1), 0, 1), rs = [mid[0] - nb[0] * 4, mid[1] - nb[1] * 4];
        if (o.R > 0) kit.arrow(c, rs[0], rs[1], rs[0] + nb[0] * lr, rs[1] + nb[1] * lr, C.warn, 4);
        kit.label(c, 'R = ' + fmtForce(o.R), rs[0] + nb[0] * lr + 8, rs[1] + nb[1] * lr + 14, { color: C.warn, size: 13, weight: 700, bg: C.bg2 });
        kit.label(c, 'flow', 60, BY - wp / 2 - 12, { color: C.muted, size: 11 });
        kit.arrow(c, 90, BY - wp / 2 - 12, 120, BY - wp / 2 - 12, C.muted, 1.6);
        kit.label(c, 'θ = ' + V.th + '°   ' + V.D + ' mm   ' + V.p + ' bar', 20, 20, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'thrust block: ' + f1(o.Ab, 2) + ' m² of bearing against ' + V.soil + ' kPa ground', 20, 40, { color: C.muted, size: 11.5 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ draining a tank: Torricelli */
  Hyper.sim('flow-tank', {
    title: 'Draining a tank',
    blurb: `A round tank on a 1 m stand drains through an opening at the bottom of its wall. The level is integrated in small fixed steps from $A_t\\,dh/dt = Q_\\text{in} - C_d a\\sqrt{2gh}$; the clock runs faster than real time (shown) so a whole emptying takes about 20 seconds. The graph compares the level with Torricelli's prediction.

**Try this**
- Watch the level: it falls fast at first and ever more slowly — √h falls in a straight line.
- Compare the opening types: a bell-mouth drains the tank in 63 % of the time a sharp edge takes.
- Double the tank diameter: four times the water, four times the time. Double the hole: a quarter of the time.
- Add an inflow: the level settles where the outflow equals the inflow, at $h = (Q/C_d a)^2/2g$.
- Watch where the jet lands: $x = 2C_v\\sqrt{h\\,y}$ with the stand height $y$ — it creeps back towards the tank as the level falls.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'time' }, y: { label: 'depth over the opening (m)', min: 0 }, legend: true }, 160);
      const TYPES = { sharp: { cd: 0.61, cv: 0.98, cc: 0.62, name: 'sharp edge' }, tube: { cd: 0.82, cv: 0.82, cc: 1, name: 'short tube' }, borda: { cd: 0.52, cv: 0.98, cc: 0.53, name: 'Borda re-entrant' }, round: { cd: 0.97, cv: 0.98, cc: 0.99, name: 'bell-mouth' } };
      let s = null;
      const ctl = kit.controls(box.side, [
        { id: 'Dt', label: 'Tank diameter', min: 0.3, max: 3, step: 0.05, value: 1.2, unit: 'm' },
        { id: 'h0', label: 'Starting depth', min: 0.2, max: 4.5, step: 0.05, value: 2, unit: 'm' },
        { id: 'd', label: 'Opening diameter', min: 5, max: 100, value: 25, unit: 'mm', log: true, sig: 2 },
        { id: 'type', type: 'select', label: 'Opening', options: [['Sharp-edged orifice (Cd 0.61)', 'sharp'], ['Short tube (Cd 0.82)', 'tube'], ['Borda re-entrant tube (Cd 0.52)', 'borda'], ['Bell-mouth (Cd 0.97)', 'round']], value: 'sharp' },
        { id: 'Qin', label: 'Inflow', min: 0, max: 10, step: 0.1, value: 0, unit: 'L/s' },
        { type: 'buttons', items: [{ id: 'fill', label: 'Fill and restart', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], id => {
        if (id === 'fill' || id === 'h0' || id === 'Dt') restart();
        else if (id === 'pause') { if (s) s.paused = !s.paused; }
        else if (s) { s.t0 = s.t; s.hs = s.h; s.done = s.done && V.Qin <= 0; tune(); }
      });
      const ro = kit.readout(box.side, [['h', 'Depth over the opening'], ['Q', 'Outflow / inflow'], ['V', 'Jet speed'], ['t', 'Time since the start'], ['te', 'Time to empty from here (Torricelli)'], ['eq', 'Level where outflow = inflow'], ['sp', 'Clock speed']]);
      const V = ctl.values, HMAX = 5, STAND = 1;
      const T = () => TYPES[V.type] || TYPES.sharp;
      const outflow = h => T().cd * area(V.d / 1000) * Math.sqrt(2 * G * Math.max(h, 0));
      const dhdt = h => (V.Qin / 1000 - outflow(h)) / area(V.Dt);
      const tEmpty = h => area(V.Dt) / (T().cd * area(V.d / 1000)) * Math.sqrt(2 * Math.max(h, 0) / G);
      function tune() { if (s) { s.fac = clamp(tEmpty(V.h0) / 20, 1, 1e6); s.unit = tEmpty(V.h0) > 180 ? 60 : 1; } }
      function restart() { s = { h: V.h0, t: 0, t0: 0, hs: V.h0, hist: [[0, V.h0]], paused: false, tPlot: 0, done: false }; tune(); frameNo = 0; }
      let frameNo = 0;
      restart();
      const loop = kit.loop(dt => {
        // integrate: RK4 in 20 fixed sub-steps per frame
        if (!s.paused && !s.done) {
          const n = 20, h_ = dt * s.fac / n;
          for (let k = 0; k < n; k++) {
            const k1 = dhdt(s.h), k2 = dhdt(s.h + h_ / 2 * k1), k3 = dhdt(s.h + h_ / 2 * k2), k4 = dhdt(s.h + h_ * k3);
            s.h = clamp(s.h + h_ / 6 * (k1 + 2 * k2 + 2 * k3 + k4), 0, HMAX); s.t += h_;
            if (s.h < 1e-4 && V.Qin <= 0) { s.h = 0; s.done = true; break; }
          }
          s.tPlot += dt;
          if (s.tPlot > 0.12) { s.tPlot = 0; s.hist.push([s.t, s.h]); if (s.hist.length > 400) s.hist.splice(1, 1); }
        }
        const u = s.unit, kq = T().cd * area(V.d / 1000) * Math.sqrt(G / 2) / area(V.Dt);   // √h falls at this rate with no inflow
        const pred = [];
        for (let i = 0; i <= 40; i++) { const tt = s.t0 + i / 40 * (Math.sqrt(s.hs) / Math.max(kq, 1e-12)); pred.push([tt / u, Math.pow(Math.max(0, Math.sqrt(s.hs) - kq * (tt - s.t0)), 2)]); }
        frameNo++;
        if (frameNo % 6 === 1 || s.paused) {
          const heq = V.Qin > 0 ? Math.pow(V.Qin / 1000 / (T().cd * area(V.d / 1000)), 2) / (2 * G) : null;
          plot.set({ series: [{ pts: s.hist.map(p => [p[0] / u, p[1]]), label: 'level' }, { pts: pred, label: 'Torricelli, no inflow', dash: [5, 4] }],
            x: { label: u === 60 ? 'time (min)' : 'time (s)', min: 0 }, hlines: heq != null && heq < HMAX ? [{ y: heq, label: 'outflow = inflow' }] : [] });
        }
        const Qo = outflow(s.h), vj = T().cv * Math.sqrt(2 * G * s.h);
        ro.set('h', f1(s.h, 3) + ' m');
        ro.set('Q', f1(Qo * 1000, 2) + ' / ' + f1(V.Qin, 1) + ' L/s');
        ro.set('V', f1(vj, 2) + ' m/s');
        ro.set('t', fmtTime(s.t) + (s.done ? ' — empty' : s.paused ? ' (paused)' : ''));
        ro.set('te', V.Qin > 0 ? 'never quite, with the inflow' : fmtTime(tEmpty(s.h)));
        const heq = V.Qin > 0 ? Math.pow(V.Qin / 1000 / (T().cd * area(V.d / 1000)), 2) / (2 * G) : 0;
        ro.set('eq', V.Qin > 0 ? (heq > HMAX ? 'above the rim: the tank overflows' : f1(heq, 2) + ' m') : '—');
        ro.set('sp', '×' + (s.fac >= 100 ? Math.round(s.fac).toLocaleString('en-GB') : f1(s.fac, 1)));
        // ---- drawing, 760 × 400, 58 px per metre
        const c = st.begin(), C = kit.colors(), fr = frameOf(st, 760, 400);
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const PX = 58, floorY = 385, bot = floorY - STAND * PX, tw = 40 + 60 * V.Dt, xl = 70, xr = xl + tw;
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(10, floorY); c.lineTo(750, floorY); c.stroke();
        for (let x = 14; x < 750; x += 16) { c.beginPath(); c.moveTo(x, floorY); c.lineTo(x - 7, floorY + 8); c.stroke(); }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(xl + 8, bot); c.lineTo(xl + 8, floorY); c.moveTo(xr - 8, bot); c.lineTo(xr - 8, floorY); c.stroke();
        // water and tank
        const y0 = bot - 6, yh = y0 - s.h * PX, top = y0 - HMAX * PX;      // depths are measured from the centre of the opening
        c.fillStyle = waterCol(C, C.dark ? 0.4 : 0.25); c.fillRect(xl, yh, tw, bot - yh);
        c.strokeStyle = C.text; c.lineWidth = 2.5; c.beginPath(); c.moveTo(xl, top); c.lineTo(xl, bot); c.lineTo(xr, bot); c.moveTo(xr, bot - 12); c.lineTo(xr, top); c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1;
        for (let m = 1; m <= HMAX; m++) { c.beginPath(); c.moveTo(xl - 6, y0 - m * PX); c.lineTo(xl, y0 - m * PX); c.stroke(); kit.label(c, m + ' m', xl - 9, y0 - m * PX, { color: C.muted, size: 10, align: 'right' }); }
        kit.label(c, 'h = ' + f1(s.h, 2) + ' m', xl + tw / 2 + (V.Qin > 0 ? 12 : 0), Math.min(yh - 10, bot - 16), { color: C.text, size: 12, weight: 700, align: 'center' });
        // the inflow
        if (V.Qin > 0) {
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(xl - 40, top - 12); c.lineTo(xl + 20, top - 12); c.stroke();
          c.strokeStyle = waterCol(C, 0.8); c.lineWidth = clamp(1 + V.Qin, 2, 8); c.beginPath(); c.moveTo(xl + 20, top - 12); c.lineTo(xl + 20, yh); c.stroke();
        }
        // the jet: a parabola from the opening to the floor
        if (s.h > 1e-3) {
          const jw = clamp(V.d * Math.sqrt(T().cc) * 0.12, 1.5, 10), drop = (floorY - y0) / PX;
          const tl = Math.sqrt(2 * drop / G), pts = [];
          for (let i = 0; i <= 30; i++) { const tt = tl * i / 30; pts.push([xr + vj * tt * PX, y0 + 0.5 * G * tt * tt * PX]); }
          c.strokeStyle = waterCol(C, 0.85); c.lineWidth = jw; c.lineCap = 'round'; polyline(c, pts); c.stroke(); c.lineCap = 'butt';
          const land = xr + vj * tl * PX;
          kit.label(c, 'lands ' + f1(vj * tl, 2) + ' m from the tank', land < 560 ? land + 10 : land - 10, floorY - 12, { color: C.muted, size: 11, align: land < 560 ? 'left' : 'right' });
        }
        kit.label(c, T().name + ', ' + f1(V.d, 0) + ' mm', xr + 8, bot - 26, { color: C.muted, size: 11 });
        kit.label(c, 'clock ×' + (s.fac >= 100 ? Math.round(s.fac) : f1(s.fac, 1)) + (s.done ? '   empty after ' + fmtTime(s.t) : ''), 740, 20, { color: s.done ? C.ok : C.muted, size: 12, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ venturi meter and orifice plate */
  Hyper.sim('flow-venturi', {
    title: 'Venturi meter and orifice plate',
    blurb: `Water at 20 °C flows through a differential meter — a classical venturi tube (7° or 15° diffuser) or a square-edged orifice plate with D and D/2 tappings — connected to a U-tube manometer. The meter's reading is turned back into a flow with its discharge coefficient; the graph shows the pressure along the meter, with the drop that is measured and the part that is never recovered.

**Try this**
- Double the flow: the manometer reading rises four times — the square-root law.
- Switch from the venturi to the orifice plate at the same flow: the reading is about 2.6 times larger, and most of it is lost for good.
- Compare the 7° and 15° diffusers: the gentler cone loses less.
- Lower the upstream pressure and raise the flow with a small β: the throat pressure falls towards the vapour pressure and the meter cavitates.
- Change to the lighter manometer liquid: the same pressure gives a reading eight times longer.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'distance along the meter (pipe diameters)' }, y: { label: 'pressure (kPa, gauge)' }, legend: true }, 160);
      let dirty = true;
      const start = params && params.meter === 'orifice' ? 'orifice' : 'v15';
      const ctl = kit.controls(box.side, [
        { id: 'meter', type: 'select', label: 'Meter', options: [['Venturi tube, 15° diffuser', 'v15'], ['Venturi tube, 7° diffuser', 'v7'], ['Orifice plate (D and D/2 tappings)', 'orifice']], value: start },
        { id: 'Q', label: 'Flow', min: 2, max: 400, value: 100, unit: 'L/s', log: true, sig: 3 },
        { id: 'D', label: 'Pipe bore D', min: 100, max: 500, step: 10, value: 300, unit: 'mm' },
        { id: 'beta', label: 'Diameter ratio β = d/D', min: 0.3, max: 0.8, step: 0.01, value: 0.5 },
        { id: 'p1', label: 'Upstream pressure (gauge)', min: 20, max: 600, step: 5, value: 150, unit: 'kPa' },
        { id: 'man', type: 'select', label: 'Manometer liquid', options: [['Mercury (13 546 kg/m³)', 13546], ['Heavy liquid (2 600 kg/m³)', 2600]], value: 13546 }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['V', 'Pipe / throat velocity'], ['dp', 'Differential Δp'], ['dh', 'Manometer reading Δh'], ['Qr', 'Flow from the reading'], ['loss', 'Permanent loss'], ['pw', 'Power lost'], ['pt', 'Lowest pressure (absolute)']]);
      const V = ctl.values, rho = WATER.rho;
      let o = null, rs = rng(3);
      const dots = [];
      for (let i = 0; i < 90; i++) dots.push({ x: rs() * 1.0, e: (rs() * 2 - 1) * 0.85 });
      function geom() {
        const b = V.beta, orifice = V.meter === 'orifice', half = (1 - b) / 2;
        if (orifice) { const xp = 2.2; return { orifice, b, xp, Ltot: 9.5, taps: [xp - 1, xp + 0.5] }; }
        const Lc = half / Math.tan(10.5 * Math.PI / 180), Lt = b, Ld = half / Math.tan((V.meter === 'v7' ? 3.5 : 7.5) * Math.PI / 180);
        const x0 = 1.5, x1 = x0 + Lc, x2 = x1 + Lt, x3 = x2 + Ld;
        return { orifice, b, x0, x1, x2, x3, Ltot: x3 + 1.2, taps: [x0 - 0.6, x1 + Lt / 2] };
      }
      // the radius of the stream (wall for the venturi; the contracting jet for the orifice), in pipe radii
      function streamR(gm, x) {
        if (!gm.orifice) {
          if (x < gm.x0 || x > gm.x3) return 1;
          if (x < gm.x1) return 1 - (1 - gm.b) * (x - gm.x0) / (gm.x1 - gm.x0);
          if (x < gm.x2) return gm.b;
          return gm.b + (1 - gm.b) * (x - gm.x2) / (gm.x3 - gm.x2);
        }
        const rvc = gm.b * Math.sqrt(0.62), xp = gm.xp;
        if (x < xp - 0.6) return 1;
        if (x < xp) { const t = (x - (xp - 0.6)) / 0.6; return 1 - (1 - gm.b) * t * t; }
        if (x < xp + 0.5) return gm.b - (gm.b - rvc) * (x - xp) / 0.5;
        if (x < xp + 4.5) return rvc + (1 - rvc) * (1 - Math.pow(1 - (x - xp - 0.5) / 4, 2));
        return 1;
      }
      function model() {
        const gm = geom(), D = V.D / 1000, A = area(D), a = area(D * gm.b), C = gm.orifice ? 0.61 : 0.985;
        // the lowest pressure cannot fall below the vapour pressure: beyond that flow the meter cavitates and chokes
        const dpMax = Math.max(V.p1 * 1000 + PATM - WATER.pv, 0), Qmax = C * a * Math.sqrt(2 * dpMax / (rho * (1 - Math.pow(gm.b, 4))));
        const Qask = V.Q / 1000, Q = Math.min(Qask, Qmax), choked = Qask > Qmax;
        const dp = 0.5 * rho * (1 - Math.pow(gm.b, 4)) * Math.pow(Q / (C * a), 2);
        let lossFr;
        if (gm.orifice) { const b2 = gm.b * gm.b, sq = Math.sqrt(1 - b2 * b2 * (1 - C * C)); lossFr = (sq - C * b2) / (sq + C * b2); }
        else lossFr = V.meter === 'v7' ? 0.08 : 0.14;
        const rm = +V.man, dh = dp / ((rm - rho) * G);
        const Qr = C * a * Math.sqrt(2 * dp / (rho * (1 - Math.pow(gm.b, 4))));
        const p1 = V.p1 * 1000, pmin = p1 - dp;
        o = { gm, D, A, a, Q, Qask, Cd: C, dp, lossFr, loss: lossFr * dp, dh, rm, Qr, p1, pmin, v1: Q / A, vt: Q / a, cav: choked };
        // pressure along the meter
        const pts = [], nP = 160;
        for (let i = 0; i <= nP; i++) {
          const x = gm.Ltot * i / nP;
          let p;
          if (!gm.orifice) {
            const r = streamR(gm, x), vx = o.v1 / (r * r), vv = (vx * vx - o.v1 * o.v1) / (o.vt * o.vt - o.v1 * o.v1);
            if (x < gm.x2) p = p1 - dp * vv;
            else if (x < gm.x3) p = p1 - dp * vv - o.loss * (x - gm.x2) / (gm.x3 - gm.x2);
            else p = p1 - o.loss;
          } else {
            const xp = gm.xp;
            if (x < xp - 0.3) p = p1;
            else if (x < xp) p = p1 + 0.03 * dp * (x - xp + 0.3) / 0.3;
            else if (x < xp + 0.5) p = p1 + 0.03 * dp - 1.03 * dp * Math.sin((x - xp) / 0.5 * Math.PI / 2);
            else p = p1 - o.loss - (dp - o.loss) * Math.exp(-(x - xp - 0.5) / 1.3);
          }
          pts.push([x, p / 1000]);
        }
        plot.set({ series: [{ pts, label: 'pressure along the meter' }], vlines: gm.taps.map((x, i) => ({ x, label: i ? 'tap 2' : 'tap 1' })),
          hlines: [{ y: (p1 - o.loss) / 1000, label: 'after recovery: ' + f1(o.loss / 1000, 1) + ' kPa lost' }].concat(o.cav || pmin < 0 ? [{ y: (WATER.pv - PATM) / 1000, label: 'vapour pressure' }] : []),
          x: { label: 'distance along the meter (pipe diameters)', min: 0, max: gm.Ltot } });
        ro.set('V', f1(o.v1, 2) + ' / ' + f1(o.vt, 2) + ' m/s');
        ro.set('dp', f1(dp / 1000, 2) + ' kPa');
        ro.set('dh', dh * 1000 > 2000 ? f1(dh, 2) + ' m — too long: use a transmitter' : f1(dh * 1000, 1) + ' mm');
        ro.set('Qr', f1(Qr * 1000, 1) + ' L/s (C = ' + C + ')');
        ro.set('loss', f1(o.loss / 1000, 2) + ' kPa (' + f1(lossFr * 100, 0) + ' % of Δp)');
        ro.set('pw', fmtPower(o.loss * Q));
        ro.set('pt', o.cav ? f1(WATER.pv / 1000, 1) + ' kPa: vapour pressure — the meter cavitates and the flow is choked at ' + f1(Q * 1000, 1) + ' L/s (' + f1(Qask * 1000, 0) + ' asked)' : f1((pmin + PATM) / 1000, 1) + ' kPa');
      }
      const loop = kit.loop(dt => {
        if (dirty || !o) { dirty = false; model(); }
        const gm = o.gm, c = st.begin(), C = kit.colors(), fr = frameOf(st, 760, 400);
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const DPX = Math.min(90, 690 / gm.Ltot), R = clamp(DPX / 2, 14, 45), XL = (760 - gm.Ltot * DPX) / 2, X = x => XL + x * DPX, YC = 110;
        // walls
        const wallR = x => (gm.orifice ? 1 : streamR(gm, x));
        const up = [], dn = [];
        for (let i = 0; i <= 200; i++) { const x = gm.Ltot * i / 200; up.push([X(x), YC - wallR(x) * R]); dn.push([X(x), YC + wallR(x) * R]); }
        c.fillStyle = waterCol(C); polyline(c, up.concat(dn.slice().reverse())); c.closePath(); c.fill();
        if (gm.orifice) {                                              // the contracting jet and the eddies around it
          const js = [], jd = [];
          for (let i = 0; i <= 100; i++) { const x = gm.xp + 5 * i / 100; js.push([X(x), YC - streamR(gm, x) * R]); jd.push([X(x), YC + streamR(gm, x) * R]); }
          c.strokeStyle = waterCol(C, 0.9); c.lineWidth = 1.2; c.setLineDash([4, 3]); polyline(c, js); c.stroke(); polyline(c, jd); c.stroke(); c.setLineDash([]);
          c.strokeStyle = C.faint; c.lineWidth = 1;
          for (const sg of [-1, 1]) for (const xx of [0.9, 1.9]) { c.beginPath(); c.arc(X(gm.xp + xx), YC + sg * R * 0.78, R * 0.16, 0, Math.PI * 1.6); c.stroke(); }
        }
        // tracer dots at the local speed, following the stream's width
        const rmin = gm.orifice ? gm.b * Math.sqrt(0.62) : gm.b, vfast = o.v1 / (rmin * rmin);
        for (const d of dots) {                                        // drawn speeds: the fastest point moves at 300 px/s
          const r = streamR(gm, d.x * gm.Ltot), v = o.v1 / (r * r);
          d.x += v / Math.max(vfast, o.v1, 1e-9) * 300 * dt / (gm.Ltot * DPX); if (d.x > 1) d.x -= 1;
          const rr = streamR(gm, d.x * gm.Ltot);
          kit.dot(c, X(d.x * gm.Ltot), YC + d.e * rr * R, 2, C.accent);
        }
        c.strokeStyle = C.text; c.lineWidth = 2.4; polyline(c, up); c.stroke(); polyline(c, dn); c.stroke();
        if (gm.orifice) { c.fillStyle = C.text; c.fillRect(X(gm.xp) - 2.5, YC - R - 6, 5, R * (1 - gm.b) + 6); c.fillRect(X(gm.xp) - 2.5, YC + gm.b * R, 5, R * (1 - gm.b) + 6); }
        if (o.cav) { c.strokeStyle = C.bad; c.lineWidth = 1; const xc = gm.orifice ? gm.xp + 0.6 : (gm.x1 + gm.x2) / 2; for (let k = 0; k < 7; k++) { c.beginPath(); c.arc(X(xc) + (k - 3) * 6, YC + ((k % 3) - 1) * R * 0.25, 2.4, 0, Math.PI * 2); c.stroke(); } kit.label(c, 'cavitation: flow choked at ' + f1(o.Q * 1000, 1) + ' L/s', X(xc), YC - R - 16, { color: C.bad, size: 12, weight: 700, align: 'center', bg: C.bg2 }); }
        // the U-tube manometer
        const xa = X(gm.taps[0]), xb = X(gm.taps[1]), ya = YC + wallR(gm.taps[0]) * R, yb = YC + wallR(gm.taps[1]) * R, yBot = 380, yRest = 300;
        const ranges = [50, 100, 200, 500, 1000, 2000], dhmm = o.dh * 1000, full = ranges.find(r => r >= dhmm) || 2000, kpx = 140 / full;
        const half = Math.min(dhmm, full) * kpx / 2, yl = yRest + half, yr = yRest - half;   // the high-pressure leg goes down
        const tube = 7;
        c.fillStyle = waterCol(C, 0.45);
        c.fillRect(xa - tube / 2, ya, tube, yl - ya); c.fillRect(xb - tube / 2, yb, tube, yr - yb);
        c.fillStyle = o.rm > 10000 ? (C.dark ? '#c9ced8' : '#7d8594') : kit.hue(330, 0.75);
        c.fillRect(xa - tube / 2, yl, tube, yBot - yl); c.fillRect(xb - tube / 2, yr, tube, yBot - yr); c.fillRect(xa - tube / 2, yBot - tube, xb - xa + tube, tube);
        c.strokeStyle = C.text; c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(xa - tube / 2, ya); c.lineTo(xa - tube / 2, yBot); c.lineTo(xb + tube / 2, yBot); c.lineTo(xb + tube / 2, yb); c.moveTo(xa + tube / 2, ya); c.lineTo(xa + tube / 2, yBot - tube); c.lineTo(xb - tube / 2, yBot - tube); c.lineTo(xb - tube / 2, yb); c.stroke();
        // scale beside the right leg: the reading Δh is twice the rise of that leg
        const sx = xb + 16;
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(sx, yRest - 70); c.lineTo(sx, yRest); c.stroke();
        for (let i = 0; i <= 2; i++) { const yy = yRest - i * 35; c.beginPath(); c.moveTo(sx, yy); c.lineTo(sx + 5, yy); c.stroke(); kit.label(c, f1(i * full / 2, 0), sx + 8, yy, { color: C.muted, size: 9.5 }); }
        kit.label(c, 'Δh, mm', sx + 8, yRest - 84, { color: C.muted, size: 10 });
        c.strokeStyle = C.warn; c.lineWidth = 1.2; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(xa - 14, yl); c.lineTo(sx, yl); c.moveTo(xb - 14, yr); c.lineTo(sx, yr); c.stroke(); c.setLineDash([]);
        kit.label(c, (dhmm > full ? 'Δh > ' + full + ' mm (off scale)' : 'Δh = ' + f1(dhmm, 1) + ' mm'), sx + 44, yRest, { color: dhmm > full ? C.bad : C.warn, size: 12.5, weight: 700 });
        kit.label(c, 'tap 1', xa - 8, ya + 12, { color: C.muted, size: 10, align: 'right' });
        kit.label(c, 'tap 2', xb - 8, yb + 12, { color: C.muted, size: 10, align: 'right' });
        kit.label(c, (gm.orifice ? 'orifice plate' : 'venturi tube') + ', β = ' + f1(gm.b, 2) + ', D = ' + V.D + ' mm', 20, 20, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'Q = ' + f1(o.Q * 1000, 1) + ' L/s   Δp = ' + f1(o.dp / 1000, 2) + ' kPa   lost for good: ' + f1(o.loss / 1000, 2) + ' kPa', 740, 20, { color: C.muted, size: 11.5, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
