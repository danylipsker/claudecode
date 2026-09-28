/* HYPER-FEYNMAN · sims/relativity.js — simulations for Space, Time and Relativity (content/relativity.js).
 *   rel-frames        a carriage passes a platform: a ball and a flash seen from both; velocities add by Einstein's rule
 *   rel-michelson     the Michelson–Morley interferometer in an ether wind: two pulses race, the fringes (not) drift
 *   rel-lorentz-grid  the Lorentz transformation as a squeezed grid of space-time, with a draggable event
 *   rel-lightning     lightning strikes both ends of a train: simultaneous for the platform, not for the train
 *   rel-light-clock   a light clock at rest and one riding a train: time dilation from Pythagoras
 *   rel-muons         muons made high in the atmosphere reach the ground only because their clocks run slow
 *   rel-energy        E² − (pc)² = (mc²)²: a particle pushed along its hyperbola, never reaching c
 *   rel-spacetime     a space-time diagram: events, light cones, world lines, invariant hyperbolas and a boost
 *   rel-four-vectors  a rotated arrow beside a boosted four-vector: components change, the invariant stays
 *   rel-wire          a wire with a current and a moving charge: magnetic force in one frame, electric in the other
 *   rel-hot-plate     Feynman's bugs on a hot plate: rulers that expand with heat make a curved geometry
 * Relativity uses kit.qm.lorentz, addVelocity, doppler and interval (c = 1 inside the models; SI in the readouts).
 */
