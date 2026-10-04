/* HYPER-OPTICS · sims/radiometry-and-photometry.js — simulations of the topic "Measuring light" (prefix rp-)
 *   rp-quantities       one source, one card: flux, intensity, irradiance and radiance (and their photometric twins) drawn and counted
 *   rp-luminosity       V(λ) and V′(λ): what each wavelength is worth in lumens; two single colours, or a lamp's whole spectrum
 *   rp-units            lumens → candelas → lux → nits for a candle, a bulb, a torch, a desk lamp and a screen
 *   rp-inverse-square   the inverse-square law (equal flux through squares at 1, 2, 3 d) and the cosine law on a floor
 *   rp-lambert          a Lambertian patch: equal luminance, falling intensity, L = ρE/π, against a glossy surface
 *   rp-radiance         a lens images a source: the image is smaller and lit from a wider cone, but its radiance is the same
 *   rp-etendue          a source into a fibre, a light guide or a projector panel: étendue, the best coupling, the magnification
 *   rp-sphere           an integrating sphere: photons bounce until the wall is evenly lit; multiplier, bounces, signal
 *   rp-meters           what a lux meter must get right: the spectral response of a bare silicon cell and the cosine response
 *   rp-levels           light levels from starlight to sunshine on a log scale, with a camera's exposure value and the pupil
 * All numbers come from kit.optics (photometry, colour, Fresnel); the drawing is kit.osym and the canvas helpers of the kit.
 */
