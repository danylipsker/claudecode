/* HYPER-FEYNMAN · sims/symmetry.js — simulations for Symmetry and conservation (content/symmetry.js).
 *   sym-invariance-lab    a cannon, a bell and a pendulum; a copy moved, turned (with or without the Earth), delayed,
 *                         carried on a cart or scaled up — the same result, except when scaled
 *   sym-galileo-bones     Galileo's square–cube law: a beam that snaps under its own weight, an animal whose legs break
 *   sym-local-charge      a space-time diagram: a charge vanishing here and appearing there, seen by a moving observer
 *   sym-reaction-checker  conservation laws checked for real and impossible particle reactions, with the beta spectrum
 *   sym-noether-orbit     a ball in a bowl: round keeps L (equal areas), squashed makes L wander, pulsed changes E
 *   sym-noether-box       discs in a round, square or wall-less tray: which of p, L and E are kept
 *   sym-double-well       stationary states of a double well (kit.qm.eigen1d): even and odd, and lost parity when tilted
 *   sym-parity-packet     a wave packet in a double well (kit.qm.wave1d): tunnelling to and fro, with ⟨P⟩ conserved
 *   sym-cobalt-mirror     Wu's cobalt-60 experiment beside its mirror image
 *   sym-cp-pion           pion decay in our world, the mirror (P), antimatter (C) and both (CP)
 *   sym-kaon-count        CP violation in K_L → π e ν: counting millions of decays until the 0.33 % shows
 */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rot = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [c * p[0] - s * p[1], s * p[0] + c * p[1]]; };
  const f2 = (v, d) => (Number.isFinite(v) ? v : 0).toFixed(d == null ? 2 : d);
  function nice(x) { const e = Math.pow(10, Math.floor(Math.log10(x))), m = x / e; return (m >= 5 ? 5 : m >= 2 ? 2 : 1) * e; }
  function lenText(m) {
    if (m >= 1000) return f2(m / 1000, m >= 1e4 ? 0 : 1) + ' km';
    if (m >= 1) return (m >= 10 ? m.toFixed(0) : m.toFixed(1)) + ' m';
    if (m >= 0.01) return (m * 100).toFixed(m >= 0.1 ? 0 : 1) + ' cm';
    return (m * 1000).toFixed(1) + ' mm';
  }
  function poly(c, pts, fill, stroke, w) {
    if (!pts.length) return;
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = w || 1; c.stroke(); }
  }
  function line(c, x1, y1, x2, y2, col, w, dash) {
    c.strokeStyle = col; c.lineWidth = w || 1; if (dash) c.setLineDash(dash);
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); if (dash) c.setLineDash([]);
  }
  function circle(c, x, y, r, fill, stroke, w) {
    c.beginPath(); c.arc(x, y, Math.max(0.5, r), 0, TAU);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = w || 1; c.stroke(); }
  }

  /* ================================================================ the invariance lab */
  Hyper.sim('sym-invariance-lab', {
    title: 'Move it, turn it, wait, ride along — or make it bigger',
    blurb: `An experiment: a cannon on a bench fires a ball that should ring a bell, while a pendulum beats time beside it. On the left is the original; on the right, a copy to which something has been done. The laws of physics are **symmetric** under that operation if the copy gives the same result.

**Try this**
- *Move it* anywhere: the copy rings its bell at the same moment as the original.
- *Turn it* with *Turn the Earth too* ticked: the whole world turns, gravity with it, and the shot still rings the bell. Untick it: the apparatus is turned but gravity still points down — the ball misses and the pendulum swings about a different line. The laws were not at fault; the Earth was left behind.
- *Start it later*: the same things happen, later.
- *Put it on a moving cart*: from the ground the ball flies a longer, skewed curve, yet it rings the bell the cart carries along. Steady motion cannot be detected from inside.
- *Make it bigger*: same materials, same gravity, and a cannon that fires its bigger ball at the same speed. The ball flies as far as before and misses the distant bell; the longer pendulum swings more slowly, its period growing as √s. Size is not a symmetry.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const G = 9.81, V0 = 9, AL = Math.PI / 4, LP = 1.2, PH0 = 25 * Math.PI / 180;
      const R = V0 * V0 * Math.sin(2 * AL) / G, TF = 2 * V0 * Math.sin(AL) / G;
      const PIV = [-2.2, 3.4], BENCH = -0.5, X0W = -4.5, X1W = 19.5, Y0W = -4, Y1W = 10.5, BASE = [0, 3];
      const DT = 0.01, NT = 520;
      const ctl = kit.controls(box.side, [
        { id: 'op', type: 'select', label: 'Do this to the copy', options: [['Move it somewhere else', 'move'], ['Turn it', 'turn'], ['Start it later', 'delay'], ['Put it on a moving cart', 'boost'], ['Make it bigger (same materials)', 'scale']], value: 'move' },
        { id: 'dx', label: 'Move sideways', min: -4, max: 4, step: 0.1, value: 2.5, unit: 'm' },
        { id: 'dy', label: 'Move up', min: -2, max: 4, step: 0.1, value: 1.5, unit: 'm' },
        { id: 'ang', label: 'Turn by', min: -45, max: 45, step: 1, value: 30, unit: '°' },
        { id: 'earth', type: 'check', label: 'Turn the Earth too (gravity turns with it)', value: true },
        { id: 'lag', label: 'Start later by', min: 0, max: 3, step: 0.1, value: 1.2, unit: 's' },
        { id: 'u', label: 'Speed of the cart', min: -5, max: 5, step: 0.1, value: 3, unit: 'm/s' },
        { id: 's', label: 'Scale factor', min: 0.5, max: 1.8, step: 0.05, value: 1.5 },
        { type: 'buttons', items: [{ id: 'fire', label: 'Fire both again', primary: true }] }
      ], () => { build(); t = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['o', 'Original'], ['c', 'Copy'], ['T', 'Pendulum periods'], ['v', 'Verdict']]);
      let t = 0, runs = [null, null];

      function place(k, p, tc) {
        if (k === 0) return [BASE[0] + p[0], BASE[1] + p[1]];
        switch (V.op) {
          case 'move': return [BASE[0] + p[0] + V.dx, BASE[1] + p[1] + V.dy];
          case 'turn': { const q = rot(p, V.ang * Math.PI / 180); return [BASE[0] + q[0], BASE[1] + q[1]]; }
          case 'scale': return [BASE[0] + V.s * p[0], BASE[1] + V.s * p[1]];
          case 'boost': return [BASE[0] + p[0] + V.u * ((tc || 0) - 1.2), BASE[1] + p[1]];
          default: return [BASE[0] + p[0], BASE[1] + p[1]];
        }
      }
      function unplace(k, w) {
        const d = [w[0] - BASE[0], w[1] - BASE[1]];
        if (k === 1 && V.op === 'turn') return rot(d, -V.ang * Math.PI / 180);
        if (k === 1 && V.op === 'scale') return [d[0] / V.s, d[1] / V.s];
        return d;
      }
      const appBall = tt => tt <= TF ? [V0 * Math.cos(AL) * tt, V0 * Math.sin(AL) * tt - 0.5 * G * tt * tt] : [R, 0];
      function pendulum(len, ph0) {
        const out = new Float64Array(NT + 1); let ph = ph0, w = 0; const h = 0.002, n = Math.round(DT / h);
        const acc = p => -(G / len) * Math.sin(p);
        out[0] = ph;
        for (let i = 1; i <= NT; i++) {
          for (let j = 0; j < n; j++) {
            const k1p = w, k1w = acc(ph), k2p = w + h / 2 * k1w, k2w = acc(ph + h / 2 * k1p), k3p = w + h / 2 * k2w, k3w = acc(ph + h / 2 * k2p), k4p = w + h * k3w, k4w = acc(ph + h * k3p);
            ph += h / 6 * (k1p + 2 * k2p + 2 * k3p + k4p); w += h / 6 * (k1w + 2 * k2w + 2 * k3w + k4w);
          }
          out[i] = ph;
        }
        return out;
      }
      const period = (len, a) => TAU * Math.sqrt(len / G) * (1 + a * a / 16 + 11 * Math.pow(a, 4) / 3072);
      function run(k) {
        const r = { ball: [], hit: -1, miss: Infinity, len: LP, ph0: PH0, gA: 0, sc: 1 };
        const worldPhysics = k === 1 && ((V.op === 'turn' && !V.earth) || V.op === 'scale');
        if (k === 1 && V.op === 'scale') { r.sc = V.s; r.len = LP * V.s; }
        if (k === 1 && V.op === 'turn') { if (V.earth) r.gA = V.ang * Math.PI / 180; else r.ph0 = PH0 + V.ang * Math.PI / 180; }
        const bell = place(k, [R, 0], 0), rad = 0.4 * r.sc;
        if (!worldPhysics) {
          for (let i = 0; i <= NT; i++) { const tt = i * DT; r.ball.push(appBall(tt)); }
          r.hit = Math.round(TF / DT); r.miss = 0;
        } else {
          const w0 = place(k, [0, 0], 0), v = V.op === 'turn' ? rot([V0 * Math.cos(AL), V0 * Math.sin(AL)], V.ang * Math.PI / 180) : [V0 * Math.cos(AL), V0 * Math.sin(AL)];
          let stop = null;
          for (let i = 0; i <= NT; i++) {
            const tt = i * DT;
            if (stop) { r.ball.push(stop); continue; }
            const at = q => [w0[0] + v[0] * q, w0[1] + v[1] * q - 0.5 * G * q * q];
            const w = at(tt), app = unplace(k, w), wn = at(tt + DT);
            const dist = Math.hypot(w[0] - bell[0], w[1] - bell[1]), distNext = Math.hypot(wn[0] - bell[0], wn[1] - bell[1]);
            if (tt > 0.2) r.miss = Math.min(r.miss, dist);
            // it rings the bell at its closest approach inside the bell
            if (tt > 0.2 && dist < rad && distNext >= dist) { r.hit = i; stop = app; r.ball.push(app); continue; }
            if (tt > 0.2 && app[1] < BENCH + 0.15 && app[0] > -3.4 && app[0] < R + 0.9) { stop = [app[0], BENCH + 0.15]; r.ball.push(stop); continue; }
            if (w[1] < Y0W + 0.3) { stop = app; }
            r.ball.push(app);
          }
          if (r.hit >= 0) r.miss = 0;
        }
        r.pend = pendulum(r.len, r.ph0);
        r.T = period(r.len, Math.abs(r.ph0));
        return r;
      }
      function build() {
        const op = V.op;
        ctl.show('dx', op === 'move'); ctl.show('dy', op === 'move'); ctl.show('ang', op === 'turn'); ctl.show('earth', op === 'turn');
        ctl.show('lag', op === 'delay'); ctl.show('u', op === 'boost'); ctl.show('s', op === 'scale');
        runs = [run(0), run(1)];
        const o = runs[0], c = runs[1];
        ro.set('o', 'rings the bell ' + f2(TF) + ' s after firing');
        let same = true;
        if (c.hit >= 0) ro.set('c', 'rings the bell ' + f2(c.hit * DT) + ' s after firing' + (op === 'delay' ? ' (' + f2(c.hit * DT + V.lag) + ' s on the lab clock)' : ''));
        else { ro.set('c', 'misses the bell by ' + f2(c.miss, 1) + ' m'); same = false; }
        ro.set('T', f2(o.T) + ' s / ' + f2(c.T) + ' s');
        if (Math.abs(c.T - o.T) > 0.01) same = false;
        const why = { move: 'moving is a symmetry', delay: 'waiting is a symmetry', boost: 'steady motion is a symmetry', turn: 'turning (with the Earth) is a symmetry', scale: '' };
        ro.set('v', same ? 'Same result — ' + (why[op] || 'a symmetry') : op === 'turn' ? 'Different — gravity was not turned with it' : 'Different — size is not a symmetry');
      }
      build();

      const loop = kit.loop(dt => {
        t += dt;
        const tEnd = 4.4 + (V.op === 'delay' ? V.lag : 0);
        if (t > tEnd + 0.8) t = 0;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const cols = [C.accent, C.series[1]];
        for (let k = 0; k < 2; k++) {
          const r = runs[k]; if (!r) continue;
          const px = k * W / 2 + 6, pw = W / 2 - 12, py = 24, ph = H - 30;
          const sc = Math.min(pw / (X1W - X0W), ph / (Y1W - Y0W)), ox = px + (pw - sc * (X1W - X0W)) / 2, oy = py + (ph - sc * (Y1W - Y0W)) / 2;
          const X = x => ox + (x - X0W) * sc, Y = y => oy + (Y1W - y) * sc;
          const tc = k === 1 && V.op === 'delay' ? t - V.lag : t;
          const P = p => { const w = place(k, p, Math.max(0, tc)); return [X(w[0]), Y(w[1])]; };
          // panel, grid, title
          c.fillStyle = C.surface || C.bg; c.fillRect(px, py, pw, ph);
          c.strokeStyle = C.grid; c.lineWidth = 1;
          for (let gx = Math.ceil(X0W / 2) * 2; gx <= X1W; gx += 2) line(c, X(gx), Y(Y0W), X(gx), Y(Y1W), C.grid, 1);
          for (let gy = Math.ceil(Y0W / 2) * 2; gy <= Y1W; gy += 2) line(c, X(X0W), Y(gy), X(X1W), Y(gy), C.grid, 1);
          const title = k === 0 ? 'Original' : { move: 'Copy: moved ' + f2(V.dx, 1) + ' m, ' + f2(V.dy, 1) + ' m up', turn: 'Copy: turned ' + V.ang + '°' + (V.earth ? ', Earth too' : ', Earth not turned'), delay: 'Copy: started ' + f2(V.lag, 1) + ' s later', boost: 'Copy: on a cart at ' + f2(V.u, 1) + ' m/s', scale: 'Copy: ' + f2(V.s) + ' times bigger' }[V.op];
          kit.label(c, title, px + 6, 12, { color: cols[k], weight: 700, size: 12.5 });
          // the cart
          if (k === 1 && V.op === 'boost') {
            const a = P([-3.6, BENCH - 0.15]), b = P([R + 1.1, BENCH - 0.15]);
            c.fillStyle = C.faint; c.fillRect(a[0], a[1], b[0] - a[0], 0.35 * sc);
            for (const wx of [-2.8, R * 0.5, R + 0.4]) { const w = P([wx, BENCH - 0.75]); circle(c, w[0], w[1], 0.38 * sc, C.bg2, C.muted, 1.5); }
            const u0 = P([R * 0.5, BENCH - 1.6]);
            kit.arrow(c, u0[0], u0[1], u0[0] + V.u * 0.5 * sc, u0[1], cols[1], 2);
            kit.label(c, 'u = ' + f2(V.u, 1) + ' m/s', u0[0], u0[1] + 12, { align: 'center', size: 11, color: C.muted });
          }
          // bench, stand, bell post
          const b0 = P([-3.4, BENCH]), b1 = P([R + 0.9, BENCH]);
          line(c, b0[0], b0[1], b1[0], b1[1], C.text, Math.max(2, 0.14 * sc * r.sc));
          const s0 = P([PIV[0], BENCH]), s1 = P(PIV);
          line(c, s0[0], s0[1], s1[0], s1[1], C.muted, 2);
          const bp0 = P([R, BENCH]), bp1 = P([R, -0.3]);
          line(c, bp0[0], bp0[1], bp1[0], bp1[1], C.muted, 2);
          // the bell, flashing when rung
          const hitT = r.hit >= 0 ? r.hit * DT : null, rang = hitT != null && tc >= hitT && tc < hitT + 0.6;
          poly(c, [[R - 0.36, -0.3], [R - 0.22, 0.22], [R, 0.42], [R + 0.22, 0.22], [R + 0.36, -0.3]].map(P), rang ? C.warn : 'hsl(45 70% 50% / .75)', C.text, 1);
          if (rang) { const q = P([R, 0.9]); kit.label(c, 'ding!', q[0], q[1], { align: 'center', weight: 700, color: C.warn }); }
          // the cannon
          const m0 = P([-0.95 * Math.cos(AL), -0.95 * Math.sin(AL)]), m1 = P([0, 0]);
          line(c, m0[0], m0[1], m1[0], m1[1], C.text, Math.max(3, 0.3 * sc * r.sc));
          const wh = P([-0.5, -0.2]); circle(c, wh[0], wh[1], 0.26 * sc * r.sc, C.bg2, C.text, 1.5);
          // the pendulum
          const i = clamp(Math.round(Math.max(0, tc) / DT), 0, NT), ph0 = tc < 0 ? r.ph0 : r.pend[i];
          const pv = place(k, PIV, Math.max(0, tc)), gA = r.gA;
          const bob = [pv[0] + r.len * Math.sin(gA + ph0), pv[1] - r.len * Math.cos(gA + ph0)];
          line(c, X(pv[0]), Y(pv[1]), X(bob[0]), Y(bob[1]), C.text, 1.4);
          circle(c, X(bob[0]), Y(bob[1]), 0.2 * sc * r.sc, cols[k], C.text, 1);
          // the ball and its trail
          const upto = tc < 0 ? -1 : i;
          c.strokeStyle = cols[k]; c.lineWidth = 1.5; c.setLineDash([3, 3]); c.beginPath();
          for (let j = 0; j <= upto; j += 2) { const w = place(k, r.ball[j], j * DT); if (j === 0) c.moveTo(X(w[0]), Y(w[1])); else c.lineTo(X(w[0]), Y(w[1])); }
          c.stroke(); c.setLineDash([]);
          const bw = place(k, upto < 0 ? [0, 0] : r.ball[upto], Math.max(0, tc));
          circle(c, X(bw[0]), Y(bw[1]), 0.17 * sc * r.sc, cols[k], C.text, 1);
          // gravity
          const gx = X(X1W - 1.4), gy = Y(Y1W - 1.2), gl = 1.6 * sc, gAng = gA;
          kit.arrow(c, gx, gy, gx + gl * Math.sin(gAng), gy + gl * Math.cos(gAng), C.muted, 2);
          kit.label(c, 'g', gx + 8, gy - 2, { color: C.muted, size: 11 });
          // clock
          kit.label(c, (k === 1 && V.op === 'delay' ? 'its clock ' : 't = ') + f2(Math.max(0, tc)) + ' s', px + 6, py + ph - 10, { size: 11, color: C.muted });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ Galileo's bones */
  const MATERIALS = { spruce: { name: 'spruce, along the grain', rho: 450, str: 60e6, E: 10e9 }, bone: { name: 'bone', rho: 1900, str: 170e6, E: 18e9 },
    steel: { name: 'structural steel', rho: 7850, str: 250e6, E: 200e9 }, alu: { name: 'aluminium alloy', rho: 2700, str: 270e6, E: 70e9 } };
  const REFS = [['ant', 0.004], ['mouse', 0.07], ['person', 1.75], ['house', 9], ['tower block', 60], ['300 m tower', 300]];

  Hyper.sim('sym-galileo-bones', {
    title: 'Galileo\'s bones: why a bigger copy breaks',
    blurb: `Galileo's argument, to scale. **A beam sticking out of a wall** carries nothing but its own weight; the picture always has the same shape, and the scale bar and the figure beside it tell you how big it really is. **A running animal** is always drawn the same size, so you can compare its shape at any real size. Stress is force per area: weight grows as $s^3$, area as $s^2$ — the [[?exponent|exponents]] are the whole story.

**Try this**
- Beam: slide the size from a matchstick to a bridge. The stress at the wall grows in step with the size, and somewhere between about 50 m and a few hundred metres, depending on the material, the beam snaps under its own weight. Its shape never changed.
- Compare materials: wood outlasts steel here — weaker, but far lighter.
- Make the beam stubbier (smaller L/h): it survives to a larger size.
- Animal: scale a 30 kg dog up. (We assume its bones work at a third of their strength when it runs — typical of running mammals.) Mass grows as s³, bone area as s²: at three times the size, an 800 kg dog breaks its legs.
- Tick *Thicken the bones as Galileo said*: the bones grow as s^{3/2}, the stress stays the same — and the animal starts to look like an elephant.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Scale up', options: [['A beam sticking out of a wall', 'beam'], ['A running animal', 'animal']], value: 'beam' },
        { id: 'L', label: 'Length of the beam', min: 0.01, max: 1000, value: 2, unit: 'm', log: true, sig: 3 },
        { id: 'k', label: 'Slenderness L/h', min: 5, max: 50, step: 1, value: 20 },
        { id: 'mat', type: 'select', label: 'Material', options: [['Spruce (wood)', 'spruce'], ['Bone', 'bone'], ['Structural steel', 'steel'], ['Aluminium alloy', 'alu']], value: 'spruce' },
        { id: 's', label: 'Scale factor of the animal', min: 0.1, max: 20, value: 1, log: true, sig: 3 },
        { id: 'thick', type: 'check', label: 'Thicken the bones as Galileo said (d ∝ s^1.5)', value: false }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['size', 'Size'], ['sig', 'Stress'], ['str', 'Strength'], ['sf', 'Safety factor'], ['Lb', 'Breaks at'], ['sag', 'Sag of the tip'], ['d', 'Leg bone diameter']]);
      let state = null, broke = null, t = 0;
      function update() {
        const beam = V.mode === 'beam';
        ctl.show('L', beam); ctl.show('k', beam); ctl.show('mat', beam); ctl.show('s', !beam); ctl.show('thick', !beam);
        ro.show('Lb', beam); ro.show('sag', beam); ro.show('d', !beam);
        let s;
        if (beam) {
          const M = MATERIALS[V.mat] || MATERIALS.spruce, L = V.L, h = L / V.k;
          const sig = 3 * M.rho * 9.81 * L * V.k, sag = 1.5 * M.rho * 9.81 * L * V.k * V.k / M.E;
          s = { beam, M, L, h, sig, ratio: sig / M.str, sag, Lb: M.str / (3 * M.rho * 9.81 * V.k) };
          ro.set('size', lenText(L) + ' long, ' + lenText(h) + ' deep');
          ro.set('Lb', lenText(s.Lb) + ' (for this L/h)');
          ro.set('sag', f2(100 * Math.min(sag, 1), sag < 0.01 ? 3 : 1) + ' % of the length');
          ro.set('str', f2(M.str / 1e6, 0) + ' MPa (' + M.name + ')');
        } else {
          const sc = V.s, str = 170e6, sig0 = str / 3, len = 0.9 * sc, mass = 30 * sc * sc * sc, d = 0.02 * (V.thick ? Math.pow(sc, 1.5) : sc);
          const sig = V.thick ? sig0 : sig0 * sc;
          s = { beam, sc, sig, ratio: sig / str, len, mass, d };
          ro.set('size', lenText(len) + ' long, ' + (mass >= 1000 ? f2(mass / 1000, 1) + ' t' : mass >= 1 ? f2(mass, 0) + ' kg' : f2(mass * 1000, 0) + ' g'));
          ro.set('d', lenText(d) + (V.thick ? ' (grown as s^1.5)' : ' (grown as s)'));
          ro.set('str', '170 MPa (bone)');
        }
        ro.set('sig', f2(s.sig / 1e6, s.sig < 1e6 ? 3 : 1) + ' MPa');
        ro.set('sf', s.ratio >= 1 ? 'broken (' + f2(s.ratio, 1) + '× over the strength)' : f2(1 / s.ratio, 1));
        if (s.ratio >= 1 && !(state && state.ratio >= 1 && state.beam === s.beam)) broke = t;
        if (s.ratio < 1) broke = null;
        state = s;
      }
      update();
      const stressCol = r => 'hsl(' + (120 - 120 * clamp(r, 0, 1)) + ' 70% 48%)';
      function gauge(c, C, x, y, h, r) {
        c.fillStyle = C.bg2; c.fillRect(x, y, 16, h);
        const f = clamp(r / 1.25, 0, 1); c.fillStyle = stressCol(r); c.fillRect(x, y + h * (1 - f), 16, h * f);
        const ys = y + h * (1 - 1 / 1.25); line(c, x - 4, ys, x + 20, ys, C.bad, 2);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(x, y, 16, h);
        kit.label(c, 'strength', x + 22, ys, { size: 10.5, color: C.bad });
        kit.label(c, 'stress', x + 8, y + h + 12, { size: 10.5, align: 'center', color: C.muted });
      }
      const loop = kit.loop(dt => {
        t += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, s = state;
        const fall = s.ratio >= 1 && broke != null ? clamp((t - broke) / 0.9, 0, 1) : 0;
        if (s.beam) {
          const wx = 70, root = H * 0.36, PL = Math.min(W * 0.58, W - 190), th = Math.max(2, PL / V.k), mpp = s.L / PL;
          // the wall
          c.fillStyle = C.faint; c.fillRect(wx - 30, 10, 30, H - 20);
          for (let y = 14; y < H - 14; y += 12) line(c, wx - 30, y + 10, wx - 18, y, C.muted, 1);
          // the beam: its true sag, or falling after it snaps
          c.save(); c.translate(wx, root + th / 2);
          if (fall > 0) c.rotate(1.25 * fall * fall);
          const pts = [], lo = [];
          for (let i = 0; i <= 40; i++) { const xi = i / 40, v = Math.min(s.sag, 0.5) * PL * xi * xi * (6 - 4 * xi + xi * xi) / 3; pts.push([xi * PL, -th / 2 + v]); lo.push([xi * PL, th / 2 + v]); }
          poly(c, pts.concat(lo.reverse()), stressCol(s.ratio), C.text, 1);
          c.restore();
          if (fall > 0) { poly(c, [[wx, root - 2], [wx + 7, root + th * 0.3], [wx + 2, root + th * 0.55], [wx + 8, root + th + 2]], null, C.bad, 2); kit.label(c, 'snap!', wx + 20, root - 16, { color: C.bad, weight: 700, size: 14 }); }
          // the scale bar
          const bar = nice(s.L / 3), bpx = bar / mpp, by = H - 34;
          line(c, wx, by, wx + bpx, by, C.text, 2); line(c, wx, by - 5, wx, by + 5, C.text, 2); line(c, wx + bpx, by - 5, wx + bpx, by + 5, C.text, 2);
          kit.label(c, lenText(bar), wx + bpx / 2, by + 13, { align: 'center', size: 11.5 });
          kit.label(c, 'beam ' + lenText(s.L) + ' — ' + s.M.name, wx, 14, { size: 12, weight: 600 });
          // a figure for scale, standing at the foot of the wall
          let best = null; for (const r of REFS) { const hp = r[1] / mpp; if (hp >= 6 && hp <= 150 && (!best || Math.abs(hp - 70) < Math.abs(best[1] / mpp - 70))) best = r; }
          if (best) {
            const hp = best[1] / mpp, fx = wx + PL * 0.72, fy = by - 12;
            if (best[0] === 'person') {
              circle(c, fx, fy - hp * 0.9, hp * 0.1, null, C.text, 1.5);
              line(c, fx, fy - hp * 0.8, fx, fy - hp * 0.4, C.text, 1.5); line(c, fx, fy - hp * 0.4, fx - hp * 0.12, fy, C.text, 1.5); line(c, fx, fy - hp * 0.4, fx + hp * 0.12, fy, C.text, 1.5);
              line(c, fx - hp * 0.15, fy - hp * 0.65, fx + hp * 0.15, fy - hp * 0.65, C.text, 1.5);
            } else { c.fillStyle = C.faint; c.fillRect(fx - Math.max(3, hp * 0.25), fy - hp, Math.max(6, hp * 0.5), hp); }
            kit.label(c, best[0] + ' (' + lenText(best[1]) + ')', fx, fy - hp - 10, { align: 'center', size: 11, color: C.muted });
          } else kit.label(c, 'a person would be ' + (1.75 / mpp < 6 ? 'a dot' : 'taller than the picture'), wx + PL * 0.72, by - 20, { align: 'center', size: 11, color: C.muted });
          gauge(c, C, W - 70, 30, H - 90, s.ratio);
        } else {
          // the animal, always drawn the same size
          const cx = W * 0.42, gy = H - 40, bodyW = Math.min(W * 0.46, 330), bodyH = bodyW * 0.3, legL = bodyW * 0.42;
          const rel = V.thick ? Math.sqrt(s.sc) : 1, legW = clamp(bodyW * 0.022 * 1.7 * rel, 3, bodyW * 0.2);
          const down = fall * legL * 0.75, by = gy - legL - bodyH / 2 + down + Math.sin(t * 7) * (fall > 0 ? 0 : 1.5);
          line(c, 20, gy, W - 90, gy, C.muted, 2);
          const legsX = [cx - bodyW * 0.36, cx - bodyW * 0.22, cx + bodyW * 0.22, cx + bodyW * 0.36];
          legsX.forEach((lx, j) => {
            const sw = fall > 0 ? 0 : Math.sin(t * 7 + j * Math.PI / 2) * 0.25, ang = fall > 0 ? (j % 2 ? 1 : -1) * 1.1 * fall : sw;
            const kx = lx + Math.sin(ang) * legL * 0.5, ky = by + bodyH * 0.3 + Math.cos(ang) * legL * 0.5;
            const fx = fall > 0 ? kx + (j % 2 ? -1 : 1) * legL * 0.3 * fall : lx + Math.sin(sw) * legL, fy = fall > 0 ? gy : gy;
            line(c, lx, by + bodyH * 0.3, kx, ky, stressCol(s.ratio), legW); line(c, kx, ky, fx, fy, stressCol(s.ratio), legW);
          });
          c.fillStyle = C.series[4]; c.beginPath(); c.ellipse(cx, by, bodyW / 2, Math.max(1, bodyH / 2), 0, 0, TAU); c.fill();
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
          circle(c, cx + bodyW * 0.56, by - bodyH * 0.45, bodyH * 0.38, C.series[4], C.text, 1.2);
          circle(c, cx + bodyW * 0.63, by - bodyH * 0.52, 2.2, C.text);
          line(c, cx - bodyW * 0.5, by - bodyH * 0.1, cx - bodyW * 0.66, by - bodyH * 0.55, C.series[4], 4);
          if (fall > 0) kit.label(c, 'crack! the legs break', cx, by - bodyH - 20, { align: 'center', color: C.bad, weight: 700, size: 14 });
          kit.label(c, 'scale ×' + f2(s.sc, 2) + ':  length ' + lenText(s.len) + ',  mass ×' + f2(Math.pow(s.sc, 3), s.sc < 1 ? 3 : 0) + ',  bone area ×' + f2(Math.pow(V.thick ? Math.pow(s.sc, 1.5) : s.sc, 2), s.sc < 1 ? 3 : 0), 16, 14, { size: 12, weight: 600 });
          // a person for scale
          const mpp = s.len / bodyW, hp = 1.75 / mpp, fx = W - 120;
          if (hp >= 8 && hp <= H - 70) {
            circle(c, fx, gy - hp * 0.9, hp * 0.1, null, C.muted, 1.5);
            line(c, fx, gy - hp * 0.8, fx, gy - hp * 0.4, C.muted, 1.5); line(c, fx, gy - hp * 0.4, fx - hp * 0.12, gy, C.muted, 1.5); line(c, fx, gy - hp * 0.4, fx + hp * 0.12, gy, C.muted, 1.5);
            kit.label(c, 'person', fx, gy - hp - 10, { align: 'center', size: 11, color: C.muted });
          } else kit.label(c, hp < 8 ? 'a person: a dot' : 'a person: taller than the picture', fx - 10, gy - 16, { align: 'center', size: 10.5, color: C.muted });
          gauge(c, C, W - 50, 30, H - 90, s.ratio);
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ local conservation of charge */
  Hyper.sim('sym-local-charge', {
    title: 'Why charge cannot jump from the Earth to the Moon',
    blurb: `A space-time diagram, drawn by an observer flying along the Earth–Moon line: across is distance (in light-seconds), up is time, and light travels at 45°. The thick line is the history of one electric charge. In the first case it vanishes on the Earth and, **at the same moment for us on the ground**, reappears on the Moon — the total never changes, for us. The horizontal line sweeps up through the observer's time and counts the charges that exist at each of their moments.

**Try this**
- Set the observer's speed to 0: the two events are simultaneous and the count is always 1.
- Now let the observer move. The line through the two events — "the same moment" for the ground — tilts. For the observer the Moon's charge appears before the Earth's vanishes (count 2), or after (count 0). A law that keeps the total only for some observers is not a law of physics.
- Switch to *Carry it*: the charge travels from the Earth to the Moon slower than light. Its history is one unbroken line, and every observer counts exactly one charge at every moment. That is local conservation — the charge goes through the space between, as a current.
- Compare the gap with the formula $\\Delta t' = -\\gamma vD/c^2$ (the [[?lorentz-factor]] γ).`,
    mount(box, kit) {
      const Q = kit.qm, st = kit.stage(box.stage, { aspect: 0.62, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'The charge', options: [['vanishes on the Earth, appears on the Moon at once', 'jump'], ['is carried from the Earth to the Moon', 'travel']], value: 'jump' },
        { id: 'beta', label: 'Observer\'s speed towards the Moon (fraction of c)', min: -0.9, max: 0.9, step: 0.01, value: 0.5 },
        { id: 'D', label: 'Earth–Moon distance (light-seconds)', min: 0.5, max: 3, step: 0.01, value: 1.28 },
        { id: 'v', label: 'Speed of the carried charge (fraction of c)', min: 0.1, max: 0.95, step: 0.01, value: 0.6 },
        { type: 'buttons', items: [{ id: 'again', label: 'Sweep again', primary: true }] }
      ], id => { if (id === 'again') ph = 0; ctl.show('v', V.mode === 'travel'); });
      const V = ctl.values;
      ctl.show('v', false);
      const ro = kit.readout(box.side, [['g', 'γ'], ['dt', 'Appears − vanishes, observer\'s time'], ['now', 'Observer\'s time now'], ['n', 'Charges that exist now']]);
      let ph = 0;
      const loop = kit.loop(dt => {
        ph = (ph + dt / 7) % 1;
        const b = V.beta, D = V.D, L = Q.lorentz(b), g = L.gamma, tr = V.mode === 'travel';
        const tf = p => [L.x(p[0], p[1]), L.t(p[0], p[1])];            // ground (x, t) -> observer (x', t')
        const A = tf([0, 0]), B = tf([D, 0]), Arr = tf([D, D / V.v]);
        const xs = [A[0], B[0], tr ? Arr[0] : B[0]], ts = [A[1], B[1], tr ? Arr[1] : B[1]];
        const xmin = Math.min(...xs) - 1.4, xmax = Math.max(...xs) + 1.4, tmin = Math.min(...ts) - 1.4, tmax = Math.max(...ts) + 1.4;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, m = 44;
        const sc = Math.min((W - 2 * m - 150) / (xmax - xmin), (H - 2 * m) / (tmax - tmin));
        const ox = m + ((W - 2 * m - 150) - sc * (xmax - xmin)) / 2, oy = m + ((H - 2 * m) - sc * (tmax - tmin)) / 2;
        const X = x => ox + (x - xmin) * sc, Y = t => oy + (tmax - t) * sc;
        // axes and light lines
        line(c, X(xmin), Y(0), X(xmax), Y(0), C.axis || C.muted, 1);
        line(c, X(0), Y(tmin), X(0), Y(tmax), C.axis || C.muted, 1);
        kit.label(c, "x′ (light-seconds)", X(xmax), Y(0) + 14, { align: 'right', size: 11, color: C.muted });
        kit.label(c, "t′ (s)", X(0) + 6, Y(tmax) + 8, { size: 11, color: C.muted });
        const span = Math.max(xmax - xmin, tmax - tmin);
        line(c, X(A[0] - span), Y(A[1] - span), X(A[0] + span), Y(A[1] + span), 'hsl(48 90% 55% / .45)', 1, [4, 4]);
        line(c, X(A[0] - span), Y(A[1] + span), X(A[0] + span), Y(A[1] - span), 'hsl(48 90% 55% / .45)', 1, [4, 4]);
        // the Earth's and the Moon's histories (they move for this observer)
        const hist = (x0, col, name) => {
          const p1 = tf([x0, -20]), p2 = tf([x0, 20]);
          line(c, X(p1[0]), Y(p1[1]), X(p2[0]), Y(p2[1]), col, 1.2, [6, 5]);
          const xTop = x0 / g - b * (tmax - 0.5);                     // where it leaves the top of the diagram
          kit.label(c, name, X(xTop) + 6, Y(tmax - 0.5), { size: 11.5, color: C.muted });
        };
        hist(0, C.muted, 'Earth'); hist(D, C.muted, 'Moon');
        // "the same moment" for the ground
        const s1 = tf([-10, 0]), s2 = tf([10 + D, 0]);
        line(c, X(s1[0]), Y(s1[1]), X(s2[0]), Y(s2[1]), C.faint, 1, [2, 4]);
        kit.label(c, '"the same moment" on the ground', X(B[0]) + 8, Y(B[1]) - 12, { size: 10.5, color: C.faint });
        // the charge's history
        c.save(); c.beginPath(); c.rect(X(xmin), Y(tmax), (xmax - xmin) * sc, (tmax - tmin) * sc); c.clip();
        const e1 = tf([0, -20]), m2 = tf([D, 20]);
        line(c, X(e1[0]), Y(e1[1]), X(A[0]), Y(A[1]), C.accent, 4);
        if (tr) { line(c, X(A[0]), Y(A[1]), X(Arr[0]), Y(Arr[1]), C.accent, 4); line(c, X(Arr[0]), Y(Arr[1]), X(m2[0]), Y(m2[1]), C.accent, 4); }
        else line(c, X(B[0]), Y(B[1]), X(m2[0]), Y(m2[1]), C.accent, 4);
        c.restore();
        circle(c, X(A[0]), Y(A[1]), 6, C.warn, C.text, 1);
        kit.label(c, tr ? 'leaves the Earth' : 'vanishes', X(A[0]) - 8, Y(A[1]) + 14, { align: 'right', size: 11 });
        if (!tr) { circle(c, X(B[0]), Y(B[1]), 6, C.warn, C.text, 1); kit.label(c, 'appears', X(B[0]) + 9, Y(B[1]) + 14, { size: 11 }); }
        else { circle(c, X(Arr[0]), Y(Arr[1]), 6, C.warn, C.text, 1); kit.label(c, 'arrives on the Moon', X(Arr[0]) + 9, Y(Arr[1]), { size: 11 }); }
        // the sweeping "now" of the observer, and the count
        const now = tmin + 0.3 + (tmax - tmin - 0.6) * ph;
        let n;
        if (tr) n = 1;
        else n = (now < 0 ? 1 : 0) + (now > -g * b * D ? 1 : 0);
        const okc = n === 1 ? C.ok : C.bad;
        line(c, X(xmin), Y(now), X(xmax), Y(now), okc, 2);
        kit.label(c, 'now: ' + n + (n === 1 ? ' charge' : ' charges'), X(xmax) + 8, Y(now), { color: okc, weight: 700 });
        // where the charge is now
        const hits = [];
        if (!tr) { if (now < 0) hits.push(tf([0, now / g])); if (now > -g * b * D) hits.push(tf([D, now / g + b * D])); }
        else if (now < 0) hits.push(tf([0, now / g]));              // still on the Earth
        else {
          const tm = now / (g * (1 - b * V.v));                      // ground time on the way, from t' = γ t (1 − βv)
          hits.push(tm <= D / V.v ? tf([V.v * tm, tm]) : tf([D, now / g + b * D]));
        }
        for (const h of hits) circle(c, X(h[0]), Y(h[1]), 5, C.accent, C.text, 1);
        ro.set('g', f2(g, 3));
        ro.set('dt', tr ? 'one unbroken history' : f2(-g * b * D, 2) + ' s');
        ro.set('now', f2(now, 2) + ' s');
        ro.set('n', n + (n === 1 ? ' — as it should be' : ' — the total is wrong!'));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the reaction checker */
  // mass (MeV/c²), charge, baryon number, electron number, muon number, strangeness, twice the spin
  const PART = {
    n: ['n', 939.565, 0, 1, 0, 0, 0, 1], p: ['p', 938.272, 1, 1, 0, 0, 0, 1], pbar: ['p̄', 938.272, -1, -1, 0, 0, 0, 1],
    em: ['e⁻', 0.511, -1, 0, 1, 0, 0, 1], ep: ['e⁺', 0.511, 1, 0, -1, 0, 0, 1], nue: ['νₑ', 0, 0, 0, 1, 0, 0, 1], nueb: ['ν̄ₑ', 0, 0, 0, -1, 0, 0, 1],
    mum: ['μ⁻', 105.658, -1, 0, 0, 1, 0, 1], mup: ['μ⁺', 105.658, 1, 0, 0, -1, 0, 1], numu: ['νμ', 0, 0, 0, 0, 1, 0, 1], numub: ['ν̄μ', 0, 0, 0, 0, -1, 0, 1],
    pip: ['π⁺', 139.570, 1, 0, 0, 0, 0, 0], pim: ['π⁻', 139.570, -1, 0, 0, 0, 0, 0], pi0: ['π⁰', 134.977, 0, 0, 0, 0, 0, 0],
    g: ['γ', 0, 0, 0, 0, 0, 0, 2], lam: ['Λ⁰', 1115.683, 0, 1, 0, 0, -1, 1], kp: ['K⁺', 493.677, 1, 0, 0, 0, 1, 0], nuc: ['Pb nucleus', 193700, 82, 208, 0, 0, 0, 0]
  };
  const REACTIONS = [
    ['n → p + e⁻ + ν̄ₑ', ['n'], ['p', 'em', 'nueb'], true, 'Beta decay of a free neutron (mean life about 15 minutes). The electron gets a share of 0.78 MeV — any share.'],
    ['n → p + e⁻ (no neutrino)', ['n'], ['p', 'em'], false, 'What beta decay looked like before 1930. It breaks lepton number and angular momentum — and would give every electron the same energy.'],
    ['n → p + e⁻ + νₑ', ['n'], ['p', 'em', 'nue'], false, 'The wrong kind of neutrino: electron number would go from 0 to 2.'],
    ['p → e⁺ + π⁰', ['p'], ['ep', 'pi0'], false, 'Baryon number 1 → 0. Huge water tanks watch for it: the proton lives more than 10³⁴ years.'],
    ['π⁺ → μ⁺ + νμ', ['pip'], ['mup', 'numu'], true, 'The usual decay of a charged pion, in 26 ns.'],
    ['π⁺ → μ⁺ + ν̄μ', ['pip'], ['mup', 'numub'], false, 'Muon number would go from 0 to −2.'],
    ['μ⁻ → e⁻ + ν̄ₑ + νμ', ['mum'], ['em', 'nueb', 'numu'], true, 'Muon decay, 2.2 µs: electron and muon numbers both kept.'],
    ['μ⁻ → e⁻ + γ', ['mum'], ['em', 'g'], false, 'Total lepton number is kept, but not the electron and muon numbers separately. Searched for to about one decay in 10¹³ — never seen.'],
    ['Λ⁰ → p + π⁻', ['lam'], ['p', 'pim'], true, 'Strangeness changes from −1 to 0: only the weak force can do that, which is why the Λ⁰ lives as long as 2.6 × 10⁻¹⁰ s.'],
    ['K⁺ → π⁺ + π⁰', ['kp'], ['pip', 'pi0'], true, 'Another weak decay that changes strangeness (12 ns).'],
    ['π⁰ → γ + γ', ['pi0'], ['g', 'g'], true, 'An electromagnetic decay, in 8.5 × 10⁻¹⁷ s.'],
    ['γ → e⁻ + e⁺ (in empty space)', ['g'], ['em', 'ep'], false, 'A lone photon cannot make a pair: in no frame can energy and momentum both balance.'],
    ['γ + nucleus → e⁻ + e⁺ + nucleus', ['g', 'nuc'], ['em', 'ep', 'nuc'], true, 'Pair creation near a nucleus, which takes up the recoil. The photon needs more than 1.022 MeV.'],
    ['e⁻ + e⁺ → γ + γ', ['em', 'ep'], ['g', 'g'], true, 'Annihilation: two 511 keV photons back to back, as in a PET scanner.'],
    ['e⁻ + e⁺ → γ', ['em', 'ep'], ['g'], false, 'One photon cannot carry away 1.022 MeV with zero momentum.']
  ];

  Hyper.sim('sym-reaction-checker', {
    title: 'The conservation laws as a checklist',
    blurb: `Pick a reaction. The particles go in, the products fly out, and the table adds up each conserved number before and after: charge, baryon number, electron and muon numbers, strangeness, spin (the count of half-integer spins must stay even or odd), and energy. A reaction that breaks any of them never happens — you can say so without knowing anything about the forces.

**Try this**
- *n → p + e⁻ (no neutrino)*: charge and baryon number balance, but lepton number and spin do not. The graph shows why physicists noticed: two products would give every electron the same energy (the line), but the measured spectrum is spread out — the neutrino takes the rest.
- *p → e⁺ + π⁰*: charge, spin and energy balance, with 800 MeV to spare — but baryon number (and lepton number) do not. That is why the atoms you are made of last.
- *μ⁻ → e⁻ + γ*: total lepton number balances, but the electron and muon numbers do not.
- *Λ⁰ → p + π⁻*: strangeness changes, and yet it happens — slowly, through the weak force. Strangeness is conserved by some forces only.
- *γ → e⁻ + e⁺* and *e⁻ + e⁺ → γ*: every count balances, yet energy and momentum cannot both be kept. Add a nucleus, or a second photon, and they can.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'r', type: 'select', label: 'Reaction', options: REACTIONS.map((r, i) => [(r[3] ? '' : '✗ ') + r[0], i]), value: 0 },
        { type: 'buttons', items: [{ id: 'again', label: 'Run it again', primary: true }] }
      ], id => { t = 0; if (id === 'r') check(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['q', 'Energy to share'], ['v', 'Verdict'], ['w', 'In nature']]);
      const plot = kit.plot(gb, { x: { label: 'kinetic energy of the electron (MeV)', min: 0, max: 0.9 }, y: { label: 'number of electrons (relative)', min: 0 }, legend: true }, 150);
      let t = 0, res = null, dirs = [];
      const sum = (list, k) => list.reduce((s, id) => s + PART[id][k], 0);
      function check() {
        const r = REACTIONS[V.r] || REACTIONS[0], ini = r[1], fin = r[2];
        const rows = [['Charge', 2], ['Baryon number', 3], ['Electron number', 4], ['Muon number', 5], ['Strangeness', 6]].map(([name, k]) => {
          const a = sum(ini, k), b = sum(fin, k);
          return { name, a: String(a), b: String(b), ok: a === b, soft: k === 6 };
        });
        const ja = sum(ini, 7) % 2, jb = sum(fin, 7) % 2;
        rows.push({ name: 'Half-integer spins', a: ja ? 'odd' : 'even', b: jb ? 'odd' : 'even', ok: ja === jb });
        const ma = sum(ini, 1), mb = sum(fin, 1);
        let eok = true, etext;
        if (ini.length === 1) {
          if (ma === 0) { eok = false; etext = 'a lone photon has no rest frame'; }
          else if (mb > ma) { eok = false; etext = f2(mb - ma, 1) + ' MeV short'; }
          else etext = f2(ma - mb, ma - mb < 1 ? 3 : 1) + ' MeV to share';
        } else if (fin.length === 1 && PART[fin[0]][1] === 0) { eok = false; etext = 'one photon cannot balance both'; }
        else { const need = mb - ma; etext = need > 0 ? 'needs ' + f2(need, 3) + ' MeV from the collision' : f2(-need, 3) + ' MeV to share (plus the collision energy)'; }
        rows.push({ name: 'Energy and momentum', a: f2(ma, ma < 10 ? 3 : 1) + ' MeV', b: f2(mb, mb < 10 ? 3 : 1) + ' MeV', ok: eok, note: etext });
        const allowed = rows.every(x => x.ok || x.soft);
        res = { r, rows, allowed, strange: rows[4].ok === false };
        ro.set('q', etext);
        ro.set('v', allowed ? (res.strange ? 'allowed — but only through the weak force' : 'allowed by every conservation law') : 'forbidden: ' + rows.filter(x => !x.ok && !x.soft).map(x => x.name.toLowerCase()).join(', '));
        ro.set('w', r[3] ? 'observed' : 'never observed');
        // directions of the products: momentum balanced in the picture
        const n = fin.length, a0 = 0.6;
        dirs = fin.map((_, i) => a0 + TAU * i / n + (n === 2 ? 0 : 0.25 * Math.sin(i * 2.1)));
        // the beta spectrum for the neutron reactions
        const beta = V.r === 0 || V.r === 1 || V.r === 2;
        gb.style.display = beta ? '' : 'none';
        if (beta) {
          const Qv = 0.782, me = 0.511, pts = [];
          let top = 0; for (let i = 0; i <= 120; i++) { const T = Qv * i / 120, E = T + me, pe = Math.sqrt(E * E - me * me), y = pe * E * (Qv - T) * (Qv - T); pts.push([T, y]); top = Math.max(top, y); }
          plot.set({ series: [{ pts: pts.map(p => [p[0], p[1] / top]), label: 'measured: three products share 0.78 MeV', fill: true }], vlines: [{ x: 0.781, label: 'two products: one energy only' }] });
        }
      }
      check();
      const loop = kit.loop(dt => {
        t += dt; if (t > 4) t = 0;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, r = res.r, cx = W / 2, cy = 95;
        const disc = (x, y, id, alpha, dash) => {
          const p = PART[id], rad = id === 'nuc' ? 22 : p[1] > 900 ? 17 : p[1] > 100 ? 13 : p[1] > 0 ? 9 : 7;
          const col = p[2] > 0 ? C.bad : p[2] < 0 ? C.accent : C.muted;
          c.globalAlpha = alpha; if (dash) c.setLineDash([3, 3]);
          circle(c, x, y, rad, id === 'g' ? 'hsl(48 90% 55% / .35)' : C.bg2, col, 2); c.setLineDash([]);
          kit.label(c, p[0], x, y + 0.5, { align: 'center', size: 11.5, weight: 700 }); c.globalAlpha = 1;
        };
        // before: one particle at rest, or two coming together
        const burst = 1.2, k = Math.min(1, t / burst);
        if (t < burst) {
          if (r[1].length === 1) disc(cx, cy, r[1][0], 1);
          else { disc(cx - 150 * (1 - k) - 18, cy, r[1][0], 1); disc(cx + 150 * (1 - k) + 18, cy, r[1][1], 1); }
        } else {
          const f = Math.min(1, (t - burst) / 1.8), bad = !res.allowed;
          r[2].forEach((id, i) => { const m = PART[id][1], sp = 60 + 110 / (1 + m / 150); disc(cx + Math.cos(dirs[i]) * sp * f * 1.3, cy + Math.sin(dirs[i]) * sp * f * 0.55, id, bad ? 0.45 : 1, bad); });
          if (t - burst < 0.25) circle(c, cx, cy, 30 * (t - burst) / 0.25 + 4, 'hsl(48 100% 60% / .5)');
          if (bad) kit.label(c, '✗ never happens', cx, cy + 72, { align: 'center', color: C.bad, weight: 700, size: 14 });
          else kit.label(c, '✓ happens', cx, cy + 72, { align: 'center', color: C.ok, weight: 700, size: 14 });
        }
        kit.label(c, r[0], 14, 16, { weight: 700, size: 13 });
        // the ledger
        const top = 190, rh = Math.min(24, (H - top - 30) / 8), c0 = 20, c1 = W * 0.42, c2 = W * 0.58, c3 = W * 0.72;
        kit.label(c, 'conserved quantity', c0, top, { size: 11, color: C.muted }); kit.label(c, 'before', c1, top, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'after', c2, top, { size: 11, color: C.muted, align: 'center' });
        line(c, c0, top + 10, W - 20, top + 10, C.grid, 1);
        res.rows.forEach((row, i) => {
          const y = top + 24 + i * rh, col = row.ok ? C.ok : row.soft ? C.warn : C.bad;
          kit.label(c, row.name, c0, y, { size: 12 });
          kit.label(c, row.a, c1, y, { size: 12, align: 'center' }); kit.label(c, row.b, c2, y, { size: 12, align: 'center' });
          kit.label(c, row.ok ? '✓ ' + (row.note || 'kept') : row.soft ? '~ changes: weak force only' : '✗ ' + (row.note || 'broken'), c3, y, { size: 12, color: col, weight: 600 });
        });
        kit.label(c, r[4], c0, H - 14, { size: 11.5, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ Noether in a bowl */
  Hyper.sim('sym-noether-orbit', {
    title: 'A ball in a bowl: what each symmetry keeps',
    blurb: `A ball rolls without friction in a bowl, seen from above; the rings are lines of equal height. Every 0.6 time units the line from the centre to the ball sweeps out a coloured wedge. The graph below follows the ball's angular momentum $L$ and energy $E$. (Natural units: mass 1, and a spring constant — or the Sun's pull — of 1.)

**Try this**
- Round bowl: the wedges all have the same area (Kepler's second law) and $L$ is a flat line. The bowl looks the same after any turn, so angular momentum is kept.
- *Squash the bowl*: it is no longer the same when turned. The force gets a sideways part, $L$ wobbles and drifts, and the wedges become unequal. Energy is still a flat line — the bowl does not change with time.
- Set the squash back to 0 and *pulse the bowl*: now the laws change with time and $E$ climbs and falls — but $L$ stays flat, because a round bowl that pulses is still round.
- Do both: nothing is conserved any more.
- Switch to the Sun's gravity: the same story with ellipses instead of rosettes.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'pot', type: 'select', label: 'The bowl', options: [['A spring bowl (height ∝ r²)', 'spring'], ['The Sun\'s gravity (∝ −1/r)', 'kepler']], value: 'spring' },
        { id: 'eps', label: 'Squash the bowl (breaks the turning symmetry)', min: 0, max: 0.6, step: 0.01, value: 0 },
        { id: 'pump', label: 'Pulse the bowl in time (breaks the time symmetry)', min: 0, max: 0.4, step: 0.01, value: 0 },
        { id: 'vf', label: 'Launch speed (× the speed of a circle)', min: 0.6, max: 1.25, step: 0.01, value: 0.8 },
        { type: 'buttons', items: [{ id: 'go', label: 'Launch again', primary: true }] }
      ], id => { if (id === 'go' || id === 'pot' || id === 'vf') launch(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['L', 'Angular momentum L'], ['dL', 'Change of L since launch'], ['E', 'Energy E'], ['A', 'Areas of the last wedges'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'time (natural units)' }, y: { label: 'L and E' }, legend: true }, 150);
      const DT = 0.0025, TW = 0.6, OM = 2, SOFT = 0.002;
      let s, hist, trail, wedges, cur, msg = '';
      const f = t => 1 + V.pump * Math.sin(OM * t);
      function force(x, y, t) {
        const e = V.eps, k = f(t);
        if (V.pot === 'spring') return [-k * x, -k * (1 + e) * y];
        const r2 = x * x + (1 + e) * y * y + SOFT, r3 = r2 * Math.sqrt(r2);
        return [-k * x / r3, -k * (1 + e) * y / r3];
      }
      function energy() {
        const e = V.eps, k = f(s.t), v2 = s.vx * s.vx + s.vy * s.vy;
        return 0.5 * v2 + (V.pot === 'spring' ? 0.5 * k * (s.x * s.x + (1 + e) * s.y * s.y) : -k / Math.sqrt(s.x * s.x + (1 + e) * s.y * s.y + SOFT));
      }
      function launch() {
        s = { x: 1, y: 0, vx: 0, vy: V.vf, t: 0 };
        s.L0 = s.x * s.vy - s.y * s.vx;
        hist = []; trail = []; wedges = []; cur = { pts: [[s.x, s.y]], area: 0, t0: 0 };
      }
      launch();
      function step() {
        const a = force(s.x, s.y, s.t);
        s.vx += 0.5 * DT * a[0]; s.vy += 0.5 * DT * a[1];
        s.x += DT * s.vx; s.y += DT * s.vy; s.t += DT;
        const b = force(s.x, s.y, s.t);
        s.vx += 0.5 * DT * b[0]; s.vy += 0.5 * DT * b[1];
        cur.area += 0.5 * (s.x * s.vy - s.y * s.vx) * DT;
      }
      let acc = 0, sub = 0;
      const loop = kit.loop(dt => {
        acc += dt * 1.2;
        let n = 0;
        while (acc >= DT && n < 2000) {
          step(); acc -= DT; n++; sub++;
          if (sub % 4 === 0) { cur.pts.push([s.x, s.y]); trail.push([s.x, s.y]); if (trail.length > 700) trail.shift(); }
          if (s.t - cur.t0 >= TW) { cur.pts.push([s.x, s.y]); wedges.push(cur); if (wedges.length > 10) wedges.shift(); cur = { pts: [[s.x, s.y]], area: 0, t0: s.t }; }
          if (sub % 20 === 0) { hist.push([s.t, s.x * s.vy - s.y * s.vx, energy()]); if (hist.length > 900) hist.shift(); }
        }
        if (!(Math.hypot(s.x, s.y) < 6) || !Number.isFinite(s.vx + s.vy)) { launch(); msg = 'It flew out of the bowl — launched again.'; }
        const L = s.x * s.vy - s.y * s.vx, E = energy();
        ro.set('L', f2(L, 3)); ro.set('dL', f2(100 * (L - s.L0) / Math.abs(s.L0 || 1), 1) + ' %'); ro.set('E', f2(E, 3));
        ro.set('A', wedges.slice(-3).map(w => f2(w.area, 3)).join(', ') || '…');
        ro.set('msg', msg || (V.eps === 0 ? 'round: turning changes nothing' : 'squashed: turning shows'));
        if (sub % 30 < n || n === 0) plot.set({ series: [{ pts: hist.map(h => [h[0], h[1]]), label: 'angular momentum L' }, { pts: hist.map(h => [h[0], h[2]]), label: 'energy E' }] });
        // drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, cx = W / 2, cy = H / 2, sc = Math.min(W, H) / 2 / 1.9;
        const P = p => [cx + p[0] * sc, cy - p[1] * sc];
        const k = f(s.t);
        for (const lev of [0.4, 0.8, 1.2, 1.6, 2.0]) {
          c.strokeStyle = C.hue(200, 0.25 + 0.4 * clamp((k - 1) / 0.8 + 0.5, 0, 1)); c.lineWidth = 1.2;
          c.beginPath(); c.ellipse(cx, cy, lev * sc, lev * sc / Math.sqrt(1 + V.eps), 0, 0, TAU); c.stroke();
        }
        wedges.concat([cur]).forEach((w, i) => {
          const pts = [[cx, cy]].concat(w.pts.map(P));
          poly(c, pts, i % 2 ? C.hue(330, 0.18) : C.hue(160, 0.18), null);
        });
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath();
        trail.forEach((p, i) => { const q = P(p); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }); c.stroke();
        if (V.pot === 'kepler') circle(c, cx, cy, 9, 'hsl(45 95% 55%)', C.text, 1); else circle(c, cx, cy, 3, C.text);
        const b = P([s.x, s.y]);
        line(c, cx, cy, b[0], b[1], C.faint, 1, [3, 3]);
        kit.arrow(c, b[0], b[1], b[0] + s.vx * sc * 0.35, b[1] - s.vy * sc * 0.35, C.accent, 2);
        circle(c, b[0], b[1], 7, C.accent, C.text, 1);
        kit.label(c, V.eps === 0 ? 'round bowl' : 'squashed bowl', 12, 16, { weight: 700 });
        if (V.pump > 0) kit.label(c, 'pulsing: depth × ' + f2(k), 12, 34, { size: 11, color: C.warn });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ Noether in a tray of discs */
  Hyper.sim('sym-noether-box', {
    title: 'Discs in a tray: which quantities are kept',
    blurb: `A dozen discs slide without friction and collide with each other and with the walls. The big arrow from the centre is their total momentum $\\vec p$; the curved arrow is their total angular momentum $L$ about the centre; the graph follows $|\\vec p|$, $L$ and the energy. Collisions between discs push equally and oppositely along the line of centres, so by themselves they change none of the totals. What changes them is the shape of the tray.

**Try this**
- *Round tray*: a wall pushes straight towards the centre, so it exerts no torque about it — $L$ is a flat line. But the push changes the momentum: $|\\vec p|$ jumps at every bounce.
- *Square tray*: its walls do not point at the centre, and it only looks the same after quarter turns. Neither $\\vec p$ nor $L$ is kept.
- *No walls*: a disc that leaves on the right comes back on the left, so every place is like every other. $\\vec p$ is a flat line; $L$ about the centre jumps whenever a disc wraps round.
- Energy is flat in all three: nothing in the tray changes with time. Tick *Sticky collisions*: kinetic energy drains into heat, yet their sum stays flat.`,
    mount(box, kit) {
      const Q = kit.qm, st = kit.stage(box.stage, { aspect: 0.62, minH: 280 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'tray', type: 'select', label: 'The tray', options: [['Round', 'round'], ['Square', 'square'], ['No walls (leave on the right, return on the left)', 'open']], value: 'round' },
        { id: 'n', label: 'Number of discs', min: 3, max: 20, step: 1, value: 12 },
        { id: 'sticky', type: 'check', label: 'Sticky collisions (kinetic energy → heat)', value: false },
        { type: 'buttons', items: [{ id: 'shake', label: 'Shake (a new start)', primary: true }] }
      ], id => { if (id === 'shake' || id === 'tray' || id === 'n') { seed++; start(); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Total momentum |p|'], ['L', 'Angular momentum L'], ['K', 'Kinetic energy'], ['Qh', 'Heat'], ['E', 'Kinetic energy + heat']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'kg·m/s, kg·m²/s, J' }, legend: true }, 150);
      const DT = 0.002;
      let D = [], heat = 0, t = 0, hist = [], seed = 7, acc = 0;
      function start() {
        const R = Q.rng(seed), n = Math.round(V.n), lim = 0.86;
        D = []; heat = 0; t = 0; hist = [];
        for (let i = 0, tries = 0; i < n && tries < 5000; tries++) {
          const r = 0.05 + 0.04 * R(), x = (2 * R() - 1) * lim, y = (2 * R() - 1) * lim;
          if (V.tray === 'round' && Math.hypot(x, y) > lim - r) continue;
          if (D.some(d => Math.hypot(d.x - x, d.y - y) < d.r + r + 0.02)) continue;
          const m = (r / 0.07) * (r / 0.07);
          D.push({ x, y, r, m, vx: 0.35 + 0.25 * Q.gauss(R) - 0.5 * y, vy: 0.1 + 0.25 * Q.gauss(R) + 0.5 * x });
          i++;
        }
      }
      start();
      const totals = () => {
        let px = 0, py = 0, L = 0, K = 0;
        for (const d of D) { px += d.m * d.vx; py += d.m * d.vy; L += d.m * (d.x * d.vy - d.y * d.vx); K += 0.5 * d.m * (d.vx * d.vx + d.vy * d.vy); }
        return { px, py, L, K };
      };
      function step() {
        const e = V.sticky ? 0.6 : 1, open = V.tray === 'open';
        for (const d of D) { d.x += d.vx * DT; d.y += d.vy * DT; }
        for (let i = 0; i < D.length; i++) for (let j = i + 1; j < D.length; j++) {
          const a = D[i], b = D[j];
          let dx = b.x - a.x, dy = b.y - a.y;
          if (open) { dx -= 2 * Math.round(dx / 2); dy -= 2 * Math.round(dy / 2); }
          const dist = Math.hypot(dx, dy);
          if (dist >= a.r + b.r || dist < 1e-9) continue;
          const nx = dx / dist, ny = dy / dist, u = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
          if (u <= 0) continue;
          const mu = a.m * b.m / (a.m + b.m), J = (1 + e) * mu * u;
          a.vx -= J / a.m * nx; a.vy -= J / a.m * ny; b.vx += J / b.m * nx; b.vy += J / b.m * ny;
          heat += 0.5 * mu * u * u * (1 - e * e);
        }
        for (const d of D) {
          if (V.tray === 'round') {
            const r = Math.hypot(d.x, d.y);
            if (r > 1 - d.r && r > 0) { const nx = d.x / r, ny = d.y / r, vn = d.vx * nx + d.vy * ny; if (vn > 0) { d.vx -= 2 * vn * nx; d.vy -= 2 * vn * ny; } }
          } else if (V.tray === 'square') {
            if (d.x > 1 - d.r && d.vx > 0) d.vx = -d.vx; if (d.x < -1 + d.r && d.vx < 0) d.vx = -d.vx;
            if (d.y > 1 - d.r && d.vy > 0) d.vy = -d.vy; if (d.y < -1 + d.r && d.vy < 0) d.vy = -d.vy;
          } else {
            if (d.x > 1) d.x -= 2; if (d.x < -1) d.x += 2; if (d.y > 1) d.y -= 2; if (d.y < -1) d.y += 2;
          }
        }
        t += DT;
      }
      let frame = 0;
      const loop = kit.loop(dt => {
        acc += dt; let n = 0;
        while (acc >= DT && n < 100) { step(); acc -= DT; n++; }
        const T = totals(), p = Math.hypot(T.px, T.py);
        if (++frame % 3 === 0) { hist.push([t, p, T.L, T.K + heat]); if (hist.length > 700) hist.shift(); }
        if (frame % 6 === 0) plot.set({ series: [{ pts: hist.map(h => [h[0], h[1]]), label: '|p| (kg·m/s)' }, { pts: hist.map(h => [h[0], h[2]]), label: 'L (kg·m²/s)' }, { pts: hist.map(h => [h[0], h[3]]), label: 'energy (J)' }] });
        ro.set('p', f2(p, 3) + ' kg·m/s'); ro.set('L', f2(T.L, 3) + ' kg·m²/s'); ro.set('K', f2(T.K, 3) + ' J'); ro.set('Qh', f2(heat, 3) + ' J'); ro.set('E', f2(T.K + heat, 3) + ' J');
        // drawing: the tray is 2 m across
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, cx = W * 0.42, cy = H / 2, sc = Math.min(W * 0.8, H) / 2 / 1.12;
        c.strokeStyle = C.text; c.lineWidth = 3;
        if (V.tray === 'round') { c.beginPath(); c.arc(cx, cy, sc, 0, TAU); c.stroke(); }
        else if (V.tray === 'square') c.strokeRect(cx - sc, cy - sc, 2 * sc, 2 * sc);
        else { c.setLineDash([6, 6]); c.lineWidth = 1.2; c.strokeRect(cx - sc, cy - sc, 2 * sc, 2 * sc); c.setLineDash([]); }
        D.forEach((d, i) => {
          const x = cx + d.x * sc, y = cy - d.y * sc;
          circle(c, x, y, d.r * sc, C.series[i % 7], C.text, 1);
          line(c, x, y, x + d.vx * sc * 0.25, y - d.vy * sc * 0.25, C.text, 1);
        });
        // the totals: momentum as an arrow, angular momentum as a curved arrow
        const ax = cx + T.px * sc * 0.12, ay = cy - T.py * sc * 0.12;
        kit.arrow(c, cx, cy, ax, ay, C.warn, 3.5);
        kit.label(c, 'p', ax + 6, ay - 6, { color: C.warn, weight: 700 });
        const span = clamp(T.L * 0.8, -5.5, 5.5), r0 = 0.28 * sc;
        if (Math.abs(span) > 0.05) {
          c.strokeStyle = C.ok; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, r0, -0.3, -0.3 - span, span > 0); c.stroke();
          const ea = -0.3 - span, hx = cx + r0 * Math.cos(ea), hy = cy + r0 * Math.sin(ea), tg = span > 0 ? ea - Math.PI / 2 : ea + Math.PI / 2;
          kit.arrow(c, hx - 6 * Math.cos(tg), hy - 6 * Math.sin(tg), hx + 2 * Math.cos(tg), hy + 2 * Math.sin(tg), C.ok, 3);
        }
        kit.label(c, 'L', cx + r0 + 6, cy - 12, { color: C.ok, weight: 700 });
        const kept = { round: 'kept: L and E — not p', square: 'kept: E only', open: 'kept: p and E — not L' }[V.tray];
        kit.label(c, kept, W * 0.84 + 4, 20, { align: 'center', weight: 700, size: 12.5 });
        kit.label(c, 'tray 2 m across', W * 0.84 + 4, 40, { align: 'center', size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ quantum: the double well */
  // natural units ħ = m = 1 on a box of length 1; for an electron in a 1 nm box the energy unit ħ²/(mL²) is 76.2 meV
  // and the time unit mL²/ħ is 8.64 fs
  const EU = 76.2e-3, TU = 8.64;
  const doubleWell = (V0, a, tilt) => x => { const u = x - 0.5, q = u * u / (a * a) - 1; return V0 * q * q + tilt * u / (2 * a); };
  const parityOf = (re, im, dx) => { const N = re.length; let s = 0; for (let j = 0; j < N; j++) s += re[j] * re[N - 1 - j] + (im ? im[j] * im[N - 1 - j] : 0); return s * dx; };
  const SUBS = '₀₁₂₃₄₅₆₇₈₉';

  Hyper.sim('sym-double-well', {
    title: 'Stationary states of a double well: even or odd',
    blurb: `A particle in two wells separated by a barrier (left: the potential and the energy levels; right: the [[?wave-function|wave function]] of each stationary state, computed by solving the Schrödinger equation). The potential is the same on both sides of the centre, so reflecting a state, $\\psi(x) \\to \\psi(-x)$, can at most change its sign. The dashed curve is the reflection; the parity $P = \\int\\psi(x)\\psi(-x)\\,dx$ is +1 for even states and −1 for odd ones.

**Try this**
- Look at the lowest pair: the ground state is even (both humps up), the next is odd (one up, one down). Their energies are close — the gap is the tunnelling splitting.
- Raise the barrier: the pair closes up exponentially (read the splitting). Lower it and the even–odd pairs spread apart like the levels of a single box.
- *Tilt* the wells a little: the symmetry is gone. The dashed reflections no longer match, the parities slide away from ±1, and each state settles into one well. A tilt much smaller than the barrier is enough when the splitting is small.
- Energies are in units of ħ²/(mL²): for an electron in a well 1 nm wide, 76 meV.`,
    mount(box, kit) {
      const Q = kit.qm, st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'V0', label: 'Height of the barrier', min: 50, max: 1200, value: 300, log: true, sig: 3 },
        { id: 'a', label: 'Half the distance between the wells', min: 0.12, max: 0.3, step: 0.005, value: 0.2 },
        { id: 'tilt', label: 'Tilt (right well deeper ← → left well deeper)', min: -30, max: 30, step: 0.5, value: 0 },
        { id: 'count', label: 'States shown', min: 2, max: 6, step: 1, value: 4 },
        { id: 'mirror', type: 'check', label: 'Show each state\'s mirror image ψ(−x)', value: true }
      ], () => solve());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['E', 'Lowest energies'], ['dE', 'Splitting of the lowest pair'], ['T', 'Tunnelling period h/ΔE'], ['P', 'Parities']]);
      let sol = null;
      function solve() {
        const n = Math.round(V.count), Vf = doubleWell(V.V0, V.a, V.tilt);
        const r = Q.eigen1d(Vf, { N: 300, L: 1, count: n });
        r.par = r.psi.map(p => parityOf(p, null, r.dx));
        r.V = r.x.map(Vf);
        sol = r;
        const dE = r.E[1] - r.E[0];
        ro.set('E', r.E.slice(0, 4).map(e => f2(e, 1)).join(', ') + ' ħ²/mL²');
        ro.set('dE', dE.toPrecision(3) + ' ħ²/mL² = ' + (dE * EU * 1000).toPrecision(3) + ' meV (electron, 1 nm)');
        ro.set('T', (TAU / Math.max(dE, 1e-12) * TU).toPrecision(3) + ' fs (electron, 1 nm)');
        ro.set('P', r.par.slice(0, 4).map(p => (p >= 0 ? '+' : '') + f2(p)).join(', '));
      }
      solve();
      const colOf = (p, C) => p > 0.95 ? C.series[2] : p < -0.95 ? C.series[1] : C.muted;
      const draw = () => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, r = sol, n = r.E.length;
        // left: the potential and the levels
        const lx = 16, lw = W * 0.4, ty = 26, by = H - 30, Emax = r.E[n - 1] * 1.25 + 10;
        const X = x => lx + x * lw, Y = e => by - (by - ty) * clamp(e, -Emax * 0.1, Emax) / Emax;
        line(c, lx, by, lx + lw, by, C.grid, 1);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath();
        r.x.forEach((x, j) => { const y = Y(r.V[j]); if (j) c.lineTo(X(x), y); else c.moveTo(X(x), y); }); c.stroke();
        r.E.forEach((e, i) => {
          line(c, X(0.02), Y(e), X(0.98), Y(e), colOf(r.par[i], C), i < 2 ? 2 : 1.4);
          kit.label(c, 'E' + SUBS[i], X(1) + 4, Y(e) + (i % 2 ? 7 : -5), { size: 10.5, color: colOf(r.par[i], C) });
        });
        kit.label(c, 'potential and energy levels', lx, 12, { size: 11.5, weight: 700 });
        kit.label(c, 'x →', lx + lw - 20, by + 14, { size: 10.5, color: C.muted });
        // right: the states, one strip each
        const rx = W * 0.47, rw = W * 0.5, sh = (H - 30) / n;
        kit.label(c, 'stationary states (lowest at the bottom)', rx, 12, { size: 11.5, weight: 700 });
        for (let i = 0; i < n; i++) {
          const p = r.psi[i], cy = H - 10 - sh * (i + 0.5), amp = sh * 0.42 / Math.max(1e-9, ...p.map(Math.abs));
          const XX = j => rx + rw * r.x[j], col = colOf(r.par[i], C);
          line(c, rx, cy, rx + rw, cy, C.grid, 1);
          line(c, rx + rw / 2, cy - sh * 0.45, rx + rw / 2, cy + sh * 0.45, C.faint, 1, [2, 3]);
          c.beginPath(); c.moveTo(XX(0), cy); p.forEach((v, j) => c.lineTo(XX(j), cy - v * amp)); c.lineTo(XX(p.length - 1), cy); c.closePath();
          c.fillStyle = col; c.globalAlpha = 0.25; c.fill(); c.globalAlpha = 1;
          c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); p.forEach((v, j) => j ? c.lineTo(XX(j), cy - v * amp) : c.moveTo(XX(j), cy - v * amp)); c.stroke();
          if (V.mirror) { c.strokeStyle = C.text; c.lineWidth = 1.2; c.setLineDash([4, 3]); c.beginPath(); p.forEach((v, j) => { const m = p[p.length - 1 - j]; if (j) c.lineTo(XX(j), cy - m * amp); else c.moveTo(XX(j), cy - m * amp); }); c.stroke(); c.setLineDash([]); }
          const pr = r.par[i], word = pr > 0.95 ? 'even' : pr < -0.95 ? 'odd' : 'no definite parity';
          kit.label(c, 'ψ' + SUBS[i] + '  ' + word + '  P = ' + (pr >= 0 ? '+' : '') + f2(pr), rx + 4, cy - sh * 0.36, { size: 10.5, color: col, weight: 600 });
        }
      };
      const loop = kit.loop(draw, box.stage);
      loop.start();
    }
  });

  /* ================================================================ quantum: a packet that keeps its parity */
  Hyper.sim('sym-parity-packet', {
    title: 'Tunnelling to and fro, with parity kept',
    blurb: `The same double well, now with time running (the Schrödinger equation solved step by step). The shaded curve is the [[?probability-density]] $|\\psi|^2$ and the thin line is the real part of $\\psi$. The graph follows the probability $P_L$ of finding the particle in the left half, and the parity [[?expectation-value]] $\\langle P\\rangle = \\int\\psi^*(x)\\,\\psi(-x)\\,dx$.

**Try this**
- *In the left well*: the state is (even + odd)/√2. The two parts turn at slightly different rates, so the particle tunnels across and back with the period $h/\\Delta E$ — while $\\langle P\\rangle$ stays at exactly 0.
- *The even ground state*: nothing moves at all — a stationary state only turns its phase. $\\langle P\\rangle = +1$ for ever.
- *0.8 even + 0.6 odd*: it sloshes, but less completely, and $\\langle P\\rangle$ stays at $0.8^2 - 0.6^2 = 0.28$.
- *A kicked packet*: many states at once — a messy dance, yet $\\langle P\\rangle$ is a perfectly flat line.
- Now *tilt* the wells even slightly: the symmetry is broken, and $\\langle P\\rangle$ starts to wander. Parity is conserved exactly when, and only when, the laws are mirror-symmetric.`,
    mount(box, kit) {
      const Q = kit.qm, st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'start', type: 'select', label: 'Start in', options: [['the left well: (even + odd)/√2', 'left'], ['the even ground state', 'even'], ['0.8 even + 0.6 odd', 'mix'], ['a packet kicked to the right', 'kick']], value: 'left' },
        { id: 'V0', label: 'Height of the barrier', min: 150, max: 600, value: 300, log: true, sig: 3 },
        { id: 'tilt', label: 'Tilt of the wells', min: -10, max: 10, step: 0.1, value: 0 },
        { id: 'speed', label: 'Speed (time units per second)', min: 0.1, max: 1.5, step: 0.05, value: 0.5 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }] }
      ], () => build());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['PL', 'P_L (left half)'], ['P', '⟨P⟩ parity'], ['T', 'Predicted period h/ΔE'], ['nrm', 'Total probability']]);
      const plot = kit.plot(gb, { x: { label: 'time (fs, for an electron in a 1 nm double well)', min: 0 }, y: { label: 'P_L and ⟨P⟩', min: -1.05, max: 1.05 }, legend: true }, 150);
      const N = 300, A = 0.2, DT = 2e-4;
      let w = null, hist = [], acc = 0, period = 1, frame = 0;
      function build() {
        const Vsym = doubleWell(V.V0, A, 0), Vf = doubleWell(V.V0, A, V.tilt);
        const e = Q.eigen1d(Vsym, { N, L: 1, count: 2 });
        period = TAU / Math.max(1e-9, e.E[1] - e.E[0]);
        w = Q.wave1d({ N, L: 1, V: Vf, dt: DT });
        if (V.start === 'kick') w.setGaussian({ x0: 0.5 - A, sigma: 0.04, k0: 40 });
        else {
          const ce = V.start === 'left' ? Math.SQRT1_2 : V.start === 'mix' ? 0.8 : 1, co = V.start === 'left' ? Math.SQRT1_2 : V.start === 'mix' ? 0.6 : 0;
          for (let j = 0; j < N; j++) { w.re[j] = ce * e.psi[0][j] + co * e.psi[1][j]; w.im[j] = 0; }
          const nr = Math.sqrt(w.norm()); for (let j = 0; j < N; j++) w.re[j] /= nr;
        }
        w.t = 0; hist = []; acc = 0;
        ro.set('T', f2(period, 2) + ' units = ' + f2(period * TU, 1) + ' fs');
      }
      build();
      const loop = kit.loop(dt => {
        acc += dt * V.speed;
        const n = Math.min(400, Math.floor(acc / DT));
        if (n > 0) { w.step(n); w.t += n * DT; acc -= n * DT; }
        const pr = w.prob(), dx = w.dx;
        let PL = 0; for (let j = 0; j < N / 2; j++) PL += pr[j] * dx;
        const Pp = parityOf(w.re, w.im, dx), nrm = w.norm();
        if (++frame % 2 === 0) { hist.push([w.t * TU, PL, Pp]); if (hist.length > 1500) hist.shift(); }
        if (frame % 6 === 0) plot.set({ series: [{ pts: hist.map(h => [h[0], h[1]]), label: 'P_L, left half' }, { pts: hist.map(h => [h[0], h[2]]), label: '⟨P⟩ parity' }] });
        ro.set('t', f2(w.t, 2) + ' units = ' + f2(w.t * TU, 1) + ' fs'); ro.set('PL', f2(PL, 3)); ro.set('P', (Pp >= 0 ? '+' : '') + f2(Pp, 4)); ro.set('nrm', f2(nrm, 5));
        // drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, lx = 20, lw = W - 40, by = H - 22, ty = 24;
        const X = x => lx + x * lw, top = V.V0 * 0.9;
        const Y = e => by - (by - ty) * clamp(e / top, -0.05, 1.1);
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath();
        for (let j = 0; j < N; j++) { const y = Y(w.V[j]); if (j) c.lineTo(X(w.x[j]), y); else c.moveTo(X(w.x[j]), y); } c.stroke();
        let pm = 0; for (let j = 0; j < N; j++) pm = Math.max(pm, pr[j]);
        const sp = (by - ty) * 0.8 / Math.max(pm, 1e-9), sr = (by - ty) * 0.4 / Math.sqrt(Math.max(pm, 1e-9)), mid = by - (by - ty) * 0.45;
        c.beginPath(); c.moveTo(X(w.x[0]), by);
        for (let j = 0; j < N; j++) c.lineTo(X(w.x[j]), by - pr[j] * sp);
        c.lineTo(X(w.x[N - 1]), by); c.closePath(); c.fillStyle = C.hue(265, 0.35); c.fill();
        c.strokeStyle = C.accent; c.lineWidth = 1; c.beginPath();
        for (let j = 0; j < N; j++) { const y = mid - w.re[j] * sr; if (j) c.lineTo(X(w.x[j]), y); else c.moveTo(X(w.x[j]), y); } c.stroke();
        line(c, X(0.5), ty, X(0.5), by, C.faint, 1, [3, 4]);
        kit.label(c, 'left: ' + f2(100 * PL, 0) + ' %', X(0.25), 14, { align: 'center', weight: 700, color: C.series[2] });
        kit.label(c, 'right: ' + f2(100 * (1 - PL), 0) + ' %', X(0.75), 14, { align: 'center', weight: 700, color: C.series[1] });
        kit.label(c, '⟨P⟩ = ' + (Pp >= 0 ? '+' : '') + f2(Pp, 3) + (Math.abs(V.tilt) < 1e-9 ? '  (symmetric: kept)' : '  (tilted: not kept)'), X(0.5), by + 12, { align: 'center', size: 11.5 });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ Wu's cobalt-60 experiment and its mirror image */
  Hyper.sim('sym-cobalt-mirror', {
    title: 'The cobalt-60 experiment in a mirror',
    blurb: `Left: cobalt-60 nuclei, cooled and lined up by a magnetic field, spinning as the ring of moving dots shows; the spin arrow follows the right-hand rule. Their beta electrons fly out and are counted above and below. Right: the exact mirror image of the left half. The electrons are reflected — still mostly going the same way, up or down — but the ring now turns the other way, so the **spin of the mirror nucleus points the opposite way** to the reflected arrow. Electrons leave at angle $\\theta$ to the spin at the rate $1 + AP\\beta\\cos\\theta$, with $A = -1$ for cobalt-60.

**Try this**
- Watch the counters: in our world more electrons leave **against** the spin. In the mirror world the same electrons leave **along** the spin of their nucleus — a world that does not exist.
- Flip the field: the spins turn over and the electrons follow them. The preference is tied to the spin, not to up or down.
- *Warm the sample*: the spins jumble, the polarization falls to zero, and the difference in the counts fades — as it did in 1957.
- Tick *a world where parity holds*: now both counters fill equally and the mirror image is indistinguishable from the original.`,
    mount(box, kit) {
      const Q = kit.qm, R = Q.rng(1957), st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'field', type: 'select', label: 'Magnetic field', options: [['Up: nuclear spins up', 1], ['Down: nuclear spins down', -1]], value: 1 },
        { id: 'P', label: 'Polarization of the nuclei when cold', min: 0, max: 1, step: 0.01, value: 0.7 },
        { id: 'beta', label: 'Electron speed v/c', min: 0.3, max: 0.9, step: 0.01, value: 0.6 },
        { id: 'rate', label: 'Decays per second', min: 5, max: 300, value: 60, log: true, sig: 2 },
        { id: 'par', type: 'check', label: 'Imagine a world where parity holds (A = 0)', value: false },
        { type: 'buttons', items: [{ id: 'warm', label: 'Warm the sample' }, { id: 'cool', label: 'Cool it again' }, { id: 'zero', label: 'Reset the counters', primary: true }] }
      ], id => {
        if (id === 'warm') warm = 0;
        if (id === 'cool') warm = null;
        if (id === 'zero' || id === 'field' || id === 'par') { up = 0; down = 0; el = []; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['Pn', 'Polarization now'], ['cnt', 'Counted up / down'], ['our', 'Our world'], ['mir', 'Mirror world'], ['R', 'Expected ratio against : along']]);
      let el = [], up = 0, down = 0, acc = 0, t = 0, warm = null;
      const loop = kit.loop(dt => {
        t += dt;
        if (warm != null) warm += dt;
        const Pn = V.P * (warm == null ? 1 : Math.exp(-warm / 4)), A = V.par ? 0 : -1, k = A * Pn * V.beta, sgn = V.field;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, cx = W / 4, cy = H / 2 + 6, reach = Math.min(H / 2 - 50, W / 4 - 20);
        // new decays: cos θ from 1 + k cos θ (θ from the spin), azimuth uniform; drawn as the projection on the page
        acc += dt * V.rate;
        let made = 0;
        while (acc >= 1 && made < 50) {
          acc -= 1; made++;
          let mu = 0; for (let tries = 0; tries < 50; tries++) { mu = 2 * R() - 1; if (R() * (1 + Math.abs(k)) <= 1 + k * mu) break; }
          const phi = TAU * R(), sn = Math.sqrt(Math.max(0, 1 - mu * mu));
          el.push({ dx: sn * Math.cos(phi), dy: -mu * sgn, r: 0 });
        }
        if (acc > 5) acc = 0;
        for (const e of el) {
          e.r += dt * 170;
          if (!e.done && e.r * Math.abs(e.dy) >= reach - 8 && Math.abs(e.r * e.dx) < 64) { e.done = true; if (e.dy < 0) up++; else down++; }
        }
        el = el.filter(e => e.r < reach + 40);
        // counts and readouts
        const along = sgn > 0 ? up : down, against = sgn > 0 ? down : up, tot = up + down;
        const pa = tot ? against / tot : 0.5;
        ro.set('Pn', f2(100 * Pn, 0) + ' %' + (warm != null ? ' (warming)' : ''));
        ro.set('cnt', up + ' / ' + down);
        ro.set('our', tot ? f2(100 * pa, 0) + ' % against the spin' : '…');
        ro.set('mir', tot ? f2(100 * pa, 0) + ' % along the spin' + (V.par ? '' : ' — never observed') : '…');
        const x = Pn * V.beta * Math.abs(A);
        ro.set('R', f2((1 + x) / Math.max(1e-9, 1 - x), 2));
        // one world, drawn twice: the right half is its exact mirror image
        const drawWorld = mirrored => {
          // counters
          c.fillStyle = C.bg2; c.strokeStyle = C.muted; c.lineWidth = 1.5;
          c.fillRect(cx - 64, cy - reach - 16, 128, 14); c.strokeRect(cx - 64, cy - reach - 16, 128, 14);
          c.fillRect(cx - 64, cy + reach + 2, 128, 14); c.strokeRect(cx - 64, cy + reach + 2, 128, 14);
          // electrons
          for (const e of el) circle(c, cx + e.dx * e.r, cy + e.dy * e.r, 2.6, C.accent);
          // the spinning ring (back half, nucleus, front half)
          const ring = front => { for (let i = 0; i < 10; i++) { const tau = sgn * t * 4 + i * TAU / 10, s = Math.sin(tau); if ((s < 0) !== front) continue; circle(c, cx + 42 * Math.cos(tau), cy - 13 * s, front ? 3.4 : 2.4, front ? C.warn : C.faint); } };
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.ellipse(cx, cy, 42, 13, 0, 0, TAU); c.stroke();
          ring(false);
          circle(c, cx, cy, 20, 'hsl(215 60% 45%)', C.text, 1.5);
          ring(true);
          // the front of the ring moves this way (drawn so the mirror shows the reversal)
          const fx = sgn > 0 ? 1 : -1;
          kit.arrow(c, cx - 16 * fx, cy + 22, cx + 16 * fx, cy + 22, C.warn, 2);
          if (!mirrored) { kit.arrow(c, cx, cy, cx, cy - sgn * 70, C.text, 3); }
        };
        drawWorld(false);
        c.save(); c.translate(W, 0); c.scale(-1, 1); drawWorld(true); c.restore();
        // the mirror
        c.fillStyle = C.hue(195, 0.18); c.fillRect(W / 2 - 5, 8, 10, H - 16);
        line(c, W / 2, 8, W / 2, H - 8, C.hue(195, 0.8), 2);
        // labels, never mirrored
        const mx = W - cx;
        kit.label(c, 'Our world', cx, 14, { align: 'center', weight: 700 });
        kit.label(c, 'In the mirror', mx, 14, { align: 'center', weight: 700 });
        kit.label(c, '⁶⁰Co', cx, cy, { align: 'center', size: 11, weight: 700, color: '#fff' });
        kit.label(c, '⁶⁰Co', mx, cy, { align: 'center', size: 11, weight: 700, color: '#fff' });
        kit.label(c, 'spin', cx + 8, cy - sgn * 58, { size: 11.5, weight: 700 });
        // in the mirror: the reflected arrow still points the same way, but the reflected nucleus spins the other way
        kit.arrow(c, mx, cy, mx, cy - sgn * 70, C.faint, 2);
        kit.label(c, 'reflected arrow', mx + 8, cy - sgn * 62, { size: 10.5, color: C.faint });
        kit.arrow(c, mx - 14, cy, mx - 14, cy + sgn * 70, C.bad, 3);
        kit.label(c, 'its real spin', mx - 22, cy + sgn * 62, { size: 11, color: C.bad, weight: 700, align: 'right' });
        const topLbl = (sgn > 0 ? 'along' : 'against') + ' the spin: ' + up, botLbl = (sgn > 0 ? 'against' : 'along') + ' the spin: ' + down;
        kit.label(c, topLbl, cx, cy - reach - 26, { align: 'center', size: 11.5 });
        kit.label(c, botLbl, cx, cy + reach + 28, { align: 'center', size: 11.5 });
        kit.label(c, (sgn > 0 ? 'against' : 'along') + ' its spin: ' + up, mx, cy - reach - 26, { align: 'center', size: 11.5 });
        kit.label(c, (sgn > 0 ? 'along' : 'against') + ' its spin: ' + down, mx, cy + reach + 28, { align: 'center', size: 11.5 });
        if (tot > 40 && !V.par && Pn > 0.1) kit.label(c, 'electrons prefer the spin direction: never happens', mx, H - 4 - 8, { align: 'center', size: 11, color: C.bad, weight: 700 });
        if (V.par) kit.label(c, 'with A = 0 the two halves cannot be told apart', W / 2, H - 12, { align: 'center', size: 11, color: C.ok, weight: 700 });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pion decay in four worlds: ours, P, C and CP */
  const WORLDS = {
    ours: { title: 'Our world', eq: 'π⁺ → μ⁺ + νμ', pion: 'π⁺', mu: 'μ⁺', nu: 'νμ', dir: 1, seen: true, note: 'the neutrino is left-handed' },
    P: { title: 'Mirror (P)', eq: 'π⁺ → μ⁺ + νμ', pion: 'π⁺', mu: 'μ⁺', nu: 'νμ', dir: -1, seen: false, note: 'a right-handed neutrino: never seen' },
    C: { title: 'Antimatter (C)', eq: 'π⁻ → μ⁻ + ν̄μ', pion: 'π⁻', mu: 'μ⁻', nu: 'ν̄μ', dir: 1, seen: false, note: 'a left-handed antineutrino: never seen' },
    CP: { title: 'Mirror + antimatter (CP)', eq: 'π⁻ → μ⁻ + ν̄μ', pion: 'π⁻', mu: 'μ⁻', nu: 'ν̄μ', dir: -1, seen: true, note: 'a right-handed antineutrino: seen' }
  };
  Hyper.sim('sym-cp-pion', {
    title: 'Pion decay in the mirror and in antimatter',
    blurb: `A pion at rest decays into a muon and a neutrino, which fly apart back to back. The pion has no spin, so their spins (the turning rings, with the spin arrow along the axis) must point opposite ways. In our world the neutrino always spins **against** its motion — it is left-handed. Now transform the event. **P**, the mirror: the motions reverse, but a spin along the line of flight does not (it is an axial vector), so the neutrino becomes right-handed. **C**, antimatter: every particle becomes its antiparticle, with the same motions and spins. **CP**: both.

**Try this**
- Compare our world with P: the mirror event needs a right-handed neutrino. None has ever been seen: the mirror image is impossible.
- Compare with C: a left-handed antineutrino — never seen either.
- Compare with CP: a right-handed antineutrino, from a negative pion — exactly what $\\pi^-$ decays give. The combined mirror works.
- Follow the muon too: its spin is forced by the neutrino's. Measuring the muon's spin — by where its own decay electron goes — is how Garwin, Lederman and Weinrich saw parity violation in 1957; the neutrino's handedness itself was measured in 1958.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'op', type: 'select', label: 'Compare our world with', options: [['all four worlds', 'all'], ['the mirror (P)', 'P'], ['antimatter (C)', 'C'], ['mirror + antimatter (CP)', 'CP']], value: (params && params.op) || 'all' },
        { id: 'slow', type: 'check', label: 'Slow motion', value: false },
        { type: 'buttons', items: [{ id: 'again', label: 'Decay again', primary: true }] }
      ], id => { if (id === 'again') t = 0; says(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ours', 'Our world'], ['x', 'Transformed'], ['rule', 'The rule']]);
      function says() {
        const w = WORLDS[V.op] || null;
        ro.set('ours', 'π⁺ → μ⁺ + left-handed νμ — seen');
        ro.set('x', w ? w.title + ': ' + w.note : 'P and C each give a world that never happens; CP gives one that does');
        ro.set('rule', 'neutrinos left-handed, antineutrinos right-handed');
      }
      says();
      let t = 0;
      const ringDots = (c, C, x, y, sAxis, phase) => {
        // a ring around the line of flight, turning by the right-hand rule about the spin direction (sAxis = ±1 along x)
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.ellipse(x, y, 5, 15, 0, 0, TAU); c.stroke();
        for (let i = 0; i < 6; i++) { const tau = sAxis * phase + i * TAU / 6, fr = Math.sin(tau) > 0; circle(c, x + 5 * Math.sin(tau), y - 15 * Math.cos(tau), fr ? 2.8 : 1.8, fr ? C.warn : C.faint); }
      };
      const loop = kit.loop(dt => {
        t += dt * (V.slow ? 0.35 : 1); if (t > 4.2) t = 0;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const keys = V.op === 'all' ? ['ours', 'P', 'C', 'CP'] : ['ours', V.op];
        const cols = keys.length === 4 ? 2 : 2, rows = keys.length === 4 ? 2 : 1, pw = W / cols, ph = H / rows;
        keys.forEach((key, i) => {
          const w = WORLDS[key], px = (i % cols) * pw, py = Math.floor(i / cols) * ph, cx = px + pw / 2, cy = py + ph / 2 + 8;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(px + 3, py + 3, pw - 6, ph - 6);
          kit.label(c, w.title, px + 12, py + 16, { weight: 700 });
          kit.label(c, w.eq, px + pw - 12, py + 16, { align: 'right', size: 12 });
          const td = 0.8, f = clamp((t - td) / 2.4, 0, 1), dist = f * (pw / 2 - 50);
          if (t < td) { circle(c, cx, cy, 13, C.bg2, C.text, 2); kit.label(c, w.pion, cx, cy, { align: 'center', weight: 700, size: 12 }); kit.label(c, 'spin 0', cx, cy + 26, { align: 'center', size: 10.5, color: C.muted }); }
          else {
            if (t - td < 0.2) circle(c, cx, cy, 6 + 60 * (t - td), 'hsl(48 100% 60% / .4)');
            // our world: μ to the right with spin −x, ν to the left with spin +x; the mirror (P) reverses the motions only
            const muX = cx + w.dir * dist, nuX = cx - w.dir * dist, phase = t * 5;
            const parts = [[muX, w.mu, w.dir, -1, 13, C.bg2], [nuX, w.nu, -w.dir, 1, 9, 'hsl(160 60% 45% / .35)']];
            for (const [x, name, pdir, sdir, rad, fill] of parts) {
              ringDots(c, C, x, cy, sdir, phase);
              circle(c, x, cy, rad, fill, C.text, 1.5);
              kit.label(c, name, x, cy, { align: 'center', weight: 700, size: 11.5 });
              kit.arrow(c, x + pdir * (rad + 4), cy - 30, x + pdir * (rad + 34), cy - 30, C.text, 2);
              kit.label(c, 'motion', x + pdir * (rad + 19), cy - 42, { align: 'center', size: 10, color: C.muted });
              kit.arrow(c, x + sdir * (rad + 4), cy + 30, x + sdir * (rad + 30), cy + 30, C.warn, 2.5);
              kit.label(c, 'spin', x + sdir * (rad + 17), cy + 42, { align: 'center', size: 10, color: C.warn });
              kit.label(c, pdir * sdir < 0 ? 'left-handed' : 'right-handed', x, cy + 58, { align: 'center', size: 10.5, weight: 600, color: name.indexOf('ν') >= 0 ? (w.seen ? C.ok : C.bad) : C.muted });
            }
          }
          kit.label(c, w.seen ? '✓ happens' : '✗ never seen', cx, py + ph - 16, { align: 'center', weight: 700, color: w.seen ? C.ok : C.bad });
        });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ CP violation: counting K_L decays */
  Hyper.sim('sym-kaon-count', {
    title: 'Counting kaon decays until CP violation shows',
    blurb: `Long-lived neutral kaons, $K_L$, fly from a target and decay in flight. In a magnetic field the positrons of $K_L \\to \\pi^- e^+ \\nu_e$ curve one way and the electrons of $K_L \\to \\pi^+ e^- \\bar\\nu_e$ the other. If CP were an exact symmetry the two would be equally common. In nature the positrons win by $\\delta = 0.33\\,\\%$. The graph shows the measured asymmetry $(N_+ - N_-)/(N_+ + N_-)$ against the number of decays $N$, with the band of random scatter, about $\\pm 2/\\sqrt N$ (two [[?standard-deviation|standard deviations]]).

**Try this**
- Start slowly: at first the asymmetry jumps about wildly — a few hundred decays tell you nothing about a 0.33 % effect.
- Speed up. The scatter band narrows as $1/\\sqrt N$; somewhere past a million decays the measured points separate from zero for good.
- Set the true asymmetry to 0, as if CP held: the points wander inside the band for ever.
- When the significance passes 5σ, you have a message for the distant listener: *positive* is the charge of the lepton that $K_L$ prefers.`,
    mount(box, kit) {
      const Q = kit.qm, R = Q.rng(1964), st = kit.stage(box.stage, { aspect: 0.36, minH: 200 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'rate', label: 'Decays per second', min: 10, max: 1e7, value: 2e4, log: true, sig: 2 },
        { id: 'delta', label: 'True asymmetry (0 if CP were exact)', min: 0, max: 1, step: 0.01, value: 0.33, unit: '%' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start counting again', primary: true }] }
      ], id => { if (id === 'reset' || id === 'delta') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['N', 'Decays counted'], ['pm', 'Positrons / electrons'], ['d', 'Measured asymmetry'], ['z', 'Significance'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'decays counted, N', log: true, min: 100, max: 1e9 }, y: { label: 'measured asymmetry (%)', min: -1.5, max: 1.5 }, legend: true }, 170);
      let Np = 0, Nm = 0, acc = 0, pts = [], nextN = 100, tracks = [], frame = 0;
      function reset() { Np = 0; Nm = 0; acc = 0; pts = []; nextN = 100; tracks = []; }
      const band = s => { const a = []; for (let e = 2; e <= 9; e += 0.1) { const n = Math.pow(10, e); a.push([n, s * 200 / Math.sqrt(n)]); } return a; };
      const loop = kit.loop(dt => {
        const p = (1 + V.delta / 100) / 2;
        acc += dt * V.rate;
        const n = Math.floor(acc); acc -= n;
        if (n > 0) {
          let k;
          if (n < 200) { k = 0; for (let i = 0; i < n; i++) if (R() < p) k++; }
          else k = clamp(Math.round(n * p + Math.sqrt(n * p * (1 - p)) * Q.gauss(R)), 0, n);
          Np += k; Nm += n - k;
          // a few decays are drawn
          const show = Math.min(n, 2);
          for (let i = 0; i < show; i++) if (tracks.length < 40) tracks.push({ x: 0.25 + 0.5 * R(), pos: R() < p, age: 0 });
        }
        const N = Np + Nm, dm = N ? (Np - Nm) / N : 0, sig = N ? 1 / Math.sqrt(N) : 1, z = N ? dm / sig : 0;
        while (N >= nextN) { pts.push([N, 100 * dm]); nextN *= 1.12; }
        if (++frame % 4 === 0) plot.set({ series: [{ pts, label: 'measured', line: false, dots: 3 }, { pts: band(1), label: '±2σ scatter', dash: [4, 4] }, { pts: band(-1), label: '', dash: [4, 4] }], hlines: [{ y: V.delta, label: 'true ' + f2(V.delta, 2) + ' %' }, { y: 0, label: '' }] });
        ro.set('N', N.toLocaleString ? N.toLocaleString('en-GB') : String(N));
        ro.set('pm', Np + ' / ' + Nm);
        ro.set('d', N ? f2(100 * dm, 3) + ' ± ' + f2(100 * sig, 3) + ' %' : '…');
        ro.set('z', N ? f2(z, 1) + ' σ' : '…');
        ro.set('msg', z >= 5 ? 'Past 5σ: positrons really are favoured — CP is broken.' : N > 1e4 ? 'Not yet distinguishable from zero.' : '');
        // the beam line
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, y0 = H / 2, x0 = 30, x1 = W - 120;
        c.fillStyle = C.faint; c.fillRect(x0 - 16, y0 - 12, 14, 24); kit.label(c, 'target', x0 - 9, y0 + 24, { align: 'center', size: 10.5, color: C.muted });
        line(c, x0, y0, x1, y0, C.grid, 1, [4, 4]);
        for (let i = 0; i < 9; i++) { const x = x0 + ((frame * 3 + i * 70) % (x1 - x0)); circle(c, x, y0, 3.5, C.muted); }
        kit.label(c, 'K_L beam', x0 + 10, y0 - 14, { size: 11, color: C.muted });
        c.fillStyle = C.hue(200, 0.08); c.fillRect(x0 + (x1 - x0) * 0.2, 12, (x1 - x0) * 0.6, H - 24);
        kit.label(c, 'magnetic field (into the page)', x0 + (x1 - x0) * 0.5, H - 8, { align: 'center', size: 10.5, color: C.muted });
        for (const tr of tracks) {
          tr.age += dt;
          const vx = x0 + (x1 - x0) * tr.x, f = clamp(tr.age / 0.8, 0, 1), sgn = tr.pos ? -1 : 1;
          const ex = vx + f * (x1 + 40 - vx), ey = y0 + sgn * f * f * (H / 2 - 22);
          c.strokeStyle = tr.pos ? C.bad : C.accent; c.lineWidth = 1.6; c.beginPath(); c.moveTo(vx, y0);
          for (let s = 0.1; s <= f + 1e-9; s += 0.1) c.lineTo(vx + s * (x1 + 40 - vx), y0 + sgn * s * s * (H / 2 - 22));
          c.stroke();
          line(c, vx, y0, vx + f * 60, y0 - sgn * f * 18, C.muted, 1);
          circle(c, ex, ey, 2.5, tr.pos ? C.bad : C.accent);
        }
        tracks = tracks.filter(tr => tr.age < 1.1);
        c.fillStyle = C.bg2; c.fillRect(x1 + 30, 8, 80, 30); c.fillRect(x1 + 30, H - 38, 80, 30);
        kit.label(c, 'e⁺  ' + Np, x1 + 70, 23, { align: 'center', weight: 700, color: C.bad });
        kit.label(c, 'e⁻  ' + Nm, x1 + 70, H - 23, { align: 'center', weight: 700, color: C.accent });
      }, box.stage);
      loop.start();
    }
  });

})();
