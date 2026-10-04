/* HYPER-OPTICS · sims/correcting-aberrations.js — the designer's toolbox, shown with real ray tracing.
 *   ca-lens-bending   one focal length in many shapes: spherical aberration and coma against the shape factor q
 *   ca-achromat       a crown and a flint cemented together: the focus against colour, and the glass map behind it
 *   ca-doublet-forms  cemented against air-spaced, crown first or flint first: what a free surface buys
 *   ca-stop           moving the stop of a simple lens, and a lens built symmetrically about its stop
 *   ca-asphere        a conic constant and an even term on one surface: searching for the smallest spot
 *   ca-triplet        the Cooke triplet against a doublet and a singlet, and its Seidel bars surface by surface
 *   ca-petzval        the three focal surfaces and the field-flattener lens
 *   ca-tolerances     which small errors matter: one at a time and all together
 *   ca-ghosts         the double reflections between surfaces of a real lens and how bright each one is
 *   ca-optimizer      a damped-least-squares optimizer improving a triplet, and getting stuck
 * Every number comes from kit.optics (ray tracing, Seidel sums, Fresnel); every lens is drawn by kit.osym.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const f1 = (v, d) => (Number.isFinite(v) ? v.toFixed(d).replace('-', '−') : '—');
  const sgn = v => (v < 0 ? '−' : '') + Math.abs(v).toFixed(2);

  /* the spot at the plane of least RMS blur, found in closed form from the positions and slopes of the traced
     rays (a plane z is p(z) = a + b·(z − z0), so the blur is a quadratic in z). o: { nm, field, rings, z } — with
     z given the spot is taken on that plane instead. -> { pts, cx, cy, rms, geo, z, shift, n, lost } (mm) */
  function bestSpot(O, sys, o) {
    const Sy = O.sys; o = o || {};
    const nm = o.nm || 587.56, rings = o.rings || 4, par = o.par || Sy.paraxial(sys, nm), z0 = par.zImage;
    const out = { pts: [], cx: 0, cy: 0, rms: NaN, geo: NaN, z: z0, shift: 0, n: 0, lost: 0 };
    if (!Number.isFinite(z0)) return out;
    const zs = par.zs, ns = Sy.indices(sys, nm), A = [], B = [];
    const add = (px, py) => {
      const tr = Sy.trace(sys, Sy.aim(sys, px, py, o.field || 0, par, nm), nm, { zs, ns });
      if (!tr.ok || Math.abs(tr.d[2]) < 1e-9) { out.lost++; return; }
      const e = Sy.at(tr, z0);
      if (!Number.isFinite(e[0]) || !Number.isFinite(e[1])) { out.lost++; return; }
      A.push([e[0], e[1]]); B.push([tr.d[0] / tr.d[2], tr.d[1] / tr.d[2]]);
    };
    add(0, 0);
    for (let r = 1; r <= rings; r++) { const m = 6 * r; for (let j = 0; j < m; j++) { const a = 2 * Math.PI * j / m; add(r / rings * Math.cos(a), r / rings * Math.sin(a)); } }
    const n = A.length; out.n = n;
    if (!n) return out;
    let ax = 0, ay = 0, bx = 0, by = 0;
    for (let i = 0; i < n; i++) { ax += A[i][0]; ay += A[i][1]; bx += B[i][0]; by += B[i][1]; }
    ax /= n; ay /= n; bx /= n; by /= n;
    let zeta = 0;
    if (o.z != null) zeta = o.z - z0;
    else {
      let sab = 0, sbb = 0;
      for (let i = 0; i < n; i++) { const da = [A[i][0] - ax, A[i][1] - ay], db = [B[i][0] - bx, B[i][1] - by]; sab += da[0] * db[0] + da[1] * db[1]; sbb += db[0] * db[0] + db[1] * db[1]; }
      zeta = sbb > 1e-18 ? -sab / sbb : 0;
    }
    out.pts = A.map((a, i) => [a[0] + B[i][0] * zeta, a[1] + B[i][1] * zeta]);
    out.cx = ax + bx * zeta; out.cy = ay + by * zeta;
    let s2 = 0, geo = 0;
    for (const p of out.pts) { const d2 = (p[0] - out.cx) * (p[0] - out.cx) + (p[1] - out.cy) * (p[1] - out.cy); s2 += d2; geo = Math.max(geo, Math.sqrt(d2)); }
    out.rms = Math.sqrt(s2 / n); out.geo = geo; out.z = z0 + zeta; out.shift = zeta;
    return out;
  }
  /* a round number just above v, for the scale of a spot diagram */
  function niceCeil(v) { if (!(v > 0)) return 1; const e = Math.pow(10, Math.floor(Math.log10(v))), m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e; }
  /* a spot diagram in a framed box with its scale and the Airy disc, µm */
  function spotBox(kit, S, c, C, spot, cx, cy, half, airyMm, nm, title) {
    const halfMm = niceCeil(Math.max(spot.geo || 0, airyMm * 1.2) * 1.15);
    c.fillStyle = C.surface; c.fillRect(cx - half, cy - half, 2 * half, 2 * half);
    S.spot(c, spot, cx, cy, half, half / halfMm, { airy: airyMm, nm });
    kit.label(c, title, cx, cy - half - 10, { align: 'center', color: C.muted, size: 11.5 });
    kit.label(c, 'box ± ' + kit.fmt(halfMm * 1000, 2) + ' µm · dashed: Airy disc', cx, cy + half + 12, { align: 'center', color: C.faint, size: 10.5 });
  }
  /* a lens drawn with its meridional rays: one colour (nm) or several */
  function drawLens(c, S, Sy, sys, m, o) {
    S.axis(c, m.X(o.z0), m.y0, m.X(o.z1));
    S.system(c, sys, m);
    for (const nm of o.nms) S.rays(c, Sy.fan2d(sys, { nm, n: o.n || 7, field: o.field || 0, zStart: o.zStart, zEnd: o.zEnd }), m, { nm, width: o.width || 1.2 });
  }

  /* ================================================================ lens bending */
  Hyper.sim('ca-lens-bending', {
    title: 'Bending a lens: one focal length, many shapes',
    blurb: `A singlet of focal length 100 mm, traced ray by ray. The slider is the **shape factor** $q = (R_2 + R_1)/(R_2 - R_1)$: 0 is equiconvex, +1 is plano-convex with the curved side facing the beam, −1 the same lens turned round, and large positive values are menisci. The graph gives the third-order errors of every shape (in waves) and the inset shows where the rays really land, against the Airy disc. Drag the lens sideways in the picture to bend it.

**Try this**
- Press **Plano-convex, curved side first**, then **Turned round (flat side first)**: same glass, same focal length, several times the blur. The curved face must take the big bend.
- Press **Best form**: the spherical aberration is at its smallest and the coma is nearly gone. It sits near $q = 0.74$ for N-BK7.
- Change to **N-SF11**: the best form moves out to a meniscus ($q \\approx 1.2$) because a higher index bends the ray at each surface through a gentler angle.
- Set the object to **1 : 1** (at 2*f*): the best shape is now the equiconvex lens, $q = 0$, by symmetry.
- Raise the f-number to 10: whatever the shape, the errors fall steeply and the Airy disc takes over.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 420 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'shape factor q', min: -3, max: 4 }, y: { label: 'third-order error at the edge (waves)' } }, 190);
      const F = 100;
      const ctl = kit.controls(box.side, [
        { id: 'q', label: 'Shape factor q', min: -3, max: 4, step: 0.05, value: params.q != null ? params.q : 0, fmt: v => (v < 0 ? '−' : '') + Math.abs(v).toFixed(2) },
        { id: 'glass', type: 'select', label: 'Glass', options: [['N-BK7 (n = 1.517)', 'N-BK7'], ['N-SF11 (n = 1.785)', 'N-SF11'], ['Fused silica (n = 1.458)', 'fused-silica']], value: params.glass || 'N-BK7' },
        { id: 'conj', type: 'select', label: 'Object', options: [['At infinity', 'inf'], ['At 2f: 1 : 1 imaging', 'one']], value: params.conj || 'inf' },
        { id: 'N', label: 'f-number', min: 2.5, max: 10, step: 0.5, value: params.N || 4, fmt: v => 'f/' + v.toFixed(1) },
        { type: 'buttons', items: [{ id: 'best', label: 'Best form', primary: true }, { id: 'equi', label: 'Equiconvex' }, { id: 'plano', label: 'Plano-convex, curved side first' }, { id: 'flat', label: 'Turned round (flat side first)' }] }
      ], id => {
        if (id === 'best') ctl.set('q', bestQ());
        else if (id === 'equi') ctl.set('q', 0);
        else if (id === 'plano') ctl.set('q', 1);
        else if (id === 'flat') ctl.set('q', -1);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['form', 'Shape'], ['R', 'Radii R₁ / R₂'], ['best', 'Best-form q for this glass'], ['lsa', 'Longitudinal error, edge ray'], ['rms', 'RMS blur at best focus'], ['airy', 'Airy disc radius'], ['w', 'Spherical error · coma at the edge']]);
      const one = () => V.conj === 'one';
      const bestQ = () => (one() ? 0 : O.bestFormShape(O.index(V.glass, 587.56)));
      const make = q => O.design.singlet({ f: F, q, D: F / V.N, glass: V.glass, object: one() ? 2 * F : undefined });
      const fieldOf = () => (one() ? 6 : 5 * D2R);
      let cache = { key: '', pts: null };
      const curves = () => {
        const key = V.glass + '|' + V.conj + '|' + V.N;
        if (cache.key === key) return cache.pts;
        const sph = [], com = [];
        for (let i = 0; i <= 70; i++) {
          const q = -3 + i * 0.1;
          try { const sd = Sy.seidel(make(q), { field: fieldOf() }); if (Number.isFinite(sd.W040) && Number.isFinite(sd.W131)) { sph.push([q, sd.W040]); com.push([q, sd.W131]); } } catch (e) { /* skip */ }
        }
        cache = { key, pts: { sph, com } };
        return cache.pts;
      };
      const name = q => Math.abs(q + 1) < 0.06 ? 'plano-convex, flat side towards the ' + (one() ? 'object' : 'beam') : Math.abs(q) < 0.06 ? 'equiconvex' : Math.abs(q - 1) < 0.06 ? 'plano-convex, curved side towards the ' + (one() ? 'object' : 'beam') : q > 1 ? 'meniscus, convex towards the ' + (one() ? 'object' : 'beam') : q < -1 ? 'meniscus, concave towards the ' + (one() ? 'object' : 'beam') : 'biconvex';
      let lensX = -99, dragFrom = null;
      kit.drag(st, { hover: true, hit: p => (Math.abs(p.x - lensX) < 36 ? 'lens' : null), start: (w, p) => { dragFrom = { x: p.x, q: V.q }; }, move: (w, p) => { if (!dragFrom) return; ctl.set('q', Math.max(-3, Math.min(4, Math.round((dragFrom.q + (p.x - dragFrom.x) / 40) * 20) / 20))); loop.once(); } });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const sys = make(V.q), par = Sy.paraxial(sys), D = F / V.N;
        const half = Math.min(64, Hh * 0.2), nm = 550;
        const z0 = one() ? -2 * F - 8 : -26, z1 = par.zImage + 8;
        const m = S.map(st, z0, z1, Math.max(D / 2 * 1.5, one() ? 14 : 6), { left: 14, right: 2 * half + 34, top: 24, bottom: 20 });
        lensX = m.X(0) + 6;
        drawLens(c, S, Sy, sys, m, { z0, z1, nms: [nm], n: 9, zStart: one() ? undefined : -24 });
        S.screen(c, m.X(par.zImage), m.y0, Math.max(10, m.s * D * 0.5), { label: 'image' });
        const bs = bestSpot(O, sys, { nm, rings: 5 }), airy = O.diff.airyRadius(nm, par.fnoWorking || V.N) * 1e3;
        c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(m.X(par.zImage), m.y0); c.lineTo(W - 2 * half - 20, Hh / 2 - half); c.moveTo(m.X(par.zImage), m.y0); c.lineTo(W - 2 * half - 20, Hh / 2 + half); c.stroke(); c.restore();
        spotBox(kit, S, c, C, bs, W - half - 16, Hh / 2, half, airy, nm, 'the focus, best plane');
        kit.label(c, 'q = ' + sgn(V.q) + ' · ' + name(V.q), 12, 14, { color: C.text, weight: 650, size: 12.5 });
        const cv = curves();
        const here = Sy.seidel(sys, { field: fieldOf() });
        plot.set({
          series: [{ pts: cv.sph, label: 'spherical aberration', color: C.series[0] }, { pts: cv.com, label: 'coma (signed)', color: C.series[1] }],
          vlines: [{ x: V.q, color: C.accent, label: 'now' }, { x: bestQ(), color: C.ok, label: 'best form' }],
          hlines: [{ y: 0 }]
        });
        const lsa = Sy.lsa(sys, 587.56, 10), le = lsa.length ? lsa[lsa.length - 1][1] : NaN;
        ro.set('form', name(V.q));
        ro.set('R', (Math.abs(sys.surfaces[0].R) < 1e-9 ? 'flat' : f1(sys.surfaces[0].R, 1) + ' mm') + ' / ' + (Math.abs(sys.surfaces[1].R) < 1e-9 ? 'flat' : f1(sys.surfaces[1].R, 1) + ' mm'));
        ro.set('best', 'q = ' + sgn(bestQ()) + (one() ? ' (symmetry)' : '  =  2(n² − 1)/(n + 2)'));
        ro.set('lsa', f1(le, 3) + ' mm' + (le < 0 ? ' (marginal rays focus short)' : ''));
        ro.set('rms', f1(bs.rms * 1000, 1) + ' µm');
        ro.set('airy', f1(airy * 1000, 1) + ' µm');
        ro.set('w', f1(here.W040, 1) + ' waves · ' + f1(here.W131, 1) + ' waves');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the achromatic doublet, and the glass map */
  const CROWNS = [['N-BK7 (V = 64.2)', 'N-BK7'], ['N-K5 (V = 59.5)', 'N-K5'], ['N-BAK4 (V = 56.0)', 'N-BAK4'], ['N-SK16 (V = 60.3)', 'N-SK16'], ['N-FK51A, an ED glass (V = 84.5)', 'N-FK51A'], ['Fluorite, CaF₂ (V = 95)', 'CaF2'], ['Fused silica (V = 67.8)', 'fused-silica']];
  const FLINTS = [['F2 (V = 36.4)', 'F2'], ['N-SF5 (V = 32.2)', 'N-SF5'], ['N-SF10 (V = 28.5)', 'N-SF10'], ['N-SF11 (V = 25.7)', 'N-SF11'], ['N-SF6 (V = 25.4)', 'N-SF6'], ['N-LAK9, a lanthanum crown (V = 54.7)', 'N-LAK9']];
  const SHORT = { 'N-BK7': 'BK7', 'N-K5': 'K5', 'N-BAK4': 'BaK4', 'N-SK16': 'SK16', 'N-LAK9': 'LaK9', 'N-FK51A': 'FK51A', 'CaF2': 'CaF₂', 'fused-silica': 'silica', 'F2': 'F2', 'N-SF5': 'SF5', 'N-SF10': 'SF10', 'N-SF11': 'SF11', 'N-SF6': 'SF6' };
  Hyper.sim('ca-achromat', {
    title: 'The achromatic doublet: two glasses, one focus for two colours',
    blurb: `A positive crown lens and a negative flint lens cemented together, f = 100 mm. The picture shows three colours of light crossing the axis, with the focus magnified at the right; the graph gives the focus position against wavelength for a singlet of the crown glass and for the doublet. Switch the view to the **glass map** to see why the doublet still has a small leftover — the *secondary spectrum* — and how a glass pair can shrink it.

**Try this**
- Compare **Singlet** and **Doublet**: the singlet spreads blue, green and red along about 2 mm of axis; the doublet brings red and blue together and leaves only a shallow curve.
- Change the flint from F2 to N-SF11: the powers of the two lenses change because the two glasses now differ more in Abbe number (the thin-lens rule $\\varphi_1 = \\varphi V_1/(V_1 - V_2)$), but the secondary spectrum barely moves.
- Pair the ED glass **N-FK51A** or **fluorite** with F2 and the leftover roughly halves; choose **N-LAK9** as the partner and it falls to a sixth or less. The dashed curve is a plain N-BK7 + F2 doublet for comparison.
- Open the **glass map**: the secondary spectrum is $f\\,\\Delta P/\\Delta V$, the slope of the line joining the two glasses. Glasses on the *normal line* give a steep, unavoidable leftover.
- Stop down to f/10 and watch the grey band: the focus spread only matters while it is wider than the depth of focus.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys, LN = O.LINES;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300, maxH: 430 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'wavelength (nm)', min: 400, max: 700 }, y: { label: 'focus shift from the d line (mm)' } }, 190);
      const F = 100, MAPG = ['N-BK7', 'N-K5', 'N-BAK4', 'N-SK16', 'N-LAK9', 'N-FK51A', 'CaF2', 'fused-silica', 'F2', 'N-SF5', 'N-SF10', 'N-SF11', 'N-SF6'];
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['The lens and its focus', 'rays'], ['The glass map (partial dispersion)', 'map']], value: params.view || 'rays' },
        { id: 'kind', type: 'select', label: 'Lens', options: [['Doublet: crown + flint', 'doublet'], ['Singlet of the crown glass', 'singlet']], value: params.kind || 'doublet' },
        { id: 'crown', type: 'select', label: 'Crown (positive lens)', options: CROWNS, value: params.crown || 'N-BK7' },
        { id: 'flint', type: 'select', label: 'Flint (negative lens)', options: FLINTS, value: params.flint || 'N-SF5' },
        { id: 'N', label: 'f-number', min: 3, max: 10, step: 0.5, value: params.N || 5, fmt: v => 'f/' + v.toFixed(1) },
        { id: 'sing', type: 'check', label: 'Show the singlet curve in the graph', value: params.sing != null ? !!params.sing : true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pair', 'Abbe numbers V₁ · V₂'], ['pow', 'Powers: crown · flint'], ['fc', 'Focus F to C: singlet · doublet'], ['sec', 'Focus spread 436–656 nm'], ['est', 'Thin-lens estimate f·ΔP/ΔV'], ['rms', 'RMS blur at best focus']]);
      const glassData = {};
      const pg = id => glassData[id] || (glassData[id] = (() => { const n = x => O.index(id, x), a = O.abbe(id); return { V: a.vd, P: (n(LN.g) - n(LN.F)) / (n(LN.F) - n(LN.C)), nd: a.nd }; })());
      const cache = {};
      const doublet = (crown, flint, N) => {
        const key = crown + '|' + flint + '|' + N;
        if (!(key in cache)) { cache[key] = null; try { if (pg(crown).V - pg(flint).V > 15) cache[key] = bestBend(O, crown, flint, N); } catch (e) { cache[key] = null; } }
        return cache[key];
      };
      const singlet = (crown, N) => { const key = 's|' + crown + '|' + N; if (!(key in cache)) cache[key] = O.design.singlet({ f: F, q: O.bestFormShape(O.index(crown, 587.56)), D: F / N, glass: crown }); return cache[key]; };
      const WL = []; for (let w = 400; w <= 700; w += 10) WL.push(w);
      const curve = sys => Sy.chromaticShift(sys, WL).map(a => [a[0], a[1]]);
      const spread = sys => { const sh = Sy.chromaticShift(sys, [436, 486.13, 546.07, 587.56, 656.27]).map(a => a[1]); return Math.max.apply(null, sh) - Math.min.apply(null, sh); };
      // a magnified window on the focus: z and y have their own scales, so the thin cone of light is visible
      const insetMap = (zc, span, yh, ix, iy, iw, ih) => { const sx = (iw - 8) / (2.2 * span), sy = (ih - 8) / (2 * yh); return { X: z => ix + iw / 2 + (z - zc) * sx, Y: y => iy + ih / 2 - y * sy, s: sx, y0: iy + ih / 2, k: sy / sx }; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const sS = singlet(V.crown, V.N), sD = doublet(V.crown, V.flint, V.N);
        const A = pg(V.crown), B = pg(V.flint), ok = !!sD;
        const sys = (V.kind === 'doublet' && ok) ? sD : sS, par = Sy.paraxial(sys);
        const sh = sys === sD ? curve(sD) : curve(sS);
        if (V.view === 'rays') {
          const iw = Math.min(250, W * 0.36), ih = Math.min(Hh - 56, 250), ix = W - iw - 12, iy = 30;
          const m = S.map(st, -22, par.zImage + 6, F / V.N / 2 * 1.45, { left: 12, right: iw + 40, top: 30, bottom: 22 });
          S.axis(c, m.X(-22), m.y0, m.X(par.zImage + 6));
          S.system(c, sys, m);
          for (const nm of [460, 550, 650]) S.rays(c, Sy.fan2d(sys, { nm, n: 5, zStart: -20 }), m, { nm, width: 1.1 });
          S.screen(c, m.X(par.zImage), m.y0, m.s * F / V.N * 0.3, { label: 'image plane' });
          // the focus, magnified: the three colours crossing the axis at their own places
          const zs = sh.map(a => a[1]), span = Math.max(0.25, 1.15 * Math.max(Math.abs(Math.min.apply(null, zs)), Math.abs(Math.max.apply(null, zs))));
          const yh = span / (2 * V.N) * 1.25, mi = insetMap(par.zImage, span, yh, ix, iy, iw, ih);
          c.save(); c.fillStyle = C.surface; c.fillRect(ix, iy, iw, ih); c.beginPath(); c.rect(ix, iy, iw, ih); c.clip();
          for (const nm of [460, 550, 650]) S.rays(c, Sy.fan2d(sys, { nm, n: 7, zStart: -20, zEnd: par.zImage + span * 1.1 }), mi, { nm, width: 1.2 });
          c.restore(); c.strokeStyle = C.grid; c.strokeRect(ix, iy, iw, ih);
          kit.label(c, 'the focus, magnified: blue 460 · green 550 · red 650 nm', ix + iw / 2, iy - 10, { align: 'center', color: C.muted, size: 11 });
          kit.label(c, 'axis shown ' + f1(span * 2.2, 2) + ' mm long · sideways scale × ' + Math.round(mi.k), ix + iw / 2, iy + ih + 12, { align: 'center', color: C.faint, size: 10.5 });
          kit.label(c, (sys === sD ? 'Doublet: ' + SHORT[V.crown] + ' + ' + SHORT[V.flint] : 'Singlet: ' + SHORT[V.crown]) + (V.kind === 'doublet' && !ok ? ' — these glasses are too alike to make a doublet' : ''), 12, 14, { color: C.text, weight: 650, size: 12.5 });
        } else {
          const L = 62, R = 22, T = 34, Bt = 42, w = W - L - R, h = Hh - T - Bt;
          const X = v => L + (100 - v) / 80 * w, Y = p => T + h - (p - 0.47) / 0.15 * h;
          c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
          for (const v of [100, 80, 60, 40, 20]) { c.moveTo(X(v), T); c.lineTo(X(v), T + h); }
          for (const p of [0.5, 0.55, 0.6]) { c.moveTo(L, Y(p)); c.lineTo(L + w, Y(p)); }
          c.stroke(); c.strokeStyle = C.axis; c.strokeRect(L, T, w, h); c.restore();
          for (const v of [100, 80, 60, 40, 20]) kit.label(c, String(v), X(v), T + h + 13, { align: 'center', color: C.muted, size: 11 });
          for (const p of [0.5, 0.55, 0.6]) kit.label(c, p.toFixed(2), L - 6, Y(p), { align: 'right', color: C.muted, size: 11 });
          kit.label(c, 'Abbe number V  (low dispersion on the left)', L + w / 2, T + h + 30, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, 'relative partial dispersion P(g,F)', 12, T - 14, { color: C.muted, size: 11.5 });
          // the normal line P = 0.6438 − 0.001682 V
          c.save(); c.strokeStyle = C.faint; c.setLineDash([6, 4]); c.lineWidth = 1.4; c.beginPath(); c.moveTo(X(100), Y(0.6438 - 0.1682)); c.lineTo(X(20), Y(0.6438 - 0.03364)); c.stroke(); c.restore();
          kit.label(c, 'normal line', X(30), Y(0.6438 - 0.001682 * 30) - 14, { align: 'center', color: C.faint, size: 11 });
          for (const id of MAPG) { const g = pg(id); kit.dot(c, X(g.V), Y(g.P), 4, C.series[(['N-FK51A', 'CaF2'].indexOf(id) >= 0) ? 2 : 0]); kit.label(c, SHORT[id], X(g.V) + 7, Y(g.P) - 7, { color: C.muted, size: 11 }); }
          c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath(); c.moveTo(X(A.V), Y(A.P)); c.lineTo(X(B.V), Y(B.P)); c.stroke(); c.restore();
          kit.dot(c, X(A.V), Y(A.P), 6.5, C.accent); kit.dot(c, X(B.V), Y(B.P), 6.5, C.accent);
          const slope = Math.abs(A.V - B.V) > 1e-6 ? (A.P - B.P) / (A.V - B.V) : NaN;
          kit.label(c, 'ΔP/ΔV = ' + f1(slope * 1000, 2) + ' × 10⁻³ per unit V  →  focus spread ≈ ' + f1(Math.abs(slope) * F, 3) + ' mm at f = 100 mm', L + w / 2, T + 12, { align: 'center', color: C.text, weight: 650, size: 12 });
        }
        // the graph
        const series = [];
        if (V.sing) series.push({ pts: curve(sS), label: 'singlet, ' + SHORT[V.crown], color: C.series[1] });
        if (ok) series.push({ pts: curve(sD), label: 'doublet, ' + SHORT[V.crown] + ' + ' + SHORT[V.flint], color: C.series[0], width: 2.4 });
        const ref = (V.crown !== 'N-BK7' || V.flint !== 'F2') ? doublet('N-BK7', 'F2', V.N) : null;
        if (ref) series.push({ pts: curve(ref), label: 'plain N-BK7 + F2 doublet', color: C.series[4], dash: [5, 4] });
        const dof = 2 * 0.00055 * V.N * V.N;
        plot.set({ series, hlines: [{ y: dof, label: '± quarter-wave depth of focus' }, { y: -dof }] });
        const fcS = Sy.chromaticShift(sS, [486.13, 656.27]), fcD = ok ? Sy.chromaticShift(sD, [486.13, 656.27]) : null;
        const bs = bestSpot(O, sys, { rings: 4 });
        ro.set('pair', f1(A.V, 1) + ' · ' + f1(B.V, 1));
        ro.set('pow', ok ? '+' + f1(10 * A.V / (A.V - B.V), 2) + ' D · ' + f1(-10 * B.V / (A.V - B.V), 2) + ' D  (total 10 D)' : 'no achromat possible');
        ro.set('fc', f1(Math.abs(fcS[0][1] - fcS[1][1]), 3) + ' mm · ' + (fcD ? f1(Math.abs(fcD[0][1] - fcD[1][1]), 3) + ' mm' : '—'));
        ro.set('sec', ok ? f1(spread(sD), 3) + ' mm  (singlet ' + f1(spread(sS), 2) + ' mm)' : '—');
        ro.set('est', Math.abs(A.V - B.V) > 1e-6 ? f1(Math.abs((A.P - B.P) / (A.V - B.V)) * F, 3) + ' mm (g to C line)' : '—');
        ro.set('rms', f1(bs.rms * 1000, 1) + ' µm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cemented against air-spaced */
  /* a crown + flint doublet of focal length 100 mm whose element powers keep the F and C foci together (the crown
     power is trimmed for the thickness). p: { crown, flint, flintFirst, q1 (shape factor of the front element),
     air (a 1 mm air gap), mis (f·(c3 − c2): the two faces of the gap need not match), N } */
  function buildDoublet(O, p) {
    const Sy = O.sys, F = 100, LN = O.LINES;
    const A = O.abbe(p.crown), B = O.abbe(p.flint), D = F / p.N, ff = !!p.flintFirst;
    const Pc = A.vd / (A.vd - B.vd) / F, Pf = -B.vd / (A.vd - B.vd) / F;
    const g1 = ff ? p.flint : p.crown, g2 = ff ? p.crown : p.flint, a1 = ff ? B : A, a2 = ff ? A : B;
    const t1 = Math.max(3.5, 0.2 * D), t2 = Math.max(2, 0.1 * D), c1f = (p.q1 + 1) / 2;
    const mk = (sc, e) => {
      const P1 = (ff ? Pf : Pc) * (1 + e), P2 = 1 / F - P1;
      const k1 = P1 / (a1.nd - 1), k2 = P2 / (a2.nd - 1);
      const c1 = c1f * k1, c2 = c1 - k1, c3 = c2 + (p.air ? p.mis / F : 0), c4 = c3 - k2;
      const R = c => (Math.abs(c) < 1e-12 ? 0 : sc / c);
      const s = [{ R: R(c1), t: t1, n: g1, sd: D / 2, stop: true }];
      if (p.air) s.push({ R: R(c2), t: 1, n: 1, sd: D / 2 }, { R: R(c3), t: t2, n: g2, sd: D / 2 });
      else s.push({ R: R(c2), t: t2, n: g2, sd: D / 2 });
      s.push({ R: R(c4), n: 1, sd: D / 2 });
      return { name: 'Doublet', surfaces: s };
    };
    const fit = e => { let sc = 1, sys = mk(1, e); for (let i = 0; i < 6; i++) { const ef = Sy.paraxial(sys).efl; if (!Number.isFinite(ef) || Math.abs(ef) < 1e-9) break; sc *= F / ef; sys = mk(sc, e); } return sys; };
    const fc = sys => Sy.paraxial(sys, LN.F).zImage - Sy.paraxial(sys, LN.C).zImage;
    let e0 = 0, e1 = 0.05, v0 = fc(fit(e0)), v1 = fc(fit(e1));
    for (let i = 0; i < 8 && Number.isFinite(v1) && Math.abs(v1) > 1e-5; i++) {
      const den = v1 - v0; if (!Number.isFinite(den) || Math.abs(den) < 1e-12) break;
      const e2 = e1 - v1 * (e1 - e0) / den; if (!Number.isFinite(e2) || Math.abs(e2) > 1) break;
      e0 = e1; v0 = v1; e1 = e2; v1 = fc(fit(e1));
    }
    const sys = fit(Number.isFinite(v1) && Math.abs(e1) <= 1 ? e1 : 0);
    sys.valid = sys.surfaces.every(s => !s.R || Math.abs(s.R) > s.sd * 1.08) && Number.isFinite(Sy.paraxial(sys).efl);
    return sys;
  }
  /* the cemented doublet of a pair of glasses whose bend gives the least third-order spherical aberration */
  function bestBend(O, crown, flint, N) {
    const Sy = O.sys; let bq = null;
    const w = q => { const s = buildDoublet(O, { crown, flint, q1: q, air: false, N, mis: 0 }); if (!s.valid) return null; const v = Math.abs(Sy.seidel(s).W040); return Number.isFinite(v) ? v : null; };
    for (let q = -2; q <= 1.5001; q += 0.05) { const v = w(q); if (v != null && (!bq || v < bq.w)) bq = { q, w: v }; }
    if (!bq) return null;
    for (let q = bq.q - 0.05; q <= bq.q + 0.0501; q += 0.005) { const v = w(q); if (v != null && v < bq.w) bq = { q, w: v }; }
    return buildDoublet(O, { crown, flint, q1: bq.q, air: false, N, mis: 0 });
  }
  const PAIRS = [['N-BK7 + F2: the classic pair', 'N-BK7|F2'], ['N-K5 + F2', 'N-K5|F2'], ['N-BK7 + N-SF5', 'N-BK7|N-SF5']];
  Hyper.sim('ca-doublet-forms', {
    title: 'Cemented or air-spaced: what a free surface buys',
    blurb: `A crown and a flint lens of total focal length 100 mm, with the chromatic correction kept the same whatever you do. Bend the front element with the slider and watch two errors against the bend: **spherical aberration** and **coma**. In a *cemented* doublet there is one free number, the bend, and it can set one of them to zero. Make the pair *air-spaced* and the two faces of the gap no longer have to match: a second free number, which can set the other to zero.

**Try this**
- Cemented, crown first (the Fraunhofer form): press **Zero spherical aberration**. On axis the spot is a few micrometres — but look at the 3° spot: a comet, coma left over.
- Press **Zero spherical and coma**: the lens becomes air-spaced, both curves cross zero together and the 3° spot shrinks to about half. The price: two more surfaces to reflect light, and a gap to align.
- Choose **flint first** (the Steinheil form): the program finds a different bend, with a different balance of the same errors and the same colour correction.
- Pick **N-BK7 + N-SF5**: with this pair a single bend of a *cemented* lens already brings both curves close to zero. The glass pair is itself a free number, which is why a designer's glass catalogue matters.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 420 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'bend of the front element, shape factor q₁', min: -3.5, max: 1.5 }, y: { label: 'third-order error at the edge (waves)', min: -20, max: 20 } }, 190);
      const FIELD = 3 * D2R;
      const ctl = kit.controls(box.side, [
        { id: 'pair', type: 'select', label: 'Glass pair', options: PAIRS, value: params.pair || 'N-BK7|F2' },
        { id: 'first', type: 'select', label: 'Which glass is in front', options: [['Crown first: Fraunhofer form', 'crown'], ['Flint first: Steinheil form', 'flint']], value: params.first || 'crown' },
        { id: 'air', type: 'select', label: 'The two lenses are', options: [['Cemented', 'cemented'], ['Air-spaced (1 mm gap)', 'air']], value: params.air || 'cemented' },
        { id: 'q1', label: 'Bend of the front element q₁', min: -3.5, max: 1.5, step: 0.02, value: params.q1 != null ? params.q1 : -0.1, fmt: v => (v < 0 ? '−' : '') + Math.abs(v).toFixed(2) },
        { id: 'mis', label: 'Gap faces: mismatch f·(c₃ − c₂)', min: -0.3, max: 0.3, step: 0.005, value: params.mis != null ? params.mis : 0, fmt: v => (v < 0 ? '−' : '') + Math.abs(v).toFixed(3) },
        { id: 'N', label: 'f-number', min: 3, max: 8, step: 0.5, value: params.N || 5, fmt: v => 'f/' + v.toFixed(1) },
        { type: 'buttons', items: [{ id: 'z1', label: 'Zero spherical aberration', primary: true }, { id: 'z2', label: 'Zero spherical and coma' }] }
      ], id => {
        if (id === 'z1' || id === 'first' || id === 'pair') solve1();
        else if (id === 'z2') solve2();
        ctl.show('mis', V.air === 'air');
        loop.once();
      });
      const V = ctl.values;
      ctl.show('mis', V.air === 'air');
      const ro = kit.readout(box.side, [['form', 'Form'], ['R', 'Radii (mm)'], ['w', 'Spherical error · coma (3°)'], ['fc', 'Focus F to C'], ['rms', 'RMS blur: on axis · 3°'], ['note', 'Note']]);
      const pr = () => { const a = V.pair.split('|'); return { crown: a[0], flint: a[1], flintFirst: V.first === 'flint', air: V.air === 'air', N: V.N }; };
      const build = (q1, mis) => buildDoublet(O, Object.assign(pr(), { q1, mis }));
      const wOf = sys => { try { const sd = Sy.seidel(sys, { field: FIELD }); return [sd.W040, sd.W131]; } catch (e) { return [NaN, NaN]; } };
      const solve1 = () => {
        let best = null, prevV = null, prevQ = null; const roots = [];
        for (let q = -3.5; q <= 1.5001; q += 0.02) {
          const sys = build(q, V.mis); if (!sys.valid) { prevV = null; continue; }
          const w = wOf(sys)[0]; if (!Number.isFinite(w)) { prevV = null; continue; }
          if (!best || Math.abs(w) < best.a) best = { q, a: Math.abs(w) };
          if (prevV != null && prevV * w < 0) roots.push(prevQ + (q - prevQ) * Math.abs(prevV) / (Math.abs(prevV) + Math.abs(w)));
          prevV = w; prevQ = q;
        }
        const pick = roots.length ? roots.reduce((a, b) => (Math.abs(b - V.q1) < Math.abs(a - V.q1) ? b : a)) : (best ? best.q : V.q1);
        ctl.set('q1', Math.round(pick * 50) / 50);
        return roots.length > 0;
      };
      const solve2 = () => {
        if (V.air !== 'air') { ctl.set('air', 'air'); }
        let q = V.q1, m = V.mis, good = false;
        const fn = (a, b) => { const s = build(a, b); return s.valid ? wOf(s) : [NaN, NaN]; };
        for (let it = 0; it < 40; it++) {
          const f0 = fn(q, m); if (!f0.every(Number.isFinite)) break;
          if (Math.abs(f0[0]) < 0.02 && Math.abs(f0[1]) < 0.02) { good = true; break; }
          const h = 1e-3, fa = fn(q + h, m), fb = fn(q, m + h * 0.1);
          if (!fa.every(Number.isFinite) || !fb.every(Number.isFinite)) break;
          const J = [[(fa[0] - f0[0]) / h, (fb[0] - f0[0]) / (h * 0.1)], [(fa[1] - f0[1]) / h, (fb[1] - f0[1]) / (h * 0.1)]];
          const det = J[0][0] * J[1][1] - J[0][1] * J[1][0]; if (Math.abs(det) < 1e-12) break;
          const dq = (f0[0] * J[1][1] - f0[1] * J[0][1]) / det, dm = (J[0][0] * f0[1] - J[1][0] * f0[0]) / det;
          const nq = q - 0.8 * dq, nm = m - 0.8 * dm;
          if (!Number.isFinite(nq) || !Number.isFinite(nm) || nq < -3.5 || nq > 1.5 || nm < -0.3 || nm > 0.3) break;
          q = nq; m = nm;
        }
        ctl.set('q1', Math.round(q * 50) / 50); ctl.set('mis', Math.round(m * 200) / 200);
        return good;
      };
      let cache = { key: '', sph: [], com: [] };
      const curves = () => {
        const key = [V.pair, V.first, V.air, V.mis, V.N].join('|');
        if (cache.key === key) return cache;
        const sph = [], com = [];
        for (let i = 0; i <= 50; i++) {
          const q = -3.5 + i * 0.1, sys = build(q, V.mis); if (!sys.valid) continue;
          const w = wOf(sys); if (!w.every(Number.isFinite)) continue;
          sph.push([q, Math.max(-20, Math.min(20, w[0]))]); com.push([q, Math.max(-20, Math.min(20, w[1]))]);
        }
        cache = { key, sph, com };
        return cache;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const sys = build(V.q1, V.mis), D = 100 / V.N, half = Math.min(46, Hh * 0.15);
        const cv = curves();
        plot.set({ series: [{ pts: cv.sph, label: 'spherical aberration', color: C.series[0] }, { pts: cv.com, label: 'coma at 3°', color: C.series[1] }], vlines: [{ x: V.q1, color: C.accent, label: 'now' }], hlines: [{ y: 0 }] });
        if (!sys.valid) {
          kit.label(c, 'This bend needs a surface steeper than the lens is wide — pick another shape.', W / 2, Hh / 2, { align: 'center', color: C.warn, weight: 650 });
          for (const k of ['form', 'R', 'w', 'fc', 'rms']) ro.set(k, '—');
          ro.set('note', 'unusable shape'); return;
        }
        const par = Sy.paraxial(sys);
        const m = S.map(st, -20, par.zImage + 6, D / 2 * 1.5, { left: 12, right: 2 * half + 40, top: 30, bottom: 20 });
        S.axis(c, m.X(-20), m.y0, m.X(par.zImage + 6));
        S.system(c, sys, m);
        S.rays(c, Sy.fan2d(sys, { nm: 550, n: 7, zStart: -18 }), m, { nm: 550, width: 1.2 });
        S.rays(c, Sy.fan2d(sys, { nm: 550, n: 7, zStart: -18, field: FIELD }), m, { nm: 550, width: 1, alpha: 0.5 });
        S.screen(c, m.X(par.zImage), m.y0, m.s * D * 0.6, { label: 'image plane' });
        const a0 = bestSpot(O, sys, { nm: 550, rings: 5 }), a1 = bestSpot(O, sys, { nm: 550, rings: 5, field: FIELD });
        const airy = O.diff.airyRadius(550, V.N) * 1e3, hm = niceCeil(Math.max(a0.geo || 0, a1.geo || 0, airy * 1.2) * 1.15);
        const sx = W - half - 16;
        for (const [sp, cy, title] of [[a0, Hh * 0.28, 'on axis'], [a1, Hh * 0.72, '3° off axis']]) {
          c.fillStyle = C.surface; c.fillRect(sx - half, cy - half, 2 * half, 2 * half);
          S.spot(c, sp, sx, cy, half, half / hm, { airy, nm: 550 });
          kit.label(c, title, sx, cy - half - 8, { align: 'center', color: C.muted, size: 11.5 });
        }
        kit.label(c, 'both boxes ± ' + kit.fmt(hm * 1000, 2) + ' µm', sx, Hh - 8, { align: 'center', color: C.faint, size: 10.5 });
        kit.label(c, (V.first === 'crown' ? 'Fraunhofer form: crown in front' : 'Steinheil form: flint in front') + ' · ' + (V.air === 'air' ? 'air-spaced' : 'cemented'), 12, 14, { color: C.text, weight: 650, size: 12.5 });
        const w = wOf(sys), fcs = Sy.chromaticShift(sys, [486.13, 656.27]);
        ro.set('form', (V.first === 'crown' ? 'crown first' : 'flint first') + ', ' + (V.air === 'air' ? 'air-spaced' : 'cemented'));
        ro.set('R', sys.surfaces.map(s => (Math.abs(s.R) < 1e-9 ? '∞' : f1(s.R, 1))).join(' / '));
        ro.set('w', f1(w[0], 2) + ' · ' + f1(w[1], 2) + ' waves');
        ro.set('fc', f1(Math.abs(fcs[0][1] - fcs[1][1]), 3) + ' mm');
        ro.set('rms', f1(a0.rms * 1000, 1) + ' · ' + f1(a1.rms * 1000, 1) + ' µm');
        ro.set('note', Math.abs(w[0]) < 0.25 && Math.abs(w[1]) < 0.25 ? 'spherical aberration and coma both near zero' : Math.abs(w[0]) < 0.25 ? 'spherical aberration near zero; coma is not' : 'drag q₁ or press a button');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the stop, and symmetry about it */
  /* keep the beam the paraxial pupil says it is: an explicit entrance-pupil size and a stop just wider than the
     paraxial beam, so that rays aimed at the pupil's edge are not clipped by pupil aberration */
  function fixStop(O, sys) { const par = O.sys.paraxial(sys), si = O.sys.stopIndex(sys); sys.epd = par.epd; sys.surfaces[si].sd *= 1.06; return sys; }
  /* a singlet of f = 100 mm with its stop d mm in front of it (d < 0: behind it). asph: a conic constant on the
     more curved face that removes the third-order spherical aberration */
  function stopSystem(O, q, d, asph) {
    const Sy = O.sys, D = 20, lens = O.design.singlet({ f: 100, q, D, t: 4 }), par = Sy.paraxial(lens);
    const L = lens.surfaces.map(s => Object.assign({}, s, { stop: false, sd: 20 }));
    if (asph) {
      const i = Math.abs(L[0].R) && (!L[1].R || Math.abs(L[0].R) < Math.abs(L[1].R)) ? 0 : 1;
      if (L[i].R) {
        const k0 = L[i].k || 0; L[i].k = 0; const a = Sy.seidel({ surfaces: L.map(s => Object.assign({}, s, { stop: s === L[0] })) }).S1;
        L[i].k = 1; const b = Sy.seidel({ surfaces: L.map(s => Object.assign({}, s, { stop: s === L[0] })) }).S1;
        L[i].k = Math.abs(b - a) > 1e-14 ? -a / (b - a) : k0;
      }
    }
    let s;
    if (d >= 0) s = [{ R: 0, t: d, n: 1, sd: D / 2, stop: true }].concat(L);
    else { L[1].t = -d; s = L.concat([{ R: 0, n: 1, sd: (D / 2) * (1 - (-d) / par.bfd), stop: true }]); }
    return fixStop(O, { name: 'A singlet and its stop', surfaces: s });
  }
  /* two identical menisci about a central stop: the rear half a mirror image, the same lens scaled, or a copy */
  function symSystem(O, rear) {
    const R1 = 40, R2 = 90, T = 4, G = 12, SD = 14, g = 'N-BK7', k = rear === 'scaled' ? 1.3 : 1;
    const front = [{ R: R1, t: T, n: g, sd: SD }, { R: R2, t: G, n: 1, sd: SD }, { R: 0, t: G * k, n: 1, sd: 4, stop: true }];
    const back = rear === 'copy' ? [{ R: R1, t: T, n: g, sd: SD }, { R: R2, n: 1, sd: SD }] : [{ R: -R2 * k, t: T * k, n: g, sd: SD }, { R: -R1 * k, n: 1, sd: SD }];
    return { name: 'Two menisci about a stop', surfaces: front.concat(back) };
  }
  /* the object distance that gives magnification m (bisection on the paraxial image) */
  function objectFor(O, base, m) {
    let lo = 40, hi = 9000;
    for (let i = 0; i < 60; i++) { const mid = Math.sqrt(lo * hi), mm = O.sys.paraxial(Object.assign({}, base, { object: mid })).m; if (mm < m) lo = mid; else hi = mid; }
    return Math.sqrt(lo * hi);
  }
  Hyper.sim('ca-stop', {
    title: 'The stop: moving it, and building a lens symmetric about it',
    blurb: `Two experiments on one idea. In **Moving the stop** a single lens of focal length 100 mm has its aperture stop slid along the axis; the graph gives the coma and the astigmatism at the field angle you choose. In **Symmetry about the stop** two identical menisci face each other across a central stop, and the rear half can be a mirror image, a scaled copy, or a copy facing the same way; the graph is the ray fan of an off-axis point, where coma shows as a lopsided parabola.

**Try this**
- *Moving the stop*: slide the stop (or drag it in the picture). The coma is a straight line in the stop position and the astigmatism a curve: a different position cancels each.
- Turn the lens to **plano-convex, flat side first** and put the stop 30 mm in front: coma and astigmatism almost vanish together, and what is left of the blur is spherical aberration.
- Tick **aspheric face**, which takes the spherical aberration out: now the coma no longer changes at all as the stop moves. A stop shift changes coma only in proportion to the spherical aberration; astigmatism still moves.
- *Symmetry*: with the rear half a **mirror image** at magnification −1, coma, distortion and lateral colour fall to almost nothing, while the spherical aberration and the field curvature of the two halves add.
- Change the rear half to **a copy facing the same way**, or scale it by 1.3: the coma returns, because the halves no longer cancel.
- Move the magnification away from −1: a symmetric lens is exactly corrected only at 1 : 1, yet stays good over a wide range.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 420 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'distance of the stop in front of the lens (mm)', min: -30, max: 40 }, y: { label: 'error at the field edge (waves)' } }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Explore', options: [['Moving the stop', 'shift'], ['Symmetry about the stop', 'sym']], value: params.mode || 'shift' },
        { id: 'lens', type: 'select', label: 'Lens shape', options: [['Equiconvex (q = 0)', 0], ['Best form (q = 0.74)', 0.74], ['Plano-convex, flat side first (q = −1)', -1], ['Meniscus (q = 2.2)', 2.2]], value: params.lens != null ? params.lens : 0.74 },
        { id: 'd', label: 'Stop in front of the lens', min: -30, max: 40, step: 1, value: params.d != null ? params.d : 0, unit: 'mm' },
        { id: 'asph', type: 'check', label: 'Aspheric face: remove spherical aberration', value: !!params.asph },
        { id: 'fld', label: 'Field angle', min: 0, max: 12, step: 0.5, value: params.fld != null ? params.fld : 8, unit: '°' },
        { id: 'rear', type: 'select', label: 'Rear half', options: [['A mirror image of the front half', 'mirror'], ['The same, scaled by 1.3', 'scaled'], ['A copy facing the same way', 'copy']], value: params.rear || 'mirror' },
        { id: 'm', label: 'Magnification', min: -3, max: -0.3, step: 0.05, value: params.m != null ? params.m : -1, fmt: v => '−' + Math.abs(v).toFixed(2) + '×' },
        { id: 'hi', label: 'Image height of the off-axis point', min: 0, max: 8, step: 0.5, value: params.hi != null ? params.hi : 6, unit: 'mm' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const vis = () => { const sh = V.mode === 'shift'; for (const k of ['lens', 'd', 'asph', 'fld']) ctl.show(k, sh); for (const k of ['rear', 'm', 'hi']) ctl.show(k, !sh); roA.show(sh); roB.show(!sh); };
      const roA = kit.readout(box.side, [['a', 'Stop'], ['b', 'Coma at the field'], ['c', 'Astigmatism at the field'], ['d', 'Spherical aberration'], ['e', 'RMS blur: axis · field']]);
      const roB = kit.readout(box.side, [['a', 'Coma: traced · front half · rear half'], ['b', 'Distortion'], ['c', 'Lateral colour, F to C'], ['d', 'Spherical aberration: front · rear'], ['e', 'Petzval curvature: front · rear']]);
      vis();
      const lam = 587.56e-6;
      let last = null;
      kit.drag(st, { hover: true, hit: p => (V.mode === 'shift' && last && Math.abs(p.x - last.xs) < 10 ? 'stop' : null), move: (w, p) => { if (!last) return; ctl.set('d', Math.max(-30, Math.min(40, Math.round(-(last.m.Z(p.x) - last.zl)))), true); } });
      const comaTri = (sys, fld, par, z) => {
        const ray = py => Sy.trace(sys, Sy.aim(sys, 0, py, fld, par, 550), 550), a = ray(1), b = ray(-1), c0 = ray(0);
        if (!a.ok || !b.ok || !c0.ok) return NaN;
        return ((Sy.at(a, z)[1] + Sy.at(b, z)[1]) / 2 - Sy.at(c0, z)[1]) * 1000;
      };
      let cache = { key: '', w131: [], w222: [] };
      const curves = () => {
        const key = [V.lens, V.asph, V.fld].join('|');
        if (cache.key === key) return cache;
        const w131 = [], w222 = [];
        for (let d = -30; d <= 40; d += 2.5) { try { const sd = Sy.seidel(stopSystem(O, V.lens, d, V.asph), { field: V.fld * D2R }); if (Number.isFinite(sd.W131) && Number.isFinite(sd.W222)) { w131.push([d, sd.W131]); w222.push([d, sd.W222]); } } catch (e) { /* skip */ } }
        cache = { key, w131, w222 };
        return cache;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (V.mode === 'shift') {
          const sys = stopSystem(O, V.lens, V.d, V.asph), par = Sy.paraxial(sys), fld = V.fld * D2R, half = Math.min(46, Hh * 0.15);
          const zl = V.d >= 0 ? V.d : 0, z0 = zl - 34, z1 = zl + par.bfd + (V.d < 0 ? -V.d : 0) + 14;
          const m = S.map(st, z0, z1, 24, { left: 12, right: 2 * half + 40, top: 30, bottom: 20 });
          const xs = m.X(V.d >= 0 ? 0 : -V.d); last = { m, zl, xs };
          S.axis(c, m.X(z0), m.y0, m.X(z1));
          S.system(c, sys, m, { stop: false });
          const si = Sy.stopIndex(sys);
          S.stop(c, xs, m.y0, 24 * m.s, sys.surfaces[si].sd / 1.06 * m.s * 0.999 + 0.0001, { label: 'stop' });
          S.rays(c, Sy.fan2d(sys, { nm: 550, n: 7, zStart: z0 + 2 }), m, { nm: 550, width: 1.1, alpha: 0.7 });
          S.rays(c, Sy.fan2d(sys, { nm: 550, n: 7, zStart: z0 + 2, field: fld }), m, { nm: 550, width: 1.2 });
          const chief = Sy.fan2d(sys, { nm: 550, n: 1, zStart: z0 + 2, field: fld });
          S.rays(c, chief, m, { color: C.warn, width: 1.4 });
          const a0 = bestSpot(O, sys, { nm: 550, rings: 5, par }), a1 = bestSpot(O, sys, { nm: 550, rings: 5, par, field: fld });
          const airy = O.diff.airyRadius(550, par.fno) * 1e3, hm = niceCeil(Math.max(a0.geo || 0, a1.geo || 0, airy * 1.2) * 1.15), sx = W - half - 16;
          for (const [sp, cy, t] of [[a0, Hh * 0.28, 'on axis'], [a1, Hh * 0.72, V.fld + '° off axis']]) { c.fillStyle = C.surface; c.fillRect(sx - half, cy - half, 2 * half, 2 * half); S.spot(c, sp, sx, cy, half, half / hm, { airy, nm: 550 }); kit.label(c, t, sx, cy - half - 8, { align: 'center', color: C.muted, size: 11.5 }); }
          kit.label(c, 'both boxes ± ' + kit.fmt(hm * 1000, 2) + ' µm', sx, Hh - 8, { align: 'center', color: C.faint, size: 10.5 });
          kit.label(c, 'orange: the chief ray, through the middle of the stop', 12, 14, { color: C.muted, size: 11.5 });
          const cv = curves(), here = Sy.seidel(sys, { field: fld });
          plot.set({ x: { label: 'distance of the stop in front of the lens (mm; negative = behind)', min: -30, max: 40 }, y: { label: 'error at the field edge (waves)' }, series: [{ pts: cv.w131, label: 'coma', color: C.series[0] }, { pts: cv.w222, label: 'astigmatism', color: C.series[1] }], vlines: [{ x: V.d, color: C.accent, label: 'now' }], hlines: [{ y: 0 }] });
          roA.set('a', V.d >= 0 ? f1(V.d, 0) + ' mm in front of the lens' : f1(-V.d, 0) + ' mm behind the lens');
          roA.set('b', f1(here.W131, 2) + ' waves');
          roA.set('c', f1(here.W222, 2) + ' waves');
          roA.set('d', f1(here.W040, 2) + ' waves');
          roA.set('e', f1(a0.rms * 1000, 1) + ' · ' + f1(a1.rms * 1000, 1) + ' µm');
        } else {
          last = null;
          const base = symSystem(O, V.rear), so = objectFor(O, base, V.m);
          const sys = fixStop(O, Object.assign({}, base, { object: so, surfaces: base.surfaces.map(s => Object.assign({}, s)) })), par = Sy.paraxial(sys);
          const mAct = par.m, hObj = V.hi / Math.max(0.05, Math.abs(mAct)), hlf = Math.min(50, Hh * 0.16);
          const z0 = -34, z1 = par.zImage + 12;
          const m = S.map(st, z0, z1, 24, { left: 12, right: 12, top: 30, bottom: 20 });
          S.axis(c, m.X(z0), m.y0, m.X(z1));
          S.system(c, sys, m);
          S.rays(c, Sy.fan2d(sys, { nm: 550, n: 7, field: hObj }), m, { nm: 550, width: 1.2 });
          S.rays(c, Sy.fan2d(sys, { nm: 550, n: 1, field: hObj }), m, { color: C.warn, width: 1.4 });
          S.screen(c, m.X(par.zImage), m.y0, Math.max(10, m.s * (V.hi + 3)), { label: 'image plane' });
          kit.label(c, 'object ' + f1(so, 0) + ' mm in front · magnification ' + f1(mAct, 2) + '×', 12, 14, { color: C.text, weight: 650, size: 12.5 });
          // the ray fan, and the three errors that a symmetric lens cancels
          let fan = []; try { fan = Sy.rayFan(sys, { field: hObj, n: 21 }).map(a => [a[0], a[1] * 1000]); } catch (e) { fan = []; }
          plot.set({ x: { label: 'position in the pupil (−1 … +1)', min: -1, max: 1 }, y: { label: 'ray error across the image (µm)' }, series: [{ pts: fan, label: 'tangential ray fan', color: C.series[0] }], vlines: [], hlines: [{ y: 0 }] });
          const coma = comaTri(sys, hObj, par, par.zImage);
          const chief = Sy.trace(sys, Sy.aim(sys, 0, 0, hObj, par, 587.56), 587.56), cF = Sy.trace(sys, Sy.aim(sys, 0, 0, hObj, par, 587.56), 486.13), cC = Sy.trace(sys, Sy.aim(sys, 0, 0, hObj, par, 587.56), 656.27);
          const ok = chief.ok && cF.ok && cC.ok, yd = ok ? Sy.at(chief, par.zImage)[1] : NaN, hp = mAct * hObj;
          const sd = Sy.seidel(sys, { field: hObj }), fr = sd.perSurface.slice(0, 2), bk = sd.perSurface.slice(3);
          const sum = (a, k) => a.reduce((s, x) => s + x[k], 0);
          roB.set('a', f1(coma, 1) + ' µm · ' + f1(sum(fr, 'S2') / 2 / lam, 2) + ' · ' + f1(sum(bk, 'S2') / 2 / lam, 2) + ' waves');
          roB.set('b', (hp ? f1((yd - hp) / hp * 100, 3) : '0.000') + ' %');
          roB.set('c', (ok ? f1((Sy.at(cF, par.zImage)[1] - Sy.at(cC, par.zImage)[1]) * 1000, 2) : '—') + ' µm');
          roB.set('d', f1(sum(fr, 'S1') / 8 / lam, 2) + ' · ' + f1(sum(bk, 'S1') / 8 / lam, 2) + ' waves (they add)');
          roB.set('e', f1(sum(fr, 'S4') / 4 / lam, 2) + ' · ' + f1(sum(bk, 'S4') / 4 / lam, 2) + ' waves (they add)');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ an aspheric surface */
  Hyper.sim('ca-asphere', {
    title: 'An aspheric surface: searching for the smallest spot',
    blurb: `A plano-convex lens of focal length 100 mm whose **curved face** is given a conic constant $k$ (and, if you like, a $r^4$ term). The upper graph is the RMS blur against $k$ on a logarithmic scale; the lower one is where rays at each height in the aperture cross the axis. The inset is the focus against the Airy disc.

**Try this**
- At $k = 0$ the surface is a sphere: about 45 µm of blur at f/4. Slide $k$ towards −0.6 and the blur falls below a micron — far smaller than the Airy disc. Press **Find the best k** to let the program scan for it.
- **Turn the lens round**, flat face towards the beam. The best conic constant jumps to $k = -n^2$ (−2.30 for N-BK7): a hyperboloid, which focuses a distant on-axis point perfectly at *every* aperture, even f/2.5.
- Use the $r^4$ term instead of $k$: a sphere plus a small $A_4$ also flattens the curve, but only near the aperture it was tuned for.
- Pick N-SF11: the ideal $k$ becomes −3.19, because it is $-n^2$.
- Look at the Airy disc: once the blur is smaller than it, a better surface buys nothing — diffraction takes over.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 280, maxH: 400 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plotK = kit.plot(gb, { x: { label: 'conic constant k', min: -4, max: 1 }, y: { label: 'RMS blur (µm)', log: true } }, 150);
      const plotL = kit.plot(gb, { x: { label: 'height in the aperture (mm)' }, y: { label: 'axis crossing − paraxial focus (mm)' } }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'orient', type: 'select', label: 'Lens', options: [['Curved face towards the beam', 'curved'], ['Flat face towards the beam', 'flat']], value: params.orient || 'curved' },
        { id: 'k', label: 'Conic constant k', min: -4, max: 1, step: 0.01, value: params.k != null ? params.k : 0, fmt: v => (v < 0 ? '−' : '') + Math.abs(v).toFixed(2) },
        { id: 'a4', label: 'Fourth-order term A₄ (× 10⁻⁷ mm⁻³)', min: -20, max: 20, step: 0.5, value: params.a4 != null ? params.a4 : 0 },
        { id: 'N', label: 'f-number', min: 2.5, max: 8, step: 0.5, value: params.N || 4, fmt: v => 'f/' + v.toFixed(1) },
        { id: 'glass', type: 'select', label: 'Glass', options: [['N-BK7 (n = 1.517)', 'N-BK7'], ['N-SF11 (n = 1.785)', 'N-SF11']], value: params.glass || 'N-BK7' },
        { type: 'buttons', items: [{ id: 'best', label: 'Find the best k', primary: true }, { id: 'hyp', label: 'Flat face first, k = −n²' }, { id: 'sph', label: 'Back to a sphere' }] }
      ], id => {
        if (id === 'best') searchK();
        else if (id === 'hyp') { ctl.set('orient', 'flat'); ctl.set('a4', 0); ctl.set('k', Math.max(-4, -Math.pow(O.index(V.glass, 587.56), 2))); }
        else if (id === 'sph') { ctl.set('k', 0); ctl.set('a4', 0); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['surf', 'Aspheric surface'], ['n2', '−n² for this glass'], ['rms', 'RMS blur at best focus'], ['airy', 'Airy disc radius'], ['ratio', 'Blur ÷ Airy radius'], ['edge', 'Edge ray crosses']]);
      const make = (k, a4) => {
        const s = O.design.singlet({ f: 100, q: V.orient === 'curved' ? 1 : -1, D: 100 / V.N, glass: V.glass });
        const sf = s.surfaces[V.orient === 'curved' ? 0 : 1]; sf.k = k; if (a4) sf.A = [a4 * 1e-7];
        return s;
      };
      const rmsAt = k => { try { const b = bestSpot(O, make(k, V.a4), { nm: 587.56, rings: 4 }); return b.n >= 20 ? b.rms * 1000 : NaN; } catch (e) { return NaN; } };
      const searchK = () => {
        let best = null;
        for (let k = -4; k <= 1.0001; k += 0.02) { const r = rmsAt(k); if (Number.isFinite(r) && (!best || r < best.r)) best = { k, r }; }
        if (!best) return;
        let a = best.k - 0.02, b = best.k + 0.02; const g = (Math.sqrt(5) - 1) / 2;
        for (let i = 0; i < 24; i++) { const x1 = b - g * (b - a), x2 = a + g * (b - a); const r1 = rmsAt(x1), r2 = rmsAt(x2); if (!Number.isFinite(r1) || r1 < r2) b = x2; else a = x1; }
        ctl.set('k', Math.max(-4, Math.min(1, Math.round((a + b) / 2 * 100) / 100)));
      };
      let cache = { key: '', pts: [], ref: [] };
      const curve = () => {
        const key = [V.orient, V.glass, V.N, V.a4].join('|');
        if (cache.key === key) return cache;
        const pts = []; for (let k = -4; k <= 1.0001; k += 0.1) { const r = rmsAt(k); if (Number.isFinite(r) && r > 0) pts.push([Math.round(k * 10) / 10, Math.max(r, 0.01)]); }
        cache = { key, pts };
        return cache;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, D = 100 / V.N, half = Math.min(60, Hh * 0.2), nm = 587.56;
        const sys = make(V.k, V.a4), par = Sy.paraxial(sys);
        const m = S.map(st, -24, par.zImage + 8, Math.max(D / 2 * 1.4, 6), { left: 12, right: 2 * half + 38, top: 26, bottom: 18 });
        S.axis(c, m.X(-24), m.y0, m.X(par.zImage + 8));
        S.system(c, sys, m);
        S.rays(c, Sy.fan2d(sys, { nm, n: 9, zStart: -22 }), m, { nm, width: 1.2 });
        S.screen(c, m.X(par.zImage), m.y0, Math.max(10, m.s * D * 0.4), { label: 'image' });
        const bs = bestSpot(O, sys, { nm, rings: 5 }), airy = O.diff.airyRadius(nm, par.fno) * 1e3;
        c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(m.X(par.zImage), m.y0); c.lineTo(W - 2 * half - 20, Hh / 2 - half); c.moveTo(m.X(par.zImage), m.y0); c.lineTo(W - 2 * half - 20, Hh / 2 + half); c.stroke(); c.restore();
        spotBox(kit, S, c, C, bs, W - half - 16, Hh / 2, half, airy, nm, 'the focus, best plane');
        kit.label(c, (V.orient === 'curved' ? 'Curved face first' : 'Flat face first') + ' · the ' + (V.orient === 'curved' ? 'front' : 'rear') + ' face is aspheric', 12, 14, { color: C.text, weight: 650, size: 12.5 });
        const cv = curve(), here = rmsAt(V.k);
        plotK.set({ series: [{ pts: cv.pts, label: 'RMS blur', color: C.series[0] }], vlines: [{ x: V.k, color: C.accent, label: 'now' }, { x: -Math.pow(O.index(V.glass, 587.56), 2), color: C.ok, label: '−n²' }], hlines: [{ y: airy * 1000, label: 'Airy radius' }] });
        const sph = make(0, 0), l0 = Sy.lsa(sph, nm, 20), l1 = Sy.lsa(sys, nm, 20), R = D / 2;
        plotL.set({ series: [{ pts: l0.map(a => [a[0] * R, a[1]]), label: 'sphere', color: C.series[1], dash: [5, 4] }, { pts: l1.map(a => [a[0] * R, a[1]]), label: 'this surface', color: C.series[0], width: 2.4 }], hlines: [{ y: 0 }] });
        ro.set('surf', 'k = ' + f1(V.k, 2) + (V.a4 ? ', A₄ = ' + f1(V.a4, 1) + ' × 10⁻⁷' : ''));
        ro.set('n2', f1(-Math.pow(O.index(V.glass, 587.56), 2), 2));
        ro.set('rms', f1(bs.rms * 1000, bs.rms * 1000 < 10 ? 2 : 1) + ' µm');
        ro.set('airy', f1(airy * 1000, 2) + ' µm');
        ro.set('ratio', f1(bs.rms * 1000 / (airy * 1000), 2) + (bs.rms < 0.5 * airy ? ' — diffraction-limited' : ''));
        ro.set('edge', l1.length ? f1(l1[l1.length - 1][1], 3) + ' mm from the paraxial focus' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the Cooke triplet */
  /* three f = 50 mm, f/5 lenses for the comparison: the triplet from the library, a cemented doublet, a singlet */
  function tripletKit(O, kind, sp1, sp2) {
    const Sy = O.sys; let sys;
    if (kind === 'triplet') { sys = O.lens('cooke-triplet'); sys.surfaces[1].t += sp1; sys.surfaces[3].t += sp2; }
    else if (kind === 'doublet') { sys = Sy.withFocal(O.lens('achromat'), 50); sys.surfaces.forEach(s => { s.sd = 9.5; }); sys.surfaces[0].sd = 5.4; sys.epd = 10; }
    else { sys = O.design.singlet({ f: 50, q: O.bestFormShape(1.5168), D: 10, t: 2.5 }); sys.surfaces.forEach(s => { s.sd = 9.5; }); sys.surfaces[0].sd = 5.4; sys.epd = 10; }
    sys.field = 20 * D2R;
    return sys;
  }
  Hyper.sim('ca-triplet', {
    title: 'Why three lenses: the Cooke triplet against a doublet and a singlet',
    blurb: `Three lenses of the same focal length (50 mm) and the same aperture (f/5), traced at the field angle you choose. The coloured bars at the bottom are the **third-order errors that each surface contributes**, in waves, with the total as the dark outline: in the triplet every large bar is matched by an opposite one, and that cancellation across six surfaces is the design. The graph gives the RMS blur at best focus all the way out to 20°.

**Try this**
- Look at the bars for the **triplet**: each surface adds big errors of both signs; only the totals are small. Switch to the doublet or the singlet and the totals are the bars themselves.
- Compare the three spots at 14°: the triplet is a small cluster, the doublet a large one, the singlet a big comet.
- In the graph the singlet's blur grows quickly with the field and the doublet's follows; the triplet stays low out to 20°.
- Move the **air spaces** of the triplet by a millimetre or so: the focal length shifts, and the first gap trades on-axis against off-axis blur while the second soon spoils the off-axis spot. Those two gaps, with the bending of the lenses, are the "free numbers" the designer spends.
- Look at the Petzval read-out: positive and negative lenses spaced apart give the triplet a much flatter field than any single lens (whose Petzval radius is −*nf*).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 380, maxH: 520 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'field angle (°)', min: 0, max: 20 }, y: { label: 'RMS blur at best focus (µm)', log: true } }, 180);
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Lens', options: [['Cooke triplet: + − +', 'triplet'], ['Cemented doublet', 'doublet'], ['Singlet, best form', 'singlet']], value: params.kind || 'triplet' },
        { id: 'fld', label: 'Field angle', min: 0, max: 20, step: 1, value: params.fld != null ? params.fld : 14, unit: '°' },
        { id: 'sp1', label: 'Air space 1 changed by', min: -1.5, max: 1.5, step: 0.1, value: 0, unit: 'mm' },
        { id: 'sp2', label: 'Air space 2 changed by', min: -1.5, max: 1.5, step: 0.1, value: 0, unit: 'mm' }
      ], () => { for (const k of ['sp1', 'sp2']) ctl.show(k, V.kind === 'triplet'); loop.once(); });
      const V = ctl.values;
      for (const k of ['sp1', 'sp2']) ctl.show(k, V.kind === 'triplet');
      const ro = kit.readout(box.side, [['efl', 'Focal length · f-number'], ['pz', 'Petzval radius'], ['rms', 'RMS blur: axis · field'], ['el', 'Elements · surfaces'], ['tot', 'Edge errors (waves): sph · coma · astig']]);
      const lam = 587.56e-6, NAMES = ['spherical', 'coma', 'astigmatism', 'Petzval', 'distortion'];
      let cache = { key: '', series: [] };
      const curves = () => {
        const key = V.sp1 + '|' + V.sp2;
        if (cache.key === key) return cache.series;
        const series = [];
        for (const [kind, label, ci] of [['singlet', 'singlet', 1], ['doublet', 'cemented doublet', 4], ['triplet', 'Cooke triplet', 0]]) {
          const sys = tripletKit(O, kind, V.sp1, V.sp2), pts = [];
          for (let f = 0; f <= 20; f += 2) { const b = bestSpot(O, sys, { rings: 3, field: f * D2R }); if (b.n >= 10 && b.rms > 0) pts.push([f, Math.max(0.5, b.rms * 1000)]); }
          series.push({ pts, label, ci });
        }
        cache = { key, series };
        return series;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, nm = 550;
        const sys = tripletKit(O, V.kind, V.sp1, V.sp2), par = Sy.paraxial(sys), fld = V.fld * D2R, half = Math.min(42, Hh * 0.11);
        const topH = Hh * 0.56, zs = par.zs;
        // the lens with an on-axis and an off-axis bundle
        const m = S.map({ W, H: topH }, -10, par.zImage + 6, 20, { left: 12, right: 2 * half + 40, top: 26, bottom: 12 });
        S.axis(c, m.X(-10), m.y0, m.X(par.zImage + 6));
        S.system(c, sys, m, { stop: true });
        S.rays(c, Sy.fan2d(sys, { nm, n: 7, zStart: -8 }), m, { nm, width: 1.1, alpha: 0.7 });
        S.rays(c, Sy.fan2d(sys, { nm, n: 7, zStart: -8, field: fld }), m, { nm, width: 1.2 });
        S.screen(c, m.X(par.zImage), m.y0, Math.max(8, m.s * Math.tan(20 * D2R) * par.efl * 0.9), { label: '' });
        kit.label(c, V.kind === 'triplet' ? 'Cooke triplet, f = ' + f1(par.efl, 1) + ' mm' : V.kind === 'doublet' ? 'Cemented doublet, f = ' + f1(par.efl, 1) + ' mm' : 'Singlet, f = ' + f1(par.efl, 1) + ' mm', 12, 14, { color: C.text, weight: 650, size: 12.5 });
        // two spot diagrams, one scale
        const a0 = bestSpot(O, sys, { nm, rings: 5 }), a1 = bestSpot(O, sys, { nm, rings: 5, field: fld }), airy = O.diff.airyRadius(nm, par.fno) * 1e3;
        const hm = niceCeil(Math.max(a0.geo || 0, a1.geo || 0, airy * 1.2) * 1.15), sx = W - half - 16;
        for (const [sp, cy, t] of [[a0, topH * 0.3, 'on axis'], [a1, topH * 0.76, V.fld + '° off axis']]) { c.fillStyle = C.surface; c.fillRect(sx - half, cy - half, 2 * half, 2 * half); S.spot(c, sp, sx, cy, half, half / hm, { airy, nm }); kit.label(c, t, sx, cy - half - 8, { align: 'center', color: C.muted, size: 11 }); }
        kit.label(c, 'boxes ± ' + kit.fmt(hm * 1000, 2) + ' µm', sx, topH + 2, { align: 'center', color: C.faint, size: 10.5 });
        // the Seidel bars, surface by surface
        const sd = Sy.seidel(sys, { field: fld }), per = sd.perSurface, ns = per.length;
        const conv = [e => e.S1 / 8 / lam, e => e.S2 / 2 / lam, e => e.S3 / 2 / lam, e => e.S4 / 4 / lam, e => e.S5 / 2 / lam];
        const tot = [sd.S1, sd.S2, sd.S3, sd.S4, sd.S5].map((v, i) => conv[i]({ S1: v, S2: v, S3: v, S4: v, S5: v }));
        let amp = 1e-9; for (let g = 0; g < 5; g++) { for (const e of per) amp = Math.max(amp, Math.abs(conv[g](e))); amp = Math.max(amp, Math.abs(tot[g])); }
        const bx0 = 14, bw = W - 28, by0 = topH + 18, bh = Hh - by0 - 26, yc = by0 + bh / 2, gw = bw / 5, bar = Math.max(4, Math.min(24, (gw - 14) / (ns + 1)));
        c.save(); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(bx0, yc); c.lineTo(bx0 + bw, yc); c.stroke(); c.restore();
        for (let g = 0; g < 5; g++) {
          const gx = bx0 + g * gw + (gw - bar * (ns + 1)) / 2;
          for (let i = 0; i < ns; i++) { const v = conv[g](per[i]), hgt = v / amp * (bh / 2 - 6); c.fillStyle = C.series[i % C.series.length]; c.fillRect(gx + i * bar, hgt >= 0 ? yc - hgt : yc, bar - 1.5, Math.abs(hgt)); }
          const th = tot[g] / amp * (bh / 2 - 6); c.save(); c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(gx + ns * bar + 1, th >= 0 ? yc - th : yc, bar - 3, Math.max(1, Math.abs(th))); c.restore();
          kit.label(c, NAMES[g], bx0 + g * gw + gw / 2, by0 + bh + 12, { align: 'center', color: C.muted, size: 11.5 });
        }
        kit.label(c, 'what each surface adds (coloured, 1 … ' + ns + ' from the front) and the total (outline) — waves at ' + V.fld + '°, full scale ± ' + f1(amp, 1), bx0, by0 - 8, { color: C.muted, size: 11 });
        plot.set({ series: curves().map(s => ({ pts: s.pts, label: s.label, color: C.series[s.ci % C.series.length] })), vlines: [{ x: V.fld, color: C.accent, label: 'now' }] });
        ro.set('efl', f1(par.efl, 2) + ' mm · f/' + f1(par.fno, 1));
        const sdp = fld > 0.02 ? sd : Sy.seidel(sys, { field: 5 * D2R });
        ro.set('pz', f1(sdp.petzvalRadius, 0) + ' mm  (' + f1(sdp.petzvalRadius / par.efl, 1) + ' × f)');
        ro.set('rms', f1(a0.rms * 1000, 1) + ' · ' + f1(a1.rms * 1000, 1) + ' µm');
        ro.set('el', Sy.elements(sys).length + ' · ' + ns);
        ro.set('tot', f1(tot[0], 1) + ' · ' + f1(tot[1], 1) + ' · ' + f1(tot[2], 1));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the field flattener */
  /* a singlet of f = 100 mm behind its stop, with an optional negative plano-concave flattener 4 mm before the sensor */
  function flatSystem(O, q, d, Rf) {
    const Sy = O.sys, lens = O.design.singlet({ f: 100, q, D: 14, t: 3 }), bfd = Sy.paraxial(lens).bfd, tFF = 2, gap = 4;
    const L = lens.surfaces.map(s => Object.assign({}, s, { stop: false, sd: 14 }));
    const s = [{ R: 0, t: d, n: 1, sd: 7, stop: true }].concat(L);
    if (Rf) { s[2].t = bfd - gap - tFF; s.push({ R: 0, t: tFF, n: 'N-BK7', sd: 24 }, { R: Rf, n: 1, sd: 24 }); }
    return fixStop(O, { name: 'A lens and a field flattener', surfaces: s });
  }
  /* the tangential and sagittal foci of a thin pencil about the chief ray at a field angle, relative to the plane z0 */
  function pencilFoci(O, sys, field, par) {
    const Sy = O.sys, eps = 0.01, z0 = par.zImage;
    const ray = (px, py) => Sy.trace(sys, Sy.aim(sys, px, py, field, par, 550), 550);
    const c = ray(0, 0), a = ray(0, eps), b = ray(0, -eps), x = ray(eps, 0);
    if (!c.ok || !a.ok || !b.ok || !x.ok) return null;
    const mA = a.d[1] / a.d[2], mB = b.d[1] / b.d[2];
    if (Math.abs(mA - mB) < 1e-12 || Math.abs(x.d[0]) < 1e-12) return null;
    const zT = (b.p[1] - a.p[1] + mA * a.p[2] - mB * b.p[2]) / (mA - mB), zS = x.p[2] - x.p[0] * x.d[2] / x.d[0];
    const h = Sy.at(c, z0)[1];
    return Number.isFinite(zT) && Number.isFinite(zS) ? { zT: zT - z0, zS: zS - z0, h } : null;
  }
  Hyper.sim('ca-petzval', {
    title: 'Flattening the field: Petzval surface, astigmatism and a field-flattener lens',
    blurb: `A singlet of focal length 100 mm, with its stop in front of it and a flat sensor behind. The graph shows where a thin pencil of light from each field angle comes to a focus: the **tangential** and **sagittal** foci, and the **Petzval surface** they are both measured from (the tangential focus lies three times as far from it as the sagittal one). Horizontal is the focus shift from the flat sensor, vertical the height in the image.

**Try this**
- With the stop at the lens, all three surfaces curve towards the lens: the sensor sees sharp images only on axis.
- Slide the stop forward to about 30 mm (flat-faced lens): the astigmatism vanishes, the tangential and sagittal surfaces fall on the Petzval surface — but it is still curved, with a radius of $-nf$.
- Now turn up the **field flattener**, a weak negative lens just before the sensor. The Petzval surface straightens out: its radius runs to infinity at about 1.9 on the slider, and beyond that it bends the other way.
- Notice that the flattener brings the astigmatism back a little — and lengthens the focal length slightly. A designer balances all of it.
- Slide the sensor position to find the best compromise focus for the whole field.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 420 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'focus shift from the flat sensor (mm; negative = towards the lens)' }, y: { label: 'image height (mm)' } }, 210);
      const ctl = kit.controls(box.side, [
        { id: 'q', type: 'select', label: 'Lens', options: [['Plano-convex, flat side first', -1], ['Best form singlet', 0.74]], value: params.q != null ? params.q : -1 },
        { id: 'd', label: 'Stop in front of the lens', min: 0, max: 50, step: 1, value: params.d != null ? params.d : 0, unit: 'mm' },
        { id: 'ff', label: 'Field-flattener strength', min: 0, max: 3, step: 0.05, value: params.ff != null ? params.ff : 0, fmt: v => v < 0.01 ? 'none' : v.toFixed(2) },
        { id: 'fld', label: 'Field angle drawn', min: 0, max: 12, step: 0.5, value: params.fld != null ? params.fld : 9, unit: '°' },
        { id: 'sh', label: 'Sensor position (focus)', min: -3, max: 3, step: 0.05, value: 0, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pz', 'Petzval radius'], ['foc', 'Foci at the angle drawn: T · S'], ['rms', 'Blur at the sensor: axis · field'], ['efl', 'Focal length']]);
      const sys0 = () => flatSystem(O, V.q, V.d, V.ff > 0.01 ? 100 / V.ff : 0);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, nm = 550, half = Math.min(44, Hh * 0.14);
        const sys = sys0(), par = Sy.paraxial(sys, nm), fld = V.fld * D2R, zS = par.zImage + V.sh;
        const sdn = Sy.seidel(sys, { nm, field: 6 * D2R });
        const m = S.map(st, -2, par.zImage + 10, 26, { left: 12, right: 2 * half + 40, top: 28, bottom: 18 });
        S.axis(c, m.X(-2), m.y0, m.X(par.zImage + 10));
        S.system(c, sys, m, { stop: false });
        S.stop(c, m.X(0), m.y0, 26 * m.s, 7 * m.s, { label: 'stop' });
        S.rays(c, Sy.fan2d(sys, { nm, n: 5, zStart: 0, field: 0, zEnd: zS }), m, { nm, width: 1, alpha: 0.6 });
        S.rays(c, Sy.fan2d(sys, { nm, n: 5, zStart: 0, field: fld, zEnd: zS }), m, { nm, width: 1.2 });
        c.save(); c.strokeStyle = C.ok; c.lineWidth = 3; c.beginPath(); c.moveTo(m.X(zS), m.Y(-24)); c.lineTo(m.X(zS), m.Y(24)); c.stroke(); c.restore();
        kit.label(c, 'flat sensor', m.X(zS), m.Y(24) - 9, { align: 'center', color: C.ok, size: 11.5 });
        kit.label(c, V.ff > 0.01 ? 'with a field-flattener lens (the thin plano-concave lens before the sensor)' : 'a singlet and its stop', 12, 14, { color: C.text, weight: 650, size: 12 });
        const a0 = bestSpot(O, sys, { nm, rings: 5, par, z: zS }), a1 = bestSpot(O, sys, { nm, rings: 5, par, z: zS, field: fld }), airy = O.diff.airyRadius(nm, par.fno) * 1e3;
        const hm = niceCeil(Math.max(a0.geo || 0, a1.geo || 0, airy * 1.2) * 1.15), sx = W - half - 16;
        for (const [sp, cy, t] of [[a0, Hh * 0.28, 'on axis, on the sensor'], [a1, Hh * 0.72, V.fld + '° off axis']]) { c.fillStyle = C.surface; c.fillRect(sx - half, cy - half, 2 * half, 2 * half); S.spot(c, sp, sx, cy, half, half / hm, { airy, nm }); kit.label(c, t, sx, cy - half - 8, { align: 'center', color: C.muted, size: 11 }); }
        kit.label(c, 'both boxes ± ' + kit.fmt(hm * 1000, 2) + ' µm', sx, Hh - 8, { align: 'center', color: C.faint, size: 10.5 });
        // the focal surfaces
        const T = [], Sg = [], P = [];
        for (let a = 0; a <= 12.001; a += 1.5) {
          const f = pencilFoci(O, sys, a * D2R, par); if (!f) continue;
          T.push([f.zT, f.h]); Sg.push([f.zS, f.h]); P.push([f.h * f.h / (2 * sdn.petzvalRadius), f.h]);
        }
        plot.set({ series: [{ pts: T, label: 'tangential focus', color: C.series[0] }, { pts: Sg, label: 'sagittal focus', color: C.series[1] }, { pts: P, label: 'Petzval surface', color: C.series[2], dash: [5, 4] }], vlines: [{ x: V.sh, color: C.ok, label: 'sensor' }] });
        const fo = pencilFoci(O, sys, Math.max(0.5, V.fld) * D2R, par);
        ro.set('pz', Number.isFinite(sdn.petzvalRadius) ? f1(sdn.petzvalRadius, 0) + ' mm  (' + f1(sdn.petzvalRadius / par.efl, 1) + ' × f)' : '—');
        ro.set('foc', fo ? f1(fo.zT, 2) + ' · ' + f1(fo.zS, 2) + ' mm' : '—');
        ro.set('rms', f1(a0.rms * 1000, 1) + ' · ' + f1(a1.rms * 1000, 1) + ' µm');
        ro.set('efl', f1(par.efl, 1) + ' mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ tolerances */
  Hyper.sim('ca-tolerances', {
    title: 'Tolerances: which small errors matter',
    blurb: `A fast photographic lens, the double Gauss (f = 100 mm, f/3, 11 surfaces), built **with errors**. The bars on the left take the errors one at a time: each is the extra blur caused by one radius, one thickness or air space, or one glass index being wrong by the amount of the sliders (the worse of the two signs). The histogram on the right builds 40 whole lenses at random, every parameter wrong by up to the tolerance, and counts how many still meet your specification. The ray tracing has no decentre or tilt, which cost more still in practice (see the page).

**Try this**
- With the sliders at their start values, read the most sensitive parameters off the bars. The radii of the strongly curved inner surfaces lead; spacings and indices come well behind.
- Halve all three tolerances and watch the histogram move towards the nominal blur: **yield** climbs from about two thirds to over four fifths.
- Raise only the glass-index tolerance (a catalogue melt-to-melt scatter): the index bars grow and overtake the radii above about 4 × 10⁻³, but up to 3 × 10⁻³ the radii still lead — the knobs are not equal.
- Press **New random draw** several times: yield is a statistical result, and a handful of assemblies is not a guarantee.
- Set the specification just above the nominal blur: even a good lens built well fails often. A tolerance budget is a price list.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 400, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'tr', label: 'Radius tolerance ±', min: 0, max: 2, step: 0.05, value: params.tr != null ? params.tr : 0.5, unit: '%' },
        { id: 'tt', label: 'Thickness and air-space tolerance ±', min: 0, max: 0.3, step: 0.01, value: params.tt != null ? params.tt : 0.05, unit: 'mm' },
        { id: 'tn', label: 'Glass-index tolerance ±', min: 0, max: 5, step: 0.1, value: params.tn != null ? params.tn : 1, unit: '× 10⁻³' },
        { id: 'spec', label: 'Specification: blur must stay below', min: 6, max: 40, step: 0.5, value: params.spec != null ? params.spec : 10, unit: 'µm' },
        { type: 'buttons', items: [{ id: 'roll', label: 'New random draw', primary: true }] }
      ], id => { if (id === 'roll') seed = (seed * 7 + 13) % 100000; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['nom', 'Nominal RMS blur (worse of axis · 70 % field)'], ['med', 'Median of the 40 builds'], ['p90', '90th percentile'], ['yield', 'Builds meeting the specification'], ['top', 'Most sensitive parameter']]);
      const base = O.lens('double-gauss'), F07 = base.field * 0.7;
      let seed = 4242;
      const rng = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
      const perf = sys => {
        const a = bestSpot(O, sys, { rings: 3 }), b = bestSpot(O, sys, { rings: 3, field: F07 });
        return Math.max(a.n >= 10 ? a.rms * 1000 : 500, b.n >= 10 ? b.rms * 1000 : 500);
      };
      const copy = () => { const s = O.lens('double-gauss'); return s; };
      const withN = (sf, dn) => { const a = O.abbe(sf.n); return { nd: a.nd + dn, vd: a.vd }; };
      const glassAt = i => typeof base.surfaces[i].n === 'string';
      const params0 = []; // { kind, i, name }
      base.surfaces.forEach((sf, i) => {
        if (sf.R && !sf.stop) params0.push({ kind: 'R', i, name: 'radius of surface ' + (i + 1) });
        if (i < base.surfaces.length - 1 && sf.t) params0.push({ kind: 't', i, name: (glassAt(i) ? 'thickness' : 'air space') + ' after surface ' + (i + 1) });
        if (glassAt(i)) params0.push({ kind: 'n', i, name: 'index of the glass after surface ' + (i + 1) });
      });
      const apply = (sys, p, u) => { const sf = sys.surfaces[p.i]; if (p.kind === 'R') sf.R *= 1 + u * V.tr / 100; else if (p.kind === 't') sf.t = Math.max(0.05, sf.t + u * V.tt); else sf.n = withN(sf, u * V.tn * 1e-3); };
      const mkLens = () => O.lens('double-gauss');
      // the heavy part, redone only when a tolerance or the random draw changes
      let cache = { key: '' };
      const compute = () => {
        const key = [V.tr, V.tt, V.tn, seed].join('|');
        if (cache.key === key) return cache;
        const nom = perf(base);
        // one at a time: the worse of + and −
        const sens = params0.map(p => { let w = 0; for (const u of [1, -1]) { const s = mkLens(); apply(s, p, u); w = Math.max(w, perf(s) - nom); } return { p, d: w }; }).sort((a, b) => b.d - a.d);
        // 40 random builds
        const seed0 = seed, res = [];
        for (let k = 0; k < 40; k++) { const s = mkLens(); for (const p of params0) apply(s, p, rng() * 2 - 1); res.push(perf(s)); }
        seed = seed0;
        cache = { key, nom, sens, res };
        return cache;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const dat = compute(), nom = dat.nom, sens = dat.sens, res = dat.res;
        const sorted = res.slice().sort((a, b) => a - b), med = sorted[20], p90 = sorted[35], pass = res.filter(v => v <= V.spec).length / res.length;
        // the lens on top
        const wide = W >= 600, topH = wide ? Hh * 0.24 : 0, par = Sy.paraxial(base);
        if (wide) {
          const m = S.map({ W, H: topH }, -10, par.zImage + 6, 32, { left: 12, right: 12, top: 16, bottom: 6 });
          S.axis(c, m.X(-10), m.y0, m.X(par.zImage + 6));
          S.system(c, base, m, { stop: true });
          S.rays(c, Sy.fan2d(base, { nm: 550, n: 5, zStart: -8 }), m, { nm: 550, width: 1, alpha: 0.8 });
          S.rays(c, Sy.fan2d(base, { nm: 550, n: 5, zStart: -8, field: F07 }), m, { nm: 550, width: 1, alpha: 0.6 });
        }
        // the bars
        const bx0 = 12, bw = wide ? W * 0.5 - 20 : W - 24, by0 = topH + 26, rowH = wide ? Math.min(26, (Hh - by0 - 12) / 9) : 17, top = sens.slice(0, 9), amp = Math.max(0.5, top[0] ? top[0].d : 0.5);
        kit.label(c, 'extra blur from one error at a time (µm)', bx0, by0 - 12, { color: C.muted, size: 11.5 });
        top.forEach((e, i) => {
          const y = by0 + i * rowH, lw = bw * 0.46, w = (bw - lw - 44) * Math.max(0, e.d) / amp;
          kit.label(c, e.p.name, bx0 + lw - 6, y + rowH / 2, { align: 'right', color: C.text, size: 11 });
          c.fillStyle = e.p.kind === 'R' ? C.series[0] : e.p.kind === 't' ? C.series[1] : C.series[2]; c.fillRect(bx0 + lw, y + 3, Math.max(1.5, w), rowH - 7);
          kit.label(c, '+' + f1(e.d, 1), bx0 + lw + Math.max(1.5, w) + 5, y + rowH / 2, { color: C.muted, size: 11 });
        });
        kit.label(c, 'blue: radius · orange: thickness or air space · green: glass index', bx0, by0 + 9 * rowH + 8, { color: C.faint, size: 10.5 });
        // the histogram
        const hx0 = wide ? W * 0.52 : 14, hw = W - hx0 - 14, hy0 = wide ? by0 : by0 + 9 * rowH + 50, hh = Hh - hy0 - 44;
        const lo = Math.max(0, Math.min(nom, sorted[0]) * 0.9), hi = Math.max(sorted[37], V.spec * 1.1, nom * 1.3), nb = 14, cnt = new Array(nb).fill(0);
        for (const v of res) cnt[Math.max(0, Math.min(nb - 1, Math.floor((v - lo) / (hi - lo) * nb)))]++;
        const cm = Math.max(1, ...cnt), X = v => hx0 + (v - lo) / (hi - lo) * hw;
        kit.label(c, 'RMS blur of 40 random builds (µm)', hx0, hy0 - 12, { color: C.muted, size: 11.5 });
        cnt.forEach((n, i) => { const x0 = hx0 + i * hw / nb, v0 = lo + i * (hi - lo) / nb; c.fillStyle = v0 + (hi - lo) / nb <= V.spec ? C.ok : C.bad; c.globalAlpha = 0.8; c.fillRect(x0 + 1, hy0 + hh - n / cm * hh, hw / nb - 2, n / cm * hh); c.globalAlpha = 1; });
        c.save(); c.strokeStyle = C.axis; c.beginPath(); c.moveTo(hx0, hy0 + hh); c.lineTo(hx0 + hw, hy0 + hh); c.stroke();
        c.strokeStyle = C.accent; c.setLineDash([5, 4]); c.lineWidth = 1.6; c.beginPath(); c.moveTo(X(nom), hy0 - 4); c.lineTo(X(nom), hy0 + hh); c.stroke();
        c.strokeStyle = C.warn; c.setLineDash([]); c.lineWidth = 2; c.beginPath(); c.moveTo(X(V.spec), hy0 - 4); c.lineTo(X(V.spec), hy0 + hh); c.stroke(); c.restore();
        kit.label(c, 'nominal', X(nom), hy0 + hh + 24, { align: 'center', color: C.accent, size: 11 });
        kit.label(c, 'specification', X(V.spec), hy0 + hh + 36, { align: 'center', color: C.warn, size: 11 });
        for (let i = 0; i <= 4; i++) { const v = lo + (hi - lo) * i / 4; kit.label(c, f1(v, 0), X(v), hy0 + hh + 11, { align: 'center', color: C.muted, size: 10.5 }); }
        ro.set('nom', f1(nom, 1) + ' µm');
        ro.set('med', f1(med, 1) + ' µm');
        ro.set('p90', f1(p90, 1) + ' µm');
        ro.set('yield', f1(pass * 100, 0) + ' % (' + Math.round(pass * 40) + ' of 40)');
        ro.set('top', top[0] ? top[0].p.name + ' (+' + f1(top[0].d, 1) + ' µm)' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ghosts */
  /* the system whose surfaces are listed in the order a ghost ray meets them: in through surface 0 … j, reflected at
     j, back to i, reflected at i, and out through the rest. Backward legs have negative spacings. */
  function ghostSystem(sys, i, j) {
    const Sf = sys.surfaces, N = Sf.length, t = k => Sf[k].t || 0, out = [];
    const push = (k, o) => out.push(Object.assign({ R: Sf[k].R, sd: Sf[k].sd, k: Sf[k].k, A: Sf[k].A }, o));
    for (let k = 0; k < j; k++) push(k, { t: t(k), n: Sf[k].n });
    push(j, { mirror: true, t: -t(j - 1), n: Sf[j].n });
    for (let k = j - 1; k > i; k--) push(k, { t: -t(k - 1), n: Sf[k - 1].n });
    push(i, { mirror: true, t: t(i), n: Sf[i].n });
    for (let k = i + 1; k < N; k++) push(k, { t: k < N - 1 ? t(k) : undefined, n: Sf[k].n });
    return { surfaces: out, object: sys.object, n0: sys.n0 };
  }
  /* every leg of the traced ghost ray must run the way the listing says (a wrong root of a sphere would not) */
  function legsOk(tr, gs) {
    for (let a = 1; a < gs.surfaces.length; a++) {
      const t = gs.surfaces[a - 1].t; if (t == null || !tr.pts[a + 1] || !tr.pts[a]) continue;
      if (Math.sign(t) !== Math.sign(tr.pts[a + 1][2] - tr.pts[a][2])) return false;
    }
    return true;
  }
  const GLENS = [['Cooke triplet (6 surfaces)', 'cooke-triplet'], ['Double Gauss (11 surfaces)', 'double-gauss'], ['Cemented doublet (3 surfaces)', 'achromat']];
  Hyper.sim('ca-ghosts', {
    title: 'Ghosts: the double reflections inside a lens',
    blurb: `Every surface of a lens reflects a few per cent of the light. Light that reflects at one surface, then again at an earlier one, and still reaches the sensor is a **ghost**. The program traces every such pair of surfaces of a real lens for a bright point source, adds up how much light each carries (the product of the two reflectances) and how widely it is spread on the sensor, and lists them from the brightest. The red path is the ghost you pick; the box shows where it lands, with the real image's size for comparison.

**Try this**
- Start with the **uncoated** double Gauss: forty ghosts, the worst carrying 0.3 % of the light (the product of two reflectances of about 5 %) — tiny, but a bright lamp is a million times brighter than its surroundings.
- Switch the coating to **broadband multilayer**: every ghost falls by two orders of magnitude, because each pair multiplies two small reflectances.
- Raise the **source brightness** until the ghost-to-scene ratio passes 1 %: that is the point at which a ghost is visible in a photograph.
- Step through the list: the worst ghosts are the *small* ones, where the extra reflections nearly refocus the light into a bright patch near the sensor.
- Move the source off axis: the geometry changes and different pairs of surfaces become the worst offenders.
- Cemented surfaces reflect almost nothing (the glasses are alike), which is one reason doublets help.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 400, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'Lens', options: GLENS, value: params.lens || 'double-gauss' },
        { id: 'coat', type: 'select', label: 'Coating on the glass-to-air surfaces', options: [['None: bare glass', 'none'], ['Single layer of MgF₂', 'mgf2'], ['Broadband multilayer', 'bbar']], value: params.coat || 'none' },
        { id: 'fld', label: 'Source off axis by', min: 0, max: 14, step: 1, value: params.fld != null ? params.fld : 0, unit: '°' },
        { id: 'pick', label: 'Ghost number (1 = brightest)', min: 1, max: 8, step: 1, value: params.pick || 1 },
        { id: 'src', label: 'Source brighter than its surroundings by', min: 2, max: 8, step: 0.5, value: params.src != null ? params.src : 6, fmt: v => '10^' + v.toFixed(1) + '×' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pair', 'The ghost: reflections at surfaces'], ['R', 'Light it carries'], ['size', 'Spot on the sensor, rms radius'], ['rel', 'Brightness against the image peak'], ['vis', 'Against the scene around the source'], ['tot', 'All ghosts together']]);
      let cache = { key: '' };
      const geometry = () => {
        const key = V.lens + '|' + V.fld;
        if (cache.key === key) return cache;
        const sys = O.lens(V.lens), fld = V.fld * D2R, nm = 550, par = Sy.paraxial(sys, nm), z0 = par.zImage, N = sys.surfaces.length;
        const rays = [[0, 0]]; for (let r = 1; r <= 4; r++) for (let q = 0; q < 6 * r; q++) { const a = 2 * Math.PI * q / (6 * r); rays.push([r / 4 * Math.cos(a), r / 4 * Math.sin(a)]); }
        const main = bestSpot(O, sys, { nm, rings: 4, par, field: fld });
        const list = [];
        for (let j = 1; j < N; j++) for (let i = 0; i < j; i++) {
          const gs = ghostSystem(sys, i, j), pts = [];
          for (const [px, py] of rays) { const tr = Sy.trace(gs, Sy.aim(sys, px, py, fld, par, nm), nm); if (!tr.ok || !legsOk(tr, gs)) continue; const e = Sy.at(tr, z0); if (Number.isFinite(e[0]) && Number.isFinite(e[1])) pts.push([e[0], e[1]]); }
          if (pts.length < 7) continue;
          let cx = 0, cy = 0; for (const p of pts) { cx += p[0]; cy += p[1]; } cx /= pts.length; cy /= pts.length;
          let s2 = 0, geo = 0; for (const p of pts) { const d2 = (p[0] - cx) * (p[0] - cx) + (p[1] - cy) * (p[1] - cy); s2 += d2; geo = Math.max(geo, Math.sqrt(d2)); }
          list.push({ i, j, frac: pts.length / rays.length, rms: Math.sqrt(s2 / pts.length), geo, cx, cy, pts });
        }
        cache = { key, sys, par, main, list, fld, z0 };
        return cache;
      };
      const rcache = {};
      const surfR = (sys, mm, k) => {
        const a = k === 0 ? 1 : mm[k - 1], b = mm[k];
        if (Math.abs(a - b) < 1e-9) return 0;
        const air = Math.min(a, b) < 1.01;
        if (V.coat === 'none' || !air) return O.normalR(a, b);
        const ns = Math.max(a, b), key = V.coat + '|' + ns.toFixed(4);
        if (!(key in rcache)) { try { rcache[key] = O.film.stack(O.film.design(V.coat, 550, ns), 550, 0).R; } catch (e) { rcache[key] = O.normalR(a, b); } }
        return rcache[key];
      };
      const sci = v => { if (!(v > 0)) return '0'; const e = Math.floor(Math.log10(v)), m = v / Math.pow(10, e); return m.toFixed(1) + ' × 10^' + e; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, nm = 550;
        const g = geometry(), sys = g.sys, par = g.par, mm = Sy.indices(sys, nm);
        const rAiry = O.diff.airyRadius(nm, par.fno) * 1e3, rMain = Math.max(g.main.rms || 0, rAiry);
        const ghosts = g.list.map(h => { const R = surfR(sys, mm, h.i) * surfR(sys, mm, h.j); return Object.assign({ R, rel: R * h.frac * (rMain * rMain) / (h.rms * h.rms + 1e-12) }, h); }).filter(h => h.R > 1e-12).sort((a, b) => b.rel - a.rel);
        const totalR = ghosts.reduce((s, h) => s + h.R * h.frac, 0), pick = Math.min(Math.max(1, Math.round(V.pick)), Math.max(1, ghosts.length)), gh = ghosts[pick - 1];
        const topH = Hh * 0.6, half = Math.min(60, topH * 0.3), sdMax = Math.max.apply(null, sys.surfaces.map(s => s.sd || 0));
        const m = S.map({ W, H: topH }, -10, par.zImage + 8, sdMax * 1.2, { left: 12, right: 2 * half + 44, top: 24, bottom: 10 });
        S.axis(c, m.X(-10), m.y0, m.X(par.zImage + 8));
        S.system(c, sys, m, { stop: true });
        S.rays(c, Sy.fan2d(sys, { nm, n: 5, zStart: -8, field: g.fld }), m, { nm, width: 1, alpha: 0.4 });
        S.screen(c, m.X(par.zImage), m.y0, Math.max(10, m.s * sdMax * 0.5), { label: 'sensor' });
        if (gh) {
          const gs = ghostSystem(sys, gh.i, gh.j);
          for (const py of [-0.7, -0.35, 0, 0.35, 0.7]) {
            const tr = Sy.trace(gs, Sy.aim(sys, 0, py, g.fld, par, nm), nm); if (!tr.ok || !legsOk(tr, gs)) continue;
            const pts = tr.pts.map(p => [m.X(p[2]), m.Y(p[1])]); const e = Sy.at(tr, par.zImage); pts.push([m.X(e[2]), m.Y(e[1])]);
            S.ray(c, pts, { color: C.bad, width: 1.2, arrows: false, alpha: 0.9 });
            if (py === 0 || py === 0.35) for (const k of [gh.j + 1, 2 * gh.j - gh.i + 1]) if (tr.pts[k]) kit.dot(c, m.X(tr.pts[k][2]), m.Y(tr.pts[k][1]), 3.2, C.warn);
          }
        }
        // where the ghost lands, against the real image
        const sx = W - half - 16, sy = topH * 0.5;
        c.fillStyle = C.surface; c.fillRect(sx - half, sy - half, 2 * half, 2 * half);
        if (gh) {
          const hmm = niceCeil(Math.max(gh.geo, rMain) * 1.1); S.spot(c, { pts: gh.pts, cx: gh.cx, cy: gh.cy }, sx, sy, half, half / hmm, { airy: rMain, nm });
          kit.label(c, 'the ghost on the sensor', sx, sy - half - 10, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, 'box ± ' + kit.fmt(hmm, 2) + ' mm · dashed: the real image', sx, sy + half + 12, { align: 'center', color: C.faint, size: 10.5 });
        }
        kit.label(c, 'red: the ghost path · amber dots: its two reflections · faint: the real image', 12, 14, { color: C.muted, size: 11.5 });
        // the list
        const ly0 = topH + 14, rowH = Math.min(18, (Hh - ly0 - 8) / 9);
        kit.label(c, 'ghosts, brightest first (pair of surfaces · light carried · spot rms · against the image peak)', 12, ly0, { color: C.muted, size: 11.5 });
        ghosts.slice(0, 8).forEach((h, i) => {
          const y = ly0 + (i + 1) * rowH + 4;
          if (i + 1 === pick) { c.fillStyle = C.surface; c.fillRect(8, y - rowH / 2 + 1, W - 16, rowH - 1); }
          kit.label(c, (i + 1) + '.  surfaces ' + (h.i + 1) + ' & ' + (h.j + 1) + '  ·  ' + sci(h.R) + '  ·  ' + f1(h.rms, 2) + ' mm  ·  ' + sci(h.rel), 14, y, { color: i + 1 === pick ? C.text : C.muted, size: 11.5, weight: i + 1 === pick ? 650 : 500 });
        });
        if (!ghosts.length) kit.label(c, 'no double reflection of this lens reaches the sensor', 14, ly0 + rowH + 4, { color: C.muted, size: 11.5 });
        if (gh) {
          const vis = gh.rel * Math.pow(10, V.src);
          ro.set('pair', (gh.i + 1) + ' and ' + (gh.j + 1));
          ro.set('R', f1(gh.R * 100, 4) + ' % of the beam');
          ro.set('size', f1(gh.rms, 2) + ' mm (real image ' + f1(rMain * 1000, 1) + ' µm)');
          ro.set('rel', sci(gh.rel));
          ro.set('vis', f1(vis * 100, vis < 0.01 ? 3 : 1) + ' %' + (vis > 0.01 ? ' — visible' : ' — below about 1 %'));
        } else { for (const k of ['pair', 'R', 'size', 'rel', 'vis']) ro.set(k, '—'); }
        ro.set('tot', f1(totalR * 100, 3) + ' % of the light (' + ghosts.length + ' ghost paths)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ an optimizer at work */
  /* solve A x = b by Gaussian elimination with pivoting */
  function solveLinear(A, b) {
    const n = b.length, M = A.map((row, i) => row.concat([b[i]]));
    for (let i = 0; i < n; i++) {
      let p = i; for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[p][i])) p = k;
      const tmp = M[i]; M[i] = M[p]; M[p] = tmp;
      if (Math.abs(M[i][i]) < 1e-30) return null;
      for (let k = i + 1; k < n; k++) { const f = M[k][i] / M[i][i]; for (let j = i; j <= n; j++) M[k][j] -= f * M[i][j]; }
    }
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) { let s = M[i][n]; for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j]; x[i] = s / M[i][i]; }
    return x;
  }
  Hyper.sim('ca-optimizer', {
    title: 'How a lens is designed: an optimizer at work',
    blurb: `A Cooke triplet with its glasses and thicknesses fixed and **eight variables**: six surface curvatures and the two air spaces. The *merit function* is the RMS size of the ray spot at three field angles (and a penalty for missing the 50 mm focal length). Each step is one **damped-least-squares** move: the program measures how every ray position changes when each variable is nudged, solves for the best combined change, and keeps it only if the merit falls. The graph shows the merit against step number for each start.

**Try this**
- Press **Run** from the *triplet with random errors*: within about ten steps the merit falls from 50–120 µm to about 15 µm, and to about 13 µm after forty. Press **New start** a few times: different errors, nearly the same destination.
- Choose **Equal biconvex lenses** and Run: it settles at a blur thirty times worse (about 440 µm, with a focal length of 21 mm instead of 50). The optimizer only goes downhill; this valley is a **local minimum**, and no step from here improves it.
- Choose **Positive middle lens** and Run: another dead end, about 195 µm with a focal length of 27 mm. The right starting form matters more than the algorithm.
- Press **One step** repeatedly and watch the damping (λ): after a failed step it grows and the next step is cautious; after a success it shrinks.
- Compare the curves: the valleys of good triplets are wide and flat, which is why lens designers can trade a little image quality for a cheaper glass or a looser tolerance.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 360, maxH: 500 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'step', min: 0 }, y: { label: 'merit: RMS spot (µm)', log: true } }, 180);
      const ctl = kit.controls(box.side, [
        { id: 'start', type: 'select', label: 'Starting point', options: [['Triplet with random errors', 'rand'], ['Equal biconvex lenses', 'bicon'], ['Positive middle lens', 'mid'], ['Almost flat lenses', 'flat']], value: params.start || 'rand' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run / pause', primary: true }, { id: 'step', label: 'One step' }, { id: 'new', label: 'New start' }] }
      ], id => {
        if (id === 'run') { if (!running) { if (!runs.length) newRun(); const R0 = runs[runs.length - 1]; R0.stopAt = R0.it + 40; running = true; loop.start(); } else running = false; }
        else if (id === 'step') { running = false; if (!runs.length) newRun(); step(); loop.once(); }
        else { running = false; newRun(); loop.once(); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['it', 'Step'], ['m', 'Merit now'], ['lam', 'Damping λ'], ['efl', 'Focal length'], ['gap', 'Air spaces']]);
      const base = O.lens('cooke-triplet'), FIELDS = [0, 0.7, 1], X0 = base.surfaces.map(s => 1 / s.R).concat([base.surfaces[1].t, base.surfaces[3].t]);
      const STARTS = {
        bicon: [1 / 30, -1 / 30, 1 / 30, -1 / 30, 1 / 30, -1 / 30, 6, 4.75],
        mid: [1 / 22, -1 / 435, 1 / 30, -1 / 30, 1 / 79, -1 / 18.4, 6, 4.75],
        flat: [1 / 200, -1 / 200, 1 / 200, -1 / 200, 1 / 200, -1 / 200, 5, 5]
      };
      let seed = 9001, running = false, runs = [], acc = 0;
      const rng = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
      const apply = x => {
        const s = O.lens('cooke-triplet');
        for (let k = 0; k < 6; k++) s.surfaces[k].R = Math.abs(x[k]) < 1e-6 ? 0 : 1 / x[k];
        s.surfaces[1].t = x[6]; s.surfaces[3].t = x[7];
        return s;
      };
      const feasible = (s, x) => x[6] >= 2 && x[7] >= 2 && x[6] <= 10 && x[7] <= 10 && s.surfaces.every(f => !f.R || Math.abs(f.R) >= (f.sd || 0) * 1.05);
      const NR = 3 * 10 + 1;
      const resid = x => {
        const s = apply(x);
        if (!feasible(s, x)) return { r: new Array(NR).fill(5), efl: NaN, bad: true };
        const par = Sy.paraxial(s), z = par.zImage, r = []; let bad = false;
        if (!Number.isFinite(z)) return { r: new Array(NR).fill(5), efl: NaN, bad: true };
        for (const f of FIELDS) {
          const fl = base.field * f, chief = Sy.trace(s, Sy.aim(s, 0, 0, fl, par), 587.56, { clip: false }), ok = chief.ok, yc = ok ? Sy.at(chief, z) : [0, 0, 0];
          for (const py of [-1, -2 / 3, -1 / 3, 1 / 3, 2 / 3, 1]) { const tr = ok ? Sy.trace(s, Sy.aim(s, 0, py, fl, par), 587.56, { clip: false }) : { ok: false }; if (tr.ok) r.push(Sy.at(tr, z)[1] - yc[1]); else { r.push(0.5); bad = true; } }
          for (const px of [-1, -0.5, 0.5, 1]) { const tr = ok ? Sy.trace(s, Sy.aim(s, px, 0, fl, par), 587.56, { clip: false }) : { ok: false }; if (tr.ok) r.push(Sy.at(tr, z)[0] - yc[0]); else { r.push(0.5); bad = true; } }
        }
        r.push((par.efl - 50) * 0.05);
        return { r, efl: par.efl, bad };
      };
      const meritOf = rr => Math.sqrt(rr.r.slice(0, NR - 1).reduce((s, v) => s + v * v, 0) / (NR - 1)) * 1000;
      const dls = (x, lam) => {
        const r0 = resid(x), m = r0.r.length, n = x.length, J = [];
        for (let i = 0; i < m; i++) J.push(new Array(n).fill(0));
        for (let k = 0; k < n; k++) { const h = Math.abs(x[k]) * 1e-4 + 1e-7, xp = x.slice(); xp[k] += h; const rp = resid(xp); for (let i = 0; i < m; i++) J[i][k] = (rp.r[i] - r0.r[i]) / h; }
        const A = [], g = [];
        for (let i = 0; i < n; i++) {
          const row = []; let d = 0;
          for (let j = 0; j < n; j++) { let s = 0; for (let k = 0; k < m; k++) s += J[k][i] * J[k][j]; row.push(s); if (i === j) d = s; }
          row[i] = d * (1 + lam) + 1e-12; A.push(row);
          let s = 0; for (let k = 0; k < m; k++) s += J[k][i] * r0.r[k]; g.push(-s);
        }
        const dx = solveLinear(A, g); return dx ? x.map((v, i) => v + dx[i]) : null;
      };
      const newRun = () => {
        let x;
        if (V.start === 'rand') x = X0.map((v, i) => v * (1 + (rng() * 2 - 1) * (i < 6 ? 0.08 : 0.15)));
        else x = STARTS[V.start].slice();
        const rr = resid(x), label = { rand: 'random errors', bicon: 'equal biconvex', mid: 'positive middle', flat: 'almost flat' }[V.start];
        runs.push({ x, merit: meritOf(rr), lam: 0.1, label, hist: [[0, Math.max(0.05, meritOf(rr))]], it: 0, stopAt: 40 });
        if (runs.length > 6) runs.shift();
      };
      const step = () => {
        const R = runs[runs.length - 1]; if (!R) return;
        let xn = null; try { xn = dls(R.x, R.lam); } catch (e) { xn = null; }
        if (xn && xn.every(Number.isFinite)) { const rr = resid(xn), mn = meritOf(rr); if (Number.isFinite(mn) && mn < R.merit) { R.x = xn; R.merit = mn; R.lam = Math.max(1e-4, R.lam / 3); } else R.lam = Math.min(1e4, R.lam * 5); }
        else R.lam = Math.min(1e4, R.lam * 5);
        R.it++; R.hist.push([R.it, Math.max(0.05, R.merit)]);
      };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (!runs.length) newRun();
        if (running) { acc += dt; if (acc > 0.12 || dt === 0) { acc = 0; step(); const R = runs[runs.length - 1]; if (R.it >= R.stopAt) { running = false; loop.stop(); } } }
        const R = runs[runs.length - 1], sys = apply(R.x), half = Math.min(38, Hh * 0.1), ok = feasible(sys, R.x), par = Sy.paraxial(sys);
        const m = S.map(st, -6, par.zImage + 4, 12, { left: 12, right: 2 * half + 40, top: 30, bottom: 16 });
        S.axis(c, m.X(-6), m.y0, m.X(par.zImage + 4));
        S.system(c, sys, m, { stop: true });
        FIELDS.forEach((f, i) => S.rays(c, Sy.fan2d(sys, { nm: 550, n: 5, zStart: -5, field: base.field * f }), m, { color: C.series[i], width: 1.1 }));
        kit.label(c, 'rays at 0°, 14° and 20°; the sensor stays at the paraxial focus', 12, 14, { color: C.muted, size: 11.5 });
        const spots = FIELDS.map(f => bestSpot(O, sys, { nm: 550, rings: 4, field: base.field * f, z: par.zImage })), hm = niceCeil(Math.max.apply(null, spots.map(s => s.geo || 0)) * 1.15 || 0.01), sx = W - half - 14;
        spots.forEach((sp, i) => { const cy = 24 + half + i * (2 * half + 22); c.fillStyle = C.surface; c.fillRect(sx - half, cy - half, 2 * half, 2 * half); S.spot(c, sp, sx, cy, half, half / hm, { nm: 550, color: C.series[i] }); kit.label(c, (i === 0 ? '0°' : i === 1 ? '14°' : '20°') + ' · ' + f1((sp.rms || 0) * 1000, 1) + ' µm rms', sx, cy + half + 9, { align: 'center', color: C.muted, size: 10.5 }); });
        kit.label(c, 'boxes ± ' + kit.fmt(hm * 1000, 2) + ' µm', sx, Hh - 8, { align: 'center', color: C.faint, size: 10.5 });
        plot.set({ x: { label: 'step', min: 0, max: Math.max(10, R.it) }, series: runs.map((r, i) => ({ pts: r.hist, label: i === runs.length - 1 ? r.label + ' (this run)' : r.label, color: C.series[i % C.series.length], width: i === runs.length - 1 ? 2.6 : 1.3 })) });
        ro.set('it', R.it + (running ? ' (running)' : ''));
        ro.set('m', f1(R.merit, 1) + ' µm' + (ok ? '' : ' — infeasible'));
        ro.set('lam', R.lam.toExponential(1));
        ro.set('efl', f1(par.efl, 2) + ' mm (target 50)');
        ro.set('gap', f1(R.x[6], 2) + ' · ' + f1(R.x[7], 2) + ' mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
