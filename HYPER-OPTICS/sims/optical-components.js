/* HYPER-OPTICS · sims/optical-components.js — the hardware of an optical bench (prefix oc-).
 *   oc-plate       a plate of glass in a beam: window (loss, shift, wedge, ghost, Brewster) or mirror (first or second surface)
 *   oc-prism       the prism family traced through real glass: turns, flips, retro-returns, dispersion
 *   oc-splitter    plate, cube and pellicle beam splitters: ratio, absorption, ghost, combiner
 *   oc-pbs         polarizing cube and Wollaston prism, with the quarter-wave isolator
 *   oc-diffuser    ground glass, opal and engineered diffusers: angular spread, spot on a screen
 *   oc-lenses      catalogue lens shapes traced for collimating and for 1:1 relay
 *   oc-iris        an iris diaphragm and a pinhole: area, f-number, diffraction
 *   oc-modulator   Faraday isolator, Pockels cell and acousto-optic modulator
 *   oc-mount       a mirror on a kinematic mount: screw pitch, tilt and where the beam goes
 *   oc-walk        beam walking with two mirrors and two irises
 *   oc-clean       dust, fingerprints and scratches: what each way of cleaning does (schematic)
 *   oc-catalogue   a lens catalogue line, decoded and drawn to scale
 * Every number comes from kit.optics, every drawing from kit.osym; small geometric helpers (a plate tracer, a
 * polygon tracer) are local to this file and use the engine's Snell law and Fresnel/film code for the physics.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;

  /* ---------------------------------------------------------------- small vector helpers (x right, y up) */
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1], cross = (a, b) => a[0] * b[1] - a[1] * b[0];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]], sub = (a, b) => [a[0] - b[0], a[1] - b[1]], mul = (a, k) => [a[0] * k, a[1] * k];
  const len = a => Math.hypot(a[0], a[1]), unit = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
  const rot = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
  const angBetween = (a, b) => Math.atan2(Math.abs(cross(a, b)), dot(a, b));
  const reflect = (d, m) => { const c = dot(d, m); return [d[0] - 2 * c * m[0], d[1] - 2 * c * m[1]]; };
  /* refraction of the unit direction d at a surface with unit normal m (pointing the way the light goes), from index n1
     into n2: the angle comes from the engine's Snell law; null when the light is totally reflected */
  function refract(O, d, m, n1, n2) {
    const t1 = Math.acos(Math.max(-1, Math.min(1, dot(d, m)))), t2 = O.snell(n1, n2, t1);
    if (Number.isNaN(t2)) return null;
    return rot(m, (cross(m, d) >= 0 ? 1 : -1) * t2);
  }
  const visible = nm => nm >= 380 && nm <= 780;
  const polArg = p => (p === 's' || p === 'p') ? p : undefined;
  const clampv = (v, a, b) => Math.max(a, Math.min(b, v));

  /* a flat plate of index n and thickness t (mm), its front normal turned aoi from the beam (which travels +x and
     meets the front face at the origin), wedge in rad. P.fo(θ) is { R, T } for light meeting the front face from air;
     P.bi(θ) the back face from inside the glass; P.fi(θ) the front face from inside (default: the same as bi).
     -> the three beams that matter: the front reflection, the transmitted beam and the ghost reflected from the back face */
  function tracePlate(O, P) {
    const a = P.aoi, d = [1, 0], m = [Math.cos(a), Math.sin(a)], nm_ = [-m[0], -m[1]];
    const B0 = [P.t * m[0], P.t * m[1]], mb = rot(m, P.wedge), P1 = [0, 0];
    const out = { m, mb, B0, beams: [], fo: P.fo(a), bi: { R: 0, T: 0 }, fi: { R: 0, T: 0 } };
    const dr = reflect(d, m);
    out.beams.push({ kind: 'front', pts: [P1, add(P1, mul(dr, P.Lout))], frac: out.fo.R, d: dr });
    const d2 = refract(O, d, m, 1, P.n);
    if (!d2) return out;
    out.d2 = d2;
    const P2 = add(P1, mul(d2, dot(sub(B0, P1), mb) / dot(d2, mb)));
    out.P2 = P2; out.thb = angBetween(d2, mb);
    const bi = out.bi = P.bi(out.thb);
    const d3 = refract(O, d2, mb, P.n, 1);
    if (d3 && bi.T > 1e-6) { out.beams.push({ kind: 'main', pts: [P1, P2, add(P2, mul(d3, P.Lout))], frac: out.fo.T * bi.T, d: d3 }); out.d3 = d3; }
    if (bi.R > 1e-6) {
      const d4 = reflect(d2, mb), P3 = add(P2, mul(d4, dot(sub([0, 0], P2), m) / dot(d4, m)));
      const fi = out.fi = (P.fi || P.bi)(angBetween(d4, nm_));
      const d5 = refract(O, d4, nm_, P.n, 1);
      if (d5) { out.beams.push({ kind: 'ghost', pts: [P1, P2, P3, add(P3, mul(d5, P.Lout))], frac: out.fo.T * bi.R * fi.T, d: d5, P3 }); out.d5 = d5; out.P3 = P3; }
    }
    return out;
  }

  /* the outline of the plate of a tracePlate result: front face through the origin, back face t away (turned by the wedge) */
  function platePoly(tr, hh) {
    const u = [-tr.m[1], tr.m[0]], pts = [];
    for (const v of [-hh, hh]) pts.push(mul(u, v));
    for (const v of [hh, -hh]) { const Fp = mul(u, v), sb = dot(sub(tr.B0, Fp), tr.mb) / dot(tr.m, tr.mb); pts.push(add(Fp, mul(tr.m, sb))); }
    return pts;
  }

  /* ================================================================ a plate: window or mirror */
  Hyper.sim('oc-plate', {
    title: 'A plate of glass in a beam: window, mirror and ghost',
    blurb: `A beam meets a plate of glass. Every surface reflects some of it and transmits the rest; the picture draws each beam as bright as it really is, and the read-out gives the numbers. Reflectances come from the Fresnel equations, or from the coating's layers when it has any.

**Try this (window)**
- Choose *Germanium* (the wavelength moves into its infrared band) and read the transmission: more than half the light is lost to reflection at its two faces. Fit the broadband coating and see how little glass, by contrast, loses.
- Tilt the plate: the beam is **shifted** sideways, never turned. Add a **wedge**: now the transmitted beam turns and the ghost reflection separates from the main one.
- Press **Brewster angle** with p polarization: the front reflection vanishes. Switch to s: it grows.

**Try this (mirror)**
- Compare *first surface* and *second surface*: the second-surface mirror has a faint second beam (the ghost) beside the main one. Thicken the glass or tilt it and the two beams move apart.
- Drag the plate or use the slider; the coating's reflectance at your wavelength is in the read-out.

The window coatings are designed for 550 nm, so they work best there; far from it they do little.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const mode = params.mode === 'mirror' ? 'mirror' : 'window';
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const MATS = [['N-BK7 glass', 'N-BK7'], ['Fused silica', 'fused-silica'], ['Sapphire', 'sapphire'], ['Calcium fluoride', 'CaF2'], ['Zinc selenide (infrared)', 'ZnSe'], ['Germanium (infrared)', 'germanium'], ['PMMA acrylic', 'PMMA']];
      const POLS = [['Unpolarized', 'u'], ['s (across the plane of the drawing)', 's'], ['p (in the plane of the drawing)', 'p']];
      const defs = mode === 'window' ? [
        { id: 'mat', type: 'select', label: 'Material', options: MATS, value: params.mat || 'N-BK7' },
        { id: 't', label: 'Thickness', min: 1, max: 25, step: 0.5, value: params.t || 10, unit: 'mm' },
        { id: 'aoi', label: 'Angle of incidence', min: 0, max: 80, step: 0.5, value: params.aoi != null ? params.aoi : 30, unit: '°' },
        { id: 'wedge', label: 'Wedge between the faces', min: 0, max: 90, step: 1, value: params.wedge || 0, unit: '′' },
        { id: 'coat', type: 'select', label: 'Coating on both faces', options: [['None', 'none'], ['One quarter-wave layer of MgF₂ (550 nm)', 'mgf2'], ['Broadband three-layer AR (550 nm)', 'bbar']], value: params.coat || 'none' },
        { id: 'pol', type: 'select', label: 'Polarization', options: POLS, value: params.pol || 'u' },
        { id: 'nm', label: 'Wavelength', min: 400, max: 12000, value: params.nm || 550, log: true, sig: 3, unit: 'nm' },
        { type: 'buttons', items: [{ id: 'brew', label: 'Brewster angle, p light', primary: true }] }
      ] : [
        { id: 'kind', type: 'select', label: 'Construction', options: [['First surface (coating faces the light)', 'first'], ['Second surface (silvered back of the glass)', 'second']], value: params.kind || 'second' },
        { id: 'coat', type: 'select', label: 'Reflecting coating', options: [['Protected aluminium', 'aluminium'], ['Protected silver', 'silver'], ['Gold', 'gold'], ['Dielectric stack (550 nm)', 'hr']], value: params.coat || 'aluminium' },
        { id: 't', label: 'Glass thickness', min: 1, max: 15, step: 0.5, value: params.t || 6, unit: 'mm' },
        { id: 'aoi', label: 'Angle of incidence', min: 0, max: 80, step: 0.5, value: params.aoi != null ? params.aoi : 45, unit: '°' },
        { id: 'pol', type: 'select', label: 'Polarization', options: POLS, value: 'u' },
        { id: 'nm', label: 'Wavelength', min: 400, max: 1100, step: 5, value: params.nm || 550, unit: 'nm' }
      ];
      let ctl;
      ctl = kit.controls(box.side, defs, id => {
        if (id === 'mat') { const r = O.MATERIALS[V.mat].range; if (V.nm < r[0] || V.nm > r[1]) ctl.set('nm', Math.round(clampv(r[0] <= 550 && r[1] >= 550 ? 550 : Math.sqrt(r[0] * r[1]), 400, 12000))); }
        if (id === 'brew') { const n = O.index(V.mat, V.nm); ctl.set('aoi', Math.round(Math.atan(n) * R2D * 2) / 2); ctl.set('pol', 'p'); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, mode === 'window'
        ? [['n', 'Refractive index'], ['R', 'Reflected at the front face'], ['T', 'Transmitted by the plate'], ['shift', 'Beam shifted sideways'], ['dev', 'Beam turned by'], ['ghost', 'Ghost beam: angle to the reflection'], ['brew', 'Brewster angle'], ['band', 'Band of the material']]
        : [['main', 'Main reflected beam'], ['ghost', 'Ghost beam (from the glass face)'], ['off', 'Ghost offset from the main beam'], ['coat', 'Coating s / p reflectance'], ['wf', 'Wavefront error from 100 nm of flatness error']]);
      const pivot = () => ({ x: st.W * 0.42, y: st.H / 2 });
      const scaleOf = () => Math.min(st.W / 124, st.H / 84);
      kit.drag(st, {
        hover: true,
        hit: p => { const o = pivot(); return Math.hypot(p.x - o.x, p.y - o.y) < Math.min(st.H * 0.4, 90) ? 'plate' : null; },
        move: (w, p) => { const o = pivot(); const a = Math.atan2(o.y - p.y, p.x - o.x) * R2D; ctl.set('aoi', Math.round(clampv(a, 0, 80) * 2) / 2); loop.once(); }
      });
      const pct = x => (100 * x).toFixed(x < 0.01 ? 2 : x < 0.1 ? 1 : 1) + ' %';
      const dsg = (id, nm) => O.film.design(id, 550, 'N-BK7');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const s = scaleOf(), o = pivot(), X = x => o.x + s * x, Y = y => o.y - s * y;
        const nm = V.nm, pol = polArg(V.pol), aoi = V.aoi * D2R;
        const ray = visible(nm) ? { nm } : { color: C.warn };
        let n, fo, bi, fi, wedge = 0, shown = {};
        if (mode === 'window') {
          n = O.index(V.mat, nm); wedge = V.wedge / 60 * D2R;
          const L = V.coat === 'none' ? [] : dsg(V.coat).layers;
          const outDef = { n0: 1, ns: V.mat, layers: L }, inDef = { n0: V.mat, ns: 1, layers: L.slice().reverse() };
          fo = th => O.film.stack(outDef, nm, th, pol); bi = th => O.film.stack(inDef, nm, th, pol);
        } else {
          n = O.index('N-BK7', nm);
          const d = dsg(V.coat);
          if (V.kind === 'first') { fo = th => ({ R: O.film.stack(d, nm, th, pol).R, T: 0 }); bi = () => ({ R: 0, T: 0 }); }
          else {
            const back = V.coat === 'hr' ? { n0: 'N-BK7', ns: 1, layers: d.layers.slice().reverse() } : { n0: 'N-BK7', ns: V.coat, layers: [] };
            fo = th => O.film.stack({ n0: 1, ns: 'N-BK7', layers: [] }, nm, th, pol); bi = th => { const r = O.film.stack(back, nm, th, pol); return { R: r.R, T: 0 }; };
            fi = th => O.film.stack({ n0: 'N-BK7', ns: 1, layers: [] }, nm, th, pol);
          }
        }
        const inBand = mode === 'mirror' || (nm >= O.MATERIALS[V.mat].range[0] && nm <= O.MATERIALS[V.mat].range[1]);
        const tr = tracePlate(O, { n, t: V.t, aoi, wedge, fo, bi, fi, Lout: 44 });
        if (!inBand) tr.beams.forEach(b => { if (b.kind !== 'front') b.frac = 0; });
        // the plate: front face through the pivot, back face t away (turned by the wedge)
        const px = platePoly(tr, 21).map(p => [X(p[0]), Y(p[1])]);
        S.poly(c, px, { fill: S.glass(mode === 'window' ? 0.2 : 0.26) });
        if (mode === 'mirror') {
          const e = V.kind === 'first' ? [px[0], px[1]] : [px[2], px[3]];
          c.save(); c.strokeStyle = S.metal(); c.lineWidth = 3.4; c.beginPath(); c.moveTo(e[0][0], e[0][1]); c.lineTo(e[1][0], e[1][1]); c.stroke(); c.restore();
        } else if (V.coat !== 'none') {
          c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath(); c.moveTo(px[0][0], px[0][1]); c.lineTo(px[1][0], px[1][1]); c.moveTo(px[2][0], px[2][1]); c.lineTo(px[3][0], px[3][1]); c.stroke(); c.restore();
        }
        S.normal(c, o.x, o.y, Math.atan2(-tr.m[1], tr.m[0]), 38);
        // the beams, as bright as they are
        const x0 = 46;
        S.source(c, x0, o.y, { kind: 'laser', dir: 0, size: 9 });
        S.ray(c, [[x0, o.y], [o.x, o.y]], Object.assign({ width: 2.6 }, ray));
        const names = { front: mode === 'mirror' && V.kind === 'first' ? 'reflected' : 'front reflection', main: 'transmitted', ghost: mode === 'mirror' ? 'main beam' : 'ghost' };
        const lab = (b, text) => {
          const e = b.pts[b.pts.length - 1];
          let lx = clampv(X(e[0]), 12, W - 12), ly = clampv(Y(e[1]), 14, Hh - 12);
          kit.label(c, text, lx, ly, { align: lx > W * 0.7 ? 'right' : lx < W * 0.3 ? 'left' : 'center', color: C.muted, size: 11.5 });
        };
        for (const b of tr.beams) {
          if (b.frac < 0.0006) continue;
          const p2 = b.pts.map(p => [X(p[0]), Y(p[1])]);
          S.ray(c, p2, Object.assign({ width: 0.8 + 2.2 * Math.sqrt(b.frac), alpha: 0.28 + 0.72 * Math.min(1, Math.sqrt(b.frac)), minArrow: 40 }, ray));
          let nmName = names[b.kind];
          if (mode === 'mirror') nmName = V.kind === 'first' ? (b.kind === 'front' ? 'reflected' : '') : (b.kind === 'front' ? 'ghost (glass face)' : 'main beam');
          if (nmName) lab(b, nmName + '  ' + pct(b.frac));
        }
        kit.label(c, 'n = ' + n.toFixed(3) + (mode === 'window' ? '' : '  (glass)'), X(tr.B0[0]) + 16, Y(tr.B0[1]) + (tr.m[1] > 0 ? 38 : -38), { color: C.faint, size: 11 });
        // the numbers
        const get = k => tr.beams.find(b => b.kind === k);
        if (mode === 'window') {
          const bk = tr.bi || { R: 0, T: 0 }, fiR = (tr.fi && tr.fi.R) || bk.R;
          const Ttot = inBand ? tr.fo.T * bk.T / (1 - fiR * bk.R) : 0;
          ro.set('n', n.toFixed(4) + ' at ' + kit.fmt(nm, 4) + ' nm');
          ro.set('R', pct(tr.fo.R));
          ro.set('T', inBand ? pct(Ttot) + '  (all bounces counted)' : 'none: the material absorbs here');
          ro.set('shift', wedge === 0 && tr.d3 ? O.plateShift(V.t, n, aoi).toFixed(2) + ' mm' : (tr.d3 ? 'shifted, and turned (wedge)' : '—'));
          ro.set('dev', tr.d3 ? (angBetween(tr.d3, [1, 0]) * R2D).toFixed(2) + '°' : 'total reflection');
          const g = get('ghost'), fr = get('front');
          ro.set('ghost', g && fr ? (angBetween(g.d, fr.d) * R2D).toFixed(2) + '°' + (angBetween(g.d, fr.d) < 1e-4 ? '  (overlaps it)' : '') : '—');
          ro.set('brew', (O.brewster(1, n) * R2D).toFixed(2) + '°');
          const r = O.MATERIALS[V.mat].range;
          ro.set('band', (r[0] / 1000).toFixed(r[0] < 1000 ? 2 : 1) + ' – ' + (r[1] / 1000).toFixed(1) + ' µm' + (inBand ? '' : '  (you are outside it)'));
        } else {
          const gm = get('ghost'), fr = get('front'), d = dsg(V.coat);
          const rr = O.film.stack(V.kind === 'first' ? d : (V.coat === 'hr' ? { n0: 'N-BK7', ns: 1, layers: d.layers.slice().reverse() } : { n0: 'N-BK7', ns: V.coat, layers: [] }), nm, V.kind === 'first' ? aoi : tr.thb || 0);
          ro.set('main', V.kind === 'first' ? pct(fr.frac) : (gm ? pct(gm.frac) : '—'));
          ro.set('ghost', V.kind === 'first' ? 'none' : pct(fr.frac));
          ro.set('off', V.kind === 'first' ? 'no second beam' : (gm ? (Math.abs(cross(fr.d, sub(gm.P3, [0, 0]))) ).toFixed(2) + ' mm apart' : '—'));
          ro.set('coat', pct(rr.Rs) + ' / ' + pct(rr.Rp));
          ro.set('wf', (2 * 100 * Math.cos(aoi)).toFixed(0) + ' nm  (2h cos θ)');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the prism family */
  /* trace a ray through a convex polygon of index n (vertices counter-clockwise, y up). faces[i] describes the edge
     from vertex i to i + 1: { mirror: reflecting coating, tir: a face that is meant to reflect totally }.
     -> { pts, d (final direction), refl (reflections), leak (a face meant to reflect totally let light out), exitP } */
  function polyTrace(O, poly, faces, n, p, d, far) {
    const N = poly.length, pts = [p];
    let inside = false, last = -1, refl = 0, leak = false, exitP = null;
    for (let it = 0; it < 16; it++) {
      let best = null;
      for (let i = 0; i < N; i++) {
        if (i === last) continue;
        const A = poly[i], e = sub(poly[(i + 1) % N], A), den = cross(d, e);
        if (Math.abs(den) < 1e-12) continue;
        const t = cross(sub(A, p), e) / den, u = cross(sub(A, p), d) / den;
        if (t > 1e-9 && u >= -1e-9 && u <= 1 + 1e-9 && (!best || t < best.t)) best = { t, i, e };
      }
      if (!best) break;
      p = add(p, mul(d, best.t)); pts.push(p); last = best.i;
      const out = unit([best.e[1], -best.e[0]]), face = faces[best.i] || {};
      if (!inside) {
        if (dot(d, out) >= 0) continue;
        const d2 = refract(O, d, [-out[0], -out[1]], 1, n);
        if (!d2) { d = reflect(d, out); continue; }
        d = d2; inside = true;
      } else if (dot(d, out) > 0) {
        if (face.mirror) { d = reflect(d, out); refl++; }
        else {
          const d2 = refract(O, d, out, n, 1);
          if (!d2) { d = reflect(d, out); refl++; }
          else { if (face.tir) leak = true; d = d2; inside = false; exitP = p; }
        }
      }
    }
    pts.push(add(p, mul(d, far || 3)));
    return { pts, d, refl, leak, exitP };
  }

  /* the prisms, as polygons in their own units; pivot is where the central ray meets the first face */
  function makePrism(O, type, n, extra) {
    const T = {
      right90: { name: 'Right-angle prism, 90° turn', poly: [[0, 0], [2, 0], [0, 2]], tir: [1], pivot: [0, 0.95], w: 0.28, note: 'One total reflection at the hypotenuse: the beam turns by 90° and the image is mirrored.' },
      porro: { name: 'Right-angle prism, hypotenuse in (Porro)', poly: [[0, -2], [2, 0], [0, 2]], tir: [0, 1], pivot: [0, 0.6], w: 0.3, note: 'Entering the hypotenuse, two total reflections send the beam back: 180°, displaced and turned over.' },
      penta: { name: 'Penta prism', poly: [[0, 0], [1, 0], [1.5358, 1.2935], [1.2935, 1.5358], [0, 1]], mirror: [1, 3], pivot: [0, 0.5], w: 0.16, note: 'Two coated faces 45° apart: the beam turns by exactly 90° however the prism is rotated.' },
      dove: { name: 'Dove prism', poly: [[0, 0], [4, 0], [3, 1], [1, 1]], tir: [0], pivot: [0.5, 0.5], w: 0.16, note: 'One total reflection in the long face: the beam stays on its line and the image is turned over.' },
      roof: { name: 'Roof (Amici) prism', poly: [[0, 0], [2, 0], [0, 2]], tir: [1], pivot: [0, 0.95], w: 0.28, flips: 1, note: 'As the right-angle prism, but the hypotenuse is a 90° roof (its ridge points out of the page): two reflections, no mirror image.' },
      corner: { name: 'Corner cube', poly: [[0, -2], [2, 0], [0, 2]], mirror: [0, 1], pivot: [0, 0.6], w: 0.3, flips: 1, note: 'Three mutually perpendicular mirror faces return every ray parallel to itself. Two faces are drawn; the third is out of the page.' },
      rhomboid: { name: 'Rhomboid prism', poly: [[0, 1.6], [0, 0], [2.4, -2.4], [2.4, -0.8]], tir: [1, 3], pivot: [0, 0.5], w: 0.25, note: 'Two parallel total reflections: the beam keeps its direction and moves sideways.' },
      wedge: { name: 'Wedge prism', poly: [[0, -1], [0.5, -1], [0.5 + 2 * Math.tan((extra.wedge || 6) * D2R), 1], [0, 1]], pivot: [0, 0], w: 0.3, note: 'A thin wedge turns the beam by about (n − 1)α, towards its thick end.' },
      equilateral: { name: 'Equilateral prism', poly: [[0, 0], [2, 0], [1, Math.sqrt(3)]], pivot: [0.55 / Math.sqrt(3), 0.55], w: 0, disp: true, note: 'A 60° prism turns blue light more than red. At the right angle the ray inside runs parallel to the base.' },
      anamorphic: { name: 'Anamorphic prism', note: 'The beam meets the first face at 70° and leaves along the normal of the second: its width in this plane is multiplied.', w: 0.3, pivot: [0, 0] }
    }[type];
    const P = Object.assign({}, T);
    if (type === 'anamorphic') {
      const m = [Math.cos(70 * D2R), Math.sin(70 * D2R)], din = refract(O, [1, 0], m, 1, n) || [1, 0];
      const X0 = mul(din, 1.6), u1 = rot(m, Math.PI / 2), u2 = rot(din, Math.PI / 2), c12 = cross(u1, u2);
      const a = cross(X0, u2) / c12, Ap = mul(u1, a);
      const d1 = unit(sub([0, 0], Ap)), d2 = unit(sub(X0, Ap));
      let V1 = add(Ap, mul(d1, len(Ap) + 1.1)), V2 = add(Ap, mul(d2, len(sub(X0, Ap)) + 1.1));
      P.poly = cross(sub(V1, Ap), sub(V2, Ap)) > 0 ? [Ap, V1, V2] : [Ap, V2, V1];
    }
    // normalise so that the prism fits about 1.5 units around its pivot
    let R = 0; for (const v of P.poly) R = Math.max(R, len(sub(v, P.pivot)));
    const k = 1.5 / R;
    P.k = k; P.w = (P.w || 0) * k; P.flips = P.flips || 0;
    P.poly = P.poly.map(v => mul(sub(v, P.pivot), k));
    P.faces = P.poly.map((v, i) => ({ mirror: (P.mirror || []).indexOf(i) >= 0, tir: (P.tir || []).indexOf(i) >= 0 }));
    return P;
  }

  Hyper.sim('oc-prism', {
    title: 'The prism family: where each one sends the light',
    blurb: `Three rays (red on the top edge of the beam, green in the middle, blue at the bottom) are traced through real glass, face by face, with total internal reflection wherever the light meets a face too steeply. The arrow across the beam shows what happens to the picture: it points to the red ray before the prism and after it.

**Try this**
- *Right-angle prism*: rotate it by a few degrees. The deviation changes by **twice** the rotation. Rotate it further, or choose *Water* as the glass: the angle at the hypotenuse falls below the critical angle, the face stops reflecting and the light leaks out.
- *Penta prism*: rotate it. The deviation stays at exactly 90°. Then try *Porro* (uncoated: 180° while total reflection lasts) and *Corner cube* (coated: 180° at every rotation).
- *Dove prism*: the beam leaves along its own line and the arrow points the other way: the image is turned over. Rotate it in the page and the beam swings by twice the rotation, as it would from a mirror: a Dove prism must be set square to the beam.
- *Equilateral prism* in dense flint: rotate until the deviation is smallest (minimum deviation, near 33° clockwise), then past it in both directions.
- *Anamorphic prism*: read the beam width ratio; two prisms square it.

The drawing is the cross-section in the plane of the page; the roof and the third face of the corner cube are out of it (see the read-out).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const TYPES = [['Right-angle prism, 90° turn', 'right90'], ['Right-angle prism, 180° (Porro)', 'porro'], ['Penta prism', 'penta'], ['Dove prism', 'dove'], ['Roof (Amici) prism', 'roof'], ['Corner cube', 'corner'], ['Rhomboid prism', 'rhomboid'], ['Wedge prism', 'wedge'], ['Equilateral prism (dispersing)', 'equilateral'], ['Anamorphic prism', 'anamorphic']];
      const DEF = { equilateral: 33, anamorphic: 0 };
      const GLASS = [['N-BK7 crown glass', 'N-BK7'], ['Fused silica', 'fused-silica'], ['N-SF11 dense flint', 'N-SF11'], ['PMMA acrylic', 'PMMA'], ['Water (n = 1.33)', 'water']];
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Prism', options: TYPES, value: params.type || 'right90' },
        { id: 'mat', type: 'select', label: 'Glass', options: GLASS, value: params.mat || 'N-BK7' },
        { id: 'rot', label: 'Rotate the prism (clockwise)', min: -45, max: 75, step: 0.5, value: params.rot != null ? params.rot : (DEF[params.type] || 0), unit: '°' },
        { id: 'pos', label: 'Move the beam across', min: -0.5, max: 0.5, step: 0.01, value: 0, fmt: v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2) },
        { id: 'wedge', label: 'Wedge angle', min: 1, max: 15, step: 0.5, value: 6, unit: '°' },
        { id: 'tilt', label: 'Tilt out of the page (corner cube)', min: 0, max: 35, step: 1, value: 12, unit: '°' }
      ], id => {
        if (id === 'type') ctl.set('rot', DEF[V.type] || 0);
        sync(); loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Index of the glass (yellow)'], ['dev', 'Beam turned by'], ['refl', 'Reflections'], ['img', 'Image'], ['tir', 'Total reflection'], ['extra', 'More']]);
      function sync() { ctl.show('wedge', V.type === 'wedge'); ctl.show('tilt', V.type === 'corner'); ctl.show('pos', V.type !== 'equilateral'); }
      sync();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const n0 = O.index(V.mat, 587.56), P = makePrism(O, V.type, n0, { wedge: V.wedge });
        const s = Math.min(W / 7.8, Hh / 5.6), ox = W * 0.4, oy = Hh * 0.5, X = p => ox + s * p[0], Y = p => oy - s * p[1];
        const phi = -V.rot * D2R, poly = P.poly.map(v => rot(v, phi));
        const px = poly.map(v => [X(v), Y(v)]);
        S.poly(c, px, { fill: S.glass(0.26) });
        // coated and totally reflecting faces
        P.faces.forEach((f, i) => {
          if (!f.mirror && !f.tir) return;
          const a = px[i], b = px[(i + 1) % px.length];
          c.save(); c.lineWidth = f.mirror ? 3.4 : 2; c.strokeStyle = f.mirror ? S.metal() : C.accent; if (f.tir) c.setLineDash([6, 4]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore();
        });
        kit.label(c, P.name, 12, 18, { weight: 650 });
        kit.label(c, P.note, 12, Hh - 14, { color: C.muted, size: 11.5, bg: C.dark ? 'rgba(20,24,32,0.8)' : 'rgba(240,243,250,0.85)' });
        // the rays
        const x0 = -3.5, rays = [];
        if (P.disp) { for (const nm of [440, 490, 550, 610, 670]) rays.push({ y: 0, nm, id: 1 }); }
        else { rays.push({ y: P.w + V.pos * 1.5, nm: 640, id: 2 }, { y: V.pos * 1.5, nm: 550, id: 1 }, { y: -P.w + V.pos * 1.5, nm: 450, id: 0 }); }
        const res = rays.map(r => Object.assign(r, polyTrace(O, poly, P.faces, O.index(V.mat, P.disp ? r.nm : 587.56), [x0, r.y], [1, 0], 3.6)));
        for (const r of res) {
          const pp = r.pts.map(p => [X(p), Y(p)]);
          S.ray(c, pp, { nm: r.nm, width: P.disp ? 1.6 : 2.2, minArrow: 70 });
        }
        // the picture: an arrow across the beam, before and after
        let leak = res.some(r => r.leak);
        if (!P.disp) {
          const top = res[0], mid = res[1], bot = res[2], d = mid.d;
          const aIn = [[-2.9, bot.y], [-2.9, top.y]];
          kit.arrow(c, X(aIn[0]), Y(aIn[0]), X(aIn[1]), Y(aIn[1]), C.text, 2.2, 9);
          if (top.exitP && bot.exitP && mid.exitP) {
            const q = Math.max(dot(top.exitP, d), dot(bot.exitP, d), dot(mid.exitP, d)) + 0.9;
            const at = r => add(r.exitP, mul(d, q - dot(r.exitP, d)));
            const a1 = at(bot), a2 = at(top);
            kit.arrow(c, X(a1), Y(a1), X(a2), Y(a2), C.text, 2.2, 9);
          }
        }
        // read-outs
        const mid = res[Math.min(1, res.length - 1)], d = mid.d;
        const dev = Math.atan2(cross([1, 0], d), dot([1, 0], d)) * R2D;
        ro.set('n', n0.toFixed(4) + '  (critical angle ' + (O.criticalAngle(n0, 1) * R2D).toFixed(1) + '°)');
        ro.set('dev', Math.abs(Math.abs(dev) - 180) < 0.05 ? '180° (sent straight back)' : Math.abs(dev) < 0.005 ? '0°: straight on' : Math.abs(dev).toFixed(2) + '°' + (dev > 0 ? ' to the left' : ' to the right'));
        const par = (mid.refl + P.flips) % 2;
        ro.set('refl', mid.refl + ' in the page' + (P.flips ? ' + ' + (V.type === 'roof' ? 'the roof' : 'the third face') : ''));
        ro.set('img', par ? 'a mirror image' : 'not mirrored' + (mid.refl && Math.abs(Math.abs(dev) - 180) < 5 ? ' (turned over: see the arrows)' : ''));
        ro.set('tir', P.faces.some(f => f.tir) ? (leak ? 'FAILS: a face lets light out (it is below the critical angle ' + (O.criticalAngle(n0, 1) * R2D).toFixed(1) + '°)' : 'complete at every face') : (P.faces.some(f => f.mirror) ? 'coated faces: not needed' : 'not used'));
        let ex = '';
        if (V.type === 'anamorphic') {
          const sep = (a, b) => Math.abs(cross(d, sub(a.exitP || [0, 0], b.exitP || [0, 0])));
          ex = res[0].exitP && res[2].exitP ? 'Beam width out ÷ in: ' + (sep(res[0], res[2]) / (2 * P.w)).toFixed(2) : 'the beam misses the prism';
        } else if (V.type === 'corner') {
          const th = V.tilt * D2R, v = [Math.cos(th) * Math.cos(phi), Math.cos(th) * Math.sin(phi), Math.sin(th)];
          const n1 = [Math.cos(phi), Math.sin(phi), 0], n2 = [-Math.sin(phi), Math.cos(phi), 0], n3 = [0, 0, 1];
          const r3 = (u, q) => { const k = u[0] * q[0] + u[1] * q[1] + u[2] * q[2]; return [u[0] - 2 * k * q[0], u[1] - 2 * k * q[1], u[2] - 2 * k * q[2]]; };
          const w = r3(r3(r3(v, n1), n2), n3);     // one reflection in each of three perpendicular faces
          ex = 'All three faces: back at ' + (Math.acos(clampv(-(w[0] * v[0] + w[1] * v[1] + w[2] * v[2]), -1, 1)) * R2D).toFixed(2) + '° off exactly antiparallel';
        } else if (V.type === 'wedge') ex = 'Thin-wedge estimate (n − 1)α: ' + ((n0 - 1) * V.wedge).toFixed(2) + '°';
        else if (V.type === 'equilateral') ex = 'Spread blue to red: ' + (() => { const a = Math.atan2(cross([1, 0], res[0].d), dot([1, 0], res[0].d)), b = Math.atan2(cross([1, 0], res[4].d), dot([1, 0], res[4].d)); return (Math.abs(a - b) * R2D).toFixed(2) + '°'; })() + ' · minimum deviation ' + (O.minDeviation(n0, 60 * D2R) * R2D).toFixed(2) + '°';
        else if (V.type === 'dove') ex = 'Roll it by φ about the beam and the image turns by 2φ';
        ro.set('extra', ex || '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ beam splitters */
  const POLS3 = [['Unpolarized', 'u'], ['s (across the plane of the drawing)', 's'], ['p (in the plane of the drawing)', 'p']];
  Hyper.sim('oc-splitter', {
    title: 'Beam splitters: plate, cube, pellicle and polka-dot',
    blurb: `A beam enters from the left and meets a splitter. The reflected and transmitted beams are drawn as bright as they are; the curve below the picture is the splitter’s reflectance across the visible, for s and p light and on average. The coatings are real stacks of layers, computed layer by layer.

**Try this**
- *Plate*: look for the **ghost**, a faint second reflection from the back face. Fit the anti-reflection coating on the back, or add a wedge, and watch it fade or move away. The transmitted beam is displaced; thicken the plate.
- Switch between *Dielectric* and *Thin metal film*: with the metal the reflected and transmitted shares no longer add to 100 % — the rest is **absorbed**. Move the film thickness to change R:T.
- Choose *polarization* s then p: the three-layer coating at 45° reflects them very differently. A real non-polarizing splitter needs many more layers.
- *Pellicle*: the wavelength curve ripples, because the 2 µm membrane is a thin film that interferes with itself.
- Tick **run it backwards** on a cube: two beams in, two ports out, and half of the total power leaves by the other port.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const plot = kit.plot(box.stage, { x: { label: 'wavelength (nm)', min: 400, max: 700, name: 'λ' }, y: { label: 'reflectance (%)', min: 0, max: 100, name: 'R' }, series: [] }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Splitter', options: [['Plate at an angle', 'plate'], ['Cube', 'cube'], ['Pellicle (a 2 µm membrane)', 'pellicle'], ['Polka-dot plate', 'polka']], value: params.type || 'plate' },
        { id: 'coat', type: 'select', label: 'Coating', options: [['Uncoated', 'none'], ['Dielectric, three layers', 'diel3'], ['Dielectric, one layer', 'diel1'], ['Thin metal film (chromium)', 'metal']], value: params.coat || 'diel3' },
        { id: 'thick', label: 'Metal film thickness', min: 2, max: 25, step: 0.5, value: 6, unit: 'nm' },
        { id: 'cover', label: 'Dot coverage (aluminium)', min: 0.05, max: 0.95, step: 0.01, value: 0.5, fmt: v => Math.round(v * 100) + ' %' },
        { id: 'aoi', label: 'Angle of incidence', min: 30, max: 60, step: 0.5, value: 45, unit: '°' },
        { id: 't', label: 'Plate thickness', min: 1, max: 10, step: 0.5, value: 3, unit: 'mm' },
        { id: 'wedge', label: 'Wedge', min: 0, max: 30, step: 1, value: 0, unit: '′' },
        { id: 'backAR', type: 'check', label: 'Anti-reflection coating on the back face', value: false },
        { id: 'pol', type: 'select', label: 'Polarization', options: POLS3, value: 'u' },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: 550, unit: 'nm' },
        { id: 'comb', type: 'check', label: 'Run it backwards: a second beam B from below', value: false }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['R', 'Reflected'], ['T', 'Transmitted'], ['A', 'Absorbed or lost'], ['ratio', 'Split ratio R : T'], ['sp', 'Reflectance for s / p light'], ['plate', 'Ghost beam · beam shift'], ['comb', 'Combiner outputs']]);
      function sync() {
        const plateLike = V.type === 'plate' || V.type === 'polka';
        ctl.show('coat', V.type !== 'polka'); ctl.show('thick', V.coat === 'metal' && V.type !== 'polka'); ctl.show('cover', V.type === 'polka');
        ctl.show('aoi', V.type !== 'cube'); ctl.show('t', plateLike); ctl.show('wedge', plateLike); ctl.show('backAR', plateLike); ctl.show('comb', !plateLike);
      }
      sync();
      const layersOf = () => V.coat === 'diel3' ? O.film.design('splitter', 550, 'N-BK7').layers : V.coat === 'diel1' ? O.film.design('splitter30', 550, 'N-BK7').layers : V.coat === 'metal' ? [{ n: 'chromium', d: V.thick }] : [];
      /* R, T, A of the splitting surface at wavelength nm and incidence th */
      function spec(nm, th, pol) {
        if (V.type === 'polka') { const r = O.film.stack({ n0: 1, ns: 'aluminium', layers: [] }, nm, th, pol), c = V.cover; return { R: c * r.R, T: 1 - c, A: c * (1 - r.R), Rs: c * r.Rs, Rp: c * r.Rp }; }
        const L = layersOf();
        const def = V.type === 'plate' ? { n0: 1, ns: 'N-BK7', layers: L } : V.type === 'cube' ? { n0: 'N-BK7', ns: 'N-BK7', layers: L } : { n0: 1, ns: 1, layers: L.concat([{ n: 1.5, d: 2000 }]) };
        return O.film.stack(def, nm, th, pol);
      }
      const pct = x => (100 * x).toFixed(x < 0.01 ? 2 : 1) + ' %';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const s = Math.min(W / 112, Hh / 76), o = { x: W * 0.42, y: Hh * 0.5 }, X = x => o.x + s * x, Y = y => o.y - s * y;
        const nm = V.nm, pol = polArg(V.pol), plateLike = V.type === 'plate' || V.type === 'polka';
        const aoi = (V.type === 'cube' ? 45 : V.aoi) * D2R, ray = { nm };
        const sp = spec(nm, aoi, pol), spAvg = spec(nm, aoi), x0 = 40;
        const beam = (pts, frac, w) => { if (frac < 0.0006) return; S.ray(c, pts.map(p => [X(p[0]), Y(p[1])]), { nm, width: 0.8 + 2.2 * Math.sqrt(frac), alpha: 0.28 + 0.72 * Math.min(1, Math.sqrt(frac)), minArrow: 40 }); };
        const say = (p, text, align) => kit.label(c, text, clampv(X(p[0]), 10, W - 10), clampv(Y(p[1]), 14, Hh - 12), { align: align || 'center', color: C.muted, size: 11.5 });
        S.source(c, x0, o.y, { kind: 'laser', dir: 0, size: 9 });
        S.ray(c, [[x0, o.y], [o.x, o.y]], { nm, width: 2.6 });
        let note = '';
        if (plateLike) {
          const L = layersOf().slice().reverse();
          const tr = tracePlate(O, {
            n: O.index('N-BK7', nm), t: V.t, aoi: -aoi, wedge: V.wedge / 60 * D2R, Lout: 40,
            fo: th => spec(nm, Math.abs(th), pol),
            bi: th => O.film.stack({ n0: 'N-BK7', ns: 1, layers: V.backAR ? [{ n: 'MgF2', d: O.film.quarterWave('MgF2', 550) }] : [] }, nm, th, pol),
            fi: th => V.type === 'polka' ? { R: 0.04, T: 0.96 } : O.film.stack({ n0: 'N-BK7', ns: 1, layers: L }, nm, th, pol)
          });
          const px = platePoly(tr, 20).map(p => [X(p[0]), Y(p[1])]);
          S.poly(c, px, { fill: S.glass(0.2) });
          c.save(); c.strokeStyle = V.type === 'polka' ? S.metal() : C.accent; c.lineWidth = V.coat === 'none' && V.type === 'plate' ? 0 : 2.4; if (V.type === 'polka') c.setLineDash([3, 4]); c.beginPath(); c.moveTo(px[0][0], px[0][1]); c.lineTo(px[1][0], px[1][1]); c.stroke(); c.restore();
          const fr = tr.beams.find(b => b.kind === 'front'), mn = tr.beams.find(b => b.kind === 'main'), gh = tr.beams.find(b => b.kind === 'ghost');
          for (const b of tr.beams) { beam(b.pts, b.frac); }
          if (fr) say(fr.pts[1], 'reflected  ' + pct(fr.frac)); if (mn) say(mn.pts[2], 'transmitted  ' + pct(mn.frac), 'right'); if (gh) say(gh.pts[3], 'ghost  ' + pct(gh.frac));
          ro.set('R', pct(tr.fo.R)); ro.set('T', pct(tr.fo.T)); ro.set('A', pct(tr.fo.A != null ? tr.fo.A : Math.max(0, 1 - tr.fo.R - tr.fo.T)));
          ro.set('plate', (gh && fr ? Math.abs(cross(fr.d, gh.P3)).toFixed(2) + ' mm' + (V.wedge > 0 ? ' · ' + (angBetween(gh.d, fr.d) * R2D).toFixed(2) + '° (wedge)' : '') : 'none') + ' · ' + (mn ? Math.abs(cross(mn.d, mn.pts[1])).toFixed(2) + ' mm' : '—'));
        } else {
          const m = [Math.cos(-aoi), Math.sin(-aoi)], dr = reflect([1, 0], m), L = 40;
          if (V.type === 'cube') S.splitter(c, o.x, o.y, 28 * s, {});
          else {
            const u = [-m[1], m[0]], a = [X(-20 * u[0]), Y(-20 * u[1])], b = [X(20 * u[0]), Y(20 * u[1])];
            c.save(); c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore();
            c.save(); c.strokeStyle = S.edge(); c.lineWidth = 1; c.setLineDash([2, 3]); c.strokeRect(Math.min(a[0], b[0]) - 3, Math.min(a[1], b[1]) - 3, Math.abs(b[0] - a[0]) + 6, Math.abs(b[1] - a[1]) + 6); c.restore();
          }
          const R = sp.R, T = sp.T;
          beam([[0, 0], mul(dr, L)], R); beam([[0, 0], [L, 0]], T);
          say(mul(dr, L), 'reflected  ' + pct(R)); say([L, 0], 'transmitted  ' + pct(T), 'right');
          ro.set('R', pct(R)); ro.set('T', pct(T)); ro.set('A', pct(sp.A != null ? sp.A : Math.max(0, 1 - R - T))); ro.set('plate', V.type === 'cube' ? 'none: both outer faces are square to the beams' : 'none: the faces are micrometres apart');
          if (V.comb) {
            const dB = [0, 1], rB = reflect(dB, m);
            S.ray(c, [[X(0), Y(-54)], [X(0), Y(0)]], { nm, width: 2.6 });
            kit.label(c, 'B', X(0) + 10, Y(-48), { color: C.muted }); kit.label(c, 'A', x0 + 22, o.y - 16, { color: C.muted });
            beam([[0, 0], [0, L]], T); beam([[0, 0], mul(rB, L)], R);
            const aligned = Math.abs(cross(dr, [0, 1])) < 1e-6;
            ro.set('comb', aligned ? 'right port ' + (100 * (T + R)).toFixed(0) + ' % of one beam, top port ' + (100 * (R + T)).toFixed(0) + ' % (of 200 % in)' : 'the outputs no longer overlap at this angle');
          } else ro.set('comb', 'tick “run it backwards”');
        }
        ro.set('ratio', (100 * spAvg.R / (spAvg.R + spAvg.T)).toFixed(0) + ' : ' + (100 * spAvg.T / (spAvg.R + spAvg.T)).toFixed(0) + (V.type === 'polka' ? '' : '  (average of s and p)'));
        ro.set('sp', pct(spAvg.Rs) + ' / ' + pct(spAvg.Rp));
        // the curve
        const pr = [], ps = [], pp = [];
        for (let w = 400; w <= 700; w += 5) { const r = spec(w, aoi); pr.push([w, 100 * r.R]); ps.push([w, 100 * r.Rs]); pp.push([w, 100 * r.Rp]); }
        plot.set({ series: [{ pts: pr, label: 'average' }, { pts: ps, label: 's', dash: true }, { pts: pp, label: 'p', dash: true }], vlines: [{ x: nm, label: nm + ' nm' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ polarizing beam splitters */
  Hyper.sim('oc-pbs', {
    title: 'Polarizing beam splitters and the quarter-wave isolator',
    blurb: `A beam meets a polarizing splitter. The cube sends p light (in the plane of the drawing) straight on and s light (across it) upwards; the Wollaston prism sends both on, at two different angles. The numbers use Jones vectors and the extinction ratio you choose.

**Try this**
- Turn the polarization angle from 0° to 90°: the power moves smoothly from one port to the other as cos² and sin². At 45° the two ports share equally.
- Choose *unpolarized* light: half and half, whatever the cube’s orientation.
- Lower the extinction ratio to 100 : 1 and see how much of the wrong polarization leaks into the transmitted port; the reflected port is always the less pure of the two.
- Tick **quarter-wave plate and mirror**: the returning light has been turned from p to s and leaves by the *side* port. The amount returning to the laser is almost nothing: that is the isolator.
- *Wollaston prism*: the splitting angle is about 2 Δn tan α for calcite.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, P = O.pol;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'elem', type: 'select', label: 'Splitter', options: [['Polarizing cube', 'cube'], ['Wollaston prism (calcite)', 'woll']], value: params.elem || 'cube' },
        { id: 'inpol', type: 'select', label: 'Input light', options: [['Linearly polarized, at the angle below', 'lin'], ['Unpolarized', 'unp'], ['Circularly polarized', 'circ']], value: 'lin' },
        { id: 'ang', label: 'Polarization angle from p', min: 0, max: 90, step: 1, value: 30, unit: '°' },
        { id: 'er', type: 'select', label: 'Extinction ratio of the transmitted beam', options: [['100 : 1', 100], ['1000 : 1', 1000], ['10 000 : 1', 10000]], value: 1000 },
        { id: 'wedge', label: 'Wollaston wedge angle', min: 5, max: 45, step: 1, value: 20, unit: '°' },
        { id: 'iso', type: 'check', label: 'Add a quarter-wave plate at 45° and a mirror', value: !!params.iso }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['in', 'Input: p and s shares'], ['T', 'Transmitted port (wanted: p)'], ['Rr', 'Reflected port (wanted: s)'], ['leak', 'Wrong polarization in the ports'], ['back', 'Returning to the laser'], ['side', 'Leaving by the side port']]);
      function sync() { ctl.show('ang', V.inpol === 'lin'); ctl.show('wedge', V.elem === 'woll'); ctl.show('iso', V.elem === 'cube'); }
      sync();
      const sc = (v, k) => v.map(q => [q[0] * k, q[1] * k]), addv = (a, b) => a.map((q, i) => [q[0] + b[i][0], q[1] + b[i][1]]);
      const px = t => P.apply(P.polarizer(t), VEC), pct = x => (100 * x).toFixed(x < 0.001 ? 3 : x < 0.1 ? 2 : 1) + ' %';
      let VEC;
      /* power in each port for one fully polarized input (Jones vector), cube with transmittances Tp, Ts, reflectances Rs, Rp */
      function through(v, c) {
        VEC = v;
        const vt = addv(sc(px(0), Math.sqrt(c.Tp)), sc(px(Math.PI / 2), Math.sqrt(c.Ts)));
        const vr = addv(sc(px(Math.PI / 2), Math.sqrt(c.Rs)), sc(px(0), Math.sqrt(c.Rp)));
        const vb = P.chain(vt, [P.qwp(Math.PI / 4), P.qwp(Math.PI / 4)]);      // there and back through the plate: a half-wave plate at 45°
        VEC = vb;
        const back = P.intensity(addv(sc(px(0), Math.sqrt(c.Tp)), sc(px(Math.PI / 2), Math.sqrt(c.Ts)))), side = P.intensity(addv(sc(px(Math.PI / 2), Math.sqrt(c.Rs)), sc(px(0), Math.sqrt(c.Rp))));
        return { Pt: P.intensity(vt), Pr: P.intensity(vr), back, side };
      }
      const loop = kit.loop(() => {
        const cv = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const s = Math.min(W / 112, Hh / 76), o = { x: W * 0.36, y: Hh * 0.55 }, X = x => o.x + s * x, Y = y => o.y - s * y, nm = 632.8, x0 = 36;
        const ER = V.er, c = { Tp: 0.97, Ts: 0.97 / ER, Rs: 0.99, Rp: 0.99 / Math.max(10, ER / 10) };
        const ins = V.inpol === 'unp' ? [P.vec(0), P.vec(Math.PI / 2)] : [V.inpol === 'circ' ? P.vec('R') : P.vec(V.ang * D2R)];
        const w = 1 / ins.length; let r = { Pt: 0, Pr: 0, back: 0, side: 0 };
        for (const v of ins) { const q = through(v, c); r = { Pt: r.Pt + w * q.Pt, Pr: r.Pr + w * q.Pr, back: r.back + w * q.back, side: r.side + w * q.side }; }
        VEC = ins[0]; let fp = 0, fs = 0;
        for (const v of ins) { VEC = v; fp += w * P.intensity(px(0)); fs += w * P.intensity(px(Math.PI / 2)); }
        const beam = (pts, frac, dash) => { if (frac < 0.0005) return; S.ray(cv, pts.map(p => [X(p[0]), Y(p[1])]), { nm, width: 0.8 + 2.2 * Math.sqrt(frac), alpha: 0.28 + 0.72 * Math.min(1, Math.sqrt(frac)), minArrow: 40, dash: dash }); };
        const say = (p, text, align) => kit.label(cv, text, clampv(X(p[0]), 10, W - 10), clampv(Y(p[1]), 14, Hh - 12), { align: align || 'center', color: C.muted, size: 11.5 });
        S.source(cv, x0, o.y, { kind: 'laser', dir: 0, size: 9 });
        S.ray(cv, [[x0, o.y], [o.x, o.y]], { nm, width: 2.6 });
        kit.label(cv, V.inpol === 'unp' ? 'unpolarized' : V.inpol === 'circ' ? 'circular' : 'linear at ' + V.ang + '° to p', x0 + 6, o.y - 28, { color: C.faint, size: 11 });
        if (V.elem === 'cube') {
          S.splitter(cv, o.x, o.y, 30 * s, {});
          beam([[0, 0], [38, 0]], r.Pt); beam([[0, 0], [0, 38]], r.Pr);
          say([38, 0], 'transmitted (p)  ' + pct(r.Pt), 'right'); say([0, 38], 'reflected (s)  ' + pct(r.Pr));
          if (V.iso) {
            const xm = 62, xq = 38;
            S.polarizer(cv, X(xq), o.y, 13 * s, Math.PI / 4, { label: 'λ/4' }); S.flatMirror(cv, X(xm), Y(-14), X(xm), Y(14));
            beam([[0, 0], [xm, 0]], r.Pt);
            beam([[xm, -1.6], [-1.6, -1.6], [-1.6, -38]], r.side, [6, 4]);
            if (r.back > 0.0005) beam([[-1.6, -1.6], [-40, -1.6]], r.back, [6, 4]);
            say([-1.6, -38], 'side port  ' + pct(r.side), 'center'); say([xm, 16], 'mirror');
          }
          ro.set('leak', 'transmitted port: ' + pct(fs * c.Ts / Math.max(1e-12, r.Pt)) + ' s · reflected port: ' + pct(fp * c.Rp / Math.max(1e-12, r.Pr)) + ' p');
          ro.set('T', pct(r.Pt)); ro.set('Rr', pct(r.Pr));
          ro.set('back', V.iso ? pct(r.back) + ' of the input' : 'add the plate and the mirror'); ro.set('side', V.iso ? pct(r.side) + ' of the input' : '—');
        } else {
          const dn = Math.abs(O.index('calcite-o', 589) - O.index('calcite-e', 589)), dl = 2 * dn * Math.tan(V.wedge * D2R);
          const hw = 12;
          S.poly(cv, [[X(-hw), Y(-hw)], [X(0), Y(-hw)], [X(0), Y(hw)], [X(-hw), Y(hw)]], { fill: S.glass(0.2) });
          S.poly(cv, [[X(0), Y(-hw)], [X(hw * 0.7), Y(-hw)], [X(hw * 0.7), Y(hw)], [X(0), Y(hw)]], { fill: S.glass(0.34) });
          kit.label(cv, 'calcite wedges, axes crossed', X(0), Y(hw) - 12, { align: 'center', color: C.faint, size: 11 });
          const a1 = dl / 2, L = 46;
          beam([[0, 0], [hw * 0.7, 0], [hw * 0.7 + L * Math.cos(a1), L * Math.sin(a1)]], fp);
          beam([[0, 0], [hw * 0.7, 0], [hw * 0.7 + L * Math.cos(a1), -L * Math.sin(a1)]], fs);
          say([hw * 0.7 + L * Math.cos(a1), L * Math.sin(a1)], 'p  ' + pct(fp), 'right'); say([hw * 0.7 + L * Math.cos(a1), -L * Math.sin(a1)], 's  ' + pct(fs), 'right');
          S.angle(cv, X(hw * 0.7), Y(0), 30, -a1, a1, '', {});
          ro.set('T', 'one beam, p: ' + pct(fp)); ro.set('Rr', 'the other beam, s: ' + pct(fs));
          ro.set('leak', 'ideal calcite pair: purity is very high'); ro.set('back', 'divergence ' + (dl * R2D).toFixed(2) + '° (Δn = ' + dn.toFixed(3) + ')'); ro.set('side', '—');
        }
        ro.set('in', pct(fp) + ' p · ' + pct(fs) + ' s');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ diffusers */
  Hyper.sim('oc-diffuser', {
    title: 'Diffusers: how wide, how even, how lossy',
    blurb: `A collimated beam meets a diffuser and leaves as a cone. The rays are drawn with brightness in proportion to the intensity at their angle; the strip at the right is the pattern on a flat screen, and the curves below give the intensity of the diffuser and the illuminance it makes on the screen. The profiles are standard models (a bell, a flat top, a cosine) and the picture is to the scale of the screen distance.

**Try this**
- Compare *engineered, flat-topped* with *ground glass* at the same angle: the flat top lights a disc with sharp edges; the bell is bright in the middle and fades.
- Choose *opal glass*: intensity ∝ cos θ, but on a flat screen the illuminance falls as cos⁴ θ. Check the curve against 56 % at 30°.
- Widen the diffusing angle of a flat-topped diffuser to 90° and watch the screen: the edge of the disc is much dimmer than the centre, because the screen is slanted and far away there.
- Move the screen: the disc grows in proportion to the distance, and its angle stays the same.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      const plot = kit.plot(box.stage, { x: { label: 'angle from the axis (°)', min: -90, max: 90, name: 'θ' }, y: { label: 'relative to the peak', min: 0, max: 1.05, name: 'I' }, series: [] }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Diffuser', options: [['Ground glass (bell-shaped)', 'ground'], ['Opal glass (Lambertian)', 'opal'], ['Engineered, bell-shaped', 'gauss'], ['Engineered, flat-topped', 'tophat']], value: params.kind || 'tophat' },
        { id: 'ang', label: 'Diffusing angle (full width at half maximum)', min: 2, max: 90, step: 1, value: params.ang || 30, unit: '°' },
        { id: 'L', label: 'Distance to the screen', min: 20, max: 500, value: 100, log: true, sig: 3, unit: 'mm' }
      ], () => { ctl.show('ang', V.kind !== 'opal'); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ang', 'Diffusing angle (FWHM)'], ['T', 'Typical transmission of this kind'], ['D', 'Lit disc on the screen (half brightness)'], ['E30', 'Screen illuminance 30° off axis'], ['cos4', 'Check: cos⁴ 30°']]);
      const prof = (th) => {                           // relative intensity at the angle th (rad) from the axis
        const t = Math.abs(th) * R2D;
        if (V.kind === 'opal') return Math.abs(th) < Math.PI / 2 ? Math.cos(th) : 0;
        if (V.kind === 'tophat') { const h = V.ang / 2, e = Math.max(0.5, h * 0.08); return t <= h - e ? 1 : t >= h + e ? 0 : 0.5 * (1 + Math.cos(Math.PI * (t - (h - e)) / (2 * e))); }
        return Math.pow(2, -Math.pow(2 * t / V.ang, 2));
      };
      const screenE = th => prof(th) * Math.pow(Math.cos(th), 3);          // a flat screen: one cosine fewer than the cos⁴ of a Lambertian source
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const X0 = W * 0.16, X1 = W * 0.78, u = X1 - X0, cy = Hh / 2, nm = 532;
        S.ray(c, [[16, cy], [X0, cy]], { nm, width: 3, minArrow: 50 });
        c.save(); c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(X0, cy - Hh * 0.42); c.lineTo(X0, cy + Hh * 0.42); c.stroke(); c.restore();
        c.save(); c.fillStyle = S.glass(0.3); c.fillRect(X0 - 3, cy - Hh * 0.42, 6, Hh * 0.84); c.restore();
        kit.label(c, 'diffuser', X0, cy - Hh * 0.42 - 10, { align: 'center', color: C.muted, size: 11.5 });
        let thMax = 0; for (let t = 0; t < 89.5; t += 0.5) if (prof(t * D2R) > 0.02) thMax = t;
        thMax = Math.max(thMax, 3);
        for (let i = -9; i <= 9; i++) {
          const th = thMax * D2R * i / 9, I = prof(th); if (I < 0.01) continue;
          const yy = cy - u * Math.tan(th), yEnd = clampv(yy, 2, Hh - 2);
          S.ray(c, [[X0, cy], [Math.abs(yy - yEnd) > 0.5 ? X0 + (X1 - X0) * (cy - yEnd) / (cy - yy) : X1, yEnd]], { nm, width: 1 + 1.2 * I, alpha: 0.12 + 0.88 * Math.sqrt(I), arrows: false });
        }
        // the screen and the pattern on it
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(X1, 0, 16, Hh); c.restore();
        S.fringes(c, X1 + 1, 1, 14, Hh - 2, uu => screenE(Math.atan((uu * (Hh - 2) + 1 - cy) / u * 1)), { nm, vertical: true, gamma: 0.6, step: 1 });
        kit.label(c, 'screen', X1 + 8, 12, { align: 'center', color: C.muted, size: 11 });
        S.dim(c, X0, Hh - 14, X1, Hh - 14, 'L = ' + kit.fmt(V.L, 3) + ' mm', { off: -9 });
        // numbers
        let th50 = 0; for (let t = 0; t < 89.5; t += 0.1) { if (screenE(t * D2R) >= 0.5) th50 = t; else if (t > th50 + 0.5) break; }
        ro.set('ang', V.kind === 'opal' ? '120° (Lambertian: ½ at 60°)' : V.ang.toFixed(0) + '°');
        ro.set('T', { ground: '80–90 %', opal: '30–60 %', gauss: 'above 85 %', tophat: 'above 85 %' }[V.kind]);
        ro.set('D', th50 > 0 ? (2 * V.L * Math.tan(th50 * D2R)).toFixed(1) + ' mm  (half-angle ' + th50.toFixed(1) + '°)' : 'less than a millimetre');
        ro.set('E30', (100 * screenE(30 * D2R)).toFixed(0) + ' % of the centre');
        ro.set('cos4', (100 * O.cam.cos4(30 * D2R)).toFixed(0) + ' %  (Lambertian on a flat screen)');
        const pi = [], pe = [];
        for (let t = -90; t <= 90; t += 1) { pi.push([t, prof(t * D2R)]); pe.push([t, screenE(t * D2R)]); }
        plot.set({ series: [{ pts: pi, label: 'intensity from the diffuser' }, { pts: pe, label: 'illuminance on a flat screen', dash: true }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ catalogue lenses */
  Hyper.sim('oc-lenses', {
    title: 'Catalogue lenses: shape, orientation and the two distances',
    blurb: `The same 100 mm focal length in seven catalogue forms, traced ray by ray through N-BK7 (and a flint for the doublet). The inset is the focus magnified, with the dashed Airy disc that diffraction allows; the bars below compare the RMS blur of all seven for the distances you chose, on a logarithmic scale.

**Try this**
- *Infinite object → focus*: compare *plano-convex, curved side first* with *flat side first*: four times the blur just by turning the lens round. The achromat and the asphere sit near or below the Airy disc.
- Switch to *1:1 relay*: now the biconvex lens wins among the singlets and the plano-convex lens, a good collimator, is poor. The achromat is designed for infinity and gains nothing.
- Close the aperture to f/8: every blur shrinks fast (spherical aberration goes as the cube of the aperture) and diffraction takes over.
- Change the colour: the singlets move their focus; the achromat hardly moves.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const st2 = kit.stage(box.stage, { aspect: 0.28, minH: 170, maxH: 210 });
      const TYPES = [['Plano-convex, curved side first', 'pcx'], ['Plano-convex, flat side first', 'pcxr'], ['Biconvex', 'bi'], ['Best-form singlet', 'best'], ['Positive meniscus', 'men'], ['Achromatic doublet', 'ach'], ['Asphere (hyperbola), flat side first', 'asph']];
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Lens', options: TYPES, value: params.type || 'pcx' },
        { id: 'conj', type: 'select', label: 'Distances', options: [['Object at infinity: collimate or focus', 'inf'], ['1:1 relay: object and image at 2f', 'one']], value: params.conj || 'inf' },
        { id: 'N', label: 'f-number', min: 2.5, max: 10, value: 4, log: true, sig: 3, fmt: v => 'f/' + kit.fmt(v, 3) },
        { id: 'nm', type: 'select', label: 'Light', options: [['Blue, 480 nm', 480], ['Yellow, 587.6 nm', 587.56], ['Red, 650 nm', 650]], value: 587.56 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['efl', 'Focal length'], ['fw', 'Working f-number'], ['rms', 'RMS blur at best focus'], ['airy', 'Airy disc, diameter'], ['who', 'What limits the image']]);
      const f0 = 100;
      function build(id, N, conj) {
        const D = f0 / N, glass = 'N-BK7', n = O.index(glass, 587.56);
        let sys;
        if (id === 'ach') sys = O.design.achromat({ f: f0, D });
        else if (id === 'asph') { const R = f0 * (n - 1), h = D / 2, sag = R - Math.sqrt(R * R - h * h); sys = { surfaces: [{ R: 0, t: 2.5 + sag, n: glass, sd: h, stop: true }, { R: -R, k: -n * n, n: 1, sd: h }] }; }
        else sys = O.design.singlet({ f: f0, q: { pcx: 1, pcxr: -1, bi: 0, best: O.bestFormShape(n), men: 2.2 }[id], D, glass });
        sys.surfaces[sys.surfaces.length - 1].sd *= 1.12;
        if (conj === 'one') sys.object = 2 * f0;
        return sys;
      }
      function measure(id) {
        const sys = build(id, V.N, V.conj), bf = Sy.bestFocus(sys, { nm: V.nm, rings: 4 }), spot = Sy.spot(sys, { nm: V.nm, rings: 4, z: bf.z });
        return { sys, bf, spot };
      }
      let cacheKey = '', bars = [];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, nm = V.nm;
        const key = V.conj + '|' + V.N + '|' + nm;
        if (key !== cacheKey) { cacheKey = key; bars = TYPES.map(t => { const r = measure(t[1]); return { id: t[1], name: t[0], rms: 2 * r.spot.rms * 1e3, lost: r.spot.lost }; }); }
        const { sys, bf, spot } = measure(V.type), par = Sy.paraxial(sys, nm);
        const D = f0 / V.N, one = V.conj === 'one', inset = Math.min(60, Hh * 0.2);
        const zMin = one ? -2 * f0 - 12 : -55, zMax = one ? 2 * f0 + 14 : bf.z + 12;
        const m = S.map(st, zMin, zMax, Math.max(D / 2 * 1.3, 14), { right: 2 * inset + 40, left: 14 });
        S.axis(c, m.X(zMin), m.y0, m.X(zMax));
        S.system(c, sys, m);
        S.rays(c, Sy.fan2d(sys, { nm, n: 9, zStart: one ? -2 * f0 : -50 }), m, { nm });
        S.screen(c, m.X(bf.z), m.y0, m.s * 8, { label: 'best focus' });
        if (one) S.object(c, m.X(-2 * f0), m.y0, m.s * 4, { label: 'object' });
        // the focus, magnified, with the Airy disc
        const airyR = O.diff.airyRadius(nm, par.fnoWorking) * 1e3;                      // mm
        const half = Math.max(0.005, Math.min(2.5, 2.4 * Math.max(spot.geo, airyR)));
        const ix = W - inset - 14, iy = Hh / 2;
        c.fillStyle = C.surface; c.fillRect(ix - inset, iy - inset, 2 * inset, 2 * inset);
        S.spot(c, spot, ix, iy, inset, inset / half, { airy: airyR, nm });
        kit.label(c, 'the focus', ix, iy - inset - 10, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'box ' + (half * 2 * 1000 < 10 ? (half * 2000).toFixed(1) : (half * 2000).toFixed(0)) + ' µm', ix, iy + inset + 12, { align: 'center', color: C.faint, size: 11 });
        // the bars
        const d = st2.begin(), W2 = st2.W, H2 = st2.H, lx = 4, bx = W2 * 0.36, bw = W2 * 0.6, rowH = (H2 - 26) / bars.length, lg = v => Math.log10(Math.max(1, v)) / Math.log10(5000);
        for (let k = 0; k < 4; k++) { const xx = bx + bw * lg(Math.pow(10, k)); d.strokeStyle = C.grid; d.lineWidth = 1; d.beginPath(); d.moveTo(xx, 4); d.lineTo(xx, H2 - 20); d.stroke(); kit.label(d, [1, 10, 100, 1000][k] + ' µm', xx, H2 - 9, { align: 'center', color: C.faint, size: 10.5 }); }
        bars.forEach((b, i) => {
          const y = 6 + i * rowH, sel = b.id === V.type;
          d.fillStyle = sel ? C.accent : C.series[1]; d.globalAlpha = sel ? 1 : 0.55; d.fillRect(bx, y + 2, Math.max(2, bw * lg(b.rms)), rowH - 5); d.globalAlpha = 1;
          kit.label(d, b.name, lx, y + rowH / 2, { size: 11.5, color: sel ? C.text : C.muted, weight: sel ? 650 : 500 });
          kit.label(d, b.rms < 10 ? b.rms.toFixed(1) : b.rms.toFixed(0) + (b.lost ? '*' : ''), bx + Math.max(2, bw * lg(b.rms)) + 5, y + rowH / 2, { size: 11, color: C.muted });
        });
        const ax = bx + bw * lg(2 * airyR * 1e3);
        d.save(); d.strokeStyle = C.warn; d.setLineDash([4, 3]); d.beginPath(); d.moveTo(ax, 2); d.lineTo(ax, H2 - 20); d.stroke(); d.restore();
        kit.label(d, 'Airy disc', ax + 4, 10, { size: 10.5, color: C.warn });
        const rmsD = 2 * spot.rms * 1e3;
        ro.set('efl', par.efl.toFixed(1) + ' mm');
        ro.set('fw', 'f/' + par.fnoWorking.toFixed(2));
        ro.set('rms', (rmsD < 10 ? rmsD.toFixed(1) : rmsD.toFixed(0)) + ' µm' + (spot.lost ? '  (some rays lost)' : ''));
        ro.set('airy', (2 * airyR * 1e3).toFixed(1) + ' µm');
        ro.set('who', spot.geo < airyR ? 'diffraction: the lens is good enough here' : 'spherical aberration, ' + (rmsD / (2 * airyR * 1e3)).toFixed(0) + ' times the Airy disc');
      }, box.stage);
      st.onResize(() => loop.once()); st2.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ iris and pinhole */
  Hyper.sim('oc-iris', {
    title: 'An iris and a pinhole',
    blurb: `**Iris**: the leaves leave a polygonal opening. The read-out gives the f-number it makes with a lens of the focal length you choose, how many stops it is closed from fully open, and how much light is left; the small picture is what an out-of-focus point of light looks like through it.

**Pinhole**: the opening is so small that the light spreads. The picture on the right is the pattern on a screen, drawn to its true proportions (the pinhole and the angle of the cone are drawn larger than life).

**Try this**
- Close the iris: area (and light) falls as the square of the diameter, so f/2 to f/8 is four stops, a sixteenth of the light. Reduce the blades to 5, then tick *rounded blades*, and watch the highlight.
- Choose *Pinhole*, make it smaller: the central disc grows in proportion to 1/d.
- Move the screen close to the hole: when the Fresnel number is no longer small, the read-out says the pattern is not yet the far-field one.
- Change the wavelength: red spreads more than blue.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Part', options: [['Iris diaphragm', 'iris'], ['Pinhole in a laser beam', 'pin']], value: params.mode || 'iris' },
        { id: 'blades', label: 'Blades', min: 5, max: 12, step: 1, value: 6 },
        { id: 'round', type: 'check', label: 'Rounded blades (a circular opening)', value: false },
        { id: 'D', label: 'Opening (diameter of the circle of equal area)', min: 1, max: 25, step: 0.1, value: 12, unit: 'mm' },
        { id: 'f', label: 'Focal length of the lens it serves', min: 10, max: 200, step: 1, value: 50, unit: 'mm' },
        { id: 'd', label: 'Pinhole diameter', min: 5, max: 1000, value: 50, log: true, sig: 3, unit: 'µm' },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: 633, unit: 'nm' },
        { id: 'L', label: 'Distance to the screen', min: 0.02, max: 5, value: 1, log: true, sig: 3, unit: 'm' }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Opening'], ['N', 'f-number with this lens'], ['stop', 'Nearest marked stop'], ['closed', 'Stops closed from 25 mm'], ['light', 'Light passed, compared with 25 mm'], ['airy', 'Airy disc of the lens (green)'],
        ['w', 'Central disc on the screen'], ['half', 'Half-angle of the cone'], ['NF', 'Fresnel number'], ['far', 'Far-field pattern?']]);
      function sync() {
        const iris = V.mode === 'iris';
        for (const k of ['blades', 'round', 'D', 'f']) ctl.show(k, iris);
        for (const k of ['d', 'nm', 'L']) ctl.show(k, !iris);
        for (const k of ['a', 'N', 'stop', 'closed', 'light', 'airy']) ro.show(k, iris);
        for (const k of ['w', 'half', 'NF', 'far']) ro.show(k, !iris);
      }
      sync();
      const STOPS = [1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32, 45, 64];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (V.mode === 'iris') {
          const N = Math.round(V.blades), A = Math.PI * Math.pow(V.D / 2, 2), r = V.round ? V.D / 2 : Math.sqrt(2 * A / (N * Math.sin(2 * Math.PI / N)));
          const cx = W * 0.3, cy = Hh * 0.46, Ro = Math.min(W * 0.26, Hh * 0.4), k = Ro * 0.8 / 12.5 / 1.0;
          const poly = []; for (let i = 0; i < N; i++) { const a = 2 * Math.PI * i / N - Math.PI / 2; poly.push([cx + k * r * Math.cos(a), cy + k * r * Math.sin(a)]); }
          c.save(); c.fillStyle = C.dark ? '#232844' : '#aeb6cc'; c.strokeStyle = C.text; c.lineWidth = 1.5;
          c.beginPath(); c.arc(cx, cy, Ro, 0, 2 * Math.PI);
          if (V.round) c.arc(cx, cy, k * r, 0, 2 * Math.PI, true); else { poly.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); }
          c.fill('evenodd'); c.stroke(); c.restore();
          if (!V.round) { c.save(); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); for (let i = 0; i < N; i++) { const a = poly[i], b = poly[(i + 1) % N], e = unit(sub(b, a)); c.moveTo(a[0] - e[0] * Ro * 0.7, a[1] - e[1] * Ro * 0.7); c.lineTo(a[0], a[1]); } c.stroke(); c.restore(); }
          c.save(); c.fillStyle = C.dark ? '#f3f6ff' : '#fff'; c.beginPath(); if (V.round) c.arc(cx, cy, k * r - 1, 0, 2 * Math.PI); else poly.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.globalAlpha = 0.85; c.fill(); c.restore();
          kit.label(c, 'the opening, to scale (the rim is 25 mm)', cx, cy + Ro + 16, { align: 'center', color: C.muted, size: 11.5 });
          // the highlight an out-of-focus point makes
          const hx = W * 0.72, hy = Hh * 0.3, hr = Math.min(40, Hh * 0.13);
          c.save(); c.fillStyle = C.dark ? '#14182e' : '#e3e7f3'; c.fillRect(hx - 70, hy - 52, 140, 104); c.fillStyle = '#ffd98a'; c.beginPath();
          if (V.round) c.arc(hx, hy, hr, 0, 2 * Math.PI); else for (let i = 0; i < N; i++) { const a = 2 * Math.PI * i / N - Math.PI / 2; const x = hx + hr * 1.05 * Math.cos(a), y = hy + hr * 1.05 * Math.sin(a); i ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.closePath(); c.fill(); c.restore();
          kit.label(c, 'an out-of-focus highlight', hx, hy + 66, { align: 'center', color: C.muted, size: 11.5 });
          // the stops scale
          const sx0 = W * 0.52, sx1 = W - 24, sy = Hh * 0.78, lg = v => Math.log2(clampv(v, 1, 64)) / 6, Nn = V.f / V.D;
          c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(sx0, sy); c.lineTo(sx1, sy); c.stroke(); c.restore();
          for (const n of STOPS) { const x = sx0 + (sx1 - sx0) * lg(n); c.save(); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(x, sy - 5); c.lineTo(x, sy + 5); c.stroke(); c.restore(); kit.label(c, String(n), x, sy + 17, { align: 'center', color: C.faint, size: 10.5 }); }
          const mx = sx0 + (sx1 - sx0) * lg(Nn); c.save(); c.fillStyle = C.accent; c.beginPath(); c.moveTo(mx, sy - 6); c.lineTo(mx - 6, sy - 18); c.lineTo(mx + 6, sy - 18); c.closePath(); c.fill(); c.restore();
          kit.label(c, 'f/' + (Nn < 10 ? Nn.toFixed(1) : Nn.toFixed(0)), mx, sy - 28, { align: 'center', color: C.text, size: 12, weight: 650 });
          const near = STOPS.reduce((a, b) => Math.abs(Math.log(b / Nn)) < Math.abs(Math.log(a / Nn)) ? b : a);
          ro.set('a', V.D.toFixed(1) + ' mm  (corners ' + r.toFixed(1) + ' mm from the centre, ' + N + (V.round ? ' round blades)' : ' blades)'));
          ro.set('N', 'f/' + Nn.toFixed(2)); ro.set('stop', 'f/' + near); ro.set('closed', (2 * Math.log2(25 / V.D)).toFixed(1) + ' stops'); ro.set('light', (100 * Math.pow(V.D / 25, 2)).toFixed(1) + ' %');
          ro.set('airy', (2.44 * 0.55 * Nn).toFixed(1) + ' µm  (2.44 λ N)');
        } else {
          const nm = V.nm, d = V.d * 1e-6, Lm = V.L, r1 = 1.22 * nm * 1e-9 * Lm / d;       // m: radius of the first dark ring
          const bx = W * 0.14, cy = Hh * 0.5, px = W * 0.5, size = Math.min(W * 0.4, Hh * 0.8), py = cy - size / 2;
          S.ray(c, [[12, cy], [bx, cy]], { nm, width: 22, alpha: 0.35, arrows: false });
          S.ray(c, [[12, cy], [bx, cy]], { nm, width: 2, arrows: false });
          S.slits(c, bx, cy, Hh * 0.42, [[cy - 3, cy + 3]], { w: 6 });
          c.save(); c.fillStyle = S.nm(nm, 0.16); c.beginPath(); c.moveTo(bx, cy - 3); c.lineTo(px, py); c.lineTo(px, py + size); c.lineTo(bx, cy + 3); c.closePath(); c.fill(); c.restore();
          kit.label(c, 'pinhole ' + kit.fmt(V.d, 3) + ' µm', bx, cy - Hh * 0.42 - 10, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, '(hole and angle drawn larger than life)', bx + 40, cy + Hh * 0.42 + 14, { align: 'left', color: C.faint, size: 10.5 });
          const span = 2 * 4.7 * r1;
          S.image(c, px, py, size, size, 140, 140, (u, v) => { const r = Math.hypot(u - 0.5, v - 0.5) * span, x = Math.PI * d * r / (nm * 1e-9 * Lm); return O.diff.airy(x); }, { nm, gamma: 0.42, key: [nm, V.d, V.L].join('|'), id: 'airy' });
          c.save(); c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(px, py, size, size); c.restore();
          const wmm = 2 * r1 * 1000, fmmScale = size / (span * 1000);
          S.dim(c, px + size / 2 - r1 * 1000 * fmmScale, py + size + 14, px + size / 2 + r1 * 1000 * fmmScale, py + size + 14, (wmm < 10 ? wmm.toFixed(2) : wmm.toFixed(1)) + ' mm', { off: 13 });
          kit.label(c, 'the screen, ' + (span * 1000 < 10 ? (span * 1000).toFixed(2) : (span * 1000).toFixed(1)) + ' mm across', px + size / 2, py - 10, { align: 'center', color: C.muted, size: 11.5 });
          const NF = O.diff.fresnelNumber(d / 2, Lm, nm);
          ro.set('w', (wmm < 10 ? wmm.toFixed(2) : wmm.toFixed(1)) + ' mm  (2.44 λL/d)'); ro.set('half', (1.22 * nm * 1e-9 / d * 1000).toFixed(2) + ' mrad (' + (Math.asin(Math.min(1, 1.22 * nm * 1e-9 / d)) * R2D).toFixed(2) + '°)');
          ro.set('NF', NF.toPrecision(2)); ro.set('far', NF < 0.1 ? 'yes: the Airy pattern holds' : NF < 1 ? 'roughly' : 'no: the screen is in the near field');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ isolators and modulators */
  Hyper.sim('oc-modulator', {
    title: 'Isolators and modulators: Faraday, Pockels and acousto-optic',
    blurb: `Three ways to act on a beam with an outside signal. The drawings are schematic; every number comes from Jones calculus (the isolator and the Pockels cell) or from the Bragg relations (the acousto-optic cell).

**Try this**
- *Faraday isolator*: forward, the light goes through; on the way back it is turned another 45° and blocked. Now choose the *reciprocal* rotator (quartz, sugar): the return light is turned back and gets through — no isolation. Set the rotation to 40° or 50° and see how isolation depends on the exact angle.
- *Pockels cell*: raise the voltage from 0 to Vπ and back: dark, bright, dark again at 2 Vπ. Switch to parallel polarizers and the curve inverts.
- *Acousto-optic cell*: change the frequency to steer the first order; raise the RF power to the peak (the efficiency tops out at about 85 %). Use fused silica and the deflection almost vanishes: the sound is much faster. Make the beam narrower and the rise time shortens.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, P = O.pol;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const plot = kit.plot(box.stage, { x: { label: 'voltage ÷ half-wave voltage', min: 0, max: 2, name: 'V/Vπ' }, y: { label: 'transmission', min: 0, max: 1.05, name: 'T' }, series: [] }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'dev', type: 'select', label: 'Device', options: [['Faraday isolator', 'iso'], ['Pockels cell between polarizers', 'pock'], ['Acousto-optic modulator', 'aom']], value: params.dev || 'iso' },
        { id: 'rotator', type: 'select', label: 'The rotator is', options: [['Faraday (non-reciprocal)', 'far'], ['Quartz or sugar solution (reciprocal)', 'rec']], value: 'far' },
        { id: 'rot', label: 'Rotation of the rotator', min: 0, max: 90, step: 1, value: 45, unit: '°' },
        { id: 'V', label: 'Voltage ÷ Vπ', min: 0, max: 2, step: 0.01, value: 0.5, sig: 3 },
        { id: 'cfg', type: 'select', label: 'Polarizers', options: [['Crossed (a shutter, dark at 0 V)', 'x'], ['Parallel (open at 0 V)', 'p']], value: 'x' },
        { id: 'f', label: 'Acoustic frequency', min: 40, max: 200, step: 1, value: 80, unit: 'MHz' },
        { id: 'pw', label: 'RF power ÷ power for the peak', min: 0, max: 1.6, step: 0.01, value: 1, sig: 3 },
        { id: 'med', type: 'select', label: 'Crystal', options: [['TeO₂, slow shear wave (650 m/s)', 650], ['Fused silica, longitudinal (5960 m/s)', 5960]], value: 650 },
        { id: 'D', label: 'Beam diameter in the crystal', min: 0.1, max: 2, step: 0.05, value: 0.5, unit: 'mm' }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const roI = kit.readout(box.side, [['a', 'Forward transmission'], ['b', 'Returning to the laser'], ['c', 'Isolation'], ['d', 'The rotation']]);
      const roP = kit.readout(box.side, [['a', 'Transmission'], ['b', 'Retardation'], ['c', 'Law'], ['d', 'Voltage needed'], ['e', 'Speed']]);
      const roA = kit.readout(box.side, [['a', 'Deflection of the first order'], ['b', 'Bragg angle'], ['c', 'Efficiency'], ['d', 'Optical frequency'], ['e', 'Rise time']]);
      function sync() { const d = V.dev; ctl.show('rotator', d === 'iso'); ctl.show('rot', d === 'iso'); ctl.show('V', d === 'pock'); ctl.show('cfg', d === 'pock'); for (const k of ['f', 'pw', 'med', 'D']) ctl.show(k, d === 'aom'); roI.show(d === 'iso'); roP.show(d === 'pock'); roA.show(d === 'aom'); if (plot.cv && plot.cv.style) plot.cv.style.display = d === 'pock' ? '' : 'none'; }
      sync();
      const nmL = 650, pct = x => (100 * x).toFixed(x < 0.001 ? 3 : x < 0.1 ? 2 : 1) + ' %';
      const mark = (c, x, y, ang, C) => { c.save(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.arc(x, y, 9, 0, 2 * Math.PI); c.stroke(); c.beginPath(); c.moveTo(x - 9 * Math.cos(ang), y + 9 * Math.sin(ang)); c.lineTo(x + 9 * Math.cos(ang), y - 9 * Math.sin(ang)); c.stroke(); c.restore(); };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cy = Hh * 0.5;
        const beam = (x1, x2, y, frac, dash) => { if (frac < 0.0005) return; S.ray(c, [[x1, y], [x2, y]], { nm: nmL, width: 0.8 + 2.4 * Math.sqrt(frac), alpha: 0.3 + 0.7 * Math.min(1, Math.sqrt(frac)), minArrow: 60, dash }); };
        if (V.dev === 'iso') {
          const rot = V.rot * D2R, sg = V.rotator === 'far' ? 1 : -1;
          const x0 = 40, xp1 = W * 0.28, xr = W * 0.5, xp2 = W * 0.72, yF = cy - 26, yB = cy + 26;
          const fwd = P.chain(P.vec(0), [P.polarizer(0), P.rotator(rot), P.polarizer(Math.PI / 4)]);
          const afterRot = P.chain(P.vec(0), [P.polarizer(0), P.rotator(rot)]);
          const bAfterRot = P.chain(P.vec(Math.PI / 4), [P.rotator(sg * rot)]);
          const back = P.chain(P.vec(Math.PI / 4), [P.rotator(sg * rot), P.polarizer(0)]);
          const Tf = P.intensity(fwd), Tb = P.intensity(back);
          S.polarizer(c, xp1, cy, 46, 0, { label: 'polarizer 0°' }); S.polarizer(c, xp2, cy, 46, Math.PI / 4, { label: 'polarizer 45°' });
          c.save(); c.fillStyle = S.glass(0.35); c.strokeStyle = S.edge(); c.lineWidth = 1.4; c.fillRect(xr - 22, cy - 40, 44, 80); c.strokeRect(xr - 22, cy - 40, 44, 80); c.restore();
          kit.label(c, V.rotator === 'far' ? 'Faraday rotator + magnet' : 'natural rotator (quartz)', xr, cy + 58, { align: 'center', color: C.muted, size: 11.5 });
          beam(x0, xp1, yF, 1); beam(xp1, xr - 22, yF, 1); beam(xr + 22, xp2, yF, 1); beam(xp2, W - 20, yF, Tf);
          mark(c, (x0 + xp1) / 2, yF - 22, 0, C); mark(c, (xp1 + xr) / 2, yF - 22, 0, C); mark(c, (xr + xp2) / 2, yF - 22, rot, C); mark(c, (xp2 + W - 20) / 2, yF - 22, Math.PI / 4, C);
          beam(W - 20, xp2, yB, 1, [6, 4]); beam(xp2, xr + 22, yB, 1, [6, 4]); beam(xr - 22, xp1, yB, P.intensity(bAfterRot), [6, 4]); beam(xp1, x0, yB, Tb, [6, 4]);
          mark(c, (xp2 + W - 20) / 2, yB + 22, Math.PI / 4, C); mark(c, (xr + xp2) / 2, yB + 22, Math.PI / 4, C); mark(c, (xp1 + xr) / 2, yB + 22, Math.PI / 4 + sg * rot, C);
          kit.label(c, 'forward ' + pct(Tf), W - 24, yF - 44, { align: 'right', color: C.text, size: 12, weight: 650 });
          kit.label(c, 'returning: ' + pct(Tb) + ' gets back to the laser', xp1 - 30, yB + 44, { align: 'right', color: C.text, size: 12, weight: 650 });
          kit.label(c, 'polarization drawn end-on: the line is the plane of the electric field', 14, Hh - 12, { color: C.faint, size: 11 });
          roI.set('a', pct(Tf)); roI.set('b', Tb < 1e-6 ? 'below 0.0001 %' : pct(Tb)); roI.set('c', Tb < 1e-6 ? 'above 60 dB' : (-10 * Math.log10(Tb)).toFixed(1) + ' dB'); roI.set('d', V.rotator === 'far' ? 'adds on the return trip' : 'undoes itself on the return trip');
        } else if (V.dev === 'pock') {
          const x0 = 40, xp = W * 0.28, xc = W * 0.5, xa = W * 0.72, delta = Math.PI * V.V;
          const T = P.intensity(P.chain(P.vec('H'), [P.retarder(delta, Math.PI / 4), P.polarizer(V.cfg === 'x' ? Math.PI / 2 : 0)]));
          S.polarizer(c, xp, cy, 46, 0, { label: 'polarizer' }); S.polarizer(c, xa, cy, 46, V.cfg === 'x' ? Math.PI / 2 : 0, { label: 'analyser' });
          c.save(); c.fillStyle = S.glass(0.35); c.strokeStyle = S.edge(); c.lineWidth = 1.4; c.fillRect(xc - 24, cy - 28, 48, 56); c.strokeRect(xc - 24, cy - 28, 48, 56); c.fillStyle = C.warn; c.fillRect(xc - 24, cy - 30, 48, 3); c.fillRect(xc - 24, cy + 27, 48, 3); c.restore();
          kit.label(c, 'Pockels crystal', xc, cy + 52, { align: 'center', color: C.muted, size: 11.5 }); kit.label(c, V.V.toFixed(2) + ' Vπ', xc, cy - 46, { align: 'center', color: C.warn, size: 12, weight: 650 });
          beam(x0, xp, cy, 1); beam(xp, xc - 24, cy, 1); beam(xc + 24, xa, cy, 1); beam(xa, W - 20, cy, T);
          kit.label(c, 'out: ' + pct(T), W - 24, cy - 40, { align: 'right', color: C.text, size: 12, weight: 650 });
          const pts = []; for (let v = 0; v <= 2.001; v += 0.02) { const t = P.intensity(P.chain(P.vec('H'), [P.retarder(Math.PI * v, Math.PI / 4), P.polarizer(V.cfg === 'x' ? Math.PI / 2 : 0)])); pts.push([v, t]); }
          plot.set({ series: [{ pts, label: 'transmission' }], marks: [{ x: V.V, y: T, label: pct(T) }] });
          roP.set('a', pct(T)); roP.set('b', (delta * R2D).toFixed(0) + '° (180° at Vπ)'); roP.set('c', V.cfg === 'x' ? 'sin²(πV / 2Vπ)' : 'cos²(πV / 2Vπ)'); roP.set('d', 'kilovolts for a bulk cell'); roP.set('e', 'nanoseconds');
        } else {
          const med = V.med, nm = 633, fr = V.f * 1e6, th = nm * 1e-9 * fr / med, thB = th / 2, eff = 0.85 * Math.pow(Math.sin(Math.PI / 2 * Math.sqrt(V.pw)), 2);
          const cx = W * 0.4, bw = W * 0.22, bh = Hh * 0.36;
          S.block(c, cx - bw / 2, cy - bh / 2, bw, bh, { fill: S.glass(0.3) });
          c.save(); c.fillStyle = C.warn; c.fillRect(cx - bw / 2, cy + bh / 2 - 3, bw, 6); c.restore();
          kit.label(c, 'transducer (RF ' + V.f + ' MHz)', cx, cy + bh / 2 + 18, { align: 'center', color: C.warn, size: 11.5 });
          const lamPx = clampv(bh * 0.22, 8, 30);
          for (let i = 0; i < 5; i++) { const yy = cy + bh / 2 - 12 - i * lamPx; c.save(); c.strokeStyle = C.warn; c.globalAlpha = 0.25 + 0.15 * Math.min(1.6, V.pw); c.lineWidth = 1.4; c.beginPath(); c.moveTo(cx - bw / 2 + 6, yy); c.lineTo(cx + bw / 2 - 6, yy); c.stroke(); c.restore(); }
          kit.label(c, 'sound', cx + bw / 2 + 6, cy + bh / 2 - 30, { color: C.warn, size: 11 });
          S.ray(c, [[18, cy - Math.tan(thB) * (cx - 18)], [cx, cy]], { nm, width: 2.6, minArrow: 60 });
          if (1 - eff > 0.0005) S.ray(c, [[cx, cy], [W - 16, cy + Math.tan(thB) * (W - 16 - cx)]], { nm, width: 0.8 + 2.4 * Math.sqrt(1 - eff), alpha: 0.3 + 0.7 * Math.sqrt(1 - eff), minArrow: 60 });
          if (eff > 0.0005) S.ray(c, [[cx, cy], [W - 16, cy - Math.tan(thB) * (W - 16 - cx)]], { nm, width: 0.8 + 2.4 * Math.sqrt(eff), alpha: 0.3 + 0.7 * Math.sqrt(eff), minArrow: 60 });
          c.save(); c.setLineDash([3, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(cx, cy); c.lineTo(W - 16, cy); c.stroke(); c.restore();
          kit.label(c, 'first order  ' + pct(eff), W - 20, cy - Math.tan(thB) * (W - 16 - cx) - 14, { align: 'right', color: C.text, size: 12, weight: 650 });
          kit.label(c, 'zero order  ' + pct(1 - eff), W - 20, cy + 18, { align: 'right', color: C.muted, size: 11.5 });
          roA.set('a', (th * 1e3).toFixed(1) + ' mrad (' + (th * R2D).toFixed(2) + '°)'); roA.set('b', (thB * 1e3).toFixed(1) + ' mrad'); roA.set('c', 'first order ' + pct(eff) + ', zero ' + pct(1 - eff)); roA.set('d', 'shifted by +' + V.f + ' MHz'); roA.set('e', '≈ ' + (0.65 * V.D * 1e-3 / med * 1e9).toFixed(0) + ' ns');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a kinematic mirror mount */
  Hyper.sim('oc-mount', {
    title: 'A kinematic mirror mount: screw, tilt and spot',
    blurb: `A mirror on a kinematic mount, folding a beam towards a distant target. Turn the adjuster screw and the plate tilts about the pivot by *pitch ÷ lever arm* per turn; the beam turns by twice that, and the spot on the target moves by that angle times the distance. The mirror’s tilt is drawn larger than life (the factor is printed) and the target is not to scale in distance, but the ruler and all the numbers are true.

**Try this**
- With the common 80-per-inch screw and a 25 mm arm, one turn tilts the mirror 12.7 mrad (0.73°) and moves a spot 5 m away by 127 mm. Turn the knob by 0.01 turn: 1.3 mm.
- Choose the *fine* and *differential* screws: the same turn moves the spot 3 and 30 times less. That is why long beam paths use fine adjusters.
- Lengthen the arm: the tilt per turn falls in proportion.
- The small legend shows why the mount is *kinematic*: a cone (3), a groove (2) and a flat (1) remove exactly the six degrees of freedom.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'pitch', type: 'select', label: 'Adjuster screw', options: [['80 per inch: 0.3175 mm per turn', 0.3175], ['100 per inch: 0.254 mm per turn', 0.254], ['Fine: 0.1 mm per turn', 0.1], ['Differential: 0.01 mm per turn', 0.01]], value: params.pitch || 0.3175 },
        { id: 'La', label: 'Distance from pivot to screw', min: 10, max: 50, step: 0.5, value: 25, unit: 'mm' },
        { id: 'turns', label: 'Turns of the screw', min: -0.5, max: 0.5, step: 0.001, value: 0.1, fmt: v => v.toFixed(3) + ' turn' },
        { id: 'Z', label: 'Distance to the target', min: 0.5, max: 10, value: 5, log: true, sig: 3, unit: 'm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['per', 'Mirror tilt per turn'], ['tilt', 'Mirror tilt now'], ['beam', 'Beam turned by'], ['spot', 'Spot moved on the target'], ['mm', 'Turns to move the spot 1 mm'], ['dof', 'Contacts']]);
      const nice = v => { const e = Math.pow(10, Math.floor(Math.log10(v))), m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const per = V.pitch / V.La, tilt = V.turns * per, beam = 2 * tilt, spot = V.Z * Math.tan(beam) * 1000;      // rad, rad, mm
        const exag = 0.2 / Math.max(1e-9, 0.5 * per), tdraw = tilt * exag;
        // the mirror, nominally at 45°, hinged at its pivot
        const P = [W * 0.2, Hh * 0.8], Lm = Hh * 0.46, ang = Math.PI / 4 + tdraw;       // canvas: the plate leans towards +x at the top for 45°
        const dir = [Math.cos(ang), -Math.sin(ang)], top = [P[0] + dir[0] * Lm, P[1] + dir[1] * Lm], hit = [P[0] + dir[0] * Lm * 0.55, P[1] + dir[1] * Lm * 0.55];
        // the base plate and the three contacts
        c.save(); c.fillStyle = C.dark ? '#2a3050' : '#c9cfe2'; c.fillRect(P[0] - 52, P[1] + 8, 130, 14); c.restore();
        c.save(); c.fillStyle = C.text; c.beginPath(); c.arc(P[0], P[1] + 6, 5, 0, 2 * Math.PI); c.fill(); c.restore();
        S.flatMirror(c, P[0], P[1], top[0], top[1], { width: 4 });
        // the screw: a rod pushing on the plate at the arm length
        const k = Lm * 0.9 / 50, sy = P[1] - Math.sin(ang) * V.La * k * 0.96, sx = P[0] + Math.cos(ang) * V.La * k * 0.96;
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(sx + 3, sy); c.lineTo(sx + 72 - V.turns * 20, sy); c.stroke(); c.restore();
        c.save(); c.fillStyle = C.accent; c.fillRect(sx + 72 - V.turns * 20, sy - 11, 14, 22); c.restore();
        kit.label(c, 'adjuster, pitch ' + V.pitch + ' mm', sx + 24, sy + 24, { align: 'left', color: C.accent, size: 11.5 });
        S.dim(c, P[0] - 24, P[1], P[0] - 24, sy, 'arm ' + V.La + ' mm', { off: -10 });
        kit.label(c, 'pivot', P[0] - 6, P[1] + 34, { align: 'center', color: C.muted, size: 11 });
        // the beam in, and out to the ruler
        S.source(c, 26, hit[1], { kind: 'laser', dir: 0, size: 9 });
        S.ray(c, [[26, hit[1]], hit], { nm: 650, width: 2.6, minArrow: 60 });
        const rcx = hit[0], half = Math.max(70, Math.min(rcx - 24, W - 24 - rcx)), rx0 = rcx - half, rx1 = rcx + half, ry = Hh * 0.14;
        const maxmm = Math.max(0.05, V.Z * Math.tan(2 * 0.5 * per) * 1000), Rr = nice(maxmm * 1.15), stepmm = nice(Rr / 4);
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(rx0, ry); c.lineTo(rx1, ry); c.stroke();
        for (let m = -Math.floor(Rr / stepmm) * stepmm; m <= Rr + 1e-9; m += stepmm) { const x = rcx + half * m / Rr; c.beginPath(); c.moveTo(x, ry - 5); c.lineTo(x, ry + 5); c.stroke(); kit.label(c, (Math.abs(m) < 1e-9 ? '0' : (+m.toPrecision(2)).toString()) + (Math.abs(m) < 1e-9 ? ' mm' : ''), x, ry - 14, { align: 'center', color: C.faint, size: 10.5 }); }
        c.restore();
        const sxp = clampv(rcx + half * spot / Rr, rx0, rx1);
        S.ray(c, [hit, [sxp, ry + 3]], { nm: 650, width: 2.2, minArrow: 80 });
        c.save(); c.fillStyle = S.nm(650); c.beginPath(); c.arc(sxp, ry, 6, 0, 2 * Math.PI); c.fill(); c.restore();
        kit.label(c, 'target, ' + kit.fmt(V.Z, 3) + ' m away (not to scale)', rcx, ry + 24, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'tilt drawn ×' + kit.fmt(exag, 2), W - 12, Hh - 12, { align: 'right', color: C.faint, size: 11 });
        // the kinematic seat
        const gx = W * 0.56, gy = Hh * 0.7;
        c.save(); c.strokeStyle = C.muted; c.fillStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.arc(gx, gy, 6, 0, 2 * Math.PI); c.stroke(); c.beginPath(); c.moveTo(gx - 12, gy + 16); c.lineTo(gx, gy + 6); c.lineTo(gx + 12, gy + 16); c.stroke();
        c.beginPath(); c.arc(gx + 56, gy, 6, 0, 2 * Math.PI); c.stroke(); c.beginPath(); c.moveTo(gx + 44, gy + 4); c.lineTo(gx + 56, gy + 12); c.lineTo(gx + 68, gy + 4); c.stroke();
        c.beginPath(); c.arc(gx + 112, gy, 6, 0, 2 * Math.PI); c.stroke(); c.beginPath(); c.moveTo(gx + 98, gy + 12); c.lineTo(gx + 126, gy + 12); c.stroke(); c.restore();
        kit.label(c, 'cone: 3', gx, gy + 32, { align: 'center', color: C.muted, size: 11 }); kit.label(c, 'groove: 2', gx + 56, gy + 32, { align: 'center', color: C.muted, size: 11 }); kit.label(c, 'flat: 1', gx + 112, gy + 32, { align: 'center', color: C.muted, size: 11 });
        const perTurnSpot = V.Z * Math.tan(2 * per) * 1000;
        ro.set('per', (per * 1e3).toFixed(per * 1e3 < 1 ? 2 : 1) + ' mrad (' + (per * R2D).toFixed(2) + '°)'); ro.set('tilt', (tilt * 1e3).toFixed(2) + ' mrad (' + (tilt * R2D * 60).toFixed(1) + ' arcmin)');
        ro.set('beam', (beam * 1e3).toFixed(2) + ' mrad'); ro.set('spot', (Math.abs(spot) < 10 ? spot.toFixed(2) : spot.toFixed(0)) + ' mm');
        ro.set('mm', (1 / perTurnSpot).toFixed(4) + ' turn'); ro.set('dof', 'cone 3 + groove 2 + flat 1 = 6 constraints');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ beam walking */
  Hyper.sim('oc-walk', {
    title: 'Beam walking: two mirrors, two irises',
    blurb: `A laser beam is to be brought onto the line through two irises, using two mirrors. The picture is the view from above, unfolded (the mirrors are drawn as if the beam went straight on), with the sideways error enlarged: **the vertical scale is much larger than the horizontal one**. Each knob is a screw of an 80-per-inch mirror mount (12.7 mrad of mirror tilt per turn); the beam turns by twice the mirror’s tilt.

**Try this**
- Turn *M1* only: the beam moves a lot at both irises, more at the far one. Turn *M2* only: the near iris hardly notices, the far one a great deal.
- Press **One cycle**: M1 centres the near iris, then M2 the far one. The near iris is spoiled a little; a second cycle puts it right again. Watch the error fall by a factor 0.2 each time — the ratio of the near distance to the far one.
- Move the near iris’s influence: press **Walk until aligned** and count the cycles.
- A beam that misses an iris is stopped by it: the red spot shows where.

Use the lowest laser power that lets you see the beam, and block it at the end ([[laser-safety-classes]]).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const X2 = 300, XA = 700, XB = 2300, GAP = 1.5, TPT = 12.7e-3;           // mm along the table: M2, near iris, far iris; iris half-opening; rad per turn
      let start = { yL: 4, s0: 1.5e-3 }, queue = [], timer = 0, cycles = 0, seed = 7;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      const ctl = kit.controls(box.side, [
        { id: 'k1', label: 'M1 knob', min: -0.5, max: 0.5, step: 0.0005, value: 0, fmt: v => v.toFixed(3) + ' turn' },
        { id: 'k2', label: 'M2 knob', min: -0.5, max: 0.5, step: 0.0005, value: 0, fmt: v => v.toFixed(3) + ' turn' },
        { type: 'buttons', items: [{ id: 'cycle', label: 'One cycle', primary: true }, { id: 'auto', label: 'Walk until aligned' }, { id: 'new', label: 'New start' }] }
      ], id => {
        if (id === 'cycle') cycle(); else if (id === 'auto') { queue = []; for (let i = 0; i < 6; i++) queue.push(step1, step2); loop.start(); }
        else if (id === 'new') { queue = []; cycles = 0; start = { yL: (rnd() - 0.5) * 10, s0: (rnd() - 0.5) * 4e-3 }; ctl.set('k1', 0); ctl.set('k2', 0); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['near', 'Beam at the near iris'], ['far', 'Beam at the far iris'], ['state', 'State'], ['ratio', 'Error shrinks per cycle by'], ['cyc', 'Cycles done']]);
      const geom = () => {
        const d1 = V.k1 * TPT, d2 = V.k2 * TPT, s1 = start.s0 + 2 * d1, s2 = s1 + 2 * d2, y2 = start.yL + s1 * X2;
        return { s1, s2, y2, yA: y2 + s2 * (XA - X2), yB: y2 + s2 * (XB - X2) };
      };
      function step1() { const d2 = V.k2 * TPT, d1 = ((-start.yL - 2 * d2 * (XA - X2)) / XA - start.s0) / 2; ctl.set('k1', clampv(d1 / TPT, -0.5, 0.5)); }
      function step2() { const g = geom(), d2 = (-start.yL - g.s1 * XB) / (2 * (XB - X2)); ctl.set('k2', clampv(d2 / TPT, -0.5, 0.5)); cycles++; }
      function cycle() { step1(); step2(); }
      const loop = kit.loop((dt) => {
        if (queue.length) { timer += dt; if (timer > 0.75) { timer = 0; queue.shift()(); } }
        else if (loop.running && dt > 0) loop.stop();
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, g = geom();
        const x0 = -180, x1 = XB + 200, sx = (W - 60) / (x1 - x0), X = x => 30 + sx * (x - x0), ky = Math.min(24, (Hh / 2 - 26) / 9), Y = y => Hh / 2 - ky * y;
        S.axis(c, X(x0), Y(0), X(x1));
        const blockA = Math.abs(g.yA) > GAP, blockB = Math.abs(g.yB) > GAP;
        // the beam: laser, M1, M2, near iris, far iris
        const pts = [[x0, start.yL - start.s0 * (0 - x0)], [0, start.yL], [X2, g.y2], [XA, g.yA]];
        if (!blockA) pts.push([XB, g.yB]);
        const px = pts.map(p => [X(p[0]), Y(p[1])]);
        S.ray(c, px, { nm: 650, width: 2.2, arrows: false });
        if (blockA) { S.ray(c, [[X(XA), Y(g.yA)], [X(XB), Y(g.yB)]], { color: C.faint, width: 1, dash: [4, 4], arrows: false }); c.save(); c.fillStyle = C.bad; c.beginPath(); c.arc(X(XA), Y(g.yA), 4.5, 0, 2 * Math.PI); c.fill(); c.restore(); }
        else if (blockB) { c.save(); c.fillStyle = C.bad; c.beginPath(); c.arc(X(XB), Y(g.yB), 4.5, 0, 2 * Math.PI); c.fill(); c.restore(); }
        // the parts
        const bar = Hh * 0.4;
        S.source(c, X(x0) + 4, Y(start.yL - start.s0 * (0 - x0)), { kind: 'laser', dir: 0, size: 8 });
        for (const [x, nm] of [[0, 'M1'], [X2, 'M2']]) { S.flatMirror(c, X(x), Y(-9), X(x), Y(9), { width: 3 }); kit.label(c, nm, X(x), Y(-9) + 16, { align: 'center', color: C.muted, size: 11.5 }); }
        for (const [x, nm] of [[XA, 'near iris'], [XB, 'far iris']]) { S.stop(c, X(x), Y(0), bar, GAP * ky, { label: nm }); }
        S.dim(c, X(X2), Y(-8.2), X(XA), Y(-8.2), 'a = ' + (XA - X2) + ' mm', { off: 10 }); S.dim(c, X(X2), Y(-6.4), X(XB), Y(-6.4), 'b = ' + (XB - X2) + ' mm', { off: 10 });
        kit.label(c, 'sideways scale ×' + (ky / sx).toFixed(0) + ' (unfolded view)', W - 12, 16, { align: 'right', color: C.faint, size: 11 });
        const near = g.yA, far = g.yB, ok = Math.abs(near) < 0.25 && Math.abs(far) < 0.25;
        ro.set('near', (near >= 0 ? '+' : '−') + Math.abs(near).toFixed(2) + ' mm' + (blockA ? '  (stopped)' : '')); ro.set('far', (far >= 0 ? '+' : '−') + Math.abs(far).toFixed(2) + ' mm' + (blockB || blockA ? '  (stopped)' : ''));
        ro.set('state', ok ? 'aligned: both within 0.25 mm' : 'not yet aligned'); ro.set('ratio', ((XA - X2) / (XB - X2)).toFixed(2) + '  (a / b)'); ro.set('cyc', String(cycles));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cleaning (schematic) */
  Hyper.sim('oc-clean', {
    title: 'Cleaning an optic: what each way of cleaning does',
    blurb: `A dirty lens (**schematic**: every dot stands for many specks, and the "scatter index" is a relative score, not a measurement). Try the ways of cleaning and watch the three things that matter: loose dust, oil, and scratches. Scratches never go away.

**Try this**
- **Blow** first, then **drag wet tissue**: the dust goes, the surface is clean, no scratches.
- Start again and **wipe dry** with a cloth: the grit is dragged across and leaves scratches; the oil is smeared wider.
- **Touch with a bare finger**, then blow: the dust under the smear is stuck, and only the wet drag lifts the oil.
- Notice the *laser risk* line: dirt that costs nothing in a camera can burn a coating in a laser beam.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      let seed = 11, parts = [], blobs = [], scratches = [], msg = 'A dusty lens. Choose a way to clean it.';
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      function inDisc() { const r = Math.sqrt(rnd()) * 0.93, a = rnd() * 2 * Math.PI; return [r * Math.cos(a), r * Math.sin(a)]; }
      function reset() { seed = 11 + Math.floor(Math.random() * 1000); parts = []; blobs = []; scratches = []; for (let i = 0; i < 70; i++) { const p = inDisc(); parts.push({ x: p[0], y: p[1], stuck: false }); } msg = 'A dusty lens. Choose a way to clean it.'; }
      reset();
      const ctl = kit.controls(box.side, [{ type: 'buttons', items: [{ id: 'blow', label: 'Blow with clean gas', primary: true }, { id: 'wet', label: 'Drag wet lens tissue' }, { id: 'dry', label: 'Wipe dry with a cloth' }, { id: 'touch', label: 'Touch with a bare finger' }, { id: 'new', label: 'A new dusty lens' }] }], id => {
        const stuckIn = p => blobs.some(b => Math.hypot(p.x - b.x, p.y - b.y) < b.r);
        if (id === 'blow') { const n0 = parts.length; parts = parts.filter(p => stuckIn(p) || rnd() > 0.9); msg = 'Blown: ' + (n0 - parts.length) + ' specks gone' + (parts.length ? '; ' + parts.length + ' remain' + (blobs.length ? ' (stuck in the oil)' : '') : '.'); }
        else if (id === 'wet') {
          const many = parts.length > 12; let made = 0;
          for (const p of parts) if (rnd() < (many ? 0.28 : 0.04)) { const a = rnd() * 0.6 - 0.3; scratches.push({ x: p.x, y: p.y, a, l: 0.3 + 0.4 * rnd() }); made++; }
          const n0 = parts.length; parts = parts.filter(() => rnd() > 0.92); blobs = blobs.filter(() => rnd() > 0.9);
          msg = 'Dragged: dust and oil lifted' + (made ? '; but ' + made + ' new scratch' + (made > 1 ? 'es' : '') + ' (grit was still on the surface — blow first)' : ' with no scratches.');
        } else if (id === 'dry') {
          let made = 0;
          for (const p of parts) if (rnd() < 0.7) { scratches.push({ x: p.x, y: p.y, a: rnd() * 0.5 - 0.25, l: 0.35 + 0.5 * rnd() }); made++; }
          parts = parts.filter(() => rnd() > 0.35); blobs.forEach(b => { b.r *= 1.25; b.a *= 0.92; }); msg = 'Dry wipe: grit dragged across the glass: ' + made + ' scratches, and what is left is smeared.';
        } else if (id === 'touch') { const p = inDisc(); blobs.push({ x: p[0] * 0.6, y: p[1] * 0.6, r: 0.28, a: 0.45 }); msg = 'Fingerprint: oil and salt, which can etch a coating in days, and it glues dust in place.'; }
        else if (id === 'new') reset();
        loop.once();
      });
      const ro = kit.readout(box.side, [['dust', 'Loose dust specks'], ['oil', 'Oil smear'], ['scr', 'Scratches (permanent)'], ['idx', 'Scatter index (start = 100)'], ['laser', 'In a laser beam']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, R = Math.min(W * 0.34, Hh * 0.42), cx = W * 0.5, cy = Hh * 0.47;
        c.save(); c.fillStyle = S.glass(0.22); c.strokeStyle = S.edge(); c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R, 0, 2 * Math.PI); c.fill(); c.stroke(); c.restore();
        c.save(); c.beginPath(); c.arc(cx, cy, R - 1, 0, 2 * Math.PI); c.clip();
        for (const b of blobs) { const g = c.createRadialGradient(cx + b.x * R, cy + b.y * R, 0, cx + b.x * R, cy + b.y * R, Math.max(1, b.r * R)); g.addColorStop(0, 'rgba(230,170,60,' + b.a + ')'); g.addColorStop(1, 'rgba(230,170,60,0)'); c.fillStyle = g; c.fillRect(cx - R, cy - R, 2 * R, 2 * R); }
        c.strokeStyle = C.dark ? 'rgba(235,240,255,.85)' : 'rgba(40,50,90,.8)'; c.lineWidth = 1;
        for (const s of scratches) { c.beginPath(); c.moveTo(cx + s.x * R, cy + s.y * R); c.lineTo(cx + (s.x + s.l * Math.cos(s.a)) * R, cy + (s.y + s.l * Math.sin(s.a)) * R); c.stroke(); }
        c.fillStyle = C.dark ? 'rgba(200,205,225,.9)' : 'rgba(60,65,85,.9)';
        for (const p of parts) { c.beginPath(); c.arc(cx + p.x * R, cy + p.y * R, 2.2, 0, 2 * Math.PI); c.fill(); }
        c.restore();
        kit.label(c, 'schematic: each dot stands for many specks', cx, cy + R + 16, { align: 'center', color: C.faint, size: 11 });
        kit.label(c, msg, cx, Hh - 14, { align: 'center', color: C.text, size: 12.5 });
        const cover = Math.min(1, blobs.reduce((a, b) => a + b.r * b.r * b.a * 2, 0)), idx = 100 * (parts.length + 40 * cover + 5 * scratches.length) / 70;
        ro.set('dust', String(parts.length)); ro.set('oil', (100 * cover).toFixed(0) + ' % of the surface, faintly'); ro.set('scr', String(scratches.length)); ro.set('idx', idx.toFixed(0));
        ro.set('laser', parts.length + cover * 40 > 3 ? 'dirt absorbs and can burn the coating' : scratches.length ? 'clean, but scratches stay (scatter and hot spots)' : 'clean');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a catalogue line, decoded */
  Hyper.sim('oc-catalogue', {
    title: 'A catalogue line, decoded and drawn to scale',
    blurb: `Choose a plano-convex lens the way a catalogue lists it. The cross-section on the left is drawn to scale, with the fields of the catalogue line marked on it; the sketch on the right (not the same scale) shows where the focus is. Every number is computed from the shape and the glass by tracing it, so the line you see is self-consistent.

**Try this**
- Shorten the focal length: the curved face must get steeper (smaller radius), and the lens thickens at the centre for the same edge thickness. Below a certain focal length it cannot be made (a hemisphere is the limit).
- Raise the edge thickness: the centre thickness follows, and the **BFL** (back focal length) falls below the **EFL**.
- Change the wavelength you use it at: the focal length of N-BK7 grows towards the infrared (the catalogue value belongs to the design wavelength).
- Compare *N-BK7* with dense flint: the same focal length with a flatter surface.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'D', type: 'select', label: 'Diameter', options: [['6.0 mm', 6], ['12.7 mm (½ inch)', 12.7], ['25.4 mm (1 inch)', 25.4], ['50.8 mm (2 inch)', 50.8]], value: 25.4 },
        { id: 'f', label: 'Focal length (EFL)', min: 15, max: 300, value: params.f || 50, log: true, sig: 3, unit: 'mm' },
        { id: 'mat', type: 'select', label: 'Glass', options: [['N-BK7', 'N-BK7'], ['Fused silica', 'fused-silica'], ['N-SF11 dense flint', 'N-SF11'], ['Sapphire', 'sapphire']], value: 'N-BK7' },
        { id: 'et', label: 'Edge thickness', min: 0.5, max: 6, step: 0.1, value: 2, unit: 'mm' },
        { id: 'nm', label: 'Wavelength it is used at', min: 450, max: 1100, step: 5, value: 587.6, unit: 'nm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['line', 'The catalogue line'], ['R', 'Radius of the curved face'], ['ct', 'Centre thickness (CT)'], ['bfl', 'Back focal length (BFL)'], ['efl', 'EFL at the wavelength used'], ['fn', 'f-number · NA'], ['ca', 'Clear aperture (90 %)']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, dsg = 587.56;
        const nD = O.index(V.mat, dsg), h = V.D / 2, fmin = 1.06 * h / (nD - 1);
        const f = Math.max(V.f, fmin), R = f * (nD - 1), sag = R - Math.sqrt(R * R - h * h), CT = V.et + sag;
        const sys = { surfaces: [{ R, t: CT, n: V.mat, sd: h, stop: true }, { R: 0, n: 1, sd: h }] };
        const pD = Sy.paraxial(sys, dsg), pU = Sy.paraxial(sys, V.nm);
        // the cross-section, to scale
        const s = Math.min(Hh * 0.62 / V.D, W * 0.22 / Math.max(CT, 1)), x0 = W * 0.1, cy = Hh * 0.46;
        S.lens(c, x0, cy, h * s, { R1: R * s, R2: 0, t: CT * s });
        S.dim(c, x0 - 16, cy - h * s, x0 - 16, cy + h * s, 'Ø ' + V.D + ' mm', { off: 14 });
        S.dim(c, x0, cy + h * s + 22, x0 + CT * s, cy + h * s + 22, 'CT ' + CT.toFixed(2), { off: 13 });
        kit.label(c, 'ET ' + V.et.toFixed(1), x0 + sag * s * 0.1 - 6, cy - h * s - 10, { align: 'center', color: C.muted, size: 11.5 });
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(x0 + CT * s + 22, cy - 0.45 * V.D * s); c.lineTo(x0 + CT * s + 22, cy + 0.45 * V.D * s); c.stroke(); c.restore();
        kit.label(c, 'clear aperture', x0 + CT * s + 28, cy, { color: C.accent, size: 11 });
        // the focus (a different scale)
        const fx0 = W * 0.52, fx1 = W - 30, bflU = pU.bfd, eflU = pU.efl, span = Math.max(eflU, bflU) * 1.05, fs = (fx1 - fx0) / span, lx = fx0 + 6, ly = cy;
        const hp = Math.min(Hh * 0.2, 50);
        c.save(); c.strokeStyle = S.edge(); c.lineWidth = 2; c.beginPath(); c.moveTo(lx, ly - hp); c.lineTo(lx, ly + hp); c.stroke(); c.restore();
        for (const k of [-0.8, -0.4, 0.4, 0.8]) S.ray(c, [[lx - 40, ly + k * hp], [lx, ly + k * hp], [lx + bflU * fs, ly]], { nm: V.nm, width: 1.2, minArrow: 90 });
        S.axis(c, lx - 40, ly, fx1); S.screen(c, lx + bflU * fs, ly, 18, { label: 'focus' });
        S.dim(c, lx, ly + hp + 24, lx + bflU * fs, ly + hp + 24, 'BFL ' + bflU.toFixed(1), { off: 13 });
        const hpPos = bflU - eflU;      // the rear principal plane, measured from the last surface
        S.dim(c, lx + hpPos * fs, ly + hp + 46, lx + bflU * fs, ly + hp + 46, 'EFL ' + eflU.toFixed(1), { off: 13 });
        kit.label(c, 'where the focus is (not the same scale)', (fx0 + fx1) / 2, Hh - 12, { align: 'center', color: C.faint, size: 11 });
        if (V.f < fmin) kit.label(c, 'shortest possible: ' + fmin.toFixed(1) + ' mm', x0, 22, { color: C.warn, size: 12, weight: 650 });
        const line = 'Plano-convex, Ø' + V.D + ' mm, EFL ' + pD.efl.toFixed(1) + ' mm, ' + V.mat + ', CT ' + CT.toFixed(1) + ' mm, BFL ' + pD.bfd.toFixed(1) + ' mm, ET ' + V.et.toFixed(1) + ' mm, CA > 90 %';
        ro.set('line', line); ro.set('R', R.toFixed(2) + ' mm  (= f (n − 1), n = ' + nD.toFixed(4) + ')'); ro.set('ct', CT.toFixed(2) + ' mm  (ET + the sag ' + sag.toFixed(2) + ' mm)');
        ro.set('bfl', pD.bfd.toFixed(2) + ' mm  (f − CT/n = ' + (f - CT / nD).toFixed(2) + ')'); ro.set('efl', eflU.toFixed(2) + ' mm at ' + V.nm + ' nm  (' + (100 * (eflU / pD.efl - 1)).toFixed(1) + ' % from the design value)');
        ro.set('fn', 'f/' + pD.fno.toFixed(2) + ' · NA ' + (V.D / (2 * f)).toFixed(3)); ro.set('ca', (0.9 * V.D).toFixed(1) + ' mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
