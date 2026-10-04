/* HYPER-CORE · ui/optics-colour.js — Tools → Colour lab (#/tools/colour/<spectrum|cie|munsell|mixing|deficiency>)
 *
 *   spectrum    one wavelength on a bar from 300 to 1100 nm (colour, frequency, photon energy, the eye's sensitivity);
 *               the spectrum of a lamp, LED, laser or the Sun painted in its own colours, with chromaticity,
 *               colour temperature and luminous efficacy
 *   cie         the CIE 1931 chromaticity diagram filled with colour, gamut triangles, the Planckian locus and a point
 *               you pick (dominant wavelength, purity, colour temperature)
 *   munsell     the Munsell hue wheel (40 hues, chroma rings) and the hue page (value up, chroma across)
 *   mixing      additive mixing of three lamps and subtractive mixing of three filters, summed in linear light
 *   deficiency  a palette and a dot plate as people with a colour-vision deficiency see them
 *
 * The mathematics is kit.optics (optics-vision.js: O.colour, O.photo); the drawing is kit.osym; shared helpers are
 * T.util (optictools.js). Local helpers: the spectral locus (the engine's colour-matching fit is good from about
 * 420 to 640 nm; its two ends are taken from the published CIE 1931 table), the white-light test, a dominant
 * wavelength finder, and the dot plate.
 */
