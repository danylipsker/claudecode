/* HYPER-CORE · ui/optics-beams.js — Tools → Lasers & beams (#/tools/beams/<gaussian|resonator|diffraction|grating|shaping|lasers>)
 *
 *   gaussian     a Gaussian beam through up to three thin lenses (focus, collimate, expand, relay): the beam as a filled
 *                envelope ±w(z), the waists, the Rayleigh ranges, the far-field cone, a cross-section at a z you drag
 *   resonator    the stability diagram (g1, g2) with a draggable cavity point, the cavity drawn with its mode (or a ray that
 *                walks out), mode spacing and how many longitudinal modes fit under the gain line
 *   diffraction  single slit, double slit, N slits, round hole, two points: set-up, the pattern as it looks, the intensity
 *                curve (linear or logarithmic), white light, the Rayleigh criterion, the Fresnel number
 *   grating      the grating equation: every allowed order fanned out, laser line, white light, mercury, sodium doublet,
 *                dispersion, resolving power and the Littrow angle
 *   shaping      points, lines and shapes from a beam: focusing lens, cylinder lens, Powell lens, axicon, flat-top shaper,
 *                microlens homogenizer, diffractive pattern generator
 *   lasers       the laser families on a wavelength axis, a table for each laser, and a safety calculator for visible
 *                continuous beams (a teaching model)
 *
 * The mathematics is kit.optics (optics-wave.js: O.beam, O.laser, O.diff, O.LASERS; optics-vision.js: O.shape); the drawing
 * is kit.osym; shared helpers are T.util (optictools.js). Local helpers: si() formats a number with its SI prefix, the
 * cavity mode at the exact confocal point (the engine's formula is 0/0 there), a log-axis spectrum painter, and the
 * Rayleigh-pair two-point pattern. Every input goes through kit.controls and every pointer action through kit.drag or
 * kit.click, so that the headless test (tools/labtest.js) can drive them.
 */
