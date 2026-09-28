/* HYPER-FEYNMAN · sims/least-action.js — simulations for the principle of least action (content/least-action.js).
 *   act-lifeguard       the lifeguard (or light) crossing a boundary: drag the entry point, race three runners, T(x) graph
 *   act-lens-paths      every path has an arrow: a lens that equalises the times, a mirror (covered, grating), arrows added
 *   act-ball-path       bend a thrown ball's path with the pointer; the action S = ∫(KE − PE) dt; relax to Newton's parabola
 *   act-euler-lagrange  springs, pendulums and falling balls moved by the Euler–Lagrange equation — and by the wrong sign
 *   act-variation       a bump η(t) added to a path: S(ε) has no first-order term at Newton's path (and a saddle for long trips)
 *   act-field-relax     an electrostatic potential relaxing to the least field energy between conductors; C from the energy
 *   act-many-paths      many trial paths, each with an arrow turned by S/ħ, added head to tail
 *   act-path-sum        the sum over histories through a screen at mid-time: the Cornu spiral, slits and diffraction
 *   act-hbar-limit      a slider for ħ: the band of paths whose arrows count, for an electron, a molecule, a ball
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fam = () => ((typeof getComputedStyle === 'function' && document.body && getComputedStyle(document.body).fontFamily) || 'sans-serif');
  const font = (c, size, weight) => { c.font = (weight || 500) + ' ' + size + 'px ' + fam(); };
  // a div under the stage for a kit.plot
  function plotHost(box) { const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb); return gb; }
  // a uniform fit of a W0 × H0 design onto the stage
  function fit(st, W0, H0) { const s = Math.min(st.W / W0, st.H / H0); return { s, ox: (st.W - W0 * s) / 2, oy: (st.H - H0 * s) / 2 }; }
  const toDesign = (f, p) => ({ x: (p.x - f.ox) / f.s, y: (p.y - f.oy) / f.s });
  // colour of an arrow by its angle
  const phaseHue = ph => ((ph / TAU) % 1 + 1) % 1 * 360;
  // the arrows of a chain [[x, y], …] drawn head to tail, fitted in a square box (centre cx, cy, half-size hs), with the total
  function drawChain(c, kit, C, chain, cx, cy, hs, o) {
    o = o || {};
    c.save();
    c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(cx - hs, cy - hs, 2 * hs, 2 * hs);
    if (o.title) kit.label(c, o.title, cx, cy - hs - 10, { align: 'center', size: 12, color: C.muted });
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const p of chain) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
    const ext = Math.max(x1 - x0, y1 - y0, o.minExt || 1e-9);
    const k = Math.min(1.7 * hs / ext, o.maxScale || Infinity), mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    const P = p => [cx + (p[0] - mx) * k, cy - (p[1] - my) * k];
    const n = chain.length - 1, every = Math.max(1, Math.round(n / 28));
    for (let i = 0; i < n; i++) {
      const a = P(chain[i]), b = P(chain[i + 1]);
      const col = o.color ? o.color(i) : kit.hue(o.hue ? o.hue(i) : 210, 0.95);
      if (i % every === 0 && n <= 60) kit.arrow(c, a[0], a[1], b[0], b[1], col, 1.6, 6);
      else { c.strokeStyle = col; c.lineWidth = 1.6; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
    }
    const a = P(chain[0]), b = P(chain[n]);
    kit.arrow(c, a[0], a[1], b[0], b[1], C.text, 3, 11);
    kit.dot(c, a[0], a[1], 3, C.text);
    c.restore();
    return k;
  }

  /* ================================================================ act-lifeguard */
  Hyper.sim('act-lifeguard', {
    title: 'The lifeguard and the light: least time',
    blurb: `A lifeguard on the sand must reach a swimmer in the water. She runs faster than she swims, so the straight line is not the quickest way: it is better to run further along the shore and swim less. Drag the **entry point** along the shoreline (or drag the lifeguard and the swimmer); the graph shows the total time for every possible entry point, with your choice marked.

**Try this**
- Find the quickest entry point by dragging, then press *Jump to the best point* to check. Notice how flat the graph is at the bottom: a metre either side changes the time very little — the time is [[?stationary]] there.
- Read the angles: at the best point sin θ₁/v₁ equals sin θ₂/v₂ exactly.
- Press *Race three runners*: your path, the straight line and the quickest path set off together.
- Make the two speeds equal: the quickest path becomes the straight line. Make swimming very slow: the best entry point moves towards the point opposite the swimmer.
- Switch to **light** going from air into glass: the rule becomes Snell's law, n₁ sin θ₁ = n₂ sin θ₂, and the times are in nanoseconds.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 260 });
      const gb = plotHost(box);
      const X0 = -8, X1 = 52, YH = 26;
      const A = { x: 0, y: -20 }, B = { x: 40, y: 20 }, P = { x: 20 };
      let race = null, runners = null, map = { s: 1, ox: 0, oy: 0 }, dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Who crosses the boundary', options: [['A lifeguard: sand, then water', 'guard'], ['Light: air, then glass', 'light']], value: 'guard' },
        { id: 'v1', label: 'Running speed on the sand', min: 1, max: 10, step: 0.1, value: 6, unit: 'm/s' },
        { id: 'v2', label: 'Swimming speed', min: 0.5, max: 10, step: 0.1, value: 1.5, unit: 'm/s' },
        { id: 'n2', label: 'Refractive index of the glass', min: 1, max: 2.5, step: 0.01, value: 1.5 },
        { type: 'buttons', items: [{ id: 'race', label: 'Race three runners', primary: true }, { id: 'best', label: 'Jump to the best point' }] }
      ], id => {
        if (id === 'mode') modeUI();
        if (id === 'best') P.x = best();
        if (id === 'race') startRace(); else if (id !== 'best') race = null;
        dirty = true;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['you', 'Your path'], ['best', 'Quickest path'], ['line', 'Straight line'], ['swim', 'Least time in the slow part'], ['ang', 'Angles θ₁ / θ₂'], ['rule', 'The rule'], ['race', 'Race']]);
      const plot = kit.plot(gb, { x: { label: 'entry point along the shore (m)', min: X0, max: X1 }, y: { label: 'time (s)' }, legend: false }, 150);
      const light = () => V.mode === 'light';
      // speeds: lifeguard in m/s; light in "cm of vacuum per cm" (1 in air, 1/n in glass), turned into ns by K
      const spd = () => light() ? [1, 1 / V.n2] : [V.v1, V.v2];
      const K = () => light() ? 0.01 / 299792458 * 1e9 : 1;
      const legs = x => { const [u1, u2] = spd(), L1 = Math.hypot(x - A.x, A.y), L2 = Math.hypot(B.x - x, B.y); return { x, L1, L2, t1: L1 / u1, t2: L2 / u2 }; };
      const time = x => { const g = legs(x); return K() * (g.t1 + g.t2); };
      function best() { let lo = Math.min(A.x, B.x) - 1, hi = Math.max(A.x, B.x) + 1; for (let i = 0; i < 90; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (time(m1) < time(m2)) hi = m2; else lo = m1; } return (lo + hi) / 2; }
      const lineX = () => A.x + (B.x - A.x) * (-A.y) / (B.y - A.y);
      const fmtT = t => light() ? t.toFixed(3) + ' ns' : t.toFixed(2) + ' s';
      function modeUI() { ctl.show('v1', !light()); ctl.show('v2', !light()); ctl.show('n2', light()); }
      modeUI();
      function startRace() {
        const xb = best();
        runners = [{ g: legs(P.x), name: 'you', col: 'accent' }, { g: legs(lineX()), name: 'straight', col: 'faint' }, { g: legs(xb), name: 'quickest', col: 'ok' }];
        race = 0;
      }
      function posAt(g, tau) {
        if (tau <= g.t1) { const f = g.t1 > 0 ? tau / g.t1 : 1; return [A.x + (g.x - A.x) * f, A.y * (1 - f)]; }
        const f = Math.min(1, g.t2 > 0 ? (tau - g.t1) / g.t2 : 1);
        return [g.x + (B.x - g.x) * f, B.y * f];
      }
      function update() {
        const xb = best(), tb = time(xb), ty = time(P.x), g = legs(P.x);
        const s1 = (P.x - A.x) / g.L1, s2 = (B.x - P.x) / g.L2, [u1, u2] = spd();
        ro.set('you', fmtT(ty) + (ty - tb > 1e-9 ? '  (+' + fmtT(ty - tb) + ')' : ''));
        ro.set('best', fmtT(tb) + ', entry at ' + xb.toFixed(1) + (light() ? ' cm' : ' m'));
        ro.set('line', fmtT(time(lineX())));
        ro.set('swim', fmtT(time(B.x)));
        ro.set('ang', (Math.asin(clamp(Math.abs(s1), 0, 1)) * 180 / Math.PI).toFixed(1) + '° / ' + (Math.asin(clamp(Math.abs(s2), 0, 1)) * 180 / Math.PI).toFixed(1) + '°');
        if (light()) ro.set('rule', 'n₁ sin θ₁ = ' + s1.toFixed(3) + ',  n₂ sin θ₂ = ' + (V.n2 * s2).toFixed(3));
        else ro.set('rule', 'sin θ₁/v₁ = ' + (s1 / u1).toFixed(4) + ',  sin θ₂/v₂ = ' + (s2 / u2).toFixed(4) + ' s/m');
        const pts = []; for (let i = 0; i <= 120; i++) { const x = X0 + (X1 - X0) * i / 120; pts.push([x, time(x)]); }
        plot.set({ series: [{ pts, label: 'total time' }], x: { label: light() ? 'where the light enters the glass (cm along the surface)' : 'entry point along the shore (m)', min: X0, max: X1 },
          y: { label: light() ? 'time (ns)' : 'time (s)' }, marks: [{ x: P.x, y: ty, label: 'yours' }], vlines: [{ x: xb, label: 'quickest' }] });
      }
      kit.drag(st, {
        hover: true,
        hit(p) {
          const X = x => map.ox + x * map.s, Y = y => map.oy + y * map.s;
          if (Math.hypot(p.x - X(A.x), p.y - Y(A.y)) < 16) return 'A';
          if (Math.hypot(p.x - X(B.x), p.y - Y(B.y)) < 16) return 'B';
          if (Math.abs(p.y - map.oy) < 16) return 'P';
          return null;
        },
        move(k, p) {
          const x = (p.x - map.ox) / map.s, y = (p.y - map.oy) / map.s;
          if (k === 'P') P.x = clamp(x, X0, X1);
          else if (k === 'A') { A.x = clamp(x, X0 + 1, X1 - 1); A.y = clamp(y, -YH + 2, -3); }
          else { B.x = clamp(x, X0 + 1, X1 - 1); B.y = clamp(y, 3, YH - 2); }
          race = null; dirty = true;
        }
      });
      const loop = kit.loop(dt => {
        if (dirty) { update(); dirty = false; }
        const c = st.begin(), C = kit.colors();
        const s = Math.min((st.W - 16) / (X1 - X0), (st.H - 16) / (2 * YH)), ox = (st.W - (X1 - X0) * s) / 2 - X0 * s, oy = st.H / 2;
        map = { s, ox, oy };
        const X = x => ox + x * s, Y = y => oy + y * s;
        // the two regions
        c.fillStyle = light() ? kit.hue(55, 0.07) : kit.hue(42, 0.2); c.fillRect(0, 0, st.W, oy);
        c.fillStyle = light() ? kit.hue(195, 0.18) : kit.hue(205, 0.22); c.fillRect(0, oy, st.W, st.H - oy);
        if (!light()) { c.strokeStyle = kit.hue(205, 0.35); c.lineWidth = 1; for (let k = 1; k < 5; k++) { c.beginPath(); for (let x = 0; x <= st.W; x += 8) { const yy = oy + k * (st.H - oy) / 5 + 2 * Math.sin(x / 14 + k); if (x === 0) c.moveTo(x, yy); else c.lineTo(x, yy); } c.stroke(); } }
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(0, oy); c.lineTo(st.W, oy); c.stroke();
        kit.label(c, light() ? 'air  (n₁ = 1)' : 'sand  (v₁ = ' + V.v1.toFixed(1) + ' m/s)', 10, 14, { color: C.muted, size: 12 });
        kit.label(c, light() ? 'glass  (n₂ = ' + V.n2.toFixed(2) + ')' : 'water  (v₂ = ' + V.v2.toFixed(1) + ' m/s)', 10, st.H - 14, { color: C.muted, size: 12 });
        // the other paths
        const xb = best(), xl = lineX();
        c.setLineDash([2, 4]); c.strokeStyle = C.faint; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(X(A.x), Y(A.y)); c.lineTo(X(B.x), Y(B.y)); c.stroke();
        c.setLineDash([7, 5]); c.strokeStyle = C.ok; c.lineWidth = 2;
        c.beginPath(); c.moveTo(X(A.x), Y(A.y)); c.lineTo(X(xb), oy); c.lineTo(X(B.x), Y(B.y)); c.stroke();
        c.setLineDash([]);
        // your path, the normal and the angles
        c.strokeStyle = C.accent; c.lineWidth = 3;
        c.beginPath(); c.moveTo(X(A.x), Y(A.y)); c.lineTo(X(P.x), oy); c.lineTo(X(B.x), Y(B.y)); c.stroke();
        c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(X(P.x), oy - 70); c.lineTo(X(P.x), oy + 70); c.stroke(); c.setLineDash([]);
        const a1 = Math.atan2(Y(A.y) - oy, X(A.x) - X(P.x)), a2 = Math.atan2(Y(B.y) - oy, X(B.x) - X(P.x)), r = 34;
        c.strokeStyle = C.warn; c.lineWidth = 2;
        c.beginPath(); c.arc(X(P.x), oy, r, Math.min(a1, -Math.PI / 2), Math.max(a1, -Math.PI / 2)); c.stroke();
        c.beginPath(); c.arc(X(P.x), oy, r, Math.min(a2, Math.PI / 2), Math.max(a2, Math.PI / 2)); c.stroke();
        const g = legs(P.x), th1 = Math.asin(clamp(Math.abs(P.x - A.x) / g.L1, 0, 1)) * 180 / Math.PI, th2 = Math.asin(clamp(Math.abs(B.x - P.x) / g.L2, 0, 1)) * 180 / Math.PI;
        kit.label(c, 'θ₁ ' + th1.toFixed(0) + '°', X(P.x) + (P.x > A.x ? -r - 6 : r + 6), oy - r - 4, { color: C.warn, size: 12, align: P.x > A.x ? 'right' : 'left', weight: 600 });
        kit.label(c, 'θ₂ ' + th2.toFixed(0) + '°', X(P.x) + (B.x > P.x ? r + 6 : -r - 6), oy + r + 6, { color: C.warn, size: 12, align: B.x > P.x ? 'left' : 'right', weight: 600 });
        // people (or lamp and detector)
        kit.dot(c, X(A.x), Y(A.y), 8, C.accent, C.text);
        kit.label(c, light() ? 'lamp' : 'lifeguard', X(A.x), Y(A.y) - 17, { align: 'center', size: 12, weight: 600 });
        kit.dot(c, X(B.x), Y(B.y), 8, C.bad, C.text);
        kit.label(c, light() ? 'detector' : 'swimmer', X(B.x), Y(B.y) + 18, { align: 'center', size: 12, weight: 600 });
        kit.dot(c, X(P.x), oy, 7, C.surface || C.bg2, C.accent);
        kit.label(c, 'drag', X(P.x), oy - 12, { align: 'center', size: 10.5, color: C.muted });
        // scale bar
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(st.W - 20 - 10 * s, 26); c.lineTo(st.W - 20, 26); c.stroke();
        kit.label(c, light() ? '10 cm' : '10 m', st.W - 20 - 5 * s, 14, { align: 'center', size: 11, color: C.muted });
        // the race
        if (race != null && runners) {
          race += dt;
          const Tmax = Math.max(...runners.map(q => q.g.t1 + q.g.t2)), tau = Math.min(race, 5) / 5 * Tmax;
          runners.forEach((q, i) => {
            const [x, y] = posAt(q.g, tau), col = C[q.col] || C.text;
            kit.dot(c, X(x), Y(y), 6, col, C.text);
            kit.label(c, q.name, X(x) + 9, Y(y) - 9 - 11 * i, { size: 11, color: col, weight: 600 });
          });
          const order = runners.map(q => ({ n: q.name, t: K() * (q.g.t1 + q.g.t2) })).sort((a, b) => a.t - b.t);
          ro.set('race', race < 5 ? 'running… ' + fmtT(K() * tau) : order.map(o => o.n + ' ' + fmtT(o.t)).join(', '));
        } else ro.set('race', 'press Race');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ act-lens-paths */
  Hyper.sim('act-lens-paths', {
    title: 'Every path has an arrow: a lens and a mirror',
    blurb: `Light from the source can reach the detector by many paths — through every point of the lens, or off every point of the mirror. Each path gets an arrow that turns once for every period of the light's travel time (QED's stopwatch); the paths are coloured by their arrow's direction. In the box the arrows are added head to tail, and the square of the total gives the brightness. The graph shows each path's travel time, in periods of the light, against where it crosses the lens or the mirror.

**Try this**
- **Lens**: with the detector at the focus, the glass — thick in the middle, thin at the edge — makes every path take the same time. All the arrows point the same way and the total is as long as it can be.
- Untick *Glass in the lens*: the middle paths are now quicker, the arrows curl round and the total shrinks. Drag the detector off the focus: the same happens.
- **Mirror**: the paths near the point of equal angles take nearly the same time (the flat bottom of the time graph); their arrows line up. Paths near the ends change time quickly, and their arrows curl into tight spirals that add up to almost nothing.
- Cover the centre of the mirror: almost no light reaches the detector. Keep only the centre: nearly as much as the whole mirror.
- Choose the grating: with strips scraped off, the arrows that were cancelling are removed. Drag the detector sideways, far from the equal-angle direction, and find where the light now arrives.`,
    mount(box, kit, params) {
      const Q = kit.qm;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 260 });
      const gb = plotHost(box);
      const W0 = 660, H0 = 340, N = 480, NG = 1.5;
      // the lens: source S, lens plane LX (aperture ± HA about the axis), design focus F
      const S = { x: 30, y: 170 }, LX = 230, HA = 70, F = { x: 430, y: 170 };
      // the mirror: along y = MY from MX0 to MX1; source MS; the equal-angle point for the home detector is at x = 230
      const MY = 318, MX0 = 16, MX1 = 444, MS = { x: 70, y: 110 };
      const D = { x: F.x, y: F.y };
      let f = { s: 1, ox: 0, oy: 0 }, dirty = true, R = null;
      const geo = (y, d) => Math.hypot(LX - S.x, y - S.y) + Math.hypot(d.x - LX, d.y - y);
      const Ledge = geo(F.y + HA, F);
      const thick = y => Math.max(0, (Ledge - geo(y, F)) / (NG - 1));
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['A lens', 'lens'], ['A mirror', 'mirror']], value: params && params.mode === 'mirror' ? 'mirror' : 'lens' },
        { id: 'lam', label: 'Wavelength (drawn greatly enlarged)', min: 4, max: 30, step: 1, value: 10, unit: 'px' },
        { id: 'glass', type: 'check', label: 'Glass in the lens', value: true },
        { id: 'part', type: 'select', label: 'Mirror', options: [['The whole mirror', 'whole'], ['Centre covered', 'ends'], ['Only the centre', 'centre'], ['A grating: strips scraped off', 'grating']], value: 'whole' },
        { id: 'period', label: 'Grating: strip spacing', min: 8, max: 60, step: 1, value: 20, unit: 'px' },
        { type: 'buttons', items: [{ id: 'home', label: 'Put the detector back', primary: true }] }
      ], id => { if (id === 'mode') { modeUI(); home(); } if (id === 'home') home(); dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['I', 'Light at the detector'], ['sp', 'Spread of path times'], ['n', 'Paths added'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'where the path crosses (px)' }, y: { label: 'travel time − quickest (periods)', min: 0 }, legend: true }, 150);
      const lens = () => V.mode !== 'mirror';
      function home() { if (lens()) { D.x = F.x; D.y = F.y; } else { D.x = 2 * 230 - MS.x; D.y = MS.y; } }
      function modeUI() { ctl.show('glass', lens()); ctl.show('part', !lens()); ctl.show('period', !lens()); }
      modeUI(); home();
      const kept = x => {
        const p = V.part;
        if (p === 'ends') return Math.abs(x - 230) > 60;
        if (p === 'centre') return Math.abs(x - 230) <= 60;
        if (p === 'grating') return Math.floor((x - MX0) / (V.period / 2)) % 2 === 0;
        return true;
      };
      function compute() {
        const lam = V.lam;
        if (lens()) {
          const pts = [];
          for (let i = 0; i < N; i++) {
            const y = F.y - HA + 2 * HA * (i + 0.5) / N, L = geo(y, D) + (V.glass ? (NG - 1) * thick(y) : 0);
            pts.push({ at: y, L, phase: TAU * L / lam, z: Q.scale(Q.expi(TAU * L / lam), 1 / N), on: true });
          }
          const s = Q.arrowSum(pts.map(p => p.z));
          R = { pts, sum: s, ref: 1 };
        } else {
          const m = Q.mirrorPaths({ src: [MS.x, MS.y], det: [D.x, D.y], y: MY, x0: MX0, x1: MX1, n: N, lambda: lam });
          const pts = m.pts.map(p => ({ at: p.x, L: p.L, phase: p.phase, z: p.z, on: kept(p.x) }));
          const s = Q.arrowSum(pts.filter(p => p.on).map(p => p.z));
          // the whole mirror with the detector at its home place, for the scale of brightness
          const ref = Q.mirrorPaths({ src: [MS.x, MS.y], det: [2 * 230 - MS.x, MS.y], y: MY, x0: MX0, x1: MX1, n: N, lambda: lam });
          R = { pts, sum: s, ref: Math.max(1e-12, Q.abs2(ref.total)) };
        }
        const on = R.pts.filter(p => p.on), Lmin = Math.min(...on.map(p => p.L)), Lmax = Math.max(...on.map(p => p.L));
        const I = Q.abs2(R.sum.total) / R.ref;
        ro.set('I', lens() ? (100 * I).toFixed(1) + ' % of all arrows in line' : I.toFixed(2) + ' × the whole mirror');
        ro.set('sp', ((Lmax - Lmin) / lam).toFixed(1) + ' periods');
        ro.set('n', on.length + ' of ' + N);
        ro.set('msg', lens() ? (I > 0.9 ? 'All the paths take the same time: a focus.' : 'The arrows curl round: little light.') : V.part === 'grating' ? 'Look for light away from the equal-angle direction.' : '');
        const L0 = Math.min(...R.pts.map(q => q.L));
        const ser = [{ pts: R.pts.map(p => [p.at, (p.L - L0) / lam]), label: 'travel time of each path', width: 1.8 }];
        if (on.length < R.pts.length) ser.push({ pts: on.map(p => [p.at, (p.L - L0) / lam]), label: 'paths still open', line: false, dots: 1.8 });
        plot.set({ series: ser, x: { label: lens() ? 'height where the path crosses the lens (px)' : 'where the path meets the mirror (px)' }, hlines: [{ y: 0.5, label: 'half a period: the arrow reversed' }] });
      }
      kit.drag(st, {
        hover: true,
        hit(p) { const q = toDesign(f, p); return Math.hypot(q.x - D.x, q.y - D.y) < 20 ? 'D' : null; },
        move(k, p) {
          const q = toDesign(f, p);
          if (lens()) { D.x = clamp(q.x, 300, 450); D.y = clamp(q.y, 40, 300); }
          else { D.x = clamp(q.x, 120, 450); D.y = clamp(q.y, 40, 260); }
          dirty = true;
        }
      });
      const loop = kit.loop(() => {
        if (dirty) { compute(); dirty = false; }
        const c = st.begin(), C = kit.colors();
        f = fit(st, W0, H0);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s);
        const every = Math.round(N / 24);
        if (lens()) {
          // the lens: glass whose thickness makes every path to the focus take the same time
          c.beginPath();
          for (let i = 0; i <= 60; i++) { const y = F.y - HA + 2 * HA * i / 60; c.lineTo(LX - thick(y) / 2, y); }
          for (let i = 60; i >= 0; i--) { const y = F.y - HA + 2 * HA * i / 60; c.lineTo(LX + thick(y) / 2, y); }
          c.closePath();
          if (V.glass) { c.fillStyle = kit.hue(195, 0.25); c.fill(); c.strokeStyle = kit.hue(195, 0.8); c.lineWidth = 1.5; c.stroke(); }
          else { c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.stroke(); c.setLineDash([]); }
          c.fillStyle = C.text; c.fillRect(LX - 1, F.y - HA - 26, 2, 22); c.fillRect(LX - 1, F.y + HA + 4, 2, 22);
          for (let i = 0; i < N; i += every) { const p = R.pts[i + (every >> 1)] || R.pts[i]; c.strokeStyle = kit.hue(phaseHue(p.phase), 0.6); c.lineWidth = 1.2; c.beginPath(); c.moveTo(S.x, S.y); c.lineTo(LX, p.at); c.lineTo(D.x, D.y); c.stroke(); }
          c.strokeStyle = C.faint; c.setLineDash([3, 5]); c.beginPath(); c.moveTo(10, F.y); c.lineTo(450, F.y); c.stroke(); c.setLineDash([]);
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(F.x - 6, F.y - 6); c.lineTo(F.x + 6, F.y + 6); c.moveTo(F.x - 6, F.y + 6); c.lineTo(F.x + 6, F.y - 6); c.stroke();
          kit.label(c, 'focus', F.x, F.y + 20, { align: 'center', size: 11, color: C.muted });
          kit.label(c, V.glass ? 'glass (n = 1.5)' : 'no glass', LX, F.y - HA - 36, { align: 'center', size: 12, color: C.muted });
          kit.dot(c, S.x, S.y, 6, C.warn, C.text); kit.label(c, 'source', S.x, S.y - 16, { align: 'center', size: 12, weight: 600 });
        } else {
          // the mirror, as it is: whole, covered, or scraped into a grating
          c.fillStyle = C.faint; c.fillRect(MX0, MY, MX1 - MX0, 3);
          const pw = (MX1 - MX0) / N;
          c.fillStyle = C.text;
          for (const p of R.pts) if (p.on) c.fillRect(p.at - pw / 2, MY - 2, pw + 0.3, 5);
          if (V.part === 'ends') { c.fillStyle = C.muted; c.fillRect(170, MY - 8, 120, 10); kit.label(c, 'covered', 230, MY + 16, { align: 'center', size: 11, color: C.muted }); }
          for (let i = 0; i < N; i += every) { const p = R.pts[i + (every >> 1)] || R.pts[i]; if (!p.on) continue; c.strokeStyle = kit.hue(phaseHue(p.phase), 0.6); c.lineWidth = 1.2; c.beginPath(); c.moveTo(MS.x, MS.y); c.lineTo(p.at, MY); c.lineTo(D.x, D.y); c.stroke(); }
          c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(230, MY); c.lineTo(230, MY - 60); c.stroke(); c.setLineDash([]);
          kit.label(c, 'mirror', MX1 - 4, MY + 16, { align: 'right', size: 12, color: C.muted });
          c.fillStyle = C.muted; c.fillRect(MS.x + 16, MS.y - 8, 6, 60);
          kit.label(c, 'screen', MS.x + 28, MS.y + 44, { size: 10.5, color: C.muted });
          kit.dot(c, MS.x, MS.y, 6, C.warn, C.text); kit.label(c, 'source', MS.x, MS.y - 16, { align: 'center', size: 12, weight: 600 });
        }
        kit.dot(c, D.x, D.y, 7, C.accent, C.text);
        kit.label(c, 'detector (drag)', D.x, D.y - 17, { align: 'center', size: 12, weight: 600 });
        // the arrows added head to tail, in path order
        const on = R.pts.filter(p => p.on);
        if (on.length) drawChain(c, kit, C, R.sum.chain, 560, 170, 88, { title: 'the arrows added', hue: i => phaseHue(on[i].phase) });
        kit.label(c, 'total² = ' + (Q.abs2(R.sum.total) / R.ref).toFixed(2) + (lens() ? '' : ' (whole mirror = 1)'), 560, 276, { align: 'center', size: 12 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ act-ball-path */
  Hyper.sim('act-ball-path', {
    title: 'Bend the path: the action of a thrown ball',
    blurb: `A ball leaves the ground at t = 0 and must be caught at a given height a fixed time later. The big graph is its height against time — the ball's whole history as one curve. **Drag the curve** with the pointer to try any history you like; for each one the [[?action]] $S = \\int(\\mathrm{KE} - \\mathrm{PE})\\,dt$ is computed along it. The small column on the left replays the motion your curve describes.

**Try this**
- Start from the straight line (the ball creeping steadily along the ground): S = 0. Pull the middle up: S goes negative — a better path. Pull it too high: S rises again.
- Press *Relax to least action*: every piece of the path moves to lower S, and the curve settles on Newton's parabola (dashed), where S is least.
- Add any bump to Newton's path: the read-out *extra action* always equals ½m∫η̇² dt, and is never negative.
- Watch the graph below: along Newton's path, KE − PE is a smooth curve. Along a wiggly path the kinetic energy spikes where the wiggles are steep.
- Change the time in the air or go to the Moon: the parabola changes, and S with it (as T³ and g²).`,
    mount(box, kit) {
      const Q = kit.qm;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 260 });
      const gb = plotHost(box);
      const n = 96;
      let xs = [], newton = [], relax = false, anim = 0, grab = null, dirty = true, seed = 7;
      let box2 = { x0: 90, x1: 600, y0: 20, y1: 300, lo: -1, hi: 10 };
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Mass', min: 0.1, max: 2, step: 0.05, value: 1, unit: 'kg' },
        { id: 'T', label: 'Time in the air', min: 0.6, max: 3, step: 0.1, value: 2, unit: 's' },
        { id: 'y1', label: 'Height of the catch', min: -1, max: 5, step: 0.1, value: 0, unit: 'm' },
        { id: 'g', type: 'select', label: 'Gravity', options: [['Earth, 9.81 m/s²', 9.81], ['Moon, 1.62 m/s²', 1.62], ['Mars, 3.71 m/s²', 3.71]], value: 9.81 },
        { id: 'ghost', type: 'check', label: 'Show Newton\'s path', value: true },
        { type: 'buttons', items: [{ id: 'relax', label: 'Relax to least action', primary: true }, { id: 'straight', label: 'Straight line' }, { id: 'wiggle', label: 'Random wiggle' }] }
      ], id => {
        if (id === 'relax') { relax = true; return; }
        relax = false;
        if (id === 'straight') straight();
        else if (id === 'wiggle') wiggle();
        else if (id === 'T' || id === 'y1' || id === 'g') rebuild();
        dirty = true;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['S', 'Action of your path'], ['Sn', 'Action of Newton\'s path'], ['dS', 'Extra action'], ['eta', '½m∫η̇² dt'], ['pk', 'Highest point: yours / Newton\'s']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)', min: 0 }, y: { label: 'energy (J)' }, legend: true }, 160);
      const dt = () => V.T / n;
      const Lag = (x, v) => 0.5 * V.m * v * v - V.m * V.g * x;
      function straight() { xs = []; for (let i = 0; i <= n; i++) xs.push(V.y1 * i / n); }
      function wiggle() {
        const R = Q.rng(seed++), pk = V.g * V.T * V.T / 8;
        xs = newton.map((y, i) => { let s = 0; for (let k = 1; k <= 5; k++) s += (R() - 0.5) * 0.8 * pk / k * Math.sin(k * Math.PI * i / n); return y + s; });
        clampPath();
      }
      function rebuild() {
        newton = Q.stationaryPath({ x0: 0, x1: V.y1, T: V.T, n, m: V.m, dV: () => V.m * V.g, iters: 25000 });
        const pk = Math.max(...newton);
        box2.hi = Math.max(2 * pk + 0.6, V.y1 + 1.2, 1.5); box2.lo = Math.min(-0.25 * box2.hi, V.y1 - 0.8);
        straight();
      }
      function clampPath() { for (let i = 1; i < n; i++) xs[i] = clamp(xs[i], box2.lo, box2.hi); xs[0] = 0; xs[n] = V.y1; }
      rebuild();
      const tX = t => box2.x0 + (box2.x1 - box2.x0) * t / V.T, yY = y => box2.y1 - (box2.y1 - box2.y0) * (y - box2.lo) / (box2.hi - box2.lo);
      function update() {
        const S = Q.action(xs, dt(), Lag), Sn = Q.action(newton, dt(), Lag);
        let e2 = 0; for (let i = 0; i < n; i++) { const d = (xs[i + 1] - newton[i + 1]) - (xs[i] - newton[i]); e2 += d * d / dt(); }
        ro.set('S', S.toFixed(2) + ' J·s'); ro.set('Sn', Sn.toFixed(2) + ' J·s');
        ro.set('dS', '+' + Math.max(0, S - Sn).toFixed(3) + ' J·s'); ro.set('eta', (0.5 * V.m * e2).toFixed(3) + ' J·s');
        ro.set('pk', Math.max(...xs).toFixed(2) + ' m / ' + Math.max(...newton).toFixed(2) + ' m');
        const ke = [], pe = [], L = [], Ln = [];
        for (let i = 0; i < n; i++) {
          const t = (i + 0.5) * dt(), v = (xs[i + 1] - xs[i]) / dt(), y = (xs[i] + xs[i + 1]) / 2, vn = (newton[i + 1] - newton[i]) / dt(), yn = (newton[i] + newton[i + 1]) / 2;
          ke.push([t, 0.5 * V.m * v * v]); pe.push([t, V.m * V.g * y]); L.push([t, 0.5 * V.m * v * v - V.m * V.g * y]); Ln.push([t, 0.5 * V.m * vn * vn - V.m * V.g * yn]);
        }
        const ser = [{ pts: ke, label: 'KE' }, { pts: pe, label: 'PE' }, { pts: L, label: 'KE − PE (yours)', width: 2.6 }];
        if (V.ghost) ser.push({ pts: Ln, label: 'KE − PE (Newton)', dash: [5, 4], width: 1.6 });
        plot.set({ series: ser, x: { label: 'time (s)', min: 0, max: V.T } });
      }
      kit.drag(st, {
        hover: true,
        hit(p) { return p.x > box2.x0 - 10 && p.x < box2.x1 + 10 && p.y > box2.y0 - 10 && p.y < box2.y1 + 10 ? 'path' : null; },
        start(k, p) { grab = clamp(Math.round((p.x - box2.x0) / (box2.x1 - box2.x0) * n), 1, n - 1); relax = false; },
        move(k, p) {
          if (grab == null) return;
          const y = box2.lo + (box2.y1 - p.y) / (box2.y1 - box2.y0) * (box2.hi - box2.lo), d = y - xs[grab], w = n / 9;
          for (let i = 1; i < n; i++) xs[i] += d * Math.exp(-Math.pow((i - grab) / w, 2)) * Math.sin(Math.PI * i / n) / Math.max(0.05, Math.sin(Math.PI * grab / n));
          xs[grab] = y; clampPath(); dirty = true;
        },
        end() { grab = null; }
      });
      const loop = kit.loop(dtf => {
        if (relax) {
          // over-relaxed sweeps of the discrete Euler–Lagrange equation: each one lowers S
          const h = dt(), w = 1.8; let ch = 0;
          for (let s = 0; s < 4; s++) for (let i = 1; i < n; i++) { const t = (xs[i - 1] + xs[i + 1]) / 2 + V.g * h * h / 2, d = w * (t - xs[i]); xs[i] += d; ch = Math.max(ch, Math.abs(d)); }
          if (ch < 1e-7) relax = false;
          dirty = true;
        }
        if (dirty) { update(); dirty = false; }
        anim = (anim + dtf) % (V.T + 0.8);
        const c = st.begin(), C = kit.colors();
        box2 = Object.assign(box2, { x0: 96, x1: st.W - 24, y0: 22, y1: st.H - 34 });
        // axes and grid
        const step = Hyper.niceStep ? Hyper.niceStep(box2.hi - box2.lo, 6) : 1;
        font(c, 11);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.fillStyle = C.muted; c.textAlign = 'right'; c.textBaseline = 'middle';
        for (let y = Math.ceil(box2.lo / step) * step; y <= box2.hi + 1e-9; y += step) { c.beginPath(); c.moveTo(box2.x0, yY(y)); c.lineTo(box2.x1, yY(y)); c.stroke(); c.fillText(kit.fmt(y, 3), box2.x0 - 6, yY(y)); }
        c.textAlign = 'center'; c.textBaseline = 'top';
        const ts = Hyper.niceStep ? Hyper.niceStep(V.T, 6) : 0.5;
        for (let t = 0; t <= V.T + 1e-9; t += ts) { c.beginPath(); c.moveTo(tX(t), box2.y0); c.lineTo(tX(t), box2.y1); c.stroke(); c.fillText(kit.fmt(t, 3), tX(t), box2.y1 + 4); }
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(box2.x0, yY(0)); c.lineTo(box2.x1, yY(0)); c.stroke();
        kit.label(c, 'height (m)', box2.x0 - 6, 10, { align: 'right', size: 11, color: C.muted });
        kit.label(c, 'time (s)', box2.x1, st.H - 8, { align: 'right', size: 11, color: C.muted });
        // Newton's path, then yours
        if (V.ghost) { c.setLineDash([6, 5]); c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); newton.forEach((y, i) => c.lineTo(tX(i * dt()), yY(y))); c.stroke(); c.setLineDash([]); }
        c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); xs.forEach((y, i) => c.lineTo(tX(i * dt()), yY(y))); c.stroke();
        kit.dot(c, tX(0), yY(0), 5, C.text); kit.dot(c, tX(V.T), yY(V.y1), 5, C.text);
        kit.label(c, 'thrown', tX(0) + 6, yY(0) + 12, { size: 11, color: C.muted });
        kit.label(c, 'caught', tX(V.T) - 6, yY(V.y1) + 12, { size: 11, color: C.muted, align: 'right' });
        if (grab != null) kit.dot(c, tX(grab * dt()), yY(xs[grab]), 6, C.warn, C.text);
        // the motion replayed in a column at the left, and a marker on the history
        const ta = Math.min(anim, V.T), i = Math.min(n - 1, Math.floor(ta / dt())), f = ta / dt() - i, yb = xs[i] + (xs[i + 1] - xs[i]) * f;
        c.fillStyle = C.bg || C.surface || C.bg2; c.fillRect(8, box2.y0, 52, box2.y1 - box2.y0);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(8, yY(0)); c.lineTo(60, yY(0)); c.stroke();
        kit.dot(c, 34, yY(yb), 7, C.warn, C.text);
        kit.dot(c, tX(ta), yY(yb), 4.5, C.warn);
        kit.label(c, 't = ' + ta.toFixed(2) + ' s', 34, box2.y1 + 12, { align: 'center', size: 10.5, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ act-euler-lagrange */
  Hyper.sim('act-euler-lagrange', {
    title: 'The Euler–Lagrange equation at work',
    blurb: `Three systems, each moved by nothing but its [[?lagrangian|Lagrangian]] and the Euler–Lagrange equation $\\frac{d}{dt}\\frac{\\partial L}{\\partial v} = \\frac{\\partial L}{\\partial x}$. The arrows show its two sides on the moving object: the rate of change of the momentum $\\partial L/\\partial v$ (blue) and the "force" $\\partial L/\\partial x$ (orange). They are always equal — that is the equation. The graph follows KE, PE and L = KE − PE in time, and the read-out adds up the [[?action]] as the motion goes on.

**Try this**
- Mass on a spring: the force arrow always points back to the middle, and the momentum arrow lags a quarter cycle behind it. KE and PE trade places twice a cycle; L swings between +E and −E.
- Pendulum at a large angle: the coordinate is the angle itself, and the string's tension never enters. The period grows with the amplitude.
- Now choose **L = KE + PE**, the wrong sign. The spring flings its mass away, the ball falls upwards, the pendulum swings around the *top*. Nature chose the minus sign.
- With the wrong sign, look at the read-outs: KE + PE is no longer constant, but KE − PE is.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 250 });
      const gb = plotHost(box);
      const ctl = kit.controls(box.side, [
        { id: 'sys', type: 'select', label: 'System', options: [['Mass on a spring', 'spring'], ['Pendulum', 'pend'], ['Ball thrown up', 'ball']], value: 'spring' },
        { id: 'sign', type: 'select', label: 'Lagrangian', options: [['L = KE − PE (nature)', -1], ['L = KE + PE (wrong sign)', 1]], value: -1 },
        { id: 'amp', label: 'Start from (share of the full range)', min: 0.1, max: 1, step: 0.05, value: 0.6 },
        { id: 'k', label: 'Spring constant', min: 2, max: 40, step: 1, value: 10, unit: 'N/m' },
        { id: 'len', label: 'Length of the pendulum', min: 0.3, max: 2, step: 0.05, value: 1, unit: 'm' },
        { type: 'buttons', items: [{ id: 'go', label: 'Release', primary: true }] }
      ], id => { if (id === 'sys') ui(); reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eq', 'Equation'], ['p', 'Momentum ∂L/∂v'], ['f', '∂L/∂x  |  d(∂L/∂v)/dt'], ['E', 'KE + PE'], ['D', 'KE − PE = L'], ['S', 'Action so far ∫L dt'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'energy (J)' }, legend: true }, 150);
      const m = 1, g = 9.81;
      let q = 0, qd = 0, t = 0, S = 0, hist = [], pPrev = 0, dpdt = 0, gone = 0, frame = 0;
      function ui() { ctl.show('k', V.sys === 'spring'); ctl.show('len', V.sys === 'pend'); }
      ui();
      // mass for the coordinate, the potential and its slope
      const M = () => V.sys === 'pend' ? m * V.len * V.len : m;
      const Vp = x => V.sys === 'spring' ? 0.5 * V.k * x * x : V.sys === 'pend' ? m * g * V.len * (1 - Math.cos(x)) : m * g * x;
      const dV = x => V.sys === 'spring' ? V.k * x : V.sys === 'pend' ? m * g * V.len * Math.sin(x) : m * g;
      function reset() {
        t = 0; S = 0; hist = []; gone = 0;
        if (V.sys === 'spring') { q = 0.5 * V.amp; qd = 0; }
        else if (V.sys === 'pend') { q = V.amp * 170 * Math.PI / 180; qd = 0; }
        else { q = 0; qd = 3 + 7 * V.amp; }
        pPrev = M() * qd; dpdt = 0;
      }
      reset();
      // ∂L/∂x for L = KE ∓ PE: sign −1 gives −V′ (nature), +1 gives +V′
      const force = x => V.sign < 0 ? -dV(x) : dV(x);
      const loop = kit.loop(dtf => {
        const C = kit.colors();
        if (gone > 0) { gone -= dtf; if (gone <= 0) reset(); }
        else if (dtf > 0) {
          const H = 1 / 1200, k = Math.max(1, Math.round(dtf / H)), h = dtf / k, Mm = M();
          for (let i = 0; i < k; i++) {
            const a1 = force(q) / Mm; q += qd * h + 0.5 * a1 * h * h;
            const a2 = force(q) / Mm; qd += 0.5 * (a1 + a2) * h;
            const ke = 0.5 * Mm * qd * qd, pe = Vp(q); S += (ke + V.sign * pe) * h; t += h;
          }
          const p = Mm * qd; dpdt = (p - pPrev) / dtf; pPrev = p;
          const lim = V.sys === 'spring' ? 2.5 : V.sys === 'ball' ? 40 : Infinity;
          if (Math.abs(q) > lim || (V.sys === 'ball' && q < -0.01 && V.sign < 0)) gone = 1.6;
        }
        const Mm = M(), ke = 0.5 * Mm * qd * qd, pe = Vp(q), Lv = ke + V.sign * pe;
        if (dtf > 0) { hist.push([t, ke, pe, Lv]); if (hist.length > 700) hist.shift(); }
        // read-outs
        const eqs = { spring: V.sign < 0 ? 'm ẍ = −k x' : 'm ẍ = +k x', pend: V.sign < 0 ? 'θ̈ = −(g/ℓ) sin θ' : 'θ̈ = +(g/ℓ) sin θ', ball: V.sign < 0 ? 'ÿ = −g' : 'ÿ = +g' };
        const pu = V.sys === 'pend' ? ' kg·m²/s' : ' kg·m/s', fu = V.sys === 'pend' ? ' N·m' : ' N';
        ro.set('eq', eqs[V.sys]); ro.set('p', (Mm * qd).toFixed(3) + pu);
        ro.set('f', force(q).toFixed(2) + fu + '  |  ' + (dtf > 0 ? dpdt.toFixed(2) : '—') + fu);
        ro.set('E', (ke + pe).toFixed(3) + ' J'); ro.set('D', (ke - pe).toFixed(3) + ' J'); ro.set('S', S.toFixed(3) + ' J·s');
        ro.set('msg', gone > 0 ? (V.sign > 0 ? 'Runs away — the wrong sign.' : 'Caught.') : '');
        if (++frame % 4 === 0 && hist.length > 1) plot.set({ series: [{ pts: hist.map(h => [h[0], h[1]]), label: 'KE' }, { pts: hist.map(h => [h[0], h[2]]), label: 'PE' }, { pts: hist.map(h => [h[0], h[3]]), label: 'L', width: 2.6 }] });
        // drawing
        const c = st.begin(), W = st.W, Hh = st.H;
        const blue = kit.hue(215, 1), orange = C.warn;
        const eqX = W - 12;
        const lines = V.sys === 'spring' ? ['L = ½ m ẋ² ' + (V.sign < 0 ? '−' : '+') + ' ½ k x²', '∂L/∂v = m ẋ   (momentum)', '∂L/∂x = ' + (V.sign < 0 ? '−' : '+') + 'k x   (force)']
          : V.sys === 'pend' ? ['L = ½ m ℓ² θ̇² ' + (V.sign < 0 ? '−' : '+') + ' m g ℓ (1 − cos θ)', '∂L/∂θ̇ = m ℓ² θ̇   (angular momentum)', '∂L/∂θ = ' + (V.sign < 0 ? '−' : '+') + 'm g ℓ sin θ   (torque)']
          : ['L = ½ m ẏ² ' + (V.sign < 0 ? '−' : '+') + ' m g y', '∂L/∂v = m ẏ   (momentum)', '∂L/∂y = ' + (V.sign < 0 ? '−' : '+') + 'm g   (force)'];
        lines.forEach((s, i) => kit.label(c, s, eqX, 16 + 18 * i, { align: 'right', size: 12, color: i ? C.muted : C.text, weight: i ? 500 : 600 }));
        const fa = force(q), fsc = V.sys === 'pend' ? 60 / (m * g * V.len) : V.sys === 'spring' ? 60 / (V.k * 0.5) : 60 / (m * g);
        if (V.sys === 'spring') {
          const X = x => W * 0.46 + x * W * 0.42, y0 = Hh * 0.6, wall = X(-1.0);
          c.fillStyle = C.faint; c.fillRect(wall - 10, y0 - 40, 10, 80);
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(wall - 10, y0 + 24); c.lineTo(W - 20, y0 + 24); c.stroke();
          const bx = X(q), coils = 14;
          c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); c.moveTo(wall, y0);
          for (let i = 1; i < coils * 2; i++) c.lineTo(wall + (bx - 18 - wall) * i / (coils * 2), y0 + (i % 2 ? -10 : 10));
          c.lineTo(bx - 18, y0); c.stroke();
          c.fillStyle = C.accent; c.fillRect(bx - 18, y0 - 18, 36, 36);
          c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(X(0), y0 - 50); c.lineTo(X(0), y0 + 30); c.stroke(); c.setLineDash([]);
          kit.label(c, 'x = 0', X(0), y0 + 40, { align: 'center', size: 11, color: C.muted });
          if (gone <= 0) { kit.arrow(c, bx, y0 - 30, bx + fa * fsc, y0 - 30, orange, 3); kit.arrow(c, bx, y0 - 42, bx + dpdt * fsc, y0 - 42, blue, 2); }
        } else if (V.sys === 'pend') {
          const px = W * 0.36, py = Hh * 0.46, Lp = Math.min(Hh * 0.4, W * 0.22) * Math.sqrt(V.len / 2), bx = px + Lp * Math.sin(q), by = py + Lp * Math.cos(q);
          c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.arc(px, py, Lp, 0, TAU); c.stroke(); c.setLineDash([]);
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(px, py); c.lineTo(bx, by); c.stroke();
          kit.dot(c, px, py, 4, C.text); kit.dot(c, bx, by, 12, C.accent, C.text);
          // tangential arrows (generalised force and rate of change of angular momentum, as forces at the bob)
          const tx = Math.cos(q), ty = -Math.sin(q), s1 = fa * fsc, s2 = dpdt * fsc;
          if (gone <= 0) { kit.arrow(c, bx, by, bx + tx * s1, by + ty * s1, orange, 3); kit.arrow(c, bx + 8 * Math.sin(q), by + 8 * Math.cos(q), bx + 8 * Math.sin(q) + tx * s2, by + 8 * Math.cos(q) + ty * s2, blue, 2); }
          kit.label(c, 'θ = ' + (q * 180 / Math.PI).toFixed(0) + '°', px + 10, py - 12, { size: 12 });
        } else {
          const gy = Hh - 30, Y = y => gy - y * (Hh - 60) / 8, bx = W * 0.36;
          c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(bx - 80, gy); c.lineTo(bx + 80, gy); c.stroke();
          for (let y = 2; y <= 8; y += 2) kit.label(c, y + ' m', bx - 86, Y(y), { align: 'right', size: 10.5, color: C.muted });
          const yb = Y(q);
          if (yb > -20) { kit.dot(c, bx, yb, 10, C.accent, C.text); if (gone <= 0) { kit.arrow(c, bx + 18, yb, bx + 18, yb - fa * fsc, orange, 3); kit.arrow(c, bx + 30, yb, bx + 30, yb - dpdt * fsc, blue, 2); } }
          else kit.label(c, '↑ gone', bx, 14, { align: 'center', size: 12, color: C.bad });
        }
        kit.label(c, '■ ∂L/∂x', 12, Hh - 30, { size: 11.5, color: orange, weight: 600 });
        kit.label(c, '■ d/dt (∂L/∂v)', 12, Hh - 14, { size: 11.5, color: blue, weight: 600 });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ act-variation */
  Hyper.sim('act-variation', {
    title: 'Wiggle the path: the first-order change',
    blurb: `The calculus of variations, drawn. A base path (green) is changed into a trial path (blue) by adding a deviation ε·η(t) that is zero at both ends. The graph below plots how the [[?action]] changes, $S(\\varepsilon) - S(0)$, as the size ε of the deviation goes from −1 m to +1 m, with the tangent line at ε = 0. The strip under the paths shows the bracket $m\\ddot x + V'(x)$ of the base path — the quantity that multiplies η in the [[?variation]] δS.

**Try this**
- Base path = Newton's: the curve is flat at ε = 0 — no first-order change, whatever the shape or place of the bump. The bracket is zero all along the path.
- Base path = a straight line: the bracket is not zero, the curve is tilted at ε = 0, and a bump one way *lowers* the action. That path is not stationary.
- Choose a narrow bump and move it along the straight path: the tilt (the first-order change) is proportional to the bracket where the bump sits.
- Mass on a spring for 4.5 s — more than half a period: with one half-wave the curve bends *down* (the action is a maximum in that direction), with two half-waves it bends up. A saddle — still with no first-order change.
- Press *Sweep ε* and watch the trial path and the point on the curve move together.`,
    mount(box, kit) {
      const Q = kit.qm;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 260 });
      const gb = plotHost(box);
      const n = 200;
      const ctl = kit.controls(box.side, [
        { id: 'sys', type: 'select', label: 'System', options: [['Ball in gravity (1 kg, 2 s)', 'ball'], ['Mass on a spring, 2 s (under half a period)', 'spr2'], ['Mass on a spring, 4.5 s (over half a period)', 'spr45']], value: 'ball' },
        { id: 'base', type: 'select', label: 'Base path', options: [['Newton\'s path (stationary)', 'true'], ['A wrong path: the straight line', 'line']], value: 'true' },
        { id: 'shape', type: 'select', label: 'Shape of the deviation η', options: [['Sine, one half-wave', 1], ['Sine, two half-waves', 2], ['Sine, three half-waves', 3], ['A narrow bump', 0]], value: 1 },
        { id: 'cen', label: 'Bump: where (share of the trip)', min: 0.1, max: 0.9, step: 0.01, value: 0.5 },
        { id: 'wid', label: 'Bump: width (share of the trip)', min: 0.04, max: 0.3, step: 0.01, value: 0.1 },
        { id: 'eps', label: 'Size of the deviation ε', min: -1, max: 1, step: 0.01, value: 0.4, unit: 'm' },
        { type: 'buttons', items: [{ id: 'sweep', label: 'Sweep ε', primary: true }] }
      ], id => { if (id === 'sweep') sweep = sweep == null ? Math.asin(clamp(V.eps, -1, 1)) : null; else { if (id === 'eps') sweep = null; dirty = true; } if (id === 'shape') ui(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['S0', 'Action of the base path'], ['dS', 'Change of S at this ε'], ['d1', 'First-order part δS'], ['d2', 'The rest (second order)'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'size of the deviation ε (m)', min: -1, max: 1 }, y: { label: 'S(ε) − S(0)  (J·s)' }, legend: true }, 160);
      let dirty = true, sweep = null, base = [], eta = [], resid = [], curve = [], slope = 0;
      function ui() { ctl.show('cen', +V.shape === 0); ctl.show('wid', +V.shape === 0); }
      ui();
      const sysOf = () => {
        if (V.sys === 'ball') return { m: 1, T: 2, x1: 0, V: x => 9.81 * x, dV: () => 9.81, truth: t => 9.81 / 2 * t * (2 - t), lo: -1.6, hi: 6.6, name: 'height' };
        const T = V.sys === 'spr2' ? 2 : 4.5;
        return { m: 1, T, x1: 0.5, V: x => 0.5 * x * x, dV: x => x, truth: t => 0.5 * Math.sin(t) / Math.sin(T), lo: -1.7, hi: 1.7, name: 'stretch' };
      };
      function build() {
        const s = sysOf(), dt = s.T / n;
        base = []; eta = []; resid = [];
        for (let i = 0; i <= n; i++) { const t = i * dt; base.push(V.base === 'true' ? s.truth(t) : s.x1 * t / s.T); }
        let mx = 0; const sh = +V.shape;
        for (let i = 0; i <= n; i++) {
          const u = i / n;
          const e = sh > 0 ? Math.sin(sh * Math.PI * u) : Math.exp(-Math.pow((u - V.cen) / V.wid, 2)) * Math.sin(Math.PI * u);
          eta.push(e); mx = Math.max(mx, Math.abs(e));
        }
        eta = eta.map(e => e / (mx || 1));
        for (let i = 0; i <= n; i++) {
          const acc = i > 0 && i < n ? (base[i + 1] - 2 * base[i] + base[i - 1]) / (dt * dt) : (i === 0 ? (base[2] - 2 * base[1] + base[0]) : (base[n] - 2 * base[n - 1] + base[n - 2])) / (dt * dt);
          resid.push(s.m * acc + s.dV(base[i]));
        }
        const L = (x, v) => 0.5 * s.m * v * v - s.V(x), S0 = Q.action(base, dt, L);
        const Sof = e => Q.action(base.map((x, i) => x + e * eta[i]), dt, L) - S0;
        curve = []; for (let k = 0; k <= 80; k++) { const e = -1 + 2 * k / 80; curve.push([e, Sof(e)]); }
        const h = 1e-3; slope = (Sof(h) - Sof(-h)) / (2 * h);
        return { s, dt, S0, Sof };
      }
      let B = build();
      const loop = kit.loop(dtf => {
        if (sweep != null && dtf > 0) { sweep += dtf * 0.9; ctl.set('eps', Math.round(100 * Math.sin(sweep)) / 100); dirty = true; }
        if (dirty) {
          B = build(); dirty = false;
          const e = V.eps, dS = B.Sof(e), d1 = slope * e;
          ro.set('S0', B.S0.toFixed(3) + ' J·s'); ro.set('dS', (dS >= 0 ? '+' : '') + dS.toFixed(4) + ' J·s');
          ro.set('d1', (d1 >= 0 ? '+' : '') + d1.toFixed(4) + ' J·s'); ro.set('d2', (dS - d1 >= 0 ? '+' : '') + (dS - d1).toFixed(4) + ' J·s');
          const curv = B.Sof(0.5) + B.Sof(-0.5);
          ro.set('msg', Math.abs(slope) < 1e-3 ? (curv > 0 ? 'Stationary: no first-order change; a minimum along this η.' : 'Stationary, but S decreases along this η: a maximum in this direction.') : 'Not stationary: dS/dε = ' + slope.toFixed(3) + ' J·s per metre.');
          plot.set({ series: [{ pts: curve, label: 'S(ε) − S(0)' }, { pts: [[-1, -slope], [1, slope]], label: 'tangent at ε = 0', dash: [5, 4], width: 1.5 }], marks: [{ x: e, y: dS, label: 'ε = ' + e.toFixed(2) + ' m' }] });
        }
        const c = st.begin(), C = kit.colors(), s = B.s;
        const x0 = 70, x1 = st.W - 20, y0 = 16, y1 = st.H * 0.66, r0 = y1 + 26, r1 = st.H - 14;
        const tX = t => x0 + (x1 - x0) * t / s.T, yY = y => y1 - (y1 - y0) * (y - s.lo) / (s.hi - s.lo);
        // axes
        c.strokeStyle = C.grid; c.lineWidth = 1; font(c, 11); c.fillStyle = C.muted; c.textAlign = 'right'; c.textBaseline = 'middle';
        const ys = Hyper.niceStep ? Hyper.niceStep(s.hi - s.lo, 5) : 1;
        for (let y = Math.ceil(s.lo / ys) * ys; y <= s.hi; y += ys) { c.beginPath(); c.moveTo(x0, yY(y)); c.lineTo(x1, yY(y)); c.stroke(); c.fillText(kit.fmt(y, 3), x0 - 6, yY(y)); }
        c.strokeStyle = C.axis || C.muted; c.beginPath(); c.moveTo(x0, yY(0)); c.lineTo(x1, yY(0)); c.stroke();
        kit.label(c, s.name + ' (m)', 8, 10, { size: 11, color: C.muted });
        // the deviation as a band between base and trial paths
        const e = V.eps;
        c.fillStyle = kit.hue(215, 0.16); c.beginPath();
        base.forEach((x, i) => c.lineTo(tX(i * B.dt), yY(x)));
        for (let i = n; i >= 0; i--) c.lineTo(tX(i * B.dt), yY(base[i] + e * eta[i]));
        c.closePath(); c.fill();
        c.strokeStyle = C.ok; c.lineWidth = 2.4; c.beginPath(); base.forEach((x, i) => c.lineTo(tX(i * B.dt), yY(x))); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.setLineDash([6, 4]); c.beginPath(); base.forEach((x, i) => c.lineTo(tX(i * B.dt), yY(x + e * eta[i]))); c.stroke(); c.setLineDash([]);
        kit.dot(c, tX(0), yY(base[0]), 4.5, C.text); kit.dot(c, tX(s.T), yY(base[n]), 4.5, C.text);
        kit.label(c, V.base === 'true' ? 'Newton\'s path' : 'straight line', tX(s.T * 0.08), yY(base[Math.round(n * 0.08)]) - 12, { size: 11.5, color: C.ok, weight: 600 });
        kit.label(c, 'path + ε·η', x1, y0 + 6, { size: 11.5, color: C.accent, weight: 600, align: 'right' });
        // the bracket m ẍ + V′ of the base path, and η, in a strip
        const rm = Math.max(1e-6, ...resid.map(Math.abs)), rs = Math.max(rm, V.sys === 'ball' ? 10 : 1), mid = (r0 + r1) / 2, hh = (r1 - r0) / 2 - 2;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x0, r0, x1 - x0, r1 - r0);
        c.beginPath(); c.moveTo(x0, mid); c.lineTo(x1, mid); c.stroke();
        c.fillStyle = kit.hue(28, 0.35); c.beginPath(); c.moveTo(tX(0), mid);
        resid.forEach((r, i) => c.lineTo(tX(i * B.dt), mid - hh * r / rs * Math.abs(eta[i]))); c.lineTo(tX(s.T), mid); c.closePath(); c.fill();
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); resid.forEach((r, i) => c.lineTo(tX(i * B.dt), mid - hh * r / rs)); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 1.2; c.setLineDash([3, 3]); c.beginPath(); eta.forEach((h, i) => c.lineTo(tX(i * B.dt), mid - hh * h)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'm ẍ + V′ of the base path' + (rm < 1e-3 * rs ? ' = 0 everywhere' : ''),x0 + 6, r0 + 9, { size: 11, color: C.warn, weight: 600 });
        kit.label(c, 'η (dashed); shaded: the bracket weighted by |η|', x1 - 6, r1 - 8, { size: 10.5, color: C.muted, align: 'right' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ act-field-relax */
  Hyper.sim('act-field-relax', {
    title: 'A potential relaxing to the least field energy',
    blurb: `A cross-section of conductors: the inner one is held at 1 V, the outer one at 0 V. The colours show the potential φ in the space between, the lines are equipotentials, and the arrows the field $\\vec E = -\\nabla\\phi$. Each sweep replaces the potential at every point by the average of its four neighbours — the grid form of $\\nabla^2\\phi = 0$ ([[?laplacian]]). Every replacement lowers the field energy $\\tfrac12\\varepsilon_0\\int(\\nabla\\phi)^2$, and the graph shows the capacitance $C = 2U/V^2$ computed from it falling towards its least value.

**Try this**
- Start from zero: at first all the energy is packed next to the inner conductor. Watch it spread out and fall.
- Coaxial cable: press *Straight-line guess*. Its capacitance starts about 14 % above the grid's final value and relaxation brings it down — a trial potential always gives too much.
- *Scramble* the potential, or drag across the space to poke it: the extra energy drains away as the bumps smooth out.
- Make the inner conductor bigger: the capacitance grows as the gap closes. The grid's staircase circles make its final answer differ from the smooth-circle formula by several per cent (47.6 against 50.6 pF/m at the start).
- Try the square tube and the two plates, where no simple formula exists — relaxation finds the answer anyway.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 260 });
      const gb = plotHost(box);
      const NX = 72, NY = 48, eps0 = 8.8541878128e-12, R = kit.qm.rng(1846);
      const phi = new Float64Array(NX * NY), fix = new Int8Array(NX * NY);
      let sweeps = 0, hist = [], dirty = true, lastChange = 0, map = { s: 1, ox: 0, oy: 0 };
      const ctl = kit.controls(box.side, [
        { id: 'geo', type: 'select', label: 'Conductors', options: [['Coaxial cable: round wire in a round tube', 'coax'], ['Square wire in a square tube', 'square'], ['Two plates in an earthed box', 'plates']], value: 'coax' },
        { id: 'a', label: 'Size of the inner conductor', min: 3, max: 15, step: 1, value: 7, unit: 'cells' },
        { id: 'run', type: 'check', label: 'Relax', value: true },
        { id: 'speed', label: 'Sweeps per frame', min: 1, max: 40, step: 1, value: 3 },
        { id: 'arrows', type: 'check', label: 'Field arrows', value: false },
        { type: 'buttons', items: [{ id: 'zero', label: 'Start from zero', primary: true }, { id: 'lin', label: 'Straight-line guess' }, { id: 'mess', label: 'Scramble' }] }
      ], id => {
        if (id === 'geo' || id === 'a') { setup(); start('zero'); }
        if (id === 'zero' || id === 'lin' || id === 'mess') start(id);
        if (id === 'geo') ctl.show('lin', V.geo === 'coax');
        dirty = true;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['C', 'Capacitance from the energy, 2U/V²'], ['ex', 'Smooth circles, 2πε₀/ln(b/a)'], ['U', 'Field energy at 1 V'], ['n', 'Sweeps'], ['d', 'Largest change in a sweep']]);
      const plot = kit.plot(gb, { x: { label: 'sweeps', min: 0 }, y: { label: 'capacitance per metre (pF)' }, legend: true }, 150);
      const cx = (NX - 1) / 2, cy = (NY - 1) / 2, B = 21;
      const inner = (i, j) => {
        if (V.geo === 'coax') return Math.hypot(i - cx, j - cy) <= V.a;
        if (V.geo === 'square') return Math.abs(i - cx) <= V.a && Math.abs(j - cy) <= V.a;
        return Math.abs(j - (cy - 8)) <= 1 && Math.abs(i - cx) <= 2 * V.a;           // the upper plate
      };
      const outer = (i, j) => {
        if (i === 0 || j === 0 || i === NX - 1 || j === NY - 1) return true;
        if (V.geo === 'coax') return Math.hypot(i - cx, j - cy) >= B;
        if (V.geo === 'square') return Math.abs(i - cx) >= B || Math.abs(j - cy) >= B;
        return Math.abs(j - (cy + 8)) <= 1 && Math.abs(i - cx) <= 2 * V.a;           // the lower plate, earthed with the box
      };
      function setup() { for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { const k = j * NX + i; fix[k] = inner(i, j) ? 1 : outer(i, j) ? 2 : 0; } }
      function start(how) {
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          const k = j * NX + i;
          if (fix[k] === 1) phi[k] = 1; else if (fix[k] === 2) phi[k] = 0;
          else if (how === 'mess') phi[k] = R();
          else if (how === 'lin' && V.geo === 'coax') phi[k] = clamp((B - Math.hypot(i - cx, j - cy)) / (B - V.a), 0, 1);
          else phi[k] = 0;
        }
        sweeps = 0; hist = []; record();
      }
      const energySum = () => { let s = 0; for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { const k = j * NX + i; if (i + 1 < NX) { const d = phi[k + 1] - phi[k]; s += d * d; } if (j + 1 < NY) { const d = phi[k + NX] - phi[k]; s += d * d; } } return s; };
      const Cpf = () => eps0 * energySum() * 1e12;          // C = 2U/V² with U = ½ε₀Σ(Δφ)² per metre, V = 1 V
      function record() { hist.push([sweeps, Cpf()]); if (hist.length > 600) hist = hist.filter((p, i) => i % 2 === 0 || i === hist.length - 1); }
      function sweep() {
        let ch = 0;
        for (let j = 1; j < NY - 1; j++) for (let i = 1; i < NX - 1; i++) {
          const k = j * NX + i; if (fix[k]) continue;
          const av = (phi[k - 1] + phi[k + 1] + phi[k - NX] + phi[k + NX]) / 4, d = av - phi[k];
          phi[k] = av; if (Math.abs(d) > ch) ch = Math.abs(d);
        }
        sweeps++; lastChange = ch;
      }
      setup(); start('zero'); ctl.show('lin', true);
      kit.drag(st, {
        hit(p) { return p.x > map.ox && p.y > map.oy && p.x < map.ox + NX * map.s && p.y < map.oy + NY * map.s ? 'poke' : null; },
        move(k, p) {
          const gi = (p.x - map.ox) / map.s, gj = (p.y - map.oy) / map.s;
          for (let j = Math.floor(gj - 3); j <= gj + 3; j++) for (let i = Math.floor(gi - 3); i <= gi + 3; i++) {
            if (i < 1 || j < 1 || i >= NX - 1 || j >= NY - 1) continue;
            const kk = j * NX + i, w = Math.exp(-((i - gi) * (i - gi) + (j - gj) * (j - gj)) / 4);
            if (!fix[kk]) phi[kk] = clamp(phi[kk] + 0.25 * w, 0, 1.2);
          }
          record(); dirty = true;
        }
      });
      const loop = kit.loop(dtf => {
        if (V.run && dtf > 0) { for (let s = 0; s < V.speed; s++) sweep(); record(); dirty = true; }
        const C = kit.colors();
        if (dirty) {
          const cp = Cpf();
          ro.set('C', cp.toFixed(2) + ' pF/m'); ro.set('U', (0.5 * cp * 1e-12).toExponential(3) + ' J/m');
          ro.set('ex', V.geo === 'coax' ? (2 * Math.PI * eps0 / Math.log(B / V.a) * 1e12).toFixed(2) + ' pF/m' : 'no simple formula');
          ro.set('n', String(sweeps)); ro.set('d', lastChange.toExponential(1) + ' V');
          const ser = [{ pts: hist.slice(), label: 'C from the field energy' }];
          const hl = V.geo === 'coax' ? [{ y: 2 * Math.PI * eps0 / Math.log(B / V.a) * 1e12, label: 'smooth circles' }] : [];
          plot.set({ series: ser, hlines: hl, x: { label: 'sweeps', min: 0, max: Math.max(50, sweeps) } });
          dirty = false;
        }
        const c = st.begin(), s = Math.min((st.W - 16) / NX, (st.H - 16) / NY), ox = (st.W - NX * s) / 2, oy = (st.H - NY * s) / 2;
        map = { s, ox, oy };
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          const k = j * NX + i, v = phi[k];
          c.fillStyle = fix[k] ? (fix[k] === 1 ? kit.hue(8, 0.95) : C.muted) : kit.hue(235 - 225 * clamp(v, 0, 1), 0.72);
          c.fillRect(ox + i * s, oy + j * s, s + 0.6, s + 0.6);
        }
        // equipotentials by marching squares on the cell centres
        c.strokeStyle = C.text; c.globalAlpha = 0.55; c.lineWidth = 1;
        c.beginPath();
        for (let lv = 0.1; lv < 0.95; lv += 0.1) {
          for (let j = 0; j < NY - 1; j++) for (let i = 0; i < NX - 1; i++) {
            const k = j * NX + i, a = phi[k] - lv, b = phi[k + 1] - lv, d = phi[k + NX] - lv, e = phi[k + NX + 1] - lv, pts = [];
            if ((a > 0) !== (b > 0)) pts.push([i + a / (a - b), j]);
            if ((b > 0) !== (e > 0)) pts.push([i + 1, j + b / (b - e)]);
            if ((d > 0) !== (e > 0)) pts.push([i + d / (d - e), j + 1]);
            if ((a > 0) !== (d > 0)) pts.push([i, j + a / (a - d)]);
            for (let q = 0; q + 1 < pts.length; q += 2) { c.moveTo(ox + (pts[q][0] + 0.5) * s, oy + (pts[q][1] + 0.5) * s); c.lineTo(ox + (pts[q + 1][0] + 0.5) * s, oy + (pts[q + 1][1] + 0.5) * s); }
          }
        }
        c.stroke(); c.globalAlpha = 1;
        if (V.arrows) {
          for (let j = 3; j < NY - 1; j += 5) for (let i = 3; i < NX - 1; i += 5) {
            const k = j * NX + i; if (fix[k]) continue;
            const ex = -(phi[k + 1] - phi[k - 1]) / 2, ey = -(phi[k + NX] - phi[k - NX]) / 2, m = Math.hypot(ex, ey);
            if (m < 1e-4) continue;
            const L = Math.min(4.2 * s, 0.6 * s + 40 * m * s), px = ox + (i + 0.5) * s, py = oy + (j + 0.5) * s;
            kit.arrow(c, px, py, px + ex / m * L, py + ey / m * L, C.text, 1.2, 5);
          }
        }
        kit.label(c, '1 V', ox + (cx + 0.5) * s, oy + (V.geo === 'plates' ? cy - 8 : cy) * s + s / 2, { align: 'center', size: 12, weight: 700, color: C.text, bg: C.surface || C.bg2 });
        kit.label(c, '0 V', ox + 2 * s, oy + 2 * s, { size: 11, weight: 700, color: C.text, bg: C.surface || C.bg2 });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ act-many-paths */
  Hyper.sim('act-many-paths', {
    title: 'Many paths, many arrows',
    blurb: `A particle goes from A to B in a fixed time. Instead of one path, the simulation draws many trial paths — the classical one (green) plus random smooth wiggles. Each path gets an arrow turned by its [[?action]] in units of ħ, $S/\\hbar$ (measured here from the classical path's arrow), and is coloured by that arrow's direction. In the box the arrows are added head to tail; the graph plots each arrow's direction, as cos(ΔS/ħ), against how far its path strays from the classical one.

**Try this**
- With the paths added nearest-first, the chain starts as a straight line (the paths near the classical one agree) and then curls up (the far paths turn every which way and cancel).
- Switch to random order: the chain wanders, but it ends at the same point — the total does not depend on the order.
- Lower ħ: fewer paths stay within ±90° of the classical arrow and the useful bundle hugs the green path. Raise ħ: many paths join in — the motion becomes more "quantum".
- Press *Add them one at a time* and watch the total grow while the paths close to the classical one arrive, then barely move.
- Switch on gravity: the classical path is now a parabola, and the paths that count cluster around it instead.`,
    mount(box, kit) {
      const Q = kit.qm;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 260 });
      const gb = plotHost(box);
      const n = 40;
      const ctl = kit.controls(box.side, [
        { id: 'pot', type: 'select', label: 'Force', options: [['Free particle', 'free'], ['Uniform gravity', 'grav']], value: 'free' },
        { id: 'hbar', label: 'ħ, in units of the action scale m·d²/T', min: 0.002, max: 0.5, value: 0.03, log: true, sig: 2 },
        { id: 'spread', label: 'How far the trial paths stray', min: 0.05, max: 0.6, step: 0.01, value: 0.3, unit: '× d' },
        { id: 'N', label: 'Number of paths', min: 20, max: 400, step: 10, value: 160 },
        { id: 'order', type: 'select', label: 'Order of adding the arrows', options: [['Nearest paths first', 'near'], ['Random order', 'rand']], value: 'near' },
        { type: 'buttons', items: [{ id: 'build', label: 'Add them one at a time', primary: true }, { id: 'new', label: 'New random paths' }] }
      ], id => { if (id === 'new') seed++; if (id === 'build') shown = 0; else if (id !== 'hbar' && id !== 'order') shown = null; dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['h', 'ħ / (m d²/T)'], ['in', 'Arrows within ±90° of the classical one'], ['tot', 'Length of the total (all in line = 1)'], ['far', 'Largest ΔS/ħ among the paths']]);
      const plot = kit.plot(gb, { x: { label: 'how far the path strays from the classical one (rms, × d)', min: 0 }, y: { label: 'cos(ΔS/ħ): the arrow\'s direction', min: -1.05, max: 1.05 }, legend: false }, 150);
      let seed = 1, dirty = true, shown = null, paths = [], cl = [], chain = [], total = null;
      const g = 8;
      function build() {
        const R = Q.rng(seed * 7919 + 13), T = 1, dt = T / n, grav = V.pot === 'grav';
        cl = grav ? Q.stationaryPath({ x0: 0, x1: 1, T, n, m: 1, dV: () => g, iters: 5000 }) : Array.from({ length: n + 1 }, (_, i) => i / n);
        const L = (x, v) => 0.5 * v * v - (grav ? g * x : 0), Scl = Q.action(cl, dt, L);
        paths = [];
        for (let p = 0; p < V.N; p++) {
          const a = [1, 2, 3].map(k => Q.gauss(R) * V.spread / k / 1.6);
          const xs = cl.map((x, i) => x + a[0] * Math.sin(Math.PI * i / n) + a[1] * Math.sin(2 * Math.PI * i / n) + a[2] * Math.sin(3 * Math.PI * i / n));
          const dS = Q.action(xs, dt, L) - Scl;
          let r2 = 0; xs.forEach((x, i) => { r2 += (x - cl[i]) * (x - cl[i]); });
          paths.push({ xs, dS, rms: Math.sqrt(r2 / (n + 1)), key: R() });
        }
        paths.sort(V.order === 'near' ? (p, q) => p.dS - q.dS : (p, q) => p.key - q.key);
      }
      function arrows() {
        const k = shown == null ? paths.length : Math.min(paths.length, Math.floor(shown));
        const zs = paths.slice(0, k).map(p => Q.scale(Q.expi(p.dS / V.hbar), 1 / paths.length));
        const s = Q.arrowSum(zs); chain = s.chain; total = s.total;
        const inb = paths.filter(p => Math.cos(p.dS / V.hbar) > 0).length;
        ro.set('h', V.hbar.toPrecision(2)); ro.set('in', inb + ' of ' + paths.length);
        ro.set('tot', Q.abs(total).toFixed(3) + (shown != null && k < paths.length ? ' (' + k + ' added)' : ''));
        ro.set('far', (Math.max(...paths.map(p => p.dS)) / V.hbar).toFixed(0) + ' rad');
      }
      let lastOrder = V.order, lastKey = '';
      const loop = kit.loop(dtf => {
        if (shown != null && dtf > 0) { shown += dtf * paths.length / 4; if (shown >= paths.length) shown = null; dirty = true; }
        if (dirty) {
          const key = V.pot + '|' + V.spread + '|' + V.N + '|' + seed;
          if (key !== lastKey || V.order !== lastOrder) { build(); lastKey = key; lastOrder = V.order; }
          arrows();
          plot.set({ series: [{ pts: paths.map(p => [p.rms, Math.cos(p.dS / V.hbar)]), label: 'paths', line: false, dots: 2.2 }], hlines: [{ y: 0, label: '' }] });
          dirty = false;
        }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const x0 = 40, x1 = W * 0.6, y0 = 20, y1 = H - 26, lo = -0.9, hi = V.pot === 'grav' ? 2.7 : 1.9;
        const tX = t => x0 + (x1 - x0) * t, yY = x => y1 - (y1 - y0) * (x - lo) / (hi - lo);
        const k = shown == null ? paths.length : Math.min(paths.length, Math.floor(shown));
        for (let p = paths.length - 1; p >= 0; p--) {
          if (p >= k) continue;
          const P = paths[p], ph = P.dS / V.hbar, agree = Math.cos(ph) > 0;
          c.strokeStyle = kit.hue(phaseHue(ph), agree ? 0.55 : 0.18); c.lineWidth = agree ? 1.3 : 1;
          c.beginPath(); P.xs.forEach((x, i) => c.lineTo(tX(i / n), yY(x))); c.stroke();
        }
        c.strokeStyle = C.ok; c.lineWidth = 3; c.beginPath(); cl.forEach((x, i) => c.lineTo(tX(i / n), yY(x))); c.stroke();
        kit.dot(c, tX(0), yY(0), 6, C.text); kit.dot(c, tX(1), yY(1), 6, C.text);
        kit.label(c, 'A', tX(0) - 8, yY(0), { align: 'right', size: 13, weight: 700 });
        kit.label(c, 'B', tX(1) + 8, yY(1), { size: 13, weight: 700 });
        kit.label(c, 'time →', x1, H - 10, { align: 'right', size: 11, color: C.muted });
        kit.label(c, 'position ↑', 8, 10, { size: 11, color: C.muted });
        kit.label(c, 'classical path', tX(0.55), yY(cl[Math.round(n * 0.55)]) + 14, { size: 11.5, color: C.ok, weight: 600 });
        const hs = Math.min(W * 0.18, H * 0.4);
        if (chain.length > 1) drawChain(c, kit, C, chain, W * 0.8, H / 2 + 8, hs, { title: 'the arrows added', hue: i => phaseHue(paths[i].dS / V.hbar), minExt: 0.25 });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ act-path-sum */
  // Fresnel integrals C(z), S(z): power series for small z, the Abramowitz–Stegun rational forms (7.3.32–33) beyond
  function fresnel(z) {
    const sgn = z < 0 ? -1 : 1, x = Math.abs(z);
    if (!Number.isFinite(x)) return [0.5 * sgn, 0.5 * sgn];
    if (x < 4) {
      // with t = πx²/2: C = Σ (−1)^n t^{2n}/(2n)! · x/(4n+1),  S = Σ (−1)^n t^{2n+1}/(2n+1)! · x/(4n+3)
      const t = Math.PI / 2 * x * x;
      let C = 0, S = 0, q = 1;
      for (let j = 0; j < 150; j++) {
        if (j > 0) q *= t / j;
        const term = (Math.floor(j / 2) % 2 ? -1 : 1) * q * x / (2 * j + 1);
        if (j % 2 === 0) C += term; else S += term;
        if (j > t && Math.abs(term) < 1e-16) break;
      }
      return [sgn * C, sgn * S];
    }
    // the asymptotic auxiliary functions, three terms each (good to about 10⁻⁶ for x ≥ 4)
    const u = 1 / Math.pow(Math.PI * x * x, 2);
    const f = (1 - 3 * u + 105 * u * u) / (Math.PI * x), g = (1 - 15 * u + 945 * u * u) / (Math.PI * Math.PI * x * x * x), a = Math.PI / 2 * x * x;
    return [sgn * (0.5 + f * Math.sin(a) - g * Math.cos(a)), sgn * (0.5 - f * Math.cos(a) - g * Math.sin(a))];
  }
  Hyper.sim('act-path-sum', {
    title: 'The sum over histories: one screen halfway',
    blurb: `An electron leaves the source at x = 0 and is detected a time T later at the detector. Halfway there it must pass some point of a screen — any point that is open. Each way through the screen is a path with its own action, and its arrow is turned by $S/\\hbar$. In the box the arrows for all the open points are added head to tail: for an open screen they form a **Cornu spiral** — straight in the middle, where the paths are near the classical straight line, and curled into two "eyes" at the ends. The graph shows $|K|^2$, the square of the total, all across the far side ("no screen" = 1).

**Try this**
- No screen: drag the detector; the spiral just shifts along — every point gets the same total.
- One narrow slit: only a short piece of the spiral is left, so the total barely depends on where the detector is — the electrons spread widely: diffraction. Widen the slit and the spread narrows.
- Two slits: two separate pieces of spiral. As the detector moves their directions turn relative to each other: fringes, spaced hT/2ms.
- An edge: at the geometrical edge of the shadow half the spiral is left, and the total is half as long — a quarter of the light. Inside the shadow it fades; outside it ripples.
- Change the time T: the central zone of the spiral, √(πħT/2m), grows with T.`,
    mount(box, kit) {
      const Q = kit.qm;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 260 });
      const gb = plotHost(box);
      const me = 9.1093837015e-31, hb = 1.054571817e-34, h = 6.62607015e-34, XR = 4;
      const ctl = kit.controls(box.side, [
        { id: 'scr', type: 'select', label: 'The screen halfway', options: [['No screen', 'none'], ['One slit', 'one'], ['Two slits', 'two'], ['An edge (open above)', 'edge']], value: 'two' },
        { id: 'wd', label: 'Width of each slit', min: 0.1, max: 3, step: 0.05, value: 0.4, unit: 'µm' },
        { id: 'sep', label: 'Distance between the slits', min: 0.5, max: 4, step: 0.05, value: 1.5, unit: 'µm' },
        { id: 'T', label: 'Time from source to detector', min: 0.5, max: 5, step: 0.1, value: 1, unit: 'ns' },
        { id: 'xb', label: 'Detector position', min: -XR, max: XR, step: 0.01, value: 0, unit: 'µm' }
      ], () => { dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['w', 'Central zone √(πħT/2m)'], ['P', '|K|² at the detector (no screen = 1)'], ['fr', 'Two-slit fringe spacing hT/2ms']]);
      const plot = kit.plot(gb, { x: { label: 'detector position (µm)', min: -XR, max: XR }, y: { label: '|K|²  (no screen = 1)', min: 0 }, legend: true }, 160);
      let dirty = true, chain = [[0, 0], [0, 0]], hues = [], map = null;
      // open intervals of the screen, in µm
      function open() {
        const w = V.wd, s = Math.max(V.sep, w + 0.05);
        if (V.scr === 'none') return [[-Infinity, Infinity]];
        if (V.scr === 'one') return [[-w / 2, w / 2]];
        if (V.scr === 'edge') return [[0, Infinity]];
        return [[-s / 2 - w / 2, -s / 2 + w / 2], [s / 2 - w / 2, s / 2 + w / 2]];
      }
      // k = m/(ħT) in 1/µm²; the phase of the path through u is k[(u − 0)² + (xb − u)²] = 2k(u − c)² + k xb²/2, c = xb/2
      const kOf = () => me / (hb * V.T * 1e-9) * 1e-12;
      function amp(xb) {
        const a = 2 * kOf(), c = xb / 2, sc = Math.sqrt(2 * a / Math.PI);
        let re = 0, im = 0;
        for (const [u1, u2] of open()) { const f1 = fresnel((u1 - c) * sc), f2 = fresnel((u2 - c) * sc); re += f2[0] - f1[0]; im += f2[1] - f1[1]; }
        return (re * re + im * im) / 2;                        // the open screen gives (1 + 1)/2 = 1
      }
      const inOpen = u => open().some(([a, b]) => u >= a && u <= b);
      function update() {
        const k = kOf(), w = Math.sqrt(Math.PI / (2 * k)), c = V.xb / 2, al = 2 * k, sc = Math.sqrt(2 * al / Math.PI), norm = Math.sqrt(Math.PI / al);
        // the arrows for the chain, in order of u: one arrow per open point within ±4.5 zones of the stationary point
        // (each worth e^{iφ} du), and each open part outside that window as a single arrow, its exact Fresnel integral
        const wl = c - 4.5 * w, wh = c + 4.5 * w, du = (wh - wl) / 700, zs = [], c0 = Q.expi(k * V.xb * V.xb / 2);
        hues = [];
        const exact = (u1, u2) => { const f1 = fresnel((u1 - c) * sc), f2 = fresnel((u2 - c) * sc); return Q.scale(Q.mul(c0, Q.cx(f2[0] - f1[0], f2[1] - f1[1])), Math.SQRT1_2); };
        for (const [a, b] of open()) {
          if (a < wl) { const z = exact(a, Math.min(b, wl)); zs.push(z); hues.push(phaseHue(Q.arg(z))); }
          const s1 = Math.max(a, wl), s2 = Math.min(b, wh);
          for (let u = s1 + du / 2; u < s2; u += du) { const ph = k * (u * u + (V.xb - u) * (V.xb - u)); zs.push(Q.scale(Q.expi(ph), du / norm)); hues.push(phaseHue(ph)); }
          if (b > wh) { const z = exact(Math.max(a, wh), b); zs.push(z); hues.push(phaseHue(Q.arg(z))); }
        }
        chain = zs.length ? Q.arrowSum(zs).chain : [[0, 0], [0, 0]];
        const P = amp(V.xb);
        ro.set('w', w.toFixed(3) + ' µm'); ro.set('P', P.toFixed(3));
        ro.set('fr', V.scr === 'two' ? (h * V.T * 1e-9 / (2 * me * Math.max(V.sep, V.wd + 0.05) * 1e-6) * 1e6).toFixed(3) + ' µm' : '—');
        const pts = []; for (let i = 0; i <= 320; i++) { const x = -XR + 2 * XR * i / 320; pts.push([x, amp(x)]); }
        plot.set({ series: [{ pts, label: '|K|² with this screen' }, { pts: [[-XR, 1], [XR, 1]], label: 'no screen', dash: [5, 4], width: 1.4 }], marks: [{ x: V.xb, y: P, label: 'detector' }] });
      }
      kit.drag(st, {
        hover: true,
        hit(p) { return map && Math.abs(p.x - map.xd) < 22 && p.y > map.y0 - 10 && p.y < map.y1 + 10 ? 'd' : null; },
        move(k, p) { const x = clamp(map.lo + (map.y1 - p.y) / (map.y1 - map.y0) * (map.hi - map.lo), -XR, XR); ctl.set('xb', Math.round(x * 100) / 100); dirty = true; }
      });
      const loop = kit.loop(() => {
        if (dirty) { update(); dirty = false; }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const xs = 50, xd = W * 0.58, y0 = 18, y1 = H - 24, lo = -XR - 0.3, hi = XR + 0.3, xm = (xs + xd) / 2;
        map = { xd, y0, y1, lo, hi };
        const Y = x => y1 - (y1 - y0) * (x - lo) / (hi - lo);
        // the screen: open parts drawn as gaps
        c.fillStyle = C.text;
        const iv = open(), cuts = [lo];
        for (const [a, b] of iv) { cuts.push(Math.max(lo, a), Math.min(hi, b)); }
        cuts.push(hi);
        for (let i = 0; i + 1 < cuts.length; i += 2) { const a = cuts[i], b = cuts[i + 1]; if (b > a) c.fillRect(xm - 3, Y(b), 6, Y(a) - Y(b)); }
        // sample paths through the screen
        const k = kOf();
        for (let i = 0; i <= 40; i++) {
          const u = lo + (hi - lo) * i / 40, ok = inOpen(u), ph = k * (u * u + (V.xb - u) * (V.xb - u));
          c.strokeStyle = ok ? kit.hue(phaseHue(ph), 0.6) : C.faint; c.lineWidth = ok ? 1.3 : 0.8;
          c.beginPath(); c.moveTo(xs, Y(0)); c.lineTo(xm, Y(u)); if (ok) c.lineTo(xd, Y(V.xb)); c.stroke();
        }
        c.strokeStyle = C.ok; c.lineWidth = 2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(xs, Y(0)); c.lineTo(xd, Y(V.xb)); c.stroke(); c.setLineDash([]);
        kit.dot(c, xs, Y(0), 6, C.warn, C.text); kit.label(c, 'source', xs, Y(0) + 16, { align: 'center', size: 11.5, weight: 600 });
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(xd, y0); c.lineTo(xd, y1); c.stroke();
        kit.dot(c, xd, Y(V.xb), 7, C.accent, C.text); kit.label(c, 'detector (drag)', xd - 10, Y(V.xb) - 14, { align: 'right', size: 11.5, weight: 600 });
        kit.label(c, 'screen at T/2', xm, 10, { align: 'center', size: 11, color: C.muted });
        kit.label(c, 'x (µm) ↑   time →', xs - 40, H - 10, { size: 11, color: C.muted });
        for (let x = -4; x <= 4; x += 2) kit.label(c, String(x), xs - 12, Y(x), { align: 'right', size: 10.5, color: C.muted });
        const hs = Math.min(W * 0.17, H * 0.38);
        drawChain(c, kit, C, chain, W * 0.8, H / 2 + 8, hs, { title: 'arrows of the open paths', hue: i => hues[i] || 0, minExt: 0.35 });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ act-hbar-limit */
  const OBJECTS = {
    atom: { name: 'an electron in an atom', m: 9.109e-31, d: 1e-10, T: 1e-16 },
    beam: { name: 'an electron in a beam', m: 9.109e-31, d: 1e-6, T: 1e-9 },
    c60: { name: 'a C₆₀ molecule', m: 1.196e-24, d: 1e-7, T: 5e-10 },
    dust: { name: 'a 1 µg dust grain', m: 1e-9, d: 1e-6, T: 1 },
    ball: { name: 'a baseball', m: 0.145, d: 20, T: 0.5 }
  };
  const lenFmt = x => x >= 1 ? x.toPrecision(3) + ' m' : x >= 1e-3 ? (x * 1e3).toPrecision(3) + ' mm' : x >= 1e-6 ? (x * 1e6).toPrecision(3) + ' µm' : x >= 1e-9 ? (x * 1e9).toPrecision(3) + ' nm' : x.toExponential(2) + ' m';
  Hyper.sim('act-hbar-limit', {
    title: 'Turning down ħ: the classical limit',
    blurb: `A family of paths from A to B: the classical straight line plus a sideways bulge of size a. Each path's arrow is turned by its extra action, $\\Delta S/\\hbar = \\pi^2ma^2/4\\hbar T$. The shaded band marks the paths whose arrows are within half a turn of the classical one — the paths that really count. Everything depends on one number: ħ compared with the action scale of the motion, $md^2/T$.

**Try this**
- Slide ħ down: the band shrinks as √ħ, the spiral of arrows tightens, and the graph of cos(ΔS/ħ) oscillates ever faster away from a = 0. In the limit only the classical path is left.
- Slide ħ up towards 1: the band fills the whole picture — there is no longer any meaningful path.
- Pick real objects. An electron in an atom sits at the top of the scale: fully quantum. A molecule of 60 carbon atoms is in between. A dust grain and a baseball fall far off the bottom of the scale: their bands are 10⁻¹³ m and 10⁻¹⁷ m wide.`,
    mount(box, kit) {
      const Q = kit.qm;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 260 });
      const gb = plotHost(box);
      const ctl = kit.controls(box.side, [
        { id: 'obj', type: 'select', label: 'Object', options: [['Choose ħ with the slider', 'custom'], ['An electron in an atom (0.1 nm in 10⁻¹⁶ s)', 'atom'], ['An electron in a beam (1 µm in 1 ns)', 'beam'], ['A C₆₀ molecule (100 nm in 0.5 ns)', 'c60'], ['A 1 µg dust grain (1 µm in 1 s)', 'dust'], ['A baseball (20 m in 0.5 s)', 'ball']], value: 'custom' },
        { id: 'lr', label: 'log₁₀ of ħ ÷ (m d²/T)', min: -3.5, max: 0.3, step: 0.05, value: -1 }
      ], id => {
        if (id === 'lr') ctl.set('obj', 'custom');
        if (id === 'obj' && V.obj !== 'custom') { const o = OBJECTS[V.obj], r = 1.054571817e-34 * o.T / (o.m * o.d * o.d); ctl.set('lr', clamp(Math.log10(r), -3.5, 0.3)); }
        dirty = true;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r', 'ħ ÷ (m d²/T)'], ['band', 'Half-width of the band a*'], ['turn', 'Turns of the arrow at the edge (a = d/2)'], ['tot', 'Length of the total (all in line = 1)'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'bulge a, as a fraction of the distance d' }, y: { label: 'cos(ΔS/ħ)', min: -1.05, max: 1.05 }, legend: false }, 150);
      let dirty = true, chain = [[0, 0], [0, 0]], hues = [], total = Q.cx(0, 0);
      const rOf = () => {
        if (V.obj !== 'custom') { const o = OBJECTS[V.obj]; return 1.054571817e-34 * o.T / (o.m * o.d * o.d); }
        return Math.pow(10, V.lr);
      };
      const phase = (ad, r) => Math.PI * Math.PI / 4 * ad * ad / r;           // ΔS/ħ for a bulge a = ad·d
      function update() {
        const rTrue = rOf(), r = Math.max(rTrue, Math.pow(10, -3.5)), astar = Math.sqrt(4 * r / Math.PI);   // a*/d
        const off = rTrue < Math.pow(10, -3.5);
        const lim = Math.min(0.5, 6 * astar), N = 900, zs = []; hues = [];
        for (let i = 0; i < N; i++) { const ad = -lim + 2 * lim * (i + 0.5) / N, ph = phase(ad, r); zs.push(Q.scale(Q.expi(ph), 1 / N)); hues.push(phaseHue(ph)); }
        const s = Q.arrowSum(zs); chain = s.chain; total = s.total;
        ro.set('r', rTrue < 1e-3 ? rTrue.toExponential(1) : rTrue.toPrecision(2));
        const o = V.obj !== 'custom' ? OBJECTS[V.obj] : null, aTrue = Math.sqrt(4 * rTrue / Math.PI);
        ro.set('band', aTrue.toPrecision(2) + ' × d' + (o ? ' = ' + lenFmt(aTrue * o.d) : ''));
        ro.set('turn', (phase(0.5, rTrue) / TAU).toPrecision(3));
        ro.set('tot', Q.abs(total).toFixed(3) + (lim < 0.5 ? ' (of the paths shown)' : ''));
        ro.set('msg', off ? 'Far off the scale: shown at the smallest ħ; the real band is ' + (aTrue / astar).toExponential(0) + ' times thinner still.' : rTrue > 0.3 ? 'Fully quantum: no path stands out.' : rTrue > 3e-3 ? 'In between.' : 'Nearly classical.');
        const pl = Math.min(0.5, 8 * astar), pts = [];
        for (let i = 0; i <= 1000; i++) { const ad = -pl + 2 * pl * i / 1000; pts.push([ad, Math.cos(phase(ad, r))]); }
        plot.set({ series: [{ pts, label: 'cos(ΔS/ħ)', width: 1.6 }], x: { label: 'bulge a, as a fraction of the distance d', min: -pl, max: pl }, vlines: [{ x: -astar, label: '−a*' }, { x: astar, label: 'a*' }] });
        return { r, astar };
      }
      let U = update();
      const loop = kit.loop(() => {
        if (dirty) { U = update(); dirty = false; }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const x0 = 40, x1 = W * 0.58, yA = H * 0.72, yB = H * 0.28, dpx = Math.abs(yA - yB) * 1.0;
        // the band of paths that count, then the family of paths
        const band = U.astar * dpx;
        c.fillStyle = kit.hue(150, 0.22); c.beginPath();
        for (let i = 0; i <= 60; i++) { const t = i / 60; c.lineTo(x0 + (x1 - x0) * t, yA + (yB - yA) * t - band * Math.sin(Math.PI * t)); }
        for (let i = 60; i >= 0; i--) { const t = i / 60; c.lineTo(x0 + (x1 - x0) * t, yA + (yB - yA) * t + band * Math.sin(Math.PI * t)); }
        c.closePath(); c.fill();
        for (let j = -20; j <= 20; j++) {
          const ad = 0.5 * j / 20, ph = phase(ad, U.r), inside = Math.abs(ad) <= U.astar;
          c.strokeStyle = inside ? C.accent : kit.hue(phaseHue(ph), 0.22); c.lineWidth = inside ? 1.6 : 1;
          c.beginPath(); for (let i = 0; i <= 40; i++) { const t = i / 40; c.lineTo(x0 + (x1 - x0) * t, yA + (yB - yA) * t - ad * dpx * Math.sin(Math.PI * t)); } c.stroke();
        }
        c.strokeStyle = C.ok; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, yA); c.lineTo(x1, yB); c.stroke();
        kit.dot(c, x0, yA, 6, C.text); kit.dot(c, x1, yB, 6, C.text);
        kit.label(c, 'A', x0 - 8, yA, { align: 'right', size: 13, weight: 700 }); kit.label(c, 'B', x1 + 8, yB, { size: 13, weight: 700 });
        kit.label(c, 'band of paths that count (±a*)', x0, 14, { size: 11.5, color: C.ok, weight: 600 });
        kit.label(c, 'time →', x1, H - 10, { align: 'right', size: 11, color: C.muted });
        const hs = Math.min(W * 0.17, H * 0.38);
        drawChain(c, kit, C, chain, W * 0.8, H / 2 + 8, hs, { title: 'arrows added, a from − to +', hue: i => hues[i] || 0, minExt: 0.3 });
      }, box.stage);
      loop.start();
    }
  });

})();
