/* HYPER-WATER · sims/older-than-the-sun.js — the simulations of the topic "Older than the Sun".
 *   cos-grain-ice        atoms land on a 10 K dust grain and build an ice mantle (schematic grain-surface chemistry)
 *   cos-reservoir        the water of the worlds and of the quasar on one scale, with the light-travel timeline
 *   cos-deuterium-clock  every body's D/H on a logarithmic scale, with the oceans' band and δD
 *   cos-inheritance      inherited ice and water remade in the disc: the D/H of the mixture (schematic)
 *   cos-snow-line        a star's luminosity and a disc's vapour pressure set the snow line; the habitable zone beside it
 *   cos-water-mix        which mixture of chondrites, comets and nebular water matches the oceans' deuterium
 *   cos-hydrogen-escape  Jeans escape and Rayleigh fractionation: how a planet's D/H rises as it loses hydrogen
 *   cos-habitable-zone   the habitable zone and the snow line by star and by age, with known planets placed
 * Numbers: kit.water (D/H table, worlds, sublimation pressure, equilibrium temperature, snow line, habitable zone).
 * Local models, labelled schematic in the blurbs: the grain chemistry, the disc inheritance, the escape history.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const kB = 1.380649e-23, AMU = 1.66053906660e-27, GG = 6.6743e-11, AUM = 1.495978707e11;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lg = Math.log10;
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  const sup = n => String(n).split('').map(c => SUP[c] || c).join('');
  /* 5.3×10⁻⁴ */
  function sci(v, d) {
    if (!Number.isFinite(v) || v === 0) return '0';
    let e = Math.floor(lg(Math.abs(v)));
    let m = v / Math.pow(10, e);
    const s = m.toFixed(d == null ? 1 : d);
    if (parseFloat(s) >= 10) { m /= 10; e += 1; }
    return (m).toFixed(d == null ? 1 : d) + '×10' + sup(e);
  }
  /* a simple seeded random generator, so that scenes are the same on every reset */
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  const rnd = Math.random;

  /* ================================================================ 1. a grain builds ice */
  Hyper.sim('cos-grain-ice', {
    title: 'A dust grain builds an ice mantle',
    blurb: `A speck of dust in a dark cloud, seen very much enlarged. Oxygen atoms (red) and hydrogen atoms (white) arrive from the gas and stick; hydrogen wanders over the surface until it meets an oxygen. **O + H → OH**, then **OH + H → H₂O**, and the new molecule joins the ice mantle (blue dots). Two hydrogens that meet make H₂ and leave. This is a *cartoon*: real arrivals are days apart, and the simulation speeds time up by a factor of about a million; the reaction rules and the temperature thresholds are schematic.

**Try this**
- At **10 K** everything sticks and the mantle grows steadily. Watch hydrogen hop about and find its partners.
- Raise the grain to **30 K**: hydrogen no longer stays long enough to find oxygen, and the water factory stops. That is why the chemistry needs a *cold* dark cloud.
- At **60 K** even oxygen leaves. At about **100 K** (the read-out gives the exact value for these densities) the ice itself evaporates.
- Make hydrogen scarce (1 per oxygen): oxygen atoms pile up as OH, waiting for a second hydrogen.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Grain temperature', min: 8, max: 150, step: 1, value: params.T || 10, unit: 'K' },
        { id: 'o', label: 'Oxygen atoms arriving', min: 0.2, max: 6, step: 0.1, value: 2, unit: '/s' },
        { id: 'hr', label: 'Hydrogen atoms per oxygen', min: 1, max: 20, step: 1, value: 6 },
        { id: 'speed', label: 'Time speed', min: 0.5, max: 4, step: 0.5, value: 1, unit: '×' },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clean the grain', primary: true }] }
      ], (id) => { if (id === 'clear') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['water', 'Water molecules in the mantle'], ['oh', 'OH waiting on the surface'], ['h2', 'H₂ made and lost'], ['layers', 'Layers of ice (cartoon grain)'], ['real', 'On a real grain this takes'], ['state', 'The ice at this temperature']]);
      /* the ice survives while the vapour pressure over it is below the pressure of the water vapour in the gas (1 molecule per cm³) */
      const nVap = 1e6;
      const Tsub = W.bisect(T => Math.log(W.sublimationPressure(T - 273.15)) - Math.log(nVap * kB * T), 60, 250);
      /* a real grain: a = 0.1 µm, 1 oxygen atom per cm³ at 10 K */
      const vO = Math.sqrt(8 * kB * 10 / (Math.PI * 15.999 * AMU));
      const gammaO = 1e6 * Math.PI * 1e-14 * vO;   // landings per second
      let gas, surf, ice, nWater, nH2, spawnO, spawnH, tClock;
      function reset() { gas = []; surf = []; ice = []; nWater = 0; nH2 = 0; spawnO = 0; spawnH = 0; tClock = 0; }
      reset();
      const loop = kit.loop((dt0) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const dt = dt0 * V.speed, T = V.T;
        const cx = Wd * 0.42, cy = Hh * 0.5, r0 = Math.min(Wd * 0.17, Hh * 0.24);
        const thick = r0 * 0.55 * (1 - Math.exp(-nWater / 220));
        const Rm = r0 + thick;
        const Rspawn = Math.hypot(Wd, Hh) * 0.5;
        /* arrivals */
        if (nWater < 2500) { spawnO += dt * V.o; spawnH += dt * V.o * V.hr; }
        while (spawnO >= 1 && gas.length < 160) { spawnO -= 1; const a = rnd() * TAU; gas.push({ k: 'O', x: cx + Rspawn * Math.cos(a), y: cy + Rspawn * Math.sin(a), vx: 0, vy: 0, a }); }
        while (spawnH >= 1 && gas.length < 160) { spawnH -= 1; const a = rnd() * TAU; gas.push({ k: 'H', x: cx + Rspawn * Math.cos(a), y: cy + Rspawn * Math.sin(a), vx: 0, vy: 0, a }); }
        if (spawnO > 3) spawnO = 0; if (spawnH > 12) spawnH = 0;
        const stickH = T <= 14 ? 1 : T >= 30 ? 0 : (30 - T) / 16;
        const stickO = T <= 60 ? 1 : T >= 110 ? 0 : (110 - T) / 50;
        for (let i = gas.length - 1; i >= 0; i--) {
          const g = gas[i];
          const sp = g.k === 'H' ? 170 : 110;
          if (g.out) { g.x += g.vx * dt; g.y += g.vy * dt; if (Math.hypot(g.x - cx, g.y - cy) > Rspawn + 20) gas.splice(i, 1); continue; }
          const dx = cx - g.x, dy = cy - g.y, d = Math.hypot(dx, dy) || 1;
          g.x += dx / d * sp * dt; g.y += dy / d * sp * dt;
          if (d <= Rm + 3) {
            if (rnd() < (g.k === 'H' ? stickH : stickO) && surf.length < 400) surf.push({ k: g.k, th: Math.atan2(g.y - cy, g.x - cx) });
            else { g.out = true; g.vx = -dx / d * 120; g.vy = -dy / d * 120; }
            if (!g.out) gas.splice(i, 1);
          }
        }
        /* the surface */
        const kd = (k) => k === 'H' ? 0.02 * Math.exp((T - 18) / 4) : k === 'O' ? 0.01 * Math.exp((T - 60) / 6) : 0.002 * Math.exp((T - 80) / 6);
        for (let i = surf.length - 1; i >= 0; i--) {
          const s = surf[i];
          if (s.k === 'H') s.th += (rnd() - 0.5) * 2 * 3.2 * Math.sqrt(dt);
          else if (s.k === 'O') s.th += (rnd() - 0.5) * 2 * 0.25 * Math.sqrt(dt);
          if (rnd() < 1 - Math.exp(-kd(s.k) * dt)) surf.splice(i, 1);
        }
        const near = (a, b) => { let d = Math.abs(a - b) % TAU; if (d > Math.PI) d = TAU - d; return d * Rm; };   // arc length in px
        for (let i = 0; i < surf.length; i++) {
          const h = surf[i];
          if (h.k !== 'H' || h.dead) continue;
          let hit = -1;
          for (let j = 0; j < surf.length; j++) {
            const o = surf[j];
            if (j !== i && !o.dead && o.k !== 'H' && near(h.th, o.th) <= 9) { hit = j; break; }
          }
          if (hit >= 0) {
            const o = surf[hit];
            if (o.k === 'O') o.k = 'OH';
            else { ice.push({ th: o.th, r: rnd() }); nWater++; o.dead = true; }
            h.dead = true;
            continue;
          }
          for (let j = i + 1; j < surf.length; j++) {
            const o = surf[j];
            if (o.k === 'H' && !o.dead && near(h.th, o.th) < 6) { h.dead = true; o.dead = true; nH2++; break; }
          }
        }
        surf = surf.filter(s => !s.dead);
        /* the ice evaporates above the sublimation temperature */
        if (T > Tsub && nWater > 0) {
          const n = Math.min(nWater, Math.floor(dt * (4 + 4 * (T - Tsub)) + rnd()));
          for (let i = 0; i < n; i++) { ice.splice(Math.floor(rnd() * ice.length), 1); nWater--; }
        }
        /* draw */
        c.save();
        c.beginPath(); c.arc(cx, cy, Rm, 0, TAU); c.fillStyle = C.accent; c.globalAlpha = 0.22; c.fill(); c.globalAlpha = 1;
        c.strokeStyle = C.accent; c.lineWidth = 1.2; c.stroke();
        c.beginPath(); c.arc(cx, cy, r0, 0, TAU); c.fillStyle = C.faint; c.globalAlpha = 0.85; c.fill(); c.globalAlpha = 1;
        c.strokeStyle = C.muted; c.lineWidth = 1; c.stroke();
        const R2 = rng(7);
        for (let i = 0; i < 14; i++) { const a = R2() * TAU, rr = R2() * r0 * 0.8; kit.dot(c, cx + rr * Math.cos(a), cy + rr * Math.sin(a), 2 + R2() * 4, C.muted); }
        c.restore();
        for (const w of ice) kit.dot(c, cx + (r0 + 3 + (Rm - r0 - 4) * w.r) * Math.cos(w.th), cy + (r0 + 3 + (Rm - r0 - 4) * w.r) * Math.sin(w.th), 2.1, C.accent);
        let nOH = 0;
        for (const s of surf) {
          const x = cx + (Rm + 4) * Math.cos(s.th), y = cy + (Rm + 4) * Math.sin(s.th);
          if (s.k === 'H') kit.dot(c, x, y, 2.6, '#e9eef3', '#9aa4ad');
          else { kit.dot(c, x, y, 4.2, '#e8503a'); if (s.k === 'OH') { kit.dot(c, x + 4 * Math.cos(s.th), y + 4 * Math.sin(s.th), 2.4, '#e9eef3', '#9aa4ad'); nOH++; } }
        }
        for (const g of gas) { if (g.k === 'H') kit.dot(c, g.x, g.y, 2.4, '#e9eef3', '#9aa4ad'); else kit.dot(c, g.x, g.y, 4, '#e8503a'); }
        // the chain, at the right
        const bx = Wd * 0.72;
        kit.label(c, 'On the grain', bx, 28, { weight: 700, size: 12.5, color: C.text });
        kit.label(c, '1   O + H → OH', bx, 50, { size: 12, color: C.muted });
        kit.label(c, '2   OH + H → H₂O  (joins the ice)', bx, 68, { size: 12, color: C.muted });
        kit.label(c, '3   H + H → H₂  (lost to the gas)', bx, 86, { size: 12, color: C.muted });
        kit.dot(c, bx - 12, Hh - 52, 4.2, '#e8503a'); kit.label(c, 'oxygen', bx - 3, Hh - 52, { size: 11.5, color: C.muted });
        kit.dot(c, bx - 12, Hh - 34, 2.6, '#e9eef3', '#9aa4ad'); kit.label(c, 'hydrogen', bx - 3, Hh - 34, { size: 11.5, color: C.muted });
        kit.dot(c, bx - 12, Hh - 16, 2.2, C.accent); kit.label(c, 'water in the ice', bx - 3, Hh - 16, { size: 11.5, color: C.muted });
        kit.label(c, T < 20 ? 'cold: atoms stay where they land' : T < Tsub ? 'warm: light atoms leave before they react' : 'hot: the ice evaporates', 14, Hh - 14, { size: 12, color: C.muted });
        tClock += dt;
        ro.set('water', String(nWater));
        ro.set('oh', String(nOH));
        ro.set('h2', String(nH2));
        ro.set('layers', (nWater / 60).toFixed(1) + ' (60 sites per layer)');
        const days = nWater / gammaO / 86400;
        ro.set('real', nWater === 0 ? '—' : days < 730 ? Math.round(days) + ' days of oxygen supply' : (days / 365.25).toFixed(1) + ' years of oxygen supply');
        ro.set('state', T < Tsub ? 'stable (below ' + Tsub.toFixed(0) + ' K)' : 'evaporating (above ' + Tsub.toFixed(0) + ' K)');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 2. the reservoirs */
  Hyper.sim('cos-reservoir', {
    title: 'The largest reservoir of water',
    blurb: `The water of the worlds on one scale: the volume of every world in the data set, as ice and liquid (the quasar's as vapour). On the **logarithmic** scale each step to the right is a factor of ten; the quasar's vapour is twenty-three powers of ten beyond the comet and fourteen beyond the oceans of Earth. Tick *linear* and every bar vanishes but the quasar's.

The timeline underneath shows when the light left: the universe was **1.6 billion years** old, and the light has travelled for about 12 billion.

**Try this**
- Compare with Earth's oceans, then with Europa: how many oceans of Europa's size would fill the quasar's reservoir?
- Select the Moon's ice and read its mass in kilograms: one cubic kilometre of ice is a billion tonnes.
- The molecules read-out is what the detection actually counted: lines from some 10⁶¹ molecules.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const items = W.WORLDS.filter(w => w.km3 > 0).slice().sort((a, b) => a.km3 - b.km3);
      const ids = items.map(w => w.id);
      const ctl = kit.controls(box.side, [
        { id: 'sel', type: 'select', label: 'Highlight', options: items.map(w => [w.name, w.id]), value: ids.indexOf(params.sel) >= 0 ? params.sel : 'quasar' },
        { id: 'ref', type: 'select', label: 'Compare with', options: [['Earth\'s oceans', 'earth'], ['Europa', 'europa'], ['Mars (ice today)', 'mars'], ['The Moon\'s polar ice', 'moon']], value: 'earth' },
        { id: 'lin', type: 'check', label: 'Linear scale', value: false }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['vol', 'Volume of water'], ['mass', 'Mass'], ['x', 'Times the comparison'], ['oc', 'In Earth oceans'], ['mol', 'Molecules'], ['sun', 'In solar masses'], ['src', 'From']]);
      const KG = 1e12;      // kilograms in a cubic kilometre of water
      const find = id => items.find(w => w.id === id) || items[0];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const x0 = 150, x1 = Wd - 90, top = 16, bot = Hh - 74;
        const n = items.length, rowH = (bot - top) / n;
        const maxv = items[n - 1].km3;
        const px = v => V.lin ? x0 + (x1 - x0) * v / maxv : x0 + (x1 - x0) * clamp(lg(v) / 24, 0, 1);
        // decade grid on the log scale
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1;
        if (!V.lin) for (let e = 0; e <= 24; e += 3) { const x = Math.round(px(Math.pow(10, e))) + 0.5; c.beginPath(); c.moveTo(x, top); c.lineTo(x, bot); c.stroke(); kit.label(c, '10' + sup(e), x, bot + 11, { size: 10.5, color: C.faint, align: 'center' }); }
        c.restore();
        kit.label(c, V.lin ? 'volume (linear), km³' : 'volume of water, km³ (log scale)', (x0 + x1) / 2, bot + 26, { size: 11, color: C.muted, align: 'center' });
        const ref = find(V.ref);
        items.forEach((w, i) => {
          const y = top + i * rowH, h = Math.max(5, rowH * 0.62);
          const on = w.id === V.sel;
          const col = w.id === 'quasar' ? C.warn : on ? C.accent : C.series[0];
          c.save(); c.globalAlpha = on || w.id === 'quasar' ? 1 : 0.55; c.fillStyle = col;
          c.fillRect(x0, y + (rowH - h) / 2, Math.max(1.5, px(w.km3) - x0), h); c.restore();
          kit.label(c, w.name.replace(/ \(.*/, ''), x0 - 8, y + rowH / 2, { size: 11.5, align: 'right', color: on ? C.text : C.muted, weight: on ? 700 : 500 });
          kit.label(c, sci(w.km3, 1), Math.min(px(w.km3) + 6, Wd - 80), y + rowH / 2, { size: 10.5, color: C.faint });
        });
        // the comparison marker
        const rx = Math.round(px(ref.km3)) + 0.5;
        c.save(); c.setLineDash([4, 3]); c.strokeStyle = C.ok; c.lineWidth = 1.5; c.beginPath(); c.moveTo(rx, top - 4); c.lineTo(rx, bot); c.stroke(); c.restore();
        kit.label(c, 'comparison', rx, top - 8 < 8 ? 8 : top - 8, { size: 10.5, color: C.ok, align: 'center' });
        // the timeline: the universe is 13.8 billion years old; the light left at 1.6
        const ty = Hh - 24, tx0 = 30, tx1 = Wd - 30, age = 13.8, left = 1.6;
        const tpx = t => tx0 + (tx1 - tx0) * t / age;
        c.save(); c.fillStyle = C.grid; c.fillRect(tx0, ty - 4, tx1 - tx0, 8);
        c.fillStyle = C.warn; c.fillRect(tpx(left), ty - 4, tpx(age) - tpx(left), 8); c.restore();
        kit.dot(c, tpx(left), ty, 5, C.warn); kit.dot(c, tpx(age), ty, 5, C.accent);
        kit.label(c, 'Big Bang', tx0, ty + 16, { size: 10.5, color: C.faint });
        kit.label(c, 'light leaves the quasar: universe 1.6 billion years old', tpx(left), ty - 14, { size: 10.5, color: C.warn });
        kit.label(c, 'now', tpx(age), ty + 16, { size: 10.5, color: C.accent, align: 'right' });
        kit.label(c, 'travelling for about 12 billion years', (tpx(left) + tpx(age)) / 2, ty + 16, { size: 10.5, color: C.muted, align: 'center' });
        // read-outs
        const w = find(V.sel), mass = w.km3 * KG;
        ro.set('vol', sci(w.km3, 2) + ' km³');
        ro.set('mass', sci(mass, 2) + ' kg');
        ro.set('x', w.km3 / ref.km3 >= 100 ? sci(w.km3 / ref.km3, 1) : (w.km3 / ref.km3).toPrecision(3));
        ro.set('oc', w.km3 / W.WORLDS[0].km3 >= 1000 ? sci(w.km3 / W.WORLDS[0].km3, 1) : (w.km3 / W.WORLDS[0].km3).toPrecision(3));
        ro.set('mol', sci(W.molecules(mass), 1));
        ro.set('sun', mass > 1e26 ? sci(mass / 1.98847e30, 1) : '—');
        ro.set('src', w.src);
      }, box.stage);
      loop.start(); loop.once();
    }
  });

  /* ================================================================ 3. the deuterium clock */
  Hyper.sim('cos-deuterium-clock', {
    title: 'The deuterium clock',
    blurb: `The deuterium-to-hydrogen ratio of water in twenty places, on a logarithmic scale: each tick is a factor of ten. The shaded band is Earth's oceans (VSMOW, 1.56 × 10⁻⁴). Click a dot, or choose a body, to read its ratio, how many times the oceans' it is, its δD and the temperature at which cold chemistry in equilibrium would give that much enrichment over the Sun's own gas.

**Try this**
- Find the gas giants and the protosolar nebula at the far left: the Sun's hydrogen, $2\\times10^{-5}$.
- Compare the Earth's band with the carbonaceous meteorites and the two Earth-like comets, Hartley 2 and Wirtanen: the same neighbourhood.
- Note Halley, Hale–Bopp and 67P to the right, and the protostellar cores far beyond: cold, inherited ice.
- Venus is off the right of the comets by a factor of a hundred. It is not cold: it is a planet that lost most of its hydrogen ([[venus-lost-its-ocean]]).
- Tick *ratio to oceans* to add a second scale.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const ROWS = [['giant', 'Sun and giant planets'], ['standard', 'Earth\'s oceans'], ['meteorite', 'Meteorites'], ['moon', 'Moons'], ['jfc', 'Jupiter-family comets'], ['oort', 'Oort-cloud comets'], ['planet', 'Planet atmospheres'], ['ism', 'Protostellar cores']];
      const dat = W.DH.slice();
      const ctl = kit.controls(box.side, [
        { id: 'body', type: 'select', label: 'Body', options: dat.map(d => [d.name, d.id]), value: dat.some(d => d.id === params.body) ? params.body : '67p' },
        { id: 'rel', type: 'check', label: 'Add the ratio-to-oceans scale', value: true }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dh', 'D/H'], ['rel', 'Times Earth\'s oceans'], ['dD', 'δD'], ['T', 'Cold-chemistry temperature'], ['src', 'Measured by']]);
      const posOf = [];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const x0 = 150, x1 = Wd - 20, top = V.rel ? 34 : 14, bot = Hh - 34;
        const e0 = -5, e1 = -1.5;
        const px = v => x0 + (x1 - x0) * (lg(v) - e0) / (e1 - e0);
        const rowH = (bot - top) / ROWS.length;
        // Earth's band
        c.save(); c.fillStyle = C.accent; c.globalAlpha = 0.14;
        c.fillRect(px(W.VSMOW * 0.9), top, px(W.VSMOW * 1.1) - px(W.VSMOW * 0.9), bot - top); c.restore();
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let e = -5; e <= -2; e++) { const x = Math.round(px(Math.pow(10, e))) + 0.5; c.beginPath(); c.moveTo(x, top); c.lineTo(x, bot); c.stroke(); kit.label(c, '10' + sup(e), x, bot + 12, { size: 10.5, color: C.faint, align: 'center' }); }
        for (let i = 0; i <= ROWS.length; i++) { const y = Math.round(top + i * rowH) + 0.5; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); }
        c.restore();
        kit.label(c, 'D/H of the water (log scale)', (x0 + x1) / 2, bot + 26, { size: 11, color: C.muted, align: 'center' });
        if (V.rel) {
          for (const k of [0.1, 1, 10, 100]) { const x = px(W.VSMOW * k); kit.label(c, (k === 1 ? '1 = oceans' : '×' + k), x, 14, { size: 10.5, color: C.accent, align: 'center' }); }
        }
        kit.label(c, 'Earth\'s oceans', px(W.VSMOW), bot - 7, { size: 10, color: C.accent, align: 'center' });
        posOf.length = 0;
        const counts = {};
        ROWS.forEach(([kind, name], ri) => {
          const y0 = top + ri * rowH;
          kit.label(c, name, x0 - 8, y0 + rowH / 2, { size: 11.5, align: 'right', color: C.muted });
          const list = dat.filter(d => d.kind === kind);
          list.forEach((d, i) => {
            const jitter = list.length > 1 ? (i - (list.length - 1) / 2) * Math.min(9, (rowH - 8) / list.length) : 0;
            const x = px(d.dh), y = y0 + rowH / 2 + jitter;
            posOf.push({ id: d.id, x, y });
            const on = d.id === V.body;
            kit.dot(c, x, y, on ? 7 : 4.6, C.series[ri % C.series.length], on ? C.text : null);
            if (on) kit.label(c, d.name.replace(/ \(.*/, ''), clamp(x, x0 + 70, x1 - 70), y - 13, { size: 11, align: 'center', weight: 700, bg: C.bg2 });
          });
        });
        const d = dat.find(q => q.id === V.body) || dat[0];
        ro.set('dh', sci(d.dh, 2));
        ro.set('rel', (d.dh / W.VSMOW >= 10 ? (d.dh / W.VSMOW).toFixed(0) : (d.dh / W.VSMOW).toFixed(2)) + ' ×');
        const dD = (d.dh / W.VSMOW - 1) * 1000;
        ro.set('dD', (dD >= 0 ? '+' : '−') + Math.abs(dD).toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' ‰');
        const f = d.dh / 2.1e-5;
        ro.set('T', f > 1.05 ? (232 / Math.log(f)).toFixed(0) + ' K  (for ' + f.toFixed(1) + '× the Sun\'s gas)' : 'at or below the Sun\'s gas');
        ro.set('src', d.src);
      }, box.stage);
      kit.click(st, p => {
        let best = null, bd = 1e9;
        for (const q of posOf) { const dd = Math.hypot(q.x - p.x, q.y - p.y); if (dd < bd) { bd = dd; best = q; } }
        if (best && bd < 16) { ctl.set('body', best.id, true); loop.once(); }
      }, p => posOf.some(q => Math.hypot(q.x - p.x, q.y - p.y) < 14));
      loop.start();
    }
  });

  /* ================================================================ 4. inheritance */
  Hyper.sim('cos-inheritance', {
    title: 'Inherited ice and water made at home',
    blurb: `A **schematic** model of the argument of Cleeves and colleagues (2014). The young star sits at the left of its disc. Each blue parcel of water is ice **inherited** from the parent cloud, with a high D/H; each grey parcel was **remade** in the disc by ionisation chemistry, with a low D/H. The D/H of the mixture is the average, weighted by the water in each, and the graph shows it against the inherited share.

The inherited fraction is the share of the cloud's ice that **survives the infall** times the share that is **not remade** by ionisation in the disc. The ionisation strength is in arbitrary units (1 = half of the ice remade). The numbers are illustrations of the logic, not the paper's.

**Try this**
- Start with the defaults: about 40 % inherited gives the oceans' D/H. Move the marker along the curve.
- Make the disc's ionisation weaker: more ice survives, and the mixture gets heavier than the oceans.
- Make the inherited ice heavier (a hot-corino value of 10⁻³): a smaller inherited share is then enough.
- Set the survival to zero: the disc's own water alone can never reach the oceans' ratio unless its chemistry is much colder than the young Sun allows.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220, maxH: 300 });
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px'; box.stage.appendChild(graph);
      const ctl = kit.controls(box.side, [
        { id: 'surv', label: 'Cloud ice surviving the infall', min: 0, max: 100, step: 1, value: 80, unit: '%' },
        { id: 'ion', label: 'Ionisation in the disc', min: 0.1, max: 10, value: 1, log: true, sig: 2 },
        { id: 'Ri', label: 'D/H of the cloud ice', min: 1e-4, max: 2e-3, value: 3.3e-4, log: true, sig: 2 },
        { id: 'Rd', label: 'D/H of water made in the disc', min: 2e-5, max: 1e-4, value: 3e-5, log: true, sig: 2 }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Inherited share'], ['R', 'D/H of the mixture'], ['x', 'Times Earth\'s oceans'], ['dD', 'δD'], ['need', 'Share needed to match the oceans'], ['verdict', 'Compared with the oceans'], ['age', 'How old the cloud ice is']]);
      const plot = kit.plot(graph, { x: { label: 'inherited share of the water', min: 0, max: 1 }, y: { label: 'D/H of the water', log: true, min: 1e-5, max: 2e-3 }, legend: true }, 190);
      const R = rng(11), parcels = [];
      for (let i = 0; i < 280; i++) parcels.push({ u: R(), a: R(), b: R() });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const g = V.ion / (V.ion + 1), f = clamp(V.surv / 100, 0, 1) * (1 - g);
        const Rm = V.Rd + f * (V.Ri - V.Rd);
        // the disc, seen from the side
        const xs = 40, xe = Wd - 16, cy = Hh * 0.5, hAt = x => 10 + 0.11 * (x - xs);
        c.save();
        c.beginPath(); c.moveTo(xs, cy - hAt(xs)); for (let x = xs; x <= xe; x += 8) c.lineTo(x, cy - hAt(x)); for (let x = xe; x >= xs; x -= 8) c.lineTo(x, cy + hAt(x)); c.closePath();
        c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.axis; c.lineWidth = 1; c.stroke();
        const xi = xs + (xe - xs) * 0.18;     // the inner disc, where the infall shock and the heat destroy the ice
        c.save(); c.clip(); c.fillStyle = C.warn; c.globalAlpha = 0.22; c.fillRect(xs, 0, xi - xs, Hh); c.restore();
        c.restore();
        for (const p of parcels) {
          const x = xi + 14 + (xe - xi - 28) * Math.pow(p.a, 0.8), y = cy + (p.b - 0.5) * 1.5 * hAt(x);
          kit.dot(c, x, y, 3.1, p.u < f ? C.accent : C.faint);
        }
        kit.dot(c, 20, cy, 12, '#f2c14e', C.warn);
        kit.label(c, 'young Sun', 20, cy + 24, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'ice destroyed, water remade', (xs + xi) / 2 + 8, 14, { size: 10.5, color: C.warn, align: 'center' });
        kit.label(c, 'cold outer disc', (xi + xe) / 2, 14, { size: 10.5, color: C.muted, align: 'center' });
        kit.dot(c, Wd - 200, Hh - 12, 4, C.accent); kit.label(c, 'inherited ice', Wd - 192, Hh - 12, { size: 10.5, color: C.muted });
        kit.dot(c, Wd - 100, Hh - 12, 4, C.faint); kit.label(c, 'remade in disc', Wd - 92, Hh - 12, { size: 10.5, color: C.muted });
        // the curve
        const pts = []; for (let i = 0; i <= 50; i++) { const q = i / 50; pts.push([q, V.Rd + q * (V.Ri - V.Rd)]); }
        plot.set({ series: [{ pts, label: 'D/H of the mixture', color: C.accent }], marks: [{ x: f, y: Rm, label: 'now', color: C.warn }], hlines: [{ y: W.VSMOW, label: 'Earth\'s oceans' }], vlines: [{ x: 0.3, label: '30 %' }, { x: 0.5, label: '50 %' }] });
        const need = (W.VSMOW - V.Rd) / (V.Ri - V.Rd);
        ro.set('f', (100 * f).toFixed(0) + ' %');
        ro.set('R', sci(Rm, 2));
        ro.set('x', (Rm / W.VSMOW).toFixed(2) + ' ×');
        const dD = (Rm / W.VSMOW - 1) * 1000;
        ro.set('dD', (dD >= 0 ? '+' : '−') + Math.abs(dD).toFixed(0) + ' ‰');
        ro.set('need', need > 1 ? 'more than all (the ice is too light)' : need < 0 ? 'none (disc water is already heavy enough)' : (100 * need).toFixed(0) + ' %');
        const ratio = Rm / W.VSMOW;
        ro.set('verdict', Math.abs(ratio - 1) <= 0.1 ? 'matches (within 10 %)' : ratio < 1 ? 'too light (' + ratio.toFixed(2) + '×)' : 'too heavy (' + ratio.toFixed(2) + '×)');
        ro.set('age', 'formed millions of years before the Sun');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 5. the snow line */
  Hyper.sim('cos-snow-line', {
    title: 'Where the ice survives',
    blurb: `A star of chosen luminosity warms the grains of its disc. The strip shows the disc on a **logarithmic** distance scale (each tick a factor of ten); the graph below it gives the temperature of a black grain against distance. Ice survives where that temperature is below the one at which the vapour pressure over ice drops to the pressure of water vapour in the disc. Beyond the **snow line** the disc is rock and ice; inside it, rock. The green bar is the habitable zone of the same star.

**Try this**
- Start with the Sun: the line falls at about 2.7 AU, just inside Ceres and Jupiter's orbit, with Earth, Venus and Mars inside it.
- Choose *Proxima Centauri*: the whole Solar System shrinks to a point; its snow line is at 0.11 AU.
- Lower the vapour pressure in the disc: ice then needs colder gas, and the line moves out.
- Tick the *young disc* box (schematic): accretion heating pushes the line out to many AU and it falls back over a few million years.
- Notice where the habitable zone sits relative to the snow line for a dim star and for a bright one.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 200, maxH: 270 });
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px'; box.stage.appendChild(graph);
      const STARS = [['Choose a star…', 0], ['The Sun now (1)', 1], ['The Sun at birth (0.71)', 0.714], ['Proxima Centauri (0.0017)', 0.0017], ['TRAPPIST-1 (0.00055)', 0.000553], ['Sirius A (25)', 25.4]];
      const ctl = kit.controls(box.side, [
        { id: 'star', type: 'select', label: 'Star', options: STARS, value: 0 },
        { id: 'L', label: 'Luminosity', min: 3e-4, max: 100, value: params.L || 1, log: true, sig: 3, unit: 'L☉' },
        { id: 'p', label: 'Water vapour pressure in the disc', min: 1e-6, max: 1e-2, value: 7.3e-4, log: true, sig: 2, unit: 'Pa' },
        { id: 'heat', type: 'check', label: 'Young disc: add accretion heating (schematic)', value: false },
        { id: 'age', label: 'Age of the disc', min: 0.1, max: 5, step: 0.1, value: 1, unit: 'Myr' }
      ], (id, v) => { if (id === 'star' && v > 0) ctl.set('L', v, false); if (id === 'heat') ctl.show('age', v); });
      ctl.show('age', false);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T1', 'Grain temperature at 1 AU'], ['Ts', 'Ice survives below'], ['ds', 'Snow line'], ['short', 'Rule of thumb, 2.7 AU × √L'], ['hz', 'Habitable zone'], ['pice', 'Vapour pressure over ice there']]);
      const plot = kit.plot(graph, { x: { label: 'distance from the star (AU)', log: true, min: 0.03, max: 150 }, y: { label: 'black-grain temperature (K)', log: true, min: 5, max: 2500 }, legend: true }, 190);
      const BODIES = [['Mercury', 0.387], ['Venus', 0.723], ['Earth', 1.0], ['Mars', 1.524], ['Ceres', 2.77], ['Jupiter', 5.2], ['Saturn', 9.58], ['Neptune', 30.07]];
      const dmin = 0.03, dmax = 150;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const L = V.L, s = V.heat ? 1 + 0.9 * Math.exp(-V.age / 1.5) : 1;
        const T1 = W.equilibriumTemperature(L, 1, 0) * s;
        const Ts = W.bisect(T => Math.log(W.sublimationPressure(T - 273.15)) - Math.log(V.p), 60, 260);
        const ds = Math.pow(T1 / Ts, 2), hz = W.habitableZone(L);
        const x0 = 26, x1 = Wd - 16;
        const px = d => x0 + (x1 - x0) * (lg(clamp(d, dmin, dmax)) - lg(dmin)) / (lg(dmax) - lg(dmin));
        // the two zones
        c.save(); c.globalAlpha = 0.2;
        c.fillStyle = C.warn; c.fillRect(x0, 0, px(ds) - x0, Hh - 40);
        c.fillStyle = C.accent; c.fillRect(px(ds), 0, x1 - px(ds), Hh - 40);
        c.restore();
        // ticks
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1;
        for (const d of [0.1, 1, 10, 100]) { const x = Math.round(px(d)) + 0.5; c.beginPath(); c.moveTo(x, 0); c.lineTo(x, Hh - 40); c.stroke(); kit.label(c, d + ' AU', x, Hh - 8, { size: 10.5, color: C.faint, align: 'center' }); }
        c.restore();
        // the habitable zone
        c.save(); c.fillStyle = C.ok; c.globalAlpha = 0.55; c.fillRect(px(hz.inner), Hh - 34, Math.max(2, px(hz.outer) - px(hz.inner)), 9); c.restore();
        kit.label(c, 'habitable zone', px(Math.sqrt(hz.inner * hz.outer)), Hh - 38, { size: 10, color: C.ok, align: 'center' });
        // the snow line
        c.save(); c.strokeStyle = C.text; c.lineWidth = 2; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(px(ds), 4); c.lineTo(px(ds), Hh - 40); c.stroke(); c.restore();
        kit.label(c, 'snow line  ' + (ds < 1 ? ds.toFixed(2) : ds.toFixed(1)) + ' AU', clamp(px(ds), 70, Wd - 70), 12, { size: 11.5, weight: 700, align: 'center', bg: C.bg2 });
        kit.label(c, 'rock only', Math.max(x0 + 30, px(ds) / 2 + x0 / 2), 34, { size: 11, color: C.warn, align: 'center' });
        kit.label(c, 'rock and ice', (px(ds) + x1) / 2, 34, { size: 11, color: C.accent, align: 'center' });
        // the Solar System for reference
        BODIES.forEach(([n, d], i) => {
          const x = px(d), yd = Hh * 0.5 + 9;
          kit.dot(c, x, yd, 3.5, C.text);
          kit.label(c, n, x, yd + (i % 2 ? 14 : -12), { size: 10, color: C.muted, align: 'center' });
        });
        kit.dot(c, 14, Hh * 0.5 + 9, 6, '#f2c14e', C.warn);
        kit.label(c, 'Solar System at today\'s distances', Wd / 2, Hh * 0.5 - 34, { size: 10.5, color: C.faint, align: 'center' });
        // the graph
        const pts = [];
        for (let i = 0; i <= 60; i++) { const d = dmin * Math.pow(dmax / dmin, i / 60); pts.push([d, W.equilibriumTemperature(L, d, 0) * s]); }
        plot.set({ series: [{ pts, label: 'black grain', color: C.warn }], hlines: [{ y: Ts, label: 'ice survives below ' + Ts.toFixed(0) + ' K' }], vlines: [{ x: ds, label: 'snow line' }] });
        ro.set('T1', T1.toFixed(0) + ' K');
        ro.set('Ts', Ts.toFixed(0) + ' K');
        ro.set('ds', (ds < 1 ? ds.toFixed(3) : ds.toFixed(2)) + ' AU');
        ro.set('short', W.snowLine(L).toFixed(W.snowLine(L) < 1 ? 3 : 2) + ' AU (for 170 K, no heating)');
        ro.set('hz', hz.inner.toFixed(hz.inner < 1 ? 3 : 2) + ' to ' + hz.outer.toFixed(hz.outer < 1 ? 3 : 2) + ' AU');
        ro.set('pice', sci(W.sublimationPressure(Ts - 273.15), 1) + ' Pa');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 6. which mixture of sources */
  Hyper.sim('cos-water-mix', {
    title: 'Mixing the oceans',
    blurb: `Four possible sources of the water in Earth's oceans, each with its own D/H: carbonaceous chondrites (1.4 × 10⁻⁴), enstatite chondrites (1.3 × 10⁻⁴), a comet of your choice, and water made from the Sun's own hydrogen (2.1 × 10⁻⁵). Choose how much of the water comes from each; the shares are shares of the **water**, not of the mass of the bodies. The resulting D/H is the weighted average, and the verdict compares it with the oceans' (1.56 × 10⁻⁴, shaded band: ±10 %).

**Try this**
- *All chondrites*: the ratio is a little light (0.9×) but close.
- *All comets*, one by one: Hartley 2 and Wirtanen pass, Halley and Hale–Bopp fail by a factor of two, 67P by three and a half.
- Begin with chondrites and add 67P water: how much can you add before the verdict turns to *too heavy*? The read-out gives the limit.
- *Enstatite + a little heavy water* is an illustration of the picture of Piani and colleagues: most of the water from Earth's own rock, a few per cent from a deuterium-richer source.
- Add nebular water, and watch the ratio fall away from the oceans.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const dh = id => W.DH.find(d => d.id === id).dh;
      const COM = [['Hartley 2 (Earth-like, 2011)', 'hartley'], ['46P/Wirtanen', 'wirtanen'], ['Halley', 'halley'], ['Hale–Bopp', 'halebopp'], ['67P (Rosetta, 2014)', '67p']];
      const PRE = [['Custom', 'custom'], ['All carbonaceous chondrites', 'cc'], ['95 % enstatite + 5 % heavy comet water', 'ec'], ['All comet water', 'com'], ['Nebular hydrogen only', 'neb']];
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Start from', options: PRE, value: 'custom' },
        { id: 'cc', label: 'Carbonaceous chondrites', min: 0, max: 100, step: 1, value: 90, unit: '%' },
        { id: 'ec', label: 'Enstatite chondrites', min: 0, max: 100, step: 1, value: 0, unit: '%' },
        { id: 'com', label: 'Comet water', min: 0, max: 100, step: 1, value: 10, unit: '%' },
        { id: 'comid', type: 'select', label: 'The comet', options: COM, value: '67p' },
        { id: 'neb', label: 'Nebular water', min: 0, max: 100, step: 1, value: 0, unit: '%' }
      ], (id, v) => {
        if (id !== 'pre') { if (id !== 'comid') V.pre = 'custom'; return; }
        const set = (a, b, c2, d2) => { ctl.set('cc', a); ctl.set('ec', b); ctl.set('com', c2); ctl.set('neb', d2); };
        if (v === 'cc') set(100, 0, 0, 0);
        else if (v === 'ec') { set(0, 95, 5, 0); ctl.set('comid', '67p'); }
        else if (v === 'com') set(0, 0, 100, 0);
        else if (v === 'neb') set(0, 0, 0, 100);
      });
      const V = ctl.values;
      if (params.preset === 'enstatite') { ctl.set('pre', 'ec'); ctl.set('cc', 0); ctl.set('ec', 95); ctl.set('com', 5); ctl.set('comid', '67p'); }
      const ro = kit.readout(box.side, [['sh', 'Shares of the water'], ['R', 'D/H of the mixture'], ['x', 'Times Earth\'s oceans'], ['dD', 'δD'], ['v', 'Verdict'], ['lim', 'Most comet water that keeps within 10 %']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const comet = dh(V.comid);
        const src = [{ n: 'carbonaceous chondrites', w: V.cc, R: dh('cc'), col: C.series[0] }, { n: 'enstatite chondrites', w: V.ec, R: dh('ec'), col: C.series[1] }, { n: 'comet', w: V.com, R: comet, col: C.series[2] }, { n: 'nebular water', w: V.neb, R: 2.1e-5, col: C.series[3] }];
        const tot = src.reduce((a, s) => a + s.w, 0);
        const Rm = tot > 0 ? src.reduce((a, s) => a + s.w * s.R, 0) / tot : NaN;
        // a stacked bar of the shares
        const bx = 30, bw = Wd - 60, by = 24, bh = 34;
        kit.label(c, 'Where the water comes from', bx, 10, { size: 11.5, weight: 700 });
        let xx = bx;
        c.save(); c.strokeStyle = C.axis; c.strokeRect(bx + 0.5, by + 0.5, bw, bh);
        if (tot > 0) for (const s of src) {
          const w = bw * s.w / tot; if (w < 0.5) continue;
          c.fillStyle = s.col; c.globalAlpha = 0.85; c.fillRect(xx, by, w, bh); c.globalAlpha = 1;
          if (w > 60) kit.label(c, s.n + ' ' + Math.round(100 * s.w / tot) + ' %', xx + w / 2, by + bh / 2, { size: 10.5, align: 'center', color: '#fff', weight: 650 });
          xx += w;
        }
        c.restore();
        // the scale
        const x0 = 30, x1 = Wd - 24, y0 = 110, yb = Hh - 54;
        const e0 = -5, e1 = -3, px = v => x0 + (x1 - x0) * (lg(clamp(v, 1e-5, 1e-3)) - e0) / (e1 - e0);
        c.save(); c.fillStyle = C.accent; c.globalAlpha = 0.16; c.fillRect(px(W.VSMOW * 0.9), y0 - 14, px(W.VSMOW * 1.1) - px(W.VSMOW * 0.9), yb - y0 + 28); c.restore();
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb); c.stroke();
        for (let e = -5; e <= -3; e++) {
          for (const m of [1, 2, 3, 5]) { const v = m * Math.pow(10, e); if (v > 1e-3) continue; const x = px(v); c.beginPath(); c.moveTo(x, yb); c.lineTo(x, yb + (m === 1 ? 6 : 3)); c.stroke(); if (m === 1 || m === 3) kit.label(c, m + '×10' + sup(e), x, yb + 16, { size: 10, color: C.faint, align: 'center' }); }
        }
        c.restore();
        kit.label(c, 'D/H of the water (log scale)', (x0 + x1) / 2, yb + 34, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'Earth\'s oceans ±10 %', px(W.VSMOW), y0 - 22, { size: 10.5, color: C.accent, align: 'center' });
        const marks = [['carbonaceous chondrites', dh('cc'), C.series[0], 0], ['enstatite chondrites', dh('ec'), C.series[1], 1], ['the comet', comet, C.series[2], 0], ['nebular water', 2.1e-5, C.series[3], 0]];
        marks.forEach(([n, R, col, row]) => {
          const x = px(R), y = yb - 16 - row * 24;
          c.save(); c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(x, yb); c.lineTo(x, y + 8); c.stroke(); c.restore();
          kit.dot(c, x, y + 8, 4, col);
          kit.label(c, n, clamp(x, x0 + 50, x1 - 50), y - 4, { size: 10, color: C.muted, align: 'center' });
        });
        if (Number.isFinite(Rm)) {
          const x = px(Rm);
          c.save(); c.fillStyle = C.warn; c.beginPath(); c.moveTo(x, yb - 2); c.lineTo(x - 8, yb - 22); c.lineTo(x + 8, yb - 22); c.closePath(); c.fill(); c.restore();
          kit.label(c, 'the mixture', clamp(x, x0 + 40, x1 - 40), y0 + 4, { size: 11.5, weight: 700, color: C.warn, align: 'center' });
        }
        // read-outs
        ro.set('sh', tot > 0 ? src.map(s => Math.round(100 * s.w / tot)).join(' / ') + ' %  (cc / ec / comet / nebula)' : '—');
        if (Number.isFinite(Rm)) {
          const q = Rm / W.VSMOW, dD = (q - 1) * 1000;
          ro.set('R', sci(Rm, 2));
          ro.set('x', q.toFixed(2) + ' ×');
          ro.set('dD', (dD >= 0 ? '+' : '−') + Math.abs(dD).toFixed(0) + ' ‰');
          ro.set('v', Math.abs(q - 1) <= 0.1 ? 'matches the oceans (within 10 %)' : q < 1 ? 'too light' : 'too heavy');
        } else { ro.set('R', '—'); ro.set('x', '—'); ro.set('dD', '—'); ro.set('v', 'choose a source'); }
        const base = dh('cc'), lim = comet > base ? (1.1 * W.VSMOW - base) / (comet - base) : NaN;
        ro.set('lim', comet <= 1.1 * W.VSMOW ? 'any share (this comet is within 10 %)' : lim > 0 ? (100 * lim).toFixed(0) + ' % (rest chondritic)' : '—');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 7. hydrogen escape */
  const PLANETS = {
    venus: { name: 'Venus', M: 4.867e24, r: 6.302e6, T: 300, f: 0.2, tau: 0.75, gel: 0.013, target: 120, note: 'water left in the air: 1.3 cm if condensed' },
    earth: { name: 'Earth', M: 5.972e24, r: 6.871e6, T: 1000, f: 0.3, tau: 60, gel: 2690, target: 1, note: 'the oceans: 2.7 km deep over the globe' },
    mars: { name: 'Mars', M: 6.417e23, r: 3.59e6, T: 250, f: 0.3, tau: 1.85, gel: 34.5, target: 5.5, note: 'ice today: 35 m over the globe' }
  };
  Hyper.sim('cos-hydrogen-escape', {
    title: 'Losing hydrogen, keeping deuterium',
    blurb: `A **schematic** model of how a planet that loses hydrogen grows rich in deuterium. At the top of the atmosphere an atom escapes only if the energy to leave is not too large against its thermal energy. The Jeans parameter is $\\lambda = GMm/(k_BTr)$ and the escape rate goes as $(1+\\lambda)e^{-\\lambda}$. Deuterium is twice the mass, so its $\\lambda$ is twice as large and it escapes far less easily.

The top graph shows both rates against exobase temperature (a marker for the chosen value); the picture shows atoms leaving at a rate drawn on a logarithmic scale. The lower graph runs the history: the hydrogen reservoir drains exponentially with the chosen time constant while deuterium escapes at the fraction *f* of hydrogen's rate, and the D/H rises as $x^{f-1}$. Real escape has non-thermal parts (ions swept off by the solar wind) that the Jeans formula does not include; use *f* directly, or tick the box to use the thermal value.

**Try this**
- Venus at 300 K: nothing escapes thermally (λ ≈ 21) yet D/H must have risen a hundredfold. The early upper atmosphere was thousands of kelvin: raise the temperature to 5,000 K.
- Mars at 250 K: hydrogen escapes (λ ≈ 7) and deuterium hardly at all; with the default *f* the D/H reaches 5.5 in 4.5 billion years.
- Earth at 1,000 K: λ ≈ 7, but a cold trap keeps water out of the upper air, so the time constant is tens of billions of years: no change.
- Set *f* to 1: the two isotopes leave at the same rate and the ratio never changes.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190, maxH: 250 });
      const gA = document.createElement('div'), gB = document.createElement('div');
      gA.style.padding = '4px 10px 0'; gB.style.padding = '4px 10px 10px'; box.stage.appendChild(gA); box.stage.appendChild(gB);
      const key = PLANETS[params.planet] ? params.planet : 'venus';
      const P0 = PLANETS[key];
      const ctl = kit.controls(box.side, [
        { id: 'pl', type: 'select', label: 'Planet', options: [['Venus', 'venus'], ['Earth', 'earth'], ['Mars', 'mars']], value: key },
        { id: 'T', label: 'Temperature of the exobase', min: 100, max: 20000, value: P0.T, log: true, sig: 3, unit: 'K' },
        { id: 'f', label: 'Fractionation factor f', min: 0.02, max: 1, step: 0.01, value: P0.f },
        { id: 'jf', type: 'check', label: 'Use the thermal (Jeans) value for f', value: false },
        { id: 'tau', label: 'Hydrogen lost with time constant', min: 0.1, max: 100, value: P0.tau, log: true, sig: 2, unit: 'Gyr' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run the clock', primary: true }] }
      ], (id, v) => {
        if (id === 'pl') { const q = PLANETS[v]; ctl.set('T', q.T); ctl.set('f', q.f); ctl.set('tau', q.tau); restart(); }
        else if (id === 'run' || id === 'f' || id === 'tau' || id === 'jf') restart();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lH', 'λ for hydrogen'], ['lD', 'λ for deuterium'], ['fJ', 'Jeans f at this temperature'], ['fu', 'f used'], ['t', 'Time'], ['x', 'Hydrogen left'], ['E', 'D/H now ÷ at the start'], ['tg', 'Observed today'], ['w0', 'Water at the start']]);
      const mH = 1.00784 * AMU, mD = 2.01410 * AMU;
      const plotA = kit.plot(gA, { x: { label: 'exobase temperature (K)', log: true, min: 100, max: 20000 }, y: { label: 'escape factor (1+λ)e^−λ', log: true, min: 1e-30, max: 2 }, legend: true }, 150);
      const plotB = kit.plot(gB, { x: { label: 'time (Gyr)', min: 0, max: 4.5 }, y: { label: 'D/H ÷ its starting value', log: true, min: 1, max: 1000 }, legend: true }, 150);
      let t = 0, pts = [], parts = [];
      function restart() { t = 0; pts = []; }
      restart();
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const P = PLANETS[V.pl] || PLANETS.venus;
        const T = V.T;
        const lamOf = (m, TT) => GG * P.M * m / (kB * TT * P.r);
        const lH = lamOf(mH, T), lD = lamOf(mD, T);
        const Fof = l => (1 + l) * Math.exp(-l);
        const vOf = (m, TT) => Math.sqrt(2 * kB * TT / m);
        const JH = Fof(lH) * vOf(mH, T), JD = Fof(lD) * vOf(mD, T);
        const fJ = JH > 0 ? clamp(JD / JH, 0, 1) : 0;
        const fu = V.jf ? Math.max(fJ, 1e-6) : V.f;
        // the scene: a planet's limb with the exobase above it, and atoms leaving
        const Rp = Wd * 0.9, cx = Wd * 0.5, cy = Hh + Rp - 46;
        c.save();
        c.beginPath(); c.arc(cx, cy, Rp, 0, TAU); c.fillStyle = C.faint; c.globalAlpha = 0.8; c.fill(); c.globalAlpha = 1;
        c.beginPath(); c.arc(cx, cy, Rp + 40, 0, TAU); c.fillStyle = C.accent; c.globalAlpha = 0.12; c.fill(); c.globalAlpha = 1;
        c.setLineDash([5, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, Rp + 40, 0, TAU); c.stroke(); c.restore();
        kit.label(c, 'exobase', cx, cy - Rp - 40 - 9, { size: 10.5, color: C.warn, align: 'center' });
        kit.label(c, P.name, cx, Hh - 14, { size: 12, weight: 700, color: C.text, align: 'center' });
        const inten = l => clamp((lg(Math.max(Fof(l), 1e-300)) + 8) / 8, 0, 1);
        const rH = 9 * inten(lH), rD = 9 * inten(lD);
        const leave = (k, v) => { const x = 30 + rnd() * (Wd - 60), dx = x - cx; parts.push({ k, x, y: cy - Math.sqrt(Math.max(0, (Rp + 40) * (Rp + 40) - dx * dx)), v }); };
        if (rnd() < rH * dt && parts.length < 80) leave('H', 40 + rnd() * 30);
        if (rnd() < rD * dt && parts.length < 80) leave('D', 30 + rnd() * 20);
        for (let i = parts.length - 1; i >= 0; i--) {
          const q = parts[i]; q.y -= q.v * dt; q.x += 4 * dt;
          if (q.y < -6) { parts.splice(i, 1); continue; }
          if (q.k === 'H') kit.dot(c, q.x, q.y, 2.8, '#e9eef3', '#9aa4ad'); else kit.dot(c, q.x, q.y, 4.2, C.series[0]);
        }
        kit.label(c, 'H: λ = ' + lH.toFixed(1), Wd - 12, 14, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, 'D: λ = ' + lD.toFixed(1), Wd - 12, 30, { size: 11, color: C.series[0], align: 'right' });
        // the history
        if (loop.running) t = Math.min(4.5, t + dt * 0.7);
        const xAt = tt => Math.exp(-tt / V.tau);
        const EAt = tt => Math.min(1e12, Math.pow(Math.max(xAt(tt), 1e-300), fu - 1));
        if (!pts.length || t - pts[pts.length - 1][0] >= 0.05 || t >= 4.5) pts.push([t, Math.max(1, EAt(t))]);
        // the graphs
        const tp = []; for (let i = 0; i <= 50; i++) { const TT = 100 * Math.pow(200, i / 50); tp.push([TT, Math.max(1e-30, Fof(lamOf(mH, TT)))]); }
        const tpD = []; for (let i = 0; i <= 50; i++) { const TT = 100 * Math.pow(200, i / 50); tpD.push([TT, Math.max(1e-30, Fof(lamOf(mD, TT)))]); }
        plotA.set({ series: [{ pts: tp, label: 'hydrogen', color: C.text }, { pts: tpD, label: 'deuterium', color: C.series[0] }], vlines: [{ x: T, label: T.toFixed(0) + ' K' }] });
        plotB.set({ series: [{ pts, label: 'D/H enrichment', color: C.accent }], hlines: [{ y: Math.max(1.0001, P.target), label: P.name === 'Earth' ? 'Earth: 1' : P.name + ' today: about ' + P.target }], y: { label: 'D/H ÷ its starting value', log: true, min: 1, max: 1000 } });
        const x = xAt(t), E = EAt(t), xEnd = xAt(4.5);
        ro.set('lH', lH.toFixed(1)); ro.set('lD', lD.toFixed(1));
        ro.set('fJ', fJ >= 1e-3 ? fJ.toFixed(2) : sci(fJ, 1));
        ro.set('fu', fu.toFixed(2));
        ro.set('t', t.toFixed(2) + ' Gyr');
        ro.set('x', (100 * x).toPrecision(3) + ' %');
        ro.set('E', E >= 100 ? E.toFixed(0) : E.toFixed(2));
        ro.set('tg', P.target === 1 ? 'about 1 (Earth keeps its oceans)' : 'about ' + P.target + ' ×');
        const w0 = P.gel / Math.max(xEnd, 1e-300);
        ro.set('w0', w0 < 1 ? (w0 * 100).toFixed(1) + ' cm' : w0 < 1000 ? w0.toPrecision(3) + ' m' : (w0 / 1000).toPrecision(3) + ' km');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 8. the habitable zone */
  Hyper.sim('cos-habitable-zone', {
    title: 'The habitable zone and the snow line',
    blurb: `The band of distances where a rocky planet with an Earth-like atmosphere could keep liquid water, drawn on a **logarithmic** scale for a star of your choice: the green bar is the conservative habitable zone (0.95 to 1.67 AU for the Sun, scaled as √L), the dashed line the snow line, and the dots are known planets placed at their orbits. The diamond is a planet of your own: slide it in and out and read its temperature without any greenhouse.

For the Sun, the age slider shows the zone moving as it brightens: 0.82 to 1.44 AU at birth, outward by about 1 % of its distance every 100 million years. The edges are the Sun-calibrated scaling; the true limits depend a little on the star's colour. Planet data are from the discovery papers and are rounded.

**Try this**
- The Sun at 4.57 billion years: Venus is inside the inner edge, Earth and Mars inside the zone. Slide the age to 0.6 and find Earth in the cool half; to 6 and watch the inner edge reach 1 AU.
- *Proxima Centauri*: the zone shrinks to a hair's breadth, with Proxima b inside it.
- *TRAPPIST-1*: seven planets in a space smaller than Mercury's orbit; three are in the zone.
- The test planet at 1 AU with albedo 0.3 has an equilibrium temperature of 255 K ($-18\\,^\\circ$C): the greenhouse effect adds about 33 K.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240, maxH: 330 });
      const STAR = {
        sun: { name: 'The Sun', L: 1, planets: [['Mercury', 0.387], ['Venus', 0.723], ['Earth', 1.0], ['Mars', 1.524]] },
        proxima: { name: 'Proxima Centauri', L: 0.0017, planets: [['b', 0.0485]] },
        trappist: { name: 'TRAPPIST-1', L: 0.000553, planets: [['b', 0.01154], ['c', 0.0158], ['d', 0.02227], ['e', 0.02925], ['f', 0.03849], ['g', 0.04683], ['h', 0.06189]] },
        k442: { name: 'Kepler-442', L: 0.117, planets: [['b', 0.409]] },
        hot: { name: 'A star of 20 L☉', L: 20, planets: [] },
        custom: { name: 'A star of your choice', L: 1, planets: [] }
      };
      const ctl = kit.controls(box.side, [
        { id: 'star', type: 'select', label: 'Star', options: [['The Sun', 'sun'], ['Proxima Centauri (0.0017)', 'proxima'], ['TRAPPIST-1 (0.00055)', 'trappist'], ['Kepler-442 (0.117)', 'k442'], ['A hot star (20)', 'hot'], ['Your own luminosity', 'custom']], value: STAR[params.star] ? params.star : 'sun' },
        { id: 'L', label: 'Luminosity', min: 3e-4, max: 100, value: 1, log: true, sig: 3, unit: 'L☉' },
        { id: 'age', label: 'Age of the Sun', min: 0, max: 8, step: 0.05, value: 4.57, unit: 'Gyr' },
        { id: 'd', label: 'Your planet\'s distance', min: 0.01, max: 50, value: 1, log: true, sig: 3, unit: 'AU' },
        { id: 'A', label: 'Its albedo', min: 0, max: 0.9, step: 0.01, value: 0.3 }
      ], (id) => { if (id === 'star') vis(); });
      const V = ctl.values;
      function vis() { ctl.show('L', V.star === 'custom'); ctl.show('age', V.star === 'sun'); }
      vis();
      const ro = kit.readout(box.side, [['L', 'Luminosity'], ['hz', 'Habitable zone'], ['sl', 'Snow line'], ['in', 'Known planets in the zone'], ['T', 'Your planet: equilibrium temperature'], ['s', 'Your planet is']]);
      const dmin = 0.008, dmax = 60;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const S = STAR[V.star] || STAR.sun;
        const L = V.star === 'custom' ? V.L : V.star === 'sun' ? 1 / (1 + 0.4 * (1 - V.age / 4.57)) : S.L;
        const hz = W.habitableZone(L), sl = W.snowLine(L);
        const x0 = 26, x1 = Wd - 16, ybar = Hh * 0.46;
        const px = d => x0 + (x1 - x0) * (lg(clamp(d, dmin, dmax)) - lg(dmin)) / (lg(dmax) - lg(dmin));
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1;
        for (const d of [0.01, 0.1, 1, 10]) { const x = Math.round(px(d)) + 0.5; c.beginPath(); c.moveTo(x, 8); c.lineTo(x, Hh - 26); c.stroke(); kit.label(c, d + ' AU', x, Hh - 10, { size: 10.5, color: C.faint, align: 'center' }); }
        c.restore();
        // the zones
        c.save(); c.fillStyle = C.warn; c.globalAlpha = 0.1; c.fillRect(x0, 8, px(hz.inner) - x0, Hh - 34); c.restore();
        c.save(); c.fillStyle = C.ok; c.globalAlpha = 0.28; c.fillRect(px(hz.inner), 8, Math.max(2, px(hz.outer) - px(hz.inner)), Hh - 34); c.restore();
        c.save(); c.fillStyle = C.accent; c.globalAlpha = 0.1; c.fillRect(px(sl), 8, x1 - px(sl), Hh - 34); c.restore();
        kit.label(c, 'too hot', (x0 + px(hz.inner)) / 2, 22, { size: 10.5, color: C.warn, align: 'center' });
        kit.label(c, 'habitable zone', clamp((px(hz.inner) + px(hz.outer)) / 2, x0 + 45, x1 - 140), 22, { size: 11, weight: 700, color: C.ok, align: 'center' });
        kit.label(c, 'ice (beyond the snow line)', clamp((px(sl) + x1) / 2, px(sl) + 70, x1 - 70), 38, { size: 10.5, color: C.accent, align: 'center' });
        c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath(); c.moveTo(px(sl), 8); c.lineTo(px(sl), Hh - 26); c.stroke(); c.restore();
        kit.dot(c, 12, ybar, 6, '#f2c14e', C.warn);
        // known planets
        const inZone = [];
        S.planets.forEach(([n, d], i) => {
          const ok = d >= hz.inner && d <= hz.outer;
          if (ok) inZone.push(n);
          const x = px(d), y = ybar + (i % 2 ? 22 : -22);
          kit.dot(c, x, ybar, 4.6, ok ? C.ok : d < hz.inner ? C.warn : C.accent, C.text);
          kit.label(c, n, x, y, { size: 10.5, color: C.text, align: 'center' });
        });
        // the test planet
        const d = V.d, T = W.equilibriumTemperature(L, d, V.A);
        const status = d < hz.inner ? 'too hot (inside the inner edge)' : d > hz.outer ? 'too cold (beyond the outer edge)' : 'inside the zone';
        const tx = px(d), ty = ybar + 56;
        c.save(); c.translate(tx, Math.min(ty, Hh - 44)); c.rotate(Math.PI / 4); c.fillStyle = d < hz.inner ? C.warn : d > hz.outer ? C.accent : C.ok; c.fillRect(-6, -6, 12, 12); c.restore();
        kit.label(c, 'your planet', clamp(tx, x0 + 40, x1 - 40), Math.min(ty, Hh - 44) + 17, { size: 10.5, color: C.text, align: 'center' });
        ro.set('L', (L < 0.01 ? L.toPrecision(2) : L.toFixed(L < 1 ? 3 : 2)) + ' L☉' + (V.star === 'sun' ? '  (the Sun at ' + V.age.toFixed(2) + ' Gyr)' : ''));
        ro.set('hz', hz.inner.toPrecision(2) + ' to ' + hz.outer.toPrecision(2) + ' AU');
        ro.set('sl', sl.toPrecision(2) + ' AU');
        ro.set('in', S.planets.length ? (inZone.length ? inZone.join(', ') : 'none of the ' + S.planets.length) : '(none drawn)');
        ro.set('T', T.toFixed(0) + ' K  (' + (T - 273.15).toFixed(0) + ' °C) without a greenhouse effect');
        ro.set('s', status);
      }, box.stage);
      loop.start();
    }
  });
})();
