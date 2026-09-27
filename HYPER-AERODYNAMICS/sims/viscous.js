/* HYPER-AERODYNAMICS · sims/viscous.js — simulations for the branch "Viscosity and Boundary Layers".
 *   visc-plate-bl       the boundary layer on a flat plate: laminar (Blasius) and turbulent (1/7 law),
 *                       growth, transition, velocity profiles, δ, δ*, θ, H, c_f and τ_w
 *   visc-transition     where a layer turns turbulent: free-stream turbulence (Abu-Ghannam–Shaw fit),
 *                       roughness (Re_k ≈ 600), turbulent spots, wedges, local c_f and plate drag
 *   visc-skin-friction  the skin-friction chart: laminar, turbulent, mixed and rough C_f for real objects
 *   visc-separation     a planar diffuser: Head's integral method along the walls, separation, stall,
 *                       pressure recovery, with vortex generators or a suction slot
 *   visc-drag-crisis    C_D of spheres, a golf ball and a cylinder against Re; separation angle and wake
 *   visc-vortex-street  a Kármán vortex street behind a cylinder, the Strouhal number and the side force
 *   visc-cascade        turbulence: the energy spectrum (−5/3), Kolmogorov scales and a synthetic eddy field
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ss = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const lg = Math.log10;
  const plotBox = (box) => { const d = document.createElement('div'); d.style.padding = '4px 10px 10px'; box.stage.appendChild(d); return d; };

  /* ---------------------------------------------------------------- fluids */
  const FLUIDS = [['Air, sea level (ISA)', 'air0'], ['Air at 11 000 m (ISA)', 'air11'], ['Water, 20 °C', 'water']];
  function fluidProps(F, id) {
    if (id === 'water') return { rho: 998, nu: 1.0e-6, air: false, name: 'water' };
    const a = F.isa(id === 'air11' ? 11000 : 0);
    return { rho: a.rho, nu: a.nu, air: true, name: id === 'air11' ? 'air at 11 km' : 'air' };
  }
  function fmtLen(m) {
    const a = Math.abs(m);
    if (!Number.isFinite(a)) return '—';
    if (a >= 1) return (+m.toPrecision(3)) + ' m';
    if (a >= 1e-3) return (+(m * 1e3).toPrecision(3)) + ' mm';
    if (a >= 1e-6) return (+(m * 1e6).toPrecision(3)) + ' µm';
    return (+(m * 1e9).toPrecision(3)) + ' nm';
  }
  function fmtTime(s) {
    if (s >= 1) return (+s.toPrecision(3)) + ' s';
    if (s >= 1e-3) return (+(s * 1e3).toPrecision(3)) + ' ms';
    return (+(s * 1e6).toPrecision(3)) + ' µs';
  }

  /* ---------------------------------------------------------------- the Blasius profile, tabulated once */
  let BLA = null;
  function blasiusTable() {
    if (BLA) return BLA;
    const h = 0.01, N = 1000, fp = new Float64Array(N + 1);
    let f = 0, g = 0, q = 0.332057;
    const d = (f, g, q) => [g, q, -0.5 * f * q];
    for (let i = 0; i < N; i++) {
      const k1 = d(f, g, q), k2 = d(f + h / 2 * k1[0], g + h / 2 * k1[1], q + h / 2 * k1[2]);
      const k3 = d(f + h / 2 * k2[0], g + h / 2 * k2[1], q + h / 2 * k2[2]), k4 = d(f + h * k3[0], g + h * k3[1], q + h * k3[2]);
      f += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
      g += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      q += h / 6 * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
      fp[i + 1] = g;
    }
    BLA = { h, N, fp };
    return BLA;
  }
  function blasiusU(eta) {                       // u/U at η = y √(U/νx)
    const b = blasiusTable();
    if (!(eta > 0)) return 0;
    const s = eta / b.h;
    if (s >= b.N) return 1;
    const i = Math.floor(s), t = s - i;
    return Math.min(1, b.fp[i] * (1 - t) + b.fp[i + 1] * t);
  }

  /* ---------------------------------------------------------------- flat-plate layers */
  // turbulent layer after transition at xtr, from a virtual origin chosen so that θ is continuous
  function virtualOrigin(xtr, U, nu) {
    if (!(xtr > 0) || !Number.isFinite(xtr)) return 0;
    const th = 0.664 * xtr / Math.sqrt(U * xtr / nu);
    const xi = Math.pow(th / (0.035972 * Math.pow(nu / U, 0.2)), 1.25);
    return xtr - xi;
  }
  // the layer at x on a plate whose layer turns turbulent at xtr (Infinity: laminar, 0: from the leading edge)
  function plateAt(F, x, U, nu, xtr) {
    if (!(x > 0)) return { lam: true, Re: 0, delta: 0, dstar: 0, theta: 0, cf: 0 };
    const Re = U * x / nu;
    if (x < xtr) {
      const s = Math.sqrt(Re);
      return { lam: true, Re, delta: F.blasiusDelta(x, Re), dstar: 1.7208 * x / s, theta: 0.664 * x / s, cf: 0.664 / s };
    }
    const xi = Math.max(x - virtualOrigin(xtr, U, nu), 1e-9), Rxi = U * xi / nu;
    const delta = F.turbDelta(xi, Rxi);
    return { lam: false, Re, delta, dstar: delta / 8, theta: 7 * delta / 72, cf: 0.0592 / Math.pow(Rxi, 0.2) };
  }
  // u/U at height y (m) in that layer
  function uRatio(p, y, x, U, nu) {
    if (!(x > 0)) return 1;
    if (p.lam) return blasiusU(y / Math.sqrt(nu * x / U));
    return y >= p.delta ? 1 : Math.pow(Math.max(y, 0) / p.delta, 1 / 7);
  }
  const speedColour = (kit, r, a) => kit.hue(28 + 177 * clamp(r, 0, 1), a);   // slow = orange, fast = blue

  /* ================================================================ 1. the boundary layer on a flat plate */
  Hyper.sim('visc-plate-bl', {
    title: 'Boundary layer on a flat plate',
    blurb: `Air flows over a thin flat plate. The coloured band is the boundary layer — drawn many times thicker than it really is (the magnification is shown) — with tracer particles coloured by speed, from orange (slow) to blue (fast). The arrows show the velocity profile at the chosen station, and the graph below plots it: the Blasius profile while the layer is laminar, the 1/7-power law once it is turbulent (the other kind is dashed for comparison).

**Try this**
- Move the station from the leading edge to the trailing edge: the laminar layer thickens as √x, and the wall shear stress falls.
- Lower the speed to 5 m/s: the plate is laminar all the way. Raise it again: transition appears where Re_x ≈ 5 × 10⁵ and moves forward as the speed rises. Put the station just behind it and watch δ jump, H drop from 2.59 to about 1.3, and c_f rise several-fold.
- Compare the profiles at the same station: the turbulent one is much fuller near the wall.
- Switch to water: its kinematic viscosity is 15 times smaller, so at the same speed the layer is thinner and turns turbulent much sooner.
- Choose "tripped" to see a layer that is turbulent from the leading edge, as on most of a car.`,
    mount(box, kit, params) {
      params = params || {};
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const gb = plotBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'U', label: 'Stream speed', min: 0.5, max: 80, value: params.U || 10, unit: 'm/s', log: true, sig: 3 },
        { id: 'L', label: 'Plate length', min: 0.1, max: 5, value: 1, unit: 'm', log: true, sig: 2 },
        { id: 'fluid', type: 'select', label: 'Fluid', options: FLUIDS, value: 'air0' },
        { id: 'mode', type: 'select', label: 'Boundary layer', options: [['Natural transition at Re_x ≈ 5 × 10⁵', 'natural'], ['Tripped at the leading edge', 'tripped'], ['Laminar all the way (hypothetical)', 'laminar']], value: params.mode || 'natural' },
        { id: 'xs', label: 'Profile station x/L', min: 0.02, max: 1, step: 0.01, value: params.station || 0.6 }
      ], () => refresh());
      const ro = kit.readout(box.side, [['re', 'Re_x at the station'], ['state', 'Layer there'], ['d', 'Thickness δ (99 %)'], ['ds', 'Displacement thickness δ*'], ['th', 'Momentum thickness θ'],
        ['H', 'Shape factor H = δ*/θ'], ['cf', 'Local skin friction c_f'], ['tw', 'Wall shear stress τ_w'], ['tr', 'Transition']]);
      const plot = kit.plot(gb, { x: { label: 'u / U', min: 0, max: 1.05 }, y: { label: 'height y (mm)', min: 0 }, legend: true }, 190);
      const V = ctl.values;
      let S = null;
      function compute() {
        const fl = fluidProps(F, V.fluid), U = V.U, L = V.L, nu = fl.nu;
        const xtr = V.mode === 'tripped' ? 0 : V.mode === 'laminar' ? Infinity : 5e5 * nu / U;
        const N = 160, prof = [];
        let dmax = 0;
        for (let i = 0; i <= N; i++) { const p = plateAt(F, L * i / N, U, nu, xtr); prof.push(p); if (p.delta > dmax) dmax = p.delta; }
        const xs = Math.max(1e-6, V.xs * L);
        return { fl, U, L, nu, rho: fl.rho, xtr, prof, dmax: dmax || 1e-4, xs, ps: plateAt(F, xs, U, nu, xtr) };
      }
      const profilePts = (p, x) => {
        const pts = [];
        if (p.lam) { const s = Math.sqrt(S.nu * x / S.U); for (let e = 0; e <= 8.001; e += 0.1) pts.push([blasiusU(e), e * s * 1000]); }
        else { for (let i = 0; i <= 60; i++) pts.push([Math.pow(i / 60, 1 / 7), p.delta * i / 60 * 1000]); pts.push([1, p.delta * 2000]); }
        return pts;
      };
      function refresh() {
        S = compute();
        const p = S.ps, q = 0.5 * S.rho * S.U * S.U;
        const alt = p.lam ? plateAt(F, S.xs, S.U, S.nu, 0) : plateAt(F, S.xs, S.U, S.nu, Infinity);
        ro.set('re', kit.fmt(p.Re, 3));
        ro.set('state', p.lam ? 'laminar' : 'turbulent');
        ro.set('d', fmtLen(p.delta)); ro.set('ds', fmtLen(p.dstar)); ro.set('th', fmtLen(p.theta));
        ro.set('H', (p.dstar / (p.theta || 1)).toFixed(2));
        ro.set('cf', kit.fmt(p.cf, 3));
        ro.set('tw', kit.fmt(p.cf * q, 3) + ' Pa');
        const ReL = S.U * S.L / S.nu;
        ro.set('tr', V.mode === 'tripped' ? 'at the leading edge (tripped)' : V.mode === 'laminar' ? 'suppressed (hypothetical)' :
          S.xtr < S.L ? 'at x = ' + fmtLen(S.xtr) + ' (Re_L = ' + kit.fmt(ReL, 2) + ')' : 'not on this plate (Re_L = ' + kit.fmt(ReL, 2) + ' < 5 × 10⁵)');
        const ymax = 1.25 * Math.max(p.delta, alt.delta) * 1000;
        plot.set({
          y: { label: 'height y (mm)', min: 0, max: ymax || 1 },
          series: [
            { pts: profilePts(p, S.xs), label: p.lam ? 'laminar (Blasius) — this layer' : 'turbulent (1/7 law) — this layer' },
            { pts: profilePts(alt, S.xs), label: alt.lam ? 'if it were still laminar' : 'if it were turbulent', dash: [6, 4] }
          ],
          hlines: [{ y: p.delta * 1000, label: 'δ' }, { y: p.dstar * 1000, label: 'δ*' }, { y: p.theta * 1000, label: 'θ' }]
        });
        loop.once();
      }
      // tracer particles: x as a fraction of L (negative upstream), y as a fraction of the height shown
      const parts = [];
      for (let i = 0; i < 230; i++) parts.push({ x: Math.random() * 1.1 - 0.08, y: Math.pow(Math.random(), 1.5) });
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const X0 = 44, X1 = st.W - 86, yP = st.H - 34, top = 30;
        const sx = (X1 - X0) / S.L, Ymax = 1.45 * S.dmax, sy = (yP - top) / Ymax;
        const X = x => X0 + x * sx, Y = y => yP - y * sy;
        // the layer, laminar and turbulent parts
        const N = S.prof.length - 1;
        for (const lamPart of [true, false]) {
          c.beginPath();
          let open = false, lastX = 0;
          for (let i = 0; i <= N; i++) {
            const p = S.prof[i];
            if (p.lam !== lamPart) continue;
            const x = S.L * i / N;
            if (!open) { c.moveTo(X(x), yP); open = true; }
            c.lineTo(X(x), Y(p.delta)); lastX = x;
          }
          if (open) { c.lineTo(X(lastX), yP); c.closePath(); c.fillStyle = kit.hue(lamPart ? 205 : 28, 0.16); c.fill(); }
        }
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath();
        S.prof.forEach((p, i) => { const x = X(S.L * i / N), y = Y(p.delta); i ? c.lineTo(x, y) : c.moveTo(x, y); });
        c.stroke();
        c.setLineDash([5, 4]); c.strokeStyle = C.faint; c.beginPath();
        S.prof.forEach((p, i) => { const x = X(S.L * i / N), y = Y(p.dstar); i ? c.lineTo(x, y) : c.moveTo(x, y); });
        c.stroke(); c.setLineDash([]);
        // particles
        const turbJit = 2.4;
        for (const q of parts) {
          const xm = q.x * S.L, ym = q.y * Ymax;
          let r = 1;
          if (xm > 0) {
            const p = plateAt(F, Math.min(xm, S.L), S.U, S.nu, S.xtr);
            r = uRatio(p, ym, Math.min(xm, S.L), S.U, S.nu);
            if (!p.lam && ym < 1.1 * p.delta) q.y = clamp(q.y + (Math.random() - 0.5) * turbJit * dt * (p.delta / Ymax) * 3, 0.004, 1);
          }
          q.x += r * dt / 3.5;
          if (q.x > (st.W - X0) / (X1 - X0)) { q.x = -0.05 - Math.random() * 0.08; q.y = Math.max(0.004, Math.pow(Math.random(), 1.5)); }
          const px = X(q.x * S.L), py = Y(q.y * Ymax);
          if (px < 2 || py < top - 8) continue;
          c.fillStyle = speedColour(kit, r, 0.85);
          c.fillRect(px - 1.3, py - 1.3, 2.6, 2.6);
        }
        // the plate
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(X0 - 6, yP + 4); c.lineTo(X0, yP); c.lineTo(X1, yP); c.lineTo(X1, yP + 8); c.lineTo(X0, yP + 8); c.closePath(); c.fill(); c.stroke();
        // transition
        if (S.xtr > 0 && S.xtr < S.L) {
          const xt = X(S.xtr);
          c.setLineDash([3, 4]); c.strokeStyle = C.warn; c.beginPath(); c.moveTo(xt, yP); c.lineTo(xt, top); c.stroke(); c.setLineDash([]);
          kit.label(c, 'transition, Re_x = 5 × 10⁵', xt + 5, top + 4, { color: C.warn, size: 11.5 });
        }
        // the profile at the station
        const xs = X(S.xs), ps = S.ps, AW = 70;
        c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.moveTo(xs, yP); c.lineTo(xs, top); c.stroke();
        const tips = [];
        const hmax = Math.min(Ymax, 1.3 * ps.delta);
        for (let i = 1; i <= 10; i++) {
          const y = hmax * i / 10, r = uRatio(ps, y, S.xs, S.U, S.nu);
          kit.arrow(c, xs, Y(y), xs + r * AW, Y(y), C.accent, 1.4, 6);
          tips.push([xs + r * AW, Y(y)]);
        }
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.moveTo(xs, yP);
        for (let i = 1; i <= 40; i++) { const y = hmax * i / 40; c.lineTo(xs + uRatio(ps, y, S.xs, S.U, S.nu) * AW, Y(y)); }
        c.stroke();
        kit.label(c, 'u(y)', xs + AW + 4, Y(hmax) + 2, { color: C.accent, size: 12, weight: 700 });
        // captions
        const mag = sy / sx;
        kit.label(c, 'U = ' + (+S.U.toPrecision(3)) + ' m/s →', 10, 14, { color: C.text, size: 12.5, weight: 700 });
        kit.label(c, 'heights drawn ×' + (mag >= 10 ? Math.round(mag) : mag.toFixed(1)), st.W - 10, 14, { align: 'right', color: C.muted, size: 12 });
        kit.label(c, 'δ (solid) and δ* (dashed)', st.W - 10, 30, { align: 'right', color: C.faint, size: 11 });
        kit.label(c, ps.lam ? 'laminar here' : 'turbulent here', xs + 4, yP + 20, { color: ps.lam ? kit.hue(205) : kit.hue(28), size: 12, weight: 700 });
      }, box.stage);
      refresh();
      loop.start();
    }
  });

  /* ================================================================ 2. transition */
  Hyper.sim('visc-transition', {
    title: 'Where does the layer turn turbulent?',
    blurb: `A smooth plate 2 m long and 0.8 m wide, seen from above, in a stream of sea-level air. The laminar layer (blue streaks) begins to break down where an empirical fit to flat-plate measurements (Abu-Ghannam and Shaw) says it should for the chosen free-stream turbulence. Turbulent spots appear at random, grow as arrowheads and merge (the transition zone follows Narasimha's intermittency law). A roughness element trips the layer if its roughness Reynolds number $u_k k/\\nu$ exceeds about 600. The graph shows the local skin friction along the plate.

**Try this**
- Start with 0.3 % turbulence at 15 m/s and raise the speed: the transition point moves forward as 1/U.
- Turn the free-stream turbulence up to 3 % (a gusty day, a turbomachine): transition jumps forward — "bypass" transition.
- The 0.5 mm insect speck 10 cm from the leading edge does nothing at 15 m/s. Raise the speed until it trips a turbulent wedge. Is it worse at 10 cm or at 1 m from the leading edge?
- Compare the plate's friction drag with and without the grit strip: the price of a turbulent layer.`,
    mount(box, kit) {
      const F = kit.fluid, air = F.isa(0), nu = air.nu, rho = air.rho, L = 2, SPAN = 0.8, WEDGE = Math.tan(7 * D2R);
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const gb = plotBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'U', label: 'Stream speed', min: 2, max: 60, step: 0.5, value: 15, unit: 'm/s' },
        { id: 'Tu', label: 'Free-stream turbulence', min: 0.03, max: 5, value: 0.3, unit: '%', log: true, sig: 2 },
        { id: 'rough', type: 'select', label: 'Roughness', options: [['None', 'none'], ['An insect speck (a 3-D bump)', 'speck'], ['A strip of grit across the span', 'strip']], value: 'speck' },
        { id: 'k', label: 'Roughness height k', min: 0.02, max: 1.5, value: 0.5, unit: 'mm', log: true, sig: 2 },
        { id: 'xk', label: 'Roughness position', min: 0.02, max: 1.8, step: 0.01, value: 0.1, unit: 'm' }
      ], () => refresh());
      const ro = kit.readout(box.side, [['ReL', 'Plate Reynolds number Re_L'], ['nat', 'Natural transition starts'], ['rk', 'Roughness Reynolds number Re_k'], ['lam', 'Laminar share of the plate'],
        ['D', 'Friction drag, per metre of span (one side)'], ['Dt', '… if turbulent from the leading edge'], ['Dl', '… if laminar all the way']]);
      const plot = kit.plot(gb, { x: { label: 'distance from the leading edge x (m)', min: 0, max: L }, y: { label: 'local skin friction c_f', min: 0 }, legend: true }, 180);
      const V = ctl.values;
      let S = null;
      const gam = (x, x0, l) => x <= x0 ? 0 : 1 - Math.exp(-0.412 * Math.pow((x - x0) / l, 2));
      function compute() {
        const U = V.U, q = 0.5 * rho * U * U;
        const Rth = 163 + Math.exp(6.91 - V.Tu), Rexs = Math.pow(Rth / 0.664, 2), xs = Rexs * nu / U;
        const lamN = 5 * Math.pow(Rexs, 0.8) * nu / U;                                  // Dhawan–Narasimha zone scale
        const k = V.k / 1000, xk = V.xk;
        let Rek = 0, before = true, trip = false;
        if (V.rough !== 'none') {
          before = xk < xs;
          const uk = U * blasiusU(k * Math.sqrt(U / (nu * xk)));
          Rek = uk * k / nu;
          trip = before && Rek >= 600;
        }
        const lamT = Math.max(0.005, 40 * k);
        const x0n = virtualOrigin(xs, U, nu), x0t = virtualOrigin(xk, U, nu);
        const cfL = x => 0.664 / Math.sqrt(Math.max(U * x / nu, 1));
        const cfTfrom = (x, x0) => 0.0592 / Math.pow(Math.max(U * Math.max(x - x0, 1e-6) / nu, 1), 0.2);
        const gN = x => gam(x, xs, lamN), gT = x => gam(x, xk, lamT);
        const cfNat = x => { const g = gN(x); return (1 - g) * cfL(x) + g * cfTfrom(x, x0n); };
        const cfTrip = x => { const g = Math.max(gT(x), gN(x)); return (1 - g) * cfL(x) + g * cfTfrom(x, x0t); };
        const wfrac = x => V.rough === 'speck' && trip ? clamp(2 * WEDGE * (x - xk) / SPAN, 0, 1) : V.rough === 'strip' && trip ? 1 : 0;
        const cfAvg = x => { const w = wfrac(x); return w > 0 ? w * cfTrip(x) + (1 - w) * cfNat(x) : cfNat(x); };
        const gAvg = x => { const w = wfrac(x); return w * Math.max(gT(x), gN(x)) + (1 - w) * gN(x); };
        // integrals along the plate, on a grid in √x (the laminar c_f ∝ 1/√x is then harmless)
        let D = 0, Dt = 0, lamLen = 0;
        const M = 400, sL = Math.sqrt(L);
        for (let i = 0; i < M; i++) {
          const s = (i + 0.5) / M * sL, x = s * s, dx = 2 * s * sL / M;
          D += cfAvg(x) * dx; Dt += cfTfrom(x, 0) * dx; lamLen += (1 - gAvg(x)) * dx;
        }
        return { U, q, xs, Rexs, lamN, k, xk, Rek, before, trip, cfL, cfTfrom, cfNat, cfTrip, cfAvg, gN, gT, wfrac,
          D: D * q, Dt: Dt * q, Dl: q * 1.328 * L / Math.sqrt(U * L / nu), lamShare: lamLen / L, xfull: xs + 2.91 * lamN };
      }
      function refresh() {
        S = compute();
        ro.set('ReL', kit.fmt(S.U * L / nu, 3));
        ro.set('nat', S.xs < L ? 'x = ' + fmtLen(S.xs) + ', Re_x = ' + kit.fmt(S.Rexs, 2) : 'beyond the plate (Re_x = ' + kit.fmt(S.Rexs, 2) + ')');
        ro.set('rk', V.rough === 'none' ? '—' : !S.before ? 'the layer is no longer laminar there' : kit.fmt(S.Rek, 3) + (S.trip ? ' ≥ 600: trips the layer' : ' < 600: stays laminar'));
        ro.set('lam', Math.round(100 * S.lamShare) + ' %');
        ro.set('D', kit.fmt(S.D, 3) + ' N/m'); ro.set('Dt', kit.fmt(S.Dt, 3) + ' N/m'); ro.set('Dl', kit.fmt(S.Dl, 3) + ' N/m');
        const xsA = [], lamA = [], turA = [], avgA = [], tripA = [];
        for (let i = 0; i <= 240; i++) {
          const x = 0.02 + (L - 0.02) * i / 240;
          xsA.push(x); lamA.push([x, S.cfL(x)]); turA.push([x, S.cfTfrom(x, 0)]); avgA.push([x, S.cfAvg(x)]);
          if (V.rough === 'speck' && S.trip) tripA.push([x, S.cfTrip(x)]);
        }
        const ymax = 1.25 * S.cfTfrom(0.06, 0);
        const series = [
          { pts: avgA, label: 'this plate (average across the span)', width: 2.6 },
          { pts: lamA, label: 'laminar all the way', dash: [5, 4], width: 1.4 },
          { pts: turA, label: 'turbulent from the leading edge', dash: [2, 3], width: 1.4 }
        ];
        if (tripA.length) series.push({ pts: tripA, label: 'inside the wedge behind the speck', width: 1.4 });
        const vlines = [];
        if (S.xs < L) vlines.push({ x: S.xs, label: 'natural' });
        if (V.rough !== 'none') vlines.push({ x: S.xk, label: S.trip ? 'tripped' : 'roughness', color: S.trip ? kit.colors().warn : undefined });
        plot.set({ y: { label: 'local skin friction c_f', min: 0, max: ymax }, series, vlines });
        loop.once();
      }
      // turbulent spots: { x, y, age } in metres on the plate
      const spots = [];
      let spawn = 0, t = 0;
      const R = [];
      for (let i = 0; i < 4096; i++) R.push(Math.random() * Math.PI * 2);
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        t += dt;
        const X0 = 30, X1 = st.W - 20, sc = (X1 - X0) / L, ph = Math.min(SPAN * sc, st.H - 70), scy = ph / SPAN;
        const Y0 = (st.H - ph) / 2 + 8, yc = SPAN / 2;
        const PX = x => X0 + x * sc, PY = y => Y0 + y * scy;
        const vis = L / 5;                                          // the stream crosses the plate in 5 s here
        // the plate
        c.fillStyle = C.surface; c.fillRect(X0, Y0, X1 - X0, ph);
        // laminar streaks
        const xLamEnd = Math.min(L, S.xfull);
        c.save(); c.beginPath(); c.rect(X0, Y0, X1 - X0, ph); c.clip();
        c.strokeStyle = kit.hue(205, 0.45); c.lineWidth = 1; c.setLineDash([10, 12]); c.lineDashOffset = -t * vis * sc;
        for (let j = 0; j < 16; j++) { const y = Y0 + (j + 0.5) * ph / 16; c.beginPath(); c.moveTo(X0, y); c.lineTo(PX(xLamEnd), y); c.stroke(); }
        c.setLineDash([]);
        // turbulent texture: cells, fully turbulent where the intermittency is near 1 or inside a wedge / behind a strip
        const cell = 7, nx = Math.ceil((X1 - X0) / cell), ny = Math.ceil(ph / cell), shift = Math.floor(t * vis * sc / cell);
        for (let i = 0; i < nx; i++) {
          const x = (i + 0.5) * cell / sc;
          const gN = S.gN(x);
          const gT = S.trip ? S.gT(x) : 0;
          for (let j = 0; j < ny; j++) {
            const y = (j + 0.5) * cell / scy;
            let g = gN > 0.97 ? 1 : 0;
            if (S.trip) {
              if (V.rough === 'strip') g = Math.max(g, gT > 0.5 ? 1 : 0);
              else if (x > S.xk && Math.abs(y - yc) < WEDGE * (x - S.xk) + 0.004) g = 1;
            }
            if (!g) continue;
            const rr = R[((i - shift) & 63) * 64 + (j & 63)];
            c.fillStyle = kit.hue(22 + 14 * Math.sin(rr), 0.28 + 0.22 * Math.sin(rr * 3 + t * 5));
            c.fillRect(X0 + i * cell, Y0 + j * cell, cell, cell);
          }
        }
        // spots in the natural transition zone: born with the intermittency's distribution, grow as they travel
        if (S.xs < L) {
          spawn += dt * 7;
          while (spawn >= 1) {
            spawn -= 1;
            const r = Math.random() * 0.97, xb = S.xs + S.lamN * Math.sqrt(-Math.log(1 - r) / 0.412);
            if (xb < L) spots.push({ x: xb, y: Math.random() * SPAN, age: 0 });
          }
        }
        for (let i = spots.length - 1; i >= 0; i--) {
          const s = spots[i];
          s.age += dt;
          const front = s.x + 0.88 * vis * s.age, rear = s.x + 0.5 * vis * s.age, hw = Math.tan(11 * D2R) * (front - s.x) + 0.01;
          if (rear > L || spots.length > 160) { spots.splice(i, 1); continue; }
          c.fillStyle = kit.hue(22, 0.5);
          c.beginPath(); c.moveTo(PX(front), PY(s.y)); c.lineTo(PX(rear), PY(s.y - hw)); c.lineTo(PX(rear + 0.3 * (front - rear)), PY(s.y)); c.lineTo(PX(rear), PY(s.y + hw)); c.closePath(); c.fill();
        }
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(X0, Y0, X1 - X0, ph);
        // roughness
        if (V.rough === 'speck') { kit.dot(c, PX(S.xk), PY(yc), 3.5, S.trip ? C.bad : C.text); }
        else if (V.rough === 'strip') { c.fillStyle = S.trip ? C.bad : C.muted; c.fillRect(PX(S.xk) - 2, Y0, 4, ph); }
        // marks and labels
        if (S.xs < L) {
          c.setLineDash([4, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.2;
          c.beginPath(); c.moveTo(PX(S.xs), Y0 - 6); c.lineTo(PX(S.xs), Y0 + ph + 6); c.stroke(); c.setLineDash([]);
          kit.label(c, 'natural transition begins', PX(S.xs), Y0 - 12, { align: S.xs > 1.4 ? 'right' : 'left', color: C.warn, size: 11.5 });
        }
        kit.label(c, 'U = ' + V.U.toFixed(1) + ' m/s →', X0, 14, { color: C.text, size: 12.5, weight: 700 });
        kit.label(c, 'plan view · 2 m × 0.8 m plate', st.W - 12, 14, { align: 'right', color: C.muted, size: 12 });
        kit.label(c, 'laminar', X0 + 8, Y0 + ph + 16, { color: kit.hue(205), size: 12, weight: 700 });
        if (S.xs < L || S.trip) kit.label(c, 'turbulent', X1 - 4, Y0 + ph + 16, { align: 'right', color: kit.hue(22), size: 12, weight: 700 });
        if (V.rough === 'speck' && S.trip) kit.label(c, 'turbulent wedge', PX(Math.min(S.xk + 0.35, 1.7)), PY(yc) - 4, { color: C.text, size: 11.5, weight: 700, bg: C.bg2 });
      }, box.stage);
      refresh();
      loop.start();
    }
  });

  /* ================================================================ 3. the skin-friction chart */
  const PS = Re => 0.455 / Math.pow(lg(Re), 2.58);
  const BLAS = Re => 1.328 / Math.sqrt(Re);
  Hyper.sim('visc-skin-friction', {
    title: 'The skin-friction chart',
    blurb: `The average skin-friction coefficient of a flat surface against its Reynolds number $UL/\\nu$: laminar (Blasius, $1.328/\\sqrt{\\mathrm{Re}_L}$), turbulent (Prandtl–Schlichting), laminar front and turbulent back (Prandtl's correction for the chosen transition Reynolds number) and rough (blending towards Schlichting's fully-rough value). Pick a real object or set your own length, speed, fluid and roughness; the bars compare the friction per square metre.

**Try this**
- Step through the presets: a model wing is nearly all laminar, an airliner fuselage entirely turbulent.
- On the car, raise the roughness until it exceeds the admissible value 100ν/U: the friction starts to climb.
- Move the transition Reynolds number from 5 × 10⁵ to 3 × 10⁶ (a laminar-flow wing): how much friction does the sailplane save?
- Find the Reynolds number where turbulent friction is ten times laminar friction.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 210 });
      const gb = plotBox(box);
      const PRE = {
        model: { L: 0.2, U: 12, fluid: 'air0', k: 5 }, glider: { L: 0.9, U: 30, fluid: 'air0', k: 3 }, car: { L: 4.5, U: 30, fluid: 'air0', k: 10 },
        airliner: { L: 38, U: 230, fluid: 'air11', k: 10 }, swimmer: { L: 1.8, U: 2, fluid: 'water', k: 20 }, ship: { L: 300, U: 12, fluid: 'water', k: 30 }
      };
      let quiet = false;
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Object', options: [['Model aircraft wing (0.2 m, 12 m/s)', 'model'], ['Sailplane wing (0.9 m, 30 m/s)', 'glider'], ['Car (4.5 m, 30 m/s)', 'car'],
          ['Airliner fuselage (38 m, 230 m/s at 11 km)', 'airliner'], ['Swimmer (1.8 m, 2 m/s, water)', 'swimmer'], ['Ship hull (300 m, 12 m/s)', 'ship'], ['Your own', 'custom']], value: 'car' },
        { id: 'L', label: 'Length along the flow', min: 0.05, max: 400, value: 4.5, unit: 'm', log: true, sig: 3 },
        { id: 'U', label: 'Speed', min: 0.3, max: 300, value: 30, unit: 'm/s', log: true, sig: 3 },
        { id: 'fluid', type: 'select', label: 'Fluid', options: FLUIDS, value: 'air0' },
        { id: 'Rtr', label: 'Transition Reynolds number', min: 1e5, max: 5e6, value: 5e5, log: true, sig: 2, fmt: v => kit.fmt(v, 2) },
        { id: 'k', label: 'Roughness height', min: 1, max: 3000, value: 10, unit: 'µm', log: true, sig: 2 }
      ], (id) => {
        if (quiet) return;
        if (id === 'pre' && PRE[V.pre]) {
          quiet = true;
          const p = PRE[V.pre];
          ctl.set('L', p.L); ctl.set('U', p.U); ctl.set('fluid', p.fluid); ctl.set('k', p.k);
          quiet = false;
        } else if (id !== 'pre' && id !== 'Rtr') ctl.set('pre', 'custom');
        refresh();
      });
      const ro = kit.readout(box.side, [['Re', 'Reynolds number Re_L'], ['q', 'Dynamic pressure q'], ['cf', 'C_f of this surface'], ['tau', 'Average friction stress'], ['xtr', 'Laminar front'], ['kadm', 'Admissible roughness 100ν/U'], ['verdict', 'Surface']]);
      const plot = kit.plot(gb, { x: { label: 'Reynolds number Re_L = UL/ν', min: 1e4, max: 1e10, log: true }, y: { label: 'average C_f', min: 1e-4, max: 2e-2, log: true }, legend: true, fmtX: v => kit.fmt(v, 3), fmtY: v => kit.fmt(v, 3) }, 210);
      const V = ctl.values;
      let S = null;
      const aOf = Rtr => Rtr * (PS(Rtr) - BLAS(Rtr));
      const mixed = (Re, Rtr) => Re <= Rtr ? BLAS(Re) : Math.max(BLAS(Re), PS(Re) - aOf(Rtr) / Re);
      const rough = (Re, Lk) => {                                  // hydraulically smooth below Re ≈ 100 L/k, fully rough above ≈ 2000 L/k
        const fr = Math.pow(1.89 + 1.62 * lg(Math.max(Lk, 10)), -2.5), sm = PS(Re);
        return sm + Math.max(0, fr - sm) * ss(lg(100 * Lk), lg(2000 * Lk), lg(Re));
      };
      function refresh() {
        const fl = fluidProps(F, V.fluid), U = V.U, L = V.L, nu = fl.nu, Re = U * L / nu, q = 0.5 * fl.rho * U * U;
        const k = V.k * 1e-6, Lk = L / k, kadm = 100 * nu / U, isRough = k > kadm;
        const cfL = BLAS(Re), cfM = mixed(Re, V.Rtr), cfT = PS(Re), cfR = rough(Re, Lk);
        const cf = isRough ? cfR : cfM;
        S = { fl, U, L, nu, Re, q, k, kadm, isRough, cfL, cfM, cfT, cfR, cf, xtr: Math.min(L, V.Rtr * nu / U) };
        ro.set('Re', kit.fmt(Re, 3));
        ro.set('q', kit.fmt(q, 3) + ' Pa');
        ro.set('cf', kit.fmt(cf, 3) + (isRough ? ' (rough, turbulent)' : Re <= V.Rtr ? ' (laminar)' : ''));
        ro.set('tau', kit.fmt(cf * q, 3) + ' Pa (N per m² of wetted area)');
        const pct = 100 * S.xtr / L;
        ro.set('xtr', isRough ? 'none — roughness trips it' : Re <= V.Rtr ? 'the whole length (' + fmtLen(L) + ')' : fmtLen(S.xtr) + ' of ' + fmtLen(L) + ' (' + (pct < 1 ? 'under 1' : Math.round(pct)) + ' %)');
        ro.set('kadm', fmtLen(kadm));
        ro.set('verdict', isRough ? 'rough: k = ' + fmtLen(k) + ' > ' + fmtLen(kadm) : 'hydraulically smooth');
        const lamP = [], turP = [], mixP = [], rouP = [];
        for (let i = 0; i <= 240; i++) {
          const r = Math.pow(10, 4 + 6 * i / 240);
          lamP.push([r, BLAS(r)]); turP.push([r, PS(r)]); mixP.push([r, mixed(r, V.Rtr)]); rouP.push([r, rough(r, Lk)]);
        }
        const C = kit.colors();
        plot.set({
          series: [
            { pts: lamP, label: 'laminar (Blasius)', color: kit.hue(205), dash: [6, 4], width: 1.6 },
            { pts: turP, label: 'turbulent, smooth', color: kit.hue(22), width: 1.6 },
            { pts: mixP, label: 'laminar front, then turbulent', color: C.accent, width: 2.4 },
            { pts: rouP, label: 'turbulent, roughness k (L/k = ' + kit.fmt(Lk, 2) + ')', color: C.bad, dash: [2, 3], width: 1.6 }
          ],
          vlines: [{ x: V.Rtr, label: 'transition' }],
          marks: [{ x: Re, y: cf, label: 'this surface' }]
        });
        loop.once();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        // the surface as a strip: laminar front and turbulent rest
        const X0 = 16, X1 = st.W - 16, y0 = 30, h = 16, frac = S.isRough ? 0 : S.Re <= V.Rtr ? 1 : S.xtr / S.L;
        c.fillStyle = kit.hue(205, 0.55); c.fillRect(X0, y0, (X1 - X0) * frac, h);
        c.fillStyle = kit.hue(22, 0.55); c.fillRect(X0 + (X1 - X0) * frac, y0, (X1 - X0) * (1 - frac), h);
        c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(X0, y0, X1 - X0, h);
        kit.label(c, 'the surface, ' + fmtLen(S.L) + ' long, in ' + S.fl.name + ' at ' + (+S.U.toPrecision(3)) + ' m/s', X0, 14, { color: C.text, size: 12.5, weight: 700 });
        if (frac > 0.08) kit.label(c, 'laminar', X0 + 6, y0 + h / 2, { color: C.text, size: 11.5 });
        if (frac < 0.92) kit.label(c, S.isRough ? 'turbulent, rough' : 'turbulent', X1 - 6, y0 + h / 2, { align: 'right', color: C.text, size: 11.5 });
        // bars: friction per square metre
        const bars = [['laminar all the way', S.cfL, kit.hue(205)], ['laminar front, then turbulent', S.cfM, C.accent], ['turbulent, smooth', S.cfT, kit.hue(22)], ['turbulent, this roughness', S.cfR, C.bad]];
        const mx = Math.max(...bars.map(b => b[1])) * S.q || 1, bx = Math.min(250, st.W * 0.42), bw = st.W - bx - 90, top = y0 + h + 20, bh = Math.max(14, (st.H - top - 10) / bars.length - 8);
        bars.forEach((b, i) => {
          const y = top + i * (bh + 8), w = Math.max(1, bw * b[1] * S.q / mx);
          const now = (b[1] === S.cf);
          c.fillStyle = b[2]; c.globalAlpha = now ? 0.95 : 0.55; c.fillRect(bx, y, w, bh); c.globalAlpha = 1;
          if (now) { c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(bx, y, w, bh); }
          kit.label(c, b[0], bx - 8, y + bh / 2, { align: 'right', color: now ? C.text : C.muted, size: 12, weight: now ? 700 : 500 });
          kit.label(c, kit.fmt(b[1] * S.q, 3) + ' Pa', bx + w + 6, y + bh / 2, { color: C.text, size: 12 });
        });
      }, box.stage);
      refresh();
      loop.start();
    }
  });

  /* ================================================================ 4. separation in a diffuser */
  const H1of = H => H <= 1.6 ? 3.3 + 0.8234 * Math.pow(Math.max(H - 1.1, 1e-3), -1.287) : 3.3 + 1.5501 * Math.pow(H - 0.6778, -3.064);
  const Hof = H1 => H1 >= 5.3 ? 1.1 + 0.86 * Math.pow(H1 - 3.3, -0.777) : 0.6778 + 1.1536 * Math.pow(Math.max(H1 - 3.3, 1e-3), -0.326);
  const Fent = H1 => 0.0306 * Math.pow(Math.max(H1 - 3.0, 1e-3), -0.6169);
  // Head's entrainment method along one wall of a planar diffuser (core speed from continuity)
  function headDiffuser(o) {
    const tp = Math.tan(o.phi), W = x => o.W1 + 2 * x * tp;
    const Uc = x => o.U1 * o.W1 / W(x), dUc = x => -o.U1 * o.W1 * 2 * tp / (W(x) * W(x));
    let th = o.theta0, H = o.H0, H1 = H1of(H), sep = null, applied = false, hvg = 0;
    const n = 400, dx = o.L / n, rows = [];
    for (let i = 0; i <= n; i++) {
      const x = i * dx;
      if (o.ctrl !== 'none' && !applied && x >= o.xc) {
        applied = true;
        if (o.ctrl === 'vg') { hvg = th * (H1 + H); H = 1.3 + 0.3 * Math.max(0, H - 1.3); H1 = H1of(H); th *= 1.05; }
        else if (o.ctrl === 'suction') { th *= 0.5; H = 1.3; H1 = H1of(H); }
      }
      const u = Uc(x), Reth = Math.max(u * th / o.nu, 50);
      const cf = 0.246 * Math.pow(10, -0.678 * H) * Math.pow(Reth, -0.268);
      rows.push({ x, u, th, H, cf, ds: H * th, d: th * (H1 + H) });
      if (H >= 2.4) { sep = x; break; }
      if (i === n) break;
      const g = (o.ctrl === 'vg' && applied) ? 1 + 1.5 * Math.exp(-(x - o.xc) / (40 * hvg)) : 1;
      const dth = cf / 2 - (H + 2) * th / u * dUc(x);
      const dUth = th * dUc(x) + u * dth;
      const dH1 = (u * Fent(H1) * g - H1 * dUth) / (u * th);
      th = Math.max(th + dth * dx, 1e-6); H1 = Math.max(H1 + dH1 * dx, 3.31); H = Hof(H1);
    }
    return { rows, sep, W, Uc };
  }
  Hyper.sim('visc-separation', {
    title: 'Separation in a diffuser',
    blurb: `Air slows down in a planar diffuser (inlet 10 cm wide, walls 50 cm long), and its pressure rises. The boundary layers on the walls are followed with Head's integral method — a classic engineering calculation — until their shape factor $H$ reaches 2.4, where they separate. Past that point one wall stalls: a region of reverse flow (red particles) grows along it and the core passes as a jet, no longer slowing down or recovering pressure. Vortex generators are modelled as extra mixing that makes the profile fuller and increases entrainment; a suction slot removes the inner half of the layer.

**Try this**
- Open the wall angle from 2° to 12°: at about 4–5° the walls start to stall.
- At 7°, add vortex generators near the inlet and watch the separation move back. Then move them downstream of the separation point: too late.
- Try the suction slot instead. Which delays separation more?
- Change the speed: separation hardly moves. It depends on the geometry — the pressure gradient — far more than on the Reynolds number.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const gb = plotBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'phi', label: 'Wall angle (each side)', min: 0, max: 16, step: 0.5, value: params.phi || 7, unit: '°' },
        { id: 'U1', label: 'Inlet speed', min: 5, max: 80, step: 1, value: 30, unit: 'm/s' },
        { id: 'ctrl', type: 'select', label: 'Flow control', options: [['None', 'none'], ['Vortex generators', 'vg'], ['Suction slot', 'suction']], value: params.control || 'none' },
        { id: 'xc', label: 'Position of the device', min: 1, max: 40, step: 1, value: 5, unit: 'cm' }
      ], () => refresh());
      const ro = kit.readout(box.side, [['ar', 'Area ratio A₂/A₁'], ['cpi', 'Ideal pressure recovery C_p'], ['cp', 'Recovered (this model)'], ['sep', 'Separation'], ['sep0', 'Without the device'], ['H', 'Shape factor at the end']]);
      const plot = kit.plot(gb, { x: { label: 'distance along the wall (cm)', min: 0, max: 50 }, y: { label: 'shape factor H', min: 1.2, max: 2.6 }, legend: true }, 170);
      const V = ctl.values, W1 = 0.1, L = 0.5, nu = 1.46e-5;
      let S = null;
      function run(ctrl) { return headDiffuser({ U1: V.U1, W1, L, phi: V.phi * D2R, nu, theta0: 0.0006, H0: 1.4, ctrl, xc: V.xc / 100 }); }
      function recovery(r) {
        const d0 = r.rows[0].ds, last = r.rows[r.rows.length - 1];
        const Q = W1 - 2 * d0;
        return 1 - Math.pow(Q / Math.max(r.W(last.x) - 2 * last.ds, 0.2 * Q), 2);
      }
      function refresh() {
        const r = run(V.ctrl), r0 = V.ctrl === 'none' ? r : run('none');
        const W2 = W1 + 2 * L * Math.tan(V.phi * D2R), AR = W2 / W1;
        S = { r, r0, AR, W2 };
        ro.set('ar', AR.toFixed(2));
        ro.set('cpi', (1 - 1 / (AR * AR)).toFixed(2));
        ro.set('cp', recovery(r).toFixed(2) + (r.sep != null ? ' — stalled' : ''));
        const sepTxt = rr => rr.sep != null ? 'at ' + (rr.sep * 100).toFixed(0) + ' cm (' + Math.round(100 * rr.sep / L) + ' % of the wall)' : 'none — attached to the end';
        ro.set('sep', sepTxt(r));
        ro.show('sep0', V.ctrl !== 'none');
        ro.set('sep0', sepTxt(r0));
        const last = r.rows[r.rows.length - 1];
        ro.set('H', r.sep != null ? '2.4 reached: separated' : last.H.toFixed(2));
        const series = [{ pts: r.rows.map(q => [q.x * 100, q.H]), label: V.ctrl === 'vg' ? 'with vortex generators' : V.ctrl === 'suction' ? 'with suction' : 'no control', width: 2.4 }];
        if (V.ctrl !== 'none') series.push({ pts: r0.rows.map(q => [q.x * 100, q.H]), label: 'no control', dash: [5, 4], width: 1.4 });
        const vl = [];
        if (r.sep != null) vl.push({ x: r.sep * 100, label: 'separation', color: kit.colors().bad });
        if (V.ctrl !== 'none') vl.push({ x: V.xc, label: V.ctrl === 'vg' ? 'VGs' : 'slot' });
        plot.set({ series, hlines: [{ y: 2.4, label: 'separation (H ≈ 2.4)', color: kit.colors().bad }], vlines: vl });
        loop.once();
      }
      // local state along the diffuser (x in m from the diffuser inlet; negative in the inlet duct)
      function local(x) {
        const r = S.r, rows = r.rows, xe = Math.max(0, Math.min(x, L));
        const W = x < 0 ? W1 : r.W(xe);
        let row = rows[0];
        const i = Math.min(rows.length - 1, Math.max(0, Math.round(xe / (L / 400))));
        row = rows[i];
        const sepd = r.sep != null && xe > r.sep;
        const Q = W1 - 2 * rows[0].ds;
        let b = 0, Ucore, dl, du, H;
        if (!sepd) { dl = du = row.d; H = row.H; Ucore = V.U1 * Q / Math.max(W - 2 * row.ds, 0.2 * Q); }
        else {
          const rs = rows[rows.length - 1];
          b = W - r.W(r.sep);                                      // the stalled region fills the extra width
          dl = rs.d * 0.8; du = rs.d * (1 + 1.5 * (xe - r.sep) / L); H = 2.4;
          Ucore = V.U1 * Q / Math.max(r.W(r.sep) - 2 * rs.ds, 0.2 * Q);
        }
        return { W, b, dl, du, H, Ucore, sepd };
      }
      const parts = [];
      for (let i = 0; i < 320; i++) parts.push({ x: -0.12 + Math.random() * 0.62, f: Math.random() });
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const sc = Math.min((st.W - 50) / 0.64, (st.H - 46) / Math.max(S.W2, 0.12) * 0.98), X0 = 26 + 0.12 * sc, cy = st.H / 2 + 8;
        const PX = x => X0 + x * sc, PYl = (x, y) => cy + (local(x).W / 2 - y) * sc;   // y measured up from the lower wall
        const r = S.r, rows = r.rows;
        // boundary layers and the stalled region
        const NS = 100;
        c.fillStyle = kit.hue(205, 0.14);
        c.beginPath();
        for (let i = 0; i <= NS; i++) { const x = -0.12 + 0.62 * i / NS, lc = local(x); const y = PYl(x, lc.W - lc.du); i ? c.lineTo(PX(x), y) : c.moveTo(PX(x), y); }
        for (let i = NS; i >= 0; i--) { const x = -0.12 + 0.62 * i / NS; c.lineTo(PX(x), PYl(x, local(x).W)); }
        c.fill();
        c.beginPath();
        for (let i = 0; i <= NS; i++) { const x = -0.12 + 0.62 * i / NS, lc = local(x); const y = PYl(x, lc.b + lc.dl); i ? c.lineTo(PX(x), y) : c.moveTo(PX(x), y); }
        for (let i = NS; i >= 0; i--) { const x = -0.12 + 0.62 * i / NS; c.lineTo(PX(x), PYl(x, 0)); }
        c.fill();
        if (r.sep != null) {
          c.fillStyle = kit.hue(8, 0.16);
          c.beginPath(); c.moveTo(PX(r.sep), PYl(r.sep, 0));
          for (let i = 0; i <= 50; i++) { const x = r.sep + (L - r.sep) * i / 50; c.lineTo(PX(x), PYl(x, local(x).b)); }
          c.lineTo(PX(L), PYl(L, 0)); c.closePath(); c.fill();
          c.setLineDash([4, 3]); c.strokeStyle = C.bad; c.lineWidth = 1.2; c.beginPath();
          for (let i = 0; i <= 50; i++) { const x = r.sep + (L - r.sep) * i / 50; const y = PYl(x, local(x).b); i ? c.lineTo(PX(x), y) : c.moveTo(PX(x), y); }
          c.stroke(); c.setLineDash([]);
        }
        // particles
        for (const q of parts) {
          const lc = local(q.x), y = q.f * lc.W;
          let u;
          if (lc.sepd && y < lc.b) {
            u = lc.Ucore * (-0.2 + 0.55 * Math.pow(y / Math.max(lc.b, 1e-4), 2));
          } else {
            const dw = Math.min(y - lc.b, lc.W - y), dd = (y - lc.b < lc.W - y) ? (lc.sepd ? lc.dl : lc.dl) : lc.du;
            const n = clamp(2 / Math.max(lc.H - 1, 0.15), 3, 9);
            u = lc.Ucore * (dw >= dd ? 1 : Math.pow(Math.max(dw, 0) / dd, 1 / n));
          }
          q.x += u / V.U1 * dt * 0.2;                             // the same pace at every speed
          if (lc.sepd && y < lc.b && q.x < r.sep) { q.x = r.sep + 0.002; q.f = Math.min(0.99, (lc.b * 0.9) / Math.max(local(q.x).W, 1e-3)); }
          if (lc.sepd && y < lc.b) q.f = clamp(q.f + (Math.random() - 0.5) * dt * 0.08, 0.002, 0.99);
          if (q.x > L) { q.x = -0.12 + Math.random() * 0.02; q.f = Math.random(); }
          const ratio = u / V.U1;
          c.fillStyle = u < 0 ? kit.hue(0, 0.9) : speedColour(kit, ratio, 0.8);
          c.fillRect(PX(q.x) - 1.3, PYl(q.x, q.f * local(q.x).W) - 1.3, 2.6, 2.6);
        }
        // walls
        c.strokeStyle = C.text; c.lineWidth = 3;
        for (const side of [0, 1]) {
          c.beginPath();
          for (let i = 0; i <= 60; i++) { const x = -0.12 + 0.62 * i / 60, W = local(x).W; const y = side ? cy - W / 2 * sc : cy + W / 2 * sc; i ? c.lineTo(PX(x), y) : c.moveTo(PX(x), y); }
          c.stroke();
        }
        // devices
        if (V.ctrl !== 'none') {
          const xc = V.xc / 100, W = local(xc).W;
          for (const sgn of [1, -1]) {
            const yw = cy + sgn * W / 2 * sc;
            if (V.ctrl === 'vg') { c.fillStyle = C.accent; c.beginPath(); c.moveTo(PX(xc) - 5, yw); c.lineTo(PX(xc) + 5, yw); c.lineTo(PX(xc) + 5, yw - sgn * 8); c.closePath(); c.fill(); }
            else { c.fillStyle = C.bg2; c.fillRect(PX(xc) - 3, yw - 3, 6, 6); kit.arrow(c, PX(xc), yw, PX(xc), yw + sgn * 14, C.accent, 1.5, 6); }
          }
          kit.label(c, V.ctrl === 'vg' ? 'vortex generators' : 'suction slot', PX(xc), cy + W / 2 * sc + 24, { align: 'center', color: C.accent, size: 11.5, weight: 700 });
        }
        if (r.sep != null) {
          kit.dot(c, PX(r.sep), PYl(r.sep, 0), 4, C.bad);
          kit.label(c, 'separation', PX(r.sep), PYl(r.sep, 0) + 14, { align: 'center', color: C.bad, size: 12, weight: 700 });
          if (L - r.sep > 0.08) kit.label(c, 'stalled: reverse flow', PX((r.sep + L) / 2 + 0.03), PYl((r.sep + L) / 2, local((r.sep + L) / 2).b * 0.45), { align: 'center', color: C.bad, size: 11.5, bg: C.bg2 });
        }
        kit.label(c, 'U₁ = ' + V.U1 + ' m/s →', 10, 14, { color: C.text, size: 12.5, weight: 700 });
        kit.label(c, 'area ratio ' + S.AR.toFixed(2) + ' · ideal C_p ' + (1 - 1 / (S.AR * S.AR)).toFixed(2), st.W - 10, 14, { align: 'right', color: C.muted, size: 12 });
      }, box.stage);
      refresh();
      loop.start();
    }
  });

  /* ================================================================ 5. the drag crisis */
  const CG = Re => 24 / Re * (1 + 0.15 * Math.pow(Re, 0.687)) + 0.42 / (1 + 42500 * Math.pow(Re, -1.16));          // Clift–Gauvin, sphere
  const WHc = Re => { const r = Math.min(Re, 2e5); return 1.18 + 6.8 * Math.pow(r, -0.89) + 1.96 * Math.pow(r, -0.5) - 0.0004 * r / (1 + 3.64e-7 * r * r); };   // White, cylinder
  const BODIES = {
    sphere: { name: 'smooth sphere', sub: CG, Rc: 2.7e5, n: 10, post: Re => 0.07 + 0.13 * ss(5.6, 6.4, lg(Re)), sph: true, lamStart: 20 },
    golf: { name: 'golf ball', sub: CG, Rc: 5.0e4, n: 7, post: Re => 0.24 + 0.03 * ss(5, 5.5, lg(Re)), sph: true, lamStart: 20 },
    rough: { name: 'rough sphere', sub: CG, Rc: 1.0e5, n: 7, post: Re => 0.2 + 0.12 * ss(5.1, 5.8, lg(Re)), sph: true, lamStart: 20 },
    cyl: { name: 'smooth cylinder', sub: WHc, Rc: 3.5e5, n: 9, post: Re => 0.25 + 0.4 * ss(5.8, 6.7, lg(Re)), sph: false, lamStart: 5 }
  };
  function dragOf(b, Re) {
    const S = 1 / (1 + Math.pow(Re / b.Rc, b.n));
    const cd = b.sub(Re) * S + b.post(Re) * (1 - S);
    const thL = 180 - 98 * ss(lg(b.lamStart), lg(b.sph ? 5000 : 2000), lg(Re));
    return { cd, S, sep: thL * S + 120 * (1 - S) };
  }
  Hyper.sim('visc-drag-crisis', {
    title: 'The drag crisis',
    blurb: `A sphere (or a long cylinder) in a stream. Its drag coefficient follows typical measured curves (fits to classic data), with the sudden drop of the drag crisis. The picture shows where the boundary layer separates — laminar (blue) or, after transition, turbulent (orange) — and the wake it leaves; the graph shows the drag coefficient against the Reynolds number for all four bodies.

**Try this**
- Take the smooth sphere, 43 mm across, and raise the speed from 30 to 150 m/s. Near 100 m/s ($\\mathrm{Re} \\approx 3\\times10^5$) the drag coefficient collapses, the separation line jumps back and the wake shrinks.
- Switch to the golf ball at 70 m/s: dimples put it past the crisis at ordinary driving speeds. Compare the drag force with the smooth ball's.
- Find a speed where going faster *reduces* the drag force on a smooth sphere.
- Try the chimney: at full scale it is far above the crisis; a 3 cm model at the same speed is not.`,
    mount(box, kit, params) {
      params = params || {};
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 230 });
      const gb = plotBox(box);
      const golf = params.body === 'golf';
      let quiet = false;
      const ctl = kit.controls(box.side, [
        { id: 'body', type: 'select', label: 'Body', options: [['Smooth sphere', 'sphere'], ['Golf ball (dimpled)', 'golf'], ['Rough sphere (sand-roughened)', 'rough'], ['Smooth cylinder (per metre of length)', 'cyl']], value: params.body || 'sphere' },
        { id: 'd', label: 'Diameter', min: 1, max: 3000, value: 42.7, unit: 'mm', log: true, sig: 3 },
        { id: 'V', label: 'Speed', min: 0.1, max: 150, value: golf ? 70 : 40, unit: 'm/s', log: true, sig: 3 },
        { id: 'fluid', type: 'select', label: 'Fluid', options: [['Air, sea level (ISA)', 'air0'], ['Water, 20 °C', 'water']], value: 'air0' },
        { type: 'buttons', items: [{ id: 'pGolf', label: 'Golf drive' }, { id: 'pBall', label: 'Smooth ball, 22 cm' }, { id: 'pChim', label: 'Chimney' }] }
      ], (id) => {
        if (quiet) return;
        quiet = true;
        if (id === 'pGolf') { ctl.set('body', 'golf'); ctl.set('d', 42.7); ctl.set('V', 70); ctl.set('fluid', 'air0'); }
        else if (id === 'pBall') { ctl.set('body', 'sphere'); ctl.set('d', 220); ctl.set('V', 20); ctl.set('fluid', 'air0'); }
        else if (id === 'pChim') { ctl.set('body', 'cyl'); ctl.set('d', 3000); ctl.set('V', 20); ctl.set('fluid', 'air0'); }
        else if (id === 'body' && V.body === 'golf') ctl.set('d', 42.7);
        quiet = false;
        refresh();
      });
      const ro = kit.readout(box.side, [['re', 'Reynolds number Vd/ν'], ['reg', 'Regime'], ['cd', 'Drag coefficient C_D'], ['D', 'Drag'], ['sep', 'Separation (from the front)'], ['q', 'Dynamic pressure']]);
      const plot = kit.plot(gb, { x: { label: 'Reynolds number Re = Vd/ν', min: 1e2, max: 1e7, log: true }, y: { label: 'drag coefficient C_D', min: 0, max: 1.5 }, legend: true, fmtX: v => kit.fmt(v, 3) }, 190);
      const V = ctl.values;
      let S = null;
      function refresh() {
        const b = BODIES[V.body], fl = fluidProps(F, V.fluid), d = V.d / 1000, Re = V.V * d / fl.nu, q = 0.5 * fl.rho * V.V * V.V;
        const r = dragOf(b, Re), A = b.sph ? Math.PI * d * d / 4 : d;
        S = { b, Re, q, cd: r.cd, S: r.S, sep: r.sep, D: r.cd * q * A };
        ro.set('re', kit.fmt(Re, 3));
        ro.set('reg', Re < b.lamStart ? 'creeping: no separation' : r.S > 0.9 ? 'subcritical: laminar separation, wide wake' : r.S > 0.1 ? 'critical: the drag crisis' : 'supercritical: turbulent layer, narrow wake');
        ro.set('cd', r.cd.toFixed(3));
        ro.set('D', b.sph ? kit.fmt(S.D, 3) + ' N' : kit.fmt(S.D, 3) + ' N per metre');
        ro.set('sep', r.sep > 170 ? 'none' : '≈ ' + Math.round(r.sep) + '°');
        ro.set('q', kit.fmt(q, 3) + ' Pa');
        const C = kit.colors(), series = [];
        const order = ['sphere', 'golf', 'rough', 'cyl'], cols = [C.accent, kit.hue(150), kit.hue(38), kit.hue(280)];
        order.forEach((k, i) => {
          const pts = [];
          for (let j = 0; j <= 250; j++) { const re = Math.pow(10, 2 + 5 * j / 250); pts.push([re, dragOf(BODIES[k], re).cd]); }
          series.push({ pts, label: BODIES[k].name, color: cols[i], width: k === V.body ? 2.8 : 1.2, dash: k === V.body ? null : [5, 4] });
        });
        plot.set({ series, marks: [{ x: Re, y: r.cd, label: 'now', color: cols[order.indexOf(V.body)] }], vlines: [{ x: b.Rc, label: 'crisis' }] });
        loop.once();
      }
      const parts = [];
      for (let i = 0; i < 170; i++) parts.push({ x: Math.random(), y: Math.random(), w: false, a: 0 });
      const eddies = [];
      for (let i = 0; i < 12; i++) eddies.push({ s: Math.random(), y: Math.random() * 2 - 1, rot: Math.random() * 6 });
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const R = Math.min(st.H * 0.2, st.W * 0.085), cx = st.W * 0.3, cy = st.H * 0.5;
        const th = S.sep * D2R, sepd = S.sep < 170;
        // separation points and the wake outline (upper curve; the lower is its mirror)
        const Pu = [cx - R * Math.cos(th), cy - R * Math.sin(th)], dir = [Math.sin(th), -Math.cos(th)];
        const bubble = S.sep > 125;
        const xEnd = bubble ? cx + R + R * (0.3 + 2.5 * (180 - S.sep) / 55) : st.W + 10;
        const wEnd = bubble ? 0 : R * (1.2 - 0.5 * ss(80, 120, S.sep));
        const ctrl = [Pu[0] + dir[0] * R * 1.2, Pu[1] + dir[1] * R * 1.2];
        const curve = (t, sgn) => {
          const e = [xEnd, cy - sgn * wEnd], p0 = [Pu[0], cy + sgn * (Pu[1] - cy)], p1 = [ctrl[0], cy + sgn * (ctrl[1] - cy)];
          const a = (1 - t) * (1 - t), b2 = 2 * (1 - t) * t, d2 = t * t;
          return [a * p0[0] + b2 * p1[0] + d2 * e[0], a * p0[1] + b2 * p1[1] + d2 * e[1]];
        };
        const wakeHalf = x => {                                    // half-width of the wake at canvas x (0 outside)
          if (!sepd || x < Pu[0] || x > xEnd) return 0;
          let lo = 0, hi = 1;
          for (let k = 0; k < 16; k++) { const m = (lo + hi) / 2; if (curve(m, 1)[0] < x) lo = m; else hi = m; }
          return Math.abs(cy - curve((lo + hi) / 2, 1)[1]);
        };
        if (sepd) {
          c.fillStyle = kit.hue(22, 0.13); c.beginPath();
          for (let i = 0; i <= 40; i++) { const p = curve(i / 40, 1); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }
          for (let i = 40; i >= 0; i--) { const p = curve(i / 40, -1); c.lineTo(p[0], p[1]); }
          c.closePath(); c.fill();
          c.strokeStyle = kit.hue(22, 0.7); c.lineWidth = 1.5;
          for (const sgn of [1, -1]) { c.beginPath(); for (let i = 0; i <= 40; i++) { const p = curve(i / 40, sgn); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.stroke(); }
          // eddies drifting in the wake
          for (const e of eddies) {
            e.s += dt * 0.08; e.rot += dt * 3;
            if (e.s > 1) { e.s = 0; e.y = Math.random() * 2 - 1; }
            const ex = Pu[0] + (xEnd - Pu[0]) * e.s, hw = wakeHalf(ex);
            if (hw < 4) continue;
            const ey = cy + e.y * hw * 0.7, er = Math.max(3, hw * 0.35);
            c.strokeStyle = kit.hue(22, 0.55); c.lineWidth = 1.2;
            c.beginPath(); c.arc(ex, ey, er, e.rot, e.rot + 4.2); c.stroke();
          }
        }
        // tracer particles: potential flow round the body until they fall into the wake
        const U = 0.55 * st.W / 4;                                  // px/s
        for (const q of parts) {
          let px = q.x * st.W, py = q.y * st.H;
          const X = px - cx, Y = py - cy, r2 = X * X + Y * Y, R2 = R * R;
          if (q.w) {
            px += U * 0.3 * dt; py += Math.sin(q.a += dt * 4) * U * 0.25 * dt;
            if (px > xEnd) q.w = false;                              // out of the back of a closed bubble
          } else {
            const r4 = r2 * r2 || 1;
            px += U * (1 - R2 * (X * X - Y * Y) / r4) * dt; py += -U * 2 * R2 * X * Y / r4 * dt;
            if (sepd && px > Pu[0] && Math.abs(py - cy) < wakeHalf(px)) q.w = true;
          }
          if (Math.hypot(px - cx, py - cy) < R) { const a = Math.atan2(py - cy, px - cx); px = cx + R * 1.02 * Math.cos(a); py = cy + R * 1.02 * Math.sin(a); }
          if (px > st.W + 4 || (q.w && !(Math.abs(py - cy) < wakeHalf(px) + 6) && px < xEnd)) { px = -4 - Math.random() * 20; py = Math.random() * st.H; q.w = false; }
          q.x = px / st.W; q.y = py / st.H;
          c.fillStyle = q.w ? kit.hue(22, 0.6) : kit.hue(205, 0.55);
          c.fillRect(px - 1.2, py - 1.2, 2.4, 2.4);
        }
        // the body and its boundary layer
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.8;
        c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.fill(); c.stroke();
        if (V.body === 'golf') { c.fillStyle = C.faint; for (let i = 0; i < 26; i++) { const a = i * 2.4, rr = R * Math.sqrt((i + 0.5) / 26) * 0.85; kit.dot(c, cx + rr * Math.cos(a), cy + rr * Math.sin(a), Math.max(1.2, R * 0.06), C.faint); } }
        if (V.body === 'rough') { for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; kit.dot(c, cx + R * Math.cos(a), cy + R * Math.sin(a), 1.3, C.muted); } }
        const thSep = Math.min(S.sep, 178) * D2R, thTr = (S.sep * S.S + 95 * (1 - S.S)) * D2R;
        for (const sgn of [1, -1]) {
          c.lineWidth = 3.5;
          c.strokeStyle = kit.hue(205, 0.9); c.beginPath();
          for (let i = 0; i <= 30; i++) { const a = Math.min(thTr, thSep) * i / 30; const x = cx - (R + 2) * Math.cos(a), y = cy - sgn * (R + 2) * Math.sin(a); i ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.stroke();
          if (thTr < thSep) {
            c.strokeStyle = kit.hue(22, 0.95); c.beginPath();
            for (let i = 0; i <= 20; i++) { const a = thTr + (thSep - thTr) * i / 20; const x = cx - (R + 2) * Math.cos(a), y = cy - sgn * (R + 2) * Math.sin(a); i ? c.lineTo(x, y) : c.moveTo(x, y); }
            c.stroke();
          }
          if (sepd) kit.dot(c, cx - R * Math.cos(thSep), cy - sgn * R * Math.sin(thSep), 4, C.bad);
        }
        // drag arrow, length by C_D
        const len = 20 + 80 * clamp(S.cd / 1.2, 0, 1.4);
        kit.arrow(c, cx + R + 4, cy, cx + R + 4 + len, cy, C.bad, 3);
        kit.label(c, 'C_D = ' + S.cd.toFixed(2), cx + R + 8, cy - 12, { color: C.text, size: 12.5, weight: 700, bg: C.bg2 });
        kit.label(c, 'V →', 10, 14, { color: C.text, size: 12.5, weight: 700 });
        kit.label(c, sepd ? 'separation ≈ ' + Math.round(S.sep) + '° from the front' : 'no separation', st.W - 10, 14, { align: 'right', color: C.muted, size: 12 });
        kit.label(c, 'laminar', 10, st.H - 26, { color: kit.hue(205), size: 12, weight: 700 });
        kit.label(c, 'turbulent layer / wake', 10, st.H - 10, { color: kit.hue(22), size: 12, weight: 700 });
      }, box.stage);
      refresh();
      loop.start();
    }
  });

  /* ================================================================ 6. the Kármán vortex street */
  function strouhal(Re) {
    if (Re < 47) return 0;
    if (Re < 180) return 0.212 * (1 - 21.2 / Re);
    if (Re < 300) { const a = 0.212 * (1 - 21.2 / 180), b = 0.212 * (1 - 12.7 / 300); return a + (b - a) * (Re - 180) / 120; }
    if (Re < 2000) return 0.212 * (1 - 12.7 / Re);
    if (Re < 3e5) return 0.2107 - 0.0107 * ss(lg(2000), lg(2e5), lg(Re));
    if (Re < 3.5e6) return 0.3;
    return 0.27;
  }
  Hyper.sim('visc-vortex-street', {
    title: 'A vortex street behind a cylinder',
    blurb: `Dye released from the shoulders of a cylinder traces the wake. The shedding follows the measured behaviour of a circular cylinder: nothing below $\\mathrm{Re} \\approx 5$, a steady pair of vortices up to 47, then vortices shed alternately at $f = \\mathrm{St}\\,V/d$ — the Kármán vortex street. The picture is a model: point vortices with growing cores, launched at the real rhythm and carried downstream, with the dye moving in their combined flow. The trace in the corner is the alternating side force (at $f$) and the drag fluctuation (at $2f$); the graph is the Strouhal number against Reynolds number.

**Try this**
- Press "Laminar street": a 5 mm rod towed slowly through water at Re = 100. Then lower the speed below Re = 47 and watch the shedding stop.
- "Singing wire": 3 mm in a 12 m/s wind sheds about 800 vortex pairs a second — an audible note. Double the wind and the pitch rises an octave.
- Take a 2 m chimney and find the wind speed at which it sheds at 0.8 Hz, a typical natural frequency.
- Push the Reynolds number past 3 × 10⁵: after the drag crisis the wake narrows and the shedding becomes weak and irregular.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const gb = plotBox(box);
      let quiet = false;
      const ctl = kit.controls(box.side, [
        { id: 'fluid', type: 'select', label: 'Fluid', options: [['Air, sea level (ISA)', 'air0'], ['Water, 20 °C', 'water']], value: 'air0' },
        { id: 'd', label: 'Diameter', min: 0.1, max: 5000, value: 3, unit: 'mm', log: true, sig: 3 },
        { id: 'V', label: 'Flow speed', min: 0.002, max: 60, value: 12, unit: 'm/s', log: true, sig: 3 },
        { type: 'buttons', items: [{ id: 'pTank', label: 'Laminar street' }, { id: 'pWire', label: 'Singing wire' }, { id: 'pChim', label: 'Chimney, light wind' }] }
      ], (id) => {
        if (quiet) return;
        quiet = true;
        if (id === 'pTank') { ctl.set('fluid', 'water'); ctl.set('d', 5); ctl.set('V', 0.02); }
        else if (id === 'pWire') { ctl.set('fluid', 'air0'); ctl.set('d', 3); ctl.set('V', 12); }
        else if (id === 'pChim') { ctl.set('fluid', 'air0'); ctl.set('d', 2000); ctl.set('V', 2); }
        quiet = false;
        refresh();
      });
      const ro = kit.readout(box.side, [['re', 'Reynolds number Vd/ν'], ['reg', 'Wake'], ['st', 'Strouhal number St'], ['f', 'Shedding frequency f'], ['a', 'Spacing of the vortices'], ['tone', 'Heard as']]);
      const plot = kit.plot(gb, { x: { label: 'Reynolds number Re = Vd/ν', min: 10, max: 1e7, log: true }, y: { label: 'Strouhal number St = fd/V', min: 0, max: 0.5 }, legend: true, fmtX: v => kit.fmt(v, 3) }, 170);
      const V = ctl.values;
      let S = null;
      function refresh() {
        const fl = fluidProps(F, V.fluid), d = V.d / 1000, Re = V.V * d / fl.nu, St = strouhal(Re);
        const irregular = Re >= 3e5 && Re < 3.5e6;
        const strength = Re < 47 ? 0 : Re < 100 ? 0.5 + 0.5 * (Re - 47) / 53 : irregular ? 0.35 : Re >= 3.5e6 ? 0.8 : 1;
        S = { fl, d, Re, St, irregular, strength, turb: Re > 190 };
        ro.set('re', kit.fmt(Re, 3));
        ro.set('reg', Re < 5 ? 'attached: no separation' : Re < 47 ? 'a steady pair of vortices' : Re < 190 ? 'laminar vortex street' : Re < 3e5 ? 'turbulent wake, regular shedding' : irregular ? 'after the drag crisis: narrow wake, weak irregular shedding' : 'shedding re-established');
        ro.set('st', St === 0 ? '— (no shedding)' : irregular ? '≈ 0.2–0.45 (irregular)' : St.toFixed(3));
        if (St === 0) { ro.set('f', 'no periodic shedding'); ro.set('a', '—'); ro.set('tone', '—'); }
        else {
          const f = St * V.V / d;
          ro.set('f', irregular ? 'about ' + kit.fmt(0.2 * V.V / d, 2) + '–' + kit.fmt(0.45 * V.V / d, 2) + ' Hz' : kit.fmt(f, 3) + ' Hz (period ' + fmtTime(1 / f) + ')');
          ro.set('a', fmtLen(0.85 * d / St) + ' (≈ ' + (0.85 / St).toFixed(1) + ' d)');
          ro.set('tone', !fl.air ? '— (in water)' : f < 20 ? 'below hearing: a sway of ' + fmtTime(1 / f) : f > 20000 ? 'ultrasonic' : 'an audible tone of about ' + kit.fmt(f, 3) + ' Hz');
        }
        const reg = [], irr = [], hi = [];
        for (let i = 0; i <= 300; i++) {
          const re = Math.pow(10, 1 + 6 * i / 300), s = strouhal(re);
          if (re >= 47 && re < 3e5) reg.push([re, s]);
          else if (re >= 3e5 && re < 3.5e6) irr.push([re, s]);
          else if (re >= 3.5e6) hi.push([re, s]);
        }
        plot.set({
          series: [{ pts: reg, label: 'regular shedding', width: 2.4 }, { pts: irr, label: 'weak, irregular (0.2–0.45)', dash: [3, 4], width: 1.6 }, { pts: hi, label: 're-established', width: 2 }],
          vlines: [{ x: 47, label: 'onset' }, { x: 3e5, label: 'crisis' }],
          marks: St > 0 ? [{ x: Re, y: St, label: 'now' }] : []
        });
      }
      // the model, in canvas pixels and display seconds
      let vort = [], dye = [], bg = [], hist = [], phase = 0, side = 1, tt = 0, Tcur = 3;
      for (let i = 0; i < 150; i++) bg.push({ x: Math.random() * 800, y: Math.random() * 400 });
      function velAt(x, y, g) {
        const X = x - g.cx, Y = y - g.cy, r2 = X * X + Y * Y || 1e-6, R2 = g.R * g.R, r4 = r2 * r2;
        let u = g.U * (1 - R2 * (X * X - Y * Y) / r4), v = -g.U * 2 * R2 * X * Y / r4;
        for (const w of g.vs) {
          const dx = x - w.x, dy = y - w.y, q2 = dx * dx + dy * dy + 1e-6, k = w.G / (2 * Math.PI * q2) * (1 - Math.exp(-q2 / (w.rc * w.rc)));
          u += k * dy; v -= k * dx;
        }
        return [u, v];
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        tt += dt;
        const R = clamp(st.W * 0.028, 9, 18), cx = st.W * 0.16, cy = st.H * 0.5, U = 3.2 * R;
        const St = S.St, T = St > 0 ? 2 * R / (St * U) : 1e9;
        // vortices: shed alternately, drift downstream, spread and fade
        if (St > 0) {
          const Tn = Tcur;
          phase += dt / Tn * 2;
          if (phase >= 1) {
            phase -= 1; side = -side;
            Tcur = S.irregular ? T * (0.75 + 0.5 * Math.random()) : T;
            vort.push({ x: cx + 1.2 * R, y: cy - side * 0.55 * R, G0: -side * 2.2 * U * 2 * R * S.strength, age: 0, s: side });
          }
        } else vort = [];
        const a = 0.85 * U * T, h = 0.281 * a;
        for (let i = vort.length - 1; i >= 0; i--) {
          const w = vort[i];
          w.age += dt;
          w.x += U * (0.85 - 0.65 * Math.exp(-w.age / (0.35 * T))) * dt;
          w.y += (cy - w.s * h / 2 - w.y) * Math.min(1, dt / (0.5 * T));
          w.G = w.G0 * Math.exp(-w.age / (8 * T));
          w.rc = 0.45 * R * Math.sqrt(1 + w.age / (0.7 * T));
          if (w.x > st.W + 4 * R) vort.splice(i, 1);
        }
        const list = vort.slice();
        const steady = S.Re >= 5 && S.Re < 47;
        let Lb = 0;
        if (steady) {                                               // the steady pair in the lee: strong enough to reverse the flow behind
          Lb = clamp((0.06 * S.Re - 0.3) * 2 * R, 0.4 * R, 5 * R);
          const Gb = 3.0 * U * R * ss(5, 20, S.Re) * (1 + 0.3 * ss(20, 47, S.Re));
          list.push({ x: cx + R + 0.35 * Lb, y: cy - 0.5 * R, G: -Gb, rc: 0.4 * R }, { x: cx + R + 0.35 * Lb, y: cy + 0.5 * R, G: Gb, rc: 0.4 * R });
        }
        const vs = [];
        for (const w of list) {                                     // and their images inside the cylinder
          vs.push(w);
          const X = w.x - cx, Y = w.y - cy, r2 = X * X + Y * Y;
          if (r2 < 64 * R * R && r2 > R * R) vs.push({ x: cx + R * R * X / r2, y: cy + R * R * Y / r2, G: -w.G, rc: w.rc * 0.5 });
        }
        const g = { cx, cy, R, U, vs };
        // dye from the shoulders
        const emit = 42 * dt;
        for (const sg of [1, -1]) for (let k = 0; k < emit + Math.random() - 0.5; k++) dye.push({ x: cx + 0.1 * R, y: cy - sg * 1.12 * R, s: sg, age: 0 });
        if (steady && Math.random() < 40 * dt) {                   // a little dye inside the bubble shows its two eddies
          const bx = cx + R + Math.random() * Lb * 0.8, by = cy + (Math.random() - 0.5) * 1.4 * R;
          dye.push({ x: bx, y: by, s: by < cy ? 1 : -1, age: 0 });
        }
        if (dye.length > 1500) dye.splice(0, dye.length - 1500);
        const nsub = Math.max(1, Math.ceil(dt / (1 / 60)));
        const h1 = dt / nsub, jit = S.turb ? 0.9 * R * Math.sqrt(h1) : 0;
        const adv = (p) => {
          for (let s = 0; s < nsub; s++) {
            const v1 = velAt(p.x, p.y, g), v2 = velAt(p.x + v1[0] * h1 / 2, p.y + v1[1] * h1 / 2, g);
            p.x += v2[0] * h1; p.y += v2[1] * h1;
            if (jit && p.x > cx + R) { p.x += (Math.random() - 0.5) * jit; p.y += (Math.random() - 0.5) * jit; }
            const X = p.x - cx, Y = p.y - cy, r = Math.hypot(X, Y);
            if (r < R * 1.02) { const k = R * 1.03 / (r || 1); p.x = cx + X * k; p.y = cy + Y * k; }
          }
        };
        for (let i = dye.length - 1; i >= 0; i--) {
          const p = dye[i]; p.age += dt; adv(p);
          if (p.x > st.W + 5 || p.x < -20 || p.y < -20 || p.y > st.H + 20 || p.age > 30) dye.splice(i, 1);
        }
        for (const p of bg) { adv(p); if (p.x > st.W + 5 || p.y < -10 || p.y > st.H + 10) { p.x = -Math.random() * 30; p.y = Math.random() * st.H; } }
        // draw
        for (const p of bg) { c.fillStyle = C.faint; c.fillRect(p.x - 1, p.y - 1, 2, 2); }
        for (const p of dye) { c.fillStyle = p.s > 0 ? kit.hue(205, 0.7) : kit.hue(28, 0.7); c.fillRect(p.x - 1.2, p.y - 1.2, 2.4, 2.4); }
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.8;
        c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.fill(); c.stroke();
        // side force and drag fluctuation, recorded
        const amp = S.strength, cl = St > 0 ? amp * Math.sin(2 * Math.PI * phase / 2 + (side > 0 ? Math.PI : 0)) : 0;
        hist.push([tt, cl, St > 0 ? 0.3 * amp * Math.cos(2 * Math.PI * phase) : 0]);
        while (hist.length && hist[0][0] < tt - 9) hist.shift();
        const bw = Math.min(200, st.W * 0.3), bh = 56, bx = st.W - bw - 10, by = st.H - bh - 10;
        c.fillStyle = C.bg2; c.strokeStyle = C.grid; c.lineWidth = 1; c.fillRect(bx, by, bw, bh); c.strokeRect(bx, by, bw, bh);
        for (const [k, col, y0] of [[1, C.accent, by + bh * 0.3], [2, C.warn, by + bh * 0.78]]) {
          c.strokeStyle = col; c.lineWidth = 1.5; c.beginPath();
          hist.forEach((hp, i) => { const x = bx + bw * (1 - (tt - hp[0]) / 9), y = y0 - hp[k] * bh * 0.22; i ? c.lineTo(x, y) : c.moveTo(x, y); });
          c.stroke();
        }
        kit.label(c, 'side force (f)', bx + 4, by + 8, { color: C.accent, size: 10.5 });
        kit.label(c, 'drag (2f)', bx + 4, by + bh - 7, { color: C.warn, size: 10.5 });
        kit.label(c, 'V →', 10, 14, { color: C.text, size: 12.5, weight: 700 });
        kit.label(c, 'Re = ' + kit.fmt(S.Re, 3) + (St > 0 ? (S.irregular ? ' · irregular shedding' : ' · St = ' + St.toFixed(2)) : ''), st.W - 10, 14, { align: 'right', color: C.muted, size: 12 });
      }, box.stage);
      refresh();
      loop.start();
    }
  });

  /* ================================================================ 7. the turbulent cascade */
  function popeSpectrum(k, eps, Lp, eta) {                       // Pope's model spectrum
    const xL = k * Lp, fL = Math.pow(xL / Math.sqrt(xL * xL + 6.78), 5 / 3 + 2);
    const xe = k * eta, fe = Math.exp(-5.2 * (Math.pow(Math.pow(xe, 4) + Math.pow(0.4, 4), 0.25) - 0.4));
    return 1.5 * Math.pow(eps, 2 / 3) * Math.pow(k, -5 / 3) * fL * fe;
  }
  Hyper.sim('visc-cascade', {
    title: 'The turbulent cascade',
    blurb: `Turbulence as a cascade of eddies. The large eddies (size $L$, velocity $u'$) set the rate $\\varepsilon \\approx u'^3/L$ at which energy flows down to ever smaller eddies, until at the Kolmogorov scale $\\eta = (\\nu^3/\\varepsilon)^{1/4}$ viscosity turns it into heat. The graph is a model energy spectrum (Pope's form) with its $k^{-5/3}$ inertial range. The picture is a synthetic flow built from waves of many sizes with that spectrum — not a solution of the flow equations, but it shows how stripes of dye are stretched and folded by eddies of every scale, down to the smallest the screen can show.

**Try this**
- Compare the stirred coffee with the wind near the ground: the range of scales L/η grows from a few hundred to over a hundred thousand.
- Double u′: the dissipation rate grows eightfold, but the Kolmogorov scale shrinks only by a factor of 1.7.
- Watch the dye: in the coffee (low Re) the stripes stay smooth at small scales; in the wind they are shredded finely.
- Look at the last read-out: this is why engineers model turbulence instead of computing every eddy.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const gb = plotBox(box);
      const PRE = { coffee: { fluid: 'water', up: 0.05, Lt: 0.03 }, tunnel: { fluid: 'air0', up: 0.5, Lt: 0.1 }, wind: { fluid: 'air0', up: 1, Lt: 100 }, cloud: { fluid: 'air0', up: 3, Lt: 1000 } };
      let quiet = false;
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Flow', options: [['Stirred cup of coffee', 'coffee'], ['Wind-tunnel stream, Tu = 1 %', 'tunnel'], ['Wind near the ground', 'wind'], ['Inside a cumulus cloud', 'cloud'], ['Your own', 'custom']], value: 'coffee' },
        { id: 'up', label: "Eddy velocity u′", min: 0.005, max: 10, value: 0.05, unit: 'm/s', log: true, sig: 2 },
        { id: 'Lt', label: 'Large-eddy size L', min: 0.005, max: 2000, value: 0.03, unit: 'm', log: true, sig: 2 },
        { id: 'fluid', type: 'select', label: 'Fluid', options: [['Air, sea level (ISA)', 'air0'], ['Water, 20 °C', 'water']], value: 'water' },
        { type: 'buttons', items: [{ id: 'dye', label: 'Fresh dye', primary: true }] }
      ], (id) => {
        if (quiet) return;
        if (id === 'dye') { layDye(); return; }
        if (id === 'pre' && PRE[V.pre]) { quiet = true; const p = PRE[V.pre]; ctl.set('fluid', p.fluid); ctl.set('up', p.up); ctl.set('Lt', p.Lt); quiet = false; layDye(); }
        else if (id !== 'pre') ctl.set('pre', 'custom');
        refresh();
      });
      const ro = kit.readout(box.side, [['re', 'Reynolds number u′L/ν'], ['eps', 'Dissipation rate ε ≈ u′³/L'], ['eta', 'Kolmogorov scale η'], ['teta', 'Kolmogorov time τ_η'], ['ueta', 'Kolmogorov velocity u_η'], ['ratio', 'Range of scales L/η'], ['dns', 'Grid points to compute every eddy']]);
      const plot = kit.plot(gb, { x: { label: 'wavenumber k (1/m)', log: true }, y: { label: 'energy spectrum E(k) (m³/s²)', log: true }, legend: true, fmtX: v => kit.fmt(v, 3), fmtY: v => kit.fmt(v, 3) }, 190);
      const V = ctl.values;
      let S = null, modes = [], dye = [];
      function layDye() {
        dye = [];
        const W = st.W || 760, H = st.H || 380;
        for (let i = 0; i < 1100; i++) { const band = i % 6; dye.push({ x: Math.random() * W, y: (band + 0.15 + 0.7 * Math.random()) * H / 6 + 0.0 * H, b: band }); }
      }
      function refresh() {
        const nu = V.fluid === 'water' ? 1.0e-6 : kit.fluid.isa(0).nu;
        const up = V.up, Lt = V.Lt, eps = up * up * up / Lt, eta = Math.pow(nu * nu * nu / eps, 0.25), Re = up * Lt / nu;
        const Lp = 1.837 * Lt;                                       // Pope's L = k^{3/2}/ε with k = 1.5 u′²
        S = { nu, up, Lt, eps, eta, Re, Lp };
        ro.set('re', kit.fmt(Re, 3));
        ro.set('eps', kit.fmt(eps, 3) + ' W/kg');
        ro.set('eta', fmtLen(eta));
        ro.set('teta', fmtTime(Math.sqrt(nu / eps)));
        ro.set('ueta', kit.fmt(Math.pow(nu * eps, 0.25), 3) + ' m/s');
        ro.set('ratio', kit.fmt(Lt / eta, 3));
        ro.set('dns', '≈ ' + kit.fmt(Math.pow(Math.max(Re, 1), 2.25), 2) + ' per L³ cube');
        const k0 = 0.05 / Lp, k1 = 3 / eta, pts = [], ref = [];
        let Emax = 0;
        for (let i = 0; i <= 240; i++) { const k = k0 * Math.pow(k1 / k0, i / 240), E = popeSpectrum(k, eps, Lp, eta); pts.push([k, E]); if (E > Emax) Emax = E; }
        for (let i = 0; i <= 20; i++) { const k = (0.5 / Lt) * Math.pow((1.5 / eta) / (0.5 / Lt), i / 20); ref.push([k, 1.5 * Math.pow(eps, 2 / 3) * Math.pow(k, -5 / 3)]); }
        plot.set({
          x: { label: 'wavenumber k (1/m)', log: true, min: k0, max: k1 },
          y: { label: 'energy spectrum E(k) (m³/s²)', log: true, min: Emax * 1e-8, max: Emax * 5 },
          series: [{ pts, label: 'model spectrum', width: 2.4 }, { pts: ref, label: 'k^(−5/3)', dash: [5, 4], width: 1.2 }],
          vlines: [{ x: 1 / Lt, label: '1/L' }, { x: 1 / eta, label: '1/η' }]
        });
        // modes for the picture: the canvas is 3L wide
        const W = st.W || 760, B = 3 * Lt, ppm = W / B, tdil = (Lt / up) / 4;
        const kmin = 2 * Math.PI / B, kdisp = (2 * Math.PI / 5) * ppm, ktop = Math.max(2 * kmin, Math.min(1.2 / eta, kdisp));
        const M = 40, rl = Math.log(ktop / kmin) / (M - 1);
        modes = [];
        for (let n = 0; n < M; n++) {
          const k = kmin * Math.exp(rl * n), E = popeSpectrum(k, eps, Lp, eta), a = Math.sqrt(2 * E * k * rl);
          const th = Math.random() * Math.PI * 2;
          modes.push({ kx: k * Math.cos(th) / ppm, ky: k * Math.sin(th) / ppm, ux: -Math.sin(th) * a * ppm * tdil, uy: Math.cos(th) * a * ppm * tdil,
            w: Math.sqrt(k * k * k * E) * tdil, ph: Math.random() * Math.PI * 2 });
        }
        S.ppm = ppm; S.limited = ktop < 1.2 / eta;
        loop.once();
      }
      let t = 0;
      const vel = (x, y) => {
        let u = 0, v = 0;
        for (const m of modes) { const cs = Math.cos(m.kx * x + m.ky * y + m.ph + m.w * t); u += m.ux * cs; v += m.uy * cs; }
        return [u, v];
      };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        t += dt;
        const W = st.W, H = st.H, h = Math.min(dt, 1 / 30);
        for (const p of dye) {
          const v1 = vel(p.x, p.y), v2 = vel(p.x + v1[0] * h / 2, p.y + v1[1] * h / 2);
          p.x += v2[0] * h; p.y += v2[1] * h;
          if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) { p.x = Math.random() * W; p.y = Math.random() * H; }
          p.x = ((p.x % W) + W) % W; p.y = ((p.y % H) + H) % H;
          c.fillStyle = C.series[p.b % C.series.length];
          c.fillRect(p.x - 1.1, p.y - 1.1, 2.2, 2.2);
        }
        // scale bars
        const Lpx = S.Lt * S.ppm, etapx = S.eta * S.ppm, y = H - 14;
        c.fillStyle = C.bg2; c.fillRect(6, H - 44, Math.min(W - 12, Lpx + 250), 40);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(12, y); c.lineTo(12 + Lpx, y); c.moveTo(12, y - 5); c.lineTo(12, y + 5); c.moveTo(12 + Lpx, y - 5); c.lineTo(12 + Lpx, y + 5); c.stroke();
        kit.label(c, 'L = ' + fmtLen(S.Lt), 16 + Lpx, y, { color: C.text, size: 12, weight: 700 });
        kit.label(c, etapx >= 1 ? 'η = ' + fmtLen(S.eta) + ' ≈ ' + etapx.toFixed(1) + ' px here — the finest wrinkles of the dye' : 'η = ' + fmtLen(S.eta) + ' — only 1/' + kit.fmt(1 / etapx, 2) + ' of a pixel here: far too small to draw', 12, H - 34, { color: C.muted, size: 11.5 });
        kit.label(c, 'box shown: ' + fmtLen(3 * S.Lt) + ' across', W - 10, 14, { align: 'right', color: C.muted, size: 12, bg: C.bg2 });
      }, box.stage);
      layDye();
      refresh();
      loop.start();
    }
  });
})();
