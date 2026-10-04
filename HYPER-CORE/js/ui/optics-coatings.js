/* HYPER-CORE · ui/optics-coatings.js — Tools → Coatings & glass (#/tools/coatings/<stack|fresnel|glass|filters>)
 *
 *   stack    the thin-film designer: a ready-made coating on a substrate, its reflectance and transmittance from 350 to
 *            1100 nm under the visible spectrum, the layers drawn to scale, the colour of the reflected light; angle of
 *            incidence, polarization and a thickness error move the curve
 *   fresnel  reflection at a bare surface against the angle of incidence: R (s), R (p) and their mean, Brewster's angle, the
 *            critical angle and total internal reflection, metals; a ray sketch drawn as bright as the rays are
 *   glass    the Abbe diagram of every glass, crystal and plastic of the engine; click one to see its dispersion curve
 *            and its data, and compare it with another
 *   filters  optical density of stacked neutral-density filters; long-pass, short-pass and band-pass interference
 *            filters, the colour of a lamp before and after them, and what tilting does to the edge
 *
 * The mathematics is kit.optics (optics.js, optics-wave.js: O.film, O.fresnel, O.MATERIALS; optics-vision.js: O.colour,
 * O.photo, O.od); the drawing is kit.osym; shared helpers are T.util (optictools.js). Local helpers: an adaptive spectrum
 * sampler for multilayers, the search for filter edges and band widths, the six-digit glass code (the engine's gives
 * seven digits for diamond and MgF2 and "Infinity" for the infrared crystals), and the plain graph frame.
 */
