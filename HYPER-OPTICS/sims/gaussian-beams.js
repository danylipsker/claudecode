/* HYPER-OPTICS · sims/gaussian-beams.js — the simulations of the topic "Gaussian beams" (prefix gb-).
 *   gb-profile   the bell-curve profile, 1/e² radius, FWHM, the power inside an aperture
 *   gb-caustic   waist, divergence and Rayleigh range (two views: the far-field cone; the near field with wavefronts)
 *   gb-quality   a real beam of beam quality M² against the ideal Gaussian beam
 *   gb-focus     a collimated beam focused by a lens: spot, depth of focus, lens fill
 *   gb-diode     a laser diode behind a collimator: fast and slow axes, prisms, the focus tolerance
 *   gb-expander  Keplerian and Galilean beam expanders and the long-throw crossover
 *   gb-lens      a waist through one or two lenses: Self's formulas against the lens equation
 *   gb-modes     Hermite–Gaussian, Laguerre–Gaussian and multimode patterns, with their phase
 *   gb-measure   a knife edge across a beam; M² from a caustic of ten planes
 * Every number comes from kit.optics (O.beam: rayleigh, w, divergence, focus, lens, train, throughAperture, peakIrradiance);
 * the drawing from kit.osym. Pictures that do not move redraw only on a change (loop.once()).
 */
