/* HYPER-OPTICS · sims/coatings-and-filters.js — simulations of the topic "Coatings and filters" (ids cf-…)
 *   cf-surface-losses  light lost at glass–air surfaces: the beam through a train of surfaces, the ghosts, with and without a coating
 *   cf-ar-coating      anti-reflection coatings: the layers, the reflectance curve R(λ), the tint of the reflection
 *   cf-stack           a stack built layer by layer (H L H L …): the spectrum, the reflectance climbing, the stop band
 *   cf-metals          metal mirror coatings: reflectance of aluminium, silver, gold, copper against wavelength, and their colour
 *   cf-aoi             the angle of incidence: a coating's curve shifts to the blue and splits into s and p; the cone of a lens
 *   cf-filters         band-pass, long-pass, short-pass and notch interference filters on a linear and an optical-density scale
 *   cf-dichroic        a dichroic mirror at 45°: white light split into two colours; hot and cold mirrors; a fluorescence filter cube
 *   cf-glass           coloured glass: the Urbach-like edge, thickness, angle — against an interference filter
 *   cf-density         neutral-density filters: optical density, stops, stacking, absorbing against reflecting
 *   cf-deposition      a vacuum coating chamber: vapour, the growing layer, the optical monitor that stops it at a quarter wave
 *   cf-damage          laser damage: the peak fluence of a Gaussian pulse against the damage threshold of each kind of coating
 * Numbers come from kit.optics (the thin-film matrix code, the colour functions); the drawing from kit.osym and kit.plot.
 * The coloured-glass spectra and the particle motion in the vacuum chamber are schematic and are labelled so.
 */
