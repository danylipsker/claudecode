/* HYPER-CORE · ui/optics-eye.js — Tools → Eye & glasses (#/tools/eyelab/<eye|prescription|acuity|progressive|field>)
 *
 *   eye          a schematic eye in section, traced with real rays: length (myopia to hyperopia), accommodation, age,
 *                pupil, object distance and a spectacle lens in front; the focus against the retina, the blur patch,
 *                far and near points, the lens that would correct it
 *   prescription sphere, cylinder, axis and addition decoded: both cylinder forms, the power cross and the power in
 *                every meridian, contact-lens equivalent, near points, Prentice's rule, a description in words
 *   acuity       an eye chart (Sloan letters, 6/60 to 6/3) blurred by uncorrected error, astigmatism, pupil and a pinhole
 *   progressive  the map of a progressive lens (added power, unwanted astigmatism) beside a flat-top bifocal and a
 *                single-vision lens, with a cursor that reads both
 *   field        the visual field of one or both eyes on a polar chart, blind spots, zones of vision, the lens of a
 *                frame, and the contrast-sensitivity curve
 *
 * The mathematics is kit.optics (optics.js: O.sys ray tracing, O.lens('eye'); optics-vision.js: O.eye); the drawing
 * is kit.osym; shared helpers are T.util (optictools.js). Local helpers: the eye with a changeable length, power and
 * pupil (the focusing is found by a short search with the paraxial trace; the progressive-lens maps are smooth pictures,
 * S.image, with marching-squares contours every 0.5 D), the spectacle lens as a thick meniscus,
 * the vergence arriving at the cornea, the blur sampler, the Sloan letters, contours of a grid, the field outlines.
 */
