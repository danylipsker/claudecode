/* HYPER-OPTICS · sims/reference.js — reference simulations for the writers of Hyper Optics.
 *   ref-snell     a ray at a flat surface between two media: reflected and refracted rays drawn as bright as
 *                 they are (Fresnel), the critical angle, Brewster's angle, dispersion with white light
 *   ref-fnumber   a real achromat behind a stop: the f-number sets the cone of light, the Airy disc and the
 *                 illuminance; the spot diagram at the focus is drawn against the Airy disc
 *   ref-cmount    a C- or CS-mount lens on a C- or CS-mount camera, with or without the 5 mm ring: where the
 *                 image lands, and how large the blur is when it misses the sensor
 * The numbers come from kit.optics (optics.js …), the drawing from kit.osym (opticsym.js): no sim re-derives
 * Snell's law or traces its own lens.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;

  /* ================================================================ a ray at a surface */
  Hyper.sim('ref-snell', {
    title: 'A ray at a surface: reflection and refraction',
    blurb: `A ray meets the flat boundary between two transparent materials. The reflected and the refracted ray are drawn as bright as they really are, so you can see where the light goes as well as which way.

**Try this**
- Drag the incoming ray (or use the slider). From air into glass the refracted ray swings *towards* the normal, and about 4 % reflects — until the last few degrees, where the surface turns into a mirror.
- Swap the media: glass above, air below. Past the **critical angle** (41.2° for this glass) the refracted ray vanishes and all the light reflects — total internal reflection.
- Set the polarization to *p* and go to **Brewster's angle** (56.6° from air into this glass): the reflected ray disappears completely.
- Tick *white light* with a flint glass: blue is bent more than red. That spread is dispersion.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const MEDIA = [['Air', 'air'], ['Water', 'water'], ['Acrylic (PMMA)', 'PMMA'], ['Crown glass (N-BK7)', 'N-BK7'], ['Dense flint glass (N-SF11)', 'N-SF11'], ['Sapphire', 'sapphire'], ['Diamond', 'diamond']];
      const nameOf = id => MEDIA.find(m => m[1] === id)[0];
      const ctl = kit.controls(box.side, [
        { id: 'angle', label: 'Angle of incidence θ₁', min: 0, max: 89, step: 0.5, value: params.angle != null ? params.angle : 40, unit: '°' },
        { id: 'm1', type: 'select', label: 'The ray travels in', options: MEDIA, value: params.m1 || 'air' },
        { id: 'm2', type: 'select', label: 'and meets', options: MEDIA, value: params.m2 || 'N-BK7' },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: params.nm || 550, unit: 'nm' },
        { id: 'white', type: 'check', label: 'White light: red, green and blue together', value: !!params.white },
        { id: 'pol', type: 'select', label: 'Polarization', options: [['Unpolarized', 'u'], ['s — across the plane of the drawing', 's'], ['p — in the plane of the drawing', 'p']], value: params.pol || 'u' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Indices n₁ → n₂'], ['t2', 'Angle of refraction θ₂'], ['R', 'Reflected'], ['T', 'Transmitted'], ['crit', 'Critical angle'], ['brew', 'Brewster\'s angle']]);
      kit.drag(st, {
        hover: true,
        hit: p => p.y < st.H / 2 - 6 ? 'ray' : null,
        move: (what, p) => {
          const a = Math.atan2(st.W / 2 - p.x, st.H / 2 - p.y) * R2D;
          ctl.set('angle', Math.max(0, Math.min(89, Math.round(a * 2) / 2)));
          loop.once();
        }
      });
      const pct = x => (100 * x).toFixed(x < 0.1 ? 2 : 1) + ' %';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cx = W / 2, cy = Hh / 2;
        const t1 = V.angle * D2R, L = Math.min(W * 0.48, Hh * 0.47);
        const n1 = O.index(V.m1, V.nm), n2 = O.index(V.m2, V.nm);
        // the two media, tinted by how dense they are optically
        c.fillStyle = S.glass(Math.min(0.5, 0.36 * (n1 - 1))); c.fillRect(0, 0, W, cy);
        c.fillStyle = S.glass(Math.min(0.5, 0.36 * (n2 - 1))); c.fillRect(0, cy, W, Hh - cy);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, cy); c.lineTo(W, cy); c.stroke();
        S.normal(c, cx, cy, Math.PI / 2, L * 0.96);
        kit.label(c, nameOf(V.m1) + '   n₁ = ' + n1.toFixed(4), 12, 18, { color: C.muted });
        kit.label(c, nameOf(V.m2) + '   n₂ = ' + n2.toFixed(4), 12, Hh - 16, { color: C.muted });
        kit.label(c, 'normal', cx + 6, cy - L * 0.9, { color: C.faint, size: 11.5 });
        let shown = null;
        for (const nm of (V.white ? [650, 550, 450] : [V.nm])) {
          const f = O.fresnel(O.index(V.m1, nm), O.index(V.m2, nm), t1);
          const R = V.pol === 's' ? f.Rs : V.pol === 'p' ? f.Rp : f.R, T = 1 - R;
          if (!shown || nm === 550) shown = { f, R, T };
          S.ray(c, [[cx - L * Math.sin(t1), cy - L * Math.cos(t1)], [cx, cy]], { nm, width: 2.4 });
          if (R > 0.002) S.ray(c, [[cx, cy], [cx + L * Math.sin(t1), cy - L * Math.cos(t1)]], { nm, width: 0.8 + 1.8 * R, alpha: 0.22 + 0.78 * R });
          if (!f.tir && T > 0.002) S.ray(c, [[cx, cy], [cx + L * Math.sin(f.t2), cy + L * Math.cos(f.t2)]], { nm, width: 0.8 + 1.8 * T, alpha: 0.22 + 0.78 * T });
        }
        const f = shown.f;
        // angle marks: on a canvas "up" is −π/2 and "down" is +π/2
        if (V.angle > 2) {
          S.angle(c, cx, cy, 46, -Math.PI / 2, -Math.PI / 2 - t1, 'θ₁');
          S.angle(c, cx, cy, 34, -Math.PI / 2, -Math.PI / 2 + t1, '');
          if (!f.tir) S.angle(c, cx, cy, 46, Math.PI / 2, Math.PI / 2 - f.t2, 'θ₂');
        }
        if (f.tir) kit.label(c, 'total internal reflection', cx + 14, cy + 22, { color: C.warn, weight: 650 });
        const crit = O.criticalAngle(n1, n2);
        ro.set('n', n1.toFixed(4) + ' → ' + n2.toFixed(4));
        ro.set('t2', f.tir ? 'none' : (f.t2 * R2D).toFixed(2) + '°');
        ro.set('R', pct(shown.R));
        ro.set('T', pct(shown.T));
        ro.set('crit', Number.isNaN(crit) ? 'none (the ray enters a denser medium)' : (crit * R2D).toFixed(2) + '°');
        ro.set('brew', (O.brewster(n1, n2) * R2D).toFixed(2) + '°');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the f-number */
  Hyper.sim('ref-fnumber', {
    title: 'The f-number: one hole, three consequences',
    blurb: `A real cemented achromat of 100 mm focal length with a stop in front of it, traced ray by ray. The inset is the focus magnified: the dots are where the rays really land (the spot diagram) and the dashed circle is the Airy disc that diffraction allows.

**Try this**
- Open the stop to **f/4**: a wide cone, a tiny Airy disc — but the rays no longer all fit inside it. The lens, not diffraction, limits the image.
- Close to **f/16**: the rays fall well inside the Airy disc. Now the lens is *diffraction-limited*, and closing further only makes the disc larger.
- Each full stop (4, 5.6, 8, 11, 16 …) multiplies N by √2 and **halves the light**. Watch the illuminance read-out.
- Switch between blue and red light: the Airy disc grows with the wavelength.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const base = O.lens('achromat'), f0 = Sy.paraxial(base).efl;
      const STOPS = [4, 5.6, 8, 11, 16, 22, 32];
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'f-number', min: 4, max: 32, value: params.N || 8, log: true, sig: 3, fmt: v => 'f/' + kit.fmt(v, 3) },
        { id: 'nm', type: 'select', label: 'Light', options: [['Blue, 450 nm', 450], ['Green, 550 nm', 550], ['Red, 650 nm', 650]], value: 550 },
        { id: 'rays', label: 'Rays drawn', min: 3, max: 15, step: 2, value: 7 },
        { type: 'buttons', items: STOPS.map(n => ({ id: 's' + n, label: 'f/' + n })) }
      ], id => { if (/^s[\d.]+$/.test(id)) ctl.set('N', +id.slice(1)); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['D', 'Aperture diameter'], ['na', 'Cone half-angle · NA'], ['airy', 'Airy disc diameter'], ['spot', 'Geometric spot (RMS diameter)'], ['who', 'What limits the image'], ['E', 'Light on the sensor']]);
      // the achromat with a separate stop 4 mm in front of it
      const build = N => ({ surfaces: [{ R: 0, t: 4, n: 1, sd: f0 / (2 * N), stop: true }].concat(base.surfaces.map(s => Object.assign({}, s, { stop: false }))) });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const sys = build(V.N), par = Sy.paraxial(sys, V.nm);
        const inset = Math.min(62, Hh * 0.2), m = S.map(st, -24, par.zImage + 3, 16, { right: 2 * inset + 46, left: 16 });
        S.axis(c, m.X(-24), m.y0, m.X(par.zImage + 3));
        S.system(c, sys, m);
        S.rays(c, Sy.fan2d(sys, { nm: V.nm, n: V.rays, zStart: -22 }), m, { nm: V.nm });
        S.screen(c, m.X(par.zImage), m.y0, m.s * 13, { label: 'image plane' });
        // the cone of light at the focus
        const th = Math.atan(1 / (2 * V.N)), fx = m.X(par.zImage);
        S.angle(c, fx, m.y0, Math.min(90, m.s * 40), Math.PI, Math.PI + th, 'θ′');
        S.dim(c, m.X(4), m.y0 + m.s * 14.5, fx, m.y0 + m.s * 14.5, 'f = ' + f0.toFixed(1) + ' mm', { off: 12 });
        S.dim(c, m.X(-8), m.Y(f0 / (2 * V.N)), m.X(-8), m.Y(-f0 / (2 * V.N)), 'D', { off: -12 });
        // the focus, magnified: spot diagram against the Airy disc
        const bf = Sy.bestFocus(sys, { nm: V.nm, rings: 4 });
        const spot = Sy.spot(sys, { nm: V.nm, rings: 6, z: bf.z });
        const airy = O.diff.airyRadius(V.nm, V.N) * 1e3;                     // mm
        const ix = W - inset - 16, iy = Hh / 2, half = 0.030;                // the box is 60 µm across
        c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(fx, m.y0); c.lineTo(ix - inset, iy - inset); c.moveTo(fx, m.y0); c.lineTo(ix - inset, iy + inset); c.stroke(); c.restore();
        c.fillStyle = C.surface; c.fillRect(ix - inset, iy - inset, 2 * inset, 2 * inset);
        S.spot(c, spot, ix, iy, inset, inset / half, { airy, nm: V.nm });
        kit.label(c, 'the focus, × ' + Math.round(inset / half / m.s), ix, iy - inset - 10, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'box 60 µm · dashed: Airy disc', ix, iy + inset + 12, { align: 'center', color: C.faint, size: 11 });
        const stops = 2 * Math.log2(V.N / 4);
        ro.set('D', (f0 / V.N).toFixed(1) + ' mm  (f/N)');
        ro.set('na', (th * R2D).toFixed(2) + '° · NA ' + Math.sin(th).toFixed(3));
        ro.set('airy', (2 * airy * 1e3).toFixed(1) + ' µm  (2.44 λ N)');
        ro.set('spot', (2 * spot.rms * 1e3).toFixed(1) + ' µm');
        ro.set('who', spot.geo < airy ? 'diffraction (the lens is perfect enough)' : 'the lens\'s aberrations');
        ro.set('E', stops < 0.05 ? 'the most this lens gives (f/4)' : '1/' + Math.pow(V.N / 4, 2).toFixed(1) + ' of f/4  (' + stops.toFixed(1) + ' stops less)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ C-mount and CS-mount */
  Hyper.sim('ref-cmount', {
    title: 'C-mount and CS-mount: five millimetres that decide the focus',
    blurb: `The two mounts share one thread, so any C or CS lens screws into any C or CS camera. What differs is the **flange focal distance**: a C-mount lens makes its image 17.526 mm behind its flange, a CS-mount lens 12.526 mm behind. The camera's sensor sits at one of those two distances.

**Try this**
- *C lens on a CS camera*: the image forms 5 mm behind the sensor — hopelessly blurred. Fit the **5 mm ring** and it lands exactly on the sensor. This is the one combination that needs, and has, an adapter.
- *CS lens on a C camera*: the image forms 5 mm in front of the sensor and no ring can help — a ring only moves the lens farther away. The lens can focus only on things a few centimetres in front of it.
- Put a ring where none is needed (C on C): you have made an **extension tube** — a close-up lens that can no longer reach infinity.
- Stop down to f/11: the blur circle shrinks, but 5 mm is far too much for depth of focus to rescue.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const FFD = { C: O.cam.mount('C').ffd, CS: O.cam.mount('CS').ffd };
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'A lens made for', options: [['C-mount (image at 17.526 mm)', 'C'], ['CS-mount (image at 12.526 mm)', 'CS']], value: params.lens || 'C' },
        { id: 'cam', type: 'select', label: 'on a camera with', options: [['C-mount (sensor at 17.526 mm)', 'C'], ['CS-mount (sensor at 12.526 mm)', 'CS']], value: params.cam || 'CS' },
        { id: 'ring', type: 'check', label: 'Fit the 5 mm adapter ring', value: !!params.ring },
        { id: 'f', label: 'Focal length of the lens', min: 4, max: 50, step: 1, value: params.f || 12, unit: 'mm' },
        { id: 'N', type: 'select', label: 'Aperture', options: [['f/1.4', 1.4], ['f/2.8', 2.8], ['f/5.6', 5.6], ['f/11', 11]], value: 2.8 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lens', 'Lens: flange to image'], ['cam', 'Camera: flange to sensor'], ['err', 'The image lands'], ['blur', 'Blur circle on the sensor'], ['near', 'What it can focus on']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cy = Hh * 0.5;
        const Lf = FFD[V.lens], K = FFD[V.cam], ring = V.ring ? 5 : 0;
        const e = Lf - ring - K;                              // where the image lands, measured from the sensor (+ behind it)
        const s = Math.min(W / 78, Hh / 52);                  // px per mm
        const X0 = W * 0.56, Xs = X0 + K * s, Xlf = X0 - ring * s, Ximg = Xlf + Lf * s;
        // the camera body with its sensor
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.beginPath(); c.rect(X0, cy - 16 * s, (K + 9) * s, 32 * s); c.fill(); c.stroke();
        c.fillStyle = C.bg2; c.fillRect(X0 - 1, cy - 12.7 * s, (K - 1.5) * s, 25.4 * s);          // the throat of the mount, 25.4 mm across
        S.sensor(c, Xs, cy, 5.5 * s, { pixels: 14 });
        kit.label(c, V.cam + '-mount camera', X0 + (K + 9) * s / 2, cy - 16 * s - 11, { align: 'center', color: C.muted });
        // the adapter ring
        if (ring) { c.fillStyle = C.accent; c.fillRect(Xlf, cy - 15 * s, ring * s, 4 * s); c.fillRect(Xlf, cy + 11 * s, ring * s, 4 * s); kit.label(c, '5 mm ring', Xlf + ring * s / 2, cy + 18.5 * s, { align: 'center', color: C.accent, size: 11.5 }); }
        // the lens: barrel, the thread that enters the camera, two elements drawn schematically
        const bl = 27 * s;
        c.fillStyle = C.dark ? '#39405f' : '#b3bbd1'; c.strokeStyle = C.text;
        c.beginPath(); c.rect(Xlf - bl, cy - 14 * s, bl, 28 * s); c.fill(); c.stroke();
        c.beginPath(); c.rect(Xlf, cy - 12.5 * s, 3.8 * s, 3 * s); c.rect(Xlf, cy + 9.5 * s, 3.8 * s, 3 * s); c.fill(); c.stroke();
        c.fillStyle = C.bg2; c.fillRect(Xlf - bl + 1, cy - 10 * s, bl - 1, 20 * s);
        S.lens(c, Xlf - 22 * s, cy, 9.5 * s, { f: 1, bulge: 2.6 });
        S.lens(c, Xlf - 8 * s, cy, 7.5 * s, { f: 1, bulge: 2.4 });
        kit.label(c, V.lens + '-mount lens, f = ' + V.f + ' mm', Xlf - bl / 2, cy - 14 * s - 11, { align: 'center', color: C.muted });
        // light from a distant point: parallel in, a cone of f/N out towards the image point
        const xr = Xlf - 6 * s, hr = (Ximg - xr) / (2 * V.N), hin = Math.min(8.5 * s, Math.max(hr, 2.2 * s));
        for (let i = -2; i <= 2; i++) {
          const u = i / 2;
          // the ray's height on the sensor plane: straight on from the rear element through the image point
          const ys = cy + u * hr * (Ximg - Xs) / (Ximg - xr);
          S.ray(c, [[Xlf - bl - 26, cy + u * hin], [Xlf - 22 * s, cy + u * hin], [xr, cy + u * hr], [Xs, ys]], { nm: 580, width: 1.3, arrows: i !== 0, minArrow: 30 });
        }
        // where the image is
        if (Math.abs(e) > 1e-6) { c.strokeStyle = C.warn; c.lineWidth = 1.2; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(Ximg, cy - 9 * s); c.lineTo(Ximg, cy + 9 * s); c.stroke(); c.setLineDash([]); kit.label(c, 'image', Ximg, cy - 10.5 * s, { align: 'center', color: C.warn, size: 11.5 }); }
        S.dim(c, Xlf, cy - 21 * s, Ximg, cy - 21 * s, 'lens: ' + Lf.toFixed(3) + ' mm', { off: -10 });
        S.dim(c, X0, cy + 21.5 * s, Xs, cy + 21.5 * s, 'camera: ' + K.toFixed(3) + ' mm', { off: 12 });
        const blur = Math.abs(e) / V.N;
        ro.set('lens', Lf.toFixed(3) + ' mm');
        ro.set('cam', K.toFixed(3) + ' mm' + (ring ? '  (+ 5 mm ring)' : ''));
        ro.set('err', Math.abs(e) < 1e-6 ? 'exactly on the sensor' : Math.abs(e).toFixed(1) + ' mm ' + (e > 0 ? 'behind the sensor' : 'in front of the sensor'));
        ro.set('blur', Math.abs(e) < 1e-6 ? 'none: sharp' : blur.toFixed(2) + ' mm  (about ' + Math.round(blur / 0.00345) + ' pixels of 3.45 µm)');
        ro.set('near', Math.abs(e) < 1e-6 ? 'everything from close-up to infinity' : e > 0 ? 'nothing — move the lens ' + e.toFixed(0) + ' mm out: fit the ring' : 'only objects about ' + (V.f + V.f * V.f / -e).toFixed(0) + ' mm away (an extension tube)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