(function () {
  'use strict';

  const C_SI = 299792458;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const font = () => (typeof getComputedStyle === 'function' && document.body ? getComputedStyle(document.body).fontFamily : '') || 'sans-serif';
  const gammaOf = b => 1 / Math.sqrt(Math.max(1e-12, 1 - b * b));
  // fit a logical W0 × H0 drawing into the stage, centred; returns the transform so pointer positions can be mapped back
  function fit(c, st, W0, H0) {
    const s = Math.min(st.W / W0, st.H / H0), ox = (st.W - W0 * s) / 2, oy = (st.H - H0 * s) / 2;
    c.save(); c.translate(ox, oy); c.scale(s, s);
    return { s, ox, oy, to: p => ({ x: (p.x - ox) / s, y: (p.y - oy) / s }) };
  }
  function txt(c, text, x, y, color, o) {
    o = o || {};
    c.save();
    c.font = (o.weight || 500) + ' ' + (o.size || 12) + 'px ' + font();
    c.textAlign = o.align || 'left'; c.textBaseline = o.base || 'middle';
    c.fillStyle = color; c.fillText(text, x, y);
    c.restore();
  }
  function glow(c, x, y, r, hue, a) {
    c.fillStyle = 'hsl(' + hue + ' 100% 60% / ' + (0.25 * a) + ')'; c.beginPath(); c.arc(x, y, r * 2.2, 0, 6.2832); c.fill();
    c.fillStyle = 'hsl(' + hue + ' 100% 62% / ' + a + ')'; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill();
  }
  const plotBox = box => { const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb); return gb; };

  /* ================================================================ rel-frames */
  Hyper.sim('rel-frames', {
    title: 'One carriage, two points of view',
    blurb: `A carriage runs past a platform at speed $v$. At the same moment a ball (at speed $u$ relative to the carriage) and a flash of light leave the back wall. Look from the platform or from inside the carriage. The dashed ghosts show where Galileo's rule would put them: the ball at $u + v$, the flash at $c + v$. The graph plots the ball's speed over the platform against $u$ for both rules.

**Try this**
- Look from inside the carriage: the flash crosses at $c$ and the ball at $u$ — exactly as they would in a carriage at rest. That is the principle of relativity.
- Look from the platform with $v = 0.5c$, $u = 0.5c$: Galileo says the ball crosses the platform at $c$; it actually moves at $0.8c$, and the flash at $c$, not $1.5c$.
- Make both speeds small (0.05c): the two rules almost agree — everyday speeds are far smaller still.
- Watch the carriage from the platform at $v = 0.8c$: it is shortened by the [[?lorentz-factor]] $\\gamma = 1.67$.`,
    mount(box, kit) {
      const Q = kit.qm, W0 = 640, H0 = 290, CD = 110, L0 = 200, GY = 236;   // CD: light speed in the drawing (px/s); L0: carriage length at rest
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 220 });
      const gb = plotBox(box);
      let t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Look from', options: [['the platform', 'p'], ['inside the carriage', 'c']], value: 'p' },
        { id: 'v', label: 'Speed of the carriage v', min: 0, max: 0.8, step: 0.01, value: 0.5, unit: 'c' },
        { id: 'u', label: 'Speed of the ball in the carriage u', min: 0.05, max: 0.95, step: 0.01, value: 0.5, unit: 'c' },
        { id: 'ghost', type: 'check', label: 'Show Galileo\'s predictions (dashed)', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Launch again', primary: true }] }
      ], id => { t = 0; if (id === 'v' || id === 'u') curve(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['g', 'γ of the carriage'], ['w', 'Ball over the platform (Einstein)'], ['gal', 'Galileo would say u + v'], ['fl', 'Flash over the platform'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'u, speed of the ball in the carriage (units of c)', min: 0, max: 1 }, y: { label: 'speed over the platform (c)', min: 0, max: 1.8 }, legend: true }, 170);
      function curve() {
        const E = [], G = [];
        for (let i = 0; i <= 100; i++) { const u = i / 100; E.push([u, Q.addVelocity(u, V.v)]); G.push([u, Math.min(1.8, u + V.v)]); }
        plot.set({ series: [{ pts: E, label: 'Einstein (u + v)/(1 + uv/c²)', width: 2.2 }, { pts: G, label: 'Galileo u + v', dash: [5, 4] }], hlines: [{ y: 1, label: 'c' }], marks: [{ x: V.u, y: Q.addVelocity(V.u, V.v), label: 'the ball' }] });
      }
      curve();
      const loop = kit.loop(dt => {
        t += dt;
        const v = V.v, u = V.u, g = gammaOf(v), w = Q.addVelocity(u, v), plat = V.view === 'p';
        const L = plat ? L0 / g : L0;
        // times (in the viewed frame) at which the flash and the ball reach the front wall
        let X0, tF, tB, tEnd;
        if (plat) {
          X0 = 24; tF = L / (CD * (1 - v)); tB = L / (CD * (w - v));
          const tEdge = v > 0 ? (W0 - 24 - X0 - L) / (v * CD) : 1e9;
          tEnd = Math.min(Math.max(tF, tB) + 1.2, tEdge, 16);
        } else { X0 = (W0 - L0) / 2; tF = L0 / CD; tB = L0 / (u * CD); tEnd = Math.min(Math.max(tF, tB) + 1.2, 16); }
        if (t > tEnd + 0.6) t = 0;
        const tt = Math.min(t, tEnd);
        const rear = plat ? X0 + v * CD * tt : X0, front = rear + L;
        const flashX = plat ? Math.min(X0 + CD * tt, front) : Math.min(X0 + CD * tt, front);
        const ballX = plat ? Math.min(X0 + w * CD * tt, front) : Math.min(X0 + u * CD * tt, front);
        ro.set('g', g.toFixed(3));
        ro.set('w', w.toFixed(4) + ' c');
        ro.set('gal', (u + v).toFixed(3) + ' c' + (u + v > 1 ? ' (faster than light!)' : ''));
        ro.set('fl', '1 c (Galileo: ' + (1 + v).toFixed(2) + ' c)');
        ro.set('msg', plat ? 'Platform view: the carriage is ' + (100 / g).toFixed(0) + ' % of its rest length.' : 'Carriage view: ball at u, flash at c — as in a carriage at rest.');

        const c = st.begin(), C = kit.colors(), F = fit(c, st, W0, H0);
        // the platform, with posts every 80 px of its own length
        c.fillStyle = C.surface2 || C.faint; c.fillRect(0, GY + 12, W0, 16);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, GY + 12); c.lineTo(W0, GY + 12); c.stroke();
        const sp = plat ? 80 : 80 / g, shift = plat ? 0 : ((-v * CD * tt) % sp + sp) % sp;
        for (let k = -1; k * sp + shift < W0 + sp; k++) {
          const x = k * sp + shift; if (x < -5 || x > W0 + 5) continue;
          c.strokeStyle = C.faint; c.lineWidth = 2; c.beginPath(); c.moveTo(x, GY + 12); c.lineTo(x, GY - 58); c.stroke();
          c.fillStyle = C.faint; c.fillRect(x - 5, GY - 64, 10, 6);
        }
        // the carriage (shortened when seen moving)
        c.fillStyle = C.bg || C.bg2; c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.rect(rear, GY - 84, L, 80); c.fill(); c.stroke();
        c.fillStyle = C.text;
        for (const fx of [0.2, 0.8]) { c.beginPath(); c.ellipse(rear + fx * L, GY + 2, Math.max(1, 9 / (plat ? g : 1)), 9, 0, 0, 6.2832); c.fill(); }
        // Galileo's ghosts (platform view only): the flash at c + v and the ball at u + v
        if (plat && V.ghost) {
          c.setLineDash([4, 3]); c.lineWidth = 1.5;
          const gf = X0 + (1 + v) * CD * tt, gbx = X0 + (u + v) * CD * tt;
          if (gf < front + 40) { c.strokeStyle = 'hsl(48 90% 55%)'; c.beginPath(); c.arc(gf, GY - 60, 8, 0, 6.2832); c.stroke(); txt(c, 'c + v', gf, GY - 74, 'hsl(48 80% 50%)', { align: 'center', size: 11 }); }
          if (gbx < front + 40) { c.strokeStyle = C.series[1]; c.beginPath(); c.arc(gbx, GY - 26, 8, 0, 6.2832); c.stroke(); txt(c, 'u + v', gbx, GY - 40, C.series[1], { align: 'center', size: 11 }); }
          c.setLineDash([]);
        }
        // the flash and the ball
        const hitF = flashX >= front - 0.01, hitB = ballX >= front - 0.01;
        glow(c, flashX, GY - 60, hitF ? 7 : 5, 50, 1);
        c.fillStyle = C.series[1]; c.beginPath(); c.arc(ballX, GY - 26, 7, 0, 6.2832); c.fill();
        txt(c, 'flash', Math.max(rear + 6, flashX - 44), GY - 60, C.muted, { size: 11 });
        txt(c, 'ball', Math.max(rear + 6, ballX - 38), GY - 26, C.muted, { size: 11 });
        // velocity arrows over the scene
        if (plat && v > 0) { kit.arrow(c, rear + L / 2 - 30, GY - 100, rear + L / 2 - 30 + 60 * v / 0.8 + 6, GY - 100, C.accent, 2); txt(c, 'v = ' + v.toFixed(2) + 'c', rear + L / 2 + 40, GY - 100, C.accent, { size: 11 }); }
        if (!plat && v > 0) { kit.arrow(c, 90, GY + 44, 90 - 60 * v / 0.8 - 6, GY + 44, C.accent, 2); txt(c, 'platform moves at −v', 100, GY + 44, C.accent, { size: 11 }); }
        txt(c, plat ? 'Seen from the platform' : 'Seen from inside the carriage', 12, 16, C.text, { weight: 600, size: 13 });
        txt(c, 'in this frame the flash reaches the front after ' + (tF * CD / L0).toFixed(2) + ' L₀/c, the ball after ' + (tB * CD / L0).toFixed(2) + ' L₀/c', 12, 36, C.muted, { size: 11 });
        if (hitF) txt(c, 'flash arrived', front + 6, GY - 60, 'hsl(48 80% 50%)', { size: 11 });
        if (hitB) txt(c, 'ball arrived', front + 6, GY - 26, C.series[1], { size: 11 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rel-michelson */
  Hyper.sim('rel-michelson', {
    title: 'Michelson and Morley: racing two beams',
    blurb: `The interferometer seen from above, in the ether picture. A beam splitter sends two pulses off together, one along each arm; they bounce off the mirrors, meet again and go to the eyepiece. The ether wind (exaggerated in the drawing) slows the pulse that runs along it more than the pulse that runs across. The eyepiece shows the interference fringes with the real 1887 numbers — arms of 11 m, light of 500 nm, and the Earth's 30 km/s — and the graph shows how far the ether theory says they should drift as the apparatus turns.

**Try this**
- Send pulses with arm 1 pointing along the wind (0°): the arm-1 pulse comes back late. Turn to 90°: now arm 2 loses.
- Press *Rotate*: in the ether theory the fringes swing by about 0.4 of a fringe every quarter turn. Michelson and Morley saw less than about 0.02.
- Tick *contract the moving arms*: arm 1 shrinks along the wind by $\\sqrt{1-v^2/c^2}$ and the two pulses now return together at every angle — the FitzGerald–Lorentz way out, which Einstein explained with the [[lorentz-transformation-feyn|Lorentz transformation]].
- Halve the Earth's speed: the drift falls to a quarter — the effect goes as $u^2$.`,
    mount(box, kit) {
      const W0 = 640, H0 = 340, LA = 118, CD = 100, SX = 196, SY = 178, LAM = 500e-9;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = plotBox(box);
      let t = 0, spin = false, done = null;
      const ctl = kit.controls(box.side, [
        { id: 'ang', label: 'Angle of arm 1 to the ether wind', min: 0, max: 360, step: 1, value: 0, unit: '°' },
        { id: 'beta', label: 'Ether wind in the drawing (exaggerated)', min: 0, max: 0.7, step: 0.01, value: 0.45, unit: 'c' },
        { id: 'u', label: 'Earth\'s speed through the ether (for the fringes)', min: 0, max: 60, step: 1, value: 30, unit: 'km/s' },
        { id: 'L', label: 'Effective arm length (for the fringes)', min: 1, max: 30, step: 0.5, value: 11, unit: 'm' },
        { id: 'con', type: 'check', label: 'Contract the moving arms (FitzGerald–Lorentz)', value: false },
        { type: 'buttons', items: [{ id: 'rot', label: 'Rotate / stop', primary: true }, { id: 'send', label: 'Send pulses' }] }
      ], id => { if (id === 'rot') spin = !spin; if (id !== 'rot' && id !== 'ang' && id !== 'u' && id !== 'L') { t = 0; done = null; } if (id !== 'rot' && id !== 'send') curve(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t1', 'Round trip, arm 1 (drawn wind)'], ['t2', 'Round trip, arm 2 (drawn wind)'], ['dt', 'Arm 1 minus arm 2'], ['N', 'Fringe position now (real numbers)'], ['sw', 'Expected drift, 0° → 90°'], ['obs', 'Seen in 1887']]);
      const plot = kit.plot(gb, { x: { label: 'angle of arm 1 to the wind (°)', min: 0, max: 360 }, y: { label: 'fringe position (fringes)', min: -0.6, max: 0.6 }, legend: true }, 160);
      const amp = () => V.L / LAM * Math.pow(V.u * 1000 / C_SI, 2);           // half the 90° swing: (L/λ)(u/c)²
      const fringe = deg => V.con ? 0 : amp() * Math.cos(2 * deg * Math.PI / 180);
      function curve() {
        const E = [], O = [];
        for (let a = 0; a <= 360; a += 3) { E.push([a, Math.max(-0.6, Math.min(0.6, amp() * Math.cos(2 * a * Math.PI / 180)))]); O.push([a, 0]); }
        plot.set({ series: [{ pts: E, label: 'ether theory, rigid arms', width: 2 }, { pts: O, label: 'observed (and with contraction)', dash: [5, 4], width: 2 }], marks: [{ x: V.ang, y: Math.max(-0.6, Math.min(0.6, fringe(V.ang))), label: 'now' }] });
      }
      curve();
      // light speed along the unit direction m in the apparatus frame, the ether flowing at +b along x (c = 1)
      const sAlong = (m, b) => b * m[0] + Math.sqrt(Math.max(0, 1 - b * b + b * b * m[0] * m[0]));
      function geom() {
        const b = V.beta, g = gammaOf(b), th = V.ang * Math.PI / 180;
        const arms = [[Math.cos(th), Math.sin(th)], [-Math.sin(th), Math.cos(th)]].map(n => {
          const rx = V.con ? n[0] / g : n[0], ry = n[1], l = Math.hypot(rx, ry), m = [rx / l, ry / l];
          const so = sAlong(m, b), sb = sAlong([-m[0], -m[1]], b);
          return { r: [rx, ry], l, m, so, sb, tOut: l / so, T: l / so + l / sb };
        });
        const md = [-arms[1].m[0], -arms[1].m[1]], ld = 0.62 * arms[1].l, sd = sAlong(md, b);
        return { b, arms, md, ld, sd };
      }
      const P = (x, y) => [SX + LA * x, SY - LA * y];
      const loop = kit.loop(dt => {
        if (spin) { let a = V.ang + 14 * dt; if (a >= 360) a -= 360; ctl.set('ang', Math.round(a * 10) / 10); curve(); }
        t += dt;
        const G = geom(), tau = t * CD / LA;                       // time in units of L/c
        const arrive = G.arms.map(a => a.T + G.ld / G.sd);
        if (tau > Math.max(arrive[0], arrive[1]) + 1.6) { t = 0; done = null; }
        ro.set('t1', G.arms[0].T.toFixed(3) + ' L/c'); ro.set('t2', G.arms[1].T.toFixed(3) + ' L/c');
        const d = G.arms[0].T - G.arms[1].T;
        ro.set('dt', (Math.abs(d) < 5e-4 ? '0.000' : d.toFixed(3)) + ' L/c' + (Math.abs(d) < 5e-4 ? ' — a tie' : d > 0 ? ' — arm 2 wins' : ' — arm 1 wins'));
        const N = fringe(V.ang);
        ro.set('N', (Math.abs(N) < 5e-4 ? '0.000' : N.toFixed(3)) + ' fringe');
        ro.set('sw', V.con ? '0 (the contraction cancels it)' : (2 * amp()).toFixed(3) + ' fringe');
        ro.set('obs', 'less than about 0.02 fringe');

        const c = st.begin(), C = kit.colors(), F = fit(c, st, W0, H0);
        // the ether wind: streaks drifting to the right
        c.strokeStyle = C.faint; c.lineWidth = 1.2;
        for (let k = 0; k < 9; k++) {
          const y = 30 + k * 34, x0 = ((k * 53 + t * 140 * V.beta) % 380) - 20;
          c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + 18, y); c.stroke();
        }
        if (V.beta > 0) { kit.arrow(c, 16, 14, 16 + 40 + 60 * V.beta, 14, C.muted, 1.6); txt(c, 'ether wind (drawn at ' + V.beta.toFixed(2) + 'c)', 24 + 50 + 60 * V.beta, 14, C.muted, { size: 11 }); }
        // beams, mirrors, splitter, source and eyepiece
        const S = P(0, 0), a1 = G.arms[0], a2 = G.arms[1];
        const M1 = P(a1.r[0], a1.r[1]), M2 = P(a2.r[0], a2.r[1]), D = P(G.md[0] * G.ld, G.md[1] * G.ld), SRC = P(-a1.r[0] * 0.62, -a1.r[1] * 0.62);
        c.strokeStyle = C.grid; c.lineWidth = 5;
        for (const [A, B] of [[SRC, S], [S, M1], [S, M2], [S, D]]) { c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.stroke(); }
        c.strokeStyle = 'hsl(48 90% 55% / .55)'; c.lineWidth = 1.4;
        for (const [A, B] of [[SRC, S], [S, M1], [S, M2], [S, D]]) { c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.stroke(); }
        const mirror = (M, m, col) => { const px = -m[1], py = m[0]; c.strokeStyle = col; c.lineWidth = 5; c.beginPath(); c.moveTo(M[0] - 14 * px, M[1] + 14 * py); c.lineTo(M[0] + 14 * px, M[1] - 14 * py); c.stroke(); };
        mirror(M1, a1.m, C.series[0]); mirror(M2, a2.m, C.series[1]);
        const bx = a1.m[0] + a2.m[0], by = a1.m[1] + a2.m[1], bl = Math.hypot(bx, by) || 1;
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(S[0] - 16 * bx / bl, S[1] + 16 * by / bl); c.lineTo(S[0] + 16 * bx / bl, S[1] - 16 * by / bl); c.stroke();
        c.fillStyle = C.muted; c.beginPath(); c.arc(SRC[0], SRC[1], 8, 0, 6.2832); c.fill();
        c.fillStyle = C.text; c.beginPath(); c.arc(D[0], D[1], 7, 0, 6.2832); c.fill();
        txt(c, 'source', SRC[0], SRC[1] + 18, C.muted, { align: 'center', size: 11 });
        txt(c, 'eyepiece', D[0], D[1] + 18, C.muted, { align: 'center', size: 11 });
        txt(c, 'arm 1', M1[0] + 18 * a1.m[0], M1[1] - 18 * a1.m[1], C.series[0], { align: 'center', size: 11, weight: 600 });
        txt(c, 'arm 2', M2[0] + 18 * a2.m[0], M2[1] - 18 * a2.m[1], C.series[1], { align: 'center', size: 11, weight: 600 });
        // the two pulses
        G.arms.forEach((a, i) => {
          let x, y;
          if (tau < a.tOut) { x = a.m[0] * a.so * tau; y = a.m[1] * a.so * tau; }
          else if (tau < a.T) { const q = a.l - a.sb * (tau - a.tOut); x = a.m[0] * q; y = a.m[1] * q; }
          else { const q = Math.min(G.ld, G.sd * (tau - a.T)); x = G.md[0] * q; y = G.md[1] * q; }
          const p = P(x, y), hue = i ? 28 : 205;
          glow(c, p[0] + (i ? 3 : -3), p[1], 5, hue, 1);
        });
        const first = arrive[0] < arrive[1] - 1e-3 ? 1 : arrive[1] < arrive[0] - 1e-3 ? 2 : 0;
        if (tau > Math.max(arrive[0], arrive[1])) txt(c, first ? 'arm ' + first + ' pulse arrived first, by ' + Math.abs(arrive[0] - arrive[1]).toFixed(2) + ' L/c' : 'both pulses arrived together', 16, H0 - 14, C.text, { size: 12, weight: 600 });
        // the eyepiece view: fringes with the real numbers
        const EX = 520, EY = 128, ER = 84, fs = 42;
        c.save(); c.beginPath(); c.arc(EX, EY, ER, 0, 6.2832); c.clip();
        for (let x = -ER; x < ER; x += 2) { const I = 0.5 + 0.5 * Math.cos(2 * Math.PI * (x / fs - N)); c.fillStyle = 'hsl(48 90% ' + (8 + 58 * I) + '%)'; c.fillRect(EX + x, EY - ER, 2.4, 2 * ER); }
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(EX, EY, ER, 0, 6.2832); c.stroke();
        c.strokeStyle = C.bad; c.lineWidth = 1.5; c.beginPath(); c.moveTo(EX, EY - ER); c.lineTo(EX, EY + ER); c.stroke();
        txt(c, 'eyepiece (real numbers)', EX, EY + ER + 16, C.muted, { align: 'center', size: 11 });
        txt(c, 'fringe position ' + (Math.abs(N) < 5e-4 ? '0.000' : N.toFixed(3)), EX, EY + ER + 34, C.text, { align: 'center', size: 12, weight: 600 });
        txt(c, V.con ? 'arms contracted: no drift' : 'ether theory: drifts as it turns', EX, EY + ER + 52, V.con ? C.ok : C.warn, { align: 'center', size: 11 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rel-lorentz-grid */
  // natural units in the drawing: 1 unit of x is the distance light goes in 1 µs (299.79 m), 1 unit of ct is 1 µs
  const US = 1e-6 * C_SI;
  Hyper.sim('rel-lorentz-grid', {
    title: 'The Lorentz transformation as a squeezed grid',
    blurb: `A space-time diagram: position $x$ across, time $ct$ up, one square = 1 µs of time or 300 m of distance, so light moves along the 45° lines. The grey grid belongs to the platform. The coloured grid belongs to an observer moving at speed $v$: its lines are the places where $x'$ or $t'$ is a whole number. The dot is an event you can drag.

**Try this**
- Move the speed slider: the moving time axis ($x' = 0$) and space axis ($t' = 0$) close towards the light line like the blades of scissors. The light lines never move — both observers measure the same speed of light.
- Drag the event and compare $(x, t)$ with $(x', t')$: follow the coloured grid lines through the dot to read the primed values.
- Tick *show the hyperbolas*: the unit marks on the moving axes slide along the curves $(ct)^2 - x^2 = \\pm 1$. That is why the moving grid squares look stretched — the [[?invariant]] $(ct)^2 - x^2$ is what stays fixed.
- Tick *Galileo instead*: only the time axis tilts, and the light lines are no longer where the moving grid says light should go.`,
    mount(box, kit) {
      const Q = kit.qm, W0 = 640, H0 = 400, S = 70, OX = 320, OY = 205;   // S: pixels per unit
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      let ev = { x: 1.5, t: 1.0 }, sweep = null, FT = null;
      const ctl = kit.controls(box.side, [
        { id: 'b', label: 'Speed of the moving observer v', min: -0.9, max: 0.9, step: 0.01, value: 0.5, unit: 'c' },
        { id: 'hyp', type: 'check', label: 'Show the hyperbolas (ct)² − x² = ±1', value: true },
        { id: 'gal', type: 'check', label: 'Galileo instead (t′ = t)', value: false },
        { type: 'buttons', items: [{ id: 'sweep', label: 'Sweep the speed', primary: true }, { id: 'reset', label: 'Reset the event' }] }
      ], id => { if (id === 'sweep') sweep = sweep == null ? 0 : null; if (id === 'reset') ev = { x: 1.5, t: 1.0 }; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['g', 'γ'], ['e', 'Event, platform (x, t)'], ['ep', 'Event, moving frame (x′, t′)'], ['s', '(ct)² − x², both frames'], ['k', 'Kind of separation from the origin']]);
      const toPx = (x, t) => [OX + S * x, OY - S * t];
      kit.drag(st, {
        hit: p => { if (!FT) return null; const q = FT.to(p), e = toPx(ev.x, ev.t); return Math.hypot(q.x - e[0], q.y - e[1]) < 16 ? 'ev' : null; },
        move: (k, p) => { const q = FT.to(p); ev = { x: clamp((q.x - OX) / S, -4.3, 4.3), t: clamp((OY - q.y) / S, -2.7, 2.7) }; },
        hover: true
      });
      const loop = kit.loop(dt => {
        if (sweep != null) { sweep += dt; ctl.set('b', Math.round(88 * Math.sin(sweep * 0.9)) / 100); }
        const b = V.b, gal = V.gal, L = Q.lorentz(b), g = L.gamma;
        // inverse maps (moving → platform) for drawing the moving grid
        const inv = gal ? ((xp, tp) => [xp + b * tp, tp]) : ((xp, tp) => [g * (xp + b * tp), g * (tp + b * xp)]);
        const xp = gal ? ev.x - b * ev.t : L.x(ev.x, ev.t), tp = gal ? ev.t : L.t(ev.x, ev.t);
        const s2 = Q.interval(ev.t, ev.x), s2p = Q.interval(tp, xp);
        ro.set('g', gal ? '1 (Galileo)' : g.toFixed(4));
        ro.set('e', (ev.x * US).toFixed(0) + ' m, ' + ev.t.toFixed(3) + ' µs');
        ro.set('ep', (xp * US).toFixed(0) + ' m, ' + tp.toFixed(3) + ' µs');
        ro.set('s', (s2 * US * US).toFixed(0) + ' m²  |  ' + (s2p * US * US).toFixed(0) + ' m²' + (gal && Math.abs(s2 - s2p) > 1e-6 ? '  (Galileo: not equal!)' : ''));
        ro.set('k', Math.abs(s2) < 0.02 ? 'light-like: a light ray could join them' : s2 > 0 ? 'time-like: every observer agrees on the order' : 'space-like: the order depends on the observer');

        const c = st.begin(), C = kit.colors();
        FT = fit(c, st, W0, H0);
        c.save(); c.beginPath(); c.rect(0, 0, W0, H0); c.clip();
        // platform grid and axes
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let k = -5; k <= 5; k++) { const a = toPx(k, -3), b2 = toPx(k, 3); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b2[0], b2[1]); c.stroke(); }
        for (let k = -3; k <= 3; k++) { const a = toPx(-5, k), b2 = toPx(5, k); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b2[0], b2[1]); c.stroke(); }
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(0, OY); c.lineTo(W0, OY); c.moveTo(OX, 0); c.lineTo(OX, H0); c.stroke();
        // hyperbolas (ct)² − x² = ±1
        if (V.hyp) {
          c.strokeStyle = C.series[5]; c.lineWidth = 1.2; c.setLineDash([3, 3]);
          for (const [sx, sy, swap] of [[1, 1, 0], [1, -1, 0], [1, 1, 1], [-1, 1, 1]]) {
            c.beginPath();
            for (let i = 0; i <= 60; i++) { const eta = -2 + 4 * i / 60, a = Math.sinh(eta), h = Math.cosh(eta); const p = swap ? toPx(sx * h, a) : toPx(a, sy * h); if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }
            c.stroke();
          }
          c.setLineDash([]);
        }
        // the moving grid
        const col = C.accent;
        c.strokeStyle = col; c.globalAlpha = 0.35; c.lineWidth = 1;
        for (let k = -8; k <= 8; k++) {
          const a = inv(k, -8), b2 = inv(k, 8), p1 = toPx(a[0], a[1]), p2 = toPx(b2[0], b2[1]);
          c.beginPath(); c.moveTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]); c.stroke();
          const d = inv(-8, k), e2 = inv(8, k), q1 = toPx(d[0], d[1]), q2 = toPx(e2[0], e2[1]);
          c.beginPath(); c.moveTo(q1[0], q1[1]); c.lineTo(q2[0], q2[1]); c.stroke();
        }
        c.globalAlpha = 1; c.lineWidth = 2.4;
        { const a = inv(0, -8), b2 = inv(0, 8), p1 = toPx(a[0], a[1]), p2 = toPx(b2[0], b2[1]); c.beginPath(); c.moveTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]); c.stroke(); }
        { const a = inv(-8, 0), b2 = inv(8, 0), p1 = toPx(a[0], a[1]), p2 = toPx(b2[0], b2[1]); c.beginPath(); c.moveTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]); c.stroke(); }
        for (let k = -4; k <= 4; k++) { if (!k) continue; const a = inv(0, k), b2 = inv(k, 0), p1 = toPx(a[0], a[1]), p2 = toPx(b2[0], b2[1]); kit.dot(c, p1[0], p1[1], 3, col); kit.dot(c, p2[0], p2[1], 3, col); }
        // light lines
        c.strokeStyle = 'hsl(48 95% 52%)'; c.lineWidth = 2; c.setLineDash([7, 5]);
        c.beginPath(); { const a = toPx(-4, -4), b2 = toPx(4, 4); c.moveTo(a[0], a[1]); c.lineTo(b2[0], b2[1]); } { const a = toPx(4, -4), b2 = toPx(-4, 4); c.moveTo(a[0], a[1]); c.lineTo(b2[0], b2[1]); } c.stroke();
        c.setLineDash([]);
        // the event and the lines that read its coordinates in each frame
        const E = toPx(ev.x, ev.t);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([2, 3]);
        c.beginPath(); c.moveTo(E[0], E[1]); c.lineTo(E[0], OY); c.moveTo(E[0], E[1]); c.lineTo(OX, E[1]); c.stroke();
        c.strokeStyle = col; c.lineWidth = 1.3; c.setLineDash([5, 3]);
        { const a = inv(xp, 0), b2 = inv(0, tp), p1 = toPx(a[0], a[1]), p2 = toPx(b2[0], b2[1]); c.beginPath(); c.moveTo(E[0], E[1]); c.lineTo(p1[0], p1[1]); c.moveTo(E[0], E[1]); c.lineTo(p2[0], p2[1]); c.stroke(); kit.dot(c, p1[0], p1[1], 3.5, col); kit.dot(c, p2[0], p2[1], 3.5, col); }
        c.setLineDash([]);
        kit.dot(c, E[0], E[1], 7, C.bad, C.text);
        c.restore();
        // labels
        txt(c, 'x', W0 - 12, OY - 10, C.muted, { size: 12, weight: 600 });
        txt(c, 'ct', OX + 8, 12, C.muted, { size: 12, weight: 600 });
        { const a = inv(0, 2.55), p = toPx(a[0], a[1]); txt(c, "ct′", clamp(p[0] + 8, 10, W0 - 30), clamp(p[1], 12, H0 - 12), col, { size: 13, weight: 700 }); }
        { const a = inv(3.9, 0), p = toPx(a[0], a[1]); txt(c, "x′", clamp(p[0], 10, W0 - 20), clamp(p[1] - 12, 12, H0 - 12), col, { size: 13, weight: 700 }); }
        txt(c, 'light', toPx(2.6, 2.6)[0] + 8, toPx(2.6, 2.6)[1], 'hsl(48 90% 45%)', { size: 11 });
        txt(c, 'event (' + (ev.x * US).toFixed(0) + ' m, ' + ev.t.toFixed(2) + ' µs)', clamp(E[0] + 10, 4, W0 - 170), clamp(E[1] - 14, 10, H0 - 10), C.text, { size: 11, weight: 600 });
        txt(c, 'v = ' + b.toFixed(2) + 'c' + (gal ? '  (Galileo)' : '  γ = ' + g.toFixed(3)), 10, H0 - 12, C.text, { size: 12, weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rel-lightning */
  Hyper.sim('rel-lightning', {
    title: 'Lightning at both ends of a train',
    blurb: `Lightning strikes both ends of a moving train, leaving marks A and B on the platform. Pat stands on the platform halfway between the marks; Tom sits in the middle of the train. The top shows the scene in slow motion, as measured in the frame you choose; the bottom is the space-time diagram of the same frame (time upwards), with the strikes as stars, their light as 45° lines, and the current moment as a horizontal line. The train is 300 m long at rest; 1 unit of time on the diagram is 1 µs.

**Try this**
- *Platform frame*: the two strikes happen at the same moment and Pat sees them together. Tom, carried towards B, meets the light from the front first.
- *Train frame*: the front strike happens first. Tom, at rest in the middle, meets the front flash first because it set out earlier; Pat, carried backwards, runs into the rear flash just in time to see both together. Who sees what is the same in both frames — only the timing of the strikes differs.
- Watch the dashed line through the strikes: it is the *other* frame's line of "now". Increase the speed: it tilts more, and the time between the strikes (in the train frame) grows as $vL_0/c^2$.`,
    mount(box, kit) {
      const Q = kit.qm, W0 = 640, H0 = 480, SC = 140, TY = 88, DY0 = 176, DY1 = 470, TMIN = -0.5, TMAX = 1.64;   // SC: px per unit (unit = 300 m or 1.0007 µs)
      const UT = 300 / C_SI * 1e6;     // µs per unit of time
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 320, maxH: 620 });
      let tau = null, playing = true;
      const ctl = kit.controls(box.side, [
        { id: 'frame', type: 'select', label: 'Measure in the frame of', options: [['the platform (Pat)', 'S'], ['the train (Tom)', 'T']], value: 'S' },
        { id: 'b', label: 'Speed of the train v', min: 0.1, max: 0.8, step: 0.01, value: 0.6, unit: 'c' },
        { type: 'buttons', items: [{ id: 'play', label: 'Play / pause', primary: true }, { id: 'again', label: 'Start again' }] }
      ], id => { if (id === 'play') playing = !playing; else tau = null; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['g', 'γ'], ['dt', 'Strikes, in this frame'], ['tom', 'Tom (middle of the train)'], ['pat', 'Pat (middle of the platform)'], ['now', 'Time now (this frame)']]);
      const loop = kit.loop(dt => {
        const b = V.b, g = gammaOf(b), L = 1 / g, train = V.frame === 'T', LT = Q.lorentz(b);
        const toF = (x, t) => train ? [LT.x(x, t), LT.t(x, t)] : [x, t];
        const velF = u => train ? Q.addVelocity(u, -b) : u;
        // objects: [x at t = 0 in the platform frame, velocity in the platform frame]
        const O = { rear: [-L / 2, b], front: [L / 2, b], tom: [0, b], A: [-L / 2, 0], B: [L / 2, 0], pat: [0, 0] };
        const pos = (k, T) => { const [x0, u] = O[k], e = toF(x0, 0); return e[0] + velF(u) * (T - e[1]); };
        const EA = toF(-L / 2, 0), EB = toF(L / 2, 0);
        const rx = [toF(b * L / (2 * (1 + b)), L / (2 * (1 + b))), toF(b * L / (2 * (1 - b)), L / (2 * (1 - b))), toF(0, L / 2)];   // Tom meets B's light, Tom meets A's light, Pat meets both
        const t0 = Math.min(EA[1], EB[1]) - 0.25, t1 = Math.max(rx[0][1], rx[1][1], rx[2][1]) + 0.3;
        if (tau == null || tau < t0) tau = t0;
        if (playing) { tau += dt * 0.3; if (tau > t1 + 0.4) tau = t0; }
        const T = Math.min(tau, t1), XC = train ? 390 : 250;
        const X = x => XC + SC * x, Yd = t => DY1 - (t - TMIN) / (TMAX - TMIN) * (DY1 - DY0);
        const dAB = EA[1] - EB[1];
        ro.set('g', g.toFixed(3));
        ro.set('dt', Math.abs(dAB) < 1e-9 ? 'simultaneous' : 'front (B) first, by ' + (dAB * UT).toFixed(3) + ' µs');
        ro.set('tom', 'front flash first; the rear one ' + ((rx[1][1] - rx[0][1]) * UT).toFixed(3) + ' µs later');
        ro.set('pat', 'both flashes together');
        ro.set('now', (T * UT).toFixed(3) + ' µs');

        const c = st.begin(), C = kit.colors(), F = fit(c, st, W0, H0);
        const yel = 'hsl(48 95% 52%)', hitA = T >= EA[1], hitB = T >= EB[1];
        // ---- the scene
        c.fillStyle = C.surface2 || C.faint; c.fillRect(0, TY + 34, W0, 12);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, TY + 34); c.lineTo(W0, TY + 34); c.stroke();
        for (const k of ['A', 'B']) {
          const x = X(pos(k, T)), hit = k === 'A' ? hitA : hitB;
          c.fillStyle = hit ? C.bad : C.faint; c.beginPath(); c.arc(x, TY + 40, hit ? 6 : 3, 0, 6.2832); c.fill();
          txt(c, k, x, TY + 60, C.text, { align: 'center', size: 12, weight: 700 });
        }
        const r = X(pos('rear', T)), f = X(pos('front', T));
        c.fillStyle = C.bg || C.bg2; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.rect(r, TY - 22, f - r, 44); c.fill(); c.stroke();
        c.fillStyle = C.text; for (const fx of [0.15, 0.85]) { c.beginPath(); c.arc(r + fx * (f - r), TY + 26, 5, 0, 6.2832); c.fill(); }
        const person = (x, y, col, name, lit) => { if (lit) glow(c, x, y - 4, 7, 48, 0.8); c.fillStyle = col; c.beginPath(); c.arc(x, y - 10, 5, 0, 6.2832); c.fill(); c.fillRect(x - 3, y - 5, 6, 12); txt(c, name, x, y + 16, col, { align: 'center', size: 11, weight: 600 }); };
        const near = (xr, tr) => T >= tr && T - tr < 0.12;
        person(X(pos('tom', T)), TY, C.series[0], 'Tom', near(0, rx[0][1]) || near(0, rx[1][1]));
        person(X(pos('pat', T)), TY + 66, C.series[1], 'Pat', near(0, rx[2][1]));
        // lightning bolts and the light fronts
        for (const [E, hit] of [[EA, hitA], [EB, hitB]]) {
          if (!hit) continue;
          const age = T - E[1], x = X(E[0]);
          if (age < 0.12) { c.strokeStyle = yel; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 6, 0); c.lineTo(x + 5, TY - 40); c.lineTo(x - 4, TY - 36); c.lineTo(x + 2, TY + 34); c.stroke(); }
          for (const s of [-1, 1]) { const xf = X(E[0] + s * age); if (xf > -10 && xf < W0 + 10) glow(c, xf, TY + 30, 4, 48, 0.95); }
        }
        txt(c, train ? 'Train frame: the train is at rest, the platform slides backwards' : 'Platform frame: the train moves at v = ' + b.toFixed(2) + 'c', 10, 12, C.text, { size: 12, weight: 600 });
        // ---- the space-time diagram of this frame
        c.save(); c.beginPath(); c.rect(0, DY0, W0, DY1 - DY0); c.clip();
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(X(k), DY0); c.lineTo(X(k), DY1); c.stroke(); }
        for (let k = -1; k <= 2; k++) { c.beginPath(); c.moveTo(0, Yd(k)); c.lineTo(W0, Yd(k)); c.stroke(); }
        const wl = (k, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(X(pos(k, TMIN)), Yd(TMIN)); c.lineTo(X(pos(k, TMAX)), Yd(TMAX)); c.stroke(); };
        wl('rear', C.muted, 1.4); wl('front', C.muted, 1.4); wl('A', C.faint, 1.2); wl('B', C.faint, 1.2); wl('tom', C.series[0], 2.4); wl('pat', C.series[1], 2.4);
        // light rays from the strikes to the observers who meet them
        c.strokeStyle = yel; c.lineWidth = 1.8;
        const ray = (E, R) => { c.beginPath(); c.moveTo(X(E[0]), Yd(E[1])); c.lineTo(X(R[0]), Yd(R[1])); c.stroke(); };
        ray(EB, rx[0]); ray(EA, rx[1]); ray(EA, rx[2]); ray(EB, rx[2]);
        // the other frame's line of "now" through the strikes
        const sl = train ? -b : b;   // slope d(ct)/dx of the other frame's simultaneity lines, drawn in this frame
        c.strokeStyle = C.accent; c.lineWidth = 1.4; c.setLineDash([6, 4]);
        c.beginPath(); c.moveTo(X(-3), Yd(EB[1] + sl * (-3 - EB[0]))); c.lineTo(X(3), Yd(EB[1] + sl * (3 - EB[0]))); c.stroke();
        c.setLineDash([]);
        // now
        c.strokeStyle = C.text; c.lineWidth = 1; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(0, Yd(T)); c.lineTo(W0, Yd(T)); c.stroke(); c.setLineDash([]);
        const star = (E, lab) => { const x = X(E[0]), y = Yd(E[1]); c.fillStyle = yel; c.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? 3.5 : 9; c.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); } c.closePath(); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1; c.stroke(); txt(c, lab, x + 10, y - 10, C.text, { size: 11, weight: 700 }); };
        star(EA, 'strike A'); star(EB, 'strike B');
        for (const R of rx) kit.dot(c, X(R[0]), Yd(R[1]), 3.5, C.text);
        c.restore();
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(0.5, DY0, W0 - 1, DY1 - DY0);
        txt(c, 'space-time diagram of this frame (time up)', 8, DY0 + 12, C.muted, { size: 11 });
        txt(c, 'dashed: the ' + (train ? 'platform\'s' : 'train\'s') + ' line of "now" through B', 8, DY0 + 28, C.accent, { size: 11 });
        txt(c, 'Tom', X(pos('tom', TMAX - 0.12)) + 6, Yd(TMAX - 0.12), C.series[0], { size: 11, weight: 600 });
        txt(c, 'Pat', X(pos('pat', TMAX - 0.12)) + 6, Yd(TMAX - 0.12), C.series[1], { size: 11, weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rel-light-clock */
  Hyper.sim('rel-light-clock', {
    title: 'Light clocks on a platform and on a train',
    blurb: `Two identical light clocks: a pulse of light bounces between two mirrors 1.5 m apart, and each round trip is one tick (10 ns at rest — shown here in extreme slow motion). One clock stands on the platform, the other rides a train. Seen from the platform, the train's pulse runs along a zigzag: a longer path at the same speed $c$, so each tick takes longer — by the [[?lorentz-factor]] $\\gamma$.

**Try this**
- Set the speed to 0.6c and count: the train's clock makes 4 ticks while the platform's makes 5 ($\\gamma = 1.25$).
- Look at the triangle drawn on the zigzag: $(ct/2)^2 = d^2 + (vt/2)^2$ — Pythagoras is the whole derivation.
- Switch to *the train's view*: now the platform clock zigzags and runs slow. Each observer finds the other's clock slow; nothing is contradictory, because they disagree about which distant events are simultaneous.
- Push the speed to 0.95c: the pulse crawls upwards as it races sideways, and $\\gamma = 3.2$.`,
    mount(box, kit) {
      const W0 = 640, H0 = 330, D = 96, CD = 110, XR = 110, LANE = [44, 196];   // D: mirror gap (px); CD: light speed drawn (px/s)
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = plotBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'v', label: 'Speed of the train v', min: 0, max: 0.95, step: 0.01, value: 0.6, unit: 'c' },
        { id: 'view', type: 'select', label: 'Watch from', options: [['the platform', 'p'], ['the train', 't']], value: 'p' },
        { id: 'tri', type: 'check', label: 'Draw the Pythagoras triangle', value: true },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset the counters', primary: true }] }
      ], (id) => { if (id === 'reset' || id === 'view' || id === 'v') reset(); if (id === 'v') curve(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['g', 'γ = 1/√(1 − v²/c²)'], ['n0', 'Ticks of the clock at rest (this view)'], ['n1', 'Ticks of the moving clock'], ['r', 'Ratio'], ['tk', 'One tick of the moving clock']]);
      const plot = kit.plot(gb, { x: { label: 'v/c', min: 0, max: 1 }, y: { label: 'γ', min: 1, max: 5 } }, 140);
      function curve() { const pts = []; for (let i = 0; i <= 200; i++) { const b = i / 200 * 0.985; pts.push([b, gammaOf(b)]); } plot.set({ series: [{ pts, label: 'γ' }], marks: [{ x: V.v, y: gammaOf(V.v), label: 'γ = ' + gammaOf(V.v).toFixed(2) }] }); }
      curve();
      // two clocks: [rest, moving] in the chosen view; y is the pulse height 0..D, dir ±1
      let clocks;
      function reset() { clocks = [0, 1].map(i => ({ x: i ? 40 : XR, y: 0, dir: 1, n: 0, trail: [], lastB: null })); }
      reset();
      const loop = kit.loop(dt => {
        const v = V.v, g = gammaOf(v), vy = CD * Math.sqrt(1 - v * v), n = 4;
        for (let s = 0; s < n; s++) {
          const h = dt / n;
          clocks.forEach((k, i) => {
            const sy = i ? vy : CD;
            if (i) { k.x += v * CD * h; if (k.x > W0 + 30) { k.x = -30; k.trail = []; k.lastB = null; } }
            k.y += k.dir * sy * h;
            if (k.y >= D) { k.y = 2 * D - k.y; k.dir = -1; if (i) k.trail.push([k.x, D]); }
            if (k.y <= 0) { k.y = -k.y; k.dir = 1; k.n++; if (i) { k.trail.push([k.x, 0]); k.lastB = k.x; } }
          });
        }
        const mv = clocks[1];
        if (mv.trail.length > 12) mv.trail.splice(0, mv.trail.length - 12);
        ro.set('g', g.toFixed(3));
        ro.set('n0', String(clocks[0].n)); ro.set('n1', String(clocks[1].n));
        ro.set('r', clocks[0].n ? (clocks[1].n / clocks[0].n).toFixed(3) + '  (1/γ = ' + (1 / g).toFixed(3) + ')' : '—');
        ro.set('tk', (10.0 * g).toFixed(2) + ' ns (10.00 ns at rest)');

        const c = st.begin(), C = kit.colors(), F = fit(c, st, W0, H0);
        const plat = V.view === 'p';
        const lanes = plat ? [['platform clock (at rest)', LANE[0], false], ['train clock (moving at v)', LANE[1], true]] : [['train clock (at rest)', LANE[1], false], ['platform clock (moving at −v)', LANE[0], true]];
        // lane backgrounds: the platform strip and the train carriage
        c.fillStyle = C.surface2 || C.faint; c.fillRect(0, LANE[0] + D + 16, W0, 8);
        txt(c, 'platform', W0 - 8, LANE[0] + D + 34, C.muted, { align: 'right', size: 11 });
        c.fillStyle = C.surface2 || C.faint; c.fillRect(0, LANE[1] + D + 16, W0, 8);
        txt(c, 'train', W0 - 8, LANE[1] + D + 34, C.muted, { align: 'right', size: 11 });
        const mx = x => plat ? x : W0 - x;          // in the train's view the platform clock moves to the left
        lanes.forEach(([name, top, moving], i) => {
          const k = clocks[moving ? 1 : 0], x = moving ? mx(k.x) : XR, yb = top + D + 8, yt = top + 8;
          // the zigzag trail and the triangle
          if (moving && k.trail.length) {
            c.strokeStyle = 'hsl(48 90% 55% / .7)'; c.lineWidth = 1.5; c.beginPath();
            k.trail.forEach((p, j) => { const y = p[1] ? yt : yb; if (j) c.lineTo(mx(p[0]), y); else c.moveTo(mx(p[0]), y); });
            c.lineTo(x, yb - k.y); c.stroke();
            if (V.tri && k.lastB != null && v > 0.05) {
              const half = v * CD * D / vy, x0 = mx(k.lastB), xm = mx(k.lastB + half);
              if (xm < W0 && xm > 0) {
                c.strokeStyle = C.accent; c.lineWidth = 1.2; c.setLineDash([4, 3]);
                c.beginPath(); c.moveTo(x0, yb); c.lineTo(xm, yb); c.lineTo(xm, yt); c.stroke(); c.setLineDash([]);
                txt(c, 'vt/2', (x0 + xm) / 2, yb + 11, C.accent, { align: 'center', size: 10 });
                txt(c, 'd', xm + 6, (yb + yt) / 2, C.accent, { size: 10 });
                txt(c, 'ct/2', (x0 + xm) / 2 - 12, (yb + yt) / 2 - 6, 'hsl(48 80% 45%)', { align: 'right', size: 10 });
              }
            }
          }
          if (!moving) { c.strokeStyle = 'hsl(48 90% 55% / .5)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, yb); c.lineTo(x, yt); c.stroke(); }
          // the clock: two mirrors on a rod
          c.strokeStyle = C.text; c.lineWidth = 4; c.beginPath(); c.moveTo(x - 20, yt - 3); c.lineTo(x + 20, yt - 3); c.moveTo(x - 20, yb + 3); c.lineTo(x + 20, yb + 3); c.stroke();
          c.strokeStyle = C.faint; c.lineWidth = 2; c.beginPath(); c.moveTo(x + 24, yt - 3); c.lineTo(x + 24, yb + 3); c.stroke();
          glow(c, x, yb - k.y, 5, 48, 1);
          txt(c, name + ':  ' + k.n + ' ticks', 10, top - 8, moving ? C.warn : C.ok, { size: 12, weight: 600 });
        });
        txt(c, 'Seen from ' + (plat ? 'the platform' : 'the train') + '  ·  v = ' + v.toFixed(2) + 'c  ·  γ = ' + g.toFixed(3), W0 - 8, 14, C.text, { align: 'right', size: 12, weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rel-muons */
  Hyper.sim('rel-muons', {
    title: 'Muons falling through the atmosphere',
    blurb: `Cosmic rays make muons high in the atmosphere. A muon at rest lives on average 2.197 µs; each one here decays at a random moment (a small burst) with exactly that average. Both columns receive the same muons. On the left their clocks run at the rest rate — Newton's world; on the right they run slow by $\\gamma$ — Einstein's. The graph shows the fraction still alive against the distance fallen, an [[?exponential]] decay whose length scale is $v\\tau$ or $\\gamma v\\tau$.

**Try this**
- At the default 1.67 GeV ($v = 0.998c$, $\\gamma = 15.8$) from 15 km: on the left essentially none arrive; on the right about a quarter do — as measured.
- Lower the energy: $\\gamma$ falls and even Einstein's muons mostly decay on the way.
- Lower the creation height to 2 km (a mountain top above a valley): now some arrive even without time dilation, but far fewer than with it — Frisch and Smith's 1963 experiment.
- Read the muon's-eye view in the read-out: in its own frame the atmosphere is contracted by $\\gamma$, and it lives the normal 2.2 µs. Same count, other story.`,
    mount(box, kit) {
      const Q = kit.qm, W0 = 640, H0 = 400, TOP = 44, GND = 360, TAU = 2.197e-6, MMU = 105.66;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 280 });
      const gb = plotBox(box);
      const R = Q.rng(1941);
      const ctl = kit.controls(box.side, [
        { id: 'E', label: 'Muon energy', min: 0.2, max: 10, value: 1.67, log: true, sig: 3, unit: 'GeV' },
        { id: 'h', label: 'Height where they are made', min: 2, max: 20, step: 0.5, value: 15, unit: 'km' },
        { id: 'rate', label: 'Muons per second (slow motion)', min: 4, max: 60, step: 1, value: 24 },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset the counts', primary: true }] }
      ], id => { reset(); if (id !== 'rate') curve(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['v', 'Speed and γ'], ['nn', 'Newton: arrived / made'], ['ne', 'Einstein: arrived / made'], ['ex', 'Expected: Newton | Einstein'], ['mu', 'In the muon\'s frame']]);
      const plot = kit.plot(gb, { x: { label: 'distance fallen (km)', min: 0 }, y: { label: 'fraction still alive', min: 0, max: 1 }, legend: true }, 150);
      // a decay is counted only when its batch-mates would have reached the ground, so the fractions are not biased
      let mus = [], bursts = [], got = [0, 0], ended = [0, 0], pending = [], acc = 0, now = 0;
      const kin = () => { const g = Math.max(1.0001, V.E * 1000 / MMU), b = Math.sqrt(1 - 1 / (g * g)); return { g, b, lam: b * C_SI * TAU }; };   // lam: vτ in metres
      function reset() { mus = []; bursts = []; got = [0, 0]; ended = [0, 0]; pending = []; acc = 0; }
      function curve() {
        const K = kin(), h = V.h * 1000, N = [], E = [];
        for (let i = 0; i <= 100; i++) { const s = h * i / 100; N.push([s / 1000, Math.exp(-s / K.lam)]); E.push([s / 1000, Math.exp(-s / (K.g * K.lam))]); }
        plot.set({ x: { label: 'distance fallen (km)', min: 0, max: V.h }, series: [{ pts: N, label: 'Newton: e^(−s/vτ)', dash: [5, 4] }, { pts: E, label: 'Einstein: e^(−s/γvτ)', width: 2.2 }] });
      }
      curve();
      const loop = kit.loop(dt => {
        const K = kin(), h = V.h * 1000, fall = h / (K.b * C_SI);   // real fall time (s)
        const k = 5 / fall;                                           // animation seconds per real second: the fall takes 5 s
        acc += dt * V.rate;
        now += dt;
        while (acc >= 1) { acc -= 1; const x = R(); mus.push({ col: 0, x, y: h, alive: true, born: now }); mus.push({ col: 1, x, y: h, alive: true, born: now }); }
        const dReal = dt / k;
        for (const m of mus) {
          if (!m.alive) continue;
          const tauEff = m.col ? K.g * TAU : TAU, step = Math.min(dReal, m.y / (K.b * C_SI));   // decay only while still in the air
          if (R() < 1 - Math.exp(-step / tauEff)) { m.alive = false; pending.push({ col: m.col, at: m.born + 5 }); bursts.push({ col: m.col, x: m.x, y: Math.max(0, m.y - K.b * C_SI * step * R()), t: 0 }); continue; }
          m.y -= K.b * C_SI * dReal;
          if (m.y <= 0) { m.alive = false; got[m.col]++; ended[m.col]++; bursts.push({ col: m.col, x: m.x, y: 0, t: 0, hit: true }); }
        }
        mus = mus.filter(m => m.alive);
        for (const q of pending) if (q.at <= now) ended[q.col]++;
        pending = pending.filter(q => q.at > now);
        for (const b of bursts) b.t += dt; bursts = bursts.filter(b => b.t < 0.4);
        const fN = Math.exp(-h / K.lam), fE = Math.exp(-h / (K.g * K.lam));
        ro.set('v', K.b.toFixed(5) + ' c, γ = ' + K.g.toFixed(1));
        const pct = (a, n) => n ? a + ' / ' + n + ' (' + (100 * a / n).toFixed(1) + ' %)' : '0 / 0';
        ro.set('nn', pct(got[0], ended[0])); ro.set('ne', pct(got[1], ended[1]));
        ro.set('ex', (fN < 1e-3 ? fN.toExponential(1) : (100 * fN).toFixed(1) + ' %') + '  |  ' + (fE < 1e-3 ? fE.toExponential(1) : (100 * fE).toFixed(1) + ' %'));
        ro.set('mu', 'atmosphere ' + (V.h / K.g).toFixed(2) + ' km thick, crossed in ' + (h / K.g / (K.b * C_SI) * 1e6).toFixed(2) + ' µs');

        const c = st.begin(), C = kit.colors(), F = fit(c, st, W0, H0);
        const cols = [[40, 230, 'Newton: clocks not slowed'], [300, 490, 'Einstein: clocks slowed by γ']];
        const Y = y => GND - (GND - TOP) * y / h;
        cols.forEach(([x0, x1, name], i) => {
          const gr = c.createLinearGradient(0, TOP, 0, GND);
          gr.addColorStop(0, 'hsl(215 60% 50% / .05)'); gr.addColorStop(1, 'hsl(200 60% 55% / .22)');
          c.fillStyle = gr; c.fillRect(x0, TOP, x1 - x0, GND - TOP);
          c.fillStyle = C.surface2 || C.faint; c.fillRect(x0 - 6, GND, x1 - x0 + 12, 10);
          txt(c, name, (x0 + x1) / 2, TOP - 26, i ? C.ok : C.warn, { align: 'center', size: 12, weight: 600 });
          txt(c, 'arrived: ' + got[i], (x0 + x1) / 2, GND + 24, C.text, { align: 'center', size: 12, weight: 600 });
          c.strokeStyle = C.muted; c.setLineDash([3, 3]); c.lineWidth = 1; c.beginPath(); c.moveTo(x0, TOP); c.lineTo(x1, TOP); c.stroke(); c.setLineDash([]);
        });
        for (const m of mus) { const [x0, x1] = cols[m.col]; kit.dot(c, x0 + 8 + (x1 - x0 - 16) * m.x, Y(m.y), 3, C.accent); }
        for (const b of bursts) {
          const [x0, x1] = cols[b.col], x = x0 + 8 + (x1 - x0 - 16) * b.x, y = Y(b.y), a = 1 - b.t / 0.4;
          if (b.hit) { glow(c, x, y, 4, 120, a); continue; }
          c.strokeStyle = 'hsl(28 90% 55% / ' + a + ')'; c.lineWidth = 1.4; c.beginPath();
          for (let j = 0; j < 3; j++) { const an = j * 2.1 + b.x * 6; c.moveTo(x, y); c.lineTo(x + 8 * Math.cos(an), y + 8 * Math.sin(an)); }
          c.stroke();
        }
        // altitude scale and the muon's-eye bar
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(262, TOP); c.lineTo(262, GND); c.stroke();
        for (let km = 0; km <= V.h + 1e-9; km += V.h > 10 ? 5 : V.h > 4 ? 2 : 1) { const y = Y(km * 1000); c.beginPath(); c.moveTo(258, y); c.lineTo(266, y); c.stroke(); txt(c, km + ' km', 270, y, C.muted, { size: 10 }); }
        const xb = 560, yTop = Math.max(TOP, GND - (GND - TOP) / K.g);
        c.fillStyle = 'hsl(200 60% 55% / .25)'; c.fillRect(xb - 16, yTop, 32, GND - yTop);
        c.strokeStyle = C.ok; c.lineWidth = 1.5; c.strokeRect(xb - 16, yTop, 32, GND - yTop);
        txt(c, 'muon\'s view:', xb, TOP - 26, C.ok, { align: 'center', size: 11, weight: 600 });
        txt(c, 'air is ' + (V.h / K.g).toFixed(2) + ' km', xb, TOP - 10, C.ok, { align: 'center', size: 11 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rel-energy */
  Hyper.sim('rel-energy', {
    title: 'Pushing a particle up its hyperbola',
    blurb: `The plane of momentum ($pc$, across) and energy ($E$, up), both in units of the particle's rest energy $mc^2$. Every state of a particle of mass $m$ lies on the hyperbola $E^2 - (pc)^2 = (mc^2)^2$; the dashed line $E = pc$ is where light lives. A steady force raises the momentum steadily — watch the point climb. The dotted curve is Newton's $E = mc^2 + p^2/2m$. The graph below records the speed: $v/c = pc/E$ for Einstein, $p/m$ for Newton.

**Try this**
- Press *Push*: the point slides up the curve and its slope — the speed $v/c$ — approaches 1 but never reaches it. Newton's speed passes $c$ after about one second.
- Drag the point along the curve and read $E$, $p$, $K$ and $\\gamma$ for an electron, then switch to a proton: the same shape, a different scale.
- At small momentum Einstein's curve and Newton's parabola touch: that is $E \\approx mc^2 + \\tfrac12 mv^2$.
- Choose *photon*: there is no hyperbola, only the light line. Its speed is always $c$, whatever its energy.`,
    mount(box, kit) {
      const W0 = 640, H0 = 340, OX = 110, OY = 318, S = 44;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = plotBox(box);
      let p = 0, pushing = false, dir = 1, t = 0, hist = [], FT = null;
      const ctl = kit.controls(box.side, [
        { id: 'm', type: 'select', label: 'Particle', options: [['electron (0.511 MeV)', 0.511], ['muon (105.7 MeV)', 105.66], ['proton (938.3 MeV)', 938.27], ['photon (no mass)', 0]], value: 0.511 },
        { id: 'F', label: 'Force: momentum gained per second', min: 0.2, max: 3, step: 0.1, value: 1, unit: 'mc' },
        { type: 'buttons', items: [{ id: 'push', label: 'Push / stop', primary: true }, { id: 'brake', label: 'Reverse the force' }, { id: 'reset', label: 'Back to rest' }] }
      ], id => {
        if (id === 'push') { pushing = !pushing; }
        if (id === 'brake') { dir = -dir; pushing = true; }
        if (id === 'reset' || id === 'm') { p = V.m ? 0 : 1; t = 0; hist = []; pushing = false; dir = 1; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Momentum p'], ['E', 'Energy E'], ['K', 'Kinetic energy K (Newton p²/2m)'], ['v', 'Speed v/c (Newton p/m)'], ['g', 'γ = E/mc²'], ['inv', 'E² − (pc)², any frame']]);
      const plot = kit.plot(gb, { x: { label: 'time pushing (s)', min: 0 }, y: { label: 'speed (units of c)', min: 0, max: 2 }, legend: true, hlines: [{ y: 1, label: 'c' }] }, 150);
      const Px = q => OX + S * q, Py = e => OY - S * e;
      kit.drag(st, {
        hit: pt => { if (!FT) return null; const q = FT.to(pt), m = V.m > 0, e = m ? Math.hypot(1, p) : Math.abs(p); return Math.hypot(q.x - Px(p), q.y - Py(e)) < 16 ? 'pt' : null; },
        move: (k, pt) => { const q = FT.to(pt); p = clamp((q.x - OX) / S, V.m > 0 ? -2.2 : 0.05, 10.3); pushing = false; },
        hover: true
      });
      const loop = kit.loop(dt => {
        const massive = V.m > 0;
        if (pushing) {
          p += dir * V.F * dt; t += dt;
          if (p > 10.3) { p = 10.3; pushing = false; }
          if (p < (massive ? -2.2 : 0.05)) { p = massive ? -2.2 : 0.05; pushing = false; }
          if (massive) { const vE = p / Math.hypot(1, p), vN = p; if (!hist.length || t - hist[hist.length - 1][0] > 0.05) hist.push([t, vE, vN]); if (hist.length > 400) hist.shift(); }
        }
        const E = massive ? Math.hypot(1, p) : Math.abs(p), mc2 = V.m, unit = massive ? mc2 : 1;
        const fmtE = x => { const y = x * unit; return Math.abs(y) >= 1000 ? (y / 1000).toFixed(3) + ' GeV' : y.toFixed(3) + ' MeV'; };
        ro.set('p', fmtE(p).replace('eV', 'eV/c'));
        ro.set('E', fmtE(E));
        ro.set('K', massive ? fmtE(E - 1) + '  (' + fmtE(p * p / 2) + ')' : fmtE(E) + ' (all of it)');
        ro.set('v', massive ? (Math.abs(p) / E).toFixed(5) + '  (' + Math.abs(p).toFixed(3) + (Math.abs(p) > 1 ? ' — faster than light!' : '') + ')' : '1 (always)');
        ro.set('g', massive ? E.toFixed(4) : '— (no rest frame)');
        ro.set('inv', massive ? '(' + fmtE(1) + ')² — the rest energy squared' : '0 — massless');
        if (Math.floor(t * 10) !== Math.floor((t - dt) * 10) || !pushing) {
          plot.set({ x: { label: 'time pushing (s)', min: 0, max: Math.max(4, t) }, series: massive && hist.length > 1 ? [{ pts: hist.map(h => [h[0], Math.abs(h[1])]), label: 'Einstein pc/E', width: 2.2 }, { pts: hist.map(h => [h[0], Math.min(2, Math.abs(h[2]))]), label: 'Newton p/m', dash: [5, 4] }] : [] });
        }

        const c = st.begin(), C = kit.colors();
        FT = fit(c, st, W0, H0);
        kit.grid(c, Px(-2.5), Py(7.2), S * 13, S * 7.2, S, C.grid);
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1.6; c.beginPath(); c.moveTo(Px(-2.5), OY); c.lineTo(W0, OY); c.moveTo(OX, OY); c.lineTo(OX, 4); c.stroke();
        txt(c, 'pc', W0 - 20, OY - 10, C.muted, { size: 12, weight: 600 });
        txt(c, 'E', OX + 8, 12, C.muted, { size: 12, weight: 600 });
        for (let k = 1; k <= 10; k++) txt(c, String(k), Px(k), OY + 10, C.muted, { align: 'center', size: 10 });
        for (let k = 1; k <= 6; k++) txt(c, String(k), OX - 8, Py(k), C.muted, { align: 'right', size: 10 });
        txt(c, massive ? '(units of mc² = ' + mc2 + ' MeV)' : '(MeV)', OX + 16, OY - 10, C.muted, { size: 10 });
        // light lines
        c.strokeStyle = 'hsl(48 95% 52%)'; c.lineWidth = 2; c.setLineDash([7, 5]);
        c.beginPath(); c.moveTo(OX, OY); c.lineTo(Px(7.2), Py(7.2)); c.moveTo(OX, OY); c.lineTo(Px(-2.5), Py(2.5)); c.stroke(); c.setLineDash([]);
        txt(c, 'light: E = pc', Px(5.6) + 8, Py(5.6) + 8, 'hsl(48 85% 45%)', { size: 11 });
        if (massive) {
          c.strokeStyle = C.accent; c.lineWidth = 2.6; c.beginPath();
          for (let i = 0; i <= 200; i++) { const q = -2.5 + 12.8 * i / 200, e = Math.hypot(1, q); if (e > 7.2) break; if (i) c.lineTo(Px(q), Py(e)); else c.moveTo(Px(q), Py(e)); }
          c.stroke();
          c.strokeStyle = C.series[1]; c.lineWidth = 1.6; c.setLineDash([2, 4]); c.beginPath();
          let started = false;
          for (let i = 0; i <= 200; i++) { const q = -2.5 + 12.8 * i / 200, e = 1 + q * q / 2; if (e > 7.2) continue; if (started) c.lineTo(Px(q), Py(e)); else { c.moveTo(Px(q), Py(e)); started = true; } }
          c.stroke(); c.setLineDash([]);
          txt(c, 'E² − (pc)² = (mc²)²', Px(-2.3), Py(3.1), C.accent, { size: 12, weight: 600 });
          txt(c, 'Newton: mc² + p²/2m', Px(2.6) + 8, Py(4.5), C.series[1], { size: 11 });
          // rest energy and kinetic energy as bars at the point
          c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(Px(p), OY); c.lineTo(Px(p), Py(E)); c.stroke(); c.setLineDash([]);
          c.strokeStyle = C.ok; c.lineWidth = 5; c.beginPath(); c.moveTo(Px(p) + 10, OY); c.lineTo(Px(p) + 10, Py(1)); c.stroke();
          c.strokeStyle = C.warn; c.beginPath(); c.moveTo(Px(p) + 10, Py(1)); c.lineTo(Px(p) + 10, Py(E)); c.stroke();
          txt(c, 'mc²', Px(p) + 16, Py(0.5), C.ok, { size: 10, weight: 600 });
          if (E - 1 > 0.35) txt(c, 'K', Px(p) + 16, Py((1 + E) / 2), C.warn, { size: 10, weight: 600 });
          // the tangent: its slope is v/c
          const sl = p / E;
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.moveTo(Px(p - 1.2), Py(E - 1.2 * sl)); c.lineTo(Px(p + 1.2), Py(E + 1.2 * sl)); c.stroke();
          txt(c, 'slope = v/c = ' + Math.abs(sl).toFixed(3), Px(p) + 14, Py(E) - 14, C.text, { size: 11, weight: 600 });
        } else {
          txt(c, 'a photon lives on the light line: E = pc, v = c', Px(0.4), Py(6.6), C.text, { size: 12, weight: 600 });
        }
        kit.dot(c, Px(p), Py(E), 7, C.bad, C.text);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rel-spacetime */
  Hyper.sim('rel-spacetime', {
    title: 'Space-time diagram: cones, hyperbolas and a boost',
    blurb: `Events in space-time, drawn in the frame of an observer whose speed you choose. One square is 1 µs of time and 300 m of distance, so light runs at 45°. O is here-and-now; its light cone splits space-time into its future, its past, and "elsewhere". A is in O's future, B elsewhere, and T is the turning point of a round trip from O to A. The dashed curves are hyperbolas of constant interval $s^2 = (c\\Delta t)^2 - \\Delta x^2$.

**Try this**
- Move the boost slider: every event slides along its own hyperbola — the [[?invariant]] $s^2$ never changes. A stays in the future cone for every observer.
- Watch B: for some observers it happens after O, for others before. Space-like separation leaves the order open.
- Drag T to make the round trip O → T → A: its proper time (orange) is always less than the straight path's (green) — the twin paradox. Drag T onto the light cone and that leg's proper time drops to zero.
- Drag A outside the cone: the straight path becomes impossible for any clock.`,
    mount(box, kit) {
      const Q = kit.qm, W0 = 640, H0 = 420, S = 66, OX = 320, OY = 268;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 280 });
      let ev = { A: [0.8, 2.4], B: [2.6, 0.9], T: [1.0, 1.3] }, FT = null, sweep = null;
      const ctl = kit.controls(box.side, [
        { id: 'b', label: 'Speed of the observer (boost) v', min: -0.9, max: 0.9, step: 0.01, value: 0, unit: 'c' },
        { id: 'hyp', type: 'check', label: 'Hyperbolas of constant s²', value: true },
        { id: 'trip', type: 'check', label: 'Round trip O → T → A', value: true },
        { type: 'buttons', items: [{ id: 'sweep', label: 'Sweep the boost', primary: true }, { id: 'reset', label: 'Reset the events' }] }
      ], id => { if (id === 'sweep') sweep = sweep == null ? 0 : null; if (id === 'reset') ev = { A: [0.8, 2.4], B: [2.6, 0.9], T: [1.0, 1.3] }; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['g', 'Observer'], ['A', 'O → A (Δx, Δt)'], ['As', 'O → A: s² and kind'], ['B', 'O → B (Δx, Δt)'], ['Bs', 'O → B: s² and kind'], ['tau', 'Proper time: straight | via T']]);
      const toPx = (x, t) => [OX + S * x, OY - S * t];
      const kind = s2 => Math.abs(s2) < 0.01 ? 'light-like' : s2 > 0 ? 'time-like' : 'space-like';
      kit.drag(st, {
        hit: p => { if (!FT) return null; const q = FT.to(p), L = Q.lorentz(V.b); for (const k of ['T', 'A', 'B']) { if (k === 'T' && !V.trip) continue; const e = ev[k], d = toPx(L.x(e[0], e[1]), L.t(e[0], e[1])); if (Math.hypot(q.x - d[0], q.y - d[1]) < 15) return k; } return null; },
        move: (k, p) => { const q = FT.to(p), b = V.b, g = gammaOf(b), xp = clamp((q.x - OX) / S, -4.6, 4.6), tp = clamp((OY - q.y) / S, -3.8, 3.9); ev[k] = [g * (xp + b * tp), g * (tp + b * xp)]; },
        hover: true
      });
      const loop = kit.loop(dt => {
        if (sweep != null) { sweep += dt; ctl.set('b', Math.round(85 * Math.sin(sweep * 0.8)) / 100); }
        const b = V.b, L = Q.lorentz(b), g = L.gamma;
        const P = {}; for (const k in ev) P[k] = [L.x(ev[k][0], ev[k][1]), L.t(ev[k][0], ev[k][1])];
        const sA = Q.interval(ev.A[1], ev.A[0]), sB = Q.interval(ev.B[1], ev.B[0]);
        const tauOf = (a, z) => { const s2 = Q.interval(z[1] - a[1], z[0] - a[0]); return s2 >= 0 && z[1] >= a[1] ? Math.sqrt(s2) : null; };
        const tS = tauOf([0, 0], ev.A), t1 = tauOf([0, 0], ev.T), t2 = tauOf(ev.T, ev.A);
        ro.set('g', 'v = ' + b.toFixed(2) + 'c, γ = ' + g.toFixed(3));
        ro.set('A', (P.A[0] * US).toFixed(0) + ' m, ' + P.A[1].toFixed(2) + ' µs');
        ro.set('As', (sA * US * US / 1e3).toFixed(1) + ' ×10³ m², ' + kind(sA));
        ro.set('B', (P.B[0] * US).toFixed(0) + ' m, ' + P.B[1].toFixed(2) + ' µs' + (Math.abs(P.B[1]) < 0.01 ? ' (simultaneous with O)' : P.B[1] > 0 ? ' (after O)' : ' (before O)'));
        ro.set('Bs', (sB * US * US / 1e3).toFixed(1) + ' ×10³ m², ' + kind(sB));
        ro.set('tau', (tS == null ? 'no clock can go' : tS.toFixed(3) + ' µs') + '  |  ' + (!V.trip ? '—' : t1 == null || t2 == null ? 'a leg is faster than light' : (t1 + t2).toFixed(3) + ' µs'));

        const c = st.begin(), C = kit.colors();
        FT = fit(c, st, W0, H0);
        c.save(); c.beginPath(); c.rect(0, 0, W0, H0); c.clip();
        kit.grid(c, OX - 5 * S, OY - 4 * S, 10 * S, 8 * S, S, C.grid);
        // light cone of O: future and past shaded
        const R = 6;
        c.fillStyle = C.dark ? 'hsl(140 50% 45% / .12)' : 'hsl(140 50% 45% / .10)';
        c.beginPath(); c.moveTo(OX, OY); c.lineTo(...toPx(-R, R)); c.lineTo(...toPx(R, R)); c.closePath(); c.fill();
        c.fillStyle = C.dark ? 'hsl(215 60% 55% / .12)' : 'hsl(215 60% 55% / .10)';
        c.beginPath(); c.moveTo(OX, OY); c.lineTo(...toPx(-R, -R)); c.lineTo(...toPx(R, -R)); c.closePath(); c.fill();
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, OY); c.lineTo(W0, OY); c.moveTo(OX, 0); c.lineTo(OX, H0); c.stroke();
        c.strokeStyle = 'hsl(48 95% 52%)'; c.lineWidth = 2; c.beginPath(); c.moveTo(...toPx(-R, -R)); c.lineTo(...toPx(R, R)); c.moveTo(...toPx(R, -R)); c.lineTo(...toPx(-R, R)); c.stroke();
        // hyperbolas of constant interval through A and B
        if (V.hyp) {
          c.strokeStyle = C.series[5]; c.lineWidth = 1.4; c.setLineDash([4, 4]);
          const hyper = (s2, e) => {
            if (Math.abs(s2) < 1e-3) return;
            const a = Math.sqrt(Math.abs(s2)); c.beginPath();
            for (let i = 0; i <= 80; i++) {
              const eta = -2.6 + 5.2 * i / 80;
              const pt = s2 > 0 ? [a * Math.sinh(eta), Math.sign(e[1] || 1) * a * Math.cosh(eta)] : [Math.sign(e[0] || 1) * a * Math.cosh(eta), a * Math.sinh(eta)];
              const q = toPx(pt[0], pt[1]); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]);
            }
            c.stroke();
          };
          hyper(sA, P.A); hyper(sB, P.B);
          c.setLineDash([]);
        }
        // the home observer's world line (at rest in the unboosted frame), and the other frame's now through O
        c.strokeStyle = C.muted; c.lineWidth = 1.2; c.setLineDash([6, 4]);
        c.beginPath(); c.moveTo(...toPx(L.x(0, -5), L.t(0, -5))); c.lineTo(...toPx(L.x(0, 5), L.t(0, 5))); c.stroke();
        c.setLineDash([]);
        // paths to A
        const pO = toPx(0, 0), pA = toPx(P.A[0], P.A[1]), pT = toPx(P.T[0], P.T[1]), pB = toPx(P.B[0], P.B[1]);
        c.strokeStyle = tS == null ? C.bad : C.ok; c.lineWidth = 3; c.beginPath(); c.moveTo(...pO); c.lineTo(...pA); c.stroke();
        if (V.trip) { c.strokeStyle = C.warn; c.lineWidth = 2.4; c.beginPath(); c.moveTo(...pO); c.lineTo(...pT); c.lineTo(...pA); c.stroke(); }
        c.restore();
        for (const [k, p, col] of [['O', pO, C.text], ['A', pA, C.ok], ['B', pB, C.series[3]], ['T', pT, C.warn]]) {
          if (k === 'T' && !V.trip) continue;
          kit.dot(c, p[0], p[1], k === 'O' ? 5 : 7, col, C.text);
          txt(c, k, p[0] + 10, p[1] - 10, col, { size: 13, weight: 700 });
        }
        txt(c, 'future of O', OX + 6, 16, C.ok, { size: 11 });
        txt(c, 'past of O', OX + 6, H0 - 12, C.accent, { size: 11 });
        txt(c, 'elsewhere', 14, OY - 12, C.muted, { size: 11 });
        txt(c, 'elsewhere', W0 - 14, OY - 12, C.muted, { size: 11, align: 'right' });
        txt(c, 'x', W0 - 12, OY + 12, C.muted, { size: 12, weight: 600 });
        txt(c, 'ct', OX - 18, 12, C.muted, { size: 12, weight: 600 });
        txt(c, 'dashed grey: world line of an observer at rest at O before the boost', 10, H0 - 30, C.muted, { size: 10 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rel-four-vectors */
  Hyper.sim('rel-four-vectors', {
    title: 'A turned arrow and a boosted four-vector',
    blurb: `Left: an ordinary arrow in a plane, turned through an angle $\\theta$. Its components change, but its tip stays on a circle: $x^2 + y^2$ is fixed. Right: a [[?four-vector]] in space-time, seen by an observer with rapidity $\\varphi$ (speed $v = c\\tanh\\varphi$). Its components change, but its tip stays on a hyperbola: $a_t^2 - a_x^2$ is fixed. One slider drives both, with $\\theta = \\varphi$.

**Try this**
- Move the slider slowly and compare the two panels: the same game, with a circle on the left and a hyperbola on the right.
- Choose *energy–momentum of a proton*: $E$ and $pc$ change, and $E^2 - (pc)^2 = (mc^2)^2$ stays put. Find the boost where $p = 0$: that observer rides with the proton and sees only its rest energy.
- Choose *a photon*: its tip slides along the light line, only growing or shrinking — the Doppler shift. The read-out compares it with the Doppler formula.
- Tick *a second vector*: the [[?dot-product]] of the two is fixed too — in space-time with a minus sign. For the two photons it gives the invariant mass of the pair.`,
    mount(box, kit) {
      const Q = kit.qm, W0 = 640, H0 = 330, SC = 40, LX = 160, LY = 180, RX = 480, RY = 215;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      let sweep = null;
      const KINDS = {
        disp: { name: 'displacement between two events', A: [0.5, 1.2], B: [-0.4, 1.1], lab: ['c t', 'x'] },
        pmom: { name: 'energy–momentum of a proton', A: [0.75, 1.25], B: [-0.5, Math.sqrt(1.25)], lab: ['E', 'p c'] },
        photon: { name: 'a photon', A: [1.0, 1.0], B: [-0.8, 0.8], lab: ['E', 'p c'] },
        space: { name: 'a space-like separation', A: [1.6, 0.6], B: [0.3, 1.0], lab: ['c t', 'x'] }
      };
      const ctl = kit.controls(box.side, [
        { id: 's', label: 'Turn (θ, radians) = boost (rapidity φ)', min: -1.5, max: 1.5, step: 0.01, value: 0 },
        { id: 'k', type: 'select', label: 'Four-vector', options: [['displacement between two events', 'disp'], ['energy–momentum of a proton', 'pmom'], ['a photon', 'photon'], ['a space-like separation', 'space']], value: 'pmom' },
        { id: 'two', type: 'check', label: 'Show a second vector and the dot product', value: false },
        { type: 'buttons', items: [{ id: 'sweep', label: 'Sweep', primary: true }, { id: 'zero', label: 'Back to zero' }] }
      ], id => { if (id === 'sweep') sweep = sweep == null ? 0 : null; if (id === 'zero') { sweep = null; ctl.set('s', 0); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['l', 'Arrow (x, y) | x² + y²'], ['r', 'Four-vector (a_x, a_t) | a_t² − a_x²'], ['v', 'Observer speed v = c tanh φ'], ['x', ''], ['d', 'Dot products: plane | space-time']]);
      const rot = (v, th) => [v[0] * Math.cos(th) - v[1] * Math.sin(th), v[0] * Math.sin(th) + v[1] * Math.cos(th)];
      const loop = kit.loop(dt => {
        if (sweep != null) { sweep += dt; ctl.set('s', Math.round(140 * Math.sin(sweep * 0.7)) / 100); }
        const s = V.s, K = KINDS[V.k] || KINDS.pmom, beta = Math.tanh(s), L = Q.lorentz(beta);
        const boost = v => [L.x(v[0], v[1]), L.t(v[0], v[1])];          // [x, t] -> [x', t'] in natural units
        const a0 = [1.8, 0.9], b0 = [-0.6, 1.5], a = rot(a0, s), bb = rot(b0, s);
        const A = boost(K.A), B = boost(K.B);
        const invA = Q.interval(A[1], A[0]), invB0 = Q.interval(K.A[1], K.A[0]);
        ro.set('l', '(' + a[0].toFixed(2) + ', ' + a[1].toFixed(2) + ') | ' + (a[0] * a[0] + a[1] * a[1]).toFixed(3));
        ro.set('r', '(' + A[0].toFixed(2) + ', ' + A[1].toFixed(2) + ') | ' + (Math.abs(invA) < 5e-4 ? '0.000' : invA.toFixed(3)) + ' (at φ = 0: ' + (Math.abs(invB0) < 5e-4 ? '0.000' : invB0.toFixed(3)) + ')');
        ro.set('v', beta.toFixed(3) + ' c, γ = cosh φ = ' + L.gamma.toFixed(3));
        if (V.k === 'photon') ro.set('x', 'E′/E = ' + (A[1] / K.A[1]).toFixed(4) + ';  Doppler √((1−β)/(1+β)) = ' + Q.doppler(-beta).toFixed(4));
        else if (V.k === 'pmom') ro.set('x', 'proton: E = ' + (A[1] * 938.3).toFixed(0) + ' MeV, pc = ' + (A[0] * 938.3).toFixed(0) + ' MeV' + (Math.abs(A[0]) < 0.02 ? ' — rest frame!' : ''));
        else ro.set('x', Math.abs(A[1]) < 0.02 ? 'the two events are simultaneous for this observer' : invA > 0 ? 'time-like: a clock could attend both' : 'space-like: order depends on the observer');
        const dotE = a[0] * bb[0] + a[1] * bb[1], dotM = A[1] * B[1] - A[0] * B[0];
        ro.set('d', V.two ? dotE.toFixed(3) + ' | ' + dotM.toFixed(3) + (V.k === 'photon' ? ' → pair mass² = 2 a·b = ' + (2 * dotM).toFixed(3) : '') : '—');

        const c = st.begin(), C = kit.colors(), F = fit(c, st, W0, H0);
        // ---- left: the plane
        c.save(); c.beginPath(); c.rect(0, 0, 318, H0); c.clip();
        kit.grid(c, LX - 4 * SC, LY - 4 * SC, 8 * SC, 8 * SC, SC, C.grid);
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1.4; c.beginPath(); c.moveTo(LX - 160, LY); c.lineTo(LX + 160, LY); c.moveTo(LX, LY - 170); c.lineTo(LX, LY + 150); c.stroke();
        const r0 = Math.hypot(a0[0], a0[1]);
        c.strokeStyle = C.series[5]; c.lineWidth = 1.4; c.setLineDash([4, 4]); c.beginPath(); c.arc(LX, LY, r0 * SC, 0, 6.2832); c.stroke(); c.setLineDash([]);
        const lp = v => [LX + SC * v[0], LY - SC * v[1]];
        c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([2, 3]);
        c.beginPath(); c.moveTo(...lp(a)); c.lineTo(lp(a)[0], LY); c.moveTo(...lp(a)); c.lineTo(LX, lp(a)[1]); c.stroke(); c.setLineDash([]);
        kit.arrow(c, LX, LY, ...lp(a), C.accent, 3);
        if (V.two) kit.arrow(c, LX, LY, ...lp(bb), C.series[1], 2.4);
        txt(c, 'rotation by θ = ' + s.toFixed(2) + ' rad', 10, 14, C.text, { size: 12, weight: 600 });
        txt(c, 'x² + y² fixed: a circle', 10, 32, C.series[5], { size: 11 });
        txt(c, 'x', LX + 150, LY + 12, C.muted, { size: 11 }); txt(c, 'y', LX + 6, LY - 162, C.muted, { size: 11 });
        c.restore();
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(322, 8); c.lineTo(322, H0 - 8); c.stroke();
        // ---- right: space-time
        c.save(); c.beginPath(); c.rect(326, 0, W0 - 326, H0); c.clip();
        kit.grid(c, RX - 4 * SC, RY - 5 * SC, 8 * SC, 8 * SC, SC, C.grid);
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1.4; c.beginPath(); c.moveTo(RX - 160, RY); c.lineTo(RX + 160, RY); c.moveTo(RX, RY - 210); c.lineTo(RX, RY + 120); c.stroke();
        const rp = v => [RX + SC * v[0], RY - SC * v[1]];
        c.strokeStyle = 'hsl(48 95% 52%)'; c.lineWidth = 1.8; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(...rp([-4, -4])); c.lineTo(...rp([5.5, 5.5])); c.moveTo(...rp([4, -4])); c.lineTo(...rp([-5.5, 5.5])); c.stroke(); c.setLineDash([]);
        if (Math.abs(invB0) > 1e-3) {
          const m = Math.sqrt(Math.abs(invB0)); c.strokeStyle = C.series[5]; c.lineWidth = 1.4; c.setLineDash([4, 4]); c.beginPath();
          for (let i = 0; i <= 80; i++) { const e = -2.4 + 4.8 * i / 80, pt = invB0 > 0 ? [m * Math.sinh(e), m * Math.cosh(e)] : [m * Math.cosh(e), m * Math.sinh(e)], q = rp(pt); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }
          c.stroke(); c.setLineDash([]);
        }
        c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([2, 3]);
        c.beginPath(); c.moveTo(...rp(A)); c.lineTo(rp(A)[0], RY); c.moveTo(...rp(A)); c.lineTo(RX, rp(A)[1]); c.stroke(); c.setLineDash([]);
        kit.arrow(c, RX, RY, ...rp(A), C.accent, 3);
        if (V.two) { kit.arrow(c, RX, RY, ...rp(B), C.series[1], 2.4); if (V.k === 'photon') { const S2 = [A[0] + B[0], A[1] + B[1]]; c.setLineDash([3, 3]); kit.arrow(c, RX, RY, ...rp(S2), C.ok, 1.8); c.setLineDash([]); } }
        txt(c, 'boost: v = ' + beta.toFixed(3) + 'c', 334, 14, C.text, { size: 12, weight: 600 });
        txt(c, Math.abs(invB0) > 1e-3 ? 'a_t² − a_x² fixed: a hyperbola' : 'length zero: stays on the light line', 334, 32, C.series[5], { size: 11 });
        txt(c, K.lab[1], RX + 150, RY + 12, C.muted, { size: 11 }); txt(c, K.lab[0], RX + 6, RY - 200, C.muted, { size: 11 });
        c.restore();
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rel-wire */
  Hyper.sim('rel-wire', {
    title: 'Magnetism as relativity: a wire and a moving charge',
    blurb: `A wire carries a current: positive ions (red) stay put and electrons (blue) drift along it. A negative charge $q$ outside moves parallel to the wire at the same speed as the electrons. The drift speed is exaggerated enormously — in real copper it is below a millimetre per second — so that the contraction can be seen.

**Try this**
- *Laboratory frame*: ions and electrons are equally spaced, the wire is neutral, and there is only a magnetic field (⊙ out of the screen below the wire, ⊗ into it above). The force on the moving charge is magnetic: $F = qvB$, towards the wire.
- Switch to *the charge's frame*: now $q$ is at rest and cannot feel a magnetic force. But the moving ions have crowded together (×γ) and the resting electrons spread apart (÷γ): the wire is positively charged, and its electric field pulls $q$ in. The read-out shows the force is $\\gamma$ times the laboratory one.
- Set the drift speed to zero: both frames are the same, there is no current and no force.`,
    mount(box, kit) {
      const W0 = 640, H0 = 330, WY = 112, QY = 236, A = 30, CD = 70;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      let t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'frame', type: 'select', label: 'Frame', options: [['the laboratory (the wire at rest)', 'lab'], ['the moving charge q', 'q']], value: 'lab' },
        { id: 'b', label: 'Drift speed of the electrons (hugely exaggerated)', min: 0, max: 0.85, step: 0.01, value: 0.6, unit: 'c' },
        { id: 'fields', type: 'check', label: 'Show the fields', value: true }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['g', 'γ'], ['d', 'Charges per length: ions | electrons'], ['lam', 'Net charge of the wire'], ['F', 'Force on q, towards the wire'], ['msg', '']]);
      const wrap = (x, L) => ((x % L) + L) % L;
      const loop = kit.loop(dt => {
        t += dt;
        const b = V.b, g = gammaOf(b), lab = V.frame === 'lab';
        const sIon = lab ? A : A / g, vIon = lab ? 0 : -b * CD, sEl = lab ? A : A * g, vEl = lab ? b * CD : 0, vQ = lab ? b * CD : 0;
        const lamNet = lab ? 0 : g - 1 / g;                  // in units of λ₀
        const Flab = b * b, F = lab ? Flab : g * Flab;       // in units of qλ₀/(2πε₀ r)
        ro.set('g', g.toFixed(3));
        ro.set('d', lab ? '1 | 1 (× λ₀): neutral' : g.toFixed(3) + ' | ' + (1 / g).toFixed(3) + ' (× λ₀)');
        ro.set('lam', lab ? '0' : '+' + lamNet.toFixed(3) + ' λ₀ = γλ₀v²/c²');
        ro.set('F', b === 0 ? '0' : lab ? 'magnetic, qvB ∝ v²/c² = ' + Flab.toFixed(3) : 'electric, qE′ = γ × ' + Flab.toFixed(3) + ' = ' + F.toFixed(3));
        ro.set('msg', lab ? 'The wire is neutral: the pull is magnetic.' : 'q is at rest, so no magnetic force acts on it: the pull is electric.');

        const c = st.begin(), C = kit.colors(), Fz = fit(c, st, W0, H0);
        // fields
        if (V.fields && b > 0) {
          const Bstr = b;                                    // current ∝ drift speed in the lab (∝ γ-ish in the q frame; drawn the same)
          c.globalAlpha = lab ? 0.9 : 0.35;
          for (const [y, out] of [[40, false], [QY - 44, true], [QY + 12, true], [QY + 62, true]]) {
            const r = Math.abs(y - WY), sz = clamp(5 + 380 * Bstr / r, 4, 11);
            for (let x = 40; x < W0; x += 80) {
              c.strokeStyle = C.series[5]; c.lineWidth = 1.4; c.beginPath(); c.arc(x, y, sz, 0, 6.2832); c.stroke();
              if (out) { c.fillStyle = C.series[5]; c.beginPath(); c.arc(x, y, 1.8, 0, 6.2832); c.fill(); }
              else { c.beginPath(); c.moveTo(x - sz * 0.6, y - sz * 0.6); c.lineTo(x + sz * 0.6, y + sz * 0.6); c.moveTo(x + sz * 0.6, y - sz * 0.6); c.lineTo(x - sz * 0.6, y + sz * 0.6); c.stroke(); }
            }
          }
          c.globalAlpha = 1;
          txt(c, lab ? 'B (magnetic field)' : 'B is here too, but q is at rest', W0 - 8, 66, C.series[5], { align: 'right', size: 11 });
          if (!lab) {
            const Lr = 60 * lamNet / (gammaOf(0.85) - 1 / gammaOf(0.85));
            for (let x = 20; x < W0; x += 40) {
              kit.arrow(c, x, WY + 22, x, WY + 22 + Math.max(4, Lr * 1.4), C.warn, 1.6);
              kit.arrow(c, x, WY - 22, x, WY - 22 - Math.max(4, Lr * 0.6), C.warn, 1.6);
            }
            txt(c, 'E′ (electric field of the charged wire)', 8, WY + 36 + Lr * 1.4, C.warn, { size: 11 });
          }
        }
        // the wire, its ions and electrons
        c.fillStyle = C.surface2 || C.faint; c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.rect(-2, WY - 17, W0 + 4, 34); c.fill(); c.stroke();
        for (let x = wrap(vIon * t, sIon) - sIon; x < W0 + sIon; x += sIon) {
          c.fillStyle = 'hsl(0 70% 55%)'; c.beginPath(); c.arc(x, WY - 7, 6, 0, 6.2832); c.fill();
          c.strokeStyle = '#fff'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x - 3, WY - 7); c.lineTo(x + 3, WY - 7); c.moveTo(x, WY - 10); c.lineTo(x, WY - 4); c.stroke();
        }
        for (let x = wrap(vEl * t, sEl) - sEl; x < W0 + sEl; x += sEl) {
          c.fillStyle = 'hsl(215 80% 55%)'; c.beginPath(); c.arc(x, WY + 8, 4.5, 0, 6.2832); c.fill();
          c.strokeStyle = '#fff'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x - 2.5, WY + 8); c.lineTo(x + 2.5, WY + 8); c.stroke();
        }
        txt(c, lab ? 'ions at rest, electrons drifting →' : '← ions moving (closer together), electrons at rest (farther apart)', 8, WY - 30, C.text, { size: 11, weight: 600 });
        if (lab && b > 0) { kit.arrow(c, W0 - 30, WY - 30, W0 - 90, WY - 30, C.accent, 2); txt(c, 'current I', W0 - 96, WY - 30, C.accent, { align: 'right', size: 11 }); }
        // the charge q
        const xq = lab ? wrap(120 + vQ * t, W0 + 60) - 30 : W0 / 2;
        c.fillStyle = 'hsl(215 80% 50%)'; c.beginPath(); c.arc(xq, QY, 11, 0, 6.2832); c.fill();
        c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(xq - 5, QY); c.lineTo(xq + 5, QY); c.stroke();
        txt(c, 'q', xq + 15, QY + 12, C.text, { size: 12, weight: 700 });
        if (lab && b > 0) { kit.arrow(c, xq + 14, QY, xq + 14 + 60 * b, QY, C.text, 2); txt(c, 'v', xq + 20 + 60 * b, QY - 8, C.text, { size: 11 }); }
        if (b > 0) {
          const Lf = 18 + 70 * F / (gammaOf(0.85) * 0.85 * 0.85);
          kit.arrow(c, xq, QY - 14, xq, QY - 14 - Lf, lab ? C.series[5] : C.warn, 3.2);
          txt(c, lab ? 'magnetic force' : 'electric force (γ × larger)', xq + 10, QY - 20 - Lf / 2, lab ? C.series[5] : C.warn, { size: 11, weight: 600 });
        }
        txt(c, lab ? 'Laboratory frame' : 'Frame of the moving charge q', 8, H0 - 12, C.text, { size: 12, weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rel-hot-plate */
  Hyper.sim('rel-hot-plate', {
    title: 'Bugs on a hot plate',
    blurb: `A flat plate, heated unevenly, seen from above. The bugs that live on it measure with rulers that expand where the plate is hot — alternating light and dark segments show the rulers laid end to end. They cannot feel the heat, so for them a ruler is a ruler. Their "straight lines" are the paths that take the fewest rulers.

**Try this**
- *Hot centre*: rulers along the radius are long and few, rulers round the rim short and many — the circumference is **more** than $2\\pi$ times the radius, like on a saddle. Drag the triangle's corners: its sides bow towards the heat and its angles add up to **less** than 180°.
- *Cold centre, hot rim*: now $C < 2\\pi r$ and the angles add up to **more** than 180° — like the geometry of a sphere.
- *Heated evenly*: every ruler stretches alike and Euclid is back — curvature needs *differences*.
- Make a small triangle far from the centre: the smaller the triangle, the closer to 180° — curved spaces look flat in a small enough patch.`,
    mount(box, kit) {
      const W0 = 640, H0 = 360, PX = 220, PY = 180, RP = 160, WW = 0.45, L0 = 0.07, N = 24;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const gb = plotBox(box);
      let verts = null, paths = null, FT = null;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'How the plate is heated', options: [['hot centre', 'hot'], ['cold centre, hot rim', 'cold'], ['evenly', 'even']], value: 'hot' },
        { id: 'a', label: 'Stretch of a ruler at the hottest place', min: 0, max: 80, step: 1, value: 30, unit: '%' },
        { id: 'rho', label: 'Size of the circle (true radius, × plate radius)', min: 0.1, max: 0.95, step: 0.01, value: 0.6 },
        { id: 'tri', type: 'check', label: 'Triangle', value: true },
        { id: 'circ', type: 'check', label: 'Circle and rulers', value: true },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset the triangle', primary: true }] }
      ], id => { if (id === 'reset') initTri(); if (id !== 'tri' && id !== 'circ') curve(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r', 'Radius, in rulers'], ['C', 'Circumference, in rulers'], ['q', 'C / r (flat: 2π = 6.283)'], ['ang', 'Triangle angles'], ['sum', 'Angle sum'], ['kind', 'The bugs\' geometry is like']]);
      const plot = kit.plot(gb, { x: { label: 'radius of the circle, in rulers', min: 0 }, y: { label: 'C / r', min: 4, max: 9 }, legend: true, hlines: [{ y: 2 * Math.PI, label: '2π' }] }, 140);
      // ruler length factor f(r) and d(ln f)/dr
      const fr = r => { const a = V.a / 100, e = Math.exp(-r * r / (WW * WW)); return V.mode === 'hot' ? 1 + a * e : V.mode === 'cold' ? 1 + a * (1 - e) : 1 + a; };
      const dlnf = r => { const a = V.a / 100, e = Math.exp(-r * r / (WW * WW)), d = 2 * r / (WW * WW) * a * e; return (V.mode === 'hot' ? -d : V.mode === 'cold' ? d : 0) / fr(r); };
      const measR = rho => { const n = 200; let s = 0; for (let i = 0; i < n; i++) s += 1 / fr((i + 0.5) * rho / n); return s * rho / n; };
      function curve() {
        const pts = []; for (let i = 1; i <= 60; i++) { const rho = 0.98 * i / 60, rm = measR(rho); pts.push([rm / L0, 2 * Math.PI * rho / fr(rho) / rm]); }
        const rm = measR(V.rho);
        plot.set({ series: [{ pts, label: 'measured C / r' }], marks: [{ x: rm / L0, y: 2 * Math.PI * V.rho / fr(V.rho) / rm, label: 'this circle' }] });
      }
      function initTri() { verts = [[-0.62, -0.38], [0.62, -0.38], [0.02, 0.66]]; paths = null; }
      initTri(); curve();
      const straight = (A, B) => Array.from({ length: N + 1 }, (_, i) => [A[0] + (B[0] - A[0]) * i / N, A[1] + (B[1] - A[1]) * i / N]);
      function resample(p) {
        const s = [0]; for (let i = 1; i < p.length; i++) s.push(s[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
        const tot = s[s.length - 1] || 1, out = [p[0]]; let j = 1;
        for (let i = 1; i < N; i++) { const u = tot * i / N; while (j < p.length - 1 && s[j] < u) j++; const k = (u - s[j - 1]) / Math.max(1e-12, s[j] - s[j - 1]); out.push([p[j - 1][0] + k * (p[j][0] - p[j - 1][0]), p[j - 1][1] + k * (p[j][1] - p[j - 1][1])]); }
        out.push(p[p.length - 1]); return out;
      }
      // the bugs' straight line: relax the path so its curvature equals the transverse gradient of ln n, n = 1/f (Fermat)
      function relax(p) {
        for (let sweep = 0; sweep < 36; sweep++) {
          for (let i = 1; i < N; i++) {
            const P = p[i - 1], Nx = p[i + 1], dx = Nx[0] - P[0], dy = Nx[1] - P[1], L = Math.hypot(dx, dy) || 1e-9, tx = dx / L, ty = dy / L, h = L / 2;
            const x = p[i][0], y = p[i][1], r = Math.hypot(x, y) || 1e-9, gl = -dlnf(r);          // ∇ln n = −∇ln f
            const gx = gl * x / r, gy = gl * y / r, gd = gx * tx + gy * ty, px = gx - gd * tx, py = gy - gd * ty;
            p[i] = [(P[0] + Nx[0]) / 2 - h * h / 2 * px, (P[1] + Nx[1]) / 2 - h * h / 2 * py];
          }
          if (sweep % 6 === 5) { const q = resample(p); for (let i = 0; i <= N; i++) p[i] = q[i]; }
        }
      }
      const toPx = v => [PX + RP * v[0], PY - RP * v[1]];
      kit.drag(st, {
        hit: p => { if (!FT || !V.tri) return null; const q = FT.to(p); for (let k = 0; k < 3; k++) { const d = toPx(verts[k]); if (Math.hypot(q.x - d[0], q.y - d[1]) < 15) return k; } return null; },
        move: (k, p) => { const q = FT.to(p); let x = (q.x - PX) / RP, y = (PY - q.y) / RP; const r = Math.hypot(x, y); if (r > 0.93) { x *= 0.93 / r; y *= 0.93 / r; } verts[k] = [x, y]; },
        hover: true
      });
      const angleAt = (u, v) => { const d = (u[0] * v[0] + u[1] * v[1]) / ((Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1])) || 1); return Math.acos(clamp(d, -1, 1)); };
      let lastMode = V.mode;
      const loop = kit.loop(() => {
        if (V.mode !== lastMode) { paths = null; lastMode = V.mode; }
        if (!paths) paths = [0, 1, 2].map(k => straight(verts[k], verts[(k + 1) % 3]));
        paths.forEach((p, k) => { p[0] = verts[k].slice(); p[N] = verts[(k + 1) % 3].slice(); relax(p); });
        const angs = [0, 1, 2].map(k => { const out = paths[k], inn = paths[(k + 2) % 3]; return angleAt([out[1][0] - out[0][0], out[1][1] - out[0][1]], [inn[N - 1][0] - inn[N][0], inn[N - 1][1] - inn[N][1]]) * 180 / Math.PI; });
        const sum = angs[0] + angs[1] + angs[2];
        const rho = V.rho, rm = measR(rho), Cm = 2 * Math.PI * rho / fr(rho), ratio = Cm / rm;
        ro.set('r', (rm / L0).toFixed(1));
        ro.set('C', (Cm / L0).toFixed(1));
        ro.set('q', ratio.toFixed(3) + (Math.abs(ratio - 2 * Math.PI) < 0.005 ? ' = 2π' : ratio > 2 * Math.PI ? ' > 2π' : ' < 2π'));
        ro.set('ang', V.tri ? angs.map(a => a.toFixed(1) + '°').join(' + ') : '—');
        ro.set('sum', V.tri ? sum.toFixed(1) + '°  (' + (sum - 180 >= 0 ? '+' : '') + (sum - 180).toFixed(1) + '°)' : '—');
        ro.set('kind', V.mode === 'even' || V.a === 0 ? 'a flat plane — Euclid holds' : V.mode === 'hot' ? 'a saddle near the centre (negative curvature)' : 'a sphere near the centre (positive curvature)');

        const c = st.begin(), C = kit.colors();
        FT = fit(c, st, W0, H0);
        // the plate, coloured by temperature
        const hot = 'hsl(18 90% ' + (C.dark ? '45%' : '62%') + ')', cool = 'hsl(210 55% ' + (C.dark ? '32%' : '82%') + ')', warm = 'hsl(35 85% ' + (C.dark ? '38%' : '72%') + ')';
        const grd = c.createRadialGradient(PX, PY, 0, PX, PY, RP);
        if (V.mode === 'hot') { grd.addColorStop(0, hot); grd.addColorStop(0.55, warm); grd.addColorStop(1, cool); }
        else if (V.mode === 'cold') { grd.addColorStop(0, cool); grd.addColorStop(0.55, warm); grd.addColorStop(1, hot); }
        else { grd.addColorStop(0, warm); grd.addColorStop(1, warm); }
        c.fillStyle = grd; c.beginPath(); c.arc(PX, PY, RP, 0, 6.2832); c.fill();
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.stroke();
        // the circle, with rulers along its radius and round it
        if (V.circ) {
          const R = rho * RP;
          let r = 0, k = 0;
          while (r < rho - 1e-9 && k < 400) { const len = Math.min(L0 * fr(r + L0 * fr(r) / 2), rho - r); c.strokeStyle = k % 2 ? C.text : C.bg || '#fff'; c.lineWidth = 5; c.beginPath(); c.moveTo(PX + RP * r, PY); c.lineTo(PX + RP * (r + len), PY); c.stroke(); r += len; k++; }
          c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(PX, PY - 2.5, R, 5);
          const dth = L0 * fr(rho) / rho, nC = Math.floor(2 * Math.PI / dth);
          for (let j = 0; j <= nC; j++) { const a0 = j * dth, a1 = Math.min(2 * Math.PI, (j + 1) * dth); c.strokeStyle = j % 2 ? C.text : C.bg || '#fff'; c.lineWidth = 5; c.beginPath(); c.arc(PX, PY, R, -a1, -a0); c.stroke(); }
          c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.arc(PX, PY, R + 3, 0, 6.2832); c.stroke();
          kit.dot(c, PX, PY, 3.5, C.text);
        }
        // the triangle of the bugs' straight lines
        if (V.tri) {
          c.strokeStyle = C.accent; c.lineWidth = 3;
          for (const p of paths) { c.beginPath(); p.forEach((q, i) => { const d = toPx(q); if (i) c.lineTo(d[0], d[1]); else c.moveTo(d[0], d[1]); }); c.stroke(); }
          c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([3, 4]);
          c.beginPath(); for (let k = 0; k <= 3; k++) { const d = toPx(verts[k % 3]); if (k) c.lineTo(d[0], d[1]); else c.moveTo(d[0], d[1]); } c.stroke(); c.setLineDash([]);
          verts.forEach((v, k) => { const d = toPx(v); kit.dot(c, d[0], d[1], 7, C.accent, C.text); txt(c, 'ABC'[k] + ' ' + angs[k].toFixed(0) + '°', d[0] + 10, d[1] - 12, C.text, { size: 12, weight: 700 }); });
        }
        // the side panel
        const X = 420;
        txt(c, 'What the bugs measure', X, 26, C.text, { size: 13, weight: 700 });
        txt(c, 'circle radius: ' + (rm / L0).toFixed(1) + ' rulers', X, 52, C.text, { size: 12 });
        txt(c, 'circumference: ' + (Cm / L0).toFixed(1) + ' rulers', X, 72, C.text, { size: 12 });
        txt(c, 'C / r = ' + ratio.toFixed(3) + '   (2π = 6.283)', X, 92, Math.abs(ratio - 2 * Math.PI) < 0.005 ? C.ok : C.warn, { size: 12, weight: 600 });
        if (V.tri) txt(c, 'angle sum = ' + sum.toFixed(1) + '°', X, 122, Math.abs(sum - 180) < 0.5 ? C.ok : C.warn, { size: 12, weight: 600 });
        txt(c, 'blue lines: shortest paths in rulers', X, 152, C.accent, { size: 11 });
        txt(c, 'dashed: straight to us, not to them', X, 170, C.muted, { size: 11 });
        // a ruler scale: how long a ruler is at the centre and at the rim
        txt(c, 'one ruler at the centre / at the rim:', X, 206, C.muted, { size: 11 });
        c.strokeStyle = C.text; c.lineWidth = 5;
        c.beginPath(); c.moveTo(X, 226); c.lineTo(X + RP * L0 * fr(0), 226); c.stroke();
        c.beginPath(); c.moveTo(X, 244); c.lineTo(X + RP * L0 * fr(1), 244); c.stroke();
        txt(c, '×' + fr(0).toFixed(2), X + RP * L0 * fr(0) + 8, 226, C.text, { size: 11 });
        txt(c, '×' + fr(1).toFixed(2), X + RP * L0 * fr(1) + 8, 244, C.text, { size: 11 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

})();
