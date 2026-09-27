/* HYPER-PHARMACEUTICS · sims/solid-dosage.js — simulations for solid dosage forms (content/solid-dosage.js).
 *   solid-hopper          powder in a hopper: mass or funnel flow (an approximation to Jenike's chart for cones), arching,
 *                         rat-holes and Beverloo discharge; a tapped-density cylinder (Carr index, Hausner ratio) and a heap
 *                         for the angle of repose — all from one powder whose cohesion follows particle size and humidity
 *   solid-granulator      wet granulation in a high-shear mixer: liquid saturation (Kristensen), consolidation, granule growth,
 *                         impeller power and the end point, then fluid-bed drying to a loss-on-drying target
 *   solid-press           one station of a rotary press: fill, pre-compression, main compression, dwell, ejection; the Heckel
 *                         plot and tabletability of four materials, speed sensitivity and a teaching capping index
 *   solid-coating         a perforated coating pan: spray against drying (exhaust temperature and humidity by an energy
 *                         balance), weight gain, film thickness and tablet-to-tablet coat variation falling as 1/√passes
 *   solid-uniformity      a blend mixed in a bin (and segregating), tablets pressed from it and assayed; the acceptance value
 *                         of USP <905> / Ph. Eur. 2.9.40, and the particle-count limit of low-dose uniformity
 *   solid-gi-release      four tablets travelling down the gut together (immediate, enteric, matrix, osmotic): pH, transit,
 *                         release, absorption and the blood levels of a hypothetical drug
 *   solid-osmotic         an osmotic pump (Theeuwes) beside a hypromellose matrix (Higuchi): release, rate, √t plot and
 *                         blood levels (kit.med.pk with the release fed in as short infusions)
 *   solid-disintegration  tablets in the disintegration basket: water wicking in (Washburn), disintegrant swelling, coats
 * All drugs are hypothetical; these are teaching models, not dosing or manufacturing tools. Helper functions not in
 * the engine (a seeded random source, the acceptance value, a Magnus saturation pressure) live inside this file.
 */