(function () {
  'use strict';
  const H = window.Hyper, ui = H.ui, U = H.util, esc = U.esc, K = H.kit, O = H.optics, S = H.osym;
  const T = H.opticsTools = H.opticsTools || {};
  const E = O.eye, SYS = O.sys, clamp = O.clamp, f = T.util.f, D2R = Math.PI / 180, TAU = Math.PI * 2;
  const TABS = [['eye', 'The eye and its correction'], ['prescription', 'Reading a prescription'], ['acuity', 'Acuity and blur'], ['progressive', 'Progressive lenses'], ['field', 'Field of view']];

  T.eyelab = function (el, params, sub) {
    const t = T.util.subtabs(el, 'eyelab', TABS, sub, 'The eye here is a standard textbook model and the numbers are typical values. They show how sight and its correction work; they are not a measurement of anyone’s eye.');
    ({ eye, prescription, acuity, progressive, field })[t.tab](t.body);
  };
  T.eyelab.tabs = TABS.map(t => t[0]);

  /* ================================================================ small helpers */
  const colors = () => K.colors();
  const label = (c, s, x, y, o) => K.label(c, s, x, y, Object.assign({ size: 11.5, color: colors().muted }, o));
  const head = (el, s) => el.appendChild(ui.el('<h4 style="margin:10px 0 0;font-size:13.5px">' + s + '</h4>'));
  const ARCMIN = 180 * 60 / Math.PI;                                           // arc-minutes in a radian
  /* signed numbers with a true minus sign: −2.25, +1.50, 0.00 */
  const sg = (v, d) => { if (!Number.isFinite(v)) return '—'; const s = Math.abs(v).toFixed(d == null ? 2 : d); return (+s > 0 ? (v < 0 ? '−' : '+') : '') + s; };
  const dpt = (v, d) => sg(v, d) + ' D';
  const mn = (v, d) => (v < -0.5 * Math.pow(10, -d) ? '−' : '') + Math.abs(v).toFixed(d);          // a number with a true minus sign and no plus
  const dist = m => !Number.isFinite(m) ? 'infinity' : m < 1 ? Math.round(m * 100) + ' cm' : m < 10 ? f(m, 2) + ' m' : Math.round(m) + ' m';
  const acuText = x => '6/' + Math.round(x * 0.3) + ' (20/' + Math.round(x) + ')';
  function path(c, pts, close) { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (close) c.closePath(); }
  function stroke(c, pts, col, w, dash, close) {
    if (pts.length < 2) return;
    c.save(); c.strokeStyle = col; c.lineWidth = w || 1; c.lineJoin = 'round'; c.setLineDash(dash || []); path(c, pts, close); c.stroke(); c.restore();
  }
  function fill(c, pts, col) { c.save(); c.fillStyle = col; path(c, pts, true); c.fill(); c.restore(); }
  /* a framed panel with a title: the inset of the eye picture, the chart paper */
  function panel(c, x, y, w, h, title) {
    const C = colors();
    c.save(); c.fillStyle = C.surface; c.strokeStyle = C.axis; c.lineWidth = 1; c.fillRect(x, y, w, h); c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); c.restore();
    if (title) label(c, title, x + 6, y + 10, { size: 10.5, weight: 650, color: C.text });
  }

  /* ================================================================ the eye: a schematic eye with a changeable length, power and pupil */
  /* Le Grand's eye from the lens library. Its length is set by moving the retina to where an object of vergence R
     (the refractive state, D) comes to a focus; accommodation steepens the lens (more the front than the back) and
     thickens it a little, and the scale of that change is found so that the far point moves by the amount asked. */
  const VD = 12;                                                    // mm from the back of the spectacle lens to the cornea
  let ENT = 0;
  function eyeSurfaces(s1, A, pupil) {
    if (!ENT) ENT = SYS.paraxial(O.lens('eye')).epd / 4;            // entrance pupil radius per mm of the stop's semi-diameter: the cornea magnifies the pupil
    const sf = O.lens('eye').surfaces, R2 = sf[2].R, R3 = sf[3].R;
    sf[1].t -= 0.04 * A; sf[2].R = R2 / s1; sf[2].t += 0.06 * A; sf[3].R = R3 / (1 + 0.3 * (s1 - 1));
    sf[2].sd = pupil / 2 / ENT;
    return sf;
  }
  const imageZ = (sf, v) => SYS.paraxial({ surfaces: sf, object: Math.abs(v) < 1e-9 ? Infinity : -1000 / v }).zImage;      // v: vergence of the light at the cornea
  const retinaZ = ref => imageZ(eyeSurfaces(1, 0, 4), ref);
  function lensScale(ref, A, ret) {
    if (A < 1e-6) return 1;
    const g = s => imageZ(eyeSurfaces(s, A, 4), ref - A) - ret;
    let lo = 0.8, hi = 3.2;
    if (g(lo) < 0) return lo;
    if (g(hi) > 0) return hi;
    for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (g(mid) > 0) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }
  /* a spectacle lens of back-vertex power F as a thick meniscus of index 1.5; its back surface is VD from the cornea */
  function specLens(F) {
    const n = 1.5, t = clamp(1.8 + 0.2 * F, 1.0, 4.0), F1 = clamp(4 + 0.5 * F, 1, 9);
    const F2 = F - F1 / (1 - t / 1000 / n * F1);
    const R1 = (n - 1) / F1 * 1000, R2 = Math.abs(F2) < 1e-6 ? 0 : -(n - 1) / F2 * 1000;
    return { t, R1, R2, surfaces: [{ R: R1, t, n, sd: 15 }, { R: R2, t: VD, n: 1, sd: 15 }] };
  }
  /* the vergence (D) at the cornea of the light from an object d metres away, seen through a lens F at VD */
  function arriving(F, d) {
    if (Math.abs(F) < 0.005) return Number.isFinite(d) ? -1 / d : 0;
    const sp = specLens(F), z0 = sp.t + VD;
    const par = SYS.paraxial({ surfaces: sp.surfaces, object: Number.isFinite(d) ? d * 1000 - z0 : Infinity });
    const out = par.zImage - sp.t;                                 // from the back of the lens to the image it forms
    if (!Number.isFinite(out)) return 0;
    let v = out - VD; if (Math.abs(v) < 0.5) v = v < 0 ? -0.5 : 0.5;
    return 1000 / v;
  }
  /* the nearest and farthest distances (m, from the eye) that an eye of refractive state ref and amplitude amp sees
     sharply through a thin lens F at vd metres */
  function through(ref, amp, F, vd) {
    const back = v => {
      if (Math.abs(F) < 0.005) return v >= -1e-9 ? Infinity : -1 / v;
      const L1 = v / (1 + vd * v) - F;
      return L1 >= -1e-9 ? Infinity : -1 / L1 + vd;
    };
    return { far: back(ref), near: back(ref - amp) };
  }
  const rangeText = r => Math.abs(r.far - r.near) < 0.005 ? 'only at ' + dist(r.far)
    : !Number.isFinite(r.near) ? 'no object is sharp' : 'from ' + dist(r.near) + ' to ' + dist(r.far);

  /* the body of the eye in section: sclera, cornea, lens, iris and retina. sf: the four surfaces, ret: the retina's distance behind the cornea */
  function drawBody(c, m, sf, ret, C) {
    const zs = SYS.vertices({ surfaces: sf });
    const P = (i, r) => { const z = SYS.sag(sf[i], r); return [m.X(zs[i] + (Number.isFinite(z) ? z : 0)), m.Y(r)]; };
    const arc = (i, r0, r1, n) => { const o = []; for (let j = 0; j <= n; j++) o.push(P(i, r0 + (r1 - r0) * j / n)); return o; };
    const b = 11.6 + 0.2 * (ret - 24.2), zc = ret / 2, a = ret / 2, phi0 = Math.acos(clamp((2.5 - zc) / a, -1, 1));
    const ell = (p0, p1, n) => { const o = []; for (let k = 0; k <= n; k++) { const ph = p0 + (p1 - p0) * k / n; o.push([m.X(zc + a * Math.cos(ph)), m.Y(b * Math.sin(ph))]); } return o; };
    // the globe
    const glob = ell(phi0, -phi0, 48);
    const body = [P(0, 5.5)].concat(glob, arc(0, -5.5, 5.5, 14));
    fill(c, body, C.dark ? 'rgba(235,238,250,0.06)' : 'rgba(40,60,120,0.05)');
    stroke(c, body, C.muted, 1.8, null, true);
    stroke(c, ell(1.0, -1.0, 24), C.bad, 3.2);                                      // the retina
    // the cornea
    const cor = arc(0, -5.5, 5.5, 14).concat(arc(1, 5.5, -5.5, 14));
    fill(c, cor, S.glass(0.34)); stroke(c, cor, S.edge(), 1.3, null, true);
    // the crystalline lens, as far out as its two faces stay apart
    let rl = 0;
    for (let r = 0.2; r <= 4.4; r += 0.1) { const th = zs[3] + SYS.sag(sf[3], r) - (zs[2] + SYS.sag(sf[2], r)); if (!(th > 0.15)) break; rl = r; }
    rl = Math.max(rl, 0.6);
    const len = arc(2, -rl, rl, 16).concat(arc(3, rl, -rl, 16));
    fill(c, len, S.glass(0.4)); stroke(c, len, S.edge(), 1.3, null, true);
    // the iris: the pupil is the opening in it
    const xi = m.X(zs[2] - 0.15), pu = sf[2].sd;
    for (const sgn of [1, -1]) stroke(c, [[xi, m.Y(sgn * pu)], [xi, m.Y(sgn * 5.5)]], C.accent, 3.6);
    return { zs, rl, zc, a, b };
  }

  /* ================================================================ 1 · the eye and its correction */
  function eye(el) {
    const L = T.util.lab(el, 'A schematic eye in section, with real rays traced through its cornea and lens. Set how long or short the eye is (the line at the top of the controls runs from short-sighted to long-sighted), how far away the object is and how much the lens is focusing, and watch where the light comes to a point compared with the retina. Put a spectacle lens in front and see it move the focus. The eye is a textbook model, not any person’s eye: only an eye examination measures an eye.', 0.52, { minH: 340 });
    let ctl = null;
    const ampNow = () => E.accommodation(ctl && ctl.values ? ctl.values.age : 25).avg;
    ctl = K.controls(L.side, [
      { id: 'rx', label: 'Refractive state of the eye', min: -8, max: 6, step: 0.25, value: 0, fmt: v => (Math.abs(v) < 0.01 ? 'normal' : dpt(v) + (v < 0 ? ' · long eye' : ' · short eye')) },
      { id: 'd', type: 'select', label: 'Object distance', options: [['Infinity (a distant object)', Infinity], ['6 m', 6], ['1 m', 1], ['40 cm', 0.4], ['25 cm', 0.25], ['10 cm', 0.1]], value: Infinity },
      { id: 'acc', label: 'Accommodation in use', min: 0, max: 100, step: 1, value: 0, fmt: v => f(ampNow() * v / 100, 1) + ' D' },
      { id: 'age', label: 'Age (sets the accommodation available)', min: 10, max: 75, step: 1, value: 25, unit: 'years' },
      { id: 'pupil', label: 'Pupil diameter', min: 2, max: 8, step: 0.5, value: 4, unit: 'mm' },
      { id: 'F', label: 'Spectacle lens, 12 mm in front', min: -10, max: 10, step: 0.25, value: 0, fmt: v => Math.abs(v) < 0.01 ? 'none' : dpt(v) },
      { type: 'buttons', items: [{ id: 'fix', label: 'Correct it', primary: true }, { id: 'acco', label: 'Let the eye focus' }] }
    ], id => {
      if (id === 'fix') ctl.set('F', fixPower());
      else if (id === 'acco') ctl.set('acc', accNeeded());
      else if (id === 'age') ctl.set('acc', V.acc);
      draw();
    });
    const V = ctl.values;
    const ro = K.readout(L.side, [['focus', 'Where the focus falls'], ['err', 'Equivalent error'], ['blur', 'Blur from that error'], ['spot', 'Traced blur patch'], ['acu', 'Rough acuity at this pupil'], ['accn', 'Accommodation at this age'], ['far', 'Far point of this eye'], ['near', 'Near point at this age'], ['thru', 'Sharp range through these glasses'], ['fix', 'Lens that would correct it']]);
    const fixRaw = () => V.rx / (1 + VD / 1000 * V.rx);                       // the spectacle power that matches the eye's own error
    const fixPower = () => clamp(Math.round(fixRaw() * 4) / 4, -10, 10);
    const accNeeded = () => { const amp = ampNow(); return amp > 0 ? clamp(Math.max(0, V.rx - arriving(V.F, V.d)) / amp * 100, 0, 100) : 0; };

    /* the state of the eye and of the light in it */
    function model() {
      const ref = V.rx, amp = ampNow(), A = amp * V.acc / 100, F = V.F, d = V.d;
      const retRel = retinaZ(ref), s1 = lensScale(ref, A, retRel), eyeSf = eyeSurfaces(s1, A, V.pupil);
      let sf = eyeSf, z0 = 0, sp = null;
      if (Math.abs(F) >= 0.005) { sp = specLens(F); z0 = sp.t + VD; sf = sp.surfaces.concat(eyeSf); }
      const sys = { surfaces: sf, object: Number.isFinite(d) ? d * 1000 - z0 : Infinity };
      const par = SYS.paraxial(sys), retAbs = retRel + z0, dz = Number.isFinite(par.zImage) ? par.zImage - retAbs : 0;
      return { ref, amp, A, F, d, retRel, retAbs, z0, sp, eyeSf, sys, par, dz, err: ref - A - arriving(F, d) };
    }
    /* where the rays of a point land on the retina plane (at the d line of the glass catalogues, the wavelength the eye's length is set at): a ring-sampled spot over the fraction fl of the pupil */
    function spotOf(M, fl) {
      const nm = 587.56, zs = M.par.zs, ns = SYS.indices(M.sys, nm), pts = [];
      const shoot = (px, py) => { const tr = SYS.trace(M.sys, SYS.aim(M.sys, px, py, 0, M.par, nm), nm, { zs, ns }); if (tr.ok) { const e = SYS.at(tr, M.retAbs); if (Number.isFinite(e[0]) && Number.isFinite(e[1])) pts.push([e[0], e[1]]); } };
      shoot(0, 0);
      for (let r = 1; r <= 5; r++) for (let j = 0; j < 6 * r; j++) { const a = TAU * j / (6 * r); shoot(fl * r / 5 * Math.cos(a), fl * r / 5 * Math.sin(a)); }
      let cx = 0, cy = 0, geo = 0;
      for (const p of pts) { cx += p[0]; cy += p[1]; }
      cx /= pts.length || 1; cy /= pts.length || 1;
      for (const p of pts) geo = Math.max(geo, Math.hypot(p[0] - cx, p[1] - cy));
      return { pts, cx, cy, geo };
    }

    function draw() {
      const c = L.st.begin(), C = colors(), W = L.st.W, Hh = L.st.H, M = model();
      const m = S.map(L.st, -36, 31, 15.5, { left: 6, right: 6, top: 8, bottom: 22 }), s = m.s;
      const mz = { X: z => m.X(z - M.z0), Y: m.Y };                           // optical coordinates of the system, shifted so that the cornea is at 0
      S.axis(c, m.X(-36), m.Y(0), m.X(31));
      const body = drawBody(c, m, M.eyeSf, M.retRel, C);
      if (M.sp) {
        S.lens(c, m.X(-M.z0), m.Y(0), s * 15, { R1: s * M.sp.R1, R2: s * M.sp.R2, t: s * M.sp.t, fill: S.glass(0.26) });
        S.dim(c, m.X(-VD), m.Y(-14.2), m.X(0), m.Y(-14.2), '12 mm', { off: -9, size: 10.5 });
        label(c, 'spectacle lens ' + dpt(M.F), m.X(-M.z0 - 1.5), Hh - 9, { align: 'center', size: 11, color: C.text });
      }
      /* the rays: solid to the retina plane, dashed beyond it to the focus */
      let fl = 0.98, fan;                                                      // the widest bundle that the pupil passes whole
      for (; fl > 0.5; fl -= 0.04) { fan = SYS.fan2d(M.sys, { n: 9, fill: fl, zEnd: M.retAbs, zStart: -36 + M.z0 }); if (fan.every(r => r.ok)) break; }
      S.rays(c, fan, mz, { nm: 587.56, width: 1.3 });
      const zF = M.par.zImage - M.z0;
      if (M.dz > 0.03) for (const r of fan) if (r.ok && Number.isFinite(zF)) { const e = SYS.at(r.tr, M.par.zImage); stroke(c, [[mz.X(M.retAbs), mz.Y(SYS.at(r.tr, M.retAbs)[1])], [mz.X(e[2]), mz.Y(e[1])]], C.faint, 1, [3, 3]); }
      // the iris sits over the rays
      const xi = m.X(body.zs[2] - 0.15);
      for (const sgn of [1, -1]) stroke(c, [[xi, m.Y(sgn * M.eyeSf[2].sd)], [xi, m.Y(sgn * 5.5)]], C.accent, 3.6);
      /* the blur patch on the retina, and the point of focus */
      const sp = spotOf(M, fl), hpx = Math.max(3, sp.geo * s);
      stroke(c, [[m.X(M.retRel), m.Y(0) - hpx], [m.X(M.retRel), m.Y(0) + hpx]], C.warn, 4);
      if (Number.isFinite(zF) && Math.abs(zF) < 60) {
        K.dot(c, m.X(zF), m.Y(0), 4.5, C.text, C.bg2);
        label(c, Math.abs(M.dz) < 0.03 ? 'focus on the retina' : 'focus', m.X(zF) - 8, m.Y(0) - 22, { align: 'right', size: 11, color: C.text, weight: 650, bg: C.bg2 });
      }
      /* names */
      label(c, 'cornea', m.X(-0.4), m.Y(8.6), { align: 'center' });
      stroke(c, [[m.X(-0.6), m.Y(-9.4) - 8], [xi, m.Y(-5.6)]], C.faint, 1); label(c, 'iris and pupil', m.X(-0.6), m.Y(-9.4), { align: 'center' });
      label(c, 'lens', m.X(body.zs[2] + 2.2), m.Y(6.4), { align: 'center' });
      label(c, 'retina', m.X(M.retRel) + 8, m.Y(5), { size: 11.5 });
      label(c, Number.isFinite(M.d) ? 'an object ' + dist(M.d) + ' away' : 'parallel rays', m.X(-35.4), m.Y(-5.5), { size: 11 });
      label(c, Number.isFinite(M.d) ? 'is off to the left' : 'from a distant object', m.X(-35.4), m.Y(-5.5) + 14, { size: 11 });
      /* the blur patch, enlarged */
      const size = clamp(Hh * 0.3, 90, 130), bx = 8, by = 8, half = size / 2 - 8;
      panel(c, bx, by, size, size, 'on the retina');
      const scale = 0.78 * half / Math.max(sp.geo, 0.006);                    // px per mm
      const nW = M.par.fnoWorking, airy = Number.isFinite(nW) ? 1.22 * 550e-6 * nW : 0.003;
      S.spot(c, sp, bx + size / 2, by + size / 2 + 6, half - 4, scale, { airy, nm: 587.56 });
      let bar = 1; for (const u of [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]) if (u * scale / 1000 <= size - 58) bar = u;
      const bpx = bar * scale / 1000;
      stroke(c, [[bx + 8, by + size - 12], [bx + 8 + bpx, by + size - 12]], C.text, 1.5);
      label(c, bar + ' µm', bx + 12 + bpx, by + size - 12, { size: 10 });
      /* read-outs */
      const err = M.err, aD = Math.abs(err) * V.pupil / 4;
      ro.set('focus', Math.abs(M.dz) < 0.03 ? 'on the retina' : f(Math.abs(M.dz), 2) + ' mm ' + (M.dz > 0 ? 'behind' : 'in front of') + ' the retina');
      ro.set('err', Math.abs(err) < 0.125 ? 'none (' + dpt(err) + ')' : dpt(err) + (err < 0 ? ': focus in front' : ': focus behind'));
      ro.set('blur', f(E.blurAngle(err, V.pupil) * ARCMIN, 1) + ' arc-minutes across');
      ro.set('spot', f(sp.geo * 2000, 0) + ' µm across (the Airy ring is ' + f(2 * airy * 1000, 1) + ' µm)');
      ro.set('acu', 'about ' + acuText(E.acuityFromDefocus(aD)));
      ro.set('accn', f(M.amp, 1) + ' D available, ' + f(M.A, 1) + ' D in use');
      const fp = E.farPoint(M.ref), np = E.nearPoint(M.ref, M.amp);
      ro.set('far', M.ref === 0 ? 'infinity' : fp > 0 ? dist(fp) : 'behind the eye: even distance needs focusing');
      ro.set('near', Number.isFinite(np) ? dist(np) : 'none: it cannot focus on anything');
      ro.set('thru', rangeText(through(M.ref, M.amp, M.F, VD / 1000)));
      const fr = fixRaw();
      ro.set('fix', Math.abs(fr) < 0.125 ? 'none needed' : dpt(Math.round(fr * 100) / 100) + ' at 12 mm (' + dpt(Math.round(E.vertex(fr, VD / 1000, 0) * 100) / 100) + ' as a contact lens)');
    }
    L.st.onResize(draw); T.util.onTheme(draw); draw();
    L.under.innerHTML = '<p class="small muted mt">The rays are traced through the surfaces of a standard schematic eye in yellow light, the wavelength glass catalogues use, and drawn in that colour. A longer eye (myopia) brings distant light to a focus in front of the retina and a shorter one (hyperopia) behind it; a minus lens spreads the light a little before the eye and a plus lens gathers it. Accommodation makes the lens rounder and so more powerful, which the eye needs for near objects; it fades with age. The refractive state is the power of the lens that would put the focus on the retina if worn at the cornea.</p>' +
      T.util.more(['the-eye-as-a-camera', 'accommodation', 'the-pupil', 'emmetropia-and-refractive-error', 'myopia', 'hyperopia', 'presbyopia', 'how-spectacle-lenses-correct-vision', 'vertex-distance-and-effective-power']);
  }


  /* ================================================================ 2 · reading a prescription */
  /* the usual reading addition at an age, interpolated from the table of typical values */
  function addFor(age) {
    const t = E.ADD_BY_AGE;
    if (age < t[0][0]) return 0;
    for (let i = 1; i < t.length; i++) if (age <= t[i][0]) return Math.round((t[i - 1][1] + (t[i][1] - t[i - 1][1]) * (age - t[i - 1][0]) / (t[i][0] - t[i - 1][0])) * 4) / 4;
    return t[t.length - 1][1];
  }
  const rxText = rx => (Math.abs(rx.sph) < 0.005 ? 'plano' : sg(rx.sph)) + (Math.abs(rx.cyl) < 0.005 ? ' DS' : ' / ' + sg(rx.cyl) + ' × ' + Math.round(rx.axis));
  /* the eye described in words: what the numbers say about the eye, never what to do about it */
  function describe(rx, age, amp, add) {
    const se = E.sphericalEquivalent(rx), a = Math.abs(se), c = Math.abs(rx.cyl);
    let s = 'This describes ';
    if (a < 0.5) s += 'an eye with almost no spherical error';
    else if (se < 0) s += 'an eye that is ' + (a < 3 ? 'mildly' : a < 6 ? 'moderately' : 'highly') + ' short-sighted (myopic)';
    else s += 'an eye that is ' + (a < 2 ? 'mildly' : a < 5 ? 'moderately' : 'highly') + ' long-sighted (hyperopic)';
    s += c < 0.25 ? '' : ', with ' + (c < 1 ? 'a little' : c < 2 ? 'a moderate amount of' : 'a marked amount of') + ' astigmatism';
    s += '. ';
    if (a >= 0.5 && se < 0) s += 'Uncorrected, its far point is about ' + dist(-1 / E.vertex(se, 0.012, 0)) + ', so things beyond that are out of focus. ';
    if (a >= 0.5 && se > 0) s += 'Uncorrected, the focus for distant objects falls behind the retina; a young eye can pull it forward by accommodating, using up part of its reserve. ';
    if (amp >= 5) s += 'At ' + age + ' the eye can still add about ' + f(amp, 1) + ' D of focusing, well above the 2.5 D that reading at 40 cm asks for.';
    else if (amp >= 3.3) s += 'At ' + age + ' the eye can still add about ' + f(amp, 1) + ' D of focusing: enough for reading at 40 cm (2.5 D), with little in reserve.';
    else s += 'At ' + age + ' the eye can add only about ' + f(amp, 1) + ' D of focusing, which is less than reading at 40 cm asks for with some in reserve; this is the situation in which a reading addition is usual, typically ' + (addFor(age) > 0 ? dpt(addFor(age)) : 'small') + ' at this age.';
    if (add > 0) s += ' The addition of ' + dpt(add) + ' in this prescription would move the near point of the corrected eye from about ' + (amp > 0.05 ? dist(1 / amp) : 'none') + ' to about ' + dist(1 / (amp + add)) + '.';
    return s;
  }
  /* the power cross: the dial of angles with the two principal meridians and their powers */
  function drawDial(c, cx, cy, R, rx, C) {
    const A = rx.axis, A2 = ((A + 90 - 1) % 180) + 1, P1 = E.meridian(rx, A), P2 = E.meridian(rx, A + 90);
    c.save(); c.fillStyle = C.surface; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.strokeStyle = C.axis; c.lineWidth = 1.2; c.stroke(); c.restore();
    for (let a = 0; a < 360; a += 10) {
      const r1 = R - (a % 30 === 0 ? 9 : 5), t = -a * D2R;
      stroke(c, [[cx + R * Math.cos(t), cy + R * Math.sin(t)], [cx + r1 * Math.cos(t), cy + r1 * Math.sin(t)]], C.axis, 1);
    }
    for (let a = 0; a <= 180; a += 30) { const t = -a * D2R; label(c, a + '°', cx + (R + 16) * Math.cos(t), cy + (R + 16) * Math.sin(t), { align: 'center', size: 10.5 }); }
    const arm = (deg, col, text) => {
      const t = -deg * D2R, ux = Math.cos(t), uy = Math.sin(t), up = uy <= 0 ? 1 : -1;
      stroke(c, [[cx - ux * R * 0.94, cy - uy * R * 0.94], [cx + ux * R * 0.94, cy + uy * R * 0.94]], col, 3);
      label(c, text, cx + up * ux * R * 0.6, cy + up * uy * R * 0.6, { align: 'center', size: 11.5, weight: 650, color: col, bg: C.surface });
    };
    arm(A, C.series[0], dpt(P1));
    arm(A2, C.series[1], dpt(P2));
    label(c, 'blue: the ' + A + '° meridian, ' + dpt(P1), cx, cy + R + 32, { align: 'center', size: 10.5, color: C.series[0] });
    label(c, 'orange: the ' + A2 + '° meridian, ' + dpt(P2), cx, cy + R + 47, { align: 'center', size: 10.5, color: C.series[1] });
    K.dot(c, cx, cy, 3.5, C.text);
  }
  /* power against the direction of the meridian, as a polar curve: the distance from the centre is the size of the power */
  function drawPolar(c, cx, cy, R, rx, C) {
    let mx = 0;
    for (let a = 0; a < 180; a += 2) mx = Math.max(mx, Math.abs(E.meridian(rx, a)));
    const st = [0.5, 1, 2, 5, 10, 20].find(v => mx / v <= 4) || 20, top = Math.max(st, Math.ceil(mx / st - 1e-9) * st), rr = p => Math.abs(p) / top * R;
    for (let v = st; v <= top + 1e-9; v += st) {
      c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, v / top * R, 0, TAU); c.stroke(); c.restore();
      label(c, f(v, v < 1 ? 1 : 0) + ' D', cx + v / top * R * 0.7071 + 2, cy - v / top * R * 0.7071, { size: 10 });
    }
    for (let a = 0; a < 180; a += 30) { const t = -a * D2R; stroke(c, [[cx - R * Math.cos(t), cy - R * Math.sin(t)], [cx + R * Math.cos(t), cy + R * Math.sin(t)]], C.grid, 1); }
    for (let a = 0; a <= 180; a += 30) { const t = -a * D2R; label(c, a + '°', cx + (R + 16) * Math.cos(t), cy + (R + 16) * Math.sin(t), { align: 'center', size: 10.5 }); }
    const se = E.sphericalEquivalent(rx);
    c.save(); c.strokeStyle = C.muted; c.setLineDash([4, 4]); c.beginPath(); c.arc(cx, cy, Math.max(0.5, rr(se)), 0, TAU); c.stroke(); c.restore();
    const pts = [];
    for (let a = 0; a <= 360; a += 3) { const p = E.meridian(rx, a), t = -a * D2R; pts.push([cx + rr(p) * Math.cos(t), cy + rr(p) * Math.sin(t), p]); }
    fill(c, pts, se < 0 ? 'rgba(80,140,255,0.14)' : 'rgba(255,150,40,0.14)');
    for (let i = 1; i < pts.length; i++) stroke(c, [pts[i - 1], pts[i]], (pts[i][2] + pts[i - 1][2]) / 2 < 0 ? C.series[0] : C.series[1], 2.6);
    for (const deg of [rx.axis, rx.axis + 90]) for (const a of [deg, deg + 180]) { const t = -a * D2R, r = rr(E.meridian(rx, a)); K.dot(c, cx + r * Math.cos(t), cy + r * Math.sin(t), 4, C.text, C.surface); }
    label(c, 'blue: minus power · orange: plus power', cx, cy + R + 32, { align: 'center', size: 10.5 });
    label(c, 'dashed ring: the spherical equivalent', cx, cy + R + 47, { align: 'center', size: 10.5 });
  }

  function prescription(el) {
    const L = T.util.lab(el, 'A spectacle prescription is a short code: a sphere power, a cylinder power and its axis, and sometimes a reading addition. Here the code is taken apart: written both ways, drawn as the power in every direction, converted to a contact lens, and tied to what the eye can do at its age. Only an eye examination measures an eye; this page shows what the numbers mean.', 0.5, { minH: 330 });
    const ctl = K.controls(L.side, [
      { id: 'sph', label: 'Sphere', min: -20, max: 20, step: 0.25, value: -2.25, fmt: v => dpt(v) },
      { id: 'cyl', label: 'Cylinder', min: -6, max: 6, step: 0.25, value: -0.75, fmt: v => dpt(v) },
      { id: 'axis', label: 'Axis', min: 1, max: 180, step: 1, value: 170, unit: '°' },
      { id: 'add', label: 'Reading addition', min: 0, max: 3.5, step: 0.25, value: 1.5, fmt: v => v < 0.01 ? 'none' : dpt(v) },
      { id: 'vd', label: 'Vertex distance of the glasses', min: 8, max: 16, step: 1, value: 12, unit: 'mm' },
      { id: 'age', label: 'Age', min: 10, max: 80, step: 1, value: 50, unit: 'years' },
      { id: 'dec', label: 'Decentration (for Prentice’s rule)', min: 0, max: 10, step: 0.5, value: 4, unit: 'mm' }
    ], () => draw());
    const V = ctl.values;
    const ro = K.readout(L.side, [['rx', 'Written with minus cylinder'], ['tp', 'Written with plus cylinder'], ['se', 'Spherical equivalent'], ['cl', 'At the eye (contact lens)'], ['far', 'Far point without glasses'], ['acc', 'Accommodation at this age'], ['n0', 'Near point without glasses'], ['n1', 'Near point in the distance glasses'], ['n2', 'Near point through the addition'], ['usual', 'Usual addition at this age'], ['pr', 'Prism from the decentration']]);
    L.under.innerHTML = '<div class="rw"></div><div class="rt"></div><div class="rm"></div>';
    const rw = ui.$('.rw', L.under), rt = ui.$('.rt', L.under);
    ui.$('.rm', L.under).innerHTML = T.util.more(['reading-a-prescription', 'cylinder-axis-and-transposition', 'vertex-distance-and-effective-power', 'prism-in-spectacles', 'astigmatism-of-the-eye', 'presbyopia', 'accommodation', 'bifocals-and-trifocals']);
    function draw() {
      const c = L.st.begin(), C = colors(), W = L.st.W, Hh = L.st.H;
      const rx = { sph: V.sph, cyl: V.cyl, axis: V.axis };
      const tp = E.transpose(rx), se = E.sphericalEquivalent(rx), vd = V.vd / 1000, amp = E.accommodation(V.age).avg;
      const P1 = E.meridian(rx, rx.axis), P2 = E.meridian(rx, rx.axis + 90), A2 = ((rx.axis + 90 - 1) % 180) + 1;
      const cl1 = E.vertex(P1, vd, 0), cl2 = E.vertex(P2, vd, 0), kse = E.vertex(se, vd, 0);
      /* the two drawings */
      const side = Math.max(120, Math.min(W / 2 - 24, Hh - 100)), R = side / 2 - 22, cy = Hh / 2 - 4;
      label(c, 'Power cross', W / 4, 14, { align: 'center', size: 12, weight: 650, color: C.text });
      label(c, 'Power in every direction', 3 * W / 4, 14, { align: 'center', size: 12, weight: 650, color: C.text });
      drawDial(c, W / 4, cy, R, rx, C);
      drawPolar(c, 3 * W / 4, cy - 6, R, rx, C);
      /* read-outs */
      ro.set('rx', rxText(rx) + (V.add > 0 ? ', add ' + dpt(V.add) : ''));
      ro.set('tp', Math.abs(V.cyl) < 0.005 ? 'no cylinder: the same' : rxText(tp));
      ro.set('se', dpt(se));
      ro.set('cl', rxText({ sph: cl1, cyl: cl2 - cl1, axis: rx.axis }));
      const fp = E.farPoint(kse);
      ro.set('far', Math.abs(kse) < 0.005 ? 'infinity' : fp > 0 ? dist(fp) : 'behind the eye: even distance needs focusing');
      ro.set('acc', f(amp, 1) + ' D (typical, with this age)');
      const np = E.nearPoint(kse, amp), n1 = through(kse, amp, se, vd).near, n2 = through(kse, amp, se + V.add, vd).near;
      ro.set('n0', Number.isFinite(np) ? dist(np) : 'none: it cannot focus on anything');
      ro.set('n1', Number.isFinite(n1) ? dist(n1) : 'none');
      ro.set('n2', V.add < 0.01 ? 'no addition set' : Number.isFinite(n2) ? dist(n2) : 'none');
      ro.set('usual', V.age < 40 ? 'none is usual before about 40' : dpt(addFor(V.age)) + ' (typical)');
      const Ph = E.meridian(rx, 0), Pv = E.meridian(rx, 90), cm = V.dec / 10;
      ro.set('pr', f(E.prentice(Ph, cm), 2) + ' Δ horizontal · ' + f(E.prentice(Pv, cm), 2) + ' Δ vertical');
      rw.innerHTML = T.util.box('In plain words', '<p class="small" style="margin:0">' + esc(describe(rx, V.age, amp, V.add)) + '</p>');
      const row = (name, P) => [name, dpt(P), dpt(E.vertex(P, vd, 0)), f(E.prentice(P, cm), 2) + ' Δ'];
      rt.innerHTML = '<div style="margin-top:10px">' + T.util.table(['Meridian', 'Power in the glasses', 'As a contact lens', 'Prism from ' + f(V.dec, 1) + ' mm of decentration'],
        [row('Along the axis (' + rx.axis + '°)', P1), row('Across the axis (' + A2 + '°)', P2), row('Horizontal (180°)', Ph), row('Vertical (90°)', Pv)]) + '</div>' +
        '<p class="small muted mt">The cylinder adds its power only across its axis, so along the axis the eye sees the sphere alone. Moving glasses closer to the eye weakens a plus lens and strengthens a minus lens in the same ratio as a contact lens does; the change matters above about 4 D. Prentice’s rule, prism = power × decentration in centimetres, says how much a lens deflects light that passes off its optical centre.</p>';
    }
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }

  /* ================================================================ 3 · acuity and blur */
  /* the Sloan letters on a 5 × 5 grid, as strokes of one unit width: M move, L line, A arc, E ellipse arc (y runs down) */
  const pt = (cx, cy, r, a) => ['M', cx + r * Math.cos(a), cy + r * Math.sin(a)], PI = Math.PI;
  const GLYPH = {
    C: [pt(2.5, 2.5, 2, 0.62), ['A', 2.5, 2.5, 2, 0.62, TAU - 0.62, 0]],
    D: [['M', 0.5, 0], ['L', 0.5, 5], ['M', 0.5, 0.5], ['L', 2.2, 0.5], ['A', 2.2, 2.5, 2, -PI / 2, PI / 2, 0], ['L', 0.5, 4.5]],
    H: [['M', 0.5, 0], ['L', 0.5, 5], ['M', 4.5, 0], ['L', 4.5, 5], ['M', 0.5, 2.5], ['L', 4.5, 2.5]],
    K: [['M', 0.5, 0], ['L', 0.5, 5], ['M', 4.6, 0.1], ['L', 0.9, 2.8], ['M', 1.9, 2.2], ['L', 4.7, 4.9]],
    N: [['M', 0.5, 0], ['L', 0.5, 5], ['M', 4.5, 0], ['L', 4.5, 5], ['M', 0.5, 0.3], ['L', 4.5, 4.7]],
    O: [pt(2.5, 2.5, 2, 0), ['A', 2.5, 2.5, 2, 0, TAU, 0]],
    R: [['M', 0.5, 0], ['L', 0.5, 5], ['M', 0.5, 0.5], ['L', 2.5, 0.5], ['A', 2.5, 1.9, 1.4, -PI / 2, PI / 2, 0], ['L', 0.5, 3.3], ['M', 2.1, 3.4], ['L', 4.6, 5]],
    S: [pt(2.5, 1.5, 2, -0.2 * PI), ['E', 2.5, 1.5, 2, 1, -0.2 * PI, -1.5 * PI, 1], ['E', 2.5, 3.5, 2, 1, -PI / 2, 0.8 * PI, 0]],
    V: [['M', 0.6, 0], ['L', 2.5, 4.9], ['M', 4.4, 0], ['L', 2.5, 4.9]],
    Z: [['M', 0, 0.5], ['L', 5, 0.5], ['M', 4.4, 0.7], ['L', 0.6, 4.3], ['M', 0, 4.5], ['L', 5, 4.5]]
  };
  /* adds the strokes of a letter, h pixels tall with its top left corner at (x, y), to the current path */
  function glyph(c, ch, x, y, h) {
    const u = h / 5;
    for (const o of GLYPH[ch]) {
      if (o[0] === 'M') c.moveTo(x + o[1] * u, y + o[2] * u);
      else if (o[0] === 'L') c.lineTo(x + o[1] * u, y + o[2] * u);
      else if (o[0] === 'A') c.arc(x + o[1] * u, y + o[2] * u, o[3] * u, o[4], o[5], !!o[6]);
      else c.ellipse(x + o[1] * u, y + o[2] * u, o[3] * u, o[4] * u, 0, o[5], o[6], !!o[7]);
    }
  }
  // the rows of the chart: metric denominator at 6 m (6/x), the letters, and the Snellen denominator 20/x
  const ROWS = [[60, 'K'], [36, 'CZ'], [24, 'HOR'], [18, 'DNS'], [12, 'VKHC'], [9, 'ZRON'], [6, 'SDKVH'], [4.5, 'NCZOR'], [3, 'HVSKD']].map(r => ({ den: r[0], letters: r[1], den20: Math.round(r[0] * 20 / 6 * 10) / 10 }));
  const ROW_H = ROWS.map(r => E.letterHeight(6, r.den20) / E.letterHeight(6, 20));                      // the height of each row's letters, in units of the 6/6 letter
  /* n points spread evenly over an ellipse of semi-axes a (along the angle theta) and b (across), in pixels */
  function blurSamples(a, b, theta, n) {
    const o = [], ca = Math.cos(theta), sa = Math.sin(theta);
    for (let i = 0; i < n; i++) { const r = Math.sqrt((i + 0.5) / n), ph = i * 2.399963, x = a * r * Math.cos(ph), y = b * r * Math.sin(ph); o.push([x * ca - y * sa, x * sa + y * ca]); }
    return o;
  }
  /* the blur of an uncorrected eye looking at a chart d metres away: errors along and across the cylinder axis, sizes in arc-minutes */
  function acuModel(V) {
    const p = V.pin ? 1 : V.pupil, vg = 1 / V.dist, myope = V.kind === 'myopia';
    const e1 = myope ? Math.max(0, V.sph - vg) : V.sph + vg, e2 = myope ? Math.max(0, V.sph + V.cyl - vg) : V.sph + V.cyl + vg;
    const g1 = E.blurAngle(e1, p) * ARCMIN, g2 = E.blurAngle(e2, p) * ARCMIN, wd = 2.44 * 550e-6 / p * ARCMIN;       // wd: the Airy disc of this pupil
    const x = Math.max(E.acuityFromDefocus(Math.max(e1, e2) * p / 4), Math.max(20, Math.round(20 * 1.03 * 550e-6 / p * ARCMIN / 5) * 5));
    const k = 6 / V.dist, rowAt = ROWS.reduce((best, r, i) => r.den20 * k >= x - 1e-9 ? i : best, -1);              // the smallest row whose letters the eye can read
    return { p, e1, e2, g1, g2, wd, w1: Math.hypot(g1, wd), w2: Math.hypot(g2, wd), x, rowAt };
  }

  function acuity(el) {
    const L = T.util.lab(el, 'Visual acuity is the smallest detail the eye can pick out. On a chart it is the smallest row of letters that can be read: a 6/6 letter, 8.7 mm tall at 6 m, is built so that each stroke is one arc-minute wide. An eye that is out of focus spreads every point into a blur patch; letters whose strokes are narrower than the patch dissolve. Choose an uncorrected error, astigmatism, a pupil size or a pinhole and the chart is drawn through that blur. Only an eye examination measures an eye.', 0.66, { minH: 400, maxH: 760 });
    const ctl = K.controls(L.side, [
      { id: 'sph', label: 'Spherical error left uncorrected', min: 0, max: 6, step: 0.25, value: 1.5, fmt: v => f(v, 2) + ' D' },
      { id: 'kind', type: 'select', label: 'Kind of error', options: [['Short-sighted: the focus falls in front', 'myopia'], ['Long-sighted, without focusing: the focus falls behind', 'hyperopia']], value: 'myopia' },
      { id: 'cyl', label: 'Astigmatism', min: 0, max: 3, step: 0.25, value: 0, fmt: v => f(v, 2) + ' D' },
      { id: 'axis', label: 'Axis of the astigmatism', min: 1, max: 180, step: 1, value: 90, unit: '°' },
      { id: 'pupil', label: 'Pupil diameter', min: 2, max: 8, step: 0.5, value: 4, unit: 'mm' },
      { id: 'pin', type: 'check', label: 'Pinhole in front of the eye (1 mm)', value: false },
      { id: 'dist', type: 'select', label: 'Viewing distance', options: [['2 m', 2], ['3 m', 3], ['4 m', 4], ['6 m (the usual chart distance)', 6], ['10 m', 10], ['20 m', 20]], value: 6 },
      { id: 'sharp', type: 'check', label: 'Show the chart itself beside it', value: false }
    ], () => draw());
    const V = ctl.values;
    const ro = K.readout(L.side, [['blur', 'Blur patch (defocus only)'], ['diff', 'Diffraction at this pupil'], ['row', 'Smallest row that should be readable'], ['acu', 'Acuity'], ['cpd', 'Finest grating resolved']]);
    function draw() {
      const c = L.st.begin(), C = colors(), W = L.st.W, Hh = L.st.H, M = acuModel(V);
      const LW = W < 560 ? 96 : 128, pad = 10, top = 24, x0 = LW + pad, two = V.sharp, pw = two ? (W - x0 - pad - 10) / 2 : W - x0 - pad;
      const sumH = ROW_H.reduce((a, b) => a + b, 0), availH = Hh - top - 8;
      const u = Math.max(2, Math.min((availH - 2 * ROWS.length) / (sumH * 1.4), (pw - 16) / (18.4 * 0.95)));              // pixels of a 6/6 letter's height
      const ppa = u * V.dist / 30;                                                                                          // pixels per arc-minute on the chart
      const a1 = M.w1 / 2 * ppa, a2 = M.w2 / 2 * ppa, bmax = Math.max(a1, a2), nS = bmax < 0.35 ? 1 : clamp(Math.round(16 + bmax * 2), 16, 90);
      const offs = nS === 1 ? [[0, 0]] : blurSamples(a1, a2, -V.axis * D2R, nS), al = nS === 1 ? 1 : 1 - Math.pow(0.04, 1 / nS);
      label(c, 'As the eye sees it', x0, 12, { weight: 650, color: C.text, size: 12 });
      if (two) label(c, 'The chart itself', x0 + pw + 10, 12, { weight: 650, color: C.text, size: 12 });
      const papers = two ? [[x0, true], [x0 + pw + 10, false]] : [[x0, true]];
      let y = top;
      const ys = ROWS.map((r, i) => { const h = u * ROW_H[i], t = y; y += h + 0.4 * h + 2; return [t, h]; });
      for (const [px, blurred] of papers) {
        c.save(); c.fillStyle = '#f4f2ea'; c.fillRect(px, top - 6, pw, ys[ys.length - 1][0] + ys[ys.length - 1][1] + 12 - top); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(px + 0.5, top - 5.5, pw - 1, ys[ys.length - 1][0] + ys[ys.length - 1][1] + 11 - top);
        c.beginPath(); c.rect(px, top - 6, pw, ys[ys.length - 1][0] + ys[ys.length - 1][1] + 12 - top); c.clip();
        ROWS.forEach((r, i) => {
          const [ty, h] = ys[i], n = r.letters.length, gap = 0.9 * h, rowW = n * h + (n - 1) * gap, lx = px + (pw - rowW) / 2;
          c.strokeStyle = '#15151b'; c.lineWidth = Math.max(0.6, h / 5); c.lineCap = 'butt'; c.lineJoin = 'miter';
          for (const [dx, dy] of blurred ? offs : [[0, 0]]) {
            c.globalAlpha = blurred ? al : 1; c.beginPath();
            for (let k = 0; k < n; k++) glyph(c, r.letters[k], lx + k * (h + gap) + dx, ty + dy, h);
            c.stroke();
          }
        });
        c.restore();
      }
      ROWS.forEach((r, i) => {
        const [ty, h] = ys[i], mid = ty + h / 2, hit = i === M.rowAt;
        label(c, LW >= 124 ? '6/' + r.den + ' · 20/' + r.den20 + ' · ' + f(E.logmar(r.den20), 2) : '6/' + r.den + ' · 20/' + r.den20, 6, mid, { size: 10.5, color: hit ? C.ok : C.muted, weight: hit ? 700 : 500 });
        if (hit) { c.save(); c.fillStyle = C.ok; path(c, [[x0 - 8, mid - 5], [x0 - 2, mid], [x0 - 8, mid + 5]], true); c.fill(); c.restore(); }
      });
      /* read-outs */
      const g1 = M.g1, g2 = M.g2;
      ro.set('blur', Math.abs(g1 - g2) < 0.05 ? f(g1, 1) + '′ across (about ' + Math.round(g1 * 4.94) + ' µm on the retina)' : f(g1, 1) + '′ along the axis, ' + f(g2, 1) + '′ across it');
      ro.set('diff', f(M.wd, 1) + '′ across (Airy disc)');
      ro.set('row', M.rowAt < 0 ? 'none: even the largest row is too small' : '6/' + ROWS[M.rowAt].den + ' (20/' + ROWS[M.rowAt].den20 + ')');
      ro.set('acu', acuText(M.x) + ' · logMAR ' + f(E.logmar(M.x), 2) + ' · decimal ' + f(20 / M.x, 2));
      ro.set('cpd', f(600 / M.x, 0) + ' cycles per degree');
    }
    const tbl = T.util.table(['Row at 6 m', 'Snellen (feet)', 'logMAR', 'Decimal', 'Letter height', 'Stroke width'], ROWS.map(r => ['6/' + r.den, '20/' + r.den20, f(E.logmar(r.den20), 2), f(20 / r.den20, 2), f(E.letterHeight(6, r.den20) * 1000, 1) + ' mm', f(r.den20 / 20, 2) + '′']));
    L.under.innerHTML = '<p class="small muted mt">Each letter is five strokes tall and wide, and a stroke is one-fifth of the letter. In the 6/6 row a stroke is one arc-minute across; each row down the chart is smaller by the steps of the standard scale. The blur is made by drawing every letter many times, slightly displaced across the blur patch: a round patch for an eye out of focus, a line for astigmatism, lying across the axis of the cylinder. The smallest readable row is an estimate from the size of the blur, not a measurement.</p>' + '<div style="margin-top:10px">' + tbl + '</div>' +
      T.util.more(['visual-acuity-charts', 'the-fovea-and-visual-acuity', 'myopia', 'hyperopia', 'astigmatism-of-the-eye', 'the-pupil', 'the-eye-examination', 'the-phoropter-and-subjective-refraction']);
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }
  /* ================================================================ 4 · progressive lenses */
  const LENS_R = 30, PAL_START = -4;                                // the blank is 60 mm across; the power starts to rise 4 mm below the fitting cross
  const DESIGNS = [['A progressive lens', 'pal'], ['A flat-top bifocal', 'bif'], ['A single-vision lens', 'sv']];
  /* the added power and the unwanted astigmatism of a design at (x, y) mm from the fitting cross (y up) */
  function lensAt(design, x, y, o) {
    if (design === 'pal') return E.pal(x, y, o);
    if (design === 'bif') return { add: y <= -5 && x * x + (y + 5) * (y + 5) <= 196 ? o.add : 0, cyl: 0 };      // a D-shaped segment 28 mm wide, its flat top 5 mm below the cross
    return { add: 0, cyl: 0 };
  }
  const ramp = (stops, t) => { t = clamp(t, 0, 1); const n = stops.length - 1, i = Math.min(n - 1, Math.floor(t * n)), k = t * n - i; return stops[i].map((v, j) => v + (stops[i + 1][j] - v) * k); };
  const POWER_RAMP = [[238, 244, 252], [150, 190, 232], [52, 110, 190], [20, 52, 120]], CYL_RAMP = [[250, 248, 238], [250, 214, 120], [232, 120, 52], [150, 30, 40]];
  /* the line segments of the contour at a level of a grid of values (nx × ny vertices, one unit apart): [[x1, y1, x2, y2] …] */
  function contour(vals, nx, ny, lev) {
    const segs = [], v = (i, j) => vals[j * nx + i], cr = (a, b) => (lev - a) / (b - a);
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const a = v(i, j), b = v(i + 1, j), c2 = v(i + 1, j + 1), d = v(i, j + 1), e = [];
      if ((a > lev) !== (b > lev)) e.push([i + cr(a, b), j]);
      if ((b > lev) !== (c2 > lev)) e.push([i + 1, j + cr(b, c2)]);
      if ((d > lev) !== (c2 > lev)) e.push([i + cr(d, c2), j + 1]);
      if ((a > lev) !== (d > lev)) e.push([i, j + cr(a, d)]);
      if (e.length === 2) segs.push([e[0][0], e[0][1], e[1][0], e[1][1]]);
      else if (e.length === 4) { segs.push([e[0][0], e[0][1], e[3][0], e[3][1]]); segs.push([e[1][0], e[1][1], e[2][0], e[2][1]]); }
    }
    return segs;
  }
  /* the width of the corridor where half the addition is reached (astigmatism below 0.5 D) and the widest clear near zone, in mm */
  function clearWidths(o) {
    const clear = y => { let x = 0; const lim = Math.sqrt(Math.max(0, LENS_R * LENS_R - y * y)); while (x < lim && E.pal(x, y, o).cyl < 0.5) x += 0.1; return 2 * Math.min(x, lim); };
    let near = 0;
    for (let y = o.start - o.corridor; y >= -LENS_R; y -= 0.5) near = Math.max(near, clear(y));
    return { corridor: clear(o.start - o.corridor / 2), near };
  }

  function progressive(el) {
    const L = T.util.lab(el, 'A progressive lens changes power smoothly from the distance prescription at the top to the full reading addition at the bottom, with no dividing line. The price is unwanted astigmatism in the sides of the lens, which grows sideways twice as fast as the power grows downwards (Minkwitz’s theorem). Both maps show a round lens blank 60 mm across, centred on the fitting cross. They come from a schematic model of a progressive design that follows that theorem; they are not a measured lens. Drag over either map to read the power and the astigmatism at a point.', 0.54, { minH: 360 });
    const ctl = K.controls(L.side, [
      { id: 'design', type: 'select', label: 'Lens design', options: DESIGNS.map(d => [d[0], d[1]]), value: 'pal' },
      { id: 'add', label: 'Reading addition', min: 0.75, max: 3.5, step: 0.25, value: 2, fmt: v => dpt(v) },
      { id: 'cor', label: 'Corridor length', min: 10, max: 20, step: 1, value: 14, unit: 'mm' },
      { id: 'nw', label: 'Width of the near zone', min: 10, max: 24, step: 1, value: 14, unit: 'mm' }
    ], () => draw());
    const V = ctl.values;
    const ro = K.readout(L.side, [['at', 'Cursor'], ['pow', 'Added power there'], ['cyl', 'Unwanted astigmatism there'], ['zone', 'Zone'], ['cor', 'Corridor, half the addition reached'], ['near', 'Widest clear near zone']]);
    let cur = { x: 0, y: -22 };
    L.under.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:6px"><div class="pa" style="flex:1 1 300px;min-width:0"></div><div class="pb" style="flex:1 1 300px;min-width:0"></div></div><p class="small muted mt">Left: the added power down the centre line of each design. Right: the unwanted astigmatism along a horizontal line at the height of the cursor, for the chosen design; below the dashed 0.5 D line the eye hardly notices it. A bifocal has no astigmatism but a visible edge, where the image jumps; a single-vision lens has the same power everywhere and is clear everywhere, but its wearer must change glasses to see near.</p>' + T.util.more(['progressive-lenses', 'bifocals-and-trifocals', 'occupational-and-computer-lenses', 'presbyopia', 'reading-a-prescription']);
    const pa = K.plot(ui.$('.pa', L.under), { x: { label: 'height above the fitting cross (mm)', min: -30, max: 30 }, y: { label: 'added power (D)', min: 0, max: 4 }, series: [] }, 230);
    const pb = K.plot(ui.$('.pb', L.under), { x: { label: 'across the lens (mm)', min: -30, max: 30 }, y: { label: 'unwanted astigmatism (D)', min: 0, max: 4 }, series: [] }, 230);
    const opts = () => ({ add: V.add, corridor: V.cor, start: PAL_START, nearWidth: V.nw / 2 });
    function geo() {
      const W = L.st.W, Hh = L.st.H, D = Math.max(110, Math.min((W - 60) / 2, Hh - 100)), s = D / (2 * LENS_R), cy = 28 + D / 2;
      return { W, Hh, D, s, cy, cxL: W / 2 - D / 2 - 14, cxR: W / 2 + D / 2 + 14 };
    }
    const pill = 'rgba(255,255,255,0.86)', ink = '#1a1a22';
    function draw() {
      const c = L.st.begin(), C = colors(), g = geo(), { D, s, cy } = g, o = opts(), des = V.design;
      const cMax = Math.max(1, Math.ceil(1.1 * V.add * 2) / 2), N = 2 * LENS_R + 1, pv = new Float64Array(N * N), cv = new Float64Array(N * N);
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const q = lensAt(des, i - LENS_R, LENS_R - j, o); pv[j * N + i] = q.add; cv[j * N + i] = q.cyl; }
      const panels = [[g.cxL, 'Added power', (x, y) => ramp(POWER_RAMP, lensAt(des, x, y, o).add / V.add), pv, V.add, POWER_RAMP, 'added power (D)'],
        [g.cxR, 'Unwanted astigmatism', (x, y) => ramp(CYL_RAMP, lensAt(des, x, y, o).cyl / cMax), cv, cMax, CYL_RAMP, 'unwanted astigmatism (D)']];
      panels.forEach(([cx, title, col, vals, vmax, rmp, keyTitle], k) => {
        label(c, title, cx, 14, { align: 'center', size: 12.5, weight: 650, color: C.text });
        c.save(); c.beginPath(); c.arc(cx, cy, D / 2, 0, TAU); c.clip();
        S.image(c, cx - D / 2, cy - D / 2, D, D, 120, 120, (u, v) => col((u - 0.5) * 2 * LENS_R, (0.5 - v) * 2 * LENS_R), { smooth: des !== 'bif' });
        for (let lev = 0.5; lev < vmax - 1e-6; lev += 0.5) {
          const wide = k === 1 && lev === 0.5;
          c.strokeStyle = wide ? 'rgba(10,10,20,0.9)' : 'rgba(10,10,20,0.45)'; c.lineWidth = wide ? 2 : 1; c.beginPath();
          for (const q of contour(vals, N, N, lev)) { c.moveTo(cx + (q[0] - LENS_R) * s, cy + (q[1] - LENS_R) * s); c.lineTo(cx + (q[2] - LENS_R) * s, cy + (q[3] - LENS_R) * s); }
          c.stroke();
        }
        c.restore();
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.6; c.beginPath(); c.arc(cx, cy, D / 2, 0, TAU); c.stroke(); c.restore();
        stroke(c, [[cx - 7, cy], [cx + 7, cy]], '#101018', 1.6); stroke(c, [[cx, cy - 7], [cx, cy + 7]], '#101018', 1.6);
        // the cursor
        const kx = cx + cur.x * s, ky = cy - cur.y * s;
        c.save(); c.strokeStyle = '#ffffff'; c.lineWidth = 3.4; c.beginPath(); c.arc(kx, ky, 7, 0, TAU); c.stroke(); c.strokeStyle = '#101018'; c.lineWidth = 1.6; c.beginPath(); c.arc(kx, ky, 7, 0, TAU); c.stroke(); c.restore();
        // the key under the map
        const ky0 = cy + D / 2 + 14, kw = D;
        S.cells(c, cx - kw / 2, ky0, kw, 10, 60, 1, u => rmp.length ? ramp(rmp, u) : [0, 0, 0]);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(cx - kw / 2 + 0.5, ky0 + 0.5, kw - 1, 9);
        for (let v = 0; v <= vmax + 1e-6; v += 0.5) label(c, f(v, 1), cx - kw / 2 + kw * v / vmax, ky0 + 20, { align: 'center', size: 10 });
        label(c, keyTitle + (k === 1 ? ': the 0.5 D line is bold' : ''), cx, ky0 + 34, { align: 'center', size: 10.5 });
      });
      /* names of the zones, on the maps */
      const tag = (cx, x, y, text, al) => label(c, text, cx + x * s, cy - y * s, { size: 10.5, color: ink, bg: pill, align: al || 'center' });
      if (des === 'pal') {
        const yMid = PAL_START - V.cor / 2, yNear = PAL_START - V.cor - 6;
        tag(g.cxL, 0, 15, 'distance'); tag(g.cxL, -26, yMid, 'intermediate', 'left'); tag(g.cxL, 0, Math.max(yNear, -26), 'near');
        tag(g.cxR, 0, 15, 'clear'); tag(g.cxR, -26, yMid - 3, 'clear corridor', 'left'); tag(g.cxR, 0, Math.max(yNear, -26), 'clear near zone'); tag(g.cxR, 26, yMid + 4, 'blurred sides', 'right');
        for (const yy of [PAL_START, PAL_START - V.cor]) stroke(c, [[g.cxL - D / 2 + 6, cy - yy * s], [g.cxL + D / 2 - 6, cy - yy * s]], 'rgba(10,10,20,0.5)', 1, [4, 3]);
      } else if (des === 'bif') {
        tag(g.cxL, 0, 15, 'distance'); tag(g.cxL, 0, -13, 'reading segment'); tag(g.cxR, 0, 15, 'no astigmatism');
      } else { tag(g.cxL, 0, 15, 'one power everywhere'); tag(g.cxR, 0, 15, 'clear everywhere'); }
      tag(g.cxL, 0, 5, 'fitting cross');
      /* read-outs and plots */
      const q = lensAt(des, cur.x, cur.y, o);
      ro.set('at', mn(cur.x, 1) + ' mm across, ' + mn(cur.y, 1) + ' mm up');
      ro.set('pow', dpt(q.add) + ' of ' + dpt(V.add));
      ro.set('cyl', f(q.cyl, 2) + ' D' + (q.cyl < 0.5 ? ' (below 0.5 D)' : ''));
      ro.set('zone', des === 'pal' ? (cur.y > PAL_START ? 'distance zone' : cur.y > PAL_START - V.cor ? 'intermediate, along the corridor' : 'near zone') : des === 'bif' ? (q.add > 0 ? 'reading segment' : 'distance part') : 'the whole lens');
      const cw = des === 'pal' ? clearWidths(o) : null;
      ro.set('cor', cw ? f(cw.corridor, 1) + ' mm' : des === 'bif' ? 'no corridor: the power jumps at the edge' : 'no addition');
      ro.set('near', cw ? f(cw.near, 1) + ' mm' : des === 'bif' ? '28 mm (the segment)' : 'none');
      const ys = [], p0 = [], p1 = [], p2 = [], xs = [];
      for (let y = -LENS_R; y <= LENS_R; y += 0.5) { ys.push(y); p0.push([y, E.pal(0, y, o).add]); p1.push([y, lensAt('bif', 0, y, o).add]); p2.push([y, 0]); }
      for (let x = -LENS_R; x <= LENS_R; x += 0.5) xs.push([x, lensAt(des, x, cur.y, o).cyl]);
      pa.set({ y: { label: 'added power (D)', min: 0, max: Math.ceil(V.add) + 0.5 }, series: [{ pts: p0, label: 'progressive', color: C.series[0] }, { pts: p1, label: 'flat-top bifocal', color: C.series[1], dash: [6, 3] }, { pts: p2, label: 'single vision', color: C.series[2], dash: [2, 3] }], vlines: [{ x: cur.y, label: 'cursor' }] });
      pb.set({ y: { label: 'unwanted astigmatism (D)', min: 0, max: cMax }, series: [{ pts: xs, label: 'at the cursor’s height', color: C.warn }], hlines: [{ y: 0.5, label: '0.5 D' }], vlines: [{ x: cur.x, label: 'cursor' }] });
    }
    const place = p => {
      const g = geo(), left = p.x < g.W / 2, cx = left ? g.cxL : g.cxR;
      let x = (p.x - cx) / g.s, y = (g.cy - p.y) / g.s; const r = Math.hypot(x, y);
      if (r > LENS_R - 0.3) { x *= (LENS_R - 0.3) / r; y *= (LENS_R - 0.3) / r; }
      cur = { x, y }; draw();
    };
    K.drag(L.st, {
      hit: p => { const g = geo(); return Math.hypot(p.x - g.cxL, p.y - g.cy) <= g.D / 2 + 6 || Math.hypot(p.x - g.cxR, p.y - g.cy) <= g.D / 2 + 6 ? 'cur' : null; },
      start: (t, p) => place(p), move: (t, p) => place(p), hover: true
    });
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }

  /* ================================================================ 5 · the visual field */
  const FLD = E.FIELD, NEXP = 2.3;                                  // the field outline is a smooth superellipse through the four limits
  const limits = eye => eye === 'right' ? { l: FLD.nasal, r: FLD.temporal } : { l: FLD.temporal, r: FLD.nasal };       // left and right extent, seen looking out (x to the right, y up)
  const inField = (x, y, eye) => { const q = limits(eye), a = x < 0 ? q.l : q.r, b = y >= 0 ? FLD.up : FLD.down; return Math.pow(Math.abs(x) / a, NEXP) + Math.pow(Math.abs(y) / b, NEXP) <= 1; };
  function outline(eye, n) {
    const q = limits(eye), pts = [];
    for (let i = 0; i < n; i++) {
      const t = TAU * i / n, ct = Math.cos(t), st = Math.sin(t), a = ct < 0 ? q.l : q.r, b = st >= 0 ? FLD.up : FLD.down;
      pts.push([Math.sign(ct) * a * Math.pow(Math.abs(ct), 2 / NEXP), Math.sign(st) * b * Math.pow(Math.abs(st), 2 / NEXP)]);
    }
    return pts;
  }
  let AREAS = null;                                                 // areas of the outlines on the chart, in square degrees, counted on a one-degree grid
  function areas() {
    if (AREAS) return AREAS;
    let r = 0, l = 0, u = 0, ov = 0;
    for (let x = -99.5; x < 100; x += 1) for (let y = -74.5; y < 60; y += 1) { const a = inField(x, y, 'right'), b = inField(x, y, 'left'); if (a) r++; if (b) l++; if (a || b) u++; if (a && b) ov++; }
    return (AREAS = { right: r, left: l, both: u, overlap: ov });
  }
  const FRAME = { a: 25, b: 20, r: 8 };                             // the lens of a frame, as seen from the eye: ±25° across, ±20° up and down
  const frameArea = FRAME.a * FRAME.b * 4 - (4 - Math.PI) * FRAME.r * FRAME.r;
  const ZONES = [[FLD.colour, 'colour vision, to about 60°', 'colour, to 60°'], [30, 'recognising symbols, about 30°', 'symbols, 30°'], [5, 'reading zone, about 5°', 'reading, 5°'], [2, 'sharpest vision (fovea), about 2°', 'fovea, 2°']];
  const csfCut = () => { let fq = 8; while (fq < 150 && 100 * E.csf(fq) >= 1) fq += 0.1; return fq; };                // where the curve reaches a contrast of 100 %, with a peak sensitivity of 100

  function field(el) {
    const L = T.util.lab(el, 'The visual field is everything the eye sees at once while it looks straight ahead. Each eye reaches about 60° towards the nose and 100° towards the temple, 60° up and 75° down; the two overlap in the middle, which is where depth is seen. Only a very small patch at the centre sees sharply: the rest of the field is for noticing movement and shape. The chart is drawn as if you were looking out, with rings every 10° from the line of sight. Below it, the contrast-sensitivity curve shows how fine a pattern the eye can pick out at each size of detail.', 0.62, { minH: 380, maxH: 720 });
    const ctl = K.controls(L.side, [
      { id: 'eye', type: 'select', label: 'Eyes', options: [['Right eye', 'right'], ['Left eye', 'left'], ['Both eyes, the overlap marked', 'both']], value: 'both' },
      { id: 'zones', type: 'check', label: 'Show the zones of vision', value: true },
      { id: 'frame', type: 'check', label: 'Show the lens of a spectacle frame', value: false },
      { id: 'pupil', label: 'Pupil (for the sharpness limit of the optics)', min: 2, max: 8, step: 0.5, value: 3, unit: 'mm' }
    ], () => draw());
    const V = ctl.values;
    const ro = K.readout(L.side, [['h', 'Total horizontal field'], ['v', 'Total vertical field'], ['ov', 'Overlap of the two eyes'], ['sharp', 'Sharpest vision (2°), share of the field'], ['read', 'Reading zone (5°), share of the field'], ['lens', 'Seen through the frame’s lens'], ['blind', 'Blind spot'], ['cut', 'Acuity cut-off of the curve'], ['diff', 'Diffraction limit of the pupil']]);
    L.under.innerHTML = '<div class="fp" style="margin-top:6px"></div><p class="small muted mt">The curve is the typical sensitivity of a young adult by day, scaled so that its peak, near 8 cycles per degree, is a sensitivity of 100 (a contrast of 1 %). It falls to a contrast of 100 % at the finest detail the eye can see, about 50 cycles per degree: that is its acuity limit. 6/6 corresponds to 30 cycles per degree. The optics of the eye cannot pass detail finer than the diffraction limit of the pupil. Areas are measured on the flat chart, in square degrees, not on the sphere.</p>' +
      T.util.more(['the-visual-field', 'contrast-sensitivity', 'perimetry', 'binocular-vision-and-stereopsis', 'the-fovea-and-visual-acuity', 'the-retina-rods-and-cones', 'glaucoma-and-the-visual-field']);
    const plot = K.plot(ui.$('.fp', L.under), { x: { label: 'spatial frequency (cycles per degree)', log: true, min: 0.5, max: 120 }, y: { label: 'contrast sensitivity', log: true, min: 0.3, max: 300 }, series: [] }, 260);
    const fcut = csfCut(), pts = [];
    for (let fq = 0.5; fq <= 120; fq *= 1.05) pts.push([fq, Math.max(100 * E.csf(fq), 1e-3)]);
    function geo() {
      const W = L.st.W, Hh = L.st.H, narrow = W < 680, R = clamp(narrow ? Math.min(Hh / 2 - 26, (W - 175) / 2) : Math.min(W / 2 - 38, Hh / 2 - 26), 60, 420);
      return { W, Hh, R, narrow, s: R / 100, cx: narrow ? W - R - 24 : W / 2, cy: Hh / 2 + 4 };
    }
    function draw() {
      const c = L.st.begin(), C = colors(), { W, Hh, R, s, cx, cy, narrow } = geo(), eyes = V.eye === 'both' ? ['right', 'left'] : [V.eye];
      const X = x => cx + x * s, Y = y => cy - y * s, tr = pts2 => pts2.map(p => [X(p[0]), Y(p[1])]);
      /* rings every 10 degrees, spokes every 30 */
      for (let r = 10; r <= 100; r += 10) {
        c.save(); c.strokeStyle = r % 50 === 0 ? C.axis : C.grid; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, r * s, 0, TAU); c.stroke(); c.restore();
        if (r % 20 === 0 || r === 10) label(c, r + '°', cx + 3, cy + r * s + 1, { size: 10, align: 'left' });
      }
      for (let a = 0; a < 180; a += 30) { const t = a * D2R; stroke(c, [[cx - R * Math.cos(t), cy + R * Math.sin(t)], [cx + R * Math.cos(t), cy - R * Math.sin(t)]], C.grid, 1); }
      /* the fields */
      const cols = { right: C.series[0], left: C.series[1] }, outs = {};
      for (const e of eyes) {
        outs[e] = tr(outline(e, 180));
        c.save(); c.globalAlpha = 0.2; c.fillStyle = cols[e]; path(c, outs[e], true); c.fill(); c.restore();
      }
      if (eyes.length === 2) { c.save(); path(c, outs.right, true); c.clip(); c.globalAlpha = 0.34; c.fillStyle = C.ok; path(c, outs.left, true); c.fill(); c.restore(); }
      for (const e of eyes) stroke(c, outs[e], cols[e], 2.4, null, true);
      /* the zones: circles about the line of sight */
      if (V.zones) ZONES.forEach(([r, name], i) => {
        c.save(); c.strokeStyle = C.text; c.lineWidth = i > 1 ? 1.6 : 1.1; c.setLineDash(i === 0 ? [5, 4] : i === 1 ? [2, 3] : []); c.globalAlpha = i > 1 ? 0.95 : 0.7;
        c.beginPath(); c.arc(cx, cy, Math.max(1.5, r * s), 0, TAU); if (i > 1) { c.fillStyle = C.accent; c.globalAlpha = 0.3; c.fill(); c.globalAlpha = 0.95; } c.stroke(); c.restore();
      });
      /* the blind spots */
      for (const e of eyes) {
        const bx = (e === 'right' ? 1 : -1) * E.DATA.blindSpot, by = -1.5;
        c.save(); c.fillStyle = C.text; c.globalAlpha = 0.85; c.beginPath(); c.ellipse(X(bx), Y(by), 2.75 * s, 3.75 * s, 0, 0, TAU); c.fill(); c.restore();
        label(c, 'blind spot', X(bx), Y(by) + 3.75 * s + 9, { align: 'center', size: 10, color: C.text });
      }
      /* the lens of a frame */
      if (V.frame) {
        const rp = [], a = FRAME.a, b = FRAME.b, r = FRAME.r;
        [[a - r, b - r, 0], [-(a - r), b - r, 90], [-(a - r), -(b - r), 180], [a - r, -(b - r), 270]].forEach(([qx, qy, a0]) => { for (let k = 0; k <= 8; k++) { const t = (a0 + 90 * k / 8) * D2R; rp.push([X(qx + r * Math.cos(t)), Y(qy + r * Math.sin(t))]); } });
        fill(c, rp, 'rgba(224,160,48,0.12)'); stroke(c, rp, C.warn, 2.2, [7, 4], true);
        label(c, 'lens of a frame', X(0), Y(b) - 9, { align: 'center', size: 10.5, color: C.warn, weight: 650 });
      }
      stroke(c, [[cx - 7, cy], [cx + 7, cy]], C.text, 1.4); stroke(c, [[cx, cy - 7], [cx, cy + 7]], C.text, 1.4);
      /* the legend */
      const items = eyes.map(e => [cols[e], (e === 'right' ? 'right' : 'left') + ' eye: ' + (limits(e).l + limits(e).r) + '°' + (narrow ? '' : ' across'), 0]);
      if (eyes.length === 2) items.push([C.ok, (narrow ? 'overlap: ' : 'both eyes: ') + FLD.binocularOverlap + '°', 0]);
      if (V.zones) ZONES.forEach(([r, name, short], i) => items.push([C.text, narrow ? short : name, i + 1]));
      const lw = narrow ? 142 : 212, lh = items.length * 17 + 12;
      panel(c, 8, 8, lw, lh);
      items.forEach(([col, text, kind], i) => {
        const yy = 20 + i * 17;
        if (kind === 0) { c.save(); c.globalAlpha = 0.5; c.fillStyle = col; c.fillRect(14, yy - 5, 16, 10); c.restore(); stroke(c, [[14, yy - 5], [30, yy - 5], [30, yy + 5], [14, yy + 5]], col, 1.2, null, true); }
        else { c.save(); c.strokeStyle = col; c.lineWidth = 1.4; c.setLineDash(kind === 1 ? [4, 3] : kind === 2 ? [2, 3] : []); c.beginPath(); c.arc(22, yy, 5, 0, TAU); c.stroke(); c.restore(); }
        label(c, text, 38, yy, { size: 10.5, color: C.text });
      });
      /* read-outs */
      const A = areas(), field1 = eyes.length === 2 ? A.both : A.right, shown = eyes.length === 2 ? FLD.bothEyes : limits(eyes[0]).l + limits(eyes[0]).r;
      ro.set('h', shown + '° (' + (eyes.length === 2 ? 'both eyes; one eye covers ' + (FLD.nasal + FLD.temporal) + '°' : FLD.nasal + '° towards the nose, ' + FLD.temporal + '° towards the temple') + ')');
      ro.set('v', (FLD.up + FLD.down) + '° (' + FLD.up + '° up, ' + FLD.down + '° down)');
      ro.set('ov', eyes.length === 2 ? FLD.binocularOverlap + '° wide, ' + f(100 * A.overlap / A.both, 0) + ' % of the field' : 'shown when both eyes are chosen');
      ro.set('sharp', f(100 * Math.PI * 4 / field1, 2) + ' %');
      ro.set('read', f(100 * Math.PI * 25 / field1, 2) + ' %');
      ro.set('lens', V.frame ? f(100 * frameArea / field1, 0) + ' % with the eye still' : 'switch on the frame');
      ro.set('blind', '5.5° × 7.5°, ' + E.DATA.blindSpot + '° to the temple side, 1.5° below');
      ro.set('cut', f(fcut, 0) + ' cycles per degree (about 20/' + f(600 / fcut, 0) + ')');
      const dl = E.diffractionLimitCpd(V.pupil, 555);
      ro.set('diff', f(dl, 0) + ' cycles per degree at ' + f(V.pupil, 1) + ' mm');
      plot.set({ series: [{ pts, label: 'typical eye, by day', color: C.series[0], width: 2.6 }], vlines: [{ x: 30, label: '6/6: 30', color: C.ok }, { x: dl, label: 'diffraction limit', color: C.warn }], hlines: [{ y: 1, label: 'contrast 100 %' }], marks: [{ x: fcut, y: 1, label: 'cut-off ' + f(fcut, 0) }] });
    }
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }
})();
