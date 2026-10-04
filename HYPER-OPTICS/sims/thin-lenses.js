/* HYPER-OPTICS · sims/thin-lenses.js — the simulations of the topic "Thin lenses and images".
 *   tl-shapes        the six lens shapes by bending one lens: radii, centres of curvature, thicker in the middle?
 *   tl-power         focal length and power in dioptres; a second lens in contact adds its power
 *   tl-ray-diagram   the three principal rays, a draggable object and lens, real and virtual images
 *   tl-images        a cone of light from one object point: where it really goes, a screen, a camera behind
 *   tl-equation      the lens equation (Gauss) and Newton's form: the picture and the graph together
 *   tl-magnification three equal arrows at three depths: lateral magnification m and longitudinal m²
 *   tl-lensmaker     the lensmaker's formula on a real lens: curvatures, index, thickness, the medium
 *   tl-two-lenses    two thin lenses a distance apart: equivalent focal length, back focal distance, afocal pairs
 *   tl-thick         a thick lens: principal planes, focal points, EFL / BFL / FFL, nodal points
 *   tl-cylinder      a toric lens: two meridians, two line foci, the circle of least confusion
 * Every number comes from kit.optics, every lens and ray is drawn with kit.osym. The lens equation is used in its
 * "real is positive" form (1/so + 1/si = 1/f); where a picture is schematic (a huge aperture so that rays can be
 * seen) the blurb says so.
 */