(function () {
  'use strict';
  const PI = Math.PI, D2R = PI / 180, R2D = 180 / PI;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  const group = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  /* a number with sig significant figures; powers of ten for the very large and the very small */
  function num(v, sig) {
    sig = sig || 3;
    if (!Number.isFinite(v)) return '—';
    if (v === 0) return '0';
    const a = Math.abs(v);
    if (a >= 1e5 || a < 0.01) { const p = v.toExponential(sig - 1).split('e'); return p[0] + ' × 10' + String(+p[1]).split('').map(ch => SUP[ch]).join(''); }
    const s = String(+v.toPrecision(sig));
    if (a < 10000) return s;
    const q = s.split('.');
    return group(q[0]) + (q[1] ? '.' + q[1] : '');
  }
  const PRE = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p']];
  /* engineering notation with an SI prefix: 0.0042 W → 4.2 mW */
  function eng(v, unit, sig) {
    if (!Number.isFinite(v)) return '—';
    if (v === 0) return '0 ' + unit;
    const a = Math.abs(v);
    let p = PRE[PRE.length - 1];
    for (const q of PRE) if (a >= q[0] * 0.9995) { p = q; break; }
    return num(v / p[0], sig || 3) + ' ' + p[1] + unit;
  }
  const fx = (x, d) => Number.isFinite(x) ? x.toFixed(d) : '—';
  function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

  /* ================================================================ the four quantities */
  Hyper.sim('rp-quantities', {
    title: 'Flux, intensity, irradiance, radiance: four answers about one source',
    blurb: `A flat source sends its light into a cone towards a card. Pick a quantity to see which part of the picture it counts: the **flux** is everything the source gives off, the **intensity** is that flux per steradian of the cone, the **irradiance** is the flux landing on each square metre of the card, and the **radiance** is the power per square metre of the source per steradian. Switch between counting energy (watts) and counting what the eye sees (lumens).

**Try this**
- Widen the cone with *half-angle*. The flux does not change, but the solid angle grows, so the **intensity** falls, and so does the irradiance on the card.
- Drag the card (or use *distance*) away from the source: the irradiance falls as 1/d². The **intensity** and the **radiance** do not change at all.
- Make the source larger. The flux and the intensity are unchanged, but the **radiance** falls: the same light now comes from more area.
- Switch to the photometric view and slide the *wavelength*: 10 W of green light is thousands of lumens, 10 W of deep red a few tens.

The light is drawn as a tidy cone with even intensity. A real source is never so neat, and the card is small enough for the inverse-square law to hold.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Count the light as', options: [['Energy: radiometric (W)', 'radiometric'], ['What the eye sees: photometric (lm)', 'photometric']], value: params.view || 'radiometric' },
        { id: 'quantity', type: 'select', label: 'Show', options: [['Flux Φ: all the light', 'flux'], ['Intensity I: per steradian', 'intensity'], ['Irradiance E: per m² of the card', 'irradiance'], ['Radiance L: per m² of source, per steradian', 'radiance']], value: params.quantity || 'flux' },
        { id: 'P', label: 'Optical power of the source', min: 0.01, max: 100, value: params.P || 10, log: true, sig: 2, unit: 'W' },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: params.nm || 555, unit: 'nm' },
        { id: 'half', label: 'Half-angle of the cone', min: 5, max: 85, step: 1, value: params.half || 30, unit: '°' },
        { id: 'd', label: 'Distance to the card', min: 0.5, max: 10, step: 0.1, value: params.d || 3, unit: 'm' },
        { id: 'A', label: 'Area of the source', min: 1, max: 400, value: params.A || 20, log: true, sig: 2, unit: 'cm²' }
      ], id => { if (id === 'view') sync(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['Phi', 'Flux Φ'], ['Om', 'Solid angle Ω of the cone'], ['I', 'Intensity I = Φ / Ω'], ['E', 'On the card: E = I / d²'], ['L', 'The source: L = I / A']]);
      const sync = () => ctl.show('nm', V.view === 'photometric');
      sync();
      const geo = () => { const W = st.W, H = st.H, xs = 0.09 * W, ys = 0.54 * H; return { W, H, xs, ys, xc: xs + W * (0.30 + 0.52 * (V.d - 0.5) / 9.5) }; };
      kit.drag(st, {
        hover: true,
        hit: p => Math.abs(p.x - geo().xc) < 16 ? 'card' : null,
        move: (what, p) => {
          const g = geo();
          const d = 0.5 + 9.5 * ((p.x - g.xs) / g.W - 0.30) / 0.52;
          ctl.set('d', Math.round(clamp(d, 0.5, 10) * 10) / 10);
          loop.once();
        }
      });
      const DEF = {
        flux: ['Radiant flux Φ  [W]: all the power the source gives off', 'Luminous flux Φ  [lm]: all the light, as the eye counts it'],
        intensity: ['Radiant intensity I = Φ / Ω  [W/sr]: power per steradian', 'Luminous intensity I = Φ / Ω  [cd = lm/sr]'],
        irradiance: ['Irradiance E  [W/m²]: power landing on each m² of the card', 'Illuminance E  [lx = lm/m²]: light landing on each m² of the card'],
        radiance: ['Radiance L  [W/(m²·sr)]: power per m² of source per steradian', 'Luminance L  [cd/m², the nit]: intensity per m² of source']
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), g = geo(), W = g.W, H = g.H, xs = g.xs, ys = g.ys, xc = g.xc;
        const phot = V.view === 'photometric', th = V.half * D2R, q = V.quantity;
        const Phi = phot ? Ph.lumens(V.P, V.nm) : V.P;
        const Om = Ph.solidAngle(th), I = Phi / Om, E = Ph.illuminance(I, V.d, 0), L = I / (V.A * 1e-4);
        const fillBeam = a => { c.save(); if (phot) c.fillStyle = S.nm(V.nm, a); else { c.globalAlpha = a; c.fillStyle = C.accent; } c.fill(); c.restore(); };
        const rayOpt = (w, a) => phot ? { nm: V.nm, width: w, alpha: a, arrows: false } : { color: C.accent, width: w, alpha: a, arrows: false };
        const reach = xc - xs, hs = 10 + 14 * Math.log10(V.A);
        // the cone, the rays
        c.save(); c.beginPath(); c.rect(0, 0, W, H); c.clip();
        const hw = reach * Math.tan(th);
        c.beginPath(); c.moveTo(xs, ys); c.lineTo(xc, ys - hw); c.lineTo(xc, ys + hw); c.closePath();
        fillBeam(q === 'flux' ? 0.36 : 0.12);
        for (let k = -3; k <= 3; k++) S.ray(c, [[xs, ys], [xc, ys + reach * Math.tan(k / 3 * th)]], rayOpt(1.1, q === 'flux' ? 0.7 : 0.4));
        // intensity: the solid angle as a sector of a sphere around the source
        if (q === 'intensity') {
          const r0 = clamp(0.2 * W, 50, reach * 0.8);
          c.beginPath(); c.moveTo(xs, ys); c.arc(xs, ys, r0, -th, th); c.closePath(); fillBeam(0.5);
          c.strokeStyle = C.warn; c.lineWidth = 2.2; c.beginPath(); c.arc(xs, ys, r0, -th, th); c.stroke();
          kit.label(c, 'Ω = ' + fx(Om, 2) + ' sr', xs + r0 + 8, ys - 2, { color: C.warn, weight: 650 });
        }
        c.restore();
        S.angle(c, xs, ys, Math.min(70, reach * 0.4), 0, -th, 'θ', { size: 13 });
        // the card
        c.fillStyle = C.muted; c.fillRect(xc, 0.06 * H, 4, 0.88 * H);
        kit.label(c, 'card, ' + fx(V.d, 1) + ' m away', xc, 0.035 * H, { align: 'center', color: C.muted, size: 11.5 });
        const hp = 0.14 * H;
        c.strokeStyle = q === 'irradiance' ? C.warn : C.faint; c.lineWidth = q === 'irradiance' ? 7 : 3;
        c.beginPath(); c.moveTo(xc, ys - hp / 2); c.lineTo(xc, ys + hp / 2); c.stroke();
        if (q === 'irradiance') {
          S.ray(c, [[xs, ys], [xc, ys - hp / 2]], { color: C.warn, width: 1, alpha: 0.9, arrows: false });
          S.ray(c, [[xs, ys], [xc, ys + hp / 2]], { color: C.warn, width: 1, alpha: 0.9, arrows: false });
          kit.label(c, 'E: flux on each m²', xc - 10, ys + hp / 2 + 18, { align: 'right', color: C.warn, weight: 650, size: 12 });
        }
        kit.label(c, '1 m²', xc + 10, ys, { color: q === 'irradiance' ? C.warn : C.faint, size: 11.5 });
        // the source
        c.fillStyle = C.surface; c.strokeStyle = q === 'radiance' ? C.warn : C.text; c.lineWidth = q === 'radiance' ? 3 : 1.5;
        c.beginPath(); c.rect(xs - 9, ys - hs / 2, 9, hs); c.fill(); c.stroke();
        if (q === 'radiance') {
          c.save(); c.beginPath(); c.rect(0, 0, W, H); c.clip();
          c.beginPath(); c.moveTo(xs, ys); c.lineTo(xc, ys - reach * Math.tan(5 * D2R)); c.lineTo(xc, ys + reach * Math.tan(5 * D2R)); c.closePath(); fillBeam(0.55);
          c.restore();
          kit.label(c, 'L: per m² of this face, per steradian', xs + reach * 0.35, ys - reach * 0.12 - 14, { color: C.warn, weight: 650, size: 12 });
        }
        kit.label(c, 'source, ' + num(V.A, 2) + ' cm²', xs - 9, ys + hs / 2 + 15, { color: C.muted, size: 11.5 });
        if (q === 'flux') kit.label(c, 'Φ', xs + reach * 0.5, ys - 8, { align: 'center', size: 20, weight: 700, color: C.text });
        S.dim(c, xs, H * 0.94, xc, H * 0.94, 'd = ' + fx(V.d, 1) + ' m', { off: -9 });
        kit.label(c, DEF[q][phot ? 1 : 0], 12, 16, { color: C.text, weight: 600, size: 12.5 });
        ro.set('Phi', phot ? num(Phi) + ' lm' : eng(Phi, 'W'));
        ro.set('Om', num(Om, 3) + ' sr');
        ro.set('I', phot ? num(I) + ' cd' : eng(I, 'W/sr'));
        ro.set('E', phot ? num(E) + ' lx' : eng(E, 'W/m²'));
        ro.set('L', phot ? num(L) + ' cd/m²' : eng(L, 'W/(m²·sr)'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the luminosity function */
  Hyper.sim('rp-luminosity', {
    title: 'The luminosity function: what each colour is worth in lumens',
    blurb: `The coloured area is the eye's bright-light sensitivity \`V(λ)\`, which is 1 at 555 nm. Multiply the optical power at a wavelength by \`V\` and by 683 lm/W and you have its lumens. Compare two single colours of equal power, or weigh the whole spectrum of a lamp.

**Try this**
- Leave the two colours at 532 nm and 650 nm, 5 mW each: the green gives about 3 lumens, the red about 0.4, so it looks eight times brighter for the same power.
- Slide a wavelength to 555 nm: 683 lm/W, the most any light can give. Go to 700 nm or 400 nm: almost nothing.
- Tick *night vision*: the dashed curve V′ peaks at 507 nm. The red nearly vanishes while the blue-green holds; that is the Purkinje shift at dusk.
- Choose *the whole spectrum of a lamp*. The filament radiates mostly where the eye does not look, and the sodium lamp puts almost all its power near the peak. Try the infrared LED: zero lumens from a real source.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const SRC = ['incandescent', 'halogen', 'sun', 'daylight', 'led-warm', 'led-neutral', 'led-cool', 'fluorescent', 'mercury', 'metal-halide', 'sodium-hp', 'sodium-lp', 'led-red', 'led-green', 'led-blue', 'laser-green', 'xenon', 'led-ir'].filter(id => Ph.SOURCES[id]);
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Compare', options: [['Two single wavelengths', 'mono'], ['The whole spectrum of a lamp', 'lamp']], value: params.view || 'mono' },
        { id: 'nm1', label: 'Light 1: wavelength', min: 380, max: 780, step: 1, value: params.nm1 || 532, unit: 'nm' },
        { id: 'nm2', label: 'Light 2: wavelength', min: 380, max: 780, step: 1, value: params.nm2 || 650, unit: 'nm' },
        { id: 'P', label: 'Power of each', min: 0.1, max: 100, value: params.P || 5, log: true, sig: 2, unit: 'mW' },
        { id: 'src', type: 'select', label: 'Lamp', options: SRC.map(id => [Ph.SOURCES[id].name, id]), value: params.src || 'incandescent' },
        { id: 'night', type: 'check', label: 'Add the night-vision curve V′', value: !!params.night }
      ], id => { if (id === 'view') sync(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['v1', 'Sensitivity V(λ) of light 1'], ['k1', 'Efficacy of light 1'], ['lm1', 'Light 1 gives'], ['v2', 'Sensitivity V(λ) of light 2'], ['k2', 'Efficacy of light 2'], ['lm2', 'Light 2 gives'], ['ratio', 'Light 1 looks'], ['night', 'Night, rods only'], ['ler', 'Lumens per radiated watt'], ['vis', 'Radiated power in 380–780 nm'], ['top', 'Compared with the 683 lm/W ceiling']]);
      const sync = () => {
        const mono = V.view === 'mono';
        for (const k of ['nm1', 'nm2', 'P']) ctl.show(k, mono);
        ctl.show('src', !mono);
        for (const k of ['v1', 'k1', 'lm1', 'v2', 'k2', 'lm2', 'ratio', 'night']) ro.show(k, mono);
        for (const k of ['ler', 'vis', 'top']) ro.show(k, !mono);
      };
      sync();
      const cache = {};
      function lampStats(id) {
        if (cache[id]) return cache[id];
        const f = Ph.spectrum(id);
        let tot = 0, vis = 0, vw = 0, mx = 0;
        for (let nm = 250; nm <= 3000; nm += 2) { const s = f(nm); tot += s; if (nm >= 380 && nm <= 780) { vis += s; vw += s * Ph.V(nm); if (s > mx) mx = s; } }
        return (cache[id] = { ler: tot > 0 ? 683 * vw / tot : 0, vis: tot > 0 ? vis / tot : 0, mx: mx || 1 });
      }
      const times = (a, b) => {
        if (a < 1e-6 && b < 1e-6) return 'both invisible';
        if (b < 1e-6) return 'visible; light 2 is invisible';
        if (a < 1e-6) return 'invisible; light 2 is visible';
        const r = a >= b ? a / b : b / a;
        return fx(r, r < 10 ? 1 : 0) + ' × ' + (a >= b ? 'brighter' : 'dimmer') + ' than light 2';
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const mono = V.view === 'mono';
        const x0 = 50, x1 = W - 18, yb = H - 62, yt = 34, span = yb - yt;
        const X = nm => x0 + (nm - 380) / 400 * (x1 - x0), Y = v => yb - v * span;
        // axes, grid
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (const v of [0.25, 0.5, 0.75, 1]) { c.beginPath(); c.moveTo(x0, Y(v)); c.lineTo(x1, Y(v)); c.stroke(); }
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x0, yt - 6); c.lineTo(x0, yb); c.lineTo(x1, yb); c.stroke();
        for (const v of [0, 0.5, 1]) kit.label(c, String(v), x0 - 6, Y(v), { align: 'right', color: C.muted, size: 11 });
        for (let nm = 400; nm <= 750; nm += 50) { kit.label(c, String(nm), X(nm), yb + 12, { align: 'center', color: C.muted, size: 11 }); c.beginPath(); c.moveTo(X(nm), yb); c.lineTo(X(nm), yb + 3); c.stroke(); }
        kit.label(c, 'wavelength (nm)', x1, yb + 48, { align: 'right', color: C.muted, size: 11.5 });
        kit.label(c, mono ? 'sensitivity of the eye' : 'power (relative) and how much of it the eye counts', x0, yt - 18, { color: C.muted, size: 11.5 });
        kit.label(c, '683 lm/W', x1, Y(1) - 9, { align: 'right', color: C.faint, size: 11 });
        S.spectrum(c, x0, yb + 20, x1 - x0, 9, 380, 780);
        // the area under V, in the colours of the spectrum
        let stats = null, mx = 1, f = null;
        if (!mono) { stats = lampStats(V.src); mx = stats.mx; f = Ph.spectrum(V.src); }
        for (let px = x0; px < x1; px += 2) {
          const nm = 380 + (px - x0) / (x1 - x0) * 400, v = Ph.V(nm);
          if (mono) { c.fillStyle = S.nm(nm, 0.62); c.fillRect(px, Y(v), 2.6, yb - Y(v)); }
          else { c.fillStyle = S.nm(nm, 0.16); c.fillRect(px, Y(v), 2.6, yb - Y(v)); const s = Math.min(1.05, f(nm) / mx) * v; c.fillStyle = S.nm(nm, 0.9); c.fillRect(px, Y(s), 2.6, yb - Y(s)); }
        }
        // V and V′ as lines
        c.lineWidth = 1.8; c.strokeStyle = C.text; c.beginPath();
        for (let nm = 380; nm <= 780; nm += 4) { const px = X(nm), py = Y(Ph.V(nm)); if (nm === 380) c.moveTo(px, py); else c.lineTo(px, py); }
        c.stroke();
        kit.label(c, 'V(λ), by day', X(600), Y(Ph.V(600)) - 20, { color: C.text, size: 12, weight: 650 });
        if (V.night || false) {
          c.save(); c.setLineDash([6, 4]); c.lineWidth = 2; c.strokeStyle = C.accent; c.beginPath();
          for (let nm = 380; nm <= 780; nm += 4) { const px = X(nm), py = Y(Ph.Vscotopic(nm)); if (nm === 380) c.moveTo(px, py); else c.lineTo(px, py); }
          c.stroke(); c.restore();
          kit.label(c, 'V′(λ), by night (peak 507 nm)', X(470), Y(0.99) - 10, { align: 'right', color: C.accent, size: 12, weight: 650 });
        }
        if (mono) {
          const rows = [[V.nm1, C.text, 1], [V.nm2, C.warn, 2]];
          for (const [nm, col, n] of rows) {
            const px = X(nm), v = Ph.V(nm);
            c.save(); c.setLineDash([4, 4]); c.strokeStyle = col; c.lineWidth = 1.3; c.beginPath(); c.moveTo(px, yb); c.lineTo(px, Y(v)); c.stroke(); c.restore();
            kit.dot(c, px, Y(v), 5.5, S.nm(nm, 1), col);
            kit.label(c, n + '  ' + nm + ' nm', clamp(px, x0 + 30, x1 - 30), Math.max(yt + 4, Y(v) - 16 - (n === 2 ? 14 : 0)), { align: 'center', color: col, size: 12, weight: 650 });
          }
          const v1 = Ph.V(V.nm1), v2 = Ph.V(V.nm2), P = V.P * 1e-3;
          ro.set('v1', fx(v1, 3)); ro.set('v2', fx(v2, 3));
          ro.set('k1', fx(683 * v1, 0) + ' lm/W'); ro.set('k2', fx(683 * v2, 0) + ' lm/W');
          ro.set('lm1', num(683 * v1 * P, 3) + ' lm'); ro.set('lm2', num(683 * v2 * P, 3) + ' lm');
          ro.set('ratio', times(v1, v2));
          ro.set('night', 'light 1 is ' + times(Ph.Vscotopic(V.nm1), Ph.Vscotopic(V.nm2)).replace(' than light 2', ' than 2'));
        } else {
          c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath();
          for (let nm = 380; nm <= 780; nm += 4) { const px = X(nm), py = Y(Math.min(1.05, f(nm) / mx)); if (nm === 380) c.moveTo(px, py); else c.lineTo(px, py); }
          c.stroke();
          kit.label(c, 'lamp spectrum (relative power)', x1, Y(0.97), { align: 'right', color: C.warn, size: 12, weight: 650 });
          kit.label(c, 'bright columns: the part the eye counts', x1, Y(0.97) + 17, { align: 'right', color: C.muted, size: 11.5 });
          ro.set('ler', fx(stats.ler, stats.ler < 10 ? 1 : 0) + ' lm per radiated W');
          ro.set('vis', fx(100 * stats.vis, 0) + ' % of the power from 250 to 3000 nm');
          ro.set('top', fx(100 * stats.ler / 683, stats.ler < 68 ? 1 : 0) + ' %');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ lumens, candelas, lux, nits */
  Hyper.sim('rp-units', {
    title: 'Lumens, candelas, lux and nits for one lamp',
    blurb: `Choose a source, or set your own lumens, beam angle, distance and size. The four boxes give the four answers for the same light: **lumens** (all of it), **candelas** (per steradian along the axis), **lux** (what lands on a card facing the lamp at the distance you set) and **nits** (how bright the source looks, its candelas per square metre of its face). The polar diagram shows how the candelas are spread over the directions.

**Try this**
- Start with the *800 lm bulb*: all round, so only 64 cd and 16 lx at 2 m. Then the *torch*: fewer lumens, yet 3 100 cd and 126 lx at 5 m. Squeeze the *half-angle* of the bulb to 10° and watch the candelas and the lux jump together while the lumens stay put.
- Double the distance: the lux falls to a quarter, the lumens, candelas and nits do not move.
- Enlarge the *area of the source*: the nits fall, because the same candelas now come from more area.
- Tick *Lambertian*: the lobe becomes a circle tangent to the face, and the axial candelas are only Φ/π, as for a screen.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 340 });
      const SCEN = {
        candle: { name: 'A candle', phi: 12.6, half: 180, lamb: false, d: 0.5, A: 1.2 },
        bulb: { name: 'A frosted bulb, 800 lm', phi: 800, half: 180, lamb: false, d: 2, A: 28.3 },
        torch: { name: 'A torch, 300 lm in a 10° beam', phi: 300, half: 10, lamb: false, d: 5, A: 12.6 },
        desk: { name: 'A desk lamp, 500 lm in a 45° beam', phi: 500, half: 45, lamb: false, d: 0.5, A: 50 },
        screen: { name: 'A 15-inch laptop screen, 300 nit', phi: 63, half: 90, lamb: true, d: 0.5, A: 670 }
      };
      const s0 = SCEN[params.scen] || SCEN.bulb;
      const ctl = kit.controls(box.side, [
        { id: 'scen', type: 'select', label: 'Source', options: [['A candle', 'candle'], ['A frosted bulb, 800 lm', 'bulb'], ['A torch, 300 lm, 10° beam', 'torch'], ['A desk lamp, 500 lm, 45° beam', 'desk'], ['A laptop screen, 300 nit', 'screen'], ['Your own', 'own']], value: SCEN[params.scen] ? params.scen : 'bulb' },
        { id: 'phi', label: 'Luminous flux', min: 1, max: 10000, value: s0.phi, log: true, sig: 3, unit: 'lm' },
        { id: 'half', label: 'Half-angle of the beam', min: 5, max: 180, step: 1, value: s0.half, unit: '°' },
        { id: 'lamb', type: 'check', label: 'Lambertian (the cosine pattern into a hemisphere)', value: s0.lamb },
        { id: 'd', label: 'Distance to the card', min: 0.2, max: 20, value: s0.d, log: true, sig: 2, unit: 'm' },
        { id: 'A', label: 'Area of the emitting face', min: 1, max: 1000, value: s0.A, log: true, sig: 3, unit: 'cm²' }
      ], (id, v) => {
        if (id === 'scen' && SCEN[v]) { const s = SCEN[v]; ctl.set('phi', s.phi); ctl.set('half', s.half); ctl.set('lamb', s.lamb); ctl.set('d', s.d); ctl.set('A', s.A); sync(); }
        else if (id !== 'scen') ctl.set('scen', 'own');
        if (id === 'lamb') sync();
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['Om', 'Solid angle of the light'], ['I', 'Candelas on the axis'], ['E', 'Lux on the card'], ['L', 'Nits of the face']]);
      const sync = () => ctl.show('half', !V.lamb);
      sync();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const Om = V.lamb ? PI : Ph.solidAngle(V.half * D2R);
        const I = V.lamb ? V.phi / PI : Ph.candelaFromLumens(V.phi, V.half * D2R), E = Ph.illuminance(I, V.d, 0), L = I / (V.A * 1e-4);
        // the chain of four boxes
        const gap = clamp(W * 0.05, 20, 38), bw = (W - 24 - 3 * gap) / 4, bh = 92, y0 = 14;
        const items = [
          ['LUMENS', num(V.phi) + ' lm', 'how much light?'],
          ['CANDELAS', num(I) + ' cd', 'how focused?'],
          ['LUX', num(E) + ' lx', 'how much lands?'],
          ['NITS', num(L) + ' cd/m²', 'how bright?']
        ];
        const ns = clamp(bw * 0.2, 12, 20);
        items.forEach((it, i) => {
          const x = 12 + i * (bw + gap);
          rrect(c, x, y0, bw, bh, 9); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.border2 || C.axis; c.lineWidth = 1.3; c.stroke();
          kit.label(c, it[0], x + bw / 2, y0 + 15, { align: 'center', color: C.muted, size: clamp(bw * 0.14, 10, 12), weight: 650 });
          kit.label(c, it[1], x + bw / 2, y0 + 44, { align: 'center', color: C.text, size: ns, weight: 700 });
          kit.label(c, it[2], x + bw / 2, y0 + 75, { align: 'center', color: C.faint, size: clamp(bw * 0.13, 9.5, 11.5) });
        });
        const arrowAt = (i, txt) => { const xa = 12 + i * (bw + gap) + bw + 3, xb = xa + gap - 6, ya = y0 + 44; kit.arrow(c, xa, ya, xb, ya, C.accent, 2); kit.label(c, txt, (xa + xb) / 2, ya - 13, { align: 'center', color: C.accent, size: 10.5, weight: 650 }); };
        arrowAt(0, '÷ Ω'); arrowAt(1, '÷ d²');
        // from candelas to nits: over the lux box
        const xa = 12 + 1 * (bw + gap) + bw / 2, xb = 12 + 3 * (bw + gap) + bw / 2;
        c.strokeStyle = C.accent; c.lineWidth = 1.6; c.beginPath(); c.moveTo(xa, y0 + bh + 1); c.lineTo(xa, y0 + bh + 14); c.lineTo(xb, y0 + bh + 14); c.lineTo(xb, y0 + bh + 3); c.stroke();
        kit.arrow(c, xb, y0 + bh + 14, xb, y0 + bh + 2, C.accent, 1.6, 7);
        kit.label(c, '÷ area of the face', (xa + xb) / 2, y0 + bh + 27, { align: 'center', color: C.accent, size: 10.5, weight: 650 });
        // the polar diagram of the intensity
        const top = y0 + bh + 44, cy = top + (H - top - 22) / 2, R = Math.min((H - top - 40) / 2, W * 0.26), cx = W * 0.42;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (const k of [1, 0.5]) { c.beginPath(); c.arc(cx, cy, R * k, 0, 2 * PI); c.stroke(); }
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(cx - R * 1.15, cy); c.lineTo(cx + R * 1.25, cy); c.stroke();
        c.beginPath(); c.moveTo(cx, cy - R * 1.1); c.lineTo(cx, cy + R * 1.1); c.stroke();
        const rr = a => V.lamb ? (Math.abs(a) <= PI / 2 ? R * Math.cos(a) : 0) : (Math.abs(a) <= V.half * D2R + 1e-9 ? R : 0);
        c.beginPath(); c.moveTo(cx, cy);
        for (let a = -PI; a <= PI + 1e-9; a += PI / 90) { const r = rr(a); c.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); }
        c.closePath(); c.save(); c.globalAlpha = 0.3; c.fillStyle = C.warn; c.fill(); c.restore();
        c.strokeStyle = C.warn; c.lineWidth = 2; c.stroke();
        S.source(c, cx, cy, { kind: 'point', size: 12 });
        kit.label(c, num(I) + ' cd', cx + R + 4, cy - 12, { color: C.warn, size: 12, weight: 650 });
        kit.label(c, num(I / 2) + ' cd', cx + R / 2 + 4, cy + 12, { color: C.faint, size: 10.5 });
        kit.label(c, 'candelas, in every direction (a slice)', cx, cy + R + 22, { align: 'center', color: C.muted, size: 11.5 });
        // the card
        const xk = cx + R + 96;
        if (xk < W - 40) {
          c.fillStyle = C.muted; c.fillRect(xk, cy - 34, 4, 68);
          kit.label(c, 'card at ' + fx(V.d, V.d < 10 ? 1 : 0) + ' m', xk + 2, cy - 46, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, num(E) + ' lx', xk + 2, cy + 48, { align: 'center', color: C.accent, size: 12, weight: 650 });
        }
        ro.set('Om', V.lamb ? 'π sr (a hemisphere, weighted by cos θ)' : fx(Om, 3) + ' sr' + (V.half >= 179.5 ? ' (all round)' : ''));
        ro.set('I', num(I) + ' cd' + (V.lamb ? ' (I₀ = Φ/π)' : ''));
        ro.set('E', num(E) + ' lx' + (V.d < 5 * 2 * Math.sqrt(V.A * 1e-4 / PI) ? ' (point-source value, a little high so close)' : ''));
        ro.set('L', num(L) + ' cd/m²');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ inverse square and cosine */
  Hyper.sim('rp-inverse-square', {
    title: 'The inverse-square law and the cosine law',
    blurb: `**Distance.** A lamp lights three square windows, each twice and three times as far as the first. The windows are as many times wider, so the same flux spreads over 1, 4 and 9 times the area and the illuminance falls to 1, 1/4 and 1/9. Give the lamp a size and the law starts to fail when you are close.

**Angle.** Switch to the floor view: a lamp hangs over a floor, and a small patch can be dragged along it and tilted. The illuminance falls both because the patch is farther from the lamp and because the light meets it at a slant.

**Try this**
- In *distance*, raise the *diameter of the lamp* to 50 cm with the first window at 0.5 m: the nearest window is 20 % darker than the inverse-square law says, the far ones hardly differ.
- In *angle*, drag the patch out to 6 m, the height of the lamp: the light arrives at 45° and the floor is at 35 % of its value below the lamp (cos³ 45°).
- Tilt the patch towards the lamp until it faces it: the cosine factor goes to 1, and only the distance is left.
- Raise the lamp: the pool of light widens and fades, since the floor gets farther away.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['Distance: the inverse-square law', 'squares'], ['Angle: a lamp over a floor', 'floor']], value: params.view || 'squares' },
        { id: 'I', label: 'Luminous intensity of the lamp', min: 10, max: 10000, value: params.I || 1000, log: true, sig: 3, unit: 'cd' },
        { id: 'd1', label: 'First window at', min: 0.5, max: 3, step: 0.1, value: params.d1 || 1, unit: 'm' },
        { id: 'D', label: 'Diameter of the lamp', min: 0, max: 100, step: 1, value: params.D || 0, unit: 'cm' },
        { id: 'h', label: 'Height of the lamp', min: 2, max: 10, step: 0.5, value: params.h || 6, unit: 'm' },
        { id: 'x', label: 'Patch: distance along the floor', min: 0, max: 10, step: 0.1, value: params.x != null ? params.x : 6, unit: 'm' },
        { id: 'tilt', label: 'Tilt of the patch towards the lamp', min: 0, max: 90, step: 1, value: params.tilt || 0, unit: '°' }
      ], id => { if (id === 'view') sync(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['e1', 'Illuminance at the 1st window'], ['e2', 'at the 2nd (2 × as far)'], ['e3', 'at the 3rd (3 × as far)'], ['fl', 'Flux through each window'], ['err', 'Error of the plain inverse-square law'],
        ['r', 'Distance to the patch'], ['ang', 'Angle of incidence on the patch'], ['E', 'Illuminance on the patch'], ['E0', 'Straight below the lamp'], ['ratio', 'Patch ÷ straight below']]);
      const sync = () => {
        const sq = V.view === 'squares';
        for (const k of ['d1', 'D']) ctl.show(k, sq);
        for (const k of ['h', 'x', 'tilt']) ctl.show(k, !sq);
        for (const k of ['e1', 'e2', 'e3', 'fl', 'err']) ro.show(k, sq);
        for (const k of ['r', 'ang', 'E', 'E0', 'ratio']) ro.show(k, !sq);
      };
      sync();
      // the floor view: scale and position of everything
      const fgeo = () => { const W = st.W, H = st.H, s = Math.min((W - 40) / 22, (H - 150) / (V.h + 0.6)), xl = W / 2, yf = H - 108; return { W, H, s, xl, yf, yl: yf - V.h * s }; };
      kit.drag(st, {
        hover: true,
        hit: p => { if (V.view !== 'floor') return null; const g = fgeo(); return Math.abs(p.x - (g.xl + V.x * g.s)) < 20 && Math.abs(p.y - g.yf) < 28 ? 'patch' : null; },
        move: (what, p) => { const g = fgeo(); ctl.set('x', Math.round(clamp((p.x - g.xl) / g.s, 0, 10) * 10) / 10); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        if (V.view === 'squares') {
          const x0 = 46, xr = W - 38, ys = H * 0.44, h1 = 0.19 * H, tanA = 1.5 * h1 / (xr - x0);
          const ppm = (xr - x0) / (3 * V.d1), a = V.D / 200;                    // the lamp's radius in metres
          // the cone and its rays
          c.beginPath(); c.moveTo(x0, ys); c.lineTo(xr, ys - 1.5 * h1); c.lineTo(xr, ys + 1.5 * h1); c.closePath(); c.save(); c.globalAlpha = 0.1; c.fillStyle = C.warn; c.fill(); c.restore();
          for (let k = -2; k <= 2; k++) S.ray(c, [[x0, ys], [xr, ys + k / 2 * 1.5 * h1]], { color: C.warn, width: 1, alpha: 0.5, arrows: false });
          const rl = clamp(a * ppm, 3.5, 36);
          c.beginPath(); c.arc(x0, ys, rl, 0, 2 * PI); c.fillStyle = C.warn; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1; c.stroke();
          kit.label(c, V.D > 0 ? 'lamp, ' + V.D + ' cm across' : 'point lamp', x0, ys - rl - 12, { align: 'left', color: C.muted, size: 11.5 });
          const Es = [], flux = V.I * 4 * tanA * tanA;
          for (let i = 1; i <= 3; i++) {
            const x = x0 + (xr - x0) * i / 3, di = i * V.d1, E = V.I / (di * di + a * a), Ei = V.I / (di * di);
            Es.push([E, Ei]);
            c.fillStyle = C.muted; c.fillRect(x - 2, ys - i * h1 / 2, 4, i * h1);
            kit.label(c, fx(di, 1) + ' m', x, ys - i * h1 / 2 - 11, { align: 'center', color: C.text, size: 12, weight: 600 });
            kit.label(c, 'area × ' + i * i, x, H - 54, { align: 'center', color: C.muted, size: 11.5 });
            kit.label(c, num(E) + ' lx', x, H - 36, { align: 'center', color: C.accent, size: 13, weight: 700 });
            if (V.D > 0) kit.label(c, fx(100 * (E / Ei - 1), 1) + ' % vs 1/d²', x, H - 18, { align: 'center', color: C.warn, size: 11 });
          }
          kit.label(c, 'the same flux crosses every window: ' + num(flux) + ' lm', W / 2, 16, { align: 'center', color: C.muted, size: 12.5 });
          ro.set('e1', num(Es[0][0]) + ' lx'); ro.set('e2', num(Es[1][0]) + ' lx'); ro.set('e3', num(Es[2][0]) + ' lx');
          ro.set('fl', num(flux) + ' lm (a window of the cone)');
          ro.set('err', V.D > 0 ? fx(100 * (Es[0][0] / Es[0][1] - 1), 1) + ' %, ' + fx(100 * (Es[1][0] / Es[1][1] - 1), 1) + ' %, ' + fx(100 * (Es[2][0] / Es[2][1] - 1), 1) + ' %' : 'none: a point source');
        } else {
          const g = fgeo(), s = g.s, xl = g.xl, yf = g.yf, yl = g.yl, h = V.h;
          // the floor, the lamp, a few faint rays
          c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(14, yf); c.lineTo(W - 14, yf); c.stroke();
          for (let k = -9; k <= 9; k += 3) S.ray(c, [[xl, yl], [xl + k * s, yf]], { color: C.warn, width: 1, alpha: 0.16, arrows: false });
          S.source(c, xl, yl - 6, { kind: 'bulb', size: 18 });
          S.dim(c, xl - 26, yl, xl - 26, yf, 'h = ' + fx(h, 1) + ' m', { off: -8 });
          // the illuminance along the floor, hanging below it
          const yb = yf + 80, amp = 62, E0 = V.I / (h * h);
          c.beginPath(); c.moveTo(xl - 10 * s, yb);
          for (let x = -10; x <= 10.001; x += 0.25) c.lineTo(xl + x * s, yb - amp * (h * h * h / Math.pow(h * h + x * x, 1.5)));
          c.lineTo(xl + 10 * s, yb); c.closePath(); c.save(); c.globalAlpha = 0.28; c.fillStyle = C.warn; c.fill(); c.restore();
          c.strokeStyle = C.warn; c.lineWidth = 1.8; c.beginPath();
          for (let x = -10; x <= 10.001; x += 0.25) { const px = xl + x * s, py = yb - amp * (h * h * h / Math.pow(h * h + x * x, 1.5)); if (x === -10) c.moveTo(px, py); else c.lineTo(px, py); }
          c.stroke();
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(14, yb); c.lineTo(W - 14, yb); c.stroke();
          kit.label(c, 'illuminance along the floor (cos³θ below the lamp)', 16, yb + 14, { color: C.muted, size: 11.5 });
          // the patch
          const px = xl + V.x * s, r = Math.hypot(V.x, h), th = Math.atan2(V.x, h), tau = V.tilt * D2R, inc = Math.abs(th - tau);
          const nx = -Math.sin(tau), ny = -Math.cos(tau), tx = Math.cos(tau), ty = -Math.sin(tau);
          S.ray(c, [[xl, yl], [px, yf]], { color: C.warn, width: 2, alpha: 0.95, arrows: true, minArrow: 40 });
          c.strokeStyle = C.accent; c.lineWidth = 5; c.beginPath(); c.moveTo(px - 13 * tx, yf - 13 * ty); c.lineTo(px + 13 * tx, yf + 13 * ty); c.stroke();
          S.ray(c, [[px, yf], [px + 38 * nx, yf + 38 * ny]], { color: C.faint, width: 1, dash: [4, 3], arrows: false });
          if (V.x > 0.05) S.angle(c, xl, yl, 38, PI / 2, Math.atan2(h, V.x), 'θ', { size: 12.5 });
          if (inc > 0.02) S.angle(c, px, yf, 30, Math.atan2(ny, nx), Math.atan2(yl - yf, xl - px), 'i', { size: 12.5, gap: 10 });
          kit.label(c, 'drag the patch', px, yf + 24, { align: 'center', color: C.muted, size: 11 });
          const E = inc < PI / 2 ? Ph.illuminance(V.I, r, inc) : 0;
          kit.dot(c, px, yb - amp * (h * h * h / Math.pow(h * h + V.x * V.x, 1.5)), 4.5, C.accent);
          ro.set('r', fx(r, 2) + ' m');
          ro.set('ang', fx(inc * R2D, 1) + '°  (direction θ = ' + fx(th * R2D, 1) + '°, tilt ' + V.tilt + '°)');
          ro.set('E', num(E) + ' lx');
          ro.set('E0', num(E0) + ' lx');
          ro.set('ratio', fx(100 * E / E0, 1) + ' %' + (V.tilt === 0 ? '  (cos³θ = ' + fx(100 * Math.pow(Math.cos(th), 3), 1) + ' %)' : ''));
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ Lambertian surfaces */
  Hyper.sim('rp-lambert', {
    title: 'A Lambertian surface: equal brightness from every direction',
    blurb: `Light of illuminance **E** falls on a matt patch of reflectance **ρ**. The polar diagram shows how many candelas the patch sends towards each direction. For an ideal diffuser the curve is a circle, the intensity falling as cos φ, yet the patch looks equally bright from every side, because it also looks smaller by cos φ. The two panels on the right show the patch as seen from the viewing angle.

**Try this**
- Drag the viewer round the arc, or use the angle slider. The intensity falls to half at 60°, the apparent area falls to half, and the luminance, **L = ρE/π**, does not move.
- Raise the gloss: a bright lobe appears in the mirror direction (40° on the other side of the normal) and the surface flares when you look into it, which a matt surface never does. The gloss lobe is schematic.
- Double the illuminance or the reflectance: the luminance doubles. With ρ = 0.8 and 500 lx you get 127 cd/m², about a paper page.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'gloss', label: 'Gloss (0 = ideal matt)', min: 0, max: 1, step: 0.05, value: params.gloss || 0 },
        { id: 'phi', label: 'Viewing angle from the normal', min: -85, max: 85, step: 1, value: params.phi != null ? params.phi : 40, unit: '°' },
        { id: 'E', label: 'Illuminance on the patch', min: 10, max: 100000, value: params.E || 500, log: true, sig: 3, unit: 'lx' },
        { id: 'rho', label: 'Reflectance ρ', min: 0.05, max: 0.95, step: 0.01, value: params.rho || 0.8 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['L', 'Luminance of the matt part, ρE/π'], ['M', 'Exitance of the matt part, πL'], ['proj', 'Apparent area of 1 m² from here, cos φ'], ['I', 'Intensity per m² towards the viewer'], ['Lv', 'Luminance seen from this angle']]);
      const PS = 40, SIG = 9, BOOST = 25;                                       // the mirror direction, the width of the gloss lobe, its height
      const rel = (phi, g) => (1 - g) + g * BOOST * Math.exp(-0.5 * Math.pow((phi - PS) / SIG, 2));
      const geo = () => { const W = st.W, H = st.H, R = Math.min(0.27 * W, 0.62 * H); return { W, H, R, cx: 0.31 * W, cy: 0.80 * H }; };
      kit.drag(st, {
        hover: true,
        hit: p => { const g = geo(), a = V.phi * D2R, vx = g.cx + 1.22 * g.R * Math.sin(a), vy = g.cy - 1.22 * g.R * Math.cos(a); return Math.hypot(p.x - vx, p.y - vy) < 22 ? 'eye' : null; },
        move: (what, p) => { const g = geo(); ctl.set('phi', Math.round(clamp(Math.atan2(p.x - g.cx, g.cy - p.y) * R2D, -85, 85))); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), g = geo(), W = g.W, H = g.H, cx = g.cx, cy = g.cy;
        const Lm = Ph.luminanceOfSurface(V.E, V.rho), phi = V.phi, ph = phi * D2R, gl = V.gloss;
        // the largest intensity of this surface, so that the plot fits
        let mx = 1; for (let a = -90; a <= 90; a += 1) mx = Math.max(mx, rel(a, gl) * Math.cos(a * D2R));
        const sc = g.R / mx, R = g.R;
        // the surface and the incoming light
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(cx - 1.3 * R, cy); c.lineTo(cx + 1.3 * R, cy); c.stroke();
        c.strokeStyle = C.grid; c.lineWidth = 1; for (const k of [0.5, 1]) { c.beginPath(); c.arc(cx, cy, R * k, PI, 2 * PI); c.stroke(); }
        S.normal(c, cx, cy, -PI / 2, R * 1.15);
        S.ray(c, [[cx - 1.25 * R * Math.sin(PS * D2R), cy - 1.25 * R * Math.cos(PS * D2R)], [cx, cy]], { color: C.warn, width: 2.4, arrows: true, minArrow: 30 });
        kit.label(c, 'light', cx - 1.25 * R * Math.sin(PS * D2R) - 4, cy - 1.25 * R * Math.cos(PS * D2R) - 8, { align: 'right', color: C.warn, size: 12, weight: 650 });
        // the Lambertian circle for reference, and the surface's own curve
        c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.faint; c.lineWidth = 1.4; c.beginPath();
        for (let a = -90; a <= 90; a += 2) { const r = sc * Math.cos(a * D2R), x = cx + r * Math.sin(a * D2R), y = cy - r * Math.cos(a * D2R); if (a === -90) c.moveTo(x, y); else c.lineTo(x, y); }
        c.stroke(); c.restore();
        c.beginPath(); c.moveTo(cx, cy);
        for (let a = -90; a <= 90; a += 1) { const r = sc * rel(a, gl) * Math.cos(a * D2R); c.lineTo(cx + r * Math.sin(a * D2R), cy - r * Math.cos(a * D2R)); }
        c.closePath(); c.save(); c.globalAlpha = 0.3; c.fillStyle = C.accent; c.fill(); c.restore();
        c.strokeStyle = C.accent; c.lineWidth = 2; c.stroke();
        kit.label(c, 'candelas per m², in each direction', cx, cy + 20, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, gl > 0 ? 'dashed: the ideal matt circle' : 'a circle: I = I₀ cos φ', cx, cy + 36, { align: 'center', color: C.faint, size: 11 });
        // the viewer
        const vr = sc * rel(phi, gl) * Math.cos(ph), vx = cx + 1.22 * R * Math.sin(ph), vy = cy - 1.22 * R * Math.cos(ph);
        c.save(); c.setLineDash([3, 4]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(cx, cy); c.lineTo(vx, vy); c.stroke(); c.restore();
        kit.dot(c, cx + vr * Math.sin(ph), cy - vr * Math.cos(ph), 4.5, C.accent, C.text);
        kit.dot(c, vx, vy, 8, C.accent, C.text);
        kit.label(c, 'viewer', vx + (phi >= 0 ? 12 : -12), vy - 4, { align: phi >= 0 ? 'left' : 'right', color: C.text, size: 11.5, weight: 650 });
        S.angle(c, cx, cy, 0.55 * R, -PI / 2, -PI / 2 + ph, 'φ', { size: 12.5 });
        // the patch, as seen from the viewing angle
        const xr = 0.66 * W, wr = W - xr - 14, r0 = Math.min(0.2 * wr, 0.14 * H) + 6, cosp = Math.cos(ph);
        const luma = L => { const v = Math.round(255 * Math.pow(clamp(L / (3 * Lm), 0, 1), 1 / 2.2)); return 'rgb(' + v + ',' + v + ',' + v + ')'; };
        const panel = (yc, L, title) => {
          const xc = xr + wr / 2;
          c.save(); c.setLineDash([3, 4]); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(xc, yc, r0, 0, 2 * PI); c.stroke(); c.restore();
          c.beginPath(); c.ellipse(xc, yc, Math.max(1, r0 * cosp), r0, 0, 0, 2 * PI); c.fillStyle = luma(L); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
          kit.label(c, title, xc, yc - r0 - 14, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, num(L, 3) + ' cd/m²', xc, yc + r0 + 14, { align: 'center', color: C.text, size: 12.5, weight: 650 });
        };
        panel(0.27 * H, Lm, 'ideal matt: the same from everywhere');
        panel(0.72 * H, Lm * rel(phi, gl), gl > 0 ? 'this glossy surface' : 'this surface (matt)');
        ro.set('L', num(Lm) + ' cd/m²');
        ro.set('M', num(Ph.lambertExitance(Lm)) + ' lm/m²');
        ro.set('proj', fx(cosp, 3));
        ro.set('I', num(Lm * rel(phi, gl) * cosp) + ' cd');
        ro.set('Lv', num(Lm * rel(phi, gl)) + ' cd/m²' + (gl === 0 ? '  (the same at every angle)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ radiance through a lens */
  Hyper.sim('rp-radiance', {
    title: 'A lens makes the image smaller, never brighter',
    blurb: `A lens collects the light of a small source patch (1 cm²) from a cone of half-angle θ and forms an image of it at magnification m. The image is **m² times the area**, and, since the same flux is spread over it, its **irradiance** is 1/m² times as large (up to a limit). But the **radiance** of the image, the brightness per unit area per unit solid angle, is always the source's, times the lens's transmittance. The bars at the bottom show it.

**Try this**
- Make the image smaller (*magnification* below 1): the illuminance on it rises and the cone of light converging on it grows wider, but the *radiance of the image* stays at T times the source's.
- Push the magnification down until the cone at the image becomes a full hemisphere (θ′ = 90°): the irradiance has reached its ceiling πLT and no lens, however good, can go beyond.
- Increase *collection half-angle*: more flux enters the lens and the image gets brighter (lux), but the radiance, and the étendue ratio between image and source, are unchanged.
- Choose the LED chip as the source: its luminance of 10 million nits is what the image shows, whatever the lens.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      const lum = name => { const r = Ph.LUMINANCES.find(q => q[0] === name); return r ? r[1] : 1e4; };
      const SRC = { screen: ['Phone or monitor screen', lum('Phone or monitor screen')], tube: ['Fluorescent tube', lum('Fluorescent tube')], led: ['LED chip', lum('LED die')], fil: ['Tungsten filament', lum('Tungsten filament')] };
      const ctl = kit.controls(box.side, [
        { id: 'src', type: 'select', label: 'The source', options: Object.keys(SRC).map(k => [SRC[k][0] + ', ' + num(SRC[k][1], 2) + ' cd/m²', k]), value: params.src || 'led' },
        { id: 'm', label: 'Magnification of the image', min: 0.05, max: 5, value: params.m || 0.5, log: true, sig: 2 },
        { id: 'th', label: 'Collection half-angle of the lens', min: 3, max: 35, step: 1, value: params.th || 15, unit: '°' },
        { id: 'T', label: 'Transmittance of the lens', min: 50, max: 100, step: 1, value: params.T || 90, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['L', 'Luminance of the source'], ['Li', 'Luminance of the image'], ['A', 'Area: source → image'], ['th', 'Cone half-angle: source side → image side'], ['G', 'Étendue: source → image'], ['Phi', 'Flux through the lens'], ['E', 'Illuminance of the image'], ['ceil', 'Ceiling for any lens, π L T']]);
      const A0 = 1e-4;                                                            // the source patch, 1 cm² in m²
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const L = SRC[V.src][1], T = V.T / 100, th = V.th * D2R, sth = Math.sin(th);
        const mEff = Math.max(V.m, sth), capped = V.m < sth - 1e-9;
        const sth2 = sth / mEff, th2 = Math.asin(Math.min(1, sth2));
        const G1 = Ph.etendue(A0, th, 1), A2 = mEff * mEff * A0, G2 = Ph.etendue(A2, th2, 1), Phi = L * G1 * T, E2 = Phi / A2, Li = T * L;
        // drawing: the lens, the source on the left, the image on the right (inverted)
        const ya = H * 0.40, hlMax = 0.34 * H;
        let so = (W - 110) / (1 + mEff);
        if (so * Math.tan(th) > hlMax) so = hlMax / Math.tan(th);
        const si = mEff * so, hl = so * Math.tan(th), xo = 52 + Math.max(0, (W - 110 - so * (1 + mEff)) / 2), xl = xo + so, xi = xl + si;
        const hs = 0.07 * H;
        S.axis(c, 20, ya, W - 20);
        // the cones of light
        c.beginPath(); c.moveTo(xo, ya); c.lineTo(xl, ya - hl); c.lineTo(xl, ya + hl); c.closePath(); c.save(); c.globalAlpha = 0.14; c.fillStyle = C.warn; c.fill(); c.restore();
        c.beginPath(); c.moveTo(xi, ya); c.lineTo(xl, ya - hl); c.lineTo(xl, ya + hl); c.closePath(); c.save(); c.globalAlpha = 0.24; c.fillStyle = C.warn; c.fill(); c.restore();
        S.ray(c, [[xo, ya], [xl, ya - hl], [xi, ya]], { color: C.warn, width: 1.6, alpha: 0.9, arrows: false });
        S.ray(c, [[xo, ya], [xl, ya + hl], [xi, ya]], { color: C.warn, width: 1.6, alpha: 0.9, arrows: false });
        S.thinLens(c, xl, ya, hl + 6, 1, {});
        S.object(c, xo, ya, hs, { label: 'source' });
        S.object(c, xi, ya, -mEff * hs, { label: 'image', dash: true });
        S.angle(c, xo, ya, Math.min(44, so * 0.3), 0, -th, 'θ', { size: 12.5, gap: 10 });
        S.angle(c, xi, ya, Math.min(44, si * 0.3), PI, -PI + Math.atan(hl / Math.max(1, si)), 'θ′', { size: 12.5, gap: 10 });
        kit.label(c, 'A = 1 cm²', xo, ya + 34, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'A′ = ' + num(mEff * mEff, 3) + ' cm²', xi, ya + Math.min(0.5 * H, mEff * hs + 20), { align: 'center', color: C.muted, size: 11.5 });
        if (capped) kit.label(c, 'the cone at the image is already a full hemisphere: no lens can shrink the image further', W / 2, 18, { align: 'center', color: C.warn, size: 12, weight: 650 });
        // the two bars
        const bx = 26, bw = W * 0.5, by = H - 66;
        const bar = (y, f, col, label, val) => {
          c.fillStyle = C.surface; c.fillRect(bx, y, bw, 14); c.fillStyle = col; c.fillRect(bx, y, bw * clamp(f, 0, 1), 14); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(bx, y, bw, 14);
          kit.label(c, label, bx, y - 9, { color: C.muted, size: 11.5 });
          kit.label(c, val, bx + bw + 10, y + 7, { color: C.text, size: 12.5, weight: 650 });
        };
        bar(by, T, C.accent, 'radiance of the image ÷ radiance of the source', fx(100 * T, 0) + ' %  (= T)');
        bar(by + 38, T * sth2 * sth2, C.warn, 'irradiance of the image ÷ the ceiling π L', fx(100 * T * sth2 * sth2, 1) + ' %');
        ro.set('L', num(L) + ' cd/m²');
        ro.set('Li', num(Li) + ' cd/m²  (= T × source)');
        ro.set('A', '1 cm² → ' + num(A2 * 1e4, 3) + ' cm²');
        ro.set('th', fx(V.th, 1) + '° → ' + fx(th2 * R2D, 1) + '°');
        ro.set('G', num(G1 * 1e6, 3) + ' → ' + num(G2 * 1e6, 3) + ' mm²·sr');
        ro.set('Phi', num(Phi) + ' lm');
        ro.set('E', num(E2) + ' lx');
        ro.set('ceil', num(PI * L * T) + ' lx (θ′ = 90°)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ étendue */
  Hyper.sim('rp-etendue', {
    title: 'Étendue: how much of a source a system can take in',
    blurb: `A source has an étendue **G = π A sin²θ** (its area times its cone of directions) and so has the system that has to take its light: a fibre, a light guide, a projector panel behind its lens. A lens can trade size for angle but cannot reduce the product, so the most that can be coupled is the **ratio of the étendues**. The curve shows the share of the light coupled in against the magnification of the coupling lens; the pictures show the two reasons for loss, the image overfilling the *area* of the target, and the light arriving outside its *acceptance angle*.

**Try this**
- LED chip into the 50 µm fibre: the ceiling is about 0.01 %. Press *best magnification*: you get the plateau of the curve, and no lens can lift it.
- The same chip into the 3 mm light guide: the curve reaches 100 %, over a range of magnifications.
- The laser into the 50 µm fibre: its étendue is about a ten-millionth of the chip's, and all of it can go in.
- Move the magnification by hand and watch the two pictures: too small and the light arrives at too wide an angle, too large and the image is bigger than the core.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const laserSin = O.beam.divergence(0.5e-3, 532, 1.1);
      const SRCS = {
        led: ['LED chip, 1 mm², Lambertian', 1, 1],
        small: ['Small LED chip, 0.25 mm², Lambertian', 0.25, 1],
        fil: ['Halogen filament, 6 mm², all round', 6, 1],
        laser: ['Laser beam, 1 mm wide, M² = 1.1', 0.785, laserSin]
      };
      const TGTS = {
        f50: ['Fibre, 50 µm core, NA 0.22', 1.963e-3, 0.22],
        f200: ['Fibre, 200 µm core, NA 0.22', 0.0314, 0.22],
        pof: ['Plastic fibre, 1 mm core, NA 0.5', 0.785, 0.5],
        lg: ['Liquid light guide, 3 mm, NA 0.55', 7.07, 0.55],
        panel: ['Projector panel 0.7 inch, f/2.4 lens', 135, 0.208]
      };
      const ctl = kit.controls(box.side, [
        { id: 'src', type: 'select', label: 'The source', options: Object.keys(SRCS).map(k => [SRCS[k][0], k]), value: params.src || 'led' },
        { id: 'tgt', type: 'select', label: 'The system that must take its light', options: Object.keys(TGTS).map(k => [TGTS[k][0], k]), value: params.tgt || 'f50' },
        { id: 'm', label: 'Magnification of the coupling lens', min: 0.01, max: 100, value: params.m || 1, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'best', label: 'Set the best magnification', primary: true }] }
      ], id => { if (id === 'best') ctl.set('m', clamp(mBest(), 0.01, 100)); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['Gs', 'Étendue of the source'], ['Gt', 'Étendue of the target'], ['eta', 'Best possible coupling, G target ÷ G source'], ['mr', 'Magnifications that reach it'], ['eff', 'Coupled at your magnification'], ['why', 'What limits it']]);
      const pr = () => { const s = SRCS[V.src], t = TGTS[V.tgt]; return { As: s[1], ss: s[2], At: t[1], nt: t[2] }; };
      const mLo = p => p.ss / p.nt, mHi = p => Math.sqrt(p.At / p.As);
      const mBest = () => { const p = pr(); return Math.sqrt(mLo(p) * mHi(p)); };
      const eta = (p, m) => Math.min(1, p.At / (m * m * p.As)) * Math.min(1, Math.pow(p.nt * m / p.ss, 2));
      const plot = kit.plot(gb, { x: { label: 'magnification of the coupling lens', min: 0.01, max: 100, log: true }, y: { label: 'share of the light coupled in', min: 1e-8, max: 1.5, log: true, fmt: v => v >= 0.05 ? Math.round(v * 100) + ' %' : v.toExponential(0) } }, 190);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, p = pr(), m = V.m;
        const Gs = Ph.etendue(p.As, Math.asin(Math.min(1, p.ss)), 1), Gt = Ph.etendue(p.At, Math.asin(Math.min(1, p.nt)), 1), ceil = Math.min(1, Gt / Gs), e = eta(p, m);
        const imgR = m * Math.sqrt(p.As / p.At), tdeg = Math.asin(Math.min(1, p.nt)) * R2D, adeg = Math.asin(Math.min(1, p.ss / m)) * R2D;
        const hw = W / 2, cy = H * 0.54;
        // left: the areas at the target
        const Rt = Math.min(hw * 0.26, H * 0.28), cx1 = hw * 0.5;
        const Ri = Rt * clamp(imgR, 0.03, 2.6);
        c.beginPath(); c.arc(cx1, cy, Ri, 0, 2 * PI); c.save(); c.globalAlpha = 0.34; c.fillStyle = C.warn; c.fill(); c.restore();
        c.strokeStyle = C.warn; c.lineWidth = 1.6; c.stroke();
        c.beginPath(); c.arc(cx1, cy, Rt, 0, 2 * PI); c.strokeStyle = C.ok; c.lineWidth = 3; c.stroke();
        kit.label(c, 'AREA at the target', cx1, 18, { align: 'center', color: C.muted, size: 12, weight: 650 });
        kit.label(c, 'target: ' + num(p.At, 2) + ' mm²', cx1, cy + Rt + 18, { align: 'center', color: C.ok, size: 11.5, weight: 650 });
        kit.label(c, imgR >= 1 ? 'the image is ' + num(imgR, 2) + ' × too wide' : 'the image fills ' + num(100 * imgR * imgR, 2) + ' % of the area', cx1, cy + Rt + 36, { align: 'center', color: imgR >= 1 ? C.warn : C.text, size: 11.5, weight: 650 });
        if (clamp(imgR, 0.03, 2.6) !== imgR) kit.label(c, '(not to scale)', cx1, cy + Rt + 52, { align: 'center', color: C.faint, size: 10.5 });
        // right: the angles at the target
        const ox = hw + hw * 0.16, Rf = Math.min(hw * 0.62, H * 0.40);
        const wedge = (deg, col, fillA, lw) => { const a = deg * D2R; c.beginPath(); c.moveTo(ox, cy); c.arc(ox, cy, Rf, -a, a); c.closePath(); if (fillA) { c.save(); c.globalAlpha = fillA; c.fillStyle = col; c.fill(); c.restore(); } c.strokeStyle = col; c.lineWidth = lw; c.stroke(); };
        wedge(adeg, C.warn, 0.34, 1.6);
        wedge(tdeg, C.ok, 0, 3);
        kit.label(c, 'ANGLES at the target', ox + hw * 0.3, 18, { align: 'center', color: C.muted, size: 12, weight: 650 });
        kit.label(c, 'accepts ± ' + num(tdeg, 3) + '°', ox + Rf * 0.5, cy + Rf * 0.72 + 14, { align: 'center', color: C.ok, size: 11.5, weight: 650 });
        kit.label(c, 'light arrives ± ' + num(adeg, 3) + '°', ox + Rf * 0.5, cy + Rf * 0.72 + 32, { align: 'center', color: C.warn, size: 11.5, weight: 650 });
        // the curve
        const pts = [];
        for (let i = 0; i <= 120; i++) { const mm = Math.pow(10, -2 + 4 * i / 120); pts.push([mm, Math.max(1e-9, eta(p, mm))]); }
        plot.set({ series: [{ pts, color: C.series[0], width: 2.4 }], marks: [{ x: m, y: Math.max(1e-9, e), label: 'you', color: C.warn }], hlines: [{ y: ceil, label: 'ceiling G target ÷ G source', color: C.faint }] });
        const lo = mLo(p), hi = mHi(p), aLim = m * m * p.As > p.At * (1 + 1e-9), nLim = p.ss / m > p.nt * (1 + 1e-9);
        ro.set('Gs', num(Gs, 3) + ' mm²·sr');
        ro.set('Gt', num(Gt, 3) + ' mm²·sr');
        ro.set('eta', Gt >= Gs ? '100 %: the target can take it all' : num(100 * ceil, 3) + ' %');
        ro.set('mr', Gt >= Gs ? num(lo, 2) + ' to ' + num(hi, 2) : num(hi, 2) + ' to ' + num(lo, 2) + ' (the plateau)');
        ro.set('eff', num(100 * e, 3) + ' %');
        ro.set('why', aLim && nLim ? 'both: too wide and too steep' : aLim ? 'the image overfills the area' : nLim ? 'the light is too steep for the target' : 'nothing at this magnification');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the integrating sphere */
  Hyper.sim('rp-sphere', {
    title: 'An integrating sphere: photons bounce until the wall is evenly lit',
    blurb: `A lamp inside a sphere sends photons off in all directions. Each time one strikes the white wall it is either absorbed (with probability 1 − ρ), lost through a port, or scattered again in a random direction. The coloured rim shows how often each stretch of wall is struck; as the photons accumulate it evens out. The average number of wall strikes per photon is 1/(1 − ρ(1 − f)), and the **sphere multiplier** is M = ρ/(1 − ρ(1 − f)), ρ times that. This is a flat slice of a sphere, so the counted numbers agree with the formulas only roughly, within about ten per cent.

**Try this**
- Start with ρ = 0.95 and 4 % ports: each photon strikes the wall about 11 times. Raise ρ to 0.99: about 20 times, and the multiplier nearly doubles. Lower it to 0.8: about four.
- Increase the ports to 10 %: the photons leave sooner, the multiplier falls.
- Untick the *baffle*: photons now go straight from the lamp to the detector port and the signal depends on where the lamp is. The baffle is what makes the reading a measure of the total flux.
- Press *restart count* after changing something, to start the averages afresh.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'rho', label: 'Reflectance of the wall ρ', min: 0.5, max: 0.995, step: 0.005, value: params.rho || 0.95 },
        { id: 'f', label: 'Ports, as a share of the wall', min: 0.5, max: 10, step: 0.5, value: params.f || 4, unit: '%' },
        { id: 'R', label: 'Radius of the sphere', min: 5, max: 50, step: 1, value: 15, unit: 'cm' },
        { id: 'phi', label: 'Luminous flux of the lamp', min: 10, max: 10000, value: 1000, log: true, sig: 3, unit: 'lm' },
        { id: 'baffle', type: 'check', label: 'Baffle between the lamp and the detector', value: true },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart the count', primary: true }] }
      ], id => { if (id === 'restart' || id === 'rho' || id === 'f' || id === 'baffle') reset(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['M', 'Sphere multiplier M (formula)'], ['nf', 'Wall strikes per photon, formula'], ['nm', 'Wall strikes per photon, counted'], ['det', 'Photons leaving by the detector port'], ['abs', 'Photons absorbed by the wall'], ['E', 'Wall illuminance from scattered light'], ['L', 'Luminance of the wall']]);
      const NB = 72, NMAX = 70, SPEED = 2.4, SX = -0.32, BX = 0.30, BY = 0.30;
      let parts = [], bins = new Array(NB).fill(0), ended = 0, strikes = 0, det = 0, absorbed = 0, lost = 0;
      function reset() { parts = []; bins = new Array(NB).fill(0); ended = 0; strikes = 0; det = 0; absorbed = 0; lost = 0; }
      const alpha = () => PI * (V.f / 100) / 2;                                    // half-width of each of the two ports
      const spawn = () => { const a = Math.random() * 2 * PI; parts.push({ x: SX, y: 0, dx: Math.cos(a), dy: Math.sin(a), n: 0 }); };
      function advance(dt) {
        const dist0 = SPEED * dt, rho = V.rho, al = alpha();
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          let dist = dist0, alive = true, guard = 0;
          while (alive && dist > 1e-9 && guard++ < 40) {
            const b = p.x * p.dx + p.y * p.dy, cc = p.x * p.x + p.y * p.y - 1, disc = b * b - cc;
            let t = disc > 0 ? -b + Math.sqrt(disc) : 0, hit = 'wall';
            if (V.baffle && Math.abs(p.dx) > 1e-9) { const tb = (BX - p.x) / p.dx; if (tb > 1e-7 && tb < t && Math.abs(p.y + tb * p.dy) <= BY) { t = tb; hit = 'baffle'; } }
            if (t > dist) { p.x += p.dx * dist; p.y += p.dy * dist; dist = 0; break; }
            p.x += p.dx * t; p.y += p.dy * t; dist -= t;
            if (hit === 'wall') {
              const psi = Math.atan2(p.y, p.x);
              p.n++;
              bins[Math.min(NB - 1, Math.floor((psi + PI) / (2 * PI) * NB))]++;
              if (Math.abs(psi) <= al) { det++; alive = false; }
              else if (PI - Math.abs(psi) <= al) { lost++; alive = false; }
              else if (Math.random() < rho) { const a = psi + PI + (Math.random() - 0.5) * PI; p.dx = Math.cos(a); p.dy = Math.sin(a); p.x = Math.cos(psi) * 0.9999; p.y = Math.sin(psi) * 0.9999; }
              else { absorbed++; alive = false; }
            } else if (Math.random() < rho) {
              const side = p.dx > 0 ? -1 : 1, a = (side > 0 ? 0 : PI) + (Math.random() - 0.5) * PI;
              p.dx = Math.cos(a); p.dy = Math.sin(a); p.x = BX + side * 1e-4;
            } else { absorbed++; alive = false; }
          }
          if (!alive) { parts.splice(i, 1); ended++; strikes += p.n; }
        }
      }
      const loop = kit.loop((dt) => {
        if (dt > 0) { advance(dt); for (let k = 0; k < 6 && parts.length < NMAX; k++) spawn(); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const Rp = Math.min(W * 0.46, H * 0.44), cx = W / 2, cy = H * 0.5, al = alpha();
        const X = x => cx + x * Rp, Y = y => cy + y * Rp;
        c.beginPath(); c.arc(cx, cy, Rp, 0, 2 * PI); c.fillStyle = C.surface; c.fill();
        // how often each stretch of wall has been struck
        let tot = 0; for (const b of bins) tot += b;
        const avg = tot / NB;
        c.lineWidth = 11; c.lineCap = 'butt';
        for (let i = 0; i < NB; i++) {
          const a0 = -PI + i * 2 * PI / NB, a1 = a0 + 2 * PI / NB + 0.01, v = avg > 0 ? bins[i] / avg : 0;
          c.save(); c.globalAlpha = clamp(0.1 + 0.3 * v, 0, 0.92); c.strokeStyle = C.warn; c.beginPath(); c.arc(cx, cy, Rp - 6, a0, a1); c.stroke(); c.restore();
        }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, Rp, 0, 2 * PI); c.stroke();
        // the ports
        c.lineWidth = 9; c.strokeStyle = C.ok; c.beginPath(); c.arc(cx, cy, Rp, -al, al); c.stroke();
        c.strokeStyle = C.accent; c.beginPath(); c.arc(cx, cy, Rp, PI - al, PI + al); c.stroke();
        kit.label(c, 'detector port', X(1) + 12, cy, { color: C.ok, size: 11.5, weight: 650 });
        kit.label(c, 'entrance port', X(-1) - 12, cy, { align: 'right', color: C.accent, size: 11.5, weight: 650 });
        // the baffle and the lamp
        if (V.baffle) { c.strokeStyle = C.text; c.lineWidth = 4; c.beginPath(); c.moveTo(X(BX), Y(-BY)); c.lineTo(X(BX), Y(BY)); c.stroke(); kit.label(c, 'baffle', X(BX) + 8, Y(-BY) - 8, { color: C.muted, size: 11.5 }); }
        S.source(c, X(SX), Y(SX * 0) - 4, { kind: 'bulb', size: 14 });
        kit.label(c, 'lamp', X(SX), Y(0) + 24, { align: 'center', color: C.muted, size: 11.5 });
        // the photons
        c.lineCap = 'round';
        for (const p of parts) {
          c.strokeStyle = C.warn; c.lineWidth = 1.4; c.globalAlpha = 0.55; c.beginPath(); c.moveTo(X(p.x - p.dx * 0.07), Y(p.y - p.dy * 0.07)); c.lineTo(X(p.x), Y(p.y)); c.stroke(); c.globalAlpha = 1;
          kit.dot(c, X(p.x), Y(p.y), 2.3, C.warn);
        }
        const rho = V.rho, f = V.f / 100, M = rho / (1 - rho * (1 - f)), nf = 1 / (1 - rho * (1 - f)), A = 4 * PI * Math.pow(V.R / 100, 2);
        const E = V.phi * M / A;
        kit.label(c, ended + ' photons counted', 12, 16, { color: C.muted, size: 11.5 });
        ro.set('M', fx(M, 1));
        ro.set('nf', fx(nf, 1));
        ro.set('nm', ended > 20 ? fx(strikes / ended, 1) : 'counting…');
        ro.set('det', ended > 20 ? fx(100 * det / ended, 1) + ' %' + (V.baffle ? '' : ' (the lamp is seen directly)') : 'counting…');
        ro.set('abs', ended > 20 ? fx(100 * absorbed / ended, 1) + ' %' : 'counting…');
        ro.set('E', num(E) + ' lx');
        ro.set('L', num(rho * E / PI) + ' cd/m²');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
      loop.once();
    }
  });

  /* ================================================================ what a lux meter must get right */
  Hyper.sim('rp-meters', {
    title: 'What a lux meter must get right: colour and direction',
    blurb: `**Colour.** A bare silicon photodiode responds to light very differently from the eye: it peaks in the near infrared (blue dashed curve, a typical shape), while \`V(λ)\` (the filled curve) peaks in the green. Calibrate it under one lamp and it reads wrongly under another. The bars show, for each source, what the bare cell reads as a share of the true lux; a meter with a V(λ) filter reads 100 % under all of them.

**Direction.** A light meter must give half the reading for light at 60° from its axis, the cosine law. A flat window reflects more and more of the light as the angle grows (Fresnel), so it under-reads. The diffuser dome of a real meter corrects this.

**Try this**
- Calibrate under a *tungsten lamp* and read an LED or daylight: the bare cell reads far too low, because the tungsten lamp pours out the infrared that silicon sees and the eye does not. Recalibrate under *daylight*: now the tungsten lamp reads too high.
- Choose the *infrared LED*: a true 0 lx, and a bare cell that still reads something.
- In the *direction* view, drag the light round: at 80° the bare window reads about two-thirds of what the cosine law demands.
The silicon response and the window are schematic, typical in shape, not those of a particular meter.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const SRC = ['incandescent', 'halogen', 'sun', 'daylight', 'led-warm', 'led-neutral', 'led-cool', 'fluorescent', 'sodium-lp', 'led-red', 'led-green', 'led-blue', 'led-ir'].filter(id => Ph.SOURCES[id]);
      const SHORT = { 'incandescent': 'tungsten 2700 K', 'halogen': 'halogen', 'sun': 'sunlight', 'daylight': 'daylight 6500 K', 'led-warm': 'warm white LED', 'led-neutral': 'neutral white LED', 'led-cool': 'cool white LED', 'fluorescent': 'fluorescent tube', 'sodium-lp': 'low-pressure sodium', 'led-red': 'red LED', 'led-green': 'green LED', 'led-blue': 'blue LED', 'led-ir': 'infrared LED' };
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['Colour: the response of the detector', 'spectrum'], ['Direction: the cosine response', 'angle']], value: params.view || 'spectrum' },
        { id: 'src', type: 'select', label: 'Light source', options: SRC.map(id => [Ph.SOURCES[id].name, id]), value: params.src || 'led-neutral' },
        { id: 'cal', type: 'select', label: 'The bare cell was calibrated under', options: [['a tungsten lamp, 2700 K', 'incandescent'], ['daylight, 6500 K', 'daylight'], ['a neutral white LED', 'led-neutral']], value: params.cal || 'incandescent' },
        { id: 'ang', label: 'Angle of the light from the axis', min: 0, max: 89, step: 1, value: params.ang != null ? params.ang : 60, unit: '°' }
      ], id => { if (id === 'view') sync(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['true', 'True illuminance (for 1 W/m² of light)'], ['corr', 'A meter corrected to V(λ) reads'], ['bare', 'The bare silicon cell reads'], ['err', 'Error of the bare cell'],
        ['ideal', 'Cosine law: reading ÷ the head-on reading'], ['win', 'Bare flat window'], ['werr', 'Error of the bare window'], ['f2', 'Worst error up to 80°']]);
      const sync = () => {
        const sp = V.view === 'spectrum';
        ctl.show('src', sp); ctl.show('cal', sp); ctl.show('ang', !sp);
        for (const k of ['true', 'corr', 'bare', 'err']) ro.show(k, sp);
        for (const k of ['ideal', 'win', 'werr', 'f2']) ro.show(k, !sp);
      };
      sync();
      // a schematic bare silicon photodiode: quantum efficiency about 0.9 from 520 to 880 nm, falling off at both ends; R = QE·λ/1240 in A/W
      const ss = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
      const Rsi = nm => 0.88 * ss(340, 520, nm) * (1 - ss(880, 1110, nm)) * nm / 1240;
      const RMAX = 0.64;
      const cache = {};
      function stats(id) {
        if (cache[id]) return cache[id];
        const f = Ph.spectrum(id);
        let tot = 0, sv = 0, sr = 0, mx = 0;
        for (let nm = 250; nm <= 3000; nm += 5) { const s = f(nm); tot += s; sv += s * Ph.V(nm); if (nm <= 1150) sr += s * Rsi(nm); }
        for (let nm = 300; nm <= 1150; nm += 5) mx = Math.max(mx, f(nm));
        return (cache[id] = { sv: sv / tot, sr: sr / tot, mx: mx || 1 });
      }
      const cosT = th => O.fresnel(1, 1.5, th).T;
      kit.drag(st, {
        hover: true,
        hit: p => { if (V.view !== 'angle') return null; const g = ageo(), a = V.ang * D2R; return Math.hypot(p.x - (g.sx - g.r * Math.sin(a)), p.y - (g.sy - g.r * Math.cos(a))) < 20 ? 'ray' : null; },
        move: (what, p) => { const g = ageo(); ctl.set('ang', Math.round(clamp(Math.atan2(g.sx - p.x, g.sy - p.y) * R2D, 0, 89))); loop.once(); }
      });
      const ageo = () => { const W = st.W, H = st.H; return { sx: W * 0.19, sy: H * 0.78, r: Math.min(W * 0.17, H * 0.55) }; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        if (V.view === 'spectrum') {
          const x0 = 48, x1 = W - 16, yt = 30, yb = H * 0.50, span = yb - yt, n0 = 300, n1 = 1150;
          const X = nm => x0 + (nm - n0) / (n1 - n0) * (x1 - x0), Y = v => yb - v * span;
          const s = stats(V.src), f = Ph.spectrum(V.src);
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yt - 6); c.lineTo(x0, yb); c.lineTo(x1, yb); c.stroke();
          for (let nm = 400; nm <= 1100; nm += 100) { kit.label(c, String(nm), X(nm), yb + 12, { align: 'center', color: C.muted, size: 11 }); }
          kit.label(c, 'wavelength (nm)', x1, yb + 26, { align: 'right', color: C.muted, size: 11 });
          for (let px = x0; px < x1; px += 2) { const nm = n0 + (px - x0) / (x1 - x0) * (n1 - n0), v = Ph.V(nm); if (v > 0.001) { c.fillStyle = S.nm(nm, 0.6); c.fillRect(px, Y(v), 2.6, yb - Y(v)); } }
          c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath();
          for (let nm = n0; nm <= n1; nm += 5) { const px = X(nm), py = Y(Ph.V(nm)); if (nm === n0) c.moveTo(px, py); else c.lineTo(px, py); }
          c.stroke();
          c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath();
          for (let nm = n0; nm <= n1; nm += 5) { const px = X(nm), py = Y(Rsi(nm) / RMAX); if (nm === n0) c.moveTo(px, py); else c.lineTo(px, py); }
          c.stroke(); c.restore();
          c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath();
          for (let nm = n0; nm <= n1; nm += 5) { const px = X(nm), py = Y(Math.min(1.1, f(nm) / s.mx) * 0.95); if (nm === n0) c.moveTo(px, py); else c.lineTo(px, py); }
          c.stroke();
          kit.label(c, 'V(λ), the eye', X(555), Y(1) - 10, { align: 'center', color: C.text, size: 11.5, weight: 650 });
          kit.label(c, 'bare silicon cell', X(930), Y(0.98) - 10, { align: 'center', color: C.accent, size: 11.5, weight: 650 });
          kit.label(c, 'the light source (relative power)', x1, yt - 12, { align: 'right', color: C.warn, size: 11.5, weight: 650 });
          // the bars: what a bare cell reads, as a share of the true lux, on a log scale from 3 % to 1000 %
          const bx0 = 134, bx1 = W - 70, by0 = H * 0.50 + 46, rowH = Math.min(15, (H - by0 - 12) / 12), cal = stats(V.cal), k = 683 * cal.sv / cal.sr;
          const BX = pc => bx0 + (Math.log10(clamp(pc, 3, 1000)) - Math.log10(3)) / (Math.log10(1000) - Math.log10(3)) * (bx1 - bx0);
          kit.label(c, 'bare cell: reading ÷ true lux (log scale)', bx0, by0 - 14, { color: C.muted, size: 11.5, weight: 650 });
          for (const pc of [10, 100, 1000]) { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(BX(pc), by0 - 4); c.lineTo(BX(pc), by0 + rowH * 12); c.stroke(); kit.label(c, pc + ' %', BX(pc), by0 + rowH * 12 + 9, { align: 'center', color: C.faint, size: 10.5 }); }
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(BX(100), by0 - 4); c.lineTo(BX(100), by0 + rowH * 12); c.stroke();
          let row = 0;
          for (const id of SRC) {
            if (id === 'led-ir') continue;
            const t = stats(id), pc = 100 * k * t.sr / (683 * t.sv), y = by0 + row * rowH + rowH / 2, sel = id === V.src;
            c.fillStyle = sel ? C.accent : C.muted; c.globalAlpha = sel ? 0.95 : 0.5; const xa = Math.min(BX(100), BX(pc)), xb = Math.max(BX(100), BX(pc)); c.fillRect(xa, y - rowH * 0.34, Math.max(1.5, xb - xa), rowH * 0.68); c.globalAlpha = 1;
            kit.label(c, SHORT[id], bx0 - 8, y, { align: 'right', color: sel ? C.text : C.muted, size: 10.5, weight: sel ? 700 : 500 });
            kit.label(c, num(pc, 2) + ' %', xb + 5, y, { color: sel ? C.text : C.muted, size: 10.5 });
            row++;
          }
          const tr = 683 * s.sv, bare = k * s.sr;
          ro.set('true', tr < 1e-3 ? '0 lx: no visible light' : num(tr, 3) + ' lx');
          ro.set('corr', tr < 1e-3 ? '0 lx' : num(tr, 3) + ' lx (right by design)');
          ro.set('bare', num(bare, 3) + ' lx');
          ro.set('err', tr > 1e-3 ? fx(100 * (bare / tr - 1), 0) + ' %' : 'it reads light where there is none');
        } else {
          const g = ageo(), a = V.ang * D2R, sx = g.sx, sy = g.sy, r = g.r;
          // the sensor and the ray
          c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.rect(sx - 38, sy, 76, 10); c.fill(); c.stroke();
          c.fillStyle = C.accent; c.fillRect(sx - 30, sy - 3, 60, 4);
          S.normal(c, sx, sy, -PI / 2, 0.8 * r);
          for (const dx of [-24, 0, 24]) S.ray(c, [[sx + dx - r * Math.sin(a), sy - r * Math.cos(a)], [sx + dx, sy - 2]], { color: C.warn, width: 1.7, alpha: 0.9, arrows: dx === 0, minArrow: 30 });
          kit.dot(c, sx - r * Math.sin(a), sy - r * Math.cos(a), 8, C.warn, C.text);
          kit.label(c, 'drag', sx - r * Math.sin(a) - 14, sy - r * Math.cos(a) - 14, { align: 'center', color: C.muted, size: 11 });
          S.angle(c, sx, sy, 0.45 * r, -PI / 2, -PI / 2 - a, 'θ', { size: 12.5 });
          kit.label(c, 'sensor, light from ' + V.ang + '° off the axis', sx, sy + 32, { align: 'center', color: C.muted, size: 11.5 });
          // the plot of the response against the angle
          const px0 = W * 0.42, px1 = W - 18, py0 = H - 62, py1 = 36, X = d => px0 + d / 90 * (px1 - px0), Y = v => py0 - v * (py0 - py1);
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(px0, py1 - 6); c.lineTo(px0, py0); c.lineTo(px1, py0); c.stroke();
          for (let d = 0; d <= 90; d += 15) { kit.label(c, d + '°', X(d), py0 + 12, { align: 'center', color: C.muted, size: 11 }); }
          for (const v of [0, 0.5, 1]) kit.label(c, String(v), px0 - 6, Y(v), { align: 'right', color: C.muted, size: 11 });
          kit.label(c, 'angle of the light from the axis', px1, py0 + 30, { align: 'right', color: C.muted, size: 11.5 });
          kit.label(c, 'reading, relative to head-on', px0, py1 - 18, { color: C.muted, size: 11.5 });
          const t0 = cosT(0), win = d => Math.cos(d * D2R) * cosT(d * D2R) / t0;
          c.beginPath(); for (let d = 0; d <= 90; d += 2) { const X1 = X(d); if (d === 0) c.moveTo(X1, Y(Math.cos(d * D2R))); else c.lineTo(X1, Y(Math.cos(d * D2R))); }
          for (let d = 90; d >= 0; d -= 2) c.lineTo(X(d), Y(win(d)));
          c.closePath(); c.save(); c.globalAlpha = 0.22; c.fillStyle = C.bad; c.fill(); c.restore();
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); for (let d = 0; d <= 90; d += 2) { if (d === 0) c.moveTo(X(d), Y(Math.cos(d * D2R))); else c.lineTo(X(d), Y(Math.cos(d * D2R))); } c.stroke();
          c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath(); for (let d = 0; d <= 90; d += 2) { if (d === 0) c.moveTo(X(d), Y(win(d))); else c.lineTo(X(d), Y(win(d))); } c.stroke();
          kit.label(c, 'ideal: cos θ', X(28), Y(Math.cos(28 * D2R)) - 14, { align: 'left', color: C.text, size: 12, weight: 650 });
          kit.label(c, 'a bare flat window (glass, n = 1.5)', X(52), Y(win(52)) + 24, { align: 'left', color: C.accent, size: 12, weight: 650 });
          kit.dot(c, X(V.ang), Y(Math.cos(a)), 5, C.text); kit.dot(c, X(V.ang), Y(win(V.ang)), 5, C.accent);
          let worst = 0; for (let d = 0; d <= 80; d += 1) { const id = Math.cos(d * D2R); worst = Math.max(worst, Math.abs(win(d) / id - 1)); }
          const id = Math.cos(a), w = win(V.ang);
          ro.set('ideal', fx(id, 3));
          ro.set('win', fx(w, 3));
          ro.set('werr', fx(100 * (w / id - 1), 1) + ' %');
          ro.set('f2', fx(100 * worst, 0) + ' % low, at 80°');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ light levels */
  Hyper.sim('rp-levels', {
    title: 'Light levels from starlight to sunshine',
    blurb: `Two logarithmic rulers: the **illuminance** of typical places (above) and the **luminance** of typical sources and surfaces (below), each tick a factor of ten. Slide the illuminance and the reflectance of what you look at: the marker on the lower ruler is the luminance of that surface, \`L = ρE/π\`, and the coloured band under it shows which kind of vision works at that level. The read-out gives the pupil, the exposure value for a camera, and the number of stops from direct sunlight.

**Try this**
- Set 500 lx (an office): a grey card (0.18) is 29 cd/m², comfortably in the day (cone) range. Drop to 10 lx, a street: the card is 0.6 cd/m², in the dusk range.
- Go down to the full Moon at 0.25 lx: the white paper (ρ = 0.8) has 0.06 cd/m² and you are mesopic: colours fade.
- Direct sunlight at 100 000 lx: the card shows 5 700 cd/m², and the camera is at EV 15 at ISO 100, the *sunny-16* rule.
- Raise the camera's ISO: the exposure value rises with it, one stop for each doubling.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'E', label: 'Illuminance on the scene', min: 1e-4, max: 2e5, value: params.E || 500, log: true, sig: 3, unit: 'lx' },
        { id: 'rho', label: 'Reflectance of what you look at', min: 0.05, max: 0.95, step: 0.01, value: params.rho || 0.18 },
        { id: 'iso', type: 'select', label: 'Camera sensitivity', options: [['ISO 100', 100], ['ISO 400', 400], ['ISO 1600', 1600], ['ISO 6400', 6400]], value: params.iso || 100 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['E', 'Illuminance'], ['L', 'Luminance of the surface, ρE/π'], ['reg', 'Vision at this level'], ['pup', 'Pupil, typically'], ['ev', 'Exposure value, flat meter'], ['evr', 'Exposure value, spot meter on the surface'], ['stops', 'Below direct sunlight'], ['near', 'Closest to']]);
      const group = list => {
        const m = new Map();
        for (const [name, v] of list) m.set(v, (m.get(v) ? m.get(v) + ' / ' : '') + name);
        return Array.from(m, ([v, name]) => ({ v, name })).sort((a, b) => a.v - b.v);
      };
      const LV = group(Ph.LEVELS), LU = group(Ph.LUMINANCES);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const x0 = 30, x1 = W - 30, E = V.E, L = V.rho * E / PI;
        const lx = e => x0 + (Math.log10(e) + 4) / 9.6 * (x1 - x0), ln = l => x0 + (Math.log10(l) + 3.2) / 12.8 * (x1 - x0);
        const ruler = (y, X, lo, hi, items, unit, color) => {
          c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
          for (let e = Math.ceil(lo); e <= Math.floor(hi); e++) {
            const x = X(Math.pow(10, e)); c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 6); c.stroke();
            kit.label(c, '10' + String(e).split('').map(ch => SUP[ch]).join(''), x, y + 17, { align: 'center', color: C.faint, size: 10.5 });
          }
          kit.label(c, unit, x1, y + 32, { align: 'right', color: C.muted, size: 11.5, weight: 650 });
          items.forEach((it, i) => {
            const x = X(it.v), row = i % 4, ty = y - 20 - row * 17;
            c.strokeStyle = color; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x, y); c.lineTo(x, ty + 7); c.stroke();
            kit.dot(c, x, y, 3, color);
            const w = it.name.length * 5.6, xx = clamp(x, x0 + w / 2, x1 - w / 2);
            kit.label(c, it.name, xx, ty, { align: 'center', color: C.text, size: 11 });
          });
        };
        const y1 = H * 0.34, y2 = H * 0.77;
        ruler(y1, lx, -4, 5, LV, 'illuminance, lux', C.warn);
        ruler(y2, ln, -3, 9, LU, 'luminance, cd/m²', C.accent);
        // the regimes of vision on the luminance ruler
        const bands = [[-3.2, Math.log10(0.005), 'night: rods', C.series[5]], [Math.log10(0.005), Math.log10(5), 'dusk: both', C.series[2]], [Math.log10(5), 9.6, 'day: cones', C.series[4]]];
        for (const [a, b, name, col] of bands) {
          c.save(); c.globalAlpha = 0.4; c.fillStyle = col; c.fillRect(ln(Math.pow(10, a)), y2 + 40, ln(Math.pow(10, b)) - ln(Math.pow(10, a)), 11); c.restore();
          kit.label(c, name, (ln(Math.pow(10, a)) + ln(Math.pow(10, b))) / 2, y2 + 64, { align: 'center', color: C.muted, size: 11 });
        }
        // the markers and the link between them
        const xe = lx(E), xl = ln(L);
        c.save(); c.setLineDash([3, 4]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(xe, y1 + 8); c.lineTo(xl, y2 - 10); c.stroke(); c.restore();
        c.fillStyle = C.accent; c.strokeStyle = C.accent; c.lineWidth = 2.4;
        c.beginPath(); c.moveTo(xe, y1 - 80); c.lineTo(xe, y1 + 4); c.stroke(); kit.dot(c, xe, y1, 6.5, C.accent, C.text);
        c.beginPath(); c.moveTo(xl, y2 - 80); c.lineTo(xl, y2 + 4); c.stroke(); kit.dot(c, xl, y2, 6.5, C.accent, C.text);
        kit.label(c, num(E, 3) + ' lx', clamp(xe, x0 + 40, x1 - 40), y1 - 92, { align: 'center', color: C.accent, size: 13, weight: 700 });
        kit.label(c, num(L, 3) + ' cd/m²', clamp(xl, x0 + 50, x1 - 50), y2 - 92, { align: 'center', color: C.accent, size: 13, weight: 700 });
        // the read-out
        let near = LV[0];
        for (const it of LV) if (Math.abs(Math.log10(it.v / E)) < Math.abs(Math.log10(near.v / E))) near = it;
        const ev = Math.log2(E * V.iso / 250);
        ro.set('E', num(E, 3) + ' lx');
        ro.set('L', num(L, 3) + ' cd/m²');
        ro.set('reg', L > 5 ? 'photopic (cones, colour)' : L > 0.005 ? 'mesopic (cones and rods)' : 'scotopic (rods, no colour)');
        ro.set('pup', fx(O.eye.pupil(L), 1) + ' mm');
        ro.set('ev', fx(ev, 1) + ' at ISO ' + V.iso);
        ro.set('evr', fx(O.cam.evOfLuminance(L, V.iso), 1) + ' at ISO ' + V.iso);
        ro.set('stops', fx(Math.log2(100000 / E), 1) + ' stops');
        ro.set('near', near.name + ' (' + num(near.v, 3) + ' lx)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
