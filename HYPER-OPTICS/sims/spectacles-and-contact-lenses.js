/* HYPER-OPTICS · sims/spectacles-and-contact-lenses.js — simulations of the topic "Spectacles and contact lenses" (prefix sp-)
 *   sp-correction     a reduced eye with a spectacle lens in front: the lens makes the image of a distant object appear at the eye's far point
 *   sp-prescription   the paper of a prescription (OD, OS, SPH, CYL, AXIS, ADD) and what it means: power cross, meridian powers, transposition
 *   sp-vertex         the same focus from a spectacle lens at the vertex distance and from a contact lens at the cornea
 *   sp-prism          Prentice's rule: a lens used off its optical centre acts as a prism (rays traced through a real lens)
 *   sp-materials      one prescription in seven lens materials: thickness, weight and colour fringes
 *   sp-bifocal        flat-top, round, executive and trifocal segments: the power down the lens and the image jump
 *   sp-pal            a progressive lens: maps of the added power and of the unwanted astigmatism, the corridor
 *   sp-reach          which distances stay sharp through single-vision, bifocal, progressive and office lenses at a given age
 *   sp-coatings       reflectance of an uncoated and a coated spectacle lens, the colour of the reflection, UV and blue-light filtering
 *   sp-photochromic   a photochromic lens darkening and clearing with the ultraviolet and the temperature
 *   sp-glare          glare from a flat surface, its polarization, and what a polarized lens does to it
 *   sp-contact        the tear lens between a rigid contact lens and the cornea: its power and its thickness profile
 *   sp-iol            an intraocular lens power from the length of the eye and the curvature of the cornea (a simplified vergence calculation)
 *   sp-laser          the tissue removed from the cornea to change its power over an optical zone (Munnerlyn's relation)
 *   sp-lensmeter      the lensmeter's target seen through a sphero-cylindrical lens: dial, wheel, reticle and the readings
 * The numbers come from kit.optics (O.eye, O.film, O.fresnel, O.pol, O.MATERIALS …), the drawing is kit.osym and the canvas helpers
 * of the kit. Pictures of the eye are schematic (a reduced eye with its power at the cornea); nothing here is a prescription, a
 * diagnosis or a recommendation about any person's eyes or lenses.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, R2D = 180 / PI, ARCMIN = R2D * 60;
  const MINUS = '−';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fx = (x, d) => Number.isFinite(x) ? x.toFixed(d).replace('-', MINUS) : '—';
  const dpt = (v, d) => (Math.abs(v) < 0.005 ? '0.00' : (v < 0 ? MINUS : '+') + Math.abs(v).toFixed(d == null ? 2 : d)) + ' D';
  const sgn2 = v => (Math.abs(v) < 0.005 ? '0.00' : (v < 0 ? MINUS : '+') + Math.abs(v).toFixed(2));
  const mmStr = (m, d) => !Number.isFinite(m) ? 'infinity' : Math.abs(m) >= 1 ? fx(m, d == null ? 2 : d) + ' m' : fx(m * 100, 0) + ' cm';
  const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  /* sag of a spherical surface of radius R (mm, Cartesian sign) at height r (mm) */
  const sag = (R, r) => !R ? 0 : R - Math.sign(R) * Math.sqrt(Math.max(0, R * R - r * r));
  /* a spectacle lens of back vertex power Fv (D) and front surface power F1 (D) in glass of index n: the radii (mm), centre
     thickness tc and edge thickness te (mm) at height r, with the centre at least tMin thick and the edge at least teMin */
  function spectacleLens(Fv, F1, n, r, tMin, teMin) {
    let tc = tMin, F2 = 0, R2 = 0, te = 0;
    const R1 = F1 ? 1000 * (n - 1) / F1 : 0;
    for (let i = 0; i < 8; i++) {
      F2 = Fv - F1 / (1 - (tc / 1000 / n) * F1);
      R2 = Math.abs(F2) < 1e-6 ? 0 : 1000 * (1 - n) / F2;
      te = tc + sag(R2, r) - sag(R1, r);
      if (te < teMin - 1e-6) tc += teMin - te; else break;
    }
    return { R1, R2, tc, te, F2 };
  }
  function path(c, pts, close) { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (close) c.closePath(); }
  function strokeLine(c, pts, color, lw, dash, close) { c.save(); path(c, pts, close); c.strokeStyle = color; c.lineWidth = lw; c.setLineDash(dash || []); c.lineJoin = 'round'; c.stroke(); c.restore(); }
  function fillPoly(c, pts, color) { c.save(); path(c, pts, true); c.fillStyle = color; c.fill(); c.restore(); }
  function panel(c, C, x, y, w, h, title, S) {
    c.save(); c.fillStyle = C.surface; c.fillRect(x, y, w, h); c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); c.restore();
    if (title) S.text(c, title, x + w / 2, y + 11, { size: 10.5, color: C.muted });
  }
  /* a prescription written the usual way: sphere, cylinder, × axis */
  const axisStr = a => String(Math.round(a)).padStart(3, '0');
  const rxStr = rx => sgn2(rx.sph) + (Math.abs(rx.cyl) < 0.005 ? ' DS' : ' ' + sgn2(rx.cyl) + ' × ' + axisStr(rx.axis));
  const hsl = (h, sa, l) => { h = ((h % 360) + 360) % 360; const a = sa * Math.min(l, 1 - l), f = n => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); }; return [255 * f(0), 255 * f(8), 255 * f(4)]; };
  const css = rgb => 'rgb(' + Math.round(clamp(rgb[0], 0, 255)) + ',' + Math.round(clamp(rgb[1], 0, 255)) + ',' + Math.round(clamp(rgb[2], 0, 255)) + ')';

  /* ================================================================ 1 · a lens and the far point */
  Hyper.sim('sp-correction', {
    title: 'A spectacle lens and the far point of the eye',
    blurb: `A reduced eye, with all of its focusing power drawn at the cornea, looks at a distant object through a spectacle lens 12 mm in front of it. Parallel rays from the object cross the lens, then the pupil, and are brought to a point by the eye. The strip under the picture is a **vergence ruler**: the marker ▼ is the eye's **far point** (the nearest the light may come from with the eye at rest), the dot is the vergence the lens gives to light from a distant object. When they coincide the object is in focus.

**Try this**
- Set the eye to **−3 D** with no lens: the eye is a little too long and the focus falls in front of the retina. Press *Fit the lens that focuses*: a diverging lens makes the parallel rays spread, as though they came from the far point 33 cm away, and the focus returns to the retina.
- Set **+2 D**: the eye is a little too short. The focus falls behind the retina until a converging lens is fitted; the far point is behind the eye.
- Keep the focusing lens and move the **front curve** from 1 D to 9 D: the lens changes shape (flat or steep, a *meniscus* form) but the power at the eye, and so the focus, stays the same.
- Put in a lens of the wrong power and watch the blur grow with the error: each dioptre of error spreads a 4 mm pupil's light over a patch about 14 arc-minutes across.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 340 });
      const PE = E.DATA.power, NV = 1.336, VD = 12, NL = O.index('CR-39', 587.56), PUPIL = 4;
      const ctl = kit.controls(box.side, [
        { id: 'K', label: 'Refractive state of the eye', min: -10, max: 6, step: 0.25, value: params.K != null ? params.K : -3, fmt: v => Math.abs(v) < 0.01 ? 'normal, 0 D' : dpt(v) + (v < 0 ? ' · eye too long' : ' · eye too short') },
        { id: 'F', label: 'Spectacle lens, 12 mm in front of the eye', min: -12, max: 10, step: 0.25, value: params.F != null ? params.F : 0, fmt: v => Math.abs(v) < 0.01 ? 'none' : dpt(v) },
        { id: 'F1', label: 'Front curve of the lens (its form)', min: 0.5, max: 9, step: 0.5, value: params.F1 || 4, fmt: v => fx(v, 1) + ' D' },
        { type: 'buttons', items: [{ id: 'fit', label: 'Fit the lens that focuses', primary: true }, { id: 'none', label: 'Remove the lens' }] }
      ], id => {
        if (id === 'fit') ctl.set('F', clamp(Math.round(E.vertex(V.K, 0, VD / 1000) * 4) / 4, -12, 10));
        else if (id === 'none') ctl.set('F', 0);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['len', 'Length of the eye, from a 0 D eye'], ['far', 'Far point of the eye'], ['need', 'Power the lens needs, at 12 mm'], ['img', 'Image of a distant object made by the lens'], ['focus', 'Where the focus falls'], ['blur', 'Blur of a point, 4 mm pupil'], ['form', 'Radii of the lens']]);
      const v0 = NV * 1000 / PE;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const K = V.K, F = V.F, v = NV * 1000 / (PE + K);
        const m = S.map(st, -VD - 16, 30, 21, { left: 10, right: 10, top: 6, bottom: 70 }), s = m.s;
        // the ray model: parallel rays, the lens (thin, at −VD), the cornea (power PE), the retina at v
        const Vc = F / (1 - VD / 1000 * F);                                  // vergence at the cornea of light from far away, D
        const err = K - Vc;                                                  // positive: the eye needs more converging power than it gets
        const zf = (() => { const q = Vc + PE; return q > 1e-9 ? NV * 1000 / q : Infinity; })();
        const heights = [-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4, -3.8, 3.8];
        const lensP = spectacleLens(F, V.F1, NL, 18, 1.5, 1.0);
        S.axis(c, m.X(-VD - 16), m.Y(0), m.X(30));
        // the eye
        const zj = sag(7.8, 5.5), a = (v - zj) / 1.866, zc = v - a, b = 11;
        const ph0 = 5 * PI / 6, ell = [];
        for (let k = 0; k <= 40; k++) { const ph = ph0 - 2 * ph0 * k / 40; ell.push([m.X(zc + a * Math.cos(ph)), m.Y(b * Math.sin(ph))]); }
        const cor = []; for (let y = -5.5; y <= 5.5001; y += 0.5) cor.push([m.X(sag(7.8, y)), m.Y(y)]);
        fillPoly(c, ell.concat(cor.slice().reverse()), C.dark ? 'rgba(235,238,250,0.06)' : 'rgba(40,60,120,0.05)');
        strokeLine(c, ell, C.muted, 1.8); strokeLine(c, cor, S.edge(), 2.4);
        const ret = []; for (let k = 0; k <= 16; k++) { const ph = -0.9 + 1.8 * k / 16; ret.push([m.X(zc + a * Math.cos(ph)), m.Y(b * Math.sin(ph))]); }
        strokeLine(c, ret, C.bad, 3.2);
        const zi = 3.3;
        for (const sg of [1, -1]) strokeLine(c, [[m.X(zi), m.Y(sg * PUPIL / 2 * 1.25)], [m.X(zi), m.Y(sg * 5.3)]], C.accent, 3.4);
        // the spectacle lens
        if (Math.abs(F) >= 0.005) S.lens(c, m.X(-VD - lensP.tc), m.Y(0), 18 * s, { R1: lensP.R1 * s, R2: lensP.R2 * s, t: lensP.tc * s, fill: S.glass(0.26) });
        else strokeLine(c, [[m.X(-VD), m.Y(18)], [m.X(-VD), m.Y(-18)]], C.faint, 1, [3, 4]);
        S.dim(c, m.X(-VD), m.Y(-17.6), m.X(0), m.Y(-17.6), '12 mm', { off: -9, size: 10.5 });
        // the rays
        const xl = m.X(-VD - 16);
        for (const h2 of heights) {
          const hi = h2 / (1 - VD / 1000 * F), u1 = -hi * F / 1000;           // height at the lens, slope after it
          const u2 = (u1 - h2 * PE / 1000) / NV;                              // slope inside the eye
          const h3 = h2 + u2 * zi, blocked = Math.abs(h3) > PUPIL / 2 * 1.25;
          const pts = [[xl, m.Y(hi)], [m.X(-VD), m.Y(hi)], [m.X(0), m.Y(h2)]];
          if (blocked) { pts.push([m.X(zi), m.Y(h3)]); S.ray(c, pts, { nm: 587.56, width: 1.1, alpha: 0.45, arrows: false }); continue; }
          pts.push([m.X(v), m.Y(h2 + u2 * v)]);
          S.ray(c, pts, { nm: 587.56, width: 1.4, arrows: h2 === 0 || Math.abs(h2) === 1.6, minArrow: 40 });
          if (Math.abs(F) >= 0.005 && F < 0) S.virtual(c, m.X(-VD), m.Y(hi), xl, m.Y(hi - 16 * u1), {});
          if (Number.isFinite(zf) && zf > v + 0.05 && zf < v + 12 && h2 !== 0) strokeLine(c, [[m.X(v), m.Y(h2 + u2 * v)], [m.X(zf), m.Y(0)]], C.faint, 1, [3, 3]);
        }
        if (Number.isFinite(zf) && Math.abs(zf - v) > 0.04 && zf < v + 12) kit.dot(c, m.X(zf), m.Y(0), 3.8, C.text, C.bg2);
        if (Number.isFinite(zf) && Math.abs(zf - v) <= 0.04) kit.dot(c, m.X(v), m.Y(0), 4.4, C.ok, C.bg2);
        if (F < -0.005) kit.label(c, 'dashed: the rays seem to come from the far point, ' + mmStr(1 / Math.abs(F) + 0) + ' away', xl + 4, m.Y(-9.5), { size: 10.5, color: C.faint });
        kit.label(c, 'parallel rays from a distant object', xl + 4, m.Y(16.5), { size: 10.5, color: C.muted });
        kit.label(c, 'cornea (all the power, drawn here)', m.X(-0.5), m.Y(-12.4), { size: 10.5, align: 'center', color: C.muted });
        kit.label(c, 'retina', m.X(v) + 6, m.Y(7.5), { size: 11, color: C.bad });
        kit.label(c, Math.abs(F) < 0.005 ? 'no lens' : 'lens ' + dpt(F), m.X(-VD - lensP.tc / 2), m.Y(19.4), { size: 11, align: 'center', color: C.text });
        // the vergence ruler
        const x0 = 46, x1 = W - 30, yR = Hh - 34, X = d => x0 + (x1 - x0) * (clamp(d, -12, 9) + 12) / 21;
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0, yR); c.lineTo(x1, yR); c.stroke();
        for (let d = -12; d <= 9; d += 3) { c.strokeStyle = C.faint; c.beginPath(); c.moveTo(X(d), yR - 3); c.lineTo(X(d), yR + 3); c.stroke(); kit.label(c, (d < 0 ? MINUS : d > 0 ? '+' : '') + Math.abs(d), X(d), yR + 13, { size: 10.5, align: 'center', color: C.muted }); }
        kit.label(c, 'vergence at the cornea, D  (− diverging, + converging)', x0, yR + 29, { size: 10.5, color: C.faint });
        const good = Math.abs(err) < 0.13;
        c.fillStyle = C.accent; c.beginPath(); c.moveTo(X(K), yR - 3); c.lineTo(X(K) - 6, yR - 14); c.lineTo(X(K) + 6, yR - 14); c.closePath(); c.fill();
        kit.dot(c, X(Vc), yR, 5, good ? C.ok : C.warn, C.bg2);
        kit.label(c, 'eye\'s far point', clamp(X(K), x0 + 36, x1 - 36), yR - 20, { size: 10.5, align: 'center', color: C.accent, weight: 650 });
        // read-outs
        ro.set('len', Math.abs(v - v0) < 0.005 ? 'the 0 D length' : fx(Math.abs(v - v0), 2) + ' mm ' + (v > v0 ? 'longer' : 'shorter'));
        ro.set('far', Math.abs(K) < 0.01 ? 'infinity' : K < 0 ? mmStr(-1 / K) + ' in front of the eye' : mmStr(1 / K) + ' behind the eye (reached only by focusing)');
        const need = E.vertex(K, 0, VD / 1000);
        ro.set('need', Math.abs(need) < 0.005 ? 'none' : dpt(need));
        ro.set('img', Math.abs(F) < 0.005 ? 'at infinity (no lens)' : F < 0 ? mmStr(1 / -F) + ' in front of the lens (virtual)' : mmStr(1 / F) + ' behind the lens (real)');
        ro.set('focus', Math.abs(zf - v) < 0.03 ? 'on the retina' : !Number.isFinite(zf) ? 'nowhere: the rays diverge' : fx(Math.abs(zf - v), 2) + ' mm ' + (zf > v ? 'behind' : 'in front of') + ' the retina');
        ro.set('blur', Math.abs(err) < 0.125 ? 'none: sharp (error ' + dpt(err) + ')' : fx(E.blurAngle(err, PUPIL) * ARCMIN, 1) + ' arc-minutes across (error ' + dpt(err) + ')');
        ro.set('form', Math.abs(F) < 0.005 ? '—' : 'front ' + (lensP.R1 ? fx(lensP.R1, 0) : 'flat') + ' mm · back ' + (lensP.R2 ? fx(lensP.R2, 0) : 'flat') + ' mm · centre ' + fx(lensP.tc, 1) + ' mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ 2 · the paper of a prescription */
  Hyper.sim('sp-prescription', {
    title: 'Reading a prescription: the paper and the lens it describes',
    blurb: `The card is a prescription as an optician would write it: one row for the right eye (**OD**, *oculus dexter*) and one for the left (**OS**, *oculus sinister*). Under it is the same information as a lens. The disc is the lens seen from the front with the standard axis scale (0° to 180°, counter-clockwise from the horizontal); the shading shows the power in each direction, and the graph below plots it against the direction.

**Try this**
- Choose *Astigmatism* and look at the right eye: **−2.00 −1.50 × 090**. The power along the 90° line is −2.00 D, across it −3.50 D: the lens is a sphere with a cylinder added at right angles to the axis.
- Switch *Cylinder written as* to plus. The same lens now reads **−3.50 +1.50 × 180**: two ways of writing one lens (transposition, the topic of another page).
- Choose *Long sight, astigmatism and reading addition*: the ADD column is the extra power for near, so the reading power is the sphere plus the addition.
- Drag the **axis** and watch the line turn: 90° is vertical, 180° (or 0°) is horizontal, and the axis is only the direction of the cylinder, not its strength.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 350 });
      const plot = kit.plot(box.stage, { x: { label: 'direction (°)', name: 'direction', min: 0, max: 180 }, y: { label: 'power (D)', name: 'P' }, series: [] }, 130);
      const CASES = {
        myopia: { label: 'Short sight, no astigmatism', od: { sph: -1.75, cyl: 0, axis: 90 }, os: { sph: -2.0, cyl: 0, axis: 90 }, add: 0, pd: '63', prism: ['', ''] },
        astig: { label: 'Astigmatism (minus-cylinder writing)', od: { sph: -2.0, cyl: -1.5, axis: 90 }, os: { sph: -1.75, cyl: -1.0, axis: 85 }, add: 0, pd: '63', prism: ['', ''] },
        presb: { label: 'Long sight, astigmatism and a reading addition', od: { sph: 1.5, cyl: -0.75, axis: 175 }, os: { sph: 1.25, cyl: -0.5, axis: 10 }, add: 2.0, pd: '64', prism: ['', ''] },
        prism: { label: 'A small prism written in', od: { sph: -0.5, cyl: 0, axis: 90 }, os: { sph: -0.75, cyl: -0.25, axis: 180 }, add: 0, pd: '61', prism: ['1.0 BU', '1.0 BD'] }
      };
      const state = { od: Object.assign({}, CASES[params.case || 'astig'].od), os: Object.assign({}, CASES[params.case || 'astig'].os), prism: CASES[params.case || 'astig'].prism.slice(), pd: CASES[params.case || 'astig'].pd };
      const eye0 = params.eye || 'od';
      const ctl = kit.controls(box.side, [
        { id: 'case', type: 'select', label: 'An example prescription', options: Object.keys(CASES).map(k => [CASES[k].label, k]), value: params.case || 'astig' },
        { id: 'eye', type: 'select', label: 'Look at, and edit', options: [['Right eye, OD', 'od'], ['Left eye, OS', 'os']], value: eye0 },
        { id: 'sph', label: 'Sphere', min: -10, max: 8, step: 0.25, value: state[eye0].sph, fmt: v => dpt(v) },
        { id: 'cyl', label: 'Cylinder (minus form)', min: -4, max: 0, step: 0.25, value: state[eye0].cyl, fmt: v => dpt(v) },
        { id: 'axis', label: 'Axis', min: 5, max: 180, step: 5, value: state[eye0].axis, fmt: v => v + '°' },
        { id: 'add', label: 'Addition for near (both eyes)', min: 0, max: 3.5, step: 0.25, value: CASES[params.case || 'astig'].add, fmt: v => v < 0.01 ? 'none' : dpt(v) },
        { id: 'form', type: 'select', label: 'Cylinder written as', options: [['Minus cylinder', 'minus'], ['Plus cylinder', 'plus']], value: params.form || 'minus' }
      ], (id, val) => {
        if (id === 'case') {
          const k = CASES[val]; state.od = Object.assign({}, k.od); state.os = Object.assign({}, k.os); state.prism = k.prism.slice(); state.pd = k.pd;
          ctl.set('add', k.add); loadEye();
        } else if (id === 'eye') loadEye();
        else if (id === 'sph' || id === 'cyl' || id === 'axis') { const r = state[V.eye]; r.sph = V.sph; r.cyl = V.cyl; r.axis = V.axis; }
        loop.once();
      });
      const V = ctl.values;
      function loadEye() { const r = state[V.eye]; ctl.set('sph', r.sph); ctl.set('cyl', r.cyl); ctl.set('axis', r.axis); }
      const ro = kit.readout(box.side, [['words', 'In words'], ['along', 'Power along the axis'], ['across', 'Power across the axis'], ['se', 'Spherical equivalent'], ['other', 'The same lens, the other way'], ['near', 'Power for reading, at the weaker meridian']]);
      const descr = r => {
        if (Math.abs(r.sph) < 0.005 && Math.abs(r.cyl) < 0.005) return 'plain: no power';
        const sp = Math.abs(r.sph) < 0.005 ? 'no spherical power' : fx(Math.abs(r.sph), 2) + ' D of ' + (r.sph < 0 ? 'diverging (minus)' : 'converging (plus)') + ' power';
        return Math.abs(r.cyl) < 0.005 ? sp : sp + ', and a cylinder of ' + dpt(r.cyl) + ' with its axis at ' + r.axis + '°, which adds that power across the axis';
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const plus = V.form === 'plus', sel = V.eye, rx = state[sel];
        const written = r => plus ? E.transpose(r) : r;
        // the card
        const px = 10, py = 10, pw = Math.round(W * 0.6), ph = Math.round(Hh * 0.52);
        c.fillStyle = C.dark ? '#1c2240' : '#fbfaf2'; c.fillRect(px, py, pw, ph); c.strokeStyle = C.grid; c.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);
        const col = [0.17, 0.33, 0.48, 0.61, 0.78], hd = ['SPH', 'CYL', 'AXIS', 'ADD', 'PRISM'], tc = C.dark ? '#e7e9f5' : '#232846', tm = C.dark ? '#959cbd' : '#6b7090';
        S.text(c, 'Rx', px + 12, py + 16, { size: 13, color: tm, align: 'left', font: MONO, weight: 700 });
        hd.forEach((h, i) => S.text(c, h, px + pw * col[i], py + 16, { size: 12.5, color: tm, font: MONO, weight: 700 }));
        [['od', 'OD'], ['os', 'OS']].forEach(([k, lab], j) => {
          const r = written(state[k]), y = py + 46 + j * 32;
          if (k === sel) { c.fillStyle = C.dark ? 'rgba(123,140,255,0.16)' : 'rgba(123,140,255,0.14)'; c.fillRect(px + 4, y - 14, pw - 8, 28); }
          S.text(c, lab, px + 12, y, { size: 14, color: tc, align: 'left', font: MONO, weight: 700 });
          const flat = Math.abs(r.cyl) < 0.005;
          S.text(c, sgn2(r.sph), px + pw * col[0], y, { size: 14, color: tc, font: MONO });
          S.text(c, flat ? 'DS' : sgn2(r.cyl), px + pw * col[1], y, { size: 14, color: tc, font: MONO });
          S.text(c, flat ? '' : axisStr(r.axis), px + pw * col[2], y, { size: 14, color: tc, font: MONO });
          S.text(c, V.add < 0.01 ? '' : sgn2(V.add), px + pw * col[3], y, { size: 14, color: tc, font: MONO });
          S.text(c, state.prism[j], px + pw * col[4], y, { size: 13, color: tc, font: MONO });
        });
        S.text(c, 'PD  ' + state.pd + ' mm', px + 12, py + 46 + 64 + 2, { size: 13, color: tc, align: 'left', font: MONO });
        const legend = ['SPH  sphere, D: − diverging, + converging', 'CYL  extra power across the axis; DS = none', 'AXIS direction of the cylinder, 0–180° (front view)', 'ADD  extra power for near vision', 'PRISM  Δ and base: BU up, BD down, BI in, BO out', 'PD   distance between the pupils, mm'];
        legend.forEach((t, i) => S.text(c, t, px, py + ph + 18 + i * 17, { size: 11, color: C.muted, align: 'left' }));
        // the lens
        const rw = W - (px + pw) - 20, cx = px + pw + 10 + rw / 2, R = Math.min(rw / 2 - 26, Hh / 2 - 44), cy = Hh * 0.5;
        const lo = Math.min(rx.sph, rx.sph + rx.cyl), hi2 = Math.max(rx.sph, rx.sph + rx.cyl);
        const N = 72;
        for (let k = 0; k < N; k++) {
          const a0 = k * TAU / N, a1 = (k + 1) * TAU / N, mer = ((a0 + a1) / 2 * R2D) % 180, p = E.meridian(rx, mer);
          const t = hi2 - lo < 0.005 ? 0.5 : (p - lo) / (hi2 - lo);
          c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R, -a1, -a0); c.closePath();
          c.fillStyle = C.dark ? 'rgba(130,190,255,' + (0.1 + 0.34 * t) + ')' : 'rgba(60,130,220,' + (0.08 + 0.34 * t) + ')'; c.fill();
        }
        c.strokeStyle = S.edge(); c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
        for (let d = 0; d < 360; d += 15) {
          const a = d * D2R, major = d % 30 === 0, r1 = R + (major ? 7 : 4);
          c.strokeStyle = C.faint; c.beginPath(); c.moveTo(cx + R * Math.cos(a), cy - R * Math.sin(a)); c.lineTo(cx + r1 * Math.cos(a), cy - r1 * Math.sin(a)); c.stroke();
          if (d <= 180 && major) S.text(c, String(d), cx + (R + 17) * Math.cos(a), cy - (R + 17) * Math.sin(a), { size: 10.5, color: C.muted });
        }
        const a = rx.axis * D2R, ux = Math.cos(a), uy = -Math.sin(a);
        const flatLens = Math.abs(rx.cyl) < 0.005;
        c.lineWidth = 2.4; c.strokeStyle = C.accent; c.beginPath(); c.moveTo(cx - ux * R, cy - uy * R); c.lineTo(cx + ux * R, cy + uy * R); c.stroke();
        c.strokeStyle = C.warn; c.beginPath(); c.moveTo(cx + uy * R, cy - ux * R); c.lineTo(cx - uy * R, cy + ux * R); c.stroke();
        S.text(c, flatLens ? 'the same power in every direction' : 'axis ' + rx.axis + '°', cx, cy - R - 31, { size: 11, color: C.accent, weight: 650 });
        S.text(c, (sel === 'od' ? 'right' : 'left') + ' lens, seen from the front', cx, cy + R + 28, { size: 10.5, color: C.faint });
        const pa = E.meridian(rx, rx.axis), pc = E.meridian(rx, rx.axis + 90);
        S.text(c, dpt(pa), cx + ux * (R * 0.6) - uy * 12, cy + uy * (R * 0.6) + ux * 12, { size: 11, color: C.accent, weight: 650 });
        if (!flatLens) S.text(c, dpt(pc), cx + uy * (R * 0.6) + ux * 12, cy - ux * (R * 0.6) + uy * 12, { size: 11, color: C.warn, weight: 650 });
        // read-outs
        const tr = E.transpose(rx);
        ro.set('words', (sel === 'od' ? 'Right eye: ' : 'Left eye: ') + descr(rx) + (V.add > 0.005 ? '; reading addition ' + fx(V.add, 2) + ' D' : ''));
        ro.set('along', dpt(pa) + ' along ' + rx.axis + '°');
        ro.set('across', flatLens ? 'the same' : dpt(pc) + ' along ' + ((rx.axis + 90 - 1) % 180 + 1) + '°');
        ro.set('se', dpt(E.sphericalEquivalent(rx)) + ' (the sphere that blurs about as much)');
        ro.set('other', (plus ? 'minus form: ' : 'plus form: ') + rxStr(plus ? rx : tr));
        ro.set('near', V.add > 0.005 ? dpt(Math.max(pa, pc) + V.add) + ' / ' + dpt(Math.min(pa, pc) + V.add) : 'no addition: the same as for distance');
        const pts = []; for (let d = 0; d <= 180; d += 5) pts.push([d, E.meridian(rx, d)]);
        plot.set({ series: [{ pts, label: 'power' }], marks: [{ x: rx.axis % 180, y: pa, label: 'along the axis' }], vlines: [{ x: rx.axis, label: 'axis' }], y: { label: 'power (D)', name: 'P', min: Math.floor(lo - 0.5), max: Math.ceil(hi2 + 0.5) } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ 3 · vertex distance */
  Hyper.sim('sp-vertex', {
    title: 'Vertex distance: the same focus from a spectacle lens and a contact lens',
    blurb: `A lens of power F brings parallel light to a focus at 1/F. For the eye to see a distant object clearly that focus must lie at the eye's far point. A spectacle lens sits about 12 mm in front of the cornea, a contact lens on it, so the same far point needs a different power for each. The top lane is the spectacle lens, the bottom lane the contact lens that puts the focus at the same place. The graph shows the power at the eye against the power written for the spectacle lens.

**Try this**
- Start at **−10 D** at 12 mm: the focus lies 112 mm in front of the cornea, so the contact lens needs only −8.93 D. Strong minus prescriptions come down when they move to the eye.
- Switch to **+10 D**: the focus is 88 mm behind the cornea, and the contact lens needs +11.36 D. Strong plus prescriptions go up.
- Move the spectacle lens **farther away**, from 12 to 16 mm: its effective power at the eye falls from −8.93 D to −8.62 D, which is why the distance to the eye is measured when glasses are fitted.
- Go to ±2 D: the two lanes look alike. Below about 4 D the difference is less than a quarter of a dioptre.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const plot = kit.plot(box.stage, { x: { label: 'spectacle (D)', name: 'F', min: -20, max: 20 }, y: { label: 'at eye (D)', name: 'Fe' }, series: [] }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'F', label: 'Power of the spectacle lens', min: -20, max: 20, step: 0.25, value: params.F != null ? params.F : -10, fmt: v => Math.abs(v) < 0.01 ? 'none' : dpt(v) },
        { id: 'd', label: 'Distance from the lens to the cornea (vertex distance)', min: 4, max: 20, step: 1, value: params.d || 12, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['focus', 'Focus of the spectacle lens'], ['cl', 'Contact lens with the same effect'], ['dif', 'Change on moving the lens to the eye'], ['mm', 'Change per millimetre of distance'], ['size', 'Size of the image through the spectacle lens']]);
      const eye = (c, x, y, r, C) => { c.save(); c.fillStyle = C.dark ? 'rgba(235,238,250,0.14)' : 'rgba(255,255,255,0.9)'; c.strokeStyle = C.text; c.lineWidth = 1.4; c.beginPath(); c.arc(x + r, y, r, 0, TAU); c.fill(); c.stroke(); c.lineWidth = 2.2; c.strokeStyle = C.accent; c.beginPath(); c.moveTo(x + r * 0.45, y - r * 0.55); c.lineTo(x + r * 0.45, y - r * 0.2); c.moveTo(x + r * 0.45, y + r * 0.2); c.lineTo(x + r * 0.45, y + r * 0.55); c.stroke(); c.restore(); };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, F = V.F, d = V.d;
        const xF = Math.abs(F) < 0.005 ? Infinity : -d + 1000 / F;           // the focal point, mm from the cornea (negative: in front)
        const Fcl = E.vertex(F, d / 1000, 0);
        // a scale that holds the lens, the cornea and the focal point
        // (a horizontal scale that holds the lens, the cornea and the focal point, at least 60 mm across)
        const finite = Number.isFinite(xF);
        let zmin = Math.min(-d, finite ? xF : 0, 0) - 3;
        const zmax = Math.max(0, finite ? xF : 0) + (finite && xF > 0 ? 2 : 0);
        if (zmax - zmin < 60) zmin = zmax - 60;
        const left = 24, right = finite && xF > 0 ? 24 : 52, sc = (W - left - right) / (zmax - zmin);
        const X = z => left + (z - zmin) * sc;
        const lanes = [[Hh * 0.26, -d, F, 'spectacle lens ' + dpt(F) + ', ' + d + ' mm from the cornea'], [Hh * 0.72, 0, Fcl, 'contact lens ' + dpt(Fcl) + ', on the cornea']];
        const hh = Math.min(Hh * 0.15, 44);
        lanes.forEach(([yc, zl, P, title]) => {
          S.axis(c, 8, yc, W - 8);
          eye(c, X(0) - 3, yc, 15, C);
          const xl = X(zl), xe = X(0) + 6;
          if (Math.abs(P) >= 0.005) S.thinLens(c, xl, yc, hh, P, {});
          else strokeLine(c, [[xl, yc - hh], [xl, yc + hh]], C.faint, 1, [3, 4]);
          if (finite) {
            const xf = X(xF);
            for (const f of [-0.85, -0.5, 0.5, 0.85]) {
              const y0 = yc + f * hh, tEnd = (xe - xl) / (xf - xl || 1);
              S.ray(c, [[8, y0], [xl, y0]], { nm: 587.56, width: 1.2, arrows: false });
              S.ray(c, [[xl, y0], [xe, y0 + (yc - y0) * tEnd]], { nm: 587.56, width: 1.2, arrows: false });
              if (P < 0) S.virtual(c, xl, y0, xf, yc, {});
              else if (xf > xe) strokeLine(c, [[xe, y0 + (yc - y0) * tEnd], [xf, yc]], C.faint, 1, [3, 3]);
            }
            kit.dot(c, xf, yc, 4.4, C.text, C.bg2);
            S.text(c, 'focus = the eye\'s far point', clamp(xf, 90, W - 100), yc + hh + 14, { size: 10.5, color: C.text, weight: 650 });
          }
          kit.label(c, title, 12, yc - hh - 12, { size: 11, color: C.muted });
        });
        const bar = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].filter(b => b * sc <= W * 0.3).pop() || 1;
        strokeLine(c, [[W - 24 - bar * sc, Hh - 12], [W - 24, Hh - 12]], C.muted, 1.5);
        kit.label(c, bar >= 1000 ? '1 m' : bar + ' mm', W - 30 - bar * sc, Hh - 12, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'the eye is a symbol; distances are to scale', 12, Hh - 12, { size: 10.5, color: C.faint });
        ro.set('focus', !Number.isFinite(xF) ? 'none' : xF < 0 ? mmStr(-xF / 1000) + ' in front of the cornea' : mmStr(xF / 1000) + ' behind the cornea');
        ro.set('cl', Math.abs(Fcl) < 0.005 ? 'none' : dpt(Fcl));
        ro.set('dif', Math.abs(F) < 0.005 ? 'none' : dpt(Fcl - F) + ' (' + fx(100 * (Fcl - F) / F, 1) + ' %)');
        ro.set('mm', Math.abs(F) < 0.005 ? 'none' : fx(Math.abs(E.vertex(F, (d + 1) / 1000, 0) - Fcl), 3) + ' D');
        ro.set('size', fx(100 * (E.spectacleMag(F, d / 1000, 0, 1.5, 0) - 1), 1) + ' % (' + (F < 0 ? 'smaller' : F > 0 ? 'larger' : 'unchanged') + ' than unaided)');
        const pa = [], pb = [];
        for (let f = -20; f <= 20; f += 1) { pa.push([f, E.vertex(f, d / 1000, 0)]); pb.push([f, f]); }
        plot.set({ series: [{ pts: pa, label: 'power at the eye' }, { pts: pb, label: 'the same number', dash: true }], marks: [{ x: F, y: Fcl, label: dpt(Fcl) }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 4 · prism from decentration */
  Hyper.sim('sp-prism', {
    title: 'Prentice\'s rule: a lens used off its centre is a prism',
    blurb: `A spectacle lens is a prism wherever the line of sight crosses it away from its optical centre. Light from a distant object arrives as parallel rays, crosses the lens at a height *h* from its centre, and leaves turned by an angle that grows with *h* and with the power: **Prentice's rule**, prism = power × decentration. The bright ray is the line of sight, traced through a real lens; the dashed line is where it would go without the lens. The dots on the screen at the right are the two positions. Heights are drawn larger than lengths so that the bend can be seen.

**Try this**
- Keep **+4 D** and set the line of sight 5 mm above the centre: 4 D × 0.5 cm = 2.0 Δ, and the traced ray agrees within a couple of per cent. The base lies toward the optical centre (down); the ray is turned toward it.
- Change the lens to **−4 D**: the same prism, but its base now lies *away* from the optical centre and the ray is turned outward.
- Raise the power to **10 D**: 5 mm of decentration now makes 5 Δ. A slip that is harmless in a weak lens is a real prism in a strong one.
- Set the decentration, or the power, to zero: no prism. Drag the ray up and down to see the line of sight move across the lens.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const plot = kit.plot(box.stage, { x: { label: 'decentration (mm)', name: 'h', min: -15, max: 15 }, y: { label: 'prism (Δ)', name: 'P' }, series: [] }, 120);
      const NL = O.index('CR-39', 587.56);
      const ctl = kit.controls(box.side, [
        { id: 'F', label: 'Power of the lens', min: -10, max: 10, step: 0.5, value: params.F != null ? params.F : 4, fmt: v => Math.abs(v) < 0.01 ? 'none' : dpt(v, 1) },
        { id: 'h', label: 'Where the line of sight crosses the lens, above the optical centre', min: -15, max: 15, step: 1, value: params.h != null ? params.h : 5, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rule', 'Prentice\'s rule'], ['P', 'Prism at that point'], ['tr', 'Traced through a real lens'], ['dev', 'Deviation of the line of sight'], ['base', 'The prism has its base'], ['shift', 'An object 6 m away seems displaced by']]);
      let map = null;
      kit.drag(st, {
        hover: true,
        hit: p => map && p.x < map.X(0) - 4 && Math.abs(p.y - map.Y(V.h)) < 16 ? 'ray' : null,
        move: (w, p) => { ctl.set('h', clamp(Math.round(map.Yi(p.y)), -15, 15)); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, F = V.F, h = V.h;
        const m = S.map(st, -70, 270, 28, { left: 14, right: 14, top: 16, bottom: 26, stretch: 3 });
        map = m;
        const lp = spectacleLens(F, 4, NL, 25, 1.5, 1.0);
        const sys = { surfaces: [{ R: lp.R1, t: lp.tc, n: NL, sd: 28 }, { R: lp.R2, n: 1, sd: 28 }], object: Infinity };
        const tr = O.sys.trace(sys, { p: [0, h, -20], d: [0, 0, 1] }, 587.56);
        const slope = tr.ok && tr.d[2] ? tr.d[1] / tr.d[2] : -h * F / 1000;
        const P = E.prentice(F, Math.abs(h) / 10);
        S.axis(c, m.X(-70), m.Y(0), m.X(270));
        for (const hk of [-20, -10, 0, 10, 20]) if (Math.abs(hk - h) > 2.5) S.ray(c, [[m.X(-70), m.Y(hk)], [m.X(0), m.Y(hk)], [m.X(270), m.Y(hk * (1 - 0.27 * F))]], { color: C.faint, width: 1, arrows: false, alpha: 0.7 });
        S.virtual(c, m.X(0), m.Y(h), m.X(270), m.Y(h), {});
        S.ray(c, [[m.X(-70), m.Y(h)], [m.X(0), m.Y(h)], [m.X(270), m.Y(h + 270 * slope)]], { nm: 587.56, width: 2.4, arrows: true, minArrow: 60 });
        if (Math.abs(F) >= 0.05) S.thinLens(c, m.X(0), m.Y(0), m.sy * 24, F, {}); else strokeLine(c, [[m.X(0), m.Y(24)], [m.X(0), m.Y(-24)]], C.faint, 1.2, [3, 4]);
        kit.dot(c, m.X(0), m.Y(0), 3.2, C.text, C.bg2);
        kit.label(c, 'optical centre', m.X(0) + 9, m.Y(0) + 14, { size: 10.5, color: C.muted });
        // the screen where the two rays land
        const zs = 240, yu = m.Y(h), yd = m.Y(h + zs * slope);
        strokeLine(c, [[m.X(zs), m.Y(-26)], [m.X(zs), m.Y(26)]], C.muted, 1.4);
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1.6; c.beginPath(); c.arc(m.X(zs), yu, 4, 0, TAU); c.stroke(); c.restore();
        kit.dot(c, m.X(zs), yd, 4, C.warn, C.bg2);
        if (Math.abs(yd - yu) > 8) S.dim(c, m.X(zs) + 12, yu, m.X(zs) + 12, yd, fx(Math.abs(zs * slope), 1) + ' mm', { off: -4, size: 10.5 });
        kit.label(c, 'screen 240 mm behind the lens', m.X(zs), m.Y(28) - 9, { size: 10.5, align: 'center', color: C.faint });
        // the prism at that point, a wedge whose base lies toward the optical centre (plus lens) or away from it (minus lens)
        const baseDown = (F > 0) === (h > 0);                                     // canvas y grows downward
        if (Math.abs(F) >= 0.05 && Math.abs(h) >= 0.5) {
          const wx = m.X(0) + 16, wy = m.Y(h), ya = baseDown ? wy - 9 : wy + 9, yb = baseDown ? wy + 9 : wy - 9;
          fillPoly(c, [[wx, ya], [wx + 10, yb], [wx, yb]], S.glass(0.5)); strokeLine(c, [[wx, ya], [wx + 10, yb], [wx, yb]], S.edge(), 1.2, null, true);
          kit.label(c, 'prism, base ' + (baseDown ? 'down' : 'up'), wx + 16, wy, { size: 10.5, color: C.text });
        }
        kit.label(c, 'line of sight, ' + fx(Math.abs(h), 0) + ' mm ' + (h > 0 ? 'above' : h < 0 ? 'below' : 'at') + ' the centre', m.X(-70) + 4, m.Y(h) - 12, { size: 10.5, color: C.text });
        kit.label(c, 'distant object: parallel rays', m.X(-70) + 4, m.Y(-23), { size: 10.5, color: C.muted });
        kit.label(c, 'heights are drawn ' + fx(m.stretch, 1) + ' times larger than lengths', m.X(270), Hh - 9, { size: 10.5, color: C.faint, align: 'right' });
        // read-outs
        const base = Math.abs(F) < 0.05 || Math.abs(h) < 0.5 ? 'none (no prism)' : (F > 0 ? 'toward the optical centre, ' : 'away from the optical centre, ') + (baseDown ? 'down' : 'up');
        ro.set('rule', fx(Math.abs(F), 2) + ' D × ' + fx(Math.abs(h) / 10, 1) + ' cm');
        ro.set('P', fx(P, 2) + ' Δ');
        ro.set('tr', fx(Math.abs(slope) * 100, 2) + ' Δ  (' + fx(Math.atan(Math.abs(slope)) * R2D, 2) + '°)');
        ro.set('dev', fx(Math.atan(P / 100) * R2D, 2) + '°  (1 Δ is 0.573°)');
        ro.set('base', base);
        ro.set('shift', fx(P * 6, 1) + ' cm  (1 Δ is 1 cm at 1 m)');
        const pts = []; for (let x = -15; x <= 15; x += 1) pts.push([x, E.prentice(F, Math.abs(x) / 10)]);
        plot.set({ series: [{ pts, label: 'prism' }], marks: [{ x: h, y: P, label: fx(P, 1) + ' Δ' }], y: { label: 'prism (Δ)', name: 'P', min: 0, max: 15 } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ 5 · lens materials */
  Hyper.sim('sp-materials', {
    title: 'One prescription in seven lens materials',
    blurb: `The same power, the same diameter and the same front curve, cut in seven materials. The sections are drawn as they would look through a cut across the lens, with the thickness drawn larger than the diameter so that the edge can be seen. The table gives, for each, the thickness, the weight and the size of the colour fringes (lateral chromatic aberration) 10 mm from the optical centre, from the index and the Abbe number of the material.

**Try this**
- Start with **−6 D**: a higher index gives a thinner edge (about 6.7 mm in CR-39, 4.8 mm in a 1.74 plastic), but the weight falls by much less (about 12.5 g to 10.8 g), because the denser plastics give back part of the saving.
- Look at the glass lens: it is hardly thinner than CR-39 but nearly twice as heavy.
- Read the **fringes** row: the lower the Abbe number, the larger the colour fringes at the same power and the same distance from the centre.
- Choose **+4 D**: the lens is thick in the middle and thin at the edge, and the thickness that matters is at the centre.
- Raise the **front curve** to 6 D on a minus lens: the edge grows thicker for every material.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.68, minH: 380 });
      const MATS = [['CR-39', 'CR-39'], ['crown-1.523', 'Glass'], ['trivex', 'Trivex'], ['PC', 'Polycarb.'], ['hi-1.60', '1.60'], ['hi-1.67', '1.67'], ['hi-1.74', '1.74']];
      const ctl = kit.controls(box.side, [
        { id: 'F', label: 'Power of the lens', min: -10, max: 8, step: 0.25, value: params.F != null ? params.F : -6, fmt: v => dpt(v) },
        { id: 'D', label: 'Diameter of the finished lens', min: 40, max: 70, step: 1, value: params.D || 55, unit: 'mm' },
        { id: 'F1', label: 'Front curve, the same for all', min: 0.5, max: 6, step: 0.5, value: params.F1 || 4, fmt: v => fx(v, 1) + ' D' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['thin', 'Thinnest'], ['light', 'Lightest'], ['fringe', 'Smallest colour fringes'], ['note', 'Note']]);
      function rowsFor() {
        return MATS.map(([id, label]) => {
          const a = O.abbe(id), mt = O.MATERIALS[id], n = a.nd;
          let r = V.D / 2, l = spectacleLens(V.F, V.F1, n, r, 1.5, 1.0);
          const rmax = 0.92 * Math.min(Math.abs(l.R1) || 1e9, Math.abs(l.R2) || 1e9), clipped = r > rmax;
          if (clipped) { r = rmax; l = spectacleLens(V.F, V.F1, n, r, 1.5, 1.0); }
          let vol = 0; const N = 48;
          for (let i = 0; i < N; i++) { const rho = (i + 0.5) / N * r; vol += Math.max(0, l.tc + sag(l.R2, rho) - sag(l.R1, rho)) * TAU * rho * (r / N); }
          return { id, label, n, vd: a.vd, tc: l.tc, te: l.te, R1: l.R1, R2: l.R2, r, w: vol / 1000 * mt.density, tca: Math.abs(V.F) / a.vd, clipped };
        });
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, rows = rowsFor();
        const left = 66, cw = (W - left - 8) / 7, top = 26, nRows = 6, textH = nRows * 15, barH = 12;
        const sy = Math.min(4, Math.max(1.2, (Hh - top - 8 - textH - barH - 34) / 70));
        const yc = top + 35 * sy;
        // thickness is drawn larger than the diameter by a factor k that makes the thickest lens fit its column
        const prof = rows.map(r => {
          const f = [], b = [], N = 22;
          for (let j = -N; j <= N; j++) { const rho = r.r * j / N; f.push([sag(r.R1, rho), rho]); b.push([r.tc + sag(r.R2, rho), rho]); }
          const xs = f.concat(b).map(p => p[0]);
          return { f, b, x0: Math.min.apply(null, xs), x1: Math.max.apply(null, xs) };
        });
        const ext = Math.max.apply(null, prof.map(p => p.x1 - p.x0)), k = Math.min(3, 0.62 * cw / (Math.max(ext, 0.5) * sy));
        const maxW = Math.max.apply(null, rows.map(r => r.w));
        const labels = ['index n', 'Abbe V', 'centre, mm', 'edge, mm', 'weight, g', 'fringe, Δ'];
        labels.forEach((t, i) => kit.label(c, t, 6, yc + 35 * sy + 22 + i * 15, { size: 10.5, color: C.muted }));
        rows.forEach((r, i) => {
          const cx = left + cw * (i + 0.5), pr = prof[i], mid = (pr.x0 + pr.x1) / 2;
          const pts = pr.f.map(p => [cx + (p[0] - mid) * sy * k, yc - p[1] * sy]).concat(pr.b.slice().reverse().map(p => [cx + (p[0] - mid) * sy * k, yc - p[1] * sy]));
          fillPoly(c, pts, S.glass(r.id === 'crown-1.523' ? 0.34 : 0.22)); strokeLine(c, pts, S.edge(), 1.3, null, true);
          S.axis(c, cx - cw * 0.45, yc, cx + cw * 0.45, { dash: [3, 4], color: C.faint });
          kit.label(c, r.label, cx, 13, { size: 11, align: 'center', weight: 650, color: C.text });
          const vals = [fx(r.n, 3), fx(r.vd, 0), fx(r.tc, 1), fx(r.te, 1), fx(r.w, 1), fx(r.tca, 2)], y0 = yc + 35 * sy + 22;
          vals.forEach((t, j) => kit.label(c, t, cx, y0 + j * 15, { size: 10.5, align: 'center', color: j === 4 ? C.text : C.muted, weight: j === 4 ? 650 : 500 }));
          c.fillStyle = r.w === Math.min.apply(null, rows.map(q => q.w)) ? C.ok : C.accent; c.globalAlpha = 0.7;
          c.fillRect(cx - cw * 0.4, y0 + 6 * 15 + 2, cw * 0.8 * r.w / (maxW || 1), barH); c.globalAlpha = 1;
        });
        kit.label(c, 'thickness drawn ' + fx(k, 1) + ' times larger than the diameter · 1.60, 1.67, 1.74: high-index plastics', 6, Hh - 9, { size: 10.5, color: C.faint });
        const minus = V.F < -0.05, key = rows.map(r => minus ? r.te : r.tc);
        const iThin = key.indexOf(Math.min.apply(null, key)), iLight = rows.map(r => r.w).indexOf(Math.min.apply(null, rows.map(r => r.w)));
        const iFr = rows.map(r => r.tca).indexOf(Math.min.apply(null, rows.map(r => r.tca)));
        ro.set('thin', Math.abs(V.F) < 0.05 ? 'no power: all alike' : (minus ? 'edge ' : 'centre ') + fx(key[iThin], 1) + ' mm, ' + rows[iThin].label + ' (thickest: ' + fx(Math.max.apply(null, key), 1) + ' mm)');
        ro.set('light', fx(rows[iLight].w, 1) + ' g, ' + rows[iLight].label + ' (heaviest: ' + fx(Math.max.apply(null, rows.map(r => r.w)), 1) + ' g)');
        ro.set('fringe', fx(rows[iFr].tca, 2) + ' Δ at 10 mm, ' + rows[iFr].label + ' (largest: ' + fx(Math.max.apply(null, rows.map(r => r.tca)), 2) + ' Δ)');
        ro.set('note', rows.some(r => r.clipped) ? 'This diameter needs a flatter front curve: the lens is drawn smaller than asked.' : 'Same front curve for all; a real lens in a high-index material would use a flatter curve and be thinner still.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 6 · bifocals and trifocals */
  Hyper.sim('sp-bifocal', {
    title: 'Bifocals and trifocals: the segment, the power and the image jump',
    blurb: `A lens of the person's distance power with a segment of extra power low down. The shaded area is the segment; the cross inside it is its own optical centre; the dot is where the eye looks, which you can drag. The graph under the lens is the power down the line of sight. Where the segment begins the line of sight crosses a prism (Prentice's rule, from the page on prism): the strength is the addition times the distance from the segment's optical centre to its top edge, and it makes the image jump. The ladder on the right shows how a row of rungs, 1 cm apart, is moved by it.

**Try this**
- Take the **flat-top 28** with a +2.00 D addition and drag the eye down to the top of the segment: the power rises to +2.00 D, and the ladder is shifted by about 1 Δ, 4 mm at 40 cm, with its base down so that the picture jumps *up*.
- Choose **round 22**: its optical centre is 11 mm below its top edge, so the same addition gives 2.2 Δ, more than twice the jump.
- Choose **executive**: the optical centre lies on the dividing line and there is no jump at all.
- Choose the **trifocal**: an intermediate segment of half the addition lies between, with two lines and two small jumps. The distances are the typical ones of the textbook figures; makers' segments differ a little.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const plot = kit.plot(box.stage, { x: { label: 'height (mm)', name: 'y', min: -26, max: 12, reverse: true }, y: { label: 'power (D)', name: 'P', min: -0.2, max: 3.8 }, series: [] }, 115);
      const TYPES = {
        ft28: { label: 'Flat-top 28 mm', zones: [{ top: -5, bot: -60, oc: -10, w: 28, f: 1, view: 0.4, name: 'near segment' }] },
        r22: { label: 'Round 22 mm', zones: [{ top: -5, bot: -27, oc: -16, w: 22, f: 1, view: 0.4, name: 'near segment', round: true }] },
        exec: { label: 'Executive (whole lower half)', zones: [{ top: -5, bot: -60, oc: -5, w: 60, f: 1, view: 0.4, name: 'near segment' }] },
        tri: { label: 'Trifocal 7 × 28 mm', zones: [{ top: -5, bot: -12, oc: -8.5, w: 28, f: 0.5, view: 0.7, name: 'intermediate segment' }, { top: -12, bot: -60, oc: -17, w: 28, f: 1, view: 0.4, name: 'near segment' }] }
      };
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Segment', options: Object.keys(TYPES).map(k => [TYPES[k].label, k]), value: params.type || 'ft28' },
        { id: 'add', label: 'Near addition', min: 0.75, max: 3.5, step: 0.25, value: params.add || 2, fmt: v => dpt(v) },
        { id: 'y', label: 'Where the eye looks, from the fitting cross', min: -26, max: 12, step: 0.5, value: params.y != null ? params.y : 4, fmt: v => (v > 0 ? '+' : v < 0 ? MINUS : '') + Math.abs(v).toFixed(1) + ' mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['zone', 'The eye looks through'], ['pow', 'Power there'], ['pri', 'Vertical prism there'], ['jump', 'Image jump at the line(s)'], ['mm', 'Jump seen at the working distance'], ['near', 'The near part is in focus for an object at']]);
      const zoneAt = (T, y) => T.zones.find(z => y <= z.top && y > z.bot) || null;
      const prismOf = (z, y, add) => add * z.f * (y - z.oc) / 10;               // prism dioptres, positive: base down
      let geo = null;
      kit.drag(st, {
        hover: true,
        hit: p => geo && p.x >= geo.x0 && p.x <= geo.x0 + 60 * geo.s ? 'eye' : null,
        move: (w, p) => { ctl.set('y', clamp(Math.round((geo.y0 - p.y) / geo.s * 2) / 2, -26, 12)); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, T = TYPES[V.type], add = V.add, y = V.y;
        const Lw = Math.round(W * 0.5), s = Math.min((Lw - 24) / 56, (Hh - 40) / 42), x0 = 12, xc = x0 + 28 * s, y0 = 22 + 13 * s;
        geo = { x0, y0, s };
        const X = x => xc + x * s, Y = yy => y0 - yy * s;
        // the lens outline: a rounded shape 54 mm wide, from +13 mm to −27 mm
        const lens = [], rx = 27, rt = 13, rb = -27, rr = 12;
        const arc = (cx, cy, a0, a1) => { for (let k = 0; k <= 8; k++) { const a = a0 + (a1 - a0) * k / 8; lens.push([X(cx + rr * Math.cos(a)), Y(cy + rr * Math.sin(a))]); } };
        arc(rx - rr, rt - rr, 0, PI / 2); arc(-rx + rr, rt - rr, PI / 2, PI); arc(-rx + rr, rb + rr, PI, 1.5 * PI); arc(rx - rr, rb + rr, 1.5 * PI, 2 * PI);
        fillPoly(c, lens, S.glass(0.12));
        c.save(); path(c, lens, true); c.clip();
        for (const z of T.zones) {
          c.fillStyle = S.glass(0.34);
          if (z.round) { c.beginPath(); c.arc(X(0), Y(z.top - z.w / 2), z.w / 2 * s, 0, TAU); c.fill(); c.strokeStyle = S.edge(); c.lineWidth = 1.4; c.stroke(); }
          else { const bot = Math.max(z.bot, rb - 1), wd = Math.min(z.w, 2 * rx + 2); c.fillRect(X(-wd / 2), Y(z.top), wd * s, (z.top - bot) * s); strokeLine(c, [[X(-wd / 2), Y(z.top)], [X(wd / 2), Y(z.top)]], S.edge(), 1.4); if (z.bot > rb) strokeLine(c, [[X(-wd / 2), Y(z.bot)], [X(wd / 2), Y(z.bot)]], S.edge(), 1.2); }
        }
        c.restore();
        strokeLine(c, lens, S.edge(), 1.8, null, true);
        // the optical centres of the segments and the fitting cross
        for (const z of T.zones) { strokeLine(c, [[X(-3), Y(z.oc)], [X(3), Y(z.oc)]], C.warn, 1.4); strokeLine(c, [[X(0), Y(z.oc) - 3 * s], [X(0), Y(z.oc) + 3 * s]], C.warn, 1.4); }
        kit.label(c, 'segment optical centre', X(4), Y(T.zones[T.zones.length - 1].oc) + 1, { size: 10.5, color: C.warn });
        strokeLine(c, [[X(-3), Y(0)], [X(3), Y(0)]], C.muted, 1); strokeLine(c, [[X(0), Y(0) - 3 * s], [X(0), Y(0) + 3 * s]], C.muted, 1);
        kit.label(c, 'fitting cross', X(4), Y(0), { size: 10.5, color: C.muted });
        kit.label(c, 'distance part', X(-26), Y(10), { size: 10.5, color: C.muted });
        kit.label(c, T.zones[0].name === 'near segment' ? 'near' : 'intermediate', X(-12.5) + 4, Y(T.zones[0].top) + 12, { size: 10.5, color: C.muted });
        kit.dot(c, X(0), Y(y), 5.5, C.accent, C.bg2);
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(-rx), Y(y)); c.lineTo(X(rx), Y(y)); c.stroke(); c.restore();
        // the ladder: rungs 1 cm apart, seen through the distance part and through the lens at the gaze
        const z = zoneAt(T, y), pr = z ? prismOf(z, y, add) : 0, view = z ? z.view : 0.4, up = pr * view;         // shift in cm, upward when the prism is base down
        const px0 = Lw + 22, pw = W - px0 - 10, ph = Hh - 44, py0 = 30, sc = 11;
        panel(c, C, px0, py0 - 18, pw, ph + 22, 'rungs 1 cm apart, seen at ' + fx(view * 100, 0) + ' cm', S);
        c.save(); c.beginPath(); c.rect(px0 + 1, py0, pw - 2, ph); c.clip();
        const colW = pw * 0.36, ca = px0 + pw * 0.08, cb = px0 + pw * 0.56;
        for (let k = -2; k < ph / sc + 2; k++) {
          const yy = py0 + k * sc;
          strokeLine(c, [[ca, yy], [ca + colW, yy]], C.muted, 2);
          strokeLine(c, [[cb, yy - up * sc], [cb + colW, yy - up * sc]], C.accent, 2);
        }
        c.restore();
        kit.label(c, 'through the distance part', ca + colW / 2, py0 + ph + 3, { size: 10, align: 'center', color: C.muted });
        kit.label(c, 'through the lens at the dot', cb + colW / 2, py0 + ph + 3, { size: 10, align: 'center', color: C.accent });
        // read-outs and the graph
        const lines = T.zones.map((zz, i) => { const prev = i ? prismOf(T.zones[i - 1], zz.top, add) : 0; return prismOf(zz, zz.top, add) - prev; });
        ro.set('zone', z ? z.name : 'the distance part');
        ro.set('pow', z ? dpt(add * z.f) : 'the distance power (0.00 D added)');
        ro.set('pri', !z || Math.abs(pr) < 0.005 ? 'none' : fx(Math.abs(pr), 2) + ' Δ, base ' + (pr > 0 ? 'down' : 'up'));
        ro.set('jump', lines.map(j => Math.abs(j) < 0.005 ? 'none' : fx(Math.abs(j), 2) + ' Δ').join(' and ') + (T.zones.length > 1 ? ' (upper line, lower line)' : ''));
        ro.set('mm', lines.map((j, i) => fx(Math.abs(j) * T.zones[i].view * 10, 1) + ' mm at ' + fx(T.zones[i].view * 100, 0) + ' cm').join(' and '));
        ro.set('near', fx(100 / add, 0) + ' cm: with no focusing effort at all');
        const pts = []; for (let yy = 12; yy >= -26; yy -= 0.25) { const zz = zoneAt(T, yy); pts.push([yy, zz ? add * zz.f : 0]); }
        plot.set({ series: [{ pts, label: 'power' }], vlines: [{ x: y, label: '' }], y: { label: 'power (D)', name: 'P', min: -0.2, max: Math.max(1, add + 0.4) } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 7 · progressive lenses */
  Hyper.sim('sp-pal', {
    title: 'A progressive lens: the added power and the unwanted astigmatism',
    blurb: `Two maps of the same lens, 60 mm square, seen from the front, with the fitting cross at the centre of the picture. On the left, the **added power** from the distance part at the top to the full addition in the near part at the bottom, reached along the corridor. On the right, the **unwanted astigmatism** the smooth change of power brings with it: the clear channel in the middle, and the blurred zones to each side. The model is schematic: the shape is the smooth progression that Minkwitz's theorem requires, and every real design is its maker's own. Drag the dot over either map to read the values there.

**Try this**
- Start with **+2.00 D** and a **14 mm** corridor, and drag the dot down the middle: the power climbs smoothly from zero to the full addition, and the astigmatism stays near zero on the centre line.
- Move the dot sideways, level with the middle of the corridor: the astigmatism rises about twice as fast sideways as the power changes along the corridor (Minkwitz's theorem).
- Shorten the corridor to **11 mm**: the power changes faster, and the astigmatism on each side is larger and closer in. Lengthen it to **18 mm** and both ease.
- Increase the addition to **3.00 D**: with the same corridor the astigmatism grows in proportion.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const plot = kit.plot(box.stage, { x: { label: 'height (mm)', name: 'y', min: -34, max: 12, reverse: true }, y: { label: 'power (D)', name: 'P', min: 0, max: 3 }, series: [] }, 115);
      const ctl = kit.controls(box.side, [
        { id: 'add', label: 'Addition', min: 0.75, max: 3.5, step: 0.25, value: params.add || 2, fmt: v => dpt(v) },
        { id: 'Lc', label: 'Corridor length', min: 11, max: 18, step: 1, value: params.Lc || 14, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['here', 'Added power at the dot'], ['cyl', 'Unwanted astigmatism at the dot'], ['acu', 'Roughly, vision at that point'], ['full', 'Full addition reached'], ['grad', 'Steepest change of power along the corridor'], ['mink', 'Astigmatism rises sideways at up to'], ['chan', 'Width kept below 0.5 D, mid-corridor'], ['max', 'Largest unwanted astigmatism in the lens']]);
      const X0 = -30, Y1 = 26, SPAN = 60, R = 28, CY = -4;
      const probe = { x: params.px != null ? params.px : 3, y: params.py != null ? params.py : -10 };
      let g = null;
      kit.drag(st, {
        hover: true,
        hit: p => g && g.panels.some(q => p.x >= q.x && p.x <= q.x + g.side && p.y >= q.y && p.y <= q.y + g.side) ? 'dot' : null,
        move: (w, p) => {
          const q = g.panels.find(q => p.x >= q.x - 30 && p.x <= q.x + g.side + 30) || g.panels[0];
          probe.x = clamp(X0 + (p.x - q.x) / g.side * SPAN, -29, 29); probe.y = clamp(Y1 - (p.y - q.y) / g.side * SPAN, -33, 25);
          loop.once();
        }
      });
      const bg = C => C.dark ? [21, 26, 49] : [244, 246, 252];
      const powerRgb = (t, C) => { const b = bg(C); const k = Math.min(1, t * 1.25), col = hsl(225 - 205 * t, 0.72, C.dark ? 0.5 : 0.56); return [b[0] + (col[0] - b[0]) * Math.min(1, k + 0.12 * (t > 0)), b[1] + (col[1] - b[1]) * Math.min(1, k + 0.12 * (t > 0)), b[2] + (col[2] - b[2]) * Math.min(1, k + 0.12 * (t > 0))]; };
      const astRgb = (t, C) => {
        const stops = [[0, bg(C)], [0.2, [250, 222, 100]], [0.45, [240, 150, 60]], [0.75, [215, 55, 50]], [1, [110, 20, 45]]];
        for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) { const a = stops[i - 1], b = stops[i], u = (t - a[0]) / (b[0] - a[0]); return [0, 1, 2].map(k => a[1][k] + (b[1][k] - a[1][k]) * u); }
        return stops[stops.length - 1][1];
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, add = V.add, Lc = V.Lc;
        const side = Math.min((W - 34) / 2, Hh - 52), px0 = 12, py0 = 26, panels = [{ x: px0, y: py0 }, { x: px0 + side + 10, y: py0 }];
        g = { panels, side };
        const key = [add, Lc, C.dark].join('|'), o = { add, corridor: Lc };
        const names = ['added power (D)', 'unwanted astigmatism (D)'];
        panels.forEach((q, i) => {
          kit.label(c, names[i], q.x + side / 2, q.y - 12, { size: 11, align: 'center', color: C.muted });
          const U = x => q.x + (x - X0) / SPAN * side, Yp = yy => q.y + (Y1 - yy) / SPAN * side;
          c.save(); c.beginPath(); c.arc(U(0), Yp(CY), R / SPAN * side, 0, TAU); c.clip();
          S.image(c, q.x, q.y, side, side, 90, 90, (u, v) => { const r = E.pal(X0 + u * SPAN, Y1 - v * SPAN, o); return i ? astRgb(Math.min(1, r.cyl / (1.1 * add)), C) : powerRgb(r.add / add, C); }, { key, id: i ? 'ast' : 'pow' });
          c.restore();
          c.save(); c.strokeStyle = S.edge(); c.lineWidth = 1.6; c.beginPath(); c.arc(U(0), Yp(CY), R / SPAN * side, 0, TAU); c.stroke(); c.restore();
          strokeLine(c, [[U(-4), Yp(0)], [U(4), Yp(0)]], C.text, 1.2); strokeLine(c, [[U(0), Yp(0) - 4], [U(0), Yp(0) + 4]], C.text, 1.2);
          strokeLine(c, [[U(-R), Yp(-2 - Lc)], [U(R), Yp(-2 - Lc)]], C.faint, 1, [3, 4]);
          kit.dot(c, U(probe.x), Yp(probe.y), 5, C.text, C.bg2);
          if (!i) { kit.label(c, 'fitting cross', U(5), Yp(0) - 8, { size: 10, color: C.text }); kit.label(c, 'full addition reached', U(-R + 1), Yp(-2 - Lc) - 8, { size: 10, color: C.text }); }
        });
        // colour keys
        const kx = panels[1].x, ky = py0 + side + 8;
        for (let k = 0; k < 80; k++) { const t = k / 79; c.fillStyle = css(astRgb(t, C)); c.fillRect(kx + side * 0.15 + side * 0.7 * k / 80, ky, side * 0.7 / 80 + 0.6, 7); }
        kit.label(c, '0', kx + side * 0.15 - 8, ky + 4, { size: 10, align: 'right', color: C.muted }); kit.label(c, fx(1.1 * add, 1) + ' D', kx + side * 0.85 + 6, ky + 4, { size: 10, color: C.muted });
        for (let k = 0; k < 80; k++) { const t = k / 79; c.fillStyle = css(powerRgb(t, C)); c.fillRect(panels[0].x + side * 0.15 + side * 0.7 * k / 80, ky, side * 0.7 / 80 + 0.6, 7); }
        kit.label(c, '0', panels[0].x + side * 0.15 - 8, ky + 4, { size: 10, align: 'right', color: C.muted }); kit.label(c, fx(add, 2) + ' D', panels[0].x + side * 0.85 + 6, ky + 4, { size: 10, color: C.muted });
        // read-outs
        const r = E.pal(probe.x, probe.y, o), inLens = Math.hypot(probe.x, probe.y - CY) <= R;
        ro.set('here', dpt(r.add) + (inLens ? '' : ' (outside the lens)'));
        ro.set('cyl', fx(r.cyl, 2) + ' D');
        ro.set('acu', r.cyl < 0.12 ? 'clear' : 'like being out of focus by about ' + fx(r.cyl / 2, 2) + ' D: ' + fx(E.blurAngle(r.cyl / 2, 4) * ARCMIN, 1) + '′ of blur, acuity near 20/' + E.acuityFromDefocus(r.cyl / 2));
        ro.set('full', fx(Lc + 2, 0) + ' mm below the fitting cross');
        const gmax = E.pal(0, -2 - Lc / 2, o).gradient;
        ro.set('grad', fx(gmax, 3) + ' D/mm  (the average is ' + fx(add / Lc, 3) + ' D/mm)');
        ro.set('mink', fx(2 * gmax, 2) + ' D per mm: twice the steepest change of power');
        let xHalf = 0; for (let x = 0; x < 20; x += 0.05) { if (E.pal(x, -2 - Lc / 2, o).cyl >= 0.5) { xHalf = x; break; } xHalf = x; }
        ro.set('chan', fx(2 * xHalf, 1) + ' mm in this model');
        let mx = 0; for (let ix = -R; ix <= R; ix += 1) for (let iy = CY - R; iy <= CY + R; iy += 1) if (Math.hypot(ix, iy - CY) <= R) mx = Math.max(mx, E.pal(ix, iy, o).cyl);
        ro.set('max', fx(mx, 2) + ' D, ' + fx(100 * mx / add, 0) + ' % of the addition');
        const pts = [], ps = []; for (let yy = 12; yy >= -34; yy -= 0.5) { pts.push([yy, E.pal(0, yy, o).add]); ps.push([yy, E.pal(6, yy, o).cyl]); }
        plot.set({ series: [{ pts, label: 'power on the centre line' }, { pts: ps, label: 'astigmatism 6 mm to the side', dash: true }], vlines: [{ x: probe.y, label: '' }], y: { label: 'D', name: 'D', min: 0, max: Math.max(1, 1.2 * add) } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 8 · how far each lens reaches */
  Hyper.sim('sp-reach', {
    title: 'How far each kind of lens reaches',
    blurb: `A ruler of **proximity** in dioptres: 0 D is infinity, 1 D is one metre, 2 D half a metre, 4 D a quarter of a metre. Each row shows the distances that stay sharp for a person of the chosen age wearing a lens of that kind. The eye can bring into focus only what lies within the amount of focusing it has left (the average amplitude for the age, with half kept in reserve) plus its depth of focus of 0.25 D; the lens shifts that window by its power at the point the eye looks through. The vertical lines are everyday tasks: green where the selected lens keeps them sharp, red where it does not. The ranges are the arithmetic of vergence; they say how far each design *can* reach, not how any person will see.

**Try this**
- Start at **58 years** with a **+2.25 D** addition and choose *Distance only*: far things are sharp from about a metre and a quarter outward, and the screen, the page and the phone are not.
- *Reading only*: the page and the phone are sharp and the street is not; the window is only a few centimetres deep.
- *Bifocal*: two windows with a gap between them, and the screen at 70 cm falls in the gap.
- *Progressive* joins them, through different parts of the lens. *Office lens* trades the distance for a wide window from the working distance to its chosen range, shown with the **range** control.
- Raise the age to **65**: the average amplitude has gone, every window shrinks to the depth of focus, and each lens covers less.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 330 });
      const LENSES = [['dist', 'Distance only'], ['read', 'Reading only'], ['bif', 'Bifocal'], ['pal', 'Progressive'], ['off', 'Office lens']];
      const TASKS = [['the street', 0], ['a room, 4 m', 0.25], ['a table, 1.5 m', 1 / 1.5], ['the screen, 70 cm', 1 / 0.7], ['a page, 40 cm', 2.5], ['the phone, 33 cm', 3]];
      const tableAdd = age => { const T = E.ADD_BY_AGE; if (age <= T[0][0]) return T[0][1]; for (let i = 1; i < T.length; i++) if (age <= T[i][0]) return T[i - 1][1] + (T[i][1] - T[i - 1][1]) * (age - T[i - 1][0]) / (T[i][0] - T[i - 1][0]); return T[T.length - 1][1]; };
      const ctl = kit.controls(box.side, [
        { id: 'age', label: 'Age', min: 40, max: 70, step: 1, value: params.age || 58, unit: 'years' },
        { id: 'add', label: 'Addition at the reading level', min: 0.75, max: 3, step: 0.25, value: params.add || 2.25, fmt: v => dpt(v) },
        { id: 'room', type: 'select', label: 'Office lens: farthest clear distance', options: [['1 m', 1], ['2 m', 2], ['4 m', 4]], value: params.room || 4 },
        { id: 'lens', type: 'select', label: 'Lens for the green and red marks', options: LENSES.map(l => [l[1], l[0]]), value: params.lens || 'bif' },
        { type: 'buttons', items: [{ id: 'typical', label: 'Typical addition for this age' }] }
      ], id => { if (id === 'typical') ctl.set('add', clamp(Math.round(tableAdd(V.age) * 4) / 4, 0.75, 3)); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['amp', 'Focusing amplitude left, on average'], ['use', 'Used, with half in reserve']].concat(TASKS.map((t, i) => ['t' + i, t[0]])));
      const DOF = 0.25;
      const bandsOf = (id, add, ac, room) => {
        switch (id) {
          case 'dist': return [[0, ac + DOF]];
          case 'read': return [[Math.max(0, add - DOF), add + ac + DOF]];
          case 'bif': return [[0, ac + DOF], [Math.max(0, add - DOF), add + ac + DOF]];
          case 'pal': return [[0, add + ac + DOF]];
          default: { const top = Math.min(add, 1 / room + DOF); return [[Math.max(0, top - DOF), add + ac + DOF]]; }
        }
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const amp = E.accommodation(V.age).avg, ac = amp / 2;
        const x0 = Math.min(150, W * 0.22), x1 = W - 16, DM = 4, X = d => x0 + (x1 - x0) * clamp(d, 0, DM) / DM;
        const yTop = 52, yBot = Hh - 34, rowH = (yBot - yTop) / LENSES.length;
        const inBands = (bands, d) => bands.some(b => d >= b[0] - 1e-9 && d <= b[1] + 1e-9);
        const selBands = bandsOf(V.lens, V.add, ac, V.room);
        LENSES.forEach(([id, name], i) => {
          const y = yTop + i * rowH;
          c.fillStyle = id === V.lens ? S.glass(0.14) : 'rgba(128,128,128,0.06)'; c.fillRect(6, y + 2, W - 12, rowH - 4);
          kit.label(c, name, 12, y + rowH / 2, { size: 11, color: id === V.lens ? C.text : C.muted, weight: id === V.lens ? 650 : 500 });
          for (const b of bandsOf(id, V.add, ac, V.room)) {
            const bx0 = X(b[0]), bx1 = X(Math.min(b[1], DM));
            c.fillStyle = C.accent; c.globalAlpha = id === V.lens ? 0.75 : 0.45; c.fillRect(bx0, y + rowH * 0.28, Math.max(2, bx1 - bx0), rowH * 0.44); c.globalAlpha = 1;
          }
        });
        // the ruler
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0, yBot + 4); c.lineTo(x1, yBot + 4); c.stroke();
        for (let d = 0; d <= DM; d += 0.5) { c.strokeStyle = C.faint; c.beginPath(); c.moveTo(X(d), yBot + 1); c.lineTo(X(d), yBot + 7); c.stroke(); kit.label(c, d === 0 ? '0 D' : d === DM ? '4 D' : fx(d, 1), X(d), yBot + 17, { size: 10.5, align: 'center', color: C.muted }); }
        kit.label(c, 'proximity: 1 / distance in metres', x1, yBot + 29, { size: 10, align: 'right', color: C.faint });
        // the tasks
        TASKS.forEach(([name, d], i) => {
          const ok = inBands(selBands, d), col = ok ? C.ok : C.bad, ty = 12 + (i % 2) * 15;
          c.save(); c.strokeStyle = col; c.lineWidth = 1.6; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(d), ty + 8); c.lineTo(X(d), yBot + 4); c.stroke(); c.restore();
          kit.label(c, name, clamp(X(d), x0 + 4, x1 - 4), ty, { size: 10, align: i === 0 ? 'left' : i === TASKS.length - 1 ? 'right' : 'center', color: col, weight: 650 });
          ro.set('t' + i, ok ? 'sharp' : d > Math.max.apply(null, selBands.map(b => b[1])) ? 'blurred: nearer than this lens reaches' : d < Math.min.apply(null, selBands.map(b => b[0])) ? 'blurred: farther than this lens reaches' : 'blurred: in the gap between the zones');
        });
        ro.set('amp', fx(amp, 2) + ' D (Hofstetter, average for the age)');
        ro.set('use', fx(ac, 2) + ' D, plus 0.25 D depth of focus');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 9 · coatings on a spectacle lens */
  Hyper.sim('sp-coatings', {
    title: 'A spectacle lens: reflection, coating, and what is filtered',
    blurb: `Light meeting a spectacle lens is shared between four fates: reflected by the front surface, reflected by the back surface, absorbed (here by an optional filter) and transmitted. The bar shows the shares for white daylight. The graphs show, against wavelength, the reflectance of *one* surface (thin films computed layer by layer) and the transmittance of the whole lens. The two swatches are the colour of the reflection, brightened so that it can be seen, and the colour of the light that gets through. Absorption in the bulk of the material is not included, apart from its ultraviolet edge, which is taken from the range of transparency of the material.

**Try this**
- Take polycarbonate with **no coating**: each surface reflects 5.1 %, together about 10 %, a bright ghost on each surface, and the reflected colour is neutral.
- Add the **single layer of MgF₂**: reflection per surface falls to about 0.9 %, and the leftover is purple, because a layer tuned for green leaves the ends of the spectrum.
- Choose the **three-layer broadband** coating: below 0.4 %. Then raise the **angle** to 50°: the reflection climbs to about 1.2 % and its colour shifts, because the optical thickness of every layer changes with angle.
- Switch to the **1.74** plastic: uncoated it reflects 7.3 % per surface; the simple MgF₂ layer does better on it than on the low-index plastics, because the ideal layer index is the square root of the substrate's.
- Try the filters: the *UV-absorbing* option cuts the ultraviolet below 400 nm with almost no change in the visible; the *blue-light filter* removes a share of 400–450 nm light and tints the transmitted light a little yellow. The numbers are illustrative of the kind of filter, not of any product.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.27, minH: 205 });
      const plotR = kit.plot(box.stage, { x: { label: 'wavelength (nm)', name: 'λ', min: 340, max: 780 }, y: { label: 'reflect. (%)', name: 'R' }, series: [] }, 110);
      const plotT = kit.plot(box.stage, { x: { label: 'wavelength (nm)', name: 'λ', min: 340, max: 780 }, y: { label: 'transm. (%)', name: 'T', min: 0, max: 100 }, series: [] }, 110);
      const MATS = [['CR-39', 'CR-39 plastic'], ['crown-1.523', 'Crown glass'], ['trivex', 'Trivex'], ['PC', 'Polycarbonate'], ['hi-1.60', 'High-index 1.60'], ['hi-1.67', 'High-index 1.67'], ['hi-1.74', 'High-index 1.74']];
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Lens material', options: MATS.map(m => [m[1], m[0]]), value: params.mat || 'PC' },
        { id: 'coat', type: 'select', label: 'Coating on both surfaces', options: [['None', 'uncoated'], ['Single layer of MgF₂', 'mgf2'], ['Three-layer broadband', 'bbar']], value: params.coat || 'bbar' },
        { id: 'aoi', label: 'Angle of incidence', min: 0, max: 60, step: 1, value: params.aoi || 0, unit: '°' },
        { id: 'filt', type: 'select', label: 'Filtering', options: [['None: the material alone', 'none'], ['UV-absorbing treatment (to 400 nm)', 'uv'], ['Blue-light filter (a share of 400–450 nm)', 'blue']], value: params.filt || 'none' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r1', 'Reflected by one surface'], ['tot', 'Lost to the two surfaces'], ['T', 'Transmitted (visible light)'], ['uva', 'UV-A, 350–380 nm, transmitted'], ['blue', 'Light of 400–450 nm, transmitted'], ['tint', 'Colour of the transmitted light']]);
      const day = O.photo.spectrum('daylight');
      const logi = (x, c, w) => 1 / (1 + Math.exp(-(x - c) / w));
      const filterT = (nm, f, edge) => {
        let t = logi(nm, edge, 3);                                       // the material's own ultraviolet edge
        if (f === 'uv') t *= logi(nm, 395, 4);
        else if (f === 'blue') t *= 1 - 0.3 / (1 + Math.exp((nm - 445) / 9)) * logi(nm, 392, 4) * 1;
        return t;
      };
      const rgbOf = XYZ => Cl.srgb(Cl.fit(Cl.toRgb(XYZ)));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const th = V.aoi * D2R, edge = O.MATERIALS[V.mat].range[0];
        const def = O.film.design(V.coat, 550, V.mat);
        const Rof = nm => O.film.stack(def, nm, th).R;
        const Tof = nm => { const r = Rof(nm); return (1 - r) * (1 - r) / (1 - r * r) * filterT(nm, V.filt, edge); };
        // luminous (daylight × V(λ)) averages
        let nR = 0, nT = 0, den = 0, uvN = 0, uvD = 0, bN = 0, bD = 0;
        for (let nm = 380; nm <= 780; nm += 5) { const w = O.photo.V(nm) * day(nm); den += w; nR += Rof(nm) * w; nT += Tof(nm) * w; }
        for (let nm = 350; nm <= 380; nm += 5) { uvN += Tof(nm); uvD += 1; }
        for (let nm = 400; nm <= 450; nm += 5) { const w = day(nm); bN += Tof(nm) * w; bD += w; }
        const r1 = nR / den, T = nT / den, tot = 1 - (1 - r1) * (1 - r1) / (1 - r1 * r1), absorbed = Math.max(0, 1 - tot - T);
        // the bar of fates
        const bx = 14, bw = W - 28, by = 34, bh = 26;
        c.fillStyle = C.bg2; c.fillRect(bx, by, bw, bh);
        const seg = [[r1, C.warn, 'front'], [Math.max(0, tot - r1), C.bad, 'back'], [absorbed, C.faint, 'absorbed'], [T, C.ok, 'transmitted']];
        let x = bx; for (const [f, col] of seg) { c.fillStyle = col; c.fillRect(x, by, bw * f, bh); x += bw * f; }
        c.strokeStyle = C.grid; c.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
        kit.label(c, 'what happens to 100 units of daylight', bx, 14, { size: 11, color: C.muted });
        const legend = [['reflected, front ' + fx(100 * r1, 1) + ' %', C.warn], ['reflected, back ' + fx(100 * (tot - r1), 1) + ' %', C.bad], ['absorbed ' + fx(100 * absorbed, 1) + ' %', C.faint], ['transmitted ' + fx(100 * T, 1) + ' %', C.ok]];
        legend.forEach(([t, col], i) => { const lx = bx + (bw / 4) * i; c.fillStyle = col; c.fillRect(lx, by + bh + 12, 9, 9); kit.label(c, t, lx + 14, by + bh + 17, { size: 10.5, color: C.text }); });
        // the two swatches
        const sy = by + bh + 36, sh = Math.max(34, Hh - sy - 10), sw = Math.min(180, bw / 2 - 10);
        const spR = nm => Rof(nm) * day(nm), XR = Cl.xyz(spR), XT = Cl.xyz(nm => Tof(nm) * day(nm));
        const rr = rgbOf([XR[0] * 0.45, 0.45, XR[2] * 0.45]), tt = rgbOf([XT[0] * 0.75, 0.75, XT[2] * 0.75]);
        c.fillStyle = css(rr); c.fillRect(bx, sy, sw, sh); c.fillStyle = css(tt); c.fillRect(bx + bw / 2, sy, sw, sh);
        kit.label(c, 'colour of the reflection (brightened)', bx + sw + 8, sy + sh / 2, { size: 10.5, color: C.muted });
        kit.label(c, 'colour of the light that passes', bx + bw / 2 + sw + 8, sy + sh / 2, { size: 10.5, color: C.muted });
        // read-outs
        ro.set('r1', fx(100 * r1, 2) + ' % (luminous, at ' + V.aoi + '°)');
        ro.set('tot', fx(100 * tot, 1) + ' %: about ' + (tot > 0.005 ? '1 part in ' + fx(1 / tot, 0) : 'none'));
        ro.set('T', fx(100 * T, 1) + ' %');
        ro.set('uva', fx(100 * uvN / uvD, 0) + ' %');
        ro.set('blue', fx(100 * bN / bD, 0) + ' %');
        const XT0 = Cl.xyz(nm => { const r = Rof(nm); return (1 - r) * (1 - r) / (1 - r * r) * filterT(nm, 'none', edge) * day(nm); });
        const db = Cl.lab(XT)[2] - Cl.lab(XT0)[2];
        ro.set('tint', db > 1.5 ? 'a little yellow (b* shifted by +' + fx(db, 1) + ')' : 'no visible tint (b* shifted by ' + fx(db, 1) + ')');
        const pr = [], pt = []; for (let nm = 340; nm <= 780; nm += 4) { pr.push([nm, 100 * Rof(nm)]); pt.push([nm, 100 * Tof(nm)]); }
        plotR.set({ series: [{ pts: pr, label: 'one surface' }], y: { label: 'reflect. (%)', name: 'R', min: 0, max: Math.max(1, Math.ceil(Math.max.apply(null, pr.map(p => p[1])) * 1.1)) }, vlines: [{ x: 380, label: '' }, { x: 780, label: '' }] });
        plotT.set({ series: [{ pts: pt, label: 'whole lens' }], vlines: [{ x: 380, label: 'UV | visible' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 10 · photochromic lenses */
  Hyper.sim('sp-photochromic', {
    title: 'A photochromic lens: darkening with ultraviolet, clearing with time and warmth',
    blurb: `A photochromic lens darkens in ultraviolet light and fades back when the ultraviolet stops, as the temperature allows. The picture runs by itself: on the left the view through the lens, in the middle the lens over white paper, on the right the sunglass categories of ISO 12312-1 with the present one marked; the graph is the transmittance over the last few minutes. The rates are those of a simple two-state model (darkening in proportion to the ultraviolet reaching the lens, fading faster when warmer) with numbers typical of the order of such lenses, not of any product.

**Try this**
- Press **Step outside**: the lens darkens with a time constant of about 22 s in full sun and reaches category 3. Run time at real speed to see it, or faster to see the whole day.
- Press **Go indoors**: the lens clears with a time constant of about three minutes at 23 °C; the fading takes much longer than the darkening.
- Choose **Behind a car windscreen**: the glass absorbs most of the ultraviolet, so the lens only tints a little; this is why photochromic lenses stay nearly clear while driving.
- In full sun, move the temperature from **5 °C** to **35 °C**: it settles darker in the cold (about 14 % transmitted) and lighter in the heat (about 18 %), and the fade is slower when it is cold.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 250 });
      const ENVS = [['Indoors, away from windows', 0], ['Behind a car windscreen', 0.01], ['Open shade', 0.25], ['Thin cloud', 0.6], ['Full sun', 1]];
      const plot = kit.plot(box.stage, { x: { label: 'time (s)', name: 't' }, y: { label: 'transm. (%)', name: 'T', min: 0, max: 100 }, series: [], hlines: [{ y: 80, label: '' }, { y: 43, label: '' }, { y: 18, label: '' }, { y: 8, label: '' }] }, 130);
      const A = 0.04, B0 = 0.006, TCLEAR = 0.88, TDARK = 0.12;
      let x = params.x || 0, tm = 0, plotClock = 0;
      const hist = [[0, 100 * Math.pow(TCLEAR, 1 - x) * Math.pow(TDARK, x)]];
      const bOf = T => B0 * Math.exp(0.045 * (T - 23));
      const Tof = xx => Math.pow(TCLEAR, 1 - xx) * Math.pow(TDARK, xx);
      const catOf = T => T >= 0.8 ? 0 : T >= 0.43 ? 1 : T >= 0.18 ? 2 : T >= 0.08 ? 3 : 4;
      const CATS = [['0', '80–100 %'], ['1', '43–80 %'], ['2', '18–43 %'], ['3', '8–18 %'], ['4', '3–8 %']];
      const ctl = kit.controls(box.side, [
        { id: 'env', type: 'select', label: 'Where the wearer is', options: ENVS, value: params.env != null ? params.env : 1 },
        { id: 'temp', label: 'Temperature', min: 0, max: 40, step: 1, value: params.temp || 23, unit: '°C' },
        { id: 'speed', type: 'select', label: 'Time runs', options: [['at real speed', 1], ['5 times faster', 5], ['20 times faster', 20]], value: params.speed || 5 },
        { type: 'buttons', items: [{ id: 'out', label: 'Step outside into the sun', primary: true }, { id: 'in', label: 'Go indoors' }, { id: 'reset', label: 'Clear lens, start again' }] }
      ], id => {
        if (id === 'out') ctl.set('env', 1); else if (id === 'in') ctl.set('env', 0);
        else if (id === 'reset') { x = 0; tm = 0; hist.length = 0; hist.push([0, 100 * Tof(0)]); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dark', 'Darkening reached'], ['T', 'Light transmitted'], ['cat', 'Sunglass category (ISO 12312-1)'], ['tau1', 'Darkens with a time constant of'], ['tau2', 'Fades with a time constant of'], ['eq', 'Settles at, in this light and warmth']]);
      const fmtT = s => s >= 120 ? fx(s / 60, 1) + ' min' : fx(s, 0) + ' s';
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const u = V.env, b = bOf(V.temp), sim = dt * V.speed;
        for (let left = sim; left > 1e-9;) { const h = Math.min(0.25, left); x += h * (A * u * (1 - x) - b * x); left -= h; }
        x = clamp(x, 0, 1); tm += sim;
        if (sim > 0 && tm - hist[hist.length - 1][0] >= 1) hist.push([tm, 100 * Tof(x)]);
        while (hist.length > 2 && tm - hist[0][0] > 400) hist.shift();
        const T = Tof(x);
        // the view through the lens
        const ax = 10, ay = 12, aw = Math.round(W * 0.34), ah = Hh - 24;
        const g1 = c.createLinearGradient ? c.createLinearGradient(0, ay, 0, ay + ah * 0.62) : null;
        if (g1) { g1.addColorStop(0, '#5aa2e8'); g1.addColorStop(1, '#cfe6fa'); c.fillStyle = g1; } else c.fillStyle = '#8fc0ee';
        c.fillRect(ax, ay, aw, ah * 0.62);
        c.fillStyle = '#4d8f4a'; c.fillRect(ax, ay + ah * 0.62, aw, ah * 0.38);
        c.fillStyle = '#4b86c4'; c.fillRect(ax + aw * 0.1, ay + ah * 0.7, aw * 0.8, ah * 0.2);
        c.fillStyle = '#fff6c2'; c.beginPath(); c.arc(ax + aw * 0.76, ay + ah * 0.2, 14, 0, TAU); c.fill();
        c.fillStyle = 'rgba(0,0,0,' + clamp(1 - T, 0, 1) + ')'; c.fillRect(ax, ay, aw, ah);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(ax + 0.5, ay + 0.5, aw - 1, ah - 1);
        kit.label(c, 'the view through the lens', ax + aw / 2, ay + ah + 0, { size: 10.5, align: 'center', color: C.faint, baseline: 'bottom' });
        // the lens over white paper
        const bx = ax + aw + 12, bw = Math.round(W * 0.24);
        c.fillStyle = C.dark ? '#e9e9ee' : '#f5f5f8'; c.fillRect(bx, ay, bw, ah);
        c.fillStyle = 'rgba(0,0,0,' + clamp(1 - T, 0, 1) + ')'; c.beginPath(); c.ellipse(bx + bw / 2, ay + ah / 2 - 8, bw * 0.4, ah * 0.3, 0, 0, TAU); c.fill();
        c.strokeStyle = 'rgba(80,80,90,0.7)'; c.lineWidth = 1.4; c.beginPath(); c.ellipse(bx + bw / 2, ay + ah / 2 - 8, bw * 0.4, ah * 0.3, 0, 0, TAU); c.stroke();
        kit.label(c, 'the lens over white paper', bx + bw / 2, ay + ah, { size: 10.5, align: 'center', color: '#666', baseline: 'bottom' });
        // the ultraviolet reaching the lens, and the categories
        const tx = bx + bw + 16, tw = W - tx - 10, k = catOf(T);
        kit.label(c, 'ultraviolet reaching the lens', tx, ay + 8, { size: 10.5, color: C.muted });
        c.fillStyle = C.bg2; c.fillRect(tx, ay + 18, tw, 9); c.fillStyle = C.accent; c.fillRect(tx, ay + 18, tw * u, 9); c.strokeStyle = C.grid; c.strokeRect(tx + 0.5, ay + 18.5, tw - 1, 8);
        kit.label(c, 'sunglass category (transmittance)', tx, ay + 52, { size: 10.5, color: C.muted });
        CATS.forEach(([n, r], i) => {
          const yy = ay + 72 + i * 20, on = i === k;
          if (on) { c.fillStyle = S.glass(0.3); c.fillRect(tx - 4, yy - 9, tw + 4, 18); }
          kit.label(c, 'category ' + n, tx, yy, { size: 11, color: on ? C.text : C.muted, weight: on ? 700 : 500 });
          kit.label(c, r, tx + tw, yy, { size: 11, align: 'right', color: on ? C.text : C.muted, weight: on ? 700 : 500 });
        });
        // read-outs
        const xeq = A * u / (A * u + b);
        ro.set('dark', fx(100 * x, 0) + ' %');
        ro.set('T', fx(100 * T, 1) + ' %');
        ro.set('cat', 'category ' + k + (k === 4 ? ' (not for road use)' : ''));
        ro.set('tau1', u > 0 ? fmtT(1 / (A * u + b)) : 'it does not darken (no ultraviolet)');
        ro.set('tau2', fmtT(1 / b));
        ro.set('eq', fx(100 * Tof(xeq), 1) + ' % transmitted');
        plotClock += dt;
        if (dt === 0 || plotClock > 0.2) {
          plotClock = 0;
          const t0 = Math.max(0, tm - 400);
          plot.set({ series: [{ pts: hist.slice(), label: 'transmittance' }], x: { label: 'time (s)', name: 't', min: t0, max: Math.max(400, tm) } });
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ 11 · glare and the polarized lens */
  Hyper.sim('sp-glare', {
    title: 'Glare, polarization and the polarized lens',
    blurb: `Sunlight reflecting from a flat surface is partly polarized: the part that vibrates across the plane of the drawing (**s**, shown as a ringed dot) is reflected more strongly than the part that vibrates in it (**p**, shown as a double arrow), and at **Brewster's angle** the p part is not reflected at all. The surface is horizontal, so the glare is mostly horizontally polarized, and a lens whose polarizer passes only vertical vibrations blocks much of it. The right-hand panels show an underwater scene under the veil of reflected light, without and with the lens (the veil strength is illustrative). In the graph, both lenses pass 40 % of ordinary unpolarized light, so any difference is the polarizer's.

**Try this**
- Start at **53°** on water, the Brewster angle: the reflected light is entirely s-polarized, and the polarized lens removes almost all the glare while the grey lens only removes 60 % of it.
- Slide to **10°** (looking almost straight down): little of the reflection is polarized, so the polarized lens does no better than the grey one.
- Go to **80°**, a low sun on a lake: the glare is strong and only partly polarized; the polarized lens still helps, but much glare remains.
- Tilt the **head** to 45°: the polarizer passes the same share as the grey tint. At 90° it passes the horizontal glare freely.
- Switch to **glass**: the Brewster angle is 56.7°.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, P = O.pol;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const plot = kit.plot(box.stage, { x: { label: 'angle of incidence (°)', name: 'θ', min: 0, max: 88 }, y: { label: 'glare (%)', name: 'g', min: 0, max: 30 }, series: [] }, 125);
      const ctl = kit.controls(box.side, [
        { id: 'angle', label: 'Angle of incidence, from the normal', min: 0, max: 88, step: 1, value: params.angle != null ? params.angle : 53, unit: '°' },
        { id: 'n', type: 'select', label: 'The reflecting surface', options: [['Water', 1.333], ['Glass, or a car windscreen', 1.52]], value: params.n || 1.333 },
        { id: 'lens', type: 'select', label: 'Lens worn', options: [['No lens', 'none'], ['Grey tint, no polarizer', 'grey'], ['Polarized', 'pol']], value: params.lens || 'pol' },
        { id: 'tilt', label: 'Tilt of the head (turns the polarizer)', min: 0, max: 90, step: 1, value: params.tilt || 0, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['brew', 'Brewster\'s angle'], ['R', 'Reflected by the surface'], ['pol', 'Share of it that is s-polarized (horizontal)'], ['g', 'Glare reaching the eye, this lens'], ['rel', 'Compared with no lens']]);
      const TAX = 0.8, TGREY = 0.4;                       // both lenses pass 40 % of unpolarized light
      const glare = (n, th, lens, tilt) => {
        const f = O.fresnel(1, n, th);
        if (lens === 'none') return f.R;
        if (lens === 'grey') return TGREY * f.R;
        const ph = tilt * D2R;
        return TAX * (f.Rp * Math.pow(Math.cos(ph), 2) + f.Rs * Math.pow(Math.sin(ph), 2)) / 2;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, n = V.n, th = V.angle * D2R;
        const f = O.fresnel(1, n, th), sw = Math.round(W * 0.62), ys = Hh * 0.74, xp = sw * 0.42;
        // the surface
        c.fillStyle = C.dark ? 'rgba(80,150,230,0.14)' : 'rgba(80,150,230,0.16)'; c.fillRect(0, ys, sw, Hh - ys);
        strokeLine(c, [[0, ys], [sw, ys]], C.text, 1.6);
        S.normal(c, xp, ys, PI / 2, Math.min(90, Hh * 0.3));
        const L = Math.min(0.46 * sw / Math.max(Math.sin(th), 0.2), 0.66 * ys / Math.max(Math.cos(th), 0.2), 260);
        const sunX = xp - L * Math.sin(th), sunY = ys - L * Math.cos(th), eyeX = xp + L * Math.sin(th), eyeY = ys - L * Math.cos(th);
        S.source(c, sunX, sunY, { kind: 'sun', size: 12 });
        S.ray(c, [[sunX + 12 * Math.sin(th), sunY + 12 * Math.cos(th)], [xp, ys]], { color: C.warn, width: 2.2, arrows: true, minArrow: 40 });
        const rw = 1 + 4 * Math.sqrt(f.R);
        S.ray(c, [[xp, ys], [eyeX, eyeY]], { color: C.warn, width: rw, arrows: true, minArrow: 40 });
        S.angle(c, xp, ys, 30, -PI / 2, -PI / 2 - th, '', {});
        S.angle(c, xp, ys, 30, -PI / 2, -PI / 2 + th, '', {});
        if (V.angle > 6) kit.label(c, 'θ', xp - 38 * Math.sin(th / 2) - 5, ys - 38 * Math.cos(th / 2), { size: 11, color: C.muted });
        // the polarization of the reflected light along the ray: a ringed dot for s, a double arrow for p
        const rs = 3 + 11 * Math.sqrt(f.Rs), rp = 2 + 11 * Math.sqrt(f.Rp);
        for (const t of [0.32, 0.55, 0.78]) {
          const gx = xp + (eyeX - xp) * t, gy = ys + (eyeY - ys) * t, nx = Math.cos(th), ny = Math.sin(th);      // ny, nx: the direction across the ray, in the plane of the page
          const ox = 7 * Math.sin(th), oy = -7 * Math.cos(th);                                                   // a step along the ray
          c.save(); c.strokeStyle = C.accent; c.fillStyle = C.accent; c.lineWidth = 1.6; c.beginPath(); c.arc(gx - ox, gy - oy, rs, 0, TAU); c.stroke(); c.beginPath(); c.arc(gx - ox, gy - oy, 1.8, 0, TAU); c.fill(); c.restore();
          strokeLine(c, [[gx + ox - nx * rp, gy + oy - ny * rp], [gx + ox + nx * rp, gy + oy + ny * rp]], C.bad, 1.8);
        }
        kit.label(c, 's: across the page  (ringed dot)', 10, 16, { size: 10.5, color: C.accent });
        kit.label(c, 'p: in the page  (double arrow)', 10, 32, { size: 10.5, color: C.bad });
        S.eye(c, eyeX + 12, eyeY, 10, { dir: -1 });
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1.4; c.beginPath(); c.arc(eyeX - 6, eyeY, 12, 0, TAU); c.stroke(); c.restore();
        kit.label(c, 'sun', sunX, sunY - 22, { size: 10.5, align: 'center', color: C.muted });
        kit.label(c, V.n > 1.4 ? 'glass' : 'water', 10, Hh - 10, { size: 10.5, color: C.muted });
        // the two views: an underwater scene under a veil of reflected light
        const px0 = sw + 14, pw = (W - px0 - 18) / 2, py0 = 26, ph = Hh * 0.46;
        const views = [['no lens', glare(n, th, 'none', 0)], [V.lens === 'none' ? 'no lens' : V.lens === 'grey' ? 'grey tint' : 'polarized', glare(n, th, V.lens, V.tilt)]];
        views.forEach(([name, g], i) => {
          const vx = px0 + i * (pw + 8);
          c.fillStyle = '#17465c'; c.fillRect(vx, py0, pw, ph);
          c.fillStyle = '#3b8a7c'; c.beginPath(); c.ellipse(vx + pw * 0.5, py0 + ph * 0.55, pw * 0.26, ph * 0.13, 0, 0, TAU); c.fill();
          c.beginPath(); c.moveTo(vx + pw * 0.74, py0 + ph * 0.55); c.lineTo(vx + pw * 0.92, py0 + ph * 0.4); c.lineTo(vx + pw * 0.92, py0 + ph * 0.7); c.closePath(); c.fill();
          c.fillStyle = 'rgba(255,255,255,' + clamp(g / 0.1, 0, 0.96) + ')'; c.fillRect(vx, py0, pw, ph);
          c.strokeStyle = C.grid; c.strokeRect(vx + 0.5, py0 + 0.5, pw - 1, ph - 1);
          kit.label(c, name, vx + pw / 2, py0 - 9, { size: 10.5, align: 'center', color: C.muted });
        });
        // the wearer's polarizer: the axis, vertical for an upright head
        const ix = px0 + pw * 0.5, iy = py0 + ph + 46, ir = 22, ph2 = V.tilt * D2R;
        c.save(); c.strokeStyle = S.edge(); c.lineWidth = 1.5; c.fillStyle = S.glass(0.2); c.beginPath(); c.arc(ix, iy, ir, 0, TAU); c.fill(); c.stroke();
        c.strokeStyle = V.lens === 'pol' ? C.text : C.faint; c.lineWidth = 2.2; c.beginPath(); c.moveTo(ix - Math.sin(ph2) * (ir - 3), iy - Math.cos(ph2) * (ir - 3)); c.lineTo(ix + Math.sin(ph2) * (ir - 3), iy + Math.cos(ph2) * (ir - 3)); c.stroke(); c.restore();
        kit.label(c, V.lens === 'pol' ? 'the polarizer passes vibrations along this line' : 'a grey tint has no axis', ix + ir + 10, iy, { size: 10.5, color: C.muted });
        // read-outs and the graph
        const g = glare(n, th, V.lens, V.tilt), g0 = glare(n, th, 'none', 0);
        ro.set('brew', fx(O.brewster(1, n) * R2D, 1) + '°');
        ro.set('R', fx(100 * f.R, 1) + ' % of the sunlight');
        ro.set('pol', fx(100 * (f.Rs / (f.Rs + f.Rp || 1)), 0) + ' %  (degree of polarization ' + fx(100 * P.byReflection(1, n, th), 0) + ' %)');
        ro.set('g', fx(100 * g, 2) + ' % of the sunlight');
        ro.set('rel', V.lens === 'none' ? 'the unaided glare' : fx(100 * g / (g0 || 1), 0) + ' % of the unaided glare');
        const p0 = [], p1 = [], p2 = []; for (let a = 0; a <= 88; a += 2) { p0.push([a, Math.min(30, 100 * glare(n, a * D2R, 'none', 0))]); p1.push([a, Math.min(30, 100 * glare(n, a * D2R, 'grey', 0))]); p2.push([a, Math.min(30, 100 * glare(n, a * D2R, 'pol', V.tilt))]); }
        plot.set({ series: [{ pts: p0, label: 'no lens' }, { pts: p1, label: 'grey tint', dash: true }, { pts: p2, label: 'polarized' }], marks: [{ x: V.angle, y: Math.min(30, 100 * g), label: '' }], vlines: [{ x: O.brewster(1, n) * R2D, label: 'Brewster' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 12 · the tear lens of a rigid contact lens */
  Hyper.sim('sp-contact', {
    title: 'A rigid contact lens and its tear lens',
    blurb: `A section through the front of the eye, to scale: the cornea (the dome, radius shown below), a rigid gas-permeable contact lens resting on it, and between them a film of tears. The film is only some tens of micrometres thick, so the graph shows its thickness on its own scale. Its shape is that of a lens, thicker or thinner in the middle than at the edge of the optic zone, and with the index of tears (1.336) it has a power of its own: the **tear lens**. The power ordered for the contact lens in air must allow for it. The picture is a model of the optics, not a fitting guide: real lenses have edge curves, and the fit of a lens is judged by a practitioner.

**Try this**
- Set the lens back radius equal to the cornea's, 7.80 mm and 7.80: the film has the same shape as the gap, the tear lens has no power, and the ordered power is the one the eye needs.
- Make the lens **0.10 mm steeper** (7.70): the film is thicker in the middle than at the edge, a plus tear lens of about +0.56 D, so the lens in air must be that much more minus. Make it flatter and the tear lens turns minus.
- A rule of thumb to check: each 0.05 mm of radius is about 0.25 D of tear lens.
- Raise the **apical clearance**: the tear film grows thicker everywhere, but its power does not change; power comes from the difference between the two curves, not from the thickness.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 230 });
      const plot = kit.plot(box.stage, { x: { label: 'distance from centre (mm)', name: 'r', min: 0, max: 3.5 }, y: { label: 'tear (µm)', name: 'g' }, series: [] }, 115);
      const NT = 1.336, NCL = 1.45;
      const ctl = kit.controls(box.side, [
        { id: 'Rc', label: 'Radius of the cornea (flattest central curve)', min: 7.0, max: 8.6, step: 0.05, value: params.Rc || 7.8, fmt: v => fx(v, 2) + ' mm · ' + fx(337.5 / v, 2) + ' D' },
        { id: 'Rb', label: 'Back radius of the rigid lens (base curve)', min: 7.0, max: 8.6, step: 0.05, value: params.Rb || 7.7, fmt: v => fx(v, 2) + ' mm' },
        { id: 'P', label: 'Power the eye needs at the cornea', min: -10, max: 6, step: 0.25, value: params.P != null ? params.P : -3, fmt: v => dpt(v) },
        { id: 'g0', label: 'Tear film at the centre (apical clearance)', min: 0, max: 60, step: 5, value: params.g0 != null ? params.g0 : 15, unit: 'µm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rel', 'The lens back curve is'], ['Ft', 'Power of the tear lens'], ['Fcl', 'Power of the lens in air'], ['g', 'Tear film, centre and at 3.5 mm'], ['rule', 'Check: 0.05 mm of radius']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const Rc = V.Rc, Rb = V.Rb, g0 = V.g0 / 1000;
        const Ft = 1000 * (NT - 1) * (1 / Rb - 1 / Rc), Fcl = V.P - Ft;
        // the lens: back radius Rb, centre thickness 0.15 mm, and a front radius that gives its power in air
        const Fback = -1000 * (NCL - 1) / Rb, F1 = Fcl - Fback, R1 = Math.abs(F1) < 0.5 ? 1e4 : 1000 * (NCL - 1) / F1;
        const half = 6.2, s = Math.min((W - 40) / (2 * half), 60), x0 = W / 2, y0 = 38;
        const X = y => x0 + y * s, Z = z => y0 + z * s;
        // the cornea
        const cor = []; for (let y = -half; y <= half + 1e-9; y += 0.4) cor.push([X(y), Z(sag(Rc, y))]);
        fillPoly(c, cor.concat([[X(half), Z(sag(Rc, half)) + 70], [X(-half), Z(sag(Rc, half)) + 70]]), C.dark ? 'rgba(235,238,250,0.07)' : 'rgba(40,60,120,0.06)');
        strokeLine(c, cor, C.muted, 2);
        // the lens (diameter 9.4 mm), resting 'g0' in front of the cornea apex, and the tear film between
        const rl = 4.7, tc = 0.15, back = [], front = [];
        for (let y = -rl; y <= rl + 1e-9; y += 0.2) { back.push([X(y), Z(-g0 + sag(Rb, y))]); front.push([X(y), Z(-g0 - tc + sag(R1, y))]); }
        fillPoly(c, front.concat(back.slice().reverse()), S.glass(0.34)); strokeLine(c, front.concat(back.slice().reverse()), S.edge(), 1.4, null, true);
        const tear = []; for (let y = -3.5; y <= 3.5 + 1e-9; y += 0.25) tear.push([X(y), Z(sag(Rc, y))]);
        for (let y = 3.5; y >= -3.5 - 1e-9; y -= 0.25) tear.push([X(y), Z(-g0 + sag(Rb, y))]);
        fillPoly(c, tear, 'rgba(60,160,255,0.55)');
        kit.label(c, 'cornea', X(-half) + 6, Z(sag(Rc, half)) - 4, { size: 11, color: C.muted });
        kit.label(c, 'rigid lens, 9.4 mm across', X(rl) + 8, Z(-g0 - tc + sag(R1, rl)) - 8, { size: 11, color: C.text });
        kit.label(c, 'tear film (a few µm thick, drawn at least a pixel wide)', X(0), y0 - 24, { size: 10.5, align: 'center', color: '#3a9bff' });
        S.dim(c, X(-half), y0 - 10, X(half), y0 - 10, '12.4 mm', { off: -9, size: 10.5 });
        kit.label(c, 'to scale; the light comes from above', 10, Hh - 10, { size: 10.5, color: C.faint });
        // read-outs
        const d = Rb - Rc;
        ro.set('rel', Math.abs(d) < 0.025 ? 'matched to the cornea (' + fx(d, 2) + ' mm)' : (d < 0 ? 'steeper than the cornea by ' : 'flatter than the cornea by ') + fx(Math.abs(d), 2) + ' mm');
        ro.set('Ft', dpt(Ft) + (Ft > 0.05 ? ' (plus: the film is thicker at the centre)' : Ft < -0.05 ? ' (minus: the film is thinner at the centre)' : ''));
        ro.set('Fcl', dpt(Fcl) + ' = ' + dpt(V.P) + ' − (' + dpt(Ft) + ')');
        const gAt = r => g0 * 1000 + 1000 * (sag(Rc, r) - sag(Rb, r));
        ro.set('g', fx(V.g0, 0) + ' µm and ' + fx(gAt(3.5), 0) + ' µm' + (gAt(3.5) < 0 ? ' (the curves would touch)' : ''));
        ro.set('rule', fx(1000 * (NT - 1) * (1 / (Rc - 0.05) - 1 / Rc), 2) + ' D at this radius');
        const pts = []; for (let r = 0; r <= 3.5001; r += 0.1) pts.push([r, Math.max(0, gAt(r))]);
        plot.set({ series: [{ pts, label: 'tear film' }], y: { label: 'tear (µm)', name: 'g', min: 0, max: Math.max(30, Math.ceil(Math.max.apply(null, pts.map(p => p[1])) / 10) * 10 + 10) } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ 13 · intraocular lens power */
  Hyper.sim('sp-iol', {
    title: 'An intraocular lens: its power from the length of the eye',
    blurb: `The eye in section with a lens implant at the place of the natural lens. The cornea has a power (from the keratometer), the eye a length (from an ultrasound or optical measurement), and the implant sits at an effective position behind the cornea. The calculation is the one the surgeon's biometry does, in its simplest form: the vergence of the light must reach the retina after the cornea and the implant. Real calculators (the Haigis, SRK/T, Hoffer Q and Barrett formulas and others) refine the implant position and the corneal power; this one shows why each measured number matters. The picture is schematic; nothing here is advice about any eye.

**Try this**
- With the defaults (23.5 mm, 43.5 D, position 5.25 mm, target 0) the power is about 20.7 D; the nearest lens in 0.5 D steps leaves a small residual error.
- Make the eye **1 mm longer**: the implant needed falls by about 3.8 D in this model, which holds the implant position fixed. Real formulas let that position change with the length of the eye and give a somewhat smaller figure. A short eye needs a stronger implant.
- The three sensitivity rows give the error that would follow from a measurement being out: 0.5 mm in length is worth over a dioptre; the same in the position of the lens, about half as much.
- Aim for **−1 D**: the lens is stronger by about 1.4 D, and the eye then sees an object at 1 m sharply while distant objects are blurred.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 270 });
      const NV = 1.336;
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Axial length of the eye', min: 20, max: 30, step: 0.05, value: params.L || 23.5, unit: 'mm' },
        { id: 'K', label: 'Power of the cornea (keratometry)', min: 38, max: 48, step: 0.25, value: params.K || 43.5, fmt: v => fx(v, 2) + ' D' },
        { id: 'E', label: 'Position of the implant behind the cornea', min: 4, max: 6.5, step: 0.05, value: params.E || 5.25, unit: 'mm' },
        { id: 'R', label: 'Aimed-at refraction of the eye', min: -3, max: 1, step: 0.25, value: params.R != null ? params.R : 0, fmt: v => Math.abs(v) < 0.01 ? 'distance in focus' : dpt(v) }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['P', 'Power calculated'], ['Pn', 'Nearest in 0.5 D steps'], ['Re', 'Refraction with that lens'], ['dL', 'Result moves by, if the eye is 0.5 mm longer than measured'], ['dE', 'Result moves by, if the lens sits 0.5 mm farther back'], ['dK', 'Result moves by, if the cornea is 1 D steeper'], ['foc', 'Distant objects focus']]);
      // the vergence calculation: P = n/(L − E) − n/(n/(K + R) − E), the lengths in metres
      const pw = (L, K, E, R) => { const V1 = K + R; return 1000 * NV / (L - E) - NV / (NV / V1 - E / 1000); };
      // the refraction that a lens of power P leaves in an eye (bisection on the aimed-at vergence)
      const refr = (L, K, E, P) => { let lo = -15, hi = 15; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (pw(L, K, E, mid) > P) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const P = pw(V.L, V.K, V.E, V.R), Pn = Math.round(P * 2) / 2, Re = refr(V.L, V.K, V.E, Pn);
        const m = S.map(st, -5, V.L + 7, 14, { left: 12, right: 12, top: 8, bottom: 26 }), s = m.s;
        S.axis(c, m.X(-5), m.Y(0), m.X(V.L + 7));
        const zj = sag(7.8, 5.5), a = (V.L - zj) / 1.866, zc = V.L - a, b = 11, ph0 = 5 * PI / 6, ell = [];
        for (let k = 0; k <= 40; k++) { const ph = ph0 - 2 * ph0 * k / 40; ell.push([m.X(zc + a * Math.cos(ph)), m.Y(b * Math.sin(ph))]); }
        const cor = []; for (let y = -5.5; y <= 5.5001; y += 0.5) cor.push([m.X(sag(7.8, y)), m.Y(y)]);
        fillPoly(c, ell.concat(cor.slice().reverse()), C.dark ? 'rgba(235,238,250,0.06)' : 'rgba(40,60,120,0.05)');
        strokeLine(c, ell, C.muted, 1.8); strokeLine(c, cor, S.edge(), 2.4);
        const ret = []; for (let k = 0; k <= 16; k++) { const p = -0.9 + 1.8 * k / 16; ret.push([m.X(zc + a * Math.cos(p)), m.Y(b * Math.sin(p))]); }
        strokeLine(c, ret, C.bad, 3.2);
        // the implant, a biconvex lens drawn at its position, 6 mm across
        S.lens(c, m.X(V.E) - 3, m.Y(0), 3 * s, { f: Pn > 0 ? 1 : -1, bulge: 1.8, fill: S.glass(0.5), t: 6 });
        for (const sg of [1, -1]) strokeLine(c, [[m.X(2.6), m.Y(sg * 2.3)], [m.X(2.6), m.Y(sg * 5.2)]], C.accent, 3.2);
        // the rays: parallel light, the cornea (power K), the implant (power Pn), the retina
        let zf = Infinity;
        for (const h of [-2.1, -1.4, -0.7, 0, 0.7, 1.4, 2.1]) {
          const w1 = -h * V.K / 1000, h2 = h + V.E * w1 / NV, w2 = w1 - h2 * Pn / 1000, u2 = w2 / NV, h3 = h2 + (V.L - V.E) * u2;
          S.ray(c, [[m.X(-5), m.Y(h)], [m.X(0), m.Y(h)], [m.X(V.E), m.Y(h2)], [m.X(V.L), m.Y(h3)]], { nm: 587.56, width: 1.3, arrows: false });
          if (h === 0.7 && Math.abs(u2) > 1e-9) zf = V.E + h2 / -u2;
        }
        if (Number.isFinite(zf) && Math.abs(zf - V.L) > 0.05 && zf < V.L + 7 && zf > 0) kit.dot(c, m.X(zf), m.Y(0), 4, C.text, C.bg2);
        else if (Number.isFinite(zf) && Math.abs(zf - V.L) <= 0.05) kit.dot(c, m.X(V.L), m.Y(0), 4.5, C.ok, C.bg2);
        kit.label(c, 'cornea', m.X(0), m.Y(-12.4), { size: 10.5, align: 'center', color: C.muted });
        kit.label(c, 'implant', m.X(V.E), m.Y(5), { size: 10.5, align: 'center', color: C.text });
        kit.label(c, 'retina', m.X(V.L) + 5, m.Y(7), { size: 10.5, color: C.bad });
        S.dim(c, m.X(0), m.Y(-13.4), m.X(V.L), m.Y(-13.4), 'axial length ' + fx(V.L, 2) + ' mm', { off: 9, size: 10.5 });
        kit.label(c, 'schematic eye: the rays are traced with the thin-lens vergence formulas', 10, Hh - 8, { size: 10, color: C.faint });
        // read-outs
        ro.set('P', fx(P, 2) + ' D');
        ro.set('Pn', fx(Pn, 1) + ' D');
        ro.set('Re', Math.abs(Re - V.R) < 0.13 ? dpt(Re) + ' (as aimed)' : dpt(Re) + ' (aimed ' + dpt(V.R) + ')');
        ro.set('dL', dpt(refr(V.L + 0.5, V.K, V.E, Pn) - Re, 2));
        ro.set('dE', dpt(refr(V.L, V.K, V.E + 0.5, Pn) - Re, 2));
        ro.set('dK', dpt(refr(V.L, V.K + 1, V.E, Pn) - Re, 2));
        ro.set('foc', Math.abs(zf - V.L) < 0.04 ? 'on the retina' : !Number.isFinite(zf) ? 'nowhere' : fx(Math.abs(zf - V.L), 2) + ' mm ' + (zf < V.L ? 'in front of' : 'behind') + ' the retina');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 14 · laser reshaping of the cornea */
  Hyper.sim('sp-laser', {
    title: 'Reshaping the cornea: the tissue taken from an optical zone',
    blurb: `The cornea drawn flattened out, as in a cross-section diagram, with its thickness drawn several times larger than its width so that the shapes can be seen. To make a short-sighted cornea less curved, a lens-shaped layer of tissue is removed from the front, deepest at the centre and nothing at the edge of the **optical zone**. Munnerlyn's relation gives the depth at the centre: *t* = *S*² × *D* / 3, with *t* in micrometres, the zone diameter *S* in millimetres and the correction *D* in dioptres. The graph shows how it grows with the correction for four zone sizes. This page explains the geometry; whether any procedure suits a person, and the planning of it, is decided by a surgeon from detailed measurements of the cornea.

**Try this**
- With the defaults, **3 D** over a **6 mm** zone: 36 µm, 12 µm for each dioptre.
- Widen the zone to **8 mm** at the same correction: the depth rises to 64 µm, because it grows as the *square* of the zone width.
- Raise the correction to **6 D** over 6 mm: 72 µm, about 13 % of a typical central thickness of 540 µm. Notice that the front radius of the cornea lengthens by only about a millimetre, from 7.8 to 8.9 mm.
- The graph is a straight line for each zone, steeper for wider zones: tissue removed is proportional to the correction.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 260 });
      const plot = kit.plot(box.stage, { x: { label: 'correction (D)', name: 'D', min: 1, max: 10 }, y: { label: 'depth (µm)', name: 't', min: 0 }, series: [] }, 120);
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Correction of short sight', min: 1, max: 10, step: 0.25, value: params.D || 3, fmt: v => fx(v, 2) + ' D' },
        { id: 'Sz', label: 'Optical zone, diameter', min: 5, max: 8, step: 0.25, value: params.S || 6, unit: 'mm' },
        { id: 'T0', label: 'Central thickness of the cornea', min: 480, max: 620, step: 5, value: params.T0 || 540, unit: 'µm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t0', 'Depth at the centre'], ['perD', 'For each dioptre, over this zone'], ['share', 'Share of the central thickness'], ['R', 'Front radius, before and after'], ['wide', 'Depth if the zone were 1 mm wider']]);
      const NC = 1.376, R0 = 7.8;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const t0 = V.Sz * V.Sz * V.D / 3, half = 7, s = (W - 60) / (2 * half), kv = Math.min(0.26, (Hh - 120) / 640), x0 = W / 2, y0 = 56;
        const X = y => x0 + y * s, Y = t => y0 + t * kv;
        // the slab of cornea, flattened: the surface before the treatment is the top line
        fillPoly(c, [[X(-half), Y(0)], [X(half), Y(0)], [X(half), Y(V.T0)], [X(-half), Y(V.T0)]], C.dark ? 'rgba(235,238,250,0.1)' : 'rgba(40,60,120,0.09)');
        const prof = []; for (let k = 0; k <= 40; k++) { const r = -V.Sz / 2 + V.Sz * k / 40; prof.push([X(r), Y(V.D * (V.Sz * V.Sz - 4 * r * r) / 3)]); }
        fillPoly(c, [[X(-V.Sz / 2), Y(0)]].concat(prof, [[X(V.Sz / 2), Y(0)]]), 'rgba(224,160,48,0.5)');
        strokeLine(c, [[X(-half), Y(0)], [X(-V.Sz / 2), Y(0)]].concat(prof, [[X(V.Sz / 2), Y(0)], [X(half), Y(0)]]), C.text, 1.8);
        strokeLine(c, [[X(-half), Y(V.T0)], [X(half), Y(V.T0)]], C.muted, 1.4);
        strokeLine(c, [[X(-half), Y(0)], [X(-half), Y(V.T0)]], C.faint, 1); strokeLine(c, [[X(half), Y(0)], [X(half), Y(V.T0)]], C.faint, 1);
        S.dim(c, X(-V.Sz / 2), Y(0) - 12, X(V.Sz / 2), Y(0) - 12, 'optical zone ' + fx(V.Sz, 2) + ' mm', { off: -9, size: 10.5 });
        S.dim(c, X(0) + 22, Y(0), X(0) + 22, Y(t0), fx(t0, 0) + ' µm', { off: -6, size: 10.5 });
        S.dim(c, X(half) + 0, Y(0), X(half) + 0, Y(V.T0), '', {});
        kit.label(c, 'central thickness ' + fx(V.T0, 0) + ' µm', X(half) - 8, Y(V.T0 / 2), { size: 10.5, align: 'right', color: C.muted });
        kit.label(c, 'tissue removed', X(0), Y(t0) + 14, { size: 10.5, align: 'center', color: C.warn, weight: 650 });
        strokeLine(c, [[14, Hh - 22], [14, Hh - 22 - 100 * kv]], C.muted, 2); kit.label(c, '100 µm', 20, Hh - 22 - 50 * kv, { size: 10.5, color: C.muted });
        kit.label(c, 'thickness drawn ' + fx(kv * 1000 / s, 1) + ' times larger than width', W - 10, Hh - 10, { size: 10.5, color: C.faint, align: 'right' });
        // read-outs
        const P0 = (NC - 1) * 1000 / R0, R1 = (NC - 1) * 1000 / (P0 - V.D);
        ro.set('t0', fx(t0, 1) + ' µm');
        ro.set('perD', fx(V.Sz * V.Sz / 3, 1) + ' µm');
        ro.set('share', fx(100 * t0 / V.T0, 0) + ' % of ' + fx(V.T0, 0) + ' µm');
        ro.set('R', fx(R0, 2) + ' mm → ' + fx(R1, 2) + ' mm (the front is flatter)');
        ro.set('wide', fx((V.Sz + 1) * (V.Sz + 1) * V.D / 3, 1) + ' µm: ' + fx(100 * ((V.Sz + 1) * (V.Sz + 1) / (V.Sz * V.Sz) - 1), 0) + ' % more');
        const series = [5, 6, 7, 8].map(z => { const pts = []; for (let d = 1; d <= 10; d += 1) pts.push([d, z * z * d / 3]); return { pts, label: z + ' mm', dash: z !== Math.round(V.Sz) }; });
        plot.set({ series, marks: [{ x: V.D, y: t0, label: fx(t0, 0) + ' µm' }], y: { label: 'depth (µm)', name: 't', min: 0, max: 220 } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ 15 · the lensmeter */
  Hyper.sim('sp-lensmeter', {
    title: 'The lensmeter: dial, wheel and reticle',
    blurb: `A lensmeter looks at a lit target through the lens under test, with a drum that adds a known power. The target here is two sets of three lines, **A** and **B**, at right angles to each other, which the **wheel** turns together. A set of lines is sharp when the dial reading equals the power of the lens *across* those lines; for a sphere both sets come sharp at one reading, for a cylinder at two. The graph shows the sharpness of each set against the dial. The circles of the reticle are 1 prism dioptre apart, and a prism moves the target away from the centre in the direction of its base.

**Try this**
- Keep the lens **−2.00 −1.50 × 030**. Press *Turn the wheel to the axis*, then *Focus lines B*: the dial reads −2.00 D, the sphere (the power along the axis). Press *Focus lines A*: the dial reads −3.50 D, the sphere plus the cylinder. The difference is the cylinder, and the wheel reading is the axis.
- Turn the wheel away from the axis: the two readings move together until, 45° away, they are the same, and the lines look alike.
- Set the cylinder to zero: both sets are sharp at the same dial reading at any wheel angle, and the wheel is meaningless.
- Add **2 Δ of prism**, base up, and see the target move two circles from the centre. The distance gives the strength, the direction gives the base.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const plot = kit.plot(box.stage, { x: { label: 'dial (D)', name: 'D', min: -14, max: 10 }, y: { label: 'sharpness', name: 's', min: 0, max: 1 }, series: [] }, 115);
      const ctl = kit.controls(box.side, [
        { id: 'sph', label: 'The lens under test: sphere', min: -10, max: 8, step: 0.25, value: params.sph != null ? params.sph : -2, fmt: v => dpt(v) },
        { id: 'cyl', label: 'cylinder (minus form)', min: -4, max: 0, step: 0.25, value: params.cyl != null ? params.cyl : -1.5, fmt: v => dpt(v) },
        { id: 'axis', label: 'axis', min: 5, max: 180, step: 5, value: params.axis || 30, fmt: v => v + '°' },
        { id: 'prism', label: 'prism at the point measured', min: 0, max: 4, step: 0.25, value: params.prism || 0, fmt: v => v < 0.01 ? 'none' : fx(v, 2) + ' Δ' },
        { id: 'base', type: 'select', label: 'base of the prism', options: [['up', 'up'], ['down', 'down'], ['to the right', 'right'], ['to the left', 'left']], value: params.base || 'up' },
        { id: 'dial', label: 'Dial of the instrument', min: -14, max: 10, step: 0.25, value: params.dial != null ? params.dial : 0, fmt: v => dpt(v) },
        { id: 'wheel', label: 'Axis wheel of the instrument', min: 0, max: 180, step: 5, value: params.wheel != null ? params.wheel : 0, fmt: v => v + '°' },
        { type: 'buttons', items: [{ id: 'wa', label: 'Turn the wheel to the axis', primary: true }, { id: 'fa', label: 'Focus lines A' }, { id: 'fb', label: 'Focus lines B' }] }
      ], id => {
        if (id === 'wa') ctl.set('wheel', V.axis % 180);
        else if (id === 'fa') ctl.set('dial', clamp(Math.round(PA() * 4) / 4, -14, 10));
        else if (id === 'fb') ctl.set('dial', clamp(Math.round(PB() * 4) / 4, -14, 10));
        loop.once();
      });
      const V = ctl.values;
      const rx = () => ({ sph: V.sph, cyl: V.cyl, axis: V.axis });
      const PA = () => E.meridian(rx(), V.wheel + 90), PB = () => E.meridian(rx(), V.wheel);          // the power across lines A, across lines B
      const ro = kit.readout(box.side, [['pa', 'Lines A are sharpest at the dial reading'], ['pb', 'Lines B are sharpest at the dial reading'], ['gap', 'Difference of the two readings'], ['hint', 'The wheel is'], ['pri', 'Prism read from the reticle']]);
      const sharp = (d, P) => 1 / (1 + Math.pow((d - P) / 0.3, 2));
      const drawLines = (c, cx, cy, ang, blur, color, R) => {
        const dx = Math.cos(ang), dy = -Math.sin(ang), nx = dy * -1, ny = dx;                         // along the lines, across them
        const n = blur < 0.6 ? 1 : 9, a = blur < 0.6 ? 1 : clamp(0.9 * 2.6 / (2.6 + 2 * blur) + 0.04, 0.06, 1);
        c.save(); c.lineCap = 'butt'; c.strokeStyle = color; c.lineWidth = 2.6; c.globalAlpha = a;
        for (const o of [-1, 0, 1]) for (let k = 0; k < n; k++) {
          const e = n === 1 ? 0 : blur * (2 * k / (n - 1) - 1), off = o * 14 + e;
          c.beginPath(); c.moveTo(cx + nx * off - dx * R * 0.88, cy + ny * off - dy * R * 0.88); c.lineTo(cx + nx * off + dx * R * 0.88, cy + ny * off + dy * R * 0.88); c.stroke();
        }
        c.restore();
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const R = Math.min(W * 0.34, Hh / 2 - 22), cx = W * 0.3, cy = Hh / 2, step = R / 5.5, phi = V.wheel * D2R;
        const pa = PA(), pb = PB(), blurA = Math.min(14, Math.abs(V.dial - pa) * 8), blurB = Math.min(14, Math.abs(V.dial - pb) * 8);
        c.fillStyle = C.dark ? '#050710' : '#14172a'; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill();
        // the target, displaced by the prism toward its base
        const dir = { up: [0, -1], down: [0, 1], right: [1, 0], left: [-1, 0] }[V.base] || [0, -1], off = V.prism * step;
        c.save(); c.beginPath(); c.arc(cx, cy, R - 1, 0, TAU); c.clip();
        drawLines(c, cx + dir[0] * off, cy + dir[1] * off, phi, blurA, '#ffd86b', R);
        drawLines(c, cx + dir[0] * off, cy + dir[1] * off, phi + PI / 2, blurB, '#7be3ff', R);
        c.restore();
        // the reticle: circles 1 Δ apart and a cross
        c.save(); c.strokeStyle = 'rgba(190,200,230,0.55)'; c.lineWidth = 1;
        for (let i = 1; i <= 5; i++) { c.beginPath(); c.arc(cx, cy, i * step, 0, TAU); c.stroke(); }
        c.beginPath(); c.moveTo(cx - R, cy); c.lineTo(cx + R, cy); c.moveTo(cx, cy - R); c.lineTo(cx, cy + R); c.stroke(); c.restore();
        for (let i = 1; i <= 5; i++) kit.label(c, i + 'Δ', cx + i * step + 3, cy + 9, { size: 9.5, color: 'rgba(190,200,230,0.8)' });
        c.strokeStyle = S.edge(); c.lineWidth = 1.6; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
        kit.label(c, 'lines A', cx, cy + R + 14, { size: 10.5, align: 'center', color: '#c99a1a', weight: 650 });
        kit.label(c, 'lines B', cx + R * 0.9, cy - R - 2, { size: 10.5, align: 'center', color: '#2a9cc2', weight: 650 });
        // the dial and the wheel
        const px = W * 0.6, pw = W - px - 14;
        kit.label(c, 'dial', px, 30, { size: 11, color: C.muted });
        kit.label(c, dpt(V.dial), px + 44, 30, { size: 17, weight: 700, color: C.text });
        kit.label(c, 'wheel', px, 62, { size: 11, color: C.muted });
        kit.label(c, V.wheel + '°', px + 44, 62, { size: 17, weight: 700, color: C.text });
        c.save(); c.translate(px + pw * 0.5, Hh * 0.64); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.arc(0, 0, 38, 0, TAU); c.stroke();
        c.strokeStyle = '#ffd86b'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(-38 * Math.cos(phi), 38 * Math.sin(phi)); c.lineTo(38 * Math.cos(phi), -38 * Math.sin(phi)); c.stroke();
        c.strokeStyle = '#7be3ff'; c.beginPath(); c.moveTo(-38 * Math.sin(phi), -38 * Math.cos(phi)); c.lineTo(38 * Math.sin(phi), 38 * Math.cos(phi)); c.stroke(); c.restore();
        kit.label(c, 'the wheel turns both sets of lines', px + pw * 0.5, Hh * 0.64 + 54, { size: 10.5, align: 'center', color: C.muted });
        // read-outs and the graph
        const an = Math.abs(((V.wheel - V.axis) % 180 + 180) % 180), off2 = Math.min(an, 180 - an);
        ro.set('pa', dpt(pa));
        ro.set('pb', dpt(pb));
        ro.set('gap', Math.abs(V.cyl) < 0.005 ? 'none: a sphere' : fx(Math.abs(pa - pb), 2) + ' D (the cylinder when the wheel is at the axis: ' + fx(Math.abs(V.cyl), 2) + ' D)');
        ro.set('hint', Math.abs(V.cyl) < 0.005 ? 'of no use for a sphere' : off2 < 2.6 ? 'at the axis: the readings differ most' : off2 > 42.4 && off2 < 47.6 ? '45° from the axis: the readings agree' : fx(off2, 0) + '° from the axis');
        ro.set('pri', V.prism < 0.01 ? 'none: the target is centred' : fx(V.prism, 2) + ' Δ, base ' + V.base);
        const a1 = [], a2 = []; for (let d = -14; d <= 10; d += 0.25) { a1.push([d, sharp(d, pa)]); a2.push([d, sharp(d, pb)]); }
        plot.set({ series: [{ pts: a1, label: 'lines A' }, { pts: a2, label: 'lines B', dash: true }], vlines: [{ x: V.dial, label: 'dial' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
