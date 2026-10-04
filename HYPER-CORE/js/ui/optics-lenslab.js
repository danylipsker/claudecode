/* HYPER-CORE · ui/optics-lenslab.js — Tools → Lens lab (#/tools/lenslab/<layout|aberrations|bending|achromat>)
 *
 *   layout        a library lens drawn to scale with ray fans (one colour, F-d-C together, or three field angles),
 *                 the focal point, principal planes and pupils, and its prescription table
 *   aberrations   spot diagrams at three field points against the Airy disc (with a focus slider and best focus),
 *                 ray fans, longitudinal spherical and chromatic focus curves, and the Seidel sums as bars
 *   bending       one singlet of fixed focal length bent through every shape from one meniscus to the other
 *   achromat      a crown and a flint from the glass catalogue cemented into an achromat, against a singlet
 *
 * Every number is traced through the real surfaces (kit.optics, O.sys); the pictures are kit.osym. Small helpers kept here:
 *   work()         the system the rays go through: the entrance pupil is fixed first, then every rim gets 3 % of tolerance,
 *                  so that a ray landing a hair beyond a rim (the edge of the pupil, off axis) is not lost to rounding
 *   fanOf()        O.sys.fan2d with the straight incoming part drawn from the left of the picture (the engine intersects a
 *                  strongly curved first surface on the wrong side when a ray starts far in front of it)
 *   drawable()     adds a flat air surface at the image so that the eye's vitreous humour is drawn
 *   singlet(), makeDoublet()  keep a design physically possible (rims thick enough, surfaces large enough)
 *   seidelBars()   the Seidel sums expressed as the blur each is worth at the image, S/(2n'u'), in µm
 */
