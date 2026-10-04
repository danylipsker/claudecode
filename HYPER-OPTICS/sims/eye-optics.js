/* HYPER-OPTICS · sims/eye-optics.js — the simulations of the topic "The eye as an optical system".
 *   ey-anatomy        the eye in section, every part labelled: pick a part for its job and its numbers
 *   ey-camera         the schematic eye traced with real rays: an inverted image, the powers of cornea and lens, the f-number
 *   ey-accommodation  the same eye focusing near: the lens rounds up, the amplitude falls with age
 *   ey-pupil          the pupil against the light: diffraction, aberration and defocus blur, depth of focus
 *   ey-retina         the mosaic of cones and rods at any eccentricity, and the density curves
 *   ey-acuity         a letter sampled by the cone mosaic: acuity against eccentricity
 *   ey-csf            a Campbell–Robson chart and the eye's contrast-sensitivity curve
 *   ey-field          the visual field of one or both eyes; the blind spot test
 *   ey-stereo         two eyes, two points: convergence, disparity and the smallest depth step
 *   ey-movements      saccades, smooth pursuit and fixation as a trace of eye position
 *   ey-adaptation     the Purkinje shift and the dark-adaptation curve
 *   ey-flicker        flash rate against the flicker-fusion limit, and apparent motion
 *   ey-aberrations    chromatic and spherical aberration of the traced eye
 * Every number comes from kit.optics (O.eye, O.sys, O.photo, O.mtf, O.diff); the schematic eye is O.lens('eye'). The
 * pictures of the retina, the letters and the charts are schematic and say so. Nothing here diagnoses or measures
 * anyone's eye.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, R2D = 180 / PI, ARCMIN = R2D * 60;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dpt = (v, d) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(d == null ? 1 : d) + ' D';
  const fix = (v, d) => (Number.isFinite(v) ? v.toFixed(d == null ? 1 : d) : '—');
  // a small length: millimetres below a centimetre, centimetres below a metre
  const lenText = m => (m < 0.01 ? (+(m * 1000).toPrecision(2)) + ' mm' : m < 1 ? (+(m * 100).toPrecision(2)) + ' cm' : m >= 100 ? Math.round(m) + ' m' : (+m.toPrecision(3)) + ' m');
  const distText = m => !Number.isFinite(m) ? 'infinity' : m >= 100 ? Math.round(m) + ' m' : m >= 1 ? (+m.toPrecision(3)) + ' m' : Math.round(m * 100) + ' cm';
  // a pseudo-random number in [0, 1) from two integers, the same every time
  const hash = (i, j) => { const s = Math.sin(i * 127.1 + j * 311.7 + 17.3) * 43758.5453; return s - Math.floor(s); };

  function path(c, pts, close) { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); if (close) c.closePath(); }
  function stroke(c, pts, col, w, dash, close) {
    if (pts.length < 2) return;
    c.save(); c.strokeStyle = col; c.lineWidth = w || 1; c.lineJoin = 'round'; c.lineCap = 'round'; c.setLineDash(dash || []); path(c, pts, close); c.stroke(); c.restore();
  }
  function fillp(c, pts, col) { c.save(); c.fillStyle = col; path(c, pts, true); c.fill(); c.restore(); }
  function box(c, kit, x, y, w, h, title) {
    const C = kit.colors();
    c.save(); c.fillStyle = C.surface; c.strokeStyle = C.axis; c.lineWidth = 1; c.fillRect(x, y, w, h); c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); c.restore();
    if (title) kit.label(c, title, x + 6, y + 11, { size: 11, weight: 650, color: C.text });
  }

  /* ================================================================ the schematic eye
     Le Grand's eye from the lens library. The pupil is the *apparent* pupil, the one a person measures from outside
     (the cornea magnifies the real opening by about 13 %). Accommodation steepens the lens (the front more than the
     back), thickens it and moves it forward a little; how much the front steepens is found, by a short search with the
     paraxial trace, so that the object lands on the retina. */
  function eyeModel(O) {
    const SYS = O.sys;
    const ENT = SYS.paraxial(O.lens('eye')).epd / 4;               // entrance pupil ÷ real pupil
    function surfaces(s1, A, pupil) {
      const sf = O.lens('eye').surfaces, R2 = sf[2].R, R3 = sf[3].R;
      sf[1].t -= 0.04 * A; sf[2].R = R2 / s1; sf[2].t += 0.06 * A; sf[3].R = R3 / (1 + 0.3 * (s1 - 1));
      sf[2].sd = pupil / 2 / ENT;
      return sf;
    }
    const imageZ = (sf, v) => SYS.paraxial({ surfaces: sf, object: Math.abs(v) < 1e-9 ? Infinity : -1000 / v }).zImage;      // v: vergence of the light at the cornea
    const RET = imageZ(surfaces(1, 0, 4), 0);                       // the retina: where the relaxed eye focuses infinity (mm from the cornea)
    function lensScale(A) {
      if (A < 1e-6) return 1;
      const g = s => imageZ(surfaces(s, A, 4), -A) - RET;
      let lo = 0.8, hi = 3.2;
      if (g(lo) < 0) return lo;
      if (g(hi) > 0) return hi;
      for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (g(mid) > 0) lo = mid; else hi = mid; }
      return (lo + hi) / 2;
    }
    /* the eye looking at an object dm metres away with the most accommodation its age allows */
    function state(dm, amp, pupil) {
      const need = Number.isFinite(dm) && dm > 0 ? 1 / dm : 0, used = Math.min(need, amp), s1 = lensScale(used), sf = surfaces(s1, used, pupil);
      const sys = { surfaces: sf, object: Number.isFinite(dm) ? dm * 1000 : Infinity }, par = SYS.paraxial(sys);
      return { need, used, amp, s1, sf, sys, par, dz: par.zImage - RET };
    }
    /* the powers of the cornea alone and of the lens alone (dioptres) */
    function parts(sf) {
      const c = SYS.paraxial({ surfaces: [{ R: sf[0].R, k: sf[0].k, t: sf[0].t, n: 'cornea', sd: 3 }, { R: sf[1].R, n: 'aqueous', sd: 3 }] }, 587.56);
      const l = SYS.paraxial({ n0: 'aqueous', surfaces: [{ R: sf[2].R, k: sf[2].k, t: sf[2].t, n: 'eye-lens', sd: 3 }, { R: sf[3].R, k: sf[3].k, n: 'vitreous', sd: 3 }] }, 587.56);
      return { cornea: 1000 / c.efl, lens: 1000 / l.efl };
    }
    /* the globe: an ellipse about the axis, joined to the cornea at the limbus; `inner` is the retina's */
    const LIMB = 5.5, B_OUT = 12.0;
    function globe(sf) {
      const zL = SYS.sag(sf[0], LIMB), zBack = RET + 0.55, a = (zBack - zL) / (1 + Math.sqrt(1 - (LIMB / B_OUT) * (LIMB / B_OUT))), zc = zBack - a;
      return { zc, a, b: B_OUT, zL, ai: RET - zc, bi: B_OUT - 0.55, phi0: Math.acos(clamp((zL - zc) / a, -1, 1)) };
    }
    const ell = (g, inner, p0, p1, n, m) => { const o = []; for (let k = 0; k <= n; k++) { const ph = p0 + (p1 - p0) * k / n; o.push([m.X(g.zc + (inner ? g.ai : g.a) * Math.cos(ph)), m.Y((inner ? g.bi : g.b) * Math.sin(ph))]); } return o; };
    /* where a ray (p = [z, y] on it, d = [dz, dy]) leaves the globe at the back: the retina */
    function toRetina(g, p, d) {
      const qz = p[0] - g.zc, qy = p[1], A = (d[0] / g.ai) ** 2 + (d[1] / g.bi) ** 2, B = 2 * (qz * d[0] / (g.ai * g.ai) + qy * d[1] / (g.bi * g.bi)), Cc = (qz / g.ai) ** 2 + (qy / g.bi) ** 2 - 1;
      const disc = B * B - 4 * A * Cc;
      if (disc < 0 || A < 1e-12) return null;
      const s = (-B + Math.sqrt(disc)) / (2 * A);
      return [p[0] + s * d[0], p[1] + s * d[1]];
    }
    /* a ray from the object (field: height in mm for a near object, angle for infinity) to the retina, as [[z, y] …] from zStart */
    function ray(st, field, py, zStart, nm, g) {
      const sys = st.sys, par = st.par, zs = par.zs, ns = SYS.indices(sys, nm);
      const r0 = SYS.aim(sys, 0, py, field, par, nm), s = Math.abs(r0.d[2]) > 1e-9 ? (zStart - r0.p[2]) / r0.d[2] : 0;
      const r = { p: [r0.p[0] + s * r0.d[0], r0.p[1] + s * r0.d[1], zStart], d: r0.d };
      const tr = SYS.trace(sys, r, nm, { zs, ns });
      const pts = tr.pts.map(q => [q[2], q[1]]);
      let end = null;
      if (tr.ok) { end = toRetina(g, [tr.p[2], tr.p[1]], [tr.d[2], tr.d[1]]); if (end) pts.push(end); }
      return { pts, ok: tr.ok && !!end, end };
    }
    /* the lens's outline (a closed polygon in canvas pixels), with a rounded rim */
    function lensPoly(sf, m, scale) {
      const zs = SYS.vertices({ surfaces: sf }), P = (i, r) => { const z = SYS.sag(sf[i], r); return [zs[i] + (Number.isFinite(z) ? z : 0), r]; };
      let rl = 0.6;
      for (let r = 0.2; r <= 4.4; r += 0.1) { const th = zs[3] + SYS.sag(sf[3], r) - (zs[2] + SYS.sag(sf[2], r)); if (!(th > 0.15)) break; rl = r; }
      const pts = [];
      for (let j = -16; j <= 16; j++) pts.push(P(2, rl * j / 16));
      const fa = P(2, rl), ba = P(3, rl);
      pts.push([(fa[0] + ba[0]) / 2 - 0.1, rl + 0.35]);
      for (let j = 16; j >= -16; j--) pts.push(P(3, rl * j / 16));
      pts.push([(fa[0] + ba[0]) / 2 - 0.1, -rl - 0.35]);
      return { poly: pts.map(q => [m.X(q[0]), m.Y(q[1])]), rl, zs };
    }
    return { SYS, ENT, surfaces, imageZ, RET, lensScale, state, parts, globe, ell, toRetina, ray, lensPoly, LIMB };
  }

  /* the mosaic of the retina: schematic densities (per mm²) at an eccentricity e (degrees from the fovea), after the
     published counts of human photoreceptors; the cones peak at about 200 000 per mm² and fall to a few thousand,
     the rods are absent from the foveola and peak at about 150 000 per mm² some 15° out */
  const coneDensity = e => 4000 + 195000 / (1 + Math.pow(Math.abs(e) / 0.55, 1.35));
  const rodDensity = e => { const a = Math.abs(e); return a < 0.6 ? 0 : 150000 * (1 - Math.exp(-Math.pow((a - 0.6) / 4.5, 2))) / (1 + Math.pow(Math.max(0, a - 20) / 50, 2)); };
  const spacingUm = rho => Math.sqrt(2 / (Math.sqrt(3) * Math.max(rho, 1))) * 1000;            // centre-to-centre in a hexagonal mosaic, µm
  const UM_PER_ARCMIN = 291.1 / 60;                                                           // µm of retina per arc-minute at the fovea (0.291 mm per degree)

  /* ================================================================ the eye in section */
  Hyper.sim('ey-anatomy', {
    title: 'The eye in section: every part and its job',
    blurb: `A horizontal section of a right eye, seen from above, with the cornea and lens drawn from the same prescription that the ray-tracing simulations use (the rest is schematic). **Click a label, or pick a part from the list**, to light it up and read what it does and the numbers that go with it.

**Try this**
- Pick *Cornea*, then *Lens*: two curved, clear surfaces, both focusing. The cornea does most of it — about 43 D of the eye's 60.
- Pick *Iris* and move the **pupil** slider: the iris is a muscular diaphragm and the pupil is only the hole in it.
- Pick *Optic disc*: the place where 1.2 million nerve fibres leave the eye has no receptors at all. It is 15° from the fovea, towards the nose, and its shadow in the field is the blind spot.
- Compare *Aqueous* and *Vitreous*: two clear fluids with almost the same index (1.337 and 1.336), one in front of the lens and one behind it.`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym, M = eyeModel(O), SYS = M.SYS;
      const st = kit.stage(box_.stage, { aspect: 0.66, minH: 360 });
      const nd = id => O.index(id, 587.56).toFixed(3);
      const ctl = kit.controls(box_.side, [
        { id: 'part', type: 'select', label: 'Show the part', value: params.part || 'cornea', options: [['Cornea', 'cornea'], ['Aqueous humour', 'aqueous'], ['Iris', 'iris'], ['Pupil', 'pupil'], ['Lens', 'lens'], ['Ciliary body and zonules', 'ciliary'], ['Vitreous humour', 'vitreous'], ['Sclera', 'sclera'], ['Choroid', 'choroid'], ['Retina', 'retina'], ['Fovea', 'fovea'], ['Optic disc', 'disc'], ['Optic nerve', 'nerve']] },
        { id: 'pupil', label: 'Pupil diameter', min: 2, max: 8, step: 0.5, value: params.pupil || 4, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['name', 'Part'], ['role', 'What it does'], ['facts', 'Numbers']]);
      const sf0 = M.surfaces(1, 0, 4), par0 = SYS.paraxial({ surfaces: sf0 }), pw = M.parts(sf0);
      const TEXT = {
        cornea: ['Cornea', 'The clear front window of the eye and its strongest lens: it bends light by refraction at its curved front surface, where air meets tissue.', 'index ' + nd('cornea') + ' · about 0.55 mm thick · front radius ' + sf0[0].R + ' mm · about ' + fix(pw.cornea, 1) + ' D'],
        aqueous: ['Aqueous humour', 'A clear watery fluid between the cornea and the lens. It feeds them, keeps the eye inflated, and is renewed continually.', 'index ' + nd('aqueous') + ' · ' + sf0[1].t + ' mm deep on the axis'],
        iris: ['Iris', 'A ring of muscle with colour in it: the diaphragm of the eye. Its two muscles make the opening smaller or larger.', 'opening 2 to 8 mm · coloured by pigment, which is why eyes are brown, green or blue'],
        pupil: ['Pupil', 'The hole in the iris, where light enters. Seen from outside, through the cornea, it is about 13 % larger than the real opening.', 'f/' + fix(par0.efl / 4, 1) + ' at 4 mm · f/' + fix(par0.efl / 2, 1) + ' at 2 mm · f/' + fix(par0.efl / 8, 1) + ' at 8 mm'],
        lens: ['Crystalline lens', 'A clear, flexible lens that changes shape to focus near and far (accommodation). It stiffens with age and may cloud, a change called cataract.', 'index ' + nd('eye-lens') + ' (higher at its core) · ' + sf0[2].t + ' mm thick · about ' + fix(pw.lens, 0) + ' D in this model, growing thicker through life'],
        ciliary: ['Ciliary body and zonules', 'The ciliary muscle and the fine fibres (zonules) that hold the lens. When the muscle contracts the fibres slacken and the lens rounds up.', 'also makes the aqueous humour'],
        vitreous: ['Vitreous humour', 'A clear gel filling most of the eye. It keeps the retina in place and the globe round, and it is almost as dense as water, optically.', 'index ' + nd('vitreous') + ' · ' + fix(M.RET - SYS.vertices({ surfaces: sf0 })[3], 1) + ' mm long behind the lens'],
        sclera: ['Sclera', 'The tough white wall of the eye. It gives the globe its shape and carries the muscles that turn it.', 'about 0.5 to 1 mm thick · the globe is about ' + O.eye.DATA.axialLength + ' mm long and 23 to 24 mm across'],
        choroid: ['Choroid', 'A dark, blood-rich layer between the sclera and the retina. It feeds the receptors and its pigment absorbs stray light.', 'one of the most richly supplied tissues in the body'],
        retina: ['Retina', 'The light-sensitive layer, a part of the brain at the back of the eye: rods and cones and the nerve cells that begin to process what they sense.', 'about ' + (O.eye.DATA.cones / 1e6) + ' million cones and ' + Math.round(O.eye.DATA.rods / 1e6) + ' million rods · about 0.25 mm thick'],
        fovea: ['Fovea', 'A pit at the centre of the macula where cones are packed most densely. It sees sharpest: the eye turns to put what it wants to see there.', 'about 5° (1.5 mm) across; its centre, the foveola, about 1° (0.35 mm)'],
        disc: ['Optic disc', 'Where the nerve fibres of the retina gather and leave the eye, and where the blood vessels enter. It has no receptors: the blind spot.', O.eye.DATA.blindSpot + '° from the fovea, towards the nose · about 1.5 mm across'],
        nerve: ['Optic nerve', 'The cable of about a million fibres from the retina to the brain.', 'about 1.2 million fibres · carries about 1 000 times fewer channels than there are receptors']
      };
      // anchors in the eye's own coordinates (z, r in mm) and the column of the label: l = left, r = right
      const G = M.globe(sf0), zs0 = SYS.vertices({ surfaces: sf0 }), retPt = ph => [G.zc + G.ai * Math.cos(ph), G.bi * Math.sin(ph)];
      const discPhi = 4.4 / G.bi, discPt = retPt(discPhi);
      const outerPt = ph => [G.zc + G.a * Math.cos(ph), G.b * Math.sin(ph)], midPt = ph => [G.zc + (G.a + G.ai) / 2 * Math.cos(ph), (G.b + G.bi) / 2 * Math.sin(ph)];
      const LABELS = [
        ['cornea', 'l', [1.3, 4.3]], ['iris', 'l', [3.45, 3.6]], ['aqueous', 'l', [2.2, 1.0]], ['pupil', 'l', [3.5, -0.6]], ['lens', 'l', [5.6, -2.2]], ['ciliary', 'l', [4.6, -6.4]], ['vitreous', 'l', [11, -6]],
        ['sclera', 'r', outerPt(1.2)], ['nerve', 'r', [27.2, 6.8]], ['disc', 'r', [discPt[0], discPt[1]]], ['fovea', 'r', [M.RET, 0.3]], ['retina', 'r', retPt(-0.95)], ['choroid', 'r', midPt(-1.4)]
      ];
      let LAYOUT = [], ANCHORS = [];
      const FONT = '11.5px system-ui, sans-serif';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, sel = V.part;
        const sf = M.surfaces(1, 0, V.pupil), zs = SYS.vertices({ surfaces: sf }), g = M.globe(sf), LIM = M.LIMB;
        const narrow = W < 520, side = narrow ? 10 : Math.min(158, W * 0.24), m = S.map(st, -1, 30, 13.5, { left: side, right: side, top: narrow ? 34 : 14, bottom: 14 });
        const hl = id => sel === id, accent = C.accent, soft = C.dark ? 'rgba(123,140,255,0.34)' : 'rgba(80,100,220,0.26)';
        const line = (pts, col, w, dash, cl) => stroke(c, pts, col, w, dash, cl);
        // the globe: sclera and choroid, then the vitreous inside
        const outer = M.ell(g, false, g.phi0, -g.phi0, 60, m);
        const frontArc = (i, r0, r1, n) => { const o = []; for (let k = 0; k <= n; k++) { const r = r0 + (r1 - r0) * k / n, z = SYS.sag(sf[i], r); o.push([m.X(zs[i] + (Number.isFinite(z) ? z : 0)), m.Y(r)]); } return o; };
        const corFront = frontArc(0, -LIM, LIM, 20), corBack = frontArc(1, -5.0, 5.0, 20);
        // vitreous fill: the inside of the globe behind the lens
        const glob = [corFront[corFront.length - 1]].concat(outer, [corFront[0]]);
        fillp(c, glob, hl('vitreous') ? soft : (C.dark ? 'rgba(235,238,250,0.05)' : 'rgba(40,60,120,0.045)'));
        // sclera (thick, light) and choroid (a thin dark band inside)
        line(outer, hl('sclera') ? accent : C.muted, hl('sclera') ? 4.4 : 2.6);
        const gm = Object.assign({}, g, { a: (g.a + g.ai) / 2, b: (g.b + g.bi) / 2 }), mid = M.ell(gm, false, 1.9, -1.9, 50, m);
        line(mid, hl('choroid') ? accent : (C.dark ? '#6a5a4a' : '#7a6a58'), hl('choroid') ? 4.4 : 2.4);
        // retina: the inner arc, thick; the fovea and the disc on it
        const ri = (ph0, ph1) => { const o = []; for (let k = 0; k <= 40; k++) { const ph = ph0 + (ph1 - ph0) * k / 40; o.push(retPt(ph)); } return o.map(q => [m.X(q[0]), m.Y(q[1])]); };
        line(ri(1.9, -1.9), hl('retina') ? accent : C.bad, hl('retina') ? 5 : 3.2);
        // the optic nerve leaves at the disc
        const dir = [Math.cos(discPhi), Math.sin(discPhi)], nrm = [-dir[1], dir[0]], n0 = [G.zc + (G.a + 0.2) * Math.cos(discPhi), (G.b + 0.2) * Math.sin(discPhi)];
        const nv = [[n0[0] + nrm[0] * 1.3, n0[1] + nrm[1] * 1.3], [n0[0] + dir[0] * 6.2 + nrm[0] * 1.3, n0[1] + dir[1] * 6.2 + nrm[1] * 1.3], [n0[0] + dir[0] * 6.2 - nrm[0] * 1.3, n0[1] + dir[1] * 6.2 - nrm[1] * 1.3], [n0[0] - nrm[0] * 1.3, n0[1] - nrm[1] * 1.3]].map(q => [m.X(q[0]), m.Y(q[1])]);
        fillp(c, nv, hl('nerve') ? soft : (C.dark ? 'rgba(235,238,250,0.12)' : 'rgba(40,60,120,0.12)')); line(nv, hl('nerve') ? accent : C.muted, hl('nerve') ? 3 : 1.6, null, true);
        const dp2 = retPt(discPhi + 0.07), dp1 = retPt(discPhi - 0.07);
        line([dp1, dp2].map(q => [m.X(q[0]), m.Y(q[1])]), hl('disc') ? accent : C.warn, hl('disc') ? 7 : 5);
        const fv = [retPt(0.075), retPt(-0.075)].map(q => [m.X(q[0]), m.Y(q[1])]);
        line(fv, hl('fovea') ? accent : C.warn, hl('fovea') ? 7 : 5);
        // aqueous humour: between the cornea and the iris plane
        const zi = zs[2] - 0.12, aq = corBack.concat([[m.X(zi), m.Y(5.0)], [m.X(zi), m.Y(-5.0)]]);
        fillp(c, aq, hl('aqueous') ? soft : S.glass(0.07));
        // lens, then the zonules and the ciliary body
        const lp = M.lensPoly(sf, m);
        const rimU = lp.poly[33], rimL = lp.poly[lp.poly.length - 1];
        const cb = [[m.X(zs[2] + 0.4), m.Y(5.6)], [m.X(zs[2] + 2.7), m.Y(5.9)], [m.X(zs[2] + 3.2), m.Y(7.2)], [m.X(zs[2] - 0.2), m.Y(7.2)]];
        const cbm = cb.map(p => [p[0], 2 * m.y0 - p[1]]);
        for (const q of [cb, cbm]) { fillp(c, q, hl('ciliary') ? soft : (C.dark ? 'rgba(224,160,48,0.18)' : 'rgba(224,160,48,0.22)')); line(q, hl('ciliary') ? accent : C.warn, hl('ciliary') ? 2.6 : 1.4, null, true); }
        for (const [rim, qq] of [[rimU, cb], [rimL, cbm]]) for (const t of [0.15, 0.5, 0.85]) line([rim, [qq[0][0] + (qq[1][0] - qq[0][0]) * t, qq[0][1] + (qq[1][1] - qq[0][1]) * t]], hl('ciliary') ? accent : C.faint, hl('ciliary') ? 1.6 : 1);
        fillp(c, lp.poly, hl('lens') ? soft : S.glass(0.34)); line(lp.poly, hl('lens') ? accent : S.edge(), hl('lens') ? 3 : 1.4, null, true);
        // iris: two thick strokes with the pupil between them
        const xi = m.X(zi + 0.02), rp = sf[2].sd;
        for (const s of [1, -1]) line([[xi, m.Y(s * rp)], [xi, m.Y(s * 5.2)]], hl('iris') ? accent : (C.dark ? '#b08a5a' : '#8a6a3c'), hl('iris') ? 6 : 4.6);
        if (hl('pupil')) { c.save(); c.strokeStyle = accent; c.lineWidth = 2.4; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(xi, m.Y(rp)); c.lineTo(xi, m.Y(-rp)); c.stroke(); c.restore(); line([[xi - 5, m.Y(rp)], [xi + 5, m.Y(rp)]], accent, 2.4); line([[xi - 5, m.Y(-rp)], [xi + 5, m.Y(-rp)]], accent, 2.4); }
        // cornea
        const cor = corFront.concat(corBack.slice().reverse());
        fillp(c, cor, hl('cornea') ? soft : S.glass(0.3)); line(cor, hl('cornea') ? accent : S.edge(), hl('cornea') ? 3 : 1.4, null, true);
        // the optical axis
        S.axis(c, m.X(-0.6), m.y0, m.X(M.RET + 1.5));
        kit.label(c, 'nasal side', m.X(12), m.Y(13.2), { align: 'center', size: 10.5, color: C.faint });
        kit.label(c, 'temporal side', m.X(12), m.Y(-13.2), { align: 'center', size: 10.5, color: C.faint });
        // labels with leaders: left and right columns, the leader starting at the inner end of the text
        const colL = LABELS.filter(l => l[1] === 'l'), colR = LABELS.filter(l => l[1] === 'r');
        c.save(); c.font = FONT; LAYOUT = []; ANCHORS = narrow ? LABELS.map(l => ({ id: l[0], x: m.X(l[2][0]), y: m.Y(l[2][1]) })) : [];
        const place = (col, sd) => col.forEach((l, i) => {
          const y = 26 + i * (Hh - 52) / Math.max(1, col.length - 1), x = sd === 'l' ? 8 : W - 8, ax = m.X(l[2][0]), ay = m.Y(l[2][1]);
          if (narrow) { if (l[0] === sel) { kit.dot(c, ax, ay, 3.6, accent); line([[10, 16], [ax, ay]], accent, 1.4); kit.label(c, TEXT[l[0]][0], 10, 16, { size: 11.5, color: accent, weight: 700 }); } return; }
          const on = hl(l[0]), tx = TEXT[l[0]][0], tw = c.measureText(tx).width + 4, ex = sd === 'l' ? x + tw + 4 : x - tw - 4;
          LAYOUT.push({ id: l[0], x0: sd === 'l' ? x - 4 : x - tw - 8, x1: sd === 'l' ? x + tw + 8 : x + 4, y });
          line([[ex, y], [ax, ay]], on ? accent : C.faint, on ? 1.6 : 1);
          kit.dot(c, ax, ay, on ? 3.4 : 2.4, on ? accent : C.muted);
          kit.label(c, tx, x, y, { align: sd === 'l' ? 'left' : 'right', size: 11.5, color: on ? accent : C.text, weight: on ? 700 : 500 });
        });
        place(colL, 'l'); place(colR, 'r');
        c.restore();
        const t = TEXT[sel];
        ro.set('name', t[0]); ro.set('role', t[1]); ro.set('facts', t[2]);
      }, box_.stage);
      kit.click(st, p => {
        // the nearest label wins; on a narrow screen, with no labels, the nearest anchor on the drawing
        let best = null, bd = 18;
        for (const l of LAYOUT) { const d = Math.abs(p.y - l.y) + Math.max(0, l.x0 - p.x, p.x - l.x1); if (d < bd) { bd = d; best = l.id; } }
        if (!LAYOUT.length && ANCHORS.length) { bd = 36; for (const a of ANCHORS) { const d = Math.hypot(p.x - a.x, p.y - a.y); if (d < bd) { bd = d; best = a.id; } } }
        if (best) { ctl.set('part', best); loop.once(); }
      }, p => LAYOUT.some(l => Math.abs(p.y - l.y) < 12 && p.x > l.x0 && p.x < l.x1) || ANCHORS.some(a => Math.hypot(p.x - a.x, p.y - a.y) < 36));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the eye as a camera, and focusing near
     One drawing and one set of controls serve both pages: mode 'camera' shows the optics (an inverted image, the powers,
     the f-number); mode 'accommodation' adds age and the amplitude curve. */
  function eyeLab(box_, kit, params, mode) {
    const O = kit.optics, S = kit.osym, M = eyeModel(O), E = O.eye, acc = mode === 'accommodation';
    const st = kit.stage(box_.stage, { aspect: acc ? 0.5 : 0.54, minH: 320 });
    const defs = [];
    if (acc) defs.push({ id: 'd', label: 'Distance of the object', min: 0.1, max: 100, value: params.d || 0.4, log: true, sig: 2, fmt: v => (v >= 99 ? 'far away' : distText(v)) });
    else defs.push({ id: 'd', type: 'select', label: 'Distance of the object', options: [['Far away (infinity)', Infinity], ['20 m', 20], ['6 m', 6], ['2 m', 2], ['1 m', 1], ['40 cm', 0.4], ['25 cm', 0.25], ['15 cm', 0.15]], value: params.d != null ? params.d : Infinity });
    if (acc) defs.push({ id: 'age', label: 'Age', min: 8, max: 70, step: 1, value: params.age || 25, unit: 'years' });
    defs.push({ id: 'pupil', label: 'Pupil diameter', min: 2, max: 8, step: 0.5, value: params.pupil || 4, unit: 'mm' });
    if (!acc) defs.push({ id: 'size', label: 'Angular size of the object', min: 4, max: 30, step: 1, value: params.size || 12, unit: '°' });
    const ctl = kit.controls(box_.side, defs, () => loop.once());
    const V = ctl.values;
    const ro = kit.readout(box_.side, acc
      ? [['need', 'Focusing needed'], ['amp', 'Available at this age (average)'], ['near', 'Nearest sharp distance'], ['front', 'Radius of the lens front'], ['thick', 'Thickness of the lens'], ['power', 'Power of the whole eye'], ['focus', 'The image falls']]
      : [['power', 'Power of the whole eye'], ['parts', 'Cornea and lens, separately'], ['fno', 'f-number at this pupil'], ['image', 'Image on the retina'], ['scale', 'Scale on the retina'], ['focus', 'The image falls']]);
    const plot = acc ? kit.plot(box_.side, { x: { label: 'age (years)', min: 8, max: 70 }, y: { label: 'D', min: 0, max: 22 }, series: [] }, 180) : null;
    if (acc) {
      const pts = k => { const o = []; for (let a = 8; a <= 70; a += 2) o.push([a, E.accommodation(a)[k]]); return o; };
      plot.set({ series: [{ pts: pts('max'), label: 'maximum', color: kit.colors().faint, dash: [4, 3] }, { pts: pts('avg'), label: 'average', color: kit.colors().accent, width: 2.8 }, { pts: pts('min'), label: 'minimum', color: kit.colors().faint, dash: [4, 3] }] });
    }
    let memoKey = '', memo = null;
    const model = () => {
      const age = acc ? V.age : (params.age || 25), amp = E.accommodation(age).avg, key = [V.d, amp.toFixed(3), V.pupil].join();
      if (key !== memoKey) { memo = M.state(V.d, amp, V.pupil); memoKey = key; }
      return { s: memo, age, amp };
    };
    const loop = kit.loop(() => {
      const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, { s, age, amp } = model();
      const g = M.globe(s.sf), m = S.map(st, -31, 27, 14.5, { left: 8, right: 8, top: 12, bottom: 24 }), zs = M.SYS.vertices({ surfaces: s.sf });
      const px = q => [m.X(q[0]), m.Y(q[1])];
      // the eye
      const outer = M.ell(g, false, g.phi0, -g.phi0, 60, m), corF = [], corB = [];
      for (let k = 0; k <= 20; k++) { const r = -M.LIMB + 2 * M.LIMB * k / 20, z = M.SYS.sag(s.sf[0], r); corF.push([m.X(zs[0] + z), m.Y(r)]); }
      for (let k = 0; k <= 20; k++) { const r = -5 + 10 * k / 20, z = M.SYS.sag(s.sf[1], r); corB.push([m.X(zs[1] + z), m.Y(r)]); }
      fillp(c, [corF[20]].concat(outer, [corF[0]]), C.dark ? 'rgba(235,238,250,0.05)' : 'rgba(40,60,120,0.045)');
      stroke(c, outer, C.muted, 2);
      const ret = []; for (let k = 0; k <= 40; k++) { const ph = 1.9 - 3.8 * k / 40; ret.push([m.X(g.zc + g.ai * Math.cos(ph)), m.Y(g.bi * Math.sin(ph))]); }
      stroke(c, ret, C.bad, 3);
      const cor = corF.concat(corB.slice().reverse());
      fillp(c, cor, S.glass(0.3)); stroke(c, cor, S.edge(), 1.3, null, true);
      // the lens now (and, when focusing, the relaxed lens dashed behind it)
      if (s.used > 0.05) stroke(c, M.lensPoly(M.surfaces(1, 0, V.pupil), m).poly, C.faint, 1.2, [4, 3], true);
      const lp = M.lensPoly(s.sf, m);
      fillp(c, lp.poly, S.glass(0.34)); stroke(c, lp.poly, S.edge(), 1.5, null, true);
      const xi = m.X(zs[2] - 0.12), rp = s.sf[2].sd;
      for (const sg of [1, -1]) stroke(c, [[xi, m.Y(sg * rp)], [xi, m.Y(sg * 5.2)]], C.dark ? '#b08a5a' : '#8a6a3c', 4.4);
      S.axis(c, m.X(-31), m.y0, m.X(g.zc + g.ai + 1.2));
      // three bundles of rays: from the top of the object, its middle and its bottom
      const th = (acc ? 10 : V.size) * D2R / 2, fieldOf = sgn => (Number.isFinite(V.d) ? sgn * V.d * 1000 * Math.tan(th) : sgn * th);
      const sets = [[1, S.nm(625)], [0, S.nm(560)], [-1, S.nm(470)]], ends = {};
      for (const [sgn, col] of sets) {
        for (let i = 0; i < 5; i++) {
          const r = M.ray(s, fieldOf(sgn), 0.9 * (i / 2 - 1), -29, 550, g);
          if (r.pts.length > 1) stroke(c, r.pts.map(px), r.ok ? col : C.faint, 1.3, r.ok ? null : [3, 3]);
          if (i === 2 && r.end) ends[sgn] = r.pts;
          if (sgn === 0 && s.dz > 0.04 && r.ok && r.end && r.pts.length > 2) {          // the focus is behind the retina: carry the ray on, dashed
            const a = r.pts[r.pts.length - 2], b = r.pts[r.pts.length - 1], sl = (b[1] - a[1]) / (b[0] - a[0] || 1e-9);
            stroke(c, [px(b), px([s.par.zImage, b[1] + sl * (s.par.zImage - b[0])])], col, 1, [3, 3]);
          }
        }
      }
      // the object (far away to the left) and its image on the retina, upside down
      const top = ends[1], bot = ends[-1];
      if (top && bot) {
        const y0 = top[0][1], xo = m.X(-30.2);
        kit.arrow(c, xo, m.Y(-y0), xo, m.Y(y0), C.accent, 3);
        kit.label(c, Number.isFinite(V.d) ? 'object' : 'object, far away', xo + 6, m.Y(y0) - 4, { size: 11, color: C.accent });
        const eT = top[top.length - 1], eB = bot[bot.length - 1], xr = m.X(g.zc + g.ai) + 12;
        kit.arrow(c, xr, m.Y(eB[1]), xr, m.Y(eT[1]), C.accent, 3);
        kit.label(c, 'image: upside down', W - 6, m.Y(eB[1]) - 16, { align: 'right', size: 11, color: C.accent });
      }
      // names
      kit.label(c, 'cornea', m.X(0.2), m.Y(-6.9), { align: 'center', size: 11, color: C.muted });
      kit.label(c, 'iris and pupil', m.X(3.4), m.Y(6.7), { align: 'center', size: 11, color: C.muted });
      kit.label(c, 'lens', m.X(5.7), m.Y(-5.7), { align: 'center', size: 11, color: C.muted });
      kit.label(c, 'retina', m.X(g.zc + g.ai) - 4, m.Y(-10.2), { align: 'center', size: 11, color: C.muted });
      kit.label(c, Number.isFinite(V.d) ? 'rays from an object ' + distText(V.d) + ' away' : 'parallel rays from a distant object', 10, Hh - 10, { size: 11, color: C.faint });
      // read-outs
      const pw = 1000 / s.par.efl, sc = s.par.efl * D2R * 1000;                       // µm of retina per degree
      const dEr = s.need - s.used;
      const focus = Math.abs(s.dz) < 0.03 ? 'on the retina: sharp' : fix(Math.abs(s.dz), 2) + ' mm ' + (s.dz > 0 ? 'behind' : 'in front of') + ' it: blurred by about ' + fix(E.blurAngle(dEr, V.pupil) * ARCMIN, 0) + '′';
      ro.set('power', fix(pw, 1) + ' D · focal length ' + fix(s.par.efl, 1) + ' mm');
      ro.set('focus', focus);
      if (acc) {
        ro.set('need', s.need < 0.02 ? 'none: relaxed' : fix(s.need, 1) + ' D (1 ÷ ' + distText(V.d) + ')');
        ro.set('amp', fix(amp, 1) + ' D at ' + age + ' (about ' + fix(E.accommodation(age).min, 1) + ' to ' + fix(E.accommodation(age).max, 1) + ' D)');
        ro.set('near', amp > 0.05 ? distText(E.nearPoint(0, amp)) : 'none: no focusing left');
        ro.set('front', fix(s.sf[2].R, 1) + ' mm  (relaxed: ' + fix(O.lens('eye').surfaces[2].R, 1) + ' mm)');
        ro.set('thick', fix(s.sf[2].t, 2) + ' mm  (relaxed: ' + fix(O.lens('eye').surfaces[2].t, 2) + ' mm)');
      } else {
        const pr = M.parts(s.sf);
        ro.set('parts', fix(pr.cornea, 1) + ' D and ' + fix(pr.lens, 1) + ' D (they do not simply add: several millimetres separate them)');
        ro.set('fno', 'f/' + fix(s.par.efl / V.pupil, 1) + ' = ' + fix(s.par.efl, 1) + ' mm ÷ ' + fix(V.pupil, 1) + ' mm');
        ro.set('image', top && bot ? fix(Math.abs(top[top.length - 1][1] - bot[bot.length - 1][1]), 2) + ' mm tall for an object ' + V.size + '° tall' : '—');
        ro.set('scale', fix(sc, 0) + ' µm per degree · ' + fix(sc / 60, 1) + ' µm per arc-minute');
      }
      if (plot) {
        const a = E.accommodation(age).avg;
        plot.set({ marks: [{ x: age, y: a, label: fix(a, 1) + ' D' }], hlines: s.need > 0.05 ? [{ y: Math.min(s.need, 22), label: 'needed ' + fix(s.need, 1), color: C.warn }] : [] });
      }
    }, box_.stage);
    st.onResize(() => loop.once());
    loop.once();
  }

  Hyper.sim('ey-camera', {
    title: 'The eye as a camera: traced rays through a schematic eye',
    blurb: `A standard textbook eye (cornea, aqueous, iris, lens, vitreous, retina) with rays traced through its real surfaces. Light from the **top** of a distant object (red) is carried to the **bottom** of the retina: the image is upside down, and the brain turns the world the right way up again.

**Try this**
- Look at the read-out *Power of the whole eye*: about 60 D, a focal length of 16.7 mm. The cornea alone is about 42 to 43 D; most of the eye's bending happens where air meets the cornea.
- Close the **pupil** to 2 mm and open it to 8 mm: the f-number goes from about f/8 to about f/2, as in a camera. The picture of the rays does not change, but the bundle of each point fills more of the lens.
- Bring the object to 25 cm and then 15 cm. The eye reaches the retina by making the lens rounder (see the dashed relaxed outline); the angular size of the object stays the same, so does the image.
- Make the object bigger: the image on the retina grows at 291 µm per degree.`,
    mount(box_, kit, params) { eyeLab(box_, kit, params, 'camera'); }
  });

  Hyper.sim('ey-accommodation', {
    title: 'Accommodation: the lens rounds up to focus near',
    blurb: `The eye keeps the retina where it is and changes the *power* of its lens instead. For an object at distance d the light arrives diverging, and the lens must add 1/d dioptres. The model finds how much it must round up (the dashed outline is the relaxed lens) to bring the object to a focus on the retina. The graph is the average amplitude of accommodation against age (Hofstetter).

**Try this**
- At 25 years, bring the object in from far away to 25 cm: the lens front radius falls from 10.2 mm to about 7 mm and the lens thickens, and the focus stays on the retina.
- Slide the **age** to 45: the average eye now has about 5 D, so the nearest sharp distance is 20 cm, and 25 cm is just reachable. At 55 it is 50 cm.
- At 60 the amplitude is below 1 D: an object at 40 cm falls well behind the retina and the image is blurred. The dashed rays show where it would focus.
- Notice the object at 100 m or more: needed focusing is almost zero; "far" and "infinity" are the same to the eye.`,
    mount(box_, kit, params) { eyeLab(box_, kit, params, 'accommodation'); }
  });

  /* ================================================================ the pupil */
  Hyper.sim('ey-pupil', {
    title: 'The pupil: light, blur and depth of focus',
    blurb: `The pupil is the eye's aperture stop. Left, the eye seen from the front with the pupil to scale; right, the blur that one point of light makes on the retina, as three circles: the **Airy disc** that diffraction allows (it shrinks as the pupil opens), the **aberration** blur of the traced schematic eye (it grows steeply as the pupil opens) and the **defocus** blur from a focusing error (it grows in proportion to the pupil). The graph shows them against pupil size, with the combined blur in the colour of the accent.

**Try this**
- Tick *the pupil follows the brightness* and slide the **brightness** from starlight to sunlight: the pupil goes from about 6 mm to 2 mm. That changes the light admitted only about ten times, against a scene that changes ten-million-fold: the pupil is a fine adjustment, not the main mechanism of adaptation.
- Untick it and set the pupil by hand: with no focusing error the combined blur is smallest near **3 mm**, where diffraction (large for a small pupil) and aberration (large for a big one) balance.
- Now add **0.5 D** of focusing error and compare 2 mm with 7 mm: the small pupil hardly notices, the large one blurs — the pupil sets the depth of focus.
- The Airy circle is drawn from 550 nm light; the aberration circle is the full extent of the spot of the traced eye at its best focus.`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym, M = eyeModel(O), E = O.eye, SYS = M.SYS;
      const st = kit.stage(box_.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box_.side, [
        { id: 'L', label: 'Brightness of the scene', min: 0.001, max: 10000, value: params.L || 100, log: true, sig: 2, fmt: v => kit.fmt(v, 2) + ' cd/m²' },
        { id: 'auto', type: 'check', label: 'The pupil follows the brightness', value: params.auto !== false },
        { id: 'pupil', label: 'Pupil by hand', min: 2, max: 8, step: 0.1, value: params.pupil || 4, unit: 'mm' },
        { id: 'def', label: 'Focusing error', min: 0, max: 1.5, step: 0.05, value: params.def != null ? params.def : 0, unit: 'D' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['p', 'Pupil'], ['N', 'f-number'], ['td', 'Light on the retina'], ['air', 'Diffraction: Airy disc'], ['ab', 'Aberrations of the eye'], ['de', 'Focusing error'], ['tot', 'Total blur (combined)'], ['dof', 'Depth of focus']]);
      const plot = kit.plot(box_.side, { x: { label: 'pupil (mm)', min: 1.5, max: 8 }, y: { label: '′', min: 0 }, series: [] }, 190);
      // the aberration blur of the traced eye at its best focus: the full width of the spot, in arc-minutes, for a few pupils
      const efl = SYS.paraxial(O.lens('eye')).efl, TAB = [];
      for (const p of [1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8]) {
        const sys = { surfaces: M.surfaces(1, 0, p) }, bf = SYS.bestFocus(sys, { rings: 4 }), sp = SYS.spot(sys, { rings: 4, z: bf.z });
        TAB.push([p, 2 * sp.geo / efl * ARCMIN]);
      }
      const ab = p => { if (p <= TAB[0][0]) return TAB[0][1]; for (let i = 1; i < TAB.length; i++) if (p <= TAB[i][0]) return TAB[i - 1][1] + (TAB[i][1] - TAB[i - 1][1]) * (p - TAB[i - 1][0]) / (TAB[i][0] - TAB[i - 1][0]); return TAB[TAB.length - 1][1]; };
      const airy = p => 2.44 * 550e-6 / p * ARCMIN;                            // full diameter to the first dark ring, arc-minutes
      const defb = (D, p) => E.blurAngle(D, p) * ARCMIN;
      const tot = (p, D) => Math.hypot(airy(p), ab(p), defb(D, p));
      const pupilNow = () => (V.auto ? clamp(E.pupil(V.L), 2, 8) : V.pupil);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, p = pupilNow(), N = efl / p;
        if (V.auto) ctl.set('pupil', Math.round(p * 10) / 10);
        // the eye from the front, to scale: the iris about 12 mm across
        const half = Math.min(W * 0.2, Hh * 0.42), k = half / 8, cx = W * 0.22, cy = Hh * 0.5;
        c.save(); c.fillStyle = C.dark ? 'rgba(235,238,250,0.10)' : 'rgba(255,255,255,0.9)'; c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.ellipse(cx, cy, half * 1.12, half * 0.72, 0, 0, TAU); c.fill(); c.stroke(); c.restore();
        c.save(); c.beginPath(); c.arc(cx, cy, 6 * k, 0, TAU); c.fillStyle = C.dark ? '#7a5a3a' : '#a07a50'; c.fill();
        c.strokeStyle = C.dark ? 'rgba(235,200,150,0.35)' : 'rgba(80,50,20,0.35)'; c.lineWidth = 1;
        for (let a = 0; a < TAU; a += TAU / 48) { c.beginPath(); c.moveTo(cx + p / 2 * k * Math.cos(a), cy + p / 2 * k * Math.sin(a)); c.lineTo(cx + 6 * k * Math.cos(a), cy + 6 * k * Math.sin(a)); c.stroke(); }
        c.beginPath(); c.arc(cx, cy, 6 * k, 0, TAU); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.stroke();
        c.beginPath(); c.arc(cx, cy, p / 2 * k, 0, TAU); c.fillStyle = '#05060c'; c.fill(); c.restore();
        c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.lineWidth = 1;
        for (const r of [1, 4]) { c.beginPath(); c.arc(cx, cy, r * k, 0, TAU); c.stroke(); }
        c.restore();
        kit.label(c, '2 mm and 8 mm: the range of the pupil', cx, cy + half * 0.95, { align: 'center', size: 10.5, color: C.faint });
        kit.label(c, 'pupil ' + fix(p, 1) + ' mm', cx, cy - half * 0.95, { align: 'center', size: 12, weight: 650, color: C.text });
        // the blur of one point on the retina
        const rx = W * 0.72, ry = Hh * 0.5, R = Math.min(W * 0.25, Hh * 0.4), q = R / 6;           // 8′ radius fits
        const a1 = airy(p), a2 = ab(p), a3 = defb(V.def, p), a4 = tot(p, V.def);
        c.save(); c.fillStyle = C.surface; c.strokeStyle = C.axis; c.lineWidth = 1; c.fillRect(rx - R - 6, ry - R - 6, 2 * R + 12, 2 * R + 12); c.strokeRect(rx - R - 5.5, ry - R - 5.5, 2 * R + 11, 2 * R + 11);
        c.beginPath(); c.rect(rx - R - 5, ry - R - 5, 2 * R + 10, 2 * R + 10); c.clip();
        c.beginPath(); c.arc(rx, ry, Math.max(1, a4 / 2 * q), 0, TAU); c.fillStyle = C.dark ? 'rgba(123,140,255,0.28)' : 'rgba(80,100,220,0.22)'; c.fill();
        const ring = (d, col, dash) => { c.beginPath(); c.arc(rx, ry, Math.max(1, d / 2 * q), 0, TAU); c.strokeStyle = col; c.lineWidth = 2; c.setLineDash(dash || []); c.stroke(); };
        ring(a1, C.warn, [5, 3]); ring(a2, C.ok); if (V.def > 0.01) ring(a3, C.series[1], [2, 3]); ring(a4, C.accent);
        c.restore();
        c.save(); c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(rx - R, ry + R - 8); c.lineTo(rx - R + q, ry + R - 8); c.stroke(); c.restore();
        kit.label(c, '1′ (a 6/6 stroke)', rx - R + q + 6, ry + R - 8, { size: 10.5, color: C.text });
        kit.label(c, 'one point of light on the retina', rx, ry - R - 16, { align: 'center', size: 11.5, color: C.muted });
        const lg = [[C.warn, 'diffraction'], [C.ok, 'aberrations'], [C.series[1], 'focusing error'], [C.accent, 'combined']];
        lg.forEach(([col, tx], i) => { const yy = ry + R + 16 + (i % 2) * 14, xx = rx - R + (i >> 1) * (R + 6); c.save(); c.fillStyle = col; c.fillRect(xx, yy - 4, 10, 8); c.restore(); kit.label(c, tx, xx + 15, yy, { size: 10.5, color: C.text }); });
        // the graph
        const P1 = [], P2 = [], P3 = [], P4 = [];
        for (let x = 1.5; x <= 8.0001; x += 0.25) { P1.push([x, Math.min(airy(x), 12)]); P2.push([x, Math.min(ab(x), 12)]); P3.push([x, Math.min(defb(V.def, x), 12)]); P4.push([x, Math.min(tot(x, V.def), 12)]); }
        plot.set({ y: { label: '′', min: 0, max: 8 }, series: [{ pts: P1, label: 'diffraction', color: C.warn, dash: [5, 3] }, { pts: P2, label: 'aberrations', color: C.ok }, { pts: P3, label: 'focusing error', color: C.series[1], dash: [2, 3] }, { pts: P4, label: 'combined', color: C.accent, width: 3 }], vlines: [{ x: p, label: fix(p, 1) + ' mm' }], marks: [{ x: p, y: Math.min(a4, 8) }] });
        ro.set('p', fix(p, 1) + ' mm' + (V.auto ? ' (at ' + kit.fmt(V.L, 2) + ' cd/m²)' : ''));
        ro.set('N', 'f/' + fix(N, 1));
        ro.set('td', fix(V.L * PI * p * p / 4, 0) + ' trolands (' + fix((p / 2) * (p / 2), 1) + ' × the light of a 2 mm pupil)');
        ro.set('air', fix(a1, 2) + '′ across');
        ro.set('ab', fix(a2, 2) + '′ across (this model eye)');
        ro.set('de', fix(a3, 2) + '′ across (' + fix(V.def, 2) + ' D × ' + fix(p, 1) + ' mm)');
        ro.set('tot', fix(a4, 2) + '′ (the three added in quadrature)');
        ro.set('dof', '± ' + fix(2.44 * 550e-9 / Math.pow(p * 1e-3, 2), 2) + ' D (where focusing error equals the diffraction blur)');
      }, box_.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the mosaic of the retina */
  Hyper.sim('ey-retina', {
    title: 'The retina: a mosaic of cones and rods',
    blurb: `A patch of retina 50 µm across, drawn at the eccentricity you choose (the angle from the fovea). Cones are the larger circles, coloured by the pigment they hold (red-sensitive L, green-sensitive M, blue-sensitive S); rods are the small grey dots. The graph gives the density of each, per square millimetre, on a logarithmic scale. This is a schematic: the densities are typical values from published counts of human retinas, the positions are made up.

**Try this**
- At **0°** (the centre of the foveola) there are only cones, about 2.4 µm apart: half an arc-minute. Two of them span the 1-arc-minute stroke of a 6/6 letter.
- Move to **10°**: the cones are now 12 µm apart (2.5 arc-minutes) and almost lost among rods, which outnumber them nearly 20 to 1.
- At **20°** the rods are at their peak density, about 150 000 per mm², and the cones are a thirtieth of their peak.
- Compare the two curves: cones fall by a factor of 25 in the first 10°; rods rise from nothing and then decline slowly. The eye's sharp, coloured vision and its sensitive, grey vision live in different places.`,
    mount(box_, kit, params) {
      const O = kit.optics, E = O.eye;
      const st = kit.stage(box_.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box_.side, [
        { id: 'ecc', label: 'Eccentricity (angle from the fovea)', min: 0, max: 60, step: 0.1, value: params.ecc != null ? params.ecc : 0, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['reg', 'Region'], ['mm', 'Distance from the fovea'], ['cone', 'Cones'], ['rod', 'Rods'], ['sp', 'Spacing of the cones'], ['ratio', 'Rods per cone']]);
      const plot = kit.plot(box_.side, { x: { label: 'eccentricity (°)', log: true, min: 0.1, max: 80 }, y: { label: '/mm²', log: true, min: 1000, max: 400000 }, series: [] }, 190);
      const PC = [], PR = [];
      for (let e = 0.1; e <= 80; e *= 1.07) { PC.push([e, coneDensity(e)]); PR.push([e, rodDensity(e)]); }
      const regionOf = e => (e < 0.6 ? 'foveola: cones only' : e < 2.5 ? 'fovea (about 5° across in all)' : e < 9 ? 'macula, the parafovea' : e < 30 ? 'the near periphery' : 'the far periphery');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, e = V.ecc, rc = coneDensity(e), rr = rodDensity(e), dc = spacingUm(rc), dr = rr > 0 ? spacingUm(rr) : 0;
        const side = Math.min(W * 0.58, Hh - 40), x0 = 14, y0 = (Hh - side) / 2 + 6, k = side / 50;
        c.save(); c.fillStyle = C.dark ? '#0a0d1c' : '#f1eee6'; c.fillRect(x0, y0, side, side); c.beginPath(); c.rect(x0, y0, side, side); c.clip();
        // rods: a jittered hexagonal lattice of small grey discs
        if (dr > 0) {
          const nj = Math.ceil(54 / (dr * 0.866)) + 1, ni = Math.ceil(54 / dr) + 1;
          c.fillStyle = C.dark ? 'rgba(200,205,225,0.7)' : 'rgba(110,115,140,0.75)';
          for (let j = -1; j <= nj; j++) for (let i = -1; i <= ni; i++) {
            const px = (i + 0.5 * (j & 1) + (hash(i, j) - 0.5) * 0.3) * dr - 2, py = (j * 0.866 + (hash(j, i + 9) - 0.5) * 0.26) * dr - 2;
            c.beginPath(); c.arc(x0 + px * k, y0 + py * k, Math.max(0.8, 0.34 * dr * k), 0, TAU); c.fill();
          }
        }
        // cones: larger discs, coloured by their pigment
        const ci = Math.ceil(54 / dc) + 1, cj = Math.ceil(54 / (dc * 0.866)) + 1, rc0 = Math.min(0.46 * dc, 5.2);
        for (let j = -1; j <= cj; j++) for (let i = -1; i <= ci; i++) {
          const px = (i + 0.5 * (j & 1) + (hash(i + 3, j + 5) - 0.5) * 0.18) * dc - 2, py = (j * 0.866 + (hash(j + 5, i + 3) - 0.5) * 0.16) * dc - 2, h = hash(i * 7 + 1, j * 13 + 2);
          const s = e > 0.45 && h < 0.07 ? 'S' : hash(i * 3 + 5, j * 5 + 1) < 0.62 ? 'L' : 'M';
          c.beginPath(); c.arc(x0 + px * k, y0 + py * k, Math.max(1.2, rc0 * k), 0, TAU);
          c.fillStyle = s === 'L' ? 'rgb(226,92,72)' : s === 'M' ? 'rgb(86,190,104)' : 'rgb(92,120,245)'; c.fill();
          c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = 0.6; c.stroke();
        }
        c.restore();
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0 + 0.5, y0 + 0.5, side - 1, side - 1); c.restore();
        c.save(); c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 + 8, y0 + side - 10); c.lineTo(x0 + 8 + 10 * k, y0 + side - 10); c.stroke(); c.restore();
        kit.label(c, '10 µm', x0 + 14 + 10 * k, y0 + side - 10, { size: 10.5, color: C.text, bg: C.bg2 });
        kit.label(c, 'a patch 50 µm across, schematic', x0, y0 - 9, { size: 11, color: C.muted });
        // the eye from behind-and-above: where on the retina this patch is
        const R = Math.min(96, (W - side - 56) / 2), ex = x0 + side + 28 + R, ey = Hh * 0.36;
        if (R > 24) {
          c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.5; c.fillStyle = C.dark ? 'rgba(235,238,250,0.06)' : 'rgba(40,60,120,0.05)'; c.beginPath(); c.arc(ex, ey, R, 0, TAU); c.fill(); c.stroke();
          c.strokeStyle = C.bad; c.lineWidth = 3; c.beginPath(); c.arc(ex, ey, R - 3, -1.9, 1.9); c.stroke(); c.restore();
          const per = 0.291 / 11.6, pt = ph => [ex + (R - 3) * Math.cos(ph), ey + (R - 3) * Math.sin(ph)];       // radians of arc per degree: 0.291 mm over the retina's radius of about 11.6 mm
          const d0 = pt(0), dd = pt(-15 * per);
          kit.dot(c, d0[0], d0[1], 3.5, C.warn); kit.dot(c, dd[0], dd[1], 3, C.faint);
          const mk = pt(e * per); kit.dot(c, mk[0], mk[1], 5, C.accent, C.surface);
          kit.label(c, 'fovea', d0[0] - 10, d0[1] + 1, { align: 'right', size: 10, color: C.muted });
          kit.label(c, 'optic disc', dd[0] - 8, dd[1] - 5, { align: 'right', size: 10, color: C.faint });
          kit.label(c, 'the right eye from above', ex, ey + R + 14, { align: 'center', size: 10.5, color: C.faint });
          const kx = ex - R, ky = ey + R + 40;
          [['rgb(226,92,72)', 'L cone (long-wave)'], ['rgb(86,190,104)', 'M cone (middle-wave)'], ['rgb(92,120,245)', 'S cone (short-wave)'], [C.muted, 'rod']].forEach(([col, tx], i) => { c.save(); c.fillStyle = col; c.beginPath(); c.arc(kx + 6, ky + i * 17, i === 3 ? 3 : 5.5, 0, TAU); c.fill(); c.restore(); kit.label(c, tx, kx + 20, ky + i * 17, { size: 10.5, color: C.text }); });
        }
        ro.set('reg', regionOf(e));
        ro.set('mm', fix(e * 0.291, 2) + ' mm (' + fix(e, 1) + '°)');
        ro.set('cone', Math.round(rc / 100) * 100 + ' per mm²');
        ro.set('rod', rr > 0 ? Math.round(rr / 100) * 100 + ' per mm²' : 'none: a rod-free zone');
        ro.set('sp', fix(dc, 1) + ' µm = ' + fix(dc / UM_PER_ARCMIN, 2) + '′');
        ro.set('ratio', rr > 0 ? fix(rr / rc, 1) + ' to 1' : 'no rods');
        plot.set({ series: [{ pts: PC, label: 'cones', color: C.series[1], width: 2.6 }, { pts: PR, label: 'rods', color: C.series[0], width: 2.6 }], vlines: [{ x: Math.max(e, 0.1), label: fix(e, 1) + '°' }] });
      }, box_.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a letter sampled by the cones */
  Hyper.sim('ey-acuity', {
    title: 'Acuity: a letter seen through the cone mosaic',
    blurb: `A tumbling **E** is drawn on the retina and sampled by the cones: each square on the left is one cone (schematic square mosaic, no optical blur), grey where the letter covers part of it. A 6/6 (20/20) letter is 5 arc-minutes tall, each stroke and each gap 1 arc-minute. On the right, the letter itself.

**Try this**
- At **0°** shrink the letter from 20 arc-minutes to 5: strokes of 1′ cover two cones each, and the three arms and the gaps are still separate. Below about 2.5′ (strokes narrower than one cone) the mosaic cannot tell the arms apart.
- Go to **5° and then 10°** with the 5′ letter: cone spacing grows from 0.5′ to about 2′ and then 2.5′, and the E dissolves. Make it 25′ tall (20/100) and it is readable again — the periphery needs letters five times as large.
- Turn the letter with *Opens to…* to check you can still tell the direction.
- The graph: the cone spacing and the smallest stroke people typically read (about 1′ at the fovea, growing as 1 + e/2.5°), against the stroke of your letter (the dashed line).`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      const st = kit.stage(box_.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box_.side, [
        { id: 'size', label: 'Height of the letter', min: 1, max: 40, value: params.size || 5, log: true, sig: 3, fmt: v => kit.fmt(v, 3) + '′  (20/' + Math.round(4 * v) + ')' },
        { id: 'ecc', label: 'Where it falls: eccentricity', min: 0, max: 20, step: 0.5, value: params.ecc != null ? params.ecc : 0, unit: '°' },
        { id: 'dir', type: 'select', label: 'The E opens to', options: [['the right', 'r'], ['the left', 'l'], ['the top', 'u'], ['the bottom', 'd']], value: params.dir || 'r' },
        { id: 'grid', type: 'check', label: 'Show the edges of the cones', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['let', 'The letter'], ['ret', 'On the retina'], ['sp', 'Cone spacing here'], ['ratio', 'Strokes per cone spacing'], ['say', 'What the mosaic can do'], ['typ', 'Typical limit at this eccentricity']]);
      const plot = kit.plot(box_.side, { x: { label: 'eccentricity (°)', min: 0, max: 20 }, y: { label: '′', min: 0, max: 10 }, series: [] }, 170);
      const MAR = e => 1 + e / 2.5;                                      // a common rule of thumb: the smallest stroke that is read, in arc-minutes
      const PS = [], PM = [];
      for (let e = 0; e <= 20.001; e += 0.5) { PS.push([e, spacingUm(coneDensity(e)) / UM_PER_ARCMIN]); PM.push([e, MAR(e)]); }
      // is the point (X, Y) of a letter box 5 × 5 units wide inside the E, which opens in direction d?
      function inE(X, Y, d) {
        let bx, by;
        if (d === 'r') { bx = X; by = Y; } else if (d === 'l') { bx = 5 - X; by = Y; } else if (d === 'u') { bx = 5 - Y; by = X; } else { bx = Y; by = X; }
        if (bx < 0 || bx >= 5 || by < 0 || by >= 5) return false;
        return bx < 1 || by < 1 || (by >= 2 && by < 3) || by >= 4;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, h = V.size, e = V.ecc, u = h / 5;
        const cell = spacingUm(coneDensity(e)) / UM_PER_ARCMIN, win = Math.max(12, 1.7 * h), n = clamp(Math.round(win / cell), 4, 110), span = n * cell;
        const side = Math.min(W * 0.46, Hh - 50), xa = 12, xb = W - side - 12, y0 = (Hh - side) / 2 + 10;
        // left: the cones' view
        const key = [h.toFixed(3), e, V.dir, n].join();
        S.image(c, xa, y0, side, side, n, n, (uu, vv) => {
          const x0 = uu * n * cell - span / 2, y1 = vv * n * cell - span / 2;
          let cov = 0;
          for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) if (inE((x0 + (a + 0.5) / 4 * cell) / u + 2.5, (y1 + (b + 0.5) / 4 * cell) / u + 2.5, V.dir)) cov++;
          return 0.07 + 0.88 * (1 - cov / 16);
        }, { smooth: false, key, id: 'acu' });
        if (V.grid && n <= 60) {
          c.save(); c.strokeStyle = 'rgba(40,60,120,0.35)'; c.lineWidth = 0.7; c.beginPath();
          for (let i = 0; i <= n; i++) { const t = side * i / n; c.moveTo(xa + t, y0); c.lineTo(xa + t, y0 + side); c.moveTo(xa, y0 + t); c.lineTo(xa + side, y0 + t); }
          c.stroke(); c.restore();
        }
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(xa + 0.5, y0 + 0.5, side - 1, side - 1); c.restore();
        kit.label(c, 'as the cones sample it (' + n + ' × ' + n + ' cones)', xa, y0 - 9, { size: 11, color: C.muted });
        // right: the letter itself, to the same scale
        c.save(); c.fillStyle = '#f2f0ea'; c.fillRect(xb, y0, side, side); c.strokeStyle = C.axis; c.strokeRect(xb + 0.5, y0 + 0.5, side - 1, side - 1);
        c.fillStyle = '#111'; const k = side / span, L = h * k, lx = xb + side / 2 - L / 2, ly = y0 + side / 2 - L / 2, w = L / 5;
        const bar = (a, b, cw, ch) => c.fillRect(lx + a * w, ly + b * w, cw * w, ch * w);
        const d = V.dir;
        if (d === 'r') { bar(0, 0, 1, 5); bar(0, 0, 5, 1); bar(0, 2, 5, 1); bar(0, 4, 5, 1); }
        else if (d === 'l') { bar(4, 0, 1, 5); bar(0, 0, 5, 1); bar(0, 2, 5, 1); bar(0, 4, 5, 1); }
        else if (d === 'u') { bar(0, 4, 5, 1); bar(0, 0, 1, 5); bar(2, 0, 1, 5); bar(4, 0, 1, 5); }
        else { bar(0, 0, 5, 1); bar(0, 0, 1, 5); bar(2, 0, 1, 5); bar(4, 0, 1, 5); }
        c.restore();
        kit.label(c, 'the letter itself: ' + fix(h, 1) + '′ tall, strokes ' + fix(u, 2) + '′', xb, y0 - 9, { size: 11, color: C.muted });
        // numbers
        const ratio = u / cell, typ = MAR(e);
        ro.set('let', fix(h, 1) + '′ tall, strokes and gaps ' + fix(u, 2) + '′ · 20/' + Math.round(4 * h) + ', logMAR ' + fix(E.logmar(4 * h), 2));
        ro.set('ret', fix(h * UM_PER_ARCMIN, 0) + ' µm tall on the retina, strokes ' + fix(u * UM_PER_ARCMIN, 1) + ' µm');
        ro.set('sp', fix(cell, 2) + '′ = ' + fix(cell * UM_PER_ARCMIN, 1) + ' µm');
        ro.set('ratio', fix(ratio, 2));
        ro.set('say', ratio >= 1.9 ? 'strokes and gaps each cover two cones or more: clearly resolved' : ratio >= 1 ? 'about one cone per stroke: at the limit of the mosaic' : 'strokes narrower than one cone: the arms cannot be told apart');
        ro.set('typ', 'strokes of about ' + fix(typ, 1) + '′ (a letter ' + fix(5 * typ, 0) + '′ tall, 20/' + fix(20 * typ, 0) + ') are the smallest read, typically');
        plot.set({ series: [{ pts: PS, label: 'cone spacing', color: C.series[1], width: 2.6 }, { pts: PM, label: 'smallest stroke read, typical', color: C.series[0], width: 2.6 }], hlines: [{ y: Math.min(u, 10), label: 'this letter', color: C.warn }], marks: [{ x: e, y: Math.min(10, cell) }, { x: e, y: Math.min(10, typ), color: C.series[0] }] });
      }, box_.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ contrast sensitivity */
  Hyper.sim('ey-csf', {
    title: 'Contrast sensitivity: the Campbell–Robson chart',
    blurb: `Stripes get finer from left to right and fainter from bottom to top. Where the stripes fade into the grey, you have reached the **threshold**: the boundary is the eye's contrast-sensitivity curve, an upside-down U. It is highest at medium detail (a few cycles per degree) and falls on both sides: coarse stripes are lost to the eye's own lateral inhibition, fine ones to optics and the cone mosaic. The orange line is the curve of a typical young adult (peak sensitivity about 200, i.e. a contrast of 0.5 %), on an assumed viewing angle.

**Try this**
- Look at the chart from where you are, then lean back: the same stripes now cover a smaller angle, so the *whole* curve slides right on the screen. Move the **viewing angle** slider the other way to mimic it.
- Add **focusing error** (as if without glasses): the fine end of the curve collapses but the coarse end hardly moves. A blurred eye loses small detail first.
- Shrink the **pupil** or open it: a small pupil limits the finest detail by diffraction; a large one by aberrations.
- On a real screen the orange line is only a guide: your screen's brightness, its pixel size and your distance all move the real threshold.`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym, E = O.eye;
      const st = kit.stage(box_.stage, { aspect: 0.52, minH: 300 });
      const ctl = kit.controls(box_.side, [
        { id: 'span', label: 'The chart spans (viewing angle)', min: 1.5, max: 16, step: 0.5, value: params.span || 4, unit: '°' },
        { id: 'def', label: 'Focusing error of the eye', min: 0, max: 2, step: 0.05, value: params.def != null ? params.def : 0, unit: 'D' },
        { id: 'pupil', label: 'Pupil diameter', min: 2, max: 7, step: 0.5, value: params.pupil || 4, unit: 'mm' },
        { id: 'curve', type: 'check', label: 'Draw the eye\'s threshold on the chart', value: params.curve !== false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['peak', 'Most sensitive at'], ['sens', 'Peak sensitivity'], ['cut', 'Finest stripes visible (full contrast)'], ['six', 'A 6/6 letter\'s detail'], ['span', 'Stripes on the chart']]);
      const plot = kit.plot(box_.side, { x: { label: 'cycles per degree', log: true, min: 0.3, max: 80 }, y: { label: 'sens.', log: true, min: 1, max: 400 }, series: [] }, 180);
      const efl = O.sys.paraxial(O.lens('eye')).efl, S0 = 200, FW0 = 4, RF = 60, LNR = Math.log(RF), CT = 0.003, CB = 1, LNC = Math.log(CB / CT);
      const sens = f => {
        const nu = f / (efl * D2R), blur = E.blurAngle(V.def, V.pupil) * efl;                  // cycles per mm of retina; blur disc in mm
        return S0 * E.csf(f) * Math.abs(O.mtf.defocus(nu, blur));
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, span = V.span;
        const x0 = 46, x1 = W - 14, y0 = 24, y1 = Hh - 78, cw = x1 - x0, ch = y1 - y0;
        const nx = clamp(Math.round(cw), 160, 900), key = nx + '|' + ch;
        // the chart: a chirp in frequency (to the right) and in contrast (downwards, logarithmic)
        S.image(c, x0, y0, cw, ch, nx, 150, (u, v) => {
          const ph = FW0 / LNR * (Math.exp(LNR * u) - 1), con = CT * Math.exp(LNC * v);
          return 0.5 * (1 + con * Math.sin(TAU * ph));
        }, { gamma: 1 / 2.2, key, id: 'csf' });
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0 + 0.5, y0 + 0.5, cw - 1, ch - 1); c.restore();
        // axes: spatial frequency (cycles per degree) along the bottom, contrast down the side
        for (const f of [0.5, 1, 2, 5, 10, 20, 50]) {
          const u = Math.log(f * span / FW0) / LNR;
          if (u < 0 || u > 1) continue;
          c.save(); c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x0 + u * cw, y1); c.lineTo(x0 + u * cw, y1 + 5); c.stroke(); c.restore();
          kit.label(c, String(f), x0 + u * cw, y1 + 15, { align: 'center', size: 10.5, color: C.muted });
        }
        kit.label(c, 'finer stripes: cycles per degree  →', x1, y1 + 32, { align: 'right', size: 11, color: C.muted });
        for (const q of [0.01, 0.1, 1]) {
          const v = Math.log(q / CT) / LNC;
          c.save(); c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x0 - 5, y0 + v * ch); c.lineTo(x0, y0 + v * ch); c.stroke(); c.restore();
          kit.label(c, q * 100 + ' %', x0 - 8, y0 + v * ch, { align: 'right', size: 10.5, color: C.muted });
        }
        kit.label(c, 'contrast ↓', 6, y0 - 10, { size: 11, color: C.muted });
        // the eye's threshold: the contrast at which the stripes just vanish
        let pk = 0, pf = 0;
        if (V.curve) {
          const pts = []; let seg = [];
          for (let i = 0; i <= 240; i++) {
            const u = i / 240, f = FW0 * Math.exp(LNR * u) / span, th = 1 / sens(f), v = Math.log(th / CT) / LNC;
            if (v >= 0 && v <= 1) seg.push([x0 + u * cw, y0 + v * ch]); else if (seg.length) { pts.push(seg); seg = []; }
          }
          if (seg.length) pts.push(seg);
          for (const sg of pts) stroke(c, sg, C.warn, 2.6);
        }
        for (let f = 0.2; f < 70; f *= 1.04) { const s = sens(f); if (s > pk) { pk = s; pf = f; } }
        let cut = pf; while (cut < 150 && sens(cut) >= 1) cut *= 1.01;
        // the curve itself
        const P = []; for (let f = 0.3; f <= 80; f *= 1.06) P.push([f, Math.max(sens(f), 1e-3)]);
        plot.set({ series: [{ pts: P, label: 'this eye', color: C.warn, width: 2.8 }], marks: [{ x: pf, y: pk, label: fix(pf, 1) + ' c/°' }], vlines: [{ x: 30, label: '6/6', color: C.ok }], hlines: [{ y: 1, label: 'contrast 100 %' }] });
        ro.set('peak', fix(pf, 1) + ' cycles per degree (stripes ' + fix(60 / pf, 1) + '′ wide)');
        ro.set('sens', fix(pk, 0) + ' (a contrast of ' + fix(100 / pk, 2) + ' %)');
        ro.set('cut', fix(cut, 0) + ' cycles per degree (about 20/' + fix(600 / cut, 0) + ')');
        ro.set('six', '30 cycles per degree: strokes of 1′');
        ro.set('span', 'from ' + fix(FW0 / span, 2) + ' to ' + fix(FW0 * RF / span, 0) + ' cycles per degree');
      }, box_.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the visual field and the blind spot */
  Hyper.sim('ey-field', {
    title: 'The visual field, and finding the blind spot',
    blurb: `**The field.** Everything one eye sees while it looks straight ahead, drawn as if you were looking out: about 60° towards the nose, 100° towards the temple, 60° up and 75° down. The two eyes overlap in the middle (green): that is where depth is seen. The rings are 10° apart; the small circles mark where vision is sharpest and where it still has colour. The black ovals are the blind spots.

**The blind spot.** Switch the mode. Close your **left** eye and look at the cross with your **right** eye from the distance the read-out gives: the dot vanishes, because its image falls on the optic disc.

**Try this**
- Show one eye, then both: the field grows from 160° to 200° across, and its middle 120° is seen by both eyes.
- Switch *zones* on: the circle of sharpest vision is only 2° across, about the width of your thumb at arm's length. The rest of the field is for noticing, not for reading.
- In the blind-spot test, drag the dot closer to the cross: the distance to hold your eye at shrinks in proportion.`,
    mount(box_, kit, params) {
      const O = kit.optics, E = O.eye, FLD = E.FIELD, NEXP = 2.3;
      const st = kit.stage(box_.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box_.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['The visual field of the eyes', 'field'], ['The blind spot test', 'blind']], value: params.mode || 'field' },
        { id: 'eyes', type: 'select', label: 'Eyes', options: [['Both eyes, the overlap marked', 'both'], ['Right eye', 'right'], ['Left eye', 'left']], value: params.eyes || 'both' },
        { id: 'zones', type: 'check', label: 'Show where vision is sharp and where it has colour', value: params.zones !== false },
        { id: 'sep', label: 'Blind-spot test: distance from the cross to the dot', min: 80, max: 360, step: 5, value: params.sep || 200, unit: 'px' }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['a', 'Across (horizontal)'], ['b', 'Up and down'], ['c', 'Seen by both eyes'], ['d', 'Sharpest vision'], ['e', 'Blind spot'], ['f', 'Distance for the dot to vanish']]);
      function sync() { ctl.show('eyes', V.mode === 'field'); ctl.show('zones', V.mode === 'field'); ctl.show('sep', V.mode === 'blind'); ro.show('a', V.mode === 'field'); ro.show('b', V.mode === 'field'); ro.show('c', V.mode === 'field'); ro.show('d', V.mode === 'field'); ro.show('e', true); ro.show('f', V.mode === 'blind'); }
      const limits = eye => (eye === 'right' ? { l: FLD.nasal, r: FLD.temporal } : { l: FLD.temporal, r: FLD.nasal });
      const inField = (x, y, eye) => { const q = limits(eye), a = x < 0 ? q.l : q.r, b = y >= 0 ? FLD.up : FLD.down; return Math.pow(Math.abs(x) / a, NEXP) + Math.pow(Math.abs(y) / b, NEXP) <= 1; };
      const outline = (eye, n) => {
        const q = limits(eye), o = [];
        for (let i = 0; i < n; i++) { const t = TAU * i / n, ct = Math.cos(t), sn = Math.sin(t), a = ct < 0 ? q.l : q.r, b = sn >= 0 ? FLD.up : FLD.down; o.push([Math.sign(ct) * a * Math.pow(Math.abs(ct), 2 / NEXP), Math.sign(sn) * b * Math.pow(Math.abs(sn), 2 / NEXP)]); }
        return o;
      };
      let AREAS = null;
      const areas = () => {
        if (AREAS) return AREAS;
        let r = 0, l = 0, u = 0, ov = 0;
        for (let x = -99.5; x < 100; x += 1) for (let y = -74.5; y < 60; y += 1) { const a = inField(x, y, 'right'), b = inField(x, y, 'left'); if (a) r++; if (b) l++; if (a || b) u++; if (a && b) ov++; }
        return (AREAS = { right: r, left: l, both: u, overlap: ov });
      };
      const BS = { x: E.DATA.blindSpot, y: -1.5, w: 5.5, h: 7.5 }, PXMM = 25.4 / 96, DOT = 14;
      const geo = { cx: 0, cy: 0, dotx: 0 };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (V.mode === 'blind') {
          // the test: a cross and a dot, to be viewed with one eye at the distance given
          const cy = Hh * 0.42, cx = Math.max(60, W / 2 - V.sep / 2 - 20), dx = cx + V.sep;
          geo.cx = cx; geo.cy = cy; geo.dotx = dx;
          c.save(); c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(cx - 12, cy); c.lineTo(cx + 12, cy); c.moveTo(cx, cy - 12); c.lineTo(cx, cy + 12); c.stroke(); c.restore();
          kit.dot(c, dx, cy, DOT / 2, C.text);
          c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(cx + 16, cy + 26); c.lineTo(dx, cy + 26); c.stroke(); c.restore();
          const dist = V.sep * PXMM / Math.tan(BS.x * D2R);
          kit.label(c, V.sep + ' px = ' + fix(V.sep * PXMM, 0) + ' mm on a screen of 96 px per inch', (cx + dx) / 2, cy + 42, { align: 'center', size: 11.5, color: C.muted });
          kit.label(c, 'Close your LEFT eye. Look at the cross with your RIGHT eye, from about ' + fix(dist / 10, 0) + ' cm away.', W / 2, Hh * 0.7, { align: 'center', size: 12.5, color: C.text, weight: 600 });
          kit.label(c, 'Move slowly nearer or farther: at the right distance the dot disappears. (Drag the dot to change the spacing.)', W / 2, Hh * 0.7 + 22, { align: 'center', size: 11.5, color: C.muted });
          kit.label(c, 'The dot is 15° from the cross at that distance; the blind spot is about ' + BS.w + '° wide and ' + BS.h + '° high.', W / 2, Hh * 0.7 + 42, { align: 'center', size: 11.5, color: C.muted });
          ro.set('e', fix(BS.w, 1) + '° × ' + fix(BS.h, 1) + '°, ' + BS.x + '° from the line of sight on the temple side');
          ro.set('f', fix(dist / 10, 1) + ' cm for a spacing of ' + V.sep + ' px (' + BS.x + '°)');
          return;
        }
        const narrow = W < 640, R = clamp(narrow ? Math.min(Hh / 2 - 20, (W - 150) / 2) : Math.min(W / 2 - 44, Hh / 2 - 22), 60, 420), s = R / 100, cx = narrow ? W - R - 18 : W / 2, cy = Hh / 2 + 6;
        const X = x => cx + x * s, Y = y => cy - y * s, tr = a => a.map(p => [X(p[0]), Y(p[1])]);
        const eyes = V.eyes === 'both' ? ['right', 'left'] : [V.eyes];
        for (let r = 10; r <= 100; r += 10) { c.save(); c.strokeStyle = r % 50 === 0 ? C.axis : C.grid; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, r * s, 0, TAU); c.stroke(); c.restore(); if (r % 20 === 0 || r === 10) kit.label(c, r + '°', cx + 3, cy + r * s + 1, { size: 10, color: C.faint }); }
        for (let a = 0; a < 180; a += 30) { const t = a * D2R; stroke(c, [[cx - R * Math.cos(t), cy + R * Math.sin(t)], [cx + R * Math.cos(t), cy - R * Math.sin(t)]], C.grid, 1); }
        const cols = { right: C.series[0], left: C.series[1] }, outs = {};
        for (const e of eyes) { outs[e] = tr(outline(e, 160)); c.save(); c.globalAlpha = 0.22; fillp(c, outs[e], cols[e]); c.restore(); }
        if (eyes.length === 2) { c.save(); path(c, outs.right, true); c.clip(); c.globalAlpha = 0.34; fillp(c, outs.left, C.ok); c.restore(); }
        for (const e of eyes) stroke(c, outs[e], cols[e], 2.4, null, true);
        if (V.zones) [[FLD.colour, [5, 4]], [E.DATA.fovea / 2, []], [FLD.reading / 2, []]].forEach(([r, d], i) => {      // colour: to 60° from the line of sight; the fovea about 5° and the sharpest part about 2° across
          c.save(); c.strokeStyle = C.text; c.lineWidth = i ? 1.6 : 1.1; c.setLineDash(d); c.globalAlpha = i ? 0.95 : 0.7; c.beginPath(); c.arc(cx, cy, Math.max(1.5, r * s), 0, TAU); if (i === 2) { c.fillStyle = C.accent; c.globalAlpha = 0.5; c.fill(); c.globalAlpha = 0.95; } c.stroke(); c.restore();
        });
        for (const e of eyes) {
          const bx = (e === 'right' ? 1 : -1) * BS.x;
          c.save(); c.fillStyle = C.text; c.globalAlpha = 0.85; c.beginPath(); c.ellipse(X(bx), Y(BS.y), BS.w / 2 * s, BS.h / 2 * s, 0, 0, TAU); c.fill(); c.restore();
          kit.label(c, 'blind spot', X(bx), Y(BS.y) + BS.h / 2 * s + 9, { align: 'center', size: 10, color: C.text });
        }
        stroke(c, [[cx - 7, cy], [cx + 7, cy]], C.text, 1.4); stroke(c, [[cx, cy - 7], [cx, cy + 7]], C.text, 1.4);
        const items = eyes.map(e => [cols[e], e + ' eye: ' + (limits(e).l + limits(e).r) + '°']);
        if (eyes.length === 2) items.push([C.ok, 'both eyes: ' + FLD.binocularOverlap + '°']);
        items.forEach(([col, tx], i) => { c.save(); c.globalAlpha = 0.6; c.fillStyle = col; c.fillRect(10, 14 + i * 17 - 5, 16, 10); c.restore(); kit.label(c, tx, 32, 14 + i * 17, { size: 10.5, color: C.text }); });
        kit.label(c, 'as if looking out: the line of sight is at the centre', W - 8, Hh - 10, { align: 'right', size: 10.5, color: C.faint });
        const A = areas(), f1 = eyes.length === 2 ? A.both : A.right;
        ro.set('a', (eyes.length === 2 ? FLD.bothEyes : limits(eyes[0]).l + limits(eyes[0]).r) + '° (' + (eyes.length === 2 ? 'one eye: ' + (FLD.nasal + FLD.temporal) + '°' : FLD.nasal + '° towards the nose, ' + FLD.temporal + '° towards the temple') + ')');
        ro.set('b', (FLD.up + FLD.down) + '° (' + FLD.up + '° up, ' + FLD.down + '° down)');
        ro.set('c', eyes.length === 2 ? FLD.binocularOverlap + '° wide, ' + fix(100 * A.overlap / A.both, 0) + ' % of the field' : 'show both eyes');
        ro.set('d', 'a circle ' + FLD.reading + '° across: ' + fix(100 * PI * FLD.reading * FLD.reading / 4 / f1, 3) + ' % of the field (on this flat chart)');
        ro.set('e', fix(BS.w, 1) + '° × ' + fix(BS.h, 1) + '°, ' + BS.x + '° from the line of sight on the temple side');
      }, box_.stage);
      kit.drag(st, {
        hover: true,
        hit: p => (V.mode === 'blind' && Math.hypot(p.x - geo.dotx, p.y - geo.cy) < 16 ? 'dot' : null),
        move: (w, p) => { ctl.set('sep', clamp(Math.round((p.x - geo.cx) / 5) * 5, 80, 360)); loop.once(); }
      });
      st.onResize(() => loop.once());
      sync(); loop.once();
    }
  });

  /* ================================================================ binocular vision and stereopsis */
  Hyper.sim('ey-stereo', {
    title: 'Two eyes, two points: convergence and disparity',
    blurb: `A plan view: your eyes at the bottom, a fixation point **A** and a second point **B** straight ahead. Each eye turns to look at A; the two lines of sight meet at the **convergence** angle. B is at a different distance, so it falls on slightly different places in the two retinas: the difference is the **binocular disparity**, and it is the cue for depth. (The eyes are drawn wider apart than to scale so that the angles can be seen; the numbers are exact.)

**Try this**
- Drag **A** nearer: the convergence angle grows (6.0° at 60 cm for a 63 mm separation) and so does the focusing demand, 1 ÷ distance.
- Move **B** a little behind A. The two small windows show where B falls in each eye relative to A (enlarged); the disparity is in seconds of arc.
- Raise the **stereo acuity** threshold from 20″ to 60″ and watch the *smallest depth step* grow: depth is seen only if the disparity exceeds the threshold.
- Put A at 20 m: the smallest detectable depth step grows with the *square* of the distance (about 60 cm at 20 m for 20″), so stereopsis fades; beyond several hundred metres it is lost, and distance is judged by other cues.`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box_.stage, { aspect: 0.62, minH: 340 });
      const dFmt = v => distText(v);
      const ctl = kit.controls(box_.side, [
        { id: 'ipd', label: 'Interpupillary distance', min: 50, max: 75, step: 1, value: params.ipd || 63, unit: 'mm' },
        { id: 'd1', label: 'Point A: distance', min: 0.25, max: 100, value: params.d1 || 1, log: true, sig: 3, fmt: dFmt },
        { id: 'd2', label: 'Point B: distance', min: 0.25, max: 100, value: params.d2 || 1.3, log: true, sig: 3, fmt: dFmt },
        { id: 'eta', label: 'Stereo acuity of this viewer', min: 2, max: 120, value: params.eta || 20, log: true, sig: 2, unit: '″' },
        { id: 'range', type: 'select', label: 'The plan view shows up to', options: [['1.5 m', 1.5], ['3 m', 3], ['10 m', 10], ['30 m', 30], ['100 m', 100]], value: params.range || 1.5 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['conv', 'Convergence on A'], ['acc', 'Focusing demand on A'], ['disp', 'Disparity of B against A'], ['depth', 'B is'], ['step', 'Smallest depth step at A'], ['seen', 'Seen in depth?'], ['lim', 'Stereo reaches to about']]);
      const plot = kit.plot(box_.side, { x: { label: 'distance (m)', log: true, min: 0.25, max: 100 }, y: { label: 'Δd (m)', log: true, min: 0.0001, max: 200 }, series: [] }, 170);
      const ARCSEC = 206265, vergence = (ipd, d) => 2 * Math.atan(ipd / 2 / d);                 // ipd and d in the same unit
      const geo = { yEye: 0, top: 0, k: 1, xA: 0, xB: 0 };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, a = V.ipd / 1000, d1 = V.d1, d2 = V.d2, R = V.range;
        const wide = W >= 560, pw = wide ? W * 0.58 : W, ph = wide ? Hh : Hh * 0.62;
        const yEye = ph - 34, top = 22, k = (yEye - top) / R, cx = pw * 0.5, half = 22;                     // px per metre along the view; the eyes are 44 px apart
        geo.yEye = yEye; geo.top = top; geo.k = k; geo.cx = cx;
        // distance scale
        const ticks = R <= 1.5 ? [0.5, 1, 1.5] : R <= 3 ? [0.5, 1, 2, 3] : R <= 10 ? [1, 2, 5, 10] : R <= 30 ? [5, 10, 20, 30] : [20, 50, 100];
        for (const t of ticks) { const y = yEye - t * k; c.save(); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(34, y); c.lineTo(pw - 8, y); c.stroke(); c.restore(); kit.label(c, t + ' m', 6, y, { size: 10.5, color: C.faint }); }
        const y1 = yEye - clamp(d1, 0, R) * k, y2 = yEye - clamp(d2, 0, R) * k;
        geo.y1 = y1; geo.y2 = y2;
        const eyes = [[cx - half, 'left'], [cx + half, 'right']];
        // lines of sight
        for (const [ex] of eyes) {
          stroke(c, [[ex, yEye], [cx, y1]], C.accent, 2);
          stroke(c, [[ex, yEye], [cx, y2]], C.warn, 1.4, [5, 4]);
        }
        for (const [ex] of eyes) { c.save(); c.fillStyle = C.dark ? 'rgba(235,238,250,0.18)' : 'rgba(255,255,255,0.9)'; c.strokeStyle = C.text; c.lineWidth = 1.4; c.beginPath(); c.arc(ex, yEye, 8, 0, TAU); c.fill(); c.stroke(); c.fillStyle = C.accent; c.beginPath(); c.arc(ex, yEye - 5.5, 2.6, 0, TAU); c.fill(); c.restore(); }
        kit.label(c, 'left eye', cx - half, yEye + 20, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'right eye', cx + half, yEye + 20, { align: 'center', size: 10.5, color: C.muted });
        kit.dot(c, cx, y2, 6, C.bg2, C.warn); kit.label(c, 'B  ' + distText(d2) + (d2 > R ? ' ↑' : ''), cx + 12, y2, { size: 11.5, color: C.warn, weight: 650 });
        kit.dot(c, cx, y1, 7, C.accent); kit.label(c, 'A  ' + distText(d1) + (d1 > R ? ' ↑' : ''), cx - 12, y1, { align: 'right', size: 11.5, color: C.accent, weight: 650 });
        const th1 = vergence(a, d1), th2 = vergence(a, d2), disp = (th1 - th2) * ARCSEC;               // positive: B is farther than A
        if (yEye - y1 > 60) S.angle(c, cx, y1, 36, Math.atan2(yEye - y1, half), Math.atan2(yEye - y1, -half), fix(th1 * R2D, th1 * R2D < 1 ? 2 : 1) + '°', { size: 11, gap: 14 });
        // the two retinal views: where B falls beside A in each eye (enlarged)
        const wins = wide ? [[pw + 10, 24, W - pw - 20, Hh * 0.3, 'left eye sees'], [pw + 10, 24 + Hh * 0.3 + 24, W - pw - 20, Hh * 0.3, 'right eye sees']]
          : [[10, ph + 18, W / 2 - 14, Hh - ph - 44, 'left eye sees'], [W / 2 + 4, ph + 18, W / 2 - 14, Hh - ph - 44, 'right eye sees']];
        const per = (th1 - th2) / 2 * ARCSEC, scale = 34 / Math.max(Math.abs(per), 20);               // px per arc-second, enlarged
        wins.forEach(([wx, wy, ww, wh, nm], i) => {
          const sg = i ? 1 : -1, mid = wx + ww / 2, my = wy + wh / 2 + 6;
          box(c, kit, wx, wy, ww, wh, nm);
          kit.dot(c, mid, my, 5, C.accent);
          const off = sg * per * scale;
          kit.dot(c, mid + off, my, 4.5, C.bg2, C.warn);
          kit.label(c, 'A', mid, my + 15, { align: 'center', size: 10.5, color: C.accent });
          kit.label(c, 'B', mid + off, my - 14, { align: 'center', size: 10.5, color: C.warn });
        });
        kit.label(c, 'retinal images, enlarged (1 px = ' + fix(1 / scale, 2) + '″)', wide ? pw + 10 : 10, wide ? 24 + 2 * Hh * 0.3 + 44 : ph + 12, { size: 10.5, color: C.faint });
        // numbers
        const eta = V.eta / ARCSEC, step = eta * d1 * d1 / a, limit = a / eta;
        ro.set('conv', fix(th1 * R2D, th1 * R2D < 1 ? 2 : 1) + '° (' + fix(100 * a / d1, 1) + ' prism dioptres)');
        ro.set('acc', fix(1 / d1, 2) + ' D');
        ro.set('disp', fix(Math.abs(disp), Math.abs(disp) < 10 ? 1 : 0) + '″ (' + fix(Math.abs(disp) / 60, 2) + '′)' + (Math.abs(disp) < 0.05 ? '' : disp > 0 ? ', B behind A (uncrossed)' : ', B in front of A (crossed)'));
        ro.set('depth', Math.abs(d2 - d1) < 1e-9 ? 'at the same distance' : lenText(Math.abs(d2 - d1)) + (d2 > d1 ? ' behind' : ' in front of') + ' A');
        ro.set('step', lenText(step) + ' for ' + V.eta + '″' + (step > d1 ? ' (more than the distance itself)' : ''));
        ro.set('seen', Math.abs(disp) >= V.eta ? 'yes: the disparity is above the ' + V.eta + '″ threshold' : 'no: the disparity is below the ' + V.eta + '″ threshold');
        ro.set('lim', lenText(limit) + ': beyond it even a point at infinity differs by less than ' + V.eta + '″');
        const P = []; for (let d = 0.25; d <= 100.01; d *= 1.08) P.push([d, V.eta / ARCSEC * d * d / a]);
        plot.set({ series: [{ pts: P, label: 'smallest depth step', color: C.accent, width: 2.6 }], marks: [{ x: d1, y: step }], vlines: [{ x: d1, label: 'A' }] });
      }, box_.stage);
      kit.drag(st, {
        hover: true,
        hit: p => (Math.abs(p.x - geo.cx) < 22 && Math.abs(p.y - geo.y1) < 14 ? 'A' : Math.abs(p.x - geo.cx) < 22 && Math.abs(p.y - geo.y2) < 14 ? 'B' : null),
        move: (w, p) => {
          const d = clamp((geo.yEye - p.y) / geo.k, 0.25, 100);
          ctl.set(w === 'A' ? 'd1' : 'd2', d); loop.once();
        }
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ eye movements */
  Hyper.sim('ey-movements', {
    title: 'Eye movements: saccades, pursuit and fixation',
    blurb: `The trace shows where the eye points (horizontal angle) against the last four seconds. **Saccades**: the target jumps and the eye follows after a latency of about 0.2 s with a very fast jump, lasting only 30–100 ms. **Pursuit**: the eye follows a moving target smoothly, and drops behind it if it is too fast, then catches up with a saccade. **Fixation**: even when you stare, the eye drifts, trembles and makes tiny jumps (microsaccades); the scale here is only ±0.6°. The strip at the top shows the target (orange dot) and the gaze (ring).

**Try this**
- In *saccades*, set the amplitude to 20° and then 5°: the big jump takes longer (about 21 ms plus 2.2 ms for each degree) and reaches a speed of several hundred degrees per second. Vision is suppressed while it happens, which is why you never see your own eyes sweep.
- In *pursuit*, raise the speed past about 70°/s: the gain falls and catch-up saccades appear as steps in the smooth trace.
- In *fixation* the eye is never still: slow drift, then a microsaccade that corrects it. The drift is only a few arc-minutes per second — and it keeps the image of a fixed scene from fading.`,
    mount(box_, kit, params) {
      const st = kit.stage(box_.stage, { aspect: 0.58, minH: 320 });
      const ctl = kit.controls(box_.side, [
        { id: 'kind', type: 'select', label: 'The eye is…', options: [['jumping to new targets (saccades)', 'sacc'], ['following a moving target (pursuit)', 'pur'], ['looking at a fixed point (fixation)', 'fix']], value: params.kind || 'sacc' },
        { id: 'amp', label: 'Amplitude of the target\'s movement', min: 2, max: 25, step: 1, value: params.amp || 10, unit: '°' },
        { id: 'every', label: 'Time between jumps', min: 0.4, max: 2, step: 0.1, value: 1, unit: 's' },
        { id: 'speed', label: 'Peak speed of the target', min: 5, max: 100, step: 1, value: params.speed || 25, unit: '°/s' },
        { type: 'buttons', items: [{ id: 'pause', label: 'Pause or resume' }, { id: 'clear', label: 'Start again', primary: true }] }
      ], (id) => { if (id === 'pause') paused = !paused; if (id === 'clear' || id === 'kind') reset(); sync(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['pos', 'Eye position now'], ['vel', 'Eye speed now'], ['last', 'Last saccade'], ['seq', 'Typical saccade of this size'], ['gain', 'Pursuit']]);
      const sync = () => { ctl.show('every', V.kind === 'sacc'); ctl.show('speed', V.kind === 'pur'); ctl.show('amp', V.kind !== 'fix'); ro.show('last', true); ro.show('seq', V.kind !== 'pur'); ro.show('gain', V.kind === 'pur'); };
      let paused = false, S0;
      // a small seeded random generator, so that the same story repeats
      function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
      const N = 4000;                                           // the last four seconds at 1 kHz
      function reset() {
        S0 = { T: 0, X: 0, O: 0, drift: 0, sac: null, tgt: 0, nextJump: 0.3, pend: 0, rnd: rng(7), xs: new Float32Array(N), ts: new Float32Array(N), gs: new Float32Array(N), n: 0, lastSac: null, catchups: [], nextMicro: 0.6, vel: 0, refr: 0 };
      }
      reset(); sync();
      const pg = () => clamp(1 - (V.speed - 20) / 200, 0.7, 0.97);                           // the pursuit gain falls as the target speeds up
      const dur = a => (21 + 2.2 * Math.abs(a)) / 1000, prof = s => (s <= 0 ? 0 : s >= 1 ? 1 : 10 * s * s * s - 15 * s * s * s * s + 6 * s * s * s * s * s);
      function startSac(a) { if (Math.abs(a) < 0.02) return; S0.sac = { t0: S0.T, d: Math.max(0.02, dur(a)), amp: a, o0: S0.O }; S0.lastSac = { amp: a, dur: Math.max(0.02, dur(a)) }; }
      const tgtAt = t => (V.kind === 'pur' ? V.amp * Math.sin(t * V.speed / V.amp) : V.kind === 'fix' ? 0 : S0.tgt);       // pursuit: peak speed = amplitude × angular frequency
      function tick(h) {
        const S = S0, rnd = S.rnd;
        S.T += h;
        if (V.kind === 'sacc') {
          if (S.T >= S.nextJump) { S.tgt = (rnd() * 2 - 1) * V.amp; if (Math.abs(S.tgt - S.X) < 1) S.tgt = -S.tgt; S.nextJump = S.T + V.every; S.pend = S.T + 0.2 + (rnd() - 0.5) * 0.04; }
          if (S.pend && S.T >= S.pend && !S.sac) { startSac(S.tgt - S.X); S.pend = 0; }
        }
        let Xp = 0;
        if (V.kind === 'pur') {
          Xp = pg() * tgtAt(S.T - 0.02);
          const err = tgtAt(S.T) - (Xp + S.O);
          if (!S.sac && S.T > S.refr && Math.abs(err) > 3) { startSac(err); S.catchups.push(S.T); S.refr = S.T + 0.3; }
        }
        if (V.kind === 'fix') {
          S.drift += (-S.drift * 0.4 * h) + (rnd() - 0.5) * 0.0126 * Math.sqrt(h * 1000) * 0.5;      // a slow random walk, a few arc-minutes per second
          Xp = S.drift;
          if (!S.sac && (Math.abs(Xp + S.O) > 0.16 || S.T >= S.nextMicro)) { startSac(-(Xp + S.O) * (0.8 + 0.4 * rnd())); S.nextMicro = S.T + 0.5 + rnd() * 1.0; }
        }
        if (S.sac) {
          const s = (S.T - S.sac.t0) / S.sac.d;
          S.O = S.sac.o0 + S.sac.amp * prof(s);
          if (s >= 1) S.sac = null;
        }
        const xNew = Xp + S.O + (V.kind === 'fix' ? 0.004 * Math.sin(TAU * 80 * S.T) : 0);
        S.vel = (xNew - S.X) / h; S.X = xNew;
        const i = S.n % N; S.xs[i] = S.X; S.ts[i] = S.T; S.gs[i] = V.kind === 'sacc' ? S.tgt : tgtAt(S.T); S.n++;
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (!paused) { let rem = dt; while (rem > 1e-9) { const h = Math.min(0.001, rem); tick(h); rem -= h; } }
        const S = S0, sc = V.kind === 'fix' ? 0.6 : V.amp + 3;                       // the half-range of the vertical scale, degrees
        // the strip: the target and the gaze along the line
        const sx0 = 40, sx1 = W - 14, sy = 30, mapX = a => sx0 + (a / sc + 1) / 2 * (sx1 - sx0);
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(sx0, sy); c.lineTo(sx1, sy); c.stroke(); c.restore();
        for (const a of [-sc, 0, sc]) kit.label(c, fix(a, V.kind === 'fix' ? 1 : 0) + '°', mapX(a), sy + 16, { align: 'center', size: 10.5, color: C.faint });
        const tg = V.kind === 'sacc' ? S.tgt : tgtAt(S.T);
        kit.dot(c, mapX(clamp(tg, -sc, sc)), sy, 7, C.warn);
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath(); c.arc(mapX(clamp(S.X, -sc, sc)), sy, 11, 0, TAU); c.stroke(); c.restore();
        kit.label(c, 'where the target is (dot) and where the eye points (ring)', sx0, 10, { size: 10.5, color: C.muted });
        // the chart: position against time
        const x0 = 46, x1 = W - 14, y0 = 74, y1 = Hh - 34, ym = a => y1 - (a / sc + 1) / 2 * (y1 - y0), tx = t => x0 + (t - (S.T - 4)) / 4 * (x1 - x0);
        c.save(); c.fillStyle = C.surface; c.fillRect(x0, y0, x1 - x0, y1 - y0); c.strokeStyle = C.axis; c.strokeRect(x0 + 0.5, y0 + 0.5, x1 - x0 - 1, y1 - y0 - 1); c.restore();
        const step = V.kind === 'fix' ? 0.2 : sc > 18 ? 10 : 5;
        for (let a = -Math.floor(sc / step) * step; a <= sc + 1e-9; a += step) { c.save(); c.strokeStyle = a === 0 ? C.axis : C.grid; c.beginPath(); c.moveTo(x0, ym(a)); c.lineTo(x1, ym(a)); c.stroke(); c.restore(); kit.label(c, fix(a, V.kind === 'fix' ? 1 : 0) + '°', x0 - 6, ym(a), { align: 'right', size: 10.5, color: C.muted }); }
        for (let t = Math.ceil(S.T - 4); t <= S.T; t++) { const X = tx(t); if (X > x0) { c.save(); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(X, y0); c.lineTo(X, y1); c.stroke(); c.restore(); kit.label(c, Math.round(t) + ' s', X, y1 + 14, { align: 'center', size: 10.5, color: C.faint }); } }
        const n = Math.min(S.n, N), eye = [], tgt = [];
        for (let k = 0; k < n; k += 4) { const i = (S.n - n + k) % N; const t = S.ts[i]; if (t >= S.T - 4) { eye.push([tx(t), ym(clamp(S.xs[i], -sc, sc))]); tgt.push([tx(t), ym(clamp(S.gs[i], -sc, sc))]); } }
        c.save(); c.beginPath(); c.rect(x0, y0, x1 - x0, y1 - y0); c.clip();
        stroke(c, tgt, C.warn, 1.6, [5, 4]); stroke(c, eye, C.accent, 2.2); c.restore();
        kit.label(c, 'eye position (blue) and target (orange, dashed) over the last 4 seconds', x0, y0 - 10, { size: 10.5, color: C.muted });
        // numbers
        const k = V.amp, a = S.lastSac;
        ro.set('pos', fix(S.X, V.kind === 'fix' ? 2 : 1) + '°');
        ro.set('vel', fix(Math.abs(S.vel), 0) + '°/s');
        ro.set('last', a ? fix(Math.abs(a.amp), V.kind === 'fix' ? 2 : 1) + '° in ' + fix(a.dur * 1000, 0) + ' ms, peak speed ' + fix(1.875 * Math.abs(a.amp) / a.dur, 0) + '°/s' : 'none yet');
        ro.set('seq', V.kind === 'fix' ? 'a microsaccade of 0.2° lasts about ' + fix(dur(0.2) * 1000, 0) + ' ms' : 'a jump of ' + k + '° lasts about ' + fix(dur(k) * 1000, 0) + ' ms, peaking near ' + fix(1.875 * k / dur(k), 0) + '°/s');
        const recent = S.catchups.filter(t => t > S.T - 4).length;
        ro.set('gain', 'gain ' + fix(pg(), 2) + ' (eye speed ÷ target speed), ' + recent + ' catch-up saccades in the last 4 s');
      }, box_.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ light and dark adaptation */
  Hyper.sim('ey-adaptation', {
    title: 'Light and dark adaptation, and the Purkinje shift',
    blurb: `**Left:** three patches that are equally bright by day (they are set to equal photopic luminance: red 630 nm, green 535 nm, blue 465 nm). Lower the **light level** and the rods take over: they are blind to colour and most sensitive near 505 nm, so red goes dark, blue stays bright and the colours fade — the *Purkinje shift*. **Right:** the time it takes to adapt after the light goes out: cones first, then, after about 7 minutes, the rods, which keep improving for half an hour. The curve is a schematic of the usual shape, not a measurement; the graph at the side shows the two sensitivity curves V(λ) (by day) and V′(λ) (by night).

**Try this**
- Slide the light level from 100 to 0.001 cd/m²: the red patch sinks into black well before the blue one.
- Set the light low and move **time in the dark** from 0 to 40 minutes: the sensitivity gained is tens of thousands of times; the first bend of the curve is the hand-over from cones to rods.
- The luminance ranges are typical: photopic above about 3 cd/m², scotopic below about 0.001, mesopic between.`,
    mount(box_, kit, params) {
      const O = kit.optics, Ph = O.photo, E = O.eye;
      const st = kit.stage(box_.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box_.side, [
        { id: 'L', label: 'Light level (luminance of the scene)', min: 0.00001, max: 1000, value: params.L || 100, log: true, sig: 2, fmt: v => kit.fmt(v, 2) + ' cd/m²' },
        { id: 'preset', type: 'select', label: 'Or choose a setting', options: [['—', 0], ['White paper in an office (about 120)', 120], ['A street at dusk (about 3)', 3], ['Moonlit white paper (about 0.05)', 0.05], ['A clear night sky (0.001)', 0.001], ['Starlight on a surface (about 0.00005)', 0.00005]], value: 0 },
        { id: 'min', label: 'Time in the dark', min: 0, max: 40, step: 0.5, value: params.min || 0, unit: 'min' }
      ], (id, v) => { if (id === 'preset' && v) { ctl.set('L', v); ctl.set('preset', 0); } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['reg', 'The eye works in'], ['pup', 'Pupil (typical)'], ['bri', 'Apparent brightness R : G : B'], ['gain', 'Sensitivity gained in the dark'], ['who', 'Seeing with']]);
      const plot = kit.plot(box_.side, { x: { label: 'wavelength (nm)', min: 400, max: 700 }, y: { label: 'V', min: 0, max: 1.05 }, series: [] }, 170);
      const LAM = [[630, [226, 62, 48], 'red 630 nm'], [535, [66, 190, 92], 'green 535 nm'], [465, [64, 96, 236], 'blue 465 nm']];
      const ratio = LAM.map(l => Ph.Vscotopic(l[0]) / Ph.V(l[0])), rmax = Math.max(...ratio);
      const VP = [], VS = [];
      for (let n = 400; n <= 700; n += 5) { VP.push([n, Ph.V(n)]); VS.push([n, Ph.Vscotopic(n)]); }
      // the schematic dark-adaptation curve (log10 of the threshold, 0 = fully adapted): a cone branch and a rod branch
      const cone = t => 2.5 + 2.0 * Math.exp(-t / 1.5), rod = t => 5.5 * Math.exp(-t / 9), thr = t => Math.min(cone(t), rod(t));
      let tb = 0; while (tb < 40 && rod(tb) > cone(tb)) tb += 0.01;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, L = V.L;
        const m = clamp((Math.log10(3) - Math.log10(L)) / (Math.log10(3) - Math.log10(0.001)), 0, 1);             // 0 photopic … 1 scotopic
        const reg = m <= 0 ? 'photopic (cones)' : m >= 1 ? 'scotopic (rods)' : 'mesopic (both)';
        // left: the three patches
        const pw = Math.min(W * 0.4, 300), px = 16, ph = Hh * 0.62, py = 34, cw = (pw - 20) / 3;
        c.save(); c.fillStyle = C.surface; c.fillRect(px, py - 6, pw, ph + 12); c.strokeStyle = C.axis; c.strokeRect(px + 0.5, py - 5.5, pw - 1, ph + 11); c.restore();
        const bri = ratio.map(r => (1 - m) + m * r / rmax);
        LAM.forEach(([nm, rgb, name], i) => {
          const b = bri[i], lum = Math.pow(b, 0.4), gray = 120, sat = 1 - 0.92 * m;
          const col = rgb.map(q => clamp(Math.round((gray + (q - gray) * sat) * lum), 0, 255));
          c.fillStyle = 'rgb(' + col[0] + ',' + col[1] + ',' + col[2] + ')'; c.fillRect(px + 10 + i * cw, py, cw - 6, ph);
          kit.label(c, name, px + 10 + i * cw + (cw - 6) / 2, py + ph + 18, { align: 'center', size: 10.5, color: C.muted });
        });
        kit.label(c, 'three patches of equal brightness by day', px, py - 18, { size: 11, color: C.muted });
        kit.label(c, reg + (m > 0 && m < 1 ? ' — ' + fix(100 * m, 0) + ' % of the way to rods' : ''), px, py + ph + 40, { size: 11.5, color: C.text, weight: 650 });
        // right: the dark-adaptation curve
        const ax0 = px + pw + 52, ax1 = W - 16, ay0 = 34, ay1 = Hh - 60, X = t => ax0 + t / 40 * (ax1 - ax0), Y = q => ay1 - q / 5 * (ay1 - ay0);
        c.save(); c.fillStyle = C.surface; c.fillRect(ax0, ay0, ax1 - ax0, ay1 - ay0); c.strokeStyle = C.axis; c.strokeRect(ax0 + 0.5, ay0 + 0.5, ax1 - ax0 - 1, ay1 - ay0 - 1); c.restore();
        for (let q = 0; q <= 5; q++) { c.save(); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(ax0, Y(q)); c.lineTo(ax1, Y(q)); c.stroke(); c.restore(); kit.label(c, String(q), ax0 - 6, Y(q), { align: 'right', size: 10.5, color: C.muted }); }
        for (let t = 0; t <= 40; t += 10) kit.label(c, String(t), X(t), ay1 + 14, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'minutes in the dark', ax1, ay1 + 34, { align: 'right', size: 11, color: C.muted });
        kit.label(c, 'log threshold', ax0, ay0 - 12, { size: 11, color: C.muted });
        const pts = (f, t0, t1) => { const o = []; for (let t = t0; t <= t1 + 1e-9; t += 0.25) o.push([X(t), Y(f(t))]); return o; };
        c.save(); c.beginPath(); c.rect(ax0, ay0, ax1 - ax0, ay1 - ay0); c.clip();
        stroke(c, pts(cone, 0, 40), C.warn, 1.6, [5, 4]); stroke(c, pts(rod, 0, 40), C.series[0], 1.6, [5, 4]); stroke(c, pts(thr, 0, 40), C.text, 2.8);
        c.restore();
        kit.label(c, 'cones', X(1.5), Y(cone(1.5)) - 14, { size: 10.5, color: C.warn }); kit.label(c, 'rods', X(18), Y(rod(18)) - 12, { size: 10.5, color: C.series[0] });
        const tn = V.min;
        c.save(); c.strokeStyle = C.accent; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(tn), ay0); c.lineTo(X(tn), ay1); c.stroke(); c.restore();
        kit.dot(c, X(tn), Y(thr(tn)), 5.5, C.accent, C.surface);
        kit.label(c, 'rod–cone break, about ' + fix(tb, 0) + ' min', X(tb) + 8, Y(thr(tb)) + 18, { size: 10.5, color: C.faint });
        // numbers
        ro.set('reg', reg + (' (' + kit.fmt(L, 2) + ' cd/m²)'));
        ro.set('pup', fix(clamp(E.pupil(L), 2, 8), 1) + ' mm');
        ro.set('bri', bri.map(b => fix(b / Math.max(...bri), 2)).join(' : ') + (m > 0 ? '  (equal by day)' : ''));
        const g = Math.pow(10, thr(0) - thr(tn));
        ro.set('gain', tn < 0.05 ? 'none yet' : 'about ' + (g >= 1000 ? Math.round(g / 100) * 100 : fix(g, 0)) + ' times, in this schematic curve');
        ro.set('who', tn < tb ? 'cones, still adapting' : 'rods, now more sensitive than the cones');
        plot.set({ series: [{ pts: VP, label: 'by day V(λ)', color: C.warn, width: 2.6 }, { pts: VS, label: 'by night V′(λ)', color: C.series[0], width: 2.6 }], vlines: LAM.map(l => ({ x: l[0], label: l[0] === 630 ? 'R' : l[0] === 535 ? 'G' : 'B', color: C.faint })) });
      }, box_.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ flicker and persistence of vision */
  Hyper.sim('ey-flicker', {
    title: 'Flicker, persistence of vision and apparent motion',
    blurb: `A light that flashes at a steady rate. **Top:** the light itself (on or off); below it, what the retina keeps of it — the eye acts as a smoothing filter, so the faster the flashes, the smaller the ripple that survives. When the ripple falls below what the eye can notice, the flashing fuses into steady light: the **critical flicker frequency**, which here follows a rough rule of thumb (about 10 Hz more for every factor of ten in brightness; more in the periphery for a large bright light). **Bottom:** a ball whose position is updated only at that rate: below about 15 steps a second it jumps, above about 25 the jumps fuse into motion — the basis of film and video. (Your own screen redraws at its own rate, so the flicker itself is shown as a graph, not as a flashing light.)

**Try this**
- At **24 Hz** and 100 cd/m² the smoothed trace still ripples a lot: film shown at 24 flashes a second would flicker at that brightness, which is why a projector flashes each frame twice or three times (48 or 72 Hz). Press the buttons.
- Lower the **brightness**: the limit falls and 24 Hz becomes tolerable in a dim room; raise it and even 60 Hz may shimmer in the periphery.
- Choose *the periphery*: the limit goes up, which is why a 60 Hz screen may seem to flicker out of the corner of the eye but not when looked at.
- Watch the ball at 6, 12 and 24 steps a second.`,
    mount(box_, kit, params) {
      const st = kit.stage(box_.stage, { aspect: 0.56, minH: 330 });
      const ctl = kit.controls(box_.side, [
        { id: 'f', label: 'Flash rate (and steps per second of the ball)', min: 2, max: 200, value: params.f || 24, log: true, sig: 3, unit: 'Hz' },
        { id: 'L', label: 'Brightness of the light', min: 0.1, max: 10000, value: params.L || 100, log: true, sig: 2, fmt: v => kit.fmt(v, 2) + ' cd/m²' },
        { id: 'where', type: 'select', label: 'Seen with', options: [['the centre of the retina', 'fovea'], ['the periphery (a large light, about 30° out)', 'peri']], value: params.where || 'fovea' },
        { id: 'duty', label: 'Share of each period that the light is on', min: 10, max: 90, step: 5, value: 50, unit: '%' },
        { type: 'buttons', items: [{ id: 'f24', label: '24 (film)' }, { id: 'f48', label: '48 (film, 2 blades)' }, { id: 'f60', label: '60 (a screen)' }, { id: 'f100', label: '100 (a lamp on 50 Hz mains)' }] }
      ], id => { if (/^f\d+$/.test(id)) ctl.set('f', +id.slice(1)); });
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['f', 'Flash rate and period'], ['cff', 'Typical fusion limit here'], ['rip', 'Ripple left after the eye\'s smoothing'], ['say', 'It looks'], ['mot', 'The ball moves']]);
      const cffOf = (L, w) => clamp(45 + 10 * Math.log10(L / 100), 8, 90) + (w === 'peri' ? 12 * clamp((Math.log10(L) + 0.5) / 2.5, 0, 1) : 0);
      let memoKey = '', memo = null;
      function waves(f, cff, duty) {
        const key = [f, cff.toFixed(2), duty].join();
        if (key === memoKey) return memo;
        const tau = 1.58 / cff, h = 0.0001, n = 1000, warm = Math.round(0.3 / h), inp = t => ((t * f) % 1 < duty / 100 ? 1 : 0);
        let y = duty / 100; const raw = [], flt = []; let lo = 1, hi = 0;
        for (let i = -warm; i < n; i++) {
          const t = i * h; y += h * (inp(t) - y) / tau;
          if (i >= 0) { raw.push(inp(t)); flt.push(y); }
          if (i >= n - Math.min(n, Math.round(2 / f / h))) { lo = Math.min(lo, y); hi = Math.max(hi, y); }
        }
        memoKey = key; memo = { raw, flt, ripple: Math.max(0, hi - lo) };
        return memo;
      }
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, f = V.f, cff = cffOf(V.L, V.where), w = waves(f, cff, V.duty);
        const x0 = 56, x1 = W - 16, rowH = Math.min(90, Hh * 0.19), y1 = 44, y2 = y1 + rowH + 56;
        const draw = (arr, y, col, title, wd) => {
          c.save(); c.fillStyle = C.surface; c.fillRect(x0, y - 4, x1 - x0, rowH + 8); c.strokeStyle = C.axis; c.strokeRect(x0 + 0.5, y - 3.5, x1 - x0 - 1, rowH + 7); c.restore();
          const pts = arr.map((v, i) => [x0 + i / (arr.length - 1) * (x1 - x0), y + rowH - v * rowH]);
          stroke(c, pts, col, wd || 2);
          kit.label(c, title, x0, y - 14, { size: 11, color: C.muted });
          kit.label(c, 'on', x0 - 6, y, { align: 'right', size: 10, color: C.faint }); kit.label(c, 'off', x0 - 6, y + rowH, { align: 'right', size: 10, color: C.faint });
        };
        draw(w.raw, y1, C.warn, 'the light: ' + fix(f, f < 10 ? 1 : 0) + ' flashes a second (the 100 ms shown)', 2.2);
        draw(w.flt, y2, C.accent, 'what the retina keeps of it (a smoothing with a time constant of ' + fix(1.58 / cff * 1000, 0) + ' ms)', 2.6);
        c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(x0, y2 + rowH - V.duty / 100 * rowH); c.lineTo(x1, y2 + rowH - V.duty / 100 * rowH); c.stroke(); c.restore();
        // the ball, stepping at the flash rate
        const yb = y2 + rowH + 80, frame = Math.floor(t * f + 1e-9), vel = 0.35, pos = k => (((frame - k) / f) * vel) % 1, bx = p => x0 + 14 + p * (x1 - x0 - 28);
        c.save(); c.fillStyle = C.surface; c.fillRect(x0, yb - 20, x1 - x0, 40); c.strokeStyle = C.axis; c.strokeRect(x0 + 0.5, yb - 19.5, x1 - x0 - 1, 39); c.restore();
        for (let k = 4; k >= 1; k--) { const p = pos(k); if (p <= pos(0) || k === 0) kit.dot(c, bx(p), yb, 6, C.dark ? 'rgba(123,140,255,' + (0.12 * (5 - k)) + ')' : 'rgba(80,100,220,' + (0.1 * (5 - k)) + ')'); }
        kit.dot(c, bx(pos(0)), yb, 8, C.accent);
        kit.label(c, 'a ball whose position is updated ' + fix(f, f < 10 ? 1 : 0) + ' times a second (fainter: the earlier positions)', x0, yb - 30, { size: 11, color: C.muted });
        // numbers
        ro.set('f', fix(f, f < 10 ? 1 : 0) + ' Hz, a period of ' + fix(1000 / f, 1) + ' ms');
        ro.set('cff', fix(cff, 0) + ' Hz (' + (V.where === 'peri' ? 'periphery' : 'centre') + ', ' + kit.fmt(V.L, 2) + ' cd/m²)');
        ro.set('rip', fix(100 * w.ripple, 0) + ' % of the full swing');
        ro.set('say', f < cff * 0.85 ? 'flickering: the rate is well below the fusion limit' : f < cff * 1.1 ? 'just at the edge: it shimmers' : 'steady: the flashes have fused');
        ro.set('mot', f < 8 ? 'in jerks: separate pictures' : f < 20 ? 'in steps that are still seen' : f < 40 ? 'smoothly, to most eyes (film uses 24)' : 'smoothly');
      }, box_.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ the eye's own aberrations */
  Hyper.sim('ey-aberrations', {
    title: 'The eye\'s own aberrations: colour and sphere',
    blurb: `The last 3.6 mm of the traced schematic eye before the retina, drawn with the height stretched so that the focus can be seen. **Colour:** blue light (450 nm) is bent more than green (550) and red (650), so it comes to a focus in front of the retina and red behind it: about 2 D of longitudinal chromatic aberration across the visible spectrum, with no lens in the eye to correct it. **Sphere:** rays through the edge of the pupil focus closer than rays through its centre; the larger the pupil, the larger the blur. The box on the right is the spot diagram on the retina; the dashed circle is the Airy disc (what a perfect eye of that pupil would give).

**Try this**
- In *Colour*, open the pupil from 2 to 8 mm: the focus positions do not move (colour is independent of pupil), but the coloured blur on the retina grows.
- Note the green and the red spots: the eye is focused for yellow-green, in the middle of the spectrum, and the human visual system gives the blue far less weight, which hides most of the effect.
- In *Sphere*, set the pupil to 3 mm and then 7 mm: the **extra power at the edge** of the pupil grows from a fraction of a dioptre to several, and the blur goes up several times.
- This is a model eye; real eyes also have irregular higher-order aberrations, different for every person.`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym, M = eyeModel(O), SYS = M.SYS;
      const st = kit.stage(box_.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box_.side, [
        { id: 'show', type: 'select', label: 'Show', options: [['Colour (chromatic aberration)', 'chroma'], ['Sphere (spherical aberration)', 'sphere']], value: params.show || 'chroma' },
        { id: 'pupil', label: 'Pupil diameter', min: 2, max: 8, step: 0.5, value: params.pupil || 5, unit: 'mm' }
      ], () => { syncRows(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['p450', 'Power of the eye at 450 nm'], ['p550', 'Power at 550 nm'], ['p650', 'Power at 650 nm'], ['spread', 'Spread from 400 to 700 nm'], ['apart', 'Blue and red foci are'], ['edge', 'Extra power at the pupil edge'], ['spot', 'Spot on the retina'], ['best', 'Spot at the plane of least blur'], ['airy', 'Airy disc (a perfect eye)'], ['shift', 'Least blur lies']]);
      const syncRows = () => { for (const k of ['p450', 'p550', 'p650', 'spread', 'apart']) ro.show(k, V.show === 'chroma'); for (const k of ['edge', 'spot', 'best', 'airy', 'shift']) ro.show(k, V.show !== 'chroma'); };
      const plot = kit.plot(box_.side, { x: { label: 'wavelength (nm)', min: 400, max: 700 }, y: { label: 'D', min: -1.2, max: 2.2 }, series: [] }, 180);
      const WL = [[450, 'blue 450 nm'], [550, 'green 550 nm'], [650, 'red 650 nm']], ref = SYS.paraxial({ surfaces: M.surfaces(1, 0, 4) }), efl = ref.efl, nI = ref.nImage;
      const D2 = dz => nI * dz * 1e-3 / Math.pow(efl * nI * 1e-3, 2);                     // a shift of the focus (mm) as a change of vergence (D)
      // the part of a polyline [[z, y] …] (z rising) between z = za and z = zb
      const clipRange = (pts, za, zb) => {
        const o = [], inside = z => z >= za - 1e-9 && z <= zb + 1e-9, at = (a, b, zc) => [zc, a[1] + (zc - a[0]) / (b[0] - a[0]) * (b[1] - a[1])];
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i], b = pts[i + 1];
          if (inside(a[0])) o.push(a);
          if (b && b[0] > a[0]) { if (a[0] < za && b[0] > za) o.push(at(a, b, za)); if (a[0] < zb && b[0] > zb) o.push(at(a, b, zb)); }
        }
        return o;
      };
      let memoKey = '', memo = null;
      function compute() {
        const key = V.show + '|' + V.pupil;
        if (key === memoKey) return memo;
        const sys = { surfaces: M.surfaces(1, 0, V.pupil) }, out = { sys };
        if (V.show === 'chroma') {
          out.fans = WL.map(([nm]) => ({ nm, fan: SYS.fan2d(sys, { nm, n: 7, zStart: -3, zEnd: M.RET + 1.3 }), spot: SYS.spot(sys, { nm, rings: 5, z: M.RET }), foc: SYS.paraxial(sys, nm).zImage }));
        } else {
          const bf = SYS.bestFocus(sys, { nm: 550, rings: 4 }), par = SYS.paraxial(sys, 550);
          out.fan = SYS.fan2d(sys, { nm: 550, n: 9, zStart: -3, zEnd: M.RET + 1.3 }); out.bf = bf; out.par = par;
          out.spot = SYS.spot(sys, { nm: 550, rings: 5, z: M.RET }); out.spotBest = SYS.spot(sys, { nm: 550, rings: 5, z: bf.z });
          out.lsa = SYS.lsa(sys, 550, 12);
        }
        memoKey = key; memo = out; return out;
      }
      // the plot for the colour mode does not depend on the pupil
      const CH = []; for (let nm = 400; nm <= 700; nm += 20) CH.push([nm, 1000 / SYS.paraxial({ surfaces: M.surfaces(1, 0, 4) }, nm).efl - 1000 / SYS.paraxial({ surfaces: M.surfaces(1, 0, 4) }, 587.56).efl]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, d = compute(), R = M.RET;
        const px = 14, pw = W * 0.6, py = 30, ph = Hh - 56, z0 = R - 2.4, z1 = R + 1.2, sx = pw / (z1 - z0), ys = ph / 2 / 0.45, X = z => px + (z - z0) * sx, Y = y => py + ph / 2 - y * ys;
        c.save(); c.fillStyle = C.surface; c.fillRect(px, py, pw, ph); c.strokeStyle = C.axis; c.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1); c.beginPath(); c.rect(px, py, pw, ph); c.clip();
        c.strokeStyle = C.axis; c.setLineDash([10, 3, 2, 3]); c.beginPath(); c.moveTo(px, Y(0)); c.lineTo(px + pw, Y(0)); c.stroke(); c.setLineDash([]);
        // the retina
        c.fillStyle = C.bad; c.fillRect(X(R), py, 4, ph);
        const fans = V.show === 'chroma' ? d.fans.map(q => [q.fan, S.nm(q.nm), q.nm]) : [[d.fan, S.nm(550), 550]];
        for (const [fan, col] of fans) for (const r of fan) {
          const solid = clipRange(r.pts, z0, R), faint = clipRange(r.pts, R, z1 + 2);
          stroke(c, solid.map(p => [X(p[0]), Y(p[1])]), col, 1.3);
          if (faint.length > 1) stroke(c, faint.map(p => [X(p[0]), Y(p[1])]), col, 1, [3, 3]);
        }
        if (V.show === 'sphere') {
          const zb = d.bf.z, zp = d.par.zImage;
          for (const [z, lab, col, dy] of [[zp, 'paraxial focus', C.ok, 14], [zb, 'least blur', C.warn, 30]]) { c.save(); c.strokeStyle = col; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(z), py); c.lineTo(X(z), py + ph); c.stroke(); c.restore(); kit.label(c, lab, X(z) + (z < zp ? -4 : 4), py + dy, { align: z < zp ? 'right' : 'left', size: 10.5, color: col }); }
        } else {
          d.fans.forEach((q, i) => { c.save(); c.strokeStyle = S.nm(q.nm); c.lineWidth = 2; c.beginPath(); c.moveTo(X(q.foc), Y(0) - 12); c.lineTo(X(q.foc), Y(0) + 12); c.stroke(); c.restore(); });
        }
        c.restore();
        kit.label(c, 'retina', X(R) - 6, py + ph - 10, { align: 'right', size: 10.5, color: C.bad });
        kit.label(c, 'light from a distant point, from the left · height stretched ×' + fix(ys / sx, 0) + ' · last ' + fix(R - z0, 1) + ' mm of the eye', px, py - 10, { size: 10.5, color: C.muted });
        // the spot diagram on the retina
        const bx = px + pw + 22, bw = W - bx - 14, half = Math.min(bw, ph) / 2 - 6, cx = bx + bw / 2, cy = py + ph / 2;
        const spots = V.show === 'chroma' ? d.fans.map(q => [q.spot, S.nm(q.nm)]) : [[d.spot, S.nm(550)]];
        let geoMax = 0.004; for (const [sp] of spots) geoMax = Math.max(geoMax, sp.geo);
        const scale = half / (geoMax * 1.25), airy = 1.22 * 550e-6 * efl / V.pupil;
        c.save(); c.fillStyle = C.surface; c.fillRect(cx - half - 4, cy - half - 4, 2 * half + 8, 2 * half + 8); c.restore();
        c.save(); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(cx - half, cy); c.lineTo(cx + half, cy); c.moveTo(cx, cy - half); c.lineTo(cx, cy + half); c.stroke();
        c.strokeStyle = C.muted; c.setLineDash([4, 3]); c.beginPath(); c.arc(cx, cy, Math.max(1, airy * scale), 0, TAU); c.stroke(); c.restore();
        for (const [sp, col] of spots) { c.save(); c.fillStyle = col; for (const p of sp.pts) { const x = cx + (p[0] - sp.cx) * scale, y = cy - (p[1] - sp.cy) * scale; if (Math.abs(x - cx) <= half && Math.abs(y - cy) <= half) c.fillRect(x - 1, y - 1, 2.4, 2.4); } c.restore(); }
        c.save(); c.strokeStyle = C.text; c.lineWidth = 2; const u = niceBar(geoMax * 1.25 * 0.5), L = u * scale; c.beginPath(); c.moveTo(cx - half, cy + half - 6); c.lineTo(cx - half + L, cy + half - 6); c.stroke(); c.restore();
        kit.label(c, fix(u * 1000, 0) + ' µm', cx - half + L + 6, cy + half - 6, { size: 10.5, color: C.text });
        kit.label(c, 'the spot on the retina', cx, py - 10, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'dashed: Airy disc', cx, cy + half + 14, { align: 'center', size: 10.5, color: C.faint });
        // numbers and the graph
        if (V.show === 'chroma') {
          const P = d.fans.map(q => 1000 / SYS.paraxial(d.sys, q.nm).efl), ar = 1000 / SYS.paraxial(d.sys, 400).efl - 1000 / SYS.paraxial(d.sys, 700).efl;
          ro.set('p450', fix(P[0], 2) + ' D'); ro.set('p550', fix(P[1], 2) + ' D'); ro.set('p650', fix(P[2], 2) + ' D');
          ro.set('spread', fix(ar, 1) + ' D (measured eyes: about 2 D)'); ro.set('apart', fix(d.fans[2].foc - d.fans[0].foc, 2) + ' mm apart, along the axis');
          const base = 1000 / SYS.paraxial(d.sys, 587.56).efl;
          plot.set({ x: { label: 'wavelength (nm)', min: 400, max: 700 }, y: { label: 'D', min: -1.2, max: 2.2 }, series: [{ pts: CH, label: 'extra power of the eye', color: C.accent, width: 2.8 }], marks: WL.map((q, i) => ({ x: q[0], y: P[i] - base, color: S.nm(q[0]) })), hlines: [{ y: 0, label: 'focused for 587 nm' }], vlines: [] });
        } else {
          const lsaD = d.lsa.map(q => [q[0] * V.pupil / 2, -D2(q[1])]), edge = lsaD.length ? lsaD[lsaD.length - 1][1] : 0;
          ro.set('edge', fix(edge, 2) + ' D'); ro.set('spot', fix(2 * d.spot.geo * 1000, 0) + ' µm across'); ro.set('best', fix(2 * d.spotBest.geo * 1000, 0) + ' µm across');
          ro.set('airy', fix(2 * airy * 1000, 1) + ' µm across'); ro.set('shift', fix(Math.abs(d.bf.shift), 2) + ' mm in front of the paraxial focus');
          plot.set({ x: { label: 'pupil radius (mm)', min: 0, max: 4 }, y: { label: 'D', min: 0, max: Math.max(1, Math.ceil(edge * 1.1)) }, series: [{ pts: lsaD, label: 'extra power at this height in the pupil', color: C.accent, width: 2.8 }], marks: lsaD.length ? [{ x: lsaD[lsaD.length - 1][0], y: edge }] : [], hlines: [], vlines: [] });
        }
      }, box_.stage);
      function niceBar(v) { const e = Math.pow(10, Math.floor(Math.log10(v))); const m = v / e; return (m < 2 ? 1 : m < 5 ? 2 : 5) * e; }
      st.onResize(() => loop.once());
      syncRows(); loop.once();
    }
  });
})();
