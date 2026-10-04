/* HYPER-OPTICS · sims/beam-shaping.js — simulations for shaping beams (prefix bs-).
 *   bs-gallery      one laser, seven optics: the pattern each makes, with its size and a cut through it
 *   bs-focus        focusing a laser beam: a singlet traced ray by ray against an asphere, the Airy disc and the Gaussian spot
 *   bs-cylinder     a cylinder lens: the fan of a line generator (mode line) or the thin waist of a light sheet (mode sheet)
 *   bs-axicon       a cone lens: the Bessel zone, the needle and the ring, with the on-axis intensity
 *   bs-flattop      a refractive flat-top shaper and its sensitivity to the size of the input beam
 *   bs-flyseye      a fly's-eye homogenizer: patch size, and the fringes a coherent laser makes
 *   bs-doe          a staircase diffractive element: levels, orders, wavelength detuning, the zero order
 *   bs-dots         a dot projector and a camera: disparity and depth
 *   bs-slm          a phase SLM with a Gerchberg-Saxton hologram and quantized phase
 *   bs-hoe          a thick transmission hologram: the Bragg condition (coupled-wave efficiency)
 *   bs-concentrator a compound parabolic concentrator traced ray by ray: acceptance angle and truncation
 *   bs-pinhole      a spatial filter: the focal plane, the pinhole size and the ripple left
 *   bs-metalens     a metalens: the focus against wavelength, compared with a glass lens
 * The numbers come from kit.optics, the drawing from kit.osym.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, R2D = 180 / PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  /* a length in metres, written in the unit that suits it */
  const fmtL = (kit, x) => { const a = Math.abs(x); if (!(a > 0)) return '0'; if (a < 1e-6) return kit.fmt(x * 1e9, 3) + ' nm'; if (a < 1e-3) return kit.fmt(x * 1e6, 3) + ' µm'; if (a < 1) return kit.fmt(x * 1e3, 3) + ' mm'; return kit.fmt(x, 3) + ' m'; };

  /* ================================================================ one laser, seven optics */
  Hyper.sim('bs-gallery', {
    title: 'One laser, seven shapes',
    blurb: `The same laser beam through different optics. The picture is what lands on the target, drawn from the physics of each optic; the graph below it is a cut through the middle (along the line for the two line optics). The read-outs give the real size.

**Try this**
- *Gaussian spot*: the raw beam, brightest in the middle and fading smoothly. Everything else is made from it.
- *Focused point*: the beam fills a lens of focal length equal to the distance. Widen the beam and the spot shrinks (w₀ = λf/πw).
- *Line from a cylinder lens* against *Uniform line from a Powell lens*: same fan, but look at the cut. The ends of the cylinder-lens line are almost dark.
- *Ring*: an axicon sends every ring of the beam to the axis at the same angle; at a distance the beam has crossed over and forms a ring that grows with distance.
- *Dots*: a diffractive element copies the beam into a grid at fixed angles; the dots grow farther apart with distance but not larger.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sh = O.shape, B = O.beam;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const SHAPES = [['Gaussian spot (the laser as it comes)', 'gauss'], ['Focused point', 'point'], ['Line from a cylinder lens', 'line'], ['Uniform line from a Powell lens', 'powell'], ['Ring from an axicon', 'ring'], ['Flat top from a shaper', 'flat'], ['Grid of dots from a diffractive element', 'dots']];
      const DEF = { gauss: 1, point: 0.1, line: 1, powell: 1, ring: 0.3, flat: 0.3, dots: 1 };
      const OPTIC = { gauss: 'no optic', point: 'focusing lens', line: 'cylinder lens', powell: 'Powell lens', ring: 'axicon', flat: 'flat-top shaper', dots: 'diffractive element' };
      const first = params.shape || 'gauss';
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Optic', options: SHAPES, value: first },
        { id: 'nm', type: 'select', label: 'Laser', options: [['Blue, 450 nm', 450], ['Green, 532 nm', 532], ['Red, 633 nm', 633]], value: 532 },
        { id: 'w', label: 'Beam radius at the optic (1/e²)', min: 0.5, max: 5, step: 0.1, value: 2, unit: 'mm' },
        { id: 'z', label: 'Distance to the target (focal length for the lens)', min: 0.05, max: 5, value: DEF[first], unit: 'm', log: true, sig: 2 },
        { id: 'fan', label: 'Fan angle (line optics)', min: 10, max: 120, step: 1, value: 60, unit: '°' }
      ], id => { if (id === 'shape') ctl.set('z', DEF[ctl.values.shape]); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pat', 'Pattern'], ['size', 'Size'], ['detail', 'Detail'], ['cut', 'Along the cut']]);
      /* each optic gives f(u, v) on [−1, 1]², the picture's aspect (height / width) and the text for the read-outs */
      const pattern = () => {
        const nm = V.nm, w = V.w * 1e-3, z = V.z, wz = B.w(z, w, nm);
        switch (V.shape) {
          case 'point': {
            const r = B.focus({ w, f: z, nm }), w0 = r.w0, h = 3 * w0;
            return { f: (u, v) => Math.exp(-18 * (u * u + v * v)), aspect: 1, pat: 'a diffraction-limited point', size: 'spot diameter ' + fmtL(kit, 2 * w0), detail: 'depth of focus 2z_R = ' + fmtL(kit, r.dof), cut: 'Gaussian, 1/e² radius ' + fmtL(kit, w0) };
          }
          case 'line': case 'powell': {
            const fan = V.fan * D2R, L = Sh.lineLength(fan, z), kind = V.shape === 'powell' ? 'powell' : 'gaussian';
            return { f: (u, v) => Sh.lineProfile(u * 1.12, kind) * Math.exp(-18 * v * v), aspect: 0.3, pat: kind === 'powell' ? 'a nearly uniform line' : 'a line, bright in the middle', size: 'length ' + fmtL(kit, L) + ' at a fan of ' + kit.fmt(V.fan, 3) + '°', detail: 'thickness ' + fmtL(kit, 2 * wz) + ' (drawn much larger)', cut: 'ends at ' + kit.fmt(100 * Sh.lineProfile(1, kind) / Sh.lineProfile(0, kind), 3) + ' % of the centre' };
          }
          case 'ring': {
            const ax = Sh.axicon({ alpha: 5 * D2R, n: 1.5, w, nm }), Rr = ax.ringRadius(z), zt = Rr, tab = [], N = 240, half = Rr + 3 * w;
            let mx = 0;
            for (let i = 0; i < N; i++) {
              const rho = half * (i + 0.5) / N, rs = Math.sqrt(rho * rho + 0.0225 * w * w);
              let I = Math.exp(-2 * Math.pow((zt + rho) / w, 2)) * (zt + rho) / rs;
              if (zt - rho > 0) I += Math.exp(-2 * Math.pow((zt - rho) / w, 2)) * (zt - rho) / rs;
              tab.push(I); mx = Math.max(mx, I);
            }
            const at = rho => tab[clamp(Math.floor(rho * N), 0, N - 1)] / mx;
            return { f: (u, v) => at(Math.hypot(u, v)), aspect: 1, pat: z > w / Math.tan(ax.beta) ? 'a ring (the beam has crossed the axis)' : 'a ring still filling in (inside the Bessel zone)', size: 'ring radius ' + fmtL(kit, Rr), detail: 'ring width about ' + fmtL(kit, 2 * w) + '; Bessel zone ends at ' + fmtL(kit, ax.zmax), cut: 'deflection ' + kit.fmt(ax.beta * R2D, 3) + '° for a 5° axicon' };
          }
          case 'flat': {
            const a = w;
            return { f: (u, v) => Sh.superGaussian(Math.hypot(u, v) * 1.5 * a, a, 12), aspect: 1, pat: 'a flat-topped patch', size: 'diameter ' + fmtL(kit, 2 * a) + ' (set by the shaper)', detail: 'edge falls over about ' + fmtL(kit, 0.25 * a), cut: 'right at the design plane only' };
          }
          case 'dots': {
            const d = 100e-6, th = Sh.doeAngle(1, d, nm), pitch = z * Math.tan(th), half = 3.6 * pitch, n = 3, sr = Math.max(wz, 0.04 * pitch);
            return { f: (u, v) => { const x = u * half, y = v * half, i = clamp(Math.round(x / pitch), -n, n), j = clamp(Math.round(y / pitch), -n, n); return Math.exp(-2 * (Math.pow(x - i * pitch, 2) + Math.pow(y - j * pitch, 2)) / (sr * sr)); }, aspect: 1, pat: '7 × 7 dots (a 100 µm period grating)', size: 'spacing ' + fmtL(kit, pitch) + ' at ' + kit.fmt(z, 3) + ' m (order angle ' + kit.fmt(th * R2D, 3) + '°)', detail: 'each dot ' + fmtL(kit, 2 * wz) + ' across, as the beam', cut: 'the dots do not grow; the spacing does' };
          }
          default:
            return { f: (u, v) => Math.exp(-8 * (u * u + v * v)), aspect: 1, pat: 'the raw Gaussian beam', size: 'beam diameter ' + fmtL(kit, 2 * wz) + ' at ' + kit.fmt(z, 3) + ' m', detail: 'divergence half-angle ' + kit.fmt(B.divergence(w, nm) * 1e3, 3) + ' mrad', cut: 'exp(−2r²/w²)' };
        }
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, P = pattern();
        const lineOptic = V.shape === 'line' || V.shape === 'powell';
        ctl.show('fan', lineOptic);
        // the picture on the right, the cut under it
        const pw = Math.min(W * 0.5, Hh * 0.6 / P.aspect), ph = pw * P.aspect, px = W - pw - 18, py = 24;
        S.image(c, px, py, pw, ph, 120, Math.max(24, Math.round(120 * P.aspect)), (u, v) => P.f(2 * u - 1, 1 - 2 * v), { nm: V.nm, gamma: 0.7, key: [V.shape, V.nm, V.w, V.z, V.fan].join(), id: 'gal' });
        c.strokeStyle = C.grid; c.strokeRect(px, py, pw, ph);
        const cy0 = py + ph + 26, chh = clamp(Hh - cy0 - 22, 46, 130);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(px, cy0 + chh); c.lineTo(px + pw, cy0 + chh); c.stroke();
        c.strokeStyle = S.nm(V.nm); c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= 160; i++) { const u = -1 + 2 * i / 160, y = cy0 + chh * (1 - clamp(P.f(u, 0), 0, 1.05)); i ? c.lineTo(px + pw * i / 160, y) : c.moveTo(px, y); }
        c.stroke();
        kit.label(c, 'cut through the middle', px + pw / 2, cy0 - 8, { align: 'center', color: C.muted, size: 11.5 });
        // the optic on the left: laser, beam, the optic, an arrow to the target
        const lx = 16, mid = py + ph / 2, ox = Math.max(lx + 80, Math.min(W * 0.27, px - 150));
        S.source(c, lx + 30, mid, { kind: 'laser', color: S.nm(V.nm) });
        S.beam(c, lx + 34, ox, mid, 9, { nm: V.nm, alpha: 0.5 });
        const oy = mid, hh = 34;
        switch (V.shape) {
          case 'point': S.lens(c, ox, oy, hh, { f: 1 }); break;
          case 'line': S.lens(c, ox, oy, hh, { f: 1, bulge: 1.6 }); break;
          case 'powell': S.prism(c, ox + 18, oy, 46, 1.9); break;
          case 'ring': S.poly(c, [[ox, oy - hh], [ox + 28, oy], [ox, oy + hh]]); break;
          case 'flat': S.block(c, ox, oy - 22, 26, 44, { label: '' }); break;
          case 'dots': S.grating(c, ox + 6, oy, hh, { lines: 12 }); break;
          default: c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.strokeRect(ox - 4, oy - 20, 30, 40); c.restore();
        }
        kit.label(c, OPTIC[V.shape], ox + 12, oy + hh + 18, { align: 'center', color: C.text, weight: 650 });
        S.ray(c, [[ox + 36, oy], [px - 10, py + ph / 2]], { color: C.faint, width: 1.2, dash: [4, 4] });
        kit.label(c, 'target', px + pw / 2, py - 10, { align: 'center', color: C.muted, size: 11.5 });
        ro.set('pat', P.pat); ro.set('size', P.size); ro.set('detail', P.detail); ro.set('cut', P.cut);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ focusing: sphere against asphere */
  Hyper.sim('bs-focus', {
    title: 'Focusing a beam: what sets the spot',
    blurb: `A collimated beam of the chosen diameter fills a 100 mm N-BK7 lens, traced ray by ray. The inset is the focus magnified: the dots are where the rays really land, the dashed circle is the Airy disc diffraction allows, and the read-outs compare the three limits: the lens, diffraction and the beam's own quality M².

**Try this**
- Start with the plano-convex lens, curved side to the beam, at a 10 mm beam (f/10): the rays fall inside the Airy disc, so the lens is diffraction-limited. Now widen the beam to 30 mm: the rays spread far beyond it. That is spherical aberration.
- Turn the same lens round (*flat side first*): at f/5 it is about four times worse.
- Switch to the *asphere* (a conic of constant −n²): every ray lands in one point at any beam size, and diffraction is all that is left.
- Raise M² to 5: the Gaussian spot of the beam grows five times whatever the lens does. Beam quality is the third limit.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys, B = O.beam, F = 100;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 310 });
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'The lens', options: [['Plano-convex, curved side first', 'cf'], ['Plano-convex, flat side first', 'ff'], ['Asphere (conic, k = −n²)', 'asph']], value: params.lens || 'cf' },
        { id: 'D', label: 'Beam and lens diameter', min: 4, max: 40, step: 1, value: params.D || 12, unit: 'mm' },
        { id: 'nm', type: 'select', label: 'Wavelength', options: [['405 nm', 405], ['532 nm', 532], ['633 nm', 633], ['1064 nm', 1064]], value: 633 },
        { id: 'M2', label: 'Beam quality M²', min: 1, max: 10, step: 0.1, value: 1, unit: '' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['N', 'f-number'], ['airy', 'Airy disc, radius to first ring'], ['geo', 'Ray blur at best focus (radius)'], ['gau', 'Gaussian waist w₀ (beam radius = D/2)'], ['who', 'What limits the spot']]);
      const build = () => {
        const n = O.index('N-BK7', V.nm), R = F * (n - 1), sd = V.D / 2;
        if (V.lens === 'ff') return { surfaces: [{ R: 0, t: 4, n: 'N-BK7', sd, stop: true }, { R: -R, n: 1, sd }], object: Infinity };
        if (V.lens === 'asph') return { surfaces: [{ R: 0, t: 4, n: 'N-BK7', sd, stop: true }, { R: -R, k: -n * n, n: 1, sd }], object: Infinity };
        return { surfaces: [{ R: R, t: 4, n: 'N-BK7', sd, stop: true }, { R: 0, n: 1, sd }], object: Infinity };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, sys = build(), N = F / V.D;
        const par = Sy.paraxial(sys, V.nm), inset = Math.min(70, Hh * 0.22), zi = F + 8;
        const m = S.map(st, -26, zi, 21, { right: 2 * inset + 52, left: 16 });
        S.axis(c, m.X(-26), m.y0, m.X(zi));
        S.system(c, sys, m);
        const bf = Sy.bestFocus(sys, { nm: V.nm, rings: 4 }), z0 = bf.z;
        S.rays(c, Sy.fan2d(sys, { nm: V.nm, n: 9, zStart: -24, zEnd: zi }), m, { nm: V.nm });
        S.screen(c, m.X(z0), m.y0, m.s * 7, { label: 'best focus' });
        S.dim(c, m.X(-2), m.Y(-V.D / 2) + 14, m.X(-2), m.Y(V.D / 2) - 14, 'D', { off: -12 });
        const spot = Sy.spot(sys, { nm: V.nm, rings: 6, z: z0 });
        const airy = O.diff.airyRadius(V.nm, N) * 1e3, geo = spot.geo;                    // mm
        const half = clamp(Math.max(airy * 2.2, geo * 1.25), 0.002, 1);
        const ix = W - inset - 14, iy = Hh / 2, fx = m.X(z0);
        c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(fx, m.y0); c.lineTo(ix - inset, iy - inset); c.moveTo(fx, m.y0); c.lineTo(ix - inset, iy + inset); c.stroke(); c.restore();
        c.fillStyle = C.surface; c.fillRect(ix - inset, iy - inset, 2 * inset, 2 * inset);
        S.spot(c, spot, ix, iy, inset, inset / half, { airy, nm: V.nm });
        kit.label(c, 'the focus, box ' + fmtL(kit, 2 * half * 1e-3), ix, iy - inset - 10, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'dashed: Airy disc', ix, iy + inset + 12, { align: 'center', color: C.faint, size: 11 });
        const g = B.focus({ w: V.D / 2 * 1e-3, f: F * 1e-3, nm: V.nm, M2: V.M2 });
        ro.set('N', 'f/' + kit.fmt(N, 3));
        ro.set('airy', fmtL(kit, airy * 1e-3));
        ro.set('geo', geo < 1e-5 ? 'none: a perfect focus' : fmtL(kit, geo * 1e-3));
        ro.set('gau', fmtL(kit, g.w0) + (V.M2 > 1.05 ? '  (M² = ' + kit.fmt(V.M2, 2) + ')' : ''));
        ro.set('who', geo > 1.5 * airy ? 'the lens: spherical aberration' : V.M2 > 1.5 ? 'the beam quality, M²' : 'diffraction');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a cylinder lens: line or sheet */
  Hyper.sim('bs-cylinder', {
    title: 'A cylinder lens: a line or a sheet',
    blurb: `One cylinder lens, two jobs. In **line** mode the beam is focused to a line inside the lens and fans out beyond it: the fan angle is 2·arctan(D/2f) and the line on the wall grows with distance. In **sheet** mode the lens focuses the beam to a thin waist, and the sheet is as thin as the beam can be made, but only over a limited length.

**Try this**
- *Line*: shorten the focal length: the fan opens and the line lengthens (a 0.5 mm focal length for a 1 mm beam gives a 90° fan, a line twice as long as the distance). Tick *Powell lens* and the dark ends of the Gaussian line fill in.
- *Sheet*: make the focal length shorter or the beam wider: the sheet thins, and the length over which it stays thin shrinks as the square of the thickness.
- Drag *field width* wider than the length 2z_R and the sheet at the edges becomes thicker than at the middle.
- Raise M²: the sheet gets thicker at the same lens, and its length falls: poor beam quality costs both.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sh = O.shape, B = O.beam;
      const mode = params.mode === 'sheet' ? 'sheet' : 'line';
      const st = kit.stage(box.stage, { aspect: mode === 'sheet' ? 0.62 : 0.6, minH: 320 });
      const plot = mode === 'line' ? kit.plot(box.stage, { x: { label: 'position along the line (fraction of half-length)', name: 'u', min: -1, max: 1 }, y: { label: 'intensity ÷ centre', name: 'I', min: 0, max: 1.2 }, series: [] }, 150) : null;
      const defs = mode === 'line' ? [
        { id: 'D', label: 'Beam width at the lens', min: 0.3, max: 4, step: 0.1, value: 1, unit: 'mm' },
        { id: 'f', label: 'Focal length of the lens', min: 0.25, max: 10, value: 1, unit: 'mm', log: true, sig: 2 },
        { id: 'z', label: 'Distance to the wall', min: 0.2, max: 10, value: 1, unit: 'm', log: true, sig: 2 },
        { id: 'pow', type: 'check', label: 'Powell lens instead of a plain cylinder lens', value: !!params.powell }
      ] : [
        { id: 'w', label: 'Beam radius at the lens (1/e²)', min: 0.5, max: 5, step: 0.1, value: 2, unit: 'mm' },
        { id: 'f', label: 'Focal length of the cylinder lens', min: 25, max: 300, step: 1, value: 100, unit: 'mm' },
        { id: 'nm', type: 'select', label: 'Wavelength', options: [['405 nm', 405], ['488 nm', 488], ['532 nm', 532], ['633 nm', 633]], value: 532 },
        { id: 'M2', label: 'Beam quality M²', min: 1, max: 10, step: 0.1, value: 1, unit: '' },
        { id: 'fld', label: 'Field width the sheet must cover', min: 0.05, max: 20, value: 1, unit: 'mm', log: true, sig: 2 }
      ];
      const ctl = kit.controls(box.side, defs, () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, mode === 'line'
        ? [['fan', 'Fan angle'], ['L', 'Line length at the wall'], ['mid', 'Brightness at half the half-length'], ['end', 'Brightness at the ends'], ['thk', 'Line thickness (the beam)']]
        : [['t', 'Sheet thickness at the waist (2w₀)'], ['zr', 'Rayleigh range z_R'], ['len', 'Stays thin over 2z_R'], ['edge', 'Thickness at the field edges'], ['ok', 'Field covered?']]);
      const drawLine = () => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cy = Hh * 0.34;
        const nm = 532, f = V.f * 1e-3, D = V.D * 1e-3, fan = Sh.fanAngle(D, f), L = Sh.lineLength(fan, V.z), kind = V.pow ? 'powell' : 'gaussian';
        // top view: laser, beam, lens, fan, wall. Lengths in px: the lens at 18 %, the wall at 86 %.
        const xl = W * 0.2, xw = W * 0.86, x0 = xl + 12, maxH = Hh * 0.27, dx = xw - x0;
        S.source(c, 28, cy, { kind: 'laser', color: S.nm(nm) });
        S.beam(c, 32, xl, cy, 7, { nm, alpha: 0.5 });
        c.save(); c.fillStyle = S.glass(0.4); c.strokeStyle = S.edge(); c.lineWidth = 1.3; c.beginPath(); c.arc(xl + 6, cy, 8, 0, TAU); c.fill(); c.stroke(); c.restore();
        kit.label(c, V.pow ? 'Powell lens' : 'cylinder lens', xl, cy + 28, { align: 'center', color: C.muted, size: 11.5 });
        // the fan at its true angle, cut where it leaves the picture
        for (let i = -4; i <= 4; i++) {
          const phi = (i / 4) * fan / 2, tn = Math.tan(phi), yy = dx * tn, clip = Math.abs(yy) > maxH, xe = clip ? x0 + maxH / Math.abs(tn) : xw;
          S.ray(c, [[x0, cy], [xe, cy - (clip ? Math.sign(tn) * maxH : yy)]], { nm, width: 1.1, alpha: 0.85, arrows: false });
        }
        c.fillStyle = C.muted; c.fillRect(xw, cy - maxH - 6, 4, 2 * maxH + 12);
        const hl = Math.min(maxH, dx * Math.tan(fan / 2));
        c.save(); c.strokeStyle = S.nm(nm); c.lineWidth = 4; c.beginPath(); c.moveTo(xw + 2, cy - hl); c.lineTo(xw + 2, cy + hl); c.stroke(); c.restore();
        S.dim(c, x0, cy + maxH + 14, xw, cy + maxH + 14, 'z = ' + kit.fmt(V.z, 3) + ' m (not to scale)', { off: 12 });
        S.angle(c, x0, cy, 34, -fan / 2, fan / 2, '');
        kit.label(c, 'fan angle ' + kit.fmt(fan * R2D, 3) + '°', 14, 14, { align: 'left', color: C.text, size: 11.5 });
        kit.label(c, 'line on the wall: L = ' + kit.fmt(L, 3) + ' m', xw - 6, cy - maxH - 14, { align: 'right', color: C.text, size: 11.5 });
        // the line as seen on the wall
        const sy = Hh * 0.74, sh = Hh * 0.1;
        S.fringes(c, W * 0.1, sy, W * 0.8, sh, u => Sh.lineProfile(2 * u - 1, kind), { nm, gamma: 0.8 });
        kit.label(c, 'the line on the wall, seen head on (length to scale, thickness exaggerated)', W * 0.5, sy + sh + 14, { align: 'center', color: C.muted, size: 11.5 });
        if (plot) {
          const g = [], p = [];
          for (let i = 0; i <= 80; i++) { const u = -1 + 2 * i / 80; g.push([u, Sh.lineProfile(u, 'gaussian')]); p.push([u, Sh.lineProfile(u, 'powell')]); }
          plot.set({ series: [{ pts: g, color: C.accent, label: 'cylinder lens (Gaussian)', dash: !!V.pow }, { pts: p, color: C.warn, label: 'Powell lens', dash: !V.pow }] });
        }
        ro.set('fan', kit.fmt(fan * R2D, 3) + '°');
        ro.set('L', kit.fmt(L, 3) + ' m');
        ro.set('mid', kit.fmt(100 * Sh.lineProfile(0.5, kind), 3) + ' %');
        ro.set('end', kit.fmt(100 * Sh.lineProfile(1, kind), 3) + ' %');
        ro.set('thk', fmtL(kit, 2 * B.w(V.z, D / 2, nm)) + ' (the beam, uncorrected)');
      };
      const drawSheet = () => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, nm = V.nm, w = V.w * 1e-3, f = V.f * 1e-3;
        const r = B.focus({ w, f, nm, M2: V.M2 }), w0 = r.w0, zR = r.zR, t = 2 * w0;
        // upper panel: the whole beam from the lens to past the waist, heights to scale in the beam, the waist is a dot
        const y1 = Hh * 0.22, x0 = 70, x1 = W - 24, sx = (x1 - x0 - 10) / (f * 1.6), hs = Math.min(Hh * 0.16, 50) / (w * 1.15);
        S.beam(c, 30, x0, y1, w * hs, { nm, alpha: 0.4 });
        S.beam(c, x0, x0 + sx * f * 1.6, y1, x => hs * B.w((x - x0) / sx - f, w0, nm, V.M2), { nm, alpha: 0.4 });
        c.save(); c.strokeStyle = S.edge(); c.lineWidth = 2; c.beginPath(); c.moveTo(x0, y1 - Hh * 0.17); c.lineTo(x0, y1 + Hh * 0.17); c.stroke(); c.restore();
        kit.label(c, 'cylinder lens', x0, y1 + Hh * 0.17 + 12, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'waist at f = ' + V.f + ' mm', x0 + sx * f, y1 - Hh * 0.17 - 4, { align: 'center', color: C.muted, size: 11.5 });
        // lower panel: the waist magnified, heights in µm against length in mm
        const y2 = Hh * 0.68, lenHalf = Math.max(zR * 3, V.fld * 1e-3 * 0.75), ax0 = 44, ax1 = W - 24, sxx = (ax1 - ax0) / (2 * lenHalf);
        const hmax = Math.max(B.w(lenHalf, w0, nm, V.M2), w0 * 1.5), sy = Hh * 0.2 / hmax;
        S.beam(c, ax0, ax1, y2, x => sy * B.w((x - (ax0 + ax1) / 2) / sxx, w0, nm, V.M2), { nm, alpha: 0.5 });
        S.axis(c, ax0, y2, ax1);
        const xc = (ax0 + ax1) / 2;
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.2; c.setLineDash([4, 3]);
        for (const s of [-1, 1]) { c.beginPath(); c.moveTo(xc + s * zR * sxx, y2 - Hh * 0.22); c.lineTo(xc + s * zR * sxx, y2 + Hh * 0.22); c.stroke(); }
        c.restore();
        const fh = V.fld * 1e-3 / 2;
        S.dim(c, xc - fh * sxx, y2 + Hh * 0.24, xc + fh * sxx, y2 + Hh * 0.24, 'field ' + fmtL(kit, 2 * fh), { off: 12 });
        kit.label(c, '±z_R', xc + zR * sxx, y2 - Hh * 0.22 - 8, { align: 'center', color: C.warn, size: 11.5 });
        kit.label(c, 'the waist magnified: thickness ' + fmtL(kit, t) + ' (height scale ≠ length scale)', W / 2, Hh - 8, { align: 'center', color: C.muted, size: 11.5 });
        const te = 2 * B.w(fh, w0, nm, V.M2);
        ro.set('t', fmtL(kit, t));
        ro.set('zr', fmtL(kit, zR));
        ro.set('len', fmtL(kit, 2 * zR));
        ro.set('edge', fmtL(kit, te) + '  (×' + kit.fmt(te / t, 3) + ')');
        ro.set('ok', te <= Math.SQRT2 * t * 1.001 ? 'yes: within √2 of the thinnest' : 'no: thicker than √2 at the edges');
      };
      const loop = kit.loop(mode === 'sheet' ? drawSheet : drawLine, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ an axicon: the needle and the ring */
  Hyper.sim('bs-axicon', {
    title: 'An axicon: a needle and a ring of light',
    blurb: `A cone-shaped lens bends every ray towards the axis by the same angle β. The rays cross the axis at different distances, from the centre of the beam (at once) to its edge (at z = w/tan β). Where the two halves of the beam overlap (the shaded diamond) they interfere and make a long thin Bessel core; beyond the diamond the beam is a ring. The heights are drawn many times larger than the lengths.

**Try this**
- Move the *screen* from the axicon outwards. Inside the shaded zone the picture is a Bessel pattern: a bright core and rings. Beyond the end of the zone it turns into a ring that grows with distance.
- Raise the base angle α: the core gets narrower but the zone shorter (z_max = w/tan β).
- Read the line *a Gaussian this narrow spreads over*: the Bessel core stays narrow for far longer than any Gaussian beam of the same width could.
- The graph is the intensity on the axis: it peaks half way along the zone, where the two halves of the beam overlap most.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sh = O.shape, B = O.beam;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const plot = kit.plot(box.stage, { x: { label: 'distance behind the axicon (mm)', name: 'z' }, y: { label: 'on-axis intensity ÷ its peak', name: 'I', min: 0, max: 1.1 }, series: [] }, 130);
      const ctl = kit.controls(box.side, [
        { id: 'alpha', label: 'Base angle of the cone α', min: 0.5, max: 10, step: 0.1, value: params.alpha || 2, unit: '°' },
        { id: 'w', label: 'Beam radius (1/e²)', min: 1, max: 6, step: 0.1, value: 2, unit: 'mm' },
        { id: 'nm', type: 'select', label: 'Wavelength', options: [['405 nm', 405], ['532 nm', 532], ['633 nm', 633], ['1064 nm', 1064]], value: 532 },
        { id: 'z', label: 'Screen distance behind the axicon', min: 2, max: 600, value: 60, unit: 'mm', log: true, sig: 3 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['beta', 'Deflection β'], ['zmax', 'Line focus, z_max = w / tan β'], ['r0', 'Core radius (to the first dark ring)'], ['ring', 'Ring radius at the screen, z tan β'], ['gz', 'A Gaussian this narrow spreads over'], ['what', 'On the screen']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, nm = V.nm;
        const ax = Sh.axicon({ alpha: V.alpha * D2R, n: 1.517, w: V.w * 1e-3, nm }), beta = ax.beta, tb = Math.tan(beta), zmax = ax.zmax * 1e3, r0 = ax.core;
        const zEnd = Math.max(zmax * 1.25, V.z * 1.08), z0 = -0.1 * zEnd;
        const m = S.map(st, z0, zEnd, V.w * 1.3, { left: 14, right: 14, top: 26, bottom: 46, stretch: 14 });
        S.axis(c, m.X(z0), m.y0, m.X(zEnd));
        // the Bessel zone: the diamond where the two halves of the beam overlap
        c.save(); c.fillStyle = C.dark ? 'rgba(123,140,255,0.2)' : 'rgba(80,100,220,0.14)'; c.strokeStyle = C.accent; c.setLineDash([4, 4]); c.lineWidth = 1;
        c.beginPath(); c.moveTo(m.X(0), m.y0); c.lineTo(m.X(zmax / 2), m.Y(V.w / 2)); c.lineTo(m.X(zmax), m.y0); c.lineTo(m.X(zmax / 2), m.Y(-V.w / 2)); c.closePath(); c.fill(); c.stroke(); c.restore();
        for (let k = -8; k <= 8; k++) {
          const r = V.w * k / 8, sg = Math.sign(r);
          S.ray(c, [[m.X(z0), m.Y(r)], [m.X(0), m.Y(r)], [m.X(zEnd), m.Y(r - sg * zEnd * tb)]], { nm, width: 1.1, alpha: 0.8, arrows: false });
        }
        // the cone of glass, flat face to the left, apex pointing along the beam
        const h1 = V.w * 1.18, T = h1 * Math.tan(V.alpha * D2R) + 1.2;
        S.poly(c, [[m.X(-T), m.Y(h1)], [m.X(-h1 * Math.tan(V.alpha * D2R)), m.Y(h1)], [m.X(0), m.Y(0)], [m.X(-h1 * Math.tan(V.alpha * D2R)), m.Y(-h1)], [m.X(-T), m.Y(-h1)]]);
        kit.label(c, 'axicon', m.X(-T / 2), m.Y(-h1) + 14, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'Bessel zone', m.X(zmax / 2), m.Y(V.w / 2) - 8, { align: 'center', color: C.accent, size: 11.5 });
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.4; c.setLineDash([5, 3]); c.beginPath(); c.moveTo(m.X(V.z), m.Y(V.w * 1.25)); c.lineTo(m.X(V.z), m.Y(-V.w * 1.25)); c.stroke(); c.restore();
        kit.label(c, 'screen', m.X(V.z), m.Y(-V.w * 1.25) + 12, { align: 'center', color: C.warn, size: 11.5 });
        S.dim(c, m.X(0), Hh - 20, m.X(zmax), Hh - 20, 'z_max = ' + kit.fmt(zmax, 3) + ' mm', { off: 10 });
        // the picture on the screen, in the top right corner
        const sz = Math.min(120, Hh * 0.3), ix = W - sz - 10, iy = 8, inZone = V.z < zmax;
        c.fillStyle = C.surface; c.fillRect(ix - 2, iy - 2, sz + 4, sz + 22);
        if (inZone) {
          const half = 5.6 * r0;
          S.image(c, ix, iy, sz, sz, 96, 96, (u, v) => { const x = (2 * u - 1) * half, y = (1 - 2 * v) * half, j = O.besselJ0(2.405 * Math.hypot(x, y) / r0); return j * j; }, { nm, gamma: 0.5, key: 'bes' + nm + '|' + V.alpha + '|' + V.w, id: 'axb' });
          kit.label(c, 'Bessel pattern, ±' + fmtL(kit, half), ix + sz / 2, iy + sz + 11, { align: 'center', color: C.muted, size: 10.5 });
        } else {
          const zt = V.z * 1e-3 * tb, w = V.w * 1e-3, half = zt + 3 * w, N = 160, tab = [];
          let mx = 0;
          for (let i = 0; i < N; i++) {
            const rho = half * (i + 0.5) / N, rs = Math.sqrt(rho * rho + 0.0225 * w * w);
            let I = Math.exp(-2 * Math.pow((zt + rho) / w, 2)) * (zt + rho) / rs;
            if (zt - rho > 0) I += Math.exp(-2 * Math.pow((zt - rho) / w, 2)) * (zt - rho) / rs;
            tab.push(I); mx = Math.max(mx, I);
          }
          S.image(c, ix, iy, sz, sz, 96, 96, (u, v) => tab[clamp(Math.floor(Math.hypot(2 * u - 1, 1 - 2 * v) * N), 0, N - 1)] / mx, { nm, gamma: 0.7, key: 'ring' + nm + '|' + V.alpha + '|' + V.w + '|' + V.z, id: 'axr' });
          kit.label(c, 'a ring, ±' + fmtL(kit, half), ix + sz / 2, iy + sz + 11, { align: 'center', color: C.muted, size: 10.5 });
        }
        c.strokeStyle = C.grid; c.strokeRect(ix, iy, sz, sz);
        const g = z => (2 * z / zmax) * Math.exp(0.5 - 2 * Math.pow(z / zmax, 2)), pts = [];
        for (let i = 0; i <= 120; i++) { const z = 1.4 * zmax * i / 120; pts.push([z, g(z)]); }
        plot.set({ series: [{ pts, color: C.accent, label: 'on-axis intensity (geometric result)' }], marks: [{ x: V.z, y: g(V.z), label: 'screen', color: C.warn }], vlines: [{ x: zmax, label: 'z_max', color: C.faint }] });
        ro.set('beta', kit.fmt(beta * R2D, 3) + '°');
        ro.set('zmax', fmtL(kit, ax.zmax));
        ro.set('r0', fmtL(kit, r0));
        ro.set('ring', fmtL(kit, V.z * 1e-3 * tb) + (inZone ? '  (not yet formed)' : ''));
        ro.set('gz', fmtL(kit, 2 * B.rayleigh(r0, nm)) + '  (zone ÷ this = ' + kit.fmt(ax.zmax / (2 * B.rayleigh(r0, nm)), 3) + ')');
        ro.set('what', inZone ? 'a Bessel core with rings' : 'a ring');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a flat-top shaper and the size of its input */
  Hyper.sim('bs-flattop', {
    title: 'A flat-top shaper and the size of its input',
    blurb: `A refractive shaper is two elements that move each ray to a new radius, so that the power inside any radius of the Gaussian input equals the power inside the matching radius of a flat-topped output. The mapping is fixed in glass for one input beam size. The drawing shows the rays at equal power fractions; the graph shows the output for the beam you feed in, relative to the ideal flat top (geometric optics: diffraction ripples are not included).

**Try this**
- At 0 % error the output is exactly flat. Make the beam 5 % larger: the edge rises well above the centre. Make it 5 % smaller: a bright dome. See how fast the ratio runs away.
- Raise the design cut-off R. A design that takes in more of the Gaussian tail is more efficient but even more sensitive to the beam size.
- Read *size tolerance*: the range of beam size that keeps the edge within ±10 % of the centre.
- Watch the line weights in the drawing: they are the power carried by each ray's share of the beam. They equal each other only at the design size.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230 });
      const plot = kit.plot(box.stage, { x: { label: 'radius ÷ cut-off radius  (r/R at the input, ρ/ρ₀ at the output)', name: 'x', min: 0, max: 1.3 }, y: { label: 'intensity (output ÷ the ideal flat top)', name: 'I', min: 0, max: 2.4 }, series: [] }, 220);
      const ctl = kit.controls(box.side, [
        { id: 'size', label: 'Beam radius fed in, against the design', min: 0.8, max: 1.25, step: 0.005, value: params.size || 1.05, fmt: v => (v >= 1 ? '+' : '−') + kit.fmt(Math.abs(v - 1) * 100, 3) + ' %' },
        { id: 'R', label: 'Design cut-off radius R ÷ w_d', min: 1, max: 2, step: 0.05, value: 1 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['edge', 'Edge ÷ centre intensity'], ['pow', 'Power of the input inside R'], ['flat', 'Flatness'], ['tol', 'Size tolerance for ±10 %']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, s = V.size, R = V.R, Nn = 1 - Math.exp(-2 * R * R), M = 6, cy = Hh / 2;
        const xa = 24, x1 = W * 0.36, x2 = W * 0.64, xb = W - 24, hin = Hh * 0.34, hout = Hh * 0.34;
        // the two elements
        S.lens(c, x1 - 3, cy, hin * 1.15, { f: -1, bulge: 2.4 });
        S.lens(c, x2 - 3, cy, hout * 1.15, { f: 1, bulge: 2.4 });
        kit.label(c, 'element 1', x1, cy + hin * 1.15 + 14, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'element 2', x2, cy + hout * 1.15 + 14, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'Gaussian in', xa + 30, 14, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'flat top out', xb - 34, 14, { align: 'center', color: C.muted, size: 11.5 });
        const bnd = k => Math.sqrt(-Math.log(1 - Nn * k / M) / 2);       // annulus boundaries on the design beam (w_d = 1)
        for (let k = 1; k <= M; k++) {
          const p = (k - 0.5) / M, yin = Math.sqrt(-Math.log(1 - Nn * p) / 2) / R * hin, yout = Math.sqrt(p) * hout;
          const Ps = Math.exp(-2 * Math.pow(bnd(k - 1), 2) / (s * s)) - Math.exp(-2 * Math.pow(bnd(k), 2) / (s * s)), P1 = Math.exp(-2 * Math.pow(bnd(k - 1), 2)) - Math.exp(-2 * Math.pow(bnd(k), 2)), q = Ps / P1;
          for (const sg of [-1, 1]) S.ray(c, [[xa, cy + sg * yin], [x1, cy + sg * yin], [x2, cy + sg * yout], [xb, cy + sg * yout]], { nm: 560, width: 1 + 2.2 * Math.min(q, 2.4), alpha: 0.85, arrows: false });
        }
        // the output for the beam fed in
        const out = [], inn = [];
        for (let i = 0; i <= 100; i++) {
          const x = i / 100, r2 = -Math.log(1 - Nn * x * x) / 2;
          out.push([x, Math.exp(2 * r2 * (1 - 1 / (s * s))) / (s * s)]);
          inn.push([x * 1.3, Math.exp(-2 * R * R * Math.pow(x * 1.3, 2) / (s * s))]);
        }
        const yEdge = out[100][1];
        out.push([1, 0], [1.3, 0]);
        plot.set({ series: [{ pts: inn, color: C.muted, label: 'the Gaussian beam fed in', dash: true }, { pts: out, color: C.accent, label: 'the shaped output' }], hlines: [{ y: 1, label: 'ideal flat top', color: C.faint }] });
        const ratio = Math.exp(2 * R * R * (1 - 1 / (s * s))), k = Math.log(1.1) / (2 * R * R);
        ro.set('edge', kit.fmt(ratio, 3) + (ratio > 1.1 ? '  (brighter at the edge)' : ratio < 1 / 1.1 ? '  (dimmer at the edge)' : '  (flat to ±10 %)'));
        ro.set('pow', kit.fmt(100 * (1 - Math.exp(-2 * R * R / (s * s))), 3) + ' % (design: ' + kit.fmt(100 * Nn, 3) + ' %)');
        ro.set('flat', Math.abs(Math.log(ratio)) <= Math.log(1.1) ? 'within ±10 %' : 'worse than ±10 %');
        ro.set('tol', kit.fmt(100 / Math.sqrt(1 + k), 4) + ' % … ' + kit.fmt(100 / Math.sqrt(1 - k), 4) + ' %  of the design');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a fly's-eye homogenizer */
  Hyper.sim('bs-flyseye', {
    title: 'A fly\'s-eye homogenizer',
    blurb: `Two lenslet arrays and a condenser lens. The beam is cut into beamlets; each lenslet of the first array focuses its beamlet on the matching lenslet of the second; the condenser then makes every beamlet cover the same patch of width W = p·f_FL/f_LA. The shaded cones are the beamlets, all landing on the same target. The graphs show the target for a lamp or LED (the beamlets add in intensity) and for a single-mode laser (they interfere).

**Try this**
- Change the pitch, the lenslet focal length and the condenser: the patch width follows W = p·f_FL/f_LA, whatever the beam size.
- Switch to *laser* and read the zoom graph: the patch is covered by a comb of fringes of period λ·f_FL/p, with peaks several times the average.
- Widen the beam: more lenslets are lit and the comb peaks get narrower and taller. A narrow beam lighting two or three lenslets gives broad, gentle fringes.
- With a lamp the zoom graph is flat: the same optics, an even patch.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sh = O.shape;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 260 });
      const plot = kit.plot(box.stage, { x: { label: 'position across the target (mm)', name: 'x' }, y: { label: 'intensity ÷ the flat top', name: 'I', min: 0, max: 1.4 }, series: [] }, 130);
      const zoom = kit.plot(box.stage, { x: { label: 'zoom: a few fringe periods at the centre (µm)', name: 'x' }, y: { label: 'intensity ÷ average', name: 'I', min: 0 }, series: [] }, 130);
      const ctl = kit.controls(box.side, [
        { id: 'p', label: 'Lenslet pitch p', min: 0.25, max: 2, step: 0.05, value: 1, unit: 'mm' },
        { id: 'fLA', label: 'Lenslet focal length f_LA', min: 3, max: 30, step: 0.5, value: 10, unit: 'mm' },
        { id: 'fFL', label: 'Condenser focal length f_FL', min: 50, max: 300, step: 5, value: 100, unit: 'mm' },
        { id: 'w', label: 'Beam radius at the arrays', min: 1, max: 8, step: 0.1, value: 4, unit: 'mm' },
        { id: 'src', type: 'select', label: 'Light source', options: [['Lamp or LED (incoherent)', 'lamp'], ['Single-mode laser (coherent)', 'laser']], value: params.src || 'lamp' },
        { id: 'nm', type: 'select', label: 'Wavelength', options: [['405 nm', 405], ['532 nm', 532], ['633 nm', 633]], value: 532 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['W', 'Patch width W = p f_FL / f_LA'], ['N', 'Lenslets across the beam'], ['na', 'Lenslet numerical aperture, p / 2f_LA'], ['lam', 'Fringe period λ f_FL / p (laser)'], ['pk', 'Peak ÷ average (laser)']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, nm = V.nm, p = V.p * 1e-3, fFL = V.fFL * 1e-3, fLA = V.fLA * 1e-3, w = V.w * 1e-3;
        const Wp = Sh.homogenizer(p, fLA, fFL), Lam = nm * 1e-9 * fFL / p, nAcross = Math.max(1, Math.floor(2 * w / p));
        // the optical train: laser, beam, array 1, array 2, condenser, target
        const cy = Hh / 2, xl = 40, xa1 = W * 0.2, xa2 = W * 0.3, xc = W * 0.5, xt = W * 0.86, H0 = Hh * 0.38, nShow = Math.min(nAcross, 9), hp = 2 * H0 / nShow;
        S.beam(c, xl, xa1, cy, H0, { nm, alpha: 0.18, edge: false });
        for (let j = 0; j < nShow; j++) {
          const y = cy - H0 + hp * (j + 0.5), tw = Math.min(H0 * 0.9, Hh * 0.3);
          S.lens(c, xa1, y, hp * 0.46, { f: 1, bulge: 1.6 });
          S.lens(c, xa2, y, hp * 0.46, { f: 1, bulge: 1.6 });
          c.save(); c.fillStyle = S.nm(nm, 0.2); c.beginPath(); c.moveTo(xa2 + 6, y - hp * 0.4); c.lineTo(xc, y - hp * 0.4 + (cy - y) * 0.2); c.lineTo(xt, cy - tw); c.lineTo(xt, cy + tw); c.lineTo(xc, y + hp * 0.4 + (cy - y) * 0.2); c.lineTo(xa2 + 6, y + hp * 0.4); c.closePath(); c.fill(); c.restore();
        }
        S.lens(c, xc, cy, H0 * 1.05, { f: 1, bulge: 2.4 });
        const tw = Math.min(H0 * 0.9, Hh * 0.3);
        c.save(); c.strokeStyle = S.nm(nm); c.lineWidth = 4; c.beginPath(); c.moveTo(xt + 2, cy - tw); c.lineTo(xt + 2, cy + tw); c.stroke(); c.restore();
        kit.label(c, 'array 1', xa1 + 2, cy + H0 + 16, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'array 2', xa2 + 2, cy + H0 + 16, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'condenser', xc, cy + H0 * 1.05 + 14, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'target: W = ' + fmtL(kit, Wp), xt - 4, cy - tw - 12, { align: 'right', color: C.text, size: 11.5 });
        kit.label(c, nAcross + ' lenslets across' + (nAcross > nShow ? ' (' + nShow + ' drawn)' : ''), xl + 30, cy - H0 - 10, { align: 'left', color: C.muted, size: 11.5 });
        // the whole target
        const X = i => Wp * 1e3 * (0.65 * (2 * i / 160 - 1)), edge = Lam * 1e3 / 4, box1 = [], gau = [];
        for (let i = 0; i <= 160; i++) { const x = X(i), a = Math.abs(x); box1.push([x, 1 / (1 + Math.exp((a - Wp * 500) / Math.max(edge, 1e-4)))]); gau.push([x, Math.exp(-2 * x * x / Math.pow(Wp * 500, 2))]); }
        plot.set({ series: [{ pts: gau, color: C.muted, label: 'the raw Gaussian beam, same width', dash: true }, { pts: box1, color: C.accent, label: 'with the homogenizer (averaged)' }] });
        // the zoom: the laser comb
        const J = Math.max(1, Math.floor(1.5 * w / p)), a = j => Math.exp(-Math.pow(j * p / w, 2));
        let den = a(0) * a(0), sum = a(0);
        for (let j = 1; j <= J; j++) { den += 2 * a(j) * a(j); sum += 2 * a(j); }
        const comb = [], flatp = [], span = 3 * Lam * 1e6;
        let pk = 0;
        for (let i = 0; i <= 240; i++) {
          const xm = Lam * (-3 + 6 * i / 240), ph = 2 * PI * xm / Lam;
          let S0 = a(0); for (let j = 1; j <= J; j++) S0 += 2 * a(j) * Math.cos(j * ph);
          const I = S0 * S0 / den; pk = Math.max(pk, I);
          comb.push([xm * 1e6, I]); flatp.push([xm * 1e6, 1]);
        }
        zoom.set({ series: V.src === 'laser' ? [{ pts: comb, color: C.warn, label: 'single-mode laser: fringes' }, { pts: flatp, color: C.muted, label: 'lamp: flat', dash: true }] : [{ pts: flatp, color: C.accent, label: 'lamp or LED: flat' }] });
        ro.set('W', fmtL(kit, Wp));
        ro.set('N', String(nAcross));
        ro.set('na', kit.fmt(p / (2 * fLA), 3));
        ro.set('lam', fmtL(kit, Lam));
        ro.set('pk', V.src === 'laser' ? kit.fmt(pk, 3) + '×  (a flat patch would be 1)' : '1 for a lamp: no fringes');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a diffractive optical element */
  Hyper.sim('bs-doe', {
    title: 'A diffractive element: levels, orders and the zero order',
    blurb: `A staircase relief of L levels, one period of it repeated, lit by a beam. The relief is exact for the design wavelength (633 nm); the phase of each step is computed for the wavelength you choose, and the light goes to the diffraction orders in the proportions shown by the bars. The rays leave at the true angles for the chosen period.

**Try this**
- At the design wavelength with 2 levels, the zero order is gone and 40.5 % goes to each of the ±1 orders: an even splitter. With 4, 8, 16 levels the light moves to the +1 order alone: 81, 95, 99 %.
- Detune the wavelength with 8 levels: the +1 order loses a little and the zero order grows. At 0.7 of the design wavelength it falls to about half.
- Change the period: the orders fan out as sin θ = mλ/d; a short period sends them far, and some orders cease to exist.
- Read the relief depth in fused silica: about 1.4 µm for a full wave of delay.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sh = O.shape;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const L0 = 633;
      const ctl = kit.controls(box.side, [
        { id: 'L', type: 'select', label: 'Phase levels per period', options: [['2 (binary)', 2], ['3', 3], ['4', 4], ['8', 8], ['16', 16], ['64 (nearly a smooth blaze)', 64]], value: params.L || 8 },
        { id: 'r', label: 'Wavelength ÷ design wavelength (633 nm)', min: 0.7, max: 1.4, step: 0.01, value: 1, unit: '' },
        { id: 'd', label: 'Period of the pattern', min: 4, max: 60, step: 1, value: 20, unit: 'µm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eta1', 'Light in the +1 order'], ['eta0', 'Light in the zero order'], ['etam', 'Light in the −1 order'], ['rest', 'Light in other orders'], ['ang', 'Angle of the +1 order'], ['h', 'Relief depth, fused silica (full wave)']]);
      // the efficiency of order m for a staircase of L levels at wavelength ratio r
      const eff = (L, r, m) => {
        let re = 0, im = 0;
        for (let j = 0; j < L; j++) {
          const ph = 2 * PI * (j / L) / r;
          let ar, ai;
          if (m === 0) { ar = 1 / L; ai = 0; }
          else { const a0 = -2 * PI * m * j / L, a1 = -2 * PI * m * (j + 1) / L; ar = (Math.sin(a0) - Math.sin(a1)) / (2 * PI * m); ai = -(Math.cos(a0) - Math.cos(a1)) / (2 * PI * m); }
          re += Math.cos(ph) * ar - Math.sin(ph) * ai; im += Math.cos(ph) * ai + Math.sin(ph) * ar;
        }
        return re * re + im * im;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, L = V.L, nm = L0 * V.r, per = V.d * 1e-6;
        // the plate, edge on: the relief steps along y, the light comes from the left
        const xp = W * 0.2, cy = Hh * 0.36, ph = Hh * 0.3, np = 2, hd = 26, pp = 2 * ph / np;
        const outline = [[xp - 40, cy - ph]];
        for (let k = 0; k < np; k++) for (let j = 0; j < L; j++) {
          const y0 = cy - ph + pp * k + pp * j / L, dep = hd * (j / L);
          outline.push([xp + dep, y0], [xp + dep, y0 + pp / L]);
        }
        outline.push([xp - 40, cy + ph]);
        S.poly(c, outline);
        S.beam(c, 20, xp - 40, cy, ph, { nm, alpha: 0.15, edge: false });
        kit.label(c, 'one relief period = ' + L + ' levels', xp - 20, cy + ph + 16, { align: 'center', color: C.muted, size: 11.5 });
        // the orders as rays at their true angles
        const es = {}; let tot = 0;
        for (let m = -4; m <= 4; m++) { es[m] = eff(L, V.r, m); tot += es[m]; }
        const xe = W * 0.62;
        for (let m = -4; m <= 4; m++) {
          const s = m * nm * 1e-9 / per; if (Math.abs(s) >= 0.999) continue;
          const th = Math.asin(s), len = xe - xp, yEnd = cy - Math.tan(th) * len * 3;      // angles exaggerated ×3 for the drawing
          S.ray(c, [[xp, cy], [xe, clamp(yEnd, 8, Hh * 0.74)]], { nm, width: 0.8 + 3 * Math.sqrt(es[m]), alpha: 0.25 + 0.75 * Math.min(1, Math.sqrt(es[m]) * 1.3), arrows: false });
          kit.label(c, 'm = ' + (m > 0 ? '+' : '') + m, xe + 6, clamp(yEnd, 8, Hh * 0.74), { align: 'left', color: C.muted, size: 10.5 });
        }
        kit.label(c, 'angles drawn 3× larger', xp + 70, 14, { align: 'left', color: C.faint, size: 10.5 });
        // the bars of the efficiencies
        const bx = W * 0.72, bw = W * 0.26, by = Hh * 0.78, bh = Hh * 0.5, n = 9;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(bx - 4, by); c.lineTo(bx + bw + 4, by); c.stroke();
        for (let i = 0; i < n; i++) {
          const m = i - 4, e = es[m], x = bx + bw * (i + 0.15) / n, ww = bw * 0.7 / n;
          c.fillStyle = m === 0 ? C.warn : S.nm(nm); c.fillRect(x, by - bh * e, ww, bh * e);
          kit.label(c, (m > 0 ? '+' : '') + m, x + ww / 2, by + 11, { align: 'center', color: C.muted, size: 10.5 });
          if (e > 0.02) kit.label(c, kit.fmt(100 * e, 3), x + ww / 2, by - bh * e - 7, { align: 'center', color: C.text, size: 9.5 });
        }
        kit.label(c, 'light in each order (%)', bx + bw / 2, by - bh - 14, { align: 'center', color: C.muted, size: 11.5 });
        const nFS = O.index('fused-silica', L0);
        const s1 = nm * 1e-9 / per;
        ro.set('eta1', kit.fmt(100 * es[1], 3) + ' %');
        ro.set('eta0', kit.fmt(100 * es[0], 3) + ' %');
        ro.set('etam', kit.fmt(100 * es[-1], 3) + ' %');
        ro.set('rest', kit.fmt(100 * Math.max(0, tot - es[1] - es[0] - es[-1]), 3) + ' %' + (Math.abs(1 - tot) > 0.02 ? '  (beyond ±4, or evanescent)' : ''));
        ro.set('ang', s1 < 1 ? kit.fmt(Math.asin(s1) * R2D, 3) + '°' : 'does not exist');
        ro.set('h', kit.fmt(L0 * 1e-3 / (nFS - 1), 3) + ' µm  (n = ' + kit.fmt(nFS, 4) + ')');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a dot projector and the depth it reveals */
  Hyper.sim('bs-dots', {
    title: 'A dot projector and the depth it reveals',
    blurb: `A laser and a diffractive element throw a grid of dots at fixed angles. A camera a baseline b to the side sees every dot displaced by f·b/z pixels. The camera view (right) shows where each dot would be if the whole scene were the flat wall (faint rings) and where it really is: the dots that fall on the nearer box have moved, by an amount that tells the box's distance. The top view (left) is drawn with the lateral scale enlarged.

**Try this**
- Move the box closer to the projector: its dots shift farther. The shift in pixels is f·b·(1/z_box − 1/z_wall), and the read-out turns it back into a distance.
- Lengthen the baseline: the same depth difference gives a bigger shift, so a finer depth step (Δz = z²δ/bf).
- Move the wall away: dot spacing grows (z·tan of the pitch) while each dot stays as wide as the beam.
- Change the angular pitch: the same pattern spreads or packs. Notice that a regular grid cannot tell a shift of one pitch from none: that is why depth cameras use irregular patterns.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300 });
      const FPX = 800;
      const ctl = kit.controls(box.side, [
        { id: 'z', label: 'Distance to the wall', min: 0.5, max: 5, value: 2, unit: 'm', log: true, sig: 2 },
        { id: 'fr', label: 'Box distance, as a fraction of the wall distance', min: 0.15, max: 0.95, step: 0.01, value: 0.5, fmt: v => kit.fmt(v * 100, 3) + ' %' },
        { id: 'b', label: 'Baseline: projector to camera', min: 20, max: 150, step: 1, value: 50, unit: 'mm' },
        { id: 'pitch', label: 'Angular pitch of the dots', min: 0.3, max: 2, step: 0.01, value: 0.54, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['s', 'Dot spacing on the wall'], ['zo', 'Box distance'], ['dw', 'Disparity of the wall, b·f / z'], ['do', 'Disparity of the box'], ['sh', 'Shift of the box dots against the wall dots'], ['zr', 'Depth recovered from the box disparity'], ['dz', 'Depth step for 0.1 px at the box']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, p = V.pitch * D2R, z = V.z, zo = V.fr * V.z, b = V.b * 1e-3;
        // top view on the left: depth along x, lateral position along y (the lateral scale is enlarged)
        const pw = W * 0.55, x0 = 18, cy = Hh * 0.5, kz = (pw - 40) / z, lat = (Hh * 0.38) / (z * Math.tan(3.5 * p));
        const X = d => x0 + d * kz, Y = l => cy - l * lat;
        S.source(c, x0, cy, { kind: 'laser', color: S.nm(650), size: 8 });
        kit.label(c, 'projector', x0 + 4, cy + 22, { align: 'left', color: C.muted, size: 11 });
        const camY = cy - Math.min(Hh * 0.12, 6 + b * 60);
        c.fillStyle = C.muted; c.fillRect(x0 - 8, camY - 5, 16, 10);
        kit.label(c, 'camera', x0 + 4, camY - 12, { align: 'left', color: C.muted, size: 11 });
        // the wall and the box
        c.fillStyle = C.muted; c.fillRect(X(z), cy - Hh * 0.46, 4, Hh * 0.92);
        const bh = zo * Math.tan(1.5 * p) * lat;
        S.poly(c, [[X(zo), cy - bh], [X(zo) + 16, cy - bh], [X(zo) + 16, cy + bh], [X(zo), cy + bh]], { fill: C.dark ? 'rgba(224,160,48,0.3)' : 'rgba(181,122,16,0.25)', color: C.warn });
        kit.label(c, 'box', X(zo) + 8, cy + bh + 12, { align: 'center', color: C.warn, size: 11 });
        for (let i = -3; i <= 3; i++) {
          const th = i * p, onBox = Math.abs(i) <= 1, dd = onBox ? zo : z, yy = dd * Math.tan(th);
          S.ray(c, [[x0, cy], [X(dd), Y(yy)]], { color: C.dark ? 'rgba(255,90,90,0.8)' : 'rgba(220,40,40,0.8)', width: 1.1, arrows: false });
          c.fillStyle = onBox ? C.warn : C.text; c.beginPath(); c.arc(X(dd), Y(yy), 3, 0, TAU); c.fill();
          if (i === 0 || i === 2) S.ray(c, [[x0, camY], [X(dd), Y(yy)]], { color: C.faint, width: 1, dash: [3, 3], arrows: false });
        }
        S.dim(c, X(0), cy + Hh * 0.44, X(z), cy + Hh * 0.44, 'z = ' + kit.fmt(z, 3) + ' m', { off: 12 });
        // the camera view: reference positions and displaced dots
        const sz = Math.min(W * 0.36, Hh - 56), ix = W - sz - 14, iy = 26, sp = Math.tan(p) * FPX, scl = sz / (7.6 * sp);       // screen px per image px
        c.fillStyle = C.surface; c.fillRect(ix, iy, sz, sz); c.strokeStyle = C.grid; c.strokeRect(ix, iy, sz, sz);
        const dsh = FPX * b * (1 / zo - 1 / z), ccx = ix + sz / 2, ccy = iy + sz / 2;
        c.save(); c.beginPath(); c.rect(ix, iy, sz, sz); c.clip();
        for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) {
          const x = ccx + i * sp * scl, y = ccy - j * sp * scl, onBox = Math.abs(i) <= 1 && Math.abs(j) <= 1;
          if (!onBox) { c.fillStyle = C.text; c.beginPath(); c.arc(x, y, 3, 0, TAU); c.fill(); }
          else {
            c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(x, y, 3.5, 0, TAU); c.stroke();
            const xs = x - dsh * scl;
            S.ray(c, [[x - 4, y], [xs + 4, y]], { color: C.warn, width: 1, arrows: false, alpha: 0.7 });
            c.fillStyle = C.warn; c.beginPath(); c.arc(xs, y, 3.2, 0, TAU); c.fill();
          }
        }
        c.restore();
        kit.label(c, 'what the camera sees', ix + sz / 2, iy - 12, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'rings: wall positions; amber: shifted box dots', ix + sz / 2, iy + sz + 12, { align: 'center', color: C.faint, size: 10.5 });
        const dwall = b * FPX / z, dobj = b * FPX / zo;
        ro.set('s', kit.fmt(z * Math.tan(p) * 1e3, 3) + ' mm');
        ro.set('zo', kit.fmt(zo, 3) + ' m');
        ro.set('dw', kit.fmt(dwall, 3) + ' px');
        ro.set('do', kit.fmt(dobj, 3) + ' px');
        ro.set('sh', kit.fmt(dsh, 3) + ' px  (' + kit.fmt(dsh / sp, 3) + ' dot spacings)');
        ro.set('zr', kit.fmt(Sc.depthFromDisparity(b, FPX, dobj), 3) + ' m');
        ro.set('dz', kit.fmt(zo * zo * 0.1 / (b * FPX) * 1e3, 3) + ' mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a spatial light modulator: Gerchberg-Saxton */
  const NN = 64;
  const fft1 = (re, im, inv) => {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = 2 * PI / len * (inv ? 1 : -1), wr = Math.cos(ang), wi = Math.sin(ang), h = len >> 1;
      for (let i = 0; i < n; i += len) {
        let cr = 1, ci = 0;
        for (let k = 0; k < h; k++) {
          const a = i + k, b2 = a + h, vr = re[b2] * cr - im[b2] * ci, vi = re[b2] * ci + im[b2] * cr;
          re[b2] = re[a] - vr; im[b2] = im[a] - vi; re[a] += vr; im[a] += vi;
          const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
        }
      }
    }
    if (inv) for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
  };
  const fft2 = (re, im, inv) => {
    const tr = new Float64Array(NN), ti = new Float64Array(NN);
    for (let y = 0; y < NN; y++) { for (let x = 0; x < NN; x++) { tr[x] = re[y * NN + x]; ti[x] = im[y * NN + x]; } fft1(tr, ti, inv); for (let x = 0; x < NN; x++) { re[y * NN + x] = tr[x]; im[y * NN + x] = ti[x]; } }
    for (let x = 0; x < NN; x++) { for (let y = 0; y < NN; y++) { tr[y] = re[y * NN + x]; ti[y] = im[y * NN + x]; } fft1(tr, ti, inv); for (let y = 0; y < NN; y++) { re[y * NN + x] = tr[y]; im[y * NN + x] = ti[y]; } }
  };
  /* the wanted far-field intensity on the centred grid, as an array indexed [(v + N) % N][(u + N) % N] */
  const targetMap = id => {
    const T = new Float64Array(NN * NN), put = (u, v, val) => { if (u >= -NN / 2 && u < NN / 2 && v >= -NN / 2 && v < NN / 2) { const k = ((v + NN) % NN) * NN + ((u + NN) % NN); T[k] = Math.max(T[k], val); } };
    for (let v = -NN / 2; v < NN / 2; v++) for (let u = -NN / 2; u < NN / 2; u++) {
      const r = Math.hypot(u, v);
      let val = 0;
      if (id === 'ring') val = Math.exp(-Math.pow(r - 13, 2) / (2 * 1.3 * 1.3));
      else if (id === 'spots') { for (let k = 0; k < 6; k++) { const a = k * PI / 3 + PI / 6, du = u - 13 * Math.cos(a), dv = v - 13 * Math.sin(a); val = Math.max(val, Math.exp(-(du * du + dv * dv) / (2 * 1.2 * 1.2))); } }
      else if (id === 'cross') val = (Math.abs(v) <= 1 && Math.abs(u) <= 16 && r > 3 ? 1 : 0) + (Math.abs(u) <= 1 && Math.abs(v) <= 16 && r > 3 ? 1 : 0) > 0 ? 1 : 0;
      else if (id === 'letter') val = ((u >= -9 && u <= -6 && v >= -14 && v <= 14) || (v >= 11 && v <= 14 && u >= -9 && u <= 10)) ? 1 : 0;
      else val = (Math.abs(v) <= 1 && Math.abs(u) <= 17 && Math.abs(u) > 2) ? 1 : 0;
      if (val > 0) put(u, v, val);
    }
    return T;
  };
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const beamAmp = () => { const A = new Float64Array(NN * NN); for (let y = 0; y < NN; y++) for (let x = 0; x < NN; x++) { const dx = x - NN / 2, dy = y - NN / 2; A[y * NN + x] = Math.exp(-(dx * dx + dy * dy) / (2 * 13 * 13)); } return A; };
  const gs = (target, iters) => {
    const A = beamAmp(), T = targetMap(target), rand = rng(7), phi = new Float64Array(NN * NN), re = new Float64Array(NN * NN), im = new Float64Array(NN * NN);
    let nT = 0; for (let k = 0; k < NN * NN; k++) nT += T[k] * T[k];
    nT = Math.sqrt(nT) || 1;
    for (let k = 0; k < NN * NN; k++) phi[k] = rand() * TAU;
    for (let it = 0; it < iters; it++) {
      for (let k = 0; k < NN * NN; k++) { re[k] = A[k] * Math.cos(phi[k]); im[k] = A[k] * Math.sin(phi[k]); }
      fft2(re, im, false);
      let nF = 0; for (let k = 0; k < NN * NN; k++) nF += re[k] * re[k] + im[k] * im[k];
      nF = Math.sqrt(nF);
      for (let k = 0; k < NN * NN; k++) { const m = Math.hypot(re[k], im[k]), amp = T[k] / nT * nF; if (m < 1e-12) { re[k] = amp; im[k] = 0; } else { re[k] *= amp / m; im[k] *= amp / m; } }
      fft2(re, im, true);
      for (let k = 0; k < NN * NN; k++) phi[k] = Math.atan2(im[k], re[k]);
    }
    return { phi, A, T };
  };

  Hyper.sim('bs-slm', {
    title: 'A phase SLM and a computed hologram',
    blurb: `A spatial light modulator shows a phase mask (left); the laser, a Gaussian beam, falls on it and the far field (right) is the pattern. The mask is found by the **Gerchberg–Saxton** iteration: start from a random phase, go to the far field, impose the wanted amplitudes, come back, impose the beam's. The right-hand picture is computed from the mask the SLM would really show, with its limited number of phase levels.

**Try this**
- Set the iterations to **0**: the mask is random and the far field is speckle. Add iterations: the pattern emerges and the light moves into it. Past 20 or 30 rounds there is little more to gain.
- Choose the letter L and reduce the phase levels from 256 to 2: the L gets an upside-down twin (the far field of a binary phase mask is always point-symmetric) and the pattern gets noisier; at 8 levels it is nearly clean again.
- The **zero order** (undiffracted light at the centre) is tiny here because this model has no gaps between pixels and ideal polarization; on a real chip they add a bright central spot.
- Read the largest steering angle of the chip from its pixel pitch and the wavelength.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sh = O.shape;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'target', type: 'select', label: 'Pattern wanted', options: [['Six spots on a ring', 'spots'], ['A ring', 'ring'], ['A cross', 'cross'], ['The letter L', 'letter'], ['A line', 'line']], value: params.target || 'spots' },
        { id: 'iters', label: 'Gerchberg–Saxton iterations', min: 0, max: 60, step: 1, value: params.iters != null ? params.iters : 25 },
        { id: 'levels', type: 'select', label: 'Phase levels of the SLM', options: [['256 (8 bit)', 256], ['16', 16], ['8', 8], ['4', 4], ['2 (binary)', 2]], value: 256 },
        { id: 'pitch', label: 'Pixel pitch', min: 3.7, max: 20, step: 0.1, value: 8, unit: 'µm' },
        { id: 'nm', type: 'select', label: 'Wavelength', options: [['532 nm', 532], ['633 nm', 633], ['1064 nm', 1064]], value: 532 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pat', 'Light in the pattern'], ['zero', 'Zero order (centre spot)'], ['ang', 'Largest steering angle, λ / 2p'], ['eff', 'Efficiency of a grating with these levels']]);
      let gsKey = '', gsOut = null, outKey = '', outRes = null;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const k1 = V.target + '|' + V.iters;
        if (k1 !== gsKey) { gsOut = gs(V.target, V.iters); gsKey = k1; outKey = ''; }
        const k2 = k1 + '|' + V.levels;
        if (k2 !== outKey) {
          const L = V.levels, re = new Float64Array(NN * NN), im = new Float64Array(NN * NN), q = new Float64Array(NN * NN);
          for (let k = 0; k < NN * NN; k++) { const lv = Math.round(((gsOut.phi[k] % TAU + TAU) % TAU) / TAU * L) % L; q[k] = lv / L; const ph = lv * TAU / L; re[k] = gsOut.A[k] * Math.cos(ph); im[k] = gsOut.A[k] * Math.sin(ph); }
          fft2(re, im, false);
          const I = new Float64Array(NN * NN); let tot = 0, inPat = 0, mxT = 0;
          for (let k = 0; k < NN * NN; k++) { I[k] = re[k] * re[k] + im[k] * im[k]; tot += I[k]; mxT = Math.max(mxT, gsOut.T[k]); }
          for (let k = 0; k < NN * NN; k++) if (gsOut.T[k] > 0.3 * mxT) inPat += I[k];
          // the average intensity inside the pattern sets the brightness scale
          let cnt = 0, sum = 0; for (let k = 0; k < NN * NN; k++) if (gsOut.T[k] > 0.3 * mxT) { cnt++; sum += I[k]; }
          outRes = { q, I, scale: (sum / Math.max(1, cnt)) * 2.2 || 1, pat: inPat / tot, zero: I[0] / tot };
          outKey = k2;
        }
        const sz = Math.min((W - 60) / 3, Hh - 50), y0 = 28, gap = 14, x1 = (W - 3 * sz - 2 * gap) / 2, x2 = x1 + sz + gap, x3 = x2 + sz + gap;
        S.image(c, x1, y0, sz, sz, NN, NN, (u, v) => outRes.q[Math.min(NN - 1, Math.floor(v * NN)) * NN + Math.min(NN - 1, Math.floor(u * NN))], { smooth: false, key: 'm' + k2, id: 'slmask' });
        S.image(c, x2, y0, sz, sz, NN, NN, (u, v) => { const iu = Math.min(NN - 1, Math.floor(u * NN)), iv = Math.min(NN - 1, Math.floor(v * NN)); return gsOut.T[((iv - NN / 2 + NN) % NN) * NN + ((iu - NN / 2 + NN) % NN)] > 0.3 ? 1 : 0.05; }, { smooth: false, key: 't' + V.target, id: 'slt', nm: 532 });
        S.image(c, x3, y0, sz, sz, NN, NN, (u, v) => { const iu = Math.min(NN - 1, Math.floor(u * NN)), iv = Math.min(NN - 1, Math.floor(v * NN)); return outRes.I[((iv - NN / 2 + NN) % NN) * NN + ((iu - NN / 2 + NN) % NN)] / outRes.scale; }, { smooth: false, key: 'o' + k2, id: 'slo', gamma: 0.6, nm: V.nm });
        for (const x of [x1, x2, x3]) { c.strokeStyle = C.grid; c.strokeRect(x, y0, sz, sz); }
        kit.label(c, 'phase mask (black 0 → white 2π)', x1 + sz / 2, y0 - 12, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'pattern wanted', x2 + sz / 2, y0 - 12, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'pattern made (far field)', x3 + sz / 2, y0 - 12, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, '64 × 64 pixels, Gaussian illumination', x1 + sz / 2, y0 + sz + 14, { align: 'center', color: C.faint, size: 10.5 });
        const L = V.levels;
        ro.set('pat', kit.fmt(100 * outRes.pat, 3) + ' %');
        ro.set('zero', kit.fmt(100 * outRes.zero, 3) + ' %');
        ro.set('ang', kit.fmt(Sh.doeAngle(1, 2 * V.pitch * 1e-6, V.nm) * R2D, 3) + '°');
        ro.set('eff', kit.fmt(100 * Math.pow(Math.sin(PI / L) / (PI / L), 2), 4) + ' %');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a holographic optical element */
  Hyper.sim('bs-hoe', {
    title: 'A thick hologram: the Bragg condition',
    blurb: `A transmission volume hologram recorded with two beams at an angle θ_r in a film of index 1.5. Its fringe planes (drawn exaggerated across the film) diffract the replay beam only near the Bragg condition. The curves are the coupled-wave result for a lossless thick grating: efficiency against replay angle (left graph) and against wavelength at the current angle (right graph).

**Try this**
- Replay at the recording wavelength and angle error 0: the efficiency is at its peak, and the beam is diffracted to the other side of the normal.
- Tilt the replay beam by a few degrees: the diffracted beam fades. Thicken the film and the angular peak narrows.
- Change the replay wavelength with the angle held: the hologram falls out of step. This colour selectivity is what makes volume holograms good filters and combiners.
- Raise Δn: the peak efficiency climbs to 100 % at ν = π/2, and beyond it the film over-modulates and the efficiency falls again.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 260 });
      const pa = kit.plot(box.stage, { x: { label: 'replay angle error (°)', name: 'Δθ' }, y: { label: 'diffraction efficiency', name: 'η', min: 0, max: 1.05 }, series: [] }, 120);
      const pw = kit.plot(box.stage, { x: { label: 'replay wavelength (nm)', name: 'λ', min: 440, max: 640 }, y: { label: 'diffraction efficiency', name: 'η', min: 0, max: 1.05 }, series: [] }, 120);
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Film thickness d', min: 2, max: 60, step: 1, value: 15, unit: 'µm' },
        { id: 'dn', label: 'Index modulation Δn', min: 0.002, max: 0.05, step: 0.001, value: 0.02 },
        { id: 'thr', label: 'Angle between the recording beams (air)', min: 10, max: 120, step: 1, value: 40, unit: '°' },
        { id: 'nm', label: 'Replay wavelength (recorded at 532 nm)', min: 440, max: 640, step: 1, value: 532, unit: 'nm' },
        { id: 'err', label: 'Replay angle error', min: -8, max: 8, step: 0.1, value: 0, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['Lam', 'Fringe period Λ'], ['Q', 'Thickness parameter Q'], ['bragg', 'Bragg angle at this wavelength'], ['peak', 'Peak efficiency, sin²ν'], ['eta', 'Efficiency now'], ['fa', 'Angular width (FWHM)'], ['fw', 'Spectral width (FWHM)']]);
      const NM = 1.5, LREC = 532;
      const eta = (lam, thAir, Lam, d, dn) => {
        const k = TAU / (lam * 1e-9), K = TAU / Lam, kx = k * Math.sin(thAir), r1 = (k * NM) * (k * NM) - kx * kx; if (r1 <= 0) return 0;
        const kxs = kx - K, r2 = (k * NM) * (k * NM) - kxs * kxs; if (r2 <= 0) return 0;
        const delta = Math.sqrt(r1) - Math.sqrt(r2), xi = delta * d / 2, ci = Math.sqrt(r1) / (k * NM), nu = PI * dn * d / (lam * 1e-9 * ci);
        return Math.sin(Math.sqrt(nu * nu + xi * xi)) * Math.sin(Math.sqrt(nu * nu + xi * xi)) / (1 + xi * xi / (nu * nu));
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, d = V.d * 1e-6, dn = V.dn, thr = V.thr * D2R;
        const Lam = LREC * 1e-9 / (2 * Math.sin(thr / 2)), thRef = thr / 2, th = thRef + V.err * D2R, nm = V.nm;
        const thIn = Math.asin(Math.sin(thRef) / NM), nu0 = PI * dn * d / (LREC * 1e-9 * Math.cos(thIn)), Q = TAU * LREC * 1e-9 * d / (NM * Lam * Lam);
        const e = eta(nm, th, Lam, d, dn);
        // the film, seen from the side: the light comes from the left, the film normal is horizontal
        const cx = W * 0.4, cy = Hh * 0.5, tp = clamp(d * 1e6 * 2.6, 14, 150), hf = Hh * 0.62, fp = clamp(Lam * 1e6 * 16, 8, 40);
        c.fillStyle = S.glass(0.2); c.fillRect(cx - tp / 2, cy - hf / 2, tp, hf);
        c.strokeStyle = S.edge(); c.lineWidth = 1.2; c.strokeRect(cx - tp / 2, cy - hf / 2, tp, hf);
        c.save(); c.strokeStyle = C.accent; c.globalAlpha = 0.45; c.lineWidth = 1; c.beginPath();
        for (let y = cy - hf / 2 + fp / 2; y < cy + hf / 2; y += fp) { c.moveTo(cx - tp / 2, y); c.lineTo(cx + tp / 2, y); }
        c.stroke(); c.restore();
        kit.label(c, 'fringe planes (not to scale)', cx, cy - hf / 2 - 10, { align: 'center', color: C.muted, size: 11 });
        // beams: incident at th (up-going from below left), transmitted straight on, diffracted at asin(sin th − λ/Λ)
        const L0 = Math.min(cx - tp / 2 - 20, 190), sd = Math.sin(th) - nm * 1e-9 / Lam, hasD = Math.abs(sd) < 1;
        const inA = [cx - tp / 2 - L0 * Math.cos(th), cy + L0 * Math.sin(th)], mid = [cx, cy];
        S.ray(c, [inA, mid], { nm, width: 2.4 });
        S.ray(c, [mid, [cx + tp / 2 + L0 * Math.cos(th), cy - L0 * Math.sin(th)]], { nm, width: 0.8 + 2 * (1 - e), alpha: 0.2 + 0.8 * (1 - e) });
        if (hasD) { const td = Math.asin(sd); S.ray(c, [mid, [cx + tp / 2 + L0 * Math.cos(td), cy - L0 * Math.sin(td)]], { nm, width: 0.8 + 2.4 * e, alpha: 0.2 + 0.8 * e }); }
        kit.label(c, 'replay beam', inA[0] + 10, inA[1] + 14, { align: 'left', color: C.muted, size: 11 });
        kit.label(c, 'transmitted ' + kit.fmt(100 * (1 - e), 3) + ' %', cx + tp / 2 + 70, cy - L0 * Math.sin(th) - 8, { align: 'left', color: C.muted, size: 11 });
        if (hasD) kit.label(c, 'diffracted ' + kit.fmt(100 * e, 3) + ' %', cx + tp / 2 + 70, cy - L0 * Math.sin(Math.asin(sd)) + 14, { align: 'left', color: C.text, size: 11 });
        // the two curves
        const pts1 = [], pts2 = []; let mx1 = 0;
        for (let i = 0; i <= 160; i++) { const a = -8 + 16 * i / 160, v = eta(nm, thRef + a * D2R, Lam, d, dn); pts1.push([a, v]); mx1 = Math.max(mx1, v); }
        for (let i = 0; i <= 200; i++) { const l = 440 + 200 * i / 200; pts2.push([l, eta(l, th, Lam, d, dn)]); }
        const width = (pts, mx) => { let lo = null, hi = null; for (const p of pts) if (p[1] >= mx / 2) { if (lo === null) lo = p[0]; hi = p[0]; } return lo === null ? 0 : hi - lo; };
        let mx2 = 0; for (const p of pts2) mx2 = Math.max(mx2, p[1]);
        pa.set({ series: [{ pts: pts1, color: C.accent, label: 'efficiency against angle' }], marks: [{ x: V.err, y: e, label: 'now', color: C.warn }] });
        pw.set({ series: [{ pts: pts2, color: C.accent, label: 'efficiency against wavelength' }], marks: [{ x: nm, y: e, label: 'now', color: C.warn }], vlines: [{ x: LREC, label: '532 nm', color: C.faint }] });
        ro.set('Lam', kit.fmt(Lam * 1e6, 3) + ' µm');
        ro.set('Q', kit.fmt(Q, 3) + (Q > 10 ? '  (thick: Bragg regime)' : Q > 1 ? '  (in between: the model is rough)' : '  (thin: many orders, the model does not apply)'));
        ro.set('bragg', nm * 1e-9 / (2 * Lam) < 1 ? kit.fmt(Math.asin(nm * 1e-9 / (2 * Lam)) * R2D, 3) + '°  (recorded at ' + kit.fmt(thRef * R2D, 3) + '°)' : 'none');
        ro.set('peak', kit.fmt(100 * Math.pow(Math.sin(nu0), 2), 3) + ' %  (ν = ' + kit.fmt(nu0, 3) + ' rad)');
        ro.set('eta', kit.fmt(100 * e, 3) + ' %');
        ro.set('fa', kit.fmt(width(pts1, mx1), 3) + '°');
        ro.set('fw', kit.fmt(width(pts2, mx2), 3) + ' nm (at this angle)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a compound parabolic concentrator */
  /* trace one ray in a CPC: right wall pts (entrance first), the left wall its mirror; exit plane y = 0 of half-width a */
  const cpcTrace = (pts, x, y, dx, dy, a) => {
    const path = [[x, y]], yTop = pts[0][1];
    for (let bounce = 0; bounce < 24; bounce++) {
      let best = Infinity, bn = null;
      for (const sgn of [1, -1]) for (let i = 0; i + 1 < pts.length; i++) {
        const ax = sgn * pts[i][0], ay = pts[i][1], bx = sgn * pts[i + 1][0], by = pts[i + 1][1], ex = bx - ax, ey = by - ay, den = dx * ey - dy * ex;
        if (Math.abs(den) < 1e-12) continue;
        const t = ((ax - x) * ey - (ay - y) * ex) / den, u = ((ax - x) * dy - (ay - y) * dx) / den;
        if (t > 1e-9 && u >= 0 && u <= 1 && t < best) { best = t; const l = Math.hypot(ex, ey); bn = [-ey / l, ex / l]; }
      }
      const tExit = dy < 0 ? -y / dy : Infinity, tTop = dy > 0 ? (yTop - y) / dy : Infinity;
      if (tExit < best && tExit < tTop) { const xe = x + dx * tExit; path.push([xe, 0]); return { ok: Math.abs(xe) <= a + 1e-9, path }; }
      if (tTop < best) { path.push([x + dx * tTop, yTop]); return { ok: false, path }; }
      if (!bn) return { ok: false, path };
      x += dx * best; y += dy * best; path.push([x, y]);
      const dot = dx * bn[0] + dy * bn[1]; dx -= 2 * dot * bn[0]; dy -= 2 * dot * bn[1];
    }
    return { ok: false, path };
  };
  Hyper.sim('bs-concentrator', {
    title: 'A compound parabolic concentrator',
    blurb: `Parallel light arrives from above at an angle α to the axis. A compound parabolic concentrator (CPC) is built so that every ray with α inside its acceptance half-angle θ reaches the small exit at the bottom, after at most a few reflections, and every ray outside it is turned back. Green rays reach the receiver; red rays are rejected. The graph is the fraction of the entrance that reaches the exit, against α.

**Try this**
- Set α below θ: all rays arrive. Raise α past θ: the transmission drops from 100 % to nothing within a degree or two.
- Narrow the acceptance angle θ: the funnel gets longer and thinner and the concentration (entrance ÷ exit width) rises as 1/sin θ.
- Truncate the funnel: a 60 % long CPC loses only a few per cent of its concentration and keeps most of its acceptance. The upper part is nearly straight and does little.
- For the Sun (a half-angle of 0.27°) an ideal CPC would give about 215.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sh = O.shape;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const plot = kit.plot(box.stage, { x: { label: 'angle of the light α (°)', name: 'α' }, y: { label: 'fraction reaching the exit', name: 'T', min: 0, max: 1.05 }, series: [] }, 140);
      const ctl = kit.controls(box.side, [
        { id: 'th', label: 'Acceptance half-angle θ', min: 5, max: 40, step: 1, value: params.th || 15, unit: '°' },
        { id: 'al', label: 'Angle of the light α', min: 0, max: 60, step: 0.5, value: 8, unit: '°' },
        { id: 'tr', label: 'Funnel length kept', min: 50, max: 100, step: 1, value: 100, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['C', 'Concentration of this funnel (entrance ÷ exit)'], ['ideal', 'Ideal CPC, 1 / sin θ'], ['len', 'Length ÷ entrance width'], ['acc', 'Reaching the exit at this angle'], ['sun', 'Sun (half-angle 0.267°): two-dimensional limit']]);
      let key = '', walls = null, curve = null;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, th = V.th * D2R, al = V.al * D2R;
        const k = V.th + '|' + V.tr;
        if (k !== key) {
          const a = 1, full = Sh.cpc(a, th, 80), yc = full[0][1] * V.tr / 100;
          let pts = full;
          if (V.tr < 99.5) {
            pts = [];
            for (let i = 0; i < full.length - 1; i++) { const p = full[i], q = full[i + 1]; if (p[1] <= yc) pts.push(p); else if (q[1] <= yc) { const t = (p[1] - yc) / (p[1] - q[1]); pts.push([p[0] + t * (q[0] - p[0]), yc]); } }
            pts.push(full[full.length - 1]);
          }
          walls = { pts, a, Xin: pts[0][0], L: pts[0][1] };
          const cv = [], aMax = Math.min(65, Math.max(30, 2.4 * V.th));
          for (let g = 0; g <= 40; g++) {
            const A = aMax * g / 40 * D2R; let ok = 0; const N = 61;
            for (let i = 0; i < N; i++) { const x0 = -walls.Xin + 2 * walls.Xin * (i + 0.5) / N; if (cpcTrace(pts, x0, walls.L, Math.sin(A), -Math.cos(A), a).ok) ok++; }
            cv.push([aMax * g / 40, ok / N]);
          }
          curve = cv; key = k;
        }
        const { pts, a, Xin, L } = walls;
        const s = Math.min((W * 0.62) / (2 * Xin * 1.2), (Hh - 70) / (L * 1.25)), ox = W * 0.5, oy = Hh - 38;
        const X = x => ox + x * s, Y = y => oy - y * s;
        // the walls
        for (const sg of [1, -1]) { c.strokeStyle = S.metal(); c.lineWidth = 2.4; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(X(sg * p[0]), Y(p[1])) : c.moveTo(X(sg * p[0]), Y(p[1]))); c.stroke(); }
        c.strokeStyle = C.ok; c.lineWidth = 5; c.beginPath(); c.moveTo(X(-a), Y(0)); c.lineTo(X(a), Y(0)); c.stroke();
        kit.label(c, 'receiver (exit, width 2a)', X(0), Y(0) + 16, { align: 'center', color: C.ok, size: 11.5 });
        c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(X(-Xin), Y(L)); c.lineTo(X(Xin), Y(L)); c.stroke(); c.restore();
        kit.label(c, 'entrance (width ' + kit.fmt(2 * Xin / (2 * a), 3) + ' × the exit)', X(0), Y(L) - 40, { align: 'center', color: C.muted, size: 11.5 });
        // the rays
        const N = 11, ext = 0.22 * L;
        for (let i = 0; i < N; i++) {
          const x0 = -Xin + 2 * Xin * (i + 0.5) / N, dx = Math.sin(al), dy = -Math.cos(al), r = cpcTrace(pts, x0, L, dx, dy, a);
          const path = [[x0 - dx * ext, L - dy * ext]].concat(r.path);
          if (!r.ok) { const e = r.path[r.path.length - 1], pe = r.path[r.path.length - 2] || e, ddx = e[0] - pe[0], ddy = e[1] - pe[1], l = Math.hypot(ddx, ddy) || 1; path.push([e[0] + ddx / l * ext, e[1] + ddy / l * ext]); }
          S.ray(c, path.map(p => [X(p[0]), Y(p[1])]), { color: r.ok ? C.ok : C.bad, width: 1.3, alpha: r.ok ? 0.95 : 0.8, arrows: false });
        }
        kit.label(c, 'light arriving at α = ' + kit.fmt(V.al, 3) + '° from the axis', X(0), Y(L * 1.25) - 6, { align: 'center', color: C.text, size: 11.5 });
        // the curve
        let at = 0; { const N2 = 61; let ok = 0; for (let i = 0; i < N2; i++) { const x0 = -Xin + 2 * Xin * (i + 0.5) / N2; if (cpcTrace(pts, x0, L, Math.sin(al), -Math.cos(al), a).ok) ok++; } at = ok / N2; }
        plot.set({ series: [{ pts: curve, color: C.accent, label: 'fraction reaching the exit' }], vlines: [{ x: V.th, label: 'θ', color: C.faint }], marks: [{ x: V.al, y: at, label: 'now', color: C.warn }] });
        ro.set('C', kit.fmt(Xin / a, 3));
        ro.set('ideal', kit.fmt(1 / Math.sin(th), 3));
        ro.set('len', kit.fmt(L / (2 * Xin), 3));
        ro.set('acc', kit.fmt(100 * at, 3) + ' %');
        ro.set('sun', kit.fmt(1 / Math.sin(0.267 * D2R), 3));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a spatial filter */
  Hyper.sim('bs-pinhole', {
    title: 'A spatial filter: the pinhole at the focus',
    blurb: `A lens focuses the beam; a pinhole sits at the focus; a second lens makes the beam parallel again. The graph of the focal plane shows the clean core of the beam on the axis, and the ripple of the beam as two weak spots to either side, at x = λfν. The pinhole (dashed lines) lets through what lies inside it. The lower graph is the beam profile before and after (a one-dimensional model: the ripple left after the pinhole is an estimate).

**Try this**
- Press *Recommended pinhole*: 3 × the focal waist radius, which passes 98.9 % of the clean beam. The ripple goes, if it lands outside the hole.
- Make the hole much smaller: power falls, and the model says the clean beam itself is clipped. Much larger: the ripple gets through.
- Lower the ripple frequency to 1 cycle/mm: it lands inside the hole and nothing removes it. A spatial filter removes only fine detail.
- Raise the beam radius: the focal spot shrinks and so should the pinhole.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sh = O.shape, B = O.beam;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 200 });
      const p1 = kit.plot(box.stage, { x: { label: 'position in the focal plane (µm)', name: 'x' }, y: { label: 'intensity (log)', name: 'I', min: 1e-4, max: 1.5, log: true }, series: [] }, 150);
      const p2 = kit.plot(box.stage, { x: { label: 'position across the beam (mm)', name: 'x' }, y: { label: 'intensity', name: 'I', min: 0 }, series: [] }, 140);
      const ctl = kit.controls(box.side, [
        { id: 'w', label: 'Beam radius at the lens (1/e²)', min: 0.2, max: 5, step: 0.05, value: 0.4, unit: 'mm' },
        { id: 'f', label: 'Focal length of the lens', min: 4, max: 50, step: 1, value: 16, unit: 'mm' },
        { id: 'nm', type: 'select', label: 'Wavelength', options: [['405 nm', 405], ['532 nm', 532], ['633 nm', 633], ['1064 nm', 1064]], value: 633 },
        { id: 'Dp', label: 'Pinhole diameter', min: 3, max: 150, value: 25, unit: 'µm', log: true, sig: 3 },
        { id: 'm', label: 'Ripple depth on the beam', min: 0, max: 0.5, step: 0.01, value: 0.25 },
        { id: 'nu', label: 'Ripple spatial frequency', min: 0.5, max: 20, step: 0.1, value: 8, unit: 'cycles/mm' },
        { type: 'buttons', items: [{ id: 'rec', label: 'Recommended pinhole', primary: true }] }
      ], id => { if (id === 'rec') { const V2 = ctl.values; ctl.set('Dp', clamp(Sh.pinhole(V2.nm, V2.f * 1e-3, V2.w * 1e-3) * 1e6, 3, 150)); } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['w0', 'Focal spot radius w₀'], ['rec', 'Recommended pinhole (3 w₀)'], ['T', 'Clean beam passed'], ['xs', 'Ripple lands at'], ['rem', 'Ripple left after the pinhole (estimate)'], ['v', 'Verdict']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, nm = V.nm, w = V.w * 1e-3, f = V.f * 1e-3, a = V.Dp * 0.5e-6;
        const w0 = B.focus({ w, f, nm }).w0, xs = nm * 1e-9 * f * V.nu * 1e3, m = V.m;
        const Tcore = B.throughAperture(a, w0);
        // the fraction of the ripple's spot that falls inside the hole (numerical, 2-D)
        let sideIn = 0, tot = 0; const G = 36;
        for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) { const x = -a + 2 * a * (i + 0.5) / G, y = -a + 2 * a * (j + 0.5) / G; if (x * x + y * y > a * a) continue; sideIn += Math.exp(-2 * ((x - xs) * (x - xs) + y * y) / (w0 * w0)); }
        const dA = Math.pow(2 * a / G, 2), Tside = sideIn * dA * 2 / (PI * w0 * w0);
        const rem = Tcore > 1e-9 ? Math.min(1.5, Math.sqrt(Tside / Tcore)) : 0;
        // the layout: beam with ripples, lens, pinhole, lens, clean beam
        const cy = Hh * 0.5, xa = 20, xl1 = W * 0.28, xp = W * 0.5, xl2 = W * 0.72, xb = W - 20, hb = Hh * 0.3;
        S.beam(c, xa, xl1, cy, x => hb * (1 + 0.1 * m * 4 * Math.sin((x - xa) * V.nu * 0.9)), { nm, alpha: 0.3 });
        S.lens(c, xl1, cy, hb * 1.1, { f: 1, bulge: 2.6 });
        S.beam(c, xl1 + 6, xp, cy, x => Math.max(0.6, hb * (xp - x) / (xp - xl1)), { nm, alpha: 0.35 });
        S.beam(c, xp, xl2, cy, x => Math.max(0.6, hb * (x - xp) / (xl2 - xp)), { nm, alpha: 0.35 });
        S.stop(c, xp, cy, hb * 0.9, clamp(hb * 0.9 * a / (4 * w0), 1.5, hb * 0.8));
        S.lens(c, xl2, cy, hb * 1.1, { f: 1, bulge: 2.6 });
        S.beam(c, xl2 + 12, xb, cy, hb * (0.55 + 0.45 * Math.min(1, Tcore)), { nm, alpha: 0.3 });
        kit.label(c, 'rippled beam', xa + 40, cy - hb * 1.3, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'pinhole at the focus', xp, cy + hb * 1.05 + 10, { align: 'center', color: C.text, size: 11.5 });
        kit.label(c, 'cleaner beam', xb - 40, cy - hb * 1.3, { align: 'center', color: C.muted, size: 11.5 });
        // the focal plane (log scale) and the profiles
        const span = 1.5 * Math.max(xs, a, 3 * w0), pts = [];
        for (let i = 0; i <= 240; i++) { const x = -span + 2 * span * i / 240; pts.push([x * 1e6, Math.max(1e-5, Math.exp(-2 * x * x / (w0 * w0)) + (m / 2) * (m / 2) * (Math.exp(-2 * (x - xs) * (x - xs) / (w0 * w0)) + Math.exp(-2 * (x + xs) * (x + xs) / (w0 * w0))))]); }
        p1.set({ series: [{ pts, color: C.accent, label: 'intensity in the focal plane' }], vlines: [{ x: -a * 1e6, label: '', color: C.warn }, { x: a * 1e6, label: 'pinhole', color: C.warn }] });
        const xr = Math.min(1.6 * V.w, 6 / V.nu), pin = [], pout = [];
        for (let i = 0; i <= 400; i++) { const x = -xr + 2 * xr * i / 400, g = Math.exp(-2 * x * x / (V.w * V.w)), ph = Math.cos(TAU * V.nu * x); pin.push([x, g * Math.pow(1 + m * ph, 2)]); pout.push([x, g * Math.pow(1 + m * rem * ph, 2) * Tcore]); }
        p2.set({ series: [{ pts: pin, color: C.muted, label: 'before the filter', dash: true }, { pts: pout, color: C.accent, label: 'after (scaled by the power passed)' }] });
        const rec = Sh.pinhole(nm, f, w) * 1e6;
        ro.set('w0', fmtL(kit, w0));
        ro.set('rec', kit.fmt(rec, 3) + ' µm  (yours: ' + kit.fmt(V.Dp, 3) + ' µm)');
        ro.set('T', kit.fmt(100 * Tcore, 3) + ' %');
        ro.set('xs', fmtL(kit, xs) + ' from the axis  (hole radius ' + kit.fmt(V.Dp / 2, 3) + ' µm)');
        ro.set('rem', m > 0 ? kit.fmt(100 * rem, 3) + ' % of the ripple depth' : 'no ripple set');
        ro.set('v', Tcore < 0.8 ? 'the pinhole clips the clean beam' : rem < 0.1 ? 'the ripple is removed' : rem < 0.5 ? 'part of the ripple gets through' : 'the ripple passes (inside the hole)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a metalens */
  Hyper.sim('bs-metalens', {
    title: 'A metalens and its colour',
    blurb: `A flat plate whose pillars set the phase of a lens for the design wavelength of 532 nm: φ(r) = −(2π/λ₀)(√(r²+f₀²) − f₀). The phase pattern does not change with colour, but the angle at which a given phase gradient bends light is proportional to the wavelength, so the focus moves. Each ray is bent by sin θ = (λ/λ₀)·r/√(r²+f₀²). The graph shows where each ray crosses the axis.

**Try this**
- At 532 nm every ray crosses the axis at the design focus: a perfect lens (the graph is a flat line).
- Blue light: the focus moves back, red light: it moves in. Read the percentage and compare it with the glass lens in the read-out (about 1 %).
- Tick *white light* to see the three colours at once. The rays of each colour also stop crossing at one point: the metalens at the wrong wavelength has spherical aberration.
- Change the pillar pitch: it limits the numerical aperture to λ/2p. The wider the lens, the finer the pillars it needs.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const plot = kit.plot(box.stage, { x: { label: 'height of the ray at the lens (mm)', name: 'r', min: 0 }, y: { label: 'where the ray crosses the axis (mm)', name: 'z', min: 0 }, series: [] }, 150);
      const L0 = 532;
      const ctl = kit.controls(box.side, [
        { id: 'nm', label: 'Wavelength used (design: 532 nm)', min: 400, max: 700, step: 1, value: params.nm || 450, unit: 'nm' },
        { id: 'white', type: 'check', label: 'White light: draw 450, 532 and 633 nm together', value: !!params.white },
        { id: 'D', label: 'Diameter of the lens', min: 0.5, max: 4, step: 0.1, value: 2, unit: 'mm' },
        { id: 'f0', label: 'Design focal length', min: 5, max: 30, step: 0.5, value: 10, unit: 'mm' },
        { id: 'pitch', label: 'Pitch of the pillars', min: 200, max: 600, step: 10, value: 300, unit: 'nm' },
        { type: 'buttons', items: [{ id: 'b', label: 'Blue 450' }, { id: 'g', label: 'Green 532 (design)' }, { id: 'r', label: 'Red 633' }] }
      ], id => { if (id === 'b') ctl.set('nm', 450); else if (id === 'g') ctl.set('nm', 532); else if (id === 'r') ctl.set('nm', 633); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['zones', 'Phase zones (2π) across the lens'], ['na', 'Numerical aperture of the lens'], ['nam', 'Largest NA the pillar pitch allows'], ['fm', 'Metalens focus at this wavelength'], ['fg', 'Glass lens (N-BK7), same f₀: focus']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, R = V.D / 2, f0 = V.f0, nmc = V.nm;
        const zEnd = 1.7 * f0, m = S.map(st, -0.18 * f0, zEnd, R * 1.25, { left: 20, right: 20, top: 20, bottom: 30, stretch: 5 });
        S.axis(c, m.X(-0.18 * f0), m.y0, m.X(zEnd));
        // the plate with its pillars
        c.fillStyle = S.glass(0.4); c.fillRect(m.X(-0.05 * f0), m.Y(R * 1.1), m.X(0.0) - m.X(-0.05 * f0), m.Y(-R * 1.1) - m.Y(R * 1.1));
        c.strokeStyle = S.edge(); c.lineWidth = 1; for (let k = -12; k <= 12; k++) { const y = m.Y(R * 1.1 * k / 12); c.beginPath(); c.moveTo(m.X(0), y); c.lineTo(m.X(0) + 5, y); c.stroke(); }
        kit.label(c, 'metalens', m.X(0), m.Y(R * 1.1) - 10, { align: 'center', color: C.muted, size: 11.5 });
        const colours = V.white ? [450, 532, 633] : [nmc], zc = (r, nm) => { const s = (nm / L0) * r / Math.hypot(r, f0); return Math.abs(s) < 1 && s > 0 ? r * Math.sqrt(1 - s * s) / s : NaN; };
        for (const nm of colours) {
          for (let k = -8; k <= 8; k++) {
            const r = R * k / 8; if (k === 0) { S.ray(c, [[m.X(-0.18 * f0), m.Y(0)], [m.X(zEnd), m.Y(0)]], { nm, width: 1, alpha: 0.5, arrows: false }); continue; }
            const s = (nm / L0) * Math.abs(r) / Math.hypot(r, f0); if (s >= 1) continue;
            const tn = s / Math.sqrt(1 - s * s), sg = Math.sign(r);
            S.ray(c, [[m.X(-0.18 * f0), m.Y(r)], [m.X(0), m.Y(r)], [m.X(zEnd), m.Y(r - sg * zEnd * tn)]], { nm, width: 1.1, alpha: V.white ? 0.55 : 0.85, arrows: false });
          }
        }
        c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(m.X(f0), m.Y(R * 1.2)); c.lineTo(m.X(f0), m.Y(-R * 1.2)); c.stroke(); c.restore();
        kit.label(c, 'design focus f₀', m.X(f0), m.Y(-R * 1.2) + 12, { align: 'center', color: C.faint, size: 11 });
        kit.label(c, 'heights drawn ' + kit.fmt(m.stretch, 2) + ' × larger than lengths', 20, Hh - 10, { align: 'left', color: C.faint, size: 10.5 });
        const series = [], hl = [];
        for (const nm of colours) { const pts = []; for (let i = 1; i <= 40; i++) { const r = R * i / 40, z = zc(r, nm); if (Number.isFinite(z)) pts.push([r, z]); } if (pts.length) series.push({ pts, color: S.nm(nm), label: nm + ' nm' }); }
        series.push({ pts: [[0.0001, f0], [R, f0]], color: C.faint, label: 'design focus', dash: true });
        plot.set({ series, y: { label: 'where the ray crosses the axis (mm)', name: 'z', min: 0.6 * f0, max: 1.5 * f0 } });
        const nbk0 = O.index('N-BK7', L0), nbk = O.index('N-BK7', nmc), fm = f0 * L0 / nmc, fg = f0 * (nbk0 - 1) / (nbk - 1);
        const zones = (Math.sqrt(R * R + f0 * f0) - f0) / (L0 * 1e-6), na = R / Math.hypot(R, f0), nam = L0 / (2 * V.pitch);
        ro.set('zones', kit.fmt(zones, 3));
        ro.set('na', kit.fmt(na, 3));
        ro.set('nam', nam >= 1 ? 'more than 1: no limit in air' : kit.fmt(nam, 3) + (na > nam ? '  (too coarse for this lens!)' : '  (enough)'));
        ro.set('fm', kit.fmt(fm, 4) + ' mm  (' + (fm > f0 ? '+' : '') + kit.fmt((fm / f0 - 1) * 100, 3) + ' %)');
        ro.set('fg', kit.fmt(fg, 4) + ' mm  (' + (fg > f0 ? '+' : '') + kit.fmt((fg / f0 - 1) * 100, 3) + ' %)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