(function () {
  'use strict';
  const PI = Math.PI, D2R = PI / 180, R2D = 180 / PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pct = (x, d) => { const v = 100 * x; return (d != null ? v.toFixed(d) : v >= 10 ? v.toFixed(1) : v >= 0.1 ? v.toFixed(2) : v >= 0.001 ? v.toFixed(3) : v.toExponential(1)) + ' %'; };
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = n => String(n).split('').map(ch => SUP[ch] || ch).join('');

  /* the colour of daylight after a filter, a mirror or a coating: spec(nm) is the fraction of each wavelength kept.
     -> { lin: linear RGB (1 = the daylight itself), Y: the fraction of the luminance kept } */
  function makeTint(O) {
    const Cl = O.colour, day = O.photo.spectrum('daylight'), W = Cl.xyz(day, true);
    const wl = Cl.toRgb([W[0] / W[1], 1, W[2] / W[1]]);
    return function (spec) {
      const q = Cl.xyz(nm => day(nm) * clamp(spec(nm), 0, 1), true);
      const lin = Cl.toRgb([q[0] / W[1], q[1] / W[1], q[2] / W[1]]).map((v, k) => Math.max(0, v) / wl[k]);
      return { lin, Y: q[1] / W[1] };
    };
  }
  // the colour as a css string; with `top` the brightest channel is raised to that value (so that a faint reflection shows its hue)
  const css = (O, lin, top) => O.colour.css(O.colour.fit(lin.slice(), top));
  // a name for a display colour [r, g, b] (0…255), by hue and saturation
  function hueName(rgb) {
    const r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    if (mx <= 0 || d / mx < 0.1) return 'neutral (grey)';
    let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
    const pale = d / mx < 0.3 ? 'pale ' : '';
    if (h < 20 || h >= 345) return pale + 'red / pink';
    if (h < 45) return pale + 'orange / amber';
    if (h < 70) return pale + 'yellow';
    if (h < 165) return pale + 'green';
    if (h < 200) return pale + 'cyan';
    if (h < 255) return pale + 'blue';
    return pale + 'violet / purple';
  }
  // a small cache for expensive spectra: cached(key, fn) keeps the last few results
  function makeMemo(limit) {
    const memo = {};
    return (key, fn) => { if (!(key in memo)) { const ks = Object.keys(memo); if (ks.length >= (limit || 24)) delete memo[ks[0]]; memo[key] = fn(); } return memo[key]; };
  }
  // the colour of a light with the spectrum f(nm), as linear RGB scaled to a luminance of 1 (for drawing a beam)
  function hueOf(O, f) {
    const Cl = O.colour, q = Cl.xyz(f, true);
    return q[1] > 0 ? Cl.toRgb([q[0] / q[1], 1, q[2] / q[1]]) : [0.5, 0.5, 0.5];
  }
  // the index of a coating layer's material (a number, a coating material id or an optical material id)
  const nOfLayer = (O, x) => typeof x === 'number' ? x : (O.film.COATING_MATERIALS[x] ? O.film.COATING_MATERIALS[x].n : O.index(x, 550));
  /* the wavelength where T (or R) crosses a level, searching upwards from lo to hi: dir +1 finds the first rise above the level,
     dir −1 the first fall below it; NaN when it is never crossed */
  function crossing(f, lo, hi, level, dir, step) {
    let prev = f(lo);
    for (let nm = lo + step; nm <= hi + 1e-9; nm += step) {
      const v = f(nm);
      if (dir > 0 ? (prev < level && v >= level) : (prev >= level && v < level)) return nm - step + step * (level - prev) / (v - prev);
      prev = v;
    }
    return NaN;
  }

  /* ================================================================ light lost at surfaces */
  Hyper.sim('cf-surface-losses', {
    title: 'Light lost at glass–air surfaces',
    blurb: `A beam of light passes through a train of glass–air surfaces — the surfaces of the lenses in a camera lens or a microscope. At every one a little light is reflected: that light is lost from the image, and some of it comes back as a **ghost**. The bars underneath show how much of the beam is left after each surface; the arrows going up show the reflections (their length is exaggerated).

**Try this**
- Set 10 surfaces of crown glass, uncoated: about a third of the light is gone before it reaches the sensor.
- Choose the *broadband multilayer*: the same ten surfaces now lose about 2 %.
- Watch the **ghost paths** line: with 24 surfaces there are 276 ways for the light to bounce twice and reach the image as a faint copy.
- Change the glass to *dense flint*: a higher index reflects more (8 % a surface).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, F = O.film;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const GLASS = [['Crown glass N-BK7', 'N-BK7'], ['Fused silica', 'fused-silica'], ['Dense flint N-SF11', 'N-SF11'], ['Sapphire', 'sapphire']];
      const COAT = [['Uncoated', 'uncoated'], ['Single layer of MgF₂', 'mgf2'], ['Broadband multilayer', 'bbar']];
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Glass–air surfaces', min: 1, max: 24, step: 1, value: params.N || 10 },
        { id: 'glass', type: 'select', label: 'Glass', options: GLASS, value: params.glass || 'N-BK7' },
        { id: 'coat', type: 'select', label: 'Coating on every surface', options: COAT, value: params.coat || 'uncoated' },
        { id: 'ghost', type: 'check', label: 'Draw one ghost path', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['R', 'Reflected at each surface'], ['T1', 'Straight through the stack'], ['Tm', 'In all, with the bouncing light'], ['lost', 'Lost from the image'], ['gh', 'Double-reflection ghost paths']]);
      const plot = kit.plot(box.side, { x: { label: 'surfaces', min: 0, max: 24 }, y: { label: 'light through (%)', min: 0, max: 100 } }, 190);
      const cache = {};
      const surfR = (glass, coat) => {
        const key = glass + '|' + coat;
        if (!(key in cache)) cache[key] = coat === 'uncoated' ? O.normalR(1, O.index(glass, 550)) : F.stack(F.design(coat, 550, glass), 550, 0).R;
        return cache[key];
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, N = Math.round(V.N);
        const R = surfR(V.glass, V.coat), R0 = surfR(V.glass, 'uncoated');
        const x0 = 0.06 * W, x1 = 0.96 * W, cy = 0.3 * H, hh = 0.09 * H;
        const xs = []; for (let i = 0; i < N; i++) xs.push(x0 + (x1 - x0) * (i + 0.5) / N);
        // the glass: a slab between every second pair of surfaces
        for (let i = 0; i < N; i += 2) {
          const xe = i + 1 < N ? xs[i + 1] : x1;
          c.fillStyle = S.glass(0.3); c.fillRect(xs[i], cy - 1.9 * hh, xe - xs[i], 3.8 * hh);
          c.strokeStyle = S.edge(); c.lineWidth = 1; c.strokeRect(xs[i], cy - 1.9 * hh, xe - xs[i], 3.8 * hh);
        }
        // the beam, fading after every surface; the reflections as arrows (length exaggerated)
        let f = 1, prevX = 0.01 * W;
        for (let i = 0; i <= N; i++) {
          const xe = i < N ? xs[i] : x1 + 0.02 * W;
          c.fillStyle = S.nm(580, 0.12 + 0.8 * f); c.fillRect(prevX, cy - hh, xe - prevX, 2 * hh);
          if (i < N) {
            const len = 12 + 52 * Math.sqrt(clamp(f * R / 0.05, 0, 1));
            S.ray(c, [[xs[i], cy - 1.9 * hh], [xs[i], cy - 1.9 * hh - len]], { color: C.warn, width: 1.6, alpha: 0.9, arrows: true, minArrow: 10, head: 5 });
            f *= 1 - R; prevX = xs[i];
          }
        }
        kit.label(c, 'reflections (drawn larger than they are)', x0, 0.04 * H, { color: C.muted, size: 11.5 });
        // a ghost: reflected back at surface b, forward again at surface a
        if (V.ghost && N >= 2) {
          const a = 0, b = Math.min(N - 1, 3), dy = 0.1, y0 = cy + hh * 0.2;
          const P0 = [xs[a] - 18, y0], P1 = [xs[b], y0 + dy * (xs[b] - xs[a] + 18)], P2 = [xs[a], P1[1] + dy * (xs[b] - xs[a])], P3 = [x1, P2[1] + dy * (x1 - xs[a])];
          S.ray(c, [P0, P1, P2, P3], { color: C.bad, width: 1.5, dash: [5, 3], minArrow: 40 });
          kit.label(c, 'a ghost: reflected at surface ' + (b + 1) + ', again at surface ' + (a + 1), xs[a] - 10, cy + 2.35 * hh + 10, { color: C.bad, size: 11.5 });
        }
        // the light remaining after each surface, as bars
        const by = 0.93 * H, bh = 0.34 * H, bw = (x1 - x0) / (N + 1);
        f = 1;
        for (let i = 0; i <= N; i++) {
          c.fillStyle = S.nm(580, 0.85); c.fillRect(x0 + i * bw + 1, by - bh * f, bw - 2, bh * f);
          if (N <= 14 || i === N || i === 0) kit.label(c, (100 * f).toFixed(0), x0 + i * bw + bw / 2, by - bh * f - 7, { align: 'center', size: 10.5, color: C.muted });
          f *= 1 - R;
        }
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x0, by); c.lineTo(x1 + bw, by); c.stroke();
        kit.label(c, '% of the light left after 0, 1, 2 … surfaces', x0, by - bh - 22, { color: C.muted, size: 11.5 });
        // numbers
        const T1 = Math.pow(1 - R, N), Tm = (1 - R) / (1 + (N - 1) * R), pairs = N * (N - 1) / 2;
        ro.set('R', pct(R));
        ro.set('T1', pct(T1, 1));
        ro.set('Tm', pct(Tm, 1) + '  (1 − R)/(1 + (N − 1)R)');
        ro.set('lost', pct(1 - T1, 1) + ' of the image-forming light');
        ro.set('gh', pairs + ' paths, each R² = ' + pct(R * R, R * R < 0.001 ? 4 : 2) + ' of the beam');
        const pts = n => { const o = []; for (let i = 0; i <= 24; i++) o.push([i, 100 * Math.pow(1 - n, i)]); return o; };
        plot.set({
          series: V.coat === 'uncoated' ? [{ pts: pts(R0), color: C.series[0], width: 2.2, label: 'uncoated' }]
            : [{ pts: pts(R0), color: C.faint, width: 1.6, dash: true, label: 'uncoated' }, { pts: pts(R), color: C.series[1], width: 2.4, label: COAT.find(o => o[1] === V.coat)[0] }],
          marks: [{ x: N, y: 100 * T1, color: C.warn }]
        });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ anti-reflection coatings */
  Hyper.sim('cf-ar-coating', {
    title: 'Anti-reflection coatings: the layers and the reflectance curve',
    blurb: `A coating on glass, drawn to scale (thicknesses in nanometres) with the reflectance it gives at every visible wavelength. The coloured square is the colour of the light the coating reflects from daylight — brightened, because the real reflection is faint.

**Try this**
- *One layer of MgF₂* on crown glass: reflection falls from 4.2 % to about 1.3 % at the design wavelength, and rises on both sides. That is why coated lenses show a purple tint.
- Choose *one layer with an index you choose* and slide the index to √n of the glass (1.23 for crown glass): the reflection at the design wavelength drops to **zero**. No hard solid has so low an index.
- *V-coat*: zero at one wavelength, but beyond the V the reflection climbs above that of bare glass.
- *Broadband*: three layers keep the reflection below 1 % from 430 to 680 nm.
- Tilt the coating: the whole curve slides towards the blue.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, F = O.film;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const tint = makeTint(O);
      const SUB = [['Crown glass N-BK7 (n ≈ 1.52)', 'N-BK7'], ['Fused silica (n ≈ 1.46)', 'fused-silica'], ['Sapphire (n ≈ 1.77)', 'sapphire'], ['Dense flint N-SF11 (n ≈ 1.79)', 'N-SF11'], ['A glass of index 1.90', 1.9]];
      const DES = [['Uncoated', 'uncoated'], ['One layer of MgF₂', 'mgf2'], ['Two-layer V-coat', 'vcoat'], ['Three-layer broadband', 'bbar'], ['One layer with an index you choose', 'single']];
      const ctl = kit.controls(box.side, [
        { id: 'design', type: 'select', label: 'Coating', options: DES, value: params.design || 'mgf2' },
        { id: 'glass', type: 'select', label: 'Glass', options: SUB, value: params.glass || 'N-BK7' },
        { id: 'nm0', label: 'Design wavelength', min: 400, max: 800, step: 5, value: params.nm0 || 550, unit: 'nm' },
        { id: 'nL', label: 'Index of the single layer', min: 1.15, max: 2.2, step: 0.01, value: params.nL || 1.38 },
        { id: 'th', label: 'Angle of incidence', min: 0, max: 60, step: 1, value: params.th || 0, unit: '°' }
      ], (id) => { ctl.show('nL', V.design === 'single'); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['layers', 'Layers, from the air'], ['ideal', 'Ideal index of one layer, √n'], ['R0', 'Reflectance at the design wavelength'], ['Rv', 'Average over the visible (eye-weighted)'], ['tint', 'Colour of the reflection']]);
      const plot = kit.plot(box.side, { x: { label: 'wavelength (nm)', min: 380, max: 780 }, y: { label: 'reflectance (%)', min: 0 } }, 200);
      const cache = {};
      const defOf = () => {
        const key = [V.design, V.glass, V.nm0, V.design === 'single' ? V.nL : 0].join('|');
        if (!cache[key]) {
          cache[key] = V.design === 'single' ? { n0: 1, ns: V.glass, layers: [{ n: V.nL, d: F.quarterWave(V.nL, V.nm0) }] } : F.design(V.design, V.nm0, V.glass);
          if (Object.keys(cache).length > 40) { for (const k of Object.keys(cache)) if (k !== key) delete cache[k]; }
        }
        return cache[key];
      };
      const wts = []; { const day = O.photo.spectrum('daylight'); for (let nm = 400; nm <= 700; nm += 10) wts.push([nm, O.photo.V(nm) * day(nm)]); }
      const cachedAR = makeMemo(30);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, th = V.th * D2R;
        const def = defOf(), ns = O.index(V.glass, V.nm0);
        const Rof = nm => F.stack(def, nm, th).R;
        const calc = cachedAR([V.design, V.glass, V.nm0, V.nL, V.th].join('|'), () => {
          let sw1 = 0, sr = 0; for (const [nm, w] of wts) { sw1 += w; sr += w * Rof(nm); }
          const pts = [], p0 = []; for (let nm = 380; nm <= 780; nm += 4) { pts.push([nm, 100 * Rof(nm)]); p0.push([nm, 100 * F.stack({ n0: 1, ns: V.glass, layers: [] }, nm, th).R]); }
          return { R0: Rof(V.nm0), t: tint(nm => Rof(nm)), Rv: sr / sw1, pts, p0 };
        });
        // the cross-section, to scale
        const total = def.layers.reduce((a, l) => a + l.d, 0), sc = Math.min(0.5, 0.34 * H / Math.max(60, total));
        const x0 = 0.05 * W, x1 = 0.55 * W, yTop = 0.3 * H;
        c.fillStyle = S.glass(0.02); c.fillRect(x0, 0.04 * H, x1 - x0, yTop - 0.04 * H);
        kit.label(c, 'air  n = 1', x0 + 8, 0.04 * H + 13, { color: C.muted, size: 12 });
        let y = yTop;
        def.layers.forEach((l, i) => {
          const nn = nOfLayer(O, l.n), h = Math.max(2, l.d * sc);
          c.fillStyle = S.glass(clamp(0.12 + 0.5 * (nn - 1.2) / 1.2, 0.1, 0.7)); c.fillRect(x0, y, x1 - x0, h);
          c.strokeStyle = S.edge(); c.lineWidth = 1; c.strokeRect(x0, y, x1 - x0, h);
          const mat = typeof l.n === 'string' ? (F.COATING_MATERIALS[l.n] ? F.COATING_MATERIALS[l.n].name.replace(/ \(.*/, '') : l.n) : 'layer';
          kit.label(c, mat + '  n = ' + nn.toFixed(2) + '  ·  ' + l.d.toFixed(1) + ' nm', x0 + 8, y + h / 2, { color: C.text, size: 11.5 });
          y += h;
        });
        if (!def.layers.length) kit.label(c, 'bare surface', x0 + 8, yTop + 12, { color: C.muted, size: 12 });
        const yb = Math.max(y, yTop + 6);
        c.fillStyle = S.glass(0.3); c.fillRect(x0, yb, x1 - x0, 0.9 * H - yb);
        c.strokeStyle = S.edge(); c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb); c.stroke();
        kit.label(c, 'glass  n = ' + ns.toFixed(3), x0 + 8, yb + 16, { color: C.muted, size: 12 });
        // the light: incident and reflected, the reflected one as bright as it is
        const xr = x0 + 0.62 * (x1 - x0), R0 = calc.R0, Rr = clamp(Math.sqrt(R0 / 0.043), 0, 1);
        S.ray(c, [[xr - 30, yTop - 0.2 * H], [xr, yTop - 4]], { color: C.warn, width: 3, minArrow: 20 });
        S.ray(c, [[xr, yTop - 4], [xr + 30, yTop - 0.2 * H]], { color: C.warn, width: 2, alpha: 0.2 + 0.8 * Rr, minArrow: 20 });
        kit.label(c, 'reflected ' + pct(R0), xr + 36, yTop - 0.2 * H + 4, { color: C.warn, size: 11.5 });
        kit.label(c, 'to scale: 100 nm = ' + (100 * sc).toFixed(0) + ' px', x0, 0.96 * H, { color: C.faint, size: 11 });
        // the tint of the reflected daylight
        const t = calc.t, sx = 0.62 * W, sw = 0.34 * W;
        c.fillStyle = css(O, t.lin, 0.92); c.fillRect(sx, 0.14 * H, sw, 0.3 * H); c.strokeStyle = C.axis; c.strokeRect(sx, 0.14 * H, sw, 0.3 * H);
        kit.label(c, 'colour of the reflection (brightened)', sx, 0.1 * H, { color: C.muted, size: 12 });
        c.fillStyle = css(O, t.lin); c.fillRect(sx, 0.54 * H, sw, 0.18 * H); c.strokeRect(sx, 0.54 * H, sw, 0.18 * H);
        kit.label(c, 'as bright as it really is', sx, 0.5 * H, { color: C.muted, size: 12 });
        // numbers
        const Rv = calc.Rv;
        ro.set('layers', def.layers.length ? def.layers.map(l => (typeof l.n === 'string' ? l.n.replace(/(\d)/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]) : 'n ' + l.n.toFixed(2)) + ' ' + l.d.toFixed(0) + ' nm').join(' · ') : 'none')
        ro.set('ideal', Math.sqrt(ns).toFixed(3));
        ro.set('R0', pct(R0));
        ro.set('Rv', pct(Rv) + (V.design === 'uncoated' ? '' : '  (bare glass: ' + pct(O.normalR(1, ns)) + ')'));
        ro.set('tint', t.Y < 1e-6 ? 'none' : hueName(O.colour.srgb(O.colour.fit(t.lin.slice(), 0.9))));
        const pts = calc.pts, p0 = calc.p0;
        plot.set({ series: V.design === 'uncoated' ? [{ pts, color: C.series[0], width: 2.4, label: 'uncoated' }] : [{ pts: p0, color: C.faint, width: 1.5, dash: true, label: 'uncoated' }, { pts, color: C.series[1], width: 2.6, label: 'coated' }], vlines: [{ x: V.nm0, color: C.faint }] });
      }, box.stage);
      st.onResize(() => loop.once());
      ctl.show('nL', V.design === 'single');
      loop.once();
    }
  });

  /* ================================================================ a stack built layer by layer */
  Hyper.sim('cf-stack', {
    title: 'A stack built layer by layer',
    blurb: `Alternate layers of a high-index and a low-index material, each a **quarter of a wavelength** thick (optically) at the design wavelength — the notation is *H L H L …*. Add layers with the slider and watch the reflectance climb: each interface reflects only a few per cent, but every reflection arrives in step with the others. The left picture shows the layers to scale and what happens to the light; the upper graph is the spectrum, the lower one the light that is **still transmitted** at the design wavelength, on a logarithmic scale.

**Try this**
- Start with 1 layer (32 % reflected at the design wavelength), then 3, 5, 7, 9 … : 65 %, 85 %, 94 %, 98 % … and 99.95 % for 17 layers.
- Even numbers of layers end on a low-index layer and reflect less than the next odd number: a mirror starts and ends with H.
- Swap TiO₂ for Al₂O₃: the index ratio falls, the **stop band narrows** and you need many more layers for the same reflectance.
- Tilt the stack: the band moves towards the blue and, for large angles, the two polarizations part.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, F = O.film;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 320 });
      const HM = [['TiO₂ (n ≈ 2.35)', 'TiO2'], ['Ta₂O₅ (n ≈ 2.10)', 'Ta2O5'], ['HfO₂ (n ≈ 1.95)', 'HfO2'], ['Al₂O₃ (n ≈ 1.63)', 'Al2O3']];
      const LM = [['SiO₂ (n ≈ 1.46)', 'SiO2'], ['MgF₂ (n ≈ 1.38)', 'MgF2']];
      const ctl = kit.controls(box.side, [
        { id: 'k', label: 'Layers', min: 1, max: 31, step: 1, value: params.layers || 9 },
        { id: 'H', type: 'select', label: 'High-index material H', options: HM, value: params.H || 'TiO2' },
        { id: 'L', type: 'select', label: 'Low-index material L', options: LM, value: params.L || 'SiO2' },
        { id: 'nm0', label: 'Design wavelength', min: 450, max: 1000, step: 10, value: params.nm0 || 600, unit: 'nm' },
        { id: 'th', label: 'Angle of incidence', min: 0, max: 60, step: 1, value: params.th || 0, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['not', 'Layers (from the air)'], ['thick', 'Total thickness'], ['R', 'Reflectance at the design wavelength'], ['T', 'Transmitted there'], ['band', 'Stop band where R > 90 %'], ['theory', 'Stop band of an infinite stack']]);
      const plot = kit.plot(box.side, { x: { label: 'wavelength (nm)', min: 300, max: 900 }, y: { label: 'reflectance (%)', min: 0, max: 100 } }, 170);
      const plot2 = kit.plot(box.side, { x: { label: 'layers', min: 0, max: 31 }, y: { label: 'T at design λ', log: true, min: 1e-7, max: 1, fmt: v => v >= 0.01 ? (100 * v) + ' %' : v.toExponential(0) } }, 150);
      const cachedSt = makeMemo(30);
      const build = (k, nm0) => { const L = []; for (let i = 0; i < k; i++) { const m = i % 2 === 0 ? V.H : V.L; L.push({ n: m, d: F.quarterWave(m, nm0), role: i % 2 === 0 ? 'H' : 'L' }); } return { n0: 1, ns: 'N-BK7', layers: L }; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, th = V.th * D2R, k = Math.round(V.k), nm0 = V.nm0;
        const def = build(k, nm0), nH = F.COATING_MATERIALS[V.H].n, nL = F.COATING_MATERIALS[V.L].n;
        const r0 = F.stack(def, nm0, th);
        // the layers, to scale
        const total = def.layers.reduce((a, l) => a + l.d, 0), sc = Math.min(0.6, 0.78 * H / Math.max(80, total));
        const x0 = 0.04 * W, x1 = 0.34 * W, yTop = 0.14 * H;
        kit.label(c, 'air', x0, yTop - 8, { color: C.muted, size: 12 });
        let y = yTop;
        for (const l of def.layers) {
          const h = Math.max(1.5, l.d * sc);
          c.fillStyle = l.role === 'H' ? 'rgba(123,140,255,0.8)' : S.glass(0.3); c.fillRect(x0, y, x1 - x0, h);
          c.strokeStyle = S.edge(); c.lineWidth = 0.8; c.strokeRect(x0, y, x1 - x0, h);
          if (h >= 11) kit.label(c, l.role, (x0 + x1) / 2, y + h / 2, { align: 'center', size: 11.5, color: C.text, weight: 650 });
          y += h;
        }
        c.fillStyle = S.glass(0.2); c.fillRect(x0, y, x1 - x0, Math.max(8, 0.92 * H - y)); c.strokeStyle = S.edge(); c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
        kit.label(c, 'glass', x0 + 6, Math.min(0.9 * H, y + 14), { color: C.muted, size: 12 });
        if (k <= 7) { let yy = yTop; for (const l of def.layers) { const h = Math.max(1.5, l.d * sc); kit.label(c, l.d.toFixed(0) + ' nm', x1 + 6, yy + h / 2, { color: C.faint, size: 10.5 }); yy += h; } }
        // the light
        const xm = x1 + 0.2 * W, ys = yTop + 0.1 * H;
        S.ray(c, [[xm - 0.09 * W, ys - 0.1 * H], [xm, ys]], { color: C.warn, width: 3, minArrow: 20 });
        S.ray(c, [[xm, ys], [xm + 0.09 * W, ys - 0.1 * H]], { color: C.warn, width: 2.2, alpha: 0.12 + 0.88 * r0.R, minArrow: 20 });
        S.ray(c, [[xm, ys], [xm, ys + 0.3 * H]], { color: C.warn, width: 2.2, alpha: 0.12 + 0.88 * r0.T, minArrow: 20 });
        kit.label(c, 'incident', xm - 0.09 * W, ys - 0.1 * H - 10, { color: C.muted, size: 11.5 });
        kit.label(c, 'reflected ' + pct(r0.R, r0.R > 0.9999 ? 4 : 2), xm + 0.1 * W, ys - 0.1 * H + 4, { color: C.warn, size: 11.5 });
        kit.label(c, 'transmitted ' + pct(r0.T, r0.T < 0.01 ? 3 : 1), xm + 8, ys + 0.3 * H - 6, { color: C.warn, size: 11.5 });
        const notation = k >= 5 ? (k % 2 ? '(HL)' + sup((k - 1) / 2) + 'H' : '(HL)' + sup(k / 2)) : 'HLHL'.slice(0, k);
        kit.label(c, notation, xm - 0.09 * W, 0.9 * H, { color: C.text, size: 15, weight: 650 });
        // numbers
        ro.set('not', k + ' layers: ' + notation);
        ro.set('thick', (total / 1000).toFixed(2) + ' µm');
        ro.set('R', pct(r0.R, r0.R > 0.99 ? 4 : 2));
        ro.set('T', pct(r0.T, r0.T < 0.01 ? 4 : 2));
        const Rof = nm => F.stack(def, nm, th).R;
        const calc = cachedSt([k, V.H, V.L, nm0, V.th].join('|'), () => {
          const pts = []; for (let i = 0; i <= 200; i++) { const nm = nm0 * (0.5 + i / 200); pts.push([nm, 100 * Rof(nm)]); }
          const tp = []; for (let i = 1; i <= 31; i++) tp.push([i, Math.max(1e-9, F.stack(build(i, nm0), nm0, th).T)]);
          return { lo: crossing(Rof, nm0 * 0.5, nm0, 0.9, 1, 1), hi: crossing(Rof, nm0, nm0 * 1.6, 0.9, -1, 1), pts, tp };
        });
        const lo = calc.lo, hi = calc.hi;
        ro.set('band', Number.isFinite(lo) && Number.isFinite(hi) ? lo.toFixed(0) + ' – ' + hi.toFixed(0) + ' nm (' + (hi - lo).toFixed(0) + ' nm wide)' : 'never reaches 90 % here');
        const dg = 2 / PI * Math.asin((nH - nL) / (nH + nL));
        ro.set('theory', (nm0 / (1 + dg)).toFixed(0) + ' – ' + (nm0 / (1 - dg)).toFixed(0) + ' nm at 0°  (Δλ/λ₀ ≈ ' + (2 * dg).toFixed(2) + ')');
        plot.set({ series: [{ pts: calc.pts, color: C.series[0], width: 2.4, fill: true }], vlines: [{ x: nm0, color: C.faint }], x: { label: 'wavelength (nm)', min: nm0 * 0.5, max: nm0 * 1.5 } });
        plot2.set({ series: [{ pts: calc.tp, color: C.series[1], width: 2.2, dots: 2.5 }], marks: [{ x: k, y: Math.max(1e-7, r0.T), color: C.warn }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ metal mirrors */
  Hyper.sim('cf-metals', {
    title: 'Metal mirrors: which metal for which band',
    blurb: `Five metal mirror coatings and their reflectance from the ultraviolet to the short-wave infrared. The tiles show the colour each one gives to daylight, and under each is the **average reflectance across the band** you choose. The numbers come from handbook optical constants of freshly made films — a real mirror is a per cent or two lower.

**Try this**
- *Ultraviolet*: only aluminium is any good; silver falls to a few per cent below 320 nm.
- *Visible*: silver is best, but aluminium is the neutral all-rounder; **gold and copper** show their colour — they reflect red and yellow but absorb much of the blue.
- *Near and short-wave infrared*: gold, silver and copper are all above 95 %, while aluminium shows a dip near 800 nm.
- Raise the angle of incidence and pick *p* polarization: every metal reflects the p wave a little less than the s wave.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, F = O.film;
      const st = kit.stage(box.stage, { aspect: 0.26, minH: 150 });
      const tint = makeTint(O);
      const MET = [
        { name: 'Protected aluminium', def: F.design('aluminium', 550) },
        { name: 'Enhanced aluminium', def: F.design('enhancedAl', 550) },
        { name: 'Protected silver', def: F.design('silver', 550) },
        { name: 'Bare gold', def: F.design('gold', 550) },
        { name: 'Bare copper', def: { n0: 1, ns: 'copper', layers: [] } }
      ];
      const BANDS = [['Ultraviolet, 250–400 nm', [250, 400]], ['Visible, 400–700 nm', [400, 700]], ['Near infrared, 700–1100 nm', [700, 1100]], ['Short-wave infrared, 1100–2000 nm', [1100, 2000]]];
      const ctl = kit.controls(box.side, [
        { id: 'band', type: 'select', label: 'Band of interest', options: BANDS, value: params.band || BANDS[1][1] },
        { id: 'th', label: 'Angle of incidence', min: 0, max: 70, step: 1, value: params.th || 0, unit: '°' },
        { id: 'pol', type: 'select', label: 'Polarization', options: [['Unpolarized (average)', 'avg'], ['s', 's'], ['p', 'p']], value: 'avg' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['best', 'Highest average in the band'], ['avg', 'All five, averaged over the band'], ['abs', 'Absorbed by the best (heat)']]);
      const plot = kit.plot(box.side, { x: { label: 'wavelength (nm)', min: 250, max: 2000 }, y: { label: 'reflectance (%)', min: 0, max: 100 } }, 230);
      const cachedM = makeMemo(30);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, th = V.th * D2R;
        const q = nm => V.pol === 'avg' ? 'R' : V.pol === 's' ? 'Rs' : 'Rp';
        const Rof = (m, nm) => F.stack(m.def, nm, th)[q()];
        const lo = V.band[0], hi = V.band[1];
        const calc = cachedM([lo, hi, V.th, V.pol].join('|'), () => {
          const avgs = [];
          for (const m of MET) { let s = 0, n = 0; for (let nm = lo; nm <= hi + 1e-9; nm += (hi - lo) / 40) { s += Rof(m, nm); n++; } avgs.push(s / n); }
          let best = 0; avgs.forEach((a, i) => { if (a > avgs[best]) best = i; });
          return { avgs, best, tints: MET.map(m => tint(nm => Rof(m, nm))), pts: MET.map(m => { const pts = []; for (let nm = 250; nm <= 2000; nm += 10) pts.push([nm, 100 * Rof(m, nm)]); return pts; }) };
        });
        const avgs = calc.avgs, best = calc.best;
        const tw = (W - 24) / MET.length;
        MET.forEach((m, i) => {
          const x = 12 + i * tw, t = calc.tints[i];
          c.fillStyle = css(O, t.lin); c.fillRect(x + 4, 0.14 * H, tw - 8, 0.4 * H);
          c.strokeStyle = i === best ? C.ok : C.axis; c.lineWidth = i === best ? 3 : 1; c.strokeRect(x + 4, 0.14 * H, tw - 8, 0.4 * H);
          kit.label(c, m.name, x + tw / 2, 0.08 * H, { align: 'center', size: 11.5, color: C.text, weight: 600 });
          kit.label(c, pct(avgs[i], 1), x + tw / 2, 0.68 * H, { align: 'center', size: 15, color: i === best ? C.ok : C.text, weight: 650 });
          kit.label(c, i === best ? 'best in this band' : 'average here', x + tw / 2, 0.82 * H, { align: 'center', size: 11, color: C.muted });
        });
        ro.set('best', MET[best].name + ', ' + pct(avgs[best], 1));
        ro.set('avg', avgs.map(a => (100 * a).toFixed(0)).join(' · ') + ' %');
        ro.set('abs', pct(1 - avgs[best], 1) + ' of the incident power');
        const series = MET.map((m, i) => ({ pts: calc.pts[i], color: C.series[i], width: i === best ? 3 : 1.8, label: m.name }));
        plot.set({ series, vlines: [{ x: lo, color: C.faint }, { x: hi, color: C.faint }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the angle of incidence */
  Hyper.sim('cf-aoi', {
    title: 'Angle of incidence: how a coating moves and splits',
    blurb: `A coating is designed for one **angle of incidence** (AOI, measured from the normal). Tilt the filter and its whole curve slides towards shorter wavelengths and splits in two: s-polarized light (across the plane of incidence) and p-polarized light (in it) are shifted by different amounts. A lens delivers light in a **cone**, so the filter works at a range of angles at once. The dashed curve is the filter at 0°; the dotted line is the formula λ₀√(1 − sin²θ/n*²) with the effective index n* fitted to this filter.

**Try this**
- The band-pass filter: tilt to 30° and its peak moves from 550 to about 530 nm — many times its own width.
- *Both polarizations*: the s and p curves part as the angle grows. The long-pass edge is 32 nm apart for the two at 45°; the band-pass peak falls from 96 % to 90 % for s while p stays near 99 %.
- Set the angle to 0° and widen the **cone**: the peak falls and broadens, because every ray sees a slightly different filter. A fast lens (f/2 is about ±14°) ruins a narrow filter.
- Drag the top of the plate to tilt it.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, F = O.film;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 240 });
      const tint = makeTint(O);
      const TYPES = [['Band-pass filter (550 nm)', 'bandpass'], ['Long-pass edge filter (600 nm)', 'longpass'], ['Short-pass edge filter (600 nm)', 'shortpass'], ['Dielectric mirror (HL)⁸H (600 nm)', 'hr'], ['Broadband anti-reflection coating', 'bbar']];
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Coating', options: TYPES, value: params.type || 'bandpass' },
        { id: 'th', label: 'Angle of incidence (AOI)', min: 0, max: 60, step: 1, value: params.th != null ? params.th : 30, unit: '°' },
        { id: 'cone', label: 'Cone half-angle of the light', min: 0, max: 30, step: 1, value: params.cone || 0, unit: '°' },
        { id: 'pol', type: 'select', label: 'Polarization', options: [['Average of s and p', 'avg'], ['s only', 's'], ['p only', 'p'], ['Both, drawn separately', 'both']], value: params.pol || 'avg' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f0', 'At 0°'], ['fth', 'At this angle'], ['shift', 'Shift'], ['formula', 'From the formula'], ['sp', 's against p'], ['fno', 'The cone is an f-number of']]);
      const plot = kit.plot(box.side, { x: { label: 'wavelength (nm)' }, y: { label: 'transmittance (%)', min: 0, max: 100 } }, 220);
      // the coatings; the edge filters are scaled so that their edge at 0° falls on the round number
      const edgeOf = (def, th, dir, lo, hi) => crossing(nm => F.stack(def, nm, th).T, lo, hi, 0.5, dir, 0.25);
      const DEF = { bandpass: F.design('bandpass', 550, 'N-BK7'), hr: F.design('hr', 600, 'N-BK7'), bbar: F.design('bbar', 550, 'N-BK7') };
      { const a = F.design('longpass', 600, 'N-BK7'), b = F.design('shortpass', 600, 'N-BK7');
        DEF.longpass = F.design('longpass', 600 * 600 / edgeOf(a, 0, 1, 450, 800), 'N-BK7'); DEF.shortpass = F.design('shortpass', 600 * 600 / edgeOf(b, 0, -1, 450, 800), 'N-BK7'); }
      const NM0 = { bandpass: 550, longpass: 600, shortpass: 600, hr: 600, bbar: 550 };
      const WIN = { bandpass: [0.78, 1.04], longpass: [0.7, 1.15], shortpass: [0.7, 1.15], hr: [0.55, 1.3], bbar: [0, 0] };
      const isR = t => t === 'hr' || t === 'bbar';
      // the curves at one angle (and cone), for the average of s and p, for s and for p
      const memo = {};
      const cached = (key, fn) => { if (!(key in memo)) { const ks = Object.keys(memo); if (ks.length > 24) delete memo[ks[0]]; memo[key] = fn(); } return memo[key]; };
      const curves = (type, th, cone) => cached('c|' + type + '|' + th + '|' + cone, () => curvesRaw(type, th, cone));
      function curvesRaw(type, th, cone) {
        const def = DEF[type], n0 = NM0[type], w = type === 'bbar' ? [380, 780] : [WIN[type][0] * n0, WIN[type][1] * n0], N = type === 'bandpass' ? 900 : 480;
        const angs = []; if (cone < 0.5) angs.push(th); else for (let k = -3; k <= 3; k++) angs.push(Math.abs(th + cone * k / 3));
        const lam = [], a = [], s = [], p = [];
        for (let i = 0; i <= N; i++) {
          const nm = w[0] + (w[1] - w[0]) * i / N; let qa = 0, qs = 0, qp = 0;
          for (const g of angs) { const r = F.stack(def, nm, g * D2R); if (isR(type)) { qa += r.R; qs += r.Rs; qp += r.Rp; } else { qa += r.T; qs += r.Ts; qp += r.Tp; } }
          lam.push(nm); a.push(qa / angs.length); s.push(qs / angs.length); p.push(qp / angs.length);
        }
        return { lam, a, s, p };
      }
      // the position of the feature that the formula describes
      function feature(type, lam, q) {
        const at = (level, dir, from) => { for (let i = Math.max(1, from || 1); i < lam.length; i++) if (dir > 0 ? (q[i - 1] < level && q[i] >= level) : (q[i - 1] >= level && q[i] < level)) return lam[i - 1] + (lam[i] - lam[i - 1]) * (level - q[i - 1]) / (q[i] - q[i - 1]); return NaN; };
        if (type === 'bandpass') {
          // the pass band, not the weaker side-bands of the mirrors below 0.85 of the design wavelength
          let k = -1; for (let i = 0; i < q.length; i++) if (lam[i] >= 0.85 * 550 && (k < 0 || q[i] > q[k])) k = i;
          if (k < 0) return { pos: NaN, val: NaN, w: NaN };
          const h = q[k] / 2; let l1 = NaN, l2 = NaN;
          for (let i = k; i > 0; i--) if (q[i - 1] < h) { l1 = lam[i - 1] + (lam[i] - lam[i - 1]) * (h - q[i - 1]) / (q[i] - q[i - 1]); break; }
          for (let i = k; i < q.length - 1; i++) if (q[i + 1] < h) { l2 = lam[i] + (lam[i + 1] - lam[i]) * (q[i] - h) / (q[i] - q[i + 1]); break; }
          return { pos: lam[k], val: q[k], w: l2 - l1 };
        }
        if (type === 'longpass') return { pos: at(0.5, 1), val: NaN, w: NaN };
        if (type === 'shortpass') return { pos: at(0.5, -1), val: NaN, w: NaN };
        if (type === 'hr') { let i0 = 1; while (i0 < lam.length && lam[i0] < 600) i0++; return { pos: at(0.5, -1, i0), val: NaN, w: NaN }; }
        return { pos: NaN, val: NaN, w: NaN };
      }
      // for an edge the "average" position is the mean of the s and p edges: the 50 % point of the average curve is vague where s and p part
      const featAvg = (type, cur) => {
        if (type === 'longpass' || type === 'shortpass' || type === 'hr') { const a = feature(type, cur.lam, cur.s), b = feature(type, cur.lam, cur.p); return { pos: (a.pos + b.pos) / 2, val: NaN, w: NaN }; }
        return feature(type, cur.lam, cur.a);
      };
      const nstarCache = {};
      const nstar = type => {
        if (!(type in nstarCache)) {
          if (type === 'bbar') nstarCache[type] = NaN;
          else { const f0 = featAvg(type, curves(type, 0, 0)).pos, f3 = featAvg(type, curves(type, 30, 0)).pos; nstarCache[type] = Math.sin(30 * D2R) / Math.sqrt(Math.max(1e-6, 1 - Math.pow(f3 / f0, 2))); }
        }
        return nstarCache[type];
      };
      const fmtPos = (type, f) => !Number.isFinite(f.pos) ? '—' : type === 'bandpass' ? f.pos.toFixed(1) + ' nm (peak ' + pct(f.val, 0) + ')' : f.pos.toFixed(0) + ' nm (50 % point)';
      kit.drag(st, {
        hover: true,
        hit: p => { const g = geo(); return Math.hypot(p.x - g.hx, p.y - g.hy) < 18 ? 'plate' : null; },
        move: (w, p) => { const g = geo(); ctl.set('th', clamp(Math.round(Math.atan2(p.x - g.cx, -(p.y - g.cy)) * R2D), 0, 60)); loop.once(); }
      });
      const geo = () => { const th = V.th * D2R, cx = st.W * 0.3, cy = st.H * 0.52, L = st.H * 0.36; return { cx, cy, L, hx: cx + L * Math.sin(th), hy: cy - L * Math.cos(th) }; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, type = V.type, th = V.th, al = V.cone;
        const g = geo(), thr = th * D2R, L = g.L;
        const cur = curves(type, th, al), ref = th > 0 || al > 0 ? curves(type, 0, 0) : cur;
        const Q = isR(type) ? 'reflectance' : 'transmittance';
        // the picture: a beam, a tilted plate, the normal, and the cone
        S.plate(c, g.cx, g.cy, 2 * L, thr, { t: 7, fill: S.glass(0.35) });
        S.normal(c, g.cx, g.cy, thr, L * 0.9);
        const x0 = g.cx - 0.28 * W, tn = Math.tan(al * D2R), reach = g.cx - x0;
        if (al > 0.4) { c.fillStyle = S.nm(580, 0.14); c.beginPath(); c.moveTo(x0, g.cy - reach * tn); c.lineTo(g.cx, g.cy); c.lineTo(x0, g.cy + reach * tn); c.closePath(); c.fill(); }
        for (const k of al > 0.4 ? [-1, 0, 1] : [0]) S.ray(c, [[x0, g.cy + k * reach * tn], [g.cx, g.cy]], { color: C.warn, width: k ? 1.4 : 2.6, minArrow: 40 });
        const tts = cached('t|' + type + '|' + th, () => { const T = nm => { const f = F.stack(DEF[type], nm, thr); return isR(type) ? 1 - f.R : f.T; }; return [tint(T), tint(nm => 1 - T(nm))]; }), tt = tts[0], rr = tts[1];
        const xe = g.cx + 0.3 * W;
        S.ray(c, [[g.cx, g.cy], [xe, g.cy]], { color: css(O, tt.lin, 0.95), width: 2.6, alpha: clamp(0.25 + 4 * tt.Y, 0.25, 1), minArrow: 40 });
        S.ray(c, [[g.cx, g.cy], [g.cx - Math.cos(2 * thr) * 0.26 * W, g.cy - Math.sin(2 * thr) * 0.26 * W]], { color: css(O, rr.lin, 0.95), width: 2.2, alpha: clamp(0.25 + 4 * rr.Y, 0.25, 1), minArrow: 40 });
        S.angle(c, g.cx, g.cy, 0.14 * L + 10, 0, thr, th > 1 ? 'AOI' : '', { gap: 20 });
        c.fillStyle = C.accent; c.beginPath(); c.arc(g.hx, g.hy, 6, 0, 2 * PI); c.fill();
        kit.label(c, 'drag to tilt', g.hx + 10, g.hy - 4, { color: C.faint, size: 11 });
        kit.label(c, 'AOI = ' + th + '°' + (al > 0 ? '  ±' + al + '°  (rays at ' + Math.max(0, th - al) + '°–' + (th + al) + '°)' : ''), 12, 18, { color: C.text, size: 13, weight: 650 });
        kit.label(c, 'white light in', x0, g.cy + 0.55 * L, { color: C.muted, size: 11.5 });
        kit.label(c, 'transmitted', xe - 4, g.cy - 10, { align: 'right', color: C.muted, size: 11.5 });
        kit.label(c, 'reflected', g.cx - Math.cos(2 * thr) * 0.26 * W + 6, g.cy - Math.sin(2 * thr) * 0.26 * W - 8, { color: C.muted, size: 11.5 });
        // the numbers
        const f0 = featAvg(type, ref), fa = featAvg(type, cur), fs = feature(type, cur.lam, cur.s), fp = feature(type, cur.lam, cur.p);
        const ns = nstar(type);
        ro.set('f0', fmtPos(type, f0));
        ro.set('fth', fmtPos(type, fa));
        if (type === 'bbar') {
          const avg = a => { let s = 0, n = 0; for (let i = 0; i < cur.lam.length; i++) if (cur.lam[i] >= 450 && cur.lam[i] <= 650) { s += a[i]; n++; } return s / n; };
          ro.set('f0', 'average ' + pct(avg(ref.a)) + ' over 450–650 nm'); ro.set('fth', 'average ' + pct(avg(cur.a)) + ' over 450–650 nm');
          ro.set('shift', '—'); ro.set('formula', 'not a single feature: the curve slides and rises'); ro.set('sp', 'average s ' + pct(avg(cur.s)) + ' · p ' + pct(avg(cur.p)));
        } else {
          ro.set('shift', Number.isFinite(fa.pos) && Number.isFinite(f0.pos) ? (fa.pos - f0.pos).toFixed(1) + ' nm  (' + (100 * (fa.pos / f0.pos - 1)).toFixed(1) + ' %)' : '—');
          ro.set('formula', Number.isFinite(f0.pos) ? (f0.pos * Math.sqrt(1 - Math.pow(Math.sin(thr) / ns, 2))).toFixed(1) + ' nm  with n* = ' + ns.toFixed(2) : '—');
          ro.set('sp', Number.isFinite(fs.pos) && Number.isFinite(fp.pos) ? 's ' + fs.pos.toFixed(1) + ' · p ' + fp.pos.toFixed(1) + ' nm  (' + Math.abs(fs.pos - fp.pos).toFixed(1) + ' nm apart)' : '—');
        }
        ro.set('fno', al > 0 ? 'f/' + (1 / (2 * Math.tan(al * D2R))).toFixed(1) : 'a collimated beam (no cone)');
        // the graph
        const d = arr => cur.lam.map((x, i) => [x, 100 * arr[i]]);
        const series = [];
        if (th > 0 || al > 0) series.push({ pts: ref.lam.map((x, i) => [x, 100 * ref.a[i]]), color: C.faint, width: 1.5, dash: true, label: 'at 0°' });
        if (V.pol === 'both') { series.push({ pts: d(cur.s), color: C.series[0], width: 2.4, label: 's' }); series.push({ pts: d(cur.p), color: C.series[1], width: 2.4, label: 'p' }); }
        else series.push({ pts: d(V.pol === 's' ? cur.s : V.pol === 'p' ? cur.p : cur.a), color: C.series[0], width: 2.6, label: V.pol === 'avg' ? 'at ' + th + '°' : V.pol });
        const vl = []; if (type !== 'bbar' && Number.isFinite(f0.pos)) vl.push({ x: f0.pos * Math.sqrt(1 - Math.pow(Math.sin(thr) / ns, 2)), color: C.ok, dash: [2, 3] });
        plot.set({ series, vlines: vl, x: { label: 'wavelength (nm)', min: cur.lam[0], max: cur.lam[cur.lam.length - 1] }, y: { label: Q + ' (%)', min: 0, max: 100 } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ interference filters */
  Hyper.sim('cf-filters', {
    title: 'Interference filters: band-pass, edge and notch',
    blurb: `Four kinds of filter, each a stack of quarter-wave layers computed from the layer matrices. The two bars show which colours **pass** and which are **reflected**; the graph is the transmittance, either on a linear scale or as **optical density** (OD 3 is a transmittance of 0.1 %). Read the numbers underneath: centre or edge, width, blocking.

**Try this**
- *Band-pass*: raise the number of mirror pairs from 2 to 6 and the width falls from 25 nm to about 0.5 nm — more layers, a narrower line.
- Switch to the **optical-density scale**: next to the pass band the filter blocks to about OD 2–3, but far away, at the blue end, the transmittance comes back. A one-cavity filter needs extra blocking.
- *Long-pass* and *short-pass*: the edge is where the transmittance crosses 50 %; the stack blocks over only one octave or so, and the transmittance returns beyond.
- *Notch*: the opposite of a band-pass. More layer pairs give a deeper notch (about OD 2 at 24 pairs, OD 3.5 at 40), but the width stays about 50 nm, fixed by the two materials.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, F = O.film;
      const st = kit.stage(box.stage, { aspect: 0.27, minH: 170 });
      const tint = makeTint(O), cached = makeMemo(20);
      const TYPES = [['Band-pass filter', 'bandpass'], ['Long-pass edge filter', 'longpass'], ['Short-pass edge filter', 'shortpass'], ['Notch filter', 'notch']];
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Filter', options: TYPES, value: params.type || 'bandpass' },
        { id: 'cwl', label: 'Centre or edge wavelength', min: 400, max: 900, step: 5, value: params.cwl || 550, unit: 'nm' },
        { id: 'pairs', label: 'Mirror pairs on each side of the cavity', min: 2, max: 6, step: 1, value: params.pairs || 4 },
        { id: 'npairs', label: 'Layer pairs in the notch stack', min: 8, max: 60, step: 1, value: params.npairs || 24 },
        { id: 'scale', type: 'select', label: 'Vertical scale', options: [['Transmittance, linear', 'lin'], ['Optical density, logarithmic', 'od']], value: params.scale || 'lin' },
        { id: 'zoom', type: 'check', label: 'Zoom in on the pass band, edge or notch', value: !!params.zoom }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const vis = () => { ctl.show('pairs', V.type === 'bandpass'); ctl.show('npairs', V.type === 'notch'); };
      const ro = kit.readout(box.side, [['k1', 'Centre or 50 % edge'], ['k2', 'Peak or pass-band transmittance'], ['k3', 'Width'], ['k4', 'Blocking'], ['k5', 'Layers']]);
      const plot = kit.plot(box.side, { x: { label: 'wavelength (nm)' }, y: { label: 'transmittance (%)', min: 0, max: 100 } }, 230);
      const cal = (id, dir) => { const d = F.design(id, 600, 'N-BK7'); return crossing(nm => F.stack(d, nm).T, 450, 800, 0.5, dir, 0.25) / 600; };
      const rLP = cal('longpass', 1), rSP = cal('shortpass', -1);
      const seq = (nm0, list) => list.map(([m, q]) => ({ n: m, d: F.quarterWave(m, nm0, 0.25 * q) }));
      const bandDef = (nm0, m) => { const s = []; for (let i = 0; i < m; i++) s.push(['TiO2', 1], ['SiO2', 1]); s.push(['TiO2', 2]); for (let i = 0; i < m; i++) s.push(['SiO2', 1], ['TiO2', 1]); return { n0: 1, ns: 'N-BK7', layers: seq(nm0, s) }; };
      const notchDef = (nm0, N) => { const s = []; for (let i = 0; i < N; i++) s.push(['Al2O3', 1], ['SiO2', 1]); s.push(['Al2O3', 1]); return { n0: 1, ns: 'N-BK7', layers: seq(nm0, s) }; };
      const curve = (def, lo, hi, N) => { const lam = [], T = []; for (let i = 0; i <= N; i++) { const nm = lo + (hi - lo) * i / N; lam.push(nm); T.push(F.stack(def, nm).T); } return { lam, T }; };
      // the wavelength where the sampled curve first crosses a level (dir +1 rising, −1 falling), looking from lamFrom upwards
      const crossArr = (lam, q, level, dir, lamFrom) => { for (let i = 1; i < lam.length; i++) { if (lam[i] < (lamFrom || 0)) continue; if (dir > 0 ? (q[i - 1] < level && q[i] >= level) : (q[i - 1] >= level && q[i] < level)) return lam[i - 1] + (lam[i] - lam[i - 1]) * (level - q[i - 1]) / (q[i] - q[i - 1]); } return NaN; };
      const region = (lam, T, a, b) => { let s = 0, n = 0, mx = 0, at = NaN; for (let i = 0; i < lam.length; i++) if (lam[i] >= a && lam[i] <= b) { s += T[i]; n++; if (T[i] > mx) { mx = T[i]; at = lam[i]; } } return { mean: n ? s / n : NaN, max: mx, at }; };
      const compute = () => cached([V.type, V.cwl, V.pairs, V.npairs].join('|'), () => {
        const type = V.type, cwl = V.cwl;
        const def = type === 'bandpass' ? bandDef(cwl, V.pairs) : type === 'notch' ? notchDef(cwl, V.npairs) : F.design(type, cwl / (type === 'longpass' ? rLP : rSP), 'N-BK7');
        const co = curve(def, 0.6 * cwl, 1.4 * cwl, 2400), lam = co.lam, T = co.T, out = { def, co };
        if (type === 'bandpass') {
          const fine = curve(def, 0.88 * cwl, 1.12 * cwl, 1600), fl = fine.lam, ft = fine.T;
          let k = 0; for (let i = 1; i < ft.length; i++) if (ft[i] > ft[k]) k = i;
          const pk = ft[k], width = lvl => { const h = lvl * pk; let a = NaN, b = NaN; for (let i = k; i > 0; i--) if (ft[i - 1] < h) { a = fl[i - 1] + (fl[i] - fl[i - 1]) * (h - ft[i - 1]) / (ft[i] - ft[i - 1]); break; } for (let i = k; i < ft.length - 1; i++) if (ft[i + 1] < h) { b = fl[i] + (fl[i + 1] - fl[i]) * (ft[i] - h) / (ft[i] - ft[i + 1]); break; } return b - a; };
          out.pos = fl[k]; out.peak = pk; out.fwhm = width(0.5); out.w10 = width(0.1);
          const w5 = 5 * (Number.isFinite(out.fwhm) ? out.fwhm : 1); let worst = 0, wl = NaN; for (let i = 0; i < lam.length; i++) if (Math.abs(lam[i] - out.pos) > w5 && T[i] > worst) { worst = T[i]; wl = lam[i]; }
          out.worst = worst; out.worstAt = wl; out.win = [out.pos - 8 * (out.fwhm || 2), out.pos + 8 * (out.fwhm || 2)];
        } else if (type === 'notch') {
          const fine = curve(def, 0.92 * cwl, 1.08 * cwl, 1200), fl = fine.lam, ft = fine.T;
          let k = 0; for (let i = 1; i < ft.length; i++) if (ft[i] < ft[k]) k = i;
          let a = fl[0], b = fl[fl.length - 1]; for (let i = k; i > 0; i--) if (ft[i] > 0.5) { a = fl[i]; break; } for (let i = k; i < ft.length; i++) if (ft[i] > 0.5) { b = fl[i]; break; }
          out.pos = fl[k]; out.tmin = ft[k]; out.fwhm = b - a;
          out.peak = region(lam, T, out.pos + 2 * out.fwhm, out.pos + 6 * out.fwhm).mean; out.win = [out.pos - 3 * out.fwhm, out.pos + 3 * out.fwhm];
        } else {
          const dir = type === 'longpass' ? 1 : -1, e = crossArr(lam, T, 0.5, dir, type === 'longpass' ? 0.8 * cwl : 0.7 * cwl);
          out.pos = e; out.w10 = Math.abs(crossArr(lam, T, 0.1, dir, type === 'longpass' ? 0.8 * cwl : 0.7 * cwl) - e);     // from the 10 % point to the 50 % point
          const pass = type === 'longpass' ? region(lam, T, e * 1.05, e * 1.25) : region(lam, T, e * 0.75, e * 0.95), stop = type === 'longpass' ? region(lam, T, e * 0.8, e * 0.97) : region(lam, T, e * 1.03, e * 1.2);
          out.peak = pass.mean; out.worst = stop.max; out.worstAt = stop.at; out.win = [e * 0.92, e * 1.08];
        }
        return out;
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, type = V.type, r = compute(), def = r.def;
        // what passes and what is reflected
        const smoothT = nm => (F.stack(def, nm - 0.8).T + F.stack(def, nm).T + F.stack(def, nm + 0.8).T) / 3;
        const sw = 0.2 * W, bx = 12, bw = W - 2 * bx - sw - 12;
        const cols = cached('c|' + [type, V.cwl, V.pairs, V.npairs].join('|'), () => { const a = []; const n = Math.round(bw / 2); for (let i = 0; i < n; i++) a.push(smoothT(380 + 400 * (i + 0.5) / n)); return { a, t: tint(smoothT), r: tint(nm => 1 - smoothT(nm)) }; });
        const nb = cols.a.length;
        kit.label(c, 'what passes', bx, 0.1 * H, { color: C.muted, size: 12 });
        S.spectrum(c, bx, 0.18 * H, bw, 0.2 * H, 380, 780, { ticks: false, weight: nm => cols.a[Math.min(nb - 1, Math.max(0, Math.round((nm - 380) / 400 * nb - 0.5)))] });
        kit.label(c, 'what is reflected', bx, 0.52 * H, { color: C.muted, size: 12 });
        S.spectrum(c, bx, 0.6 * H, bw, 0.2 * H, 380, 780, { ticks: true, weight: nm => 1 - cols.a[Math.min(nb - 1, Math.max(0, Math.round((nm - 380) / 400 * nb - 0.5)))] });
        const sx = bx + bw + 14;
        c.fillStyle = css(O, cols.t.lin, 0.95); c.fillRect(sx, 0.18 * H, sw, 0.2 * H); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(sx, 0.18 * H, sw, 0.2 * H);
        c.fillStyle = css(O, cols.r.lin, 0.95); c.fillRect(sx, 0.6 * H, sw, 0.2 * H); c.strokeRect(sx, 0.6 * H, sw, 0.2 * H);
        kit.label(c, 'colour of the transmitted daylight', sx - 2, 0.1 * H, { color: C.muted, size: 10.5 });
        kit.label(c, 'colour of the reflected daylight', sx - 2, 0.52 * H, { color: C.muted, size: 10.5 });
        kit.label(c, 'wavelength (nm), 380 to 780', bx, 0.94 * H, { color: C.faint, size: 10.5 });
        // numbers
        const p1 = x => Number.isFinite(x) ? x.toFixed(1) : '—', od = t => t > 0 ? Math.max(0, -Math.log10(t)).toFixed(1) : '—';
        ro.set('k5', def.layers.length + ' layers, ' + (def.layers.reduce((a, l) => a + l.d, 0) / 1000).toFixed(2) + ' µm thick');
        if (type === 'bandpass') {
          ro.set('k1', p1(r.pos) + ' nm'); ro.set('k2', pct(r.peak, 1));
          ro.set('k3', 'FWHM ' + p1(r.fwhm) + ' nm  (Q = ' + (r.pos / r.fwhm).toFixed(0) + ') · 10 % width ' + p1(r.w10) + ' nm');
          ro.set('k4', 'worst outside ±5 widths: ' + pct(r.worst, 1) + ' at ' + p1(r.worstAt) + ' nm (OD ' + od(r.worst) + ')');
        } else if (type === 'notch') {
          ro.set('k1', p1(r.pos) + ' nm'); ro.set('k2', 'outside the notch ' + pct(r.peak, 0));
          ro.set('k3', 'notch width (T < 50 %) ' + p1(r.fwhm) + ' nm'); ro.set('k4', 'depth OD ' + od(r.tmin) + ' (T = ' + pct(r.tmin, 3) + ')');
        } else {
          ro.set('k1', p1(r.pos) + ' nm'); ro.set('k2', 'pass band ' + pct(r.peak, 0));
          ro.set('k3', 'edge: 10 % point to 50 % point ' + p1(r.w10) + ' nm'); ro.set('k4', 'worst in the stop band: ' + pct(r.worst, 1) + ' (OD ' + od(r.worst) + ')');
        }
        // the graph
        let lam = r.co.lam, T = r.co.T, xr = [lam[0], lam[lam.length - 1]];
        if (V.zoom && r.win && Number.isFinite(r.win[0])) { const z = cached('z|' + [type, V.cwl, V.pairs, V.npairs].join('|'), () => curve(def, r.win[0], r.win[1], 700)); lam = z.lam; T = z.T; xr = r.win; }
        const lin = V.scale === 'lin';
        plot.set({
          series: [{ pts: lam.map((x, i) => [x, lin ? 100 * T[i] : Math.max(1e-9, T[i])]), color: C.series[0], width: 2.2 }],
          vlines: Number.isFinite(r.pos) ? [{ x: r.pos, color: C.faint }] : [],
          x: { label: 'wavelength (nm)', min: xr[0], max: xr[1] },
          y: lin ? { label: 'transmittance (%)', min: 0, max: 100 } : { label: 'transmittance (log scale, as OD)', log: true, min: 1e-7, max: 1, fmt: v => 'OD ' + Math.round(-Math.log10(v)) }
        });
      }, box.stage);
      st.onResize(() => loop.once());
      vis();
      loop.once();
    }
  });

  /* ================================================================ dichroic mirrors, hot and cold mirrors, a filter cube */
  Hyper.sim('cf-dichroic', {
    title: 'Dichroic mirrors: splitting light by colour',
    blurb: `A **dichroic mirror** is a stack of layers on a tilted plate that passes one band of colours and reflects the rest — with almost no loss, since nothing is absorbed. Pick a use: a colour splitter whose edge you set yourself; a *hot mirror* (reflects the invisible infrared, passes the visible); a *cold mirror* (the reverse); or the *filter cube* of a fluorescence microscope, with its three filters. The colours are those of daylight after each part; the infrared, which no one can see, is drawn dashed.

**Try this**
- *Colour splitter*: slide the edge from 450 to 700 nm and watch the transmitted light go from orange-red to almost nothing while the reflected light goes from cyan to white.
- *Hot* and *cold mirror*: the visible light is passed or reflected, and the infrared goes the other way. One quarter-wave stack covers only part of the spectrum (the graph shows transmission returning beyond 950 nm for the hot mirror and in the violet for the cold one); real hot and cold mirrors stack several.
- *Filter cube*: the dichroic reflects the blue excitation light up to the specimen and passes the green fluorescence down to the eye. Tilt the dichroic away from 45° and the edge moves: leaked excitation light (**OD** in the read-out) gets worse. (These simple stacks block only to about OD 2; real cubes, with many more layers, reach OD 6.)
- The edge at 45° differs for s and p by some 30 nm: the read-out gives both, and the edge it quotes is their mean.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, F = O.film;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320 });
      const tint = makeTint(O), cached = makeMemo(16), day = O.photo.spectrum('daylight');
      const MODES = [['Colour splitter (dichroic mirror)', 'split'], ['Hot mirror: reflects the infrared', 'hot'], ['Cold mirror: reflects the visible', 'cold'], ['Fluorescence filter cube', 'cube']];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Use', options: MODES, value: params.mode || 'split' },
        { id: 'edge', label: 'Edge of the dichroic at 45°', min: 450, max: 700, step: 5, value: params.edge || 560, unit: 'nm' },
        { id: 'th', label: 'Angle of incidence on the dichroic', min: 30, max: 60, step: 1, value: 45, unit: '°' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const vis = () => { ctl.show('edge', V.mode === 'split'); };
      const ro = kit.readout(box.side, [['edge', 'Edge of the dichroic at this angle'], ['sp', 's and p separately'], ['t', 'Transmitted'], ['r', 'Reflected'], ['ir', 'Infrared 700–1100 nm'], ['ex', 'Excitation reaching the specimen'], ['em', 'Fluorescence reaching the detector'], ['leak', 'Excitation leaking to the detector']]);
      const plot = kit.plot(box.side, { x: { label: 'wavelength (nm)', min: 380, max: 780 }, y: { label: '%', min: 0, max: 100 } }, 220);
      // edge filters are scaled so that their edge falls on the round number at the angle they are made for
      const lp600 = F.design('longpass', 600, 'N-BK7'), sp600 = F.design('shortpass', 600, 'N-BK7');
      // the edge is the mean of the s and p edges (the 50 % point of their average is vague where they part)
      const edgeSP = (def, th, dir, lo, hi) => (crossing(nm => F.stack(def, nm, th * D2R).Ts, lo, hi || 900, 0.5, dir, 0.25) + crossing(nm => F.stack(def, nm, th * D2R).Tp, lo, hi || 900, 0.5, dir, 0.25)) / 2;
      const cl = (def, th, dir, lo) => edgeSP(def, th, dir, lo) / 600;
      const kLP45 = cl(lp600, 45, 1, 460), kSP45 = cl(sp600, 45, -1, 450), kLP0 = cl(lp600, 0, 1, 460), kSP0 = cl(sp600, 0, -1, 450);
      const LP = (e, k) => F.design('longpass', e / k, 'N-BK7'), SP = (e, k) => F.design('shortpass', e / k, 'N-BK7');
      const gA = (nm, c, s1, s2) => Math.exp(-0.5 * Math.pow((nm - c) / (nm < c ? s1 : s2), 2));
      const fExc = nm => gA(nm, 495, 22, 14), fEm = nm => gA(nm, 521, 14, 28);          // schematic: a fluorescein-like dye
      const pieces = () => cached('p|' + V.mode + '|' + V.edge, () => ({
        dich: V.mode === 'hot' ? SP(700, kSP45) : V.mode === 'cold' ? LP(700, kLP45) : V.mode === 'cube' ? LP(495, kLP45) : LP(V.edge, kLP45),
        ex: V.mode === 'cube' ? [LP(450, kLP0), SP(490, kSP0)] : null, em: V.mode === 'cube' ? [LP(500, kLP0), SP(550, kSP0)] : null }));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, mode = V.mode, thr = V.th * D2R, P = pieces();
        const Td = nm => F.stack(P.dich, nm, thr).T;
        const calc = cached('c|' + [mode, V.edge, V.th].join('|'), () => {
          const o = {};
          const edgeDir = mode === 'hot' ? -1 : 1;
          const nominal = mode === 'cold' ? 700 : mode === 'cube' ? 495 : V.edge, lo0 = mode === 'hot' ? 450 : 0.88 * nominal;
          const e = pol => crossing(nm => F.stack(P.dich, nm, thr)[pol], lo0, 1000, 0.5, edgeDir, 0.5);
          o.eS = e('Ts'); o.eP = e('Tp'); o.eA = (o.eS + o.eP) / 2;
          if (mode !== 'cube') {
            o.tT = tint(Td); o.tR = tint(nm => 1 - Td(nm));
            let sw = 0, st1 = 0; for (let nm = 700; nm <= 1100; nm += 5) { const w = day(nm); sw += w; st1 += w * Td(nm); } o.irT = st1 / sw;
            const hi = mode === 'hot' || mode === 'cold' ? 1100 : 780, pts = [], pr = []; for (let nm = 380; nm <= hi; nm += 4) { const t = Td(nm); pts.push([nm, 100 * t]); pr.push([nm, 100 * (1 - t)]); } o.pts = pts; o.pr = pr; o.hi = hi;
          } else {
            const Tex = nm => F.stack(P.ex[0], nm).T * F.stack(P.ex[1], nm).T, Tem = nm => F.stack(P.em[0], nm).T * F.stack(P.em[1], nm).T;
            let Pex = 0, Pref = 0, Lk = 0, Pem = 0, Pd = 0, Pf = 0; const pd = [], pe = [], pm = [];
            for (let nm = 380; nm <= 780; nm += 2) {
              const td = Td(nm), tx = Tex(nm), tm = Tem(nm), d = day(nm), em = fEm(nm);
              Pex += d * tx; Pref += d * tx * (1 - td); Lk += d * tx * (1 - td) * td * tm; Pem += em; Pd += em * td; Pf += em * td * tm;
              if (nm % 4 === 0) { pd.push([nm, 100 * td]); pe.push([nm, 100 * tx]); pm.push([nm, 100 * tm]); }
            }
            o.ex = Pref / Pex; o.em = Pf / Pem; o.leak = Pref > 0 ? Lk / Pref : 0; o.fd = Pd / Pem;
            o.hExc = hueOf(O, nm => day(nm) * Tex(nm)); o.hRef = hueOf(O, nm => day(nm) * Tex(nm) * (1 - Td(nm))); o.hLeak = hueOf(O, nm => day(nm) * Tex(nm) * Td(nm)); o.hEm = hueOf(O, fEm); o.hEmD = hueOf(O, nm => fEm(nm) * Td(nm)); o.hEmF = hueOf(O, nm => fEm(nm) * Td(nm) * Tem(nm));
            o.pd = pd; o.pe = pe; o.pm = pm;
          }
          return o;
        });
        const beam = (pts, lin, alpha, width, dash) => S.ray(c, pts, { color: css(O, lin, 0.95), width: width || 3, alpha: clamp(alpha, 0.12, 1), dash, minArrow: 50 });
        if (mode !== 'cube') {
          const cx = 0.38 * W, cy = 0.5 * H, Lp = 0.27 * H, rl = 0.42 * H, ux = -Math.cos(2 * thr), uy = -Math.sin(2 * thr);
          S.plate(c, cx, cy, 2 * Lp, thr, { t: 8, fill: S.glass(0.4) });
          S.normal(c, cx, cy, thr, Lp * 0.7);
          S.ray(c, [[0.04 * W, cy], [cx, cy]], { color: C.text, width: 3, minArrow: 60 });
          kit.label(c, 'white light (daylight)', 0.04 * W, cy - 14, { color: C.muted, size: 12 });
          const exT = [0.94 * W, cy], exR = [cx + ux * rl, cy + uy * rl];
          beam([[cx, cy], exT], calc.tT.lin, 0.2 + 4 * calc.tT.Y, 3.4);
          beam([[cx, cy], exR], calc.tR.lin, 0.2 + 4 * calc.tR.Y, 3.4);
          if (mode === 'hot' || mode === 'cold') {
            S.ray(c, [[cx, cy + 9], [exT[0], cy + 9]], { color: C.bad, width: 2, dash: [5, 4], alpha: clamp(0.15 + 0.85 * calc.irT, 0.15, 1), minArrow: 60 });
            S.ray(c, [[cx + 8, cy], [exR[0] + 8, exR[1]]], { color: C.bad, width: 2, dash: [5, 4], alpha: clamp(0.15 + 0.85 * (1 - calc.irT), 0.15, 1), minArrow: 60 });
            kit.label(c, 'infrared (invisible), dashed', exT[0], cy + 26, { align: 'right', color: C.bad, size: 11.5 });
          }
          kit.label(c, 'transmitted: ' + hueName(O.colour.srgb(O.colour.fit(calc.tT.lin.slice(), 0.9))), exT[0], cy - 12, { align: 'right', color: C.text, size: 12.5, weight: 600 });
          kit.label(c, 'reflected: ' + hueName(O.colour.srgb(O.colour.fit(calc.tR.lin.slice(), 0.9))), exR[0] + 12, exR[1] + (uy < 0 ? -2 : 8), { color: C.text, size: 12.5, weight: 600 });
          S.angle(c, cx, cy, 34, 0, thr, 'AOI ' + V.th + '°', { gap: 26 });
          ro.set('t', pct(calc.tT.Y, 0) + ' of the visible light: ' + hueName(O.colour.srgb(O.colour.fit(calc.tT.lin.slice(), 0.9))));
          ro.set('r', pct(calc.tR.Y, 0) + ' of the visible light: ' + hueName(O.colour.srgb(O.colour.fit(calc.tR.lin.slice(), 0.9))));
          ro.set('ir', 'transmitted ' + pct(calc.irT, 0) + ' · reflected ' + pct(1 - calc.irT, 0));
          plot.set({ series: [{ pts: calc.pts, color: C.series[0], width: 2.4, label: 'transmitted' }, { pts: calc.pr, color: C.series[1], width: 2.4, label: 'reflected' }], x: { label: 'wavelength (nm)', min: 380, max: calc.hi }, y: { label: '%', min: 0, max: 100 }, vlines: calc.hi > 800 ? [{ x: 700, color: C.faint, label: 'visible ends' }] : [] });
        } else {
          const cx = 0.46 * W, cy = 0.5 * H, Lp = 0.22 * H, xe = 0.2 * W;
          S.plate(c, cx, cy, 2 * Lp, PI / 4, { t: 8, fill: S.glass(0.4) });          // drawn at 45°; the slider moves the edge, not the drawing
          S.source(c, 0.06 * W, cy, { kind: 'bulb', size: 14, color: C.warn }); kit.label(c, 'lamp', 0.06 * W, cy + 30, { align: 'center', color: C.muted, size: 11.5 });
          S.ray(c, [[0.1 * W, cy], [xe - 6, cy]], { color: C.text, width: 3, minArrow: 40 });
          S.plate(c, xe, cy, 0.3 * H, 0, { t: 6, fill: css(O, calc.hExc, 0.9).replace('rgb', 'rgba').replace(')', ',0.45)') }); kit.label(c, 'excitation filter', xe, cy + 0.2 * H, { align: 'center', color: C.muted, size: 11 });
          beam([[xe + 4, cy], [cx, cy]], calc.hExc, 0.7, 3);
          const sy = 0.12 * H, top = [cx, sy];
          beam([[cx, cy], top], calc.hRef, 0.2 + 0.8 * calc.ex, 3);
          beam([[cx, cy], [cx + 0.3 * W, cy]], calc.hLeak, 0.4, 2, [4, 4]);
          c.fillStyle = css(O, calc.hEm, 0.95); c.beginPath(); c.ellipse(top[0], top[1] - 8, 26, 9, 0, 0, 2 * PI); c.fill(); kit.label(c, 'specimen glows', top[0] + 34, top[1] - 8, { color: C.muted, size: 11.5 });
          const bx = top[0], mid = cy + 0.1 * H, ey = 0.74 * H;
          beam([[bx + 6, top[1]], [bx + 6, mid]], calc.hEm, 0.9, 3);
          beam([[bx + 6, mid], [bx + 6, ey - 8]], calc.hEmD, 0.2 + 0.8 * calc.fd, 3);
          S.plate(c, bx + 6, ey, 0.16 * W, Math.PI / 2, { t: 6, fill: S.glass(0.35) }); kit.label(c, 'emission filter', bx + 6 + 0.1 * W, ey, { color: C.muted, size: 11 });
          beam([[bx + 6, ey + 6], [bx + 6, 0.94 * H]], calc.hEmF, 0.2 + 0.8 * calc.em, 3);
          kit.label(c, 'to the eye or camera', bx + 14, 0.95 * H, { color: C.text, size: 12, weight: 600 });
          kit.label(c, 'dichroic at ' + V.th + '°', cx + 20, cy + 10, { color: C.muted, size: 11.5 });
          const od = x => x > 0 ? Math.max(0, -Math.log10(x)).toFixed(1) : '—';
          ro.set('ex', pct(calc.ex, 0) + ' of the filtered excitation light');
          ro.set('em', pct(calc.em, 0) + ' of the emitted light');
          ro.set('leak', 'OD ' + od(calc.leak) + ' (' + pct(calc.leak, 2) + ')');
          plot.set({ series: [{ pts: calc.pd, color: C.series[0], width: 2.6, label: 'dichroic (transmits above its edge)' }, { pts: calc.pe, color: C.series[3], width: 1.8, label: 'excitation filter' }, { pts: calc.pm, color: C.series[1], width: 1.8, label: 'emission filter' }, { pts: calc.pe.map(p => [p[0], 100 * fExc(p[0])]), color: C.faint, width: 1.4, dash: true, label: 'dye: absorbs (schematic)' }, { pts: calc.pe.map(p => [p[0], 100 * fEm(p[0])]), color: C.muted, width: 1.4, dash: true, label: 'dye: emits (schematic)' }], x: { label: 'wavelength (nm)', min: 380, max: 780 }, y: { label: '%', min: 0, max: 100 }, vlines: [] });
        }
        const f1 = x => Number.isFinite(x) ? x.toFixed(0) + ' nm' : '—';
        ro.set('edge', f1(calc.eA) + (mode === 'hot' ? ' (the short-pass edge)' : ' (50 % point)'));
        ro.set('sp', 's ' + f1(calc.eS) + ' · p ' + f1(calc.eP) + (Number.isFinite(calc.eS + calc.eP) ? '  (' + Math.abs(calc.eS - calc.eP).toFixed(0) + ' nm apart)' : ''));
        for (const k of ['t', 'r', 'ir']) ro.show(k, mode !== 'cube');
        for (const k of ['ex', 'em', 'leak']) ro.show(k, mode === 'cube');
      }, box.stage);
      st.onResize(() => loop.once());
      vis();
      loop.once();
    }
  });

  /* ================================================================ coloured glass */
  Hyper.sim('cf-glass', {
    title: 'Coloured glass against an interference filter',
    blurb: `A piece of coloured glass absorbs the light it does not pass: its internal transmittance follows **Beer–Lambert**, τ = exp(−α t), with an absorption coefficient α that rises steeply on one side of its edge. The spectra are **schematic** — typical shapes with edges and slopes like those of real colour glasses, not a catalogue glass. The dashed curves are at 0°; the second filter (optional) is an interference edge filter made to have its edge in the same place.

**Try this**
- Double the thickness: the glass edge moves a few nanometres (about 8 nm for the orange glass), and the blocked band gets much darker. An interference filter would not change at all.
- Tilt both to 45°: the interference filter's edge moves by about 50 nm, the glass edge by less than 2 nm. This is the great advantage of absorbing filters.
- Switch to the **optical-density scale**: the glass blocks deeply over the whole ultraviolet, but the interference filter lets the short wavelengths back in outside its stop band.
- The *heat-absorbing glass* and the interference short-pass filter: they do the same job in the visible, but only the glass keeps blocking in the far infrared.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, F = O.film;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 250 });
      const tint = makeTint(O), cached = makeMemo(20);
      const GL = [['Orange long-pass glass', 'orange'], ['Deep-red long-pass glass', 'red'], ['Blue short-pass glass', 'blue'], ['Heat-absorbing glass', 'heat']];
      const P = { orange: { kind: 'long', lc: 570, s: 11 }, red: { kind: 'long', lc: 650, s: 12 }, blue: { kind: 'short', lc: 560, s: 35 }, heat: { kind: 'short', lc: 780, s: 110 } };
      const ctl = kit.controls(box.side, [
        { id: 'glass', type: 'select', label: 'Glass', options: GL, value: params.glass || 'orange' },
        { id: 't', label: 'Thickness', min: 0.5, max: 10, step: 0.5, value: params.t || 3, unit: 'mm' },
        { id: 'th', label: 'Angle of incidence', min: 0, max: 60, step: 1, value: params.th || 0, unit: '°' },
        { id: 'cmp', type: 'check', label: 'Compare with an interference edge filter', value: params.cmp !== false },
        { id: 'scale', type: 'select', label: 'Vertical scale', options: [['Transmittance, linear', 'lin'], ['Optical density, logarithmic', 'od']], value: 'lin' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['edge', 'Edge of the glass at 0° (internal 50 %)'], ['shift', 'Edge shift at this angle'], ['pass', 'Best transmittance, with the surface losses'], ['block', 'Deepest blocking in the plotted range'], ['path', 'Path through the glass']]);
      const plot = kit.plot(box.side, { x: { label: 'wavelength (nm)' }, y: { label: 'transmittance (%)', min: 0, max: 100 } }, 230);
      const nG = O.index('N-BK7', 550), T0 = 3;
      const alpha = (p, nm) => 0.003 + (Math.LN2 / T0) * Math.exp(clamp(p.kind === 'long' ? (p.lc - nm) / p.s : (nm - p.lc) / p.s, -60, 40));     // per mm
      const cal = (id, dir) => { const d = F.design(id, 600, 'N-BK7'); return crossing(nm => F.stack(d, nm).T, 450, 800, 0.5, dir, 0.25) / 600; };
      const rLP = cal('longpass', 1), rSP = cal('shortpass', -1);
      const edgeSP = (def, th, dir, lo, hi) => (crossing(nm => F.stack(def, nm, th * D2R).Ts, lo, hi, 0.5, dir, 0.25) + crossing(nm => F.stack(def, nm, th * D2R).Tp, lo, hi, 0.5, dir, 0.25)) / 2;
      const compute = () => cached([V.glass, V.t, V.th].join('|'), () => {
        const p = P[V.glass], long = p.kind === 'long', lo = 350, hi = V.glass === 'heat' ? 1250 : 900, N = 360;
        const o = { lo, hi };
        const glassT = (nm, th) => {
          const tt = Math.asin(Math.sin(th * D2R) / nG), path = V.t / Math.cos(tt), tau = Math.exp(-alpha(p, nm) * path), R = O.fresnel(1, nG, th * D2R).R;
          return { tau, T: (1 - R) * (1 - R) * tau / (1 - R * R * tau * tau), path };
        };
        const edgeG = th => crossing(nm => glassT(nm, th).tau, lo, hi, 0.5, long ? 1 : -1, 0.5);
        o.e0 = edgeG(0); o.eth = edgeG(V.th); o.path = glassT(550, V.th).path;
        const kk = long ? rLP : rSP, def = F.design(long ? 'longpass' : 'shortpass', (Number.isFinite(o.e0) ? o.e0 : 600) / kk, 'N-BK7');
        const start = long ? 0.8 * o.e0 : 400;
        o.i0 = edgeSP(def, 0, long ? 1 : -1, start, hi); o.ith = edgeSP(def, V.th, long ? 1 : -1, start, hi);
        const mk = f => { const a = []; for (let i = 0; i <= N; i++) { const nm = lo + (hi - lo) * i / N; a.push([nm, f(nm)]); } return a; };
        o.g = mk(nm => glassT(nm, V.th).T); o.g0 = mk(nm => glassT(nm, 0).T);
        o.f = mk(nm => F.stack(def, nm, V.th * D2R).T); o.f0 = mk(nm => F.stack(def, nm).T);
        o.tint = tint(nm => glassT(nm, V.th).T); o.tintF = tint(nm => F.stack(def, nm, V.th * D2R).T); o.tau10 = tint(nm => Math.exp(-alpha(p, nm) * 10));
        o.best = Math.max(...o.g.map(a => a[1])); o.worst = Math.min(...o.g.map(a => a[1]));
        return o;
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, r = compute(), th = V.th, thr = th * D2R;
        const tt = Math.asin(Math.sin(thr) / nG);
        // the slab, its beam and the colour that gets through
        const d = 14 + 6 * V.t, cx = 0.3 * W, cy = 0.52 * H, hh = 0.32 * H, xf = cx - d / 2, xr = cx + d / 2, ln = 0.24 * W;
        c.fillStyle = css(O, r.tau10.lin, 0.8).replace('rgb', 'rgba').replace(')', ',0.55)'); c.fillRect(xf, cy - hh, d, 2 * hh);
        c.strokeStyle = S.edge(); c.lineWidth = 1.3; c.strokeRect(xf, cy - hh, d, 2 * hh);
        S.normal(c, xf, cy, 0, 26); S.normal(c, xr, cy + d * Math.tan(tt), 0, 26);
        S.ray(c, [[xf - ln * Math.cos(thr), cy - ln * Math.sin(thr)], [xf, cy]], { color: C.text, width: 3, minArrow: 50 });
        S.ray(c, [[xf, cy], [xr, cy + d * Math.tan(tt)]], { color: css(O, r.tint.lin, 0.95), width: 3, alpha: clamp(0.3 + 4 * r.tint.Y, 0.3, 1), minArrow: 10 });
        S.ray(c, [[xr, cy + d * Math.tan(tt)], [xr + ln * Math.cos(thr), cy + d * Math.tan(tt) + ln * Math.sin(thr)]], { color: css(O, r.tint.lin, 0.95), width: 3, alpha: clamp(0.3 + 4 * r.tint.Y, 0.3, 1), minArrow: 50 });
        kit.label(c, 'white light', xf - ln * Math.cos(thr) + 4, cy - ln * Math.sin(thr) - 12, { color: C.muted, size: 12 });
        kit.label(c, V.t + ' mm of glass: path ' + r.path.toFixed(2) + ' mm', cx, cy - hh - 10, { align: 'center', color: C.text, size: 12.5, weight: 600 });
        if (th > 0) S.angle(c, xf, cy, 36, Math.PI, Math.PI + thr, th + '°', { gap: 14 });
        const sx = 0.58 * W, sw = 0.36 * W;
        c.fillStyle = css(O, r.tint.lin, 0.95); c.fillRect(sx, 0.14 * H, sw, 0.22 * H); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(sx, 0.14 * H, sw, 0.22 * H);
        kit.label(c, 'colour of the light through the glass: ' + hueName(O.colour.srgb(O.colour.fit(r.tint.lin.slice(), 0.9))) + ', ' + pct(r.tint.Y, 0) + ' of the luminance', sx, 0.09 * H, { color: C.muted, size: 11.5 });
        if (V.cmp) { c.fillStyle = css(O, r.tintF.lin, 0.95); c.fillRect(sx, 0.52 * H, sw, 0.22 * H); c.strokeRect(sx, 0.52 * H, sw, 0.22 * H); kit.label(c, 'through the interference filter: ' + hueName(O.colour.srgb(O.colour.fit(r.tintF.lin.slice(), 0.9))) + ', ' + pct(r.tintF.Y, 0), sx, 0.47 * H, { color: C.muted, size: 11.5 }); }
        // numbers
        const f1 = x => Number.isFinite(x) ? x.toFixed(1) + ' nm' : '—', od = x => Math.max(0, -Math.log10(Math.max(1e-12, x)));
        ro.set('edge', f1(r.e0));
        ro.set('shift', 'glass ' + (Number.isFinite(r.eth - r.e0) ? (r.eth - r.e0).toFixed(1) : '—') + ' nm' + (V.cmp ? ' · interference filter ' + (Number.isFinite(r.ith - r.i0) ? (r.ith - r.i0).toFixed(1) : '—') + ' nm' : ''));
        ro.set('pass', pct(r.best, 0));
        ro.set('block', (od(r.worst) >= 11.9 ? 'OD > 11' : 'OD ' + od(r.worst).toFixed(1)));
        ro.set('path', r.path.toFixed(2) + ' mm (the thickness over cos θ inside)');
        const lin = V.scale === 'lin', y = v => lin ? 100 * v : Math.max(1e-9, v);
        const series = [{ pts: r.g.map(a => [a[0], y(a[1])]), color: C.series[0], width: 2.6, label: 'coloured glass' }];
        if (th > 0) series.push({ pts: r.g0.map(a => [a[0], y(a[1])]), color: C.series[0], width: 1.3, dash: true, label: 'glass at 0°' });
        if (V.cmp) { series.push({ pts: r.f.map(a => [a[0], y(a[1])]), color: C.series[1], width: 2.4, label: 'interference filter' }); if (th > 0) series.push({ pts: r.f0.map(a => [a[0], y(a[1])]), color: C.series[1], width: 1.3, dash: true, label: 'interference at 0°' }); }
        plot.set({ series, x: { label: 'wavelength (nm)', min: r.lo, max: r.hi }, y: lin ? { label: 'transmittance (%)', min: 0, max: 100 } : { label: 'transmittance (log scale, as OD)', log: true, min: 1e-8, max: 1, fmt: v => 'OD ' + Math.round(-Math.log10(v)) } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ neutral density */
  Hyper.sim('cf-density', {
    title: 'Neutral-density filters: density, stops and stacking',
    blurb: `A beam meets up to three neutral-density filters in a row. Each passes the fraction T = 10^(−OD); the densities of the row **add**. The share that a metal film reflects, and the way the density of each kind changes with wavelength, are **typical shapes** (a model), not a catalogue filter.

**Try this**
- Set the three filters to OD 1.0, 0.6 and 0.3: the row is OD 1.9 and passes 1.26 %. Swap their order: nothing changes.
- Replace all three by one filter of OD 2.0, then OD 3.0: each unit of density takes away another factor of ten.
- Choose OD 0.3, 0.3, 0.3: three stops, one eighth of the light — the photographer's ND8.
- Switch to the **reflecting** kind: a strong beam now leaves the first filter backwards. In the graph its density stays level into the infrared, where the grey glass lets far more through than its label says.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250 });
      const ODS = [['none', '0'], ['OD 0.1', '0.1'], ['OD 0.3', '0.3'], ['OD 0.6', '0.6'], ['OD 0.9', '0.9'], ['OD 1.0', '1'], ['OD 2.0', '2'], ['OD 3.0', '3']];
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Kind of filter', options: [['Absorbing (grey glass)', 'abs'], ['Reflecting (metal film)', 'ref']], value: params.kind || 'abs' },
        { id: 'a', type: 'select', label: 'First filter', options: ODS, value: String(params.a != null ? params.a : 1) },
        { id: 'b', type: 'select', label: 'Second filter', options: ODS, value: String(params.b != null ? params.b : 0.6) },
        { id: 'c', type: 'select', label: 'Third filter', options: ODS, value: String(params.c != null ? params.c : 0.3) },
        { id: 'p', label: 'Power of the beam', min: 1, max: 1000, step: 1, value: params.p || 5, unit: 'mW' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['od', 'Density of the row'], ['t', 'Passes'], ['stops', 'In stops'], ['db', 'In decibels'], ['out', 'Power that comes through'], ['rest', 'Where the rest goes']]);
      const plot = kit.plot(box.side, { x: { label: 'wavelength (nm)', min: 400, max: 1100 }, y: { label: 'density (OD)', log: true, min: 1e-7, max: 1, fmt: v => String(Math.round(-Math.log10(v))) } }, 200);
      // the density of each kind against wavelength, as a multiple of its label (schematic): grey glass fades beyond the red
      const shape = (kind, nm) => kind === 'abs' ? (nm <= 680 ? 1 : Math.max(0.3, 1 - 0.7 * (nm - 680) / 320)) : 1 - 0.05 * (nm - 550) / 550;
      // the share of the arriving light that a metal film of transmittance T reflects (a model of a nickel-chromium film)
      const refl = T => 0.6 * Math.pow(1 - T, 1.5);
      const pw = mW => mW >= 100 ? mW.toFixed(0) + ' mW' : mW >= 1 ? mW.toFixed(2) + ' mW' : mW >= 1e-3 ? (mW * 1e3).toFixed(mW >= 0.1 ? 0 : 1) + ' µW' : (mW * 1e6).toFixed(mW >= 1e-4 ? 0 : 1) + ' nW';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, ref = V.kind === 'ref';
        const ods = [V.a, V.b, V.c].map(parseFloat), cy = 0.5 * H, x0 = 0.04 * W, x1 = 0.97 * W;
        const xs = [0.27 * W, 0.5 * W, 0.73 * W], hh = 0.2 * H, narrow = W < 520;
        let P = V.p, back = 0, heat = 0, xPrev = x0;
        const seg = (xa, xb, power) => {
          const f = power / V.p;
          S.ray(c, [[xa, cy], [xb, cy]], { color: C.accent || C.series[0], width: 2 + 7 * Math.pow(f, 0.25), alpha: clamp(0.25 + 0.75 * Math.pow(f, 0.2), 0.25, 1), minArrow: 60 });
          kit.label(c, pw(power), (xa + xb) / 2, cy - 0.2 * H - 6, { align: 'center', color: C.text, size: narrow ? 11 : 12.5, weight: 600 });
        };
        ods.forEach((od, i) => {
          const x = xs[i];
          seg(xPrev, x, P);
          if (od > 0) {
            const T = Math.pow(10, -od), R = ref ? refl(T) : 0, d = 7 + 5 * od;
            const g = Math.round(205 - 150 * Math.min(1, od / 3));
            c.fillStyle = ref ? 'rgba(150,160,175,0.85)' : 'rgb(' + g + ',' + g + ',' + (g + 4) + ')';
            c.fillRect(x - d / 2, cy - hh, d, 2 * hh); c.strokeStyle = S.edge(); c.lineWidth = 1.2; c.strokeRect(x - d / 2, cy - hh, d, 2 * hh);
            kit.label(c, 'OD ' + od, x, cy + hh + 16, { align: 'center', color: C.text, size: 12, weight: 600 });
            kit.label(c, (100 * T >= 1 ? (100 * T).toFixed(100 * T >= 10 ? 0 : 1) : (100 * T).toPrecision(1)) + ' %', x, cy + hh + 31, { align: 'center', color: C.muted, size: 11 });
            if (ref) {
              const len = 0.13 * W, a = Math.pow(R * P / V.p, 0.25);
              S.ray(c, [[x - d / 2, cy], [x - d / 2 - len, cy + 0.26 * H]], { color: C.series[1], width: 1.5 + 5 * a, alpha: clamp(0.3 + 0.7 * a, 0.3, 1), minArrow: 30 });
              if (!narrow || i === 0) kit.label(c, 'back ' + pw(R * P), x - d / 2 - len, cy + 0.26 * H + 14, { align: 'center', color: C.series[1], size: 11 });
            }
            back += R * P; heat += (1 - T - R) * P; P *= T;
          } else kit.label(c, '(no filter)', x, cy + hh + 16, { align: 'center', color: C.muted, size: 11 });
          xPrev = x;
        });
        seg(xPrev, x1, P);
        kit.label(c, 'beam in', x0, cy + 22, { color: C.muted, size: 11 }); kit.label(c, 'out', x1, cy + 22, { align: 'right', color: C.muted, size: 11 });
        const od = ods.reduce((a, b) => a + b, 0), T = Math.pow(10, -od);
        ro.set('od', 'OD ' + od.toFixed(1) + '  (' + ods.filter(v => v > 0).join(' + ') + ')');
        ro.set('t', pct(T) + ' — a factor of ' + (1 / T >= 100 ? Math.round(1 / T) : (1 / T).toFixed(1)));
        ro.set('stops', (od / Math.log10(2)).toFixed(1));
        ro.set('db', (10 * od).toFixed(0) + ' dB');
        ro.set('out', pw(P));
        ro.set('rest', ref ? pw(back) + ' reflected, ' + pw(heat) + ' absorbed in the films' : pw(heat) + ' absorbed: heat in the glass');
        const pts = kind => { const a = []; for (let nm = 400; nm <= 1100; nm += 10) a.push([nm, Math.max(1e-9, Math.pow(10, -od * shape(kind, nm)))]); return a; };
        plot.set({ series: [{ pts: pts(V.kind), color: C.series[0], width: 2.6, label: ref ? 'metal film' : 'grey glass' }, { pts: pts(ref ? 'abs' : 'ref'), color: C.series[1], width: 1.3, dash: true, label: ref ? 'grey glass' : 'metal film' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ how a layer is grown */
  Hyper.sim('cf-deposition', {
    title: 'A coating chamber: growing one layer and knowing when to stop',
    blurb: `On the left a vacuum chamber: a source at the bottom, the lenses on a dome at the top, and in the middle of the dome a **monitor glass** watched by a beam of one wavelength. On the right the layer on that glass, hugely magnified. The graph is the reflection the monitor sees as the layer grows, calculated for the layer on crown glass. The flying atoms are **schematic**, and the film grows about twenty times faster than the rate says.

**Try this**
- Open the shutter with magnesium fluoride. The reflection falls from 4.24 % and turns at 1.27 %, exactly when the layer is a quarter wave (99.6 nm): the shutter closes there.
- Open it again: the reflection climbs back to the bare-glass value at a half wave, where the layer has no effect at this wavelength.
- Choose titanium dioxide: the reflection now *rises*, to 32 %, and the quarter wave is only 58.5 nm thick.
- Change the monitor wavelength: the same layer reaches its turning point at a different thickness. The monitor measures optical thickness at its own wavelength.
- Spoil the vacuum to 1 Pa: the atoms collide every few millimetres and wander; hardly any reach the glass.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, F = O.film;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 290 });
      const MATS = [['Magnesium fluoride (1.38)', 'MgF2'], ['Silicon dioxide (1.46)', 'SiO2'], ['Aluminium oxide (1.63)', 'Al2O3'], ['Tantalum pentoxide (2.10)', 'Ta2O5'], ['Titanium dioxide (2.35)', 'TiO2']];
      const DMAX = 400, SPEED = 20;
      let running = false, target = DMAX, parts = [];
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Coating material', options: MATS, value: params.mat || 'MgF2' },
        { id: 'nm', label: 'Wavelength of the monitor', min: 400, max: 800, step: 10, value: params.nm || 550, unit: 'nm' },
        { id: 'rate', label: 'Deposition rate', min: 0.1, max: 2, step: 0.1, value: params.rate || 0.5, unit: 'nm/s' },
        { id: 'd', label: 'Thickness of the layer', min: 0, max: DMAX, step: 1, value: params.d != null ? params.d : 0, unit: 'nm' },
        { id: 'p', type: 'select', label: 'Pressure in the chamber', options: [['1 mPa: a good vacuum', 0.001], ['30 mPa: a poor vacuum', 0.03], ['1 Pa: hardly a vacuum', 1]], value: params.p || 0.001 },
        { id: 'auto', type: 'check', label: 'Close the shutter at the next turning point', value: params.auto !== false },
        { type: 'buttons', items: [{ id: 'run', label: 'Open / close the shutter', primary: true }, { id: 'clear', label: 'New glass' }] }
      ], id => {
        if (id === 'run') { if (running) halt(); else begin(); return; }
        if (id === 'clear') { ctl.set('d', 0); halt(); return; }
        if (id === 'd' && running) { halt(); return; }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['d', 'Thickness now'], ['qw', 'Optical thickness'], ['R', 'Reflection of the monitor glass'], ['q', 'A quarter wave of this material'], ['time', 'Time at this rate'], ['mfp', 'Mean free path']]);
      const plot = kit.plot(box.side, { x: { label: 'thickness (nm)', min: 0, max: DMAX }, y: { label: 'reflection (%)', min: 0 } }, 200);
      const cached = makeMemo(12);
      const quarter = () => F.quarterWave(V.mat, V.nm);
      const Rof = d => F.stack({ n0: 1, ns: 'N-BK7', layers: d > 0 ? [{ n: V.mat, d }] : [] }, V.nm).R;
      const curve = () => cached(V.mat + '|' + V.nm, () => { const a = []; for (let d = 0; d <= DMAX; d += 2) a.push([d, 100 * Rof(d)]); return a; });
      const begin = () => {
        if (V.d >= DMAX - 0.5) ctl.set('d', 0);
        const q = quarter();
        target = V.auto ? Math.min(DMAX, (Math.floor(V.d / q + 1e-6) + 1) * q) : DMAX;
        running = true; loop.start();
      };
      const halt = () => { running = false; parts = []; loop.stop(); loop.once(); };
      const layerCss = a => { const n = nOfLayer(O, V.mat), t = clamp((n - 1.3) / 1.1, 0, 1); return 'rgba(' + Math.round(90 + 150 * t) + ',' + Math.round(170 - 20 * t) + ',' + Math.round(230 - 170 * t) + ',' + a + ')'; };
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, q = quarter();
        // the chamber
        const X0 = 0.04 * W, X1 = 0.6 * W, Y0 = 0.1 * H, Y1 = 0.93 * H, cx = (X0 + X1) / 2, cw = X1 - X0, ch = Y1 - Y0;
        const ySrc = Y1 - 0.1 * ch, yDome = Y0 + 0.2 * ch, pxPerM = cw;          // the chamber is about a metre across
        if (running) {
          const d = Math.min(target, V.d + V.rate * SPEED * dt);
          ctl.set('d', Math.round(d * 10) / 10);
          // atoms leave the source; in a poor vacuum they change direction after each free path
          const mfp = 0.0066 / V.p * pxPerM, v = 0.9 * ch;
          for (let k = 0; k < 3 && parts.length < 140; k++) { const a = -PI / 2 + (Math.random() - 0.5) * 1.5; parts.push({ x: cx + (Math.random() - 0.5) * 10, y: ySrc - 6, a, left: -Math.log(1 - Math.random()) * mfp, life: 0 }); }
          parts = parts.filter(p => {
            let s = v * dt; p.life += dt;
            while (s > 0) { const go = Math.min(s, p.left); p.x += go * Math.cos(p.a); p.y += go * Math.sin(p.a); s -= go; p.left -= go; if (p.left <= 0) { p.a = Math.random() * 2 * PI; p.left = Math.max(0.5, -Math.log(1 - Math.random()) * mfp); } }
            return p.y > yDome && p.y < Y1 - 2 && p.x > X0 + 3 && p.x < X1 - 3 && p.life < 6;
          });
          if (d >= target - 1e-6) { running = false; parts = []; loop.stop(); }
        }
        c.fillStyle = C.panel || 'rgba(127,127,127,0.08)'; c.strokeStyle = S.edge(); c.lineWidth = 2;
        c.beginPath(); c.rect(X0, Y0, cw, ch); c.fill(); c.stroke();
        kit.label(c, 'vacuum chamber', X0 + 6, Y1 - 8, { color: C.muted, size: 11 });
        // the source and its shutter
        c.fillStyle = S.metal ? S.metal() : '#888'; c.beginPath(); c.moveTo(cx - 20, ySrc); c.lineTo(cx + 20, ySrc); c.lineTo(cx + 14, ySrc + 14); c.lineTo(cx - 14, ySrc + 14); c.closePath(); c.fill();
        c.fillStyle = running ? '#ff9a3c' : '#b8642a'; c.fillRect(cx - 12, ySrc - 3, 24, 5);
        kit.label(c, 'source', cx + 26, ySrc + 10, { color: C.muted, size: 11 });
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath();
        if (running) { c.moveTo(cx + 22, ySrc - 16); c.lineTo(cx + 46, ySrc - 30); } else { c.moveTo(cx - 20, ySrc - 16); c.lineTo(cx + 20, ySrc - 16); }
        c.stroke();
        kit.label(c, running ? 'shutter open' : 'shutter closed', cx - 26, ySrc - 12, { align: 'right', color: C.muted, size: 11 });
        // the dome with its lenses and the monitor glass
        c.strokeStyle = S.edge(); c.lineWidth = 1.5; c.beginPath();
        for (let i = 0; i <= 40; i++) { const u = -1 + 2 * i / 40, x = cx + u * 0.42 * cw, y = yDome - 0.09 * ch * (1 - u * u); if (i) c.lineTo(x, y); else c.moveTo(x, y); }
        c.stroke();
        [-0.8, -0.45, 0.45, 0.8].forEach(u => { const x = cx + u * 0.42 * cw, y = yDome - 0.09 * ch * (1 - u * u) + 5; c.fillStyle = S.glass(); c.beginPath(); c.ellipse(x, y, 0.045 * cw, 4, u * 0.25, 0, 2 * PI); c.fill(); c.strokeStyle = S.edge(); c.lineWidth = 1; c.stroke(); });
        const ym = yDome - 0.09 * ch + 5;
        c.fillStyle = S.glass(); c.fillRect(cx - 12, ym - 3, 24, 6); c.strokeStyle = S.edge(); c.strokeRect(cx - 12, ym - 3, 24, 6);
        c.fillStyle = layerCss(0.9); c.fillRect(cx - 12, ym + 3, 24, 1 + 3 * V.d / DMAX);
        kit.label(c, 'lenses on a turning dome', X0 + 6, Y0 + 14, { color: C.muted, size: 11 });
        // the monitor beam, through a window in the roof
        const mc = O.colour.nmCss(V.nm);
        S.ray(c, [[cx - 9, Y0 - 0.07 * H], [cx - 2, ym - 3]], { color: mc, width: 1.6, minArrow: 20 });
        S.ray(c, [[cx + 2, ym - 3], [cx + 9, Y0 - 0.07 * H]], { color: mc, width: 1.6, alpha: 0.75, minArrow: 20 });
        kit.label(c, 'monitor, ' + V.nm + ' nm', cx + 14, Y0 - 0.03 * H, { color: C.text, size: 11.5 });
        c.fillStyle = layerCss(0.85);
        for (const p of parts) { c.beginPath(); c.arc(p.x, p.y, 1.7, 0, 2 * PI); c.fill(); }
        // the layer on the monitor glass, magnified
        const gx = 0.68 * W, gw = 0.27 * W, gBase = 0.82 * H, gGlass = 0.12 * H, scale = 0.58 * H / DMAX;
        c.fillStyle = S.glass(); c.fillRect(gx, gBase, gw, gGlass); c.strokeStyle = S.edge(); c.lineWidth = 1; c.strokeRect(gx, gBase, gw, gGlass);
        kit.label(c, 'glass', gx + gw / 2, gBase + gGlass / 2 + 4, { align: 'center', color: C.muted, size: 11 });
        c.fillStyle = layerCss(0.8); c.fillRect(gx, gBase - V.d * scale, gw, V.d * scale);
        c.setLineDash([4, 3]); c.strokeStyle = C.muted; c.lineWidth = 1;
        const NAMES = ['', 'λ/4', 'λ/2', '3λ/4', 'λ', '5λ/4', '3λ/2', '7λ/4', '2λ'];
        for (let k = 1; k * q <= DMAX && k < NAMES.length; k++) { const y = gBase - k * q * scale; c.beginPath(); c.moveTo(gx - 4, y); c.lineTo(gx + gw, y); c.stroke(); kit.label(c, NAMES[k], gx - 7, y + 4, { align: 'right', color: C.muted, size: 10.5 }); }
        c.setLineDash([]);
        kit.label(c, 'the layer, magnified', gx + gw / 2, gBase - DMAX * scale - 30, { align: 'center', color: C.text, size: 12, weight: 600 });
        kit.label(c, V.d.toFixed(1) + ' nm', gx + gw / 2, gBase - DMAX * scale - 14, { align: 'center', color: C.muted, size: 11.5 });
        // numbers and the monitor curve
        const pts = curve(), Rn = 100 * Rof(V.d), top = Math.max(...pts.map(a => a[1]));
        ro.set('d', V.d.toFixed(1) + ' nm');
        ro.set('qw', (V.d / q).toFixed(2) + ' quarter waves at ' + V.nm + ' nm');
        ro.set('R', Rn.toFixed(2) + ' %  (bare glass ' + pts[0][1].toFixed(2) + ' %)');
        ro.set('q', q.toFixed(1) + ' nm');
        ro.set('time', V.d / V.rate >= 120 ? (V.d / V.rate / 60).toFixed(1) + ' min' : (V.d / V.rate).toFixed(0) + ' s');
        ro.set('mfp', (0.0066 / V.p >= 1 ? (0.0066 / V.p).toFixed(1) + ' m' : (6.6 / V.p).toFixed(1) + ' mm') + (0.0066 / V.p > 3 ? ': straight lines' : 0.0066 / V.p > 0.1 ? ': many atoms collide' : ': the vapour wanders'));
        plot.set({ series: [{ pts, color: C.series[0], width: 2.4 }], marks: [{ x: V.d, y: Rn, label: Rn.toFixed(2) + ' %' }], y: { label: 'reflection (%)', min: 0, max: Math.max(5, 1.15 * top) } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ laser damage */
  Hyper.sim('cf-damage', {
    title: 'Will the coating survive the pulse?',
    blurb: `On the left the laser spot on the coating, seen face on; on the right the damage thresholds of six kinds of coating, moved to the pulse length and wavelength chosen, against the **peak** fluence of the beam (the vertical line). The graph is the fluence across the beam. The thresholds are **typical orders of magnitude** at 1064 nm and 10 ns, scaled by the square-root and wavelength rules of thumb: a real coating has the value on its data sheet, and in the ultraviolet it is usually lower than this rule gives.

**Try this**
- 10 mJ in a radius of 0.5 mm: the peak is 2.55 J/cm², twice the average. The laser-line mirror has a margin of 7.9; the aluminium mirror is destroyed.
- Choose the aluminium mirror and widen the beam until it is safe: the fluence falls with the square of the radius.
- Shorten the pulse from 10 ns to 1 ns: every threshold falls to about a third.
- Switch to 355 nm: the thresholds fall again.
- Tick the **hot spot**: a coating with a margin below two now burns at the centre, though the smooth beam was safe.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const COAT = [['Dielectric laser-line mirror', 'hr', 20], ['Two-layer anti-reflection (V-coat)', 'v', 15], ['Broadband anti-reflection', 'bbar', 7], ['Broadband dielectric mirror', 'bb', 3], ['Protected silver or gold mirror', 'ag', 1.5], ['Protected aluminium mirror', 'al', 0.3]];
      const ctl = kit.controls(box.side, [
        { id: 'coat', type: 'select', label: 'Coating', options: COAT.map(a => [a[0], a[1]]), value: params.coat || 'hr' },
        { id: 'E', label: 'Energy of the pulse', min: 0.1, max: 1000, value: params.E || 10, log: true, sig: 2, unit: 'mJ' },
        { id: 'w', label: 'Beam radius on the coating (1/e²)', min: 0.1, max: 5, value: params.w || 0.5, log: true, sig: 2, unit: 'mm' },
        { id: 'tau', label: 'Length of the pulse', min: 1, max: 100, value: params.tau || 10, log: true, sig: 2, unit: 'ns' },
        { id: 'nm', type: 'select', label: 'Wavelength', options: [['1064 nm (infrared)', 1064], ['532 nm (green)', 532], ['355 nm (ultraviolet)', 355]], value: params.nm || 1064 },
        { id: 'hot', type: 'check', label: 'A hot spot: twice the fluence at the centre', value: !!params.hot }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['F0', 'Peak fluence'], ['avg', 'Energy over the 1/e² area'], ['th', 'Threshold of this coating here'], ['S', 'Safety factor'], ['zone', 'Damaged zone']]);
      const plot = kit.plot(box.side, { x: { label: 'distance from the centre (mm)' }, y: { label: 'fluence (J/cm²)', min: 0 } }, 200);
      const fl = v => v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v >= 1 ? v.toFixed(2) : v.toPrecision(2);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, narrow = W < 520;
        const wcm = V.w / 10, F0 = 2 * (V.E / 1000) / (PI * wcm * wcm);                 // J/cm²
        const prof = r => F0 * (Math.exp(-2 * r * r / (V.w * V.w)) + (V.hot ? Math.exp(-2 * r * r / (0.0225 * V.w * V.w)) : 0));    // r in mm
        const peak = prof(0), scaleTh = Math.sqrt(V.tau / 10) * V.nm / 1064;
        const sel = COAT.find(a => a[1] === V.coat), th = sel[2] * scaleTh;
        let rd = 0; if (peak > th) { for (let r = 0; r <= 3 * V.w; r += V.w / 400) if (prof(r) > th) rd = r; }
        // the spot, face on: the view is 4.4 beam radii across
        const R = Math.min(0.2 * W, 0.36 * H), sx = 0.04 * W + R, sy = 0.52 * H, px = R / (2.2 * V.w);
        c.save(); c.beginPath(); c.rect(sx - R, sy - R, 2 * R, 2 * R); c.clip();
        c.fillStyle = C.panel || 'rgba(127,127,127,0.10)'; c.fillRect(sx - R, sy - R, 2 * R, 2 * R);
        const beamCss = V.nm === 532 ? '70,220,90' : V.nm === 355 ? '150,110,255' : '255,90,60';
        for (let i = 14; i >= 1; i--) { const r = 2.1 * V.w * i / 14; c.fillStyle = 'rgba(' + beamCss + ',' + (0.09 * Math.exp(-2 * r * r / (V.w * V.w)) + 0.012).toFixed(3) + ')'; c.beginPath(); c.arc(sx, sy, r * px, 0, 2 * PI); c.fill(); }
        if (rd > 0) {
          c.fillStyle = '#2b1710'; c.beginPath();
          for (let i = 0; i <= 48; i++) { const a = 2 * PI * i / 48, rr = rd * px * (1 + 0.06 * Math.sin(7 * a) + 0.04 * Math.sin(13 * a + 1)); if (i) c.lineTo(sx + rr * Math.cos(a), sy + rr * Math.sin(a)); else c.moveTo(sx + rr * Math.cos(a), sy + rr * Math.sin(a)); }
          c.closePath(); c.fill(); c.strokeStyle = '#d4552a'; c.lineWidth = 1.5; c.stroke();
        }
        c.setLineDash([5, 4]); c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.arc(sx, sy, V.w * px, 0, 2 * PI); c.stroke(); c.setLineDash([]);
        c.restore();
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(sx - R, sy - R, 2 * R, 2 * R);
        kit.label(c, 'the spot on the coating', sx, sy - R - 8, { align: 'center', color: C.text, size: 12, weight: 600 });
        kit.label(c, 'dashed: the 1/e² radius, ' + V.w.toPrecision(2) + ' mm', sx, sy + R + 15, { align: 'center', color: C.muted, size: 11 });
        if (rd > 0) kit.label(c, 'burnt', sx, sy + 4, { align: 'center', color: '#ffb48a', size: 11, weight: 600 });
        // the thresholds of the six coatings on a logarithmic scale, with the peak fluence as a line
        const bx0 = sx + R + (narrow ? 14 : 0.06 * W), bx1 = 0.97 * W, LO = -2, HI = 4, X = v => bx0 + (bx1 - bx0) * (clamp(Math.log10(v), LO, HI) - LO) / (HI - LO);
        const top = 0.1 * H, rowH = 0.118 * H;
        COAT.forEach((a, i) => {
          const t = a[2] * scaleTh, y = top + i * rowH, m = t / peak, on = a[1] === V.coat;
          kit.label(c, narrow ? a[0].replace('anti-reflection', 'AR').replace('Protected ', '').replace('Dielectric ', '').replace('dielectric ', '') : a[0], bx0, y + 2, { color: on ? C.text : C.muted, size: narrow ? 10.5 : 11.5, weight: on ? 700 : 400 });
          c.fillStyle = m >= 3 ? 'rgba(60,170,90,0.85)' : m >= 1 ? 'rgba(225,165,40,0.9)' : 'rgba(215,70,50,0.9)';
          c.fillRect(bx0, y + 7, Math.max(2, X(t) - bx0), 0.036 * H);
          kit.label(c, fl(t), Math.min(bx1 - 4, X(t) + 5), y + 7 + 0.03 * H, { color: C.muted, size: 10.5 });
        });
        const ya = top + 6 * rowH + 2;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(bx0, ya); c.lineTo(bx1, ya); c.stroke();
        for (let e = LO; e <= HI; e++) { const x = X(Math.pow(10, e)); c.beginPath(); c.moveTo(x, ya); c.lineTo(x, ya + 4); c.stroke(); if (!narrow || e % 2 === 0) kit.label(c, e < 0 ? (e === -2 ? '0.01' : '0.1') : String(Math.pow(10, e)), x, ya + 16, { align: 'center', color: C.muted, size: 10.5 }); }
        kit.label(c, 'J/cm²', bx1, ya + 30, { align: 'right', color: C.muted, size: 10.5 });
        const xp = X(peak);
        // the peak is marked across each bar only, so that it does not run through the names
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath();
        c.moveTo(xp, top - 12); c.lineTo(xp, top - 4);
        COAT.forEach((a, i) => { const y = top + i * rowH; c.moveTo(xp, y + 5); c.lineTo(xp, y + 9 + 0.036 * H); });
        c.moveTo(xp, ya - 5); c.lineTo(xp, ya);
        c.stroke();
        kit.label(c, 'peak of the beam: ' + fl(peak) + ' J/cm²', xp > (bx0 + bx1) / 2 ? xp - 5 : xp + 5, top - 14, { align: xp > (bx0 + bx1) / 2 ? 'right' : 'left', color: C.text, size: 11.5, weight: 600 });
        // numbers and the profile
        const m = th / peak;
        ro.set('F0', fl(peak) + ' J/cm²' + (V.hot ? '  (hot spot)' : ''));
        ro.set('avg', fl(F0 / 2) + ' J/cm²: half the smooth peak');
        ro.set('th', fl(th) + ' J/cm²  (' + fl(sel[2]) + ' at 1064 nm, 10 ns)');
        ro.set('S', (m >= 100 ? m.toFixed(0) : m.toFixed(m >= 10 ? 1 : 2)) + (m >= 3 ? ': a sound margin' : m >= 2 ? ': the least to accept' : m >= 1 ? ': too close' : ': damage'));
        ro.set('zone', rd > 0 ? 'about ' + (2 * rd).toPrecision(2) + ' mm across' : 'none');
        const pts = []; for (let i = -100; i <= 100; i++) { const r = 2.5 * V.w * i / 100; pts.push([r, prof(r)]); }
        const xr = 2.5 * V.w, ymax = 1.15 * Math.max(peak, Math.min(th, 4 * peak));
        const series = [{ pts, color: C.series[0], width: 2.4, label: 'beam' }];
        if (th <= ymax) series.push({ pts: [[-xr, th], [xr, th]], color: C.series[1], width: 1.8, label: 'threshold' });
        if (th / 3 <= ymax) series.push({ pts: [[-xr, th / 3], [xr, th / 3]], color: C.series[1], width: 1.2, dash: true, label: 'a third of it' });
        plot.set({ series, x: { label: 'distance from the centre (mm)', min: -xr, max: xr }, y: { label: 'fluence (J/cm²)', min: 0, max: ymax } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
