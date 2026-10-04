/* HYPER-OPTICS · sims/understanding-optical-systems.js — simulations of the topic "How to read an optical system" (ids us-…)
 *   us-five-questions   one small camera system read with the five questions: light, field, stop, detector, the worst blur
 *   us-conjugates       a two-lens relay: field planes and pupil planes, marginal and chief rays, the field lens
 *   us-spec-window      the requirements (field, distance, detail, depth, light) squeeze the f-number into a window
 *   us-layout           a first-order layout: object, lens and sensor on a track; the two sharp positions; a second lens
 *   us-resolution-budget the blurs of a camera system in micrometres, combined in quadrature, and their MTFs
 *   us-light-budget     scene light to electrons and noise, stage by stage, in factors and stops
 *   us-choose           catalogue lenses traced against the Airy disc and a target blur: when a singlet will do
 *   us-tolerances       focus error, sensor tilt, working-distance error and lens decentre against the depth of focus
 *   us-stray            a baffled tube with a bright source off the axis: how the vanes cut the stray light that reaches the detector
 *   us-commissioning    four acceptance tests: bar target, distortion grid, flat field, focus over temperature
 *   us-abbreviations    the abbreviations of optics as chips by family, with a quiz
 * Numbers come from kit.optics (O.cam, O.mtf, O.sys, O.abcd, O.film, O.photo …); the drawing from kit.osym and the canvas.
 * Static pictures redraw on a change (loop.once); only a simulation whose picture moves by itself runs the loop.
 * The stray-light tube and the flat-field and thermal tests are schematic models, and say so.
 */
