/* HYPER-WATER · sims/oceans-in-the-dark.js — the simulations of the topic "Oceans in the dark" (topic code ow-).
 *   ow-ocean-section    a world cut open: ice shell, ocean, rock; thickness sliders, the pressure at the seafloor and the volume of water
 *   ow-plume            the plume of Enceladus: grains thrown into a sky with one-twentieth of Earth's gravity; how many fall back, how many escape
 *   ow-lake-compare     a lake on Titan beside a lake on Earth: density, waves, evaporation (liquid methane and ethane at 94 K against water)
 *   ow-ice-sandwich     Ganymede, Callisto, Titan: ice shell, ocean and high-pressure ice below it, read from the phase diagram of water
 *   ow-ocean-map        the worlds of the Solar System to scale, coloured by the evidence for an ocean or by the habitability ladder
 *   ow-tidal-flex       a moon on an eccentric orbit: the tide that rises and falls, and the heat that results
 *   ow-transit-spectrum a schematic transmission spectrum of a planet with water, methane and carbon dioxide in its atmosphere
 * Numbers that water-the-material gives (densities, melting curves, phase of ice, vapour pressure, latent heats, freezing-point depression)
 * come from kit.water; the other data (radii, gravities, orbits, k2/Q) are local and quoted in the blurbs. Models marked "schematic" are
 * teaching models, not predictions.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const ICE = 'rgba(205,230,250,0.92)', SEA = 'rgba(40,125,220,0.62)', ROCK = 'rgba(150,108,76,0.85)';
  const circ = (c, x, y, r) => { if (!(r > 0)) return false; c.arc(x, y, r, 0, TAU); return true; };
  const fmtP = Pa => !(Pa > 0) ? '0' : Pa >= 1e9 ? (Pa / 1e9).toFixed(2) + ' GPa' : (Pa / 1e6).toFixed(Pa < 1e7 ? 2 : 1) + ' MPa';
  const fmtW = w => !(w > 0) ? '0 W' : w >= 1e15 ? (w / 1e15).toFixed(1) + ' PW' : w >= 1e12 ? (w / 1e12).toFixed(2) + ' TW' : w >= 1e9 ? (w / 1e9).toFixed(2) + ' GW' : w >= 1e6 ? (w / 1e6).toFixed(2) + ' MW' : w.toFixed(0) + ' W';
  const sig = (v, n) => !Number.isFinite(v) ? '—' : Math.abs(v) >= 1e5 || (v !== 0 && Math.abs(v) < 1e-2) ? v.toExponential(Math.max(0, (n || 3) - 1)).replace('e+', '×10^').replace('e-', '×10^−') : String(Number(v.toPrecision(n || 3)));
  /* a normal-distribution tail, 1 − Φ(z) (Abramowitz–Stegun 7.1.26 for erf) */
  const erf = x => { const s = x < 0 ? -1 : 1; x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
  const tail = z => 0.5 * (1 - erf(z / Math.SQRT2));
  const prng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  /* ================================================================ 1. a world cut open */
  Hyper.sim('ow-ocean-section', {
    title: 'An ocean under the ice',
    blurb: `A moon cut open. On the left the world **to scale** — the shell and the ocean are hairlines on the disc, because a 100-km ocean on a body 3,000 km across is a thin skin. On the right the same layers **stretched into a column**, with the pressure that builds up as you go down: the weight of the ice, then of the water, each layer's thickness times its density times the (small) gravity.

**Try this**
- On *Europa*, leave the defaults and read the pressure at the seafloor: about 160 MPa, only half as much again as at the bottom of Earth's deepest trench (Challenger Deep, about 109 MPa), though the ocean is ten times deeper than that trench. The gravity is only 1.3 m/s².
- Switch to *Enceladus*, with its 30 km of ocean under 20 km of ice: the seafloor pressure is only about 5.6 MPa — what you would feel 550 m down in Earth's sea. Low gravity makes deep oceans gentle.
- Thicken the shell and watch what it does to the pressure and to the heat that must get out through it.
- Add salt: the ocean gets denser and its freezing point falls. The ideal-solution law used here is fine for the first few per cent; real brines stop falling at their eutectic.

*Model:* uniform gravity (it hardly changes through a water layer of this depth, because the layer is lighter than the rock below), ice 931 kg/m³ (ice Ih at −100 °C), ocean density from the salt content. Shell and ocean values are the usual published ranges, not measurements.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const WD = {
        europa: { name: 'Europa', R: 1560.8, g: 1.315, shell: 20, ocean: 100 },
        enceladus: { name: 'Enceladus', R: 252.1, g: 0.113, shell: 20, ocean: 30 },
        mimas: { name: 'Mimas', R: 198.2, g: 0.064, shell: 25, ocean: 25 },
        titan: { name: 'Titan', R: 2574.7, g: 1.352, shell: 100, ocean: 200 }
      };
      const w0 = WD[params.world] ? params.world : 'europa';
      const ctl = kit.controls(box.side, [
        { id: 'world', type: 'select', label: 'World', options: Object.keys(WD).map(k => [WD[k].name, k]), value: w0 },
        { id: 'shell', label: 'Ice shell thickness', min: 1, max: 150, step: 1, value: WD[w0].shell, unit: 'km' },
        { id: 'ocean', label: 'Ocean depth', min: 2, max: 300, step: 1, value: WD[w0].ocean, unit: 'km' },
        { id: 'sal', label: 'Salt in the ocean', min: 0, max: 100, step: 1, value: 35, unit: 'g/kg' }
      ], (id, v) => { if (id === 'world') { ctl.set('shell', WD[v].shell); ctl.set('ocean', WD[v].ocean); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['g', 'Surface gravity'], ['p1', 'Pressure at the base of the ice'], ['p2', 'Pressure at the seafloor'], ['vs', 'Seafloor pressure ÷ Challenger Deep'], ['vol', 'Volume of the ocean'], ['n', 'In Earth oceans'], ['tf', 'Freezing point of the ocean (1 atm)']]);
      const rhoI = W.densityIce(-100), PCH = 108.6e6;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const w = WD[V.world] || WD.europa, R = w.R;
        const hs = Math.min(V.shell, 0.8 * R), ho = Math.max(0, Math.min(V.ocean, R - hs - 1));
        const rhoO = W.densityBrine(V.sal, 0);
        const p1 = rhoI * w.g * hs * 1e3, p2 = p1 + rhoO * w.g * ho * 1e3;
        const rIn = R - hs - ho, rMid = R - hs;
        const vol = 4 / 3 * Math.PI * (rMid ** 3 - Math.max(0, rIn) ** 3);
        const m = V.sal / 58.44 / (1 - V.sal / 1000), tf = -W.freezingDepression(m, 1.85);
        /* ---- left: to scale */
        const cx = Wd * 0.2, cy = Hh * 0.5, Rp = Math.min(Wd * 0.18, Hh * 0.4);
        c.save();
        c.beginPath(); circ(c, cx, cy, Rp); c.fillStyle = ICE; c.fill();
        c.beginPath(); circ(c, cx, cy, Rp * rMid / R); c.fillStyle = SEA; c.fill();
        c.beginPath(); circ(c, cx, cy, Rp * Math.max(0, rIn) / R); c.fillStyle = ROCK; c.fill();
        c.beginPath(); circ(c, cx, cy, Rp); c.strokeStyle = C.axis; c.lineWidth = 1; c.stroke();
        c.restore();
        kit.label(c, w.name + ' — to scale', cx, cy + Rp + 16, { align: 'center', size: 12, weight: 650 });
        kit.label(c, 'radius ' + R.toFixed(0) + ' km · ice ' + hs.toFixed(0) + ' km · ocean ' + ho.toFixed(0) + ' km', cx, cy + Rp + 32, { align: 'center', size: 11, color: C.muted });
        /* ---- right: the column and the pressure */
        const x0 = Wd * 0.43, cw = 56, top = 34, bot = Hh - 44;
        const D = hs + ho + Math.max(10, 0.3 * (hs + ho));
        const ky = (bot - top) / D, yS = 0, yO = hs * ky, yB = (hs + ho) * ky;
        c.fillStyle = ICE; c.fillRect(x0, top, cw, Math.max(1, yO));
        c.fillStyle = SEA; c.fillRect(x0, top + yO, cw, Math.max(1, yB - yO));
        c.fillStyle = ROCK; c.fillRect(x0, top + yB, cw, bot - top - yB);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0 + 0.5, top + 0.5, cw, bot - top);
        kit.label(c, 'ice', x0 - 6, top + yO / 2, { align: 'right', size: 11.5 });
        kit.label(c, 'ocean', x0 - 6, top + (yO + yB) / 2, { align: 'right', size: 11.5 });
        kit.label(c, 'rock', x0 - 6, top + (yB + bot - top) / 2 + 4, { align: 'right', size: 11.5 });
        kit.label(c, '0 km', x0 + cw + 5, top, { size: 10.5, color: C.muted });
        kit.label(c, hs.toFixed(0) + ' km', x0 + cw + 5, top + yO, { size: 10.5, color: C.muted });
        kit.label(c, (hs + ho).toFixed(0) + ' km', x0 + cw + 5, top + yB, { size: 10.5, color: C.muted });
        const px0 = x0 + cw + 62, pw = Wd - px0 - 16, Pmax = Math.max(p2, PCH) * 1.12, kx = pw / Pmax;
        const tick = Hyper.niceStep(Pmax / 1e6, 4);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
        for (let t = 0; t * 1e6 <= Pmax; t += tick) { const xx = px0 + t * 1e6 * kx; c.moveTo(xx, top); c.lineTo(xx, bot); }
        c.stroke();
        for (let t = 0; t * 1e6 <= Pmax; t += tick) kit.label(c, String(Math.round(t)), px0 + t * 1e6 * kx, bot + 12, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'pressure (MPa)', px0 + pw / 2, bot + 28, { align: 'center', size: 11, color: C.muted });
        c.strokeStyle = C.bad; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(px0 + PCH * kx, top); c.lineTo(px0 + PCH * kx, bot); c.stroke(); c.setLineDash([]);
        kit.label(c, 'Challenger Deep', px0 + PCH * kx + 4, top + 8, { size: 10.5, color: C.bad });
        c.strokeStyle = C.accent; c.lineWidth = 2.5; c.beginPath();
        c.moveTo(px0, top); c.lineTo(px0 + p1 * kx, top + yO); c.lineTo(px0 + p2 * kx, top + yB); c.stroke();
        kit.dot(c, px0 + p2 * kx, top + yB, 4.5, C.accent);
        kit.label(c, fmtP(p2), px0 + p2 * kx + 8, top + yB + 2, { size: 11.5, weight: 650, color: C.accent });
        ro.set('g', w.g.toFixed(3) + ' m/s² (Earth 9.81)');
        ro.set('p1', fmtP(p1));
        ro.set('p2', fmtP(p2) + ' (' + (p2 / 101325).toFixed(0) + ' atm)');
        ro.set('vs', (p2 / PCH).toFixed(2) + ' ×');
        ro.set('vol', sig(vol, 3) + ' km³');
        ro.set('n', (vol / W.EARTH.oceans).toFixed(vol / W.EARTH.oceans < 0.1 ? 4 : 2) + ' × Earth’s oceans');
        ro.set('tf', tf.toFixed(1) + ' °C');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 2. the plume of Enceladus */
  Hyper.sim('ow-plume', {
    title: 'The plume of Enceladus',
    blurb: `Ice grains thrown from the fissures at the south pole of Enceladus, seen from the side. The moon is small (radius 252 km) and its surface gravity is **0.113 m/s², one-fourteenth of the Moon's and one eighty-seventh of Earth's** — so a grain thrown at the speed of a fast cyclist rises tens of kilometres. Each grain follows its own orbit under the moon's real inverse-square pull (Saturn's pull is left out).

A grain faster than the **escape speed (239 m/s)** leaves for good — those are the ones that feed Saturn's E ring, shown in a lighter colour. Slower grains fall back as snow. The speeds follow a spread (a log-normal, a teaching choice) around the median you set; the gas that carries them leaves much faster, near a kilometre per second.

**Try this**
- Raise the median speed from 80 to 150 m/s and watch the escaping share climb steeply: the E ring depends on the fast tail.
- Widen the *spread*: more very slow grains and more very fast ones.
- Zoom out to see how far the fastest grains climb; zoom in to see the slow snow.
- Spread the jet angle: the real plume is a curtain of about a hundred jets along the four main fissures, each with its own tilt.

*Schematic:* the real distribution of grain speeds and sizes is measured (Cassini's dust and imaging data) but not a single log-normal.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const GM = 7.2108e9, R = 252.1e3, vEsc = Math.sqrt(2 * GM / R), g0 = GM / (R * R);
      const ctl = kit.controls(box.side, [
        { id: 'v50', label: 'Median grain speed', min: 20, max: 300, step: 5, value: params.v50 || 80, unit: 'm/s' },
        { id: 'sg', label: 'Spread of speeds', min: 0.2, max: 1.2, step: 0.05, value: 0.7 },
        { id: 'ang', label: 'Tilt of the jets (±)', min: 0, max: 40, step: 1, value: 12, unit: '°' },
        { id: 'rate', label: 'Jet strength', min: 1, max: 30, step: 1, value: 10 },
        { id: 'fov', label: 'Height of the view', min: 40, max: 1500, value: 200, unit: 'km', log: true, sig: 2 },
        { id: 'tx', label: 'Time speed-up', min: 50, max: 1000, value: 300, unit: '×', log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear the sky', primary: true }] }
      ], id => { if (id === 'clear') { grains.length = 0; n.land = 0; n.esc = 0; n.tot = 0; } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['esc', 'Escape speed from the surface'], ['peak', 'Peak height, median grain'], ['theory', 'Share above escape speed (model)'], ['tally', 'This run: emitted / landed / escaped'], ['gas', 'Plume gas (Cassini, 28 Oct 2015)'], ['dh', 'D/H of the plume water']]);
      const grains = [], n = { land: 0, esc: 0, tot: 0 };
      const rnd = Math.random;
      const gauss = () => { let u = 0; for (let i = 0; i < 6; i++) u += rnd(); return (u - 3) * Math.SQRT2; };
      const dh = W.DH.find(d => d.id === 'enceladus');
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const ppk = (Hh - 56) / V.fov, cx = Wd * 0.5, topY = Hh - 40;     // px per km; surface point at the top of the limb
        const dts = Math.min(dt, 0.05) * V.tx;
        /* emit */
        const nNew = Math.min(40, Math.round(V.rate * dt * 60 * 0.5 + rnd()));
        for (let i = 0; i < nNew && grains.length < 900; i++) {
          const xs = (rnd() - 0.5) * 100e3, ys = Math.sqrt(R * R - xs * xs);
          const th = (rnd() * 2 - 1) * V.ang * Math.PI / 180, nx = xs / R, ny = ys / R;
          const v = V.v50 * Math.exp(V.sg * gauss());
          grains.push({ x: xs, y: ys, vx: v * (nx * Math.cos(th) - ny * Math.sin(th)), vy: v * (nx * Math.sin(th) + ny * Math.cos(th)), unb: v >= vEsc });
          n.tot++;
        }
        /* move: velocity-Verlet with sub-steps of at most 10 s of simulated time */
        const ns = Math.max(1, Math.min(80, Math.ceil(dts / 10))), h = dts / ns;
        for (let k = 0; k < ns; k++) {
          for (const p of grains) {
            let r = Math.hypot(p.x, p.y), a = -GM / (r * r * r);
            p.vx += 0.5 * h * a * p.x; p.vy += 0.5 * h * a * p.y;
            p.x += h * p.vx; p.y += h * p.vy;
            r = Math.hypot(p.x, p.y); a = -GM / (r * r * r);
            p.vx += 0.5 * h * a * p.x; p.vy += 0.5 * h * a * p.y;
          }
        }
        for (let i = grains.length - 1; i >= 0; i--) {
          const p = grains[i], r = Math.hypot(p.x, p.y);
          if (r < R) { n.land++; grains.splice(i, 1); }
          else if (r > 8 * R || (p.unb && r > R + V.fov * 1e3 * 2)) { if (p.unb) n.esc++; grains.splice(i, 1); }
        }
        /* draw: the limb, the fissures, a height ruler, the grains */
        const ccx = cx, ccy = topY + R / 1e3 * ppk;
        c.save();
        c.beginPath(); circ(c, ccx, ccy, R / 1e3 * ppk); c.fillStyle = ICE; c.fill(); c.strokeStyle = C.axis; c.stroke();
        c.restore();
        const step = Hyper.niceStep(V.fov, 5);
        c.strokeStyle = C.grid; c.fillStyle = C.muted; c.lineWidth = 1;
        for (let hk = step; hk < V.fov; hk += step) { const yy = topY - hk * ppk; c.beginPath(); c.moveTo(34, yy); c.lineTo(Wd - 8, yy); c.stroke(); kit.label(c, hk + ' km', 4, yy - 8, { size: 10, color: C.muted }); }
        for (const p of grains) {
          const x = ccx + p.x / 1e3 * ppk, y = ccy - p.y / 1e3 * ppk;
          if (x < 0 || x > Wd || y < 0 || y > Hh) continue;
          c.fillStyle = p.unb ? C.warn : 'rgba(200,225,250,0.9)';
          c.fillRect(x - 1, y - 1, 2.4, 2.4);
        }
        for (let i = -2; i <= 2; i++) kit.dot(c, ccx + i * 18 * ppk / 3, topY + 2, 2.2, C.bad);
        kit.label(c, 'the tiger stripes (fissures), seen end-on', cx, Hh - 12, { align: 'center', size: 11, color: C.muted });
        kit.label(c, 'light = falls back as snow · orange = escapes to Saturn orbit (E ring)', 40, 16, { size: 11, color: C.muted });
        /* readouts */
        const v50 = V.v50, e50 = v50 * v50 / (2 * GM);
        const peak = v50 < vEsc ? (1 / (1 / R - e50) - R) / 1e3 : Infinity;
        ro.set('esc', vEsc.toFixed(0) + ' m/s (surface gravity ' + g0.toFixed(3) + ' m/s²)');
        ro.set('peak', Number.isFinite(peak) ? peak.toFixed(peak < 10 ? 1 : 0) + ' km (flat-ground estimate v²/2g: ' + (v50 * v50 / (2 * g0) / 1e3).toFixed(0) + ' km)' : 'escapes');
        ro.set('theory', (100 * tail(Math.log(vEsc / v50) / V.sg)).toFixed(1) + ' %');
        ro.set('tally', n.tot + ' / ' + n.land + ' / ' + n.esc);
        ro.set('gas', 'water ≈ 98 %, H₂ ≈ 1 %, with CO₂, CH₄, NH₃');
        ro.set('dh', dh ? (dh.dh * 1e4).toFixed(1) + '×10⁻⁴ (' + (dh.dh / W.VSMOW).toFixed(2) + ' × the ocean’s)' : '—');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 3. a lake on Titan beside a lake on Earth */
  Hyper.sim('ow-lake-compare', {
    title: 'A lake on Titan and a lake on Earth',
    blurb: `Two lakes seen from the side, each cut off at two wavelengths. **Left:** water at the temperature you choose, under Earth's gravity. **Right:** a lake on Titan at 94 K, where the liquid is methane, ethane or a mixture, under a gravity of 1.35 m/s² and a nitrogen sky at 1.47 bar. The waves move at their true frequency, so a long wave is slow.

For ripples that are not too short or too long, the speed of a deep-water wave is set by two restoring forces — gravity and surface tension:  $c^2 = g\\lambda/2\\pi + 2\\pi\\sigma/(\\rho\\lambda)$. The graph shows both lakes; the slowest wave the lake can carry sets the wind speed at which ripples first appear.

**Try this**
- Compare the *energy to evaporate a cubic metre*: methane has a much smaller latent heat than water and a lower density.
- Slide the temperature from 89 to 100 K: liquid methane's vapour pressure changes by a factor of two. Titan's lakes are always close to boiling, in a sense.
- Pure ethane has almost no vapour pressure at 94 K; a lake rich in ethane hardly evaporates, a methane lake does.
- Move the wavelength through about 1.5 cm on Earth (the speed minimum) and see where Titan's minimum falls.

*Data:* liquid methane 447 kg/m³ and 18 mN/m, ethane 648 kg/m³ and 31 mN/m at 94 K (linear fits to tabulated values); vapour pressures from Clausius–Clapeyron with the heat of vaporisation at the normal boiling point; mixtures taken as ideal. Water properties come from the water model. Quantities are estimates good to a few per cent.`,
    mount(box, kit, params) {
      const W = kit.water;
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220, maxH: 300 });
      box.stage.appendChild(graph);
      const ctl = kit.controls(box.side, [
        { id: 'Tt', label: 'Titan lake temperature', min: 89, max: 100, step: 0.5, value: 94, unit: 'K' },
        { id: 'x', label: 'Methane (mole fraction)', min: 0, max: 100, step: 5, value: params.x != null ? params.x : 70, unit: '%' },
        { id: 'Te', label: 'Earth lake temperature', min: 0, max: 35, step: 1, value: 15, unit: '°C' },
        { id: 'lam', label: 'Wavelength', min: 0.02, max: 20, value: 1, unit: 'm', log: true, sig: 2 }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rho', 'Density: Titan / Earth'], ['sig', 'Surface tension: Titan / Earth'], ['c', 'Wave speed at this wavelength: Titan / Earth'], ['cmin', 'Slowest wave (ripple threshold)'], ['lc', 'Capillary length: Titan / Earth'], ['pv', 'Vapour pressure ÷ air pressure'], ['ev', 'Energy to evaporate 1 m³: Titan / Earth']]);
      const plot = kit.plot(graph, { x: { label: 'wavelength (m)', log: true, min: 0.005, max: 50 }, y: { label: 'wave speed (m/s)', log: true, min: 0.05, max: 10 }, legend: true }, 190);
      const GT = 1.352, GE = 9.80665, PT = 146700;
      const liq = T => {
        const x = V.x / 100, M1 = 16.043, M2 = 30.07;
        const r1 = 446.6 - 1.28 * (T - 94), r2 = 647.5 - 1.12 * (T - 94);
        const s1 = 17.9e-3 - 0.15e-3 * (T - 94), s2 = 31.4e-3 - 0.165e-3 * (T - 94);
        const p1 = 101325 * Math.exp(-8190 / 8.314462 * (1 / T - 1 / 111.67)), p2 = 101325 * Math.exp(-14700 / 8.314462 * (1 / T - 1 / 184.55));
        const Mm = x * M1 + (1 - x) * M2;
        const rho = Mm / (x * M1 / r1 + (1 - x) * M2 / r2);
        const L = (x * 8190 + (1 - x) * 14700) / (Mm / 1000);                 // J/kg of mixture, mole-weighted
        return { rho, sigma: x * s1 + (1 - x) * s2, pv: x * p1 + (1 - x) * p2, L };
      };
      const cw = (g, lam, sg, rho) => Math.sqrt(g * lam / TAU + TAU * sg / (rho * lam));
      let phase = 0, key = '';
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const T = liq(V.Tt);
        const E = { rho: W.density(V.Te), sigma: W.surfaceTension(V.Te), pv: W.vapourPressure(V.Te), L: W.latentVaporisation(V.Te) };
        const cT = cw(GT, V.lam, T.sigma, T.rho), cE = cw(GE, V.lam, E.sigma, E.rho);
        phase += dt;
        const panels = [{ x: 0, g: GE, c: cE, f: cE / V.lam, liq: E, name: 'Earth · water at ' + V.Te + ' °C', col: 'rgba(40,125,220,0.6)', sky: 'rgba(120,180,240,0.18)' },
          { x: Wd / 2, g: GT, c: cT, f: cT / V.lam, liq: T, name: 'Titan · methane/ethane at ' + V.Tt + ' K', col: 'rgba(205,140,50,0.62)', sky: 'rgba(230,150,60,0.20)' }];
        for (const p of panels) {
          const x0 = p.x + 10, x1 = p.x + Wd / 2 - 10, w = x1 - x0, y0 = Hh * 0.55, amp = Math.min(22, w / 14);
          c.fillStyle = p.sky; c.fillRect(x0, 8, w, y0 - 8);
          c.beginPath(); c.moveTo(x0, Hh - 22);
          for (let i = 0; i <= 80; i++) { const xx = x0 + w * i / 80; c.lineTo(xx, y0 - amp * Math.sin(TAU * (2 * i / 80 - p.f * phase))); }
          c.lineTo(x1, Hh - 22); c.closePath(); c.fillStyle = p.col; c.fill();
          kit.label(c, p.name, x0 + w / 2, 20, { align: 'center', size: 11.5, weight: 650 });
          kit.label(c, 'window = 2 wavelengths = ' + sig(2 * V.lam, 2) + ' m', x0 + w / 2, Hh - 9, { align: 'center', size: 10.5, color: C.muted });
          kit.label(c, 'ρ ' + p.liq.rho.toFixed(0) + ' kg/m³ · g ' + p.g.toFixed(2) + ' m/s² · c ' + sig(p.c, 2) + ' m/s · period ' + sig(1 / p.f, 2) + ' s', x0 + w / 2, 38, { align: 'center', size: 10.5, color: C.muted });
        }
        const ro1 = key !== V.Tt + '|' + V.x + '|' + V.Te + '|' + V.lam;
        if (ro1) {
          key = V.Tt + '|' + V.x + '|' + V.Te + '|' + V.lam;
          const lams = [], sT = [], sE = [];
          for (let i = 0; i <= 70; i++) { const l = 0.005 * Math.pow(50 / 0.005, i / 70); lams.push(l); sT.push([l, cw(GT, l, T.sigma, T.rho)]); sE.push([l, cw(GE, l, E.sigma, E.rho)]); }
          plot.set({ series: [{ pts: sE, label: 'Earth water', color: C.accent }, { pts: sT, label: 'Titan lake', color: C.warn }], vlines: [{ x: V.lam, label: 'λ' }] });
        }
        const cminT = Math.pow(4 * GT * T.sigma / T.rho, 0.25), cminE = Math.pow(4 * GE * E.sigma / E.rho, 0.25);
        ro.set('rho', T.rho.toFixed(0) + ' / ' + E.rho.toFixed(0) + ' kg/m³');
        ro.set('sig', (T.sigma * 1e3).toFixed(1) + ' / ' + (E.sigma * 1e3).toFixed(1) + ' mN/m');
        ro.set('c', sig(cT, 2) + ' / ' + sig(cE, 2) + ' m/s');
        ro.set('cmin', sig(cminT, 2) + ' m/s (Titan) · ' + sig(cminE, 2) + ' m/s (Earth)');
        ro.set('lc', (1e3 * Math.sqrt(T.sigma / (T.rho * GT))).toFixed(1) + ' / ' + (1e3 * Math.sqrt(E.sigma / (E.rho * GE))).toFixed(1) + ' mm');
        ro.set('pv', (100 * T.pv / PT).toFixed(1) + ' % (Titan) · ' + (100 * E.pv / 101325).toFixed(1) + ' % (Earth)');
        ro.set('ev', (T.rho * T.L / 1e9).toFixed(2) + ' / ' + (E.rho * E.L / 1e9).toFixed(2) + ' GJ');
      }, box.stage);
      loop.start();
    }
  });
  /* ================================================================ 4. the ice sandwich */
  Hyper.sim('ow-ice-sandwich', {
    title: 'The ice sandwich',
    blurb: `The water layer of a big icy moon is so deep that the pressure at its base is a thousand times the pressure at the bottom of Earth's ocean — enough to turn water into other ices. The column on the left is read from the **phase diagram of water** (the graph below it, with pressure increasing downwards): at each depth the pressure and temperature of the moon are looked up on the melting curves of ice Ih, III, V and VI, and the layer is liquid or one of those ices.

The model: a conductive ice Ih shell warming from the surface temperature to the melting point at its base, then an ocean that warms slowly with depth (an adiabat of 0.01 K/MPa), until it meets a melting curve and turns to **high-pressure ice**. Where that happens before the rock, the seafloor is ice, not rock.

**Try this**
- On *Ganymede*, leave the defaults: a shell of about 120 km, an ocean around 150 km thick, and ice V and VI below it — the 'club sandwich'.
- Thicken the shell past about 157 km (the pressure of 209 MPa where ice Ih ends): the ocean pinches out, because the top of the ocean then sits on the steeper ice III and V melting curves.
- Add antifreeze (ammonia, salts): the ocean deepens, because every melting curve moves down by the freezing-point depression you choose.
- Choose *Titan*, where ammonia is the likely antifreeze, and compare.

*Schematic:* constant gravity, round density per ice, no heat sources in the ocean, shell thickness set by you rather than by convection. The melting curves are the IAPWS ones for pure water; the antifreeze is a plain shift of temperature.`,
    mount(box, kit, params) {
      const W = kit.water;
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 420 });
      box.stage.appendChild(graph);
      const WD = {
        ganymede: { name: 'Ganymede', R: 2634.1, g: 1.428, Ts: 110, shell: 120, H: 800, A: 5 },
        callisto: { name: 'Callisto', R: 2410.3, g: 1.235, Ts: 134, shell: 100, H: 400, A: 5 },
        titan: { name: 'Titan', R: 2574.7, g: 1.352, Ts: 94, shell: 100, H: 600, A: 20 }
      };
      const w0 = WD[params.world] ? params.world : 'ganymede';
      const ctl = kit.controls(box.side, [
        { id: 'world', type: 'select', label: 'World', options: Object.keys(WD).map(k => [WD[k].name, k]), value: w0 },
        { id: 'shell', label: 'Ice Ih shell thickness', min: 20, max: 250, step: 5, value: WD[w0].shell, unit: 'km' },
        { id: 'H', label: 'Whole water layer', min: 200, max: 900, step: 25, value: WD[w0].H, unit: 'km' },
        { id: 'A', label: 'Antifreeze (lowers freezing)', min: 0, max: 40, step: 1, value: WD[w0].A, unit: 'K' }
      ], (id, v) => { if (id === 'world') { const w = WD[v]; ctl.set('shell', w.shell); ctl.set('H', w.H); ctl.set('A', w.A); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['top', 'Ocean top'], ['bot', 'Ocean bottom'], ['thick', 'Ocean thickness'], ['p', 'Pressure: top / bottom'], ['floor', 'The seafloor is'], ['vol', 'Ocean volume']]);
      const plot = kit.plot(graph, { x: { label: 'temperature (K)', min: 90, max: 300 }, y: { label: 'pressure (MPa)', min: 0, max: 1500, reverse: true }, legend: true }, 240);
      const PH = { 'ice Ih': ICE, 'liquid': SEA, 'ice II': 'rgba(130,175,205,0.95)', 'ice III': 'rgba(150,185,235,0.95)', 'ice V': 'rgba(160,160,235,0.95)', 'ice VI': 'rgba(190,140,225,0.95)' };
      const rhoOf = ph => ph === 'liquid' ? 1060 : ph === 'ice Ih' ? 931 : (() => { const r = W.ICES.find(i => 'ice ' + i.id === ph); return r ? r.rho * 1000 : 1250; })();
      const solid = (T, p) => { const r = W.phaseAt(T, p); if (r === 'liquid' || r === 'vapour' || r === 'supercritical') return p < 209e6 ? 'ice Ih' : p < 350e6 ? 'ice III' : p < 632e6 ? 'ice V' : 'ice VI'; return r; };
      function profile(w, hs, H, A) {
        const g = w.g, dz = 2, pEst = 931 * g * hs * 1e3;
        const Ttop = W.meltingPoint(pEst).T - A + 0.05;
        const rows = []; let p = 0, state = 0, zTop = hs, pTop = 0, zBot = null, pBot = null, Tb = 0;
        for (let z = 0; z <= H; z += dz) {
          let T, ph;
          if (z < hs) { T = w.Ts * Math.pow(Ttop / w.Ts, z / hs); ph = solid(T, p); }
          else if (state < 2) {
            if (state === 0) { state = 1; zTop = z; pTop = p; }
            T = Ttop + 0.01 * (p - pTop) / 1e6;
            if (W.phaseAt(T + A, p) === 'liquid') ph = 'liquid'; else { state = 2; zBot = z; pBot = p; Tb = T; ph = solid(T, p); }
          } else { T = Tb + 0.03 * (p - pBot) / 1e6; ph = solid(T, p); }
          rows.push({ z, p, T, ph });
          p += rhoOf(ph) * g * dz * 1e3;
        }
        if (state === 1) { zBot = H; pBot = p; }
        if (state === 0) { zTop = H; pTop = p; zBot = H; pBot = p; }
        return { rows, zTop, zBot, pTop, pBot, floor: state === 2 ? rows[rows.length - 1].ph : 'rock' };
      }
      let key = '', P = null;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const w = WD[V.world] || WD.ganymede, H = V.H, hs = Math.min(V.shell, H - 10);
        const k = [V.world, hs, H, V.A].join('|');
        if (k !== key) {
          key = k; P = profile(w, hs, H, V.A);
          const curves = [], path = P.rows.filter((r, i) => i % 3 === 0).map(r => [r.T, r.p / 1e6]);
          for (const id of ['Ih', 'III', 'V', 'VI']) {
            const m = W.MELT[id], pts = [];
            for (let i = 0; i <= 24; i++) { const T = m.Tlo + (m.Thi - m.Tlo) * i / 24; pts.push([T, m.f(T) / 1e6]); }
            curves.push({ pts: pts.filter(q => q[1] <= 1500), label: 'melting: ice ' + id, color: C.faint, dash: true });
          }
          plot.set({ series: curves.concat([{ pts: path, label: w.name + ' (temperature path)', color: C.warn, width: 3 }]), marks: [{ x: P.rows[Math.round(P.zTop / 2)] ? P.rows[Math.round(P.zTop / 2)].T : 0, y: P.pTop / 1e6, label: 'ocean top' }, ...(P.floor !== 'rock' ? [{ x: P.rows[Math.min(P.rows.length - 1, Math.round(P.zBot / 2))].T, y: P.pBot / 1e6, label: 'ocean bottom' }] : [])] });
        }
        const x0 = 90, cw = 70, top = 26, bot = Hh - 26, kz = (bot - top) / (H + 60);
        let i0 = 0;
        for (let i = 1; i <= P.rows.length; i++) {
          if (i === P.rows.length || P.rows[i].ph !== P.rows[i0].ph) {
            const a = P.rows[i0], zEnd = i === P.rows.length ? H : P.rows[i].z;
            c.fillStyle = PH[a.ph] || 'rgba(215,130,200,0.9)';
            c.fillRect(x0, top + a.z * kz, cw, Math.max(1, (zEnd - a.z) * kz));
            const hmid = top + (a.z + zEnd) / 2 * kz;
            if ((zEnd - a.z) * kz > 12) kit.label(c, a.ph === 'liquid' ? 'ocean' : a.ph, x0 + cw + 8, hmid, { size: 11.5, weight: 600 });
            kit.label(c, a.z + ' km', x0 - 6, top + a.z * kz + 6, { align: 'right', size: 10, color: C.muted });
            i0 = i;
          }
        }
        c.fillStyle = ROCK; c.fillRect(x0, top + H * kz, cw, 60 * kz);
        kit.label(c, 'rock', x0 + cw + 8, top + (H + 30) * kz, { size: 11.5, weight: 600 });
        c.strokeStyle = C.axis; c.strokeRect(x0 + 0.5, top + 0.5, cw, bot - top);
        kit.label(c, 'depth below the surface', x0, 10, { size: 11, color: C.muted });
        kit.label(c, w.name + ': R ' + w.R.toFixed(0) + ' km, g ' + w.g.toFixed(2) + ' m/s²', Wd - 10, 12, { align: 'right', size: 11.5, color: C.muted });
        const thick = P.zBot - P.zTop;
        const vol = thick > 0 ? 4 / 3 * Math.PI * ((w.R - P.zTop) ** 3 - (w.R - P.zBot) ** 3) : 0;
        ro.set('top', thick > 0 ? P.zTop.toFixed(0) + ' km' : 'no ocean');
        ro.set('bot', thick > 0 ? P.zBot.toFixed(0) + ' km' : '—');
        ro.set('thick', thick > 0 ? thick.toFixed(0) + ' km' : '0');
        ro.set('p', thick > 0 ? (P.pTop / 1e6).toFixed(0) + ' / ' + (P.pBot / 1e6).toFixed(0) + ' MPa' : '—');
        ro.set('floor', thick <= 0 ? '—' : P.floor === 'rock' ? 'rock: the ocean touches it' : P.floor + ': ice, not rock');
        ro.set('vol', thick > 0 ? (vol / W.EARTH.oceans).toFixed(1) + ' × Earth’s oceans' : '—');
      }, box.stage);
      loop.start();
    }
  });
  /* ================================================================ 5. which worlds have oceans */
  const BODIES = [
    { id: 'earth', name: 'Earth', R: 6371, au: 1.0, g: 9.81, kind: 'earth', st: 'known', layers: [['ocean', 3.7], ['rock', 6367.3]], lad: [1, 1, 1, 1, 1], mission: 'You are here.',
      ev: 'Liquid water covers 71 % of the surface, 3.7 km deep on average: 1.34 billion cubic kilometres.', ladNote: 'All five rungs, by definition.' },
    { id: 'mars', name: 'Mars', R: 3389.5, au: 1.52, g: 3.71, kind: 'rock', st: 'none', layers: [['rock', 3389.5]], lad: [0.5, 0.5, 1, 0.5, 1], mission: 'Rovers on the surface; samples cached for a possible return to Earth.',
      ev: 'No standing water today. River valleys and lake beds show water 3–4 billion years ago. A radar glint under the south polar cap, read as a brine lake in 2018, is disputed.', ladNote: 'Wet long ago; now at most brines, with organic molecules found at the surface.' },
    { id: 'ceres', name: 'Ceres', R: 469.7, au: 2.77, g: 0.28, kind: 'ice', st: 'possible', layers: [['crust', 40], ['rock', 429.7]], lad: [0.5, 0.5, 1, 0.5, 1], mission: 'Dawn orbited in 2015–2018; nothing is planned.',
      ev: 'Dawn found sodium carbonate and other salts in the bright spots of Occator crater, left by brines that reached the surface, and a cryovolcano (Ahuna Mons). A brine reservoir under Occator is inferred; a global ocean today is not shown.', ladNote: 'Salty water, organics and ammonia-bearing clays on the surface; no sign of a lasting energy supply.' },
    { id: 'io', name: 'Io', R: 1821.6, au: 5.2, g: 1.80, kind: 'rock', st: 'none', layers: [['rock', 1821.6]], lad: [0, 1, 0.5, 0, 1], mission: 'Juno flew past in 2023 and 2024; JUICE and Clipper pass at a distance.',
      ev: 'A dry, sulfur-rich world. Tidal heating of about 10¹⁴ W drives hundreds of volcanoes. It is here as the contrast: all the heat in the Solar System and no water.', ladNote: 'Energy in plenty, water almost none.' },
    { id: 'europa', name: 'Europa', R: 1560.8, au: 5.2, g: 1.315, kind: 'ice', st: 'strong', layers: [['ice', 20], ['ocean', 100], ['rock', 1440.8]], lad: [1, 0.5, 0.5, 1, 0.5], mission: 'Europa Clipper arrives in April 2030; JUICE flies past twice.',
      ev: 'Galileo’s magnetometer found Jupiter’s field induced in a salty layer (flybys 1997–2000); the cracked, rafted surface and probable plumes seen by Hubble in 2012, 2014 and 2016 agree.', ladNote: 'Ocean strongly indicated; oxidants from radiation above, possible water–rock chemistry below; carbon dioxide and salts on the surface.' },
    { id: 'ganymede', name: 'Ganymede', R: 2634.1, au: 5.2, g: 1.428, kind: 'ice', st: 'strong', layers: [['ice', 150], ['ocean', 100], ['hp', 550], ['rock', 1834.1]], lad: [1, 0.5, 0.5, 1, 0.5], mission: 'JUICE orbits Ganymede from 2034.',
      ev: 'The only moon with its own magnetic field. Its aurorae rock less than expected, as a salty ocean at least 100 km thick would damp them (Hubble, 2015). Layers drawn are one model among several.', ladNote: 'A deep ocean, but sandwiched between ices, so contact with rock is uncertain.' },
    { id: 'callisto', name: 'Callisto', R: 2410.3, au: 5.2, g: 1.235, kind: 'ice', st: 'probable', layers: [['ice', 150], ['ocean', 100], ['rock', 2160.3]], lad: [0.5, 0, 0.5, 1, 0], mission: 'JUICE passes it many times.',
      ev: 'Galileo saw an induced magnetic field, most simply a salty layer under 100–200 km of ice. The interior is only partly sorted into rock and ice, so any ocean may be thin.', ladNote: 'An old, quiet world with a possible deep ocean and little energy.' },
    { id: 'enceladus', name: 'Enceladus', R: 252.1, au: 9.54, g: 0.113, kind: 'ice', st: 'strong', layers: [['ice', 20], ['ocean', 30], ['rock', 202.1]], lad: [1, 1, 1, 0.5, 1], mission: 'No spacecraft is on its way; orbiter and lander concepts are being studied.',
      ev: 'Plumes sampled by Cassini; a wobble of the ice shell that needs a global ocean (2016); hydrogen, silica nanoparticles, salts and phosphates in the spray.', ladNote: 'The only ocean whose hydrogen and carbon dioxide — food for methanogens — have been measured in its own spray.' },
    { id: 'mimas', name: 'Mimas', R: 198.2, au: 9.54, g: 0.064, kind: 'ice', st: 'probable', layers: [['ice', 25], ['ocean', 25], ['rock', 148.2]], lad: [0.5, 0.5, 0.5, 0, 0], mission: 'None.',
      ev: 'Cassini’s orbital data give a libration and orbit that fit either an elongated core or a young ocean; the second is favoured (Lainey and colleagues, 2024). Its heavily cratered surface shows no sign of one.', ladNote: 'A young ocean, sealed under an old-looking shell; no way to sample it.' },
    { id: 'titan', name: 'Titan', R: 2574.7, au: 9.54, g: 1.352, kind: 'ice', st: 'probable', layers: [['ice', 100], ['ocean', 200], ['hp', 150], ['rock', 2124.7]], lad: [0.5, 0.5, 1, 1, 0.5], mission: 'Dragonfly is due to launch in 2028 and reach Titan in 2034.',
      ev: 'Cassini measured a tidal flexing (Love number about 0.6) that a solid interior would not allow. A 2025 reanalysis of the same radio data argues for slushy ice with pockets of liquid rather than one open ocean; the question is open. The lakes on the surface are liquid methane and ethane.', ladNote: 'Rich organic chemistry at the surface; water far below, with a hard barrier between.' },
    { id: 'triton', name: 'Triton', R: 1353.4, au: 30.1, g: 0.78, kind: 'ice', st: 'possible', layers: [['ice', 150], ['ocean', 50], ['rock', 1153.4]], lad: [0.5, 0.5, 0.5, 0.5, 0.5], mission: 'Only Voyager 2’s flyby of 1989; a return is proposed.',
      ev: 'A captured Kuiper-belt object. Voyager 2 saw geysers of dark material and nitrogen frost. Heat from its capture and later tides may have left a liquid layer; there is no direct evidence. The layers drawn are hypothetical.', ladNote: 'Active surface, one flyby, little else.' },
    { id: 'pluto', name: 'Pluto', R: 1188.3, au: 39.5, g: 0.62, kind: 'ice', st: 'probable', layers: [['ice', 150], ['ocean', 100], ['rock', 938.3]], lad: [0.5, 0, 0.5, 1, 0], mission: 'New Horizons flew by in July 2015; nothing is planned.',
      ev: 'Sputnik Planitia, a nitrogen-ice basin about 1,000 km wide, lies near the point opposite Charon where a heavy load would drift to; that fits a thinned shell over an ocean (Nimmo and colleagues, 2016). The layers drawn are hypothetical.', ladNote: 'A cold, perhaps ammonia-rich ocean that has survived under insulating ice, with no energy source but radioactivity.' }
  ];
  const STC = { known: 'rgba(40,125,220,1)', strong: 'rgba(40,125,220,1)', probable: 'rgba(100,175,230,1)', possible: 'rgba(235,180,60,1)', none: 'rgba(150,150,150,1)' };
  const STN = { known: 'known', strong: 'strong evidence', probable: 'probable', possible: 'possible', none: 'none today' };
  const LAYC = { ocean: SEA, ice: ICE, rock: ROCK, hp: 'rgba(170,150,230,0.9)', crust: 'rgba(190,200,210,0.9)' };
  const LAYN = { ocean: 'ocean', ice: 'ice shell', rock: 'rock and core', hp: 'high-pressure ice', crust: 'crust' };
  const RUNGS = ['Liquid water', 'Energy', 'Elements', 'Time', 'Reach'];

  Hyper.sim('ow-ocean-map', {
    title: 'Which worlds have oceans',
    blurb: `The worlds of the Solar System that matter to this story, **in order of distance from the Sun and all to the same scale**. Each is ringed by how strong the evidence for liquid water is today. Click a world to see its radius drawn as a bar from the surface to the centre, with the ice, ocean and rock to scale.

Switch to the **habitability ladder** and the same worlds are scored on five rungs — liquid water, an energy source, the building elements (C, H, N, O, P, S), time, and whether anything reaches us from the ocean. A full rung is strong evidence, a half rung suggestive; Earth has all five. It is a teaching device, not an official scale, and the scores are judgements from the published findings.

**Try this**
- Notice how small the ocean worlds are beside Earth, yet how much water they may hold: Europa has two to three times Earth's ocean water.
- Compare Enceladus and Callisto on the ladder: one has the evidence for energy and a way to reach it, the other is larger but quiet.
- Find the world with energy but no water (Io) and the world with water but little energy (Callisto).
- Look at where the ring colour changes with distance: the ocean worlds all lie beyond the snow line, in the cold, kept liquid by heat from inside.

*Layers beyond Earth are models: the thicknesses shown for Triton, Pluto and Mimas are illustrative, for the others they are mid-range published values.*`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 400 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Colour the worlds by', options: [['Evidence for an ocean', 'oceans'], ['Habitability ladder', 'ladder']], value: params.mode || 'oceans' }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['name', 'World'], ['size', 'Radius · gravity · distance'], ['status', 'Ocean today'], ['ev', 'The evidence'], ['rung', 'On the ladder'], ['mission', 'What comes next']]);
      let sel = BODIES.some(b => b.id === params.sel) ? params.sel : 'europa';
      let pos = [];
      kit.click(st, p => { let best = null, bd = 1e9; for (const q of pos) { const d = Math.hypot(p.x - q.x, p.y - q.y); if (d < Math.max(q.r + 8, 14) && d < bd) { bd = d; best = q.id; } } if (best) sel = best; }, p => pos.some(q => Math.hypot(p.x - q.x, p.y - q.y) < Math.max(q.r + 8, 14)));
      const score = b => b.lad.reduce((s, v) => s + v, 0);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const lad = V.mode === 'ladder', pad = 18, gap = 9;
        const sumD = BODIES.reduce((s, b) => s + 2 * b.R, 0), s = (Wd - 2 * pad - gap * (BODIES.length - 1)) / sumD;
        const cy = 112; let x = pad; pos = [];
        for (const b of BODIES) {
          const r = Math.max(2.5, b.R * s), cx = x + r;
          x += 2 * r + gap;
          pos.push({ id: b.id, x: cx, y: cy, r });
          c.beginPath(); circ(c, cx, cy, r);
          c.fillStyle = b.kind === 'earth' ? 'rgba(40,125,220,0.75)' : b.kind === 'ice' ? 'rgba(205,220,238,0.92)' : 'rgba(160,118,88,0.92)'; c.fill();
          const sc = score(b), col = lad ? 'rgba(60,170,110,' + (0.25 + 0.75 * sc / 5).toFixed(2) + ')' : STC[b.st];
          c.lineWidth = b.id === sel ? 4 : 2.5; c.strokeStyle = col;
          if (!lad && b.st === 'possible') c.setLineDash([4, 3]);
          c.beginPath(); circ(c, cx, cy, r + 3); c.stroke(); c.setLineDash([]);
          if (b.id === sel) { c.lineWidth = 1.5; c.strokeStyle = C.text; c.beginPath(); circ(c, cx, cy, r + 8); c.stroke(); }
          const ty = cy + Math.max(r, 12) + 18;
          kit.label(c, b.name, cx, ty + (BODIES.indexOf(b) % 2) * 13, { align: 'center', size: 10.5, weight: b.id === sel ? 700 : 500 });
          kit.label(c, lad ? sc.toFixed(1) + '/5' : STN[b.st], cx, ty + 26 + (BODIES.indexOf(b) % 2) * 13, { align: 'center', size: 9.5, color: C.muted });
        }
        kit.label(c, 'to scale · in order of distance from the Sun (1 AU to 39.5 AU)', pad, 14, { size: 11, color: C.muted });
        /* the layer bar for the selected world */
        const b = BODIES.find(q => q.id === sel) || BODIES[0];
        const by = 250, bh = 34, bx = pad, bw = Wd - 2 * pad;
        kit.label(c, b.name + ': from the surface (left) to the centre (right), to scale', bx, by - 16, { size: 12, weight: 650 });
        let xx = bx;
        for (const [k, t] of b.layers) {
          const w = bw * t / b.R;
          c.fillStyle = LAYC[k]; c.fillRect(xx, by, Math.max(1.2, w), bh);
          if (w > 62) kit.label(c, LAYN[k] + ' ' + (t >= 10 ? t.toFixed(0) : t.toFixed(1)) + ' km', xx + 5, by + bh / 2, { size: 11 });
          else if (w > 1 && k !== 'rock') kit.label(c, LAYN[k] + ' ' + (t >= 10 ? t.toFixed(0) : t.toFixed(1)) + ' km', xx, by + bh + 12 + (k === 'ocean' ? 13 : 0), { size: 10.5, color: C.muted });
          xx += w;
        }
        c.strokeStyle = C.axis; c.strokeRect(bx + 0.5, by + 0.5, bw, bh);
        /* the ladder */
        if (lad) {
          const ry = by + 90, rw = (Wd - 2 * pad - 4 * 12) / 5;
          for (let i = 0; i < 5; i++) {
            const rx = pad + i * (rw + 12), v = b.lad[i];
            c.strokeStyle = C.axis; c.strokeRect(rx + 0.5, ry + 0.5, rw, 22);
            c.fillStyle = 'rgba(60,170,110,0.85)'; c.fillRect(rx + 1, ry + 1, (rw - 1) * v, 21);
            kit.label(c, RUNGS[i], rx + rw / 2, ry - 8, { align: 'center', size: 11 });
            kit.label(c, v === 1 ? 'strong' : v === 0.5 ? 'suggested' : 'none yet', rx + rw / 2, ry + 36, { align: 'center', size: 10.5, color: C.muted });
          }
        } else {
          const lx = pad, ly = by + 96;
          kit.label(c, 'Ring colour:', lx, ly, { size: 11, color: C.muted });
          let q = lx + 76;
          for (const k of ['strong', 'probable', 'possible', 'none']) { c.lineWidth = 3; c.strokeStyle = STC[k]; if (k === 'possible') c.setLineDash([4, 3]); c.beginPath(); circ(c, q + 6, ly, 6); c.stroke(); c.setLineDash([]); kit.label(c, STN[k], q + 17, ly, { size: 11 }); q += 112; }
        }
        ro.set('name', b.name);
        ro.set('size', 'radius ' + b.R.toLocaleString('en-GB') + ' km · g ' + b.g + ' m/s² · ' + b.au + ' AU');
        ro.set('status', STN[b.st]);
        ro.set('ev', b.ev);
        ro.set('rung', score(b).toFixed(1) + ' of 5 — ' + b.ladNote);
        ro.set('mission', b.mission);
      }, box.stage);
      loop.start();
    }
  });
  /* ================================================================ 6. tidal flexing */
  Hyper.sim('ow-tidal-flex', {
    title: 'A moon that is squeezed and let go',
    blurb: `A moon in orbit round its planet on an orbit that is **not quite circular**. When it is close, the planet's pull on it is stronger and the moon is stretched along the line to the planet; when it is farther, the stretch relaxes. The moon is kneaded once every orbit, and the friction in all that kneading is heat. The graph below shows the size of the tide through one orbit; the shading of the moon shows how fast it is changing.

The heating power uses the standard form for a moon that always shows the same face to its planet (Peale, Cassen and Reynolds, 1979):

$$\\dot E = \\frac{21}{2}\\,\\frac{k_2}{Q}\\,\\frac{G M_p^2 R^5 n e^2}{a^6}$$

with $k_2$ the Love number (how much the moon yields), $Q$ the dissipation (how much of each squeeze is lost), $n$ the orbital angular speed. The heat goes as the *square* of the eccentricity, the *fifth* power of the radius and about the *seventh and a half* power of the distance (the $a^{-6}$ shown, and $n \\propto a^{-3/2}$ besides).

**Try this**
- Choose *Io*: about a hundred trillion watts. Halve $e$: a quarter of the heat.
- Choose *Enceladus* and push $k_2/Q$ up by a factor of twenty: it takes that much to reproduce the 15 GW Cassini measured.
- Move the moon outward: ten per cent farther away and the heat drops to about half.
- Set $e$ to zero and the heating stops, whatever else you do. This is why resonances matter: they keep $e$ alive.

*The k₂/Q values are set to reproduce the usual published estimates (Io about 10¹⁴ W, Europa about 1 TW, Enceladus about 1 GW from tides alone); they are assumptions, not measurements. The orbit is drawn with its eccentricity exaggerated if the box is ticked.*`,
    mount(box, kit, params) {
      const W = kit.water;
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260, maxH: 330 });
      box.stage.appendChild(graph);
      const G = 6.6743e-11;
      const PRE = {
        io: { name: 'Io', pl: 'Jupiter', Mp: 1.898e27, a: 421800, R: 1821.6, e: 0.0041, P: 1.769138, kq: 0.015, obs: 'about 10¹⁴ W measured, roughly 2 W/m² over the whole surface' },
        europa: { name: 'Europa', pl: 'Jupiter', Mp: 1.898e27, a: 671100, R: 1560.8, e: 0.0094, P: 3.551181, kq: 0.0022, obs: 'not measured; models give around 1 TW' },
        enceladus: { name: 'Enceladus', pl: 'Saturn', Mp: 5.683e26, a: 238020, R: 252.1, e: 0.0047, P: 1.370218, kq: 0.0007, obs: 'about 15 GW leaves the south pole (Cassini); tides alone are estimated at about 1 GW' }
      };
      const p0 = PRE[params.preset] ? params.preset : 'io';
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Moon', options: Object.keys(PRE).map(k => [PRE[k].name + ' (' + PRE[k].pl + ')', k]), value: p0 },
        { id: 'e', label: 'Eccentricity e', min: 0, max: 0.03, step: 0.0001, value: PRE[p0].e, sig: 3 },
        { id: 'ax', label: 'Orbit size (× actual)', min: 0.7, max: 1.5, step: 0.01, value: 1 },
        { id: 'kq', label: 'k₂ / Q', min: 0.0001, max: 0.1, value: PRE[p0].kq, log: true, sig: 2 },
        { id: 'ex', type: 'check', label: 'Draw the orbit and the tide exaggerated', value: true }
      ], (id, v) => { if (id === 'pre') { ctl.set('e', PRE[v].e); ctl.set('kq', PRE[v].kq); ctl.set('ax', 1); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['P', 'Tidal heating'], ['fl', 'Per square metre'], ['er', 'Compared with Earth’s mean heat flow (0.087 W/m²)'], ['T', 'Orbit period · mean motion'], ['sw', 'Tide swing over an orbit'], ['obs', 'What is measured']]);
      const plot = kit.plot(graph, { x: { label: 'orbital phase (fraction of one orbit)', min: 0, max: 1 }, y: { label: 'tide strength (1 = mean distance)' } }, 160);
      const kep = (M, e) => { let E = M; for (let i = 0; i < 8; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); return E; };
      const fOf = (M, e) => { const E = kep(M, e); return Math.pow(1 / (1 - e * Math.cos(E)), 3); };
      let M = 0, key = '';
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const p = PRE[V.pre] || PRE.io, a = p.a * V.ax * 1e3, Rm = p.R * 1e3, e = V.e;
        const n = Math.sqrt(G * p.Mp / (a * a * a));
        const power = 10.5 * V.kq * G * p.Mp * p.Mp * Math.pow(Rm, 5) * n * e * e / Math.pow(a, 6);
        const area = 4 * Math.PI * Rm * Rm;
        M += TAU * dt / (7 * Math.pow(V.ax, 1.5));
        const ed = Math.min(0.85, e * (V.ex ? 40 : 1));
        const A = Math.min(Wd * 0.34, Hh * 0.62), B = A * Math.sqrt(1 - ed * ed);
        const oy = Hh * 0.5, E = kep(M, ed);
        const mx = Wd * 0.5 + A * Math.cos(E), my = oy + B * Math.sin(E);     // the ellipse is centred on the page; the planet sits at the focus, A*e to the right
        const fx = Wd * 0.5 + A * ed, fy = oy;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
        for (let i = 0; i <= 120; i++) { const t = TAU * i / 120; const X = Wd * 0.5 + A * Math.cos(t), Y = oy + B * Math.sin(t); if (i) c.lineTo(X, Y); else c.moveTo(X, Y); }
        c.stroke();
        c.beginPath(); circ(c, fx, fy, 15); c.fillStyle = 'rgba(210,170,120,0.9)'; c.fill();
        kit.label(c, p.pl, fx, fy + 28, { align: 'center', size: 11, color: C.muted });
        /* the moon: an ellipse stretched towards the planet by the tide at this distance */
        const fnow = fOf(M, ed), rm = 15, beta = 0.28;
        const ang = Math.atan2(fy - my, fx - mx);
        // the glow follows how fast the tide is changing
        const dfdM = m => Math.abs(fOf(m + 0.05, ed) - fOf(m - 0.05, ed)) / 0.1;
        let fmax = 1e-9; for (let i = 0; i < 24; i++) fmax = Math.max(fmax, dfdM(TAU * i / 24));
        const rate = dfdM(M) / fmax;
        const glow = clamp(0.12 + 0.7 * rate, 0, 0.85);
        c.save(); c.translate(mx, my); c.rotate(ang);
        c.beginPath(); circ(c, 0, 0, rm * 1.9); c.fillStyle = 'rgba(255,140,40,' + (V.ex ? glow * 0.45 : glow * 0.2).toFixed(2) + ')'; c.fill();
        c.beginPath(); c.ellipse(0, 0, rm * (1 + beta * fnow * (V.ex ? 1 : 0.35)), rm * (1 - beta * fnow * 0.5 * (V.ex ? 1 : 0.35)), 0, 0, TAU);
        c.fillStyle = 'rgba(205,220,238,0.95)'; c.fill(); c.strokeStyle = C.axis; c.stroke();
        c.restore();
        kit.label(c, p.name, mx, my - 26, { align: 'center', size: 11.5, weight: 650 });
        kit.label(c, 'not to scale · e drawn ' + (V.ex ? '×40' : 'as is'), 10, 14, { size: 10.5, color: C.muted });
        kit.label(c, 'orange glow: tide changing fastest = most friction', 10, 30, { size: 10.5, color: C.muted });
        /* the graph */
        const k = [V.pre, e, V.ax].join('|');
        if (k !== key) {
          key = k;
          const pts = []; for (let i = 0; i <= 100; i++) pts.push([i / 100, fOf(TAU * i / 100, e)]);
          plot.set({ series: [{ pts, label: 'tide ∝ 1/distance³', color: C.warn }] });
        }
        plot.set({ marks: [{ x: ((M / TAU) % 1 + 1) % 1, y: fOf(M, e), label: '' }] });
        const sw = (Math.pow((1 + e) / (1 - e), 3) - 1) / 2;
        ro.set('P', fmtW(power));
        ro.set('fl', (power / area).toPrecision(2) + ' W/m²');
        ro.set('er', (power / area / 0.087).toFixed(power / area / 0.087 < 10 ? 2 : 1) + ' ×');
        ro.set('T', (TAU / n / 86400).toFixed(3) + ' days · ' + n.toExponential(2) + ' rad/s');
        ro.set('sw', '±' + (100 * sw).toFixed(2) + ' % of the mean tide');
        ro.set('obs', p.obs);
      }, box.stage);
      loop.start();
    }
  });
  /* ================================================================ 7. a transit spectrum (schematic) */
  Hyper.sim('ow-transit-spectrum', {
    title: 'Reading an atmosphere from starlight',
    blurb: `When a planet crosses its star, starlight grazes the planet's atmosphere on its way to us. At wavelengths where a gas absorbs, the atmosphere looks thicker, the planet looks slightly bigger and the dip in light is slightly deeper. The graph shows that **extra** dip, in parts per million, against wavelength — the bands of water, methane and carbon dioxide. The dots are what a telescope would record after the number of transits you choose.

How big the bands are is set by the **scale height** $H = k_BT/(\\mu m_H g)$: a hot, light, low-gravity atmosphere is puffy and shows a large signal; a heavy, cool one, like Earth's, shows almost nothing. The band depth is about $2R_pHn/R_\\star^2$, with $n$ a few scale heights of atmosphere probed, and it is the *star's* size that dilutes it.

**Try this**
- Start with *K2-18 b*: a hydrogen-rich atmosphere (light, puffy) around a small red dwarf gives bands of hundreds of parts per million. Lower the number of transits and see them sink into the scatter.
- Switch to *Earth in front of the Sun* and read the signal: a fraction of a part per million. That is why an Earth twin around a Sun twin is out of reach.
- Switch the atmosphere to *steam* (μ = 18) or to *air* (μ = 29): the bands shrink by a factor of ten.
- Raise the cloud level: the bands flatten, as they did for GJ 1214 b, which for years looked featureless.
- Read the *transits needed* line: signal-to-noise grows only as the square root of the number of transits.

*Schematic:* the band positions are the real ones (water near 0.94, 1.13, 1.4, 1.9 and 2.7 µm; methane near 1.7, 2.3 and 3.3 µm; carbon dioxide near 2.0, 2.7 and 4.3 µm), the shapes and strengths are invented; no real spectrum, noise model or retrieval is used. It shows why a result is hard, not what any planet's spectrum is.`,
    mount(box, kit, params) {
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 150, maxH: 230 });
      box.stage.appendChild(graph);
      const PL = {
        k218: { name: 'K2-18 b (hycean candidate)', Rp: 2.61, Rs: 0.445, T: 255, g: 12.4, mu: 2.3, h2o: 0.3, ch4: 0.9, co2: 0.6, cloud: 0.1, note: '124 light-years away; a planet 2.6 times Earth’s radius, 8.6 times its mass, round a red dwarf' },
        t1e: { name: 'TRAPPIST-1 e (rocky, unknown air)', Rp: 0.92, Rs: 0.119, T: 251, g: 8.0, mu: 29, h2o: 0.4, ch4: 0.2, co2: 0.5, cloud: 0, note: 'an Earth-sized planet in the habitable zone of a very small, cool star' },
        gj: { name: 'GJ 1214 b (clouds or steam?)', Rp: 2.7, Rs: 0.216, T: 555, g: 11, mu: 18, h2o: 0.5, ch4: 0.1, co2: 0.2, cloud: 0.9, note: 'a hot sub-Neptune whose transit spectrum is flat, either from clouds or from a heavy steam atmosphere' },
        earth: { name: 'Earth in front of the Sun', Rp: 1, Rs: 1, T: 255, g: 9.8, mu: 29, h2o: 0.6, ch4: 0.1, co2: 0.3, cloud: 0, note: 'for comparison: the signal an alien astronomer would be after' }
      };
      const p0 = PL[params.planet] ? params.planet : 'k218';
      const ctl = kit.controls(box.side, [
        { id: 'pl', type: 'select', label: 'Planet', options: Object.keys(PL).map(k => [PL[k].name, k]), value: p0 },
        { id: 'mu', type: 'select', label: 'Atmosphere', options: [['hydrogen-rich (μ 2.3)', 2.3], ['steam (μ 18)', 18], ['nitrogen–oxygen air (μ 29)', 29], ['carbon dioxide (μ 44)', 44]], value: PL[p0].mu },
        { id: 'T', label: 'Temperature', min: 150, max: 700, step: 5, value: PL[p0].T, unit: 'K' },
        { id: 'g', label: 'Surface gravity', min: 2, max: 30, step: 0.2, value: PL[p0].g, unit: 'm/s²' },
        { id: 'Rp', label: 'Planet radius', min: 0.5, max: 4, step: 0.05, value: PL[p0].Rp, unit: 'R⊕' },
        { id: 'Rs', label: 'Star radius', min: 0.1, max: 1.2, step: 0.01, value: PL[p0].Rs, unit: 'R☉' },
        { id: 'h2o', label: 'Water vapour', min: 0, max: 1, step: 0.05, value: PL[p0].h2o },
        { id: 'ch4', label: 'Methane', min: 0, max: 1, step: 0.05, value: PL[p0].ch4 },
        { id: 'co2', label: 'Carbon dioxide', min: 0, max: 1, step: 0.05, value: PL[p0].co2 },
        { id: 'cloud', label: 'Clouds and haze', min: 0, max: 1, step: 0.05, value: PL[p0].cloud },
        { id: 'N', label: 'Transits observed', min: 1, max: 100, step: 1, value: 10 },
        { id: 'noise', label: 'Noise per bin per transit', min: 20, max: 400, value: 100, unit: 'ppm', log: true, sig: 2 }
      ], (id, v) => { if (id === 'pl') { const q = PL[v]; for (const k of ['mu', 'T', 'g', 'Rp', 'Rs', 'h2o', 'ch4', 'co2', 'cloud']) ctl.set(k, q[k]); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['H', 'Scale height'], ['base', 'Depth of the transit (Rp/R★)²'], ['amp', 'Largest band above the continuum'], ['snr', 'Strongest band ÷ noise'], ['need', 'Transits for 5σ in one bin'], ['note', 'About this planet']]);
      const plot = kit.plot(graph, { x: { label: 'wavelength (µm)', min: 0.6, max: 5.4 }, y: { label: 'extra transit depth (ppm)' }, legend: true }, 220);
      const BANDS = [
        ['h2o', 0.94, 0.03, 0.8], ['h2o', 1.13, 0.04, 1.0], ['h2o', 1.4, 0.06, 2.5], ['h2o', 1.9, 0.08, 3.5], ['h2o', 2.7, 0.14, 6],
        ['ch4', 1.15, 0.03, 0.8], ['ch4', 1.7, 0.07, 2.0], ['ch4', 2.3, 0.07, 2.5], ['ch4', 3.3, 0.12, 6],
        ['co2', 2.0, 0.03, 1.0], ['co2', 2.7, 0.06, 2.5], ['co2', 4.3, 0.12, 8]
      ];
      const rnd = prng(20261014), z = Array.from({ length: 25 }, () => { let u = 0; for (let i = 0; i < 6; i++) u += rnd(); return (u - 3) * Math.SQRT2; });
      const kB = 1.380649e-23, mH = 1.6735575e-27, RE = 6.371e6, RS = 6.957e8;
      let key = '';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const Rp = V.Rp * RE, Rs = V.Rs * RS;
        const H = kB * V.T / (V.mu * mH * V.g);
        const unit = 2 * Rp * H / (Rs * Rs) * 1e6;                       // ppm per scale height
        const f = lam => { let s = 0; for (const b of BANDS) s += V[b[0]] * b[3] * Math.exp(-0.5 * ((lam - b[1]) / b[2]) ** 2); return s * unit * (1 - 0.92 * V.cloud); };
        const sigma = V.noise / Math.sqrt(V.N);
        const k = [V.pl, V.mu, V.T, V.g, V.Rp, V.Rs, V.h2o, V.ch4, V.co2, V.cloud, V.N, V.noise].join('|');
        let amp = 0; const model = [];
        for (let i = 0; i <= 240; i++) { const lam = 0.6 + 4.8 * i / 240, y = f(lam); model.push([lam, y]); amp = Math.max(amp, y); }
        if (k !== key) {
          key = k;
          const data = []; for (let i = 0; i < 25; i++) { const lam = 0.65 + 0.2 * i; data.push([lam, f(lam) + sigma * z[i]]); }
          plot.set({ series: [{ pts: model, label: 'model', color: C.accent, width: 2 }, { pts: data, label: 'data after ' + V.N + ' transits', color: C.warn, dots: true, line: false }] });
        }
        /* the picture on the stage: a star, a dark planet with a thin atmosphere ring, and the light curve */
        const sx = Wd * 0.2, sy = Hh * 0.5, sr = Math.min(Hh * 0.38, 56);
        c.beginPath(); circ(c, sx, sy, sr); c.fillStyle = V.Rs < 0.3 ? 'rgba(235,120,70,0.95)' : 'rgba(250,200,90,0.95)'; c.fill();
        const pr = Math.max(2, sr * Rp / Rs), atm = Math.max(0.5, pr * H / Rp * 6 * (1 - 0.5 * V.cloud));
        if (pr < sr * 3) {
          c.beginPath(); circ(c, sx, sy, pr + atm); c.fillStyle = 'rgba(90,150,230,0.35)'; c.fill();
          c.beginPath(); circ(c, sx, sy, pr); c.fillStyle = 'rgba(20,25,40,0.95)'; c.fill();
        }
        kit.label(c, 'star and planet to scale; atmosphere (6 scale heights) in blue', sx - sr, Hh - 10, { size: 10.5, color: C.muted });
        kit.label(c, 'dip in light ≈ ' + sig((Rp / Rs) ** 2 * 1e6, 3) + ' ppm', Wd * 0.5, Hh * 0.35, { size: 12, weight: 650 });
        kit.label(c, 'the bands add ' + sig(amp, 2) + ' ppm at most', Wd * 0.5, Hh * 0.35 + 20, { size: 12, color: C.accent });
        ro.set('H', (H / 1e3).toFixed(H < 1e4 ? 1 : 0) + ' km');
        ro.set('base', sig((Rp / Rs) ** 2 * 1e6, 3) + ' ppm = ' + ((Rp / Rs) ** 2 * 100).toFixed(3) + ' %');
        ro.set('amp', sig(amp, 2) + ' ppm (one scale height = ' + sig(unit, 2) + ' ppm)');
        ro.set('snr', amp > 0 ? (amp / sigma).toFixed(1) + ' σ with ' + V.N + ' transits' : 'no bands set');
        ro.set('need', amp > 0 ? Math.ceil(Math.pow(5 * V.noise / amp, 2)) + ' transits (noise ' + V.noise.toFixed(0) + ' ppm each)' : '—');
        ro.set('note', PL[V.pl] ? PL[V.pl].note : '');
      }, box.stage);
      loop.start();
    }
  });
})();
