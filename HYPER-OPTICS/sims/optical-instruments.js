/* HYPER-OPTICS · sims/optical-instruments.js — the simulations of the topic "Optical instruments".
 *   oi-visual-angle  the visual angle, the retinal image in cone spacings, and what an angular magnification does to it
 *   oi-magnifier     a lens with the object inside the focal length: virtual image, M = 250/f, the two settings
 *   oi-eyepiece      Huygens, Ramsden and Plössl as two thin lenses: field stop, apparent field, eye relief
 *   oi-microscope    objective and eyepiece (finite tube or tube lens): total magnification, Abbe limit, empty magnification
 *   oi-objective     the engraving of an objective, and the cone of light it takes through the cover glass, dry or immersed
 *   oi-contrast      one transparent specimen under bright field, dark field, phase contrast, DIC and crossed polarizers
 *   oi-fluorescence  dye spectra, the filter cube and the dichroic mirror at 45°
 *   oi-confocal      a pinhole in the image plane: what it passes from in focus and out of focus
 *   oi-refractor     Keplerian and Galilean telescopes: rays, magnification, exit pupil, limits of useful power
 *   oi-reflector     Newtonian, spherical, classical Cassegrain and Ritchey–Chrétien traced, with spot diagrams
 *   oi-exit-pupil    the exit pupil, the eye relief, and what happens when the eye is not at the exit pupil
 *   oi-relay         periscope, relay-lens borescope and coherent fibre bundle
 *   oi-projector     a bright object just outside the focal length; condenser, throw ratio and lux
 *   oi-spectrometer  a Czerny–Turner spectrometer: dispersion, bandpass and the sodium doublet
 * Numbers come from kit.optics (thin lenses, ray traces, diffraction, thin films); drawing is kit.osym. Where a picture is
 * schematic (a microscope drawn at a few times magnification, angles exaggerated, filter curves) the blurb says so.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const num = (v, d) => (Number.isFinite(v) ? v.toFixed(d == null ? 1 : d) : '∞').replace('-', '−');
  const fin = Number.isFinite;
  // angle as arc-seconds, arc-minutes or degrees, whichever reads best
  const angText = a => { const d = a * R2D; if (d >= 1) return d.toFixed(d < 10 ? 2 : 1) + '°'; if (d * 60 >= 1) return (d * 60).toFixed(2) + '′'; return (d * 3600).toFixed(2) + '″'; };
  // a label that cannot run off the stage (the width is estimated from the number of characters)
  function lab(kit, c, st, text, x, y, o) {
    o = o || {};
    const size = o.size || 12, w = String(text).length * size * 0.56, al = o.align || 'left';
    let xx = x;
    if (al === 'center') xx = Math.max(w / 2 + 4, Math.min(st.W - w / 2 - 4, x));
    else if (al === 'right') xx = Math.max(w + 4, Math.min(st.W - 4, x));
    else xx = Math.max(4, Math.min(st.W - w - 4, x));
    kit.label(c, text, xx, y, Object.assign({ color: kit.colors().muted }, o, { size }));
  }
  const clipStage = (c, st, fn) => { c.save(); c.beginPath(); c.rect(0, 0, st.W, st.H); c.clip(); fn(); c.restore(); };
  // thin-lens ray tracing along z: ray = [y, u]; lenses [{ z, f }] sorted; returns the polyline [[z, y] …] to zEnd
  function trace(y, u, z0, lenses, zEnd, hmax) {
    const pts = [[z0, y]]; let z = z0, blocked = false;
    for (const L of lenses) {
      if (L.z <= z0 + 1e-9) continue;
      y += u * (L.z - z); z = L.z; pts.push([z, y]);
      if (L.h != null && Math.abs(y) > L.h) { blocked = true; break; }
      u -= y / L.f;
    }
    if (!blocked) { y += u * (zEnd - z); pts.push([zEnd, y]); }
    return { pts, blocked, y, u };
  }
  // circle-circle overlap area (radii a, b, centres d apart)
  function overlap(a, b, d) {
    if (d >= a + b) return 0;
    if (d <= Math.abs(a - b)) return Math.PI * Math.min(a, b) * Math.min(a, b);
    const ca = (d * d + a * a - b * b) / (2 * d * a), cb = (d * d + b * b - a * a) / (2 * d * b);
    return a * a * Math.acos(clamp(ca, -1, 1)) + b * b * Math.acos(clamp(cb, -1, 1)) - 0.5 * Math.sqrt(Math.max(0, (-d + a + b) * (d + a - b) * (d - a + b) * (d + a + b)));
  }

  /* ================================================================ the visual angle */
  Hyper.sim('oi-visual-angle', {
    title: 'The visual angle: what the retina receives',
    blurb: `The size of the picture on your retina depends only on the **visual angle**, the angle the object subtends at the eye. The top of the drawing shows the eye and an object (heights drawn so that the two angles differ in the true ratio); the bottom shows the retinal patch, drawn to one scale for both pictures, with the foveal cones 2.5 µm apart (when they are large enough to draw).

**Try this**
- *A 1 mm detail at 250 mm* spans about 13.8′ and 27 cones. Raise the **magnification** to 10: the image grows to 270 cones. That is what a 10× loupe does, and nothing else.
- Choose *Two stars 1″ apart*: the naked-eye image is far smaller than one cone spacing, so it is unresolved. Raise M to 60: the separation reaches the eye's limit of about 1′.
- Choose *The Moon*: 0.52°, a retinal image 0.154 mm across, and a magnification of 10 takes it to 1.5 mm.
- Choose *A bird at 50 m*: the instrument does not make the bird bigger; it makes its angle larger.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const OBJ = [['A 1 mm detail at 250 mm', 1, 250], ['A 0.2 mm watch part at 250 mm', 0.2, 250], ['A coin, 24 mm, at 250 mm', 24, 250], ['A bird, 15 cm, at 50 m', 150, 50000],
        ['A person, 1.7 m, at 100 m', 1700, 100000], ['The Moon', 3.474e9, 3.844e11], ['Two stars 1″ apart', 1, 206265]];
      const ctl = kit.controls(box.side, [
        { id: 'obj', type: 'select', label: 'What is looked at', options: OBJ.map((o, i) => [o[0], i]), value: params.obj || 0 },
        { id: 'M', label: 'Angular magnification of the instrument', min: 1, max: 60, log: true, value: params.M || 10, fmt: v => '×' + kit.fmt(v, 2) }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['th', 'Visual angle, naked eye'], ['hr', 'Retinal image, naked eye'], ['nc', 'In cone spacings'], ['tp', 'Visual angle, instrument'], ['hrp', 'Retinal image, instrument'], ['ncp', 'In cone spacings'], ['res', 'Against the eye\'s 1′ limit']]);
      const Lr = O.eye.DATA.nodalToRetina, coneUm = Lr * Math.tan(O.eye.DATA.coneSpacing * D2R / 60) * 1e3;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const ob = OBJ[V.obj], th = Math.atan(ob[1] / ob[2]), tp = Math.atan(V.M * Math.tan(th));
        const hr = Lr * Math.tan(th) * 1e3, hrp = Lr * Math.tan(tp) * 1e3;
        // the eye and the object, with the angle drawn from the true ratio of the two apparent heights
        const cy = Hh * 0.27, ex = 50, r = 24, x1 = W - 70;
        const eye = S.eye(c, ex, cy, r, { dir: 1 }), nx = eye.nodal;
        const hp = Hh * 0.2, h0 = Math.max(3, hp / V.M);
        S.ray(c, [[nx, cy], [x1, cy - hp / 2]], { color: C.accent, width: 1, dash: [5, 4], arrows: false });
        S.ray(c, [[nx, cy], [x1, cy + hp / 2]], { color: C.accent, width: 1, dash: [5, 4], arrows: false });
        S.ray(c, [[nx, cy], [x1, cy - h0 / 2]], { color: C.muted, width: 1.4, arrows: false });
        S.ray(c, [[nx, cy], [x1, cy + h0 / 2]], { color: C.muted, width: 1.4, arrows: false });
        S.object(c, x1 + 18, cy + hp / 2, hp, { dash: true, color: C.accent, width: 2 });
        S.object(c, x1, cy + h0 / 2, h0, { color: C.text, width: 2.4 });
        lab(kit, c, st, 'object: ' + angText(th), W - 8, cy + hp / 2 + 16, { align: 'right', color: C.text });
        lab(kit, c, st, 'through the instrument: ' + angText(tp), W - 8, cy - hp / 2 - 14, { align: 'right', color: C.accent });
        lab(kit, c, st, 'eye', ex, cy + r + 14, { align: 'center', size: 11.5 });
        // the retinal patches, one scale for both
        const top = Hh * 0.52, ph = Hh - top - 30, gap = 14, pw = (W - 3 * gap) / 2;
        const ppu = (ph * 0.82) / Math.max(hrp, 1e-9);                      // pixels per micrometre
        [[gap, hr, 'naked eye'], [2 * gap + pw, hrp, 'with the instrument']].forEach(([px, h, name]) => {
          c.fillStyle = C.surface; c.fillRect(px, top, pw, ph); c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(px, top, pw, ph);
          const s = coneUm * ppu;
          if (s >= 5) {
            c.fillStyle = C.faint;
            for (let j = 0; j * s < ph - 3; j++) for (let i = 0; i * s < pw - 3; i++) { const dx = (j % 2) * s / 2; c.fillRect(px + 2 + i * s + dx, top + 2 + j * s * 0.866, 1.6, 1.6); }
          }
          const bh = Math.max(1.5, h * ppu), bw = pw * 0.22;
          c.fillStyle = name === 'naked eye' ? C.text : C.accent; c.globalAlpha = 0.85;
          c.fillRect(px + pw / 2 - bw / 2, top + ph / 2 - bh / 2, bw, bh); c.globalAlpha = 1;
          lab(kit, c, st, name + ': ' + (h < 10 ? h.toFixed(2) + ' µm' : h < 1000 ? h.toFixed(0) + ' µm' : (h / 1000).toFixed(2) + ' mm'), px + pw / 2, top + ph + 14, { align: 'center', size: 11.5, color: C.text });
        });
        lab(kit, c, st, coneUm * ppu >= 5 ? 'one scale; dots are cones 2.5 µm apart' : 'one scale; cones (2.5 µm) too fine to draw', W / 2, top - 8, { align: 'center', size: 11, color: C.faint });
        ro.set('th', angText(th));
        ro.set('hr', num(hr, hr < 10 ? 2 : 1) + ' µm');
        ro.set('nc', num(th * R2D * 60 / O.eye.DATA.coneSpacing, 1));
        ro.set('tp', angText(tp));
        ro.set('hrp', num(hrp, hrp < 10 ? 2 : 1) + ' µm');
        ro.set('ncp', num(tp * R2D * 60 / O.eye.DATA.coneSpacing, 1));
        ro.set('res', th * R2D * 60 >= 1 ? 'the object is larger than 1′' : tp * R2D * 60 >= 1 ? 'only the instrument lifts it past 1′' : 'smaller than 1′ even with the instrument');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the magnifier */
  Hyper.sim('oi-magnifier', {
    title: 'The magnifier: object inside the focal length',
    blurb: `A converging lens with the object between the lens and its focal point gives an upright, enlarged **virtual** image. Two rays are drawn from the tip of the object: one parallel to the axis (through F′ after the lens) and one through the centre of the lens. Their backward extensions (dashed) meet at the virtual image. The object is drawn at 16 % of f; only the 250 mm of the near point is a real distance. The eye is close to the lens.

**Try this**
- Set f = 25 mm and *image at infinity*: M = 250/25 = 10, and the two rays leave parallel. Switch to *image at the near point*: the object moves a little closer (22.7 mm) and M becomes 11.
- *I choose the distance*: slide the object from 0.5 f towards f. With the eye at the lens, M = 250 mm ÷ (object distance), and the image runs away to infinity at f. Past f the image turns real and inverted: the lens has become a projector.
- Shorten f to 5 mm: M = 50, but the object must be only 5 mm from the lens.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 310 });
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Focal length of the lens', min: 5, max: 250, value: params.f || 25, log: true, sig: 3, unit: 'mm' },
        { id: 'mode', type: 'select', label: 'Where the object is', options: [['At the focal point: image at infinity', 'inf'], ['Image at the near point, 250 mm', 'near'], ['I choose the distance', 'free']], value: params.mode || 'inf' },
        { id: 'u', label: 'Object distance as a fraction of f', min: 0.2, max: 1.6, step: 0.01, value: 0.8, fmt: v => v.toFixed(2) + ' f' }
      ], (id) => { if (id === 'mode') ctl.show('u', V.mode === 'free'); loop.once(); });
      const V = ctl.values;
      ctl.show('u', V.mode === 'free');
      const ro = kit.readout(box.side, [['f', 'Focal length · power'], ['so', 'Object distance'], ['si', 'Image'], ['m', 'Lateral magnification'], ['M', 'Angular magnification M'], ['ref', 'Both settings']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const f = V.f;
        const so = V.mode === 'inf' ? f : V.mode === 'near' ? 250 * f / (250 + f) : V.u * f;
        const lens = O.thinLens(f, so), h = 0.16 * f, isReal = so > f * (1 + 1e-9);
        const m = S.map(st, -1.9 * f, 1.35 * f, 0.62 * f, { left: 14, right: 14, top: 26, bottom: 28 });
        S.axis(c, m.X(-1.9 * f), m.y0, m.X(1.35 * f));
        const uA = -h / f, uB = -h / so, zEnd = 1.35 * f;
        clipStage(c, st, () => {
          // the two rays from the tip of the object
          S.ray(c, [[m.X(-so), m.Y(h)], [m.X(0), m.Y(h)], [m.X(8 * f), m.Y(h + uA * 8 * f)]], { nm: 600, width: 1.5, arrows: false });
          S.ray(c, [[m.X(-so), m.Y(h)], [m.X(0), m.Y(0)], [m.X(8 * f), m.Y(uB * 8 * f)]], { nm: 600, width: 1.5, arrows: false });
          if (!isReal && fin(lens.si)) {
            const zi = lens.si, yi = h * lens.m;
            S.virtual(c, m.X(0), m.Y(h), m.X(zi), m.Y(yi)); S.virtual(c, m.X(0), m.Y(0), m.X(zi), m.Y(yi));
            S.object(c, m.X(zi), m.y0, yi * m.sy, { dash: true, color: C.accent, width: 2 });
          } else if (isReal && fin(lens.si)) {
            S.object(c, m.X(lens.si), m.y0, h * lens.m * m.sy, { color: C.ok, width: 2.4 });
          }
        });
        S.object(c, m.X(-so), m.y0, h * m.sy, { color: C.accent, width: 2.8 });
        S.thinLens(c, m.X(0), m.y0, 0.5 * f * m.sy, f, { foci: f * m.s });
        S.eye(c, m.X(0.62 * f), m.y0, 0.3 * f * m.s, { dir: -1 });
        lab(kit, c, st, 'object', m.X(-so), m.y0 + 32, { align: 'center', size: 11.5, color: C.accent });
        lab(kit, c, st, 'lens', m.X(0), m.y0 - 0.5 * f * m.sy - 10, { align: 'center', size: 11.5 });
        lab(kit, c, st, 'eye', m.X(0.62 * f), m.y0 + 0.3 * f * m.s + 14, { align: 'center', size: 11.5 });
        // apparent sizes: the object at 250 mm against the image seen through the lens
        const M = isReal ? NaN : 250 / so;
        const bx = W - 64, b0 = 12, bm = clamp(b0 * (fin(M) ? M : 1), 4, 74);
        c.fillStyle = C.text; c.fillRect(bx, Hh - 34 - b0, 10, b0);
        c.fillStyle = C.accent; c.fillRect(bx + 24, Hh - 34 - bm, 10, bm);
        lab(kit, c, st, 'apparent size', bx + 17, Hh - 18, { align: 'center', size: 10.5, color: C.faint });
        lab(kit, c, st, 'bare, at 250 mm', bx - 4, Hh - 36 - 0, { align: 'right', size: 10.5, color: C.faint });
        ro.set('f', num(f, 1) + ' mm · ' + num(1000 / f, 1) + ' D');
        ro.set('so', num(so, 2) + ' mm' + (Math.abs(so - f) < 1e-6 ? ' (at F)' : ''));
        ro.set('si', Math.abs(so - f) < 1e-6 ? 'virtual, at infinity' : isReal ? 'REAL, inverted, ' + num(lens.si, 0) + ' mm behind the lens' : 'virtual, ' + num(-lens.si, 0) + ' mm in front of the lens');
        ro.set('m', Math.abs(so - f) < 1e-6 ? '—' : num(Math.abs(lens.m), 2) + (isReal ? ' (inverted)' : ' (upright)'));
        ro.set('M', fin(M) ? num(M, 2) + ' ×  (250 mm ÷ s_o)' : 'not a magnifier now (the image is real)');
        ro.set('ref', 'infinity: ' + num(250 / f, 1) + ' ×   near point: ' + num(1 + 250 / f, 1) + ' ×');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ eyepieces */
  Hyper.sim('oi-eyepiece', {
    title: 'Eyepieces as two thin lenses: field stop, field of view, eye relief',
    blurb: `Three classical eyepieces, each as two thin lenses scaled to the same equivalent focal length. A bundle of rays leaves the edge of the **field stop** (the plane where the objective's real image lies) and the other bundle leaves its centre; both emerge parallel for a relaxed eye. The eye relief is the distance from the last lens to the point where the eye belongs. The lens sizes are schematic; the focal lengths, spacings and positions are computed.

**Try this**
- *Huygens*: the field stop lies *between* the lenses and the eye relief is only a third of f: a reticle would not be in focus with the image, and the eye must nearly touch the lens.
- *Ramsden*: the stop is just in front of the field lens (good for a reticle) but the eye relief is a quarter of f. *Plössl*: the eye relief is 0.8 f.
- Make the field stop larger: the apparent field AFOV = 2 arctan(D/2f) grows. Beyond about 60° simple two-lens eyepieces fail; wide-field designs add elements.
- Set f to 10 mm in the Plössl: the eye relief is 8 mm, too short for spectacles (they need 15 to 20 mm).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const TYPES = { huygens: { name: 'Huygens', r1: 3, r2: 1, rd: 2, note: 'two plano-convex lenses, focal lengths 3 : 1' }, ramsden: { name: 'Ramsden', r1: 1, r2: 1, rd: 0.75, note: 'two equal plano-convex lenses' }, plossl: { name: 'Plössl', r1: 1, r2: 1, rd: 0.2, note: 'two identical doublets (drawn as thin lenses)' } };
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Design', options: [['Huygens', 'huygens'], ['Ramsden', 'ramsden'], ['Plössl', 'plossl']], value: params.type || 'plossl' },
        { id: 'f', label: 'Equivalent focal length', min: 5, max: 40, step: 0.5, value: params.f || 25, unit: 'mm' },
        { id: 'D', label: 'Field-stop diameter', min: 4, max: 50, step: 0.5, value: params.D || 27, unit: 'mm' },
        { id: 'fo', label: 'Telescope objective, focal length', min: 300, max: 3000, step: 50, value: 1000, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f12', 'Lenses f₁, f₂ · spacing'], ['er', 'Eye relief'], ['fs', 'Field stop lies'], ['afov', 'Apparent field of view'], ['M', 'On a telescope: M · true field'], ['mic', 'On a microscope: field number'], ['gl', 'Spectacles?']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W;
        const T = TYPES[V.type], tl = O.twoLenses(T.r1, T.r2, T.rd), k = V.f / tl.f;
        const f1 = T.r1 * k, f2 = T.r2 * k, d = T.rd * k, ER = tl.bfd * k, zs = -tl.ffd * k;
        const hl = Math.max(0.5 * V.f, 0.62 * V.D), halfD = V.D / 2;
        const zMin = Math.min(zs, 0) - 0.45 * V.f, zMax = d + ER + 0.75 * V.f;
        const m = S.map(st, zMin, zMax, hl * 1.3, { left: 14, right: 14, top: 30, bottom: 34 });
        S.axis(c, m.X(zMin), m.y0, m.X(zMax));
        const lenses = [{ z: 0, f: f1 }, { z: d, f: f2 }];
        const zEye = d + ER, dpx = 0.18 * V.f;
        // two bundles aimed at the exit pupil: from the edge of the field stop and from its centre
        for (const [y0, nm] of [[halfD, 590], [0, 520]]) {
          for (const Yk of [-dpx / 2, 0, dpx / 2]) {
            const a = trace(y0, 0, zs, lenses, zEye).y, b = trace(y0, 1, zs, lenses, zEye).y - a;
            const u = (Yk - a) / b, t = trace(y0, u, zs, lenses.filter(L => L.z > zs), zEye + 0.45 * V.f);
            S.ray(c, t.pts.map(p => [m.X(p[0]), m.Y(p[1])]), { nm, width: 1.25, arrows: false, alpha: 0.9 });
          }
        }
        S.thinLens(c, m.X(0), m.y0, hl * m.sy, f1, { color: C.accent });
        S.thinLens(c, m.X(d), m.y0, hl * m.sy, f2, { color: C.accent });
        S.stop(c, m.X(zs), m.y0, (halfD + 0.2 * V.f) * m.sy, halfD * m.sy, { color: C.text });
        S.eye(c, m.X(zEye + 0.34 * V.f), m.y0, 0.3 * V.f * m.s, { dir: -1 });
        S.dim(c, m.X(d), m.Y(-hl * 1.3), m.X(zEye), m.Y(-hl * 1.3), 'eye relief ' + ER.toFixed(1) + ' mm', { off: 12 });
        lab(kit, c, st, 'field stop', m.X(zs), m.Y(halfD + 0.2 * V.f) - 8, { align: 'center', size: 11, color: C.text });
        if (d * m.s < 90) lab(kit, c, st, 'two lenses', m.X(d / 2), m.Y(-hl) + 12, { align: 'center', size: 11 });
        else { lab(kit, c, st, (V.type === 'plossl' ? 'lens 1' : 'field lens'), m.X(0), m.Y(-hl) + 12, { align: 'center', size: 11 }); lab(kit, c, st, (V.type === 'plossl' ? 'lens 2' : 'eye lens'), m.X(d), m.Y(-hl) + 12, { align: 'center', size: 11 }); }
        lab(kit, c, st, T.name + ': ' + T.note, 12, 14, { size: 12, color: C.text });
        const afov = 2 * Math.atan(V.D / (2 * V.f)) * R2D, Mt = V.fo / V.f;
        ro.set('f12', num(f1, 1) + ' mm, ' + num(f2, 1) + ' mm · ' + num(d, 1) + ' mm');
        ro.set('er', num(ER, 1) + ' mm  (' + num(100 * ER / V.f, 0) + ' % of f)');
        ro.set('fs', zs < 0 ? num(-zs, 1) + ' mm in front of the first lens: a reticle fits' : zs < d ? num(zs, 1) + ' mm behind the first lens, between the lenses' : 'beyond the second lens');
        ro.set('afov', num(afov, 1) + '°' + (afov > 62 ? '  (beyond two simple lenses: wide-field designs)' : ''));
        ro.set('M', num(Mt, 1) + ' × · ' + num(afov / Mt, 2) + '°');
        ro.set('mic', num(V.D, 1) + ' mm  → 40× objective sees ' + num(V.D / 40, 2) + ' mm');
        ro.set('gl', ER >= 15 ? 'eye relief is enough for glasses' : 'too short for glasses (they need 15 to 20 mm)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the compound microscope */
  Hyper.sim('oi-microscope', {
    title: 'The compound microscope: two stages, one resolution',
    blurb: `The objective forms a real, inverted, enlarged intermediate image of the specimen; the eyepiece magnifies it. With an infinity-corrected objective the light between objective and tube lens is parallel. The ray picture is **schematic**: it keeps the layout but is drawn at a few times magnification, because a real 40× objective makes an image 160 mm away. All numbers in the read-out are exact.

The bar at the bottom puts the total magnification on a log scale against the *useful range*, 500 to 1000 times the NA.

**Try this**
- 40×/0.65 with a 10× eyepiece: 400×, inside the useful range (325 to 650), resolving 0.42 µm at 550 nm.
- Put a 20× eyepiece on the 100×/1.25 oil objective: 2000×, above the useful limit of 1250×: empty magnification.
- Change the eyepiece only: the resolution does not change at all. Change the objective: it does.
- Switch the tube between finite (160 mm) and infinity-corrected (200 mm tube lens): the objective's focal length changes, the total does not.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 320 });
      const OBJ = [{ M: 4, NA: 0.10, n: 'air' }, { M: 10, NA: 0.25, n: 'air' }, { M: 20, NA: 0.40, n: 'air' }, { M: 40, NA: 0.65, n: 'air' }, { M: 100, NA: 1.25, n: 'oil' }];
      const ctl = kit.controls(box.side, [
        { id: 'o', type: 'select', label: 'Objective', options: OBJ.map((o, i) => [o.M + '× / ' + o.NA.toFixed(2) + (o.n === 'oil' ? ' oil' : ''), i]), value: params.o != null ? params.o : 3 },
        { id: 'e', type: 'select', label: 'Eyepiece', options: [['5×', 5], ['10×', 10], ['15×', 15], ['20×', 20]], value: params.e || 10 },
        { id: 'tube', type: 'select', label: 'Tube', options: [['Finite, 160 mm', 160], ['Infinity-corrected, tube lens 200 mm', 200]], value: params.tube || 200 },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: 550, unit: 'nm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['obj', 'Objective: f · NA'], ['eye', 'Eyepiece: f'], ['M', 'Total magnification'], ['d', 'Resolves (Abbe)'], ['use', 'Useful range 500–1000 × NA'], ['v', 'Verdict']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const ob = OBJ[V.o], Mo = ob.M, Me = V.e, Mt = Mo * Me, fo = V.tube / Mo, fe = 250 / Me;
        const lo = 500 * ob.NA, hi = 1000 * ob.NA, d = O.diff.abbe(V.nm, ob.NA) * 1e9;
        // the schematic: units are arbitrary, the layout is the real one
        const md = 1.5 + 2 * Math.log10(Mo), fod = 22, fed = 16, ho = Math.min(6, 12 / md), inf = V.tube === 200;
        const zo = inf ? fod : fod * (1 + 1 / md);
        const zt = inf ? zo + 56 : null;
        const zi = inf ? zt + md * fod : zo + fod * (1 + md);
        const ze = zi + 0.8 * fed, zEye = ze + 1.15 * fed;
        const zMax = zEye + 22;
        const m = S.map(st, -12, zMax, 26, { left: 14, right: 12, top: 34, bottom: 78 });
        S.axis(c, m.X(-12), m.y0, m.X(zMax));
        const lenses = [{ z: zo, f: fod, h: 17 }];
        if (inf) lenses.push({ z: zt, f: md * fod, h: 20 });
        lenses.push({ z: ze, f: fed, h: 18 });
        for (const Yk of [-9, 0, 9]) {
          const u0 = (Yk - ho) / zo, t = trace(ho, u0, 0, lenses, zEye + 12);
          S.ray(c, t.pts.map(p => [m.X(p[0]), m.Y(p[1])]), { nm: 570, width: 1.3, arrows: false, alpha: t.blocked ? 0.35 : 0.95 });
        }
        S.object(c, m.X(0), m.y0, ho * m.sy, { color: C.accent, width: 2.6 });
        S.object(c, m.X(zi), m.y0, -md * ho * m.sy, { color: C.ok, width: 2.4 });
        S.thinLens(c, m.X(zo), m.y0, 17 * m.sy, fod, { color: C.accent });
        if (inf) S.thinLens(c, m.X(zt), m.y0, 20 * m.sy, md * fod, { color: C.accent });
        S.thinLens(c, m.X(ze), m.y0, 18 * m.sy, fed, { color: C.accent });
        S.eye(c, m.X(zEye + 8), m.y0, 9 * m.sy, { dir: -1 });
        lab(kit, c, st, 'specimen', m.X(0), m.y0 + 16, { align: 'center', size: 11, color: C.accent });
        lab(kit, c, st, 'objective', m.X(zo), m.Y(17) - 9, { align: 'center', size: 11 });
        if (inf) lab(kit, c, st, 'tube lens', m.X(zt), m.Y(20) - 9, { align: 'center', size: 11 });
        lab(kit, c, st, 'real image', m.X(zi), m.y0 + 5 + md * ho * m.sy + 12, { align: 'center', size: 11, color: C.ok });
        lab(kit, c, st, 'eyepiece', m.X(ze) + 4, m.Y(18) - 9, { align: 'center', size: 11 });
        lab(kit, c, st, inf ? 'parallel light between objective and tube lens' : 'tube length 160 mm (drawn short)', 14, 16, { size: 11.5, color: C.muted });
        // the useful range on a log scale
        const bx = 18, bw = W - 36, by = Hh - 46, bh = 14, L = v => bx + bw * (Math.log10(v) - 1) / (Math.log10(3000) - 1);
        c.fillStyle = C.surface; c.fillRect(bx, by, bw, bh);
        c.fillStyle = C.ok; c.globalAlpha = 0.45; c.fillRect(L(Math.max(lo, 10)), by, Math.max(2, L(Math.min(hi, 3000)) - L(Math.max(lo, 10))), bh); c.globalAlpha = 1;
        c.strokeStyle = C.grid; c.strokeRect(bx, by, bw, bh);
        [10, 100, 1000].forEach(v => lab(kit, c, st, v + '×', L(v), by + bh + 11, { align: 'center', size: 10.5, color: C.faint }));
        const mx = L(clamp(Mt, 10, 3000));
        c.fillStyle = Mt > hi ? C.bad : Mt < lo ? C.warn : C.text; c.beginPath(); c.moveTo(mx, by - 1); c.lineTo(mx - 6, by - 10); c.lineTo(mx + 6, by - 10); c.closePath(); c.fill();
        lab(kit, c, st, 'total ' + Mt + '×', mx, by - 19, { align: 'center', size: 11.5, color: C.text });
        if (L(Math.min(hi, 3000)) - L(Math.max(lo, 10)) > 70) lab(kit, c, st, 'useful', (L(Math.max(lo, 10)) + L(Math.min(hi, 3000))) / 2, by + bh / 2, { align: 'center', size: 10.5, color: C.text });
        ro.set('obj', num(fo, 1) + ' mm · NA ' + ob.NA.toFixed(2) + (ob.n === 'oil' ? ' (oil)' : ''));
        ro.set('eye', num(fe, 1) + ' mm');
        ro.set('M', Mo + ' × ' + Me + ' = ' + Mt + ' ×');
        ro.set('d', num(d, 0) + ' nm at ' + V.nm + ' nm  (λ / 2NA)');
        ro.set('use', num(lo, 0) + ' to ' + num(hi, 0) + ' ×');
        ro.set('v', Mt < lo ? 'below the useful range: the eye misses detail' : Mt > hi ? 'EMPTY magnification: larger, not sharper' : 'useful magnification');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ objectives */
  Hyper.sim('oi-objective', {
    title: 'A microscope objective: the engraving and the cone of light',
    blurb: `On the left, the barrel as it is engraved: class, magnification and NA, immersion and tube-length system, cover glass. On the right, light from one point of the specimen crosses the cover glass (drawn much thicker than to scale, so that the bending shows) and meets the liquid between glass and lens. Rays are coloured by what happens to them: **coloured** rays are collected, **grey** ones leave the glass but fall outside the NA, **red** ones are totally reflected at the back of the cover glass and never leave it.

**Try this**
- *100×/1.40 Plan Apo oil*, used with oil: a cone of 67° in the glass is collected. Change *Used with* to **air**: everything beyond 41° turns red and the NA collapses to 0.95 at best.
- *40×/0.95 dry*: the cone reaches 72° in air, but rays between 39° and 41° in the glass are grey and beyond 41° red. There is no room for a larger dry NA.
- Compare the resolution and depth read-outs for the 4×/0.10 and the 100×/1.40: NA, not magnification, sets both.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 360 });
      const OBJ = [
        { name: '4×/0.10 Plan', M: 4, NA: 0.10, cls: 'Plan', med: 'air', cover: '–', ring: '#d9433b', wd: 'about 10 to 30 mm' },
        { name: '10×/0.25 Plan', M: 10, NA: 0.25, cls: 'Plan', med: 'air', cover: '–', ring: '#e6c52e', wd: 'about 4 to 10 mm' },
        { name: '20×/0.40 Plan', M: 20, NA: 0.40, cls: 'Plan', med: 'air', cover: '0.17', ring: '#3aa655', wd: 'about 1 to 3 mm' },
        { name: '40×/0.65 Plan', M: 40, NA: 0.65, cls: 'Plan', med: 'air', cover: '0.17', ring: '#58b6ea', wd: 'about 0.4 to 0.7 mm' },
        { name: '40×/0.95 Plan Apo, dry', M: 40, NA: 0.95, cls: 'Plan Apo', med: 'air', cover: '0.17', corr: true, ring: '#58b6ea', wd: 'about 0.14 to 0.25 mm' },
        { name: '60×/1.20 Plan Apo, water', M: 60, NA: 1.20, cls: 'Plan Apo', med: 'water', cover: '0.17', ring: '#2b45b3', wd: 'about 0.2 to 0.3 mm' },
        { name: '100×/1.25 Plan, oil', M: 100, NA: 1.25, cls: 'Plan', med: 'oil', cover: '0.17', ring: '#f2f2f2', wd: 'about 0.1 to 0.2 mm' },
        { name: '100×/1.40 Plan Apo, oil', M: 100, NA: 1.40, cls: 'Plan Apo', med: 'oil', cover: '0.17', ring: '#f2f2f2', wd: 'about 0.1 to 0.2 mm' }
      ];
      const MED = { air: ['air', 1], water: ['water', 1.333], oil: ['oil', 1.515] };
      const ctl = kit.controls(box.side, [
        { id: 'o', type: 'select', label: 'Objective', options: OBJ.map((o, i) => [o.name, i]), value: params.o != null ? params.o : 7 },
        { id: 'use', type: 'select', label: 'Used with', options: [['the liquid it is made for', 'design'], ['air (dry)', 'air'], ['water', 'water'], ['immersion oil', 'oil']], value: params.use || 'design' },
        { id: 'nm', label: 'Wavelength', min: 450, max: 650, step: 5, value: 550, unit: 'nm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eng', 'Engraving'], ['na', 'NA · half-angle in the liquid'], ['ang', 'Half-angle in the cover glass'], ['res', 'Resolves (λ / 2 NA)'], ['dz', 'Diffraction depth of field'], ['wd', 'Working distance (typical)'], ['st', 'Status']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const ob = OBJ[V.o], medId = V.use === 'design' ? ob.med : V.use, nmed = MED[medId][1], ng = O.index('crown-1.523', V.nm);
        const NAe = Math.min(ob.NA, 0.95 * nmed);
        // the barrel
        const bw = clamp(W * 0.34, 120, 190), bx = 8, by0 = 14, by1 = Hh - 18, bwid = bw - 14;
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = C.text; c.lineWidth = 1.3;
        c.beginPath(); c.moveTo(bx + 12, by0); c.lineTo(bx + bwid - 12, by0); c.lineTo(bx + bwid, by0 + 34); c.lineTo(bx + bwid, by1 - 80); c.lineTo(bx + bwid * 0.8, by1); c.lineTo(bx + bwid * 0.2, by1); c.lineTo(bx, by1 - 80); c.lineTo(bx, by0 + 34); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = ob.ring; c.fillRect(bx + 1, by1 - 128, bwid - 2, 10);
        if (medId !== 'air' && V.use === 'design') { c.fillStyle = medId === 'oil' ? '#111' : '#f2f2f2'; c.fillRect(bx + 1, by1 - 112, bwid - 2, 7); }
        const lines = [ob.cls, ob.M + '×/' + ob.NA.toFixed(2), (ob.med === 'oil' ? 'Oil ' : ob.med === 'water' ? 'W ' : '') + '∞/' + ob.cover].concat(ob.corr ? ['Corr'] : []);
        lines.forEach((t, i) => kit.label(c, t, bx + bwid / 2, by0 + 64 + i * 19, { align: 'center', size: 12.5, weight: 700, color: C.text }));
        lab(kit, c, st, 'ring: ' + ob.M + '×', bx + bwid / 2, by1 - 138, { align: 'center', size: 10.5, color: C.faint });
        // the cone of light
        const dx0 = bx + bw + 4, dw = W - dx0 - 8, cx = dx0 + dw / 2, yS = Hh - 40, tc = 16;
        const thgL = Math.asin(Math.min(0.999, NAe / ng)), thmL = Math.asin(Math.min(0.999, NAe / nmed));
        const tg = Math.max(8, Math.min(30, (dw / 2 - 8 - tc * Math.tan(thgL)) / Math.max(0.2, Math.tan(thmL))));
        const lensY = yS - tc - tg, Rl = tc * Math.tan(thgL) + tg * Math.tan(thmL);
        c.fillStyle = S.glass(0.35); c.fillRect(dx0, yS, dw, 8);
        c.fillStyle = S.glass(0.5); c.fillRect(dx0, yS - tc, dw, tc);
        if (medId !== 'air') { c.fillStyle = medId === 'oil' ? 'rgba(230,170,60,0.22)' : 'rgba(80,160,255,0.2)'; c.fillRect(dx0, lensY, dw, tg); }
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8';
        c.fillRect(dx0, 8, Math.max(0, cx - Rl - dx0), lensY - 8); c.fillRect(cx + Rl, 8, Math.max(0, dx0 + dw - cx - Rl), lensY - 8);
        S.poly(c, [[cx - Rl, lensY], [cx + Rl, lensY], [cx + Rl * 0.8, lensY - 0.5 * Rl], [cx - Rl * 0.8, lensY - 0.5 * Rl]], { fill: S.glass(0.3) });
        for (let a = 0; a <= 72; a += 4) {
          for (const sg of (a === 0 ? [1] : [-1, 1])) {
            const t = a * D2R, sn = ng * Math.sin(t), x1 = cx + sg * tc * Math.tan(t);
            if (sn > nmed + 1e-9) { S.ray(c, [[cx, yS], [x1, yS - tc], [x1 + sg * tc * Math.tan(t), yS]], { color: C.bad, alpha: 0.55, width: 1, arrows: false }); continue; }
            const tm = Math.asin(Math.min(1, sn / nmed)), x2 = x1 + sg * tg * Math.min(12, Math.tan(tm));
            if (sn <= NAe + 1e-9) S.ray(c, [[cx, yS], [x1, yS - tc], [x2, lensY], [cx + (x2 - cx) * 0.3, 26]], { nm: V.nm, width: 1.3, arrows: false });
            else S.ray(c, [[cx, yS], [x1, yS - tc], [x2, lensY]], { color: C.faint, alpha: 0.7, width: 1, arrows: false });
          }
        }
        kit.dot(c, cx, yS, 3.5, C.accent);
        lab(kit, c, st, 'cover glass (0.17 mm)', dx0 + dw - 2, yS - tc / 2 - 1, { align: 'right', size: 10.5, bg: C.bg2 });
        lab(kit, c, st, 'slide and specimen', dx0 + dw - 2, yS + 20, { align: 'right', size: 10.5, color: C.faint });
        lab(kit, c, st, MED[medId][0] + ', n = ' + MED[medId][1].toFixed(3), dx0 + dw - 2, lensY + tg / 2, { align: 'right', size: 10.5, bg: C.bg2 });
        lab(kit, c, st, 'front lens', cx, lensY - 0.5 * Rl - 11, { align: 'center', size: 10.5 });
        lab(kit, c, st, 'to the tube lens', cx, 14, { align: 'center', size: 10.5, color: C.faint });
        const res = O.diff.abbe(V.nm, NAe) * 1e9, dz = V.nm * 1e-3 * nmed / (NAe * NAe);
        ro.set('eng', lines.join('  '));
        ro.set('na', NAe.toFixed(2) + ' · ' + (Math.asin(Math.min(1, NAe / nmed)) * R2D).toFixed(1) + '°');
        const tirAt = Math.asin(Math.min(1, nmed / ng)) * R2D;
        ro.set('ang', (Math.asin(Math.min(1, NAe / ng)) * R2D).toFixed(1) + '°' + (tirAt < 80 ? '  (total reflection beyond ' + tirAt.toFixed(1) + '°)' : '  (no total reflection to speak of)'));
        ro.set('res', num(res, 0) + ' nm');
        ro.set('dz', num(dz, 2) + ' µm  (n λ / NA²)');
        ro.set('wd', ob.wd);
        ro.set('st', ob.NA > NAe + 1e-9 ? 'wrong liquid: NA falls from ' + ob.NA.toFixed(2) + ' to ' + NAe.toFixed(2) + ' and the image is aberrated' : medId !== ob.med ? 'not the liquid it is made for: aberrated' : 'as designed');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ contrast methods */
  Hyper.sim('oi-contrast', {
    title: 'One transparent specimen, five ways of looking at it',
    blurb: `A model specimen: a transparent **cell** (a dome of optical path with a thicker nucleus and a dense granule) or a birefringent **crystal** (a spherulite). The same specimen is rendered five ways from a complex amplitude: bright field shows only absorption; dark field only what is scattered; phase contrast shifts the unscattered light by a quarter wave; DIC compares neighbouring points; crossed polarizers show birefringence. Click a small picture to choose its method. The pictures are computed, schematic and monochrome.

**Try this**
- *Bright field* on the unstained cell: a featureless grey. Tick **stain**: the nucleus and the granule appear, because they now absorb.
- *Phase contrast*: the cell shows without stain, with the halo around its edge that the method is known for. Lower the **ring transmission**: contrast rises, the ground darkens.
- *DIC*: a relief that is bright on one side and dark on the other. Turn the **shear direction**: the light and shadow sides turn with it.
- Choose the *crystal* in *crossed polarizers*: the Maltese cross appears; the unstained cell is nearly black, because it is not birefringent.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 340 });
      const MODES = [['bf', 'Bright field'], ['df', 'Dark field'], ['pc', 'Phase contrast'], ['dic', 'DIC'], ['pol', 'Crossed polarizers']];
      const SHORT = { bf: 'Bright', df: 'Dark', pc: 'Phase', dic: 'DIC', pol: 'Polar.' };
      const WHAT = { bf: 'absorption only', df: 'only scattered light', pc: 'phase turned into brightness', dic: 'slope of the optical path', pol: 'birefringence' };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Method', options: MODES.map(m => [m[1], m[0]]), value: params.mode || 'pc' },
        { id: 'sample', type: 'select', label: 'Specimen', options: [['A transparent cell', 'cell'], ['A birefringent crystal (spherulite)', 'crystal']], value: params.sample || 'cell' },
        { id: 'stain', type: 'check', label: 'Stain the nucleus and granule', value: false },
        { id: 'ring', label: 'Phase ring transmission', min: 5, max: 80, step: 1, value: 25, unit: '%' },
        { id: 'psi', label: 'DIC shear direction', min: 0, max: 180, step: 5, value: 45, unit: '°' }
      ], (id) => { if (id === 'mode' || id === 'sample') showFor(); loop.once(); });
      const V = ctl.values;
      const showFor = () => { ctl.show('ring', V.mode === 'pc'); ctl.show('psi', V.mode === 'dic'); ctl.show('stain', V.sample === 'cell'); };
      showFor();
      const ro = kit.readout(box.side, [['m', 'Method'], ['why', 'What makes the contrast'], ['c', 'Contrast of the specimen']]);
      const N = 88, N2 = N * N;
      const sm = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
      const ca = Math.cos(0.35), sa = Math.sin(0.35);
      // optical path (radians of phase) of the two specimens
      function phiAt(sample, x, y) {
        if (sample === 'cell') {
          const xr = x * ca + y * sa, yr = -x * sa + y * ca, r2 = Math.pow(xr / 0.74, 2) + Math.pow(yr / 0.56, 2);
          const dn = Math.hypot(x + 0.13, y - 0.05) / 0.27, dg = Math.hypot(x - 0.38, y + 0.2) / 0.08;
          return 0.85 * Math.sqrt(Math.max(0, 1 - r2)) + (r2 < 1 ? 0.55 * Math.sqrt(Math.max(0, 1 - dn * dn)) : 0) + 0.45 * Math.sqrt(Math.max(0, 1 - dg * dg));
        }
        const r = Math.hypot(x, y) / 0.62;
        return r < 1 ? 0.7 * Math.sqrt(1 - r * r) : 0;
      }
      function boxBlur(src, r) {
        const tmp = new Float64Array(N2), out = new Float64Array(N2), w = 2 * r + 1;
        for (let j = 0; j < N; j++) { let s = 0; for (let k = -r; k <= r; k++) s += src[j * N + clamp(k, 0, N - 1)]; for (let i = 0; i < N; i++) { tmp[j * N + i] = s / w; s += src[j * N + clamp(i + r + 1, 0, N - 1)] - src[j * N + clamp(i - r, 0, N - 1)]; } }
        for (let i = 0; i < N; i++) { let s = 0; for (let k = -r; k <= r; k++) s += tmp[clamp(k, 0, N - 1) * N + i]; for (let j = 0; j < N; j++) { out[j * N + i] = s / w; s += tmp[clamp(j + r + 1, 0, N - 1) * N + i] - tmp[clamp(j - r, 0, N - 1) * N + i]; } }
        return out;
      }
      let cache = null, cacheKey = '';
      function render() {
        const key = [V.sample, V.stain, V.ring, V.psi].join('|');
        if (cacheKey === key && cache) return cache;
        const re = new Float64Array(N2), im = new Float64Array(N2), T = new Float64Array(N2), del = new Float64Array(N2), alp = new Float64Array(N2), phi = new Float64Array(N2), obj = new Uint8Array(N2);
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
          const x = (i + 0.5) / N * 2 - 1, y = (j + 0.5) / N * 2 - 1, k = j * N + i, p = phiAt(V.sample, x, y);
          let t = 1;
          if (V.sample === 'cell' && V.stain) { t -= 0.5 * sm(1, 0.7, Math.hypot(x + 0.13, y - 0.05) / 0.27) + 0.7 * sm(1, 0.6, Math.hypot(x - 0.38, y + 0.2) / 0.08); t = clamp(t, 0.15, 1); }
          phi[k] = p; T[k] = t; re[k] = t * Math.cos(p); im[k] = t * Math.sin(p); obj[k] = p > 0.02 || t < 0.98 ? 1 : 0;
          if (V.sample === 'cell') { const xr = x * ca + y * sa, yr = -x * sa + y * ca, r2 = Math.pow(xr / 0.74, 2) + Math.pow(yr / 0.56, 2); del[k] = 0.12 * Math.sqrt(Math.max(0, 1 - r2)); alp[k] = 0.6; }
          else { const r = Math.hypot(x, y) / 0.62; del[k] = r < 1 ? 4 * (1 - r * r) : 0; alp[k] = Math.atan2(y, x); }
        }
        const Lre = boxBlur(boxBlur(re, 6), 6), Lim = boxBlur(boxBlur(im, 6), 6), a = Math.sqrt(V.ring / 100), s = 0.04, cs = Math.cos(V.psi * D2R), sn = Math.sin(V.psi * D2R);
        const out = { bf: new Float32Array(N2), df: new Float32Array(N2), pc: new Float32Array(N2), dic: new Float32Array(N2), pol: new Float32Array(N2) };
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
          const k = j * N + i, x = (i + 0.5) / N * 2 - 1, y = (j + 0.5) / N * 2 - 1;
          out.bf[k] = 0.85 * T[k] * T[k];
          const sre = re[k] - Lre[k], sim = im[k] - Lim[k];
          out.df[k] = clamp(9 * (sre * sre + sim * sim), 0, 1);
          const pre = sre + a * Lim[k], pim = sim - a * Lre[k];
          out.pc[k] = clamp(0.5 * (pre * pre + pim * pim) / (a * a), 0, 1);
          const dphi = phiAt(V.sample, x + s * cs, y + s * sn) - phiAt(V.sample, x - s * cs, y - s * sn);
          out.dic[k] = T[k] * T[k] * Math.pow(Math.cos((dphi + Math.PI / 2) / 2), 2);
          out.pol[k] = clamp(T[k] * T[k] * Math.pow(Math.sin(2 * alp[k]), 2) * Math.pow(Math.sin(del[k] / 2), 2) + 0.003, 0, 1);
        }
        // the extreme contrast of the specimen against the ground
        const contrast = {};
        for (const md of Object.keys(out)) {
          let bg = 0, nb = 0;
          for (let k = 0; k < N2; k++) if (!obj[k]) { bg += out[md][k]; nb++; }
          bg = nb ? bg / nb : 0;
          let best = 0, bv = bg;
          for (let k = 0; k < N2; k++) if (obj[k] && Math.abs(out[md][k] - bg) > best) { best = Math.abs(out[md][k] - bg); bv = out[md][k]; }
          contrast[md] = (bv + bg) > 0.01 ? (bv - bg) / (bv + bg) : 0;
        }
        cache = { out, contrast }; cacheKey = key;
        return cache;
      }
      const spots = [];
      kit.click(st, p => { for (const sp of spots) if (p.x >= sp.x && p.x <= sp.x + sp.w && p.y >= sp.y && p.y <= sp.y + sp.h) { ctl.set('mode', sp.id); showFor(); loop.once(); return; } }, p => spots.some(sp => p.x >= sp.x && p.x <= sp.x + sp.w && p.y >= sp.y && p.y <= sp.y + sp.h));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const r = render(), mode = V.mode;
        const side = Math.min(W * 0.62, Hh - 20), tl = Math.floor((Hh - 24 - 5 * 14) / 5), tx = W - tl - 10;
        const img = (arr, x, y, w, h, id, key) => S.image(c, x, y, w, h, N, N, (u, v) => arr[Math.min(N - 1, (v * N) | 0) * N + Math.min(N - 1, (u * N) | 0)], { key, id, rgb: [235, 245, 235], smooth: true });
        const k0 = [V.sample, V.stain, V.ring, V.psi].join('|');
        img(r.out[mode], 10, 10, side, side, 'main', k0 + '|' + mode);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(10, 10, side, side);
        kit.label(c, MODES.find(m => m[0] === mode)[1], 18, 24, { size: 12, weight: 650, color: C.text, bg: C.bg2 });
        spots.length = 0;
        MODES.forEach((m, i) => {
          const y = 10 + i * (tl + 14);
          img(r.out[m[0]], tx, y, tl, tl, 't' + m[0], k0 + '|' + m[0]);
          c.strokeStyle = m[0] === mode ? C.accent : C.grid; c.lineWidth = m[0] === mode ? 2.4 : 1; c.strokeRect(tx, y, tl, tl);
          kit.label(c, SHORT[m[0]], tx + tl / 2, y + tl + 8, { align: 'center', size: 10.5, color: m[0] === mode ? C.accent : C.muted });
          spots.push({ id: m[0], x: tx, y, w: tl, h: tl + 14 });
        });
        const cm = r.contrast[mode];
        ro.set('m', MODES.find(m => m[0] === mode)[1]);
        ro.set('why', WHAT[mode]);
        ro.set('c', Math.abs(cm) < 0.02 ? 'about ' + num(Math.abs(cm) * 100, 1) + ' %: invisible to the eye (it needs about 2 %)' : num(Math.abs(cm) * 100, 0) + ' %' + (mode === 'df' || mode === 'pol' ? ' (bright on dark)' : cm < 0 ? ' (darker than the ground)' : ' (brighter than the ground)'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ fluorescence */
  Hyper.sim('oi-fluorescence', {
    title: 'Fluorescence: the dye, the filter cube and the dichroic mirror',
    blurb: `A dye absorbs in one band and emits in another, at longer wavelength. A cube of three parts separates the two: an excitation filter, a dichroic mirror at 45° that reflects the exciting light into the objective and passes the emission, and an emission filter. The **dichroic curve is computed** from a thin-film long-pass design at 45° (average of the two polarizations); the dye spectra and the band-pass filters are **schematic**.

**Try this**
- Dye and cube matched (the default): the excitation filter overlaps the dye's absorption, the emission filter takes most of its emission, and the exciting light that reaches the eye is blocked to an optical density of about 8 or more (the filters here are ideal band-passes; real cubes are better still).
- Keep the GFP dye and choose the *DAPI* cube: nothing excites the dye (the signal falls to zero). A signal appears only when the cube matches the dye.
- Every cube here blocks the exciting light to an optical density of about 8.5 to 9.5; a cube works only if its excitation band, its dichroic edge and its emission band lie in that order across the dye's two bands.
- Compare the Stokes shifts: DAPI 103 nm, the others about 20 nm, which is why the three filter windows of the GFP, TRITC and Cy5 cubes almost touch.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 310 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const SET = [
        { id: 'dapi', name: 'DAPI', ex: 358, em: 461, sx: [18, 14], se: [18, 32], ef: [330, 380], dc: 400, mf: [430, 490] },
        { id: 'gfp', name: 'GFP', ex: 488, em: 507, sx: [16, 11], se: [9, 22], ef: [450, 490], dc: 495, mf: [510, 560] },
        { id: 'tritc', name: 'TRITC', ex: 557, em: 576, sx: [18, 12], se: [12, 26], ef: [530, 555], dc: 565, mf: [580, 630] },
        { id: 'cy5', name: 'Cy5', ex: 650, em: 670, sx: [18, 14], se: [12, 30], ef: [590, 650], dc: 660, mf: [670, 740] }
      ];
      const ctl = kit.controls(box.side, [
        { id: 'dye', type: 'select', label: 'Dye in the specimen', options: SET.map((s, i) => [s.name + '  (' + s.ex + ' → ' + s.em + ' nm)', i]), value: params.dye != null ? params.dye : 1 },
        { id: 'cube', type: 'select', label: 'Filter cube', options: SET.map((s, i) => [s.name + ' set', i]), value: params.cube != null ? params.cube : 1 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ss', 'Stokes shift'], ['abs', 'Dye\'s absorption band used'], ['col', 'Dye\'s emission collected'], ['sig', 'Signal (relative)'], ['leak', 'Exciting light reaching the eye']]);
      const plot = kit.plot(gb, { x: { label: 'wavelength (nm)', min: 300, max: 750 }, y: { label: 'relative', min: 0, max: 1.05 }, legend: true }, 170);
      const asym = (nm, pk, s) => Math.exp(-0.5 * Math.pow((nm - pk) / (nm < pk ? s[0] : s[1]), 2));
      const edge = x => 0.5 * (1 + Math.tanh(x / 3));
      const band = (nm, b) => 1e-6 + 0.93 * edge(nm - b[0]) * edge(b[1] - nm);
      // the dichroic: a thin-film long-pass design at 45°, tuned so that its half-transmission edge is where the cube wants it
      const dcCache = {};
      function crossing(nm0, th) {
        const sp = O.film.spectrum(O.film.design('longpass', nm0, 1.52), 250, 900, 131, th);
        for (let i = sp.length - 1; i > 0; i--) if (sp[i].T >= 0.5 && sp[i - 1].T < 0.5) return sp[i - 1].nm + (0.5 - sp[i - 1].T) / (sp[i].T - sp[i - 1].T) * (sp[i].nm - sp[i - 1].nm);
        return NaN;
      }
      function dichroic(i) {
        if (dcCache[i]) return dcCache[i];
        const th = 45 * D2R, e = SET[i].dc;
        let a = e, b = e * 1.1, fa = crossing(a, th) - e, fb = crossing(b, th) - e;
        for (let k = 0; k < 6 && fin(fa) && fin(fb) && Math.abs(fb) > 0.4 && fb !== fa; k++) { const nx = b - fb * (b - a) / (fb - fa); a = b; fa = fb; b = nx; fb = crossing(b, th) - e; }
        const nm0 = fin(fb) && b > 100 && b < 2000 ? b : e * 1.08;
        const sp = O.film.spectrum(O.film.design('longpass', nm0, 1.52), 300, 800, 126, th);
        dcCache[i] = sp.map(p => [p.nm, clamp(p.T, 0, 1)]);
        return dcCache[i];
      }
      const dcAt = (tab, nm) => { const k = clamp((nm - 300) / 4, 0, tab.length - 1.001), i = Math.floor(k), f = k - i; return tab[i][1] * (1 - f) + tab[i + 1][1] * f; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const dye = SET[V.dye], cube = SET[V.cube], tab = dichroic(V.cube);
        let sx = 0, sxe = 0, se = 0, sem = 0, ef = 0, leak = 0;
        const pts = { ex: [], em: [], ef: [], mf: [], dc: [] };
        for (let nm = 300; nm <= 750; nm += 2) {
          const dx = asym(nm, dye.ex, dye.sx), de = asym(nm, dye.em, dye.se), fe = band(nm, cube.ef), fm = band(nm, cube.mf), tt = dcAt(tab, nm);
          sx += dx; sxe += dx * fe; se += de; sem += de * tt * fm; ef += fe; leak += fe * (1 - tt) * tt * fm;
          if (nm % 4 === 0) { pts.ex.push([nm, dx]); pts.em.push([nm, de]); pts.ef.push([nm, fe]); pts.mf.push([nm, fm]); pts.dc.push([nm, tt]); }
        }
        const absb = sxe / sx / 0.93, col = sem / se / 0.93, sig = absb * col, lk = 0.01 * leak / ef, od = lk > 0 ? -Math.log10(lk) : 12;
        // the cube
        const cx = W * 0.56, yL = Hh * 0.4, yE = Hh * 0.08, yF = Hh * 0.22, yO = Hh * 0.62, yS = Hh * 0.82;
        const exNm = (cube.ef[0] + cube.ef[1]) / 2, emNm = Math.max(dye.em, 420);
        S.ray(c, [[W * 0.1, yL], [cx, yL]], { nm: Math.max(exNm, 400), width: 3, arrows: true });
        S.plate(c, cx, yL, 54, -Math.PI / 4, { t: 4 });
        S.ray(c, [[cx, yL], [cx, yS - 6]], { nm: Math.max(exNm, 400), width: 3, arrows: true, minArrow: 30 });
        S.ray(c, [[cx + 7, yS - 6], [cx + 7, yE + 10]], { nm: emNm, width: clamp(1 + 3 * Math.sqrt(sig), 1, 4), alpha: 0.35 + 0.65 * clamp(Math.sqrt(sig), 0, 1), arrows: true, minArrow: 30 });
        if (lk > 1e-6) S.ray(c, [[cx - 7, yL - 4], [cx - 7, yE + 10]], { nm: Math.max(exNm, 400), width: 2, alpha: clamp(1 + Math.log10(lk) / 6, 0.1, 1), dash: [4, 3], arrows: false });
        S.plate(c, W * 0.3, yL, 30, 0, { t: 5, fill: S.glass(0.5) });
        S.plate(c, cx, yF, 30, Math.PI / 2, { t: 5, fill: S.glass(0.5) });
        S.thinLens(c, cx, yO, 22, 30);
        c.fillStyle = S.nm(Math.max(emNm, 450), 0.9); c.beginPath(); c.arc(cx, yS, 5, 0, Math.PI * 2); c.fill();
        S.eye(c, cx, yE, 8, { dir: 1 });
        const L = cx + 24;
        lab(kit, c, st, 'lamp', W * 0.1, yL - 14, { align: 'left', size: 11 });
        lab(kit, c, st, 'excitation filter', W * 0.3, yL + 24, { align: 'center', size: 11 });
        lab(kit, c, st, 'dichroic mirror, 45°', L, yL + 4, { align: 'left', size: 11, color: C.text });
        lab(kit, c, st, 'emission filter', L, yF, { align: 'left', size: 11 });
        lab(kit, c, st, 'objective', L, yO, { align: 'left', size: 11 });
        lab(kit, c, st, 'specimen', L, yS, { align: 'left', size: 11, color: C.accent });
        lab(kit, c, st, 'eye or camera', L, yE, { align: 'left', size: 11 });
        plot.set({
          series: [
            { pts: pts.ex, label: 'dye absorbs', dash: true }, { pts: pts.em, label: 'dye emits' },
            { pts: pts.ef, label: 'excitation filter' }, { pts: pts.mf, label: 'emission filter' }, { pts: pts.dc, label: 'dichroic (45°)', dash: [2, 3] }
          ]
        });
        ro.set('ss', (dye.em - dye.ex) + ' nm');
        ro.set('abs', num(absb * 100, 0) + ' %');
        ro.set('col', num(col * 100, 0) + ' %');
        ro.set('sig', num(sig * 100, 0) + ' %');
        ro.set('leak', od > 11.5 ? 'blocked to OD > 12' : 'blocked to OD ' + num(od, 1) + (od < 6 ? '  (too little: glare)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ confocal */
  Hyper.sim('oi-confocal', {
    title: 'The confocal pinhole: in focus passes, out of focus is blocked',
    blurb: `Two point emitters in the specimen: one in the focal plane (green) and one deeper (orange). After the objective and the tube lens, the in-focus emitter comes to a point **on the pinhole**; the deeper one comes to a point *before* it and arrives as a disc, most of which falls on the plate. Cone angles are drawn exaggerated; the ratio of the blur disc to the pinhole is the true one (ray optics plus the Airy pattern). The graph shows how much of an emitter's light passes the pinhole against its depth.

**Try this**
- Pinhole of **1 AU**, emitter 1.5 µm out of focus (NA 1.4 oil): a fraction of a per cent of its light passes, against about 84 % for the in-focus one.
- Open the pinhole to 3 AU: the out-of-focus emitter leaks through, the section gets thicker, and the picture approaches a wide-field one.
- Close it to 0.2 AU: the thin section is purchased with signal; even the in-focus emitter drops.
- Lower the **NA** to 0.4: the cone is slim and the out-of-focus light stays within the pinhole for much longer: a thick section.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'NA', label: 'Numerical aperture', min: 0.3, max: 1.4, step: 0.05, value: params.NA || 1.4, fmt: v => v.toFixed(2) },
        { id: 'n', type: 'select', label: 'Medium', options: [['Air, n = 1', 1], ['Water, n = 1.333', 1.333], ['Immersion oil, n = 1.515', 1.515]], value: params.n || 1.515 },
        { id: 'pin', label: 'Pinhole size', min: 0.1, max: 3, value: params.pin || 1, log: true, sig: 2, fmt: v => kit.fmt(v, 2) + ' AU' },
        { id: 'z', label: 'Depth of the second emitter', min: 0, max: 5, step: 0.1, value: params.z || 1.5, unit: 'µm' },
        { id: 'nm', type: 'select', label: 'Wavelength', options: [['405 nm', 405], ['488 nm', 488], ['561 nm', 561], ['640 nm', 640]], value: 488 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['au', '1 Airy unit in the specimen'], ['in', 'In-focus emitter: light passed'], ['out', 'Deeper emitter: light passed'], ['sec', 'Optical section (about)'], ['lat', 'Lateral resolution λ / 2NA']]);
      const plot = kit.plot(gb, { x: { label: 'depth (µm)', min: 0, max: 5 }, y: { label: 'light passed (%)', min: 0, max: 100 }, legend: true }, 150);
      // the share of an emitter's light that passes the pinhole: the Airy energy inside it at focus, the geometric blur disc away from it
      function passed(z) {
        const lam = V.nm * 1e-3, rA = 0.61 * lam / V.NA, rp = V.pin * rA, th = Math.asin(Math.min(0.999, V.NA / V.n)), rb = Math.abs(z) * Math.tan(th);
        const xx = 3.83 * V.pin, enc = O.diff.encircled(xx);
        return rb < 1e-9 ? enc : Math.min(enc, Math.pow(rp / rb, 2));
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const lam = V.nm * 1e-3, rA = 0.61 * lam / V.NA, rp = V.pin * rA, th = Math.asin(Math.min(0.999, V.NA / V.n));
        const rb = Math.max(1e-6, V.z * Math.tan(th));
        // drawing: the pinhole is drawn 6 px per Airy unit; the blur disc of the deeper emitter follows in the true ratio
        const xs = 28, xo = W * 0.2, xt = W * 0.52, xp = W * 0.82, cy = Hh * 0.5, hA = Hh * 0.2, pinPx = clamp(V.pin * 6, 2.5, 18);
        const Lp = xp - xt, delta = 0.5 * Lp;
        const ht = Math.min(pinPx * (rb / Math.max(rp, 1e-6)) * (Lp - delta) / delta, hA * 1.05);
        S.axis(c, 10, cy, W - 10);
        S.thinLens(c, xo, cy, hA + 8, 40); S.thinLens(c, xt, cy, hA + 8, 40);
        S.slits(c, xp, cy, Hh * 0.4, [[cy - pinPx, cy + pinPx]], { w: 5 });
        c.fillStyle = C.ok; c.fillRect(xp + 34, cy - 12, 4, 24);
        const ex = xs, eo = xs - 14, nRay = 5;
        // in-focus emitter on the axis (green): parallel between the lenses, a point at the pinhole
        for (let k = 0; k < nRay; k++) {
          const u = -1 + 2 * k / (nRay - 1), y1 = cy + u * hA;
          S.ray(c, [[ex, cy], [xo, y1], [xt, y1], [xp, cy], [xp + 34, cy - u * hA * 34 / Lp]], { nm: 530, width: 1.2, arrows: false, alpha: 0.9 });
        }
        // deeper emitter (orange): focused before the pinhole, so a disc on the plate
        const apex = xp - delta;
        for (let k = 0; k < nRay; k++) {
          const u = -1 + 2 * k / (nRay - 1), y1 = cy + u * hA, y2 = cy + u * ht;
          const yAt = x => y2 + (cy - y2) * (x - xt) / (apex - xt), yp = yAt(xp), through = Math.abs(yp - cy) <= pinPx;
          S.ray(c, [[eo, cy], [xo, y1], [xt, y2], [xp, yp]].concat(through ? [[xp + 34, yAt(xp + 34)]] : []), { nm: 610, width: 1.2, arrows: false, alpha: through ? 0.95 : 0.55 });
        }
        c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(xs, 10); c.lineTo(xs, Hh - 10); c.stroke(); c.setLineDash([]);
        kit.dot(c, ex, cy, 3.5, '#3c9'); kit.dot(c, eo, cy, 3.5, '#e90');
        lab(kit, c, st, 'focal plane', xs, 14, { align: 'center', size: 10.5, color: C.faint });
        lab(kit, c, st, 'objective', xo, cy - hA - 20, { align: 'center', size: 10.5 });
        lab(kit, c, st, 'tube lens', xt, cy - hA - 20, { align: 'center', size: 10.5 });
        lab(kit, c, st, 'pinhole', xp, 14, { align: 'center', size: 10.5, color: C.text });
        lab(kit, c, st, 'detector', xp + 36, cy + 26, { align: 'center', size: 10.5, color: C.ok });
        lab(kit, c, st, 'deeper emitter', eo, cy + 22, { align: 'left', size: 10.5, color: '#e90' });
        const pts = [], ptsW = [];
        const p0 = passed(0);
        for (let z = 0; z <= 5.001; z += 0.1) { pts.push([z, passed(z) * 100]); ptsW.push([z, 100]); }
        plot.set({ series: [{ pts, label: 'confocal' }, { pts: ptsW, label: 'wide field', dash: true }], vlines: [{ x: V.z, label: 'emitter' }] });
        ro.set('au', num(2 * rA * 1e3, 0) + ' nm  (1.22 λ / NA)');
        ro.set('in', num(p0 * 100, 0) + ' %');
        ro.set('out', num(passed(V.z) * 100, 1) + ' %');
        ro.set('sec', num(O.scan.confocalAxial(V.nm, V.NA, V.n) * 1e6, 2) + ' µm  (1.4 λ n / NA²)');
        ro.set('lat', num(O.diff.abbe(V.nm, V.NA) * 1e9, 0) + ' nm (wide field)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the refractor */
  Hyper.sim('oi-refractor', {
    title: 'Refracting telescopes: Kepler and Galileo',
    blurb: `Parallel light from a distant object meets the objective, and the eyepiece turns it into a parallel beam at a larger angle. Two bundles are traced with thin lenses: from a point **on the axis** (green) and from a point **off the axis** by the angle you set (orange). The picture stretches heights (the label says by how much) so that a long telescope fits; the read-outs are exact.

**Try this**
- *Keplerian*, f_o = 1000 mm, f_e = 25 mm: M = 40. The off-axis bundle crosses the axis between the lenses, a real image forms (arrow), and the view is inverted. The beam leaving the eyepiece is a parallel strip D/M wide: the exit pupil.
- Switch to *Galilean*: the negative eyepiece sits *before* the focus, no real image forms, the view is upright, and the tube is shorter by twice the eyepiece focal length.
- Shrink the objective to 50 mm at M = 40: the exit pupil is 1.25 mm and the useful range (D/7 to 2D) is 7× to 100×: the telescope is far past its useful power.
- Raise the object angle: the apparent angle is M times larger (in tangents).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Form', options: [['Keplerian: positive eyepiece, inverted view', 'k'], ['Galilean: negative eyepiece, upright view', 'g']], value: params.type || 'k' },
        { id: 'fo', label: 'Objective focal length', min: 150, max: 1500, step: 10, value: params.fo || 1000, unit: 'mm' },
        { id: 'fe', label: 'Eyepiece focal length (size)', min: 8, max: 60, step: 1, value: params.fe || 25, unit: 'mm' },
        { id: 'D', label: 'Objective diameter', min: 30, max: 150, step: 5, value: params.D || 100, unit: 'mm' },
        { id: 'a', label: 'Angle of the off-axis object', min: 0, max: 1.5, step: 0.05, value: 0.5, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['M', 'Magnification'], ['L', 'Tube length'], ['dp', 'Exit pupil D / M'], ['er', 'Eye relief (thin lens)'], ['ang', 'Angle of the off-axis object'], ['res', 'Resolution at 550 nm'], ['use', 'Useful magnification D/7 … 2D'], ['grasp', 'Light grasp against a 7 mm pupil']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W;
        const kep = V.type === 'k', fe = kep ? V.fe : -V.fe, M = V.fo / V.fe, L = V.fo + fe, R = V.D / 2, al = V.a * D2R;
        const ER = kep ? V.fe * (1 + 1 / M) : 12, zEye = L + ER, dp = V.D / M;
        const lenses = [{ z: 0, f: V.fo }, { z: L, f: fe }];
        const zS = -0.07 * L, zEnd = zEye + 0.02 * L;
        // the rays (the off-axis bundle goes down, so its image is below the axis)
        const bundles = [], hE = [];
        for (const [u, nm] of [[0, 530], [-al, 620]]) for (const yp of [-0.92 * R, 0, 0.92 * R]) {
          const t = trace(yp - u * (0 - zS), u, zS, lenses, zEnd);
          bundles.push({ pts: t.pts, nm }); hE.push(Math.abs(t.pts[2] ? t.pts[2][1] : 0));
        }
        const he = Math.max(1.8 * R / M + 3, Math.max.apply(null, hE) * 1.15 + 2);
        const m = S.map(st, zS - 0.01 * L, zEye + 0.08 * L, Math.max(R * 1.12, he * 1.1), { left: 12, right: 12, top: 26, bottom: 44, stretch: 6 });
        S.axis(c, m.X(zS), m.y0, m.X(zEye + 0.06 * L));
        for (const b of bundles) S.ray(c, b.pts.map(p => [m.X(p[0]), m.Y(p[1])]), { nm: b.nm, width: 1.2, arrows: false, alpha: 0.9 });
        S.thinLens(c, m.X(0), m.y0, R * m.sy, V.fo, { color: C.accent });
        S.thinLens(c, m.X(L), m.y0, he * m.sy, fe, { color: C.accent });
        if (kep) {
          S.object(c, m.X(V.fo), m.y0, -V.fo * Math.tan(al) * m.sy, { color: C.ok, width: 2.4 });
          if (dp * m.sy > 2) { c.strokeStyle = C.text; c.lineWidth = 2.4; c.beginPath(); c.moveTo(m.X(zEye), m.Y(dp / 2)); c.lineTo(m.X(zEye), m.Y(-dp / 2)); c.stroke(); }
          lab(kit, c, st, 'real image', m.X(V.fo) - 3, m.y0 + 30, { align: 'right', size: 11, color: C.ok });
          lab(kit, c, st, 'exit pupil', m.X(zEye) + 3, m.y0 + 46, { align: 'left', size: 11, color: C.text });
        }
        S.eye(c, m.X(zEye + 7), m.y0, Math.max(7, 9 * m.s), { dir: -1 });
        lab(kit, c, st, 'objective', m.X(0), m.Y(R) - 10, { align: 'center', size: 11 });
        lab(kit, c, st, 'eyepiece', m.X(L), m.Y(he) - 10, { align: 'center', size: 11 });
        lab(kit, c, st, 'heights drawn ×' + m.stretch.toFixed(1) + '; the angles are exaggerated by the same factor', 10, st.H - 12, { align: 'left', size: 10.5, color: C.faint });
        const tp = Math.atan(M * Math.tan(al));
        ro.set('M', (kep ? '−' : '+') + num(M, 1) + ' ×  (' + (kep ? 'inverted' : 'upright') + ')');
        ro.set('L', num(L, 0) + ' mm' + (kep ? '  (f_o + f_e)' : '  (f_o − |f_e|)'));
        ro.set('dp', num(dp, 2) + ' mm' + (dp > 7 ? '  (more than any eye pupil)' : ''));
        ro.set('er', kep ? num(ER, 1) + ' mm' : 'the exit pupil is inside: the eye sits at the lens');
        ro.set('ang', num(V.a, 2) + '° → ' + num(tp * R2D, 2) + '°');
        const ray = O.diff.rayleighAngle(550, V.D / 1000) * R2D * 3600, daw = O.diff.dawes(V.D / 1000) * R2D * 3600;
        ro.set('res', num(ray, 2) + '″ (Rayleigh) · ' + num(daw, 2) + '″ (Dawes)');
        ro.set('use', num(V.D / 7, 0) + '× … ' + num(2 * V.D, 0) + '×  →  ' + (M < V.D / 7 ? 'below: exit pupil too large' : M > 2 * V.D ? 'above: empty magnification' : 'in range'));
        ro.set('grasp', num(Math.pow(V.D / 7, 2), 0) + ' ×' + (!kep && M > 6 ? '   (a Galilean telescope this strong would have a tiny field)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the reflector */
  Hyper.sim('oi-reflector', {
    title: 'Reflecting telescopes: Newtonian, Cassegrain and Ritchey–Chrétien',
    blurb: `A 200 mm mirror telescope traced ray by ray. The picture shows the light path (heights drawn to scale; the primary is at the right-hand end, light enters from the left); the two boxes on the right are **spot diagrams** at the best focus, on axis and at the field angle you choose, each 50 µm across, with the dashed circle the Airy disc for that focal ratio. The Ritchey–Chrétien's two conic constants are solved so that its spherical aberration and coma are both zero.

**Try this**
- *Spherical mirror, f/5*: a 25 µm rms blur against a 3.4 µm Airy radius. Change to *Newtonian* (a paraboloid): the on-axis spot is a perfect point.
- Newtonian at 0.25°: a comet-shaped flare (coma). Lengthen the focal length to f/8: it shrinks.
- Compare the *classical Cassegrain* and the *Ritchey–Chrétien* at 0.25°: the RC spot is smaller and rounder.
- Raise the secondary magnification m: the telescope gets longer in focal length (f/10 … f/24) and the obstruction shrinks.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const D = 200, TYPES = [['Newtonian: paraboloid and flat', 'newt'], ['Spherical mirror (for comparison)', 'sph'], ['Classical Cassegrain', 'cass'], ['Ritchey–Chrétien', 'rc']];
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Telescope', options: TYPES, value: params.type || 'newt' },
        { id: 'f', label: 'Focal length of the mirror', min: 800, max: 1600, step: 50, value: params.f || 1000, unit: 'mm' },
        { id: 'm', label: 'Magnification of the secondary', min: 2.5, max: 6, step: 0.1, value: params.m || 4, fmt: v => '×' + v.toFixed(1) },
        { id: 'fld', label: 'Field angle', min: 0, max: 0.6, step: 0.05, value: params.fld != null ? params.fld : 0.25, unit: '°' }
      ], (id) => { if (id === 'type') showFor(); loop.once(); });
      const V = ctl.values;
      const showFor = () => { const nw = V.type === 'newt' || V.type === 'sph'; ctl.show('f', nw); ctl.show('m', !nw); };
      showFor();
      const ro = kit.readout(box.side, [['f', 'Focal length · focal ratio'], ['obs', 'Secondary mirror'], ['k', 'Conic constants'], ['ax', 'Blur on axis (rms)'], ['of', 'Blur at the field angle (rms)'], ['airy', 'Airy disc radius'], ['v', 'Limited by']]);
      const cass = (m, k1, k2) => { const s = O.design.cassegrain({ f1: 800, m, b: 150, D }); s.surfaces[0].k = k1; s.surfaces[1].k = k2; return s; };
      const rcCache = {};
      function rcK(m) {
        const key = m.toFixed(2);
        if (rcCache[key]) return rcCache[key];
        const k20 = -Math.pow((m + 1) / (m - 1), 2), val = (k1, k2) => { const q = Sy.seidel(cass(m, k1, k2), { field: 0.25 * D2R }); return [q.S1, q.S2]; };
        const a0 = val(-1, k20), a1 = val(-1.1, k20), a2 = val(-1, k20 - 0.1);
        const d1 = [(a1[0] - a0[0]) / -0.1, (a1[1] - a0[1]) / -0.1], d2 = [(a2[0] - a0[0]) / -0.1, (a2[1] - a0[1]) / -0.1], det = d1[0] * d2[1] - d1[1] * d2[0];
        const x = (-a0[0] * d2[1] + a0[1] * d2[0]) / det, y = (-d1[0] * a0[1] + d1[1] * a0[0]) / det;
        return (rcCache[key] = fin(x) && fin(y) ? [-1 + x, k20 + y] : [-1.04, k20]);
      }
      function build() {
        if (V.type === 'newt') return O.design.newtonian({ f: V.f, D });
        if (V.type === 'sph') return O.design.newtonian({ f: V.f, D, k: 0 });
        if (V.type === 'cass') return cass(V.m, -1, -Math.pow((V.m + 1) / (V.m - 1), 2));
        const k = rcK(V.m); return cass(V.m, k[0], k[1]);
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const sys = build(), par = Sy.paraxial(sys, 550), fld = V.fld * D2R, newt = V.type === 'newt' || V.type === 'sph', R = D / 2;
        const rw = clamp(W * 0.3, 100, 170), mw = W - rw - 6;
        const sub = { W: mw, H: Hh };
        // the light path
        let zMin, zMax, yHalf;
        if (newt) { zMin = -par.efl * 1.06; zMax = par.efl * 0.07; yHalf = Math.max(R * 1.2, (R + 28) * 1.2); }
        else { const dd = sys.d, zi = par.zImage; zMin = -dd - 0.12 * dd; zMax = zi + 0.18 * dd; yHalf = R * 1.25; }
        const m = S.map(sub, zMin, zMax, yHalf, { left: 10, right: 8, top: 22, bottom: 24 });
        S.axis(c, m.X(zMin), m.y0, m.X(zMax));
        const eOff = R + 25, zf = -(par.efl - eOff), minor = D * eOff / par.efl + 6;
        if (newt) {
          // the tube, the primary, the flat at 45° and the focuser
          c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath(); c.moveTo(m.X(zMin * 1.0), m.Y(R + 12)); c.lineTo(m.X(0), m.Y(R + 12)); c.moveTo(m.X(zMin), m.Y(-R - 12)); c.lineTo(m.X(0), m.Y(-R - 12)); c.stroke();
          S.system(c, sys, m, { stop: false });
          const fan = Sy.fan2d(sys, { nm: 550, n: 9, field: fld, fill: 0.98, zStart: zMin, zEnd: -par.efl * 1.3 });
          for (const r of fan) {
            const P = r.pts[1], Q = r.pts[r.pts.length - 1], Pb = r.pts[r.pts.length - 2];
            if (!P || !Q) continue;
            const dl = Math.hypot(Q[0] - Pb[0], Q[1] - Pb[1]) || 1, dz = (Q[0] - Pb[0]) / dl, dy = (Q[1] - Pb[1]) / dl;
            // the rays that would hit the back of the flat are cut off
            if (Math.abs(r.pts[0][1]) < minor / 2) { S.ray(c, [[m.X(r.pts[0][0]), m.Y(r.pts[0][1])], [m.X(zf), m.Y(r.pts[0][1])]], { color: C.faint, alpha: 0.5, width: 1, arrows: false }); continue; }
            const s = (-(P[0] - zf) - P[1]) / (dy + dz), Qp = [P[0] + s * dz, P[1] + s * dy];
            const total = Math.hypot(P[0] - (-par.efl), P[1] - Math.tan(fld) * par.efl), rest = Math.max(0, total - Math.abs(s));
            const ny = -dz, nz = -dy, End = [Qp[0] + rest * nz, Qp[1] + rest * ny];
            S.ray(c, [[m.X(r.pts[0][0]), m.Y(r.pts[0][1])], [m.X(P[0]), m.Y(P[1])], [m.X(Qp[0]), m.Y(Qp[1])], [m.X(End[0]), m.Y(End[1])]], { nm: 550, width: 1.2, arrows: false, alpha: r.ok ? 0.9 : 0.4 });
          }
          const hf = minor / 2 * Math.SQRT1_2 * 1.45;
          S.flatMirror(c, m.X(zf - hf), m.Y(hf), m.X(zf + hf), m.Y(-hf), { hatch: false });
          c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(m.X(zf) - 9, m.Y(eOff) - 2); c.lineTo(m.X(zf) + 9, m.Y(eOff) - 2); c.stroke();
          lab(kit, c, st, 'flat', m.X(zf), m.Y(-minor * 0.5) + 14, { align: 'center', size: 11 });
          lab(kit, c, st, 'primary', Math.min(sub.W - 30, m.X(0) - 4), m.Y(R) - 10, { align: 'right', size: 11 });
          lab(kit, c, st, 'focus (side of the tube)', Math.max(8, m.X(zf) - 12), m.Y(eOff) - 12, { align: 'left', size: 11, color: C.muted });
        } else {
          c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath(); c.moveTo(m.X(-sys.d - 12), m.Y(R + 12)); c.lineTo(m.X(0), m.Y(R + 12)); c.moveTo(m.X(-sys.d - 12), m.Y(-R - 12)); c.lineTo(m.X(0), m.Y(-R - 12)); c.stroke();
          S.system(c, sys, m, { stop: false });
          const sd2 = sys.surfaces[1].sd, fan = Sy.fan2d(sys, { nm: 550, n: 9, field: fld, fill: 0.98, zStart: -sys.d - 0.1 * sys.d, zEnd: par.zImage + 0.1 * sys.d });
          for (const r of fan) {
            if (Math.abs(r.pts[0][1]) < sd2 + 1) { S.ray(c, [[m.X(r.pts[0][0]), m.Y(r.pts[0][1])], [m.X(-sys.d), m.Y(r.pts[0][1])]], { color: C.faint, alpha: 0.5, width: 1, arrows: false }); continue; }
            S.ray(c, r.pts.map(p => [m.X(p[0]), m.Y(p[1])]), { nm: 550, width: 1.2, arrows: false, alpha: r.ok ? 0.9 : 0.4 });
          }
          c.fillStyle = C.bg2; c.fillRect(m.X(0) - 3, m.Y(sd2 * 0.95), 8, sd2 * 1.9 * m.sy);
          lab(kit, c, st, 'primary', Math.min(sub.W - 30, m.X(0) + 4), m.Y(R) - 10, { align: 'right', size: 11 });
          lab(kit, c, st, 'secondary', m.X(-sys.d), m.Y(sd2) - 10, { align: 'left', size: 11 });
          lab(kit, c, st, 'focus', m.X(par.zImage), m.y0 + 16, { align: 'center', size: 11, color: C.muted });
        }
        // spot diagrams at the best focus
        const airy = O.diff.airyRadius(550, par.fno) * 1e3, half = 0.025, bs = Math.max(60, Math.min(rw - 18, (Hh - 100) / 2));
        [[0, 'on axis'], [fld, 'at ' + V.fld.toFixed(2) + '°']].forEach(([fa, name], i) => {
          const bf = Sy.bestFocus(sys, { nm: 550, field: fa, rings: 5 }), sp = Sy.spot(sys, { nm: 550, rings: 6, field: fa, z: bf.z });
          const bx = mw + 6 + rw / 2, by = 24 + bs / 2 + i * (bs + 38);
          c.fillStyle = C.surface; c.fillRect(bx - bs / 2, by - bs / 2, bs, bs);
          S.spot(c, sp, bx, by, bs / 2, bs / 2 / half, { airy, nm: 550 });
          lab(kit, c, st, name, bx, by - bs / 2 - 9, { align: 'center', size: 11, color: C.text });
          lab(kit, c, st, 'rms ' + (sp.rms * 1e3).toFixed(1) + ' µm', bx, by + bs / 2 + 11, { align: 'center', size: 10.5, color: C.muted });
          if (i === 0) rms0 = sp.rms * 1e3; else rms1 = sp.rms * 1e3;
        });
        lab(kit, c, st, 'boxes 50 µm; dashed = Airy disc', W - 6, Hh - 8, { align: 'right', size: 10, color: C.faint });
        const obsD = newt ? minor : 2 * sys.surfaces[1].sd;
        const k = newt ? [sys.surfaces[0].k, null] : [sys.surfaces[0].k, sys.surfaces[1].k];
        ro.set('f', num(par.efl, 0) + ' mm · f/' + num(par.fno, 1));
        ro.set('obs', (newt ? 'flat, minor axis ' : 'diameter ') + num(obsD, 0) + ' mm: ' + num(obsD / D * 100, 0) + ' % of D, ' + num(Math.pow(obsD / D, 2) * 100, 1) + ' % of the area');
        ro.set('k', newt ? 'primary k = ' + num(k[0], 0) + (k[0] === 0 ? ' (sphere)' : ' (paraboloid)') : 'k₁ = ' + num(k[0], 3) + ', k₂ = ' + num(k[1], 3));
        ro.set('ax', num(rms0, 2) + ' µm');
        ro.set('of', num(rms1, 2) + ' µm');
        ro.set('airy', num(airy * 1e3, 2) + ' µm');
        ro.set('v', rms1 < airy * 1e3 ? 'diffraction (aberrations smaller than the Airy disc)' : 'aberrations at this field angle');
      }, box.stage);
      let rms0 = 0, rms1 = 0;
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ exit pupil */
  Hyper.sim('oi-exit-pupil', {
    title: 'The exit pupil, the eye relief and the eye in the wrong place',
    blurb: `One barrel of a telescope or binocular: objective, eyepiece, and the exit pupil where all the beams cross. The beam from the middle of the field (grey) is a parallel strip as wide as the exit pupil; the beams from the two edges of the field (orange, violet) cross the axis at the exit pupil. The eye's iris is the pair of bars; drag the eye along the axis (or use the slider). The graph shows how much of the beam from the *edge* of the field enters the pupil. Heights are stretched (the label says by how much).

**Try this**
- Eye on the exit pupil: all three beams pass through the iris. Move the eye 10 mm back: the beams from the edges of the field slide off the pupil, and the picture darkens at its edge (the kidney-bean shadow).
- Switch the eye pupil to *Night, 7 mm* with an exit pupil of 5.25 mm: the whole beam enters and the eye position matters little. At *Bright day, 2.5 mm* it is the reverse: half the exit pupil is wasted.
- Raise M to 16 at the same D: the exit pupil shrinks to 2.6 mm and the eye must be placed more exactly.
- Read the *eye relief* against 15 mm, what spectacles need.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const bino = params.view === 'binocular';
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 8px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'M', label: 'Magnification', min: 3, max: 20, step: 0.5, value: params.M || 8, fmt: v => '×' + v.toFixed(1) },
        { id: 'D', label: 'Objective diameter', min: 20, max: 70, step: 1, value: params.D || 42, unit: 'mm' },
        { id: 'fe', label: 'Eyepiece focal length', min: 10, max: 40, step: 1, value: params.fe || 20, unit: 'mm' },
        { id: 'af', label: 'Apparent field of view', min: 40, max: 80, step: 1, value: params.af || 60, unit: '°' },
        { id: 'de', type: 'select', label: 'The eye\'s pupil', options: [['Bright day, 2.5 mm', 2.5], ['Overcast, 3.5 mm', 3.5], ['Dusk, 5 mm', 5], ['Night, young eye, 7 mm', 7]], value: params.de || 3.5 },
        { id: 'dz', label: 'Eye position from the exit pupil', min: -25, max: 25, step: 0.5, value: params.dz != null ? params.dz : (bino ? 0 : 5), unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const rows = [['dp', 'Exit pupil D / M'], ['er', 'Eye relief (thin lens)'], ['gl', 'Spectacles'], ['br', 'Scene brightness against the naked eye'], ['ed', 'Field-edge light entering the eye']];
      if (bino) rows.push(['tf', 'True field (apparent ÷ M) · width at 1000 m'], ['tw', 'Twilight factor √(M·D)']);
      const ro = kit.readout(box.side, rows);
      const plot = kit.plot(gb, { x: { label: 'eye position (mm)', min: -25, max: 25 }, y: { label: 'edge light (%)', min: 0, max: 105 }, legend: false }, 110);
      let last = null;
      kit.drag(st, { hover: true, hit: p => last && Math.abs(p.x - last.xe) < 24 && Math.abs(p.y - last.y0) < 40 ? 'eye' : null, move: (w, p) => { if (!last) return; const z = last.m.Z(p.x - 10) - last.zEp; ctl.set('dz', clamp(Math.round(z * 2) / 2, -25, 25)); loop.once(); } });
      const edgeFrac = (dpx, de, dz, psi) => { const a = dpx / 2, b = de / 2, off = Math.abs(dz) * Math.tan(psi), full = Math.PI * Math.min(a, b) * Math.min(a, b); return off < 1e-9 ? 1 : overlap(a, b, off) / full; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W;
        const M = V.M, fe = V.fe, fo = M * fe, L = fo + fe, ER = fe * (1 + 1 / M), dp = V.D / M, psi = V.af / 2 * D2R, al = Math.atan(Math.tan(psi) / M), R = V.D / 2;
        const zEp = L + ER, zEye = zEp + V.dz, de = V.de;
        const he = Math.max(1.2 * dp / 2 + ER * Math.tan(psi) + 3, 6);
        const zS = -0.06 * L, lenses = [{ z: 0, f: fo }, { z: L, f: fe }];
        const m = S.map({ W: W - 20, H: st.H }, zS, zEp + 40, Math.max(R * 1.12, he * 1.15), { left: 8, right: 8, top: 20, bottom: 28, stretch: 6 });
        c.save(); c.translate(10, 0);
        S.axis(c, m.X(zS), m.y0, m.X(zEp + 36));
        const drawB = (u, nm, alpha) => {
          for (const yp of [-0.92 * R, 0, 0.92 * R]) {
            const t = trace(yp - u * (0 - zS), u, zS, lenses, zEye);
            const pts = t.pts.map(p => [m.X(p[0]), m.Y(p[1])]);
            S.ray(c, pts, { nm, width: 1.1, arrows: false, alpha });
            // beyond the iris only what passes through it
            const ye = t.y, slope = t.u;
            if (Math.abs(ye) <= de / 2) S.ray(c, [[m.X(zEye), m.Y(ye)], [m.X(zEye + 12), m.Y(ye + slope * 12)]], { nm, width: 1.4, arrows: false, alpha: 1 });
          }
        };
        drawB(0, 560, 0.55); drawB(-al, 620, 0.85); drawB(al, 430, 0.85);
        S.thinLens(c, m.X(0), m.y0, R * m.sy, fo, { color: C.accent });
        S.thinLens(c, m.X(L), m.y0, he * m.sy, fe, { color: C.accent });
        // the exit pupil and the iris
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(m.X(zEp), m.Y(dp / 2 + 3)); c.lineTo(m.X(zEp), m.Y(-dp / 2 - 3)); c.stroke(); c.setLineDash([]);
        S.stop(c, m.X(zEye), m.y0, 14 * m.sy, (de / 2) * m.sy, { color: C.text, width: 3 });
        c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.ellipse(m.X(zEye + 12), m.y0, 12 * m.s, 13 * m.sy, 0, -Math.PI / 2, Math.PI / 2); c.stroke();
        c.restore();
        const X0 = x => x + 10;
        lab(kit, c, st, 'objective', X0(m.X(0)), m.Y(R) - 9, { align: 'center', size: 11 });
        lab(kit, c, st, 'eyepiece', X0(m.X(L)), m.Y(he) - 9, { align: 'center', size: 11 });
        lab(kit, c, st, 'exit pupil', X0(m.X(zEp)), m.y0 + 14 * m.sy + 11, { align: 'center', size: 11, color: C.text });
        lab(kit, c, st, 'eye', X0(m.X(zEye + 12)), m.y0 + 14 * m.sy + 25, { align: 'center', size: 11, color: C.muted });
        lab(kit, c, st, 'heights drawn ×' + m.stretch.toFixed(1), 8, st.H - 9, { size: 10, color: C.faint });
        last = { m: { Z: x => m.Z(x) }, zEp, xe: X0(m.X(zEye)), y0: m.y0 };
        const pts = [], pc = [];
        for (let d = -25; d <= 25.01; d += 1) { pts.push([d, 100 * edgeFrac(dp, de, d, psi)]); pc.push([d, 100]); }
        plot.set({ series: [{ pts, label: 'field edge' }], vlines: [{ x: V.dz, label: '' }] });
        const fe_ = edgeFrac(dp, de, V.dz, psi);
        ro.set('dp', num(dp, 2) + ' mm');
        ro.set('er', num(ER, 1) + ' mm behind the eyepiece (thin-lens value)');
        ro.set('gl', ER >= 15 ? 'room for glasses (needs 15 to 20 mm)' : 'too close for glasses');
        ro.set('br', num(Math.min(1, Math.pow(dp / de, 2)) * 100, 0) + ' %' + (dp > de ? '  (exit pupil larger than the eye\'s: light wasted)' : '  (the eye can take more)'));
        ro.set('ed', num(fe_ * 100, 0) + ' %' + (fe_ < 0.6 ? '  (the edge of the picture fades)' : ''));
        if (bino) {
          const tfd = V.af / M; ro.set('tf', num(tfd, 2) + '° · ' + num(2000 * Math.tan(tfd * D2R / 2), 0) + ' m');
          ro.set('tw', num(Math.sqrt(M * V.D), 1));
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ relay, periscope, bundle */
  Hyper.sim('oi-relay', {
    title: 'Carrying a view: periscope, relay lenses and a fibre bundle',
    blurb: `Three instruments, chosen from the list. **Relay-lens borescope**: the objective forms an inverted real image (arrow), and every relay lens re-forms it 1:1 farther down the tube and inverts it again; three rays from the tip of each image show the path. **Periscope**: two parallel 45° mirrors; the rays from the top, middle and bottom of the scene stay in order, so the image is upright and the same size. **Coherent fibre bundle**: the picture is sampled by as many fibres as the bundle holds, one picture element each, and broken fibres leave black dots.

**Try this**
- Relay borescope with 0 relays: the view is inverted. With 1: upright. Each added relay flips it again, so working instruments have an odd number.
- Periscope: lengthen it; only the sideways shift changes.
- Bundle: shrink the fibre spacing or widen the bundle and the picture sharpens; the fine stripes along the bottom show what is lost. Add broken fibres.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 310 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Instrument', options: [['Relay-lens borescope', 'relay'], ['Periscope with two mirrors', 'peri'], ['Coherent fibre bundle', 'bundle']], value: params.mode || 'relay' },
        { id: 'N', label: 'Relay stages', min: 0, max: 6, step: 1, value: params.N != null ? params.N : 3 },
        { id: 'L', label: 'Distance between the mirrors', min: 0.3, max: 3, step: 0.1, value: 1.5, unit: 'm' },
        { id: 'D', label: 'Bundle diameter', min: 0.3, max: 3, step: 0.1, value: 1, unit: 'mm' },
        { id: 'p', label: 'Fibre spacing', min: 3, max: 12, step: 0.5, value: 8, unit: 'µm' },
        { id: 'br', label: 'Broken fibres', min: 0, max: 10, step: 1, value: 2, unit: '%' }
      ], (id) => { if (id === 'mode') showFor(); loop.once(); });
      const V = ctl.values;
      const showFor = () => { ctl.show('N', V.mode === 'relay'); ctl.show('L', V.mode === 'peri'); for (const k of ['D', 'p', 'br']) ctl.show(k, V.mode === 'bundle'); };
      showFor();
      const ro = kit.readout(box.side, [['a', 'Image'], ['b', 'Detail'], ['c', 'Note']]);
      const hash = (i, j) => { const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return v - Math.floor(v); };
      // a test picture: a disc, bars, a ring and stripes that get finer to the right
      const scene = (u, v) => {
        if (v > 0.78) { const f = 6 + 70 * u * u; return Math.sin(f * u * 6.283) > 0 ? 0.95 : 0.12; }
        const d1 = Math.hypot(u - 0.3, v - 0.34), d2 = Math.hypot(u - 0.72, v - 0.36);
        let b = 0.2;
        if (d1 < 0.17) b = 0.95;
        if (d2 < 0.17 && d2 > 0.12) b = 0.85;
        if (u > 0.2 && u < 0.4 && v > 0.58 && v < 0.7 && ((u - 0.2) * 20 | 0) % 2 === 0) b = 0.9;
        return b;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (V.mode === 'relay') {
          const N = Math.round(V.N), P = 2.4, Rt = 1, hl = 0.82, ho = 0.42;
          const zMin = -P - 0.5, zMax = N * P + 2.2;
          const m = S.map(st, zMin, zMax, 1.35, { left: 12, right: 12, top: 44, bottom: 40, stretch: 4 });
          S.axis(c, m.X(zMin), m.y0, m.X(zMax));
          c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath();
          c.moveTo(m.X(-P / 2 - 0.3), m.Y(Rt)); c.lineTo(m.X(N * P + 0.5), m.Y(Rt)); c.moveTo(m.X(-P / 2 - 0.3), m.Y(-Rt)); c.lineTo(m.X(N * P + 0.5), m.Y(-Rt)); c.stroke();
          const sign = k => (k % 2 === 0 ? -1 : 1);                    // image k: −1 inverted … object is +1
          // rays: from the tip of each image through its lens to the tip of the next one (1:1)
          const tips = [[-P, ho]];
          for (let k = 0; k <= N; k++) tips.push([k * P, sign(k) * ho]);
          for (let k = 0; k <= N; k++) {
            const a = tips[k], b = tips[k + 1], zl = (a[0] + b[0]) / 2;
            for (const hh of [-0.62 * hl, 0, 0.62 * hl]) S.ray(c, [[m.X(a[0]), m.Y(a[1])], [m.X(zl), m.Y(hh)], [m.X(b[0]), m.Y(b[1])]], { nm: 575, width: 1.1, arrows: false, alpha: 0.85 });
            S.thinLens(c, m.X(zl), m.y0, hl * m.sy, P / 4, { color: k === 0 ? C.accent : C.muted, width: k === 0 ? 2.2 : 1.6 });
          }
          S.object(c, m.X(-P), m.y0, ho * m.sy, { color: C.accent, width: 2.6 });
          for (let k = 0; k <= N; k++) S.object(c, m.X(k * P), m.y0, sign(k) * ho * m.sy, { color: C.ok, width: 2.2 });
          const ze = N * P + 0.75;
          S.thinLens(c, m.X(ze), m.y0, 0.6 * m.sy, 0.7, { color: C.accent });
          S.eye(c, m.X(ze + 1.1), m.y0, Math.max(8, 0.8 * m.s), { dir: -1 });
          lab(kit, c, st, 'object', m.X(-P), m.y0 + ho * m.sy + 14, { align: 'center', size: 10.5, color: C.accent });
          lab(kit, c, st, 'objective', m.X(-P / 2), m.Y(hl) - 8, { align: 'center', size: 10.5 });
          if (N > 0) lab(kit, c, st, N === 1 ? 'relay' : 'relays', m.X(P), m.Y(hl) - 8, { align: 'center', size: 10.5, color: C.muted });
          lab(kit, c, st, 'eyepiece', m.X(ze), m.Y(0.6) - 8, { align: 'center', size: 10.5 });
          lab(kit, c, st, 'green arrows: real images; each lens flips the image', 12, 16, { size: 11, color: C.muted });
          lab(kit, c, st, 'tube heights drawn ×' + m.stretch.toFixed(1), 12, Hh - 10, { size: 10, color: C.faint });
          const up = (N + 1) % 2 === 0;
          ro.set('a', up ? 'upright' : 'inverted');
          ro.set('b', (N + 1) + ' real images; objective and ' + N + (N === 1 ? ' relay' : ' relays') + ' = ' + (N + 1) + ' inversions');
          ro.set('c', up ? 'an odd number of relays erects the view' : 'an even number leaves it inverted: add a prism or another relay');
        } else if (V.mode === 'peri') {
          const Hp = clamp(0.2 + 0.8 * V.L / 3, 0.25, 1) * (Hh - 100), yt = 44, yb = yt + Hp, xt = W * 0.5, xs = 40, xe = W - 40, hh = 14;
          c.strokeStyle = C.faint; c.lineWidth = 1.3; c.strokeRect(xt - 30, yt - 28, 60, Hp + 56);
          for (const dy of [-hh, 0, hh]) S.ray(c, [[xs + 22, yt + dy], [xt + dy, yt + dy], [xt + dy, yb + dy], [xe - 20, yb + dy]], { nm: 575, width: 1.3, arrows: true, minArrow: 40 });
          S.flatMirror(c, xt - 24, yt - 24, xt + 24, yt + 24, {});
          S.flatMirror(c, xt - 24, yb - 24, xt + 24, yb + 24, {});
          S.object(c, xs, yt + hh, 2 * hh, { color: C.accent, width: 2.6 });
          S.object(c, xe - 8, yb + hh, 2 * hh, { color: C.ok, width: 2.4, dash: true });
          S.dim(c, xt - 52, yt, xt - 52, yb, 'L = ' + V.L.toFixed(1) + ' m', { off: 14 });
          lab(kit, c, st, 'scene', xs, yt + hh + 16, { align: 'center', size: 11, color: C.accent });
          lab(kit, c, st, 'what the eye sees', xe - 6, yb + hh + 16, { align: 'right', size: 11, color: C.ok });
          lab(kit, c, st, 'two mirrors, parallel at 45°', xt + 40, yt - 20, { align: 'left', size: 11, color: C.muted });
          ro.set('a', 'upright, the same size, not reversed');
          ro.set('b', 'sideways shift of the line of sight: ' + V.L.toFixed(1) + ' m');
          ro.set('c', 'no magnification; the field is limited by the width of the tube against its length');
        } else {
          const N = Math.PI * V.D * V.D * 1e6 / (4 * 0.866 * V.p * V.p), nx = Math.max(8, Math.round(Math.sqrt(N))), nd = Math.min(nx, 240);
          const side = Math.min((W - 36) / 2, Hh - 50), x1 = 12, x2 = W - 12 - side, y = 22;
          S.image(c, x1, y, side, side, 160, 160, (u, v) => scene(u, v), { key: 'scene', id: 'sc', smooth: true });
          const key = ['b', nd, V.br].join('|');
          S.image(c, x2, y, side, side, nd, nd, (u, v) => { const i = Math.min(nd - 1, (u * nd) | 0), j = Math.min(nd - 1, (v * nd) | 0); if (hash(i, j) < V.br / 100) return 0; return scene((i + 0.5) / nd, (j + 0.5) / nd); }, { key, id: 'bd', smooth: false });
          c.strokeStyle = C.grid; c.strokeRect(x1, y, side, side); c.strokeRect(x2, y, side, side);
          lab(kit, c, st, 'the scene', x1 + side / 2, y - 9, { align: 'center', size: 11 });
          lab(kit, c, st, 'through the bundle', x2 + side / 2, y - 9, { align: 'center', size: 11, color: C.ok });
          lab(kit, c, st, nd < nx ? 'drawn with ' + nd + ' × ' + nd + ' cells' : 'one cell per fibre', x2 + side / 2, y + side + 12, { align: 'center', size: 10.5, color: C.faint });
          ro.set('a', num(N, 0) + ' fibres: about ' + nx + ' × ' + nx + ' picture elements');
          ro.set('b', 'one element = one fibre, ' + V.p.toFixed(1) + ' µm apart; ' + num(N * V.br / 100, 0) + ' dark (broken)');
          ro.set('c', 'a sensor of 1 megapixel has ' + num(1e6 / N, 0) + ' times more elements');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the projector */
  Hyper.sim('oi-projector', {
    title: 'A projector: object just outside the focal length',
    blurb: `A bright panel just outside the focal length of the projection lens, a condenser that images the lamp into that lens, and a screen far away. The three rays from the panel's top edge go to the top of the picture, which is inverted (the slide is loaded upside down). The picture is drawn at a magnification of at most 5 so that it fits; the read-outs use the real magnification, throw and brightness.

**Try this**
- 36 mm slide, f = 100 mm, screen 1.8 m wide: m = 50, the lens 102 mm from the slide, the screen 5.1 m away.
- Lengthen f to 200 mm: the same picture width needs twice the throw.
- Double the screen width: the throw doubles, the lux fall to a quarter.
- Switch to the small panel (14 mm) and f = 25 mm: a throw ratio near 1.8, like a data projector.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const PAN = [['35 mm slide, 36 mm wide (3 : 2)', 0], ['Large LCD panel, 22 mm wide (16 : 9)', 1], ['Small panel, 14 mm wide (16 : 9)', 2]], PW = [[36, 1.5], [22, 16 / 9], [14, 16 / 9]];
      const ctl = kit.controls(box.side, [
        { id: 'pan', type: 'select', label: 'Object (panel)', options: PAN, value: params.pan || 0 },
        { id: 'f', label: 'Focal length of the projection lens', min: 25, max: 250, step: 1, value: params.f || 100, unit: 'mm' },
        { id: 'W', label: 'Picture width on the screen', min: 0.5, max: 5, step: 0.1, value: params.W || 1.8, unit: 'm' },
        { id: 'phi', label: 'Light output of the lamp', min: 200, max: 10000, log: true, value: params.phi || 3000, sig: 2, unit: 'lm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['m', 'Magnification'], ['so', 'Panel to lens'], ['si', 'Lens to screen (throw)'], ['tr', 'Throw ratio'], ['A', 'Picture area'], ['E', 'Illuminance on the screen'], ['L', 'Luminance of a matt white screen'], ['foc', 'Lens travel between 3 m and 6 m']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const [wp, asp] = PW[V.pan], wm = wp / 1000, m = V.W / wm, f = V.f;
        const lens = O.thinLens(f, f * (1 + 1 / m)), so = f * (1 + 1 / m), si = f * (1 + m), Hs = V.W / asp, A = V.W * Hs;
        const md = Math.min(m, 5), fd = 0.06 * W, y0 = Hh * 0.5, hp = Hh * 0.15;
        const xl0 = W * 0.06, xc = W * 0.17, xp = W * 0.27, xl = xp + fd * (1 + 1 / md), xs = xl + fd * (1 + md), hl = Hh * 0.16;
        S.axis(c, 8, y0, W - 8);
        // lighting: the lamp is imaged into the projection lens
        const hc = clamp(0.62 * hp * (xl - xc) / (xl - xp), 8, Hh * 0.28);
        for (const s of [-1, 1]) S.ray(c, [[xl0 + 8, y0], [xc, y0 + s * hc], [xl, y0]], { nm: 590, alpha: 0.45, width: 1, arrows: false });
        // imaging: three rays from the top of the panel to the top of the picture
        const tip = y0 - hp / 2, img = y0 + md * hp / 2;
        for (const Y of [-0.8 * hl, 0, 0.8 * hl]) S.ray(c, [[xp, tip], [xl, y0 + Y], [xs, img]], { nm: 560, width: 1.2, arrows: false, alpha: 0.9 });
        for (const Y of [-0.8 * hl, 0, 0.8 * hl]) S.ray(c, [[xp, y0 + hp / 2], [xl, y0 + Y], [xs, y0 - md * hp / 2]], { nm: 620, width: 1.1, arrows: false, alpha: 0.7 });
        S.source(c, xl0, y0, { kind: 'bulb', size: 14 });
        S.thinLens(c, xc, y0, hc + 6, 1, { color: C.accent });
        c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(xp - 3, y0 - hp / 2 - 4, 6, hp + 8);
        S.object(c, xp, y0 + hp / 2, hp, { color: C.accent, width: 2.4 });
        S.thinLens(c, xl, y0, hl, f, { color: C.accent });
        S.screen(c, xs, y0, md * hp / 2 + 10, {});
        S.object(c, xs - 3, y0 - md * hp / 2, -md * hp, { color: C.ok, width: 2.6 });
        lab(kit, c, st, 'lamp', xl0, y0 - 26, { align: 'center', size: 10.5 });
        lab(kit, c, st, 'condenser', xc, y0 + hc + 22, { align: 'center', size: 10.5, color: C.muted });
        lab(kit, c, st, 'panel', xp, y0 - hp / 2 - 14, { align: 'center', size: 10.5, color: C.accent });
        lab(kit, c, st, 'lens', xl, y0 + hl + 14, { align: 'center', size: 10.5 });
        lab(kit, c, st, 'screen', xs, y0 - md * hp / 2 - 18, { align: 'center', size: 10.5, color: C.ok });
        lab(kit, c, st, m > 5 ? 'drawn at m = 5; the real m is ' + num(m, 0) + ' and the screen much farther' : 'drawn to the true magnification', 10, Hh - 10, { size: 10.5, color: C.faint });
        const so3 = f * 3000 / (3000 - f), so6 = f * 6000 / (6000 - f);
        ro.set('m', num(m, 1) + ' ×  (' + (wp) + ' mm → ' + num(V.W * 1000, 0) + ' mm)');
        ro.set('so', num(so, 2) + ' mm  (f + ' + num(so - f, 2) + ' mm)');
        ro.set('si', num(si / 1000, 2) + ' m');
        ro.set('tr', num(si / 1000 / V.W, 2) + '  (about f ÷ panel width = ' + num(f / wp, 2) + ')');
        ro.set('A', num(V.W, 2) + ' × ' + num(Hs, 2) + ' m = ' + num(A, 2) + ' m²');
        ro.set('E', num(V.phi / A, 0) + ' lx  (lumens ÷ area)');
        ro.set('L', num(V.phi / A / Math.PI, 0) + ' cd/m² at gain 1');
        ro.set('foc', num(so3 - so6, 2) + ' mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the spectrometer */
  Hyper.sim('oi-spectrometer', {
    title: 'A Czerny–Turner spectrometer: dispersion, slit and the sodium doublet',
    blurb: `Light from the entrance slit is made parallel by a mirror, dispersed by the grating, and focused by a second mirror onto the detector. The grating's angles come from the grating equation with a fixed 24° between the incoming and outgoing beams (as in many instruments); three wavelengths (the one you set and ±50 nm) are drawn with their true directions. The graph shows what the instrument records of the sodium D doublet: two lines (588.995 and 589.592 nm) convolved with the slit's image, a triangle as wide as the **bandpass**.

**Try this**
- 1200 lines/mm, f = 300 mm, slit 100 µm: bandpass 0.27 nm, the doublet is clearly resolved. Widen the slit to 300 µm: the two lines merge.
- Change to 300 lines/mm: the dispersion is four times coarser (about 11 nm/mm); the bandpass for the same slit grows four times.
- Lengthen the focal length of the mirrors: the dispersion gets finer and the instrument bigger.
- Set 2400 lines/mm and a centre wavelength of 800 nm: the grating cannot reach beyond about 815 nm at this geometry.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 8px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'lpm', type: 'select', label: 'Grating', options: [['300 lines/mm', 300], ['600 lines/mm', 600], ['1200 lines/mm', 1200], ['1800 lines/mm', 1800], ['2400 lines/mm', 2400]], value: params.lpm || 1200 },
        { id: 'nm', label: 'Wavelength set', min: 300, max: 900, step: 5, value: params.nm || 550, unit: 'nm' },
        { id: 'f', label: 'Focal length of the mirrors', min: 100, max: 500, step: 10, value: params.f || 300, unit: 'mm' },
        { id: 'w', label: 'Slit width', min: 10, max: 500, log: true, value: params.w || 100, sig: 2, unit: 'µm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ang', 'Grating angles α, β'], ['disp', 'Reciprocal linear dispersion'], ['bp', 'Bandpass (slit × dispersion)'], ['rs', 'Resolving power the slit allows'], ['rg', 'Grating\'s own limit (50 mm lit)'], ['na', 'Sodium doublet (0.60 nm apart)']]);
      const plot = kit.plot(gb, { x: { label: 'wavelength (nm)', min: 587.5, max: 591 }, y: { label: 'signal', min: 0, max: 2.2 }, legend: false }, 120);
      const K = 12 * D2R, Na1 = 588.995, Na2 = 589.592;
      // grating tilt for a wavelength, with the beams a fixed 2K apart: sin α + sin β = λ/d, α = φ + K, β = φ − K
      const tilt = (nm, lpm) => { const s = nm * 1e-6 * lpm / (2 * Math.cos(K)); return Math.abs(s) <= 0.999 ? Math.asin(s) : NaN; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const lpm = V.lpm, lmax = 2 * Math.cos(K) * 0.999 / lpm * 1e6;
        const nmC = Math.min(V.nm, lmax), phi = tilt(nmC, lpm), al = phi + K;
        const beta = nm => { const s = nm * 1e-6 * lpm - Math.sin(al); return Math.abs(s) <= 1 ? Math.asin(s) : NaN; };
        const bC = beta(nmC), disp = 1 / (V.f * O.diff.angularDispersion({ linesPerMm: lpm, nm: nmC, thetaI: -al, m: 1 }));      // nm per mm
        const bp = V.w / 1000 * disp;
        // the layout
        const Sp = [0.08 * W, 0.28 * Hh], M1 = [0.28 * W, 0.78 * Hh], G = [0.5 * W, 0.3 * Hh], M2 = [0.72 * W, 0.78 * Hh], Dc = [0.92 * W, 0.28 * Hh];
        const unit = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
        const dGM = unit(G, M2), dist = Math.hypot(M2[0] - G[0], M2[1] - G[1]), um = [dGM[1], -dGM[0]], dMD = unit(M2, Dc), ud = [-dMD[1], dMD[0]], bw = 10;
        S.slits(c, Sp[0], Sp[1], 14, [[Sp[1] - 1.5, Sp[1] + 1.5]], { w: 5 });
        const ink = nm => S.nm(clamp(nm, 380, 700));
        // a concave mirror at P that sends light arriving from A on towards B: its normal bisects the two directions
        const tiltedMirror = (P, A, B, half) => { const a = unit(P, A), b = unit(P, B), nx = a[0] + b[0], ny = a[1] + b[1], nl = Math.hypot(nx, ny) || 1; c.save(); c.translate(P[0], P[1]); c.rotate(Math.atan2(-ny / nl, -nx / nl)); S.mirror(c, 0, 0, half, { R: -140, back: 1 }); c.restore(); };
        // slit to mirror 1, mirror 1 to the grating
        for (const s of [-1, 1]) {
          S.ray(c, [[Sp[0], Sp[1]], [M1[0] + s * bw * 0.9 - 4, M1[1] - s * bw * 0.45]], { color: C.muted, width: 1, arrows: false, alpha: 0.7 });
          const u = unit(M1, G), p = [u[1], -u[0]];
          S.ray(c, [[M1[0] + s * bw * p[0], M1[1] + s * bw * p[1]], [G[0] + s * bw * p[0], G[1] + s * bw * p[1]]], { color: C.muted, width: 1.1, arrows: false, alpha: 0.8 });
        }
        tiltedMirror(M1, Sp, G, 20);
        c.save(); c.translate(G[0], G[1]); c.rotate(-0.3); S.grating(c, 0, 0, 20, { lines: 16 }); c.restore();
        // the dispersed beams, then the focus on the detector
        const spread = [];
        const offs = [-50, 0, 50].map(dn => { const b = beta(nmC + dn); return fin(b) && fin(bC) ? V.f * Math.tan(b - bC) : NaN; }).filter(fin);
        const smm = 0.13 * W / Math.max(25, ...offs.map(Math.abs));
        for (const dn of [-50, 0, 50]) {
          const nm = nmC + dn, b = beta(nm);
          if (!fin(b) || !fin(bC)) continue;
          const t = dist * Math.tan(b - bC), hit = [M2[0] + um[0] * t, M2[1] + um[1] * t], off = V.f * Math.tan(b - bC) * smm, pt = [Dc[0] + ud[0] * off, Dc[1] + ud[1] * off], col = ink(nm);
          for (const s of [-1, 1]) {
            S.ray(c, [[G[0] + s * bw * 0.7 * (1 - 0), G[1] + s * bw * 0.4], [hit[0] + s * bw * um[0], hit[1] + s * bw * um[1]]], { color: col, width: 1.1, arrows: false, alpha: 0.85 });
            S.ray(c, [[hit[0] + s * bw * um[0], hit[1] + s * bw * um[1]], pt], { color: col, width: 1.1, arrows: false, alpha: 0.85 });
          }
          kit.dot(c, pt[0], pt[1], 3, col);
        }
        tiltedMirror(M2, G, Dc, 28);
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(Dc[0] - ud[0] * 0.15 * W, Dc[1] - ud[1] * 0.15 * W); c.lineTo(Dc[0] + ud[0] * 0.15 * W, Dc[1] + ud[1] * 0.15 * W); c.stroke();
        lab(kit, c, st, 'slit', Sp[0], Sp[1] - 22, { align: 'center', size: 11 });
        lab(kit, c, st, 'mirror 1', M1[0], M1[1] + 32, { align: 'center', size: 11 });
        lab(kit, c, st, 'grating', G[0], G[1] - 30, { align: 'center', size: 11 });
        lab(kit, c, st, 'mirror 2', M2[0], M2[1] + 38, { align: 'center', size: 11 });
        lab(kit, c, st, 'detector', Dc[0], Dc[1] - 36, { align: 'center', size: 11 });
        lab(kit, c, st, nmC.toFixed(0) + ' nm ± 50', Dc[0] - 4, Dc[1] + 48, { align: 'right', size: 10.5, color: C.muted });
        // the sodium doublet through this instrument
        const phiNa = tilt(589.3, lpm), alNa = phiNa + K;
        const dispNa = fin(alNa) ? 1 / (V.f * O.diff.angularDispersion({ linesPerMm: lpm, nm: 589.3, thetaI: -alNa, m: 1 })) : NaN, bpNa = V.w / 1000 * dispNa;
        const tri = x => (fin(bpNa) ? Math.max(0, 1 - Math.abs(x) / bpNa) : 0), pts = [];
        for (let x = 587.5; x <= 591.001; x += 0.025) pts.push([x, 2 * tri(x - Na1) + tri(x - Na2)]);
        plot.set({ series: [{ pts, label: 'recorded' }], vlines: [{ x: Na1, label: '' }, { x: Na2, label: '' }] });
        const Rg = lpm * 50, res = fin(bpNa) ? Na2 - Na1 > bpNa * 0.9 : false;
        ro.set('ang', fin(bC) ? num(al * R2D, 1) + '°, ' + num(bC * R2D, 1) + '°' + (V.nm > lmax ? '  (this grating cannot reach ' + V.nm + ' nm: set to ' + nmC.toFixed(0) + ' nm)' : '') : '—');
        ro.set('disp', num(disp, 2) + ' nm/mm');
        ro.set('bp', num(bp, 3) + ' nm');
        ro.set('rs', num(nmC / bp, 0));
        ro.set('rg', num(Rg, 0) + '  (m N, first order)');
        ro.set('na', fin(bpNa) ? (res ? 'resolved: bandpass ' + num(bpNa, 2) + ' nm' : 'NOT resolved: bandpass ' + num(bpNa, 2) + ' nm, wider than the 0.60 nm gap') : 'out of reach for this grating');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