(function () {
  'use strict';
  const PI = Math.PI, D2R = PI / 180, R2D = 180 / PI;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const sig = (v, n) => {
    n = n || 3;
    if (!Number.isFinite(v)) return '—';
    if (v === 0) return '0';
    const s = Number(v).toPrecision(n);
    return s.indexOf('e') >= 0 ? String(Number(s)) : s;
  };
  const lenStr = m => {
    const a = Math.abs(m);
    if (!Number.isFinite(m)) return '—';
    if (a >= 1e3) return sig(m / 1e3) + ' km';
    if (a >= 1) return sig(m) + ' m';
    if (a >= 1e-3) return sig(m * 1e3) + ' mm';
    if (a >= 1e-6) return sig(m * 1e6) + ' µm';
    return sig(m * 1e9) + ' nm';
  };
  const angStr = rad => Math.abs(rad) >= 0.1 ? sig(rad * R2D) + '°' : sig(rad * 1e3) + ' mrad';
  const irrStr = wm2 => { const w = wm2 / 1e4; return w >= 1e3 ? sig(w / 1e3) + ' kW/cm²' : w >= 0.01 ? sig(w) + ' W/cm²' : sig(w * 1e3) + ' mW/cm²'; };
  const vis = nm => clamp(nm, 405, 700);              // invisible wavelengths are drawn in a visible false colour
  const LAMBDAS = [['405 nm (violet diode)', 405], ['532 nm (green)', 532], ['632.8 nm (helium–neon, red)', 632.8], ['1064 nm (Nd:YAG, infrared)', 1064], ['1550 nm (telecom, infrared)', 1550], ['10.6 µm (CO₂, far infrared)', 10600]];
  const logSteps = (a, b, n) => { const out = []; for (let i = 0; i <= n; i++) out.push(a * Math.pow(b / a, i / n)); return out; };
  // a dashed polyline through canvas points
  const polyline = (c, pts, color, width, dash) => {
    c.save(); c.strokeStyle = color; c.lineWidth = width || 1.2; if (dash) c.setLineDash(dash);
    c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore();
  };
  // the two edges of a beam given its half-width function (canvas px) between x1 and x2
  const edges = (c, x1, x2, cy, hw, color, width, dash) => {
    const n = 90, up = [], dn = [];
    for (let i = 0; i <= n; i++) { const x = x1 + (x2 - x1) * i / n, h = hw(x); up.push([x, cy - h]); dn.push([x, cy + h]); }
    polyline(c, up, color, width, dash); polyline(c, dn, color, width, dash);
  };

  /* ================================================================ the profile */
  Hyper.sim('gb-profile', {
    title: 'The Gaussian profile: a spot with no edge',
    blurb: `A round Gaussian beam, drawn across ±3 beam radii. The dashed circle is the **1/e² radius** $w$, the dotted one the half-intensity radius (the FWHM is 1.18 w), and the solid circle is a round aperture that you can drag. The curve on the right shades the part of the beam that gets through.

**Try this**
- Drag the aperture to $a = w$: it passes **86.5 %** of the power, and 13.5 % is lost although the circle looks as if it holds everything.
- Widen it to 1.5 w (98.9 %) and 2 w (99.97 %): the wings are faint but they are there. Tick *Brighten the faint wings* to see how far the tail really reaches.
- Change the power or the radius and read the peak irradiance, which is **2P/(πw²)**: twice the power divided by the area of the 1/e² circle.
- Find the aperture that passes exactly half of the power: it is smaller than w (0.59 w).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, B = O.beam;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Beam power', min: 0.1, max: 1000, value: params.P || 5, log: true, sig: 2, unit: 'mW' },
        { id: 'w', label: 'Beam radius w (1/e²)', min: 0.05, max: 5, value: params.w || 0.4, log: true, sig: 2, unit: 'mm' },
        { id: 'a', label: 'Aperture radius a', min: 0.2, max: 3, step: 0.01, value: params.a || 1, fmt: v => 'a = ' + sig(v, 3) + ' w' },
        { id: 'nm', type: 'select', label: 'Colour of the beam', options: [['Red, 632.8 nm', 632.8], ['Green, 532 nm', 532], ['Blue, 450 nm', 450]], value: 632.8 },
        { id: 'gamma', type: 'check', label: 'Brighten the faint wings', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['I0', 'Peak irradiance 2P/(πw²)'], ['Ip', 'Power ÷ area of the 1/e² circle'], ['D', '1/e² diameter · FWHM'], ['Pa', 'Power through the aperture'], ['Ie', 'Irradiance at the aperture edge']]);
      const plot = kit.plot(box.stage, { x: { label: 'radius r / w', min: 0, max: 3 }, y: { label: 'fraction', min: 0, max: 1.03 }, series: [] }, 180);
      const geo = () => { const size = Math.min(st.H - 30, st.W * 0.42); return { size, x: 20, y: (st.H - size) / 2, px: size / 6 }; };
      kit.drag(st, {
        hover: true,
        hit: p => { const g = geo(), r = Math.hypot(p.x - (g.x + g.size / 2), p.y - (g.y + g.size / 2)); return Math.abs(r - V.a * g.px) < 12 ? 'a' : null; },
        move: (what, p) => { const g = geo(), r = Math.hypot(p.x - (g.x + g.size / 2), p.y - (g.y + g.size / 2)) / g.px; ctl.set('a', clamp(Math.round(r * 100) / 100, 0.2, 3)); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, g = geo(), cx = g.x + g.size / 2, cy = g.y + g.size / 2, a = V.a;
        S.image(c, g.x, g.y, g.size, g.size, 96, 96, (u, v) => { const x = (u - 0.5) * 6, y = (v - 0.5) * 6; return Math.exp(-2 * (x * x + y * y)); }, { nm: V.nm, gamma: V.gamma ? 0.4 : 1, key: 'prof|' + V.nm + '|' + V.gamma, id: 'prof' });
        const ring = (r, color, width, dash) => { c.save(); c.strokeStyle = color; c.lineWidth = width; if (dash) c.setLineDash(dash); c.beginPath(); c.arc(cx, cy, r, 0, 2 * PI); c.stroke(); c.restore(); };
        ring(g.px, 'rgba(255,255,255,0.9)', 1.4, [6, 4]);
        ring(g.px * 0.5887, 'rgba(255,255,255,0.7)', 1.2, [2, 3]);
        ring(g.px * a, C.accent, 2.4);
        kit.label(c, 'w', cx + g.px * 0.72 + 6, cy - g.px * 0.72 - 4, { color: '#fff', size: 12 });
        kit.label(c, 'a', cx - g.px * a * 0.72 - 12, cy - g.px * a * 0.72 - 6, { color: C.accent, weight: 650 });
        kit.label(c, 'dashed: 1/e² radius w · dotted: half-intensity radius', g.x + g.size / 2, g.y + g.size + 13, { align: 'center', color: C.muted, size: 11 });
        // the profile across the diameter, the part inside the aperture shaded
        const px0 = g.x + g.size + 46, px1 = W - 24, base = cy + g.size * 0.30, hgt = g.size * 0.56, ux = u => (px0 + px1) / 2 + u * (px1 - px0) / 6;
        const curve = u => base - hgt * Math.exp(-2 * u * u);
        c.save(); c.fillStyle = C.accent; c.globalAlpha = 0.5; c.beginPath(); c.moveTo(ux(-a), base);
        for (let i = 0; i <= 60; i++) { const u = -a + 2 * a * i / 60; c.lineTo(ux(u), curve(u)); }
        c.lineTo(ux(a), base); c.closePath(); c.fill(); c.restore();
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath();
        for (let i = 0; i <= 120; i++) { const u = -3 + 6 * i / 120; i ? c.lineTo(ux(u), curve(u)) : c.moveTo(ux(u), curve(u)); }
        c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(px0, base); c.lineTo(px1, base); c.stroke(); c.restore();
        for (const u of [-2, -1, 0, 1, 2]) kit.label(c, u === 0 ? '0' : (u < 0 ? '−' : '') + Math.abs(u) + (Math.abs(u) === 1 ? ' w' : ' w'), ux(u), base + 12, { align: 'center', color: C.muted, size: 11 });
        // 1/e² points and the FWHM bracket
        const e2 = curve(1);
        polyline(c, [[ux(-1), base], [ux(-1), e2]], C.faint, 1, [3, 3]); polyline(c, [[ux(1), base], [ux(1), e2]], C.faint, 1, [3, 3]);
        kit.label(c, '13.5 %', ux(1) + 6, e2 - 5, { color: C.muted, size: 11 });
        const half = curve(0.5887); S.dim(c, ux(-0.5887), half - 10, ux(0.5887), half - 10, 'FWHM 1.18 w', { off: -9, size: 11 });
        kit.label(c, 'irradiance along a line through the centre', (px0 + px1) / 2, cy - g.size * 0.46, { align: 'center', color: C.muted, size: 11.5 });
        // numbers
        const Pw = V.P * 1e-3, w = V.w * 1e-3, I0 = B.peakIrradiance(Pw, w), frac = B.throughAperture(a, 1);
        ro.set('I0', irrStr(I0));
        ro.set('Ip', irrStr(Pw / (PI * w * w)));
        ro.set('D', sig(2 * V.w, 3) + ' mm · ' + sig(1.1774 * V.w, 3) + ' mm');
        ro.set('Pa', sig(100 * frac, 4) + ' %  ·  ' + sig(Pw * frac * 1e3, 3) + ' mW  (a = ' + sig(a * V.w, 3) + ' mm)');
        ro.set('Ie', sig(100 * Math.exp(-2 * a * a), 3) + ' % of the peak');
        const pts1 = [], pts2 = [];
        for (let i = 0; i <= 100; i++) { const r = 3 * i / 100; pts1.push([r, Math.exp(-2 * r * r)]); pts2.push([r, 1 - Math.exp(-2 * r * r)]); }
        plot.set({ series: [{ pts: pts1, label: 'irradiance I / I₀', color: C.series[0] }, { pts: pts2, label: 'power inside radius r', color: C.series[1] }], vlines: [{ x: a, label: 'aperture' }], marks: [{ x: 1, y: Math.exp(-2), label: '13.5 %' }, { x: 1, y: 1 - Math.exp(-2), label: '86.5 %' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the caustic: waist, divergence, Rayleigh range */
  Hyper.sim('gb-caustic', {
    title: 'The caustic of a Gaussian beam: waist, divergence, Rayleigh range',
    blurb: `The outline of a Gaussian beam is a hyperbola. In the **divergence** view the beam runs from its waist to a screen and the far-field cone is drawn dashed; two other beams (a waist 3.2 times smaller and 3.2 times larger) are drawn for comparison. In the **Rayleigh-range** view you see the near field, the wavefronts and the probe you can drag. The radial scale is exaggerated (the factor is printed) because real beams are very thin, and the wavefronts are drawn for the beam as drawn.

**Try this**
- Divergence view: shrink the waist and watch the cone open, w₀θ = λ/π staying fixed. A smaller waist wins near the waist and loses on the screen.
- Raise the screen distance: far beyond z_R the radius grows in proportion to distance, w ≈ θz.
- Rayleigh view: put the probe at z = 1 z_R: the radius is √2 w₀, the axial irradiance is one half, and the wavefront is at its most curved.
- Switch to 10.6 µm: the same waist gives a Rayleigh range seventeen times shorter than for the helium–neon line.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, B = O.beam;
      const view = params.view === 'divergence' ? 'divergence' : 'rayleigh';
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 270 });
      const defs = [
        { id: 'w0', label: 'Waist radius w₀', min: 0.01, max: 5, value: params.w0 || (view === 'divergence' ? 0.3 : 0.24), log: true, sig: 2, unit: 'mm' },
        { id: 'nm', type: 'select', label: 'Wavelength', options: LAMBDAS, value: params.nm || 632.8 },
        { id: 'M2', label: 'Beam quality M²', min: 1, max: 10, value: params.M2 || 1, log: true, sig: 2, fmt: v => 'M² = ' + sig(v, 2) }
      ];
      if (view === 'divergence') defs.push({ id: 'L', label: 'Distance to the screen', min: 0.1, max: 1000, value: params.L || 20, log: true, sig: 2, unit: 'm' });
      else defs.push({ id: 'zp', label: 'Probe position z', min: -4, max: 4, step: 0.05, value: params.zp != null ? params.zp : 1, fmt: v => sig(v, 3) + ' z_R' });
      const ctl = kit.controls(box.side, defs, () => loop.once());
      const V = ctl.values;
      const rows = view === 'divergence'
        ? [['th', 'Half-angle θ · full angle 2θ'], ['zR', 'Rayleigh range z_R'], ['wL', 'Radius at the screen'], ['bpp', 'w₀θ  (beam parameter product)'], ['cmp', 'Radius at the screen, smaller · larger waist']]
        : [['zR', 'Rayleigh range z_R · depth of focus 2z_R'], ['th', 'Far-field half-angle θ'], ['w', 'Radius at the probe'], ['I', 'Axial irradiance at the probe'], ['R', 'Wavefront radius of curvature'], ['g', 'Gouy phase']];
      const ro = kit.readout(box.side, rows);
      const plot = kit.plot(box.stage, view === 'divergence'
        ? { x: { label: 'waist radius w₀ (mm)', log: true }, y: { label: 'half-angle θ (mrad)', log: true }, series: [] }
        : { x: { label: 'distance from the waist z / z_R', min: -4, max: 4 }, y: { label: 'relative value', min: -1.05, max: 1.05 }, series: [] }, 180);
      if (view === 'rayleigh') {
        kit.drag(st, {
          hover: true,
          hit: p => Math.abs(p.x - probeX()) < 12 ? 'probe' : null,
          move: (what, p) => { ctl.set('zp', clamp(Math.round((p.x - st.W / 2) / ((st.W - 90) / 7) * 20) / 20, -4, 4)); loop.once(); }
        });
      }
      const probeX = () => st.W / 2 + V.zp * (st.W - 90) / 7;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cy = Hh * (view === 'divergence' ? 0.46 : 0.44), nm = V.nm, M2 = V.M2, w0 = V.w0 * 1e-3;
        const col = vis(nm), th = B.divergence(w0, nm, M2), zR = B.rayleigh(w0, nm, M2);
        if (view === 'divergence') {
          const xL = 50, xR = W - 70, L = V.L, sa = (xR - xL) / L, wa = [w0 / Math.sqrt(10), w0, w0 * Math.sqrt(10)];
          const wmax = Math.max(B.w(L, wa[0], nm, M2), B.w(L, wa[1], nm, M2), B.w(L, wa[2], nm, M2)), k = 0.42 * Hh / wmax;
          const zOf = x => (x - xL) / sa;
          S.axis(c, xL - 14, cy, xR);
          edges(c, xL, xR, cy, x => k * B.w(zOf(x), wa[0], nm, M2), C.muted, 1.2, [6, 4]);
          edges(c, xL, xR, cy, x => k * B.w(zOf(x), wa[2], nm, M2), C.muted, 1.2, [2, 4]);
          S.beam(c, xL, xR, cy, x => k * B.w(zOf(x), w0, nm, M2), { nm: col, alpha: 0.38 });
          polyline(c, [[xL, cy], [xR, cy - k * th * L]], C.warn, 1.1, [5, 4]); polyline(c, [[xL, cy], [xR, cy + k * th * L]], C.warn, 1.1, [5, 4]);
          S.screen(c, xR, cy, 0.45 * Hh, { label: 'screen' });
          const wl = B.w(L, w0, nm, M2);
          S.dim(c, xR + 14, cy - k * wl, xR + 14, cy, 'w', { off: 10, size: 12 });
          kit.label(c, 'dashed: waist ÷ 3.2  ·  dotted: waist × 3.2  ·  amber: far-field cone', 14, 16, { color: C.muted, size: 11.5 });
          kit.label(c, 'waist', xL, cy + k * w0 + 15, { color: C.muted, size: 11.5, align: 'center' });
          kit.label(c, 'radial scale exaggerated ×' + sig(k / sa, 3) + (nm > 700 || nm < 400 ? '  ·  invisible light, drawn in false colour' : ''), 14, Hh - 12, { color: C.faint, size: 11 });
          ro.set('th', angStr(th) + '  ·  ' + angStr(2 * th));
          ro.set('zR', lenStr(zR));
          ro.set('wL', lenStr(wl));
          ro.set('bpp', sig(w0 * th * 1e6, 3) + ' mm·mrad  (M²λ/π = ' + sig(M2 * nm * 1e-9 / PI * 1e6, 3) + ')');
          ro.set('cmp', lenStr(B.w(L, wa[0], nm, M2)) + '  ·  ' + lenStr(B.w(L, wa[2], nm, M2)));
          const p1 = [], p2 = [];
          for (const x of logSteps(0.005, 10, 60)) { p1.push([x, B.divergence(x * 1e-3, nm, 1) * 1e3]); p2.push([x, B.divergence(x * 1e-3, nm, M2) * 1e3]); }
          const series = [{ pts: p1, label: 'ideal beam, M² = 1', color: C.series[0] }];
          if (M2 > 1.01) series.push({ pts: p2, label: 'this beam, M² = ' + sig(M2, 2), color: C.series[1] });
          plot.set({ series, marks: [{ x: V.w0, y: th * 1e3, label: 'θ = ' + sig(th * 1e3, 3) + ' mrad' }], x: { label: 'waist radius w₀ (mm)', log: true, min: 0.005, max: 10 }, y: { label: 'half-angle θ (mrad)', log: true } });
        } else {
          const unit = (W - 90) / 7, zpx = z => W / 2 + z / zR * unit, rad = z => B.w(z, w0, nm, M2);
          const wmax = rad(3.5 * zR), k = 0.40 * Hh / wmax, kx = unit / zR;       // px per metre, radial and axial
          const zOf = x => (x - W / 2) / unit * zR;
          S.axis(c, 30, cy, W - 30);
          for (const j of [-2, -1, 1, 2]) { polyline(c, [[zpx(j * zR), cy - 0.40 * Hh], [zpx(j * zR), cy + 0.40 * Hh]], C.grid, 1, [3, 4]); kit.label(c, (j > 0 ? '+' : '−') + (Math.abs(j) === 1 ? '' : '2 ') + 'z_R  ' + lenStr(Math.abs(j) * zR), zpx(j * zR), cy + 0.40 * Hh + 12, { align: 'center', color: C.muted, size: 11 }); }
          S.beam(c, 40, W - 40, cy, x => k * rad(zOf(x)), { nm: col, alpha: 0.28 });
          polyline(c, [[40, cy + k * th * zOf(40)], [W - 40, cy - k * th * zOf(W - 40)]], C.warn, 1, [5, 4]); polyline(c, [[40, cy - k * th * zOf(40)], [W - 40, cy + k * th * zOf(W - 40)]], C.warn, 1, [5, 4]);
          // wavefronts at whole multiples of z_R, drawn for the beam as it is drawn (the stretched picture has its own
          // radius of curvature, R = z (1 + z_R²/z²) measured in the drawn pixels): the edges lag after the waist and lead before it
          for (let j = -3; j <= 3; j++) {
            const z = j * zR, wz = rad(z), Rpx = j === 0 ? Infinity : unit * (j + 1 / j), pts = [];
            for (let i = -12; i <= 12; i++) { const yp = k * wz * i / 12 * 0.98; pts.push([zpx(z) - (Number.isFinite(Rpx) ? yp * yp / (2 * Rpx) : 0), cy - yp]); }
            polyline(c, pts, j === 0 ? C.text : C.faint, j === 0 ? 1.6 : 1);
          }
          for (const sgn of [-1, 1]) { const x = zpx(sgn * zR), y = cy - k * rad(zR); c.save(); c.fillStyle = C.warn; c.beginPath(); c.arc(x, y, 3.5, 0, 2 * PI); c.fill(); c.beginPath(); c.arc(x, 2 * cy - y, 3.5, 0, 2 * PI); c.fill(); c.restore(); }
          kit.label(c, '√2 w₀', zpx(zR) + 6, cy - k * rad(zR) - 8, { color: C.warn, size: 11.5 });
          S.dim(c, W / 2 - 8, cy - k * w0, W / 2 - 8, cy + k * w0, '2w₀', { off: -11, size: 11.5 });
          S.dim(c, zpx(-zR), cy - 0.36 * Hh, zpx(zR), cy - 0.36 * Hh, 'depth of focus 2z_R', { off: -9, size: 11.5 });
          // the probe
          const zp = V.zp * zR, pxp = zpx(zp), wp = rad(zp);
          polyline(c, [[pxp, cy - 0.40 * Hh], [pxp, cy + 0.40 * Hh]], C.accent, 1.6);
          c.save(); c.fillStyle = C.accent; c.beginPath(); c.arc(pxp, cy - k * wp, 4.5, 0, 2 * PI); c.fill(); c.beginPath(); c.arc(pxp, cy + k * wp, 4.5, 0, 2 * PI); c.fill(); c.restore();
          kit.label(c, 'wavefronts at −3 … +3 z_R  ·  radial scale ×' + sig(k / kx, 3) + (nm > 700 || nm < 400 ? '  ·  false colour' : ''), 14, Hh - 10, { color: C.muted, size: 11 });
          kit.label(c, 'drag the probe', pxp, cy + 0.40 * Hh + 27, { align: 'center', color: C.accent, size: 11 });
          ro.set('zR', lenStr(zR) + '  ·  ' + lenStr(2 * zR));
          ro.set('th', angStr(th));
          ro.set('w', lenStr(wp) + '  (' + sig(wp / w0, 3) + ' w₀)');
          ro.set('I', sig(100 * Math.pow(w0 / wp, 2), 3) + ' % of the waist value');
          ro.set('R', Math.abs(zp) < 1e-9 * zR ? 'flat at the waist' : lenStr(Math.abs(B.R(zp, w0, nm, M2))) + ' (= ' + sig(Math.abs(B.R(zp, w0, nm, M2)) / zR, 3) + ' z_R)');
          ro.set('g', sig(B.gouy(zp, w0, nm, M2) * R2D, 3) + '°  (total π across the waist)');
          const pi = [], pc = [];
          for (let i = 0; i <= 160; i++) { const u = -4 + 8 * i / 160; pi.push([u, 1 / (1 + u * u)]); pc.push([u, 2 * u / (1 + u * u)]); }
          plot.set({ series: [{ pts: pi, label: 'axial irradiance (w₀/w)²', color: C.series[0] }, { pts: pc, label: 'wavefront curvature 2z_R/R', color: C.series[1] }], vlines: [{ x: -1, label: '−z_R' }, { x: 1, label: 'z_R' }], marks: [{ x: V.zp, y: 1 / (1 + V.zp * V.zp), label: 'probe' }] });
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ M² */
  Hyper.sim('gb-quality', {
    title: 'M²: a real beam against the ideal Gaussian',
    blurb: `The filled beam is a real laser beam of beam quality M²; the dashed outline is the ideal Gaussian beam (M² = 1) it is compared with. You choose what is held equal: the **waist** (the real beam then spreads M² times faster) or the **divergence** (the real beam then needs a waist M² times larger).

**Try this**
- Press the **He–Ne** button (M² = 1.05): the two beams are nearly indistinguishable. Then press **Multimode fibre laser** (M² = 10): the same waist now opens ten times faster and the Rayleigh range falls to a tenth.
- Hold the *divergence* equal at M² = 10: the real beam is a hundred times larger in area at its waist than the ideal beam that spreads the same. Read the beam parameter products: M²λ/π against λ/π.
- Move the waist and watch the product w₀θ stay put: it is a property of the laser, not of where you look.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, B = O.beam;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 270 });
      const PRE = { p105: 1.05, p12: 1.2, p10: 10, p30: 30 };
      const ctl = kit.controls(box.side, [
        { id: 'w0', label: 'Waist radius of the real beam', min: 0.05, max: 2, value: params.w0 || 0.5, log: true, sig: 2, unit: 'mm' },
        { id: 'nm', type: 'select', label: 'Wavelength', options: LAMBDAS.slice(0, 5), value: params.nm || 632.8 },
        { id: 'M2', label: 'Beam quality M²', min: 1, max: 30, value: params.M2 || 4, log: true, sig: 3, fmt: v => 'M² = ' + sig(v, 3) },
        { id: 'cmp', type: 'select', label: 'Compare with the ideal beam of the same…', options: [['waist', 'waist'], ['divergence', 'div']], value: params.cmp || 'waist' },
        { type: 'buttons', items: [{ id: 'p105', label: 'He–Ne 1.05' }, { id: 'p12', label: 'Single-mode diode 1.2' }, { id: 'p10', label: 'Multimode fibre laser 10' }, { id: 'p30', label: 'Multimode 30' }] }
      ], id => { if (PRE[id]) ctl.set('M2', PRE[id]); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['re', 'Real beam: w₀ · θ · z_R'], ['id', 'Ideal beam: w₀ · θ · z_R'], ['bpp', 'w₀θ: real · ideal'], ['r10', 'Radius at 10 m: real · ideal']]);
      const plot = kit.plot(box.stage, { x: { label: 'distance from the waist z (m)' }, y: { label: 'beam radius w (mm)', min: 0 }, series: [] }, 180);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cy = Hh * 0.54, nm = V.nm, M2 = V.M2, w0 = V.w0 * 1e-3;
        const w0i = V.cmp === 'div' ? w0 / M2 : w0, zr = B.rayleigh(w0, nm, M2), zi = B.rayleigh(w0i, nm, 1), Z = 3 * Math.max(zr, zi);
        const wr = z => B.w(z, w0, nm, M2), wi = z => B.w(z, w0i, nm, 1), k = 0.36 * Hh / Math.max(wr(Z), wi(Z)), s = (W - 88) / (2 * Z), zOf = x => (x - W / 2) / s;
        S.axis(c, 30, cy, W - 30);
        S.beam(c, 44, W - 44, cy, x => k * wr(zOf(x)), { nm: vis(nm), alpha: 0.38 });
        edges(c, 44, W - 44, cy, x => k * wi(zOf(x)), C.text, 1.4, [6, 4]);
        kit.label(c, 'filled: the real beam, M² = ' + sig(M2, 3), 14, 16, { color: C.muted, size: 11.5 });
        kit.label(c, 'dashed: ideal Gaussian beam with the same ' + (V.cmp === 'div' ? 'divergence (waist ' + lenStr(w0i) + ')' : 'waist'), 14, 33, { color: C.muted, size: 11.5 });
        kit.label(c, 'radial scale exaggerated ×' + sig(k * Z / ((W - 88) / 2), 3), 14, Hh - 12, { color: C.faint, size: 11 });
        const thr = B.divergence(w0, nm, M2), thi = B.divergence(w0i, nm, 1);
        ro.set('re', lenStr(w0) + ' · ' + angStr(thr) + ' · ' + lenStr(zr));
        ro.set('id', lenStr(w0i) + ' · ' + angStr(thi) + ' · ' + lenStr(zi));
        ro.set('bpp', sig(w0 * thr * 1e6, 3) + ' · ' + sig(w0i * thi * 1e6, 3) + ' mm·mrad');
        ro.set('r10', lenStr(wr(10)) + ' · ' + lenStr(wi(10)));
        const pr = [], pi = [], u = Z < 0.05 ? 1e3 : 1;
        for (let i = 0; i <= 120; i++) { const z = -Z + 2 * Z * i / 120; pr.push([z * u, wr(z) * 1e3]); pi.push([z * u, wi(z) * 1e3]); }
        plot.set({ series: [{ pts: pr, label: 'real beam', color: C.series[0] }, { pts: pi, label: 'ideal beam', color: C.series[1], dash: true }], x: { label: 'distance from the waist z (' + (u === 1 ? 'm' : 'mm') + ')', min: -Z * u, max: Z * u }, y: { label: 'beam radius w (mm)', min: 0 } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ focusing */
  Hyper.sim('gb-focus', {
    title: 'Focusing a laser beam: the spot, and how long it lasts',
    blurb: `A collimated laser beam of radius w meets a lens of focal length f and clear radius a. The overview is schematic (the focus is far smaller than the beam); the box on the right is the focus magnified, the hyperbola of the beam over ±3 Rayleigh ranges. The graph shows how the spot and the depth of focus depend on the beam radius at the lens.

**Try this**
- Double the beam radius w: the spot **halves** but the depth of focus falls to **a quarter** (2z_R ∝ w₀²). Look at both curves in the graph.
- Shorten the focal length by half: same effect as doubling the beam. Only the ratio f/w matters.
- Set M² = 5: from the same lens the spot is 5 times larger and, oddly, the depth of focus 5 times longer.
- Make the clear radius a smaller than w: the lens clips the beam, power is lost, and the readout warns that the Gaussian formula no longer holds.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, B = O.beam;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'nm', type: 'select', label: 'Wavelength', options: LAMBDAS.slice(0, 5), value: params.nm || 1064 },
        { id: 'w', label: 'Beam radius at the lens, w', min: 0.2, max: 10, value: params.w || 2, log: true, sig: 2, unit: 'mm' },
        { id: 'f', label: 'Focal length of the lens, f', min: 10, max: 500, value: params.f || 100, log: true, sig: 3, unit: 'mm' },
        { id: 'M2', label: 'Beam quality M²', min: 1, max: 20, value: params.M2 || 1, log: true, sig: 2, fmt: v => 'M² = ' + sig(v, 2) },
        { id: 'a', label: 'Clear radius of the lens, a', min: 0.5, max: 25, value: params.a || 4, log: true, sig: 2, unit: 'mm' },
        { id: 'P', label: 'Beam power', min: 0.001, max: 100, value: params.P || 1, log: true, sig: 2, unit: 'W' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['d', 'Spot diameter 2w₀ (1/e²)'], ['dof', 'Depth of focus 2z_R'], ['N', 'Focal ratio N = f/(2w)'], ['fill', 'Lens fill a/w · power passed'], ['I', 'Peak irradiance at the focus'], ['ok', 'The formula']]);
      const plot = kit.plot(box.stage, { x: { label: 'beam radius at the lens, w (mm)', log: true }, y: { label: 'micrometres', log: true }, series: [] }, 180);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cy = Hh * 0.5, nm = V.nm, w = V.w * 1e-3, f = V.f * 1e-3, M2 = V.M2;
        const F = B.focus({ w, f, nm, M2 }), pass = B.throughAperture(V.a, V.w), th = Math.atan(w / f);
        // overview: laser, collimated beam, lens with its clear aperture, the cone to the focus
        const rb = 0.17 * Hh, xl = W * 0.30, xs = 22, xf = W * 0.55, hl = clamp(rb * V.a / V.w, 0.4 * rb, 0.40 * Hh), re = Math.min(rb, hl);
        S.axis(c, xs, cy, W * 0.62);
        S.source(c, xs + 26, cy, { kind: 'laser', size: 11, color: S.nm(vis(nm)) });
        S.beam(c, xs + 26, xl, cy, rb, { nm: vis(nm), alpha: 0.34 });
        S.stop(c, xl, cy, 0.42 * Hh, hl);
        S.thinLens(c, xl, cy, hl, f, {});
        S.beam(c, xl, xf, cy, x => Math.max(1.2, re * (xf - x) / (xf - xl)), { nm: vis(nm), alpha: 0.4 });
        S.beam(c, xf, xf + (xf - xl) * 0.45, cy, x => Math.max(1.2, re * (x - xf) / (xf - xl)), { nm: vis(nm), alpha: 0.4 });
        S.dim(c, xl, cy + 0.34 * Hh, xf, cy + 0.34 * Hh, 'f = ' + sig(V.f, 3) + ' mm', { off: 12, size: 11.5 });
        kit.label(c, 'beam radius w = ' + sig(V.w, 2) + ' mm', xs + 30, cy - rb - 12, { color: C.muted, size: 11.5 });
        kit.label(c, V.a < V.w ? 'the lens clips the beam' : 'clear radius a = ' + sig(V.a, 2) + ' mm', xl, cy - 0.42 * Hh - 10, { align: 'center', color: V.a < V.w ? C.warn : C.muted, size: 11.5, weight: V.a < V.w ? 650 : 500 });
        kit.label(c, 'schematic: not to scale along the beam' + (nm > 700 || nm < 400 ? '  ·  false colour' : ''), 14, Hh - 12, { color: C.faint, size: 11 });
        c.save(); c.fillStyle = C.warn; c.beginPath(); c.arc(xf, cy, 3.5, 0, 2 * PI); c.fill(); c.restore();
        // the focus magnified
        const ix0 = W * 0.66, ix1 = W - 16, iy0 = cy - 0.30 * Hh, iy1 = cy + 0.30 * Hh, icx = (ix0 + ix1) / 2, ux = (ix1 - ix0 - 20) / 6;
        c.save(); c.fillStyle = C.surface; c.fillRect(ix0, iy0, ix1 - ix0, iy1 - iy0); c.strokeStyle = C.grid; c.strokeRect(ix0, iy0, ix1 - ix0, iy1 - iy0); c.restore();
        polyline(c, [[xf, cy], [ix0, iy0]], C.faint, 1, [3, 4]); polyline(c, [[xf, cy], [ix0, iy1]], C.faint, 1, [3, 4]);
        const k2 = 0.40 * (iy1 - iy0) / (F.w0 * Math.sqrt(10)), rz = z => B.w(z, F.w0, nm, M2);
        S.axis(c, ix0 + 4, cy, ix1 - 4);
        S.beam(c, ix0 + 10, ix1 - 10, cy, x => k2 * rz((x - icx) / ux * F.zR), { nm: vis(nm), alpha: 0.4 });
        for (const j of [-1, 1]) polyline(c, [[icx + j * ux, iy0 + 4], [icx + j * ux, iy1 - 4]], C.grid, 1, [3, 4]);
        S.dim(c, icx - ux, iy1 - 14, icx + ux, iy1 - 14, 'depth of focus ' + lenStr(2 * F.zR), { off: -8, size: 11 });
        S.dim(c, icx + 6, cy - k2 * F.w0, icx + 6, cy + k2 * F.w0, '', {});
        kit.label(c, '2w₀ = ' + lenStr(2 * F.w0), icx + 12, cy - k2 * F.w0 - 9, { color: C.text, size: 11.5, weight: 650 });
        kit.label(c, 'the focus magnified (±3 z_R)', icx, iy0 - 9, { align: 'center', color: C.muted, size: 11.5 });
        ro.set('d', lenStr(2 * F.w0) + '  (' + sig(2 * F.w0 / (nm * 1e-9 * (f / (2 * w))), 3) + ' λN)');
        ro.set('dof', lenStr(F.dof));
        ro.set('N', sig(f / (2 * w), 3) + '   (NA ' + sig(Math.sin(th), 2) + ')');
        ro.set('fill', sig(V.a / V.w, 3) + ' · ' + sig(100 * pass, 4) + ' %');
        ro.set('I', irrStr(B.peakIrradiance(V.P * pass, F.w0)) + '  (for ' + sig(V.P, 2) + ' W)');
        ro.set('ok', V.a >= 1.5 * V.w ? 'applies: the lens passes ' + sig(100 * pass, 3) + ' % of the beam' : 'approximate: the lens clips the beam (rings, a smaller and uneven spot)');
        const ps = [], pd = [];
        for (const x of logSteps(0.2, 10, 50)) { const g = B.focus({ w: x * 1e-3, f, nm, M2 }); ps.push([x, 2 * g.w0 * 1e6]); pd.push([x, g.dof * 1e6]); }
        plot.set({ series: [{ pts: ps, label: 'spot diameter 2w₀ (µm)', color: C.series[0] }, { pts: pd, label: 'depth of focus 2z_R (µm)', color: C.series[1] }], marks: [{ x: V.w, y: 2 * F.w0 * 1e6, label: 'spot' }, { x: V.w, y: F.dof * 1e6, label: 'depth' }], x: { label: 'beam radius at the lens, w (mm)', log: true, min: 0.2, max: 10 }, y: { label: 'micrometres', log: true } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a laser diode and its collimator */
  Hyper.sim('gb-diode', {
    title: 'Collimating a laser diode: two axes, two beams',
    blurb: `A diode emits from a stripe a micrometre or two across. Its beam leaves in the **fast axis** (perpendicular to the junction) at a wide angle and in the **slow axis** at a narrow one. The two panels are the two planes through the beam, drawn at the *same scale* in x and y; the ellipse is the beam's cross-section after the lens. Gaussian optics gives the numbers.

**Try this**
- The default is a 650 nm diode of 30° × 8° behind a 4.5 mm lens: a beam 2.0 mm × 0.53 mm in radius. Tick *Circularize*: the prism pair expands the slow axis by the ratio.
- Lengthen the focal length: the beam grows and the residual divergence (emitter size ÷ f) shrinks.
- Move the lens by only **2–10 µm**: the fast-axis beam is no longer collimated and the radius 10 m away grows several times. This is why modules are focused while the far-field beam is watched.
- Switch to 808 nm: the same angles give a slightly larger beam but the light is invisible; the picture is in false colour.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, B = O.beam;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'nm', type: 'select', label: 'Wavelength', options: [['405 nm (violet)', 405], ['520 nm (green)', 520], ['635 nm (red)', 635], ['650 nm (red)', 650], ['808 nm (infrared)', 808], ['940 nm (infrared)', 940]], value: params.nm || 650 },
        { id: 'fast', label: 'Fast-axis divergence (FWHM, full angle)', min: 15, max: 45, step: 0.5, value: params.fast || 30, unit: '°' },
        { id: 'slow', label: 'Slow-axis divergence (FWHM, full angle)', min: 4, max: 20, step: 0.5, value: params.slow || 8, unit: '°' },
        { id: 'f', label: 'Collimator focal length', min: 2, max: 12, step: 0.1, value: params.f || 4.5, unit: 'mm' },
        { id: 'dz', label: 'Lens moved away from the emitter by', min: -30, max: 30, step: 0.5, value: 0, fmt: v => (v > 0 ? '+' : '') + sig(v, 3) + ' µm' },
        { id: 'prism', type: 'check', label: 'Circularize with an anamorphic prism pair', value: !!params.prism }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['th', '1/e² half-angles, fast · slow'], ['we', 'Emitter waist radius, fast · slow'], ['sz', 'Beam after the lens, 1/e² diameters'], ['asp', 'Aspect ratio · prism pair needed'], ['res', 'Full divergence leaving the lens'], ['r10', 'Radius 10 m away, fast · slow'], ['wp', 'Waist forms behind the lens at']]);
      const FW = Math.sqrt(2 * Math.LN2);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, nm = V.nm, col = vis(nm);
        const thf = V.fast * D2R / FW, ths = V.slow * D2R / FW, w0f = nm * 1e-9 / (PI * thf), w0s = nm * 1e-9 / (PI * ths), f = V.f * 1e-3, s = f + V.dz * 1e-6;
        const lf = B.lens({ w0: w0f, s, f, nm }), ls = B.lens({ w0: w0s, s, f, nm });
        const zp = 0.009, zc = 0.020;                                                           // prisms 9 mm and cross-section 20 mm behind the lens
        const rF = z => B.w(z - lf.s, lf.w0, nm), rS0 = z => B.w(z - ls.s, ls.w0, nm);          // after the lens, z from the lens (m)
        const ratio = rF(zc) / rS0(zc), Mp = V.prism ? ratio : 1;
        // an anamorphic prism pair magnifies the slow axis by Mp: radii ×Mp, distances ×Mp², angles ÷Mp
        const rS = z => z < zp ? rS0(z) : B.w(z - (zp + (ls.s - zp) * Mp * Mp), ls.w0 * Mp, nm);
        const rLensF = B.w(s, w0f, nm), rLensS = B.w(s, w0s, nm), rexF = rF(zc), rexS = rS(zc);
        // true scale: the same pixels per millimetre along and across the beam
        const Lz = V.f + 30, rmax = Math.max(rLensF, rexF, rexS) * 1e3;
        const sc = Math.min(W * 0.66 / Lz, 0.20 * Hh / rmax), x0 = 28, xl = x0 + sc * V.f, xe = x0 + sc * Lz;
        const panel = (cy, w0, thetaR, rLens, rAfter, prism, label) => {
          S.axis(c, x0 - 10, cy, xe + 6);
          S.beam(c, x0, xl, cy, x => sc * 1e3 * B.w((x - x0) / sc * 1e-3, w0, nm), { nm: col, alpha: 0.36 });
          const xp = xl + sc * 9, Mq = prism ? Mp : 1;
          S.beam(c, xl, xe, cy, x => sc * 1e3 * rAfter((x - xl) / sc * 1e-3), { nm: col, alpha: 0.4 });
          S.thinLens(c, xl, cy, Math.max(12, sc * 1e3 * rLens * 1.25), 1, {});
          S.source(c, x0, cy, { kind: 'point', size: 12 });
          if (prism && Mq > 1.02) { const hp = sc * 1e3 * rAfter((xp - xl) / sc * 1e-3 + 1e-4) * 1.2 + 6; S.block(c, xp - 5, cy - hp, 10, 2 * hp); kit.label(c, 'prism pair ×' + sig(Mq, 3), xp, cy - hp - 9, { align: 'center', color: C.accent, size: 11 }); }
          kit.label(c, label, 14, cy - 0.215 * Hh - 4, { color: C.muted, size: 11.5 });
          kit.label(c, 'emitter', x0, cy + 20, { align: 'center', color: C.faint, size: 10.5 });
        };
        panel(0.27 * Hh, w0f, thf, rLensF, rF, false, 'fast axis (perpendicular to the junction), FWHM ' + sig(V.fast, 3) + '°');
        panel(0.73 * Hh, w0s, ths, rLensS, rS, true, 'slow axis (parallel to the junction), FWHM ' + sig(V.slow, 3) + '°');
        kit.label(c, 'collimator f = ' + sig(V.f, 2) + ' mm', xl, 0.5 * Hh, { align: 'center', color: C.muted, size: 11 });
        // the cross-section after the lens (and the prisms)
        const ex = W - 0.15 * W - 6, ey = 0.5 * Hh, ax = Math.max(2, sc * 1e3 * rexS), ay = Math.max(2, sc * 1e3 * rexF);
        c.save(); c.fillStyle = S.nm(col, 0.45); c.strokeStyle = S.nm(col); c.lineWidth = 1.6; c.beginPath(); c.ellipse(ex, ey, ax, ay, 0, 0, 2 * PI); c.fill(); c.stroke(); c.restore();
        kit.label(c, 'cross-section', ex, ey - ay - 14, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, sig(2e3 * rexS, 3) + ' × ' + sig(2e3 * rexF, 3) + ' mm', ex, ey + ay + 13, { align: 'center', color: C.text, size: 11.5, weight: 650 });
        kit.label(c, 'true scale (same mm per pixel in both directions)' + (nm > 700 ? '  ·  invisible light, drawn in false colour' : ''), 14, Hh - 10, { color: C.faint, size: 11 });
        const brew = O.index('N-BK7', nm);
        ro.set('th', sig(thf * R2D, 3) + '° · ' + sig(ths * R2D, 3) + '°');
        ro.set('we', sig(w0f * 1e6, 3) + ' µm · ' + sig(w0s * 1e6, 3) + ' µm');
        ro.set('sz', sig(2e3 * rexF, 3) + ' × ' + sig(2e3 * rexS, 3) + ' mm' + (V.prism ? '  (after the prisms)' : ''));
        ro.set('asp', sig(ratio, 3) + ' : 1  ·  ×' + sig(Math.sqrt(ratio), 3) + ' per prism, Brewster pair gives ×' + sig(brew * brew, 3));
        ro.set('res', sig(2e3 * B.divergence(lf.w0, nm), 3) + ' · ' + sig(2e3 * B.divergence(ls.w0 * Mp, nm), 3) + ' mrad');
        ro.set('r10', lenStr(rF(10)) + ' · ' + lenStr(rS(10)));
        ro.set('wp', (lf.s > 0 ? lenStr(lf.s) : 'virtual, ' + lenStr(-lf.s) + ' in front') + ' · ' + (ls.s > 0 ? lenStr(ls.s) : 'virtual, ' + lenStr(-ls.s) + ' in front'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ beam expanders */
  Hyper.sim('gb-expander', {
    title: 'Beam expanders: Keplerian and Galilean',
    blurb: `A laser beam of waist radius w₀ goes through two lenses. The beam is drawn along the bench (the radial scale is exaggerated, the factor is printed); the graph shows the beam radius against distance, with and without the expander.

**Try this**
- Set the expansion to ×10: the beam is ten times wider and ten times less divergent. On the graph the expanded beam is wider near the lenses and **narrower beyond a few metres**; the readout gives the crossover distance.
- Switch between **Keplerian** (a real focus between the lenses) and **Galilean** (no focus, shorter): the beam leaving them is the same.
- Move the **lens spacing** by a fraction of a millimetre: the output goes from slightly convergent to slightly divergent, and the radius at the target distance changes. This is how expanders are focused.
- Raise the target distance: the benefit of a larger beam grows with the distance.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, B = O.beam;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Type', options: [['Keplerian (two positive lenses)', 'K'], ['Galilean (negative, then positive)', 'G']], value: params.kind || 'K' },
        { id: 'f1', label: 'Input lens, focal length |f₁|', min: 10, max: 60, step: 1, value: params.f1 || 20, unit: 'mm' },
        { id: 'M', label: 'Expansion ratio M = f₂/f₁', min: 1.5, max: 20, value: params.M || 10, log: true, sig: 2, fmt: v => '× ' + sig(v, 2) },
        { id: 'dz', label: 'Lens spacing error', min: -1, max: 1, step: 0.01, value: 0, fmt: v => (v > 0 ? '+' : '') + sig(v, 3) + ' mm' },
        { id: 'w0', label: 'Waist radius of the laser beam', min: 0.1, max: 2, value: params.w0 || 0.24, log: true, sig: 2, unit: 'mm' },
        { id: 'nm', type: 'select', label: 'Wavelength', options: LAMBDAS.slice(0, 5), value: params.nm || 632.8 },
        { id: 'L', label: 'Target distance', min: 1, max: 10000, value: params.L || 100, log: true, sig: 2, unit: 'm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['M', 'Expansion · length of the expander'], ['out', 'Beam radius leaving lens 2'], ['div', 'Divergence half-angle: before → after'], ['zr', 'Rayleigh range: before → after'], ['rl', 'Radius at the target: without → with'], ['x', 'Expanded beam is narrower beyond'], ['wp', 'Output waist']]);
      const plot = kit.plot(box.stage, { x: { label: 'distance from lens 1 (m)', log: true }, y: { label: 'beam radius (mm)', log: true }, series: [] }, 190);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cy = Hh * 0.5, nm = V.nm, w0 = V.w0 * 1e-3, gal = V.kind === 'G';
        const f1 = V.f1 * 1e-3, f2 = V.M * f1, F1 = gal ? -f1 : f1, z2 = F1 + f2 + V.dz * 1e-3, ref = f1 + f2;
        const tr = B.train({ w0, z0: 0, nm, M2: 1 }, [{ z: 0, f: F1 }, { z: z2, f: f2 }]), seg = tr.segments[2];
        const zmin = -0.25 * ref, zmax = 1.5 * ref + 0.2 * ref, sa = (W - 60) / (zmax - zmin), xz = z => 30 + (z - zmin) * sa;
        let wmax = 0; for (let i = 0; i <= 160; i++) wmax = Math.max(wmax, tr.w(zmin + (zmax - zmin) * i / 160));
        const k = 0.38 * Hh / wmax, rad = z => k * tr.w(z);
        S.axis(c, 20, cy, W - 20);
        S.beam(c, xz(zmin), xz(zmax), cy, x => rad(zmin + (x - 30) / sa), { nm: vis(nm), alpha: 0.36 });
        const h1 = clamp(2 * rad(0), 18, 0.46 * Hh), h2 = clamp(1.6 * rad(z2), 18, 0.46 * Hh);
        S.thinLens(c, xz(0), cy, h1, F1, {}); S.thinLens(c, xz(z2), cy, h2, f2, {});
        kit.label(c, 'f₁ = ' + (gal ? '−' : '') + sig(V.f1, 3) + ' mm', xz(0), cy + h1 + 15, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'f₂ = ' + sig(f2 * 1e3, 3) + ' mm', xz(z2), cy + h2 + 15, { align: 'center', color: C.muted, size: 11.5 });
        if (!gal) { c.save(); c.fillStyle = C.warn; c.beginPath(); c.arc(xz(f1), cy, 3.5, 0, 2 * PI); c.fill(); c.restore(); kit.label(c, 'internal focus', xz(f1), cy - 15, { align: 'center', color: C.warn, size: 11 }); }
        S.dim(c, xz(0), cy - 0.45 * Hh, xz(z2), cy - 0.45 * Hh, 'length ' + lenStr(z2), { off: -9, size: 11.5 });
        kit.label(c, 'radial scale exaggerated ×' + sig(k / sa, 3) + (nm > 700 ? '  ·  false colour' : ''), 14, Hh - 12, { color: C.faint, size: 11 });
        kit.label(c, 'input waist at lens 1', xz(0) - 8, 16, { color: C.muted, size: 11, align: 'right' });
        // numbers
        const th0 = B.divergence(w0, nm), th1 = B.divergence(seg.w0, nm), L = V.L, w0L = B.w(L, w0, nm), w1L = tr.w(L);
        let cross = null; for (const z of logSteps(Math.max(0.05, z2 * 1.05), 1e4, 300)) if (tr.w(z) < B.w(z, w0, nm)) { cross = z; break; }
        const ex = O.shape.expander(F1, f2);
        ro.set('M', ex.kind + ' · × ' + sig(ex.m, 3) + ' · ' + lenStr(ex.length + V.dz * 1e-3));
        ro.set('out', lenStr(seg.w0) + ' (waist)  ·  ' + lenStr(tr.w(z2 + 0.001)) + ' at lens 2');
        ro.set('div', angStr(th0) + ' → ' + angStr(th1));
        ro.set('zr', lenStr(B.rayleigh(w0, nm)) + ' → ' + lenStr(seg.zR));
        ro.set('rl', lenStr(w0L) + ' → ' + lenStr(w1L) + '  (' + sig(w0L / w1L, 3) + '× narrower)');
        ro.set('x', cross ? lenStr(cross) : 'no crossover within 10 km');
        const wz = seg.waistZ - z2;
        ro.set('wp', wz > 0 ? lenStr(wz) + ' behind lens 2' : 'virtual: ' + lenStr(-wz) + ' in front of lens 2 (diverging)');
        const p0 = [], p1 = [], zlo = Math.max(0.2, z2 * 1.2);
        for (const z of logSteps(zlo, 1e4, 80)) { p0.push([z, B.w(z, w0, nm) * 1e3]); p1.push([z, tr.w(z) * 1e3]); }
        plot.set({ series: [{ pts: p0, label: 'no expander', color: C.series[1] }, { pts: p1, label: 'with the expander', color: C.series[0] }], marks: [{ x: L, y: w1L * 1e3, label: 'with' }, { x: L, y: w0L * 1e3, label: 'without' }], x: { label: 'distance from lens 1 (m)', log: true, min: zlo, max: 1e4 }, y: { label: 'beam radius (mm)', log: true } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a waist through lenses */
  Hyper.sim('gb-lens', {
    title: 'A beam waist through lenses: Self\'s formulas against the lens equation',
    blurb: `A beam with a waist at the left meets one or two thin lenses. The envelope follows the complex beam parameter, lens by lens. The amber dot is where the **new waist really forms**, the open diamond where the **lens equation** would put the image of the waist. **Drag the lenses** (or use the sliders). The graph compares the two as the distance to lens 1 changes.

**Try this**
- With w₀ = 0.1 mm (z_R ≈ 50 mm) and f = 100 mm, move lens 1 to 150 mm: the Gaussian waist is at 200 mm, the lens equation says 300 mm. Move it far away (1 m): the two agree.
- Put lens 1 exactly at s = f: the new waist is at the back focal plane, of radius λf/(πw₀), whatever the formula for an image says.
- Choose a larger waist (1 mm, z_R ≈ 5 m): the beam is nearly collimated and the new waist sits at the focal plane for any s.
- Add a second lens to relay the waist, or to make a beam expander.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, B = O.beam;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'w0', label: 'Waist radius w₀', min: 0.02, max: 2, value: params.w0 || 0.1, log: true, sig: 2, unit: 'mm' },
        { id: 'nm', type: 'select', label: 'Wavelength', options: LAMBDAS.slice(0, 5), value: params.nm || 632.8 },
        { id: 'f1', label: 'Lens 1: focal length', min: 20, max: 500, value: params.f1 || 100, log: true, sig: 3, unit: 'mm' },
        { id: 's1', label: 'Lens 1: distance from the waist', min: 10, max: 1000, step: 1, value: params.s1 || 150, unit: 'mm' },
        { id: 'two', type: 'check', label: 'Add a second lens', value: !!params.two },
        { id: 'f2', label: 'Lens 2: focal length', min: 20, max: 500, value: params.f2 || 100, log: true, sig: 3, unit: 'mm' },
        { id: 's2', label: 'Lens 2: distance from the waist', min: 30, max: 1450, step: 1, value: params.s2 || 600, unit: 'mm' }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const sync = () => { ctl.show('f2', V.two); ctl.show('s2', V.two); };
      sync();
      const ro = kit.readout(box.side, [['zr', 'Rayleigh range of the input beam'], ['g', 'Lens 1, Gaussian: waist · behind the lens'], ['geo', 'Lens 1, lens equation: image · magnification'], ['mag', 'Waist magnification: Gaussian · lens equation'], ['out', 'After the last lens: waist · from the first waist'], ['end', 'Beam radius at the far end of the bench']]);
      const plot = kit.plot(box.stage, { x: { label: 'distance from the waist to lens 1, s (mm)' }, y: { label: 'waist behind the lens, s′ (mm)', min: -50 }, series: [] }, 180);
      const ZMIN = -80, ZMAX = 1500, geom = () => { const sa = (st.W - 60) / (ZMAX - ZMIN); return { sa, xz: z => 30 + (z - ZMIN) * sa, zx: x => (x - 30) / sa + ZMIN }; };
      kit.drag(st, {
        hover: true,
        hit: p => { const g = geom(); if (Math.abs(p.x - g.xz(V.s1)) < 11) return 's1'; if (V.two && Math.abs(p.x - g.xz(V.s2)) < 11) return 's2'; return null; },
        move: (what, p) => {
          const z = Math.round(geom().zx(p.x));
          if (what === 's1') ctl.set('s1', clamp(z, 10, V.two ? V.s2 - 20 : 1000)); else ctl.set('s2', clamp(z, V.s1 + 20, 1450));
          loop.once();
        }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cy = Hh * 0.5, nm = V.nm, w0 = V.w0 * 1e-3, g = geom();
        const lenses = [{ z: V.s1 * 1e-3, f: V.f1 * 1e-3 }]; if (V.two) lenses.push({ z: V.s2 * 1e-3, f: V.f2 * 1e-3 });
        const tr = B.train({ w0, z0: 0, nm, M2: 1 }, lenses);
        let wmax = 0; for (let i = 0; i <= 200; i++) wmax = Math.max(wmax, tr.w((ZMIN + (ZMAX - ZMIN) * i / 200) * 1e-3));
        const k = 0.36 * Hh / wmax, rad = zmm => k * tr.w(zmm * 1e-3);
        S.axis(c, 20, cy, W - 20);
        S.beam(c, g.xz(ZMIN), g.xz(ZMAX), cy, x => rad(g.zx(x)), { nm: vis(nm), alpha: 0.36 });
        const lh = 0.30 * Hh;
        S.thinLens(c, g.xz(V.s1), cy, lh, V.f1, {});
        kit.label(c, 'lens 1  f = ' + sig(V.f1, 3) + ' mm', g.xz(V.s1), cy + lh + 15, { align: 'center', color: C.muted, size: 11.5 });
        if (V.two) { S.thinLens(c, g.xz(V.s2), cy, lh, V.f2, {}); kit.label(c, 'lens 2  f = ' + sig(V.f2, 3) + ' mm', g.xz(V.s2), cy + lh + 15, { align: 'center', color: C.muted, size: 11.5 }); }
        kit.label(c, 'waist', g.xz(0), cy - 0.34 * Hh, { align: 'center', color: C.muted, size: 11.5 });
        polyline(c, [[g.xz(0), cy - 0.31 * Hh], [g.xz(0), cy + 0.31 * Hh]], C.grid, 1, [3, 4]);
        // where the first lens puts the waist: Self's formulas, and the lens equation
        const L1 = B.lens({ w0, s: V.s1 * 1e-3, f: V.f1 * 1e-3, nm }), zg = V.s1 + L1.s * 1e3, geo = V.s1 > V.f1 ? 1 / (1 / V.f1 - 1 / V.s1) : NaN, zgeo = V.s1 + geo;
        const nxt = V.two ? V.s2 : Infinity;
        if (zg < nxt && zg > V.s1 && zg < ZMAX) { c.save(); c.fillStyle = C.warn; c.beginPath(); c.arc(g.xz(zg), cy, 5, 0, 2 * PI); c.fill(); c.restore(); kit.label(c, 'Gaussian waist', g.xz(zg), cy - 0.15 * Hh, { align: 'center', color: C.warn, size: 11.5, weight: 650 }); }
        if (Number.isFinite(zgeo) && zgeo < nxt && zgeo < ZMAX) { c.save(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(g.xz(zgeo), cy - 7); c.lineTo(g.xz(zgeo) + 7, cy); c.lineTo(g.xz(zgeo), cy + 7); c.lineTo(g.xz(zgeo) - 7, cy); c.closePath(); c.stroke(); c.restore(); kit.label(c, 'lens equation', g.xz(zgeo), cy + 0.15 * Hh, { align: 'center', color: C.text, size: 11.5 }); }
        kit.label(c, 'radial scale exaggerated ×' + sig(k / g.sa, 3) + '  ·  drag the lenses', 14, Hh - 12, { color: C.faint, size: 11 });
        // numbers
        const segs = tr.segments, last = segs[segs.length - 1], zr = B.rayleigh(w0, nm), mG = L1.m, mGeo = V.s1 > V.f1 ? geo / V.s1 : NaN;
        ro.set('zr', lenStr(zr));
        ro.set('g', lenStr(L1.w0) + ' · ' + sig(L1.s * 1e3, 4) + ' mm');
        ro.set('geo', V.s1 > V.f1 ? sig(geo, 4) + ' mm · ×' + sig(mGeo, 3) : (Math.abs(V.s1 - V.f1) < 0.5 ? 'at infinity (collimated)' : 'virtual image'));
        ro.set('mag', '× ' + sig(mG, 3) + ' · ' + (V.s1 > V.f1 ? '× ' + sig(mGeo, 3) : '—'));
        ro.set('out', lenStr(last.w0) + ' · ' + sig(last.waistZ * 1e3, 4) + ' mm');
        ro.set('end', lenStr(tr.w(ZMAX * 1e-3)));
        const pg = [], pe = [];
        for (let s = 10; s <= 1000; s += 10) { const q = B.lens({ w0, s: s * 1e-3, f: V.f1 * 1e-3, nm }); pg.push([s, q.s * 1e3]); if (s > V.f1 * 1.02) { const y = 1 / (1 / V.f1 - 1 / s); if (y < 1000) pe.push([s, y]); } }
        plot.set({ series: [{ pts: pg, label: 'Gaussian beam (Self)', color: C.series[0] }, { pts: pe, label: 'lens equation', color: C.series[1], dash: true }], vlines: [{ x: V.s1, label: 's' }], marks: [{ x: V.s1, y: L1.s * 1e3, label: 'waist' }], x: { label: 'distance from the waist to lens 1, s (mm)', min: 0, max: 1000 }, y: { label: 'waist behind the lens, s′ (mm)', min: -50, max: 1000 } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ higher-order modes */
  const herm = (n, x) => { if (n === 0) return 1; let a = 1, b = 2 * x; for (let i = 1; i < n; i++) { const t = 2 * x * b - 2 * i * a; a = b; b = t; } return b; };
  const lag = (p, l, x) => { if (p === 0) return 1; let a = 1, b = 1 + l - x; for (let k = 1; k < p; k++) { const t = ((2 * k + 1 + l - x) * b - (k + l) * a) / (k + 1); a = b; b = t; } return b; };
  const hsv = (h, v) => { h = ((h % 1) + 1) % 1; const i = Math.floor(h * 6), f = h * 6 - i, q = 1 - f; let r, g, b; switch (i % 6) { case 0: r = 1; g = f; b = 0; break; case 1: r = q; g = 1; b = 0; break; case 2: r = 0; g = 1; b = f; break; case 3: r = 0; g = q; b = 1; break; case 4: r = f; g = 0; b = 1; break; default: r = 1; g = 0; b = q; } return [255 * r * v, 255 * g * v, 255 * b * v]; };
  const FACT = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880];
  // the position (in w) of the outermost peak of the irradiance of a Hermite–Gaussian mode of order m along one axis
  const outerPeak = m => {
    if (m === 0) return 0;
    const f = x => { const a = herm(m, Math.SQRT2 * x) * Math.exp(-x * x); return a * a; };
    let last = 0, y0 = f(0), y1 = f(0.005);
    for (let x = 0.01; x < 6; x += 0.005) { const y2 = f(x); if (y1 > y0 && y1 >= y2) last = x - 0.005; y0 = y1; y1 = y2; }
    return last;
  };
  Hyper.sim('gb-modes', {
    title: 'Higher-order modes: patterns, phase and M²',
    blurb: `The same family of beams that contains the Gaussian: **Hermite–Gaussian** modes TEM$_{mn}$ (rectangular, m and n dark lines), **Laguerre–Gaussian** modes (round, p dark rings and a phase that winds l times round the axis), and a **multimode** beam made by adding many modes in power. The left picture is the irradiance, the right one the phase as a colour wheel (the dashed circle has the radius w of the Gaussian). The graph is a cut through the brightest row, with the TEM₀₀ beam dashed.

**Try this**
- TEM₁₀: two lobes, a dark line between them, the colour jumps by half a turn (a π shift). Raise m and count the lines.
- LG with p = 0 and l = 1: the **doughnut**. The phase goes once round the colour wheel; raise l and the ring grows (radius w√(l/2)) while the phase winds faster.
- Read M²: TEM$_{m0}$ has 2m + 1 in x, an LG mode 2p + l + 1. The mode radius grows as √M².
- Multimode with N = 6: many modes added in power give a broad, flat-topped, speckle-free glow (M² of about 5).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'fam', type: 'select', label: 'Family', options: [['Hermite–Gaussian TEMmn (rectangular)', 'hg'], ['Laguerre–Gaussian LGpl (round)', 'lg'], ['Multimode: all modes up to an order, added in power', 'mix']], value: params.fam || 'hg' },
        { id: 'm', label: 'm: dark lines across x', min: 0, max: 6, step: 1, value: params.m != null ? params.m : 1 },
        { id: 'n', label: 'n: dark lines across y', min: 0, max: 6, step: 1, value: params.n != null ? params.n : 0 },
        { id: 'p', label: 'p: dark rings', min: 0, max: 4, step: 1, value: params.p != null ? params.p : 0 },
        { id: 'l', label: 'l: phase winds l times round the axis', min: 0, max: 6, step: 1, value: params.l != null ? params.l : 1 },
        { id: 'N', label: 'Highest mode order N (m + n ≤ N)', min: 1, max: 8, step: 1, value: params.N || 5 },
        { id: 'phase', type: 'check', label: 'Show the phase', value: true },
        { id: 'bright', type: 'check', label: 'Brighten the faint parts', value: false }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const sync = () => { const f = V.fam; ctl.show('m', f === 'hg'); ctl.show('n', f === 'hg'); ctl.show('p', f === 'lg'); ctl.show('l', f === 'lg'); ctl.show('N', f === 'mix'); ctl.show('phase', f !== 'mix'); };
      sync();
      const ro = kit.readout(box.side, [['name', 'Mode'], ['dark', 'Dark lines or rings'], ['m2', 'Beam quality M²'], ['size', 'Second-moment radius ÷ w'], ['ring', 'Bright ring'], ['ph', 'Phase']]);
      const plot = kit.plot(box.stage, { x: { label: 'position x / w', min: -4, max: 4 }, y: { label: 'relative irradiance', min: 0, max: 1.05 }, series: [] }, 160);
      const NX = 80;
      // the field of a mode at (x, y) in units of w: [amplitude, phase]; irradiance = amplitude²
      const field = (fam, m, n, p, l, x, y) => {
        if (fam === 'hg') { const a = herm(m, Math.SQRT2 * x) * Math.exp(-x * x) * herm(n, Math.SQRT2 * y) * Math.exp(-y * y); return [a, a < 0 ? PI : 0]; }
        const r2 = x * x + y * y, u = 2 * r2, L = lag(p, l, u), a = Math.pow(Math.sqrt(u), l) * L * Math.exp(-r2);
        return [a, l * Math.atan2(y, x) + (L < 0 ? PI : 0)];
      };
      const inten = (x, y) => {                                           // the equal-power mixture of all HG modes with i + j ≤ N
        let s = 0; for (let i = 0; i <= V.N; i++) { const ax = herm(i, Math.SQRT2 * x), fx = ax * ax * Math.exp(-2 * x * x) / (Math.pow(2, i) * FACT[i]); for (let j = 0; i + j <= V.N; j++) { const ay = herm(j, Math.SQRT2 * y); s += fx * ay * ay * Math.exp(-2 * y * y) / (Math.pow(2, j) * FACT[j]); } }
        return s;
      };
      let cache = { key: '' };
      const build = () => {
        const fam = V.fam, key = [fam, V.m, V.n, V.p, V.l, V.N].join('|');
        if (cache.key === key) return cache;
        const Nmax = fam === 'hg' ? Math.max(V.m, V.n) : fam === 'lg' ? 2 * V.p + V.l : V.N, R = 1.5 + 0.65 * Math.sqrt(2 * Nmax + 1);
        const I = new Float32Array(NX * NX), P = new Float32Array(NX * NX); let mx = 0, jm = 0;
        for (let j = 0; j < NX; j++) for (let i = 0; i < NX; i++) {
          const x = ((i + 0.5) / NX * 2 - 1) * R, y = (1 - (j + 0.5) / NX * 2) * R, k = j * NX + i;
          if (fam === 'mix') I[k] = inten(x, y); else { const f = field(fam, V.m, V.n, V.p, V.l, x, y); I[k] = f[0] * f[0]; P[k] = f[1]; }
          if (I[k] > mx) { mx = I[k]; jm = j; }
        }
        for (let k = 0; k < I.length; k++) I[k] /= mx || 1;
        cache = { key, R, I, P, ym: (1 - (jm + 0.5) / NX * 2) * R, mx };
        return cache;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, d = build(), fam = V.fam, size = Math.min(Hh - 42, W * 0.40), y0 = (Hh - size) / 2 - 4, x1 = 20, x2 = Math.min(W - size - 20, x1 + size + 40);
        S.image(c, x1, y0, size, size, NX, NX, (u, v) => d.I[Math.min(NX - 1, Math.floor(v * NX)) * NX + Math.min(NX - 1, Math.floor(u * NX))], { nm: 632.8, gamma: V.bright ? 0.5 : 1, key: d.key + '|i' + V.bright, id: 'inten' });
        const ring = (cx, cy) => { c.save(); c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.beginPath(); c.arc(cx, cy, size / (2 * d.R), 0, 2 * PI); c.stroke(); c.restore(); };
        ring(x1 + size / 2, y0 + size / 2);
        kit.label(c, 'irradiance', x1 + size / 2, y0 + size + 13, { align: 'center', color: C.muted, size: 11.5 });
        if (V.phase && fam !== 'mix') {
          S.image(c, x2, y0, size, size, NX, NX, (u, v) => { const k = Math.min(NX - 1, Math.floor(v * NX)) * NX + Math.min(NX - 1, Math.floor(u * NX)); return hsv(d.P[k] / (2 * PI), Math.sqrt(d.I[k])); }, { key: d.key + '|ph', id: 'phase' });
          ring(x2 + size / 2, y0 + size / 2);
          kit.label(c, 'phase (colour = phase, brightness = amplitude)', x2 + size / 2, y0 + size + 13, { align: 'center', color: C.muted, size: 11.5 });
          if (x2 + size + 12 < W) for (let i = 0; i < 24; i++) { const col = hsv(i / 24, 1); c.fillStyle = 'rgb(' + Math.round(col[0]) + ',' + Math.round(col[1]) + ',' + Math.round(col[2]) + ')'; c.fillRect(x2 + size + 8, y0 + size - (i + 1) * size / 24 * 0.6, 8, size / 24 * 0.6 + 0.5); }
        } else if (fam === 'mix') {
          kit.label(c, 'an incoherent sum: the phases of the modes', x2 + size / 2, y0 + size / 2 - 8, { align: 'center', color: C.muted, size: 12 });
          kit.label(c, 'are not locked, so no single phase picture', x2 + size / 2, y0 + size / 2 + 10, { align: 'center', color: C.muted, size: 12 });
        }
        // numbers
        const hgM2 = V.fam === 'hg' ? (2 * V.m + 1) + ' × ' + (2 * V.n + 1) : null;
        if (fam === 'hg') {
          ro.set('name', 'TEM' + V.m + V.n + '  (' + (V.m + 1) * (V.n + 1) + ' bright lobes)');
          ro.set('dark', V.m + ' across x, ' + V.n + ' across y');
          ro.set('m2', hgM2 + '  (x × y)');
          ro.set('size', '√' + (2 * V.m + 1) + ' = ' + sig(Math.sqrt(2 * V.m + 1), 3) + ' in x · ' + sig(Math.sqrt(2 * V.n + 1), 3) + ' in y');
          ro.set('ring', V.m + V.n === 0 ? 'none: the Gaussian spot' : 'none: lobes; outer peaks at ' + (V.m > 0 ? '±' + sig(outerPeak(V.m), 2) + ' w in x' : '') + (V.m > 0 && V.n > 0 ? ', ' : '') + (V.n > 0 ? '±' + sig(outerPeak(V.n), 2) + ' w in y' : ''));
          ro.set('ph', V.m + V.n === 0 ? 'flat' : 'jumps by π across each dark line');
        } else if (fam === 'lg') {
          const M2 = 2 * V.p + V.l + 1;
          ro.set('name', 'LG p = ' + V.p + ', l = ' + V.l + (V.p === 0 && V.l === 1 ? '  (the doughnut)' : V.p === 0 && V.l === 0 ? '  (the Gaussian)' : ''));
          ro.set('dark', V.p + ' ring' + (V.p === 1 ? '' : 's') + (V.l > 0 ? ' and a dark centre' : ''));
          ro.set('m2', String(M2) + '  (2p + l + 1)');
          ro.set('size', '√' + M2 + ' = ' + sig(Math.sqrt(M2), 3));
          ro.set('ring', V.p === 0 && V.l > 0 ? 'at ' + sig(Math.sqrt(V.l / 2), 3) + ' w' : V.l === 0 && V.p === 0 ? 'none' : 'rings: see the cut');
          ro.set('ph', V.l > 0 ? 'winds ' + V.l + ' time' + (V.l > 1 ? 's' : '') + ' round the axis; orbital angular momentum ' + V.l + 'ħ per photon' : 'flat apart from π jumps between rings');
        } else {
          let s1 = 0, cnt = 0; for (let i = 0; i <= V.N; i++) for (let j = 0; i + j <= V.N; j++) { s1 += 2 * i + 1; cnt++; }
          ro.set('name', 'sum of ' + cnt + ' modes with m + n ≤ ' + V.N);
          ro.set('dark', 'none: the lobes overlap');
          ro.set('m2', 'about ' + sig(s1 / cnt, 3) + ' per axis (mean of 2m + 1)');
          ro.set('size', '√' + sig(s1 / cnt, 3) + ' = ' + sig(Math.sqrt(s1 / cnt), 3));
          ro.set('ring', 'none');
          ro.set('ph', 'not locked between the modes');
        }
        const pm = [], p0 = [];
        for (let i = 0; i <= 160; i++) { const x = -d.R + 2 * d.R * i / 160; let v; if (fam === 'mix') v = inten(x, 0) / (d.mx || 1); else { const f = field(fam, V.m, V.n, V.p, V.l, x, d.ym); v = f[0] * f[0] / (d.mx || 1); } pm.push([x, v]); p0.push([x, Math.exp(-2 * x * x)]); }
        plot.set({ series: [{ pts: pm, label: fam === 'hg' ? 'TEM' + V.m + V.n : fam === 'lg' ? 'LG' + V.p + V.l : 'multimode', color: C.series[0] }, { pts: p0, label: 'TEM₀₀', color: C.series[1], dash: true }], x: { label: 'position x / w (cut through the brightest row)', min: -d.R, max: d.R }, y: { label: 'relative irradiance', min: 0, max: 1.05 } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ measuring a beam */
  Hyper.sim('gb-measure', {
    title: 'Measuring a beam: the knife edge and the caustic',
    blurb: `Two classic measurements. **Knife edge**: a blade moves across the beam and the power that gets by is recorded. The curve is an error function for a Gaussian beam, and the distance between two clip levels gives the beam radius after a fixed factor. **Caustic**: the beam width is measured in ten planes and the parabola w²(z) is fitted, giving the waist, the divergence and M².

**Try this**
- Knife edge: drag the blade; with the 10–90 % clip levels the distance between the two points is 1.28 w, with 16–84 % it is exactly w. Change the beam to the flat-top and the estimate no longer matches the second-moment radius.
- Caustic: with the **ISO placement** (half the planes within one Rayleigh range, half beyond two) M² comes out close to the true value even with 5 % noise.
- Put all the planes **near the waist** and raise the noise to 10 %: the width hardly changes there, so the divergence, and with it M², is poorly fixed and the error grows. Put them all **far away** on one side: the waist is not found and M² is far off.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, B = O.beam;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'method', type: 'select', label: 'Method', options: [['Knife edge across the beam', 'knife'], ['M² from a caustic of ten planes', 'caustic']], value: params.method || 'knife' },
        { id: 'shape', type: 'select', label: 'Beam', options: [['Gaussian', 'g'], ['Flat-top (super-Gaussian, order 8)', 's']], value: 'g' },
        { id: 'clip', type: 'select', label: 'Clip levels', options: [['10 % and 90 %', '10'], ['16 % and 84 %', '16'], ['5 % and 95 %', '5']], value: '10' },
        { id: 'x', label: 'Knife position', min: -3, max: 3, step: 0.01, value: 0.3, unit: 'mm' },
        { id: 'M2', label: 'True beam quality M²', min: 1, max: 6, value: 2, log: true, sig: 2, fmt: v => 'M² = ' + sig(v, 2) },
        { id: 'w0', label: 'True waist radius', min: 0.1, max: 1, value: 0.3, log: true, sig: 2, unit: 'mm' },
        { id: 'nm', type: 'select', label: 'Wavelength', options: [['632.8 nm', 632.8], ['1064 nm', 1064]], value: 632.8 },
        { id: 'place', type: 'select', label: 'Where the ten planes are', options: [['ISO: half near the waist, half far', 'iso'], ['All within one Rayleigh range', 'near'], ['All far from the waist, one side', 'far']], value: 'iso' },
        { id: 'noise', label: 'Noise on each width', min: 0, max: 10, step: 0.5, value: 3, fmt: v => sig(v, 2) + ' %' }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const sync = () => { const k = V.method === 'knife'; for (const id of ['shape', 'clip', 'x']) ctl.show(id, k); for (const id of ['M2', 'w0', 'nm', 'place', 'noise']) ctl.show(id, !k); };
      sync();
      const roK = kit.readout(box.side, [['kx', 'Knife position · power passing'], ['lev', 'Clip positions'], ['d', 'Distance between them'], ['we', 'Beam radius = distance ÷ factor'], ['tr', '1/e² radius · second-moment radius']]);
      const roC = kit.readout(box.side, [['tr', 'True: w₀ · θ · M²'], ['fit', 'Fit: w₀ · θ · M²'], ['err', 'Error in M²'], ['z0', 'Fitted waist position']]);
      const plot = kit.plot(box.stage, { x: { label: 'knife position (mm)' }, y: { label: 'power passing (%)' }, series: [] }, 190);
      // ----- the knife edge: the passing fraction of a round beam with irradiance exp(−2 (r/w)^q), w = 1 mm
      const NG = 240, XR = 3.5, KF = { 10: [0.9, 0.1, 1.2816], 16: [0.8413, 0.1587, 1.0], 5: [0.95, 0.05, 1.6449] }, shapes = {};
      const marginal = key => {
        if (shapes[key]) return shapes[key];
        const q = key === 'g' ? 2 : 8, xs = [], mg = [], cdf = [], dx = 2 * XR / NG; let acc = 0, tot = 0, s2 = 0;
        for (let i = 0; i <= NG; i++) { const x = -XR + i * dx; let m = 0; for (let j = 0; j <= NG; j++) { const y = -XR + j * dx; m += Math.exp(-2 * Math.pow(Math.sqrt(x * x + y * y), q)); } xs.push(x); mg.push(m); tot += m; s2 += m * x * x; }
        for (let i = 0; i <= NG; i++) { cdf.push((acc + 0.5 * mg[i]) / tot); acc += mg[i]; }       // mid-point rule: the curve is symmetric about 0
        return (shapes[key] = { xs, pass: cdf.map(v => 1 - v), q, sigma: Math.sqrt(s2 / tot) });
      };
      const at = (sh, level) => { for (let i = 1; i < sh.xs.length; i++) if (sh.pass[i] <= level) { const t = (sh.pass[i - 1] - level) / ((sh.pass[i - 1] - sh.pass[i]) || 1); return sh.xs[i - 1] + t * (sh.xs[i] - sh.xs[i - 1]); } return XR; };
      const passAt = (sh, x) => { const t = (x + XR) / (2 * XR) * NG, i = clamp(Math.floor(t), 0, NG - 1); return sh.pass[i] + (t - i) * (sh.pass[i + 1] - sh.pass[i]); };
      // ----- the caustic: planes, measured widths, a least-squares parabola
      const NZ = [0.7, -0.4, 0.2, -0.9, 0.5, 0.1, -0.6, 0.8, -0.3, 0.4];
      const PL = { iso: [-1, -0.5, 0, 0.5, 1, -3.5, -2.5, 2.5, 3.5, 4.5], near: [-0.9, -0.7, -0.5, -0.3, -0.1, 0.1, 0.3, 0.5, 0.7, 0.9], far: [3, 3.35, 3.7, 4.05, 4.4, 4.75, 5.1, 5.45, 5.8, 6.15] };
      const fit = (u, y) => {                                               // y = A + B u + C u², by the normal equations
        const S0 = u.length, s = k => u.reduce((a, v) => a + Math.pow(v, k), 0), t = k => u.reduce((a, v, i) => a + y[i] * Math.pow(v, k), 0);
        const M = [[S0, s(1), s(2), t(0)], [s(1), s(2), s(3), t(1)], [s(2), s(3), s(4), t(2)]];
        for (let i = 0; i < 3; i++) { let p = i; for (let r = i + 1; r < 3; r++) if (Math.abs(M[r][i]) > Math.abs(M[p][i])) p = r; [M[i], M[p]] = [M[p], M[i]]; if (Math.abs(M[i][i]) < 1e-12) return null; for (let r = i + 1; r < 3; r++) { const f = M[r][i] / M[i][i]; for (let q = i; q < 4; q++) M[r][q] -= f * M[i][q]; } }
        const x = [0, 0, 0]; for (let i = 2; i >= 0; i--) { let a = M[i][3]; for (let q = i + 1; q < 3; q++) a -= M[i][q] * x[q]; x[i] = a / M[i][i]; }
        return x;
      };
      kit.drag(st, {
        hover: true,
        hit: p => { if (V.method !== 'knife') return null; const g = kg(); return Math.abs(p.x - (g.x + (V.x + 3) * g.px)) < 12 && p.y > g.y && p.y < g.y + g.size ? 'k' : null; },
        move: (what, p) => { const g = kg(); ctl.set('x', clamp(Math.round(((p.x - g.x) / g.px - 3) * 100) / 100, -3, 3)); loop.once(); }
      });
      const kg = () => { const size = Math.min(st.H - 40, st.W * 0.40); return { size, x: 20, y: (st.H - size) / 2 - 4, px: size / 6 }; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const knife = V.method === 'knife'; roK.show(knife); roC.show(!knife);
        if (knife) {
          const sh = marginal(V.shape), g = kg(), kf = KF[V.clip], xhi = at(sh, kf[0]), xlo = at(sh, kf[1]), dd = xlo - xhi, we = dd / kf[2];
          S.image(c, g.x, g.y, g.size, g.size, 80, 80, (u, v) => { const x = (u - 0.5) * 6, y = (v - 0.5) * 6; return Math.exp(-2 * Math.pow(Math.sqrt(x * x + y * y), sh.q)); }, { nm: 632.8, key: 'k|' + V.shape, id: 'knife' });
          const bx = g.x + (V.x + 3) * g.px;
          c.save(); c.fillStyle = C.dark ? 'rgba(10,12,26,0.88)' : 'rgba(40,44,70,0.88)'; c.fillRect(g.x, g.y, bx - g.x, g.size); c.strokeStyle = C.warn; c.lineWidth = 2.4; c.beginPath(); c.moveTo(bx, g.y); c.lineTo(bx, g.y + g.size); c.stroke(); c.restore();
          kit.label(c, 'blade (drag it)', bx, g.y - 8, { align: 'center', color: C.warn, size: 11.5 });
          kit.label(c, 'power passing: ' + sig(100 * passAt(sh, V.x), 3) + ' %', g.x + g.size / 2, g.y + g.size + 13, { align: 'center', color: C.muted, size: 11.5 });
          // the profile and the clip positions
          const px0 = g.x + g.size + 46, px1 = W - 24, base = g.y + g.size * 0.86, hgt = g.size * 0.62, ux = u => (px0 + px1) / 2 + u * (px1 - px0) / 7;
          const prof = u => base - hgt * Math.exp(-2 * Math.pow(Math.abs(u), sh.q));
          c.save(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); for (let i = 0; i <= 160; i++) { const u = -3.5 + 7 * i / 160; i ? c.lineTo(ux(u), prof(u)) : c.moveTo(ux(u), prof(u)); } c.stroke(); c.restore();
          c.save(); c.strokeStyle = C.axis; c.beginPath(); c.moveTo(px0, base); c.lineTo(px1, base); c.stroke(); c.restore();
          for (const [x, lab] of [[xhi, 'x' + Math.round(kf[0] * 100)], [xlo, 'x' + Math.round(kf[1] * 100)]]) { polyline(c, [[ux(x), base], [ux(x), g.y + g.size * 0.12]], C.warn, 1.3, [4, 3]); kit.label(c, lab, ux(x), g.y + g.size * 0.12 - 8, { align: 'center', color: C.warn, size: 11.5 }); }
          S.dim(c, ux(xhi), g.y + g.size * 0.2, ux(xlo), g.y + g.size * 0.2, 'd = ' + sig(dd, 3) + ' mm', { off: -10, size: 11.5 });
          S.dim(c, ux(-1), base + 22, ux(1), base + 22, '2w = 2 mm (1/e²)', { off: 12, size: 11.5, color: C.accent });
          kit.label(c, 'irradiance along a line through the centre (w = 1 mm)', (px0 + px1) / 2, g.y - 8, { align: 'center', color: C.muted, size: 11.5 });
          roK.set('kx', sig(V.x, 3) + ' mm · ' + sig(100 * passAt(sh, V.x), 3) + ' %');
          roK.set('lev', sig(xhi, 3) + ' mm  (' + Math.round(kf[0] * 100) + ' %) · ' + sig(xlo, 3) + ' mm  (' + Math.round(kf[1] * 100) + ' %)');
          roK.set('d', sig(dd, 4) + ' mm  (' + sig(kf[2], 4) + ' w for a Gaussian)');
          roK.set('we', sig(we, 4) + ' mm' + (V.shape === 'g' ? '  — exact for a Gaussian' : '  — not the true radius of a flat-top'));
          roK.set('tr', '1.000 mm · ' + sig(2 * sh.sigma, 4) + ' mm  (D4σ ÷ 2)');
          const n = [], ref = [], gs = marginal('g');
          for (let i = 0; i < sh.xs.length; i += 2) { n.push([sh.xs[i], 100 * sh.pass[i]]); ref.push([gs.xs[i], 100 * gs.pass[i]]); }
          const series = [{ pts: n, label: V.shape === 'g' ? 'power passing the blade' : 'flat-top beam', color: C.series[0] }];
          if (V.shape !== 'g') series.push({ pts: ref, label: 'a Gaussian of the same w', color: C.series[1], dash: true });
          plot.set({ series, vlines: [{ x: V.x, label: 'blade' }], hlines: [{ y: 100 * kf[0], label: Math.round(kf[0] * 100) + ' %' }, { y: 100 * kf[1], label: Math.round(kf[1] * 100) + ' %' }], marks: [{ x: V.x, y: 100 * passAt(sh, V.x), label: sig(100 * passAt(sh, V.x), 3) + ' %' }], x: { label: 'knife position (mm)', min: -3.5, max: 3.5 }, y: { label: 'power passing (%)', min: 0, max: 100 } });
        } else {
          const nm = V.nm, w0 = V.w0 * 1e-3, M2 = V.M2, zR = B.rayleigh(w0, nm, M2), th = B.divergence(w0, nm, M2), zs = PL[V.place];
          const wt = z => B.w(z, w0, nm, M2), data = zs.map((u, i) => { const z = u * zR; return { u, z, w: wt(z) * (1 + 0.01 * V.noise * NZ[i]) }; });
          const q = fit(data.map(d => d.u), data.map(d => Math.pow(d.w / w0, 2)));
          // back to metres: w² = a + b z + c z²
          let res = null;
          if (q && q[2] > 0) { const a = q[0] * w0 * w0, b = q[1] * w0 * w0 / zR, cc = q[2] * w0 * w0 / (zR * zR), w02 = a - b * b / (4 * cc); if (w02 > 0) { const w0f = Math.sqrt(w02), thf = Math.sqrt(cc); res = { a, b, cc, w0f, thf, z0: -b / (2 * cc), M2: PI * w0f * thf / (nm * 1e-9) }; } }
          const zu = zR < 0.05 ? 1e3 : 1, unit = zu === 1 ? 'm' : 'mm', ZR = 6.5 * zR, sa = (W - 70) / (2 * ZR), xz = z => W / 2 + z * sa, cy = Hh * 0.42, wmaxT = wt(ZR), k = 0.34 * Hh / wmaxT;
          S.axis(c, 24, cy, W - 24);
          S.beam(c, 35, W - 35, cy, x => k * wt((x - W / 2) / sa), { nm: vis(nm), alpha: 0.3 });
          if (res) edges(c, 35, W - 35, cy, x => { const z = (x - W / 2) / sa; return k * Math.sqrt(Math.max(0, res.a + res.b * z + res.cc * z * z)); }, C.accent, 1.5, [6, 4]);
          for (const d of data) { c.save(); c.fillStyle = C.accent; for (const sgn of [-1, 1]) { c.beginPath(); c.arc(xz(d.z), cy + sgn * k * d.w, 3.6, 0, 2 * PI); c.fill(); } c.restore(); polyline(c, [[xz(d.z), cy - 0.38 * Hh], [xz(d.z), cy + 0.38 * Hh]], C.grid, 1, [2, 4]); }
          for (const j of [-1, 1]) kit.label(c, j > 0 ? '+z_R' : '−z_R', xz(j * zR), cy + 0.38 * Hh + 11, { align: 'center', color: C.muted, size: 10.5 });
          kit.label(c, 'dots: the ten measured widths · dashed: the fitted beam · filled: the true beam', 14, 16, { color: C.muted, size: 11.5 });
          kit.label(c, 'radial scale exaggerated ×' + sig(k / sa, 3), 14, Hh - 10, { color: C.faint, size: 11 });
          roC.set('tr', lenStr(w0) + ' · ' + angStr(th) + ' · ' + sig(M2, 3));
          roC.set('fit', res ? lenStr(res.w0f) + ' · ' + angStr(res.thf) + ' · ' + sig(res.M2, 3) : 'the fit fails (the planes do not fix the parabola)');
          roC.set('err', res ? sig(100 * (res.M2 / M2 - 1), 3) + ' %' : '—');
          roC.set('z0', res ? lenStr(res.z0) + '  (true: 0)' : '—');
          const pts = [], pf = [], pm = [];
          for (let i = 0; i <= 120; i++) { const z = -ZR + 2 * ZR * i / 120; pts.push([z * zu, Math.pow(wt(z) * 1e3, 2)]); if (res) pf.push([z * zu, Math.max(0, res.a + res.b * z + res.cc * z * z) * 1e6]); }
          for (const d of data) pm.push([d.z * zu, Math.pow(d.w * 1e3, 2)]);
          const series = [{ pts, label: 'true w²(z)', color: C.series[0] }, { pts: pm, label: 'measured planes', color: C.series[2], line: false, dots: 4 }];
          if (res) series.push({ pts: pf, label: 'fitted parabola', color: C.series[1], dash: true });
          plot.set({ series, vlines: [], hlines: [], marks: [], x: { label: 'position z (' + unit + ')', min: -ZR * zu, max: ZR * zu }, y: { label: 'w² (mm²)', min: 0 } });
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
