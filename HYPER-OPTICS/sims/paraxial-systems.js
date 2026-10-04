/* HYPER-OPTICS · sims/paraxial-systems.js — simulations for the topic "Stops, pupils and first-order optics".
 *   px-paraxial     one ray traced exactly against the paraxial prediction, and how far from the axis they agree
 *   px-abcd         two thin lenses by ray-transfer matrices: the matrix, the cardinal points, the image
 *   px-stop         a double Gauss with an iris: which opening is the aperture stop, and when the rim takes over
 *   px-pupils       the stop and its two images, the entrance and the exit pupil, in three real systems
 *   px-field        a camera as a field stop: sensor size, focal length, mask and the field of view
 *   px-rays         the marginal ray and the chief ray of a finite-conjugate lens, and the invariant they make
 *   px-na           a point in a specimen: the cone an objective collects, and why immersion raises the NA
 *   px-vignette     a pupil cut to a cat's eye by rims off axis: rays lost, relative illumination
 *   px-telecentric  a stop moved to a focal point: chief rays parallel to the axis, size independent of distance
 *   px-dof          the cone near the focus and the through-focus blur: depth of focus ± N c and ± 2 λ N²
 * The numbers come from kit.optics, the drawing from kit.osym: no simulation re-derives a law or traces its own lens.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const fin = v => Number.isFinite(v);
  const num = (v, d) => (fin(v) ? (v < 0 ? '−' : '') + Math.abs(v).toFixed(d == null ? 1 : d) : '—');
  const mm = (v, d) => (fin(v) ? num(v, d == null ? 1 : d) + ' mm' : '—');
  const deg = (v, d) => (fin(v) ? num(v * R2D, d == null ? 1 : d) + '°' : '—');
  const clone = a => a.map(s => Object.assign({}, s));
  /* a fresh library lens (its stop is sized to its stated aperture: the triplet is f/5.0, the double Gauss f/3.0) */
  const library = (O, id) => { const sys = O.lens(id); delete sys.epd; delete sys.field; return sys; };
  /* a map like S.map but with the transverse scale stretched (at most kmax times) when the system is long and thin */
  const amap = (st, zMin, zMax, yHalf, o, kmax) => {
    o = o || {};
    const L = o.left == null ? 24 : o.left, R = o.right == null ? 24 : o.right, T = o.top == null ? 18 : o.top, B = o.bottom == null ? 18 : o.bottom;
    const sx = Math.max(1e-9, (st.W - L - R) / Math.max(1e-9, zMax - zMin)), sy = Math.max(1e-9, Math.min((st.H - T - B) / Math.max(1e-9, 2 * yHalf), sx * (kmax || 4)));
    const y0 = T + (st.H - T - B) / 2;
    return { x0: L - sx * zMin, y0, s: sx, sy, k: sy / sx, X: z => L + sx * (z - zMin), Y: y => y0 - sy * y };
  };
  const lineOf = (m, tr, zEnd) => {              // a traced ray as canvas points, continued to the plane zEnd
    const pts = tr.pts.map(p => [m.X(p[2]), m.Y(p[1])]);
    if (tr.ok && fin(zEnd)) { const e = tr.p && tr.d ? [tr.p[0] + (zEnd - tr.p[2]) / tr.d[2] * tr.d[0], tr.p[1] + (zEnd - tr.p[2]) / tr.d[2] * tr.d[1], zEnd] : null; if (e && fin(e[1])) pts.push([m.X(e[2]), m.Y(e[1])]); }
    return pts;
  };

  /* ================================================================ paraxial against exact */
  Hyper.sim('px-paraxial', {
    title: 'Paraxial against exact: how far from the axis can first-order optics be trusted?',
    blurb: `A biconvex glass lens of 100 mm focal length, 25.4 mm across (f/3.9), and one ray arriving parallel to the axis at a height you choose. The **dashed line** is what first-order (paraxial) optics predicts: the ray bends at the lens's principal plane and passes exactly through the paraxial focus F′. The **coloured line** is the same ray traced exactly, with Snell's law applied at both glass surfaces.

**Try this**
- Set the height to **2 mm**. The two paths cannot be told apart and the exact ray misses F′ by only 0.06 mm.
- Double it to **4 mm**: the miss grows fourfold, to 0.25 mm. The error goes as the *square* of the height: that is third-order spherical aberration.
- Take the ray to **12 mm**, near the rim: it crosses the axis 2.3 mm short of F′ — and the angle of incidence on the first surface is only 6.7°. In the graph, sin θ and θ are 0.2 % apart there. Small angle errors, added over two surfaces and then amplified by the shallow crossing at the focus, give a large focal error.
- Tick **the fan** of rays: only the central zone meets at the paraxial focus; the outer rays fall short.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 250, maxH: 380 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const sys = O.lens('biconvex'), par = Sy.paraxial(sys, 550), R1 = sys.surfaces[0].R, sdMax = sys.surfaces[0].sd;
      const ctl = kit.controls(box.side, [
        { id: 'h', label: 'Height of the ray above the axis', min: 0.5, max: 12.5, step: 0.1, value: params.h || 8, unit: 'mm' },
        { id: 'fan', type: 'check', label: 'Draw a whole fan of rays', value: params.fan !== false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['inc', 'Angle of incidence, first surface'], ['sin', 'sin θ against θ'], ['miss', 'Exact ray crosses the axis'], ['rel', 'That is, of the focal length'], ['verdict', 'Is this paraxial?']]);
      const plot = kit.plot(gb, { x: { label: 'angle θ (°)', min: 0, max: 30 }, y: { label: 'error of the small-angle form (%)', min: 0 }, legend: true }, 150);
      const sinS = [], tanS = [];
      for (let a = 0; a <= 30.01; a += 0.5) { const t = a * D2R; sinS.push([a, a === 0 ? 0 : (t - Math.sin(t)) / Math.sin(t) * 100]); tanS.push([a, a === 0 ? 0 : (Math.tan(t) - t) / t * 100]); }
      const zS = -30;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const h = Math.min(V.h, sdMax - 0.2), zEnd = par.zImage + 8;
        const m = S.map(st, zS, zEnd, sdMax * 1.15, { left: 18, right: 18, top: 34, bottom: 30 });
        S.axis(c, m.X(zS), m.y0, m.X(zEnd));
        S.system(c, sys, m, { stop: false });
        if (V.fan) S.rays(c, Sy.fan2d(sys, { nm: 550, n: 11, zStart: zS, zEnd }), m, { nm: 550, width: 1, alpha: 0.32 });
        // the paraxial ray: straight in, bent once at the rear principal plane, through F′
        const yEnd = h * (1 - (zEnd - par.Hrear) / (par.zImage - par.Hrear));
        S.ray(c, [[m.X(zS), m.Y(h)], [m.X(par.Hrear), m.Y(h)], [m.X(par.zImage), m.Y(0)], [m.X(zEnd), m.Y(yEnd)]], { color: C.muted, dash: [6, 4], width: 1.6, arrows: false });
        // the exact ray
        const tr = Sy.trace(sys, { p: [0, h, zS], d: [0, 0, 1] }, 550);
        S.ray(c, lineOf(m, tr, zEnd), { color: C.warn, width: 2.4, arrows: false });
        const zc = Sy.axisCrossing(tr), miss = zc - par.zImage;
        S.dim(c, m.X(par.Hrear), m.Y(-sdMax * 1.02), m.X(par.zImage), m.Y(-sdMax * 1.02), 'f′ = ' + par.efl.toFixed(1) + ' mm from the principal plane', { off: 13 });
        kit.dot(c, m.X(par.zImage), m.y0, 3.5, C.text);
        kit.label(c, 'F′ (paraxial focus)', m.X(par.zImage), m.y0 + 16, { align: 'center', color: C.muted, size: 11.5 });
        if (fin(zc)) { kit.dot(c, m.X(zc), m.y0, 3.5, C.warn); kit.label(c, 'exact ray crosses here', m.X(zc) - 8, m.y0 - 15, { align: 'right', color: C.warn, size: 11.5 }); }
        kit.label(c, 'paraxial ray (dashed) · exact ray (coloured)', 18, 16, { color: C.muted });
        const inc = Math.asin(Math.min(1, h / R1)), th = inc;
        ro.set('inc', deg(inc, 2) + '  (θ = ' + th.toFixed(4) + ' rad)');
        ro.set('sin', 'sin θ = ' + Math.sin(th).toFixed(4) + ', ' + (th > 0 ? ((th - Math.sin(th)) / Math.sin(th) * 100).toFixed(2) : '0') + ' % below θ');
        ro.set('miss', fin(zc) ? num(miss, 3) + ' mm from F′ (' + (miss < 0 ? 'short of it' : 'beyond it') + ')' : '—');
        ro.set('rel', fin(zc) ? num(Math.abs(miss) / par.efl * 100, 2) + ' % of f′' : '—');
        ro.set('verdict', !fin(zc) ? '—' : Math.abs(miss) / par.efl < 0.001 ? 'yes: the lens equation holds' : Math.abs(miss) / par.efl < 0.01 ? 'nearly: a small aberration' : 'no: spherical aberration shows');
        plot.set({ series: [{ pts: sinS, label: 'θ against sin θ' }, { pts: tanS, label: 'tan θ against θ' }], vlines: [{ x: inc * R2D, color: C.warn, label: 'this ray' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ray-transfer matrices */
  Hyper.sim('px-abcd', {
    title: 'Two lenses by matrix: multiply, then read the system',
    blurb: `Two thin lenses and the air between them, exactly as the matrices describe them: a lens is $\\begin{pmatrix}1&0\\\\-1/f&1\\end{pmatrix}$, a gap of length *d* is $\\begin{pmatrix}1&d\\\\0&1\\end{pmatrix}$. Every ray is a pair (height *y*, slope *u*) pushed through the product. The system matrix and everything read from it — focal length, back and front focal distances, the two principal planes — is shown at the right.

**Try this**
- Start with f₁ = 100, f₂ = 50, d = 60: the pair behaves like **one lens of 55.6 mm**, whose rear principal plane H′ lies *inside* the system (look at the dashed lines).
- Make the lenses touch (**d = 0**): C = −(1/f₁ + 1/f₂) and the powers simply add.
- Set **d = f₁ + f₂** = 150: C becomes 0. Parallel rays stay parallel: this is an *afocal* telescope, and D (here −2) is its angular magnification.
- Tick **diverging** for the second lens and choose d = 70 with f₂ = 40: the pair has a focal length of **400 mm** and a back focal distance of only 120 mm — a 400 mm focal length in a package 190 mm long. That is a telephoto; its rear principal plane H′ lies 280 mm in front of lens 2, off the left of the picture.
- Choose a finite object: the image appears where the matrix of the whole path has **B = 0**, and A there is the magnification.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, A = O.abcd;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'f1', label: 'First lens, focal length f₁', min: 30, max: 200, step: 1, value: params.f1 || 100, unit: 'mm' },
        { id: 'f2', label: 'Second lens, focal length f₂', min: 20, max: 200, step: 1, value: params.f2 || 50, unit: 'mm' },
        { id: 'neg', type: 'check', label: 'Make the second lens diverging', value: !!params.neg },
        { id: 'd', label: 'Separation d', min: 0, max: 250, step: 1, value: params.d != null ? params.d : 60, unit: 'mm' },
        { id: 'so', type: 'select', label: 'The object is', options: [['at infinity (parallel rays)', Infinity], ['350 mm in front of lens 1', 350], ['200 mm in front of lens 1', 200]], value: params.so != null ? params.so : Infinity }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r1', 'Matrix, first row (A  B)'], ['r2', 'Matrix, second row (C  D)'], ['det', 'Determinant AD − BC'], ['efl', 'Focal length −1/C'], ['bfd', 'Back focal distance −A/C'], ['ffd', 'Front focal distance −D/C'], ['img', 'Image of the object']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const f1 = V.f1, f2 = V.neg ? -V.f2 : V.f2, d = V.d, so = V.so;
        const M1 = A.lens(f1), T = A.free(d), M2 = A.lens(f2), M = A.mul(M1, T, M2);
        const card = A.cardinal(M), afocal = card.afocal;
        const img = Number.isFinite(so) ? A.image(M, so) : null;
        const bfd = afocal ? Infinity : card.bfd;
        const zMin = Number.isFinite(so) ? -so - 10 : -80;
        const siDraw = Number.isFinite(so) ? (img && fin(img.si) && img.si > 0 ? img.si : 120) : (fin(bfd) && bfd > 0 ? bfd : 120);
        const zEnd = d + Math.min(Math.max(siDraw * 1.25, 60), 330);
        const yHalf = 27;
        const m = S.map(st, zMin, zEnd, yHalf, { left: 14, right: 14, top: 26, bottom: 36 });
        S.axis(c, m.X(zMin), m.y0, m.X(zEnd));
        // rays as (y, u) vectors pushed through the matrices
        const rays = [];
        if (!Number.isFinite(so)) for (const y0 of [-20, -10, 10, 20]) rays.push({ y: y0, u: 0, z0: zMin });
        else for (const k of [-2, -1, 1, 2]) rays.push({ y: 0, u: k / 2 * 18 / so, z0: -so });
        rays.forEach((r, i) => {
          let v = A.apply(A.free(-r.z0), [r.y, r.u]);              // on to the first lens
          const p1 = [0, v[0]]; v = A.apply(M1, v);
          v = A.apply(T, v); const p2 = [d, v[0]]; v = A.apply(M2, v);
          const pe = [zEnd, v[0] + v[1] * (zEnd - d)];
          S.ray(c, [[m.X(r.z0), m.Y(r.y)], [m.X(p1[0]), m.Y(p1[1])], [m.X(p2[0]), m.Y(p2[1])], [m.X(pe[0]), m.Y(pe[1])]], { nm: [580, 600, 600, 580][i % 4], width: 1.5, arrows: true, minArrow: 60 });
        });
        S.thinLens(c, m.X(0), m.y0, m.s * 25, f1, { label: 'f₁ = ' + f1 + ' mm' });
        S.thinLens(c, m.X(d), m.y0, m.s * 25, f2, { label: 'f₂ = ' + f2 + ' mm' });
        if (Number.isFinite(so)) S.object(c, m.X(-so), m.y0, m.s * 4, { label: 'object' });
        // the cardinal planes of the whole system
        if (!afocal) {
          const zH2 = d + card.Hrear, zH1 = card.Hfront, zF2 = d + card.bfd, zF1 = -card.ffd;
          for (const [z, lab, dy] of [[zH1, 'H', -1], [zH2, 'H′', 1]]) {
            if (z < zMin || z > zEnd) continue;
            c.save(); c.strokeStyle = C.accent; c.setLineDash([3, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(m.X(z), m.Y(yHalf * 0.8)); c.lineTo(m.X(z), m.Y(-yHalf * 0.8)); c.stroke(); c.restore();
            kit.label(c, lab, m.X(z), m.Y(dy * yHalf * 0.8) + dy * 11, { align: 'center', color: C.accent, size: 12, weight: 650 });
          }
          for (const [z, lab] of [[zF1, 'F'], [zF2, 'F′']]) if (z >= zMin && z <= zEnd) { kit.dot(c, m.X(z), m.y0, 3.2, C.text); kit.label(c, lab, m.X(z), m.y0 + 14, { align: 'center', color: C.text, size: 12 }); }
        }
        if (img && fin(img.si) && img.si > 0 && d + img.si <= zEnd) { S.object(c, m.X(d + img.si), m.y0, m.s * 4 * img.m, { dash: true, label: 'image' }); }
        kit.label(c, 'dashed: the principal planes H and H′ and the focal points F and F′ of the pair', 14, 14, { color: C.muted, size: 11.5 });
        const f4 = x => (Math.abs(x) < 5e-5 ? '0' : x.toFixed(4));
        ro.set('r1', f4(M[0][0]) + '    ' + num(M[0][1], 1) + ' mm');
        ro.set('r2', (Math.abs(M[1][0]) < 1e-12 ? '0' : M[1][0].toExponential(3)) + ' mm⁻¹    ' + f4(M[1][1]));
        ro.set('det', num(A.det(M), 4) + '  (1 in air)');
        ro.set('efl', afocal ? 'infinite: C = 0, an afocal system' : mm(card.efl, 1) + '  (' + num(1000 * card.power, 1) + ' D)');
        ro.set('bfd', afocal ? 'infinite' : mm(card.bfd, 1) + (card.bfd < 0 ? ' (the focus is inside)' : ''));
        ro.set('ffd', afocal ? 'infinite' : mm(card.ffd, 1) + (card.ffd < 0 ? ' (behind lens 1)' : ''));
        ro.set('img', !img ? (afocal ? 'none: parallel in, parallel out' : 'at F′, ' + mm(card.bfd, 1) + ' behind lens 2') : !fin(img.si) ? 'at infinity' : mm(img.si, 1) + ' behind lens 2, m = ' + num(img.m, 3));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the aperture stop */
  Hyper.sim('px-stop', {
    title: 'Which opening is the aperture stop?',
    blurb: `A double-Gauss lens of about 100 mm focal length with an iris in the middle. Every glass surface is an opening with a rim, and so is the iris. The **aperture stop** is the one opening that limits the cone of light from the axial point: the sim finds it by tracing a near-axis ray and asking, for each opening, how wide a beam it would let through. The tightest wins, and it is marked in colour.

**Try this**
- Close the iris to **4 mm** (semi-diameter) and then open it slowly. While it is the smallest opening it *is* the stop: the lens starts at f/7.5 and the f-number falls as you open it.
- Keep opening: at a semi-diameter of about **13.4 mm** the readout changes — the iris is no longer the stop; the rim of the front doublet is, and the lens is f/2.2. Opening the iris further does nothing, because something else already limits the beam.
- Choose an object **120 mm** away: the cone from the axial point is now wide, the rim takes over earlier (about 12 mm), and it is a different rim, in the rear doublet.
- Notice that the entrance pupil and the f-number follow the stop, wherever it is.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 420 });
      const base = O.lens('double-gauss'); delete base.epd; delete base.field;
      const NAMES = ['the front of the first lens', 'the back of the first lens', 'the front of the front doublet', 'the cemented surface of the front doublet', 'the back of the front doublet', 'the iris', 'the front of the rear doublet', 'the cemented surface of the rear doublet', 'the back of the rear doublet', 'the front of the last lens', 'the back of the last lens'];
      const IRIS = 5;
      const ctl = kit.controls(box.side, [
        { id: 'iris', label: 'Iris opening (semi-diameter)', min: 2, max: 16, step: 0.1, value: params.iris || 10, unit: 'mm' },
        { id: 'so', type: 'select', label: 'The object is', options: [['at infinity', Infinity], ['300 mm from the first surface', 300], ['120 mm from the first surface', 120]], value: params.so != null ? params.so : Infinity }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['stop', 'The aperture stop is'], ['iris', 'Iris opening (diameter)'], ['epd', 'Entrance pupil'], ['N', 'f-number'], ['room', 'The iris can open to']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const sys = { surfaces: clone(base.surfaces), object: V.so };
        sys.surfaces[IRIS].sd = V.iris;
        // for each opening: the widest beam (at the first surface) or cone it would pass, from a near-axis ray
        const ray = Number.isFinite(V.so) ? { p: [0, 0, -V.so], d: [0, 1e-3, 1] } : { p: [0, 1e-3, -1], d: [0, 0, 1] };
        const tr0 = Sy.trace(sys, ray, 550, { clip: false });
        const lim = sys.surfaces.map((s, i) => { const q = tr0.pts[i + 1]; return q && s.sd != null && Math.abs(q[1]) > 1e-12 ? s.sd * 1e-3 / Math.abs(q[1]) : Infinity; });
        let k = 0; lim.forEach((v, i) => { if (v < lim[k]) k = i; });
        let k2 = -1; lim.forEach((v, i) => { if (i !== k && (k2 < 0 || v < lim[k2])) k2 = i; });
        sys.surfaces.forEach((s, i) => { s.stop = i === k; });
        const par = Sy.paraxial(sys, 550), zs = par.zs;
        const zS = -22, zEnd = par.zImage + 4;
        const m = S.map(st, zS, zEnd, 33, { left: 16, right: 16, top: 30, bottom: 24 });
        S.axis(c, m.X(zS), m.y0, m.X(zEnd));
        S.system(c, sys, m, { stop: false });
        S.rays(c, Sy.fan2d(sys, { nm: 550, n: 13, zStart: zS, zEnd }), m, { nm: 550, width: 1.1 });
        // the iris, and the rim that limits if it is not the iris
        const irisCol = k === IRIS ? C.warn : C.muted;
        S.stop(c, m.X(zs[IRIS]), m.y0, m.s * 31, m.s * V.iris, { color: irisCol, width: k === IRIS ? 4 : 2.5 });
        kit.label(c, k === IRIS ? 'iris = aperture stop' : 'iris', m.X(zs[IRIS]), m.Y(31) - 12, { align: 'center', color: irisCol, weight: k === IRIS ? 700 : 500 });
        if (k !== IRIS) {
          const sd = sys.surfaces[k].sd, x = m.X(zs[k]);
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 4; c.beginPath(); c.moveTo(x, m.Y(sd)); c.lineTo(x, m.Y(sd + 4)); c.moveTo(x, m.Y(-sd)); c.lineTo(x, m.Y(-sd - 4)); c.stroke(); c.restore();
          kit.label(c, 'aperture stop: the rim here', x, m.Y(sd + 4) - 10, { align: 'center', color: C.warn, weight: 700 });
        }
        const epd = par.epd, N = fin(V.so) ? par.fnoWorking : par.fno;
        ro.set('stop', NAMES[k]);
        ro.set('iris', num(2 * V.iris, 1) + ' mm');
        ro.set('epd', num(epd, 1) + ' mm across, ' + num(par.zEP, 1) + ' mm behind the first vertex');
        ro.set('N', 'f/' + num(N, 2) + (fin(V.so) ? '  (working, at this distance)' : ''));
        ro.set('room', k === IRIS && k2 >= 0 && fin(lim[k2]) ? num(2 * V.iris * lim[k2] / lim[k], 1) + ' mm before ' + NAMES[k2] + ' takes over' : k === IRIS ? '—' : 'no further: the iris is wide open (' + num(2 * V.iris, 1) + ' mm) and is not the limit');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ entrance and exit pupils */
  Hyper.sim('px-pupils', {
    title: 'The stop and its two images: the entrance pupil and the exit pupil',
    blurb: `A real lens traced ray by ray. The bars across the glass are the **aperture stop** (the iris, grey). The two coloured brackets are its images: the **entrance pupil** (blue) is how the stop looks from the front, seen through the glass in front of it; the **exit pupil** (green) is how it looks from the back, seen through the glass behind it. The three heavy rays are the top and bottom edges of the oblique beam and its **chief ray**; the dashed parts are where each ray *seems* to be heading: at the entrance pupil's edges before the lens, from the exit pupil's edges after it.

**Try this**
- Choose the **double Gauss**: the stop is 20 mm wide, but the entrance pupil is **33 mm** wide and lies 59 mm behind the front vertex, *behind* the stop itself. From the front you see a stop that is larger and farther away than the real one.
- Look at the exit pupil of the same lens: 36 mm wide and **in front of** the stop. The two pupils are different sizes — their ratio is the pupil magnification, 1.09.
- Raise the **field angle**: the beam stays aimed at the same entrance pupil and leaves from the same exit pupil, and the chief ray always runs through both centres.
- Choose the **eye**: its entrance pupil is the iris seen through the cornea, 13 % larger and 0.6 mm in front of the real one.
- Close the iris: both pupils shrink together, and the f-number rises.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'The system', options: [['Cooke triplet, f = 50 mm', 'cooke-triplet'], ['Double Gauss, f ≈ 100 mm', 'double-gauss'], ['Schematic eye, f ≈ 17 mm', 'eye']], value: params.lens || 'double-gauss' },
        { id: 'field', label: 'Field angle of the beam', min: 0, max: 25, step: 0.5, value: params.field != null ? params.field : 8, unit: '°' },
        { id: 'iris', label: 'Iris opening (% of the full one)', min: 35, max: 100, step: 1, value: 100, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['stop', 'Aperture stop'], ['ep', 'Entrance pupil'], ['xp', 'Exit pupil'], ['mp', 'Pupil magnification'], ['N', 'f-number (focal length ÷ entrance pupil)'], ['lost', 'Rays blocked by a rim']]);
      const bracket = (c, m, z, half, color, label, above) => {
        const x = m.X(z), y1 = m.Y(half), y2 = m.Y(-half);
        c.save(); c.strokeStyle = color; c.lineWidth = 2.2; c.setLineDash([5, 3]); c.beginPath(); c.moveTo(x, y1); c.lineTo(x, y2); c.stroke(); c.setLineDash([]);
        c.beginPath(); c.moveTo(x - 6, y1); c.lineTo(x + 6, y1); c.moveTo(x - 6, y2); c.lineTo(x + 6, y2); c.stroke(); c.restore();
        kit.label(c, label, x, above ? y1 - 11 : y2 + 12, { align: 'center', color, weight: 650, size: 12 });
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const sys = library(O, V.lens);
        const si = Sy.stopIndex(sys); sys.surfaces[si].sd *= V.iris / 100;
        const par = Sy.paraxial(sys, 550), zs = par.zs, fa = V.field * D2R;
        const zS = -0.2 * par.zImage, zEnd = par.zImage;
        const sdMax = Math.max.apply(null, sys.surfaces.map(s => s.sd || 0));
        const yHalf = Math.max(sdMax * 1.12, Math.abs(par.efl * Math.tan(fa)) * 1.15, par.epd * 0.7, par.xpd * 0.7);
        const m = S.map(st, zS, zEnd + 0.03 * zEnd, yHalf, { left: 14, right: 14, top: 30, bottom: 30 });
        S.axis(c, m.X(zS), m.y0, m.X(zEnd));
        S.system(c, sys, m, { stop: false });
        S.stop(c, m.X(zs[si]), m.y0, m.s * yHalf * 0.92, m.s * sys.surfaces[si].sd, { color: C.muted, width: 3 });
        S.screen(c, m.X(zEnd), m.y0, m.s * Math.max(Math.abs(par.efl * Math.tan(fa)) * 1.2, yHalf * 0.2));
        const fan = Sy.fan2d(sys, { nm: 550, n: 9, field: fa, zStart: zS, zEnd });
        let lost = 0;
        fan.forEach((r, i) => {
          if (!r.ok) lost++;
          const key = i === 0 || i === 4 || i === 8;
          S.ray(c, r.pts.map(p => [m.X(p[0]), m.Y(p[1])]), key ? { color: i === 4 ? C.warn : S.nm(550), width: 2.2, arrows: false } : { nm: 550, width: 1, alpha: 0.35, arrows: false });
          if (key && r.ok && r.tr.pts.length > 2) {
            const P0 = r.tr.pts[0], P1 = r.tr.pts[1], k = (P1[1] - P0[1]) / (P1[2] - P0[2]);
            if (par.zEP > P1[2]) S.virtual(c, m.X(P1[2]), m.Y(P1[1]), m.X(par.zEP), m.Y(P1[1] + (par.zEP - P1[2]) * k), { color: C.accent });
            const t = r.tr, kk = t.d[1] / t.d[2];
            if (par.zXP < t.p[2]) S.virtual(c, m.X(t.p[2]), m.Y(t.p[1]), m.X(par.zXP), m.Y(t.p[1] + (par.zXP - t.p[2]) * kk), { color: C.ok });
          }
        });
        bracket(c, m, par.zEP, par.epd / 2, C.accent, 'entrance pupil', true);
        bracket(c, m, par.zXP, par.xpd / 2, C.ok, 'exit pupil', false);
        kit.label(c, 'stop', m.X(zs[si]) + 6, m.Y(yHalf * 0.92) - 4, { color: C.muted, size: 11.5 });
        kit.label(c, 'image plane', m.X(zEnd), m.y0 - m.s * yHalf * 0.2 - 12, { align: 'center', color: C.muted, size: 11.5 });
        const zLast = zs[zs.length - 1], dx = par.zXP - zLast;
        ro.set('stop', 'Ø ' + num(2 * sys.surfaces[si].sd, 1) + ' mm, ' + num(zs[si], 1) + ' mm behind the front vertex');
        ro.set('ep', 'Ø ' + num(par.epd, 1) + ' mm, ' + num(Math.abs(par.zEP), 1) + ' mm ' + (par.zEP >= 0 ? 'behind' : 'in front of') + ' the front vertex' + (par.zEP >= 0 ? ' (virtual)' : ''));
        ro.set('xp', 'Ø ' + num(par.xpd, 1) + ' mm, ' + num(Math.abs(dx), 1) + ' mm ' + (dx <= 0 ? 'in front of' : 'behind') + ' the last vertex' + (dx <= 0 ? ' (virtual)' : ''));
        ro.set('mp', num(par.xpd / par.epd, 3) + '  (exit ÷ entrance)');
        ro.set('N', 'f/' + num(par.fno, 2) + '  (f = ' + num(par.efl, 1) + ' mm, D = ' + num(par.epd, 1) + ' mm)');
        ro.set('lost', lost + ' of ' + fan.length + (lost ? '  (drawn faint: the beam is clipped, see vignetting)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the field stop */
  Hyper.sim('px-field', {
    title: 'The field stop: what the camera can see',
    blurb: `A camera as the textbook draws it. The **sensor** (or a mask in front of it) is the **field stop**: the opening that decides how much of the scene is imaged. Its image in object space is the **entrance window** — the bar on the left, the part of the scene that lands on the sensor. The chief rays through the centre of the lens go from the edges of that window to the edges of the sensor, so the half-angle at the lens is set by the field-stop size and the distance behind the lens, nothing else.

The picture is to scale in angles (the scene bar is drawn at a fixed multiple of the lens-to-sensor distance); the real width of the scene at the chosen distance is in the readout.

**Try this**
- Full frame, **50 mm**, subject at infinity: the field is 39.6° × 27° (46.8° on the diagonal), the classic "normal" lens.
- Switch the sensor to **2/3″** with the same lens: the field falls to 10° × 7.5°. Same lens, smaller field stop.
- Slide the **mask** down: a smaller field stop, the same lens, and the field shrinks in proportion. Whatever is the smallest opening *in the image plane* is the field stop.
- Focus closer (**0.5 m**): the lens moves away from the sensor, v grows, and the field narrows slightly — "focus breathing".`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 280, maxH: 400 });
      const FORMATS = ['1/2.3"', '2/3"', '1"', 'APS-C', 'Full frame'];
      const ctl = kit.controls(box.side, [
        { id: 'sensor', type: 'select', label: 'The field stop is a sensor of', options: FORMATS.map(f => [O.cam.sensor(f).name + ' (' + O.cam.sensor(f).w + ' × ' + O.cam.sensor(f).h + ' mm)', f]), value: params.sensor || 'Full frame' },
        { id: 'f', label: 'Focal length', min: 8, max: 400, value: params.f || 50, log: true, sig: 3, fmt: v => kit.fmt(v, 3) + ' mm' },
        { id: 'mask', label: 'Mask in front of the sensor', min: 20, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'dist', type: 'select', label: 'Focused on', options: [['infinity', Infinity], ['10 m', 10000], ['2 m', 2000], ['0.5 m', 500]], value: Infinity }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['open', 'Field-stop opening (w × h)'], ['fov', 'Field of view, w × h (diagonal)'], ['scene', 'The scene covered'], ['v', 'Lens-to-sensor distance'], ['eq', 'Same field on full frame needs']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const s = O.cam.sensor(V.sensor), fr = V.mask / 100, w = s.w * fr, hh = s.h * fr;
        const fv = O.cam.fov({ f: V.f, sensor: { w, h: hh }, distance: V.dist });
        const v = fin(V.dist) ? V.f * V.dist / (V.dist - V.f) : V.f, wh = w / 2;
        const zMin = -1.6 * v, zMax = 1.1 * v, yHalf = 1.6 * (s.w / 2);
        const m = S.map(st, zMin, zMax, yHalf, { left: 24, right: 28, top: 26, bottom: 32 });
        S.axis(c, m.X(zMin), m.y0, m.X(zMax));
        const a = v / 8;                                                  // the lens, drawn f/4 of its image distance
        // the entrance window: the field stop imaged into the scene
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(m.X(zMin), m.Y(1.6 * wh)); c.lineTo(m.X(zMin), m.Y(-1.6 * wh)); c.stroke(); c.restore();
        kit.label(c, 'scene', m.X(zMin) + 8, m.Y(1.6 * wh) - 2, { color: C.accent, weight: 650 });
        kit.label(c, 'entrance window', m.X(zMin) + 8, m.Y(1.6 * wh) + 13, { color: C.accent, size: 11.5 });
        // chief rays through the centre of the lens, and the cone of the edge point
        const top = [m.X(zMin), m.Y(1.6 * wh)], bot = [m.X(zMin), m.Y(-1.6 * wh)];
        S.ray(c, [top, [m.X(0), m.y0], [m.X(v), m.Y(-wh)]], { color: C.warn, width: 1.8, arrows: true, minArrow: 90 });
        S.ray(c, [bot, [m.X(0), m.y0], [m.X(v), m.Y(wh)]], { color: C.warn, width: 1.8, arrows: true, minArrow: 90 });
        for (const sgn of [1, -1]) {
          S.ray(c, [top, [m.X(0), m.Y(sgn * a)], [m.X(v), m.Y(-wh)]], { nm: 580, width: 1, alpha: 0.4, arrows: false });
          S.ray(c, [bot, [m.X(0), m.Y(sgn * a)], [m.X(v), m.Y(wh)]], { nm: 580, width: 1, alpha: 0.4, arrows: false });
        }
        S.thinLens(c, m.X(0), m.y0, m.s * Math.max(a * 1.25, 4), 1, { label: 'lens (stop at the lens)' });
        // the sensor and the mask
        S.sensor(c, m.X(v), m.y0, m.s * s.w / 2, { pixels: 16 });
        if (fr < 0.999) { S.stop(c, m.X(v) - 3, m.y0, m.s * s.w / 2 * 1.06, m.s * wh, { color: C.warn, width: 3.5 }); kit.label(c, 'mask = field stop', m.X(v), m.Y(s.w / 2 * 1.06) - 12, { align: 'center', color: C.warn, size: 11.5 }); }
        else kit.label(c, 'sensor = field stop', m.X(v), m.Y(s.w / 2) - 16, { align: 'center', color: C.ok, size: 11.5 });
        const th = Math.atan(wh / v);
        S.angle(c, m.X(0), m.y0, Math.min(46, m.s * v * 0.35), Math.PI, Math.PI + th, 'θ', { color: C.warn });
        S.dim(c, m.X(0), m.Y(-yHalf * 0.93), m.X(v), m.Y(-yHalf * 0.93), 'v = ' + num(v, 1) + ' mm', { off: 12 });
        ro.set('open', num(w, 1) + ' × ' + num(hh, 1) + ' mm');
        ro.set('fov', num(fv.h * R2D, 1) + '° × ' + num(fv.v * R2D, 1) + '°  (' + num(fv.d * R2D, 1) + '°)');
        ro.set('scene', fin(V.dist) ? num(fv.W / 1000, 3) + ' × ' + num(fv.Hh / 1000, 3) + ' m at ' + num(V.dist / 1000, 1) + ' m' : num(2 * 10 * Math.tan(fv.h / 2), 2) + ' × ' + num(2 * 10 * Math.tan(fv.v / 2), 2) + ' m at 10 m');
        ro.set('v', num(v, 2) + ' mm' + (fin(V.dist) ? '  (focused close: longer than f)' : '  (= f at infinity)'));
        ro.set('eq', 'f = ' + num(V.f * 36 / w, 0) + ' mm  (36 mm wide)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ marginal and chief rays, the invariant */
  Hyper.sim('px-rays', {
    title: 'The marginal ray and the chief ray',
    blurb: `A real achromatic lens (f = 100 mm) with a stop in front of it, imaging an object arrow. Two rays do all the first-order work. The **marginal ray** (blue) starts on the axis at the object, grazes the edge of the stop, and ends on the axis at the image: it fixes where the image is and how wide the cone is. The **chief ray** (orange) starts at the top of the object, runs through the *centre* of the stop, and lands at the top of the image: it fixes how large the image is, and at what angle the light arrives. The faint orange rays are the rim of the oblique beam. (The vertical scale is stretched so that the heights can be seen.)

**Try this**
- Slide the **stop** along the axis. The image does not move or change size — but the chief ray now crosses the lens at a different height, and its **angle at the image** changes.
- Put the stop **99 mm in front** of the lens (at its front focal point): the chief ray leaves parallel to the axis, and its angle at the image falls to zero. That is the telecentric condition.
- Make the stop wider: the marginal ray rises, the cone widens, the image gets brighter — and the chief ray does not care.
- Move the object closer: the image moves away and grows.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const mode = params.mode === 'invariant' ? 'invariant' : 'rays';
      const st = kit.stage(box.stage, { aspect: 0.47, minH: 280, maxH: 400 });
      const lens = clone(O.lens('achromat').surfaces); lens.forEach(s => { s.stop = false; s.sd = 16; });
      const ctl = kit.controls(box.side, [
        { id: 'Lo', label: 'Object to lens', min: 160, max: 400, step: 5, value: params.Lo || 250, unit: 'mm' },
        { id: 'h', label: 'Height of the object', min: 1, max: 12, step: 0.5, value: params.h || 6, unit: 'mm' },
        { id: 'a', label: 'Stop in front of the lens by', min: 0, max: 100, step: 1, value: params.a != null ? params.a : 20, unit: 'mm' },
        { id: 'r', label: 'Stop radius', min: 1, max: 8, step: 0.25, value: params.r || 4, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, mode === 'rays'
        ? [['mh', 'Marginal ray: height at the lens'], ['mu', 'Marginal ray: half-angle at object → image'], ['ch', 'Chief ray: height at the lens'], ['cra', 'Chief ray angle at the image'], ['img', 'Image height, chief ray (traced)'], ['pax', 'Image height, m·h (first order)']]
        : [['obj', 'Object: h, u, and n·u·h'], ['img', 'Image: h′, u′, and n′·u′·h′'], ['same', 'The two products'], ['m', 'Magnification h′/h and angle ratio u′/u'], ['G', 'Étendue G = π² H²']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const dS = V.Lo - V.a;                                          // object to stop; object to lens is Lo
        const sys = { surfaces: [{ R: 0, t: V.a, n: 1, sd: V.r, stop: true }].concat(clone(lens)), object: dS };
        const par = Sy.paraxial(sys, 550), zObj = -dS, zImg = par.zImage;
        const yHalf = Math.max(18, V.h * 1.3, Math.abs(par.m) * V.h * 1.3);
        const m = amap(st, zObj - 14, zImg + 16, yHalf, { left: 14, right: 14, top: 26, bottom: 26 }, 3.5);
        S.axis(c, m.X(zObj - 14), m.y0, m.X(zImg + 16));
        S.system(c, sys, m, { stop: false });
        S.stop(c, m.X(0), m.y0, m.sy * 14.5, m.sy * V.r, { color: C.text, width: 3 });
        S.object(c, m.X(zObj), m.y0, m.sy * V.h, { label: 'object' });
        S.object(c, m.X(zImg), m.y0, m.sy * par.m * V.h, { dash: true, label: 'image' });
        kit.label(c, 'vertical scale × ' + num(m.k, 1), 14, 12, { color: C.faint, size: 11 });
        const go = (py, fld) => Sy.trace(sys, Sy.aim(sys, 0, py, fld, par, 550), 550);
        const rimU = go(1, V.h), rimL = go(-1, V.h), chief = go(0, V.h), mU = go(1, 0), mL = go(-1, 0);
        for (const t of [rimU, rimL]) S.ray(c, lineOf(m, t, zImg), { color: C.warn, alpha: 0.4, width: 1, arrows: false });
        for (const t of [mU, mL]) S.ray(c, lineOf(m, t, zImg), { color: C.accent, width: 2, arrows: true, minArrow: 120 });
        S.ray(c, lineOf(m, chief, zImg), { color: C.warn, width: 2.4, arrows: true, minArrow: 120 });
        if (chief.ok && fin(par.zXP) && par.zXP < chief.p[2]) { const kk = chief.d[1] / chief.d[2]; S.virtual(c, m.X(chief.p[2]), m.Y(chief.p[1]), m.X(par.zXP), m.Y(chief.p[1] + (par.zXP - chief.p[2]) * kk), { color: C.warn }); }
        kit.dot(c, m.X(0), m.y0, 3, C.warn);
        kit.label(c, 'marginal ray', m.X(zObj * 0.45), m.Y(V.r * 0.55) - 9, { align: 'center', color: C.accent, weight: 650 });
        kit.label(c, 'chief ray', m.X(zObj) + 10, m.Y(V.h) - 14, { color: C.warn, weight: 650 });
        kit.label(c, 'stop', m.X(0), m.Y(14.5) - 10, { align: 'center', color: C.muted, size: 11.5 });
        const u = (par.epd / 2) / dS, up = 1 / (2 * par.fnoWorking), hI = Math.abs(par.m) * V.h;
        if (mode === 'rays') {
          const ang = t => (t.ok ? Math.atan(t.d[1] / t.d[2]) : NaN);
          ro.set('mh', mU.ok ? num(mU.pts[2][1], 2) + ' mm (the lens is 16 mm in radius)' : 'clipped');
          ro.set('mu', num(u * R2D, 2) + '° → ' + num(Math.abs(ang(mU)) * R2D, 2) + '°');
          ro.set('ch', chief.ok ? num(chief.pts[2][1], 2) + ' mm' : 'clipped');
          ro.set('cra', chief.ok ? num(Math.abs(ang(chief)) * R2D, 2) + '°' : 'clipped');
          ro.set('img', chief.ok ? num(Math.abs(Sy.at(chief, zImg)[1]), 3) + ' mm' : 'clipped');
          ro.set('pax', num(hI, 3) + ' mm  (m = ' + num(par.m, 3) + ')');
        } else {
          ro.set('obj', num(V.h, 1) + ' mm,  ' + num(u, 4) + ' rad,  H = ' + num(u * V.h, 4) + ' mm·rad');
          ro.set('img', num(hI, 2) + ' mm,  ' + num(up, 4) + ' rad,  H′ = ' + num(up * hI, 4) + ' mm·rad');
          ro.set('same', num(u * V.h / (up * hI), 4) + '  (the invariant is conserved)');
          ro.set('m', num(par.m, 3) + '  and  ' + num(up / u, 3) + '  (their product is 1)');
          ro.set('G', num(Math.PI * Math.PI * Math.pow(u * V.h, 2), 5) + ' mm²·sr');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ numerical aperture */
  Hyper.sim('px-na', {
    title: 'Numerical aperture: the cone an objective can collect',
    blurb: `A point on a specimen, under a glass cover slip (n = 1.52), sends light in every direction. An objective collects only the rays inside its **cone**, whose size is the **numerical aperture** NA = n sin θ. Here the rays are spaced evenly in n sin θ, the number that does not change when a ray crosses a flat boundary. **Blue-green rays** are accepted; **grey rays** are refracted but fall outside the cone; **dashed orange rays** meet the boundary beyond the critical angle and are reflected back into the glass — they can never reach an objective.

The distances in the picture are schematic; every angle is real.

**Try this**
- With **air** between cover glass and lens, raise the NA to its limit: nothing above **1.0** is possible, because a ray leaving the glass at a grazing angle already has n sin θ = 1. In practice dry objectives stop near 0.95.
- Change the gap to **immersion oil** (n = 1.515): the boundary no longer bends or traps anything, and an NA of **1.4** becomes possible — the cone in the glass is 67° wide on each side.
- Look at the readout: from NA 0.5 to 1.4 the smallest resolvable detail falls from 550 nm to 196 nm (Abbe, green light), and the light collected rises by a factor of 7.8.
- Switch the light to **blue**: the detail limit shrinks in proportion to the wavelength.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300, maxH: 430 });
      const NG = 1.52;
      const ctl = kit.controls(box.side, [
        { id: 'NA', label: 'Numerical aperture of the objective', min: 0.1, max: 1.45, value: params.NA || 0.65, log: true, sig: 3, fmt: v => 'NA ' + kit.fmt(v, 3) },
        { id: 'imm', type: 'select', label: 'Between the cover glass and the front lens', options: [['air (n = 1.000)', 1.0], ['water (n = 1.333)', 1.333], ['immersion oil (n = 1.515)', 1.515]], value: params.imm || 1.0 },
        { id: 'nm', type: 'select', label: 'Light', options: [['blue, 450 nm', 450], ['green, 550 nm', 550], ['red, 650 nm', 650]], value: 550 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['na', 'Numerical aperture used'], ['ang', 'Half-angle of the cone: in the medium · in the glass'], ['max', 'Highest NA this medium allows'], ['trap', 'Rays trapped by total reflection'], ['res', 'Smallest detail: Abbe λ/2NA · Rayleigh 0.61 λ/NA'], ['N', 'Equivalent f-number, 1/(2 NA)'], ['light', 'Light gathered, against NA 0.25']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, y0 = Hh / 2;
        const nI = V.imm, NAeff = Math.min(V.NA, 0.995 * nI);
        const aLim = Math.asin(Math.min(1, NAeff / NG)), bLim = Math.asin(Math.min(1, NAeff / nI));
        const avg = 5 / 12 * Math.tan(aLim) + 7 / 12 * Math.tan(bLim);
        const L = Math.max(0.06 * W, Math.min(0.5 * W, 0.3 * Hh / Math.max(1e-6, avg)));
        const xP = 0.07 * W, xG = xP + L * 5 / 12, xL = xP + L, hL = L * avg;
        c.fillStyle = S.glass(0.3); c.fillRect(xP, 0, xG - xP, Hh);
        if (nI > 1.01) { c.fillStyle = S.glass((nI - 1) * 0.3); c.fillRect(xG, 0, xL - xG, Hh); }
        c.save(); c.strokeStyle = S.edge(); c.lineWidth = 1.2; c.beginPath(); c.moveTo(xP, 0); c.lineTo(xP, Hh); c.moveTo(xG, 0); c.lineTo(xG, Hh); c.stroke(); c.restore();
        S.axis(c, xP, y0, W - 8);
        const K = 12; let trapped = 0;
        for (let k = -K; k <= K; k++) {
          const s = k / K * 0.99 * NG, al = Math.asin(s / NG), y1 = (xG - xP) * Math.tan(al);
          if (Math.abs(s) >= nI * 0.9995) { trapped++; S.ray(c, [[xP, y0], [xG, y0 - y1], [xP, y0 - 2 * y1]], { color: C.warn, alpha: 0.6, dash: [4, 3], width: 1.1, arrows: false }); continue; }
          const y2 = y1 + (xL - xG) * Math.tan(O.snell(NG, nI, al));
          const pts = [[xP, y0], [xG, y0 - y1], [xL, y0 - y2]];
          if (Math.abs(s) <= NAeff + 1e-9) S.ray(c, pts, { nm: V.nm, width: 1.6, arrows: false });
          else S.ray(c, pts, { color: C.faint, width: 1, arrows: false });
        }
        kit.dot(c, xP, y0, 3.5, C.text);
        S.lens(c, xL, y0, Math.max(hL, 3), { R1: Math.max(hL * 1.5, 12), R2: 0, t: Math.max(7, hL * 0.3) });
        const bw = hL * 1.3 + 8;
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.4; c.beginPath(); c.moveTo(xL, y0 - hL); c.lineTo(xL, y0 - bw); c.lineTo(W - 8, y0 - bw); c.moveTo(xL, y0 + hL); c.lineTo(xL, y0 + bw); c.lineTo(W - 8, y0 + bw); c.stroke(); c.restore();
        S.angle(c, xP, y0, Math.min(46, 0.15 * Hh), 0, -aLim, 'θ', { color: C.text });
        kit.label(c, 'specimen', xP + 6, y0 + 22, { color: C.muted, size: 11.5 });
        kit.label(c, 'cover glass 1.52', (xP + xG) / 2, 14, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, nI > 1.01 ? (nI > 1.4 ? 'oil' : 'water') : 'air', (xG + xL) / 2, 14, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'objective', xL + 10, Math.min(Hh - 12, y0 + bw + 14), { color: C.muted, size: 11.5 });
        const tir = (nI >= NG);
        ro.set('na', 'NA = n sin θ = ' + num(NAeff, 3) + (V.NA > NAeff + 1e-6 ? '  (the medium cannot give more)' : ''));
        ro.set('ang', num(bLim * R2D, 1) + '° · ' + num(aLim * R2D, 1) + '°');
        ro.set('max', 'n = ' + num(nI, 3) + (nI < 1.01 ? '  (about 0.95 in practice)' : nI < 1.4 ? '  (about 1.2 in practice)' : '  (about 1.4 in practice)'));
        ro.set('trap', trapped ? trapped + ' of ' + (2 * K + 1) + ' rays here' : 'none (the boundary is index-matched)');
        ro.set('res', num(O.diff.abbe(V.nm, NAeff) * 1e9, 0) + ' nm · ' + num(0.61 * V.nm / NAeff, 0) + ' nm');
        ro.set('N', 'f/' + num(1 / (2 * NAeff), 2));
        ro.set('light', '× ' + num(Math.pow(NAeff / 0.25, 2), 1));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ vignetting */
  const NAMES_DG = ['the front of the first lens', 'the back of the first lens', 'the front of the front doublet', 'the cemented surface of the front doublet', 'the back of the front doublet', 'the iris', 'the front of the rear doublet', 'the cemented surface of the rear doublet', 'the back of the rear doublet', 'the front of the last lens', 'the back of the last lens'];
  const NAMES_CT = ['the front of the first lens', 'the back of the first lens', 'the front of the middle lens', 'the back of the middle lens', 'the front of the last lens', 'the back of the last lens'];
  const NAMES_HOOD = ['the hood', 'the lens rim', 'the lens rim'];
  Hyper.sim('px-vignette', {
    title: 'Vignetting: the pupil as an oblique beam sees it',
    blurb: `Rays are sent through a grid of points across the entrance pupil, at an angle to the axis, and each one is traced exactly. A ray that meets a rim — the edge of a lens, a hood, a baffle — is lost. What is left of the round pupil is a **cat's eye**, the overlap of the circles that the rims make when seen from that direction (the picture at the top right). The light that reaches the image is proportional to its area, on top of the natural cos⁴ fall-off.

**Try this**
- Choose **a lens with a hood** and raise the field angle: the hood's rim, 60 mm ahead of the lens, slides across the lens as seen from the side and cuts the bundle into a lens-shaped sliver. At 5° the pupil has lost 23 % of its area, at 10° half of it, at 15° three quarters.
- **Shorten the hood** to 0: the two rims coincide and the cat's eye hardly forms (99 % still gets through at 10°).
- Go back to 8° (61 % through) and **close the iris** to 50 %: the stop is now almost smaller than the cat's eye and 91 % gets through. Stopping down cures vignetting.
- Try the **triplet** and the **double Gauss**: both are clean inside the field they were designed for (20° and 14°); a few degrees beyond it the rims clip, and the readout names the rim that stops most rays. Compare the graph with the cos⁴ curve alone.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 420 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'sys', type: 'select', label: 'The lens', options: [['a single lens with a hood', 'hood'], ['Cooke triplet, f = 50 mm', 'cooke-triplet'], ['double Gauss, f ≈ 100 mm', 'double-gauss']], value: params.sys || 'hood' },
        { id: 'field', label: 'Field angle', min: 0, max: 30, step: 0.5, value: params.field != null ? params.field : 8, unit: '°' },
        { id: 'hood', label: 'Hood length (single lens)', min: 0, max: 100, step: 1, value: params.hood != null ? params.hood : 60, unit: 'mm' },
        { id: 'iris', label: 'Iris opening (% of the full one)', min: 30, max: 100, step: 1, value: 100, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pass', 'Share of the pupil that gets through'], ['cos4', 'Natural fall-off, cos⁴θ'], ['both', 'Relative illumination, both together'], ['ev', 'Corner loss against the centre'], ['clip', 'Most rays are stopped at']]);
      const plot = kit.plot(gb, { x: { label: 'field angle (°)', min: 0, max: 30 }, y: { label: 'relative illumination (%)', min: 0, max: 100 }, legend: true }, 150);
      const build = () => {
        let sys;
        if (V.sys === 'hood') { const l = O.lens('biconvex'); sys = { surfaces: [{ R: 0, t: V.hood, n: 1, sd: 13.2 }].concat(clone(l.surfaces)) }; }
        else sys = library(O, V.sys);
        const si = Sy.stopIndex(sys); sys.surfaces[si].sd *= V.iris / 100;
        return sys;
      };
      const names = () => (V.sys === 'hood' ? NAMES_HOOD : V.sys === 'cooke-triplet' ? NAMES_CT : NAMES_DG);
      const grid = (sys, par, fa, N, zs, ns) => {
        const ok = [], at = {}; let pass = 0, tot = 0;
        for (let j = 0; j < N; j++) { ok.push([]); for (let i = 0; i < N; i++) {
          const px = 2 * (i + 0.5) / N - 1, py = 1 - 2 * (j + 0.5) / N;
          if (px * px + py * py > 1) { ok[j].push(-1); continue; }
          tot++;
          const tr = Sy.trace(sys, Sy.aim(sys, px, py, fa, par, 550), 550, { zs, ns });
          if (tr.ok) { pass++; ok[j].push(1); } else { ok[j].push(0); at[tr.at] = (at[tr.at] || 0) + 1; }
        } }
        return { ok, pass, tot, at };
      };
      let curveKey = '', curve = null, axis29 = 1;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const sys = build(), par = Sy.paraxial(sys, 550), zs = par.zs, ns = Sy.indices(sys, 550), fa = V.field * D2R;
        // the curve over all angles (kept until the lens or the stop changes)
        const key = V.sys + '|' + V.hood + '|' + V.iris;
        if (key !== curveKey) {
          curveKey = key; curve = [];
          for (let a = 0; a <= 30; a += 2) { const g = grid(sys, par, a * D2R, 15, zs, ns); curve.push([a, g.pass / Math.max(1, g.tot)]); }
          const c0 = curve[0][1] || 1; curve.forEach(p => { p[1] = Math.min(1, p[1] / c0); });      // relative to the axis, so the stop's own edge is not counted
          const g0 = grid(sys, par, 0, 29, zs, ns); axis29 = g0.pass / Math.max(1, g0.tot) || 1;
        }
        const sdMax = Math.max.apply(null, sys.surfaces.map(s => s.sd || 0));
        const zS = -0.18 * par.zImage, zEnd = par.zImage;
        const yHalf = Math.max(sdMax * 1.15, Math.abs(par.efl * Math.tan(fa)) * 1.1);
        const m = S.map(st, zS, zEnd + 4, yHalf, { left: 14, right: 14, top: 22, bottom: 24 });
        S.axis(c, m.X(zS), m.y0, m.X(zEnd));
        S.system(c, sys, m, { stop: false });
        const si = Sy.stopIndex(sys);
        if (V.sys === 'hood') { S.stop(c, m.X(0), m.y0, m.s * (sys.surfaces[0].sd + 5), m.s * sys.surfaces[0].sd, { color: C.muted, width: 3 }); kit.label(c, 'hood', m.X(0), m.Y(sys.surfaces[0].sd + 5) - 10, { align: 'center', color: C.muted, size: 11.5 }); }
        else { S.stop(c, m.X(zs[si]), m.y0, m.s * (sys.surfaces[si].sd + 4), m.s * sys.surfaces[si].sd, { color: C.muted, width: 3 }); kit.label(c, 'stop', m.X(zs[si]), m.Y(sys.surfaces[si].sd + 4) - 10, { align: 'center', color: C.muted, size: 11.5 }); }
        S.screen(c, m.X(zEnd), m.y0, m.s * Math.max(Math.abs(par.efl * Math.tan(fa)) * 1.15, yHalf * 0.25));
        S.rays(c, Sy.fan2d(sys, { nm: 550, n: 15, field: fa, zStart: zS, zEnd }), m, { nm: 550, width: 1.2, lost: C.warn });
        // the cat's eye: the entrance pupil as the field direction sees it
        const N = 29, g = grid(sys, par, fa, N, zs, ns), px0 = st.W - 110, py0 = 24, sz = 92;
        c.fillStyle = C.surface; c.fillRect(px0 - 6, py0 - 6, sz + 12, sz + 30);
        S.cells(c, px0, py0, sz, sz, N, N, (u, v) => { const val = g.ok[Math.min(N - 1, Math.floor(v * N))][Math.min(N - 1, Math.floor(u * N))]; return val > 0 ? [255, 238, 170] : val === 0 ? [96, 60, 66] : [24, 26, 46]; });
        kit.label(c, 'pupil seen from the field', px0 + sz / 2, py0 + sz + 11, { align: 'center', color: C.muted, size: 11 });
        const frac = Math.min(1, g.pass / Math.max(1, g.tot) / axis29), c4 = Math.pow(Math.cos(fa), 4);
        let worst = -1, wn = 0; Object.keys(g.at).forEach(k => { if (g.at[k] > wn) { wn = g.at[k]; worst = +k; } });
        ro.set('pass', num(frac * 100, 0) + ' % of the pupil');
        ro.set('cos4', num(c4 * 100, 0) + ' %');
        ro.set('both', num(frac * c4 * 100, 0) + ' % of the axial value');
        ro.set('ev', frac * c4 > 0.001 ? num(Math.log2(1 / (frac * c4)), 2) + ' stops darker' : 'black: everything is blocked');
        ro.set('clip', worst >= 0 ? (names()[worst] || 'surface ' + worst) + '  (' + num(wn / Math.max(1, g.tot) * 100, 0) + ' % of the pupil)' : 'nothing: no ray is lost');
        plot.set({
          series: [{ pts: curve.map(p => [p[0], p[1] * 100]), label: 'vignetting alone', width: 2.2 }, { pts: curve.map(p => [p[0], Math.pow(Math.cos(p[0] * D2R), 4) * 100]), label: 'cos⁴θ alone', dash: [5, 4] }, { pts: curve.map(p => [p[0], p[1] * Math.pow(Math.cos(p[0] * D2R), 4) * 100]), label: 'both together', width: 2.2, color: C.warn }],
          vlines: [{ x: V.field, color: C.muted, label: 'now' }]
        });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ telecentricity */
  Hyper.sim('px-telecentric', {
    title: 'Telecentricity: a stop at a focal point',
    blurb: `The same achromatic lens (f = 100 mm) with its stop in four places. The object is an arrow 300 mm away (for the double-telecentric pair of lenses it stands in the front focal plane of the first one, 99 mm away, which is where such lenses are used); the sensor sits in the image plane. The heavy orange line is the **chief ray** from the tip of the arrow, through the centre of the stop. Where the stop is decides **where that ray points**: and that decides what happens to the picture when the object — or the sensor — is not exactly where it should be. (The vertical scale is stretched so that the chief rays can be seen.)

**Try this**
- **An ordinary lens**: move the object 30 mm farther away. The image shrinks by 9.1 % — perspective: nearer is bigger. The chief ray is inclined to the axis on both sides of the lens.
- **Object-space telecentric** (stop at the rear focal plane): the chief ray runs *parallel to the axis* in front of the lens. Move the object by ±30 mm: the tip is blurred, but the centre of the blur does not move and the image height changes by 0.01 %. Now move the **sensor** 4 mm instead: the size changes by 8 %, because the chief ray is inclined after the lens.
- **Image-space telecentric** (stop at the front focal plane): the chief ray *arrives parallel to the axis* at the sensor. Move the **sensor** 4 mm: the image height does not change at all. Move the object 30 mm and it changes by 13 % — telecentricity on one side protects only that side.
- **Double telecentric**: both at once, with two lenses and the stop between them: the size depends neither on the object distance nor on the sensor position.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 290, maxH: 400 });
      const lens = clone(O.lens('achromat').surfaces); lens.forEach(s => { s.stop = false; s.sd = 16; });
      const pl = Sy.paraxial({ surfaces: clone(lens) }, 550), SO = 300;
      const flip = surfs => { const out = []; for (let i = surfs.length - 1; i >= 0; i--) { const s = surfs[i], o = { R: s.R ? -s.R : 0, n: i === 0 ? 1 : surfs[i - 1].n, sd: s.sd }; if (i > 0) o.t = surfs[i - 1].t; out.push(o); } return out; };
      const build = (mode, r) => {
        const L1 = clone(lens);
        if (mode === 'ord') return { surfaces: [{ R: 0, t: 0, n: 1, sd: r, stop: true }].concat(L1), si: 0, lead: 0 };
        if (mode === 'img') return { surfaces: [{ R: 0, t: pl.ffd, n: 1, sd: r, stop: true }].concat(L1), si: 0, lead: -pl.ffd };
        L1[L1.length - 1].t = pl.bfd;
        if (mode === 'obj') return { surfaces: L1.concat([{ R: 0, n: 1, sd: r, stop: true }]), si: L1.length, lead: 0 };
        return { surfaces: L1.concat([{ R: 0, t: pl.bfd, n: 1, sd: r, stop: true }]).concat(flip(clone(lens))), si: L1.length, lead: pl.ffd - SO };
      };
      // a ray from the object tip (height h, distance so ahead of the first surface) that crosses the stop at height yt
      const aimStop = (sys, yt, h) => {
        const zs = Sy.vertices(sys), ns = Sy.indices(sys, 550), so = sys.object, si = sys.si;
        const ray = u => ({ p: [0, h, -so], d: [0, Math.sin(u), Math.cos(u)] });
        const miss = u => { const tr = Sy.trace(sys, ray(u), 550, { clip: false, zs, ns }); return tr.pts.length > si + 1 ? tr.pts[si + 1][1] - yt : NaN; };
        let u0 = Math.atan2(yt - h, so), u1 = u0 + 0.01, f0 = miss(u0), f1 = miss(u1);
        for (let i = 0; i < 30 && Math.abs(f1) > 1e-9 && fin(f1) && fin(f0); i++) { const u2 = u1 - f1 * (u1 - u0) / ((f1 - f0) || 1e-12); u0 = u1; f0 = f1; u1 = u2; f1 = miss(u1); }
        return fin(f1) ? ray(u1) : ray(u0);
      };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Where the stop is', options: [['ordinary: at the lens', 'ord'], ['image-space telecentric: front focal plane', 'img'], ['object-space telecentric: rear focal plane', 'obj'], ['double telecentric: two lenses, stop between', 'dbl']], value: params.mode || 'obj' },
        { id: 'h', label: 'Height of the object', min: 1, max: 4, step: 0.5, value: 4, unit: 'mm' },
        { id: 'dz', label: 'Move the object away by', min: -30, max: 30, step: 1, value: params.dz || 0, unit: 'mm' },
        { id: 'ds', label: 'Move the sensor back by', min: -8, max: 8, step: 0.25, value: params.ds || 0, unit: 'mm' },
        { id: 'r', label: 'Stop radius', min: 1, max: 3, step: 0.25, value: 2, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ang', 'Chief-ray angle: object side · image side'], ['pup', 'Pupils'], ['size', 'Image height on the sensor'], ['chg', 'Change from the in-focus picture'], ['blur', 'Blur of the tip on the sensor']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const s0 = build(V.mode, V.r), sys0 = { surfaces: s0.surfaces, si: s0.si, object: SO + s0.lead };
        const par0 = Sy.paraxial(sys0, 550), zSens0 = par0.zImage, zSens = zSens0 + V.ds;
        const sys = { surfaces: s0.surfaces, si: s0.si, object: SO + s0.lead + V.dz };
        const zs = Sy.vertices(sys), zObj = -sys.object, zLast = zs[zs.length - 1];
        const frac = [-1, -0.5, 0, 0.5, 1];
        const trs = frac.map(f => { const r = aimStop(sys, f * V.r * 0.999, V.h); return Sy.trace(sys, r, 550); });
        const nom = Sy.trace(sys0, aimStop(sys0, 0, V.h), 550, { clip: false });
        const yNom = Sy.at(nom, zSens0)[1];
        const zMin = zObj - 12, zMax = Math.max(zSens, zLast) + 16;
        const yHalf = 18;
        const m = amap(st, zMin, zMax, yHalf, { left: 14, right: 14, top: 24, bottom: 26 }, 4);
        S.axis(c, m.X(zMin), m.y0, m.X(zMax));
        S.system(c, sys, m, { stop: false });
        S.stop(c, m.X(zs[s0.si]), m.y0, m.sy * 15, m.sy * V.r, { color: C.text, width: 3 });
        kit.label(c, 'stop', m.X(zs[s0.si]), m.Y(15) - 10, { align: 'center', color: C.muted, size: 11.5 });
        if (V.dz) S.object(c, m.X(-(SO + s0.lead)), m.y0, m.sy * V.h, { dash: true, color: C.faint });
        S.object(c, m.X(zObj), m.y0, m.sy * V.h, { label: 'object' });
        trs.forEach((t, i) => { if (t.pts.length > 1) S.ray(c, lineOf(m, t, zSens), i === 2 ? { color: C.warn, width: 2.6, arrows: true, minArrow: 140 } : { nm: 580, width: 1, alpha: 0.5, arrows: false }); });
        // the sensor in its place, and the in-focus image height for comparison
        c.save(); c.strokeStyle = C.ok; c.lineWidth = 3; c.beginPath(); c.moveTo(m.X(zSens), m.Y(15)); c.lineTo(m.X(zSens), m.Y(-15)); c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(m.X(zSens) - 26, m.Y(yNom)); c.lineTo(m.X(zSens) + 14, m.Y(yNom)); c.stroke(); c.restore();
        kit.label(c, 'sensor', m.X(zSens), m.Y(-15) + 12, { align: 'center', color: C.ok, size: 11.5 });
        const ch = trs[2], yS = ch.ok ? Sy.at(ch, zSens)[1] : NaN;
        if (fin(yS)) kit.dot(c, m.X(zSens), m.Y(yS), 3.5, C.warn);
        const ang = t => (t.pts.length > 1 ? Math.atan(t.d[1] / t.d[2]) : NaN);
        const o0 = Math.atan2(ch.pts[1][1] - ch.pts[0][1], ch.pts[1][2] - ch.pts[0][2]);
        const ys = trs.map(t => (t.ok ? Sy.at(t, zSens)[1] : NaN));
        kit.label(c, 'vertical scale × ' + num(m.k, 1), 14, 12, { color: C.faint, size: 11 });
        ro.set('ang', deg(Math.abs(o0), 2) + ' · ' + deg(Math.abs(ang(ch)), 2));
        ro.set('pup', par0.telecentricObject && par0.telecentricImage ? 'entrance and exit pupils both at infinity' : par0.telecentricObject ? 'entrance pupil at infinity; exit pupil at the stop' : par0.telecentricImage ? 'exit pupil at infinity; entrance pupil at the stop' : 'both pupils close to the lens');
        ro.set('size', fin(yS) ? num(Math.abs(yS), 3) + ' mm' : 'clipped by a rim');
        ro.set('chg', fin(yS) ? (yS / yNom - 1 >= 0 ? '+' : '−') + num(Math.abs(yS / yNom - 1) * 100, 2) + ' %' : '—');
        ro.set('blur', fin(ys[0]) && fin(ys[4]) ? num(Math.abs(ys[4] - ys[0]) * 1000, 0) + ' µm across' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ depth of focus */
  Hyper.sim('px-dof', {
    title: 'Depth of focus: how far the sensor may stray',
    blurb: `A real achromat behind an iris, and the light near its focus. The **bow-tie** is the cone of rays through the focus, drawn with the transverse scale stretched. The sensor (the green bar) may be anywhere the cone is narrower than the blur you accept, **c**: that is a distance **±N·c** each side of the focus (the pale band). Light is a wave too, so the focus is never a point: the dashed lines mark the **diffraction** tolerance ±2 λ N² (Rayleigh's quarter-wave rule). The graph below is the through-focus blur measured on the traced lens.

**Try this**
- Set **f/8**, c = 6 µm: the sensor tolerance is ±48 µm; the diffraction tolerance is ±70 µm. Both are fractions of a millimetre.
- Open to **f/4**: the geometric tolerance halves to ±24 µm, while the diffraction one falls fourfold, to ±18 µm. The lens's own aberrations now dominate the traced curve.
- Close to **f/22**: ±130 µm geometric, ±530 µm diffraction. The wave tolerance has overtaken the ray tolerance: the blur is limited by the Airy disc, not by defocus.
- Slide the **sensor** to the edge of the pale band: the spot in the inset is about as wide as a pixel of size c.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 250, maxH: 360 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const base = O.lens('achromat'), f0 = Sy.paraxial(base).efl;
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'f-number', min: 4, max: 32, value: params.N || 8, log: true, sig: 3, fmt: v => 'f/' + kit.fmt(v, 3) },
        { id: 'c', label: 'Blur you accept, c', min: 1, max: 30, step: 0.5, value: params.c || 6, unit: 'µm' },
        { id: 'nm', type: 'select', label: 'Light', options: [['blue, 450 nm', 450], ['green, 550 nm', 550], ['red, 650 nm', 650]], value: 550 },
        { id: 'z', label: 'Sensor position, in units of N·c', min: -3, max: 3, step: 0.05, value: params.z || 0.8 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['geo', 'Geometric tolerance, ± N·c'], ['dif', 'Diffraction tolerance, ± 2 λ N²'], ['tot', 'Total depth of focus (geometric)'], ['pos', 'The sensor is'], ['blur', 'Blur on the sensor now'], ['airy', 'Airy disc, 2.44 λ N']]);
      const plot = kit.plot(gb, { x: { label: 'sensor position from the best focus (µm)' }, y: { label: 'blur diameter (µm)', min: 0 }, legend: true }, 165);
      const build = N => ({ surfaces: [{ R: 0, t: 4, n: 1, sd: f0 / (2 * N), stop: true }].concat(base.surfaces.map(s => Object.assign({}, s, { stop: false }))) });
      let key = '', cache = null;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const N = V.N, lam = V.nm / 1000, geoT = N * V.c, difT = 2 * lam * N * N, span = 4 * Math.max(geoT, difT);
        const k = N.toFixed(2) + '|' + V.nm + '|' + span.toFixed(1);
        if (k !== key) {
          key = k;
          const sys = build(N), par = Sy.paraxial(sys, V.nm), bf = Sy.bestFocus(sys, { nm: V.nm, rings: 4 });
          const curve = [];
          for (let i = 0; i <= 60; i++) { const d = -span + 2 * span * i / 60, sp = Sy.spot(sys, { nm: V.nm, z: bf.z + d / 1000, rings: 4, par }); curve.push([d, 2 * sp.geo * 1000]); }
          cache = { sys, par, bf, curve };
        }
        const { sys, par, bf, curve } = cache;
        const dS = V.z * geoT, spS = Sy.spot(sys, { nm: V.nm, z: bf.z + dS / 1000, rings: 6, par }), blurS = 2 * spS.geo * 1000;
        // the bow-tie: the exit rays of the real lens, drawn between -span and +span about the best focus
        const x0 = 24, x1 = W - 24, sx = (x1 - x0) / (2 * span), yc = Hh * 0.5, hMax = span / (2 * N) * 1.05;
        const sy = Math.min(0.36 * Hh / hMax, sx * 6), X = d => (x0 + x1) / 2 + d * sx, Y = y => yc - y * sy;
        c.fillStyle = C.ok; c.globalAlpha = 0.12; c.fillRect(X(-geoT), 6, 2 * geoT * sx, Hh - 12); c.globalAlpha = 1;
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.beginPath(); for (const d of [-difT, difT]) { c.moveTo(X(d), 6); c.lineTo(X(d), Hh - 6); } c.stroke(); c.restore();
        S.axis(c, x0, yc, x1);
        const fan = Sy.fan2d(sys, { nm: V.nm, n: 11, zStart: -20 });
        for (const r of fan) if (r.ok) {
          const t = r.tr, yAt = d => (t.p[1] + (bf.z + d / 1000 - t.p[2]) * t.d[1] / t.d[2]) * 1000;
          S.ray(c, [[X(-span), Y(yAt(-span))], [X(span), Y(yAt(span))]], { nm: V.nm, width: 1.1, arrows: false });
        }
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([2, 3]); c.beginPath(); for (const s of [-1, 1]) { c.moveTo(x0, Y(s * V.c / 2)); c.lineTo(x1, Y(s * V.c / 2)); } c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.ok; c.lineWidth = 3; c.beginPath(); c.moveTo(X(dS), 8); c.lineTo(X(dS), Hh - 8); c.stroke(); c.restore();
        kit.label(c, '± N c', X(geoT), Hh - 14, { align: 'center', color: C.ok, size: 11.5 });
        kit.label(c, '± 2 λ N²', X(difT), 16, { align: 'center', color: C.accent, size: 11.5 });
        kit.label(c, 'focus', X(0), yc + 14, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'transverse scale × ' + num(sy / sx, 1) + ' · dotted: half of c', x0, Hh - 14, { color: C.faint, size: 11 });
        // the spot on the sensor, the Airy disc, and a pixel of size c
        const half = Math.min(46, Hh * 0.17), ix = W - half - 18, iy = 18 + half, airyUm = O.diff.airyRadius(V.nm, N) * 1e6;
        const rangeUm = 1.15 * Math.max(blurS / 2, V.c / 2, airyUm, 1), scale = half / (rangeUm / 1000);
        c.fillStyle = C.surface; c.fillRect(ix - half - 4, iy - half - 4, 2 * half + 8, 2 * half + 24);
        S.spot(c, spS, ix, iy, half, scale, { airy: airyUm / 1000, nm: V.nm });
        c.save(); c.strokeStyle = C.ok; c.lineWidth = 1.2; c.strokeRect(ix - V.c / 2 / rangeUm * half, iy - V.c / 2 / rangeUm * half, V.c / rangeUm * half, V.c / rangeUm * half); c.restore();
        kit.label(c, 'box = a pixel of c', ix, iy + half + 12, { align: 'center', color: C.muted, size: 10.5 });
        const mk = [{ x: dS, y: blurS, color: C.warn, label: 'sensor' }];
        plot.set({
          series: [{ pts: curve, label: 'traced lens', width: 2.2 }, { pts: curve.map(p => [p[0], Math.abs(p[0]) / N]), label: 'ideal cone, |δ|/N', dash: [5, 4] }],
          hlines: [{ y: V.c, color: C.ok, label: 'c' }, { y: 2.44 * lam * N, color: C.accent, label: 'Airy disc' }], vlines: [{ x: -geoT, color: C.ok }, { x: geoT, color: C.ok, label: '±N c' }, { x: -difT, color: C.accent }, { x: difT, color: C.accent, label: '±2λN²' }], marks: mk
        });
        ro.set('geo', '± ' + num(geoT, 1) + ' µm');
        ro.set('dif', '± ' + num(difT, 1) + ' µm' + (difT > geoT ? '  (larger: diffraction rules)' : '  (smaller: defocus rules)'));
        ro.set('tot', num(2 * geoT, 1) + ' µm');
        ro.set('pos', num(Math.abs(dS), 1) + ' µm ' + (dS >= 0 ? 'behind' : 'in front of') + ' the best focus: ' + (Math.abs(dS) <= geoT + 1e-9 ? 'inside the tolerance' : 'outside the tolerance'));
        ro.set('blur', num(blurS, 1) + ' µm (traced)  against c = ' + num(V.c, 1) + ' µm');
        ro.set('airy', num(2 * airyUm, 1) + ' µm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