(function () {
  'use strict';
  const PI = Math.PI, D2R = PI / 180, R2D = 180 / PI;
  const fin = Number.isFinite;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fUm = um => !fin(um) ? '—' : um >= 1000 ? (um / 1000).toFixed(2) + ' mm' : um >= 100 ? um.toFixed(0) + ' µm' : um >= 10 ? um.toFixed(1) + ' µm' : um >= 1 ? um.toFixed(2) + ' µm' : (um * 1000).toFixed(0) + ' nm';
  const fMm = mm => !fin(mm) ? '—' : Math.abs(mm) >= 1000 ? (mm / 1000).toFixed(2) + ' m' : Math.abs(mm) >= 100 ? mm.toFixed(0) + ' mm' : Math.abs(mm) >= 10 ? mm.toFixed(1) + ' mm' : mm.toFixed(2) + ' mm';
  const fNum = (v, d) => (fin(v) ? v.toFixed(d == null ? 2 : d) : '—');
  const fN = n => 'f/' + (n >= 10 ? n.toFixed(0) : n.toFixed(1).replace(/\.0$/, ''));
  const fBig = v => !fin(v) ? '—' : v >= 1e6 ? (v / 1e6).toFixed(1) + ' million' : v >= 1e4 ? (v / 1e3).toFixed(0) + ' thousand' : v >= 100 ? v.toFixed(0) : v.toFixed(1);
  const fPct = v => (v * 100 >= 10 ? (v * 100).toFixed(0) : (v * 100).toFixed(1)) + ' %';
  const STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32];
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const lines = (kit, c, arr, x, y, dy, o) => arr.forEach((t, i) => kit.label(c, t, x, y + i * dy, o));

  /* ---------------------------------------------------------------- lenses traced for several simulations */
  // A lens of the library (or a singlet) scaled to focal length f, its stop opened to the f-number N.
  function makeLens(O, id, f, N) {
    const S = O.sys, singles = { 'biconvex': 0, 'plano-convex': 1, 'plano-reversed': -1 };
    let sys;
    if (id in singles || id === 'best-form') {
      const q = id === 'best-form' ? O.bestFormShape(1.5168) : singles[id];
      sys = O.design.singlet({ f, q, D: f / N });
      sys.surfaces[1].sd *= 1.25;                         // a little oversize behind, so that slanted bundles are not clipped
    } else {
      sys = S.withFocal(O.lens(id), f);
      const par = S.paraxial(sys), i = S.stopIndex(sys);
      sys.surfaces[i].sd *= par.fno / N;
    }
    return sys;
  }
  const spotCache = new Map();
  /* the traced blur of a lens at its best focus on the axis: -> { on, off, fno, z } with on/off = { pts, rms (mm), lost, frac }.
     white: three wavelengths (F, d, C) at the focus of the d line. */
  function spotFor(O, id, f, N, fieldDeg, white) {
    const key = [id, f, N.toFixed(2), fieldDeg.toFixed(1), white ? 'w' : 'm'].join('|');
    let r = spotCache.get(key);
    if (r) return r;
    const S = O.sys, sys = makeLens(O, id, f, N), nms = white ? [486.13, 587.56, 656.27] : [587.56];
    const bf = S.bestFocus(sys, { nm: 587.56, rings: 4 });
    const run = field => {
      const pts = []; let lost = 0, n = 0;
      for (const nm of nms) { const sp = S.spot(sys, { nm, rings: 6, z: bf.z, field }); for (const p of sp.pts) pts.push(p); lost += sp.lost; n += sp.pts.length + sp.lost; }
      let cx = 0, cy = 0; for (const p of pts) { cx += p[0]; cy += p[1]; } cx /= pts.length || 1; cy /= pts.length || 1;
      let s2 = 0; for (const p of pts) s2 += (p[0] - cx) * (p[0] - cx) + (p[1] - cy) * (p[1] - cy);
      return { pts, cx, cy, rms: Math.sqrt(s2 / (pts.length || 1)), lost, frac: lost / (n || 1) };
    };
    r = { on: run(0), off: fieldDeg > 0 ? run(fieldDeg * D2R) : null, fno: S.paraxial(sys).fno, z: bf.z };
    spotCache.set(key, r);
    return r;
  }
  // the mean wavelength of a source's spectrum, and the spectrum itself
  const srcCache = {};
  function srcInfo(O, id) {
    if (srcCache[id]) return srcCache[id];
    const fn = O.photo.spectrum(id); let a = 0, b = 0, mx = 0;
    for (let nm = 380; nm <= 780; nm += 5) { const v = Math.max(0, fn(nm)); a += v * nm; b += v; mx = Math.max(mx, v); }
    return (srcCache[id] = { fn, eff: b > 0 ? a / b : 550, max: mx || 1 });
  }

  /* ================================================================ the five questions */
  Hyper.sim('us-five-questions', {
    title: 'The five questions, asked of one camera',
    blurb: `A small camera looks at a part on a bench, lit by a ring of LEDs. Press **Next question** to walk down the chain: the light, the field, the stop, the detector, and finally *which blur is worst*. The picture on top is drawn to scale along the axis; the lens is shown as a barrel, so its opening (the stop) is not to scale across.

**Try this**
- Question 1: change the light from white to red to blue. The mean wavelength moves, and with it the diffraction blur in question 5.
- Question 2: raise the **distance** from 150 mm to 300 mm. The field grows, the magnification falls and the pixel footprint on the part grows with it.
- Question 3: stop the lens down from f/4 to f/11. The cone narrows, the depth of field grows (the slab round the part) and the Airy disc grows.
- Question 5: with the 3.45 µm pixels, the largest blur at f/4 is the two pixels. Change to f/16 and diffraction takes over; change to 1.4 µm pixels and the lens itself becomes the weak link.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cm = O.cam;
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 400, maxH: 520 });
      const SENS = Cm.sensor('1/1.8"');
      const QTITLE = ['Question 1 — where does the light come from?', 'Question 2 — what is seen, and how big?', 'Question 3 — what limits the cone of light?', 'Question 4 — where does it land, how finely?', 'Question 5 — what blurs or dims most?'];
      let step = params.step || 0;
      const ctl = kit.controls(box.side, [
        { id: 'f', type: 'select', label: 'Lens focal length', options: [8, 12, 16, 25, 35, 50].map(v => [v + ' mm', v]), value: 25 },
        { id: 's', label: 'Distance from lens to part', min: 80, max: 600, step: 5, value: 150, unit: 'mm' },
        { id: 'N', type: 'select', label: 'Aperture', options: [2.8, 4, 5.6, 8, 11, 16].map(v => ['f/' + v, v]), value: 4 },
        { id: 'pitch', label: 'Pixel pitch', min: 1.4, max: 9, step: 0.05, value: 3.45, unit: 'µm' },
        { id: 'src', type: 'select', label: 'Light', options: [['White LED', 'led-neutral'], ['Red LED', 'led-red'], ['Blue LED', 'led-blue'], ['Halogen lamp', 'halogen']], value: 'led-neutral' },
        { type: 'buttons', items: [{ id: 'prev', label: '◀ Back' }, { id: 'next', label: 'Next question ▶', primary: true }] }
      ], id => { if (id === 'prev') step = (step + 4) % 5; else if (id === 'next') step = (step + 1) % 5; loop.once(); });
      const ro = kit.readout(box.side, [['light', 'Mean wavelength · photon'], ['field', 'Field on the part · magnification'], ['stop', 'Entrance pupil · working f-number'], ['det', 'Pixel on the part · depth of field'], ['blur', 'Airy disc · two pixels · lens'], ['worst', 'The largest blur']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, V = ctl.values;
        const f = V.f, s = Math.max(V.s, 1.25 * f), N = V.N, p = V.pitch;
        const m = Cm.magnification(f, s), si = s * f / (s - f);
        const Wf = SENS.w / m, Hf = SENS.h / m, D = f / N, Nw = Cm.workingFNumber(N, m);
        const sp = srcInfo(O, V.src), lam = sp.eff;
        const airy = 2.44 * lam * 1e-3 * Nw, pix2 = 2 * p, dof = Cm.dofMacro(N, 2 * p * 1e-3, m);
        const lens = spotFor(O, 'double-gauss', f, N, 0, false), aber = 2 * lens.on.rms * 1e3;
        const blurs = [['diffraction', airy], ['the two pixels', pix2], ['the lens', aber]];
        const big = blurs.reduce((a, b) => (b[1] > a[1] ? b : a));
        const tot = Math.hypot(airy, pix2, aber), half = Math.hypot(big === blurs[0] ? airy / 2 : airy, big === blurs[1] ? pix2 / 2 : pix2, big === blurs[2] ? aber / 2 : aber);
        // ---------------- the picture on top, to scale along the axis
        const Ht = Math.round(Hh * 0.5), zMax = s + si, y0 = Ht / 2 + 8;
        const sc = Math.min((W - 70) / zMax, (Ht / 2 - 22) / Math.max(Wf / 2, 4));
        const X = z => 30 + z * sc, Y = y => y0 - y * sc;
        const on = k => { c.globalAlpha = step === k || step === 4 ? 1 : 0.3; };
        const col = S.nm(lam, 1);
        kit.label(c, QTITLE[step], 12, 14, { weight: 650, size: 12.5 });
        S.axis(c, X(-0.04 * zMax), y0, X(zMax + 0.03 * zMax));
        // the bench light: a ring of LEDs round the lens, lighting the part
        on(0);
        const barH = Math.max(11, D / 2 * sc + 5), ledY = barH + 13;
        c.save(); c.fillStyle = S.nm(lam, 0.14);
        c.beginPath(); c.moveTo(X(s), Y(0) - ledY); c.lineTo(X(0), Y(Wf / 2)); c.lineTo(X(0), Y(-Wf / 2)); c.lineTo(X(s), Y(0) + ledY); c.closePath(); c.fill(); c.restore();
        for (const sg of [-1, 1]) S.source(c, X(s) - 2, Y(0) + sg * ledY, { kind: 'led', size: 9, color: col });
        c.globalAlpha = 1;
        // the part (the object)
        on(1);
        S.object(c, X(0), y0, Wf / 2 * sc, { color: C.accent });
        S.object(c, X(0), y0, -Wf / 2 * sc, { color: C.accent });
        if (step === 1 || step === 4) S.dim(c, X(0) - 10, Y(Wf / 2), X(0) - 10, Y(-Wf / 2), 'field ' + fMm(Wf), { off: -8 });
        if (step === 2) {                                   // the depth of field: the slab of the scene that looks sharp
          c.globalAlpha = 1; c.fillStyle = S.nm(lam, 0.18); c.fillRect(X(-dof / 2), Y(Wf / 2), Math.max(2, dof * sc), Wf * sc);
          kit.label(c, 'depth of field ' + fMm(dof), X(0) + 6, Y(Wf / 2) - 8, { size: 11, color: C.muted });
        }
        c.globalAlpha = 1;
        // the lens: a barrel with the glass and the stop; the stop opening is true to scale
        on(2);
        const lx = X(s), g = Math.max(1.5, D / 2 * sc);
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.beginPath(); c.rect(lx - 12, y0 - barH, 24, 2 * barH); c.fill(); c.stroke();
        c.fillStyle = C.bg2; c.fillRect(lx - 11, y0 - barH + 4, 22, 2 * barH - 8);
        S.thinLens(c, lx + 2, y0, Math.min(g + 3, barH - 5), f);
        S.stop(c, lx - 6, y0, barH - 3, g);
        c.globalAlpha = 1;
        // the sensor
        on(3);
        const sx = X(s + si);
        S.sensor(c, sx, y0, Math.max(5, SENS.w / 2 * sc), { pixels: 10 });
        c.globalAlpha = 1;
        // the rays: two marginal rays from the axis point, the chief ray from the edge of the part
        c.globalAlpha = step === 2 || step === 4 ? 1 : 0.55;
        for (const sg of [-1, 1]) S.ray(c, [[X(0), y0], [lx, Y(sg * D / 2)], [sx, y0]], { color: col, width: 1.3, arrows: false });
        S.ray(c, [[X(0), Y(Wf / 2)], [lx, y0], [sx, Y(-SENS.w / 2)]], { color: col, width: 1.3, arrows: false, alpha: 0.8 });
        c.globalAlpha = 1;
        kit.label(c, 'light', lx - 14, y0 - barH - ledY + barH + 4 - 22, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'part', X(0), Y(-Wf / 2) + 13, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'lens', lx, y0 + barH + 12, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'sensor', W - 8, y0 - SENS.w / 2 * sc - 14, { size: 10.5, color: C.muted, align: 'right' });
        S.dim(c, X(0), y0 + barH + 26, lx, y0 + barH + 26, fMm(s), { off: 10, size: 10.5 });
        S.dim(c, lx + 14, y0 + barH + 26, sx, y0 + barH + 26, fMm(si), { off: 10, size: 10.5 });
        // ---------------- the panel below: what this question finds
        const yb = Ht + 28, x0 = 14, w = W - 28;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(8, yb - 14); c.lineTo(W - 8, yb - 14); c.stroke();
        if (step === 0) {
          const bh = Math.min(34, Hh * 0.1);
          S.spectrum(c, x0, yb, w, bh, 380, 780, { ticks: true });
          c.save(); c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath();
          for (let nm = 380; nm <= 780; nm += 4) { const v = clamp(sp.fn(nm) / sp.max, 0, 1), x = x0 + w * (nm - 380) / 400, y = yb + bh - v * (bh - 3); if (nm === 380) c.moveTo(x, y); else c.lineTo(x, y); }
          c.stroke(); c.restore();
          lines(kit, c, ['The curve shows the source power at each wavelength.', 'Mean wavelength ' + lam.toFixed(0) + ' nm; a photon carries ' + O.photonEnergy(lam).toFixed(2) + ' eV.', 'It sets the colours seen and the diffraction blur.'], x0, yb + bh + 34, 17, { size: 12, color: C.muted });
        } else if (step === 1) {
          const k = Math.min((w * 0.44) / Wf, (Hh - yb - 56) / Hf), rx = x0 + 6, ry = yb + 4;
          c.strokeStyle = C.accent; c.lineWidth = 2; c.strokeRect(rx, ry, Wf * k, Hf * k);
          kit.label(c, fMm(Wf) + ' × ' + fMm(Hf), rx + Wf * k / 2, ry + Hf * k / 2, { align: 'center', size: 11.5, color: C.accent, weight: 650 });
          kit.label(c, 'the field on the part', rx, ry + Hf * k + 13, { size: 11, color: C.muted });
          const k2 = Math.min(w * 0.3 / SENS.w, 60 / SENS.h), qx = x0 + w - SENS.w * k2 - 2;
          c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(qx, ry, SENS.w * k2, SENS.h * k2); c.strokeRect(qx, ry, SENS.w * k2, SENS.h * k2);
          kit.label(c, SENS.w + ' × ' + SENS.h + ' mm', qx + SENS.w * k2 / 2, ry + SENS.h * k2 / 2, { align: 'center', size: 11, color: C.text });
          kit.label(c, 'the sensor (1/1.8″)', qx + SENS.w * k2, ry + SENS.h * k2 + 13, { size: 11, color: C.muted, align: 'right' });
          kit.label(c, 'm = ' + m.toFixed(3) + ' · angle of view ' + (2 * Math.atan(SENS.w / 2 / si) * R2D).toFixed(1) + '° across', x0 + 6, ry + Math.max(Hf * k, SENS.h * k2) + 31, { size: 11.5, weight: 650 });
        } else if (step === 2) {
          lines(kit, c, ['Entrance pupil D = f / N = ' + f + ' / ' + N + ' = ' + D.toFixed(2) + ' mm.', 'Seen from the part, it fills a cone of half-angle ' + (Math.atan(D / 2 / s) * R2D).toFixed(2) + '°.', 'Close up the lens works at f/' + Nw.toFixed(1) + ', not ' + N + ': N (1 + m).', 'Light on the sensor goes as 1 / ' + Nw.toFixed(1) + '² = ' + (1 / (Nw * Nw)).toFixed(3) + '.', 'Depth of field for a blur of two pixels: ' + fMm(dof) + '.'], x0, yb + 6, 19, { size: 12, color: C.muted });
        } else if (step === 3) {
          const pw = Math.min((w * 0.38) / 6, 70), u = Math.min(pw / p, (Hh - yb - 30) / (4 * p)), sx0 = x0 + 6, sy0 = yb + 2;
          for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { c.fillStyle = (i + j) % 2 ? C.surface : C.bg2; c.fillRect(sx0 + i * p * u, sy0 + j * p * u, p * u, p * u); }
          c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(sx0, sy0, 6 * p * u, 4 * p * u);
          c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.arc(sx0 + 2.5 * p * u, sy0 + 1.5 * p * u, airy / 2 * u, 0, 2 * PI); c.stroke();
          kit.label(c, 'Airy disc ' + fUm(airy), sx0 + 2.5 * p * u, sy0 + 4 * p * u + 13, { size: 11, color: col, align: 'center' });
          lines(kit, c, ['Pixels ' + p.toFixed(2) + ' µm: each one covers', fUm(p / m) + ' of the part.', 'Sampling limit ' + (500 / p).toFixed(0) + ' lp/mm', '(' + (500 / p * m).toFixed(1) + ' lp/mm on the part).', 'Sensor ' + Math.round(SENS.w / (p * 1e-3)) + ' × ' + Math.round(SENS.h / (p * 1e-3)) + ' pixels.'], sx0 + 6 * p * u + 16, yb + 10, 17, { size: 11.5, color: C.muted });
        } else {
          const bx = 118, bw = Math.max(80, W - bx - 92), bh = 17, mx = Math.max(airy, pix2, aber, 1) * 1.1;
          blurs.concat([['total', tot]]).forEach((b, i) => {
            const y = yb + i * (bh + 8), last = i === 3, isBig = b === big;
            kit.label(c, b[0], bx - 8, y + bh / 2, { align: 'right', size: 12, weight: last || isBig ? 700 : 500, color: isBig ? C.bad : C.text });
            c.fillStyle = C.surface; c.fillRect(bx, y, bw, bh); c.fillStyle = last ? C.accent : isBig ? C.bad : C.series[i]; c.fillRect(bx, y, bw * b[1] / mx, bh);
            kit.label(c, fUm(b[1]), bx + bw + 6, y + bh / 2, { size: 12, weight: last ? 700 : 500 });
          });
          lines(kit, c, ['Largest: ' + big[0] + '. Work on that one first.', 'Halve it and the total falls from ' + fUm(tot) + ' to ' + fUm(half) + '.'], x0, yb + 4 * (bh + 8) + 8, 17, { size: 12, color: C.muted });
        }
        ro.set('light', lam.toFixed(0) + ' nm · ' + O.photonEnergy(lam).toFixed(2) + ' eV');
        ro.set('field', fMm(Wf) + ' × ' + fMm(Hf) + ' · m = ' + m.toFixed(3));
        ro.set('stop', D.toFixed(2) + ' mm · f/' + Nw.toFixed(1));
        ro.set('det', fUm(p / m) + ' · ' + fMm(dof));
        ro.set('blur', fUm(airy) + ' · ' + fUm(pix2) + ' · ' + fUm(aber));
        ro.set('worst', big[0] + ' (' + fUm(big[1]) + ')');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ conjugate planes */
  Hyper.sim('us-conjugates', {
    title: 'Conjugate planes: where the object, and where the stop, are imaged',
    blurb: `A two-lens relay made of ideal thin lenses. Light leaves an object on the left, the first lens forms an **intermediate image**, the second lens relays it to the **final image**. The iris sits at the first lens. Every plane that is an image of the object is a **field plane (F)**; every plane that is an image of the iris is a **pupil plane (P)**. Rays from the axis point (marginal rays) cross the axis at the field planes; the chief ray from the edge of the object crosses it at the pupil planes. Heights are drawn larger than lengths.

**Try this**
- Show only the *marginal rays*: they meet the axis exactly where the object, the intermediate image and the final image are. Show only the *edge bundle*: its centre ray crosses the axis at the iris and at its image.
- With the default sizes the second lens (clear radius 25 mm) clips part of the bundle from the edge of the object, so the edge of the picture is dimmer than its centre; raise the object height to 10 mm and the chief ray, 33 mm high there, misses the lens altogether. Tick **Field lens**: it sits in a field plane, so the images do not move or change size, but it bends the chief ray onto the second lens and the whole field gets through.
- Make the second lens larger instead: the same cure by brute force.
- Open the iris: more light from every point, still the same field planes.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 320, maxH: 430 });
      const ctl = kit.controls(box.side, [
        { id: 'rays', type: 'select', label: 'Rays drawn', options: [['Marginal rays from the axis point', 'axis'], ['The bundle from the edge of the object', 'edge'], ['Both', 'both']], value: params.rays || 'both' },
        { id: 'fl', type: 'check', label: 'Field lens at the intermediate image', value: !!params.fl },
        { id: 'stop', label: 'Iris at the first lens: half-opening', min: 2, max: 20, step: 0.5, value: 8, unit: 'mm' },
        { id: 'h', label: 'Half-height of the object', min: 2, max: 16, step: 0.5, value: 7, unit: 'mm' },
        { id: 'r2', label: 'Clear radius of the second lens', min: 12, max: 40, step: 1, value: 25, unit: 'mm' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['ff', 'Field planes (images of the object)'], ['pp', 'Pupil planes (images of the iris)'], ['chief', 'Chief ray at the second lens'], ['edge', 'Light that gets through: edge of the field'], ['mag', 'Image heights'], ['scale', 'Drawing']]);
      const Z1 = 75, F1 = 50, Z2 = 325, F2 = 50, ZFL = Z1 + O.thinLens(F1, Z1).si, ZEND = 445;
      const fFL = 1 / (1 / (ZFL - Z1) + 1 / (Z2 - ZFL));                       // the field lens that puts the image of the iris on the second lens
      const thru = (z0, list) => { let z = z0; for (const e of list) { const so = e.z - z; z = e.z + O.thinLens(e.f, so).si; } return z; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, V = ctl.values;
        const elems = [{ z: Z1, f: F1, sd: 24 }].concat(V.fl ? [{ z: ZFL, f: fFL, sd: 36 }] : [], [{ z: Z2, f: F2, sd: V.r2 }]);
        const after = elems.slice(1).map(e => ({ z: e.z, f: e.f }));
        const trace = (yo, ys) => {
          let z = 0, y = yo, u = (ys - yo) / Z1; const pts = [[0, yo]];
          for (const e of elems) { y += u * (e.z - z); z = e.z; pts.push([z, y]); if (Math.abs(y) > e.sd + 1e-9) return { pts, blocked: true, yL2: null }; u -= y / e.f; }
          y += u * (ZEND - z); pts.push([ZEND, y]);
          return { pts, blocked: false };
        };
        const yAtL2 = (yo, ys) => { let z = 0, y = yo, u = (ys - yo) / Z1; for (const e of elems) { y += u * (e.z - z); z = e.z; if (e === elems[elems.length - 1]) return y; u -= y / e.f; } return NaN; };
        // the planes
        const fieldZ = [0, thru(0, [elems[0]].map(e => ({ z: e.z, f: e.f })))], zi1 = fieldZ[1];
        const fieldAll = [0, zi1, thru(0, elems.map(e => ({ z: e.z, f: e.f })))];
        const pupilAll = [Z1, thru(Z1, after)];
        const hh = V.h;
        // the drawing
        const zMin = -18, zMax = ZEND + 4, yMax = Math.max(V.r2, 2 * hh) + 4;
        const sx = (W - 28) / (zMax - zMin), sy = Math.min(sx * 2.3, (Hh / 2 - 36) / yMax), X = z => 14 + (z - zMin) * sx, y0 = Hh / 2 + 6, Y = y => y0 - y * sy;
        S.axis(c, X(zMin), y0, X(zMax));
        c.save(); c.setLineDash([3, 4]); c.lineWidth = 1;
        fieldAll.forEach((z, i) => { c.strokeStyle = C.accent; c.beginPath(); c.moveTo(X(z), 22); c.lineTo(X(z), Hh - 6); c.stroke(); kit.label(c, 'F' + (i + 1), X(z), 12, { align: 'center', size: 11.5, weight: 700, color: C.accent }); });
        pupilAll.forEach((z, i) => { c.strokeStyle = C.warn; c.beginPath(); c.moveTo(X(z) + 2, 22); c.lineTo(X(z) + 2, Hh - 6); c.stroke(); kit.label(c, 'P' + (i + 1), X(z) + 2, 12, { align: 'center', size: 11.5, weight: 700, color: C.warn }); });
        c.restore();
        // the elements
        S.thinLens(c, X(Z1), y0, 24 * sy, F1);
        S.stop(c, X(Z1), y0, 24 * sy, V.stop * sy);
        S.thinLens(c, X(Z2), y0, V.r2 * sy, F2);
        if (V.fl) S.thinLens(c, X(ZFL), y0, 36 * sy, fFL);
        kit.label(c, 'lens 1 + iris', X(Z1), Hh - 12, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'lens 2', X(Z2), Hh - 12, { align: 'center', size: 10.5, color: C.muted });
        if (V.fl) kit.label(c, 'field lens', X(ZFL), Hh - 26, { align: 'center', size: 10.5, color: C.muted });
        // object and images
        S.object(c, X(0), y0, hh * sy, { color: C.text });
        S.object(c, X(zi1), y0, -2 * hh * sy, { color: C.text, dash: true });
        S.object(c, X(fieldAll[2]), y0, 2 * hh * sy, { color: C.text, dash: true });
        // rays
        const bundles = (V.rays === 'axis' ? [0] : V.rays === 'edge' ? [hh] : [0, hh]);
        let passEdge = 1;
        for (const yo of bundles) {
          const colr = yo === 0 ? C.series[0] : C.series[3];
          for (const ys of [-V.stop, 0, V.stop]) {
            const r = trace(yo, ys);
            S.ray(c, r.pts.map(p => [X(p[0]), Y(p[1])]), { color: colr, width: ys === 0 ? 1.5 : 1.2, arrows: false, alpha: r.blocked ? 0.45 : 1 });
            if (r.blocked) { const e = r.pts[r.pts.length - 1]; c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(X(e[0]) - 4, Y(e[1]) - 4); c.lineTo(X(e[0]) + 4, Y(e[1]) + 4); c.moveTo(X(e[0]) + 4, Y(e[1]) - 4); c.lineTo(X(e[0]) - 4, Y(e[1]) + 4); c.stroke(); }
          }
        }
        // how much of the bundle from the edge of the object gets through
        let ok = 0; const NS = 41;
        for (let i = 0; i < NS; i++) { const ys = -V.stop + 2 * V.stop * i / (NS - 1); if (!trace(hh, ys).blocked) ok++; }
        passEdge = ok / NS;
        const yc = yAtL2(hh, 0);
        ro.set('ff', fieldAll.map(z => Math.round(z)).join(', ') + ' mm');
        ro.set('pp', pupilAll.map(z => z.toFixed(0)).join(', ') + ' mm');
        ro.set('chief', (yc >= 0 ? '+' : '−') + Math.abs(yc).toFixed(1) + ' mm (the lens reaches ±' + V.r2 + ' mm)');
        ro.set('edge', fPct(passEdge) + (passEdge < 0.999 ? ' — vignetted' : ''));
        ro.set('mag', '−' + 2 * hh + ' mm at F2, +' + 2 * hh + ' mm at F3 (field lens or not)');
        ro.set('scale', 'heights × ' + (sy / sx).toFixed(1) + ' against lengths' + (V.fl ? '; field lens f = ' + fFL.toFixed(0) + ' mm' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the requirements squeeze the f-number */
  Hyper.sim('us-spec-window', {
    title: 'Specifications squeeze the f-number into a window',
    blurb: `Write down what the system must do and each line forbids part of the range of f-numbers. **Depth of field** wants a large N (a slim cone). **Resolution** wants a small N, so that diffraction does not blur the finest detail. **Light** wants a small N, so that enough photons arrive. The design is only possible where the three allowed ranges overlap. The sensor is a 2/3″ one (8.8 mm wide); the lens is thin and the scene is lit evenly. Light: the lens passes 90 % of the light, the quantum efficiency is 60 %, and shot noise alone must give a signal-to-noise ratio of 30. Resolution: the detail must keep 20 % contrast through diffraction.

**Try this**
- Start from the defaults: a window of about f/5.7 to f/8.8, with f/8 inside it. Ask for a **depth of field** of 6 mm: the window closes, because the depth wants f/17 and the light cannot afford it.
- Now rescue it, one lever at a time: more **light**, a longer **exposure**, a smaller **field** (more magnification changes everything at once), or a less demanding depth. Which lever is cheapest in a real plant?
- Ask for a very fine **detail** (10 µm): diffraction now allows only f/4.5, below the f/5.7 the depth needs, and the window closes from the other side.
- Make the pixels coarser than the detail needs (9 µm pixels for 20 µm detail): the sensor row warns you. No f-number can fix a pixel that is too big.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cm = O.cam, Mt = O.mtf, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300, maxH: 400 });
      const SW = 8.8;
      const ctl = kit.controls(box.side, [
        { id: 'W', label: 'Field of view (width)', min: 5, max: 500, value: params.W || 40, log: true, sig: 2, unit: 'mm' },
        { id: 's', label: 'Working distance (part to lens)', min: 30, max: 2000, value: params.s || 200, log: true, sig: 2, unit: 'mm' },
        { id: 'd', label: 'Smallest detail to resolve (line width)', min: 5, max: 2000, value: params.d || 100, log: true, sig: 2, unit: 'µm' },
        { id: 'Z', label: 'Depth of field needed (total)', min: 0.2, max: 100, value: params.Z || 2, log: true, sig: 2, unit: 'mm' },
        { id: 'L', label: 'Brightness of the part', min: 5, max: 20000, value: params.L || 1000, log: true, sig: 2, unit: 'cd/m²' },
        { id: 't', label: 'Exposure time', min: 0.05, max: 100, value: params.t || 5, log: true, sig: 2, unit: 'ms' },
        { id: 'p', label: 'Pixel pitch', min: 1.4, max: 9, step: 0.05, value: 3.45, unit: 'µm' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['lens', 'Magnification · focal length'], ['px', 'The detail on the sensor'], ['win', 'Allowed f-numbers'], ['stops', 'Standard stops in the window'], ['who', 'Verdict']]);
      // the f-number where diffraction leaves 20 % contrast at the fineness of the detail (x = nu / cut-off)
      const cut1 = Mt.cutoff(550, 1);
      let xl = 0.5; { let a = 0, b = 1; for (let i = 0; i < 40; i++) { const x = (a + b) / 2; if (Mt.diffraction(x * cut1, 550, 1) > 0.2) a = x; else b = x; } xl = (a + b) / 2; }
      const NMAX = 64, lg = Math.log2(NMAX);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, V = ctl.values;
        const m = SW / V.W, f = V.s * m / (1 + m), pitch = V.p;
        const nu = 1000 / (2 * V.d * m);                                                 // lp/mm on the sensor for a line of width d
        const Ndiff = xl / (nu * 0.00055) / (1 + m);
        const cc = 2 * pitch * 1e-3, Ndof = V.Z * m * m / (2 * cc * (1 + m));
        const P1 = Cm.photons({ lux: Ph.imageIlluminance(V.L, 1, 0.9, m, 0), t: V.t * 1e-3, pitch });
        const Nlight = Math.sqrt(0.6 * P1) / 30;
        const hi = Math.min(Ndiff, Nlight), ok = Ndof <= hi;
        const pixMax = V.d * m / 2, pixOk = pitch <= pixMax + 1e-9;
        const x0 = 76, x1 = W - 14, X = n => x0 + (x1 - x0) * clamp(Math.log2(n) / lg, 0, 1);
        const rows = [['depth', Ndof, NMAX, 'at least ' + fN(Ndof)], ['resolution', 1, Ndiff, 'at most ' + fN(Ndiff)], ['light', 1, Nlight, 'at most ' + fN(Nlight)]];
        const rh = 26, y1 = 36;
        // the axis of f-numbers
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let k = 0; k <= lg * 2; k++) { const n = Math.pow(2, k / 2), x = X(n), major = k % 2 === 0; c.beginPath(); c.moveTo(x, y1 - 6); c.lineTo(x, y1 + 4 * (rh + 8)); c.stroke(); if (major) kit.label(c, String(Math.round(n)), x, 12, { align: 'center', size: 10.5, color: C.muted }); }
        kit.label(c, 'f-number N', x0, 24, { size: 10.5, color: C.faint });
        rows.concat([['all three', Ndof, hi, ok ? fN(Ndof) + ' to ' + fN(hi) : 'none']]).forEach((r, i) => {
          const y = y1 + i * (rh + 8), last = i === 3, a = X(Math.max(1, r[1])), b = X(Math.min(NMAX, r[2]));
          kit.label(c, r[0], 8, y + rh / 2, { size: 12, weight: last ? 700 : 500 });
          c.fillStyle = C.surface; c.fillRect(x0, y, x1 - x0, rh);
          if (r[2] > r[1] || (last && ok)) { c.fillStyle = last ? C.ok : C.accent; c.globalAlpha = last ? 0.85 : 0.5; c.fillRect(a, y, Math.max(2, b - a), rh); c.globalAlpha = 1; }
          else if (last) { c.fillStyle = C.bad; c.globalAlpha = 0.25; c.fillRect(x0, y, x1 - x0, rh); c.globalAlpha = 1; }
          const txt = last ? r[3] : r[3];
          const tx = last ? (x0 + x1) / 2 : clamp((a + b) / 2, x0 + 40, x1 - 40);
          kit.label(c, txt, tx, y + rh / 2, { align: 'center', size: 11.5, weight: 650, color: last && !ok ? C.bad : C.text });
        });
        // the standard stops that fit
        const yS = y1 + 4 * (rh + 8) + 4;
        for (const n of STOPS) { if (n > NMAX) continue; const inside = ok && n >= Ndof && n <= hi; kit.label(c, fN(n).slice(2), X(n), yS + 6, { align: 'center', size: 10, weight: inside ? 700 : 500, color: inside ? C.ok : C.faint }); }
        kit.label(c, 'stops', x0 - 6, yS + 6, { align: 'right', size: 10, color: C.faint });
        const msg = !pixOk ? 'The pixels are too coarse: this detail needs a pitch of ' + pixMax.toFixed(1) + ' µm or less.'
          : ok ? 'A lens of about ' + f.toFixed(0) + ' mm can do it, between ' + fN(Ndof) + ' and ' + fN(hi) + '.'
          : Ndof > Ndiff && Ndof > Nlight ? 'Depth needs ' + fN(Ndof) + '; diffraction and light both forbid it.' : Ndof > Ndiff ? 'Depth needs ' + fN(Ndof) + '; diffraction allows only ' + fN(Ndiff) + '.' : 'Depth needs ' + fN(Ndof) + '; the light allows only ' + fN(Nlight) + '.';
        kit.label(c, msg, 10, Hh - 16, { size: 11.5, weight: 650, color: pixOk && ok ? C.ok : C.bad });
        const inWin = STOPS.filter(n => ok && n >= Ndof && n <= hi);
        ro.set('lens', 'm = ' + m.toFixed(3) + ' · f = ' + f.toFixed(1) + ' mm');
        ro.set('px', fUm(V.d * m) + ' = ' + (V.d * m / pitch).toFixed(1) + ' pixels wide' + (pixOk ? '' : ' (too few)'));
        ro.set('win', ok ? fN(Ndof) + ' to ' + fN(hi) : 'none: ' + fN(Ndof) + ' needed, ' + fN(hi) + ' possible');
        ro.set('stops', ok ? (inWin.length ? inWin.map(fN).join(', ') : 'none exactly, but the window is open') : 'none');
        ro.set('who', !pixOk ? 'sensor too coarse' : ok ? 'feasible' : 'the specification contradicts itself: relax one line');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a first-order layout */
  Hyper.sim('us-layout', {
    title: 'First-order layout: object, lens and sensor on a track',
    blurb: `The object stands at the left, the sensor is fixed at the right, a distance **TT** (the *total track*) away. A thin lens slides between them; drag it, or use the slider. The lens is sharp only where the image it forms lands exactly on the sensor. The drawing is to scale along the track; heights are enlarged to fit. This is the whole of first-order design: focal lengths, spacings and magnification, settled with the thin-lens equation before any real glass is chosen.

**Try this**
- With TT = 300 mm and f = 50 mm, slide the lens: the blur circle at the sensor is large nearly everywhere and vanishes at **two** positions, one with the lens near the object (image enlarged) and one near the sensor (image reduced). The two magnifications are reciprocals.
- Shorten TT to 200 mm (exactly 4 f): the two positions merge into one, at magnification 1. Shorten it further: *no* position works. A real image needs TT of at least 4 f.
- Raise f at a fixed TT, then press **Go to a sharp position**: the lens moves and the magnification follows.
- Tick **second lens**: now the spacing matters too, and the combined focal length changes (readout). Try +100 mm behind a +50 mm lens, then a −100 mm one.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, A = O.abcd;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 310, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'TT', label: 'Object to sensor (total track)', min: 60, max: 600, step: 5, value: params.TT || 300, unit: 'mm' },
        { id: 'f', label: 'Focal length of the lens', min: 10, max: 200, value: params.f || 50, log: true, sig: 3, unit: 'mm' },
        { id: 'N', label: 'f-number', min: 1.4, max: 16, value: 4, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'pos', label: 'Lens position, from the object', min: 5, max: 595, step: 1, value: params.pos || 90, unit: 'mm' },
        { id: 'two', type: 'check', label: 'Add a second lens behind the first', value: !!params.two },
        { id: 'f2', type: 'select', label: 'Second lens', options: [['+30 mm', 30], ['+50 mm', 50], ['+100 mm', 100], ['−100 mm', -100]], value: 100 },
        { id: 'd', label: 'Spacing between the two lenses', min: 5, max: 150, step: 1, value: 40, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'snap', label: 'Go to a sharp position', primary: true }] }
      ], id => { if (id === 'snap') snap(); if (id === 'two') vis(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['img', 'Image forms · magnification'], ['blur', 'Blur circle on the sensor'], ['ht', 'Image height on the sensor'], ['D', 'Lens opening f / N'], ['sharp', 'Sharp positions of the lens'], ['efl', 'Combined focal length']]);
      const H0 = 10;                                                         // half-height of the object, mm
      const geo = { x0: 0, sx: 1, roots: [], zL: 0, y0: 0, Hh: 0 };
      function vis() { ctl.show('f2', V.two); ctl.show('d', V.two); ro.show('efl', V.two); }
      const chain = (zL, two) => {
        const els = [A.free(zL), A.lens(V.f)];
        if (two) els.push(A.free(V.d), A.lens(V.f2));
        els.push(A.free(V.TT - zL - (two ? V.d : 0)));
        return A.mul.apply(null, els);
      };
      const roots = two => {
        const lo = 5, hi = V.TT - (two ? V.d : 0) - 5, out = [], n = 240;
        if (hi <= lo) return out;
        let a = lo, ga = chain(a, two)[0][1];
        for (let i = 1; i <= n; i++) {
          const b = lo + (hi - lo) * i / n, gb = chain(b, two)[0][1];
          if (ga === 0 || ga * gb < 0) { let p = a, q = b, gp = ga; for (let k = 0; k < 40; k++) { const mid = (p + q) / 2, gm = chain(mid, two)[0][1]; if (gp * gm <= 0) q = mid; else { p = mid; gp = gm; } } out.push((p + q) / 2); }
          a = b; ga = gb;
        }
        return out;
      };
      function snap() {
        if (!geo.roots.length) return;
        let best = geo.roots[0]; for (const r of geo.roots) if (Math.abs(r - V.pos) < Math.abs(best - V.pos)) best = r;
        ctl.set('pos', Math.round(best * 10) / 10);
      }
      kit.drag(st, {
        hover: true,
        hit: p => (Math.abs(p.x - (geo.x0 + geo.sx * geo.zL)) < 18 && Math.abs(p.y - geo.y0) < geo.Hh * 0.42 ? 'lens' : null),
        move: (what, p) => { ctl.set('pos', clamp(Math.round((p.x - geo.x0) / geo.sx), 5, 595)); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const two = V.two, d = two ? V.d : 0, f2 = V.f2, TT = V.TT;
        const zL = clamp(V.pos, 5, Math.max(6, TT - d - 5)), D = V.f / V.N;
        const M = chain(zL, two), u0 = (D / 2) / zL;
        const blur = 2 * Math.abs(A.apply(M, [0, u0])[0]);
        const ys = A.apply(M, [H0, -H0 / zL])[0];
        const rts = roots(two); geo.roots = rts;
        // the image from the first-order matrix of the lens or lenses
        let imgTxt;
        if (two) { const Ml = A.mul(A.lens(V.f), A.free(V.d), A.lens(f2)), im = A.image(Ml, zL); imgTxt = fin(im.si) ? fMm(im.si) + ' behind lens 2 · m = ' + im.m.toFixed(2) : 'at infinity'; }
        else { const im = O.thinLens(V.f, zL); imgTxt = !fin(im.si) ? 'at infinity (the object is at the focus)' : im.si > 0 ? fMm(im.si) + ' behind the lens · m = ' + im.m.toFixed(2) : 'virtual: no real image'; }
        // the picture
        const x0 = 22, sx = (W - 2 * x0) / TT, yHalf = Math.max(D / 2, 2.2 * H0, 12) * 1.08, sy = Math.min(sx * 3, (Hh / 2 - 40) / yHalf), y0 = Hh / 2 - 8, Y = y => y0 - y * sy, X = z => x0 + z * sx;
        geo.x0 = x0; geo.sx = sx; geo.zL = zL; geo.y0 = y0; geo.Hh = Hh;
        S.axis(c, X(-3), y0, X(TT + 3));
        S.object(c, X(0), y0, H0 * sy, { color: C.text, label: '' });
        S.sensor(c, X(TT), y0, 11 * sy, { pixels: 12 });
        const lh = Math.min(D / 2 * sy, Hh / 2 - 44);
        const path = (yo, u) => {
          const y1 = yo + u * zL, u1 = u - y1 / V.f, pts = [[X(0), Y(yo)], [X(zL), Y(y1)]];
          if (two) { const y2 = y1 + u1 * d, u2 = u1 - y2 / f2; pts.push([X(zL + d), Y(y2)], [X(TT), Y(y2 + u2 * (TT - zL - d))]); }
          else pts.push([X(TT), Y(y1 + u1 * (TT - zL))]);
          return pts;
        };
        const nm = 580;
        for (const sg of [-1, 1]) S.ray(c, path(0, sg * (D / 2) / zL), { nm, width: 1.4, arrows: false });
        S.ray(c, path(H0, -H0 / zL), { nm, width: 1.4, arrows: false });
        for (const sg of [-1, 1]) S.ray(c, path(H0, (sg * D / 2 - H0) / zL), { nm, width: 1, arrows: false, alpha: 0.45 });
        S.thinLens(c, X(zL), y0, lh, V.f, { foci: V.f * sx, label: two ? 'lens 1' : 'lens' });
        if (two) S.thinLens(c, X(zL + d), y0, lh, f2, { label: 'lens 2' });
        // the sharp-position track
        const ty = Hh - 20;
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(0), ty); c.lineTo(X(TT), ty); c.stroke();
        for (const r of rts) { c.fillStyle = C.ok; c.beginPath(); c.moveTo(X(r), ty - 8); c.lineTo(X(r) + 6, ty); c.lineTo(X(r), ty + 8); c.lineTo(X(r) - 6, ty); c.closePath(); c.fill(); }
        c.fillStyle = Math.abs(blur) < 0.02 ? C.ok : C.accent; c.beginPath(); c.arc(X(zL), ty, 5, 0, 2 * PI); c.fill();
        kit.label(c, 'lens position (drag the lens)', X(0), ty - 14, { size: 10.5, color: C.faint });
        if (!rts.length) kit.label(c, two ? 'no spacing of this pair gives a sharp image on this track' : 'TT < 4 f = ' + fMm(4 * V.f) + ': no position is sharp', W - 10, 14, { align: 'right', size: 11.5, weight: 650, color: C.bad });
        else kit.label(c, 'green diamonds: sharp positions', W - 10, 14, { align: 'right', size: 10.5, color: C.ok });
        ro.set('img', imgTxt);
        ro.set('blur', blur < 0.01 ? 'none: sharp' : fMm(blur) + (blur > 0.05 * H0 ? ' — heavily blurred' : ''));
        ro.set('ht', (ys >= 0 ? '+' : '−') + fMm(Math.abs(ys)) + ' for an object of ±' + H0 + ' mm');
        ro.set('D', fMm(D));
        ro.set('sharp', rts.length ? rts.map(r => fMm(r)).join(' and ') : 'none');
        ro.set('efl', fMm(O.twoLenses(V.f, f2, V.d).f));
      }, box.stage);
      vis();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the resolution budget */
  Hyper.sim('us-resolution-budget', {
    title: 'The resolution budget: every blur in micrometres',
    blurb: `A 25 mm lens on a sensor. Each thing that blurs a point on the sensor has a size in micrometres: the **diffraction** disc (2.44 λN), the **lens** aberrations (twice the RMS radius of the traced spot at best focus), the **two pixels** that the sampling needs, a **focus error** (a defocus disc of diameter Δz/N), **motion** during the exposure and **vibration**. They combine roughly in quadrature, so the largest dominates and the small ones barely count. The graph shows the same stages as MTF curves.

**Try this**
- Look at the defaults: diffraction is the largest bar. Halving the smallest ones would change the total by almost nothing; halving the largest (open the aperture) changes it a lot.
- Open the aperture from f/16 to f/4: diffraction shrinks but the lens aberrations and the focus-error disc grow. For the cheap singlet the lens bar takes over at f/4.
- Raise the motion to 20 µm: it dwarfs everything else. Cure it with a shorter exposure, not with a better lens.
- Choose smaller pixels (1.4 µm): the pixel bar shrinks, yet the total hardly moves, because diffraction and the motion were already larger. Smaller pixels pay only when the optics and the exposure keep up.`,
    mount(box, kit, params) {
      const O = kit.optics, Mt = O.mtf;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270, maxH: 360 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'lp/mm', name: 'ν', min: 0, max: 200 }, y: { label: 'MTF', name: 'MTF', min: 0, max: 1.02 }, series: [] }, 150);
      const F25 = 25;
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'The 25 mm lens', options: [['Ideal: no aberrations', 'none'], ['A cheap singlet', 'biconvex'], ['A catalogue achromat', 'achromat'], ['A camera lens (double Gauss)', 'double-gauss']], value: params.lens || 'achromat' },
        { id: 'N', type: 'select', label: 'Aperture', options: [4, 5.6, 8, 11, 16, 22].map(v => ['f/' + v, v]), value: params.N || 5.6 },
        { id: 'p', label: 'Pixel pitch', min: 1.4, max: 9, step: 0.05, value: 3.45, unit: 'µm' },
        { id: 'dz', label: 'Focus error of the sensor', min: 0, max: 100, step: 1, value: 20, unit: 'µm' },
        { id: 'mo', label: 'Motion during the exposure', min: 0, max: 40, step: 0.5, value: 6, unit: 'µm' },
        { id: 'vb', label: 'Vibration, peak to peak', min: 0, max: 20, step: 0.5, value: 0, unit: 'µm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['tot', 'All together (root sum of squares)'], ['big', 'The largest blur'], ['half', 'If that one were halved'], ['nyq', 'Nyquist frequency of the pixels'], ['mtf', 'System MTF at that frequency']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, N = V.N, lam = 550;
        let ab = 0, rmsMm = 0;
        if (V.lens !== 'none') { const sp = spotFor(O, V.lens, F25, N, 0, false); rmsMm = sp.on.rms; ab = 2 * rmsMm * 1e3; }
        const items = [
          { n: 'diffraction', v: 2.44 * lam * 1e-3 * N, f: nu => Mt.diffraction(nu, lam, N) },
          { n: 'the lens', v: ab, f: nu => Mt.gaussian(nu, rmsMm / Math.SQRT2) },
          { n: 'two pixels', v: 2 * V.p, f: nu => Mt.pixel(nu, V.p) },
          { n: 'focus error', v: V.dz / N, f: nu => Mt.defocus(nu, V.dz / N * 1e-3) },
          { n: 'motion', v: V.mo, f: nu => Mt.motion(nu, V.mo * 1e-3) },
          { n: 'vibration', v: V.vb, f: nu => Mt.motion(nu, V.vb * 1e-3) }
        ];
        const tot = Math.sqrt(items.reduce((a, b) => a + b.v * b.v, 0)), big = items.reduce((a, b) => (b.v > a.v ? b : a));
        const half = Math.sqrt(items.reduce((a, b) => a + (b === big ? b.v * b.v / 4 : b.v * b.v), 0));
        const bx = 100, bw = Math.max(80, W - bx - 112), bh = Math.min(22, (Hh - 70) / 8), y1 = 26, mx = Math.max(tot, 1) * 1.05;
        kit.label(c, 'blur diameter on the sensor', 10, 12, { size: 11, color: C.faint });
        items.concat([{ n: 'all together', v: tot, last: true }]).forEach((b, i) => {
          const y = y1 + i * (bh + 5), last = b.last, isBig = b === big && b.v > 0;
          kit.label(c, b.n, bx - 8, y + bh / 2, { align: 'right', size: 11.5, weight: last || isBig ? 700 : 500, color: isBig ? C.bad : C.text });
          c.fillStyle = C.surface; c.fillRect(bx, y, bw, bh);
          c.fillStyle = last ? C.accent : isBig ? C.bad : C.series[i % 7]; c.fillRect(bx, y, Math.max(b.v > 0 ? 1.5 : 0, bw * b.v / mx), bh);
          kit.label(c, fUm(b.v) + (last ? '' : ' · ' + (tot > 0 ? Math.round(100 * b.v * b.v / (tot * tot)) : 0) + ' %'), bx + bw + 6, y + bh / 2, { size: 11, weight: last ? 700 : 500 });
        });
        kit.label(c, 'right of the bars: share of the total variance', 10, y1 + 7 * (bh + 5) + 8, { size: 10, color: C.faint });
        const nyq = Mt.nyquist(V.p), nuMax = clamp(1.35 * nyq, 60, 700);
        const sys = nu => items.reduce((a, b) => a * b.f(nu), 1);
        const pts = fn => { const a = []; for (let i = 0; i <= 120; i++) { const nu = nuMax * i / 120; a.push([nu, fn(nu)]); } return a; };
        const series = items.filter(b => b.v > 0).map(b => ({ pts: pts(b.f), label: b.n, color: b === big ? C.bad : C.series[items.indexOf(b) % 7], dash: true, width: 1.3 }));
        series.push({ pts: pts(sys), label: 'system', color: C.text, width: 3 });
        plot.set({ x: { label: 'lp/mm', name: 'ν', min: 0, max: nuMax }, y: { label: 'MTF', name: 'MTF', min: 0, max: 1.02 }, series, vlines: [{ x: nyq, label: 'Nyquist' }] });
        ro.set('tot', fUm(tot));
        ro.set('big', big.n + ' (' + fUm(big.v) + ')');
        ro.set('half', fUm(half) + ' (' + Math.round(100 * (1 - half / tot)) + ' % better)');
        ro.set('nyq', nyq.toFixed(0) + ' lp/mm');
        ro.set('mtf', fNum(sys(nyq), 2));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the light budget */
  Hyper.sim('us-light-budget', {
    title: 'The light budget: from the scene to the signal-to-noise ratio',
    blurb: `Follow the light of a lit part to one pixel. First the lens passes only a small part of it: the illuminance on the sensor is E = π L T / (4 N² (1 + m)²), so the **aperture**, the **close-up** factor and the **glass** each cost some *stops* (one stop is a factor 2). Then the exposure turns E into **photons** on a pixel, the sensor turns them into **electrons**, and the electrons carry their own shot noise, √n, plus the read noise. The bars on the left count stops; those below count photons, electrons and noise on a log scale. The light is taken as green (555 nm), and the glass absorbs nothing; only the surfaces lose light.

**Try this**
- Change the **coating**: ten uncoated surfaces keep only about 65 % of the light, ten with a single MgF₂ layer 87 %, ten with a good multilayer 99 %. That is more than half a stop for free.
- Stop down from f/4 to f/8: two stops lost, a quarter of the electrons, half the signal-to-noise ratio (shot noise: SNR goes as the square root of the light).
- Go close up (magnification 1): the close-up factor costs two stops, as the working f-number rule says.
- Read the last two rows: the exposure that would give a signal-to-noise ratio of 50. To buy a stop of light you can double the exposure, open the aperture by a stop, or double the lamp.`,
    mount(box, kit, params) {
      const O = kit.optics, Cm = O.cam, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 310, maxH: 420 });
      const avg = fn => { let a = 0, n = 0; for (let nm = 450; nm <= 650; nm += 10) { a += fn(nm); n++; } return a / n; };
      const R = { u: avg(nm => O.normalR(1, O.index('N-BK7', nm))), mg: avg(nm => O.film.stack(O.film.design('mgf2', 550, 'N-BK7'), nm, 0).R), bb: avg(nm => O.film.stack(O.film.design('bbar', 550, 'N-BK7'), nm, 0).R) };
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Luminance of the part', min: 5, max: 5000, value: params.L || 80, log: true, sig: 2, unit: 'cd/m²' },
        { id: 'N', type: 'select', label: 'Aperture', options: [1.4, 2, 2.8, 4, 5.6, 8, 11, 16].map(v => ['f/' + v, v]), value: params.N || 4 },
        { id: 'm', label: 'Magnification', min: 0.01, max: 1, value: params.m || 0.2, log: true, sig: 2 },
        { id: 'n', label: 'Glass surfaces in the lens', min: 2, max: 24, step: 2, value: 10 },
        { id: 'coat', type: 'select', label: 'Coating of each surface', options: [['Uncoated glass: ' + (100 * R.u).toFixed(1) + ' % lost', 'u'], ['Single-layer MgF₂: ' + (100 * R.mg).toFixed(1) + ' % lost', 'mg'], ['Broadband multilayer (design): ' + (100 * R.bb).toFixed(2) + ' % lost', 'bb']], value: 'u' },
        { id: 't', label: 'Exposure time', min: 0.05, max: 100, value: params.t || 5, log: true, sig: 2, unit: 'ms' },
        { id: 'p', label: 'Pixel pitch', min: 1.4, max: 9, step: 0.05, value: 3.45, unit: 'µm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['E', 'Illuminance on the sensor'], ['ph', 'Photons on one pixel'], ['e', 'Electrons (QE 60 %)'], ['snr', 'Signal-to-noise ratio'], ['stops', 'Stops between scene and sensor'], ['need', 'Exposure for SNR 50']]);
      const QE = 0.6, READ = 3;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const N = V.N, m = V.m, T = Math.pow(1 - R[V.coat], V.n), tsec = V.t * 1e-3;
        const E = Ph.imageIlluminance(V.L, N, T, m, 0);
        const ph = Cm.photons({ lux: E, t: tsec, pitch: V.p }), sn = Cm.snr({ photons: ph, qe: QE, read: READ, t: tsec });
        const items = [['aperture π/4N²', Math.log2(4 * N * N / PI)], ['close-up 1/(1+m)²', 2 * Math.log2(1 + m)], ['glass: ' + V.n + ' surfaces', -Math.log2(T)]];
        const totalStops = items.reduce((a, b) => a + b[1], 0);
        const bx = 124, bw = Math.max(80, W - bx - 62), bh = 19, MAXS = 14;
        kit.label(c, 'light lost (stops)', 10, 12, { size: 11, color: C.faint });
        items.concat([['all together', totalStops]]).forEach((b, i) => {
          const y = 24 + i * (bh + 5), last = i === 3;
          kit.label(c, b[0], bx - 8, y + bh / 2, { align: 'right', size: 11, weight: last ? 700 : 500 });
          c.fillStyle = C.surface; c.fillRect(bx, y, bw, bh); c.fillStyle = last ? C.accent : C.series[i]; c.fillRect(bx, y, Math.max(1.5, bw * clamp(b[1] / MAXS, 0, 1)), bh);
          kit.label(c, b[1].toFixed(1), bx + bw + 6, y + bh / 2, { size: 11.5, weight: last ? 700 : 500 });
        });
        // the second part: photons, electrons, noise, on a log scale
        const y2 = 24 + 4 * (bh + 5) + 22;
        kit.label(c, 'in one pixel (log scale)', 10, y2 - 12, { size: 11, color: C.faint });
        const lg = v => clamp(Math.log10(Math.max(v, 1)) / 6, 0, 1);
        for (let k = 0; k <= 6; k++) { const x = bx + bw * k / 6; c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y2 - 2); c.lineTo(x, y2 + 3 * (bh + 5) - 3); c.stroke(); if (k % 2 === 0) kit.label(c, k === 0 ? '1' : k === 6 ? '10⁶' : '10' + ['', '', '²', '', '⁴'][k], x, y2 + 3 * (bh + 5) + 6, { align: 'center', size: 10, color: C.muted }); }
        [['photons', ph, C.series[4]], ['electrons', sn.signal, C.series[2]], ['noise', sn.noise, C.bad]].forEach((b, i) => {
          const y = y2 + i * (bh + 5);
          kit.label(c, b[0], bx - 8, y + bh / 2, { align: 'right', size: 11, weight: 500 });
          c.fillStyle = b[2]; c.globalAlpha = 0.8; c.fillRect(bx, y, Math.max(1.5, bw * lg(b[1])), bh); c.globalAlpha = 1;
          kit.label(c, fBig(b[1]), Math.min(bx + bw * lg(b[1]) + 6, W - 70), y + bh / 2, { size: 11, color: C.text });
        });
        kit.label(c, 'SNR = ' + sn.snr.toFixed(sn.snr >= 10 ? 0 : 1) + '  (' + sn.db.toFixed(0) + ' dB)', 10, Hh - 14, { size: 13, weight: 700, color: sn.snr >= 50 ? C.ok : sn.snr >= 10 ? C.text : C.bad });
        kit.label(c, 'shot noise ' + sn.shot.toFixed(0) + ' e⁻, read noise ' + READ + ' e⁻', W - 10, Hh - 14, { align: 'right', size: 10.5, color: C.faint });
        const S50 = 50, eNeed = (S50 * S50 + Math.sqrt(Math.pow(S50, 4) + 4 * S50 * S50 * READ * READ)) / 2, tNeed = sn.signal > 0 ? V.t * eNeed / sn.signal : Infinity;
        ro.set('E', (E >= 10 ? E.toFixed(0) : E.toFixed(2)) + ' lx');
        ro.set('ph', fBig(ph));
        ro.set('e', fBig(sn.signal));
        ro.set('snr', sn.snr.toFixed(1) + ' (' + sn.db.toFixed(1) + ' dB)');
        ro.set('stops', totalStops.toFixed(1) + ' (T = ' + (100 * T).toFixed(0) + ' %)');
        ro.set('need', tNeed >= 1000 ? (tNeed / 1000).toFixed(1) + ' s' : tNeed.toFixed(tNeed < 10 ? 2 : 0) + ' ms');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ choosing catalogue lenses */
  Hyper.sim('us-choose', {
    title: 'Which lens will do? Seven candidates, traced',
    blurb: `Seven lenses, all scaled to the same focal length and opened to the same f-number, are traced ray by ray. The bars show the diameter (twice the RMS radius) of the blur spot at the best focus: the top bar on the axis, the lower bar at the chosen field angle. The dashed line is the **Airy disc**, the smallest blur that diffraction allows, and the green line is the blur you can accept. The simplest lens whose bars stay left of the green line is the one to buy. **Click a row** to see its spot diagrams; the dashed circle in them is the Airy disc.

**Try this**
- Start at f = 50 mm, f/4, a 4° field, a 15 µm target: the singlets are three to twelve times too big; the achromat is superb on the axis (2.5 µm) and poor at 4° (65 µm); the triplet (10 and 13 µm) and the double Gauss (about 5 µm) pass. The simplest that passes is the triplet. Tighten the target to 6 µm and only the double Gauss is left.
- Change the target to 100 µm (a coarse pixel, a laser spot): a plano-convex singlet is enough (45 µm on the axis, 75 µm at 4°). Most optics catalogues sell exactly this case.
- Compare the two plano-convex rows: the curved face towards the far object is much better than the curved face towards the sensor. Same glass, same price, four times the blur (45 against 182 µm).
- Switch the light to *white*: the singlets and the achromat grow (colour fringes); the multi-element designs hardly change.
- Raise the field: only the designs made for a field (triplet, double Gauss) hold up. Lower the f-number to 2.8: the achromat and the triplet of the catalogue no longer fit the beam at all.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 400, maxH: 520 });
      const LIST = [['biconvex', 'biconvex'], ['plano-convex', 'plano-convex'], ['plano-reversed', 'plano (flipped)'], ['best-form', 'best form'], ['achromat', 'achromat'], ['cooke-triplet', 'triplet'], ['double-gauss', 'double Gauss']];
      let sel = 4;
      const ctl = kit.controls(box.side, [
        { id: 'f', type: 'select', label: 'Focal length', options: [[ '25 mm', 25], ['50 mm', 50], ['100 mm', 100]], value: params.f || 50 },
        { id: 'N', type: 'select', label: 'Aperture', options: [2.8, 4, 5.6, 8, 11].map(v => ['f/' + v, v]), value: params.N || 4 },
        { id: 'fld', label: 'Field angle (half)', min: 0, max: 12, step: 0.5, value: params.fld != null ? params.fld : 4, unit: '°' },
        { id: 'lt', type: 'select', label: 'Light', options: [['One colour (588 nm)', 'm'], ['White (486, 588, 656 nm)', 'w']], value: params.lt || 'm' },
        { id: 'tgt', label: 'Blur you can accept', min: 2, max: 200, value: params.tgt || 15, log: true, sig: 2, unit: 'µm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['airy', 'Airy disc (diffraction limit)'], ['sel', 'The lens you clicked'], ['ok', 'Candidates that pass'], ['best', 'The simplest that passes']]);
      const geo = { y1: 40, rh: 26 };
      kit.click(st, p => { const i = Math.floor((p.y - geo.y1) / geo.rh); if (i >= 0 && i < LIST.length) { sel = i; loop.once(); } }, p => { const i = Math.floor((p.y - geo.y1) / geo.rh); return i >= 0 && i < LIST.length; });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, white = V.lt === 'w';
        const airy = 2.44 * 0.5876 * V.N;                                            // µm
        const res = LIST.map(([id]) => spotFor(O, id, V.f, V.N, V.fld, white));
        const x0 = 112, x1 = W - 50, LO = 0.5, HI = 2000, lgr = Math.log10(HI / LO);
        const X = v => x0 + (x1 - x0) * clamp(Math.log10(Math.max(v, LO) / LO) / lgr, 0, 1);
        const y1 = geo.y1, rh = geo.rh;
        kit.label(c, 'blur diameter at the best focus (µm, log scale)', 10, 12, { size: 11, color: C.faint });
        for (const v of [1, 10, 100, 1000]) { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(X(v), y1 - 8); c.lineTo(X(v), y1 + LIST.length * rh); c.stroke(); kit.label(c, String(v), X(v), 26, { align: 'center', size: 10, color: C.muted }); }
        const verdict = [];
        LIST.forEach(([id, nm], i) => {
          const y = y1 + i * rh, r = res[i];
          const fits = r.on.frac < 0.1 && (!r.off || r.off.frac < 0.25);
          const dOn = 2 * r.on.rms * 1e3, dOff = r.off ? 2 * r.off.rms * 1e3 : null;
          const pass = fits && dOn <= V.tgt && (dOff == null || dOff <= V.tgt);
          verdict.push(pass);
          if (i === sel) { c.fillStyle = C.surface; c.fillRect(4, y, W - 8, rh); }
          kit.label(c, nm, x0 - 8, y + rh / 2, { align: 'right', size: 11, weight: i === sel ? 700 : 500 });
          if (!fits) { kit.label(c, 'the beam does not fit this design at ' + fN(V.N), x0 + 6, y + rh / 2, { size: 10.5, color: C.faint }); return; }
          c.fillStyle = C.accent; c.fillRect(x0, y + 3, Math.max(1.5, X(dOn) - x0), 8);
          if (dOff != null) { c.fillStyle = C.series[3]; c.fillRect(x0, y + 13, Math.max(1.5, X(dOff) - x0), 8); }
          kit.label(c, pass ? '✓' : '✗', W - 22, y + rh / 2, { align: 'center', size: 14, weight: 700, color: pass ? C.ok : C.bad });
        });
        c.save(); c.setLineDash([5, 4]); c.lineWidth = 1.5; c.strokeStyle = C.muted; c.beginPath(); c.moveTo(X(airy), y1 - 8); c.lineTo(X(airy), y1 + LIST.length * rh); c.stroke();
        c.setLineDash([]); c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(X(V.tgt), y1 - 8); c.lineTo(X(V.tgt), y1 + LIST.length * rh); c.stroke(); c.restore();
        const gl = y1 + LIST.length * rh + 12;
        kit.label(c, 'Airy ' + fUm(airy), clamp(X(airy), x0 + 30, x1 - 80), gl, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'accept ' + fUm(V.tgt), clamp(X(V.tgt), x0 + 30, W - 40), gl + 13, { align: 'center', size: 10.5, color: C.ok });
        kit.label(c, 'top bar: on the axis · lower bar: ' + V.fld.toFixed(1) + '° off axis', 10, gl + 27, { size: 10, color: C.faint });
        // the spot diagrams of the clicked lens
        const r = res[sel], sy = gl + 52, half = Math.max(24, Math.min(58, (Hh - sy - 24) / 2, (W / 2 - 40)));
        const rad = sp => { let m = 0; for (const p of sp.pts) m = Math.max(m, Math.hypot(p[0] - sp.cx, p[1] - sp.cy)); return m; };
        const mm = Math.max(rad(r.on), r.off ? rad(r.off) : 0, airy * 1e-3 / 2, 1e-4) * 1.15, scale = half / mm;
        const cx1 = W * 0.27, cx2 = W * 0.73, cy = sy + half;
        S.spot(c, r.on, cx1, cy, half, scale, { airy: airy * 1e-3 / 2, nm: white ? 560 : 588 });
        kit.label(c, 'on the axis', cx1, cy + half + 12, { align: 'center', size: 10.5, color: C.muted });
        if (r.off) { S.spot(c, r.off, cx2, cy, half, scale, { airy: airy * 1e-3 / 2, nm: white ? 560 : 588 }); kit.label(c, V.fld.toFixed(1) + '° off axis', cx2, cy + half + 12, { align: 'center', size: 10.5, color: C.muted }); }
        kit.label(c, 'box ' + fUm(2 * mm * 1e3) + ' across', W / 2, sy - 8, { align: 'center', size: 10, color: C.faint });
        const names = LIST.filter((l, i) => verdict[i]).map(l => l[1]);
        ro.set('airy', fUm(airy));
        ro.set('sel', LIST[sel][1] + ': ' + fUm(2 * r.on.rms * 1e3) + (r.off ? ', ' + fUm(2 * r.off.rms * 1e3) + ' off axis' : '') + (r.on.frac >= 0.1 ? ' (beam clipped)' : ''));
        ro.set('ok', names.length ? names.join(', ') : 'none');
        ro.set('best', names.length ? names[0] : 'none of these: a better design or a smaller field, aperture or target');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ tolerances and compensators */
  Hyper.sim('us-tolerances', {
    title: 'Tolerances: what the depth of focus will forgive',
    blurb: `On the sensor side of the lens the picture is a **focus map**: the vertical line is where the lens really forms its image, the green band is the **depth of focus** (the focus error that costs no more than one pixel of blur, ±N_w · 1 pixel), and the slanted line is the sensor. Where the sensor line is inside the band the picture is sharp; where it leaves the band (red) it is soft. The bars below turn each error into blur, in pixels, and add them in quadrature. The map adds the errors in the worst way; the bars add them in quadrature, as a tolerance budget does for independent errors. A 1/1.8″ sensor (7.18 mm wide, 3.45 µm pixels) is assumed.

**Try this**
- Tilt the sensor to 0.5°: the line leans out of the green band at both edges, one in front of the image and one behind it. Tick **Refocus**: the error at the centre goes to zero, but the tilt remains. The whole tilt budget is only about ±0.27°.
- Move the **working distance** error to 0.4 mm: it costs about as much as a 16 µm focus error at the sensor, because a distance error on the object side is turned into m² times as much on the sensor side. At a magnification of 0.2 the part may move 25 times more than the sensor.
- Raise the magnification to 1: the m² leverage disappears and the part's tolerance is as tight as the sensor's.
- Decentre the lens by 100 µm: the picture does not blur, it *moves* by (1 + m) times the decentre. A decentre matters for where things land, not for focus (to first order).`,
    mount(box, kit, params) {
      const O = kit.optics, Cm = O.cam;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 400, maxH: 520 });
      const SW = 7.18, PITCH = 3.45;
      const ctl = kit.controls(box.side, [
        { id: 'N', type: 'select', label: 'Aperture', options: [2.8, 4, 5.6, 8, 11].map(v => ['f/' + v, v]), value: params.N || 4 },
        { id: 'm', label: 'Magnification', min: 0.05, max: 1, value: params.m || 0.2, log: true, sig: 2 },
        { id: 'dz', label: 'Focus error of the sensor', min: -60, max: 60, step: 1, value: 0, unit: 'µm' },
        { id: 'tilt', label: 'Tilt of the sensor', min: 0, max: 1, step: 0.01, value: 0.15, unit: '°' },
        { id: 'ds', label: 'Error of the working distance', min: -2, max: 2, step: 0.05, value: 0.2, unit: 'mm' },
        { id: 'dec', label: 'Decentre of the lens', min: 0, max: 200, step: 5, value: 20, unit: 'µm' },
        { id: 'ref', type: 'check', label: 'Refocus (the compensator) at the centre', value: !!params.ref }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dof', 'Depth of focus (one pixel of blur)'], ['edge', 'Worst focus error on the sensor'], ['rss', 'Blur from all errors (quadrature)'], ['shift', 'Image shift from the decentre'], ['tol', 'Sensor tilt allowed on its own'], ['wd', 'Working-distance error allowed on its own']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const Nw = Cm.workingFNumber(V.N, V.m), m = V.m, band = Nw * PITCH;                // depth of focus, ± µm
        const c0 = V.ref ? 0 : V.dz + m * m * V.ds * 1000, slope = Math.tan(V.tilt * D2R) * 1000;    // the focus error at the centre; µm per mm across the sensor
        const dEdge = c0 + slope * SW / 2, dMid = c0;
        // ------------- the focus map
        const top = 22, mh = Math.round(Hh * 0.44), mx0 = 52, mx1 = W - 16, my0 = top, my1 = top + mh;
        const R = Math.max(2.2 * band, 1.2 * Math.max(Math.abs(c0 + slope * SW / 2), Math.abs(c0 - slope * SW / 2)), 24);
        const X = e => mx0 + (mx1 - mx0) * (0.5 + e / (2 * R)), Y = y => (my0 + my1) / 2 - y / (SW / 2) * (mh / 2 - 6);
        c.fillStyle = C.surface; c.fillRect(mx0, my0, mx1 - mx0, mh);
        c.fillStyle = C.ok; c.globalAlpha = 0.2; c.fillRect(X(-band), my0, X(band) - X(-band), mh); c.globalAlpha = 1;
        c.strokeStyle = C.ok; c.lineWidth = 1; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(-band), my0); c.lineTo(X(-band), my1); c.moveTo(X(band), my0); c.lineTo(X(band), my1); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(0), my0); c.lineTo(X(0), my1); c.stroke();
        for (let i = 0; i < 24; i++) {                                                  // the sensor line, green inside the band, red outside
          const y0 = -SW / 2 + SW * i / 24, y1 = -SW / 2 + SW * (i + 1) / 24, e0 = c0 + slope * y0, e1 = c0 + slope * y1, ok = Math.abs((e0 + e1) / 2) <= band;
          c.strokeStyle = ok ? C.ok : C.bad; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(X(e0), Y(y0)); c.lineTo(X(e1), Y(y1)); c.stroke();
        }
        c.lineCap = 'butt';
        kit.label(c, 'focus map: error along the axis (µm) across the sensor', 10, 11, { size: 10.5, color: C.faint });
        kit.label(c, '+' + SW / 2 + ' mm', mx0 - 6, Y(SW / 2) + 4, { align: 'right', size: 10, color: C.muted });
        kit.label(c, '−' + SW / 2, mx0 - 6, Y(-SW / 2) - 4, { align: 'right', size: 10, color: C.muted });
        kit.label(c, 'image', X(0), my1 + 11, { align: 'center', size: 10, color: C.muted });
        kit.label(c, '±' + band.toFixed(1) + ' µm', X(band), my1 + 11, { align: 'left', size: 10, color: C.ok });
        // ------------- the budget: blur in pixels, each error alone, then together
        const bl = e => Math.abs(e) / Nw / PITCH;                                       // blur diameter in pixels from a focus error e (µm)
        const items = [['focus error', bl(V.ref ? 0 : V.dz)], ['working distance', bl(V.ref ? 0 : m * m * V.ds * 1000)], ['sensor tilt (edge)', bl(slope * SW / 2)]];
        const tot = Math.hypot.apply(null, items.map(b => b[1]));
        const bx = 118, bw = Math.max(80, W - bx - 56), bh = 20, y1 = my1 + 38, mxp = Math.max(1.5, tot * 1.15);
        kit.label(c, 'blur from each error, in pixels', 10, y1 - 12, { size: 10.5, color: C.faint });
        items.concat([['all together', tot]]).forEach((b, i) => {
          const y = y1 + i * (bh + 6), last = i === 3;
          kit.label(c, b[0], bx - 8, y + bh / 2, { align: 'right', size: 11, weight: last ? 700 : 500 });
          c.fillStyle = C.surface; c.fillRect(bx, y, bw, bh); c.fillStyle = last ? (b[1] <= 1 ? C.ok : C.bad) : C.series[i]; c.fillRect(bx, y, Math.max(b[1] > 0 ? 1.5 : 0, bw * b[1] / mxp), bh);
          kit.label(c, b[1].toFixed(2), bx + bw + 6, y + bh / 2, { size: 11, weight: last ? 700 : 500 });
        });
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(bx + bw / mxp, y1 - 4); c.lineTo(bx + bw / mxp, y1 + 4 * (bh + 6) - 2); c.stroke();
        kit.label(c, 'budget: 1 pixel', bx + bw / mxp, y1 + 4 * (bh + 6) + 8, { align: 'center', size: 10.5, color: C.ok });
        const tiltOk = Math.atan(band * 1e-3 / (SW / 2)) * R2D, wdOk = band / (m * m) * 1e-3;
        ro.set('dof', '±' + band.toFixed(1) + ' µm at f/' + Nw.toFixed(1) + ' (working)');
        ro.set('edge', Math.max(Math.abs(dEdge), Math.abs(c0 - slope * SW / 2)).toFixed(1) + ' µm' + (V.ref ? ' (after refocusing)' : ''));
        ro.set('rss', tot.toFixed(2) + ' pixels' + (tot <= 1 ? ' — inside the budget' : ' — over the budget'));
        ro.set('shift', (V.dec * (1 + m) / PITCH).toFixed(1) + ' pixels (' + (V.dec * (1 + m)).toFixed(0) + ' µm)');
        ro.set('tol', '±' + tiltOk.toFixed(2) + '°');
        ro.set('wd', '±' + (wdOk >= 10 ? wdOk.toFixed(1) : wdOk.toFixed(2)) + ' mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ stray light in a baffled tube */
  /* A two-dimensional Monte Carlo of a tube of length L and half-height R with n vanes, open at the front and closed by the sensor
     plane at the back. Parallel light from a source phi off the axis enters across the opening; every wall and vane face scatters
     diffusely (a cosine law) and keeps a share rho of the light at each bounce. -> the share of the entering light that reaches the
     sensor (half-height b) straight (direct) or after scattering (stray), and the paths of every keepEvery-th ray. */
  function strayRun(o) {
    const L = o.L, R = o.R, a = o.a, b = o.b, n = o.n, rho = o.rho, phi = o.phi, nr = o.nr || 3000, keepEvery = o.keepEvery || 0;
    let seed = 123456789;
    const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const xs = [], ap = [];
    for (let k = 0; k < n; k++) { const x = L * (k + 1) / (n + 1); xs.push(x); ap.push(a + (b - a) * x / L + 1.5); }     // each vane just clears the picture-forming beam
    const dx0 = Math.cos(phi), dy0 = Math.sin(phi);
    let direct = 0, stray = 0; const paths = [];
    for (let i = 0; i < nr; i++) {
      let x = 0, y = -R + 2 * R * (i + 0.5) / nr, dx = dx0, dy = dy0, w = 1, bounces = 0, hit = false;
      const pts = keepEvery && i % keepEvery === 0 ? [[x, y]] : null;
      for (let step = 0; step < 16; step++) {
        let tB = Infinity, kind = 0;
        if (dy > 1e-12) { const t = (R - y) / dy; if (t > 1e-9 && t < tB) { tB = t; kind = 1; } }
        else if (dy < -1e-12) { const t = (-R - y) / dy; if (t > 1e-9 && t < tB) { tB = t; kind = 2; } }
        if (Math.abs(dx) > 1e-12) {
          for (let k = 0; k < xs.length; k++) { const t = (xs[k] - x) / dx; if (t > 1e-9 && t < tB) { const yy = y + t * dy; if (Math.abs(yy) >= ap[k] && Math.abs(yy) <= R) { tB = t; kind = 3; } } }
          const tEnd = dx > 0 ? (L - x) / dx : (0 - x) / dx;
          if (tEnd > 1e-9 && tEnd < tB) { tB = tEnd; kind = dx > 0 ? 4 : 5; }
        }
        if (!isFinite(tB)) break;
        x += dx * tB; y += dy * tB;
        if (pts) pts.push([x, y]);
        if (kind === 5) break;                                                   // out of the front again
        if (kind === 4 && Math.abs(y) <= b) { if (bounces === 0) direct += w; else stray += w; hit = true; break; }
        let nx, ny;
        if (kind === 1) { nx = 0; ny = -1; } else if (kind === 2) { nx = 0; ny = 1; } else if (kind === 3) { nx = dx > 0 ? -1 : 1; ny = 0; } else { nx = -1; ny = 0; }
        w *= rho; bounces++;
        if (w < 1e-6) break;
        const th = Math.asin(2 * rnd() - 1), cs = Math.cos(th), sn = Math.sin(th);
        dx = nx * cs - ny * sn; dy = ny * cs + nx * sn;
        x += nx * 1e-6; y += ny * 1e-6;
      }
      if (pts) paths.push({ pts, hit });
    }
    return { direct: direct / nr, stray: stray / nr, paths };
  }

  Hyper.sim('us-stray', {
    title: 'Stray light in a baffled tube',
    blurb: `A bright source shines into a lens tube from the side of the field. Its light cannot form an image, but it strikes the wall, scatters in every direction, and some of it ends on the sensor as a veil. The tube is drawn in section; the **vanes** are thin plates that just clear the picture-forming beam (the shaded cone). Four thousand rays are traced through every bounce (sixteen are drawn; the red ones reach the sensor). The bars compare the share of the entering light that reaches the sensor *after scattering*, with no vanes and with the vanes you chose, on a log scale. This is a flat model: real walls reflect more at grazing angles, and real tubes have threads, edges and glossy parts.

**Try this**
- Start with the bare metal tube and three vanes: the stray light falls from about 1.9 % to about 0.19 %, ten times less, because most of the lit wall can no longer see the sensor. Add more vanes: it keeps falling.
- Switch the inside to **black anodised** or **matt black paint**: every bounce keeps only a fraction of the light, so after two or three bounces the stray light is down by a factor of 100 to 500 compared with bare metal. Blackening and vanes multiply.
- Move the source to 10°: it is now almost in the field and a share of the light reaches the sensor *directly*; no baffle helps, because that is light the lens would image as a bright object.
- Compare the levers at 35°: matt black paint alone buys a factor of about 25, three vanes alone about 10, and both together a few thousand.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 390, maxH: 500 });
      const L = 120, R = 20, A = 14, B = 6;
      const ctl = kit.controls(box.side, [
        { id: 'phi', label: 'Angle of the bright source from the axis', min: 8, max: 80, step: 1, value: params.phi || 35, unit: '°' },
        { id: 'n', label: 'Vanes in the tube', min: 0, max: 10, step: 1, value: params.n != null ? params.n : 3 },
        { id: 'rho', type: 'select', label: 'Inside of the tube', options: [['Bare machined metal (keeps ≈ 55 %)', 0.55], ['Black anodised (≈ 10 %)', 0.1], ['Matt black paint (≈ 5 %)', 0.05], ['Special black coating (≈ 1 %)', 0.01]], value: params.rho || 0.55 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['no', 'Stray light with no vanes'], ['yes', 'Stray light with your vanes'], ['cut', 'Reduction by the vanes'], ['direct', 'Light reaching the sensor straight'], ['seen', 'The sensor sees a source inside']]);
      const cache = new Map();
      const get = (n, rho, phi, keep) => { const k = [n, rho, phi, keep].join(); let r = cache.get(k); if (!r) { r = strayRun({ L, R, a: A, b: B, n, rho, phi: phi * D2R, nr: 4000, keepEvery: keep }); cache.set(k, r); if (cache.size > 60) cache.delete(cache.keys().next().value); } return r; };
      const pctTxt = f => (f <= 0 ? '≈ 0' : f * 100 >= 10 ? (f * 100).toFixed(0) : f * 100 >= 0.1 ? (f * 100).toFixed(2) : f * 100 >= 0.001 ? (f * 100).toFixed(4) : '< 0.001') + ' %';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const cur = get(V.n, V.rho, V.phi, 250), none = V.n === 0 ? cur : get(0, V.rho, V.phi, 0);
        // the tube
        const Ht = Math.round(Hh * 0.56), sx = (W - 28) / (L + 46), sy = Math.min(sx, (Ht / 2 - 10) / (R + 3)), y0 = Ht / 2 + 4, X = x => 14 + (x + 40) * sx, Y = y => y0 - y * sy;
        c.save(); c.beginPath(); c.rect(0, 0, W, Ht + 8); c.clip();
        c.fillStyle = S.glass(0.2); c.beginPath(); c.moveTo(X(0), Y(A)); c.lineTo(X(L), Y(B)); c.lineTo(X(L), Y(-B)); c.lineTo(X(0), Y(-A)); c.closePath(); c.fill();
        S.axis(c, X(-40), y0, X(L + 4));
        for (const p of cur.paths) {
          const hit = p.hit, e0 = p.pts[0];
          c.strokeStyle = hit ? C.bad : C.warn; c.lineWidth = hit ? 1.8 : 0.9; c.globalAlpha = hit ? 1 : 0.5;
          c.beginPath(); c.moveTo(X(e0[0] - 40 * Math.cos(V.phi * D2R)), Y(e0[1] - 40 * Math.sin(V.phi * D2R)));
          for (const q of p.pts) c.lineTo(X(q[0]), Y(q[1]));
          c.stroke();
        }
        c.globalAlpha = 1;
        c.strokeStyle = C.text; c.lineWidth = 3; c.lineCap = 'round';
        c.beginPath(); c.moveTo(X(0), Y(R)); c.lineTo(X(L), Y(R)); c.moveTo(X(0), Y(-R)); c.lineTo(X(L), Y(-R)); c.stroke();
        c.strokeStyle = C.muted; c.lineWidth = 2.6;
        for (let k = 0; k < V.n; k++) { const x = L * (k + 1) / (V.n + 1), ap = A + (B - A) * x / L + 1.5; c.beginPath(); c.moveTo(X(x), Y(ap)); c.lineTo(X(x), Y(R)); c.moveTo(X(x), Y(-ap)); c.lineTo(X(x), Y(-R)); c.stroke(); }
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(X(L), Y(R)); c.lineTo(X(L), Y(B)); c.moveTo(X(L), Y(-R)); c.lineTo(X(L), Y(-B)); c.stroke();
        c.restore();
        S.sensor(c, X(L), y0, B * sy, { pixels: 6 });
        kit.label(c, 'bright source ' + V.phi + '° off axis', 10, 12, { size: 11, color: C.warn, weight: 650 });
        kit.label(c, 'sensor', W - 8, y0 - B * sy - 14, { align: 'right', size: 10.5, color: C.muted });
        kit.label(c, 'picture-forming beam', X(L * 0.45), Y(A * 0.55) + 4, { align: 'center', size: 10, color: C.faint });
        // the bars, on a log scale
        const by = Ht + 30, bx = 108, bw = Math.max(80, W - bx - 100), bh = 22, LO = 1e-6, lgr = 5;               // from 10⁻⁶ to 10⁻¹ of the entering light
        kit.label(c, 'stray light on the sensor, share of the entering light (log scale)', 10, by - 14, { size: 10.5, color: C.faint });
        const bars = [['no vanes', none.stray, C.series[3]], [V.n + ' vane' + (V.n === 1 ? '' : 's'), cur.stray, C.accent]];
        for (let k = 0; k <= lgr; k++) { const x = bx + bw * k / lgr; c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x, by - 4); c.lineTo(x, by + 2 * (bh + 8)); c.stroke(); kit.label(c, k === lgr ? '10 %' : k === lgr - 1 ? '1 %' : k === lgr - 2 ? '0.1 %' : k === lgr - 3 ? '0.01 %' : '', x, by + 2 * (bh + 8) + 8, { align: 'center', size: 9.5, color: C.muted }); }
        bars.forEach((b, i) => {
          const y = by + i * (bh + 8), v = b[1], len = v > 0 ? clamp((Math.log10(v) - Math.log10(LO)) / lgr, 0, 1) : 0;
          kit.label(c, b[0], bx - 8, y + bh / 2, { align: 'right', size: 11.5, weight: i ? 700 : 500 });
          c.fillStyle = C.surface; c.fillRect(bx, y, bw, bh); c.fillStyle = b[2]; c.fillRect(bx, y, Math.max(v > 0 ? 1.5 : 0, bw * len), bh);
          kit.label(c, pctTxt(v), bx + bw + 6, y + bh / 2, { size: 11, weight: i ? 700 : 500 });
        });
        const seen = Math.atan((B + R) / L) * R2D;
        ro.set('no', pctTxt(none.stray));
        ro.set('yes', pctTxt(cur.stray));
        ro.set('cut', V.n === 0 ? 'none (no vanes)' : cur.stray > 1e-7 ? '× ' + (none.stray / cur.stray).toFixed(none.stray / cur.stray >= 100 ? 0 : 1) : 'more than × ' + Math.round(none.stray / 1e-7));
        ro.set('direct', cur.direct > 0 ? pctTxt(cur.direct) + ' — a bright object in the picture' : 'none');
        ro.set('seen', 'up to about ' + seen.toFixed(0) + '° off axis');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ testing a finished system */
  Hyper.sim('us-commissioning', {
    title: 'Four acceptance tests of a finished system',
    blurb: `Choose a test from the list. **Bar target**: a USAF-style chart imaged at 1:1; each tile is one element, and the contrast of its bars is the system MTF at that fineness (a schematic: the drawn bars lose contrast, they do not blur). The last element still read, at 20 % contrast, is the system's *resolution*. **Distortion grid**: a square grid imaged through a lens with radial distortion (barrel for negative k, pincushion for positive); the dashed grid is the ideal. **Flat field**: a uniform white card as the system sees it: the cos⁴ law, mechanical vignetting and a tilted lamp give a profile that a flat-field correction divides out, at a price in noise. **Focus over temperature**: how far the focus drifts as a lens warms or cools, for glass and acrylic lenses in metal and plastic barrels, against the depth of focus.

**Try this**
- *Bar target*: close the aperture from f/4 to f/16. The last element read falls from 7.1 (128 lp/mm) to 5.2 (36 lp/mm), nearly two groups, because the diffraction MTF sinks. Back at f/4, add 100 µm of focus error and it falls by a whole group, to 6.1.
- *Distortion grid*: set k to −0.10: the corner moves in by 10 %. A checkerboard measures k and software removes it; hardware cannot.
- *Flat field*: raise the half-angle to 35°: the corners keep only about 45 % of the centre's light from cos⁴ alone. Switch the correction on: the picture is flat, but the corners are noisier.
- *Focus over temperature*: warm an acrylic lens in a plastic barrel by 40 K. The focus drifts by more than ten times the depth of focus, where a glass lens in a steel barrel stays close. This is why plastic phone lenses are athermalized, and why a factory test must run hot and cold.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Mt = O.mtf, Cm = O.cam;
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 330, maxH: 450 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'lp/mm', name: 'ν', min: 0, max: 200 }, y: { label: 'MTF', name: 'MTF', min: 0, max: 1.02 }, series: [] }, 130);
      const MODES = [['Bar target', 'bar'], ['Distortion grid', 'grid'], ['Flat field', 'flat'], ['Focus over temperature', 'heat']];
      const ctl = kit.controls(box.side, [
        { id: 'test', type: 'select', label: 'Test', options: MODES, value: params.test || 'bar' },
        { id: 'N', type: 'select', label: 'Aperture', options: [2.8, 4, 5.6, 8, 11, 16, 22].map(v => ['f/' + v, v]), value: params.N || 5.6 },
        { id: 'p', label: 'Pixel pitch', min: 1.4, max: 9, step: 0.05, value: 3.45, unit: 'µm' },
        { id: 'dz', label: 'Focus error', min: 0, max: 100, step: 1, value: 0, unit: 'µm' },
        { id: 'k1', label: 'Distortion k (edge of the field)', min: -0.3, max: 0.3, step: 0.01, value: -0.08 },
        { id: 'grid', type: 'check', label: 'Show the ideal grid', value: true },
        { id: 'fov', label: 'Half-angle at the corner', min: 5, max: 40, step: 1, value: 28, unit: '°' },
        { id: 'vig', label: 'Mechanical vignetting at the corner', min: 0, max: 60, step: 1, value: 10, unit: '%' },
        { id: 'lamp', label: 'Lamp tilt across the card', min: 0, max: 30, step: 1, value: 6, unit: '%' },
        { id: 'ffc', type: 'check', label: 'Flat-field correction on', value: false },
        { id: 'dT', label: 'Temperature change', min: -40, max: 60, step: 1, value: 30, unit: 'K' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const R = {
        bar: kit.readout(box.side, [['lim', 'Last element read (20 % contrast)'], ['lp', 'on the chart'], ['nyq', 'Nyquist of the sensor'], ['mtf', 'System MTF at Nyquist']]),
        grid: kit.readout(box.side, [['edge', 'Distortion at the corner'], ['mid', 'at the middle of an edge'], ['bow', 'A straight edge line bows by']]),
        flat: kit.readout(box.side, [['cc', 'Corner signal against the centre'], ['ratio', 'Brightest to darkest point'], ['gain', 'Gain the correction needs in the corner']]),
        heat: kit.readout(box.side, [['a', 'Glass lens, aluminium barrel'], ['b', 'Glass lens, steel barrel'], ['c', 'Acrylic lens, aluminium barrel'], ['d', 'Acrylic lens, plastic barrel'], ['dof', 'Depth of focus (one pixel)']])
      };
      function vis() {
        const t = V.test;
        for (const id of ['dz']) ctl.show(id, t === 'bar');
        ctl.show('k1', t === 'grid'); ctl.show('grid', t === 'grid');
        for (const id of ['fov', 'vig', 'lamp', 'ffc']) ctl.show(id, t === 'flat');
        ctl.show('dT', t === 'heat'); ctl.show('N', t === 'bar' || t === 'heat'); ctl.show('p', t === 'bar' || t === 'heat');
        for (const k of Object.keys(R)) R[k].show(k === t);
        gb.style.display = t === 'grid' ? 'none' : '';
      }
      // the USAF elements: group g, element e -> lp/mm (O.mtf.usaf)
      const USAF = []; for (let g = 1; g <= 9; g++) for (let e = 1; e <= 6; e++) USAF.push({ g, e, v: Mt.usaf(g, e) });
      const FL = 25, COMBO = [['Glass + aluminium', 'N-BK7', 23e-6, C0 => C0.series[0]], ['Glass + steel', 'N-BK7', 12e-6, C0 => C0.series[1]], ['Acrylic + aluminium', 'PMMA', 23e-6, C0 => C0.series[2]], ['Acrylic + plastic', 'PMMA', 40e-6, C0 => C0.series[3]]];
      // the focus error of a thin equiconvex lens of focal length FL at 20 °C, warmed by dT, in a barrel that expands as well
      const drift = (matId, aBar, dT) => {
        const n0 = O.index(matId, 550), mat = O.MATERIALS[matId], R0 = 2 * (n0 - 1) * FL, a = (mat.cte || 0) * 1e-6, nT = n0 + (mat.dndt || 0) * 1e-6 * dT;
        const fT = O.lensmaker(nT, R0 * (1 + a * dT), -R0 * (1 + a * dT), 0);
        return (fT - FL * (1 + aBar * dT)) * 1000;                                  // µm: the image behind (+) or in front of (−) the sensor
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, t = V.test;
        if (t === 'bar') {
          const Nw = 2 * V.N, nyq = Mt.nyquist(V.p);
          const sysM = nu => Mt.diffraction(nu, 550, Nw) * Mt.pixel(nu, V.p) * Mt.defocus(nu, V.dz / Nw * 1e-3);
          let lim = USAF.findIndex(u => sysM(u.v) < 0.2); if (lim < 0) lim = USAF.length - 1;
          const i0 = clamp(lim - 5, 0, USAF.length - 8), tw = (W - 20) / 8, th = Math.min(84, Hh * 0.3), ty = 30;
          kit.label(c, 'USAF elements imaged at 1:1 — group.element, lines per millimetre', 10, 12, { size: 10.5, color: C.faint });
          for (let i = 0; i < 8; i++) {
            const u = USAF[i0 + i], x = 10 + i * tw, m = sysM(u.v), ok = i0 + i < lim;
            S.image(c, x + 2, ty, tw - 6, th, 56, 1, uu => { const k = Math.floor(uu * 7); return 0.5 + (0.5 - (k % 2 === 1 && k < 6 ? 1 : 0)) * m; }, { gamma: 1, smooth: false, key: m.toFixed(3), id: 'tile' + i });
            c.strokeStyle = ok ? C.ok : C.bad; c.lineWidth = 2; c.strokeRect(x + 2, ty, tw - 6, th);
            kit.label(c, u.g + '.' + u.e, x + tw / 2 - 1, ty + th + 11, { align: 'center', size: 11.5, weight: 700, color: ok ? C.text : C.bad });
            kit.label(c, u.v.toFixed(u.v >= 100 ? 0 : 1), x + tw / 2 - 1, ty + th + 25, { align: 'center', size: 10, color: C.muted });
            kit.label(c, 'MTF ' + m.toFixed(2), x + tw / 2 - 1, ty + th + 38, { align: 'center', size: 9.5, color: C.faint });
            if (u.v > nyq) kit.label(c, 'above Nyquist', x + tw / 2 - 1, ty + th + 50, { align: 'center', size: 9.5, color: C.warn });
          }
          const last = USAF[Math.max(0, lim - 1)];
          const nuMax = clamp(1.4 * nyq, 60, 400), pts = fn => { const a = []; for (let i = 0; i <= 120; i++) { const nu = nuMax * i / 120; a.push([nu, fn(nu)]); } return a; };
          plot.set({ x: { label: 'lp/mm', name: 'ν', min: 0, max: nuMax }, y: { label: 'MTF', name: 'MTF', min: 0, max: 1.02 },
            series: [{ pts: pts(nu => Mt.diffraction(nu, 550, Nw)), label: 'diffraction', color: C.series[0], dash: true, width: 1.3 }, { pts: pts(nu => Mt.pixel(nu, V.p)), label: 'pixel', color: C.series[2], dash: true, width: 1.3 }, { pts: pts(nu => Mt.defocus(nu, V.dz / Nw * 1e-3)), label: 'focus error', color: C.series[3], dash: true, width: 1.3 }, { pts: pts(sysM), label: 'system', color: C.text, width: 3 }],
            vlines: [{ x: nyq, label: 'Nyquist' }], hlines: [{ y: 0.2, label: '20 %' }] });
          R.bar.set('lim', 'group ' + last.g + ', element ' + last.e);
          R.bar.set('lp', last.v.toFixed(1) + ' lp/mm (bars ' + (500 / last.v).toFixed(1) + ' µm wide)');
          R.bar.set('nyq', nyq.toFixed(0) + ' lp/mm');
          R.bar.set('mtf', sysM(nyq).toFixed(2));
        } else if (t === 'grid') {
          const s = Math.min(W - 30, Hh - 56), cx = W / 2, cy = Hh / 2 + 4, k1 = V.k1, NL = 11;
          const dist = (x, y) => { const r = Math.hypot(x, y) / Math.SQRT2, f = r < 1e-9 ? 1 : Cm.distortion(r, k1, 0) / r; return [x * f, y * f]; };
          const P = (x, y) => [cx + x * s / 2, cy + y * s / 2];
          c.save(); c.beginPath(); c.rect(cx - s / 2, cy - s / 2, s, s); c.clip();
          c.fillStyle = C.surface; c.fillRect(cx - s / 2, cy - s / 2, s, s);
          const line = (fn, col, w, dash) => { c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash || []); for (let i = 0; i < NL; i++) { const a = -1 + 2 * i / (NL - 1); c.beginPath(); for (let j = 0; j <= 40; j++) { const b = -1 + 2 * j / 40, q = fn(a, b), p = P(q[0], q[1]); if (j) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); } c.stroke(); } };
          if (V.grid) { line((a, b) => [a, b], C.faint, 1, [4, 4]); line((a, b) => [b, a], C.faint, 1, [4, 4]); }
          line((a, b) => dist(a, b), C.accent, 1.7); line((a, b) => dist(b, a), C.accent, 1.7);
          c.restore();
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(cx - s / 2, cy - s / 2, s, s);
          const rm = 1 / Math.SQRT2, ymid = dist(0, 1)[1], ycor = dist(1, 1)[1];
          kit.label(c, k1 < -0.002 ? 'barrel distortion' : k1 > 0.002 ? 'pincushion distortion' : 'no distortion', 10, 12, { size: 11.5, weight: 650 });
          R.grid.set('edge', (100 * Cm.distortionPercent(k1, 0) / 100).toFixed(1) + ' %');
          R.grid.set('mid', (100 * k1 * rm * rm).toFixed(1) + ' %');
          R.grid.set('bow', Math.abs(100 * (ymid - ycor)).toFixed(1) + ' % of the half-height');
        } else if (t === 'flat') {
          const fov = V.fov * D2R, vig = V.vig / 100, lamp = V.lamp / 100, hw = Math.hypot(1, 0.75);
          const meas = (x, y) => { const r = Math.hypot(x, y * 0.75) / hw, th = Math.atan(r * Math.tan(fov)); return Cm.cos4(th) * (1 - vig * r * r) * (1 + lamp * x) / (1 + lamp); };
          const pw = Math.min(W * 0.5, 230), ph = pw * 0.75, px = 12, py = 26;
          S.image(c, px, py, pw, ph, 64, 48, (u, v) => { const x = 2 * u - 1, y = 2 * v - 1, m0 = meas(x, y); const noise = (hash(u * 977 + v * 31.3) - 0.5) * 0.06; return V.ffc ? 0.78 + noise / Math.max(m0, 0.2) * 0.5 : m0 * 0.95 + noise * 0.4 * Math.sqrt(m0); }, { gamma: 1, smooth: true, key: [V.fov, V.vig, V.lamp, V.ffc].join(), id: 'flat' });
          c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(px, py, pw, ph);
          kit.label(c, 'a uniform white card as imaged', 10, 12, { size: 10.5, color: C.faint });
          kit.label(c, V.ffc ? 'corrected: flat, but noisier in the corners' : 'as recorded: bright centre, dark corner', px, py + ph + 14, { size: 10.5, color: C.muted });
          const xs = px + pw + 14, lines2 = ['cos⁴ at the corner: ' + fPct(Cm.cos4(Math.atan(Math.tan(fov)))), 'vignetting: ' + V.vig + ' %', 'lamp tilt: ± ' + V.lamp + ' %'];
          lines2.forEach((tx, i) => kit.label(c, tx, xs, py + 12 + i * 18, { size: 11, color: C.muted }));
          const pts = [], pc = [], N0 = 60;
          for (let i = 0; i <= N0; i++) { const x = -1 + 2 * i / N0, m = meas(x, 0); pts.push([x, m]); pc.push([x, 1]); }
          plot.set({ x: { label: 'position across the image', name: 'x', min: -1, max: 1 }, y: { label: 'signal', name: 'S', min: 0, max: 1.1 }, series: V.ffc ? [{ pts: pc, label: 'corrected', color: C.ok, width: 2.4 }, { pts, label: 'as recorded', color: C.faint, dash: true, width: 1.4 }] : [{ pts, label: 'as recorded', color: C.accent, width: 2.6 }, { pts: pc, label: 'ideal', color: C.faint, dash: true, width: 1.2 }] });
          let mn = 9, mx = 0; for (let j = 0; j <= 24; j++) for (let i = 0; i <= 24; i++) { const m = meas(-1 + i / 12, -1 + j / 12); mn = Math.min(mn, m); mx = Math.max(mx, m); }
          const cc = meas(1, 1) / meas(0, 0);
          R.flat.set('cc', fPct(cc) + ' (brightest corner ' + fPct(meas(1, 1) / meas(0, 0)) + ')');
          R.flat.set('ratio', (mx / mn).toFixed(2) + ' : 1');
          R.flat.set('gain', '× ' + (mx / mn).toFixed(2) + ' on the darkest corner: its noise grows by the same factor');
        } else {
          const band = V.N * V.p, dT = V.dT, vals = COMBO.map(cb => drift(cb[1], cb[2], dT));
          const mx = Math.max(2.2 * band, 1.15 * Math.max.apply(null, vals.map(Math.abs)), 10);
          const bx = 134, bw = Math.max(80, W - bx - 74), bh = 22, y1 = 36, X = v => bx + bw * (0.5 + v / (2 * mx));
          kit.label(c, 'focus error at ' + (dT >= 0 ? '+' : '−') + Math.abs(dT) + ' K for a ' + FL + ' mm lens (µm)', 10, 12, { size: 10.5, color: C.faint });
          c.fillStyle = C.ok; c.globalAlpha = 0.18; c.fillRect(X(-band), y1 - 6, X(band) - X(-band), 4 * (bh + 8) + 2); c.globalAlpha = 1;
          kit.label(c, '±' + band.toFixed(1) + ' µm', X(band), y1 - 12, { size: 9.5, color: C.ok, align: 'left' });
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(0), y1 - 6); c.lineTo(X(0), y1 + 4 * (bh + 8) - 4); c.stroke();
          COMBO.forEach((cb, i) => {
            const y = y1 + i * (bh + 8), v = vals[i], ok = Math.abs(v) <= band;
            kit.label(c, cb[0], bx - 8, y + bh / 2, { align: 'right', size: 11, weight: 500 });
            c.fillStyle = ok ? C.ok : C.bad; c.fillRect(Math.min(X(0), X(v)), y + 3, Math.max(1.5, Math.abs(X(v) - X(0))), bh - 6);
            kit.label(c, (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(Math.abs(v) < 100 ? 1 : 0), Math.min(X(v), W - 40) + (v >= 0 ? 6 : -6), y + bh / 2, { size: 11, weight: 650, align: v >= 0 ? 'left' : 'right', color: ok ? C.text : C.bad });
          });
          kit.label(c, '+ means the image falls behind the sensor', 10, y1 + 4 * (bh + 8) + 8, { size: 10, color: C.faint });
          const pts = (cb) => { const a = []; for (let k = -40; k <= 60; k += 5) a.push([k, drift(cb[1], cb[2], k)]); return a; };
          plot.set({ x: { label: 'ΔT (K)', name: 'ΔT', min: -40, max: 60 }, y: { label: 'focus error (µm)', name: 'δ', min: -Math.max(40, 1.2 * Math.max.apply(null, [-40, 60].map(k => Math.max.apply(null, COMBO.map(cb => Math.abs(drift(cb[1], cb[2], k))))))), max: Math.max(40, 1.2 * Math.max.apply(null, [-40, 60].map(k => Math.max.apply(null, COMBO.map(cb => Math.abs(drift(cb[1], cb[2], k))))))) },
            series: COMBO.map(cb => ({ pts: pts(cb), label: cb[0], color: cb[3](C), width: 2 })), hlines: [{ y: band, label: '±' + band.toFixed(0) }, { y: -band }], vlines: [{ x: dT, label: '' }] });
          ['a', 'b', 'c', 'd'].forEach((k, i) => R.heat.set(k, (vals[i] >= 0 ? '+' : '−') + Math.abs(vals[i]).toFixed(1) + ' µm' + (Math.abs(vals[i]) <= band ? ' — inside' : ' — out of focus')));
          R.heat.set('dof', '±' + band.toFixed(1) + ' µm (f/' + V.N + ', ' + V.p.toFixed(2) + ' µm pixels)');
        }
      }, box.stage);
      vis();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the abbreviations of optics */
  // [abbreviation, what it stands for, family, the page that explains it] — the same rows as the table on the page
  const FAMILIES = [["optics","Lenses, stops and systems"],["camera","Cameras, sensors and imaging"],["coating","Coatings, materials and surfaces"],["light","Light, lasers and fibre"],["eye","The eye, spectacles and optometry"],["measure","Testing, standards and measurement"]];
  const ABBR = [
  ["AOI","angle of incidence (coatings and filters), area of interest (sensors) or automated optical inspection (manufacturing): three unrelated meanings","optics","angle-of-incidence-and-coatings"],
  ["BFL","back focal length: from the last lens surface to the focal point","optics","cardinal-points"],
  ["BS","beam splitter","optics","beam-splitters"],
  ["CA","clear aperture (the usable diameter of a part) or chromatic aberration (colour-dependent focus)","optics","reading-an-optics-catalogue"],
  ["DCX, DCV","double-convex and double-concave lens","optics","catalogue-lens-types"],
  ["PCX, PCV","plano-convex and plano-concave lens","optics","catalogue-lens-types"],
  ["EFL","effective focal length: the focal length of the lens as a whole","optics","focal-length-and-optical-power"],
  ["ED","extra-low dispersion glass, used against colour fringes","optics","apochromats-and-ed-glass"],
  ["EPD","entrance pupil diameter: the opening as seen from the front","optics","entrance-and-exit-pupils"],
  ["FOV","field of view, also HFOV, VFOV, DFOV (horizontal, vertical, diagonal)","optics","field-of-view-and-focal-length"],
  ["f/#","f-number: focal length divided by entrance-pupil diameter","optics","the-f-number"],
  ["GRIN","gradient index: a refractive index that changes inside the material","optics","gradient-index-optics"],
  ["lp/mm","line pairs per millimetre: one dark and one bright line is one pair","optics","spatial-frequency-and-line-pairs"],
  ["MTF","modulation transfer function: how much contrast survives at each fineness of detail","optics","the-modulation-transfer-function"],
  ["NA","numerical aperture: n sin θ of the half-angle of the light cone","optics","numerical-aperture"],
  ["OPD","optical path difference between a real wavefront and an ideal one","optics","wavefront-error-and-zernike-polynomials"],
  ["OPL","optical path length: index times geometric distance, summed along a ray","optics","optical-path-length"],
  ["PSF","point spread function: the image of a single point of light","optics","the-point-spread-function"],
  ["RMS","root mean square, as in RMS spot radius or RMS wavefront error","optics","spot-diagrams-and-ray-fans"],
  ["ROC","radius of curvature of a surface","optics","lens-shapes-and-names"],
  ["T-stop","f-number corrected for the light the glass absorbs, used on cine lenses","optics","the-f-number"],
  ["TIR","total internal reflection: all the light stays inside the dense medium","optics","critical-angle-and-total-internal-reflection"],
  ["WD","working distance: from the front of the lens to the object","optics","magnification-and-working-distance"],
  ["WFE","wavefront error","optics","wavefront-error-and-zernike-polynomials"],
  ["AF, PDAF","autofocus, and phase-detection autofocus","camera","autofocus-methods"],
  ["BSI","back-side illumination: light enters from the side without the wiring","camera","microlenses-bsi-and-stacked-sensors"],
  ["CCD","charge-coupled device: a sensor that moves charge from pixel to pixel to one amplifier","camera","ccd-sensors"],
  ["CMOS","complementary metal-oxide semiconductor: a sensor with an amplifier in every pixel","camera","cmos-sensors"],
  ["COC","circle of confusion: the largest blur that still counts as sharp","camera","circle-of-confusion"],
  ["CRA","chief ray angle: the angle at which the central ray of a bundle meets the sensor","camera","microlenses-bsi-and-stacked-sensors"],
  ["DOF","depth of field: the range of distances that looks sharp","camera","depth-of-field"],
  ["DR","dynamic range: brightest over darkest level a sensor can record","camera","dynamic-range-and-full-well"],
  ["EMCCD, TDI","electron-multiplying CCD, and time-delay integration for moving scenes","camera","ccd-architectures"],
  ["EV","exposure value: one number for aperture and shutter time together","camera","metering-and-exposure-value"],
  ["FF","fill factor: the share of a pixel that collects light","camera","microlenses-bsi-and-stacked-sensors"],
  ["FFD","flange focal distance: from the mount face to the sensor","camera","lens-mounts-and-flange-distance"],
  ["FPN","fixed-pattern noise: the same pixel-to-pixel offsets in every frame","camera","sensor-noise"],
  ["fps","frames per second","camera","area-scan-and-line-scan-cameras"],
  ["HDR","high dynamic range: capturing more levels than one exposure holds","camera","dynamic-range-and-full-well"],
  ["IR-cut","a filter in front of a silicon sensor that blocks the near infrared","camera","quantum-efficiency-and-spectral-response"],
  ["ISO","film speed or its sensor equivalent: the gain applied to the signal","camera","iso-and-gain"],
  ["MOD","minimum object distance: the closest a lens can focus","camera","focusing-a-lens"],
  ["NETD","noise-equivalent temperature difference: the smallest temperature step a thermal camera sees","camera","infrared-and-thermal-sensors"],
  ["OIS","optical image stabilization","camera","image-stabilization"],
  ["OLPF","optical low-pass filter: blurs detail finer than the pixels to prevent aliasing","camera","nyquist-sampling-and-aliasing"],
  ["QE","quantum efficiency: the share of photons that become electrons","camera","quantum-efficiency-and-spectral-response"],
  ["ROI","region of interest: the window of the sensor that is read out","camera","binning-roi-and-area-of-interest"],
  ["SNR","signal-to-noise ratio","camera","sensor-noise"],
  ["AR","antireflection coating","coating","antireflection-coatings"],
  ["BBAR","broadband antireflection coating, working over a wide range of wavelengths","coating","antireflection-coatings"],
  ["HR","high reflector: a mirror coating for one wavelength or band","coating","dielectric-mirrors"],
  ["LIDT","laser-induced damage threshold: the fluence or power density a coating survives","coating","laser-damage-and-coating-durability"],
  ["ND","neutral density: a filter that dims every colour equally","coating","neutral-density-and-optical-density"],
  ["OD","optical density (−log₁₀ of the transmittance), the outer diameter of a part in a catalogue, or the right eye on a prescription (oculus dexter)","coating","neutral-density-and-optical-density"],
  ["CTE","coefficient of thermal expansion","coating","thermal-effects-in-optics"],
  ["V_d, ν_d","the Abbe number: how little a glass disperses colours","coating","the-abbe-number-and-glass-map"],
  ["n_d","refractive index at the helium d line, 587.6 nm","coating","optical-glass"],
  ["N-BK7","a borosilicate crown glass, the everyday optical glass","coating","optical-glass"],
  ["PMMA, COP","acrylic, and cyclo-olefin polymer: moulded optical plastics","coating","optical-plastics"],
  ["scratch-dig","two numbers for surface cosmetics, such as 60-40","coating","surface-quality-and-flatness"],
  ["λ/4, λ/10","flatness in fractions of a wavelength, or the retardance of a wave plate","coating","surface-quality-and-flatness"],
  ["QWP, HWP","quarter-wave and half-wave plate","coating","wave-plates"],
  ["PBS","polarizing beam splitter: transmits one polarization, reflects the other","coating","polarizing-beam-splitters"],
  ["DOE","diffractive optical element: a surface relief that steers light by diffraction","coating","diffractive-optical-elements"],
  ["CWL, FWHM","centre wavelength and full width at half maximum of a filter band","coating","interference-filters"],
  ["CCT","correlated colour temperature: how warm or cool a white light looks","light","colour-temperature-and-colour-rendering"],
  ["CRI","colour rendering index: how faithfully a lamp shows colours","light","colour-temperature-and-colour-rendering"],
  ["CW","continuous wave: a laser that is always on","light","continuous-and-pulsed-lasers"],
  ["LED","light-emitting diode","light","light-emitting-diodes"],
  ["lm, lx, cd, nit","lumen, lux, candela and cd/m²: the photometric units","light","lumens-candelas-lux-and-nits"],
  ["UV, VIS, IR","ultraviolet, visible and infrared light","light","the-optical-spectrum"],
  ["NIR, SWIR, LWIR","near, short-wave and long-wave infrared bands","light","infrared-and-thermal-sensors"],
  ["M²","beam quality factor: how many times a real beam diverges more than an ideal Gaussian","light","beam-quality-m-squared"],
  ["MFD","mode field diameter: the width of the light in a single-mode fibre","light","single-mode-and-multimode-fibre"],
  ["MPE","maximum permissible exposure: the safety limit of laser light at the eye or skin","light","laser-safety-classes"],
  ["PC, UPC, APC","physical-contact, ultra-physical-contact and angled polish of a fibre end","light","fibre-connectors-and-ferrules"],
  ["SLM","spatial light modulator: a pixel array that shapes the phase or amplitude of light","light","spatial-light-modulators"],
  ["TEM₀₀","the lowest transverse mode of a laser: a clean Gaussian spot","light","laser-modes"],
  ["VCSEL","vertical-cavity surface-emitting laser","light","vcsels-and-laser-arrays"],
  ["D","dioptre: optical power, 1 over the focal length in metres","eye","focal-length-and-optical-power"],
  ["OS, OU","on a prescription: left eye and both eyes (Latin oculus sinister, oculus uterque); the right eye is OD","eye","reading-a-prescription"],
  ["SPH, CYL, ADD","sphere, cylinder and reading addition of a prescription","eye","reading-a-prescription"],
  ["PD","pupillary distance between the centres of the pupils","eye","fitting-measurements-and-the-lensmeter"],
  ["PAL","progressive addition lens: a spectacle lens whose power changes smoothly","eye","progressive-lenses"],
  ["IOL","intraocular lens, implanted in the eye","eye","intraocular-lenses-and-refractive-surgery"],
  ["VA, logMAR","visual acuity, and its logarithmic scale","eye","visual-acuity-charts"],
  ["CSF","contrast sensitivity function: how faint a pattern the eye sees at each fineness","eye","contrast-sensitivity"],
  ["CVD","colour-vision deficiency","eye","colour-vision-deficiency"],
  ["EMVA 1288","the European standard for measuring and stating camera and sensor performance","measure","sensor-noise"],
  ["USAF 1951","a bar-target pattern with numbered groups and elements for resolution tests","measure","measuring-mtf"],
  ["ISO 12233","the standard for measuring resolution of cameras by the slanted edge","measure","measuring-mtf"],
  ["MTF50","the spatial frequency at which MTF has fallen to 50 %","measure","measuring-mtf"],
  ["IEC 60825-1","the international standard for laser product safety","measure","laser-safety-classes"],
  ["ISO 10110","the standard for drawings of optical parts","measure","optical-drawings-and-iso-10110"],
  ["MIL-PRF-13830B","the US military specification behind scratch-dig numbers","measure","surface-quality-and-flatness"],
  ["ΔE","colour difference in CIELAB units","measure","colour-difference-and-tolerance"],
  ["GigE, CXP","GigE Vision and CoaXPress: camera interfaces for machine vision","measure","camera-interfaces"],
  ["MV","machine vision: cameras that inspect and measure automatically","measure","the-machine-vision-system"],
  ];
  const wrap = (t, n) => { const out = []; let line = ''; for (const w of String(t).split(' ')) { if ((line + ' ' + w).trim().length > n) { out.push(line); line = w; } else line = (line + ' ' + w).trim(); } if (line) out.push(line); return out; };
  Hyper.sim('us-abbreviations', {
    title: 'Decoding the abbreviations of optics',
    blurb: `Every abbreviation of the table on this page as a chip, coloured by family. **Click a chip** to read what it stands for and which page explains it. Press **Quiz me** and the simulation reads out a meaning: click the abbreviation it belongs to. Pick one family at a time to practise a smaller set.

**Try this**
- Click **AOI**: it has three meanings, each from a different part of the subject. The same is true of OD and CA.
- Choose the family *Cameras, sensors and imaging* and run the quiz until you can answer without hesitating: CMOS, CCD, QE, ROI, FFD, DOF.
- Notice which chips sit next to each other in a family: they are the terms that appear together on a datasheet.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 1.25, minH: 510, maxH: 530 });
      const geo = { chips: [] };
      let sel = -1, quiz = null;
      const score = { right: 0, total: 0 };
      const ctl = kit.controls(box.side, [
        { id: 'fam', type: 'select', label: 'Family', options: [['All families', 'all']].concat(FAMILIES.map(f => [f[1], f[0]])), value: params.fam || 'all' },
        { type: 'buttons', items: [{ id: 'quiz', label: 'Quiz me', primary: true }, { id: 'clear', label: 'Clear' }] }
      ], id => {
        if (id === 'fam') { sel = -1; quiz = null; }
        else if (id === 'quiz') nextQuiz();
        else if (id === 'clear') { sel = -1; quiz = null; }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sel', 'Selected'], ['score', 'Quiz score'], ['count', 'Abbreviations shown']]);
      const visible = () => ABBR.map((a, i) => i).filter(i => V.fam === 'all' || ABBR[i][2] === V.fam);
      function nextQuiz() { const v = visible(); if (!v.length) return; let t = v[Math.floor(Math.random() * v.length)]; if (quiz && v.length > 1) while (t === quiz.target) t = v[Math.floor(Math.random() * v.length)]; quiz = { target: t, wrong: new Set(), done: false }; sel = -1; }
      kit.click(st, p => {
        for (const ch of geo.chips) if (p.x >= ch.x && p.x <= ch.x + ch.w && p.y >= ch.y && p.y <= ch.y + ch.h) {
          if (quiz && !quiz.done) { score.total++; if (ch.i === quiz.target) { quiz.done = true; score.right++; sel = ch.i; } else quiz.wrong.add(ch.i); }
          else sel = ch.i;
          loop.once(); return;
        }
      }, p => geo.chips.some(ch => p.x >= ch.x && p.x <= ch.x + ch.w && p.y >= ch.y && p.y <= ch.y + ch.h));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, vis = visible();
        const sz = W < 520 ? 10.5 : 11.5, ch = Math.round(sz * 2), gap = 5, x0 = 12, panel = 98;
        c.font = '600 ' + sz + 'px sans-serif';
        let x = x0, y = 10; geo.chips = [];
        const famIx = id => FAMILIES.findIndex(f => f[0] === id);
        for (const i of vis) {
          const a = ABBR[i], w = Math.ceil(c.measureText(a[0]).width) + 16;
          if (x + w > W - x0) { x = x0; y += ch + gap; }
          geo.chips.push({ i, x, y, w, h: ch });
          const fi = famIx(a[2]), isSel = i === sel, wrong = quiz && quiz.wrong.has(i), right = quiz && quiz.done && i === quiz.target;
          c.fillStyle = right ? C.ok : wrong ? C.bad : C.surface; c.globalAlpha = right || wrong ? 0.9 : 1; c.fillRect(x, y, w, ch); c.globalAlpha = 1;
          c.strokeStyle = isSel || right ? C.text : C.series[fi % 7]; c.lineWidth = isSel || right ? 2.4 : 1.4; c.strokeRect(x + 0.5, y + 0.5, w - 1, ch - 1);
          kit.label(c, a[0], x + w / 2, y + ch / 2, { align: 'center', size: sz, weight: 600, color: right || wrong ? '#ffffff' : C.text });
          x += w + gap;
        }
        // the panel at the foot: the question, or the meaning
        const py = Hh - panel, n = Math.max(24, Math.floor((W - 28) / (sz * 0.56)));
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(8, py - 6); c.lineTo(W - 8, py - 6); c.stroke();
        let head, body, foot = '';
        if (quiz && !quiz.done) { head = 'Which abbreviation means this?'; body = ABBR[quiz.target][1]; foot = quiz.wrong.size ? 'Not that one — try again (' + quiz.wrong.size + ' wrong so far).' : 'Click the chip.'; }
        else if (sel >= 0) { head = ABBR[sel][0] + (quiz && quiz.done ? '  — right!' : ''); body = ABBR[sel][1]; foot = 'Explained on: ' + ABBR[sel][3].replace(/-/g, ' ') + '  ·  ' + FAMILIES[famIx(ABBR[sel][2])][1]; }
        else { head = 'Click an abbreviation.'; body = 'Or press Quiz me to be asked what one of them stands for.'; }
        kit.label(c, head, 12, py + 8, { weight: 700, size: 12.5 });
        wrap(body, n).slice(0, 3).forEach((t, k) => kit.label(c, t, 12, py + 28 + k * 16, { size: 11.5, color: C.text }));
        if (foot) kit.label(c, foot.length > n + 8 ? foot.slice(0, n + 5) + '…' : foot, 12, py + panel - 14, { size: 10.5, color: C.muted });
        ro.set('sel', sel >= 0 ? ABBR[sel][0] : '—');
        ro.set('score', score.total ? score.right + ' right of ' + score.total + ' clicks' : '—');
        ro.set('count', String(vis.length));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
