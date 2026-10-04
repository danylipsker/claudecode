/* HYPER-OPTICS · sims/aberrations.js — simulations of the topic "Aberrations".
 *   ab-overview      a real lens traced ray by ray: layout, spot diagram against the Airy disc, third-order errors
 *   ab-spherical     where the zones of a singlet focus: a magnified view of the focus, the screen, the spot
 *   ab-coma          the comet: rings of the pupil make circles of growing size; lens or paraboloid, field, aperture
 *   ab-astig-field   astigmatism (through-focus spots at the two focal lines) and field curvature (T, S, Petzval curves)
 *   ab-distortion    a square grid through a lens: barrel and pincushion, the stop position, a fisheye
 *   ab-axial-colour  three colours through a singlet or an achromat: the foci along the axis, the halo at the screen
 *   ab-lateral-colour the chief rays of three colours, and an edge in the image with its coloured fringes
 *   ab-seidel        the Seidel sums, surface by surface, as a bar chart
 *   ab-zernike       Zernike terms as wavefront maps, with the point-spread function they make
 *   ab-spot-fan      a spot diagram and the two ray fans of one lens and field point, with presets for each aberration
 *   ab-strehl        the point-spread function and the Strehl ratio against the RMS wavefront error
 * Every number is traced through real surfaces by the engine (kit.optics); the pictures are drawn with kit.osym. The
 * Zernike and point-spread-function helpers at the foot of the file are local (a small FFT, no library).
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const NICE = [0.001, 0.002, 0.003, 0.005, 0.007, 0.01, 0.015, 0.02, 0.03, 0.05, 0.07, 0.1, 0.15, 0.2, 0.3, 0.5, 0.7, 1, 1.5, 2, 3, 5, 7, 10, 20, 50];     // box half-sizes in mm
  const niceUp = v => NICE.find(x => x >= v) || NICE[NICE.length - 1];
  const um = (mm, d) => { const u = Math.abs(mm) * 1000; return (mm * 1000).toFixed(d == null ? (u < 10 ? 2 : u < 100 ? 1 : 0) : d) + ' µm'; };
  const mmTxt = v => (Math.abs(v) < 0.1 ? v.toFixed(3) : v.toFixed(2)) + ' mm';

  /* ================================================================ shared tools (built per simulation from its kit) */
  function tools(kit) {
    const O = kit.optics, Sy = O.sys, S = kit.osym;
    const T = { O, Sy, S };
    const slots = {};
    /* a one-entry cache per name: the heavy part of a frame is recomputed only when its inputs change */
    T.memo = (name, key, fn) => { const s = slots[name] || (slots[name] = {}); if (s.key !== key) { s.val = fn(); s.key = key; } return s.val; };

    T.LENSES = {
      'biconvex': { label: 'Biconvex singlet, f = 100 mm', fmax: 15, single: true, nmin: 2.8 },
      'plano-convex': { label: 'Plano-convex singlet, curved side first', fmax: 15, single: true, nmin: 2.8 },
      'convex-plano-reversed': { label: 'Plano-convex singlet, flat side first', fmax: 15, single: true, nmin: 2.8 },
      'best-form': { label: 'Best-form singlet, f = 100 mm', fmax: 15, single: true, nmin: 2.8 },
      'achromat': { label: 'Cemented achromat, f = 100 mm', fmax: 10, single: true, nmin: 4 },
      'cooke-triplet': { label: 'Cooke triplet, f = 50 mm, f/5', fmax: 20 },
      'double-gauss': { label: 'Double Gauss, f = 100 mm, f/3', fmax: 14 },
      'parabolic-mirror': { label: 'Paraboloid mirror, f = 1000 mm, f/5', fmax: 0.5 }
    };
    /* the smallest f-number a lens allows: its own, for the designs with a built-in stop */
    T.nmin = id => { const L = T.LENSES[id]; if (L.nmin) return L.nmin; const b = O.lens(id), p = Sy.paraxial(b); return (L.nmin = Math.abs(p.efl) / p.epd); };
    /* a library lens as a system: a singlet gets its stop as a separate aperture `gap` mm in front (negative: behind);
       a design with its own stop is stopped down from its native f-number to N */
    T.build = (id, N, gap) => {
      const L = T.LENSES[id], base = O.lens(id);
      N = Math.max(N, T.nmin(id));
      if (L.single) {
        const f = Math.abs(Sy.paraxial(base).efl), g = gap == null ? 4 : gap;
        base.surfaces.forEach(s => { s.stop = false; if (id !== 'achromat') s.sd = 0.2 * f; });
        if (g >= 0) return { name: base.name, surfaces: [{ R: 0, t: g, n: 1, sd: f / (2 * N), stop: true }].concat(base.surfaces), field: L.fmax * D2R };
        base.surfaces[base.surfaces.length - 1].t = -g;
        return { name: base.name, surfaces: base.surfaces.concat([{ R: 0, n: 1, sd: f / (2 * N), stop: true }]), field: L.fmax * D2R };
      }
      const k = T.nmin(id) / N, si = Sy.stopIndex(base);
      base.surfaces[si].sd *= k; if (base.epd != null) base.epd *= k;
      base.field = L.fmax * D2R;
      return base;
    };
    T.height = sys => Math.max.apply(null, sys.surfaces.map(s => s.sd || 0));

    /* rays through a grid of pupil points (a centre ray and rings of 6, 12, 18 …), traced once; reused at any plane */
    T.pupil = (sys, nm, field, rings) => {
      const par = Sy.paraxial(sys, nm), list = [];
      const shoot = (px, py, ring) => { const tr = Sy.trace(sys, Sy.aim(sys, px, py, field, par, nm), nm); if (tr.ok) list.push({ ring, px, py, tr }); };
      shoot(0, 0, 0);
      for (let r = 1; r <= rings; r++) { const m = 6 * r; for (let j = 0; j < m; j++) { const a = TAU * j / m; shoot(r / rings * Math.cos(a), r / rings * Math.sin(a), r); } }
      return { par, list, rings, nm, field };
    };
    T.chief = (pr, z) => { const c = pr.list.find(r => r.ring === 0); if (!c) return null; const p = Sy.at(c.tr, z); return [p[0], p[1]]; };
    T.stats = pts => {
      const n = pts.length || 1; let cx = 0, cy = 0;
      pts.forEach(p => { cx += p.x; cy += p.y; }); cx /= n; cy /= n;
      let s2 = 0, geo = 0; pts.forEach(p => { const d = Math.hypot(p.x - cx, p.y - cy); s2 += d * d; geo = Math.max(geo, d); });
      return { cx, cy, rms: Math.sqrt(s2 / n), geo, n: pts.length };
    };
    /* where the rays land on the plane z, relative to ref (default: the chief ray) */
    T.land = (pr, z, ref) => {
      const r0 = ref || T.chief(pr, z) || [0, 0];
      const pts = pr.list.map(r => { const p = Sy.at(r.tr, z); return { x: p[0] - r0[0], y: p[1] - r0[1], ring: r.ring }; });
      return Object.assign({ pts, ref: r0 }, T.stats(pts));
    };
    /* the plane of smallest RMS spot, found by golden-section search between a little behind and well in front of the paraxial image */
    T.bestZ = (pr, span) => {
      const z0 = pr.par.zImage, sp = span || 0.06 * Math.abs(pr.par.efl), g = (Math.sqrt(5) - 1) / 2, f = z => T.land(pr, z).rms;
      let a = z0 - sp, b = z0 + sp * 0.3, x1 = b - g * (b - a), x2 = a + g * (b - a), f1 = f(x1), f2 = f(x2);
      for (let i = 0; i < 26; i++) { if (f1 < f2) { b = x2; x2 = x1; f2 = f1; x1 = b - g * (b - a); f1 = f(x1); } else { a = x1; x1 = x2; f1 = f2; x2 = a + g * (b - a); f2 = f(x2); } }
      return (a + b) / 2;
    };
    /* the local tangential and sagittal foci of a narrow bundle about the chief ray, measured from the paraxial image plane */
    T.foci = (sys, nm, field, d) => {
      d = d || 0.15;
      const par = Sy.paraxial(sys, nm);
      const t1 = Sy.trace(sys, Sy.aim(sys, 0, d, field, par, nm), nm), t2 = Sy.trace(sys, Sy.aim(sys, 0, -d, field, par, nm), nm), t3 = Sy.trace(sys, Sy.aim(sys, d, 0, field, par, nm), nm);
      if (!t1.ok || !t2.ok || !t3.ok) return { zT: 0, zS: 0, ok: false };
      const m1 = t1.d[1] / t1.d[2], m2 = t2.d[1] / t2.d[2];
      const zT = Math.abs(m1 - m2) < 1e-12 ? par.zImage : (t2.p[1] - t1.p[1] + t1.p[2] * m1 - t2.p[2] * m2) / (m1 - m2);
      const zS = Math.abs(t3.d[0]) < 1e-12 ? par.zImage : t3.p[2] - t3.p[0] * t3.d[2] / t3.d[0];
      return { zT: zT - par.zImage, zS: zS - par.zImage, ok: Number.isFinite(zT) && Number.isFinite(zS) };
    };
    /* the colour of a pupil zone: blue in the middle, red at the edge */
    T.zone = (ring, rings, a) => kit.hue(215 - 200 * (rings ? ring / rings : 0), a == null ? 0.95 : a);
    /* a spot diagram in a square box centred at (cx, cy): points (mm, relative to the reference) at scale px per mm */
    T.spot = (c, L, cx, cy, half, scale, o) => {
      o = o || {};
      const C = kit.colors();
      c.save();
      if (!o.bare) {
        c.fillStyle = C.surface; c.fillRect(cx - half, cy - half, 2 * half, 2 * half);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(cx - half, cy - half, 2 * half, 2 * half);
        c.beginPath(); c.moveTo(cx - half, cy); c.lineTo(cx + half, cy); c.moveTo(cx, cy - half); c.lineTo(cx, cy + half); c.stroke();
      }
      const ox = cx + (o.dx || 0), oy = cy + (o.dy || 0);          // where the reference (chief) point is drawn
      if (o.airy) { c.strokeStyle = C.muted; c.lineWidth = 1.2; c.setLineDash([4, 3]); c.beginPath(); c.arc(ox, oy, Math.max(0.5, o.airy * scale), 0, TAU); c.stroke(); c.setLineDash([]); }
      c.beginPath(); c.rect(cx - half, cy - half, 2 * half, 2 * half); c.clip();
      if (o.blend && C.dark) c.globalCompositeOperation = 'lighter';
      for (const p of L.pts) { c.fillStyle = o.color ? o.color(p) : C.accent; c.fillRect(ox + p.x * scale - 1.3, oy - p.y * scale - 1.3, 2.6, 2.6); }
      c.restore();
    };
    /* fan2d rays under a map, each in its own colour */
    T.fan = (c, fan, m, colorFn, w, alpha) => { fan.forEach((r, i) => { S.ray(c, r.pts.map(p => [m.X(p[0]), m.Y(p[1])]), { color: colorFn(r, i), width: w || 1.2, alpha: alpha == null ? 1 : alpha, arrows: false }); }); };
    /* an anisotropic window onto the image space: z (mm) across, y (mm) up, with very different scales */
    T.zoom = (rect, zA, zB, yHalf) => ({ rect, zA, zB, yHalf, X: z => rect.x + (z - zA) / (zB - zA) * rect.w, Y: y => rect.y + rect.h / 2 - y / yHalf * (rect.h / 2), Z: x => zA + (x - rect.x) / rect.w * (zB - zA) });
    T.rayY = tr => z => tr.p[1] + (z - tr.p[2]) * tr.d[1] / tr.d[2];
    T.inRect = (p, r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
    T.cap = (c, text, x, y, o) => kit.label(c, text, x, y, Object.assign({ size: 11.5, color: kit.colors().muted }, o || {}));
    /* a map for drawing the whole system with its rays: the object-space start of the rays, the lens, the image */
    T.layout = (st, sys, par, fld, zStart, margins) => {
      const zIm = Number.isFinite(par.zImage) ? par.zImage : 0, last = par.zs[par.zs.length - 1], efl = Math.abs(par.efl);
      const lo = Math.min(zStart, zIm, 0), hi = Math.max(zStart, zIm, last), pad = 0.04 * (hi - lo);
      const yHalf = T.height(sys) * 1.12 + Math.abs(zStart) * Math.tan(Math.abs(fld)) + 0.01 * efl;
      return S.map(st, lo - pad, hi + pad, yHalf, margins || {});
    };
    /* a singlet or achromat of one glass with its stop at the front surface, from the design helpers */
    T.designed = (glass, N, f) => {
      f = f || 100;
      const D = f / N;
      if (glass === 'achromat') return O.design.achromat({ f, D });
      return O.design.singlet({ f, q: 0, D, glass, t: Math.max(0.025 * f, 0.13 * D) });
    };
    return T;
  }

  /* ================================================================ what aberrations are */
  Hyper.sim('ab-overview', {
    title: 'A real lens against the ideal image',
    blurb: `A lens traced ray by ray. On the left the rays from one far-away point; on the right where they really land in the image plane (the **spot diagram**), against the **Airy disc** that diffraction alone would give (dashed). A perfect point would be a single dot inside the circle.

**Try this**
- Start with the biconvex singlet at f/5.6, on the axis. The spot is a round blob: spherical aberration. Stop down to f/16: the blob shrinks to fit inside the Airy disc.
- Drag the rays upward (or raise *Field position*): the spot grows a tail (coma) and spreads into an ellipse (astigmatism). Read which third-order error is largest in the read-out.
- Switch to *blue, green and red together*: the three colours separate (colour errors). Then change to the cemented achromat and watch them come together.
- Try the Cooke triplet and the double Gauss at their full fields: six or ten surfaces working together keep the RMS spot within about five Airy radii at best focus; the singlet at the edge of its field is at about eighty.
- Choose *best focus*: the plane of smallest RMS spot lies a little in front of the paraxial focus when spherical aberration is large.`,
    mount(box, kit, params) {
      const T = tools(kit), O = T.O, Sy = T.Sy, S = T.S;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 340 });
      const IDS = ['biconvex', 'best-form', 'achromat', 'cooke-triplet', 'double-gauss'];
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'Lens', options: IDS.map(id => [T.LENSES[id].label, id]), value: params.lens || 'biconvex' },
        { id: 'N', label: 'Aperture (f-number)', min: 2.8, max: 16, value: params.N || 5.6, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'field', label: 'Field position (0 = axis, 100 = edge)', min: 0, max: 100, step: 1, value: params.field != null ? params.field : 0, unit: '%' },
        { id: 'light', type: 'select', label: 'Light', options: [['Green, 550 nm', 'g'], ['Blue, green and red together', 'rgb']], value: params.light || 'g' },
        { id: 'focus', type: 'select', label: 'Image plane at', options: [['the paraxial focus', 'par'], ['the best focus (smallest RMS)', 'best']], value: params.focus || 'par' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['f', 'Focal length · f-number'], ['fld', 'Field angle'], ['airy', 'Airy disc radius'], ['rms', 'RMS spot radius'], ['geo', 'Largest ray miss'], ['ratio', 'RMS spot ÷ Airy radius'], ['w', 'Third-order errors (waves)'], ['who', 'The image is limited by']]);
      const model = () => {
        const V = ctl.values, Ld = T.LENSES[V.lens], N = Math.max(V.N, T.nmin(V.lens));
        return T.memo('ov', [V.lens, N.toFixed(3), V.field, V.light, V.focus].join('|'), () => {
          const sys = T.build(V.lens, N, 4), fld = V.field / 100 * Ld.fmax * D2R, nms = V.light === 'g' ? [550] : [450, 550, 650];
          const par = Sy.paraxial(sys, 550), prs = nms.map(nm => T.pupil(sys, nm, fld, 5)), prG = prs[nms.indexOf(550)];
          const z = V.focus === 'best' ? T.bestZ(prG) : par.zImage, ref = T.chief(prG, z) || [0, 0];
          const lands = prs.map(pr => T.land(pr, z, ref)), all = T.stats([].concat.apply([], lands.map(l => l.pts)));
          const fan = nms.map(nm => Sy.fan2d(sys, { nm, n: 9, field: fld, zStart: -0.25 * Math.abs(par.efl), zEnd: z }));
          return { sys, par, fld, nms, lands, all, fan, z, N, sd: Sy.seidel(sys, { nm: 550, field: fld }), airy: O.diff.airyRadius(550, N) * 1e3, hh: T.height(sys) };
        });
      };
      let gm = null;
      kit.drag(st, {
        hover: true,
        hit: p => (gm && p.x < gm.lw) ? 'field' : null,
        move: (w, p) => { if (!gm) return; ctl.set('field', clamp(Math.round((gm.y0 - p.y) / (0.34 * st.H) * 100), 0, 100)); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, s = model(), V = ctl.values, efl = Math.abs(s.par.efl);
        const lw = Math.round(W * 0.6), zMin = -0.25 * efl, zMax = s.par.zImage + 0.04 * efl;
        const yHalf = s.hh * 1.12 + Math.abs(zMin) * Math.tan(s.fld) + 0.5;
        const m = S.map(st, Math.min(zMin, s.par.zImage - 0.04 * efl), Math.max(zMax, 0.04 * efl), yHalf, { left: 10, right: W - lw + 4, top: 22, bottom: 22 });
        gm = { lw, y0: m.y0 };
        S.axis(c, m.X(zMin), m.y0, m.X(zMax));
        S.system(c, s.sys, m);
        s.nms.forEach((nm, i) => S.rays(c, s.fan[i], m, { nm, width: 1.1, alpha: s.nms.length > 1 ? 0.8 : 1 }));
        S.screen(c, m.X(s.z), m.y0, Math.min(m.s * s.hh * 0.5, Hh * 0.12), { label: 'image plane' });
        T.cap(c, T.LENSES[V.lens].label, 12, 12, { size: 12 });
        T.cap(c, 'drag the rays up or down to change the field', 12, Hh - 8, { color: C.faint, size: 11 });
        // the spot diagram
        const half = Math.min((W - lw) / 2 - 16, Hh * 0.36), cx = lw + (W - lw) / 2, cy = Hh * 0.46;
        const halfMm = niceUp(1.25 * Math.max(s.all.geo, s.airy)), scale = half / halfMm;
        s.lands.forEach((L, i) => T.spot(c, L, cx, cy, half, scale, { airy: i === 0 ? s.airy : 0, bare: i > 0, blend: s.nms.length > 1, color: () => S.nm(s.nms[i], s.nms.length > 1 && !C.dark ? 0.75 : 1) }));
        T.cap(c, 'the image of a point', cx, cy - half - 12, { align: 'center', size: 12 });
        T.cap(c, 'box ±' + um(halfMm, halfMm < 0.01 ? 0 : 0).replace(/\.0+ /, ' ') + ' · dashed: Airy disc', cx, cy + half + 13, { align: 'center', size: 11 });
        // numbers
        const sd = s.sd, rms = s.all.rms, ratio = rms / s.airy;
        const terms = [['spherical aberration', 0.0745 * Math.abs(sd.W040), sd.W040], ['coma', 0.118 * Math.abs(sd.W131), sd.W131], ['astigmatism', 0.204 * Math.abs(sd.W222), sd.W222], ['field curvature', 0.289 * Math.abs(sd.W220 + sd.W222 / 2), sd.W220]];
        const top = terms.slice().sort((a, b) => b[1] - a[1])[0];
        ro.set('f', efl.toFixed(1) + ' mm · f/' + s.N.toFixed(1));
        ro.set('fld', (s.fld * R2D).toFixed(1) + '°');
        ro.set('airy', um(s.airy));
        ro.set('rms', um(rms));
        ro.set('geo', um(s.all.geo));
        ro.set('ratio', ratio.toFixed(ratio < 10 ? 1 : 0));
        ro.set('w', terms.map(t => t[0].split(' ')[0] + ' ' + (Math.abs(t[2]) < 10 ? Math.abs(t[2]).toFixed(1) : Math.abs(t[2]).toFixed(0))).join(' · '));
        const mono = s.lands[s.nms.indexOf(550)].rms, colour = s.nms.length > 1 && rms > 1.25 * mono;
        ro.set('who', ratio < 1.2 ? 'diffraction (within the Airy disc)' : (colour ? 'the colours separating' : top[0]) + ' (about ' + ratio.toFixed(0) + '× the Airy radius)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ spherical aberration */
  Hyper.sim('ab-spherical', {
    title: 'Spherical aberration: where the zones of a lens focus',
    blurb: `A 100 mm singlet and a parallel beam. Each ray is coloured by the zone of the lens it crosses, blue near the middle and red at the edge. The big window on the right is the **region around the focus, stretched** along the axis and across it so that the crossings can be seen. The left-hand box is the spot the screen would show.

**Try this**
- Press *Paraxial focus*: the screen sits where the central rays meet. The blue core is sharp, but the red outer rays have already crossed and form a wide skirt. That is the transverse aberration.
- Press *Marginal focus*: now the outer rays meet at the axis and the inner rays have not yet focused. Press *Best focus* for the smallest overall blur, between the two (and nearer the marginal one).
- Drag the screen along the axis, or stop down from f/4 to f/8: the longitudinal aberration falls to a quarter and the blur radius to an eighth, as the plot at the bottom (aperture²) and the read-outs (aperture³) show.
- Choose the plano-convex lens with its flat side first: about four times the aberration of the curved side first, and the best-form lens has the least.`,
    mount(box, kit, params) {
      const T = tools(kit), O = T.O, Sy = T.Sy, S = T.S;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380 });
      const plot = kit.plot(box.stage, { x: { label: 'longitudinal aberration (mm)', name: 'LSA' }, y: { label: 'pupil zone', min: 0, max: 1, name: 'zone' }, series: [], vlines: [] }, 170);
      const IDS = ['biconvex', 'plano-convex', 'convex-plano-reversed', 'best-form'];
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'Lens (100 mm, N-BK7)', options: IDS.map(id => [T.LENSES[id].label, id]), value: params.lens || 'biconvex' },
        { id: 'N', label: 'Aperture (f-number)', min: 2.8, max: 16, value: params.N || 4, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'pos', label: 'Screen position (0 = marginal focus, 100 = paraxial)', min: -30, max: 130, step: 1, value: 100, unit: '%' },
        { type: 'buttons', items: [{ id: 'bPar', label: 'Paraxial focus' }, { id: 'bBest', label: 'Best focus' }, { id: 'bMarg', label: 'Marginal focus' }] }
      ], id => {
        if (id === 'bPar') ctl.set('pos', 100);
        else if (id === 'bMarg') ctl.set('pos', 0);
        else if (id === 'bBest') ctl.set('pos', Math.round(model().posBest));
        loop.once();
      });
      const ro = kit.readout(box.side, [['lsa', 'LSA of the marginal ray'], ['tsa', 'Blur radius at the paraxial focus'], ['scr', 'Blur radius at the screen (largest ray)'], ['best', 'Best focus, from the paraxial focus'], ['w', 'Wavefront error (paraxial focus)'], ['airy', 'Airy disc radius']]);
      const model = () => {
        const V = ctl.values, N = Math.max(V.N, 2.8);
        return T.memo('sph', V.lens + '|' + N.toFixed(3), () => {
          const sys = T.build(V.lens, N, 4), par = Sy.paraxial(sys, 550), lsa = Sy.lsa(sys, 550, 20);
          const zM = par.zImage + (lsa.length ? lsa[lsa.length - 1][1] : 0);
          const fan = Sy.fan2d(sys, { nm: 550, n: 11, zStart: -24, zEnd: par.zImage });
          const pr = T.pupil(sys, 550, 0, 6), zB = T.bestZ(pr);
          return { sys, par, lsa, zM, zP: par.zImage, fan, pr, zB, N, W040: Sy.seidel(sys, { nm: 550 }).W040, tsa: T.land(pr, par.zImage, [0, 0]).geo,
            posBest: Math.abs(par.zImage - zM) < 1e-9 ? 100 : 100 * (zB - zM) / (par.zImage - zM), airy: O.diff.airyRadius(550, N) * 1e3 };
        });
      };
      let gm = null;
      kit.drag(st, {
        hover: true,
        hit: p => gm && T.inRect(p, gm.rect) ? 'screen' : null,
        move: (w, p) => { const s = model(); if (!gm || Math.abs(s.zP - s.zM) < 1e-9) return; ctl.set('pos', clamp(Math.round((gm.Z(p.x) - s.zM) / (s.zP - s.zM) * 100), -30, 130)); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, s = model(), V = ctl.values;
        const lw = Math.round(W * 0.38), top = Hh * 0.5, L = s.zM - s.zP, aL = Math.max(Math.abs(L), 1e-5);
        const zS = s.zM + V.pos / 100 * (s.zP - s.zM);
        // the whole lens
        const m = S.map(st, -24, s.zP + 6, 22, { left: 8, right: W - lw + 6, top: 20, bottom: Hh - top + 8 });
        S.axis(c, m.X(-24), m.y0, m.X(s.zP + 6));
        S.system(c, s.sys, m);
        T.fan(c, s.fan, m, r => T.zone(Math.abs(r.py) * 6, 6, 0.9), 1.1);
        S.screen(c, m.X(zS), m.y0, 10, {});
        T.cap(c, 'the whole lens', 10, 12);
        // the focus, stretched
        const rect = { x: lw + 12, y: 22, w: W - lw - 24, h: Hh - 50 };
        const zA = s.zM - 0.25 * aL, zB = s.zP + 0.25 * aL, yH = Math.max(1.3 * s.tsa, 1e-4);
        const g = T.zoom(rect, zA, zB, yH); gm = g;
        c.save(); c.fillStyle = C.surface; c.fillRect(rect.x, rect.y, rect.w, rect.h); c.strokeStyle = C.grid; c.strokeRect(rect.x, rect.y, rect.w, rect.h);
        c.beginPath(); c.rect(rect.x, rect.y, rect.w, rect.h); c.clip();
        S.axis(c, rect.x, g.Y(0), rect.x + rect.w);
        s.fan.forEach(r => { const y = T.rayY(r.tr); S.ray(c, [[g.X(zA), g.Y(y(zA))], [g.X(zB), g.Y(y(zB))]], { color: T.zone(Math.abs(r.py) * 6, 6, 0.9), width: 1.3, arrows: false }); });
        const mark = (z, col, lab, dy) => { c.strokeStyle = col; c.setLineDash([4, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(g.X(z), rect.y); c.lineTo(g.X(z), rect.y + rect.h); c.stroke(); c.setLineDash([]); kit.label(c, lab, g.X(z) + 4, rect.y + dy, { size: 11, color: col }); };
        mark(s.zM, C.warn, 'marginal focus', 12); mark(s.zP, C.ok, 'paraxial focus', 26); mark(s.zB, C.muted, 'best focus', 40);
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(g.X(zS), rect.y + 4); c.lineTo(g.X(zS), rect.y + rect.h - 4); c.stroke();
        c.restore();
        T.cap(c, 'screen (drag it)', g.X(zS), rect.y + rect.h + 12, { align: 'center', color: C.text });
        T.cap(c, 'the focus, stretched: ' + mmTxt(zB - zA) + ' along the axis, ±' + um(yH) + ' across', rect.x + rect.w, rect.y - 8, { align: 'right', size: 11 });
        // the spot on the screen
        const sp = T.land(s.pr, zS, [0, 0]), half = Math.min(lw / 2 - 12, (Hh - top) / 2 - 22), cx = lw / 2, cy = top + (Hh - top) / 2 + 6;
        const hm = niceUp(1.25 * Math.max(sp.geo, s.airy));
        T.spot(c, sp, cx, cy, half, half / hm, { airy: s.airy, color: p => T.zone(p.ring, 6) });
        T.cap(c, 'on the screen · box ±' + um(hm, 0) + ' · dashed: Airy disc', cx, cy - half - 10, { align: 'center', size: 11 });
        ro.set('lsa', mmTxt(L));
        ro.set('tsa', um(s.tsa));
        ro.set('scr', um(sp.geo) + ' (RMS ' + um(sp.rms) + ')');
        ro.set('best', mmTxt(s.zB - s.zP));
        ro.set('w', Math.abs(s.W040).toFixed(1) + ' waves');
        ro.set('airy', um(s.airy));
        plot.set({ series: [{ pts: [[0, 0]].concat(s.lsa.map(a => [a[1], a[0]])), color: C.accent, label: 'zone focus' }],
          x: { label: 'longitudinal aberration (mm)', name: 'LSA', min: Math.min(L * 1.1, zS - s.zP, 0) - 0.02 * aL, max: Math.max(0, zS - s.zP) + 0.1 * aL },
          vlines: Math.abs(V.pos - 100) < 1 ? [{ x: 0, label: 'screen at the paraxial focus', color: C.ok }] : [{ x: 0, label: 'paraxial focus', color: C.ok }, { x: zS - s.zP, label: 'screen', color: C.text }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ coma */
  Hyper.sim('ab-coma', {
    title: 'Coma: a comet built from the rings of the pupil',
    blurb: `A distant star off the axis, imaged by a paraboloid mirror (pure coma, no spherical aberration) or by a single lens. Each ring of the pupil is coloured, blue at the centre to red at the edge, and lands as a **circle**: the larger the ring, the larger the circle and the farther it is displaced. Together the circles make the comet. The cross is the chief ray, the dashed circle the Airy disc, the dashed lines the 60° wedge that bounds a comet.

**Try this**
- On the paraboloid at f/5, push the field from 0 to the edge: the tail grows in proportion to the angle (3 f θ / 16 N²) and always points along the radius.
- Close the aperture to f/10 (two stops): the tail falls to a quarter. Open it to f/2.8 — the paraboloid will not open beyond its own f/5, but the lenses will.
- Read the *tangential* and *sagittal* coma: the first is about three times the second (a little less at f/5, where higher orders add; the formula in the read-out is the third-order value).
- Pick the best-form singlet and the plano-convex lens turned the wrong way round: same focal length, same stop at the lens, very different coma — and a wide field also brings astigmatism.`,
    mount(box, kit, params) {
      const T = tools(kit), O = T.O, Sy = T.Sy, S = T.S;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 340 });
      const IDS = ['parabolic-mirror', 'best-form', 'biconvex', 'plano-convex', 'convex-plano-reversed'];
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'System', options: IDS.map(id => [T.LENSES[id].label, id]), value: params.lens || 'parabolic-mirror' },
        { id: 'N', label: 'Aperture (f-number)', min: 2.8, max: 16, value: params.N || 5, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'field', label: 'Field position (0 = axis, 100 = edge)', min: 0, max: 100, step: 1, value: params.field != null ? params.field : 100, unit: '%' },
        { id: 'focus', type: 'select', label: 'Image plane at', options: [['the paraxial focus', 'par'], ['the best focus (smallest RMS)', 'best']], value: params.focus || 'par' },
        { id: 'rings', type: 'check', label: 'Colour the rings of the pupil', value: true }
      ], id => {
        if (id === 'lens') { const mir = ctl.values.lens === 'parabolic-mirror'; ctl.set('N', mir ? 5 : 8); ctl.set('field', mir ? 100 : 30); ctl.set('focus', mir ? 'par' : 'best'); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['fld', 'Field angle'], ['tcoma', 'Tangential coma (length of the tail)'], ['scoma', 'Sagittal coma (half-width)'], ['ratio', 'Tangential ÷ sagittal'], ['theory', 'Paraboloid: 3 f θ / 16 N²'], ['w', 'Coma wavefront term'], ['airy', 'Airy disc radius']]);
      const model = () => {
        const V = ctl.values, Ld = T.LENSES[V.lens], N = Math.max(V.N, T.nmin(V.lens));
        return T.memo('coma', [V.lens, N.toFixed(3), V.field, V.focus].join('|'), () => {
          const sys = T.build(V.lens, N, 0.5), fld = V.field / 100 * Ld.fmax * D2R, par = Sy.paraxial(sys, 550), efl = Math.abs(par.efl);
          const pr = T.pupil(sys, 550, fld, 8), L = T.land(pr, V.focus === 'best' ? T.bestZ(pr) : par.zImage);
          const dir = L.cy < 0 ? -1 : 1;
          let tail = 0, sag = 0; L.pts.forEach(p => { tail = Math.max(tail, dir * p.y); sag = Math.max(sag, Math.abs(p.x)); });
          const zStart = V.lens === 'parabolic-mirror' ? -0.3 * efl : -0.25 * efl;
          return { sys, par, efl, fld, N, L, dir, tail, sag, zStart, chiefY: (T.chief(pr, par.zImage) || [0, 0])[1], fan: Sy.fan2d(sys, { nm: 550, n: 9, field: fld, zStart }), W131: Sy.seidel(sys, { nm: 550, field: fld }).W131, airy: O.diff.airyRadius(550, N) * 1e3 };
        });
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, s = model(), V = ctl.values;
        const lw = Math.round(W * 0.42);
        const m = T.layout(st, s.sys, s.par, s.fld, s.zStart, { left: 8, right: W - lw + 6, top: 24, bottom: 24 });
        S.axis(c, m.X(Math.min(s.zStart, s.par.zImage)), m.y0, m.X(Math.max(0, s.zStart)));
        S.system(c, s.sys, m);
        T.fan(c, s.fan, m, r => V.rings ? T.zone(Math.abs(r.py) * 6, 6, 0.9) : S.nm(550), 1.1);
        T.cap(c, T.LENSES[V.lens].label + ' · field ' + (s.fld * R2D).toFixed(2) + '°', 10, 12);
        // the comet
        const half = Math.min((W - lw) / 2 - 14, Hh / 2 - 26), cx = lw + (W - lw) / 2, cy = Hh / 2 + 6;
        let ymin = 1e9, ymax = -1e9, xm = 0; s.L.pts.forEach(p => { ymin = Math.min(ymin, p.y); ymax = Math.max(ymax, p.y); xm = Math.max(xm, Math.abs(p.x)); });
        const need = Math.max((ymax - ymin) / 2, xm, s.airy * 1.2, 1e-5), scale = half * 0.88 / need, oy = cy + (ymin + ymax) / 2 * scale;
        T.spot(c, s.L, cx, cy, half, scale, { airy: s.airy, dy: oy - cy, color: p => V.rings ? T.zone(p.ring, 8) : C.accent });
        c.save(); c.beginPath(); c.rect(cx - half, cy - half, 2 * half, 2 * half); c.clip();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([5, 4]);
        for (const sgn of [-1, 1]) { c.beginPath(); c.moveTo(cx, oy); c.lineTo(cx + sgn * Math.sin(Math.PI / 6) * 2 * half, oy - s.dir * Math.cos(Math.PI / 6) * 2 * half); c.stroke(); }
        c.setLineDash([]); c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx - 6, oy); c.lineTo(cx + 6, oy); c.moveTo(cx, oy - 6); c.lineTo(cx, oy + 6); c.stroke();
        c.restore();
        const bar = NICE.filter(x => x * scale <= 0.34 * 2 * half).pop() || NICE[0], bx = cx - half + 12, by = cy + half - 14;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + bar * scale, by); c.stroke();
        T.cap(c, um(bar, 0), bx, by - 9, { size: 10.5, color: C.text });
        T.cap(c, 'the image of a star · + is the chief ray · dashed circle: Airy disc', cx, cy - half - 10, { align: 'center', size: 11 });
        if (Math.abs(s.chiefY) > 1e-9) T.cap(c, 'the tail points ' + (s.dir * s.chiefY > 0 ? 'away from' : 'towards') + ' the centre of the picture', cx, cy + half + 12, { align: 'center', size: 11, color: C.faint });
        ro.set('fld', (s.fld * R2D).toFixed(2) + '°');
        ro.set('tcoma', um(s.tail));
        ro.set('scoma', um(s.sag));
        ro.set('ratio', s.sag > 1e-9 ? (s.tail / s.sag).toFixed(1) : '—');
        ro.set('theory', V.lens === 'parabolic-mirror' ? um(3 * s.efl * s.fld / (16 * s.N * s.N)) : 'only for the mirror');
        ro.set('w', Math.abs(s.W131).toFixed(2) + ' waves');
        ro.set('airy', um(s.airy));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ astigmatism and field curvature */
  Hyper.sim('ab-astig-field', {
    title: 'Astigmatism and field curvature: two foci and three surfaces',
    blurb: `A distant point at an angle off the axis. In the **astigmatism** view the row of boxes is the spot at five planes along the chief ray: a line one way at the tangential focus, a line the other way at the sagittal focus, and a round blur between. In the **field curvature** view the three boxes are the picture at the centre, at 70 % and at the edge for a *flat sensor* you place yourself. The graph is the focal surfaces: tangential and sagittal foci against the field angle, and the Petzval surface (dashed).

**Try this**
- Astigmatism view, singlet at f/8: raise the field from 30 % to 60 %. The two foci move four times as far apart (about f θ²). Stop down to f/16: the lines get shorter, but they stay at the same two places.
- Field-curvature view: choose the singlet and slide the sensor towards the lens. The centre blurs while the edge sharpens; *Best flat sensor* gives the least-bad compromise. Then switch to the Cooke triplet: its curves are nearly flat and the whole picture is sharp.
- Compare the Petzval curve of the triplet (strongly curved) with its T and S curves (nearly flat): the designer uses astigmatism to cancel the field curvature.
- The double Gauss keeps its T and S foci within a few tenths of a millimetre out to 14°, against about 11 mm for the singlet at 15°.`,
    mount(box, kit, params) {
      const view = params.view === 'field' ? 'field' : 'astig';
      const T = tools(kit), O = T.O, Sy = T.Sy, S = T.S;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 300 });
      const plot = kit.plot(box.stage, { x: { label: 'focus shift from the paraxial plane (mm)', name: 'shift' }, y: { label: 'field angle (°)', name: 'field' }, series: [] }, 190);
      const IDS = ['biconvex', 'achromat', 'cooke-triplet', 'double-gauss'];
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'Lens', options: IDS.map(id => [T.LENSES[id].label, id]), value: params.lens || (view === 'field' ? 'cooke-triplet' : 'biconvex') },
        { id: 'N', label: 'Aperture (f-number)', min: 2.8, max: 16, value: params.N || (view === 'field' ? 5 : 8), log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'field', label: 'Field position (0 = axis, 100 = edge)', min: 0, max: 100, step: 1, value: params.field != null ? params.field : (view === 'field' ? 100 : 60), unit: '%' },
        { id: 'shift', label: 'Flat sensor: shift from the paraxial focus', min: -10, max: 3, step: 0.05, value: 0, unit: '% of f' },
        { type: 'buttons', items: [{ id: 'bPar', label: 'Paraxial plane' }, { id: 'bBest', label: 'Best flat sensor' }] }
      ], id => {
        if (id === 'bPar') ctl.set('shift', 0);
        else if (id === 'bBest') { const s = model(); ctl.set('shift', clamp(Math.round(s.bestShift / s.efl * 2000) / 20, -10, 3)); }
        loop.once();
      });
      if (view === 'astig') { ctl.show('shift', false); ctl.show('bPar', false); ctl.show('bBest', false); }
      const ro = kit.readout(box.side, view === 'astig'
        ? [['fld', 'Field angle'], ['dz', 'Astigmatic difference (T and S foci)'], ['theory', 'Thin lens: f θ²'], ['blur', 'Round blur between (least confusion)'], ['petz', 'Petzval radius']]
        : [['fld', 'Field angle'], ['petz', 'Petzval radius'], ['c0', 'RMS spot at the centre'], ['c7', 'RMS spot at 70 % of the field'], ['c1', 'RMS spot at the edge'], ['airy', 'Airy disc radius']]);
      const model = () => {
        const V = ctl.values, Ld = T.LENSES[V.lens], N = Math.max(V.N, T.nmin(V.lens));
        return T.memo('af', [V.lens, N.toFixed(3), V.field].join('|'), () => {
          const sys = T.build(V.lens, N, 0.5), par = Sy.paraxial(sys, 550), efl = Math.abs(par.efl), fmax = Ld.fmax * D2R, fld = V.field / 100 * fmax;
          const pr = T.pupil(sys, 550, fld, 6), fc = T.foci(sys, 550, fld), RP = Sy.seidel(sys, { nm: 550, field: fmax }).petzvalRadius;
          const curves = [];
          for (let k = 0; k <= 20; k++) { const a = fmax * k / 20, f = T.foci(sys, 550, a), h = efl * Math.tan(a); curves.push({ deg: a * R2D, zT: f.zT, zS: f.zS, zP: Number.isFinite(RP) ? h * h / (2 * RP) : 0 }); }
          const f3 = [0, 0.7, 1].map(q => T.pupil(sys, 550, q * fmax, 5));
          let best = 0, bv = Infinity;
          for (let i = 0; i <= 56; i++) { const sh = -0.1 * efl + 0.13 * efl * i / 56, r = Math.max.apply(null, f3.map(p => T.land(p, par.zImage + sh).rms)); if (r < bv) { bv = r; best = sh; } }
          return { sys, par, efl, fmax, fld, pr, fc, RP, curves, f3, bestShift: best, N, airy: O.diff.airyRadius(550, N) * 1e3, fan: Sy.fan2d(sys, { nm: 550, n: 7, field: fld, zStart: -0.25 * efl }) };
        });
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, s = model(), V = ctl.values;
        const lw = Math.round(W * 0.36), zP = s.par.zImage, shiftMm = V.shift / 100 * s.efl;
        const m = T.layout(st, s.sys, s.par, s.fld, -0.25 * s.efl, { left: 8, right: W - lw + 6, top: 24, bottom: 26 });
        S.axis(c, m.X(-0.25 * s.efl), m.y0, m.X(zP + 0.04 * s.efl));
        S.system(c, s.sys, m);
        T.fan(c, s.fan, m, () => S.nm(550), 1.1, 0.9);
        const chief = s.pr.list.find(r => r.ring === 0), mark = (dz, col, lab) => { if (!chief) return; const z = zP + dz, p = Sy.at(chief.tr, z); c.fillStyle = col; c.beginPath(); c.arc(m.X(z), m.Y(p[1]), 3.5, 0, TAU); c.fill(); kit.label(c, lab, m.X(z), m.Y(p[1]) - 9, { align: 'center', size: 11, color: col }); };
        if (view === 'astig') { mark(s.fc.zT, C.warn, 'T'); mark(s.fc.zS, C.ok, 'S'); } else { S.screen(c, m.X(zP + shiftMm), m.y0, Math.min(m.s * T.height(s.sys) * 0.5, Hh * 0.12), { label: 'flat sensor' }); }
        T.cap(c, T.LENSES[V.lens].label + ' · field ' + (s.fld * R2D).toFixed(1) + '°', 10, 12);
        // the spots
        const x0 = lw + 10, avail = W - x0 - 10, cy = Hh * 0.46;
        if (view === 'astig') {
          const dz = Math.max(Math.abs(s.fc.zS - s.fc.zT), 0.01 * s.efl), lo = Math.min(s.fc.zT, s.fc.zS), hi = Math.max(s.fc.zT, s.fc.zS), tFirst = s.fc.zT <= s.fc.zS;
          const planes = [[lo - 0.6 * dz, ''], [lo, tFirst ? 'tangential focus' : 'sagittal focus'], [(lo + hi) / 2, 'least confusion'], [hi, tFirst ? 'sagittal focus' : 'tangential focus'], [hi + 0.6 * dz, '']];
          const Ls = planes.map(p => T.land(s.pr, zP + p[0])), g = 6, bw = (avail - 4 * g) / 5, half = bw / 2;
          const hm = niceUp(1.15 * Math.max.apply(null, Ls.map(l => Math.max(Math.abs(l.cx) + l.geo, l.geo))));
          Ls.forEach((L, i) => { const cx = x0 + half + i * (bw + g); T.spot(c, L, cx, cy, half, half / hm, { color: p => T.zone(p.ring, 6) }); T.cap(c, planes[i][1], cx, cy + half + 12, { align: 'center', size: 10.5 }); });
          T.cap(c, 'the spot at five planes along the chief ray · each box ±' + um(hm, 0), x0 + avail / 2, cy - half - 12, { align: 'center', size: 11 });
          ro.set('fld', (s.fld * R2D).toFixed(1) + '°');
          ro.set('dz', mmTxt(Math.abs(s.fc.zS - s.fc.zT)));
          ro.set('theory', mmTxt(s.efl * s.fld * s.fld));
          ro.set('blur', um(Ls[2].geo * 2) + ' across');
          ro.set('petz', mmTxt(s.RP));
        } else {
          const z = zP + shiftMm, g = 8, bw = (avail - 2 * g) / 3, half = bw / 2, labs = ['centre', '70 %', 'edge'];
          const Ls = s.f3.map(p => T.land(p, z)), hm = niceUp(1.2 * Math.max.apply(null, Ls.map(l => l.geo)));
          Ls.forEach((L, i) => { const cx = x0 + half + i * (bw + g); T.spot(c, L, cx, cy, half, half / hm, { airy: s.airy, color: p => T.zone(p.ring, 5) }); T.cap(c, labs[i] + ' · RMS ' + um(L.rms), cx, cy + half + 12, { align: 'center', size: 10.5 }); });
          T.cap(c, 'a point at the centre, at 70 % and at the edge of the field · each box ±' + um(hm, 0), x0 + avail / 2, cy - half - 12, { align: 'center', size: 11 });
          ro.set('fld', (s.fld * R2D).toFixed(1) + '°');
          ro.set('petz', mmTxt(s.RP) + ' (' + (s.RP / s.efl).toFixed(1) + ' f)');
          ro.set('c0', um(Ls[0].rms)); ro.set('c7', um(Ls[1].rms)); ro.set('c1', um(Ls[2].rms)); ro.set('airy', um(s.airy));
        }
        const ser = (key, label, color, dash) => ({ pts: s.curves.map(q => [q[key], q.deg]), color, label, dash });
        const xs = s.curves.map(q => q.zT).concat(s.curves.map(q => q.zS), s.curves.map(q => q.zP), [0, view === 'field' ? shiftMm : 0]);
        const xmin = Math.min.apply(null, xs), xmax = Math.max.apply(null, xs), padX = 0.06 * (xmax - xmin) + 1e-4;
        plot.set({ series: [ser('zT', 'tangential focus T', C.accent), ser('zS', 'sagittal focus S', C.warn), ser('zP', 'Petzval surface', C.muted, true)],
          x: { label: 'focus shift from the paraxial plane (mm; negative: towards the lens)', name: 'shift', min: xmin - padX, max: xmax + padX }, y: { label: 'field angle (°)', name: 'field', min: 0, max: s.fmax * R2D },
          hlines: [{ y: s.fld * R2D, label: 'this field', color: C.faint }], vlines: view === 'field' ? [{ x: shiftMm, label: 'flat sensor', color: C.ok }] : [{ x: 0, label: 'paraxial plane', color: C.faint }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ distortion */
  Hyper.sim('ab-distortion', {
    title: 'Distortion: where the grid really lands',
    blurb: `A square grid of lines, as a lens images it, against the rectilinear grid it should be (dashed). The lens is traced with the chief ray of each grid point; nothing is blurred, every point lands sharply, but at the wrong distance from the centre.

**Try this**
- Singlet with the stop 30 mm in front of the lens: **barrel** distortion, the sides bulging out. Slide the stop to the lens and the grid straightens; slide it behind and the grid goes **pincushion**.
- Raise the field of view: the error in percent grows as the square of the angle.
- The Cooke triplet and the double Gauss: almost straight lines, because the lens is nearly symmetric about the stop.
- Pick the equidistant fisheye and push the field to 30°: a deliberate departure from straight lines, −9.3 % at the corner (it would be −39 % at 60°, and a rectilinear lens would need an infinite image at 90°).`,
    mount(box, kit, params) {
      const T = tools(kit), O = T.O, Sy = T.Sy, S = T.S;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const plot = kit.plot(box.stage, { x: { label: 'field angle (°)', name: 'angle' }, y: { label: 'distortion (%)', name: 'D' }, series: [] }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'Lens', options: [['Biconvex singlet, f = 100 mm', 'single'], ['Cooke triplet, f = 50 mm', 'cooke-triplet'], ['Double Gauss, f = 100 mm', 'double-gauss'], ['Equidistant fisheye (y = f θ)', 'fisheye']], value: params.lens || 'single' },
        { id: 'stop', label: 'Singlet: position of the stop (+ in front, − behind)', min: -20, max: 30, step: 1, value: params.stop != null ? params.stop : 30, unit: 'mm' },
        { id: 'fov', label: 'Half-angle at the corner of the grid', min: 5, max: 30, step: 1, value: params.fov || 20, unit: '°' },
        { id: 'ideal', type: 'check', label: 'Show the rectilinear grid (dashed)', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['f', 'Focal length'], ['dc', 'Distortion at the corner'], ['d7', 'Distortion at 70 % of the angle'], ['yc', 'Image height at the corner'], ['yi', 'Rectilinear height f tan θ'], ['kind', 'The grid is']]);
      const NT = 24;
      const model = () => {
        const V = ctl.values, key = [V.lens, V.lens === 'single' ? V.stop : 0, V.fov].join('|');
        return T.memo('dist', key, () => {
          let sys = null, f = 100, tmax = V.fov * D2R;
          if (V.lens === 'single') sys = T.build('biconvex', 8.3, V.stop);
          else if (V.lens !== 'fisheye') { sys = T.build(V.lens, T.nmin(V.lens)); tmax = Math.min(tmax, T.LENSES[V.lens].fmax * D2R); }
          const par = sys ? Sy.paraxial(sys, 550) : null;
          if (par) f = Math.abs(par.efl);
          const table = [];
          for (let k = 0; k <= NT; k++) {
            const a = tmax * k / NT; let y = f * a;
            if (sys) { const tr = Sy.trace(sys, Sy.aim(sys, 0, 0, a, par, 550), 550); y = tr.ok ? Sy.at(tr, par.zImage)[1] : NaN; }
            table.push({ a, y, ideal: f * Math.tan(a), D: k === 0 ? 0 : 100 * (y - f * Math.tan(a)) / (f * Math.tan(a)) });
          }
          const rReal = r => {      // image radius for an ideal radius r (mm)
            const a = Math.atan(r / f), x = a / tmax * NT, i = clamp(Math.floor(x), 0, NT - 1), u = x - i, p = table[i], q = table[i + 1];
            const y = p.y + (q.y - p.y) * u; return Number.isFinite(y) ? y : r;
          };
          return { f, tmax, table, rReal, sys, last: table[NT] };
        });
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, s = model(), V = ctl.values;
        const gs = Math.min(W * 0.8, Hh - 40), gx = W / 2, gy = Hh / 2 + 12, hs = s.f * Math.tan(s.tmax) / Math.SQRT2;
        const k = (gs / 2 * 0.8) / hs, NL = 9;
        const line = (fx, real) => { const pts = []; for (let i = 0; i <= 48; i++) { const t = -1 + 2 * i / 48, p = fx(t * hs); let x = p[0], y = p[1]; if (real) { const r = Math.hypot(x, y); if (r > 1e-9) { const q = s.rReal(r) / r; x *= q; y *= q; } } pts.push([gx + x * k, gy - y * k]); } return pts; };
        c.save(); c.fillStyle = C.surface; c.fillRect(gx - gs / 2, gy - gs / 2, gs, gs); c.restore();
        for (let i = 0; i < NL; i++) {
          const u = -hs + 2 * hs * i / (NL - 1);
          for (const fx of [t => [t, u], t => [u, t]]) {
            if (V.ideal) S.ray(c, line(fx, false), { color: C.faint, width: 1, dash: [4, 4], arrows: false });
            S.ray(c, line(fx, true), { color: C.accent, width: 1.6, arrows: false });
          }
        }
        c.save(); c.strokeStyle = C.grid; c.strokeRect(gx - gs / 2, gy - gs / 2, gs, gs); c.restore();
        T.cap(c, 'the image of a square grid (corner at ' + (s.tmax * R2D).toFixed(0) + '°)', gx, gy - gs / 2 - 8, { align: 'center', size: 11.5 });
        const dc = s.last.D, d7 = s.table[Math.round(NT * 0.7)].D;
        ro.set('f', s.f.toFixed(0) + ' mm');
        ro.set('dc', Number.isFinite(dc) ? dc.toFixed(Math.abs(dc) < 1 ? 2 : 1) + ' %' : '—');
        ro.set('d7', Number.isFinite(d7) ? d7.toFixed(Math.abs(d7) < 1 ? 2 : 1) + ' %' : '—');
        ro.set('yc', Number.isFinite(s.last.y) ? s.last.y.toFixed(2) + ' mm' : '—');
        ro.set('yi', s.last.ideal.toFixed(2) + ' mm');
        ro.set('kind', !Number.isFinite(dc) ? 'out of range' : Math.abs(dc) < 0.3 ? 'nearly straight' : dc < 0 ? 'barrel (negative)' : 'pincushion (positive)');
        plot.set({ series: [{ pts: s.table.map(q => [q.a * R2D, q.D]), color: C.accent, label: 'distortion' }], hlines: [{ y: 0, color: C.faint }], x: { label: 'field angle (°)', name: 'angle', min: 0, max: s.tmax * R2D }, y: { label: 'distortion (%)', name: 'D' } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ axial colour */
  Hyper.sim('ab-axial-colour', {
    title: 'Axial colour: blue focuses nearer than red',
    blurb: `A 100 mm lens traced in blue (450 nm), green (550 nm) and red (650 nm). The big window is the **region around the focus, stretched** across the axis: the blue rays cross first, the red ones last. The **screen** (drag it, or use the buttons) shows the spot in the three colours added together. The graph below is the focus shift against wavelength.

**Try this**
- On the crown-glass lens, press *Green focus*: a sharp green core inside a purple halo, which is blue and red out of focus. At *Blue focus* the blue is sharp and the red makes the halo.
- Change the glass: dense flint (V = 26) spreads the foci by 3.8 mm, calcium fluoride (V = 95) by 1.0 mm. The read-out gives f/V and the colour blur D/(2V).
- Stop down from f/5 to f/10: the foci stay where they are but the colour blur halves, as it is proportional to the aperture.
- Choose the achromat: blue and red now share a focus, but the curve in the graph is a U — the **secondary spectrum**: green is still a little off and violet far off.`,
    mount(box, kit, params) {
      const T = tools(kit), O = T.O, Sy = T.Sy, S = T.S;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 360 });
      const plot = kit.plot(box.stage, { x: { label: 'wavelength (nm)', name: 'λ' }, y: { label: 'focus shift (mm)', name: 'shift' }, series: [] }, 170);
      const GL = [['N-BK7 crown glass, V = 64', 'N-BK7'], ['Fused silica, V = 68', 'fused-silica'], ['Calcium fluoride, V = 95', 'CaF2'], ['Dense flint N-SF11, V = 26', 'N-SF11'], ['Acrylic (PMMA), V = 57', 'PMMA'], ['Polycarbonate, V = 30', 'PC'], ['Achromat: N-BK7 + N-SF5', 'achromat']];
      const NMS = [450, 550, 650];
      const ctl = kit.controls(box.side, [
        { id: 'glass', type: 'select', label: 'Lens of 100 mm focal length', options: GL, value: params.glass || 'N-BK7' },
        { id: 'N', label: 'Aperture (f-number)', min: 3, max: 16, value: params.N || 5, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'pos', label: 'Screen: shift from the green focus', min: -4.5, max: 2.5, step: 0.01, value: 0, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'b0', label: 'Blue focus' }, { id: 'b1', label: 'Green focus' }, { id: 'b2', label: 'Red focus' }] }
      ], id => {
        const m = model();
        if (id === 'b0') ctl.set('pos', clamp(m.foc[0], -4.5, 2.5)); else if (id === 'b1') ctl.set('pos', 0); else if (id === 'b2') ctl.set('pos', clamp(m.foc[2], -4.5, 2.5));
        loop.once();
      });
      const ro = kit.readout(box.side, [['v', 'Abbe number V'], ['fv', 'f / V'], ['df', 'Traced F–C focal shift'], ['bl', 'Colour blur D / (2V)'], ['scr', 'RMS blur at the screen'], ['sec', 'Violet (400 nm) focus from green']]);
      const model = () => {
        const V = ctl.values, N = Math.max(V.N, 3);
        return T.memo('ax', V.glass + '|' + N.toFixed(3), () => {
          const sys = T.designed(V.glass, N), pars = NMS.map(nm => Sy.paraxial(sys, nm)), zG = pars[1].zImage;
          const foc = pars.map(p => p.zImage - zG);
          const rays = NMS.map((nm, i) => [0.5, -0.5].map(py => Sy.trace(sys, Sy.aim(sys, 0, py, 0, pars[i], nm), nm)));
          const prs = NMS.map(nm => T.pupil(sys, nm, 0, 5));
          const wl = []; for (let nm = 400; nm <= 700; nm += 10) wl.push(nm);
          const curve = sy => wl.map(nm => [nm, Sy.paraxial(sy, nm).zImage - Sy.paraxial(sy, 550).zImage]);
          const ach = V.glass === 'achromat' ? null : T.designed('achromat', N);
          const cs = Sy.chromaticShift(sys, [486.13, 656.27, 400, 550]), D = 100 / N, vd = V.glass === 'achromat' ? NaN : O.abbe(V.glass).vd;
          return { sys, pars, zG, foc, rays, prs, curve: curve(sys), curveA: ach ? curve(ach) : null, df: cs[1][1] - cs[0][1], viol: cs[2][1] - cs[3][1], D, vd, N, fan: NMS.map(nm => Sy.fan2d(sys, { nm, n: 5, zStart: -24, zEnd: Sy.paraxial(sys, nm).zImage })) };
        });
      };
      let gm = null;
      kit.drag(st, { hover: true, hit: p => gm && T.inRect(p, gm.rect) ? 'screen' : null, move: (w, p) => { if (!gm) return; ctl.set('pos', clamp(Math.round(gm.Z(p.x) * 100) / 100, -4.5, 2.5)); loop.once(); } });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, s = model(), V = ctl.values;
        const lw = Math.round(W * 0.38), top = Hh * 0.5, span = Math.max(s.foc[2] - s.foc[0], 0.06), zS = V.pos;
        // the whole lens
        const m = S.map(st, -24, s.zG + 6, 22, { left: 8, right: W - lw + 6, top: 20, bottom: Hh - top + 8 });
        S.axis(c, m.X(-24), m.y0, m.X(s.zG + 6));
        S.system(c, s.sys, m);
        NMS.forEach((nm, i) => S.rays(c, s.fan[i], m, { nm, width: 1, alpha: 0.85 }));
        T.cap(c, 'the whole lens', 10, 12);
        // the focus, stretched (z measured from the green focus)
        const rect = { x: lw + 12, y: 22, w: W - lw - 24, h: Hh - 50 };
        const zA = Math.min(s.foc[0], 0) - 0.4 * span, zB = Math.max(s.foc[2], 0) + 0.4 * span;
        let yH = 0; s.rays.forEach((pair, i) => pair.forEach(tr => { const y = T.rayY(tr), z0 = s.pars[i].zImage; yH = Math.max(yH, Math.abs(y(s.zG + zA)), Math.abs(y(s.zG + zB))); }));
        const g = T.zoom(rect, zA, zB, Math.max(yH * 1.1, 1e-4)); gm = g;
        c.save(); c.fillStyle = C.surface; c.fillRect(rect.x, rect.y, rect.w, rect.h); c.strokeStyle = C.grid; c.strokeRect(rect.x, rect.y, rect.w, rect.h);
        c.beginPath(); c.rect(rect.x, rect.y, rect.w, rect.h); c.clip();
        S.axis(c, rect.x, g.Y(0), rect.x + rect.w);
        NMS.forEach((nm, i) => s.rays[i].forEach(tr => { const y = T.rayY(tr); S.ray(c, [[g.X(zA), g.Y(y(s.zG + zA))], [g.X(zB), g.Y(y(s.zG + zB))]], { nm, width: 1.4, arrows: false }); }));
        NMS.forEach((nm, i) => { c.strokeStyle = S.nm(nm); c.setLineDash([4, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(g.X(s.foc[i]), rect.y); c.lineTo(g.X(s.foc[i]), rect.y + rect.h); c.stroke(); c.setLineDash([]); kit.label(c, nm + ' nm', g.X(s.foc[i]) + 4, rect.y + 12 + 13 * i, { size: 11, color: S.nm(nm) }); });
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(g.X(zS), rect.y + 4); c.lineTo(g.X(zS), rect.y + rect.h - 4); c.stroke();
        c.restore();
        T.cap(c, 'screen (drag it)', g.X(zS), rect.y + rect.h + 12, { align: 'center', color: C.text });
        T.cap(c, 'the focus, stretched: ' + mmTxt(zB - zA) + ' along the axis, ±' + um(g.yHalf) + ' across', rect.x + rect.w, rect.y - 8, { align: 'right', size: 11 });
        // the spots on the screen
        const Ls = s.prs.map(pr => T.land(pr, s.zG + zS, [0, 0])), cx = lw / 2, cy = top + (Hh - top) / 2 + 6, half = Math.min(lw / 2 - 12, (Hh - top) / 2 - 22);
        const hm = niceUp(1.25 * Math.max.apply(null, Ls.map(l => l.geo)));
        Ls.forEach((L, i) => T.spot(c, L, cx, cy, half, half / hm, { bare: i > 0, blend: true, color: () => S.nm(NMS[i], C.dark ? 1 : 0.7) }));
        T.cap(c, 'on the screen · box ±' + um(hm, 0), cx, cy - half - 10, { align: 'center', size: 11 });
        ro.set('v', Number.isFinite(s.vd) ? s.vd.toFixed(1) : 'two glasses');
        ro.set('fv', Number.isFinite(s.vd) ? mmTxt(100 / s.vd) : '—');
        ro.set('df', mmTxt(Math.abs(s.df)));
        ro.set('bl', Number.isFinite(s.vd) ? um(s.D / (2 * s.vd)) : '—');
        ro.set('scr', um(T.stats([].concat.apply([], Ls.map(l => l.pts))).rms));
        ro.set('sec', mmTxt(s.viol));
        const series = [{ pts: s.curve, color: C.accent, label: V.glass === 'achromat' ? 'achromat (BK7 + SF5)' : V.glass }];
        if (s.curveA) series.push({ pts: s.curveA, color: C.warn, label: 'achromat, for comparison', dash: true });
        plot.set({ series, vlines: [{ x: 550, label: 'green', color: C.faint }], hlines: [{ y: 0, color: C.faint }], x: { label: 'wavelength (nm)', name: 'λ', min: 400, max: 700 }, y: { label: 'focus shift from 550 nm (mm)', name: 'shift' } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ lateral colour */
  Hyper.sim('ab-lateral-colour', {
    title: 'Lateral colour: the colours land at different heights',
    blurb: `The chief rays of blue, green and red from a point off the axis. Because the chief ray crosses the lens off centre, the lens acts like a weak prism for it and the colours land at different distances from the axis. The **strip on the right** is what an edge looks like there: a white bar on black, seen through the lens at the chosen field, with each colour channel shifted by the traced amount. Outward is to the right.

**Try this**
- Singlet, stop 30 mm in front, field 15°: red lands farther out than blue and the bar has a **yellow-red edge outside and a blue-cyan edge inside**, tens of pixels wide. Move the stop to the lens: the fringes shrink to a pixel or two.
- Put the stop *behind* the lens (negative): the colours swap sides.
- Change the field: the shift is proportional to the angle, zero on the axis, and does not depend on the aperture.
- The doublet, the triplet and the double Gauss at the edge of their fields: a few micrometres or less.`,
    mount(box, kit, params) {
      const T = tools(kit), O = T.O, Sy = T.Sy, S = T.S;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 300 });
      const plot = kit.plot(box.stage, { x: { label: 'field angle (°)', name: 'angle' }, y: { label: 'red − blue image height (µm)', name: 'R−B' }, series: [] }, 160);
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'Lens', options: [['Biconvex singlet, f = 100 mm', 'single'], ['Cemented achromat, f = 100 mm', 'achromat'], ['Cooke triplet, f = 50 mm', 'cooke-triplet'], ['Double Gauss, f = 100 mm', 'double-gauss']], value: params.lens || 'single' },
        { id: 'stop', label: 'Singlet: position of the stop (+ in front, − behind)', min: -20, max: 30, step: 1, value: params.stop != null ? params.stop : 30, unit: 'mm' },
        { id: 'fld', label: 'Field angle', min: 0, max: 20, step: 0.5, value: params.fld || 15, unit: '°' },
        { id: 'pitch', type: 'select', label: 'Pixel pitch of the sensor', options: [['3.5 µm', 3.5], ['5 µm', 5], ['8 µm', 8]], value: 5 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['h', 'Image height (green)'], ['dr', 'Red image − green image'], ['db', 'Blue image − green image'], ['rb', 'Red − blue (450 to 650 nm)'], ['px', 'Red − blue in pixels']]);
      const NMS = [450, 550, 650];
      const sign = y => (y < 0 ? -1 : 1);
      const model = () => {
        const V = ctl.values;
        return T.memo('lat', [V.lens, V.lens === 'single' ? V.stop : 0, V.fld].join('|'), () => {
          const sys = V.lens === 'single' ? T.build('biconvex', 8.3, V.stop) : V.lens === 'achromat' ? T.build('achromat', 4, 0.5) : T.build(V.lens, T.nmin(V.lens));
          const fmax = V.lens === 'single' || V.lens === 'achromat' ? 20 * D2R : T.LENSES[V.lens].fmax * D2R, fld = Math.min(V.fld * D2R, fmax);
          const par = Sy.paraxial(sys, 550), zG = par.zImage, chiefY = (a, nm) => { const tr = Sy.trace(sys, Sy.aim(sys, 0, 0, a, Sy.paraxial(sys, nm), nm), nm); return tr.ok ? Sy.at(tr, zG)[1] : NaN; };
          const y = NMS.map(nm => chiefY(fld, nm)), sg = sign(y[1]);
          const curve = []; for (let k = 0; k <= 20; k++) { const a = fmax * k / 20, yb = chiefY(a, 450), yr = chiefY(a, 650); curve.push([a * R2D, Number.isFinite(yb + yr) ? (yr - yb) * 1000 * sign(chiefY(a, 550)) : NaN]); }
          const fan = NMS.map(nm => Sy.fan2d(sys, { nm, n: 1, field: fld, zStart: -0.25 * Math.abs(par.efl), zEnd: zG }));
          return { sys, par, fld, fmax, y, sg, d: [(y[0] - y[1]) * sg, 0, (y[2] - y[1]) * sg], curve, fan };
        });
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, s = model(), V = ctl.values;
        const lw = Math.round(W * 0.5), dR = s.d[2] * 1000, dB = s.d[0] * 1000, pitch = V.pitch;
        // the layout with the three chief rays
        const m = T.layout(st, s.sys, s.par, s.fld, -0.25 * Math.abs(s.par.efl), { left: 8, right: W - lw + 6, top: 26, bottom: 30 });
        S.axis(c, m.X(-0.25 * Math.abs(s.par.efl)), m.y0, m.X(s.par.zImage + 0.03 * Math.abs(s.par.efl)));
        S.system(c, s.sys, m);
        NMS.forEach((nm, i) => S.rays(c, s.fan[i], m, { nm, width: 1.4, alpha: 0.9 }));
        S.screen(c, m.X(s.par.zImage), m.y0, Math.min(m.s * T.height(s.sys) * 0.5, Hh * 0.12), { label: 'image plane' });
        T.cap(c, 'the chief rays of blue, green and red', 10, 12);
        // the edge, magnified
        const maxd = Math.max(Math.abs(dR), Math.abs(dB), 1), pw = clamp(Math.round(maxd * 7 / 10) * 10, 100, 3000), ph = 0.34 * pw;
        const bx = lw + 14, bw = W - bx - 14, bh = Math.min(bw * ph / pw, Hh * 0.3), by = Hh * 0.2, hw = 0.3 * pw;
        const edge = t => clamp(0.5 + t / (0.018 * pw), 0, 1);
        const bar = x => edge(x + hw) * edge(hw - x);
        S.cells(c, bx, by, bw, bh, 160, 1, (u) => { const x = (u - 0.5) * pw; return [255 * bar(x - dR), 255 * bar(x), 255 * bar(x - dB)]; });
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(bx, by, bw, bh);
        T.cap(c, 'a white bar on black at this field, seen through the lens', bx + bw / 2, by - 14, { align: 'center', size: 11.5, color: C.text });
        T.cap(c, '◄ towards the centre of the picture        outward ►', bx + bw / 2, by + bh + 14, { align: 'center', size: 11 });
        const k = bw / pw, sx = bx + 10, sy = by + bh + 34;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + 0.1 * pw * k, sy); c.stroke();
        T.cap(c, Math.round(0.1 * pw) + ' µm', sx + 0.1 * pw * k + 8, sy, { size: 11 });
        c.fillStyle = C.muted; c.fillRect(sx + 0.1 * pw * k + 78, sy - pitch * k / 2, Math.max(1, pitch * k), Math.max(1, pitch * k));
        T.cap(c, '= one pixel of ' + pitch + ' µm', sx + 0.1 * pw * k + 90 + Math.max(1, pitch * k), sy, { size: 11 });
        ro.set('h', mmTxt(Math.abs(s.y[1])));
        ro.set('dr', (dR >= 0 ? '+' : '') + dR.toFixed(1) + ' µm');
        ro.set('db', (dB >= 0 ? '+' : '') + dB.toFixed(1) + ' µm');
        ro.set('rb', (dR - dB).toFixed(1) + ' µm');
        ro.set('px', ((dR - dB) / pitch).toFixed(1) + ' pixels');
        plot.set({ series: [{ pts: s.curve, color: C.accent, label: 'red − blue' }], hlines: [{ y: 0, color: C.faint }], vlines: [{ x: s.fld * R2D, label: 'this field', color: C.faint }], x: { label: 'field angle (°)', name: 'angle', min: 0, max: s.fmax * R2D }, y: { label: 'red − blue image height (µm)', name: 'R−B' } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the Seidel sums */
  Hyper.sim('ab-seidel', {
    title: 'The Seidel sums, surface by surface',
    blurb: `The five third-order aberration sums and the two colour sums of a lens, computed from two paraxial rays. Each coloured bar is the contribution of one surface (in micrometres of the Seidel sum); the **dark bar** is the total. A good lens is one where large positive and negative bars cancel.

**Try this**
- Singlet: every bar has the same sign, so nothing cancels — the totals are large. Move to the Cooke triplet and look at the first group: six bars of different sign adding to a small total.
- Raise the field: the groups for coma, astigmatism, field curvature, distortion and lateral colour grow (as field, field², field², field³, field); spherical aberration (S_I) and axial colour (C_I) do not move.
- Open and close the aperture: spherical aberration changes as the fourth power of the diameter, the others as their own powers.
- In the double Gauss the Petzval sum S_IV is much smaller than in the singlet: its positive and negative surfaces cancel, so the Petzval radius is −6 f instead of −1.5 f.`,
    mount(box, kit, params) {
      const T = tools(kit), O = T.O, Sy = T.Sy, S = T.S;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380 });
      const IDS = ['biconvex', 'achromat', 'cooke-triplet', 'double-gauss'];
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'Lens', options: IDS.map(id => [T.LENSES[id].label, id]), value: params.lens || 'cooke-triplet' },
        { id: 'N', label: 'Aperture (f-number)', min: 2.8, max: 16, value: params.N || 5, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'field', label: 'Field position (0 = axis, 100 = edge)', min: 0, max: 100, step: 1, value: params.field != null ? params.field : 100, unit: '%' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['s1', 'S_I spherical'], ['s2', 'S_II coma'], ['s3', 'S_III astigmatism'], ['s4', 'S_IV Petzval'], ['s5', 'S_V distortion'], ['c1', 'C_I axial colour'], ['c2', 'C_II lateral colour'], ['pz', 'Petzval radius']]);
      const KEYS = ['S1', 'S2', 'S3', 'S4', 'S5', 'C1', 'C2'], NAMES = ['S_I spherical', 'S_II coma', 'S_III astigmatism', 'S_IV Petzval', 'S_V distortion', 'C_I axial colour', 'C_II lateral colour'];
      const model = () => {
        const V = ctl.values, Ld = T.LENSES[V.lens], N = Math.max(V.N, T.nmin(V.lens));
        return T.memo('sei', [V.lens, N.toFixed(3), V.field].join('|'), () => {
          const sys = T.build(V.lens, N, 0.001), fld = V.field / 100 * Ld.fmax * D2R, sd = Sy.seidel(sys, { nm: 550, field: fld });
          const rows = []; sd.perSurface.forEach((p, i) => { const mag = KEYS.reduce((a, k) => a + Math.abs(p[k]), 0); if (!(sys.surfaces[i].R === 0 && mag < 1e-12)) rows.push({ i: i + 1, p }); });
          return { sys, sd, rows, fld };
        });
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, s = model();
        const x0 = 58, x1 = W - 10, y0 = 30, y1 = Hh - 54, nb = s.rows.length, gw = (x1 - x0) / 7;
        let mx = 1e-9; s.rows.forEach(r => KEYS.forEach(k => { mx = Math.max(mx, Math.abs(r.p[k]) * 1000); })); KEYS.forEach(k => { mx = Math.max(mx, Math.abs(s.sd[k]) * 1000); });
        const step = Hyper.niceStep ? Hyper.niceStep(2 * mx * 1.1, 6) : mx / 3, top = Math.ceil(mx * 1.08 / step) * step;
        const Y = v => (y0 + y1) / 2 - v / top * (y1 - y0) / 2;
        c.save(); c.strokeStyle = C.grid; c.fillStyle = C.muted; c.font = '11px system-ui, sans-serif'; c.textAlign = 'right'; c.textBaseline = 'middle';
        for (let v = -top; v <= top + step * 1e-6; v += step) { c.beginPath(); c.moveTo(x0, Y(v)); c.lineTo(x1, Y(v)); c.stroke(); c.fillText(kit.fmt(v, 3), x0 - 6, Y(v)); }
        c.strokeStyle = C.axis; c.lineWidth = 1.3; c.beginPath(); c.moveTo(x0, Y(0)); c.lineTo(x1, Y(0)); c.stroke(); c.restore();
        T.cap(c, 'contribution to the Seidel sum (µm)', x0, 14, { size: 11.5 });
        KEYS.forEach((k, g) => {
          const gx = x0 + g * gw, bw = Math.min(16, (gw - 14) / (nb + 2));
          s.rows.forEach((r, j) => { const v = r.p[k] * 1000, bx = gx + 6 + j * bw; c.fillStyle = C.series[(r.i - 1) % C.series.length]; c.fillRect(bx, Math.min(Y(v), Y(0)), bw - 1.5, Math.abs(Y(v) - Y(0))); });
          const tv = s.sd[k] * 1000, tx = gx + 6 + nb * bw + 4;
          c.fillStyle = C.text; c.fillRect(tx, Math.min(Y(tv), Y(0)), bw * 1.4, Math.max(1.5, Math.abs(Y(tv) - Y(0))));
          T.cap(c, NAMES[g], gx + gw / 2, y1 + 16, { align: 'center', size: 10.5 });
          T.cap(c, 'total ' + kit.fmt(tv, 3), gx + gw / 2, y1 + 31, { align: 'center', size: 10.5, color: C.text });
        });
        s.rows.forEach((r, j) => { const lx = x0 + 8 + j * 34; c.fillStyle = C.series[(r.i - 1) % C.series.length]; c.fillRect(lx, 22, 10, 8); T.cap(c, String(r.i), lx + 13, 26, { size: 10.5 }); });
        T.cap(c, '← surface number   |   dark bar = total', x0 + 12 + nb * 34, 26, { size: 10.5 });
        const sd = s.sd, fmt = (k, w) => (sd[k] * 1000).toFixed(Math.abs(sd[k] * 1000) < 10 ? 2 : 1) + ' µm' + (w ? ' = ' + (Math.abs(w) < 10 ? w.toFixed(2) : w.toFixed(1)) + ' waves' : '');
        ro.set('s1', fmt('S1', sd.W040)); ro.set('s2', fmt('S2', sd.W131)); ro.set('s3', fmt('S3', sd.W222)); ro.set('s4', fmt('S4', 0)); ro.set('s5', fmt('S5', sd.W311)); ro.set('c1', fmt('C1', 0)); ro.set('c2', fmt('C2', 0));
        ro.set('pz', Number.isFinite(sd.petzvalRadius) ? mmTxt(sd.petzvalRadius) : 'flat');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ Zernike polynomials, wavefronts and the point-spread function (local helpers) */
  const SQ3 = Math.sqrt(3), SQ5 = Math.sqrt(5), SQ6 = Math.sqrt(6), SQ8 = Math.sqrt(8);
  /* the first Zernike terms in Noll's numbering, each normalised to unit RMS over the unit circle */
  const ZERN = {
    1: () => 1,
    2: (r, t) => 2 * r * Math.cos(t), 3: (r, t) => 2 * r * Math.sin(t),
    4: r => SQ3 * (2 * r * r - 1),
    5: (r, t) => SQ6 * r * r * Math.sin(2 * t), 6: (r, t) => SQ6 * r * r * Math.cos(2 * t),
    7: (r, t) => SQ8 * (3 * r * r * r - 2 * r) * Math.sin(t), 8: (r, t) => SQ8 * (3 * r * r * r - 2 * r) * Math.cos(t),
    9: (r, t) => SQ8 * r * r * r * Math.sin(3 * t), 10: (r, t) => SQ8 * r * r * r * Math.cos(3 * t),
    11: r => SQ5 * (6 * Math.pow(r, 4) - 6 * r * r + 1)
  };
  const ZNAME = { 1: 'piston', 2: 'tilt x', 3: 'tilt y', 4: 'defocus', 5: 'astig 45°', 6: 'astig 0°', 7: 'coma y', 8: 'coma x', 9: 'trefoil y', 10: 'trefoil x', 11: 'spherical' };
  const zwave = (coef, r, t) => { let w = 0; for (const j in coef) if (coef[j]) w += coef[j] * ZERN[j](r, t); return w; };
  /* a radix-2 FFT in place */
  function fft(re, im) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = -TAU / len, wr = Math.cos(ang), wi = Math.sin(ang);
      for (let i = 0; i < n; i += len) {
        let cr = 1, ci = 0;
        for (let k = 0; k < len / 2; k++) {
          const a = i + k, b = a + len / 2, xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
          re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
          const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
        }
      }
    }
  }
  const NPUP = 32, NFFT = 256, NSHOW = 64;       // pupil samples across; FFT size (8 samples per λN); the cropped picture
  /* the point-spread function of a circular pupil with the wavefront error coef (waves RMS per Zernike term):
     intensity normalised so that a perfect lens has a peak of 1 (the Strehl ratio is then the peak) */
  function psfOf(coef) {
    const N = NFFT, re = new Float64Array(N * N), im = new Float64Array(N * N);
    let cnt = 0;
    for (let j = 0; j < NPUP; j++) for (let i = 0; i < NPUP; i++) {
      const x = (i + 0.5) / NPUP * 2 - 1, y = (j + 0.5) / NPUP * 2 - 1, r = Math.hypot(x, y);
      if (r > 1) continue;
      const ph = TAU * zwave(coef, r, Math.atan2(y, x)); re[j * N + i] = Math.cos(ph); im[j * N + i] = Math.sin(ph); cnt++;
    }
    const rr = new Float64Array(N), ii = new Float64Array(N);
    for (let j = 0; j < NPUP; j++) { for (let i = 0; i < N; i++) { rr[i] = re[j * N + i]; ii[i] = im[j * N + i]; } fft(rr, ii); for (let i = 0; i < N; i++) { re[j * N + i] = rr[i]; im[j * N + i] = ii[i]; } }
    for (let i = 0; i < N; i++) { for (let j = 0; j < N; j++) { rr[j] = re[j * N + i]; ii[j] = im[j * N + i]; } fft(rr, ii); for (let j = 0; j < N; j++) { re[j * N + i] = rr[j]; im[j * N + i] = ii[j]; } }
    const I = new Float64Array(N * N); let peak = 0, pj = 0;
    for (let k = 0; k < N * N; k++) { I[k] = (re[k] * re[k] + im[k] * im[k]) / (cnt * cnt); if (I[k] > peak) { peak = I[k]; pj = Math.floor(k / N); } }
    return { I, peak, pj };
  }
  /* statistics of the wavefront on the pupil grid, with piston and tilt removed (tilt only moves the image) */
  function wfStats(coef) {
    const c2 = Object.assign({}, coef); delete c2[2]; delete c2[3];
    let n = 0, s = 0, mn = 1e9, mx = -1e9;
    for (let j = 0; j < 40; j++) for (let i = 0; i < 40; i++) {
      const x = (i + 0.5) / 40 * 2 - 1, y = (j + 0.5) / 40 * 2 - 1, r = Math.hypot(x, y);
      if (r > 1) continue;
      const w = zwave(c2, r, Math.atan2(y, x)); n++; s += w; mn = Math.min(mn, w); mx = Math.max(mx, w);
    }
    let q = 0; for (const j in c2) if (j !== '1') q += c2[j] * c2[j];
    return { rms: Math.sqrt(q), pv: mx - mn };
  }
  const psfCache = {};
  const psfMemo = coef => { const k = JSON.stringify(coef); if (!psfCache[k]) { const keys = Object.keys(psfCache); if (keys.length > 40) delete psfCache[keys[0]]; psfCache[k] = psfOf(coef); } return psfCache[k]; };
  /* drawing: a wavefront map and a PSF as pictures made of cells */
  function drawWave(S, kit, c, x, y, size, coef, range, n) {
    const C = kit.colors(), bg = C.dark ? [20, 24, 46] : [238, 240, 247], mid = C.dark ? [70, 76, 112] : [250, 250, 252], pos = [236, 84, 72], neg = [66, 122, 238];
    S.cells(c, x, y, size, size, n, n, (u, v) => {
      const px = 2 * u - 1, py = 2 * v - 1, r = Math.hypot(px, py);
      if (r > 1) return bg;
      const t = clamp(zwave(coef, r, Math.atan2(py, px)) / range, -1, 1), a = Math.abs(t), tgt = t > 0 ? pos : neg;
      return [mid[0] + (tgt[0] - mid[0]) * a, mid[1] + (tgt[1] - mid[1]) * a, mid[2] + (tgt[2] - mid[2]) * a];
    });
  }
  function drawPsf(S, kit, c, x, y, size, psf) {
    const N = NFFT, I = psf.I;
    S.cells(c, x, y, size, size, NSHOW, NSHOW, (u, v) => {
      const ci = Math.floor(u * NSHOW), cj = Math.floor(v * NSHOW), a = ((cj - NSHOW / 2 + N) % N) * N + ((ci - NSHOW / 2 + N) % N);
      return Math.pow(clamp(I[a], 0, 1), 0.4);
    }, { rgb: [255, 236, 190] });
  }

  /* ================================================================ wavefront error and Zernike polynomials */
  Hyper.sim('ab-zernike', {
    title: 'Zernike polynomials: the wavefront and the image it makes',
    blurb: `Build a wavefront from the Zernike terms. **Left:** the wavefront error across the pupil, red where it is ahead of the perfect sphere and blue where it lags (colour range given under the picture). **Right:** the image of a point that this wavefront makes, against the perfect lens (the Airy pattern; dashed circle: first dark ring). **Bottom:** the eleven lowest terms, each as a map; the ones in use are outlined.

**Try this**
- Press *λ/14 of defocus*, then *λ/14 of coma* and *λ/14 of spherical*: the same RMS error and the same Strehl ratio (about 0.8), but three different pictures — a ring round the core, a comet, a halo.
- Add **tilt**: the pattern only slides sideways, the Strehl ratio does not change. Tilt and piston are removed from the RMS and the peak-to-valley read-outs.
- Set *defocus* to 0.072 waves RMS: the peak to valley is a quarter of a wave, 3.46 times the RMS. For coma it is about 5.6 times the RMS, for spherical aberration 3.35.
- Mix two terms and check that the RMS values add in quadrature: 0.06 and 0.08 give 0.10.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 360 });
      const TERMS = [['tilt', 2, 'Tilt x (Z2)'], ['defocus', 4, 'Defocus (Z4)'], ['astig', 6, 'Astigmatism 0° (Z6)'], ['coma', 8, 'Coma x (Z8)'], ['trefoil', 10, 'Trefoil x (Z10)'], ['spher', 11, 'Spherical aberration (Z11)']];
      const init = { coma: 0.1 };
      const ctl = kit.controls(box.side, TERMS.map(t => ({ id: t[0], label: t[2] + ', waves RMS', min: -0.3, max: 0.3, step: 0.005, value: params[t[0]] != null ? params[t[0]] : (init[t[0]] || 0), unit: 'λ' })).concat([
        { type: 'buttons', items: [{ id: 'bClear', label: 'Clear' }, { id: 'bDef', label: 'λ/14 of defocus' }, { id: 'bComa', label: 'λ/14 of coma' }, { id: 'bSph', label: 'λ/14 of spherical' }] }
      ]), id => {
        const set = (k, v) => TERMS.forEach(t => ctl.set(t[0], t[0] === k ? v : 0));
        if (id === 'bClear') set('', 0); else if (id === 'bDef') set('defocus', 1 / 14); else if (id === 'bComa') set('coma', 1 / 14); else if (id === 'bSph') set('spher', 1 / 14);
        loop.once();
      });
      const ro = kit.readout(box.side, [['rms', 'RMS wavefront error (piston, tilt removed)'], ['nm', 'In nanometres, at 550 nm'], ['pv', 'Peak to valley (piston, tilt removed)'], ['ratio', 'PV ÷ RMS'], ['S', 'Strehl ratio, from the image'], ['Se', 'exp(−(2πσ)²)'], ['v', 'Maréchal criterion (σ ≤ λ/14)']]);
      const coefOf = () => { const V = ctl.values, c = {}; TERMS.forEach(t => { if (Math.abs(V[t[0]]) > 1e-9) c[t[1]] = V[t[0]]; }); return c; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, coef = coefOf();
        const psf = psfMemo(coef), stt = wfStats(coef);
        const sz = Math.min(W * 0.34, Hh * 0.56), y0 = 28, xm = W * 0.27 - sz / 2, xp = W * 0.73 - sz / 2;
        let mx = 0; for (let a = 0; a < 24; a++) for (let b = 0; b < 12; b++) mx = Math.max(mx, Math.abs(zwave(coef, (b + 0.5) / 12, a / 24 * TAU)));
        const range = Math.max(0.25, Math.ceil(mx * 4) / 4);
        drawWave(S, kit, c, xm, y0, sz, coef, range, 56);
        c.strokeStyle = C.grid; c.strokeRect(xm, y0, sz, sz);
        T0(c, 'wavefront error across the pupil', xm + sz / 2, y0 - 12, kit);
        T0(c, 'colour range ±' + range.toFixed(2) + ' waves', xm + sz / 2, y0 + sz + 13, kit);
        drawPsf(S, kit, c, xp, y0, sz, psf);
        c.strokeStyle = C.grid; c.strokeRect(xp, y0, sz, sz);
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.setLineDash([4, 3]); c.beginPath(); c.arc(xp + sz / 2, y0 + sz / 2, 1.22 * 8 / NSHOW * sz, 0, TAU); c.stroke(); c.restore();
        T0(c, 'the image of a point (±4 λN)', xp + sz / 2, y0 - 12, kit);
        T0(c, 'peak ' + (psf.peak * 100).toFixed(0) + ' % of the perfect lens\'s', xp + sz / 2, y0 + sz + 13, kit);
        // the gallery
        const gy = y0 + sz + 36, gn = 11, gw = (W - 20) / gn, gs = Math.min(gw - 8, Hh - gy - 22);
        for (let j = 1; j <= gn; j++) {
          const gx = 10 + (j - 1) * gw + (gw - gs) / 2, cj = {}; cj[j] = 1;
          drawWave(S, kit, c, gx, gy, gs, cj, 3, 20);
          const used = Object.keys(coef).map(Number).includes(j);
          c.strokeStyle = used ? C.accent : C.grid; c.lineWidth = used ? 2.2 : 1; c.strokeRect(gx, gy, gs, gs); c.lineWidth = 1;
          kit.label(c, 'Z' + j, gx + gs / 2, gy + gs + 10, { align: 'center', size: 10.5, color: used ? C.text : C.muted });
          kit.label(c, ZNAME[j], gx + gs / 2, gy + gs + 22, { align: 'center', size: 9.5, color: C.faint });
        }
        const sg = stt.rms, Se = Math.exp(-Math.pow(TAU * sg, 2));
        ro.set('rms', sg.toFixed(3) + ' waves' + (sg > 1e-3 ? '  (λ/' + (1 / sg).toFixed(1) + ')' : ''));
        ro.set('nm', (sg * 550).toFixed(1) + ' nm');
        ro.set('pv', stt.pv.toFixed(2) + ' waves');
        ro.set('ratio', sg > 1e-4 ? (stt.pv / sg).toFixed(2) : '—');
        ro.set('S', psf.peak.toFixed(3));
        ro.set('Se', Se.toFixed(3));
        ro.set('v', sg <= 1 / 14 + 1e-9 ? 'met: diffraction-limited' : 'not met');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  function T0(c, text, x, y, kit) { kit.label(c, text, x, y, { align: 'center', size: 11.5, color: kit.colors().muted }); }

  /* ================================================================ the Strehl ratio */
  Hyper.sim('ab-strehl', {
    title: 'The Strehl ratio against the wavefront error',
    blurb: `A circular pupil with one kind of aberration, in a given amount of RMS wavefront error. The picture is the image of a point (the point-spread function) computed from that wavefront; the first graph is a cut through it against the perfect Airy pattern; the second is the **Strehl ratio** — peak brightness over the perfect peak — against the RMS error, computed (dots) and from exp(−(2πσ)²) (line).

**Try this**
- Press *Maréchal limit*: σ = λ/14 = 0.071 λ and a Strehl ratio of 0.8, with whichever aberration is chosen. Change the type: the picture changes, the number does not.
- Slide the error up. The peak sinks and the rings fill in; below a Strehl ratio of about 0.5 the formula drifts away from the computed points.
- At a quarter wave peak to valley of defocus (σ = 0.072) the Rayleigh and Maréchal criteria coincide; for coma the quarter-wave PV rule is stricter (σ = 0.044).
- Read the error in nanometres: at 550 nm, 39 nm RMS is the limit. The same lens at 400 nm has the same 39 nm, which is 0.098 λ, and a Strehl ratio of 0.69.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 300 });
      const cut = kit.plot(box.stage, { x: { label: 'distance from the ideal image point (λN)', name: 'x', min: -4, max: 4 }, y: { label: 'intensity ÷ perfect peak', name: 'I', min: 0, max: 1.05 }, series: [] }, 160);
      const curve = kit.plot(box.stage, { x: { label: 'RMS wavefront error σ (waves)', name: 'σ', min: 0, max: 0.3 }, y: { label: 'Strehl ratio', name: 'S', min: 0, max: 1.02 }, series: [] }, 170);
      const TYPES = [['Defocus (Z4)', 4], ['Astigmatism (Z6)', 6], ['Coma (Z8)', 8], ['Trefoil (Z10)', 10], ['Spherical aberration (Z11)', 11]];
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Aberration', options: TYPES, value: params.type || 8 },
        { id: 'rms', label: 'RMS wavefront error σ', min: 0, max: 0.3, step: 0.002, value: params.rms != null ? params.rms : 0.0714, unit: 'λ' },
        { id: 'nm', type: 'select', label: 'Wavelength (for the nanometres)', options: [['400 nm', 400], ['550 nm', 550], ['633 nm', 633]], value: 550 },
        { type: 'buttons', items: [{ id: 'bMar', label: 'Maréchal limit λ/14' }, { id: 'bPerf', label: 'Perfect' }] }
      ], id => { if (id === 'bMar') ctl.set('rms', 1 / 14); else if (id === 'bPerf') ctl.set('rms', 0); loop.once(); });
      const ro = kit.readout(box.side, [['s', 'Strehl ratio (from the image)'], ['se', 'exp(−(2πσ)²)'], ['nm', 'σ in nanometres'], ['pv', 'Peak to valley'], ['v', 'Diffraction-limited (S ≥ 0.8)?']]);
      const curveOf = type => {
        const pts = [];
        for (let i = 0; i <= 15; i++) { const s = 0.02 * i; pts.push([s, psfMemo({ [type]: s }).peak]); }
        return pts;
      };
      const curveCache = {};
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, V = ctl.values, type = V.type, sg = V.rms;
        const coef = sg > 1e-9 ? { [type]: sg } : {}, psf = psfMemo(coef), ideal = psfMemo({}), stt = wfStats(coef);
        const sz = Math.min(W * 0.4, Hh - 50), y0 = 30, xi = W * 0.27 - sz / 2, xr = W * 0.73 - sz / 2;
        drawPsf(S, kit, c, xi, y0, sz, psf);
        c.strokeStyle = C.grid; c.strokeRect(xi, y0, sz, sz);
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.setLineDash([4, 3]); c.beginPath(); c.arc(xi + sz / 2, y0 + sz / 2, 1.22 * 8 / NSHOW * sz, 0, TAU); c.stroke(); c.restore();
        T0(c, 'the image of a point (±4 λN) — this lens', xi + sz / 2, y0 - 12, kit);
        drawPsf(S, kit, c, xr, y0, sz, ideal);
        c.strokeStyle = C.grid; c.strokeRect(xr, y0, sz, sz);
        T0(c, 'the perfect lens, same aperture', xr + sz / 2, y0 - 12, kit);
        T0(c, 'peak ' + (psf.peak * 100).toFixed(0) + ' %', xi + sz / 2, y0 + sz + 13, kit);
        T0(c, 'peak 100 %', xr + sz / 2, y0 + sz + 13, kit);
        const N = NFFT, row = (p, j) => { const o = []; for (let u = -32; u <= 32; u++) o.push([u / 8, p.I[j * N + ((u + N) % N)]]); return o; };
        cut.set({ series: [{ pts: row(ideal, 0), color: C.muted, label: 'perfect lens', dash: true }, { pts: row(psf, psf.pj), color: C.accent, label: 'this lens' }], hlines: [{ y: 0.8, color: C.faint }] });
        const cv = curveCache[type] || (curveCache[type] = curveOf(type)), Se = Math.exp(-Math.pow(TAU * sg, 2));
        const ap = []; for (let i = 0; i <= 60; i++) { const s = 0.3 * i / 60; ap.push([s, Math.exp(-Math.pow(TAU * s, 2))]); }
        curve.set({ series: [{ pts: ap, color: C.warn, label: 'exp(−(2πσ)²)' }, { pts: cv, color: C.accent, line: false, dots: 3.5, label: 'computed from the pupil' }], marks: [{ x: sg, y: psf.peak, label: 'S = ' + psf.peak.toFixed(2), color: C.ok }], vlines: [{ x: 1 / 14, label: 'λ/14', color: C.faint }], hlines: [{ y: 0.8, color: C.faint }] });
        ro.set('s', psf.peak.toFixed(3));
        ro.set('se', Se.toFixed(3));
        ro.set('nm', (sg * V.nm).toFixed(1) + ' nm  (λ/' + (sg > 1e-4 ? (1 / sg).toFixed(1) : '∞') + ')');
        ro.set('pv', stt.pv.toFixed(2) + ' waves');
        ro.set('v', psf.peak >= 0.8 ? 'yes' : 'no');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ spot diagrams and ray fans */
  Hyper.sim('ab-spot-fan', {
    title: 'A spot diagram and its ray fans',
    blurb: `One point of the object, a grid of rays through the pupil. **Left:** the spot diagram (dashed circle: the Airy disc). **Graph below:** the two ray fans: how far each ray misses against where it crossed the pupil, in the radial plane (tangential, solid) and across it (sagittal, dashed). The buttons set up one aberration each; the shapes of the curves are the signatures.

**Try this**
- *Spherical*: a round blob and an S-shaped cubic in both fans. *Defocus*: a disc and a straight sloped line. Move the focus slider across the paraxial plane and the line tilts the other way.
- *Coma*: a comet and a parabola in the radial fan; the cross fan is nearly flat. *Astigmatism*: a smear and two straight lines of different slope; at the best focus the slopes are equal and opposite.
- *Axial colour*: three fans of the same shape but different slopes. *Lateral colour*: the three fans are shifted up and down.
- Tick *best focus*: the plane of smallest RMS spot is chosen for you.`,
    mount(box, kit, params) {
      const T = tools(kit), O = T.O, Sy = T.Sy, S = T.S;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 300 });
      const plot = kit.plot(box.stage, { x: { label: 'position in the pupil (−1 … +1)', name: 'pupil', min: -1, max: 1 }, y: { label: 'ray miss (µm)', name: 'miss' }, series: [] }, 220);
      const IDS = ['biconvex', 'best-form', 'achromat', 'cooke-triplet', 'double-gauss', 'parabolic-mirror'];
      const PRE = {
        'p-sph': { lens: 'biconvex', N: 4, field: 0, shift: 0, best: false, gap: 4, light: 'g' },
        'p-def': { lens: 'double-gauss', N: 6, field: 0, shift: 0.8, best: false, gap: 4, light: 'g' },
        'p-coma': { lens: 'parabolic-mirror', N: 5, field: 100, shift: 0, best: false, gap: 4, light: 'g' },
        'p-ast': { lens: 'best-form', N: 16, field: 70, shift: 0, best: true, gap: 0.5, light: 'g' },
        'p-ax': { lens: 'biconvex', N: 8, field: 0, shift: 0, best: false, gap: 4, light: 'rgb' },
        'p-lat': { lens: 'biconvex', N: 16, field: 60, shift: 0, best: false, gap: 30, light: 'rgb' }
      };
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'Lens', options: IDS.map(id => [T.LENSES[id].label, id]), value: params.lens || 'biconvex' },
        { id: 'N', label: 'Aperture (f-number)', min: 2.8, max: 16, value: params.N || 4, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'field', label: 'Field position (0 = axis, 100 = edge)', min: 0, max: 100, step: 1, value: params.field != null ? params.field : 0, unit: '%' },
        { id: 'shift', label: 'Focus: shift from the paraxial plane', min: -6, max: 2, step: 0.02, value: 0, unit: '% of f' },
        { id: 'best', type: 'check', label: 'Best focus (smallest RMS spot)', value: false },
        { id: 'gap', label: 'Singlets: stop in front of the lens', min: 0, max: 30, step: 1, value: 4, unit: 'mm' },
        { id: 'light', type: 'select', label: 'Light', options: [['Green, 550 nm', 'g'], ['Blue, green and red', 'rgb']], value: 'g' },
        { type: 'buttons', items: [{ id: 'p-sph', label: 'Spherical' }, { id: 'p-def', label: 'Defocus' }, { id: 'p-coma', label: 'Coma' }, { id: 'p-ast', label: 'Astigmatism' }, { id: 'p-ax', label: 'Axial colour' }, { id: 'p-lat', label: 'Lateral colour' }] }
      ], id => { if (PRE[id]) Object.keys(PRE[id]).forEach(k => ctl.set(k, PRE[id][k])); loop.once(); });
      const ro = kit.readout(box.side, [['rms', 'RMS spot radius'], ['geo', 'Largest ray miss'], ['airy', 'Airy disc radius'], ['ratio', 'RMS ÷ Airy radius'], ['ft', 'Tangential fan, at the pupil edge'], ['fs', 'Sagittal fan, at the pupil edge']]);
      const model = () => {
        const V = ctl.values, Ld = T.LENSES[V.lens], N = Math.max(V.N, T.nmin(V.lens));
        return T.memo('sf', [V.lens, N.toFixed(3), V.field, V.shift, V.best, V.lens === 'cooke-triplet' || V.lens === 'double-gauss' ? 0 : V.gap, V.light].join('|'), () => {
          const sys = T.build(V.lens, N, V.gap), par = Sy.paraxial(sys, 550), efl = Math.abs(par.efl), fld = V.field / 100 * Ld.fmax * D2R;
          const nms = V.light === 'g' ? [550] : [450, 550, 650], ig = nms.indexOf(550);
          const prs = nms.map(nm => T.pupil(sys, nm, fld, 6)), z = V.best ? T.bestZ(prs[ig]) : par.zImage + V.shift / 100 * efl, ref = T.chief(prs[ig], z) || [0, 0];
          const lands = prs.map(pr => T.land(pr, z, ref));
          const fans = nms.map(nm => {
            const pn = Sy.paraxial(sys, nm), ty = [], sa = [];
            for (let i = 0; i <= 40; i++) {
              const p = -1 + 2 * i / 40, a = Sy.trace(sys, Sy.aim(sys, 0, p, fld, pn, nm), nm), b = Sy.trace(sys, Sy.aim(sys, p, 0, fld, pn, nm), nm);
              if (a.ok) ty.push([p, (Sy.at(a, z)[1] - ref[1]) * 1000]);
              if (b.ok) sa.push([p, (Sy.at(b, z)[0] - ref[0]) * 1000]);
            }
            return { ty, sa };
          });
          return { sys, par, efl, fld, nms, lands, fans, z, N, all: T.stats([].concat.apply([], lands.map(l => l.pts))), airy: O.diff.airyRadius(550, N) * 1e3,
            fan: nms.map(nm => Sy.fan2d(sys, { nm, n: 7, field: fld, zStart: -0.25 * efl, zEnd: z })) };
        });
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, s = model(), V = ctl.values;
        const half = Math.min(W * 0.27, Hh / 2 - 22), cx = 16 + half, cy = Hh / 2 + 6;
        let need = Math.max(s.airy * 1.2, 1e-5); s.lands.forEach(L => L.pts.forEach(p => { need = Math.max(need, Math.abs(p.x), Math.abs(p.y)); }));
        const scale = half * 0.9 / need;
        s.lands.forEach((L, i) => T.spot(c, L, cx, cy, half, scale, { airy: i === 0 ? s.airy : 0, bare: i > 0, blend: s.nms.length > 1, color: () => S.nm(s.nms[i], s.nms.length > 1 && !C.dark ? 0.75 : 1) }));
        const bar = NICE.filter(x => x * scale <= 0.34 * 2 * half).pop() || NICE[0], bx = cx - half + 12, by = cy + half - 14;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + bar * scale, by); c.stroke();
        T.cap(c, um(bar, 0), bx, by - 9, { size: 10.5, color: C.text });
        T.cap(c, 'spot diagram · dashed circle: Airy disc', cx, cy - half - 12, { align: 'center', size: 11.5 });
        const x0 = 2 * half + 40, m = T.layout(st, s.sys, s.par, s.fld, -0.25 * s.efl, { left: x0, right: 12, top: 28, bottom: 28 });
        S.axis(c, m.X(-0.25 * s.efl), m.y0, m.X(Math.max(s.z, s.par.zImage) + 0.03 * s.efl));
        S.system(c, s.sys, m);
        s.nms.forEach((nm, i) => S.rays(c, s.fan[i], m, { nm, width: 1, alpha: 0.85 }));
        S.screen(c, m.X(s.z), m.y0, Math.min(m.s * T.height(s.sys) * 0.5, Hh * 0.12), {});
        T.cap(c, T.LENSES[V.lens].label + ' · field ' + (s.fld * R2D).toFixed(1) + '° · focus ' + (s.z - s.par.zImage >= 0 ? '+' : '') + (s.z - s.par.zImage).toFixed(2) + ' mm', x0, 14, { size: 11.5, align: 'left' });
        const ig = s.nms.indexOf(550), edge = (a) => { const p = a.filter(q => Math.abs(q[0]) > 0.999); return p.length ? p.map(q => q[1].toFixed(0)).join(' / ') + ' µm' : '—'; };
        ro.set('rms', um(s.all.rms)); ro.set('geo', um(s.all.geo)); ro.set('airy', um(s.airy)); ro.set('ratio', (s.all.rms / s.airy).toFixed(s.all.rms / s.airy < 10 ? 1 : 0));
        ro.set('ft', edge(s.fans[ig].ty)); ro.set('fs', edge(s.fans[ig].sa));
        const series = [];
        if (s.nms.length === 1) { series.push({ pts: s.fans[0].ty, color: C.accent, label: 'tangential fan (radial plane)' }, { pts: s.fans[0].sa, color: C.warn, label: 'sagittal fan (cross plane)', dash: true }); }
        else s.nms.forEach((nm, i) => { series.push({ pts: s.fans[i].ty, color: S.nm(nm), label: 'tangential, ' + nm + ' nm' }); series.push({ pts: s.fans[i].sa, color: S.nm(nm), dash: true, hover: false }); });
        plot.set({ series, hlines: [{ y: 0, color: C.faint }], vlines: [{ x: 0, color: C.faint }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
