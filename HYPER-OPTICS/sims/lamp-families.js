/* HYPER-OPTICS · sims/lamp-families.js — simulations of the topic "Lamp families" (prefix la-)
 *   la-planck          a hot body against a cold light: Planck's curve at any temperature, or the lines and bands of a discharge, a phosphor, an LED
 *   la-halogen-cycle   the halogen cycle in a quartz capsule: tungsten leaves the filament, meets the halogen at the wall and comes home
 *   la-spectrum        a lamp card: the spectrum of any lamp of the table, its efficacy, colour temperature, rendering, life and start
 *   la-tube            a fluorescent tube cut open: electrons, mercury atoms, ultraviolet, the phosphor, and where the power goes
 *   la-hid-runup       an arc lamp from cold: the light, the colour and the spectrum during warm-up, and the wait for a hot restrike
 *   la-flash           a xenon flash tube and a xenon short-arc lamp: capacitor energy, pulse length, the light of one flash
 *   la-led             the LED junction: band gap to wavelength, the width of the band, heat and droop
 *   la-white-led       a blue chip with a phosphor, and the RGB alternative: spectrum, colour temperature, rendering
 *   la-rendering       ten coloured surfaces under any lamp, against a reference light: why two lamps of one colour temperature differ
 *   la-bases           lamp caps and bulb shapes drawn to scale, with the code decoded
 *   la-efficacy        lumens per watt, rated life and rendering of every family on one chart, and a lumen-maintenance curve
 *   la-flicker         the light of a lamp against time: mains ripple, PWM dimming, flicker percentage, and a wheel seen under it
 *   la-uv-ir           the invisible ends of the spectrum: UV-C to infrared sources against the eye and a silicon camera
 * Every number comes from kit.optics (the lamp table, the spectra, Planck's law, colour); the drawing is kit.osym and the canvas helpers of the kit.
 * Where a model is local to this file (a phosphor-converted white LED, ten reflectance curves, a flash pulse) the blurb says that it is schematic.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, R2D = 180 / PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fx = (x, d) => Number.isFinite(x) ? x.toFixed(d) : '—';
  const g = (nm, mu, s) => Math.exp(-0.5 * Math.pow((nm - mu) / s, 2));
  const gn = (nm, mu, s) => g(nm, mu, s) / (s * Math.sqrt(TAU));
  const sg = x => 1 / (1 + Math.exp(-x));
  const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  // a seeded random generator, so that every animation starts the same way
  function rng(seed) { let s = (seed >>> 0) || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
  // keep the result of an expensive calculation until its key changes (the headless test runs every loop for hundreds of frames)
  function memo() { let k = null, v; return (key, fn) => { if (key !== k) { v = fn(); k = key; } return v; }; }
  function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix3 = (A, B, t) => [lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)];
  // the glow of a light as a colour: the chromaticity of a spectrum, brought into the display's range at full brightness
  const lightRgb = (Cl, spec) => Cl.fit(Cl.toRgb(Cl.xyz(spec)));
  // the lines of a clear discharge: [[nm, strength, width] …]
  const lines = list => nm => { let s = 0; for (const [mu, a, sig] of list) s += a * g(nm, mu, sig || 2.5); return s; };

  /* ---- the spectrum of a source as a curve filled with the colour of each wavelength ----
     r: the plot rectangle { x, y, w, h }; vals: n values from 0 to 1 at equal steps of wavelength from nm0 to nm1 */
  function drawSpec(c, C, S, kit, r, nm0, nm1, vals, o) {
    o = o || {};
    const n = vals.length, X = nm => r.x + (nm - nm0) / (nm1 - nm0) * r.w, base = r.y + r.h, bw = r.w / n;
    const v0 = Math.max(nm0, 380), v1 = Math.min(nm1, 780);
    if (v1 > v0) { c.fillStyle = C.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.045)'; c.fillRect(X(v0), r.y, X(v1) - X(v0), r.h); }
    for (let i = 0; i < n; i++) {
      const v = vals[i]; if (!(v > 0.003)) continue;
      const nm = nm0 + (i + 0.5) / n * (nm1 - nm0), hh = clamp(v, 0, 1) * r.h;
      c.fillStyle = S.nm(nm, o.alpha == null ? 0.92 : o.alpha); c.fillRect(r.x + i * bw, base - hh, bw + 0.7, hh);
    }
    c.beginPath(); c.moveTo(r.x, base);
    for (let i = 0; i < n; i++) c.lineTo(r.x + (i + 0.5) * bw, base - clamp(vals[i], 0, 1) * r.h);
    c.lineTo(r.x + r.w, base); c.strokeStyle = C.text; c.lineWidth = 1.3; c.stroke();
    if (o.eye) {
      c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.4; c.beginPath();
      let started = false;
      for (let nm = Math.max(nm0, 380); nm <= Math.min(nm1, 780); nm += 5) { const x = X(nm), y = base - o.eye(nm) * r.h; if (started) c.lineTo(x, y); else c.moveTo(x, y); started = true; }
      c.stroke(); c.restore();
    }
    // the axis with its ticks
    c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(r.x, base); c.lineTo(r.x + r.w, base); c.stroke();
    const step = Hyper.niceStep(nm1 - nm0, Math.max(3, Math.floor(r.w / 85)));
    for (let nm = Math.ceil(nm0 / step) * step; nm <= nm1 + 1e-6; nm += step) {
      const x = X(nm); c.beginPath(); c.moveTo(x, base); c.lineTo(x, base + 4); c.stroke();
      kit.label(c, String(Math.round(nm)), x, base + 14, { align: 'center', size: 10.5, color: C.faint });
    }
    kit.label(c, 'wavelength (nm)', r.x + r.w, base + 28, { align: 'right', size: 11, color: C.muted });
    return X;
  }
  // n samples of a spectrum, scaled to a peak of 1
  function sampleSpec(spec, nm0, nm1, n) {
    const v = []; let mx = 0;
    for (let i = 0; i < n; i++) { const s = spec(nm0 + (i + 0.5) / n * (nm1 - nm0)); v.push(s); if (s > mx) mx = s; }
    return { vals: v.map(s => mx > 0 ? s / mx : 0), peak: mx };
  }
  // radiation shares, luminous efficacy of the radiation and the strongest wavelength of a spectrum (one pass)
  function summarise(Ph, spec, hi) {
    let tot = 0, uv = 0, vis = 0, ir = 0, lum = 0, mx = 0, pk = 0, m1 = 0, m2 = 0;
    for (let nm = 100; nm <= hi; nm += nm < 3000 ? 2 : 25) {
      const w = nm < 3000 ? 2 : 25, s = spec(nm), p = s * w; tot += p;
      if (s > mx) { mx = s; pk = nm; }
      if (nm < 380) uv += p; else if (nm <= 780) { vis += p; lum += p * Ph.V(nm); m1 += p * nm; m2 += p * nm * nm; } else ir += p;
    }
    const mean = vis > 0 ? m1 / vis : 0, spread = vis > 0 ? Math.sqrt(Math.max(0, m2 / vis - mean * mean)) : 0;
    return { uv: tot ? uv / tot : 0, vis: tot ? vis / tot : 0, ir: tot ? ir / tot : 0, ler: tot ? 683 * lum / tot : 0, peak: pk, spread, mean };
  }
  // what colour is a light? { text, white, cct, duv, rgb }
  function colourOf(O, spec, summary) {
    const Cl = O.colour, xyz = Cl.xyz(spec), xy = Cl.xy(xyz), cd = Cl.cctDuv(xy[0], xy[1]);
    const narrow = summary && summary.spread < 25 && summary.vis > 0.3;
    const white = cd.white && !narrow;
    return { xy, cct: cd.cct, duv: cd.duv, white, narrow, rgb: Cl.fit(Cl.toRgb(xyz)),
      text: white ? 'a white, ' + Math.round(cd.cct / 10) * 10 + ' K  (Δuv ' + (cd.duv >= 0 ? '+' : '−') + Math.abs(cd.duv).toFixed(3) + ')' : narrow ? 'one colour, near ' + Math.round(summary.peak) + ' nm — not a white' : 'a colour, not a white' };
  }

  /* ================================================================ hot glow and cold light */
  const COLD = [['Fluorescent tube (mercury and phosphor)', 'fluorescent'], ['Clear mercury discharge, no phosphor', 'mercury'], ['Low-pressure sodium lamp', 'sodium-lp'], ['White LED, neutral', 'led-neutral'], ['Red LED, 630 nm', 'led-red'], ['Blue LED, 465 nm', 'led-blue']];
  Hyper.sim('la-planck', {
    title: 'Hot glow and cold light: two ways to make a spectrum',
    blurb: `A hot body glows at every wavelength, and **Planck's curve** tells how much at each one; only its temperature matters. A discharge, a phosphor or a semiconductor makes **lines and bands** instead, chosen by its energy levels, and it stays cool. The coloured curve is what the source radiates; the shaded strip is the visible range, and the dashed line is how sensitive the eye is inside it.

**Try this**
- Set the hot body to **2700 K**, an ordinary filament lamp. The peak (Wien's law) sits near 1070 nm, in the infrared: only about 8 % of the radiation is visible.
- Raise it to **3400 K**, about the limit of a tungsten filament, and then to **5800 K**, the surface of the Sun. The peak walks into the visible range and the share of light climbs towards half.
- Switch to *luminescence* and pick the fluorescent tube, the sodium lamp, the red LED. Almost every watt of radiation is visible, and each source is a few narrow bands rather than a hill.
- Compare the *luminous efficacy of the radiation*: a hot body never exceeds about 98 lm per radiated watt, a sodium lamp's single line gives over 500.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'How the light is made', options: [['Incandescence: a hot body', 'hot'], ['Luminescence: gas, phosphor or semiconductor', 'cold']], value: params.mode || 'hot' },
        { id: 'T', label: 'Temperature of the hot body', min: 800, max: 7000, value: params.T || 2700, log: true, sig: 3, unit: 'K' },
        { id: 'lamp', type: 'select', label: 'The luminescent source', options: COLD, value: params.lamp || 'fluorescent' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const vis = () => { ctl.show('T', V.mode === 'hot'); ctl.show('lamp', V.mode === 'cold'); };
      vis();
      const ro = kit.readout(box.side, [['peak', 'Strongest wavelength'], ['vis', 'Radiation that is visible'], ['ir', 'Infrared (above 780 nm)'], ['uv', 'Ultraviolet (below 380 nm)'], ['ler', 'Luminous efficacy of the radiation'], ['col', 'The colour of the light'], ['p', 'Total power at this temperature']]);
      const calc = memo(), NM0 = 200, NM1 = 3000, NS = 280;
      const model = () => calc(V.mode + '|' + (V.mode === 'hot' ? Math.round(V.T) : V.lamp), () => {
        const T = Math.round(V.T), spec = V.mode === 'hot' ? nm => Ph.planck(nm, T) : Ph.spectrum(V.lamp);
        const sm = sampleSpec(spec, NM0, NM1, NS), su = summarise(Ph, spec, 40000), col = colourOf(O, spec, su);
        return { sm, su, col, T, peak: V.mode === 'hot' ? Ph.wien(T) : su.peak };
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = model();
        const r = { x: 50, y: 34, w: W - 50 - 22, h: Hh * 0.54 }, base = r.y + r.h;
        const X = drawSpec(c, C, S, kit, r, NM0, NM1, M.sm.vals, { eye: nm => Ph.V(nm) });
        kit.label(c, V.mode === 'hot' ? 'Planck curve of a body at ' + M.T + ' K (each curve scaled to its own peak)' : (COLD.find(e => e[1] === V.lamp) || [''])[0], r.x, r.y - 14, { size: 12.5, weight: 650 });
        kit.label(c, 'visible', (X(380) + X(780)) / 2, r.y + 10, { align: 'center', size: 11, color: C.muted });
        // the strongest wavelength
        if (M.peak > NM0 && M.peak < NM1) { c.save(); c.setLineDash([3, 4]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(X(M.peak), r.y + 18); c.lineTo(X(M.peak), base); c.stroke(); c.restore(); kit.label(c, fx(M.peak, 0) + ' nm', X(M.peak) + 5, r.y + 24, { size: 11, color: C.muted }); }
        else if (M.peak >= NM1) kit.label(c, 'peak at ' + fx(M.peak / 1000, 1) + ' µm, off the chart →', r.x + r.w - 6, r.y + 24, { align: 'right', size: 11, color: C.muted });
        // the shares as one bar
        const by = base + 52, bh = 22, bw = r.w * 0.62;
        let x = r.x;
        for (const [name, share, fill] of [['UV', M.su.uv, 'rgba(150,90,200,0.7)'], ['visible', M.su.vis, C.accent], ['infrared', M.su.ir, 'rgba(210,80,60,0.7)']]) {
          const w = bw * share; if (w < 0.5) continue;
          c.fillStyle = fill; c.fillRect(x, by, w, bh);
          if (w > 52) kit.label(c, name + ' ' + fx(share * 100, share < 0.1 ? 1 : 0) + ' %', x + w / 2, by + bh / 2, { align: 'center', size: 11, color: '#fff', weight: 650 });
          x += w;
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(r.x, by, bw, bh);
        kit.label(c, 'where the radiated power goes', r.x, by - 9, { size: 11.5, color: C.muted });
        // the colour of the light
        c.fillStyle = Cl.css(M.col.rgb); rrect(c, r.x + bw + 24, by - 4, Math.min(100, r.w - bw - 24), bh + 8, 8); c.fill(); c.strokeStyle = C.axis; c.stroke();
        kit.label(c, 'colour of the light', r.x + bw + 24, by - 14, { size: 11.5, color: C.muted });
        const sun = M.su;
        ro.set('peak', V.mode === 'hot' ? fx(M.peak, 0) + ' nm  (Wien: 2898 µm·K ÷ T)' : fx(M.peak, 0) + ' nm');
        ro.set('vis', fx(sun.vis * 100, sun.vis < 0.1 ? 1 : 0) + ' %');
        ro.set('ir', fx(sun.ir * 100, sun.ir < 0.1 ? 1 : 0) + ' %');
        ro.set('uv', fx(sun.uv * 100, sun.uv < 0.1 ? 1 : 0) + ' %');
        ro.set('ler', fx(sun.ler, 0) + ' lm per radiated watt');
        ro.set('col', M.col.text);
        ro.set('p', V.mode === 'hot' ? '× ' + fx(Math.pow(M.T / 2700, 4), 2) + ' of a 2700 K body (it goes as T⁴)' : 'a cool source: its glass stays near 40–100 °C');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the halogen cycle */
  Hyper.sim('la-halogen-cycle', {
    title: 'The halogen cycle: a bulb that returns its own tungsten',
    blurb: `A tungsten filament slowly boils away. In an ordinary lamp the atoms settle on the cool glass and darken it. A **halogen** lamp has a little bromine or iodine in its fill gas. Near the glass the tungsten combines with it into a gas; the gas drifts back to the filament, falls apart on the hot metal, and the tungsten is deposited again. The drawing is schematic: atoms, gas and filament are far out of scale.

**Try this**
- Leave the wall at **400 °C** with the halogen on. Grey tungsten atoms leave the coil, turn orange (a tungsten halide) near the wall and come home: the glass stays clean.
- Lower the wall below **250 °C**. The compound cannot form and the tungsten settles on the glass: this is why a halogen capsule is small, close to the filament and made of quartz, which stands the heat.
- Untick the halogen: an ordinary lamp. Watch the blackening build up.
- Raise the filament temperature: more tungsten boils off, the lamp is whiter and more efficient, and the cycle has more to do.`,
    mount(box, kit, params) {
      const O = kit.optics, Ph = O.photo, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'wall', label: 'Temperature of the bulb wall', min: 100, max: 700, step: 10, value: params.wall || 400, unit: '°C' },
        { id: 'T', label: 'Filament temperature', min: 2600, max: 3400, step: 50, value: 3000, unit: 'K' },
        { id: 'hal', type: 'check', label: 'Halogen added to the fill gas', value: params.hal !== false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again' }] }
      ], id => { if (id === 'reset') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['state', 'The cycle'], ['evap', 'Tungsten atoms boiled off'], ['back', 'Returned to the filament'], ['lost', 'Stuck on the glass'], ['dark', 'Blackening of the bulb']]);
      const A = 1, B = 0.55, FIL = 0.30;                         // the bulb is an ellipse of half-axes A and B; the coil runs from −FIL to +FIL
      let rand, P, dep, n;                                       // particles: { x, y, vx, vy, k } with k 0 tungsten, 1 halogen, 2 tungsten halide
      function reset() {
        rand = rng(11); P = []; dep = []; n = { evap: 0, back: 0, lost: 0, halogens: 12 };
        for (let i = 0; i < 12; i++) P.push({ x: (rand() * 2 - 1) * 0.8, y: (rand() * 2 - 1) * 0.4, vx: 0, vy: 0, k: 1 });
      }
      reset();
      const glow = memo();
      const edge = p => Math.sqrt(p.x * p.x / (A * A) + p.y * p.y / (B * B));
      function step(dt) {
        const T = V.T, hot = V.hal && V.wall >= 250;
        // tungsten leaves the coil at a rate that rises steeply with its temperature
        const rate = 3.2 * Math.exp((T - 3000) / 170);
        let nW = 0; for (const p of P) if (p.k === 0) nW++;
        if (nW < 34 && rand() < rate * dt) {
          const a = rand() * TAU, s = 0.36 + rand() * 0.2;
          P.push({ x: (rand() * 2 - 1) * FIL, y: 0, vx: Math.cos(a) * s, vy: Math.sin(a) * s * B, k: 0 }); n.evap++;
        }
        const keep = [];
        for (const p of P) {
          const e = edge(p);
          if (p.k === 0) {                                       // a tungsten atom flies out, with a little scatter
            p.vx += (rand() - 0.5) * 1.2 * dt; p.vy += (rand() - 0.5) * 1.2 * dt;
            p.x += p.vx * dt; p.y += p.vy * dt;
            if (edge(p) > 0.8) {
              const free = P.find(q => q.k === 1);
              if (hot && free) { free.dead = true; p.k = 2; p.vx = p.vy = 0; }
              else { n.lost++; dep.push(Math.atan2(p.y / B, p.x)); if (dep.length > 400) dep.shift(); continue; }
            }
          } else if (p.k === 1) {                                // a free halogen wanders
            p.vx += (rand() - 0.5) * 3 * dt; p.vy += (rand() - 0.5) * 3 * dt; p.vx *= 0.98; p.vy *= 0.98;
            p.x += p.vx * dt; p.y += p.vy * dt;
          } else {                                               // the compound drifts back towards the coil and falls apart there
            const tx = clamp(p.x, -FIL, FIL) - p.x, ty = -p.y, d = Math.hypot(tx, ty) || 1;
            p.vx += ((tx / d) * 0.22 + (rand() - 0.5) * 0.5 - p.vx) * 3 * dt; p.vy += ((ty / d) * 0.22 + (rand() - 0.5) * 0.5 - p.vy) * 3 * dt;
            p.x += p.vx * dt; p.y += p.vy * dt;
            if (edge(p) > 0.8 && V.wall < 250) { n.lost++; dep.push(Math.atan2(p.y / B, p.x)); if (dep.length > 400) dep.shift(); continue; }
            if (Math.abs(p.x) < FIL + 0.04 && Math.abs(p.y) < 0.09) { n.back++; keep.push({ x: p.x, y: p.y + 0.02, vx: (rand() - 0.5) * 0.3, vy: (rand() - 0.5) * 0.3, k: 1 }); continue; }
          }
          const e2 = edge(p);
          if (e2 > 0.97) { p.x *= 0.97 / e2; p.y *= 0.97 / e2; p.vx *= -0.5; p.vy *= -0.5; }
          keep.push(p);
        }
        P = keep.filter(p => !p.dead);
        if (!V.hal) P = P.filter(p => p.k !== 1);
        else { let h = 0; for (const p of P) if (p.k !== 0) h++; while (h < n.halogens) { P.push({ x: (rand() * 2 - 1) * 0.7, y: (rand() * 2 - 1) * 0.35, vx: 0, vy: 0, k: 1 }); h++; } }
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (dt > 0) step(dt);
        const k = Math.min(W * 0.40, Hh * 0.40 / B), cx = W / 2, cy = Hh * 0.47, X = x => cx + x * k, Y = y => cy + y * k;
        const wallT = clamp((V.wall - 100) / 600, 0, 1), wallCol = 'rgb(' + Math.round(lerp(110, 235, wallT)) + ',' + Math.round(lerp(150, 120, wallT)) + ',' + Math.round(lerp(210, 40, wallT)) + ')';
        // the quartz capsule and its two pinch seals
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.fillRect(X(-A) - 34, Y(-0.06), 36, k * 0.12); c.fillRect(X(A) - 2, Y(-0.06), 36, k * 0.12);
        c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(X(-A) - 34, Y(-0.06), 36, k * 0.12); c.strokeRect(X(A) - 2, Y(-0.06), 36, k * 0.12);
        c.beginPath(); c.ellipse(cx, cy, A * k, B * k, 0, 0, TAU); c.fillStyle = C.dark ? 'rgba(130,190,255,0.10)' : 'rgba(60,130,220,0.08)'; c.fill();
        c.strokeStyle = wallCol; c.lineWidth = 4; c.stroke();
        // the tungsten that stuck to the glass
        c.fillStyle = C.dark ? 'rgba(210,215,235,0.30)' : 'rgba(30,30,40,0.32)';
        for (const a of dep) { const px = cx + Math.cos(a) * (A * k - 5), py = cy + Math.sin(a) * (B * k - 5); c.beginPath(); c.arc(px, py, 4.2, 0, TAU); c.fill(); }
        // the coil, glowing in the colour of its temperature
        const G = glow(Math.round(V.T / 50), () => lightRgb(Cl, nm => Ph.planck(nm, V.T)));
        const halo = c.createRadialGradient(cx, cy, 0, cx, cy, k * 0.42);
        halo.addColorStop(0, Cl.css(G, 0.6)); halo.addColorStop(1, Cl.css(G, 0)); c.fillStyle = halo; c.fillRect(cx - k * 0.5, cy - k * 0.5, k, k);
        c.strokeStyle = Cl.css(G); c.lineWidth = 2.4; c.beginPath(); c.moveTo(X(-A) - 8, cy);
        c.lineTo(X(-FIL), cy);
        for (let i = 0; i <= 16; i++) c.lineTo(X(-FIL + 2 * FIL * i / 16), cy + (i % 2 ? 7 : -7));
        c.lineTo(X(FIL), cy); c.lineTo(X(A) + 8, cy); c.stroke();
        // the particles
        for (const p of P) {
          const x = X(p.x), y = Y(p.y);
          if (p.k === 0) kit.dot(c, x, y, 3.4, C.dark ? '#c6cbe0' : '#555a70');
          else if (p.k === 1) kit.dot(c, x, y, 4, '#b06be8');
          else kit.dot(c, x, y, 5.2, '#f0902a', C.text);
        }
        // the key
        const kx = 14, ky = Hh - 18;
        kit.dot(c, kx, ky, 3.4, C.dark ? '#c6cbe0' : '#555a70'); kit.label(c, 'tungsten atom', kx + 10, ky, { size: 11.5, color: C.muted });
        kit.dot(c, kx + 112, ky, 4, '#b06be8'); kit.label(c, 'halogen', kx + 122, ky, { size: 11.5, color: C.muted });
        kit.dot(c, kx + 184, ky, 5.2, '#f0902a', C.text); kit.label(c, 'tungsten halide gas', kx + 196, ky, { size: 11.5, color: C.muted });
        kit.label(c, 'quartz wall, ' + V.wall + ' °C', cx, cy - B * k - 12, { align: 'center', size: 12, color: C.muted });
        kit.label(c, 'filament, ' + V.T + ' K', cx, cy + 26, { align: 'center', size: 11.5, color: C.muted });
        const working = V.hal && V.wall >= 250;
        ro.set('state', !V.hal ? 'no halogen: an ordinary lamp' : working ? 'running: the wall is hot enough' : 'blocked: the wall is below about 250 °C');
        ro.set('evap', String(n.evap));
        ro.set('back', n.evap ? n.back + '  (' + Math.round(100 * n.back / n.evap) + ' %)' : '0');
        ro.set('lost', String(n.lost));
        ro.set('dark', n.evap ? fx(100 * n.lost / Math.max(n.evap, 1), 0) + ' % of what boiled off' : '0 %');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ a lamp card */
  const CARD = ['incandescent', 'halogen', 'fluorescent', 'cfl', 'mercury', 'metal-halide', 'sodium-hp', 'sodium-lp', 'xenon', 'flash', 'led', 'led-colour', 'oled', 'laser-lamp'];
  Hyper.sim('la-spectrum', {
    title: 'The lamp card: spectrum, efficacy, colour and life of each family',
    blurb: `Pick a lamp. The curve is its spectrum, coloured by wavelength; the dashed line is the eye's sensitivity. A smooth hill means a hot body, spikes mean a discharge, and a pair of humps means a phosphor or an LED. The read-out sets what the lamp table says about it beside what its spectrum gives.

**Try this**
- Compare *incandescent* with *white LED*: the filament throws most of its radiation beyond the red (switch to the wide range), the LED almost none.
- Look at *low-pressure sodium*: one line, the highest efficacy of any lamp in the table and no colour rendering at all.
- Choose *metal halide* and *fluorescent*: both are a grid of lines. The same colour temperature can come from very different spectra.
- Note the **start** and **life** rows: a discharge lamp that needs minutes to warm up and a LED that lights at once are choices a building lives with.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const lamps = O.LAMPS.filter(l => CARD.indexOf(l.id) >= 0);
      const ctl = kit.controls(box.side, [
        { id: 'lamp', type: 'select', label: 'Lamp', options: lamps.map(l => [l.name, l.id]), value: params.lamp || 'fluorescent' },
        { id: 'range', type: 'select', label: 'Wavelength range', options: [['Visible: 380–780 nm', 'vis'], ['Wide: 200–1100 nm', 'wide']], value: params.range || 'vis' },
        { id: 'eye', type: 'check', label: 'Show the sensitivity of the eye', value: true },
        { id: 'note', type: 'html', html: '' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eff', 'Efficacy (electrical)'], ['ler', 'Efficacy of the radiation'], ['col', 'Colour of the light'], ['cct', 'Colour temperature (table)'], ['cri', 'Colour rendering Ra (table)'], ['life', 'Rated life'], ['start', 'Starting']]);
      const calc = memo();
      const model = () => calc(V.lamp + '|' + V.range, () => {
        const l = lamps.find(e => e.id === V.lamp), spec = Ph.spectrum(l.spectrum), wide = V.range === 'wide';
        const nm0 = wide ? 200 : 380, nm1 = wide ? 1100 : 780;
        const su = summarise(Ph, spec, l.family === 'thermal' ? 40000 : 3000);
        return { l, sm: sampleSpec(spec, nm0, nm1, wide ? 270 : 200), nm0, nm1, su, col: colourOf(O, spec, su) };
      });
      const range = a => a[0] === a[1] ? String(a[0]) : a[0] + '–' + a[1];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = model();
        const r = { x: 24, y: 40, w: W - 48, h: Hh * 0.52 };
        drawSpec(c, C, S, kit, r, M.nm0, M.nm1, M.sm.vals, { eye: V.eye ? nm => Ph.V(nm) : null });
        kit.label(c, M.l.name, r.x, 20, { size: 13.5, weight: 650 });
        // what a prism would show, and the colour of the light
        const by = r.y + r.h + 46, bh = 22;
        S.spectrum(c, r.x, by, r.w - 130, bh, 380, 780, { weight: nm => { const i = Math.max(0, Math.min(M.sm.vals.length - 1, Math.floor((nm - M.nm0) / (M.nm1 - M.nm0) * M.sm.vals.length))); return nm >= M.nm0 && nm <= M.nm1 ? Math.pow(M.sm.vals[i], 0.55) : 0; } });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(r.x, by, r.w - 130, bh);
        kit.label(c, 'what a prism would show (brightness of each colour)', r.x, by - 9, { size: 11.5, color: C.muted });
        c.fillStyle = Cl.css(M.col.rgb); rrect(c, r.x + r.w - 110, by - 4, 110, bh + 8, 8); c.fill(); c.strokeStyle = C.axis; c.stroke();
        kit.label(c, 'colour of the light', r.x + r.w - 110, by - 14, { size: 11.5, color: C.muted });
        const l = M.l;
        ro.set('eff', range(l.efficacy) + ' lm/W');
        ro.set('ler', fx(M.su.ler, 0) + ' lm/W of radiation  (visible share ' + fx(M.su.vis * 100, 0) + ' %)');
        ro.set('col', M.col.text);
        ro.set('cct', l.cct[1] ? range(l.cct) + ' K' : 'not a white');
        ro.set('cri', l.cri[1] || l.id === 'sodium-lp' ? range(l.cri) : 'not defined');
        ro.set('life', range(l.life) + (l.id === 'flash' ? ' flashes' : ' hours'));
        ro.set('start', l.start);
        ctl.set('note', '<b>' + l.name + '.</b> ' + l.note);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ the fluorescent tube */
  const HGVIS = lines([[404.7, 0.14], [435.8, 0.55], [546.1, 1], [577, 0.45], [579.1, 0.45]]);       // the visible lines of mercury, with no phosphor
  Hyper.sim('la-tube', {
    title: 'The fluorescent tube: electrons, mercury, ultraviolet, phosphor',
    blurb: `Electrons run along the tube from one hot cathode to the other. Some strike mercury atoms and lift them to a higher level; each atom falls back and sends out an **ultraviolet** photon at 254 nm, which the eye cannot see. The photon hits the **phosphor** on the wall, which turns it into visible light of lower photon energy; the difference is heat. The bars show where the electrical power goes. The motion is schematic: the polarity really reverses 100 or 120 times a second, or 20–50 kHz with an electronic ballast.

**Try this**
- Remove the phosphor. The ultraviolet cannot leave the glass, almost nothing visible is left and the efficacy collapses to a few lm/W: the lamp is only as good as its phosphor.
- Choose the warm or the neutral triphosphor and watch the colour of the photons. Only about a quarter of the electrical power comes out as light, because each 254 nm photon (4.9 eV) gives a visible one of about 2.2 eV.
- Raise the current: more collisions, more ultraviolet, more light and more heat.
- Change the tube. T5, T8 and T12 differ in diameter, base and power; the physics is the same, and thin tubes are what a compact lamp bends and folds.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 350 });
      const ctl = kit.controls(box.side, [
        { id: 'ph', type: 'select', label: 'Phosphor on the wall', options: [['None: bare glass', 'none'], ['Triphosphor, warm white (2700 K)', 'cfl'], ['Triphosphor, neutral white (4000 K)', 'fluorescent']], value: params.ph || 'fluorescent' },
        { id: 'tube', type: 'select', label: 'Tube', options: [['T5: 16 mm, G5 base', 16], ['T8: 26 mm, G13 base', 26], ['T12: 38 mm, G13 base', 38]], value: params.tube || 26 },
        { id: 'I', label: 'Lamp current', min: 20, max: 100, step: 5, value: 70, unit: '%' }
      ], id => { if (id === 'tube') reset(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['tube', 'Tube and base'], ['uv', 'Ultraviolet made (254 nm)'], ['vis', 'Light out'], ['heat', 'Heat and infrared'], ['eff', 'Efficacy of the lamp alone'], ['col', 'Colour of the light']]);
      const spec = () => V.ph === 'none' ? HGVIS : Ph.spectrum(V.ph);
      const calc = memo();
      const model = () => calc(V.ph, () => {
        const sp = spec(), su = summarise(Ph, sp, 3000), sm = sampleSpec(sp, 380, 780, 80);
        const cdf = []; let acc = 0; for (const v of sm.vals) { acc += v; cdf.push(acc); }
        const vis = V.ph === 'none' ? 0.03 : 0.60 * 0.90 * 253.7 / su.mean;            // 60 % of the power becomes 254 nm light, the phosphor keeps 90 % of the photons and about 46 % of each photon's energy
        return { su, cdf, tot: acc, vis, uv: 0.60, col: colourOf(O, sp, su), rgb: Cl.css(lightRgb(Cl, sp)), eff: vis * su.ler };
      });
      let rand, E, A, Pn;                                          // electrons, mercury atoms, photons
      const geom = () => { const W = st.W, Hh = st.H, s = Hh * 0.30 / 38; return { x0: 54, x1: W - 54, cy: Hh * 0.29, r: s * V.tube / 2, s }; };
      function reset() {
        rand = rng(5); const G = geom(); E = []; A = []; Pn = [];
        for (let i = 0; i < 26; i++) E.push({ x: G.x0 + rand() * (G.x1 - G.x0), y: (rand() * 2 - 1) * G.r * 0.7 });
        for (let i = 0; i < 34; i++) A.push({ x: G.x0 + 40 + rand() * (G.x1 - G.x0 - 80), y: (rand() * 2 - 1) * G.r * 0.78, glow: 0 });
      }
      reset();
      function step(dt) {
        const G = geom(), M = model(), I = V.I / 100;
        for (const e of E) {
          e.x += (100 + 220 * I) * dt; e.y += (rand() - 0.5) * 60 * dt; e.y = clamp(e.y, -G.r * 0.8, G.r * 0.8);
          if (e.x > G.x1 - 18) { e.x = G.x0 + 22; e.y = (rand() * 2 - 1) * G.r * 0.7; }
        }
        for (const a of A) a.glow = Math.max(0, a.glow - dt * 3);
        // collisions: an electron meets a mercury atom, which sends out an ultraviolet photon
        if (rand() < 36 * I * dt) {
          const e = E[Math.floor(rand() * E.length)];
          let best = null, bd = 1e9; for (const a of A) { const d = Math.hypot(a.x - e.x, a.y - e.y); if (d < bd) { bd = d; best = a; } }
          if (best && bd < 70) {
            best.glow = 1; e.y += (rand() - 0.5) * 20;
            const sgn = rand() < 0.5 ? -1 : 1, an = (rand() * 2 - 1) * 1.0;
            if (Pn.length < 170) Pn.push({ x: best.x, y: best.y, vx: Math.sin(an) * 320, vy: sgn * Math.cos(an) * 320, k: 'uv' });
          }
        }
        const keep = [];
        for (const p of Pn) {
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.k === 'uv') {
            if (Math.abs(p.y) >= G.r - 2) {
              if (V.ph === 'none') { keep.push({ x: p.x, y: Math.sign(p.y) * G.r, vx: 0, vy: 0, k: 'abs', life: 0.25 }); continue; }
              // the phosphor re-emits a visible photon, outwards; the energy difference is heat
              let u = rand() * M.tot, i = 0; while (i < M.cdf.length - 1 && M.cdf[i] < u) i++;
              const nm = 380 + (i + 0.5) / M.cdf.length * 400;
              keep.push({ x: p.x, y: Math.sign(p.y) * G.r, vx: (rand() - 0.5) * 50, vy: Math.sign(p.y) * 190, k: 'vis', nm });
              keep.push({ x: p.x, y: Math.sign(p.y) * G.r, vx: (rand() - 0.5) * 30, vy: 0, k: 'heat', life: 0.5 });
              continue;
            }
            if (p.x < G.x0 || p.x > G.x1) continue;
          } else if (p.k === 'vis') { if (Math.abs(p.y) > G.r + 90) continue; }
          else { p.life -= dt; if (p.life <= 0) continue; }
          keep.push(p);
        }
        Pn = keep;
      }
      const budget = (c, C, x, y, w, label, parts) => {
        kit.label(c, label, x, y - 11, { size: 11.5, color: C.muted });
        let xx = x;
        for (const [name, share, fill] of parts) {
          const ww = w * share; if (ww < 0.5) continue;
          c.fillStyle = fill; c.fillRect(xx, y, ww, 20);
          if (ww > 90) kit.label(c, name + '  ' + fx(share * 100, share < 0.1 ? 1 : 0) + ' %', xx + ww / 2, y + 10, { align: 'center', size: 11, color: '#fff', weight: 650 });
          xx += ww;
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x, y, w, 20);
      };
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = model(), G = geom();
        if (dt > 0) step(dt);
        const { x0, x1, cy, r } = G;
        // the tube: glass, phosphor, end caps and cathodes
        c.fillStyle = C.dark ? 'rgba(130,190,255,0.07)' : 'rgba(60,130,220,0.06)'; c.fillRect(x0, cy - r, x1 - x0, 2 * r);
        c.strokeStyle = S.edge(); c.lineWidth = 2; c.strokeRect(x0, cy - r, x1 - x0, 2 * r);
        if (V.ph !== 'none') { c.fillStyle = M.rgb; c.globalAlpha = 0.9; c.fillRect(x0, cy - r + 2, x1 - x0, 4); c.fillRect(x0, cy + r - 6, x1 - x0, 4); c.globalAlpha = 1; }
        for (const side of [-1, 1]) {
          const ex = side < 0 ? x0 : x1, dir = side < 0 ? 1 : -1;
          c.fillStyle = C.dark ? '#39405f' : '#aab2cc'; c.fillRect(side < 0 ? ex - 22 : ex, cy - 0.45 * r - 4, 22, 0.9 * r + 8); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(side < 0 ? ex - 22 : ex, cy - 0.45 * r - 4, 22, 0.9 * r + 8);
          c.strokeStyle = '#f0902a'; c.lineWidth = 2; c.beginPath(); c.moveTo(ex + dir * 2, cy - 0.3 * r);
          for (let i = 1; i <= 6; i++) c.lineTo(ex + dir * (2 + i * 2.6), cy + (i % 2 ? 0.3 : -0.3) * r); c.stroke();
        }
        kit.label(c, 'cathode', x0 - 22, cy - r - 14, { size: 11, color: C.muted }); kit.label(c, 'cathode', x1 + 22, cy - r - 14, { align: 'right', size: 11, color: C.muted });
        // mercury atoms, electrons, photons
        for (const a of A) { const gl = a.glow; kit.dot(c, a.x, cy + a.y, 3.2 + 3 * gl, gl > 0.05 ? 'rgba(190,140,255,' + (0.35 + 0.65 * gl) + ')' : (C.dark ? 'rgba(200,205,225,0.55)' : 'rgba(80,85,100,0.5)')); }
        for (const e of E) kit.dot(c, e.x, cy + e.y, 2, '#59a8ff');
        for (const p of Pn) {
          if (p.k === 'uv') { c.strokeStyle = 'rgba(176,107,232,0.95)'; c.lineWidth = 1.5; c.setLineDash([3, 2]); c.beginPath(); const l = Math.hypot(p.vx, p.vy) || 1; c.moveTo(p.x, cy + p.y); c.lineTo(p.x - p.vx / l * 11, cy + p.y - p.vy / l * 11); c.stroke(); c.setLineDash([]); }
          else if (p.k === 'vis') { c.strokeStyle = S.nm(p.nm); c.lineWidth = 2.4; c.beginPath(); c.moveTo(p.x, cy + p.y); c.lineTo(p.x - p.vx / 190 * 8, cy + p.y - p.vy / 190 * 8); c.stroke(); }
          else if (p.k === 'heat') kit.dot(c, p.x, cy + p.y + 0, 2.2, 'rgba(230,80,60,0.8)');
          else { c.strokeStyle = 'rgba(176,107,232,0.8)'; c.lineWidth = 1.2; c.beginPath(); c.arc(p.x, cy + p.y, 6 * (1 - p.life * 2), 0, TAU); c.stroke(); }
        }
        kit.label(c, V.tube === 16 ? 'T5 tube, 16 mm' : V.tube === 26 ? 'T8 tube, 26 mm' : 'T12 tube, 38 mm', W / 2, cy + r + 20, { align: 'center', size: 12, color: C.muted });
        kit.label(c, 'electrons →', x0 + 40, cy - r - 14, { size: 11, color: '#59a8ff' });
        // where the power goes
        const bx = 54, bw = W - 108, by = Hh * 0.62;
        const ultra = M.uv, light = M.vis;
        budget(c, C, bx, by, bw, 'In the discharge: the electrical power becomes…', [['ultraviolet, 254 nm', ultra, 'rgba(150,90,200,0.85)'], ['heat: cathodes, gas, wall', 1 - ultra, 'rgba(210,90,60,0.75)']]);
        budget(c, C, bx, by + 54, bw, V.ph === 'none' ? 'Out of the tube: the glass blocks the ultraviolet…' : 'Out of the tube, after the phosphor…', [['visible light', light, C.accent], ['heat and infrared', 1 - light, 'rgba(210,90,60,0.75)']]);
        if (V.ph !== 'none') kit.label(c, 'each 254 nm photon (4.9 eV) gives one of about ' + fx(1239.84 / M.su.mean, 1) + ' eV: the phosphor keeps ' + fx(100 * 253.7 / M.su.mean, 0) + ' % of the energy', bx, by + 104, { size: 11.5, color: C.muted });
        ro.set('tube', V.tube === 16 ? 'T5, G5 (pins 5 mm apart); a 1150 mm tube takes 28 W' : V.tube === 26 ? 'T8, G13 (pins 12.7 mm apart); a 1200 mm tube takes 36 W' : 'T12, G13; a 1200 mm tube takes 40 W (old)');
        ro.set('uv', fx(ultra * 100, 0) + ' % of the power');
        ro.set('vis', fx(light * 100, light < 0.1 ? 1 : 0) + ' % of the power');
        ro.set('heat', fx((1 - light) * 100, 0) + ' %');
        ro.set('eff', fx(M.eff, 0) + ' lm/W  (' + fx(light * 100, 0) + ' % × ' + fx(M.su.ler, 0) + ' lm/W of radiation)');
        ro.set('col', M.col.text);
      }, box.stage);
      st.onResize(() => { reset(); loop.once(); });
      loop.start();
    }
  });

  /* ================================================================ an arc lamp from cold */
  const HID = {
    'metal-halide': { name: 'Metal halide lamp', phi0: 0.15, t90: 3.5, delay: 12, tauC: 1.8, restrike: 'about 10–20 min with a standard ignitor' },
    'mercury': { name: 'High-pressure mercury lamp', phi0: 0.20, t90: 5.5, delay: 5, tauC: 2.5, restrike: 'about 3–6 min' },
    'sodium-hp': { name: 'High-pressure sodium lamp', phi0: 0.15, t90: 4, delay: 1.5, tauC: 1.5, restrike: 'about 1–2 min' }
  };
  // light output and colour maturity of the lamp at a time after the power is first switched on (minutes)
  function hidAt(h, scen, t) {
    const tau = h.t90 / Math.log((1 - h.phi0) / 0.1), dip = scen === 'dip' ? 8 : Infinity, re = dip + h.delay;
    if (t < dip) return { phi: h.phi0 + (1 - h.phi0) * (1 - Math.exp(-t / tau)), f: 1 - Math.exp(-t / h.tauC), state: t < h.t90 ? 'starting: warming up' : 'running' };
    if (t < re) return { phi: 0, f: 0, state: 'out: the arc tube is too hot to re-ignite' };
    const w = t - re;
    return { phi: 0.35 + 0.65 * (1 - Math.exp(-w / (0.5 * tau))), f: 1 - 0.4 * Math.exp(-w / h.tauC), state: w < 0.8 * h.t90 ? 'restruck: warming up again' : 'running' };
  }
  Hyper.sim('la-hid-runup', {
    title: 'An arc lamp from cold: warm-up, colour and the wait for a hot restrike',
    blurb: `A high-intensity discharge lamp does not give its light at once. At first only the starting gas and the mercury glow, giving a dim bluish light; as the arc tube heats, the metal salts evaporate and the lamp reaches its full light and its real colour. If the mains is interrupted, the lamp goes out and **cannot be lit again** until the arc tube has cooled enough for its ignitor to break down the gas. The curve is a typical shape, not a measurement of one lamp.

**Try this**
- Press *Play* for a cold start of the metal halide lamp. Watch the light climb to 90 % in about three and a half minutes while the spectrum changes from mercury lines to the full set of salt lines.
- Compare the three lamps: the sodium lamp ends gold, the metal halide white, the mercury lamp bluish green.
- Choose *hot restrike*: the mains dips at minute 8. The lamp goes dark, and the metal halide lamp stays dark for about twelve minutes. This is why stadium lighting needs a standby lamp or special restrike lamps.
- Drag the time slider to any instant.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 380 });
      const ctl = kit.controls(box.side, [
        { id: 'lamp', type: 'select', label: 'Lamp', options: Object.keys(HID).map(k => [HID[k].name, k]), value: params.lamp || 'metal-halide' },
        { id: 'scen', type: 'select', label: 'Scenario', options: [['Cold start', 'cold'], ['Hot restrike: the mains dips at minute 8', 'dip']], value: params.scen || 'cold' },
        { id: 't', label: 'Time since switching on', min: 0, max: 30, step: 0.1, value: params.t != null ? params.t : 2, unit: 'min' },
        { type: 'buttons', items: [{ id: 'play', label: 'Play / pause', primary: true }, { id: 'again', label: 'Switch on again' }] }
      ], id => {
        if (id === 'play') { if (V.t >= 29.9) ctl.set('t', 0); playing = !playing; }
        else if (id === 'again') { ctl.set('t', 0); playing = true; }
        loop.once();
      });
      const V = ctl.values;
      let playing = false;
      const ro = kit.readout(box.side, [['time', 'Time'], ['state', 'State'], ['flux', 'Light output'], ['col', 'Colour of the light'], ['t90', 'Time to 90 % when cold'], ['re', 'Wait before a hot restrike']]);
      const specs = memo(), curve = memo();
      const specAt = f => specs(V.lamp + '|' + Math.round(f * 20), () => {
        // at the start the arc is the mercury and the starting gas; the salts join it as the arc tube warms
        const full = Ph.spectrum(V.lamp), start = Ph.spectrum('mercury'), q = Math.round(f * 20) / 20;
        const sp = V.lamp === 'mercury' ? full : (nm => (1 - q) * start(nm) + q * full(nm)), su = summarise(Ph, sp, 3000);
        return { sm: sampleSpec(sp, 380, 780, 120), col: colourOf(O, sp, su), rgb: lightRgb(Cl, sp) };
      });
      const pts = () => curve(V.lamp + '|' + V.scen, () => { const h = HID[V.lamp], a = []; for (let i = 0; i <= 300; i++) a.push(hidAt(h, V.scen, i / 10).phi); return a; });
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, h = HID[V.lamp];
        if (playing && dt > 0) { const t = Math.min(30, V.t + dt * 2); ctl.set('t', t); if (t >= 30) playing = false; }
        const now = hidAt(h, V.scen, V.t), SP = specAt(now.f), phi = now.phi;
        // the lamp: an outer bulb, the arc tube inside it, and the arc
        const lx = W * 0.2, ly = Hh * 0.18, R = Math.min(W * 0.12, Hh * 0.14);
        c.beginPath(); c.ellipse(lx, ly, R, R * 1.15, 0, 0, TAU); c.fillStyle = C.dark ? 'rgba(130,190,255,0.08)' : 'rgba(60,130,220,0.07)'; c.fill(); c.strokeStyle = S.edge(); c.lineWidth = 1.6; c.stroke();
        c.fillStyle = C.dark ? '#39405f' : '#aab2cc'; c.fillRect(lx - R * 0.42, ly + R * 1.1, R * 0.84, R * 0.55); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(lx - R * 0.42, ly + R * 1.1, R * 0.84, R * 0.55);
        const halo = c.createRadialGradient(lx, ly, 0, lx, ly, R * 1.3);
        halo.addColorStop(0, Cl.css(SP.rgb, 0.75 * phi)); halo.addColorStop(1, Cl.css(SP.rgb, 0)); c.fillStyle = halo; c.fillRect(lx - R * 1.4, ly - R * 1.4, R * 2.8, R * 2.8);
        c.beginPath(); c.ellipse(lx, ly, R * 0.5, R * 0.2, 0, 0, TAU); c.strokeStyle = C.dark ? 'rgba(220,225,245,0.8)' : 'rgba(40,50,80,0.8)'; c.lineWidth = 1.4; c.stroke();
        if (phi > 0.01) { c.strokeStyle = Cl.css(SP.rgb, 0.35 + 0.65 * phi); c.lineWidth = 2 + 4 * phi; c.lineCap = 'round'; c.beginPath(); c.moveTo(lx - R * 0.34, ly); c.lineTo(lx + R * 0.34, ly); c.stroke(); c.lineCap = 'butt'; }
        kit.label(c, h.name, lx, ly + R * 1.65 + 16, { align: 'center', size: 12.5, weight: 650 }); kit.label(c, 'arc tube inside the outer bulb', lx, ly + R * 1.65 + 32, { align: 'center', size: 11, color: C.muted });
        // the spectrum now
        const r = { x: W * 0.42, y: 38, w: W * 0.54, h: Hh * 0.26 };
        drawSpec(c, C, S, kit, r, 380, 780, SP.sm.vals, { eye: nm => Ph.V(nm) });
        kit.label(c, 'spectrum now (its shape; the brightness is in the graph below)', r.x, 20, { size: 11.5, color: C.muted });
        // the run-up curve with a cursor
        const gx = 48, gy = Hh * 0.52, gw = W - 48 - 20, gh = Hh * 0.34, X = t => gx + t / 30 * gw, Y = p => gy + gh - p * gh;
        c.fillStyle = C.dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; c.fillRect(gx, gy, gw, gh);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); for (let p = 0; p <= 1.001; p += 0.25) { c.moveTo(gx, Y(p)); c.lineTo(gx + gw, Y(p)); } c.stroke();
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx, gy + gh); c.lineTo(gx + gw, gy + gh); c.stroke();
        for (let t = 0; t <= 30; t += 5) { c.beginPath(); c.moveTo(X(t), gy + gh); c.lineTo(X(t), gy + gh + 4); c.stroke(); kit.label(c, String(t), X(t), gy + gh + 14, { align: 'center', size: 10.5, color: C.faint }); }
        for (const p of [0, 0.5, 1]) kit.label(c, Math.round(p * 100) + ' %', gx - 6, Y(p), { align: 'right', size: 10.5, color: C.faint });
        kit.label(c, 'minutes since the power was switched on', gx + gw, gy + gh + 28, { align: 'right', size: 11, color: C.muted });
        kit.label(c, 'light output, % of full', gx, gy - 10, { size: 11.5, color: C.muted });
        const A = pts();
        c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath(); A.forEach((p, i) => { const x = X(i / 10), y = Y(p); if (i) c.lineTo(x, y); else c.moveTo(x, y); }); c.stroke();
        if (V.scen === 'dip') { c.strokeStyle = C.warn; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(8), gy); c.lineTo(X(8), gy + gh); c.stroke(); c.setLineDash([]); kit.label(c, 'mains dips', X(8) + 4, gy + 10, { size: 11, color: C.warn }); kit.label(c, 'dark', X(8 + h.delay / 2), Y(0.12), { align: 'center', size: 11.5, color: C.muted }); }
        c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.moveTo(X(V.t), gy); c.lineTo(X(V.t), gy + gh); c.stroke();
        kit.dot(c, X(V.t), Y(phi), 5, C.accent, C.text);
        const m = Math.floor(V.t), s = Math.round((V.t - m) * 60);
        ro.set('time', m + ' min ' + String(s === 60 ? 59 : s).padStart(2, '0') + ' s');
        ro.set('state', now.state);
        ro.set('flux', fx(phi * 100, 0) + ' % of full output');
        ro.set('col', phi < 0.01 ? 'dark' : SP.col.text);
        ro.set('t90', fx(h.t90, 1) + ' min (typical)');
        ro.set('re', h.restrike);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ xenon flash tube and short arc */
  Hyper.sim('la-flash', {
    title: 'Xenon: the flash of a capacitor, and the steady blaze of a short arc',
    blurb: `A **flash tube** is a capacitor emptied through xenon. The energy stored is ½CV²; the tube turns about 45 lumen-seconds of light out of every joule, and the pulse lasts about a millisecond at full power, or tens of microseconds when the electronics cut it short for a low power setting. A **short-arc lamp** is the same gas in a heavy quartz bulb with the arc kept burning: a tiny, intense, daylight-coloured source for cinema projectors. The pulse shape is a schematic model, scaled to typical speedlight figures.

**Try this**
- At full power read the energy (a little over 40 J with the defaults), the light of one flash and the pulse length. Then step down to 1/16 and 1/128: the light falls in step, and the pulse gets shorter, which is how a flash freezes motion at low power.
- Raise the capacitor to 3000 µF, or the voltage to 450 V: the energy goes as V², so the voltage is much the stronger control.
- Press *Fire* to see one flash, slowed down 1000 times.
- Switch to the short-arc lamp: the light follows the power, about 30–40 lm/W, and its spectrum is the same daylight-like continuum with infrared lines.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const flashL = O.LAMPS.find(l => l.id === 'flash'), arcL = O.LAMPS.find(l => l.id === 'xenon');
      const ETA = (flashL.efficacy[0] + flashL.efficacy[1]) / 2, ETAARC = (arcL.efficacy[0] + arcL.efficacy[1]) / 2;
      const SHARES = [['1/1 (full power)', 1], ['1/2', 1 / 2], ['1/4', 1 / 4], ['1/8', 1 / 8], ['1/16', 1 / 16], ['1/32', 1 / 32], ['1/64', 1 / 64], ['1/128', 1 / 128]];
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Lamp', options: [['Flash tube (photography, strobes, laser pumping)', 'flash'], ['Short-arc lamp (cinema projector)', 'arc']], value: params.kind || 'flash' },
        { id: 'C', label: 'Capacitor', min: 100, max: 3000, value: 800, log: true, sig: 3, unit: 'µF' },
        { id: 'U', label: 'Capacitor voltage', min: 200, max: 450, step: 5, value: 330, unit: 'V' },
        { id: 'share', type: 'select', label: 'Power setting', options: SHARES, value: 1 },
        { id: 'P', label: 'Electrical power of the arc', min: 500, max: 7000, step: 100, value: 3000, unit: 'W' },
        { type: 'buttons', items: [{ id: 'fire', label: 'Fire (slowed 1000×)', primary: true }] }
      ], id => { if (id === 'fire') fired = 0; vis(); loop.once(); });
      const V = ctl.values;
      let fired = 99;
      const vis = () => { const f = V.kind === 'flash'; ctl.show('C', f); ctl.show('U', f); ctl.show('share', f); ctl.show('P', !f); ctl.show('fire', f); };
      vis();
      const ro = kit.readout(box.side, [['e', 'Energy released'], ['q', 'Light of one flash'], ['t5', 'Pulse length above half the peak'], ['t1', 'Pulse length above a tenth of the peak'], ['pk', 'Peak luminous flux'], ['col', 'Colour of the light']]);
      const plot = kit.plot(gb, { x: { label: 'time (ms)', min: 0, name: 't' }, y: { label: 'light (million lm)', min: 0, name: 'Φ' } }, 190);
      const spec = Ph.spectrum('xenon'), su = summarise(Ph, spec, 3000), col = colourOf(O, spec, su), sm = sampleSpec(spec, 380, 1000, 150), rgb = lightRgb(Cl, spec);
      const calc = memo();
      const pulse = () => calc([V.kind, Math.round(V.C), V.U, V.share, V.P].join('|'), () => {
        if (V.kind === 'arc') return { arc: true, flux: V.P * ETAARC };
        const E = 0.5 * V.C * 1e-6 * V.U * V.U * V.share, Q = ETA * E, tau = 1.0e-3 * Math.sqrt(V.C / 800) * Math.pow(V.share, 0.9), tr = tau / 10;
        const f = t => Math.exp(-t / tau) - Math.exp(-t / tr), area = tau - tr, flux = t => Q * f(t) / area;
        const N = 300, tEnd = 6 * tau, d = [], pk = 0.7742 * Q / tau;
        for (let i = 0; i <= N; i++) { const t = tEnd * i / N; d.push([t * 1000, flux(t) / 1e6]); }
        let t5 = 0, t1 = 0; for (let i = 0; i <= N; i++) { const v = d[i][1] * 1e6; if (v >= 0.5 * pk) t5 = d[i][0]; if (v >= 0.1 * pk) t1 = d[i][0]; }
        const first5 = d.find(p => p[1] * 1e6 >= 0.5 * pk), first1 = d.find(p => p[1] * 1e6 >= 0.1 * pk);
        return { E, Q, tau, pk, tEnd, d, t5: t5 - (first5 ? first5[0] : 0), t1: t1 - (first1 ? first1[0] : 0), stored: 0.5 * V.C * 1e-6 * V.U * V.U };
      });
      const eng = (v, u) => v >= 1e6 ? fx(v / 1e6, 2) + ' M' + u : v >= 1e3 ? fx(v / 1e3, 1) + ' k' + u : fx(v, 0) + ' ' + u;
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = pulse();
        if (dt > 0) fired += dt;
        // the device
        const tx = W * 0.05, tw = W * 0.40, ty = Hh * 0.46;
        let glow = 0;
        if (M.arc) glow = 0.55 + 0.45 * (V.P - 500) / 6500;
        else if (fired < 2.2) glow = Math.max(0, (Math.exp(-fired / 0.25) - Math.exp(-fired / 0.025)) / 0.697);
        c.strokeStyle = S.edge(); c.lineWidth = 2;
        if (M.arc) { c.beginPath(); c.ellipse(tx + tw / 2, ty, Hh * 0.19, Hh * 0.26, 0, 0, TAU); c.fillStyle = C.dark ? 'rgba(130,190,255,0.09)' : 'rgba(60,130,220,0.07)'; c.fill(); c.stroke(); c.fillStyle = C.dark ? '#c9cfdf' : '#5b6170'; c.fillRect(tx + tw / 2 - 3, ty - Hh * 0.30, 6, Hh * 0.15); c.fillRect(tx + tw / 2 - 5, ty + Hh * 0.15, 10, Hh * 0.15); }
        else { c.beginPath(); c.moveTo(tx + 30, ty - Hh * 0.17); c.bezierCurveTo(tx + tw * 0.35, ty - Hh * 0.30, tx + tw * 0.65, ty + Hh * 0.30, tx + tw - 10, ty + Hh * 0.17); c.strokeStyle = 'rgba(160,190,230,0.9)'; c.lineWidth = 9; c.stroke(); }
        const halo = c.createRadialGradient(tx + tw / 2, ty, 0, tx + tw / 2, ty, Hh * 0.42);
        halo.addColorStop(0, Cl.css(rgb, 0.85 * glow)); halo.addColorStop(1, Cl.css(rgb, 0)); c.fillStyle = halo; c.fillRect(tx - 20, ty - Hh * 0.45, tw + 40, Hh * 0.9);
        if (!M.arc) { c.strokeStyle = Cl.css(rgb, 0.4 + 0.6 * glow); c.lineWidth = 3 + 5 * glow; c.beginPath(); c.moveTo(tx + 30, ty - Hh * 0.17); c.bezierCurveTo(tx + tw * 0.35, ty - Hh * 0.30, tx + tw * 0.65, ty + Hh * 0.30, tx + tw - 10, ty + Hh * 0.17); c.stroke(); }
        kit.label(c, M.arc ? 'short-arc lamp: two electrodes a few millimetres apart in xenon' : 'flash tube in xenon, fired by a trigger pulse of a few kilovolts', tx + tw / 2, Hh * 0.08, { align: 'center', size: 11.5, color: C.muted });
        if (!M.arc) { kit.label(c, 'C = ' + fx(V.C, 0) + ' µF, ' + V.U + ' V:  ½CV² = ' + fx(M.stored, 1) + ' J stored', tx + tw / 2, Hh * 0.9, { align: 'center', size: 12, color: C.text, weight: 600 }); }
        else kit.label(c, fx(V.P, 0) + ' W of electrical power, kept burning', tx + tw / 2, Hh * 0.9, { align: 'center', size: 12, weight: 600 });
        // the spectrum
        const r = { x: W * 0.54, y: 34, w: W * 0.42, h: Hh * 0.50 };
        drawSpec(c, C, S, kit, r, 380, 1000, sm.vals, { eye: nm => Ph.V(nm) });
        kit.label(c, 'xenon: a daylight-like continuum with infrared lines', r.x, 18, { size: 11.5, color: C.muted });
        if (M.arc) {
          plot.set({ x: { label: 'electrical power (kW)', min: 0.5, max: 7, name: 'P' }, y: { label: 'light (thousand lm)', min: 0, max: 7 * ETAARC * 1.05, name: 'Φ' }, series: [{ pts: [[0.5, 0.5 * ETAARC], [7, 7 * ETAARC]], label: 'at ' + fx(ETAARC, 0) + ' lm/W' }], marks: [{ x: V.P / 1000, y: M.flux / 1000, label: fx(M.flux / 1000, 0) + ' klm' }] });
          ro.set('e', fx(V.P, 0) + ' W, continuous'); ro.set('q', 'a steady ' + eng(M.flux, 'lm')); ro.set('t5', 'steady'); ro.set('t1', 'steady'); ro.set('pk', eng(M.flux, 'lm') + ' (steady)'); ro.set('col', col.text);
        } else {
          plot.set({ x: { label: 'time (ms)', min: 0, max: M.tEnd * 1000, name: 't' }, y: { label: 'light (million lm)', min: 0, name: 'Φ' }, series: [{ pts: M.d, label: 'one flash' }], marks: [] });
          ro.set('e', fx(M.E, 1) + ' J  (' + fx(M.E / M.stored * 100, 0) + ' % of the stored energy)');
          ro.set('q', fx(M.Q, 0) + ' lm·s  (at ' + fx(ETA, 0) + ' lm·s per J)');
          ro.set('t5', fx(M.t5, M.t5 < 0.1 ? 3 : 2) + ' ms  (1/' + Math.round(1000 / Math.max(M.t5, 1e-3)) + ' s)');
          ro.set('t1', fx(M.t1, M.t1 < 0.1 ? 3 : 2) + ' ms  (1/' + Math.round(1000 / Math.max(M.t1, 1e-3)) + ' s)');
          ro.set('pk', eng(M.pk, 'lm'));
          ro.set('col', col.text);
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ the LED junction */
  // typical materials: wavelength at 25 °C, width (FWHM), drift of the wavelength with the junction temperature (nm/K), the temperature
  // constant T1 of the light output (exp(−ΔT/T1)), the forward voltage, the share of light that escapes the chip, and the recombination
  // coefficients of the ABC model (A: defects, B: radiative, C: Auger), in s⁻¹, cm³/s and cm⁶/s
  const LEDM = [
    { id: 'uv', name: 'InGaN on GaN: near ultraviolet, 365 nm', lam: 365, w: 12, dl: 0.03, T1: 700, Vf: 3.5, ext: 0.75, A: 2e7, B: 1.5e-11, C: 1e-30 },
    { id: 'blue', name: 'InGaN: blue, 450 nm', lam: 450, w: 22, dl: 0.04, T1: 900, Vf: 3.0, ext: 0.80, A: 1e7, B: 2e-11, C: 1e-30 },
    { id: 'green', name: 'InGaN: green, 525 nm', lam: 525, w: 35, dl: 0.04, T1: 450, Vf: 3.2, ext: 0.80, A: 3e7, B: 1.2e-11, C: 1.5e-30 },
    { id: 'amber', name: 'AlGaInP: amber, 590 nm', lam: 590, w: 17, dl: 0.12, T1: 85, Vf: 2.1, ext: 0.55, A: 1e7, B: 2e-11, C: 1e-31 },
    { id: 'red', name: 'AlGaInP: red, 630 nm', lam: 630, w: 18, dl: 0.12, T1: 125, Vf: 2.0, ext: 0.55, A: 1e7, B: 2e-11, C: 1e-31 },
    { id: 'ir', name: 'AlGaAs: infrared, 850 nm', lam: 850, w: 40, dl: 0.25, T1: 250, Vf: 1.5, ext: 0.45, A: 1e7, B: 2e-11, C: 1e-31 }
  ];
  const ABC_D = 5e-7;                                          // active layer, 5 nm in cm
  // internal quantum efficiency at a current density J (A/cm²): solve J = q d (A n + B n² + C n³) for the carrier density n
  function iqe(m, J) {
    const f = n => 1.602e-19 * ABC_D * (m.A * n + m.B * n * n + m.C * n * n * n);
    let lo = 12, hi = 22;
    for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (f(Math.pow(10, mid)) < J) lo = mid; else hi = mid; }
    const n = Math.pow(10, (lo + hi) / 2);
    return m.B * n * n / (m.A * n + m.B * n * n + m.C * n * n * n);
  }
  Hyper.sim('la-led', {
    title: 'The LED junction: the gap sets the colour, heat and current set the rest',
    blurb: `In forward bias electrons from the n side and holes from the p side meet in the thin active layer and **recombine**; each pair gives one photon of energy about equal to the band gap, so λ = hc/E_g. The material fixes the colour. Heat moves and broadens the band and lowers the efficiency; at high current the efficiency falls too (**droop**). The graph below is a simple ABC model with typical coefficients: its shape, not any one chip's numbers.

**Try this**
- Step through the materials: a wider gap, a shorter wavelength. The photon energy is the gap, and the forward voltage is a little above gap ÷ e.
- Raise the junction temperature to 120 °C. The red AlGaInP chip loses about half its light and drifts to longer wavelengths; the blue InGaN chip loses a tenth. This is why red and amber in a white-and-colour mix need extra care.
- Move the current density from 5 to 200 A/cm². The efficiency peaks at modest current and then droops: more light, but a larger share of it as heat.
- Compare the band width with the thermal limit of 1.8 kT: real chips are somewhat wider.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Material and colour', options: LEDM.map(m => [m.name, m.id]), value: params.mat || 'blue' },
        { id: 'Tj', label: 'Junction temperature', min: 25, max: 150, step: 5, value: params.Tj || 25, unit: '°C' },
        { id: 'J', label: 'Current density', min: 0.5, max: 200, value: params.J || 20, log: true, sig: 3, unit: 'A/cm²' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eg', 'Band gap Eg = hc/λ'], ['lam', 'Peak wavelength'], ['fwhm', 'Width of the band (FWHM)'], ['vf', 'Forward voltage'], ['light', 'Light, against 25 °C at this current'], ['wpe', 'Wall-plug efficiency'], ['heat', 'Share of the power that is heat']]);
      const plot = kit.plot(gb, { x: { label: 'current density (A/cm²)', log: true, min: 0.5, max: 200, name: 'J' }, y: { label: 'wall-plug efficiency (%)', min: 0, max: 100, name: 'η' }, legend: true }, 180);
      const calc = memo();
      const mat = () => LEDM.find(m => m.id === V.mat) || LEDM[1];
      const therm = (m, T) => Math.exp(-(T - 25) / m.T1);
      const wpeOf = (m, J, T) => iqe(m, J) * m.ext * (1239.84 / m.lam) / m.Vf * therm(m, T);
      const curves = () => calc(V.mat + '|' + V.Tj, () => {
        const m = mat(), a = [], b = [];
        for (let i = 0; i <= 44; i++) { const J = 0.5 * Math.pow(400, i / 44); a.push([J, 100 * wpeOf(m, J, 25)]); b.push([J, 100 * wpeOf(m, J, V.Tj)]); }
        return { a, b };
      });
      const gauss = (nm, mu, fwhm) => g(nm, mu, fwhm / 2.3548);
      const NM0 = 300, NM1 = 950, NS = 260;
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, m = mat(), tt = t || 0;
        const Eg = 1239.84 / m.lam, lamT = m.lam + m.dl * (V.Tj - 25), wT = m.w * (V.Tj + 273.15) / 298.15;
        // the band diagram
        const bx = 20, by = 34, bw = W * 0.40, bh = Hh * 0.62, cx = bx + bw / 2;
        const gap = bh * (0.12 + 0.52 * Eg / 3.5), yc = by + bh * 0.08, yv = yc + gap, mid = (yc + yv) / 2;
        c.fillStyle = C.dark ? 'rgba(89,168,255,0.07)' : 'rgba(40,110,220,0.06)'; c.fillRect(cx, by, bw / 2, bh);
        c.fillStyle = C.dark ? 'rgba(240,144,42,0.07)' : 'rgba(210,110,20,0.06)'; c.fillRect(bx, by, bw / 2, bh);
        c.strokeStyle = C.text; c.lineWidth = 2.2;
        c.beginPath(); c.moveTo(bx, yc); c.lineTo(bx + bw, yc); c.moveTo(bx, yv); c.lineTo(bx + bw, yv); c.stroke();
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(cx, by); c.lineTo(cx, by + bh); c.stroke(); c.restore();
        kit.label(c, 'conduction band', bx + 4, yc - 9, { size: 11, color: C.muted }); kit.label(c, 'valence band', bx + 4, yv + 12, { size: 11, color: C.muted });
        kit.label(c, 'p side: holes', bx + bw * 0.25, by + bh + 14, { align: 'center', size: 11.5, color: '#f0902a' }); kit.label(c, 'n side: electrons', bx + bw * 0.75, by + bh + 14, { align: 'center', size: 11.5, color: '#59a8ff' });
        kit.arrow(c, bx + bw - 26, yv - 3, bx + bw - 26, yc + 3, C.accent, 1.4, 7); kit.arrow(c, bx + bw - 26, yc + 3, bx + bw - 26, yv - 3, C.accent, 1.4, 7);
        kit.label(c, 'Eg = ' + fx(Eg, 2) + ' eV', bx + bw - 32, mid, { align: 'right', size: 12, weight: 650 });
        for (let i = 0; i < 4; i++) {
          const ph = (tt * 0.45 + i / 4) % 1, ex = bx + bw - 14 - (bw / 2 - 14) * ph, hx = bx + 14 + (bw / 2 - 14) * ph;
          kit.dot(c, ex, yc + 7, 4.2, '#59a8ff'); c.beginPath(); c.arc(hx, yv - 7, 4.2, 0, TAU); c.strokeStyle = '#f0902a'; c.lineWidth = 2; c.stroke();
          if (ph > 0.9) { c.beginPath(); c.arc(cx, mid, 12 * (ph - 0.9) / 0.1, 0, TAU); c.strokeStyle = S.nm(lamT, 0.8); c.lineWidth = 2; c.stroke(); }
        }
        S.wave(c, cx + 8, mid, cx + bw * 0.46, by + 6, { wavelength: 12 + 4 * Math.min(1, lamT / 700), amp: 5, phase: tt * 9, nm: lamT, width: 2.2 });
        kit.label(c, 'photon, ' + fx(lamT, 0) + ' nm', cx + bw * 0.46, by + 20, { align: 'right', size: 11.5, color: C.muted });
        // the spectrum at the junction temperature, with the cold one as an outline
        const r = { x: W * 0.50, y: 38, w: W * 0.47, h: Hh * 0.50 }, ar = therm(m, V.Tj), cold = m.w;
        const vals = [], base = [];
        for (let i = 0; i < NS; i++) { const nm = NM0 + (i + 0.5) / NS * (NM1 - NM0); vals.push(ar * (cold / wT) * gauss(nm, lamT, wT)); base.push(gauss(nm, m.lam, cold)); }
        const X = drawSpec(c, C, S, kit, r, NM0, NM1, vals, { eye: nm => O.photo.V(nm) });
        c.save(); c.setLineDash([3, 3]); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath();
        for (let i = 0; i < NS; i++) { const x = r.x + (i + 0.5) / NS * r.w, y = r.y + r.h - base[i] * r.h; if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke(); c.restore();
        kit.label(c, 'dashed: at 25 °C;  filled: at ' + V.Tj + ' °C', r.x, 20, { size: 11.5, color: C.muted });
        // the numbers
        const wpe = wpeOf(m, V.J, V.Tj), thermal = 1.8 * 8.617e-5 * (V.Tj + 273.15) * lamT * lamT / 1239.84;
        const P = curves();
        plot.set({ series: [{ pts: P.a, label: 'at 25 °C', dash: true }, { pts: P.b, label: 'at ' + V.Tj + ' °C' }], marks: [{ x: V.J, y: 100 * wpe, label: fx(100 * wpe, 0) + ' %' }] });
        ro.set('eg', fx(Eg, 2) + ' eV  (' + fx(m.lam, 0) + ' nm at 25 °C)');
        ro.set('lam', fx(lamT, 1) + ' nm  (' + (m.dl >= 0 ? '+' : '') + fx(m.dl, 2) + ' nm per K)');
        ro.set('fwhm', fx(wT, 0) + ' nm  (thermal limit 1.8 kT: ' + fx(thermal, 0) + ' nm)');
        ro.set('vf', fx(m.Vf, 1) + ' V  (Eg/e = ' + fx(Eg, 2) + ' V)');
        ro.set('light', fx(100 * therm(m, V.Tj), 0) + ' %');
        ro.set('wpe', fx(100 * wpe, 0) + ' %  (efficiency of the chip: ' + fx(100 * iqe(m, V.J), 0) + ' % inside, ' + fx(100 * m.ext, 0) + ' % escapes)');
        ro.set('heat', fx(100 * (1 - wpe), 0) + ' %');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ---- ten surfaces under a lamp: schematic reflectance curves, chromatic adaptation and a colour-shift score ---- */
  const PATCHES = [
    ['white paper', nm => 0.88], ['grey card', nm => 0.35],
    ['red', nm => 0.14 + 0.46 * sg((nm - 600) / 16)], ['orange', nm => 0.17 + 0.45 * sg((nm - 580) / 18)], ['yellow', nm => 0.20 + 0.50 * sg((nm - 552) / 16)],
    ['green', nm => 0.14 + 0.24 * g(nm, 540, 40)], ['cyan', nm => 0.14 + 0.28 * g(nm, 495, 45)], ['blue', nm => 0.14 + 0.30 * g(nm, 450, 35)],
    ['magenta', nm => 0.15 + 0.22 * g(nm, 440, 35) + 0.34 * sg((nm - 600) / 18)], ['skin', nm => 0.28 + 0.32 * sg((nm - 580) / 35)]
  ];
  const DEEPRED = nm => 0.03 + 0.80 * sg((nm - 620) / 8);       // the saturated red of the special index R9
  const BRAD = [[0.8951, 0.2664, -0.1614], [-0.7502, 1.7135, 0.0367], [0.0389, -0.0685, 1.0296]];
  const BRADI = [[0.9869929, -0.1470543, 0.1599627], [0.4323053, 0.5183603, 0.0492912], [-0.0085287, 0.0400428, 0.9684867]];
  const mv3 = (M, v) => M.map(r => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
  // chromatic adaptation (Bradford): the colour xyz as seen by an eye adapted to white w1, as it would look to an eye adapted to w2
  function adaptXYZ(xyz, w1, w2) { const a = mv3(BRAD, w1), b = mv3(BRAD, w2), v = mv3(BRAD, xyz); return mv3(BRADI, [v[0] * b[0] / a[0], v[1] * b[1] / a[1], v[2] * b[2] / a[2]]); }
  // the whole set: the light as { cct, white … }, ten surfaces under it and under the reference light, the score and R9
  let CMFT = null;                                              // the colour-matching functions on the table of wavelengths used below
  const DEEP = ['deep red', DEEPRED];
  function renderSet(O, spec, su) {
    const Ph = O.photo, Cl = O.colour, col = colourOf(O, spec, su);
    // everything is summed on one table of wavelengths (380 to 780 nm in steps of 2 nm), so that a change of lamp costs little
    if (!CMFT) {
      CMFT = []; for (let nm = 380; nm <= 780; nm += 2) CMFT.push(Cl.cmf(nm));
      for (const p of PATCHES.concat([DEEP])) { p.arr = []; for (let nm = 380; nm <= 780; nm += 2) p.arr.push(p[1](nm)); }
    }
    const Tref = col.white ? col.cct : 6500, sArr = [], rArr = [];
    for (let nm = 380; nm <= 780; nm += 2) { sArr.push(spec(nm)); rArr.push(Ph.planck(nm, Tref)); }
    const sum = (arr, rho) => { let X = 0, Y = 0, Z = 0; for (let i = 0; i < arr.length; i++) { const v = arr[i] * (rho ? rho[i] : 1), m = CMFT[i]; X += v * m[0]; Y += v * m[1]; Z += v * m[2]; } return [X, Y, Z]; };
    const yS = sum(sArr)[1], yR = sum(rArr)[1];
    const tri = (arr, y, rho) => sum(arr, rho).map(v => v / y);
    const wL = tri(sArr, yS), wR = tri(rArr, yR), D65 = Cl.white;
    const show = (xyz, scale) => Cl.css(Cl.fit(Cl.toRgb(xyz.map(v => v * scale))));
    const k = 1 / 0.88;
    const one = p => {
      const raw = tri(sArr, yS, p.arr), rawRef = tri(rArr, yR, p.arr), ad = adaptXYZ(raw, wL, wR), dE = Cl.deltaE(Cl.lab(ad, wR), Cl.lab(rawRef, wR));
      return { name: p[0], rho: p[1], dE, lampAd: show(adaptXYZ(raw, wL, D65), k), lampRaw: show(raw, k), refAd: show(adaptXYZ(rawRef, wR, D65), k), refRaw: show(rawRef, k) };
    };
    const items = PATCHES.map(one), coloured = items.slice(2), deep = one(DEEP);
    const ra = 100 - 4.6 * coloured.reduce((t, p) => t + p.dE, 0) / coloured.length;
    let worst = coloured[0]; for (const p of coloured) if (p.dE > worst.dE) worst = p;
    return { col, Tref, items, ra, r9: 100 - 4.6 * deep.dE, worst };
  }
  const scoreText = v => v <= 0 ? '0 or below (the scale ends)' : fx(v, 0);

  /* ================================================================ white from a blue chip and a phosphor, or from three LEDs */
  const YELLOWPH = nm => 0.35 * gn(nm, 530, 45) + 0.65 * gn(nm, 580, 55), REDPH = nm => gn(nm, 625, 33);
  // a phosphor-converted white LED as a spectrum function: c is the share of the blue converted, r the share of that going to the red phosphor
  // (quantum efficiency of the yellow phosphor 95 %, of the red 85 %; each photon keeps lp/λ of its energy)
  const pcLed = (c, r, lp) => nm => (1 - c) * gn(nm, lp, 9) + c * ((1 - r) * 0.95 * (lp / 565) * YELLOWPH(nm) + r * 0.85 * (lp / 625) * REDPH(nm));
  const rgbLed = (R, G, B) => nm => R * gn(nm, 630, 8) + G * gn(nm, 525, 17) + B * gn(nm, 460, 10);
  const WHITES = [['2700 K', 0.97, 0.51], ['3000 K', 0.96, 0.44], ['4000 K', 0.91, 0.28], ['5000 K', 0.86, 0.17], ['6500 K', 0.81, 0.06]];
  const BINS = [2700, 3000, 3500, 4000, 4500, 5000, 5700, 6500];
  Hyper.sim('la-white-led', {
    title: 'White LEDs: a blue chip under a phosphor, or red, green and blue together',
    blurb: `Most white LEDs are a **blue chip** under a layer of phosphor. Some blue passes through; the rest is absorbed and re-emitted as a broad yellow (and, for a warmer, truer white, red). The more of the blue is converted, the warmer the light. The alternative is to mix **three LEDs**, which wastes nothing in conversion but has gaps in its spectrum. The diagram shows where the light sits against the Planckian locus; the rendering figures use ten schematic surfaces (see the next page) and are our own simplified versions of CRI and R9.

**Try this**
- Press the **2700 K**, **4000 K** and **6500 K** buttons and watch the spectrum, the point on the locus and the efficacy. The warm lamp is the least efficient: more of its light has gone through a Stokes loss, and red light is less visible.
- Press **4000 K**, then take the red phosphor to zero: the point leaves the locus, because a yellow phosphor alone cannot make a warm white. Lower the conversion until the point is back on the locus: it ends near 6000–7000 K, and R9 collapses. A warm white with good reds needs the red phosphor.
- Switch to *three LEDs* and tune R, G and B to bring the point onto the locus. The rendering is poor: three narrow bands leave most of the spectrum empty.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'How the white is made', options: [['Blue chip and phosphor', 'pc'], ['Three LEDs: red, green, blue', 'rgb']], value: params.mode || 'pc' },
        { id: 'c', label: 'Blue converted by the phosphor', min: 40, max: 100, step: 1, value: params.c || 91, unit: '%' },
        { id: 'r', label: 'Share of it going to a red phosphor', min: 0, max: 70, step: 1, value: params.r != null ? params.r : 28, unit: '%' },
        { id: 'lp', label: 'Wavelength of the blue chip', min: 440, max: 460, step: 1, value: 450, unit: 'nm' },
        { id: 'R', label: 'Red LED, 630 nm', min: 0, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'G', label: 'Green LED, 525 nm', min: 0, max: 100, step: 1, value: 70, unit: '%' },
        { id: 'B', label: 'Blue LED, 460 nm', min: 0, max: 100, step: 1, value: 25, unit: '%' },
        { type: 'buttons', items: WHITES.map((w, i) => ({ id: 'w' + i, label: w[0] })) }
      ], id => {
        if (/^w\d$/.test(id)) { const w = WHITES[+id.slice(1)]; ctl.set('mode', 'pc'); ctl.set('c', Math.round(w[1] * 100)); ctl.set('r', Math.round(w[2] * 100)); ctl.set('lp', 450); }
        vis(); loop.once();
      });
      const V = ctl.values;
      const vis = () => { const pc = V.mode === 'pc'; for (const k of ['c', 'r', 'lp']) ctl.show(k, pc); for (const k of ['R', 'G', 'B']) ctl.show(k, !pc); };
      vis();
      const ro = kit.readout(box.side, [['col', 'Colour of the light'], ['ler', 'Efficacy of the radiation'], ['eff', 'Efficacy of the package (estimate)'], ['ra', 'Rendering score (simplified Ra)'], ['r9', 'Red rendering (simplified R9)'], ['bin', 'Nearest nominal bin']]);
      // the chromaticity diagram: the spectral locus and the Planckian locus, computed once
      const locus = [], planck = [];
      for (let nm = 400; nm <= 700; nm += 10) locus.push(Cl.locus(nm));
      for (let T = 1500; T <= 12000; T *= 1.12) planck.push([T, Cl.planckXY(T)]);
      const marks = [2700, 4000, 6500].map(T => [T, Cl.planckXY(T)]);
      const calc = memo();
      const model = () => calc(V.mode === 'pc' ? ['pc', V.c, V.r, V.lp].join('|') : ['rgb', V.R, V.G, V.B].join('|'), () => {
        const pc = V.mode === 'pc', spec = pc ? pcLed(V.c / 100, V.r / 100, V.lp) : rgbLed(V.R / 100, V.G / 100, V.B / 100);
        let rad = 0; for (let nm = 380; nm <= 780; nm += 2) rad += spec(nm) * 2;
        const su = summarise(Ph, spec, 800), rs = renderSet(O, spec, su), sm = sampleSpec(spec, 380, 780, 160);
        // electrical power: the chip's wall-plug efficiency is taken as 50 %; red, green and blue LEDs as 45, 30 and 55 %
        const rawPower = pc ? 1 / 0.5 : (V.R / 100 / 0.45 + V.G / 100 / 0.30 + V.B / 100 / 0.55) * 1;
        let radTot = pc ? 1 : 0;
        if (!pc) radTot = V.R / 100 + V.G / 100 + V.B / 100;
        const outRad = pc ? ((1 - V.c / 100) + V.c / 100 * ((1 - V.r / 100) * 0.95 * (V.lp / 565) + V.r / 100 * 0.85 * (V.lp / 625))) : radTot;
        const eff = rawPower > 0 ? su.ler * outRad / rawPower : 0;
        return { su, rs, sm, eff, rgb: Cl.css(lightRgb(Cl, spec)) };
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = model(), R = M.rs;
        // the spectrum
        const r = { x: 24, y: 40, w: W * 0.54, h: Hh * 0.42 };
        drawSpec(c, C, S, kit, r, 380, 780, M.sm.vals, { eye: nm => Ph.V(nm) });
        kit.label(c, V.mode === 'pc' ? 'a blue chip with its phosphor' : 'three LEDs mixed', r.x, 20, { size: 12.5, weight: 650 });
        // the chromaticity diagram
        const sz = Math.min(W * 0.34, Hh * 0.50), dx = W - sz - 24, dy = 34, mapx = x => dx + (x / 0.8) * sz, mapy = y => dy + sz - (y / 0.9) * sz;
        c.fillStyle = C.surface; c.fillRect(dx, dy, sz, sz); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(dx, dy, sz, sz);
        c.strokeStyle = C.muted; c.lineWidth = 1.3; c.beginPath(); locus.forEach((p, i) => { const x = mapx(p[0]), y = mapy(p[1]); if (i) c.lineTo(x, y); else c.moveTo(x, y); }); c.closePath(); c.stroke();
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); planck.forEach((p, i) => { const x = mapx(p[1][0]), y = mapy(p[1][1]); if (i) c.lineTo(x, y); else c.moveTo(x, y); }); c.stroke();
        for (const [T, p] of marks) { kit.dot(c, mapx(p[0]), mapy(p[1]), 2.6, C.text); kit.label(c, T + ' K', mapx(p[0]) + 6, mapy(p[1]) + 10, { size: 10.5, color: C.muted }); }
        kit.label(c, 'x', dx + sz - 6, dy + sz + 11, { size: 10.5, color: C.faint }); kit.label(c, 'y', dx - 9, dy + 6, { size: 10.5, color: C.faint });
        kit.label(c, 'chromaticity (CIE 1931)', dx, dy - 12, { size: 11.5, color: C.muted });
        kit.dot(c, mapx(R.col.xy[0]), mapy(R.col.xy[1]), 6, M.rgb, C.text);
        // the colour, and a picture of the package
        const sy = Hh * 0.62;
        c.fillStyle = M.rgb; rrect(c, 24, sy, 120, 70, 10); c.fill(); c.strokeStyle = C.axis; c.stroke();
        kit.label(c, 'the light', 24, sy - 10, { size: 11.5, color: C.muted });
        if (V.mode === 'pc') {
          const px = 230, pw = 120, py = sy + 62;
          c.fillStyle = 'rgba(255,200,40,0.30)'; c.beginPath(); c.arc(px + pw / 2, py, pw / 2, PI, 0); c.closePath(); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.3; c.stroke();
          c.fillStyle = '#3a63ff'; c.fillRect(px + pw / 2 - 18, py - 8, 36, 8);
          kit.label(c, 'blue chip', px + pw / 2, py + 12, { align: 'center', size: 11, color: C.muted }); kit.label(c, 'phosphor', px + pw / 2, py - pw / 2 - 8, { align: 'center', size: 11, color: C.muted });
          const bl = 1 - V.c / 100;
          S.ray(c, [[px + pw / 2 - 8, py - 10], [px + 14, py - pw / 2 - 20]], { nm: V.lp, width: 1 + 3 * bl, arrows: false, alpha: 0.3 + 0.7 * bl });
          S.ray(c, [[px + pw / 2 + 8, py - 10], [px + pw - 14, py - pw / 2 - 20]], { nm: 575, width: 1 + 3 * V.c / 100, arrows: false });
        } else {
          for (const [i, nm, v] of [[0, 630, V.R], [1, 525, V.G], [2, 460, V.B]]) { const bx = 230 + i * 56; c.fillStyle = S.nm(nm, 0.9); c.fillRect(bx, sy + 70 - v * 0.7, 38, v * 0.7); c.strokeStyle = C.axis; c.strokeRect(bx, sy, 38, 70); }
          kit.label(c, 'R        G        B', 232, sy - 10, { size: 11, color: C.muted });
        }
        const near = R.col.white ? BINS.reduce((a, b) => Math.abs(b - R.col.cct) < Math.abs(a - R.col.cct) ? b : a) : null;
        ro.set('col', R.col.text);
        ro.set('ler', fx(M.su.ler, 0) + ' lm per radiated watt');
        ro.set('eff', fx(M.eff, 0) + ' lm/W' + (V.mode === 'pc' ? '  (chip at 50 %)' : '  (red 45, green 30, blue 55 %)'));
        ro.set('ra', scoreText(R.ra));
        ro.set('r9', scoreText(R.r9));
        ro.set('bin', near ? near + ' K bin' + (Math.abs(near - R.col.cct) > 0.08 * near ? ' (far from it)' : '') : 'not a white');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ colour rendering */
  const RLAMPS = [['Filament lamp, 2700 K', 'incandescent'], ['Halogen lamp, 3000 K', 'halogen'], ['Daylight, 6500 K', 'daylight'], ['Fluorescent tube, neutral triphosphor', 'fluorescent'], ['Compact fluorescent, warm', 'cfl'], ['Metal halide', 'metal-halide'], ['Mercury, clear', 'mercury'], ['High-pressure sodium', 'sodium-hp'], ['Low-pressure sodium', 'sodium-lp'], ['White LED, warm, with a red phosphor', 'ledA'], ['White LED, cool, yellow phosphor only', 'ledB'], ['Three LEDs, red green blue', 'ledC']];
  const LEDSPEC = { ledA: pcLed(0.97, 0.51, 450), ledB: pcLed(0.81, 0, 450), ledC: rgbLed(1, 0.7, 0.25) };
  const PUBLISHED = { incandescent: 'incandescent', halogen: 'halogen', fluorescent: 'fluorescent', cfl: 'cfl', mercury: 'mercury', 'metal-halide': 'metal-halide', 'sodium-hp': 'sodium-hp', 'sodium-lp': 'sodium-lp', ledA: 'led', ledB: 'led' };
  Hyper.sim('la-rendering', {
    title: 'Colour rendering: ten surfaces under any lamp',
    blurb: `Each swatch is split: the **left half** is the surface under a reference light of the same colour temperature (a hot body for a warm lamp), the **right half** the same surface under the chosen lamp. What a lamp does to a colour is the product of its spectrum and the surface's reflectance. The score is our own simplified colour-shift measure, built like the CIE colour rendering index but on ten schematic surfaces, so it only ranks lamps and does not replace the published Ra.

**Try this**
- Start with the *filament lamp*: the two halves are identical, since it is its own reference. Then the *fluorescent tube*: small shifts, and the red and cyan move most.
- Choose *low-pressure sodium*: every surface collapses onto one hue, only the brightness differs.
- Compare the *warm LED with a red phosphor* and the *three-LED* mix: both can sit near white, only one renders red.
- Untick *the eye adapts*: you see the raw colours of each lamp, the white paper takes the colour of the light. The eye adapts at once, which is why a lamp's colour temperature is noticed less than its rendering.
- Click a swatch to see the arithmetic: spectrum × reflectance = what reaches the eye.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 400 });
      const ctl = kit.controls(box.side, [
        { id: 'lamp', type: 'select', label: 'Lamp', options: RLAMPS, value: params.lamp || 'fluorescent' },
        { id: 'adapt', type: 'check', label: 'The eye adapts to the lamp\'s white', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['col', 'Colour of the light'], ['ref', 'Reference light'], ['ra', 'Colour-shift score (simplified Ra)'], ['pub', 'Published Ra of the lamp family'], ['r9', 'Deep red (simplified R9)'], ['worst', 'Surface that shifts most']]);
      let sel = 3;
      const hits = [];
      kit.click(st, p => { for (const h of hits) if (p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h) { sel = h.i; loop.once(); return; } }, p => hits.some(h => p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h));
      const calc = memo();
      const spec = () => LEDSPEC[V.lamp] || Ph.spectrum(V.lamp);
      const model = () => calc(V.lamp, () => { const sp = spec(), su = summarise(Ph, sp, V.lamp === 'incandescent' || V.lamp === 'halogen' || V.lamp === 'daylight' ? 40000 : 3000); return { sp, su, rs: renderSet(O, sp, su), sm: sampleSpec(sp, 380, 780, 90) }; });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = model(), R = M.rs;
        hits.length = 0;
        const gx = 20, gy = 34, gw = W - 40, cw = gw / 5, ch = Hh * 0.20, gap = 8;
        R.items.forEach((p, i) => {
          const x = gx + (i % 5) * cw, y = gy + Math.floor(i / 5) * (ch + 34);
          const lamp = V.adapt ? p.lampAd : p.lampRaw, ref = V.adapt ? p.refAd : p.refRaw;
          c.fillStyle = ref; c.fillRect(x + gap / 2, y, (cw - gap) / 2, ch); c.fillStyle = lamp; c.fillRect(x + cw / 2, y, (cw - gap) / 2, ch);
          c.strokeStyle = i === sel ? C.accent : C.axis; c.lineWidth = i === sel ? 2.5 : 1; c.strokeRect(x + gap / 2, y, cw - gap, ch);
          kit.label(c, p.name, x + cw / 2, y + ch + 11, { align: 'center', size: 11.5, color: C.text, weight: i === sel ? 650 : 500 });
          if (i > 1) kit.label(c, 'shift ΔE ' + fx(p.dE, 1), x + cw / 2, y + ch + 24, { align: 'center', size: 10.5, color: C.muted });
          hits.push({ x, y, w: cw, h: ch + 30, i });
        });
        kit.label(c, 'left half: the reference light   ·   right half: this lamp', gx, 16, { size: 11.5, color: C.muted });
        // the arithmetic of the selected surface: spectrum × reflectance
        const p = R.items[sel], py = gy + 2 * (ch + 34) + 14, pw = W - 40, ph = Hh - py - 34;
        if (ph > 40) {
          const X = nm => gx + (nm - 380) / 400 * pw;
          c.fillStyle = C.dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; c.fillRect(gx, py, pw, ph);
          const sMax = Math.max(...M.sm.vals) || 1;
          const trace = (fn, color, wd, dash) => { c.save(); c.strokeStyle = color; c.lineWidth = wd; if (dash) c.setLineDash(dash); c.beginPath(); for (let nm = 380; nm <= 780; nm += 4) { const y = py + ph - clamp(fn(nm), 0, 1.05) * ph * 0.92; if (nm > 380) c.lineTo(X(nm), y); else c.moveTo(X(nm), y); } c.stroke(); c.restore(); };
          const lampAt = nm => M.sm.vals[Math.max(0, Math.min(M.sm.vals.length - 1, Math.floor((nm - 380) / 400 * M.sm.vals.length)))] / sMax;
          trace(lampAt, C.muted, 1.6, [4, 3]); trace(p.rho, C.warn, 1.8); trace(nm => lampAt(nm) * p.rho(nm), C.accent, 2.4);
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(gx, py + ph); c.lineTo(gx + pw, py + ph); c.stroke();
          for (let nm = 400; nm <= 750; nm += 50) kit.label(c, String(nm), X(nm), py + ph + 11, { align: 'center', size: 10, color: C.faint });
          kit.label(c, p.name + ': dashed, the lamp;  amber, the surface\'s reflectance;  blue, what reaches the eye', gx, py - 8, { size: 11, color: C.muted });
        }
        const pubL = PUBLISHED[V.lamp] ? O.LAMPS.find(l => l.id === PUBLISHED[V.lamp]) : null;
        ro.set('col', R.col.text);
        ro.set('ref', (R.col.white ? 'a hot body at ' + Math.round(R.Tref / 10) * 10 + ' K' : 'a hot body at 6500 K (the lamp is not a white)'));
        ro.set('ra', scoreText(R.ra));
        ro.set('pub', pubL ? pubL.cri[0] + (pubL.cri[1] !== pubL.cri[0] ? '–' + pubL.cri[1] : '') : V.lamp === 'daylight' ? '100 (it is the reference above 5000 K)' : 'depends on the design');
        ro.set('r9', scoreText(R.r9));
        ro.set('worst', R.worst.name + ' (ΔE ' + fx(R.worst.dE, 1) + ')');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ caps and bulb shapes, to scale */
  const MMFIX = { G13: 12.7 };                                  // the table rounds the pin spacing of G13 to 13 mm; the standard gives 12.7 mm
  const SHAPES = { A: 'A: the arbitrary, classic pear', B: 'B: bulged, a blunt-tipped candle', C: 'C: conical, the candle', G: 'G: globe', P: 'P: pear, small ball', R: 'R: blown-glass reflector', PAR: 'PAR: pressed-glass parabolic aluminised reflector', MR: 'MR: multifaceted reflector', AR: 'AR: aluminium reflector', T: 'T: tubular', ST: 'ST: straight-sided, "squirrel cage" style' };
  function capDecode(code, kind, mm) {
    if (/^E/.test(code)) return 'E = Edison screw; ' + mm + ' = outside diameter of the thread, in mm';
    if (/^B/.test(code)) return 'B = bayonet; ' + mm + ' = diameter of the cap, in mm; d = two contacts at the foot';
    if (/^R7/.test(code)) return 'R = recessed contact; 7 = its diameter in mm; one contact at each end of the lamp';
    if (/^P/.test(code)) return 'P = prefocus flange; ' + mm + ' = diameter of the flange, in mm';
    if (/^2G/.test(code)) return '2G11: four pins in two pairs, the pairs 11 mm apart';
    if (/^GX|^G5\d|^GU|^GY|^G/.test(code)) return 'G = pins; ' + fx(mm, mm % 1 ? 2 : 0) + ' = distance between the pins, in mm' + (/^GU/.test(code) ? '; U = the twist-lock variant' : /^GX/.test(code) ? '; X = a special variant' : /^GY/.test(code) ? '; Y = a variant of the pin' : '');
    return kind;
  }
  function drawCap(c, C, kit, S, cap, cx, yb, s) {
    const code = cap.code, mm = MMFIX[code] || cap.mm, edge = C.text, fill = C.dark ? '#39405f' : '#aab2cc', metal = S.metal();
    c.lineWidth = 1.2; c.strokeStyle = edge;
    let top = yb, label = '', dimY = 0, x1, x2;
    if (/^E/.test(code)) {                                      // a screw: a cylinder with a thread and a contact at the foot
      const w = mm * s, h = (0.95 * mm + 4) * s; c.fillStyle = metal; c.fillRect(cx - w / 2, yb - h, w, h); c.strokeRect(cx - w / 2, yb - h, w, h);
      c.strokeStyle = C.dark ? '#2a2f4a' : '#7a8196'; c.lineWidth = 1.5; for (let i = 1; i < 6; i++) { const y = yb - h + h * i / 6.5; c.beginPath(); c.moveTo(cx - w / 2, y + 2); c.lineTo(cx + w / 2, y - 2); c.stroke(); }
      c.fillStyle = C.warn; c.fillRect(cx - 0.17 * w, yb, 0.34 * w, 3 * s); c.strokeStyle = edge; c.strokeRect(cx - 0.17 * w, yb, 0.34 * w, 3 * s);
      top = yb - h; x1 = cx - w / 2; x2 = cx + w / 2; label = 'Ø ' + mm + ' mm';
    } else if (/^B/.test(code)) {                               // a bayonet: a smooth cylinder with two pins
      const w = mm * s, h = (0.95 * mm + 3) * s; c.fillStyle = metal; c.fillRect(cx - w / 2, yb - h, w, h); c.strokeRect(cx - w / 2, yb - h, w, h);
      c.fillStyle = C.warn; for (const sgn of [-1, 1]) { c.fillRect(cx + sgn * w / 2 - (sgn > 0 ? 0 : 2.4 * s), yb - 0.35 * h, 2.4 * s, 2.2 * s); }
      c.fillRect(cx - 0.3 * w, yb, 0.2 * w, 2 * s); c.fillRect(cx + 0.1 * w, yb, 0.2 * w, 2 * s);
      top = yb - h; x1 = cx - w / 2; x2 = cx + w / 2; label = 'Ø ' + mm + ' mm';
    } else if (/^P/.test(code)) {                               // a prefocus flange
      const w = mm * s; c.fillStyle = metal; c.fillRect(cx - w / 2, yb - 3 * s, w, 3 * s); c.strokeRect(cx - w / 2, yb - 3 * s, w, 3 * s);
      c.fillRect(cx - 9 * s, yb - 17 * s, 18 * s, 14 * s); c.strokeRect(cx - 9 * s, yb - 17 * s, 18 * s, 14 * s);
      top = yb - 17 * s; x1 = cx - w / 2; x2 = cx + w / 2; dimY = yb + 14; label = 'Ø ' + mm + ' mm';
    } else if (/^R7/.test(code)) {                              // the end of a linear lamp: a ceramic cylinder with a recessed contact
      const w = 12 * s, h = 18 * s; c.fillStyle = C.dark ? '#d8d2c0' : '#cfc7b0'; c.fillRect(cx - w / 2, yb - h, w, h); c.strokeRect(cx - w / 2, yb - h, w, h);
      c.fillStyle = C.bg2; c.beginPath(); c.arc(cx, yb - h / 2, mm * s / 2, 0, TAU); c.fill(); c.stroke();
      top = yb - h; x1 = cx - mm * s / 2; x2 = cx + mm * s / 2; dimY = yb - h / 2; label = 'Ø ' + mm + ' mm';
    } else {                                                    // pins, studs or blades at a given spacing
      const pairs = /^2G/.test(code) ? 2 : 1, gap = mm * s, bw = Math.max(gap + 12 * s, 20 * s), bh = (/^GX|^G53|^G13|^G5$/.test(code) ? 9 : 7) * s;
      const pinH = (/^GX|^G53/.test(code) ? 6 : /^G13|^G5$/.test(code) ? 8 : 8) * s, pin = Math.max(2, (/^GU10/.test(code) ? 3 : /^GX|^G53/.test(code) ? 3.5 : 1.4) * s);
      c.fillStyle = fill; rrect(c, cx - bw / 2, yb - bh, bw, bh, 3 * s); c.fill(); c.stroke();
      const xs = pairs === 2 ? [-gap / 2 - 1.5 * s, -gap / 2 + 1.5 * s, gap / 2 - 1.5 * s, gap / 2 + 1.5 * s] : [-gap / 2, gap / 2];
      c.fillStyle = metal;
      for (const dx of xs) { c.fillRect(cx + dx - pin / 2, yb, pin, pinH); c.strokeRect(cx + dx - pin / 2, yb, pin, pinH); if (/^GU10/.test(code)) { c.beginPath(); c.arc(cx + dx, yb + pinH, pin * 0.9, 0, TAU); c.fill(); c.stroke(); } }
      top = yb - bh; x1 = cx + xs[0]; x2 = cx + xs[xs.length - 1]; dimY = yb + pinH + 6; label = 'pins ' + fx(mm, mm % 1 ? 2 : 0) + ' mm apart';
      if (pairs === 2) label = 'pairs ' + mm + ' mm apart';
    }
    const ty = /^E|^B/.test(code) ? top - 16 : dimY ? dimY + 16 : top - 16;
    S.dim(c, x1, ty, x2, ty, label, { off: 0 });
    return top;
  }
  // a bulb's glass in profile, standing on the line yb with its widest part d mm across; -> the y of its widest part
  function drawBulb(c, C, S, letters, d, cx, yb, s) {
    const R = d / 2 * s, glass = S.glass(0.28);
    c.fillStyle = glass; c.strokeStyle = S.edge(); c.lineWidth = 1.5;
    let yw = yb;
    c.beginPath();
    if (letters === 'A' || letters === 'G' || letters === 'P' || letters === 'B') {
      const h = (letters === 'A' ? 1.6 : letters === 'B' ? 1.7 : 1.3) * d * s, nw = Math.min(R * 0.6, 14 * s), yc = yb - h + R;
      c.moveTo(cx - nw, yb); c.bezierCurveTo(cx - nw, yb - 0.3 * (yb - yc), cx - R, yc + 0.7 * (yb - yc) * (letters === 'G' ? 0.5 : 1), cx - R, yc);
      c.arc(cx, yc, R, PI, 0); c.bezierCurveTo(cx + R, yc + 0.7 * (yb - yc) * (letters === 'G' ? 0.5 : 1), cx + nw, yb - 0.3 * (yb - yc), cx + nw, yb); yw = yc;
    } else if (letters === 'C') {
      const h = 2.1 * d * s, nw = Math.min(R * 0.45, 7 * s);
      c.moveTo(cx - nw, yb); c.bezierCurveTo(cx - nw, yb - 0.2 * h, cx - R, yb - 0.25 * h, cx - R, yb - 0.4 * h); c.bezierCurveTo(cx - R, yb - 0.75 * h, cx - 0.15 * R, yb - 0.85 * h, cx, yb - h);
      c.bezierCurveTo(cx + 0.15 * R, yb - 0.85 * h, cx + R, yb - 0.75 * h, cx + R, yb - 0.4 * h); c.bezierCurveTo(cx + R, yb - 0.25 * h, cx + nw, yb - 0.2 * h, cx + nw, yb); yw = yb - 0.4 * h;
    } else if (letters === 'T') {
      const h = 125 * s, nb = 7 * s; c.moveTo(cx - R, yb);
      c.lineTo(cx - R, yb - h); for (let i = 1; i <= 6; i++) c.lineTo(cx - R + 2 * R * i / 6, yb - h + (i % 2 ? -nb : 0)); c.lineTo(cx + R, yb); yw = yb - h / 2;
    } else if (letters === 'ST') {
      const h = 1.9 * d * s; c.moveTo(cx - R, yb); c.lineTo(cx - R, yb - h + R); c.arc(cx, yb - h + R, R, PI, 0); c.lineTo(cx + R, yb); yw = yb - h * 0.5;
    } else {                                                     // reflectors: a bowl with a lens at the front
      const dep = { R: 0.8, PAR: 0.7, MR: 0.5, AR: 0.42 }[letters] || 0.6, depth = dep * d * s, nw = Math.max(5 * s, R * 0.22);
      c.moveTo(cx - nw, yb);
      for (let i = 1; i <= 24; i++) { const t = i / 24; c.lineTo(cx - (nw + (R - nw) * Math.sqrt(t)), yb - depth * t); }
      for (let i = 24; i >= 0; i--) { const t = i / 24; c.lineTo(cx + (nw + (R - nw) * Math.sqrt(t)), yb - depth * t); }
      yw = yb - depth;
    }
    c.closePath(); c.fill(); c.stroke();
    if (letters === 'T') { c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(cx - R - 6, yb - 125 * s + 3); c.lineTo(cx + R + 6, yb - 125 * s + 3); c.stroke(); c.restore(); }
    return yw;
  }
  Hyper.sim('la-bases', {
    title: 'Caps and bulb shapes: the codes, drawn to the same scale',
    blurb: `The letters of a lamp **cap** say how it fits and the number gives a size in millimetres: E27 is an Edison screw 27 mm across, GU10 a twist-lock with studs 10 mm apart. The letters of a **bulb shape** say its form, and the number its diameter: A60 is a pear 60 mm across; in North American codes it is A19, because there the number counts eighths of an inch. Both are drawn here to the same scale, with the ruler below. The heights of the bulbs are schematic.

**Try this**
- Pick *E27*, then *E14*, *E26*, *E40*: the same family, four sizes. E26 and E27 look alike but are for 120 V and 230 V lamps: never swap.
- Pick *GU10* and *GU5.3* and read the use: one runs on the mains, the other on 12 V from a transformer, and the pins differ by only a few millimetres.
- Compare *MR16* and *PAR38*: 16/8 inch and 38/8 inch, 51 mm and 121 mm. The *eighths* read-out does the sum.
- Choose *T5*, *T8*, *T12* with the G5 and G13 caps: the T number is the tube diameter in eighths of an inch.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const caps = O.BASES, bulbs = O.BULBS;
      const ctl = kit.controls(box.side, [
        { id: 'cap', type: 'select', label: 'Cap or base', options: caps.map(b => [b.code + ': ' + b.kind, b.code]), value: params.cap || 'E27' },
        { id: 'bulb', type: 'select', label: 'Bulb shape', options: bulbs.map(b => [b.code + ': ' + b.shape, b.code]), value: params.bulb || 'A60 / A19' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cap', 'Cap'], ['capc', 'What the cap code says'], ['use', 'Used for'], ['bulb', 'Bulb shape'], ['bulbc', 'What the bulb code says'], ['eighths', 'Diameter in eighths of an inch']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const cap = caps.find(b => b.code === V.cap) || caps[0], bulb = bulbs.find(b => b.code === V.bulb) || bulbs[0];
        const s = Math.min(W / 300, (Hh - 120) / 165), yb = Hh - 62;
        // the ruler, in millimetres
        const rx = 24; c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(rx, yb + 26); c.lineTo(rx + 280 * s, yb + 26); c.stroke();
        for (let mm = 0; mm <= 280; mm += 10) { const x = rx + mm * s; c.beginPath(); c.moveTo(x, yb + 26); c.lineTo(x, yb + (mm % 50 === 0 ? 33 : 30)); c.stroke(); if (mm % 50 === 0) kit.label(c, String(mm), x, yb + 44, { align: 'center', size: 10.5, color: C.faint }); }
        kit.label(c, 'mm', rx + 280 * s + 8, yb + 26, { size: 10.5, color: C.faint });
        // the cap and the bulb
        const cx1 = W * 0.27, cx2 = W * 0.68;
        drawCap(c, C, kit, S, cap, cx1, yb, s);
        kit.label(c, cap.code, cx1, 18, { align: 'center', size: 16, weight: 700, font: MONO });
        const letters = (/^[A-Z]+/.exec(bulb.code) || ['A'])[0];
        const yw = drawBulb(c, C, S, letters, bulb.d, cx2, yb, s);
        S.dim(c, cx2 - bulb.d * s / 2, yw, cx2 + bulb.d * s / 2, yw, 'Ø ' + bulb.d + ' mm', { off: 0 });
        kit.label(c, bulb.code, cx2, 18, { align: 'center', size: 16, weight: 700, font: MONO });
        const parts = bulb.code.split('/').map(x => x.trim()), l2 = (/^[A-Z]+/.exec(parts[0]) || ['A'])[0], eighths = bulb.d / 25.4 * 8;
        ro.set('cap', cap.code + ': ' + cap.kind);
        ro.set('capc', capDecode(cap.code, cap.kind, MMFIX[cap.code] || cap.mm));
        ro.set('use', cap.use);
        ro.set('bulb', bulb.code + ': ' + bulb.shape);
        ro.set('bulbc', (SHAPES[l2] || l2) + '; the number is the diameter in mm' + (parts[1] ? ' (in the North American code ' + parts[1] + ', in eighths of an inch)' : ''));
        ro.set('eighths', bulb.d + ' mm = ' + fx(eighths, 1) + ' eighths of an inch');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ efficacy and life */
  const FAMILY_COL = { thermal: '#f0902a', discharge: '#59a8ff', HID: '#a06be8', arc: '#2cc8a0', 'solid state': '#7b8cff' };
  Hyper.sim('la-efficacy', {
    title: 'Efficacy, life and colour of every lamp family, and how a lamp ages',
    blurb: `Every bar is a range from the lamp table. Choose what to compare: lumens per electrical watt, rated life (on a logarithmic axis) or colour rendering. **Click a bar** to look at one lamp. The graph shows, schematically, how its light falls with use and how many lamps of a batch are still working; the rated life is where half of them have gone for filaments and discharge lamps (the median), and where the light has fallen to 70 % (L70) for LEDs.

**Try this**
- Compare the families by *efficacy*: filament and halogen lamps at the bottom, LEDs and sodium lamps at the top. Switch to *colour rendering*: the order reverses for sodium.
- Click *white LED* and raise the *temperature above the rating*: every 10 °C halves the life by the rule of thumb, which applies to the electrolytic capacitors in the driver as well as to the chip.
- Click the *filament lamp* and change the *supply voltage*: +5 % halves its life.
- The dashed line is the share of lamps still working: life is a statistical figure, not a date.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const lamps = O.LAMPS.filter(l => l.efficacy[1] > 0);
      const ctl = kit.controls(box.side, [
        { id: 'metric', type: 'select', label: 'Compare', options: [['Efficacy, lm per electrical watt', 'eff'], ['Rated life, hours', 'life'], ['Colour rendering, Ra', 'cri']], value: params.metric || 'eff' },
        { id: 'lamp', type: 'select', label: 'Look at one lamp', options: lamps.map(l => [l.name, l.id]), value: params.lamp || 'led' },
        { id: 'dV', label: 'Supply voltage against the rating (filament lamps)', min: -10, max: 10, step: 1, value: 0, unit: '%' },
        { id: 'dT', label: 'Temperature above the rating (other lamps)', min: 0, max: 40, step: 1, value: 0, unit: '°C' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const cur = () => lamps.find(l => l.id === V.lamp) || lamps[0];
      const vis = () => { const th = cur().family === 'thermal'; ctl.show('dV', th); ctl.show('dT', !th); };
      vis();
      const ro = kit.readout(box.side, [['eff', 'Efficacy'], ['of', 'Share of the 683 lm/W limit'], ['cri', 'Colour rendering Ra'], ['life', 'Rated life'], ['l70', 'Life as set by the stress above'], ['fam', 'Family and start']]);
      const plot = kit.plot(gb, { x: { label: 'hours of use', min: 0, name: 't' }, y: { label: 'relative', min: 0, max: 1.05, name: '' }, legend: true }, 180);
      const hits = [];
      kit.click(st, p => { for (const h of hits) if (p.y >= h.y && p.y <= h.y + h.h) { ctl.set('lamp', h.id); vis(); loop.once(); return; } }, p => hits.some(h => p.y >= h.y && p.y <= h.y + h.h));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, l = cur();
        hits.length = 0;
        const lx = 168, rx = W - 24, top = 34, rowH = Math.min(24, (Hh - top - 34) / lamps.length), mt = V.metric;
        const lo = mt === 'eff' ? 0 : mt === 'life' ? 2 : 0, hi = mt === 'eff' ? 220 : mt === 'life' ? 6 : 100;
        const X = v => mt === 'life' ? lx + (Math.log10(Math.max(v, 100)) - lo) / (hi - lo) * (rx - lx) : lx + (v - lo) / (hi - lo) * (rx - lx);
        const ticks = mt === 'eff' ? [0, 50, 100, 150, 200] : mt === 'life' ? [100, 1000, 10000, 100000, 1000000] : [0, 20, 40, 60, 80, 100];
        for (const t of ticks) { const x = X(t); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x, top - 4); c.lineTo(x, top + rowH * lamps.length); c.stroke(); kit.label(c, mt === 'life' ? (t >= 1000 ? (t / 1000) + 'k' : t) : String(t), x, top + rowH * lamps.length + 12, { align: 'center', size: 10.5, color: C.faint }); }
        kit.label(c, mt === 'eff' ? 'lumens per electrical watt (an ideal white source: 250–350)' : mt === 'life' ? 'rated life in hours (logarithmic)' : 'colour rendering index Ra (0 = none, 100 = the reference)', lx, 16, { size: 11.5, color: C.muted });
        lamps.forEach((m, i) => {
          const y = top + i * rowH, range = mt === 'eff' ? m.efficacy : mt === 'life' ? m.life : m.cri, sel = m.id === l.id;
          if (sel) { c.fillStyle = C.dark ? 'rgba(123,140,255,0.14)' : 'rgba(80,100,230,0.10)'; c.fillRect(8, y, W - 16, rowH); }
          kit.label(c, m.name.replace(/\s*\(.*\)/, ''), lx - 8, y + rowH / 2, { align: 'right', size: 11.5, color: sel ? C.text : C.muted, weight: sel ? 650 : 500 });
          const a = X(range[0]), b = Math.max(X(range[1]), a + 3);
          if (mt === 'cri' && range[1] === 0 && m.id !== 'sodium-lp') kit.label(c, 'not defined', lx + 6, y + rowH / 2, { size: 10.5, color: C.faint });
          else { c.fillStyle = FAMILY_COL[m.family] || C.accent; c.globalAlpha = sel ? 1 : 0.75; c.fillRect(a, y + 4, b - a, rowH - 8); c.globalAlpha = 1; }
          hits.push({ y, h: rowH, id: m.id });
        });
        if (mt === 'eff') { kit.arrow(c, rx - 40, top - 8, rx, top - 8, C.faint, 1.2, 6); }
        // the legend of families
        let lxx = lx; const ly = Hh - 12;
        for (const [fam, col] of Object.entries(FAMILY_COL)) { c.fillStyle = col; c.fillRect(lxx, ly - 6, 10, 10); kit.label(c, fam === 'HID' ? 'high-intensity discharge' : fam, lxx + 14, ly, { size: 10.5, color: C.muted }); lxx += 20 + fam.length * 6.2 + (fam === 'HID' ? 80 : 0); }
        // life under stress and the ageing curve
        const th = l.family === 'thermal', mid = Math.sqrt(l.life[0] * l.life[1]);
        const factor = th ? Math.pow(1 + V.dV / 100, -13) : Math.pow(2, -V.dT / 10), life = mid * factor;
        const pts = [], alive = [], tEnd = Math.max(life * 2, 1000);
        for (let i = 0; i <= 80; i++) {
          const t = tEnd * i / 80;
          pts.push([t, th ? 1 - 0.1 * Math.min(1, t / life) : Math.exp(-t / life * Math.log(1 / 0.7))]);
          alive.push([t, Math.exp(-Math.LN2 * Math.pow(t / life, 3))]);
        }
        plot.set({ x: { label: l.id === 'flash' ? 'flashes' : 'hours of use', min: 0, max: tEnd, name: 't' }, series: [{ pts, label: th ? 'light of a lamp that still works' : 'light of a lamp that still works (70 % at the rated life)' }, { pts: alive, label: 'share of lamps still working', dash: true }], marks: [{ x: life, y: th ? 0.9 : 0.7, label: fx(life, life < 100 ? 1 : 0) + ' h' }] });
        ro.set('eff', (l.efficacy[0] === l.efficacy[1] ? l.efficacy[0] : l.efficacy[0] + '–' + l.efficacy[1]) + ' lm/W' + (l.id === 'flash' ? ' (lm·s per J)' : ''));
        ro.set('of', fx(100 * l.efficacy[0] / 683, 0) + '–' + fx(100 * l.efficacy[1] / 683, 0) + ' %');
        ro.set('cri', l.cri[1] || l.id === 'sodium-lp' ? l.cri[0] + (l.cri[1] !== l.cri[0] ? '–' + l.cri[1] : '') : 'not defined (one colour)');
        ro.set('life', l.life[0] + '–' + l.life[1] + (l.id === 'flash' ? ' flashes' : ' h'));
        ro.set('l70', th ? fx(life, 0) + ' h at ' + (V.dV >= 0 ? '+' : '') + V.dV + ' % voltage (×' + fx(factor, 2) + ')' : fx(life, 0) + ' h at +' + V.dT + ' °C (×' + fx(factor, 2) + ')');
        ro.set('fam', l.family + ';  starts: ' + l.start);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ flicker and the stroboscopic effect */
  const FLK = [['LED, simple driver: the light follows the rectified mains', 'bad'], ['LED, driver with some ripple', 'ok'], ['LED, constant-current driver', 'dc'], ['LED dimmed by PWM', 'pwm'], ['Filament lamp: the hot wire smooths the ripple', 'inc'], ['Fluorescent, magnetic ballast', 'mag'], ['Fluorescent, electronic ballast (35 kHz)', 'hf']];
  // the relative light of a lamp against time: { f: the main frequency of the modulation, I: t => intensity }
  function flkProfile(src, fm, fp, duty) {
    const w2 = 2 * PI * 2 * fm;
    switch (src) {
      case 'bad': return { f: 2 * fm, I: t => Math.max(0, Math.abs(Math.sin(PI * fm * t)) - 0.12) / 0.88 };
      case 'ok': return { f: 2 * fm, I: t => 1 + 0.12 * Math.sin(w2 * t) };
      case 'dc': return { f: 2 * fm, I: t => 1 + 0.004 * Math.sin(w2 * t) };
      case 'pwm': return { f: fp, I: t => ((t * fp) % 1) < duty ? 1 : 0 };
      case 'inc': return { f: 2 * fm, I: t => 1 + 0.08 * Math.sin(w2 * t) };
      case 'mag': return { f: 2 * fm, I: t => 1 + 0.35 * Math.sin(w2 * t) };
      default: return { f: 2 * fm, I: t => 1 + 0.04 * Math.sin(w2 * t) };       // electronic ballast: the 35 kHz ripple is far too fast to matter; what is left is a little mains ripple
    }
  }
  Hyper.sim('la-flicker', {
    title: 'Flicker and the stroboscopic effect: the light against time, and a wheel under it',
    blurb: `A lamp's light is never perfectly steady. The graph shows how it varies with time over 40 ms, and gives the **percent flicker** (maximum minus minimum over maximum plus minimum) and the **flicker index**. Below, a wheel with marks turns under that light, as the eye sees it by adding up what it receives over about 40 ms. When the marks pass at the same rate as the light pulses, the wheel seems to stand still, or to creep, or to turn backwards.

**Try this**
- Choose the *LED with the simple driver*. It flickers at twice the mains frequency, 100 or 120 Hz, at 100 %. Set the wheel to **1500 rpm** (the speed of a four-pole motor on 50 Hz mains) with **4 marks**: it appears to stand still. That is a hazard in a workshop.
- Change the speed a little, to 1470 or 1530 rpm: the wheel creeps slowly forwards or backwards.
- Choose the *constant-current driver*: the same wheel is a blur, as it should be.
- Choose *PWM*, 200 Hz, 20 %: flicker of 100 %. Raise the frequency above 2 kHz and the effects fade, though the percent flicker does not change.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'src', type: 'select', label: 'Light source', options: FLK, value: params.src || 'bad' },
        { id: 'fm', type: 'select', label: 'Mains frequency', options: [['50 Hz', 50], ['60 Hz', 60]], value: params.fm || 50 },
        { id: 'fp', label: 'PWM frequency', min: 100, max: 20000, value: 200, log: true, sig: 3, unit: 'Hz' },
        { id: 'duty', label: 'Duty cycle (the dimming level)', min: 5, max: 100, step: 5, value: 20, unit: '%' },
        { id: 'rpm', label: 'Speed of the wheel', min: 0, max: 6000, step: 10, value: params.rpm != null ? params.rpm : 1500, unit: 'rpm' },
        { id: 'marks', label: 'Marks on the wheel', min: 1, max: 12, step: 1, value: params.marks || 4 }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const vis = () => { ctl.show('fp', V.src === 'pwm'); ctl.show('duty', V.src === 'pwm'); };
      vis();
      const ro = kit.readout(box.side, [['f', 'Main frequency of the variation'], ['pct', 'Percent flicker'], ['idx', 'Flicker index'], ['risk', 'Effect (rule of thumb)'], ['wheel', 'The wheel under this light']]);
      const calc = memo();
      const model = () => calc([V.src, V.fm, Math.round(V.fp), V.duty].join('|'), () => {
        const pr = flkProfile(V.src, V.fm, V.fp, V.duty / 100), T = 1 / pr.f, N = 400;
        let mn = 1e9, mx = -1e9, sum = 0; const v = [];
        for (let i = 0; i < N; i++) { const x = pr.I(T * i / N); v.push(x); mn = Math.min(mn, x); mx = Math.max(mx, x); sum += x; }
        const mean = sum / N; let above = 0; for (const x of v) above += Math.max(0, x - mean);
        const pct = mx + mn > 0 ? 100 * (mx - mn) / (mx + mn) : 0, idx = sum > 0 ? above / sum : 0;
        return { pr, mn, mx, mean, pct, idx, fast: pr.f > 1500 };
      });
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = model(), tt = t || 0, pr = M.pr;
        // the light against time, 40 ms
        const gx = 56, gy = 30, gw = W - 56 - 20, gh = Hh * 0.30, T0 = 0.040, ymax = Math.max(M.mx, 1) * 1.08;
        const X = ts => gx + ts / T0 * gw, Y = v => gy + gh - v / ymax * gh;
        c.fillStyle = C.dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; c.fillRect(gx, gy, gw, gh);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx, gy + gh); c.lineTo(gx + gw, gy + gh); c.stroke();
        for (let ms = 0; ms <= 40; ms += 10) { const x = X(ms / 1000); c.beginPath(); c.moveTo(x, gy + gh); c.lineTo(x, gy + gh + 4); c.stroke(); kit.label(c, ms + ' ms', x, gy + gh + 14, { align: 'center', size: 10.5, color: C.faint }); }
        kit.label(c, 'relative light', gx, gy - 12, { size: 11.5, color: C.muted });
        if (!M.fast) {
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
          for (let i = 0; i <= 1000; i++) { const ts = T0 * i / 1000, y = Y(pr.I(ts)); if (i) c.lineTo(X(ts), y); else c.moveTo(X(ts), y); }
          c.stroke();
        } else {
          c.fillStyle = C.dark ? 'rgba(123,140,255,0.45)' : 'rgba(80,100,230,0.35)'; c.fillRect(gx, Y(M.mx), gw, Math.max(1, Y(M.mn) - Y(M.mx)));
          kit.label(c, 'pulses too close to draw (' + (pr.f >= 1000 ? fx(pr.f / 1000, 1) + ' kHz' : fx(pr.f, 0) + ' Hz') + '): the band shows the extremes', gx + gw / 2, gy + 12, { align: 'center', size: 11, color: C.muted });
        }
        c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.2; c.beginPath(); c.moveTo(gx, Y(M.mean)); c.lineTo(gx + gw, Y(M.mean)); c.stroke(); c.restore();
        kit.label(c, 'mean', gx + gw - 4, Y(M.mean) - 8, { align: 'right', size: 10.5, color: C.warn });
        // the wheel, seen by an eye that adds up the last 40 ms
        const px = 20, py = gy + gh + 44, pw = W - 40, ph = Hh - py - 14, cx = W / 2, cy = py + ph / 2, rr = Math.min(ph / 2 - 8, pw / 4);
        c.fillStyle = '#0c0f20'; c.fillRect(px, py, pw, ph);
        const K = 48, Tw = 0.04, spokes = V.marks, om = TAU * V.rpm / 60;
        const wts = []; let tot = 0;
        for (let j = 0; j < K; j++) { const tj = tt - Tw * j / (K - 1), w = M.fast ? 1 : Math.max(0, pr.I(tj)); wts.push([tj, w]); tot += w; }
        c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
        for (const [tj, w] of wts) {
          const a = tot > 0 ? w / tot : 0; if (a < 0.002) continue;
          c.strokeStyle = 'rgba(255,238,170,' + Math.min(1, a) + ')'; c.lineWidth = 5; c.beginPath();
          for (let k = 0; k < spokes; k++) { const th = om * tj + TAU * k / spokes; c.moveTo(cx + Math.cos(th) * rr * 0.28, cy + Math.sin(th) * rr * 0.28); c.lineTo(cx + Math.cos(th) * rr, cy + Math.sin(th) * rr); }
          c.stroke();
        }
        c.restore();
        c.strokeStyle = 'rgba(200,205,230,0.45)'; c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, rr, 0, TAU); c.stroke(); c.beginPath(); c.arc(cx, cy, rr * 0.28, 0, TAU); c.stroke();
        kit.label(c, 'wheel: ' + spokes + (spokes === 1 ? ' mark' : ' marks') + ', ' + V.rpm + ' rpm; ' + fx(spokes * V.rpm / 60, 1) + ' marks pass per second', px + 8, py + 14, { size: 11.5, color: '#c3c8e0' });
        // what the wheel does
        const fl = pr.f, pass = spokes * V.rpm / 60;
        let wheel;
        if (V.rpm < 1) wheel = 'standing still';
        else if (M.pct < 20 || M.fast) wheel = 'a blur or a clear turning wheel: the light is too steady, or too fast, to sample the motion';
        else { const k = Math.round(pass / fl), fa = pass - k * fl; wheel = Math.abs(fa) < 0.5 ? 'seems to STAND STILL (the marks pass at ' + fx(k, 0) + ' × the light frequency)' : 'seems to turn ' + (fa > 0 ? 'forwards' : 'backwards') + ' at ' + fx(Math.abs(fa) / spokes * 60, 0) + ' rpm (the true speed is ' + V.rpm + ' rpm)'; }
        ro.set('f', fx(fl, fl < 1000 ? 0 : 0) + ' Hz');
        ro.set('pct', fx(M.pct, 0) + ' %');
        ro.set('idx', fx(M.idx, 2));
        ro.set('risk', M.pct < 1 ? 'none' : M.fast ? 'not visible: too fast for the eye and for moving objects' : fl < 90 && M.pct > 3 ? 'visible flicker likely (the rate is below about 90 Hz)' : M.pct > 30 && fl < 2000 ? 'stroboscopic effect and a "phantom array" when the eye moves are likely' : M.pct > 8 ? 'possible stroboscopic effect on fast machinery' : 'low');
        ro.set('wheel', wheel);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ the invisible ends of the spectrum */
  const UVIR = {
    c254: { name: 'Germicidal lamp: low-pressure mercury, 254 nm', spec: nm => g(nm, 253.7, 0.8), note: 'The line that makes the phosphor of a fluorescent tube glow, without the phosphor.', haz: 'UV-C: burns the surface of the eye (photokeratitis) and reddens skin within hours. Never look at it or expose skin or eyes; the daily exposure limit is a few millijoules per square centimetre. It also makes ozone.' },
    c265: { name: 'UV-C LED, 265 nm', spec: nm => g(nm, 265, 5.5), note: 'DNA absorbs most strongly near 260–270 nm; this is the most effective band for disinfection, and the most harmful to eyes and skin.', haz: 'UV-C: as for the germicidal lamp. Enclose the source and interlock it, so that no one is in the beam.' },
    b311: { name: 'UV-B narrow-band lamp, 311 nm', spec: nm => g(nm, 311.5, 1.6), note: 'A phosphor lamp with a very narrow band.', haz: 'UV-B: sunburn and photokeratitis. Used for phototherapy only under medical supervision.' },
    a365: { name: 'Black-light lamp: UV-A, about 365 nm', spec: nm => g(nm, 365, 8), note: 'A lamp whose glass absorbs the visible light; the faint violet is its tail.', haz: 'UV-A: reaches deeper than UV-B and is much less harmful at the power of a black light, but avoid staring into strong sources.' },
    a395: { name: 'UV-A LED for curing, 395 nm', spec: nm => g(nm, 395, 6), note: 'Hardens inks and adhesives; its photon energy is 3.1 eV.', haz: 'UV-A and violet at high power can damage the eye. Use the shields and the glasses made for the wavelength.' },
    i850: { name: 'Infrared LED, 850 nm', specId: 'led-ir', note: 'The long tail of the band reaches into deep red, so the LED shows a faint red glow even though its peak is invisible.', haz: 'Almost invisible and without any blink reflex. High-power illuminators can heat the retina: do not stare into them at close range.' },
    i940: { name: 'Infrared LED, 940 nm', spec: nm => g(nm, 940, 19), note: 'The wavelength of remote controls; completely invisible.', haz: 'Invisible: no warning of any kind. A remote control is harmless; a high-power illuminator or laser at this wavelength is not.' },
    heat: { name: 'Infrared heat lamp: a filament at about 2500 K', spec: nm => Hyper.optics.photo.planck(nm, 2500), note: 'A filament lamp made hot for its heat: most of its output is infrared.', haz: 'Hot: burns skin and ignites paper. Many years of infrared exposure can cloud the lens of the eye.' },
    cer: { name: 'Ceramic heater at about 700 K', spec: nm => Hyper.optics.photo.planck(nm, 700), note: 'A "dark" heater: it glows dull red at best, and its peak is near 4 µm.', haz: 'Mid-infrared heat: warms the skin, gives no warning light; keep combustible things away.' }
  };
  const SIBAND = nm => nm < 300 || nm > 1250 ? 0 : 0.85 * sg((nm - 395) / 20) * (1 - sg((nm - 1005) / 45));     // a typical silicon camera sensor, schematic
  Hyper.sim('la-uv-ir', {
    title: 'The invisible ends: ultraviolet and infrared sources, the eye and a camera',
    blurb: `The visible spectrum is a narrow strip, 380 to 780 nm, between the ultraviolet and the infrared. The graph spans 100 nm to 20 µm on a logarithmic axis. The coloured hill is the chosen source; the dashed line is the eye's sensitivity and the dotted one a typical silicon camera sensor, each scaled to its own peak. The hazard line is general information, not a safety assessment of a particular product.

**Try this**
- Pick the *germicidal lamp* and the *UV-C LED*: nothing the eye can see, and the strongest effect on cells. This is why a UV-C source must never be left uncovered where anyone could be exposed.
- Pick *infrared 940 nm* and then *850 nm*: the camera sees both, the eye sees neither (850 shows a faint red edge). A phone camera shows a remote control flashing.
- Compare the *heat lamp* (a filament at 2500 K) with the *ceramic heater* at 700 K: the colder the body, the farther its peak moves into the infrared and the less the camera sees.
- Read the *lumens per radiated watt*: zero for every source on this page whose peak is outside the visible band.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'src', type: 'select', label: 'Source', options: Object.keys(UVIR).map(k => [UVIR[k].name, k]), value: params.src || 'c254' },
        { id: 'eye', type: 'check', label: 'Show the eye and the camera sensor', value: true },
        { id: 'note', type: 'html', html: '' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['peak', 'Strongest wavelength'], ['photon', 'Photon energy'], ['band', 'Band'], ['eye', 'Sensitivity of the eye there'], ['lm', 'Lumens per radiated watt'], ['cam', 'A silicon camera sensor'], ['haz', 'Hazard']]);
      const NM0 = 100, NM1 = 20000, NS = 300, L0 = Math.log10(NM0), L1 = Math.log10(NM1);
      const nmAt = i => Math.pow(10, L0 + (i + 0.5) / NS * (L1 - L0));
      const calc = memo();
      const model = () => calc(V.src, () => {
        const u = UVIR[V.src], spec = u.specId ? Ph.spectrum(u.specId) : u.spec, v = []; let mx = 0, pk = 0;
        for (let i = 0; i < NS; i++) { const s = spec(nmAt(i)); v.push(s); if (s > mx) { mx = s; pk = nmAt(i); } }
        // refine the peak of a narrow line
        let best = pk, bv = spec(pk); for (let nm = pk * 0.97; nm <= pk * 1.03; nm += pk * 0.0005) { const s = spec(nm); if (s > bv) { bv = s; best = nm; } }
        return { u, vals: v.map(s => mx > 0 ? s / mx : 0), peak: best };
      });
      const BANDS = [['UV-C', 100, 280, 'rgba(160,80,220,0.55)'], ['UV-B', 280, 315, 'rgba(130,90,230,0.55)'], ['UV-A', 315, 380, 'rgba(100,100,240,0.5)'], ['visible', 380, 780, null], ['NIR', 780, 1400, 'rgba(220,100,70,0.5)'], ['SWIR', 1400, 3000, 'rgba(210,80,60,0.45)'], ['MWIR', 3000, 8000, 'rgba(190,70,60,0.4)'], ['LWIR', 8000, 15000, 'rgba(170,60,60,0.35)'], ['far IR', 15000, 20000, 'rgba(150,60,60,0.3)']];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = model();
        const r = { x: 54, y: 34, w: W - 54 - 20, h: Hh * 0.60 }, base = r.y + r.h, X = nm => r.x + (Math.log10(nm) - L0) / (L1 - L0) * r.w;
        c.fillStyle = C.dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; c.fillRect(r.x, r.y, r.w, r.h);
        const bw = r.w / NS;
        for (let i = 0; i < NS; i++) { const v = M.vals[i]; if (!(v > 0.003)) continue; const nm = nmAt(i), hh = v * r.h; c.fillStyle = S.nm(nm, 0.9); c.fillRect(r.x + i * bw, base - hh, bw + 0.7, hh); }
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); for (let i = 0; i < NS; i++) { const x = r.x + (i + 0.5) * bw, y = base - M.vals[i] * r.h; if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke();
        if (V.eye) {
          c.save(); c.lineWidth = 1.6; c.setLineDash([5, 4]); c.strokeStyle = C.warn; c.beginPath(); for (let i = 0; i < NS; i++) { const x = r.x + (i + 0.5) * bw, y = base - Ph.V(nmAt(i)) * r.h; if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke();
          c.setLineDash([2, 3]); c.strokeStyle = C.ok; c.beginPath(); for (let i = 0; i < NS; i++) { const x = r.x + (i + 0.5) * bw, y = base - SIBAND(nmAt(i)) / 0.85 * r.h; if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke(); c.restore();
          kit.label(c, 'eye', X(555), base - r.h - 6, { align: 'center', size: 11, color: C.warn }); kit.label(c, 'silicon camera', X(700), base - r.h * 0.72, { size: 11, color: C.ok });
        }
        // the axis and the bands under it
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(r.x, base); c.lineTo(r.x + r.w, base); c.stroke();
        for (const nm of [100, 200, 500, 1000, 2000, 5000, 10000, 20000]) { const x = X(nm); c.beginPath(); c.moveTo(x, base); c.lineTo(x, base + 4); c.stroke(); kit.label(c, nm >= 1000 ? (nm / 1000) + ' µm' : nm + ' nm', x, base + 14, { align: 'center', size: 10.5, color: C.faint }); }
        BANDS.forEach(([name, lo, hi, fill]) => {
          const x1 = X(lo), x2 = X(hi), y = base + 26;
          if (fill) { c.fillStyle = fill; c.fillRect(x1, y, x2 - x1, 16); } else S.spectrum(c, x1, y, x2 - x1, 16, 380, 780);
          c.strokeStyle = C.axis; c.strokeRect(x1, y, x2 - x1, 16);
          if (x2 - x1 > 26) kit.label(c, name, (x1 + x2) / 2, y + 8, { align: 'center', size: 10.5, color: name === 'visible' ? '#fff' : C.text, weight: 600 });
        });
        // the marker of the source
        const xp = X(M.peak); c.strokeStyle = C.accent; c.lineWidth = 1.6; c.beginPath(); c.moveTo(xp, r.y); c.lineTo(xp, base); c.stroke();
        kit.label(c, fx(M.peak, 0) + ' nm', xp + (xp > r.x + r.w * 0.8 ? -6 : 6), r.y + 10, { align: xp > r.x + r.w * 0.8 ? 'right' : 'left', size: 11.5, color: C.accent, weight: 650 });
        kit.label(c, M.u.name, r.x, 16, { size: 12.5, weight: 650 });
        const vEye = Ph.V(M.peak), qe = SIBAND(M.peak), band = O.BANDS.find(b => M.peak >= b[2] && M.peak < b[3]);
        ro.set('peak', fx(M.peak, 0) + ' nm' + (M.peak >= 1000 ? '  (' + fx(M.peak / 1000, 2) + ' µm)' : ''));
        ro.set('photon', fx(O.photonEnergy(M.peak), 2) + ' eV');
        ro.set('band', band ? band[1] : 'far infrared');
        ro.set('eye', vEye < 1e-4 ? 'none: the light is invisible' : fx(vEye * 100, 0) + ' % of the peak');
        ro.set('lm', fx(683 * vEye, 0) + ' lm/W');
        ro.set('cam', qe > 0.02 ? 'responds (quantum efficiency about ' + fx(qe * 100, 0) + ' %)' : 'does not respond');
        ro.set('haz', M.u.haz);
        ctl.set('note', M.u.note);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
