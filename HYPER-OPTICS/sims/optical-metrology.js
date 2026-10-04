/* HYPER-OPTICS · sims/optical-metrology.js — simulations of the topic "Measuring with light, measuring optics" (ids mt-…)
 *   mt-focal-length     three ways to a focal length or a radius: autocollimation, Bessel's two lens positions, the spherometer
 *   mt-autocollimator   a mirror tilt θ moves the returned image by 2fθ: the detector view, a window with a wedge
 *   mt-interferometer   a Fizeau interferogram of a surface with tilt, power, astigmatism, a bump; four phase-shifted frames; PV and RMS
 *   mt-shack-hartmann   a wavefront, its map of lenslet spots (spot shift = slope × focal length) and the numbers
 *   mt-spectrophotometer  a sample in a beam: transmittance and absorbance against wavelength, bandwidth and stray light
 *   mt-refractometer    a critical-angle refractometer: the light–dark border for a liquid, a sugar solution, temperature
 *   mt-ellipsometer     reflection from a film on silicon: Ψ and Δ against thickness, the polarization ellipse of the reflected light
 *   mt-profiler         a stylus and an optical sensor traversing the same surface; the white-light correlogram
 *   mt-displacement     triangulation, interferometer counting and time of flight: the raw signal and the resolution
 *   mt-alignment        a line of sight through five stations: offsets read in micrometres, the spot growing with distance
 * Numbers come from kit.optics (thin films for the ellipsometer, scanning functions, diffraction, beams, materials); the drawing from
 * kit.osym and kit.plot. Paraxial ray paths of the focal-length sim are traced here with the two matrices (free space, thin lens) that
 * the bench uses; the wavefront and surface maps are analytic shapes (Zernike-like) drawn as images. Angles in these pictures are
 * exaggerated where the text says so.
 */