(function () {
  'use strict';
  const H = window.Hyper, ui = H.ui, U = H.util, esc = U.esc, K = H.kit, O = H.optics, S = H.osym;
  const T = H.opticsTools = H.opticsTools || {};
  const Sy = O.sys, Dz = O.design, LN = O.LINES;
  const TABS = [['layout', 'Layout and rays'], ['aberrations', 'Aberrations'], ['bending', 'Bending a singlet'], ['achromat', 'Achromat designer']];
  T.lenslab = function (el, params, sub) {
    const t = T.util.subtabs(el, 'lenslab', TABS, sub, 'Every number here comes from tracing rays through the real surfaces, one refraction at a time; none is a thin-lens shortcut. Lengths are in millimetres and angles in degrees.');
    ({ layout, aberrations, bending, achromat })[t.tab](t.body);
  };
  T.lenslab.tabs = TABS.map(t => t[0]);

  /* ---------------------------------------------------------------- small helpers */
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, ND = LN.d, TRI = [LN.F, LN.d, LN.C];
  const TRI_NAMES = ['F  486 nm', 'd  588 nm', 'C  656 nm'];
  const fx = (x, d) => Number.isFinite(x) ? x.toFixed(d == null ? 1 : d).replace('-', '−') : '—';
  const num = x => U.fmt(x, 3);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const clean = pts => pts.filter(p => Number.isFinite(p[0]) && Number.isFinite(p[1]));
  const nice = v => { if (!(v > 0) || !Number.isFinite(v)) return 1; const e = Math.pow(10, Math.floor(Math.log10(v))), m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e; };
  const mirrors = sys => sys.surfaces.filter(s => s.mirror).length;
  const isFlat = R => !R || !Number.isFinite(R);
  const rtxt = R => isFlat(R) || Math.abs(R) > 1e6 ? 'flat' : fx(R, 1);
  const wrap = (str, n) => { const out = []; let line = ''; for (const w of str.split(' ')) { if (line && (line + ' ' + w).length > n) { out.push(line); line = w; } else line = line ? line + ' ' + w : w; } if (line) out.push(line); return out; };
  /* text wrapped to the room between x and the right edge, one K.label per line; returns the y of the line after the last */
  function para(c, str, x, y, right, o) {
    const size = (o && o.size) || 12.5, lines = wrap(str, Math.max(10, Math.floor((right - x - 6) / (size * 0.53))));
    lines.forEach((ln, i) => K.label(c, ln, x, y + i * (size + 5), o));
    return y + lines.length * (size + 5);
  }

  /* the library: names, a plain note for each lens, and how far its field reaches when the prescription does not say */
  const LENS_IDS = Object.keys(O.LENSES);
  const LENS_OPTS = LENS_IDS.map(id => [O.lens(id).name, id]);
  const FIELD_DEG = { biconvex: 5, 'plano-convex': 5, 'convex-plano-reversed': 5, 'best-form': 5, meniscus: 5, biconcave: 5, achromat: 3, 'parabolic-mirror': 0.5, 'spherical-mirror': 0.5, cassegrain: 0.3, eye: 10 };
  const fullField = (id, sys) => sys.field || (FIELD_DEG[id] || 5) * D2R;
  const LENS_NOTE = {
    biconvex: 'The simplest positive lens: both faces bulge outwards. Look at the rays through the rim of the lens: they cross the axis nearer the lens than the rays through the centre. That is spherical aberration.',
    'plano-convex': 'One flat face and one curved face. With the curved face towards the distant object the bending is shared more evenly between the two surfaces than in the biconvex lens, and the rim rays miss the focus by less.',
    'convex-plano-reversed': 'The same lens turned round, so the flat face meets the light first. All the bending now happens at a single surface and the rim rays are thrown much further from the focus: the "wrong way round" shape.',
    'best-form': 'A singlet whose two curves are chosen to share the bending so that spherical aberration is as small as one lens of this glass can make it for a distant object.',
    meniscus: 'A positive meniscus: both surfaces curve the same way, like a watch glass, yet the lens still converges. Bent further than the best form it has more spherical aberration.',
    biconcave: 'A diverging lens. The light spreads out and the rays never meet, so the image is virtual: the dashed lines show where the diverging rays seem to come from. Some rim rays are cut off by the rim of the lens.',
    achromat: 'A crown-glass element cemented to a flint-glass element. The two glasses spread the colours by different amounts, so red and blue are brought to nearly the same focus. Choose "F, d and C light together" to compare with a singlet.',
    'cooke-triplet': 'Three elements (positive, negative, positive) with the stop in the air gap between the second and third. A classic design that corrects every third-order aberration well enough for a wide field at f/5. Show three field angles to see the beams.',
    'double-gauss': 'Six elements arranged almost symmetrically about a central stop, the pattern behind most fast standard camera lenses. The symmetry cancels coma and distortion. Show three field angles to see how much glass the oblique beams pass through.',
    'parabolic-mirror': 'A paraboloid brings a distant on-axis point to a perfect focus, with no spherical aberration and no colour error. The reflected light returns towards the source, so the image forms in front of the mirror.',
    'spherical-mirror': 'The same mirror ground to a sphere instead of a paraboloid: the rim rays focus short of the centre rays, so it shows spherical aberration, though still no colour error because no light passes through glass.',
    cassegrain: 'A parabolic primary and a convex secondary mirror fold a long focal length into a short tube; the light is reflected twice and the image forms behind the primary mirror, which would have a hole for it.',
    eye: 'A schematic human eye: the cornea, the watery aqueous humour, the crystalline lens and the vitreous humour, with the iris as the stop. The image forms on the retina. Notice how much of the focusing is done by the cornea.'
  };

  /* a library lens, optionally scaled to a focal length, with its stop opened or closed by a factor k */
  function build(id, f, k) {
    let sys = O.lens(id);
    if (f > 0) { const e = Sy.paraxial(sys).efl; if (Number.isFinite(e) && e !== 0) sys = Sy.withFocal(sys, Math.sign(e) * f); }
    if (k !== 1) { const st = sys.surfaces[Sy.stopIndex(sys)]; if (st && st.sd != null) { st.sd *= k; if (sys.epd != null) sys.epd *= k; } }
    return sys;
  }
  /* the system the rays are traced through: the aperture (entrance pupil) is fixed first, then every rim gets 3 %
     of tolerance so that a ray landing a hair beyond a rim (the edge of the pupil, off axis) is not lost to rounding */
  function work(sys) {
    const par = Sy.paraxial(sys, ND), w = Sy.scale(sys, 1);
    if (Number.isFinite(par.epd)) w.epd = par.epd;
    for (const s of w.surfaces) if (s.sd != null) s.sd *= 1.03;
    return w;
  }
  /* Sy.fan2d for drawing: the rays are traced from the engine's own start plane just in front of the lens (a start far
     in front of a strongly curved first surface can be intersected on the wrong side), and the straight incoming part
     is added in front of that, back to zStart */
  function fanOf(sys, o) {
    const fan = Sy.fan2d(sys, { nm: o.nm, n: o.n, field: o.field, zEnd: o.zEnd });
    const t = Math.tan(o.field || 0);
    for (const r of fan) { const p0 = r.pts[0], z = Math.min(o.zStart, p0[0] - 0.01); r.pts.unshift([z, p0[1] - (p0[0] - z) * t]); }
    return fan;
  }
  /* an aperture stop that sits in air (S.system draws it itself) rather than on the face of a lens */
  function isBareStop(sys) {
    const Sf = sys.surfaces, si = Sy.stopIndex(sys), s = Sf[si];
    return !!s && !s.mirror && (s.n == null || O.index(s.n, ND) < 1.01) && (si === 0 || Sf[si - 1].n == null || O.index(Sf[si - 1].n, ND) < 1.01);
  }
  /* three fans in F, d and C light for the doublet and singlet pictures: the incoming light is drawn once in grey, then each colour
     continues from the last surface, the widest line underneath so that rays that coincide show as a coloured core in a halo */
  function colourFans(c, m, wk, o, C) {
    const nS = wk.surfaces.length;
    TRI.forEach((nm, i) => {
      for (const r of fanOf(wk, { nm, n: o.n, field: 0, zStart: o.zStart, zEnd: o.zEnd })) {
        const pts = r.pts.map(p => [m.X(p[0]), m.Y(p[1])]);
        if (!r.ok) { if (i === 1) S.ray(c, pts, { color: C.faint, alpha: 0.6, width: 1, arrows: false }); continue; }
        const k = Math.min(pts.length - 1, nS + 1);                     // pts[nS + 1] is where the ray meets the last surface
        if (i === 1) S.ray(c, pts.slice(0, k + 1), { color: C.muted, width: 1.1, arrows: false });
        S.ray(c, pts.slice(k), { nm, width: [3.2, 1.9, 0.9][i], arrows: false });
      }
    });
  }
  /* the system as S.system can draw it: when the last medium is not air (the eye's vitreous humour) a flat air surface is
     added at the image plane, so that the last medium is drawn too */
  function drawable(sys, zImage) {
    const Sf = sys.surfaces, last = Sf[Sf.length - 1];
    if (last.mirror || !(O.index(last.n == null ? 1 : last.n, ND) > 1.01) || !Number.isFinite(zImage)) return sys;
    const out = Object.assign({}, sys, { surfaces: Sf.map(s => Object.assign({}, s)) });
    out.surfaces[Sf.length - 1].t = zImage - Sy.vertices(sys)[Sf.length - 1];
    out.surfaces.push({ R: 0, n: 1, sd: last.sd });
    return out;
  }
  /* a spot diagram box: the points of several S.spot results on one scale, with the Airy disc as a dashed circle */
  function spotBox(c, spots, cx, cy, half, scale, airy) {
    spots.forEach((s, i) => S.spot(c, s.spot, cx, cy, half, scale, { nm: s.nm, color: s.color, airy: i === 0 ? airy : 0 }));
  }

  /* ---------------------------------------------------------------- glass and the prescription table */
  const GLASSES = Object.keys(O.MATERIALS).filter(id => O.MATERIALS[id].kind === 'glass');
  const glassShort = id => (O.MATERIALS[id] ? O.MATERIALS[id].name : id).replace(/ \(.*\)/, '');
  const GLASS_OPTS = GLASSES.map(id => { const a = O.abbe(id); return [glassShort(id) + ' — nd ' + a.nd.toFixed(4) + ', Vd ' + a.vd.toFixed(1), id]; });
  function matCells(s) {
    if (s.mirror) return ['mirror (reflects)', '—', '—'];
    const n = s.n == null ? 1 : s.n;
    if (n === 1 || n === 'air' || n === 'vacuum') return ['air', '1', '—'];
    if (typeof n === 'number') return ['n = ' + n, n.toFixed(4), '—'];
    if (typeof n === 'string') { const a = O.abbe(n), m = O.MATERIALS[n]; return [m ? m.name : n, fx(a.nd, 4), a.vd == null ? '—' : fx(a.vd, 1)]; }
    return ['custom material', n.nd ? fx(n.nd, 4) : '—', n.vd ? fx(n.vd, 1) : '—'];
  }
  function prescription(sys, par) {
    const n = sys.surfaces.length;
    const rows = sys.surfaces.map((s, i) => {
      const t = i === n - 1 ? par.zImage - par.zs[i] : s.t;
      const notes = [s.stop ? '<b>aperture stop</b>' : '', s.mirror ? 'mirror' : '', s.k ? 'conic constant ' + U.fmt(s.k, 3) : '', s.A ? 'aspheric' : '', i === n - 1 ? 'the thickness runs on to the image' : ''].filter(Boolean).join('; ');
      const row = [i + 1, isFlat(s.R) ? 'flat' : s.R, Number.isFinite(t) ? t : '—'].concat(matCells(s), [s.sd == null ? '—' : s.sd, notes]);
      if (s.stop) row.hl = true;
      return row;
    });
    return T.util.table(['Surface', 'Radius R (mm)', 'Thickness to next (mm)', 'Material after it', 'n<sub>d</sub>', 'V<sub>d</sub>', 'Semi-diameter (mm)', 'Notes'], rows);
  }
  const PRESCRIPTION_NOTE = '<p class="small muted mt">Light travels from left to right. A radius is positive when its centre of curvature lies to the right of the surface, so a biconvex lens is +R then −R. A mirror folds the light back, so the thicknesses after it are negative. n<sub>d</sub> is the refractive index at the helium d line (587.6 nm) and V<sub>d</sub> the Abbe number, the glass\'s measure of how little it spreads colours (larger is better).</p>';

  /* ================================================================ layout and rays */
  function layout(el) {
    const L = T.util.lab(el, 'Choose a lens and see it drawn to scale with real rays traced through it. Tilt the incoming light with the field angle, show the three colours F, d and C together to see colour error, or scale the design to the focal length you want.', 0.6);
    const ctl = K.controls(L.side, [
      { id: 'lens', type: 'select', label: 'Lens', options: LENS_OPTS, value: 'achromat' },
      { id: 'mode', type: 'select', label: 'Show', options: [['One colour', 'one'], ['F, d and C light together', 'fdc'], ['Three field angles', 'fields']], value: 'one' },
      { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: 550, unit: 'nm' },
      { id: 'field', label: 'Field angle (share of the full field)', min: 0, max: 100, step: 1, value: 0, unit: '%' },
      { id: 'rays', label: 'Rays in a fan', min: 3, max: 21, step: 2, value: 7 },
      { id: 'stop', label: 'Stop size (share of the design)', min: 30, max: 130, step: 1, value: 100, unit: '%' },
      { id: 'scale', type: 'check', label: 'Scale the design to a focal length', value: false },
      { id: 'f', label: 'Focal length', min: 5, max: 2000, step: 1, value: 100, unit: 'mm', log: true, sig: 3 },
      { type: 'html', html: 'Drag up or down on the picture to tilt the incoming light.' }
    ], () => { rows(); draw(); });
    const V = ctl.values;
    const ro = K.readout(L.side, [['efl', 'Focal length (EFL)'], ['bfd', 'Back focal distance (BFD)'], ['fno', 'f-number'], ['epd', 'Entrance pupil diameter'], ['len', 'Length, first to last surface'], ['na', 'Image-space NA'], ['fld', 'Field angle shown'], ['cut', 'Rays cut off by a rim']]);
    function rows() { ctl.show('nm', V.mode !== 'fdc'); ctl.show('field', V.mode !== 'fields'); ctl.show('f', !!V.scale); }
    let tkey = '';
    function draw() {
      const c = L.st.begin(), C = K.colors(), W = L.st.W, Hh = L.st.H;
      const sys = build(V.lens, V.scale ? V.f : 0, V.stop / 100), wk = work(sys), full = fullField(V.lens, sys);
      const nmRef = V.mode === 'fdc' ? ND : V.nm;
      const par = Sy.paraxial(sys, nmRef), parD = Sy.paraxial(sys, ND);
      const zs = par.zs, zLast = zs[zs.length - 1], dir = mirrors(sys) % 2 ? -1 : 1;
      const real = Number.isFinite(par.zImage) && (par.zImage - zLast) * dir >= 0;       // false: a virtual image (a diverging lens) or no focus at all
      const epd = Number.isFinite(par.epd) && par.epd > 0 ? par.epd : 10;
      const zImg = Number.isFinite(par.zImage) ? par.zImage : zLast;
      const zFirst = Math.min.apply(null, zs), zTop = Math.max.apply(null, zs);
      let zLo = Math.min(zFirst, zImg), zHi = Math.max(zTop, zImg);
      if (!real) zHi = zTop + 0.6 * Math.max(zTop - zLo, epd);
      if (zHi - zLo < epd) zHi = zLo + epd;
      const span = zHi - zLo, zStart = zLo - Math.max(0.14 * span, 0.7 * epd);
      const zEnd = real ? (V.mode === 'fdc' ? parD.zImage : par.zImage) : zHi;
      const sdMax = Math.max.apply(null, [1, epd / 2].concat(sys.surfaces.map(s => s.sd || 0)));
      // the picture is sized by the rays at full field too, so that it does not jump when the field changes
      let yExt = sdMax;
      for (const fr of [0, 1]) for (const r of fanOf(wk, { nm: nmRef, n: 5, field: fr * full, zStart, zEnd })) if (r.ok) for (const p of r.pts) if (Number.isFinite(p[1])) yExt = Math.max(yExt, Math.abs(p[1]));
      yExt = Math.min(yExt, 2.2 * sdMax);
      const m = S.map(L.st, zStart, zHi, yExt * 1.1, { left: 14, right: 16, top: 66, bottom: 84 });
      const inView = x => Number.isFinite(x) && x > 4 && x < W - 4;

      S.axis(c, m.X(zStart), m.y0, m.X(zHi));
      S.system(c, drawable(sys, par.zImage), m);
      // a stop on the face of a lens is only drawn once it is closed down below the rim
      if (!isBareStop(sys)) {
        const si = Sy.stopIndex(sys), st = sys.surfaces[si];
        const rim = Math.max.apply(null, sys.surfaces.slice(Math.max(0, si - 1), si + 2).map(s => s.sd || 0));
        if (st && st.stop && !st.mirror && st.sd != null && st.sd < rim * 0.98) S.stop(c, m.X(zs[si]), m.y0, m.s * rim * 1.08, m.s * st.sd);
      }

      // the ray fans
      const sets = [];
      if (V.mode === 'fdc') TRI.forEach((nm, i) => sets.push({ nm, field: V.field / 100 * full, w: [3.2, 1.9, 0.9][i] }));      // the widest line underneath, so that rays that coincide show as a coloured core in a halo
      else if (V.mode === 'fields') [0, 0.7, 1].forEach((fr, i) => sets.push({ nm: V.nm, field: fr * full, color: C.series[i] }));
      else sets.push({ nm: V.nm, field: V.field / 100 * full });
      let cut = 0, total = 0, hImg = 0.05 * yExt;
      for (const s of sets) {
        const fan = fanOf(wk, { nm: s.nm, n: V.rays, field: s.field, zStart, zEnd });
        S.rays(c, fan, m, s.color ? { color: s.color, width: 1.3 } : { nm: s.nm, width: s.w || 1.4 });
        for (const r of fan) {
          total++;
          if (!r.ok) { cut++; continue; }
          const p = r.pts[r.pts.length - 1];
          if (real) hImg = Math.max(hImg, Math.abs(p[1]) * 1.3);
          else { const e = Sy.at(r.tr, zImg); if (Number.isFinite(e[1]) && Number.isFinite(e[2])) S.virtual(c, m.X(p[0]), m.Y(p[1]), m.X(e[2]), m.Y(e[1])); }     // a diverging beam: dashed back to where it seems to come from
        }
      }
      if (real) {
        const hs = Math.min(hImg, yExt * 1.05) * m.s;
        S.screen(c, m.X(zEnd) - 2, m.y0, hs, {});
        K.label(c, 'image plane', m.X(zEnd) + 2, m.y0 + hs + 12, { align: 'right', size: 11.5, color: C.muted });
      }

      // focal point, principal planes and pupils, with their labels staggered so that close ones do not collide
      const mk = [];
      const add = (z, label, color, pupil) => { if (Number.isFinite(z) && inView(m.X(z))) mk.push({ x: m.X(z), label, color, pupil }); };
      add(par.Hfront, 'H', C.accent); add(par.Hrear, 'H′', C.accent); add(par.zImage, 'F′', C.warn); add(par.zEP, 'EP', C.ok, par.epd / 2); add(par.zXP, 'XP', C.ok, par.xpd / 2);
      mk.sort((a, b) => a.x - b.x);
      const lastX = [-99, -99, -99, -99];
      for (const k of mk) {
        let row = lastX.findIndex(x => k.x - x > 30); if (row < 0) row = 3; lastX[row] = k.x;
        const ly = 11 + row * 13;
        c.save(); c.strokeStyle = k.color; c.globalAlpha = 0.45; c.lineWidth = 1; c.setLineDash([3, 3]);
        c.beginPath(); c.moveTo(k.x, ly + 7); c.lineTo(k.x, Hh - 84); c.stroke(); c.restore();
        if (Number.isFinite(k.pupil) && k.pupil > 0) { c.save(); c.strokeStyle = k.color; c.lineWidth = 2.5; c.beginPath(); for (const sg of [-1, 1]) { const yy = m.Y(sg * k.pupil); c.moveTo(k.x - 6, yy); c.lineTo(k.x + 6, yy); } c.stroke(); c.restore(); }
        if (k.label === 'F′') K.dot(c, k.x, m.y0, 3.5, k.color);
        K.label(c, k.label, k.x, ly, { align: 'center', color: k.color, size: 12, weight: 650 });
      }

      // dimension lines: focal length (principal plane to focus) and back focal distance (last surface to focus)
      if (Number.isFinite(par.Hrear) && Number.isFinite(par.zImage) && inView(m.X(par.Hrear)) && inView(m.X(par.zImage)) && Math.abs(m.X(par.zImage) - m.X(par.Hrear)) > 44)
        S.dim(c, m.X(par.Hrear), Hh - 56, m.X(par.zImage), Hh - 56, 'EFL ' + fx(Math.abs(par.efl), 1) + ' mm', { off: -9 });
      if (Number.isFinite(par.zImage) && inView(m.X(zLast)) && inView(m.X(par.zImage)) && Math.abs(m.X(par.zImage) - m.X(zLast)) > 44)
        S.dim(c, m.X(zLast), Hh - 30, m.X(par.zImage), Hh - 30, 'BFD ' + fx(Math.abs(par.bfd), 1) + ' mm', { off: -9 });

      // colour key
      const lg = [];
      if (V.mode === 'fdc') TRI.forEach((nm, i) => lg.push([S.nm(nm), TRI_NAMES[i]]));
      else if (V.mode === 'fields') [0, 0.7, 1].forEach((fr, i) => lg.push([C.series[i], fr === 0 ? 'on axis' : fx(fr * full * R2D, 1) + '° (' + (fr === 1 ? 'full' : '70 %') + ' field)']));
      else lg.push([S.nm(V.nm), fx(V.nm, 0) + ' nm, field ' + fx(V.field / 100 * full * R2D, 1) + '°']);
      let lx = 16;
      for (const [col, txt] of lg) { K.dot(c, lx, Hh - 9, 4, col); K.label(c, txt, lx + 9, Hh - 9, { size: 12, color: C.muted }); lx += 26 + txt.length * 6.4; }
      if (!real) K.label(c, Number.isFinite(par.zImage) ? 'virtual focus (dashed): the light spreads out' : 'afocal: no focus', W - 14, Hh - 9, { align: 'right', size: 12, color: C.warn });

      // read-outs
      const mir = mirrors(sys) % 2 === 1;
      ro.set('efl', par.afocal ? 'infinite (afocal)' : fx(par.efl, 1) + ' mm');
      ro.set('bfd', !Number.isFinite(par.bfd) ? 'infinite (afocal)' : mir ? fx(Math.abs(par.bfd), 1) + ' mm in front of the mirror' : par.bfd < 0 ? fx(par.bfd, 1) + ' mm (a virtual focus)' : fx(par.bfd, 1) + ' mm');
      ro.set('fno', Number.isFinite(par.fno) ? 'f/' + fx(par.fno, 2) : '—');
      ro.set('epd', fx(par.epd, 1) + ' mm');
      ro.set('len', Math.abs(par.length) < 1e-9 ? 'a single surface' : fx(Math.abs(par.length), 1) + ' mm');
      ro.set('na', fx(par.na, 3));
      ro.set('fld', V.mode === 'fields' ? '0°, ' + fx(0.7 * full * R2D, 1) + '°, ' + fx(full * R2D, 1) + '°' : fx(V.field / 100 * full * R2D, 1) + '°  (full field ' + fx(full * R2D, 1) + '°)');
      ro.set('cut', cut ? cut + ' of ' + total + '  (drawn faint)' : 'none');

      // the prescription, rebuilt only when the lens itself changes
      const key = V.lens + '|' + (V.scale ? V.f : 0) + '|' + V.stop;
      if (key !== tkey) {
        tkey = key;
        L.under.innerHTML = '<p class="muted" style="margin:10px 0 0">' + esc(LENS_NOTE[V.lens] || '') + '</p>' +
          '<p class="small muted" style="margin:6px 0 0">On the picture: H and H′ are the principal planes, F′ the rear focal point, EP and XP the entrance and exit pupils (the stop as seen from the front and from behind). Rays that the rim of a lens cuts off are drawn faint. The read-outs are for the wavelength shown (the d line, 587.6 nm, when all three colours are drawn).</p>' +
          T.util.box('Prescription', prescription(sys, par) + PRESCRIPTION_NOTE) +
          T.util.more(['cardinal-points', 'entrance-and-exit-pupils', 'the-f-number', 'vignetting', 'cooke-triplet', 'double-gauss', 'achromatic-doublet', 'parabolic-and-elliptical-mirrors', 'reading-a-prescription']);
      }
    }
    K.drag(L.st, {
      hit: p => ({ y: p.y, f: V.field }),
      move: (s, p) => { const nf = clamp(Math.round(s.f + (s.y - p.y) / L.st.H * 160), 0, 100); if (nf !== V.field) { ctl.set('field', nf); draw(); } },
      hover: true
    });
    L.st.onResize(draw); T.util.onTheme(draw); rows(); draw();
  }

  /* ================================================================ aberrations */
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  /* the five Seidel sums and the two colour sums: symbol, short name, name in a sentence, what it does */
  const SEIDEL = [
    ['S1', 'spherical', 'spherical aberration', 'rays through the rim of the lens focus at a different distance from rays near the centre'],
    ['S2', 'coma', 'coma', 'off-axis points are smeared into comet shapes'],
    ['S3', 'astigmatism', 'astigmatism', 'off-axis points focus as short lines, first one way and then across'],
    ['S4', 'curvature', 'field curvature', 'the sharpest image lies on a curved surface rather than on a flat plane'],
    ['S5', 'distortion', 'distortion', 'straight lines bend, although every point stays sharp'],
    ['C1', 'axial colour', 'axial colour', 'each colour comes to a focus at a different distance'],
    ['C2', 'lateral colour', 'lateral colour', 'each colour is magnified a little differently, so edges show coloured fringes']];
  /* S1…S5, C1, C2 of the system at a field, each expressed as the blur it is worth at the image, S/(2 n'u') in µm,
     so that the bars can be compared with one another and with a spot diagram */
  function seidelBars(sys, nm, field) {
    const sd = Sy.seidel(sys, { nm, field }), Lm = sd.marginal[sd.marginal.length - 1], nu = Lm.n * Lm.u;
    const k = Math.abs(nu) > 1e-12 ? 1000 / (2 * nu) : 1000;
    return SEIDEL.map(e => { const v = sd[e[0]] * k; return Number.isFinite(v) ? v : 0; });
  }
  /* the plane that gives the smallest average RMS spot over the axis, 70 % field and full field (golden-section search) */
  function bestMean(wk, nm, full, rings, par) {
    const sp = Math.max(1e-6, 0.06 * Math.abs(par.efl)), g = (Math.sqrt(5) - 1) / 2;
    const f = z => [0, 0.7, 1].reduce((a, fr) => a + Sy.spot(wk, { nm, field: fr * full, rings, z, par }).rms, 0) / 3;
    let a = par.zImage - sp, b = par.zImage + sp, x1 = b - g * (b - a), x2 = a + g * (b - a), f1 = f(x1), f2 = f(x2);
    for (let i = 0; i < 26; i++) { if (f1 < f2) { b = x2; x2 = x1; f2 = f1; x1 = b - g * (b - a); f1 = f(x1); } else { a = x1; x1 = x2; f1 = f2; x2 = a + g * (b - a); f2 = f(x2); } }
    return (a + b) / 2 - par.zImage;
  }
  const plotCell = (title, cls, caption) => '<div><div class="small" style="margin:0 0 4px"><b>' + title + '</b><span class="muted"> ' + caption + '</span></div><div class="' + cls + '"></div></div>';

  function aberrations(el) {
    const L = T.util.lab(el, 'Pick a lens and see what is wrong with its image, three ways: where the rays really land (the spot diagrams, against the Airy disc that diffraction alone would give a perfect lens), how each ray misses (the ray fans and focus curves under the picture), and which classical aberration is to blame (the Seidel bars). Slide the focus to hunt for the sharpest image.', 1.05, { minH: 640, maxH: 820 });
    const spanOf = id => 0.08 * Math.abs(Sy.paraxial(O.lens(id)).efl);
    let span = spanOf('cooke-triplet'), cache = null, boxes = [];
    const shiftMm = v => span * Math.sign(v) * Math.pow(Math.abs(v) / 100, 3);       // a cubic slider: fine near zero, wide at the ends
    const ctl = K.controls(L.side, [
      { id: 'lens', type: 'select', label: 'Lens', options: LENS_OPTS, value: 'cooke-triplet' },
      { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: 550, unit: 'nm' },
      { id: 'field', label: 'Field for the ray fans and bars (share of full field)', min: 0, max: 100, step: 1, value: 100, unit: '%' },
      { id: 'stop', label: 'Stop size (share of the design)', min: 30, max: 130, step: 1, value: 100, unit: '%' },
      { id: 'rings', label: 'Rays in the spot diagrams', min: 3, max: 10, step: 1, value: 6, fmt: v => (1 + 3 * Math.round(v) * (Math.round(v) + 1)) + ' rays' },
      { id: 'shift', label: 'Focus shift (+ is further along the light)', min: -100, max: 100, step: 0.5, value: 0, fmt: v => { const s = shiftMm(v); return (s < 0 ? '−' : '+') + Math.abs(s).toFixed(Math.abs(s) < 1 ? 3 : 2) + ' mm'; } },
      { type: 'buttons', items: [{ id: 'best', label: 'Best focus on axis', primary: true }, { id: 'bestall', label: 'Best focus, all fields' }, { id: 'reset', label: 'Paraxial focus' }] },
      { type: 'html', html: 'Click a spot diagram to use its field for the fans and bars.' }
    ], id => {
      if (id === 'lens') { span = spanOf(V.lens); ctl.set('shift', 0); }
      else if (id === 'best' || id === 'bestall') {
        const k = cur(), sh = id === 'best' ? Sy.bestFocus(k.wk, { nm: V.nm, field: 0, rings: 4 }).shift : bestMean(k.wk, V.nm, k.full, 4, k.par);
        const light = k.dir * sh;
        ctl.set('shift', Number.isFinite(light) ? clamp(Math.sign(light) * 100 * Math.cbrt(Math.min(1, Math.abs(light) / span)), -100, 100) : 0);
      } else if (id === 'reset') ctl.set('shift', 0);
      draw();
    });
    const V = ctl.values;
    function cur() {
      const key = V.lens + '|' + V.stop + '|' + V.nm;
      if (cache && cache.key === key) return cache;
      const sys = build(V.lens, 0, V.stop / 100), wk = work(sys);
      cache = { key, sys, wk, par: Sy.paraxial(wk, V.nm), parD: Sy.paraxial(wk, ND), full: fullField(V.lens, sys), dir: mirrors(sys) % 2 ? -1 : 1 };
      return cache;
    }
    const ro = K.readout(L.side, [['fno', 'f-number'], ['plane', 'Image plane'], ['rms', 'RMS spot, axis · 70 % · full'], ['airy', 'Airy disc diameter'], ['lim', 'Limited by']]);
    L.under.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:14px;margin-top:12px">' +
      plotCell('Ray fans', 'lp1', 'how far each ray lands from the chief ray, in µm') +
      plotCell('Where the rays cross the axis', 'lp2', 'mm from the d-light paraxial focus') +
      plotCell('Focus against colour', 'lp3', 'mm from the d-light focus') + '</div>' +
      '<p class="small muted" style="margin:10px 0 0">Reading the ray fans: the horizontal axis is where the ray crossed the pupil, from the bottom edge (−1) to the top edge (+1); the vertical axis is how far above or below the chief ray it lands in the image plane. A perfect lens gives flat lines on zero. A straight tilted line is defocus (move the focus slider and watch it tilt); an S shape is spherical aberration; a bowl is coma or field curvature; curves of different colours set apart show lateral colour. The dashed lines mark the radius of the Airy disc.</p>' +
      '<p class="small muted" style="margin:6px 0 0">The Seidel bars are a third-order theory: they explain the aberrations but ignore the higher orders, so for a fast or wide lens trust the traced spots and use the bars for the diagnosis. A mirror has no colour error because no light passes through glass. The sign of a bar is the direction of the error at the image for a ray from the top of the pupil, as in the ray fans (below or above the axis); the size is what matters.</p>' +
      T.util.more(['what-aberrations-are', 'spherical-aberration', 'coma', 'astigmatism-of-lenses', 'field-flatteners-and-petzval-sum', 'distortion', 'axial-chromatic-aberration', 'lateral-chromatic-aberration', 'the-seidel-sums', 'spot-diagrams-and-ray-fans', 'the-airy-disk']);
    const P1 = K.plot(ui.$('.lp1', L.under), { x: { label: 'pupil height', min: -1, max: 1 }, y: { label: 'µm' }, series: [] }, 230);
    const P2 = K.plot(ui.$('.lp2', L.under), { x: { label: 'mm' }, y: { label: 'pupil zone', min: 0, max: 1 }, series: [] }, 230);
    const P3 = K.plot(ui.$('.lp3', L.under), { x: { label: 'nm', min: 420, max: 700 }, y: { label: 'mm' }, series: [] }, 230);
    const WL = []; for (let w = 420; w <= 700; w += 20) WL.push(w);

    function draw() {
      const c = L.st.begin(), C = K.colors(), W = L.st.W, Hh = L.st.H, k = cur();
      const wk = k.wk, par = k.par, dir = k.dir, nm = V.nm, full = k.full;
      const zPlane = par.zImage + dir * shiftMm(V.shift), fieldF = V.field / 100 * full;
      const airy = Number.isFinite(par.fno) ? O.diff.airyRadius(nm, par.fno) * 1e3 : NaN;        // the Airy radius in mm
      // 1. spot diagrams at three field points, on one scale
      const FR = [0, 0.7, 1], NAMES = ['on axis', '70 % of the field', 'full field'];
      const spots = FR.map(fr => Sy.spot(wk, { nm, field: fr * full, rings: Math.round(V.rings), z: zPlane, par }));
      const gap = 12, bs = clamp((W - 32 - 2 * gap) / 3, 90, 210), bx0 = (W - (3 * bs + 2 * gap)) / 2;
      let need = Number.isFinite(airy) ? 1.7 * airy : 0.001;
      for (const s of spots) need = Math.max(need, 1.15 * s.geo);
      const halfMm = nice(need), scale = (bs / 2) / halfMm;
      let y = para(c, 'Spot diagrams: where the rays land on the image plane', 16, 16, W - 12, { weight: 650, size: 13, color: C.text });
      y = para(c, 'Boxes ±' + num(halfMm * 1000) + ' µm; dashed circle: the Airy disc. Click a box to pick its field.', 16, y, W - 12, { size: 11.5, color: C.muted });
      const top = y + 18;
      boxes = [];
      spots.forEach((s, i) => {
        const cx = bx0 + bs / 2 + i * (bs + gap), cy = top + 12 + bs / 2;
        boxes.push({ cx, cy, half: bs / 2, field: Math.round(FR[i] * 100) });
        spotBox(c, [{ spot: s, nm }], cx, cy, bs / 2, scale, airy);
        if (Math.abs(V.field - FR[i] * 100) < 0.5) { c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.5; c.strokeRect(cx - bs / 2 - 2, cy - bs / 2 - 2, bs + 4, bs + 4); c.restore(); }
        K.label(c, NAMES[i] + (i ? ', ' + fx(FR[i] * full * R2D, 1) + '°' : ''), cx, top - 2, { align: 'center', size: 12, weight: 600, color: C.text });
        K.label(c, 'RMS spot ' + fx(2 * s.rms * 1000, 1) + ' µm', cx, cy + bs / 2 + 15, { align: 'center', size: 12, color: C.text });
        K.label(c, Number.isFinite(airy) ? 'Airy disc ' + fx(2 * airy * 1000, 1) + ' µm' + (s.n && s.geo <= airy ? ', all inside' : '') : '', cx, cy + bs / 2 + 30, { align: 'center', size: 11.5, color: C.muted });
        if (s.lost) K.label(c, s.lost + ' of ' + (s.n + s.lost) + ' rays cut off', cx, cy + bs / 2 + 44, { align: 'center', size: 11, color: C.warn });
      });
      // 2. the Seidel bars at the chosen field
      const bars = seidelBars(wk, nm, fieldF), tot = bars.reduce((a, v) => a + Math.abs(v), 0);
      const order = bars.map((v, i) => [Math.abs(v), i]).sort((a, b) => b[0] - a[0]);
      let y3 = para(c, 'Seidel sums ' + (fieldF > 0 ? 'at ' + fx(fieldF * R2D, 1) + '° from the axis' : 'on the axis') + ', as the blur each is worth at the image (µm)', 16, top + 12 + bs + 74, W - 12, { weight: 650, size: 13, color: C.text });
      let verdict, why = '';
      if (tot < 0.5) verdict = 'Every sum is below half a micrometre: at this field the third-order aberrations are negligible.';
      else { const [v1, i1] = order[0], [v2, i2] = order[1]; verdict = 'Mostly ' + SEIDEL[i1][2] + ' (' + Math.round(100 * v1 / tot) + ' % of the total)' + (v2 > 0.2 * v1 ? ', then ' + SEIDEL[i2][2] : '') + '.'; why = cap(SEIDEL[i1][3]) + '.'; }
      y3 = para(c, verdict, 16, y3 + 3, W - 12, { size: 13, color: C.accent, weight: 650 });
      if (why) y3 = para(c, why, 16, y3 + 1, W - 12, { size: 11.5, color: C.muted });
      const ax0 = 28, ax1 = W - 16, yTop = y3 + 22, yBot = Math.max(yTop + 90, Hh - 50);
      const lo = Math.min(0, Math.min.apply(null, bars)), hi = Math.max(0, Math.max.apply(null, bars)), rng = (hi - lo) || 1, sc = (yBot - yTop - 32) / rng, yZero = yTop + 16 + hi * sc;
      const bw = (ax1 - ax0) / bars.length;
      bars.forEach((v, i) => {
        const x = ax0 + i * bw + bw * 0.2, w = bw * 0.6, y2 = yZero - v * sc, big = tot >= 0.5 && order[0][1] === i;
        c.fillStyle = i < 5 ? C.accent : C.warn; c.globalAlpha = big ? 1 : 0.62;
        c.fillRect(x, Math.min(yZero, y2), w, Math.max(1, Math.abs(y2 - yZero)));
        c.globalAlpha = 1;
        K.label(c, Math.abs(v) < 0.05 ? '0' : num(v), x + w / 2, v >= 0 ? y2 - 9 : y2 + 9, { align: 'center', size: 11.5, color: C.text });
        K.label(c, SEIDEL[i][0], x + w / 2, yBot + 15, { align: 'center', size: 12, weight: 650, color: big ? C.accent : C.text });
        if (bw >= 62) K.label(c, SEIDEL[i][1], x + w / 2, yBot + 30, { align: 'center', size: 11, color: C.muted });
      });
      c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(ax0, yZero); c.lineTo(ax1, yZero); c.stroke(); c.restore();

      // 3. the plots under the picture
      const A = Number.isFinite(airy) ? airy * 1000 : NaN;
      const fan = TRI.map((w, i) => ({ pts: clean(Sy.rayFan(wk, { nm: w, refNm: nm, field: fieldF, z: zPlane, n: 41 }).map(p => [p[0], p[1] * 1000])), label: TRI_NAMES[i].replace(/ +/, ' '), color: S.nm(w) }));
      P1.set({ x: { label: 'pupil height', min: -1, max: 1 }, y: { label: 'µm' }, series: fan, hlines: Number.isFinite(A) ? [{ y: A, label: 'Airy radius' }, { y: -A }] : [] });
      const lsa = TRI.map((w, i) => { const off = dir * (Sy.paraxial(wk, w).zImage - k.parD.zImage); return { pts: clean([[off, 0]].concat(Sy.lsa(wk, w, 20).map(p => [off + dir * p[1], p[0]]))), label: TRI_NAMES[i].replace(/ +/, ' '), color: S.nm(w) }; });
      P2.set({ x: { label: 'mm' }, y: { label: 'pupil zone', min: 0, max: 1 }, series: lsa });
      P3.set({ x: { label: 'nm', min: 420, max: 700 }, y: { label: 'mm' }, series: [{ pts: clean(Sy.chromaticShift(wk, WL, ND).map(p => [p[0], dir * p[1]])), color: C.accent }], vlines: [{ x: LN.F, label: 'F' }, { x: LN.d, label: 'd' }, { x: LN.C, label: 'C' }] });

      // read-outs
      ro.set('fno', Number.isFinite(par.fno) ? 'f/' + fx(par.fno, 2) : '—');
      ro.set('plane', V.shift === 0 ? 'paraxial focus' : (shiftMm(V.shift) < 0 ? '−' : '+') + fx(Math.abs(shiftMm(V.shift)), 3) + ' mm');
      ro.set('rms', spots.map(s => fx(2 * s.rms * 1000, 1)).join(' · ') + ' µm');
      ro.set('airy', Number.isFinite(airy) ? fx(2 * airy * 1000, 1) + ' µm' : '—');
      const worst = Math.max.apply(null, spots.map(s => s.geo));
      ro.set('lim', !Number.isFinite(airy) ? '—' : worst <= airy ? 'diffraction (all rays inside the Airy disc)' : spots[0].geo <= airy ? 'aberrations off the axis' : 'the lens aberrations');
    }
    K.click(L.st, p => {
      const b = boxes.find(q => Math.abs(p.x - q.cx) <= q.half && Math.abs(p.y - q.cy) <= q.half);
      if (b) { ctl.set('field', b.field); draw(); }
    }, p => boxes.some(q => Math.abs(p.x - q.cx) <= q.half && Math.abs(p.y - q.cy) <= q.half));
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }

  /* ================================================================ bending a singlet */
  const F0 = 100;                                                  // every singlet here has a focal length of 100 mm
  /* a singlet of shape factor q (0 equi-convex, +1 plano-convex with the curved face first, −1 flat face first), diameter D:
     made thick enough for a rim of 0.8 mm, and narrowed if a surface is too small to reach the rim -> { sys, D, t, limited } */
  function singlet(q, D, glass, f) {
    f = f || F0;
    q = Math.abs(q - 1) < 1e-6 ? 1 : Math.abs(q + 1) < 1e-6 ? -1 : q;
    let d = D, t = Math.max(0.02 * f, 0.12 * d), sys = null;
    for (let it = 0; it < 40; it++) {
      sys = Dz.singlet({ f, glass, q, D: d, t });
      const s0 = sys.surfaces[0], s1 = sys.surfaces[1], r = d / 2;
      if ([s0.R, s1.R].some(R => R && Math.abs(R) < 1.05 * r)) { d *= 0.93; t = Math.max(0.02 * f, 0.12 * d); continue; }
      const edge = t + Sy.sag(s1, r) - Sy.sag(s0, r);
      if (!(edge >= 0.8)) { t += 0.85 - (Number.isFinite(edge) ? edge : 0); continue; }
      break;
    }
    return { sys, D: d, t, limited: d < D - 1e-9 };
  }
  function shapeName(q, qBest) {
    if (Math.abs(q - qBest) < 0.04) return 'best form';
    if (Math.abs(q - 1) < 0.02) return 'plano-convex, curved face to the light';
    if (Math.abs(q + 1) < 0.02) return 'plano-convex, flat face to the light';
    if (Math.abs(q) < 0.02) return 'equi-convex';
    return q > 1 ? 'meniscus, convex towards the light' : q < -1 ? 'meniscus, concave towards the light' : q > 0 ? 'biconvex, front face more curved' : 'biconvex, back face more curved';
  }
  const QS = []; for (let i = -30; i <= 30; i++) QS.push(i / 10);
  const fq = q => (q < 0 ? '−' : '+') + Math.abs(q).toFixed(2);
  /* the longitudinal spherical aberration of the marginal ray (traced) and the Seidel estimate of it, and the coma sum at 2° */
  function aberrOf(sys) {
    const wk = work(sys), L = Sy.lsa(wk, ND, 10), s0 = Sy.seidel(wk, { nm: ND }), s2 = Sy.seidel(wk, { nm: ND, field: 2 * D2R });
    const Lm = s2.marginal[s2.marginal.length - 1], nu = Lm.n * Lm.u;
    return { traced: L.length === 10 ? L[9][1] : NaN, third: s0.lsa, coma: Math.abs(nu) > 1e-12 ? 1000 * s2.S2 / (2 * nu) : NaN };
  }

  function bending(el) {
    const L = T.util.lab(el, 'A lens of a given focal length can take many shapes. Bend this one, always keeping the focal length at 100 mm, from a meniscus through the biconvex and plano-convex forms to the meniscus the other way round, and watch what happens to the rays and to the aberrations. The light comes from a distant point on the axis and the stop is at the front face.', 0.5);
    const ctl = K.controls(L.side, [
      { id: 'q', label: 'Shape factor q', min: -3, max: 3, step: 0.01, value: 0, fmt: fq },
      { id: 'glass', type: 'select', label: 'Glass', options: GLASS_OPTS, value: 'N-BK7' },
      { id: 'D', label: 'Diameter', min: 10, max: 40, step: 1, value: 25, unit: 'mm' },
      { type: 'buttons', items: [{ id: 'best', label: 'Best form', primary: true }, { id: 'bi', label: 'Equi-convex' }, { id: 'pc', label: 'Plano-convex, curved face first' }, { id: 'pr', label: 'Plano-convex, flat face first' }] },
      { type: 'html', html: 'Drag left or right on the picture to bend the lens.' }
    ], id => {
      if (id === 'best') ctl.set('q', Math.round(O.bestFormShape(O.index(V.glass, ND)) * 100) / 100);
      else if (id === 'bi') ctl.set('q', 0);
      else if (id === 'pc') ctl.set('q', 1);
      else if (id === 'pr') ctl.set('q', -1);
      draw();
    });
    const V = ctl.values;
    const ro = K.readout(L.side, [['shape', 'Shape'], ['q', 'Shape factor q'], ['R1', 'Front radius R₁'], ['R2', 'Back radius R₂'], ['t', 'Centre thickness'], ['lsa', 'Edge-ray spherical aberration'], ['rms', 'RMS spot at best focus'], ['airy', 'Airy disc diameter']]);
    L.under.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-top:12px">' +
      plotCell('Spherical aberration against shape', 'lp1', 'longitudinal, in mm (negative: the rim rays focus short)') +
      plotCell('Coma against shape', 'lp2', 'the coma sum at 2° off axis, as µm of blur') + '</div>' +
      '<p class="small muted" style="margin:10px 0 0">The solid line is traced through the real surfaces; the dashed line is the third-order (Seidel) estimate, which agrees for a slow lens and drifts away as the aperture grows. The green line marks the best form for this glass, the grey lines the two plano-convex lenses: curved face to the light (q = +1) and flat face to the light (q = −1). Spherical aberration is least near the best form, which is close to the shape where coma crosses zero as well, and it climbs steeply for a meniscus bent too far. Notice how much worse a plano-convex lens is the wrong way round.</p>' +
      T.util.more(['lens-bending', 'spherical-aberration', 'coma', 'optical-glass', 'the-abbe-number-and-glass-map']);
    const P1 = K.plot(ui.$('.lp1', L.under), { x: { label: 'shape factor q', min: -3, max: 3 }, y: { label: 'mm' }, series: [] }, 240);
    const P2 = K.plot(ui.$('.lp2', L.under), { x: { label: 'shape factor q', min: -3, max: 3 }, y: { label: 'µm' }, series: [] }, 240);
    let ckey = '', cv = null;
    function curves() {
      const key = V.glass + '|' + V.D;
      if (key === ckey) return cv;
      ckey = key; cv = { third: [], traced: [], coma: [] };
      for (const q of QS) { const a = aberrOf(singlet(q, V.D, V.glass).sys); cv.third.push([q, a.third]); cv.traced.push([q, a.traced]); cv.coma.push([q, a.coma]); }
      return cv;
    }
    function draw() {
      const c = L.st.begin(), C = K.colors(), W = L.st.W, Hh = L.st.H;
      const q = V.q, si = singlet(q, V.D, V.glass), sys = si.sys, wk = work(sys), par = Sy.paraxial(wk, ND);
      const n = O.index(V.glass, ND), qBest = O.bestFormShape(n), zI = par.zImage;
      const m = S.map(L.st, -14, 112, 21, { left: 14, right: 156, top: 34, bottom: 46 });
      S.axis(c, m.X(-14), m.y0, m.X(112));
      S.system(c, sys, m);
      S.rays(c, fanOf(wk, { nm: ND, n: 11, field: 0, zStart: -14, zEnd: zI + 7 }), m, { nm: ND, width: 1.3 });
      const bf = Sy.bestFocus(wk, { nm: ND, rings: 4 });
      const vl = (z, color, label, y) => { const x = m.X(z); c.save(); c.strokeStyle = color; c.globalAlpha = 0.8; c.lineWidth = 1.2; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(x, 40); c.lineTo(x, Hh - 46); c.stroke(); c.restore(); K.label(c, label, x, y, { align: 'center', size: 11.5, color }); };
      vl(bf.z, C.ok, 'best focus', 30);
      vl(zI, C.warn, 'paraxial focus', Hh - 30);
      para(c, shapeName(q, qBest) + '   (q = ' + fq(q) + ')', 16, 14, W - 164, { weight: 650, size: 13, color: C.text });
      if (si.limited) K.label(c, 'diameter limited to ' + fx(si.D, 1) + ' mm by the curves', 16, Hh - 12, { size: 11.5, color: C.warn });
      // the focus, magnified: the spot at the paraxial focus and at the best focus, on one scale
      const airy = Number.isFinite(par.fno) ? O.diff.airyRadius(ND, par.fno) * 1e3 : NaN;
      const spA = Sy.spot(wk, { nm: ND, rings: 6, par }), spB = Sy.spot(wk, { nm: ND, rings: 6, z: bf.z, par });
      const half = nice(Math.max(1.15 * spA.geo, 1.15 * spB.geo, Number.isFinite(airy) ? 1.7 * airy : 0)), bh = clamp((Hh - 130) / 4, 30, 52), cx = W - 78, sc = bh / half;
      const cy1 = bh + 24, cy2 = cy1 + 2 * bh + 32;
      [[spA, 'at the paraxial focus', cy1], [spB, 'at the best focus', cy2]].forEach(([sp, t, cy]) => {
        c.fillStyle = C.surface; c.fillRect(cx - bh, cy - bh, 2 * bh, 2 * bh);
        S.spot(c, sp, cx, cy, bh, sc, { nm: ND, airy });
        K.label(c, t, cx, cy - bh - 9, { align: 'center', size: 11.5, color: C.muted });
      });
      K.label(c, 'boxes ±' + num(half * 1000) + ' µm', cx, cy2 + bh + 14, { align: 'center', size: 11, color: C.faint });
      K.label(c, 'dashed circle: Airy disc', cx, cy2 + bh + 28, { align: 'center', size: 11, color: C.faint });

      // the curves against q, with this lens marked
      const cs = curves(), now = aberrOf(sys), fin = v => Number.isFinite(v);
      const vals = clean(cs.third.concat(cs.traced)).map(p => p[1]);
      const ylo = Math.min.apply(null, vals.concat([0])), yhi = Math.max.apply(null, vals.concat([0]));
      const vline = (x, label, color) => ({ pts: [[x, ylo], [x, yhi]], label, color, dash: [5, 4], width: 1.6 });
      const vlines = [vline(qBest, 'best form, q = ' + fq(qBest), C.ok), vline(1, 'plano-convex, q = ±1', C.faint), vline(-1, '', C.faint)];
      P1.set({ x: { label: 'shape factor q', min: -3, max: 3 }, y: { label: 'mm' }, hlines: [],
        series: [{ pts: clean(cs.traced), label: 'traced marginal ray', color: C.accent }, { pts: clean(cs.third), label: 'third-order estimate', color: C.warn, dash: [6, 4], width: 1.6 }].concat(vlines),
        marks: fin(now.traced) ? [{ x: q, y: now.traced, label: 'this lens', color: C.accent }] : [] });
      const cvals = clean(cs.coma).map(p => p[1]), clo = Math.min.apply(null, cvals.concat([0])), chi = Math.max.apply(null, cvals.concat([0]));
      P2.set({ x: { label: 'shape factor q', min: -3, max: 3 }, y: { label: 'µm' },
        series: [{ pts: clean(cs.coma), label: 'coma sum S2 at 2°', color: C.accent }, { pts: [[qBest, clo], [qBest, chi]], label: 'best form', color: C.ok, dash: [5, 4], width: 1.6 }],
        marks: fin(now.coma) ? [{ x: q, y: now.coma, label: 'this lens', color: C.accent }] : [] });

      const s0 = sys.surfaces[0], s1 = sys.surfaces[1];
      ro.set('shape', shapeName(q, qBest));
      ro.set('q', fq(q));
      ro.set('R1', rtxt(s0.R) + (isFlat(s0.R) || Math.abs(s0.R) > 1e6 ? '' : ' mm'));
      ro.set('R2', rtxt(s1.R) + (isFlat(s1.R) || Math.abs(s1.R) > 1e6 ? '' : ' mm'));
      ro.set('t', fx(si.t, 1) + ' mm');
      ro.set('lsa', fin(now.traced) ? fx(now.traced, 2) + ' mm (Seidel ' + fx(now.third, 2) + ')' : '—');
      ro.set('rms', fx(2 * bf.rms * 1000, 1) + ' µm');
      ro.set('airy', Number.isFinite(airy) ? fx(2 * airy * 1000, 1) + ' µm  (f/' + fx(par.fno, 1) + ')' : '—');
    }
    K.drag(L.st, {
      hit: p => ({ x: p.x, q: V.q }),
      move: (s, p) => { const nq = Math.round(clamp(s.q + (p.x - s.x) / L.st.W * 6, -3, 3) * 100) / 100; if (nq !== V.q) { ctl.set('q', nq); draw(); } },
      hover: true
    });
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }
  /* ================================================================ achromat designer */
  /* the rims of a design are sane: every curved surface reaches the rim, and every glass element is thicker than minEdge there */
  function rimsOk(sys, minEdge) {
    const Sf = sys.surfaces;
    for (const s of Sf) if (s.R && (!Number.isFinite(s.R) || Math.abs(s.R) < 1.05 * s.sd)) return false;
    for (let i = 0; i < Sf.length - 1; i++) {
      if (!(O.index(Sf[i].n == null ? 1 : Sf[i].n, ND) > 1.01)) continue;
      const r = Math.min(Sf[i].sd, Sf[i + 1].sd), e = Sf[i].t + Sy.sag(Sf[i + 1], r) - Sy.sag(Sf[i], r);
      if (!(e >= minEdge)) return false;
    }
    return true;
  }
  /* a cemented achromat of focal length f from two glasses; if the lens cannot be made at diameter D the largest diameter that can be
     is found by bisection. -> { ok, sys, D, limited, a, b, dV } or { ok: false, why: 'same' | 'shape', a, b, dV } */
  function makeDoublet(f, D, crown, flint) {
    const a = O.abbe(crown), b = O.abbe(flint), dV = a.vd - b.vd;
    if (!(Math.abs(dV) >= 4)) return { ok: false, why: 'same', a, b, dV };
    const tryD = d => {
      let sys = null;
      try { sys = Dz.achromat({ f, D: d, crown, flint }); } catch (e) { return null; }
      if (!sys.surfaces.every(s => Number.isFinite(s.R || 0)) || !rimsOk(sys, 0.4)) return null;
      const e = Sy.paraxial(sys, ND).efl;
      return Number.isFinite(e) && Math.abs(e / f - 1) < 0.01 ? sys : null;
    };
    let sys = tryD(D), d = D;
    if (!sys) {
      let lo = Math.min(D, 0.08 * f), hi = D;
      sys = tryD(lo);
      if (!sys) return { ok: false, why: 'shape', a, b, dV };
      d = lo;
      for (let i = 0; i < 7; i++) { const mid = (lo + hi) / 2, s2 = tryD(mid); if (s2) { lo = mid; sys = s2; d = mid; } else hi = mid; }
    }
    return { ok: true, sys, D: d, limited: d < D - 1e-9, a, b, dV };
  }
  /* RMS radius of the F, d and C spots taken together about their common centroid */
  function polyRms(spots) {
    let n = 0, sx = 0, sy = 0;
    for (const s of spots) for (const p of s.pts) { n++; sx += p[0]; sy += p[1]; }
    if (!n) return 0;
    sx /= n; sy /= n;
    let s2 = 0; for (const s of spots) for (const p of s.pts) s2 += (p[0] - sx) * (p[0] - sx) + (p[1] - sy) * (p[1] - sy);
    return Math.sqrt(s2 / n);
  }

  function achromat(el) {
    const L = T.util.lab(el, 'Pick a crown glass (little dispersion) and a flint glass (a lot) from the catalogue and cement them into an achromatic doublet: a strong positive crown element with a weaker negative flint element, whose colour errors cancel. The picture compares it with a single lens of the same focal length, traced in blue (F), yellow (d) and red (C) light.', 0.85, { minH: 520, maxH: 780 });
    const PRESETS = { p1: ['N-BK7', 'N-SF5'], p2: ['N-FK51A', 'N-SF6'], p3: ['N-BK7', 'fused-silica'] };
    const ctl = K.controls(L.side, [
      { id: 'crown', type: 'select', label: 'First glass (the crown, in front)', options: GLASS_OPTS, value: 'N-BK7' },
      { id: 'flint', type: 'select', label: 'Second glass (the flint, behind)', options: GLASS_OPTS, value: 'N-SF5' },
      { id: 'f', label: 'Focal length', min: 40, max: 300, step: 1, value: 100, unit: 'mm' },
      { id: 'D', label: 'Diameter', min: 10, max: 60, step: 1, value: 25, unit: 'mm' },
      { id: 'rays', label: 'Rays in a fan', min: 3, max: 15, step: 2, value: 7 },
      { type: 'buttons', items: [{ id: 'p1', label: 'Classic: N-BK7 + N-SF5', primary: true }, { id: 'p2', label: 'N-FK51A + N-SF6' }, { id: 'p3', label: 'Too alike: N-BK7 + fused silica' }] }
    ], id => {
      if (PRESETS[id]) { ctl.set('crown', PRESETS[id][0]); ctl.set('flint', PRESETS[id][1]); }
      draw();
    });
    const V = ctl.values;
    const ro = K.readout(L.side, [['crown', 'First glass'], ['flint', 'Second glass'], ['pair', 'The pair'], ['radii', 'Radii R₁ · R₂ · R₃'], ['pow', 'Element powers (alone in air)'], ['shift', 'Focus shift, F to C'], ['rms', 'RMS spot, F + d + C together'], ['airy', 'Airy disc diameter']]);
    L.under.innerHTML = '<div style="margin-top:12px">' + plotCell('Focus against colour', 'lp1', 'how far the paraxial focus moves with wavelength, in mm from the d-light focus: the doublet against the singlet') + '</div>' +
      '<p class="small muted" style="margin:10px 0 0">A singlet focuses blue light nearer than red, so its curve runs steeply. A doublet bends it back: the two colours F and C meet at one focus, which is what an achromat means, while the curve in between still bows a little (the secondary spectrum). That is why even a good achromat leaves a faint colour halo, and why apochromats use special glasses with an unusual partial dispersion. The first glass must be the one with the higher Abbe number V<sub>d</sub> for the usual crown-first design, but the lab also builds the reverse.</p>' +
      '<div class="ldt"></div>' +
      T.util.more(['achromatic-doublet', 'cemented-and-air-spaced-doublets', 'axial-chromatic-aberration', 'apochromats-and-ed-glass', 'the-abbe-number-and-glass-map', 'dispersion-and-the-spectrum']);
    const P = K.plot(ui.$('.lp1', L.under), { x: { label: 'wavelength (nm)', min: 420, max: 700 }, y: { label: 'mm' }, series: [] }, 240);
    const WL = []; for (let w = 420; w <= 700; w += 20) WL.push(w);
    let dkey = '', des = null, tkey = '';
    function design() {
      const key = [V.crown, V.flint, V.f, V.D].join('|');
      if (key !== dkey) { dkey = key; des = makeDoublet(V.f, V.D, V.crown, V.flint); }
      return des;
    }
    const gname = (id, a) => glassShort(id) + ': nd ' + fx(a.nd, 4) + ', Vd ' + fx(a.vd, 1);
    function fail(c, C, W, Hh, d) {
      const msg = d.why === 'same'
        ? 'These two glasses spread colour almost alike (Abbe numbers ' + fx(d.a.vd, 1) + ' and ' + fx(d.b.vd, 1) + '), so no pair of lens powers can bring red and blue to one focus: the design cannot be made. Choose a crown with a high V and a flint with a low V.'
        : 'These glasses would need curves too strong for a lens of this size. Try a longer focal length, a smaller diameter, or glasses that differ more in Abbe number.';
      wrap(msg, Math.max(24, Math.floor(W / 7.5))).forEach((ln, i, a) => K.label(c, ln, W / 2, Hh / 2 + (i - (a.length - 1) / 2) * 20, { align: 'center', size: 13.5, color: C.warn }));
      P.set({ series: [], vlines: [], marks: [] });
      ro.set('pair', d.why === 'same' ? 'too alike: no achromat exists' : 'no lens of this size');
      for (const k of ['radii', 'pow', 'shift', 'rms', 'airy']) ro.set(k, '—');
      tkey = ''; ui.$('.ldt', L.under).innerHTML = '';
    }
    function draw() {
      const c = L.st.begin(), C = K.colors(), W = L.st.W, Hh = L.st.H, d = design();
      ro.set('crown', gname(V.crown, d.a)); ro.set('flint', gname(V.flint, d.b));
      if (!d.ok) { fail(c, C, W, Hh, d); return; }
      const f = V.f, wk = work(d.sys), par = Sy.paraxial(wk, ND), n1 = O.index(V.crown, ND);
      const sg = singlet(Math.round(O.bestFormShape(n1) * 100) / 100, d.D, V.crown, f), wkS = work(sg.sys), parS = Sy.paraxial(wkS, ND);
      const zS = -0.14 * f, zMax = Math.max(par.zImage, parS.zImage) + 0.07 * f, bandH = Hh / 2, yH = d.D / 2 * 1.25;
      const airy = Number.isFinite(par.fno) ? O.diff.airyRadius(ND, par.fno) * 1e3 : NaN;
      const items = [{ w: wk, p: par, sys: d.sys, title: 'Cemented doublet: ' + glassShort(V.crown) + ' + ' + glassShort(V.flint) }, { w: wkS, p: parS, sys: sg.sys, title: 'Singlet of ' + glassShort(V.crown) + ', best form, the same focal length' }];
      items.forEach((it, i) => {
        const m = S.map(L.st, zS, zMax, yH, { left: 14, right: 196, top: i * bandH + 28, bottom: Hh - ((i + 1) * bandH - 8) });
        S.axis(c, m.X(zS), m.y0, m.X(zMax));
        S.system(c, it.sys, m);
        colourFans(c, m, it.w, { n: V.rays, zStart: zS, zEnd: it.p.zImage + 0.05 * f }, C);
        S.screen(c, m.X(it.p.zImage) - 2, m.y0, 0.45 * yH * m.s, {});
        for (const nm of TRI) K.dot(c, m.X(Sy.paraxial(it.w, nm).zImage), m.y0, 3, S.nm(nm), C.bg2);
        para(c, it.title, 16, i * bandH + 12, W - 190, { weight: 650, size: 12.5, color: C.text });
        it.bf = Sy.bestFocus(it.w, { nm: ND, rings: 4 });
        it.spots = TRI.map(nm => Sy.spot(it.w, { nm, rings: 6, z: it.bf.z }));
        it.rms = polyRms(it.spots);
        it.fc = Math.abs(Sy.paraxial(it.w, LN.F).zImage - Sy.paraxial(it.w, LN.C).zImage);
      });
      // the spots of the three colours, on one scale for both lenses
      let need = Number.isFinite(airy) ? 1.7 * airy : 0.001;
      for (const it of items) for (const s of it.spots) need = Math.max(need, 1.15 * s.geo);
      const half = nice(need), bh = clamp(bandH / 2 - 30, 36, 66), cx = W - 96;
      items.forEach((it, i) => {
        const cy = i * bandH + bandH / 2 + 4, sc = bh / half;
        c.fillStyle = C.surface; c.fillRect(cx - bh, cy - bh, 2 * bh, 2 * bh);
        spotBox(c, [{ spot: it.spots[0], nm: TRI[0] }, { spot: it.spots[2], nm: TRI[2] }, { spot: it.spots[1], nm: TRI[1] }], cx, cy, bh, sc, airy);
        K.label(c, 'F + d + C, best focus', cx, cy - bh - 9, { align: 'center', size: 11.5, color: C.muted });
        K.label(c, 'RMS ' + fx(2 * it.rms * 1000, 1) + ' µm', cx, cy + bh + 12, { align: 'center', size: 11.5, color: C.text });
      });
      K.label(c, 'boxes ±' + num(half * 1000) + ' µm; dashed circle: Airy disc', W - 14, Hh - 8, { align: 'right', size: 11, color: C.faint });
      let lx = 16;
      for (const [col, txt] of [[C.muted, W < 520 ? 'before the lens' : 'light before the lens'], [S.nm(TRI[0]), W < 520 ? 'F' : TRI_NAMES[0]], [S.nm(TRI[1]), W < 520 ? 'd' : TRI_NAMES[1]], [S.nm(TRI[2]), W < 520 ? 'C' : TRI_NAMES[2]]]) { K.dot(c, lx, Hh - 24, 4, col); K.label(c, txt, lx + 9, Hh - 24, { size: 11.5, color: C.muted }); lx += 26 + txt.length * 6.2; }

      // the focus-against-colour curves
      P.set({ x: { label: 'wavelength (nm)', min: 420, max: 700 }, y: { label: 'mm' },
        series: [{ pts: clean(Sy.chromaticShift(wk, WL, ND)), label: 'cemented doublet', color: C.accent }, { pts: clean(Sy.chromaticShift(wkS, WL, ND)), label: 'singlet', color: C.warn }],
        vlines: [{ x: LN.F, label: 'F' }, { x: LN.d, label: 'd' }, { x: LN.C, label: 'C' }], marks: [] });

      // read-outs and the prescription
      const s = d.sys.surfaces, Pc = 1000 / O.lensmaker(n1, s[0].R, s[1].R, s[0].t), Pf = 1000 / O.lensmaker(O.index(V.flint, ND), s[1].R, s[2].R, s[1].t);
      const ad = Math.abs(d.dV), ratio = items[1].fc > 0 ? items[0].fc / items[1].fc : NaN;
      ro.set('pair', ad >= 12 && ratio < 0.25 ? 'V differ by ' + fx(ad, 1) + ': good' : 'V differ by ' + (ad < 12 ? 'only ' : '') + fx(ad, 1) + ': strong curves, colour only partly cancelled');
      ro.set('radii', rtxt(s[0].R) + ' · ' + rtxt(s[1].R) + ' · ' + rtxt(s[2].R) + ' mm');
      ro.set('pow', fx(Pc, 1) + ' D and ' + fx(Pf, 1) + ' D');
      ro.set('shift', 'doublet ' + fx(items[0].fc, 3) + ' mm · singlet ' + fx(items[1].fc, 2) + ' mm' + (Number.isFinite(ratio) ? ' (' + fx(100 * ratio, 0) + ' %)' : ''));
      ro.set('rms', 'doublet ' + fx(2 * items[0].rms * 1000, 1) + ' µm · singlet ' + fx(2 * items[1].rms * 1000, 1) + ' µm');
      ro.set('airy', Number.isFinite(airy) ? fx(2 * airy * 1000, 1) + ' µm  (f/' + fx(par.fno, 1) + ')' : '—');
      const key = [V.crown, V.flint, V.f, d.D].join('|');
      if (key !== tkey) {
        tkey = key;
        ui.$('.ldt', L.under).innerHTML = T.util.box('Prescription of the doublet' + (d.limited ? ' (diameter reduced to ' + fx(d.D, 1) + ' mm so that the lens can be made)' : ''), prescription(d.sys, par) + PRESCRIPTION_NOTE);
      }
    }
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }
})();
