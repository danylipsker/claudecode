/* HYPER-OPTICS · sims/illumination-design.js — simulations of the illumination-design topic.
 *   il-etendue      source, collector and target: how much light an étendue budget lets through
 *   il-reflector    a parabolic, elliptical, spherical or faceted reflector with a source you can move
 *   il-kohler       the two sets of conjugate planes of a microscope illuminator: Köhler and critical
 *   il-light-pipe   a mixing rod or tunnel: the exit face of three LED dies, rod length and section
 *   il-light-guide  a fibre bundle: acceptance cone, packing, length, broken fibres
 *   il-ferrule      the lamp end of a light guide: spot, active diameter, cone and the heat in the ferrule
 *   il-fresnel      a Fresnel lens against the solid lens it replaces: facets, thickness, mass, blur
 *   il-projector    the étendue of the panel against the luminance of the source
 *   il-beam         a torch or a dipped headlamp on a wall: candela, beam distance, cut-off
 *   il-room         the lumen method on a plan of luminaires (and the louvre of a luminaire against glare)
 *   il-daylight     the Sun and the sky, a window and the daylight factor
 * Numbers come from kit.optics, drawing from kit.osym.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const pct = x => (100 * x).toFixed(x < 0.1 ? 1 : 0) + ' %';
  const num = (v, d) => (Number.isFinite(v) ? v.toFixed(d == null ? 1 : d) : '—');
  // a small deterministic hash for "random" fibres and facets (the same every frame)
  const hash = (i, j) => { let h = (i * 374761393 + (j || 0) * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

  /* ================================================================ étendue: source, collector, target */
  Hyper.sim('il-etendue', {
    title: 'The étendue budget: source, collector and target',
    blurb: `A source of size $d_s$ radiates like a Lambertian emitter. A lens collects the cone of half-angle $\\theta_1$ and forms an image magnified by $m$; the image, of size $m\\,d_s$, must go through a window of diameter $d_t$ and an acceptance cone set by its numerical aperture. The plot shows how much arrives as the magnification changes. (Angles are drawn as computed; the sizes of source, image and window are in proportion to each other, not to the lens.)

**Try this**
- Press **Best magnification**: the curve has a single peak. On the left, the image fits the window but the cone is too wide for its acceptance angle; on the right, the cone is narrow enough but the image is too big for the window.
- Raise the **collection angle** to 85°: more light leaves the source, but a wider cone arrives at the image. With a small NA, nothing is gained.
- Shrink the **window** or lower the **NA**: the peak falls. It can never rise above the grey line, the ratio of the two étendues, whatever the lens.
- Make the source small (0.5 mm) and the same optics now deliver everything: the étendue limit is above 100 %.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const plot = kit.plot(box.stage, { x: { label: 'magnification  m  (image size ÷ source size)', min: 0.2, max: 5, log: true, name: 'm' }, y: { label: 'delivered (%)', min: 0, max: 100, name: 'delivered' }, series: [] }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'ds', label: 'Source diameter', min: 0.5, max: 10, step: 0.1, value: params.ds || 3, unit: 'mm' },
        { id: 'th1', label: 'Collection half-angle at the source', min: 10, max: 85, step: 1, value: params.th1 || 55, unit: '°' },
        { id: 'm', label: 'Magnification of the image', min: 0.2, max: 5, value: params.m || 1, log: true, sig: 3 },
        { id: 'dt', label: 'Window (fibre or light guide) diameter', min: 0.2, max: 12, value: params.dt || 5, log: true, sig: 2, unit: 'mm' },
        { id: 'NA', label: 'Acceptance NA of the window', min: 0.1, max: 0.7, step: 0.01, value: params.NA || 0.55 },
        { type: 'buttons', items: [{ id: 'best', label: 'Best magnification', primary: true }, { id: 'wide', label: 'Collect out to 85°' }] }
      ], id => {
        if (id === 'best') ctl.set('m', bestM());
        else if (id === 'wide') ctl.set('th1', 85);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['Gs', 'Étendue of the source (hemisphere)'], ['Gt', 'Étendue of the window'], ['col', 'Collected from the source'], ['img', 'Image · cone at the image'], ['fit', 'Image that falls on the window'], ['acc', 'Light inside the acceptance cone'], ['out', 'Delivered to the window'], ['lim', 'The étendue limit']]);
      // what happens at magnification m: a Lambertian source, a thin collector obeying the sine condition
      const calc = (m, v) => {
        const s1 = Math.min(Math.sin(v.th1 * D2R), m);                 // a cone cannot be steeper than 90° on the image side
        const s2 = s1 / m, di = m * v.ds;
        const fa = Math.min(1, Math.pow(v.dt / di, 2)), fc = Math.min(1, Math.pow(v.NA / s2, 2));
        return { s1, s2, di, fa, fc, col: s1 * s1, out: s1 * s1 * fa * fc };
      };
      const bestM = () => { let b = 0.2, bo = -1; for (let i = 0; i <= 120; i++) { const m = 0.2 * Math.pow(25, i / 120), o = calc(m, V).out; if (o > bo) { bo = o; b = m; } } return Number(b.toPrecision(3)); };
      const limit = () => Math.min(1, O.photo.etendue(Math.PI * V.dt * V.dt / 4, Math.asin(V.NA)) / O.photo.etendue(Math.PI * V.ds * V.ds / 4, Math.PI / 2));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, y0 = Hh * 0.5;
        const k0 = calc(V.m, V), t1 = Math.asin(k0.s1), t2 = Math.asin(Math.min(1, k0.s2));
        // geometry: the lens stands at xL; its height follows from the two cones so that both angles are drawn exactly
        const xL = W * 0.42, aMax = W * 0.36, bMax = W * 0.5;
        const hL = Math.max(14, Math.min(Hh * 0.42, aMax * Math.tan(t1), bMax * Math.tan(t2)));
        const a = hL / Math.tan(Math.max(t1, 0.05)), b = Math.max(24, hL / Math.tan(Math.max(t2, 0.05)));
        const xS = xL - a, xT = xL + b;
        const dmax = Math.max(V.ds, k0.di, V.dt);
        const k = Math.min(hL * 0.5 / (dmax / 2), Hh * 0.34 / (dmax / 2));
        const Ys = k * V.ds / 2, Yi = k * k0.di / 2, Yt = k * V.dt / 2;
        S.axis(c, 8, y0, W - 8);
        // the target window with its acceptance cone
        S.stop(c, xT, y0, Math.min(Hh * 0.46, Math.max(Yt, Yi) * 1.5 + 14), Yt, { label: 'window' });
        const thA = Math.asin(V.NA), lc = Math.min(b * 0.8, 150);
        c.save(); c.strokeStyle = C.ok; c.setLineDash([5, 4]); c.lineWidth = 1.2; c.beginPath();
        c.moveTo(xT, y0); c.lineTo(xT - lc, y0 - lc * Math.tan(thA)); c.moveTo(xT, y0); c.lineTo(xT - lc, y0 + lc * Math.tan(thA)); c.stroke(); c.restore();
        kit.label(c, 'acceptance cone', xT - lc * 0.55, y0 - lc * 0.55 * Math.tan(thA) - 10, { color: C.ok, size: 11, align: 'center' });
        // the source, the lens, the rays
        S.thinLens(c, xL, y0, hL, 60, { foci: false });
        const sy = [-1, 0, 1].map(j => j * Ys);
        for (const ys of sy) {
          const img = -k0.di / V.ds * ys;                                 // the image point (inverted)
          const gate = Math.abs(img) <= Yt;
          for (const hh of [-1, -0.5, 0, 0.5, 1]) {
            const yl = hh * hL;
            const ang = Math.atan2(Math.abs(yl - img), b), ok = gate && Math.sin(ang) <= V.NA + 1e-9;
            S.ray(c, [[xS, y0 - ys], [xL, y0 - yl], [xT, y0 - img]], { color: ok ? C.warn : C.bad, width: 1, alpha: ok ? 0.75 : 0.5, arrows: false });
          }
        }
        c.fillStyle = C.warn; c.fillRect(xS - 3, y0 - Ys, 6, Math.max(2, 2 * Ys));
        kit.label(c, 'source  ' + V.ds.toFixed(1) + ' mm', xS, y0 + Math.max(Ys, 8) + 16, { align: 'center', color: C.muted, size: 11.5 });
        S.object(c, xT, y0, -Yi, { color: C.accent, width: 3 });
        kit.label(c, 'image  ' + k0.di.toFixed(1) + ' mm', xT + 4, y0 + Math.max(Yi, Yt) + 16, { align: 'left', color: C.accent, size: 11.5 });
        S.angle(c, xS, y0, Math.min(40, a * 0.4), 0, -t1, 'θ₁', { color: C.muted });
        kit.label(c, 'collector', xL, y0 - hL - 12, { align: 'center', color: C.muted, size: 11.5 });
        // numbers
        const Gs = O.photo.etendue(Math.PI * V.ds * V.ds / 4, Math.PI / 2), Gt = O.photo.etendue(Math.PI * V.dt * V.dt / 4, thA), lim = limit();
        ro.set('Gs', Gs.toFixed(Gs < 10 ? 2 : 1) + ' mm²·sr');
        ro.set('Gt', Gt.toFixed(Gt < 10 ? 3 : 1) + ' mm²·sr');
        ro.set('col', pct(k0.col) + (Math.sin(V.th1 * D2R) > V.m ? '  (cone limited by m)' : ''));
        ro.set('img', k0.di.toFixed(1) + ' mm · ±' + (t2 * R2D).toFixed(0) + '°');
        ro.set('fit', pct(k0.fa));
        ro.set('acc', pct(k0.fc));
        ro.set('out', pct(k0.out));
        ro.set('lim', pct(lim) + ' of the source flux at most');
        // the curve of delivered light against magnification
        const pts = []; for (let i = 0; i <= 60; i++) { const m = 0.2 * Math.pow(25, i / 60); pts.push([m, 100 * calc(m, V).out]); }
        plot.set({ series: [{ pts, label: 'delivered', fill: true }], vlines: [{ x: V.m, label: 'm' }], hlines: [{ y: 100 * lim, label: 'étendue limit' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ reflectors */
  Hyper.sim('il-reflector', {
    title: 'Reflectors: parabola, ellipse, sphere and facets',
    blurb: `A light source and a mirror of one of four kinds, with every ray traced. The colours tell which point of the source a ray left: the middle, the top or the bottom. Drag the source with the pointer, or use the sliders. The beam half-angle of the extreme traced rays (they come from the middle of the dish, where the source is nearest) is shown next to the étendue estimate of an equivalent even beam $\\sin\\theta_b \\approx (d_s/D)\\sin\\theta_c$. (The mirror is drawn in section; the lamp\'s forward light, which the mirror does not catch, is the faint lines.)

**Try this**
- *Parabola*, source size 0: a perfectly parallel beam. Raise the **source size** to 4 mm: the beam spreads by about the source size divided by the width of the dish.
- Slide the source **along the axis**: nearer the mirror the rays diverge, farther away they converge to a waist. Slide it **across**: the whole beam swings the other way.
- *Ellipse*: all the rays pass the second focus. Make the source bigger and look at the image there — a sharp core in a halo, because the rim zones magnify less.
- *Sphere*: the source at the centre of curvature returns on itself; move it a little and the rays miss.
- *Faceted parabola*: each facet is tilted a little, and the beam widens and evens out.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 340 });
      const F = 15, RV = 2 * F, NR = 13, NF = 9;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Reflector', options: [['Parabola — a beam from a point', 'par'], ['Ellipse — from one focus to the other', 'ell'], ['Sphere — back to the source', 'sph'], ['Faceted parabola — a smooth beam', 'fac']], value: params.mode || 'par' },
        { id: 'rim', label: 'Rim angle (how much light the mirror catches)', min: 30, max: 90, step: 1, value: 90, unit: '°' },
        { id: 'size', label: 'Source size', min: 0, max: 4, step: 0.1, value: params.size != null ? params.size : 1.5, unit: 'mm' },
        { id: 'dz', label: 'Source along the axis (from the focus)', min: -40, max: 40, step: 1, value: 0, unit: '% of f' },
        { id: 'dy', label: 'Source across the axis', min: -3, max: 3, step: 0.1, value: 0, unit: 'mm' },
        { id: 'ecc', label: 'Eccentricity of the ellipse', min: 0.3, max: 0.75, step: 0.01, value: 0.6 },
        { id: 'tilt', label: 'Largest facet deviation', min: 0, max: 8, step: 0.5, value: 3, unit: '°' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Source back to the focus', primary: true }] }
      ], id => { if (id === 'reset') { ctl.set('dz', 0); ctl.set('dy', 0); } showRows(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Focal length · rim diameter D'], ['catch', 'Share of an all-round source caught'], ['beam', 'Beam half-angle (extreme traced rays)'], ['est', 'Étendue estimate  (d_s/D) sin θ_c'], ['dir', 'Beam points (mean of the rays)'], ['f2', 'Second focus'], ['img', 'Width of the image there'], ['ret', 'Width of the returning light at the source']]);
      const showRows = () => {
        ctl.show('ecc', V.mode === 'ell'); ctl.show('tilt', V.mode === 'fac');
        ro.show('beam', V.mode === 'par' || V.mode === 'fac'); ro.show('est', V.mode === 'par' || V.mode === 'fac'); ro.show('dir', V.mode === 'par' || V.mode === 'fac');
        ro.show('f2', V.mode === 'ell'); ro.show('img', V.mode === 'ell'); ro.show('ret', V.mode === 'sph');
      };
      showRows();
      // the geometry of the chosen mirror: vertex at the origin, light travelling in +z towards it; u = −z is drawn to the right
      const shape = () => {
        const mode = V.mode, e = mode === 'ell' ? V.ecc : mode === 'sph' ? 0 : 1;
        const surf = { R: -RV, k: mode === 'ell' ? -e * e : mode === 'sph' ? 0 : -1, mirror: true };
        const uF = mode === 'sph' ? RV : mode === 'ell' ? RV / (1 + e) : F, uF2 = mode === 'ell' ? RV / (1 - e) : NaN;
        // the rim: where the ray leaving the nominal focus at the rim angle meets the mirror
        const rim = V.rim * D2R, t = Sy.trace({ surfaces: [surf] }, { p: [0, 0, -uF], d: [0, Math.sin(rim), Math.cos(rim)] }, 550);
        const rimR = t.pts[1] && Number.isFinite(t.pts[1][1]) ? Math.abs(t.pts[1][1]) : RV;
        return { mode, e, surf, uF, uF2, rimR, uMax: mode === 'ell' ? uF2 * 1.12 + 4 : mode === 'sph' ? RV * 2.3 : 5.8 * F };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, g = shape();
        const m = S.map(st, -3, g.uMax, Math.max(g.rimR * 1.12, 6), { left: 10, right: 12, top: 14, bottom: 14 });
        const uS = g.uF + V.dz / 100 * F;
        const pts = V.size > 0 ? [V.dy - V.size / 2, V.dy, V.dy + V.size / 2] : [V.dy];
        const sys = { surfaces: [Object.assign({}, g.surf, { sd: g.rimR * 1.0001 })] };
        S.axis(c, m.X(-3), m.y0, m.X(g.uMax));
        // the forward light of the lamp that the mirror does not catch
        for (const phi of [V.rim + 12, (V.rim + 180) / 2, 160]) for (const sgn of [-1, 1]) {
          const ph = phi * D2R, dx = -Math.cos(ph), dyy = Math.sin(ph) * sgn;
          S.ray(c, [[m.X(uS), m.Y(V.dy)], [m.X(uS) + dx * W, m.Y(V.dy) - dyy * W]], { color: C.faint, width: 1, alpha: 0.35, arrows: false });
        }
        // the mirror
        const prof = []; for (let i = -40; i <= 40; i++) { const r = g.rimR * i / 40; prof.push([m.X(-Sy.sag(g.surf, r)), m.Y(r)]); }
        c.save(); c.strokeStyle = S.metal(); c.lineWidth = 3; c.lineJoin = 'round'; c.beginPath(); prof.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore();
        if (g.mode === 'fac') for (let j = 0; j <= NF; j++) { const r = Math.tan((-V.rim + 2 * V.rim * j / NF) * D2R / 2) * 2 * F, p = [m.X(-Sy.sag(g.surf, r)), m.Y(r)]; c.save(); c.strokeStyle = C.bg2; c.lineWidth = 1.5; c.beginPath(); c.moveTo(p[0] - 4, p[1]); c.lineTo(p[0] + 4, p[1]); c.stroke(); c.restore(); }
        // the rays
        const pm = Math.min(V.rim, 89.5), angs = [], ends = [], cols = [C.series[0], C.series[2], C.series[3]], atF2 = [], atSrc = [];
        pts.forEach((yy, pi) => {
          const col = pts.length === 1 ? C.warn : cols[pi];
          for (let j = 0; j < NR; j++) {
            const phi = (-pm + 2 * pm * j / (NR - 1)) * D2R;
            const tr = Sy.trace(sys, { p: [0, yy, -uS], d: [0, Math.sin(phi), Math.cos(phi)] }, 550);
            if (!tr.ok) { const dd = [Math.sin(phi), Math.cos(phi)]; S.ray(c, [[m.X(uS), m.Y(yy)], [m.X(uS) - dd[1] * W, m.Y(yy) - dd[0] * W]], { color: C.faint, width: 1, alpha: 0.3, arrows: false }); continue; }
            let d = tr.d.slice();
            if (g.mode === 'fac') {
              const kf = Math.min(NF - 1, Math.floor((phi / D2R + pm) / (2 * pm) * NF)), dev = V.tilt * D2R * (((kf * 7) % 5) - 2) / 2;
              const a2 = Math.atan2(d[1], -d[2]) + dev; d = [0, Math.sin(a2), -Math.cos(a2)];
            }
            const hit = tr.pts[1], zEnd = -g.uMax, s = (zEnd - hit[2]) / d[2], end = [0, hit[1] + s * d[1], zEnd];
            S.ray(c, [[m.X(uS), m.Y(yy)], [m.X(-hit[2]), m.Y(hit[1])], [m.X(-end[2]), m.Y(end[1])]], { color: col, width: 1.1, alpha: pi === 0 && pts.length > 1 ? 0.7 : 0.85, arrows: false });
            angs.push(Math.atan2(d[1], -d[2]) * R2D);
            if (g.mode === 'ell') { const sF = (-g.uF2 - hit[2]) / d[2]; atF2.push(hit[1] + sF * d[1]); }
            if (g.mode === 'sph') { const sF = (-uS - hit[2]) / d[2]; atSrc.push(hit[1] + sF * d[1]); }
          }
        });
        // the source and the foci
        c.fillStyle = C.warn; c.fillRect(m.X(uS) - 3, m.Y(V.dy + V.size / 2), 6, Math.max(3, V.size * m.s));
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1; const fx = m.X(g.uF), fy = m.Y(0); c.beginPath(); c.moveTo(fx - 5, fy - 5); c.lineTo(fx + 5, fy + 5); c.moveTo(fx - 5, fy + 5); c.lineTo(fx + 5, fy - 5); c.stroke(); c.restore();
        kit.label(c, g.mode === 'sph' ? 'centre of curvature' : 'focus', fx, fy + 20, { align: 'center', color: C.muted, size: 11 });
        if (g.mode === 'ell') { const x2 = m.X(g.uF2); c.save(); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(x2 - 5, fy - 5); c.lineTo(x2 + 5, fy + 5); c.moveTo(x2 - 5, fy + 5); c.lineTo(x2 + 5, fy - 5); c.stroke(); c.restore(); kit.label(c, 'second focus', x2, fy + 20, { align: 'center', color: C.muted, size: 11 }); }
        kit.label(c, 'mirror diameter D = ' + (2 * g.rimR).toFixed(0) + ' mm', 12, 14, { align: 'left', color: C.muted, size: 11.5 });
        // numbers
        const D = 2 * g.rimR, mean = angs.length ? angs.reduce((a, b) => a + b, 0) / angs.length : 0;
        const half = angs.length ? Math.max(...angs.map(x => Math.abs(x - mean))) : 0;
        ro.set('f', (g.mode === 'par' || g.mode === 'fac' ? F.toFixed(0) + ' mm' : g.mode === 'sph' ? 'R = ' + RV + ' mm' : 'R(vertex) = ' + RV + ' mm') + ' · D = ' + D.toFixed(0) + ' mm');
        ro.set('catch', pct((1 - Math.cos(V.rim * D2R)) / 2));
        ro.set('beam', '±' + half.toFixed(1) + '°');
        ro.set('est', '±' + (Math.asin(clamp(V.size / D * Math.sin(V.rim * D2R), 0, 1)) * R2D).toFixed(1) + '°');
        ro.set('dir', (mean >= 0 ? '+' : '') + mean.toFixed(1) + '° (up is +)');
        ro.set('f2', g.mode === 'ell' ? (g.uF2).toFixed(0) + ' mm from the vertex; m = ' + ((1 + g.e) / (1 - g.e)).toFixed(1) + ' at the centre' : '—');
        ro.set('img', atF2.length ? (Math.max(...atF2) - Math.min(...atF2)).toFixed(1) + ' mm  (source ' + V.size.toFixed(1) + ' mm)' : '—');
        ro.set('ret', atSrc.length ? (Math.max(...atSrc) - Math.min(...atSrc)).toFixed(1) + ' mm  (source ' + V.size.toFixed(1) + ' mm)' : '—');
        shapeNow = { m, g, uS };
      }, box.stage);
      let shapeNow = null;
      kit.drag(st, {
        hover: true,
        hit: p => shapeNow && Math.hypot(p.x - shapeNow.m.X(shapeNow.uS), p.y - shapeNow.m.Y(V.dy)) < 22 ? 'src' : null,
        move: (w, p) => {
          if (!shapeNow) return;
          ctl.set('dz', clamp(Math.round((shapeNow.m.Z(p.x) - shapeNow.g.uF) / F * 100), -40, 40));
          ctl.set('dy', clamp(Math.round(shapeNow.m.Yi(p.y) * 10) / 10, -3, 3));
          loop.once();
        }
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ Köhler and critical illumination */
  Hyper.sim('il-kohler', {
    title: 'Köhler and critical illumination: two sets of conjugate planes',
    blurb: `A microscope illuminator unfolded along its axis: lamp, collector, field diaphragm, aperture diaphragm (at the front focal plane of the condenser), condenser, specimen and objective. The **green** rays start at the edge and centre of the field diaphragm and show where it is imaged: on the specimen and again in the intermediate image. The **orange** rays start at the lamp: they show where the lamp is imaged, in the aperture diaphragm and the objective's pupil. (The heights are stretched several times so that the rays can be seen; the lamp is drawn to the left and the long gap before the field diaphragm is at its true length.)

**Try this**
- Press **Köhler**: the lamp is focused in the aperture diaphragm and the field in the top corner is even. Close the **field diaphragm**: only the lit field shrinks; close the **aperture diaphragm**: the cone of light shrinks and the illumination NA falls (read-outs).
- Press **Critical** (or drag the lamp to the right): the lamp image now lands on the field diaphragm, and so on the specimen. The coils of the filament show in the field, and the aperture diaphragm no longer controls the cone properly.
- Open the field diaphragm beyond the field of view: light falls where it cannot help (flare). Close it to just outside the field.
- Open the aperture diaphragm beyond the objective's NA: the extra light misses the objective, and the resolution stops improving.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, A = O.abcd;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 340 });
      // the instrument, in mm along the axis from the condenser (z = 0)
      const FK = 20, ZA = -FK, ZF = -120, ZC = ZF - 90, FC = 40, ZS = FK * -ZF / (-ZF - FK), ZO = ZS + 14, FO = 12, ZB = ZO + FO, ZI = ZO + (ZO - ZS) * FO / (ZO - ZS - FO), MFD = ZS / -ZF;
      const AP_C = 14, AP_K = 12, AP_O = 6, HS = 2.4;
      const SO_K = 1 / (1 / FC - 1 / (ZA - ZC)), SO_C = 1 / (1 / FC - 1 / (ZF - ZC));
      const NA_O = Math.sin(Math.atan(AP_O / (ZO - ZS)));
      const ctl = kit.controls(box.side, [
        { id: 'lamp', label: 'Distance from the lamp to the collector', min: 44, max: 80, step: 0.1, value: params.critical ? Number(SO_C.toFixed(1)) : Number(SO_K.toFixed(1)), unit: 'mm' },
        { id: 'rF', label: 'Field diaphragm: radius of the opening', min: 1, max: 9, step: 0.1, value: 5.2, unit: 'mm' },
        { id: 'rA', label: 'Aperture diaphragm: radius of the opening', min: 1, max: 9, step: 0.1, value: 6.5, unit: 'mm' },
        { id: 'show', type: 'select', label: 'Rays shown', options: [['Both sets', 'both'], ['From the lamp (lamp conjugates)', 'lamp'], ['From the field diaphragm (field conjugates)', 'field']], value: 'both' },
        { type: 'buttons', items: [{ id: 'koh', label: 'Köhler', primary: true }, { id: 'crit', label: 'Critical' }] }
      ], id => { if (id === 'koh') ctl.set('lamp', Number(SO_K.toFixed(1))); else if (id === 'crit') ctl.set('lamp', Number(SO_C.toFixed(1))); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['img', 'The lamp is imaged'], ['vis', 'Filament seen in the field'], ['fld', 'Lit field on the specimen'], ['nac', 'Illumination NA'], ['nao', 'Objective NA'], ['res', 'Resolution (λ = 550 nm)']]);
      // a ray [y, u] through the elements met after z0, drawn as [[z, y] …]; elements with an opening stop the ray that is too high
      const trace = (z0, y0, u0, zEnd, els) => {
        let z = z0, y = y0, u = u0, ok = true; const pts = [[z, y]];
        for (const e of els) {
          if (e.z <= z0 + 1e-9 || e.z > zEnd) continue;
          [y, u] = A.apply(A.free(e.z - z), [y, u]); z = e.z; pts.push([z, y]);
          if (e.ap != null && Math.abs(y) > e.ap) { ok = false; break; }
          if (e.f) [y, u] = A.apply(A.lens(e.f), [y, u]);
        }
        if (ok) { [y, u] = A.apply(A.free(zEnd - z), [y, u]); pts.push([zEnd, y]); }
        return { pts, ok };
      };
      const yAt = (pts, z) => { for (let i = 1; i < pts.length; i++) if (Math.abs(pts[i][0] - z) < 1e-6) return pts[i][1]; return null; };
      let mp = null;
      kit.drag(st, { hover: true, hit: p => mp && Math.hypot(p.x - mp.X(ZC - V.lamp), p.y - mp.y0) < 26 ? 'lamp' : null, move: (w, p) => { if (mp) { ctl.set('lamp', clamp(Math.round((ZC - mp.Z(p.x)) * 10) / 10, 44, 80)); loop.once(); } } });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const so = V.lamp, zL = ZC - so;
        const m = S.map(st, zL - 8, ZI + 8, 15, { left: 14, right: 14, top: 112, bottom: 46, stretch: 6 }); mp = m;
        const sy = m.sy;
        const els = [{ z: ZC, f: FC, ap: AP_C }, { z: ZF, ap: V.rF }, { z: ZA, ap: V.rA }, { z: 0, f: FK, ap: AP_K }, { z: ZS }, { z: ZO, f: FO, ap: AP_O }];
        const open = els.map(e => ({ z: e.z, f: e.f, ap: e.f ? e.ap : null }));
        const showL = V.show !== 'field', showF = V.show !== 'lamp';
        // the dashed planes: lamp conjugates (orange) and field conjugates (green)
        const plane = (z, col) => { c.save(); c.strokeStyle = col; c.globalAlpha = 0.35; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(m.X(z), m.y0 - 15 * sy); c.lineTo(m.X(z), m.y0 + 15 * sy); c.stroke(); c.restore(); };
        S.axis(c, m.X(zL - 8), m.y0, m.X(ZI + 8));
        for (const z of [ZA, ZB]) plane(z, C.warn);
        for (const z of [ZF, ZS, ZI]) plane(z, C.ok);
        // elements
        S.thinLens(c, m.X(ZC), m.y0, AP_C * sy, FC, { foci: false });
        S.thinLens(c, m.X(0), m.y0, AP_K * sy, FK, { foci: false });
        S.thinLens(c, m.X(ZO), m.y0, AP_O * sy, FO, { foci: false });
        S.stop(c, m.X(ZF), m.y0, 14.5 * sy, V.rF * sy);
        S.stop(c, m.X(ZA), m.y0, 12 * sy, V.rA * sy);
        c.fillStyle = C.text; c.fillRect(m.X(ZS) - 1.5, m.y0 - 1.1 * sy, 3, 2.2 * sy);
        c.fillStyle = C.warn; c.fillRect(m.X(zL) - 3, m.y0 - HS * sy, 6, 2 * HS * sy);
        // the rays
        let foot = 0, maxFootAtF = 0;
        if (showL) for (const yf of [-HS, 0, HS]) for (const yc of [-0.9 * AP_C, 0, 0.9 * AP_C]) {
          const u = (yc - yf) / so, r = trace(zL, yf, u, ZB + 6, els);
          S.ray(c, r.pts.map(p => [m.X(p[0]), m.Y(p[1])]), { color: C.warn, width: 1, alpha: r.ok ? 0.8 : 0.4, arrows: false });
        }
        for (const yf of [-HS, 0, HS]) for (const yc of [-0.9 * AP_C, 0, 0.9 * AP_C]) {
          const r = trace(zL, yf, (yc - yf) / so, ZA + 1, open), yA = yAt(r.pts, ZA); if (yA != null) foot = Math.max(foot, Math.abs(yA));
          const yF = yAt(r.pts, ZF); if (yF != null) maxFootAtF = Math.max(maxFootAtF, Math.abs(yF));
        }
        if (showF) for (const yd of [-V.rF, 0, V.rF]) for (const yk of [-0.9 * AP_K, 0, 0.9 * AP_K]) {
          const r = trace(ZF, yd, (yk - yd) / (0 - ZF), ZI + 4, els);
          S.ray(c, r.pts.map(p => [m.X(p[0]), m.Y(p[1])]), { color: C.ok, width: 1, alpha: r.ok ? 0.8 : 0.4, arrows: false });
        }
        // labels: lamp-conjugate planes in orange, field-conjugate planes in green
        const L = (txt, z, col, row) => kit.label(c, txt, m.X(z), row === 0 ? 104 : Hh - 30, { align: 'center', color: col, size: 11 });
        L('field diaphragm', ZF, C.ok, 0); L('aperture', ZA, C.warn, 0); L('specimen', ZS, C.ok, 0); L('pupil', ZB, C.warn, 0);
        L('lamp', zL, C.warn, 1); L('collector', ZC, C.muted, 1); L('condenser', 0, C.muted, 1); L('objective', ZO, C.muted, 1); L('image', ZI, C.ok, 1);
        kit.label(c, '● orange: the lamp and its images     ● green: the field diaphragm and its images     (heights × ' + m.stretch.toFixed(0) + ')', 14, Hh - 10, { align: 'left', color: C.faint, size: 10.5 });
        // numbers
        const zImg = ZC + 1 / (1 / FC - 1 / so), vis = 1 / (1 + Math.pow((zImg - ZF) / 15, 2));
        const NAc = Math.sin(Math.atan(Math.min(V.rA, foot) / FK)), Rl = V.rF * MFD, NAeff = Math.min(NAc, NA_O);
        ro.set('img', Math.abs(zImg - ZA) < 12 ? 'in the aperture diaphragm: Köhler' : Math.abs(zImg - ZF) < 12 ? 'on the field diaphragm, so on the specimen: critical' : 'between them (' + Math.round(zImg - ZC) + ' mm after the collector)');
        ro.set('vis', pct(vis));
        ro.set('fld', (2 * Rl).toFixed(2) + ' mm  (objective sees 2.0 mm)' + (Rl > 1.15 ? ' — spills outside: flare' : Rl < 0.97 ? ' — field not filled' : ' — just outside the field: right'));
        ro.set('nac', NAc.toFixed(2) + ' (' + pct(NAc / NA_O) + ' of the objective\'s)');
        ro.set('nao', NA_O.toFixed(2));
        ro.set('res', (1.22 * 0.55 / (NA_O + NAeff)).toFixed(2) + ' µm');
        // the field as the eye sees it: lit disc against the objective's field of view
        const fx = W - 104, fy = 11, fs = 92, key = [V.rF.toFixed(1), vis.toFixed(2)].join();
        c.fillStyle = C.surface; c.fillRect(fx - 2, fy - 2, fs + 4, fs + 4);
        S.image(c, fx, fy, fs, fs, 46, 46, (u, v) => {
          const dx = (u - 0.5) * fs / 38, dy = (v - 0.5) * fs / 38, r = Math.hypot(dx, dy);
          if (r > Rl) return 0.05;
          return 0.9 * (1 - 0.7 * vis * (0.5 + 0.5 * Math.cos(2 * Math.PI * dx * 5 + 0.4 * dy)));
        }, { key, id: 'koh-field', nm: 580, gamma: 0.8 });
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.arc(fx + fs / 2, fy + fs / 2, 38, 0, 2 * Math.PI); c.stroke(); c.restore();
        kit.label(c, 'the field in the eyepiece', fx + fs / 2, fy + fs + 12, { align: 'center', color: C.muted, size: 10.5 });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a mixing rod */
  Hyper.sim('il-light-pipe', {
    title: 'A mixing rod: three LED dies at the entrance, an even field at the exit',
    blurb: `Three LED dies (red, green and blue, each 1 mm square) sit on the entrance face of a rod 5 mm across. Every ray is followed down the rod and folded back each time it meets a wall, and the sum of all of them is the exit face on the right. The side view shows the extreme rays of the middle of the entrance. (The picture is at true scale; the rod is long and thin.)

**Try this**
- Start with a **short rod**: the exit still shows three separate coloured patches. Lengthen it and they overlap into white; the plot shows the colour balance and the uniformity rising with the number of reflections.
- Narrow the **cone** to 10°: the rays hardly touch the walls and the rod mixes almost nothing; a bare LED touching the rod (cone 80°) mixes in a few widths.
- Switch to the **round** section: a ring or a hole remains however long the rod, because skew rays never reach the middle. Square and round rods are the same except for their shape.
- Switch to the **hollow tunnel**: it makes more reflections in the same length (no glass to narrow the cone) but loses 3 % at each.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const plot = kit.plot(box.stage, { x: { label: 'length of the rod (mm)', min: 5, max: 120, name: 'L' }, y: { label: '(%)', min: 0, max: 100, name: '' }, series: [] }, 160);
      const W0 = 5, N_GLASS = O.index('N-BK7', 550), R_TUN = 0.97;
      const DIES = [{ x: -1.3, y: -0.9, rgb: [255, 0, 0] }, { x: 1.3, y: -0.9, rgb: [0, 255, 0] }, { x: 0, y: 1.4, rgb: [0, 0, 255] }];
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Length of the rod', min: 5, max: 120, step: 1, value: params.L || 18, unit: 'mm' },
        { id: 'cone', label: 'Half-angle of the light entering (in air)', min: 5, max: 80, step: 1, value: params.cone || 40, unit: '°' },
        { id: 'kind', type: 'select', label: 'Kind', options: [['Solid glass rod (total internal reflection)', 'glass'], ['Hollow tunnel (mirror walls, 97 % each)', 'tunnel']], value: params.kind || 'glass' },
        { id: 'sect', type: 'select', label: 'Cross-section (5 mm)', options: [['Square', 'sq'], ['Round', 'rd']], value: params.sect || 'sq' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ang', 'Half-angle inside the rod'], ['N', 'Reflections across one axis (extreme ray)'], ['U', 'Uniformity of the exit (lowest ÷ mean)'], ['col', 'Colour balance'], ['T', 'Light that arrives']]);
      // The exit face of the rod: NB × NB bins and three colour sums, for dies of nd × nd points each.
      // A square rod is solved exactly by the method of images (the exit is the sum of the mirrored copies of the
      // entrance); a round rod by following quasi-random rays round its wall in closed form. `budget` caps the work.
      const compute = (L, cone, kind, sect, NB, nd, nq, budget) => {
        if (kind === 'tunnel') cone = Math.min(cone, 60);
        const th = Math.asin(Math.sin(cone * D2R) / (kind === 'glass' ? N_GLASS : 1)), tmax = Math.tan(th), a = W0 / 2, t2max = tmax * tmax;
        if (sect === 'sq') {                                              // fewer bins and source points when the images are many
          const I = 2 * L * tmax / W0 + 2;
          while (NB * NB * 3 * nd * nd * I * I > budget && (nd > 1 || NB > 8)) { if (nd > 1) nd--; else NB -= 2; }
        }
        const bins = [0, 1, 2].map(() => new Float64Array(NB * NB));
        const wgt = t2 => 1 / ((1 + t2) * (1 + t2));
        for (let d = 0; d < 3; d++) for (let i = 0; i < nd; i++) for (let j = 0; j < nd; j++) {
          const x0 = DIES[d].x + (i + 0.5) / nd - 0.5, y0 = DIES[d].y + (j + 0.5) / nd - 0.5;      // the die is 1 mm square
          if (sect === 'sq') {
            // the images of every bin: unfolded positions u = ±ξ + 2mW with ξ measured from one wall
            const imgs = (x00) => {
              const lo = x00 + a - L * tmax, hi = x00 + a + L * tmax, out = [];
              for (let b = 0; b < NB; b++) {
                const xi = (b + 0.5) / NB * W0, list = [];
                for (const sg of [1, -1]) for (let m = Math.ceil((lo - sg * xi) / (2 * W0)); m <= Math.floor((hi - sg * xi) / (2 * W0)); m++) { const u = sg * xi + 2 * m * W0; list.push([(u - (x00 + a)) / L, Math.abs(Math.floor(u / W0))]); }
                out.push(list);
              }
              return out;
            };
            const ix = imgs(x0), iy = imgs(y0);
            for (let by = 0; by < NB; by++) for (let bx = 0; bx < NB; bx++) {
              let sum = 0;
              for (const [tx, nx] of ix[bx]) for (const [ty, ny] of iy[by]) { const t2 = tx * tx + ty * ty; if (t2 <= t2max) sum += wgt(t2) * (kind === 'tunnel' ? Math.pow(R_TUN, nx + ny) : 1); }
              for (let c = 0; c < 3; c++) bins[c][by * NB + bx] += sum * DIES[d].rgb[c] / 255;
            }
          } else {
            for (let n = 0; n < nq; n++) {
              const r = tmax * Math.sqrt(((0.5 + n * 0.7548776662) % 1)), ph = 2 * Math.PI * ((0.5 + n * 0.5698402909) % 1), t2 = r * r, s = L * r, dx = Math.cos(ph), dy = Math.sin(ph);
              // the first wall hit; after it every chord has the same length and turns the ray by the same angle
              const b = x0 * dx + y0 * dy, t1 = -b + Math.sqrt(Math.max(0, b * b - (x0 * x0 + y0 * y0 - a * a)));
              let px, py, nref = 0;
              if (t1 >= s) { px = x0 + s * dx; py = y0 + s * dy; }
              else {
                const hx = x0 + t1 * dx, hy = y0 + t1 * dy, nx = hx / a, ny = hy / a, cosI = Math.max(1e-6, dx * nx + dy * ny), sgn = nx * dy - ny * dx >= 0 ? 1 : -1;
                const rdx = dx - 2 * cosI * nx, rdy = dy - 2 * cosI * ny, ell = 2 * a * cosI, rem = s - t1, nfull = Math.min(1e6, Math.floor(rem / ell)), res = rem - nfull * ell;
                const ang = sgn * nfull * (Math.PI - 2 * Math.acos(cosI)), ca = Math.cos(ang), sa = Math.sin(ang);
                const qx = hx * ca - hy * sa, qy = hx * sa + hy * ca, ex = rdx * ca - rdy * sa, ey = rdx * sa + rdy * ca;
                px = qx + res * ex; py = qy + res * ey; nref = 1 + nfull;
              }
              const w = wgt(t2) * (kind === 'tunnel' ? Math.pow(R_TUN, nref) : 1);
              const bi = clamp(Math.floor((px + a) / W0 * NB), 0, NB - 1), bj = clamp(Math.floor((py + a) / W0 * NB), 0, NB - 1);
              for (let c = 0; c < 3; c++) bins[c][bj * NB + bi] += w * DIES[d].rgb[c] / 255;
            }
          }
        }
        // statistics over the bins that belong to the rod
        const inside = (i, j) => sect === 'sq' || Math.hypot((i + 0.5) / NB * W0 - a, (j + 0.5) / NB * W0 - a) < a - 0.2;
        let n = 0, mn = Infinity, bal = 0; const sum = [0, 0, 0];
        for (let j = 0; j < NB; j++) for (let i = 0; i < NB; i++) if (inside(i, j)) { n++; for (let c = 0; c < 3; c++) sum[c] += bins[c][j * NB + i]; }
        const mean = (sum[0] + sum[1] + sum[2]) / (3 * Math.max(1, n));
        for (let j = 0; j < NB; j++) for (let i = 0; i < NB; i++) if (inside(i, j)) {
          const r = bins[0][j * NB + i], g = bins[1][j * NB + i], b = bins[2][j * NB + i];
          mn = Math.min(mn, (r + g + b) / 3); bal += Math.max(r, g, b) > 0 ? Math.min(r, g, b) / Math.max(r, g, b) : 0;
        }
        return { bins, NB, n, mean, U: mean > 0 ? Math.min(1, mn / mean) : 0, bal: bal / Math.max(1, n), th, inside, sum };
      };
      // the light that gets through a hollow tunnel: the mean number of reflections of the rays, with 3 % lost at each
      const tunnelT = (L, cone) => {
        const tmax = Math.tan(Math.min(cone, 60) * D2R); let s = 0, wsum = 0;
        for (let p = 0; p < 24; p++) for (let q = 0; q < 24; q++) {
          const tx = ((p + 0.5) / 24 * 2 - 1) * tmax, ty = ((q + 0.5) / 24 * 2 - 1) * tmax, t2 = tx * tx + ty * ty; if (t2 > tmax * tmax) continue;
          const w = 1 / ((1 + t2) * (1 + t2)); wsum += w; s += w * Math.pow(R_TUN, (Math.abs(tx) + Math.abs(ty)) * L / W0);
        }
        return wsum ? s / wsum : 0;
      };
      let cache = { key: '' };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, y0 = Hh * 0.5;
        const key = [V.L, V.cone, V.kind, V.sect].join();
        if (cache.key !== key) {
          const r = compute(V.L, V.cone, V.kind, V.sect, 28, V.sect === 'sq' ? 3 : 2, 25000, 4e6); r.key = key; cache = r;
          const l1 = [], l2 = []; for (let i = 0; i <= 12; i++) { const L = 5 + 115 * i / 12, q = compute(L, V.cone, V.kind, V.sect, 14, V.sect === 'sq' ? 2 : 1, 15000, 6e5); l1.push([L, 100 * q.U]); l2.push([L, 100 * q.bal]); }
          plot.set({ series: [{ pts: l1, label: 'uniformity' }, { pts: l2, label: 'colour balance' }], vlines: [{ x: V.L, label: 'L' }] });
        }
        const r = cache, tanI = Math.tan(r.th);
        // side view
        const left = 14, rodW = W * 0.58, s = Math.min(rodW / V.L, 44), x1 = left, x2 = left + s * V.L, hh = W0 / 2 * s;
        c.fillStyle = S.glass(V.kind === 'glass' ? 0.3 : 0.08); c.fillRect(x1, y0 - hh, x2 - x1, 2 * hh);
        c.save(); c.strokeStyle = V.kind === 'glass' ? S.edge() : S.metal(); c.lineWidth = V.kind === 'glass' ? 1.3 : 3; c.beginPath(); c.moveTo(x1, y0 - hh); c.lineTo(x2, y0 - hh); c.moveTo(x1, y0 + hh); c.lineTo(x2, y0 + hh); c.stroke(); c.restore();
        for (const [k, col] of [[1, S.nm(600)], [0.5, S.nm(600)], [0, S.nm(600)], [-0.5, S.nm(600)], [-1, S.nm(600)]]) {
          const t = k * tanI; let z = 0, y = 0, dir = t >= 0 ? 1 : -1; const pts = [[x1, y0]];
          if (Math.abs(t) > 1e-6) for (let g = 0; g < 400 && z < V.L; g++) {
            const dz = ((dir > 0 ? W0 / 2 - y : y + W0 / 2)) / Math.abs(t);
            if (z + dz >= V.L) { pts.push([x2, y0 - (y + dir * (V.L - z) * Math.abs(t)) * s]); z = V.L; break; }
            z += dz; y = dir * W0 / 2; pts.push([x1 + z * s, y0 - y * s]); dir = -dir;
          } else pts.push([x2, y0]);
          S.ray(c, pts, { color: col, width: 1, alpha: 0.85, arrows: false });
        }
        kit.label(c, 'entrance', x1, y0 + hh + 14, { align: 'left', color: C.muted, size: 11 }); kit.label(c, 'exit', x2, y0 + hh + 14, { align: 'right', color: C.muted, size: 11 });
        S.dim(c, x1, y0 - hh - 12, x2, y0 - hh - 12, V.L + ' mm × 5 mm', { off: -9, size: 11 });
        // the two faces
        const fs = Math.min(W * 0.17, Hh * 0.46), gx = W * 0.68, gy = y0 - fs - 14;
        const draw = (x, y, rgbOf, round) => {
          c.fillStyle = '#000'; c.fillRect(x, y, fs, fs);
          S.image(c, x, y, fs, fs, r.NB, r.NB, (u, v) => { const i = Math.min(r.NB - 1, Math.floor(u * r.NB)), j = Math.min(r.NB - 1, Math.floor(v * r.NB)); return r.inside(i, j) ? rgbOf(i, j) : [0, 0, 0]; }, { key: r.key, id: 'lp', smooth: false });
          if (round) { c.save(); c.strokeStyle = C.faint; c.beginPath(); c.arc(x + fs / 2, y + fs / 2, fs / 2, 0, 2 * Math.PI); c.stroke(); c.restore(); }
          c.strokeStyle = C.border || C.grid; c.strokeRect(x, y, fs, fs);
        };
        // entrance: the three dies
        c.fillStyle = '#000'; c.fillRect(gx, gy, fs, fs);
        for (const d of DIES) { c.fillStyle = 'rgb(' + d.rgb.join(',') + ')'; c.fillRect(gx + (d.x + 2.5 - 0.5) / W0 * fs, gy + (d.y + 2.5 - 0.5) / W0 * fs, fs / W0, fs / W0); }
        if (V.sect === 'rd') { c.save(); c.strokeStyle = C.faint; c.beginPath(); c.arc(gx + fs / 2, gy + fs / 2, fs / 2, 0, 2 * Math.PI); c.stroke(); c.restore(); }
        kit.label(c, 'the three dies at the entrance', gx + fs / 2, gy - 8, { align: 'center', color: C.muted, size: 11 });
        const ex = gx, ey = y0 + 24 + 6;
        draw(ex, ey, (i, j) => [0, 1, 2].map(k => clamp(255 * 0.7 * r.bins[k][j * r.NB + i] / Math.max(1e-9, r.sum[k] / r.n), 0, 255)), V.sect === 'rd');
        kit.label(c, 'the exit face', ex + fs / 2, ey + fs + 14, { align: 'center', color: C.muted, size: 11 });
        // numbers
        ro.set('ang', (r.th * R2D).toFixed(1) + '°' + (V.kind === 'glass' ? '  (glass narrows the cone)' : '  (in air; cones beyond 60° are not followed)'));
        ro.set('N', (V.L * tanI / W0).toFixed(1));
        ro.set('U', pct(r.U));
        ro.set('col', pct(r.bal));
        ro.set('T', V.kind === 'glass' ? 'all but the two end faces (about 8 %)' : pct(tunnelT(V.L, V.cone)));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a fibre-optic light guide */
  Hyper.sim('il-light-guide', {
    title: 'A fibre-optic light guide: cone, packing, length and broken fibres',
    blurb: `A lamp focuses a cone of light onto the polished face of a bundle of glass fibres; the bundle carries it round a bend and delivers it, mixed, from the other end. The two discs are the faces of the bundle, with the fibres drawn about seven times too large: on the left the part lit by the lamp's spot; on the right the output, in which the fibres have been shuffled (the bundle is incoherent) and any broken fibres show black. The curve is the transmission against length.

**Try this**
- Make the **spot** larger than the bundle: the light outside is lost. Make it smaller and only part of the fibres is lit, yet the output is spread over the whole end by the shuffling.
- Raise the **lamp's cone** above the bundle's acceptance angle (the dashed lines): the extra light is lost.
- Lengthen the guide: the curve falls slowly; most of the loss is at zero length (the gaps between fibres and the two end faces).
- Raise the **broken fibres**: black dots appear at both ends, and the transmission falls in proportion.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 330 });
      const plot = kit.plot(box.stage, { x: { label: 'length of the guide (m)', min: 0, max: 3, name: 'L' }, y: { label: 'light delivered (%)', min: 0, max: 100, name: 'T' }, series: [] }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'len', label: 'Length of the guide', min: 0.2, max: 3, step: 0.1, value: params.len || 1, unit: 'm' },
        { id: 'da', type: 'select', label: 'Active diameter of the bundle', options: [['3 mm', 3], ['5 mm', 5], ['8 mm', 8]], value: params.da || 5 },
        { id: 'ds', label: 'Diameter of the lamp\'s spot on the face', min: 2, max: 10, step: 0.1, value: params.ds || 5, unit: 'mm' },
        { id: 'cone', label: 'Half-angle of the cone from the lamp', min: 10, max: 60, step: 1, value: params.cone || 30, unit: '°' },
        { id: 'NA', label: 'Numerical aperture of the fibres', min: 0.3, max: 0.65, step: 0.01, value: params.NA || 0.56 },
        { id: 'att', label: 'Absorption of the glass', min: 0.3, max: 2, step: 0.1, value: 0.6, unit: 'dB/m' },
        { id: 'broken', label: 'Broken fibres', min: 0, max: 40, step: 1, value: 0, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['na', 'NA · acceptance half-angle'], ['nf', 'Fibres in the bundle (50 µm cores)'], ['spot', 'Spot that falls on the bundle'], ['cone', 'Light inside the acceptance cone'], ['T', 'Guide: packing, ends, absorption, breaks'], ['out', 'Delivered of the lamp\'s spot'], ['ends', 'Loss at each glass–air face']]);
      const PF = Math.PI / (2 * Math.sqrt(3)) * Math.pow(50 / 55, 2), R = O.normalR(1, 1.62);
      const trans = (L, v) => PF * Math.pow(1 - R, 2) * Math.pow(10, -v.att * L / 10) * (1 - v.broken / 100);
      // a hexagonal pattern of fibres in the unit disc, and a fixed shuffle for the incoherent bundle
      const ND = 15, fib = [];
      { const rho = 2 / ND, dy = rho * Math.sqrt(3) / 2; for (let j = -ND; j <= ND; j++) for (let i = -ND; i <= ND; i++) { const x = (i + (j & 1 ? 0.5 : 0)) * rho, y = j * dy; if (Math.hypot(x, y) <= 1 - rho * 0.45) fib.push([x, y]); } fib.rho = rho; }
      const perm = fib.map((_, i) => i).sort((a, b) => hash(a, 7) - hash(b, 7));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, y0 = Hh * 0.36;
        const fa = Math.min(1, Math.pow(V.da / V.ds, 2)), thA = Math.asin(V.NA), thL = V.cone * D2R;
        const fc = Math.min(1, Math.pow(V.NA / Math.sin(thL), 2)), Tg = trans(V.len, V), out = fa * fc * Tg;
        // the lamp, its cone, the ferrule, the bundle and the output cone
        const x1 = W * 0.27, x2 = W * 0.7, xl = 26;
        S.source(c, xl, y0, { kind: 'bulb', size: 16 });
        const ch = Math.min(60, (x1 - xl) * Math.tan(thL));
        c.save(); c.fillStyle = S.nm(590, 0.16); c.strokeStyle = S.nm(590, 0.8); c.lineWidth = 1; c.beginPath(); c.moveTo(xl + 12, y0 - ch); c.lineTo(x1, y0 - 4); c.lineTo(x1, y0 + 4); c.lineTo(xl + 12, y0 + ch); c.closePath(); c.fill(); c.stroke(); c.restore();
        const rad = 5 + V.da * 1.7;
        c.fillStyle = S.metal(); c.fillRect(x1 - 4, y0 - rad - 5, 14, 2 * rad + 10);
        const pts = []; for (let i = 0; i <= 24; i++) { const t = i / 24; pts.push([x1 + 10 + (x2 - x1 - 10) * t, y0 + 70 * Math.sin(Math.PI * t) * (t < 0.5 ? 1 : 1) - 0 * t]); }
        S.fibre(c, pts, { cladWidth: 2 * rad * 0.6, coreWidth: 2 * rad * 0.42 });
        c.fillStyle = S.metal(); c.fillRect(x2 - 4, y0 - rad - 5, 14, 2 * rad + 10);
        const oc = Math.min(110, W - x2 - 20);
        c.save(); c.fillStyle = S.nm(590, 0.1 + 0.2 * Math.min(1, out + 0.2)); c.strokeStyle = S.nm(590, 0.7); c.lineWidth = 1; c.beginPath(); c.moveTo(x2 + 10, y0 - 4); c.lineTo(x2 + 10 + oc, y0 - oc * Math.tan(thA)); c.lineTo(x2 + 10 + oc, y0 + oc * Math.tan(thA)); c.lineTo(x2 + 10, y0 + 4); c.closePath(); c.fill(); c.stroke();
        c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(x1, y0); c.lineTo(x1 - (x1 - xl) * 0.6, y0 - (x1 - xl) * 0.6 * Math.tan(thA)); c.moveTo(x1, y0); c.lineTo(x1 - (x1 - xl) * 0.6, y0 + (x1 - xl) * 0.6 * Math.tan(thA)); c.stroke(); c.restore();
        kit.label(c, 'acceptance cone', x1 - (x1 - xl) * 0.4, y0 - (x1 - xl) * 0.6 * Math.tan(thA) - 8, { color: C.muted, size: 10.5, align: 'center' });
        kit.label(c, 'ferrule', x1 + 3, y0 + rad + 18, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'output: a cone of up to ±' + (thA * R2D).toFixed(0) + '°', x2 + 40, y0 + oc * Math.tan(thA) + 14, { color: C.muted, size: 11, align: 'left' });
        // the two faces
        const fs = Math.min(W * 0.2, Hh * 0.32), R0 = fs / 2, fy = Hh - fs - 18, fx1 = W * 0.2, fx2 = W * 0.62;
        for (const [fx, out_] of [[fx1, false], [fx2, true]]) {
          const cx = fx + R0, cy = fy + R0;
          c.fillStyle = '#000'; c.beginPath(); c.arc(cx, cy, R0, 0, 2 * Math.PI); c.fill();
          fib.forEach((p, i) => {
            const src = out_ ? perm[i] : i, q = fib[src], lit = Math.hypot(q[0], q[1]) <= V.ds / V.da, broken = hash(src, 3) < V.broken / 100;
            c.fillStyle = broken ? '#000' : lit ? S.nm(590) : 'rgba(150,160,190,0.28)';
            c.beginPath(); c.arc(cx + p[0] * R0, cy + p[1] * R0, fib.rho * R0 * 0.44, 0, 2 * Math.PI); c.fill();
          });
          c.save(); c.strokeStyle = C.faint; c.beginPath(); c.arc(cx, cy, R0, 0, 2 * Math.PI); c.stroke();
          if (!out_) { c.strokeStyle = C.warn; c.setLineDash([4, 3]); c.beginPath(); c.arc(cx, cy, Math.min(1.6, V.ds / V.da) * R0, 0, 2 * Math.PI); c.stroke(); }
          c.restore();
          kit.label(c, out_ ? 'the output end' : 'the lamp end, with the spot (dashed)', cx, fy - 8, { align: 'center', color: C.muted, size: 11 });
        }
        // numbers
        ro.set('na', V.NA.toFixed(2) + ' · ±' + (thA * R2D).toFixed(0) + '°');
        ro.set('nf', Math.round(PF * Math.pow(V.da / 0.05, 2)).toLocaleString('en'));
        ro.set('spot', pct(fa) + (fa < 1 ? ' (the rest misses the bundle)' : V.ds < V.da - 0.05 ? ' (part of the bundle is not lit)' : ' (fills the bundle)'));
        ro.set('cone', pct(fc) + (fc < 1 ? ' (the rest is outside the cone)' : ''));
        ro.set('T', pct(Tg));
        ro.set('out', pct(out));
        ro.set('ends', O.fibre.fresnelLossDb(1.62).toFixed(2) + ' dB  (' + pct(R) + ')');
        plot.set({ series: [{ pts: [0, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3].map(L => [L, 100 * trans(L, V)]), label: 'T(L)' }], vlines: [{ x: V.len, label: 'L' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ the lamp end of a light guide */
  Hyper.sim('il-ferrule', {
    title: 'The ferrule at the lamp: spot, active diameter, cone and heat',
    blurb: `The lamp end of a light guide in the socket of a lamp house, in section. The lamp focuses a cone of light on a spot at best focus; the face of the ferrule may sit a little in front of that focus or behind it, and then the spot is larger. Only the light that lands on the active fibres, inside the acceptance cone of the bundle, goes into the guide; the rest is absorbed by the epoxy and the metal and heats the ferrule (drawn from cool to hot). The disc on the right is the face seen from the lamp.

**Try this**
- The start is the example of the page: a spot of 8 mm on a 5 mm bundle. Only 39 % enters and the rest heats the metal. Press **Focus the spot on the bundle**: everything enters, the heat falls to zero, and the irradiance on the face rises.
- Drag the **ferrule** along the axis, or use the position slider: a plug that is not pushed home (or too far in) enlarges the spot by $2\\delta\\tan\\theta$.
- Raise the **cone** above the acceptance angle of the bundle (NA 0.55 is 33°): the light outside the cone is lost, though the spot fits.
- Change the **active diameter** to 8 mm for the same spot: the larger bundle takes more of the spot.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'da', type: 'select', label: 'Active diameter of the bundle', options: [['3 mm', 3], ['5 mm', 5], ['8 mm', 8], ['10 mm', 10]], value: params.da || 5 },
        { id: 'ds0', label: 'Spot at best focus', min: 2, max: 12, step: 0.1, value: params.ds0 || 8, unit: 'mm' },
        { id: 'P', label: 'Power in the spot (after the heat filter)', min: 2, max: 60, step: 1, value: 20, unit: 'W' },
        { id: 'cone', label: 'Half-angle of the cone from the lamp', min: 10, max: 50, step: 1, value: 30, unit: '°' },
        { id: 'NA', label: 'Numerical aperture of the bundle', min: 0.3, max: 0.65, step: 0.01, value: 0.55 },
        { id: 'dz', label: 'Face in front of (−) or behind (+) the focus', min: -3, max: 3, step: 0.1, value: 0, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'fit', label: 'Focus the spot on the bundle', primary: true }, { id: 'home', label: 'Seat the plug fully' }] }
      ], id => { if (id === 'fit') ctl.set('ds0', Number(ctl.values.da.toFixed(1))); else if (id === 'home') ctl.set('dz', 0); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ds', 'Spot on the face'], ['ea', 'On the active fibres'], ['ec', 'Inside the acceptance cone'], ['in', 'Power entering the guide'], ['Q', 'Heat in the ferrule'], ['E', 'Irradiance in the spot'], ['who', 'What to do']]);
      let pos = null;
      kit.drag(st, { hover: true, hit: p => pos && p.x > pos.xf - 10 && p.x < pos.xf + 70 && Math.abs(p.y - pos.y0) < pos.hr + 12 ? 'f' : null, move: (w, p) => { if (pos) { ctl.set('dz', clamp(Math.round((p.x - pos.xf0 - 20) / pos.k * 10) / 10, -3, 3)); loop.once(); } } });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, y0 = Hh * 0.42;
        const th = V.cone * D2R, ds = V.ds0 + 2 * Math.abs(V.dz) * Math.tan(th);
        const fa = Math.min(1, Math.pow(V.da / ds, 2)), fc = Math.min(1, Math.pow(V.NA / Math.sin(th), 2)), enter = V.P * fa * fc, Q = V.P - enter;
        const k = Math.min(16, (Hh * 0.30) / (Math.max(V.da, ds) / 2 + 3)), wall = 2.2;
        const xf0 = W * 0.50, xf = xf0 + V.dz * k + 20, hr = (V.da / 2 + wall) * k;
        pos = { xf, xf0, y0, hr, k };
        // the lamp house: a lamp, its reflector and the cone
        S.source(c, 30, y0, { kind: 'bulb', size: 16 });
        const Lc = Math.min(xf0 + 20 - 90, Hh * 0.27 / Math.tan(th)), xs = xf0 + 20 - Lc, hh = Lc * Math.tan(th);
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(6, y0 - hh - 16, xs - 6, 2 * hh + 32); c.restore();
        kit.label(c, 'lamp house', 10, y0 - hh - 26, { align: 'left', color: C.faint, size: 10.5 });
        c.save(); c.strokeStyle = S.metal(); c.lineWidth = 3; c.beginPath(); c.arc(50, y0, Math.min(38, hh + 6), -1.9, 1.9); c.stroke(); c.restore();
        c.save(); c.fillStyle = S.nm(590, 0.14); c.strokeStyle = S.nm(590, 0.85); c.lineWidth = 1; c.beginPath(); c.moveTo(xs, y0 - hh); c.lineTo(xf0 + 20, y0 - V.ds0 * k / 2); c.lineTo(xf0 + 20, y0 + V.ds0 * k / 2); c.lineTo(xs, y0 + hh); c.closePath(); c.fill(); c.stroke();
        const ext = Math.min(80, (W - xf0 - 30)); c.beginPath(); c.moveTo(xf0 + 20, y0 - V.ds0 * k / 2); c.lineTo(xf0 + 20 + ext, y0 - V.ds0 * k / 2 - ext * Math.tan(th)); c.moveTo(xf0 + 20, y0 + V.ds0 * k / 2); c.lineTo(xf0 + 20 + ext, y0 + V.ds0 * k / 2 + ext * Math.tan(th)); c.setLineDash([3, 4]); c.globalAlpha = 0.5; c.stroke(); c.restore();
        // the socket and the ferrule, hotter as more power is lost in it
        const hot = clamp(Q / 25, 0, 1), mix = (a, b) => Math.round(a + (b - a) * hot), metal = 'rgb(' + mix(120, 235) + ',' + mix(135, 70) + ',' + mix(170, 40) + ')';
        const sx = xf0 + 8, sh = hr + 14;
        c.fillStyle = C.surface; c.fillRect(sx, y0 - sh - 8, W - sx - 10, 2 * sh + 16); c.strokeStyle = C.axis; c.strokeRect(sx, y0 - sh - 8, W - sx - 10, 2 * sh + 16);
        c.fillStyle = C.bg2; c.fillRect(sx + 1, y0 - hr - 4, W - sx - 12, 2 * hr + 8);
        c.fillStyle = metal; c.fillRect(xf, y0 - hr, W - xf - 12, 2 * hr);
        c.fillStyle = '#5a4a30'; c.fillRect(xf, y0 - (V.da / 2 + 0.7) * k, W - xf - 12, (V.da + 1.4) * k);
        c.fillStyle = S.glass(0.55); c.fillRect(xf, y0 - V.da / 2 * k, W - xf - 12, V.da * k);
        for (let i = 1; i < 6; i++) { c.strokeStyle = 'rgba(255,255,255,0.18)'; c.beginPath(); c.moveTo(xf, y0 - V.da / 2 * k + V.da * k * i / 6); c.lineTo(W - 12, y0 - V.da / 2 * k + V.da * k * i / 6); c.stroke(); }
        // the spot on the face: yellow on the fibres, red where it falls on epoxy and metal
        const yS = ds / 2 * k, yA = V.da / 2 * k;
        c.fillStyle = S.nm(590, 0.9); c.fillRect(xf - 5, y0 - Math.min(yS, yA), 5, 2 * Math.min(yS, yA));
        if (yS > yA) { c.fillStyle = C.bad; c.fillRect(xf - 5, y0 - Math.min(yS, hr), 5, Math.min(yS, hr) - yA); c.fillRect(xf - 5, y0 + yA, 5, Math.min(yS, hr) - yA); }
        kit.label(c, 'the lamp\'s image', xf0 + 20, y0 - hr - 34, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'ferrule: metal sleeve, epoxy and fibres', W - 14, y0 + sh + 22, { align: 'right', color: C.muted, size: 11 });
        kit.label(c, 'socket in the lamp house', (sx + W) / 2, y0 - sh - 18, { align: 'center', color: C.faint, size: 11 });
        // the face seen from the lamp
        const fr = Math.min(W * 0.08, Hh * 0.13), cx = W * 0.5, cy = Hh - fr - 24, kk = fr / (V.da / 2 + wall + 1.5);
        c.fillStyle = C.surface; c.beginPath(); c.arc(cx, cy, fr, 0, 2 * Math.PI); c.fill();
        c.fillStyle = metal; c.beginPath(); c.arc(cx, cy, (V.da / 2 + wall) * kk, 0, 2 * Math.PI); c.fill();
        c.fillStyle = S.glass(0.7); c.beginPath(); c.arc(cx, cy, V.da / 2 * kk, 0, 2 * Math.PI); c.fill();
        c.save(); c.fillStyle = S.nm(590, 0.5); c.beginPath(); c.arc(cx, cy, Math.min(ds / 2 * kk, fr), 0, 2 * Math.PI); c.fill();
        c.strokeStyle = C.warn; c.setLineDash([4, 3]); c.beginPath(); c.arc(cx, cy, Math.min(ds / 2 * kk, fr), 0, 2 * Math.PI); c.stroke(); c.restore();
        kit.label(c, 'the face: ' + V.da + ' mm active, spot ' + ds.toFixed(1) + ' mm', cx, cy + fr + 14, { align: 'center', color: C.muted, size: 11 });
        // numbers
        ro.set('ds', ds.toFixed(1) + ' mm  (' + V.ds0.toFixed(1) + ' mm at best focus)');
        ro.set('ea', pct(fa));
        ro.set('ec', pct(fc) + (fc < 1 ? ' (cone wider than the acceptance angle ' + (Math.asin(V.NA) * R2D).toFixed(0) + '°)' : ''));
        ro.set('in', enter.toFixed(1) + ' W of ' + V.P + ' W');
        ro.set('Q', Q.toFixed(1) + ' W');
        ro.set('E', (V.P / (Math.PI * Math.pow(ds / 10, 2) / 4)).toFixed(0) + ' W/cm²');
        ro.set('who', Q < 0.05 * V.P ? 'the spot fits: nothing is wasted' : fa < 0.9 ? 'the spot is larger than the bundle: refocus or use a larger bundle' : 'the cone is wider than the bundle accepts: use a slower cone');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a Fresnel lens and the solid lens it replaces */
  Hyper.sim('il-fresnel', {
    title: 'A Fresnel lens and the solid lens it replaces',
    blurb: `The upper halves of two lenses of the same focal length and diameter, with parallel light entering from the left. **Above** a Fresnel lens: a thin sheet, flat on the left, with concentric facets on the right, each cut with the slope that would focus the light at its radius. **Below** the solid plano-convex lens (curved face towards the light, the better way round) that does the same job. Rays are traced with real refraction at every facet. Pick the radius of the highlighted ray with the slider (or drag in the upper panel).

**Try this**
- Lower the **pitch** from 4 mm to 0.3 mm: the grooves vanish into a thin sheet, the blur at the focus falls to a fraction of a millimetre, and the lens is better than the singlet, whose spherical aberration cannot be cut away.
- Raise the pitch to 8 mm: the focus smears by about the pitch, because each facet is a flat prism.
- Follow the facet slope as you move the ray out: it grows with the radius, but more slowly than the slope of a sphere.
- Compare the thickness and the mass: the Fresnel sheet is about a seventh as thick and a fifth the weight at the starting values, and the gap widens as the pitch shrinks.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys, Sh = O.shape;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 380 });
      const MATS = [['Acrylic (PMMA)', 'PMMA'], ['Polycarbonate', 'PC'], ['Glass (N-BK7)', 'N-BK7']];
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Focal length', min: 100, max: 400, step: 5, value: params.f || 150, unit: 'mm' },
        { id: 'D', label: 'Diameter', min: 40, max: 120, step: 5, value: params.D || 100, unit: 'mm' },
        { id: 'p', label: 'Pitch of the grooves', min: 0.3, max: 8, step: 0.1, value: params.p || 4, log: true, sig: 2, unit: 'mm' },
        { id: 'mat', type: 'select', label: 'Material', options: MATS, value: params.mat || 'PMMA' },
        { id: 'r', label: 'Radius of the highlighted ray', min: 2, max: 55, step: 0.5, value: 40, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Refractive index'], ['al', 'Facet slope at the ray'], ['h', 'Groove depth there'], ['ng', 'Grooves from axis to rim'], ['th', 'Thickness: Fresnel · solid lens'], ['ms', 'Mass: Fresnel · solid lens'], ['bl', 'Blur at the focus (rms radius): Fresnel · solid'], ['warn', 'Check']]);
      let cache = { key: '' }, geo = null;
      const build = () => {
        const n = O.index(V.mat, 550), R = V.D / 2, key = [V.f, V.D, V.p, V.mat].join();
        if (cache.key === key) return cache;
        const fac = [], ng = Math.max(1, Math.ceil(R / V.p));
        let dmax = 0;
        for (let i = 0; i < ng; i++) { const r0 = i * V.p, r1 = Math.min((i + 1) * V.p, R), al = Sh.fresnelFacet((r0 + r1) / 2, V.f, n), dep = (r1 - r0) * Math.tan(al); fac.push({ r0, r1, al, dep, beta: Sy && O.snell(n, 1, al) }); dmax = Math.max(dmax, dep); }
        const tmin = 1, t = tmin + dmax, zf = t + V.f;
        // the blur at the focus of the facets, weighted by area
        let sw = 0, s2 = 0, dead = 0;
        for (let i = 0; i < 300; i++) {
          const r = (i + 0.5) / 300 * R, fi = fac[Math.min(ng - 1, Math.floor(r / V.p))];
          if (!Number.isFinite(fi.beta)) { dead++; continue; }
          const zs = t - (r - fi.r0) * Math.tan(fi.al), yf = r - (zf - zs) * Math.tan(fi.beta - fi.al);
          sw += r; s2 += r * yf * yf;
        }
        const blurF = sw > 0 ? Math.sqrt(s2 / sw) : NaN;
        // the solid plano-convex lens of the same focal length, curved face towards the light
        const Rc = (n - 1) * V.f, Dsol = Math.min(V.D, 1.9 * Rc), sag = Rc - Math.sqrt(Rc * Rc - Math.pow(Dsol / 2, 2));
        const sys = O.design.singlet({ f: V.f, glass: n, q: 1, D: Dsol, t: sag + 2 });
        const bf = Sy.bestFocus(sys, { nm: 550 }), sp = Sy.spot(sys, { nm: 550, z: bf.z, rings: 6 });
        const volS = Math.PI * sag * sag * (3 * Rc - sag) / 3 + Math.PI * Dsol * Dsol / 4 * 2;
        let volF = 0; for (const fi of fac) volF += Math.PI * (fi.r1 * fi.r1 - fi.r0 * fi.r0) * (t - fi.dep / 2);
        const rho = (O.MATERIALS[V.mat] && O.MATERIALS[V.mat].density) || 1.2;
        cache = { key, n, fac, ng, t, tmin, zf, blurF, dead, Rc, Dsol, sag, sys, bf, blurS: sp.rms, massF: volF * rho / 1000, massS: volS * rho / 1000, tS: sag + 2 };
        return cache;
      };
      kit.drag(st, { hover: true, hit: p => geo && p.y < geo.mid ? 'r' : null, move: (w, p) => { if (geo) { ctl.set('r', clamp(Math.round((geo.y1 - p.y) / geo.s * 2) / 2, 2, 55)); loop.once(); } } });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, g = build(), R = V.D / 2;
        const zMax = g.zf * 1.12, s = Math.min((W - 44) / (zMax + 8), (Hh / 2 - 34) / (R + 4)), x0 = 24 + 8 * s;
        const X = z => x0 + s * z, y1 = Hh / 2 - 12, y2 = Hh - 22, mid = Hh / 2;
        geo = { y1, s, mid };
        const rsel = Math.min(V.r, R - 0.01), fsel = g.fac[Math.min(g.ng - 1, Math.floor(rsel / V.p))];
        // ---- the Fresnel lens (upper panel)
        S.axis(c, X(-8), y1, X(zMax)); kit.label(c, 'Fresnel lens', 12, 16, { align: 'left', color: C.text, size: 12, weight: 650 });
        c.save(); c.beginPath(); c.moveTo(X(0), y1); c.lineTo(X(0), y1 - R * s); c.lineTo(X(g.t - g.fac[g.ng - 1].dep), y1 - R * s);
        for (let i = g.ng - 1; i >= 0; i--) { const f = g.fac[i]; c.lineTo(X(g.t - f.dep), y1 - f.r1 * s); c.lineTo(X(g.t), y1 - f.r0 * s); if (i > 0) c.lineTo(X(g.t - g.fac[i - 1].dep), y1 - f.r0 * s); }
        c.lineTo(X(0), y1); c.closePath(); c.fillStyle = S.glass(0.4); c.fill(); c.strokeStyle = S.edge(); c.lineWidth = 1.2; c.lineJoin = 'round'; c.stroke();
        if (fsel) { c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(X(g.t - fsel.dep), y1 - fsel.r1 * s); c.lineTo(X(g.t), y1 - fsel.r0 * s); c.stroke(); }
        c.restore();
        const radii = [0.12, 0.3, 0.48, 0.66, 0.84, 0.97].map(u => u * R).concat([rsel]);
        for (const r of radii) {
          const fi = g.fac[Math.min(g.ng - 1, Math.floor(r / V.p))], sel = r === rsel;
          const zs = g.t - (r - fi.r0) * Math.tan(fi.al), col = sel ? C.accent : S.nm(590);
          if (!Number.isFinite(fi.beta)) { S.ray(c, [[X(-8), y1 - r * s], [X(zs), y1 - r * s]], { color: C.bad, width: 1.2, arrows: false }); continue; }
          const gam = fi.beta - fi.al, zE = g.zf * 1.1, yE = r - (zE - zs) * Math.tan(gam);
          S.ray(c, [[X(-8), y1 - r * s], [X(zs), y1 - r * s], [X(zE), y1 - yE * s]], { color: col, width: sel ? 2 : 1, alpha: sel ? 1 : 0.7, arrows: false });
        }
        // ---- the solid lens (lower panel)
        const sol = g.sys, m2 = { X, Y: y => y2 - s * y };
        S.axis(c, X(-8), y2, X(zMax)); kit.label(c, 'Solid plano-convex lens (curved face to the light)', 12, mid + 8, { align: 'left', color: C.text, size: 12, weight: 650 });
        c.save(); c.beginPath(); c.rect(0, mid + 20, W, y2 - mid - 20); c.clip();
        S.system(c, sol, { x0, y0: y2, s, sy: s, X, Y: m2.Y, Z: x => (x - x0) / s, Yi: py => (y2 - py) / s });
        c.restore();
        for (const u of [0.12, 0.3, 0.48, 0.66, 0.84, 0.97]) {
          const r = u * g.Dsol / 2, tr = Sy.trace(sol, { p: [0, r, -8], d: [0, 0, 1] }, 550), zE = g.bf.z * 1.18;
          if (!tr.ok) continue;
          const e = Sy.at(tr, zE);
          S.ray(c, [[X(-8), y2 - r * s], [X(tr.pts[1][2]), y2 - tr.pts[1][1] * s], [X(tr.pts[2][2]), y2 - tr.pts[2][1] * s], [X(zE), y2 - e[1] * s]], { color: S.nm(590), width: 1, alpha: 0.7, arrows: false });
        }
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(X(g.zf), y1 - R * s * 0.5); c.lineTo(X(g.zf), y1 + 6); c.stroke(); c.restore();
        kit.label(c, 'focus', X(g.zf), y1 + 18, { align: 'center', color: C.warn, size: 11 });
        S.dim(c, X(0), y1 - R * s - 8, X(g.t), y1 - R * s - 8, 't = ' + g.t.toFixed(1) + ' mm', { off: -9, size: 11 });
        S.dim(c, X(0), y2 - g.Dsol / 2 * s - 8, X(g.tS), y2 - g.Dsol / 2 * s - 8, 't = ' + g.tS.toFixed(1) + ' mm', { off: -9, size: 11 });
        kit.label(c, 'upper halves drawn', W - 12, Hh - 8, { align: 'right', color: C.faint, size: 10.5 });
        // numbers
        ro.set('n', g.n.toFixed(3));
        ro.set('al', fsel ? (fsel.al * R2D).toFixed(1) + '° at r = ' + rsel.toFixed(1) + ' mm  (a sphere would have ' + (Math.atan(rsel / g.Rc) * R2D).toFixed(1) + '°)' : '—');
        ro.set('h', fsel ? (fsel.dep * 1000).toFixed(0) + ' µm' : '—');
        ro.set('ng', String(g.ng));
        ro.set('th', g.t.toFixed(1) + ' mm · ' + g.tS.toFixed(1) + ' mm');
        ro.set('ms', g.massF.toFixed(0) + ' g · ' + g.massS.toFixed(0) + ' g');
        ro.set('bl', (g.blurF * 1000).toFixed(0) + ' µm · ' + (g.blurS * 1000).toFixed(0) + ' µm');
        ro.set('warn', g.dead ? 'the outer facets are past the critical angle: no light gets out there' : g.Dsol < V.D ? 'the solid lens would be more than a hemisphere: drawn narrower (' + g.Dsol.toFixed(0) + ' mm)' : 'every facet works');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ projector illumination */
  Hyper.sim('il-projector', {
    title: 'A projector: the panel accepts only so much étendue',
    blurb: `The light of a source is limited by what the panel and the projection lens can accept. The source is a Lambertian emitter of luminance $L$ and emitting area $A_s$; the panel and its lens accept the étendue $G_p = \\pi A_p/(4N^2)$. The bars compare the two on a logarithmic scale; the flux through the panel is $L$ times the smaller of them. The three **presets** are illustrative values for the three kinds of source.

**Try this**
- Press **White LED**, then enlarge the **emitting area**: the source's étendue grows past the panel's, but the flux through the panel does not rise: only the luminance matters.
- Press **Short-arc lamp**: the same panel passes ten or twenty times as much light, from a source with a *smaller* area.
- Open the **lens** from f/4 to f/1.7: the panel accepts a wider cone and more of the source's light gets in, until the source's own étendue is the smaller.
- Set the **ambient light** to 300 lx: the same lumens give a much lower contrast.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Luminance of the source', min: 1e6, max: 1e9, value: 2e8, log: true, sig: 2, fmt: v => kit.fmt(v, 2) + ' cd/m²' },
        { id: 'As', label: 'Emitting area of the source (as the collector sees it)', min: 0.5, max: 40, value: 8, log: true, sig: 2, unit: 'mm²' },
        { id: 'pw', label: 'Width of the panel (16:9)', min: 6, max: 25, step: 0.5, value: 15, unit: 'mm' },
        { id: 'N', label: 'f-number of the projection lens', min: 1.7, max: 4, step: 0.1, value: 2.4 },
        { id: 'eta', label: 'Efficiency of the optics and the panel', min: 30, max: 80, step: 1, value: 50, unit: '%' },
        { id: 'scr', label: 'Width of the picture on the screen', min: 1, max: 6, step: 0.1, value: 2, unit: 'm' },
        { id: 'gain', label: 'Gain of the screen', min: 0.8, max: 2.5, step: 0.1, value: 1 },
        { id: 'amb', label: 'Ambient light on the screen', min: 0, max: 500, step: 5, value: 50, unit: 'lx' },
        { type: 'buttons', items: [{ id: 'led', label: 'White LED' }, { id: 'arc', label: 'Short-arc lamp' }, { id: 'las', label: 'Laser + phosphor' }] }
      ], id => {
        if (id === 'led') { ctl.set('L', 1e7); ctl.set('As', 12); } else if (id === 'arc') { ctl.set('L', 2e8); ctl.set('As', 8); } else if (id === 'las') { ctl.set('L', 1e9); ctl.set('As', 3); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['Gp', 'Étendue accepted by the panel and lens'], ['Gs', 'Étendue of the source (a hemisphere)'], ['lim', 'What limits the light'], ['Fs', 'Light the source radiates'], ['Fp', 'Light that can enter the panel'], ['Fscr', 'On the screen'], ['E', 'Screen illuminance · luminance'], ['con', 'White ÷ black with the ambient light']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const Ap = V.pw * V.pw * 9 / 16, Gp = O.photo.etendue(Ap, Math.atan(1 / (2 * V.N))), Gs = O.photo.etendue(V.As, Math.PI / 2);
        const Fs = V.L * Gs * 1e-6, Fp = V.L * Math.min(Gs, Gp) * 1e-6, Fscr = Fp * V.eta / 100;
        const Ascr = V.scr * V.scr * 9 / 16, E = Fscr / Ascr, Lw = E * V.gain / Math.PI, Lb = V.amb * V.gain / Math.PI;
        // the chain of blocks, with the flux between them
        const names = ['source', 'collector and integrator', 'panel and lens', 'screen'], bx = 14, bw = (W - 28 - 3 * 34) / 4, by = 36, bh = 50;
        const flux = [Fs, Fs, Fp, Fscr];
        for (let i = 0; i < 4; i++) {
          const x = bx + i * (bw + 34);
          c.fillStyle = i === 2 ? (Gp < Gs ? C.bad : C.surface) : C.surface; c.globalAlpha = i === 2 && Gp < Gs ? 0.35 : 1; c.fillRect(x, by, bw, bh); c.globalAlpha = 1;
          c.strokeStyle = C.axis; c.strokeRect(x, by, bw, bh);
          kit.label(c, names[i], x + bw / 2, by + bh / 2, { align: 'center', color: C.text, size: 11.5 });
          if (i < 3) {
            const t = clamp(flux[i + 1] / Math.max(1e-9, Fs), 0.04, 1), x2 = x + bw + 4;
            c.fillStyle = S.nm(590, 0.85); c.fillRect(x2, by + bh / 2 - 12 * t, 26, 24 * t);
            c.beginPath(); c.moveTo(x2 + 26, by + bh / 2 - 8); c.lineTo(x2 + 33, by + bh / 2); c.lineTo(x2 + 26, by + bh / 2 + 8); c.fill();
            kit.label(c, kit.fmt(flux[i + 1], 3) + ' lm', x2 + 15, by - 10, { align: 'center', color: C.muted, size: 11 });
          }
        }
        kit.label(c, kit.fmt(Fs, 3) + ' lm', bx + bw / 2, by + bh + 12, { align: 'center', color: C.muted, size: 11 });
        if (Gp < Gs) kit.label(c, 'étendue limit: ' + kit.fmt(Fs - Fp, 2) + ' lm lost here', bx + 2 * (bw + 34) + bw / 2, by + bh + 12, { align: 'center', color: C.bad, size: 11 });
        // the étendue bars on a logarithmic scale
        const bx0 = 40, bwid = W - 70, lg = g => clamp((Math.log10(g) + 1) / 4, 0, 1), by2 = 150, bs = 28;
        kit.label(c, 'Étendue (mm²·sr, logarithmic scale)', bx0, by2 - 14, { align: 'left', color: C.muted, size: 11.5 });
        c.strokeStyle = C.grid; c.fillStyle = C.faint;
        for (const g of [0.1, 1, 10, 100, 1000]) { const x = bx0 + bwid * lg(g); c.beginPath(); c.moveTo(x, by2); c.lineTo(x, by2 + 2 * bs + 22); c.stroke(); kit.label(c, String(g), x, by2 + 2 * bs + 34, { align: 'center', color: C.faint, size: 10.5 }); }
        const bar = (y, g, col, txt) => { c.fillStyle = col; c.fillRect(bx0, y, bwid * lg(g), bs - 6); kit.label(c, txt + '  ' + kit.fmt(g, 3), bx0 + 6, y + (bs - 6) / 2, { align: 'left', color: '#fff', size: 11.5, weight: 600 }); };
        bar(by2 + 6, Gs, Gs > Gp ? C.warn : C.ok, 'source');
        bar(by2 + 6 + bs, Gp, Gp < Gs ? C.ok : C.accent, 'panel and lens');
        kit.label(c, Gp < Gs ? 'The panel is the narrow part: the source cannot be used fully.' : 'The source is the narrow part: the panel could take more light from a larger source.', bx0, by2 + 2 * bs + 56, { align: 'left', color: Gp < Gs ? C.bad : C.ok, size: 12, weight: 600 });
        // numbers
        ro.set('Gp', Gp.toFixed(1) + ' mm²·sr  (panel ' + Ap.toFixed(0) + ' mm² at f/' + V.N.toFixed(1) + ')');
        ro.set('Gs', Gs.toFixed(1) + ' mm²·sr');
        ro.set('lim', Gp < Gs ? 'the panel (the source has more than it can take)' : 'the source (the panel could take more)');
        ro.set('Fs', kit.fmt(Fs, 3) + ' lm into a hemisphere');
        ro.set('Fp', kit.fmt(Fp, 3) + ' lm  (= L × the smaller étendue)');
        ro.set('Fscr', kit.fmt(Fscr, 3) + ' lm');
        ro.set('E', E.toFixed(0) + ' lx · ' + Lw.toFixed(0) + ' cd/m²');
        ro.set('con', Lb > 0 ? ((Lw + Lb) / Lb).toFixed(1) + ' : 1' : 'no ambient light: very high');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ a torch or a headlamp on a wall */
  Hyper.sim('il-beam', {
    title: 'A torch and a dipped headlamp on a wall',
    blurb: `The same lumens, spent differently. The picture is the light on a wall (or the road ahead) at the chosen distance, on a square-root brightness scale, white at the brightest point; the faint ring is where the illuminance falls to 0.25 lx, the level used to rate the reach of a torch. A **reflector** gives a hot spot with a wide skirt of spill; a **TIR lens** puts most of the light in a smooth core; the **dipped headlamp** has a wide beam and a sharp cut-off, with the line raised on the right (right-hand traffic). The beam shapes are smooth model curves, not measured patterns.

**Try this**
- Halve the **hot-spot angle** at the same lumens: the peak intensity goes up four times and the beam distance twice.
- Double the **lumens** with the beam unchanged: the intensity doubles, the reach grows only by √2.
- Switch from *reflector* to *TIR lens*: the skirt of spill shrinks and the core gets brighter for the same flux.
- Choose the *dipped headlamp* at 25 m: the light below the line is strong, above it almost none; the kerb side is lit higher than the oncoming side.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360 });
      const ctl = kit.controls(box.side, [
        { id: 'optics', type: 'select', label: 'Optics', options: [['Reflector: hot spot and spill', 'refl'], ['TIR lens: a smooth beam', 'tir'], ['Dipped headlamp with a cut-off', 'dip']], value: params.optics || 'refl' },
        { id: 'lm', label: 'Luminous flux of the lamp', min: 50, max: 3000, value: params.lm || 500, log: true, sig: 3, unit: 'lm' },
        { id: 'th', label: 'Half-angle of the beam core (to half intensity)', min: 2, max: 25, step: 0.5, value: params.th || 8, unit: '°' },
        { id: 'd', label: 'Distance to the wall or screen', min: 2, max: 100, value: params.d || 20, log: true, sig: 2, unit: 'm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['I', 'Peak intensity'], ['bd', 'Beam distance (to 0.25 lx)'], ['E', 'Illuminance at the centre of the pattern'], ['sp', 'Width of the half-intensity core on the wall'], ['fh', 'Share of the lumens in the core']]);
      const FWHM = 1.17741;
      // the shape of the pattern: relative intensity at an angle (θx right, θy up, degrees) for each kind of optics
      const model = () => {
        const k = V.optics, sh = V.th / FWHM;
        if (k === 'dip') {
          const sx = 2.6 * V.th / FWHM, sy = 0.45 * V.th / FWHM;
          return { k, f: (tx, ty) => {
            const cut = -0.57 + clamp(tx, 0, 6.5) * Math.tan(15 * D2R), g = Math.exp(-tx * tx / (2 * sx * sx) - Math.pow(ty + 1.2, 2) / (2 * sy * sy));
            return g * (ty <= cut ? 1 : Math.exp(-Math.pow((ty - cut) / 0.25, 2))) + 0.004 * Math.exp(-tx * tx / (2 * sx * sx * 2.2));
          }, fh: NaN, ss: sx };
        }
        const fh = k === 'tir' ? 0.85 : 0.5, ss = Math.min(k === 'tir' ? 2.5 * sh : 4 * sh, 38);
        const g = (t, s) => Math.exp(-t * t / (2 * s * s)) / (2 * Math.PI * s * s * D2R * D2R);
        return { k, fh, ss, f: (tx, ty) => { const t = Math.hypot(tx, ty); return fh * g(t, sh) + (1 - fh) * g(t, ss); } };
      };
      const calc = md => {
        // the flux: integrate the pattern over the angles the lamp covers
        let tot = 0;
        if (md.k === 'dip') { for (let tx = -60; tx <= 60; tx += 0.5) for (let ty = -20; ty <= 12; ty += 0.2) tot += md.f(tx, ty) * 0.5 * 0.2 * D2R * D2R; }
        else for (let t = 0.05; t < 90; t += 0.1) tot += md.f(t, 0) * 2 * Math.PI * Math.sin(t * D2R) * 0.1 * D2R;
        const scale = V.lm / tot, peak = (md.k === 'dip' ? (() => { let m = 0; for (let tx = -10; tx <= 30; tx += 0.5) for (let ty = -4; ty <= 1; ty += 0.1) m = Math.max(m, md.f(tx, ty)); return m; })() : md.f(0, 0)) * scale;
        return { scale, peak, I: (tx, ty) => md.f(tx, ty) * scale };
      };
      let bc = { key: '' };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, ck = [V.optics, V.lm, V.th].join();
        if (bc.key !== ck) { const m0 = model(); bc = { key: ck, md: m0, cl: calc(m0) }; }
        const md = bc.md, cl = bc.cl;
        const d = V.d, I0 = cl.peak, bd = Math.sqrt(I0 / 0.25);
        // the side view: the torch, its core and spill, and the wall
        const sy0 = 40, tx0 = 30, wx = Math.min(W - 36, tx0 + 26 / Math.tan(Math.max(V.th, 2) * D2R));
        c.fillStyle = S.metal(); c.fillRect(tx0 - 22, sy0 - 7, 24, 14); c.fillStyle = C.warn; c.fillRect(tx0 + 2, sy0 - 5, 3, 10);
        const core = Math.tan(V.th * D2R) * (wx - tx0), spill = Math.tan(Math.min(md.ss * 1.6, 70) * D2R) * (wx - tx0);
        c.save(); c.beginPath(); c.rect(0, 6, W, 66); c.clip();
        c.fillStyle = S.nm(590, 0.1); c.beginPath(); c.moveTo(tx0 + 4, sy0); c.lineTo(wx, sy0 - spill); c.lineTo(wx, sy0 + spill); c.closePath(); c.fill();
        c.fillStyle = S.nm(590, 0.3); c.beginPath(); c.moveTo(tx0 + 4, sy0); c.lineTo(wx, sy0 - core); c.lineTo(wx, sy0 + core); c.closePath(); c.fill(); c.restore();
        c.fillStyle = C.text; c.fillRect(wx, 8, 3, 62);
        kit.label(c, 'wall at ' + kit.fmt(d, 3) + ' m (the distance is not to scale)', wx - 6, 82, { align: 'right', color: C.muted, size: 11 });
        // the pattern on the wall: width in metres follows the beam
        let thc = V.th * 3; for (let t = 0.5; t < 85 && md.k !== 'dip'; t += 0.5) if (cl.I(t, 0) * Math.pow(Math.cos(t * D2R), 3) / (d * d) >= 0.25) thc = t;
        const hw = d * Math.tan(clamp(md.k === 'dip' ? 38 : 1.7 * thc, 4, 75) * D2R), iw = W - 24, ih = Hh - 126, mpp = 2 * hw / iw;   // metres per pixel
        const x0 = 12, y0 = 92, key = [md.k, V.lm.toFixed(1), V.th, d.toFixed(2)].join();
        S.image(c, x0, y0, iw, ih, 220, Math.max(20, Math.round(220 * ih / iw)), (u, v) => {
          const X = (u - 0.5) * 2 * hw, Y = md.k === 'dip' ? (0.6 - v) * ih * mpp / 3 : (0.5 - v) * ih * mpp;
          const r = Math.hypot(X, Y), tx = Math.atan2(X, d) * R2D, ty = Math.atan2(Y, Math.hypot(d, X)) * R2D, cosT = d / Math.hypot(d, r);
          const E = cl.I(md.k === 'dip' ? tx : Math.atan2(r, d) * R2D, md.k === 'dip' ? ty : 0) * cosT * cosT * cosT / (d * d);
          const lv = clamp(Math.pow(E / (I0 / (d * d)), 0.45), 0, 1);
          const ring = Math.abs(Math.log10(Math.max(E, 1e-3) / 0.25)) < 0.02;
          return ring ? [90, 200, 255] : [255 * Math.pow(lv, 0.9), 244 * Math.pow(lv, 0.95), 215 * Math.pow(lv, 1.1)];
        }, { key, id: 'beam' });
        c.save(); c.strokeStyle = C.border || C.grid; c.strokeRect(x0, y0, iw, ih); c.restore();
        // a ruler under the picture
        const rul = Math.pow(10, Math.floor(Math.log10(hw * 0.8))) * (hw * 0.8 / Math.pow(10, Math.floor(Math.log10(hw * 0.8))) >= 5 ? 5 : hw * 0.8 / Math.pow(10, Math.floor(Math.log10(hw * 0.8))) >= 2 ? 2 : 1);
        S.dim(c, x0 + 10, y0 + ih + 12, x0 + 10 + rul / mpp, y0 + ih + 12, kit.fmt(rul, 2) + ' m', { off: 12, size: 11 });
        kit.label(c, md.k === 'dip' ? 'the road ahead as the driver sees it (height stretched 3×): the sharp edge is the cut-off; the cyan line marks 0.25 lx' : 'the wall (the cyan line marks 0.25 lx; brightness on a square-root scale)', x0 + iw, y0 + ih + 12, { align: 'right', color: C.faint, size: 10.5 });
        // numbers
        ro.set('I', kit.fmt(I0, 3) + ' cd');
        ro.set('bd', md.k === 'dip' ? 'not used for a dipped beam: the cut-off decides' : kit.fmt(bd, 3) + ' m');
        ro.set('E', kit.fmt(I0 / (d * d), 3) + ' lx' + (md.k === 'dip' ? ' (brightest point just under the cut-off)' : ''));
        ro.set('sp', md.k === 'dip' ? '—' : kit.fmt(2 * d * Math.tan(V.th * D2R), 3) + ' m across');
        ro.set('fh', md.k === 'dip' ? 'a cut-off pattern: the light is under the line' : pct(md.fh) + ' in the core, the rest as spill');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ lighting a room, and glare in a luminaire */
  Hyper.sim('il-room', {
    title: 'Lighting a room: the lumen method, the map and the glare',
    blurb: `**Light on the work plane.** A plan of the room with a grid of luminaires; every point of the work plane is lit by all of them, with the inverse-square law and the cosines, and the map shows the result (the thin white line is the target illuminance). The plot shows a section along the room under a row of luminaires and half-way between two rows. Walls and ceiling would add some reflected light, which is not drawn. **Looking up at a luminaire** (switch the view): a louvre hides the lamp from low angles; the plot shows the luminance an observer sees at each elevation.

**Try this**
- Reduce the number of **columns** from four to two, so that the spacing is twice the height: the section dips between the luminaires and the uniformity falls below 0.6.
- Narrow the distribution (**q**) with the same lumens: more light under each luminaire and darker gaps — a narrow luminaire needs a close spacing.
- Raise the **height**: the room index falls, the illuminance falls as $1/h^2$ and the map evens out.
- *Looking up*: open the **blade depth** from 0 to 60 mm and watch the shielding angle and the visible lamp change; at low elevations the luminance falls from the lamp's to the blade's.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const plot = kit.plot(box.stage, { x: { label: 'distance along the room (m)', name: 'x' }, y: { label: 'illuminance (lx)', min: 0, name: 'E' }, series: [] }, 170);
      const MAP = ['L', 'W', 'h', 'cols', 'rows', 'Phi', 'q', 'MF', 'Et'], GLA = ['d', 'w', 'lw', 'e', 'Ll'];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'View', options: [['Light on the work plane', 'map'], ['Looking up at a luminaire (glare)', 'glare']], value: params.mode || 'map' },
        { id: 'L', label: 'Length of the room', min: 4, max: 20, step: 0.5, value: 8, unit: 'm' },
        { id: 'W', label: 'Width of the room', min: 3, max: 15, step: 0.5, value: 5, unit: 'm' },
        { id: 'h', label: 'Height of the luminaires above the work plane', min: 1.5, max: 6, step: 0.1, value: 2, unit: 'm' },
        { id: 'cols', label: 'Luminaires along the length', min: 1, max: 8, step: 1, value: 4 },
        { id: 'rows', label: 'Luminaires across the width', min: 1, max: 6, step: 1, value: 3 },
        { id: 'Phi', label: 'Flux of one luminaire', min: 500, max: 8000, value: 4000, log: true, sig: 3, unit: 'lm' },
        { id: 'q', label: 'Narrowness of the distribution  I = I₀ cos^q θ  (1 = cosine)', min: 0.5, max: 8, step: 0.1, value: 1 },
        { id: 'MF', label: 'Maintenance factor', min: 0.6, max: 1, step: 0.01, value: 0.8 },
        { id: 'Et', label: 'Target maintained illuminance', min: 100, max: 1000, step: 50, value: 500, unit: 'lx' },
        { id: 'd', label: 'Depth of the louvre blades', min: 0, max: 60, step: 1, value: 30, unit: 'mm' },
        { id: 'w', label: 'Width of one louvre cell', min: 50, max: 120, step: 1, value: 80, unit: 'mm' },
        { id: 'lw', label: 'Width of the lamp', min: 10, max: 50, step: 1, value: 24, unit: 'mm' },
        { id: 'e', label: 'Elevation of the line of sight above the horizontal', min: 1, max: 89, step: 1, value: 35, unit: '°' },
        { id: 'Ll', label: 'Luminance of the lamp', min: 3000, max: 1e7, value: 1e4, log: true, sig: 2, fmt: v => kit.fmt(v, 2) + ' cd/m²' }
      ], () => { showRows(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['K', 'Room index K'], ['UF', 'Share of the lamp lumens on the work plane (direct)'], ['Em', 'Average, maintained (direct light only)'], ['U', 'Uniformity  E_min ÷ E_av (0.5 m border left out)'], ['mm', 'E_max ÷ E_min'], ['sp', 'Spacing ÷ height'], ['ok', 'Against the target'],
        ['al', 'Shielding angle'], ['vis', 'Part of the lamp in view'], ['Lv', 'Luminance seen'], ['lim', 'Against a limit of 3000 cd/m²']]);
      const showRows = () => {
        const g = V.mode === 'glare';
        for (const id of MAP) ctl.show(id, !g); for (const id of GLA) ctl.show(id, g);
        for (const k of ['K', 'UF', 'Em', 'U', 'mm', 'sp', 'ok']) ro.show(k, !g); for (const k of ['al', 'vis', 'Lv', 'lim']) ro.show(k, g);
      };
      showRows();
      const clr = v => { v = clamp(v, 0, 1); const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }; return [30 + 225 * sm(0.35, 1, v), 25 + 205 * sm(0.1, 0.85, v), 80 * (1 - v) + 45 * sm(0.0, 0.3, v)]; };
      // illuminance on the work plane at (x, y): the sum over the luminaires
      const Eat = (x, y) => {
        const I0 = V.Phi * (V.q + 1) / (2 * Math.PI); let E = 0;
        for (let i = 0; i < V.cols; i++) for (let j = 0; j < V.rows; j++) {
          const dx = x - (i + 0.5) * V.L / V.cols, dy = y - (j + 0.5) * V.W / V.rows, r = Math.hypot(dx, dy), th = Math.atan2(r, V.h);
          E += Ph.illuminance(I0 * Math.pow(Math.cos(th), V.q), Math.hypot(r, V.h), th);
        }
        return E;
      };
      let mapCache = { key: '' };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (V.mode === 'glare') {
          mapCache = { key: '' };
          // ---- a louvre cell in section and an observer's line of sight
          const mm = Math.min(W * 0.5 / (V.w + 40), (Hh - 90) / (V.d + 40)), cx = W * 0.5, yc = 60, dd = V.d, a = V.lw / 2, hw = V.w / 2;
          const X = x => cx + x * mm, Y = y => yc + (dd - y) * mm;      // y: height above the louvre plane, the lamp plane at y = d
          c.fillStyle = C.surface; c.fillRect(0, 0, W, yc - 2); c.strokeStyle = C.axis; c.beginPath(); c.moveTo(0, yc - 2); c.lineTo(W, yc - 2); c.stroke();
          const e = V.e * D2R, vis = clamp((Math.min(a, hw - dd / Math.tan(e)) + a) / (2 * a), 0, 1);
          c.fillStyle = vis > 0 ? S.nm(590, 0.6 + 0.4 * vis) : 'rgba(150,160,190,0.35)'; c.fillRect(X(-a), yc - 2, 2 * a * mm, Math.max(5, 4 * mm));
          c.fillStyle = S.metal(); c.fillRect(X(-hw) - 1.5, yc - 2, 3, dd * mm + 2); c.fillRect(X(hw) - 1.5, yc - 2, 3, dd * mm + 2);
          c.fillRect(X(-hw - 60), yc - 4, 60 * mm, 3); c.fillRect(X(hw), yc - 4, 60 * mm, 3);
          kit.label(c, 'lamp', X(0), yc - 12, { align: 'center', color: C.muted, size: 11 });
          // the line of sight, from an observer on the right
          const ex = hw + 55 * Math.cos(e), ey = -55 * Math.sin(e);
          const xl = hw - dd / Math.tan(e);
          S.ray(c, [[X(ex), Y(ey)], [X(hw), Y(0)], [X(xl), Y(dd)]], { color: vis > 0 ? C.ok : C.bad, width: 1.6, arrows: false });
          S.eye(c, X(ex) + 6, Y(ey) + 6, 12, { dir: 1 });
          const al = Math.atan(dd / (hw + a));
          if (dd > 0) {
            c.save(); c.strokeStyle = C.warn; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(-a), Y(dd)); c.lineTo(X(hw), Y(0)); c.moveTo(X(hw), Y(0)); c.lineTo(X(hw) + 90, Y(0)); c.stroke(); c.restore();
            S.angle(c, X(hw), Y(0), 60, Math.PI, Math.PI + al, kit.fmt(al * R2D, 3) + '°', { color: C.warn });
          }
          S.dim(c, X(-hw), Y(0) + 16, X(hw), Y(0) + 16, 'cell ' + V.w + ' mm', { off: 12, size: 11 });
          kit.label(c, 'observer, ' + V.e + '° above the horizontal', X(ex) - 18, Y(ey) + 4, { align: 'right', color: C.muted, size: 11 });
          kit.label(c, vis >= 0.999 ? 'the whole lamp is in view' : vis > 0 ? 'part of the lamp is in view' : 'the lamp is hidden by the blade', cx, Hh - 14, { align: 'center', color: vis > 0 ? C.bad : C.ok, size: 12.5, weight: 650 });
          const Lseen = vis * V.Ll + (1 - vis) * 500, pts = []; for (let el = 1; el <= 89; el += 2) { const ee = el * D2R, vv = clamp((Math.min(a, hw - dd / Math.tan(ee)) + a) / (2 * a), 0, 1); pts.push([el, vv * V.Ll + (1 - vv) * 500]); }
          plot.set({ x: { label: 'elevation of the line of sight above the horizontal (°)', min: 0, max: 90, name: 'e' }, y: { label: 'luminance seen (cd/m²)', min: 0, name: 'L' }, series: [{ pts, label: 'luminance seen' }], vlines: [{ x: V.e, label: 'view' }, { x: 25, label: '65° from the vertical' }], hlines: [{ y: 3000, label: '3000' }, { y: 1000, label: '1000' }], marks: [] });
          ro.set('al', dd > 0 ? (al * R2D).toFixed(1) + '°  (arctan of ' + dd + ' mm over ' + (hw + a).toFixed(0) + ' mm)' : 'none: no louvre');
          ro.set('vis', pct(vis));
          ro.set('Lv', kit.fmt(Lseen, 3) + ' cd/m²');
          ro.set('lim', Lseen <= 1000 ? 'under 1000: good for screens' : Lseen <= 3000 ? 'between 1000 and 3000' : 'over 3000: too bright when seen low');
          return;
        }
        // ---- the plan and the map of the work plane
        const pad = 22, pw = W - 2 * pad - 70, ph = Hh - 2 * pad - 14, sc = Math.min(pw / V.L, ph / V.W), rw = V.L * sc, rh = V.W * sc, rx = pad + 30, ry = pad;
        const nx = 90, ny = Math.max(8, Math.min(90, Math.round(90 * V.W / V.L)));
        const key = [V.L, V.W, V.h, V.cols, V.rows, V.Phi, V.q, V.Et, V.MF].join();
        if (mapCache.key !== key) {
        const Es = []; let mn = Infinity, mx = 0, sum = 0, sumI = 0, nI = 0;
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
          const x = (i + 0.5) / nx * V.L, y = (j + 0.5) / ny * V.W, E = Eat(x, y); Es.push(E); sum += E;
          if (x >= 0.5 && x <= V.L - 0.5 && y >= 0.5 && y <= V.W - 0.5) { mn = Math.min(mn, E); mx = Math.max(mx, E); sumI += E; nI++; }   // the task area: 0.5 m in from the walls
        }
        const rowY1 = 0.5 * V.W / V.rows, rowY2 = Math.min(V.W, V.W / V.rows), a1 = [], a2 = [];
        for (let i = 0; i <= 60; i++) { const x = V.L * i / 60; a1.push([x, V.MF * Eat(x, rowY1)]); a2.push([x, V.MF * Eat(x, rowY2 >= V.W - 1e-9 ? V.W : rowY2)]); }
        mapCache = { key, Es, mn, mx, nI, av: sum / (nx * ny), avI: nI ? sumI / nI : sum / (nx * ny), a1, a2 };
        plot.set({ x: { label: 'distance along the room (m)', min: 0, max: V.L, name: 'x' }, y: { label: 'maintained illuminance (lx)', min: 0, name: 'E' }, series: [{ pts: a1, label: 'under a row' }, { pts: a2, label: 'between rows' }], vlines: [], hlines: [{ y: V.Et, label: 'target' }], marks: [] });
        }
        const { Es, mn, mx, nI, av, avI } = mapCache, Et = V.Et / V.MF;
        S.image(c, rx, ry, rw, rh, nx, ny, (u, v) => { const i = Math.min(nx - 1, Math.floor(u * nx)), j = Math.min(ny - 1, Math.floor(v * ny)), E = Es[j * nx + i]; return Math.abs(E / Et - 1) < 0.022 ? [255, 255, 255] : clr(E / (1.8 * Et)); }, { key: mapCache.key, id: 'room' });
        c.save(); c.strokeStyle = C.axis; c.strokeRect(rx, ry, rw, rh);
        for (let i = 0; i < V.cols; i++) for (let j = 0; j < V.rows; j++) { const px = rx + (i + 0.5) / V.cols * rw, py = ry + (j + 0.5) / V.rows * rh; c.fillStyle = 'rgba(255,255,255,0.95)'; c.strokeStyle = '#223'; c.beginPath(); c.arc(px, py, 5, 0, 2 * Math.PI); c.fill(); c.stroke(); }
        c.restore();
        kit.label(c, V.L + ' m', rx + rw / 2, ry + rh + 12, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, V.W + ' m', rx - 6, ry + rh / 2, { align: 'right', color: C.muted, size: 11 });
        kit.label(c, 'work plane seen from above; ○ luminaires; white line: target ' + V.Et + ' lx maintained (' + Et.toFixed(0) + ' lx new)', rx, ry + rh + 28, { align: 'left', color: C.faint, size: 10.5 });
        S.cells(c, rx + rw - 150, ry + rh + 22, 100, 9, 20, 1, u => clr(u), {}); kit.label(c, '0', rx + rw - 154, ry + rh + 27, { align: 'right', color: C.faint, size: 10 }); kit.label(c, '1.8 × target', rx + rw - 46, ry + rh + 27, { align: 'left', color: C.faint, size: 10 });
        const A = V.L * V.W, N = V.cols * V.rows, UF = av * A / (N * V.Phi), Em = av * V.MF, U = nI ? mn / avI : 0;
        const K = V.L * V.W / (V.h * (V.L + V.W));
        ro.set('K', K.toFixed(2));
        ro.set('UF', UF.toFixed(2) + '  (walls and ceiling would add reflected light)');
        ro.set('Em', Em.toFixed(0) + ' lx  (' + N + ' luminaires, ' + (N * V.Phi / A).toFixed(0) + ' lm/m²)');
        ro.set('U', U.toFixed(2) + (U >= 0.6 ? '  (0.6 asked for offices)' : '  (below the 0.6 asked for offices)'));
        ro.set('mm', nI ? (mx / Math.max(mn, 1e-9)).toFixed(2) : '—');
        ro.set('sp', (V.L / V.cols / V.h).toFixed(2) + ' along · ' + (V.W / V.rows / V.h).toFixed(2) + ' across');
        ro.set('ok', Em >= V.Et ? 'enough light' + (U < 0.6 ? ', but too uneven' : ' and even enough') : 'short by ' + (V.Et - Em).toFixed(0) + ' lx');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ daylight, a window and the daylight factor */
  Hyper.sim('il-daylight', {
    title: 'Daylight: the Sun, the sky and a window',
    blurb: `A section of a room 5 m deep and 2.7 m high with a window on the left (sill 0.9 m, head 2.2 m) and a building across the street. The Sun is drawn at the chosen elevation with the rays that come through the window and the patch they make on the floor; the arc is the angle of visible sky $\\theta$ above the obstruction. The first plot gives the model illuminance on a horizontal plane outdoors, the second the spectra of the Sun and of average daylight. The outdoor illuminance is a simple model fitted to typical clear-day values, not a standard.

**Try this**
- Lower the **Sun** towards the horizon: the outdoor illuminance falls from about 120 000 lx to a few hundred, and the patch of sunlight runs deep into the room (a long reach in winter, a short one in summer).
- Raise the **obstruction**: the angle of visible sky shrinks and the daylight factor with it; below the obstruction's elevation the Sun is hidden altogether.
- Widen the **window** or raise the glazing **transmittance**: the daylight factor rises in proportion.
- Switch to the **overcast** sky: the factor is the same, the indoor illuminance is the factor times 10 000 lx.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const plot1 = kit.plot(box.stage, { x: { label: 'elevation of the Sun (°)', min: 0, max: 90, name: 'β' }, y: { label: 'outdoors, horizontal plane (lx)', min: 100, max: 200000, log: true, name: 'E' }, series: [] }, 160);
      const plot2 = kit.plot(box.stage, { x: { label: 'wavelength (nm)', min: 380, max: 780, name: 'λ' }, y: { label: 'relative spectral power', min: 0, max: 1.8, name: 'S' }, series: [] }, 130);
      const ctl = kit.controls(box.side, [
        { id: 'sun', label: 'Elevation of the Sun', min: 2, max: 90, step: 1, value: params.sun || 45, unit: '°' },
        { id: 'sky', type: 'select', label: 'Sky', options: [['Clear sky and the Sun', 'clear'], ['Overcast (design sky, 10 000 lx)', 'over']], value: params.sky || 'clear' },
        { id: 'ww', label: 'Width of the window (1.3 m high)', min: 0.5, max: 6, step: 0.1, value: 3.1, unit: 'm' },
        { id: 'obs', label: 'Elevation of the building opposite', min: 0, max: 60, step: 1, value: 30, unit: '°' },
        { id: 'T', label: 'Transmittance of the glazing', min: 40, max: 90, step: 1, value: 70, unit: '%' },
        { id: 'R', label: 'Mean reflectance of the room surfaces', min: 20, max: 80, step: 1, value: 50, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sunE', 'Sun on a horizontal plane (model)'], ['skyE', 'Sky on a horizontal plane'], ['tot', 'Outdoors in total'], ['th', 'Angle of visible sky θ'], ['DF', 'Average daylight factor'], ['Ein', 'Indoors, average'], ['say', 'Verdict'], ['patch', 'Sunlight on the floor'], ['cct', 'Colour temperature: Sun · average daylight']]);
      const cct = id => { const xy = Cl.xy(Cl.xyz(Ph.spectrum(id))); return Cl.cct(xy[0], xy[1]); };
      const CCT = Math.round(cct('sun') / 50) * 50 + ' K · ' + Math.round(cct('daylight') / 50) * 50 + ' K';
      const am = b => 1 / (Math.sin(b * D2R) + 0.50572 * Math.pow(b + 6.07995, -1.6364));
      const sunH = b => 133800 * Math.exp(-0.2 * am(b)) * Math.sin(b * D2R), skyH = b => 400 + 14000 * Math.pow(Math.sin(b * D2R), 0.7);
      const SILL = 0.9, HEAD = 2.2, RD = 5, RH = 2.7, GAP = 8;
      const spec = id => { const f = Ph.spectrum(id), n = f(560) || 1, pts = []; for (let nm = 380; nm <= 780; nm += 10) pts.push([nm, f(nm) / n]); return pts; };
      plot2.set({ series: [{ pts: spec('sun'), label: 'the Sun' }, { pts: spec('daylight'), label: 'average daylight (D65)' }] });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const s = Math.min((W - 20) / (RD + GAP + 3.5), (Hh - 30) / 7), x0 = 10 + (GAP + 1.5) * s, yb = Hh - 14;
        const X = x => x0 + x * s, Y = y => yb - y * s;
        const b = V.sun * D2R, sunSees = V.sun > V.obs;
        // sky, ground, obstruction
        c.fillStyle = C.dark ? 'rgba(90,130,200,0.18)' : 'rgba(120,170,235,0.25)'; c.fillRect(0, 0, W, Y(0));
        c.fillStyle = C.surface; c.fillRect(0, Y(0), W, Hh - Y(0));
        const Ho = 1.55 + GAP * Math.tan(V.obs * D2R);
        c.fillStyle = C.dark ? '#262c48' : '#c3c9de'; c.fillRect(X(-GAP - 1), Y(Math.min(Ho, 7)), 1 * s, Y(0) - Y(Math.min(Ho, 7)));
        kit.label(c, 'building', X(-GAP - 0.5), Y(0) + 0, { align: 'center', color: C.faint, size: 10.5 });
        // the room, with the window in its left wall
        c.save(); c.strokeStyle = C.text; c.lineWidth = 2.2; c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(RD), Y(0)); c.lineTo(X(RD), Y(RH)); c.lineTo(X(0), Y(RH)); c.lineTo(X(0), Y(HEAD)); c.moveTo(X(0), Y(SILL)); c.lineTo(X(0), Y(0)); c.stroke();
        c.strokeStyle = S.nm(480); c.lineWidth = 3; c.beginPath(); c.moveTo(X(0), Y(SILL)); c.lineTo(X(0), Y(HEAD)); c.stroke(); c.restore();
        // the Sun and its rays through the window
        const cy = (SILL + HEAD) / 2, dx = Math.cos(b), dy = Math.sin(b);
        const tS = Math.min((X(0) - 26) / (dx * s), (Y(cy) - 26) / (dy * s)), sx = X(0) - tS * dx * s, sy = Y(cy) - tS * dy * s;
        S.source(c, sx, sy, { kind: 'sun', size: 12 });
        for (const yw of [SILL, (SILL + HEAD) / 2, HEAD]) {
          const p0 = [-dx * 12, yw + dy * 12];
          if (sunSees) {
            const xf = yw / Math.tan(b);
            S.ray(c, [[X(p0[0]), Y(p0[1])], [X(0), Y(yw)], xf <= RD ? [X(xf), Y(0)] : [X(RD), Y(yw - RD * Math.tan(b))]], { color: C.warn, width: 1.3, alpha: 0.85, arrows: false });
          } else S.ray(c, [[X(p0[0]), Y(p0[1])], [X(-GAP), Y(yw + GAP * Math.tan(b))]], { color: C.warn, width: 1, alpha: 0.35, dash: [4, 4], arrows: false });
        }
        const xn = SILL / Math.tan(b), xf = HEAD / Math.tan(b);
        if (sunSees && xn < RD) { c.fillStyle = S.nm(590, 0.85); c.fillRect(X(xn), Y(0) - 4, (Math.min(xf, RD) - xn) * s, 4); }
        // the angle of visible sky
        const th = 90 - V.obs;
        S.angle(c, X(0), Y(cy), 1.3 * s, -Math.PI / 2, -(Math.PI - V.obs * D2R), 'θ = ' + th + '°', { color: C.muted, size: 11 });
        kit.label(c, 'window', X(0.1), Y(HEAD) - 10, { align: 'left', color: C.muted, size: 10.5 });
        kit.label(c, 'sun elevation ' + V.sun + '°', 12, 16, { align: 'left', color: C.muted, size: 11 });
        // numbers
        const sE = sunSees ? sunH(V.sun) : 0, kE = skyH(V.sun);
        const Aw = 1.3 * V.ww, A = 2 * RD * 4 + 2 * (RD + 4) * RH, DF = (V.T / 100) * Aw * th / (A * (1 - Math.pow(V.R / 100, 2))) / 100;
        const Eout = V.sky === 'over' ? 10000 : kE, Ein = DF * Eout;
        ro.set('sunE', sunSees ? kit.fmt(sE, 3) + ' lx' : 'hidden behind the building');
        ro.set('skyE', V.sky === 'over' ? '10 000 lx (design overcast sky)' : kit.fmt(kE, 3) + ' lx');
        ro.set('tot', kit.fmt(V.sky === 'over' ? 10000 : sE + kE, 3) + ' lx');
        ro.set('th', th + '°');
        ro.set('DF', (100 * DF).toFixed(1) + ' %  (window ' + Aw.toFixed(1) + ' m² in ' + A.toFixed(0) + ' m² of surface)');
        ro.set('Ein', kit.fmt(Ein, 3) + ' lx from the ' + (V.sky === 'over' ? 'overcast sky' : 'clear sky (without the sun patch)'));
        ro.set('say', DF >= 0.05 ? 'well daylit (5 % or more)' : DF >= 0.02 ? 'daylight helps, electric light is needed (2–5 %)' : 'lit mainly by electricity (below 2 %)');
        ro.set('patch', sunSees ? (xf < 0.05 ? 'a thin strip at the window: the Sun is overhead' : xn < RD ? xn.toFixed(2) + ' m to ' + Math.min(xf, RD).toFixed(2) + ' m from the window wall' + (xf > RD ? ' (and up the back wall)' : '') : 'lands on the back wall') : 'none: the Sun is behind the building');
        ro.set('cct', CCT);
        const pts = [[], [], []]; for (let e = 1; e <= 90; e += 3) { pts[0].push([e, Math.max(100, sunH(e))]); pts[1].push([e, skyH(e)]); pts[2].push([e, Math.max(100, sunH(e) + skyH(e))]); }
        plot1.set({ series: [{ pts: pts[2], label: 'Sun and sky' }, { pts: pts[0], label: 'Sun' }, { pts: pts[1], label: 'sky' }], vlines: [{ x: V.sun, label: 'now' }], hlines: [{ y: 10000, label: 'overcast design sky' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* END OF PART 4 */
})();
