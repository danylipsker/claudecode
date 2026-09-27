/* HYPER-HYDRAULICS · sims/channels.js — simulations for Open Channels and Water (prefix chan-).
 *   chan-manning   a trapezoidal section in uniform flow: normal and critical depth, velocity shading, Q–y curves
 *   chan-ripples   top view of a stream: ripples at √(gy) carried by the current; the Froude wedge
 *   chan-energy    a smooth step and a narrowing: the water surface, choking, and the E–y diagram
 *   chan-jump      a hydraulic jump on a stilling-basin apron: sequent depth, loss, type, tailwater moving the jump
 *   chan-gvf       water-surface profiles (M1, M2, M3, S1, S2, S3) by the direct step method from a control
 *   chan-vnotch    calibrating a V-notch weir: a tank filling to its steady head, recorded points, a fitted law
 *   chan-sluice    a sluice gate: free flow with a jump downstream, or drowned by the tailwater (energy + momentum)
 *   chan-well      pumping a well: the cone of depression (Thiem / Dupuit), seepage and travel times
 * Channel hydraulics comes from kit.fluid (section, manningQ, normalDepth, criticalDepth, froude,
 * hydraulicJump, weirV); only the alternate-depth root and the drowned-gate balance are solved here.
 */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const f3 = (v, d) => (Number.isFinite(v) ? v.toFixed(d == null ? 2 : d) : '—');
  // alternate depth of E = y + q²/(2 g y²) on the subcritical (sub = true) or supercritical limb
  function altDepth(E, q, sub, g) {
    if (!(q > 0)) return sub ? Math.max(E, 1e-6) : 1e-6;
    const yc = Math.cbrt(q * q / g);
    if (!(E > 1.5 * yc)) return yc;
    const f = y => y + q * q / (2 * g * y * y) - E;
    let lo = sub ? yc : 1e-7, hi = sub ? Math.max(E, yc) : yc;
    for (let k = 0; k < 90; k++) {
      const m = (lo + hi) / 2, fm = f(m);
      if (sub ? fm > 0 : fm < 0) hi = m; else lo = m;
    }
    return (lo + hi) / 2;
  }
  const segDist = (px, py, ax, ay, bx, by) => {
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
    const t = L2 > 0 ? clamp(((px - ax) * dx + (py - ay) * dy) / L2, 0, 1) : 0;
    return Math.hypot(px - ax - t * dx, py - ay - t * dy);
  };
  const plotDiv = box => { const d = document.createElement('div'); d.style.padding = '4px 10px 10px'; box.stage.appendChild(d); return d; };
  const foam = C => C.dark ? 'rgba(235,245,255,0.85)' : 'rgba(20,70,140,0.75)';

  /* ================================================================== chan-manning */
  Hyper.sim('chan-manning', {
    title: 'A channel section in uniform flow',
    blurb: `A trapezoidal channel (a rectangle when the side slope is 0) carrying a steady discharge in uniform flow. The water stands at the **normal depth** from Manning's equation; the dashed orange line is the **critical depth** for the same flow; the thick line is the wetted perimeter. The shading sketches the velocity — slow at the bed and banks, fastest just below the surface in mid-channel. The graph gives both depths for every discharge.

**Try this**
- Change the lining from smooth concrete to a weedy earth canal: the same flow needs a deeper, slower channel.
- Steepen the slope until the normal depth falls below the critical depth: the slope turns from mild to steep and the flow becomes supercritical (Fr > 1).
- With side slope 0, find the width at which the depth is half the width — the most efficient rectangle — and compare its wetted perimeter with a narrower, deeper one.
- Quadruple the slope: the velocity roughly doubles.
- Put a large flow into a narrow channel and watch the depth run away.`,
    mount(box, kit) {
      const F = kit.fluid, g = F.g0;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'discharge Q (m³/s)' }, y: { label: 'depth (m)', min: 0 }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Discharge Q', min: 0.1, max: 100, value: 6, unit: 'm³/s', log: true, sig: 3 },
        { id: 'b', label: 'Bottom width b', min: 0.5, max: 20, step: 0.1, value: 3, unit: 'm' },
        { id: 'z', label: 'Side slope z (horizontal per 1 vertical)', min: 0, max: 3, step: 0.1, value: 0 },
        { id: 'n', type: 'select', label: 'Lining (Manning n)', value: 0.013, options: [['Smooth concrete, n = 0.013', 0.013], ['Rough concrete or shotcrete, 0.017', 0.017], ['Clean earth canal, 0.022', 0.022], ['Earth with grass and weeds, 0.030', 0.03], ['Natural stream, 0.040', 0.04], ['Floodplain with brush, 0.070', 0.07]] },
        { id: 'S', label: 'Bed slope S', min: 0.0001, max: 0.05, value: 0.001, log: true, fmt: v => (v * 1000).toPrecision(3) + ' m/km' }
      ], () => recompute());
      const ro = kit.readout(box.side, [['yn', 'Normal depth yₙ'], ['yc', 'Critical depth yc'], ['geo', 'Area / wetted perimeter / R'], ['v', 'Mean velocity V'], ['fr', 'Froude number'], ['cls', 'Slope'], ['tau', 'Bed shear τ₀ = ρgRS'], ['chezy', 'Chézy C = R^⅙/n']]);
      const V = ctl.values;
      let o = null;
      function recompute() {
        const C = kit.colors();
        const Q = V.Q, b = V.b, z = V.z, n = V.n, S = V.S, opt = { Q, b, z, n, S };
        const over = F.manningQ(40, opt) < Q;
        const yn = over ? 40 : F.normalDepth(opt);
        const yc = F.criticalDepth({ Q, b, z });
        const s = F.section(yn, b, z);
        const Vm = Q / s.A, D = s.A / s.T, Fr = F.froude(Vm, D);
        // a sketch of the velocity field: speed grows with the distance from the wetted boundary (1/6 power)
        const cells = [], nx = 40, ny = 16, T = s.T;
        let dmax = 1e-9;
        for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
          const x = -T / 2 + (i + 0.5) * T / nx, y = (j + 0.5) * yn / ny;
          if (Math.abs(x) > b / 2 + z * y) continue;
          const d = Math.min(segDist(x, y, -b / 2, 0, b / 2, 0), segDist(x, y, -b / 2, 0, -b / 2 - z * yn, yn), segDist(x, y, b / 2, 0, b / 2 + z * yn, yn));
          dmax = Math.max(dmax, d);
          cells.push([x, y, d]);
        }
        for (const cl of cells) cl[2] = Math.pow(cl[2] / dmax, 1 / 6);
        o = { Q, b, z, n, S, yn, yc, s, Vm, D, Fr, over, cells, dx: T / nx, dy: yn / ny, tau: 1000 * g * s.R * S, Cz: Math.pow(s.R, 1 / 6) / n };
        const dash = t => over ? '—' : t;
        ro.set('yn', over ? 'over 40 m — this channel cannot carry the flow' : f3(yn, 3) + ' m');
        ro.set('yc', f3(yc, 3) + ' m');
        ro.set('geo', dash(f3(s.A, 2) + ' m² / ' + f3(s.P, 2) + ' m / ' + f3(s.R, 3) + ' m'));
        ro.set('v', dash(f3(Vm, 2) + ' m/s'));
        ro.set('fr', dash(f3(Fr, 2) + (Fr < 0.97 ? '  subcritical' : Fr > 1.03 ? '  supercritical' : '  critical')));
        ro.set('cls', dash(yn > yc * 1.01 ? 'mild (yₙ > yc)' : yn < yc * 0.99 ? 'steep (yₙ < yc)' : 'critical (yₙ ≈ yc)'));
        ro.set('tau', dash(f3(o.tau, 1) + ' Pa'));
        ro.set('chezy', dash(f3(o.Cz, 1) + ' m½/s'));
        const ymax = Math.min(45, Math.max(yn, yc) * 1.6), pn = [], pc = [];
        for (let k = 1; k <= 90; k++) {
          const y = ymax * k / 90, sec = F.section(y, b, z);
          pn.push([F.manningQ(y, opt), y]);
          pc.push([Math.sqrt(g * sec.A * sec.A * sec.A / sec.T), y]);
        }
        plot.set({
          series: [{ pts: pn, label: 'normal depth (Manning)' }, { pts: pc, label: 'critical depth', dash: [6, 4], color: C.warn }],
          marks: [{ x: Q, y: Math.min(yn, ymax), label: 'yₙ = ' + f3(yn, 2) + ' m' }, { x: Q, y: yc, color: C.warn }],
          x: { label: 'discharge Q (m³/s)', min: 0, max: Q * 2 }, y: { label: 'depth y (m)', min: 0, max: ymax }
        });
      }
      recompute();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const yb = Math.max(o.yn, o.yc) * 1.3 + 0.05, topW = o.b + 2 * o.z * yb;
        const sc = Math.min((W - 240) / topW, (H - 70) / yb);
        const cx = W / 2 - 10, by = H - 34;                 // 110 px kept free on the left, 130 px on the right, for labels
        const X = x => cx + x * sc, Y = y => by - y * sc;
        const concrete = o.n <= 0.017;
        // the ground or concrete around the section
        const xl = X(-o.b / 2 - o.z * yb), xr = X(o.b / 2 + o.z * yb);
        c.beginPath();
        c.moveTo(Math.min(xl - 30, 10), Y(yb)); c.lineTo(xl, Y(yb)); c.lineTo(X(-o.b / 2), Y(0)); c.lineTo(X(o.b / 2), Y(0)); c.lineTo(xr, Y(yb)); c.lineTo(Math.max(xr + 30, W - 10), Y(yb));
        c.lineTo(Math.max(xr + 30, W - 10), by + 22); c.lineTo(Math.min(xl - 30, 10), by + 22); c.closePath();
        c.fillStyle = concrete ? C.surface2 : kit.hue(30, 0.28); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        // water with the velocity shading
        const wl = X(-o.b / 2 - o.z * o.yn), wr = X(o.b / 2 + o.z * o.yn);
        c.save();
        c.beginPath(); c.moveTo(wl, Y(o.yn)); c.lineTo(X(-o.b / 2), Y(0)); c.lineTo(X(o.b / 2), Y(0)); c.lineTo(wr, Y(o.yn)); c.closePath();
        c.fillStyle = kit.hue(205, 0.15); c.fill();
        c.clip();
        for (const cl of o.cells) { c.fillStyle = kit.hue(205, 0.05 + 0.5 * Math.pow(cl[2], 3)); c.fillRect(X(cl[0] - o.dx / 2) - 0.5, Y(cl[1] + o.dy / 2) - 0.5, o.dx * sc + 1, o.dy * sc + 1); }
        c.restore();
        c.strokeStyle = kit.hue(205); c.lineWidth = 2; c.beginPath(); c.moveTo(wl, Y(o.yn)); c.lineTo(wr, Y(o.yn)); c.stroke();
        // water-level mark
        c.fillStyle = kit.hue(205); c.beginPath(); c.moveTo(wr - 30, Y(o.yn) - 10); c.lineTo(wr - 20, Y(o.yn) - 10); c.lineTo(wr - 25, Y(o.yn) - 2); c.closePath(); c.fill();
        // wetted perimeter
        c.strokeStyle = C.accent; c.lineWidth = 4; c.lineCap = 'round';
        c.beginPath(); c.moveTo(wl, Y(o.yn)); c.lineTo(X(-o.b / 2), Y(0)); c.lineTo(X(o.b / 2), Y(0)); c.lineTo(wr, Y(o.yn)); c.stroke(); c.lineCap = 'butt';
        // critical depth
        const cl = X(-o.b / 2 - o.z * o.yc) - 14, cr = X(o.b / 2 + o.z * o.yc) + 14;
        c.strokeStyle = C.warn; c.lineWidth = 1.6; c.setLineDash([7, 5]); c.beginPath(); c.moveTo(cl, Y(o.yc)); c.lineTo(cr, Y(o.yc)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'yc = ' + f3(o.yc, 2) + ' m', cl - 4, Y(o.yc), { color: C.warn, size: 12, align: 'right', weight: 600 });
        // dimensions
        const ax = xr + 22;
        kit.arrow(c, ax, Y(0) - 1, ax, Y(o.yn) + 1, C.text, 1.3, 7); kit.arrow(c, ax, Y(o.yn) + 1, ax, Y(0) - 1, C.text, 1.3, 7);
        kit.label(c, 'yₙ = ' + f3(o.yn, 2) + ' m', ax + 6, Y(o.yn / 2), { color: C.text, size: 12, align: 'left', weight: 700 });
        kit.label(c, 'b = ' + f3(o.b, 1) + ' m', cx, by + 12, { color: C.text, size: 12 });
        if (o.z > 0) kit.label(c, o.z.toFixed(1) + ' : 1', X(o.b / 2 + o.z * yb * 0.5) + 16, Y(yb * 0.5), { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'V = ' + f3(o.Vm, 2) + ' m/s', cx, Y(o.yn * 0.45), { color: C.text, size: 13, weight: 700, bg: C.surface });
        kit.label(c, 'wetted perimeter P = ' + f3(o.s.P, 2) + ' m', 12, 14, { color: C.accent, size: 12, align: 'left', weight: 600 });
        kit.label(c, 'Fr = ' + f3(o.Fr, 2) + (o.Fr < 1 ? ' — subcritical' : ' — supercritical'), W - 12, 14, { color: o.Fr < 1 ? C.text : C.bad, size: 12, align: 'right', weight: 700 });
        if (o.over) kit.label(c, 'far too small for this flow', W / 2, 34, { color: C.bad, size: 12, weight: 700 });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================== chan-ripples */
  Hyper.sim('chan-ripples', {
    title: 'Ripples in a moving stream',
    blurb: `Looking down on a shallow channel flowing from left to right. A post in the stream (or a pebble you drop by clicking) sends out ripples that travel at the shallow-water wave speed $c = \\sqrt{gy}$, while the current carries them downstream at the flow velocity $V$. The Froude number $V/c$ decides whether a ripple can work its way upstream.

**Try this**
- Start with still water (V = 0): the rings are circles centred on the post.
- Raise the velocity: the rings crowd together upstream and spread apart downstream. The upstream edge creeps against the current at c − V.
- Pass Fr = 1: no ring gets upstream of the post any more, and a V-shaped wake appears with half-angle sin β = 1/Fr — the water's Mach cone.
- Keep the velocity and make the water deeper: the waves get faster and the flow can turn subcritical again.
- Click anywhere on the water to drop a pebble.`,
    mount(box, kit) {
      const g = kit.fluid.g0;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const Lw = 8;                                       // metres of channel across the stage
      const rings = [], streaks = [];
      let t = 0, emit = 0;
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Flow velocity V', min: 0, max: 4, step: 0.05, value: 1.2, unit: 'm/s' },
        { id: 'y', label: 'Water depth y', min: 0.02, max: 1.5, step: 0.01, value: 0.3, unit: 'm' },
        { id: 'post', type: 'check', label: 'Post in the stream (steady ripples)', value: true },
        { type: 'buttons', items: [{ id: 'drop', label: 'Drop a pebble', primary: true }, { id: 'clear', label: 'Clear' }] }
      ], id => {
        if (id === 'drop') rings.push({ x: Lw * 0.45, y: 0.5, t0: t, pebble: true });
        if (id === 'clear') rings.length = 0;
      });
      const ro = kit.readout(box.side, [['c', 'Wave speed c = √(gy)'], ['fr', 'Froude number V/c'], ['up', 'Upstream edge of a ring'], ['beta', 'Wake half-angle β']]);
      const V = ctl.values;
      for (let k = 0; k < 50; k++) streaks.push({ x: Math.random() * Lw, y: 0.08 + 0.84 * Math.random() });
      let sc = 1, ww = 1;
      kit.click(st, p => { if (sc > 0 && p.y > 0 && p.y < st.H) rings.push({ x: p.x / sc, y: clamp((p.y / sc) / ww, 0.05, 0.95), t0: t, pebble: true }); return true; }, () => true);
      const loop = kit.loop(dt => {
        t += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        sc = W / Lw; ww = H / sc;                          // ww: channel width in metres
        const cw = Math.sqrt(g * V.y), Fr = V.V / cw;
        const post = { x: Lw * 0.3, y: 0.5 };
        if (V.post) { emit += dt; if (emit > 0.3) { emit = 0; rings.push({ x: post.x, y: post.y, t0: t }); } }
        while (rings.length > 70) rings.shift();
        // water and banks
        c.fillStyle = kit.hue(205, 0.18); c.fillRect(0, 0, W, H);
        c.fillStyle = kit.hue(120, 0.28); c.fillRect(0, 0, W, 10); c.fillRect(0, H - 10, W, 10);
        // the current: streaks drifting at V
        c.strokeStyle = kit.hue(205, 0.45); c.lineWidth = 1.2;
        for (const s of streaks) {
          s.x += V.V * dt; if (s.x > Lw + 0.3) { s.x = -0.3; s.y = 0.08 + 0.84 * Math.random(); }
          const len = 4 + 12 * V.V;
          c.beginPath(); c.moveTo(s.x * sc - len, s.y * H); c.lineTo(s.x * sc, s.y * H); c.stroke();
        }
        // ripples: centre carried at V, radius growing at c
        for (let i = rings.length - 1; i >= 0; i--) {
          const r = rings[i], age = t - r.t0, rad = cw * age, xc = r.x + V.V * age;
          if (rad > 1.6 * Lw || xc - rad > Lw) { rings.splice(i, 1); continue; }
          const a = clamp(1 - age / 3.5, 0.08, 1);
          c.strokeStyle = r.pebble ? (C.dark ? 'rgba(255,200,90,' + a + ')' : 'rgba(200,110,0,' + a + ')') : kit.hue(205, 0.25 + 0.6 * a);
          c.lineWidth = r.pebble ? 2 : 1.4;
          c.beginPath(); c.arc(xc * sc, r.y * H, Math.max(0.5, rad * sc), 0, Math.PI * 2); c.stroke();
        }
        // the post and, above Fr = 1, its wedge
        if (V.post) {
          if (Fr > 1) {
            const beta = Math.asin(1 / Fr), L = 2 * W;
            c.strokeStyle = C.bad; c.lineWidth = 1.5; c.setLineDash([6, 5]);
            c.beginPath(); c.moveTo(post.x * sc, post.y * H); c.lineTo(post.x * sc + L * Math.cos(beta), post.y * H - L * Math.sin(beta));
            c.moveTo(post.x * sc, post.y * H); c.lineTo(post.x * sc + L * Math.cos(beta), post.y * H + L * Math.sin(beta)); c.stroke(); c.setLineDash([]);
            kit.label(c, 'sin β = 1/Fr', post.x * sc + 90, post.y * H - 90 * Math.tan(beta) - 12, { color: C.bad, size: 12, weight: 700 });
          }
          kit.dot(c, post.x * sc, post.y * H, 6, C.text);
        }
        kit.arrow(c, W - 150, 26, W - 70, 26, C.text, 2);
        kit.label(c, 'V = ' + V.V.toFixed(2) + ' m/s', W - 158, 26, { color: C.text, size: 12, align: 'right', weight: 700 });
        kit.label(c, Fr < 0.98 ? 'subcritical: ripples reach upstream' : Fr > 1.02 ? 'supercritical: nothing travels upstream' : 'critical: the upstream edge stands still', 12, H - 22, { color: Fr > 1.02 ? C.bad : C.text, size: 12, align: 'left', weight: 700, bg: C.surface });
        kit.label(c, '1 m', 22 + sc / 2, 24, { color: C.muted, size: 11 });
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(22, 34); c.lineTo(22 + sc, 34); c.stroke();
        ro.set('c', f3(cw, 2) + ' m/s');
        ro.set('fr', f3(Fr, 2));
        ro.set('up', Fr < 1 ? 'moves upstream at ' + f3(cw - V.V, 2) + ' m/s' : 'swept downstream at ' + f3(V.V - cw, 2) + ' m/s');
        ro.set('beta', Fr > 1 ? f3(Math.asin(1 / Fr) * 180 / Math.PI, 1) + '°' : 'none (Fr ≤ 1)');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================== chan-energy */
  Hyper.sim('chan-energy', {
    title: 'Specific energy: a step and a narrowing',
    blurb: `A long section of a rectangular channel with a smooth step in its bed; the channel can also narrow over the step (the plan view at the top). The dashed blue line is the energy line, the dotted orange line the critical depth above the local bed. Below, the specific-energy diagram: point 1 is the flow upstream, point 2 the flow on the step.

**Try this**
- With subcritical flow, raise the step: the water surface *dips* over it, and point 2 slides left along the upper limb toward the nose of the curve.
- Keep raising it: at $\\Delta z = E_1 - E_{min}$ the flow on the step is critical. Beyond that the channel **chokes** — the water upstream backs up, and below the step the flow shoots down supercritically and returns through a jump.
- Lower the upstream depth below critical: now the approaching flow is supercritical and the water *rises* over the step.
- Narrow the channel instead of raising the bed: the curve for the narrowing moves right, and a severe enough narrowing chokes the flow on its own — the principle of the venturi flume.`,
    mount(box, kit) {
      const g = kit.fluid.g0;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 240 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'specific energy E (m)' }, y: { label: 'depth y (m)', min: 0 }, legend: true }, 210);
      const ctl = kit.controls(box.side, [
        { id: 'q', label: 'Flow per metre of width q (upstream)', min: 0.2, max: 5, step: 0.05, value: 2, unit: 'm²/s' },
        { id: 'y1', label: 'Approach depth y₁', min: 0.15, max: 4, step: 0.01, value: 1.8, unit: 'm' },
        { id: 'dz', label: 'Height of the step Δz', min: 0, max: 1.5, step: 0.01, value: 0.3, unit: 'm' },
        { id: 'r', label: 'Width on the step b₂/b₁', min: 0.3, max: 1, step: 0.01, value: 1 }
      ], () => recompute());
      const ro = kit.readout(box.side, [['yc', 'Critical depth yc (upstream)'], ['E', 'E₁ / Emin upstream'], ['fr', 'Froude number upstream'], ['y2', 'Depth on the step'], ['surf', 'Surface on the step'], ['dzm', 'Highest step without choking'], ['state', 'State']]);
      const V = ctl.values;
      const N = 180, xJ = 0.84;
      let o = null;
      const parts = [];
      for (let k = 0; k < 90; k++) parts.push({ x: Math.random(), f: 0.1 + 0.8 * Math.random() });
      const bump = x => x < 0.35 ? 0 : x < 0.45 ? smooth((x - 0.35) / 0.1) : x < 0.6 ? 1 : x < 0.7 ? smooth((0.7 - x) / 0.1) : 0;
      function recompute() {
        const C = kit.colors();
        const q = V.q, y1 = V.y1, dz = V.dz, r = V.r;
        const yc1 = Math.cbrt(q * q / g), E1 = y1 + q * q / (2 * g * y1 * y1), sub = y1 >= yc1;
        const q2 = q / r, yc2 = Math.cbrt(q2 * q2 / g), Emin2 = 1.5 * yc2;
        const choked = E1 - dz < Emin2 - 1e-9;
        const Eu = choked ? Emin2 + dz : E1;
        const yu = choked ? altDepth(Eu, q, true, g) : y1;
        const y2 = choked ? yc2 : altDepth(E1 - dz, q2, sub, g);
        const zb = [], yy = [], qq = [], ycl = [];
        for (let k = 0; k <= N; k++) {
          const x = k / N, bb = bump(x), zx = dz * bb, qx = q / (1 - (1 - r) * bb);
          let y;
          if (!choked) y = altDepth(E1 - zx, qx, sub, g);
          else if (x <= 0.525) y = altDepth(Eu - zx, qx, true, g);
          else if (!sub || x < xJ) y = altDepth(Eu - zx, qx, false, g);
          else y = y1;
          zb.push(zx); yy.push(y); qq.push(qx); ycl.push(Math.cbrt(qx * qx / g));
        }
        o = { q, y1, dz, r, yc1, E1, sub, q2, yc2, Emin2, choked, Eu, yu, y2, zb, yy, qq, ycl, Et: y1 + q * q / (2 * g * y1 * y1) };
        ro.set('yc', f3(yc1, 3) + ' m');
        ro.set('E', f3(Eu, 3) + ' m / ' + f3(1.5 * yc1, 3) + ' m');
        ro.set('fr', f3(q / yu / Math.sqrt(g * yu), 2) + (yu >= yc1 ? ' (subcritical)' : ' (supercritical)'));
        ro.set('y2', f3(y2, 3) + ' m' + (choked ? ' (critical)' : ''));
        const ds = dz + y2 - yu;
        ro.set('surf', (ds < 0 ? 'dips ' : 'rises ') + f3(Math.abs(ds) * 100, 1) + ' cm');
        const dzm = E1 - Emin2;
        ro.set('dzm', dzm > 0 ? f3(dzm, 3) + ' m' : 'none: the narrowing alone chokes the flow');
        ro.set('state', choked ? (sub ? 'choked: water backs up ' + f3((yu - y1) * 100, (yu - y1) < 0.1 ? 1 : 0) + ' cm upstream' : 'choked: a jump is pushed upstream, the approach turns subcritical') : 'flows past without choking');
        // the E–y diagram
        const Emax = Math.max(Eu, E1) * 1.35 + 0.1, ymaxP = Math.max(yu, y1, Eu) * 1.15;
        const curve = qq2 => { const ycq = Math.cbrt(qq2 * qq2 / g), pts = []; for (let k = 0; k <= 140; k++) { const y = ycq * 0.3 + (ymaxP - ycq * 0.3) * k / 140; pts.push([y + qq2 * qq2 / (2 * g * y * y), y]); } return pts; };
        const series = [{ pts: curve(q), label: 'q = ' + f3(q, 2) + ' m²/s (upstream)' }];
        if (r < 0.999) series.push({ pts: curve(q2), label: 'q = ' + f3(q2, 2) + ' m²/s (narrowed)', dash: [6, 4], color: C.series[1] });
        series.push({ pts: [[0, 0], [Emax, Emax]], label: 'E = y', dash: [2, 5], color: C.faint });
        plot.set({
          series,
          marks: [{ x: Eu, y: yu, label: '1' }, { x: Eu - dz, y: y2, label: '2', color: C.warn }, { x: 1.5 * yc1, y: yc1, color: C.muted, r: 4 }],
          vlines: [{ x: Eu, label: 'E₁' }].concat(dz > 0.005 ? [{ x: Eu - dz, label: 'E₁ − Δz' }] : []),
          x: { label: 'specific energy E (m)', min: 0, max: Emax }, y: { label: 'depth y (m)', min: 0, max: ymaxP }
        });
      }
      recompute();
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const planH = 44, top = Math.max(o.Eu, o.y1, o.yu) * 1.15 + 0.05;
        const sy = (H - planH - 36) / top, base = H - 18;
        const X = x => 16 + x * (W - 32), Y = z => base - z * sy;
        // plan view of the channel walls
        const pc = 22, hw = 16;
        c.strokeStyle = C.text; c.lineWidth = 2;
        for (const sgn of [-1, 1]) { c.beginPath(); for (let k = 0; k <= N; k++) { const w = hw * (1 - (1 - o.r) * bump(k / N)); const xx = X(k / N), yy = pc + sgn * w; if (k) c.lineTo(xx, yy); else c.moveTo(xx, yy); } c.stroke(); }
        c.fillStyle = kit.hue(205, 0.22); c.beginPath();
        for (let k = 0; k <= N; k++) { const w = hw * (1 - (1 - o.r) * bump(k / N)); if (k) c.lineTo(X(k / N), pc - w); else c.moveTo(X(0), pc - w); }
        for (let k = N; k >= 0; k--) { const w = hw * (1 - (1 - o.r) * bump(k / N)); c.lineTo(X(k / N), pc + w); }
        c.closePath(); c.fill();
        kit.label(c, 'plan', X(0) + 4, pc, { color: C.muted, size: 10, align: 'left' });
        // bed with the step
        c.beginPath(); c.moveTo(X(0), Y(0));
        for (let k = 0; k <= N; k++) c.lineTo(X(k / N), Y(o.zb[k]));
        c.lineTo(X(1), H); c.lineTo(X(0), H); c.closePath();
        c.fillStyle = C.surface2; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        // water
        c.beginPath(); for (let k = 0; k <= N; k++) { const xx = X(k / N), yy = Y(o.zb[k] + o.yy[k]); if (k) c.lineTo(xx, yy); else c.moveTo(xx, yy); }
        for (let k = N; k >= 0; k--) c.lineTo(X(k / N), Y(o.zb[k]));
        c.closePath(); c.fillStyle = kit.hue(205, 0.3); c.fill();
        c.strokeStyle = kit.hue(205); c.lineWidth = 2; c.beginPath();
        for (let k = 0; k <= N; k++) { const xx = X(k / N), yy = Y(o.zb[k] + o.yy[k]); if (k) c.lineTo(xx, yy); else c.moveTo(xx, yy); }
        c.stroke();
        // critical depth above the local bed
        c.strokeStyle = C.warn; c.lineWidth = 1.3; c.setLineDash([2, 4]); c.beginPath();
        for (let k = 0; k <= N; k++) { const xx = X(k / N), yy = Y(o.zb[k] + o.ycl[k]); if (k) c.lineTo(xx, yy); else c.moveTo(xx, yy); }
        c.stroke(); c.setLineDash([]);
        // energy line
        c.strokeStyle = C.accent; c.lineWidth = 1.6; c.setLineDash([8, 5]); c.beginPath();
        const xEnd = o.choked && o.sub ? xJ : 1;
        c.moveTo(X(0), Y(o.Eu)); c.lineTo(X(xEnd), Y(o.Eu));
        if (o.choked && o.sub) { c.moveTo(X(xJ), Y(o.Et)); c.lineTo(X(1), Y(o.Et)); }
        c.stroke(); c.setLineDash([]);
        kit.label(c, 'energy line  E = ' + f3(o.Eu, 2) + ' m', X(0.02), Y(o.Eu) - 9, { color: C.accent, size: 11, align: 'left', weight: 600 });
        // a jump below a choked step
        if (o.choked && o.sub) {
          const k = Math.round(xJ * N), xx = X(xJ), yTop = Y(o.y1), yLow = Y(o.yy[k - 1]);
          c.strokeStyle = foam(C); c.lineWidth = 1.5;
          for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(xx + 6 + i * 7, (yTop + yLow) / 2, 5 + 2 * Math.sin(loop.t * 6 + i), 0, Math.PI * 1.6); c.stroke(); }
          kit.label(c, 'jump', xx + 14, yTop - 10, { color: C.muted, size: 11 });
        }
        // particles carried at the local velocity
        const k0 = x => clamp(Math.round(x * N), 0, N);
        for (const p of parts) {
          const k = k0(p.x), u = o.qq[k] / Math.max(o.yy[k], 1e-3);
          p.x += Math.min(0.02, u * 16 * dt / (W - 32));
          if (p.x > 1) { p.x -= 1; p.f = 0.1 + 0.8 * Math.random(); }
          const kk = k0(p.x);
          c.fillStyle = foam(C); c.fillRect(X(p.x) - 1.2, Y(o.zb[kk] + p.f * o.yy[kk]) - 1.2, 2.4, 2.4);
        }
        // labels
        const kc = Math.round(0.525 * N);
        kit.label(c, 'y₁ = ' + f3(o.yu, 2) + ' m', X(0.16), Y(o.yu / 2), { color: C.text, size: 12, weight: 700, bg: C.surface });
        kit.label(c, 'y₂ = ' + f3(o.yy[kc], 2) + ' m', X(0.525), Y(o.zb[kc] + o.yy[kc]) - 12, { color: C.text, size: 12, weight: 700 });
        if (o.dz > 0.01) kit.label(c, 'Δz = ' + f3(o.dz, 2) + ' m', X(0.525), Y(o.dz / 2) + 2, { color: C.muted, size: 11 });
        kit.label(c, 'yc', X(0.99), Y(o.zb[N] + o.ycl[N]) - 8, { color: C.warn, size: 11, align: 'right' });
        if (o.choked) kit.label(c, 'CHOKED', W - 12, planH + 8, { color: C.bad, size: 13, weight: 800, align: 'right' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================== chan-jump */
  Hyper.sim('chan-jump', {
    title: 'A hydraulic jump on a stilling-basin apron',
    blurb: `Fast, shallow water comes down a spillway chute onto a level apron and jumps up to meet the deeper, slower water downstream. The depth after the jump follows from momentum (Bélanger), the energy lost from the difference in energy lines. Particles show the flow — including the **roller**, whose surface water runs back upstream.

**Try this**
- Sweep the upstream Froude number from 1 to 12 and watch the jump change type: undular waves, a weak jump, an oscillating one, a steady jump, a strong one — and the share of energy destroyed climb from almost nothing to over 80 %.
- Lower the tailwater below the sequent depth: the jump is swept down the apron — in a real basin, off the concrete onto the riverbed.
- Raise the tailwater above it: the jump is pushed back and drowned against the chute.
- Watch the surface particles in the roller: they flow *backwards*. That recirculation is what traps swimmers below weirs.`,
    mount(box, kit) {
      const F = kit.fluid, g = F.g0;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      let xj = 0.35;
      const ctl = kit.controls(box.side, [
        { id: 'y1', label: 'Depth before the jump y₁', min: 0.05, max: 1.5, step: 0.01, value: 0.5, unit: 'm' },
        { id: 'fr', label: 'Froude number before the jump Fr₁', min: 1, max: 12, step: 0.1, value: 5.4 },
        { id: 'rt', label: 'Tailwater depth (× sequent depth)', min: 0.7, max: 1.3, step: 0.01, value: 1 }
      ], id => { if (id !== 'rt') xj = 0.35; recompute(); });
      const ro = kit.readout(box.side, [['v1', 'V₁ and q'], ['y2', 'Sequent depth y₂ (y₂/y₁)'], ['fr2', 'Froude number after'], ['de', 'Head lost ΔE (share of E₁)'], ['pw', 'Power dissipated per metre width'], ['len', 'Length of the jump ≈ 6 y₂'], ['type', 'Type of jump'], ['tw', 'Tailwater']]);
      const V = ctl.values;
      let o = null;
      const parts = [];
      for (let k = 0; k < 170; k++) parts.push({ s: Math.random(), f: Math.random() });
      function recompute() {
        const y1 = V.y1, Fr1 = V.fr, V1 = Fr1 * Math.sqrt(g * y1), q = V1 * y1;
        const J = F.hydraulicJump(y1, Fr1), y2 = J.y2, V2 = q / y2, E1 = y1 + V1 * V1 / (2 * g), E2 = y2 + V2 * V2 / (2 * g);
        const type = Fr1 < 1.7 ? 'undular' : Fr1 < 2.5 ? 'weak' : Fr1 < 4.5 ? 'oscillating' : Fr1 < 9 ? 'steady' : 'strong';
        o = { y1, Fr1, V1, q, y2, V2, E1, E2, dE: J.loss, Fr2: F.froude(V2, y2), type, Lj: Math.max(6 * y2, 3 * y1), P: 1000 * g * q * J.loss };
        ro.set('v1', f3(V1, 2) + ' m/s, ' + f3(q, 2) + ' m²/s');
        ro.set('y2', f3(y2, 2) + ' m (' + f3(y2 / y1, 2) + ')');
        ro.set('fr2', f3(o.Fr2, 2));
        ro.set('de', f3(J.loss, 3) + ' m (' + f3(100 * J.loss / E1, 0) + ' %)');
        ro.set('pw', o.P >= 1e6 ? f3(o.P / 1e6, 2) + ' MW' : f3(o.P / 1000, 1) + ' kW');
        ro.set('len', f3(6 * y2, 1) + ' m');
        ro.set('type', type + (type === 'oscillating' ? ' — avoid in basins' : type === 'steady' ? ' — best for basins' : ''));
      }
      recompute();
      const loop = kit.loop(dt => {
        const rt = V.rt;
        if (Math.abs(rt - 1) > 0.015) xj = clamp(xj + (1 - rt) * 0.45 * dt, 0.06, 0.97);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const yt = rt * o.y2;
        const x0 = 110, x1 = W - 50, Wa = x1 - x0;              // the apron
        const Lapron = o.Lj / 0.3, hs = Wa / Lapron;             // px per metre, horizontally
        const top = Math.max(o.y2, yt) * 1.45, ys = (H - 60) / top, base = H - 26;   // px per metre, vertically
        const Y = y => base - y * ys, Xs = s => x0 + s * hs;
        const toe = xj * Lapron;
        const target = yt;
        const depth = s => {
          if (s < toe) return o.y1;
          const u = (s - toe) / o.Lj;
          if (o.type === 'undular') return target + (o.y1 - target) * Math.exp(-3 * u) * Math.cos(2.4 * Math.PI * u);
          if (u >= 1) return target;
          return o.y1 + (target - o.y1) * Math.pow(Math.sin(Math.PI / 2 * u), 0.7);
        };
        // chute and apron
        c.beginPath(); c.moveTo(0, Y(o.y2 * 1.2)); c.quadraticCurveTo(x0 - 30, Y(0), x0, Y(0)); c.lineTo(x1, Y(0)); c.lineTo(x1, Y(o.y2 * 0.12)); c.lineTo(x1 + 8, Y(o.y2 * 0.12)); c.lineTo(x1 + 8, Y(-0.05 * o.y2)); c.lineTo(W, Y(-0.05 * o.y2));
        c.lineTo(W, H); c.lineTo(0, H); c.closePath();
        c.fillStyle = C.surface2; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        // the sheet on the chute
        c.fillStyle = kit.hue(205, 0.35);
        c.beginPath(); c.moveTo(0, Y(o.y2 * 1.2) - o.y1 * ys); c.quadraticCurveTo(x0 - 30, Y(o.y1), x0, Y(o.y1)); c.lineTo(x0, Y(0)); c.quadraticCurveTo(x0 - 30, Y(0), 0, Y(o.y2 * 1.2)); c.closePath(); c.fill();
        // water on the apron
        const M = 160;
        c.beginPath(); c.moveTo(x0, Y(0));
        for (let k = 0; k <= M; k++) {
          const s = Lapron * k / M, u = (s - toe) / o.Lj;
          let yy = depth(s);
          if (u > 0 && u < 1 && o.type !== 'undular') yy += 0.05 * (o.y2 - o.y1) * Math.sin(k * 1.7 + loop.t * 9) * Math.sin(Math.PI * u);
          c.lineTo(Xs(s), Y(yy));
        }
        c.lineTo(x1, Y(0)); c.closePath(); c.fillStyle = kit.hue(205, 0.32); c.fill();
        c.strokeStyle = kit.hue(205); c.lineWidth = 2; c.beginPath();
        for (let k = 0; k <= M; k++) { const s = Lapron * k / M; const xx = Xs(s), yy = Y(depth(s)); if (k) c.lineTo(xx, yy); else c.moveTo(xx, yy); }
        c.stroke();
        c.fillStyle = kit.hue(205, 0.32); c.fillRect(x1 + 8, Y(target), W - x1 - 8, Y(-0.05 * o.y2) - Y(target));
        // the roller
        if (o.type !== 'undular' && toe < Lapron) {
          c.strokeStyle = foam(C); c.lineWidth = 1.4;
          for (let i = 0; i < 6; i++) {
            const s = toe + o.Lj * (0.1 + 0.13 * i); if (s > Lapron) break;
            const yy = depth(s) * 0.72, rr = Math.max(3, 0.18 * (o.y2 - o.y1) * ys);
            c.beginPath(); c.arc(Xs(s), Y(yy), rr, loop.t * 5 + i, loop.t * 5 + i + 4.4); c.stroke();
          }
        }
        // particles: forward in the sheet and below the roller, backward in the roller's surface layer
        const slow = Math.min(1, 240 / (o.V1 * hs));
        for (const p of parts) {
          const s = p.s * Lapron, u = (s - toe) / o.Lj, yLoc = depth(s);
          let vel = s < toe ? o.V1 : u < 1 ? (p.f > 0.62 && o.type !== 'undular' ? -0.3 * o.V1 * Math.sin(Math.PI * u) : o.V1 + (o.q / target - o.V1) * u) : o.q / target;
          p.s += vel * slow * dt / Lapron;
          if (u > 0 && u < 1 && p.s * Lapron < toe + 0.05 * o.Lj && vel < 0) p.f = 0.2 * Math.random();   // recirculated into the jet
          if (p.s > 1) { p.s = 0; p.f = Math.random(); }
          if (p.s < 0) p.s = 0;
          c.fillStyle = foam(C); c.fillRect(Xs(p.s * Lapron) - 1.3, Y(p.f * yLoc) - 1.3, 2.6, 2.6);
        }
        // energy lines
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.setLineDash([8, 5]);
        const yE1 = Y(o.E1), yE2 = Y(o.E2);
        const offTop = yE1 < 16;
        c.beginPath(); c.moveTo(x0, Math.max(16, yE1)); c.lineTo(Xs(toe), Math.max(16, yE1)); c.moveTo(Xs(toe + o.Lj), yE2); c.lineTo(x1, yE2); c.stroke(); c.setLineDash([]);
        kit.label(c, 'E₁ = ' + f3(o.E1, 2) + ' m' + (offTop ? ' (above the frame)' : ''), x0 + 4, Math.max(16, yE1) + (offTop ? 12 : -9), { color: C.accent, size: 11, align: 'left', weight: 600 });
        kit.label(c, 'E₂ = ' + f3(o.E2, 2) + ' m', x1 - 4, yE2 - 9, { color: C.accent, size: 11, align: 'right', weight: 600 });
        // sequent depth marker when the tailwater does not match
        if (Math.abs(rt - 1) > 0.015) {
          c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(x1 - 150, Y(o.y2)); c.lineTo(x1, Y(o.y2)); c.stroke(); c.setLineDash([]);
          kit.label(c, 'sequent depth y₂', x1 - 154, Y(o.y2), { color: C.muted, size: 11, align: 'right' });
        }
        kit.label(c, 'y₁ = ' + f3(o.y1, 2) + ' m', Xs(Math.max(0, toe) * 0.5) + 10, Y(o.y1) - 12, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'y = ' + f3(target, 2) + ' m', x1 - 50, Y(target / 2), { color: C.text, size: 12, weight: 700, bg: C.surface });
        const msg = xj >= 0.965 ? 'tailwater too low: the jump is swept off the apron' : xj <= 0.065 ? 'tailwater too high: the jump is drowned against the chute' : rt < 0.985 ? 'tailwater low: the jump moves downstream' : rt > 1.015 ? 'tailwater high: the jump moves upstream' : 'tailwater matches: the jump stays put';
        kit.label(c, msg, W - 12, 16, { color: xj >= 0.965 ? C.bad : C.text, size: 12, weight: 700, align: 'right' });
        kit.label(c, 'vertical scale ×' + f3(ys / hs, 1) + (slow < 1 ? ',  slow motion ×' + f3(1 / slow, 1) : ''), 12, H - 8, { color: C.muted, size: 10, align: 'left' });
        ro.set('tw', f3(target, 2) + ' m — ' + (xj >= 0.965 ? 'jump swept away' : xj <= 0.065 ? 'drowned jump' : rt < 0.985 ? 'jump moving downstream' : rt > 1.015 ? 'jump moving upstream' : 'jump held'));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================== chan-gvf */
  Hyper.sim('chan-gvf', {
    title: 'Water-surface profiles',
    blurb: `A rectangular channel 10 m wide, drawn along its length with depths to scale (the bed is drawn with a fixed tilt). The dashed green line is the **normal depth**, the dotted orange line the **critical depth**. From the control — a weir downstream, a free overfall, or a sluice gate upstream — the water surface is computed by the direct step method, $\\Delta x = (E_2 - E_1)/(S_0 - \\bar S_f)$, in the direction information travels.

**Try this**
- Weir downstream on a mild slope: an **M1** backwater reaching far upstream. Lower the weir below normal depth: an **M2** drawdown. Lower it below critical: the water falls freely over the end.
- Steepen the slope past critical (S turns from mild to steep): with the weir, a hydraulic jump appears and an **S1** curve rises from it to the weir; without, nothing downstream can affect the supercritical flow.
- Sluice gate upstream on a mild slope: an **M3** curve rises from the jet until a jump returns it to normal depth. Open the gate wider and the jump moves toward it until it drowns the jet.
- On a steep slope the gate gives an **S3** or an **S2** curve that settles to normal depth.`,
    mount(box, kit) {
      const F = kit.fluid, g = F.g0, b = 10;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'scen', type: 'select', label: 'Control', value: 'dam', options: [['Weir or dam at the downstream end', 'dam'], ['Free overfall at the downstream end', 'fall'], ['Sluice gate at the upstream end', 'gate']] },
        { id: 'Q', label: 'Discharge Q', min: 5, max: 100, step: 1, value: 30, unit: 'm³/s' },
        { id: 'n', type: 'select', label: 'Lining (Manning n)', value: 0.022, options: [['Concrete, n = 0.013', 0.013], ['Clean earth, 0.022', 0.022], ['Earth with weeds, 0.030', 0.03], ['Natural river, 0.045', 0.045]] },
        { id: 'S', label: 'Bed slope S₀', min: 0.0001, max: 0.03, value: 0.0005, log: true, fmt: v => (v * 1000).toPrecision(3) + ' m/km' },
        { id: 'y0', label: 'Depth held by the weir', min: 0.2, max: 10, step: 0.05, value: 4, unit: 'm' },
        { id: 'yg', label: 'Depth of the jet below the gate', min: 0.05, max: 2.5, step: 0.01, value: 0.25, unit: 'm' }
      ], () => recompute());
      const ro = kit.readout(box.side, [['yn', 'Normal depth yₙ'], ['yc', 'Critical depth yc'], ['cls', 'Slope'], ['prof', 'Profile'], ['len', 'Length of the curve'], ['jump', 'Hydraulic jump']]);
      const V = ctl.values;
      let o = null;
      const parts = [];
      for (let k = 0; k < 110; k++) parts.push({ x: Math.random(), f: 0.1 + 0.8 * Math.random() });
      function recompute() {
        ctl.show('y0', V.scen === 'dam'); ctl.show('yg', V.scen === 'gate');
        const Q = V.Q, n = V.n, S = V.S, q = Q / b;
        const E = y => y + q * q / (2 * g * y * y);
        const Sf = y => { const s = F.section(y, b, 0), v = Q / s.A; return n * n * v * v / Math.pow(s.R, 4 / 3); };
        const Fr = y => F.froude(q / y, y);
        const seq = y => F.hydraulicJump(y, Fr(y)).y2;
        const yn = F.normalDepth({ Q, b, z: 0, n, S }), yc = F.criticalDepth({ Q, b, z: 0 }), mild = yn > yc;
        // direct step from ya toward yb: [[distance, depth], …] (distance negative when going upstream)
        const stepTo = (ya, yb, N, stop) => {
          const pts = [[0, ya]]; let x = 0, y = ya;
          for (let k = 1; k <= N; k++) {
            const y2 = ya + (yb - ya) * k / N, den = S - (Sf(y) + Sf(y2)) / 2;
            if (Math.abs(den) < 1e-14) break;
            x += (E(y2) - E(y)) / den; pts.push([x, y2]); y = y2;
            if (stop && stop(y2)) break;
          }
          return pts;
        };
        let segs = [], jump = null, L = 0, name = '', note = '', ctrl = V.scen;
        const uniform = msg => { name = 'uniform flow at normal depth'; note = msg || ''; L = Math.max(100, 100 * yn); };
        if (V.scen === 'dam' || V.scen === 'fall') {
          const y0 = V.scen === 'fall' ? yc : V.y0;
          if (mild) {
            if (y0 <= yc * 1.002) {
              const pts = stepTo(yc * 1.003, 0.99 * yn, 160); const Lp = -pts[pts.length - 1][0]; L = Lp * 1.25;
              segs.push({ pts: pts.map(p => [L + p[0], p[1]]), name: 'M2', len: Lp }); name = 'M2 drawdown to critical depth at the end';
              if (V.scen === 'dam') note = 'the weir is below critical depth: the water falls freely over it';
            } else if (Math.abs(y0 - yn) < 0.01 * yn) uniform('the weir holds the water at its normal depth');
            else {
              const pts = stepTo(y0, y0 > yn ? 1.01 * yn : 0.99 * yn, 160); const Lp = -pts[pts.length - 1][0]; L = Lp * 1.25;
              segs.push({ pts: pts.map(p => [L + p[0], p[1]]), name: y0 > yn ? 'M1' : 'M2', len: Lp });
              name = y0 > yn ? 'M1 backwater' : 'M2 drawdown';
            }
          } else {
            const ys = seq(yn);
            if (V.scen === 'fall' || y0 <= yc * 1.002) uniform(V.scen === 'fall' ? 'the flow is already supercritical: the overfall changes nothing upstream' : 'the weir is below critical depth: supercritical flow does not feel it');
            else if (y0 <= ys) { uniform('the weir is too low to hold the jump off: it stands against the weir'); jump = { x: 0.97, ya: yn, yb: y0, atEnd: true }; }
            else {
              const pts = stepTo(y0, ys, 160); const Lp = -pts[pts.length - 1][0]; L = Math.max(Lp * 2.2, 50 * yn);
              segs.push({ pts: pts.map(p => [L + p[0], p[1]]), name: 'S1', len: Lp }); jump = { x: (L - Lp) / L, ya: yn, yb: ys };
              name = 'jump, then an S1 curve up to the weir';
            }
          }
        } else {
          const yg = V.yg;
          if (yg >= yc * 0.995) uniform('the jet is not supercritical: open this wide, the gate hardly controls the flow');
          else if (mild) {
            if (seq(yg) <= yn) { uniform('the tailwater drowns the jet: the jump is pushed against the gate'); jump = { x: 0.02, ya: yg, yb: yn, atGate: true }; }
            else {
              const pts = stepTo(yg, 0.995 * yc, 160, y => seq(y) <= yn);
              const last = pts[pts.length - 1], Lp = last[0]; L = Math.max(Lp * 2.2, 40 * yn);
              segs.push({ pts, name: 'M3', len: Lp }); jump = { x: Lp / L, ya: last[1], yb: yn };
              name = 'M3 curve, then a jump to normal depth';
            }
          } else if (Math.abs(yg - yn) < 0.01 * yn) uniform('the jet leaves at normal depth');
          else {
            const pts = stepTo(yg, yg < yn ? 0.99 * yn : 1.01 * yn, 160); const Lp = pts[pts.length - 1][0]; L = Lp * 1.3;
            segs.push({ pts, name: yg < yn ? 'S3' : 'S2', len: Lp }); name = yg < yn ? 'S3 rising to normal depth' : 'S2 falling to normal depth';
          }
        }
        if (!(L > 0) || !Number.isFinite(L)) L = 500;
        // depth at any distance
        const yAt = x => {
          for (const s of segs) {
            const p = s.pts, a = Math.min(p[0][0], p[p.length - 1][0]), bnd = Math.max(p[0][0], p[p.length - 1][0]);
            if (x >= a && x <= bnd) {
              for (let k = 1; k < p.length; k++) {
                const x1 = p[k - 1][0], x2 = p[k][0];
                if ((x - x1) * (x - x2) <= 0) { const t = x2 === x1 ? 0 : (x - x1) / (x2 - x1); return p[k - 1][1] + t * (p[k][1] - p[k - 1][1]); }
              }
            }
          }
          if (jump && !jump.atEnd && !jump.atGate) { const xjm = jump.x * L; if (ctrl === 'gate') return x < xjm ? jump.ya : yn; return x < xjm ? yn : jump.yb; }
          return yn;
        };
        const M = 220, prof = [];
        for (let k = 0; k <= M; k++) prof.push(yAt(L * k / M));
        o = { yn, yc, mild, L, prof, M, jump, segs, name, note, Q, q, ctrl, y0: V.scen === 'fall' ? yc : V.y0, yg: V.yg, Vn: q / yn };
        ro.set('yn', f3(yn, 2) + ' m');
        ro.set('yc', f3(yc, 2) + ' m');
        ro.set('cls', mild ? 'mild (yₙ > yc)' : 'steep (yₙ < yc)');
        ro.set('prof', name + (note ? ' — ' + note : ''));
        const Lc = segs.length ? segs[0].len : 0;
        ro.set('len', segs.length ? (Lc >= 1000 ? f3(Lc / 1000, 2) + ' km' : f3(Lc, 0) + ' m') + (jump ? ' (to the jump)' : ' (to within 1 % of yₙ)') : '—');
        ro.set('jump', jump ? (jump.atGate ? 'drowned against the gate' : jump.atEnd ? 'at the weir' : f3(jump.ya, 2) + ' m → ' + f3(jump.yb, 2) + ' m, ' + f3(jump.x * L, 0) + ' m from the upstream end') : 'none');
      }
      recompute();
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        let ymax = Math.max(o.yn, o.yc) * 1.2;
        for (const y of o.prof) ymax = Math.max(ymax, y * 1.15);
        if (o.ctrl === 'dam') ymax = Math.max(ymax, o.y0 * 1.2);
        const tilt = H * 0.14, dsc = (H - tilt - 56) / ymax, x0 = 34, x1 = W - 34;
        const X = f => x0 + f * (x1 - x0), bed = f => H - 22 - tilt * (1 - f);
        const Ys = (f, y) => bed(f) - y * dsc;
        // ground
        c.beginPath(); c.moveTo(0, bed(0)); c.lineTo(X(0), bed(0)); c.lineTo(X(1), bed(1));
        if (o.ctrl === 'fall') { c.lineTo(X(1), bed(1) + 16); c.lineTo(W, bed(1) + 16); } else c.lineTo(W, bed(1));
        c.lineTo(W, H); c.lineTo(0, H); c.closePath();
        c.fillStyle = V.n <= 0.013 ? C.surface2 : kit.hue(30, 0.26); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        // water
        c.beginPath(); c.moveTo(X(0), bed(0));
        for (let k = 0; k <= o.M; k++) c.lineTo(X(k / o.M), Ys(k / o.M, o.prof[k]));
        c.lineTo(X(1), bed(1)); c.closePath(); c.fillStyle = kit.hue(205, 0.3); c.fill();
        c.strokeStyle = kit.hue(205); c.lineWidth = 2; c.beginPath();
        for (let k = 0; k <= o.M; k++) { const xx = X(k / o.M), yy = Ys(k / o.M, o.prof[k]); if (k) c.lineTo(xx, yy); else c.moveTo(xx, yy); }
        c.stroke();
        // normal and critical depth lines
        c.lineWidth = 1.4; c.strokeStyle = C.ok; c.setLineDash([9, 6]); c.beginPath(); c.moveTo(X(0), Ys(0, o.yn)); c.lineTo(X(1), Ys(1, o.yn)); c.stroke();
        c.strokeStyle = C.warn; c.setLineDash([2, 4]); c.beginPath(); c.moveTo(X(0), Ys(0, o.yc)); c.lineTo(X(1), Ys(1, o.yc)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'yₙ', X(0) - 4, Ys(0, o.yn), { color: C.ok, size: 11, align: 'right', weight: 700 });
        kit.label(c, 'yc', X(0) - 4, Ys(0, o.yc), { color: C.warn, size: 11, align: 'right', weight: 700 });
        // the control structure
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        // the weir crest sits about 1.5 yc below the water it holds (the head over a crest)
        if (o.ctrl === 'dam') { const hw = Math.max(0.2, o.y0 - 1.5 * o.yc); c.fillRect(X(1) - 5, Ys(1, hw), 10, bed(1) - Ys(1, hw)); c.strokeRect(X(1) - 5, Ys(1, hw), 10, bed(1) - Ys(1, hw)); }
        if (o.ctrl === 'fall') {                                                   // the nappe falling off the brink
          const yb = Ys(1, o.prof[o.M]);
          c.fillStyle = kit.hue(205, 0.3); c.beginPath(); c.moveTo(X(1), yb); c.quadraticCurveTo(X(1) + 16, yb, X(1) + 22, bed(1) + 16); c.lineTo(X(1) + 10, bed(1) + 16); c.quadraticCurveTo(X(1) + 6, bed(1), X(1), bed(1)); c.closePath(); c.fill();
        }
        if (o.ctrl === 'gate') { const a = o.yg / 0.61; c.fillRect(X(0) - 4, 8, 8, Ys(0, a) - 8); c.strokeRect(X(0) - 4, 8, 8, Ys(0, a) - 8); }
        // the jump
        if (o.jump) {
          const xx = X(clamp(o.jump.x, 0, 1)), yy = Ys(clamp(o.jump.x, 0, 1), Math.max(o.jump.ya, o.jump.yb) * 0.8);
          c.strokeStyle = foam(C); c.lineWidth = 1.6;
          for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(xx + (i - 1) * 7, yy, 4 + 2 * Math.sin(loop.t * 6 + i * 2), 0, Math.PI * 1.6); c.stroke(); }
          kit.label(c, 'jump', xx, yy - 16, { color: C.muted, size: 11 });
        }
        // flow particles, speed in proportion to the local velocity
        for (const p of parts) {
          const k = clamp(Math.round(p.x * o.M), 0, o.M), vloc = o.q / Math.max(o.prof[k], 1e-3);
          p.x += Math.min(0.012, 34 * vloc / o.Vn * dt / (x1 - x0));
          if (p.x > 1) { p.x -= 1; p.f = 0.1 + 0.8 * Math.random(); }
          const kk = clamp(Math.round(p.x * o.M), 0, o.M);
          c.fillStyle = foam(C); c.fillRect(X(p.x) - 1.2, Ys(p.x, p.f * o.prof[kk]) - 1.2, 2.4, 2.4);
        }
        // the profile's name and the scale
        for (const s of o.segs) {
          const mid = s.pts[Math.floor(s.pts.length / 2)], f = clamp(mid[0] / o.L, 0.05, 0.95);
          kit.label(c, s.name, X(f), Ys(f, mid[1]) - 16, { color: C.text, size: 14, weight: 800, bg: C.surface });
        }
        kit.label(c, 'flow →', X(0.5), 14, { color: C.muted, size: 12 });
        kit.label(c, 'reach ' + (o.L >= 1000 ? f3(o.L / 1000, 2) + ' km' : f3(o.L, 0) + ' m') + ' long; depths ×' + f3(dsc * o.L / (x1 - x0), 0) + ' exaggerated', W - 10, H - 8, { color: C.muted, size: 10, align: 'right' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================== chan-vnotch */
  Hyper.sim('chan-vnotch', {
    title: 'Calibrating a V-notch weir',
    blurb: `A pump feeds a measured flow into a tank that empties through a sharp-edged V-notch. The water level rises until the notch passes exactly what comes in; a point gauge in a stilling well reads the **head** $H$ above the vertex. Record points at different flows to calibrate the notch: the log–log graph gives the exponent and the discharge coefficient. (The rig's own coefficient is not quite the textbook 0.58 — finding it is the point of calibrating.)

**Try this**
- Change the flow and watch the level settle; record a point once it is steady. Record five or six points from 1 to 30 L/s.
- On the log–log graph the points fall on a straight line of slope close to 5/2 — the notch law $Q \\propto H^{5/2}$.
- Double the flow: the head rises by only $2^{0.4}$ ≈ 32 %. That is why a V-notch still gives a readable head at small flows.
- Switch to the narrower notches: the same flow stands higher, which suits smaller flows.`,
    mount(box, kit) {
      const F = kit.fluid, g = F.g0;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'head H (mm)', log: true }, y: { label: 'flow Q (L/s)', log: true }, legend: true }, 200);
      const cd0 = { 90: 0.583, 60: 0.577, 53.13: 0.58, 28.07: 0.594 };
      const Atank = 0.5, notchDepth = 0.5;
      const pts = [];
      let msg = '', msgT = 0;
      const ctl = kit.controls(box.side, [
        { id: 'th', type: 'select', label: 'Notch', value: 90, options: [['90° notch', 90], ['60° notch', 60], ['Half-90° notch (53.13°)', 53.13], ['Quarter-90° notch (28.07°)', 28.07]] },
        { id: 'Q', label: 'Pump flow into the tank', min: 0.2, max: 40, value: 5, unit: 'L/s', log: true, sig: 3 },
        { type: 'buttons', items: [{ id: 'rec', label: 'Record a point', primary: true }, { id: 'clr', label: 'Clear points' }] }
      ], id => {
        if (id === 'th') { pts.length = 0; refit(); }
        if (id === 'clr') { pts.length = 0; refit(); }
        if (id === 'rec') {
          const Qin = V.Q / 1000, Qout = qOut(s.H);
          if (Math.abs(Qin - Qout) / Qin > 0.01) { msg = 'wait: the level is still changing'; msgT = 2.5; }
          else { pts.push([s.H * 1000, Qin * 1000]); msg = 'recorded H = ' + f3(s.H * 1000, 1) + ' mm, Q = ' + f3(V.Q, 2) + ' L/s'; msgT = 2.5; refit(); }
        }
      });
      const ro = kit.readout(box.side, [['H', 'Head on the point gauge'], ['qin', 'Flow in / through the notch'], ['book', 'Textbook estimate (Cd = 0.58)'], ['n', 'Points recorded'], ['m', 'Fitted exponent m in Q = K Hᵐ'], ['cd', 'Fitted Cd (with m = 5/2)']]);
      const V = ctl.values;
      const kNotch = () => 8 / 15 * Math.sqrt(2 * g) * Math.tan(V.th * Math.PI / 360);
      const cdTrue = H => (cd0[V.th] || 0.585) + 0.005 * Math.min(2, Math.sqrt(0.05 / Math.max(H, 0.005)));
      const qOut = H => H > 0 ? F.weirV(cdTrue(H), V.th, H) : 0;
      const steadyH = Q => { let lo = 0, hi = 1; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (qOut(m) > Q) hi = m; else lo = m; } return (lo + hi) / 2; };
      const s = { H: steadyH(V.Q / 1000), ph: 0 };
      let fit = null;
      function refit() {
        fit = null;
        if (pts.length >= 2) {
          const xs = pts.map(p => Math.log(p[0] / 1000)), ys = pts.map(p => Math.log(p[1] / 1000)), n = xs.length;
          const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
          let sxx = 0, sxy = 0; for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); }
          const m = sxx > 1e-12 ? sxy / sxx : 2.5, K = Math.exp(my - m * mx);
          const cd = pts.reduce((a, p) => a + (p[1] / 1000) / (kNotch() * Math.pow(p[0] / 1000, 2.5)), 0) / n;
          fit = { m: sxx > 1e-12 ? m : NaN, K, cd };
        } else if (pts.length === 1) fit = { m: NaN, K: NaN, cd: (pts[0][1] / 1000) / (kNotch() * Math.pow(pts[0][0] / 1000, 2.5)) };
        const book = [], fitted = [];
        for (let k = 0; k <= 60; k++) { const Hm = 5 * Math.pow(100, k / 60); book.push([Hm, 1000 * 0.58 * kNotch() * Math.pow(Hm / 1000, 2.5)]); if (fit && Number.isFinite(fit.m)) fitted.push([Hm, 1000 * fit.K * Math.pow(Hm / 1000, fit.m)]); }
        const series = [{ pts: book, label: 'textbook, Cd = 0.58', dash: [6, 4] }];
        if (fitted.length) series.push({ pts: fitted, label: 'fitted to your points' });
        series.push({ pts: pts.slice(), label: 'recorded', line: false, dots: 4 });
        plot.set({ series, x: { label: 'head H (mm)', log: true, min: 5, max: 500 }, y: { label: 'flow Q (L/s)', log: true, min: 0.01, max: 100 } });
        ro.set('n', String(pts.length));
        ro.set('m', fit && Number.isFinite(fit.m) ? f3(fit.m, 3) : 'record two or more points');
        ro.set('cd', fit ? f3(fit.cd, 3) : '—');
      }
      refit();
      const drops = [];
      for (let k = 0; k < 60; k++) drops.push({ t: Math.random(), w: Math.random() });
      const loop = kit.loop(dt => {
        const Qin = V.Q / 1000;
        for (let k = 0; k < 10; k++) s.H = clamp(s.H + (Qin - qOut(s.H)) / Atank * dt / 10, 0, notchDepth);
        const Qout = qOut(s.H);
        if (msgT > 0) msgT -= dt;
        ro.set('H', f3(s.H * 1000, 1) + ' mm' + (Math.abs(Qin - Qout) / Qin > 0.01 ? (Qin > Qout ? ' (rising)' : ' (falling)') : ' (steady)'));
        ro.set('qin', f3(Qin * 1000, 2) + ' / ' + f3(Qout * 1000, 2) + ' L/s');
        const book = 0.58 * kNotch() * Math.pow(s.H, 2.5);
        ro.set('book', f3(book * 1000, 2) + ' L/s (' + (book >= Qout ? '+' : '') + f3(100 * (book - Qout) / Math.max(Qout, 1e-9), 1) + ' %)');
        s.ph += dt;
        if (s.ph > 0.25) { s.ph = 0; plot.set({ marks: [{ x: Math.max(5, s.H * 1000), y: Math.max(0.01, Qout * 1000), color: kit.colors().warn }] }); }
        // drawing on a 760 × 380 design grid
        const c = st.begin(), C = kit.colors(), k = Math.min(st.W / 760, st.H / 380);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 380 * k) / 2); c.scale(k, k);
        const water = kit.hue(205, 0.32), wline = kit.hue(205);
        // --- front view of the plate
        const fs = 200, vx = 135, vy = 250, ty = vy - notchDepth * fs, hw = notchDepth * Math.tan(V.th * Math.PI / 360) * fs;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(20, ty); c.lineTo(vx - hw, ty); c.lineTo(vx, vy); c.lineTo(vx + hw, ty); c.lineTo(250, ty); c.lineTo(250, 350); c.lineTo(20, 350); c.closePath(); c.fill(); c.stroke();
        const wy = vy - s.H * fs, whw = s.H * Math.tan(V.th * Math.PI / 360) * fs;
        if (s.H > 0.001) { c.fillStyle = water; c.beginPath(); c.moveTo(vx - whw, wy); c.lineTo(vx, vy); c.lineTo(vx + whw, wy); c.closePath(); c.fill(); }
        c.strokeStyle = wline; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(20, wy); c.lineTo(250, wy); c.stroke(); c.setLineDash([]);
        kit.label(c, 'front view', 135, 364, { color: C.muted, size: 11 });
        kit.label(c, V.th + '°', vx, vy + 14, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'upstream level', 22, wy - 8, { color: wline, size: 10, align: 'left' });
        // --- side section: tank, stilling well, plate, nappe
        const ss = 200, floor = 330, px = 560, crest = floor - 0.35 * ss, sy = crest - s.H * ss;
        c.fillStyle = water; c.fillRect(300, sy, px - 300, floor - sy);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(300, crest - notchDepth * ss - 10); c.lineTo(300, floor); c.lineTo(px, floor); c.stroke();
        c.fillStyle = C.text; c.fillRect(px - 2, crest - notchDepth * ss, 4, floor - crest + notchDepth * ss);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(px - 30, crest); c.lineTo(px + 10, crest); c.stroke(); c.setLineDash([]);
        kit.label(c, 'vertex', px - 34, crest, { color: C.muted, size: 10, align: 'right' });
        c.strokeStyle = wline; c.lineWidth = 2; c.beginPath(); c.moveTo(300, sy); c.lineTo(px - 2, sy + 0.2 * s.H * ss); c.stroke();
        // the nappe: a falling jet from the notch
        if (s.H > 0.001) {
          const v0 = 0.62 * Math.sqrt(2 * g * s.H), topY = sy + 0.2 * s.H * ss;
          c.fillStyle = water; c.beginPath(); c.moveTo(px + 2, topY);
          for (let i = 0; i <= 20; i++) { const tt = i * 0.02; c.lineTo(px + 2 + v0 * 1.1 * tt * ss, topY + 0.5 * g * tt * tt * ss); }
          for (let i = 20; i >= 0; i--) { const tt = i * 0.02; c.lineTo(px + 2 + v0 * 0.8 * tt * ss, crest + 0.5 * g * tt * tt * ss); }
          c.closePath(); c.fill();
          c.fillStyle = foam(C);
          for (const d of drops) {
            d.t += dt * 1.2; if (d.t > 1) { d.t = 0; d.w = Math.random(); }
            const tt = d.t * 0.4, vv = v0 * (0.8 + 0.3 * d.w), y0 = crest - (1 - d.w) * (crest - topY);
            const xx = px + 2 + vv * tt * ss, yy = y0 + 0.5 * g * tt * tt * ss;
            if (yy < 372) c.fillRect(xx - 1.2, yy - 1.2, 2.4, 2.4);
          }
        }
        c.fillStyle = water; c.fillRect(px + 2, 362, 188, 10);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(px + 2, floor); c.lineTo(px + 2, 372); c.lineTo(750, 372); c.stroke();
        // stilling well and point gauge
        const wx = 400;
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(wx - 10, crest - notchDepth * ss, 20, floor - crest + notchDepth * ss - 12);
        c.fillStyle = water; c.fillRect(wx - 9, sy, 18, floor - 12 - sy);
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(wx, crest - notchDepth * ss - 30); c.lineTo(wx, sy); c.stroke(); kit.dot(c, wx, sy, 3, C.accent);
        kit.label(c, 'H = ' + f3(s.H * 1000, 1) + ' mm', wx, crest - notchDepth * ss - 40, { color: C.accent, size: 13, weight: 700 });
        kit.label(c, 'stilling well', wx + 16, floor - 30, { color: C.muted, size: 10, align: 'left' });
        // inflow pipe
        c.strokeStyle = C.text; c.lineWidth = 8; c.beginPath(); c.moveTo(270, 60); c.lineTo(320, 60); c.lineTo(320, 90); c.stroke();
        kit.arrow(c, 320, 96, 320, 120, kit.hue(205), 2.5);
        kit.label(c, 'Q in = ' + f3(V.Q, 2) + ' L/s', 330, 60, { color: C.text, size: 12, weight: 700, align: 'left' });
        kit.label(c, 'side section', 520, 364, { color: C.muted, size: 11 });
        if (s.H > 0.48) kit.label(c, 'water close to the top of the notch', 520, 30, { color: C.bad, size: 12, weight: 700 });
        if (msgT > 0) kit.label(c, msg, 740, 16, { color: C.text, size: 12, weight: 700, align: 'right', bg: C.surface });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================== chan-sluice */
  Hyper.sim('chan-sluice', {
    title: 'Flow under a sluice gate',
    blurb: `Water from a deep pool passes under a vertical gate, contracts to a thin fast jet ($C_c = 0.61$) and must return to the slower, deeper water downstream. While the tailwater is lower than the jet's sequent depth, the gate runs **free**: a hydraulic jump forms downstream and the discharge depends only on the pool and the opening. Once the tailwater is higher, the jump is pushed back and **drowns** the jet; the discharge, found from energy (pool to jet) and momentum (jet to tailwater), then falls. The graph shows the discharge against the tailwater depth.

**Try this**
- Raise the tailwater slowly: nothing changes under the gate — only the jump moves — until the tailwater reaches the sequent depth. Then the flow starts to fall.
- Open the gate: more flow, a thicker jet, a lower Froude number and a smaller sequent depth, so the gate drowns sooner.
- Raise the pool: the flow rises with the square root of its depth.
- Compare the discharge coefficient with the classic 0.55–0.60 in free flow.`,
    mount(box, kit) {
      const F = kit.fluid, g = F.g0, Cc = 0.61;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'tailwater depth (m)' }, y: { label: 'discharge Q (m³/s)', min: 0 } }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'y1', label: 'Upstream depth y₁', min: 0.5, max: 5, step: 0.05, value: 2.5, unit: 'm' },
        { id: 'a', label: 'Gate opening a', min: 0.05, max: 1.5, step: 0.01, value: 0.4, unit: 'm' },
        { id: 'yt', label: 'Tailwater depth', min: 0.05, max: 4, step: 0.01, value: 1.0, unit: 'm' },
        { id: 'b', label: 'Gate width b', min: 0.5, max: 6, step: 0.1, value: 2, unit: 'm' }
      ], () => recompute());
      const ro = kit.readout(box.side, [['Q', 'Discharge Q'], ['cd', 'Discharge coefficient Cd'], ['jet', 'Jet: depth, speed, Fr'], ['y3', 'Sequent depth of the jet'], ['state', 'Flow'], ['loss', 'Head lost below the gate']]);
      const V = ctl.values;
      // unit discharge for an upstream depth, opening and tailwater: free, or drowned (energy + momentum)
      function solve(y1, a, yt) {
        a = Math.min(a, 0.8 * y1);
        const yv = Cc * a, qf = yv * y1 * Math.sqrt(2 * g / (y1 + yv));
        const FrV = qf / (yv * Math.sqrt(g * yv)), y3 = F.hydraulicJump(yv, FrV).y2;
        if (yt <= y3) return { q: qf, free: true, yv, y3, qf, a, yd: yv };
        if (yt >= y1) return { q: 0, free: false, yv, y3, qf, a, yd: y1 };
        const qM2 = y => g * (yt * yt - y * y) / (2 * (1 / yv - 1 / yt));
        const qE2 = y => 2 * g * (y1 - y) / (1 / (yv * yv) - 1 / (y1 * y1));
        let lo = yv, hi = Math.min(yt, y1);
        for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (qM2(m) - qE2(m) > 0) lo = m; else hi = m; }
        const yd = (lo + hi) / 2;
        return { q: Math.sqrt(Math.max(0, qE2(yd))), free: false, yv, y3, qf, a, yd };
      }
      let o = null;
      const parts = [];
      for (let k = 0; k < 140; k++) parts.push({ x: Math.random(), f: Math.random() });
      function recompute() {
        const C = kit.colors();
        const r = solve(V.y1, V.a, V.yt), Q = r.q * V.b;
        const Vj = r.q / r.yv, Frj = Vj / Math.sqrt(g * r.yv);
        const E1 = V.y1 + (r.q / V.y1) ** 2 / (2 * g), Et = V.yt + (r.q / V.yt) ** 2 / (2 * g);
        o = Object.assign({ Q, Vj, Frj, E1, Et, y1: V.y1, yt: V.yt }, r);
        ro.set('Q', f3(Q, 3) + ' m³/s');
        ro.set('cd', f3(r.q / (r.a * Math.sqrt(2 * g * V.y1)), 3));
        ro.set('jet', f3(r.yv, 3) + ' m, ' + f3(Vj, 2) + ' m/s, Fr ' + f3(Frj, 2));
        ro.set('y3', f3(r.y3, 2) + ' m');
        ro.set('state', r.q === 0 ? 'no flow: the tailwater is as high as the pool' : r.free ? 'free — a jump forms downstream' : 'drowned — ' + f3(100 * r.q / r.qf, 0) + ' % of free flow');
        ro.set('loss', f3(E1 - Et, 3) + ' m');
        const pts = [];
        for (let k = 0; k <= 80; k++) { const ytk = 0.02 + (V.y1 * 0.99 - 0.02) * k / 80; pts.push([ytk, solve(V.y1, V.a, ytk).q * V.b]); }
        plot.set({ series: [{ pts }], marks: [{ x: V.yt, y: Q, label: f3(Q, 2) + ' m³/s' }], vlines: [{ x: r.y3, label: 'drowning starts', color: C.warn }], x: { label: 'tailwater depth (m)', min: 0, max: V.y1 }, y: { label: 'discharge Q (m³/s)', min: 0 } });
      }
      recompute();
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const top = Math.max(o.y1, o.yt) * 1.3, ys = (H - 44) / top, base = H - 20;
        const Y = y => base - y * ys, xg = W * 0.36, xv = xg + Math.max(18, 1.6 * o.a * ys);
        const free = o.free && o.q > 0;
        // where the jump stands in free flow
        const frac = free ? clamp((o.y3 - o.yt) / Math.max(o.y3, 1e-6), 0, 1) : 0;
        const xJ = xv + 20 + frac * (W - xv - 110), Lr = Math.min(80, Math.max(30, 4 * o.y3 * ys * 0.5));
        const depth = x => {
          if (x <= xg) return o.y1;
          if (!free) return o.q > 0 ? o.yd + (o.yt - o.yd) * smooth((x - xg) / (W * 0.3)) : o.yt;   // drowned: water stands over the jet
          if (x <= xv) { const t = (x - xg) / (xv - xg); return o.a + (o.yv - o.a) * smooth(t); }
          if (x < xJ) return o.yv * (1 + 0.15 * (x - xv) / Math.max(1, xJ - xv));
          if (x < xJ + Lr) { const t = (x - xJ) / Lr; return o.yv * 1.15 + (o.yt - o.yv * 1.15) * Math.pow(Math.sin(Math.PI / 2 * t), 0.7); }
          return o.yt;
        };
        // ground
        c.fillStyle = C.surface2; c.fillRect(0, base, W, H - base); c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, base); c.lineTo(W, base); c.stroke();
        // water
        c.beginPath(); c.moveTo(0, base);
        for (let x = 0; x <= W; x += 3) c.lineTo(x, Y(depth(x)));
        c.lineTo(W, base); c.closePath(); c.fillStyle = kit.hue(205, 0.3); c.fill();
        c.strokeStyle = kit.hue(205); c.lineWidth = 2; c.beginPath();
        for (let x = 0; x <= W; x += 3) { if (x > xg - 4 && x < xg + 5) { c.moveTo(x + 3, Y(depth(x + 3))); continue; } if (x) c.lineTo(x, Y(depth(x))); else c.moveTo(x, Y(depth(x))); }
        c.stroke();
        // the drowned jet under the roller
        if (!free && o.q > 0) {
          c.fillStyle = kit.hue(205, 0.3); c.fillRect(xg, Y(o.yv), W * 0.25 + xv - xg, o.yv * ys);
          c.strokeStyle = foam(C); c.lineWidth = 1.3;
          for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(xv + 14 + i * 16, Y((o.yv + o.yd) / 2 + 0.1 * o.yd), Math.max(3, 0.2 * (o.yd - o.yv) * ys), loop.t * 4 + i, loop.t * 4 + i + 4.5); c.stroke(); }
        }
        if (free) {
          c.strokeStyle = foam(C); c.lineWidth = 1.3;
          for (let i = 0; i < 4; i++) { const xx = xJ + Lr * (0.15 + 0.2 * i); if (xx > W - 5) break; c.beginPath(); c.arc(xx, Y(depth(xx) * 0.7), Math.max(3, 0.18 * (o.yt - o.yv) * ys), loop.t * 5 + i, loop.t * 5 + i + 4.5); c.stroke(); }
        }
        // the gate
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(xg - 4, 6, 8, Y(o.a) - 6); c.strokeRect(xg - 4, 6, 8, Y(o.a) - 6);
        // particles
        const sp = 20;
        for (const p of parts) {
          const x = p.x * W, d = depth(x);
          let u = o.q / Math.max(d, 1e-3);
          if (!free && x > xv && x < xv + W * 0.25) u = p.f < o.yv / Math.max(d, 1e-3) ? o.q / o.yv : (p.f > 0.7 ? -0.15 * o.q / o.yv : 0.1 * o.q / o.yv);
          p.x += clamp(u * sp * dt / W, -0.004, 0.02);
          if (p.x > 1) { p.x = 0; p.f = Math.random(); }
          if (p.x < 0) p.x = 0;
          const x2 = p.x * W;
          c.fillStyle = foam(C); c.fillRect(x2 - 1.2, Y(p.f * depth(x2)) - 1.2, 2.4, 2.4);
        }
        kit.label(c, 'y₁ = ' + f3(o.y1, 2) + ' m', xg * 0.5, Y(o.y1 / 2), { color: C.text, size: 12, weight: 700, bg: C.surface });
        kit.label(c, 'a = ' + f3(o.a, 2) + ' m', xg + 10, Y(o.a) - 10, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'tailwater ' + f3(o.yt, 2) + ' m', W - 10, Y(o.yt) - 10, { color: C.text, size: 12, weight: 700, align: 'right' });
        kit.label(c, o.q === 0 ? 'no flow' : free ? (frac > 0.85 ? 'free flow — the jump is swept far downstream' : 'free flow — jump below the gate') : 'drowned gate — ' + f3(100 * o.q / o.qf, 0) + ' % of the free flow', W - 10, 14, { color: free ? C.text : C.bad, size: 12, weight: 700, align: 'right' });
        kit.label(c, 'Q = ' + f3(o.Q, 2) + ' m³/s', 12, 14, { color: C.accent, size: 13, weight: 700, align: 'left' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================== chan-well */
  Hyper.sim('chan-well', {
    title: 'Pumping a well: the cone of depression',
    blurb: `A well pumps steadily from an aquifer, shown in section (depths exaggerated). Water converges on the well through ever smaller cylinders, so the head must fall more and more steeply toward it: the **cone of depression**, given by the Thiem equation for a confined aquifer and the Dupuit–Thiem equation for an unconfined one. The dots move at the seepage velocity (greatly sped up); an observation well reads the head part-way out. The graph shows the drawdown against distance on a logarithmic scale.

**Try this**
- On the graph, the confined drawdown is a straight line against log r: every tenfold step in distance costs the same drop.
- Double the pumping rate: the drawdown doubles everywhere (confined).
- Change the ground from coarse sand to fine sand: ten times less conductivity, ten times the drawdown for the same flow — or a tenth of the flow for the same drawdown.
- In the unconfined aquifer push the pumping rate up until the well runs dry.
- Watch the travel time from the observation well: it sets how wide a protection zone around a supply well must be.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 250 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'distance from the well r (m)', log: true }, y: { label: 'drawdown (m)', min: 0 } }, 160);
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Aquifer', value: 'conf', options: [['Confined (Thiem)', 'conf'], ['Unconfined (Dupuit–Thiem)', 'unconf']] },
        { id: 'K', type: 'select', label: 'Ground', value: 5e-4, options: [['Clean gravel, K = 3×10⁻³ m/s', 3e-3], ['Coarse sand, K = 5×10⁻⁴ m/s', 5e-4], ['Fine sand, K = 5×10⁻⁵ m/s', 5e-5], ['Silty sand, K = 5×10⁻⁶ m/s', 5e-6]] },
        { id: 'Q', label: 'Pumping rate Q', min: 1, max: 300, value: 60, unit: 'm³/h', log: true, sig: 3 },
        { id: 'b', label: 'Aquifer thickness (saturated)', min: 5, max: 50, step: 1, value: 20, unit: 'm' },
        { id: 'R', label: 'Radius of influence R', min: 50, max: 3000, value: 500, unit: 'm', log: true, sig: 3 },
        { id: 'ro', label: 'Observation well at', min: 2, max: 400, value: 30, unit: 'm', log: true, sig: 3 }
      ], () => recompute());
      const ro = kit.readout(box.side, [['sw', 'Drawdown in the well'], ['so', 'Drawdown at the observation well'], ['sc', 'Specific capacity Q/s'], ['T', 'Transmissivity K·b'], ['tt', 'Travel time, observation well → well'], ['state', 'State']]);
      const V = ctl.values, rw = 0.15, ne = 0.25;
      let o = null;
      const parts = [];
      for (let k = 0; k < 150; k++) parts.push({ r: Math.random(), z: Math.random(), side: k % 2 ? 1 : -1 });
      function recompute() {
        const Qs = V.Q / 3600, K = V.K, b = V.b, R = Math.max(V.R, 2 * rw), conf = V.type === 'conf';
        const robs = Math.min(V.ro, R * 0.98);
        let dry = false;
        const H0 = conf ? b + 8 : b;                          // static head (potentiometric surface or water table), m above the base
        const head = r => {
          const rr = clamp(r, rw, R);
          if (conf) return H0 - Qs / (2 * Math.PI * K * b) * Math.log(R / rr);
          const h2 = b * b - Qs / (Math.PI * K) * Math.log(R / rr);
          return h2 > 0 ? Math.sqrt(h2) : 0;
        };
        const hw = head(rw);
        if (conf ? hw < 0 : hw < 0.1 * b) dry = true;
        const hwc = conf ? Math.max(hw, 0) : Math.max(hw, 0.1 * b);
        const sw = H0 - hwc, so = Math.min(H0, H0 - head(robs));
        const Qmax = conf ? 2 * Math.PI * K * b * H0 / Math.log(R / rw) : Math.PI * K * b * b * 0.99 / Math.log(R / rw);
        const bm = conf ? b : Math.max(0.1 * b, (head(robs) + hwc) / 2);
        const tt = Math.PI * bm * ne * (robs * robs - rw * rw) / Qs;
        o = { Qs, K, b, R, conf, robs, H0, head, hw: hwc, sw, so, dry, tt, Qmax, ground: conf ? b + 12 : b + 7 };
        ro.set('sw', f3(sw, 2) + ' m' + (dry ? ' (well dry)' : ''));
        ro.set('so', f3(so, 3) + ' m at ' + f3(robs, 0) + ' m');
        ro.set('sc', f3(V.Q / Math.max(sw, 1e-6), 1) + ' m³/h per m');
        ro.set('T', (K * b).toExponential(2) + ' m²/s');
        ro.set('tt', tt > 2 * 365.25 * 86400 ? f3(tt / (365.25 * 86400), 1) + ' years' : tt > 2 * 86400 ? f3(tt / 86400, 1) + ' days' : f3(tt / 3600, 1) + ' hours');
        ro.set('state', dry ? 'over-pumped: the aquifer cannot yield ' + f3(V.Q, 0) + ' m³/h (limit ≈ ' + f3(Qmax * 3600, 0) + ' m³/h)' : conf && hw < b ? 'head below the aquifer top near the well: it dewaters there' : 'steady cone');
        const pts = [];
        for (let k = 0; k <= 80; k++) { const r = rw * Math.pow(R / rw, k / 80); pts.push([r, Math.min(H0, H0 - Math.max(head(r), conf ? -1e9 : 0))]); }
        plot.set({ series: [{ pts }], marks: [{ x: robs, y: so, label: 'observation well' }, { x: rw, y: sw, label: 'well' }], x: { label: 'distance from the well r (m)', log: true, min: 0.1, max: R * 1.5 }, y: { label: 'drawdown (m)', min: 0 } });
      }
      recompute();
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const Rv = o.R * 1.12, cx = W / 2, hx = (W / 2 - 16) / Rv;
        const vtop = 26, vy = (H - vtop - 22) / o.ground;
        const Y = el => vtop + (o.ground - el) * vy, X = (r, sd) => cx + sd * r * hx;
        const sat = kit.hue(205, 0.3), sand = kit.hue(40, 0.22), clay = kit.hue(25, 0.45);
        // layers
        c.fillStyle = C.surface2; c.fillRect(0, Y(0), W, H - Y(0));
        c.fillStyle = sand; c.fillRect(0, Y(o.conf ? o.b : o.ground), W, Y(0) - Y(o.conf ? o.b : o.ground));
        if (o.conf) { c.fillStyle = clay; c.fillRect(0, Y(o.b + 6), W, Y(o.b) - Y(o.b + 6)); c.fillStyle = kit.hue(40, 0.1); c.fillRect(0, Y(o.ground), W, Y(o.b + 6) - Y(o.ground)); }
        // saturated zone
        c.fillStyle = sat;
        if (o.conf) c.fillRect(0, Y(o.b), W, Y(0) - Y(o.b));
        else {
          c.beginPath(); c.moveTo(0, Y(0));
          for (let i = 0; i <= 200; i++) { const x = i / 200 * W, r = Math.abs(x - cx) / hx; c.lineTo(x, Y(Math.max(o.hw, o.head(r)))); }
          c.lineTo(W, Y(0)); c.closePath(); c.fill();
        }
        // the head surface
        c.strokeStyle = kit.hue(205); c.lineWidth = 2; if (o.conf) c.setLineDash([8, 5]);
        c.beginPath();
        for (let i = 0; i <= 240; i++) { const x = i / 240 * W, r = Math.abs(x - cx) / hx, h = Math.max(o.conf ? -5 : o.hw, o.head(r)); if (i) c.lineTo(x, Y(h)); else c.moveTo(x, Y(h)); }
        c.stroke(); c.setLineDash([]);
        kit.label(c, o.conf ? 'potentiometric surface' : 'water table', 12, Y(o.H0) - 10, { color: kit.hue(205), size: 11, align: 'left', weight: 700 });
        kit.label(c, o.conf ? 'confined aquifer' : 'unconfined aquifer', W - 12, Y(o.b * 0.3), { color: C.text, size: 11, align: 'right' });
        if (o.conf) kit.label(c, 'clay (confining layer)', W - 12, Y(o.b + 3), { color: C.text, size: 11, align: 'right' });
        kit.label(c, 'impermeable base', W - 12, Y(0) + 11, { color: C.muted, size: 10, align: 'right' });
        // ground surface
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, Y(o.ground)); c.lineTo(W, Y(o.ground)); c.stroke();
        // radius of influence
        for (const sd of [-1, 1]) { c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(X(o.R, sd), Y(o.ground) + 2); c.lineTo(X(o.R, sd), Y(o.ground) + 10); c.stroke(); }
        kit.label(c, 'R', X(o.R, 1), Y(o.ground) + 18, { color: C.muted, size: 11 });
        // particles moving toward the well at the seepage velocity
        const vAt = r => { const bs = o.conf ? o.b : Math.max(0.1 * o.b, o.head(r)); return o.Qs / (2 * Math.PI * Math.max(r, rw) * bs * ne); };
        const ts = 0.1 * o.R / Math.max(vAt(0.5 * o.R), 1e-12);
        for (const p of parts) {
          let r = p.r * Rv;
          const dr = Math.min(0.25 * r + 0.5, vAt(r) * ts * dt);
          r -= dr;
          if (r < Math.max(3 * rw, 2 / hx)) { r = Math.min(o.R, Rv) * (0.85 + 0.15 * Math.random()); p.z = Math.random(); }
          p.r = r / Rv;
          const top = o.conf ? o.b : Math.max(o.hw, o.head(r));
          c.fillStyle = foam(C); c.fillRect(X(r, p.side) - 1.2, Y(p.z * top * 0.96 + 0.02 * top) - 1.2, 2.4, 2.4);
        }
        // the pumped well and the observation well
        c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(cx - 5, Y(o.ground) - 14); c.lineTo(cx - 5, Y(0)); c.moveTo(cx + 5, Y(o.ground) - 14); c.lineTo(cx + 5, Y(0)); c.stroke();
        c.fillStyle = kit.hue(205, 0.6); c.fillRect(cx - 4, Y(o.hw), 8, Y(0) - Y(o.hw));
        c.fillStyle = C.surface; c.fillRect(cx - 14, Y(o.ground) - 24, 28, 12); c.strokeRect(cx - 14, Y(o.ground) - 24, 28, 12);
        kit.arrow(c, cx + 14, Y(o.ground) - 18, cx + 50, Y(o.ground) - 18, kit.hue(205), 2);
        kit.label(c, 'Q = ' + f3(V.Q, 0) + ' m³/h', cx + 54, Y(o.ground) - 18, { color: C.text, size: 12, weight: 700, align: 'left' });
        const xo = X(o.robs, 1), ho = Math.max(0, o.head(o.robs));
        c.lineWidth = 1.2; c.beginPath(); c.moveTo(xo - 3, Y(o.ground) - 6); c.lineTo(xo - 3, Y(0)); c.moveTo(xo + 3, Y(o.ground) - 6); c.lineTo(xo + 3, Y(0)); c.stroke();
        c.fillStyle = kit.hue(205, 0.6); c.fillRect(xo - 2, Y(ho), 4, Y(0) - Y(ho));
        kit.label(c, 's = ' + f3(o.so, 2) + ' m', xo + 8, Y(ho) - 8, { color: C.accent, size: 11, align: 'left', weight: 700 });
        kit.label(c, 'drawdown in the well ' + f3(o.sw, 2) + ' m', cx - 12, Y(o.hw) + 4, { color: C.accent, size: 11, align: 'right', weight: 700, bg: C.surface });
        kit.label(c, 'dots sped up: 1 s shows ' + (ts > 86400 * 2 ? f3(ts / 86400, 0) + ' days' : f3(ts / 3600, 1) + ' hours') + ';  depths exaggerated', 12, H - 8, { color: C.muted, size: 10, align: 'left' });
        if (o.dry) kit.label(c, 'THE WELL RUNS DRY', cx, vtop - 12, { color: C.bad, size: 13, weight: 800 });
      }, box.stage);
      loop.start();
    }
  });
})();