(function () {
  'use strict';
  const DEG = Math.PI / 180;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fin = (x, d) => (Number.isFinite(x) ? x : (d || 0));
  // a small seeded random source (reproducible) and a normal deviate from it
  function rng(seed) { let s = (seed >>> 0) || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
  const gauss = r => { const u = Math.max(1e-12, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  function plotDiv(box, pad) { const d = document.createElement('div'); d.style.padding = pad || '4px 10px 10px'; box.stage.appendChild(d); return d; }
  function twoPlots(box) {
    const gb = document.createElement('div');
    gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px';
    box.stage.appendChild(gb);
    const a = document.createElement('div'), b = document.createElement('div'); gb.appendChild(a); gb.appendChild(b);
    return [a, b];
  }
  function rrect(c, x, y, w, h, r) { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); }
  const mmss = s => { s = Math.max(0, fin(s)); const m = Math.floor(s / 60); return m >= 60 ? (s / 3600).toFixed(1) + ' h' : m + ' min ' + String(Math.round(s - m * 60)).padStart(2, '0') + ' s'; };

  /* ================================================================ solid-hopper */
  // flow classes of USP <1174> by angle of repose
  const aorClass = a => a <= 30 ? 'excellent' : a <= 35 ? 'good' : a <= 40 ? 'fair' : a <= 45 ? 'passable' : a <= 55 ? 'poor' : a <= 65 ? 'very poor' : 'very, very poor';
  // an approximation (after Arnold and McLean) to Jenike's mass-flow boundary for conical hoppers: the largest wall
  // angle from the vertical (°) that still gives mass flow, from the effective angle of friction δ and the wall friction φw
  function thetaCrit(delta, phiw) {
    const sd = Math.sin(delta * DEG), sw = Math.sin(phiw * DEG);
    if (sw >= sd) return 0;
    return Math.max(0, 90 - 0.5 * Math.acos((1 - sd) / (2 * sd)) / DEG - 0.5 * (phiw + Math.asin(sw / sd) / DEG));
  }

  Hyper.sim('solid-hopper', {
    title: 'Powder in a hopper',
    blurb: `One powder, three classic experiments. Its cohesion follows from the particle size and the humidity, and a glidant can reduce it; from that the model sets the Carr index, the angle of repose, the strength that lets it arch, and the effective angle of friction that decides the flow pattern. The coloured layers show how the powder moves. In **mass flow** every layer moves down together (first in, first out). In **funnel flow** only a central channel moves, the top caves into a crater at the angle of repose, and powder near the walls waits until last, or stays behind for good. The discharge rate comes from the Beverloo equation, reduced for cohesive powders, and the chart below is an approximation to Jenike's mass-flow boundary for conical hoppers. It is a teaching model, not a design method.

**Try this**
- Start with 150 µm granules and a 20° hopper, then switch the wall to "rough": the same powder turns from mass flow to funnel flow. Watch which coloured layers leave first.
- Shrink the particles to 40 µm. The powder arches over the outlet; widen the outlet until it flows. Then switch to humid air (it arches again) and add the glidant.
- Make the hopper shallow (40°) with 50 µm particles and a 40 mm outlet: a rat-hole drains and the rest of the powder stays on the walls.
- Switch to **Tapped density**, tap to 1250 and read the Carr index; then to **Angle of repose**. Coarse, dry, glidant-treated powders score best in all three.`,
    mount(box, kit, params) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const gb = plotDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Experiment', options: [['Hopper discharge', 'hopper'], ['Tapped density (Carr index)', 'tap'], ['Angle of repose', 'heap']], value: (params && params.mode) || 'hopper' },
        { id: 'd', label: 'Particle size', min: 10, max: 1000, value: 150, unit: 'µm', log: true, sig: 2 },
        { id: 'rh', type: 'select', label: 'Air humidity', options: [['Dry (30 % RH)', 0], ['Humid (75 % RH)', 1]], value: 0 },
        { id: 'glid', type: 'check', label: 'Add 0.3 % colloidal silica (glidant)', value: false },
        { id: 'theta', label: 'Hopper wall angle from vertical', min: 10, max: 45, step: 1, value: 20, unit: '°' },
        { id: 'wall', type: 'select', label: 'Wall surface', options: [['Polished steel (φw 12°)', 12], ['Ordinary steel (φw 20°)', 20], ['Rough or plastic (φw 30°)', 30]], value: 20 },
        { id: 'D0', label: 'Outlet diameter', min: 5, max: 60, step: 1, value: 25, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'go', label: 'Start again', primary: true }, { id: 'tap10', label: 'Tap 10×' }, { id: 'tap', label: 'Tap to 1250' }] }
      ], onCtl);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pw', 'This powder'], ['pat', 'Flow pattern'], ['st', 'What happens'], ['W', 'Discharge rate'], ['out', 'Discharged (25 kg hopper)'],
        ['taps', 'Taps'], ['vol', 'Volume of 40 g'], ['dens', 'Bulk / tapped density'], ['ci', 'Carr index · Hausner ratio'], ['hh', 'Heap on a 100 mm disc'], ['ang', 'Angle of repose']]);
      const plot = kit.plot(gb, { x: { label: '' }, y: { label: '' }, legend: true }, 190);

      /* ---- the powder */
      function props(dd) {
        const c = clamp(0.5 * Math.log10(250 / (dd || V.d)) + 0.25 + 0.2 * V.rh - (V.glid ? 0.18 : 0), 0, 1);
        const CI = 6 + 34 * c, rhoT = 600, rhoB = rhoT * (1 - CI / 100);              // kg/m³
        return { c, CI, HR: 100 / (100 - CI), rhoT, rhoB, aor: 27 + 38 * c, delta: 34 + 18 * c, fc: 250 * c * c * c };   // fc: unconfined yield strength (Pa)
      }
      let A = null;
      function analyse() {
        const p = props(), g = 9.81;
        const th = thetaCrit(p.delta, V.wall), mass = V.theta <= th - 3;               // designers keep a 3° margin
        const Bc = (2 + V.theta / 60) * p.fc / (p.rhoB * g) * 1000;                     // mm, cohesive arch (Jenike)
        const Df = 4 * p.fc / (p.rhoB * g) * 1000;                                      // mm, stable rat-hole
        let state = 'flow';
        if (V.D0 < 6 * V.d / 1000) state = 'blocked';
        else if (V.D0 < Bc) state = 'arch';
        else if (!mass && V.D0 < Df) state = 'rathole';
        const Do = V.D0 / 1000, dm = V.d * 1e-6;
        const Wb = Do > 1.4 * dm ? 0.58 * p.rhoB * Math.sqrt(g) * Math.pow(Do - 1.4 * dm, 2.5) : 0;   // kg/s
        const W = state === 'blocked' || state === 'arch' ? 0 : Wb * (1 - 0.5 * p.c);
        return { p, th, mass, Bc, Df, state, W };
      }

      /* ---- hopper geometry and particles */
      let G = null;
      const hop = { parts: [], N: 1, out: 0, t: 0, v0: 40, T: 12, done: false, rad: 3, stream: [] };
      function geom() {
        const W = st.W, H = st.H, tanT = Math.tan(V.theta * DEG), top = 16;
        const Hc = H * 0.22, Havail = H * 0.5, k = clamp(V.D0 / 150, 0.04, 0.4);
        const B = Math.min(Math.min(W * 0.2, 130), Havail * tanT / (1 - k)), r0 = k * B;
        const yC = top + Hc, yO = yC + (B - r0) / tanT;
        return { cx: W * 0.28, top, B, r0, yC, yO, tanT };
      }
      const halfW = y => y <= G.yC ? G.B : Math.max(G.r0, G.B - (y - G.yC) * G.tanT);
      const tanB = Math.tan(8 * DEG);
      const chanW = y => Math.min(halfW(y), G.r0 + Math.max(0, G.yO - y) * tanB);
      function fill() {
        G = geom(); A = analyse();
        const yF = G.top + 8, area = 2 * G.B * (G.yC - yF) + (G.B + G.r0) * (G.yO - G.yC);
        const sp = Math.max(2, Math.sqrt(area / 380)), parts = [], r = rng(7 + Math.round(V.d));
        const archH = G.r0 * 1.3 + 6;
        let row = 0;
        for (let y = yF + sp * 0.5; y < G.yO - sp * 0.4; y += sp * 0.87, row++) {
          const w = halfW(y) - sp * 0.45;
          for (let x = -w + (row % 2 ? sp * 0.5 : 0); x <= w; x += sp) {
            const q = { x: x + (r() - 0.5) * sp * 0.2, y: y + (r() - 0.5) * sp * 0.2, band: Math.floor((y - yF) / ((G.yO - yF) / 7)) % 2, out: false };
            // an arch leaves a hollow over the outlet
            if (A.state === 'arch' && Math.abs(q.x) < G.r0 + 6 && q.y > G.yO - archH * (1 - Math.pow(q.x / (G.r0 + 6), 2))) continue;
            parts.push(q);
          }
        }
        hop.parts = parts; hop.N = Math.max(1, parts.length); hop.out = 0; hop.t = 0; hop.done = false; hop.rad = sp * 0.42; hop.stream = [];
        hop.T = clamp(12 * Math.sqrt(0.2 / Math.max(A.W, 1e-4)), 5, 30);
        hop.v0 = area / (2 * Math.max(1, G.r0) * hop.T);
      }
      function stepHopper(dt) {
        if (hop.done || A.state === 'blocked' || A.state === 'arch') return;
        hop.t += dt;
        const tanA = Math.tan(A.p.aor * DEG), ca = Math.cos(A.p.aor * DEG), sa = Math.sin(A.p.aor * DEG);
        const surge = 1 + 0.6 * A.p.c * Math.sin(hop.t * 7.3) * Math.sin(hop.t * 2.1);   // cohesive powders flow in surges
        const v0 = hop.v0 * Math.max(0.15, surge);
        let yT = Infinity;
        if (!A.mass) for (const q of hop.parts) if (!q.out && Math.abs(q.x) < chanW(q.y)) yT = Math.min(yT, q.y);
        let moved = 0;
        for (const q of hop.parts) {
          if (q.out) continue;
          let vx = 0, vy = 0;
          if (A.mass) {
            const w = halfW(q.y), s = q.x / w, dw = w - halfW(q.y + 1);
            vy = v0 * G.r0 / w * (1.12 - 0.3 * s * s); vx = -s * dw * vy;
          } else {
            const w = chanW(q.y);
            if (Math.abs(q.x) < w) {
              const s = q.x / w, dw = w - chanW(q.y + 1);
              vy = v0 * G.r0 / w * (1.1 - 0.3 * s * s); vx = -s * dw * vy;
            } else if (A.state !== 'rathole') {
              const y0 = Number.isFinite(yT) ? yT : G.yO, w0 = Number.isFinite(yT) ? chanW(yT) : G.r0;
              const yA = y0 - (Math.abs(q.x) - w0) * tanA;                         // the crater at the angle of repose
              if (q.y < yA - hop.rad) { const vs = v0 * 0.35; vx = -Math.sign(q.x) * vs * ca; vy = vs * sa; }
            }
          }
          if (vx || vy) {
            moved++; q.x += vx * dt; q.y += vy * dt;
            const w = halfW(q.y) - hop.rad * 0.5; if (q.x > w) q.x = w; if (q.x < -w) q.x = -w;
          }
          if (q.y > G.yO + hop.rad) { q.out = true; hop.out++; if (hop.stream.length < 80) hop.stream.push({ x: q.x * 0.6, y: G.yO, v: 30, band: q.band }); }
        }
        if (!moved) hop.done = true;
        const floor = st.H - 10 - (st.H - 10 - (G.yO + 34)) * 0.8 * hop.out / hop.N;
        for (const s of hop.stream) { s.v += 900 * dt; s.y += s.v * dt; }
        hop.stream = hop.stream.filter(s => s.y < floor);
      }
      function drawHopper(c, C) {
        const cx = G.cx, cols = [kit.hue(35), kit.hue(205)];
        // collecting bin
        const bx = Math.max(G.B, 60) * 1.1, by = G.yO + 34, bh = st.H - 10 - by, lvl = bh * 0.8 * hop.out / hop.N;
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx - bx, by); c.lineTo(cx - bx, by + bh); c.lineTo(cx + bx, by + bh); c.lineTo(cx + bx, by); c.stroke();
        if (lvl > 0.5) { c.fillStyle = kit.hue(35, 0.55); c.fillRect(cx - bx + 1, by + bh - lvl, 2 * bx - 2, lvl); }
        for (const s of hop.stream) { c.fillStyle = cols[s.band]; c.beginPath(); c.arc(cx + s.x, s.y, Math.max(1, hop.rad * 0.8), 0, 6.283); c.fill(); }
        // the powder, in coloured layers
        for (const q of hop.parts) if (!q.out) { c.fillStyle = cols[q.band]; c.beginPath(); c.arc(cx + q.x, q.y, hop.rad, 0, 6.283); c.fill(); }
        // the flow channel of funnel flow
        if (!A.mass && A.state !== 'arch' && A.state !== 'blocked') {
          c.strokeStyle = C.muted; c.setLineDash([4, 4]); c.lineWidth = 1; c.beginPath();
          for (const sg of [-1, 1]) { c.moveTo(cx + sg * G.r0, G.yO); for (let y = G.yO; y >= G.top; y -= 6) c.lineTo(cx + sg * chanW(y), y); }
          c.stroke(); c.setLineDash([]);
        }
        // walls
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath();
        c.moveTo(cx - G.B, G.top); c.lineTo(cx - G.B, G.yC); c.lineTo(cx - G.r0, G.yO); c.moveTo(cx + G.r0, G.yO); c.lineTo(cx + G.B, G.yC); c.lineTo(cx + G.B, G.top); c.stroke();
        // the wall angle
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(cx + G.B, G.yC); c.lineTo(cx + G.B, G.yC + 50); c.stroke(); c.setLineDash([]);
        kit.label(c, 'θ = ' + V.theta + '°', cx + G.B + 6, G.yC + 30, { align: 'left', size: 11, color: C.muted });
        if (A.state === 'arch' || A.state === 'blocked') {
          const archH = G.r0 * 1.3 + 6;
          c.strokeStyle = C.bad; c.lineWidth = 3; c.beginPath(); c.moveTo(cx - G.r0 - 6, G.yO); c.quadraticCurveTo(cx, G.yO - 2 * archH, cx + G.r0 + 6, G.yO); c.stroke();
        }
        // the story, on the right
        const x0 = st.W * 0.56, C2 = A.mass ? C.ok : C.warn;
        let y = 28;
        const line = (t, o) => { kit.label(c, t, x0, y, Object.assign({ align: 'left', size: 12.5, color: C.text }, o || {})); y += (o && o.gap) || 19; };
        line(A.mass ? 'Mass flow' : 'Funnel flow', { size: 16, weight: 700, color: C2, gap: 23 });
        line(A.mass ? 'all the powder moves: first in, first out' : 'only a central channel moves: first in, last out', { color: C.muted });
        line('limit for mass flow: θ < ' + A.th.toFixed(0) + '° (δ = ' + A.p.delta.toFixed(0) + '°, φw = ' + V.wall + '°)', { color: C.muted, gap: 28 });
        const msg = A.state === 'blocked' ? ['Blocked', 'the outlet is under six particle diameters'] :
          A.state === 'arch' ? ['A cohesive arch: no flow', 'this powder needs an outlet of about ' + A.Bc.toFixed(0) + ' mm'] :
          A.state === 'rathole' && hop.done ? ['A stable rat-hole', 'the channel emptied; the rest clings to the walls'] :
          A.state === 'rathole' ? ['Rat-holing', 'a channel is draining; will the walls hold?'] :
          hop.done && hop.out < hop.N ? ['Stopped: ' + (100 * (1 - hop.out / hop.N)).toFixed(0) + ' % left behind', 'dead zones that funnel flow never empties'] :
          hop.done ? ['Empty', 'the hopper discharged completely'] : ['Flowing', A.p.c > 0.45 ? 'in surges: a cohesive powder' : 'steadily'];
        line(msg[0], { size: 14, weight: 700, color: A.state === 'flow' ? C.text : C.bad, gap: 20 });
        line(msg[1], { color: C.muted });
      }

      /* ---- tapped density */
      const tap = { n: 0, target: 0, pts: [] };
      const MASS = 40;                                                            // g in a 150 mL cylinder
      function tapV(n) {
        const p = props(), V0 = MASS / (p.rhoB / 1000), Vinf = V0 - V0 * (p.CI / 100) / (25 / 26), bn = 0.02 * n;
        return V0 - (V0 - Vinf) * bn / (1 + bn);
      }
      function stepTap(dt) {
        if (tap.n < tap.target) {
          const before = tap.n;
          tap.n = Math.min(tap.target, tap.n + (20 + 1.2 * (tap.target - tap.n)) * dt);
          if (tap.target - tap.n < 0.5) tap.n = tap.target;
          if (tap.n === tap.target && before !== tap.n) { tap.pts.push([tap.n, tapV(tap.n)]); plotMode(); }
        }
      }
      function drawTap(c, C) {
        const cx = st.W * 0.28, top = 26, cylH = st.H - 70, cw = Math.min(70, st.W * 0.1);
        const bounce = tap.n < tap.target ? 5 * Math.abs(Math.sin(Math.PI * tap.n)) : 0;
        const y0 = top - bounce, base = y0 + cylH, vol = tapV(tap.n), ph = cylH * vol / 150;
        // anvil
        c.fillStyle = C.bg2; c.fillRect(cx - cw, st.H - 36, 2 * cw, 26); c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(cx - cw, st.H - 36, 2 * cw, 26);
        // powder with a speckle
        c.fillStyle = kit.hue(35, 0.75); c.fillRect(cx - cw / 2, base - ph, cw, ph);
        const r = rng(3); c.fillStyle = kit.hue(35);
        for (let i = 0; i < 120; i++) { const yy = base - r() * ph, xx = cx - cw / 2 + r() * cw; c.fillRect(xx, yy, 1.6, 1.6); }
        // cylinder and graduations
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(cx - cw / 2, y0 - 6); c.lineTo(cx - cw / 2, base); c.lineTo(cx + cw / 2, base); c.lineTo(cx + cw / 2, y0 - 6); c.stroke();
        c.lineWidth = 1;
        for (let m = 10; m <= 150; m += 10) {
          const yy = base - cylH * m / 150;
          c.beginPath(); c.moveTo(cx + cw / 2 - (m % 50 ? 6 : 12), yy); c.lineTo(cx + cw / 2, yy); c.stroke();
          if (m % 50 === 0) kit.label(c, m + ' mL', cx + cw / 2 + 6, yy, { align: 'left', size: 11, color: C.muted });
        }
        const V0 = tapV(0);
        c.strokeStyle = C.accent; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(cx - cw / 2 - 14, base - cylH * V0 / 150); c.lineTo(cx + cw / 2, base - cylH * V0 / 150); c.stroke(); c.setLineDash([]);
        kit.label(c, 'poured ' + V0.toFixed(0) + ' mL', cx - cw / 2 - 18, base - cylH * V0 / 150, { align: 'right', size: 11.5, color: C.accent });
        kit.label(c, vol.toFixed(1) + ' mL', cx - cw / 2 - 18, base - ph + 16, { align: 'right', size: 13, weight: 700, color: C.text });
        const x0 = st.W * 0.56; let y = 30;
        kit.label(c, Math.round(tap.n) + ' taps', x0, y, { align: 'left', size: 16, weight: 700, color: C.text }); y += 26;
        const p = props(), ci = 100 * (1 - vol / V0);
        kit.label(c, 'Carr index now ' + ci.toFixed(1) + ' %', x0, y, { align: 'left', size: 13, color: C.text }); y += 20;
        kit.label(c, 'after 1250 taps: ' + p.CI.toFixed(1) + ' % — ' + P.flowClass(p.CI), x0, y, { align: 'left', size: 12.5, color: C.muted }); y += 20;
        kit.label(c, 'USP <1174>: read at 10, 500 and 1250 taps', x0, y, { align: 'left', size: 12, color: C.muted });
      }

      /* ---- angle of repose */
      const heap = { V: 0, t: 0, seed: 1, off: 0 };
      function stepHeap(dt) { heap.t += dt; }
      function drawHeap(c, C) {
        const p = props(), alpha = p.aor + heap.off, ta = Math.tan(alpha * DEG);
        const R = 50, hmax = R * ta, sc = Math.min(st.W * 0.42 / (2 * R + 30), (st.H - 110) / (hmax + 10));
        const cx = st.W * 0.28, base = st.H - 40;
        const Vfull = Math.PI * R * R * R * ta / 3, pour = Math.min(heap.t / 7, 1.25), Vp = Vfull * pour;
        const r = Math.min(R, Math.cbrt(3 * Math.max(0, Vp) / (Math.PI * ta))), h = r * ta;
        heap.h = h;
        // pedestal and floor
        c.fillStyle = C.bg2; c.fillRect(cx - R * sc, base, 2 * R * sc, 14); c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(cx - R * sc, base, 2 * R * sc, 14);
        c.beginPath(); c.moveTo(cx - st.W * 0.26, st.H - 6); c.lineTo(cx + st.W * 0.26, st.H - 6); c.stroke();
        // spilt powder beside the disc once the heap is full
        const spill = Math.max(0, Vp - Vfull) / Vfull;
        if (spill > 0) { c.fillStyle = kit.hue(35, 0.7); for (const sg of [-1, 1]) { c.beginPath(); c.moveTo(cx + sg * (R * sc + 2), st.H - 6); c.lineTo(cx + sg * (R * sc + 2 + 40 * spill + 4), st.H - 6); c.lineTo(cx + sg * (R * sc + 2), st.H - 6 - 22 * spill); c.fill(); } }
        // the heap, rougher for cohesive powders
        if (r > 0.5) {
          const rr = rng(heap.seed), bumps = Array.from({ length: 24 }, () => (rr() - 0.5));
          c.fillStyle = kit.hue(35, 0.85); c.beginPath(); c.moveTo(cx - r * sc, base);
          for (let i = 0; i <= 24; i++) {
            const x = -r + 2 * r * i / 24, yy = (r - Math.abs(x)) * ta, bump = i && i < 24 ? bumps[i] * p.c * 0.16 * h : 0;
            c.lineTo(cx + x * sc, base - (yy + bump) * sc);
          }
          c.closePath(); c.fill();
        }
        // the funnel and the falling stream
        const fy = base - (hmax + 18) * sc - 30;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(cx - 34, fy - 34); c.lineTo(cx - 5, fy); c.lineTo(cx - 5, fy + 10); c.moveTo(cx + 34, fy - 34); c.lineTo(cx + 5, fy); c.lineTo(cx + 5, fy + 10); c.stroke();
        if (pour < 1.25) { c.fillStyle = kit.hue(35); for (let i = 0; i < 16; i++) { const yy = fy + 12 + ((heap.t * 260 + i * 37) % Math.max(10, base - h * sc - fy - 12)); c.fillRect(cx - 1.5 + ((i * 7) % 5) - 2, yy, 3, 3); } }
        // the angle, measured
        if (r >= R - 1e-6) {
          c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.arc(cx - R * sc, base, 36, -alpha * DEG, 0); c.stroke();
          kit.label(c, alpha.toFixed(0) + '°', cx - R * sc + 42, base - 12, { align: 'left', size: 13, weight: 700, color: C.accent });
        }
        const x0 = st.W * 0.56; let y = 30;
        kit.label(c, 'heap height ' + (h / 10).toFixed(2) + ' cm', x0, y, { align: 'left', size: 15, weight: 700, color: C.text }); y += 24;
        kit.label(c, 'tan α = 2h/D = ' + (2 * h / 100).toFixed(2), x0, y, { align: 'left', size: 13, color: C.text }); y += 20;
        kit.label(c, r >= R - 1e-6 ? 'α = ' + alpha.toFixed(1) + '°: ' + aorClass(alpha) + ' flow' : 'pouring… the heap grows until it covers the disc', x0, y, { align: 'left', size: 12.5, color: C.muted });
      }

      /* ---- modes, plots and read-outs */
      function plotMode() {
        const C = kit.colors();
        if (V.mode === 'hopper') {
          const pts = []; for (let pw = 0; pw <= 40; pw += 1) { const t = thetaCrit(A.p.delta, pw); if (t > 0) pts.push([t, pw]); }
          plot.set({ x: { label: 'hopper wall angle from vertical θ (°)', min: 0, max: 50 }, y: { label: 'wall friction φw (°)', min: 0, max: 40 },
            series: [{ pts, label: 'mass-flow limit for δ = ' + A.p.delta.toFixed(0) + '° (mass flow to the left)' }], hlines: [], vlines: [],
            marks: [{ x: V.theta, y: V.wall, label: A.mass ? 'mass flow' : 'funnel flow', color: A.mass ? C.ok : C.warn }] });
        } else if (V.mode === 'tap') {
          const pts = []; for (let n = 0; n <= 1250; n += 10) pts.push([n, tapV(n)]);
          plot.set({ x: { label: 'number of taps', min: 0, max: 1250 }, y: { label: 'volume of 40 g (mL)' },
            series: [{ pts, label: 'this powder', dash: [5, 4] }, { pts: tap.pts.slice(), label: 'your readings', line: false, dots: 4 }], hlines: [], vlines: [{ x: 500, label: '500' }], marks: [] });
        } else {
          const pts = [];
          for (let i = 0; i <= 40; i++) { const dd = 10 * Math.pow(100, i / 40); pts.push([dd, props(dd).aor]); }
          plot.set({ x: { label: 'particle size (µm)', min: 10, max: 1000, log: true }, y: { label: 'angle of repose (°)', min: 20, max: 70 },
            series: [{ pts, label: 'this humidity' + (V.glid ? ', with glidant' : '') }], vlines: [], hlines: [{ y: 35, label: 'good ≤ 35°' }, { y: 45, label: 'passable ≤ 45°' }],
            marks: [{ x: V.d, y: props().aor, label: 'your powder', color: C.accent }] });
        }
      }
      function setMode() {
        const m = V.mode;
        for (const id of ['theta', 'wall', 'D0']) ctl.show(id, m === 'hopper');
        ctl.show('tap10', m === 'tap'); ctl.show('tap', m === 'tap');
        for (const k of ['pat', 'st', 'W', 'out']) ro.show(k, m === 'hopper');
        for (const k of ['taps', 'vol', 'dens', 'ci']) ro.show(k, m === 'tap');
        for (const k of ['hh', 'ang']) ro.show(k, m === 'heap');
        restart();
      }
      function restart() {
        A = analyse();
        if (V.mode === 'hopper') fill();
        if (V.mode === 'tap') { tap.n = 0; tap.target = 0; tap.pts = [[0, tapV(0)]]; }
        if (V.mode === 'heap') { heap.t = 0; heap.seed++; const r = rng(heap.seed * 13); heap.off = (r() - 0.5) * 2 * (0.8 + 3 * props().c); }
        plotMode();
      }
      function onCtl(id) {
        if (id === 'mode') return setMode();
        if (id === 'tap10') { if (V.mode !== 'tap') return; tap.target = Math.min(2500, Math.round(tap.target) + 10); return; }
        if (id === 'tap') { if (V.mode !== 'tap') return; tap.target = tap.target < 1250 ? 1250 : Math.min(2500, tap.target + 250); return; }
        restart();
      }
      function readouts() {
        const p = A.p;
        ro.set('pw', 'Carr ' + p.CI.toFixed(0) + ' %, Hausner ' + p.HR.toFixed(2) + ', repose ' + p.aor.toFixed(0) + '° — ' + P.flowClass(p.CI));
        if (V.mode === 'hopper') {
          ro.set('pat', (A.mass ? 'mass flow' : 'funnel flow') + ' (limit θc ≈ ' + A.th.toFixed(0) + '°)');
          ro.set('st', A.state === 'blocked' ? 'blocked: outlet < 6 particles wide' : A.state === 'arch' ? 'arches: needs an outlet above ' + A.Bc.toFixed(0) + ' mm' :
            A.state === 'rathole' ? 'rat-holes: funnel flow needs > ' + A.Df.toFixed(0) + ' mm' : hop.done && hop.out < hop.N ? 'dead zones left on the walls' : 'flows');
          ro.set('W', A.W > 0 ? (A.W * 1000).toFixed(A.W < 0.01 ? 1 : 0) + ' g/s' + (A.W * 1000 < 20 ? ' — too slow for a 3000-tablet/min press (20 g/s)' : ' — enough for 3000 tablets/min (20 g/s)') : 'none');
          const f = hop.out / hop.N;
          ro.set('out', (100 * f).toFixed(0) + ' %' + (A.W > 0 ? ' after ' + mmss(f * 25 / A.W) : ''));
        } else if (V.mode === 'tap') {
          const v = tapV(tap.n), V0 = tapV(0);
          ro.set('taps', String(Math.round(tap.n)));
          ro.set('vol', v.toFixed(1) + ' mL (poured ' + V0.toFixed(1) + ' mL)');
          ro.set('dens', (MASS / V0).toFixed(3) + ' / ' + (MASS / v).toFixed(3) + ' g/mL');
          const ci = P.carr(MASS / V0, MASS / v), hr = P.hausner(MASS / V0, MASS / v);
          ro.set('ci', ci.toFixed(1) + ' % · ' + hr.toFixed(2) + (tap.n >= 1250 ? ' — ' + P.flowClass(ci) : ' (keep tapping)'));
        } else {
          const h = fin(heap.h), a = Math.atan(2 * h / 100) / DEG;
          ro.set('hh', (h / 10).toFixed(2) + ' cm high');
          ro.set('ang', a.toFixed(1) + '° — ' + aorClass(a));
        }
      }
      st.onResize(() => { if (V.mode === 'hopper') fill(); });
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        const n = Math.max(1, Math.ceil(dt / 0.01));
        for (let i = 0; i < n; i++) {
          if (V.mode === 'hopper') stepHopper(dt / n);
          else if (V.mode === 'tap') stepTap(dt / n);
          else stepHeap(dt / n);
        }
        if (V.mode === 'hopper') drawHopper(c, C); else if (V.mode === 'tap') drawTap(c, C); else drawHeap(c, C);
        readouts();
      }, box.stage);
      setMode();
      loop.start();
    }
  });

  /* ================================================================ solid-granulator */
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  Hyper.sim('solid-granulator', {
    title: 'Wet granulation to the end point',
    blurb: `A 10 kg batch in a high-shear granulator. Binder solution is sprayed in at the rate you choose while the impeller consolidates the mass. The liquid saturation of the granules is worked out from the liquid-to-solid ratio and the porosity, $S = H(1-\\varepsilon)\\rho_s/(\\varepsilon\\rho_l)$, and it decides the state: pendular, funicular, capillary or overwet. Granule size and impeller power follow it, and the power curve is what operators watch to find the end point. The strength of the wet granules comes from Rumpf's estimate. Then stop and dry the granules in a fluid bed to a loss on drying of 2 %. One second of animation is one minute of process (three minutes while drying). The numbers are illustrative.

**Try this**
- Run at the default settings and press *Stop and dry* when the power curve levels off (saturation about 80–100 %). That plateau is the classic end point.
- Stop the liquid at a saturation of about 70 % but keep the impeller running. Consolidation alone pushes the saturation up, and eventually into overwetting.
- Halve the impeller speed: consolidation slows, and the same liquid gives smaller, weaker granules.
- Change the primary particle size: finer powder gives stronger granules (strength ∝ 1/d).
- While drying, compare 40 °C and 80 °C inlet air: time against heat stress on the drug.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 260 });
      const [g1, g2] = twoPlots(box);
      const ctl = kit.controls(box.side, [
        { id: 'rate', label: 'Liquid addition rate (of powder mass)', min: 1, max: 5, step: 0.1, value: 2.5, unit: '%/min' },
        { id: 'rpm', label: 'Impeller speed', min: 100, max: 500, step: 10, value: 300, unit: 'rpm' },
        { id: 'd', label: 'Primary particle size', min: 5, max: 100, value: 30, unit: 'µm', log: true, sig: 2 },
        { id: 'Tin', label: 'Dryer inlet air', min: 40, max: 80, step: 1, value: 60, unit: '°C' },
        { type: 'buttons', items: [{ id: 'start', label: 'Start again', primary: true }, { id: 'stopliq', label: 'Stop the liquid' }, { id: 'dry', label: 'Stop and dry' }] }
      ], (id) => {
        if (id === 'start') reset();
        if (id === 'stopliq' && s.liq) { s.liq = false; s.tStop = s.t; }
        if (id === 'dry' && s.phase === 'gran') { s.phase = 'dry'; s.tdry = 0; s.lod0 = s.H / (1 + s.H); s.lod = s.lod0; s.t2 = null; s.dryPts = [[0, s.lod0 * 100]]; plots(); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Process time'], ['H', 'Liquid added'], ['eps', 'Granule porosity ε'], ['S', 'Liquid saturation S'], ['d50', 'Median granule size'], ['sig', 'Wet granule strength (Rumpf)'], ['P', 'Impeller power'], ['lod', 'Loss on drying']]);
      const pP = kit.plot(g1, { x: { label: 'time (min)', min: 0 }, y: { label: 'impeller power (kW)', min: 0 } }, 180);
      const pS = kit.plot(g2, { x: { label: 'time (min)', min: 0 }, y: { label: 'liquid saturation S (%)', min: 0 } }, 180);
      const RHOS = 1.5, RHOL = 1.0, EPS0 = 0.45, EPSMIN = 0.22, GAMMA = 0.065, COS = Math.cos(30 * DEG);
      const sat = (H, e) => H * (1 - e) * RHOS / (e * RHOL);
      let s;
      function reset() {
        s = { t: 0, H: 0, eps: EPS0, d50: V.d, liq: true, tStop: null, phase: 'gran', P: 1, S: 0, Pts: [[0, 1]], Spts: [[0, 0]], tdry: 0, lod: 0, lod0: 0, dryPts: [], t2: null };
        plots();
      }
      const stateOf = S => S < 0.25 ? 'pendular' : S < 0.8 ? 'funicular' : S <= 1.0 ? 'capillary (end point)' : S < 1.2 ? 'droplet: overwet' : 'slurry';
      function power(S) {
        const f = V.rpm / 300;
        return (1.0 + 4.0 * smooth(0.25, 0.85, S) + 4.0 * smooth(1.0, 1.12, S)) * (1 - 0.7 * smooth(1.2, 1.45, S)) * Math.pow(f, 1.3) * Math.pow(30 / V.d, 0.1);
      }
      function stepGran(dt) {                                        // dt in minutes
        s.t += dt;
        if (s.liq) { s.H += V.rate / 100 * dt; if (s.H >= 0.6) { s.H = 0.6; s.liq = false; s.tStop = s.t; } }
        const f = V.rpm / 300, S0 = sat(s.H, s.eps);
        s.eps = EPSMIN + (s.eps - EPSMIN) * Math.exp(-0.08 * f * (S0 > 0.15 ? 1 : 0.4) * dt);
        s.S = sat(s.H, s.eps);
        const Deq = Math.max(V.d, (80 + 900 * smooth(0.2, 0.95, s.S) + 4000 * Math.max(0, s.S - 0.95)) * Math.pow(1 / f, 0.25) * Math.pow(30 / V.d, 0.1));
        s.d50 += (Deq - s.d50) * (1 - Math.exp(-dt / 0.8));
        s.P = power(s.S);
      }
      function stepDry(dt) {
        s.tdry += dt;
        const k = 0.12 * (V.Tin - 25) / 35, eq = 0.015 - 0.007 * (V.Tin - 40) / 40;
        s.lod = eq + (s.lod - eq) * Math.exp(-k * dt);
        if (s.t2 == null && s.lod <= 0.02) s.t2 = s.tdry;
      }
      let acc = 0;
      function record() {
        const last = s.phase === 'gran' ? s.Pts[s.Pts.length - 1] : s.dryPts[s.dryPts.length - 1];
        const now = s.phase === 'gran' ? s.t : s.tdry;
        if (last && now - last[0] < 0.05) return;                     // the clock has stopped
        if (s.phase === 'gran') { s.Pts.push([s.t, s.P]); s.Spts.push([s.t, s.S * 100]); }
        else s.dryPts.push([s.tdry, s.lod * 100]);
        plots();
      }
      function plots() {
        const vl = s.tStop != null ? [{ x: s.tStop, label: 'liquid off' }] : [];
        pP.set({ series: [{ pts: s.Pts.slice(), label: 'power' }], vlines: vl, x: { label: 'time (min)', min: 0, max: Math.max(10, s.t) } });
        if (s.phase === 'gran') pS.set({ series: [{ pts: s.Spts.slice(), label: 'saturation' }], x: { label: 'time (min)', min: 0, max: Math.max(10, s.t) }, y: { label: 'liquid saturation S (%)', min: 0, max: Math.max(120, s.S * 110) }, vlines: vl,
          hlines: [{ y: 25, label: 'pendular | funicular' }, { y: 80, label: 'capillary from 80 %' }, { y: 100, label: 'overwet above 100 %' }] });
        else pS.set({ series: [{ pts: s.dryPts.slice(), label: 'loss on drying' }], x: { label: 'drying time (min)', min: 0, max: Math.max(30, s.tdry) }, y: { label: 'loss on drying (%)', min: 0, max: Math.max(5, s.lod0 * 105) }, vlines: [], hlines: [{ y: 2, label: 'target 2 %' }] });
      }
      const parts = Array.from({ length: 150 }, (_, i) => { const r = rng(101 + i * 7); return { ph: r() * 6.283, k: 0.25 + 0.75 * Math.sqrt(r()), rf: Math.exp(0.35 * gauss(r)), y0: r() }; });
      reset();
      const loop = kit.loop((dt, T) => {
        const n = Math.max(1, Math.ceil(dt / 0.01));
        for (let i = 0; i < n; i++) { if (s.phase === 'gran') { if (s.t < 40) stepGran(dt / n); } else if (s.tdry < 90) stepDry(3 * dt / n); }
        acc += dt; if (acc > 0.2) { acc = 0; record(); }
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const cx = W * 0.27, bw = Math.min(W * 0.36, 280), top = 22, bh = Hh - 44;
        const wet = s.phase === 'gran' ? clamp(s.S, 0, 1.2) : clamp(s.lod / 0.2, 0, 1);
        const col = kit.hue(30, 0.3 + 0.55 * clamp(wet, 0, 1));
        const rpx = clamp(1 + 0.6 * Math.sqrt(s.d50 / 20), 1, 14);
        if (s.phase === 'gran') {
          // bowl
          c.strokeStyle = C.text; c.lineWidth = 2.5; c.beginPath(); c.moveTo(cx - bw / 2, top); c.lineTo(cx - bw / 2, top + bh - 30); c.quadraticCurveTo(cx - bw / 2, top + bh, cx - bw / 2 + 30, top + bh); c.lineTo(cx + bw / 2 - 30, top + bh); c.quadraticCurveTo(cx + bw / 2, top + bh, cx + bw / 2, top + bh - 30); c.lineTo(cx + bw / 2, top); c.stroke();
          const bedY = top + bh * 0.62, a = bw * 0.4, b = bh * 0.28, om = 2 * Math.PI * V.rpm / 300 * 0.35;
          if (s.S > 1.2) {
            c.fillStyle = kit.hue(30, 0.85); c.beginPath(); c.ellipse(cx, bedY + b * 0.3, a * 1.05, b * 0.9, 0, 0, 6.283); c.fill();
          } else {
            c.fillStyle = col;
            for (const p of parts) {
              const ph = p.ph + om * T * (0.6 + 0.4 * p.k);
              const x = cx + a * p.k * Math.cos(ph), y = bedY + b * p.k * Math.sin(ph) * 0.9;
              c.beginPath(); c.arc(x, y, rpx * p.rf, 0, 6.283); c.fill();
            }
          }
          // impeller and chopper
          const ang = T * V.rpm / 60 * 2 * Math.PI * 0.15, L = bw * 0.42;
          c.strokeStyle = C.muted; c.lineWidth = 5; c.beginPath(); c.moveTo(cx - L * Math.cos(ang), top + bh - 8); c.lineTo(cx + L * Math.cos(ang), top + bh - 8); c.stroke();
          c.lineWidth = 3; c.beginPath(); c.moveTo(cx, top + bh); c.lineTo(cx, top + bh - 12); c.stroke();
          const chx = cx + bw / 2 - 16, chy = bedY - 4;
          c.lineWidth = 2; c.beginPath(); for (let k = 0; k < 2; k++) { const aa = T * 18 + k * Math.PI / 2; c.moveTo(chx - 9 * Math.cos(aa), chy - 9 * Math.sin(aa)); c.lineTo(chx + 9 * Math.cos(aa), chy + 9 * Math.sin(aa)); } c.stroke();
          // spray nozzle
          c.fillStyle = C.muted; c.fillRect(cx - 5, top - 14, 10, 14);
          if (s.liq) { c.fillStyle = kit.hue(205, 0.8); for (let i = 0; i < 14; i++) { const u = ((T * 1.7 + i / 14) % 1), sp = (i % 7 - 3) / 3; c.beginPath(); c.arc(cx + sp * u * bw * 0.25, top + 4 + u * (bedY - b - top), 1.8, 0, 6.283); c.fill(); } }
        } else {
          // a fluid-bed dryer
          const w1 = bw * 0.55, w2 = bw * 0.9, yb = top + bh - 16;
          c.strokeStyle = C.text; c.lineWidth = 2.5; c.beginPath(); c.moveTo(cx - w1 / 2, yb); c.lineTo(cx - w2 / 2, top + bh * 0.35); c.lineTo(cx - w2 / 2, top); c.moveTo(cx + w1 / 2, yb); c.lineTo(cx + w2 / 2, top + bh * 0.35); c.lineTo(cx + w2 / 2, top); c.stroke();
          c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(cx - w1 / 2, yb); c.lineTo(cx + w1 / 2, yb); c.stroke(); c.setLineDash([]);
          for (let i = -2; i <= 2; i++) kit.arrow(c, cx + i * w1 / 6, yb + 16, cx + i * w1 / 6, yb + 2, V.Tin > 70 ? C.bad : C.warn, 1.5);
          c.fillStyle = col;
          for (const p of parts) {
            const hgt = (0.2 + 0.6 * p.k) * bh * 0.55, y = yb - 6 - hgt * Math.abs(Math.sin(T * (1.3 + p.k) + p.ph));
            const frac = (yb - y) / (yb - top - bh * 0.35 + 1e-9), half = w1 / 2 + (w2 - w1) / 2 * clamp(frac, 0, 1) - 6;
            c.beginPath(); c.arc(cx + (p.y0 - 0.5) * 2 * half, y, rpx * p.rf, 0, 6.283); c.fill();
          }
          kit.label(c, 'inlet air ' + V.Tin + ' °C', cx, top + bh + 12, { size: 11.5, color: C.muted });
        }
        // the story, on the right
        const x0 = W * 0.55; let y = 28;
        const line = (t, o) => { kit.label(c, t, x0, y, Object.assign({ align: 'left', size: 12.5, color: C.text }, o || {})); y += (o && o.gap) || 19; };
        if (s.phase === 'gran') {
          const stt = stateOf(s.S), good = s.S >= 0.8 && s.S <= 1.0, over = s.S > 1.0;
          line('t = ' + s.t.toFixed(1) + ' min' + (s.liq ? ' · spraying binder' : ' · massing'), { size: 14, weight: 700, gap: 24 });
          line('S = ' + (s.S * 100).toFixed(0) + ' %: ' + stt, { size: 15, weight: 700, color: good ? C.ok : over ? C.bad : C.text, gap: 22 });
          line(good ? 'strong, dense granules: stop and dry now' : over ? 'liquid on the surfaces: a paste is forming' : s.S < 0.25 ? 'separate liquid bridges; granules barely grow' : 'bridges joining up; granules growing', { color: C.muted });
          line('median granule ' + (s.d50 >= 1000 ? (s.d50 / 1000).toFixed(1) + ' mm' : s.d50.toFixed(0) + ' µm'), { color: C.muted });
        } else {
          line('Fluid-bed drying: ' + s.tdry.toFixed(0) + ' min', { size: 14, weight: 700, gap: 24 });
          line('loss on drying ' + (s.lod * 100).toFixed(1) + ' %', { size: 15, weight: 700, color: s.lod <= 0.02 ? C.ok : C.text, gap: 22 });
          line(s.t2 != null ? 'reached 2 % after ' + s.t2.toFixed(0) + ' min' : 'target 2 %', { color: C.muted });
          line(V.Tin > 70 ? 'hot air dries fast, but heat-sensitive drugs may degrade' : V.Tin < 50 ? 'gentle, but slow' : 'a common compromise', { color: C.muted });
        }
        const sig = s.S * 6 * (1 - s.eps) / s.eps * GAMMA * COS / (V.d * 1e-6);
        ro.set('t', s.t.toFixed(1) + ' min' + (s.phase === 'dry' ? ' + ' + s.tdry.toFixed(0) + ' min drying' : ''));
        ro.set('H', (s.H * 100).toFixed(1) + ' % (' + (s.H * 10).toFixed(2) + ' kg on 10 kg)');
        ro.set('eps', (s.eps * 100).toFixed(1) + ' %');
        ro.set('S', (s.S * 100).toFixed(0) + ' % — ' + stateOf(s.S));
        ro.set('d50', s.d50 >= 1000 ? (s.d50 / 1000).toFixed(2) + ' mm' : s.d50.toFixed(0) + ' µm');
        ro.set('sig', s.S > 1.0 ? 'paste: bridges merged' : (sig / 1000).toFixed(1) + ' kPa');
        ro.set('P', s.P.toFixed(2) + ' kW');
        ro.set('lod', s.phase === 'dry' ? (s.lod * 100).toFixed(2) + ' %' : 'wet mass: ' + (100 * s.H / (1 + s.H)).toFixed(1) + ' %');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ solid-press */
  // teaching values for five powders: die-fill relative density D0, mean yield pressure Py (MPa, slow press), strain-rate
  // sensitivity srs (fractional rise of Py at full speed), elastic recovery er (% at 100 MPa), Ryshkewitch σ0 (MPa) and b
  const MATS = {
    mcc: { name: 'Microcrystalline cellulose', kind: 'plastic', D0: 0.30, Py: 70, srs: 0.35, er: 3, s0: 14, b: 7 },
    lac: { name: 'Lactose monohydrate', kind: 'brittle', D0: 0.45, Py: 180, srs: 0.05, er: 2, s0: 7, b: 8 },
    dcp: { name: 'Dibasic calcium phosphate', kind: 'hard, brittle', D0: 0.50, Py: 450, srs: 0.0, er: 1.5, s0: 6, b: 6 },
    drug: { name: 'A crystalline drug', kind: 'elastic', D0: 0.40, Py: 110, srs: 0.15, er: 8, s0: 4, b: 12 },
    mix: { name: 'The drug with 40 % MCC', kind: 'mixed', D0: 0.36, Py: 90, srs: 0.25, er: 5, s0: 8, b: 9 }
  };
  function pressModel(m, P, rpm, pre) {
    const sp = clamp(Math.log10(rpm / 10), 0, 1);                      // 0 at 10 rpm, 1 at 100 rpm
    const Py = m.Py * (1 + m.srs * sp);
    const Dd = p => 1 - (1 - m.D0) * Math.exp(-(p / Py + 0.15 * (1 - Math.exp(-p / 10))));   // Heckel, with early rearrangement
    const Din = Dd(P);
    const er = m.er / 100 * Math.sqrt(Math.max(P, 1) / 100) * (1 + 0.5 * sp) * (pre ? 0.8 : 1);
    const Dout = Din / (1 + er), eps = 1 - Dout;
    const sig = m.s0 * Math.exp(-m.b * eps) * (1 - 0.5 * m.srs * sp);   // Ryshkewitch–Duckworth, less bonding at speed
    const cap = er * 100 / (Math.max(sig, 1e-3) * 8) * (pre ? 0.75 : 1);  // a teaching capping index: elastic energy against bonding
    return { sp, Py, Dd, Din, er, Dout, eps, sig, cap };
  }

  Hyper.sim('solid-press', {
    title: 'The tablet press cycle',
    blurb: `One station of a 36-station rotary press making 350 mg tablets with a 10 mm flat-faced punch. The powder fills the die, is pre-compressed and then compressed, holds for the dwell time under the main roller, springs back as the pressure is released, and is ejected. Densification follows the Heckel equation, with a little extra rearrangement at low pressure. The tablet then recovers elastically, and its tensile strength follows its porosity (Ryshkewitch–Duckworth). Plastic materials bond less when the dwell time is short. The capping index compares the stored elastic recovery with the strength of the bonds; it is a teaching index built from typical values for each material, not a validated predictor.

**Try this**
- Compare microcrystalline cellulose and lactose at 150 MPa: look at the slope of the Heckel plot (the yield pressure) and at the tensile strength.
- Choose the crystalline drug. It caps at almost any pressure. Try pre-compression, a slower turret and then the version with 40 % MCC.
- Run microcrystalline cellulose at 10 and then at 100 rpm. The dwell time falls from 47 to 5 ms, and its yield pressure rises: strain-rate sensitivity. Dibasic calcium phosphate hardly notices.
- Push the pressure to 350 MPa with the crystalline drug: its elastic recovery doubles while its strength hardly changes. Microcrystalline cellulose keeps gaining strength, but ever more slowly.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      const [g1, g2] = twoPlots(box);
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Powder', options: Object.keys(MATS).map(k => [MATS[k].name + ' (' + MATS[k].kind + ')', k]), value: 'mcc' },
        { id: 'P', label: 'Main compaction pressure', min: 30, max: 350, step: 5, value: 150, unit: 'MPa' },
        { id: 'rpm', label: 'Turret speed', min: 10, max: 100, step: 1, value: 60, unit: 'rpm' },
        { id: 'pre', type: 'check', label: 'Pre-compression (about 12 % of the main force)', value: true }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['F', 'Punch force · pressure'], ['out', 'Output · dwell time'], ['D', 'Relative density in the die / ejected'], ['Py', 'Heckel yield pressure (fitted)'], ['h', 'Thickness in the die / ejected'], ['sig', 'Tensile strength · breaking force'], ['cap', 'Capping index']]);
      const pH = kit.plot(g1, { x: { label: 'pressure P (MPa)', min: 0 }, y: { label: 'ln[1/(1 − D)]', min: 0 }, legend: true }, 190);
      const pT = kit.plot(g2, { x: { label: 'compaction pressure (MPa)', min: 0, max: 350 }, y: { label: 'tensile strength (MPa)', min: 0 }, legend: true }, 190);
      const MASS = 350, AREA = Math.PI * 25, RHOT = 1.5, HD = MASS / (AREA * RHOT);   // mg, mm², mg/mm³; fully dense thickness (mm)
      let M, fit;
      function update() {
        const m = MATS[V.mat];
        M = pressModel(m, V.P, V.rpm, V.pre);
        // Heckel plot of the loading curve, and a straight-line fit over 40–90 % of the peak pressure
        const pts = [], xs = [], ys = [];
        for (let i = 0; i <= 60; i++) { const p = V.P * i / 60, y = Math.log(1 / (1 - M.Dd(p))); pts.push([p, y]); if (p >= 0.4 * V.P && p <= 0.9 * V.P) { xs.push(p); ys.push(y); } }
        const n = xs.length, mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
        let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
        const K = sxx > 0 ? sxy / sxx : 0; fit = { Py: K > 0 ? 1 / K : Infinity, A: my - K * mx };
        pH.set({ series: [{ pts, label: m.name + ' (in the die)' }, { pts: [[0, fit.A], [V.P, fit.A + K * V.P]], label: 'straight-line fit: Py = ' + fin(fit.Py).toFixed(0) + ' MPa', dash: [5, 4] }], x: { label: 'pressure P (MPa)', min: 0, max: V.P } });
        const tab = (rpm) => Array.from({ length: 33 }, (_, i) => { const p = 30 + i * 10; return [p, pressModel(m, p, rpm, V.pre).sig]; });
        const C = kit.colors();
        pT.set({ series: [{ pts: tab(V.rpm), label: 'at ' + V.rpm + ' rpm' }, { pts: tab(10), label: 'at 10 rpm', dash: [5, 4] }],
          hlines: [{ y: 1, label: 'about 1 MPa: handling' }, { y: 2, label: '2 MPa: coating' }], marks: [{ x: V.P, y: M.sig, label: M.cap > 1 ? 'caps' : 'your tablet', color: M.cap > 1 ? C.bad : C.accent }] });
        const hIn = HD / M.Din, hOut = hIn * (1 + M.er), dwell = 0.010 / (Math.PI * 0.41 * V.rpm / 60) * 1000;
        ro.set('F', (V.P * AREA / 1000).toFixed(1) + ' kN · ' + V.P + ' MPa');
        ro.set('out', (36 * V.rpm).toLocaleString('en-GB') + ' tablets/min · ' + dwell.toFixed(1) + ' ms');
        ro.set('D', (M.Din * 100).toFixed(1) + ' % / ' + (M.Dout * 100).toFixed(1) + ' % (porosity ' + (M.eps * 100).toFixed(1) + ' %)');
        ro.set('Py', fin(fit.Py).toFixed(0) + ' MPa (' + m.Py + ' MPa when slow)');
        ro.set('h', hIn.toFixed(2) + ' / ' + hOut.toFixed(2) + ' mm (+' + (M.er * 100).toFixed(1) + ' %)');
        ro.set('sig', M.sig.toFixed(2) + ' MPa · ' + (M.sig * Math.PI * 10 * hOut / 2).toFixed(0) + ' N');
        ro.set('cap', M.cap.toFixed(2) + (M.cap > 1 ? ' — caps' : M.cap > 0.5 ? ' — some risk' : ' — low risk'));
      }
      update();
      // pressure through the cycle (fraction φ of a turn)
      const pAt = ph => {
        const pre = V.pre ? 0.12 * V.P : 0;
        if (ph >= 0.28 && ph < 0.38) return pre * Math.pow(Math.sin(Math.PI * (ph - 0.28) / 0.10), 2);
        if (ph >= 0.45 && ph < 0.51) return V.P * Math.pow(Math.sin(Math.PI / 2 * (ph - 0.45) / 0.06), 2);
        if (ph >= 0.51 && ph < 0.54) return V.P;
        if (ph >= 0.54 && ph < 0.60) return V.P * Math.pow(Math.cos(Math.PI / 2 * (ph - 0.54) / 0.06), 2);
        return 0;
      };
      let ph = 0, made = 0, capped = 0, pile = [];
      const loop = kit.loop((dt) => {
        const prev = ph; ph = (ph + dt / 4) % 1;
        if (prev < 0.84 && ph >= 0.84) { made++; const cp = M.cap > 1; if (cp) capped++; pile.push(cp); if (pile.length > 12) pile.shift(); }
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const sc = Math.min(6, (Hh - 60) / 38), cx = W * 0.2, dieTop = Hh * 0.42, bore = 10 * sc, dieH = 16 * sc;
        const hFill = HD / MATS[V.mat].D0, hMin = HD / M.Din, hIn = hMin * (1 + 0.6 * M.er), hOut = hMin * (1 + M.er);
        // punch positions (mm below the die top) and the tablet
        const hPre = V.pre ? Math.min(hFill, HD / M.Dd(0.12 * V.P) * 1.01) : hFill;
        let zL = hFill, top = 0, thick = hFill, zU = -30, xOff = 0, showPowder = true;
        if (ph < 0.2) { zL = hFill * ph / 0.2; thick = zL; top = 0; }
        else if (ph < 0.45) {
          const P = pAt(ph);
          thick = ph < 0.28 ? hFill : ph < 0.33 ? Math.min(hFill, HD / M.Dd(P)) : hPre; top = zL - thick;
          zU = ph < 0.28 ? -30 + (top + 30) * (ph - 0.2) / 0.08 : ph < 0.38 ? top : top - 4 * Math.sin(Math.PI * (ph - 0.38) / 0.07);
        }
        else if (ph < 0.60) { const P = pAt(ph); thick = ph < 0.54 ? Math.min(hPre, HD / M.Dd(P)) : hMin * (1 + 0.6 * M.er * (1 - P / V.P)); top = zL - thick; zU = top; }
        else if (ph < 0.70) { thick = hIn; top = zL - thick; zU = top - 30 * clamp((ph - 0.6) / 0.05, 0, 1); }
        else if (ph < 0.84) { const u = (ph - 0.70) / 0.14; zL = hFill * (1 - u); thick = hIn + (hOut - hIn) * u; top = zL - thick; }
        else { zL = 0; thick = hOut; top = -thick; xOff = (ph - 0.84) / 0.16 * W * 0.25; }
        if (ph >= 0.70 && ph < 0.84) zU = -30;
        const Y = z => dieTop + z * sc;
        // die blocks
        c.fillStyle = C.bg2; c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.fillRect(cx - bore / 2 - 60, Y(0), 60, dieH); c.strokeRect(cx - bore / 2 - 60, Y(0), 60, dieH);
        c.fillRect(cx + bore / 2, Y(0), 60, dieH); c.strokeRect(cx + bore / 2, Y(0), 60, dieH);
        // feed frame during filling
        if (ph < 0.24) { c.fillStyle = kit.hue(35, 0.35); c.fillRect(cx - bore / 2 - 50, Y(0) - 18, bore + 50, 18); c.strokeRect(cx - bore / 2 - 50, Y(0) - 18, bore + 50, 18); kit.label(c, 'feed frame', cx - bore / 2 - 54, Y(0) - 9, { align: 'right', size: 11, color: C.muted }); }
        // the powder or tablet, darker when denser
        const dens = HD / Math.max(thick, 1e-6), capNow = M.cap > 1 && ph >= 0.78;
        const tabCol = kit.hue(35, clamp(0.25 + 0.75 * (dens - 0.3) / 0.7, 0.2, 1));
        if (showPowder && thick > 0) {
          if (capNow) {
            const capT = thick * 0.28, lift = ph >= 0.84 ? 10 + 30 * (ph - 0.84) / 0.16 : 3 + 20 * (ph - 0.78) / 0.06;
            c.fillStyle = tabCol; c.fillRect(cx - bore / 2 + xOff, Y(top + capT), bore, (thick - capT) * sc);
            c.save(); c.translate(cx + xOff + bore * 0.2, Y(top) - lift); c.rotate(-0.25 - 0.3 * clamp((ph - 0.78) / 0.2, 0, 1)); c.fillRect(-bore / 2, 0, bore, capT * sc); c.restore();
          } else { c.fillStyle = tabCol; c.fillRect(cx - bore / 2 + xOff, Y(top), bore, thick * sc); }
        }
        // punches
        c.fillStyle = C.muted;
        c.fillRect(cx - bore / 2 + 1, Y(zL), bore - 2, dieH + 10 * sc - zL * sc + 8);
        c.fillRect(cx - bore / 2 + 1, Y(zU) - 12 * sc, bore - 2, 12 * sc);
        // rollers when a punch is under load
        const P = pAt(ph);
        if (P > 0) {
          const main = ph >= 0.45, rr = main ? 24 : 14;
          c.strokeStyle = C.text; c.lineWidth = 2;
          c.beginPath(); c.arc(cx, Y(zU) - 12 * sc - rr, rr, 0, 6.283); c.stroke();
          c.beginPath(); c.arc(cx, Y(zL) + dieH + 10 * sc - zL * sc + 8 + rr, rr, 0, 6.283); c.stroke();
          kit.label(c, (P * AREA / 1000).toFixed(1) + ' kN', cx + rr + 8, Y(zU) - 12 * sc - rr, { align: 'left', size: 12, weight: 700, color: C.accent });
        }
        // pressure–time trace
        const tx0 = W * 0.44, tw = W * 0.5, ty0 = 18, th = Hh * 0.42, x = p => tx0 + (p - 0.25) / 0.4 * tw, y = p => ty0 + th - p / 360 * th;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(tx0, ty0, tw, th);
        c.strokeStyle = C.faint; c.beginPath(); for (let q = 0.25; q <= 0.65; q += 0.002) { const X = x(q), Yv = y(pAt(q)); if (q === 0.25) c.moveTo(X, Yv); else c.lineTo(X, Yv); } c.stroke();
        if (ph >= 0.25 && ph <= 0.65) { c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); for (let q = 0.25; q <= ph; q += 0.002) { const X = x(q), Yv = y(pAt(q)); if (q === 0.25) c.moveTo(X, Yv); else c.lineTo(X, Yv); } c.stroke(); kit.dot(c, x(ph), y(pAt(ph)), 4, C.accent); }
        const dwell = 0.010 / (Math.PI * 0.41 * V.rpm / 60) * 1000;
        kit.label(c, 'pressure on the punch', tx0 + 6, ty0 + 10, { align: 'left', size: 11.5, color: C.muted });
        if (V.pre) kit.label(c, 'pre', x(0.33), y(0.12 * V.P) - 10, { size: 11, color: C.muted });
        kit.label(c, V.P + ' MPa · dwell ' + dwell.toFixed(1) + ' ms', x(0.525), y(V.P) - 10, { size: 11.5, weight: 700, color: C.text });
        // the pile of tablets
        const px0 = W * 0.46, py0 = Hh - 22;
        kit.label(c, made + ' made' + (capped ? ', ' + capped + ' capped' : ''), px0, py0 - 34, { align: 'left', size: 12.5, weight: 700, color: capped ? C.bad : C.text });
        pile.forEach((cp, i) => {
          const xx = px0 + i * 30, yy = py0;
          c.fillStyle = kit.hue(35, 0.9);
          if (cp) { c.fillRect(xx, yy - 6, 22, 9); c.save(); c.translate(xx + 14, yy - 14); c.rotate(-0.4); c.fillRect(-9, 0, 18, 5); c.restore(); }
          else { rrect(c, xx, yy - 10, 22, 12, 3); c.fill(); }
        });
        const m = MATS[V.mat];
        kit.label(c, m.name + ': ' + m.kind, W * 0.44, Hh * 0.42 + 36, { align: 'left', size: 13, weight: 700, color: C.text });
        kit.label(c, 'tensile strength ' + M.sig.toFixed(2) + ' MPa · capping index ' + M.cap.toFixed(2), W * 0.44, Hh * 0.42 + 55, { align: 'left', size: 12, color: M.cap > 1 ? C.bad : C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ solid-coating */
  // saturation vapour pressure of water (Magnus, Pa) and the humidity ratio it gives at 1 atm (kg water per kg dry air)
  const psat = T => 610.94 * Math.exp(17.625 * T / (T + 243.04));
  const xsat = T => { const p = psat(T); return 0.622 * p / (101325 - p); };

  Hyper.sim('solid-coating', {
    title: 'Film coating in a pan',
    blurb: `A 100 kg batch of 400 mg tablets (250 000 of them) tumbles in a perforated pan while spray guns apply a 15 %-solids film-coating suspension. Hot air, 2000 m³/h, carries the water away. An energy balance gives the exhaust temperature and humidity, the numbers operators watch: if the spray brings more water than the air can evaporate, the bed gets too wet; if the air is far too dry, droplets dry before they land. Each tablet collects coat only on the passes that carry it through the spray, so the coat varies from tablet to tablet; that variation falls as one over the square root of the number of passes. One second of animation is five minutes of coating.

**Try this**
- Start at the defaults and watch the exhaust settle near 40 °C. Then raise the spray rate until the bed gets too wet, and see how warmer inlet air lets you spray faster.
- Lower the spray rate to 150 g/min with 80 °C air: spray drying, and the efficiency falls.
- Halve the pan speed, or use one gun instead of four, and compare the spread of coat in the histogram (the CV).
- Set a 5 % target: the film gets thicker, and because the run is longer, the coat also becomes more uniform.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      const [g1, g2] = twoPlots(box);
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Spray rate (suspension)', min: 100, max: 900, step: 10, value: 350, unit: 'g/min' },
        { id: 'Tin', label: 'Inlet air temperature', min: 40, max: 85, step: 1, value: 60, unit: '°C' },
        { id: 'rpm', label: 'Pan speed', min: 3, max: 20, step: 0.5, value: 10, unit: 'rpm' },
        { id: 'guns', type: 'select', label: 'Spray guns', options: [['1 gun', 1], ['2 guns', 2], ['3 guns', 3], ['4 guns', 4]], value: 2 },
        { id: 'WG', label: 'Target weight gain', min: 1, max: 6, step: 0.5, value: 3, unit: '%' },
        { type: 'buttons', items: [{ id: 'go', label: 'Start again', primary: true }] }
      ], (id) => { if (id === 'go') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Coating time'], ['wg', 'Weight gain · film thickness'], ['ex', 'Exhaust air'], ['eff', 'Coating efficiency'], ['cv', 'Coat variation between tablets (CV)'], ['cond', 'Condition']]);
      const pW = kit.plot(g1, { x: { label: 'time (min)', min: 0 }, y: { label: 'weight gain (%)', min: 0 }, legend: true }, 180);
      const pH = kit.plot(g2, { x: { label: 'coat on a tablet (% of the target)', min: 0, max: 200 }, y: { label: 'tablets', min: 0 } }, 180);
      const BATCH = 100, NTAB = 250000, FS = 0.15, MAIR = 2000 / 3600 * 1.1, CP = 1005, LAM = 2.40e6, XIN = 0.007, LOSS = 1.5;
      const NSIM = 600, CVA = 0.5;
      // the air: exhaust temperature and humidity, and whether the water can all be evaporated
      function air() {
        const water = V.Q / 60000 * (1 - FS);                              // kg/s
        let lo = 0, hi = V.Tin;                                            // adiabatic saturation temperature
        for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2, x = XIN + CP * (V.Tin - LOSS - m) / LAM; if (x > xsat(m)) lo = m; else hi = m; }
        const Tas = (lo + hi) / 2, evapMax = MAIR * (xsat(Tas) - XIN);
        let Tex, RH, excess = 0;
        if (water < evapMax) { Tex = V.Tin - LOSS - water * LAM / (MAIR * CP); const x = XIN + water / MAIR, pv = x * 101325 / (0.622 + x); RH = pv / psat(Tex); }
        else { Tex = Tas; RH = 1; excess = water - evapMax; }
        const cond = RH > 0.6 || Tex < 34 ? 'wet' : Tex > 50 || RH < 0.12 ? 'dry' : 'ok';
        const eff = cond === 'dry' ? clamp(0.95 - 0.02 * Math.max(0, Tex - 50) - (RH < 0.12 ? 0.8 * (0.12 - RH) : 0), 0.6, 0.95) : 0.95;
        return { water, Tex, RH, excess, cond, eff };
      }
      let s;
      function reset() {
        const r = rng(4242);
        s = { t: 0, coat: new Float64Array(NSIM), wg: 0, twin: 0, rough: 0, done: false, pts: [[0, 0]], r, acc: 0 };
        plots();
      }
      function stepCoat(dtr) {                                              // dtr: real seconds
        if (s.done) return;
        const A = air(), tc = 150 / V.rpm, p = Math.min(0.9, 0.35 + 0.15 * V.guns);
        const mu = V.Q / 60000 * FS * A.eff / NTAB * 1e6;                   // mg of film per tablet per second
        const sig = mu * Math.sqrt(tc * (1 + CVA * CVA - p) / p);
        const sq = Math.sqrt(dtr);
        for (let i = 0; i < NSIM; i++) s.coat[i] = Math.max(0, s.coat[i] + mu * dtr + sig * sq * gauss(s.r));
        s.t += dtr;
        s.wg += V.Q / 60000 * FS * A.eff * dtr / BATCH;
        if (A.cond === 'wet') s.twin = Math.min(0.3, s.twin + 0.00004 * dtr * (1 + 20 * (A.RH - 0.6) + A.excess * 2000));
        if (A.cond === 'dry') s.rough = Math.min(1, s.rough + 0.0003 * dtr);
        if (s.wg >= V.WG / 100) s.done = true;
      }
      function stats() {
        let m = 0; for (let i = 0; i < NSIM; i++) m += s.coat[i]; m /= NSIM;
        let v = 0; for (let i = 0; i < NSIM; i++) v += (s.coat[i] - m) ** 2;
        return { mean: m, cv: m > 0 ? Math.sqrt(v / (NSIM - 1)) / m : 0 };
      }
      function plots() {
        const target = 400 * V.WG / 100, bins = new Array(40).fill(0);
        for (let i = 0; i < NSIM; i++) { const k = Math.floor(s.coat[i] / target * 100 / 5); if (k >= 0 && k < 40) bins[k]++; }
        const hist = []; bins.forEach((b, k) => { hist.push([k * 5, b]); hist.push([k * 5 + 5, b]); });
        pW.set({ series: [{ pts: s.pts.slice(), label: 'weight gain' }], x: { label: 'time (min)', min: 0, max: Math.max(30, s.t / 60) }, y: { label: 'weight gain (%)', min: 0, max: Math.max(V.WG * 1.15, 1) }, hlines: [{ y: V.WG, label: 'target ' + V.WG + ' %' }] });
        pH.set({ series: [{ pts: hist, label: 'coat per tablet', fill: true }], vlines: [{ x: 100, label: 'target' }] });
      }
      const vis = Array.from({ length: 70 }, (_, i) => { const r = rng(900 + i); return { ph: r(), k: 0.3 + 0.7 * Math.sqrt(r()), sp: 0.8 + 0.4 * r() }; });
      reset();
      const loop = kit.loop((dt, T) => {
        const real = dt * 300, n = Math.max(1, Math.ceil(real / 10));
        for (let i = 0; i < n; i++) stepCoat(real / n);
        s.acc += dt; if (s.acc > 0.25) { s.acc = 0; if (!s.done || s.pts[s.pts.length - 1][0] < s.t / 60 - 0.01) s.pts.push([s.t / 60, s.wg * 100]); plots(); }
        const A = air(), S = stats(), target = 400 * V.WG / 100;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const R = Math.min(W * 0.22, Hh * 0.42), cx = W * 0.26, cy = Hh * 0.5;
        // the drum and its perforations
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, R, 0, 6.283); c.stroke();
        const rot = T * V.rpm / 60 * 2 * Math.PI;
        c.fillStyle = C.muted; for (let i = 0; i < 36; i++) { const a = rot + i * Math.PI / 18; c.beginPath(); c.arc(cx + (R - 6) * Math.cos(a), cy + (R - 6) * Math.sin(a), 1.5, 0, 6.283); c.fill(); }
        // the bed: tablets are carried up the wall (clockwise, from a2 round the bottom to a1) and cascade down the surface;
        // deeper tablets run on smaller loops, shrunk towards the middle of the bed
        const a1 = 1.08 * Math.PI, a2 = 0.28 * Math.PI, Rb = R * 0.9;
        const e1 = [cx + Rb * Math.cos(a1), cy + Rb * Math.sin(a1)], e2 = [cx + Rb * Math.cos(a2), cy + Rb * Math.sin(a2)];
        const am = (a1 + a2) / 2, Gb = [((e1[0] + e2[0]) / 2 + cx + Rb * Math.cos(am)) / 2, ((e1[1] + e2[1]) / 2 + cy + Rb * Math.sin(am)) / 2];
        const core = C.dark ? [225, 225, 220] : [245, 243, 238], coatC = [200, 70, 60];
        const twinN = Math.round(s.twin * vis.length);
        vis.forEach((v, i) => {
          const u = (v.ph + T * V.rpm / 60 * 0.9 * v.sp) % 1;
          let x, y, onSurf = false;
          if (u < 0.7) { const a = a2 + (u / 0.7) * (a1 - a2); x = cx + Rb * Math.cos(a); y = cy + Rb * Math.sin(a); }
          else { const w = (u - 0.7) / 0.3; x = e1[0] + (e2[0] - e1[0]) * w; y = e1[1] + (e2[1] - e1[1]) * w; onSurf = v.k > 0.85 && w > 0.2 && w < 0.8; }
          x = Gb[0] + v.k * (x - Gb[0]); y = Gb[1] + v.k * (y - Gb[1]);
          const f = clamp(s.coat[i] / Math.max(1e-9, target), 0, 1.3), mix = clamp(f, 0, 1);
          const col = 'rgb(' + core.map((cc, j) => Math.round(cc + (coatC[j] - cc) * mix)).join(',') + ')';
          c.fillStyle = col; c.strokeStyle = onSurf && !s.done ? C.accent : C.faint; c.lineWidth = onSurf && !s.done ? 1.5 : 0.8;
          c.beginPath(); c.ellipse(x, y, 7, 4.5, 0.3, 0, 6.283); c.fill(); c.stroke();
          if (i < twinN) { c.beginPath(); c.ellipse(x + 8, y + 1, 7, 4.5, 0.3, 0, 6.283); c.fill(); c.stroke(); }
          if (s.rough > 0.1) { c.fillStyle = 'rgba(0,0,0,' + (0.25 * s.rough) + ')'; for (let k = 0; k < 3; k++) c.fillRect(x - 4 + k * 3, y - 1 + (k % 2), 1.2, 1.2); }
        });
        // spray guns along the bed surface, and their droplets
        const nx = -(e2[1] - e1[1]), ny = e2[0] - e1[0], nl = Math.hypot(nx, ny) || 1;   // normal to the surface, towards the centre
        for (let g = 0; g < V.guns; g++) {
          const w = (g + 1) / (V.guns + 1), tx = e1[0] + (e2[0] - e1[0]) * w, ty = e1[1] + (e2[1] - e1[1]) * w;
          const gx = tx - nx / nl * R * 0.5, gy = ty - ny / nl * R * 0.5;
          c.fillStyle = C.muted; c.beginPath(); c.arc(gx, gy, 5, 0, 6.283); c.fill();
          if (!s.done) for (let k = 0; k < 10; k++) {
            const u = (T * 2.5 + k / 10 + g * 0.13) % 1, fade = A.cond === 'dry' ? 1 - u : 1, spread = ((k % 5) - 2) / 2 * u * 14;
            c.fillStyle = kit.hue(8, 0.85 * fade); c.beginPath(); c.arc(gx + (tx - gx) * u + spread * (e2[0] - e1[0]) / nl, gy + (ty - gy) * u + spread * (e2[1] - e1[1]) / nl, 1.6, 0, 6.283); c.fill();
          }
        }
        // air
        kit.arrow(c, cx - R - 40, cy - R * 0.7, cx - R * 0.72, cy - R * 0.5, V.Tin > 70 ? C.bad : C.warn, 2);
        kit.label(c, V.Tin + ' °C in', cx - R - 42, cy - R * 0.7 - 10, { align: 'left', size: 11.5, color: C.muted });
        kit.arrow(c, cx + R * 0.5, cy + R * 0.95, cx + R * 0.9, cy + R * 1.25, C.muted, 2);
        kit.label(c, A.Tex.toFixed(0) + ' °C, ' + (A.RH * 100).toFixed(0) + ' % RH out', cx + R * 0.6, cy + R * 1.25 + 10, { align: 'left', size: 11.5, color: C.muted });
        // the story, on the right
        const x0 = W * 0.56; let y = 28;
        const line = (t, o) => { kit.label(c, t, x0, y, Object.assign({ align: 'left', size: 12.5, color: C.text }, o || {})); y += (o && o.gap) || 19; };
        const colr = A.cond === 'ok' ? C.ok : A.cond === 'wet' ? C.bad : C.warn;
        line(s.done ? 'Target reached after ' + (s.t / 60).toFixed(0) + ' min' : (s.t / 60).toFixed(0) + ' min of spraying', { size: 14, weight: 700, gap: 24 });
        line(A.cond === 'ok' ? 'Balanced: droplets land, spread and dry' : A.cond === 'wet' ? 'Too wet: sticking, twinning, picking' : 'Too dry: spray drying, rough "orange peel"', { size: 14, weight: 700, color: colr, gap: 22 });
        line('weight gain ' + (s.wg * 100).toFixed(2) + ' % of ' + V.WG + ' %', { color: C.muted });
        const film = 400 * s.wg / (1.3 * 290) * 1000;                   // µm: 400 mg core, film 1.3 mg/mm³, 290 mm² of surface
        line('film ≈ ' + film.toFixed(0) + ' µm thick', { color: C.muted });
        line('coat CV between tablets ' + (S.cv * 100).toFixed(1) + ' %', { color: C.muted });
        if (s.twin > 0.005) line((s.twin * 100).toFixed(1) + ' % of tablets twinned', { color: C.bad });
        ro.set('t', (s.t / 60).toFixed(1) + ' min' + (s.done ? ' (done)' : ''));
        ro.set('wg', (s.wg * 100).toFixed(2) + ' % · ' + film.toFixed(0) + ' µm');
        ro.set('ex', A.Tex.toFixed(1) + ' °C, ' + (A.RH * 100).toFixed(0) + ' % RH' + (A.excess > 0 ? ' — saturated' : ''));
        ro.set('eff', (A.eff * 100).toFixed(0) + ' %');
        ro.set('cv', (S.cv * 100).toFixed(1) + ' % after about ' + Math.round(s.t / (150 / V.rpm)) + ' passes');
        ro.set('cond', A.cond === 'ok' ? 'balanced' : A.cond === 'wet' ? 'too wet' : 'too dry');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ solid-uniformity */
  // the acceptance value of USP <905> / Ph. Eur. 2.9.40 for a target of 100 % (values in % of label)
  function acceptance(vals, k) {
    const n = vals.length, X = vals.reduce((a, b) => a + b, 0) / n;
    const s = n > 1 ? Math.sqrt(vals.reduce((a, b) => a + (b - X) ** 2, 0) / (n - 1)) : 0;
    const M = X < 98.5 ? 98.5 : X > 101.5 ? 101.5 : X;
    return { X, s, M, AV: Math.abs(M - X) + k * s };
  }
  // a Poisson count (exact for small means, normal beyond)
  function poisson(lam, r) {
    if (lam <= 0) return 0;
    if (lam > 60) return Math.max(0, Math.round(lam + Math.sqrt(lam) * gauss(r)));
    const L = Math.exp(-lam); let k = 0, p = 1;
    do { k++; p *= r(); } while (p > L && k < 400);
    return k - 1;
  }

  Hyper.sim('solid-uniformity', {
    title: 'Blend uniformity and the content uniformity test',
    blurb: `A drug is loaded as a layer on top of the filler in a bin blender, and each turn of the bin mixes it a little more: convection moves blocks of powder about, and particles exchange with their neighbours. The coloured cells show the drug concentration through the bin. When you press tablets, 10 are taken across the run, first from the bottom of the bin and last from the top, and assayed. Their acceptance value decides the test: AV ≤ 15 passes, otherwise 20 more are tested (USP <905>, Ph. Eur. 2.9.40). Two things limit uniformity even in a perfect blend: a 200 mg tablet contains only a finite number of drug particles, so the dose varies by at least 1/√n; and a free-flowing blend with a much coarser filler can sift (segregate). The drug is hypothetical, with a density of 1.3 g/cm³.

**Try this**
- Press and test after 25 turns, then after 150. Watch the blend's RSD fall along the mixing curve.
- Set a dose of 0.1 mg with 100 µm drug particles: even a perfect blend fails, because each tablet holds only about 150 particles. Now micronise the drug to 5 µm.
- Turn on segregation. The blend stops improving, the tablets drift in content from the start to the end of the run, and more mixing no longer helps.
- Compare a 50 mg dose: at 25 % loading, weight variation alone could have shown uniformity.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      const [g1, g2] = twoPlots(box);
      const ctl = kit.controls(box.side, [
        { id: 'dose', label: 'Drug per 200 mg tablet', min: 0.05, max: 50, value: 1, unit: 'mg', log: true, sig: 2 },
        { id: 'dp', label: 'Drug particle size', min: 2, max: 200, value: 40, unit: 'µm', log: true, sig: 2 },
        { id: 'seg', type: 'check', label: 'Free-flowing blend with a much coarser filler (segregates)', value: false },
        { type: 'buttons', items: [{ id: 'b25', label: 'Blend 25 turns', primary: true }, { id: 'b100', label: 'Blend 100 turns' }, { id: 'test', label: 'Press and test' }, { id: 'reset', label: 'Start again' }] }
      ], (id) => {
        if (id === 'b25') s.todo += 25;
        if (id === 'b100') s.todo += 100;
        if (id === 'test') test();
        if (id === 'reset') reset();
        if (id === 'dose' || id === 'dp') { s.tabs = null; s.res = null; plots(); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rev', 'Turns of the blender'], ['rsd', 'Blend RSD (cell to cell)'], ['np', 'Drug particles per tablet'], ['load', 'Drug loading'], ['s1', 'Stage 1 (10 tablets)'], ['s2', 'Stage 2 (30 tablets)'], ['ver', 'Result']]);
      const pM = kit.plot(g1, { x: { label: 'turns of the blender', min: 0 }, y: { label: 'blend RSD (%)', min: 0.1, max: 300, log: true }, legend: true }, 190);
      const pT = kit.plot(g2, { x: { label: 'tablet (in order of pressing)', min: 0, max: 31 }, y: { label: 'content (% of label)' }, legend: true }, 190);
      const NX = 36, NY = 24;
      let s;
      function reset() {
        const g = []; for (let y = 0; y < NY; y++) { const row = new Float64Array(NX); if (y < 4) row.fill(NY / 4); g.push(row); }
        s = { g, rev: 0, todo: 0, ang: 0, r: rng(77), tabs: null, curve: [[0, rsd(g)]] , res: null };
        plots();
      }
      function rsd(g) {
        let m = 0, v = 0; for (const row of g) for (const c of row) m += c; m /= NX * NY;
        for (const row of g) for (const c of row) v += (c - m) ** 2;
        return m > 0 ? Math.sqrt(v / (NX * NY - 1)) / m * 100 : 0;
      }
      function revolve() {
        const g = s.g, r = s.r;
        for (let x = 0; x < NX; x++) { const o = Math.round((r() * 2 - 1)); if (!o) continue; const col = g.map(row => row[x]); for (let y = 0; y < NY; y++) g[y][x] = col[((y - o) % NY + NY) % NY]; }
        for (let y = 0; y < NY; y++) { const o = Math.round((r() * 2 - 1) * 0.4); if (!o) continue; const row = g[y].slice(); for (let x = 0; x < NX; x++) g[y][x] = row[((x - o) % NX + NX) % NX]; }
        for (let k = 0; k < 3; k++) {
          const w = 3, x1 = Math.floor(r() * (NX - w)), y1 = Math.floor(r() * (NY - w)), x2 = Math.floor(r() * (NX - w)), y2 = Math.floor(r() * (NY - w));
          for (let dy = 0; dy < w; dy++) for (let dx = 0; dx < w; dx++) { const t = g[y1 + dy][x1 + dx]; g[y1 + dy][x1 + dx] = g[y2 + dy][x2 + dx]; g[y2 + dy][x2 + dx] = t; }
        }
        const h = g.map(row => row.slice());
        for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
          const nb = (h[Math.max(0, y - 1)][x] + h[Math.min(NY - 1, y + 1)][x] + h[y][Math.max(0, x - 1)] + h[y][Math.min(NX - 1, x + 1)]) / 4;
          g[y][x] = h[y][x] + 0.1 * (nb - h[y][x]);
        }
        if (V.seg) for (let y = NY - 2; y >= 0; y--) for (let x = 0; x < NX; x++) { const f = 0.08 * g[y][x]; g[y][x] -= f; g[y + 1][x] += f; }
        s.rev++;
        s.curve.push([s.rev, Math.max(0.1, rsd(g))]);
      }
      const particles = () => V.dose / (6.807e-10 * Math.pow(V.dp, 3));        // 1.3 g/cm³ spheres of diameter dp (µm), in mg
      function tablet(k, n) {
        // tablet k of n is pressed from a height in the bin (bottom first) and a random position across it
        const r = s.r, y = clamp(NY - 1 - Math.floor((k + r()) / n * NY), 0, NY - 1), x = Math.floor(r() * NX);
        const np = particles(), cnt = poisson(np * s.g[y][x], r);
        return 100 * cnt / np * (1 + 0.01 * gauss(r)) + 0.5 * gauss(r);
      }
      function test() {
        const t1 = Array.from({ length: 10 }, (_, k) => tablet(k, 10));
        const a1 = acceptance(t1, 2.4);
        let t2 = null, a2 = null, pass = a1.AV <= 15;
        if (!pass) {
          t2 = t1.concat(Array.from({ length: 20 }, (_, k) => tablet(k, 20)));
          a2 = acceptance(t2, 2.0);
          pass = a2.AV <= 15 && t2.every(v => v >= 0.75 * a2.M && v <= 1.25 * a2.M);
        }
        s.tabs = t2 || t1; s.res = { a1, a2, pass };
        plots();
      }
      function plots() {
        const floor = 100 / Math.sqrt(Math.max(1e-9, particles()));
        pM.set({ series: [{ pts: s.curve.slice(), label: 'blend RSD' }], x: { label: 'turns of the blender', min: 0, max: Math.max(50, s.rev) },
          hlines: [{ y: Math.max(0.1, Math.min(300, floor)), label: 'particle-count limit ' + floor.toFixed(1) + ' %' }, { y: 5, label: '5 %' }] });
        const tabs = s.tabs || [];
        pT.set({ series: [{ pts: tabs.slice(0, 10).map((v, i) => [i + 1, v]), label: 'stage 1', line: false, dots: 4 }, { pts: tabs.slice(10).map((v, i) => [i + 11, v]), label: 'stage 2', line: false, dots: 4 }],
          y: { label: 'content (% of label)', min: Math.min(60, ...tabs.map(v => v - 5)), max: Math.max(140, ...tabs.map(v => v + 5)) },
          hlines: [{ y: 100, label: '100 %' }, { y: 75, label: '75 %' }, { y: 125, label: '125 %' }] });
      }
      reset();
      const loop = kit.loop((dt) => {
        if (s.todo > 0) {
          const before = Math.floor(s.ang / (2 * Math.PI));
          s.ang += dt * 2 * Math.PI * 3;                                     // three turns a second
          const turns = Math.min(s.todo, Math.floor(s.ang / (2 * Math.PI)) - before);
          for (let i = 0; i < turns; i++) { revolve(); s.todo--; }
          if (turns) { s.tabs = null; s.res = null; plots(); }
          if (s.todo <= 0) s.ang = 0;
        }
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const cs = Math.min((W * 0.4) / NX, (Hh - 50) / NY), bw = cs * NX, bh = cs * NY, cx = W * 0.25, cy = Hh / 2;
        c.save(); c.translate(cx, cy); c.rotate(s.todo > 0 ? s.ang : 0);
        const exc = C.dark ? [70, 74, 80] : [228, 228, 222], drug = C.dark ? [120, 170, 255] : [40, 90, 210];
        for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
          const f = clamp(s.g[y][x] / 2, 0, 1);
          c.fillStyle = 'rgb(' + exc.map((e, j) => Math.round(e + (drug[j] - e) * f)).join(',') + ')';
          c.fillRect(-bw / 2 + x * cs, -bh / 2 + y * cs, cs + 0.5, cs + 0.5);
        }
        c.strokeStyle = C.text; c.lineWidth = 2.5; c.strokeRect(-bw / 2, -bh / 2, bw, bh);
        c.restore();
        kit.label(c, s.todo > 0 ? 'blending… ' + s.rev + ' turns' : s.rev + ' turns', cx, cy + bh / 2 + 14, { size: 12, weight: 700, color: C.text });
        kit.label(c, 'top of the bin (pressed last)', cx, cy - bh / 2 - 10, { size: 11, color: C.muted });
        // the tablets pressed and assayed
        const x0 = W * 0.52; let y = 26;
        const np = particles();
        kit.label(c, 'a 200 mg tablet holds about ' + (np >= 1e6 ? (np / 1e6).toFixed(1) + ' million' : np >= 1e4 ? Math.round(np).toLocaleString('en-GB') : np.toFixed(np < 10 ? 1 : 0)) + ' drug particles', x0, y, { align: 'left', size: 12.5, color: C.text }); y += 18;
        kit.label(c, 'so even a perfect blend varies by ≥ ' + (100 / Math.sqrt(np)).toFixed(2) + ' % (1/√n)', x0, y, { align: 'left', size: 12, color: C.muted }); y += 26;
        if (s.tabs) {
          const R = Math.min(13, (W * 0.46) / 24);
          s.tabs.forEach((v, i) => {
            const xx = x0 + R + (i % 10) * (2.2 * R), yy = y + R + Math.floor(i / 10) * (2.6 * R + 6), off = Math.abs(v - 100);
            c.fillStyle = off < 5 ? kit.hue(150, 0.35) : off < 15 ? kit.hue(45, 0.45) : kit.hue(0, 0.45);
            c.beginPath(); c.arc(xx, yy, R, 0, 6.283); c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1; c.stroke();
            kit.label(c, v.toFixed(0), xx, yy, { size: Math.max(8, R * 0.75), color: C.text });
          });
          y += Math.ceil(s.tabs.length / 10) * (2.6 * R + 6) + 12;
          const r = s.res, ok = r.pass;
          kit.label(c, 'stage 1: mean ' + r.a1.X.toFixed(1) + ' %, s ' + r.a1.s.toFixed(1) + ' %, AV ' + r.a1.AV.toFixed(1), x0, y, { align: 'left', size: 12.5, color: C.text }); y += 19;
          if (r.a2) { kit.label(c, 'stage 2 (30): mean ' + r.a2.X.toFixed(1) + ' %, s ' + r.a2.s.toFixed(1) + ' %, AV ' + r.a2.AV.toFixed(1), x0, y, { align: 'left', size: 12.5, color: C.text }); y += 19; }
          kit.label(c, ok ? 'PASSES the uniformity test' : 'FAILS the uniformity test', x0, y + 4, { align: 'left', size: 15, weight: 700, color: ok ? C.ok : C.bad });
        } else kit.label(c, 'blend, then press and test 10 tablets', x0, y + 10, { align: 'left', size: 12.5, color: C.muted });
        ro.set('rev', String(s.rev) + (s.todo > 0 ? ' (+' + s.todo + ' to go)' : ''));
        ro.set('rsd', rsd(s.g).toFixed(s.rev ? 1 : 0) + ' %');
        ro.set('np', (np >= 1e4 ? Math.round(np).toLocaleString('en-GB') : np.toFixed(np < 10 ? 1 : 0)) + ' → at least ' + (100 / Math.sqrt(np)).toFixed(2) + ' % RSD');
        ro.set('load', (V.dose / 200 * 100).toFixed(V.dose < 2 ? 3 : 1) + ' %' + (V.dose >= 25 && V.dose / 200 >= 0.25 ? ' (weighing may be used)' : ' (single-tablet assays needed)'));
        ro.set('s1', s.res ? 'AV ' + s.res.a1.AV.toFixed(1) + (s.res.a1.AV <= 15 ? ' ≤ 15' : ' > 15') : '—');
        ro.set('s2', s.res && s.res.a2 ? 'AV ' + s.res.a2.AV.toFixed(1) + ', range ' + Math.min(...s.tabs).toFixed(0) + '–' + Math.max(...s.tabs).toFixed(0) + ' %' : '—');
        ro.set('ver', s.res ? (s.res.pass ? 'passes' : 'fails') : 'not tested');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ solid-gi-release */
  // the gut as a line from 0 (stomach) to 1 (end of the colon), and its pH
  const GUT = [['stomach', 0, 0.14], ['duodenum', 0.14, 0.2], ['jejunum', 0.2, 0.42], ['ileum', 0.42, 0.6], ['colon', 0.6, 1]];
  const regionAt = x => x < 0.14 ? 0 : x < 0.6 ? 1 : 2;
  const placeAt = x => (GUT.find(g => x < g[2]) || GUT[4])[0];
  function gutPH(x, t, fed) {
    if (x < 0.14) return fed ? 2 + 3.5 * Math.exp(-t / 1.2) : 1.7;
    if (x < 0.2) return 6.0;
    if (x < 0.42) return 6.2 + 0.6 * (x - 0.2) / 0.22;
    if (x < 0.6) return 6.8 + 0.6 * (x - 0.42) / 0.18;
    return 6.0 + 0.7 * (x - 0.6) / 0.4;
  }
  const FORMS = [['ir', 'Immediate release'], ['ent', 'Enteric coated'], ['er', 'Matrix, extended'], ['osm', 'Osmotic pump']];

  Hyper.sim('solid-gi-release', {
    title: 'Four tablets through the gut',
    blurb: `Four tablets of the same hypothetical drug (100 mg; half-life 5 h, volume of distribution 50 L, 20 % lost on the first pass) swallowed together and followed for 36 hours. The **immediate-release** tablet disintegrates in minutes and its drug empties from the stomach with the liquid. The **enteric** coat stays shut until the local pH passes its threshold. The hypromellose **matrix** releases along a power law in t, more slowly in the drier colon. The **osmotic pump** releases at a constant rate, whatever the pH, after it has hydrated. Intact tablets leave the stomach together, at the time you set; then they spend 2–6 hours in the small intestine and a day in the colon. Dissolved drug is absorbed fastest from the small intestine, slowly from the colon and hardly at all from the stomach. The bars under each lane show where along the gut the drug was released. These are teaching models, not any real product.

**Try this**
- Compare the blood levels: a high early peak from immediate release against the flatter, later curves of the matrix and the osmotic pump.
- Take the tablets with a meal: intact tablets stay in the stomach for hours, and the buffered stomach can start to open a pH 5.5 enteric coat early.
- Switch to a drug destroyed by stomach acid: only the enteric tablet keeps its bioavailability.
- Choose a pH 7.0 coat (for colonic delivery) and shorten the small-intestinal transit to 2 h: the tablet can reach the colon before it has opened.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const [g1, g2] = twoPlots(box);
      const ctl = kit.controls(box.side, [
        { id: 'fed', type: 'select', label: 'Taken', options: [['Fasting, with water', 0], ['With a meal', 1]], value: 0 },
        { id: 'ge', label: 'Intact tablets leave the stomach after', min: 0.25, max: 8, step: 0.25, value: 1, unit: 'h' },
        { id: 'sitt', label: 'Small-intestinal transit', min: 2, max: 6, step: 0.25, value: 3.5, unit: 'h' },
        { id: 'pHc', type: 'select', label: 'Enteric coat dissolves above', options: [['pH 5.5 (duodenum)', 5.5], ['pH 6.0', 6.0], ['pH 7.0 (terminal ileum)', 7.0]], value: 5.5 },
        { id: 'acid', type: 'check', label: 'Drug destroyed by stomach acid', value: false },
        { type: 'buttons', items: [{ id: 'replay', label: 'Replay', primary: true }] }
      ], (id, v) => {
        if (id === 'fed') ctl.set('ge', v ? 4 : 1);
        compute(); if (id === 'replay' || id === 'fed') clock = 0;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['clock', 'Time since swallowing'], ['ir', FORMS[0][1]], ['ent', FORMS[1][1]], ['er', FORMS[2][1]], ['osm', FORMS[3][1]]]);
      const pC = kit.plot(g1, { x: { label: 'time (h)', min: 0, max: 36 }, y: { label: 'plasma level (mg/L)', min: 0 }, legend: true }, 200);
      const pR = kit.plot(g2, { x: { label: 'time (h)', min: 0, max: 36 }, y: { label: 'released from the tablet (%)', min: 0, max: 100 }, legend: true }, 200);
      const DOSE = 100, VD = 50, KEL = Math.LN2 / 5, FH = 0.8, TEND = 36, DT = 0.005, EVERY = 10;
      let R = null, clock = 0;
      function compute() {
        const fed = V.fed === 1, ge = V.ge, sitt = V.sitt, kgl = fed ? 0.8 : 2.8;
        const unitPos = t => t < ge ? 0.07 : t < ge + sitt ? 0.14 + 0.46 * (t - ge) / sitt : Math.min(1, 0.6 + 0.4 * (t - ge - sitt) / 24);
        const out = {};
        for (const [id] of FORMS) {
          let Q = 0, I = 1, tau = 0, Ls = 0, Li = 0, Lc = 0, Ab = 0, absd = 0, cmax = 0, tmax = 0;
          const pts = [], rel = [], where = new Float64Array(40), pos = [], integ = [];
          for (let k = 0; k <= TEND / DT; k++) {
            const t = k * DT, x = id === 'ir' ? 0.07 : unitPos(t), reg = regionAt(x), pH = gutPH(x, t, fed);
            let dQ = 0;
            if (id === 'ir') { if (t > 5 / 60) dQ = 3 * (1 - Q) * DT; }
            else if (id === 'ent') {
              I = Math.max(0, I - 1.2 * clamp((pH - (V.pHc - 0.4)) / 0.4, 0, 1) * DT);
              dQ = I > 0 ? 0.15 * (1 - I) * (1 - Q) * DT : 2 * (1 - Q) * DT;
            } else if (id === 'er') { tau += (reg === 2 ? 0.35 : 1) * DT; dQ = Math.min(1, 0.201 * Math.pow(tau, 0.6)) - Q; }
            else { if (t > 1) dQ = (Q < 0.8 ? 0.8 / 14 : 0.8 / 14 * Math.pow((1 - Q) / 0.2, 2)) * DT; }
            dQ = clamp(dQ, 0, 1 - Q); Q += dQ;
            const m = dQ * DOSE;
            if (reg === 0) Ls += m; else if (reg === 1) Li += m; else Lc += m;
            where[Math.min(39, Math.floor(x * 40))] += m;
            const aS = 0.1 * Ls, aI = 2.0 * Li, aC = 0.25 * Lc;
            const dLs = -kgl * Ls - aS - (V.acid ? 3 * Ls : 0), dLi = kgl * Ls - aI - Li / sitt, dLc = Li / sitt - aC - Lc / 20;
            Ls += dLs * DT; Li += dLi * DT; Lc += dLc * DT;
            const a = aS + aI + aC; absd += a * DT;
            Ab += (FH * a - KEL * Ab) * DT;
            const C = Ab / VD; if (C > cmax) { cmax = C; tmax = t; }
            if (k % EVERY === 0) { pts.push([t, C]); rel.push([t, Q * 100]); pos.push(x); integ.push(I); }
          }
          out[id] = { pts, rel, where, pos, integ, cmax, tmax, F: FH * absd / DOSE };
        }
        R = out;
        const lab = Object.fromEntries(FORMS);
        pC.set({ series: FORMS.map(([id]) => ({ pts: R[id].pts, label: lab[id] })) });
        pR.set({ series: FORMS.map(([id]) => ({ pts: R[id].rel, label: lab[id] })) });
      }
      compute();
      const loop = kit.loop((dt) => {
        clock += dt * 2; if (clock > TEND) clock = 0;                       // two hours a second
        const i = clamp(Math.round(clock / (DT * EVERY)), 0, R.ir.pts.length - 1);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const x0 = W * 0.17, x1 = W * 0.83, lane = (Hh - 50) / 4, fed = V.fed === 1;
        // region names and pH along the top
        for (const [nm, a, b] of GUT) {
          const pH = gutPH((a + b) / 2, clock, fed);
          kit.label(c, nm, x0 + (a + b) / 2 * (x1 - x0), 12, { size: 11.5, weight: 700, color: C.text });
          kit.label(c, 'pH ' + pH.toFixed(1), x0 + (a + b) / 2 * (x1 - x0), 27, { size: 10.5, color: C.muted });
        }
        kit.label(c, clock.toFixed(1) + ' h', 8, 14, { align: 'left', size: 13, weight: 700, color: C.accent });
        FORMS.forEach(([id, name], k) => {
          const y = 42 + lane * k + lane / 2, r = R[id];
          // the gut band, tinted by pH
          for (let j = 0; j < 60; j++) {
            const xa = j / 60, pH = gutPH(xa + 1 / 120, clock, fed);
            c.fillStyle = kit.hue(clamp(5 + (pH - 1.5) * 34, 0, 200), 0.22);
            c.fillRect(x0 + xa * (x1 - x0), y - lane * 0.22, (x1 - x0) / 60 + 0.5, lane * 0.44);
          }
          // where the dose was released
          const mx = Math.max(1e-9, ...r.where);
          c.fillStyle = kit.hue(265, 0.5);
          for (let j = 0; j < 40; j++) { const h = (lane * 0.28) * r.where[j] / mx; if (h > 0.3) c.fillRect(x0 + j / 40 * (x1 - x0) + 1, y + lane * 0.22 + (lane * 0.28 - h), (x1 - x0) / 40 - 2, h); }
          kit.label(c, name, x0 - 8, y - 6, { align: 'right', size: 12, weight: 700, color: C.text });
          kit.label(c, (r.rel[i][1]).toFixed(0) + ' % out', x0 - 8, y + 10, { align: 'right', size: 11, color: C.muted });
          // the unit
          const pos = r.pos[i], ux = x0 + pos * (x1 - x0) + (pos < 0.14 ? 6 * Math.sin(clock * 5 + k) : 0), Q = r.rel[i][1] / 100;
          if (id === 'ir') {
            if (clock < 5 / 60) { c.fillStyle = kit.hue(35, 0.95); rrect(c, ux - 9, y - 5, 18, 10, 4); c.fill(); }
            else { const left = Math.exp(-(fed ? 0.8 : 2.8) * clock); c.fillStyle = kit.hue(35, 0.8 * clamp(left + 0.1, 0, 1)); for (let q = 0; q < 14; q++) { c.beginPath(); c.arc(ux + 14 * Math.cos(q * 2.4 + clock), y + 7 * Math.sin(q * 1.7 + clock), 2, 0, 6.283); c.fill(); } }
          } else {
            if (id === 'er') { const halo = 3 + 4 * Math.sqrt(Math.min(1, clock / 6)); c.fillStyle = kit.hue(190, 0.25 * (1 - Q)); rrect(c, ux - 9 - halo, y - 5 - halo, 18 + 2 * halo, 10 + 2 * halo, 6); c.fill(); }
            const sz = id === 'er' ? Math.max(0.35, 1 - 0.6 * Q) : 1;
            c.fillStyle = kit.hue(35, 0.95); rrect(c, ux - 9 * sz, y - 5 * sz, 18 * sz, 10 * sz, 4); c.fill();
            if (id === 'ent' && r.integ[i] > 0) { c.strokeStyle = kit.hue(330, r.integ[i]); c.lineWidth = 3; rrect(c, ux - 10, y - 6, 20, 12, 5); c.stroke(); }
            if (id === 'osm') { c.strokeStyle = C.text; c.lineWidth = 1.5; rrect(c, ux - 10, y - 6, 20, 12, 5); c.stroke(); if (clock > 1 && Q < 0.995) { c.fillStyle = kit.hue(265, 0.7); for (let q = 0; q < 3; q++) { c.beginPath(); c.arc(ux - 12 - q * 5 - (clock * 20 % 5), y, 1.6, 0, 6.283); c.fill(); } } }
          }
          // the blood level now
          const Cn = r.pts[i][1], maxC = Math.max(R.ir.cmax, R.ent.cmax, R.er.cmax, R.osm.cmax, 1e-9);
          c.fillStyle = C.series[k]; c.fillRect(x1 + 10, y - 4, (W - x1 - 60) * Cn / maxC, 8);
          kit.label(c, Cn.toFixed(2) + ' mg/L', x1 + 10, y + 14, { align: 'left', size: 10.5, color: C.muted });
        });
        pC.set({ vlines: [{ x: clock }] }); pR.set({ vlines: [{ x: clock }] });
        ro.set('clock', clock.toFixed(1) + ' h (' + (fed ? 'with a meal' : 'fasting') + ')');
        for (const [id] of FORMS) {
          const r = R[id], x = id === 'ir' ? 0.07 : r.pos[i];
          ro.set(id, (id === 'ir' && clock > 0.1 ? 'dispersed' : placeAt(x)) + ', ' + r.rel[i][1].toFixed(0) + ' % out · peak ' + r.cmax.toFixed(2) + ' mg/L at ' + r.tmax.toFixed(1) + ' h, F ' + (r.F * 100).toFixed(0) + ' %');
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ solid-osmotic */
  const AGENTS = [['Potassium chloride (≈ 245 atm)', 245], ['Sodium chloride (≈ 356 atm)', 356], ['Mannitol (≈ 38 atm)', 38], ['None: the drug alone', 0]];
  const GRADES = [['low viscosity', 6e-7, 0.06], ['medium viscosity', 2e-7, 0.035], ['high viscosity', 8e-8, 0.02]];   // D (cm²/s), erosion (1/h)

  Hyper.sim('solid-osmotic', {
    title: 'Osmotic pump or matrix?',
    blurb: `Two extended-release tablets holding 100 mg of the same hypothetical drug. On the left, an **elementary osmotic pump**: water crosses a 2 cm² semipermeable membrane at the rate $Q = A L_p \\Delta\\pi/h$, and the same volume of saturated drug solution leaves through the laser-drilled hole, so the delivery rate $R_0 = Q\\,C_s$ stays constant while solid drug remains (the zero-order share is $1 - C_s/\\rho$). After that it tails off. On the right, a **hypromellose matrix**: drug diffuses out through a growing depleted layer (Higuchi, $\\propto\\sqrt{t}$) while the gel slowly erodes. The blood levels are worked out with the one-compartment model, feeding each quarter-hour's release in as a short infusion. The drug has a half-life of 6 h and a volume of distribution of 60 L; an immediate-release tablet of 100 mg is shown for comparison. One second of animation is 1.5 hours. The membrane permeability and diffusion coefficients are illustrative values.

**Try this**
- Look at the release rate: the pump's plateau against the matrix's steadily falling rate. Then switch the view to √t: the matrix is a straight line there.
- Make the membrane twice as thick: the pump runs at half the rate, for twice as long.
- Replace the osmotic agent with mannitol, or with none at all: without a strong osmotic agent, the pump barely pumps.
- Lower the drug's solubility to 20 mg/mL. The pump pushes out too little drug (R₀ = Q·Cs), which is why poorly soluble drugs need a push–pull design; the matrix leans more on erosion, and its exponent n rises. Raise the solubility to 600 mg/mL: the pump's zero-order share shrinks to half.`,
    mount(box, kit, params) {
      const P = kit.pharma, M = kit.med;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250 });
      const [g1, g2] = twoPlots(box);
      const ctl = kit.controls(box.side, [
        { id: 'agent', type: 'select', label: 'Osmotic agent in the core', options: AGENTS, value: 245 },
        { id: 'h', label: 'Membrane thickness', min: 100, max: 400, step: 10, value: 200, unit: 'µm' },
        { id: 'Cs', label: 'Drug solubility', min: 10, max: 600, value: 300, unit: 'mg/mL', log: true, sig: 2 },
        { id: 'grade', type: 'select', label: 'Hypromellose grade (matrix)', options: GRADES.map((g, i) => [g[0], i]), value: 1 },
        { id: 'view', type: 'select', label: 'Right-hand graph', options: [['Release rate (mg/h)', 'rate'], ['Released against √t', 'sqrt'], ['Blood level (mg/L)', 'plasma']], value: (params && params.view) || 'rate' },
        { type: 'buttons', items: [{ id: 'replay', label: 'Replay', primary: true }] }
      ], (id) => { compute(); if (id === 'replay') clock = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['osm', 'Osmotic pump: water in · drug out'], ['fz', 'Zero-order phase'], ['mat', 'Matrix: Korsmeyer exponent n'], ['t80', 'Time to 80 % released'], ['pl', 'Peak blood level']]);
      const pF = kit.plot(g1, { x: { label: 'time (h)', min: 0, max: 24 }, y: { label: 'released (%)', min: 0, max: 100 }, legend: true }, 190);
      const pV = kit.plot(g2, { x: { label: 'time (h)' }, y: { label: '' }, legend: true }, 190);
      const DOSE = 100, AREA = 2e-4, LP = 2.2e-19, RHO = 1200, PGUT = 7.4, ATM = 101325, TAB_A = 3.0, TAB_V = 0.35, TEND = 30;
      let O, X, clock = 0;
      // the osmotic pump: cumulative mg released at time t (h)
      function osmotic() {
        const piCore = V.agent > 0 ? V.agent : V.Cs / 300 * 0.08206 * 310;            // the drug alone: van 't Hoff for a 300 g/mol solute
        const dpi = Math.max(0, piCore - PGUT) * ATM;
        const Q = AREA * LP * dpi / (V.h * 1e-6) * 3.6e9;                           // mL/h
        const R0 = Q * V.Cs, Fz = Math.max(0, 1 - V.Cs / RHO), lag = 1;
        const Mz = Fz * DOSE, tz = R0 > 0 ? Mz / R0 : Infinity, Mr0 = DOSE - Mz;
        const at = t => {
          const u = t - lag; if (u <= 0 || R0 <= 0) return 0;
          if (u <= tz) return R0 * u;
          const w = u - tz; return Mz + Mr0 - Mr0 / (1 + R0 * w / Math.max(Mr0, 1e-9));
        };
        return { piCore, Q, R0, Fz, tz, lag, at, rate: t => (at(t + 0.01) - at(Math.max(0, t - 0.01))) / (t < 0.01 ? 0.01 + t : 0.02) };
      }
      // the matrix: Higuchi diffusion through a growing depleted layer, in parallel with slow erosion of the gel
      function matrix() {
        const g = GRADES[V.grade], D = g[1] * 3600, e = g[2], C0 = DOSE / TAB_V;
        const Cs = Math.min(V.Cs, C0);
        const kA = V.Cs >= C0 ? 2 * C0 * Math.sqrt(D / Math.PI) : Math.sqrt(D * (2 * C0 - Cs) * Cs);   // mg/cm² per √h
        const kM = kA * TAB_A / DOSE, t60 = Math.pow(0.6 / kM, 2), lam = kM / (2 * Math.sqrt(t60)) / 0.4;
        const Fd = t => t <= t60 ? kM * Math.sqrt(t) : 1 - 0.4 * Math.exp(-lam * (t - t60));
        const F = t => 1 - (1 - Fd(t)) * (1 - Math.min(1, e * t));
        const front = t => Math.min(1, (t <= t60 ? kM * Math.sqrt(t) : Fd(t)));                // share of the matrix depleted
        return { kM, e, at: t => DOSE * F(t), front, Fd };
      }
      function t80(fn) { for (let t = 0; t <= 60; t += 0.02) if (fn(t) >= 0.8 * DOSE) return t; return Infinity; }
      function korsmeyer(fn) {
        const xs = [], ys = [];
        for (let t = 0.1; t <= 30; t += 0.1) { const f = fn(t) / DOSE; if (f >= 0.1 && f <= 0.6) { xs.push(Math.log(t)); ys.push(Math.log(f)); } }
        const n = xs.length; if (n < 3) return NaN;
        const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
        let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
        return sxx > 0 ? sxy / sxx : NaN;
      }
      function blood(fn) {
        const doses = [];
        for (let k = 0; k < TEND * 4; k++) { const a = fn((k + 1) / 4) - fn(k / 4); if (a > 1e-9) doses.push({ t: k / 4, amount: a, route: 'infusion', duration: 0.25 }); }
        return M.pk({ halfLife: 6, Vd: 60, doses });
      }
      let curves = null;
      function compute() {
        O = osmotic(); X = matrix();
        const ir = M.pk({ halfLife: 6, Vd: 60, doses: [{ t: 0, amount: DOSE, route: 'oral', ka: 1.5, F: 1 }] });
        const bo = blood(O.at), bm = blood(X.at);
        const ts = Array.from({ length: 121 }, (_, i) => i * 0.25);
        curves = { ts, bo, bm, ir };
        pF.set({ series: [{ pts: ts.map(t => [t, O.at(t)]), label: 'osmotic pump' }, { pts: ts.map(t => [t, X.at(t)]), label: 'hypromellose matrix' }], hlines: [{ y: 80, label: '80 %' }] });
        const C = kit.colors();
        if (V.view === 'rate') pV.set({ x: { label: 'time (h)', min: 0, max: 24 }, y: { label: 'release rate (mg/h)', min: 0 }, series: [{ pts: ts.map(t => [t, O.rate(t)]), label: 'osmotic pump' }, { pts: ts.slice(1).map(t => [t, (X.at(t + 0.01) - X.at(t - 0.01)) / 0.02]), label: 'matrix' }] });
        else if (V.view === 'sqrt') pV.set({ x: { label: '√t (√h)', min: 0, max: 5 }, y: { label: 'released (%)', min: 0, max: 100 }, series: [{ pts: ts.slice(0, 101).map(t => [Math.sqrt(t), O.at(t)]), label: 'osmotic pump' }, { pts: ts.slice(0, 101).map(t => [Math.sqrt(t), X.at(t)]), label: 'matrix' }] });
        else pV.set({ x: { label: 'time (h)', min: 0, max: 30 }, y: { label: 'blood level (mg/L)', min: 0 }, series: [{ pts: ts.map(t => [t, bo.at(t)]), label: 'osmotic pump' }, { pts: ts.map(t => [t, bm.at(t)]), label: 'matrix' }, { pts: ts.map(t => [t, ir.at(t)]), label: 'immediate release', dash: [5, 4], color: C.muted }] });
        const peak = b => Math.max(...ts.map(t => b.at(t)));
        ro.set('osm', O.Q.toFixed(4) + ' mL/h · ' + O.R0.toFixed(2) + ' mg/h (Δπ ≈ ' + Math.max(0, O.piCore - PGUT).toFixed(0) + ' atm)');
        ro.set('fz', (O.Fz * 100).toFixed(0) + ' % of the dose' + (Number.isFinite(O.tz) ? ', from 1 h to ' + (O.lag + O.tz).toFixed(1) + ' h' : ''));
        const n = korsmeyer(X.at);
        ro.set('mat', Number.isFinite(n) ? n.toFixed(2) + (n < 0.55 ? ' — diffusion' : n < 0.8 ? ' — diffusion and erosion' : ' — erosion, nearly zero order') : '—');
        const a = t80(O.at), b = t80(X.at);
        ro.set('t80', 'pump ' + (Number.isFinite(a) ? a.toFixed(1) + ' h' : 'over 60 h') + ' · matrix ' + (Number.isFinite(b) ? b.toFixed(1) + ' h' : 'over 60 h'));
        ro.set('pl', 'pump ' + peak(bo).toFixed(2) + ' · matrix ' + peak(bm).toFixed(2) + ' · immediate ' + peak(ir).toFixed(2) + ' mg/L');
      }
      compute();
      const dots = Array.from({ length: 90 }, (_, i) => { const r = rng(300 + i); return [r(), r()]; });
      const loop = kit.loop((dt) => {
        clock += dt * 1.5; if (clock > 24) clock = 0;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const tw = Math.min(W * 0.22, 190), th = Math.min(Hh * 0.42, 110), cy = Hh * 0.55;
        // --- the osmotic pump
        const ox = W * 0.18, rel = O.at(clock) / DOSE, solid = O.Fz > 0 ? clamp(1 - O.at(clock) / (O.Fz * DOSE), 0, 1) : 0;
        const tail = rel > O.Fz ? clamp((1 - rel) / Math.max(1e-9, 1 - O.Fz), 0, 1) : 1;
        c.fillStyle = kit.hue(265, clock < O.lag ? 0.12 * clock : 0.35 * tail); rrect(c, ox - tw / 2, cy - th / 2, tw, th, 22); c.fill();
        c.fillStyle = kit.hue(35, 0.95);
        const nSolid = Math.round(dots.length * (clock < O.lag ? 1 : solid));
        for (let i = 0; i < nSolid; i++) { const [a, b] = dots[i]; c.beginPath(); c.arc(ox - tw / 2 + 12 + a * (tw - 24), cy - th / 2 + 12 + b * (th - 24), 2.4, 0, 6.283); c.fill(); }
        c.strokeStyle = C.text; c.lineWidth = 1.5 + V.h / 80; rrect(c, ox - tw / 2, cy - th / 2, tw, th, 22); c.stroke();
        c.fillStyle = C.bg || C.bg2; c.fillRect(ox - 3, cy - th / 2 - 4, 6, 8);            // the laser-drilled hole
        const flow = clock > O.lag ? O.rate(clock) / Math.max(0.5, O.R0 || 1) : 0;
        if (clock > O.lag && O.Q > 1e-5) for (let i = 0; i < 12; i++) {                     // water in
          const a = i / 12 * 6.283 + clock, px = ox + (tw / 2 + 16) * Math.cos(a), py = cy + (th / 2 + 14) * Math.sin(a);
          kit.arrow(c, px, py, ox + (tw / 2 + 2) * Math.cos(a), cy + (th / 2 + 2) * Math.sin(a), kit.hue(205, 0.6), 1.2);
        }
        if (flow > 0.02) { c.fillStyle = kit.hue(265, 0.85); for (let i = 0; i < 8; i++) { const u = (clock * 2 + i / 8) % 1; c.beginPath(); c.arc(ox + Math.sin(i * 1.7) * 4 * u, cy - th / 2 - 6 - u * 40, 2 * Math.min(1.4, flow), 0, 6.283); c.fill(); } }
        kit.label(c, 'osmotic pump', ox, cy + th / 2 + 18, { size: 12.5, weight: 700, color: C.text });
        kit.label(c, (rel * 100).toFixed(0) + ' % out · ' + (clock > O.lag ? O.rate(clock).toFixed(1) : '0.0') + ' mg/h', ox, cy + th / 2 + 34, { size: 11.5, color: C.muted });
        // --- the matrix: gel layer, depleted zone, drug-loaded core
        const mx = W * 0.47, relM = X.at(clock) / DOSE, gel = 4 + 10 * Math.sqrt(Math.min(clock, 12) / 12), shrink = 1 - 0.25 * Math.min(1, X.e * clock);
        const mw = tw * shrink, mh = th * shrink, dep = X.front(clock), inW = mw * (1 - dep), inH = mh * (1 - 0.9 * dep);
        c.fillStyle = kit.hue(190, 0.22); rrect(c, mx - mw / 2 - gel, cy - mh / 2 - gel, mw + 2 * gel, mh + 2 * gel, 18); c.fill();
        c.fillStyle = kit.hue(190, 0.12); rrect(c, mx - mw / 2, cy - mh / 2, mw, mh, 12); c.fill();
        c.fillStyle = kit.hue(35, 0.95);
        for (const [a, b] of dots) { const x = mx - inW / 2 + a * inW, y = cy - inH / 2 + b * inH; if (inW > 4 && inH > 4) { c.beginPath(); c.arc(x, y, 2.2, 0, 6.283); c.fill(); } }
        c.strokeStyle = C.muted; c.setLineDash([3, 3]); c.lineWidth = 1; if (inW > 2) c.strokeRect(mx - inW / 2, cy - inH / 2, inW, inH); c.setLineDash([]);
        kit.label(c, 'hypromellose matrix', mx, cy + th / 2 + 18, { size: 12.5, weight: 700, color: C.text });
        kit.label(c, (relM * 100).toFixed(0) + ' % out · ' + ((X.at(clock + 0.01) - X.at(Math.max(0, clock - 0.01))) / 0.02).toFixed(1) + ' mg/h', mx, cy + th / 2 + 34, { size: 11.5, color: C.muted });
        // --- the clock and the blood levels now
        const x0 = W * 0.66; let y = 26;
        kit.label(c, clock.toFixed(1) + ' h after swallowing', x0, y, { align: 'left', size: 14, weight: 700, color: C.text }); y += 24;
        const lv = [['pump', curves.bo.at(clock), C.series[0]], ['matrix', curves.bm.at(clock), C.series[1]], ['immediate', curves.ir.at(clock), C.muted]];
        const mxC = Math.max(1e-9, ...curves.ts.map(t => curves.ir.at(t)));
        kit.label(c, 'blood level now', x0, y, { align: 'left', size: 12, color: C.muted }); y += 16;
        for (const [nm, v, col] of lv) { c.fillStyle = col; c.fillRect(x0, y - 5, (W - x0 - 90) * clamp(v / mxC, 0, 1), 10); kit.label(c, nm + ' ' + v.toFixed(2) + ' mg/L', x0 + 4 + (W - x0 - 90) * clamp(v / mxC, 0, 1), y, { align: 'left', size: 11, color: C.text }); y += 18; }
        y += 6;
        kit.label(c, O.Q < 1e-4 ? 'the pump barely draws water in' : clock < O.lag ? 'the pump is hydrating' : rel < O.Fz ? 'pump: saturated core, constant rate' : 'pump: solid gone, rate falling', x0, y, { align: 'left', size: 12, color: C.muted }); y += 17;
        kit.label(c, 'matrix: depleted zone ' + (dep * 100).toFixed(0) + ' % of the way in', x0, y, { align: 'left', size: 12, color: C.muted });
        pF.set({ vlines: [{ x: clock }] });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ solid-disintegration */
  Hyper.sim('solid-disintegration', {
    title: 'The disintegration test',
    blurb: `Five tablets in the tubes of a disintegration basket, moved up and down about 30 times a minute in liquid at 37 °C, as in USP <701> and Ph. Eur. 2.9.1. Water first has to get in: it wicks through the pores by capillary action, and by the Washburn equation the depth grows as $\\sqrt{t}$, faster for wide pores and well-wetted surfaces. The model uses an effective pore radius of a twentieth of the true one, to allow for tortuous pores. Then the disintegrant swells and breaks the bonds, which takes longer in a stronger tablet. A film coat must dissolve first. An enteric coat stays shut in acid and opens in the pH 6.8 buffer. Each tablet is judged against the European Pharmacopoeia limit for its kind: orodispersible 3 min, uncoated 15 min, film-coated 30 min, gastro-resistant intact for 2 h in acid and then within 60 min in buffer. The formulations are illustrative.

**Try this**
- Run the test in water and compare the orodispersible tablet (wide pores, lots of disintegrant, soft) with the ordinary one.
- Take the superdisintegrant out of the conventional tablets (0 %): they slow down enormously. Put in 6 %.
- Make the conventional tablets harder (4 MPa). Stronger bonds take longer to break, and the over-lubricated tablet, which also lets water in slowly, fails its limit.
- Choose the gastro-resistance test and a fast test speed: the enteric tablet survives two hours of acid, then opens in the buffer.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const gb = plotDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'med', type: 'select', label: 'Medium', options: [['Water, 37 °C', 'water'], ['Gastro-resistance test: 0.1 M HCl for 2 h, then pH 6.8 buffer', 'acid']], value: 'water' },
        { id: 'dis', label: 'Superdisintegrant (conventional tablets)', min: 0, max: 8, step: 0.5, value: 3, unit: '%' },
        { id: 'sig', label: 'Tensile strength (conventional tablets)', min: 0.5, max: 4, step: 0.1, value: 2, unit: 'MPa' },
        { id: 'spd', type: 'select', label: 'Test speed', options: [['5 × real time', 5], ['30 × real time', 30], ['120 × real time', 120]], value: 5 },
        { type: 'buttons', items: [{ id: 'go', label: 'Start the test', primary: true }] }
      ], () => { setup(); t = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Test time'], ['odt', 'Orodispersible'], ['unc', 'Uncoated'], ['lub', 'Uncoated, over-lubricated'], ['fc', 'Film-coated'], ['ent', 'Gastro-resistant (enteric)']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)', min: 0, max: 60 }, y: { label: 'water depth from each face (mm)', min: 0, max: 2.4 }, legend: true }, 180);
      const ETA = 0.69e-3, GAM = 0.070, HALF = 2e-3, ACID = 7200;
      // each tablet: pore radius (µm), contact angle (°), disintegrant (%), strength (MPa), coat, the limit (s) and its name
      let lanes = [], t = 0;
      function setup() {
        const conv = { r: 0.2, th: 60, dis: V.dis, sig: V.sig };
        lanes = [
          Object.assign({ id: 'odt', name: 'orodispersible', r: 1.5, th: 45, dis: 5, sig: 0.6, coat: null, limit: 180 }),
          Object.assign({ id: 'unc', name: 'uncoated', coat: null, limit: 900 }, conv),
          Object.assign({ id: 'lub', name: 'over-lubricated', coat: null, limit: 900 }, conv, { th: 87, slow: 6 }),
          Object.assign({ id: 'fc', name: 'film-coated', coat: 'film', limit: 1800 }, conv),
          Object.assign({ id: 'ent', name: 'enteric', coat: 'enteric', limit: 3600 }, conv)
        ];
        for (const L of lanes) {
          const k = (L.r * 1e-6 / 20) * GAM * Math.cos(L.th * DEG) / (2 * ETA);            // Washburn: L² = k t (m²/s)
          L.k = k; L.tw = HALF * HALF / Math.max(k, 1e-15);
          L.tsw = 40 * L.sig * Math.pow(3 / (L.dis + 0.3), 1.3) * (L.slow || 1);
          L.coatT = L.coat === 'film' ? 150 : L.coat === 'enteric' ? (V.med === 'acid' ? 480 : 3600) : 0;   // s to dissolve the coat once it can
          L.coatStart = L.coat === 'enteric' && V.med === 'acid' ? ACID : 0;
          L.td = L.coatStart + L.coatT + L.tw + L.tsw;
          L.frag = Array.from({ length: 10 }, (_, i) => { const r = rng(55 + i * 3 + L.id.length); return [r() - 0.5, r(), 0.5 + r()]; });
        }
        const ts = Array.from({ length: 121 }, (_, i) => i * 0.5);
        plot.set({ series: lanes.filter(L => L.id !== 'fc' && L.id !== 'ent').map(L => ({ pts: ts.map(s => [s, Math.min(2.4, Math.sqrt(L.k * s) * 1000)]), label: L.name + ' (r ' + L.r + ' µm, θ ' + L.th + '°)' })), hlines: [{ y: 2, label: 'centre of a 4 mm tablet' }] });
      }
      setup();
      const fmtT = s => s < 60 ? s.toFixed(0) + ' s' : s < 3600 ? mmss(s) : (s / 3600).toFixed(2) + ' h';
      const loop = kit.loop((dt, T) => {
        t += dt * V.spd;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const acidNow = V.med === 'acid' && t < ACID;
        // beaker and liquid
        const bx0 = W * 0.04, bx1 = W * 0.64, by0 = 40, by1 = Hh - 16, lvl = by0 + (by1 - by0) * 0.18;
        c.fillStyle = acidNow ? kit.hue(20, 0.12) : kit.hue(205, 0.12); c.fillRect(bx0, lvl, bx1 - bx0, by1 - lvl);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx0, by0); c.lineTo(bx0, by1); c.lineTo(bx1, by1); c.lineTo(bx1, by0); c.stroke();
        kit.label(c, acidNow ? '0.1 M HCl, 37 °C' : V.med === 'acid' ? 'pH 6.8 buffer, 37 °C' : 'water, 37 °C', bx1 - 6, lvl + 12, { align: 'right', size: 11.5, color: C.muted });
        const bob = 26 * Math.sin(2 * Math.PI * 0.5 * T), tubeH = (by1 - lvl) * 0.62, tubeTop = lvl + 10 + bob, tw = (bx1 - bx0) / lanes.length;
        lanes.forEach((L, i) => {
          const cx = bx0 + tw * (i + 0.5), w = Math.min(46, tw * 0.62);
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(cx - w / 2, tubeTop, w, tubeH);
          c.setLineDash([2, 2]); c.beginPath(); c.moveTo(cx - w / 2, tubeTop + tubeH); c.lineTo(cx + w / 2, tubeTop + tubeH); c.stroke(); c.setLineDash([]);
          const ty = tubeTop + tubeH - 16, tabW = w * 0.8, tabH = 12;
          const coatLeft = L.coat ? clamp(1 - Math.max(0, t - L.coatStart) / Math.max(1, L.coatT), 0, 1) : 0;
          const tin = t - L.coatStart - L.coatT, wet = L.coat && coatLeft > 0 ? 0 : clamp(Math.sqrt(L.k * Math.max(0, tin)) / HALF, 0, 1);
          if (t < L.td) {
            const swell = tin > L.tw ? clamp((tin - L.tw) / L.tsw, 0, 1) : 0, g = 1 + 0.25 * swell;
            c.fillStyle = kit.hue(35, 0.95); rrect(c, cx - tabW * g / 2, ty - tabH * g / 2, tabW * g, tabH * g, 4); c.fill();
            if (wet > 0) { c.fillStyle = kit.hue(205, 0.45); rrect(c, cx - tabW * g / 2, ty - tabH * g / 2, tabW * g, tabH * g, 4); c.fill(); c.fillStyle = kit.hue(35, 0.95); const dry = 1 - wet; if (dry > 0.02) c.fillRect(cx - tabW * g / 2 * dry, ty - tabH * g / 2 * dry, tabW * g * dry, tabH * g * dry); }
            if (swell > 0.4) { c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.moveTo(cx - 4, ty - tabH / 2); c.lineTo(cx + 2, ty); c.lineTo(cx - 2, ty + tabH / 2); c.stroke(); }
            if (L.coat && coatLeft > 0) { c.strokeStyle = L.coat === 'film' ? kit.hue(10, coatLeft) : kit.hue(330, coatLeft); c.lineWidth = 3; rrect(c, cx - tabW / 2 - 2, ty - tabH / 2 - 2, tabW + 4, tabH + 4, 5); c.stroke(); }
          } else {
            const age = Math.min(1, (t - L.td) / (20 * V.spd));
            c.fillStyle = kit.hue(35, 0.9 * (1 - age));
            for (const [a, b, sp] of L.frag) { c.beginPath(); c.arc(cx + a * w * (0.8 + age), ty + b * 10 + age * sp * 50, 2.5, 0, 6.283); c.fill(); }
          }
          kit.label(c, L.name, cx, by1 + 10, { size: 10.5, color: C.text });
          const inWater = L.coat === 'enteric' && V.med === 'water', done = t >= L.td, pass = inWater ? null : L.coat === 'enteric' ? L.td > ACID - 1 && L.td - ACID <= 3600 : L.td <= L.limit;
          kit.label(c, done ? fmtT(L.td) + (pass === null ? '' : pass ? ' ✓' : ' ✗') : t > L.limit + L.coatStart && L.coat !== 'enteric' ? 'over the limit' : '…', cx, by0 - 10, { size: 11.5, weight: 700, color: done && pass !== null ? (pass ? C.ok : C.bad) : C.muted });
          ro.set(L.id, (done ? 'disintegrated at ' + fmtT(L.td) : 'intact' + (L.coat && coatLeft > 0 ? ', coat on' : wet > 0 ? ', ' + (wet * 100).toFixed(0) + ' % wetted' : '')) + (inWater ? ' (judged in acid, then buffer: choose that test)' : ' (limit ' + (L.coat === 'enteric' ? '2 h intact in acid, then 60 min' : fmtT(L.limit)) + ')'));
        });
        const x0 = W * 0.68; let y = 30;
        kit.label(c, 'test time ' + fmtT(t), x0, y, { align: 'left', size: 14, weight: 700, color: C.text }); y += 22;
        kit.label(c, acidNow ? 'acid stage: ' + fmtT(ACID - t) + ' to go' : V.med === 'acid' ? 'buffer stage' : 'in water', x0, y, { align: 'left', size: 12, color: C.muted }); y += 26;
        kit.label(c, 'water in by capillarity: L² ∝ r cos θ · t', x0, y, { align: 'left', size: 12, color: C.muted }); y += 18;
        kit.label(c, 'then the disintegrant swells', x0, y, { align: 'left', size: 12, color: C.muted });
        ro.set('t', fmtT(t) + ' (' + V.spd + ' × real time)');
        if (t > ACID + 4000 || (V.med === 'water' && t > 4000)) t = 0;
      }, box.stage);
      loop.start();
    }
  });

})();
