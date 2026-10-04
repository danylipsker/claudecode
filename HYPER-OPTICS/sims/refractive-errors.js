/* HYPER-OPTICS · sims/refractive-errors.js — simulations of the topic "Visual deficiencies" (prefix re-)
 *   re-eye-model     a schematic eye whose length, focusing and spectacle lens can be changed: where the light comes to a point
 *   re-astig         the two focal lines of an astigmatic eye, the interval between them and the spoke chart as it is blurred
 *   re-presbyopia    the amplitude of accommodation against age, the near point and the distance that reading needs
 *   re-cvd           a palette and a hidden-shape plate as designed and as a person with colour-vision deficiency may see them
 *   re-eyes-aligned  two eyes fixing a target: the turn of an eye in degrees and prism dioptres, and the two retinal images
 *   re-cataract      a scene seen through a lens that scatters, absorbs blue and veils: contrast, glare and yellowing
 *   re-glaucoma      a map of the visual field of one eye with an arcuate defect that grows, and the scene seen through it
 *   re-macula        the Amsler grid and a street scene with a central blind patch and wavy lines
 *   re-cornea        the rings a keratometer reflects from a regular, an astigmatic and a conical cornea, and the curvature map
 *   re-lowvision     print blurred to a chosen acuity and the magnification that makes it readable again
 * The numbers come from kit.optics (the schematic eye traced with O.sys, O.eye, O.colour.cvd); the drawing is kit.osym and
 * the canvas helpers of the kit. Every picture of a condition is schematic: it shows how the optics or the field behave and
 * is not a record of what any person sees.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, R2D = 180 / PI, ARCMIN = R2D * 60;
  const MINUS = '−';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fx = (x, d) => Number.isFinite(x) ? x.toFixed(d) : '—';
  const dpt = (v, d) => (Math.abs(v) < 0.005 ? '0.00' : (v < 0 ? MINUS : '+') + Math.abs(v).toFixed(d == null ? 2 : d)) + ' D';
  const dist = m => !Number.isFinite(m) ? 'infinity' : m >= 10 ? m.toFixed(0) + ' m' : m >= 1 ? m.toFixed(2).replace(/\.?0+$/, '') + ' m' : m >= 0.1 ? (m * 100).toFixed(0) + ' cm' : (m * 100).toFixed(1) + ' cm';
  const acu = x => '20/' + x;
  const css = rgb => 'rgb(' + Math.round(clamp(rgb[0], 0, 255)) + ',' + Math.round(clamp(rgb[1], 0, 255)) + ',' + Math.round(clamp(rgb[2], 0, 255)) + ')';
  function path(c, pts, close) { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (close) c.closePath(); }
  function fillPoly(c, pts, color) { path(c, pts, true); c.fillStyle = color; c.fill(); }
  function strokeLine(c, pts, color, lw, dash, close) { c.save(); path(c, pts, close); c.strokeStyle = color; c.lineWidth = lw; c.setLineDash(dash || []); c.lineJoin = 'round'; c.stroke(); c.restore(); }
  function panel(c, C, x, y, w, h, title) {
    c.save(); c.fillStyle = C.surface; c.fillRect(x, y, w, h); c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); c.restore();
    if (title) S_text(c, title, x + w / 2, y + 11, { size: 10.5, color: C.muted });
  }
  let S_text = () => {};

  /* ================================================================ the schematic eye */
  /* Le Grand's eye from the lens library, traced with the ray tracer. Its length is found from the refractive state (the
     retina is where an object at the eye's far point is imaged); accommodation steepens the front of the lens, more than
     the back, and thickens it a little, by the amount that moves the far point by the effort. The spectacle lens is a thin
     meniscus of index 1.5, its back surface 12 mm from the cornea. */
  let EYE = null;
  function eyeKit(O) {
    if (EYE) return EYE;
    const SY = O.sys, VD = 12, ENT = SY.paraxial(O.lens('eye')).epd / 4;
    const K = {
      VD,
      sf(s1, A, pupil) {
        const sf = O.lens('eye').surfaces, R2 = sf[2].R, R3 = sf[3].R;
        sf[1].t -= 0.04 * A; sf[2].R = R2 / s1; sf[2].t += 0.06 * A; sf[3].R = R3 / (1 + 0.3 * (s1 - 1));
        sf[2].sd = pupil / 2 / ENT;
        return sf;
      },
      imageZ(sf, v) { return SY.paraxial({ surfaces: sf, object: Math.abs(v) < 1e-9 ? Infinity : -1000 / v }).zImage; },
      retinaZ(ref) { return K.imageZ(K.sf(1, 0, 4), ref); },
      lensScale(ref, A, ret) {
        if (A < 1e-6) return 1;
        const g = s => K.imageZ(K.sf(s, A, 4), ref - A) - ret;
        let lo = 0.8, hi = 3.2;
        if (g(lo) < 0) return lo;
        if (g(hi) > 0) return hi;
        for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (g(mid) > 0) lo = mid; else hi = mid; }
        return (lo + hi) / 2;
      },
      spec(F) {
        const n = 1.5, t = clamp(1.8 + 0.2 * F, 1.0, 4.0), F1 = clamp(4 + 0.5 * F, 1, 9);
        const F2 = F - F1 / (1 - t / 1000 / n * F1);
        const R1 = (n - 1) / F1 * 1000, R2 = Math.abs(F2) < 1e-6 ? 0 : -(n - 1) / F2 * 1000;
        return { t, R1, R2, surfaces: [{ R: R1, t, n, sd: 15 }, { R: R2, t: VD, n: 1, sd: 15 }] };
      },
      /* the vergence (D) at the cornea of the light from an object d metres away, seen through a lens F at VD */
      arriving(F, d) {
        if (Math.abs(F) < 0.005) return Number.isFinite(d) ? -1 / d : 0;
        const sp = K.spec(F), z0 = sp.t + VD;
        const par = SY.paraxial({ surfaces: sp.surfaces, object: Number.isFinite(d) ? d * 1000 - z0 : Infinity });
        const out = par.zImage - sp.t;
        if (!Number.isFinite(out)) return 0;
        let v = out - VD; if (Math.abs(v) < 0.5) v = v < 0 ? -0.5 : 0.5;
        return 1000 / v;
      },
      /* the body of the eye in section: the globe, the cornea, the lens, the iris and the retina */
      body(c, m, sf, ret, C) {
        const zs = SY.vertices({ surfaces: sf });
        const P = (i, r) => { const z = SY.sag(sf[i], r); return [m.X(zs[i] + (Number.isFinite(z) ? z : 0)), m.Y(r)]; };
        const arc = (i, r0, r1, n) => { const o = []; for (let j = 0; j <= n; j++) o.push(P(i, r0 + (r1 - r0) * j / n)); return o; };
        const b = 11.6 + 0.2 * (ret - 24.2), zc = ret / 2, a = ret / 2, phi0 = Math.acos(clamp((2.5 - zc) / a, -1, 1));
        const ell = (p0, p1, n) => { const o = []; for (let k = 0; k <= n; k++) { const ph = p0 + (p1 - p0) * k / n; o.push([m.X(zc + a * Math.cos(ph)), m.Y(b * Math.sin(ph))]); } return o; };
        const glob = ell(phi0, -phi0, 48), body = [P(0, 5.5)].concat(glob, arc(0, -5.5, 5.5, 14));
        fillPoly(c, body, C.dark ? 'rgba(235,238,250,0.06)' : 'rgba(40,60,120,0.05)');
        strokeLine(c, body, C.muted, 1.8, null, true);
        strokeLine(c, ell(1.0, -1.0, 24), C.bad, 3.2);
        const cor = arc(0, -5.5, 5.5, 14).concat(arc(1, 5.5, -5.5, 14));
        fillPoly(c, cor, S_glass(0.34)); strokeLine(c, cor, S_edge(), 1.3, null, true);
        let rl = 0;
        for (let r = 0.2; r <= 4.4; r += 0.1) { const th = zs[3] + SY.sag(sf[3], r) - (zs[2] + SY.sag(sf[2], r)); if (!(th > 0.15)) break; rl = r; }
        rl = Math.max(rl, 0.6);
        const len = arc(2, -rl, rl, 16).concat(arc(3, rl, -rl, 16));
        fillPoly(c, len, S_glass(0.4)); strokeLine(c, len, S_edge(), 1.3, null, true);
        const xi = m.X(zs[2] - 0.15), pu = sf[2].sd;
        for (const sgn of [1, -1]) strokeLine(c, [[xi, m.Y(sgn * pu)], [xi, m.Y(sgn * 5.5)]], C.accent, 3.6);
        return { zs, zc, a, b };
      }
    };
    EYE = K;
    return K;
  }
  let S_glass = () => 'rgba(100,150,230,0.2)', S_edge = () => '#789';
  function bindDraw(S) { S_text = S.text; S_glass = S.glass; S_edge = S.edge; }

  /* a short run of text blurred by a disc of the given radius (px): the text drawn at many offsets, each faint */
  function blurText(c, str, x, y, o, radius) {
    c.save(); c.font = (o.weight || 600) + ' ' + o.size + 'px ' + (o.font || 'system-ui, sans-serif'); c.textAlign = o.align || 'center'; c.textBaseline = 'middle'; c.fillStyle = o.color;
    if (radius < 0.6) { c.fillText(str, x, y); c.restore(); return; }
    const n = radius < 2 ? 5 : radius < 6 ? 9 : 13;
    c.globalAlpha = Math.max(0.16, Math.min(1, 1.5 / Math.sqrt(1 + n * 0.45))) * (radius < 2 ? 0.7 : 0.55);
    c.fillText(str, x, y);
    for (let k = 0; k < n; k++) { const a = TAU * k / n, r = radius * (k % 2 ? 1 : 0.55); c.fillText(str, x + r * Math.cos(a), y + r * Math.sin(a)); }
    c.restore();
  }

  /* ================================================================ 1 · the schematic eye */
  Hyper.sim('re-eye-model', {
    title: 'The eye: its length, its focus and the lens that corrects it',
    blurb: `A schematic eye in section with real rays traced through its cornea and lens. The red arc at the back is the retina. The eye is built so that its **refractive state** is whatever you set: a longer eye puts the focus in front of the retina (short sight, negative), a shorter one behind it (long sight, positive). The small square is the spot of light that lands on the retina, magnified.

**Try this**
- Start at 0 D, a distant object: the rays meet exactly on the retina. Move the refractive state to **−3 D**: the eye is longer by a little over a millimetre and the focus falls *in front of* the retina, so a point becomes a patch.
- Bring the object in to **33 cm**, the far point of a −3 D eye: the focus returns to the retina with no effort. That is why a short-sighted person sees close things clearly.
- Set **+2.5 D**, age 20: the focus is behind the retina, but press *Let the eye focus* and the young lens rounds up and pulls it forward. Raise the age and the available focusing power falls.
- Press *Fit the lens that focuses* and see the spectacle lens (12 mm in front) that puts the focus back on the retina. The figure is a model of an eye, not of yours.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, SY = O.sys, E = O.eye;
      bindDraw(S);
      const T = eyeKit(O), VD = T.VD;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 330 });
      const age0 = params.age || 25;
      const ampNow = () => E.accommodation(ctl && ctl.values ? ctl.values.age : age0).avg;
      let ctl = null;
      ctl = kit.controls(box.side, [
        { id: 'rx', label: 'Refractive state of the eye', min: -10, max: 6, step: 0.25, value: params.rx != null ? params.rx : 0, fmt: v => (Math.abs(v) < 0.01 ? 'normal, 0 D' : dpt(v) + (v < 0 ? ' · long eye' : ' · short eye')) },
        { id: 'd', type: 'select', label: 'Object distance', options: [['Infinity (a distant object)', Infinity], ['6 m', 6], ['1 m', 1], ['40 cm', 0.4], ['33 cm', 1 / 3], ['25 cm', 0.25], ['10 cm', 0.1]], value: params.d != null ? params.d : Infinity },
        { id: 'acc', label: 'Focusing effort (of the amount available)', min: 0, max: 100, step: 1, value: params.acc || 0, fmt: v => fx(ampNow() * v / 100, 1) + ' D' },
        { id: 'age', label: 'Age (sets the focusing power available)', min: 8, max: 75, step: 1, value: age0, unit: 'years' },
        { id: 'pupil', label: 'Pupil diameter', min: 2, max: 8, step: 0.5, value: 4, unit: 'mm' },
        { id: 'F', label: 'Spectacle lens, 12 mm in front', min: -10, max: 10, step: 0.25, value: params.F || 0, fmt: v => Math.abs(v) < 0.01 ? 'none' : dpt(v) },
        { type: 'buttons', items: [{ id: 'fix', label: 'Fit the lens that focuses', primary: true }, { id: 'acco', label: 'Let the eye focus' }, { id: 'zero', label: 'Remove the lens' }] }
      ], id => {
        if (id === 'fix') ctl.set('F', fixPower());
        else if (id === 'zero') ctl.set('F', 0);
        else if (id === 'acco') ctl.set('acc', accNeeded());
        else if (id === 'age') ctl.set('acc', Math.min(V.acc, 100));
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['len', 'Length of the eye in this model'], ['focus', 'Where the focus falls'], ['err', 'Net error at the retina'], ['blur', 'Blur disc, as an angle'], ['acu', 'Rough acuity at this pupil'], ['far', 'Far point of this eye'], ['near', 'Near point at this age'], ['fix', 'Lens that would bring the focus onto the retina']]);
      const fixRaw = () => V.rx / (1 + VD / 1000 * V.rx);
      const fixPower = () => clamp(Math.round(fixRaw() * 4) / 4, -10, 10);
      const accNeeded = () => { const amp = ampNow(); return amp > 0 ? clamp(Math.max(0, V.rx - T.arriving(V.F, V.d)) / amp * 100, 0, 100) : 0; };
      const ret0 = T.retinaZ(0);

      function model() {
        const ref = V.rx, amp = ampNow(), A = amp * V.acc / 100, F = V.F, d = V.d;
        const retRel = T.retinaZ(ref), s1 = T.lensScale(ref, A, retRel), eyeSf = T.sf(s1, A, V.pupil);
        let sf = eyeSf, z0 = 0, sp = null;
        if (Math.abs(F) >= 0.005) { sp = T.spec(F); z0 = sp.t + VD; sf = sp.surfaces.concat(eyeSf); }
        const sys = { surfaces: sf, object: Number.isFinite(d) ? d * 1000 - z0 : Infinity };
        const par = SY.paraxial(sys), retAbs = retRel + z0, dz = Number.isFinite(par.zImage) ? par.zImage - retAbs : 0;
        return { ref, amp, A, F, d, retRel, retAbs, z0, sp, eyeSf, sys, par, dz, err: ref - A - T.arriving(F, d) };
      }
      function spotOf(M, fl) {
        const nm = 587.56, zs = M.par.zs, ns = SY.indices(M.sys, nm), pts = [];
        const shoot = (px, py) => { const tr = SY.trace(M.sys, SY.aim(M.sys, px, py, 0, M.par, nm), nm, { zs, ns }); if (tr.ok) { const e = SY.at(tr, M.retAbs); if (Number.isFinite(e[0]) && Number.isFinite(e[1])) pts.push([e[0], e[1]]); } };
        shoot(0, 0);
        for (let r = 1; r <= 5; r++) for (let j = 0; j < 6 * r; j++) { const a = TAU * j / (6 * r); shoot(fl * r / 5 * Math.cos(a), fl * r / 5 * Math.sin(a)); }
        let cx = 0, cy = 0, geo = 0;
        for (const p of pts) { cx += p[0]; cy += p[1]; }
        cx /= pts.length || 1; cy /= pts.length || 1;
        for (const p of pts) geo = Math.max(geo, Math.hypot(p[0] - cx, p[1] - cy));
        return { pts, cx, cy, geo, rms: geo / 2 };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = model();
        const m = S.map(st, -36, 31, 15.5, { left: 6, right: 6, top: 8, bottom: 22 }), s = m.s;
        const mz = { X: z => m.X(z - M.z0), Y: m.Y };
        S.axis(c, m.X(-36), m.Y(0), m.X(31));
        const body = T.body(c, m, M.eyeSf, M.retRel, C);
        if (M.sp) {
          S.lens(c, m.X(-M.z0), m.Y(0), s * 15, { R1: s * M.sp.R1, R2: s * M.sp.R2, t: s * M.sp.t, fill: S.glass(0.26) });
          S.dim(c, m.X(-VD), m.Y(-14.2), m.X(0), m.Y(-14.2), '12 mm', { off: -9, size: 10.5 });
          kit.label(c, 'spectacle lens ' + dpt(M.F), m.X(-M.z0 - 1.5), Hh - 9, { align: 'center', size: 11, color: C.text });
        }
        let fl = 0.98, fan = null;
        for (; fl > 0.5; fl -= 0.04) { fan = SY.fan2d(M.sys, { n: 9, fill: fl, zEnd: M.retAbs, zStart: -36 + M.z0 }); if (fan.every(r => r.ok)) break; }
        S.rays(c, fan, mz, { nm: 587.56, width: 1.3 });
        const zF = M.par.zImage - M.z0;
        if (M.dz > 0.03) for (const r of fan) if (r.ok && Number.isFinite(zF)) { const e = SY.at(r.tr, M.par.zImage); strokeLine(c, [[mz.X(M.retAbs), mz.Y(SY.at(r.tr, M.retAbs)[1])], [mz.X(e[2]), mz.Y(e[1])]], C.faint, 1, [3, 3]); }
        const xi = m.X(body.zs[2] - 0.15);
        for (const sgn of [1, -1]) strokeLine(c, [[xi, m.Y(sgn * M.eyeSf[2].sd)], [xi, m.Y(sgn * 5.5)]], C.accent, 3.6);
        const sp = spotOf(M, fl), hpx = Math.max(3, sp.geo * s);
        strokeLine(c, [[m.X(M.retRel), m.Y(0) - hpx], [m.X(M.retRel), m.Y(0) + hpx]], C.warn, 4);
        if (Number.isFinite(zF) && Math.abs(zF) < 60) {
          kit.dot(c, m.X(zF), m.Y(0), 4.5, C.text, C.bg2);
          kit.label(c, Math.abs(M.dz) < 0.03 ? 'focus on the retina' : 'focus', m.X(zF) - 8, m.Y(0) - 22, { align: 'right', size: 11, color: C.text, weight: 650, bg: C.bg2 });
        }
        kit.label(c, 'cornea', m.X(-0.4), m.Y(8.6), { align: 'center', size: 11 });
        kit.label(c, 'iris and pupil', m.X(-0.6), m.Y(-9.4), { align: 'center', size: 11 });
        kit.label(c, 'lens', m.X(body.zs[2] + 2.2), m.Y(6.4), { align: 'center', size: 11 });
        kit.label(c, 'retina', m.X(M.retRel) - 4, m.Y(-13.2), { size: 11.5, align: 'right', color: C.bad });
        kit.label(c, Number.isFinite(M.d) ? 'an object ' + dist(M.d) + ' away' : 'parallel rays', m.X(-35.4), m.Y(-5.5), { size: 11, align: 'left' });
        kit.label(c, Number.isFinite(M.d) ? 'is off to the left' : 'from a distant object', m.X(-35.4), m.Y(-5.5) + 14, { size: 11, align: 'left' });
        // the patch on the retina, magnified
        const size = clamp(Hh * 0.3, 90, 130), bx = 8, by = 8, half = size / 2 - 8;
        panel(c, C, bx, by, size, size, 'on the retina');
        const scale = 0.78 * half / Math.max(sp.geo, 0.006);
        const nW = M.par.fnoWorking, airy = Number.isFinite(nW) ? 1.22 * 550e-6 * nW : 0.003;
        S.spot(c, sp, bx + size / 2, by + size / 2 + 6, half - 4, scale, { airy, nm: 587.56 });
        let bar = 1; for (const u of [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]) if (u * scale / 1000 <= size - 58) bar = u;
        const bpx = bar * scale / 1000;
        strokeLine(c, [[bx + 8, by + size - 12], [bx + 8 + bpx, by + size - 12]], C.text, 1.5);
        kit.label(c, bar + ' µm', bx + 12 + bpx, by + size - 12, { size: 10, align: 'left' });
        // read-outs
        const err = M.err, aD = Math.abs(err) * V.pupil / 4;
        ro.set('len', fx(M.retRel, 2) + ' mm' + (Math.abs(M.retRel - ret0) < 0.005 ? '' : '  (' + (M.retRel > ret0 ? '+' : MINUS) + fx(Math.abs(M.retRel - ret0), 2) + ' mm from the 0 D eye)'));
        ro.set('focus', Math.abs(M.dz) < 0.03 ? 'on the retina' : fx(Math.abs(M.dz), 2) + ' mm ' + (M.dz > 0 ? 'behind' : 'in front of') + ' the retina');
        ro.set('err', Math.abs(err) < 0.125 ? 'none (' + dpt(err) + ')' : dpt(err) + (err < 0 ? ': focus in front' : ': focus behind'));
        ro.set('blur', fx(E.blurAngle(err, V.pupil) * ARCMIN, 1) + ' arc-minutes across');
        ro.set('acu', 'about ' + acu(E.acuityFromDefocus(aD)));
        const fp = E.farPoint(M.ref), np = E.nearPoint(M.ref, M.amp);
        ro.set('far', M.ref === 0 ? 'infinity' : fp > 0 ? dist(fp) : 'behind the eye: even distance needs focusing');
        ro.set('near', Number.isFinite(np) ? dist(np) + ' (' + fx(M.amp, 1) + ' D available)' : 'none: it cannot focus on anything');
        const fr = fixRaw();
        ro.set('fix', Math.abs(fr) < 0.125 ? 'none needed' : dpt(Math.round(fr * 100) / 100) + ' at 12 mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 2 · astigmatism of the eye */
  Hyper.sim('re-astig', {
    title: 'Astigmatism of the eye: two focal lines',
    blurb: `The cornea of an astigmatic eye is shaped more like the back of a spoon than like a ball: one meridian is steeper, and so more powerful, than the meridian at right angles. Light in the two meridians comes to a focus at two different distances, and a point of light is imaged first as a short line, then as a blur, then as a line at right angles, with nothing sharp between. The two upper panels are sections through the two principal meridians, traced through the schematic eye.

**Try this**
- Set the cylinder to **2 D** and press *Least confusion*: the retina sits between the two lines and the patch is the smallest, a round blur. The distance between the lines is the **interval of Sturm**.
- Press *First focal line*, then *Second focal line*: the patch becomes a short line, first one way, then at right angles. On the spoke chart, the spokes that run along the line stay crisp and the ones across it smear.
- Turn the steeper meridian from **90°** (vertical: *with the rule*) to **180°** (horizontal: *against the rule*) and watch which spokes lose their contrast.
- Move the retina in front of both lines or beyond both, and read the name of the case in the read-out: simple, compound or mixed.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, SY = O.sys, E = O.eye;
      bindDraw(S);
      const T = eyeKit(O), z0 = T.retinaZ(0), ZMAX = 27;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 350 });
      const ctl = kit.controls(box.side, [
        { id: 'cyl', label: 'Cylinder: difference in power between the two meridians', min: 0, max: 5, step: 0.25, value: params.cyl != null ? params.cyl : 2, unit: 'D' },
        { id: 'axis', label: 'The steeper (more powerful) meridian lies at', min: 0, max: 180, step: 5, value: params.axis != null ? params.axis : 90, fmt: v => v + '°' + (Math.abs(v - 90) <= 30 ? ' · with the rule' : (v <= 30 || v >= 150) ? ' · against the rule' : ' · oblique') },
        { id: 'dz', label: 'The retina, moved from the midpoint of the two lines', min: -1.5, max: 1.5, step: 0.02, value: params.dz != null ? params.dz : 0, fmt: v => (v < -0.005 ? MINUS : v > 0.005 ? '+' : '') + Math.abs(v).toFixed(2) + ' mm' },
        { id: 'pupil', label: 'Pupil', min: 2, max: 8, step: 0.5, value: 4, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'l1', label: 'First focal line' }, { id: 'lc', label: 'Least confusion', primary: true }, { id: 'l2', label: 'Second focal line' }] }
      ], id => {
        if (id === 'l1') ctl.set('dz', -half());
        else if (id === 'l2') ctl.set('dz', half());
        else if (id === 'lc') ctl.set('dz', 0);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pow', 'Power of the two meridians'], ['int', 'Interval of Sturm'], ['sph', 'Spherical equivalent (the midpoint)'], ['case', 'The retina is'], ['blur', 'Blur across the two meridians'], ['ang', 'Blur at the retina, as an angle']]);
      const memo = new Map();
      /* the eye whose cornea is bent until the focus of a distant object lies where an eye of error K would have its retina,
         flipped about the normal eye: K < 0 puts the focus in front of the midpoint, K > 0 behind it */
      /* where the rim rays of the pupil (0.95 of its radius) cross the axis: the focus of the whole pupil, which falls a little short of the paraxial one */
      function marginalZ(sf) {
        const sys = { surfaces: sf, object: Infinity }, par = SY.paraxial(sys), tr = SY.trace(sys, SY.aim(sys, 0, 0.95, 0, par, 587.56), 587.56);
        return tr.ok && Math.abs(tr.d[1]) > 1e-12 ? tr.p[2] - tr.p[1] * tr.d[2] / tr.d[1] : par.zImage;
      }
      function meridianEye(K, pupil) {
        const key = K + '|' + pupil;
        if (memo.has(key)) return memo.get(key);
        const make = R => { const sf = T.sf(1, 0, pupil); sf[0].R = R; return sf; };
        const zm = marginalZ(make(7.8)), target = zm - (T.retinaZ(K) - z0);
        let lo = 5.5, hi = 11;
        for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (marginalZ(make(mid)) > target) hi = mid; else lo = mid; }
        const sf = make((lo + hi) / 2), sys = { surfaces: sf, object: Infinity };
        const fan = SY.fan2d(sys, { n: 9, fill: 0.95, zStart: -3, zEnd: ZMAX });
        const out = { sys, fan, zf: target, zm, R: sf[0].R };
        if (memo.size > 40) memo.clear();
        memo.set(key, out);
        return out;
      }
      const half = () => { const a = meridianEye(-V.cyl / 2, V.pupil), b = meridianEye(V.cyl / 2, V.pupil); return (b.zf - a.zf) / 2; };
      const hAt = (e, z) => { const r = e.fan[e.fan.length - 1]; return r && r.ok ? SY.at(r.tr, z)[1] / 0.95 : 0; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const A = meridianEye(-V.cyl / 2, V.pupil), B = meridianEye(V.cyl / 2, V.pupil);
        const zr = A.zm + V.dz, gap = 8, leftW = Math.round(W * 0.6), ph = Math.round((Hh - 3 * gap) / 2);
        const rx0 = leftW + 2 * gap, rw = W - rx0 - gap, ang = V.axis * D2R;
        // the two sections
        [[A, 'section through the steeper meridian, at ' + V.axis + '°', 0], [B, 'section through the flatter meridian, at ' + ((V.axis + 90) % 180) + '°', 1]].forEach(([e, title, k]) => {
          const ox = gap, oy = gap + k * (ph + gap), m = S.map({ W: leftW, H: ph }, -3, ZMAX, 2.7, { left: 8, right: 8, top: 20, bottom: 8 });
          const mm = { X: z => ox + m.X(z), Y: y => oy + m.Y(y) };
          panel(c, C, ox, oy, leftW, ph, title);
          c.save(); c.beginPath(); c.rect(ox + 1, oy + 1, leftW - 2, ph - 2); c.clip();
          S.axis(c, mm.X(-3), mm.Y(0), mm.X(ZMAX));
          S.rays(c, e.fan, mm, { nm: 587.56, width: 1.2 });
          strokeLine(c, [[mm.X(0), mm.Y(2.7)], [mm.X(0), mm.Y(-2.7)]], S_edge(), 1.4);
          strokeLine(c, [[mm.X(zr), mm.Y(2.6)], [mm.X(zr), mm.Y(-2.6)]], C.bad, 3);
          kit.dot(c, mm.X(e.zf), mm.Y(0), 4, C.text, C.bg2);
          c.restore();
          kit.label(c, 'focus', mm.X(e.zf), oy + ph - 10, { align: 'center', size: 10.5, color: C.text, weight: 650 });
          if (k === 0) { kit.label(c, 'cornea', mm.X(0) + 4, oy + 24, { align: 'left', size: 10.5 }); kit.label(c, 'retina', mm.X(zr) + 5, oy + 24, { align: 'left', size: 10.5, color: C.bad }); }
        });
        // the patch on the retina, from the heights of the marginal rays in the two principal meridians
        const wS = hAt(A, zr), wF = hAt(B, zr), box0 = Math.min(rw, ph), halfPx = box0 / 2 - 14;
        panel(c, C, rx0, gap, rw, ph, 'the patch on the retina');
        const cx = rx0 + rw / 2, cy = gap + ph / 2 + 6, sc = halfPx / 0.3;
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(cx - halfPx, cy); c.lineTo(cx + halfPx, cy); c.moveTo(cx, cy - halfPx); c.lineTo(cx, cy + halfPx); c.stroke(); c.strokeRect(cx - halfPx, cy - halfPx, 2 * halfPx, 2 * halfPx);
        const e1 = [Math.cos(ang), Math.sin(ang)], e2 = [-Math.sin(ang), Math.cos(ang)];
        c.restore();
        c.save(); c.fillStyle = S.nm(587.56, 0.28);
        c.beginPath(); c.ellipse(cx, cy, Math.max(0.8, Math.abs(wS) * sc), Math.max(0.8, Math.abs(wF) * sc), -ang, 0, TAU); c.fill();
        c.fillStyle = S.nm(587.56);
        const dot = (px, py) => { const u = px * wS, v = py * wF; const X = u * e1[0] + v * e2[0], Y = u * e1[1] + v * e2[1]; const qx = cx + X * sc, qy = cy - Y * sc; if (Math.abs(qx - cx) <= halfPx && Math.abs(qy - cy) <= halfPx) c.fillRect(qx - 1, qy - 1, 2, 2); };
        dot(0, 0);
        for (let r = 1; r <= 5; r++) for (let j = 0; j < 6 * r; j++) { const a = TAU * j / (6 * r); dot(r / 5 * Math.cos(a), r / 5 * Math.sin(a)); }
        c.restore();
        kit.label(c, 'box 600 µm across', cx, cy + halfPx + 9, { align: 'center', size: 10, color: C.faint });
        // the spoke chart, blurred by the same patch (the chart is seen about 2.5° from its centre to its rim)
        const oy2 = gap + ph + gap, R = Math.min(rw / 2 - 12, ph / 2 - 18), sx = R / 0.73, ccx = rx0 + rw / 2, ccy = oy2 + ph / 2 + 6;
        panel(c, C, rx0, oy2, rw, ph, 'a spoke chart as this eye sees it');
        const ba = Math.abs(wS) * sx, bb = Math.abs(wF) * sx, w0 = 3;
        for (let k = 0; k < 12; k++) {
          const phi = k * 15 * D2R, u = [Math.cos(phi), Math.sin(phi)], nrm = [-Math.sin(phi), Math.cos(phi)];
          const hw = Math.sqrt(ba * ba * Math.pow(nrm[0] * e1[0] + nrm[1] * e1[1], 2) + bb * bb * Math.pow(nrm[0] * e2[0] + nrm[1] * e2[1], 2));
          const N = hw < 0.6 ? 1 : clamp(Math.ceil(hw / (w0 * 0.25)) + 1, 2, 13), cc = hw < 0.6 ? 1 : w0 / (w0 + 2 * hw), al = N === 1 ? 1 : cc / (1 + w0 * (N - 1) / (2 * hw));
          c.save(); c.strokeStyle = C.text; c.lineWidth = w0; c.globalAlpha = clamp(al, 0.03, 1); c.lineCap = 'butt';
          for (let i = 0; i < N; i++) {
            const o = N === 1 ? 0 : hw * (2 * i / (N - 1) - 1);
            c.beginPath(); c.moveTo(ccx - u[0] * R + nrm[0] * o, ccy + u[1] * R - nrm[1] * o); c.lineTo(ccx + u[0] * R + nrm[0] * o, ccy - u[1] * R - nrm[1] * o); c.stroke();
          }
          c.restore();
        }
        // read-outs
        const lo = A.zf, hi = B.zf, ret = zr;
        const gapMm = hi - lo, tol = 0.03;
        let kase;
        if (V.cyl < 0.12) kase = 'a single focus: no astigmatism to speak of';
        else if (Math.abs(ret - lo) < tol) kase = 'at the first line: simple hyperopic astigmatism (the other line is behind the retina)';
        else if (Math.abs(ret - hi) < tol) kase = 'at the second line: simple myopic astigmatism (the other line is in front)';
        else if (ret < lo) kase = 'in front of both lines: compound hyperopic astigmatism';
        else if (ret > hi) kase = 'behind both lines: compound myopic astigmatism';
        else kase = 'between the lines: mixed astigmatism' + (Math.abs(ret - (lo + hi) / 2) < tol ? ' (at the circle of least confusion)' : '');
        ro.set('pow', V.cyl < 0.12 ? 'the same in every meridian' : 'the steeper meridian focuses ' + fx(V.cyl / 2, 2) + ' D short of the midpoint, the flatter ' + fx(V.cyl / 2, 2) + ' D beyond it');
        ro.set('int', V.cyl < 0.12 ? 'none' : fx(gapMm, 2) + ' mm along the axis (' + fx(V.cyl, 2) + ' D)');
        ro.set('sph', V.cyl < 0.12 ? 'the same in every meridian' : 'halfway: the focus of a spherical lens of ' + fx(V.cyl / 2, 2) + ' D less power');
        ro.set('case', kase);
        const w17 = 17;
        ro.set('blur', fx(Math.abs(wS) * 2 * 1000, 0) + ' µm along the steeper meridian · ' + fx(Math.abs(wF) * 2 * 1000, 0) + ' µm across it');
        ro.set('ang', fx(2 * Math.abs(wS) / w17 * ARCMIN, 1) + '′ by ' + fx(2 * Math.abs(wF) / w17 * ARCMIN, 1) + '′');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 3 · presbyopia */
  Hyper.sim('re-presbyopia', {
    title: 'Presbyopia: the focusing reserve and the near point',
    blurb: `The ruler is laid out in **dioptres of proximity**: 0 D is infinity, 2 D is half a metre, 4 D is a quarter of a metre (distances are written along the top). The band is the part of that ruler the eye can bring into focus: from its far point to its near point. Its width is the **amplitude of accommodation**, which falls with age by a steady amount (an empirical formula fitted to measurements on many people; individuals scatter around it). The marker is the page you hold. The curves below show the amplitude against age, with the scatter, and the demand of the reading distance.

**Try this**
- Start at **45 years**, normal eye, reading at 40 cm: the demand is 2.5 D and the average eye has about 5 D, so the page is inside the band and the text is sharp — but half the effort is used up.
- Slide the age to **55**: the near point recedes past the page and the text blurs. Move the book out and it sharpens again.
- Set the eye to **−2 D** (short-sighted): the whole band shifts towards the eye. The near point is closer, so reading still works with no help at 55.
- Add a **+2 D** lens: the band shifts to bring the page into it, and the far point comes in to about 50 cm — distance is now blurred. That trade is why reading glasses are taken off to look up.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      bindDraw(S);
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 230, maxH: 310 });
      const plot = kit.plot(box.stage, { x: { label: 'age (years)', name: 'age', min: 10, max: 70 }, y: { label: 'amplitude (D)', name: 'A', min: 0, max: 22 }, series: [] }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'age', label: 'Age', min: 10, max: 70, step: 1, value: params.age || 45, unit: 'years' },
        { id: 'rx', label: 'Refractive state of the eye', min: -4, max: 3, step: 0.25, value: params.rx || 0, fmt: v => Math.abs(v) < 0.01 ? 'normal, 0 D' : dpt(v) },
        { id: 'd', type: 'select', label: 'Reading distance', options: [['25 cm', 0.25], ['33 cm', 1 / 3], ['40 cm', 0.4], ['50 cm', 0.5], ['70 cm', 0.7], ['1 m', 1]], value: params.d || 0.4 },
        { id: 'who', type: 'select', label: 'Which eye, from the scatter between people', options: [['An average eye', 'avg'], ['Lowest amplitude', 'min'], ['Highest amplitude', 'max']], value: 'avg' },
        { id: 'add', label: 'Lens added in front of the eye', min: 0, max: 3, step: 0.25, value: params.add || 0, fmt: v => v < 0.01 ? 'none' : '+' + v.toFixed(2) + ' D' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['A', 'Amplitude of accommodation'], ['near', 'Near point'], ['far', 'Far point'], ['dem', 'What the reading distance asks for'], ['res', 'Left in reserve'], ['say', 'The page'], ['add', 'Addition that leaves half the amplitude in reserve'], ['tab', 'A typical table gives, at this age']]);
      const series = ['min', 'avg', 'max'].map(k => { const pts = []; for (let a = 10; a <= 70; a += 2) pts.push([a, E.accommodation(a)[k]]); return { pts, label: k === 'avg' ? 'average' : k === 'min' ? 'lowest' : 'highest', dash: k === 'avg' ? null : [4, 4] }; });
      const tableAdd = age => { const T = E.ADD_BY_AGE; if (age <= T[0][0]) return age < 38 ? 0 : T[0][1] * (age - 38) / (T[0][0] - 38); for (let i = 1; i < T.length; i++) if (age <= T[i][0]) return T[i - 1][1] + (T[i][1] - T[i - 1][1]) * (age - T[i - 1][0]) / (T[i][0] - T[i - 1][0]); return T[T.length - 1][1]; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const am = E.accommodation(V.age), A = am[V.who], K = V.rx, add = V.add, dem = 1 / V.d;
        const x0 = 16, x1 = W - 16, X = p => x0 + (x1 - x0) * clamp(p, 0, 16) / 16;
        const pn = A - K + add, pf = Math.max(0, -K + add), has = pn > pf + 1e-9;
        // the ruler of proximity
        const yR = 44, hR = 30;
        c.fillStyle = C.bg2; c.fillRect(x0, yR, x1 - x0, hR);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(x0 + 0.5, yR + 0.5, x1 - x0 - 1, hR - 1);
        for (const [p, name] of [[0, '∞'], [1, '1 m'], [2, '50 cm'], [3, '33 cm'], [4, '25 cm'], [5, '20 cm'], [7, '14 cm'], [10, '10 cm'], [14, '7 cm']]) {
          c.strokeStyle = C.faint; c.beginPath(); c.moveTo(X(p), yR - 4); c.lineTo(X(p), yR); c.stroke();
          kit.label(c, name, X(p), yR - 11, { align: p === 0 ? 'left' : 'center', size: 10.5, color: C.muted });
        }
        for (let p = 0; p <= 16; p += 2) { c.strokeStyle = C.faint; c.beginPath(); c.moveTo(X(p), yR + hR); c.lineTo(X(p), yR + hR + 4); c.stroke(); kit.label(c, p + (p === 16 ? ' D' : ''), X(p), yR + hR + 13, { align: p === 0 ? 'left' : 'center', size: 10.5, color: C.muted }); }
        if (has) {
          const lo2 = E.accommodation(V.age).min - K + add, hi2 = E.accommodation(V.age).max - K + add;
          c.fillStyle = S.glass(0.16); c.fillRect(X(pf), yR + 2, X(Math.max(pf, hi2)) - X(pf), hR - 4);
          c.fillStyle = C.accent; c.globalAlpha = 0.5; c.fillRect(X(pf), yR + 5, X(pn) - X(pf), hR - 10); c.globalAlpha = 1;
          kit.label(c, 'in focus', (X(pf) + X(pn)) / 2, yR + hR / 2, { align: 'center', size: 11, color: C.text, weight: 650 });
        } else kit.label(c, 'nothing is in focus without effort', (x0 + x1) / 2, yR + hR / 2, { align: 'center', size: 11, color: C.warn });
        const inside = has && dem >= pf - 1e-9 && dem <= pn + 1e-9, mk = inside ? C.ok : C.bad;
        c.strokeStyle = mk; c.lineWidth = 2.5; c.beginPath(); c.moveTo(X(dem), yR - 2); c.lineTo(X(dem), yR + hR + 2); c.stroke();
        kit.label(c, 'the page, ' + dist(V.d), X(dem), yR + hR + 28, { align: dem > 12 ? 'right' : 'center', size: 11, color: mk, weight: 650 });
        // the text as it is seen
        const e = dem - pn, blurMrad = e > 0 ? e * 3 : 0, letterMrad = 1.4 / V.d, rad = blurMrad / 2 / letterMrad * 12;
        c.fillStyle = C.surface; c.fillRect(x0, Hh - 66, x1 - x0, 58);
        blurText(c, 'Reading small print at ' + dist(V.d), (x0 + x1) / 2, Hh - 45, { size: 20, color: C.text, weight: 600 }, rad);
        kit.label(c, 'the print as the eye sees it (print 1.4 mm high letters)', (x0 + x1) / 2, Hh - 17, { align: 'center', size: 10.5, color: C.faint });
        // read-outs
        const near = pn > 0 ? 1 / pn : Infinity, far = pf > 1e-9 ? 1 / pf : Infinity, res = pn - dem;
        ro.set('A', fx(A, 1) + ' D  (the range at this age: ' + fx(am.min, 1) + ' to ' + fx(am.max, 1) + ' D)');
        ro.set('near', has ? dist(near) : 'none');
        ro.set('far', has ? dist(far) : 'none');
        ro.set('dem', fx(dem, 2) + ' D');
        ro.set('res', res >= 0 ? fx(res, 2) + ' D' + (A > 0 ? ' (' + Math.round(100 * Math.min(1, res / Math.max(A, 0.01))) + ' % of the amplitude)' : '') : 'none: short by ' + fx(-res, 2) + ' D');
        ro.set('say', !inside ? 'blurred: it lies ' + (dem > pn ? 'inside the near point' : 'beyond the far point') : (res < A / 2 - 1e-9 ? 'sharp, but more than half the effort is in use' : 'sharp, with half the amplitude or more in reserve'));
        ro.set('add', fx(Math.ceil(Math.max(0, dem - A / 2) * 4 - 1e-9) / 4, 2) + ' D  (the demand less half the amplitude, for an eye corrected for distance)');
        ro.set('tab', V.age < 38 ? 'no addition' : '+' + fx(Math.round(tableAdd(V.age) * 4) / 4, 2) + ' D  (a typical value for the age, not a measurement)');
        plot.set({ series, hlines: [{ y: dem, label: 'demand' }], vlines: [{ x: V.age, label: 'age' }], marks: [{ x: V.age, y: A, label: fx(A, 1) + ' D' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 4 · colour-vision deficiency */
  const PALETTES = {
    typical: { names: ['red', 'green', 'orange', 'brown', 'blue', 'purple'], rgb: [[214, 45, 32], [40, 150, 60], [240, 130, 30], [130, 80, 40], [30, 100, 190], [140, 70, 160]] },
    safe: { names: ['vermilion', 'sky blue', 'bluish green', 'orange', 'blue', 'reddish purple'], rgb: [[213, 94, 0], [86, 180, 233], [0, 158, 115], [230, 159, 0], [0, 114, 178], [204, 121, 167]] }
  };
  const MAPLINES = [
    [[0.06, 0.28], [0.40, 0.28], [0.52, 0.40], [0.94, 0.40]], [[0.06, 0.35], [0.36, 0.35], [0.48, 0.47], [0.94, 0.47]],
    [[0.06, 0.62], [0.30, 0.62], [0.44, 0.76], [0.94, 0.76]], [[0.06, 0.69], [0.26, 0.69], [0.40, 0.83], [0.94, 0.83]],
    [[0.22, 0.10], [0.22, 0.92]], [[0.70, 0.10], [0.70, 0.92]]
  ];
  const PLATES = {
    rg: { fig: [[232, 120, 70], [220, 140, 90], [240, 150, 100], [205, 120, 80]], gnd: [[120, 165, 80], [145, 170, 90], [130, 150, 70], [110, 155, 95]], name: 'a red–green plate' },
    by: { fig: [[70, 160, 200], [60, 150, 190], [90, 170, 205]], gnd: [[110, 170, 150], [100, 165, 145], [125, 175, 160]], name: 'a blue–green plate' }
  };
  let DOTS = null;
  function plateDots() {
    if (DOTS) return DOTS;
    let s = 20260930; const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
    const sp = 0.058, out = [];
    const inTri = (x, y) => { const ax = 0, ay = 0.56, bx = -0.52, by = -0.40, cx = 0.52, cy = -0.40, d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy), l1 = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / d, l2 = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / d; return l1 >= 0 && l2 >= 0 && l1 + l2 <= 1; };
    for (let j = -18; j <= 18; j++) for (let i = -18; i <= 18; i++) {
      const x = (i + (j & 1) * 0.5) * sp + (rnd() - 0.5) * sp * 0.4, y = j * sp * 0.866 + (rnd() - 0.5) * sp * 0.4;
      if (x * x + y * y > 0.94 * 0.94) continue;
      out.push({ x, y, r: sp * (0.30 + 0.17 * rnd()), inside: inTri(x, y), k: Math.floor(rnd() * 4), j: 0.86 + 0.28 * rnd() });
    }
    DOTS = out;
    return out;
  }
  Hyper.sim('re-cvd', {
    title: 'Colour-vision deficiency: as designed and as it may be seen',
    blurb: `The same picture twice. On the left it is as designed; on the right every colour has been passed through a standard simulation of one kind of colour-vision deficiency (the model of Machado, Oliveira and Fernandes, 2009). **Protan** and **deutan** are the red–green forms (the L and the M cones); **tritan** is the rare blue–yellow form. A severity below 1 stands for the milder, anomalous kinds, where the pigment is present but shifted. The picture is an approximation on a screen: how colours look to a person with a deficiency varies from one person to the next and is not the same as these pictures.

**Try this**
- On the transit map choose **deutan** with the usual palette: the red and green lines, which run side by side, lose their difference and the orange and brown lines come together. The letters on the lines are the redundant cue that still works.
- Switch to the **colour-safe palette** (a set chosen to stay distinct for most kinds of deficiency): the closest pair of lines stays far apart. The read-out gives the colour difference of the closest pair, in CIELAB units; a difference of about 2 is just noticeable, and a difference near 10 or below makes two lines hard to tell apart.
- Look at the **red–green plate**: a shape made of orange dots on a field of green ones. With the setting at *protan* or *deutan* the shape sinks into the background, because the two sets of dots differ in hue and hardly at all in lightness. The blue–green plate does the same under *tritan*.
- Choose **achromatopsia**: only lightness is left. The map keeps its shape only where the lines differ in lightness.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour, E = O.eye;
      bindDraw(S);
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Kind', options: [['Deutan: M cones (red–green)', 'deutan'], ['Protan: L cones (red–green)', 'protan'], ['Tritan: S cones (blue–yellow)', 'tritan'], ['Achromatopsia: no colour', 'achroma']], value: params.type || 'deutan' },
        { id: 'sev', label: 'Severity (1 = the strongest form)', min: 0, max: 1, step: 0.05, value: params.sev != null ? params.sev : 1, fmt: v => v.toFixed(2) },
        { id: 'scene', type: 'select', label: 'Picture', options: [['A transit map', 'map'], ['A red–green plate', 'rg'], ['A blue–green plate', 'by']], value: params.scene || 'map' },
        { id: 'pal', type: 'select', label: 'Palette of the map', options: [['The usual: red, green, orange, brown, blue, purple', 'typical'], ['A colour-safe set', 'safe']], value: params.pal || 'typical' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['kind', 'Kind and how common'], ['pig', 'The pigment involved'], ['de', 'Closest pair, as designed → as seen (ΔE in CIELAB)'], ['note', 'Remember']]);
      const tr = rgb => Cl.cvd(rgb, V.type, V.sev);
      function drawMap(c, C, x, y, w, h, T) {
        const pal = PALETTES[V.pal], lh = 30, mh = h - lh - 14, lw = 5;
        const P = (u, v) => [x + 8 + (w - 16) * u, y + 20 + mh * v * 0.98];
        MAPLINES.forEach((ln, i) => {
          const col = css(T(pal.rgb[i]));
          c.save(); c.strokeStyle = col; c.lineWidth = lw; c.lineJoin = 'round'; c.lineCap = 'round';
          path(c, ln.map(p => P(p[0], p[1])), false); c.stroke(); c.restore();
        });
        // stations where the lines cross and at the line ends
        for (const [u, v] of [[0.22, 0.28], [0.22, 0.35], [0.22, 0.62], [0.22, 0.69], [0.70, 0.40], [0.70, 0.47], [0.70, 0.76], [0.70, 0.83], [0.52, 0.40], [0.48, 0.47]]) {
          const p = P(u, v); c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.4; c.beginPath(); c.arc(p[0], p[1], 3.4, 0, TAU); c.fill(); c.stroke();
        }
        MAPLINES.forEach((ln, i) => {
          const p = P(ln[0][0], ln[0][1]), col = css(T(pal.rgb[i]));
          c.fillStyle = col; c.beginPath(); c.arc(p[0], p[1] - (i >= 4 ? 8 : 0), 9, 0, TAU); c.fill();
          const lum = 0.3 * T(pal.rgb[i])[0] + 0.59 * T(pal.rgb[i])[1] + 0.11 * T(pal.rgb[i])[2];
          kit.label(c, 'ABCDEF'[i], p[0], p[1] - (i >= 4 ? 8 : 0), { align: 'center', size: 11, weight: 700, color: lum > 150 ? '#111' : '#fff' });
        });
        // legend
        const cw = (w - 16) / 6;
        pal.rgb.forEach((rgb, i) => {
          c.fillStyle = css(T(rgb)); c.fillRect(x + 8 + i * cw, y + h - lh, cw - 4, 10);
          kit.label(c, 'ABCDEF'[i] + ' ' + pal.names[i], x + 8 + i * cw + (cw - 4) / 2, y + h - lh + 20, { align: 'center', size: 9.5, color: C.muted });
        });
      }
      function drawPlate(c, C, x, y, w, h, T) {
        const pl = PLATES[V.scene], R = Math.min(w, h - 18) / 2 - 4, cx = x + w / 2, cy = y + 14 + (h - 14) / 2;
        c.fillStyle = C.bg2; c.beginPath(); c.arc(cx, cy, R * 1.0, 0, TAU); c.fill();
        for (const d of plateDots()) {
          const set = d.inside ? pl.fig : pl.gnd, base = set[d.k % set.length];
          c.fillStyle = css(T([base[0] * d.j, base[1] * d.j, base[2] * d.j]));
          c.beginPath(); c.arc(cx + d.x * R, cy - d.y * R, Math.max(0.6, d.r * R), 0, TAU); c.fill();
        }
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, gap = 8, pw = (W - 3 * gap) / 2, ph = Hh - 2 * gap;
        for (let k = 0; k < 2; k++) {
          const x = gap + k * (pw + gap), y = gap, T = k ? tr : (rgb => rgb);
          panel(c, C, x, y, pw, ph, k ? 'as it may look ' + (V.type === 'achroma' ? 'with no colour vision' : 'to a person with a ' + V.type + ' deficiency') : 'as designed');
          c.save(); c.beginPath(); c.rect(x + 1, y + 1, pw - 2, ph - 2); c.clip();
          if (V.scene === 'map') drawMap(c, C, x, y, pw, ph, T); else drawPlate(c, C, x, y, pw, ph, T);
          c.restore();
        }
        const info = Cl.CVD_INFO.find(i => i.id === V.type) || Cl.CVD_INFO[0];
        ro.set('kind', info.name + ' · ' + info.share);
        ro.set('pig', V.type === 'protan' ? 'long-wave cones, peak near ' + E.CONES.L + ' nm' : V.type === 'deutan' ? 'medium-wave cones, peak near ' + E.CONES.M + ' nm' : V.type === 'tritan' ? 'short-wave cones, peak near ' + E.CONES.S + ' nm' : 'no working cones: only the rods (peak near ' + E.CONES.rod + ' nm)');
        if (V.scene === 'map') {
          const rgb = PALETTES[V.pal].rgb, nm = PALETTES[V.pal].names, a = {}, b = {};
          let best0 = [1e9, 0, 0], best1 = [1e9, 0, 0];
          for (let i = 0; i < 6; i++) { a[i] = Cl.labOfRgb(rgb[i]); b[i] = Cl.labOfRgb(tr(rgb[i])); }
          for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) { const d0 = Cl.deltaE(a[i], a[j]), d1 = Cl.deltaE(b[i], b[j]); if (d0 < best0[0]) best0 = [d0, i, j]; if (d1 < best1[0]) best1 = [d1, i, j]; }
          ro.set('de', fx(best0[0], 0) + ' → ' + fx(best1[0], 0) + '  (as seen the closest are ' + nm[best1[1]] + ' and ' + nm[best1[2]] + ')');
        } else {
          const pl = PLATES[V.scene], mean = (arr, T) => { const l = arr.map(r => Cl.labOfRgb(T(r))); return [0, 1, 2].map(i => l.reduce((s, v) => s + v[i], 0) / l.length); };
          const id = r => r;
          ro.set('de', fx(Cl.deltaE(mean(pl.fig, id), mean(pl.gnd, id)), 0) + ' → ' + fx(Cl.deltaE(mean(pl.fig, tr), mean(pl.gnd, tr)), 0) + '  (shape against background)');
        }
        ro.set('note', 'a simulation on a screen, not a record of any one person\'s sight; a colour-vision test measures it');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 5 · two eyes, one target */
  Hyper.sim('re-eyes-aligned', {
    title: 'Two eyes, one target: a turned eye and a developing sight',
    blurb: `A plan view of a person looking at a target. Both eyes should point at it; the angle between their lines of sight is the **convergence**. If one eye points somewhere else, the target falls on a different part of that eye's retina, and the brain receives two pictures that do not match. The size of a turn is given in **prism dioptres** (Δ): 1 Δ moves an image by 1 cm at 1 m, an angle of 0.57°. The curves below are a schematic of how sight develops in a child and what happens to an eye that is turned and ignored during the sensitive period.

**Try this**
- Set the turn to **+20 Δ** (inward) at 40 cm. The turned eye points 11.3° beyond where an aligned eye would, and a second image of the target appears 11.3° from the first. Move the target out to 6 m: the aligned eyes are nearly parallel, but the turn is still 11.3°.
- Slide the turn through zero to **−20 Δ**: the eye now turns outward. Which side of the first image does the second one appear on?
- Raise *how completely the brain ignores the turned eye*: the second image fades (the brain suppresses it, which stops the double vision) — and in the curves below the sight of that eye stops developing. The cost of that quiet is a weaker eye.
- Move the *age at which the eye starts to turn* later than 8 years: the loss shrinks, because the sensitive period has closed. This is a schematic, not a prediction for any child.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      bindDraw(S);
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const plot = kit.plot(box.stage, { x: { label: 'age (years)', name: 'age', min: 0, max: 10 }, y: { label: 'acuity (c/°)', name: 'acuity', min: 0, max: 32 }, series: [] }, 170);
      const IPD = 63;
      const ctl = kit.controls(box.side, [
        { id: 'dev', label: 'The turned eye: how far it points off the target', min: -30, max: 40, step: 1, value: params.dev != null ? params.dev : 20, fmt: v => v === 0 ? 'straight, 0 Δ' : Math.abs(v) + ' Δ ' + (v > 0 ? 'inward' : 'outward') },
        { id: 'd', type: 'select', label: 'Distance to the target', options: [['33 cm', 0.33], ['40 cm', 0.4], ['1 m', 1], ['6 m', 6]], value: params.d || 0.4 },
        { id: 'fix', type: 'select', label: 'The eye that fixes the target', options: [['The left eye', 'L'], ['The right eye', 'R']], value: params.fix || 'L' },
        { id: 'supp', label: 'How completely the brain ignores the turned eye', min: 0, max: 1, step: 0.05, value: params.supp != null ? params.supp : 0.8, fmt: v => Math.round(v * 100) + ' %' },
        { id: 'onset', label: 'Age at which the eye starts to turn', min: 0.5, max: 10, step: 0.5, value: params.onset || 2, unit: 'years' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['turn', 'The turn'], ['conv', 'An aligned pair of eyes converges by'], ['pt', 'The turned eye points'], ['img', 'The second image is'], ['a8', 'Acuity at 8 years: fixing eye · turned eye']]);
      const g = t => 30 - 29 * Math.exp(-Math.min(t, 8) / 1.2);
      const amb = t => g(t) * (1 - 0.75 * V.supp * clamp((Math.min(t, 8) - V.onset) / 2.5, 0, 1));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, gap = 8;
        const th = Math.atan(V.dev / 100), alpha = Math.atan(IPD / 2 / (V.d * 1000));
        const lw = Math.round(W * 0.58) - gap, ph = Hh - 2 * gap;
        panel(c, C, gap, gap, lw, ph, 'seen from above');
        const cx = gap + lw / 2, sep = Math.min(lw * 0.42, 190), r = sep * 12 / IPD, ye = Hh - gap - r - 30, top = gap + 22;
        const eyes = [['L', cx - sep / 2, -1], ['R', cx + sep / 2, 1]];
        c.save(); c.beginPath(); c.rect(gap + 1, gap + 1, lw - 2, ph - 2); c.clip();
        for (const [id, ex, side] of eyes) {
          const turned = id !== V.fix, inward = alpha + (turned ? th : 0);
          // direction of the line of sight: straight ahead is up the picture; inward is towards the nose, the midline
          const dir = a => [-side * Math.sin(a), -Math.cos(a)];
          const dA = dir(alpha), dS = dir(inward), len = (ye - top) * 1.0 / Math.max(0.2, Math.cos(inward));
          if (turned && Math.abs(th) > 1e-6) strokeLine(c, [[ex, ye], [ex + dA[0] * len, ye + dA[1] * len]], C.faint, 1, [4, 4]);
          strokeLine(c, [[ex, ye], [ex + dS[0] * len, ye + dS[1] * len]], turned ? C.bad : C.accent, 2.2);
          // the eye: a ball with its cornea facing along the line of sight
          c.fillStyle = C.dark ? 'rgba(235,238,250,0.14)' : 'rgba(255,255,255,0.9)'; c.strokeStyle = C.text; c.lineWidth = 1.4;
          c.beginPath(); c.arc(ex, ye, r, 0, TAU); c.fill(); c.stroke();
          const ax = Math.atan2(dS[1], dS[0]);
          c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.arc(ex, ye, r * 1.0, ax - 0.35, ax + 0.35); c.stroke();
          kit.label(c, id === 'L' ? 'left eye' : 'right eye', ex, ye + r + 14, { align: 'center', size: 11, color: turned ? C.bad : C.text });
          if (turned && Math.abs(th) > 1e-6) { const a0 = Math.atan2(dA[1], dA[0]), a1 = Math.atan2(dS[1], dS[0]); S.angle(c, ex, ye, r * 2.1 + 6, a0, a1, '', { color: C.warn }); }
        }
        c.restore();
        kit.label(c, 'target, ' + dist(V.d) + ' away, straight ahead', cx, top - 4, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'blue: fixing eye · red: turned eye', cx, Hh - gap - 6, { align: 'center', size: 10.5, color: C.faint });
        // what the two eyes report: the target seen by each, in the visual field
        const rx0 = gap + lw + gap, rw = W - rx0 - gap;
        panel(c, C, rx0, gap, rw, ph, 'both eyes open: the target in the visual field');
        const R = Math.min(rw / 2 - 14, ph / 2 - 30), fcx = rx0 + rw / 2, fcy = gap + ph / 2 + 4, px = deg => deg / 25 * R;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.arc(fcx, fcy, R, 0, TAU); c.moveTo(fcx - R, fcy); c.lineTo(fcx + R, fcy); c.moveTo(fcx, fcy - R); c.lineTo(fcx, fcy + R); c.stroke();
        // a turned-in eye sees the target on its temporal side: to the right for the right eye
        const sgn = (V.fix === 'L' ? 1 : -1), off = px(sgn * th * R2D);
        const target = (x, y, alpha2, col) => { c.save(); c.globalAlpha = alpha2; c.strokeStyle = col; c.lineWidth = 2.6; c.beginPath(); c.arc(x, y, 9, 0, TAU); c.stroke(); c.fillStyle = col; c.beginPath(); c.arc(x, y, 3, 0, TAU); c.fill(); c.restore(); };
        target(fcx, fcy, 1, C.accent);
        if (Math.abs(th) > 1e-6) target(fcx + off, fcy, Math.max(0.1, 1 - V.supp), C.bad);
        kit.label(c, 'from the fixing eye', fcx, fcy + R + 12, { align: 'center', size: 10.5, color: C.accent });
        if (Math.abs(th) > 1e-6) kit.label(c, 'from the turned eye', fcx + clamp(off, -R * 0.6, R * 0.6), fcy - 20, { align: 'center', size: 10.5, color: C.bad });
        kit.label(c, 'field ±25°', fcx, fcy - R - 8, { align: 'center', size: 10, color: C.faint });
        // read-outs and the curves
        const thd = th * R2D;
        ro.set('turn', Math.abs(V.dev) < 1 ? 'none: the eyes are straight' : fx(Math.abs(thd), 1) + '° = ' + Math.abs(V.dev) + ' prism dioptres, ' + (V.dev > 0 ? 'inward (an esotropia)' : 'outward (an exotropia)'));
        ro.set('conv', fx(2 * alpha * R2D, 2) + '° in all (' + fx(alpha * R2D, 2) + '° each), for a 63 mm eye separation');
        ro.set('pt', Math.abs(V.dev) < 1 ? 'at the target' : fx(Math.abs(alpha + th) * R2D, 1) + '° ' + (alpha + th >= 0 ? 'inward of straight ahead' : 'outward of straight ahead') + ' — the target is ' + fx(Math.abs(thd), 1) + '° off its axis');
        ro.set('img', Math.abs(V.dev) < 1 ? 'one image' : V.supp < 0.15 ? fx(Math.abs(thd), 1) + '° away and clearly seen: double vision' : V.supp > 0.85 ? 'suppressed: the brain takes no notice of it' : V.supp > 0.6 ? 'mostly ignored' : 'half noticed: fading');
        const a8 = g(8), b8 = amb(8);
        ro.set('a8', acu(Math.round(20 * 30 / a8)) + ' · ' + acu(Math.round(20 * 30 / b8)) + '  (schematic)');
        const pts1 = [], pts2 = [];
        for (let t = 0; t <= 10.001; t += 0.25) { pts1.push([t, g(t)]); pts2.push([t, amb(t)]); }
        plot.set({ series: [{ pts: pts1, label: 'fixing eye' }, { pts: pts2, label: 'turned eye', dash: [5, 3] }], vlines: [{ x: V.onset, label: 'turn starts' }, { x: 8, label: 'about 8' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 6 · cataract */
  const CNX = 120, CNY = 80;
  const lumOf = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  /* a dusk street in linear light (values above 1 are lamps): the same scene is blurred, veiled and yellowed by a clouded lens */
  function duskScene(glare) {
    const out = new Float32Array(CNX * CNY * 3);
    const disc = (u, v, cu, cv, r) => (u - cu) * (u - cu) * 2.25 + (v - cv) * (v - cv) < r * r;
    for (let j = 0; j < CNY; j++) for (let i = 0; i < CNX; i++) {
      const u = (i + 0.5) / CNX, v = (j + 0.5) / CNY;
      let c;
      if (v < 0.58) { const t = v / 0.58; c = [0.05 + 0.5 * t * t, 0.07 + 0.22 * t * t, 0.16 + 0.04 * t - 0.05 * t * t]; }
      else {
        c = [0.045, 0.045, 0.055];
        if (Math.abs(u - 0.5) < 0.012 + 0.03 * (v - 0.58) && ((Math.floor((v - 0.58) * 30) % 2) === 0)) c = [0.5, 0.5, 0.45];
      }
      // buildings with lit windows
      for (const [b0, b1, top] of [[0, 0.17, 0.2], [0.17, 0.33, 0.32], [0.62, 0.74, 0.28], [0.84, 1, 0.16]]) {
        if (u >= b0 && u < b1 && v >= top && v < 0.58) {
          c = [0.035, 0.035, 0.05];
          const wu = (u - b0) / (b1 - b0), wv = (v - top) / (0.58 - top);
          if ((Math.floor(wu * 5) + Math.floor(wv * 7) * 3) % 5 < 2 && (wu * 5) % 1 > 0.25 && (wu * 5) % 1 < 0.75 && (wv * 7) % 1 > 0.3 && (wv * 7) % 1 < 0.8) c = [1.0, 0.8, 0.4];
        }
      }
      // a traffic light: dark case, three lamps (red lit)
      if (u > 0.285 && u < 0.315 && v > 0.22 && v < 0.43) {
        c = [0.02, 0.02, 0.02];
        if (disc(u, v, 0.3, 0.255, 0.026)) c = [3.2, 0.12, 0.08]; else if (disc(u, v, 0.3, 0.325, 0.026)) c = [0.12, 0.08, 0.02]; else if (disc(u, v, 0.3, 0.395, 0.026)) c = [0.02, 0.1, 0.06];
      }
      if (u > 0.296 && u < 0.304 && v >= 0.43 && v < 0.62) c = [0.03, 0.03, 0.03];
      // a street lamp
      if (u > 0.776 && u < 0.784 && v >= 0.22 && v < 0.62) c = [0.03, 0.03, 0.04];
      if (disc(u, v, 0.78, 0.2, 0.03)) c = [9, 8, 5.5];
      // a sign of black and white bars, to measure contrast on
      if (u > 0.06 && u < 0.28 && v > 0.7 && v < 0.94) { const k = Math.floor((u - 0.06) / 0.22 * 11); c = k % 2 ? [0.02, 0.02, 0.02] : [0.85, 0.85, 0.82]; }
      if (glare && (disc(u, v, 0.43, 0.66, 0.02) || disc(u, v, 0.53, 0.66, 0.02))) c = [14, 14, 11];
      const k3 = (j * CNX + i) * 3; out[k3] = c[0]; out[k3 + 1] = c[1]; out[k3 + 2] = c[2];
    }
    return out;
  }
  function boxBlur(src, nx, ny, r) {
    if (r < 1) return src;
    const tmp = new Float32Array(src.length), out = new Float32Array(src.length), w = 2 * r + 1, ci = (x, n) => x < 0 ? 0 : x >= n ? n - 1 : x;
    for (let y = 0; y < ny; y++) for (let ch = 0; ch < 3; ch++) {
      let acc = 0; for (let x = -r; x <= r; x++) acc += src[(y * nx + ci(x, nx)) * 3 + ch];
      for (let x = 0; x < nx; x++) { tmp[(y * nx + x) * 3 + ch] = acc / w; acc += src[(y * nx + ci(x + r + 1, nx)) * 3 + ch] - src[(y * nx + ci(x - r, nx)) * 3 + ch]; }
    }
    for (let x = 0; x < nx; x++) for (let ch = 0; ch < 3; ch++) {
      let acc = 0; for (let y = -r; y <= r; y++) acc += tmp[(ci(y, ny) * nx + x) * 3 + ch];
      for (let y = 0; y < ny; y++) { out[(y * nx + x) * 3 + ch] = acc / w; acc += tmp[(ci(y + r + 1, ny) * nx + x) * 3 + ch] - tmp[(ci(y - r, ny) * nx + x) * 3 + ch]; }
    }
    return out;
  }
  const gaussR = sg => Math.max(0, Math.round((Math.sqrt(4 * sg * sg + 1) - 1) / 2));
  function gauss(src, nx, ny, sg) { let a = src; const r = gaussR(sg); for (let k = 0; k < 3; k++) a = boxBlur(a, nx, ny, r); return a; }
  /* the scene as a clouded lens passes it: forward scatter blurs it, the bright lamps spill light over everything, the lens absorbs blue */
  function cataractView(base, density, yellow) {
    const n = CNX * CNY, blur = gauss(base, CNX, CNY, 3.0 * density), exc = new Float32Array(n * 3);
    let mean = 0;
    for (let k = 0; k < n * 3; k++) { exc[k] = Math.max(0, base[k] - 1.2); }
    for (let k = 0; k < n; k++) mean += lumOf(base[3 * k], base[3 * k + 1], base[3 * k + 2]);
    mean /= n;
    const halo = gauss(exc, CNX, CNY, 9), hh = 0.9 * Math.pow(density, 1.2), veil = 0.35 * density * mean;
    const out = new Float32Array(n * 3);
    for (let k = 0; k < n; k++) {
      let r = blur[3 * k] * (1 - 0.3 * density) + hh * halo[3 * k] + veil, g = blur[3 * k + 1] * (1 - 0.3 * density) + hh * halo[3 * k + 1] + veil, b = blur[3 * k + 2] * (1 - 0.3 * density) + hh * halo[3 * k + 2] + veil;
      r *= 1 - 0.05 * yellow; g *= 1 - 0.28 * yellow; b *= 1 - 0.78 * yellow;
      out[3 * k] = r; out[3 * k + 1] = g; out[3 * k + 2] = b;
    }
    return out;
  }
  const tone = v => 255 * Math.pow(clamp(v * 1.5, 0, 1), 1 / 2.2);
  function regionStats(arr, u0, u1, v0, v1) {
    let mn = 1e9, mx = -1e9, sum = 0, cnt = 0;
    for (let j = Math.floor(v0 * CNY); j < Math.ceil(v1 * CNY); j++) for (let i = Math.floor(u0 * CNX); i < Math.ceil(u1 * CNX); i++) {
      const l = lumOf(arr[(j * CNX + i) * 3], arr[(j * CNX + i) * 3 + 1], arr[(j * CNX + i) * 3 + 2]); mn = Math.min(mn, l); mx = Math.max(mx, l); sum += l; cnt++;
    }
    return { mn, mx, mean: sum / Math.max(1, cnt), contrast: (mx - mn) / Math.max(1e-9, mx + mn) };
  }
  Hyper.sim('re-cataract', {
    title: 'Cataract: a lens that scatters and yellows',
    blurb: `The same dusk street twice: on the left through a clear lens, on the right through a lens that has become cloudy. A cataract does three things to the light, and they are drawn here separately in the controls. It **scatters** light forward, so that fine detail blurs and a bright lamp is surrounded by a halo; it **veils** the whole view, so that dark areas turn grey; and it **absorbs** short wavelengths, so that whites go yellow and blues dull. The picture is a model of the optics, made from a small drawing of a scene; it is not a record of what anyone sees.

**Try this**
- Press *Early* and then *Advanced*. Watch the black and white bars on the sign: the read-out gives the contrast between them (Michelson contrast, the difference over the sum of the brightest and darkest parts) before and after.
- Switch the **oncoming headlights** on and off. With a milder lens the glare around them is small; with an advanced one it floods the road. This is why night driving is often the first thing to become hard.
- Turn the opacity down and the yellowing up: the view stays sharp but warm. Colour matching and blues suffer without any loss of sharpness.
- Look at the red traffic light and at the dark road at the lower right: the scattered light lifts the road from black towards grey, which is the veil that spoils contrast.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      bindDraw(S);
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 240 });
      const ctl = kit.controls(box.side, [
        { id: 'dens', label: 'Cloudiness of the lens (scatter and veil)', min: 0, max: 1, step: 0.05, value: params.dens != null ? params.dens : 0.5, fmt: v => Math.round(v * 100) + ' %' },
        { id: 'yel', label: 'Yellowing of the lens', min: 0, max: 1, step: 0.05, value: params.yel != null ? params.yel : 0.4, fmt: v => Math.round(v * 100) + ' %' },
        { id: 'glare', type: 'check', label: 'Oncoming headlights', value: params.glare != null ? params.glare : true },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear lens' }, { id: 'early', label: 'Early' }, { id: 'adv', label: 'Advanced', primary: true }] }
      ], id => {
        if (id === 'clear') { ctl.set('dens', 0); ctl.set('yel', 0); }
        else if (id === 'early') { ctl.set('dens', 0.25); ctl.set('yel', 0.2); }
        else if (id === 'adv') { ctl.set('dens', 0.8); ctl.set('yel', 0.7); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['con', 'Contrast of the bars on the sign: clear → this lens'], ['dark', 'Brightness of the dark road at lower right: clear → this lens'], ['blue', 'Blue light passing the lens'], ['say', 'What it does']]);
      let memo = { key: '', base: null, view: null, clear: null };
      function update() {
        const key = (V.glare ? 'g' : 'n') + '|' + V.dens.toFixed(2) + '|' + V.yel.toFixed(2);
        if (memo.key === key) return memo;
        if (!memo.base || memo.g !== V.glare) { memo.base = duskScene(V.glare); memo.g = V.glare; memo.clear = cataractView(memo.base, 0, 0); }
        memo.view = cataractView(memo.base, V.dens, V.yel); memo.key = key;
        return memo;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, gap = 8, pw = (W - 3 * gap) / 2, ph = Hh - 2 * gap, M = update();
        for (let k = 0; k < 2; k++) {
          const x = gap + k * (pw + gap), arr = k ? M.view : M.clear;
          S.image(c, x, gap, pw, ph, CNX, CNY, (u, v) => { const o = (Math.min(CNY - 1, Math.floor(v * CNY)) * CNX + Math.min(CNX - 1, Math.floor(u * CNX))) * 3; return [tone(arr[o]), tone(arr[o + 1]), tone(arr[o + 2])]; }, { key: M.key + '|' + k, id: k ? 'seen' : 'clear' });
          c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(x + 0.5, gap + 0.5, pw - 1, ph - 1);
          kit.label(c, k ? 'through a clouded lens' : 'through a clear lens', x + 8, gap + 12, { align: 'left', size: 11, color: '#fff', weight: 650, bg: 'rgba(0,0,0,0.45)' });
        }
        const s0 = regionStats(M.clear, 0.07, 0.27, 0.72, 0.92), s1 = regionStats(M.view, 0.07, 0.27, 0.72, 0.92);
        const d0 = regionStats(M.clear, 0.80, 0.90, 0.80, 0.90), d1 = regionStats(M.view, 0.80, 0.90, 0.80, 0.90);
        ro.set('con', fx(s0.contrast, 2) + ' → ' + fx(s1.contrast, 2));
        ro.set('dark', fx(d1.mean / Math.max(1e-6, d0.mean), 1) + ' times as bright');
        ro.set('blue', Math.round(100 * (1 - 0.78 * V.yel)) + ' % of normal');
        ro.set('say', V.dens < 0.05 && V.yel < 0.05 ? 'nothing: a clear lens passes the scene as it is' : V.dens > 0.6 ? 'detail is lost and lamps bloom: reading and night driving are hard' : V.dens > 0.2 ? 'contrast falls and glare grows' : 'a slight loss of contrast and a warmer tint');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 7 · glaucoma and the visual field */
  const smooth01 = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  /* sensitivity (dB; 32 in a healthy young eye at the centre, 0 = nothing seen) at (x, y) degrees of the field of one eye.
     eyeSign +1: a right eye, whose temporal side (and blind spot) is on the right of the picture. s: how far the loss has gone, 0…1.
     A schematic of an arcuate defect: a band that arches round the fixation point from the blind spot and stops at the horizontal
     midline on the nasal side (the nasal step), deepening and widening with s, and in the last stage a shrinking circle of vision. */
  function fieldSens(x, y, eyeSign, s, arcs, blind) {
    const ecc = Math.hypot(x, y), hill = 32 - 0.12 * ecc;
    if (blind && Math.pow((x - 15 * eyeSign) / 2.8, 2) + Math.pow((y + 1.5) / 3.8, 2) < 1) return 0;
    let dmg = 0;
    if (s > 0) for (const side of arcs) {
      const tx = x * eyeSign, ty = y * side, ang = Math.atan2(ty, tx);
      if (ty < 0 || ang < 0 || ang > PI) continue;
      const rc = 15 - 4 * ang / PI, hw = 1.5 + 6 * s, end = PI * (0.25 + 0.75 * clamp(s * 1.3, 0, 1));
      if (ang > end) continue;
      const band = 1 - smooth01((Math.abs(ecc - rc) - hw * 0.55) / (hw * 0.6)), taper = 1 - smooth01((ang - (end - 0.25)) / 0.25);
      dmg = Math.max(dmg, (6 + 30 * s) * band * (end > PI * 0.98 ? 1 : taper));
    }
    if (s > 0.6) { const tr = 30 - 22 * (s - 0.6) / 0.4; dmg = Math.max(dmg, 36 * smooth01((ecc - tr) / 5)); }
    return Math.max(0, hill - dmg);
  }
  Hyper.sim('re-glaucoma', {
    title: 'Glaucoma and the visual field: an arcuate defect',
    blurb: `Perimetry maps what each part of the visual field can see. On the left is the map of one eye as it is usually printed: **light** squares are places that see well, **dark** squares places that see poorly or not at all, with the fixation point in the middle and the physiological blind spot (where the optic nerve leaves the eye) 15° to the temporal side. In glaucoma the fibres of the optic nerve are lost in bundles, and because they arch round the centre the loss makes an **arcuate** band that starts at the blind spot and ends in a straight edge at the horizontal midline. On the right is a street scene with the field loss laid over it. The pictures are schematic: real fields differ in shape and depth, and a field test does not make a diagnosis on its own.

**Try this**
- Move the progress slider up from zero. The first sign is a shallow arc near the blind spot, with the centre untouched: a person at this stage usually notices nothing, because the other eye and the brain cover the gap.
- Switch the loss to **both arcs**, then take the progress to the end: a ring of lost field closes in and only a small central island is left, a *tunnel*. The child at the right edge of the scene disappears long before reading becomes difficult.
- Switch to the **left eye**: the map is a mirror image, with the blind spot on the left.
- Watch the read-outs: the number of test points with a marked loss grows long before the central 5° is touched, which is why sharp central acuity is no guide in glaucoma.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      bindDraw(S);
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 270 });
      const ctl = kit.controls(box.side, [
        { id: 'prog', label: 'How far the loss has gone', min: 0, max: 100, step: 5, value: params.prog != null ? params.prog : 55, unit: '%' },
        { id: 'where', type: 'select', label: 'Where the arcs are', options: [['In the upper field', 'up'], ['In the lower field', 'down'], ['Both arcs', 'both']], value: params.where || 'up' },
        { id: 'eye', type: 'select', label: 'The eye', options: [['Right eye', 1], ['Left eye', -1]], value: params.eye || 1 },
        { type: 'buttons', items: [{ id: 'e', label: 'Early' }, { id: 'm', label: 'Moderate', primary: true }, { id: 'a', label: 'Advanced' }] }
      ], id => {
        if (id === 'e') { ctl.set('prog', 25); ctl.set('where', 'up'); }
        else if (id === 'm') { ctl.set('prog', 55); ctl.set('where', 'up'); }
        else if (id === 'a') { ctl.set('prog', 100); ctl.set('where', 'both'); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pts', 'Test points with a marked loss'], ['mid', 'The middle 5°'], ['rad', 'Nearest test point with a marked loss'], ['say', 'What a person may notice']]);
      const grid = []; for (const gx of [-27, -21, -15, -9, -3, 3, 9, 15, 21, 27]) for (const gy of [-27, -21, -15, -9, -3, 3, 9, 15, 21, 27]) if (Math.hypot(gx, gy) <= 28) grid.push([gx, gy]);
      const arcsOf = () => V.where === 'up' ? [1] : V.where === 'down' ? [-1] : [1, -1];
      const sensAt = (x, y, blind) => fieldSens(x, y, +V.eye, V.prog / 100, arcsOf(), blind);
      function drawScene(c, C, x0, y0, w, h) {
        const pd = w / 70, X = d => x0 + (d + 35) * pd, Y = d => y0 + (26 - d) * (h / 52);
        c.save(); c.beginPath(); c.rect(x0, y0, w, h); c.clip();
        c.fillStyle = '#a8cfe8'; c.fillRect(x0, y0, w, Y(-5) - y0);
        c.fillStyle = '#7d9a72'; c.fillRect(x0, Y(-5), w, y0 + h - Y(-5));
        c.fillStyle = '#5d626b'; path(c, [[X(-3), Y(-5)], [X(3), Y(-5)], [X(26), y0 + h], [X(-26), y0 + h]], true); c.fill();
        // a stop sign at the point of fixation
        c.fillStyle = '#7a7f86'; c.fillRect(X(-0.5), Y(1), 1 * pd, 7 * pd * 0.8);
        c.fillStyle = '#c8342c'; c.beginPath(); for (let k = 0; k < 8; k++) { const a = TAU * (k + 0.5) / 8, px = X(0) + 4.2 * pd * Math.cos(a), py = Y(5) - 4.2 * pd * Math.sin(a); k ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); c.fill();
        kit.label(c, 'STOP', X(0), Y(5), { align: 'center', size: Math.max(8, 2.4 * pd), color: '#fff', weight: 800 });
        // a child at the right, a car at the left, a cone and a bird
        c.fillStyle = '#e8b422'; c.fillRect(X(22) - 1.2 * pd, Y(-4), 2.4 * pd, 4.5 * pd); c.fillStyle = '#e9c39b'; c.beginPath(); c.arc(X(22), Y(-3) - 0.2 * pd, 1.3 * pd, 0, TAU); c.fill();
        c.fillStyle = '#2f5fb8'; c.fillRect(X(-26), Y(-4), 7 * pd, 2.8 * pd); c.fillRect(X(-24.5), Y(-2) - 1 * pd, 4 * pd, 1.4 * pd); c.fillStyle = '#222'; c.beginPath(); c.arc(X(-25), Y(-6.2), 1 * pd, 0, TAU); c.arc(X(-20.5), Y(-6.2), 1 * pd, 0, TAU); c.fill();
        c.fillStyle = '#e8741c'; path(c, [[X(-11), Y(-9)], [X(-9.6), Y(-9)], [X(-10.3), Y(-13)]], true); c.fill();
        c.strokeStyle = '#333'; c.lineWidth = 1.6; path(c, [[X(11), Y(14.6)], [X(12.2), Y(14)], [X(13.4), Y(14.6)]], false); c.stroke();
        // the loss laid over the scene (the blind spot, which everyone has, is left out: the brain fills it in)
        const nx = 70, ny = 52;
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
          const gx = (i + 0.5) / nx * 70 - 35, gy = 26 - (j + 0.5) / ny * 52, norm = 32 - 0.12 * Math.hypot(gx, gy), loss = 1 - sensAt(gx, gy, false) / norm;
          if (loss > 0.03) { c.fillStyle = 'rgba(96,100,112,' + (0.93 * Math.pow(clamp(loss, 0, 1), 0.8)).toFixed(3) + ')'; c.fillRect(x0 + i * w / nx, y0 + j * h / ny, w / nx + 0.7, h / ny + 0.7); }
        }
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(0) - 5, Y(0)); c.lineTo(X(0) + 5, Y(0)); c.moveTo(X(0), Y(0) - 5); c.lineTo(X(0), Y(0) + 5); c.stroke();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, gap = 8;
        const mw = Math.round(W * 0.42), ph = Hh - 2 * gap, sw = W - mw - 3 * gap;
        // the printed map
        panel(c, C, gap, gap, mw, ph, 'the field of the ' + (+V.eye === 1 ? 'right' : 'left') + ' eye');
        const R = Math.min(mw / 2 - 16, ph / 2 - 26), cx = gap + mw / 2, cy = gap + ph / 2 + 8, P = d => d / 32 * R, sq = P(6);
        let bad = 0, midSum = 0, midN = 0, clearTo = 99;
        for (const [gx, gy] of grid) {
          const sv = sensAt(gx, gy, true), g8 = Math.round(235 * clamp(sv / 32, 0, 1));
          c.fillStyle = 'rgb(' + g8 + ',' + g8 + ',' + g8 + ')'; c.fillRect(cx + P(gx) - sq / 2, cy - P(gy) - sq / 2, sq + 0.6, sq + 0.6);
          if (sv < 0.55 * (32 - 0.12 * Math.hypot(gx, gy)) && !(Math.pow((gx - 15 * +V.eye) / 2.8, 2) + Math.pow((gy + 1.5) / 3.8, 2) < 1)) { bad++; clearTo = Math.min(clearTo, Math.hypot(gx, gy)); }
          if (Math.hypot(gx, gy) < 5.5) { midSum += sv; midN++; }
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, P(30), 0, TAU); c.moveTo(cx - P(30), cy); c.lineTo(cx + P(30), cy); c.moveTo(cx, cy - P(30)); c.lineTo(cx, cy + P(30)); c.stroke();
        for (const d of [10, 20]) { c.setLineDash([2, 3]); c.beginPath(); c.arc(cx, cy, P(d), 0, TAU); c.stroke(); c.setLineDash([]); kit.label(c, d + '°', cx + P(d) * 0.71 + 3, cy - P(d) * 0.71, { align: 'left', size: 9.5, color: C.muted }); }
        c.fillStyle = C.accent; c.beginPath(); c.arc(cx, cy, 2.6, 0, TAU); c.fill();
        kit.label(c, +V.eye === 1 ? 'nasal' : 'temporal', cx - P(30) - 2, cy - 8, { align: 'right', size: 10, color: C.muted });
        kit.label(c, +V.eye === 1 ? 'temporal' : 'nasal', cx + P(30) + 2, cy - 8, { align: 'left', size: 10, color: C.muted });
        kit.label(c, 'blind spot', cx + P(15) * +V.eye, cy + P(7), { align: 'center', size: 9.5, color: C.warn });
        // the scene with the loss
        panel(c, C, mw + 2 * gap, gap, sw, ph, '');
        const sh = Math.min(ph - 2, sw * 52 / 70), sy0 = gap + (ph - sh) / 2;
        drawScene(c, C, mw + 2 * gap + 1, sy0, sw - 2, sh);
        kit.label(c, 'the street (70° wide) with the loss', mw + 2 * gap + sw / 2, gap + ph - 6, { align: 'center', size: 10, color: C.faint, bg: C.surface });
        // read-outs
        const pct = Math.round(100 * bad / grid.length);
                ro.set('pts', bad + ' of ' + grid.length + ' (' + pct + ' %)');
        const midMean = midN ? midSum / midN : 0;
        ro.set('mid', midMean > 24 ? 'sees normally' : midMean > 12 ? 'reduced' : 'much reduced');
        ro.set('rad', bad === 0 ? 'none: every point is normal' : 'about ' + Math.round(clearTo) + '° from the centre');
        ro.set('say', V.prog < 12 ? 'nothing: the map is normal' : V.prog < 45 ? 'usually nothing: the other eye and the brain cover the gap' : V.prog < 80 ? 'little at first; something at the side may be missed, while reading is unaffected' : 'a tunnel: getting about and seeing in dim light can be hard even when letters are read clearly');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 8 · the macula: the Amsler grid and a central scotoma */
  Hyper.sim('re-macula', {
    title: 'Macular disease: a blind patch and bent lines',
    blurb: `The macula is the small area of the retina, about 5.5 mm across, that holds the fovea and gives sharp central vision. When it is damaged two things can happen at once. A **scotoma** is a patch of the field where nothing is seen; a **metamorphopsia** is a warping, so that straight lines look wavy or broken. The **Amsler grid** is a square of 20 × 20 small squares, each about 1° across when it is held at its usual distance, with a dot at the centre: looking at the dot with one eye at a time, a person with macular disease may see lines bend, fade or vanish near it. On the left is the grid as it might look; on the right a face and a line of print with the same patch laid over them. The picture is a schematic: the patch is not usually black, and its shape and place differ from person to person.

**Try this**
- Raise the **blind patch** to 3° and look at the face: the middle of it is gone, but its outline and the print beyond it are still there. This is why people with macular disease keep their sense of space and move about well, while reading and recognizing faces become hard.
- Raise the **bending** with the patch at zero: nothing is missing, but the lines of the grid and the letters of the print are bent. This warping is often the first thing noticed.
- Move the patch **off the centre**: a patch beside the fixation point blocks less of what you look at. Eccentric viewing uses this.
- Read the acuity at the edge of the patch: the nearest healthy retina is a few degrees out, where cones are much more sparse, so acuity falls to a fraction of its central value.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      bindDraw(S);
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 270 });
      const ctl = kit.controls(box.side, [
        { id: 'sco', label: 'Blind patch: its radius', min: 0, max: 8, step: 0.5, value: params.sco != null ? params.sco : 3, unit: '°' },
        { id: 'off', label: 'Blind patch: how far off the centre', min: -6, max: 6, step: 0.5, value: params.off || 0, unit: '°' },
        { id: 'wav', label: 'Bending of the lines', min: 0, max: 1, step: 0.05, value: params.wav != null ? params.wav : 0.5, fmt: v => Math.round(v * 100) + ' %' },
        { type: 'buttons', items: [{ id: 'norm', label: 'Normal' }, { id: 'early', label: 'Early: bending only' }, { id: 'late', label: 'Advanced', primary: true }] }
      ], id => {
        if (id === 'norm') { ctl.set('sco', 0); ctl.set('wav', 0); ctl.set('off', 0); }
        else if (id === 'early') { ctl.set('sco', 0); ctl.set('wav', 0.45); ctl.set('off', 0); }
        else if (id === 'late') { ctl.set('sco', 4); ctl.set('wav', 0.7); ctl.set('off', 0); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sq', 'Squares of the grid affected'], ['dia', 'The blind patch: across · on the retina'], ['acu', 'Acuity at its edge, from the nearest healthy retina'], ['say', 'What it does']]);
      const sig = () => Math.max(2.5, V.sco * 1.3);
      /* the warp of the grid at (x, y) in grid squares (1 square = 1° at the usual distance) */
      const warp = (x, y) => {
        if (V.wav < 0.01) return [x, y];
        const x0 = V.off * 0.6, s = sig(), G = Math.exp(-((x - x0) * (x - x0) + y * y) / (2 * s * s)), a = V.wav * 1.3;
        return [x + a * G * Math.sin(1.7 * y / s), y + a * G * Math.sin(1.7 * (x - x0) / s)];
      };
      const hidden = (x, y) => V.sco > 0.05 && Math.pow((x - V.off) / V.sco, 2) + Math.pow(y / V.sco, 2) < 1;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, gap = 8, pw = (W - 3 * gap) / 2, ph = Hh - 2 * gap;
        const cell = Math.min((pw - 16) / 20, (ph - 40) / 20);
        // the Amsler grid
        let ox = gap + pw / 2, oy = gap + ph / 2 + 8;
        panel(c, C, gap, gap, pw, ph, 'the Amsler grid, 20 × 20 squares');
        c.fillStyle = C.bg2; c.fillRect(ox - 10 * cell, oy - 10 * cell, 20 * cell, 20 * cell);
        c.strokeStyle = C.text; c.lineWidth = 1.1; c.globalAlpha = 0.85;
        for (let k = -10; k <= 10; k++) {
          const v = [], h = [];
          for (let t = -10; t <= 10.001; t += 0.5) { const a = warp(k, t), b = warp(t, k); v.push([ox + a[0] * cell, oy - a[1] * cell]); h.push([ox + b[0] * cell, oy - b[1] * cell]); }
          path(c, v, false); c.stroke(); path(c, h, false); c.stroke();
        }
        c.globalAlpha = 1;
        c.fillStyle = C.accent; c.beginPath(); c.arc(ox, oy, 3, 0, TAU); c.fill();
        // the blind patch: nothing is drawn where nothing is seen
        const patch = (cx0, cy0, sc, bg) => {
          if (V.sco < 0.05) return;
          const rpx = V.sco * sc, gr = c.createRadialGradient(cx0 + V.off * sc, cy0, rpx * 0.55, cx0 + V.off * sc, cy0, rpx * 1.15);
          gr.addColorStop(0, bg); gr.addColorStop(1, 'rgba(0,0,0,0)');
          c.save(); c.fillStyle = gr; c.beginPath(); c.arc(cx0 + V.off * sc, cy0, rpx * 1.15 + 1, 0, TAU); c.fill(); c.restore();
        };
        c.save(); c.beginPath(); c.rect(ox - 10 * cell, oy - 10 * cell, 20 * cell, 20 * cell); c.clip(); patch(ox, oy, cell, C.surface); c.restore();
        // the scene: a face and print, each glyph moved by the same warp
        const px0 = gap + pw + gap, cx = px0 + pw / 2, cy = gap + ph / 2 + 8;
        panel(c, C, px0, gap, pw, ph, 'a face and print, 1 square = 1°');
        c.fillStyle = C.surface; c.fillRect(px0 + 1, gap + 20, pw - 2, ph - 22);
        const W2 = (gx, gy) => { const w = warp(gx, gy); return [cx + w[0] * cell, cy - w[1] * cell]; };
        const face = []; for (let a = 0; a <= TAU + 0.01; a += 0.2) face.push(W2(5.6 * Math.cos(a), 5.6 * Math.sin(a) + 0.5));
        c.fillStyle = C.dark ? '#c9a98a' : '#e8c9a8'; path(c, face, true); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
        for (const ex of [-2, 2]) { const p = W2(ex, 2); c.fillStyle = '#222'; c.beginPath(); c.arc(p[0], p[1], Math.max(1.5, 0.45 * cell), 0, TAU); c.fill(); }
        const mouth = []; for (let a = 0.35 * PI; a <= 0.65 * PI + 0.01; a += 0.08) mouth.push(W2(3.6 * Math.cos(a + PI), 3.6 * Math.sin(a + PI) + 1.4)); c.strokeStyle = '#8a2a2a'; c.lineWidth = 2; path(c, mouth, false); c.stroke();
        const nose = [W2(0, 1.2), W2(-0.5, -0.4), W2(0.5, -0.4)]; c.strokeStyle = C.muted; c.lineWidth = 1.2; path(c, nose, false); c.stroke();
        const txt = (str, gy) => { const fs = Math.max(9, 1.5 * cell); for (let i = 0; i < str.length; i++) { const gx = (i - (str.length - 1) / 2) * 0.82, p = W2(gx, gy); kit.label(c, str[i], p[0], p[1], { align: 'center', size: fs, color: C.text, weight: 600 }); } };
        txt('Faces and print', -7.2); txt('lose their centre', -9.2);
        patch(cx, cy, cell, C.surface);
        // read-outs
        let hit = 0; for (let j = -10; j < 10; j++) for (let i = -10; i < 10; i++) { const x = i + 0.5, y = j + 0.5, w = warp(x, y); if (hidden(x, y) || Math.hypot(w[0] - x, w[1] - y) > 0.18) hit++; }
        ro.set('sq', hit + ' of 400');
        ro.set('dia', V.sco < 0.05 ? 'none' : fx(2 * V.sco, 1) + '° · ' + fx(2 * V.sco * 0.297, 1) + ' mm');
        const ecc = V.sco < 0.05 ? 0 : Math.max(0, V.sco - Math.abs(V.off));
        ro.set('acu', V.sco < 0.05 ? 'normal at the fovea' : ecc < 0.05 ? 'the fixation point is outside the patch: normal' : 'about ' + acu(5 * Math.round(20 * (1 + ecc / 2) / 5)) + ' at ' + fx(ecc, 1) + '° from the fovea (typical fall-off)');
        ro.set('say', V.sco < 0.05 && V.wav < 0.05 ? 'nothing: the grid is square and complete' : V.sco < 0.05 ? 'lines look wavy; letters bend' : V.sco < 2 ? 'a small gap in the middle of what is looked at; fine print breaks up' : 'the centre of a face or a word is missing; the sides are intact');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 9 · the cornea: rings, curvature, the point image */
  function hsl2rgb(h, s, l) {
    h = ((h % 360) + 360) % 360 / 60; const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(h % 2 - 1)), m = l - c / 2;
    const k = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][Math.min(5, Math.floor(h))];
    return [255 * (k[0] + m), 255 * (k[1] + m), 255 * (k[2] + m)];
  }
  const kColour = K => hsl2rgb(240 * (1 - clamp((K - 34) / 24, 0, 1)), 0.85, 0.5);
  Hyper.sim('re-cornea', {
    title: 'The cornea: rings, curvature and what a point becomes',
    blurb: `The cornea is the eye's main lens, and its front surface is measured from the way it mirrors a pattern of rings (a **Placido disc**). A ring is reflected where the surface slopes by a particular angle, so on a regular cornea the images are round and evenly spaced; a steeper place crowds them together, a flatter one spreads them. From the same surface the curvature can be computed and drawn as a colour map (**warm** = steep, **cool** = flat; the scale is in dioptres using the keratometer's standard index of 1.3375, and the value is the curvature measured along the line from the centre outwards), and the rays through the pupil show what a point of light becomes. All three pictures are drawn from one model surface; the numbers are typical, not a record of any eye.

**Try this**
- Start with the **regular** cornea: round rings, a calm colour, a tight round point. K is about 43 D.
- Choose **regular astigmatism** and raise the amount: the rings turn into ovals and the map into a *bow-tie* of two steeper and two flatter sectors. The point becomes two lines, as on the astigmatism page. Turn the axis and the bow-tie turns with it.
- Choose **keratoconus** and raise the amount: a small, steep, off-centre area appears (usually below the centre) where the rings crowd together, a hot spot on the map, and the point is smeared into a comet with a tail. The patch is not a sphere or a cylinder, which is why it cannot be corrected with a simple lens.
- Open the pupil to 6–7 mm: the point becomes worse because more of the irregular area is used.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      bindDraw(S);
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Cornea', options: [['A regular cornea', 'reg'], ['Regular astigmatism', 'astig'], ['Keratoconus (a cone below the centre)', 'kc']], value: params.kind || 'kc' },
        { id: 'sev', label: 'How much', min: 0, max: 1, step: 0.05, value: params.sev != null ? params.sev : 0.6, fmt: v => Math.round(v * 100) + ' %' },
        { id: 'ang', label: 'Axis of the steeper meridian (astigmatism)', min: 0, max: 180, step: 5, value: params.ang != null ? params.ang : 90, unit: '°' },
        { id: 'pupil', label: 'Pupil', min: 2, max: 8, step: 0.5, value: 4, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['kz', 'Central zone (3 mm): flattest · steepest K'], ['cyl', 'Difference between them'], ['peak', 'Steepest K anywhere in the 8 mm map'], ['blur', 'The point image (RMS radius)'], ['say', 'The rings']]);
      const R0 = 7.8, K0 = 337.5 / R0, ZR = 4.2;
      /* the model surface: a sphere or a toric surface, plus for keratoconus a Gaussian bump forward at (xc, yc) */
      function surf() {
        const sev = V.sev, a = V.ang * D2R, cyl = V.kind === 'astig' ? 4 * sev : 0;
        const c1 = (K0 + cyl / 2) / 337.5, c2 = (K0 - cyl / 2) / 337.5;
        return { c1, c2, e1: [Math.cos(a), Math.sin(a)], e2: [-Math.sin(a), Math.cos(a)], H: V.kind === 'kc' ? 0.04 * sev : 0, sg: 1.1, xc: 0.4, yc: -1.3 };
      }
      function geo(m, x, y) {
        const p1 = x * m.e1[0] + y * m.e1[1], p2 = x * m.e2[0] + y * m.e2[1];
        let zx = m.c1 * p1 * m.e1[0] + m.c2 * p2 * m.e2[0], zy = m.c1 * p1 * m.e1[1] + m.c2 * p2 * m.e2[1];
        let zxx = m.c1 * m.e1[0] * m.e1[0] + m.c2 * m.e2[0] * m.e2[0], zyy = m.c1 * m.e1[1] * m.e1[1] + m.c2 * m.e2[1] * m.e2[1], zxy = m.c1 * m.e1[0] * m.e1[1] + m.c2 * m.e2[0] * m.e2[1];
        if (m.H > 0) {
          const dx = x - m.xc, dy = y - m.yc, s2 = m.sg * m.sg, q = (dx * dx + dy * dy) / (2 * s2), g = Math.exp(-q), A = m.H / s2;
          zx += A * dx * g; zy += A * dy * g; zxx += A * g * (1 - dx * dx / s2); zyy += A * g * (1 - dy * dy / s2); zxy -= A * g * dx * dy / s2;
        }
        const r2 = x * x + y * y, ctan = r2 < 0.04 ? 0.5 * (zxx + zyy) : (x * x * zxx + 2 * x * y * zxy + y * y * zyy) / r2;
        return { zx, zy, K: 337.5 * ctan, slope: Math.atan(Math.hypot(zx, zy)) };
      }
      let cache = { key: '' };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, gap = 8, pw = (W - 4 * gap) / 3, ph = Hh - 2 * gap, m = surf();
        const key = [V.kind, V.sev.toFixed(2), V.ang, V.pupil].join('|');
        const side = Math.min(pw - 12, ph - 34), sc = side / (2 * ZR);
        const px = [gap, 2 * gap + pw, 3 * gap + 2 * pw], cy = gap + 16 + (ph - 16) / 2;
        // 1 · the rings the surface mirrors: bands of equal slope, alternately light and dark
        panel(c, C, px[0], gap, pw, ph, 'rings mirrored by the cornea');
        S.image(c, px[0] + pw / 2 - side / 2, cy - side / 2, side, side, 110, 110, (u, v) => {
          const x = (u - 0.5) * 2 * ZR, y = (0.5 - v) * 2 * ZR;
          if (x * x + y * y > ZR * ZR) return [16, 18, 30];
          const band = Math.floor(geo(m, x, y).slope / 0.052 + 1e-6), e = band % 2 === 0;
          return e ? [235, 238, 245] : [28, 30, 44];
        }, { key: 'r|' + key, id: 'rings' });
        // 2 · the axial curvature map
        panel(c, C, px[1], gap, pw, ph, 'curvature along the radius, D');
        S.image(c, px[1] + pw / 2 - side / 2, cy - side / 2 - 6, side, side, 96, 96, (u, v) => {
          const x = (u - 0.5) * 2 * ZR, y = (0.5 - v) * 2 * ZR;
          if (x * x + y * y > ZR * ZR) return [16, 18, 30];
          return kColour(geo(m, x, y).K);
        }, { key: 'k|' + key, id: 'kmap' });
        S.cells(c, px[1] + pw / 2 - side / 2, cy + side / 2 - 2, side, 6, 24, 1, u => kColour(34 + 24 * u));
        for (const k of [36, 44, 52]) kit.label(c, String(k), px[1] + pw / 2 - side / 2 + side * (k - 34) / 24, cy + side / 2 + 11, { align: 'center', size: 9.5, color: C.muted });
        // 3 · where the rays of a point land on the retina
        panel(c, C, px[2], gap, pw, ph, 'a point of light, on the retina');
        if (cache.key !== key) {
          const pr = V.pupil / 2, pts = [];
          let sxx = 0, sxz = 0;
          const samp = [[0, 0]]; for (let r = 1; r <= 8; r++) for (let j = 0; j < 6 * r; j++) { const a = TAU * j / (6 * r); samp.push([pr * r / 8 * Math.cos(a), pr * r / 8 * Math.sin(a)]); }
          const gs = samp.map(p => geo(m, p[0], p[1]));
          samp.forEach((p, i) => { sxx += p[0] * p[0] + p[1] * p[1]; sxz += p[0] * gs[i].zx + p[1] * gs[i].zy; });
          const cref = sxx > 0 ? sxz / sxx : 0, f = 17 * 0.282;
          samp.forEach((p, i) => pts.push([-f * (gs[i].zx - cref * p[0]), -f * (gs[i].zy - cref * p[1])]));
          let mx = 0, my = 0; for (const q of pts) { mx += q[0]; my += q[1]; } mx /= pts.length; my /= pts.length;
          let s2 = 0; for (const q of pts) s2 += (q[0] - mx) * (q[0] - mx) + (q[1] - my) * (q[1] - my);
          cache = { key, pts, mx, my, rms: Math.sqrt(s2 / pts.length) };
        }
        const half = side / 2 - 2, scl = half / 0.3;
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(px[2] + pw / 2 - half, cy - half, 2 * half, 2 * half); c.beginPath(); c.moveTo(px[2] + pw / 2 - half, cy); c.lineTo(px[2] + pw / 2 + half, cy); c.moveTo(px[2] + pw / 2, cy - half); c.lineTo(px[2] + pw / 2, cy + half); c.stroke();
        c.fillStyle = S.nm(587.56);
        for (const q of cache.pts) { const X = px[2] + pw / 2 + (q[0] - cache.mx) * scl, Y = cy - (q[1] - cache.my) * scl; if (Math.abs(X - px[2] - pw / 2) <= half && Math.abs(Y - cy) <= half) c.fillRect(X - 1, Y - 1, 2, 2); }
        c.restore();
        kit.label(c, 'box 600 µm across', px[2] + pw / 2, cy + half + 11, { align: 'center', size: 9.5, color: C.faint });
        // read-outs: the curvature on a ring of 1.5 mm radius, and the steepest value anywhere
        let kmin = 1e9, kmax = -1e9, peak = -1e9;
        for (let k = 0; k < 36; k++) { const a = TAU * k / 36, K = geo(m, 1.5 * Math.cos(a), 1.5 * Math.sin(a)).K; kmin = Math.min(kmin, K); kmax = Math.max(kmax, K); }
        for (let j = -16; j <= 16; j++) for (let i = -16; i <= 16; i++) { const x = i * ZR / 16, y = j * ZR / 16; if (x * x + y * y <= ZR * ZR) peak = Math.max(peak, geo(m, x, y).K); }
        ro.set('kz', fx(kmin, 1) + ' · ' + fx(kmax, 1) + ' D');
        ro.set('cyl', fx(kmax - kmin, 1) + ' D');
        ro.set('peak', fx(peak, 1) + ' D');
        ro.set('blur', fx(cache.rms * 1000, 0) + ' µm · ' + fx(cache.rms / 17 * ARCMIN, 1) + ' arc-minutes');
        ro.set('say', V.kind === 'reg' || V.sev < 0.03 ? 'round and evenly spaced' : V.kind === 'astig' ? 'oval: closer together along the steeper meridian' : 'crowded and displaced where the cone is');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ 10 · low vision and magnification */
  Hyper.sim('re-lowvision', {
    title: 'Low vision: how much magnification does the print need?',
    blurb: `A person's acuity sets the smallest letter that can be read. A line of print is legible when its letters subtend at least as much as the smallest letter the eye can resolve, and comfortable reading wants about twice that. The magnification needed is therefore a **ratio of two sizes**: what the eye can resolve against what the print offers. Three rows show the same words, each drawn at the same size on the screen; what differs is how much the eye blurs them *relative to the size of the letters*, which is what magnification changes. The chart below gives the magnification needed against acuity for the print you chose.

**Try this**
- Start at **20/100** with newspaper print: the top row (a normal eye) is crisp and the second row (this eye, no aid) is soft and hard to read. Press *Set to what is needed*: the magnification that makes it comfortably legible, and the read-out gives the power of a hand magnifier that would deliver it (relative to reading at 40 cm without help).
- Move the acuity to **20/400** and the print to *large print*: the magnification needed is several times larger, and it passes what a hand magnifier can give at a useful distance.
- Choose the smallest print at 20/40: the magnification needed just to read it is about 1, and about 2 to read it comfortably.
- The figures assume the eye can use the full magnification; in practice a magnifier shrinks the field, and what can be read also depends on the health of the retina and on the lighting.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      bindDraw(S);
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230, maxH: 320 });
      const plot = kit.plot(box.stage, { x: { label: 'acuity 20/N', name: 'N', min: 20, max: 400 }, y: { label: 'magnification (×)', name: 'M', min: 0 }, series: [] }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'va', type: 'select', label: 'Acuity of the person', options: [['20/20 (6/6)', 20], ['20/30', 30], ['20/40 (6/12)', 40], ['20/60 (6/18)', 60], ['20/100 (6/30)', 100], ['20/200 (6/60)', 200], ['20/400 (3/60)', 400]], value: params.va || 100 },
        { id: 'h', type: 'select', label: 'Height of the capital letters at 40 cm', options: [['1.2 mm: fine print (labels, footnotes)', 1.2], ['1.8 mm: newspaper text', 1.8], ['2.5 mm: a book', 2.5], ['4 mm: large print', 4]], value: params.h || 1.8 },
        { id: 'mag', label: 'Magnification used', min: 1, max: 12, step: 0.1, value: params.mag || 1, log: true, sig: 3, fmt: v => '× ' + kit.fmt(v, 3) },
        { type: 'buttons', items: [{ id: 'need', label: 'Set to what is needed', primary: true }, { id: 'one', label: 'No magnification' }] }
      ], id => {
        if (id === 'need') ctl.set('mag', clamp(need().comfort, 1, 12));
        else if (id === 'one') ctl.set('mag', 1);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lh', 'The print, at 40 cm'], ['min', 'Smallest letter this acuity reads at 40 cm'], ['mthr', 'Magnification to make it just legible'], ['mcom', 'Magnification for comfortable reading (twice that)'], ['hand', 'A hand magnifier of this power, held at its focal length'], ['kest', 'Rule of thumb for a reading addition, 1 ÷ acuity']]);
      const printArc = () => Math.atan(V.h / 400) * ARCMIN;                    // angle of the capital letters (arcmin)
      const need = () => { const thr = 5 * V.va / 20 / printArc(); return { thr, comfort: 2 * thr }; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, gap = 8, rows = 3, rh = (Hh - gap * (rows + 1)) / rows;
        const L = printArc(), font = Math.min(30, rh * 0.7), cap = 0.72 * font, n = need();
        const rho = (M, N) => Math.max(0.05, L * M / (5 * N / 20));              // the print against the smallest letter the eye resolves
        const radius = (M, N) => 0.22 * cap / rho(M, N);
        const list = [['a normal eye (20/20), print as it is', 1, 20], ['this eye, no aid', 1, V.va], ['this eye, magnified × ' + kit.fmt(V.mag, 3), V.mag, V.va]];
        list.forEach(([title, M, N], k) => {
          const y = gap + k * (rh + gap);
          panel(c, C, gap, y, W - 2 * gap, rh, '');
          blurText(c, 'Pay the bill by Friday, in full', W / 2, y + rh / 2 + 4, { size: font, color: C.text, weight: 600 }, radius(M, N));
          kit.label(c, title, gap + 8, y + 10, { align: 'left', size: 10.5, color: C.muted });
          kit.label(c, 'letters ' + kit.fmt(rho(M, N), 2) + ' × the smallest readable', W - gap - 8, y + 10, { align: 'right', size: 10.5, color: rho(M, N) >= 2 ? C.ok : rho(M, N) >= 1 ? C.warn : C.bad });
        });
        ro.set('lh', V.h + ' mm = ' + fx(L, 1) + ' arc-minutes; it matches a 20/' + Math.round(L / 5 * 20) + ' letter');
        ro.set('min', fx(E.letterHeight(0.4, V.va) * 1000, 1) + ' mm  (5 arc-minutes × ' + V.va + '/20)');
        ro.set('mthr', '× ' + fx(Math.max(1, n.thr), 1) + (n.thr <= 1 ? '  (none needed)' : ''));
        ro.set('mcom', '× ' + fx(Math.max(1, n.comfort), 1));
        ro.set('hand', n.comfort <= 1 ? 'none' : fx(n.comfort / 0.4, 0) + ' D (the print would be ' + fx(0.4 * 100 / n.comfort, 0) + ' cm from the lens)' + (n.comfort > 6 ? ': a small field and a close working distance' : ''));
        ro.set('kest', '+' + fx(V.va / 20, 1) + ' D, for print read at ' + Math.round(100 / (V.va / 20)) + ' cm');
        const pts = []; for (let N = 20; N <= 400; N += 10) pts.push([N, Math.max(1, 5 * N / 20 / L * 2)]);
        plot.set({ series: [{ pts, label: 'comfortable' }, { pts: pts.map(p => [p[0], Math.max(1, p[1] / 2)]), label: 'just legible', dash: [4, 4] }], marks: [{ x: V.va, y: Math.max(1, n.comfort), label: '× ' + fx(Math.max(1, n.comfort), 1) }], vlines: [{ x: V.va, label: '20/' + V.va }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