(function () {
  'use strict';
  const H = window.Hyper, ui = H.ui, U = H.util, esc = U.esc, K = H.kit, O = H.optics, S = H.osym;
  const T = H.opticsTools = H.opticsTools || {};
  const Cl = O.colour, Ph = O.photo, clamp = O.clamp, f = T.util.f, TAU = Math.PI * 2, D2R = Math.PI / 180;
  const TABS = [['spectrum', 'Light and its spectrum'], ['cie', 'Chromaticity diagram'], ['munsell', 'Munsell wheel'], ['mixing', 'Mixing colours'], ['deficiency', 'Colour-vision deficiency']];

  T.colour = function (el, params, sub) {
    const t = T.util.subtabs(el, 'colour', TABS, sub, 'Colours are computed from the CIE 1931 colour-matching functions and drawn in sRGB. A screen cannot show every colour, so those beyond its range are shown as the nearest colour it can make.');
    ({ spectrum, cie, munsell, mixing, deficiency })[t.tab](t.body);
  };
  T.colour.tabs = TABS.map(t => t[0]);

  /* ================================================================ small helpers */
  const colors = () => K.colors();
  const rgbCss = rgb => 'rgb(' + rgb.map(v => Math.round(clamp(v, 0, 255))).join(',') + ')';
  const hex = rgb => '#' + rgb.map(v => ('0' + Math.round(clamp(v, 0, 255)).toString(16)).slice(-2)).join('').toUpperCase();
  const textOn = rgb => (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) > 150 ? '#111' : '#f4f4f4';
  const small = v => v < 0.0005 ? 'about 0' : v.toFixed(3);
  const label = (c, s, x, y, o) => K.label(c, s, x, y, Object.assign({ size: 11.5, color: colors().muted }, o));
  const head = (el, s) => el.appendChild(ui.el('<h4 style="margin:10px 0 0;font-size:13.5px">' + s + '</h4>'));
  function trace(c, pts, close) { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (close) c.closePath(); }
  function stroke(c, pts, col, w, dash, close) {
    if (pts.length < 2) return;
    c.save(); c.strokeStyle = col; c.lineWidth = w || 1; c.lineJoin = 'round'; c.setLineDash(dash || []); trace(c, pts, close); c.stroke(); c.restore();
  }
  /* a line that stays readable over any colour: a pale halo under a dark stroke */
  function halo(c, pts, w, dash, close, col) { stroke(c, pts, 'rgba(255,255,255,.8)', (w || 1.4) + 2.4, dash, close); stroke(c, pts, col || '#141414', w || 1.4, dash, close); }
  function rrect(c, x, y, w, h, r) { c.beginPath(); w = Math.max(1, w); h = Math.max(1, h); if (c.roundRect) c.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2)); else c.rect(x, y, w, h); }
  function swatch(c, x, y, w, h, rgb, r) { rrect(c, x, y, w, h, r == null ? 6 : r); c.fillStyle = rgb ? rgbCss(rgb) : 'rgba(128,128,128,.25)'; c.fill(); c.lineWidth = 1; c.strokeStyle = colors().axis; c.stroke(); }
  const unit = (a, b) => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };

  /* ---------------------------------------------------------------- the spectral locus, the white-light test */
  // the chromaticity of a single wavelength at the two ends of the spectrum, from the published CIE 1931 table
  const ENDS = { 380: [0.1741, 0.0050], 400: [0.1733, 0.0048], 660: [0.7260, 0.2740], 680: [0.7334, 0.2666], 700: [0.7347, 0.2653] };
  let LOCUS = null;
  function locus() {
    if (LOCUS) return LOCUS;
    const pts = [], add = (nm, xy) => pts.push({ nm, x: xy[0], y: xy[1] });
    add(380, ENDS[380]); add(400, ENDS[400]);
    for (let nm = 420; nm <= 640; nm += 2) add(nm, Cl.xy(Cl.cmf(nm)));
    add(660, ENDS[660]); add(680, ENDS[680]); add(700, ENDS[700]);
    return (LOCUS = pts);
  }
  function insideLocus(x, y) {
    const P = locus(); let inside = false;
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
      const a = P[i], b = P[j];
      if ((a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
  }
  const WP = [0.3127, 0.3290];                                      // D65, the white point of sRGB
  /* where a ray from the white point leaves the locus: { t, nm, purple } (the closing edge is the line of purples) */
  function rayHit(dx, dy) {
    const P = locus(); let best = null;
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length], ex = b.x - a.x, ey = b.y - a.y, den = dx * ey - dy * ex;
      if (Math.abs(den) < 1e-12) continue;
      const t = ((a.x - WP[0]) * ey - (a.y - WP[1]) * ex) / den, u = ((a.x - WP[0]) * dy - (a.y - WP[1]) * dx) / den;
      if (t > 1e-9 && u >= 0 && u <= 1 && (!best || t > best.t)) best = { t, nm: a.nm + (b.nm - a.nm) * u, purple: i === P.length - 1 };
    }
    return best;
  }
  /* dominant wavelength and excitation purity of a chromaticity; for a purple, the complementary wavelength instead */
  function dominant(x, y) {
    const dx = x - WP[0], dy = y - WP[1], d = Math.hypot(dx, dy);
    if (!(d > 0.002)) return null;
    const h = rayHit(dx / d, dy / d);
    if (!h) return null;
    const purity = clamp(d / h.t, 0, 1);
    if (!h.purple) return { nm: h.nm, purity, purple: false };
    const h2 = rayHit(-dx / d, -dy / d);
    return { nm: h2 && !h2.purple ? h2.nm : NaN, purity, purple: true };
  }
  let PLANCK = null;
  function planckTable() {
    if (!PLANCK) { PLANCK = []; for (let i = 0; i <= 70; i++) { const t = 1500 * Math.pow(20000 / 1500, i / 70), xy = Cl.planckXY(t); PLANCK.push([t, xy[0], xy[1]]); } }
    return PLANCK;
  }
  /* a colour temperature, if the chromaticity is close enough to the black-body curve to be called a white: { T, dist } or null */
  function whiteInfo(x, y) {
    const T0 = Cl.cct(x, y);
    if (!Number.isFinite(T0) || T0 < 1500 || T0 > 20000) return null;
    let d = Infinity;
    for (const p of planckTable()) d = Math.min(d, Math.hypot(p[1] - x, p[2] - y));
    return d <= 0.03 ? { T: T0, dist: d } : null;
  }
  const whiteText = w => w ? 'about ' + (Math.round(w.T / 10) * 10) + ' K' + (w.dist > 0.012 ? ' (only roughly white)' : '') : 'not a white';

  /* ---------------------------------------------------------------- the light sources */
  const SRC_OPTS = Object.keys(Ph.SOURCES).map(id => [Ph.SOURCES[id].name, id]);
  const srcCache = {};
  function srcInfo(id) {
    if (srcCache[id]) return srcCache[id];
    const spec = Ph.spectrum(id), xyz = Cl.xyz(spec), ler = Ph.ler(spec), visible = ler >= 0.5 && xyz[1] > 0, xy = visible ? Cl.xy(xyz) : null;
    return (srcCache[id] = { id, name: Ph.SOURCES[id].name, spec, ler, visible, xy, rgb: visible ? Cl.srgb(Cl.fit(Cl.toRgb(xyz), 1)) : null, white: xy ? whiteInfo(xy[0], xy[1]) : null });
  }

  /* ================================================================ 1 · light and its spectrum */
  function spectrum(el) {
    const L = T.util.lab(el, `Light of one wavelength has one colour, one frequency and one photon energy. Real lamps spread their light over many wavelengths, and the colour we see is the eye's total reaction to that spread. Slide along the spectrum to meet single wavelengths — beyond the two ends, ultraviolet and infrared, the eye sees nothing — then choose a lamp, an LED, a laser or the Sun to see its spectrum painted in the colours of its own wavelengths, with the eye's sensitivity laid over it.`, 0.8);
    head(L.side, 'One wavelength');
    const A = K.controls(L.side, [{ id: 'nm', label: 'Wavelength λ', min: 300, max: 1100, step: 1, value: 550, unit: 'nm' }], () => draw());
    const roA = K.readout(L.side, [['name', 'Colour and band'], ['f', 'Frequency'], ['e', 'Photon energy'], ['vd', 'Eye by day, V(λ)'], ['vn', 'Eye by night, V′(λ)'], ['lm', 'Light per watt of this λ']]);
    head(L.side, 'A light source');
    const B = K.controls(L.side, [{ id: 'src', type: 'select', label: 'Source', options: SRC_OPTS, value: 'led-warm' }], () => draw());
    const roB = K.readout(L.side, [['xy', 'Chromaticity x, y'], ['cct', 'Colour temperature'], ['ler', 'Efficacy of the radiation']]);
    let cols = null;                                         // the painted columns of the source plot, cached per source and width

    function geo() {
      const W = L.st.W, Hh = L.st.H, pad = 14, sw = clamp(W * 0.14, 46, 96), right = W - pad - sw - 14;
      const bx0 = pad + 4, bw = Math.max(60, right - bx0), by = 52, bh = clamp(Hh * 0.075, 24, 40);
      const top2 = by + bh + 62;
      return { W, Hh, pad, sw, bx0, bx1: bx0 + bw, bw, by, bh, X: n => bx0 + bw * (n - 300) / 800, top2,
        px0: pad + 34, px1: right, py0: top2 + 44, py1: Math.max(top2 + 104, Hh - 36) };
    }
    function column(info, n) {
      const key = info.id + '|' + n;
      if (cols && cols.key === key) return cols;
      const vals = new Float64Array(n), cs = new Array(n);
      let vis = 0, all = 0;
      for (let nm = 380; nm <= 780; nm += 0.2) vis = Math.max(vis, info.spec(nm));
      for (let nm = 250; nm <= 1100; nm += 0.25) all = Math.max(all, info.spec(nm));
      const faint = vis < 0.05 * all, norm = (faint ? all : vis) || 1;
      for (let k = 0; k < n; k++) {
        let m = 0;
        for (let q = 0; q < 3; q++) m = Math.max(m, info.spec(380 + 400 * (k + (q + 0.5) / 3) / n));
        vals[k] = clamp(m / norm, 0, 1); cs[k] = S.nm(380 + 400 * (k + 0.5) / n);
      }
      return (cols = { key, vals, cs, faint });
    }
    function draw() {
      const c = L.st.begin(), Cc = colors(), g = geo(), { W, pad, sw, bx0, bx1, bw, by, bh, X } = g;
      const nm = A.values.nm, info = srcInfo(B.values.src), vis = nm >= 380 && nm <= 780;
      /* ---- one wavelength: the bar from 300 to 1100 nm */
      label(c, 'One wavelength, 300 – 1100 nm', pad, 16, { weight: 650, color: Cc.text, size: 13 });
      c.save(); c.fillStyle = Cc.faint; c.globalAlpha = 0.35; c.fillRect(bx0, by, X(380) - bx0, bh); c.fillRect(X(780), by, bx1 - X(780), bh); c.restore();
      S.spectrum(c, X(380), by, X(780) - X(380), bh, 380, 780);
      label(c, X(380) - bx0 > 74 ? 'ultraviolet' : 'UV', (bx0 + X(380)) / 2, by + bh / 2, { align: 'center', size: 10.5 });
      label(c, 'infrared', (X(780) + bx1) / 2, by + bh / 2, { align: 'center', size: 10.5 });
      c.strokeStyle = Cc.axis; c.lineWidth = 1; c.strokeRect(bx0 + 0.5, by + 0.5, bw - 1, bh - 1);
      for (let n = 300; n <= 1100; n += 100) { stroke(c, [[X(n), by + bh], [X(n), by + bh + 5]], Cc.axis, 1); S.text(c, String(n), X(n), by + bh + 15, { size: 10.5 }); }
      stroke(c, [[X(380), by + bh + 27], [X(780), by + bh + 27]], Cc.muted, 1);
      stroke(c, [[X(380), by + bh + 23], [X(380), by + bh + 31]], Cc.muted, 1); stroke(c, [[X(780), by + bh + 23], [X(780), by + bh + 31]], Cc.muted, 1);
      S.text(c, 'visible light, 380 – 780 nm', (X(380) + X(780)) / 2, by + bh + 41, { size: 10.5 });
      // the marker
      const mx = X(nm);
      stroke(c, [[mx, by - 3], [mx, by + bh + 3]], Cc.bg2, 4.5); stroke(c, [[mx, by - 3], [mx, by + bh + 3]], Cc.text, 2);
      c.fillStyle = Cc.text; trace(c, [[mx - 6, by - 13], [mx + 6, by - 13], [mx, by - 3]], true); c.fill();
      // the swatch of this wavelength
      const sx = W - pad - sw;
      swatch(c, sx, by, sw, sw, vis ? Cl.wavelength(nm) : null);
      if (!vis) label(c, 'invisible', sx + sw / 2, by + sw / 2, { align: 'center', size: 10.5 });
      label(c, nm + ' nm', sx + sw / 2, by + sw + 12, { align: 'center', color: Cc.text, weight: 650 });
      /* ---- a light source: its spectrum, painted column by column */
      const { px0, px1, py0, py1, top2 } = g, pw = Math.max(40, px1 - px0), ph = Math.max(40, py1 - py0), X2 = n => px0 + pw * (n - 380) / 400;
      label(c, 'Spectrum of: ' + info.name, pad, top2 + 12, { weight: 650, color: Cc.text, size: 13 });
      for (const v of [0, 0.5, 1]) { const y = py1 - ph * v; stroke(c, [[px0, y], [px0 + pw, y]], Cc.grid, 1); label(c, String(v), px0 - 6, y, { align: 'right', size: 10.5 }); }
      const n = Math.max(24, Math.round(pw / 1.5)), cc = column(info, n);
      for (let k = 0; k < n; k++) { const h = ph * cc.vals[k]; if (h > 0.2) { c.fillStyle = cc.cs[k]; c.fillRect(px0 + pw * k / n, py1 - h, pw / n + 0.5, h); } }
      stroke(c, Array.from(cc.vals, (v, k) => [px0 + pw * (k + 0.5) / n, py1 - ph * v]), Cc.muted, 1);
      const dayPts = [], nightPts = [];
      for (let w = 380; w <= 780; w += 4) { dayPts.push([X2(w), py1 - ph * clamp(Ph.V(w), 0, 1)]); nightPts.push([X2(w), py1 - ph * clamp(Ph.Vscotopic(w), 0, 1)]); }
      stroke(c, dayPts, Cc.text, 1.8, [6, 4]); stroke(c, nightPts, Cc.accent, 1.8, [2, 3]);
      stroke(c, [[px0, py1 + 0.5], [px0 + pw, py1 + 0.5]], Cc.axis, 1);
      for (let w = 400; w <= 750; w += 50) { stroke(c, [[X2(w), py1], [X2(w), py1 + 4]], Cc.axis, 1); S.text(c, String(w), X2(w), py1 + 14, { size: 10.5 }); }
      S.text(c, 'nm', px1 + 12, py1 + 14, { size: 10.5 });
      if (vis) stroke(c, [[X2(nm), py0], [X2(nm), py1]], Cc.text, 1, [3, 3]);
      stroke(c, [[px0, top2 + 31], [px0 + 22, top2 + 31]], Cc.text, 1.8, [6, 4]); label(c, 'eye by day, V(λ)', px0 + 28, top2 + 31, { size: 10.5 });
      stroke(c, [[px0 + 140, top2 + 31], [px0 + 162, top2 + 31]], Cc.accent, 1.8, [2, 3]); label(c, 'eye by night, V′(λ)', px0 + 168, top2 + 31, { size: 10.5 });
      label(c, cc.faint ? 'almost nothing here: this source works outside the visible range' : 'relative power, scaled to the strongest visible wavelength', px0, py1 + 28, { size: 10.5 });
      swatch(c, sx, py0, sw, sw, info.rgb);
      label(c, info.visible ? 'colour of this light' : 'invisible to the eye', W - pad, py0 + sw + 12, { align: 'right', size: 10.5 });
      /* ---- read-outs */
      const name = O.colourName(nm), band = O.BANDS.find(b => b[1] === name);
      roA.set('name', name + (band ? ' · ' + band[2] + '–' + band[3] + ' nm' : '') + (vis ? '' : ' (not visible)'));
      roA.set('f', f(O.frequency(nm) / 1e12, 1) + ' THz');
      roA.set('e', f(O.photonEnergy(nm), 3) + ' eV');
      roA.set('vd', small(Ph.V(nm))); roA.set('vn', small(Ph.Vscotopic(nm)));
      roA.set('lm', f(Ph.efficacy(nm), 1) + ' lm/W');
      roB.set('xy', info.visible ? f(info.xy[0], 3) + ', ' + f(info.xy[1], 3) : 'none: it gives no visible light');
      roB.set('cct', info.visible ? whiteText(info.white) : '—');
      roB.set('ler', f(info.ler, 0) + ' lm per optical watt');
    }
    K.drag(L.st, {
      hit: p => { const g = geo(); return p.y > g.by - 16 && p.y < g.by + g.bh + 26 && p.x > g.bx0 - 10 && p.x < g.bx1 + 10 ? 'nm' : null; },
      start: (t, p) => setNm(p), move: (t, p) => setNm(p)
    });
    function setNm(p) { const g = geo(); A.set('nm', clamp(Math.round(300 + 800 * (p.x - g.bx0) / g.bw), 300, 1100)); draw(); }
    L.st.onResize(draw); T.util.onTheme(draw); draw();
    L.under.innerHTML = T.util.box('Wavelength, frequency and energy', `<p class="small muted" style="margin:0">Wavelength λ, frequency f and photon energy E describe the same light: f = c / λ and E = h f = h c / λ. At 550 nm, green light, f is about 545 THz and each photon carries about 2.25 eV. Shorter wavelength means higher frequency and more energy per photon. Wavelengths here are those in air; in glass or water the wavelength shrinks but the frequency, and so the colour, stay the same. Drag on the bar to move the marker.</p>`) +
      T.util.more(['wavelength-frequency-and-colour', 'the-optical-spectrum', 'photon-energy', 'colour-temperature-and-colour-rendering', 'white-leds']);
  }

  /* ================================================================ 2 · the chromaticity diagram */
  const NX = 90, NY = 100, XMAX = 0.8, YMAX = 0.9;
  let FILL = null, TINY = null;                              // the colour of every cell of the diagram, computed once, and a one-pixel-per-cell picture of it
  function cieFill() {
    if (FILL) return FILL;
    const cell = (x, y) => { y = Math.max(y, 0.004); return Cl.srgb(Cl.fit(Cl.toRgb([x / y, 1, (1 - x - y) / y]), 1)); };
    FILL = [];
    for (let j = 0; j < NY; j++) {
      const row = [], y = YMAX - (j + 0.5) * YMAX / NY;
      for (let i = 0; i < NX; i++) {
        let x = (i + 0.5) * XMAX / NX, yy = y;
        if (!insideLocus(x, yy)) {                         // outside the locus: take the colour of the edge, on the line to white, so that the picture blends to the edge
          let lo = 0, hi = 1; const x1 = x, y1 = yy;
          for (let k = 0; k < 14; k++) { const m = (lo + hi) / 2; if (insideLocus(WP[0] + (x1 - WP[0]) * m, WP[1] + (y1 - WP[1]) * m)) lo = m; else hi = m; }
          x = WP[0] + (x1 - WP[0]) * lo; yy = WP[1] + (y1 - WP[1]) * lo;
        }
        row.push(cell(x, yy));
      }
      FILL.push(row);
    }
    return FILL;
  }
  /* the cells as a picture one pixel per cell: the browser smooths it when it is drawn large */
  function cieTiny() {
    if (TINY) return TINY;
    const F = cieFill(), cv = document.createElement('canvas');
    cv.width = NX; cv.height = NY;
    S.cells(cv.getContext('2d'), 0, 0, NX, NY, NX, NY, (u, v) => F[Math.min(NY - 1, Math.floor(v * NY))][Math.min(NX - 1, Math.floor(u * NX))]);
    return (TINY = cv);
  }
  const GAMUTS = [
    { id: 'srgb', name: 'sRGB', pts: [[0.64, 0.33], [0.30, 0.60], [0.15, 0.06]], dash: null, col: '#141414' },
    { id: 'adobe', name: 'Adobe RGB', pts: [[0.64, 0.33], [0.21, 0.71], [0.15, 0.06]], dash: [7, 3], col: '#303030' },
    { id: 'p3', name: 'Display P3', pts: [[0.680, 0.320], [0.265, 0.690], [0.150, 0.060]], dash: [3, 3], col: '#303030' },
    { id: 'rec2020', name: 'Rec. 2020', pts: [[0.708, 0.292], [0.170, 0.797], [0.131, 0.046]], dash: [10, 3, 2, 3], col: '#303030' }
  ];
  const MARKS = [460, 480, 500, 520, 540, 560, 580, 600, 620, 700], PLANCK_MARKS = [2000, 2700, 4000, 5000, 6500, 10000];

  function cie(el) {
    const L = T.util.lab(el, `The chromaticity diagram charts every colour the eye can see by its hue and saturation alone, leaving brightness out. The curved edge is the spectral locus, the colours of single wavelengths, with wavelengths marked in nanometres; the straight edge closing it is the line of purples. Colours here are drawn as a screen can show them, at equal brightness. Click or drag on the diagram to pick a colour, or place a light source on it.`, 0.94, { minH: 380 });
    const ctl = K.controls(L.side, [
      { id: 'srgb', type: 'check', label: 'sRGB triangle (screens and the web)', value: true },
      { id: 'wide', type: 'check', label: 'Wider gamuts: Adobe RGB, Display P3, Rec. 2020', value: false },
      { id: 'planck', type: 'check', label: 'Planckian locus (glowing bodies, 1500 – 20 000 K)', value: true },
      { id: 'ticks', type: 'check', label: 'Wavelength marks', value: true },
      { id: 'src', type: 'select', label: 'Place a light source', options: [['None', 'none']].concat(SRC_OPTS), value: 'none' },
      { type: 'html', html: 'Click or drag on the diagram to pick a colour.' }
    ], (id, v) => { if (id === 'src' && v !== 'none') { const i = srcInfo(v); if (i.visible) pick = i.xy.slice(); } draw(); });
    const ro = K.readout(L.side, [['xy', 'Chromaticity x, y'], ['dom', 'Dominant wavelength'], ['pur', 'Excitation purity'], ['cct', 'Colour temperature'], ['rgb', 'On a screen (sRGB)']]);
    let pick = [0.25, 0.55];                                  // a green-cyan just outside the sRGB triangle
    const layer = { cv: null, key: '' };
    const planckMarks = PLANCK_MARKS.map(t => [t, Cl.planckXY(t), Cl.planckXY(t * 1.06), Cl.planckXY(t / 1.06)]);

    function geo() {
      const W = L.st.W, Hh = L.st.H, ml = 46, mr = 12, mt = 12, mb = 38;
      const s = Math.max(60, Math.min((W - ml - mr) / XMAX, (Hh - mt - mb) / YMAX)), x0 = ml + Math.max(0, (W - ml - mr - XMAX * s) / 2), y0 = mt + YMAX * s;
      return { W, Hh, s, x0, y0, X: x => x0 + s * x, Y: y => y0 - s * y };
    }
    function drawFill(c, g) {
      const st = L.st, key = [st.W, st.H, st.dpr, Math.round(g.s * 10)].join();
      if (!layer.cv) layer.cv = document.createElement('canvas');
      if (layer.key !== key) {
        const cv = layer.cv, d = st.dpr || 1;
        cv.width = Math.max(1, Math.round(st.W * d)); cv.height = Math.max(1, Math.round(st.H * d));
        const o = cv.getContext('2d');
        o.setTransform(d, 0, 0, d, 0, 0); o.clearRect(0, 0, st.W, st.H);
        o.save(); trace(o, locus().map(p => [g.X(p.x), g.Y(p.y)]), true); o.clip();
        o.imageSmoothingEnabled = true; o.drawImage(cieTiny(), g.x0, g.y0 - YMAX * g.s, XMAX * g.s, YMAX * g.s);
        o.restore(); layer.key = key;
      }
      c.drawImage(layer.cv, 0, 0, st.W, st.H);
    }
    function draw() {
      const c = L.st.begin(), Cc = colors(), g = geo(), { x0, y0, s, X, Y } = g, pw = XMAX * s, ph = YMAX * s, V = ctl.values;
      c.fillStyle = Cc.surface; c.fillRect(x0, y0 - ph, pw, ph);
      drawFill(c, g);
      c.save(); c.strokeStyle = Cc.grid; c.lineWidth = 1; c.beginPath();
      for (let i = 0; i <= 8; i++) { const x = Math.round(X(i / 10)) + 0.5; c.moveTo(x, y0 - ph); c.lineTo(x, y0); }
      for (let j = 0; j <= 9; j++) { const y = Math.round(Y(j / 10)) + 0.5; c.moveTo(x0, y); c.lineTo(x0 + pw, y); }
      c.stroke(); c.restore();
      c.strokeStyle = Cc.axis; c.lineWidth = 1; c.strokeRect(x0 + 0.5, y0 - ph + 0.5, pw, ph);
      for (let i = 0; i <= 8; i++) label(c, (i / 10).toFixed(1), X(i / 10), y0 + 12, { align: 'center', size: 10.5 });
      for (let j = 0; j <= 9; j++) label(c, (j / 10).toFixed(1), x0 - 6, Y(j / 10), { align: 'right', size: 10.5 });
      label(c, 'x', x0 + pw / 2, y0 + 28, { align: 'center', color: Cc.text, weight: 650, size: 12.5 }); label(c, 'y', x0 - 34, y0 - ph / 2, { align: 'center', color: Cc.text, weight: 650, size: 12.5 });
      /* the locus, its wavelength marks and the line of purples */
      const loc = locus(), P = loc.map(p => [X(p.x), Y(p.y)]), E = [X(1 / 3), Y(1 / 3)];
      stroke(c, P, Cc.text, 1.8); stroke(c, [P[P.length - 1], P[0]], Cc.muted, 1.5, [5, 4]);
      const mid = [(P[0][0] + P[P.length - 1][0]) / 2, (P[0][1] + P[P.length - 1][1]) / 2], mu = unit(E, mid);
      label(c, 'line of purples', mid[0] + mu[0] * 24, mid[1] + mu[1] * 24, { align: 'center', size: 10.5 });
      if (V.ticks) for (const nm of MARKS) {
        const i = loc.findIndex(p => p.nm === nm); if (i < 0) continue;
        const u = unit(E, P[i]);
        stroke(c, [P[i], [P[i][0] + u[0] * 6, P[i][1] + u[1] * 6]], Cc.text, 1.4);
        label(c, String(nm), P[i][0] + u[0] * 19, P[i][1] + u[1] * 19, { align: 'center', size: 10.5 });
      }
      /* the Planckian locus */
      if (V.planck) {
        halo(c, planckTable().map(p => [X(p[1]), Y(p[2])]), 1.8, null, false, '#b02a00');
        planckMarks.forEach(([t, xy, a, b], k) => {
          const px = X(xy[0]), py = Y(xy[1]), tg = unit([X(b[0]), Y(b[1])], [X(a[0]), Y(a[1])]);
          let nx = -tg[1], ny = tg[0]; if (ny < 0 === (k % 2 === 0)) { nx = -nx; ny = -ny; }          // the labels take turns above and below the curve
          c.beginPath(); c.arc(px, py, 3, 0, TAU); c.fillStyle = '#b02a00'; c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 1; c.stroke();
          label(c, String(t), px + nx * 17, py + ny * 13, { align: 'center', size: 9.5, color: '#222', bg: 'rgba(255,255,255,.72)' });
        });
      }
      /* the gamut triangles */
      for (const gm of GAMUTS) if (gm.id === 'srgb' ? V.srgb : V.wide) halo(c, gm.pts.map(p => [X(p[0]), Y(p[1])]), gm.id === 'srgb' ? 1.8 : 1.3, gm.dash, true, gm.col);
      if (V.srgb) for (const [nm, p] of [['R', [0.64, 0.33]], ['G', [0.30, 0.60]], ['B', [0.15, 0.06]]]) { const u = unit(E, [X(p[0]), Y(p[1])]); label(c, nm, X(p[0]) + u[0] * 12, Y(p[1]) + u[1] * 12, { align: 'center', color: '#141414', weight: 700, size: 12, bg: 'rgba(255,255,255,.7)' }); }
      /* the white point */
      c.beginPath(); c.arc(X(WP[0]), Y(WP[1]), 4.5, 0, TAU); c.fillStyle = '#fff'; c.fill(); c.strokeStyle = '#141414'; c.lineWidth = 1.5; c.stroke();
      label(c, 'D65', X(WP[0]) - 9, Y(WP[1]) - 12, { align: 'right', size: 10.5, color: '#222', bg: 'rgba(255,255,255,.72)' });
      /* a light source */
      if (V.src !== 'none') { const i = srcInfo(V.src); if (i.visible) { const sx = X(i.xy[0]), sy = Y(i.xy[1]); halo(c, [[sx, sy - 7], [sx + 7, sy], [sx, sy + 7], [sx - 7, sy]], 1.5, null, true, '#141414'); const nm = i.name.replace(/ \(.*\)$/, ''), toLeft = sx + 16 + nm.length * 5.8 > g.W - 6; label(c, nm, toLeft ? sx - 11 : sx + 11, sy - 11, { align: toLeft ? 'right' : 'left', size: 10.5, color: '#222', bg: 'rgba(255,255,255,.78)' }); } }
      /* the picked colour: the line from the white point through it to the locus, and a cross */
      const px = clamp(pick[0], 0, XMAX), py = clamp(pick[1], 0, YMAX), dm = dominant(px, py);
      if (dm) {
        const d = Math.hypot(px - WP[0], py - WP[1]), h = rayHit((px - WP[0]) / d, (py - WP[1]) / d);
        if (h) halo(c, [[X(WP[0]), Y(WP[1])], [X(WP[0] + (px - WP[0]) / d * h.t), Y(WP[1] + (py - WP[1]) / d * h.t)]], 1.1, [4, 3], false, '#141414');
      }
      halo(c, [[X(px) - 9, Y(py)], [X(px) + 9, Y(py)]], 1.6); halo(c, [[X(px), Y(py) - 9], [X(px), Y(py) + 9]], 1.6);
      /* swatch and key in the empty corner */
      const yy = Math.max(py, 0.002), lin = Cl.toRgb([px / yy, 1, (1 - px - py) / yy]), rgb = Cl.srgb(Cl.fit(lin, 1)), inSrgb = lin.every(v => v >= -0.002);
      const sw = clamp(s * 0.085, 34, 52), sx = X(XMAX) - sw - 6, sy = y0 - ph + 6;
      swatch(c, sx, sy, sw, sw, rgb);
      label(c, 'picked colour', sx - 8, sy + sw / 2, { align: 'right', size: 10.5 });
      const keyItems = [];
      if (V.srgb) keyItems.push(['sRGB', null, '#141414']);
      if (V.wide) for (const gm of GAMUTS.slice(1)) keyItems.push([gm.name, gm.dash, gm.col]);
      if (V.planck) keyItems.push(['Planckian locus (K)', null, '#b02a00']);
      keyItems.forEach(([nm, dash, col], k) => { const ky = sy + sw + 16 + k * 15, kx = X(XMAX) - 128; halo(c, [[kx, ky], [kx + 20, ky]], 1.8, dash, false, col); label(c, nm, kx + 26, ky, { size: 10.5 }); });
      /* ---- read-outs */
      const w = whiteInfo(px, py);
      ro.set('xy', f(px, 3) + ', ' + f(py, 3));
      ro.set('dom', !dm ? '— (the white point itself)' : dm.purple ? (Number.isFinite(dm.nm) ? 'a purple: complementary wavelength ' + f(dm.nm, 0) + ' nm' : 'a purple') : f(dm.nm, 0) + ' nm');
      ro.set('pur', dm ? f(dm.purity * 100, 0) + ' %' : '0 %');
      ro.set('cct', whiteText(w));
      ro.set('rgb', hex(rgb) + (inSrgb ? '' : ' (outside the sRGB triangle: nearest shown)'));
    }
    function setPick(p) {
      const g = geo(); let x = clamp((p.x - g.x0) / g.s, 0, XMAX), y = clamp((g.y0 - p.y) / g.s, 0, YMAX);
      if (!insideLocus(x, y)) {                                // outside the locus: slide back towards the white point until inside
        let lo = 0, hi = 1; const x1 = x, y1 = y;
        for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (insideLocus(WP[0] + (x1 - WP[0]) * m, WP[1] + (y1 - WP[1]) * m)) lo = m; else hi = m; }
        x = WP[0] + (x1 - WP[0]) * lo; y = WP[1] + (y1 - WP[1]) * lo;
      }
      pick = [x, y]; draw();
    }
    K.click(L.st, p => { const g = geo(); if (p.x > g.x0 - 6 && p.x < g.x0 + XMAX * g.s + 6 && p.y > g.y0 - YMAX * g.s - 6 && p.y < g.y0 + 6) setPick(p); });
    K.drag(L.st, { hit: p => { const g = geo(); return p.x > g.x0 - 6 && p.x < g.x0 + XMAX * g.s + 6 && p.y > g.y0 - YMAX * g.s - 6 && p.y < g.y0 + 6 ? 'pick' : null; }, start: (t, p) => setPick(p), move: (t, p) => setPick(p) });
    L.st.onResize(draw); T.util.onTheme(draw); draw();
    L.under.innerHTML = T.util.box('Reading the diagram', `<p class="small muted" style="margin:0">A point's position gives a colour's hue and saturation; its brightness is not shown. White sits near the middle, and moving from white straight out to the edge makes the colour purer. Mixing two lights puts the result on the straight line between them, so three lights can make only the triangle they span — which is why no three-colour screen shows every colour. Draw the line from the white point through a colour to the edge and you find its <b>dominant wavelength</b>; the colour's distance along that line is its <b>excitation purity</b>. Purples have no single wavelength, so their opposite end of the line gives a <b>complementary</b> one. The Planckian curve is the colour of a hot glowing body, from candle-flame orange to blue-white.</p>`) +
      T.util.more(['the-chromaticity-diagram', 'cie-colour-matching-and-xyz', 'colour-spaces-and-gamuts', 'colour-temperature-and-colour-rendering', 'trichromatic-colour-vision']);
  }
  /* ================================================================ 3 · the Munsell wheel */
  const RINGS = [2, 4, 6, 8, 10, 12, 14];                                 // the chroma of the rings, from the hub outwards
  const hueName = h => Cl.munsellName(h, 5, 1).split(' ')[0];            // 5R, 2.5YR, 10RP …

  function munsell(el) {
    const L = T.util.lab(el, `The Munsell system describes a colour by three scales: <b>hue</b>, its place on the colour circle (red, yellow, green, blue, purple and the steps between); <b>value</b>, its lightness from 0 for black to 10 for white; and <b>chroma</b>, how far it is from grey. The wheel shows 40 hues at the chosen value, with chroma growing ring by ring from the grey hub; the hue page beside it lays out one hue as the Munsell book does, value up the page and chroma across. This is an approximate rendering, computed through CIELAB and limited to what a display can show — chips beyond that are left empty. Real colour work uses the published Munsell renotation data and physical chips.`, 0.66, { minH: 340 });
    const ctl = K.controls(L.side, [
      { id: 'hue', label: 'Hue', min: 2.5, max: 100, step: 2.5, value: 5, fmt: hueName },
      { id: 'val', label: 'Value (lightness)', min: 1, max: 9, step: 1, value: 5 },
      { id: 'chr', label: 'Chroma (distance from grey)', min: 0, max: 14, step: 1, value: 8 },
      { id: 'view', type: 'select', label: 'Show', options: [['Wheel and hue page', 'both'], ['Hue wheel only', 'wheel'], ['Hue page only', 'page']], value: L.st.W < 520 ? 'wheel' : 'both' },
      { type: 'html', html: 'Click a wedge of the wheel or a chip of the page to choose it.' }
    ], () => draw());
    const ro = K.readout(L.side, [['note', 'Notation'], ['rgb', 'On a screen (sRGB)'], ['lab', 'CIELAB'], ['Y', 'Luminous reflectance Y'], ['comp', 'Complementary hue'], ['disp', 'Within a display?']]);

    function geo() {
      const W = L.st.W, Hh = L.st.H, v = ctl.values.view, ah = Hh - 48, showW = v !== 'page', showP = v !== 'wheel', both = showW && showP, aw = both ? Math.round(W * 0.55) : W;
      const R = Math.max(30, Math.min(aw, ah) / 2 - 28), px0 = showW ? aw + 4 : 8, pw = Math.max(60, W - px0 - 8);
      const cell = clamp(Math.floor(Math.min((pw - 26) / 8, (ah - 66) / 9)), 12, 48);
      return { W, Hh, ah, showW, showP, aw, R, r0: R * 0.2, cx: both ? aw / 2 : W / 2, cy: ah / 2 + 4, px0, pw, cell, gx: px0 + 26 + ((pw - 26) - 8 * cell) / 2, gy: 58 };
    }
    function wedge(c, cx, cy, r0, r1, a0, a1) { c.beginPath(); c.arc(cx, cy, r1, a0, a1); c.arc(cx, cy, r0, a1, a0, true); c.closePath(); }
    const outline = c => { const Cc = colors(); c.lineWidth = 4.5; c.strokeStyle = Cc.bg2; c.stroke(); c.lineWidth = 2; c.strokeStyle = Cc.text; c.stroke(); };

    function draw() {
      const c = L.st.begin(), Cc = colors(), g = geo(), V = ctl.values, h0 = V.hue, val = V.val, chr = V.chr;
      const m = Cl.munsell(h0, val, chr), hueIdx = Math.round(h0 / 2.5) - 1, ringIdx = clamp(Math.round(chr / 2) - 1, 0, RINGS.length - 1);
      if (g.showW) {
        const { cx, cy, R, r0 } = g, dr = (R - r0) / RINGS.length;
        label(c, 'Hue wheel at value ' + val, 10, 14, { weight: 650, color: Cc.text, size: 13 });
        for (let i = 0; i < 40; i++) {
          const h = 2.5 * (i + 1), a = (-90 + 3.6 * h) * D2R, half = 4.5 * D2R;
          for (let k = 0; k < RINGS.length; k++) {
            const mm = Cl.munsell(h, val, RINGS[k]);
            wedge(c, cx, cy, r0 + dr * k, r0 + dr * (k + 1), a - half, a + half);
            if (mm.inGamut) { c.fillStyle = rgbCss(mm.rgb); c.fill(); c.lineWidth = 0.8; c.strokeStyle = Cc.bg2; c.stroke(); }
            else { c.save(); c.globalAlpha = 0.55; c.lineWidth = 1; c.strokeStyle = Cc.faint; c.stroke(); c.restore(); }
          }
        }
        const hub = Cl.munsell(h0, val, 0).rgb;
        c.beginPath(); c.arc(cx, cy, r0 - 2, 0, TAU); c.fillStyle = rgbCss(hub); c.fill(); c.lineWidth = 1; c.strokeStyle = Cc.bg2; c.stroke();
        label(c, 'N ' + val, cx, cy, { align: 'center', color: textOn(hub), size: 11.5, weight: 650 });
        for (let k = 0; k < 10; k++) { const a = (-90 + 3.6 * (5 + 10 * k)) * D2R; label(c, Cl.MUNSELL_HUES[k], cx + (R + 15) * Math.cos(a), cy + (R + 15) * Math.sin(a), { align: 'center', color: Cc.text, weight: 650, size: 12 }); }
        if (chr === 0) { c.beginPath(); c.arc(cx, cy, r0 - 2, 0, TAU); outline(c); }
        else { const a = (-90 + 3.6 * 2.5 * (hueIdx + 1)) * D2R, half = 4.5 * D2R; wedge(c, cx, cy, r0 + dr * ringIdx, r0 + dr * (ringIdx + 1), a - half, a + half); outline(c); }
        label(c, 'chroma 2, 4 … 14 outwards', 10, g.ah - 2, { size: 10.5 });
      }
      if (g.showP) {
        const { gx, gy, cell } = g;
        label(c, 'Hue page ' + hueName(h0), g.px0, 14, { weight: 650, color: Cc.text, size: 13 });
        label(c, 'chroma', gx + 4 * cell, gy - 30, { align: 'center', size: 10.5 }); label(c, 'value', g.px0 + 2, gy - 12, { size: 10.5 });
        for (let i = 0; i < 8; i++) label(c, String(2 * i), gx + (i + 0.5) * cell, gy - 12, { align: 'center', size: 10.5 });
        for (let v = 1; v <= 9; v++) {
          label(c, String(v), gx - 7, gy + (9 - v + 0.5) * cell, { align: 'right', size: 10.5 });
          for (let i = 0; i < 8; i++) {
            const mm = Cl.munsell(h0, v, 2 * i);
            rrect(c, gx + i * cell + 1.5, gy + (9 - v) * cell + 1.5, cell - 3, cell - 3, 4);
            if (mm.inGamut) { c.fillStyle = rgbCss(mm.rgb); c.fill(); } else { c.lineWidth = 1; c.strokeStyle = Cc.grid; c.stroke(); }
          }
        }
        rrect(c, gx + clamp(Math.round(chr / 2), 0, 7) * cell + 1.5, gy + (9 - val) * cell + 1.5, cell - 3, cell - 3, 4); outline(c);
      }
      /* the chosen colour */
      swatch(c, 12, g.ah + 8, 34, 34, m.rgb);
      label(c, Cl.munsellName(h0, val, chr), 56, g.ah + 17, { size: 14, weight: 650, color: Cc.text });
      label(c, hex(m.rgb) + (m.inGamut ? '' : ' (nearest a display can show)'), 56, g.ah + 36, { size: 11.5 });
      /* ---- read-outs */
      const hc = (h0 + 50) % 100;
      ro.set('note', Cl.munsellName(h0, val, chr));
      ro.set('rgb', 'R ' + m.rgb[0] + ' · G ' + m.rgb[1] + ' · B ' + m.rgb[2] + ' · ' + hex(m.rgb));
      ro.set('lab', 'L* ' + f(m.lab[0], 1) + ' · a* ' + f(m.lab[1], 1) + ' · b* ' + f(m.lab[2], 1));
      ro.set('Y', f(m.Y * 100, 1) + ' % of a perfect white');
      ro.set('comp', chr === 0 ? 'none: it is a grey' : hueName(hc) + ' (hue ' + f(hc === 0 ? 100 : hc, 1) + ')');
      ro.set('disp', m.inGamut ? 'yes' : 'no: the nearest colour a display can show is drawn');
    }
    function pickAt(p) {
      const g = geo();
      if (g.showW) {
        const dx = p.x - g.cx, dy = p.y - g.cy, rho = Math.hypot(dx, dy);
        if (rho <= g.R + 2) {
          if (rho < g.r0) return { chr: 0 };
          const ang = (((Math.atan2(dy, dx) / D2R + 90) % 360) + 360) % 360, hue = Math.round(ang / 3.6 / 2.5) * 2.5;
          return { hue: hue === 0 ? 100 : hue, chr: RINGS[Math.min(RINGS.length - 1, Math.floor((rho - g.r0) / (g.R - g.r0) * RINGS.length))] };
        }
      }
      if (g.showP) { const i = Math.floor((p.x - g.gx) / g.cell), j = Math.floor((p.y - g.gy) / g.cell); if (i >= 0 && i < 8 && j >= 0 && j < 9) return { val: 9 - j, chr: 2 * i }; }
      return null;
    }
    K.click(L.st, p => {
      const r = pickAt(p); if (!r) return;
      if (r.hue != null) ctl.set('hue', r.hue); if (r.val != null) ctl.set('val', r.val); if (r.chr != null) ctl.set('chr', r.chr);
      draw();
    }, p => !!pickAt(p));
    L.st.onResize(draw); T.util.onTheme(draw); draw();
    L.under.innerHTML = T.util.box('Hue, value and chroma', `<p class="small muted" style="margin:0">Hue is written as a number from 0 to 10 and one or two letters: 5R is the middle of the red family, 5Y the middle of the yellow family, and 10R and 2.5YR lie between them. Value 5 is a middle grey. Chroma has no fixed top: strong reds and yellows reach 14 or more at middle values, while very light and very dark colours reach far less, which is why the Munsell colour solid is lopsided and why some chips on a hue page are empty. Colours opposite each other on the wheel, 50 hue steps apart, are roughly complementary: mixed in the right proportions they give a grey.</p>`) +
      T.util.more(['the-munsell-colour-system', 'colour-wheels-and-harmony', 'colour-spaces-and-gamuts']);
  }

  /* ================================================================ 4 · mixing colours */
  /* a plain colour name for an sRGB colour, so that a region can say what it looks like */
  function nameOf(rgb) {
    const mx = Math.max(rgb[0], rgb[1], rgb[2]), mn = Math.min(rgb[0], rgb[1], rgb[2]), d = mx - mn;
    if (mx < 30) return 'black';
    if (d < 0.14 * mx) return mx > 215 ? 'white' : 'grey';
    let h = mx === rgb[0] ? ((rgb[1] - rgb[2]) / d) % 6 : mx === rgb[1] ? (rgb[2] - rgb[0]) / d + 2 : (rgb[0] - rgb[1]) / d + 4;
    h = ((h * 60) + 360) % 360;
    const nm = h < 15 || h >= 345 ? 'red' : h < 40 ? 'orange' : h < 70 ? 'yellow' : h < 160 ? 'green' : h < 200 ? 'cyan' : h < 255 ? 'blue' : h < 290 ? 'purple' : 'magenta';
    return mx < 100 ? 'dark ' + nm : nm;
  }
  const describe = rgb => nameOf(rgb) + ' · ' + hex(rgb) + ' (' + rgb.join(', ') + ')';

  function mixing(el) {
    const L = T.util.lab(el, `Colours mix in two opposite ways. Lights add: every lamp that shines on a spot puts more light there. Filters and inks subtract: every layer takes some of the light away. Switch between three overlapping lamps and three overlapping filters, change their strength, and watch the overlaps. The sums are made in linear light, as light really adds, and only then turned into the values a screen is sent.`, 0.7);
    const pc = v => Math.round(v * 100) + ' %';
    const ctl = K.controls(L.side, [
      { id: 'mode', type: 'select', label: 'Mixing', options: [['Additive: three lamps', 'add'], ['Subtractive: three filters', 'sub']], value: 'add' },
      { id: 'ir', label: 'Red lamp', min: 0, max: 1, step: 0.05, value: 1, fmt: pc },
      { id: 'ig', label: 'Green lamp', min: 0, max: 1, step: 0.05, value: 1, fmt: pc },
      { id: 'ib', label: 'Blue lamp', min: 0, max: 1, step: 0.05, value: 1, fmt: pc },
      { id: 'dc', label: 'Cyan filter, density', min: 0, max: 3, step: 0.05, value: 2, fmt: v => v.toFixed(2) },
      { id: 'dm', label: 'Magenta filter, density', min: 0, max: 3, step: 0.05, value: 2, fmt: v => v.toFixed(2) },
      { id: 'dy', label: 'Yellow filter, density', min: 0, max: 3, step: 0.05, value: 2, fmt: v => v.toFixed(2) }
    ], () => draw());
    const roA = K.readout(L.side, [['rg', 'Red + green'], ['gb', 'Green + blue'], ['rb', 'Red + blue'], ['rgb', 'All three']]);
    const roS = K.readout(L.side, [['cm', 'Cyan + magenta'], ['cy', 'Cyan + yellow'], ['my', 'Magenta + yellow'], ['cmy', 'All three']]);
    let shown = '';
    const NOTE = {
      add: 'In additive mixing the primaries are <b>red, green and blue</b>, lights chosen to excite the three kinds of cone in the eye in very different amounts: lights add, so each lamp that joins in brings more light. Red and green make yellow, green and blue make cyan, red and blue make magenta, and all three make white.',
      sub: 'In subtractive mixing the primaries are <b>cyan, magenta and yellow</b>: filters, dyes and inks take light away, so each layer leaves less. Cyan removes red, magenta removes green and yellow removes blue; where two overlap only one colour of light survives — red, green or blue — and all three leave almost nothing. The density is the optical density: 1 passes a tenth of the colour it absorbs, 2 a hundredth.'
    };

    /* the discs are painted in layers: singles, then the pairs (clipped to one disc), then the triple, so the edges stay exact */
    function venn(c, P, r, k) {
      const disc = i => { c.beginPath(); c.arc(P[i][0], P[i][1], r, 0, TAU); };
      for (let i = 0; i < 3; i++) { disc(i); c.fillStyle = rgbCss(k.one[i]); c.fill(); }
      [[0, 1], [0, 2], [1, 2]].forEach(([i, j], n) => { c.save(); disc(i); c.clip(); disc(j); c.fillStyle = rgbCss(k.two[n]); c.fill(); c.restore(); });
      c.save(); disc(0); c.clip(); disc(1); c.clip(); disc(2); c.fillStyle = rgbCss(k.three); c.fill(); c.restore();
    }
    function draw() {
      const V = ctl.values, add = V.mode === 'add', c = L.st.begin(add ? '#07080c' : '#fbfaf6'), W = L.st.W, Hh = L.st.H;
      if (shown !== V.mode) {
        shown = V.mode;
        for (const id of ['ir', 'ig', 'ib']) ctl.show(id, add);
        for (const id of ['dc', 'dm', 'dy']) ctl.show(id, !add);
        roA.show(add); roS.show(!add);
        L.under.innerHTML = T.util.box(add ? 'Lights add' : 'Filters subtract', '<p class="small muted" style="margin:0">' + NOTE[V.mode] + '</p>') + T.util.more(['additive-and-subtractive-mixing', 'trichromatic-colour-vision', 'colour-wheels-and-harmony']);
      }
      /* the colour of every region, computed in linear light */
      let k;
      if (add) {
        const a = [V.ir, V.ig, V.ib], mixOf = idx => Cl.srgb(idx.reduce((s, i) => { s[i] += a[i]; return s; }, [0, 0, 0]));
        k = { one: [mixOf([0]), mixOf([1]), mixOf([2])], two: [mixOf([0, 1]), mixOf([0, 2]), mixOf([1, 2])], three: mixOf([0, 1, 2]) };
      } else {
        const tr = [[O.transmittance(V.dc), 1, 1], [1, O.transmittance(V.dm), 1], [1, 1, O.transmittance(V.dy)]], passOf = idx => Cl.srgb(idx.reduce((s, i) => s.map((v, j) => v * tr[i][j]), [1, 1, 1]));
        k = { one: [passOf([0]), passOf([1]), passOf([2])], two: [passOf([0, 1]), passOf([0, 2]), passOf([1, 2])], three: passOf([0, 1, 2]) };
      }
      /* geometry: three discs, two on top and one below */
      const r = Math.max(30, Math.min((W - 30) / 3, (Hh - 64) / 2.87)), rho = 0.58 * r, gy = Hh / 2 - 0.145 * r, G = [W / 2, gy];
      const P = [[G[0] - 0.866 * rho, gy - 0.5 * rho], [G[0] + 0.866 * rho, gy - 0.5 * rho], [G[0], gy + rho]];
      venn(c, P, r, k);
      c.lineWidth = 1.2; c.strokeStyle = add ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.25)';
      for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(P[i][0], P[i][1], r, 0, TAU); c.stroke(); }
      const away = (pt, d) => { const u = unit(G, pt); return [pt[0] + u[0] * d, pt[1] + u[1] * d]; };
      const mid = (i, j) => [(P[i][0] + P[j][0]) / 2, (P[i][1] + P[j][1]) / 2], fs = clamp(r * 0.14, 10.5, 15);
      const spots = [[away(P[0], 0.5 * r), k.one[0]], [away(P[1], 0.5 * r), k.one[1]], [away(P[2], 0.5 * r), k.one[2]], [away(mid(0, 1), 0.4 * r), k.two[0]], [away(mid(0, 2), 0.4 * r), k.two[1]], [away(mid(1, 2), 0.4 * r), k.two[2]], [G, k.three]];
      for (const [pt, rgb] of spots) label(c, nameOf(rgb), pt[0], pt[1], { align: 'center', color: textOn(rgb), size: fs, weight: 650 });
      const tag = add ? ['red lamp', 'green lamp', 'blue lamp'] : ['cyan filter', 'magenta filter', 'yellow filter'], tc = add ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.6)';
      label(c, tag[0], 12, 16, { color: tc, size: 11.5 });
      label(c, tag[1], W - 12, 16, { color: tc, size: 11.5, align: 'right' });
      label(c, tag[2], W / 2, Hh - 12, { color: tc, size: 11.5, align: 'center' });
      /* ---- read-outs */
      if (add) { roA.set('rg', describe(k.two[0])); roA.set('rb', describe(k.two[1])); roA.set('gb', describe(k.two[2])); roA.set('rgb', describe(k.three)); }
      else { roS.set('cm', describe(k.two[0])); roS.set('cy', describe(k.two[1])); roS.set('my', describe(k.two[2])); roS.set('cmy', describe(k.three)); }
    }
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }

  /* ================================================================ 5 · colour-vision deficiency */
  const PALETTE = [
    ['Traffic light', [['red', [215, 25, 32]], ['amber', [255, 191, 0]], ['green', [0, 153, 76]]]],
    ['Rainbow', [['red', [230, 35, 35]], ['orange', [250, 140, 30]], ['yellow', [250, 225, 50]], ['green', [50, 170, 70]], ['blue', [40, 90, 210]], ['violet', [140, 60, 170]]]],
    ['Skin and food', [['pale skin', [244, 208, 177]], ['brown skin', [120, 76, 50]], ['ripe tomato', [214, 58, 40]], ['green tomato', [150, 170, 60]], ['banana', [244, 217, 76]]]],
    ['Resistor colour code', [['brown 1', [121, 66, 36]], ['red 2', [216, 34, 34]], ['orange 3', [242, 120, 25]], ['green 5', [40, 150, 60]], ['blue 6', [45, 90, 200]], ['violet 7', [140, 70, 170]]]],
    ['Wiring colours', [['brown', [120, 70, 40]], ['blue', [30, 100, 200]], ['black', [25, 25, 25]], ['grey', [150, 150, 150]], ['green', [40, 160, 70]], ['yellow', [240, 210, 40]]]]
  ];
  const EFFECT = {
    protan: 'The long-wave (L) cones are missing or shifted. Reds look darker and duller and can be confused with browns, greens and black; red lights are dim.',
    deutan: 'The medium-wave (M) cones are missing or shifted. Greens lose their richness, and reds, greens, browns and oranges of similar lightness are confused.',
    tritan: 'The short-wave (S) cones are missing or altered. Blues look greener, yellows look pale or pinkish, and blue and green, or yellow and violet, are confused.',
    achroma: 'Without working cones only the rods respond: the world is seen in greys, glare is uncomfortable and fine detail is poor. This view shows lightness only.'
  };
  /* the digits of the plate, in seven bars (a top, b upper right, c lower right, d bottom, e lower left, f upper left, g middle), in the disc of radius 1 */
  const BARS = { a: [-0.45, -0.78, 0.45, -0.58], b: [0.25, -0.78, 0.45, 0], c: [0.25, 0, 0.45, 0.78], d: [-0.45, 0.58, 0.45, 0.78], e: [-0.45, 0, -0.25, 0.78], f: [-0.45, -0.78, -0.25, 0], g: [-0.45, -0.1, 0.45, 0.1] };
  const DIGITS = { 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgecd', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
  const inDigit = (d, x, y) => (DIGITS[d] || '').split('').some(k => { const r = BARS[k]; return x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3]; });
  const mulberry32 = a => () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const labRgb = (l, a, b) => Cl.srgb(Cl.toRgb(Cl.fromLab([l, a, b])));
  let DOTS = null;
  /* a fixed scatter of non-overlapping dots of random sizes; each dot has a green and an orange of the same lightness */
  function plateDots() {
    if (DOTS) return DOTS;
    const rnd = mulberry32(20261003), dots = [];
    for (const [rmin, rmax, tries] of [[0.055, 0.075, 300], [0.038, 0.05, 1500], [0.026, 0.035, 5000], [0.016, 0.024, 7000]]) {
      for (let k = 0; k < tries; k++) {
        const r = rmin + (rmax - rmin) * rnd(), a = rnd() * TAU, d = Math.sqrt(rnd()) * (0.985 - r), x = d * Math.cos(a), y = d * Math.sin(a);
        let free = true;
        for (let i = 0; i < dots.length && free; i++) { const q = dots[i], dx = q.x - x, dy = q.y - y, m = q.r + r + 0.007; free = dx * dx + dy * dy >= m * m; }
        if (free) dots.push({ x, y, r });
      }
    }
    for (const d of dots) { const l = 56 + 20 * rnd(); d.g = labRgb(l, -44 + 16 * rnd(), 18 + 26 * rnd()); d.o = labRgb(l, 26 + 20 * rnd(), 24 + 26 * rnd()); }
    return (DOTS = dots);
  }

  function deficiency(el) {
    const lk = ['colour-vision-tests', 'colour-vision-deficiency'].map(id => T.util.link(id)).filter(Boolean);
    const L = T.util.lab(el, `What does a person with a colour-vision deficiency see? Choose a type and a severity, compare each colour as designed with the same colour as seen, and look at a dot plate in which a number is hidden in greens against oranges of matching lightness. This is a demonstration, not a clinical test: a screen, its settings and a simple model are no substitute for the tests an eye-care professional uses.` + (lk.length ? ' Read more:' + lk.join(',') + '.' : ''), 0.56);
    const ctl = K.controls(L.side, [
      { id: 'type', type: 'select', label: 'Type', options: Cl.CVD_INFO.map(i => [i.name, i.id]), value: 'deutan' },
      { id: 'sev', label: 'Severity (0 normal, 1 complete)', min: 0, max: 1, step: 0.05, value: 1 },
      { id: 'view', type: 'select', label: 'Dot plate shows', options: [['As designed', 'designed'], ['As seen', 'seen'], ['Both, side by side', 'both']], value: 'both' },
      { id: 'digit', type: 'select', label: 'Number on the plate', options: [2, 3, 4, 5, 6, 7, 8, 9].map(d => [String(d), d]), value: 5 }
    ], () => draw());
    const ro = K.readout(L.side, [['cond', 'Condition'], ['share', 'How common'], ['what', 'What changes']]);
    let seenKey = '', seen = null;
    const seenDots = (type, sev) => {
      const key = type + '|' + sev;
      if (key !== seenKey) { seenKey = key; seen = plateDots().map(d => ({ g: Cl.cvd(d.g, type, sev), o: Cl.cvd(d.o, type, sev) })); }
      return seen;
    };
    function plate(c, cx, cy, R, V, asSeen) {
      const dots = plateDots(), cols = asSeen ? seenDots(V.type, V.sev) : null, paper = [236, 230, 214];
      c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fillStyle = rgbCss(asSeen ? Cl.cvd(paper, V.type, V.sev) : paper); c.fill();
      dots.forEach((d, i) => {
        const fig = inDigit(V.digit, d.x, d.y), col = asSeen ? (fig ? cols[i].g : cols[i].o) : (fig ? d.g : d.o);
        c.beginPath(); c.arc(cx + d.x * R, cy + d.y * R, Math.max(0.5, d.r * R), 0, TAU); c.fillStyle = rgbCss(col); c.fill();
      });
    }
    function paletteHtml(V) {
      return PALETTE.map(([group, items]) => '<div style="margin:8px 0"><div class="small muted" style="margin-bottom:4px">' + esc(group) + '</div><div style="display:flex;flex-wrap:wrap;gap:8px">' +
        items.map(([nm, rgb]) => '<div style="width:68px;text-align:center"><div style="display:flex;border:1px solid var(--border);border-radius:7px;overflow:hidden"><span style="flex:1;height:34px;background:' + rgbCss(rgb) + '"></span><span style="flex:1;height:34px;background:' + rgbCss(Cl.cvd(rgb, V.type, V.sev)) + '"></span></div><div class="small muted" style="font-size:11px;margin-top:2px">' + esc(nm) + '</div></div>').join('') + '</div></div>').join('');
    }
    const more = T.util.more(['colour-vision-deficiency', 'colour-vision-tests', 'trichromatic-colour-vision', 'opponent-colours']);
    function draw() {
      const c = L.st.begin(), Cc = colors(), V = ctl.values, W = L.st.W, Hh = L.st.H, info = Cl.CVD_INFO.find(i => i.id === V.type) || Cl.CVD_INFO[0];
      const both = V.view === 'both', R = Math.max(30, Math.min(both ? W / 4 - 14 : W / 2 - 18, Hh / 2 - 30)), cy = Hh / 2 - 8, short = info.name.split(' ')[0] + ', severity ' + Math.round(V.sev * 100) + ' %';
      const draws = V.view === 'designed' ? [[W / 2, false]] : V.view === 'seen' ? [[W / 2, true]] : [[W / 4, false], [3 * W / 4, true]];
      for (const [cx, asSeen] of draws) {
        plate(c, cx, cy, R, V, asSeen);
        label(c, asSeen ? 'As seen: ' + short : 'As designed', cx, cy + R + 18, { align: 'center', color: Cc.text, size: 12.5, weight: 650 });
      }
      ro.set('cond', info.name); ro.set('share', info.share); ro.set('what', EFFECT[V.type] || '');
      L.under.innerHTML = T.util.box('The same colours, as designed (left half of each pair) and as seen (right half)', paletteHtml(V)) + more;
    }
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }
})();