(function () {
  'use strict';
  const PI = Math.PI, D2R = PI / 180, R2D = 180 / PI, ARCSEC = PI / 648000;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fx = (v, d) => (Number.isFinite(v) ? v.toFixed(d) : '—');

  /* ================================================================ focal length and radius */
  Hyper.sim('mt-focal-length', {
    title: 'Measuring a focal length and a radius',
    blurb: `Three bench methods. In **autocollimation** a cross-hair in front of the lens is reflected by a flat mirror behind it; its returned image (the dashed rays) lands back on the cross-hair, sharp, only when the cross-hair is in the focal plane. In **Bessel's method** the object and the screen stay put and the lens is slid between them: two positions give a sharp image, and their separation gives the focal length. The **spherometer** reads the sag of a surface under a ring of feet.

**Try this**
- *Autocollimation.* Slide the cross-hair distance until the blur of the returned image shrinks to nothing. It happens exactly at the focal length, whatever the lens: change f and find it again.
- *Bessel.* Slide the lens between the two marked positions: the image is sharp at x₁ (reduced) and at x₂ (enlarged), blurred in between. Shrink L towards 4f and the two positions merge.
- *Spherometer.* The sag of a long radius is a few micrometres. Lengthen R and see what a gauge reading to 10 µm does to the answer.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'method', type: 'select', label: 'Method', options: [['Autocollimation', 'auto'], ['Bessel: two lens positions', 'bessel'], ['Spherometer: sag under three feet', 'sph']], value: params.method || 'auto' },
        { id: 'f', label: 'Focal length of the lens under test', min: 50, max: 200, step: 1, value: params.f || 100, unit: 'mm' },
        { id: 'so', label: 'Cross-hair distance from the lens', min: 40, max: 300, step: 0.5, value: params.so || 134, unit: 'mm' },
        { id: 'L', label: 'Object-to-screen distance L', min: 160, max: 900, step: 5, value: params.L || 500, unit: 'mm' },
        { id: 'x', label: 'Lens position from the object', min: 20, max: 880, step: 1, value: 200, unit: 'mm' },
        { id: 'two', type: 'check', label: 'Mark the two sharp positions', value: true },
        { id: 'R', label: 'Radius of the surface', min: 30, max: 5000, value: params.R || 400, log: true, sig: 3, fmt: v => kit.fmt(v, 3) + ' mm' },
        { id: 'r', label: 'Ring radius of the feet', min: 10, max: 40, step: 1, value: 20, unit: 'mm' },
        { id: 'res', type: 'select', label: 'The gauge reads to', options: [['1 µm', 0.001], ['5 µm', 0.005], ['10 µm', 0.01]], value: 0.001 }
      ], id => { if (id === 'method') layout(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [
        ['a1', 'Lens under test'], ['a2', 'Cross-hair distance'], ['a3', 'Blur of the returned image'], ['a4', 'Verdict'],
        ['b1', 'Sharp lens positions'], ['b2', 'Shift d = x₂ − x₁'], ['b3', 'f = (L² − d²)/4L'], ['b4', 'This lens position'],
        ['s1', 'Sag of the surface'], ['s2', 'The gauge reads'], ['s3', 'R = (r² + s²)/2s'], ['s4', 'Error of the radius']
      ]);
      function layout() {
        const m = V.method;
        ['f', 'so'].forEach(k => ctl.show(k, m === 'auto')); ctl.show('f', m !== 'sph');
        ['L', 'x', 'two'].forEach(k => ctl.show(k, m === 'bessel'));
        ['R', 'r', 'res'].forEach(k => ctl.show(k, m === 'sph'));
        ['a1', 'a2', 'a3', 'a4'].forEach(k => ro.show(k, m === 'auto'));
        ['b1', 'b2', 'b3', 'b4'].forEach(k => ro.show(k, m === 'bessel'));
        ['s1', 's2', 's3', 's4'].forEach(k => ro.show(k, m === 'sph'));
      }
      layout();
      const APERTURE = 25, MIRROR = 90;                                   // lens aperture and mirror distance (mm)
      // paraxial path of the marginal ray in the autocollimation set-up (object on the axis, flat mirror MIRROR behind the lens)
      function autoTrace(f, so) {
        const a = APERTURE / 2, u = a / so, u1 = u - a / f, h2 = a + u1 * 2 * MIRROR, u2 = u1 - h2 / f;
        return { a, u1, h2, u2, hret: h2 + u2 * so, hm: a + u1 * MIRROR };
      }
      kit.drag(st, {
        hover: true,
        hit: p => (V.method === 'auto' ? (Math.abs(p.x - st.W * 0.1) < 40 || Math.abs(p.x - sxObj(V.so)) < 14 ? 'so' : null) : V.method === 'bessel' ? (Math.abs(p.x - lensX(V)) < 16 ? 'x' : null) : null),
        move: (what, p) => {
          if (what === 'so') ctl.set('so', clamp(Math.round(((st.W * 0.62 - p.x) / (st.W * 0.52 / 300)) * 2) / 2, 40, 300));
          else { const sx = (st.W - 70) / V.L; ctl.set('x', clamp(Math.round((p.x - 35) / sx), 20, Math.min(880, V.L - 20))); }
          loop.once();
        }
      });
      const sxObj = so => st.W * 0.62 - so * st.W * 0.52 / 300;
      const lensX = v => 35 + v.x * (st.W - 70) / v.L;
      function drawAuto(c, C, W, Hh) {
        const f = V.f, so = V.so, t = autoTrace(f, so), sx = W * 0.52 / 300, sy = Math.min(3.4 * sx, Hh * 0.0105 * 3.4);
        const xL = W * 0.62, y0 = Hh * 0.5, X = z => xL + z * sx, Y = h => y0 - h * sy;
        S.axis(c, 14, y0, W - 14);
        // the mirror, the lens, the cross-hair
        S.flatMirror(c, X(MIRROR), Y(26), X(MIRROR), Y(-26));
        S.thinLens(c, xL, y0, Y(-14) - y0, f, { label: 'lens, f = ' + f + ' mm' });
        const xo = X(-so);
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.moveTo(xo, Y(7)); c.lineTo(xo, Y(-7)); c.moveTo(xo - 5, y0); c.lineTo(xo + 5, y0); c.stroke();
        kit.label(c, 'cross-hair', xo, Y(-12) + 4, { align: 'center', color: C.muted, size: 11.5 });
        // the marginal rays: out to the mirror and back
        const rayOut = sgn => S.ray(c, [[xo, y0], [xL, Y(sgn * t.a)], [X(MIRROR), Y(sgn * t.hm)]], { nm: 600, width: 1.4, arrows: false });
        const rayBack = sgn => S.ray(c, [[X(MIRROR), Y(sgn * t.hm)], [xL, Y(sgn * t.h2)], [xo, Y(sgn * t.hret)]], { color: C.warn, width: 1.4, dash: [5, 3], arrows: false });
        rayOut(1); rayOut(-1); rayBack(1); rayBack(-1);
        // the returned image at the cross-hair plane
        const bl = Math.abs(t.hret) * 2;
        c.strokeStyle = bl < 0.25 ? C.ok : C.warn; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(xo + 7, Y(Math.abs(t.hret))); c.lineTo(xo + 7, Y(-Math.abs(t.hret))); c.stroke(); c.lineCap = 'butt';
        S.dim(c, xo, Y(-20), xL, Y(-20), so.toFixed(1) + ' mm', { off: 12 });
        kit.label(c, 'mirror', X(MIRROR) + 10, Y(30), { color: C.muted, size: 11.5 });
        kit.label(c, bl < 0.25 ? 'returned image: sharp, on the cross-hair' : 'returned image: blurred', 12, 16, { color: bl < 0.25 ? C.ok : C.warn, size: 12, weight: 600 });
        ro.set('a1', 'f = ' + f.toFixed(0) + ' mm (hidden in practice)');
        ro.set('a2', so.toFixed(1) + ' mm');
        ro.set('a3', bl < 0.01 ? 'none' : bl.toFixed(2) + ' mm');
        ro.set('a4', bl < 0.25 ? 'sharp: f = ' + so.toFixed(1) + ' mm  (error ' + fx(so - f, 1) + ' mm)' : 'not sharp: move the cross-hair ' + (so > f ? 'closer' : 'farther'));
      }
      function drawBessel(c, C, W, Hh) {
        const f = V.f, L = V.L, x = Math.min(V.x, L - 20), sx = (W - 70) / L, y0 = Hh * 0.52, ho = 10, sy = Hh * 0.012;
        const X = z => 35 + z * sx, Y = h => y0 - h * sy;
        const sb = L - x, sd = 1 / (1 / f - 1 / x), real = x > f;
        S.axis(c, 14, y0, W - 14);
        S.object(c, X(0), y0, ho * sy, { label: 'object' });
        S.screen(c, X(L), y0, Hh * 0.3, { label: 'screen' });
        // rays from the object tip: parallel to the axis then through the rear focus, and through the lens centre
        const tip = [X(0), Y(ho)], hs = hh => [X(L), Y(hh)];
        const hParallel = ho * (1 - sb / f), hCentre = -ho * sb / x;
        S.ray(c, [tip, [X(x), Y(ho)], hs(hParallel)], { nm: 600, width: 1.3, arrows: false });
        S.ray(c, [tip, hs(hCentre)], { nm: 600, width: 1.3, arrows: false });
        S.thinLens(c, X(x), y0, Hh * 0.2, f, { label: 'lens' });
        if (real && Math.abs(sd) < 2000) { const m = sd / x; S.object(c, X(x + sd), y0, -m * ho * sy, { dash: true, color: C.muted }); }
        // blur of the image on the screen
        const a = APERTURE / 2, u = a / x, u1 = u - a / f, hscr = a + u1 * sb, blur = 2 * Math.abs(hscr);
        c.strokeStyle = blur < 0.4 ? C.ok : C.warn; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(X(L) - 6, Y(Math.min(hscr, 60))); c.lineTo(X(L) - 6, Y(-Math.min(hscr, 60))); c.stroke(); c.lineCap = 'butt';
        const disc = L * L - 4 * f * L, ok = disc >= 0, x1 = ok ? (L - Math.sqrt(disc)) / 2 : NaN, x2 = ok ? (L + Math.sqrt(disc)) / 2 : NaN;
        if (V.two && ok) {
          for (const [xx, nm] of [[x1, 'x₁'], [x2, 'x₂']]) {
            c.strokeStyle = C.accent; c.lineWidth = 1.2; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(xx), y0 - Hh * 0.22); c.lineTo(X(xx), y0 + Hh * 0.22); c.stroke(); c.setLineDash([]);
            kit.label(c, nm, X(xx), y0 + Hh * 0.22 + 11, { align: 'center', color: C.accent, weight: 650 });
          }
        }
        S.dim(c, X(0), Hh - 20, X(L), Hh - 20, 'L = ' + L + ' mm', { off: -10 });
        ro.set('b1', ok ? 'x₁ = ' + x1.toFixed(1) + ' mm and x₂ = ' + x2.toFixed(1) + ' mm' : 'none: L is less than 4f = ' + (4 * f) + ' mm');
        ro.set('b2', ok ? (x2 - x1).toFixed(1) + ' mm' : '—');
        ro.set('b3', ok ? ((L * L - (x2 - x1) * (x2 - x1)) / (4 * L)).toFixed(1) + ' mm' : '—');
        ro.set('b4', !real ? 'x ≤ f: no real image' : blur < 0.4 ? 'sharp, magnification ' + (sd / x).toFixed(2) : 'blurred by ' + blur.toFixed(1) + ' mm on the screen');
      }
      function drawSph(c, C, W, Hh) {
        const R = V.R, r = Math.min(V.r, R * 0.95), sag = R - Math.sqrt(R * R - r * r);
        const sReading = Math.round(sag / V.res) * V.res, Rr = sReading > 0 ? (r * r + sReading * sReading) / (2 * sReading) : NaN;
        const sx = (W * 0.76) / (2 * r * 1.35), cx = W / 2, yTop = Hh * 0.46;
        const ex = clamp(Hh * 0.22 / Math.max(sag * sx, 1e-6), 1, 4000);            // vertical exaggeration so the sag is visible
        const Y = h => yTop - h * sx * ex;                                          // h: height of the surface above the plane of the feet
        // the surface (convex: highest at the middle)
        const zs = u => { const rr = Math.min(Math.abs(u), R * 0.999); return sag - (R - Math.sqrt(R * R - rr * rr)); };     // 0 at the feet, sag at the centre
        c.beginPath(); c.moveTo(cx - 1.35 * r * sx, Hh);
        for (let i = -40; i <= 40; i++) { const u = 1.35 * r * i / 40; c.lineTo(cx + u * sx, Y(zs(u))); }
        c.lineTo(cx + 1.35 * r * sx, Hh); c.closePath(); c.fillStyle = S.glass(0.3); c.fill(); c.strokeStyle = S.edge(); c.lineWidth = 1.5; c.stroke();
        // the feet, the plane through them, the probe
        c.strokeStyle = C.muted; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(cx - 1.35 * r * sx, Y(0)); c.lineTo(cx + 1.35 * r * sx, Y(0)); c.stroke(); c.setLineDash([]);
        for (const sg of [-1, 1]) { c.fillStyle = C.text; c.beginPath(); c.arc(cx + sg * r * sx, Y(0), 5, 0, 2 * PI); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(cx + sg * r * sx, Y(0) - 5); c.lineTo(cx + sg * r * sx, Y(0) - 46); c.stroke(); }
        c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(cx, Y(sag)); c.lineTo(cx, Y(sag) - 40); c.stroke(); c.fillStyle = C.accent; c.beginPath(); c.arc(cx, Y(sag), 4.5, 0, 2 * PI); c.fill();
        c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(cx - r * sx, Y(0) - 46); c.lineTo(cx + r * sx, Y(0) - 46); c.stroke();
        S.dim(c, cx - r * sx, Hh - 18, cx, Hh - 18, 'r = ' + r + ' mm', { off: -10 });
        S.dim(c, cx + 0.45 * r * sx, Y(0), cx + 0.45 * r * sx, Y(sag), 's', { off: 11 });
        kit.label(c, 'height drawn ' + (ex < 1.5 ? 'to scale' : '× ' + Math.round(ex) + ' too large'), 12, 16, { color: C.muted, size: 11.5 });
        kit.label(c, 'dial gauge (centre probe)', cx + 10, Y(sag) - 52, { color: C.accent, size: 11.5 });
        ro.set('s1', sag >= 0.1 ? sag.toFixed(3) + ' mm' : (sag * 1000).toFixed(1) + ' µm');
        ro.set('s2', (sReading * 1000).toFixed(0) + ' µm  (steps of ' + (V.res * 1000) + ' µm)');
        ro.set('s3', Number.isFinite(Rr) ? Rr.toFixed(Rr < 1000 ? 1 : 0) + ' mm' : 'sag below the gauge step: no reading');
        ro.set('s4', Number.isFinite(Rr) ? (100 * (Rr - R) / R >= 0 ? '+' : '') + (100 * (Rr - R) / R).toFixed(1) + ' %' : '—');
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        if (V.method === 'auto') drawAuto(c, C, st.W, st.H); else if (V.method === 'bessel') drawBessel(c, C, st.W, st.H); else drawSph(c, C, st.W, st.H);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the autocollimator */
  Hyper.sim('mt-autocollimator', {
    title: 'The autocollimator: a tilt becomes a displacement',
    blurb: `The instrument sends a parallel beam to a flat mirror and looks at the returned image of its own cross-hair. Tilt the mirror by θ and the beam comes back turned by **2θ**; the objective focuses it at a distance **2fθ** from the cross-hair. The angles in the drawing are exaggerated hundreds of times so that you can see them; the numbers and the detector view in the corner are true.

**Try this**
- Tilt the mirror by 1″ (drag its top end, or use the slider): with f = 300 mm the image moves 2.9 µm, a little over half a 5 µm pixel.
- Move the mirror far away or close: *nothing changes*. Only the tilt counts.
- Raise the focal length: the same tilt gives a bigger shift, but the largest measurable tilt falls.
- Switch to the **window**: its two faces give two images, 2nα apart. Set a wedge of 1′ and read 180″ between them.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const EX = 0.002, EXW = 0.012;                      // drawing exaggeration: radians per arc-second of tilt, per arc-minute of wedge
      const ctl = kit.controls(box.side, [
        { id: 'tilt', label: 'Tilt of the mirror or window', min: -60, max: 60, step: 0.1, value: params.tilt != null ? params.tilt : 10, fmt: v => (v > 0 ? '+' : '') + v.toFixed(1) + '″' },
        { id: 'f', label: 'Focal length of the objective', min: 150, max: 600, step: 10, value: params.f || 300, unit: 'mm' },
        { id: 'dist', label: 'Distance to the target', min: 0.3, max: 10, step: 0.1, value: 2, unit: 'm' },
        { id: 'target', type: 'select', label: 'Target', options: [['A flat mirror', 'mirror'], ['A glass window with a wedge (n = 1.5)', 'window']], value: params.target || 'mirror' },
        { id: 'wedge', label: 'Wedge angle of the window', min: 0, max: 3, step: 0.05, value: 1, unit: '′' }
      ], id => { if (id === 'target') ctl.show('wedge', V.target === 'window'); loop.once(); });
      const V = ctl.values;
      ctl.show('wedge', V.target === 'window');
      const ro = kit.readout(box.side, [['a', 'Tilt of the target'], ['b', 'Returned beam turned by'], ['c', 'Image shift'], ['d', 'In pixels of 5 µm'], ['e', 'The beam resolves (D = 40 mm)'], ['g', 'Largest tilt on a 6 mm detector']]);
      kit.drag(st, {
        hover: true,
        hit: p => (Math.abs(p.x - st.W * 0.84) < 22 && Math.abs(p.y - st.H * 0.5) < st.H * 0.27 ? 'mirror' : null),
        move: (what, p) => { ctl.set('tilt', clamp(Math.round(((st.H * 0.5 - p.y) / (st.H * 0.22) * 60) * 10) / 10, -60, 60)); loop.once(); }
      });
      const N_GLASS = 1.5;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, y0 = Hh * 0.5;
        const f = V.f, th = V.tilt * ARCSEC, win = V.target === 'window', alpha = win ? V.wedge * 60 * ARCSEC : 0;
        // the true numbers: the front surface returns 2θ, the back surface 2θ + 2nα
        const dxFront = f * 2 * th * 1e3, dxBack = f * (2 * th + 2 * N_GLASS * alpha) * 1e3;           // µm
        // the drawing (angles exaggerated)
        const xR = W * 0.06, xBS = W * 0.13, xL = W * 0.28, xM = W * 0.84, hw = Hh * 0.12, tv = V.tilt * EX, wv = V.wedge * EXW;
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.fillRect(xR - 10, y0 - hw * 1.6, xL - xR + 24, hw * 3.2); c.strokeRect(xR - 10, y0 - hw * 1.6, xL - xR + 24, hw * 3.2);
        c.fillStyle = C.bg2; c.fillRect(xR - 8, y0 - hw * 1.6 + 2, xL - xR + 20, hw * 3.2 - 4);
        S.beam(c, xL, xM, y0, hw, { nm: 635, alpha: 0.28 });
        // a returned beam turned by `ang` (exaggerated) is focused by the objective on the reticle plane
        const ret = (ang, col) => {
          const sl = Math.tan(ang), yAtL = y0 + (xM - xL) * sl, spot = y0 + (xL - xR) * sl;
          S.ray(c, [[xM, y0 - hw], [xL, yAtL - hw], [xR, spot]], { color: col, width: 1.2, arrows: false });
          S.ray(c, [[xM, y0 + hw], [xL, yAtL + hw], [xR, spot]], { color: col, width: 1.2, arrows: false });
        };
        ret(-2 * tv, C.warn);                                // tilting the top of the mirror towards the target sends the beam up
        if (win) ret(-(2 * tv + 2 * N_GLASS * wv), C.bad);
        S.thinLens(c, xL, y0, hw * 1.4, f, { label: 'objective, f = ' + f + ' mm' });
        S.splitter(c, xBS, y0, 18, {});
        S.source(c, xBS, y0 - hw * 1.6 - 8, { kind: 'led', size: 12, color: C.warn });
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(xR, y0 - hw * 0.9); c.lineTo(xR, y0 + hw * 0.9); c.stroke();
        kit.label(c, 'reticle and detector', xR + 6, y0 + hw * 1.6 + 15, { color: C.muted, size: 11.5 });
        // the target
        if (win) {
          const hh = Hh * 0.23, ux = Math.sin(tv), uy = Math.cos(tv), t1 = tv + wv, vx = Math.sin(t1), vy = Math.cos(t1);
          S.poly(c, [[xM - 8 + ux * hh, y0 - uy * hh], [xM - 8 - ux * hh, y0 + uy * hh], [xM + 8 - vx * hh, y0 + vy * hh], [xM + 8 + vx * hh, y0 - vy * hh]], {});
          kit.label(c, 'window with a wedge', xM, y0 - hh - 14, { align: 'center', color: C.muted, size: 11.5 });
        } else {
          S.flatMirror(c, xM + Math.sin(tv) * Hh * 0.24, y0 - Math.cos(tv) * Hh * 0.24, xM - Math.sin(tv) * Hh * 0.24, y0 + Math.cos(tv) * Hh * 0.24);
          kit.label(c, 'mirror (drag its top end)', clamp(xM, 90, W - 90), y0 - Hh * 0.28, { align: 'center', color: C.muted, size: 11.5 });
        }
        S.dim(c, xL, y0 + hw * 2.0, xM, y0 + hw * 2.0, V.dist.toFixed(1) + ' m (does not matter)', { off: 13 });
        kit.label(c, 'angles drawn much too large', 12, 16, { color: C.muted, size: 11.5 });
        // the detector view, true size: the box is ±20 µm, eight pixels of 5 µm
        const bs = Math.min(Hh * 0.36, W * 0.2), bx = W - bs - 14, by = 14, scl = bs / 40;
        c.fillStyle = C.surface; c.fillRect(bx, by, bs, bs); c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let i = 0; i <= 8; i++) { c.beginPath(); c.moveTo(bx + bs * i / 8, by); c.lineTo(bx + bs * i / 8, by + bs); c.moveTo(bx, by + bs * i / 8); c.lineTo(bx + bs, by + bs * i / 8); c.stroke(); }
        const cross = (dxum, col, w) => { const px = bx + bs / 2, py = by + bs / 2 - clamp(dxum, -19, 19) * scl; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(px - 8, py); c.lineTo(px + 8, py); c.moveTo(px, py - 8); c.lineTo(px, py + 8); c.stroke(); };
        cross(0, C.faint, 1.2);
        cross(dxFront, C.warn, 2.4);
        if (win) cross(dxBack, C.bad, 2.4);
        kit.label(c, 'detector view, true scale', W - 10, by + bs + 12, { align: 'right', color: C.muted, size: 11 });
        kit.label(c, 'grid: 5 µm pixels', W - 10, by + bs + 26, { align: 'right', color: C.faint, size: 11 });
        // the numbers
        ro.set('a', (V.tilt >= 0 ? '+' : '') + V.tilt.toFixed(1) + '″  (' + (V.tilt * 4.848).toFixed(1) + ' µrad)');
        ro.set('b', win ? 'front face ' + fx(2 * V.tilt, 1) + '″, back face ' + fx(2 * V.tilt + 2 * N_GLASS * V.wedge * 60, 1) + '″' : fx(2 * V.tilt, 1) + '″');
        ro.set('c', win ? 'front ' + fx(dxFront, 2) + ' µm, back ' + fx(dxBack, 2) + ' µm' : fx(dxFront, 2) + ' µm  (2fθ)');
        ro.set('d', win ? 'the two images are ' + fx(Math.abs(dxBack - dxFront) / 5, 1) + ' pixels apart' : fx(dxFront / 5, 2) + ' pixels');
        ro.set('e', fx(O.diff.rayleighAngle(550, 0.04) / ARCSEC, 1) + '″  (a centroid does better)');
        ro.set('g', '±' + fx(3 / (2 * f) / ARCSEC / 60, 1) + '′ of mirror tilt');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ shapes on the unit disc, shared by the two wavefront sims */
  const hsl = (h, s, l) => {
    const a = s * Math.min(l, 1 - l), f = n => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  };
  // a diverging map: white at 0, blue below, red above (t from −1 to 1)
  const diverge = t => { t = clamp(t, -1, 1); const a = Math.abs(t); return t < 0 ? [255 * (1 - a * 0.85), 255 * (1 - a * 0.5), 255] : [255, 255 * (1 - a * 0.6), 255 * (1 - a * 0.88)]; };
  const inDisc = (x, y) => x * x + y * y <= 1;

  /* ================================================================ an interferometer testing a surface */
  const FORMS = {
    power: (x, y) => x * x + y * y,
    astig: (x, y) => x * x - y * y,
    edge: (x, y) => -Math.exp(-(1 - Math.hypot(x, y)) / 0.07),
    bump: (x, y) => Math.exp(-(Math.pow(x - 0.3, 2) + Math.pow(y + 0.2, 2)) / (2 * 0.22 * 0.22)),
    ripple: (x, y) => 0.55 * Math.sin(2 * PI * 1.4 * x + 0.6) + 0.45 * Math.sin(2 * PI * 2.1 * y + 1.1)
  };
  const formCache = {};
  // the form with piston and tilt removed (as the instrument's software does), its peak-to-valley and RMS (for unit amplitude)
  function formInfo(kind) {
    if (formCache[kind]) return formCache[kind];
    const f = FORMS[kind], n = 41, pts = [];
    let sh = 0, sxx = 0, syy = 0, sxh = 0, syh = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const x = -1 + 2 * i / (n - 1), y = -1 + 2 * j / (n - 1);
      if (!inDisc(x, y)) continue;
      const h = f(x, y); pts.push([x, y, h]); sh += h; sxx += x * x; syy += y * y; sxh += x * h; syh += y * h;
    }
    const a = sh / pts.length, b = sxh / sxx, c = syh / syy, res = (x, y) => f(x, y) - a - b * x - c * y;
    let mn = Infinity, mx = -Infinity, ss = 0;
    for (const p of pts) { const r = p[2] - a - b * p[0] - c * p[1]; mn = Math.min(mn, r); mx = Math.max(mx, r); ss += r * r; }
    return (formCache[kind] = { res, pv0: mx - mn, rms0: Math.sqrt(ss / pts.length) });
  }

  Hyper.sim('mt-interferometer', {
    title: 'An interferometer testing a surface',
    blurb: `A Fizeau interferometer lays a reference flat over the surface under test and a camera sees the fringes of the air gap. Light goes to the surface and back, so **one fringe is λ/2 of surface height**. The views show the raw interferogram, the four frames of a phase-shifting measurement (the reference is stepped by a quarter-wave of phase each time), the phase they give (wrapped: it jumps by one fringe) and the final height map with tilt removed.

**Try this**
- *Interferogram*: add tilt and watch straight fringes appear on top of any shape: more fringes, same surface. Only the bending of the fringes is error.
- Set a *local bump* of 158 nm (λ/4 at 632.8 nm): the fringes bow by half their spacing.
- Change the wavelength to green: the fringes get closer and the surface looks worse, though the surface is the same. That is why a grade is quoted *at a wavelength*.
- Look at the **wrapped phase** of a large error, then at the **height map**: unwrapping adds back the whole fringes.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 300, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'form', type: 'select', label: 'Shape of the surface error', options: [['Power: slightly spherical', 'power'], ['Astigmatism: a saddle', 'astig'], ['Turned-down edge', 'edge'], ['A local bump', 'bump'], ['Polishing ripple', 'ripple']], value: params.form || 'bump' },
        { id: 'amp', label: 'Size of the error (peak to valley)', min: 0, max: 600, step: 1, value: params.amp != null ? params.amp : 158, unit: 'nm' },
        { id: 'tilt', label: 'Tilt of the reference (fringes across)', min: 0, max: 8, step: 0.1, value: params.tilt != null ? params.tilt : 3 },
        { id: 'nm', type: 'select', label: 'Wavelength', options: [['Helium–neon, 632.8 nm', 632.8], ['Green, 532 nm', 532], ['Blue, 450 nm', 450]], value: 632.8 },
        { id: 'view', type: 'select', label: 'Show', options: [['The interferogram', 'ifg'], ['Four phase-shifted frames', 'four'], ['The wrapped phase', 'wrap'], ['The height map', 'map']], value: params.view || 'ifg' }
      ], () => { drawPlot(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fr', 'One fringe is λ/2'], ['pv', 'Peak to valley (tilt removed)'], ['wv', 'In wavelengths'], ['rms', 'RMS'], ['gr', 'Grade'], ['nf', 'Fringes across, form and tilt']]);
      const plot = kit.plot(box.side, { x: { label: 'x (mm)', min: -50, max: 50 }, y: { label: 'h (nm)' }, hoverRead: false }, 150);
      function drawPlot() {
        const info = formInfo(V.form), k = info.pv0 > 0 ? V.amp / info.pv0 : 0, pts = [];
        for (let i = 0; i <= 40; i++) { const x = -1 + 2 * i / 40; pts.push([x * 50, k * info.res(x, 0)]); }
        plot.set({ series: [{ pts, label: 'section' }] });
      }
      drawPlot();
      const heightAt = (info, k, x, y) => k * info.res(x, y) + V.tilt * (V.nm / 2) * (x + 1) / 2;       // nm, form plus tilt
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const info = formInfo(V.form), k = info.pv0 > 0 ? V.amp / info.pv0 : 0, lam = V.nm;
        const sq = Math.min(Hh - 30, W - 24, 380), x0 = (W - sq) / 2, y0 = 24;
        const keyBase = [V.form, V.amp, V.tilt, V.nm, C.dark ? 'd' : 'l'].join();
        const bgc = C.dark ? [16, 20, 42] : [226, 230, 242];
        const I = (x, y, step) => 0.5 * (1 + Math.cos(4 * PI * heightAt(info, k, x, y) / lam + step));
        if (V.view === 'ifg') {
          S.image(c, x0, y0, sq, sq, 140, 140, (u, v) => { const x = 2 * u - 1, y = 2 * v - 1; return inDisc(x, y) ? I(x, y, 0) : 0; }, { nm: lam, gamma: 0.8, key: 'ifg' + keyBase, id: 'ifg' });
          kit.label(c, 'interferogram: reference against test surface', W / 2, 11, { align: 'center', color: C.muted, size: 11.5 });
        } else if (V.view === 'four') {
          const s2 = Math.min(sq / 2 - 6, (W - 30) / 2 - 6);
          for (let q = 0; q < 4; q++) {
            const px = W / 2 - s2 - 4 + (q % 2) * (s2 + 8), py = y0 + (q >> 1) * (s2 + 22);
            S.image(c, px, py, s2, s2, 70, 70, (u, v) => { const x = 2 * u - 1, y = 2 * v - 1; return inDisc(x, y) ? I(x, y, q * PI / 2) : 0; }, { nm: lam, gamma: 0.8, key: 'f' + q + keyBase, id: 'f' + q });
            kit.label(c, 'frame ' + (q + 1) + ' (' + q * 90 + '°)', px + s2 / 2, py + s2 + 9, { align: 'center', color: C.muted, size: 11 });
          }
          kit.label(c, 'four frames, a quarter-wave of phase apart', W / 2, 11, { align: 'center', color: C.muted, size: 11.5 });
        } else if (V.view === 'wrap') {
          S.image(c, x0, y0, sq, sq, 140, 140, (u, v) => {
            const x = 2 * u - 1, y = 2 * v - 1; if (!inDisc(x, y)) return bgc;
            const I1 = I(x, y, 0), I2 = I(x, y, PI / 2), I3 = I(x, y, PI), I4 = I(x, y, 1.5 * PI);
            return hsl(((Math.atan2(I4 - I2, I1 - I3) / (2 * PI) + 1.5) % 1) * 360, 0.85, 0.5);
          }, { key: 'wrap' + keyBase, id: 'wrap' });
          kit.label(c, 'wrapped phase: one colour cycle = one fringe (λ/2)', W / 2, 11, { align: 'center', color: C.muted, size: 11 });
        } else {
          const half = Math.max(V.amp / 2, 20);
          S.image(c, x0, y0, sq, sq, 140, 140, (u, v) => { const x = 2 * u - 1, y = 2 * v - 1; return inDisc(x, y) ? diverge(k * info.res(x, y) / half) : bgc; }, { key: 'map' + keyBase, id: 'map' });
          kit.label(c, 'height map, tilt removed: blue low, red high, ±' + half.toFixed(0) + ' nm', W / 2, 11, { align: 'center', color: C.muted, size: 11.5 });
        }
        if (V.view !== 'four') { c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(x0 + sq / 2, y0 + sq / 2, sq / 2, 0, 2 * PI); c.stroke(); }
        const pv = V.amp, rms = k * info.rms0;
        ro.set('fr', (lam / 2).toFixed(1) + ' nm');
        ro.set('pv', pv.toFixed(0) + ' nm');
        ro.set('wv', pv > 0.5 ? 'λ/' + (lam / pv).toFixed(1) + '  (' + (pv / lam).toFixed(3) + ' λ)' : 'a perfect surface');
        ro.set('rms', rms.toFixed(1) + ' nm  (λ/' + (rms > 0.01 ? (lam / rms).toFixed(0) : '∞') + ')');
        ro.set('gr', pv < 1 ? 'perfect' : pv <= lam / 50 * 1.0001 ? 'λ/50 or better' : pv <= lam / 20 * 1.0001 ? 'λ/20 or better' : pv <= lam / 10 * 1.0001 ? 'λ/10 or better' : pv <= lam / 4 * 1.0001 ? 'λ/4 or better' : 'worse than λ/4');
        ro.set('nf', (V.tilt + pv / (lam / 2)).toFixed(1) + ' at most  (' + (pv / (lam / 2)).toFixed(2) + ' from the form)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a Shack–Hartmann wavefront sensor */
  // Zernike terms, normalised to 1 wave RMS over the unit disc (Noll): f(x, y) in waves per unit amplitude
  const ZERN = {
    tilt: (x, y) => 2 * x,
    defocus: (x, y) => Math.sqrt(3) * (2 * (x * x + y * y) - 1),
    astig: (x, y) => Math.sqrt(6) * (x * x - y * y),
    coma: (x, y) => Math.sqrt(8) * (3 * (x * x + y * y) - 2) * x,
    trefoil: (x, y) => Math.sqrt(8) * (x * x * x - 3 * x * y * y),
    spherical: (x, y) => { const r2 = x * x + y * y; return Math.sqrt(5) * (6 * r2 * r2 - 6 * r2 + 1); },
    mixed: (x, y) => (0.6 * ZERN.defocus(x, y) + 0.6 * ZERN.coma(x, y) + 0.52 * ZERN.spherical(x, y)) / Math.sqrt(0.36 + 0.36 + 0.27)
  };
  Hyper.sim('mt-shack-hartmann', {
    title: 'A Shack–Hartmann wavefront sensor',
    blurb: `On the left, the wavefront of a beam as a map (blue behind, red ahead). On the right, what the sensor sees: each lenslet makes a spot, and **a spot moves by the local slope of the wavefront times the lenslet focal length**, Δx = f·α. The shifts in this picture are drawn magnified (they are a few micrometres in a lenslet a few hundred micrometres across); the numbers are true.

**Try this**
- *Tilt*: every spot moves by the same amount: the whole beam is turned. *Defocus*: the spots move outwards (or inwards) in proportion to the distance from the centre: the beam is converging or diverging.
- Lengthen the lenslet focal length: the shifts grow (more sensitive), until a spot leaves its own lenslet's square and turns red: the sensor is out of range.
- Raise the aberration to about 1 wave RMS and look at the Strehl ratio: Maréchal's rule says the peak of the image is then almost gone.
- *Coma* gives spots that bunch on one side; *spherical aberration* a ring of the wrong spacing.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300, maxH: 420 });
      const LAM = 632.8e-6, RP = 1.125;                              // mm: wavelength, pupil radius (a 2.25 mm beam)
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Aberration of the wavefront', options: [['Tilt', 'tilt'], ['Defocus', 'defocus'], ['Astigmatism', 'astig'], ['Coma', 'coma'], ['Trefoil', 'trefoil'], ['Spherical aberration', 'spherical'], ['Defocus, coma and spherical together', 'mixed']], value: params.kind || 'coma' },
        { id: 'amp', label: 'Size (RMS wavefront error)', min: 0, max: 3, step: 0.01, value: params.amp != null ? params.amp : 0.4, unit: 'waves', fmt: v => v.toFixed(2) + ' λ' },
        { id: 'fl', label: 'Lenslet focal length', min: 1, max: 30, step: 0.5, value: params.fl || 5, unit: 'mm' },
        { id: 'n', label: 'Lenslets across the beam', min: 5, max: 15, step: 2, value: params.n || 9 },
        { id: 'mag', type: 'select', label: 'Spot shifts are drawn', options: [['true size', 1], ['× 10', 10], ['× 50', 50], ['× 200', 200]], value: 50 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Lenslet pitch'], ['sh', 'Largest spot shift'], ['sl', 'Largest wavefront slope'], ['rg', 'Range of this sensor (p/2f)'], ['rms', 'RMS wavefront error (tilt removed)'], ['pv', 'Peak to valley'], ['sr', 'Strehl ratio (Maréchal)'], ['vd', 'Verdict']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, N = Math.round(V.n);
        const Z = ZERN[V.kind], a = V.amp, Wf = (x, y) => a * Z(x, y);
        const sq = Math.min(Hh - 44, (W - 36) / 2), xa = 12 + ((W - 36) / 2 - sq) / 2, xb = W - 12 - sq - ((W - 36) / 2 - sq) / 2, y0 = 26;
        const bgc = C.dark ? [16, 20, 42] : [226, 230, 242];
        // the wavefront map
        const half = Math.max(a * 3, 0.2);
        S.image(c, xa, y0, sq, sq, 110, 110, (u, v) => { const x = 2 * u - 1, y = 1 - 2 * v; return inDisc(x, y) ? diverge(Wf(x, y) / half) : bgc; }, { key: [V.kind, a, C.dark ? 'd' : 'l'].join(), id: 'wf' });
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(xa + sq / 2, y0 + sq / 2, sq / 2, 0, 2 * PI); c.stroke();
        kit.label(c, 'wavefront (±' + half.toFixed(1) + ' λ)', xa + sq / 2, 11, { align: 'center', color: C.muted, size: 11.5 });
        // the lenslet array and the spots
        c.fillStyle = C.surface; c.fillRect(xb, y0, sq, sq);
        const cell = sq / N, pitch = 2 * RP * 1000 / N;                      // µm
        let maxShift = 0, maxSlope = 0, outOfRange = 0;
        const hstep = 1e-3;
        for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
          const cx = -1 + (2 * i + 1) / N, cy = 1 - (2 * j + 1) / N;
          if (Math.hypot(cx, cy) > 1 - 0.55 / N) continue;                // lenslets that are (almost) fully lit
          // average slope over the lenslet: 3 × 3 samples
          let gx = 0, gy = 0, m = 0;
          for (let s = -1; s <= 1; s++) for (let t = -1; t <= 1; t++) {
            const x = cx + s * 0.3 * 2 / N, y = cy + t * 0.3 * 2 / N;
            gx += (Wf(x + hstep, y) - Wf(x - hstep, y)) / (2 * hstep); gy += (Wf(x, y + hstep) - Wf(x, y - hstep)) / (2 * hstep); m++;
          }
          gx /= m; gy /= m;                                                 // waves per unit of pupil radius
          const ax = gx * LAM / RP, ay = gy * LAM / RP;                     // slope, rad
          const dx = V.fl * ax * 1e3, dy = V.fl * ay * 1e3;                 // spot shift, µm
          const sh = Math.hypot(dx, dy); maxShift = Math.max(maxShift, sh); maxSlope = Math.max(maxSlope, Math.hypot(ax, ay));
          const bad = Math.abs(dx) > pitch / 2 || Math.abs(dy) > pitch / 2; if (bad) outOfRange++;
          const px = xb + (i + 0.5) * cell, py = y0 + (j + 0.5) * cell;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(xb + i * cell, y0 + j * cell, cell, cell);
          const mx = clamp(dx * V.mag / pitch * cell, -cell * 0.49, cell * 0.49), my = clamp(-dy * V.mag / pitch * cell, -cell * 0.49, cell * 0.49);
          c.fillStyle = C.faint; c.beginPath(); c.arc(px, py, 1.5, 0, 2 * PI); c.fill();
          c.fillStyle = bad ? C.bad : C.accent; c.beginPath(); c.arc(px + mx, py + my, Math.max(2, cell * 0.12), 0, 2 * PI); c.fill();
        }
        kit.label(c, 'spots' + (V.mag > 1 ? ' (shifts × ' + V.mag + ')' : ' (true size)'), xb + sq / 2, 11, { align: 'center', color: C.muted, size: 11.5 });
        // the numbers
        const sigma = V.kind === 'tilt' ? 0 : a, S2 = Math.exp(-Math.pow(2 * PI * sigma, 2));
        let mn = Infinity, mxv = -Infinity;
        for (let i = 0; i <= 30; i++) for (let j = 0; j <= 30; j++) { const x = -1 + i / 15, y = -1 + j / 15; if (!inDisc(x, y)) continue; const w = Wf(x, y); mn = Math.min(mn, w); mxv = Math.max(mxv, w); }
        const range = pitch / 2 / V.fl * 1e-3;                              // rad: (p/2)/f
        ro.set('p', pitch.toFixed(0) + ' µm  (' + N + ' across a 2.25 mm beam)');
        ro.set('sh', maxShift.toFixed(maxShift < 10 ? 2 : 1) + ' µm  (' + (100 * maxShift / pitch).toFixed(1) + ' % of the pitch)');
        ro.set('sl', (maxSlope * 1e3).toFixed(2) + ' mrad');
        ro.set('rg', (range * 1e3).toFixed(1) + ' mrad');
        ro.set('rms', sigma.toFixed(3) + ' λ  (' + (sigma * 632.8).toFixed(0) + ' nm)');
        ro.set('pv', (mxv - mn).toFixed(2) + ' λ');
        ro.set('sr', S2 > 0.995 ? '1.00' : S2.toFixed(2) + (S2 < 0.3 ? '  (rough)' : ''));
        ro.set('vd', outOfRange ? outOfRange + ' spots left their lenslet: out of range' : 'every spot inside its own lenslet');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ a spectrophotometer */
  Hyper.sim('mt-spectrophotometer', {
    title: 'A spectrophotometer: transmittance, absorbance and the slit',
    blurb: `Light from a lamp goes through a monochromator, one narrow band of wavelengths at a time, through the sample and on to a detector. The plot shows the **true** spectrum of the sample (dashed) and what the instrument **records** with the slit and the stray light you have chosen. The beam in the drawing is set to the wavelength of the slider and dims in proportion to what the sample lets through.

**Try this**
- *Dye*: at 10 µM in a 10 mm cuvette the peak absorbance is 0.4 (T = 40 %). Double the path length: A doubles, T falls to 16 %.
- Choose the **narrow band-pass filter** (3 nm wide) and widen the slit from 0.5 nm to 5 and then 20 nm: the peak sinks and the line broadens, though the filter has not changed.
- Choose the **neutral-density filter** of density 3 and add 0.5 % stray light: the instrument cannot read an absorbance above about 2.3, whatever the filter.
- Plot the **absorbance** instead of T: stacking two samples would simply add the curves.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, F = O.film;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'sample', type: 'select', label: 'Sample', options: [['A dye solution (model dye, band at 530 nm)', 'dye'], ['A narrow band-pass filter (550 nm, 3 nm wide)', 'bandpass'], ['An uncoated glass plate', 'glass'], ['A glass plate with a broadband anti-reflection coating', 'coated'], ['A neutral-density filter', 'nd']], value: params.sample || 'dye' },
        { id: 'conc', label: 'Dye concentration', min: 0, max: 40, step: 0.5, value: 10, unit: 'µM' },
        { id: 'path', label: 'Path length of the cuvette', min: 1, max: 50, step: 1, value: 10, unit: 'mm' },
        { id: 'od', label: 'Optical density of the filter', min: 0, max: 4, step: 0.05, value: params.od != null ? params.od : 2, fmt: v => v.toFixed(2) },
        { id: 'bw', label: 'Spectral bandwidth (slit)', min: 0.5, max: 50, value: params.bw || 2, log: true, sig: 2, fmt: v => kit.fmt(v, 2) + ' nm' },
        { id: 'stray', label: 'Stray light', min: 0, max: 1, step: 0.01, value: params.stray != null ? params.stray : 0.05, unit: '%' },
        { id: 'wl', label: 'Wavelength set on the instrument', min: 380, max: 780, step: 1, value: params.wl || 530, unit: 'nm' },
        { id: 'mode', type: 'select', label: 'Plot', options: [['Transmittance, T (%)', 'T'], ['Absorbance, A', 'A']], value: params.mode || 'T' }
      ], () => { layout(); compute(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'Transmittance at this wavelength'], ['A', 'Absorbance, as recorded'], ['tr', 'True absorbance'], ['mx', 'Largest absorbance the stray light allows']]);
      const plot = kit.plot(box.side, { x: { label: 'λ (nm)', min: 300, max: 800 }, y: { label: 'T (%)', min: 0, max: 100 }, hoverRead: false }, 190);
      const LO = 300, HI = 800, DL = 0.5, NP = Math.round((HI - LO) / DL) + 1;
      const trueCache = {};
      let spec = null;
      function layout() { ctl.show('conc', V.sample === 'dye'); ctl.show('path', V.sample === 'dye'); ctl.show('od', V.sample === 'nd'); }
      layout();
      function trueSpectrum() {
        const key = V.sample + (V.sample === 'dye' ? '|' + V.conc + '|' + V.path : V.sample === 'nd' ? '|' + V.od : '');
        if (trueCache[key]) return trueCache[key];
        const T = new Float64Array(NP), bp = F.design('bandpass', 550, 'N-BK7'), bb = F.design('bbar', 550, 'N-BK7');
        for (let i = 0; i < NP; i++) {
          const nm = LO + i * DL;
          if (V.sample === 'dye') { const eps = 40000 * Math.exp(-0.5 * Math.pow((nm - 530) / 28, 2)) + 12000 * Math.exp(-0.5 * Math.pow((nm - 340) / 24, 2)); T[i] = Math.pow(10, -eps * V.conc * 1e-6 * V.path / 10); }
          else if (V.sample === 'bandpass') T[i] = F.stack(bp, nm, 0).T;
          else if (V.sample === 'glass') { const R = O.normalR(1, O.index('N-BK7', nm)); T[i] = (1 - R) / (1 + R); }
          else if (V.sample === 'coated') { const R = F.stack(bb, nm, 0).R; T[i] = (1 - R) / (1 + R); }
          else T[i] = O.transmittance(V.od);
        }
        if (Object.keys(trueCache).length > 12) for (const k of Object.keys(trueCache)) delete trueCache[k];
        return (trueCache[key] = T);
      }
      function compute() {
        const T = trueSpectrum(), half = Math.max(0, Math.round(V.bw / DL)), s = V.stray / 100, M = new Float64Array(NP);
        for (let i = 0; i < NP; i++) {
          let acc = 0, wsum = 0;
          for (let k = -half; k <= half; k++) { const w = half ? 1 - Math.abs(k) / (half + 1) : 1, j = clamp(i + k, 0, NP - 1); acc += w * T[j]; wsum += w; }
          M[i] = (acc / wsum + s) / (1 + s);
        }
        spec = { T, M };
        const yv = v => V.mode === 'T' ? 100 * v : -Math.log10(Math.max(v, 1e-5));
        const pt = arr => { const o = []; for (let i = 0; i < NP; i++) o.push([LO + i * DL, yv(arr[i])]); return o; };
        plot.set({ x: { label: 'λ (nm)', min: 300, max: 800 }, y: V.mode === 'T' ? { label: 'T (%)', min: 0, max: 100 } : { label: 'A', min: 0, max: 5 }, series: [{ pts: pt(T), label: 'true', dash: true, width: 1.6 }, { pts: pt(M), label: 'recorded', width: 2.4 }], vlines: [{ x: V.wl }] });
      }
      compute();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, y0 = Hh * 0.38, hw = Hh * 0.035;
        const i = clamp(Math.round((V.wl - LO) / DL), 0, NP - 1), Tm = spec.M[i], Tt = spec.T[i];
        // lamp, monochromator, cuvette, detector
        S.source(c, W * 0.07, y0, { kind: 'bulb', size: 16 });
        S.beam(c, W * 0.1, W * 0.3, y0, hw * 1.6, { color: C.dark ? 'rgba(255,238,190,0.30)' : 'rgba(240,190,60,0.30)', edge: false });
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(W * 0.3, y0 - Hh * 0.2, W * 0.16, Hh * 0.4); c.strokeRect(W * 0.3, y0 - Hh * 0.2, W * 0.16, Hh * 0.4);
        S.grating(c, W * 0.38, y0 + Hh * 0.04, Hh * 0.1, { lines: 10 });
        c.strokeStyle = C.text; c.lineWidth = 2.4; c.beginPath(); c.moveTo(W * 0.3, y0 - hw * 2.2); c.lineTo(W * 0.3, y0 - hw * 0.9); c.moveTo(W * 0.3, y0 + hw * 0.9); c.lineTo(W * 0.3, y0 + hw * 2.2); c.moveTo(W * 0.46, y0 - hw * 2.2); c.lineTo(W * 0.46, y0 - hw * 0.9); c.moveTo(W * 0.46, y0 + hw * 0.9); c.lineTo(W * 0.46, y0 + hw * 2.2); c.stroke();
        S.beam(c, W * 0.46, W * 0.62, y0, hw, { nm: V.wl, alpha: 0.7 });
        // the cuvette, tinted for the dye
        const cw = W * 0.08, cx0 = W * 0.62, ch = Hh * 0.2;
        const tint = V.sample === 'dye' ? 'rgba(235,60,150,' + clamp(0.12 + 0.35 * (1 - Math.pow(10, -40000 * V.conc * 1e-6 * V.path / 10)), 0.1, 0.7) + ')' : S.glass(0.3);
        c.fillStyle = tint; c.fillRect(cx0, y0 - ch, cw, 2 * ch); c.strokeStyle = S.edge(); c.lineWidth = 1.4; c.strokeRect(cx0, y0 - ch, cw, 2 * ch);
        S.beam(c, cx0 + cw, W * 0.84, y0, hw, { nm: V.wl, alpha: clamp(0.06 + 0.64 * Math.pow(Tm, 0.6), 0.05, 0.75), edge: false });
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(W * 0.84, y0 - Hh * 0.1, W * 0.1, Hh * 0.2); c.strokeRect(W * 0.84, y0 - Hh * 0.1, W * 0.1, Hh * 0.2);
        kit.label(c, (Tm * 100 >= 10 ? (Tm * 100).toFixed(0) : (Tm * 100).toFixed(1)) + ' %', W * 0.89, y0, { align: 'center', color: C.accent, size: 13, weight: 650 });
        const lab = (t, x) => kit.label(c, t, x, y0 + Hh * 0.2 + 16, { align: 'center', color: C.muted, size: 11.5 });
        lab('lamp', W * 0.07); lab('monochromator', W * 0.38); lab('cuvette', cx0 + cw / 2); lab('detector', W * 0.89);
        kit.label(c, 'slit width sets the bandwidth', W * 0.38, y0 - Hh * 0.2 - 10, { align: 'center', color: C.faint, size: 11 });
        // the wavelength scale
        const bx = W * 0.06, bwid = W * 0.88, by = Hh * 0.78;
        S.spectrum(c, bx, by, bwid, 16, 380, 780, { ticks: 100 });
        const mx = bx + bwid * (V.wl - 380) / 400;
        c.fillStyle = C.text; c.beginPath(); c.moveTo(mx, by - 2); c.lineTo(mx - 6, by - 12); c.lineTo(mx + 6, by - 12); c.closePath(); c.fill();
        kit.label(c, V.wl + ' nm  (' + O.colourName(V.wl) + ')', clamp(mx, 70, W - 70), by - 22, { align: 'center', color: C.text, size: 12, weight: 600 });
        const A = -Math.log10(Math.max(Tm, 1e-6)), At = -Math.log10(Math.max(Tt, 1e-6)), s = V.stray / 100;
        ro.set('T', (Tm * 100).toFixed(Tm < 0.1 ? 2 : 1) + ' %');
        ro.set('A', A.toFixed(3));
        ro.set('tr', At.toFixed(3) + (Math.abs(At - A) > 0.02 ? '  (the record is off by ' + Math.abs(At - A).toFixed(2) + ')' : ''));
        ro.set('mx', s > 0 ? '≈ ' + (-Math.log10(s / (1 + s))).toFixed(2) : 'no limit set');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a critical-angle refractometer */
  Hyper.sim('mt-refractometer', {
    title: 'A critical-angle refractometer',
    blurb: `Light inside the sample reaches the prism at every angle up to grazing. Inside the prism the refracted rays fill the angles from 0 up to the **critical angle** θc, where sin θc = n(sample)/n(prism), and nothing beyond. The telescope sees a bright field and a dark one with a sharp border at θc. The scale on the right is marked in index; note that it is not evenly spaced.

**Try this**
- Slide the index of the sample up: the border climbs the scale. The fan of rays in the prism widens to the critical angle (the red ray).
- Choose **sugar solution** and set 20 °Bx: the index is 1.364 and the instrument reads 20 °Bx.
- Raise the temperature to 30 °C without compensation: the index falls by 10⁻³, and the reading is about 0.6 °Bx too low. Tick *compensation* to correct it.
- Push the index of the sample towards that of the prism (1.78): the angle grows steeply, the sensitivity rises, and the border disappears at n(prism).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const NP = O.index('N-SF11', 589.3), K = -1e-4, NMIN = 1.30, NMAX = 1.70;
      const brixToN = B => 1.3330 + 0.001392 * B + 7.06e-6 * B * B;
      const nToBrix = n => { const a = 7.06e-6, b = 0.001392, cc = 1.3330 - n, d = b * b - 4 * a * cc; return d < 0 ? NaN : (-b + Math.sqrt(d)) / (2 * a); };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'The sample is', options: [['Any liquid: set its index', 'n'], ['A sugar solution: set the degrees Brix', 'bx']], value: params.mode || 'n' },
        { id: 'n', label: 'Refractive index of the sample (20 °C)', min: NMIN, max: 1.74, step: 0.0005, value: params.n || 1.4, fmt: v => v.toFixed(4) },
        { id: 'bx', label: 'Sugar content', min: 0, max: 60, step: 0.5, value: params.bx != null ? params.bx : 20, unit: '°Bx' },
        { id: 'temp', label: 'Temperature of the sample', min: 10, max: 30, step: 0.5, value: params.temp || 20, unit: '°C' },
        { id: 'atc', type: 'check', label: 'Automatic temperature compensation', value: false }
      ], () => { layout(); loop.once(); });
      const V = ctl.values;
      function layout() { ctl.show('n', V.mode === 'n'); ctl.show('bx', V.mode === 'bx'); }
      layout();
      const ro = kit.readout(box.side, [['p', 'Index of the prism'], ['n20', 'Index of the sample at 20 °C'], ['nr', 'Index the instrument reads'], ['tc', 'Border angle in the prism'], ['bx', 'Brix from the reading'], ['er', 'Error from the temperature']]);
      const plot = kit.plot(box.side, { x: { label: 'n sample', min: NMIN, max: 1.75 }, y: { label: 'θc (°)' }, hoverRead: false }, 150);
      const tcOf = n => O.criticalAngle(NP, n) * R2D;
      const pts = []; for (let i = 0; i <= 90; i++) { const n = NMIN + (1.75 - NMIN) * i / 90; pts.push([n, tcOf(n)]); }
      const tcMin = tcOf(NMIN), tcMax = tcOf(NMAX);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const n20 = V.mode === 'bx' ? brixToN(V.bx) : V.n, nT = n20 + K * (V.temp - 20), nr = V.atc ? n20 : nT;
        const ok = nr < NP, tc = ok ? tcOf(nr) : NaN, tcr = tc * D2R;
        // ---- the prism, the sample film and the ray fan (left)
        const px0 = W * 0.04, px1 = W * 0.6, yb = Hh * 0.56, P = [W * 0.3, yb], L = Math.min(W * 0.28, Hh * 0.36);
        S.block(c, px0, Hh * 0.12, px1 - px0, yb - Hh * 0.12, {});
        kit.label(c, 'measuring prism, n = ' + NP.toFixed(3), px0 + 8, Hh * 0.12 + 14, { color: C.muted, size: 11.5 });
        c.fillStyle = S.glass(clamp(0.5 * (nr - 1), 0.1, 0.5)); c.fillRect(px0, yb, px1 - px0, 9);
        S.block(c, px0, yb + 9, px1 - px0, Hh * 0.2, { fill: C.dark ? 'rgba(160,170,200,0.15)' : 'rgba(90,100,130,0.14)' });
        kit.label(c, 'illuminating prism, ground face', px0 + 8, yb + 9 + Hh * 0.2 - 12, { color: C.muted, size: 11 });
        kit.label(c, 'sample film, n = ' + nr.toFixed(4), px1 - 8, yb + 5, { color: C.accent, size: 11.5, align: 'right', baseline: 'middle' });
        // the dark sector beyond the critical angle
        const sector = ok ? tcr : PI / 2;
        c.fillStyle = C.dark ? 'rgba(0,0,10,0.55)' : 'rgba(40,40,70,0.28)';
        c.beginPath(); c.moveTo(P[0], P[1]);
        for (let a = sector; a <= PI / 2 + 1e-6; a += 0.04) c.lineTo(P[0] + 1.1 * L * Math.sin(a), P[1] - 1.1 * L * Math.cos(a));
        c.lineTo(P[0] + 1.1 * L, P[1]); c.closePath(); c.fill();
        if (ok) for (const ai of [5, 20, 35, 50, 65, 78, 87]) {
          const i = ai * D2R, r = Math.asin(Math.min(1, nr * Math.sin(i) / NP));
          S.ray(c, [[P[0] - L * Math.sin(i), P[1] + L * Math.cos(i)], P, [P[0] + L * Math.sin(r), P[1] - L * Math.cos(r)]], { nm: 589.3, width: 1.3, alpha: 0.75, arrows: false });
        }
        if (ok) {
          S.ray(c, [[P[0] - L * 1.0, P[1] + 3], P, [P[0] + L * 1.1 * Math.sin(tcr), P[1] - L * 1.1 * Math.cos(tcr)]], { color: C.bad, width: 2.2, arrows: false });
          S.angle(c, P[0], P[1], L * 0.45, -PI / 2, -PI / 2 + tcr, 'θc', { color: C.bad });
          kit.label(c, 'grazing ray', P[0] - L * 0.98, P[1] + 20, { color: C.bad, size: 11, align: 'left' });
        }
        S.normal(c, P[0], P[1], PI / 2, L * 0.55);
        // ---- the eyepiece field (right)
        const er = Math.min(W * 0.12, Hh * 0.27), ex = W * 0.72, ey = Hh * 0.4;
        const t = ok ? clamp((tc - tcMin) / (tcMax - tcMin), -0.15, 1.15) : 1.2, yBorder = ey + er * (1 - 2 * t);
        c.save(); c.beginPath(); c.arc(ex, ey, er, 0, 2 * PI); c.clip();
        c.fillStyle = C.dark ? '#f3e7b8' : '#fff3c4'; c.fillRect(ex - er, ey - er, 2 * er, 2 * er);
        c.fillStyle = C.dark ? '#05060f' : '#2a2c3c'; c.fillRect(ex - er, ey - er, 2 * er, Math.max(0, yBorder - (ey - er)));
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(ex, ey, er, 0, 2 * PI); c.stroke();
        c.lineWidth = 1; c.strokeStyle = C.faint; c.beginPath(); c.moveTo(ex - er, ey); c.lineTo(ex + er, ey); c.moveTo(ex, ey - er); c.lineTo(ex, ey + er); c.stroke();
        // the scale beside it: ticks at index 1.30 … 1.70
        for (let nn = 1.3; nn <= 1.7001; nn += 0.05) {
          const tt = (tcOf(nn) - tcMin) / (tcMax - tcMin), yy = ey + er * (1 - 2 * tt);
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(ex + er + 4, yy); c.lineTo(ex + er + 12, yy); c.stroke();
          kit.label(c, nn.toFixed(2), ex + er + 16, yy, { color: C.muted, size: 10.5 });
        }
        if (ok && t > -0.05 && t < 1.05) { c.fillStyle = C.accent; c.beginPath(); c.moveTo(ex + er + 2, yBorder); c.lineTo(ex + er + 12, yBorder - 5); c.lineTo(ex + er + 12, yBorder + 5); c.closePath(); c.fill(); }
        kit.label(c, 'view in the telescope', ex, ey - er - 12, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, ok ? 'n = ' + nr.toFixed(4) : 'no border: n ≥ n(prism)', ex, ey + er + 16, { align: 'center', color: ok ? C.accent : C.bad, size: 12.5, weight: 650 });
        // ---- numbers
        const B = nToBrix(nr), Btrue = nToBrix(n20);
        ro.set('p', NP.toFixed(4) + '  (N-SF11 at 589.3 nm)');
        ro.set('n20', n20.toFixed(4));
        ro.set('nr', ok ? nr.toFixed(4) : 'above the prism index');
        ro.set('tc', ok ? tc.toFixed(2) + '°' : 'none');
        ro.set('bx', Number.isFinite(B) ? (B < 0 ? 'below water (' + B.toFixed(1) + ')' : B.toFixed(1) + ' °Bx') : '—');
        ro.set('er', V.atc ? 'compensated: none' : (nr - n20 >= 0 ? '+' : '−') + Math.abs(nr - n20).toFixed(4) + ' in n' + (V.mode === 'bx' && Number.isFinite(B) ? ';  ' + ((B - Btrue) >= 0 ? '+' : '−') + Math.abs(B - Btrue).toFixed(2) + ' °Bx' : ''));
        plot.set({ series: [{ pts, label: 'θc' }], marks: ok ? [{ x: nr, y: tc }] : [] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ an ellipsometer */
  Hyper.sim('mt-ellipsometer', {
    title: 'Ellipsometry: how a film changes the polarization',
    blurb: `A beam polarized at 45° (equal p and s) meets a film on a substrate. The reflected beam has a different p–s balance and a phase difference: its polarization is an ellipse (right), described by **Ψ** (amplitude ratio) and **Δ** (phase difference). The graph shows how Ψ and Δ run with the film thickness at the chosen angle; the dots mark the present sample. Light is 632.8 nm.

**Try this**
- Silicon, oxide index 1.457, 70°: take the thickness from 0 to 5 nm. Δ falls about 3° per nanometre; Ψ hardly moves.
- Push the thickness from 0 to 600 nm: both curves repeat every 284 nm. Change the angle and the period changes.
- Change the substrate to glass: its Brewster angle is 56.6°; below it Δ is near 180°, above it near 0°.
- Watch the ellipse: at Δ near 90° and Ψ near 45° it is a circle; at Δ = 0° or 180° it is a straight line.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, F = O.film, LAM = 632.8;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const SUB = {
        si: { name: 'silicon', nk: { n: 3.88, k: 0.02 } },
        glass: { name: 'glass (N-BK7)', nk: { n: O.index('N-BK7', LAM), k: 0 } },
        al: { name: 'aluminium', nk: (() => { const m = O.metalIndex('aluminium', LAM); return { n: m.n, k: m.k }; })() }
      };
      const ctl = kit.controls(box.side, [
        { id: 'sub', type: 'select', label: 'Substrate', options: [['Silicon (n = 3.88 + 0.02i)', 'si'], ['Glass N-BK7 (n = 1.515)', 'glass'], ['Aluminium (approximate handbook index)', 'al']], value: params.sub || 'si' },
        { id: 'nf', label: 'Refractive index of the film', min: 1.3, max: 2.4, step: 0.001, value: params.nf || 1.457, fmt: v => v.toFixed(3) },
        { id: 'd', label: 'Thickness of the film', min: 0, max: 600, step: 0.5, value: params.d != null ? params.d : 60, unit: 'nm' },
        { id: 'th', label: 'Angle of incidence', min: 45, max: 80, step: 0.5, value: params.th || 70, unit: '°' }
      ], () => { curve(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['psi', 'Ψ'], ['de', 'Δ'], ['sh', 'The reflected light is'], ['pb', 'Bare substrate: smallest p reflectance at'], ['pr', 'Ψ and Δ repeat every']]);
      const plot = kit.plot(box.side, { x: { label: 'd (nm)', min: 0, max: 600 }, y: { label: 'angle (°)', min: 0, max: 360 }, hoverRead: false }, 190);
      function pd(d, th, nf, nk) {
        const def = { n0: 1, ns: nk, layers: d > 0.01 ? [{ n: nf, d }] : [] };
        const s = F.stack(def, LAM, th, 's'), p = F.stack(def, LAM, th, 'p');
        let D = (p.phase - s.phase + PI) % (2 * PI); if (D < 0) D += 2 * PI;
        return { psi: Math.atan(Math.sqrt(p.Rp / Math.max(s.Rs, 1e-12))) * R2D, de: D * R2D, Rp: p.Rp };
      }
      function curve() {
        const nk = SUB[V.sub].nk, th = V.th * D2R, A = [], B = [];
        let prev = null;
        for (let i = 0; i <= 120; i++) {
          const d = 5 * i, q = pd(d, th, V.nf, nk);
          if (prev != null && Math.abs(q.de - prev) > 180) { A.push([d, NaN]); B.push([d, NaN]); }
          A.push([d, q.psi]); B.push([d, q.de]); prev = q.de;
        }
        const now = pd(V.d, th, V.nf, nk);
        plot.set({ series: [{ pts: A, label: 'Ψ' }, { pts: B, label: 'Δ' }], marks: [{ x: V.d, y: now.psi }, { x: V.d, y: now.de }], vlines: [] });
      }
      curve();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, th = V.th * D2R, nk = SUB[V.sub].nk;
        const q = pd(V.d, th, V.nf, nk), psi = q.psi * D2R, de = q.de * D2R;
        // ---- the beam on the sample (left)
        const ft = 3 + V.d / 600 * 20, L = Math.min(W * 0.25, Hh * 0.5), P = [W * 0.29, Hh * 0.7 - ft];
        c.fillStyle = C.dark ? '#555b73' : '#9aa1b8'; c.fillRect(W * 0.03, Hh * 0.7, W * 0.52, Hh * 0.14);
        c.fillStyle = S.glass(0.45); c.fillRect(W * 0.03, Hh * 0.7 - ft, W * 0.52, ft); c.strokeStyle = S.edge(); c.lineWidth = 1; c.strokeRect(W * 0.03, Hh * 0.7 - ft, W * 0.52, ft);
        kit.label(c, 'substrate: ' + SUB[V.sub].name + ' (film drawn too thick)', W * 0.04, Hh * 0.77, { color: C.text, size: 11 });
        kit.label(c, 'film ' + V.d.toFixed(V.d < 10 ? 1 : 0) + ' nm, n = ' + V.nf.toFixed(3), W * 0.04, Hh * 0.7 - ft - 8, { color: C.muted, size: 11 });
        S.normal(c, P[0], P[1], PI / 2, L * 0.9);
        const A0 = [P[0] - L * Math.sin(th), P[1] - L * Math.cos(th)], B0 = [P[0] + L * Math.sin(th), P[1] - L * Math.cos(th)];
        S.ray(c, [A0, P], { color: C.warn, width: 2.2, arrows: true, minArrow: 20 });
        S.ray(c, [P, B0], { color: C.accent, width: 2.2, arrows: true, minArrow: 20 });
        S.angle(c, P[0], P[1], L * 0.4, -PI / 2, -PI / 2 - th, 'θ', {});
        S.polarizer(c, P[0] - L * Math.sin(th) * 0.55, P[1] - L * Math.cos(th) * 0.55, 15, 0.785, { squash: 0.35 });
        S.polarizer(c, P[0] + L * Math.sin(th) * 0.55, P[1] - L * Math.cos(th) * 0.55, 15, 0.3, { squash: 0.35 });
        kit.label(c, 'polarizer 45°', P[0] - L * Math.sin(th) * 0.55, P[1] - L * Math.cos(th) * 0.55 - 24, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'analyzer', P[0] + L * Math.sin(th) * 0.55, P[1] - L * Math.cos(th) * 0.55 - 24, { align: 'center', color: C.muted, size: 11 });
        // ---- the polarization ellipse of the reflected light (right)
        const R = Math.min(W * 0.16, Hh * 0.26), ex = W * 0.78, ey = Hh * 0.36;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(ex - R, ey - R, 2 * R, 2 * R);
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(ex - R, ey); c.lineTo(ex + R, ey); c.moveTo(ex, ey - R); c.lineTo(ex, ey + R); c.stroke();
        kit.label(c, 'p', ex + R + 8, ey, { color: C.muted, size: 12 }); kit.label(c, 's', ex, ey - R - 9, { align: 'center', color: C.muted, size: 12 });
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.4; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(ex - R * 0.9, ey + R * 0.9); c.lineTo(ex + R * 0.9, ey - R * 0.9); c.stroke(); c.restore();
        c.beginPath();
        for (let i = 0; i <= 90; i++) { const tau = 2 * PI * i / 90, xx = ex + R * 0.95 * Math.sin(psi) * Math.cos(tau + de), yy = ey - R * 0.95 * Math.cos(psi) * Math.cos(tau); i ? c.lineTo(xx, yy) : c.moveTo(xx, yy); }
        c.closePath(); c.fillStyle = C.dark ? 'rgba(123,140,255,0.28)' : 'rgba(80,100,230,0.2)'; c.fill(); c.strokeStyle = C.accent; c.lineWidth = 2.2; c.stroke();
        kit.label(c, 'reflected light (p–s plane)', ex, ey + R + 14, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'dashed: incident, 45° linear', ex, ey + R + 29, { align: 'center', color: C.warn, size: 11 });
        // ---- numbers
        const chi = Math.abs(Math.sin(2 * psi) * Math.sin(de));
        const nf = V.nf, per = LAM / (2 * Math.sqrt(nf * nf - Math.sin(th) * Math.sin(th)));
        let best = 40, bestR = 2;
        for (let a = 40; a <= 89; a += 1) { const r = pd(0, a * D2R, nf, nk).Rp; if (r < bestR) { bestR = r; best = a; } }
        ro.set('psi', q.psi.toFixed(2) + '°');
        ro.set('de', q.de.toFixed(1) + '°');
        ro.set('sh', chi < 0.12 ? 'nearly linear' : chi > 0.9 ? 'nearly circular' : 'elliptical');
        ro.set('pb', best + '°' + (V.sub === 'glass' ? '  (Brewster: ' + (O.brewster(1, nk.n) * R2D).toFixed(1) + '°)' : '  (pseudo-Brewster)'));
        ro.set('pr', per.toFixed(0) + ' nm of film');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ stylus and optical profilers */
  const XW = 30, NX = 301;                                  // the trace: 30 µm in steps of 0.1 µm
  const smooth01 = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  // each specimen gives the height z (µm) at x (µm)
  const SPECIMENS = {
    grooves: x => {
      let z = 0;
      z -= 1.2 * Math.max(0, 1 - Math.abs(x - 5) / 2.5);                              // a V groove, 5 µm wide
      z -= 1.5 * (smooth01((x - 15.2) / 0.15) - smooth01((x - 16.8) / 0.15));         // a narrow groove, 1.6 µm wide
      z -= 1.0 * (smooth01((x - 22) / 0.3) - smooth01((x - 26) / 0.3));               // a wider groove, 4 µm
      return z;
    },
    rough: x => {
      const a = [[0.12, 3.1, 0.3], [0.18, 5.3, 1.7], [0.15, 8.7, 2.9], [0.10, 13, 4.1], [0.07, 2.2, 0.8]];
      let z = 0; for (const [amp, per, ph] of a) z += amp * Math.sin(2 * PI * x / per + ph);
      return z + 0.8 * smooth01((x - 14.7) / 0.6) - 0.4;
    },
    trench: x => -2 * (smooth01((x - 5) / 0.12) - smooth01((x - 13) / 0.12)) - 2 * (smooth01((x - 19) / 0.12) - smooth01((x - 21) / 0.12))
  };
  const specCache = {};
  const specArr = k => specCache[k] || (specCache[k] = Array.from({ length: NX }, (_, i) => SPECIMENS[k](i * XW / (NX - 1))));
  // what a stylus tip of radius r (µm) records: the lowest point of the tip, whose shape is a sphere blended into a 90° cone
  function stylusTrace(z, r) {
    const dx = XW / (NX - 1), uk = 0.7071 * r, hk = r - Math.sqrt(r * r - uk * uk);
    const tip = u => { u = Math.abs(u); return u <= uk ? r - Math.sqrt(Math.max(0, r * r - u * u)) : hk + (u - uk); };
    const M = Math.ceil(Math.min(40, 2.2 * r + 4) / dx), out = new Array(NX);
    for (let i = 0; i < NX; i++) {
      let best = -Infinity;
      for (let k = -M; k <= M; k++) { const j = i + k; if (j < 0 || j >= NX) continue; const v = z[j] - tip(k * dx); if (v > best) best = v; }
      out[i] = best;
    }
    return out;
  }
  // an optical sensor: blurred by the resolution, and blind where the flank is steeper than the aperture allows
  function opticalTrace(z, NA, matt, lam) {
    const dx = XW / (NX - 1), fw = 0.61 * lam / NA, sg = Math.max(fw / 2.355, 0.02), M = Math.ceil(2.5 * sg / dx), sm = new Array(NX);
    for (let i = 0; i < NX; i++) {
      let a = 0, w = 0;
      for (let k = -M; k <= M; k++) { const j = clamp(i + k, 0, NX - 1), g = Math.exp(-0.5 * Math.pow(k * dx / sg, 2)); a += g * z[j]; w += g; }
      sm[i] = a / w;
    }
    const smax = Math.tan((matt ? 1 : 0.5) * Math.asin(NA));
    return sm.map((v, i) => { const j0 = Math.max(0, i - 1), j1 = Math.min(NX - 1, i + 1), s = (z[j1] - z[j0]) / ((j1 - j0) * dx); return Math.abs(s) > smax ? NaN : v; });
  }

  Hyper.sim('mt-profiler', {
    title: 'A stylus and an optical profiler on the same surface',
    blurb: `The same 30 µm of surface is measured by a **stylus** (a diamond tip rolling over it) and by an **optical** sensor (white-light interferometer or confocal microscope). The drawing is to scale in both directions. The tip follows the *lowest point of its own shape*; the optical sensor blurs by its diffraction limit 0.61 λ/NA and cannot see a flank so steep that the reflected light misses the objective. The graph on the right is the **correlogram** of the white-light interferometer at the pixel you drag across the surface: its peak is the height.

**Try this**
- *Fine grooves*: a stylus of 2 µm radius sinks only 0.17 µm into the 1.6 µm groove (1.5 µm deep). Shrink the tip to 0.2 µm and it reaches 0.7 µm, where its 90° cone jams in the groove.
- *Trenches*: in this model the optical sensor loses the near-vertical walls (gaps in its trace) but reads the floors; the stylus rounds the corners of the narrow one and cannot reach its floor.
- Lower the NA to 0.3: the V-groove flanks drop out too. Tick *matt surface*: scattered light lets the sensor see steeper flanks.
- Change the source from white light to an LED: the correlogram is wider, so the peak is harder to place.
- Drag along the surface: the peak of the correlogram follows the height.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, LAM = 0.55;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'spec', type: 'select', label: 'Specimen', options: [['Fine grooves (V, 1.6 µm, 4 µm)', 'grooves'], ['A rough machined surface with a step', 'rough'], ['Two steep-walled trenches (8 µm and 2 µm)', 'trench']], value: params.spec || 'grooves' },
        { id: 'view', type: 'select', label: 'Show', options: [['Both instruments', 'both'], ['The stylus only', 'stylus'], ['The optical sensor only', 'optical']], value: 'both' },
        { id: 'r', label: 'Stylus tip radius', min: 0.2, max: 12.5, value: params.r || 2, log: true, sig: 2, fmt: v => kit.fmt(v, 2) + ' µm' },
        { id: 'NA', label: 'Numerical aperture of the objective', min: 0.1, max: 0.95, step: 0.01, value: params.NA || 0.9 },
        { id: 'matt', type: 'check', label: 'The surface is matt (scatters light)', value: false },
        { id: 'src', type: 'select', label: 'Source of the interferometer', options: [['White light, 600 nm, 250 nm wide', 250], ['Red LED, 630 nm, 30 nm wide', 30]], value: 250 }
      ], () => { traces(); corr(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r', 'Grooves narrower than this are not followed'], ['lat', 'Optical resolution, 0.61 λ/NA'], ['sl', 'Steepest flank the optical sensor sees'], ['es', 'Largest height error, stylus'], ['eo', 'Largest height error, optical'], ['lost', 'Optical trace missing'], ['lc', 'Width of the fringe envelope']]);
      const plot = kit.plot(box.side, { x: { label: 'scan z (µm)' }, y: { label: 'signal', min: 0, max: 2.2 }, hoverRead: false }, 170);
      let T = null, px = 8;                                    // the traces and the position of the pixel (µm)
      function traces() {
        const z = specArr(V.spec);
        T = { z, s: stylusTrace(z, V.r), o: opticalTrace(z, V.NA, V.matt, LAM) };
      }
      function corr() {
        const i = clamp(Math.round(px / (XW / (NX - 1))), 0, NX - 1), z0 = Number.isFinite(T.o[i]) ? T.o[i] : T.z[i];
        const lam = V.src === 250 ? 0.6 : 0.63, dl = V.src === 250 ? 0.25 : 0.03, pts = [];
        for (let k = 0; k <= 480; k++) {
          const z = z0 - 3 + 6 * k / 480, opd = 2 * (z - z0), env = Math.exp(-Math.pow(Math.PI * opd / (2 * Math.sqrt(Math.LN2)) * (dl / (lam * lam)), 2));
          pts.push([z, 1 + env * Math.cos(2 * PI * opd / lam)]);
        }
        plot.set({ x: { label: 'scan z (µm)', min: z0 - 3, max: z0 + 3 }, series: [{ pts, label: 'one pixel' }], vlines: [{ x: z0 }] });
      }
      traces(); corr();
      kit.drag(st, {
        hover: true,
        hit: p => (p.y > st.H * 0.08 ? 'x' : null),
        move: (what, p) => { px = clamp((p.x - 20) / ((st.W - 40) / XW), 0.3, XW - 0.3); corr(); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, s = (W - 40) / XW, X = x => 20 + x * s, yb = Hh * 0.62, Y = zz => yb - zz * s;
        const dx = XW / (NX - 1);
        // the specimen
        c.beginPath(); c.moveTo(X(0), Hh);
        for (let i = 0; i < NX; i++) c.lineTo(X(i * dx), Y(T.z[i]));
        c.lineTo(X(XW), Hh); c.closePath(); c.fillStyle = C.dark ? '#3a4262' : '#bcc3da'; c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); for (let i = 0; i < NX; i++) { const xx = X(i * dx), yy = Y(T.z[i]); i ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke();
        // the traces
        const line = (arr, col, w, off) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); let pen = false; for (let i = 0; i < NX; i++) { if (!Number.isFinite(arr[i])) { pen = false; continue; } const xx = X(i * dx), yy = Y(arr[i]) + (off || 0); pen ? c.lineTo(xx, yy) : c.moveTo(xx, yy); pen = true; } c.stroke(); };
        if (V.view !== 'optical') line(T.s, C.warn, 2.4, -3);
        if (V.view !== 'stylus') line(T.o, C.ok, 2.4, -7);
        // the instruments at the chosen pixel
        const i = clamp(Math.round(px / dx), 0, NX - 1), xp = X(px);
        if (V.view !== 'optical') {
          const zc = T.s[i], rpx = V.r * s, cy = Y(zc) - rpx;
          c.strokeStyle = C.warn; c.lineWidth = 1.6; c.fillStyle = C.dark ? 'rgba(224,160,48,0.18)' : 'rgba(224,160,48,0.25)';
          c.beginPath(); c.arc(xp, cy, rpx, 0, 2 * PI); c.fill(); c.stroke();
          c.beginPath(); c.moveTo(xp - rpx * 0.7071, cy - rpx * 0.7071); c.lineTo(xp - rpx * 0.7071 - 40, cy - rpx * 0.7071 - 40); c.moveTo(xp + rpx * 0.7071, cy - rpx * 0.7071); c.lineTo(xp + rpx * 0.7071 + 40, cy - rpx * 0.7071 - 40); c.stroke();
          kit.label(c, 'stylus tip, radius ' + kit.fmt(V.r, 2) + ' µm', clamp(xp, 90, W - 90), 14, { align: 'center', color: C.warn, size: 11.5 });
        }
        if (V.view !== 'stylus') {
          const zc = Number.isFinite(T.o[i]) ? T.o[i] : T.z[i], half = Math.asin(V.NA), yt = Y(zc), L = yt - 10;
          c.fillStyle = C.dark ? 'rgba(52,200,140,0.16)' : 'rgba(30,150,100,0.14)';
          c.beginPath(); c.moveTo(xp, yt); c.lineTo(xp - Math.tan(half) * L, 10); c.lineTo(xp + Math.tan(half) * L, 10); c.closePath(); c.fill();
          c.strokeStyle = C.ok; c.lineWidth = 1; c.stroke();
          kit.label(c, 'objective, NA ' + V.NA.toFixed(2) + (Number.isFinite(T.o[i]) ? '' : ': no signal here'), clamp(xp, 90, W - 90), V.view === 'both' ? 30 : 14, { align: 'center', color: Number.isFinite(T.o[i]) ? C.ok : C.bad, size: 11.5 });
        }
        c.strokeStyle = C.text; c.lineWidth = 1; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(xp, Y(T.z[i]) + 2); c.lineTo(xp, Hh - 6); c.stroke(); c.setLineDash([]);
        S.dim(c, X(0), Hh - 10, X(10), Hh - 10, '10 µm', { off: -9 });
        kit.label(c, 'orange: tip locus · green: optical · drag along the surface', 20, Hh - 32, { color: C.text, size: 10.5 });
        // numbers
        let es = 0, eo = 0, miss = 0;
        for (let k = 0; k < NX; k++) { es = Math.max(es, Math.abs(T.s[k] - T.z[k])); if (Number.isFinite(T.o[k])) eo = Math.max(eo, Math.abs(T.o[k] - T.z[k])); else miss++; }
        const fwhm = 0.441 * Math.pow(V.src === 250 ? 0.6 : 0.63, 2) / (V.src === 250 ? 0.25 : 0.03);
        ro.set('r', (2 * V.r).toFixed(1) + ' µm  (the tip diameter)');
        ro.set('lat', (0.61 * LAM / V.NA).toFixed(2) + ' µm at 550 nm');
        ro.set('sl', (Math.atan(Math.tan((V.matt ? 1 : 0.5) * Math.asin(V.NA))) * R2D).toFixed(0) + '°  (' + (V.matt ? 'matt: asin NA' : 'smooth: ½ asin NA') + ')');
        ro.set('es', es.toFixed(2) + ' µm');
        ro.set('eo', eo.toFixed(2) + ' µm  (where it sees)');
        ro.set('lost', (100 * miss / NX).toFixed(0) + ' % of the trace');
        ro.set('lc', fwhm.toFixed(2) + ' µm of path (' + (fwhm / 2).toFixed(2) + ' µm of height)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ distance and displacement sensors */
  Hyper.sim('mt-displacement', {
    title: 'Three ways to measure how far, or how much',
    blurb: `**Triangulation**: a laser spot on the target is imaged by a lens, a baseline away, onto a detector; the spot moves by f·b/z, so near targets are measured finely and far ones coarsely (the graph is the distance resolution). **Interferometer**: a mirror on the moving part makes the detector brighten and dim once per half-wavelength of motion; count the fringes. **Time of flight**: a pulse goes to the target and back; the graph shows how timing resolution becomes distance resolution.

**Try this**
- *Triangulation*: double the distance and see the resolution get four times worse. Lengthen the baseline: it improves.
- *Interferometer*: move the mirror by 3 µm with 632.8 nm light (9.5 fringes). Switch to 1550 nm: fewer fringes for the same motion. A finer interpolation gives a finer count.
- *Time of flight*: at 1 ns timing the resolution is 15 cm. What timing resolves a millimetre?`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan, F_LENS = 25;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'method', type: 'select', label: 'Method', options: [['Triangulation', 'tri'], ['Interferometer: counting fringes', 'int'], ['Time of flight', 'tof']], value: params.method || 'tri' },
        { id: 'z', label: 'Distance to the target', min: 50, max: 500, step: 1, value: 150, unit: 'mm' },
        { id: 'b', label: 'Baseline between laser and lens', min: 10, max: 60, step: 1, value: 30, unit: 'mm' },
        { id: 'p', label: 'Smallest shift the detector resolves', min: 0.1, max: 5, value: 0.5, log: true, sig: 2, fmt: v => kit.fmt(v, 2) + ' µm' },
        { id: 'd', label: 'Displacement of the mirror', min: 0, max: 20, step: 0.01, value: 3, unit: 'µm' },
        { id: 'wl', type: 'select', label: 'Wavelength', options: [['Helium–neon, 632.8 nm', 632.8], ['Green, 532 nm', 532], ['Infrared, 1550 nm', 1550]], value: 632.8 },
        { id: 'ip', type: 'select', label: 'Each fringe is divided into', options: [['4 parts (quadrature)', 4], ['64 parts', 64], ['256 parts', 256]], value: 64 },
        { id: 'D', label: 'Distance to the target', min: 0.5, max: 100, value: 10, log: true, sig: 3, fmt: v => kit.fmt(v, 3) + ' m' },
        { id: 'dt', type: 'select', label: 'Timing resolution', options: [['1 ns', 1], ['100 ps', 0.1], ['10 ps', 0.01], ['1 ps', 0.001]], value: 1 }
      ], () => { layout(); plotUpdate(); sync(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [
        ['t1', 'Spot shift on the detector'], ['t2', 'Distance resolution here'], ['t3', 'As a fraction of the distance'],
        ['i1', 'Fringes passed'], ['i2', 'Whole fringes counted'], ['i3', 'Smallest step of the count'], ['i4', '1 K of air temperature, over 1 m'],
        ['f1', 'Round-trip time'], ['f2', 'Distance resolution'], ['f3', 'Timing needed for 1 mm'], ['f4', 'As a fraction of the distance']
      ]);
      const plot = kit.plot(box.side, { x: { label: 'z (mm)' }, y: { label: 'δz (µm)' }, hoverRead: false }, 170);
      function layout() {
        const m = V.method;
        ['z', 'b', 'p'].forEach(k => ctl.show(k, m === 'tri'));
        ['d', 'wl', 'ip'].forEach(k => ctl.show(k, m === 'int'));
        ['D', 'dt'].forEach(k => ctl.show(k, m === 'tof'));
        ['t1', 't2', 't3'].forEach(k => ro.show(k, m === 'tri'));
        ['i1', 'i2', 'i3', 'i4'].forEach(k => ro.show(k, m === 'int'));
        ['f1', 'f2', 'f3', 'f4'].forEach(k => ro.show(k, m === 'tof'));
      }
      layout();
      const triRes = z => Sc.triangulation({ z: z / 1000, p: V.p * 1e-6, f: F_LENS / 1000, b: V.b / 1000 }).dz * 1e6;      // µm
      function plotUpdate() {
        if (V.method === 'tri') {
          const pts = []; for (let z = 50; z <= 500; z += 10) pts.push([z, triRes(z)]);
          plot.set({ x: { label: 'z (mm)', min: 50, max: 500 }, y: { label: 'δz (µm)' }, series: [{ pts, label: 'resolution' }], marks: [{ x: V.z, y: triRes(V.z) }], vlines: [], hlines: [] });
        } else if (V.method === 'int') {
          const lam = V.wl / 1000, pts = [];
          for (let k = 0; k <= 300; k++) { const x = V.d - 1.5 + 3 * k / 300; pts.push([x, 0.5 * (1 + Math.cos(4 * PI * x / lam))]); }
          plot.set({ x: { label: 'd (µm)', min: V.d - 1.5, max: V.d + 1.5 }, y: { label: 'signal', min: 0, max: 1 }, series: [{ pts, label: 'detector' }], marks: [{ x: V.d, y: 0.5 * (1 + Math.cos(4 * PI * V.d / lam)) }], vlines: [], hlines: [] });
        } else {
          const pts = []; for (let i = 0; i <= 40; i++) { const dt = Math.pow(10, -3 + 4 * i / 40); pts.push([dt, Sc.tofResolution(dt * 1e-9) * 1e3]); }
          plot.set({ x: { label: 'Δt (ns)', min: 0.001, max: 10, log: true }, y: { label: 'Δd (mm)', min: 0.1, max: 2000, log: true }, series: [{ pts, label: 'resolution' }], marks: [{ x: V.dt, y: Sc.tofResolution(V.dt * 1e-9) * 1e3 }], vlines: [], hlines: [] });
        }
      }
      plotUpdate();
      let phase = 0;
      const loop = kit.loop(dt => { phase = (phase + dt / 4) % 1; draw(); }, box.stage);
      function sync() { if (V.method === 'tof') loop.start(); else loop.stop(); }
      function drawTri(c, C, W, Hh) {
        const sx = 0.7 * W / (500 + F_LENS), sy = 0.0067 * Hh, x0 = 0.2 * W, yl = 0.26 * Hh, X = z => x0 + z * sx;
        const yLens = yl + V.b * sy, shift = F_LENS * V.b / V.z, yDet = yLens + shift * sy;
        // target surface
        c.fillStyle = C.dark ? '#3a4262' : '#bcc3da'; c.fillRect(X(V.z), yl - 0.2 * Hh, 10, 0.2 * Hh + 190);
        kit.label(c, 'target', X(V.z) + 5, yl - 0.2 * Hh - 9, { align: 'center', color: C.muted, size: 11.5 });
        S.ray(c, [[X(0), yl], [X(V.z), yl]], { nm: 635, width: 2, arrows: true });
        S.ray(c, [[X(V.z), yl], [X(0), yLens], [X(-F_LENS), yDet]], { nm: 635, width: 1.3, alpha: 0.9, arrows: false });
        c.fillStyle = C.warn; c.beginPath(); c.arc(X(V.z), yl, 4, 0, 2 * PI); c.fill();
        S.thinLens(c, X(0), yLens, 18, F_LENS, { label: 'lens, f = 25 mm' });
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.fillRect(X(-F_LENS) - 4, yLens - 8, 8, 60 * sy + 16); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(X(-F_LENS) - 4, yLens - 8, 8, 60 * sy + 16);
        c.fillStyle = C.accent; c.beginPath(); c.arc(X(-F_LENS), yDet, 3.5, 0, 2 * PI); c.fill();
        kit.label(c, 'detector', X(-F_LENS) - 8, yLens + 60 * sy + 22, { align: 'center', color: C.muted, size: 11.5 });
        S.source(c, X(0) - 10, yl, { kind: 'laser', size: 8, color: C.warn });
        S.dim(c, X(0) - 52, yl, X(0) - 52, yLens, 'b = ' + V.b + ' mm', { off: -6 });
        S.dim(c, X(0), yl - 28, X(V.z), yl - 28, 'z = ' + V.z + ' mm', { off: -9 });
        kit.label(c, 'a nearer target moves the spot farther along the detector', 12, Hh - 12, { color: C.muted, size: 11 });
        ro.set('t1', shift.toFixed(2) + ' mm  (f·b/z)');
        ro.set('t2', triRes(V.z).toFixed(triRes(V.z) < 10 ? 2 : 1) + ' µm');
        ro.set('t3', (100 * triRes(V.z) / 1000 / V.z).toFixed(4) + ' %');
      }
      function drawInt(c, C, W, Hh) {
        const lam = V.wl / 1000, N = 2 * V.d / lam, I = 0.5 * (1 + Math.cos(2 * PI * N)), xB = 0.32 * W, yB = 0.5 * Hh, xM = 0.72 * W + 0.1 * W * V.d / 20, yT = 0.16 * Hh, yD = 0.85 * Hh;
        S.source(c, 0.1 * W, yB, { kind: 'laser', size: 9, dir: 0, color: C.warn });
        S.ray(c, [[0.1 * W + 4, yB], [xB, yB]], { nm: V.wl, width: 2, arrows: false });
        S.ray(c, [[xB, yB], [xM, yB]], { nm: V.wl, width: 2, arrows: false });
        S.ray(c, [[xB, yB], [xB, yT]], { nm: V.wl, width: 2, arrows: false });
        S.ray(c, [[xB, yB + 3], [xB, yD - 20]], { nm: V.wl, width: 2.6, arrows: false });
        S.splitter(c, xB, yB, 26, {});
        S.flatMirror(c, xM, yB - 38, xM, yB + 38);
        S.flatMirror(c, xB - 38, yT, xB + 38, yT);
        kit.label(c, 'fixed mirror', xB + 46, yT, { color: C.muted, size: 11.5 });
        kit.label(c, 'moving mirror', xM, yB - 50, { align: 'center', color: C.muted, size: 11.5 });
        c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(0.72 * W, yB + 44); c.lineTo(0.72 * W, yB - 44); c.stroke(); c.setLineDash([]);
        c.fillStyle = S.nm(V.wl, 0.1 + 0.9 * I); c.beginPath(); c.arc(xB, yD, 17, 0, 2 * PI); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
        kit.label(c, 'detector: ' + (100 * I).toFixed(0) + ' %', xB + 26, yD, { color: C.text, size: 12 });
        kit.label(c, 'drawn motion exaggerated', 0.72 * W, yB + 60, { align: 'center', color: C.faint, size: 11 });
        kit.label(c, 'N = ' + N.toFixed(2) + ' fringes', W - 14, 16, { align: 'right', color: C.accent, size: 13, weight: 650 });
        ro.set('i1', N.toFixed(2) + '  (2d/λ)');
        ro.set('i2', Math.floor(N) + '  → ' + (Math.floor(N) * lam / 2).toFixed(3) + ' µm');
        ro.set('i3', (V.wl / 2 / V.ip).toFixed(V.wl / 2 / V.ip < 10 ? 2 : 1) + ' nm  (λ/2 ÷ ' + V.ip + ')');
        ro.set('i4', '≈ 0.9 µm if not corrected');
      }
      function drawTof(c, C, W, Hh) {
        const cs = 2.998e8, Dm = V.D, tRound = 2 * Dm / cs * 1e9, xs = 0.1 * W, p = (Math.log(Dm) - Math.log(0.5)) / (Math.log(100) - Math.log(0.5)), xt = 0.25 * W + 0.62 * W * p, yy = 0.28 * Hh;
        S.source(c, xs, yy, { kind: 'laser', size: 9, color: C.warn });
        c.fillStyle = C.dark ? '#3a4262' : '#bcc3da'; c.fillRect(xt, yy - 34, 10, 68);
        kit.label(c, 'target', xt + 5, yy - 46, { align: 'center', color: C.muted, size: 11.5 });
        S.dim(c, xs + 6, yy + 48, xt, yy + 48, 'D = ' + kit.fmt(Dm, 3) + ' m', { off: 12 });
        const u = phase < 0.5 ? phase * 2 : 2 - phase * 2, xp = xs + 12 + (xt - xs - 12) * u;
        S.beam(c, xp - 14, xp + 6, yy, 8, { color: 'rgba(224,160,48,0.55)', edgeColor: C.warn });
        kit.label(c, phase < 0.5 ? 'out' : 'back', xp, yy - 20, { align: 'center', color: C.warn, size: 11 });
        // the timeline: a pulse leaves at 0 and comes back at t = 2D/c, known to ±Δt
        const tx0 = 0.08 * W, tx1 = 0.92 * W, ty = 0.78 * Hh, tmax = 2 * 100 / cs * 1e9, X = t => tx0 + (tx1 - tx0) * t / tmax;
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(tx0, ty); c.lineTo(tx1, ty); c.stroke();
        c.strokeStyle = C.warn; c.lineWidth = 3; c.beginPath(); c.moveTo(X(0), ty); c.lineTo(X(0), ty - 36); c.stroke();
        const bw = Math.max(2, (tx1 - tx0) * V.dt / tmax);
        c.fillStyle = C.dark ? 'rgba(123,140,255,0.35)' : 'rgba(80,100,230,0.3)'; c.fillRect(X(tRound) - bw / 2, ty - 46, bw, 46);
        c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(X(tRound), ty); c.lineTo(X(tRound), ty - 36); c.stroke();
        kit.label(c, 'sent, t = 0', X(0), ty + 14, { align: 'left', color: C.warn, size: 11.5 });
        kit.label(c, 'back after ' + tRound.toFixed(tRound < 100 ? 1 : 0) + ' ns', clamp(X(tRound), 80, W - 80), ty + 28, { align: 'center', color: C.accent, size: 11.5 });
        kit.label(c, 'shaded: timing uncertainty ' + (V.dt >= 1 ? V.dt + ' ns' : V.dt * 1000 + ' ps'), 12, 16, { color: C.muted, size: 11 });
        const rr = Sc.tofResolution(V.dt * 1e-9);
        ro.set('f1', tRound.toFixed(tRound < 100 ? 2 : 1) + ' ns  (2D/c)');
        ro.set('f2', rr >= 0.01 ? (rr * 100).toFixed(rr < 0.1 ? 2 : 1) + ' cm' : (rr * 1000).toFixed(2) + ' mm');
        ro.set('f3', (2e-3 / cs * 1e12).toFixed(1) + ' ps');
        ro.set('f4', (100 * rr / Dm).toFixed(rr / Dm < 0.001 ? 4 : 2) + ' %');
      }
      function draw() {
        const c = st.begin(), C = kit.colors();
        if (V.method === 'tri') drawTri(c, C, st.W, st.H); else if (V.method === 'int') drawInt(c, C, st.W, st.H); else drawTof(c, C, st.W, st.H);
      }
      st.onResize(() => loop.once());
      sync();
      loop.once();
    }
  });

  /* ================================================================ aligning bearings to a line of sight */
  Hyper.sim('mt-alignment', {
    title: 'Aligning five bearings to a line of sight',
    blurb: `A laser sets a line of sight through the first and last of five bearings, and each bearing in between is read against it. Drag the bearings S2 to S4 up and down: the reading is the offset of the bore from the beam. The vertical scale is 16 px per millimetre, the same for the offsets and the width of the beam, so you can see whether the width hides the offset.

**Try this**
- Press *New misalignment* and read the three offsets, then drag each bearing back to the line.
- Lengthen the line to 40 m and watch the beam widen. With a beam radius of 1 mm at the laser the spot is about 8 mm across at 20 m and 16 mm at 40 m: the centre can still be found, but only to a few per cent of that.
- Press *Set the best beam radius* for the length: the beam is as narrow as it can be at the far bearing (and √2 wider than at the laser).
- Set the beam radius to 0.2 mm: the beam spreads fast and is far wider at the end than with 1 mm.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, LAM = 635, K = 16;                    // nm, px per mm
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      let offs = [0, 0.35, -0.2, 0.5, 0];                                       // offsets of the bores from the line (mm)
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Length of the line', min: 2, max: 40, step: 0.5, value: params.L || 20, unit: 'm' },
        { id: 'w0', label: 'Beam radius at the laser', min: 0.2, max: 6, value: params.w0 || 1, log: true, sig: 2, fmt: v => kit.fmt(v, 2) + ' mm' },
        { id: 'acc', label: 'The detector finds the centre to', min: 0.5, max: 10, step: 0.5, value: 2, fmt: v => v.toFixed(1) + ' % of the spot' },
        { type: 'buttons', items: [{ id: 'rand', label: 'New misalignment', primary: true }, { id: 'best', label: 'Set the best beam radius' }, { id: 'fix', label: 'Put the bearings on the line' }] }
      ], id => {
        if (id === 'rand') { const rnd = () => Math.round((Math.random() * 1.2 - 0.6) * 100) / 100; offs = [0, rnd(), rnd(), rnd(), 0]; }
        if (id === 'best') ctl.set('w0', clamp(Math.sqrt(LAM * 1e-9 * V.L / PI) * 1e3, 0.2, 6));
        if (id === 'fix') offs = [0, 0, 0, 0, 0];
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['o2', 'Offset of S2'], ['o3', 'Offset of S3'], ['o4', 'Offset of S4'], ['dw', 'Beam diameter at S5'], ['un', 'Centre found to, at S5'], ['bw', 'Best beam radius for this length'], ['bd', 'Beam diameter at S5, with it']]);
      const geom = () => { const W = st.W, Hh = st.H; return { W, Hh, x0: 0.1 * W, x1: 0.9 * W, y0: 0.5 * Hh }; };
      const stationX = (g, i) => g.x0 + (g.x1 - g.x0) * i / 4;
      kit.drag(st, {
        hover: true,
        hit: p => { const g = geom(); for (let i = 1; i <= 3; i++) if (Math.abs(p.x - stationX(g, i)) < 16 && Math.abs(p.y - (g.y0 - offs[i] * K)) < 0.3 * g.Hh) return i; return null; },
        move: (i, p) => { const g = geom(); offs[i] = clamp(Math.round((g.y0 - p.y) / K * 100) / 100, -1.5, 1.5); loop.once(); }
      });
      const wAt = z => O.beam.w(z, V.w0 * 1e-3, LAM) * 1e3;                     // mm
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), g = geom(), W = g.W, Hh = g.Hh, y0 = g.y0;
        // the beam, widening from the laser at S1
        S.beam(c, g.x0, g.x1, y0, x => Math.min(0.45 * Hh, wAt(V.L * (x - g.x0) / (g.x1 - g.x0)) * K), { nm: LAM, alpha: 0.22 });
        S.ray(c, [[g.x0 - 30, y0], [g.x1 + 30, y0]], { nm: LAM, width: 1.3, arrows: false });
        S.source(c, g.x0 - 36, y0, { kind: 'laser', size: 8, color: C.warn });
        for (let i = 0; i < 5; i++) {
          const xs = stationX(g, i), yc = y0 - offs[i] * K, hh = 11, top = y0 - 0.3 * Hh, bot = y0 + 0.3 * Hh;
          c.fillStyle = C.dark ? '#555b73' : '#9aa1b8'; c.fillRect(xs - 7, top, 14, yc - hh - top); c.fillRect(xs - 7, yc + hh, 14, bot - yc - hh);
          c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(xs - 7, top, 14, yc - hh - top); c.strokeRect(xs - 7, yc + hh, 14, bot - yc - hh);
          // the target in the bore: a cross at the centre of the bore, and the spot of the beam
          c.strokeStyle = (i === 0 || i === 4) ? C.faint : C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(xs - 14, yc); c.lineTo(xs + 14, yc); c.moveTo(xs, yc - 7); c.lineTo(xs, yc + 7); c.stroke();
          kit.label(c, 'S' + (i + 1) + (i === 0 || i === 4 ? ' (reference)' : ''), xs, bot + 14, { align: 'center', color: C.muted, size: 11.5 });
          if (i > 0 && i < 4) kit.label(c, (offs[i] >= 0 ? '+' : '−') + Math.abs(offs[i]).toFixed(2) + ' mm', xs, top - 10, { align: 'center', color: C.accent, size: 11.5, weight: 600 });
        }
        S.dim(c, g.x0, Hh - 14, g.x1, Hh - 14, V.L.toFixed(1) + ' m', { off: -9 });
        kit.label(c, '1 mm = 16 px (offsets and beam) · drag S2 to S4', 12, 14, { color: C.faint, size: 10.5 });
        const w5 = wAt(V.L), wb = Math.sqrt(LAM * 1e-9 * V.L / PI) * 1e3, un = V.acc / 100 * 2 * w5;
        const rd = i => (offs[i] >= 0 ? '+' : '−') + Math.abs(offs[i]).toFixed(2) + ' mm  (move ' + (offs[i] > 0 ? 'down' : offs[i] < 0 ? 'up' : 'nothing') + ')';
        ro.set('o2', rd(1)); ro.set('o3', rd(2)); ro.set('o4', rd(3));
        ro.set('dw', (2 * w5).toFixed(1) + ' mm');
        ro.set('un', '± ' + un.toFixed(un < 1 ? 2 : 1) + ' mm' + (un > 0.1 ? '' : '  (fine)'));
        ro.set('bw', wb.toFixed(2) + ' mm' + (wb < 0.2 || wb > 6 ? '  (outside the slider)' : ''));
        ro.set('bd', (2 * Math.SQRT2 * wb).toFixed(1) + ' mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