(function () {
  'use strict';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const num = (v, d) => (Number.isFinite(v) ? v.toFixed(d == null ? 1 : d) : '∞').replace('-', '−');
  const sg = (v, d) => (Number.isFinite(v) ? (v < 0 ? '−' : '+') + Math.abs(v).toFixed(d == null ? 1 : d) : '∞');
  const mmT = (v, d) => num(v, d) + ' mm';
  // draw inside the stage only (rays and images that run off to huge distances)
  const clipStage = (c, st, fn) => { c.save(); c.beginPath(); c.rect(0, 0, st.W, st.H); c.clip(); fn(); c.restore(); };
  // the height of the surface z = R − sign(R)·√(R² − h²) above its vertex (Cartesian R, 0 = flat)
  const sag = (R, h) => (R ? R - Math.sign(R) * Math.sqrt(Math.max(0, R * R - h * h)) : 0);
  const tag = (kit, c, x, y, text, color, below) => { kit.dot(c, x, y, 3, color); kit.label(c, text, x, y + (below ? 14 : -12), { align: 'center', size: 11.5, color }); };

  /* ================================================================ lens shapes */
  Hyper.sim('tl-shapes', {
    title: 'Lens shapes: bending one lens from biconvex to meniscus',
    blurb: `One focal length, many shapes. The slider **q** is the *bending factor*: it sets how the same power is shared between the two surfaces, and with it the name of the lens. The glass is real (rays are traced through it surface by surface), the circles are the spheres the two surfaces are cut from.

**Try this**
- Press **Biconvex**, then **Plano-convex**: the second surface goes flat (R₂ = ∞) and all the bending happens on the first. Press **Flat side first**: the same glass, turned round.
- Slide q past 1 for a **meniscus**: both centres of curvature are now on the same side, and the lens is still thicker in the middle if it is a converging one.
- Switch to **Diverging**: every shape is thinner in the middle, and the rays spread as if they came from F′ on the incoming side.
- Raise the index of the glass: the same focal length now needs gentler curves (larger radii, a thinner lens).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const D = 24, EDGE = 2;
      const PRE = { 'p-bi': [1, 0], 'p-pc': [1, 1], 'p-pf': [1, -1], 'p-pm': [1, 2.2], 'p-bc': [-1, 0], 'p-pl': [-1, 1], 'p-nm': [-1, -2.2] };
      const ctl = kit.controls(box.side, [
        { id: 'pwr', type: 'select', label: 'Power', options: [['Converging: a positive lens', 1], ['Diverging: a negative lens', -1]], value: params.pwr || 1 },
        { id: 'q', label: 'Shape: bending factor q', min: -3, max: 3, step: 0.05, value: params.q != null ? params.q : 0, fmt: v => v.toFixed(2).replace('-', '−') },
        { id: 'f', label: 'Focal length |f|', min: 60, max: 200, step: 5, value: params.f || 100, unit: 'mm' },
        { id: 'n', label: 'Refractive index of the glass', min: 1.45, max: 2, step: 0.01, value: params.n || 1.52, fmt: v => v.toFixed(2) },
        { id: 'circ', type: 'check', label: 'Show the spheres the surfaces belong to', value: true },
        { type: 'buttons', items: [{ id: 'p-bi', label: 'Biconvex' }, { id: 'p-pc', label: 'Plano-convex' }, { id: 'p-pf', label: 'Flat side first' }, { id: 'p-pm', label: 'Meniscus (+)' }, { id: 'p-bc', label: 'Biconcave' }, { id: 'p-pl', label: 'Plano-concave' }, { id: 'p-nm', label: 'Meniscus (−)' }] }
      ], id => {
        if (PRE[id]) { ctl.set('pwr', PRE[id][0]); ctl.set('q', PRE[id][1]); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['name', 'This lens is a'], ['R1', 'R₁ (front surface)'], ['R2', 'R₂ (back surface)'], ['f', 'Focal length'], ['P', 'Power'], ['thick', 'Thickness'], ['rule', 'Rule of thumb']]);
      // a singlet of focal length f whose edge is EDGE mm thick (the centre thickness follows from the radii)
      function build(f, n, q) {
        let t = 3, sys = null;
        for (let k = 0; k < 5; k++) {
          sys = O.design.singlet({ f, glass: n, q, D, t, name: 'singlet' });
          const R1 = sys.surfaces[0].R, R2 = sys.surfaces[1].R;
          t = Math.max(1.8, EDGE + sag(R1, D / 2) - sag(R2, D / 2));
        }
        return sys;
      }
      function shapeName(f, q) {
        const flat1 = q === -1, flat2 = q === 1;
        if (f > 0) return flat2 ? 'plano-convex lens, curved side first' : flat1 ? 'plano-convex lens, flat side first' : Math.abs(q) < 1 ? 'biconvex lens' : 'positive meniscus lens';
        return flat2 ? 'plano-concave lens, concave side first' : flat1 ? 'plano-concave lens, flat side first' : Math.abs(q) < 1 ? 'biconcave lens' : 'negative meniscus lens';
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const f = V.pwr * V.f;
        let q = V.q; if (Math.abs(q - 1) < 0.026) q = 1; if (Math.abs(q + 1) < 0.026) q = -1;
        const sys = build(f, V.n, q), par = Sy.paraxial(sys);
        const R1 = sys.surfaces[0].R, R2 = sys.surfaces[1].R, t = sys.surfaces[0].t, af = Math.abs(f);
        const edge = t + sag(R2, D / 2) - sag(R1, D / 2);
        const zMin = f > 0 ? -0.3 * af : -1.12 * af, zMax = f > 0 ? par.zImage + 0.2 * af : 0.95 * af;
        const m = S.map(st, zMin, zMax, 21, { left: 14, right: 14, top: 30, bottom: 30 });
        S.axis(c, m.X(zMin), m.y0, m.X(zMax));
        if (V.circ) {
          clipStage(c, st, () => {
            c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 4]);
            for (const [R, z0] of [[R1, 0], [R2, t]]) if (R) { c.beginPath(); c.arc(m.X(z0 + R), m.y0, Math.abs(R) * m.s, 0, 2 * Math.PI); c.stroke(); }
            c.setLineDash([]);
          });
        }
        S.system(c, sys, m);
        const fan = Sy.fan2d(sys, { n: 9, fill: 0.92, zStart: zMin + 1.5, zEnd: zMax });
        S.rays(c, fan, m, { nm: 600, width: 1.3 });
        const Fz = m.X(par.zImage);
        if (f < 0) for (const r of fan) if (r.ok && r.pts.length > 2) { const p = r.pts[r.pts.length - 2]; S.virtual(c, m.X(p[0]), m.Y(p[1]), Fz, m.y0); }
        tag(kit, c, Fz, m.y0, 'F′', C.warn, true);
        for (const [R, z0, nm] of [[R1, 0, 'C₁'], [R2, t, 'C₂']]) { const z = z0 + R; if (R && z > zMin && z < zMax) tag(kit, c, m.X(z), m.y0, nm, C.accent, false); }
        kit.label(c, shapeName(f, q), 14, 16, { weight: 650 });
        ro.set('name', shapeName(f, q));
        ro.set('R1', R1 ? sg(R1, 1) + ' mm' + (R1 > 0 ? '  (centre on the right)' : '  (centre on the left)') : '∞  (flat)');
        ro.set('R2', R2 ? sg(R2, 1) + ' mm' + (R2 > 0 ? '  (centre on the right)' : '  (centre on the left)') : '∞  (flat)');
        ro.set('f', sg(par.efl, 1) + ' mm');
        ro.set('P', sg(1000 / par.efl, 2) + ' D');
        ro.set('thick', 'centre ' + t.toFixed(1) + ' mm, edge ' + edge.toFixed(1) + ' mm');
        ro.set('rule', t > edge ? 'thicker in the middle: converging' : 'thinner in the middle: diverging');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ focal length and power */
  Hyper.sim('tl-power', {
    title: 'Focal length and power: how strong is a lens?',
    blurb: `A beam of parallel light arrives from the left and the lens brings it to a focus. The **power** in dioptres is simply 1 ÷ f with f in metres: +1 D focuses at 1 m, +10 D at 100 mm. The picture always zooms so that the focus fits, so read the numbers, not the pixels (the aperture is drawn large so that you can see the rays).

**Try this**
- Pick *the relaxed human eye* (about +60 D, f ≈ 17 mm), then *a phone camera* (+238 D): the stronger the lens, the shorter the focal length.
- Tick **a second lens in contact** and give it a negative power: the two powers simply add, and the pair behaves like one lens of the sum.
- Choose a diverging lens (−3 D, spectacles for short sight): no real focus, but the rays seem to come from a point 333 mm in front.
- Watch the *Sun's image* read-out: a converging lens makes a bright disc whose diameter is f × 0.0093, because the Sun spans 0.53° of sky.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const PRE = { tele: [1, 1], read: [1, 2.5], mag: [1, 10], cam: [1, 20], eye: [1, 60], phone: [1, 238], myope: [-1, 3] };
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'A typical lens', options: [['Choose one …', 'none'], ['Telescope objective, f = 1 m (+1 D)', 'tele'], ['Reading spectacles (+2.5 D)', 'read'], ['Magnifying glass, f = 100 mm (+10 D)', 'mag'], ['Camera lens, f = 50 mm (+20 D)', 'cam'], ['The relaxed human eye (about +60 D)', 'eye'], ['Phone camera, f = 4.2 mm (+238 D)', 'phone'], ['Spectacles for short sight (−3 D)', 'myope']], value: 'none' },
        { id: 'sgn', type: 'select', label: 'Lens 1', options: [['Converging', 1], ['Diverging', -1]], value: params.sgn || 1 },
        { id: 'P1', label: 'Power of lens 1', min: 0.5, max: 250, value: params.P1 || 10, log: true, sig: 3, unit: 'D' },
        { id: 'two', type: 'check', label: 'Add a second lens in contact with it', value: !!params.two },
        { id: 'P2', label: 'Power of lens 2', min: -20, max: 20, step: 0.5, value: params.P2 != null ? params.P2 : -2, unit: 'D' }
      ], (id, val) => {
        if (id === 'preset' && PRE[val]) { ctl.set('sgn', PRE[val][0]); ctl.set('P1', PRE[val][1]); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['P', 'Power of the combination'], ['f', 'Focal length f = 1/P'], ['f1', 'Lens 1 alone'], ['f2', 'Lens 2 alone'], ['sun', 'Sun\'s image (a disc of)']]);
      const fText = P => (Math.abs(P) < 1e-6 ? '∞ (afocal)' : Math.abs(1 / P) < 1 ? sg(1000 / P, 1) + ' mm' : sg(1 / P, 3) + ' m');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const P1 = V.sgn * V.P1, P2 = V.two ? V.P2 : 0, P = P1 + P2;
        const afocal = Math.abs(P) < 1e-6, fm = afocal ? Infinity : Math.abs(1 / P);
        const x0 = W * 0.27, cy = Hh * 0.44, hh = Hh * 0.27, lensH = Hh * 0.34;
        const reach = P > 0 ? W * 0.5 : W * 0.2;
        const spm = Number.isFinite(fm) ? reach / fm : W;            // pixels per metre
        S.axis(c, 8, cy, W - 8);
        const hs = [-1, -0.67, -0.33, 0, 0.33, 0.67, 1];
        clipStage(c, st, () => {
          for (const k of hs) {
            const y0 = k * hh, yEnd = y0 * (1 - P * (W - x0) / spm);
            S.ray(c, [[8, cy - y0], [x0, cy - y0], [W + 40, cy - y0 * (1 - P * (W + 40 - x0) / spm)]], { nm: 580, width: 1.4, arrows: Math.abs(k) < 0.5 || Math.abs(k) > 0.9, minArrow: 60 });
            if (P < 0 && !afocal && Math.abs(k) > 0.9) S.virtual(c, x0, cy - y0, x0 - fm * spm, cy);
          }
        });
        if (V.two) {
          S.thinLens(c, x0 - 4, cy, lensH, P1, { color: C.accent });
          S.thinLens(c, x0 + 4, cy, lensH, P2 || 1, { color: C.ok });
        } else S.thinLens(c, x0, cy, lensH, P1);
        if (!afocal) {
          const fx = x0 + sgnOf(P) * fm * spm;
          if (fx > 6 && fx < W - 6) {
            tag(kit, c, fx, cy, "F′", C.warn, true);
            S.dim(c, x0, cy + lensH + 18, fx, cy + lensH + 18, 'f = ' + fText(P).replace('+', ''), { off: 14 });
          } else kit.label(c, 'the focus lies off the picture: f = ' + fText(P).replace('+', ''), W - 14, cy + lensH + 22, { align: 'right', color: C.muted });
        } else kit.label(c, 'zero total power: the beam stays parallel', W - 14, cy + lensH + 22, { align: 'right', color: C.muted });
        kit.label(c, 'P = ' + sg(P, 2) + ' D', 14, 18, { weight: 650, size: 14 });
        ro.set('P', sg(P, 2) + ' D' + (V.two ? '  (' + sg(P1, 1) + ' ' + sg(P2, 1) + ')' : ''));
        ro.set('f', fText(P));
        ro.set('f1', fText(P1));
        ro.set('f2', V.two ? fText(P2) : 'no second lens');
        ro.set('sun', P > 0 ? (0.00935 * 1000 / P).toFixed(2) + ' mm  (0.53° of sky × f)' : 'none: a diverging lens makes no real image');
      }, box.stage);
      function sgnOf(v) { return v < 0 ? -1 : 1; }
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the ray diagram */
  Hyper.sim('tl-ray-diagram', {
    title: 'Ray diagram for a thin lens: three rays find the image',
    blurb: `The textbook picture, made to measure. The lens is the vertical line (arrows out: converging, arrows in: diverging); **F** and **F′** are its focal points. From the tip of the object three rays are drawn that you can always predict: **①** parallel to the axis, then through F′; **②** through the centre, undeviated; **③** towards F, then parallel to the axis. Where they cross is the image of the tip. The distances are in millimetres on a true scale (the vertical scale is the same), but the lens is drawn wide so that the rays do not miss it.

**Try this**
- **Drag the object** (or the lens) along the axis. Beyond 2f the image is small, real and inverted; at exactly 2f it is the same size; between f and 2f it is larger and farther away.
- Move the object *inside* f: the rays leave diverging, the image turns **virtual** (dashed: light only seems to come from there), upright and magnified: a magnifying glass.
- Choose **Diverging**: whatever you do the image is virtual, upright, smaller and between the lens and F′.
- Put the object at exactly f (read the distance off the slider): the rays leave parallel and the image is at infinity — the situation of a collimator or a projector slide slightly out of focus.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300 });
      const ZMIN = -330, ZMAX = 330, YH = 110;
      let zL = 0, zO = -(params.so || 220);
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'The lens', options: [['Converging (f > 0)', 1], ['Diverging (f < 0)', -1]], value: params.kind || (params.f < 0 ? -1 : 1) },
        { id: 'f', label: 'Focal length |f|', min: 30, max: 150, step: 5, value: Math.abs(params.f || 100), unit: 'mm' },
        { id: 'so', label: 'Object distance sₒ', min: 10, max: 320, step: 1, value: params.so || 220, unit: 'mm' },
        { id: 'h', label: 'Object height', min: 10, max: 45, step: 1, value: params.h || 30, unit: 'mm' },
        { id: 'r1', type: 'check', label: '① parallel to the axis, then through F′', value: true },
        { id: 'r2', type: 'check', label: '② through the centre of the lens', value: true },
        { id: 'r3', type: 'check', label: '③ towards F, then parallel to the axis', value: true }
      ], (id, val, all) => {
        if (id === 'so') { zO = clamp(zL - all.so, ZMIN + 8, zL - 6); ctl.set('so', zL - zO); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['so', 'Object distance sₒ'], ['si', 'Image distance sᵢ'], ['m', 'Magnification m = −sᵢ/sₒ'], ['what', 'The image is'], ['eq', 'Check: 1/sₒ + 1/sᵢ']]);
      const mapNow = () => S.map(st, ZMIN, ZMAX, YH, { left: 8, right: 8, top: 14, bottom: 44 });
      kit.drag(st, {
        hover: true,
        hit: p => {
          const m = mapNow(), h = V.h * m.s;
          if (Math.abs(p.x - m.X(zO)) < 11 && p.y > m.y0 - h - 12 && p.y < m.y0 + 14) return 'obj';
          if (Math.abs(p.x - m.X(zL)) < 10 && Math.abs(p.y - m.y0) < YH * m.s) return 'lens';
          return null;
        },
        move: (what, p) => {
          const z = mapNow().Z(p.x);
          if (what === 'obj') zO = clamp(z, ZMIN + 8, zL - 6); else zL = clamp(z, Math.max(zO + 6, -120), 160);
          ctl.set('so', zL - zO);
          loop.once();
        }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const f = V.kind * V.f, so = zL - zO, h = V.h, im = O.thinLens(f, so), atF = Math.abs(so - f) < 0.5;
        const m = mapNow(), X = m.X, Y = m.Y, y0 = m.y0, s = m.s;
        const P = (z, y) => [X(z), Y(y)];
        S.axis(c, X(ZMIN), y0, X(ZMAX));
        // focal points (the labels follow the convention: F on the object side of a converging lens)
        const conv = f > 0, zFl = zL - Math.abs(f), zFr = zL + Math.abs(f);
        tag(kit, c, X(zFl), y0, conv ? 'F' : "F′", C.warn, true);
        tag(kit, c, X(zFr), y0, conv ? "F′" : 'F', C.warn, true);
        if (conv) for (const z of [zL - 2 * f, zL + 2 * f]) { c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(X(z), y0 - 4); c.lineTo(X(z), y0 + 4); c.stroke(); kit.label(c, '2F', X(z), y0 + 14, { align: 'center', size: 11, color: C.faint }); }
        const y3 = atF ? 0 : -h * f / (so - f);
        const cols = [C.series[0], C.series[1], C.series[2]];
        const tipI = [zL + im.si, im.m * h];
        clipStage(c, st, () => {
          if (V.r1) {
            S.ray(c, [P(zO, h), P(zL, h), P(ZMAX, h * (1 - (ZMAX - zL) / f))], { color: cols[0], width: 1.9, minArrow: 40 });
            if (!im.real && !atF) S.virtual(c, X(zL), Y(h), X(tipI[0]), Y(tipI[1]), { color: cols[0] });
          }
          if (V.r2) {
            S.ray(c, [P(zO, h), P(ZMAX, h * (1 - (ZMAX - zO) / so))], { color: cols[1], width: 1.9, minArrow: 40 });
            if (!im.real && !atF && -im.si > so) S.virtual(c, X(zO), Y(h), X(tipI[0]), Y(tipI[1]), { color: cols[1] });
          }
          if (V.r3 && !atF) {
            S.ray(c, [P(zO, h), P(zL, y3), P(ZMAX, y3)], { color: cols[2], width: 1.9, minArrow: 40 });
            if (!im.real) S.virtual(c, X(zL), Y(y3), X(tipI[0]), Y(tipI[1]), { color: cols[2] });
          }
          if (!atF) S.object(c, X(zL + im.si), y0, im.m * h * s, { dash: !im.real, color: C.ok });
        });
        S.thinLens(c, X(zL), y0, YH * s * 0.97, f);
        S.object(c, X(zO), y0, h * s, { label: 'object' });
        if (!atF && Math.abs(im.si) < 900) kit.label(c, im.real ? 'real image' : 'virtual image', clamp(X(zL + im.si), 50, st.W - 50), y0 + (im.m < 0 ? -im.m * h * s + 16 : 28), { align: 'center', color: C.ok, size: 11.5 });
        kit.label(c, 'sₒ = ' + so.toFixed(0) + ' mm', (X(zO) + X(zL)) / 2, y0 + 28, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'drag the object or the lens', 12, st.H - 14, { color: C.faint, size: 11.5 });
        ro.set('so', so.toFixed(1) + ' mm  (' + (so / Math.abs(f)).toFixed(2) + ' f)');
        ro.set('si', atF ? '∞ (the rays leave parallel)' : im.real ? num(im.si, 1) + ' mm behind the lens' : num(-im.si, 1) + ' mm in front of the lens');
        ro.set('m', atF ? '∞' : sg(im.m, 3));
        ro.set('what', atF ? 'at infinity: no image on a screen' : (im.real ? 'real' : 'virtual') + ', ' + (im.upright ? 'upright' : 'inverted') + ', ' + (Math.abs(im.m) > 1.005 ? 'magnified' : Math.abs(im.m) < 0.995 ? 'reduced' : 'the same size'));
        ro.set('eq', atF ? '1/sₒ = 1/f, 1/sᵢ = 0' : (1 / so).toFixed(5) + ' + ' + (1 / im.si).toFixed(5).replace('-', '−') + ' = ' + (1 / f).toFixed(5).replace('-', '−') + ' mm⁻¹');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ real and virtual images */
  Hyper.sim('tl-images', {
    title: 'Real and virtual images: where does the light really go?',
    blurb: `Light leaves the tip of the object in every direction; the lens catches a cone of it. Here the cone is drawn ray by ray. If the rays **meet** after the lens the image is **real**: put a screen there and the tip appears as a point. If they **spread** after the lens the image is **virtual**: the light only seems to come from the dashed point behind the lens, and no screen can catch it. The lens is drawn large and thin so that the rays are easy to follow (a schematic, paraxial picture).

**Try this**
- Converging lens, sₒ = 150 mm: a real image, 171 mm behind the lens, and the screen starts exactly there, so the tip of the arrow is a point. Drag the **screen** along the axis: the patch grows on either side. Choose *Nothing*: the rays still cross, in mid-air.
- Move the object inside the focal length (sₒ below f): the rays now spread, the image is dashed and virtual, and the screen only ever shows a blur.
- Choose **a camera looking through the lens**: its own small lens collects the spreading rays and makes a real image on its sensor. A virtual image can be photographed; so can your eye see it.
- Switch to a diverging lens: the image is always virtual, whatever the distance.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ZMIN = -290, ZMAX = 450, ZC = 340, FC = 30, AC = 12, A = 38, YH = 62, K = 11, HO = 20;
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'The lens', options: [['Converging', 1], ['Diverging', -1]], value: params.kind || 1 },
        { id: 'f', label: 'Focal length |f|', min: 40, max: 120, step: 5, value: params.f || 80, unit: 'mm' },
        { id: 'so', label: 'Object distance sₒ', min: 20, max: 260, step: 1, value: params.so || 150, unit: 'mm' },
        { id: 'recv', type: 'select', label: 'What catches the light', options: [['A screen (drag it)', 'screen'], ['A camera looking through the lens', 'camera'], ['Nothing: just follow the light', 'none']], value: params.recv || 'screen' },
        { id: 'zs', label: 'Screen distance behind the lens', min: 20, max: 420, step: 1, value: params.screen || 171, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['si', 'Image of the tip'], ['kind', 'The image is'], ['spot', 'Patch on the screen'], ['cam', 'The camera']]);
      const mapNow = () => S.map(st, ZMIN, ZMAX, YH, { left: 10, right: 10, top: 20, bottom: 30 });
      kit.drag(st, {
        hover: true,
        hit: p => {
          const m = mapNow();
          if (V.recv === 'screen' && Math.abs(p.x - m.X(V.zs)) < 10 && Math.abs(p.y - m.y0) < 70 * m.s) return 'screen';
          if (Math.abs(p.x - m.X(-V.so)) < 11 && p.y > m.y0 - HO * m.s - 12 && p.y < m.y0 + 14) return 'obj';
          return null;
        },
        move: (what, p) => {
          const z = mapNow().Z(p.x);
          if (what === 'screen') ctl.set('zs', clamp(Math.round(z), 20, 420)); else ctl.set('so', clamp(Math.round(-z), 20, 260));
          loop.once();
        }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const f = V.kind * V.f, so = V.so, im = O.thinLens(f, so), si = im.si, atF = !Number.isFinite(si);
        const m = mapNow(), X = m.X, Y = m.Y, y0 = m.y0, s = m.s, rcv = V.recv, zs = V.zs;
        const yI = atF ? 0 : im.m * HO;
        let cam = null;
        if (rcv === 'camera') { if (atF) cam = { si2: FC, so2: Infinity }; else { const so2 = ZC - si; if (so2 > 2 * FC) cam = { si2: so2 * FC / (so2 - FC), so2 }; } }
        S.axis(c, X(ZMIN), y0, X(ZMAX));
        tag(kit, c, X(-Math.abs(f)), y0, f > 0 ? 'F' : "F′", C.warn, true);
        tag(kit, c, X(Math.abs(f)), y0, f > 0 ? "F′" : 'F', C.warn, true);
        const ys = [];
        clipStage(c, st, () => {
          for (let k = 0; k < K; k++) {
            const yL = A * (2 * k / (K - 1) - 1), u2 = (yL - HO) / so - yL / f;
            const pts = [[X(-so), Y(HO)], [X(0), Y(yL)]];
            let alpha = 0.95;
            if (rcv === 'screen') { pts.push([X(zs), Y(yL + u2 * zs)]); ys.push(yL + u2 * zs); }
            else if (rcv === 'camera') {
              const yc = yL + u2 * ZC;
              pts.push([X(ZC), Y(yc)]);
              if (cam && Math.abs(yc) <= AC) { const u3 = u2 - yc / FC; pts.push([X(ZC + cam.si2), Y(yc + u3 * cam.si2)]); } else alpha = 0.3;
            } else pts.push([X(ZMAX), Y(yL + u2 * ZMAX)]);
            S.ray(c, pts, { nm: 600, width: 1.1, arrows: false, alpha });
            if (!atF && si < 0) S.virtual(c, X(0), Y(yL), X(si), Y(yI));
          }
          if (!atF) S.object(c, X(si), y0, yI * s, { dash: !im.real, color: C.ok });
        });
        S.thinLens(c, X(0), y0, 54 * s, f);
        S.object(c, X(-so), y0, HO * s, { label: 'object' });
        if (rcv === 'screen') {
          S.screen(c, X(zs) - 2, y0, 66 * s, { label: 'screen' });
          const lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys);
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(X(zs) - 3, Y(hi)); c.lineTo(X(zs) - 3, Y(lo)); c.stroke(); c.restore();
        }
        if (rcv === 'camera') {
          S.thinLens(c, X(ZC), y0, AC * 1.25 * s, FC, { color: C.accent });
          const zE = ZC + (cam ? cam.si2 : FC);
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.rect(X(ZC) - 8, y0 - AC * 1.6 * s, X(zE) - X(ZC) + 26, AC * 3.2 * s); c.stroke();
          if (cam) { S.sensor(c, X(zE), y0, 9 * s); if (!atF) S.object(c, X(zE) - 1, y0, -cam.si2 / cam.so2 * yI * s, { color: C.ok, width: 2 }); }
          kit.label(c, 'camera', X(ZC) + 8, y0 - AC * 1.6 * s - 10, { size: 11.5, color: C.muted });
        }
        if (!atF && Math.abs(si) < 1500) kit.label(c, im.real ? 'real image' : 'virtual image', clamp(X(si), 50, st.W - 50), y0 + 52 * s * 0.5 + 24, { align: 'center', color: C.ok, size: 11.5 });
        kit.label(c, 'drag the object' + (rcv === 'screen' ? ' or the screen' : ''), 12, st.H - 12, { color: C.faint, size: 11.5 });
        ro.set('si', atF ? 'at infinity (the rays leave parallel)' : im.real ? num(si, 1) + ' mm behind the lens' : num(-si, 1) + ' mm in front of the lens');
        ro.set('kind', atF ? 'neither: nothing to focus' : im.real ? 'real: the light really passes through it' : 'virtual: the light only seems to come from it');
        if (rcv === 'screen') {
          const lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys), d = hi - lo;
          ro.set('spot', d < 1 ? 'a point: the screen is at the image' : d.toFixed(1) + ' mm tall: ' + (im.real ? 'out of focus' : 'a blur: no screen position focuses it'));
        } else ro.set('spot', 'no screen');
        ro.set('cam', rcv !== 'camera' ? 'not used' : cam ? 'focused on the ' + (atF ? 'distant' : im.real ? 'real' : 'virtual') + ' image: it forms a sharp picture on the sensor' : 'the image is too close to its lens to focus');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the lens equation, Gauss and Newton */
  Hyper.sim('tl-equation', {
    title: 'The lens equation: the distances and the graph that goes with them',
    blurb: `The picture shows a thin lens with the distances measured in **focal lengths**; the graph under it plots the image distance sᵢ against the object distance sₒ (the lens equation, 1/sₒ + 1/sᵢ = 1/f), or, in **Newton's form**, the distances x and x′ from the two focal points, where x·x′ = f² draws a straight line on log–log axes.

**Try this**
- Set sₒ = 2f (the **2 f** button): the image is at 2f too, the same size, inverted. It is the symmetrical point of the curve, and the shortest possible distance between a real object and its image, 4f.
- Bring the object towards f from the far side: sᵢ shoots off to infinity (the asymptote). Pass through f and sᵢ comes back from minus infinity: a virtual image.
- Switch the graph to **Newton**: the line has slope −1, and the point sits at x = x′ = f when sₒ = sᵢ = 2f.
- Choose a diverging lens: sᵢ is always negative and never larger than f in size.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 220, maxH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'The lens', options: [['Converging', 1], ['Diverging', -1]], value: params.kind || 1 },
        { id: 'f', label: 'Focal length |f|', min: 30, max: 150, step: 5, value: params.f || 100, unit: 'mm' },
        { id: 'sf', label: 'Object distance, in focal lengths', min: 0.2, max: 5, step: 0.05, value: params.sf || 3, fmt: v => v.toFixed(2) + ' f' },
        { id: 'mode', type: 'select', label: 'The graph shows', options: [['Gauss: sᵢ against sₒ', 'gauss'], ['Newton: x′ against x, log–log', 'newton']], value: params.mode || 'gauss' },
        { type: 'buttons', items: [{ id: 'b4', label: '4 f' }, { id: 'b2', label: '2 f' }, { id: 'b15', label: '1.5 f' }, { id: 'b05', label: '0.5 f' }] }
      ], id => {
        const B = { b4: 4, b2: 2, b15: 1.5, b05: 0.5 };
        if (B[id]) ctl.set('sf', B[id]);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Object distance'], ['b', 'Image distance'], ['m', 'Magnification m'], ['what', 'The image is'], ['eq', 'Check']]);
      const plot = kit.plot(gb, { x: { label: '' }, y: { label: '' } }, 210);
      const mapNow = () => S.map(st, -5.4, 6.2, 1.25, { left: 10, right: 10, top: 14, bottom: 44 });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const af = V.f, fu = V.kind, sf = V.sf, f = fu * af, so = sf * af;
        const im = O.thinLens(fu, sf), atF = Math.abs(sf - 1) < 0.02 && fu > 0, si = atF ? Infinity : im.si * af;
        const m = mapNow(), X = m.X, Y = m.Y, y0 = m.y0, s = m.s, hu = 0.5, newton = V.mode === 'newton';
        const P = (z, y) => [X(z), Y(y)];
        S.axis(c, X(-5.4), y0, X(6.2));
        tag(kit, c, X(-1), y0, fu > 0 ? 'F' : "F′", C.warn, true);
        tag(kit, c, X(1), y0, fu > 0 ? "F′" : 'F', C.warn, true);
        clipStage(c, st, () => {
          S.ray(c, [P(-sf, hu), P(0, hu), P(6.2, hu * (1 - 6.2 / fu))], { color: C.series[0], width: 1.8, minArrow: 30 });
          S.ray(c, [P(-sf, hu), P(6.2, hu * (1 - (6.2 + sf) / sf))], { color: C.series[1], width: 1.8, minArrow: 30 });
          if (!atF) {
            if (!im.real) { S.virtual(c, X(0), Y(hu), X(im.si), Y(im.m * hu), { color: C.series[0] }); if (-im.si > sf) S.virtual(c, X(-sf), Y(hu), X(im.si), Y(im.m * hu), { color: C.series[1] }); }
            S.object(c, X(im.si), y0, im.m * hu * s, { dash: !im.real, color: C.ok });
          }
        });
        S.thinLens(c, X(0), y0, 1.2 * s, fu);
        S.object(c, X(-sf), y0, hu * s, { label: 'object' });
        const yd = y0 + 24;
        if (!newton) {
          S.dim(c, X(-sf), yd, X(0), yd, 'sₒ = ' + so.toFixed(0) + ' mm', { off: 12 });
          if (!atF && im.real && im.si < 6.2) S.dim(c, X(0), yd, X(im.si), yd, 'sᵢ = ' + si.toFixed(0) + ' mm', { off: 12 });
          else if (!atF && !im.real) S.dim(c, X(im.si), yd + 18, X(0), yd + 18, 'sᵢ = −' + (-si).toFixed(0) + ' mm (virtual)', { off: 12 });
        } else {
          S.dim(c, X(-sf), yd, X(-fu), yd, 'x = ' + (so - f).toFixed(0) + ' mm', { off: 12 });
          if (!atF && im.si < 6.2 && im.si > -5.4) S.dim(c, X(fu), yd + 18, X(im.si), yd + 18, 'x′ = ' + (si - f).toFixed(0) + ' mm', { off: 12 });
        }
        kit.label(c, 'f = ' + sg(f, 0) + ' mm', 12, 16, { weight: 650 });
        // the graph
        const pts = [];
        if (!newton) {
          for (let i = 0; i <= 520; i++) { const u = 0.02 + i * 0.01; const r = O.thinLens(fu, u); pts.push([u * af, !Number.isFinite(r.si) || Math.abs(r.si) > 14 ? NaN : r.si * af]); }
          const conv = fu > 0;
          plot.set({
            x: { label: 'object distance sₒ (mm)', min: 0, max: 5.2 * af, name: 'sₒ' }, y: { label: 'image distance sᵢ (mm)', min: conv ? -6 * af : -1.2 * af, max: conv ? 10 * af : 0.3 * af, name: 'sᵢ' },
            series: [{ pts, label: 'sᵢ', color: C.series[0] }],
            vlines: conv ? [{ x: af, label: 'f' }, { x: 2 * af, label: '2f' }] : [], hlines: conv ? [{ y: af, label: 'f' }, { y: 2 * af, label: '2f' }, { y: 0, color: C.axis }] : [{ y: -af, label: '−f' }, { y: 0, color: C.axis }],
            marks: Number.isFinite(si) ? [{ x: so, y: si, label: 'sᵢ = ' + si.toFixed(0), color: C.ok }] : []
          });
        } else {
          for (let i = 0; i <= 160; i++) { const xu = 0.1 * Math.pow(200, i / 160); pts.push([xu * af, af / xu]); }
          const xN = so - f, xpN = si - f;
          plot.set({
            x: { label: 'x = sₒ − f (mm)', min: 0.1 * af, max: 20 * af, log: true, name: 'x' }, y: { label: 'x′ = sᵢ − f (mm)', min: 0.05 * af, max: 10 * af, log: true, name: 'x′' },
            series: [{ pts, label: 'x′ = f²/x', color: C.series[1] }],
            vlines: [{ x: af, label: 'x = f (sₒ = 2f)' }], hlines: [{ y: af, label: 'x′ = f' }],
            marks: Number.isFinite(xpN) && xN > 0 && xpN > 0 ? [{ x: xN, y: xpN, label: 'x′ = ' + xpN.toFixed(0), color: C.ok }] : []
          });
        }
        ro.set('a', 'sₒ = ' + so.toFixed(1) + ' mm' + (newton ? ',  x = ' + (so - f).toFixed(1) + ' mm' : ''));
        ro.set('b', atF ? 'at infinity' : 'sᵢ = ' + sg(si, 1) + ' mm' + (newton ? ',  x′ = ' + sg(si - f, 1) + ' mm' : ''));
        ro.set('m', atF ? '∞' : sg(im.m, 3));
        ro.set('what', atF ? 'none: the rays leave parallel' : (im.real ? 'real' : 'virtual') + ', ' + (im.upright ? 'upright' : 'inverted') + ', ' + (Math.abs(im.m) > 1.005 ? 'magnified' : Math.abs(im.m) < 0.995 ? 'reduced' : 'the same size'));
        ro.set('eq', atF ? '1/sᵢ = 0' : newton ? 'x·x′ = ' + ((so - f) * (si - f)).toFixed(0) + ' mm²,  f² = ' + (f * f).toFixed(0) + ' mm²' : '1/sₒ + 1/sᵢ = ' + (1 / so + 1 / si).toFixed(5) + ' mm⁻¹ = 1/f');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ lateral and longitudinal magnification */
  Hyper.sim('tl-magnification', {
    title: 'Magnification: the image of a solid object is not a copy of it',
    blurb: `Three **identical arrows** stand one behind another, equally spaced in depth. The lens makes an image of each (rays through the lens centre are drawn). The arrows are imaged at different sizes — lateral magnification m — and the gaps between the images are not equal to the gaps between the arrows: along the axis everything is stretched by about **m²**. The graph shows how |m| and m² change with the object distance.

**Try this**
- Put the middle arrow at 3.5f: the images are small and bunched together, much closer than the arrows.
- Bring it to 1.8f: the images are larger than the arrows and the gaps between them are stretched by 4 or more.
- Open the depth step Δ wide: the near arrow's image runs away much faster than the far one's. The product m₁·m₂ of the two lateral magnifications is the exact stretch of the gap between them.
- Compare the read-outs: the stretch is larger than |m| when |m| > 1, and smaller when |m| < 1.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 230, maxH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Focal length f', min: 40, max: 150, step: 5, value: params.f || 100, unit: 'mm' },
        { id: 'sf', label: 'Distance of the middle arrow, in f', min: 1.6, max: 4, step: 0.05, value: params.sf || 2.5, fmt: v => v.toFixed(2) + ' f' },
        { id: 'dl', label: 'Depth step Δ between arrows, in f', min: 0.05, max: 0.3, step: 0.01, value: params.dl || 0.2, fmt: v => v.toFixed(2) + ' f' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['m1', 'm of the near arrow'], ['m2', 'm of the middle arrow'], ['m3', 'm of the far arrow'], ['gap', 'Gaps between the images'], ['mL', 'Stretch of the gap, exactly'], ['m2s', 'Estimate m² of the middle']]);
      const plot = kit.plot(gb, { x: { label: 'object distance in focal lengths', min: 1.2, max: 6, name: 'sₒ/f' }, y: { label: 'magnification', log: true, min: 0.01, max: 100 } }, 170);
      const mapNow = () => S.map(st, -4.6, 4.9, 1.05, { left: 10, right: 10, top: 14, bottom: 40 });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const f = V.f, so = V.sf, d = Math.min(V.dl, so - 1.3);
        const m = mapNow(), X = m.X, Y = m.Y, y0 = m.y0, s = m.s, hu = 0.28;
        S.axis(c, X(-4.6), y0, X(4.9));
        tag(kit, c, X(-1), y0, 'F', C.warn, true); tag(kit, c, X(1), y0, 'F′', C.warn, true);
        const so3 = [so - d, so, so + d], im3 = so3.map(u => O.thinLens(1, u));
        S.thinLens(c, X(0), y0, 1.0 * s, 1);
        const tipsO = [], tipsI = [];
        clipStage(c, st, () => {
          so3.forEach((u, i) => {
            const r = im3[i], col = C.series[i];
            S.ray(c, [[X(-u), Y(hu)], [X(4.9), Y(hu * (1 - (4.9 + u) / u))]], { color: col, width: 1.2, arrows: false, alpha: 0.9 });
            S.object(c, X(-u), y0, hu * s, { color: col });
            S.object(c, X(r.si), y0, r.m * hu * s, { color: col, dash: true });
            tipsO.push([X(-u), Y(hu)]); tipsI.push([X(r.si), Y(r.m * hu)]);
          });
          c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([2, 4]);
          for (const tips of [tipsO, tipsI]) { c.beginPath(); c.moveTo(tips[0][0], tips[0][1]); c.lineTo(tips[2][0], tips[2][1]); c.stroke(); }
          c.setLineDash([]);
        });
        // the gaps: objects below the axis, images above it
        S.dim(c, X(-so3[2]), y0 + 22, X(-so3[1]), y0 + 22, 'Δ', { off: 12 });
        S.dim(c, X(-so3[1]), y0 + 22, X(-so3[0]), y0 + 22, 'Δ', { off: 12 });
        S.dim(c, X(im3[0].si), y0 - 26, X(im3[1].si), y0 - 26, 'Δ′₁', { off: -12 });
        S.dim(c, X(im3[1].si), y0 - 26, X(im3[2].si), y0 - 26, 'Δ′₂', { off: -12 });
        kit.label(c, 'objects (solid) · images (dashed, inverted)', 12, 16, { color: C.muted, size: 11.5 });
        const g1 = (im3[0].si - im3[1].si), g2 = (im3[1].si - im3[2].si), mm = im3.map(r => r.m);
        ro.set('m1', sg(mm[0], 3)); ro.set('m2', sg(mm[1], 3)); ro.set('m3', sg(mm[2], 3));
        ro.set('gap', (g1 * f).toFixed(1) + ' mm and ' + (g2 * f).toFixed(1) + ' mm  (Δ = ' + (d * f).toFixed(1) + ' mm)');
        ro.set('mL', '×' + (g1 / d).toFixed(3) + ' and ×' + (g2 / d).toFixed(3) + '  (= m₁m₂, m₂m₃)');
        ro.set('m2s', '×' + (mm[1] * mm[1]).toFixed(3));
        const a = [], b = [];
        for (let i = 0; i <= 120; i++) { const u = 1.2 + 4.8 * i / 120, r = O.thinLens(1, u); a.push([u, Math.abs(r.m)]); b.push([u, r.m * r.m]); }
        plot.set({ series: [{ pts: a, label: '|m|', color: C.series[0] }, { pts: b, label: 'm² (longitudinal)', color: C.series[1] }], hlines: [{ y: 1, label: '1 : 1' }], vlines: [], marks: [{ x: so, y: Math.abs(mm[1]), label: '|m|', color: C.series[0] }, { x: so, y: mm[1] * mm[1], label: 'm²', color: C.series[1] }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the lensmaker's formula */
  const curvFmt = v => (v === 0 ? 'flat (R = ∞)' : 'R = ' + (v < 0 ? '−' : '+') + (1000 / Math.abs(v)).toFixed(0) + ' mm');
  Hyper.sim('tl-lensmaker', {
    title: 'The lensmaker\'s formula: two curvatures, one index, one focal length',
    blurb: `The focal length of a lens in air follows from three things only: the index n of the glass and the curvatures 1/R₁ and 1/R₂ of its two surfaces. The sliders set the **curvatures** (in m⁻¹; the read-out gives the radius), so that a flat surface is simply zero. Signs are Cartesian: light travels left to right and a radius is positive when its centre of curvature lies on the right.

**Try this**
- Start with +R₁ and −R₂ (biconvex): f is positive. Set the back curvature to zero for a plano-convex lens and check f = R/(n − 1).
- Make both curvatures equal and positive (a meniscus of constant thickness): the thin-lens formula gives power zero, but the thick lens still has a small power — the third read-out follows the real rays.
- Raise n: every lens gets stronger, in proportion to n − 1. Then put the lens in **water**: the relevant index is n/n₀ = 1.14, so n − 1 = 0.52 becomes 0.14 and the focal length is 3.7 times longer.
- Turn the lens round (the front curvature becomes minus the old back curvature, and the back becomes minus the old front): the focal length does not change.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.54, minH: 300 });
      const HH = 18;
      const ctl = kit.controls(box.side, [
        { id: 'c1', label: 'Front surface: curvature 1/R₁', min: -30, max: 30, step: 1, value: params.c1 != null ? params.c1 : 10, fmt: curvFmt },
        { id: 'c2', label: 'Back surface: curvature 1/R₂', min: -30, max: 30, step: 1, value: params.c2 != null ? params.c2 : -10, fmt: curvFmt },
        { id: 'n', label: 'Refractive index n of the lens', min: 1.33, max: 2, step: 0.01, value: params.n || 1.52, fmt: v => v.toFixed(2) },
        { id: 't', label: 'Centre thickness', min: 0, max: 40, step: 1, value: params.t != null ? params.t : 6, unit: 'mm' },
        { id: 'med', type: 'select', label: 'The lens is surrounded by', options: [['Air, n = 1.000', 1], ['Water, n = 1.333', 1.333]], value: params.med || 1 },
        { id: 'circ', type: 'check', label: 'Show the spheres the surfaces belong to', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['shape', 'The lens is a'], ['R', 'Radii R₁ and R₂'], ['thin', 'f from the thin-lens formula'], ['thick', 'f with the thickness'], ['trace', 'f from the traced rays'], ['P', 'Power (traced)']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const R1 = V.c1 ? 1000 / V.c1 : 0, R2 = V.c2 ? 1000 / V.c2 : 0, n0 = V.med, n = V.n;
        const tEff = Math.max(V.t, 1.5 + sag(R1, HH) - sag(R2, HH));
        const fThin = O.lensmaker(n, R1, R2, 0, n0), fThick = O.lensmaker(n, R1, R2, tEff, n0);
        const sys = { n0, surfaces: [{ R: R1, t: tEff, n, sd: HH, stop: true }, { R: R2, n: n0, sd: HH }] };
        const par = Sy.paraxial(sys), efl = par.efl;
        const ref = clamp(Number.isFinite(efl) ? Math.abs(efl) : 200, 60, 300);
        const zMin = -0.3 * ref, zMax = Number.isFinite(efl) && efl > 0 ? Math.min(par.zImage + 0.2 * ref, 1.4 * ref + tEff) : Number.isFinite(efl) ? 0.95 * ref : 1.3 * ref;
        const m = S.map(st, zMin, Math.max(zMax, tEff + 30), 22, { left: 14, right: 14, top: 30, bottom: 30 });
        if (n0 > 1.01) { c.fillStyle = S.glass(0.08); c.fillRect(0, 0, st.W, st.H); kit.label(c, 'in water', st.W - 12, 16, { align: 'right', color: C.muted }); }
        S.axis(c, m.X(zMin), m.y0, m.X(Math.max(zMax, tEff + 30)));
        if (V.circ) clipStage(c, st, () => {
          c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 4]);
          for (const [R, z0] of [[R1, 0], [R2, tEff]]) if (R) { c.beginPath(); c.arc(m.X(z0 + R), m.y0, Math.abs(R) * m.s, 0, 2 * Math.PI); c.stroke(); }
          c.setLineDash([]);
        });
        S.lens(c, m.X(0), m.y0, HH * m.s, { R1: R1 * m.s, R2: R2 * m.s, t: tEff * m.s });
        const fan = Sy.fan2d(sys, { n: 9, fill: 0.9, zStart: zMin + 1.5, zEnd: Math.max(zMax, tEff + 30) });
        S.rays(c, fan, m, { nm: 600, width: 1.3 });
        if (Number.isFinite(efl) && efl < 0) for (const r of fan) if (r.ok && r.pts.length > 2) { const p = r.pts[r.pts.length - 2]; S.virtual(c, m.X(p[0]), m.Y(p[1]), m.X(par.zImage), m.y0); }
        if (Number.isFinite(par.zImage) && par.zImage > zMin && par.zImage < zMax + 1) tag(kit, c, m.X(par.zImage), m.y0, "F′", C.warn, true);
        else if (Number.isFinite(efl)) kit.label(c, 'the focus lies off the picture', st.W - 14, st.H - 14, { align: 'right', color: C.muted, size: 11.5 });
        for (const [R, z0, nm] of [[R1, 0, 'C₁'], [R2, tEff, 'C₂']]) { const z = z0 + R; if (R && z > zMin && z < zMax) tag(kit, c, m.X(z), m.y0, nm, C.accent, false); }
        const fts = f => (Number.isFinite(f) && Math.abs(f) < 1e5 ? sg(f, 1) + ' mm' : '∞ (no power)');
        const conv = Number.isFinite(fThick) ? fThick > 0 : false;
        const nameOf = !R1 && !R2 ? 'flat plate (no power)' : (!R1 || !R2) ? (conv ? 'plano-convex lens' : 'plano-concave lens') : (R1 > 0 && R2 < 0) ? 'biconvex lens' : (R1 < 0 && R2 > 0) ? 'biconcave lens' : conv ? 'positive meniscus lens' : 'negative meniscus lens';
        ro.set('shape', nameOf);
        ro.set('R', (R1 ? sg(R1, 0) : '∞') + ' mm and ' + (R2 ? sg(R2, 0) : '∞') + ' mm');
        ro.set('thin', fts(fThin) + '  (t → 0)');
        ro.set('thick', fts(fThick) + '  (t = ' + tEff.toFixed(0) + ' mm)');
        ro.set('trace', fts(efl));
        ro.set('P', Number.isFinite(efl) ? sg(1000 / efl, 2) + ' D' + (n0 > 1.01 ? ' (in water)' : '') : '0 D');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ two thin lenses */
  Hyper.sim('tl-two-lenses', {
    title: 'Two thin lenses: the equivalent focal length and the back focal distance',
    blurb: `Parallel light from the left passes through two thin lenses a distance **d** apart. The dashed lines show the *equivalent* single lens: extend the incoming ray and the outgoing ray until they meet, and the meeting point lies on the **rear principal plane H′**; the distance from H′ to the focus F′ is the **equivalent focal length** (EFL), and the distance from the second lens to F′ is the **back focal distance** (BFD).

**Try this**
- Press **In contact**: d = 0 and the powers simply add (P = P₁ + P₂); the focal length is 50 mm for two 100 mm lenses.
- Press **Telephoto**: a positive lens followed by a negative one. The EFL is 500 mm but the whole assembly is only 260 mm long: the principal plane H′ lies *in front of* the lens system.
- Press **Retrofocus**: a negative lens first. The BFD is *longer* than the EFL, room for a mirror box in a wide-angle SLR lens.
- Press **Keplerian** or **Galilean** (set d = f₁ + f₂): the pair is *afocal*, a telescope; the beam leaves parallel and its width is multiplied by f₂ ÷ f₁.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const PRE = {
        c: [1, 100, 1, 100, 0], t: [1, 100, -1, 50, 60], r: [-1, 60, 1, 40, 30], k: [1, 150, 1, 30, 180], g: [1, 150, -1, 30, 120]
      };
      const ctl = kit.controls(box.side, [
        { id: 's1', type: 'select', label: 'Lens 1', options: [['Converging', 1], ['Diverging', -1]], value: params.s1 || 1 },
        { id: 'f1', label: 'Focal length |f₁|', min: 30, max: 200, step: 5, value: params.f1 || 100, unit: 'mm' },
        { id: 's2', type: 'select', label: 'Lens 2', options: [['Converging', 1], ['Diverging', -1]], value: params.s2 || -1 },
        { id: 'f2', label: 'Focal length |f₂|', min: 20, max: 150, step: 5, value: params.f2 || 50, unit: 'mm' },
        { id: 'd', label: 'Distance d between the lenses', min: 0, max: 300, step: 1, value: params.d != null ? params.d : 60, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'c', label: 'In contact' }, { id: 't', label: 'Telephoto' }, { id: 'r', label: 'Retrofocus' }, { id: 'k', label: 'Keplerian' }, { id: 'g', label: 'Galilean' }] }
      ], id => {
        const p = PRE[id];
        if (p) { ctl.set('s1', p[0]); ctl.set('f1', p[1]); ctl.set('s2', p[2]); ctl.set('f2', p[3]); ctl.set('d', p[4]); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['P', 'Power P = P₁ + P₂ − d·P₁P₂'], ['f', 'Equivalent focal length (EFL)'], ['bfd', 'Back focal distance (from lens 2)'], ['ffd', 'Front focal distance (from lens 1)'], ['len', 'Length ÷ EFL'], ['M', 'Afocal pair']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const f1 = V.s1 * V.f1, f2 = V.s2 * V.f2, d = V.d;
        const r = O.twoLenses(f1, f2, d), P = 1 / f1 + 1 / f2 - d / (f1 * f2);
        const afocal = Math.abs(P) < 2e-4;
        const zF = afocal ? NaN : d + r.bfd, zH = afocal ? NaN : zF - r.f;
        let lo = Math.min(0, d), hi = Math.max(0, d);
        if (!afocal) { lo = Math.min(lo, zF, zH); hi = Math.max(hi, zF, zH); }
        lo = Math.max(lo, -250); hi = Math.min(hi, 700);
        const span = Math.max(hi - lo, 120);
        const zMin = lo - 0.18 * span, zMax = afocal ? d + 130 : hi + 0.16 * span;
        const A = clamp(0.1 * (zMax - zMin), 10, 40);
        const m = S.map(st, zMin, zMax, A * 1.6, { left: 10, right: 10, top: 26, bottom: 46 });
        const X = m.X, Y = m.Y, y0 = m.y0, s = m.s;
        S.axis(c, X(zMin), y0, X(zMax));
        clipStage(c, st, () => {
          for (const k of [-1, -0.5, 0, 0.5, 1]) {
            const y1 = A * k, u1 = -y1 / f1, y2 = y1 + u1 * d, u2 = u1 - y2 / f2;
            S.ray(c, [[X(zMin), Y(y1)], [X(0), Y(y1)], [X(d), Y(y2)], [X(zMax), Y(y2 + u2 * (zMax - d))]], { nm: 600, width: 1.4, arrows: Math.abs(k) === 1, minArrow: 60 });
            if (!afocal && Math.abs(k) === 1) {
              // the equivalent thin lens: the incoming ray and the back-projected outgoing ray meet on H′
              c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.beginPath();
              c.moveTo(X(0), Y(y1)); c.lineTo(X(zH), Y(y1)); c.moveTo(X(d), Y(y2)); c.lineTo(X(zH), Y(y1)); c.stroke(); c.restore();
            }
          }
        });
        S.thinLens(c, X(0), y0, A * 1.3 * s, f1, { label: 'lens 1' });
        S.thinLens(c, X(d), y0, A * 1.3 * s, f2, { label: 'lens 2', color: C.ok });
        if (!afocal) {
          c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(X(zH), y0 - A * 1.4 * s); c.lineTo(X(zH), y0 + A * 1.4 * s); c.stroke(); c.restore();
          kit.label(c, 'H′', X(zH), y0 - A * 1.4 * s - 10, { align: 'center', color: C.accent, weight: 650 });
          tag(kit, c, X(zF), y0, "F′", C.warn, true);
          const yd = y0 + A * 1.3 * s + 34;
          S.dim(c, X(zH), yd, X(zF), yd, 'EFL = ' + sg(r.f, 0) + ' mm', { off: 12 });
          if (Math.abs(r.bfd) > 2) S.dim(c, X(d), yd + 20, X(zF), yd + 20, 'BFD = ' + sg(r.bfd, 0) + ' mm', { off: 12 });
        } else kit.label(c, 'afocal: parallel light in, parallel light out', st.W - 12, 16, { align: 'right', color: C.muted });
        ro.set('P', sg(1000 * P, 2) + ' D');
        ro.set('f', afocal ? '∞ (afocal)' : sg(r.f, 1) + ' mm');
        ro.set('bfd', afocal ? '∞' : sg(r.bfd, 1) + ' mm');
        ro.set('ffd', afocal ? '∞' : sg(r.ffd, 1) + ' mm');
        ro.set('len', afocal ? '—' : ((d + r.bfd) / Math.abs(r.f)).toFixed(2) + '  (d + BFD = ' + (d + r.bfd).toFixed(0) + ' mm)');
        ro.set('M', afocal ? 'angular magnification ' + sg(-f1 / f2, 2) + ' × ; beam width × ' + Math.abs(f2 / f1).toFixed(2) : 'no: it forms a real or virtual focus');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ thick lenses and the cardinal points */
  Hyper.sim('tl-thick', {
    title: 'A thick lens: principal planes, focal points and nodal points',
    blurb: `A real lens has thickness, so "the lens" is not a line. Any lens, however thick, behaves to first order like a thin lens placed between two planes: the **principal planes H and H′**. The focal length (EFL) is measured from H′ to F′, but the **back focal length** (BFL) is measured from the last glass surface, and the **front focal length** (FFL) from the first. The orange rays are traced through the real glass; the dashed construction uses only the cardinal points.

**Try this**
- Biconvex: the planes lie inside the glass, about a third of the thickness from each vertex; BFL is a little less than the EFL.
- **Plano-convex, curved side first**, then **flat side first**: the EFL is the same but BFL changes by t/n, and one principal plane sits exactly on the curved vertex.
- **Meniscus**: both planes can lie outside the glass. **Ball lens**: H and H′ coincide at the centre; with n = 2 the focus lies exactly on the back surface.
- In the cardinal-points version, put **water behind the lens**: the nodal points move away from the principal planes by (n′ − n)/P, as in the eye, where N lies about 5.7 mm behind H.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.54, minH: 310 });
      const HH = 30, card = params.mode === 'cardinal';
      const PRE = { bi: [15, -15, 1.5, 14], pf: [15, 0, 1.5, 14], pr: [0, -15, 1.5, 14], me: [25, 10, 1.5, 12], ba: [25, -25, 1.5, 80] };
      const ctl = kit.controls(box.side, [
        { id: 'c1', label: 'Front surface: curvature 1/R₁', min: -30, max: 30, step: 1, value: params.c1 != null ? params.c1 : 15, fmt: curvFmt },
        { id: 'c2', label: 'Back surface: curvature 1/R₂', min: -30, max: 30, step: 1, value: params.c2 != null ? params.c2 : -15, fmt: curvFmt },
        { id: 'n', label: 'Refractive index n of the glass', min: 1.4, max: 2, step: 0.01, value: params.n || 1.5, fmt: v => v.toFixed(2) },
        { id: 't', label: 'Centre thickness t', min: 0, max: 90, step: 1, value: params.t != null ? params.t : 14, unit: 'mm' },
        { id: 'behind', type: 'select', label: 'Behind the lens', options: [['Air, n′ = 1.000', 1], ['Water (or aqueous), n′ = 1.336', 1.336]], value: params.behind || 1 },
        { id: 'eq', type: 'check', label: 'Show the construction with H, H′ and F, F′', value: true },
        { id: 'nod', type: 'check', label: 'Show the nodal points and a nodal ray', value: card },
        { type: 'buttons', items: [{ id: 'bi', label: 'Biconvex' }, { id: 'pf', label: 'Plano-convex, curved side first' }, { id: 'pr', label: 'Plano-convex, flat side first' }, { id: 'me', label: 'Meniscus' }, { id: 'ba', label: 'Ball lens' }] }
      ], id => {
        const p = PRE[id];
        if (p) { ctl.set('c1', p[0]); ctl.set('c2', p[1]); ctl.set('n', p[2]); ctl.set('t', p[3]); }
        loop.once();
      });
      const V = ctl.values;
      if (!card) { ctl.show('behind', false); ctl.show('nod', false); }
      const ro = kit.readout(box.side, [['efl', 'EFL (from H′ to F′)'], ['bfl', 'BFL (last surface to F′)'], ['ffl', 'FFL (F to first surface)'], ['H', 'H: from the first vertex (+ right)'], ['H2', 'H′: from the last vertex (+ right)'], ['N', 'Nodal points N, N′'], ['P', 'Power']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const R1 = V.c1 ? 1000 / V.c1 : 0, R2 = V.c2 ? 1000 / V.c2 : 0, n = V.n, nb = card ? V.behind : 1;
        const t = Math.max(V.t, 1.5 + sag(R1, HH) - sag(R2, HH));
        const sys = { surfaces: [{ R: R1, t, n, sd: HH, stop: true }, { R: R2, n: nb, sd: HH }] };
        const par = Sy.paraxial(sys), efl = par.efl, fin = Number.isFinite(efl);
        let lo = Math.min(0, t), hi = Math.max(0, t);
        if (fin) lo = Math.min(lo, -par.ffd, t + par.bfd, par.Hfront, par.Hrear), hi = Math.max(hi, -par.ffd, t + par.bfd, par.Hfront, par.Hrear);
        lo = Math.max(lo, -450); hi = Math.min(hi, 550);
        const span = Math.max(hi - lo, 130), zMin = lo - 0.14 * span, zMax = hi + 0.14 * span;
        const m = S.map(st, zMin, zMax, HH * 1.3, { left: 12, right: 12, top: 30, bottom: 66 });
        const X = m.X, Y = m.Y, y0 = m.y0, s = m.s;
        if (nb > 1.01) { c.fillStyle = S.glass(0.08); c.fillRect(X(t), 0, st.W - X(t), st.H); }
        S.axis(c, X(zMin), y0, X(zMax));
        S.lens(c, X(0), y0, HH * s, { R1: R1 * s, R2: R2 * s, t: t * s });
        const fan = Sy.fan2d(sys, { n: 7, fill: 0.8, zStart: zMin + 1, zEnd: zMax });
        S.rays(c, fan, m, { nm: 600, width: 1.2 });
        if (fin) {
          const zF2 = t + par.bfd, zF1 = -par.ffd, zH1 = par.Hfront, zH2 = par.Hrear;
          if (efl < 0) for (const r of fan) if (r.ok && r.pts.length > 2) { const p = r.pts[r.pts.length - 2]; S.virtual(c, X(p[0]), Y(p[1]), X(zF2), y0); }
          if (V.eq) {
            const yin = 0.55 * HH;
            c.save(); c.lineWidth = 1.3; c.setLineDash([6, 4]);
            c.strokeStyle = C.accent; c.beginPath(); c.moveTo(X(zMin), Y(yin)); c.lineTo(X(zH2), Y(yin)); c.lineTo(X(zF2), y0); c.stroke();
            c.strokeStyle = C.ok; c.beginPath(); c.moveTo(X(zMax), Y(-yin)); c.lineTo(X(zH1), Y(-yin)); c.lineTo(X(zF1), y0); c.stroke();
            c.setLineDash([2, 4]); c.strokeStyle = C.faint; c.lineWidth = 1;
            c.beginPath(); c.moveTo(X(zH1), Y(1.25 * HH)); c.lineTo(X(zH1), Y(-1.25 * HH)); c.moveTo(X(zH2), Y(1.25 * HH)); c.lineTo(X(zH2), Y(-1.25 * HH)); c.stroke();
            c.restore();
            kit.label(c, 'H', X(zH1), Y(1.25 * HH) - 9, { align: 'center', color: C.muted, weight: 650 });
            kit.label(c, 'H′', X(zH2) + (Math.abs(zH2 - zH1) < 6 ? 12 : 0), Y(1.25 * HH) - 9, { align: 'center', color: C.muted, weight: 650 });
            tag(kit, c, X(zF1), y0, efl > 0 ? 'F' : "F′", C.warn, true);
            tag(kit, c, X(zF2), y0, efl > 0 ? "F′" : 'F', C.warn, true);
            const yd = y0 + HH * s + 20;
            S.dim(c, X(zH2), yd, X(zF2), yd, 'EFL', { off: 12 });
            S.dim(c, X(t), yd + 20, X(zF2), yd + 20, 'BFL', { off: 12 });
            S.dim(c, X(zF1), yd + 40, X(0), yd + 40, 'FFL', { off: 12 });
          }
          if (card && V.nod) {
            const sh = (nb - 1) * efl, zN = zH1 + sh, zN2 = zH2 + sh, th = -0.1;
            c.save(); c.strokeStyle = C.series[2]; c.lineWidth = 1.5; c.setLineDash([8, 3, 2, 3]); c.beginPath();
            c.moveTo(X(zMin), Y(th * (zMin - zN))); c.lineTo(X(zN), y0); c.moveTo(X(zN2), y0); c.lineTo(X(zMax), Y(th * (zMax - zN2))); c.stroke(); c.restore();
            tag(kit, c, X(zN), y0, 'N', C.series[2], false);
            tag(kit, c, X(zN2), y0, 'N′', C.series[2], false);
          }
        }
        const fts = v => (Number.isFinite(v) ? sg(v, 1) + ' mm' : '∞');
        ro.set('efl', fin ? sg(efl, 2) + ' mm' + (nb > 1.01 ? '  (f′ = n′f = ' + (nb * efl).toFixed(1) + ' mm)' : '') : '∞ (afocal)');
        ro.set('bfl', fin ? fts(par.bfd) : '∞');
        ro.set('ffl', fin ? fts(par.ffd) : '∞');
        ro.set('H', fin ? sg(par.Hfront, 2) + ' mm' + (par.Hfront > 0 && par.Hfront < t ? '  (inside the glass)' : '  (outside the glass)') : '—');
        ro.set('H2', fin ? sg(par.Hrear - t, 2) + ' mm' + (par.Hrear < t && par.Hrear > 0 ? '  (inside the glass)' : '  (outside the glass)') : '—');
        ro.set('N', !card ? 'with air on both sides they coincide with H and H′' : fin ? 'N at ' + sg(par.Hfront + (nb - 1) * efl, 1) + ' mm, N′ at ' + sg(par.Hrear - t + (nb - 1) * efl, 1) + ' mm from the vertices' : '—');
        ro.set('P', fin ? sg(1000 / efl, 2) + ' D' : '0 D');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cylindrical and toric lenses */
  Hyper.sim('tl-cylinder', {
    title: 'A toric lens: two powers, two line foci, one circle of least confusion',
    blurb: `A round beam of parallel light, 20 mm across, meets a lens with **different powers in two perpendicular meridians**. The upper strip is the side view (the vertical meridian), the lower strip the top view (the horizontal meridian). The panel on the right is what you would see on a screen at the chosen distance. Vertical sizes in the strips are exaggerated so that you can see the rays.

**Try this**
- Press **Cylindrical lens** (power in the horizontal meridian only): the side view is untouched, the top view converges to a single **line focus** — a vertical line on the screen.
- Press **Toric lens** (4 D and 2 D): two line foci, 250 mm and 500 mm behind the lens, one horizontal and one vertical. In between the spot is an ellipse. Drag the screen through the whole range.
- Press **Go to the circle of least confusion**: halfway in dioptres (at 333 mm), the spot is as round and as small as it will ever be.
- Press **Spherical lens**: both meridians agree and the spot shrinks to a point at 250 mm.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const ZMAX = 800, R0 = 10;
      const ctl = kit.controls(box.side, [
        { id: 'pv', label: 'Power in the vertical meridian', min: 0, max: 10, step: 0.25, value: params.pv != null ? params.pv : 4, unit: 'D' },
        { id: 'ph', label: 'Power in the horizontal meridian', min: 0, max: 10, step: 0.25, value: params.ph != null ? params.ph : 2, unit: 'D' },
        { id: 'z', label: 'Screen distance behind the lens', min: 0, max: ZMAX, step: 5, value: params.z != null ? params.z : 300, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'sph', label: 'Spherical lens' }, { id: 'cyl', label: 'Cylindrical lens' }, { id: 'tor', label: 'Toric lens' }, { id: 'lc', label: 'Go to the circle of least confusion' }] }
      ], (id, val, all) => {
        if (id === 'sph') { ctl.set('pv', 4); ctl.set('ph', 4); }
        if (id === 'cyl') { ctl.set('pv', 0); ctl.set('ph', 4); }
        if (id === 'tor') { ctl.set('pv', 4); ctl.set('ph', 2); }
        if (id === 'lc') { const a = ctl.values.pv + ctl.values.ph; if (a > 0) ctl.set('z', clamp(Math.round(2000 / a / 5) * 5, 0, ZMAX)); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f1', 'Focus of the vertical meridian'], ['f2', 'Focus of the horizontal meridian'], ['sturm', 'Interval of Sturm'], ['lc', 'Circle of least confusion'], ['se', 'Spherical equivalent'], ['rx1', 'As a prescription (plus cylinder)'], ['rx2', 'As a prescription (minus cylinder)'], ['spot', 'On the screen now']]);
      const geom = () => {
        const W = st.W, Hh = st.H, lx = 62, x1 = W * 0.67;
        return { W, Hh, lx, x1, sc: (x1 - lx) / ZMAX, yT: Hh * 0.27, yB: Hh * 0.73, hv: Hh * 0.17, cx: W * 0.85, cy: Hh * 0.5, pp: Math.min(W * 0.11, Hh * 0.3) };
      };
      kit.drag(st, {
        hover: true,
        hit: p => { const g = geom(); return Math.abs(p.x - (g.lx + V.z * g.sc)) < 9 && p.y < g.Hh - 20 ? 'scr' : null; },
        move: (w, p) => { const g = geom(); ctl.set('z', clamp(Math.round((p.x - g.lx) / g.sc / 5) * 5, 0, ZMAX)); loop.once(); }
      });
      const fmtF = P => (P < 0.01 ? 'none: the rays stay parallel' : (1000 / P).toFixed(0) + ' mm');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const g = geom(), pv = V.pv, ph = V.ph, z = V.z;
        const rows = [[g.yT, pv, 'vertical meridian: side view'], [g.yB, ph, 'horizontal meridian: top view']];
        for (const [yc, P, name] of rows) {
          S.axis(c, 10, yc, g.x1 + 6);
          for (const k of [-1, -0.5, 0, 0.5, 1]) {
            const y0 = k * g.hv;
            S.ray(c, [[10, yc - y0], [g.lx, yc - y0], [g.x1, yc - y0 * (1 - P * ZMAX / 1000)]], { nm: 600, width: 1.3, arrows: Math.abs(k) === 1, minArrow: 50 });
          }
          if (P > 0.01) S.thinLens(c, g.lx, yc, g.hv * 1.25, 1); else { c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(g.lx, yc - g.hv * 1.25); c.lineTo(g.lx, yc + g.hv * 1.25); c.stroke(); c.restore(); }
          if (P > 0.01 && 1000 / P <= ZMAX) tag(kit, c, g.lx + 1000 / P * g.sc, yc, 'line focus', C.warn, true);
          kit.label(c, name + (P > 0.01 ? '  (' + P.toFixed(2) + ' D)' : '  (no power)'), 14, yc - g.hv * 1.3 - 6, { size: 11.5, color: C.muted });
        }
        // the screen
        const sx = g.lx + z * g.sc;
        c.save(); c.strokeStyle = C.ok; c.lineWidth = 2.5; c.beginPath(); c.moveTo(sx, 20); c.lineTo(sx, g.Hh - 22); c.stroke(); c.restore();
        kit.label(c, 'screen: drag me', sx, g.Hh - 10, { align: 'center', color: C.ok, size: 11.5 });
        // the spot on the screen
        const a = Math.abs(1 - z * ph / 1000) * R0, b = Math.abs(1 - z * pv / 1000) * R0, sp = g.pp / 20;
        c.save(); c.beginPath(); c.rect(g.cx - g.pp, g.cy - g.pp, 2 * g.pp, 2 * g.pp); c.fillStyle = C.surface; c.fill(); c.clip();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 4]); c.beginPath(); c.arc(g.cx, g.cy, R0 * sp, 0, 2 * Math.PI); c.stroke(); c.setLineDash([]);
        c.beginPath(); c.moveTo(g.cx - g.pp, g.cy); c.lineTo(g.cx + g.pp, g.cy); c.moveTo(g.cx, g.cy - g.pp); c.lineTo(g.cx, g.cy + g.pp); c.strokeStyle = C.grid; c.stroke();
        c.beginPath(); c.ellipse(g.cx, g.cy, Math.max(a * sp, 0.6), Math.max(b * sp, 0.6), 0, 0, 2 * Math.PI);
        c.fillStyle = 'rgba(224,160,48,0.45)'; c.fill(); c.strokeStyle = C.warn; c.lineWidth = 2; c.stroke();
        c.restore();
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(g.cx - g.pp, g.cy - g.pp, 2 * g.pp, 2 * g.pp);
        kit.label(c, 'the screen, seen from the lens', g.cx, g.cy - g.pp - 12, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'dashed circle: 20 mm', g.cx, g.cy + g.pp + 12, { align: 'center', color: C.faint, size: 11 });
        // read-outs
        const hi = Math.max(pv, ph), lowP = Math.min(pv, ph), sum = pv + ph;
        ro.set('f1', pv < 0.01 ? fmtF(pv) : fmtF(pv) + '  (a horizontal line)');
        ro.set('f2', ph < 0.01 ? fmtF(ph) : fmtF(ph) + '  (a vertical line)');
        ro.set('sturm', Math.abs(pv - ph) < 0.01 || lowP < 0.01 ? (Math.abs(pv - ph) < 0.01 ? 'none: one point focus' : 'unbounded: one meridian never focuses') : Math.abs(1000 / pv - 1000 / ph).toFixed(0) + ' mm long');
        ro.set('lc', sum > 0.01 ? 'at ' + (2000 / sum).toFixed(0) + ' mm, ' + (2 * R0 * Math.abs(pv - ph) / sum).toFixed(1) + ' mm across' : '—');
        ro.set('se', (sum / 2).toFixed(2) + ' D  (= sphere + cylinder ÷ 2)');
        ro.set('rx1', sg(lowP, 2) + ' / ' + sg(hi - lowP, 2) + ' × ' + (Math.abs(pv - ph) < 0.01 ? '—' : pv > ph ? '180' : '90'));
        ro.set('rx2', sg(hi, 2) + ' / ' + sg(-(hi - lowP), 2) + ' × ' + (Math.abs(pv - ph) < 0.01 ? '—' : pv > ph ? '90' : '180'));
        ro.set('spot', a < 0.4 && b < 0.4 ? 'a point' : a < 0.4 ? 'a vertical line, ' + (2 * b).toFixed(1) + ' mm long' : b < 0.4 ? 'a horizontal line, ' + (2 * a).toFixed(1) + ' mm long' : Math.abs(a - b) < 0.4 ? 'a circle, ' + (2 * a).toFixed(1) + ' mm across' : 'an ellipse, ' + (2 * a).toFixed(1) + ' mm wide × ' + (2 * b).toFixed(1) + ' mm high');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
