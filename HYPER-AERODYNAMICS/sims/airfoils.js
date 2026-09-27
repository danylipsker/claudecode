/* HYPER-AERODYNAMICS · sims/airfoils.js — simulations for the Airfoils branch.
 *   foil-naca-builder    the NACA four-digit recipe: mean line, thickness, the four digits decoded (drag the handles)
 *   foil-lift-mechanism  where lift comes from: the pressure field, smoke lines racing past, upwash and downwash,
 *                        circulation, and the lift counted as momentum or as pressure on a control surface
 *   foil-cp-compare      two airfoils' pressure distributions side by side, at the same angle or the same lift
 *   foil-kutta           a Joukowski airfoil with any circulation: the rear stagnation point moves until it
 *                        sits on the trailing edge (the Kutta condition), and a start from rest sheds a vortex
 *   foil-lift-curve      the lift curve with a separation model: three kinds of stall, hysteresis, Reynolds number
 *   foil-cp-travel       the centre of pressure moving with angle of attack against the fixed aerodynamic centre
 *   foil-high-lift       plain, split, slotted and Fowler flaps and a slat: the lift curve shifts and C_l,max grows
 *   foil-thin-theory     thin-airfoil theory: the vortex sheet on the mean line and its load, against the panel method
 * All inviscid numbers come from kit.fluid (naca4, panel, thinAirfoil); the stall models are labelled as models.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TWO_PI = 2 * Math.PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fin = (v, d) => (Number.isFinite(v) ? v : (d || 0));

  /* ---------------------------------------------------------------- shared helpers */
  // NACA four-digit designation from camber (%), its position (% chord) and thickness (%)
  const nacaCode = (m, p, t) => String(Math.round(m)) + (Math.round(m) ? String(Math.round(p / 10)) : '0') + String(Math.round(t)).padStart(2, '0');
  const parseCode = code => ({ m: +code[0], p: +code[1] * 10, t: +code.slice(2) });

  // A panel-method solution at every angle of attack from two solutions (α = 0 and 90°): the panel
  // equations are linear in (cos α, sin α), so velocities, c_l and the pressure distribution follow
  // exactly by superposition. base(x, y) gives both base velocities at a point (fast, no allocation).
  function foilSolver(F, pts) {
    const N = pts.length - 1;
    const s0 = F.panel(pts, 0), s90 = F.panel(pts, Math.PI / 2);
    const X = pts.map(p => p[0]), Y = pts.map(p => p[1]);
    const len = [], cx = [], cy = [], cs = [], sn = [];
    for (let j = 0; j < N; j++) {
      const dx = X[j + 1] - X[j], dy = Y[j + 1] - Y[j], L = Math.hypot(dx, dy) || 1e-12;
      len.push(L); cx.push((X[j] + X[j + 1]) / 2); cy.push((Y[j] + Y[j + 1]) / 2); cs.push(dx / L); sn.push(dy / L);
    }
    const chord = (Math.max(...X) - Math.min(...X)) || 1;
    const vt0 = s0.cp.map(c => c.vt), vt9 = s90.cp.map(c => c.vt);
    const q0 = s0.sources, q9 = s90.sources, g0 = s0.gamma, g9 = s90.gamma;
    function at(alpha) {
      const ca = Math.cos(alpha), sa = Math.sin(alpha), cp = [];
      let m = 0;
      for (let i = 0; i < N; i++) {
        const vt = ca * vt0[i] + sa * vt9[i], c = 1 - vt * vt;
        cp.push({ x: cx[i], y: cy[i], cp: c, vt, upper: i >= N / 2 });
        const fx = c * sn[i] * len[i], fy = -c * cs[i] * len[i];     // −Cp · outward normal · length
        m += (cx[i] - 0.25) * fy - cy[i] * fx;
      }
      return { cl: ca * s0.cl + sa * s90.cl, cm: -m / (chord * chord), cp };
    }
    const k = 1 / TWO_PI;
    function base(px, py, out) {
      let u0 = 1, v0 = 0, u9 = 0, v9 = 1;
      for (let j = 0; j < N; j++) {
        const x1 = X[j] - px, y1 = Y[j] - py, x2 = X[j + 1] - px, y2 = Y[j + 1] - py;
        const r1 = x1 * x1 + y1 * y1, r2 = x2 * x2 + y2 * y2;
        if (r1 < 1e-14 || r2 < 1e-14) continue;
        const L = 0.5 * Math.log(r2 / r1), B = Math.atan2(x1 * y2 - y1 * x2, x1 * x2 + y1 * y2);
        const lu0 = (-L * q0[j] + B * g0) * k, lv0 = (B * q0[j] + L * g0) * k;
        const lu9 = (-L * q9[j] + B * g9) * k, lv9 = (B * q9[j] + L * g9) * k;
        const c = cs[j], s = sn[j];
        u0 += lu0 * c - lv0 * s; v0 += lu0 * s + lv0 * c;
        u9 += lu9 * c - lv9 * s; v9 += lu9 * s + lv9 * c;
      }
      out[0] = u0; out[1] = v0; out[2] = u9; out[3] = v9;
      return out;
    }
    function inside(x, y) {
      if (x < -0.02 || x > 1.02 || Math.abs(y) > 0.4) return false;
      let inn = false;
      for (let i = 0, j = N; i <= N; j = i++) {
        const xi = X[i], yi = Y[i], xj = X[j], yj = Y[j];
        if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-12) + xi) inn = !inn;
      }
      return inn;
    }
    // c_l as a function of α is R·sin(α + φ): the α that gives a wanted c_l, in closed form
    const Rl = Math.hypot(s0.cl, s90.cl), phi = Math.atan2(s0.cl, s90.cl);
    const alphaFor = cl => Math.asin(clamp(cl / (Rl || 1), -1, 1)) - phi;
    return { at, base, inside, alphaFor, N, X, Y, chord, pts };
  }
  const cache = new Map();
  function solverFor(F, m, p, t, n) {
    const key = [m, p, t, n].join('|');
    if (!cache.has(key)) { if (cache.size > 40) cache.clear(); cache.set(key, foilSolver(F, F.naca4(m, p, t, n))); }
    return cache.get(key);
  }
  // minimum pressure (suction peak) of a distribution
  const peakOf = cp => cp.reduce((a, c) => (c.cp < a.cp ? c : a), cp[0]);
  // outline of an airfoil through a mapping P(x, y) -> [px, py]
  function outline(c, pts, P) {
    c.beginPath();
    pts.forEach((q, i) => { const [x, y] = P(q[0], q[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); });
    c.closePath();
  }
  // HSL (degrees, %, %) -> [r, g, b] for image data
  function hslRgb(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
  }
  // a curved arrow (a couple) of radius r at (x, y): positive = nose-up (drawn anticlockwise on screen with the nose to the left)
  function couple(c, x, y, r, sense, color, width) {
    const a0 = sense > 0 ? 0.35 : Math.PI - 0.35, a1 = sense > 0 ? Math.PI * 1.35 : -Math.PI * 0.35;
    c.save(); c.strokeStyle = c.fillStyle = color; c.lineWidth = width || 2;
    c.beginPath(); c.arc(x, y, r, -a0, -a1, sense > 0); c.stroke();
    const ex = x + r * Math.cos(-a1), ey = y + r * Math.sin(-a1), tang = -a1 + (sense > 0 ? -Math.PI / 2 : Math.PI / 2);
    c.beginPath(); c.moveTo(ex + 7 * Math.cos(tang), ey + 7 * Math.sin(tang));
    c.lineTo(ex + 5 * Math.cos(tang + 2.2), ey + 5 * Math.sin(tang + 2.2)); c.lineTo(ex + 5 * Math.cos(tang - 2.2), ey + 5 * Math.sin(tang - 2.2)); c.closePath(); c.fill();
    c.restore();
  }
  const graphBox = box => { const g = document.createElement('div'); g.style.padding = '4px 10px 10px'; box.stage.appendChild(g); return g; };
  const FOILS = [['NACA 0006 (thin, symmetric)', '0006'], ['NACA 0012 (tails, rotor blades)', '0012'], ['NACA 0018 (thick, symmetric)', '0018'],
    ['NACA 2412 (light aircraft)', '2412'], ['NACA 2415', '2415'], ['NACA 4412 (more camber)', '4412'], ['NACA 4415', '4415'], ['NACA 6409 (strong camber, thin)', '6409'], ['NACA 0024 (very thick)', '0024']];

  /* ================================================================ 1. the NACA four-digit builder */
  Hyper.sim('foil-naca-builder', {
    title: 'NACA four-digit builder',
    blurb: `Build any NACA four-digit airfoil from its recipe: a **mean camber line** (two parabolas meeting at the point of greatest camber) with a **thickness distribution** wrapped round it, perpendicular to the line. The circles show the thickness at a few stations; the airfoil is their envelope. Drag the orange dot (camber and its position) or the blue dot (thickness) on the drawing, or use the sliders.

**Try this**
- Start from 0012: camber 0 makes the mean line straight and the section symmetric. Add 2 % camber at 40 %: that is the 2412 of many light aircraft.
- Move the camber point forward to 20 % and back to 60 %: the thin-airfoil zero-lift angle and pitching moment change (readouts) — rear camber makes a stronger nose-down moment.
- Thicken to 24 %: the nose radius grows with the *square* of the thickness, so thick sections have blunt noses (gentler stalls) and thin ones sharp noses.
- Compare the lengths of the upper and lower surfaces: a percent or two apart, while the air over the top runs 20–50 % faster. Path length is not why wings lift.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 250 });
      const plot = kit.plot(graphBox(box), { x: { label: 'x / c  (% of chord)', min: 0, max: 100 }, y: { label: '% of chord' }, legend: true }, 150);
      const start = parseCode((params && params.code) || '2412');
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Start from', options: [['NACA 2412', '2412'], ['NACA 0012', '0012'], ['NACA 4412', '4412'], ['NACA 0006', '0006'], ['NACA 6409', '6409'], ['NACA 4421', '4421'], ['NACA 2424', '2424'], ['Your own', 'own']], value: (params && params.code) || '2412' },
        { id: 'm', label: 'Maximum camber — 1st digit', min: 0, max: 9, step: 1, value: start.m, unit: '% c' },
        { id: 'p', label: 'Position of max camber — 2nd digit', min: 10, max: 90, step: 10, value: start.p || 40, unit: '% c' },
        { id: 't', label: 'Thickness — last two digits', min: 1, max: 40, step: 1, value: start.t, unit: '% c' },
        { id: 'c', label: 'Chord (for real sizes)', min: 0.1, max: 10, value: 1.5, unit: 'm', log: true, sig: 2 },
        { id: 'build', type: 'check', label: 'Show the construction circles', value: true }
      ], (id, v) => {
        if (id === 'preset' && v !== 'own') { const s = parseCode(v); ctl.set('m', s.m); ctl.set('p', s.p || 40); ctl.set('t', s.t); }
        else if (id === 'm' || id === 'p' || id === 't') ctl.set('preset', 'own');
        update();
      });
      const ro = kit.readout(box.side, [['name', 'Designation'], ['dec', 'The digits say'], ['tmax', 'Greatest thickness'], ['r', 'Nose radius 1.1019 t²·c'], ['te', 'Trailing-edge angle'],
        ['area', 'Section area ≈ 0.685 t·c²'], ['len', 'Upper vs lower surface length'], ['thin', 'Thin-airfoil theory']]);
      const V = ctl.values;
      let pts = [], up = [], lo = [], m = 0, p = 0.4, t = 0.12;
      const camber = x => F.nacaCamber(m, p, x);
      const yt = x => 5 * t * (0.2969 * Math.sqrt(Math.max(0, x)) - 0.126 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1036 * x * x * x * x);
      let geo = null;
      function update() {
        m = V.m / 100; p = V.p / 100; t = V.t / 100;
        pts = F.naca4(m, p, t, 60);
        const n = (pts.length - 1) / 2;
        lo = pts.slice(0, n + 1).reverse(); up = pts.slice(n);          // both from the leading edge to the trailing edge
        let Lu = 0, Ll = 0, A = 0;
        for (let i = 1; i < up.length; i++) Lu += Math.hypot(up[i][0] - up[i - 1][0], up[i][1] - up[i - 1][1]);
        for (let i = 1; i < lo.length; i++) Ll += Math.hypot(lo[i][0] - lo[i - 1][0], lo[i][1] - lo[i - 1][1]);
        for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) A += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
        const c = V.c, code = nacaCode(V.m, V.p, V.t);
        const r = 1.1019 * t * t;
        const k = up.length - 1, su = Math.atan2(up[k - 1][1] - up[k][1], up[k][0] - up[k - 1][0]), sl = Math.atan2(lo[k][1] - lo[k - 1][1], lo[k][0] - lo[k - 1][0]);
        const ta = F.thinAirfoil(m, p);
        geo = { code, r, Lu, Ll, A: Math.abs(A) / 2, ymax: Math.max(...pts.map(q => q[1])), ymin: Math.min(...pts.map(q => q[1])) };
        const mm = v => (v * 1000 >= 100 ? (v * 1000).toFixed(0) : (v * 1000).toFixed(1)) + ' mm';
        ro.set('name', 'NACA ' + code);
        ro.set('dec', V.m ? V.m + ' % camber at ' + V.p + ' % of the chord, ' + V.t + ' % thick' : 'symmetric (no camber), ' + V.t + ' % thick');
        ro.set('tmax', V.t + ' % c = ' + mm(t * c) + ', at 30 % of the chord');
        ro.set('r', (r * 100).toFixed(2) + ' % c = ' + mm(r * c));
        ro.set('te', ((su + sl) * R2D).toFixed(1) + '°');
        ro.set('area', (geo.A * c * c).toPrecision(3) + ' m² (' + (geo.A / t).toFixed(3) + ' t·c²)');
        ro.set('len', 'upper ' + ((Lu / Ll - 1) * 100).toFixed(1) + ' % longer');
        ro.set('thin', 'α₀ = ' + (ta.alpha0 * R2D).toFixed(2) + '°,  c_m,c/4 = ' + ta.cmc4.toFixed(3));
        const cam = [], th = [];
        for (let i = 0; i <= 100; i++) { const x = 0.5 * (1 - Math.cos(Math.PI * i / 100)); cam.push([x * 100, camber(x)[0] * 100]); th.push([x * 100, yt(x) * 100]); }
        plot.set({ series: [{ pts: cam, label: 'mean camber line y_c', color: kit.colors().series[1] }, { pts: th, label: 'half-thickness y_t', color: kit.colors().series[0] }],
          marks: V.m ? [{ x: V.p, y: V.m, label: 'm at p' }] : [], vlines: [{ x: 30, label: 't_max' }] });
      }
      // geometry of the drawing
      // a fixed scale (so sections can be compared), centred on the section's own height
      const lay = () => {
        const range = geo ? geo.ymax - geo.ymin : 0.15, mid = geo ? (geo.ymax + geo.ymin) / 2 : 0;
        const s = Math.min(st.W * 0.8, (st.H - 90) / Math.max(0.25, range + 0.06)), x0 = (st.W - s) / 2;
        return { s, x0, y0: (66 + st.H - 24) / 2 + mid * s };
      };
      const P = (x, y) => { const L = lay(); return [L.x0 + x * L.s, L.y0 - y * L.s]; };
      const handleCam = () => P(p, m), handleThk = () => P(0.3, camber(0.3)[0] + yt(0.3));
      kit.drag(st, {
        hit(q) {
          const a = handleCam(), b = handleThk();
          if (Math.hypot(q.x - a[0], q.y - a[1]) < 14) return 'cam';
          if (Math.hypot(q.x - b[0], q.y - b[1]) < 14) return 'thk';
          return null;
        },
        move(what, q) {
          const L = lay(), x = (q.x - L.x0) / L.s, y = (L.y0 - q.y) / L.s;
          if (what === 'cam') { ctl.set('p', clamp(Math.round(x * 10), 1, 9) * 10); ctl.set('m', clamp(Math.round(y * 100), 0, 9)); }
          else ctl.set('t', clamp(Math.round((y - camber(0.3)[0]) * 200), 1, 40));
          ctl.set('preset', 'own');
          update();
        },
        hover: true
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), L = lay();
        if (!geo) return;
        // the designation, digit by digit
        const code = geo.code, cols = [C.series[1], C.series[2], C.series[0], C.series[0]];
        const cx0 = st.W / 2 - 10, dx = [cx0 - 24, cx0 - 8, cx0 + 8, cx0 + 24];
        kit.label(c, 'NACA', cx0 - 40, 24, { align: 'right', size: 22, weight: 700, color: C.text });
        for (let i = 0; i < 4; i++) kit.label(c, code[i], dx[i], 24, { align: 'center', size: 24, weight: 800, color: cols[i] });
        kit.label(c, 'max camber ' + V.m + ' % of c', dx[0] + 4, 46, { align: 'right', size: 11, color: C.series[1] });
        kit.label(c, V.m ? 'at ' + V.p + ' % of c' : 'none', dx[1], 60, { align: 'center', size: 11, color: C.series[2] });
        kit.label(c, 'thickness ' + V.t + ' % of c', dx[2] - 4, 46, { align: 'left', size: 11, color: C.series[0] });
        // construction circles along the mean line
        if (V.build) {
          c.save(); c.globalAlpha = 0.4; c.strokeStyle = C.series[0]; c.lineWidth = 1;
          for (const x of [0.02, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.96]) {
            const [px, py] = P(x, camber(x)[0]);
            c.beginPath(); c.arc(px, py, Math.max(0.5, yt(x) * L.s), 0, TWO_PI); c.stroke();
          }
          c.restore();
        }
        // the airfoil
        outline(c, pts, P);
        c.save(); c.globalAlpha = 0.06; c.fillStyle = C.text; c.fill(); c.restore();
        c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        // chord line and scale
        const [lx, ly] = P(0, 0), [tx] = P(1, 0);
        c.save(); c.setLineDash([6, 5]); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(lx, ly); c.lineTo(tx, ly); c.stroke(); c.restore();
        for (let i = 0; i <= 10; i++) { const [x] = P(i / 10, 0); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(x, ly + 3); c.lineTo(x, ly + 8); c.stroke(); }
        // mean camber line
        c.strokeStyle = C.series[1]; c.lineWidth = 2.2; c.beginPath();
        for (let i = 0; i <= 80; i++) { const x = i / 80, [px, py] = P(x, camber(x)[0]); i ? c.lineTo(px, py) : c.moveTo(px, py); }
        c.stroke();
        // nose radius: a circle through the leading edge, centred along the mean line's initial slope
        const sl = Math.atan(camber(0.001)[1]), [nx, ny] = P(geo.r * Math.cos(sl), geo.r * Math.sin(sl));
        c.save(); c.setLineDash([3, 3]); c.strokeStyle = C.warn; c.lineWidth = 1.2; c.beginPath(); c.arc(nx, ny, Math.max(1, geo.r * L.s), 0, TWO_PI); c.stroke(); c.restore();
        // thickness at 30 %
        const yc3 = camber(0.3)[0], [ax, ay] = P(0.3, yc3 + yt(0.3)), [, by] = P(0.3, yc3 - yt(0.3));
        kit.arrow(c, ax, (ay + by) / 2, ax, ay + 1, C.series[0], 1.5); kit.arrow(c, ax, (ay + by) / 2, ax, by - 1, C.series[0], 1.5);
        kit.label(c, 't = ' + V.t + ' %', ax + 6, (ay + by) / 2, { color: C.series[0], size: 11.5, weight: 700, bg: C.bg2 });
        // max camber point with its dimensions
        const [hx, hy] = handleCam(), [, h0] = P(p, 0);
        if (V.m) { c.save(); c.setLineDash([2, 3]); c.strokeStyle = C.series[1]; c.beginPath(); c.moveTo(hx, h0); c.lineTo(hx, hy); c.stroke(); c.restore(); }
        kit.dot(c, hx, hy, 6.5, C.series[1], C.bg2);
        kit.label(c, V.m ? 'm = ' + V.m + ' % at p = ' + V.p + ' %' : 'no camber: drag up', hx + 9, hy - 12, { color: C.series[1], size: 11.5, weight: 700, align: 'left' });
        kit.dot(c, ax, ay, 6.5, C.series[0], C.bg2);
        kit.label(c, 'leading edge', lx - 4, ly + 18, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'trailing edge', tx + 4, ly + 18, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'chord c = ' + kit.fmt(V.c, 2) + ' m', (lx + tx) / 2, ly + 22, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'nose radius', nx - geo.r * L.s - 4, ny - geo.r * L.s - 8, { color: C.warn, size: 10.5, align: 'left' });
      }, box.stage);
      update();
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ 2. where lift comes from */
  Hyper.sim('foil-lift-mechanism', {
    title: 'Where lift comes from',
    blurb: `A NACA airfoil in a stream, solved by the panel method. The colours are the **pressure field** — red where the pressure is below the free stream (suction, $C_p < 0$), blue where it is above — and the white **smoke lines** are released together upstream, so you can watch the air over the top outrun the air underneath. Two tagged parcels start side by side on either side of the dividing streamline.

**Try this**
- Watch a smoke line split at the nose: the top part reaches the trailing edge first and is never rejoined by its partner — no "equal transit time". The read-out gives the lead.
- Look at the flow direction ahead of and behind the airfoil: it rises to meet the wing (upwash) and leaves it tilted down (downwash). That turning is the lift, seen from the air's side.
- Choose a **control surface**. The lift is the same, but how it shows up on the surface depends on its shape: a tall box sees almost all of it as downward momentum carried out through its sides (Newton), a long flat box almost all as pressure on its lids (Bernoulli), a circle exactly half of each.
- Set α so that c_l = 0 (about −2° for 2 % camber): the smoke lines arrive together, the field is nearly symmetric, and the circulation vanishes.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'alpha', label: 'Angle of attack α', min: -4, max: 12, step: 0.5, value: (params && params.alpha) != null ? params.alpha : 4, unit: '°' },
        { id: 'm', label: 'Camber (at 40 % chord)', min: 0, max: 6, step: 0.5, value: 2, unit: '%' },
        { id: 't', label: 'Thickness', min: 6, max: 18, step: 1, value: 12, unit: '%' },
        { id: 'show', type: 'select', label: 'Show', options: [['Pressure field and smoke', 'both'], ['Pressure field only', 'field'], ['Smoke lines only', 'smoke']], value: (params && params.show) || 'both' },
        { id: 'cv', type: 'select', label: 'Control surface', options: [['None', 'none'], ['Circle round the airfoil', 'circle'], ['Tall box (lids far above and below)', 'tall'], ['Long flat box (ends far ahead and behind)', 'flat']], value: (params && params.cv) || 'none' },
        { type: 'buttons', items: [{ id: 'smoke', label: 'Release a smoke line', primary: true }] }
      ], (id) => { if (id === 'smoke') release(); else if (id === 'm' || id === 't') shape(); else if (id === 'alpha') flow(); else if (id === 'cv') { measure(); loop.once(); } else loop.once(); });
      const ro = kit.readout(box.side, [['cl', 'Lift coefficient c_l'], ['gam', 'Circulation Γ = ½ c_l V∞ c'], ['vv', 'Speed at 30 % chord, top / bottom'], ['tt', 'Top parcel reaches the trailing edge first by'],
        ['behind', 'The bottom parcel is then behind by'], ['turn', 'Flow angle ½ c ahead / ½ c behind'], ['split', 'Lift counted as momentum / as pressure']]);
      const V = ctl.values;
      const GX = 138, GY = 80, gx0 = -1.1, gx1 = 2.35, gy0 = -1.0, gy1 = 1.0;
      let S = null, grid = null, mask = null, a = 0, sol = null, img = null, imgCtx = null, imgData = null, tr = null, split = null;
      const parts = [];            // smoke particles: { X, Y, line, tag, alive }
      let lineNo = 0, since = 0, arrived = null;
      const off = document.createElement('canvas'); off.width = GX; off.height = GY;
      imgCtx = off.getContext('2d');
      const o4 = [0, 0, 0, 0];
      const toFoil = (X, Y) => { const c = Math.cos(a), s = Math.sin(a), dx = X - 0.25; return [0.25 + dx * c - Y * s, dx * s + Y * c]; };
      const toDisp = (x, y) => { const c = Math.cos(a), s = Math.sin(a), dx = x - 0.25; return [0.25 + dx * c + y * s, -dx * s + y * c]; };
      // velocity in the display frame (stream = 1 along +X); exact near the body, interpolated elsewhere
      function velExact(X, Y) {
        const [x, y] = toFoil(X, Y);
        if (S.inside(x, y)) return null;
        S.base(x, y, o4);
        const ca = Math.cos(a), sa = Math.sin(a), u = ca * o4[0] + sa * o4[2], v = ca * o4[1] + sa * o4[3];
        return [u * ca + v * sa, -u * sa + v * ca];
      }
      function vel(X, Y) {
        const [x, y] = toFoil(X, Y);
        const fi = (x - gx0) / (gx1 - gx0) * (GX - 1), fj = (y - gy0) / (gy1 - gy0) * (GY - 1);
        if (fi < 0 || fj < 0 || fi >= GX - 1 || fj >= GY - 1) return [1, 0];
        const i = Math.floor(fi), j = Math.floor(fj), wu = fi - i, wv = fj - j;
        const k00 = j * GX + i, ks = [k00, k00 + 1, k00 + GX, k00 + GX + 1];
        if (mask[ks[0]] || mask[ks[1]] || mask[ks[2]] || mask[ks[3]]) return velExact(X, Y);
        const w = [(1 - wu) * (1 - wv), wu * (1 - wv), (1 - wu) * wv, wu * wv];
        let U0 = 0, V0 = 0, U9 = 0, V9 = 0;
        for (let q = 0; q < 4; q++) { const b = 4 * ks[q]; U0 += w[q] * grid[b]; V0 += w[q] * grid[b + 1]; U9 += w[q] * grid[b + 2]; V9 += w[q] * grid[b + 3]; }
        const ca = Math.cos(a), sa = Math.sin(a), u = ca * U0 + sa * U9, v = ca * V0 + sa * V9;
        return [u * ca + v * sa, -u * sa + v * ca];
      }
      function shape() {
        S = solverFor(F, V.m / 100, 0.4, V.t / 100, 40);
        grid = new Float32Array(GX * GY * 4); mask = new Uint8Array(GX * GY);
        for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
          const x = gx0 + (gx1 - gx0) * i / (GX - 1), y = gy0 + (gy1 - gy0) * j / (GY - 1), k = j * GX + i;
          if (S.inside(x, y)) { mask[k] = 1; continue; }
          S.base(x, y, o4); grid[4 * k] = o4[0]; grid[4 * k + 1] = o4[1]; grid[4 * k + 2] = o4[2]; grid[4 * k + 3] = o4[3];
        }
        // cells next to the body also use the exact velocity
        const m2 = mask.slice();
        for (let j = 1; j < GY - 1; j++) for (let i = 1; i < GX - 1; i++) { const k = j * GX + i; if (m2[k - 1] || m2[k + 1] || m2[k - GX] || m2[k + GX]) mask[k] = mask[k] || 2; }
        flow();
      }
      // time for a parcel from the dividing streamline to the trailing edge, top and bottom (exact velocities)
      function transit() {
        const r = sol, N = S.N;
        let si = -1;
        for (let i = 1; i < N; i++) if (r.cp[i - 1].vt * r.cp[i].vt <= 0) { si = i; break; }
        if (si < 1) return null;
        const px = S.X[si], py = S.Y[si], tx = S.X[si + 1] - S.X[si - 1], ty = S.Y[si + 1] - S.Y[si - 1], tl = Math.hypot(tx, ty) || 1;
        let x = px - ty / tl * 0.003, y = py + tx / tl * 0.003;
        if (S.inside(x, y)) { x = px + ty / tl * 0.003; y = py - tx / tl * 0.003; }
        let [X, Y] = toDisp(x, y);
        const h = 0.006;
        for (let n = 0; n < 3000 && X > -0.95; n++) {                   // back upstream along the dividing streamline
          const w1 = velExact(X, Y); if (!w1) return null;
          const w2 = velExact(X - h / 2 * w1[0], Y - h / 2 * w1[1]); if (!w2) return null;
          X -= h * w2[0]; Y -= h * w2[1];
        }
        const TE = toDisp(1, 0), d = 0.012;
        const run = (Y0) => {
          let X1 = X, Y1 = Y0, t = 0; const path = [[X1, Y1, 0]];
          for (let n = 0; n < 4000; n++) {
            const w1 = velExact(X1, Y1); if (!w1) return null;
            const w2 = velExact(X1 + h / 2 * w1[0], Y1 + h / 2 * w1[1]); if (!w2) return null;
            X1 += h * w2[0]; Y1 += h * w2[1]; t += h; path.push([X1, Y1, t]);
            if (X1 >= TE[0]) return { t, path };
          }
          return null;
        };
        const up = run(Y + d), lo = run(Y - d);
        if (!up || !lo) return null;
        const at = lo.path.find(q => q[2] >= up.t) || lo.path[lo.path.length - 1];
        return { X, Y, d, dt: lo.t - up.t, behind: TE[0] - at[0] };
      }
      // lift on a control surface: − ∮ p n_Y ds (pressure) and − ∮ v_Y (v·n) ds (momentum), ρ = V∞ = 1
      function controlSurface(kind) {
        let mom = 0, pres = 0;
        const add = (X, Y, nX, nY, ds) => {
          const [x, y] = toFoil(X, Y); S.base(x, y, o4);
          const ca = Math.cos(a), sa = Math.sin(a), u0 = ca * o4[0] + sa * o4[2], v0 = ca * o4[1] + sa * o4[3];
          const u = u0 * ca + v0 * sa, v = -u0 * sa + v0 * ca, p = 0.5 * (1 - u * u - v * v);
          mom += -v * (u * nX + v * nY) * ds; pres += -p * nY * ds;
        };
        const cx = 0.45;
        if (kind === 'circle') {
          const R = 0.75, n = 720;
          for (let k = 0; k < n; k++) { const th = TWO_PI * (k + 0.5) / n; add(cx + R * Math.cos(th), R * Math.sin(th), Math.cos(th), Math.sin(th), TWO_PI * R / n); }
        } else {
          const far = 60, n = 900;
          // a line from −far to far with points crowded near the airfoil (x = tan θ)
          const line = (fn) => { const t1 = Math.atan(far); for (let k = 0; k < n; k++) { const th = -t1 + 2 * t1 * (k + 0.5) / n, s = Math.tan(th), ds = (2 * t1 / n) / (Math.cos(th) ** 2); fn(s, ds); } };
          const seg = (x0, y0, x1, y1, nX, nY, m) => { for (let k = 0; k < m; k++) { const f = (k + 0.5) / m; add(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, nX, nY, Math.hypot(x1 - x0, y1 - y0) / m); } };
          if (kind === 'tall') {
            const xa = -0.7, xb = 1.6;
            line((s, ds) => { add(xa, s, -1, 0, ds); add(xb, s, 1, 0, ds); });
            seg(xa, far, xb, far, 0, 1, 60); seg(xa, -far, xb, -far, 0, -1, 60);
          } else {
            const ya = -0.5, yb = 0.5;
            line((s, ds) => { add(cx + s, yb, 0, 1, ds); add(cx + s, ya, 0, -1, ds); });
            seg(cx - far, ya, cx - far, yb, -1, 0, 40); seg(cx + far, ya, cx + far, yb, 1, 0, 40);
          }
        }
        return { mom, pres };
      }
      function flow() {
        a = V.alpha * D2R;
        sol = S.at(a);
        paint();
        tr = transit();
        readouts();
      }
      // the pressure field image (repainted when the angle or the theme changes)
      let paintedDark = null;
      function paint() {
        imgData = imgData || imgCtx.createImageData(GX, GY);
        const C = kit.colors(), red = hslRgb(8, 85, C.dark ? 58 : 52), blue = hslRgb(215, 85, C.dark ? 62 : 50), ca = Math.cos(a), sa = Math.sin(a), d = imgData.data;
        paintedDark = C.dark;
        for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
          const k = j * GX + i, row = GY - 1 - j, px = 4 * (row * GX + i);
          if (mask[k] === 1) { d[px + 3] = 0; continue; }
          const u = ca * grid[4 * k] + sa * grid[4 * k + 2], v = ca * grid[4 * k + 1] + sa * grid[4 * k + 3], cp = 1 - u * u - v * v;
          const col = cp < 0 ? red : blue, f = cp < 0 ? Math.min(1, -cp / 1.3) : Math.min(1, cp / 0.7);
          d[px] = col[0]; d[px + 1] = col[1]; d[px + 2] = col[2]; d[px + 3] = Math.round(255 * 0.85 * Math.pow(Math.max(0, f - 0.01), 0.75));
        }
        if (imgCtx.putImageData) imgCtx.putImageData(imgData, 0, 0);
        img = off;
      }
      function readouts() {
        const up = sol.cp.filter(c => c.upper), lo = sol.cp.filter(c => !c.upper);
        const near = (arr, x) => arr.reduce((q, c) => (Math.abs(c.x - x) < Math.abs(q.x - x) ? c : q), arr[0]);
        const vu = Math.abs(near(up, 0.3).vt), vl = Math.abs(near(lo, 0.3).vt);
        ro.set('cl', sol.cl.toFixed(3));
        ro.set('gam', (sol.cl / 2).toFixed(3) + ' × V∞c');
        ro.set('vv', vu.toFixed(2) + ' V∞ / ' + vl.toFixed(2) + ' V∞');
        const together = !tr || Math.abs(tr.dt) < 0.01;
        ro.set('tt', tr ? (together ? 'they arrive together (no lift)' : tr.dt.toFixed(2) + ' c/V∞' + (tr.dt < 0 ? ' (bottom first: negative lift)' : '')) : '—');
        ro.set('behind', tr && !together ? (Math.abs(tr.behind) * 100).toFixed(0) + ' % of the chord' : '—');
        const ang = X => { const w = velExact(X, 0); return w ? Math.atan2(w[1], w[0]) * R2D : 0; };
        const sg = v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + '°';
        ro.set('turn', sg(ang(-0.5)) + ' / ' + sg(ang(1.5)));
        measure();
        release();
        loop.once();
      }
      function measure() {
        split = V.cv !== 'none' ? controlSurface(V.cv) : null;
        const L = sol.cl / 2;
        ro.set('split', V.cv === 'none' ? 'choose a control surface' : split && Math.abs(L) > 0.02 ? (100 * split.mom / L).toFixed(0) + ' % / ' + (100 * split.pres / L).toFixed(0) + ' %  (together ' + ((split.mom + split.pres) / L * 100).toFixed(0) + ' % of ρV∞Γ)' : 'no lift to count');
      }
      function release() {
        lineNo++;
        for (let k = 0; k <= 54; k++) parts.push({ X: -0.95, Y: -0.6 + 1.2 * k / 54, line: lineNo, tag: 0, t: 0 });
        if (tr) { parts.push({ X: tr.X, Y: tr.Y + tr.d, line: lineNo, tag: 1, t: 0 }); parts.push({ X: tr.X, Y: tr.Y - tr.d, line: lineNo, tag: -1, t: 0 }); }
        since = 0; arrived = null;
        while (parts.length > 400) parts.shift();
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S || !sol) return;
        if (C.dark !== paintedDark) paint();
        const s = st.W / 3.0, ox = s * 0.9, oy = st.H / 2;
        const P = (X, Y) => [ox + X * s, oy - Y * s];
        // advance the smoke
        const h = dt * 0.5;
        since += dt;
        if (since > 6.5 && V.show !== 'field') release();
        if (V.show !== 'field') for (const q of parts) {
          if (q.dead) continue;
          const w1 = q.tag ? velExact(q.X, q.Y) : vel(q.X, q.Y);
          if (!w1) { q.dead = true; continue; }
          const w2 = q.tag ? velExact(q.X + h / 2 * w1[0], q.Y + h / 2 * w1[1]) : vel(q.X + h / 2 * w1[0], q.Y + h / 2 * w1[1]);
          if (!w2) { q.dead = true; continue; }
          q.X += h * w2[0]; q.Y += h * w2[1]; q.t += h;
          if (q.X > 2.3) q.dead = true;
          if (q.tag === 1 && !q.done && q.X >= toDisp(1, 0)[0]) { q.done = true; arrived = { line: q.line }; }
        }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].dead) parts.splice(i, 1);
        // the pressure field, drawn in the airfoil's frame
        const [px0, py0] = P(0.25, 0);
        if (V.show !== 'smoke' && img) {
          c.save(); c.translate(px0, py0); c.rotate(a); c.imageSmoothingEnabled = true;
          c.drawImage(img, (gx0 - 0.25) * s, -gy1 * s, (gx1 - gx0) * s, (gy1 - gy0) * s);
          c.restore();
        }
        // the control surface
        if (split) {
          c.save(); c.setLineDash([7, 5]); c.strokeStyle = C.accent; c.lineWidth = 1.6; c.beginPath();
          if (V.cv === 'circle') { const [cx, cy] = P(0.45, 0); c.arc(cx, cy, 0.75 * s, 0, TWO_PI); }
          else if (V.cv === 'tall') { const [xa] = P(-0.7, 0), [xb] = P(1.6, 0); c.moveTo(xa, 0); c.lineTo(xa, st.H); c.moveTo(xb, 0); c.lineTo(xb, st.H); }
          else { const [, ya] = P(0, 0.5), [, yb] = P(0, -0.5); c.moveTo(0, ya); c.lineTo(st.W, ya); c.moveTo(0, yb); c.lineTo(st.W, yb); }
          c.stroke(); c.restore();
          const L = sol.cl / 2;
          if (Math.abs(L) > 1e-3) kit.label(c, 'momentum ' + (100 * split.mom / L).toFixed(0) + ' %  ·  pressure ' + (100 * split.pres / L).toFixed(0) + ' %', st.W - 10, st.H - 14, { align: 'right', color: C.accent, size: 12, weight: 700, bg: C.bg2 });
        }
        // smoke lines: dots joined where neighbours are close
        if (V.show !== 'field') {
          const byLine = new Map();
          for (const q of parts) if (!q.tag) { if (!byLine.has(q.line)) byLine.set(q.line, []); byLine.get(q.line).push(q); }
          c.save(); c.globalAlpha = 0.75; c.strokeStyle = c.fillStyle = C.text; c.lineWidth = 1.3;
          for (const arr of byLine.values()) {
            c.beginPath(); let prev = null;
            for (const q of arr) {
              const [x, y] = P(q.X, q.Y);
              if (prev && Math.hypot(q.X - prev.X, q.Y - prev.Y) < 0.09) c.lineTo(x, y); else c.moveTo(x, y);
              prev = q;
            }
            c.stroke();
            for (const q of arr) { const [x, y] = P(q.X, q.Y); c.fillRect(x - 1.3, y - 1.3, 2.6, 2.6); }
          }
          c.restore();
          for (const q of parts) {
            const [x, y] = P(q.X, q.Y);
            if (q.tag) { kit.dot(c, x, y, 5, q.tag > 0 ? C.bad : C.series[0], C.bg2); }
          }
        }
        // the airfoil
        outline(c, S.pts, (x, y) => { const d = toDisp(x, y); return P(d[0], d[1]); });
        c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
        // upwash and downwash: flow direction ahead and behind (angles drawn four times larger)
        for (const X of [-0.5, 1.5]) for (const Y of [-0.3, 0, 0.3]) {
          const w = velExact(X, Y); if (!w) continue;
          const ang = Math.atan2(w[1], w[0]) * 4, [x, y] = P(X, Y);
          kit.arrow(c, x - 22 * Math.cos(ang), y + 22 * Math.sin(ang), x + 22 * Math.cos(ang), y - 22 * Math.sin(ang), C.warn, 2);
        }
        kit.label(c, 'upwash', P(-0.5, 0.42)[0], P(-0.5, 0.42)[1], { align: 'center', color: C.warn, size: 11, weight: 700 });
        kit.label(c, 'downwash', P(1.5, 0.42)[0], P(1.5, 0.42)[1], { align: 'center', color: C.warn, size: 11, weight: 700 });
        // lift at the quarter chord
        const [lx, ly] = P(0.25, 0.05), Lp = clamp(sol.cl, -1.5, 2) * 55;
        if (Math.abs(Lp) > 3) kit.arrow(c, lx, ly, lx, ly - Lp, C.ok, 3);
        kit.label(c, 'free stream →', 10, 14, { align: 'left', color: C.muted, size: 12 });
        kit.label(c, 'α = ' + V.alpha.toFixed(1) + '°   c_l = ' + sol.cl.toFixed(2), 10, 32, { align: 'left', color: C.text, size: 13, weight: 700 });
        kit.label(c, 'arrows: flow angle ×4', 10, st.H - 14, { align: 'left', color: C.muted, size: 11 });
        if (V.show !== 'smoke') {
          kit.label(c, '■ suction', st.W - 150, 14, { align: 'left', color: 'hsl(8 80% 55%)', size: 11.5, weight: 700 });
          kit.label(c, '■ pressure', st.W - 78, 14, { align: 'left', color: 'hsl(215 80% 58%)', size: 11.5, weight: 700 });
        }
        if (V.show !== 'field' && arrived) {
          const top = parts.find(q => q.tag === 1 && q.line === arrived.line), bot = parts.find(q => q.tag === -1 && q.line === arrived.line);
          const teX = toDisp(1, 0)[0];
          if (bot && bot.X < teX) {
            const [x, y] = P(bot.X, bot.Y);
            kit.label(c, 'bottom parcel: ' + ((teX - bot.X) * 100).toFixed(0) + ' % c to go', x, y + 17, { align: 'center', color: C.series[0], size: 11.5, weight: 700, bg: C.bg2 });
            if (top) { const [tx, ty] = P(top.X, top.Y); kit.label(c, 'top parcel: already there', tx, ty - 15, { align: 'center', color: C.bad, size: 11.5, weight: 700, bg: C.bg2 }); }
          }
        }
      }, box.stage);
      shape();
      loop.start();
    }
  });

  /* ================================================================ 3. pressure distributions compared */
  Hyper.sim('foil-cp-compare', {
    title: 'Pressure distributions compared',
    blurb: `Two airfoils in the same stream, solved by the panel method. The graph plots $-C_p$ (suction upwards, as aerodynamicists draw it) on the upper surface (solid) and lower surface (dashed); the area between the two curves of one airfoil is its lift coefficient. The arrows on the drawings show suction (pulling outwards) and pressure (pushing inwards).

**Try this**
- Compare 0012 and 4412 at the **same lift** (c_l = 0.8): the cambered section needs 4° less angle and its suction peak is much lower and flatter — gentler on the boundary layer, which is why camber raises the maximum lift.
- Compare 0006 and 0018 at the same angle: the thin section makes a sharp spike of suction right at the nose; the thick one spreads it over the front third.
- Raise the angle and watch the peak climb and move towards the nose, while the rear of the upper surface stays near $C_p \\approx 0$: the steeper the climb back to the trailing-edge pressure, the harder the boundary layer's task.
- At the same angle, 0012 at 0° gives no lift at all — top and bottom curves lie on top of each other.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 230 });
      const plot = kit.plot(graphBox(box), { x: { label: 'x / c', min: 0, max: 1 }, y: { label: '−Cp  (suction up)' }, legend: true }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'a', type: 'select', label: 'Airfoil A', options: FOILS, value: (params && params.a) || '0012' },
        { id: 'b', type: 'select', label: 'Airfoil B', options: FOILS, value: (params && params.b) || '4412' },
        { id: 'mode', type: 'select', label: 'Compare at', options: [['the same angle of attack', 'alpha'], ['the same lift coefficient', 'cl']], value: (params && params.mode) || 'cl' },
        { id: 'alpha', label: 'Angle of attack α', min: -4, max: 14, step: 0.25, value: 4, unit: '°' },
        { id: 'cl', label: 'Lift coefficient c_l', min: 0, max: 1.6, step: 0.02, value: 0.8 }
      ], () => update());
      const ro = kit.readout(box.side, [['A', 'A'], ['Apk', 'A: suction peak −Cp,min'], ['B', 'B'], ['Bpk', 'B: suction peak −Cp,min'], ['note', '']]);
      const V = ctl.values;
      let A = null, B = null;
      function side(code, alphaDeg) {
        const s = parseCode(code), S = solverFor(F, s.m / 100, (s.p || 40) / 100, s.t / 100, 50);
        const al = V.mode === 'cl' ? S.alphaFor(V.cl) : alphaDeg * D2R, r = S.at(al);
        return { code, S, al, r, pk: peakOf(r.cp) };
      }
      function update() {
        ctl.show('alpha', V.mode !== 'cl'); ctl.show('cl', V.mode === 'cl');
        A = side(V.a, V.alpha); B = side(V.b, V.alpha);
        const C = kit.colors(), ser = [];
        for (const [X, col, nm] of [[A, C.series[0], 'A'], [B, C.series[1], 'B']]) {
          const up = X.r.cp.filter(c => c.upper).map(c => [c.x, -c.cp]).sort((p, q) => p[0] - q[0]);
          const lo = X.r.cp.filter(c => !c.upper).map(c => [c.x, -c.cp]).sort((p, q) => p[0] - q[0]);
          ser.push({ pts: up, label: nm + ' ' + X.code + ' upper', color: col }, { pts: lo, label: nm + ' lower', color: col, dash: [5, 4] });
        }
        plot.set({ series: ser, hlines: [{ y: 0 }] });
        for (const [X, k] of [[A, 'A'], [B, 'B']]) {
          const xcp = Math.abs(X.r.cl) > 0.02 ? (0.25 - X.r.cm / X.r.cl) : NaN;
          ro.set(k, 'NACA ' + X.code + ': α = ' + (X.al * R2D).toFixed(1) + '°, c_l = ' + X.r.cl.toFixed(2) + ', c_m = ' + X.r.cm.toFixed(3) + (Number.isFinite(xcp) && xcp > -1 && xcp < 2 ? ', x_cp = ' + (xcp * 100).toFixed(0) + ' % c' : ''));
          ro.set(k + 'pk', (-X.pk.cp).toFixed(2) + ' at ' + (X.pk.x * 100).toFixed(1) + ' % c (' + (X.pk.upper ? 'upper' : 'lower') + '), local speed ' + Math.sqrt(Math.max(0, 1 - X.pk.cp)).toFixed(2) + ' V∞');
        }
        const ra = -A.pk.cp, rb = -B.pk.cp;
        ro.set('note', V.mode === 'cl' ? (ra > rb ? 'B' : 'A') + '\'s suction peak is ' + (100 * (1 - Math.min(ra, rb) / Math.max(ra, rb))).toFixed(0) + ' % lower for the same lift' : 'Same α: ' + (A.r.cl > B.r.cl ? 'A' : 'B') + ' lifts more');
        loop.once();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        if (!A) return;
        const s = Math.min(st.W * 0.62, st.H * 1.05), rows = [[A, C.series[0], st.H * 0.28], [B, C.series[1], st.H * 0.74]];
        for (const [X, col, cy] of rows) {
          const a = X.al, ox = st.W * 0.22;
          const toDisp = (x, y) => { const cc = Math.cos(a), sn = Math.sin(a), dx = x - 0.25; return [0.25 + dx * cc + y * sn, -dx * sn + y * cc]; };
          const P = (x, y) => { const d = toDisp(x, y); return [ox + d[0] * s, cy - d[1] * s]; };
          outline(c, X.S.pts, P);
          c.fillStyle = C.surface; c.fill(); c.strokeStyle = col; c.lineWidth = 2; c.stroke();
          const pts = X.S.pts;
          for (let i = 0; i < X.r.cp.length; i += 2) {
            const q = X.r.cp[i], [x, y] = P(q.x, q.y);
            const tx = pts[i + 1][0] - pts[i][0], ty = pts[i + 1][1] - pts[i][1], L = Math.hypot(tx, ty) || 1, nx = -ty / L, ny = tx / L;
            const cn = Math.cos(a), sn = Math.sin(a), dx = nx * cn + ny * sn, dy = -nx * sn + ny * cn, mag = Math.min(1.8, Math.abs(q.cp)) * 24;
            if (mag > 2) { if (q.cp < 0) kit.arrow(c, x, y, x + dx * mag, y - dy * mag, 'hsl(8 80% 60% / .7)', 1.2); else kit.arrow(c, x + dx * mag, y - dy * mag, x, y, 'hsl(215 80% 62% / .7)', 1.2); }
          }
          kit.label(c, (X === A ? 'A' : 'B') + ': NACA ' + X.code, 10, cy - s * 0.2, { align: 'left', color: col, size: 13, weight: 700 });
          kit.label(c, 'α = ' + (a * R2D).toFixed(1) + '°,  c_l = ' + X.r.cl.toFixed(2), 10, cy - s * 0.2 + 17, { align: 'left', color: C.text, size: 12 });
        }
        kit.label(c, 'free stream →', st.W - 10, 14, { align: 'right', color: C.muted, size: 12 });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ 4. the Kutta condition (Joukowski airfoil) */
  Hyper.sim('foil-kutta', {
    title: 'The Kutta condition',
    blurb: `A Joukowski airfoil — the exact potential flow round a circle, mapped by $z = \\zeta + b^2/\\zeta$ — with **any** circulation you choose. Every value of Γ is a perfectly good solution of the frictionless flow equations; only one lets the air leave the sharp trailing edge smoothly. The bold lines are the dividing streamlines, the dots the stagnation points.

**Try this**
- Start at Γ = 0: the rear stagnation point sits on the upper surface, just ahead of the edge (watch the close-up), and the air from underneath whips round the sharp trailing edge at (in theory) infinite speed — see the spike on the speed graph. No lift.
- Slide Γ up. The rear stagnation point creeps back along the upper surface and, at one value, sits exactly on the trailing edge. That is the **Kutta condition**; press the button to jump there. The spike on the graph disappears.
- Go past it: the stagnation point moves round onto the lower surface and the air now whips round the edge the other way.
- Press **Start from rest**: the circulation builds up as the airfoil gets going and an equal and opposite *starting vortex* is left behind — the total circulation stays zero, as Kelvin's theorem demands.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 250 });
      const plot = kit.plot(graphBox(box), { x: { label: 'x / c', min: 0, max: 1 }, y: { label: 'surface speed |V| / V∞', min: 0, max: 3.5 }, legend: true }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'gam', label: 'Circulation Γ / (V∞ c)', min: -0.2, max: 1.4, step: 0.005, value: (params && params.gam) != null ? params.gam : 0 },
        { id: 'alpha', label: 'Angle of attack α', min: -4, max: 14, step: 0.5, value: 6, unit: '°' },
        { id: 't', label: 'Thickness (about)', min: 4, max: 18, step: 1, value: 12, unit: '%' },
        { id: 'm', label: 'Camber (about)', min: 0, max: 6, step: 0.5, value: 2, unit: '%' },
        { type: 'buttons', items: [{ id: 'kutta', label: 'Apply the Kutta condition', primary: true }, { id: 'start', label: 'Start from rest' }, { id: 'zero', label: 'Γ = 0' }] }
      ], (id) => {
        if (id === 'kutta') { starting = null; ctl.set('gam', geo.gK / geo.c); }
        else if (id === 'zero') { starting = null; ctl.set('gam', 0); }
        else if (id === 'start') { starting = { s: 0 }; ctl.set('gam', 0); }
        else if (id === 'gam') starting = null;
        if (id === 't' || id === 'm' || id === 'alpha') build();
        field(); loop.once();
      });
      const ro = kit.readout(box.side, [['gam', 'Circulation Γ'], ['gk', 'Kutta value Γ_K'], ['rear', 'Rear stagnation point'], ['vte', 'Speed at the trailing edge'], ['cl', 'c_l = 2Γ/(V∞c)  (Kutta–Joukowski)'], ['shape', 'This Joukowski airfoil']]);
      const V = ctl.values, b = 1;
      let geo = null, starting = null, psi = null, lines = [], zlines = [], divs = [], parts = [], zparts = [];
      // complex helpers on [re, im]
      const cmul = (p, q) => [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]];
      const cdiv = (p, q) => { const d = q[0] * q[0] + q[1] * q[1] || 1e-30; return [(p[0] * q[0] + p[1] * q[1]) / d, (p[1] * q[0] - p[0] * q[1]) / d]; };
      const csqrt = p => { const r = Math.hypot(p[0], p[1]), re = Math.sqrt(Math.max(0, (r + p[0]) / 2)), im = Math.sqrt(Math.max(0, (r - p[0]) / 2)); return [re, p[1] < 0 ? -im : im]; };
      function build() {
        const ex = V.t / 100 / 1.299 * b, ey = 2 * V.m / 100 * b;          // circle centre offset: thickness and camber (approximately)
        const mu = [-ex, ey], R = Math.hypot(b + ex, ey), beta = Math.atan2(ey, b + ex);
        // the surface, from the trailing edge round the upper side (θ increasing)
        const surf = [];
        let xmin = 1e9, thLE = Math.PI;
        for (let k = 0; k <= 720; k++) {
          const th = -beta + TWO_PI * k / 720, zeta = [mu[0] + R * Math.cos(th), mu[1] + R * Math.sin(th)];
          const z = [zeta[0] + cdiv([b * b, 0], zeta)[0], zeta[1] + cdiv([b * b, 0], zeta)[1]];
          surf.push({ th, x: z[0], y: z[1] });
          if (z[0] < xmin) { xmin = z[0]; thLE = th; }
        }
        const xte = 2 * b, c = xte - xmin;
        let ymax = -1e9, ymin = 1e9;
        for (const q of surf) { ymax = Math.max(ymax, q.y); ymin = Math.min(ymin, q.y); }
        const a = V.alpha * D2R;
        geo = { mu, R, beta, surf, xmin, xte, c, thLE, a, gK: 4 * Math.PI * R * Math.sin(a + beta) };
        // thickness and camber actually obtained, measured on the surface
        let tmax = 0, cmax = 0;
        for (let k = 1; k < 60; k++) {
          const x = xmin + c * k / 60;
          const yu = interpY(surf.filter(q => q.th < thLE), x), yl = interpY(surf.filter(q => q.th >= thLE), x);
          tmax = Math.max(tmax, yu - yl); cmax = Math.max(cmax, (yu + yl) / 2);
        }
        ro.set('shape', 'thickness ' + (100 * tmax / c).toFixed(1) + ' %, camber ' + (100 * cmax / c).toFixed(1) + ' %, cusped trailing edge');
        // the inverse map of display grids (display frame: stream horizontal, airfoil pitched by α about its quarter chord):
        // the whole view, and a close-up of the trailing edge
        geo.grid = makeGrid(-0.55, 1.65, -0.62, 0.62, 170, 96);
        geo.te = zToDisp([xte, 0]);
        geo.zoom = makeGrid(geo.te[0] - 0.036, geo.te[0] + 0.024, geo.te[1] - 0.02, geo.te[1] + 0.02, 84, 56);
        parts = []; zparts = [];
      }
      function makeGrid(X0, X1, Y0, Y1, GX, GY) {
        const cells = new Array(GX * GY);
        for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
          const X = X0 + (X1 - X0) * i / (GX - 1), Y = Y0 + (Y1 - Y0) * j / (GY - 1);
          const zeta = zToZeta(dispToZ(X, Y));
          cells[j * GX + i] = zeta ? [zeta[0] - geo.mu[0], zeta[1] - geo.mu[1]] : null;
        }
        return { GX, GY, X0, X1, Y0, Y1, cells };
      }
      // the stream function on a grid: ψ = Im[(ζ−μ)e^{−iα} + R² e^{iα}/(ζ−μ)] + Γ/(2π) ln|ζ−μ|
      function psiOn(g, G) {
        const a = geo.a, ca = Math.cos(a), sa = Math.sin(a), R2 = geo.R * geo.R, f = new Float32Array(g.GX * g.GY);
        for (let k = 0; k < g.cells.length; k++) {
          const A = g.cells[k]; if (!A) { f[k] = NaN; continue; }
          const r2 = A[0] * A[0] + A[1] * A[1];
          f[k] = (A[1] * ca - A[0] * sa) + R2 * (sa * A[0] - ca * A[1]) / r2 + G / TWO_PI * 0.5 * Math.log(r2);
        }
        return f;
      }
      function interpY(arr, x) {
        let best = null;
        for (let k = 1; k < arr.length; k++) {
          const p = arr[k - 1], q = arr[k];
          if ((p.x - x) * (q.x - x) <= 0 && p.x !== q.x) { const y = p.y + (q.y - p.y) * (x - p.x) / (q.x - p.x); best = best == null ? y : best; }
        }
        return best == null ? 0 : best;
      }
      // display (chord 1, leading edge at 0, stream along +X) <-> z-plane (the airfoil frame of the map)
      function dispToZ(X, Y) {
        const a = geo.a, ca = Math.cos(a), sa = Math.sin(a), dx = X - 0.25;
        const x = 0.25 + dx * ca - Y * sa, y = dx * sa + Y * ca;     // chord units, airfoil frame
        return [geo.xmin + x * geo.c, y * geo.c];
      }
      function zToDisp(z) {
        const x = (z[0] - geo.xmin) / geo.c, y = z[1] / geo.c, a = geo.a, ca = Math.cos(a), sa = Math.sin(a), dx = x - 0.25;
        return [0.25 + dx * ca + y * sa, -dx * sa + y * ca];
      }
      // ζ outside the circle for a point z (null inside the airfoil)
      function zToZeta(z) {
        const h = [z[0] / 2, z[1] / 2], r = csqrt([h[0] * h[0] - h[1] * h[1] - b * b, 2 * h[0] * h[1]]);
        const z1 = [h[0] + r[0], h[1] + r[1]], z2 = [h[0] - r[0], h[1] - r[1]];
        const o1 = Math.hypot(z1[0] - geo.mu[0], z1[1] - geo.mu[1]) >= geo.R * (1 - 1e-9), o2 = Math.hypot(z2[0] - geo.mu[0], z2[1] - geo.mu[1]) >= geo.R * (1 - 1e-9);
        if (o1 && o2) return Math.hypot(z1[0], z1[1]) > Math.hypot(z2[0], z2[1]) ? z1 : z2;
        return o1 ? z1 : o2 ? z2 : null;
      }
      // complex velocity u − iv in the z-plane (V∞ = 1 at angle α to the chord)
      function wz(zeta, G) {
        const A = [zeta[0] - geo.mu[0], zeta[1] - geo.mu[1]], a = geo.a, R2 = geo.R * geo.R;
        const e1 = [Math.cos(-a), Math.sin(-a)], e2 = [Math.cos(a), Math.sin(a)];
        const t2 = cdiv(cmul([R2, 0], e2), cmul(A, A)), t3 = cdiv([0, G / TWO_PI], A);
        const dW = [e1[0] - t2[0] + t3[0], e1[1] - t2[1] + t3[1]];
        const z2 = cmul(zeta, zeta), dz = [1 - cdiv([b * b, 0], z2)[0], -cdiv([b * b, 0], z2)[1]];
        return cdiv(dW, dz);
      }
      // velocity in the display frame at a display point, or null inside
      function velDisp(X, Y, G) {
        const zeta = zToZeta(dispToZ(X, Y)); if (!zeta) return null;
        const w = wz(zeta, G), u = w[0], v = -w[1], a = geo.a, ca = Math.cos(a), sa = Math.sin(a);
        return [u * ca + v * sa, -u * sa + v * ca];
      }
      const surfSpeed = (th, G) => Math.abs(2 * Math.sin(th - geo.a) + G / (TWO_PI * geo.R));
      function field() {
        const G = V.gam * geo.c, a = geo.a;
        const psiB = G / TWO_PI * Math.log(geo.R);                       // the value on the body
        psi = psiOn(geo.grid, G);
        lines = contours(psi, geo.grid, psiB, 0.07 * geo.c);
        zlines = contours(psiOn(geo.zoom, G), geo.zoom, psiB, 0.0025 * geo.c);
        // stagnation points on the circle
        const kk = G / (4 * Math.PI * geo.R);
        divs = [];
        geo.stag = null;
        if (Math.abs(kk) <= 1) {
          const thR = a - Math.asin(kk), thF = a + Math.PI + Math.asin(kk);
          const pt = th => { const zeta = [geo.mu[0] + geo.R * Math.cos(th), geo.mu[1] + geo.R * Math.sin(th)], zi = cdiv([b * b, 0], zeta); return [zeta[0] + zi[0], zeta[1] + zi[1]]; };
          geo.stag = { rear: pt(thR), front: pt(thF), thR };
          divs.push(trace(zToDisp(pt(thF)), -1, G), trace(zToDisp(pt(thR)), 1, G));
        }
        // the speed along the surface
        const up = [], lo = [];
        for (const q of geo.surf) {
          const sp = surfSpeed(q.th, G), den = Math.hypot(...(() => { const zeta = [geo.mu[0] + geo.R * Math.cos(q.th), geo.mu[1] + geo.R * Math.sin(q.th)], z2 = cmul(zeta, zeta), t = cdiv([b * b, 0], z2); return [1 - t[0], -t[1]]; })());
          if (den < 1e-6) continue;                                      // the trailing-edge point itself: 0/0
          const v = sp / den, x = (q.x - geo.xmin) / geo.c;
          if (x < 0 || x > 1) continue;
          (q.th < geo.thLE ? up : lo).push([x, Math.min(3.5, v)]);
        }
        up.sort((p, q) => p[0] - q[0]); lo.sort((p, q) => p[0] - q[0]);
        plot.set({ series: [{ pts: up, label: 'upper surface' }, { pts: lo, label: 'lower surface', dash: [5, 4] }], hlines: [{ y: 1, label: 'free stream' }] });
        // read-outs
        const gK = geo.gK / geo.c, err = V.gam - gK;
        ro.set('gam', V.gam.toFixed(3) + ' × V∞c');
        ro.set('gk', gK.toFixed(3) + ' × V∞c  (thin theory: π(α − α₀) = ' + (Math.PI * (geo.a + geo.beta)).toFixed(3) + ')');
        if (!geo.stag) ro.set('rear', 'off the surface: |Γ| is too large');
        else if (Math.abs(err) < 0.003) ro.set('rear', 'on the trailing edge: Kutta condition met');
        else { const xs = (geo.stag.rear[0] - geo.xmin) / geo.c; let th = geo.stag.thR; while (th < -geo.beta) th += TWO_PI; while (th > TWO_PI - geo.beta) th -= TWO_PI; ro.set('rear', (th < geo.thLE ? 'upper' : 'lower') + ' surface, ' + (100 * (1 - xs)).toFixed(1) + ' % of the chord ahead of the trailing edge (see the close-up)'); }
        ro.set('vte', Math.abs(err) < 0.003 ? 'finite, ' + (Math.cos(geo.a + geo.beta) * b / geo.R).toFixed(2) + ' V∞ — the flow leaves smoothly' : 'infinite in theory — the flow whips round the edge');
        ro.set('cl', (2 * V.gam).toFixed(3) + (Math.abs(err) < 0.003 ? ' (the real one)' : ''));
      }
      // marching squares on ψ at levels ψ_B + kΔ
      function contours(f, g, base, step) {
        const segs = [];
        const lev = [];
        for (let k = -14; k <= 14; k++) if (k) lev.push(base + k * step);
        for (let j = 0; j < g.GY - 1; j++) for (let i = 0; i < g.GX - 1; i++) {
          const k0 = j * g.GX + i, v = [f[k0], f[k0 + 1], f[k0 + 1 + g.GX], f[k0 + g.GX]];
          if (!(v.every(Number.isFinite))) continue;
          const lo = Math.min(v[0], v[1], v[2], v[3]), hi = Math.max(v[0], v[1], v[2], v[3]);
          const X = [g.X0 + (g.X1 - g.X0) * i / (g.GX - 1), g.X0 + (g.X1 - g.X0) * (i + 1) / (g.GX - 1)], Y = [g.Y0 + (g.Y1 - g.Y0) * j / (g.GY - 1), g.Y0 + (g.Y1 - g.Y0) * (j + 1) / (g.GY - 1)];
          const corner = [[X[0], Y[0]], [X[1], Y[0]], [X[1], Y[1]], [X[0], Y[1]]];
          for (const L of lev) {
            if (L < lo || L > hi) continue;
            const hit = [];
            for (let e = 0; e < 4; e++) {
              const a0 = v[e], a1 = v[(e + 1) % 4];
              if ((a0 - L) * (a1 - L) < 0) { const t = (L - a0) / (a1 - a0), p = corner[e], q = corner[(e + 1) % 4]; hit.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
            }
            if (hit.length >= 2) segs.push([hit[0], hit[1]]);
            if (hit.length === 4) segs.push([hit[2], hit[3]]);
          }
        }
        return segs;
      }
      // a dividing streamline from a stagnation point: dir −1 upstream, +1 downstream
      function trace(p0, dir, G) {
        const path = [p0];
        let X = p0[0], Y = p0[1];
        // step off the surface: try a small ring of points for the one moving the right way
        let best = null;
        for (let k = 0; k < 36; k++) {
          const ang = TWO_PI * k / 36, x = X + 0.003 * Math.cos(ang), y = Y + 0.003 * Math.sin(ang), w = velDisp(x, y, G);
          if (!w) continue;
          const score = dir * (w[0] * Math.cos(ang) + w[1] * Math.sin(ang)) / (Math.hypot(w[0], w[1]) || 1);
          if (!best || score > best.s) best = { s: score, x, y };
        }
        if (!best) return path;
        X = best.x; Y = best.y; path.push([X, Y]);
        for (let n = 0; n < 700; n++) {
          const w = velDisp(X, Y, G); if (!w) break;
          const sp = Math.hypot(w[0], w[1]) || 1, h = (n < 60 ? 0.002 : 0.012) * dir;
          const w2 = velDisp(X + h * w[0] / sp / 2, Y + h * w[1] / sp / 2, G); if (!w2) break;
          const s2 = Math.hypot(w2[0], w2[1]) || 1;
          X += h * w2[0] / s2; Y += h * w2[1] / s2; path.push([X, Y]);
          if (X < -0.6 || X > 1.7 || Math.abs(Y) > 0.7) break;
        }
        return path;
      }
      const wagner = s => 1 - 0.165 * Math.exp(-0.0455 * s) - 0.335 * Math.exp(-0.3 * s);
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!geo || !psi) return;
        const s = st.W / 2.35, ox = s * 0.6, oy = st.H * 0.5;
        const P = (X, Y) => [ox + X * s, oy - Y * s];
        // a start from rest: the circulation builds up (Wagner) and a starting vortex drifts away
        if (starting) {
          starting.s += dt * 3;                                         // semi-chords travelled
          const G = geo.gK / geo.c * wagner(starting.s);
          ctl.set('gam', G);
          field();
          if (starting.s > 60) starting = null;
        }
        const G = V.gam * geo.c;
        // streamlines
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath();
        for (const sg of lines) { const [x1, y1] = P(sg[0][0], sg[0][1]), [x2, y2] = P(sg[1][0], sg[1][1]); c.moveTo(x1, y1); c.lineTo(x2, y2); }
        c.stroke();
        // particles
        while (parts.length < 170) parts.push({ X: -0.55 + Math.random() * 2.2, Y: -0.6 + Math.random() * 1.2 });
        for (const q of parts) {
          const w = velDisp(q.X, q.Y, G);
          if (!w) { q.X = -0.55; q.Y = -0.6 + Math.random() * 1.2; continue; }
          let dx = w[0] * dt * 0.28, dy = w[1] * dt * 0.28; const L = Math.hypot(dx, dy);
          if (L > 0.03) { dx *= 0.03 / L; dy *= 0.03 / L; }
          q.X += dx; q.Y += dy;
          if (q.X > 1.65 || Math.abs(q.Y) > 0.62 || !Number.isFinite(q.X + q.Y)) { q.X = -0.55 + Math.random() * 0.05; q.Y = -0.6 + Math.random() * 1.2; }
          const sp = Math.hypot(w[0], w[1]), f = Math.max(-1, Math.min(1, (sp - 1) * 2));
          const [x, y] = P(q.X, q.Y);
          c.fillStyle = f >= 0 ? 'hsl(8 85% ' + (C.dark ? 62 : 48) + '% / ' + (0.35 + 0.6 * f) + ')' : 'hsl(215 85% ' + (C.dark ? 66 : 50) + '% / ' + (0.35 - 0.6 * f) + ')';
          c.fillRect(x - 1.4, y - 1.4, 2.8, 2.8);
        }
        // dividing streamlines
        c.strokeStyle = C.warn; c.lineWidth = 2.2;
        for (const d of divs) { c.beginPath(); d.forEach((p, i) => { const [x, y] = P(p[0], p[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); }
        // the airfoil
        c.beginPath();
        geo.surf.forEach((q, i) => { const d = zToDisp([q.x, q.y]), [x, y] = P(d[0], d[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); });
        c.closePath(); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
        // stagnation points and the trailing edge
        const te = zToDisp([geo.xte, 0]), [tx, ty] = P(te[0], te[1]);
        kit.dot(c, tx, ty, 4, C.text);
        const ok = Math.abs(V.gam - geo.gK / geo.c) < 0.003;
        if (geo.stag) {
          const r = zToDisp(geo.stag.rear), f = zToDisp(geo.stag.front), [rx, ry] = P(r[0], r[1]), [fx, fy] = P(f[0], f[1]);
          kit.dot(c, fx, fy, 6, C.warn, C.bg2);
          kit.dot(c, rx, ry, 7, ok ? C.ok : C.bad, C.bg2);
          if (ok) kit.label(c, 'Kutta condition: the flow leaves the trailing edge smoothly', Math.min(st.W - 8, rx + 120), ry + 24, { align: 'right', color: C.ok, size: 12, weight: 700, bg: C.bg2 });
          else kit.label(c, 'rear stagnation point', rx, ry - 16, { align: 'center', color: C.bad, size: 12, weight: 700, bg: C.bg2 });
          kit.label(c, 'front stagnation point', fx - 8, fy + 16, { align: 'right', color: C.warn, size: 11.5, bg: C.bg2 });
        }
        if (!ok && geo.stag) kit.label(c, 'flow whips round the sharp edge', tx + 8, ty + 18, { align: 'left', color: C.bad, size: 11.5 });
        // starting vortex
        if (starting) {
          const X = te[0] + starting.s / 2, [vx, vy] = P(Math.min(X, 1.55), te[1]);
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
          for (let k = 0; k < 60; k++) { const ang = -k * 0.35, r = 2 + k * 0.28; const x = vx + r * Math.cos(ang), y = vy + r * Math.sin(ang); k ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.stroke();
          kit.label(c, 'starting vortex −Γ' + (X > 1.55 ? ', ' + (X - te[0]).toFixed(1) + ' chords behind' : ''), Math.min(vx + 30, st.W - 8), vy + 46, { align: 'right', color: C.accent, size: 11.5, weight: 700, bg: C.bg2 });
          kit.label(c, 'travelled ' + (starting.s / 2).toFixed(1) + ' chords: Γ = ' + (100 * wagner(starting.s)).toFixed(0) + ' % of Γ_K', st.W - 10, st.H - 14, { align: 'right', color: C.accent, size: 12, weight: 700 });
        }
        // a close-up of the trailing edge
        const zg = geo.zoom, bw = Math.min(230, st.W * 0.34), bh = bw * (zg.Y1 - zg.Y0) / (zg.X1 - zg.X0), bx = 8, by = st.H - bh - 8, Z = bw / (zg.X1 - zg.X0);
        const Pz = (X, Y) => [bx + (X - zg.X0) * Z, by + (zg.Y1 - Y) * Z];
        c.save();
        c.beginPath(); c.rect(bx, by, bw, bh); c.fillStyle = C.bg2; c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.stroke(); c.clip();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath();
        for (const sg of zlines) { const [x1, y1] = Pz(sg[0][0], sg[0][1]), [x2, y2] = Pz(sg[1][0], sg[1][1]); c.moveTo(x1, y1); c.lineTo(x2, y2); }
        c.stroke();
        while (zparts.length < 60) zparts.push({ X: zg.X0 + Math.random() * (zg.X1 - zg.X0), Y: zg.Y0 + Math.random() * (zg.Y1 - zg.Y0), age: Math.random() * 3 });
        const kz = s / Z;
        for (const q of zparts) {
          const w = velDisp(q.X, q.Y, G);
          q.age += dt;
          if (!w || q.age > 4 || q.X > zg.X1 || q.X < zg.X0 || q.Y > zg.Y1 || q.Y < zg.Y0) {
            q.age = 0;
            if (Math.random() < 0.5) { q.X = zg.X0 + 0.002; q.Y = zg.Y0 + Math.random() * (zg.Y1 - zg.Y0); } else { q.X = zg.X0 + Math.random() * (zg.X1 - zg.X0); q.Y = zg.Y0 + Math.random() * (zg.Y1 - zg.Y0); }
            continue;
          }
          let dx = w[0] * dt * 0.28 * kz, dy = w[1] * dt * 0.28 * kz; const L = Math.hypot(dx, dy);
          if (L > 0.03 * kz) { dx *= 0.03 * kz / L; dy *= 0.03 * kz / L; }
          q.X += dx; q.Y += dy;
          if (!Number.isFinite(q.X + q.Y)) { q.X = zg.X0; q.Y = zg.Y0; continue; }
          const sp = Math.hypot(w[0], w[1]), f = Math.max(-1, Math.min(1, (sp - 1) * 2)), [x, y] = Pz(q.X, q.Y);
          c.fillStyle = f >= 0 ? 'hsl(8 85% ' + (C.dark ? 62 : 48) + '% / ' + (0.4 + 0.55 * f) + ')' : 'hsl(215 85% ' + (C.dark ? 66 : 50) + '% / ' + (0.4 - 0.55 * f) + ')';
          c.fillRect(x - 1.6, y - 1.6, 3.2, 3.2);
        }
        c.strokeStyle = C.warn; c.lineWidth = 2.2;
        for (const d of divs) { c.beginPath(); d.forEach((p, i) => { const [x, y] = Pz(p[0], p[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); }
        c.beginPath();
        geo.surf.forEach((q, i) => { const d = zToDisp([q.x, q.y]), [x, y] = Pz(d[0], d[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); });
        c.closePath(); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
        if (geo.stag) { const r = zToDisp(geo.stag.rear), [rx, ry] = Pz(r[0], r[1]); kit.dot(c, rx, ry, 6, ok ? C.ok : C.bad, C.bg2); }
        c.restore();
        kit.label(c, 'trailing edge, ×' + (Z / s).toFixed(0), bx + 6, by + 11, { align: 'left', color: C.muted, size: 11, weight: 700 });
        kit.label(c, 'free stream →', 10, 14, { align: 'left', color: C.muted, size: 12 });
        kit.label(c, 'Γ = ' + V.gam.toFixed(3) + ' V∞c   (Kutta: ' + (geo.gK / geo.c).toFixed(3) + ')', 10, 32, { align: 'left', color: C.text, size: 13, weight: 700 });
      }, box.stage);
      build(); field();
      loop.start();
    }
  });

  /* ================================================================ 5. the lift curve and stall */
  // a separation model (Kirchhoff flow with an empirical separation point, as in helicopter and wind-turbine codes):
  // c_l = a (α − α₀) ((1 + √f)/2)², f = separation point / chord; break angle α₁; S₁, S₂ set how gradual it is.
  const STALL = {
    le: { code: '0012', name: 'NACA 0012', kind: 'leading-edge stall', a: 0.108, a0: 0, a1: 17.5, S1: 1.2, S2: 1.0, hy: 3, reShift: 2.8, cd0: 0.0055 },
    te: { code: '4415', name: 'NACA 4415', kind: 'trailing-edge stall', a: 0.105, a0: -4.2, a1: 14, S1: 3, S2: 3.5, hy: 0.5, reShift: 2.8, cd0: 0.0065 },
    mid: { code: '2412', name: 'NACA 2412', kind: 'combined stall', a: 0.105, a0: -2.1, a1: 17, S1: 2, S2: 2, hy: 1.5, reShift: 2.8, cd0: 0.006 },
    thin: { code: '0006', name: 'NACA 0006', kind: 'thin-airfoil stall', a: 0.105, a0: 0, a1: 9.5, S1: 3.5, S2: 3, hy: 1, reShift: 0.8, cd0: 0.005 }
  };
  const fSep = (al, P, a1) => { const x = Math.abs(al - P.a0), x1 = a1 - P.a0; return x <= x1 ? 1 - 0.3 * Math.exp((x - x1) / P.S1) : 0.04 + 0.66 * Math.exp((x1 - x) / P.S2); };
  const clSep = (al, P, f) => P.a * (al - P.a0) * Math.pow((1 + Math.sqrt(f)) / 2, 2);
  function stallAt(key, Re) {
    const B = STALL[key] || STALL.le, d = Math.max(0, Math.log10(6e6 / Re));
    return Object.assign({}, B, { a: B.a * (1 - 0.04 * d), a1: B.a1 - B.reShift * d, S1: B.S1 * (1 + 0.25 * d), hy: B.hy + 1.5 * d, cd0: B.cd0 * (1 + 0.55 * d) });
  }

  Hyper.sim('foil-lift-curve', {
    title: 'Lift curve and stall',
    blurb: `The lift coefficient of a wing section against angle of attack. The straight part is the attached-flow lift; the top of the curve comes when the boundary layer starts to separate from the upper surface (drawn on the airfoil). The model is a standard separation model with typical values for each section — it reproduces the kinds of stall, not the data of one wind tunnel.

**Try this**
- Tick **Sweep** and watch the point trace the curve up and back: past the stall the lift does not come back until the angle is well below the stall angle. That loop is **hysteresis**.
- Compare the four sections: the 0012 stalls abruptly from the leading edge, the thick 4415 gently from the trailing edge, the thin 0006 early and softly as a leading-edge bubble spreads back.
- Lower the Reynolds number to 100 000 (a small drone or a bird): the maximum lift falls, the stall comes earlier and the hysteresis loop widens. The thin section suffers least.
- Watch the drag read-out through the stall: once the flow separates, the drag grows tens of times over.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const plot = kit.plot(graphBox(box), { x: { label: 'angle of attack α (°)', min: -6, max: 26 }, y: { label: 'lift coefficient c_l', min: -0.8, max: 2.0 }, legend: true }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'foil', type: 'select', label: 'Section', options: [['NACA 0012 — leading-edge stall', 'le'], ['NACA 4415 — trailing-edge stall', 'te'], ['NACA 2412 — combined', 'mid'], ['NACA 0006 — thin-airfoil stall', 'thin']], value: (params && params.foil) || 'le' },
        { id: 're', type: 'select', label: 'Reynolds number', options: [['6 million (light aircraft)', 6e6], ['1 million (glider, large drone)', 1e6], ['300 000 (model aircraft)', 3e5], ['100 000 (small drone, bird)', 1e5]], value: (params && params.re) || 6e6 },
        { id: 'alpha', label: 'Angle of attack α', min: -6, max: 26, step: 0.1, value: 4, unit: '°' },
        { id: 'sweep', type: 'check', label: 'Sweep α up and down', value: !!(params && params.sweep) },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear the trace' }] }
      ], (id) => { if (id === 'clear') trace.length = 0; if (id === 'foil' || id === 're') { setup(); trace.length = 0; } if (id === 'alpha' && !V.sweep) step(0); });
      const ro = kit.readout(box.side, [['cl', 'Lift coefficient c_l'], ['cd', 'Drag coefficient c_d'], ['ld', 'Lift-to-drag ratio'], ['sep', 'Upper-surface flow'], ['state', 'State'], ['max', 'c_l,max (on the way up)'], ['re', 'Flow reattaches below']]);
      const V = ctl.values, trace = [];
      let P = null, pts = null, stalled = false, lastA = V.alpha, phase = 0, eddy = 0;
      function setup() {
        P = stallAt(V.foil, V.re);
        const s = parseCode(P.code);
        pts = F.naca4(s.m / 100, (s.p || 40) / 100, s.t / 100, 50);
        stalled = false;
        // the two branches of the loop
        const up = [], down = [];
        let best = -9, ab = 0;
        for (let al = -6; al <= 26.001; al += 0.2) {
          const cu = clSep(al, P, fSep(al, P, al <= P.a1 ? P.a1 : P.a1 - P.hy));
          const cd = clSep(al, P, fSep(al, P, al >= P.a1 - P.hy ? P.a1 - P.hy : P.a1));
          up.push([al, cu]); down.push([al, cd]);
          if (al <= P.a1 + 0.01 && cu > best) { best = cu; ab = al; }
        }
        P.clmax = best; P.amax = ab; P.up = up; P.down = down;
        ro.set('max', best.toFixed(2) + ' at ' + ab.toFixed(1) + '° — ' + P.kind);
        ro.set('re', (P.a1 - P.hy).toFixed(1) + '° (stalls at ' + P.a1.toFixed(1) + '°)');
      }
      function state(al) {
        if (!stalled && al > P.a1) stalled = true;
        else if (stalled && al < P.a1 - P.hy) stalled = false;
        const f = fSep(al, P, stalled ? P.a1 - P.hy : P.a1), cl = clSep(al, P, f);
        const cd = P.cd0 * (1 + 0.3 * Math.pow(al / 10, 2)) + Math.abs(cl * Math.tan(al * D2R)) * (1 - Math.sqrt(f));
        return { f, cl, cd };
      }
      function step(dt) {
        if (V.sweep) { phase += dt / 16; const u = phase % 1, al = -2 + 26 * (u < 0.5 ? 2 * u : 2 - 2 * u); ctl.set('alpha', Math.round(al * 10) / 10); }
        const al = V.alpha, r = state(al);
        if (al !== lastA || !trace.length) { trace.push([al, r.cl]); if (trace.length > 400) trace.shift(); lastA = al; }
        ro.set('cl', r.cl.toFixed(3));
        ro.set('cd', r.cd.toFixed(4));
        ro.set('ld', (r.cl / r.cd).toFixed(0));
        const thin = V.foil === 'thin';
        ro.set('sep', thin ? (r.f > 0.97 ? 'attached (a short bubble at the nose)' : r.f < 0.15 ? 'separated from the leading edge' : 'leading-edge bubble over ' + (100 * Math.min(1, (1 - r.f) * 1.4)).toFixed(0) + ' % of the chord')
          : r.f > 0.97 ? 'attached to the trailing edge' : r.f < 0.15 ? 'separated from the leading edge' : 'separates at ' + (100 * r.f).toFixed(0) + ' % of the chord');
        ro.set('state', stalled ? 'STALLED — reattaches below ' + (P.a1 - P.hy).toFixed(1) + '°' : al > P.a1 - 3 ? 'near the stall' : 'attached flow');
        plot.set({ series: [{ pts: P.up, label: 'α increasing', color: kit.colors().series[0] }, { pts: P.down, label: 'α decreasing', dash: [5, 4], color: kit.colors().series[1] },
          { pts: trace.slice(), label: 'your path', line: false, dots: 2.2, color: kit.colors().warn }], marks: [{ x: al, y: r.cl, label: 'now' }], hlines: [{ y: 0 }] });
        return r;
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!P) return;
        const r = step(dt);
        eddy += dt;
        const a = V.alpha * D2R, s = Math.min(st.W * 0.55, st.H * 1.6), ox = st.W * 0.2, oy = st.H * 0.5;
        const toDisp = (x, y) => { const cc = Math.cos(a), sn = Math.sin(a), dx = x - 0.25; return [0.25 + dx * cc + y * sn, -dx * sn + y * cc]; };
        const P2 = (x, y) => { const d = toDisp(x, y); return [ox + d[0] * s, oy - d[1] * s]; };
        const n = (pts.length - 1) / 2, upper = pts.slice(n);                  // leading edge -> trailing edge
        const upAt = x => { for (let i = 1; i < upper.length; i++) if (upper[i][0] >= x) { const p = upper[i - 1], q = upper[i], t = (x - p[0]) / ((q[0] - p[0]) || 1); return [x, p[1] + (q[1] - p[1]) * t]; } return upper[upper.length - 1]; };
        // stream lines ahead (schematic, horizontal) and over the attached part
        c.strokeStyle = C.faint; c.lineWidth = 1.2;
        for (let k = -3; k <= 3; k++) { const y = oy + k * s * 0.09; c.beginPath(); c.moveTo(8, y); c.lineTo(ox - 10, y); c.stroke(); kit.arrow(c, ox - 34, y, ox - 12, y, C.faint, 1.2); }
        // the separated region: from the separation point (or a leading-edge bubble) to the trailing edge
        const thin = V.foil === 'thin';
        let xs = r.f, bubble = 0;
        if (thin && r.f >= 0.15) { bubble = Math.min(1, (1 - r.f) * 1.4); xs = 1; }
        if (xs < 0.97) {
          const [sx, sy] = P2(...upAt(xs)), [tx, ty] = P2(1, 0);
          const hgt = (1 - xs) * s * (0.12 + 0.5 * Math.sin(Math.min(1.2, a + 0.2)));
          c.beginPath(); c.moveTo(sx, sy);
          for (let x = xs; x <= 1.0001; x += 0.02) { const [px, py] = P2(...upAt(Math.min(1, x))); c.lineTo(px, py); }
          c.lineTo(tx + s * 0.35, ty - hgt * 0.4); c.quadraticCurveTo(tx, sy - hgt, sx, sy); c.closePath();
          c.save(); c.globalAlpha = 0.2; c.fillStyle = C.warn; c.fill(); c.restore();
          // eddies drifting downstream
          c.strokeStyle = C.warn; c.lineWidth = 1.3;
          for (let k = 0; k < 6; k++) {
            const u = ((eddy * 0.25 + k / 6) % 1), x = sx + (tx + s * 0.3 - sx) * u, y = sy + (ty - hgt * 0.45 - sy) * u - hgt * 0.35 * Math.sin(u * Math.PI);
            c.beginPath(); c.arc(x, y, 3 + 7 * u, eddy * 3 + k, eddy * 3 + k + 4.5); c.stroke();
          }
          kit.label(c, 'separated flow', sx, sy - 12, { align: 'left', color: C.warn, size: 11.5, weight: 700 });
        }
        if (bubble > 0.02 && xs >= 0.97) {
          c.beginPath(); const x0 = 0.01, x1 = x0 + bubble;
          for (let x = x0; x <= x1 + 1e-6; x += 0.01) { const [px, py] = P2(...upAt(x)); x === x0 ? c.moveTo(px, py) : c.lineTo(px, py); }
          for (let x = x1; x >= x0 - 1e-6; x -= 0.01) { const q = upAt(x), hh = 0.035 * Math.sin(Math.PI * (x - x0) / (x1 - x0 || 1)) * (0.4 + bubble), [px, py] = P2(q[0], q[1] + hh); c.lineTo(px, py); }
          c.closePath(); c.save(); c.globalAlpha = 0.28; c.fillStyle = C.warn; c.fill(); c.restore(); c.strokeStyle = C.warn; c.lineWidth = 1; c.stroke();
          kit.label(c, 'separation bubble', P2(0.1, 0.12)[0], P2(0.1, 0.12)[1], { align: 'left', color: C.warn, size: 11.5, weight: 700 });
        }
        // attached streamlines over the top up to the separation point
        c.strokeStyle = C.accent; c.lineWidth = 1.2;
        for (const off of [0.035, 0.09]) {
          c.beginPath();
          const xe = Math.min(xs, 1);
          for (let x = 0; x <= xe + 1e-6; x += 0.02) { const q = upAt(x), [px, py] = P2(q[0], q[1] + off); x === 0 ? c.moveTo(px, py) : c.lineTo(px, py); }
          if (xs >= 0.97) { const [ex, ey] = P2(1, off * 0.6); c.lineTo(ex + s * 0.3, ey + (xs >= 0.97 ? 0 : -10)); }
          c.stroke();
        }
        // the airfoil
        outline(c, pts, P2); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
        // lift and drag at the quarter chord
        const [qx, qy] = P2(0.25, 0.02);
        kit.arrow(c, qx, qy, qx, qy - clamp(r.cl, -1, 2.2) * 60, stalled ? C.warn : C.ok, 3);
        kit.arrow(c, qx, qy, qx + clamp(r.cd, 0, 0.6) * 300, qy, C.bad, 2.5);
        kit.label(c, 'lift', qx + 8, qy - clamp(r.cl, -1, 2.2) * 60, { align: 'left', color: C.text, size: 12, weight: 700 });
        kit.label(c, 'drag', qx + clamp(r.cd, 0, 0.6) * 300 + 6, qy + 10, { align: 'left', color: C.text, size: 12, weight: 700 });
        kit.label(c, P.name + ' · Re = ' + (V.re >= 1e6 ? (V.re / 1e6) + ' million' : (V.re / 1000) + ' 000'), 10, 14, { align: 'left', color: C.muted, size: 12 });
        kit.label(c, 'α = ' + V.alpha.toFixed(1) + '°', 10, 32, { align: 'left', color: C.text, size: 13, weight: 700 });
        if (stalled) kit.label(c, 'STALLED', st.W - 12, 18, { align: 'right', color: C.bad, size: 14, weight: 800 });
      }, box.stage);
      setup();
      loop.start();
    }
  });

  /* ================================================================ 6. centre of pressure and aerodynamic centre */
  Hyper.sim('foil-cp-travel', {
    title: 'Centre of pressure and aerodynamic centre',
    blurb: `The same aerodynamic force described two ways. **Top:** the whole force placed where it produces no moment — the *centre of pressure*, which wanders along the chord as the angle changes. **Bottom:** the force placed at the fixed *aerodynamic centre*, near the quarter chord, plus a couple that does not change with angle. Both are exact; the second is far easier to use. Numbers from the panel method.

**Try this**
- Take the cambered 2412 and lower α towards the zero-lift angle: the centre of pressure runs back off the trailing edge and away to infinity — a pure couple has no "place".
- Raise α: it creeps forward towards the quarter chord but never reaches it.
- Choose the symmetric 0012: the centre of pressure stays put, at the aerodynamic centre, and the couple is zero.
- Move the **reference point**: about the leading edge the moment grows more nose-down with lift; about the aerodynamic centre it is flat; behind it, it grows nose-up (the unstable case for a centre of gravity).`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.54, minH: 300 });
      const gb = graphBox(box);
      const p1 = kit.plot(gb, { x: { label: 'angle of attack α (°)', min: -4, max: 14 }, y: { label: 'x_cp / c', min: 0, max: 1.2 } }, 140);
      const p2 = kit.plot(gb, { x: { label: 'angle of attack α (°)', min: -4, max: 14 }, y: { label: 'moment coefficient c_m' }, legend: true }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'foil', type: 'select', label: 'Section', options: [['NACA 2412', '2412'], ['NACA 4412', '4412'], ['NACA 6409', '6409'], ['NACA 0012 (symmetric)', '0012']], value: (params && params.foil) || '2412' },
        { id: 'alpha', label: 'Angle of attack α', min: -4, max: 14, step: 0.25, value: 4, unit: '°' },
        { id: 'xr', label: 'Reference point (e.g. the centre of gravity)', min: 0, max: 100, step: 1, value: 35, unit: '% c' },
        { id: 'sweep', type: 'check', label: 'Sweep α', value: false }
      ], () => update());
      const ro = kit.readout(box.side, [['cl', 'Lift coefficient c_l'], ['cm4', 'c_m about the quarter chord'], ['xac', 'Aerodynamic centre'], ['cmac', 'c_m,ac (constant)'], ['xcp', 'Centre of pressure'], ['cmr', 'c_m about the reference point']]);
      const V = ctl.values;
      let S = null, xac = 0.25, cmac = 0, r = null, phase = 0;
      const xcpOf = q => (Math.abs(q.cl) > 1e-4 ? xac - cmac / q.cl : NaN);
      function compute() {
        const s = parseCode(V.foil);
        S = solverFor(F, s.m / 100, (s.p || 40) / 100, s.t / 100, 50);
        const r0 = S.at(0), r1 = S.at(6 * D2R);
        const slope = (r1.cm - r0.cm) / ((r1.cl - r0.cl) || 1);
        xac = 0.25 - slope; cmac = r0.cm - slope * r0.cl;           // c_m about x_ac: c_m,c/4 + c_l (x_ac − 0.25), and x_ac − 0.25 = −slope
        r = S.at(V.alpha * D2R);
        const xr = V.xr / 100, xcp = xcpOf(r), cmr = cmac + r.cl * (xr - xac);
        ro.set('cl', r.cl.toFixed(3));
        ro.set('cm4', r.cm.toFixed(4));
        ro.set('xac', (xac * 100).toFixed(1) + ' % of the chord');
        ro.set('cmac', cmac.toFixed(4) + (Math.abs(cmac) < 0.002 ? ' (symmetric: none)' : ' (nose-down)'));
        ro.set('xcp', !Number.isFinite(xcp) || Math.abs(xcp) > 5 ? 'far away — lift is nearly zero, only the couple remains' : (xcp * 100).toFixed(1) + ' % of the chord');
        ro.set('cmr', cmr.toFixed(4) + (cmr > 0.001 ? ' (nose-up)' : cmr < -0.001 ? ' (nose-down)' : ''));
        const c1 = [], cL = [], c4 = [], cR = [];
        for (let al = -4; al <= 14.001; al += 0.5) {
          const q = S.at(al * D2R), x = xcpOf(q);
          if (Number.isFinite(x) && x > -0.2 && x < 1.4) c1.push([al, x]); else c1.push([al, NaN]);
          cL.push([al, cmac + q.cl * (0 - xac)]); c4.push([al, q.cm]); cR.push([al, cmac + q.cl * (xr - xac)]);
        }
        const C = kit.colors();
        p1.set({ series: [{ pts: c1, label: 'x_cp / c', color: C.bad }], hlines: [{ y: xac, label: 'aerodynamic centre', color: C.ok }], marks: Number.isFinite(xcp) && xcp > 0 && xcp < 1.2 ? [{ x: V.alpha, y: xcp, label: 'now' }] : [] });
        p2.set({ series: [{ pts: cL, label: 'about the leading edge', color: C.series[1] }, { pts: c4, label: 'about c/4 (≈ a.c.)', color: C.ok }, { pts: cR, label: 'about x = ' + V.xr + ' % c', color: C.accent, dash: [5, 4] }], hlines: [{ y: 0 }], vlines: [{ x: V.alpha }] });
      }
      function update() { compute(); loop.once(); }
      const loop = kit.loop((dt) => {
        if (V.sweep) {
          phase += dt / 12;
          const u = phase % 1, al = Math.round((-3 + 16 * (u < 0.5 ? 2 * u : 2 - 2 * u)) * 4) / 4;
          if (al !== V.alpha) { ctl.set('alpha', al); compute(); }
        }
        const c = st.begin(), C = kit.colors();
        if (!S || !r) return;
        const s = st.W * 0.62, ox = st.W * 0.2, a = V.alpha * D2R;
        const rows = [st.H * 0.32, st.H * 0.76];
        const xcp = xcpOf(r), Lp = clamp(r.cl, -1.2, 2) * st.H * 0.08;
        for (let k = 0; k < 2; k++) {
          const cy = rows[k], P = (x, y) => [ox + x * s, cy - y * s];
          // chord ruler
          c.strokeStyle = C.faint; c.lineWidth = 1;
          for (let i = 0; i <= 10; i++) { const [x] = P(i / 10, 0); c.beginPath(); c.moveTo(x, cy + s * 0.08); c.lineTo(x, cy + s * 0.08 + (i % 5 ? 4 : 8)); c.stroke(); }
          kit.label(c, '0', P(0, 0)[0], cy + s * 0.08 + 16, { align: 'center', color: C.muted, size: 10.5 });
          kit.label(c, '50 %', P(0.5, 0)[0], cy + s * 0.08 + 16, { align: 'center', color: C.muted, size: 10.5 });
          kit.label(c, '100 %', P(1, 0)[0], cy + s * 0.08 + 16, { align: 'center', color: C.muted, size: 10.5 });
          outline(c, S.pts, P); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.stroke();
          // free stream at α (the airfoil is drawn level)
          for (const dy of [-0.12, 0.12]) { const [x0, y0] = P(-0.1, dy), L = 36; kit.arrow(c, x0 - L * Math.cos(a), y0 + L * Math.sin(a), x0, y0, C.faint, 1.4); }
          // lift acts perpendicular to the stream
          const dir = [-Math.sin(a), Math.cos(a)];
          const ty = cy - s * 0.2;                                        // the row's caption
          if (k === 0) {
            kit.label(c, 'the resultant, placed where it gives no moment: the centre of pressure', 10, ty, { align: 'left', color: C.text, size: 12, weight: 700 });
            if (Number.isFinite(xcp) && xcp > -0.25 && xcp < 1.35) {
              const [x, y] = P(xcp, 0);
              kit.arrow(c, x, y, x + dir[0] * Lp, y - dir[1] * Lp, C.bad, 3);
              kit.dot(c, x, y, 4.5, C.bad);
              kit.label(c, '● centre of pressure at ' + (xcp * 100).toFixed(1) + ' % of the chord', 10, ty + 18, { align: 'left', color: C.bad, size: 11.5, weight: 700 });
            } else {
              kit.label(c, 'c_l ≈ 0: the centre of pressure is far off the airfoil — only a couple is left', 10, ty + 18, { align: 'left', color: C.bad, size: 11.5, weight: 700 });
            }
          } else {
            kit.label(c, 'the same force at the fixed aerodynamic centre, plus a constant couple', 10, ty, { align: 'left', color: C.text, size: 12, weight: 700 });
            const [x, y] = P(xac, 0);
            kit.arrow(c, x, y, x + dir[0] * Lp, y - dir[1] * Lp, C.ok, 3);
            kit.dot(c, x, y, 4.5, C.ok);
            if (Math.abs(cmac) > 0.002) couple(c, x, y, 16, cmac > 0 ? 1 : -1, C.ok, 2.2);
            kit.label(c, '● aerodynamic centre at ' + (xac * 100).toFixed(1) + ' %, couple c_m,ac = ' + cmac.toFixed(3), 10, ty + 18, { align: 'left', color: C.ok, size: 11.5, weight: 700 });
            // the reference point, on the chord line
            const xr = V.xr / 100, cmr = cmac + r.cl * (xr - xac), [rx, ry] = P(xr, 0);
            if (Math.abs(cmr) > 0.002) couple(c, rx, ry, 9, cmr > 0 ? 1 : -1, C.accent, 1.8);
            kit.dot(c, rx, ry, 4, C.bg2, C.accent);
            kit.label(c, '○ about ' + V.xr + ' % of the chord: c_m = ' + cmr.toFixed(3) + (cmr > 0.001 ? ' (nose-up)' : cmr < -0.001 ? ' (nose-down)' : ''), 10, cy + s * 0.08 + 34, { align: 'left', color: C.accent, size: 11.5 });
          }
        }
        kit.label(c, 'α = ' + V.alpha.toFixed(2) + '°   c_l = ' + r.cl.toFixed(2), st.W - 10, 14, { align: 'right', color: C.text, size: 12.5, weight: 700 });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ 7. flaps and slats */
  // thin-airfoil flap effectiveness τ(E) for a flap of chord fraction E; the empirical factor η falls with deflection
  const tauFlap = E => 1 - (Math.acos(2 * E - 1) - Math.sin(Math.acos(2 * E - 1))) / Math.PI;
  const FLAPS = {
    none: { E: 0.25, eta: () => 0, ext: () => 1, ds: 0 },
    plain: { E: 0.25, eta: d => Math.max(0.5, 1 - 0.016 * Math.max(0, d - 10)), ext: () => 1, ds: -0.08 },
    split: { E: 0.25, eta: d => Math.max(0.55, 1 - 0.014 * Math.max(0, d - 10)), ext: () => 1, ds: -0.08 },
    slotted: { E: 0.28, eta: d => Math.max(0.6, 1 - 0.012 * Math.max(0, d - 15)), ext: d => 1 + 0.05 * Math.min(1, d / 20), ds: -0.1 },
    fowler: { E: 0.3, eta: d => Math.max(0.55, 1 - 0.013 * Math.max(0, d - 15)), ext: d => 1 + 0.2 * Math.min(1, d / 12), ds: -0.1 }
  };
  const CLEAN = { a: 0.105, a0: -2.1, a1: 16, S1: 2, S2: 2 };
  function highLift(type, d, slat) {
    const T = FLAPS[type] || FLAPS.none, ext = T.ext(d), da0 = -tauFlap(T.E) * T.eta(d) * d;
    const P = { a: CLEAN.a * ext, a0: CLEAN.a0 + da0, a1: CLEAN.a1 + T.ds * d + (slat ? 6.5 : 0), S1: 2, S2: 2, ext, da0 };
    let best = -9, ab = 0; const curve = [];
    for (let al = -12; al <= 30.001; al += 0.25) { const cl = clSep(al, P, fSep(al, P, P.a1)); curve.push([al, cl]); if (cl > best) { best = cl; ab = al; } }
    return Object.assign(P, { clmax: best, amax: ab, curve });
  }

  Hyper.sim('foil-high-lift', {
    title: 'Flaps and slats',
    blurb: `A 12 % section (NACA 2412-like) with a trailing-edge flap and a leading-edge slat. The flap adds camber (and, for a Fowler flap, chord), which lifts the whole lift curve and moves its zero-lift angle left; the slat lets the section reach a higher angle before the nose stalls, which extends the curve upwards. The flap effect comes from thin-airfoil theory, reduced by the typical losses of real flaps at large deflections; the stall from a simple separation model.

**Try this**
- Lower a **plain** flap to 20° and then to 40°: the curve shifts up-left, the stall comes at a *lower* angle, and the second 20° buys much less than the first.
- Switch to **slotted** and **Fowler** at the same deflection: the slot keeps the flow on the flap, and the Fowler's extra chord adds area — the maximum lift climbs from about 1.6 to above 3.
- Tick the **slat** alone: the straight part does not move, but it goes on 6–7° further before stalling.
- Watch the stall-speed read-out: it falls with the square root of c_l,max.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 220 });
      const plot = kit.plot(graphBox(box), { x: { label: 'angle of attack α (°)', min: -12, max: 30 }, y: { label: 'c_l (on the retracted chord)', min: -0.6, max: 4.6 }, legend: true }, 200);
      const ctl = kit.controls(box.side, [
        { id: 'flap', type: 'select', label: 'Trailing-edge flap', options: [['None', 'none'], ['Plain flap', 'plain'], ['Split flap', 'split'], ['Slotted flap', 'slotted'], ['Fowler flap', 'fowler']], value: (params && params.flap) || 'slotted' },
        { id: 'd', label: 'Flap deflection', min: 0, max: 40, step: 1, value: (params && params.d) != null ? params.d : 25, unit: '°' },
        { id: 'slat', type: 'check', label: 'Leading-edge slat extended', value: !!(params && params.slat) },
        { id: 'alpha', label: 'Angle of attack α', min: -10, max: 28, step: 0.25, value: 6, unit: '°' }
      ], () => update());
      const ro = kit.readout(box.side, [['a0', 'Zero-lift angle α₀'], ['cl', 'c_l at this α (clean → now)'], ['max', 'c_l,max (clean → now)'], ['as', 'Stall angle (clean → now)'], ['vs', 'Stall speed'], ['ext', 'Chord']]);
      const V = ctl.values;
      const base = F.naca4(0.02, 0.4, 0.12, 60), n = (base.length - 1) / 2;
      const UP = base.slice(n), LO = base.slice(0, n + 1).reverse();     // leading edge -> trailing edge
      const at = (arr, x) => { for (let i = 1; i < arr.length; i++) if (arr[i][0] >= x) { const p = arr[i - 1], q = arr[i], t = (x - p[0]) / ((q[0] - p[0]) || 1); return [x, p[1] + (q[1] - p[1]) * t]; } return arr[arr.length - 1].slice(); };
      const cam = x => (at(UP, x)[1] + at(LO, x)[1]) / 2;
      let cfg = null, clean = null, flow = 0;
      function update() {
        clean = highLift('none', 0, false);
        cfg = highLift(V.flap, V.flap === 'none' ? 0 : V.d, V.slat);
        const C = kit.colors(), clNow = clSep(V.alpha, cfg, fSep(V.alpha, cfg, cfg.a1)), clC = clSep(V.alpha, clean, fSep(V.alpha, clean, clean.a1));
        plot.set({ series: [{ pts: clean.curve, label: 'clean', dash: [5, 4], color: C.muted }, { pts: cfg.curve, label: 'with the devices', color: C.accent }],
          marks: [{ x: V.alpha, y: clNow, label: 'now' }, { x: cfg.amax, y: cfg.clmax, label: 'c_l,max ' + cfg.clmax.toFixed(2), color: C.ok }], hlines: [{ y: 0 }] });
        ro.set('a0', (cfg.a0).toFixed(1) + '° (clean ' + clean.a0.toFixed(1) + '°)');
        ro.set('cl', clC.toFixed(2) + ' → ' + clNow.toFixed(2));
        ro.set('max', clean.clmax.toFixed(2) + ' → ' + cfg.clmax.toFixed(2) + ' (+' + (cfg.clmax - clean.clmax).toFixed(2) + ')');
        ro.set('as', clean.amax.toFixed(1) + '° → ' + cfg.amax.toFixed(1) + '°');
        const ratio = Math.sqrt(clean.clmax / cfg.clmax);
        ro.set('vs', '× ' + ratio.toFixed(2) + ' — e.g. 53 kt clean → ' + (53 * ratio).toFixed(0) + ' kt');
        ro.set('ext', cfg.ext > 1.001 ? 'extended by ' + ((cfg.ext - 1) * 100).toFixed(0) + ' % (Fowler travel)' : 'unchanged');
        loop.once();
      }
      const rot = (p, c0, ang) => { const dx = p[0] - c0[0], dy = p[1] - c0[1], c = Math.cos(ang), s = Math.sin(ang); return [c0[0] + dx * c + dy * s, c0[1] - dx * s + dy * c]; };   // positive = trailing edge down
      function geometry() {
        const type = V.flap, d = type === 'none' ? 0 : V.d * D2R, T = FLAPS[type] || FLAPS.none, xh = 1 - T.E;
        const out = { main: null, flap: null, plate: null, slat: null, slots: [] };
        // slat: the front 13 % of the upper surface and 4 % of the lower
        const xs = 0.13, xl = 0.04;
        let front;
        if (V.slat) {
          const sl = [...UP.filter(p => p[0] <= xs), at(UP, xs)].concat([at(LO, xl + 0.02), ...LO.filter(p => p[0] <= xl).reverse()]);
          const piv = at(UP, xs);
          out.slat = sl.map(p => { const q = rot(p, piv, -20 * D2R); return [q[0] - 0.045, q[1] - 0.03]; });
          // the main element gets a rounded nose behind the slat
          const nu = at(UP, xs), nl = at(LO, xl + 0.03);
          const q = [Math.min(nl[0], nu[0]) - 0.045, (nl[1] + nu[1]) / 2], nose = [];
          for (let k = 0; k <= 10; k++) { const t = k / 10, u = 1 - t; nose.push([u * u * nl[0] + 2 * u * t * q[0] + t * t * nu[0], u * u * nl[1] + 2 * u * t * q[1] + t * t * nu[1]]); }
          front = { up: UP.filter(p => p[0] > xs), lo: LO.filter(p => p[0] > xl + 0.03), nose };
          out.slots.push([[0.02, at(LO, 0.02)[1] - 0.05], [0.06, at(LO, 0.06)[1] - 0.012], [xs - 0.005, at(UP, xs - 0.005)[1] + 0.006], [xs + 0.08, at(UP, xs + 0.08)[1] + 0.016]]);
        } else front = { up: UP, lo: LO, nose: null };
        const upF = front.up, loF = front.lo;
        const H = [xh, cam(xh)];
        if (type === 'none' || type === 'plain') {
          const mainUp = upF.filter(p => p[0] <= xh), mainLo = loF.filter(p => p[0] <= xh);
          const flapUp = UP.filter(p => p[0] >= xh), flapLo = LO.filter(p => p[0] >= xh);
          const hu = at(UP, xh), hl = at(LO, xh);
          out.main = [...(front.nose || []), ...mainUp, hu, hl, ...mainLo.slice().reverse()];
          out.flap = [hu, ...flapUp, ...flapLo.slice().reverse(), hl].map(p => rot(p, H, d));
          out.hinge = [H, (hu[1] - hl[1]) / 2];
        } else if (type === 'split') {
          const hl = at(LO, xh);
          out.main = [...(front.nose || []), ...upF, [1, cam(1)], [xh + 0.05, cam(xh + 0.05) - 0.005], hl, ...loF.filter(p => p[0] <= xh).reverse()];
          const plate = LO.filter(p => p[0] >= xh);
          out.plate = [hl, ...plate].map(p => rot(p, hl, d));
        } else {
          // slotted and Fowler: a shroud on the upper surface, a cove underneath, a flap with a round nose
          const xu = xh + 0.03, xc = xh - 0.04, xn = xh - 0.02;
          const su = at(UP, xu), cl = at(LO, xc);
          out.main = [...(front.nose || []), ...upF.filter(p => p[0] <= xu), su, [xu - 0.01, cam(xu) - 0.004], [xh - 0.035, cam(xh) - 0.012], cl, ...loF.filter(p => p[0] <= xc).reverse()];
          const fu = UP.filter(p => p[0] >= xn), fl = LO.filter(p => p[0] >= xn), nu = at(UP, xn - 0.0), nl = at(LO, xn);
          const r0 = (nu[1] - nl[1]) / 2, nc = [xn, (nu[1] + nl[1]) / 2];
          const nose = []; for (let k = 1; k < 12; k++) { const ang = Math.PI / 2 + Math.PI * k / 12; nose.push([nc[0] + r0 * 0.9 * Math.cos(ang), nc[1] + r0 * Math.sin(ang)]); }
          let flap = [nu, ...fu, ...fl.slice().reverse(), nl, ...nose.reverse()];
          const travel = type === 'fowler' ? 0.2 * Math.min(1, V.d / 12) : 0.012 * Math.min(1, V.d / 10);
          const drop = type === 'fowler' ? 0.012 * Math.min(1, V.d / 12) : 0.008 * Math.min(1, V.d / 10);
          flap = flap.map(p => [p[0] + travel, p[1] - drop]);
          const piv = [xn + travel + 0.01, nc[1] - drop];
          out.flap = flap.map(p => rot(p, piv, d));
          if (V.d > 3) { const g = rot([xn + travel + 0.02, nc[1] + r0 - drop], piv, d); out.slots.push([[xh - 0.1, at(LO, xh - 0.1)[1] - 0.04], [xh - 0.03, cam(xh) - 0.03], [g[0] - 0.01, g[1] + 0.012], [g[0] + 0.12, g[1] + 0.01 - 0.12 * Math.tan(d * 0.8)]]); }
        }
        return out;
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!cfg) return;
        flow += dt;
        const s = Math.min(st.W / 1.55, st.H * 2.1), ox = st.W * 0.1, oy = st.H * 0.4, a = V.alpha * D2R;
        const P = (x, y) => [ox + x * s, oy - y * s];
        // free stream at α: the section is drawn level
        for (const dy of [-0.14, 0, 0.14]) { const [x0, y0] = P(-0.05, dy), L = 40; kit.arrow(c, x0 - L * Math.cos(a), y0 + L * Math.sin(a), x0, y0, C.faint, 1.4); }
        const g = geometry();
        const poly = (pts, fill, stroke) => { if (!pts || pts.length < 3) return; c.beginPath(); pts.forEach((p, i) => { const [x, y] = P(p[0], p[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.closePath(); c.fillStyle = fill; c.fill(); c.strokeStyle = stroke; c.lineWidth = 1.7; c.stroke(); };
        // the retracted outline, faint
        c.save(); c.setLineDash([4, 4]); outline(c, base, P); c.strokeStyle = C.faint; c.lineWidth = 1; c.stroke(); c.restore();
        poly(g.main, C.surface, C.text);
        if (g.flap) poly(g.flap, C.surface, C.accent);
        if (g.hinge) { const [hx, hy] = P(g.hinge[0][0], g.hinge[0][1]); c.beginPath(); c.arc(hx, hy, Math.max(1, g.hinge[1] * s), 0, TWO_PI); c.fillStyle = C.surface; c.fill(); }
        if (g.plate) { c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); g.plate.forEach((p, i) => { const [x, y] = P(p[0], p[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); }
        if (g.slat) poly(g.slat, C.surface, C.accent);
        // air through the slots
        for (const path of g.slots) {
          const segs = [];
          let tot = 0; for (let i = 1; i < path.length; i++) { const L = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); segs.push(L); tot += L; }
          for (let k = 0; k < 7; k++) {
            let u = ((flow * 0.35 + k / 7) % 1) * tot, i = 0;
            while (i < segs.length - 1 && u > segs[i]) { u -= segs[i]; i++; }
            const f = u / (segs[i] || 1), x = path[i][0] + (path[i + 1][0] - path[i][0]) * f, y = path[i][1] + (path[i + 1][1] - path[i][1]) * f, [px, py] = P(x, y);
            kit.dot(c, px, py, 2.4, C.series[0]);
          }
        }
        const clNow = clSep(V.alpha, cfg, fSep(V.alpha, cfg, cfg.a1));
        kit.label(c, 'α = ' + V.alpha.toFixed(1) + '°   c_l = ' + clNow.toFixed(2) + (V.alpha > cfg.amax + 0.5 ? '  (stalled)' : ''), 10, 16, { align: 'left', color: V.alpha > cfg.amax + 0.5 ? C.bad : C.text, size: 13, weight: 700 });
        const lbl = { none: 'no flap', plain: 'plain flap', split: 'split flap', slotted: 'slotted flap', fowler: 'Fowler flap' }[V.flap];
        kit.label(c, lbl + (V.flap !== 'none' ? ' ' + V.d + '°' : '') + (V.slat ? ' + slat' : ''), st.W - 10, 16, { align: 'right', color: C.accent, size: 12.5, weight: 700 });
        kit.label(c, 'dashed: the retracted section', st.W - 10, st.H - 12, { align: 'right', color: C.muted, size: 11 });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ 8. thin-airfoil theory */
  Hyper.sim('foil-thin-theory', {
    title: 'Thin-airfoil theory',
    blurb: `Thin-airfoil theory replaces the airfoil by its mean camber line carrying a sheet of vortices, of strength γ(x) per unit length, chosen so that the flow runs along the line and leaves the trailing edge smoothly. The load it carries, $\\Delta C_p = 2\\gamma/V_\\infty$, is plotted with its two parts: a **flat-plate** part $4\\alpha\\sqrt{(1-x)/x}$ that grows with the angle, and a **camber** part fixed by the shape. The dots are the panel method's $C_{p,\\ell} - C_{p,u}$ for the real, thick section.

**Try this**
- Set camber 0: only the flat-plate part is left, infinite at the nose and zero at the trailing edge; its centre of pressure is exactly at the quarter chord.
- Add camber at 0° incidence: a load with no nose spike, centred near mid-chord — the source of the nose-down pitching moment.
- Find the "ideal" angle where the nose spike vanishes (A₀ = 0): the flow meets the leading edge smoothly — what laminar and sailplane sections aim for.
- Compare with the dots: a 12 % section carries a little more load than the theory; a 3 % one almost exactly the theory's.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const plot = kit.plot(graphBox(box), { x: { label: 'x / c', min: 0, max: 1 }, y: { label: 'load ΔC_p = C_p,lower − C_p,upper', min: -0.5, max: 3 }, legend: true }, 200);
      const ctl = kit.controls(box.side, [
        { id: 'alpha', label: 'Angle of attack α', min: -4, max: 12, step: 0.25, value: 4, unit: '°' },
        { id: 'm', label: 'Camber', min: 0, max: 6, step: 0.5, value: 2, unit: '%' },
        { id: 'p', label: 'Position of max camber', min: 20, max: 60, step: 10, value: 40, unit: '% c' },
        { id: 't', label: 'Thickness (panel method only)', min: 1, max: 18, step: 1, value: 12, unit: '%' }
      ], () => update());
      const ro = kit.readout(box.side, [['A', 'Fourier coefficients A₀, A₁, A₂'], ['a0', 'Zero-lift angle α₀'], ['ai', 'Ideal angle (no nose spike)'], ['cl', 'c_l: thin theory / panel'], ['cm', 'c_m,c/4: thin theory / panel'], ['xcp', 'Centre of pressure (thin theory)']]);
      const V = ctl.values, NF = 40, NQ = 800;
      let A = [], th = null, pts = null, alpha = 0;
      function update() {
        const m = V.m / 100, p = V.p / 100;
        alpha = V.alpha * D2R;
        // Fourier coefficients of the camber-line slope
        const Bn = new Array(NF + 1).fill(0);
        for (let k = 0; k < NQ; k++) {
          const t = (k + 0.5) * Math.PI / NQ, x = 0.5 * (1 - Math.cos(t)), dz = F.nacaCamber(m, p, x)[1];
          for (let n = 0; n <= NF; n++) Bn[n] += dz * Math.cos(n * t);
        }
        A = Bn.map((b, n) => (n === 0 ? alpha - b / NQ : 2 * b / NQ));
        const ta = F.thinAirfoil(m, p);
        const clT = Math.PI * (2 * A[0] + A[1]), cmT = Math.PI / 4 * (A[2] - A[1]);
        const S = solverFor(F, m, p, V.t / 100, 50), r = S.at(alpha);
        ro.set('A', A[0].toFixed(4) + ', ' + A[1].toFixed(4) + ', ' + A[2].toFixed(4));
        ro.set('a0', (ta.alpha0 * R2D).toFixed(2) + '°');
        ro.set('ai', ((Bn[0] / NQ) * R2D).toFixed(2) + '°  (c_l,ideal = ' + (Math.PI * A[1]).toFixed(3) + ')');
        ro.set('cl', clT.toFixed(3) + ' / ' + r.cl.toFixed(3));
        ro.set('cm', cmT.toFixed(4) + ' / ' + r.cm.toFixed(4));
        ro.set('xcp', Math.abs(clT) > 0.01 ? ((0.25 - cmT / clT) * 100).toFixed(1) + ' % of the chord' : 'no lift: only a couple');
        // the load: total, flat-plate part, camber part
        const tot = [], flat = [], cam = [];
        for (let k = 1; k < 200; k++) {
          const t = k * Math.PI / 200, x = 0.5 * (1 - Math.cos(t)), lead = (1 + Math.cos(t)) / Math.sin(t);
          let sum = 0; for (let n = 1; n <= NF; n++) sum += A[n] * Math.sin(n * t);
          const T = 4 * (A[0] * lead + sum), Fp = 4 * alpha * lead;
          tot.push([x, T]); flat.push([x, Fp]); cam.push([x, T - Fp]);
        }
        // the panel method's load for the thick section: interpolate the lower surface at the upper panels' x
        const up = r.cp.filter(c => c.upper).sort((a, b) => a.x - b.x), lo = r.cp.filter(c => !c.upper).sort((a, b) => a.x - b.x);
        const loAt = x => { for (let i = 1; i < lo.length; i++) if (lo[i].x >= x) { const a = lo[i - 1], b = lo[i], f = (x - a.x) / ((b.x - a.x) || 1); return a.cp + (b.cp - a.cp) * f; } return lo[lo.length - 1].cp; };
        const pan = up.filter((c, i) => i % 2 === 0 && c.x > 0.01 && c.x < 0.99).map(c => [c.x, loAt(c.x) - c.cp]);
        const C = kit.colors();
        plot.set({ series: [{ pts: tot, label: 'thin theory', color: C.accent }, { pts: flat, label: 'flat-plate part', dash: [5, 4], color: C.series[1] }, { pts: cam, label: 'camber part', dash: [2, 3], color: C.series[2] },
          { pts: pan, label: 'panel method, ' + V.t + ' % thick', line: false, dots: 2.6, color: C.text }], hlines: [{ y: 0 }] });
        th = { tot, m, p };
        pts = S.pts;
        loop.once();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        if (!th) return;
        const s = st.W * 0.7, ox = st.W * 0.15, oy = st.H * 0.66;
        const P = (x, y) => [ox + x * s, oy - y * s];
        // the thick section, faint
        c.save(); c.setLineDash([4, 4]); outline(c, pts, P); c.strokeStyle = C.faint; c.lineWidth = 1; c.stroke(); c.restore();
        // the vortex sheet: its strength as a curtain over the mean line, and little vortices along it
        const zc = x => F.nacaCamber(th.m, th.p, x)[0];
        c.beginPath();
        th.tot.forEach((q, i) => { const [x, y] = P(q[0], zc(q[0])); i ? c.lineTo(x, y) : c.moveTo(x, y); });
        for (let i = th.tot.length - 1; i >= 0; i--) { const q = th.tot[i], h = clamp(q[1], -1, 3) * s * 0.07, [x, y] = P(q[0], zc(q[0])); c.lineTo(x, y - h); }
        c.closePath(); c.save(); c.globalAlpha = 0.25; c.fillStyle = C.accent; c.fill(); c.restore();
        c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath();
        for (let i = 0; i <= 60; i++) { const x = i / 60, [px, py] = P(x, zc(x)); i ? c.lineTo(px, py) : c.moveTo(px, py); }
        c.stroke();
        for (let k = 1; k < 12; k++) {
          const x = 0.5 * (1 - Math.cos(Math.PI * k / 12)), i = Math.min(th.tot.length - 1, Math.round(k / 12 * 200) - 1), g = th.tot[Math.max(0, i)][1];
          const [px, py] = P(x, zc(x)), r = clamp(Math.abs(g), 0.05, 2.5) * 4 + 2;
          if (Math.abs(g) > 0.02) couple(c, px, py, r, g > 0 ? -1 : 1, C.accent, 1.4);
        }
        kit.label(c, 'vortex sheet on the mean line: strength γ(x) ∝ ΔC_p', 10, 16, { align: 'left', color: C.accent, size: 12, weight: 700 });
        kit.label(c, 'α = ' + V.alpha.toFixed(2) + '°', st.W - 10, 16, { align: 'right', color: C.text, size: 13, weight: 700 });
        kit.label(c, 'free stream →', 10, st.H - 12, { align: 'left', color: C.muted, size: 11.5 });
      }, box.stage);
      update();
      loop.start();
    }
  });
})();