(function () {
  'use strict';
  const H = window.Hyper, ui = H.ui, U = H.util, esc = U.esc, K = H.kit, O = H.optics, S = H.osym;
  const T = H.opticsTools = H.opticsTools || {};
  const F = O.film, Cl = O.colour, Ph = O.photo, M = O.MATERIALS, clamp = O.clamp, f = T.util.f, D2R = Math.PI / 180, TAU = Math.PI * 2;
  const TABS = [['stack', 'Coating designer'], ['fresnel', 'Reflection at a surface'], ['glass', 'Glass map'], ['filters', 'Filters and optical density']];

  T.coatings = function (el, params, sub) {
    const t = T.util.subtabs(el, 'coatings', TABS, sub, 'Coatings are calculated layer by layer with the standard matrix method for thin films. The layers are lossless and have fixed indices, so real coatings differ in the details; metals absorb. Colours are computed from the CIE 1931 colour-matching functions and drawn in sRGB.');
    ({ stack, fresnel, glass, filters })[t.tab](t.body);
  };
  T.coatings.tabs = TABS.map(t => t[0]);

  /* ================================================================ small helpers */
  const colors = () => K.colors();
  const label = (c, s, x, y, o) => K.label(c, s, x, y, Object.assign({ size: 11.5, color: colors().muted }, o));
  const head = (el, s) => el.appendChild(ui.el('<h4 style="margin:10px 0 0;font-size:13.5px">' + s + '</h4>'));
  const rgbCss = rgb => 'rgb(' + rgb.map(v => Math.round(clamp(v, 0, 255))).join(',') + ')';
  const hex = rgb => '#' + rgb.map(v => ('0' + Math.round(clamp(v, 0, 255)).toString(16)).slice(-2)).join('').toUpperCase();
  const subs = s => String(s).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);                 // MgF2 -> MgF₂
  /* a share of the light as a percentage, with the decimals its size needs */
  const pc = v => { if (!Number.isFinite(v)) return '—'; const p = v * 100; return p < 0.0005 ? 'about 0 %' : (p >= 10 ? p.toFixed(1) : p >= 1 ? p.toFixed(2) : p.toFixed(3)) + ' %'; };
  const nmText = v => Number.isFinite(v) ? (v >= 100 ? v.toFixed(1) : v.toFixed(2)) + ' nm' : '—';
  function stroke(c, pts, col, w, dash) {
    if (pts.length < 2) return;
    c.save(); c.strokeStyle = col; c.lineWidth = w || 1; c.lineJoin = 'round'; c.setLineDash(dash || []); c.beginPath();
    pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore();
  }
  function rrect(c, x, y, w, h, r) { c.beginPath(); w = Math.max(1, w); h = Math.max(1, h); if (c.roundRect) c.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2)); else c.rect(x, y, w, h); }
  function swatch(c, x, y, w, h, rgb) { rrect(c, x, y, w, h, 6); c.fillStyle = rgb ? rgbCss(rgb) : 'rgba(128,128,128,.25)'; c.fill(); c.lineWidth = 1; c.strokeStyle = colors().axis; c.stroke(); }
  const vtext = (c, s, x, y, o) => { c.save(); c.translate(x, y); c.rotate(-Math.PI / 2); label(c, s, 0, 0, o); c.restore(); };
  /* round tick values between two numbers (either order) */
  function ticks(a, b, n) {
    const lo = Math.min(a, b), hi = Math.max(a, b), raw = (hi - lo) / Math.max(1, n);
    if (!(raw > 0)) return [lo];
    const p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p, st = (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p, out = [];
    for (let v = Math.ceil(lo / st - 1e-9) * st; v <= hi + st * 1e-9; v += st) out.push(Math.round(v / st) * st);
    return out;
  }
  const decimals = vals => { const st = vals.length > 1 ? Math.abs(vals[1] - vals[0]) : 1; return Math.max(0, Math.min(4, -Math.floor(Math.log10(st) + 1e-9))); };
  /* the frame of a graph on the stage: box b = { x0, y0, x1, y1 }, ranges xr and yr (either may run backwards);
     o: { xt, yt (tick values), xf, yf (tick text), under(X, Y) (painted before the grid), xdy (gap of the x labels) } -> { X, Y, iX, iY } */
  function frame(c, Cc, b, xr, yr, o) {
    o = o || {};
    const w = b.x1 - b.x0, h = b.y1 - b.y0, X = v => b.x0 + w * (v - xr[0]) / (xr[1] - xr[0]), Y = v => b.y1 - h * (v - yr[0]) / (yr[1] - yr[0]);
    c.fillStyle = Cc.surface; c.fillRect(b.x0, b.y0, w, h);
    if (o.under) o.under(X, Y);
    const xt = o.xt || ticks(xr[0], xr[1], Math.max(3, w / 80)), yt = o.yt || ticks(yr[0], yr[1], Math.max(3, h / 45));
    c.save(); c.strokeStyle = Cc.grid; c.lineWidth = 1; c.beginPath();
    for (const v of xt) { const x = Math.round(X(v)) + 0.5; c.moveTo(x, b.y0); c.lineTo(x, b.y1); }
    for (const v of yt) { const y = Math.round(Y(v)) + 0.5; c.moveTo(b.x0, y); c.lineTo(b.x1, y); }
    c.stroke(); c.restore();
    c.strokeStyle = Cc.axis; c.lineWidth = 1; c.strokeRect(b.x0 + 0.5, b.y0 + 0.5, w - 1, h - 1);
    const xd = decimals(xt), yd = decimals(yt), xf = o.xf || (v => v.toFixed(xd)), yf = o.yf || (v => v.toFixed(yd));
    for (const v of yt) label(c, yf(v), b.x0 - 6, Y(v), { align: 'right', size: 10.5 });
    for (const v of xt) label(c, xf(v), X(v), b.y1 + (o.xdy || 13), { align: 'center', size: 10.5 });
    return { X, Y, iX: px => xr[0] + (px - b.x0) / w * (xr[1] - xr[0]), iY: py => yr[0] + (b.y1 - py) / h * (yr[1] - yr[0]) };
  }
  /* the frame of a spectrum 350 – 1100 nm: the visible range tinted behind the curves and painted as a strip under the axis */
  const NM0 = 350, NM1 = 1100;
  function specFrame(c, Cc, b, yr, o) {
    o = Object.assign({}, o || {});
    o.xt = [400, 500, 600, 700, 800, 900, 1000, 1100]; o.xdy = 25;
    o.under = X => S.spectrum(c, X(380), b.y0, X(780) - X(380), b.y1 - b.y0, 380, 780, { weight: () => 0.14 });
    const m = frame(c, Cc, b, [NM0, NM1], yr, o);
    S.spectrum(c, m.X(380), b.y1 + 3, m.X(780) - m.X(380), 7, 380, 780);
    c.strokeStyle = Cc.axis; c.lineWidth = 1; c.strokeRect(m.X(380) + 0.5, b.y1 + 3.5, m.X(780) - m.X(380) - 1, 6);
    label(c, 'UV', m.X(380) - 5, b.y1 + 7, { align: 'right', size: 10 }); label(c, 'IR', m.X(780) + 5, b.y1 + 7, { size: 10 });
    return m;
  }

  /* a vertical line at wavelength nm on a spectrum frame, with a caption in one of the rows above the bottom edge */
  function vline(c, Cc, m, b, nm, col, dash, txt, row) {
    if (!(nm >= NM0 && nm <= NM1)) return;
    stroke(c, [[m.X(nm), b.y0], [m.X(nm), b.y1]], col, 1.2, dash);
    if (txt) label(c, txt, clamp(m.X(nm), b.x0 + 44, b.x1 - 44), b.y1 - 9 - row * 14, { align: 'center', size: 10.5, color: Cc.text, bg: Cc.surface });
  }

  /* ---------------------------------------------------------------- the spectrum of a stack */
  const POLKEY = { avg: ['R', 'T'], s: ['Rs', 'Ts'], p: ['Rp', 'Tp'] };
  const at = (def, nm, th) => { const r = F.stack(def, nm, th); return { nm, R: r.R, T: r.T, Rs: r.Rs, Rp: r.Rp, Ts: r.Ts, Tp: r.Tp }; };
  const jump = (a, b) => Math.max(Math.abs(a.R - b.R), Math.abs(a.T - b.T), Math.abs(a.Rs - b.Rs), Math.abs(a.Rp - b.Rp), Math.abs(a.Ts - b.Ts), Math.abs(a.Tp - b.Tp));
  /* a stack at about 180 wavelengths from 350 to 1100 nm, plus the wavelengths in `extra`; where a curve moves fast
     (a filter edge, a narrow line) the interval is halved, up to three times: -> [{ nm, R, T, Rs, Rp, Ts, Tp }] in order */
  function sample(def, th, extra) {
    const grid = [];
    for (let i = 0; i <= 180; i++) grid.push(NM0 + (NM1 - NM0) * i / 180);
    for (const e of extra || []) if (e > NM0 && e < NM1) grid.push(e);
    grid.sort((a, b) => a - b);
    let pts = grid.map(nm => at(def, nm, th));
    for (let pass = 0; pass < 3; pass++) {
      const out = [pts[0]];
      for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if (b.nm - a.nm > 0.2 && jump(a, b) > 0.1) out.push(at(def, (a.nm + b.nm) / 2, th)); out.push(b); }
      pts = out;
    }
    return pts;
  }
  /* one curve of a sample as a function of the wavelength (linear between the samples) */
  function interp(pts, key) {
    const n = pts.length;
    return nm => {
      if (nm <= pts[0].nm) return pts[0][key];
      if (nm >= pts[n - 1].nm) return pts[n - 1][key];
      let lo = 0, hi = n - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (pts[m].nm <= nm) lo = m; else hi = m; }
      const a = pts[lo], b = pts[hi];
      return a[key] + (b[key] - a[key]) * (nm - a.nm) / ((b.nm - a.nm) || 1);
    };
  }
  /* the wavelength between a and b where fn crosses level, by bisection */
  function cross(fn, a, b, level) {
    let fa = fn(a) - level;
    for (let i = 0; i < 30; i++) { const m = (a + b) / 2, fm = fn(m) - level; if ((fm >= 0) === (fa >= 0)) { a = m; fa = fm; } else b = m; }
    return (a + b) / 2;
  }
  const DCACHE = {};
  function design(id, nm0, ns) {                       // the two-layer V-coat is found by a search that takes about 80 ms: remember it
    const k = id + '|' + nm0 + '|' + ns;
    if (!DCACHE[k]) { if (Object.keys(DCACHE).length > 300) for (const q of Object.keys(DCACHE)) delete DCACHE[q]; DCACHE[k] = F.design(id, nm0, ns); }
    return DCACHE[k];
  }
  /* where a filter or mirror stack passes or reflects half of the light, found in the samples `pts` of that stack and then refined by bisection:
     the 50 % edge of a long-pass or short-pass (looked for from the far end, so that the ripples of the blocked band do not count), or the centre
     and width of a band-pass line or a mirror's band */
  const KINDS = { longpass: 'up', shortpass: 'down', bandpass: 'band', hr: 'mirror', hr4: 'mirror' };
  function analyse(def, pts, id, nm0, th, pol) {
    const kind = KINDS[id];
    if (!kind) return null;
    const pk = POLKEY[pol === 'both' ? 'avg' : pol], key = kind === 'mirror' ? pk[0] : pk[1], val = nm => F.stack(def, nm, th)[key], n = pts.length;
    if (kind === 'up' || kind === 'down') {
      const up = kind === 'up';
      if (!(pts[up ? n - 1 : 0][key] >= 0.5)) return { kind, none: true };
      for (let i = up ? n - 2 : 1; i >= 0 && i < n; i += up ? -1 : 1) if (pts[i][key] < 0.5) return { kind, edge: cross(val, pts[i].nm, pts[i + (up ? 1 : -1)].nm, 0.5) };
      return { kind, none: true };
    }
    const lo = Math.max(NM0, nm0 * 0.6), hi = Math.min(NM1, nm0 * 1.05);
    let best = null, at = -1;
    if (kind === 'mirror') {
      pts.forEach((p, i) => { if (p.nm >= lo && p.nm <= hi && (!best || p[key] > best.v)) { best = { nm: p.nm, v: p[key] }; at = i; } });
      if (!best || best.v < 0.5) return { kind, none: true };
    } else {
      // the line is the peak nearest to where tilting puts it (a quarter-wave stack behaves as if its index were about 1.8); the ripples beyond the stop band are far from it
      const aim = nm0 * Math.sqrt(1 - Math.pow(Math.sin(th) / 1.8, 2));
      for (let i = 1; i < n - 1; i++) {
        const p = pts[i];
        if (p.nm < lo || p.nm > hi || !(p[key] >= pts[i - 1][key] && p[key] > pts[i + 1][key]) || p[key] < 0.2) continue;
        if (!best || Math.abs(p.nm - aim) < Math.abs(best.nm - aim)) { best = { nm: p.nm, v: p[key] }; at = i; }
      }
      if (!best) return { kind, none: true };
      // the sampled top may miss the true top of a narrow line: look closer
      const d = Math.min(best.nm - pts[at - 1].nm, pts[at + 1].nm - best.nm) / 8;
      for (let k = -8; k <= 8; k++) { const v = val(best.nm + k * d); if (v > best.v) best = { nm: best.nm + k * d, v }; }
    }
    const half = kind === 'mirror' ? 0.5 : best.v / 2;
    let i0 = at, i1 = at;
    while (i0 > 0 && pts[i0][key] >= half) i0--;
    while (i1 < n - 1 && pts[i1][key] >= half) i1++;
    const open0 = pts[i0][key] >= half, open1 = pts[i1][key] >= half;
    const from = open0 ? NM0 : cross(val, pts[i0].nm, pts[Math.min(i0 + 1, n - 1)].nm, half), to = open1 ? NM1 : cross(val, pts[Math.max(i1 - 1, 0)].nm, pts[i1].nm, half);
    return { kind, lo: from, hi: to, centre: (from + to) / 2, width: to - from, peak: best.v, open: open0 || open1 };
  }
  function edgeText(a) {
    if (!a) return '— (not a filter or a mirror)';
    if (a.none) return a.kind === 'mirror' ? 'it does not reach 50 % at this angle' : 'no edge or line: it passes or blocks everything here';
    if (a.kind === 'up') return nmText(a.edge) + ' (50 % point; longer wavelengths pass)';
    if (a.kind === 'down') return nmText(a.edge) + ' (50 % point; shorter wavelengths pass)';
    if (a.kind === 'band') return 'centre ' + nmText(a.centre) + ', width (FWHM) ' + nmText(a.width);
    return 'reflects over ' + Math.round(a.lo) + ' – ' + Math.round(a.hi) + ' nm (centre ' + Math.round(a.centre) + ', width ' + Math.round(a.width) + ' nm)' + (a.open ? ', at least' : '');
  }

  /* ---------------------------------------------------------------- the colour of light reflected or passed */
  const DAY = Ph.spectrum('daylight');
  let WHITE = null;
  /* the colour of daylight after a surface of reflectance spec(nm): white-balanced so that a perfect mirror is white;
     `true` at the real brightness, `hue` brightened so that the tint can be seen -> { true, hue } as sRGB */
  function colourOf(spec) {
    WHITE = WHITE || Cl.toRgb(Cl.xyz(DAY, true));
    const lin = Cl.toRgb(Cl.xyz(nm => spec(nm) * DAY(nm), true)).map((v, i) => v / WHITE[i]);
    return { true: Cl.srgb(lin), hue: Cl.srgb(Cl.fit(lin, 1)) };
  }

  /* ================================================================ 1 · the coating designer */
  const SUBSTRATES = ['N-BK7', 'fused-silica', 'N-SF11', 'sapphire', 'PC', 'CaF2', 'germanium'].map(id => [M[id].name, id]);
  const AR = new Set(['uncoated', 'mgf2', 'vcoat', 'bbar', 'splitter30']);
  const EXPLAIN = {
    uncoated: 'With no coating each glass surface reflects about 4 % of the light that meets it head-on. That is the figure to beat: ten such surfaces in a lens lose about a third of the light, and the reflections bounce about inside as flare and ghost images.',
    mgf2: 'One layer a quarter of a wavelength thick. The light reflected from its top and from its bottom surface comes back half a wavelength apart, so the two cancel (destructive interference). The cancellation is not complete, because the index of the layer is not quite low enough, and the curve rises on either side of the design wavelength.',
    vcoat: 'Two layers whose thicknesses are chosen so that the reflections cancel exactly at one wavelength. The curve is a sharp V: perfect at the design wavelength and worse away from it. Laser optics use it because a laser has only one wavelength.',
    bbar: 'Three layers of three different indices, a quarter, a half and a quarter of a wavelength thick, make the reflections cancel across most of the visible spectrum. What is left is a faint purple or green tint, the sheen you see when you tilt a coated lens against a window.',
    hr: 'Alternating layers of high and low index, each a quarter wave thick. Every interface reflects a little, and all the reflections leave in step (constructive interference), so a few pairs reflect almost everything in a band around the design wavelength, while light outside the band passes. More pairs make the peak higher and the edges steeper; a larger index contrast makes the band wider.',
    hr4: 'The same mirror with only four pairs: the peak is lower and the edges are softer. Compare it with eight pairs to see how each added pair raises the reflectance.',
    bandpass: 'Two quarter-wave mirrors separated by a half-wave spacer make a cavity, as in a Fabry–Perot etalon. Light of just the right wavelength resonates in the cavity and passes; the rest of the band the mirrors reflect is turned back. Tilt it and the line moves towards the blue.',
    longpass: 'A stack of quarter-wave pairs reflects a band of short wavelengths; the long wavelengths beyond the edge pass. A simple stack like this also lets light through again far from the blocked band, which is why real filters add further groups of layers.',
    shortpass: 'The mirror image of the long-pass: the blocked band lies on the long-wavelength side of the edge. With the edge near 700 nm this is a hot mirror, which passes visible light and turns infrared heat back.',
    splitter: 'Three layers reflect a large share of the light at the design wavelength and pass the rest, with almost no absorption. Raise the angle of incidence to 45° and compare the s and p curves: they split very unevenly, which is why polarization matters for a beam splitter.',
    splitter30: 'One quarter-wave layer of a high-index material reflects about 30 % of the light over most of the visible. With no absorption, what is not reflected is transmitted: R + T = 1.',
    aluminium: 'A metal reflects because its free electrons answer the light wave. Aluminium is a good mirror from the ultraviolet to the infrared; a thin SiO₂ overcoat protects it. About 8 % of the light is absorbed in the metal and becomes heat.',
    enhancedAl: 'Quarter-wave pairs on top of the aluminium add reflections that leave in step with the metal\'s own, lifting the visible reflectance to between 95 and 99 %.',
    silver: 'Silver reflects better than aluminium from the green into the infrared but poorly in the near ultraviolet, and it tarnishes unless it is sealed under a protective layer.',
    gold: 'Gold is yellow because it reflects red and infrared light well and absorbs blue and green. It is a standard mirror for the infrared.'
  };
  /* the real index of a layer or substrate: a coating material, an optical material, a metal or a number */
  const idx = (x, nm) => typeof x === 'string' && F.COATING_MATERIALS[x] ? F.COATING_MATERIALS[x].n : O.nk(x, nm)[0];
  const layerName = (l, n) => typeof l.n === 'string' && F.COATING_MATERIALS[l.n] ? subs(l.n) : (n < 1.7 ? 'low-index layer' : 'high-index layer');
  const layerFill = n => { const t = clamp((n - 1.3) / 1.2, 0, 1); return 'hsl(212,' + Math.round(55 + 25 * t) + '%,' + Math.round(86 - 58 * t) + '%)'; };    // low index light, high index dark
  const polText = (r, kind, pol) => pol === 'both' ? 's ' + pc(r[kind + 's']) + ' · p ' + pc(r[kind + 'p']) : pc(r[POLKEY[pol][kind === 'R' ? 0 : 1]]);

  function stack(el) {
    const L = T.util.lab(el, `A coating is a stack of thin transparent layers, each a fraction of a wavelength thick. Light reflected from every boundary interferes with the rest: where the reflections cancel the surface is anti-reflective, where they add the stack is a mirror or a filter. Choose a design and move its design wavelength, change the substrate, tilt it to a new angle of incidence (AOI, measured from the surface normal), switch the polarization and add a thickness error, and watch the curve slide. Drag across the graph to read it at any wavelength.`, 0.54, { minH: 380 });
    const ctl = K.controls(L.side, [
      { id: 'design', type: 'select', label: 'Coating', options: Object.keys(F.DESIGNS).map(id => [F.DESIGNS[id].name, id]), value: 'mgf2' },
      { id: 'nm0', label: 'Design wavelength', min: 350, max: 1100, step: 5, value: 550, unit: 'nm' },
      { id: 'sub', type: 'select', label: 'Substrate', options: SUBSTRATES, value: 'N-BK7' },
      { id: 'aoi', label: 'Angle of incidence, AOI', min: 0, max: 80, step: 1, value: 0, unit: '°' },
      { id: 'pol', type: 'select', label: 'Polarization', options: [['Unpolarized (mean of s and p)', 'avg'], ['s polarization', 's'], ['p polarization', 'p'], ['s and p together, two curves', 'both']], value: 'avg' },
      { id: 'err', label: 'Thickness error, every layer', min: 0.9, max: 1.1, step: 0.005, value: 1, fmt: v => (v >= 1 ? '+' : '−') + Math.abs((v - 1) * 100).toFixed(1) + ' %' },
      { id: 'show', type: 'select', label: 'Show', options: [['Reflectance R', 'R'], ['Transmittance T (for a metal: the share absorbed)', 'T'], ['Both R and T', 'RT']], value: 'R' },
      { id: 'scale', type: 'select', label: 'Vertical scale', options: [['Full scale, 0 – 100 %', 'full'], ['Expanded: R 0 – 5 %, or T 95 – 100 %', 'zoom']], value: 'zoom' },
      { type: 'buttons', items: [{ id: 'reset', label: 'Straight on, no error' }] }
    ], (id, v) => {
      if (id === 'design') { ctl.set('scale', AR.has(v) ? 'zoom' : 'full'); sync(); }
      else if (id === 'reset') { ctl.set('aoi', 0); ctl.set('err', 1); }
      draw();
    });
    const ro = K.readout(L.side, [['R', 'Reflectance at the design wavelength'], ['T', 'Transmittance at the design wavelength'], ['A', 'Absorbed in the metal'], ['mean', 'Mean reflectance, 420 – 680 nm'],
      ['n', 'Layers, total thickness'], ['edge', 'Edge, line or band'], ['probe', 'At the marked wavelength']]);
    let probe = null, cache = { key: '' }, shown = '', map = null;
    L.under.innerHTML = '<div class="cx"></div><div class="ct"></div>' + T.util.more(['why-surfaces-are-coated', 'antireflection-coatings', 'multilayer-coatings', 'dielectric-mirrors', 'metal-mirror-coatings', 'angle-of-incidence-and-coatings', 'thin-film-interference', 'constructive-and-destructive-interference', 'beam-splitters', 'interference-filters']);
    const noteEl = ui.$('.cx', L.under), tabEl = ui.$('.ct', L.under);

    function sync() { const metal = !!F.DESIGNS[ctl.values.design].sub; ctl.show('sub', !metal); ro.show('A', metal); }
    function calc() {
      const V = ctl.values, key = [V.design, V.nm0, V.sub, V.aoi, V.err, V.pol].join('|');
      if (cache.key === key) return cache;
      const d0 = design(V.design, V.nm0, V.sub), th = V.aoi * D2R;
      const def = { n0: 1, ns: d0.ns, layers: d0.layers.map(l => ({ n: l.n, d: l.d * V.err, mat: l.mat })) };
      const pts = sample(def, th, [V.nm0]), Rf = interp(pts, POLKEY[V.pol === 'both' ? 'avg' : V.pol][0]);
      let sum = 0, cnt = 0;
      for (let nm = 420; nm <= 680; nm += 5) { sum += Rf(nm); cnt++; }
      return (cache = { key, d0, def, pts, th, mean: sum / cnt, here: F.stack(def, V.nm0, th, V.pol === 's' || V.pol === 'p' ? V.pol : undefined), colour: colourOf(Rf), info: analyse(def, pts, V.design, V.nm0, th, V.pol) });
    }
    /* the explanation and the list of layers change only with the design, the wavelength, the substrate and the error */
    function text(C) {
      const V = ctl.values, key = [V.design, V.nm0, V.sub, V.err].join('|');
      if (shown === key) return;
      shown = key;
      const D = F.DESIGNS[V.design], layers = C.def.layers, total = layers.reduce((s, l) => s + l.d, 0);
      noteEl.innerHTML = T.util.box(esc(D.name), '<p class="small muted" style="margin:0">' + esc((D.note || '').replace(/polaris/g, 'polariz')) + (D.note ? ' ' : '') + esc(EXPLAIN[V.design] || '') + '</p>');
      tabEl.innerHTML = layers.length ? T.util.table(['#', 'Layer, from the air down', 'Index n', 'Thickness (nm)', 'Optical thickness (quarter waves at the design wavelength)'],
        layers.map((l, i) => { const n = idx(l.n, V.nm0); return [String(i + 1), layerName(l, n), n.toFixed(2), l.d.toFixed(1), (n * l.d / (V.nm0 / 4)).toFixed(2)]; }), { maxHeight: 260 }) +
        '<p class="small muted" style="margin:6px 0 0">Total thickness ' + (total / 1000).toFixed(3) + ' µm. A quarter wave of optical thickness (index times thickness = a quarter of the design wavelength) is the building block of almost every coating.</p>' : '';
    }
    function geo() {
      const W = L.st.W, Hh = L.st.H, narrow = W < 600, colW = narrow ? 0 : clamp(Math.round(W * 0.33), 210, 330);
      return { W, Hh, narrow, colW, b: { x0: 54, y0: narrow ? 84 : 30, x1: W - (narrow ? 14 : colW + 22), y1: Hh - 54 }, cx0: W - colW + 2, cx1: W - 12 };
    }
    /* the layers to scale, the light above them, and the swatches of the colour they reflect */
    function column(c, Cc, g, C) {
      const V = ctl.values, layers = C.def.layers, nm0 = V.nm0, lx0 = g.cx0 + 6, lw = g.cx1 - lx0, mid = lx0 + lw / 2, Hh = g.Hh;
      label(c, 'The coating, drawn to scale', lx0, 14, { weight: 650, color: Cc.text, size: 12.5 });
      label(c, 'air, n = 1', lx0, 34, { size: 10.5 });
      label(c, 'AOI ' + V.aoi + '°', lx0, 50, { size: 10.5, color: Cc.text });
      label(c, 'reflects ' + pc(C.here[POLKEY[V.pol === 's' || V.pol === 'p' ? V.pol : 'avg'][0]]), lx0, 64, { size: 10.5, color: Cc.text });
      const sy = 100, th = Math.min(V.aoi, 78) * D2R, rl = 62, Rp = C.here[POLKEY[V.pol === 's' || V.pol === 'p' ? V.pol : 'avg'][0]];
      S.normal(c, mid, sy, Math.PI / 2, 48);
      S.ray(c, [[mid - rl * Math.sin(th), sy - rl * Math.cos(th)], [mid, sy]], { nm: nm0, alpha: 1, width: 2.4, minArrow: 30 });
      S.ray(c, [[mid, sy], [mid + rl * Math.sin(th), sy - rl * Math.cos(th)]], { nm: nm0, alpha: clamp(Math.sqrt(Rp), 0.07, 1), width: 2.4, minArrow: 30 });
      const total = layers.reduce((s, l) => s + l.d, 0), top = sy, avail = Math.max(40, Hh - 150 - sy), sc = total > 0 ? clamp(avail / total, 0.03, 1.1) : 0;
      let y = top, small = 0;
      layers.forEach(l => {
        const h = Math.max(1.5, l.d * sc), n = idx(l.n, nm0);
        c.fillStyle = layerFill(n); c.fillRect(lx0, y, lw, h);
        c.strokeStyle = Cc.axis; c.lineWidth = 0.7; c.strokeRect(lx0 + 0.5, y + 0.5, lw - 1, h - 1);
        const full = layerName(l, n) + '  ' + l.d.toFixed(1) + ' nm  ·  n ' + n.toFixed(2), txt = full.length * 5.9 < lw - 8 ? full : l.d.toFixed(1) + ' nm';
        if (h >= 13) label(c, txt, mid, y + h / 2, { align: 'center', size: 10.5, color: n > 1.75 ? '#f1f3fa' : '#10131f' }); else small++;
        y += h;
      });
      const metal = !!F.DESIGNS[V.design].sub, sn = O.nk(C.d0.ns, nm0), sh = 30;
      c.fillStyle = metal ? S.metal() : S.glass(0.3); c.globalAlpha = metal ? 0.55 : 1; c.fillRect(lx0, y, lw, sh); c.globalAlpha = 1;
      c.strokeStyle = S.edge(); c.lineWidth = 1.2; c.strokeRect(lx0 + 0.5, y + 0.5, lw - 1, sh - 1);
      label(c, metal ? O.METALS[C.d0.ns].name + ' (metal)' : M[C.d0.ns].name.replace(/\s*\(.*\)/, '') + '  ·  n ' + sn[0].toFixed(3), mid, y + sh / 2, { align: 'center', size: 10.5, color: Cc.text });
      label(c, layers.length ? (small ? layers.length + ' layers: the list below gives each one' : layers.length + (layers.length === 1 ? ' layer' : ' layers') + ', total ' + total.toFixed(0) + ' nm') : 'no coating: the bare surface', lx0, y + sh + 14, { size: 10.5 });
      colourBox(c, Cc, lx0, Hh - 76, lw, 36, C);
    }
    function colourBox(c, Cc, x, y, w, h, C) {
      const gap = 8, sw = (w - gap) / 2;
      label(c, 'Colour of the reflected light', x, y - 12, { weight: 650, color: Cc.text, size: 11.5 });
      swatch(c, x, y, sw, h, C.colour.true); swatch(c, x + sw + gap, y, sw, h, C.colour.hue);
      label(c, 'true brightness', x + sw / 2, y + h + 10, { align: 'center', size: 10 }); label(c, 'brightened', x + sw + gap + sw / 2, y + h + 10, { align: 'center', size: 10 });
      label(c, 'white daylight; mean R ' + pc(C.mean), x, y + h + 25, { size: 10 });
    }
    function draw() {
      sync();
      const c = L.st.begin(), Cc = colors(), g = geo(), V = ctl.values, C = calc(), b = g.b, W = g.W, Hh = g.Hh;
      text(C);
      const metal = !!F.DESIGNS[V.design].sub, Tn = metal ? 'A' : 'T';
      const zoom = V.scale === 'zoom', showR = V.show !== 'T', showT = V.show !== 'R' && !(zoom && V.show === 'RT'), yr = zoom ? (showT ? [0.95, 1] : [0, 0.05]) : [0, 1];
      const m = map = specFrame(c, Cc, b, yr, { yf: v => { const p = v * 100; return Math.abs(p - Math.round(p)) < 1e-6 ? String(Math.round(p)) : p.toFixed(1); } });
      c.save(); c.beginPath(); c.rect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0); c.clip();
      const colR = Cc.series[0], colT = Cc.series[2], both = V.pol === 'both', key = POLKEY[both ? 'avg' : V.pol], legend = [];
      const curve = (k, col, dash, name) => { stroke(c, C.pts.map(p => [m.X(p.nm), m.Y(p[k])]), col, 2.2, dash); legend.push([name, col, dash]); };
      if (showR) { if (both) { curve('Rs', colR, null, 'R, s'); curve('Rp', colR, [6, 4], 'R, p'); } else curve(key[0], colR, null, 'R'); }
      if (showT) { if (both) { curve('Ts', colT, null, Tn + ', s'); curve('Tp', colT, [6, 4], Tn + ', p'); } else curve(key[1], colT, null, Tn); }
      c.restore();
      /* the design wavelength, the edges found, the marked wavelength */
      const vmark = (nm, col, dash, txt, row) => vline(c, Cc, m, b, nm, col, dash, txt, row);
      vmark(V.nm0, Cc.muted, [5, 4], 'design ' + V.nm0 + ' nm', 0);
      const a = C.info;
      if (a && !a.none) { if (a.edge != null) vmark(a.edge, Cc.warn, [2, 3], 'edge ' + Math.round(a.edge) + ' nm', 1); else { vmark(a.lo, Cc.warn, [2, 3], null, 1); vmark(a.hi, Cc.warn, [2, 3], null, 1); } }
      if (probe != null) {
        const r = F.stack(C.def, probe, C.th);
        vmark(probe, Cc.text, [3, 3], Math.round(probe) + ' nm', 2);
        const dots = [];
        if (showR) (both ? ['Rs', 'Rp'] : [key[0]]).forEach(k => dots.push([r[k], colR]));
        if (showT) (both ? ['Ts', 'Tp'] : [key[1]]).forEach(k => dots.push([r[k], colT]));
        for (const [v, col] of dots) if (v >= yr[0] && v <= yr[1]) K.dot(c, m.X(probe), m.Y(v), 4, col, Cc.surface);
      }
      legend.forEach(([name, col, dash], i) => { const ly = b.y0 + 13 + i * 15; stroke(c, [[b.x1 - 66, ly], [b.x1 - 44, ly]], col, 2.4, dash); label(c, name, b.x1 - 40, ly, { size: 10.5, color: Cc.text }); });
      label(c, 'wavelength (nm)', b.x1, Hh - 8, { align: 'right', color: Cc.text, weight: 650, size: 11.5 });
      vtext(c, (showR && showT ? 'R and ' + Tn : showT ? (metal ? 'absorbed A' : 'transmittance T') : 'reflectance R') + ' (%)', 14, (b.y0 + b.y1) / 2, { align: 'center', color: Cc.text, weight: 650, size: 11.5 });
      if (g.narrow) { colourBox(c, Cc, 12, 22, Math.min(180, W - 24), 22, C); }
      else column(c, Cc, g, C);
      /* ---- read-outs */
      const here = C.here;
      ro.set('R', polText(here, 'R', V.pol)); ro.set('T', metal ? 'none: a metal is opaque' : polText(here, 'T', V.pol)); ro.set('A', polText(here, 'T', V.pol));
      ro.set('mean', pc(C.mean));
      const tot = C.def.layers.reduce((s, l) => s + l.d, 0);
      ro.set('n', C.def.layers.length ? C.def.layers.length + (C.def.layers.length === 1 ? ' layer, ' : ' layers, ') + f(tot, 0) + ' nm in all' : 'none: the bare ' + (metal ? 'metal' : 'surface'));
      ro.set('edge', edgeText(C.info));
      if (probe == null) ro.set('probe', 'drag across the graph to read it');
      else { const r = F.stack(C.def, probe, C.th); ro.set('probe', Math.round(probe) + ' nm: R ' + polText(r, 'R', V.pol) + (metal ? ', absorbed ' : ', T ') + polText(r, 'T', V.pol)); }
    }
    const inPlot = p => { const b = geo().b; return p.x > b.x0 - 4 && p.x < b.x1 + 4 && p.y > b.y0 - 6 && p.y < b.y1 + 16; };
    const setProbe = p => { if (map) { probe = clamp(Math.round(map.iX(p.x)), NM0, NM1); draw(); } };
    K.drag(L.st, { hit: p => inPlot(p) ? 'probe' : null, start: (t, p) => setProbe(p), move: (t, p) => setProbe(p) });
    sync(); L.st.onResize(draw); T.util.onTheme(draw); draw();
  }

  /* ================================================================ 2 · reflection at a surface */
  const MEDIA = Object.keys(M).filter(id => id !== 'vacuum' && ['gas', 'liquid', 'glass', 'crystal', 'plastic', 'ir'].includes(M[id].kind)).map(id => [M[id].name, id]);
  const METALS = ['aluminium', 'silver', 'gold', 'copper'].map(id => [O.METALS[id].name + ' (metal)', 'metal:' + id]);
  const isMetal = id => id.indexOf('metal:') === 0;
  const nOf = (id, nm) => isMetal(id) ? O.metalIndex(id.slice(6), nm) : O.index(id, nm);        // a number, or { n, k } for a metal
  const reOf = n => typeof n === 'number' ? n : n.n;
  const mname = id => isMetal(id) ? O.METALS[id.slice(6)].name : M[id].name.replace(/\s*\(.*\)/, '');
  const nText = n => typeof n === 'number' ? 'n = ' + n.toFixed(3) : 'n = ' + n.n.toFixed(2) + ', k = ' + n.k.toFixed(2);

  function fresnel(el) {
    const L = T.util.lab(el, `Every boundary between two materials reflects part of the light and passes the rest. How much depends on the two refractive indices, on the angle of incidence (AOI, measured from the normal to the surface) and on the polarization: light polarized across the plane of incidence (s) reflects more strongly than light polarized in it (p), and p light is not reflected at all at Brewster's angle. Going from a denser to a lighter medium, light beyond the critical angle is reflected completely. Choose the two media, then drag the incoming ray, or the graph, to change the angle.`, 0.52, { minH: 380 });
    const ctl = K.controls(L.side, [
      { id: 'm1', type: 'select', label: 'Light travels in', options: MEDIA, value: 'air' },
      { id: 'm2', type: 'select', label: 'and meets', options: MEDIA.concat(METALS), value: 'N-BK7' },
      { id: 'nm', label: 'Wavelength', min: 350, max: 1100, step: 5, value: 550, unit: 'nm' },
      { id: 'ang', label: 'Angle of incidence, AOI', min: 0, max: 90, step: 0.5, value: 45, unit: '°' },
      { id: 'pol', type: 'select', label: 'Light in the sketch', options: [['Unpolarized', 'avg'], ['s polarized (across the plane of incidence)', 's'], ['p polarized (in the plane of incidence)', 'p']], value: 'avg' },
      { id: 'mean', type: 'check', label: 'Draw the mean of s and p (unpolarized light)', value: true },
      { type: 'buttons', items: [{ id: 'swap', label: 'Swap the two media' }, { id: 'brew', label: 'Go to Brewster\'s angle' }, { id: 'crit', label: 'Go to the critical angle' }] }
    ], id => {
      const V = ctl.values;
      if (id === 'swap' && !isMetal(V.m2)) { const a = V.m1, b = V.m2; ctl.set('m1', b); ctl.set('m2', a); }
      else if (id === 'brew') { const D = model(); const a = D.brew != null ? D.brew : D.pa; if (a != null) ctl.set('ang', Math.round(a * 2) / 2); }
      else if (id === 'crit') { const D = model(); if (D.crit != null) ctl.set('ang', Math.round(D.crit * 2) / 2); }
      draw();
    });
    const ro = K.readout(L.side, [['R0', 'Reflected at normal incidence'], ['Rs', 'R (s) at this angle'], ['Rp', 'R (p) at this angle'], ['Rm', 'Mean of s and p'], ['brew', 'Brewster\'s angle'], ['crit', 'Critical angle'],
      ['win', 'Lost through an uncoated window (2 surfaces)'], ['ten', 'Lost through ten uncoated surfaces']]);
    L.under.innerHTML = T.util.box('Reading the graph', `<p class="small muted" style="margin:0">At normal incidence the reflectance is ((n₂ − n₁)/(n₂ + n₁))²: 4 % from air into glass of index 1.5, 2 % into water, 17 % into diamond, and much more into a metal. A window has two surfaces, so it loses about 8 %; a camera lens of ten uncoated glass–air surfaces would lose about a third of the light, which is why lenses are coated. The losses shown are for the chosen angle and polarization, ignoring light that bounces back and forth inside, and assume the glass itself does not absorb. A metal is not a window: what it does not reflect it absorbs.</p>`) +
      T.util.more(['fresnel-reflection', 'brewster-angle', 'critical-angle-and-total-internal-reflection', 'polarization-by-reflection-and-scattering', 'refractive-index', 'law-of-reflection', 'angle-of-incidence-and-coatings']);
    let map = null;

    function model() {
      const V = ctl.values, n1 = nOf(V.m1, V.nm), n2 = nOf(V.m2, V.nm), metal = isMetal(V.m2), a = reOf(n1), b = reOf(n2), pts = [];
      for (let d = 0; d <= 90; d += 0.5) { const r = O.fresnel(n1, n2, d * D2R); pts.push({ a: d, Rs: r.Rs, Rp: r.Rp, R: r.R }); }
      let pa = null;
      if (metal) { pa = 0; let best = Infinity; for (const p of pts) if (p.Rp < best) { best = p.Rp; pa = p.a; } }                 // the angle of least p reflection
      return { V, n1, n2, metal, a, b, pts, pa, brew: metal ? null : O.brewster(a, b) / D2R, crit: !metal && a > b ? O.criticalAngle(a, b) / D2R : null, r: O.fresnel(n1, n2, V.ang * D2R) };
    }
    function geo() {
      const W = L.st.W, Hh = L.st.H, narrow = W < 600, sk = narrow ? 0 : clamp(Math.round(W * 0.36), 210, 340);
      return { W, Hh, narrow, sk, b: { x0: 54, y0: 34, x1: W - (narrow ? 14 : sk + 22), y1: Hh - 44 }, sx0: W - sk + 2, sx1: W - 12, sy0: 12, sy1: Hh - 12 };
    }
    const pw = P => clamp(Math.sqrt(P), 0, 1);
    /* the sketch: the incoming ray, the reflected ray and the refracted ray, each as bright as the share of the light it carries */
    function sketch(c, Cc, g, D) {
      const V = D.V, r = D.r, { sx0, sx1, sy0, sy1 } = g, px = (sx0 + sx1) / 2, py = (sy0 + sy1) / 2 + 8, rl = Math.max(30, Math.min((sx1 - sx0) / 2 - 16, (sy1 - sy0) / 2 - 38));
      const th = clamp(V.ang, 0, 89) * D2R, sn = Math.sin(th), cs = Math.cos(th);
      c.fillStyle = Cc.surface; c.fillRect(sx0, sy0, sx1 - sx0, sy1 - sy0);
      c.fillStyle = S.glass(0.04 + 0.16 * clamp((D.a - 1) / 1.2, 0, 1)); c.fillRect(sx0, sy0, sx1 - sx0, py - sy0);
      if (D.metal) { c.globalAlpha = 0.5; c.fillStyle = S.metal(); } else c.fillStyle = S.glass(0.04 + 0.16 * clamp((D.b - 1) / 1.2, 0, 1));
      c.fillRect(sx0, py, sx1 - sx0, sy1 - py); c.globalAlpha = 1;
      c.strokeStyle = Cc.axis; c.lineWidth = 1; c.strokeRect(sx0 + 0.5, sy0 + 0.5, sx1 - sx0 - 1, sy1 - sy0 - 1);
      stroke(c, [[sx0, py], [sx1, py]], Cc.text, 2);
      S.normal(c, px, py, Math.PI / 2, rl);
      label(c, mname(V.m1) + ', ' + nText(D.n1), sx0 + 8, sy0 + 12, { size: 10.5, color: Cc.text });
      label(c, mname(V.m2) + ', ' + nText(D.n2), sx0 + 8, sy1 - 12, { size: 10.5, color: Cc.text });
      const Rr = V.pol === 'avg' ? r.R : V.pol === 's' ? r.Rs : r.Rp, Tr = 1 - Rr, nm = V.nm;
      const A = [px - rl * sn, py - rl * cs], Rend = [px + rl * sn, py - rl * cs];
      S.ray(c, [A, [px, py]], { nm, alpha: 1, width: 2.6, minArrow: 30 });
      if (Rr > 0.0008) { S.ray(c, [[px, py], Rend], { nm, alpha: pw(Rr), width: 2.6, minArrow: 30 }); label(c, 'reflected ' + pc(Rr), clamp(Rend[0], sx0 + 60, sx1 - 60), clamp(Rend[1] - 11, sy0 + 26, py - 8), { align: 'center', size: 10.5, color: Cc.text, bg: Cc.surface }); }
      let t2 = r.t2;
      if (D.metal) t2 = Math.asin(clamp(D.a * Math.sin(th) / Math.max(D.b, 1e-6), -1, 1));
      if (D.metal) {
        if (Tr > 0.0008) { S.ray(c, [[px, py], [px + 0.3 * rl * Math.sin(t2), py + 0.3 * rl * Math.cos(t2)]], { nm, alpha: pw(Tr), width: 2.6, arrows: false }); label(c, 'absorbed: ' + pc(Tr), px + 12, py + 0.3 * rl + 18, { size: 10.5, color: Cc.text }); }
      } else if (r.tir || !Number.isFinite(t2)) label(c, 'total internal reflection', px, py + 22, { align: 'center', size: 11, color: Cc.text, weight: 650 });
      else {
        const T2 = [px + rl * Math.sin(t2), py + rl * Math.cos(t2)];
        if (Tr > 0.0008) { S.ray(c, [[px, py], T2], { nm, alpha: pw(Tr), width: 2.6, minArrow: 30 }); label(c, 'refracted ' + pc(Tr), clamp(T2[0], sx0 + 60, sx1 - 60), clamp(T2[1] + 11, py + 22, sy1 - 28), { align: 'center', size: 10.5, color: Cc.text, bg: Cc.surface }); }
        if (V.ang > 2) S.angle(c, px, py, 26, Math.PI / 2, Math.atan2(Math.cos(t2), Math.sin(t2)), 'θ₂');
      }
      if (V.ang > 2) S.angle(c, px, py, 30, -Math.PI / 2, Math.atan2(-cs, -sn), 'θ');
      K.dot(c, A[0], A[1], 6, Cc.accent, Cc.surface);
      label(c, 'drag the incoming ray', (sx0 + sx1) / 2, sy1 - 28, { align: 'center', size: 10 });
    }
    function draw() {
      const c = L.st.begin(), Cc = colors(), g = geo(), D = model(), V = D.V, b = g.b, r = D.r;
      const m = map = frame(c, Cc, b, [0, 90], [0, 1], {
        xt: [0, 15, 30, 45, 60, 75, 90], xf: v => v + '°', yf: v => String(Math.round(v * 100)),
        under: X => { if (D.crit != null) { c.save(); c.globalAlpha = 0.1; c.fillStyle = Cc.accent; c.fillRect(X(D.crit), b.y0, X(90) - X(D.crit), b.y1 - b.y0); c.restore(); } }
      });
      c.save(); c.beginPath(); c.rect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0); c.clip();
      const colS = Cc.series[0], colP = Cc.series[1];
      stroke(c, D.pts.map(p => [m.X(p.a), m.Y(p.Rs)]), colS, 2.4);
      stroke(c, D.pts.map(p => [m.X(p.a), m.Y(p.Rp)]), colP, 2.4);
      if (V.mean) stroke(c, D.pts.map(p => [m.X(p.a), m.Y(p.R)]), Cc.text, 1.8, [2, 4]);
      c.restore();
      const vmark = (deg, col, txt, row) => {
        stroke(c, [[m.X(deg), b.y0], [m.X(deg), b.y1]], col, 1.2, [5, 4]);
        label(c, txt, clamp(m.X(deg), b.x0 + 60, b.x1 - 60), b.y0 + 12 + row * 14, { align: 'center', size: 10.5, color: Cc.text, bg: Cc.surface });
      };
      if (D.brew != null) vmark(D.brew, colP, 'Brewster ' + D.brew.toFixed(1) + '°', 0);
      if (D.pa != null) vmark(D.pa, colP, 'R (p) least at ' + D.pa.toFixed(0) + '°', 0);
      if (D.crit != null) { vmark(D.crit, Cc.accent, 'critical angle ' + D.crit.toFixed(1) + '°', 1); if (m.X(90) - m.X(D.crit) > 120) label(c, 'total internal reflection', (m.X(D.crit) + m.X(90)) / 2, b.y1 - 12, { align: 'center', size: 10.5, color: Cc.text }); }
      stroke(c, [[m.X(V.ang), b.y0], [m.X(V.ang), b.y1]], Cc.text, 1.4);
      for (const [v, col] of [[r.Rs, colS], [r.Rp, colP]]) K.dot(c, m.X(V.ang), m.Y(v), 4.5, col, Cc.surface);
      label(c, V.ang.toFixed(1) + '°', clamp(m.X(V.ang), b.x0 + 20, b.x1 - 20), b.y1 - 10, { align: 'center', size: 10.5, color: Cc.text, bg: Cc.surface });
      // the key above the graph, the axis titles
      [['R (s)', colS, null], ['R (p)', colP, null], ['mean', Cc.text, [2, 4]]].slice(0, V.mean ? 3 : 2).forEach(([name, col, dash], i) => { const x = b.x0 + i * 74; stroke(c, [[x, 16], [x + 22, 16]], col, 2.4, dash); label(c, name, x + 28, 16, { size: 11, color: Cc.text }); });
      label(c, 'angle of incidence', b.x1, g.Hh - 8, { align: 'right', color: Cc.text, weight: 650, size: 11.5 });
      vtext(c, 'reflectance (%)', 14, (b.y0 + b.y1) / 2, { align: 'center', color: Cc.text, weight: 650, size: 11.5 });
      if (!g.narrow) sketch(c, Cc, g, D);
      /* ---- read-outs */
      const Rv = V.pol === 'avg' ? r.R : V.pol === 's' ? r.Rs : r.Rp;
      ro.set('R0', pc(O.normalR(D.n1, D.n2)));
      ro.set('Rs', pc(r.Rs)); ro.set('Rp', pc(r.Rp)); ro.set('Rm', pc(r.R));
      ro.set('brew', D.metal ? 'none for a metal; R (p) is least at ' + D.pa.toFixed(0) + '°' : D.brew.toFixed(1) + '°');
      ro.set('crit', D.crit != null ? D.crit.toFixed(1) + '° (beyond it the reflection is total)' : D.metal ? 'none: a metal' : 'none: the light goes into a denser medium');
      ro.set('win', D.metal ? 'not a window: a metal absorbs' : pc(1 - Math.pow(1 - Rv, 2)));
      ro.set('ten', D.metal ? '—' : pc(1 - Math.pow(1 - Rv, 10)));
    }
    const skAngle = (p, g) => { const px = (g.sx0 + g.sx1) / 2, py = (g.sy0 + g.sy1) / 2 + 8; return clamp(Math.round(Math.atan2(-(p.x - px), -(p.y - py)) / D2R * 2) / 2, 0, 90); };
    const setAng = a => { ctl.set('ang', a); draw(); };
    K.drag(L.st, {
      hit: p => { const g = geo(), b = g.b; if (p.x > b.x0 - 4 && p.x < b.x1 + 4 && p.y > b.y0 - 6 && p.y < b.y1 + 14) return 'plot'; return !g.narrow && p.x > g.sx0 && p.x < g.sx1 && p.y > g.sy0 && p.y < g.sy1 ? 'sketch' : null; },
      start: (t, p) => move(t, p), move
    });
    function move(t, p) { const g = geo(); if (t === 'plot') { if (map) setAng(clamp(Math.round(map.iX(p.x) * 2) / 2, 0, 90)); } else setAng(skAngle(p, g)); }
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }

  /* ================================================================ 3 · the glass map */
  const GLASS_IDS = Object.keys(M).filter(id => ['glass', 'crystal', 'plastic'].includes(M[id].kind));
  const IR_IDS = Object.keys(M).filter(id => M[id].kind === 'ir');
  const OPTIONS = GLASS_IDS.concat(IR_IDS).map(id => [M[id].name, id]);
  const PRETTY = { 'fused-silica': 'fused silica', 'calcite-o': 'calcite, o-ray', 'calcite-e': 'calcite, e-ray', 'quartz-o': 'quartz, o-ray', 'quartz-e': 'quartz, e-ray', 'crown-1.523': 'spectacle crown', 'hi-1.60': 'high-index 1.60', 'hi-1.67': 'high-index 1.67', 'hi-1.74': 'high-index 1.74', CaF2: 'CaF₂', MgF2: 'MgF₂', PC: 'polycarbonate', PS: 'polystyrene' };
  const short = id => PRETTY[id] || id;
  const AB = {};
  for (const id of GLASS_IDS.concat(IR_IDS)) AB[id] = O.abbe(id);
  const hasV = id => Number.isFinite(AB[id].vd);
  /* the six-digit glass code: n_d − 1 to three digits, then V_d × 10; outside its scheme (n_d from 2, V_d from 100, no dispersion) there is none */
  const codeOf = id => { const a = AB[id]; return hasV(id) && a.nd < 2 && a.vd < 100 ? O.glassCode(id) : '—'; };
  const rangeText = r => { const s = v => v < 1000 ? v + ' nm' : (v / 1000).toFixed(1).replace(/\.0$/, '') + ' µm'; return r ? s(r[0]) + ' to ' + s(r[1]) : '—'; };
  /* the stretch of wavelengths a curve is drawn over: 350 – 1100 nm, or the transmission range of the material where that is narrower */
  const windowOf = id => { const r = M[id].range || [NM0, NM1]; const lo = Math.max(NM0, r[0]), hi = Math.min(NM1, r[1]); return hi - lo > 20 ? [lo, hi] : [r[0], r[1]]; };
  const XR = [110, 20], YR = [1.36, 1.85];                                              // Abbe number runs backwards, as glass catalogues draw it; diamond (n 2.42) is off the top

  function glass(el) {
    const L = T.util.lab(el, `The Abbe diagram is the map an optical designer carries in the head. Every point is a material: its refractive index <i>n</i><sub>d</sub>, how strongly it bends light, goes up the page, and its Abbe number <i>V</i><sub>d</sub>, how little it spreads the colours apart, runs from right to left. Low-dispersion crowns (V above 50) lie on the left, high-dispersion flints (V below 50) on the right. Click a point, or choose a material from the list, to see how its index changes with wavelength and to read its data; pick a second material to compare.`, 0.62, { minH: 400 });
    const ctl = K.controls(L.side, [
      { id: 'mat', type: 'select', label: 'Material', options: OPTIONS, value: 'N-BK7' },
      { id: 'cmp', type: 'select', label: 'Compare with', options: [['Nothing', 'none']].concat(OPTIONS), value: 'none' },
      { id: 'names', type: 'check', label: 'Name every point', value: true },
      { type: 'html', html: 'Click a point of the diagram to choose it. Silicon, germanium, zinc selenide and zinc sulfide are given one index for every wavelength, so they are in the list but not on the map.' }
    ], () => draw());
    const ro = K.readout(L.side, [['nd', 'Refractive index nd'], ['vd', 'Abbe number Vd'], ['dn', 'Dispersion nF − nC'], ['code', 'Six-digit glass code'], ['type', 'Kind']]);
    L.under.innerHTML = '<h4 style="margin:12px 0 4px;font-size:13.5px">Refractive index against wavelength</h4><div class="gp"></div><p class="small muted gn" style="margin:4px 0 0"></p><div class="gt" style="margin-top:12px"></div>' +
      '<p class="small muted" style="margin:8px 0 0">The six-digit glass code gives <i>n</i><sub>d</sub> − 1 to three digits and then <i>V</i><sub>d</sub> × 10: 517642 is <i>n</i><sub>d</sub> = 1.517 and <i>V</i><sub>d</sub> = 64.2. F, d and C are the lines of hydrogen and helium at 486.1, 587.6 and 656.3 nm at which glass is specified; <i>V</i><sub>d</sub> = (<i>n</i><sub>d</sub> − 1)/(<i>n</i><sub>F</sub> − <i>n</i><sub>C</sub>). Values are typical catalogue figures.</p>' +
      T.util.more(['optical-glass', 'the-abbe-number-and-glass-map', 'dispersion-formulas', 'uv-and-infrared-materials', 'dispersion-and-the-spectrum', 'refractive-index', 'apochromats-and-ed-glass']);
    const plot = K.plot(ui.$('.gp', L.under), { x: { label: 'wavelength (nm)' }, y: { label: 'refractive index n' }, series: [], legend: true }, 250), noteEl = ui.$('.gn', L.under), tabEl = ui.$('.gt', L.under);
    let key = '', pos = [];

    /* the curve, the data and the read-outs change only with the two materials chosen */
    function refresh() {
      const V = ctl.values, k = V.mat + '|' + V.cmp;
      if (k === key) return;
      key = k;
      const [lo, hi] = windowOf(V.mat), curve = (id, a, z) => { const pts = []; for (let i = 0; i <= 120; i++) { const nm = a + (z - a) * i / 120; pts.push([nm, O.index(id, nm)]); } return pts; };
      const series = [{ pts: curve(V.mat, lo, hi), label: mname(V.mat) }];
      if (V.cmp !== 'none') { const w = M[V.cmp].range || [lo, hi], a = Math.max(lo, w[0]), z = Math.min(hi, w[1]); if (z - a > 5) series.push({ pts: curve(V.cmp, a, z), label: mname(V.cmp), dash: true }); }
      const ys = [].concat(...series.map(s => s.pts.map(p => p[1]))), y0 = Math.min(...ys), y1 = Math.max(...ys), pad = Math.max(0.004, (y1 - y0) * 0.12);
      plot.set({ series, x: { label: 'wavelength (nm)', min: lo, max: hi }, y: { label: 'refractive index n', min: y0 - pad, max: y1 + pad }, marks: [],
        vlines: [[O.LINES.F, 'F'], [O.LINES.d, 'd'], [O.LINES.C, 'C']].filter(q => q[0] > lo && q[0] < hi).map(q => ({ x: q[0], label: q[1] })) });
      noteEl.innerHTML = y1 - y0 < 1e-6 ? esc(mname(V.mat)) + ' is given a single index at every wavelength, so its curve is flat.' : 'The curve covers the range of wavelengths the material transmits, up to 1100 nm. The lines F, d and C are where the Abbe number is measured.';
      const rows = (id) => {
        const m = M[id], a = AB[id], v = hasV(id);
        return [a.nd.toFixed(4), v ? a.vd.toFixed(1) : '— (no dispersion data)', v ? a.dn.toFixed(5) : '—', codeOf(id), v ? (a.vd > 50 ? 'crown type (V above 50)' : 'flint type (V below 50)') : '—' + (m.kind === 'ir' ? ' (infrared material)' : ''),
          rangeText(m.range), m.density != null ? m.density.toFixed(2) + ' g/cm³' : '—', m.cte != null ? m.cte + ' × 10⁻⁶ per K' : '—', m.dndt != null ? m.dndt + ' × 10⁻⁶ per K' : '—', esc(m.note || '—')];
      };
      const names = ['Refractive index n<sub>d</sub> (587.6 nm)', 'Abbe number V<sub>d</sub>', 'Dispersion n<sub>F</sub> − n<sub>C</sub>', 'Six-digit glass code', 'Kind', 'Transmits', 'Density', 'Thermal expansion', 'Index change with temperature, dn/dT', 'Note'];
      const A = rows(V.mat), B = V.cmp !== 'none' ? rows(V.cmp) : null;
      tabEl.innerHTML = T.util.table(['Property', esc(M[V.mat].name)].concat(B ? [esc(M[V.cmp].name)] : []), names.map((n, i) => [n, A[i]].concat(B ? [B[i]] : [])));
    }
    function geo() { const W = L.st.W, Hh = L.st.H; return { W, Hh, b: { x0: 62, y0: 24, x1: W - 16, y1: Hh - 54 } }; }
    function draw() {
      refresh();
      const c = L.st.begin(), Cc = colors(), g = geo(), b = g.b, V = ctl.values;
      const m = frame(c, Cc, b, XR, YR, {
        xt: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110], yt: [1.4, 1.5, 1.6, 1.7, 1.8], yf: v => v.toFixed(1), xf: v => String(v),
        under: X => { c.save(); c.globalAlpha = 0.07; c.fillStyle = Cc.accent; c.fillRect(X(110), b.y0, X(50) - X(110), b.y1 - b.y0); c.fillStyle = Cc.warn; c.fillRect(X(50), b.y0, X(20) - X(50), b.y1 - b.y0); c.restore(); }
      });
      stroke(c, [[m.X(50), b.y0], [m.X(50), b.y1]], Cc.muted, 1.2, [5, 4]);
      label(c, 'CROWNS: V above 50', (m.X(110) + m.X(50)) / 2, b.y0 + 12, { align: 'center', size: 10.5, weight: 650 });
      label(c, 'FLINTS: V below 50', (m.X(50) + m.X(20)) / 2, b.y0 + 12, { align: 'center', size: 10.5, weight: 650 });
      pos = GLASS_IDS.map(id => { const a = AB[id], off = a.nd > YR[1]; return { id, x: m.X(a.vd), y: off ? b.y0 + 30 : m.Y(a.nd), off }; });
      const cols = id => Cc.series[M[id].kind === 'glass' ? 0 : M[id].kind === 'crystal' ? 3 : 2];
      for (const q of pos) {
        c.fillStyle = cols(q.id); c.strokeStyle = Cc.surface; c.lineWidth = 1.5;
        if (q.off) { c.beginPath(); c.moveTo(q.x, q.y - 7); c.lineTo(q.x + 6, q.y + 4); c.lineTo(q.x - 6, q.y + 4); c.closePath(); } else { c.beginPath(); c.arc(q.x, q.y, 5, 0, TAU); }
        c.fill(); c.stroke();
      }
      // names: the chosen ones first, each placed where it covers no point and no other name
      const used = pos.map(q => [q.x - 7, q.y - 7, q.x + 7, q.y + 7]);
      const order = pos.slice().sort((p, q) => (q.id === V.mat) - (p.id === V.mat) || (q.id === V.cmp) - (p.id === V.cmp));
      for (const q of order) {
        const chosen = q.id === V.mat || q.id === V.cmp;
        if (!V.names && !chosen) continue;
        const txt = q.off ? short(q.id) + ', n = ' + AB[q.id].nd.toFixed(2) + ' (off the top)' : short(q.id), w = txt.length * 5.9 + 4, h = 13;
        for (const [dx, dy, al] of [[9, 0, 'left'], [-9, 0, 'right'], [0, -13, 'center'], [0, 14, 'center'], [9, -11, 'left'], [9, 11, 'left'], [-9, -11, 'right'], [-9, 11, 'right']]) {
          const x0 = q.x + dx - (al === 'left' ? 0 : al === 'right' ? w : w / 2), y0 = q.y + dy - h / 2, rc = [x0, y0, x0 + w, y0 + h];
          if (rc[0] < b.x0 + 2 || rc[2] > b.x1 - 2 || rc[1] < b.y0 + 20 || rc[3] > b.y1 - 2) continue;
          if (used.some(u => rc[0] < u[2] && rc[2] > u[0] && rc[1] < u[3] && rc[3] > u[1])) continue;
          used.push(rc); label(c, txt, q.x + dx, q.y + dy, { align: al, size: 10.5, color: chosen ? Cc.text : Cc.muted, weight: chosen ? 650 : 500 }); break;
        }
      }
      for (const [id, col, dash] of [[V.mat, Cc.text, []], [V.cmp, Cc.warn, [4, 3]]]) {
        const q = pos.find(p => p.id === id); if (!q) continue;
        c.save(); c.setLineDash(dash); c.lineWidth = 2; c.strokeStyle = col; c.beginPath(); c.arc(q.x, q.y, 9.5, 0, TAU); c.stroke(); c.restore();
      }
      if (!AB[V.mat] || !pos.some(p => p.id === V.mat)) label(c, short(V.mat) + ': no Abbe number, so not on the map', b.x1 - 8, b.y0 + 30, { align: 'right', size: 10.5, color: Cc.text });
      label(c, 'Abbe number Vd (less dispersion to the left)', (b.x0 + b.x1) / 2, g.Hh - 22, { align: 'center', color: Cc.text, weight: 650, size: 11.5 });
      vtext(c, 'refractive index nd', 14, (b.y0 + b.y1) / 2, { align: 'center', color: Cc.text, weight: 650, size: 11.5 });
      [['glass', 0], ['crystal', 3], ['plastic', 2]].forEach(([name, si], i) => { const x = b.x0 + i * 86; K.dot(c, x, g.Hh - 7, 4.5, Cc.series[si]); label(c, name, x + 9, g.Hh - 7, { size: 10.5 }); });
      /* ---- read-outs */
      const a = AB[V.mat], v = hasV(V.mat);
      ro.set('nd', a.nd.toFixed(4)); ro.set('vd', v ? a.vd.toFixed(1) : '— (a single index)'); ro.set('dn', v ? a.dn.toFixed(5) : '—'); ro.set('code', codeOf(V.mat));
      ro.set('type', v ? (a.vd > 50 ? 'crown type, ' : 'flint type, ') + M[V.mat].kind : M[V.mat].kind === 'ir' ? 'infrared material' : '—');
    }
    const pickAt = p => { let best = null, bd = 15; for (const q of pos) { const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; best = q.id; } } return best; };
    L.st.onResize(draw); T.util.onTheme(draw); draw();
    K.click(L.st, p => { const id = pickAt(p); if (id) { ctl.set('mat', id); draw(); } }, p => !!pickAt(p));
  }
  /* ================================================================ 4 · filters and optical density */
  const SRC_OPTS = Object.keys(Ph.SOURCES).map(id => [Ph.SOURCES[id].name, id]);
  const FKIND = { longpass: 1.016, shortpass: 0.984, bandpass: 1 };      // design wavelength of the stack divided by the wavelength of its 50 % edge, found by trial
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  /* "one part in N", with N as a plain number or a power of ten */
  const oneIn = n => {
    if (!Number.isFinite(n)) return '—';
    if (n < 10) return n.toFixed(1);
    if (n < 1e6) return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const e = Math.floor(Math.log10(n) + 1e-9);
    return (n / Math.pow(10, e)).toFixed(1) + ' × 10' + String(e).replace(/\d/g, d => SUP[d]);
  };
  const colourName = rgb => {
    const mx = Math.max(...rgb), mn = Math.min(...rgb), d = mx - mn;
    if (mx < 30) return 'black';
    if (d < 0.14 * mx) return mx > 215 ? 'white' : 'grey';
    let h = mx === rgb[0] ? ((rgb[1] - rgb[2]) / d) % 6 : mx === rgb[1] ? (rgb[2] - rgb[0]) / d + 2 : (rgb[0] - rgb[1]) / d + 4;
    h = ((h * 60) + 360) % 360;
    const nm = h < 15 || h >= 345 ? 'red' : h < 40 ? 'orange' : h < 70 ? 'yellow' : h < 160 ? 'green' : h < 200 ? 'cyan' : h < 255 ? 'blue' : h < 290 ? 'purple' : 'magenta';
    return (mx < 100 ? 'dark ' : '') + nm + (d < 0.4 * mx ? ' (pale)' : '');
  };

  /* the blocking glass of a real filter: a coloured glass with a soft edge. It does not tilt with the stack, and the simple stacks of the
     engine block only a band about 20 % wide, so without it light of other colours leaks through */
  const lg = x => 1 / (1 + Math.exp(-clamp(x, -40, 40)));
  function blocker(kind, nm) {
    if (kind === 'longpass') return w => lg((w - (nm - 30)) / 9);
    if (kind === 'shortpass') return w => lg(((nm + 30) - w) / 9);
    return w => lg((w - (nm - 100)) / 9) * lg(((nm + 100) - w) / 9);
  }

  function filters(el) {
    const L = T.util.lab(el, `Optical density (OD) is how a filter's darkening is written: the base-10 logarithm of how much light it stops. OD 1 passes a tenth of the light, OD 2 a hundredth. Transmittances multiply, so densities simply add when filters are stacked. Set up to three neutral-density filters in a row and follow the beam; then try an interference filter. Choose a long-pass, short-pass or band-pass filter and a light source, and compare the colour of the light before and after the filter. Tilt the filter and its edge moves to shorter wavelengths.`, 0.9, { minH: 560, maxH: 800 });
    head(L.side, 'Neutral-density filters');
    const od = (id, v) => ({ id, label: 'Filter ' + id.slice(2) + ', optical density', min: 0, max: 4, step: 0.1, value: v, fmt: x => 'OD ' + x.toFixed(1) });
    const A = K.controls(L.side, [od('od1', 1), od('od2', 0.6), od('od3', 0)], () => draw());
    const roA = K.readout(L.side, [['od', 'Total optical density'], ['T', 'Transmittance'], ['stops', 'Light lost, in stops'], ['n', 'Passes one part in']]);
    head(L.side, 'Edge and band-pass filters');
    const B = K.controls(L.side, [
      { id: 'kind', type: 'select', label: 'Filter', options: [['Long-pass: blocks short wavelengths', 'longpass'], ['Short-pass: blocks long wavelengths', 'shortpass'], ['Band-pass: passes one narrow band', 'bandpass']], value: 'longpass' },
      { id: 'nm', label: 'Edge or centre wavelength', min: 400, max: 1000, step: 5, value: 600, unit: 'nm' },
      { id: 'aoi', label: 'Tilt of the filter, AOI', min: 0, max: 60, step: 1, value: 0, unit: '°' },
      { id: 'block', type: 'check', label: 'Add the blocking glass of a real filter', value: true },
      { id: 'src', type: 'select', label: 'Light source', options: SRC_OPTS, value: 'daylight' }
    ], () => draw());
    const roB = K.readout(L.side, [['edge', 'Edge, or centre and width'], ['shift', 'Shift caused by the tilt'], ['pass', 'Light the eye still sees'], ['col', 'Colour after the filter']]);
    L.under.innerHTML = T.util.box('Density, stops and edges', `<p class="small muted" style="margin:0 0 6px">Neutral-density filters dim every colour alike. With OD = −log₁₀ T, the transmittance is T = 10<sup>−OD</sup>. A photographic stop halves the light, so one stop is an OD of 0.3 and OD 3 is about ten stops, one part in a thousand.</p>
      <p class="small muted" style="margin:0 0 6px"><b>Warning:</b> ordinary neutral-density filters, even stacked, are not safe for looking at the Sun. Only filters certified for solar viewing are.</p>
      <p class="small muted" style="margin:0">An interference filter works by reflection, not absorption: a long-pass filter turns the short wavelengths back. Tilting it shortens the path through each layer, and the edge moves to about λ(θ) = λ₀ √(1 − sin²θ / n²), where n, between 1.5 and 2, is the effective index of the stack. The simple stacks drawn here block one band only; transmission returns far from it, which real filters prevent with more layers or a coloured-glass blocker.</p>`) +
      T.util.more(['neutral-density-and-optical-density', 'interference-filters', 'dichroic-filters-and-mirrors', 'coloured-glass-filters', 'angle-of-incidence-and-coatings', 'colour-temperature-and-colour-rendering', 'lamp-families']);
    let cache = { key: '' }, cols = null, ref = { key: '' };

    function calc() {
      const V = B.values, key = [V.kind, V.nm, V.aoi, V.src, V.block].join('|');
      if (cache.key === key) return cache;
      const nm0 = Math.round(V.nm / FKIND[V.kind]), th = V.aoi * D2R, d0 = design(V.kind, nm0, 'N-BK7'), def = { n0: 1, ns: d0.ns, layers: d0.layers };
      const pts = sample(def, th, [V.nm]), Ts = interp(pts, 'T'), Tb = V.block ? blocker(V.kind, V.nm) : () => 1, Tf = nm => Ts(nm) * Tb(nm);
      const spec = Ph.spectrum(V.src), visible = !Ph.SOURCES[V.src].invisible && Ph.ler(spec) >= 0.5, X0 = Cl.xyz(spec, true), X1 = Cl.xyz(nm => spec(nm) * Tf(nm), true);
      const rgbOf = X => X[1] > 1e-12 ? Cl.srgb(Cl.fit(Cl.toRgb([X[0] / X[1], 1, X[2] / X[1]]), 1)) : null;
      const frac = visible && X0[1] > 0 ? X1[1] / X0[1] : NaN;
      if (V.aoi > 0 && ref.key !== V.kind + '|' + V.nm) { const p0 = sample(def, 0, [V.nm]); ref = { key: V.kind + '|' + V.nm, pts0: p0, info0: analyse(def, p0, V.kind, nm0, 0, 'avg') }; }
      const straight = V.aoi > 0 ? ref : { pts0: pts, info0: null };
      return (cache = { key, pts, pts0: straight.pts0, info0: straight.info0, Tf, Tb, spec, visible, frac, before: visible ? rgbOf(X0) : null, after: visible && frac > 1e-5 ? rgbOf(X1) : null,
        info: analyse(def, pts, V.kind, nm0, th, 'avg') });
    }
    /* the source painted column by column, faintly, and again at full strength where the filter lets it through */
    function columns(C, n) {
      const key = B.values.src + '|' + n;
      if (cols && cols.key === key) return cols;
      const vals = new Float64Array(n), cs0 = new Array(n), cs1 = new Array(n);
      let mx = 0;
      for (let k = 0; k < n; k++) {
        let v = 0;
        for (let q = 0; q < 5; q++) v = Math.max(v, C.spec(NM0 + (NM1 - NM0) * (k + (q + 0.5) / 5) / n));
        vals[k] = v; mx = Math.max(mx, v);
        const nm = NM0 + (NM1 - NM0) * (k + 0.5) / n; cs0[k] = S.nm(nm, 0.22); cs1[k] = S.nm(nm, 0.95);
      }
      for (let k = 0; k < n; k++) vals[k] = mx > 0 ? vals[k] / mx : 0;
      return (cols = { key, vals, cs0, cs1 });
    }
    function geo() {
      const W = L.st.W, Hh = L.st.H, pad = 12, hA = clamp(Math.round(Hh * 0.26), 130, 200), narrow = W < 640, top2 = pad + hA + 22, sw = narrow ? 0 : clamp(Math.round(W * 0.15), 110, 150);
      return { W, Hh, pad, hA, narrow, sw, top2, b: { x0: 54, y0: top2 + (narrow ? 122 : 38), x1: W - pad - (narrow ? 4 : sw + 18), y1: Hh - 56 } };
    }
    /* three neutral-density filters in a beam: each segment as bright as the light that is left, judged as the eye would */
    function ndPanel(c, Cc, g) {
      const ods = [A.values.od1, A.values.od2, A.values.od3], cum = [1];
      ods.forEach(o => cum.push(cum[cum.length - 1] * O.transmittance(o)));
      const { pad, hA, W } = g, bw = W - 2 * pad, cy = pad + hA * 0.52, bh = hA * 0.16, sx = pad + 36, xe = pad + bw - 74, xs = [0.26, 0.46, 0.66].map(t => pad + bw * t);
      c.fillStyle = '#0a0d17'; rrect(c, pad, pad, bw, hA, 8); c.fill();
      label(c, 'Three neutral-density filters in a row', pad + 12, pad + 14, { size: 11.5, weight: 650, color: '#dfe3f3' });
      const edges = [sx + 16].concat(...xs.map(x => [x - 7, x + 7]), [xe]);
      for (let i = 0; i < 4; i++) {
        const x0 = edges[2 * i], x1 = edges[2 * i + 1], a = 0.04 + 0.92 * Math.pow(cum[i], 0.42);
        c.fillStyle = 'rgba(255,244,214,' + a.toFixed(3) + ')'; c.fillRect(x0, cy - bh, Math.max(1, x1 - x0), 2 * bh);
        label(c, pc(cum[i]), (x0 + x1) / 2, cy + bh + 15, { align: 'center', size: 10.5, color: '#b9c0da' });
      }
      S.source(c, sx, cy, { kind: 'bulb', size: 15, color: '#ffd98a' });
      xs.forEach((x, i) => {
        c.fillStyle = 'rgba(150,160,190,' + (0.2 + 0.1 * Math.min(ods[i], 3)).toFixed(2) + ')'; c.fillRect(x - 7, cy - bh - 14, 14, 2 * bh + 28);
        c.strokeStyle = '#8f9cc8'; c.lineWidth = 1.2; c.strokeRect(x - 6.5, cy - bh - 13.5, 13, 2 * bh + 27);
        label(c, 'OD ' + ods[i].toFixed(1), x, cy - bh - 26, { align: 'center', size: 10.5, color: '#dfe3f3' });
      });
      const gr = Math.round(255 * Math.pow(cum[3], 0.42));
      c.fillStyle = 'rgb(' + gr + ',' + gr + ',' + Math.round(gr * 0.94) + ')'; c.fillRect(xe, cy - bh - 6, 58, 2 * bh + 12);
      c.strokeStyle = '#8f9cc8'; c.lineWidth = 1; c.strokeRect(xe + 0.5, cy - bh - 5.5, 57, 2 * bh + 11);
      label(c, 'what arrives', xe + 29, cy - bh - 18, { align: 'center', size: 10.5, color: '#dfe3f3' });
      label(c, '1 in ' + oneIn(1 / cum[3]), xe + 29, cy + bh + 24, { align: 'center', size: 10.5, color: '#dfe3f3', weight: 650 });
      label(c, 'Brightness is drawn as the eye judges it, not in proportion to the power. Percentages are the share of the light left.', pad + 12, pad + hA - 10, { size: 10, color: '#8e96b5' });
    }
    function swatches(c, Cc, g, C) {
      const wide = !g.narrow, w = wide ? g.sw : 64, h = wide ? 42 : 34, x0 = wide ? g.b.x1 + 18 : g.pad + 4, y0 = wide ? g.b.y0 + 4 : g.top2 + 16, x1 = wide ? x0 : x0 + w + 56, y1 = wide ? y0 + h + 66 : y0;
      swatch(c, x0, y0, w, h, C.before); swatch(c, x1, y1, w, h, C.after);
      if (!C.before) label(c, 'invisible', x0 + w / 2, y0 + h / 2, { align: 'center', size: 10.5 });
      else if (!C.after) label(c, 'blocked', x1 + w / 2, y1 + h / 2, { align: 'center', size: 10.5 });
      label(c, 'the source', x0 + w / 2, y0 + h + 11, { align: 'center', size: 10.5 }); label(c, 'through the filter', x1 + w / 2, y1 + h + 11, { align: 'center', size: 10.5 });
      if (wide) K.arrow(c, x0 + w / 2, y0 + h + 22, x0 + w / 2, y1 - 6, Cc.muted, 1.6); else K.arrow(c, x0 + w + 6, y0 + h / 2, x1 - 6, y0 + h / 2, Cc.muted, 1.6);
      if (Number.isFinite(C.frac)) { label(c, pc(C.frac), x1 + w / 2, y1 + h + (wide ? 28 : 26), { align: 'center', size: 11, color: Cc.text, weight: 650 }); label(c, 'of the light the eye sees', x1 + w / 2, y1 + h + (wide ? 42 : 40), { align: 'center', size: 10 }); }
    }
    function draw() {
      const c = L.st.begin(), Cc = colors(), g = geo(), C = calc(), V = B.values, b = g.b;
      ndPanel(c, Cc, g);
      label(c, 'An interference filter and a light source', g.pad, g.top2 - 2, { size: 12.5, weight: 650, color: Cc.text });
      const m = specFrame(c, Cc, b, [0, 1], { yf: v => String(Math.round(v * 100)) });
      const n = Math.max(40, Math.round((b.x1 - b.x0) / 2)), cd = columns(C, n), bw = (b.x1 - b.x0) / n;
      for (let k = 0; k < n; k++) {
        const h0 = (b.y1 - b.y0) * 0.94 * cd.vals[k];
        if (h0 < 0.3) continue;
        const x = b.x0 + k * bw, h1 = h0 * clamp(C.Tf(NM0 + (NM1 - NM0) * (k + 0.5) / n), 0, 1);
        c.fillStyle = cd.cs0[k]; c.fillRect(x, b.y1 - h0, bw + 0.6, h0);
        if (h1 > 0.3) { c.fillStyle = cd.cs1[k]; c.fillRect(x, b.y1 - h1, bw + 0.6, h1); }
      }
      if (V.block) stroke(c, C.pts.map(p => [m.X(p.nm), m.Y(p.T)]), Cc.faint, 1.3, [1, 3]);
      if (V.aoi > 0) stroke(c, C.pts0.map(p => [m.X(p.nm), m.Y(p.T * C.Tb(p.nm))]), Cc.muted, 1.8, [6, 4]);
      stroke(c, C.pts.map(p => [m.X(p.nm), m.Y(p.T * C.Tb(p.nm))]), Cc.text, 2.4);
      const a = C.info;
      if (a && !a.none) { if (a.edge != null) vline(c, Cc, m, b, a.edge, Cc.warn, [2, 3], 'edge ' + Math.round(a.edge) + ' nm', 0); else vline(c, Cc, m, b, a.centre, Cc.warn, [2, 3], 'centre ' + Math.round(a.centre) + ' nm', 0); }
      // the key, above the graph
      let kx = b.x0;
      const ky = b.y0 - 14, key = [['line', V.block ? 'filter with blocking glass' : 'filter transmittance'], V.block ? ['dot', 'the stack alone'] : null, V.aoi > 0 ? ['dash', 'the same, straight on'] : null, ['faint', 'light of the source'], ['bright', 'light that gets through']].filter(Boolean);
      for (const [kind, txt] of key) {
        if (kind === 'line' || kind === 'dash' || kind === 'dot') stroke(c, [[kx, ky], [kx + 20, ky]], kind === 'line' ? Cc.text : kind === 'dot' ? Cc.faint : Cc.muted, kind === 'dot' ? 1.6 : 2.2, kind === 'dash' ? [5, 3] : kind === 'dot' ? [1, 3] : null);
        else { c.fillStyle = S.nm(580, kind === 'faint' ? 0.3 : 0.95); c.fillRect(kx, ky - 5, 20, 10); }
        label(c, txt, kx + 25, ky, { size: 10.5 }); kx += 25 + txt.length * 5.7 + 16;
      }
      label(c, 'wavelength (nm)', b.x1, g.Hh - 8, { align: 'right', color: Cc.text, weight: 650, size: 11.5 });
      vtext(c, 'transmittance (%); source, relative', 14, (b.y0 + b.y1) / 2, { align: 'center', color: Cc.text, weight: 650, size: 11 });
      swatches(c, Cc, g, C);
      /* ---- read-outs */
      const tot = A.values.od1 + A.values.od2 + A.values.od3, Tt = O.transmittance(tot);
      roA.set('od', tot.toFixed(1)); roA.set('T', pc(Tt)); roA.set('stops', f(tot / Math.log10(2), 1) + ' stops'); roA.set('n', oneIn(1 / Tt));
      roB.set('edge', edgeText(C.info));
      const at0 = q => q && !q.none ? (q.edge != null ? q.edge : q.centre) : null, p1 = at0(C.info), p0 = at0(C.info0);
      roB.set('shift', V.aoi === 0 ? 'none: the filter is straight on' : p1 != null && p0 != null ? (p1 - p0 <= 0 ? '−' : '+') + Math.abs(p1 - p0).toFixed(1) + ' nm' + (p1 < p0 ? ', towards the blue' : '') : '—');
      roB.set('pass', C.visible ? pc(C.frac) + ' of the source\'s light' : 'none: this source gives no visible light');
      roB.set('col', C.after ? colourName(C.after) + ', ' + hex(C.after) : C.visible ? 'none: the filter blocks the visible light' : '—');
    }
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }
})();
