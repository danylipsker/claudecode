/* HYPER-FEYNMAN · sims/matter.js — simulations for Inside Matter (content/matter.js).
 *   mat-tiling    tiling the plane with 2-, 3-, 4- and 6-fold cells; pentagons leave gaps; a Penrose tiling; the rotation proof
 *   mat-tensor    a tensor as the ellipse a crystal turns a circle of pushes into (polarizability or stress); turn the axes
 *   mat-bvl       classical charges in a box and a field: bulk and skipping orbits cancel (Bohr–van Leeuwen); quantum spins do not
 *   mat-nmr       a magnetic moment precessing in B0, tipped over by a rotating B1 at the Larmor frequency (lab or rotating frame)
 *   mat-weiss     Weiss's mean field: solving m = tanh(Tc(m + h)/T) graphically, with the iteration and m0(T)
 *   mat-domains   a 2-D grid of spins (Ising model): domains, and a hysteresis loop as the field is swept
 *   mat-elastic   stretching, bending and twisting a bar of a chosen material (Hooke, Poisson, beam, torsion)
 *   mat-dry-flow  potential flow round a cylinder with circulation: streamlines, tracers, Bernoulli pressure, no drag, lift
 *   mat-shear     a plate starts sliding over a fluid layer: momentum diffuses in, the profile becomes Couette flow
 *   mat-wake      a lattice-Boltzmann fluid past a cylinder: from smooth flow to attached eddies to a Kármán vortex street
 */