(function () {
  'use strict';
  const H = window.Hyper, ui = H.ui, U = H.util, esc = U.esc, K = H.kit, O = H.optics, S = H.osym;
  const T = H.opticsTools = H.opticsTools || {};
  const TABS = [['gaussian', 'Gaussian beam'], ['resonator', 'Laser cavity'], ['diffraction', 'Slits and apertures'], ['grating', 'Diffraction grating'], ['shaping', 'Shaping a beam'], ['lasers', 'Laser families and safety']];
  T.beams = function (el, params, sub) {
    const t = T.util.subtabs(el, 'beams', TABS, sub, 'Beams here are idealized: ideal thin lenses, perfect Gaussian modes (scaled by M²), far-field diffraction formulas. Never look into a laser beam or its reflection.');
    ({ gaussian, resonator, diffraction, grating, shaping, lasers })[t.tab](t.body);
  };
  T.beams.tabs = TABS.map(t => t[0]);

  /* ================================================================ small helpers */
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, R2D = 180 / PI, fin = Number.isFinite, clamp = O.clamp, f = T.util.f;
  const colors = () => K.colors();
  const sg = (v, d) => fin(v) ? String(+v.toPrecision(d || 3)).replace('-', '−') : '—';
  const PRE = [[-12, 'p'], [-9, 'n'], [-6, 'µ'], [-3, 'm'], [0, ''], [3, 'k'], [6, 'M'], [9, 'G'], [12, 'T']];
  /* a number with its SI prefix: si(2.5e-5, 'm') -> '25 µm' */
  function si(x, unit, d) {
    if (!fin(x)) return '—';
    if (Math.abs(x) < 1e-15) return '0 ' + unit;
    const e = clamp(Math.floor(Math.log10(Math.abs(x)) / 3) * 3, -12, 12);
    return sg(x / Math.pow(10, e), d) + ' ' + PRE.find(p => p[0] === e)[1] + unit;
  }
  const irr = wm2 => si(wm2 * 1e-4, 'W/cm²');                                 // irradiance given in W/m²
  const invisible = nm => nm < 380 || nm > 780;
  const kindOf = nm => nm < 380 ? 'ultraviolet, invisible' : nm > 780 ? 'infrared, invisible' : O.colourName(nm);
  const txt = (c, s, x, y, o) => K.label(c, s, x, y, Object.assign({ size: 11.5, color: colors().muted }, o));
  const head = (el, s) => el.appendChild(ui.el('<h4 style="margin:10px 0 0;font-size:13.5px">' + s + '</h4>'));
  function path(c, pts, close) {
    pts = pts.filter(p => fin(p[0]) && fin(p[1]));
    c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (close) c.closePath();
  }
  function stroke(c, pts, col, w, dash) { if (pts.length < 2) return; c.save(); c.strokeStyle = col; c.lineWidth = w || 1; c.lineJoin = 'round'; c.setLineDash(dash || []); path(c, pts); c.stroke(); c.restore(); }
  function fillPoly(c, pts, col) { if (pts.length < 3) return; c.save(); c.fillStyle = col; path(c, pts, true); c.fill(); c.restore(); }
  function disc(c, x, y, r, col, line) { if (!fin(x) || !fin(y)) return; c.beginPath(); c.arc(x, y, Math.max(0.5, r), 0, TAU); c.fillStyle = col; c.fill(); if (line) { c.lineWidth = 1.4; c.strokeStyle = line; c.stroke(); } }
  /* the first of 1, 2, 5 × 10^k at or above x */
  const nice = x => { const e = Math.pow(10, Math.floor(Math.log10(x))), m = x / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e; };
  /* the common laser lines, from the table of laser families: [label, nm], with "other" first */
  function lineOptions(withOther) {
    const m = new Map();
    const add = (name, nm) => { if (!m.has(nm)) m.set(nm, name + ', ' + sg(nm, 4) + ' nm'); };
    for (const l of O.LASERS) add(l.name.replace(/ \(.*\)$/, ''), l.nm[0]);
    add('Green pointer (frequency-doubled)', 532); add('Red pointer (diode)', 650); add('Blue-violet disc laser (diode)', 405);
    const rows = [...m].sort((a, b) => a[0] - b[0]).map(([nm, s]) => [s, nm]);
    return withOther ? [['Other: use the slider', 0]].concat(rows) : rows;
  }
  /* a spectrum painted on any axis: X(nm) -> px; paints from nm0 to nm1 pixel by pixel */
  function paintSpectrum(c, X, Xinv, nm0, nm1, y, h) {
    const xa = Math.round(X(nm0)), xb = Math.round(X(nm1));
    for (let x = xa; x < xb; x++) { c.fillStyle = S.nm(clamp(Xinv(x + 0.5), nm0, nm1)); c.fillRect(x, y, 1.6, h); }
  }

  /* ================================================================ 1 · a Gaussian beam through lenses */
  /* start: w0 in mm; lenses [z (m), f (m, negative = diverging)] */
  const BEAM_PRESETS = {
    spot: { name: 'Focus a laser to a spot', nm: 632.8, w0: 1, M2: 1, bench: 0.4, zA: 0.4, P: 1, lenses: [[0.1, 0.15]],
      note: 'A wide, nearly parallel beam meets a lens and is squeezed into a waist about one focal length behind it. The waist radius is M²λf/(πw), where w is the beam radius on the lens: a wider beam or a shorter focal length gives a smaller spot, and also a shorter depth of focus (twice the Rayleigh range).' },
    diode: { name: 'Collimate a diverging diode beam', nm: 650, w0: 0.0015, M2: 1.3, bench: 1, zA: 0.02, P: 0.05, lenses: [[0.0045, 0.0045]],
      note: 'The light of a laser diode leaves a waist about a micrometre across and spreads quickly, with a half-angle near 10°. A lens one focal length from the waist turns it into a nearly parallel beam about a millimetre wide. Try the fine adjustment: moving the lens a hundredth of a millimetre turns the parallel beam into a converging one, which is why collimating lenses are focused by hand under a microscope. The distance axis is broken so that the small part near the source is stretched.' },
    galilean: { name: 'A 4× Galilean expander and a long throw', nm: 632.8, w0: 0.5, M2: 1, bench: 30, zA: 0.15, P: 0.005, lenses: [[0.03, -0.025], [0.105, 0.1]],
      note: 'A diverging lens followed by a converging one, spaced by the difference of their focal lengths (100 − 25 = 75 mm), makes the beam four times wider (the ratio of the focal lengths) and leaves it nearly parallel. A wider beam spreads four times less, so after a long throw it is narrower than the untouched beam: compare the last two read-outs. There is no real focus inside the expander.' },
    keplerian: { name: 'A 4× Keplerian expander and a long throw', nm: 632.8, w0: 0.5, M2: 1, bench: 30, zA: 0.2, P: 0.005, lenses: [[0.03, 0.025], [0.155, 0.1]],
      note: 'Two converging lenses spaced by the sum of their focal lengths (25 + 100 = 125 mm) also expand the beam four times, but the beam passes through a tiny focus between them. With a powerful pulsed laser that focus can ionize the air, which is why high-power expanders are Galilean. A small pinhole at the focus would clean the beam of stray light.' },
    relay: { name: 'A relay: the waist is imaged again', nm: 632.8, w0: 0.05, M2: 1, bench: 0.5, zA: 0.5, P: 0.1, lenses: [[0.1, 0.1], [0.3, 0.1]],
      note: 'The source waist sits one focal length before the first lens, so the beam makes a new, larger waist one focal length behind it. The second lens, one focal length beyond that waist, builds a waist of the original size another focal length on: four focal lengths from the source to its image.' }
  };

  function gaussian(el) {
    const L = T.util.lab(el, 'A laser beam is not a bundle of straight rays but a Gaussian beam: it narrows to a waist w₀ and then spreads again, at an angle that is smaller the wider the waist. Choose a laser line and a source, then add up to three thin lenses to focus, collimate, expand or relay the beam. The band is the beam, drawn out to the radius w(z) where the intensity has fallen to 1/e² (13.5 %) of the peak; its width is magnified a great deal compared with the distances, as the scale bar says. Drag a lens along the bench, or drag the dashed line to see the beam’s cross-section anywhere.', 0.64, { minH: 430 });
    const B = O.beam, LINES = lineOptions(true);
    const lenses = [0, 1, 2].map(() => ({ z: 0.1, fa: 0.1, div: false, fine: 0 }));
    let base = 'spot', sel = 0, bench = 0.4, zA = 0.4, lay = null;
    const broken = () => bench > 4 * zA, zone = () => broken() ? zA : bench;
    const ctl = K.controls(L.side, [
      { id: 'preset', type: 'select', label: 'Start from', options: Object.keys(BEAM_PRESETS).map(k => [BEAM_PRESETS[k].name, k]).concat([['Your own set-up', 'custom']]), value: 'spot' },
      { id: 'line', type: 'select', label: 'Laser line', options: LINES, value: 632.8 },
      { id: 'nm', label: 'Wavelength λ', min: 180, max: 12000, value: 632.8, log: true, sig: 4, unit: 'nm' },
      { id: 'w0', label: 'Waist radius of the source, w₀', min: 0.001, max: 5, value: 1, log: true, sig: 3, fmt: v => si(v * 1e-3, 'm') },
      { id: 'M2', label: 'Beam quality M²', min: 1, max: 20, value: 1, log: true, sig: 2, fmt: v => 'M² = ' + sg(v, 2) },
      { id: 'P', label: 'Laser power (for the irradiance)', min: 0.001, max: 1000, value: 1, log: true, sig: 3, fmt: v => si(v, 'W') },
      { id: 'n', label: 'Number of lenses', min: 0, max: 3, step: 1, value: 1 },
      { id: 'bench', label: 'Bench length', min: 0.05, max: 200, value: 0.4, log: true, sig: 3, fmt: v => si(v, 'm') },
      { id: 'probe', label: 'Cross-section at', min: 0, max: 1, step: 0.005, value: 0.9, fmt: v => si(v * bench, 'm') },
      { id: 'sel', type: 'select', label: 'Edit', options: [['Lens 1', 0], ['Lens 2', 1], ['Lens 3', 2]], value: 0 },
      { id: 'f', label: 'Focal length of this lens (size)', min: 0.005, max: 5, value: 0.15, log: true, sig: 3, fmt: v => si(v, 'm') },
      { id: 'div', type: 'check', label: 'This lens is diverging (negative focal length)', value: false },
      { id: 'pos', label: 'Position of this lens', min: 0, max: 1, step: 0.002, value: 0.25, fmt: v => si(v * zone(), 'm') },
      { id: 'fine', label: 'Fine adjustment of this lens', min: -1, max: 1, step: 0.001, value: 0, unit: 'mm' },
      { type: 'html', html: 'Drag a lens along the bench, or the dashed line to move the cross-section.' }
    ], onChange);
    const V = ctl.values;
    const ro = K.readout(L.side, [['s0', 'Beam from the source'], ['s1', 'After lens 1'], ['s2', 'After lens 2'], ['s3', 'After lens 3'], ['spot', 'Spot and depth of focus'], ['peak', 'Peak irradiance at the waist'], ['far', 'Far-field divergence'], ['end', 'Beam diameter at the end'], ['none', 'Without the lenses'], ['probe', 'Beam diameter at the cross-section']]);
    L.under.innerHTML = '<p class="small muted mt bnote"></p><p class="small muted mt">Shaded bands mark the Rayleigh range on either side of each waist, where the beam is no wider than √2 times the waist. The dashed lines are the far-field cone, whose half-angle is M²λ/(πw₀). Whatever the lenses do, the product w₀ × θ, the beam parameter product, stays at M²λ/π: a smaller waist always means a faster spread.</p>' +
      T.util.more(['the-gaussian-beam', 'beam-waist-and-divergence', 'rayleigh-range', 'beam-quality-m-squared', 'focusing-a-laser-beam', 'collimating-a-laser-diode', 'beam-expanders', 'gaussian-beams-through-lenses']);
    const noteEl = ui.$('.bnote', L.under);

    const effZ = l => clamp(l.z + l.fine * 1e-3, 0, bench);
    function setZ(i, z) {
      const n = V.n, g = 0.004 * zone(), lo = i > 0 ? lenses[i - 1].z + g : 0.002 * zone(), hi = i + 1 < n ? lenses[i + 1].z - g : zone();
      lenses[i].z = clamp(z, lo, Math.max(lo, hi));
    }
    function fixOrder() { for (let i = 1; i < 3; i++) if (lenses[i].z < lenses[i - 1].z + 0.004 * zone()) lenses[i].z = Math.min(zone(), lenses[i - 1].z + 0.004 * zone()); }
    function syncLens() {
      const l = lenses[sel], n = V.n;
      ctl.set('sel', sel); ctl.set('f', clamp(l.fa, 0.005, 5)); ctl.set('div', l.div); ctl.set('pos', clamp(l.z / zone(), 0, 1)); ctl.set('fine', l.fine);
      for (const id of ['sel', 'f', 'div', 'pos', 'fine']) ctl.show(id, n > 0);
    }
    function apply(id) {
      const P = BEAM_PRESETS[id]; if (!P) return;
      base = id; zA = P.zA; bench = P.bench;
      lenses.forEach((l, i) => { const s = P.lenses[i]; if (s) { l.z = s[0]; l.fa = Math.abs(s[1]); l.div = s[1] < 0; } else { l.z = Math.min(P.zA, (i ? lenses[i - 1].z : 0) + 0.2 * P.zA); l.fa = 0.1; l.div = false; } l.fine = 0; });
      ctl.set('nm', P.nm); ctl.set('line', LINES.some(o => o[1] === P.nm) ? P.nm : 0); ctl.set('w0', P.w0); ctl.set('M2', P.M2); ctl.set('P', P.P);
      ctl.set('n', P.lenses.length); ctl.set('bench', P.bench); ctl.set('preset', id); sel = 0; syncLens();
      noteEl.innerHTML = '<b>' + esc(P.name) + '.</b> ' + esc(P.note);
    }
    function onChange(id, v) {
      switch (id) {
        case 'preset': if (v !== 'custom') apply(v); draw(); return;
        case 'line': if (v) ctl.set('nm', clamp(v, 180, 12000)); break;
        case 'nm': ctl.set('line', 0); break;
        case 'n': fixOrder(); if (sel >= v) sel = Math.max(0, v - 1); syncLens(); break;
        case 'bench': bench = v; for (const l of lenses) l.z = Math.min(l.z, zone()); syncLens(); break;
        case 'sel': sel = +v; syncLens(); draw(); return;
        case 'f': lenses[sel].fa = v; break;
        case 'div': lenses[sel].div = !!v; break;
        case 'pos': setZ(sel, v * zone()); break;
        case 'fine': lenses[sel].fine = v; break;
        case 'probe': case 'P': draw(); return;
      }
      if (base !== 'custom') { base = 'custom'; ctl.set('preset', 'custom'); }
      draw();
    }

    function draw() {
      const c = L.st.begin(), C = colors(), W = L.st.W, Hh = L.st.H, nm = V.nm, n = V.n, brk = broken();
      const w0 = V.w0 * 1e-3, M2 = V.M2, vis = !invisible(nm);
      const act = lenses.slice(0, n).map((l, i) => ({ z: effZ(l), f: (l.div ? -1 : 1) * l.fa, i })).sort((a, b) => a.z - b.z);
      const tr = B.train({ w0, z0: 0, nm, M2 }, act.map(a => ({ z: a.z, f: a.f }))), segs = tr.segments;
      /* layout: the bench on top, a band below it for the ruler, the legend and the cross-section */
      const padL = 18, padR = 16, top = 34, band = clamp(Hh * 0.34, 134, 190), bot = Hh - band, cy = (top + bot) / 2, halfH = (bot - top) / 2, x0 = padL, x1 = W - padR, xb = x0 + (x1 - x0) * 0.4;
      const X = z => !brk ? x0 + (x1 - x0) * z / bench : z <= zA ? x0 + (xb - x0) * z / zA : xb + 16 + (x1 - xb - 16) * (z - zA) / (bench - zA);
      const Z = x => !brk ? bench * (x - x0) / (x1 - x0) : x <= xb ? zA * (x - x0) / (xb - x0) : x < xb + 16 ? zA : zA + (bench - zA) * (x - xb - 16) / (x1 - xb - 16);
      let maxW = 1e-12;
      for (let i = 0; i <= 240; i++) maxW = Math.max(maxW, tr.w(clamp(Z(x0 + (x1 - x0) * i / 240), 0, bench)));
      const vs = halfH * 0.62 / maxW, hw = x => tr.w(clamp(Z(x), 0, bench)) * vs, lensH = halfH * 0.86;
      const hscale = brk ? (xb - x0) / zA : (x1 - x0) / bench, mag = vs / hscale, probeZ = V.probe * bench;
      lay = { Z, cy, lensH, top, bot, probeX: X(probeZ), lenses: act.map(a => ({ i: a.i, px: X(a.z) })) };
      txt(c, sg(nm, 4) + ' nm, ' + kindOf(nm) + ' · M² = ' + sg(M2, 2) + ' · ' + si(V.P, 'W'), x0, 16, { color: C.text, weight: 650, size: 12.5 });
      /* Rayleigh ranges of the real waists */
      const real = segs.map(g => g.waistZ >= g.from - 1e-12 && g.waistZ <= g.to + 1e-12);
      segs.forEach((g, i) => {
        if (!real[i] || g.waistZ > bench) return;
        const a = X(clamp(g.waistZ - g.zR, 0, bench)), b = X(clamp(g.waistZ + g.zR, 0, bench));
        c.fillStyle = S.nm(nm, 0.13); c.fillRect(a, top, Math.max(2, b - a), bot - top);
        if (b - a > 4) stroke(c, [[a, top], [a, bot]], C.faint, 1, [3, 3]), stroke(c, [[b, top], [b, bot]], C.faint, 1, [3, 3]);
      });
      S.axis(c, x0, cy, x1);
      S.beam(c, x0, x1, cy, hw, { nm, alpha: 0.45 });
      if (brk) {                                                          // the broken axis: a gap with two slanted bars
        c.fillStyle = C.bg2; c.fillRect(xb, top - 6, 16, bot - top + 12);
        stroke(c, [[xb + 1, bot + 4], [xb + 6, top - 4]], C.axis, 1.4); stroke(c, [[xb + 10, bot + 4], [xb + 15, top - 4]], C.axis, 1.4);
      }
      /* the far-field cone of the last segment */
      const lastSeg = segs[segs.length - 1], theta = B.divergence(lastSeg.w0, nm, M2), zs = Math.max(lastSeg.waistZ, lastSeg.from, 0);
      if (fin(theta) && zs < bench) {
        const up = [], dn = [];
        for (let i = 0; i <= 80; i++) { const z = zs + (bench - zs) * i / 80, y = theta * (z - lastSeg.waistZ) * vs; up.push([X(z), cy - y]); dn.push([X(z), cy + y]); }
        stroke(c, up, C.text, 1, [6, 4]); stroke(c, dn, C.text, 1, [6, 4]);
      }
      /* waists, with their radii */
      let lastX = -1e9, lastY = 0;
      segs.forEach((g, i) => {
        if (!real[i] || g.waistZ > bench) return;
        const px = X(g.waistZ), r = g.w0 * vs, lx = clamp(px, x0 + 40, x1 - 40);
        stroke(c, [[px, cy - r], [px, cy + r]], C.text, 1.6); disc(c, px, cy, 2.6, C.text);
        let ly = cy - Math.max(r, hw(lx), 3) - 10; if (Math.abs(lx - lastX) < 96) ly = Math.min(ly, lastY - 13);
        txt(c, 'w₀ = ' + si(g.w0, 'm'), lx, ly, { align: 'center', color: C.text, size: 11 });
        lastX = lx; lastY = ly;
      });
      /* the lenses */
      act.forEach(a => {
        const px = X(a.z), on = a.i === sel;
        S.thinLens(c, px, cy, lensH, a.f, { color: on ? C.accent : undefined });
        txt(c, (a.i + 1) + ': f ' + (a.f > 0 ? '+' : '−') + si(Math.abs(a.f), 'm', 3), clamp(px, x0 + 36, x1 - 36), cy - lensH - 10, { align: 'center', color: on ? C.accent : C.muted, size: 11 });
      });
      /* the source and the scale bar */
      S.source(c, x0 - 2, cy, { kind: 'laser', color: S.nm(nm), size: 6, dir: 0 });
      const bar = nice(24 / vs), barPx = bar * vs;
      const by0 = bot - 6 - barPx;
      stroke(c, [[x0 + 8, by0], [x0 + 8, by0 + barPx]], C.text, 2); stroke(c, [[x0 + 4, by0], [x0 + 12, by0]], C.text, 1.4); stroke(c, [[x0 + 4, by0 + barPx], [x0 + 12, by0 + barPx]], C.text, 1.4);
      txt(c, 'beam radius ' + si(bar, 'm', 2), x0 + 16, by0 + barPx / 2, { size: 10.5 });
      /* the cross-section handle and line */
      stroke(c, [[lay.probeX, top - 4], [lay.probeX, bot]], C.accent, 1.5, [5, 4]);
      fillPoly(c, [[lay.probeX - 6, top - 12], [lay.probeX + 6, top - 12], [lay.probeX, top - 2]], C.accent);
      /* the ruler under the bench */
      stroke(c, [[x0, bot + 5], [x1, bot + 5]], C.axis, 1);
      const ticksOf = (a, b, px0, px1) => { const st = H.niceStep(b - a, Math.max(2, Math.floor((px1 - px0) / 90))); for (let z = Math.ceil(a / st - 1e-9) * st, k = 0; z <= b + st * 1e-9 && k < 12; z += st, k++) { const px = X(clamp(z, 0, bench)); stroke(c, [[px, bot + 5], [px, bot + 10]], C.axis, 1); txt(c, si(z, 'm', 2), clamp(px, x0 + 18, x1 - 18), bot + 21, { align: 'center', size: 10 }); } };
      if (brk) { ticksOf(0, zA, x0, xb); ticksOf(Math.ceil(zA / H.niceStep(bench - zA, 4)) * H.niceStep(bench - zA, 4), bench, xb + 16, x1); } else ticksOf(0, bench, x0, x1);
      txt(c, 'beam radius drawn ×' + sg(mag, 2) + ' against distances', x0, bot + 40, { size: 11 });
      if (brk) txt(c, 'axis broken at the double bar (left part stretched)', x0, bot + 55, { size: 11 });
      c.fillStyle = S.nm(nm, 0.25); c.fillRect(x0, bot + 66, 14, 8); txt(c, 'Rayleigh range', x0 + 20, bot + 71, { size: 11 });
      stroke(c, [[x0 + 110, bot + 70], [x0 + 130, bot + 70]], C.text, 1, [6, 4]); txt(c, 'far-field cone', x0 + 136, bot + 71, { size: 11 });
      if (!vis) txt(c, 'invisible light: drawn in a dim colour', x0, bot + 87, { size: 11, color: C.warn });
      /* the inset: the cross-section at the dashed line */
      const iw = clamp(W * 0.36, 200, 330), ih = band - 42, ix = x1 - iw, iy = bot + 34, wz = tr.w(probeZ);
      if (W > 460 && iw > 0) {
        c.fillStyle = C.surface; c.fillRect(ix, iy, iw, ih); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(ix + 0.5, iy + 0.5, iw - 1, ih - 1);
        txt(c, 'Cross-section at z = ' + si(probeZ, 'm'), ix + 8, iy + 12, { color: C.text, weight: 650, size: 11 });
        const s = Math.min(ih - 34, iw * 0.3), sx = ix + 8, sy = iy + 24;
        S.image(c, sx, sy, s, s, 40, 40, (u, v) => Math.exp(-2 * 16 * ((u - 0.5) * (u - 0.5) + (v - 0.5) * (v - 0.5))), { nm });
        const cx0 = sx + s + 16, cx1 = ix + iw - 12, base = iy + ih - 20, pk = iy + 26, XR = r => cx0 + (cx1 - cx0) * (r + 2) / 4, YI = I => base - (base - pk) * I;
        const pts = []; for (let k = 0; k <= 60; k++) { const r = -2 + 4 * k / 60; pts.push([XR(r), YI(Math.exp(-2 * r * r))]); }
        fillPoly(c, [[XR(-2), base]].concat(pts, [[XR(2), base]]), S.nm(nm, 0.3)); stroke(c, pts, S.nm(nm), 1.8);
        stroke(c, [[cx0, YI(Math.exp(-2))], [cx1, YI(Math.exp(-2))]], C.faint, 1, [2, 3]); stroke(c, [[XR(-1), YI(1)], [XR(-1), base]], C.faint, 1, [2, 3]); stroke(c, [[XR(1), YI(1)], [XR(1), base]], C.faint, 1, [2, 3]);
        stroke(c, [[cx0, base], [cx1, base]], C.axis, 1);
        [['−2w', -2], ['−w', -1], ['0', 0], ['w', 1], ['2w', 2]].forEach(([s2, r]) => txt(c, s2, XR(r), base + 8, { align: 'center', size: 9.5 }));
        txt(c, '13.5 %', cx1 - 2, YI(Math.exp(-2)) - 6, { align: 'right', size: 9.5 });
        txt(c, 'w = ' + si(wz, 'm') + ' · 86.5 % of the power inside', sx, iy + ih - 5, { size: 10 });
      }
      /* read-outs */
      segs.forEach((g, i) => {
        ro.show('s' + i, i <= n);
        const th = B.divergence(g.w0, nm, M2);
        ro.set('s' + i, (real[i] ? '' : 'virtual ') + 'waist ' + si(g.w0, 'm') + ' at z = ' + si(g.waistZ, 'm') + ' · z_R ' + si(g.zR, 'm') + ' · θ ' + si(th, 'rad'));
      });
      for (let i = segs.length; i < 4; i++) ro.show('s' + i, false);
      const spotSeg = lastSeg, sReal = real[real.length - 1];
      ro.set('spot', sReal ? '2w₀ = ' + si(2 * spotSeg.w0, 'm') + ' · depth of focus 2z_R = ' + si(2 * spotSeg.zR, 'm') : 'the last waist is virtual: no focus after the last lens');
      ro.set('peak', sReal ? irr(B.peakIrradiance(V.P, spotSeg.w0)) + ' (for ' + si(V.P, 'W') + ')' : '—');
      ro.set('far', 'half-angle ' + si(theta, 'rad') + ', full angle ' + si(2 * theta, 'rad'));
      ro.set('end', si(2 * tr.w(bench), 'm') + ' at z = ' + si(bench, 'm'));
      ro.set('none', si(2 * B.w(bench, w0, nm, M2), 'm') + ' at z = ' + si(bench, 'm'));
      ro.set('probe', si(2 * wz, 'm') + ' at z = ' + si(probeZ, 'm'));
    }

    K.drag(L.st, {
      hover: true,
      hit: p => {
        if (!lay) return null;
        for (const l of lay.lenses) if (Math.abs(p.x - l.px) < 11 && Math.abs(p.y - lay.cy) < lay.lensH + 8) return 'L' + l.i;
        if (Math.abs(p.x - lay.probeX) < 9 && p.y > lay.top - 14 && p.y < lay.bot) return 'probe';
        return null;
      },
      start: t => { if (t[0] === 'L' && +t.slice(1) !== sel) { sel = +t.slice(1); syncLens(); } },
      move: (t, p) => {
        if (!lay) return;
        if (t === 'probe') { ctl.set('probe', clamp(lay.Z(p.x) / bench, 0, 1)); draw(); return; }
        const i = +t.slice(1);
        setZ(i, lay.Z(p.x) - lenses[i].fine * 1e-3); ctl.set('pos', clamp(lenses[i].z / zone(), 0, 1));
        if (base !== 'custom') { base = 'custom'; ctl.set('preset', 'custom'); }
        draw();
      }
    });
    L.st.onResize(draw); T.util.onTheme(draw);
    apply('spot'); draw();
  }

  /* ================================================================ 2 · the laser cavity */
  const CAVITIES = {
    plane: { name: 'Plane–plane', L: 0.3, k1: 0, r1: 1, k2: 0, r2: 1 },
    confocal: { name: 'Confocal', L: 0.3, k1: 1, r1: 0.3, k2: 1, r2: 0.3 },
    concentric: { name: 'Concentric (spherical)', L: 0.3, k1: 1, r1: 0.15, k2: 1, r2: 0.15 },
    hemi: { name: 'Hemispherical', L: 0.3, k1: 0, r1: 1, k2: 1, r2: 0.3 },
    gas: { name: 'Flat and curved (a typical gas laser)', L: 0.3, k1: 0, r1: 1, k2: 1, r2: 0.6 },
    convex: { name: 'Unstable: two convex mirrors', L: 0.3, k1: -1, r1: 0.5, k2: -1, r2: 0.5 }
  };
  const mirrorName = (k, r) => k === 0 ? 'flat mirror' : (k > 0 ? 'concave, R = ' : 'convex, R = ') + si(r, 'm');
  /* the fundamental mode of a two-mirror cavity; the engine's formula is 0/0 at the confocal point, where the answer is known */
  function cavityMode(Lc, R1, R2, nm) {
    const g1 = O.laser.g(Lc, R1), g2 = O.laser.g(Lc, R2);
    if (Math.abs(g1) < 1e-9 && Math.abs(g2) < 1e-9) { const w = Math.sqrt(nm * 1e-9 * Lc / (2 * PI)); return { w0: w, z1: Lc / 2, w1: w * Math.SQRT2, w2: w * Math.SQRT2 }; }
    return O.laser.cavityWaist(Lc, R1, R2, nm);
  }

  function resonator(el) {
    const L = T.util.lab(el, 'A laser cavity is two mirrors facing each other with the gain medium between them. Light can build up only if it is trapped: a ray bouncing back and forth must stay close to the axis, which is true when 0 ≤ g₁g₂ ≤ 1, where g = 1 − L/R for each mirror (R positive for a concave mirror, and infinite for a flat one). The stable cavities fill the shaded region of the diagram. Drag the point, choose a classic cavity, or set the length and the mirrors; the cavity is drawn beside it with the Gaussian mode that fits in it, or with a ray that walks out of an unstable one.', 0.62, { minH: 540, maxH: 640 });
    const st = Object.assign({}, CAVITIES.gas);
    let base = 'gas', lay = null;
    const ctl = K.controls(L.side, [
      { id: 'cav', type: 'select', label: 'Classic cavities', options: Object.keys(CAVITIES).map(k => [CAVITIES[k].name, k]).concat([['Your own cavity', 'custom']]), value: 'gas' },
      { id: 'nm', type: 'select', label: 'Wavelength', options: lineOptions(false), value: 632.8 },
      { id: 'L', label: 'Length of the cavity, L', min: 0.01, max: 3, value: 0.3, log: true, sig: 3, fmt: v => si(v, 'm') },
      { id: 'k1', type: 'select', label: 'Mirror 1', options: [['Flat', 0], ['Concave', 1], ['Convex', -1]], value: 0 },
      { id: 'r1', label: 'Radius of mirror 1 (if curved)', min: 0.02, max: 200, value: 1, log: true, sig: 3, fmt: v => si(v, 'm') },
      { id: 'k2', type: 'select', label: 'Mirror 2', options: [['Flat', 0], ['Concave', 1], ['Convex', -1]], value: 1 },
      { id: 'r2', label: 'Radius of mirror 2 (if curved)', min: 0.02, max: 200, value: 0.6, log: true, sig: 3, fmt: v => si(v, 'm') },
      { id: 'dnu', label: 'Width of the gain line', min: 0.1, max: 1e5, value: 1.5, log: true, sig: 2, fmt: v => si(v * 1e9, 'Hz') },
      { type: 'html', html: 'Drag the point on the stability diagram to change the mirrors.' }
    ], onChange);
    const V = ctl.values;
    const ro = K.readout(L.side, [['g1', 'g₁ and mirror 1'], ['g2', 'g₂ and mirror 2'], ['stab', 'Stability'], ['waist', 'Waist of the mode'], ['spots', 'Spot radius on the mirrors'], ['fsr', 'Mode spacing c / 2L'], ['modes', 'Modes under the gain line'], ['ray', 'A ray set off near the axis']]);
    L.under.innerHTML = '<p class="small muted mt">Every cavity in the shaded region has a Gaussian mode that repeats itself after each round trip: its spot size on the mirrors and its waist follow from the length and the radii. On the edge of the region — plane–plane, confocal, concentric, hemispherical — the mode is marginal: a tiny tilt or change of length can push it out. Longitudinal modes are the standing waves that fit between the mirrors, one every c/2L in frequency; those under the gain line can all lase unless the laser is made single-mode.</p>' +
      T.util.more(['the-laser-cavity', 'cavity-stability', 'laser-modes', 'linewidth-and-coherence-of-lasers', 'stimulated-emission']);

    const Rof = (k, r) => k === 0 ? Infinity : k * r;
    function applyCav(id) {
      const P = CAVITIES[id]; if (!P) return;
      Object.assign(st, P); base = id;
      ctl.set('cav', id); ctl.set('L', P.L); ctl.set('k1', P.k1); ctl.set('r1', clamp(P.r1, 0.02, 200)); ctl.set('k2', P.k2); ctl.set('r2', clamp(P.r2, 0.02, 200));
    }
    function onChange(id, v) {
      switch (id) {
        case 'cav': if (v !== 'custom') applyCav(v); draw(); return;
        case 'nm': case 'dnu': draw(); return;
        case 'L': st.L = v; break;
        case 'k1': case 'k2': st[id] = +v; break;
        case 'r1': case 'r2': st[id] = v; break;
      }
      if (base !== 'custom') { base = 'custom'; ctl.set('cav', 'custom'); }
      draw();
    }
    function panes(W, Hh) {
      if (W >= 640) { const s = Math.min(W * 0.4, Hh - 90); return { sq: { x: 56, y: 50, s }, cv: { x: 56 + s + 36, y: 12, w: W - (56 + s + 36) - 14, h: Hh - 24 } }; }
      const s = Math.min(W - 90, Hh * 0.42); return { sq: { x: 56, y: 44, s }, cv: { x: 14, y: 44 + s + 52, w: W - 28, h: Hh - (44 + s + 52) - 8 } };
    }

    function draw() {
      const c = L.st.begin(), C = colors(), W = L.st.W, Hh = L.st.H, nm = V.nm, Lc = st.L, R1 = Rof(st.k1, st.r1), R2 = Rof(st.k2, st.r2);
      const g1 = O.laser.g(Lc, R1), g2 = O.laser.g(Lc, R2), p = g1 * g2, conf = Math.abs(g1) < 1e-9 && Math.abs(g2) < 1e-9;
      const state = conf || (p > 1e-9 && p < 1 - 1e-9) ? 'stable' : p >= -1e-9 && p <= 1 + 1e-9 ? 'edge' : 'unstable';
      const mode = state === 'unstable' ? null : cavityMode(Lc, R1, R2, nm), pc = state === 'stable' ? C.ok : state === 'edge' ? C.warn : C.bad;
      const { sq, cv } = panes(W, Hh); lay = { sq };
      /* ---- the stability diagram */
      const GX = g => sq.x + (g + 2) / 4 * sq.s, GY = g => sq.y + (2 - g) / 4 * sq.s;
      c.fillStyle = C.surface; c.fillRect(sq.x, sq.y, sq.s, sq.s);
      const hyp = []; for (let i = 0; i <= 30; i++) { const g = 0.5 + 1.5 * i / 30; hyp.push([g, 1 / g]); }
      for (const sgn of [1, -1]) {
        const poly = [[0, 0], [0, 2 * sgn]].concat([[0.5 * sgn, 2 * sgn]], hyp.map(q => [q[0] * sgn, q[1] * sgn]), [[2 * sgn, 0.5 * sgn], [2 * sgn, 0]]).map(q => [GX(q[0]), GY(q[1])]);
        c.save(); c.globalAlpha = 0.22; fillPoly(c, poly, C.ok); c.restore();
        stroke(c, hyp.map(q => [GX(q[0] * sgn), GY(q[1] * sgn)]), C.ok, 2);
      }
      for (let g = -2; g <= 2; g++) {
        stroke(c, [[GX(g), sq.y], [GX(g), sq.y + sq.s]], g === 0 ? C.axis : C.grid, g === 0 ? 1.2 : 1); stroke(c, [[sq.x, GY(g)], [sq.x + sq.s, GY(g)]], g === 0 ? C.axis : C.grid, g === 0 ? 1.2 : 1);
        txt(c, String(g).replace('-', '−'), GX(g), sq.y + sq.s + 11, { align: 'center', size: 10.5 }); txt(c, String(g).replace('-', '−'), sq.x - 7, GY(g), { align: 'right', size: 10.5 });
      }
      c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(sq.x + 0.5, sq.y + 0.5, sq.s, sq.s);
      txt(c, 'Stability diagram', sq.x, sq.y - 24, { color: C.text, weight: 650, size: 12.5 });
      txt(c, 'g₂ = 1 − L/R₂ up; g₁ = 1 − L/R₁ across', sq.x, sq.y - 9, { size: 10.5 });
      txt(c, 'stable', GX(0.4), GY(1.55), { align: 'center', color: C.ok, size: 11 }); txt(c, 'stable', GX(-0.4), GY(-1.55), { align: 'center', color: C.ok, size: 11 });
      txt(c, 'unstable', GX(-1.25), GY(1.25), { align: 'center', size: 11 }); txt(c, 'unstable', GX(1.25), GY(-1.25), { align: 'center', size: 11 });
      for (const [name, a, b, dx, dy, al] of [[sq.s < 260 ? 'plane' : 'plane–plane', 1, 1, -8, -10, 'right'], ['confocal', 0, 0, -9, 12, 'right'], [sq.s < 260 ? 'conc.' : 'concentric', -1, -1, 9, 12, 'left'], [sq.s < 260 ? 'hemi' : 'hemispherical', 1, 0, 0, -13, 'center'], [sq.s < 260 ? 'hemi' : 'hemispherical', 0, 1, -10, -3, 'right']]) {
        disc(c, GX(a), GY(b), 3.4, C.text); txt(c, name, GX(a) + dx, GY(b) + dy, { align: al, size: 10.5, color: C.text });
      }
      const gx = clamp(g1, -2, 2), gy = clamp(g2, -2, 2), off = Math.abs(g1) > 2 || Math.abs(g2) > 2;
      stroke(c, [[GX(gx), GY(0)], [GX(gx), GY(gy)], [GX(0), GY(gy)]], pc, 1, [3, 3]);
      disc(c, GX(gx), GY(gy), 7.5, pc, C.text);
      txt(c, off ? 'off the chart: g₁ = ' + sg(g1, 3) + ', g₂ = ' + sg(g2, 3) : 'g₁ = ' + sg(g1, 3) + ', g₂ = ' + sg(g2, 3), clamp(GX(gx) + 12, sq.x + 4, sq.x + sq.s - 130), clamp(GY(gy) - 14, sq.y + 8, sq.y + sq.s - 8), { color: C.text, size: 10.5, bg: C.surface });
      /* ---- the cavity */
      const hm = clamp(cv.h * 0.13, 24, 60), cyc = cv.y + 36 + hm + 18, xL = cv.x + 24, xR = cv.x + cv.w - 24, Lpx = Math.max(60, xR - xL), ppm = Lpx / Lc;
      txt(c, 'The cavity' + (state === 'stable' ? ' and its mode' : ''), cv.x, cv.y + 10, { color: C.text, weight: 650, size: 12.5 });
      for (const [side, k, r, x] of [[-1, st.k1, st.r1, xL], [1, st.k2, st.r2, xR]]) {
        const Rpx = k === 0 ? 0 : -side * k * Math.max(r * ppm, 1.05 * hm);
        S.mirror(c, x, cyc, hm, { R: Rpx, back: side });
        txt(c, 'mirror ' + (side < 0 ? 1 : 2) + ': ' + mirrorName(k, r), x, cyc - hm - (side < 0 ? 10 : 24), { align: side < 0 ? 'left' : 'right', size: 10.5 });
      }
      S.axis(c, xL, cyc, xR); S.dim(c, xL, cyc + hm + 14, xR, cyc + hm + 14, 'L = ' + si(Lc, 'm'), { off: 10 });
      let lasing = '—';
      if (mode && fin(mode.w0)) {
        const w0 = mode.w0, zR = PI * w0 * w0 / (nm * 1e-9), wAt = z => w0 * Math.sqrt(1 + Math.pow((z - mode.z1) / zR, 2)), vs = hm * 0.62 / Math.max(mode.w1, mode.w2, w0);
        S.beam(c, xL, xR, cyc, x => wAt((x - xL) / ppm) * vs, { nm, alpha: 0.5 });
        txt(c, 'w₁ = ' + si(mode.w1, 'm'), xL + 6, cyc + mode.w1 * vs + 11, { size: 10.5, color: C.text }); txt(c, 'w₂ = ' + si(mode.w2, 'm'), xR - 6, cyc + mode.w2 * vs + 11, { align: 'right', size: 10.5, color: C.text });
        if (mode.z1 >= 0 && mode.z1 <= Lc) { const wx = xL + mode.z1 * ppm; stroke(c, [[wx, cyc - w0 * vs], [wx, cyc + w0 * vs]], C.text, 1.6); disc(c, wx, cyc, 2.6, C.text); txt(c, 'w₀ = ' + si(w0, 'm'), clamp(wx, xL + 60, xR - 60), cyc - Math.max(w0 * vs, 3) - 9, { align: 'center', size: 10.5, color: C.text }); }
        txt(c, 'beam width drawn ×' + sg(vs / ppm, 2) + ' larger than the length', cv.x, cyc + hm + 44, { size: 10.5 });
      } else {
        /* a ray set off almost parallel to the axis, followed through each mirror: u' = u − 2y/R, y and R in pixels */
        let y = 0.1 * hm, u = 0.02, leg = 0, out = false; const pts = [[xL, cyc - y]];
        while (leg < 14 && !out) {
          y += u * Lpx; leg++;
          const x = leg % 2 ? xR : xL;
          if (Math.abs(y) > hm) { y = clamp(y, -hm, hm); out = true; }
          pts.push([x, cyc - y]);
          const R = leg % 2 ? R2 : R1; u -= fin(R) ? 2 * y / (R * ppm) : 0;
        }
        stroke(c, pts, S.nm(nm), 1.6);
        if (out) { const q = pts[pts.length - 1]; stroke(c, [[q[0] - 5, q[1] - 5], [q[0] + 5, q[1] + 5]], C.bad, 2); stroke(c, [[q[0] - 5, q[1] + 5], [q[0] + 5, q[1] - 5]], C.bad, 2); }
        lasing = out ? 'leaves the mirror after ' + leg + ' passes' : 'still inside after ' + leg + ' passes';
        txt(c, state === 'edge' ? 'on the edge of stability: no steady mode' : 'unstable: the light walks out, no mode is trapped', cv.x, cyc + hm + 44, { size: 10.5, color: pc });
      }
      /* ---- the longitudinal modes under the gain line */
      const fsr = O.laser.modeSpacing(Lc), dnu = V.dnu * 1e9, win = Math.max(1.6 * dnu, 3.6 * fsr), nTot = 2 * Math.floor(win / fsr) + 1, nIn = 2 * Math.floor(dnu / (2 * fsr)) + 1;
      const my0 = cv.y + cv.h * 0.66, my1 = cv.y + cv.h - 30, FX = nu => cv.x + 10 + (cv.w - 20) * (nu + win) / (2 * win), gain = nu => Math.exp(-4 * Math.LN2 * nu * nu / (dnu * dnu));
      txt(c, 'Longitudinal modes (frequency)', cv.x, my0 - 14, { color: C.text, weight: 650, size: 12.5 });
      const gp = []; for (let i = 0; i <= 80; i++) { const nu = -win + 2 * win * i / 80; gp.push([FX(nu), my1 - (my1 - my0) * gain(nu)]); }
      fillPoly(c, [[FX(-win), my1]].concat(gp, [[FX(win), my1]]), 'rgba(128,128,128,0.12)'); stroke(c, gp, C.muted, 1.4);
      if (nTot <= 90) for (let q = -Math.floor(win / fsr); q <= Math.floor(win / fsr); q++) { const gq = gain(q * fsr), px = FX(q * fsr); stroke(c, [[px, my1], [px, my1 - (my1 - my0) * gq]], gq >= 0.5 ? S.nm(nm) : C.faint, gq >= 0.5 ? 2 : 1.2); }
      else for (let i = 0; i < 90; i++) { const nu = -win + 2 * win * (i + 0.5) / 90; if (gain(nu) >= 0.5) stroke(c, [[FX(nu), my1], [FX(nu), my1 - (my1 - my0) * gain(nu)]], S.nm(nm, 0.5), 2); }
      stroke(c, [[cv.x + 10, my1], [cv.x + cv.w - 10, my1]], C.axis, 1);
      stroke(c, [[cv.x + 10, my1 - (my1 - my0) * 0.5], [cv.x + cv.w - 10, my1 - (my1 - my0) * 0.5]], C.faint, 1, [3, 3]);
      txt(c, 'half of the peak gain', cv.x + cv.w - 12, my1 - (my1 - my0) * 0.5 - 8, { align: 'right', size: 10 });
      if (nTot <= 90 && fsr * (cv.w - 20) / (2 * win) > 24) S.dim(c, FX(0), my1 + 14, FX(fsr), my1 + 14, si(fsr, 'Hz'), { off: 11, size: 10.5 });
      else txt(c, nTot > 90 ? 'about ' + nIn + ' modes: too many to draw one by one' : 'spacing ' + si(fsr, 'Hz'), cv.x + 10, my1 + 14, { size: 10.5 });
      /* ---- read-outs */
      ro.set('g1', sg(g1, 3) + ' · ' + mirrorName(st.k1, st.r1)); ro.set('g2', sg(g2, 3) + ' · ' + mirrorName(st.k2, st.r2));
      ro.set('stab', (state === 'stable' ? 'stable' : state === 'edge' ? 'on the edge of stability' : 'unstable') + ': g₁g₂ = ' + sg(p, 3));
      ro.set('waist', mode && fin(mode.w0) ? si(mode.w0, 'm') + ' radius, ' + (mode.z1 >= 0 && mode.z1 <= Lc ? (mode.z1 < 1e-9 * Lc ? 'on mirror 1' : mode.z1 > Lc * (1 - 1e-9) ? 'on mirror 2' : si(mode.z1, 'm') + ' from mirror 1') : 'outside the cavity, ' + si(Math.abs(mode.z1), 'm') + (mode.z1 < 0 ? ' before mirror 1' : ' beyond mirror 2')) : 'none: no steady mode');
      ro.set('spots', mode && fin(mode.w1) ? 'mirror 1: ' + si(mode.w1, 'm') + ' · mirror 2: ' + si(mode.w2, 'm') : '—');
      ro.set('fsr', sg(fsr / 1e6, 3) + ' MHz');
      ro.set('modes', nIn <= 1 ? 'one: a single mode can fit (gain line ' + si(dnu, 'Hz') + ' wide)' : 'about ' + nIn + ' (gain line ' + si(dnu, 'Hz') + ' wide)');
      ro.set('ray', lasing); ro.show('ray', !mode);
    }
    function point(p) {
      if (!lay) return;
      const q = lay.sq, snap = g => { for (const s of [-1, 0, 1]) if (Math.abs(g - s) < 0.05) return s; return g; };
      const gs = [snap(clamp(-2 + 4 * (p.x - q.x) / q.s, -2, 2)), snap(clamp(2 - 4 * (p.y - q.y) / q.s, -2, 2))];
      gs.forEach((g, i) => {
        const R = g === 1 ? Infinity : st.L / (1 - g), k = g === 1 ? 0 : R > 0 ? 1 : -1, r = Math.abs(R), n = i + 1;
        st['k' + n] = k; st['r' + n] = fin(r) ? r : 1; ctl.set('k' + n, k); ctl.set('r' + n, clamp(st['r' + n], 0.02, 200));
      });
      if (base !== 'custom') { base = 'custom'; ctl.set('cav', 'custom'); }
      draw();
    }
    K.drag(L.st, { hover: true, hit: p => lay && p.x >= lay.sq.x - 8 && p.x <= lay.sq.x + lay.sq.s + 8 && p.y >= lay.sq.y - 8 && p.y <= lay.sq.y + lay.sq.s + 8 ? 'pt' : null, start: (t, p) => point(p), move: (t, p) => point(p) });
    L.st.onResize(draw); T.util.onTheme(draw);
    applyCav('gas'); draw();
  }
  /* ================================================================ 3 · slits and apertures */
  const WL = []; for (let nm = 400; nm <= 700; nm += 10) WL.push([nm, O.colour.wavelength(nm)]);          // the wavelengths of "white light"
  const AIRY_ZERO = 3.8317;                                                                              // the first zero of J1: the Airy disc ends at 1.22 λ/D

  function diffraction(el) {
    const L = T.util.lab(el, 'Light passing an opening spreads out, and the waves from different parts of the opening add up on a distant screen. Where they arrive in step they reinforce (constructive interference, bright) and where they arrive half a wavelength out of step they cancel (destructive interference, dark). Choose an opening — one slit, two, several, a round hole — and change the wavelength, the sizes and the distance. The picture is what you would see on the screen; below it is the intensity along the screen. Switch to logarithmic brightness to see the faint side lobes, to white light to see colours, or to two points of light to see when a round aperture can still tell them apart.', 0.5, { minH: 380 });
    L.under.innerHTML = '<div class="dfplot"></div><p class="small muted mt">Bright where the path difference is a whole number of wavelengths, dark where it is an odd number of half wavelengths. A wider opening gives a narrower pattern; a longer wavelength or a longer distance gives a wider one. The formulas hold in the far field, when the Fresnel number is well below 1.</p>' +
      T.util.more(['what-diffraction-is', 'constructive-and-destructive-interference', 'youngs-double-slit', 'single-slit-diffraction', 'the-airy-disk', 'resolution-limits', 'coherence', 'fresnel-diffraction-and-zone-plates']);
    const plot = K.plot(ui.$('.dfplot', L.under), { x: { label: 'position on the screen' }, y: { label: 'relative intensity' }, legend: true }, 270);
    const ctl = K.controls(L.side, [
      { id: 'ap', type: 'select', label: 'Opening', options: [['Single slit', 'slit'], ['Double slit', 'double'], ['Several equal slits', 'n'], ['Round hole', 'hole'], ['Round hole: two points of light', 'two']], value: 'double' },
      { id: 'nm', label: 'Wavelength λ', min: 300, max: 1100, step: 1, value: 532, unit: 'nm' },
      { id: 'white', type: 'check', label: 'White light (all colours together)', value: false },
      { id: 'a', label: 'Slit width, a', min: 5, max: 500, value: 40, log: true, sig: 3, fmt: v => si(v * 1e-6, 'm') },
      { id: 'd', label: 'Distance between slits, d', min: 20, max: 2000, value: 200, log: true, sig: 3, fmt: v => si(v * 1e-6, 'm') },
      { id: 'N', label: 'Number of slits', min: 2, max: 20, step: 1, value: 5 },
      { id: 'D', label: 'Diameter of the hole, D', min: 20, max: 5000, value: 400, log: true, sig: 3, fmt: v => si(v * 1e-6, 'm') },
      { id: 'sep', label: 'Separation of the two points', min: 0.2, max: 3, step: 0.05, value: 1, fmt: v => sg(v, 3) + ' × Rayleigh angle' },
      { id: 'Lz', label: 'Distance to the screen, L', min: 0.1, max: 20, value: 2, log: true, sig: 3, fmt: v => si(v, 'm') },
      { id: 'log', type: 'check', label: 'Logarithmic brightness (shows the faint side lobes)', value: false }
    ], () => { showRows(); draw(); });
    const V = ctl.values;
    const ro = K.readout(L.side, [['min1', 'First minimum'], ['band', 'Central bright band'], ['fringe', 'Fringe spacing'], ['airy', 'Airy disc on the screen'], ['fres', 'Fresnel number'], ['ray', 'Rayleigh angle 1.22 λ/D'], ['dip', 'Dip between the two'], ['verdict', 'The two points are']]);
    function showRows() {
      const ap = V.ap, sl = ap === 'slit' || ap === 'double' || ap === 'n', two = ap === 'two';
      ctl.show('white', sl); ctl.show('nm', !(V.white && sl)); ctl.show('a', sl); ctl.show('d', ap === 'double' || ap === 'n'); ctl.show('N', ap === 'n'); ctl.show('D', ap === 'hole' || two); ctl.show('sep', two); ctl.show('Lz', !two);
      ro.show('min1', !two); ro.show('band', ap === 'slit'); ro.show('fringe', ap === 'double' || ap === 'n'); ro.show('airy', ap === 'hole'); ro.show('fres', !two); ro.show('ray', two); ro.show('dip', two); ro.show('verdict', two);
    }
    /* what the chosen opening does: intensity I(wavelength nm, angle) and the size of the pattern */
    function geom() {
      const white = V.white && ['slit', 'double', 'n'].includes(V.ap), lam = (white ? 550 : V.nm) * 1e-9, a = V.a * 1e-6, d = Math.max(V.d, 1.25 * V.a) * 1e-6, Dd = V.D * 1e-6, Lz = V.Lz, N = Math.round(V.N), ap = V.ap, Df = O.diff;
      const I = ap === 'slit' ? (nm, th) => Df.singleSlit(a, nm, th) : ap === 'double' ? (nm, th) => Df.doubleSlit(a, d, nm, th) : ap === 'n' ? (nm, th) => Df.nSlits(N, a, d, nm, th) : (nm, th) => Df.airy(PI * Dd * Math.sin(th) / (nm * 1e-9));
      const sMax = ap === 'slit' ? 3.4 * lam / a : ap === 'double' ? Math.max(Math.min(3.1 * lam / a, 12 * lam / d), 2.6 * lam / d) : ap === 'n' ? Math.min(3.1 * lam / a, 3.6 * lam / d) : 1.22 * 3.5 * lam / Dd;
      const first = { slit: lam / a, double: lam / (2 * d), n: lam / (N * d), hole: 1.22 * lam / Dd }[ap], pos = s => s < 1 ? Lz * Math.tan(Math.asin(s)) : NaN;
      const ext = ap === 'slit' ? a / 2 : ap === 'double' ? (d + a) / 2 : ap === 'n' ? ((N - 1) * d + a) / 2 : Dd / 2;
      return { white, lam, a, d, Dd, Lz, N, ap, I, X: pos(Math.min(0.97, sMax)), first, x1: pos(first), th1: first < 1 ? Math.asin(first) : NaN, nf: Df.fresnelNumber(ext, Lz, lam * 1e9) };
    }
    /* white light on the screen at position x: each colour's intensity times its colour, scaled so that the centre is white */
    function whiteAt(g, x) {
      const th = Math.atan(x / g.Lz), s = [0, 0, 0], t = [0, 0, 0];
      for (const [nm, rgb] of WL) { const i = g.I(nm, th); for (let k = 0; k < 3; k++) { s[k] += i * rgb[k]; t[k] += rgb[k]; } }
      return s.map((v, k) => 255 * Math.pow(clamp(v / t[k], 0, 1), 0.6));
    }
    const bright = (I, lg) => lg ? clamp((Math.log10(Math.max(I, 1e-9)) + 4) / 4, 0, 1) : I;
    const lowOut = (c, C, x, y, s) => txt(c, s, x, y, { color: C.warn, size: 11 });

    function draw() {
      showRows();
      if (V.ap === 'two') return drawTwo();
      const c = L.st.begin(), C = colors(), W = L.st.W, Hh = L.st.H, g = geom(), nm = g.white ? 550 : V.nm, lg = V.log, ap = g.ap;
      const sH = clamp(Hh * 0.42, 120, 200), sTop = 24, cy = sTop + sH / 2, hh = sH / 2 - 8, pTop = sTop + sH + 34, pic = ap === 'hole';
      const pH = pic ? clamp(Hh - pTop - 34, 70, 190) : clamp(Hh - pTop - 56, 56, 110), px0 = 58, px1 = W - 16, pw = px1 - px0;
      const xa = px0 + pw * 0.28, xs = px1 - 34, ys = x => cy - hh * x / g.X;
      txt(c, 'Seen from the side (angles exaggerated, not to scale)', 12, 12, { size: 11 });
      S.source(c, 22, cy, { kind: 'laser', color: S.nm(nm), size: 7 });
      stroke(c, [[34, cy], [xa, cy]], S.nm(nm), 3);
      const n = ap === 'double' ? 2 : g.N, gaps = [];
      if (ap === 'slit' || ap === 'hole') gaps.push([cy - (ap === 'hole' ? 7 : 5), cy + (ap === 'hole' ? 7 : 5)]);
      else { const dp = clamp(hh * 1.7 / n, 3, 34), wp = clamp(dp * g.a / g.d, 1.2, dp * 0.8); for (let i = 0; i < n; i++) { const y = cy + (i - (n - 1) / 2) * dp; gaps.push([y - wp / 2, y + wp / 2]); } }
      S.slits(c, xa, cy, hh, gaps, { w: 5 });
      fillPoly(c, [[xa, cy], [xs, cy - hh], [xs, cy + hh]], S.nm(nm, 0.1));
      stroke(c, [[xa, cy], [xs, cy]], S.nm(nm), 1.2);
      if (fin(g.x1)) for (const sgn of [-1, 1]) stroke(c, [[xa, cy], [xs, ys(sgn * g.x1)]], C.text, 1, [5, 4]);
      S.screen(c, xs, cy, hh + 4, { w: 3 });
      S.fringes(c, xs + 6, cy - hh, 12, 2 * hh, u => bright(g.I(nm, Math.atan(g.X * (2 * u - 1) / g.Lz)), lg), { nm, vertical: true, step: 1, gamma: lg ? 1 : 0.6 });
      S.dim(c, xa, cy + hh + 16, xs, cy + hh + 16, 'L = ' + si(g.Lz, 'm'), { off: 10 });
      txt(c, ap === 'slit' ? 'slit' : ap === 'double' ? 'double slit' : ap === 'n' ? g.N + ' slits' : 'round hole (edge-on)', xa, cy - hh - 10, { align: 'center', color: C.text, size: 11 });
      txt(c, 'screen', xs + 8, cy - hh - 10, { align: 'center', color: C.text, size: 11 });
      if (fin(g.x1)) txt(c, 'first minimum', xa + (xs - xa) * 0.62, cy - (cy - ys(g.x1)) * 0.62 - 9, { size: 10.5 });
      /* the pattern as it looks */
      txt(c, 'The pattern on the screen' + (g.white ? ', in white light' : '') + (lg ? ' (logarithmic brightness)' : ''), px0, pTop - 12, { color: C.text, weight: 650, size: 12.5 });
      if (pic) {
        const side = pH, cx0 = px0 + (pw - side) / 2;
        c.fillStyle = '#000'; c.fillRect(cx0, pTop, side, side);
        S.image(c, cx0, pTop, side, side, 110, 110, (u, v) => { const r = 2 * g.X * Math.hypot(u - 0.5, v - 0.5); return bright(g.I(nm, Math.atan(r / g.Lz)), lg); }, { nm, gamma: lg ? 1 : 0.5 });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(cx0 + 0.5, pTop + 0.5, side - 1, side - 1);
      } else if (g.white) S.cells(c, px0, pTop, pw, pH, Math.max(8, Math.floor(pw / 1.5)), 1, u => whiteAt(g, g.X * (2 * u - 1)));
      else S.fringes(c, px0, pTop, pw, pH, u => bright(g.I(nm, Math.atan(g.X * (2 * u - 1) / g.Lz)), lg), { nm, gamma: lg ? 1 : 0.6, step: 1.5 });
      if (!pic) { c.strokeStyle = C.axis; c.strokeRect(px0 + 0.5, pTop + 0.5, pw - 1, pH - 1); }
      const fu = g.X < 1e-3 ? 1e6 : g.X < 1 ? 1e3 : 1, un = g.X < 1e-3 ? 'µm' : g.X < 1 ? 'mm' : 'm', yl = pTop + pH + 12;
      for (const k of [-1, 0, 1]) txt(c, sg(k * g.X * fu, 3) + ' ' + un, k === 0 ? (px0 + px1) / 2 : k < 0 ? px0 : px1, yl, { align: k === 0 ? 'center' : k < 0 ? 'left' : 'right', size: 10.5 });
      if (!(g.nf < 0.1)) lowOut(c, C, px0, pTop + pH + 28, g.nf < 1 ? 'The screen is close: the far-field pattern is only roughly right here.' : 'The screen is in the near field: this far-field pattern does not apply at this distance.');
      if (invisible(nm)) lowOut(c, C, 12, Hh - 8, 'invisible light, drawn in a dim colour');
      /* the intensity curve */
      const np = 700, series = [];
      const curve = (nmv, label, color, dash) => { const q = []; for (let i = 0; i <= np; i++) { const x = g.X * (2 * i / np - 1), I = g.I(nmv, Math.atan(x / g.Lz)); q.push([x * fu, lg ? Math.max(I, 1e-9) : I]); } series.push({ pts: q, label, color, dash, width: 2.2 }); };
      if (g.white) { curve(450, '450 nm (blue)', '#3d6bff'); curve(550, '550 nm (green)', '#22b37a'); curve(650, '650 nm (red)', '#e5484d'); const q = []; for (let i = 0; i <= np; i += 2) { const x = g.X * (2 * i / np - 1); let s = 0; for (const [wn] of WL) s += g.I(wn, Math.atan(x / g.Lz)); q.push([x * fu, lg ? Math.max(s / WL.length, 1e-9) : s / WL.length]); } series.push({ pts: q, label: 'all colours (average)', color: C.text, width: 2.6 }); }
      else curve(nm, 'intensity', C.accent);
      plot.set({ x: { label: 'position on the screen (' + un + ')', min: -g.X * fu, max: g.X * fu }, y: { label: lg ? 'relative intensity (log scale)' : 'relative intensity', min: lg ? 1e-5 : 0, max: lg ? 1.5 : 1.05, log: lg },
        series, vlines: fin(g.x1) && g.x1 < g.X ? [{ x: -g.x1 * fu }, { x: g.x1 * fu, label: 'first minimum' }] : [], hlines: [], marks: [] });
      /* read-outs */
      ro.set('min1', fin(g.x1) ? (ap === 'double' ? 'first dark fringe: ' : ap === 'hole' ? 'first dark ring: ' : '') + 'θ = ' + sg(g.th1 * R2D, 3) + '° · ' + si(g.x1, 'm') + ' from the centre' : 'none: the opening is no wider than the wavelength');
      ro.set('band', fin(g.x1) ? si(2 * g.x1, 'm') + ' wide, between the first minima' : '—');
      ro.set('fringe', si(O.diff.fringeSpacing(g.lam * 1e9, g.d, g.Lz), 'm') + ' between bright fringes');
      ro.set('airy', si(2 * O.diff.airyRadius(g.lam * 1e9, g.Lz / g.Dd), 'm') + ' across (1.22 λL/D each side of the centre)');
      ro.set('fres', sg(g.nf, 3) + (g.nf < 0.1 ? ': far field, the formulas hold' : g.nf < 1 ? ': near-field effects begin, the formulas are rough' : ': near field, the formulas do not hold'));
    }

    /* two points of light seen through a round aperture: two Airy patterns, an angle apart, added in intensity */
    function drawTwo() {
      const c = L.st.begin(), C = colors(), W = L.st.W, Hh = L.st.H, nm = V.nm, s = V.sep, thR = O.diff.rayleighAngle(nm, V.D * 1e-6);
      const sum = u => O.diff.airy(AIRY_ZERO * (u + s / 2)) + O.diff.airy(AIRY_ZERO * (u - s / 2));
      let pk = 0; for (let u = -s / 2 - 0.4; u <= s / 2 + 0.4; u += 0.01) pk = Math.max(pk, sum(u));
      const mid = sum(0), dip = pk > 0 ? Math.max(0, 1 - mid / pk) : 0;
      const verdict = s >= 1.05 ? 'resolved' : s >= 0.95 ? 'just resolved (the Rayleigh limit)' : 'not resolved', vc = s >= 1.05 ? C.ok : s >= 0.95 ? C.warn : C.bad;
      const sH = clamp(Hh * 0.42, 120, 200), sTop = 24, cy = sTop + sH / 2, pTop = sTop + sH + 34, px0 = 58, px1 = W - 16, pw = px1 - px0, pH = clamp(Hh - pTop - 56, 70, 150);
      const xa = px0 + pw * 0.4, xs = px1 - 30, ph = Math.min(sH * 0.3, 14 + 22 * s);
      txt(c, 'Two distant points of light, seen through a round aperture (angles exaggerated)', 12, 12, { size: 11 });
      S.slits(c, xa, cy, sH / 2 - 8, [[cy - 7, cy + 7]], { w: 5 });
      for (const sgn of [-1, 1]) {
        disc(c, 30, cy + sgn * ph, 3.5, S.nm(nm)); stroke(c, [[30, cy + sgn * ph], [xs, cy - sgn * ph * (xs - xa) / (xa - 30)]], S.nm(nm), 1.4);
        disc(c, xs, cy - sgn * ph * (xs - xa) / (xa - 30), 5, S.nm(nm, 0.7));
      }
      S.screen(c, xs, cy, sH / 2 - 8, { w: 3 }); txt(c, 'screen', xs, cy - sH / 2 - 2, { align: 'center', color: C.text, size: 11 }); txt(c, 'aperture', xa, cy - sH / 2 - 2, { align: 'center', color: C.text, size: 11 });
      /* the picture: a band of the two patterns, round spots at equal scale */
      txt(c, 'The two patterns added together', px0, pTop - 12, { color: C.text, weight: 650, size: 12.5 });
      const half = s / 2 + 1.9, pxu = pH / 3.4, picW = Math.min(pw, 2 * half * pxu), cx0 = px0 + (pw - picW) / 2, uPx = u => cx0 + picW / 2 + u * pxu;
      S.image(c, cx0, pTop, picW, pH, Math.max(20, Math.round(picW / 1.5)), Math.max(8, Math.round(pH / 1.5)), (u, v) => { const x = (u - 0.5) * 2 * half, y = (v - 0.5) * 2 * half * pH / picW; return (O.diff.airy(AIRY_ZERO * Math.hypot(x + s / 2, y)) + O.diff.airy(AIRY_ZERO * Math.hypot(x - s / 2, y))) / (pk || 1); }, { nm, gamma: 0.5 });
      c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(cx0 + 0.5, pTop + 0.5, picW - 1, pH - 1);
      const by = pTop + pH + 14;
      S.dim(c, uPx(-s / 2), by, uPx(s / 2), by, 'separation ' + si(s * thR, 'rad'), { off: 11, color: C.accent, textColor: C.accent });
      S.dim(c, uPx(-s / 2), by + 24, uPx(-s / 2 + 1), by + 24, 'Rayleigh: ' + si(thR, 'rad'), { off: 11, color: C.warn, textColor: C.warn });
      txt(c, verdict, W - 16, pTop + pH + 14, { align: 'right', color: vc, weight: 700, size: 15 });
      const np = 400, mk = (fn, label, color, dash, w) => { const q = []; for (let i = 0; i <= np; i++) { const u = -half + 2 * half * i / np; q.push([u, fn(u)]); } return { pts: q, label, color, dash, width: w || 2 }; };
      plot.set({ x: { label: 'angle from the middle (× Rayleigh angle)', min: -half, max: half }, y: { label: 'relative intensity', min: 0, max: Math.max(1.1, pk * 1.08), log: false },
        series: [mk(u => O.diff.airy(AIRY_ZERO * (u + s / 2)), 'point 1', C.series[1], [5, 4]), mk(u => O.diff.airy(AIRY_ZERO * (u - s / 2)), 'point 2', C.series[2], [5, 4]), mk(sum, 'sum seen', C.text, null, 2.8)],
        vlines: [{ x: -s / 2 + 1, label: 'first dark ring of point 1', color: C.warn }], hlines: [], marks: [] });
      ro.set('ray', si(thR, 'rad') + ' = ' + sg(thR * R2D * 3600, 3) + ' arcseconds, for ' + si(V.D * 1e-6, 'm') + ' at ' + sg(nm, 4) + ' nm');
      ro.set('dip', dip < 0.005 ? 'none: the two blur into one peak' : sg(dip * 100, 2) + ' % below the peaks (0.735 of the peak at the Rayleigh limit)');
      ro.set('verdict', verdict);
    }
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }
  /* ================================================================ 4 · the diffraction grating */
  const HG = [404.7, 435.8, 546.1, 577.0, 579.1], NA = [589.0, 589.6], WHITE = []; for (let nm = 400; nm <= 700; nm += 10) WHITE.push(nm);
  const MAX_ORD = 20;                                                                                    // orders drawn and tabulated on each side
  /* the distance from (x, y) along (dx, dy) to the edge of a box */
  function reach(x, y, dx, dy, bx0, by0, bx1, by1) {
    let t = Infinity;
    if (dx > 1e-9) t = Math.min(t, (bx1 - x) / dx); else if (dx < -1e-9) t = Math.min(t, (bx0 - x) / dx);
    if (dy > 1e-9) t = Math.min(t, (by1 - y) / dy); else if (dy < -1e-9) t = Math.min(t, (by0 - y) / dy);
    return t;
  }

  function grating(el) {
    const L = T.util.lab(el, 'A diffraction grating is a large number of equally spaced lines, each one a source of light. Waves from neighbouring lines arrive in step in certain directions only — those where the path difference between neighbours is a whole number m of wavelengths — and the beam splits into orders: sin θₘ = sin θᵢ + m λ / d, with d the spacing of the lines. Longer wavelengths are bent further, which is why a grating makes a spectrum. Choose a light source and a grating, tilt the beam, and watch every allowed order appear and disappear. Angles are measured from the normal, positive upwards.', 0.62, { minH: 420 });
    L.under.innerHTML = '<div class="gtab"></div><div class="gplot"></div><p class="small muted mt">The lower graph shows how sharp the peaks of the chosen order are for the two lines named in the last read-out: the more lines the beam lights (N), the narrower the peaks, and the smaller the wavelength difference the grating can tell apart. A grating resolves Δλ = λ/(mN). With white light the long-wavelength end of one order can overlap the short-wavelength end of the next. At most ' + MAX_ORD + ' orders on each side are drawn and listed.</p>' +
      T.util.more(['the-grating-equation', 'grating-types-and-blaze', 'grating-spectrometers-and-resolving-power', 'diffraction-in-everyday-life', 'what-diffraction-is']);
    const plot = K.plot(ui.$('.gplot', L.under), { x: { label: 'angle' }, y: { label: 'relative intensity' }, legend: true }, 230);
    const tabEl = ui.$('.gtab', L.under);
    const ctl = K.controls(L.side, [
      { id: 'src', type: 'select', label: 'Light', options: [['A single laser line', 'laser'], ['White light', 'white'], ['Mercury lamp (five lines)', 'hg'], ['Sodium lamp (the yellow doublet)', 'na']], value: 'laser' },
      { id: 'nm', label: 'Wavelength of the laser', min: 300, max: 1100, step: 1, value: 532, unit: 'nm' },
      { id: 'lpm', label: 'Lines per millimetre', min: 50, max: 2400, value: 600, log: true, sig: 3, fmt: v => Math.round(v) + ' lines/mm' },
      { id: 'ti', label: 'Angle of incidence', min: -80, max: 80, step: 1, value: 0, unit: '°' },
      { id: 'geo', type: 'select', label: 'Grating', options: [['Transmission: light passes through', 'T'], ['Reflection: light bounces back', 'R']], value: 'T' },
      { id: 'ord', label: 'Order for the read-outs', min: 1, max: 6, step: 1, value: 1 },
      { id: 'N', label: 'Lines lit by the beam, N', min: 10, max: 50000, value: 1000, log: true, sig: 3, fmt: v => Math.round(v) + ' lines' }
    ], () => { ctl.show('nm', V.src === 'laser'); draw(); });
    const V = ctl.values;
    const ro = K.readout(L.side, [['spacing', 'Spacing of the lines, d'], ['orders', 'Orders that exist'], ['disp', 'Angular dispersion'], ['power', 'Resolving power m N'], ['dl', 'Smallest wavelength difference'], ['litt', 'Littrow angle'], ['pair', 'The two lines of the lower graph']]);
    const pairOf = () => V.src === 'laser' ? [V.nm, V.nm + 0.6] : V.src === 'hg' ? [577.0, 579.1] : [589.0, 589.6];
    const refOf = () => V.src === 'laser' ? [V.nm] : V.src === 'hg' ? HG : V.src === 'na' ? NA : [400, 550, 700];
    const gr = (nm, m) => O.diff.grating({ linesPerMm: V.lpm, nm, thetaI: V.ti * D2R, m });

    function draw() {
      const c = L.st.begin(), C = colors(), W = L.st.W, Hh = L.st.H, tr = V.geo === 'T', ti = V.ti * D2R, src = V.src;
      const top = 24, bot = Hh - 12, gy = (top + bot) / 2, gx = tr ? W * 0.3 : W * 0.64, gh = (bot - top) / 2 * 0.66, mid = src === 'laser' ? V.nm : src === 'white' ? 550 : src === 'hg' ? 546.1 : 589.3;
      const bx0 = tr ? 10 : 70, bx1 = tr ? W - 70 : W - 10, Rarc = clamp(Math.min(tr ? W - gx - 74 : gx - 74, (bot - top) / 2 - 6), 80, 300);
      const dirOf = th => [tr ? Math.cos(th) : -Math.cos(th), -Math.sin(th)];
      const lines = src === 'laser' ? [V.nm] : src === 'hg' ? HG : src === 'na' ? NA : WHITE, fan = src === 'white';
      /* the grating, its normal and the incoming beam */
      S.normal(c, gx, gy, 0, Math.min(Rarc, 150), { color: C.faint });
      S.grating(c, gx, gy, gh, { lines: 18, color: C.text, label: (tr ? 'transmission' : 'reflection') + ' grating, ' + Math.round(V.lpm) + ' lines/mm' });
      const din = [Math.cos(ti), -Math.sin(ti)], lin = Math.min(Rarc, reach(gx, gy, -din[0], -din[1], 40, top, W - 40, bot) * 0.96), sx = gx - din[0] * lin, sy = gy - din[1] * lin;
      stroke(c, [[sx, sy], [gx, gy]], src === 'laser' ? S.nm(V.nm) : C.text, src === 'laser' ? 2.4 : 3.2);
      S.source(c, sx, sy, { kind: src === 'laser' ? 'laser' : 'bulb', color: src === 'laser' ? S.nm(V.nm) : C.warn, size: 6, dir: Math.atan2(din[1], din[0]) });
      if (Math.abs(V.ti) > 1) S.angle(c, gx, gy, 34, PI, PI - ti, 'θᵢ = ' + V.ti + '°', { gap: 26 });
      /* every order of every line */
      const placed = []; let drawn = 0, cut = false;
      lines.forEach(nm => {
        const alpha = fan ? 0.5 : 0.95;
        for (const o of O.diff.gratingOrders({ linesPerMm: V.lpm, nm, thetaI: ti })) {
          if (Math.abs(o.m) > MAX_ORD) { cut = true; continue; }
          const d = dirOf(o.theta), len = Math.min(Rarc, reach(gx, gy, d[0], d[1], bx0, top, bx1, bot)), ex = gx + d[0] * len, ey = gy + d[1] * len;
          stroke(c, [[gx, gy], [ex, ey]], o.m === 0 && fan ? C.text : S.nm(nm, alpha), fan ? (o.m === 0 ? 2.6 : 1.3) : 2); disc(c, ex, ey, fan ? 1.6 : 3, o.m === 0 && fan ? C.text : S.nm(nm)); drawn++;
          if (nm === (src === 'white' ? 550 : lines[lines.length >> 1])) {
            const lx = ex + d[0] * 10, ly = ey + d[1] * 8;
            if (!placed.some(q => Math.abs(q - ly) < 13)) { placed.push(ly); txt(c, 'm = ' + o.m + (src === 'laser' ? ' · ' + sg(o.theta * R2D, 3) + '°' : ''), clamp(lx, 6, W - 6), clamp(ly, top, bot), { align: d[0] >= 0 ? 'left' : 'right', size: 10.5, color: C.text }); }
          }
        }
      });
      if (cut) txt(c, 'more orders exist than are drawn', W - 10, 12, { align: 'right', size: 10.5, color: C.warn });
      if (!drawn) txt(c, 'no beam leaves the grating at this angle', gx + (tr ? 60 : -60), gy, { align: 'center', color: C.warn });
      if (invisible(V.nm) && src === 'laser') txt(c, 'invisible light, drawn in a dim colour', 10, Hh - 6, { color: C.warn, size: 10.5 });
      txt(c, 'sin θₘ = sin θᵢ + m λ / d', 10, 12, { color: C.text, weight: 650, size: 12.5 });
      /* the table of angles */
      const refs = refOf(), cols = [], rows = [];
      let lo = 0, hi = 0;
      refs.forEach(nm => { cols.push(nm); for (const o of O.diff.gratingOrders({ linesPerMm: V.lpm, nm, thetaI: ti })) if (Math.abs(o.m) <= MAX_ORD) { lo = Math.min(lo, o.m); hi = Math.max(hi, o.m); } });
      for (let m = hi; m >= lo; m--) rows.push(Object.assign(['m = ' + m].concat(cols.map(nm => { const a = gr(nm, m); return fin(a) ? sg(a * R2D, 4) + '°' : '—'; })), Math.abs(m) === V.ord ? { hl: true } : {}));
      tabEl.innerHTML = T.util.box('Angle of each order (from the normal, upwards positive)', T.util.table(['Order'].concat(cols.map(nm => sg(nm, 4) + ' nm' + (src === 'white' ? ' (' + O.colourName(nm) + ')' : ''))), rows, { maxHeight: 260 }));
      /* read-outs: the order m, for the middle wavelength */
      const m = V.ord, d = 1e-3 / V.lpm, th = gr(mid, m), N = V.N, R = O.diff.resolvingPower(m, N), pr = pairOf(), tA = gr(pr[0], m), tB = gr(pr[1], m);
      ro.set('spacing', si(d, 'm'));
      ro.set('orders', hi === lo ? 'only the straight-through order, m = 0' : hi > lo ? 'm from ' + String(lo).replace('-', '−') + ' to ' + hi + (cut ? ' (and beyond)' : '') + ' for ' + sg(mid, 4) + ' nm' : 'none');
      ro.set('disp', fin(th) ? sg(O.diff.angularDispersion({ linesPerMm: V.lpm, nm: mid, thetaI: ti, m }) * R2D, 3) + ' °/nm in order ' + m : 'order ' + m + ' does not exist for this light');
      ro.set('power', fin(R) ? sg(R, 4) + ' in order ' + m + ' with ' + Math.round(N) + ' lines' : '—');
      ro.set('dl', si(mid / R * 1e-9, 'm') + ' near ' + sg(mid, 4) + ' nm');
      const lit = O.diff.littrow({ linesPerMm: V.lpm, nm: mid, m });
      ro.set('litt', fin(lit) ? sg(lit * R2D, 4) + '°: with the angle of incidence set to −' + sg(lit * R2D, 4) + '°, order m = ' + m + ' comes straight back along the beam' : 'none: order ' + m + ' cannot return along the beam');
      const need = ((pr[0] + pr[1]) / 2) / Math.abs(pr[1] - pr[0]);
      ro.set('pair', pr[0].toFixed(1) + ' and ' + pr[1].toFixed(1) + ' nm: ' + (fin(tA) && fin(tB) ? (R >= need ? 'resolved' : 'not resolved') + ' (needs mN ≥ ' + sg(need, 3) + ')' : 'order ' + m + ' does not exist'));
      /* the lower graph: the peaks of the two lines in order m, from the N-slit pattern */
      const un = a => Math.asin(clamp(Math.sin(a) - Math.sin(ti), -1, 1));
      if (fin(tA) && fin(tB)) {
        const cm = (tA + tB) / 2, wid = Math.max(1.8 * Math.abs(tB - tA), 4 * pr[0] * 1e-9 / (N * d * Math.max(0.05, Math.cos(cm)))), pa = [], pb = [], ps = [], np = 800;
        for (let i = 0; i <= np; i++) {
          const a = cm - wid + 2 * wid * i / np, x = (a - cm) * 1000, ia = O.diff.nSlits(N, 0, d, pr[0], un(a)), ib = O.diff.nSlits(N, 0, d, pr[1], un(a));
          pa.push([x, ia]); pb.push([x, ib]); ps.push([x, (ia + ib) / 2]);
        }
        plot.set({ x: { label: 'angle from the middle of the pair (mrad)', min: -wid * 1000, max: wid * 1000 }, y: { label: 'relative intensity', min: 0, max: 1.05, log: false }, series: [{ pts: pa, label: pr[0].toFixed(1) + ' nm', color: C.series[1], width: 2 }, { pts: pb, label: pr[1].toFixed(1) + ' nm', color: C.series[2], width: 2 }, { pts: ps, label: 'what the grating shows (average)', color: C.text, dash: [5, 4], width: 2.4 }], vlines: [], hlines: [], marks: [] });
      } else plot.set({ x: { label: 'angle (mrad)', min: -1, max: 1 }, y: { label: 'relative intensity', min: 0, max: 1.05, log: false }, series: [], vlines: [], hlines: [], marks: [] });
    }
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }
  /* ================================================================ 5 · shaping a beam */
  const SHAPERS = [['A focusing lens: a point', 'focus'], ['A cylinder lens: a line', 'cyl'], ['A Powell lens: an even line', 'powell'], ['An axicon: a ring and a long thin focus', 'axicon'], ['A flat-top shaper: an even disc', 'flat'], ['A microlens homogenizer: a sharp square', 'homog'], ['A diffractive element: dots and shapes', 'doe']];
  const SH_NOTES = {
    focus: 'A lens squeezes a Gaussian beam into a spot of radius M²λf/(πw): the wider the beam on the lens (the more of the lens it fills), the smaller the spot. A hard-edged lens cannot beat the Airy limit; the price of a small spot is a short depth of focus.',
    cyl: 'A cylinder lens bends light in one direction only, so a round beam becomes a fan, and the fan lands on a screen as a line. The line is brightest in the middle and fades towards its ends, as the beam’s own Gaussian profile does.',
    powell: 'A Powell lens has a curved roof that sends more light towards the ends of the fan than a cylinder lens does, so the line is almost evenly bright. It makes the lines used for levelling, machine vision and light sheets.',
    axicon: 'An axicon is a glass cone. It bends every ray towards the axis by the same angle β, so the rays cross along a long thin line (a Bessel beam: a bright core ringed by faint rings, which hardly spreads over that length) and then spread into a ring. Move the screen to see both.',
    flat: 'A flat-top shaper turns the bell of a Gaussian beam into an even disc with steep edges. The profile is a super-Gaussian, exp[−2(r/w)ⁿ]: order 2 is the Gaussian, 10 or more is nearly flat. A flat top stays flat only while the distance is short enough for its Fresnel number to be large; farther on, diffraction ripples the edge and the disc relaxes back into a bell.',
    homog: 'Two arrays of tiny lenses cut the beam into many small beams, and a second lens makes each of them cover the same square. The square is as wide as one lenslet is projected through the lens: lenslet pitch × focal length of the lens ÷ focal length of the lenslet. Coherent light adds fine interference ripples on the square, which are not drawn.',
    doe: 'A diffractive element is a surface etched with a pattern of steps a wavelength deep. Like a grating in two directions it sends light into orders at sin θ = m λ / d; the pattern of the steps decides how much goes into each, so it can project a matrix of dots, a cross or a ring. Orders for which mλ/d reaches 1 do not exist.'
  };
  /* the intensity (1 at the centre of the input) of a round super-Gaussian beam of 1/e² radius w and order n, a distance z on:
     Fresnel propagation as a Hankel transform; { I(r), exact } — for a very large Fresnel number the shape has not yet changed */
  function propagate(w, n, nm, z) {
    const lam = nm * 1e-9, k = 2 * PI / lam, NF = w * w / (lam * z), ideal = r => Math.exp(-2 * Math.pow(Math.abs(r) / w, n));
    const ext = w * clamp(Math.max(1.6, 1.02 / NF), 1.6, 40);
    if (!(NF < 12)) return { I: ideal, exact: false, ext, NF };
    const rho = w * (n >= 4 ? 1.8 : 2.4), ns = clamp(Math.round(45 * NF * 1.4), 140, 700), nr = 120, E0 = new Float64Array(ns), tab = new Float64Array(nr + 1);
    for (let i = 0; i < ns; i++) E0[i] = Math.exp(-Math.pow((i + 0.5) * rho / ns / w, n));
    for (let j = 0; j <= nr; j++) {
      const r = ext * j / nr; let re = 0, im = 0;
      for (let i = 0; i < ns; i++) { const p = (i + 0.5) * rho / ns, a = E0[i] * O.besselJ0(k * p * r / z) * p, ph = k * p * p / (2 * z); re += a * Math.cos(ph); im += a * Math.sin(ph); }
      const s = (k / z) * (rho / ns); tab[j] = s * s * (re * re + im * im);
    }
    return { I: r => { const q = Math.abs(r) / ext * nr; if (q >= nr) return tab[nr]; const j = Math.floor(q); return tab[j] + (tab[j + 1] - tab[j]) * (q - j); }, exact: true, ext, NF };
  }

  function shaping(el) {
    const Sh = O.shape, B = O.beam;
    const L = T.util.lab(el, 'Concentrating light into a point, a line or a shape is the job of a few simple elements. Choose one; the sketch shows the element and the light (not to scale), the picture is what lands on a screen, the curve below it is the profile, and the read-outs give sizes at the distance you choose. Beams here are collimated Gaussian beams.', 0.58, { minH: 400, maxH: 640 });
    L.under.innerHTML = '<div class="shplot"></div><p class="small muted mt shnote"></p>' +
      T.util.more(['beam-shaping-overview', 'focusing-to-a-point', 'laser-line-generators', 'light-sheets', 'axicons-and-bessel-beams', 'flat-top-beam-shapers', 'microlens-arrays', 'diffractive-optical-elements', 'pattern-projectors']);
    const plot = K.plot(ui.$('.shplot', L.under), { x: { label: '' }, y: { label: '' }, legend: true }, 250), noteEl = ui.$('.shnote', L.under);
    const ctl = K.controls(L.side, [
      { id: 'el', type: 'select', label: 'Element', options: SHAPERS, value: 'focus' },
      { id: 'nm', label: 'Wavelength λ', min: 300, max: 1600, step: 1, value: 633, unit: 'nm' },
      { id: 'bd', label: 'Beam diameter on the element, 2w', min: 0.3, max: 20, value: 4, log: true, sig: 3, fmt: v => si(v * 1e-3, 'm') },
      { id: 'f', label: 'Focal length of the lens', min: 5, max: 2000, value: 100, log: true, sig: 3, fmt: v => si(v * 1e-3, 'm') },
      { id: 'lensD', label: 'Diameter of the lens', min: 5, max: 50, value: 25, log: true, sig: 3, fmt: v => si(v * 1e-3, 'm') },
      { id: 'M2', label: 'Beam quality M²', min: 1, max: 10, value: 1, log: true, sig: 2, fmt: v => 'M² = ' + sg(v, 2) },
      { id: 'fan', label: 'Fan angle of the Powell lens', min: 5, max: 120, step: 1, value: 30, unit: '°' },
      { id: 'alpha', label: 'Base angle of the axicon (glass n = 1.5)', min: 0.5, max: 15, step: 0.1, value: 3, unit: '°' },
      { id: 'order', label: 'Order of the flat top', min: 2, max: 20, step: 1, value: 8 },
      { id: 'pitch', label: 'Pitch of the lenslets', min: 0.1, max: 3, value: 0.5, log: true, sig: 2, fmt: v => si(v * 1e-3, 'm') },
      { id: 'fLA', label: 'Focal length of a lenslet', min: 1, max: 50, value: 10, log: true, sig: 2, fmt: v => si(v * 1e-3, 'm') },
      { id: 'kind', type: 'select', label: 'Pattern of the diffractive element', options: [['A matrix of dots', 'matrix'], ['A cross-hair', 'cross'], ['A ring of dots', 'ring']], value: 'matrix' },
      { id: 'nd', label: 'Orders on each side', min: 1, max: 12, step: 1, value: 4 },
      { id: 'per', label: 'Period of the pattern, d', min: 2, max: 100, value: 10, log: true, sig: 2, fmt: v => si(v * 1e-6, 'm') },
      { id: 'z', label: 'Distance to the screen', min: 0.05, max: 10, value: 1, log: true, sig: 3, fmt: v => si(v, 'm') }
    ], () => { showRows(); draw(); });
    const V = ctl.values;
    const ROS = {
      focus: K.readout(L.side, [['w0', 'Spot radius w₀'], ['dia', 'Spot diameter 2w₀'], ['dof', 'Depth of focus 2z_R'], ['fill', 'Lens filled by the beam'], ['airy', 'Limit of a hard-edged lens'], ['atz', 'Beam radius at the chosen distance']]),
      line: K.readout(L.side, [['fan', 'Fan angle'], ['len', 'Length of the line at the screen'], ['wid', 'Width of the line'], ['ends', 'Brightness at the ends of the line']]),
      axicon: K.readout(L.side, [['beta', 'Deflection of each ray, β'], ['zmax', 'Length of the long thin focus'], ['core', 'Radius of the bright core'], ['ring', 'Ring at the screen']]),
      flat: K.readout(L.side, [['d', 'Flat-top diameter 2w'], ['edge', 'Edge width at the shaper (10 % to 90 %)'], ['nf', 'Fresnel number w²/(λz)'], ['r50', 'Half-brightness radius at the screen'], ['pk', 'Centre brightness at the screen']]),
      homog: K.readout(L.side, [['side', 'Side of the flat-top square'], ['div', 'Spread of each lenslet'], ['num', 'Lenslets across the beam'], ['edge', 'Blur of the edges']]),
      doe: K.readout(L.side, [['ang', 'Angle of order 1'], ['gap', 'Spacing of the dots at the screen'], ['count', 'Dots on the screen'], ['size', 'Size of each dot']])
    };
    const GROUP = { focus: 'focus', cyl: 'line', powell: 'line', axicon: 'axicon', flat: 'flat', homog: 'homog', doe: 'doe' };
    const SHOW = { f: ['focus', 'cyl', 'flat', 'homog'], lensD: ['focus'], M2: ['focus'], fan: ['powell'], alpha: ['axicon'], order: ['flat'], pitch: ['homog'], fLA: ['homog'], kind: ['doe'], nd: ['doe'], per: ['doe'], z: ['cyl', 'powell', 'axicon', 'flat', 'doe', 'focus'] };
    function showRows() {
      for (const id in SHOW) ctl.show(id, SHOW[id].includes(V.el));
      for (const g in ROS) ROS[g].show(g === GROUP[V.el]);
      noteEl.innerHTML = '<b>' + esc(SHAPERS.find(s => s[1] === V.el)[0]) + '.</b> ' + esc(SH_NOTES[V.el]);
    }

    /* the picture on the screen: a square of half-width ext (m); fn(x, y) in metres gives the brightness */
    function frame(g, ext, title) {
      const { c, C, pt } = g, side = Math.max(60, Math.min(pt.w, pt.h - 38)), x0 = pt.x + (pt.w - side) / 2, y0 = pt.y + 22;
      txt(c, title, pt.x + pt.w / 2, pt.y + 8, { align: 'center', color: C.text, weight: 650, size: 12 });
      c.fillStyle = '#000'; c.fillRect(x0, y0, side, side);
      const bar = nice(ext * 0.5), bp = side * bar / (2 * ext);
      return { x0, y0, side, px: m => side * (m / ext + 1) / 2, ext, bar, bp, done() {
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0 + 0.5, y0 + 0.5, side - 1, side - 1);
        stroke(c, [[x0 + 8, y0 + side - 10], [x0 + 8 + bp, y0 + side - 10]], '#fff', 2); txt(c, si(bar, 'm', 2), x0 + 8, y0 + side - 20, { color: '#fff', size: 10.5 });
        txt(c, 'the square is ' + si(2 * ext, 'm', 2) + ' wide', x0 + side / 2, y0 + side + 12, { align: 'center', size: 10.5 });
      } };
    }
    const square = (g, ext, fn, title, gamma) => { const fr = frame(g, ext, title); S.image(g.c, fr.x0, fr.y0, fr.side, fr.side, 150, 150, (u, v) => fn((2 * u - 1) * ext, (1 - 2 * v) * ext), { nm: V.nm, gamma: gamma || 0.7 }); fr.done(); return fr; };
    const tag = (g, s, x, y, o) => txt(g.c, s, x, y, Object.assign({ color: g.C.text, size: 10.5, align: 'center' }, o));

    const ELEM = {
      focus(g) {
        const { c, C, ex, xs, cy, sk, nm } = g, F = B.focus({ w: g.w, f: g.f, nm, M2: V.M2 }), fill = V.bd / V.lensD, airy = O.diff.airyRadius(nm, V.f / V.lensD), hl = sk.h * 0.32, hbm = hl * clamp(fill, 0.05, 1.3), xf = ex + (xs - ex) * 0.55;
        S.beam(c, sk.x, ex, cy, hbm, { nm, alpha: 0.4 }); S.thinLens(c, ex, cy, hl, 1, { color: C.accent });
        const hc = Math.min(hbm, hl);
        for (const sgn of [-1, 1]) S.ray(c, [[ex, cy + sgn * hc], [xf, cy], [xs, cy - sgn * hc * (xs - xf) / (xf - ex)]], { nm, width: 1.5, arrows: false });
        disc(c, xf, cy, 3, C.text); tag(g, 'focus: 2w₀ = ' + si(2 * F.w0, 'm'), xf, cy + hl * 0.6 + 12); tag(g, 'f = ' + si(g.f, 'm'), (ex + xf) / 2, cy - hl - 8, { color: C.muted });
        square(g, 3.2 * F.w0, (x, y) => Math.exp(-2 * (x * x + y * y) / (F.w0 * F.w0)), 'The spot at the focus');
        const wz = B.w(g.z - g.f, F.w0, nm, V.M2), r = F.w0 * 1e6;
        ROS.focus.set('w0', si(F.w0, 'm') + ' (1/e² radius)'); ROS.focus.set('dia', si(2 * F.w0, 'm')); ROS.focus.set('dof', si(F.dof, 'm') + ' (the beam stays within √2 w₀)');
        ROS.focus.set('fill', sg(fill * 100, 3) + ' % of the lens diameter' + (fill > 1 ? ': the lens clips the beam' : '')); ROS.focus.set('airy', 'Airy radius ' + si(airy, 'm') + ' (1.22 λ × f-number, at f/' + sg(V.f / V.lensD, 3) + ')');
        ROS.focus.set('atz', si(wz, 'm') + ' at ' + si(g.z, 'm') + ' from the lens');
        const pts = []; for (let fl = 0.1; fl <= 1.6001; fl += 0.02) pts.push([fl, V.M2 * g.lam * g.f / (PI * fl * V.lensD * 5e-4) * 1e6]);
        plot.set({ x: { label: 'beam diameter ÷ lens diameter', min: 0.1, max: 1.6 }, y: { label: 'spot radius w₀ (µm)', log: true, min: Math.max(1e-3, Math.min(r, airy * 1e6) / 2), max: Math.max(pts[0][1], r) * 1.3 }, series: [{ pts, label: 'Gaussian spot, M²λf/(πw)', color: C.accent, width: 2.4 }],
          hlines: [{ y: airy * 1e6, label: 'Airy limit of the lens', color: C.warn }], vlines: [{ x: 1, label: 'beam as wide as the lens', color: C.faint }], marks: [{ x: clamp(fill, 0.1, 1.6), y: r, label: 'now' }] });
      },
      line(g, kind) {
        const { c, C, ex, xs, cy, sk, nm, w } = g, fan = kind === 'powell' ? V.fan * D2R : Sh.fanAngle(V.bd * 1e-3, V.f * 1e-3), len = Sh.lineLength(fan, g.z), wz = B.w(g.z, w, nm, 1), prof = kind === 'powell' ? 'powell' : 'gaussian';
        S.beam(c, sk.x, ex, cy, sk.h * 0.14, { nm, alpha: 0.4 });
        if (kind === 'powell') S.poly(c, [[ex - 8, cy - sk.h * 0.2], [ex + 8, cy - sk.h * 0.2], [ex + 8, cy + sk.h * 0.2], [ex - 8, cy + sk.h * 0.2]], { label: '' }); else S.lens(c, ex - 5, cy, sk.h * 0.2, { f: -1, t: 10 });
        const t = Math.tan(fan / 2), dx = xs - ex;
        for (const sgn of [-1, 1]) { const len2 = Math.min(dx, (sk.h / 2 - 6) / t); S.ray(c, [[ex, cy], [ex + len2, cy - sgn * t * len2]], { nm, width: 1.4, arrows: false }); }
        fillPoly(c, [[ex, cy], [ex + Math.min(dx, (sk.h / 2 - 6) / t), cy - Math.min(sk.h / 2 - 6, t * dx)], [ex + Math.min(dx, (sk.h / 2 - 6) / t), cy + Math.min(sk.h / 2 - 6, t * dx)]], S.nm(nm, 0.12));
        S.screen(c, xs, cy, sk.h / 2 - 6, { w: 3 }); tag(g, 'fan angle ' + sg(fan * R2D, 3) + '°', ex + dx * 0.4, cy - 8 - sk.h * 0.12, { color: C.muted });
        tag(g, kind === 'powell' ? 'Powell lens' : 'cylinder lens', ex, cy - sk.h * 0.2 - 10);
        const ext = Math.max(len / 2 * 1.15, 4 * wz), pix = ext / 75, wt = Math.max(wz, 1.5 * pix);
        square(g, ext, (x, y) => Sh.lineProfile(x / (len / 2), prof) * Math.exp(-2 * y * y / (wt * wt)), 'The line at ' + si(g.z, 'm'), 0.8);
        ROS.line.set('fan', sg(fan * R2D, 3) + '° (full angle)'); ROS.line.set('len', si(len, 'm') + ' at ' + si(g.z, 'm')); ROS.line.set('wid', si(2 * wz, 'm') + ' (beam diameter there)');
        ROS.line.set('ends', sg(Sh.lineProfile(1, prof) / Sh.lineProfile(0, prof) * 100, 3) + ' % of the centre');
        const pg = [], pp = []; for (let i = 0; i <= 120; i++) { const u = -1.2 + 2.4 * i / 120; pg.push([u, Sh.lineProfile(u, 'gaussian')]); pp.push([u, Sh.lineProfile(u, 'powell')]); }
        plot.set({ x: { label: 'position along the line (1 = the end)', min: -1.2, max: 1.2 }, y: { label: 'relative brightness', min: 0, max: 1.05, log: false }, series: [{ pts: pg, label: 'cylinder lens', color: C.series[1], width: kind === 'cyl' ? 3 : 1.6, dash: kind === 'cyl' ? null : [5, 4] }, { pts: pp, label: 'Powell lens', color: C.series[2], width: kind === 'powell' ? 3 : 1.6, dash: kind === 'powell' ? null : [5, 4] }], vlines: [{ x: -1 }, { x: 1 }], hlines: [], marks: [] });
      },
      axicon(g) {
        const { c, C, ex, xs, cy, sk, nm, w } = g, A = Sh.axicon({ alpha: V.alpha * D2R, n: 1.5, w, nm }), tb = Math.tan(A.beta), inZone = g.z < A.zmax, hb = sk.h * 0.26, zone = (xs - ex) * 0.62, ts = hb / zone;
        S.beam(c, sk.x, ex, cy, hb, { nm, alpha: 0.4 });
        S.poly(c, [[ex - 12, cy - hb], [ex - 12, cy + hb], [ex + 12, cy]], {});
        fillPoly(c, [[ex + 12, cy - hb], [ex + 12 + zone, cy], [ex + 12, cy + hb]], S.nm(nm, 0.22));
        for (const f2 of [1, 0.5, -0.5, -1]) { const x1 = ex + 12, y1 = cy - f2 * hb, xc = x1 + Math.abs(f2) * hb / ts, xe = xs; S.ray(c, [[x1, y1], [xc, cy], [xe, cy + Math.sign(f2) * (xe - xc) * ts]], { nm, width: 1.2, arrows: false }); }
        const xz = ex + 12 + clamp(g.z / A.zmax, 0.02, 1.6) * zone; S.screen(c, Math.min(xz, sk.x + sk.w - 6), cy, sk.h / 2 - 8, { w: 3 }); tag(g, 'screen', Math.min(xz, sk.x + sk.w - 6), cy - sk.h / 2 + 2);
        tag(g, 'long thin focus (a Bessel beam)', ex + 12 + zone * 0.5, cy + hb + 14, { color: C.muted }); tag(g, 'axicon', ex, cy - hb - 10);
        const R = g.z * tb, ext = inZone ? 5.2 * A.core : Math.max(R + 2 * w, 3 * w) * 1.15;
        square(g, ext, inZone ? (x, y) => Math.pow(O.besselJ0(2.405 * Math.hypot(x, y) / A.core), 2) : (x, y) => Math.exp(-2 * Math.pow(Math.hypot(x, y) - R, 2) / (w * w)), inZone ? 'The Bessel beam at ' + si(g.z, 'm') : 'The ring at ' + si(g.z, 'm'), 0.6);
        ROS.axicon.set('beta', sg(A.beta * R2D, 3) + '° (about (n − 1) × base angle)'); ROS.axicon.set('zmax', si(A.zmax, 'm') + ' (beam radius ÷ tan β)'); ROS.axicon.set('core', si(A.core, 'm') + ' (to the first dark ring)');
        ROS.axicon.set('ring', inZone ? 'none yet: the screen is inside the long focus' : 'radius ' + si(R, 'm') + ', about ' + si(2 * w, 'm') + ' thick');
        const fu = A.core < 1e-5 ? 1e6 : 1e3, un = A.core < 1e-5 ? 'µm' : 'mm', pts = []; for (let i = 0; i <= 200; i++) { const r = -5.2 * A.core + 10.4 * A.core * i / 200; pts.push([r * fu, Math.pow(O.besselJ0(2.405 * Math.abs(r) / A.core), 2)]); }
        plot.set({ x: { label: 'distance from the axis (' + un + ')', min: -5.2 * A.core * fu, max: 5.2 * A.core * fu }, y: { label: 'relative intensity', min: 0, max: 1.05, log: false }, series: [{ pts, label: 'Bessel core, J₀²', color: C.accent, width: 2.4 }], vlines: [{ x: -A.core * fu }, { x: A.core * fu, label: 'first dark ring' }], hlines: [], marks: [] });
      },
      flat(g) {
        const { c, C, ex, xs, cy, sk, nm, w } = g, n = V.order, P = propagate(w, n, nm, g.z), hb = sk.h * 0.26, bell = (x0, ord, col) => { const pts = []; for (let i = 0; i <= 60; i++) { const y = -1.3 + 2.6 * i / 60; pts.push([x0 + 46 * Math.exp(-2 * Math.pow(Math.abs(y), ord)), cy + y * hb]); } stroke(c, pts, col, 2); stroke(c, [[x0, cy - 1.3 * hb], [x0, cy + 1.3 * hb]], C.faint, 1); };
        S.beam(c, sk.x + 56, ex - 28, cy, hb, { nm, alpha: 0.35 }); S.beam(c, ex + 28, xs, cy, hb, { nm, alpha: 0.35 });
        bell(sk.x + 6, 2, C.series[1]); bell(xs - 70, n, C.series[2]);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.4; c.fillRect(ex - 24, cy - hb * 1.1, 48, hb * 2.2); c.strokeRect(ex - 24, cy - hb * 1.1, 48, hb * 2.2); tag(g, 'shaper', ex, cy);
        tag(g, 'Gaussian in', sk.x + 30, cy - 1.3 * hb - 10, { color: C.muted }); tag(g, 'order ' + n + ' out', xs - 46, cy - 1.3 * hb - 10, { color: C.muted });
        const ext = P.ext, sc = 1;
        square(g, ext, (x, y) => P.I(Math.hypot(x, y)), 'The beam at ' + si(g.z, 'm'), 0.7);
        const rr = w * Math.pow(Math.LN10 / 2, 1 / n) - w * Math.pow(Math.log(1 / 0.9) / 2, 1 / n);
        let r50 = 0, pk = P.I(0); for (let r = 0; r <= ext; r += ext / 400) { if (P.I(r) >= 0.5 * pk) r50 = r; else break; }
        ROS.flat.set('d', si(2 * w, 'm') + ' at the 1/e² level'); ROS.flat.set('edge', si(rr, 'm') + ' (' + sg(rr / w * 100, 2) + ' % of the radius)');
        ROS.flat.set('nf', sg(P.NF, 3) + (P.NF >= 12 ? ': near field, the profile is still the shaper’s own' : P.NF > 1 ? ': the edge is rippling' : ': far field, the beam has relaxed into a bell')); ROS.flat.set('r50', si(r50, 'm') + ' (the input has ' + si(w * Math.pow(Math.LN2 / 2, 1 / n), 'm') + ')'); ROS.flat.set('pk', sg(P.I(0) * 100, 3) + ' % of the input’s');
        const q = (ord) => { const pts = []; for (let i = 0; i <= 160; i++) { const u = -2 + 4 * i / 160; pts.push([u, Sh.superGaussian(u, 1, ord)]); } return pts; }, ser = [{ pts: q(2), label: 'Gaussian (order 2)', color: C.series[1], width: 1.8 }, { pts: q(n), label: 'order ' + n, color: C.series[2], width: 2.6 }];
        if (n < 20) ser.push({ pts: q(20), label: 'order 20', color: C.faint, width: 1.4, dash: [5, 4] });
        if (P.exact) { const pp = []; for (let i = 0; i <= 160; i++) { const u = -2 + 4 * i / 160; pp.push([u, P.I(Math.abs(u) * w)]); } ser.push({ pts: pp, label: 'after ' + si(g.z, 'm'), color: C.text, width: 2 }); }
        plot.set({ x: { label: 'distance from the axis ÷ w', min: -2, max: 2 }, y: { label: 'relative intensity', min: 0, max: 1.15, log: false }, series: ser, vlines: [{ x: -1 }, { x: 1, label: 'w' }], hlines: [], marks: [] });
      },
      homog(g) {
        const { c, C, ex, xs, cy, sk, nm } = g, p = V.pitch * 1e-3, fla = V.fLA * 1e-3, ff = V.f * 1e-3, side = Sh.homogenizer(p, fla, ff), edge = g.lam * ff / p, s = Math.max(edge / 4.4, side * 0.01), hb = sk.h * 0.3, nl = 5, ph = 2 * hb / nl, hf = sk.h * 0.2;
        S.beam(c, sk.x, ex, cy, hb, { nm, alpha: 0.35 }); const x2 = ex + (xs - ex) * 0.22;
        for (let i = 0; i < nl; i++) { const y = cy - hb + ph * (i + 0.5); S.thinLens(c, ex, y, ph * 0.45, 1, { width: 1.4 }); for (const sgn of [-1, 1]) stroke(c, [[ex, y], [xs, cy + sgn * hf]], S.nm(nm, 0.5), 1); }
        S.thinLens(c, x2, cy, hb, 1, { color: C.accent }); S.screen(c, xs, cy, hf + 6, { w: 3 }); stroke(c, [[xs + 8, cy - hf], [xs + 8, cy + hf]], C.text, 2);
        tag(g, 'lenslet arrays', ex, cy - hb - 10); tag(g, 'second lens', x2, cy + hb + 12); tag(g, 'square ' + si(side, 'm'), xs - 20, cy + hf + 14);
        const e1 = x => 1 / (1 + Math.exp((Math.abs(x) - side / 2) / s));
        square(g, side * 0.75, (x, y) => e1(x) * e1(y), 'The square at the focus of the second lens', 0.8);
        ROS.homog.set('side', si(side, 'm') + ' (pitch × f ÷ lenslet focal length)'); ROS.homog.set('div', sg(2 * Math.atan(p / (2 * fla)) * R2D, 3) + '° full angle'); ROS.homog.set('num', sg(V.bd * 1e-3 / p, 3) + ' lenslets (the more, the more even)'); ROS.homog.set('edge', 'about ' + si(edge, 'm') + ' (λf ÷ pitch)');
        const pts = []; for (let i = 0; i <= 200; i++) { const x = -side * 0.75 + 1.5 * side * i / 200; pts.push([x * 1e3, e1(x)]); }
        plot.set({ x: { label: 'position across the square (mm)', min: -side * 750, max: side * 750 }, y: { label: 'relative intensity', min: 0, max: 1.15, log: false }, series: [{ pts, label: 'flat-top profile', color: C.accent, width: 2.4 }], vlines: [{ x: -side * 500 }, { x: side * 500, label: 'edge' }], hlines: [], marks: [] });
      },
      doe(g) {
        const { c, C, ex, xs, cy, sk, nm, lam, w } = g, d = V.per * 1e-6, nd = V.nd, z = g.z, sp = m => m * lam / d, dots = [];
        const add = (sx, sy) => { const r2 = sx * sx + sy * sy; if (r2 < 0.96) { const dz = Math.sqrt(1 - r2); dots.push([z * sx / dz, z * sy / dz]); } };
        if (V.kind === 'matrix') { for (let m = -nd; m <= nd; m++) for (let k = -nd; k <= nd; k++) add(sp(m), sp(k)); }
        else if (V.kind === 'cross') { for (let m = -nd; m <= nd; m++) add(sp(m), 0); for (let k = -nd; k <= nd; k++) if (k) add(0, sp(k)); }
        else { add(0, 0); for (let i = 0; i < 12; i++) add(sp(nd) * Math.cos(TAU * i / 12), sp(nd) * Math.sin(TAU * i / 12)); }
        const wz = B.w(z, w, nm, 1), maxc = dots.reduce((a, q) => Math.max(a, Math.abs(q[0]), Math.abs(q[1])), 0), ext = Math.max(maxc * 1.18, 4 * wz);
        S.beam(c, sk.x, ex, cy, sk.h * 0.1, { nm, alpha: 0.4 }); S.grating(c, ex, cy, sk.h * 0.2, { lines: 10 }); tag(g, 'diffractive element', ex, cy - sk.h * 0.2 - 10);
        const orders = []; for (let m = -nd; m <= nd; m++) if (Math.abs(sp(m)) < 1) orders.push(m);
        for (const m of orders) { const th = Sh.doeAngle(m, d, nm), t = Math.tan(th), dx = xs - ex, len = Math.min(dx, t === 0 ? dx : (sk.h / 2 - 6) / Math.abs(t)); S.ray(c, [[ex, cy], [ex + len, cy - t * len]], { nm, width: m ? 1.1 : 1.6, arrows: false, alpha: 0.9 }); }
        S.screen(c, xs, cy, sk.h / 2 - 6, { w: 3 });
        const fr = frame(g, ext, 'The pattern on the wall at ' + si(z, 'm')), px = fr.side / (2 * ext), rad = clamp(wz * px, 2, 9);
        for (const q of dots) { const x = fr.x0 + fr.side / 2 + q[0] * px, y = fr.y0 + fr.side / 2 - q[1] * px; if (x > fr.x0 && x < fr.x0 + fr.side && y > fr.y0 && y < fr.y0 + fr.side) { disc(c, x, y, rad * 1.8, S.nm(nm, 0.25)); disc(c, x, y, rad, S.nm(nm)); } }
        fr.done();
        const s1 = sp(1), gap = s1 < 1 ? z * s1 / Math.sqrt(1 - s1 * s1) : NaN, want = V.kind === 'matrix' ? (2 * nd + 1) * (2 * nd + 1) : V.kind === 'cross' ? 4 * nd + 1 : 13;
        ROS.doe.set('ang', s1 < 1 ? sg(Sh.doeAngle(1, d, nm) * R2D, 3) + '° (sin θ = λ/d)' : 'none: λ is not smaller than d'); ROS.doe.set('gap', fin(gap) ? si(gap, 'm') + ' between neighbouring dots near the centre' : '—');
        ROS.doe.set('count', dots.length + (dots.length < want ? ' (of ' + want + ': the other orders do not exist)' : '')); ROS.doe.set('size', si(2 * wz, 'm') + ' across (the beam’s own width there)');
        plot.set({ x: { label: 'angle of each order in the plane of the pattern (°)', min: -90, max: 90 }, y: { label: 'orders', min: 0, max: 1.4, log: false }, series: [{ pts: orders.map(m => [Sh.doeAngle(m, d, nm) * R2D, 1]), label: 'orders that exist', color: C.accent, line: false, dots: 5 }], vlines: [], hlines: [], marks: [] });
      }
    };

    function draw() {
      showRows();
      const c = L.st.begin(), C = colors(), W = L.st.W, Hh = L.st.H, nm = V.nm, wide = W >= 620;
      const sk = wide ? { x: 10, y: 30, w: W * 0.52 - 20, h: Hh - 60 } : { x: 10, y: 28, w: W - 20, h: (Hh - 56) * 0.46 };
      const pt = wide ? { x: W * 0.52, y: 20, w: W * 0.48 - 12, h: Hh - 30 } : { x: 10, y: 28 + (Hh - 56) * 0.46 + 14, w: W - 20, h: (Hh - 56) * 0.54 - 6 };
      const cy = sk.y + sk.h / 2, g = { c, C, sk, pt, nm, lam: nm * 1e-9, w: V.bd * 5e-4, z: V.z, f: V.f * 1e-3, ex: sk.x + sk.w * 0.34, xs: sk.x + sk.w * 0.92, cy };
      txt(c, 'Side view (not to scale)', sk.x, sk.y - 12, { color: C.text, weight: 650, size: 12 });
      S.axis(c, sk.x, cy, sk.x + sk.w);
      if (V.el === 'cyl' || V.el === 'powell') ELEM.line(g, V.el); else ELEM[V.el](g);
      if (invisible(nm)) txt(c, 'invisible light, drawn in a dim colour', 10, Hh - 8, { color: C.warn, size: 10.5 });
    }
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }
  /* ================================================================ 6 · laser families and safety */
  const FAMS = [['gas', 'Gas'], ['solid', 'Solid-state'], ['semiconductor', 'Semiconductor'], ['fibre', 'Fibre'], ['liquid', 'Liquid (dye)']];
  const BAND_NAMES = { uvc: 'UV-C', uvb: 'UV-B', uva: 'UV-A', nir: 'near IR', swir: 'short-wave IR', mwir: 'mid-wave IR', lwir: 'thermal IR' };
  const NM_LO = 150, NM_HI = 12000;
  const shortName = l => l.name.replace(/ \(.*\)$/, '');

  function lasers(el) {
    const L = T.util.lab(el, 'Lasers differ in what makes the light — a gas discharge, a crystal, a semiconductor junction, a doped fibre, a dye — and each kind makes its own wavelengths. Every laser of the table is placed on one logarithmic wavelength axis, from the ultraviolet to the thermal infrared: the strongest line is the large mark, the other lines are small marks, and a ring means light you cannot see. Click a laser, or choose one, to read its lines, colours and photon energies. The safety calculator further down is a teaching model for visible continuous beams.', 0.95, { minH: 560, maxH: 780 });
    L.under.innerHTML = '<div class="lsdet"></div>' + T.util.box('Safety calculator: a teaching model for visible continuous beams only',
      '<p class="small" style="margin:0 0 8px"><b>Caution.</b> This is a simplified model for visible, continuous beams of light. Real laser classification and eye protection follow the standard IEC 60825-1 and the advice of a laser safety officer, and they depend on the wavelength, on pulses, on the size of the beam and on the viewing conditions. <b>Never look into any laser beam, or at its reflection in a shiny surface, whatever its class.</b></p><div class="lsplot"></div><p class="small muted lscls" style="margin:8px 0 0"></p>') +
      T.util.more(['laser-families-overview', 'gas-lasers', 'solid-state-lasers', 'diode-lasers', 'fibre-lasers', 'common-laser-wavelengths', 'laser-safety-classes', 'laser-eye-hazards-and-eyewear', 'laser-power-and-energy-measures']);
    const detEl = ui.$('.lsdet', L.under), clsEl = ui.$('.lscls', L.under), plot = K.plot(ui.$('.lsplot', L.under), { x: { label: 'distance from the laser (m)', log: true }, y: { label: 'irradiance (W/m²)', log: true }, legend: true }, 260);
    let rowsLay = [];
    const ctl = K.controls(L.side, [
      { id: 'fam', type: 'select', label: 'Show the family', options: [['All families', 'all']].concat(FAMS.map(f2 => [f2[1], f2[0]])), value: 'all' },
      { id: 'laser', type: 'select', label: 'Laser', options: O.LASERS.map(l => [shortName(l), l.id]), value: 'hene' },
      { type: 'html', html: 'Click a laser in the chart to choose it.' },
      { type: 'html', html: '<b>Safety calculator</b> (visible, continuous beams only; see the caution below the chart)' },
      { id: 'P', label: 'Power of the beam', min: 1e-5, max: 10, value: 0.005, log: true, sig: 3, fmt: v => si(v, 'W') },
      { id: 'dia', label: 'Beam diameter at the laser', min: 0.2, max: 50, value: 2, log: true, sig: 2, fmt: v => si(v * 1e-3, 'm') },
      { id: 'div', label: 'Divergence (full angle)', min: 0.05, max: 20, value: 1, log: true, sig: 2, fmt: v => si(v * 1e-3, 'rad') },
      { id: 'dist', label: 'Distance from the laser', min: 0.1, max: 3000, value: 5, log: true, sig: 3, fmt: v => si(v, 'm') }
    ], (id, v) => {
      if (id === 'fam' && v !== 'all' && O.laserById(V.laser).family !== v) ctl.set('laser', O.LASERS.find(l => l.family === v).id);
      draw();
    });
    const V = ctl.values;
    const ro = K.readout(L.side, [['cls', 'Class'], ['txt', 'What the class means'], ['e0', 'Irradiance at the laser'], ['ez', 'Irradiance at the chosen distance'], ['mpe', 'Maximum permissible exposure (0.25 s blink)'], ['nohd', 'Nominal ocular hazard distance'], ['od', 'Eyewear needed: optical density']]);

    function chart(c, C, W, Hh) {
      const nameW = clamp(W * 0.2, 112, 180), x0 = nameW + 10, x1 = W - 14, X = nm => x0 + (x1 - x0) * Math.log(nm / NM_LO) / Math.log(NM_HI / NM_LO), Xi = x => NM_LO * Math.exp((x - x0) / (x1 - x0) * Math.log(NM_HI / NM_LO));
      txt(c, 'Laser wavelengths on a logarithmic axis', 10, 14, { color: C.text, weight: 650, size: 12.5 });
      const sel = O.laserById(V.laser), cap = Math.max(20, Math.floor((W - 20) / 5.9)), list = shortName(sel) + ': ' + sel.nm.map(n2 => sg(n2, 5)).join(', ') + ' nm';
      txt(c, list.length > cap ? list.slice(0, cap - 1) + '…' : list, 10, 31, { color: C.accent, weight: 650, size: 11 });
      const by = 44, bh = 14;
      c.save(); c.globalAlpha = 0.5; c.fillStyle = S.nm(300); c.fillRect(x0, by, X(380) - x0, bh); c.fillStyle = S.nm(1000); c.fillRect(X(780), by, x1 - X(780), bh); c.restore();
      paintSpectrum(c, X, Xi, 380, 780, by, bh);
      c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0 + 0.5, by + 0.5, x1 - x0 - 1, bh - 1);
      const ticks = [[200, '200 nm'], [300, '300'], [400, '400'], [500, '500'], [700, '700'], [1000, '1 µm'], [2000, '2'], [5000, '5'], [10000, '10 µm']];
      for (const [nm, s] of ticks) { stroke(c, [[X(nm), by + bh], [X(nm), by + bh + 4]], C.axis, 1); txt(c, s, X(nm), by + bh + 12, { align: 'center', size: 10 }); }
      txt(c, 'visible', (X(380) + X(780)) / 2, by + bh / 2, { align: 'center', color: '#111', size: 10, weight: 650 });
      O.BANDS.filter(b => BAND_NAMES[b[0]]).forEach((b, i) => {
        const a = X(clamp(b[2], NM_LO, NM_HI)), e = X(clamp(b[3], NM_LO, NM_HI)), nm = BAND_NAMES[b[0]], wide = (e - a) > nm.length * 5.6, row = wide ? 0 : i % 2 + 1;
        stroke(c, [[a + 1, by + bh + 32 + row * 0], [e - 1, by + bh + 32]], C.faint, 1.4);
        txt(c, nm, clamp((a + e) / 2, x0 + nm.length * 2.7, x1 - nm.length * 2.7), by + bh + 42 + (wide ? 0 : 11 + (i % 2) * 11), { align: 'center', size: 9.5 });
      });
      const items = []; FAMS.filter(f2 => V.fam === 'all' || V.fam === f2[0]).forEach((f2, k) => { items.push({ head: f2, k }); O.LASERS.filter(l => l.family === f2[0]).forEach(l => items.push({ l, k })); });
      const top = by + bh + 70, rowH = clamp((Hh - top - 8) / items.length, 13, 24);
      rowsLay = [];
      for (const [nm] of ticks) stroke(c, [[X(nm), top - 4], [X(nm), top + rowH * items.length]], C.grid, 1);
      items.forEach((it, i) => {
        const y = top + rowH * (i + 0.5), col = C.series[it.k % C.series.length];
        if (it.head) { txt(c, it.head[1].toUpperCase(), 10, y, { color: col, weight: 700, size: 10 }); stroke(c, [[10 + it.head[1].length * 7.5, y], [x1, y]], col, 1); return; }
        const l = it.l, on = l.id === V.laser;
        rowsLay.push({ id: l.id, y0: y - rowH / 2, y1: y + rowH / 2 });
        if (on) { c.save(); c.globalAlpha = 0.16; c.fillStyle = C.accent; c.fillRect(6, y - rowH / 2, x1 - 6 + 8, rowH); c.restore(); }
        txt(c, shortName(l), 14, y, { color: on ? C.text : C.muted, weight: on ? 700 : 500, size: 11 });
        l.nm.slice().reverse().forEach((nm, k, a) => {
          const main = k === a.length - 1, x = X(clamp(nm, NM_LO, NM_HI)), r = main ? 5 : 3;
          if (invisible(nm)) { disc(c, x, y, r, C.bg2, S.nm(nm)); } else disc(c, x, y, r, S.nm(nm), main ? C.text : null);
        });
      });
    }

    function draw() {
      const c = L.st.begin(), C = colors(), W = L.st.W, Hh = L.st.H;
      chart(c, C, W, Hh);
      /* the table of the chosen laser */
      const l = O.laserById(V.laser), fam = FAMS.find(f2 => f2[0] === l.family)[1];
      const rows = l.nm.map((nm, i) => [sg(nm, 5) + ' nm' + (i === 0 ? ' (strongest line)' : ''), (invisible(nm) ? '' : T.util.swatch(O.colour.wavelength(nm))) + (invisible(nm) ? 'invisible: ' : '') + O.colourName(nm), sg(O.photonEnergy(nm), 3) + ' eV', sg(O.frequency(nm) / 1e12, 4) + ' THz']);
      detEl.innerHTML = T.util.box(esc(shortName(l)) + ' laser', '<p class="small muted" style="margin:0 0 8px"><b>' + esc(fam) + '</b> · ' + esc(l.mode) + ' · power ' + esc(l.power) + '<br>Pumped by: ' + esc(l.pump) + '<br>Used for: ' + esc(l.uses) + '</p>' + T.util.table(['Wavelength', 'Colour', 'Photon energy', 'Frequency'], rows));
      /* the safety model */
      const P = V.P, a = V.dia * 1e-3, th = V.div * 1e-3, mpe = O.laser.mpe(0.25).E, cls = O.laser.CLASSES.find(k => k.cls === O.laser.classOf(P));
      const Eat = z => 4 * P / (PI * Math.pow(a + th * z, 2)), E0 = Eat(0), Ez = Eat(V.dist), nohd = O.laser.nohd(P, th, a, mpe);
      ro.set('cls', 'Class ' + cls.cls + ' (' + si(P, 'W') + ')'); ro.set('txt', cls.text + ' Examples: ' + cls.examples);
      ro.set('e0', irr(E0) + ' (beam ' + si(a, 'm') + ' across)'); ro.set('ez', irr(Ez) + ' at ' + si(V.dist, 'm') + ' (beam ' + si(a + th * V.dist, 'm') + ' across)'); ro.set('mpe', si(mpe * 1e-4, 'W/cm²') + ' = ' + sg(mpe, 3) + ' W/m²');
      ro.set('nohd', nohd > 0 ? si(nohd, 'm') + ': beyond it the beam is below the limit' : 'none: the beam is below the limit even at the laser');
      ro.set('od', 'OD ' + sg(O.laser.od(Ez, mpe), 2) + ' at the chosen distance, OD ' + sg(O.laser.od(E0, mpe), 2) + ' at the laser (OD n cuts the light 10ⁿ times)');
      clsEl.innerHTML = 'The class here follows the power alone (' + esc(si(P, 'W')) + ' → class ' + esc(cls.cls) + '). The maximum permissible exposure is the irradiance the eye can take for a 0.25 s blink, 18 t^0.75 J/m² spread over the time t; the nominal ocular hazard distance is where the diverging beam has fallen to it. Eyewear needs an optical density of at least log₁₀(exposure ÷ limit).';
      const xmax = Math.max(3000, nohd * 4), pts = []; for (let i = 0; i <= 160; i++) { const z = 0.1 * Math.pow(xmax / 0.1, i / 160); pts.push([z, Math.max(Eat(z), 1e-9)]); }
      plot.set({ x: { label: 'distance from the laser (m)', log: true, min: 0.1, max: xmax }, y: { label: 'irradiance (W/m²)', log: true, min: Math.max(1e-6, Math.min(mpe / 100, Eat(xmax)) / 2), max: Math.max(E0, mpe * 10) * 2 },
        series: [{ pts, label: 'irradiance of the beam', color: C.accent, width: 2.4 }], hlines: [{ y: mpe, label: 'limit: ' + sg(mpe * 0.1, 3) + ' mW/cm²', color: C.bad }], vlines: nohd > 0.1 && nohd < xmax ? [{ x: nohd, label: 'NOHD ' + si(nohd, 'm'), color: C.warn }] : [], marks: [{ x: V.dist, y: Math.max(Ez, 1e-9), label: 'you are here' }] });
    }
    K.click(L.st, p => { const r = rowsLay.find(q => p.y >= q.y0 && p.y < q.y1); if (r) { ctl.set('laser', r.id); const f2 = O.laserById(r.id).family; if (V.fam !== 'all' && V.fam !== f2) ctl.set('fam', 'all'); draw(); } }, p => rowsLay.some(q => p.y >= q.y0 && p.y < q.y1));
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }
})();
