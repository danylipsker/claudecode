/* HYPER-OPTICS · sims/lens-design-forms.js — the lens families.
 *   lf-landscape    a meniscus with a stop in front: where to put the stop (traced; coma, astigmatism, field curvature)
 *   lf-petzval      two achromatic doublets with the stop between them: a sharp centre and a curved field (traced)
 *   lf-classics     the library triplet and double Gauss traced exactly; the Tessar drawn schematically beside its parent
 *   lf-twogroup     telephoto (positive front, negative rear) and retrofocus (negative front, positive rear): two thin groups
 *   lf-fisheye      mapping functions r(θ) of the fisheyes against the rectilinear lens, on a hallway and a dartboard
 *   lf-zoom         a two-group zoom and the classic variator + compensator, animated through the range
 *   lf-macro        magnification, extension, working f-number, depth of field and diffraction in close-up work
 *   lf-telecentric  an ordinary lens against an object-space telecentric one, when the object moves
 *   lf-mirror       a Cassegrain mirror lens: the central obstruction, the doughnut and the MTF
 *   lf-anamorphic   a cylindrical squeeze: top and side views, the desqueezed picture and the oval highlights
 *   lf-phone        the lens stack of a phone camera, schematic, with the numbers that govern it
 * The numbers come from kit.optics, the drawing from kit.osym. Where there is no published prescription (Tessar,
 * fisheye, zoom, macro, telecentric, anamorphic, phone) the layout is thin groups and ray-transfer matrices, and the
 * blurb says that the drawing is schematic.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const isNum = Number.isFinite, RINGS = 4;      // rings of rays in a spot diagram: 61 rays
  const sgn = (v, d) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(d == null ? 1 : d);

  /* where the tangential and sagittal fans of a field point focus: finite rays a hair either side of the chief ray.
     -> { zT, yT, zS, yS, z0 (the paraxial image plane) }, or null when the rays are cut off */
  function focalPoints(O, sys, field, nm, par) {
    const Sy = O.sys; par = par || Sy.paraxial(sys, nm);
    const e = 0.02, tr = (px, py) => Sy.trace(sys, Sy.aim(sys, px, py, field, par, nm), nm);
    const a = tr(0, e), b = tr(0, -e), c = tr(e, 0);
    if (!(a.ok && b.ok && c.ok)) return null;
    const det = -a.d[2] * b.d[1] + b.d[2] * a.d[1];
    if (Math.abs(det) < 1e-14 || Math.abs(c.d[0]) < 1e-14) return null;
    const dz = b.p[2] - a.p[2], dy = b.p[1] - a.p[1];
    const s = (-dz * b.d[1] + b.d[2] * dy) / det;
    const zT = a.p[2] + s * a.d[2], yT = a.p[1] + s * a.d[1];
    const t = -c.p[0] / c.d[0], zS = c.p[2] + t * c.d[2], yS = c.p[1] + t * c.d[1];
    if (![zT, yT, zS, yS].every(isNum)) return null;
    return { zT, yT, zS, yS, z0: par.zImage };
  }
  /* a one-slot cache: the optics are recomputed only when the key (the control values) changes */
  function memo() { let k = null, v = null; return (key, f) => { if (key !== k) { v = f(); k = key; } return v; }; }
  /* a round number of micrometres for the half-width of a spot box */
  function niceUm(v) { for (const L of [10, 20, 50, 100, 200, 500, 1000, 2000, 5000]) if (L >= v) return L; return 10000; }
  /* one spot diagram in a box: spot from O.sys.spot, half = half-size in px, halfUm = half-width in µm */
  function spotBox(c, kit, S, spot, cx, cy, half, halfUm, label, nm) {
    const C = kit.colors();
    c.fillStyle = C.surface; c.fillRect(cx - half, cy - half, 2 * half, 2 * half);
    S.spot(c, spot, cx, cy, half, half / (halfUm * 1e-3), { nm });
    kit.label(c, label, cx, cy - half - 9, { align: 'center', color: C.muted, size: 11.5 });
  }
  /* a spot summary: the largest radius from the centroid (µm) and the RMS diameter (µm) */
  const spotUm = sp => ({ geo: sp.geo * 1e3, rms: 2 * sp.rms * 1e3 });
  /* set the f-number of a system: the stop is resized so that the entrance pupil is f/N across (the rays are aimed at
     the stop itself, so a bundle fills it exactly) */
  function setFNumber(O, sys, N) {
    const Sy = O.sys, si = Sy.stopIndex(sys); delete sys.epd;
    const par = Sy.paraxial(sys, 550), sd = sys.surfaces[si].sd;
    if (isNum(par.epd) && par.epd > 0 && isNum(sd) && sd > 0) sys.surfaces[si].sd = sd * (par.efl / N) / par.epd;
    return sys;
  }

  /* ================================================================ the landscape lens */
  Hyper.sim('lf-landscape', {
    title: 'The landscape lens: a meniscus and a stop in front',
    blurb: `A single meniscus of N-BK7 glass, focal length 100 mm, with its concave side towards the scene and a stop standing in front of it — the 1812 landscape lens, traced ray by ray. The three boxes are spot diagrams at the best focus of three field angles; the dashed curves are where the tangential (T) and sagittal (S) rays really focus, and the vertical bar is the flat image plane.

**Try this**
- Set the stop **against the lens** (3 mm): the blur at the edge of the field is hundreds of micrometres across, because the focal surface is strongly curved and the coma is large.
- Press **Stop for zero coma**: the stop moves out to about a fifth of the focal length and the edge blur collapses to a few tens of micrometres. The T and S curves cross and lie close to the image plane.
- Move the stop out farther: coma changes sign and the two focal curves part again, with astigmatism of the opposite kind.
- Bend the meniscus more (q towards −4) and press the zero-coma button: the stop moves in to about 14 mm and the tangential focal surface bends the other way, but the axial blur more than doubles — spherical aberration rises with the bend.
- Close the stop to f/22: every blur shrinks, because the depth of focus grows — the cheapest way to flatten a field.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const F0 = 100;
      const ctl = kit.controls(box.side, [
        { id: 'stop', label: 'Stop in front of the lens', min: 3, max: 36, step: 0.1, value: params.stop != null ? params.stop : 22, unit: 'mm' },
        { id: 'q', label: 'Bend of the meniscus (shape factor q)', min: -4, max: -1, step: 0.1, value: params.q != null ? params.q : -2.2 },
        { id: 'N', label: 'f-number', min: 8, max: 22, step: 0.5, value: params.N || 11, fmt: v => 'f/' + kit.fmt(v, 3) },
        { id: 'fld', label: 'Field angle shown', min: 5, max: 30, step: 1, value: params.fld || 20, unit: '°' },
        { type: 'buttons', items: [{ id: 'zero', label: 'Stop for zero coma', primary: true }, { id: 'lens', label: 'Stop against the lens' }] }
      ], id => {
        if (id === 'zero') ctl.set('stop', zeroComa());
        else if (id === 'lens') ctl.set('stop', 3);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['efl', 'Focal length'], ['ap', 'Aperture'], ['pos', 'Stop distance'], ['coma', 'Coma sum S₂ (0 = none)'], ['r0', 'Blur on the axis (RMS Ø)'], ['r1', 'Blur at half the field'], ['r2', 'Blur at the field shown'], ['cur', 'Focus at the field shown']]);
      const plot = kit.plot(box.stage, { legend: true, x: { label: 'focus position relative to the on-axis image (mm)' }, y: { label: 'field angle (°)', min: 0, max: 30 } }, 190);
      // the meniscus, concave to the scene: both radii negative; the stop is a separate surface in front
      const build = (q, stop, N) => {
        const base = O.design.singlet({ f: F0, q, D: 40, t: 3.5 });
        const rs = base.surfaces.map(s => Math.abs(s.R)).filter(r => r > 0);
        const sd = Math.min(21, 0.9 * Math.min(...rs));
        const lens = base.surfaces.map(s => Object.assign({}, s, { stop: false, sd }));
        return setFNumber(O, { surfaces: [{ R: 0, t: stop, n: 1, sd: F0 / (2 * N), stop: true }].concat(lens) }, N);
      };
      const s2 = stop => Sy.seidel(build(V.q, stop, V.N), { field: 10 * D2R }).S2;
      const zeroComa = () => {
        let a = 3, b = 36, fa = s2(a), fb = s2(b);
        if (fa * fb > 0) return Math.abs(fa) < Math.abs(fb) ? a : b;
        for (let i = 0; i < 40; i++) { const mid = (a + b) / 2, fm = s2(mid); if (fa * fm <= 0) { b = mid; fb = fm; } else { a = mid; fa = fm; } }
        return Math.round((a + b) / 2 * 10) / 10;
      };
      const cache = memo();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // the optics are recomputed only when a control has moved; drawing is cheap
        const R = cache([V.stop, V.q, V.N, V.fld].join('|'), () => {
          const sys = build(V.q, V.stop, V.N), par = Sy.paraxial(sys, 550), fld = V.fld * D2R, fps = [], fields = [0, fld / 2, fld], res = [];
          for (let a = 0; a <= 30.01; a += 2.5) { const fp = focalPoints(O, sys, a * D2R, 550, par); if (fp) fps.push({ a, fp }); }
          for (const f of fields) {
            const bf = Sy.bestFocus(sys, { nm: 550, field: f, rings: RINGS, span: 15 });
            const sp = Sy.spot(sys, { nm: 550, field: f, z: bf.z, rings: RINGS });
            res.push({ sp, u: spotUm(sp) });
          }
          return { sys, par, fld, fps, fields, res, sd: Sy.seidel(sys, { field: fld }), fp: focalPoints(O, sys, fld, 550, par) };
        });
        const { sys, par, fld, fps, fields, res, sd, fp } = R, zi = par.zImage;
        const yh = Math.max(32, 1.12 * F0 * Math.tan(fld));
        const m = S.map(st, -24, zi + 6, yh, { left: 12, right: W * 0.33 });
        S.axis(c, m.X(-24), m.y0, m.X(zi + 6));
        S.system(c, sys, m);
        S.rays(c, Sy.fan2d(sys, { nm: 550, n: 5, zStart: -22 }), m, { nm: 550 });
        S.rays(c, Sy.fan2d(sys, { nm: 550, n: 5, field: fld, zStart: -22 }), m, { color: C.accent });
        S.screen(c, m.X(zi), m.y0, m.s * yh * 0.97, { label: 'image plane' });
        // the focal curves
        const T = fps.map(q => [m.X(q.fp.zT), m.Y(q.fp.yT)]), Sg = fps.map(q => [m.X(q.fp.zS), m.Y(q.fp.yS)]);
        S.ray(c, T, { color: C.warn, width: 1.8, arrows: false, dash: [6, 3] });
        S.ray(c, Sg, { color: C.ok, width: 1.8, arrows: false, dash: [2, 3] });
        if (T.length) { const t = T[T.length - 1], s = Sg[Sg.length - 1]; kit.label(c, 'T', t[0] - 10, t[1], { color: C.warn, weight: 650, align: 'right' }); kit.label(c, 'S', s[0] - 10, s[1] + 12, { color: C.ok, weight: 650, align: 'right' }); }
        kit.label(c, V.stop > 3.2 ? 'stop' : 'stop on the lens', m.X(0), m.y0 - m.s * (F0 / (2 * V.N)) - 16, { align: 'center', color: C.muted, size: 11.5 });
        // spot diagrams at best focus
        const halfUm = niceUm(1.2 * Math.max(...res.map(r => r.u.geo), 5));
        const half = Math.min(W * 0.12, (Hh - 56) / 6.4), cx = W * 0.665 + (W * 0.335 - 12) / 2 - 4;
        res.forEach((r, i) => {
          const cy = 30 + half + i * (2 * half + 24);
          spotBox(c, kit, S, r.sp, cx, cy, half, halfUm, kit.fmt(fields[i] * R2D, 3) + '°' + (r.sp.n ? '' : ' — cut off'), 550);
        });
        kit.label(c, 'boxes: ± ' + halfUm + ' µm', cx, Hh - 8, { align: 'center', color: C.faint, size: 11 });
        plot.set({ series: [{ pts: fps.map(q => [q.fp.zT - zi, q.a]), label: 'tangential (T)', color: C.warn }, { pts: fps.map(q => [q.fp.zS - zi, q.a]), label: 'sagittal (S)', color: C.ok, dash: true }], vlines: [{ x: 0, label: 'image plane' }] });
        ro.set('efl', par.efl.toFixed(1) + ' mm');
        ro.set('ap', 'f/' + par.fno.toFixed(1) + '  (Ø ' + par.epd.toFixed(1) + ' mm)');
        ro.set('pos', (V.stop / par.efl).toFixed(2) + ' f in front of the lens');
        ro.set('coma', (Math.abs(sd.S2) < 1e-3 ? 'almost none: ' : '') + sgn(sd.S2 * 1e3, 1) + ' × 10⁻³');
        ro.set('r0', res[0].u.rms.toFixed(0) + ' µm');
        ro.set('r1', res[1].sp.n ? res[1].u.rms.toFixed(0) + ' µm' : 'cut off');
        ro.set('r2', res[2].sp.n ? res[2].u.rms.toFixed(0) + ' µm' : 'cut off');
        ro.set('cur', fp ? 'T ' + sgn(fp.zT - zi, 2) + ' mm · S ' + sgn(fp.zS - zi, 2) + ' mm' : 'rays cut off');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the Petzval lens */
  Hyper.sim('lf-petzval', {
    title: 'The Petzval lens: sharp in the middle, curved at the edge',
    blurb: `Two achromatic doublets, each of 150 mm focal length, 75 mm apart with the stop between them — the arrangement of Petzval's 1840 portrait lens (the glass and radii are generic catalogue-style doublets, not Petzval's own prescription). Rays are traced exactly. The dashed curves show where the tangential (T) and sagittal (S) rays focus: both bow towards the lens, so a flat sensor can touch the focal surface at only one height.

**Try this**
- Press **Focus on the axis**: the centre is nearly as sharp as diffraction allows (an RMS blur of about 5 µm at f/3.6, the size of the Airy disc) while the boxes at 6° and 12° show growing blur.
- Press **Focus for the edge**: the edge sharpens and the centre goes soft — the compromise a portrait photographer calls "the swirl and the glow".
- Stop down from f/3.6 to f/8: nothing about the curved focal surface changes, but the blur circles shrink and the picture sharpens everywhere — the depth of focus grows in proportion to the f-number.
- Raise the field angle: past 15° the read-out "light at the edge" falls — the long tube vignettes the oblique beams, which is the cat's-eye shape of out-of-focus highlights.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const A = O.design.achromat({ f: 150, D: 56 }), GAP = 75;
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'f-number', min: 2.8, max: 8, step: 0.1, value: params.N || 3.6, fmt: v => 'f/' + kit.fmt(v, 3) },
        { id: 'fld', label: 'Field angle shown', min: 4, max: 18, step: 1, value: params.fld || 12, unit: '°' },
        { id: 'plane', label: 'Image plane position', min: -6, max: 1, step: 0.05, value: 0, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'axis', label: 'Focus on the axis', primary: true }, { id: 'edge', label: 'Focus for the edge' }] }
      ], id => {
        if (id === 'axis') ctl.set('plane', 0);
        else if (id === 'edge') { const sys = build(V.N), b0 = Sy.bestFocus(sys, { nm: 550, rings: RINGS, span: 12 }), bf = Sy.bestFocus(sys, { nm: 550, field: V.fld * D2R, rings: RINGS, span: 12 }); ctl.set('plane', Math.max(-6, Math.min(1, Math.round((bf.z - b0.z) * 20) / 20))); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['efl', 'Focal length · f-number'], ['pz', 'Petzval radius'], ['ts', 'Focus at the field shown'], ['r0', 'Blur on the axis (RMS Ø)'], ['r2', 'Blur at the field shown'], ['lit', 'Light at the field shown']]);
      const plot = kit.plot(box.stage, { legend: true, x: { label: 'focus position relative to the on-axis image (mm)' }, y: { label: 'field angle (°)', min: 0, max: 18 } }, 190);
      const build = N => {
        const ss = [];
        A.surfaces.forEach(s => ss.push(Object.assign({}, s, { stop: false })));
        ss[ss.length - 1].t = GAP / 2;
        ss.push({ R: 0, t: GAP / 2, n: 1, sd: 100 / (2 * N), stop: true });
        A.surfaces.forEach(s => ss.push(Object.assign({}, s, { stop: false })));
        return setFNumber(O, { surfaces: ss }, N);
      };
      const cache = memo();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const R = cache(V.N + '|' + V.fld, () => {
          const sys = build(V.N), par = Sy.paraxial(sys, 550), fld = V.fld * D2R, fps = [];
          for (let a = 0; a <= 18.01; a += 1.5) { const fp = focalPoints(O, sys, a * D2R, 550, par); if (fp) fps.push({ a, fp }); }
          return { sys, par, fld, fps, zi: Sy.bestFocus(sys, { nm: 550, rings: RINGS, span: 12 }).z, sd: Sy.seidel(sys, { field: fld }), fp: focalPoints(O, sys, fld, 550, par) };
        });
        const { sys, par, fld, fps, zi, sd, fp } = R, zp = zi + V.plane;
        const yh = Math.max(34, 1.12 * par.efl * Math.tan(fld));
        const m = S.map(st, -34, zi + 8, yh, { left: 12, right: W * 0.33 });
        S.axis(c, m.X(-34), m.y0, m.X(zi + 8));
        S.system(c, sys, m);
        S.rays(c, Sy.fan2d(sys, { nm: 550, n: 5, zStart: -32, zEnd: zp }), m, { nm: 550 });
        S.rays(c, Sy.fan2d(sys, { nm: 550, n: 5, field: fld, zStart: -32, zEnd: zp }), m, { color: C.accent });
        S.screen(c, m.X(zp), m.y0, m.s * yh * 0.97, { label: 'image plane' });
        const T = fps.map(q => [m.X(q.fp.zT), m.Y(q.fp.yT)]), Sg = fps.map(q => [m.X(q.fp.zS), m.Y(q.fp.yS)]);
        S.ray(c, T, { color: C.warn, width: 1.8, arrows: false, dash: [6, 3] });
        S.ray(c, Sg, { color: C.ok, width: 1.8, arrows: false, dash: [2, 3] });
        if (T.length) { const t = T[T.length - 1], s = Sg[Sg.length - 1]; kit.label(c, 'T', t[0] - 10, t[1], { color: C.warn, weight: 650, align: 'right' }); kit.label(c, 'S', s[0] - 10, s[1] + 12, { color: C.ok, weight: 650, align: 'right' }); }
        const si = Sy.stopIndex(sys), zs = par.zs;
        kit.label(c, 'stop', m.X(zs[si]), m.y0 - m.s * sys.surfaces[si].sd - 14, { align: 'center', color: C.muted, size: 11.5 });
        const fields = [0, fld / 2, fld], res = [];
        for (const f of fields) {
          const sp = Sy.spot(sys, { nm: 550, field: f, z: zp, rings: RINGS });
          res.push({ sp, u: spotUm(sp) });
        }
        const halfUm = niceUm(1.2 * Math.max(...res.map(r => r.u.geo), 5));
        const half = Math.min(W * 0.12, (Hh - 56) / 6.4), cx = W * 0.665 + (W * 0.335 - 12) / 2 - 4;
        res.forEach((r, i) => {
          const cy = 30 + half + i * (2 * half + 24);
          spotBox(c, kit, S, r.sp, cx, cy, half, halfUm, kit.fmt(fields[i] * R2D, 3) + '°' + (r.sp.n ? '' : ' — cut off'), 550);
        });
        kit.label(c, 'boxes: ± ' + halfUm + ' µm, on the image plane', cx, Hh - 8, { align: 'center', color: C.faint, size: 11 });
        plot.set({ series: [{ pts: fps.map(q => [q.fp.zT - zi, q.a]), label: 'tangential (T)', color: C.warn }, { pts: fps.map(q => [q.fp.zS - zi, q.a]), label: 'sagittal (S)', color: C.ok, dash: true }], vlines: [{ x: V.plane, label: 'image plane' }] });
        const n0 = res[0].sp.n;
        ro.set('efl', par.efl.toFixed(1) + ' mm · f/' + par.fno.toFixed(1));
        ro.set('pz', sgn(sd.petzvalRadius, 0) + ' mm  (' + sgn(sd.petzvalRadius / par.efl, 2) + ' f)');
        ro.set('ts', fp ? 'T ' + sgn(fp.zT - zi, 2) + ' mm · S ' + sgn(fp.zS - zi, 2) + ' mm' : 'rays cut off');
        ro.set('r0', res[0].u.rms.toFixed(1) + ' µm');
        ro.set('r2', res[2].sp.n ? res[2].u.rms.toFixed(0) + ' µm' : 'cut off');
        ro.set('lit', n0 ? Math.min(100, Math.round(100 * res[2].sp.n / n0)) + ' % of the axial beam' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ triplet, Tessar form, double Gauss */
  Hyper.sim('lf-classics', {
    title: 'Three classic anastigmats on the ray bench',
    blurb: `The double Gauss (f = 100 mm, f/3, six elements) and the Cooke triplet (f = 50 mm, f/5, three elements) are real prescriptions, traced ray by ray. The third choice puts the triplet beside a **schematic** drawing of the Tessar form: the same lens with its last element replaced by a cemented pair (the Tessar drawing is not a calculated design, so it has no rays).

**Try this**
- On the **double Gauss**, compare f/3 with f/5.6: every box shrinks about fourfold, and by f/8 the blur is far below the Airy disc. The high-order aberrations of the wide aperture, not the glass, set the blur at f/3.
- Read the **Petzval radius**: about six focal lengths for the double Gauss against two and a half for the triplet. The Gauss glass choice (high-index crowns, low-index flints) is why its field is the flatter one.
- Switch the light to **blue** and **red**: the blur boxes shift and the centroid moves sideways at the edge — lateral colour, small but never zero.
- In the **Tessar** view count the glass-to-air surfaces: the triplet has six, the Tessar form also six, because the new surface is cemented: more freedom for the designer at no cost in flare.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 350 });
      const NOM = { 'double-gauss': 3, 'cooke-triplet': 5 };
      const idOf = v => v === 'tessar' ? 'cooke-triplet' : v;
      const first = params.lens || 'double-gauss';
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'Lens', options: [['Double Gauss, f = 100 mm, f/3 (traced)', 'double-gauss'], ['Cooke triplet, f = 50 mm, f/5 (traced)', 'cooke-triplet'], ['Tessar form beside its parent triplet (schematic)', 'tessar']], value: first },
        { id: 'N', label: 'f-number', min: 2.8, max: 16, step: 0.1, value: NOM[idOf(first)], fmt: v => 'f/' + kit.fmt(v, 3) },
        { id: 'fld', label: 'Field shown, as a fraction of the design field', min: 0.2, max: 1, step: 0.05, value: 1 },
        { id: 'nm', type: 'select', label: 'Light', options: [['Blue, 450 nm', 450], ['Green, 550 nm', 550], ['Red, 650 nm', 650]], value: 550 }
      ], id => { if (id === 'lens') ctl.set('N', NOM[idOf(V.lens)]); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['efl', 'Focal length · f-number'], ['len', 'Length · back focal distance'], ['grp', 'Elements · groups · air–glass surfaces'], ['pz', 'Petzval radius'], ['r0', 'Blur on the axis (RMS Ø)'], ['r1', 'Blur at the field shown'], ['ts', 'Focus at the field shown'], ['lit', 'Light at the field shown']]);
      const plot = kit.plot(box.stage, { legend: true, x: { label: 'focus position relative to the on-axis image (mm)' }, y: { label: 'field angle (°)', min: 0 } }, 190);
      const isAir = n => O.index(n, 587.56) < 1.01;
      // the Tessar form: positive crown, negative flint, stop, then a negative flint cemented to a positive crown
      const drawTessar = (c, C, x0, y0, w) => {
        const u = w / 52, el = (xu, hh, R1, R2, t) => S.lens(c, x0 + xu * u, y0, hh * u, { R1: R1 * u, R2: R2 * u, t: t * u });
        el(0, 17, 28, -70, 7); el(13, 12, -34, 34, 2.5);
        S.stop(c, x0 + 26 * u, y0, 20 * u, 11 * u);
        el(32, 12, -52, 30, 2.5); el(34.5, 12, 30, -40, 6);
        S.axis(c, x0 - 10, y0, x0 + 46 * u);
        const lab = (t, xu, dy) => kit.label(c, t, x0 + xu * u, y0 + dy, { align: 'center', color: C.muted, size: 11.5 });
        lab('crown +', 3.5, 20 * u + 12); lab('flint −', 14.2, 14 * u + 12); lab('stop', 26, -20 * u - 10); lab('flint −', 33.2, 14 * u + 12); lab('crown +', 37.5, 14 * u + 28);
        kit.label(c, 'cemented', x0 + 34.5 * u, y0 - 14 * u - 10, { align: 'center', color: C.accent, size: 11.5, weight: 650 });
        kit.label(c, 'Tessar form — schematic', x0 + 22 * u, y0 - 24 * u - 14, { align: 'center', color: C.text, weight: 650 });
      };
      const cache = memo();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, tess = V.lens === 'tessar', nm = V.nm;
        const R = cache([V.lens, V.N, V.fld, V.nm].join('|'), () => {
          const sys = setFNumber(O, O.lens(idOf(V.lens)), V.N), par = Sy.paraxial(sys, nm), fmax = sys.field, fld = V.fld * fmax;
          const fields = [0, fld / 2, fld], ts = [], res = [];
          for (let i = 0; i <= 8; i++) { const a = fmax * i / 8, fp = focalPoints(O, sys, a, nm, par); if (fp) ts.push({ a, fp }); }
          for (const f of fields) {
            const bf = Sy.bestFocus(sys, { nm, field: f, rings: RINGS });
            const sp = Sy.spot(sys, { nm, field: f, z: bf.z, rings: RINGS });
            res.push({ sp, u: spotUm(sp) });
          }
          return { sys, par, fmax, fld, fields, ts, res, sd: Sy.seidel(sys, { field: fld, nm }), fp: focalPoints(O, sys, fld, nm, par),
            pieces: sys.surfaces.filter(s => !isAir(s.n)).length, ag: sys.surfaces.filter((s, i) => isAir(i ? sys.surfaces[i - 1].n : 1) !== isAir(s.n)).length };
        });
        const { sys, par, fmax, fld, fields, ts, res, sd, fp, pieces, ag } = R, zi = par.zImage;
        const maxSd = Math.max(...sys.surfaces.map(s => s.sd || 0)), yh = 1.15 * Math.max(maxSd, par.efl * Math.tan(fmax));
        const zStart = -0.22 * zi, m = S.map(st, zStart - 2, zi + 6, yh, { left: 12, right: tess ? W * 0.52 : W * 0.33 });
        S.axis(c, m.X(zStart - 2), m.y0, m.X(zi + 6));
        S.system(c, sys, m);
        S.rays(c, Sy.fan2d(sys, { nm, n: 5, zStart }), m, { nm });
        S.rays(c, Sy.fan2d(sys, { nm, n: 5, field: fld, zStart }), m, { color: C.accent });
        S.screen(c, m.X(zi), m.y0, m.s * par.efl * Math.tan(fmax) * 1.02, { label: 'image plane' });
        // the focal curves, as a plot
        plot.set({ y: { label: 'field angle (°)', min: 0, max: Math.ceil(fmax * R2D) }, series: [{ pts: ts.map(q => [q.fp.zT - zi, q.a * R2D]), label: 'tangential (T)', color: C.warn }, { pts: ts.map(q => [q.fp.zS - zi, q.a * R2D]), label: 'sagittal (S)', color: C.ok, dash: true }], vlines: [{ x: 0, label: 'image plane' }] });
        if (tess) {
          drawTessar(c, C, W * 0.55, Hh * 0.5, W * 0.4);
          kit.label(c, 'Cooke triplet — traced', m.X(0) + 20, 14, { color: C.text, weight: 650 });
        } else {
          const halfUm = niceUm(1.2 * Math.max(...res.map(r => r.u.geo), 3));
          const half = Math.min(W * 0.12, (Hh - 56) / 6.4), cx = W * 0.665 + (W * 0.335 - 12) / 2 - 4;
          res.forEach((r, i) => spotBox(c, kit, S, r.sp, cx, 30 + half + i * (2 * half + 24), half, halfUm, kit.fmt(fields[i] * R2D, 3) + '°' + (r.sp.n ? '' : ' — cut off'), nm));
          kit.label(c, 'boxes: ± ' + halfUm + ' µm', cx, Hh - 8, { align: 'center', color: C.faint, size: 11 });
        }
        ro.set('efl', par.efl.toFixed(1) + ' mm · f/' + par.fno.toFixed(1));
        ro.set('len', par.length.toFixed(1) + ' mm · ' + par.bfd.toFixed(1) + ' mm');
        ro.set('grp', tess ? 'triplet: 3 · 3 · ' + ag + '   Tessar form: 4 · 3 · 6 + 1 cemented' : pieces + ' · ' + Sy.elements(sys).length + ' · ' + ag);
        ro.set('pz', sgn(sd.petzvalRadius, 0) + ' mm  (' + sgn(sd.petzvalRadius / par.efl, 1) + ' f)');
        ro.set('r0', res[0].u.rms.toFixed(1) + ' µm');
        ro.set('r1', res[2].sp.n ? res[2].u.rms.toFixed(1) + ' µm  at ' + (fld * R2D).toFixed(1) + '°' : 'cut off');
        ro.set('ts', fp ? 'T ' + sgn(fp.zT - zi, 2) + ' mm · S ' + sgn(fp.zS - zi, 2) + ' mm' : 'rays cut off');
        ro.set('lit', res[0].sp.n ? Math.min(100, Math.round(100 * res[2].sp.n / res[0].sp.n)) + ' % of the axial beam' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ telephoto and retrofocus */
  Hyper.sim('lf-twogroup', {
    title: 'Two groups, one lens: telephoto and retrofocus',
    blurb: `Two thin groups in air, traced with the ray-transfer matrices (the drawing is schematic: a group stands for a real assembly of elements). The dashed construction shows the **equivalent single lens**: where the converging rays, extended back, meet the incoming ray is the rear principal plane H′, and the focal length F is measured from there.

**Try this**
- *Telephoto*: keep the defaults (120 mm positive front, 100 mm negative rear, 80 mm apart). F comes out at 200 mm, yet the glass is only 147 mm from the image: a **telephoto ratio** of 0.73. Move the groups closer and F grows while the length shrinks further — until the rear group sits so near the image that there is no room left for a shutter.
- Make the negative group stronger (smaller |f₂|): F falls, the ratio falls too.
- Switch to *Retrofocus*: the negative group in front spreads the beam, the positive group gathers it, and the back focal distance is **longer than F** (here 2.2 F) — room for a swinging SLR mirror, which a plain 28 mm lens could never give.
- Shorten the spacing in the retrofocus layout until the bar turns red: the rear group is too close to the image for the mirror.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const PRE = { tele: { f1: 120, f2: 100, d: 80 }, retro: { f1: 50, f2: 40, d: 60 } };
      const first = params.mode === 'retro' ? 'retro' : 'tele';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Layout', options: [['Telephoto: positive front, negative rear', 'tele'], ['Retrofocus: negative front, positive rear', 'retro']], value: first },
        { id: 'f1', label: 'Front group, focal length |f₁|', min: 20, max: 250, step: 1, value: PRE[first].f1, unit: 'mm' },
        { id: 'f2', label: 'Rear group, focal length |f₂|', min: 20, max: 250, step: 1, value: PRE[first].f2, unit: 'mm' },
        { id: 'd', label: 'Spacing between the groups', min: 5, max: 160, step: 1, value: PRE[first].d, unit: 'mm' }
      ], id => { if (id === 'mode') { const p = PRE[V.mode]; ctl.set('f1', p.f1); ctl.set('f2', p.f2); ctl.set('d', p.d); } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['F', 'Focal length of the pair'], ['bfd', 'Back focal distance'], ['L', 'Front group to image'], ['ratio', 'Length L/F · back focus bfd/F'], ['fov', 'Diagonal field on 36 × 24 mm'], ['note', 'What it does']]);
      const MIRROR = 40;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const tele = V.mode === 'tele', f1 = tele ? V.f1 : -V.f1, f2 = tele ? -V.f2 : V.f2, d = V.d;
        const tw = O.twoLenses(f1, f2, d), F = tw.f, ok = isNum(F) && F > 0 && isNum(tw.bfd) && tw.bfd > 0;
        const L = ok ? d + tw.bfd : d + 60, zH = ok ? L - F : 0;
        const zMin = Math.min(0, zH) - 0.12 * Math.max(L, 60), zMax = L + 0.1 * Math.max(L, 60), span = zMax - zMin;
        const sc = (W - 40) / span, y0 = Hh * 0.46, X = z => 20 + (z - zMin) * sc, Y = y => y0 - y * sc;
        S.axis(c, X(zMin), y0, X(zMax));
        const hg = Math.min(Hh * 0.38, 0.3 * span * sc);
        S.thinLens(c, X(0), y0, hg, f1, { label: tele ? 'positive group' : 'negative group' });
        S.thinLens(c, X(d), y0, hg, f2, { label: tele ? 'negative group' : 'positive group' });
        if (!ok) {
          kit.label(c, 'These two groups form no real image behind the pair (F or the back focus is not positive).', W / 2, 28, { align: 'center', color: C.warn });
          ro.set('F', isNum(F) ? kit.fmt(F, 3) + ' mm' : 'afocal'); ro.set('bfd', '—'); ro.set('L', '—'); ro.set('ratio', '—'); ro.set('fov', '—'); ro.set('note', 'not a camera lens in this setting');
          return;
        }
        // parallel rays at ±y through the groups, by ray-transfer matrices
        const yr = 0.1 * span;
        for (const h of [-yr, 0, yr]) {
          const a = O.abcd.apply(O.abcd.free(d), O.abcd.apply(O.abcd.lens(f1), [h, 0])), b = O.abcd.apply(O.abcd.lens(f2), a), yi = b[0] + b[1] * tw.bfd;
          S.ray(c, [[X(zMin), Y(h)], [X(0), Y(h)], [X(d), Y(a[0])], [X(L), Y(yi)]], { nm: 580, width: 1.5, arrows: false });
        }
        // the equivalent single lens: incoming ray to H′, then to the focus
        c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.accent; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(X(zH), Y(-hg / sc)); c.lineTo(X(zH), Y(hg / sc));
        c.moveTo(X(Math.min(0, zH)), Y(yr)); c.lineTo(X(zH), Y(yr)); c.lineTo(X(L), Y(0)); c.stroke(); c.restore();
        kit.label(c, 'H′', X(zH), Y(hg / sc) - 10, { align: 'center', color: C.accent, weight: 650 });
        S.screen(c, X(L), y0, Hh * 0.2, { label: 'image' });
        // dimensions
        const yd = y0 + Hh * 0.3;
        S.dim(c, X(zH), yd, X(L), yd, 'F = ' + F.toFixed(0) + ' mm', { off: 13, color: C.accent, textColor: C.accent });
        S.dim(c, X(0), yd + 26, X(L), yd + 26, 'L = ' + L.toFixed(0) + ' mm', { off: 13 });
        S.dim(c, X(d), y0 - Hh * 0.27, X(L), y0 - Hh * 0.27, 'bfd = ' + tw.bfd.toFixed(0) + ' mm', { off: -11 });
        let note;
        if (tele) note = L < F ? 'shorter than a single lens of the same F by ' + Math.round(100 * (1 - L / F)) + ' %' : 'longer than F: not a telephoto';
        else {
          const x1 = X(L - MIRROR), good = tw.bfd >= MIRROR;
          c.save(); c.fillStyle = good ? C.ok : C.bad; c.globalAlpha = 0.22; c.fillRect(x1, y0 - Hh * 0.17, X(L) - x1, Hh * 0.34); c.restore();
          kit.label(c, 'mirror swing ≈ 40 mm', (x1 + X(L)) / 2, y0 + Hh * 0.17 + 12, { align: 'center', color: good ? C.ok : C.bad, size: 11.5 });
          note = good ? 'clears an SLR mirror (needs ≈ 40 mm)' : 'too close to the image for an SLR mirror';
        }
        const fv = O.cam.fov({ f: F, sensor: 'Full frame' });
        ro.set('F', F.toFixed(1) + ' mm'); ro.set('bfd', tw.bfd.toFixed(1) + ' mm'); ro.set('L', L.toFixed(1) + ' mm');
        ro.set('ratio', (L / F).toFixed(2) + ' · ' + (tw.bfd / F).toFixed(2));
        ro.set('fov', (fv.d * R2D).toFixed(1) + '°'); ro.set('note', note);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ fisheye mappings */
  Hyper.sim('lf-fisheye', {
    title: 'Fisheye mappings: how angle becomes distance',
    blurb: `Every lens maps the angle θ of a ray from the axis to a distance r from the picture centre. A rectilinear lens uses r = f tan θ, which keeps straight lines straight but stretches the edges without limit and can never reach 90°. Fisheye lenses use a different law, so that a whole hemisphere fits. The picture is a corridor (all its lines are straight in space) drawn by the law you choose; the rings are every 15° from the axis.

**Try this**
- Start with *equisolid* at 15 mm: a full-frame diagonal fisheye. The long edges of the corridor bend into arcs and the corners reach 90° from the axis.
- Pick *rectilinear* and shorten f: the corridor's lines straighten, but the periphery is stretched ("local scale at 60°" shows ×4) and the field never exceeds the 180° barrier.
- Choose *equidistant* and *orthographic*: the first spaces the rings evenly, the second crowds them together at the rim, which squeezes the edge of the world into a thin band.
- Make f about 8 mm on full frame: the 180° circle now fits inside the picture — a **circular fisheye**.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 320 });
      const PI = Math.PI;
      const MAPS = {
        rect:   { name: 'Rectilinear  r = f tan θ', r: (f, t) => O.scan.fTan(f, t), inv: (f, r) => Math.atan(r / f), g: t => 1 / Math.pow(Math.cos(t), 2), col: 0 },
        equi:   { name: 'Equidistant  r = f θ', r: (f, t) => O.scan.fTheta(f, t), inv: (f, r) => r / f, g: () => 1, col: 1 },
        solid:  { name: 'Equisolid angle  r = 2f sin(θ/2)', r: (f, t) => 2 * f * Math.sin(t / 2), inv: (f, r) => r >= 2 * f ? PI : 2 * Math.asin(r / (2 * f)), g: t => Math.cos(t / 2), col: 2 },
        stereo: { name: 'Stereographic  r = 2f tan(θ/2)', r: (f, t) => 2 * f * Math.tan(t / 2), inv: (f, r) => 2 * Math.atan(r / (2 * f)), g: t => 1 / Math.pow(Math.cos(t / 2), 2), col: 3 },
        ortho:  { name: 'Orthographic  r = f sin θ', r: (f, t) => f * Math.sin(t), inv: (f, r) => r >= f ? PI / 2 : Math.asin(r / f), g: t => Math.cos(t), col: 4 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'proj', type: 'select', label: 'Mapping function', options: Object.keys(MAPS).map(k => [MAPS[k].name, k]), value: params.proj || 'solid' },
        { id: 'f', label: 'Focal length', min: 4, max: 30, step: 0.1, value: params.f || 15, unit: 'mm', log: true, sig: 3 },
        { id: 'sensor', type: 'select', label: 'Sensor', options: [['Full frame, 36 × 24 mm', 'Full frame'], ['APS-C, 23.6 × 15.7 mm', 'APS-C'], ['Four Thirds, 17.3 × 13 mm', '4/3"']], value: 'Full frame' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['law', 'Mapping'], ['h', 'Field across the width'], ['v', 'Field across the height'], ['dg', 'Field across the diagonal'], ['sc', 'Local scale at 60° (centre = 1)'], ['circ', 'Image circle of a 180° field']]);
      // a corridor: four edges and a ring of rungs every 1.5 m, all straight lines in space
      const lines = [];
      for (const [x, y] of [[-1.5, -1], [1.5, -1], [1.5, 1], [-1.5, 1]]) { const p = []; for (let i = 0; i <= 70; i++) p.push([x, y, 0.001 + 18 * Math.pow(i / 70, 2)]); lines.push(p); }
      for (let z = 1.5; z <= 16; z += 1.5) for (const [a, b] of [[[-1.5, -1], [1.5, -1]], [[1.5, -1], [1.5, 1]], [[1.5, 1], [-1.5, 1]], [[-1.5, 1], [-1.5, -1]]]) { const p = []; for (let i = 0; i <= 24; i++) { const t = i / 24; p.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z]); } lines.push(p); }
      for (const z of [0.3]) for (const [a, b] of [[[-1.5, -1], [1.5, -1]], [[1.5, -1], [1.5, 1]], [[1.5, 1], [-1.5, 1]], [[-1.5, 1], [-1.5, -1]]]) { const p = []; for (let i = 0; i <= 24; i++) { const t = i / 24; p.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z]); } lines.push(p); }
      const plot = kit.plot(box.stage, { legend: true, x: { label: 'angle from the axis θ (°)', min: 0, max: 90 }, y: { label: 'image height r (mm)', min: 0, max: 30 } }, 200);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = MAPS[V.proj], f = V.f, sen = O.cam.sensor(V.sensor);
        const s = Math.min((W * 0.6 - 30) / sen.w, (Hh - 40) / sen.h), cx = W * 0.32 + 8, cy = Hh * 0.5, fw = sen.w * s, fh = sen.h * s;
        const halfD = Math.hypot(sen.w, sen.h) / 2;
        c.save(); c.beginPath(); c.rect(cx - fw / 2, cy - fh / 2, fw, fh); c.clip();
        c.fillStyle = C.surface; c.fillRect(cx - fw / 2, cy - fh / 2, fw, fh);
        // rings every 15°
        c.strokeStyle = C.grid; c.lineWidth = 1; c.setLineDash([3, 4]);
        for (let a = 15; a <= 90; a += 15) { const r = M.r(f, a * D2R); if (isNum(r) && r * s < 4 * W) { c.beginPath(); c.arc(cx, cy, Math.max(0.5, r * s), 0, 2 * PI); c.stroke(); } }
        c.setLineDash([]);
        // the corridor
        c.strokeStyle = C.series[M.col % C.series.length]; c.lineWidth = 1.4;
        for (const p of lines) {
          let open = false; c.beginPath();
          for (const [x, y, z] of p) {
            const t = Math.atan2(Math.hypot(x, y), z), r = M.r(f, t);
            if (!isNum(r) || t > 89.5 * D2R && V.proj === 'rect' || r > 6 * halfD) { open = false; continue; }
            const px = cx + r * s * Math.cos(Math.atan2(y, x)), py = cy - r * s * Math.sin(Math.atan2(y, x));
            if (open) c.lineTo(px, py); else { c.moveTo(px, py); open = true; }
          }
          c.stroke();
        }
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 1.3; c.strokeRect(cx - fw / 2, cy - fh / 2, fw, fh);
        const r90 = M.r(f, PI / 2);
        if (V.proj !== 'rect' && isNum(r90) && r90 * s < 3 * W) { c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.5; c.setLineDash([6, 4]); c.beginPath(); c.arc(cx, cy, Math.max(0.5, r90 * s), 0, 2 * PI); c.stroke(); c.restore(); kit.label(c, '90° from the axis', cx + r90 * s * 0.71 + 6, cy - r90 * s * 0.71 - 6, { color: C.accent, size: 11, align: 'left' }); }
        kit.label(c, 'full frame is drawn to scale: ' + sen.w + ' × ' + sen.h + ' mm', cx, cy + fh / 2 + 12, { align: 'center', color: C.faint, size: 11 });
        // the graph
        const series = [];
        for (const k of Object.keys(MAPS)) {
          const pts = [];
          for (let a = 0; a <= 90.01; a += 2.5) { const r = MAPS[k].r(f, a * D2R); if (isNum(r) && r < 36) pts.push([a, r]); }
          series.push({ pts, label: MAPS[k].name.split('  ')[0], color: C.series[MAPS[k].col % C.series.length], width: k === V.proj ? 3.2 : 1.4, dash: k === V.proj ? false : [5, 4] });
        }
        plot.set({ series, hlines: [{ y: halfD, label: 'half-diagonal ' + halfD.toFixed(1) + ' mm' }, { y: sen.h / 2, label: 'half-height ' + (sen.h / 2).toFixed(1) + ' mm' }] });
        const full = t => t >= 2 * PI - 1e-6 ? 'a whole sphere' : (t * R2D).toFixed(0) + '°';
        const field = r => { const t = 2 * M.inv(f, r); return full(t); };
        ro.set('law', M.name);
        ro.set('h', field(sen.w / 2)); ro.set('v', field(sen.h / 2)); ro.set('dg', field(halfD));
        ro.set('sc', '× ' + M.g(60 * D2R).toFixed(2));
        ro.set('circ', V.proj === 'rect' ? 'none: r grows without limit' : (2 * r90).toFixed(1) + ' mm' + (2 * r90 < sen.h ? ' (fits inside the frame)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ zoom principles */
  Hyper.sim('lf-zoom', {
    title: 'A zoom lens through its range',
    blurb: `Thin groups, traced with the ray-transfer matrices (a group stands for a real assembly; the drawing is schematic and the vertical scale is exaggerated). The sensor never moves. Three cases:

- **Two groups, both moving** (negative front, positive rear, f = −50 and +40 mm): the spacing that gives each focal length also moves the image, so both groups travel on their own paths and the image stays on the sensor — a *parfocal* lens.
- **Varifocal**: the rear group is nailed down and only the front group moves. The focal length changes, but the image drifts off the sensor: refocus after every zoom.
- **Variator and compensator** (a fixed positive front group, a negative variator, a positive compensator, then a fixed rear lens): the variator slides and sets the magnification; the compensator must follow a different, curved path to keep the beam leaving the zoom section parallel.

**Try this**
- Let it run automatically, then stop it and drag the zoom setting by hand at each end.
- In the varifocal case read "image off the sensor": tens of millimetres, because a two-lens model has no designer's compromise.
- In the variator case watch the two groups move *opposite* ways, at different speeds.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, A = O.abcd;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Zoom type', options: [['Two groups, both moving (parfocal)', 'two'], ['Two groups, only the front moves (varifocal)', 'vari'], ['Variator and compensator', 'vc']], value: params.mode || 'two' },
        { id: 'pos', label: 'Zoom setting: wide ← → tele', min: 0, max: 1, step: 0.005, value: 0.3, fmt: v => (v < 0.02 ? 'wide end' : v > 0.98 ? 'tele end' : Math.round(v * 100) + ' %') },
        { id: 'auto', type: 'check', label: 'Zoom automatically', value: params.auto !== false }
      ], id => {
        if (id === 'pos' && V.auto) { ctl.set('auto', false); loop.stop(); }
        if (id === 'auto') { if (V.auto) loop.start(); else loop.stop(); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['F', 'Focal length · zoom so far'], ['pos', 'Group positions from the sensor'], ['img', 'Image position'], ['D', 'Aperture for a constant f/4']]);
      const RANGE = { two: [25, 100], vari: [25, 100], vc: [43, 150] };
      // the lens data of each model, for a focal length F: groups { z (mm from the sensor, negative to the left), f, name }
      const model = (mode, F) => {
        if (mode === 'two' || mode === 'vari') {
          const f1 = -50, f2 = 40, z = O.design.zoom2(f1, f2, F), zn = O.design.zoom2(f1, f2, 50);
          const rear = mode === 'two' ? -z.bfd : -zn.bfd;
          return { groups: [{ z: rear - z.d, f: f1, name: 'front (−)' }, { z: rear, f: f2, name: 'rear (+)' }], z0: rear - z.d - 30, fixed: false };
        }
        const f0 = 100, fv = -20, fc = 40, fm = 12, K = fm * f0 / fc;      // F = K · m_v
        const mv = F / K, u = Math.abs(fv) * (1 - 1 / mv), zv = f0 - u, si = 1 / (1 / fv + 1 / u), zc = zv + si + fc, zm = 220, tot = zm + fm;
        return { groups: [{ z: -tot, f: f0, name: 'front, fixed' }, { z: -tot + zv, f: fv, name: 'variator' }, { z: -tot + zc, f: fc, name: 'compensator' }, { z: -tot + zm, f: fm, name: 'rear, fixed' }], z0: -tot - 30, fixed: true };
      };
      let phase = 0;
      const loop = kit.loop((dt) => {
        if (V.auto && dt > 0) { phase += dt; const v = 0.5 - 0.5 * Math.cos(phase * 0.55); ctl.set('pos', v); }
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const [Fw, Ft] = RANGE[V.mode], F = Fw * Math.pow(Ft / Fw, V.pos), md = model(V.mode, F);
        const zMin = md.z0 - 5, zMax = 22, sc = (W - 40) / (zMax - zMin), y0 = Hh * 0.5, ky = 3.2;
        const X = z => 20 + (z - zMin) * sc, Y = y => y0 - y * sc * ky;
        S.axis(c, X(zMin), y0, X(zMax));
        S.sensor(c, X(0) - 3, y0, Hh * 0.1, { pixels: 10 });
        const gs = md.groups, hy = Math.min(Hh * 0.36, 20 * sc * ky) ;
        gs.forEach(g => { const h = V.mode === 'vc' && (g.name === 'variator' || g.name === 'compensator') ? hy * 0.55 : hy; S.thinLens(c, X(g.z), y0, h, g.f, {}); kit.label(c, g.name, X(g.z), y0 + h + 14, { align: 'center', color: C.muted, size: 11 }); });
        // rays: on axis (parallel) and off axis (a bundle at 2.5°)
        const trace = (h0, slope) => {
          let y = h0, u = slope, z = gs[0].z; const pts = [[z - 28, h0 - slope * 28], [z, y]];
          for (let i = 0; i < gs.length; i++) {
            if (i) { y += u * (gs[i].z - z); z = gs[i].z; pts.push([z, y]); }
            u -= y / gs[i].f;
          }
          const zl = gs[gs.length - 1].z;
          const zImg = Math.abs(u) > 1e-12 && slope === 0 ? zl - y / u : NaN;
          const end = isNum(zImg) ? Math.min(zImg, 20) : 0;
          pts.push([end, y + u * (end - zl)]);
          return { pts, zImg, u };
        };
        let img = NaN;
        for (const h of [-14, 0, 14]) { const r = trace(h, 0); if (h) img = r.zImg; S.ray(c, r.pts.map(p => [X(p[0]), Y(p[1])]), { nm: 580, width: 1.4, arrows: false }); }
        for (const h of [-14, 0, 14]) { const r = trace(h, 0.044); S.ray(c, r.pts.map(p => [X(p[0]), Y(p[1])]), { color: C.accent, width: 1.2, arrows: false }); }
        const bad = Math.abs(img) > 1.0 && md.fixed === false && V.mode === 'vari';
        kit.label(c, 'vertical scale × ' + ky + ' (schematic)', W - 12, Hh - 10, { align: 'right', color: C.faint, size: 11 });
        if (bad) kit.label(c, 'image off the sensor', X(Math.max(Math.min(img, 20), -80)), y0 - Hh * 0.15, { align: 'center', color: C.bad, weight: 650 });
        const zoom = F / Fw;
        ro.set('F', F.toFixed(0) + ' mm · ' + zoom.toFixed(1) + '×');
        ro.set('pos', gs.map(g => (-g.z).toFixed(0)).join(' · ') + ' mm');
        ro.set('img', Math.abs(img) < 0.3 ? 'on the sensor' : (img > 0 ? img.toFixed(0) + ' mm behind the sensor' : (-img).toFixed(0) + ' mm in front of the sensor'));
        ro.set('D', (F / 4).toFixed(0) + ' mm entrance pupil');
      }, box.stage);
      st.onResize(() => loop.once());
      if (V.auto) loop.start(); else loop.once();
    }
  });

  /* ================================================================ macro */
  Hyper.sim('lf-macro', {
    title: 'Close-up work: reproduction ratio, extension and working f-number',
    blurb: `A thin lens of focal length f focused at reproduction ratio m = image size ÷ object size (the vertical scale of the drawing is exaggerated). The lens must move away from the sensor by f·m beyond its infinity position, and the farther it moves, the narrower the cone of light reaching the image: the **working f-number** is N(1 + m). A real macro lens adds floating elements that this thin-lens model cannot show.

**Try this**
- Set *m* to 1 : 1 with f = 100 mm. The object sits 200 mm from the lens, the sensor 200 mm behind it, the lens has moved out 100 mm, and f/2.8 has become f/5.6 — two stops of light gone.
- Read the **depth of field** at 1 : 1 and f/2.8: a third of a millimetre. Stop down to f/16 and it reaches about 2 mm, but the Airy disc now spans many pixels.
- Compare 60 mm and 200 mm lenses at the same ratio: the **working distance** (object to lens) is f(1 + 1/m), so the long lens keeps its distance — useful for insects and hot objects.
- Push *m* to 3 : 1: the geometry is the same lens turned round, the working f-number is f/11 for an f/2.8 lens, and diffraction decides the sharpness.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Focal length', min: 40, max: 200, step: 1, value: params.f || 100, unit: 'mm' },
        { id: 'm', label: 'Reproduction ratio m', min: 0.05, max: 3, value: params.m || 1, log: true, sig: 2, fmt: v => v >= 1 ? kit.fmt(v, 2) + ' : 1' : '1 : ' + kit.fmt(1 / v, 3) },
        { id: 'N', label: 'f-number on the lens', min: 2.8, max: 32, value: params.N || 2.8, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'pix', label: 'Pixel pitch of the sensor', min: 2, max: 8, step: 0.1, value: 4.3, unit: 'µm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['so', 'Object to lens (working distance)'], ['si', 'Lens to sensor'], ['ext', 'Extension beyond infinity focus'], ['fld', 'Field covered by 36 × 24 mm'], ['Nw', 'Working f-number · light lost'], ['dof', 'Depth of field (c = 0.03 mm)'], ['airy', 'Airy disc at the working f-number'], ['who', 'What limits sharpness']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const f = V.f, m = V.m, so = f * (1 + 1 / m), si = f * (1 + m);
        const zMin = -so - 0.06 * (so + si), zMax = si + 0.05 * (so + si), sc = (W - 40) / (zMax - zMin), y0 = Hh * 0.46;
        const hObj = 12 / m * 0.6, hImg = 12 * 0.6;               // the object that fills 60 % of half the sensor height
        const ky = Math.min(Hh * 0.3 / Math.max(hObj, hImg), 3 * sc), X = z => 20 + (z - zMin) * sc, Y = y => y0 - y * ky;
        const hl = Hh * 0.36;
        S.axis(c, X(zMin), y0, X(zMax));
        S.thinLens(c, X(0), y0, hl, f, { foci: f * sc });
        S.object(c, X(-so), y0, hObj * ky, { label: 'object' });
        S.object(c, X(si), y0, -hImg * ky, { label: 'image', color: C.ok });
        S.sensor(c, X(si) + 3, y0, Hh * 0.2, { pixels: 12 });
        // a cone of rays from the object tip, and the ray through the centre
        const yl = hl * 0.62 / ky;
        for (const s of [-1, 1]) S.ray(c, [[X(-so), Y(hObj)], [X(0), Y(s * yl)], [X(si), Y(-hImg)]], { nm: 580, width: 1.3, arrows: false });
        S.ray(c, [[X(-so), Y(hObj)], [X(si), Y(-hImg)]], { color: C.accent, width: 1.2, arrows: false });
        S.dim(c, X(-so), y0 + Hh * 0.4, X(0), y0 + Hh * 0.4, 'working distance ' + so.toFixed(0) + ' mm', { off: 13 });
        S.dim(c, X(0), y0 + Hh * 0.4, X(si), y0 + Hh * 0.4, 'image distance ' + si.toFixed(0) + ' mm', { off: 13 });
        S.dim(c, X(f), y0 - Hh * 0.42, X(si), y0 - Hh * 0.42, 'extension f·m = ' + (f * m).toFixed(0) + ' mm', { off: -11, color: C.warn, textColor: C.warn });
        kit.label(c, 'vertical scale exaggerated', W - 12, Hh - 8, { align: 'right', color: C.faint, size: 11 });
        const Nw = O.cam.workingFNumber(V.N, m), dof = O.cam.dofMacro(V.N, 0.03, m), airy = 2 * O.diff.airyRadius(550, Nw) * 1e6, k = airy / V.pix;
        ro.set('so', so.toFixed(0) + ' mm'); ro.set('si', si.toFixed(0) + ' mm'); ro.set('ext', (f * m).toFixed(1) + ' mm');
        ro.set('fld', (36 / m).toFixed(0) + ' × ' + (24 / m).toFixed(0) + ' mm');
        ro.set('Nw', 'f/' + Nw.toFixed(1) + ' · ' + (2 * Math.log2(1 + m)).toFixed(1) + ' stops');
        ro.set('dof', dof < 10 ? dof.toFixed(2) + ' mm' : dof.toFixed(0) + ' mm');
        ro.set('airy', airy.toFixed(1) + ' µm = ' + k.toFixed(1) + ' pixels');
        ro.set('who', k > 2 ? 'diffraction (the Airy disc covers more than 2 pixels)' : k > 1 ? 'pixels and diffraction share it' : 'the pixels, not the lens');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ telecentric */
  Hyper.sim('lf-telecentric', {
    title: 'Telecentric against ordinary: when the object moves',
    blurb: `A thin lens of 100 mm focal length images a 40 mm object at the magnification you choose. In the **ordinary** lens the stop sits at the lens. In the **telecentric** lens the stop sits at the lens's rear focal point, so the chief ray from every object point runs parallel to the axis. Rays are traced with the ray-transfer matrices (schematic: a group stands for a lens assembly). The stop of the telecentric lens is sized to give the same cone of light at the sensor, so the two blurs are nearly equal. The sensor stays where the object was sharp; move the object and watch the two images.

**Try this**
- Drag the *object displacement* to +30 mm (towards the lens): the ordinary lens enlarges the image by about 11 % and moves its edge, the telecentric one keeps the **same height** — only the blur grows.
- Open the aperture (small f-number): the blur grows, but the telecentric image is blurred symmetrically about the *same* centre, so an edge measurement does not move.
- Raise the magnification: both lenses still behave this way, but the telecentric front lens must grow with the object — the lens diameter read-out is always larger than the object.
- In the graph the ordinary lens' image height is a slope, the telecentric one a flat line: that flat line is why telecentric lenses are used for measurement.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, A = O.abcd;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 360 });
      const f = 100, H = 20;
      const ctl = kit.controls(box.side, [
        { id: 'dz', label: 'Object displacement (+ towards the lens)', min: -30, max: 30, step: 0.5, value: params.dz != null ? params.dz : 20, unit: 'mm' },
        { id: 'm', label: 'Magnification at the right distance', min: 0.25, max: 1, step: 0.05, value: params.m || 0.5 },
        { id: 'N', label: 'f-number', min: 3, max: 16, step: 0.5, value: 8, fmt: v => 'f/' + kit.fmt(v, 3) }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ord', 'Ordinary lens: image height'], ['tel', 'Telecentric lens: image height'], ['blo', 'Blur circle: ordinary · telecentric'], ['ang', 'Chief ray at the object edge (ordinary)'], ['dia', 'Telecentric front lens needs']]);
      const plot = kit.plot(box.stage, { legend: true, x: { label: 'object displacement (mm)' }, y: { label: 'image height change (%)' } }, 190);
      // a ray from the object point (−s, h) through the point y = target of the plane zStop, to the sensor at zs; heights at the lens and the sensor
      const shoot = (s, h, zStop, target, zs) => {
        const Ms = A.mul(A.free(s), A.lens(f), A.free(zStop));
        const u = (target - Ms[0][0] * h) / (Ms[0][1] || 1e-12);
        const yl = h + u * s, u2 = u - yl / f, ys = yl + u2 * zs;
        return { u, yl, ys, u2 };
      };
      const sensorImage = (s0, zs, tele, dz, h) => {
        const s = s0 - dz, zStop = tele ? f : 0;
        return shoot(s, h, zStop, 0, zs);
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const m0 = V.m, s0 = f * (1 + 1 / m0), zs = f * (1 + m0), a = f / (2 * V.N);
        const hl = 70;
        const zMin = -s0 - 40, zMax = zs + 25, sc = (W - 40) / (zMax - zMin), X = z => 20 + (z - zMin) * sc;
        const panels = [{ tele: false, y0: Hh * 0.27, title: 'Ordinary lens: stop at the lens' }, { tele: true, y0: Hh * 0.74, title: 'Telecentric lens: stop at the rear focal point' }];
        const res = [];
        for (const p of panels) {
          const Y = y => p.y0 - y * sc, s = s0 - V.dz, zStop = p.tele ? f : 0;
          S.axis(c, X(zMin), p.y0, X(zMax));
          // the displaced object and where the sharp one would be
          S.object(c, X(-s0), p.y0, H * sc, { dash: true, color: C.faint });
          S.object(c, X(-s), p.y0, H * sc, { label: '' });
          // rays from the tip of the displaced object: chief ray and the two edge rays of the beam
          let ymax = 0, blur = 0, yc = 0;
          const ray = (tgt, nm) => {
            const r = shoot(s, H, zStop, tgt, zs);
            S.ray(c, [[X(-s), Y(H)], [X(0), Y(r.yl)], [X(zs), Y(r.ys)]], { nm, width: tgt === 0 ? 1.6 : 1.1, arrows: false });
            return r;
          };
          const aS = p.tele ? a * (zs - f) / zs : a;       // the telecentric stop is sized to give the same cone at the sensor
          const rc = ray(0, 560), r1 = ray(aS, 600), r2 = ray(-aS, 600);
          yc = rc.ys; blur = Math.abs(r1.ys - r2.ys);
          ymax = Math.max(Math.abs(rc.yl), Math.abs(r1.yl), Math.abs(r2.yl));
          // the bottom point's chief ray, to show the whole image
          const rb = shoot(s, -H, zStop, 0, zs); S.ray(c, [[X(-s), Y(-H)], [X(0), Y(rb.yl)], [X(zs), Y(rb.ys)]], { nm: 560, width: 1.2, arrows: false });
          const hh = Math.max(hl * 0.55, (ymax + 6)) * sc;
          S.thinLens(c, X(0), p.y0, Math.min(hh, Hh * 0.23), f, {});
          if (p.tele) S.stop(c, X(f), p.y0, Math.min((H + 10) * sc, Hh * 0.2), aS * sc);
          S.screen(c, X(zs), p.y0, 26 * sc, { label: '' });
          kit.label(c, p.title, 20, p.y0 - Hh * 0.215, { color: C.text, weight: 650, size: 12 });
          res.push({ yc, blur, ymax });
        }
        // the graph: image height change against displacement, for both lenses
        const pts = [[], []];
        for (let d = -30; d <= 30.01; d += 3) for (const k of [0, 1]) { const y = sensorImage(s0, zs, !!k, d, H).ys, y0 = sensorImage(s0, zs, !!k, 0, H).ys; pts[k].push([d, 100 * (y / y0 - 1)]); }
        plot.set({ series: [{ pts: pts[0], label: 'ordinary lens', color: C.warn }, { pts: pts[1], label: 'telecentric lens', color: C.ok }], vlines: [{ x: V.dz, label: 'now' }] });
        const h0 = Math.abs(sensorImage(s0, zs, false, 0, H).ys);
        ro.set('ord', Math.abs(res[0].yc).toFixed(2) + ' mm  (' + (100 * (Math.abs(res[0].yc) / h0 - 1)).toFixed(1) + ' %)');
        ro.set('tel', Math.abs(res[1].yc).toFixed(2) + ' mm  (' + (100 * (Math.abs(res[1].yc) / Math.abs(sensorImage(s0, zs, true, 0, H).ys) - 1)).toFixed(1) + ' %)');
        ro.set('blo', (res[0].blur * 1000).toFixed(0) + ' µm · ' + (res[1].blur * 1000).toFixed(0) + ' µm');
        ro.set('ang', (Math.atan(H / (s0 - V.dz)) * R2D).toFixed(1) + '° from the axis');
        ro.set('dia', (2 * res[1].ymax + 6).toFixed(0) + ' mm for a ' + 2 * H + ' mm object');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the mirror lens */
  Hyper.sim('lf-mirror', {
    title: 'A mirror lens: the central obstruction and the doughnut',
    blurb: `A Cassegrain mirror lens of 500 mm focal length and 62.5 mm aperture (f/8): a paraboloid primary of 125 mm focal length, a hyperboloid secondary that magnifies four times, the image 30 mm behind the primary. The rays are traced exactly; the secondary mirror blocks the middle of the incoming beam (dashed grey rays), so only a ring of the aperture is used. A real catadioptric adds a corrector plate in front, which this drawing leaves out.

**Try this**
- Defocus by about 1 mm: the point of light on the sensor becomes a **ring**, the shape of the doughnut bokeh. Compare it with the unobstructed disc below.
- Make the obstruction bigger: the ring thickens inwards, the area (and so the light) falls, and the MTF dips at low and middle frequencies — the contrast of coarse detail — while it stays near the diffraction limit at fine detail.
- Set the obstruction to its smallest (0.30) and the field angle to 2.4°: the secondary is now too small for the oblique beam and clips the ring into a lens shape (a "cat's eye"). A bigger secondary passes the whole field, at the price of a bigger hole.
- At zero defocus the doughnut disappears into the Airy pattern; the obstruction then shows up only in the MTF and in the brightness of the first diffraction ring.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 350 });
      const D = 62.5, f1 = 125, mag = 4, back = 30;
      const ctl = kit.controls(box.side, [
        { id: 'eps', label: 'Central obstruction, diameter ÷ aperture', min: 0.3, max: 0.65, step: 0.01, value: params.eps || 0.42, fmt: v => kit.fmt(v, 2) },
        { id: 'dz', label: 'Focus error at the sensor', min: -2, max: 2, step: 0.05, value: params.dz != null ? params.dz : 0.8, unit: 'mm' },
        { id: 'fld', label: 'Field angle', min: 0, max: 2.4, step: 0.1, value: params.fld || 0, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Focal length · f-number'], ['obs', 'Obstructed area · light lost'], ['T', 'T-stop with 90 % mirrors'], ['ring', 'Defocus disc: outer · inner Ø'], ['mtf', 'MTF at ¼ of the cut-off: clear · obstructed']]);
      const plot = kit.plot(box.stage, { legend: true, x: { label: 'spatial frequency ÷ cut-off frequency', min: 0, max: 1 }, y: { label: 'MTF', min: 0, max: 1 } }, 190);
      // the MTF of a ring-shaped pupil: the overlap of the ring with a copy of itself shifted by 2s pupil radii
      const annular = eps => {
        const n = 40, inA = (i, j) => { const r = Math.hypot(i, j) / n; return r <= 1 && r >= eps; };
        let tot = 0; const pts = [];
        for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) if (inA(i, j)) { pts.push([i, j]); tot++; }
        const out = [];
        for (let k = 0; k <= 20; k++) { let ov = 0; for (const p of pts) if (inA(p[0] + 4 * k, p[1])) ov++; out.push([k / 20, ov / tot]); }
        return out;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, nm = 550, eps = V.eps, fld = V.fld * D2R;
        const sys = O.design.cassegrain({ f1, m: mag, b: back, D }), par = Sy.paraxial(sys, nm), zi = par.zImage, d2 = Math.abs(par.zs[1]);
        sys.surfaces[1].sd = eps * D / 2;
        const s2 = sys.surfaces[1].sd, N = par.efl / D, zStart = -d2 - 20;
        const m = S.map(st, zStart - 4, zi + 8, D / 2 * 1.3, { left: 12, right: W * 0.36 });
        S.axis(c, m.X(zStart - 4), m.y0, m.X(zi + 8));
        S.system(c, sys, m);
        // rays: the middle of the beam is blocked by the secondary
        for (const [ang, col] of [[0, null], [fld, C.accent]]) {
          if (ang === 0 && fld === 0 && col) continue;
          for (let i = 0; i < 9; i++) {
            const py = -0.94 + 1.88 * i / 8, ray = Sy.aim(sys, 0, py, ang, par, nm), p0 = ray.p, dd = ray.d;
            const sA = (zStart - p0[2]) / dd[2], st0 = [p0[0] + sA * dd[0], p0[1] + sA * dd[1], zStart];
            const sB = (-d2 - zStart) / dd[2], atSec = [st0[0] + sB * dd[0], st0[1] + sB * dd[1]];
            const hit = Math.hypot(atSec[0], atSec[1]) < s2;
            if (hit) { S.ray(c, [[m.X(zStart), m.Y(st0[1])], [m.X(-d2), m.Y(atSec[1])]], { color: C.faint, width: 1, dash: [3, 3], arrows: false }); continue; }
            const tr = Sy.trace(sys, { p: st0, d: dd }, nm);
            const pts = [[zStart, st0[1]]].concat(tr.pts.slice(1).map(q => [q[2], q[1]]));
            if (tr.ok) { const e = Sy.at(tr, zi); pts.push([e[2], e[1]]); }
            S.rays(c, [{ pts, ok: tr.ok }], m, col ? { color: col } : { nm });
          }
        }
        S.screen(c, m.X(zi), m.y0, m.s * 12, { label: 'sensor' });
        kit.label(c, 'secondary', m.X(-d2), m.Y(s2) - 10, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'primary (with a central hole)', m.X(0) + 10, m.Y(D / 2) - 8, { align: 'left', color: C.muted, size: 11.5 });
        // the defocused point of light, with and without the obstruction
        const nb = 36, R = 1.0, chief = Sy.trace(sys, Sy.aim(sys, 0, 0, fld, par, nm), nm, { clip: false }), zp = zi + V.dz;
        const ec = Sy.at(chief, zp), rad = Math.abs(V.dz) / (2 * N) + 0.0006, half = Math.max(rad * 1.3, 0.004);
        const grids = [new Float64Array(nb * nb), new Float64Array(nb * nb)];
        const nPup = 41;
        for (let i = 0; i < nPup; i++) for (let j = 0; j < nPup; j++) {
          const px = -1 + 2 * i / (nPup - 1), py = -1 + 2 * j / (nPup - 1);
          if (px * px + py * py > 1) continue;
          const ray = Sy.aim(sys, px, py, fld, par, nm), dd = ray.d, sA = (zStart - ray.p[2]) / dd[2], st0 = [ray.p[0] + sA * dd[0], ray.p[1] + sA * dd[1], zStart];
          const sB = (-d2 - zStart) / dd[2], ax = st0[0] + sB * dd[0], ay = st0[1] + sB * dd[1];
          const tr = Sy.trace(sys, { p: st0, d: dd }, nm, { clip: true });
          if (!tr.ok) continue;
          const e = Sy.at(tr, zp), u = Math.floor((e[0] - ec[0]) / (2 * half) * nb + nb / 2), v = Math.floor((e[1] - ec[1]) / (2 * half) * nb + nb / 2);
          if (u < 0 || u >= nb || v < 0 || v >= nb) continue;
          grids[1][v * nb + u]++;                                    // the whole aperture
          if (Math.hypot(ax, ay) >= s2) grids[0][v * nb + u]++;      // the ring that the secondary leaves
        }
        const bx = W * 0.665 + (W * 0.335 - 12) / 2 - 4, bh = Math.min(W * 0.12, (Hh - 70) / 4.4);
        [[grids[0], 'with the central obstruction'], [grids[1], 'without it (clear aperture)']].forEach(([g, lab], i) => {
          const mx = Math.max(...g, 1), cy = 34 + bh + i * (2 * bh + 34);
          c.fillStyle = '#000'; c.fillRect(bx - bh, cy - bh, 2 * bh, 2 * bh);
          S.cells(c, bx - bh, cy - bh, 2 * bh, 2 * bh, nb, nb, (u, v) => Math.pow(g[Math.floor(v * nb) * nb + Math.floor(u * nb)] / mx, 0.8), { nm });
          kit.label(c, lab, bx, cy - bh - 10, { align: 'center', color: C.muted, size: 11.5 });
        });
        kit.label(c, 'boxes: ± ' + (half * 1000).toFixed(0) + ' µm', bx, Hh - 8, { align: 'center', color: C.faint, size: 11 });
        const a = annular(eps), clear = a.map(p => [p[0], O.mtf.diffraction(p[0] * O.mtf.cutoff(nm, N), nm, N)]);
        plot.set({ series: [{ pts: clear, label: 'clear aperture', color: C.series[0] }, { pts: a, label: 'with the obstruction', color: C.warn }] });
        ro.set('f', par.efl.toFixed(0) + ' mm · f/' + N.toFixed(1));
        ro.set('obs', (100 * eps * eps).toFixed(0) + ' % · ' + (-Math.log2(1 - eps * eps)).toFixed(2) + ' stop');
        ro.set('T', 'T' + (N / Math.sqrt((1 - eps * eps) * 0.81)).toFixed(1));
        ro.set('ring', (Math.abs(V.dz) / N).toFixed(3) + ' mm · ' + (eps * Math.abs(V.dz) / N).toFixed(3) + ' mm');
        ro.set('mtf', clear[5][1].toFixed(2) + ' · ' + a[5][1].toFixed(2));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ anamorphic */
  Hyper.sim('lf-anamorphic', {
    title: 'An anamorphic squeeze: top view, side view and the oval highlight',
    blurb: `A cylindrical afocal attachment (a negative and a positive cylinder, reversed-Galilean) stands in front of an ordinary spherical lens. It acts in the horizontal plane only: the **top view** shows the beam widened and the field angle compressed by the squeeze factor; the **side view** shows an ordinary lens. The drawing is schematic (thin groups, the ray-transfer matrices; the vertical scale is exaggerated). On the right, the same scene on the sensor (squeezed) and on the screen (desqueezed).

**Try this**
- Pick *2×* with the 35 mm film frame: the horizontal field is twice as wide as the vertical one would suggest, and the delivered picture is 2.34 : 1 — the shape of CinemaScope.
- Compare *1.33×* on a 16 : 9 sensor: 2.37 : 1 without changing the sensor.
- Look at the highlight: in the finished picture it is an oval **S times taller than wide**, because the lens's entrance pupil is S times narrower in the horizontal plane.
- Choose *None*: the cylinders vanish and the highlight is round.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, A = O.abcd;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 360 });
      const SENS = { film: [21.3, 18.2], s35: [24.9, 18.7], ff: [36, 24], hd: [24, 13.5] };
      const ctl = kit.controls(box.side, [
        { id: 'sq', type: 'select', label: 'Squeeze factor', options: [['None (spherical lens)', 1], ['1.33×', 1.33], ['1.5×', 1.5], ['1.8×', 1.8], ['2×', 2]], value: params.sq || 2 },
        { id: 'sen', type: 'select', label: 'Sensor or film frame', options: [['35 mm film, anamorphic frame 21.3 × 18.2 mm', 'film'], ['Super 35 sensor 24.9 × 18.7 mm (4 : 3)', 's35'], ['Full frame 36 × 24 mm (3 : 2)', 'ff'], ['16 : 9 sensor 24 × 13.5 mm', 'hd']], value: params.sen || 'film' },
        { id: 'f', label: 'Focal length of the spherical lens', min: 25, max: 100, step: 1, value: params.f || 50, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fx', 'Focal length: horizontal · vertical'], ['fov', 'Field: horizontal · vertical'], ['ar', 'Aspect of the sensor → of the picture'], ['oval', 'Out-of-focus highlight, height : width'], ['ep', 'Entrance pupil: width × height']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, sq = V.sq, f = V.f, [w, h] = SENS[V.sen];
        const fa = 40, D = 16;                      // the cylinders and the width of the beam at the spherical lens
        const zL = (sq - 1) * fa + 28, zs = zL + f, zMin = -30, zMax = zs + 12;
        const sx = (W * 0.62 - 20) / (zMax - zMin), X = z => 14 + (z - zMin) * sx;
        const views = [{ title: 'Top view (horizontal plane)', y0: Hh * 0.26, half: w / 2, cyl: sq > 1, ent: D / 2 / sq, tan: sq * (w / 2) / f },
                       { title: 'Side view (vertical plane)', y0: Hh * 0.74, half: h / 2, cyl: false, ent: D / 2, tan: (h / 2) / f }];
        const sy = Hh * 0.21 / 22;
        for (const v of views) {
          const Y = y => v.y0 - y * sy;
          S.axis(c, X(zMin), v.y0, X(zMax));
          kit.label(c, v.title, 14, v.y0 - Hh * 0.23, { color: C.text, weight: 650, size: 12 });
          const top = v.cyl, gs = top ? [{ z: 0, f: -fa }, { z: (sq - 1) * fa, f: sq * fa }, { z: zL, f }] : [{ z: zL, f }];
          gs.forEach((g, i) => S.thinLens(c, X(g.z), v.y0, i === gs.length - 1 ? 17 * sy : 14 * sy * (g.f > 0 ? 1.1 : 0.8), g.f, {}));
          if (!top && sq > 1) { c.save(); c.setLineDash([3, 3]); c.strokeStyle = C.faint; for (const z of [0, (sq - 1) * fa]) { c.beginPath(); c.moveTo(X(z), v.y0 - 14 * sy); c.lineTo(X(z), v.y0 + 14 * sy); c.stroke(); } c.restore(); kit.label(c, 'cylinders: no effect here', X((sq - 1) * fa / 2), v.y0 - 16 * sy - 8, { align: 'center', color: C.faint, size: 11 }); }
          if (top) kit.label(c, 'cylinders', X((sq - 1) * fa / 2), v.y0 - 16 * sy - 8, { align: 'center', color: C.accent, size: 11, weight: 650 });
          kit.label(c, 'taking lens', X(zL), v.y0 + 19 * sy + 10, { align: 'center', color: C.muted, size: 11 });
          const trace = (h0, slope) => {
            let y = h0, u = slope, z = gs[0].z; const pts = [[zMin, h0 - slope * (gs[0].z - zMin)], [z, y]];
            gs.forEach((g, i) => { if (i) { y += u * (g.z - z); z = g.z; pts.push([z, y]); } u -= y / g.f; });
            pts.push([zs, y + u * (zs - z)]);
            return pts;
          };
          for (const h0 of [-v.ent, 0, v.ent]) S.ray(c, trace(h0, 0).map(p => [X(p[0]), Y(p[1])]), { nm: 580, width: 1.3, arrows: false });
          for (const h0 of [-v.ent, 0, v.ent]) S.ray(c, trace(h0, v.tan).map(p => [X(p[0]), Y(p[1])]), { color: C.accent, width: 1.1, arrows: false });
          S.screen(c, X(zs), v.y0, v.half * sy, { label: '' });
          S.dim(c, X(zs) + 12, Y(v.half), X(zs) + 12, Y(-v.half), (2 * v.half).toFixed(1) + ' mm', { off: -26 });
        }
        kit.label(c, 'vertical scale exaggerated', 14, Hh - 8, { color: C.faint, size: 11 });
        // the frames
        const col = W * 0.66, cw = W - col - 14, a1 = w / h, a2 = sq * w / h, fh = Math.min(Hh * 0.26, cw / Math.max(a1, a2)), ball = 0.34 * fh, hl = 0.1 * fh;
        const frame = (cy, aspect, squeeze, title) => {
          const fw = fh * aspect, cx = col + cw / 2;
          c.fillStyle = C.surface; c.fillRect(cx - fw / 2, cy - fh / 2, fw, fh); c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(cx - fw / 2, cy - fh / 2, fw, fh);
          c.save(); c.beginPath(); c.rect(cx - fw / 2, cy - fh / 2, fw, fh); c.clip();
          c.fillStyle = C.series[2]; c.beginPath(); c.ellipse(cx - fw * 0.17, cy + fh * 0.05, ball / squeeze, ball, 0, 0, 2 * Math.PI); c.fill();
          c.fillStyle = C.warn; c.globalAlpha = 0.85; c.beginPath(); c.ellipse(cx + fw * 0.25, cy - fh * 0.16, hl / Math.sqrt(sq) / squeeze, hl * Math.sqrt(sq), 0, 0, 2 * Math.PI); c.fill();
          c.restore();
          kit.label(c, title, cx, cy - fh / 2 - 9, { align: 'center', color: C.muted, size: 11.5 });
        };
        frame(Hh * 0.27, a1, sq, 'on the sensor: squeezed ' + a1.toFixed(2) + ' : 1');
        frame(Hh * 0.73, a2, 1, 'on the screen: desqueezed ' + a2.toFixed(2) + ' : 1');
        const fv = O.cam.fov({ f, w: sq * w, h });
        ro.set('fx', (f / sq).toFixed(1) + ' mm · ' + f.toFixed(0) + ' mm');
        ro.set('fov', (fv.h * R2D).toFixed(0) + '° · ' + (fv.v * R2D).toFixed(0) + '°');
        ro.set('ar', a1.toFixed(2) + ' : 1 → ' + a2.toFixed(2) + ' : 1');
        ro.set('oval', sq.toFixed(2) + ' : 1' + (sq === 1 ? ' (round)' : ' (taller than wide)'));
        ro.set('ep', (D / sq).toFixed(1) + ' × ' + D.toFixed(1) + ' mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the phone camera lens */
  Hyper.sim('lf-phone', {
    title: 'The lens of a phone camera, in a few millimetres',
    blurb: `Four typical phone cameras. The lens drawings are **schematic**: the number of elements, their order of curvature and their gull-wing (aspheric) profiles are typical, but they are not the prescription of any real phone, and the rays are drawn as simple lines. The numbers come from the camera formulas: the field of view, the f-number and pupil, the equivalent focal length on a 36 × 24 mm frame, and the size of the Airy disc against the pixel.

**Try this**
- Compare *main* and *ultra-wide*: the ultra-wide has a focal length of about 2 mm and a field of over 110°; its pupil is only 1 mm wide, yet the lens still has seven or fewer elements.
- Switch to the *periscope*: the 5× focal length (about 18 mm) would be longer than a phone is thick, so a prism turns the light through 90° and the lens runs along the body.
- Lower the pixel pitch to 0.7 µm: the **Airy disc** is now several pixels across — extra megapixels no longer buy detail, which is why phone sensors bin their pixels in groups.
- Look at the **total track length** against the sensor diagonal: about 0.6 for these designs — the whole lens is shorter than the sensor is wide.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      // typical figures, rounded: sensor diagonal (mm), focal length (mm), f-number, elements, total track length (mm), chief ray angle at the corner (°)
      const CAM = {
        wide:  { name: 'Main (wide)', diag: 12.3, f: 6.5, N: 1.8, n: 7, ttl: 7.5, cra: 30, pix: 1.0, tele: false },
        ultra: { name: 'Ultra-wide', diag: 6.4, f: 2.0, N: 2.2, n: 6, ttl: 4.4, cra: 28, pix: 1.0, tele: false },
        tele3: { name: 'Telephoto 3×', diag: 6.4, f: 10.4, N: 2.4, n: 6, ttl: 9.0, cra: 22, pix: 0.7, tele: false },
        peri:  { name: 'Periscope telephoto 5×', diag: 6.4, f: 17.7, N: 3.2, n: 6, ttl: 17, cra: 18, pix: 0.7, tele: true }
      };
      const ctl = kit.controls(box.side, [
        { id: 'cam', type: 'select', label: 'Camera', options: Object.keys(CAM).map(k => [CAM[k].name, k]), value: params.cam || 'wide' },
        { id: 'pix', label: 'Pixel pitch', min: 0.56, max: 2.4, step: 0.02, value: 1.0, unit: 'µm' }
      ], id => { if (id === 'cam') ctl.set('pix', CAM[V.cam].pix); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eq', 'Equivalent focal length · diagonal field'], ['N', 'f-number · entrance pupil'], ['ttl', 'Total track length · ÷ diagonal · ÷ f'], ['airy', 'Airy disc (550 nm)'], ['cra', 'Chief ray angle at the corner (typical)'], ['els', 'Elements']]);
      // the profile of one moulded surface across its height u in −1…1: a base curve and a stronger fourth-power term (a gull wing when g > 1)
      const surf = (e, side) => { const s = side ? e.s2 : e.s1, g = e.g; return u => s * ((1 - g) * u * u + g * u * u * u * u); };
      const elem = (c, C, x, y, r, t, e) => {
        const n = 16, front = [], back = [];
        for (let i = -n; i <= n; i++) { const u = i / n; front.push([x + surf(e, 0)(u) * r * 0.5, y - u * r]); back.push([x + t + surf(e, 1)(u) * r * 0.5, y - u * r]); }
        S.poly(c, front.concat(back.reverse()), {});
      };
      const SHAPES = [[0.35, 0.1, 0.6], [-0.3, 0.15, 1.2], [0.4, -0.15, 0.4], [-0.35, 0.25, 1.4], [0.3, 0.3, 0.8], [-0.45, 0.15, 1.6], [0.5, -0.4, 1.9]];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cam = CAM[V.cam];
        const sd = cam.diag / 2, epd = cam.f / cam.N, n = cam.n;
        const sc = cam.tele ? (W - 60) / (cam.ttl + 14) : Math.min((W * 0.7) / (cam.ttl + 3), (Hh * 0.38) / sd), y0 = Hh * 0.5;
        const X = z => 30 + z * sc;
        const lensX0 = cam.tele ? 9 : 1.2, pitch = (cam.ttl - 1.2) / n;
        if (cam.tele) {
          // the phone body, the prism and the lens running along the length
          const body = 7.6 * sc;
          c.save(); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.strokeRect(X(0), y0 - body / 2, (cam.ttl + 14) * sc - 30 + 30, body); c.restore();
          kit.label(c, 'phone body, about 7.6 mm thick', X(0) + 8, y0 + body / 2 + 14, { color: C.faint, size: 11, align: 'left' });
          const a = 2.7 * sc, px = X(3.2), py = y0 - 0.2 * sc;
          S.poly(c, [[px - a, py - a], [px + a, py - a], [px + a, py + a]], {});
          kit.label(c, 'prism', px, py + a + 12, { color: C.muted, size: 11.5 });
          const h = epd / 2 * sc;
          for (const k of [-1, 0, 1]) { const yy = k * h * 0.9; S.ray(c, [[px + yy, y0 - body / 2 - 26], [px + yy, py + yy]], { nm: 580, width: 1.3, arrows: false }); S.ray(c, [[px + yy, py + yy], [X(cam.ttl + 11.5), y0]], { nm: 580, width: 1.3, arrows: false }); }
          kit.label(c, 'light from the scene', px, y0 - body / 2 - 34, { color: C.muted, size: 11.5, align: 'center' });
        }
        S.axis(c, X(-0.8), y0, X(lensX0 + cam.ttl + 3));
        // the elements: smaller at the front, larger behind, like the beam they have to carry
        for (let i = 0; i < n; i++) {
          const rr = (epd / 2 * 1.25 + (sd * 0.62 - epd / 2 * 1.25) * Math.pow(i / Math.max(1, n - 1), 1.4)) * sc, sh = SHAPES[i % SHAPES.length];
          elem(c, C, X(lensX0 + i * pitch), y0, rr, pitch * 0.55 * sc, { s1: sh[0], s2: sh[1], g: sh[2] });
        }
        const zs = lensX0 + cam.ttl;
        S.sensor(c, X(zs) + 1, y0, sd * sc * 0.82, { pixels: 18 });
        kit.label(c, 'sensor', X(zs) + 10, y0 - sd * sc * 0.82 - 16, { color: C.muted, size: 11.5 });
        if (!cam.tele) {
          const h = epd / 2 * sc;
          for (const k of [-1, 0, 1]) S.ray(c, [[X(-0.8), y0 + k * h * 0.9], [X(lensX0), y0 + k * h * 0.9], [X(zs), y0]], { nm: 580, width: 1.3, arrows: false });
          for (const k of [-1, 0, 1]) S.ray(c, [[X(-0.8), y0 - sd * sc * 0.45 + k * h * 0.9], [X(lensX0), y0 - sd * sc * 0.45 + k * h * 0.9], [X(zs), y0 + sd * sc * 0.82 * 0.9]], { color: C.accent, width: 1.1, arrows: false });
          S.dim(c, X(lensX0), y0 + Hh * 0.43, X(zs), y0 + Hh * 0.43, 'track length ' + cam.ttl + ' mm', { off: 12 });
        } else S.dim(c, X(9), y0 + Hh * 0.42, X(9 + cam.ttl), y0 + Hh * 0.42, 'track length ' + cam.ttl + ' mm (folded)', { off: 12 });
        kit.label(c, 'schematic: typical element count, order and shapes — not a real prescription', W - 12, Hh - 8, { align: 'right', color: C.faint, size: 11 });
        const crop = 43.267 / cam.diag, fv = 2 * Math.atan(cam.diag / (2 * cam.f)), airy = 2 * O.diff.airyRadius(550, cam.N) * 1e6, k = airy / V.pix;
        ro.set('eq', (cam.f * crop).toFixed(0) + ' mm · ' + (fv * R2D).toFixed(0) + '°');
        ro.set('N', 'f/' + cam.N + ' · ' + epd.toFixed(1) + ' mm');
        ro.set('ttl', cam.ttl + ' mm · ' + (cam.ttl / cam.diag).toFixed(2) + ' · ' + (cam.ttl / cam.f).toFixed(2));
        ro.set('airy', airy.toFixed(2) + ' µm = ' + k.toFixed(1) + ' pixels');
        ro.set('cra', '≈ ' + cam.cra + '°');
        ro.set('els', n + ' moulded plastic' + (cam.tele ? ', folded by a prism' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ END */
})();