(function () {
  'use strict';

  const TAU = Math.PI * 2, DEG = Math.PI / 180;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fmt = (v, s) => { if (!Number.isFinite(v)) return '—'; const a = Math.abs(v); if (a !== 0 && (a >= 1e5 || a < 1e-3)) return v.toExponential((s || 3) - 1).replace('e+', 'e'); return String(+v.toPrecision(s || 3)); };
  function polyPath(c, pts) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); }
  function regular(cx, cy, r, n, a0) { const p = []; for (let k = 0; k < n; k++) p.push([cx + r * Math.cos(a0 + k * TAU / n), cy + r * Math.sin(a0 + k * TAU / n)]); return p; }
  // a small, fast, seeded random generator for the Monte Carlo loops: () -> [0, 1)
  function xorshift(seed) { let x = (seed >>> 0) || 1; return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return (x >>> 0) / 4294967296; }; }

  /* ================================================================ mat-tiling */
  // polygons of a pattern around the axis at (0, 0), y up; each { pts, k } with k the colour class
  function lattice(mode, s, R) {
    const out = [], M = Math.ceil(R / s) + 2;
    if (mode === 4) {
      for (let i = -M; i <= M; i++) for (let j = -M; j <= M; j++) out.push({ pts: [[(i - 0.5) * s, (j - 0.5) * s], [(i + 0.5) * s, (j - 0.5) * s], [(i + 0.5) * s, (j + 0.5) * s], [(i - 0.5) * s, (j + 0.5) * s]], k: (i + j) & 1 });
    } else if (mode === 3) {
      const h = s * Math.sqrt(3) / 2, P = (i, j) => [i * s + j * s / 2, j * h];
      for (let i = -M - 3; i <= M + 3; i++) for (let j = -M; j <= M; j++) {
        out.push({ pts: [P(i, j), P(i + 1, j), P(i, j + 1)], k: 0 });
        out.push({ pts: [P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)], k: 1 });
      }
    } else if (mode === 6) {
      const r = s * 0.62, w = r * Math.sqrt(3), M2 = Math.ceil(R / w) + 2;
      for (let i = -M2 - 3; i <= M2 + 3; i++) for (let j = -M2; j <= M2; j++) out.push({ pts: regular(i * w + j * w / 2, j * 1.5 * r, r, 6, Math.PI / 6), k: 0 });
    } else if (mode === 2) {
      const a = [s, 0], b = [0.38 * s, 0.86 * s];
      for (let i = -M - 2; i <= M + 2; i++) for (let j = -M; j <= M; j++) {
        const x = i * a[0] + j * b[0], y = j * b[1];
        out.push({ pts: [[x, y], [x + a[0], y], [x + a[0] + b[0], y + b[1]], [x + b[0], y + b[1]]], k: (i + j) & 1 });
      }
    } else if (mode === 5) {
      // a central pentagon and its five edge neighbours; between neighbours, 36° gaps
      const Rp = s * 0.85, rin = Rp * Math.cos(Math.PI / 5), a0 = Math.PI / 2;
      const cen = regular(0, 0, Rp, 5, a0);
      out.push({ pts: cen, k: 0 });
      const nb = [];
      for (let k = 0; k < 5; k++) {
        const an = a0 + k * TAU / 5 + Math.PI / 5;
        const p = regular(2 * rin * Math.cos(an), 2 * rin * Math.sin(an), Rp, 5, an);
        nb.push(p); out.push({ pts: p, k: 1 });
      }
      for (let k = 0; k < 5; k++) {
        const V = cen[(k + 1) % 5], far = p => { let best = null, bd = -1; for (const q of p) { const d = Math.hypot(q[0] - V[0], q[1] - V[1]); if (d > Rp * 0.5 && d < Rp * 1.4 && Math.hypot(q[0], q[1]) > bd) { bd = Math.hypot(q[0], q[1]); best = q; } } return best; };
        const P1 = far(nb[k]), P2 = far(nb[(k + 1) % 5]);
        if (P1 && P2) out.push({ pts: [V, P1, P2], k: 2, gap: true });
      }
    }
    return out;
  }
  // a Penrose rhombus tiling by subdividing Robinson triangles (a sun of ten triangles to start)
  function penrose(R, levels) {
    const g = (1 + Math.sqrt(5)) / 2;
    let tri = [];
    for (let i = 0; i < 10; i++) {
      let B = [R * Math.cos((2 * i - 1) * Math.PI / 10), R * Math.sin((2 * i - 1) * Math.PI / 10)], C = [R * Math.cos((2 * i + 1) * Math.PI / 10), R * Math.sin((2 * i + 1) * Math.PI / 10)];
      if (i % 2 === 0) { const t = B; B = C; C = t; }
      tri.push([0, [0, 0], B, C]);
    }
    const lerp = (P, Q, f) => [P[0] + (Q[0] - P[0]) * f, P[1] + (Q[1] - P[1]) * f];
    for (let l = 0; l < levels; l++) {
      const nt = [];
      for (const [k, A, B, C] of tri) {
        if (k === 0) { const P = lerp(A, B, 1 / g); nt.push([0, C, P, B], [1, P, C, A]); }
        else { const Q = lerp(B, A, 1 / g), Rr = lerp(B, C, 1 / g); nt.push([1, Rr, C, A], [1, Q, Rr, B], [0, Rr, Q, A]); }
      }
      tri = nt;
    }
    return tri;
  }

  Hyper.sim('mat-tiling', {
    title: 'Which turns can a crystal survive?',
    blurb: `Left: a pattern and a copy of it (outlined) that you can turn about the marked axis. When the copy lands exactly on the pattern, that turn is a symmetry. Right: the proof that no lattice has a 5-fold axis. Take two neighbouring lattice points A and B, the shortest distance $a$ apart; turn B about A by 360°/n and A about B the other way. The two new points must also be lattice points — so their distance $d = a\\,|1 - 2\\cos(360°/n)|$ must be 0 or a whole number of $a$.

**Try this**
- Squares, triangles, hexagons, parallelograms: press *Turn by 360°/n* and watch the copy land on the pattern — a 4-fold, 3-fold, 6-fold or 2-fold axis.
- Pentagons: three meet with a 36° gap at every corner (orange); a second ring would overlap. Pentagons cannot tile a floor.
- Move the proof slider to n = 5, 7, 8: the turned points land *closer* than $a$ — impossible. Only n = 2, 3, 4 and 6 survive (the [[?sine-cosine|cosine]] of the turn must be 0, ±½ or ±1).
- Penrose tiling: turning by 72° about the centre maps the pattern onto itself — five-fold order — but no shift ever does. That is a quasicrystal.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const MODES = [['Squares (4-fold)', 4], ['Triangles (3-fold)', 3], ['Hexagons (6-fold)', 6], ['Parallelograms (2-fold)', 2], ['Pentagons: try 5-fold', 5], ['Penrose tiling (quasicrystal)', 'p']];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Pattern', options: MODES, value: params && params.mode != null ? params.mode : 4 },
        { id: 'ang', label: 'Turn the copy about the marked axis', min: 0, max: 360, step: 1, value: 0, unit: '°' },
        { type: 'buttons', items: [{ id: 'turn', label: 'Turn by 360°/n', primary: true }, { id: 'zero', label: 'Back to 0°' }] },
        { id: 'n', label: 'The proof: an axis of order n', min: 2, max: 12, step: 1, value: 5 },
        { type: 'buttons', items: [{ id: 'play', label: 'Replay the proof' }] }
      ], (id, v) => {
        if (id === 'mode') { geom = null; target = null; ctl.set('ang', 0); if (typeof v === 'number') ctl.set('n', v); else ctl.set('n', 5); proof = 0; }
        if (id === 'turn') { const n = order(); target = (Math.floor(V.ang / (360 / n) + 1e-6) + 1) * 360 / n; }
        if (id === 'zero') { target = null; ctl.set('ang', 0); }
        if (id === 'n' || id === 'play') proof = 0;
        if (id === 'ang') target = null;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fit', 'Turned copy'], ['sym', 'Symmetry at the mark'], ['c2', 'Proof: 2cos(360°/n)'], ['d', 'd / a'], ['ver', 'Verdict']]);
      const order = () => V.mode === 'p' ? 5 : V.mode;
      let geom = null, gW = 0, target = null, proof = 0;
      function build(pw, ph) {
        const R = Math.hypot(pw, ph) / 2 + 20, s = clamp(Math.min(pw, ph) / 7, 26, 60);
        if (V.mode === 'p') {
          const lv = clamp(Math.round(Math.log(R / 24) / Math.log((1 + Math.sqrt(5)) / 2)), 3, 7);
          geom = { pen: penrose(R, lv) };
        } else geom = { polys: lattice(V.mode, s, R), s };
        gW = pw;
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const pw = W * 0.6, cx = pw / 2, cy = H / 2;
        if (!geom || gW !== pw) build(pw, H);
        if (target != null) { const a = Math.min(target, V.ang + 90 * dt); ctl.set('ang', a >= target - 1e-6 ? target % 360 : a); if (a >= target - 1e-6) target = null; }
        proof = Math.min(1, proof + dt / 1.8);
        const n = order(), ang = V.ang * DEG, step = 360 / n, rem = ((V.ang % step) + step) % step, fits = rem < 0.5 || step - rem < 0.5;
        // the pattern (y up), clipped to the left panel
        c.save(); c.beginPath(); c.rect(0, 0, pw, H); c.clip();
        c.translate(cx, cy); c.scale(1, -1);
        const fills = [kit.hue(210, 0.28), kit.hue(28, 0.28), kit.hue(28, 0.75)];
        if (geom.pen) {
          for (const [k, A, B, Cc] of geom.pen) { c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.lineTo(Cc[0], Cc[1]); c.closePath(); c.fillStyle = k ? kit.hue(160, 0.35) : kit.hue(280, 0.3); c.fill(); }
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath();
          for (const [, A, B, Cc] of geom.pen) { c.moveTo(Cc[0], Cc[1]); c.lineTo(A[0], A[1]); c.lineTo(B[0], B[1]); }
          c.stroke();
          // the turned copy
          c.save(); c.rotate(ang); c.strokeStyle = C.accent; c.globalAlpha = 0.85; c.lineWidth = 1.8; c.beginPath();
          for (const [, A, B, Cc] of geom.pen) { c.moveTo(Cc[0], Cc[1]); c.lineTo(A[0], A[1]); c.lineTo(B[0], B[1]); }
          c.stroke(); c.restore();
        } else {
          for (const p of geom.polys) { polyPath(c, p.pts); c.fillStyle = fills[p.k]; c.fill(); c.strokeStyle = p.gap ? C.bad : C.muted; c.lineWidth = 1.2; c.stroke(); }
          c.save(); c.rotate(ang); c.strokeStyle = C.accent; c.globalAlpha = 0.9; c.lineWidth = 2;
          for (const p of geom.polys) if (!p.gap) { polyPath(c, p.pts); c.stroke(); }
          c.restore();
        }
        // the axis symbol: a small n-gon
        polyPath(c, regular(0, 0, 8, n === 2 ? 2 : n, Math.PI / 2));
        if (n === 2) { c.beginPath(); c.ellipse(0, 0, 4, 9, 0, 0, TAU); }
        c.fillStyle = fits ? C.ok : C.warn; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
        c.restore();
        if (V.mode === 5 && geom.polys) {
          const g = geom.polys.find(p => p.gap);
          if (g) { const mx = (g.pts[0][0] + g.pts[1][0] + g.pts[2][0]) / 3, my = (g.pts[0][1] + g.pts[1][1] + g.pts[2][1]) / 3; kit.label(c, 'gap 36°', cx + mx + 8, cy - my - 10, { size: 12, color: C.bad, bg: C.surface }); }
          kit.label(c, '3 × 108° = 324°: 36° left over', 10, H - 16, { size: 12, color: C.text, bg: C.surface });
        }
        if (V.mode === 'p') kit.label(c, 'ordered, 5-fold, never repeating', 10, H - 16, { size: 12, color: C.text, bg: C.surface });
        kit.label(c, 'turned by ' + Math.round(V.ang) + '°' + (fits ? ' — lands on itself' : ''), 10, 16, { size: 12.5, color: fits ? C.ok : C.text, bg: C.surface, weight: 600 });
        // divider
        c.fillStyle = C.surface; c.fillRect(pw, 0, W - pw, H); c.strokeStyle = C.border || C.faint; c.beginPath(); c.moveTo(pw + 0.5, 0); c.lineTo(pw + 0.5, H); c.stroke();
        // the proof panel
        const nP = V.n, phi = TAU / nP * proof, qw = W - pw, a = clamp(Math.min(qw / 4.3, H / 3.6), 20, 90);
        const Ax = pw + qw / 2 - a / 2, Bx = Ax + a, by = H * 0.64;
        kit.label(c, 'the proof, n = ' + nP + ' (turn ' + (360 / nP).toFixed(nP === 7 || nP === 11 ? 1 : 0) + '°)', pw + 10, 16, { size: 12.5, weight: 600, color: C.text });
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(pw + 6, by); c.lineTo(W - 6, by); c.stroke();
        for (let k = -4; k <= 5; k++) { const x = Ax + k * a; if (x > pw + 4 && x < W - 4) kit.dot(c, x, by, 3, C.muted); }
        const Bp = [Ax + a * Math.cos(phi), by - a * Math.sin(phi)], Ap = [Bx - a * Math.cos(phi), by - a * Math.sin(phi)];
        c.strokeStyle = kit.hue(210, 0.8); c.lineWidth = 1.5; c.setLineDash([4, 3]);
        c.beginPath(); c.arc(Ax, by, a, -phi, 0); c.stroke();
        c.strokeStyle = kit.hue(28, 0.8); c.beginPath(); c.arc(Bx, by, a, Math.PI, Math.PI + phi); c.stroke(); c.setLineDash([]);
        kit.dot(c, Ax, by, 5, C.text); kit.dot(c, Bx, by, 5, C.text);
        kit.label(c, 'A', Ax - 4, by + 15, { size: 12, align: 'center', weight: 700 }); kit.label(c, 'B', Bx + 4, by + 15, { size: 12, align: 'center', weight: 700 });
        kit.dot(c, Bp[0], Bp[1], 5, kit.hue(210)); kit.dot(c, Ap[0], Ap[1], 5, kit.hue(28));
        kit.label(c, "B'", Bp[0], Bp[1] - 13, { size: 12, align: 'center', weight: 700, color: kit.hue(210) });
        kit.label(c, "A'", Ap[0], Ap[1] - 13, { size: 12, align: 'center', weight: 700, color: kit.hue(28) });
        const c2 = 2 * Math.cos(TAU / nP), dA = Math.abs(1 - c2), whole = Math.abs(dA - Math.round(dA)) < 1e-9;
        if (proof >= 1) {
          // the row through A' and B' must hold lattice points a apart
          const yl = Ap[1], x0 = Math.min(Ap[0], Bp[0]);
          c.strokeStyle = C.faint; c.setLineDash([2, 4]); c.beginPath(); c.moveTo(pw + 6, yl); c.lineTo(W - 6, yl); c.stroke(); c.setLineDash([]);
          for (let k = 0; k <= 4; k++) { const x = x0 + k * a; if (x < W - 4) { c.strokeStyle = C.muted; c.beginPath(); c.moveTo(x, yl - 5); c.lineTo(x, yl + 5); c.stroke(); } }
          if (Math.abs(Ap[0] - Bp[0]) > 1) { c.strokeStyle = whole ? C.ok : C.bad; c.lineWidth = 3; c.beginPath(); c.moveTo(Ap[0], yl + 10); c.lineTo(Bp[0], yl + 10); c.stroke(); }
          kit.label(c, 'd = ' + dA.toFixed(3) + ' a', (Ap[0] + Bp[0]) / 2, yl + 24, { size: 12.5, align: 'center', color: whole ? C.ok : C.bad, weight: 700, bg: C.surface });
          kit.label(c, whole ? (dA < 1e-9 ? 'A\' and B\' coincide: allowed' : 'a whole number of a: allowed') : (dA < 1 ? 'closer than a: impossible' : 'not a whole number of a: impossible'), pw + qw / 2, H - 16, { size: 12.5, align: 'center', color: whole ? C.ok : C.bad, weight: 700 });
        }
        ro.set('fit', fits ? 'lands on itself' : 'does not fit');
        ro.set('sym', V.mode === 'p' ? '5-fold (about the centre only)' : V.mode === 5 ? '5-fold locally — but gaps' : n + '-fold axis');
        ro.set('c2', c2.toFixed(3)); ro.set('d', dA.toFixed(3)); ro.set('ver', whole ? 'allowed in a lattice' : 'impossible in a lattice');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mat-tensor */
  Hyper.sim('mat-tensor', {
    title: 'A tensor: a circle of pushes becomes an ellipse',
    blurb: `A crystal turns a push into a response. Every push of the same size — its tip on the grey circle — gives a response whose tip lies on the coloured ellipse. Only along the crystal's two principal axes (dashed) is the response parallel to the push. The numbers in the box are the [[?tensor]]'s components on *our* x–y axes: turn the axes and they change, while the ellipse — the crystal's behaviour — stays exactly where it was. Their sum (the trace) and the [[?determinant]] never change.

**Try this**
- Watch the push sweep round: the response leans toward the long axis of the ellipse, and lines up with the push only on the principal axes.
- Turn our axes: α_xx, α_xy and α_yy change; trace and determinant do not. Turn them to the crystal's axes and α_xy becomes 0.
- Make the two principal values equal: the ellipse becomes a circle, like glass or a cubic crystal — every response is parallel to its push.
- Switch to stress: the push is the normal of a little surface inside a solid, the response the force per area on it. Split into a normal part and a shear part: with one principal stress only (a rod in tension), the shear is largest on the surface at 45°.
- Drag the push arrow yourself.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Tensor', options: [['Polarizability: field in, polarization out', 'pol'], ['Stress: surface normal in, force per area out', 'str']], value: 'pol' },
        { id: 'a1', label: 'Principal value α₁', min: 0.2, max: 3, step: 0.05, value: 2.2 },
        { id: 'a2', label: 'Principal value α₂', min: 0.2, max: 3, step: 0.05, value: 0.9 },
        { id: 's1', label: 'Principal stress σ₁ (+ pull, − push)', min: -100, max: 100, step: 1, value: 100, unit: 'MPa' },
        { id: 's2', label: 'Principal stress σ₂', min: -100, max: 100, step: 1, value: 0, unit: 'MPa' },
        { id: 'cry', label: 'Crystal axis 1 at', min: 0, max: 180, step: 1, value: 25, unit: '°' },
        { id: 'axes', label: 'Turn our x–y axes by', min: 0, max: 180, step: 1, value: 0, unit: '°' },
        { id: 'push', label: 'Direction of the push', min: 0, max: 360, step: 1, value: 60, unit: '°' },
        { id: 'sweep', type: 'check', label: 'Sweep the push round', value: true },
        { id: 'fan', type: 'check', label: 'Show 16 pushes and where they go', value: true }
      ], id => { if (id === 'kind') modeUI(); if (id === 'push') ctl.set('sweep', false); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['E', 'Push (our axes)'], ['P', 'Response (our axes)'], ['ang', 'Angle between them'], ['sh', 'Normal / shear part'], ['tr', 'Trace (invariant)'], ['det', 'Determinant (invariant)']]);
      function modeUI() { const s = V.kind === 'str'; ctl.show('a1', !s); ctl.show('a2', !s); ctl.show('s1', s); ctl.show('s2', s); ro.show('sh', s); }
      modeUI();
      let O = [0, 0], rc = 1, pushAng = V.push;
      kit.drag(st, {
        hit: p => Math.abs(Math.hypot(p.x - O[0], p.y - O[1]) - rc) < 22 ? 'push' : null,
        move: (w, p) => { const a = Math.atan2(-(p.y - O[1]), p.x - O[0]) / DEG; pushAng = (a + 360) % 360; ctl.set('push', Math.round(pushAng)); ctl.set('sweep', false); },
        hover: true
      });
      let tick = 0;
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        if (V.sweep) { pushAng = (pushAng + 36 * dt) % 360; if ((tick++ & 7) === 0) ctl.set('push', Math.round(pushAng)); } else pushAng = V.push;
        const str = V.kind === 'str', v1 = str ? V.s1 : V.a1, v2 = str ? V.s2 : V.a2, big = Math.max(Math.abs(v1), Math.abs(v2), 1e-9);
        O = [W * 0.4, H / 2];
        const Rmax = Math.min(W * 0.36, H * 0.44);
        rc = str ? Rmax * 0.55 : Rmax / Math.max(1, big);
        const k = str ? Rmax / Math.max(big, 1) : rc;         // pixels per unit of response
        const u1 = [Math.cos(V.cry * DEG), Math.sin(V.cry * DEG)], u2 = [-u1[1], u1[0]];
        const resp = e => { const e1 = e[0] * u1[0] + e[1] * u1[1], e2 = e[0] * u2[0] + e[1] * u2[1]; return [v1 * e1 * u1[0] + v2 * e2 * u2[0], v1 * e1 * u1[1] + v2 * e2 * u2[1]]; };
        const S = (x, y) => [O[0] + x, O[1] - y];
        // crystal axes, dashed
        c.setLineDash([6, 5]); c.strokeStyle = C.faint; c.lineWidth = 1.2;
        for (const u of [u1, u2]) { const a = S(-u[0] * Rmax * 1.15, -u[1] * Rmax * 1.15), b = S(u[0] * Rmax * 1.15, u[1] * Rmax * 1.15); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
        c.setLineDash([]);
        const l1 = S(u1[0] * Rmax * 1.2, u1[1] * Rmax * 1.2), l2 = S(u2[0] * Rmax * 1.2, u2[1] * Rmax * 1.2);
        kit.label(c, 'crystal axis 1', l1[0], l1[1], { size: 11.5, color: C.muted, align: 'center' }); kit.label(c, 'axis 2', l2[0], l2[1], { size: 11.5, color: C.muted, align: 'center' });
        // our axes
        const ax = V.axes * DEG, ex = [Math.cos(ax), Math.sin(ax)], ey = [-ex[1], ex[0]], La = Rmax * 1.05;
        for (const [e, nm] of [[ex, 'x'], [ey, 'y']]) { const a = S(-e[0] * La * 0.3, -e[1] * La * 0.3), b = S(e[0] * La, e[1] * La); kit.arrow(c, a[0], a[1], b[0], b[1], C.axis || C.muted, 1.4); kit.label(c, nm, b[0] + 8 * e[0], b[1] - 8 * e[1], { size: 13, weight: 700, color: C.muted, align: 'center' }); }
        // circle of pushes and ellipse of responses
        c.strokeStyle = C.faint; c.lineWidth = 1.5; c.beginPath(); c.arc(O[0], O[1], rc, 0, TAU); c.stroke();
        c.beginPath();
        for (let i = 0; i <= 120; i++) { const t = i / 120 * TAU, r = resp([Math.cos(t), Math.sin(t)]), p = S(r[0] * k, r[1] * k); if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.stroke();
        if (V.fan) for (let i = 0; i < 16; i++) {
          const t = i / 16 * TAU, e = [Math.cos(t), Math.sin(t)], r = resp(e), a = S(e[0] * rc, e[1] * rc), b = S(r[0] * k, r[1] * k);
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
          kit.dot(c, a[0], a[1], 2.2, C.muted); kit.dot(c, b[0], b[1], 2.2, C.accent);
        }
        // the push and its response
        const pa = pushAng * DEG, E = [Math.cos(pa), Math.sin(pa)], P = resp(E), Et = S(E[0] * rc, E[1] * rc), Pt = S(P[0] * k, P[1] * k);
        kit.arrow(c, O[0], O[1], Et[0], Et[1], C.text, 2.2);
        kit.arrow(c, O[0], O[1], Pt[0], Pt[1], kit.hue(28), 3);
        kit.label(c, str ? 'normal n' : 'push E', Et[0] + 10 * E[0], Et[1] - 10 * E[1] - 8, { size: 12, weight: 600, color: C.text, bg: C.surface });
        kit.label(c, str ? 'force/area t' : 'response P', Pt[0] + 10, Pt[1] + 12, { size: 12, weight: 600, color: kit.hue(28), bg: C.surface });
        let normal = 0, shear = 0;
        if (str) {
          // the little surface element at the tip of n, and t split into normal and shear parts
          const tn = P[0] * E[0] + P[1] * E[1]; normal = tn; shear = -P[0] * E[1] + P[1] * E[0];
          const sp = [-E[1], E[0]], a = S(E[0] * rc + sp[0] * 22, E[1] * rc + sp[1] * 22), b = S(E[0] * rc - sp[0] * 22, E[1] * rc - sp[1] * 22);
          c.strokeStyle = C.muted; c.lineWidth = 4; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
          const Nn = S(E[0] * tn * k, E[1] * tn * k), Ss = S(sp[0] * shear * k, sp[1] * shear * k);
          c.setLineDash([4, 3]); kit.arrow(c, O[0], O[1], Nn[0], Nn[1], kit.hue(210), 1.6); kit.arrow(c, O[0], O[1], Ss[0], Ss[1], kit.hue(330), 1.6); c.setLineDash([]);
        }
        // the table of components on our axes
        const th = (V.cry - V.axes) * DEG, cs = Math.cos(th), sn = Math.sin(th);
        const xx = v1 * cs * cs + v2 * sn * sn, yy = v1 * sn * sn + v2 * cs * cs, xy = (v1 - v2) * sn * cs;
        const bx = W * 0.79, byy = 22, sym = str ? 'σ' : 'α', f2 = v => (Math.abs(v) < 5e-4 ? 0 : v).toFixed(str ? 1 : 3);
        kit.label(c, 'components on our axes', bx, byy, { size: 12, color: C.muted, align: 'center' });
        c.strokeStyle = C.text; c.lineWidth = 1.5; const mw = 150, mh = 50, mx = bx - mw / 2, my = byy + 12;
        c.beginPath(); c.moveTo(mx + 6, my); c.lineTo(mx, my); c.lineTo(mx, my + mh); c.lineTo(mx + 6, my + mh); c.moveTo(mx + mw - 6, my); c.lineTo(mx + mw, my); c.lineTo(mx + mw, my + mh); c.lineTo(mx + mw - 6, my + mh); c.stroke();
        kit.label(c, f2(xx), mx + mw * 0.28, my + 14, { size: 13, align: 'center', weight: 600 }); kit.label(c, f2(xy), mx + mw * 0.72, my + 14, { size: 13, align: 'center', weight: 600, color: Math.abs(xy) < 5e-3 * big ? C.ok : C.text });
        kit.label(c, f2(xy), mx + mw * 0.28, my + 36, { size: 13, align: 'center', weight: 600, color: Math.abs(xy) < 5e-3 * big ? C.ok : C.text }); kit.label(c, f2(yy), mx + mw * 0.72, my + 36, { size: 13, align: 'center', weight: 600 });
        kit.label(c, sym + 'xx  ' + sym + 'xy / ' + sym + 'yx  ' + sym + 'yy', bx, my + mh + 14, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'trace ' + (xx + yy).toFixed(str ? 1 : 3) + '   det ' + (xx * yy - xy * xy).toFixed(str ? 0 : 3), bx, my + mh + 34, { size: 12, color: C.ok, align: 'center', weight: 600 });
        const dang = (() => { let d = (Math.atan2(P[1], P[0]) - pa) / DEG; d = ((d + 540) % 360) - 180; return d; })();
        const along = Math.hypot(P[0], P[1]) > 1e-9 && (Math.abs(dang) < 0.8 || Math.abs(Math.abs(dang) - 180) < 0.8);
        if (along) kit.label(c, 'along a principal axis: response ∥ push', W * 0.4, H - 16, { size: 12.5, color: C.ok, align: 'center', weight: 600, bg: C.surface });
        // readouts in our axes
        const inOur = v => [v[0] * ex[0] + v[1] * ex[1], v[0] * ey[0] + v[1] * ey[1]];
        const Eo = inOur(E), Po = inOur(P), u = str ? ' MPa' : '';
        ro.set('E', '(' + Eo[0].toFixed(2) + ', ' + Eo[1].toFixed(2) + ')');
        ro.set('P', '(' + Po[0].toFixed(str ? 1 : 2) + ', ' + Po[1].toFixed(str ? 1 : 2) + ')' + u);
        ro.set('ang', Math.hypot(P[0], P[1]) > 1e-9 ? Math.abs(dang).toFixed(1) + '°' : '—');
        ro.set('sh', normal.toFixed(1) + ' / ' + Math.abs(shear).toFixed(1) + ' MPa');
        ro.set('tr', (xx + yy).toFixed(str ? 1 : 3) + u);
        ro.set('det', (xx * yy - xy * xy).toFixed(str ? 0 : 3) + (str ? ' MPa²' : ''));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mat-bvl */
  // electrons (charge −e) at 300 K in a 4 µm box; time slowed so that a thermal electron crosses the box in about 3 s
  const QE = 1.602176634e-19, ME = 9.1093837015e-31, KB = 1.380649e-23, MUB = 9.2740100783e-24;
  Hyper.sim('mat-bvl', {
    title: 'Classical charges cannot be magnetized — spins can',
    blurb: `**Classical charges.** Electrons at room temperature (1200 of them; 500 are drawn) bounce around a box 4 µm wide in a magnetic field pointing out of the screen, and now and then collide with the lattice, which keeps them at 300 K. The field bends every path into a circle but never changes a speed — the magnetic force does no work. Electrons whose whole circle fits inside the box (blue) circulate one way: each is a little current loop opposing the field, a diamagnetic moment. Electrons near the walls (orange) cannot finish their circles and **skip along the walls** the other way round. The bars and the graph show the running averages of the two moments: they come out equal and opposite, and the total goes to zero. That is the Bohr–van Leeuwen theorem: classical physics gives no magnetism.

**Quantum spins.** Each electron now carries a spin with a moment of one Bohr magneton that can only point along the field or against it. The energies differ by $2\\mu_B B$, the [[?boltzmann-factor]] favours the lower one, and a net moment appears: $M = N\\mu_B\\tanh(\\mu_B B/kT)$.

**Try this**
- Classical: wait 20–30 s and compare the bulk and skipping bars. Change B: the orbits shrink, more electrons are "bulk", the bulk moment changes — and the total still averages to zero.
- Weak field (0.1 T): the circles are as big as the box, and nearly every electron skips.
- Quantum: at 300 K and 1 T the spins are almost 50 : 50 (μ_B B/kT = 0.002). Cool to 4 K and raise B to 5 T: most spins line up.
- Compare the measured point with the tanh curve and with Curie's straight line for weak fields.`,
    mount(box, kit, params) {
      const Q = kit.qm, R = Q.rng(1911);
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Model', options: [['Classical charges in a box', 'classical'], ['Quantum spins (spin ½)', 'spin']], value: params && params.mode === 'spin' ? 'spin' : 'classical' },
        { id: 'B', label: 'Magnetic field B', min: 0.05, max: 2, step: 0.05, value: 1, unit: 'T' },
        { id: 'Bs', label: 'Magnetic field B', min: 0, max: 10, step: 0.1, value: 1, unit: 'T' },
        { id: 'T', label: 'Temperature', min: 0.5, max: 300, value: 300, unit: 'K', log: true, sig: 3 },
        { id: 'trails', type: 'check', label: 'Show paths', value: true },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again', primary: true }] }
      ], id => { if (id === 'mode') { modeUI(); reset(); } else if (id === 'reset' || id === 'B') resetAvg(); else if (id === 'Bs' || id === 'T') { spinAvg = 0; spinT = 0; } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rc', 'Typical orbit radius'], ['nb', 'Bulk / skipping electrons'], ['mb', 'Bulk orbits (average)'], ['me', 'Skipping orbits (average)'], ['mt', 'Total (average)'], ['tt', 'Averaged over'],
        ['x', 'μ_B B / kT'], ['th', 'Predicted tanh(μ_B B/kT)'], ['meas', 'Measured (N↑ − N↓)/N'], ['M', 'M for 10²⁸ spins per m³'], ['chi', 'Susceptibility χ']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)', min: 0 }, y: { label: 'moment per electron (µB)' }, legend: true }, 170);
      function modeUI() {
        const s = V.mode === 'spin';
        ctl.show('B', !s); ctl.show('trails', !s); ctl.show('Bs', s); ctl.show('T', s);
        for (const k of ['rc', 'nb', 'mb', 'me', 'mt', 'tt']) ro.show(k, !s);
        for (const k of ['x', 'th', 'meas', 'M', 'chi']) ro.show(k, s);
      }
      // classical state, in µm and µm per (display) second; 1200 electrons simulated, 500 drawn
      const L = 4, N = 1200, NDRAW = 500, SIG = 1.2, TAUS = SIG * 1e-6 / Math.sqrt(KB * 300 / ME);   // physical seconds per display second
      const MU_UNIT = QE * 1e-6 * 1e-6 / TAUS / MUB;                                       // (e/2)·x·v in display units -> µB, without the 1/2
      let P = [], trails = [], sumB = 0, sumE = 0, tAcc = 0, hist = [], lastPlot = 0, nB = 0, nE = 0;
      const spins = new Int8Array(160); let spinAvg = 0, spinT = 0, spinHist = 0;
      function reset() {
        P = []; trails = [];
        for (let i = 0; i < N; i++) P.push({ x: L * R(), y: L * R(), vx: SIG * Q.gauss(R), vy: SIG * Q.gauss(R), bulk: false });
        for (let i = 0; i < 40; i++) trails.push([]);
        for (let i = 0; i < spins.length; i++) spins[i] = R() < 0.5 ? 1 : -1;
        spinAvg = 0; spinT = 0;
        resetAvg();
      }
      function resetAvg() { sumB = 0; sumE = 0; tAcc = 0; hist = []; lastPlot = 0; for (const t of trails) t.length = 0; }
      modeUI(); reset();
      const omegaOf = B => QE * B / ME * TAUS;   // cyclotron angular frequency, per display second
      // exact circular motion of a negative charge (counter-clockwise, B out of the screen) for a time t
      const arc = (p, w, t, o) => { const s = Math.sin(w * t), k = Math.cos(w * t); o[0] = p.x + (s * p.vx - (1 - k) * p.vy) / w; o[1] = p.y + (s * p.vy + (1 - k) * p.vx) / w; o[2] = k * p.vx - s * p.vy; o[3] = s * p.vx + k * p.vy; return o; };
      const inside = o => o[0] >= 0 && o[0] <= L && o[1] >= 0 && o[1] <= L;
      const tmp = [0, 0, 0, 0];
      function advance(p, w, h) {
        // move along the arc; at a wall, find the moment of contact (bisection) and reflect there, so no bias creeps in
        let rem = h;
        for (let k = 0; k < 6 && rem > 0; k++) {
          arc(p, w, rem, tmp);
          if (inside(tmp)) { p.x = tmp[0]; p.y = tmp[1]; p.vx = tmp[2]; p.vy = tmp[3]; return; }
          let lo = 0, hi = rem;
          for (let i = 0; i < 36; i++) { const m = (lo + hi) / 2; arc(p, w, m, tmp); if (inside(tmp)) lo = m; else hi = m; }
          arc(p, w, hi, tmp); const fx = tmp[0] < 0 || tmp[0] > L, fy = tmp[1] < 0 || tmp[1] > L;
          arc(p, w, lo, tmp); p.x = tmp[0]; p.y = tmp[1]; p.vx = fx ? -tmp[2] : tmp[2]; p.vy = fy ? -tmp[3] : tmp[3]; rem -= lo;
        }
        p.x = clamp(p.x, 0, L); p.y = clamp(p.y, 0, L);
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        if (V.mode === 'classical') {
          const w = omegaOf(V.B), nsub = Math.max(1, Math.ceil(dt / 0.008)), h = dt / nsub;
          // now and then an electron hits a lattice vibration and gets a fresh thermal velocity (keeps it at 300 K)
          for (const p of P) if (R() < 0.2 * dt) { p.vx = SIG * Q.gauss(R); p.vy = SIG * Q.gauss(R); }
          for (let s = 0; s < nsub; s++) for (const p of P) advance(p, w, h);
          // classify and add up the moments about the centre of the box
          let mb = 0, me = 0; nB = 0; nE = 0;
          for (const p of P) {
            const rho = Math.hypot(p.vx, p.vy) / w, cx = p.x - p.vy / w, cy = p.y + p.vx / w;
            p.bulk = cx - rho > 0 && cx + rho < L && cy - rho > 0 && cy + rho < L;
            const m = -0.5 * ((p.x - L / 2) * p.vy - (p.y - L / 2) * p.vx) * MU_UNIT;
            if (p.bulk) { mb += m; nB++; } else { me += m; nE++; }
          }
          if (dt > 0) { sumB += mb * dt; sumE += me * dt; tAcc += dt; }
          const aB = tAcc ? sumB / tAcc / N : 0, aE = tAcc ? sumE / tAcc / N : 0;
          if (V.trails) for (let i = 0; i < trails.length; i++) { trails[i].push([P[i].x, P[i].y, P[i].bulk]); if (trails[i].length > 70) trails[i].shift(); }
          if (tAcc - lastPlot > 0.25) {
            lastPlot = tAcc; hist.push([tAcc, aB, aE, aB + aE]); if (hist.length > 600) hist.shift();
            plot.set({ x: { label: 'time averaged (s)', min: 0 }, y: { label: 'moment per electron (µB)' }, series: [
              { pts: hist.map(q => [q[0], q[1]]), label: 'bulk orbits', color: kit.hue(210) },
              { pts: hist.map(q => [q[0], q[2]]), label: 'skipping orbits', color: kit.hue(28) },
              { pts: hist.map(q => [q[0], q[3]]), label: 'total', color: C.text, width: 2.4 }], hlines: [{ y: 0 }], marks: [] });
          }
          // drawing: the box with its field, the electrons and their paths
          const Lp = Math.min(W * 0.6, H - 28), ox = 14, oy = (H - Lp) / 2, sc = Lp / L, X = x => ox + x * sc, Y = y => oy + Lp - y * sc;
          c.fillStyle = C.surface; c.fillRect(ox, oy, Lp, Lp);
          c.strokeStyle = C.faint; c.lineWidth = 1;
          const gs = clamp(46 - 14 * V.B, 18, 46);
          for (let gx = ox + gs / 2; gx < ox + Lp; gx += gs) for (let gy = oy + gs / 2; gy < oy + Lp; gy += gs) { c.beginPath(); c.arc(gx, gy, 3.2, 0, TAU); c.stroke(); kit.dot(c, gx, gy, 1, C.faint); }
          if (V.trails) for (const t of trails) {
            if (t.length < 2) continue;
            c.lineWidth = 1.3;
            for (let j = 1; j < t.length; j++) { c.strokeStyle = t[j][2] ? kit.hue(210, 0.55) : kit.hue(28, 0.6); c.beginPath(); c.moveTo(X(t[j - 1][0]), Y(t[j - 1][1])); c.lineTo(X(t[j][0]), Y(t[j][1])); c.stroke(); }
          }
          for (let i = 0; i < NDRAW; i++) { const p = P[i]; kit.dot(c, X(p.x), Y(p.y), 2.1, p.bulk ? kit.hue(210) : kit.hue(28)); }
          c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(ox, oy, Lp, Lp);
          kit.label(c, 'B out of the screen, ' + V.B.toFixed(2) + ' T', ox + 6, oy - 8 < 8 ? oy + 12 : oy - 8, { size: 11.5, color: C.muted });
          kit.label(c, '4 µm', ox + Lp / 2, oy + Lp + 11, { size: 11, color: C.muted, align: 'center' });
          // the bars
          const bx = ox + Lp + 30, bw = W - bx - 16, mid = bx + bw / 2, big = Math.max(Math.abs(aB), Math.abs(aE), 1e-9);
          const bars = [['bulk orbits (diamagnetic)', aB, kit.hue(210)], ['skipping orbits', aE, kit.hue(28)], ['total', aB + aE, C.text]];
          kit.label(c, 'average moment per electron', mid, oy + 10, { size: 12, align: 'center', color: C.muted });
          c.strokeStyle = C.faint; c.beginPath(); c.moveTo(mid, oy + 24); c.lineTo(mid, oy + 24 + 3 * 58); c.stroke();
          bars.forEach(([nm, v, col], i) => {
            const y = oy + 40 + i * 58, len = (bw / 2 - 6) * v / big;
            c.fillStyle = col; c.fillRect(Math.min(mid, mid + len), y, Math.abs(len), 18);
            kit.label(c, nm + ': ' + fmt(v, 3) + ' µB', mid, y + 32, { size: 11.5, align: 'center', color: C.text });
          });
          kit.label(c, '← against B    along B →', mid, oy + 40 + 3 * 58 + 4, { size: 11, align: 'center', color: C.muted });
          ro.set('rc', (SIG / w).toFixed(2) + ' µm (box 4 µm)');
          ro.set('nb', nB + ' / ' + nE);
          ro.set('mb', fmt(aB, 3) + ' µB'); ro.set('me', fmt(aE, 3) + ' µB'); ro.set('mt', fmt(aB + aE, 2) + ' µB');
          ro.set('tt', tAcc.toFixed(0) + ' s shown (' + fmt(tAcc * TAUS * 1e12, 3) + ' ps real)');
        } else {
          // quantum spins: each is up or down along B, redrawn now and then from the Boltzmann populations
          const x = MUB * V.Bs / (KB * V.T), pUp = 1 / (1 + Math.exp(-2 * x)), rate = 4 * dt;
          let up = 0;
          for (let i = 0; i < spins.length; i++) { if (R() < rate) spins[i] = R() < pUp ? 1 : -1; if (spins[i] > 0) up++; }
          const m = (2 * up - spins.length) / spins.length;
          if (dt > 0) { spinAvg += m * dt; spinT += dt; }
          const avg = spinT ? spinAvg / spinT : m, th = Math.tanh(x);
          const cols = 16, rows = 10, gw = Math.min(W * 0.6, (H - 30) * 1.6), cw = gw / cols, chh = (H - 30) / rows, ox = 14, oy = 20;
          c.fillStyle = C.surface; c.fillRect(ox, oy - 6, gw, rows * chh + 6);
          for (let i = 0; i < spins.length; i++) {
            const cx0 = ox + (i % cols + 0.5) * cw, cy0 = oy + (Math.floor(i / cols) + 0.5) * chh, u = spins[i], l = Math.min(cw, chh) * 0.36;
            kit.arrow(c, cx0, cy0 + u * l, cx0, cy0 - u * l, u > 0 ? kit.hue(210) : kit.hue(28), 2);
          }
          const bx = ox + gw + 40;
          kit.arrow(c, bx, H - 30, bx, 30, C.text, 3); kit.label(c, 'B = ' + V.Bs.toFixed(1) + ' T', bx + 10, 40, { size: 12.5, weight: 700 });
          kit.label(c, 'μ_B B = ' + fmt(MUB * V.Bs / QE * 1e6, 3) + ' µeV', bx + 10, 70, { size: 12, color: C.muted });
          kit.label(c, 'kT = ' + fmt(KB * V.T / QE * 1e3, 3) + ' meV', bx + 10, 92, { size: 12, color: C.muted });
          kit.label(c, 'up ' + up + '  down ' + (spins.length - up), bx + 10, 124, { size: 12.5, weight: 600 });
          kit.label(c, 'aligned excess ' + (100 * avg).toFixed(1) + ' %', bx + 10, 146, { size: 12.5, weight: 600, color: kit.hue(210) });
          if ((spinHist += dt) > 0.3 || dt === 0) {
            spinHist = 0;
            const pts = [], lin = [];
            for (let i = 0; i <= 100; i++) { const xx = 5 * i / 100; pts.push([xx, Math.tanh(xx)]); if (xx <= 1.2) lin.push([xx, xx]); }
            plot.set({ x: { label: 'μ_B B / kT', min: 0, max: 5 }, y: { label: 'M / Nμ_B', min: 0, max: 1.1 }, hlines: [], series: [{ pts, label: 'tanh (quantum spin ½)', color: C.accent }, { pts: lin, label: 'Curie\'s law (weak field)', dash: [5, 4], color: C.muted }],
              marks: [{ x: Math.min(x, 5), y: th, label: 'predicted' }, { x: Math.min(x, 5), y: Math.max(0, avg), label: 'measured', color: kit.hue(28) }] });
          }
          ro.set('x', fmt(x, 3)); ro.set('th', th.toFixed(4)); ro.set('meas', avg.toFixed(3) + ' (160 spins)');
          ro.set('M', fmt(1e28 * MUB * th, 3) + ' A/m');
          ro.set('chi', V.Bs > 0 ? fmt(1.25663706212e-6 * 1e28 * MUB * th / V.Bs, 3) : fmt(1.25663706212e-6 * 1e28 * MUB * MUB / (KB * V.T), 3) + ' (Curie)');
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mat-nmr */
  const NUCLEI = [['Protons ¹H (42.58 MHz/T)', 42.577], ['Carbon-13 (10.71 MHz/T)', 10.708], ['Phosphorus-31 (17.24 MHz/T)', 17.235], ['Electrons (28 025 MHz/T)', 28025]];
  Hyper.sim('mat-nmr', {
    title: 'Magnetic resonance: tipping a precessing spin',
    blurb: `A magnetic moment (the orange arrow — the magnetization of many spins) sits in a strong field $B_0$ pointing up. It precesses round the field at the Larmor frequency $f_0 = \\gamma B_0/2\\pi$, drawn here slowed down to half a turn per second. A weak field $B_1$ (blue) turns in the horizontal plane at the drive frequency. In the **rotating frame**, which turns with $B_1$, the big field is replaced by $B_0 - \\omega/\\gamma$: at resonance it vanishes, and the moment simply turns about $B_1$ — it tips over. The readouts give the real frequencies for the nucleus and field you choose; $B_1$ is drawn far stronger than in a scanner so that you can see both motions at once.

**Try this**
- Turn the drive on at ω/ω₀ = 1 and watch the moment spiral down from the top to the bottom and back (lab frame); switch to the rotating frame to see the same motion as a simple turn about $B_1$.
- Detune to 0.95 or 1.05: the effective field (dashed) tilts up and the moment only wobbles partway down. The small graph shows how sharp the resonance is: its width is about $\\gamma B_1$.
- Press *90° pulse*: the drive runs just long enough to tip the moment sideways, then stops. The moment keeps precessing in the horizontal plane — that turning magnetization is the NMR signal. Turn on relaxation to watch it fade ($T_2$) and regrow along $B_0$ ($T_1$).
- Change $B_0$ or the nucleus: the real Larmor frequency changes (63.9 MHz for protons at 1.5 T), the physics does not.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'frame', type: 'select', label: 'Watch from', options: [['The lab', 'lab'], ['A frame turning with B₁', 'rot']], value: 'lab' },
        { id: 'drive', type: 'check', label: 'Rotating field B₁ on', value: false },
        { id: 'ratio', label: 'Drive frequency ω/ω₀', min: 0.8, max: 1.2, step: 0.005, value: 1 },
        { id: 'b1', label: 'B₁/B₀ (enlarged to be visible)', min: 0.02, max: 0.25, step: 0.005, value: 0.08 },
        { id: 'relax', type: 'check', label: 'Relaxation (T₁ = 12 s, T₂ = 5 s, drawn)', value: false },
        { id: 'nuc', type: 'select', label: 'Nucleus', options: NUCLEI, value: 42.577 },
        { id: 'B0', label: 'Real field B₀ (for the readouts)', min: 0.5, max: 7, step: 0.1, value: 1.5, unit: 'T' },
        { type: 'buttons', items: [{ id: 'p90', label: '90° pulse', primary: true }, { id: 'p180', label: '180° pulse' }, { id: 'reset', label: 'Back to equilibrium' }] }
      ], (id) => {
        if (id === 'frame') trail = [];
        if (id === 'drive') pulseLeft = 0;
        if (id === 'p90' || id === 'p180') { pulseLeft = (id === 'p90' ? Math.PI / 2 : Math.PI) / (V.b1 * W0); ctl.set('drive', true); }
        if (id === 'reset') { M = [0, 0, 1]; trail = []; hist = []; tt = 0; pulseLeft = 0; ctl.set('drive', false); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f0', 'Larmor frequency f₀'], ['f', 'Drive frequency'], ['det', 'Detuning'], ['tip', 'Tip angle from B₀'], ['max', 'Largest tip at this detuning'], ['t90', 'Real 90° pulse with B₁ = 10 µT']]);
      const plot = kit.plot(gb, { x: { label: 'time shown (s)' }, y: { label: 'magnetization / M₀', min: -1.05, max: 1.05 }, legend: true }, 150);
      const W0 = TAU * 0.5;                      // the drawn Larmor angular frequency (half a turn per second)
      let M = [0, 0, 1], phase = 0, trail = [], hist = [], tt = 0, lastPlot = 0, pulseLeft = 0;
      const rotate = (v, k, a) => {             // Rodrigues: turn v about the unit axis k by angle a
        const cs = Math.cos(a), sn = Math.sin(a), d = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];
        return [v[0] * cs + (k[1] * v[2] - k[2] * v[1]) * sn + k[0] * d * (1 - cs), v[1] * cs + (k[2] * v[0] - k[0] * v[2]) * sn + k[1] * d * (1 - cs), v[2] * cs + (k[0] * v[1] - k[1] * v[0]) * sn + k[2] * d * (1 - cs)];
      };
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, H = st.H;
        const w = V.ratio * W0, w1 = V.b1 * W0, n = Math.max(1, Math.ceil(dt / 0.004)), h = dt / n;
        for (let s = 0; s < n; s++) {
          const on = V.drive;
          // in the frame turning with the drive: angular velocity −(ω₀ − ω) about z and −ω₁ about x'
          const Om = [on ? -w1 : 0, 0, -(W0 - w)], om = Math.hypot(Om[0], Om[1], Om[2]);
          if (om > 1e-12) M = rotate(M, [Om[0] / om, Om[1] / om, Om[2] / om], om * h);
          if (V.relax) { const e2 = Math.exp(-h / 5), e1 = Math.exp(-h / 12); M = [M[0] * e2, M[1] * e2, 1 + (M[2] - 1) * e1]; }
          phase = (phase + w * h) % TAU;
          if (pulseLeft > 0) { pulseLeft -= h; if (pulseLeft <= 0) { pulseLeft = 0; ctl.set('drive', false); } }
        }
        tt += dt;
        const lab = [M[0] * Math.cos(phase) + M[1] * Math.sin(phase), -M[0] * Math.sin(phase) + M[1] * Math.cos(phase), M[2]];
        const show = V.frame === 'lab' ? lab : M;
        trail.push(show); if (trail.length > 700) trail.shift();
        // projection: turned by an azimuth, seen from slightly above
        const cx = Wd * 0.4, cy = H * 0.52, Rr = Math.min(Wd * 0.3, H * 0.38), az = -0.6, el = 0.35;
        const pr = v => { const x1 = v[0] * Math.cos(az) - v[1] * Math.sin(az), y1 = v[0] * Math.sin(az) + v[1] * Math.cos(az); return [cx + Rr * x1, cy - Rr * (v[2] * Math.cos(el) + y1 * Math.sin(el))]; };
        c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, Rr, 0, TAU); c.stroke();
        c.beginPath(); for (let i = 0; i <= 72; i++) { const p = pr([Math.cos(i / 72 * TAU), Math.sin(i / 72 * TAU), 0]); if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); } c.stroke();
        const zb = pr([0, 0, -1.1]), zt = pr([0, 0, 1.1]); c.setLineDash([3, 4]); c.beginPath(); c.moveTo(zb[0], zb[1]); c.lineTo(zt[0], zt[1]); c.stroke(); c.setLineDash([]);
        // B0, drawn beside the sphere
        kit.arrow(c, cx - Rr * 1.3, cy + Rr * 0.7, cx - Rr * 1.3, cy - Rr * 0.8, C.text, 4); kit.label(c, 'B₀', cx - Rr * 1.3 - 8, cy - Rr * 0.85, { size: 14, weight: 700, align: 'right' });
        // B1 and, in the rotating frame, the effective field
        if (V.drive) {
          const b = V.frame === 'lab' ? [Math.cos(phase), -Math.sin(phase), 0] : [1, 0, 0], p = pr([b[0] * 0.75, b[1] * 0.75, 0]);
          kit.arrow(c, cx, cy, p[0], p[1], kit.hue(210), 2.6); kit.label(c, 'B₁', p[0] + 6, p[1] + 10, { size: 13, weight: 700, color: kit.hue(210) });
        }
        if (V.frame === 'rot') {
          const e = [V.drive ? w1 : 0, 0, W0 - w], m = Math.hypot(e[0], e[2]);
          if (m > 1e-9) { const p = pr([e[0] / m, 0, e[2] / m]); c.setLineDash([6, 4]); kit.arrow(c, cx, cy, p[0], p[1], C.warn, 2); c.setLineDash([]); kit.label(c, 'effective field', p[0] + 8, p[1] - 6, { size: 12, color: C.warn }); }
          else kit.label(c, 'no effective field: the moment stands still', cx, cy + Rr + 18, { size: 12, color: C.warn, align: 'center' });
        }
        // trail, the transverse part, and the moment
        c.strokeStyle = kit.hue(28, 0.5); c.lineWidth = 1.4; c.beginPath();
        trail.forEach((v, i) => { const p = pr(v); if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }); c.stroke();
        const mt = pr(show), mf = pr([show[0], show[1], 0]);
        c.setLineDash([3, 3]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(cx, cy); c.lineTo(mf[0], mf[1]); c.lineTo(mt[0], mt[1]); c.stroke(); c.setLineDash([]);
        kit.arrow(c, cx, cy, mt[0], mt[1], kit.hue(28), 4); kit.label(c, 'M', mt[0] + 8, mt[1] - 8, { size: 14, weight: 700, color: kit.hue(28) });
        kit.label(c, V.frame === 'lab' ? 'lab frame' : 'rotating frame', 12, 16, { size: 12.5, weight: 600, color: C.muted });
        if (pulseLeft > 0) kit.label(c, 'pulse on…', 12, 36, { size: 12.5, weight: 600, color: kit.hue(210) });
        // the resonance: largest tip against detuning
        const gx = Wd * 0.74, gy = H * 0.6, gw = Wd * 0.23, gh = H * 0.3, dMax = 0.2;
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= 100; i++) { const r = 1 - dMax + 2 * dMax * i / 100, d = Math.abs(1 - r) * W0, tip = d < 1e-12 ? Math.PI : 2 * Math.atan(w1 / d), X = gx + gw * i / 100, Y = gy + gh - gh * tip / Math.PI; if (i) c.lineTo(X, Y); else c.moveTo(X, Y); }
        c.stroke();
        const dNow = Math.abs(1 - V.ratio) * W0, tipMax = dNow < 1e-12 ? Math.PI : 2 * Math.atan(w1 / dNow);
        kit.dot(c, gx + gw * clamp((V.ratio - 1 + dMax) / (2 * dMax), 0, 1), gy + gh - gh * tipMax / Math.PI, 4.5, kit.hue(28));
        kit.label(c, 'largest tip (0–180°)', gx + gw / 2, gy - 9, { size: 11.5, color: C.muted, align: 'center' });
        kit.label(c, 'ω/ω₀: 0.8 … 1 … 1.2', gx + gw / 2, gy + gh + 12, { size: 11, color: C.muted, align: 'center' });
        // readouts, in real units
        const f0 = V.nuc * V.B0, tip = Math.acos(clamp(M[2] / Math.max(1e-12, Math.hypot(M[0], M[1], M[2])), -1, 1)) / DEG;
        ro.set('f0', f0 >= 1000 ? (f0 / 1000).toFixed(3) + ' GHz' : f0.toFixed(3) + ' MHz');
        ro.set('f', (f0 * V.ratio >= 1000 ? (f0 * V.ratio / 1000).toFixed(3) + ' GHz' : (f0 * V.ratio).toFixed(3) + ' MHz'));
        ro.set('det', ((V.ratio - 1) * 100).toFixed(1) + ' % (' + fmt(f0 * (V.ratio - 1) * 1e3, 3) + ' kHz)');
        ro.set('tip', tip.toFixed(0) + '°');
        ro.set('max', (tipMax / DEG).toFixed(0) + '°');
        ro.set('t90', fmt((Math.PI / 2) / (TAU * V.nuc * 1e6 * 1e-5) * 1e3, 3) + ' ms');
        if (tt - lastPlot > 0.2 || dt === 0) {
          lastPlot = tt; hist.push([tt, M[2], Math.hypot(M[0], M[1])]); if (hist.length > 200) hist.shift();
          plot.set({ series: [{ pts: hist.map(q => [q[0], q[1]]), label: 'M along B₀ (M_z)', color: C.accent }, { pts: hist.map(q => [q[0], q[2]]), label: 'M sideways (the signal)', color: kit.hue(28) }] });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mat-weiss */
  // the positive root of tanh(m/t) = m for t < 1 (spontaneous magnetization in mean-field theory)
  function weissM0(t) {
    if (t >= 1) return 0;
    let lo = 1e-9, hi = 1;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (Math.tanh(m / t) - m > 0) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  Hyper.sim('mat-weiss', {
    title: 'Weiss\'s mean field, solved with a picture',
    blurb: `Each atomic moment feels the applied field plus a molecular field proportional to the magnetization, so the fraction aligned must satisfy $m = \\tanh\\big((m + h)\\,T_C/T\\big)$ — $m$ on both sides. Left: the straight line $m$ and the curve; wherever they cross is a solution (filled dots are stable, hollow ones unstable). The slope of the curve at the origin — its [[?derivative]] — is $T_C/T$. Right: the spontaneous magnetization $m_0$ against temperature, with today's point on it.

**Try this**
- Start at $T = 0.8\\,T_C$ with no field and press *Iterate*: the staircase climbs down from $m = 1$ and settles where the line and the curve cross, at $m \\approx 0.71$.
- Raise the temperature through $T_C$: the curve's slope at the origin falls below 1, the two outer crossings merge into $m = 0$, and the magnetization vanishes.
- Just above $T_C$, add a small field: a small cause gives a large magnetization — the Curie–Weiss law $\\chi = C/(T - T_C)$.
- Below $T_C$, start from $m = -1$: the iteration finds the other solution. Now push the field the other way: past a certain field the negative solution disappears and the magnet flips — the mean-field version of hysteresis.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'Tc', type: 'select', label: 'Material', options: [['Iron (T_C = 1043 K)', 1043], ['Cobalt (T_C = 1388 K)', 1388], ['Nickel (T_C = 627 K)', 627], ['Gadolinium (T_C = 293 K)', 293]], value: 1043 },
        { id: 't', label: 'Temperature T / T_C', min: 0.05, max: 2, step: 0.01, value: 0.8 },
        { id: 'h', label: 'Applied field (fraction of the molecular field)', min: -0.3, max: 0.3, step: 0.005, value: 0 },
        { id: 'm0', type: 'select', label: 'Start the iteration from', options: [['m = 1', 1], ['m = −1', -1], ['m = 0.02', 0.02]], value: 1 },
        { type: 'buttons', items: [{ id: 'iter', label: 'Iterate m → tanh(…)', primary: true }, { id: 'clear', label: 'Clear' }] }
      ], id => { if (id === 'iter') { steps = [V.m0]; acc = 0; } else if (id === 'clear' || id === 't' || id === 'h') steps = []; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'Temperature'], ['sl', 'Slope at the origin, T_C/T'], ['sol', 'Solutions'], ['m', 'Stable magnetization m'], ['cw', 'Curie–Weiss']]);
      let steps = [], acc = 0;
      const curve = []; for (let i = 0; i <= 120; i++) { const t = 0.02 + 1.98 * i / 120; curve.push([t, weissM0(t)]); }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, t = V.t, h = V.h;
        const f = m => Math.tanh((m + h) / t);
        if (steps.length && steps.length < 40) { acc += dt; if (acc > 0.35) { acc = 0; steps.push(f(steps[steps.length - 1])); } }
        // solutions: sign changes of f(m) − m, refined by bisection
        const sols = []; let prev = f(-1.2) + 1.2;
        for (let i = 1; i <= 2400; i++) {
          const m = -1.2 + 2.4 * i / 2400, g = f(m) - m;
          if ((g <= 0 && prev > 0) || (g >= 0 && prev < 0)) {
            let lo = m - 2.4 / 2400, hi = m;
            for (let k = 0; k < 50; k++) { const mid = (lo + hi) / 2, gm = f(mid) - mid, gl = f(lo) - lo; if ((gm > 0) === (gl > 0)) lo = mid; else hi = mid; }
            const r = (lo + hi) / 2, slope = (1 - Math.pow(f(r), 2)) / t;
            if (!sols.some(s => Math.abs(s.m - r) < 1e-4)) sols.push({ m: r, stable: slope < 1 });
          }
          prev = g;
        }
        // left: the graphical solution
        const pw = W * 0.56, gx = 44, gy = 18, gw = pw - 60, gh = H - 50, X = m => gx + (m + 1.2) / 2.4 * gw, Y = y => gy + (1.2 - y) / 2.4 * gh;
        c.strokeStyle = C.grid || C.faint; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
        c.strokeStyle = C.axis || C.muted; c.beginPath(); c.moveTo(X(-1.2), Y(0)); c.lineTo(X(1.2), Y(0)); c.moveTo(X(0), Y(-1.2)); c.lineTo(X(0), Y(1.2)); c.stroke();
        for (const v of [-1, 1]) { kit.label(c, String(v), X(v), Y(0) + 11, { size: 11, color: C.muted, align: 'center' }); kit.label(c, String(v), X(0) - 6, Y(v), { size: 11, color: C.muted, align: 'right' }); }
        c.strokeStyle = C.muted; c.lineWidth = 1.6; c.beginPath(); c.moveTo(X(-1.2), Y(-1.2)); c.lineTo(X(1.2), Y(1.2)); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath();
        for (let i = 0; i <= 240; i++) { const m = -1.2 + 2.4 * i / 240; if (i) c.lineTo(X(m), Y(f(m))); else c.moveTo(X(m), Y(f(m))); }
        c.stroke();
        // the tangent at the origin, slope T_C/T
        const s0 = 1 / t, ex = Math.min(1.2, 1.2 / s0);
        c.setLineDash([4, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(-ex), Y(-ex * s0)); c.lineTo(X(ex), Y(ex * s0)); c.stroke(); c.setLineDash([]);
        // the iteration staircase
        if (steps.length > 1) {
          c.strokeStyle = kit.hue(330); c.lineWidth = 1.6; c.beginPath(); c.moveTo(X(steps[0]), Y(steps[0]));
          for (let i = 1; i < steps.length; i++) { c.lineTo(X(steps[i - 1]), Y(steps[i])); c.lineTo(X(steps[i]), Y(steps[i])); }
          c.stroke();
        }
        if (steps.length) kit.dot(c, X(steps[steps.length - 1]), Y(steps[steps.length - 1]), 4, kit.hue(330));
        for (const s of sols) { c.beginPath(); c.arc(X(s.m), Y(s.m), 6, 0, TAU); if (s.stable) { c.fillStyle = C.ok; c.fill(); } c.strokeStyle = s.stable ? C.ok : C.bad; c.lineWidth = 2; c.stroke(); }
        kit.label(c, 'line: m', X(1.05), Y(1.12), { size: 11.5, color: C.muted, align: 'right' });
        kit.label(c, 'curve: tanh((m + h)·T_C/T)', gx + 8, gy + 12, { size: 12, color: C.accent, weight: 600 });
        kit.label(c, 'dashed: slope T_C/T = ' + s0.toFixed(2), gx + 8, gy + 30, { size: 11.5, color: C.warn });
        kit.label(c, 'm', X(1.2) - 4, Y(0) - 10, { size: 12, color: C.muted, align: 'right' });
        // right: spontaneous magnetization against temperature
        const qx = pw + 36, qy = 26, qw = W - qx - 16, qh = H - 66, TX = tt => qx + tt / 2 * qw, MY = m => qy + (1 - m) * qh;
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(qx, qy); c.lineTo(qx, qy + qh); c.lineTo(qx + qw, qy + qh); c.stroke();
        c.setLineDash([3, 4]); c.beginPath(); c.moveTo(TX(1), qy); c.lineTo(TX(1), qy + qh); c.stroke(); c.setLineDash([]);
        kit.label(c, 'T_C', TX(1), qy + qh + 12, { size: 11.5, color: C.muted, align: 'center' });
        kit.label(c, 'T / T_C →', qx + qw, qy + qh + 26, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, 'm₀', qx - 6, qy + 4, { size: 12, color: C.muted, align: 'right' });
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath(); curve.forEach(([tt, m], i) => { if (i) c.lineTo(TX(tt), MY(m)); else c.moveTo(TX(tt), MY(m)); }); c.stroke();
        kit.label(c, 'spontaneous magnetization (no field)', qx + 6, qy - 12, { size: 11.5, color: C.muted });
        const stable = sols.filter(s => s.stable), mNow = stable.length ? stable.reduce((a, b) => (Math.abs(b.m) > Math.abs(a.m) ? b : a)).m : 0;
        kit.dot(c, TX(Math.min(2, t)), MY(clamp(Math.abs(mNow), 0, 1)), 5, kit.hue(330), C.text);
        // readouts
        ro.set('T', (t * V.Tc).toFixed(0) + ' K (' + ((t * V.Tc) - 273.15).toFixed(0) + ' °C)');
        ro.set('sl', s0.toFixed(2) + (s0 > 1 ? ' > 1: ordered' : ' ≤ 1: disordered'));
        ro.set('sol', sols.map(s => (Math.abs(s.m) < 5e-4 ? '0' : s.m.toFixed(3)) + (s.stable ? '' : ' (unstable)')).join(', ') || '—');
        ro.set('m', stable.map(s => s.m.toFixed(3)).join(' or ') || '—');
        ro.set('cw', t > 1 ? 'T − T_C = ' + ((t - 1) * V.Tc).toFixed(0) + ' K, χ = C/' + ((t - 1) * V.Tc).toFixed(0) + ' K' : 'below T_C: spontaneous order');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mat-domains */
  const TC_ISING = 2 / Math.log(1 + Math.SQRT2);   // Onsager: kT_c = 2.269 J on the square lattice
  Hyper.sim('mat-domains', {
    title: 'Domains and hysteresis in a grid of spins',
    blurb: `A grid of 9216 atomic spins, each up (blue) or down (orange), each preferring to point like its four neighbours (coupling $J$), jostled by heat — the Ising model, the simplest cousin of a real ferromagnet, run by the Metropolis rule with the [[?boltzmann-factor]]. Below the critical temperature $T_c = 2.27\\,J/k$ neighbours stay aligned: a quenched grid breaks into **domains** that slowly coarsen. The graph plots the magnetization against the applied field.

**Try this**
- Press *Heat and quench* at $T = 0.7\\,T_c$: domains appear at once and the walls between them straighten and shrink.
- Tick *Sweep the field*: the graph traces a **hysteresis loop**. The magnetization left at zero field is the remanence; the reverse field needed to bring it to zero is the coercive field (both in the readouts). Watch reversal start as small islands that grow — the moving domain walls.
- Lower the temperature: the loop widens (a "hard" magnet). Raise it above $T_c$: the loop closes into a single S-shaped curve — a paramagnet.
- Here domains form because of the quench; in real iron they are also shaped by the magnetic field energy outside the magnet, which this model leaves out.`,
    mount(box, kit) {
      const R = xorshift(1907), NX = 128, NY = 72, NN = NX * NY;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 't', label: 'Temperature T / T_c', min: 0.3, max: 1.6, step: 0.01, value: 0.7 },
        { id: 'h', label: 'Applied field h (in units of J)', min: -2, max: 2, step: 0.01, value: 0 },
        { id: 'sweep', type: 'check', label: 'Sweep the field back and forth', value: false },
        { id: 'hmax', label: 'Sweep amplitude', min: 0.2, max: 2, step: 0.05, value: 1.2 },
        { id: 'speed', type: 'select', label: 'Updates of the grid per frame', options: [['1 (slow)', 1], ['3', 3], ['8 (fast)', 8]], value: 3 },
        { type: 'buttons', items: [{ id: 'quench', label: 'Heat and quench', primary: true }, { id: 'up', label: 'All up' }] }
      ], id => {
        if (id === 'quench') { for (let i = 0; i < NN; i++) s[i] = R() < 0.5 ? 1 : -1; loopPts = []; }
        if (id === 'up') { s.fill(1); loopPts = []; }
        if (id === 'sweep') { phase = 0; loopPts = []; coer = null; rem = null; }
        if (id === 't' || id === 'hmax') { loopPts = []; coer = null; rem = null; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'Temperature'], ['h', 'Field h'], ['M', 'Magnetization'], ['wall', 'Unlike neighbours (walls)'], ['coer', 'Coercive field'], ['rem', 'Remanence']]);
      const plot = kit.plot(gb, { x: { label: 'applied field h (units of J)', min: -2, max: 2 }, y: { label: 'magnetization M/M_s', min: -1.05, max: 1.05 } }, 170);
      const s = new Int8Array(NN); for (let i = 0; i < NN; i++) s[i] = R() < 0.5 ? 1 : -1;
      const off = document.createElement('canvas'); off.width = NX; off.height = NY;
      const octx = off.getContext('2d'), img = octx.createImageData(NX, NY);
      let loopPts = [], phase = 0, coer = null, rem = null, prevM = null, prevH = null, lastPlot = 0, tt = 0;
      const acc = new Float64Array(10);
      const loop = kit.loop(dt => {
        const C = kit.colors(), T = V.t * TC_ISING;
        tt += dt;
        if (V.sweep) { phase += dt * TAU / 16; ctl.set('h', +(V.hmax * Math.sin(phase)).toFixed(3)); }
        const h = V.h, n = NN * V.speed;
        // Metropolis: the chance to flip is min(1, exp(−ΔE/kT)), ΔE = 2s(Σ neighbours + h); only ten ΔE values occur
        for (let b = 0; b < 2; b++) for (let a = 0; a < 5; a++) { const sg = b ? 1 : -1, dE = 2 * (2 * a - 4) + 2 * sg * h; acc[b * 5 + a] = dE <= 0 ? 1 : Math.exp(-dE / T); }
        for (let k = 0; k < n; k++) {
          const i = (R() * NN) | 0, x = i % NX, y = (i / NX) | 0, si = s[i];
          const nb = s[(x + 1) % NX + y * NX] + s[(x + NX - 1) % NX + y * NX] + s[x + ((y + 1) % NY) * NX] + s[x + ((y + NY - 1) % NY) * NX];
          const p = acc[(si > 0 ? 5 : 0) + ((si * nb + 4) >> 1)];
          if (p >= 1 || R() < p) s[i] = -si;
        }
        let sum = 0, unlike = 0;
        for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) { const i = x + y * NX; sum += s[i]; if (s[i] !== s[(x + 1) % NX + y * NX]) unlike++; if (s[i] !== s[x + ((y + 1) % NY) * NX]) unlike++; }
        const M = sum / NN;
        if (V.sweep) {
          loopPts.push([h, M]); if (loopPts.length > 2400) loopPts.shift();
          if (prevM != null && (M > 0) !== (prevM > 0)) coer = Math.abs(h);
          if (prevH != null && (h > 0) !== (prevH > 0)) rem = Math.abs(M);
        }
        prevM = M; prevH = h;
        // the grid as an image
        const d = img.data, dark = C.dark;
        const up = dark ? [95, 150, 255] : [40, 105, 215], dn = dark ? [240, 150, 70] : [235, 125, 30];
        for (let i = 0; i < NN; i++) { const col = s[i] > 0 ? up : dn, j = 4 * i; d[j] = col[0]; d[j + 1] = col[1]; d[j + 2] = col[2]; d[j + 3] = 255; }
        octx.putImageData(img, 0, 0);
        const c = st.begin(), W = st.W, H = st.H, sc = Math.min((W - 20) / NX, (H - 34) / NY), gw = NX * sc, gh = NY * sc, gx = (W - gw) / 2, gy = 8;
        c.imageSmoothingEnabled = false; c.drawImage(off, gx, gy, gw, gh); c.imageSmoothingEnabled = true;
        c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
        kit.label(c, '▮ up', gx, gy + gh + 14, { size: 12, color: 'rgb(' + up.join(',') + ')', weight: 700 });
        kit.label(c, '▮ down', gx + 50, gy + gh + 14, { size: 12, color: 'rgb(' + dn.join(',') + ')', weight: 700 });
        kit.label(c, 'T = ' + V.t.toFixed(2) + ' T_c    h = ' + h.toFixed(2) + ' J    M = ' + M.toFixed(3), gx + gw, gy + gh + 14, { size: 12, align: 'right', color: C.text });
        if (tt - lastPlot > 0.15 || dt === 0) {
          lastPlot = tt;
          plot.set({ x: { label: 'applied field h (units of J)', min: -2, max: 2 }, series: loopPts.length > 1 ? [{ pts: loopPts, label: 'M against h', color: C.accent }] : [], marks: [{ x: h, y: M, label: 'now' }], vlines: [{ x: 0 }], hlines: [{ y: 0 }] });
        }
        ro.set('T', V.t.toFixed(2) + ' T_c = ' + T.toFixed(2) + ' J/k');
        ro.set('h', h.toFixed(2) + ' J'); ro.set('M', M.toFixed(3));
        ro.set('wall', (100 * unlike / (2 * NN)).toFixed(1) + ' % of bonds');
        ro.set('coer', coer == null ? '— (sweep the field)' : coer.toFixed(2) + ' J');
        ro.set('rem', rem == null ? '— (sweep the field)' : rem.toFixed(2) + ' M_s');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mat-elastic */
  // typical values; lim is a rough elastic limit (glass: breaking stress) for the warning only
  const MATS = [
    { name: 'Steel', Y: 200e9, s: 0.29, lim: 250e6 }, { name: 'Aluminium alloy', Y: 70e9, s: 0.33, lim: 250e6 },
    { name: 'Copper', Y: 120e9, s: 0.34, lim: 70e6 }, { name: 'Glass', Y: 70e9, s: 0.22, lim: 50e6, brittle: true },
    { name: 'Tungsten', Y: 410e9, s: 0.28, lim: 750e6 }, { name: 'Rubber', Y: 0.05e9, s: 0.49, lim: 5e6 }
  ];
  const niceK = x => Math.max(1, Math.pow(10, Math.floor(Math.log10(Math.max(1, x)))));   // a power-of-ten enlargement
  const lenStr = m => { const a = Math.abs(m); return a >= 1 ? m.toFixed(3) + ' m' : a >= 1e-3 ? (m * 1e3).toFixed(a >= 0.1 ? 1 : 3) + ' mm' : a >= 1e-6 ? (m * 1e6).toFixed(2) + ' µm' : (m * 1e9).toFixed(2) + ' nm'; };
  const paStr = p => { const a = Math.abs(p); return a >= 1e9 ? (p / 1e9).toFixed(2) + ' GPa' : a >= 1e6 ? (p / 1e6).toFixed(a >= 1e8 ? 0 : 1) + ' MPa' : a >= 1e3 ? (p / 1e3).toFixed(1) + ' kPa' : a >= 1 ? p.toFixed(1) + ' Pa' : a >= 9.995e-4 ? (p * 1e3).toFixed(2) + ' mPa' : a > 0 ? (p * 1e6).toFixed(2) + ' µPa' : '0 Pa'; };
  Hyper.sim('mat-elastic', {
    title: 'Stretch, bend and twist',
    blurb: `A bar of the material you choose, clamped in a wall. **Stretch** it: it gets longer by $FL/YA$ and thinner by Poisson's ratio times that strain. **Bend** it with a load at the end: the top fibres are stretched (red), the bottom ones squeezed (blue), and the neutral axis between them keeps its length; the tip drops by $FL^3/3YI$. **Twist** it: straight lines on its surface become helices, and the end turns by $\\varphi = 2L\\tau/\\pi\\mu R^4$. Real deformations of metals are tiny, so the picture enlarges them by the power of ten shown; the readouts give the true values.

**Try this**
- Stretch a steel bar and then a rubber one of the same size: the same force stretches rubber 4000 times more.
- Bend: double the height $h$ and the deflection drops eightfold; double the width and it only halves. Stand a plank on edge.
- Twist: halve the radius and the angle grows sixteenfold ($R^4$) — why fine fibres make sensitive torsion balances.
- Push the load up until the readout warns that the stress passes the typical elastic limit: beyond it Hooke's law, and this picture, no longer apply.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Load', options: [['Stretch (tension)', 'st'], ['Bend (cantilever)', 'bd'], ['Twist (torsion)', 'tw']], value: 'st' },
        { id: 'mat', type: 'select', label: 'Material', options: MATS.map((m, i) => [m.name + ' (Y = ' + (m.Y >= 1e9 ? m.Y / 1e9 + ' GPa' : m.Y / 1e6 + ' MPa') + ', σ = ' + m.s + ')', i]), value: 0 },
        { id: 'F', label: 'Force', min: 1, max: 200000, value: 20000, unit: 'N', log: true, sig: 3 },
        { id: 'tq', label: 'Torque', min: 0.01, max: 10000, value: 50, unit: 'N·m', log: true, sig: 3 },
        { id: 'L', label: 'Length L', min: 0.2, max: 5, step: 0.1, value: 1, unit: 'm' },
        { id: 'w', label: 'Width w (square side for stretching)', min: 1, max: 200, value: 10, unit: 'mm', log: true, sig: 3 },
        { id: 'h', label: 'Height h (along the load)', min: 1, max: 200, value: 20, unit: 'mm', log: true, sig: 3 },
        { id: 'R', label: 'Radius R', min: 0.5, max: 50, value: 10, unit: 'mm', log: true, sig: 3 }
      ], id => { if (id === 'mode') modeUI(); });
      const V = ctl.values;
      const roS = kit.readout(box.side, [['sig', 'Stress F/A'], ['eps', 'Strain ΔL/L'], ['dL', 'Extension ΔL'], ['dw', 'Width shrinks by'], ['dV', 'Volume change']]);
      const roB = kit.readout(box.side, [['I', 'Second moment I = wh³/12'], ['del', 'Tip deflection FL³/3YI'], ['smax', 'Largest stress (at the wall)'], ['Rw', 'Radius of curvature at the wall'], ['kk', 'Stiffness at the tip']]);
      const roT = kit.readout(box.side, [['mu', 'Shear modulus μ = Y/2(1 + σ)'], ['phi', 'Angle of twist φ'], ['tau', 'Shear stress at the surface'], ['kap', 'Torsional stiffness πμR⁴/2L'], ['J', 'J = πR⁴/2']]);
      const ro = kit.readout(box.side, [['k', 'Drawn enlarged'], ['ok', 'Status']]);
      function modeUI() {
        const m = V.mode;
        ctl.show('F', m !== 'tw'); ctl.show('tq', m === 'tw'); ctl.show('w', m !== 'tw'); ctl.show('h', m === 'bd'); ctl.show('R', m === 'tw');
        roS.show(m === 'st'); roB.show(m === 'bd'); roT.show(m === 'tw');
      }
      modeUI();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = MATS[V.mat] || MATS[0];
        const x0 = 56, Ld = W - x0 - 90, cy = H * 0.45;
        // the wall
        c.fillStyle = C.surface2 || C.faint; c.fillRect(x0 - 26, cy - H * 0.36, 26, H * 0.72);
        c.strokeStyle = C.muted; c.lineWidth = 1; for (let y = cy - H * 0.36; y < cy + H * 0.36; y += 12) { c.beginPath(); c.moveTo(x0 - 26, y + 12); c.lineTo(x0 - 14, y); c.stroke(); }
        const L = V.L;
        let status = 'within the elastic range', k = 1;
        if (V.mode === 'st') {
          const a = V.w * 1e-3, A = a * a, sig = V.F / A, eps = sig / M.Y, dL = eps * L, dw = M.s * eps * a;
          k = niceK(0.25 / Math.max(eps, 1e-12)); const e = Math.min(eps * k, 0.3);
          const hd = clamp(a * 2000, 18, H * 0.4), len = Ld / (1 + 0.3), Lx = len * (1 + e), hx = hd * (1 - M.s * e);
          c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.strokeRect(x0, cy - hd / 2, len, hd); c.setLineDash([]);
          c.fillStyle = kit.hue(0, clamp(0.15 + 0.6 * sig / M.lim, 0.15, 0.75)); c.fillRect(x0, cy - hx / 2, Lx, hx);
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(x0, cy - hx / 2, Lx, hx);
          c.strokeStyle = C.faint; c.lineWidth = 1;
          for (let i = 1; i < 10; i++) { const x = x0 + Lx * i / 10; c.beginPath(); c.moveTo(x, cy - hx / 2); c.lineTo(x, cy + hx / 2); c.stroke(); }
          for (let j = 1; j < 4; j++) { const y = cy - hx / 2 + hx * j / 4; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + Lx, y); c.stroke(); }
          kit.arrow(c, x0 + Lx, cy, x0 + Lx + 60, cy, C.text, 2.5); kit.label(c, 'F', x0 + Lx + 62, cy - 12, { size: 13, weight: 700 });
          kit.label(c, 'ΔL = ' + lenStr(dL), x0 + Lx / 2, cy + hx / 2 + 16, { size: 12.5, align: 'center', weight: 600 });
          kit.label(c, 'dashed: before loading', x0, cy - hd / 2 - 12, { size: 11.5, color: C.muted });
          roS.set('sig', paStr(sig)); roS.set('eps', fmt(eps, 3)); roS.set('dL', lenStr(dL)); roS.set('dw', lenStr(dw)); roS.set('dV', '+' + fmt(100 * (1 - 2 * M.s) * eps, 3) + ' %');
          if (sig > M.lim) status = M.brittle ? 'past the breaking stress: glass would snap' : 'past the typical elastic limit (' + paStr(M.lim) + ')';
        } else if (V.mode === 'bd') {
          const w = V.w * 1e-3, h = V.h * 1e-3, I = w * h * h * h / 12, F = V.F, del = F * L * L * L / (3 * M.Y * I), sMax = F * L * (h / 2) / I, Rw = M.Y * I / (F * L);
          k = niceK(0.3 * L / Math.max(del, 1e-15)); const scl = Ld / L;
          const hd = clamp(h / L * Ld * 3, 10, H * 0.22), N = 40;
          // centre line, drawn deflection, and the fibres coloured by bending stress
          const yAt = x => Math.min(F * x * x * (3 * L - x) / (6 * M.Y * I) * k, 0.45 * L), pts = [];
          for (let i = 0; i <= N; i++) { const x = L * i / N; pts.push([x0 + x * scl, cy + yAt(x) * scl]); }
          c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.strokeRect(x0, cy - hd / 2, Ld, hd); c.setLineDash([]);
          for (let i = 0; i < N; i++) {
            const m = (L - L * (i + 0.5) / N) / L, p = pts[i], q = pts[i + 1];
            c.fillStyle = kit.hue(0, 0.12 + 0.6 * m); c.beginPath(); c.moveTo(p[0], p[1] - hd / 2); c.lineTo(q[0], q[1] - hd / 2); c.lineTo(q[0], q[1]); c.lineTo(p[0], p[1]); c.closePath(); c.fill();
            c.fillStyle = kit.hue(215, 0.12 + 0.6 * m); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.lineTo(q[0], q[1] + hd / 2); c.lineTo(p[0], p[1] + hd / 2); c.closePath(); c.fill();
          }
          c.strokeStyle = C.text; c.lineWidth = 1.5;
          for (const off of [-hd / 2, hd / 2]) { c.beginPath(); pts.forEach((p, i) => { if (i) c.lineTo(p[0], p[1] + off); else c.moveTo(p[0], p[1] + off); }); c.stroke(); }
          c.setLineDash([6, 4]); c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); pts.forEach((p, i) => { if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }); c.stroke(); c.setLineDash([]);
          const tip = pts[N]; kit.arrow(c, tip[0], tip[1] - hd / 2 - 46, tip[0], tip[1] - hd / 2, C.text, 2.5);
          kit.label(c, 'F', tip[0] + 8, tip[1] - hd / 2 - 36, { size: 13, weight: 700 });
          kit.label(c, 'stretched', x0 + 8, cy - hd / 2 - 10, { size: 11.5, color: kit.hue(0) }); kit.label(c, 'squeezed', x0 + 8, cy + hd / 2 + 12, { size: 11.5, color: kit.hue(215) });
          kit.label(c, 'neutral axis', x0 + Ld * 0.35, pts[Math.round(N * 0.35)][1] - 2, { size: 11, color: C.muted, bg: C.surface });
          kit.label(c, 'tip drops ' + lenStr(del), tip[0] - 4, tip[1] + hd / 2 + 18, { size: 12.5, align: 'right', weight: 600 });
          roB.set('I', fmt(I * 1e12, 3) + ' mm⁴'); roB.set('del', lenStr(del)); roB.set('smax', paStr(sMax)); roB.set('Rw', lenStr(Rw)); roB.set('kk', fmt(F / del, 3) + ' N/m');
          if (sMax > M.lim) status = M.brittle ? 'past the breaking stress: glass would snap' : 'past the typical elastic limit (' + paStr(M.lim) + ')';
        } else {
          const R = V.R * 1e-3, mu = M.Y / (2 * (1 + M.s)), J = Math.PI * R * R * R * R / 2, phi = V.tq * L / (mu * J), tauS = V.tq * R / J;
          k = niceK(4.7 / Math.max(phi, 1e-12)); const ph = Math.min(phi * k, 4.7);
          const rd = clamp(R * 3000, 14, H * 0.3), N = 60;
          c.fillStyle = C.surface2 || C.surface; c.fillRect(x0, cy - rd, Ld, 2 * rd);
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0, cy - rd); c.lineTo(x0 + Ld, cy - rd); c.moveTo(x0, cy + rd); c.lineTo(x0 + Ld, cy + rd); c.stroke();
          // surface lines that were straight, now helices; faint where they run round the back
          for (let j = 0; j < 12; j++) {
            const th0 = j * TAU / 12;
            for (let i = 0; i < N; i++) {
              const a1 = th0 + ph * i / N, a2 = th0 + ph * (i + 1) / N, front = Math.sin((a1 + a2) / 2) > 0;
              c.strokeStyle = front ? kit.hue(160) : kit.hue(160, 0.18); c.lineWidth = front ? 1.8 : 1;
              c.beginPath(); c.moveTo(x0 + Ld * i / N, cy - rd * Math.cos(a1)); c.lineTo(x0 + Ld * (i + 1) / N, cy - rd * Math.cos(a2)); c.stroke();
            }
          }
          const ex = x0 + Ld, ew = rd * 0.35;
          c.fillStyle = C.surface; c.beginPath(); c.ellipse(ex, cy, ew, rd, 0, 0, TAU); c.fill(); c.strokeStyle = C.text; c.stroke();
          kit.arrow(c, ex, cy, ex + ew * Math.sin(ph) * 0.9, cy - rd * Math.cos(ph) * 0.9, C.warn, 2.4);
          // the torque: a curved arrow round the free end
          const ta = 1.2, tcx = ex + 30, tr = rd + 12;
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.ellipse(tcx, cy, 12, tr, 0, -ta, ta); c.stroke();
          const px = tcx + 12 * Math.cos(ta), py = cy + tr * Math.sin(ta), tx = -12 * Math.sin(ta), ty = tr * Math.cos(ta), tl = Math.hypot(tx, ty) || 1;
          kit.arrow(c, px - 8 * tx / tl, py - 8 * ty / tl, px + 4 * tx / tl, py + 4 * ty / tl, C.text, 2);
          kit.label(c, 'τ', ex + 46, cy - rd - 8, { size: 13, weight: 700 });
          kit.label(c, 'end turns ' + (phi / DEG).toFixed(phi / DEG < 1 ? 3 : 1) + '°', ex - 4, cy + rd + 18, { size: 12.5, align: 'right', weight: 600 });
          roT.set('mu', paStr(mu)); roT.set('phi', (phi / DEG).toFixed(3) + '° (' + fmt(phi, 3) + ' rad)'); roT.set('tau', paStr(tauS));
          roT.set('kap', fmt(mu * J / L, 3) + ' N·m/rad'); roT.set('J', fmt(J * 1e12, 3) + ' mm⁴');
          if (tauS > M.lim / 2) status = M.brittle ? 'past the breaking stress: glass would snap' : 'shear past the typical limit (' + paStr(M.lim / 2) + ')';
        }
        kit.label(c, M.name + (k > 1 ? ' — deformation drawn ×' + fmt(k, 1) : ' — drawn to scale'), 12, 16, { size: 12.5, weight: 600, color: C.muted });
        ro.set('k', k > 1 ? '×' + fmt(k, 1) : 'no (true size)');
        ro.set('ok', status);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mat-dry-flow */
  // potential flow past a cylinder of radius 1 in a stream U = 1 (units of a and U); g = Γ/(2πUa), positive = clockwise
  const flowVel = (x, y, g) => {           // u − iv = 1 − 1/z² + i g/z
    const r2 = x * x + y * y; if (r2 < 1e-9) return [0, 0];
    const re2 = (x * x - y * y) / (r2 * r2), im2 = -2 * x * y / (r2 * r2);    // 1/z²
    const reI = g * y / r2, imI = g * x / r2;                                // i g / z = i g (x − iy)/r² = (g y + i g x)/r²
    const ur = 1 - re2 + reI, ui = -im2 + imI;
    return [ur, -ui];
  };
  const flowPsi = (x, y, g) => { const r2 = x * x + y * y; return y - y / r2 + 0.5 * g * Math.log(r2); };
  Hyper.sim('mat-dry-flow', {
    title: 'Dry water round a cylinder',
    blurb: `The ideal-fluid (potential) flow past a long cylinder, from the exact solution of Laplace's equation. Lines are streamlines; dots are bits of water carried along; colours are the pressure from Bernoulli's theorem — red above the pressure of the free stream, blue below. The small arrows on the surface are the pressure pushes (inward) and pulls (outward) on the cylinder. The graph shows the pressure coefficient $C_p = (p - p_\\infty)/\\tfrac12\\rho U^2$ round the surface.

**Try this**
- With no circulation, compare the front and the back: the pattern is the same, the pushes cancel, and the drag is **zero** — d'Alembert's paradox. The fastest water, $2U$, is at the top and bottom, where $C_p = -3$.
- Add circulation: the flow speeds up on top and slows underneath; the pressure is lower on top, and the cylinder feels a lift $\\rho U\\Gamma$ per metre (the Magnus effect). The two stagnation points slide down.
- At $\\Gamma/4\\pi Ua = 1$ the stagnation points meet at the bottom; beyond, the meeting point leaves the surface and a ring of fluid circulates with the cylinder.
- Change the fluid, speed and size: the pattern stays the same — only the real numbers in the readouts change.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'g', label: 'Circulation Γ/4πUa', min: -1.5, max: 1.5, step: 0.01, value: 0 },
        { id: 'fl', type: 'select', label: 'Fluid', options: [['Water (1000 kg/m³)', 1000], ['Air (1.2 kg/m³)', 1.204]], value: 1000 },
        { id: 'U', label: 'Stream speed U', min: 0.2, max: 20, value: 2, unit: 'm/s', log: true, sig: 3 },
        { id: 'a', label: 'Cylinder radius a', min: 0.01, max: 2, value: 0.5, unit: 'm', log: true, sig: 3 },
        { id: 'pr', type: 'check', label: 'Show the pressure colours', value: true },
        { id: 'tr', type: 'check', label: 'Show moving water', value: true }
      ], id => { if (id === 'g') field = null; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['G', 'Circulation Γ'], ['vmax', 'Fastest flow on the surface'], ['pf', 'Pressure at the front stagnation point'], ['pmin', 'Lowest pressure (on the surface)'], ['drag', 'Drag'], ['lift', 'Lift per metre ρUΓ'], ['stag', 'Stagnation points']]);
      const plot = kit.plot(gb, { x: { label: 'angle round the surface from the front, over the top (°)', min: 0, max: 360 }, y: { label: 'pressure coefficient C_p', min: -6, max: 1.5 }, legend: true }, 160);
      let field = null, fW = 0, fH = 0, tracers = [], plotted = null;
      const R = xorshift(1738);
      function build(W, H) {
        const g = 2 * V.g, yr = 2.3, sc = H / (2 * yr), xr = W / (2 * sc), cell = 5, nx = Math.ceil(W / cell), ny = Math.ceil(H / cell);
        // grid of the stream function (nodes) for the streamlines, and an image of the pressure (cells)
        const psi = new Float64Array((nx + 1) * (ny + 1));
        for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) { const x = -xr + i * cell / sc, y = yr - j * cell / sc; psi[i + j * (nx + 1)] = flowPsi(x, y, g); }
        const segs = [], dl = 0.22;
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
          const xc = -xr + (i + 0.5) * cell / sc, yc = yr - (j + 0.5) * cell / sc;
          if (xc * xc + yc * yc < 1.02) continue;
          const v = [psi[i + j * (nx + 1)], psi[i + 1 + j * (nx + 1)], psi[i + 1 + (j + 1) * (nx + 1)], psi[i + (j + 1) * (nx + 1)]];
          const P = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]];
          const lo = Math.min(...v), hi = Math.max(...v);
          for (let lv = Math.ceil(lo / dl) * dl; lv <= hi; lv += dl) {
            const cr = [];
            for (let e = 0; e < 4; e++) { const a = v[e], b = v[(e + 1) % 4]; if ((a < lv) !== (b < lv)) { const t = (lv - a) / (b - a); cr.push([(P[e][0] + t * (P[(e + 1) % 4][0] - P[e][0])) * cell, (P[e][1] + t * (P[(e + 1) % 4][1] - P[e][1])) * cell]); } }
            if (cr.length >= 2) segs.push(cr[0][0], cr[0][1], cr[1][0], cr[1][1]);
            if (cr.length === 4) segs.push(cr[2][0], cr[2][1], cr[3][0], cr[3][1]);
          }
        }
        const off = document.createElement('canvas'); off.width = nx; off.height = ny;
        const octx = off.getContext('2d'), img = octx.createImageData(nx, ny), d = img.data;
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
          const x = -xr + (i + 0.5) * cell / sc, y = yr - (j + 0.5) * cell / sc, k = 4 * (i + j * nx);
          if (x * x + y * y < 1) { d[k + 3] = 0; continue; }
          const u = flowVel(x, y, g), cp = 1 - (u[0] * u[0] + u[1] * u[1]);
          if (cp >= 0) { d[k] = 230; d[k + 1] = 70; d[k + 2] = 50; d[k + 3] = Math.round(200 * Math.min(1, cp)); }
          else { d[k] = 50; d[k + 1] = 110; d[k + 2] = 235; d[k + 3] = Math.round(200 * Math.min(1, -cp / 3)); }
        }
        octx.putImageData(img, 0, 0);
        field = { g, sc, xr, yr, segs, off, cell };
        fW = W; fH = H;
      }
      for (let i = 0; i < 160; i++) tracers.push({ x: 0, y: 0, dead: true });
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        if (!field || fW !== W || fH !== H) build(W, H);
        const { g, sc, xr, yr } = field, S = (x, y) => [W / 2 + x * sc, H / 2 - y * sc];
        if (V.pr) { c.imageSmoothingEnabled = true; c.drawImage(field.off, 0, 0, field.off.width * field.cell, field.off.height * field.cell); }
        c.strokeStyle = C.muted; c.lineWidth = 1.1; c.beginPath();
        const sg = field.segs; for (let i = 0; i < sg.length; i += 4) { c.moveTo(sg[i], sg[i + 1]); c.lineTo(sg[i + 2], sg[i + 3]); } c.stroke();
        // the cylinder, its spin, and the pressure on its surface
        const O = S(0, 0);
        c.fillStyle = C.surface2 || C.surface; c.beginPath(); c.arc(O[0], O[1], sc, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        if (Math.abs(g) > 0.02) {
          const r0 = sc * 0.6, a0 = -2.4, a1 = -0.7;
          c.strokeStyle = C.warn; c.lineWidth = 2.2; c.beginPath(); c.arc(O[0], O[1], r0, a0, a1); c.stroke();
          // canvas angles grow clockwise: for clockwise circulation (g > 0) the head sits at the end a1
          const ae = g > 0 ? a1 : a0, dir = g > 0 ? 1 : -1, ex = O[0] + r0 * Math.cos(ae), ey = O[1] + r0 * Math.sin(ae), tx = -Math.sin(ae) * dir, ty = Math.cos(ae) * dir;
          kit.arrow(c, ex - 6 * tx, ey - 6 * ty, ex + 6 * tx, ey + 6 * ty, C.warn, 2.2);
          kit.label(c, 'Γ', O[0], O[1] + 4, { size: 14, weight: 700, align: 'center', color: C.warn });
        }
        const cpAt = ph => 1 - Math.pow(2 * Math.sin(ph) + g, 2);   // ph from the front, over the top
        for (let i = 0; i < 24; i++) {
          const ph = (i + 0.5) / 24 * TAU, nx = -Math.cos(ph), ny = Math.sin(ph), cp = cpAt(ph), p = S(nx, ny), len = clamp(9 * cp, -30, 12);
          // a push (cp > 0) points into the surface, a pull (cp < 0) outward
          if (Math.abs(len) > 1) { if (len > 0) kit.arrow(c, p[0] + nx * len * 1.6, p[1] - ny * len * 1.6, p[0], p[1], kit.hue(0), 1.5, 6); else kit.arrow(c, p[0], p[1], p[0] - nx * len, p[1] + ny * len, kit.hue(215), 1.5, 6); }
        }
        // stagnation points
        const stag = [];
        if (Math.abs(g) <= 2) { const s1 = Math.asin(-g / 2); stag.push([-Math.cos(s1), Math.sin(s1)], [-Math.cos(Math.PI - s1), Math.sin(Math.PI - s1)]); }
        else stag.push([0, (-g - Math.sign(g) * Math.sqrt(g * g - 4)) / 2]);   // on the axis, the root of y² + gy + 1 = 0 outside the body
        for (const q of stag) { const p = S(q[0], q[1]); kit.dot(c, p[0], p[1], 5, C.warn, C.text); }
        // water carried along (RK2), respawned upstream
        if (V.tr) {
          const spd = 1.4;
          for (const t of tracers) {
            if (t.dead) { t.x = -xr - R() * xr * 0.3; t.y = (2 * R() - 1) * yr; t.dead = false; t.age = 0; }
            const h = dt * spd, u1 = flowVel(t.x, t.y, g), xm = t.x + 0.5 * h * u1[0], ym = t.y + 0.5 * h * u1[1], u2 = flowVel(xm, ym, g);
            t.x += h * u2[0]; t.y += h * u2[1]; t.age += dt;
            if (t.x > xr + 0.2 || Math.abs(t.y) > yr + 0.5 || t.x * t.x + t.y * t.y < 1.01 || t.age > 40) t.dead = true;
            else if (t.x > -xr) { const p = S(t.x, t.y); kit.dot(c, p[0], p[1], 2.4, C.text); }
          }
        }
        kit.label(c, 'U →', 10, 14, { size: 12.5, weight: 700, color: C.text });
        // numbers in real units
        const rho = V.fl, U = V.U, a = V.a, q = 0.5 * rho * U * U, G = 4 * Math.PI * U * a * V.g;
        let cpMin = 1; for (let i = 0; i < 360; i++) cpMin = Math.min(cpMin, cpAt(i * DEG));
        ro.set('G', fmt(G, 3) + ' m²/s');
        ro.set('vmax', fmt(U * Math.sqrt(1 - cpMin), 3) + ' m/s (' + fmt(Math.sqrt(1 - cpMin), 3) + ' U)');
        ro.set('pf', '+' + paStr(q) + ' (C_p = 1)');
        ro.set('pmin', paStr(q * cpMin) + ' (C_p = ' + cpMin.toFixed(2) + ')');
        ro.set('drag', '0 — front and back pressures balance');
        ro.set('lift', fmt(rho * U * G, 3) + ' N/m' + (Math.abs(G) > 0 ? (G > 0 ? ' (upward)' : ' (downward)') : ''));
        ro.set('stag', Math.abs(g) <= 2 ? stag.map(q2 => (Math.atan2(q2[1], -q2[0]) / DEG).toFixed(0) + '°').join(' and ') + ' from the front (− = underneath)' : 'one, off the surface, ' + (g > 0 ? 'below' : 'above'));
        if (plotted !== g) {
          plotted = g;
          const cur = [], ref = [];
          for (let i = 0; i <= 180; i++) { const ph = i * 2 * DEG; cur.push([i * 2, cpAt(ph)]); ref.push([i * 2, 1 - 4 * Math.pow(Math.sin(ph), 2)]); }
          plot.set({ series: [{ pts: ref, label: 'no circulation', dash: [5, 4], color: C.muted }, { pts: cur, label: 'now', color: C.accent }], vlines: [{ x: 90, label: 'top' }, { x: 180, label: 'back' }, { x: 270, label: 'bottom' }] });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mat-shear */
  const FLUIDS = [
    { name: 'Water', eta: 1.0e-3, rho: 998 }, { name: 'Air', eta: 1.81e-5, rho: 1.204 }, { name: 'Olive oil', eta: 0.081, rho: 911 },
    { name: 'Glycerol', eta: 1.41, rho: 1261 }, { name: 'Honey', eta: 10, rho: 1420 }
  ];
  const timeStr = s => s >= 60 ? (s / 60).toFixed(1) + ' min' : s >= 1 ? s.toFixed(2) + ' s' : s >= 1e-3 ? (s * 1e3).toFixed(2) + ' ms' : (s * 1e6).toFixed(1) + ' µs';
  Hyper.sim('mat-shear', {
    title: 'Viscosity: a plate starts to slide',
    blurb: `Fluid fills the gap between two plates. Suddenly the top plate moves at speed $V$: the fluid touching it moves with it (no slip), and the fluid touching the bottom plate stays put. Viscosity passes the motion down layer by layer — momentum *diffuses*, with the kinematic viscosity $\\nu = \\eta/\\rho$ as its diffusion coefficient. The dye lines, straight at the start, are sheared by the flow; the arrows show the velocity and the right-hand panel the velocity profile, computed from $\\partial u/\\partial t = \\nu\\,\\partial^2u/\\partial y^2$ (a [[?partial-derivative|partial]] [[?differential-equation]]). After a time of order $d^2/\\nu$ the profile is a straight line — Couette flow — and the force per area on each plate is $\\eta V/d$.

**Try this**
- Watch the stress on the bottom plate (graph and arrow): zero at first, it appears only once the motion has diffused across the gap.
- Tick *Real time* and compare water, air and glycerol in a 1 cm gap: water takes minutes, air seconds, glycerol a blink. (Unticked, time is rescaled so every fluid can be watched; the readouts give the real times.)
- Halve the gap: the time $d^2/\\nu$ falls fourfold and the steady stress $\\eta V/d$ doubles.
- Stop the plate: the fluid coasts on and slows, its momentum now leaking into both plates.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'fl', type: 'select', label: 'Fluid (20 °C)', options: FLUIDS.map((f, i) => [f.name + ' (η = ' + fmt(f.eta, 3) + ' Pa·s)', i]), value: 0 },
        { id: 'd', label: 'Gap d', min: 1, max: 20, step: 0.5, value: 10, unit: 'mm' },
        { id: 'V', label: 'Plate speed V', min: 0.1, max: 20, value: 1, unit: 'cm/s', log: true, sig: 3 },
        { id: 'real', type: 'check', label: 'Real time (otherwise rescaled to fit)', value: false },
        { type: 'buttons', items: [{ id: 'go', label: 'Start the plate', primary: true }, { id: 'stop', label: 'Stop the plate' }, { id: 'rest', label: 'Fluid at rest' }] }
      ], id => {
        if (id === 'go') start(true);
        else if (id === 'stop') moving = false;
        else if (id === 'rest') start(false);
        else if (id === 'fl' || id === 'd' || id === 'real') start(moving);
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['tv', 'Viscous time d²/ν'], ['t', 'Time since the start'], ['top', 'Stress on the top plate'], ['bot', 'Stress on the bottom plate'], ['ss', 'Steady stress ηV/d'], ['re', 'Reynolds number Vd/ν']]);
      const plot = kit.plot(gb, { x: { label: 'time since the start', min: 0 }, y: { label: 'stress on the plate (Pa)', min: 0 }, legend: true }, 150);
      const N = 60, u = new Float64Array(N + 1), X = new Float64Array(N + 1), a = new Float64Array(N + 1), cp = new Float64Array(N + 1), dp = new Float64Array(N + 1);
      let moving = true, t = 0, hist = [], lastPlot = 0, shift = 0;
      function start(go) { u.fill(0); X.fill(0); t = 0; hist = []; lastPlot = -1; moving = go; shift = 0; }
      start(true);
      // one implicit (backward Euler) step of u_t = ν u_yy: stable for any step, and it never overshoots
      function step(h, nu, dy, top) {
        const r = nu * h / (dy * dy);
        for (let j = 0; j <= N; j++) a[j] = u[j];
        // Thomas algorithm on the interior nodes; u[0] = 0 and u[N] = top are fixed
        cp[1] = -r / (1 + 2 * r); dp[1] = a[1] / (1 + 2 * r);
        for (let j = 2; j < N; j++) { const m = 1 + 2 * r + r * cp[j - 1]; cp[j] = -r / m; dp[j] = (a[j] + (j === N - 1 ? r * top : 0) + r * dp[j - 1]) / m; }
        if (N - 1 === 1) dp[1] = (a[1] + r * top) / (1 + 2 * r);
        u[0] = 0; u[N] = top; u[N - 1] = dp[N - 1];
        for (let j = N - 2; j >= 1; j--) u[j] = dp[j] - cp[j] * u[j + 1];
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, F = FLUIDS[V.fl] || FLUIDS[0];
        const d = V.d * 1e-3, Vs = V.V * 1e-2, nu = F.eta / F.rho, tv = d * d / nu, dy = d / N;
        const scale = V.real ? 1 : tv / 20, Tp = dt * scale, n = clamp(Math.ceil(Tp / (0.01 * tv)), 1, 200), h = Tp / n, top = moving ? Vs : 0;
        for (let s = 0; s < n; s++) {
          for (let j = 0; j <= N; j++) X[j] += 0.5 * u[j] * h;
          step(h, nu, dy, top);
          for (let j = 0; j <= N; j++) X[j] += 0.5 * u[j] * h;
        }
        t += Tp;
        const tauTop = F.eta * (u[N] - u[N - 1]) / dy, tauBot = F.eta * (u[1] - u[0]) / dy, tauSS = F.eta * Vs / d;
        // drawing: the channel with its plates, dye and velocity arrows
        const chX = 20, chW = W * 0.64, yT = 34, yB = H - 30, gh = yB - yT, kd = 50 / (Vs * scale);   // px per metre of displacement
        c.fillStyle = C.surface; c.fillRect(chX, yT, chW, gh);
        shift = (shift + top * Tp * kd) % 14;
        c.fillStyle = C.text; c.fillRect(chX, yT - 12, chW, 12); c.fillRect(chX, yB, chW, 12);
        c.strokeStyle = C.bg2 || C.surface; c.lineWidth = 2;
        for (let x = chX - 14 + shift; x < chX + chW; x += 14) { c.beginPath(); c.moveTo(Math.max(chX, x), yT - 1); c.lineTo(Math.max(chX, x + 8), yT - 11); c.stroke(); }
        for (let x = chX; x < chX + chW; x += 14) { c.beginPath(); c.moveTo(x, yB + 11); c.lineTo(Math.min(chX + chW, x + 8), yB + 1); c.stroke(); }
        const Yj = j => yB - gh * j / N;
        for (let k = 0; k < 8; k++) {
          const x0 = chW * (k + 0.5) / 8;
          c.strokeStyle = kit.hue(200 + k * 20, 0.9); c.lineWidth = 2.2; c.beginPath();
          let prev = null;
          for (let j = 0; j <= N; j++) {
            const xx = chX + (((x0 + X[j] * kd) % chW) + chW) % chW, yy = Yj(j);
            if (prev == null || Math.abs(xx - prev) > chW / 2) c.moveTo(xx, yy); else c.lineTo(xx, yy);
            prev = xx;
          }
          c.stroke();
        }
        for (let j = 5; j < N; j += 8) { const len = 70 * u[j] / Math.max(Vs, 1e-12); if (len > 1) kit.arrow(c, chX + chW / 2 - 35, Yj(j), chX + chW / 2 - 35 + len, Yj(j), C.text, 1.6, 7); }
        // the plates feel the fluid: the top plate is held back, the bottom one dragged along
        const al = v => clamp(40 * v / Math.max(tauSS, 1e-12), 0, 70);
        if (al(tauTop) > 2) kit.arrow(c, chX + chW - 10, yT - 20, chX + chW - 10 - al(tauTop), yT - 20, C.bad, 2.2);
        if (al(tauBot) > 2) kit.arrow(c, chX + chW - 10 - al(tauBot), yB + 22, chX + chW - 10, yB + 22, C.ok, 2.2);
        kit.label(c, moving ? 'top plate moving at V →' : 'top plate stopped', chX + 4, yT - 22, { size: 12, weight: 600 });
        kit.label(c, 'bottom plate fixed', chX + 4, yB + 22, { size: 12, color: C.muted });
        // the velocity profile
        const px = chX + chW + 30, pw = W - px - 16, P = v => px + pw * v / Math.max(Vs, 1e-12);
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(px, yT); c.lineTo(px, yB); c.lineTo(px + pw, yB); c.stroke();
        c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(px, yB); c.lineTo(P(Vs), yT); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath(); for (let j = 0; j <= N; j++) { if (j) c.lineTo(P(u[j]), Yj(j)); else c.moveTo(P(u[j]), Yj(j)); } c.stroke();
        kit.label(c, 'u(y)', px + 4, yT - 10, { size: 12, color: C.accent, weight: 600 });
        kit.label(c, 'V', P(Vs), yB + 12, { size: 11.5, color: C.muted, align: 'center' });
        kit.label(c, 'd = ' + V.d + ' mm', px - 6, (yT + yB) / 2, { size: 11.5, color: C.muted, align: 'right' });
        // numbers and the stress graph
        ro.set('tv', timeStr(tv));
        ro.set('t', timeStr(t) + (V.real ? ' (real time)' : scale >= 1 ? ' (shown ' + fmt(scale, 3) + '× faster)' : ' (shown ' + fmt(1 / scale, 3) + '× slower)'));
        ro.set('top', paStr(tauTop)); ro.set('bot', paStr(tauBot)); ro.set('ss', paStr(tauSS)); ro.set('re', fmt(Vs * d / nu, 3));
        if (hist.length < 400 && (t - lastPlot > tv / 150 || lastPlot < 0)) {
          lastPlot = t; hist.push([t / tv, Math.min(tauTop, 6 * tauSS), tauBot]);
          if (hist.length % 3 === 1) plot.set({ x: { label: 'time since the start, in units of d²/ν', min: 0 }, y: { label: 'stress on the plate (Pa)', min: 0 }, series: [{ pts: hist.map(q => [q[0], q[1]]), label: 'top plate', color: C.bad }, { pts: hist.map(q => [q[0], q[2]]), label: 'bottom plate', color: C.ok }], hlines: [{ y: tauSS, label: 'ηV/d' }] });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mat-wake */
  // a D2Q9 lattice-Boltzmann fluid (BGK collisions), inflow U0 on the left, a cylinder of diameter D cells
  Hyper.sim('mat-wake', {
    title: 'Wet water past a cylinder: from smooth flow to a vortex street',
    blurb: `A computer fluid flowing past a cylinder. It is a lattice-Boltzmann model: on every square of a grid, populations of fluid "particles" stream to the neighbouring squares and collide, and on average they obey the Navier–Stokes equation. Colours show the swirl (red one way, blue the other — the [[?curl]] of the velocity), the speed or the pressure; dye released upstream draws streaklines. The Reynolds number $\\mathrm{Re} = UD/\\nu$ is set through the viscosity. A probe behind the cylinder counts the shed vortices and gives the Strouhal number $fD/U$.

**Try this**
- Re = 3: the flow wraps round and closes up behind — almost the same front and back; viscosity rules.
- Re = 20–40: two eddies sit behind the cylinder, longer as Re grows (press *Start again* after a big change to watch the pattern form).
- Re = 60–150: the eddies break away in turn — a Kármán vortex street. It needs a little time to grow out of the symmetric start; the Strouhal number then settles near 0.2 (a little above the value in open water, because the walls of this channel are close).
- Colour by pressure: high in front, low in the eddies behind. That imbalance is the drag that dry water could not give.
- Same Re, same flow: Re = 100 is a 1 cm rod in water at 1 cm/s, or a 1 mm wire in air at 1.5 m/s.`,
    mount(box, kit) {
      const NX = 180, NY = 72, NN = NX * NY, D = 14, CX = 40, CY = 36.35, U0 = 0.1;
      const st = kit.stage(box.stage, { aspect: NY / NX, minH: 200 });
      const ctl = kit.controls(box.side, [
        { id: 'Re', label: 'Reynolds number Re = UD/ν', min: 2, max: 160, value: 100, log: true, sig: 3 },
        { id: 'view', type: 'select', label: 'Colour by', options: [['Swirl (vorticity)', 'curl'], ['Speed', 'speed'], ['Pressure', 'rho']], value: 'curl' },
        { id: 'dye', type: 'check', label: 'Dye streaks', value: true },
        { id: 'spf', type: 'select', label: 'Model steps per frame', options: [['4', 4], ['8', 8], ['16 (faster)', 16]], value: 8 },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again', primary: true }] }
      ], id => { if (id === 'reset') init(); if (id === 'Re') { cross = []; amp = 0; } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['re', 'Reynolds number'], ['nu', 'Lattice viscosity ν (τ)'], ['eq', 'Same Re in the lab'], ['reg', 'Expected at this Re'], ['st', 'Measured behind the cylinder'], ['sh', 'Strouhal number fD/U'], ['t', 'Time (in D/U)']]);
      const f = []; for (let k = 0; k < 9; k++) f.push(new Float32Array(NN));
      const [n0, nN, nS, nE, nW, nNE, nSE, nNW, nSW] = f;
      const rho = new Float32Array(NN), ux = new Float32Array(NN), uy = new Float32Array(NN), bar = new Uint8Array(NN), bars = [];
      for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) if ((x - CX) * (x - CX) + (y - CY) * (y - CY) <= D * D / 4) { bar[x + y * NX] = 1; if (x > 0 && y > 0 && x < NX - 1 && y < NY - 1) bars.push(x + y * NX); }
      function setEq(i, vx, vy, r) {
        const ux3 = 3 * vx, uy3 = 3 * vy, ux2 = vx * vx, uy2 = vy * vy, uxuy2 = 2 * vx * vy, u2 = ux2 + uy2, u215 = 1.5 * u2;
        n0[i] = 4 / 9 * r * (1 - u215);
        nE[i] = r / 9 * (1 + ux3 + 4.5 * ux2 - u215); nW[i] = r / 9 * (1 - ux3 + 4.5 * ux2 - u215);
        nN[i] = r / 9 * (1 + uy3 + 4.5 * uy2 - u215); nS[i] = r / 9 * (1 - uy3 + 4.5 * uy2 - u215);
        nNE[i] = r / 36 * (1 + ux3 + uy3 + 4.5 * (u2 + uxuy2) - u215); nSE[i] = r / 36 * (1 + ux3 - uy3 + 4.5 * (u2 - uxuy2) - u215);
        nNW[i] = r / 36 * (1 - ux3 + uy3 + 4.5 * (u2 - uxuy2) - u215); nSW[i] = r / 36 * (1 - ux3 - uy3 + 4.5 * (u2 + uxuy2) - u215);
        rho[i] = r; ux[i] = vx; uy[i] = vy;
      }
      let steps = 0, cross = [], amp = 0, lastSign = 0, msg = '';
      const tx = new Float32Array(3000), ty = new Float32Array(3000); let nt = 0;
      function init() {
        for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
          const i = x + y * NX;
          if (bar[i]) setEq(i, 0, 0, 1);
          else setEq(i, U0, x > CX && x < CX + 30 && y > CY ? 0.015 : 0, 1);   // a small nudge behind, to start the shedding sooner
        }
        steps = 0; cross = []; amp = 0; lastSign = 0; nt = 0;
      }
      init();
      function collide(omega) {
        for (let y = 1; y < NY - 1; y++) for (let x = 1; x < NX - 1; x++) {
          const i = x + y * NX; if (bar[i]) continue;
          const r = n0[i] + nN[i] + nS[i] + nE[i] + nW[i] + nNW[i] + nNE[i] + nSW[i] + nSE[i];
          const vx = (nE[i] + nNE[i] + nSE[i] - nW[i] - nNW[i] - nSW[i]) / r, vy = (nN[i] + nNE[i] + nNW[i] - nS[i] - nSE[i] - nSW[i]) / r;
          rho[i] = r; ux[i] = vx; uy[i] = vy;
          const r9 = r / 9, r36 = r / 36, ux3 = 3 * vx, uy3 = 3 * vy, ux2 = vx * vx, uy2 = vy * vy, uxuy2 = 2 * vx * vy, u2 = ux2 + uy2, u215 = 1.5 * u2;
          n0[i] += omega * (4 / 9 * r * (1 - u215) - n0[i]);
          nE[i] += omega * (r9 * (1 + ux3 + 4.5 * ux2 - u215) - nE[i]);
          nW[i] += omega * (r9 * (1 - ux3 + 4.5 * ux2 - u215) - nW[i]);
          nN[i] += omega * (r9 * (1 + uy3 + 4.5 * uy2 - u215) - nN[i]);
          nS[i] += omega * (r9 * (1 - uy3 + 4.5 * uy2 - u215) - nS[i]);
          nNE[i] += omega * (r36 * (1 + ux3 + uy3 + 4.5 * (u2 + uxuy2) - u215) - nNE[i]);
          nSE[i] += omega * (r36 * (1 + ux3 - uy3 + 4.5 * (u2 - uxuy2) - u215) - nSE[i]);
          nNW[i] += omega * (r36 * (1 - ux3 + uy3 + 4.5 * (u2 - uxuy2) - u215) - nNW[i]);
          nSW[i] += omega * (r36 * (1 - ux3 - uy3 + 4.5 * (u2 + uxuy2) - u215) - nSW[i]);
        }
      }
      // streaming in place (loop orders chosen so nothing is overwritten before it moves); edges stay at the free stream
      function stream() {
        for (let y = NY - 2; y > 0; y--) for (let x = 1; x < NX - 1; x++) { nN[x + y * NX] = nN[x + (y - 1) * NX]; nNW[x + y * NX] = nNW[x + 1 + (y - 1) * NX]; }
        for (let y = NY - 2; y > 0; y--) for (let x = NX - 2; x > 0; x--) { nE[x + y * NX] = nE[x - 1 + y * NX]; nNE[x + y * NX] = nNE[x - 1 + (y - 1) * NX]; }
        for (let y = 1; y < NY - 1; y++) for (let x = NX - 2; x > 0; x--) { nS[x + y * NX] = nS[x + (y + 1) * NX]; nSE[x + y * NX] = nSE[x - 1 + (y + 1) * NX]; }
        for (let y = 1; y < NY - 1; y++) for (let x = 1; x < NX - 1; x++) { nW[x + y * NX] = nW[x + 1 + y * NX]; nSW[x + y * NX] = nSW[x + 1 + (y + 1) * NX]; }
        // bounce-back: what streamed into the cylinder goes back out the way it came
        for (const i of bars) {
          nE[i + 1] = nW[i]; nW[i - 1] = nE[i]; nN[i + NX] = nS[i]; nS[i - NX] = nN[i];
          nNE[i + 1 + NX] = nSW[i]; nNW[i - 1 + NX] = nSE[i]; nSE[i + 1 - NX] = nNW[i]; nSW[i - 1 - NX] = nNE[i];
        }
      }
      const off = document.createElement('canvas'); off.width = NX; off.height = NY;
      const octx = off.getContext('2d'), img = octx.createImageData(NX, NY);
      const PX = Math.round(CX + 3 * D), PY = Math.round(CY), PI_ = PX + PY * NX;
      const sample = (A, x, y) => { const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0, i = x0 + y0 * NX; return A[i] * (1 - fx) * (1 - fy) + A[i + 1] * fx * (1 - fy) + A[i + NX] * (1 - fx) * fy + A[i + NX + 1] * fx * fy; };
      const loop = kit.loop(() => {
        const C = kit.colors(), nu = U0 * D / V.Re, omega = 1 / (3 * nu + 0.5);
        for (let s = 0; s < V.spf; s++) {
          collide(omega); stream(); steps++;
          // the probe: count upward crossings of the sideways velocity, with a little hysteresis
          const v = uy[PI_]; amp = Math.max(amp * 0.9995, Math.abs(v));
          if (v > 0.002 && lastSign <= 0) { lastSign = 1; cross.push(steps); if (cross.length > 6) cross.shift(); } else if (v < -0.002) lastSign = -1;
        }
        // if the model ever goes unstable, start again rather than draw nonsense
        let bad = false; for (let k = 0; k < 40; k++) { const r = rho[(k * 7919) % NN]; if (!(r > 0.3 && r < 3)) { bad = true; break; } }
        if (bad) { init(); msg = 'the model became unstable and was restarted'; } else if (steps > 400) msg = '';
        // dye: release, carry along, forget when it leaves or hits the cylinder
        if (V.dye) {
          for (let yy = CY - 20; yy <= CY + 20.1 && nt < 3000; yy += 5) { tx[nt] = 3; ty[nt] = yy; nt++; }
          let w = 0;
          for (let k = 0; k < nt; k++) {
            let x = tx[k], y = ty[k];
            if (x < 1 || x >= NX - 2 || y < 1 || y >= NY - 2) continue;
            x += sample(ux, x, y) * V.spf; y += sample(uy, x, y) * V.spf;
            if (x < 1 || x >= NX - 2 || y < 1 || y >= NY - 2 || bar[Math.round(x) + Math.round(y) * NX]) continue;
            tx[w] = x; ty[w] = y; w++;
          }
          nt = w;
        } else nt = 0;
        // the picture
        const d = img.data, dark = C.dark, bg = dark ? [20, 24, 44] : [246, 247, 251], pos = [228, 80, 60], neg = [60, 120, 235], grey = dark ? [120, 125, 150] : [150, 150, 160];
        for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
          const i = x + y * NX, j = 4 * (x + (NY - 1 - y) * NX);
          let col = bg, m = 0;
          if (bar[i]) { col = grey; m = 1; }
          else if (V.view === 'curl') {
            if (x > 0 && x < NX - 1 && y > 0 && y < NY - 1) { const cu = uy[i + 1] - uy[i - 1] - ux[i + NX] + ux[i - NX]; m = clamp(Math.abs(cu) * 25, 0, 1); col = cu > 0 ? pos : neg; }
          } else if (V.view === 'speed') {
            const sp = clamp(Math.hypot(ux[i], uy[i]) / (1.8 * U0), 0, 1); m = 0.15 + 0.85 * sp; col = sp > 0.55 ? [240, 190, 60] : [40, 170, 170];
          } else {
            const cp = (rho[i] - 1) / 3 / (0.5 * U0 * U0); m = clamp(Math.abs(cp) / 1.2, 0, 1); col = cp > 0 ? pos : neg;
          }
          d[j] = bg[0] + (col[0] - bg[0]) * m; d[j + 1] = bg[1] + (col[1] - bg[1]) * m; d[j + 2] = bg[2] + (col[2] - bg[2]) * m; d[j + 3] = 255;
        }
        octx.putImageData(img, 0, 0);
        const c = st.begin(), W = st.W, H = st.H, sx = W / NX, sy = H / NY;
        c.imageSmoothingEnabled = true; c.drawImage(off, 0, 0, W, H);
        if (V.dye && nt) { c.fillStyle = dark ? 'rgba(255,255,255,0.8)' : 'rgba(20,20,40,0.75)'; for (let k = 0; k < nt; k++) c.fillRect(tx[k] * sx - 0.9, H - ty[k] * sy - 0.9, 1.8, 1.8); }
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.ellipse(CX * sx, H - CY * sy, D / 2 * sx, D / 2 * sy, 0, 0, TAU); c.stroke();
        kit.dot(c, PX * sx, H - PY * sy, 3, C.warn, C.text);
        kit.label(c, 'flow →', 8, 12, { size: 12, weight: 700, color: C.text, bg: C.surface });
        kit.label(c, 'probe', PX * sx + 6, H - PY * sy - 10, { size: 11, color: C.text, bg: C.surface });
        if (msg) kit.label(c, msg, W / 2, H - 12, { size: 12, align: 'center', color: C.bad, bg: C.surface });
        // readouts
        const Re = V.Re;
        let per = 0; if (cross.length >= 3) { per = (cross[cross.length - 1] - cross[0]) / (cross.length - 1); }
        const shedding = amp > 0.004 && per > 0 && steps - cross[cross.length - 1] < 3 * per;
        ro.set('re', fmt(Re, 3));
        ro.set('nu', fmt(nu, 3) + ' (τ = ' + (3 * nu + 0.5).toFixed(3) + ')');
        ro.set('eq', '1 cm rod in water at ' + fmt(Re * 0.1, 3) + ' mm/s');
        ro.set('reg', Re < 5 ? 'flow closes up behind' : Re < 47 ? 'two attached eddies' : Re < 190 ? 'a Kármán vortex street' : 'turbulent wake (in reality)');
        ro.set('st', shedding ? 'a vortex pair every ' + fmt(per * U0 / D, 3) + ' D/U' : steps * U0 / D < 20 ? 'settling…' : 'steady: no shedding');
        ro.set('sh', shedding ? fmt(D / (per * U0), 3) : '—');
        ro.set('t', (steps * U0 / D).toFixed(0));
      }, box.stage);
      loop.start();
    }
  });

})();
