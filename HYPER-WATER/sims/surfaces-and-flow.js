/* HYPER-WATER · sims/surfaces-and-flow.js — the simulations of "Surfaces, drops and flow" (topic code surf-).
 *   surf-surface-molecule   a molecule at the surface holds fewer hydrogen bonds than one in the bulk; surface tension of liquids side by side
 *   surf-drops              a free drop against its size (Laplace pressure, Bond number, raindrops) and a drop on a surface (Young, Wenzel, Cassie–Baxter)
 *   surf-capillary          three tubes of different bore: Jurin's height for the liquid, the temperature and the contact angle chosen
 *   surf-floating           a needle or a water strider on the surface: the weight per length against 2σ, and the dimple
 *   surf-surfactants        soap molecules crowding the surface, micelles above the critical micelle concentration, the pepper trick
 *   surf-viscosity          a sphere settling in a fluid at Stokes' speed, beside the same sphere in water at 20 °C
 *   surf-leidenfrost        a drop on a hot plate: lifetime against plate temperature, with the Leidenfrost point (schematic curve)
 *   surf-waves              the water-hammer pulse in a pipe (Joukowsky, by characteristics) and the speed of sound in water and sea water (Mackenzie 1981)
 * Every number that a function of kit.water can give comes from it: surface tension, density, viscosity, bulk modulus, speed of sound, the
 * capillary length, Laplace and Jurin. Local models, each said so in its blurb: the bond-flicker cartoon, the drop profile (a schematic
 * superellipse of the right volume), the surfactant adsorption curve (a Szyszkowski fit to SDS), Stokes drag with the Schiller–Naumann
 * correction, the lifetime of a drop on a hot plate, the method of characteristics for the pipe, Mackenzie's equation for sea water.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2, G = 9.80665;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fin = (x, d) => (Number.isFinite(x) ? x : d);
  function fmtLen(m) {
    const a = Math.abs(m);
    if (!Number.isFinite(m)) return '—';
    if (a >= 1) return m.toFixed(a >= 100 ? 0 : a >= 10 ? 1 : 2) + ' m';
    if (a >= 0.01) return (m * 100).toFixed(a >= 0.1 ? 1 : 2) + ' cm';
    if (a >= 1e-3) return (m * 1e3).toFixed(2) + ' mm';
    if (a >= 1e-6) return (m * 1e6).toFixed(a >= 1e-4 ? 0 : 1) + ' µm';
    return (m * 1e9).toFixed(0) + ' nm';
  }
  function fmtP(Pa) {
    const a = Math.abs(Pa);
    if (!Number.isFinite(Pa)) return '—';
    if (a >= 1e5) return (Pa / 1e5).toFixed(a >= 1e6 ? 0 : 2) + ' bar';
    if (a >= 1e3) return (Pa / 1e3).toFixed(1) + ' kPa';
    return Pa.toFixed(a >= 100 ? 0 : 1) + ' Pa';
  }
  function fmtSpeed(v) {
    const a = Math.abs(v);
    if (!Number.isFinite(v)) return '—';
    if (a >= 1) return v.toFixed(2) + ' m/s';
    if (a >= 1e-3) return (v * 1e3).toFixed(a >= 0.1 ? 0 : 2) + ' mm/s';
    if (a >= 1e-6) return (v * 1e6).toFixed(a >= 1e-4 ? 0 : 2) + ' µm/s';
    return (v * 1e9).toFixed(1) + ' nm/s';
  }
  function fmtTime(s) {
    if (!Number.isFinite(s)) return '—';
    if (s < 1e-3) return (s * 1e6).toFixed(0) + ' µs';
    if (s < 1) return (s * 1e3).toFixed(s < 0.01 ? 2 : 0) + ' ms';
    if (s < 120) return s.toFixed(s < 10 ? 2 : 0) + ' s';
    if (s < 7200) return (s / 60).toFixed(1) + ' min';
    if (s < 172800) return (s / 3600).toFixed(1) + ' h';
    return (s / 86400).toFixed(1) + ' days';
  }
  /* a deterministic pseudo-random generator, so a reset repeats */
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  const liquidOf = (W, id) => W.LIQUIDS.find(l => l.id === id) || W.LIQUIDS[0];

  /* ================================================================ the surface molecule */
  Hyper.sim('surf-surface-molecule', {
    title: 'A molecule at the surface',
    blurb: `A slice of water drawn as a lattice, to count bonds. Every molecule in the bulk reaches for **four** neighbours with hydrogen bonds; a molecule in the top row has nothing above it and reaches for only **three**. Each dashed bond flickers on and off at the rate the temperature allows (shown in slow motion, a real bond lasts about a picosecond), and the number beside each molecule is the bonds it holds right now. This is a cartoon, not a molecular-dynamics run: real surface molecules also turn, leaving one O–H pointing out of the water, which is why the true cost is smaller than a whole bond.

**Try this**
- Compare the two averages in the read-out: the top row always holds fewer bonds than the rows below it, at any temperature.
- Heat to 100 °C: fewer bonds hold everywhere, the surface tension falls from 76 to 59 mN/m. Cool to 0 °C and it rises.
- Read *energy per surface molecule*: surface tension times the area one molecule occupies is about 4 kJ/mol, a fifth of a hydrogen bond, not a whole one.
- On the right, the same measurement for other liquids: water stands far above ethanol and hexane (which have little or no hydrogen bonding) and far below mercury (metallic bonds).`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature', min: 0, max: 100, step: 1, value: params.T != null ? params.T : 20, unit: '°C' },
        { id: 'bonds', type: 'check', label: 'Show hydrogen bonds', value: true },
        { id: 'count', type: 'check', label: 'Number each molecule by its bonds', value: true },
        { id: 'slow', type: 'check', label: 'Slow motion', value: false }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sig', 'Surface tension σ'], ['bulk', 'Bonds per molecule in the bulk (measured)'], ['rows', 'Top row · lower rows (on screen)'], ['area', 'Area of one molecule at the surface'], ['E', 'σ × area, per mole'], ['frac', 'As a fraction of one hydrogen bond']]);
      const COLS = 8, ROWS = 5;
      const r = rng(11);
      const mol = [];
      for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) mol.push({ i, j, a: -Math.PI / 2 + (r() - 0.5), jx: 0, jy: 0, va: 0 });
      /* bonds: right and down from every molecule, plus ghost stubs at the left, right and bottom edges */
      const bonds = [];
      for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
        bonds.push({ a: [i, j], b: [i + 1, j], on: true, ghost: i === COLS - 1 });
        bonds.push({ a: [i, j], b: [i, j + 1], on: true, ghost: j === ROWS - 1 });
      }
      for (let j = 0; j < ROWS; j++) bonds.push({ a: [-1, j], b: [0, j], on: true, ghost: true });
      const idx = (i, j) => j * COLS + i;
      let avgTop = 3.7, avgIn = 3.7, tick = 0;
      const vapour = [];
      for (let k = 0; k < 3; k++) vapour.push({ x: r(), y: r(), vx: (r() - 0.5) * 0.25, vy: (r() - 0.5) * 0.25, a: r() * TAU });
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const T = V.T;
        const pBond = clamp(W.hbondsPerMolecule(T) / 4, 0.05, 0.995);
        const tauScreen = V.slow ? 1.6 : 0.7;
        const kOff = 1 / tauScreen, kOn = kOff * pBond / (1 - pBond);
        const h = Math.min(dt, 0.05);
        for (const b of bonds) {
          if (b.on) { if (r() < kOff * h) b.on = false; } else if (r() < kOn * h) b.on = true;
        }
        /* layout */
        const lw = Math.max(250, Wd * 0.6);
        const sp = Math.min((lw - 50) / (COLS + 0.5), (Hh - 120) / (ROWS + 1.2));
        const x0 = 30 + sp * 0.5, y0 = Hh - 24 - sp * (ROWS - 0.2);
        const sc = sp / 2.7;
        const pos = (i, j) => [x0 + i * sp + mol[idx(clamp(i, 0, COLS - 1), clamp(j, 0, ROWS - 1))].jx * 0 , y0 + j * sp];
        /* the molecules' small motions */
        for (const m of mol) {
          m.va += (r() - 0.5) * 6 * h - m.va * 2 * h - (m.a + Math.PI / 2) * 3 * h * (1 / (1 + 0.02 * T));
          m.a += m.va * h;
          m.jx += ((r() - 0.5) * 3 * h * (T + 273) / 300 - m.jx * 4 * h);
          m.jy += ((r() - 0.5) * 3 * h * (T + 273) / 300 - m.jy * 4 * h);
        }
        const P = (i, j) => { const m = mol[idx(clamp(i, 0, COLS - 1), clamp(j, 0, ROWS - 1))]; const p = pos(i, j); return [p[0] + m.jx * sc * 0.3, p[1] + m.jy * sc * 0.3]; };
        /* the vapour and the surface line */
        const surfY = y0 - sp * 0.62;
        c.save();
        c.fillStyle = 'rgba(70,150,235,0.10)'; c.fillRect(24, surfY, x0 + (COLS - 0.5) * sp - 24 + 8, Hh - 10 - surfY);
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(24, surfY); c.lineTo(x0 + (COLS - 0.5) * sp + 8, surfY); c.stroke();
        c.restore();
        kit.label(c, 'surface', 28, surfY - 7, { color: C.accent, size: 11.5, weight: 650 });
        kit.label(c, 'air and a little vapour', 28 + 60, surfY - 7 - 18, { color: C.faint, size: 11 });
        for (const v of vapour) {
          v.x += v.vx * h * 0.4; v.y += v.vy * h * 0.4; v.a += 0.4 * h;
          if (v.x < 0.05 || v.x > 0.95) v.vx *= -1; if (v.y < 0.1 || v.y > 0.9) v.vy *= -1;
          v.x = clamp(v.x, 0.02, 0.98); v.y = clamp(v.y, 0.05, 0.95);
          S.molecule(c, 40 + v.x * (lw - 70), 14 + v.y * Math.max(10, surfY - 40), { angle: v.a, scale: sc * 0.7, alpha: 0.55 });
        }
        /* the bonds */
        const count = new Array(mol.length).fill(0);
        for (const b of bonds) {
          if (!b.on) continue;
          const [ai, aj] = b.a, [bi, bj] = b.b;
          if (ai >= 0 && ai < COLS && aj >= 0 && aj < ROWS) count[idx(ai, aj)]++;
          if (bi >= 0 && bi < COLS && bj >= 0 && bj < ROWS) count[idx(bi, bj)]++;
          if (!V.bonds) continue;
          const p1 = P(ai, aj);
          let p2 = P(bi, bj);
          if (b.ghost) {
            const dx = bi - ai, dy = bj - aj;
            p2 = (bi < 0) ? [p1[0] - sp * 0.55, p1[1]] : [p1[0] + dx * sp * 0.55, p1[1] + dy * sp * 0.55];
            const q1 = (bi < 0) ? P(bi + 1, bj) : p1;
            S.hbond(c, (bi < 0 ? q1[0] - sp * 0.55 : p1[0]), (bi < 0 ? q1[1] : p1[1]), (bi < 0 ? q1[0] - sp * 0.12 : p2[0]), (bi < 0 ? q1[1] : p2[1]), { alpha: 0.35 });
            continue;
          }
          const ux = p2[0] - p1[0], uy = p2[1] - p1[1], d = Math.hypot(ux, uy) || 1;
          S.hbond(c, p1[0] + ux / d * sc * 0.9, p1[1] + uy / d * sc * 0.9, p2[0] - ux / d * sc * 0.9, p2[1] - uy / d * sc * 0.9, { alpha: 0.75 });
        }
        /* the molecules and their counts */
        for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
          const m = mol[idx(i, j)], p = P(i, j);
          S.molecule(c, p[0], p[1], { angle: m.a, scale: sc * 0.95, alpha: j === 0 ? 1 : 0.9 });
          if (V.count) kit.label(c, String(count[idx(i, j)]), p[0] + sc * 0.9, p[1] - sc * 1.05, { color: j === 0 ? C.warn : C.muted, size: 10.5, weight: 650, align: 'center' });
        }
        let sTop = 0, sIn = 0, nIn = 0;
        for (let i = 0; i < COLS; i++) sTop += count[idx(i, 0)];
        for (let j = 1; j < ROWS - 1; j++) for (let i = 1; i < COLS - 1; i++) { sIn += count[idx(i, j)]; nIn++; }
        avgTop += (sTop / COLS - avgTop) * Math.min(1, h * 1.5); avgIn += (sIn / Math.max(1, nIn) - avgIn) * Math.min(1, h * 1.5);
        kit.label(c, 'top row: 3 slots', x0 + (COLS - 0.5) * sp + 12, y0 - 2, { color: C.warn, size: 11, baseline: 'middle' });
        kit.label(c, 'lower rows: 4 slots', x0 + (COLS - 0.5) * sp + 12, y0 + 2 * sp, { color: C.muted, size: 11, baseline: 'middle' });
        /* the bars of surface tension */
        const bx = Math.max(lw + 90, Wd * 0.64) + 6, bw = Wd - bx - 56;
        if (bw > 40) {
          kit.label(c, 'σ at 20 °C (mN/m)', bx - 70, 14, { color: C.muted, size: 11.5, weight: 650 });
          const L = W.LIQUIDS.filter(l => l.id !== 'ammonia' && l.id !== 'oil');
          const rowH = Math.min(26, (Hh - 50) / L.length);
          L.forEach((l, k) => {
            const y = 34 + k * rowH;
            const val = l.id === 'water' ? W.surfaceTension(T) * 1e3 : l.sigma;
            const len = clamp(val / 100, 0, 1) * bw;
            kit.label(c, l.name, bx - 6, y + rowH * 0.4, { color: l.id === 'water' ? C.text : C.muted, size: 11, align: 'right', baseline: 'middle', weight: l.id === 'water' ? 650 : 400 });
            c.fillStyle = l.id === 'water' ? C.accent : (l.id === 'mercury' ? C.warn : C.faint);
            c.fillRect(bx, y, Math.max(2, len), rowH * 0.62);
            kit.label(c, (val > 100 ? '▸ ' : '') + val.toFixed(l.id === 'water' ? 1 : 0), bx + Math.max(2, len) + 4, y + rowH * 0.31, { color: C.text, size: 11, baseline: 'middle' });
          });
        }
        const sig = W.surfaceTension(T), area = Math.pow(W.molarVolume(T) * 1e-6 / W.NA, 2 / 3);
        const E = sig * area * W.NA / 1000;
        ro.set('sig', (sig * 1e3).toFixed(1) + ' mN/m');
        ro.set('bulk', W.hbondsPerMolecule(T).toFixed(2) + ' of 4 · lifetime ' + (W.hbondLifetime(T) * 1e12).toFixed(2) + ' ps');
        ro.set('rows', avgTop.toFixed(2) + ' · ' + avgIn.toFixed(2));
        ro.set('area', (area * 1e18).toFixed(3) + ' nm²');
        ro.set('E', E.toFixed(1) + ' kJ/mol');
        ro.set('frac', (E / (W.HBOND.energy / 1000 || 20)).toFixed(2) + ' of a 20 kJ/mol bond');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ drops: free and on a surface */
  Hyper.sim('surf-drops', {
    title: 'Drops: their size and their feet',
    blurb: `Two views of a drop. **A free drop** (left button): its radius sets the Laplace pressure $2\\sigma/r$ and the Bond number $\\rho g r^2/\\sigma$ that compares gravity with surface tension. Small drops are spheres; above the capillary length (2.7 mm) gravity wins and a drop on a non-wetting surface squashes to a puddle about two capillary lengths thick. The profile is a schematic curve of the right volume, not a solution of the Young–Laplace equation. **A drop on a surface** (right button): the contact angle comes from Young's equation, and a rough surface changes it (Wenzel: the liquid fills the grooves; Cassie–Baxter: it rides on trapped air).

**Try this**
- Free drop: sweep the radius from 0.05 mm to 6 mm and watch the dashed circle (a sphere of the same volume) separate from the drop at about 2–3 mm.
- Tick *falling through air*: a raindrop of 1 mm is a sphere, one of 4 mm is a flattened bun, and above 5 mm it cannot hold together.
- Pressure inside a 1 µm drop is a hundred times that in a 100 µm drop. Then notice that a soap bubble of the same radius has twice the pressure of a drop (two surfaces).
- On a surface: pick *lotus leaf* or *Teflon* and raise the temperature; then switch the texture to *Cassie–Baxter* and shrink the solid fraction: the angle climbs past 150°, the drop is nearly a ball.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const PRESETS = [['Clean glass (about 10°)', 10], ['Skin or paper (about 60°)', 60], ['Polyethylene (about 95°)', 95], ['Car wax (about 105°)', 105], ['Teflon, PTFE (about 110°)', 110], ['Lotus leaf (about 160°)', 160]];
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['A free drop and its size', 'free'], ['A drop on a surface', 'wet']], value: params.mode === 'wet' ? 'wet' : 'free' },
        { id: 'where', type: 'select', label: 'Where the drop is', options: [['On a non-wetting surface', 'rest'], ['Falling through air (rain)', 'rain']], value: params.where || 'rest' },
        { id: 'a', label: 'Radius of the drop (as a sphere)', min: 0.05, max: 6, step: 0.01, value: params.a || 1, unit: 'mm', log: true, sig: 2 },
        { id: 'T', label: 'Temperature', min: 0, max: 100, step: 1, value: params.T != null ? params.T : 20, unit: '°C' },
        { id: 'preset', type: 'select', label: 'The surface', options: PRESETS, value: params.theta || 10 },
        { id: 'theta', label: 'Young contact angle', min: 0, max: 180, step: 1, value: params.theta || 10, unit: '°' },
        { id: 'tex', type: 'select', label: 'Texture of the surface', options: [['Smooth', 'smooth'], ['Rough, liquid fills the grooves (Wenzel)', 'wenzel'], ['Pillars, air trapped (Cassie–Baxter)', 'cassie']], value: params.tex || 'smooth' },
        { id: 'rough', label: 'Roughness r (true area ÷ flat area)', min: 1, max: 3, step: 0.05, value: 1.6 },
        { id: 'f', label: 'Solid fraction f under the drop', min: 0.02, max: 1, step: 0.01, value: 0.1 },
        { id: 'vol', label: 'Volume of the drop', min: 1, max: 100, step: 1, value: 10, unit: 'µL', log: true, sig: 2 }
      ], (id) => {
        if (id === 'preset') ctl.set('theta', V.preset, false);
        modes();
      });
      const V = ctl.values;
      function modes() {
        const free = V.view === 'free';
        ctl.show('where', free); ctl.show('a', free);
        ['preset', 'theta', 'tex', 'vol'].forEach(k => ctl.show(k, !free));
        ctl.show('rough', !free && V.tex === 'wenzel'); ctl.show('f', !free && V.tex === 'cassie');
        for (const k of ['lap', 'bub', 'bo', 'reg', 'size']) ro.show(k, free);
        for (const k of ['cy', 'eff', 'hh', 'base', 'dsl', 'wet']) ro.show(k, !free);
      }
      const ro = kit.readout(box.side, [['lap', 'Pressure inside a drop, 2σ/r'], ['bub', 'Inside a soap bubble of that radius, 4σ/r'], ['bo', 'Bond number'], ['reg', 'The drop is'], ['size', 'Height × width'],
        ['cy', 'cos θ from Young'], ['eff', 'Angle the drop shows'], ['hh', 'Height of the drop'], ['base', 'Width of the foot'], ['dsl', 'σ(solid–air) − σ(solid–liquid)'], ['wet', 'The surface is']]);
      modes();
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const T = V.T, sig = W.surfaceTension(T), lc = W.capillaryLength(T);
        const free = V.view === 'free';
        const blue = 'rgba(70,150,235,0.55)', blueEdge = C.accent;
        if (free) {
          const a = V.a * 1e-3, rain = V.where === 'rain';
          const Bo = W.bondNumber(a, T);
          let hgt, wid, shape;
          if (!rain) {
            const H0 = 2 * a / Math.sqrt(1 + Bo), p = 2 + 2 * (1 - 1 / Math.sqrt(1 + Bo));
            let vol1 = 0;
            for (let k = 0; k < 60; k++) { const y = (k + 0.5) / 60; const rr = 0.5 * Math.pow(1 - Math.pow(y, p), 1 / p); vol1 += Math.PI * rr * rr / 60; }
            const Vt = 4 / 3 * Math.PI * a * a * a;
            hgt = H0; wid = Math.sqrt(Vt / (vol1 * H0));      // volume of a superellipsoid of height H0 and diameter D: vol1·D²·H0
            shape = { H: H0, D: wid, p };
          } else {
            const Dmm = 2 * a * 1e3, alpha = clamp(1.03 - 0.062 * Dmm, 0.4, 1);
            const bh = a / Math.cbrt(alpha);
            shape = { H: 2 * alpha * bh, D: 2 * bh, p: 2, rain: true };
            hgt = shape.H; wid = shape.D;
          }
          const mpx = Math.min((Wd * 0.62) / wid, (Hh * 0.52) / Math.max(hgt, 2 * a));   // px per metre
          const groundY = Hh * 0.8, cx = Wd * 0.44;
          /* the sphere of equal volume, dashed */
          const cyd = rain ? Hh * 0.46 : groundY - a * mpx;
          c.save();
          c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1;
          c.beginPath(); c.arc(cx, rain ? cyd : groundY - a * mpx, a * mpx, 0, TAU); c.stroke(); c.setLineDash([]);
          c.restore();
          /* the drop */
          c.save();
          c.fillStyle = blue; c.strokeStyle = blueEdge; c.lineWidth = 1.6;
          c.beginPath();
          const N = 80;
          if (!rain) {
            for (let k = 0; k <= 2 * N; k++) {                 // a superellipse |x/(D/2)|^p + |y/(H/2)|^p = 1, resting on the surface
              const u = k / (2 * N) * TAU;
              const cs = Math.cos(u), sn = Math.sin(u);
              const xx = 0.5 * shape.D * Math.sign(cs) * Math.pow(Math.abs(cs), 2 / shape.p);
              const yy = 0.5 * shape.H * Math.sign(sn) * Math.pow(Math.abs(sn), 2 / shape.p);
              const px = cx + xx * mpx, py = groundY - (0.5 * shape.H + yy) * mpx;
              if (k === 0) c.moveTo(px, py); else c.lineTo(px, py);
            }
          } else {
            const top = 0.62, bot = 0.38;
            for (let k = 0; k <= 2 * N; k++) {
              const u = k / (2 * N) * TAU;
              const sn = Math.sin(u), cs = Math.cos(u);
              const yy = sn > 0 ? sn * shape.H * top : sn * shape.H * bot;
              const px = cx + cs * shape.D / 2 * mpx, py = cyd - yy * mpx;
              if (k === 0) c.moveTo(px, py); else c.lineTo(px, py);
            }
          }
          c.closePath(); c.fill(); c.stroke();
          c.restore();
          if (!rain) { c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(10, groundY); c.lineTo(Wd - 10, groundY); c.stroke(); kit.label(c, 'non-wetting surface (contact angle 180° in the ideal limit)', 14, groundY + 16, { color: C.faint, size: 11 }); }
          else {
            for (let k = 0; k < 5; k++) { const y = ((t * 220 + k * 70) % (Hh * 0.95)); c.strokeStyle = C.faint; c.globalAlpha = 0.5; c.beginPath(); c.moveTo(24 + k * 38, y); c.lineTo(24 + k * 38, y + 14); c.stroke(); c.globalAlpha = 1; }
            if (V.a * 2 > 5.5) kit.label(c, 'too big to survive: it breaks up as it falls', cx, Hh * 0.2, { color: C.bad, size: 13, align: 'center', weight: 650 });
          }
          /* scale bar and the capillary length */
          const step = Hyper.niceStep(Wd * 0.22 / mpx, 3);
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(14, Hh - 22); c.lineTo(14 + step * mpx, Hh - 22); c.stroke();
          kit.label(c, fmtLen(step), 14 + step * mpx / 2, Hh - 38, { color: C.text, size: 11.5, align: 'center' });
          const lcpx = lc * mpx;
          if (lcpx < Wd * 0.45) {
            const y = 20; c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(Wd - 16 - lcpx, y); c.lineTo(Wd - 16, y); c.stroke();
            kit.label(c, 'capillary length ' + (lc * 1e3).toFixed(2) + ' mm', Wd - 16 - lcpx / 2, y + 16, { color: C.warn, size: 11.5, align: 'center' });
          } else kit.label(c, 'the capillary length, ' + (lc * 1e3).toFixed(2) + ' mm, is far wider than this view', Wd - 14, 20, { color: C.warn, size: 11.5, align: 'right' });
          ro.set('lap', fmtP(W.laplace(a, sig)));
          ro.set('bub', fmtP(W.laplaceBubble(a, sig)));
          ro.set('bo', Bo < 0.01 ? Bo.toExponential(1) : Bo.toFixed(Bo < 10 ? 2 : 1));
          ro.set('reg', rain ? (V.a * 2 > 5.5 ? 'unstable: it splits' : V.a * 2 < 1 ? 'a sphere' : 'an oblate "bun"') : Bo < 0.1 ? 'a sphere: surface tension rules' : Bo < 1.5 ? 'sagging: gravity is noticeable' : 'a puddle: gravity rules');
          ro.set('size', fmtLen(hgt) + ' × ' + fmtLen(wid));
        } else {
          /* a drop on a surface */
          const th = V.theta, cs = Math.cos(th * Math.PI / 180);
          let eff = cs;
          if (V.tex === 'wenzel') eff = clamp(V.rough * cs, -1, 1);
          else if (V.tex === 'cassie') eff = clamp(V.f * (cs + 1) - 1, -1, 1);
          const thEff = Math.acos(eff) * 180 / Math.PI, thUse = clamp(thEff, 3, 180);
          const cu = Math.cos(thUse * Math.PI / 180), su = Math.sin(thUse * Math.PI / 180);
          const Vm = V.vol * 1e-9;
          const den = 2 - 3 * cu + cu * cu * cu;
          const Rr = Math.cbrt(3 * Vm / (Math.PI * Math.max(den, 4e-6)));
          const ab = Rr * su, hh = Rr * (1 - cu);
          const Rs = Math.cbrt(3 * Vm / (4 * Math.PI));
          const mpx = 0.85 * Math.min((Wd - 120) / (2 * Math.max(ab, 0.3 * Rs)), (Hh * 0.62) / Math.max(hh, 0.3 * Rs));
          const groundY = Hh * 0.74, cx = Wd * 0.5;
          const yc = groundY - (hh - Rr) * mpx;
          /* the surface: a block with texture */
          c.fillStyle = C.surface; c.fillRect(0, groundY, Wd, Hh - groundY);
          c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, groundY); c.lineTo(Wd, groundY); c.stroke();
          const pitch = 14;
          if (V.tex !== 'smooth') {
            const fw = V.tex === 'cassie' ? clamp(V.f, 0.05, 1) * pitch : pitch * 0.45;
            c.fillStyle = C.axis;
            for (let x = 0; x < Wd; x += pitch) c.fillRect(x, groundY - 7, Math.max(2, fw), 7);
          }
          /* the drop */
          const phiR = Math.atan2(groundY - yc, ab * mpx);
          let phiL = Math.atan2(groundY - yc, -ab * mpx); if (phiL > 0) phiL -= TAU;
          c.save();
          c.fillStyle = blue; c.strokeStyle = blueEdge; c.lineWidth = 1.6;
          c.beginPath();
          const Rp = Rr * mpx;
          if (thUse >= 179.5) c.arc(cx, yc, Rp, 0, TAU); else c.arc(cx, yc, Rp, phiL, phiR, false);
          c.closePath(); c.fill(); c.stroke();
          c.restore();
          /* the angle at the right-hand foot */
          const px = cx + ab * mpx, py = groundY;
          const tx = -cu, ty = -su;
          c.strokeStyle = C.warn; c.lineWidth = 1.6;
          c.beginPath(); c.moveTo(px, py); c.lineTo(px + tx * 60, py + ty * 60); c.stroke();
          c.beginPath(); c.moveTo(px, py); c.lineTo(px - 60, py); c.stroke();
          c.beginPath(); c.arc(px, py, 26, Math.PI, Math.PI + thUse * Math.PI / 180, false); c.stroke();
          kit.label(c, thEff.toFixed(0) + '°', px - 40, py - 14 - Math.min(30, thUse * 0.2), { color: C.warn, size: 13, weight: 700, align: 'center' });
          kit.label(c, 'sketch of a ' + V.vol.toFixed(0) + ' µL drop; gravity ignored', 14, 20, { color: C.faint, size: 11 });
          const step = Hyper.niceStep(Wd * 0.2 / mpx, 3);
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(14, Hh - 18); c.lineTo(14 + step * mpx, Hh - 18); c.stroke();
          kit.label(c, fmtLen(step), 14 + step * mpx / 2, Hh - 34, { color: C.text, size: 11.5, align: 'center' });
          ro.set('cy', cs.toFixed(3) + '  (θ = ' + th.toFixed(0) + '°)');
          ro.set('eff', thEff.toFixed(0) + '°' + (V.tex === 'smooth' ? '' : V.tex === 'wenzel' ? ' (Wenzel)' : ' (Cassie–Baxter)'));
          ro.set('hh', fmtLen(hh));
          ro.set('base', fmtLen(2 * ab));
          ro.set('dsl', (sig * 1e3 * cs).toFixed(1) + ' mN/m');
          ro.set('wet', thEff < 90 ? 'hydrophilic' : thEff < 150 ? 'hydrophobic' : 'superhydrophobic');
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ capillary rise */
  Hyper.sim('surf-capillary', {
    title: 'Three tubes in a dish',
    blurb: `Three glass tubes stand in a dish; the middle one has half the bore of the first and the last a quarter. The height is Jurin's law, $h = 2\\sigma\\cos\\theta/(\\rho g r)$, so halving the bore doubles the rise. Tube widths are drawn schematically; **heights are to scale** (the ruler on the right), and the scale zooms to keep the tallest column in view. The graph below shows the whole law on logarithmic axes: a straight line of slope −1.

**Try this**
- Water, contact angle 0°, radius 0.5 mm: about 3 cm. Drag the radius to 5 µm and the column climbs to 3 m.
- Raise the contact angle to 90° (nothing rises) and beyond: a convex meniscus and a **depression**. Choose *mercury*, which makes about 140° with glass, and the level falls below the dish.
- Heat the water: the rise falls because σ falls faster than ρ does.
- Choose *ethanol* or *hexane*: low surface tension, so less rise at the same bore, but they wet glass perfectly.`,
    mount(box, kit, params) {
      const W = kit.water;
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 340, maxH: 420 });
      box.stage.appendChild(graph);
      const ctl = kit.controls(box.side, [
        { id: 'liq', type: 'select', label: 'Liquid', options: [['Water', 'water'], ['Ethanol', 'ethanol'], ['Hexane', 'hexane'], ['Glycerol', 'glycerol'], ['Mercury', 'mercury']], value: params.liq || 'water' },
        { id: 'T', label: 'Temperature (water only)', min: 0, max: 100, step: 1, value: 20, unit: '°C' },
        { id: 'r', label: 'Radius of the first tube', min: 0.005, max: 5, step: 0.001, value: params.r || 0.5, unit: 'mm', log: true, sig: 2 },
        { id: 'theta', label: 'Contact angle', min: 0, max: 170, step: 1, value: params.theta != null ? params.theta : 0, unit: '°' }
      ], (id) => { if (id === 'liq') { ctl.set('theta', V.liq === 'mercury' ? 140 : 0, false); } plotDirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sig', 'Surface tension σ'], ['rho', 'Density ρ'], ['lc', 'Capillary length'], ['h1', 'Rise in tube 1'], ['h2', 'Rise in tube 2 (½ the radius)'], ['h3', 'Rise in tube 3 (¼ the radius)']]);
      const plot = kit.plot(graph, { x: { label: 'tube radius (mm)', log: true, min: 0.001, max: 10 }, y: { label: '|height| (mm)', log: true, min: 0.001, max: 1e5 } }, 190);
      let plotDirty = true;
      function props() {
        if (V.liq === 'water') return { sig: W.surfaceTension(V.T), rho: W.density(V.T), name: 'water' };
        const l = liquidOf(W, V.liq);
        return { sig: l.sigma * 1e-3, rho: l.rho, name: l.name };
      }
      function updatePlot() {
        const p = props(), pts = [];
        for (let k = 0; k <= 60; k++) { const rmm = Math.pow(10, -3 + 4 * k / 60); const h = Math.abs(W.jurin(rmm * 1e-3, V.theta, p.sig, p.rho)) * 1e3; if (h > 0) pts.push([rmm, h]); }
        const h0 = Math.abs(W.jurin(V.r * 1e-3, V.theta, p.sig, p.rho)) * 1e3;
        plot.set({ series: [{ pts, label: p.name + ', θ = ' + V.theta.toFixed(0) + '°', color: kit.colors().accent }], marks: h0 > 0 ? [{ x: V.r, y: h0, label: 'tube 1' }] : [], x: { label: 'tube radius (mm)', log: true, min: 0.001, max: 10 }, y: { label: '|height| (mm)', log: true, min: 0.001, max: 1e5 } });
        plotDirty = false;
      }
      const loop = kit.loop((dt, t) => {
        if (plotDirty) updatePlot();
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const p = props();
        const rr = [V.r * 1e-3, V.r * 0.5e-3, V.r * 0.25e-3];
        const hs = rr.map(r => W.jurin(r, V.theta, p.sig, p.rho));
        const surfY = Hh - 96, dishBot = Hh - 14, top = 26;
        const maxUp = Math.max(0, ...hs), maxDown = Math.max(0, ...hs.map(h => -h));
        let scale = 1e9;
        if (maxUp > 0) scale = Math.min(scale, (surfY - top - 14) / maxUp);
        if (maxDown > 0) scale = Math.min(scale, 72 / maxDown);
        if (!(scale < 1e9)) scale = (surfY - top) / 0.05;
        /* dish and liquid */
        const dx0 = 16, dx1 = Wd - 70;
        c.fillStyle = 'rgba(70,150,235,0.28)'; c.fillRect(dx0, surfY, dx1 - dx0, dishBot - surfY);
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(dx0, surfY - 6); c.lineTo(dx0, dishBot); c.lineTo(dx1, dishBot); c.lineTo(dx1, surfY - 6); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.moveTo(dx0, surfY); c.lineTo(dx1, surfY); c.stroke();
        const widths = [38, 19, 9.5], cxs = [dx0 + (dx1 - dx0) * 0.2, dx0 + (dx1 - dx0) * 0.5, dx0 + (dx1 - dx0) * 0.8];
        const th = V.theta * Math.PI / 180, cth = Math.cos(th), sth = Math.sin(th);
        for (let k = 0; k < 3; k++) {
          const w = widths[k], x = cxs[k], h = hs[k];
          const yl = surfY - h * scale;                       // the level at the middle... the meniscus bottom/top
          const sag = Math.abs(cth) < 0.03 ? 0 : (w / 2) * (1 - sth) / cth;     // + for concave (cth>0)
          /* the liquid column */
          c.fillStyle = 'rgba(70,150,235,0.45)';
          const yTop = yl - Math.max(0, sag) * 0 ;
          c.beginPath();
          c.moveTo(x - w / 2, surfY + 30); c.lineTo(x - w / 2, yTop - sag); c.quadraticCurveTo(x, yTop - sag + 2 * sag, x + w / 2, yTop - sag); c.lineTo(x + w / 2, surfY + 30); c.closePath(); c.fill();
          c.strokeStyle = C.accent; c.lineWidth = 1.4;
          c.beginPath(); c.moveTo(x - w / 2, yTop - sag); c.quadraticCurveTo(x, yTop - sag + 2 * sag, x + w / 2, yTop - sag); c.stroke();
          /* the glass */
          c.strokeStyle = C.text; c.lineWidth = 2.2;
          c.beginPath(); c.moveTo(x - w / 2 - 2, top); c.lineTo(x - w / 2 - 2, surfY + 56); c.moveTo(x + w / 2 + 2, top); c.lineTo(x + w / 2 + 2, surfY + 56); c.stroke();
          kit.label(c, 'r = ' + fmtLen(rr[k]), x, top - 10, { color: C.muted, size: 11, align: 'center' });
          const hl = Math.abs(h);
          kit.label(c, (h < 0 ? '−' : '+') + fmtLen(hl), x + w / 2 + 9, clamp(yTop - sag + 4, top + 12, surfY + 70), { color: C.text, size: 12, align: 'left', baseline: 'middle', weight: 650 });
        }
        /* the ruler */
        const rx = Wd - 40;
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(rx, top); c.lineTo(rx, surfY + 70); c.stroke();
        const span = (surfY - top) / scale, step = Hyper.niceStep(span, 5);
        for (let v = -Math.floor(72 / scale / step) * step; v <= span + 1e-12; v += step) {
          const y = surfY - v * scale; if (y < top - 1 || y > surfY + 72) continue;
          c.beginPath(); c.moveTo(rx - 5, y); c.lineTo(rx + 5, y); c.stroke();
          kit.label(c, fmtLen(v).replace(' ', ''), rx + 9, y, { color: C.muted, size: 10, baseline: 'middle' });
        }
        kit.label(c, 'level of the dish = 0', rx - 6, surfY - 8, { color: C.accent, size: 10, align: 'right' });
        ro.set('sig', (p.sig * 1e3).toFixed(1) + ' mN/m');
        ro.set('rho', p.rho.toFixed(0) + ' kg/m³');
        ro.set('lc', (Math.sqrt(p.sig / (p.rho * G)) * 1e3).toFixed(2) + ' mm');
        ro.set('h1', (hs[0] >= 0 ? 'rises ' : 'falls ') + fmtLen(Math.abs(hs[0])));
        ro.set('h2', (hs[1] >= 0 ? 'rises ' : 'falls ') + fmtLen(Math.abs(hs[1])));
        ro.set('h3', (hs[2] >= 0 ? 'rises ' : 'falls ') + fmtLen(Math.abs(hs[2])));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ floating: needle and strider */
  Hyper.sim('surf-floating', {
    title: 'A needle on the surface',
    blurb: `A cross-section of the water surface with a long thin object lying on it. The surface pulls up on each side of the object with a force $\\sigma$ per unit length, tilted at the angle $\\psi$ of the dimple; the most it can carry is the vertical pull on both sides, $2\\sigma$ per metre of contact line, which is **14.8 mg for every millimetre**. The profile is the exact two-dimensional solution, in which the depth of the contact line below the flat water is $2\\ell_c\\sin(\\psi/2)$. The model counts surface tension only; the buoyancy of the sunken part adds a little for thick needles.

**Try this**
- Steel needle: grow the diameter until it sinks, at about 1.6 mm. The dimple deepens as you approach the limit, then the surface lets go.
- Switch to aluminium (a third as dense) and gold (twice as heavy): the limiting diameter scales as $1/\\sqrt{\\rho}$.
- *Water strider*: the animal spreads about 10 mg over several legs, so each millimetre carries a tiny fraction of its capacity and the dimples are shallow. Remove legs and shorten the contact, and see where the safety margin runs out. Magnify the dimple to see it.
- Heat the water to 100 °C: σ falls to 59 mN/m and the limits fall by a fifth.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'obj', type: 'select', label: 'What floats', options: [['Steel needle (7,800 kg/m³)', 7800], ['Aluminium wire (2,700)', 2700], ['Copper wire (8,960)', 8960], ['Gold wire (19,300)', 19300], ['A water strider', 0]], value: params.strider ? 0 : (params.rho || 7800) },
        { id: 'd', label: 'Diameter of the wire', min: 0.1, max: 3, step: 0.01, value: params.d || 0.8, unit: 'mm' },
        { id: 'm', label: 'Mass of the strider', min: 1, max: 80, step: 1, value: 12, unit: 'mg' },
        { id: 'legs', label: 'Legs in contact', min: 2, max: 8, step: 1, value: 6 },
        { id: 'tar', label: 'Contact length of each leg', min: 1, max: 12, step: 0.5, value: 4, unit: 'mm' },
        { id: 'T', label: 'Temperature', min: 0, max: 100, step: 1, value: 20, unit: '°C' },
        { id: 'mag', label: 'Magnify the dimple (vertical only)', min: 1, max: 20, step: 1, value: params.strider ? 8 : 3, unit: '×' }
      ], () => modes());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['w', 'Weight per metre of contact'], ['cap', 'Most the surface can carry, 2σ'], ['use', 'Share of the capacity used'], ['psi', 'Slope of the surface at the contact'], ['dep', 'Depth of the dimple'], ['lim', 'Limit for this object'], ['say', 'The object']]);
      function modes() {
        const strider = V.obj === 0;
        ctl.show('d', !strider);
        ['m', 'legs', 'tar'].forEach(k => ctl.show(k, strider));
      }
      modes();
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const T = V.T, sig = W.surfaceTension(T), lc = W.capillaryLength(T);
        const strider = V.obj === 0;
        let w, r, limit;
        if (!strider) {
          r = V.d * 0.5e-3; w = V.obj * Math.PI * r * r * G;
          limit = 'diameter up to ' + (2 * Math.sqrt(2 * sig / (Math.PI * V.obj * G)) * 1e3).toFixed(2) + ' mm';
        } else {
          r = 0.12e-3; const Lc = V.legs * V.tar * 1e-3;
          w = V.m * 1e-6 * G / Lc;
          limit = 'up to ' + (2 * sig * Lc / G * 1e6).toFixed(0) + ' mg on these legs';
        }
        const cap = 2 * sig, use = w / cap, sinks = use >= 1;
        const psi = Math.asin(clamp(use, 0, 1));
        const dep = 2 * lc * Math.sin(psi / 2);
        /* geometry in px: 3 capillary lengths each side of the object */
        const half = Math.max(r, 0) + 3.4 * lc;
        const sc = (Wd * 0.5 - 24) / half;            // px per metre
        const lev = Hh * 0.36, cx = Wd * 0.5;
        const mag = V.mag;
        /* the water */
        c.fillStyle = 'rgba(70,150,235,0.28)';
        c.fillRect(0, lev, Wd, Hh - lev);
        const profile = [];
        {
          const ps = sinks ? Math.PI / 2 * 0.999 : Math.max(psi, 1e-4);
          const NS = 70, pmin = 0.004;
          let x = r, prevPhi = ps, prevF = Math.cos(ps / 2) / Math.tan(ps);
          profile.push([x, 2 * lc * Math.sin(ps / 2)]);
          for (let k = 1; k <= NS; k++) {
            const phi = ps * Math.pow(Math.min(1, pmin / ps), k / NS);
            const f = Math.cos(phi / 2) / Math.tan(phi);
            x += lc * 0.5 * (f + prevF) * (prevPhi - phi);
            profile.push([x, 2 * lc * Math.sin(phi / 2)]);
            prevPhi = phi; prevF = f;
          }
        }
        const pts = [];
        for (let i = profile.length - 1; i >= 0; i--) pts.push([cx - profile[i][0] * sc, lev + profile[i][1] * sc * mag]);
        for (let i = 0; i < profile.length; i++) pts.push([cx + profile[i][0] * sc, lev + profile[i][1] * sc * mag]);
        /* between the two contact points the surface goes under the object */
        c.fillStyle = C.bg2;
        c.beginPath(); c.moveTo(0, 0); c.lineTo(Wd, 0); c.lineTo(Wd, lev); c.lineTo(cx + profile[profile.length - 1][0] * sc, lev);
        for (let i = pts.length - 1; i >= 0; i--) c.lineTo(pts[i][0], pts[i][1]);
        c.lineTo(0, lev); c.closePath(); c.fill();
        c.strokeStyle = C.accent; c.lineWidth = 2;
        c.beginPath(); c.moveTo(0, lev);
        for (let i = 0; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
        c.lineTo(Wd, lev); c.stroke();
        /* the object */
        const rp = Math.max(r * sc, 3.5);
        let oy = lev + dep * sc * mag;
        if (sinks) oy = lev + ((t * 90) % (Hh - lev - 20));
        c.fillStyle = strider ? C.warn : C.faint; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.arc(cx, oy, rp, 0, TAU); c.fill(); c.stroke();
        /* the pull of the surface at the contact points */
        if (!sinks) {
          const L = 46, ang = psi;
          for (const sgn of [-1, 1]) {
            const px = cx + sgn * rp * Math.cos(0.0), py = oy;
            kit.arrow(c, px, py, px + sgn * L * Math.cos(ang) * 0.0 , py - L * Math.min(1, Math.max(0.15, use)) , C.ok, 2);
          }
          kit.label(c, 'σ pulls up on each side', cx, oy - 62, { color: C.ok, size: 11.5, align: 'center' });
          kit.arrow(c, cx, oy, cx, oy + 8 + 36 * Math.min(1, use + 0.1), C.bad, 2);
          kit.label(c, 'weight', cx + 38, oy + 28, { color: C.bad, size: 11.5 });
        } else kit.label(c, 'sinks: the weight exceeds 2σ per metre', cx, 24, { color: C.bad, size: 13, align: 'center', weight: 650 });
        if (strider) {
          c.fillStyle = 'rgba(120,90,50,0.8)'; c.strokeStyle = C.text; c.lineWidth = 1;
          c.beginPath(); c.ellipse(cx, lev - 78, 30, 12, 0, 0, TAU); c.fill(); c.stroke();
          c.strokeStyle = 'rgba(120,90,50,0.9)'; c.lineWidth = 2;
          c.beginPath(); c.moveTo(cx - 8, lev - 70); c.lineTo(cx - 20, lev - 40); c.lineTo(cx, oy - rp); c.moveTo(cx + 8, lev - 70); c.lineTo(cx + 20, lev - 40); c.lineTo(cx, oy - rp); c.stroke();
        }
        /* scale bar and the capillary length */
        const step = Hyper.niceStep(Wd * 0.18 / sc, 3);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(14, Hh - 22); c.lineTo(14 + step * sc, Hh - 22); c.stroke();
        kit.label(c, 'scale ' + fmtLen(step) + (mag > 1 ? ' (horizontal)' : ''), 14, Hh - 38, { color: C.text, size: 11.5, align: 'left' });
        kit.label(c, 'the dimple is drawn ' + mag + '× deeper than real', Wd - 14, Hh - 14, { color: C.faint, size: 11, align: 'right' });
        ro.set('w', (w * 1e3).toFixed(2) + ' mN/m  (' + (w / G * 1e3).toFixed(1) + ' mg per mm)');
        ro.set('cap', (cap * 1e3).toFixed(1) + ' mN/m  (' + (cap / G * 1e3).toFixed(1) + ' mg per mm)');
        ro.set('use', (use * 100).toFixed(use < 0.1 ? 1 : 0) + ' %');
        ro.set('psi', sinks ? '90° — it has let go' : (psi * 180 / Math.PI).toFixed(psi < 0.1 ? 2 : 1) + '°');
        ro.set('dep', sinks ? '—' : fmtLen(dep));
        ro.set('lim', limit);
        ro.set('say', sinks ? 'sinks' : use > 0.8 ? 'floats, barely' : 'floats');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ surfactants */
  Hyper.sim('surf-surfactants', {
    title: 'Soap at the surface',
    blurb: `A detergent-like molecule has a water-loving head and an oily tail. Add it to water and the molecules crowd into the surface, tails up out of the water, heads down in it; every one that lands there lowers the surface tension. When the surface is full (the *critical micelle concentration*, CMC) the rest gather in the bulk as **micelles**, balls with the tails inside, and the surface tension stops falling. The curve is a Szyszkowski equation fitted to the numbers for sodium dodecyl sulfate (SDS): CMC 8.2 mmol/L, surface tension about 38 mN/m at the CMC. Real dish soaps contain several surfactants and go lower, to 25–30.

**Try this**
- Raise the concentration slowly: the surface fills first (σ falls steeply), and the curve flattens at the CMC.
- Beyond the CMC add a drop of oil: it dissolves into the cores of the micelles, which is how soap lifts grease.
- *Pepper and soap*: touch the middle of a dusted dish with soap and the pepper flees to the rim. The surface is pulled towards the part with higher tension, which is the clean water. This is the Marangoni effect (schematic speeds).`,
    mount(box, kit, params) {
      const W = kit.water;
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320, maxH: 420 });
      box.stage.appendChild(graph);
      const CMC = 8.2, GMAX = 3.3e-6, A_AD = 0.12;      // mmol/L, mol/m², mmol/L — SDS-like
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['The surface and the bulk', 'surface'], ['Pepper and soap', 'pepper']], value: params.view === 'pepper' ? 'pepper' : 'surface' },
        { id: 'c', label: 'Surfactant concentration', min: 0.01, max: 100, step: 0.01, value: params.c || 0.3, unit: 'mmol/L', log: true, sig: 2 },
        { id: 'oil', type: 'check', label: 'Add a drop of oil', value: false },
        { type: 'buttons', items: [{ id: 'touch', label: 'Touch with soap', primary: true }, { id: 'fresh', label: 'Fresh pepper' }] }
      ], (id) => { if (id === 'touch') t0 = clock; if (id === 'fresh') { grains = null; t0 = -1; } modes(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sig', 'Surface tension σ'], ['drop', 'Lowered by'], ['cov', 'Surface covered'], ['area', 'Area per surface molecule'], ['free', 'Free molecules in the water'], ['mic', 'Molecules in micelles'], ['state', 'State']]);
      const plot = kit.plot(graph, { x: { label: 'concentration (mmol/L)', log: true, min: 0.01, max: 100 }, y: { label: 'σ (mN/m)', min: 20, max: 80 } }, 170);
      function modes() { ro.show('free', V.view === 'surface'); ro.show('mic', V.view === 'surface'); ctl.show('oil', V.view === 'surface'); ctl.show('touch', V.view === 'pepper'); ctl.show('fresh', V.view === 'pepper'); }
      modes();
      const sigma0 = () => W.surfaceTension(20) * 1e3;
      const RT = 8.314 * 293.15;
      const sigmaOf = c => sigma0() - RT * GMAX * 1e3 * Math.log(1 + Math.min(c, CMC) / A_AD);   // mN/m
      const covOf = c => Math.min(c, CMC) / (A_AD + Math.min(c, CMC));
      const pts = [];
      for (let k = 0; k <= 80; k++) { const cc = Math.pow(10, -2 + 4 * k / 80); pts.push([cc, sigmaOf(cc)]); }
      let clock = 0, t0 = -1, grains = null, lastC = -1;
      const r = rng(5);
      const free = [];
      for (let k = 0; k < 16; k++) free.push({ x: r(), y: r(), vx: (r() - 0.5) * 0.18, vy: (r() - 0.5) * 0.18, a: r() * TAU, on: r() });
      const loop = kit.loop((dt, t) => {
        clock += dt;
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const sig = sigmaOf(V.c), cov = covOf(V.c);
        if (Math.abs(V.c - lastC) > 1e-9) {
          lastC = V.c;
          plot.set({ series: [{ pts, label: 'surface tension', color: C.accent }], marks: [{ x: V.c, y: sig, label: sig.toFixed(1) + ' mN/m' }], vlines: [{ x: CMC, label: 'CMC 8.2' }], hlines: [{ y: sigma0(), label: 'pure water' }], x: { label: 'concentration (mmol/L)', log: true, min: 0.01, max: 100 }, y: { label: 'σ (mN/m)', min: 20, max: 80 } });
        }
        const dsig = sigma0() - sig;
        if (V.view === 'surface') {
          const lev = Hh * 0.3;
          c.fillStyle = 'rgba(70,150,235,0.22)'; c.fillRect(0, lev, Wd, Hh - lev);
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(0, lev); c.lineTo(Wd, lev); c.stroke();
          const heads = 22, n = Math.round(cov * heads);
          const sp = (Wd - 40) / heads;
          for (let k = 0; k < heads; k++) {
            if (k >= n) continue;
            const slot = ((k * 7) % heads);                   // spread the filled slots, not from the left
            const x = 20 + (slot + 0.5) * sp + Math.sin(t * 2 + k) * 1.2;
            c.strokeStyle = C.warn; c.lineWidth = 1.6;
            c.beginPath(); c.moveTo(x, lev + 3); c.lineTo(x + 2, lev - 8); c.lineTo(x - 2, lev - 15); c.lineTo(x + 2, lev - 22); c.lineTo(x, lev - 30); c.stroke();
            c.fillStyle = C.accent; c.beginPath(); c.arc(x, lev + 6, 5, 0, TAU); c.fill();
          }
          kit.label(c, 'air', 12, 18, { color: C.faint, size: 11 });
          kit.label(c, 'water', 12, lev + 16, { color: C.faint, size: 11 });
          /* free molecules */
          const nFree = Math.round(clamp(Math.min(V.c, CMC) / CMC, 0, 1) * 14 + (V.c > 0.01 ? 1 : 0));
          for (let k = 0; k < nFree; k++) {
            const f = free[k];
            f.x += f.vx * dt; f.y += f.vy * dt;
            if (f.x < 0.04 || f.x > 0.96) f.vx *= -1; if (f.y < 0.06 || f.y > 0.94) f.vy *= -1;
            f.x = clamp(f.x, 0.02, 0.98); f.y = clamp(f.y, 0.03, 0.97); f.a += dt * 0.5;
            const px = 20 + f.x * (Wd - 40), py = lev + 30 + f.y * (Hh - lev - 60);
            c.strokeStyle = C.warn; c.lineWidth = 1.4; c.beginPath(); c.moveTo(px, py); c.lineTo(px + 14 * Math.cos(f.a), py + 14 * Math.sin(f.a)); c.stroke();
            c.fillStyle = C.accent; c.beginPath(); c.arc(px, py, 4, 0, TAU); c.fill();
          }
          /* micelles */
          const nMic = V.c <= CMC ? 0 : Math.min(6, 1 + Math.floor((V.c - CMC) / CMC * 2));
          for (let k = 0; k < nMic; k++) {
            const mx = 20 + ((k * 0.37 + 0.15) % 0.9) * (Wd - 40), my = lev + 60 + ((k * 0.53 + 0.1) % 0.8) * (Hh - lev - 100);
            const mr = 21;
            for (let s = 0; s < 14; s++) {
              const a = s / 14 * TAU + t * 0.2 * (k % 2 ? 1 : -1);
              c.strokeStyle = C.warn; c.lineWidth = 1.4; c.beginPath(); c.moveTo(mx + Math.cos(a) * mr, my + Math.sin(a) * mr); c.lineTo(mx + Math.cos(a) * 5, my + Math.sin(a) * 5); c.stroke();
              c.fillStyle = C.accent; c.beginPath(); c.arc(mx + Math.cos(a) * (mr + 3), my + Math.sin(a) * (mr + 3), 3.4, 0, TAU); c.fill();
            }
            if (V.oil) { c.fillStyle = 'rgba(210,170,40,0.85)'; c.beginPath(); c.arc(mx, my, 8, 0, TAU); c.fill(); }
          }
          if (V.oil && nMic === 0) kit.label(c, 'no micelles yet: the oil has nowhere to go and floats up as a film', Wd / 2, Hh - 14, { color: C.bad, size: 11.5, align: 'center' });
          else if (V.oil) kit.label(c, 'oil sits in the oily cores of the micelles', Wd / 2, Hh - 14, { color: C.ok, size: 11.5, align: 'center' });
          if (nMic) kit.label(c, 'micelle', 24 + ((0.15) % 0.9) * (Wd - 40), lev + 60 + 0.1 * (Hh - lev - 100) - 34, { color: C.muted, size: 11, align: 'center' });
        } else {
          /* pepper and soap: a dish seen from above */
          const R = Math.min(Hh * 0.34, Wd * 0.42), cx = Wd * 0.5, cy = 14 + R + 6;
          if (!grains) {
            grains = []; const rr = rng(21);
            for (let k = 0; k < 260; k++) { const a = rr() * TAU, d = Math.sqrt(rr()) * 0.96; grains.push({ a, d, j: rr() }); }

          }
          c.fillStyle = 'rgba(70,150,235,0.28)'; c.strokeStyle = C.axis; c.lineWidth = 3;
          c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.stroke();
          const tt = t0 < 0 ? 0 : clock - t0;
          const front = t0 < 0 ? 0 : clamp(dsig / 34, 0, 1.3) * 0.97 * (1 - Math.exp(-tt / 1.2));
          for (const g of grains) {
            if (t0 >= 0 && g.d < front) g.d += (front + 0.015 + g.j * 0.03 - g.d) * Math.min(1, dt * 4);
            g.d = clamp(g.d, 0, 0.985);
            c.fillStyle = 'rgba(40,35,30,0.85)'; c.fillRect(cx + Math.cos(g.a) * g.d * R - 1.2, cy + Math.sin(g.a) * g.d * R - 1.2, 2.4, 2.4);
          }
          if (t0 >= 0) {
            c.fillStyle = 'rgba(240,200,70,0.85)'; c.beginPath(); c.arc(cx, cy, 4, 0, TAU); c.fill();
            for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; kit.arrow(c, cx + Math.cos(a) * (front * R * 0.55 + 8), cy + Math.sin(a) * (front * R * 0.55 + 8), cx + Math.cos(a) * (front * R * 0.55 + 30), cy + Math.sin(a) * (front * R * 0.55 + 30), C.ok, 1.6); }
          }
          kit.label(c, t0 < 0 ? 'Press "Touch with soap"' : 'flow away from the low-tension soap', cx, cy + R + 14, { color: C.muted, size: 11.5, align: 'center' });
          kit.label(c, 'σ water ' + sigma0().toFixed(1) + ' · at the soap ' + sig.toFixed(1) + ' mN/m', cx, cy + R + 32, { color: C.text, size: 11.5, align: 'center' });
          kit.label(c, 'difference ' + dsig.toFixed(1) + ' mN/m' + (dsig < 3 ? ': too little soap' : ''), cx, cy + R + 50, { color: dsig < 3 ? C.bad : C.ok, size: 11.5, weight: 650, align: 'center' });
        }
        ro.set('sig', sig.toFixed(1) + ' mN/m');
        ro.set('drop', dsig.toFixed(1) + ' mN/m (' + (dsig / sigma0() * 100).toFixed(0) + ' %)');
        ro.set('cov', (cov * 100).toFixed(0) + ' %');
        ro.set('area', (1 / (GMAX * Math.max(cov, 1e-6) * 6.022e23) * 1e18).toFixed(cov < 0.05 ? 0 : 2) + ' nm²');
        ro.set('free', Math.min(V.c, CMC).toFixed(2) + ' mmol/L');
        ro.set('mic', V.c > CMC ? (V.c - CMC).toFixed(1) + ' mmol/L' : 'none');
        ro.set('state', V.c < CMC * 0.95 ? 'below the CMC: the surface is filling' : V.c <= CMC * 1.05 ? 'at the CMC: the surface is full' : 'above the CMC: the surplus forms micelles');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ viscosity: Stokes settling */
  Hyper.sim('surf-viscosity', {
    title: 'A grain settling in a fluid',
    blurb: `A sphere is released at the top of a tank and falls (or, if it is lighter than the fluid, rises) at its **terminal speed**, where the drag balances the net weight. For slow flow this is Stokes' law, $v = (\\rho_p-\\rho_f)\\,g\\,d^2/(18\\eta)$; the program uses the Stokes drag with the Schiller–Naumann correction so that it stays right when the flow becomes fast. The tank on the right always holds the same sphere in water at 20 °C, so the **ratio** of the two speeds is the ratio of the viscosities (when the flow is slow). Time is sped up so the faster sphere crosses in about five seconds; the read-out gives the real figures.

**Try this**
- Water droplet, 10 µm, in *air*: about 3 mm/s, and a cloud droplet hardly falls at all.
- A 1 µm clay grain in water falls at 0.9 µm/s, a metre in two weeks; at 0.1 µm it is a hundred times slower, and muddy water stays cloudy for months.
- Steel ball in *honey*: ten thousand times slower than in water.
- Raise the diameter and watch the Reynolds number climb past 1: the Stokes speed (read-out) then overestimates the real one, because the wake takes over.
- Warm the water from 0 to 100 °C: its viscosity falls to a sixth, and so does the settling time.`,
    mount(box, kit, params) {
      const W = kit.water;
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300, maxH: 400 });
      box.stage.appendChild(graph);
      const MED = {
        water: { name: 'Water', get eta() { return W.viscosity(V.T); }, get rho() { return W.density(V.T); } },
        air: { name: 'Air, 20 °C', eta: 1.81e-5, rho: 1.204 },
        oil: { name: 'Olive oil', eta: 84e-3, rho: 915 },
        glycerol: { name: 'Glycerol', eta: 1.412, rho: 1261 },
        honey: { name: 'Honey (about 10 Pa·s)', eta: 10, rho: 1420 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'med', type: 'select', label: 'Fluid', options: [['Water', 'water'], ['Air, 20 °C', 'air'], ['Olive oil', 'oil'], ['Glycerol', 'glycerol'], ['Honey', 'honey']], value: params.med || 'water' },
        { id: 'T', label: 'Temperature (water only)', min: 0, max: 100, step: 1, value: params.T != null ? params.T : 20, unit: '°C' },
        { id: 'd', label: 'Diameter of the sphere', min: 1, max: 10000, step: 1, value: params.d || 100, unit: 'µm', log: true, sig: 2 },
        { id: 'rho', type: 'select', label: 'The sphere is', options: [['A water droplet (998)', 998], ['A grain of sand or clay (2,650)', 2650], ['A steel ball (7,800)', 7800], ['An oil droplet (900)', 900], ['An air bubble (1.2)', 1.2]], value: params.rho || 2650 },
        { type: 'buttons', items: [{ id: 'go', label: 'Release again', primary: true }] }
      ], (id) => { if (id === 'go') clock0 = clock; plotDirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eta', 'Viscosity η'], ['nu', 'Kinematic viscosity ν = η/ρ'], ['v', 'Terminal speed (this fluid)'], ['vs', 'Stokes speed, no correction'], ['re', 'Reynolds number'], ['reg', 'Flow regime'], ['t10', 'Time to travel 10 cm'], ['vr', 'Same sphere in water at 20 °C']]);
      const plot = kit.plot(graph, { x: { label: 'temperature of water (°C)', min: 0, max: 100 }, y: { label: 'η (mPa·s)', min: 0 } }, 150);
      let plotDirty = true, clock = 0, clock0 = 0;
      const pts = []; for (let T = 0; T <= 100; T += 2) pts.push([T, W.viscosity(T) * 1e3]);
      function terminal(rhoP, d, eta, rhoF) {
        const net = (rhoP - rhoF) * G * Math.PI / 6 * d * d * d;
        const aNet = Math.abs(net);
        if (aNet < 1e-30) return { v: 0, re: 0 };
        const A = Math.PI * d * d / 4;
        const CD = re => (re < 1e3 ? 24 / Math.max(re, 1e-12) * (1 + 0.15 * Math.pow(re, 0.687)) : 0.44);
        const F = v => 0.5 * rhoF * v * v * A * CD(rhoF * v * d / eta);
        let lo = 1e-14, hi = 1e3;
        for (let k = 0; k < 200; k++) { const mid = Math.sqrt(lo * hi); if (F(mid) < aNet) lo = mid; else hi = mid; }
        const v = Math.sqrt(lo * hi);
        return { v: Math.sign(net) * v, re: rhoF * v * d / eta };
      }
      const loop = kit.loop((dt) => {
        clock += dt;
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (plotDirty) {
          plot.set({ series: [{ pts, label: 'water at 1 atm', color: C.accent }], marks: [{ x: V.T, y: W.viscosity(V.T) * 1e3, label: (W.viscosity(V.T) * 1e3).toFixed(2) + ' mPa·s' }], x: { label: 'temperature of water (°C)', min: 0, max: 100 }, y: { label: 'η (mPa·s)', min: 0 } });
          plotDirty = false;
        }
        const m = MED[V.med], d = V.d * 1e-6;
        const eta = m.eta, rhoF = m.rho;
        const A = terminal(V.rho, d, eta, rhoF);
        const B = terminal(V.rho, d, W.viscosity(20), W.density(20));
        const vS = (V.rho - rhoF) * G * d * d / (18 * eta);
        const vmax = Math.max(Math.abs(A.v), Math.abs(B.v), 1e-18);
        const cross = 5, period = 8, tau = (clock - clock0) % period;
        const frac = (v) => clamp(Math.abs(v) / vmax * tau / cross, 0, 1);
        const top = 56, bot = Hh - 26, tw = Math.min(150, Wd * 0.22);
        const tanks = [[Wd * 0.2, A, m.name, V.med === 'water' ? 'rgba(70,150,235,0.28)' : V.med === 'air' ? 'rgba(200,200,220,0.10)' : 'rgba(220,180,60,0.28)'], [Wd * 0.58, B, 'Water, 20 °C', 'rgba(70,150,235,0.28)']];
        for (const [cx, X, name, col] of tanks) {
          c.fillStyle = col; c.fillRect(cx - tw / 2, top, tw, bot - top);
          c.strokeStyle = C.axis; c.lineWidth = 2; c.strokeRect(cx - tw / 2, top, tw, bot - top);
          kit.label(c, name, cx, top - 18, { color: C.text, size: 12, align: 'center', weight: 650 });
          const f = frac(X.v), rising = X.v < 0;
          const y = rising ? bot - 10 - f * (bot - top - 20) : top + 10 + f * (bot - top - 20);
          c.fillStyle = V.rho < 100 ? 'rgba(235,240,250,0.9)' : V.rho > 5000 ? '#8a929a' : V.rho > 2000 ? '#b99a6a' : 'rgba(70,150,235,0.9)';
          c.strokeStyle = C.text; c.lineWidth = 1.2;
          c.beginPath(); c.arc(cx, y, 7, 0, TAU); c.fill(); c.stroke();
          kit.label(c, (rising ? 'rises ' : 'falls ') + fmtSpeed(Math.abs(X.v)), cx, bot + 14, { color: C.muted, size: 11.5, align: 'center' });
          c.strokeStyle = C.muted; c.lineWidth = 1;
          for (let k = 0; k <= 5; k++) { const yy = top + k * (bot - top) / 5; c.beginPath(); c.moveTo(cx + tw / 2, yy); c.lineTo(cx + tw / 2 + 6, yy); c.stroke(); }
        }
        kit.label(c, 'tanks 10 cm tall · time ×' + (Math.abs(vmax) > 0 ? (0.1 / vmax / cross).toExponential(1) : '—') + ' faster', Wd / 2, 14, { color: C.faint, size: 11, align: 'center' });
        ro.set('eta', (eta * 1e3).toPrecision(3) + ' mPa·s  (' + (eta / W.viscosity(20)).toPrecision(2) + ' × water at 20 °C)');
        ro.set('nu', (eta / rhoF * 1e6).toPrecision(3) + ' mm²/s');
        ro.set('v', (A.v < 0 ? 'rises ' : 'falls ') + fmtSpeed(Math.abs(A.v)));
        ro.set('vs', fmtSpeed(Math.abs(vS)));
        ro.set('re', A.re < 0.01 ? A.re.toExponential(1) : A.re.toPrecision(3));
        ro.set('reg', A.re < 1 ? 'creeping flow: Stokes law holds' : A.re < 1000 ? 'inertia matters: Stokes overestimates' : 'turbulent wake: drag ∝ v²');
        ro.set('t10', Math.abs(A.v) > 0 ? fmtTime(0.1 / Math.abs(A.v)) : 'never');
        ro.set('vr', (B.v < 0 ? 'rises ' : 'falls ') + fmtSpeed(Math.abs(B.v)));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the Leidenfrost effect */
  Hyper.sim('surf-leidenfrost', {
    title: 'A drop on a hot plate',
    blurb: `A drop of water on a heated plate, side on, beside a graph of how long it lives. Below 100 °C it spreads and evaporates slowly. Above 100 °C it boils and the lifetime falls, because contact with the metal is good and bubbles stir the heat in. Then, at the **Leidenfrost point** (about 193 °C on a clean smooth pan; higher on rough or oxidised metal), the lifetime jumps *up* by an order of magnitude: the drop floats on a cushion of its own vapour, a film tens of micrometres thick, which conducts heat to it far less well. The curve below the point is drawn from typical values, schematic; above the point the lifetime comes from heat conduction through the vapour film (a film of 25 µm assumed).

**Try this**
- Slide the plate temperature from 60 to 400 °C and watch the lifetime curve fall, then leap at the Leidenfrost point.
- Hold the plate at 150 °C: the drop vanishes in seconds. At 250 °C it lasts about a minute and a half.
- Choose the rough plate: the point moves up, and the drop at 220 °C now boils away fast.
- The animation's clock is compressed so you can watch a lifetime of minutes; the read-out gives the real time.`,
    mount(box, kit, params) {
      const W = kit.water;
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270, maxH: 360 });
      box.stage.appendChild(graph);
      const ctl = kit.controls(box.side, [
        { id: 'Tp', label: 'Temperature of the plate', min: 60, max: 400, step: 1, value: params.Tp || 250, unit: '°C' },
        { id: 'TL', type: 'select', label: 'The plate', options: [['Clean, smooth metal (Leidenfrost point 193 °C)', 193], ['Rough or oxidised metal (about 240 °C)', 240], ['A very rough or porous surface (about 290 °C)', 290]], value: params.TL || 193 },
        { id: 'm', label: 'Mass of the drop', min: 0.05, max: 2, step: 0.01, value: 0.3, unit: 'g', log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'go', label: 'New drop', primary: true }] }
      ], (id) => { if (id === 'go') e0 = clock; plotDirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['tau', 'Lifetime of the drop'], ['reg', 'Regime'], ['q', 'Heat into the drop'], ['gap', 'Gap under the drop'], ['clock', 'Animation clock']]);
      const plot = kit.plot(graph, { x: { label: 'plate temperature (°C)', min: 60, max: 400 }, y: { label: 'lifetime (s)', log: true, min: 1, max: 1000 } }, 160);
      let clock = 0, e0 = 0, plotDirty = true;
      const r = rng(9);
      const bub = [];
      for (let k = 0; k < 14; k++) bub.push({ x: r() - 0.5, y: r(), s: 0.5 + r() });
      function lifetime(T, TL, m) {
        const a = Math.cbrt(3 * (m * 1e-3 / 998) / (4 * Math.PI));
        if (T >= TL) {
          const Vv = m * 1e-3 / 998, lcv = W.capillaryLength(100);
          const H = 2 * a / Math.sqrt(1 + (a / lcv) * (a / lcv)), area = Vv / (0.9 * H);
          const kv = 0.025 + 0.00009 * ((T + 100) / 2 - 100);
          const e = 25e-6, P = area * kv * (T - 100) / e;
          return m * 1e-3 * W.latentVaporisation(100) / P;
        }
        const an = [[60, 150], [100, 40], [120, 15], [150, 6], [170, 4.5], [TL, 6]];
        let tau = an[0][1];
        for (let k = 1; k < an.length; k++) {
          if (T <= an[k][0]) { const f = (T - an[k - 1][0]) / (an[k][0] - an[k - 1][0]); tau = Math.exp(Math.log(an[k - 1][1]) * (1 - f) + Math.log(an[k][1]) * f); break; }
        }
        if (T < an[0][0]) tau = an[0][1];
        return tau * Math.pow(m / 0.2, 2 / 3);
      }
      const loop = kit.loop((dt, t) => {
        clock += dt;
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const TL = V.TL, T = V.Tp, tau = lifetime(T, TL, V.m);
        if (plotDirty) {
          const pts1 = [], pts2 = [];
          for (let x = 60; x <= TL; x += 4) pts1.push([x, lifetime(x, TL, V.m)]);
          pts1.push([TL - 0.01, lifetime(TL - 0.01, TL, V.m)]);
          pts2.push([TL, lifetime(TL, TL, V.m)]);
          for (let x = TL; x <= 400; x += 4) pts2.push([x, lifetime(x, TL, V.m)]);
          plot.set({ series: [{ pts: pts1, label: 'boiling regimes', color: C.warn }, { pts: pts2, label: 'on a vapour cushion', color: C.accent }], marks: [{ x: T, y: tau, label: fmtTime(tau) }], vlines: [{ x: TL, label: 'Leidenfrost point' }, { x: 100, label: '100 °C' }], x: { label: 'plate temperature (°C)', min: 60, max: 400 }, y: { label: 'lifetime (s)', log: true, min: 1, max: 1000 } });
          plotDirty = false;
        }
        const regime = T < 100 ? 0 : T < TL ? 1 : 2;
        const screenLife = clamp(1.5 + 1.5 * Math.log(1 + tau), 3, 12);
        const el = clock - e0, cyc = screenLife + 1.2, ph = el % cyc;
        const mu = ph > screenLife ? 0 : 1 - ph / screenLife;
        const groundY = Hh * 0.74;
        /* the plate, glowing with its temperature */
        const glow = clamp((T - 60) / 340, 0, 1);
        c.fillStyle = 'rgb(' + Math.round(90 + 150 * glow) + ',' + Math.round(90 - 40 * glow) + ',' + Math.round(95 - 50 * glow) + ')';
        c.fillRect(0, groundY, Wd, Hh - groundY);
        c.fillStyle = C.text; c.globalAlpha = 0.8;
        kit.label(c, T.toFixed(0) + ' °C', 14, groundY + (Hh - groundY) / 2, { color: '#fff', size: 14, weight: 700, baseline: 'middle' });
        c.globalAlpha = 1;
        const cx = Wd * 0.5;
        if (mu > 0) {
          const R0 = 40 * Math.cbrt(V.m / 0.3), Rs = R0 * Math.cbrt(mu);
          const gap = regime === 2 ? 5 : 0;
          const thE = regime === 0 ? 22 : regime === 1 ? 50 : 180;
          c.save();
          c.fillStyle = 'rgba(70,150,235,0.55)'; c.strokeStyle = C.accent; c.lineWidth = 1.6;
          let top = groundY, bw = Rs;
          if (regime < 2) {
            const cu = Math.cos(thE * Math.PI / 180), su = Math.sin(thE * Math.PI / 180);
            const Rr = Rs * Math.cbrt(4 / (2 - 3 * cu + cu * cu * cu)), ab = Rr * su, hh = Rr * (1 - cu);
            const yc = groundY - hh + Rr;
            let pl = Math.atan2(groundY - yc, -ab); if (pl > 0) pl -= TAU;
            const pr = Math.atan2(groundY - yc, ab);
            c.beginPath(); c.arc(cx, yc, Rr, pl, pr, false); c.closePath(); c.fill(); c.stroke();
            top = groundY - hh; bw = ab;
          } else {
            const aphys = Math.cbrt(3 * (V.m * mu * 1e-3 / 998) / (4 * Math.PI)), lcv = W.capillaryLength(100);
            const Hn = 2 * Rs / Math.sqrt(1 + Math.pow(aphys / lcv, 2));
            const Dn = Math.sqrt(8 * Rs * Rs * Rs / Math.max(Hn, 1e-6));
            const cyy = groundY - gap - Hn / 2;
            c.beginPath(); c.ellipse(cx, cyy, Math.min(Dn / 2, Wd * 0.4), Math.max(1.5, Hn / 2), 0, 0, TAU); c.fill(); c.stroke();
            top = groundY - gap - Hn; bw = Math.min(Dn / 2, Wd * 0.4);
            /* the vapour cushion and its escape */
            c.fillStyle = 'rgba(230,230,240,0.35)'; c.fillRect(cx - bw, groundY - gap, 2 * bw, gap);
            for (let k = 0; k < 5; k++) {
              const ph2 = (t * 1.2 + k * 0.2) % 1;
              for (const s of [-1, 1]) { c.strokeStyle = 'rgba(210,210,225,0.7)'; c.lineWidth = 1.2; const x = cx + s * (bw * 0.6 + ph2 * (bw * 0.7 + 30)); c.beginPath(); c.moveTo(x, groundY - gap * 0.5 - ph2 * 14); c.lineTo(x + s * 8, groundY - gap * 0.5 - ph2 * 14 - 3); c.stroke(); }
            }
            kit.label(c, 'vapour cushion (~25 µm thick, drawn thicker)', cx + bw + 14, groundY - 12, { color: C.muted, size: 11 });
          }
          c.restore();
          if (regime === 1) {
            const nb = Math.round(4 + 10 * clamp((T - 100) / (TL - 100), 0, 1));
            for (let k = 0; k < nb; k++) {
              const b = bub[k % bub.length], ph3 = (t * (0.6 + b.s) * 0.8 + b.y) % 1;
              const bx = cx + b.x * bw * 1.4, byy = groundY - 2 - ph3 * Math.max(6, (groundY - top) * 0.9);
              c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 1; c.beginPath(); c.arc(bx, byy, 1.5 + 2 * b.s, 0, TAU); c.stroke();
            }
            for (let k = 0; k < 4; k++) kit.label(c, '~', cx - bw + k * (2 * bw / 3), top - 8 - 8 * Math.sin(t * 3 + k), { color: C.muted, size: 14, align: 'center' });
          } else if (regime === 0) {
            for (let k = 0; k < 2; k++) kit.label(c, '~', cx - bw * 0.4 + k * bw * 0.8, top - 8 - 5 * Math.sin(t * 1.2 + k), { color: C.faint, size: 14, align: 'center' });
          } else {
            for (let k = 0; k < 3; k++) kit.label(c, '~', cx - bw * 0.5 + k * bw * 0.5, top - 10 - 6 * Math.sin(t * 1.6 + k), { color: C.muted, size: 14, align: 'center' });
          }
        } else kit.label(c, 'the drop has gone', cx, groundY - 24, { color: C.faint, size: 12, align: 'center' });
        kit.label(c, regime === 0 ? 'below 100 °C: slow evaporation' : regime === 1 ? 'boiling on contact: a short life' : 'Leidenfrost: skating on its own vapour', 14, 22, { color: regime === 2 ? C.ok : C.muted, size: 12.5, weight: 650 });
        const area = (V.m * 1e-3 / 998) / (0.9 * 2 * Math.cbrt(3 * (V.m * 1e-3 / 998) / (4 * Math.PI)) / Math.sqrt(1 + 1));
        ro.set('tau', fmtTime(tau));
        ro.set('reg', regime === 0 ? 'below the boiling point' : regime === 1 ? 'nucleate and transition boiling' : 'film boiling (Leidenfrost)');
        ro.set('q', (V.m * 1e-3 * W.latentVaporisation(100) / tau).toFixed(1) + ' W (average)');
        ro.set('gap', regime === 2 ? 'about 25 µm of vapour' : 'none: the liquid touches the metal');
        ro.set('clock', 'real ÷ screen = ' + (tau / screenLife).toFixed(1) + ' ×');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ waves in water: hammer and sound */
  function mackenzie(T, S, D) {
    return 1448.96 + 4.591 * T - 5.304e-2 * T * T + 2.374e-4 * T * T * T + 1.340 * (S - 35) + 1.630e-2 * D + 1.675e-7 * D * D - 1.025e-2 * T * (S - 35) - 7.139e-13 * T * D * D * D;
  }
  Hyper.sim('surf-waves', {
    title: 'Pressure waves in water',
    blurb: `Two views of the same fact: water is stiff, so a disturbance crosses it at about 1,500 m/s. **Water hammer**: water runs through a pipe from a reservoir to a valve; the valve shuts and the stopped water at the valve cannot be warned in time, so the pressure jumps by $\\Delta p = \\rho c\\,\\Delta v$ (Joukowsky) and the pulse runs back and forth along the pipe. The calculation follows the pulse by the method of characteristics for a frictionless pipe with a tiny damping; slowed down so one round trip takes a few seconds. **Speed of sound**: the graph gives $c$ for pure water against temperature (with its maximum at 74 °C) and for sea water against temperature, salinity and depth (Mackenzie, 1981); the picture is a sonar ping.

**Try this**
- Hammer: close the valve in 20 ms on a 200 m pipe (a sudden shut): the full Joukowsky jump. Stretch the closure to a few seconds and the peak collapses to $2\\rho L \\Delta v/t_c$.
- Switch from a rigid pipe to PVC: the wave speed falls to about 380 m/s and so does the surge, because the pipe wall gives.
- Raise the flow speed to 2 m/s or more with the static pressure at 25 bar, or lower the static pressure: the trough behind the pulse then dips to the vapour pressure and a cavity would form (not modelled).
- Sound: warm the pure water and watch $c$ rise, peak at 74 °C and fall. In the sea, depth adds 0.016 m/s per metre; in the depth profile the speed has a **minimum** near 1,000 m, the axis of the SOFAR sound channel.`,
    mount(box, kit, params) {
      const W = kit.water;
      const gA = document.createElement('div'); gA.style.padding = '6px 10px 4px';
      const gB = document.createElement('div'); gB.style.padding = '2px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250, maxH: 330 });
      box.stage.appendChild(gA); box.stage.appendChild(gB);
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['Water hammer in a pipe', 'hammer'], ['The speed of sound', 'sound']], value: params.mode === 'sound' ? 'sound' : 'hammer' },
        { id: 'T', label: 'Temperature', min: 0, max: 100, step: 1, value: params.T != null ? params.T : 20, unit: '°C' },
        { id: 'L', label: 'Length of the pipe', min: 10, max: 3000, step: 1, value: 200, unit: 'm', log: true, sig: 3 },
        { id: 'v0', label: 'Flow speed before the valve closes', min: 0.2, max: 6, step: 0.1, value: 1.5, unit: 'm/s' },
        { id: 'tc', label: 'Time to close the valve', min: 1, max: 10000, step: 1, value: 20, unit: 'ms', log: true, sig: 2 },
        { id: 'pipe', type: 'select', label: 'The pipe', options: [['Rigid (the limit)', 'rigid'], ['Steel, D/w = 20', 'steel'], ['PVC, D/w = 20', 'pvc']], value: 'steel' },
        { id: 'p0', label: 'Static pressure in the pipe (gauge)', min: 1, max: 40, step: 0.5, value: 25, unit: 'bar' },
        { id: 'S', label: 'Salinity of the sea water', min: 0, max: 40, step: 0.5, value: 35, unit: 'g/kg' },
        { id: 'D', label: 'Depth (for the sea-water curve)', min: 0, max: 8000, step: 50, value: 0, unit: 'm' },
        { id: 'ping', label: 'Depth of the sea floor (sonar)', min: 10, max: 8000, step: 10, value: 1500, unit: 'm', log: true, sig: 3 },
        { type: 'buttons', items: [{ id: 'close', label: 'Close the valve / ping', primary: true }] }
      ], (id) => { if (id === 'close') restart(); if (id !== 'close' && V.view === 'hammer' && ['L', 'v0', 'tc', 'pipe', 'p0', 'T'].includes(id)) restart(); plotDirty = true; modes(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['c', 'Wave speed'], ['jou', 'Joukowsky jump ρ c Δv'], ['rt', 'Round trip 2L/c'], ['kind', 'The closure is'], ['peak', 'Peak pressure at the valve'], ['mich', 'Gradual-closure estimate 2ρLΔv/t'],
        ['cp', 'Pure water'], ['cs', 'Sea water'], ['cair', 'Air, 20 °C'], ['echo', 'Echo delay 2D/c']]);
      function modes() {
        const h = V.view === 'hammer';
        ['L', 'v0', 'tc', 'pipe', 'p0'].forEach(k => ctl.show(k, h));
        ['S', 'D', 'ping'].forEach(k => ctl.show(k, !h));
        for (const k of ['c', 'jou', 'rt', 'kind', 'peak', 'mich']) ro.show(k, h);
        for (const k of ['cp', 'cs', 'cair', 'echo']) ro.show(k, !h);
        gB.style.display = h ? 'none' : '';
      }
      const plotA = kit.plot(gA, { x: { label: 'time (s)', min: 0 }, y: { label: 'pressure at the valve (bar)' } }, 170);
      const plotB = kit.plot(gB, { x: { label: 'speed of sound (m/s)' }, y: { label: 'depth (m)', reverse: true } }, 170);
      modes();
      let plotDirty = true;
      /* ---------- the pipe, by characteristics */
      const N = 50;
      let p = new Float64Array(N + 1), u = new Float64Array(N + 1), pn = new Float64Array(N + 1), un = new Float64Array(N + 1);
      let tPhys = 0, acc = 0, closed = false, hist = [], pmaxSeen = 0, cav = false, tStart = 0, lastPlot = 0, lastKey = '';
      function pipeC() {
        const c0 = W.speedOfSound(V.T), K = W.bulkModulus(V.T);
        const E = V.pipe === 'steel' ? 200e9 : V.pipe === 'pvc' ? 3e9 : Infinity;
        return c0 / Math.sqrt(1 + (E === Infinity ? 0 : K * 20 / E));
      }
      function restart() {
        p.fill(0); u.fill(V.v0); tPhys = 0; acc = 0; hist = []; pmaxSeen = V.p0; cav = false; tStart = 0.15 * 4 * V.L / pipeC(); lastKey = '';
        pingT = 0;
      }
      let pingT = 0, clock = 0;
      restart();
      /* ---------- sound plots */
      function soundPlots() {
        const C = kit.colors();
        const pure = [], sea = [];
        for (let T = 0; T <= 100; T += 2) pure.push([T, W.speedOfSound(T)]);
        for (let T = 0; T <= 30; T += 1) sea.push([T, mackenzie(T, V.S, V.D)]);
        let mx = 0, mxT = 0; for (let T = 0; T <= 100; T += 0.5) { const v = W.speedOfSound(T); if (v > mx) { mx = v; mxT = T; } }
        plotA.set({ series: [{ pts: pure, label: 'pure water', color: C.accent }, { pts: sea, label: 'sea water (S ' + V.S + ' g/kg, ' + V.D + ' m)', color: C.warn }], marks: [{ x: V.T, y: W.speedOfSound(V.T), label: W.speedOfSound(V.T).toFixed(0) + ' m/s' }, { x: mxT, y: mx, label: 'maximum ' + mx.toFixed(0) }], vlines: [], hlines: [], x: { label: 'temperature (°C)', min: 0, max: 100 }, y: { label: 'speed of sound (m/s)', min: 1380, max: 1580 } });
        const prof = []; let cmin = 1e9, zmin = 0;
        const Ts = clamp(V.T, 2, 30);
        for (let z = 0; z <= 6000; z += 100) {
          const Tz = 2 + (Ts - 2) * Math.exp(-z / 600);
          const cz = mackenzie(Tz, V.S, z);
          prof.push([cz, z]);
          if (cz < cmin) { cmin = cz; zmin = z; }
        }
        plotB.set({ series: [{ pts: prof, label: 'a typical ocean (surface ' + Ts.toFixed(0) + ' °C)', color: C.accent }], marks: [{ x: cmin, y: zmin, label: 'sound channel axis, ' + zmin + ' m' }], x: { label: 'speed of sound (m/s)', min: Math.floor(cmin / 10) * 10 - 5, max: Math.ceil(Math.max(...prof.map(q => q[0])) / 10) * 10 + 5 }, y: { label: 'depth (m)', reverse: true, min: 0, max: 6000 } });
      }
      const loop = kit.loop((dt, t) => {
        clock += dt;
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (V.view === 'hammer') {
          const cw = pipeC(), rho = W.density(V.T), Z = rho * cw;
          const dtS = V.L / (N * cw), tc = V.tc * 1e-3;
          acc += dt * 0.8 * N;                       // 40 steps a second
          let guard = 0;
          const pAbs0 = V.p0 * 1e5 + 101325, pv = W.vapourPressure(V.T);
          const pFloor = -(pAbs0 - pv);
          while (acc >= 1 && guard++ < 20) {
            acc -= 1;
            tPhys += dtS;
            const tau = tPhys < tStart ? 1 : clamp(1 - (tPhys - tStart) / tc, 0, 1);
            for (let i = 1; i < N; i++) {
              pn[i] = 0.5 * (p[i - 1] + p[i + 1] + Z * (u[i - 1] - u[i + 1]));
              un[i] = 0.5 * (u[i - 1] + u[i + 1]) + (p[i - 1] - p[i + 1]) / (2 * Z);
            }
            pn[0] = 0; un[0] = u[1] - p[1] / Z;
            un[N] = V.v0 * tau; pn[N] = p[N - 1] + Z * u[N - 1] - Z * un[N];
            const damp = tPhys > tStart ? 0.9985 : 1;
            for (let i = 0; i <= N; i++) {
              if (pn[i] < pFloor) { pn[i] = pFloor; cav = true; }
              p[i] = pn[i] * damp; u[i] = un[i] * (tPhys > tStart ? damp : 1);
              if (!Number.isFinite(p[i])) p[i] = 0; if (!Number.isFinite(u[i])) u[i] = 0;
            }
            const pv2 = V.p0 + p[N] / 1e5;
            pmaxSeen = Math.max(pmaxSeen, pv2);
            if (hist.length > 900) hist = hist.filter((q, k) => k % 2 === 0);
            hist.push([tPhys, pv2]);
          }
          /* draw the pipe */
          const x0 = 70, x1 = Wd - 70, py = Hh * 0.42, th = 38;
          const jou = Z * V.v0;
          for (let i = 0; i < N; i++) {
            const a = clamp(p[i] / Math.max(jou, 1), -1, 1);
            c.fillStyle = a >= 0 ? 'rgba(235,70,60,' + (0.12 + 0.75 * a) + ')' : 'rgba(60,110,235,' + (0.12 - 0.75 * a) + ')';
            c.fillRect(x0 + (x1 - x0) * i / N, py - th / 2, (x1 - x0) / N + 1, th);
          }
          c.strokeStyle = C.text; c.lineWidth = 2.5; c.strokeRect(x0, py - th / 2, x1 - x0, th);
          /* reservoir and valve */
          c.fillStyle = 'rgba(70,150,235,0.4)'; c.fillRect(8, py - th * 1.3, x0 - 14, th * 2.6); c.strokeStyle = C.text; c.strokeRect(8, py - th * 1.3, x0 - 14, th * 2.6);
          kit.label(c, 'reservoir', 8 + (x0 - 14) / 2, py + th * 1.3 + 14, { color: C.muted, size: 11, align: 'center' });
          const tau2 = tPhys < tStart ? 1 : clamp(1 - (tPhys - tStart) / tc, 0, 1);
          c.fillStyle = tau2 > 0.02 ? C.ok : C.bad; c.fillRect(x1 + 6, py - th / 2, 10, th);
          c.fillStyle = C.bg2; c.fillRect(x1 + 6, py - th / 2, 10, th * (1 - tau2));
          kit.label(c, 'valve', x1 + 11, py + th * 1.3 + 14, { color: C.muted, size: 11, align: 'center' });
          /* velocity arrows */
          for (let k = 1; k < 10; k++) {
            const i = Math.round(k / 10 * N), ux = clamp(u[i] / Math.max(V.v0, 1e-6), -1.5, 1.5) * 22;
            const xx = x0 + (x1 - x0) * i / N;
            if (Math.abs(ux) > 1) kit.arrow(c, xx - ux / 2, py, xx + ux / 2, py, C.text, 1.4);
          }
          kit.label(c, 'red: above static pressure · blue: below', (x0 + x1) / 2, py - th - 16, { color: C.muted, size: 11, align: 'center' });
          const vp = V.p0 + p[N] / 1e5;
          kit.label(c, 'at the valve: ' + vp.toFixed(1) + ' bar (gauge)', (x0 + x1) / 2, py + th * 1.3 + 36, { color: Math.abs(vp - V.p0) > 0.5 ? C.bad : C.text, size: 13, weight: 650, align: 'center' });
          if (cav) kit.label(c, 'vapour pressure reached: a cavity would form', (x0 + x1) / 2, Hh - 12, { color: C.bad, size: 11.5, align: 'center' });
          const key = hist.length + ':' + V.L + V.pipe + V.v0 + V.tc;
          if (key !== lastKey && clock - lastPlot > 0.15) {
            lastKey = key; lastPlot = clock;
            plotA.set({ series: [{ pts: hist.length ? hist : [[0, V.p0]], label: 'pressure at the valve', color: C.accent }], hlines: [{ y: V.p0, label: 'static ' + V.p0 + ' bar' }, { y: V.p0 + jou / 1e5, label: 'static + ρcΔv' }], marks: [], vlines: [], x: { label: 'time (s)', min: 0, max: Math.max(4 * V.L / cw * 1.5, tPhys) }, y: { label: 'pressure at the valve (bar, gauge)', min: Math.min(-1, V.p0 - jou / 1e5 * 1.05, ...(hist.length ? [Math.min(...hist.map(q => q[1]))] : [0])), max: Math.max(V.p0 + jou / 1e5 * 1.15, pmaxSeen * 1.05) } });
          }
          const rt = 2 * V.L / cw;
          ro.set('c', cw.toFixed(0) + ' m/s  (' + (V.pipe === 'rigid' ? 'water alone' : 'the pipe wall gives') + ')');
          ro.set('jou', (jou / 1e5).toFixed(1) + ' bar');
          ro.set('rt', fmtTime(rt));
          ro.set('kind', tc <= rt ? 'sudden (≤ 2L/c): full jump' : 'gradual (> 2L/c): the jump is spread');
          ro.set('peak', (pmaxSeen).toFixed(1) + ' bar (gauge)');
          ro.set('mich', (tc > rt ? (2 * rho * V.L * V.v0 / tc / 1e5).toFixed(1) + ' bar' : '— (closure is sudden)'));
        } else {
          /* sonar */
          const cp = W.speedOfSound(V.T), cs = mackenzie(clamp(V.T, 0, 30), V.S, V.D);
          const surf = 60, sea = Hh - 40, shipx = Wd * 0.3;
          c.fillStyle = 'rgba(70,150,235,0.25)'; c.fillRect(0, surf, Wd, sea - surf);
          c.fillStyle = 'rgba(150,120,80,0.7)'; c.fillRect(0, sea, Wd, Hh - sea);
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(0, surf); c.lineTo(Wd, surf); c.stroke();
          c.fillStyle = C.text; c.beginPath(); c.moveTo(shipx - 26, surf - 4); c.lineTo(shipx + 26, surf - 4); c.lineTo(shipx + 16, surf + 8); c.lineTo(shipx - 16, surf + 8); c.closePath(); c.fill();
          const dm = V.ping, cyc = 4.4, ph = clamp(((clock - 0.0) % cyc) / 3.6, 0, 1);
          const down = ph < 0.5, f = down ? ph * 2 : 2 - ph * 2;
          const yy = surf + 10 + f * (sea - surf - 14);
          for (let k = 0; k < 3; k++) { c.strokeStyle = C.warn; c.globalAlpha = 1 - k * 0.3; c.lineWidth = 2; c.beginPath(); c.moveTo(shipx - 40 - k * 6, yy - (down ? k * 6 : -k * 6)); c.lineTo(shipx + 40 + k * 6, yy - (down ? k * 6 : -k * 6)); c.stroke(); c.globalAlpha = 1; }
          const tE = ph * (2 * dm / cs);
          kit.label(c, 'sea floor at ' + fmtLen(dm) + ' (not to scale)', Wd / 2, sea + 22, { color: '#fff', size: 11.5, align: 'center' });
          kit.label(c, 'echo time so far ' + (tE).toFixed(2) + ' s of ' + (2 * dm / cs).toFixed(2) + ' s', Wd / 2, surf - 34, { color: C.text, size: 12, weight: 650, align: 'center' });
          if (clock - lastPlot > 0.3 || lastKey !== 'snd' + V.T + V.S + V.D) { lastPlot = clock; lastKey = 'snd' + V.T + V.S + V.D; soundPlots(); }
          ro.set('cp', cp.toFixed(1) + ' m/s');
          ro.set('cs', cs.toFixed(1) + ' m/s' + (V.T > 30 ? ' (equation valid to 30 °C)' : ''));
          ro.set('cair', '343 m/s: water is ' + (cp / 343).toFixed(1) + ' × faster');
          ro.set('echo', (2 * dm / cs).toFixed(3) + ' s for ' + fmtLen(dm));
        }
      }, box.stage);
      loop.start();
    }
  });
})();
