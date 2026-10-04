/* HYPER-OPTICS · sims/interference.js — simulations of the topic "Interference" (ids in-…)
 *   in-waves        a travelling light wave (amplitude, wavelength, phase, a material); with params.second a second wave,
 *                   the sum and the phasors
 *   in-two-sources  two coherent point sources: the field, the lines where waves add and cancel, the brightness at a probe
 *   in-coherence    temporal coherence (wave trains, coherence length of real sources) and spatial coherence (source size)
 *   in-young        Young's double slit: pattern, spacing, single-slit envelope, white-light fringes
 *   in-thin-film    a soap, oil or air film: the two reflections, the spectrum and the colour it makes
 *   in-wedge        fringes of equal thickness: an air wedge and Newton's rings, in one colour and in white light
 *   in-michelson    the Michelson interferometer: moving the mirror, counting fringes, a gas cell
 *   in-fabry-perot  the Fabry–Perot interferometer: many reflections, Airy peaks, finesse and free spectral range
 *   in-mach-zehnder the Mach–Zehnder interferometer and the Sagnac ring (rotation)
 *   in-fringe-test  reading the fringes of a flatness or power test
 *   in-speckle      laser speckle: its statistics, its size, and how averaging removes it
 * The numbers come from kit.optics, the drawing from kit.osym; the speckle simulation has a small FFT of its own.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, R2D = 180 / PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const T_ANIM = 2.5;                       // seconds of animation per cycle of the wave: real light is about 10^15 times faster

  /* a picture painted pixel by pixel on a small hidden canvas and stretched over a rectangle (smooth and cheap):
     fn(u, v) with u, v in 0…1 returns [r, g, b] (0…255) */
  function makeBlit() {
    let cv = null, g = null, img = null, w0 = 0, h0 = 0;
    return function (c, x, y, w, h, nx, ny, fn) {
      if (!(w > 0 && h > 0)) return;
      if (!cv || w0 !== nx || h0 !== ny) { cv = document.createElement('canvas'); cv.width = nx; cv.height = ny; g = cv.getContext('2d'); img = g.createImageData(nx, ny); w0 = nx; h0 = ny; }
      const d = img.data;
      let k = 0;
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const p = fn((i + 0.5) / nx, (j + 0.5) / ny);
        d[k++] = p[0]; d[k++] = p[1]; d[k++] = p[2]; d[k++] = 255;
      }
      g.putImageData(img, 0, 0);
      c.save(); c.imageSmoothingEnabled = true; c.drawImage(cv, x, y, w, h); c.restore();
    };
  }
  const shade = (rgb, b) => [rgb[0] * b, rgb[1] * b, rgb[2] * b];

  /* ================================================================ a light wave, and two of them added */
  Hyper.sim('in-waves', {
    title: 'A light wave — and two of them added',
    blurb: `A light wave drawn as the electric field along a line, moving to the right. The picture is **in slow motion**: real light oscillates about 10¹⁵ times faster. The horizontal scale is true (the picture is 4 µm wide). In the single-wave version the lower strip shows what a detector would report; in the two-wave version the arrows on the left are the **phasors**.

**Try this (one wave)**
- Slide the wavelength from violet to red: the waves lengthen, and the frequency and period in the read-out change with them.
- Double the amplitude: the intensity read-out goes up by four. The strip underneath shows the field squared flickering at twice the light frequency; the detector reports only its average.
- Choose *glass*: at the boundary the wavelength shrinks to λ/n but the wave keeps its frequency. The crests are squeezed together.

**Try this (two waves)**
- Set the path difference to 0, then to ½ λ: crests on crests double the field, crests on troughs cancel it. At ¼ λ the arrows are at right angles and the intensities simply add.
- Make the amplitudes unequal: even at ½ λ the sum cannot reach zero.
- Choose *a different wavelength*: the sum swells and fades along the line — a beat — and no steady pattern forms.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const two = !!params.second;
      const st = kit.stage(box.stage, { aspect: two ? 0.74 : 0.62, minH: two ? 380 : 320 });
      const defs = [{ id: 'nm', label: 'Wavelength (in a vacuum)', min: 400, max: 700, step: 5, value: 550, unit: 'nm' }];
      if (!two) {
        defs.push({ id: 'amp', label: 'Amplitude E₀ (relative)', min: 0.2, max: 2, step: 0.05, value: 1 });
        defs.push({ id: 'phi', label: 'Starting phase φ', min: 0, max: 360, step: 5, value: 0, unit: '°' });
        defs.push({ id: 'medium', type: 'select', label: 'The right-hand part is', options: [['a vacuum (n = 1)', 'vacuum'], ['water', 'water'], ['glass, N-BK7', 'N-BK7'], ['diamond', 'diamond']], value: 'vacuum' });
      } else {
        defs.push({ id: 'amp2', label: 'Amplitude of wave 2 (wave 1 = 1)', min: 0.1, max: 1.5, step: 0.05, value: 1 });
        defs.push({ id: 'opd', label: 'Path difference of wave 2', min: 0, max: 2, step: 0.01, value: 0.25, unit: 'λ' });
        defs.push({ id: 'kind', type: 'select', label: 'Wave 2 is', options: [['the same colour', 'same'], ['a different wavelength (beats)', 'beat']], value: 'same' });
      }
      defs.push({ id: 'run', type: 'check', label: 'Run the animation', value: true });
      const ctl = kit.controls(box.side, defs, id => { if (id === 'run') sync(); else if (!V.run) loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, two
        ? [['phi', 'Phase difference'], ['opd', 'Optical path difference'], ['A', 'Amplitude of the sum'], ['I', 'Intensity of the sum (wave 1 alone = 1)'], ['term', 'Interference term 2√(I₁I₂) cos φ']]
        : [['f', 'Frequency'], ['T', 'Period'], ['lam', 'Wavelength'], ['v', 'Speed of the wave'], ['I', 'Intensity (amplitude 1 = 1)']]);
      const sync = () => { if (V.run) loop.start(); else { loop.stop(); loop.once(); } };

      const drawOne = (c, C, t) => {
        const W = st.W, H = st.H, nm = V.nm, lamUm = nm / 1000, A = V.amp;
        const padL = 16, padR = 16, span = 4, pxUm = (W - padL - padR) / span, lamPx = lamUm * pxUm;
        const n = O.index(V.medium, nm), xb = padL + 0.45 * (W - padL - padR), xbUm = (xb - padL) / pxUm;
        const Hw = H * 0.62, yMid = Hw * 0.5 + 6, unit = Hw * 0.2;
        const phase = x => { const u = (x - padL) / pxUm; return TAU * (x < xb ? u : xbUm + n * (u - xbUm)) / lamUm; };
        const wt = TAU * t / T_ANIM, p0 = V.phi * D2R, cyc = (wt - p0) / TAU;
        const col = S.nm(nm), inMat = n > 1.0005;
        // the two regions
        if (inMat) { c.fillStyle = S.glass(Math.min(0.5, 0.36 * (n - 1))); c.fillRect(xb, 0, W - xb, Hw); }
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(xb, 0); c.lineTo(xb, Hw); c.stroke();
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(padL, yMid); c.lineTo(W - padR, yMid); c.stroke();
        kit.label(c, 'vacuum, n = 1', padL + 4, 13, { color: C.muted, size: 12 });
        kit.label(c, inMat ? 'material, n = ' + n.toFixed(3) : 'vacuum, n = 1', xb + 8, 13, { color: C.muted, size: 12 });
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(W - padR - pxUm, 13); c.lineTo(W - padR, 13); c.stroke();
        kit.label(c, '1 µm', W - padR - pxUm - 6, 13, { align: 'right', color: C.faint, size: 11 });
        // field vectors and the wave
        c.strokeStyle = S.nm(nm, 0.4); c.lineWidth = 1; c.beginPath();
        for (let x = padL; x <= W - padR; x += 12) { c.moveTo(x, yMid); c.lineTo(x, yMid - A * unit * Math.cos(phase(x) - wt + p0)); }
        c.stroke();
        c.strokeStyle = col; c.lineWidth = 2.8; c.lineJoin = 'round'; c.beginPath();
        for (let x = padL; x <= W - padR; x += 2) { const y = yMid - A * unit * Math.cos(phase(x) - wt + p0); x === padL ? c.moveTo(x, y) : c.lineTo(x, y); }
        c.stroke();
        // marks: the amplitude and one wavelength, in the vacuum and (if there is one) in the material
        const yDim = Hw - 10, yTop = yMid - A * unit;
        const m1 = Math.ceil(12 / lamPx - cyc), xc = padL + (m1 + cyc) * lamPx;
        c.save(); c.strokeStyle = C.faint; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(xc, yTop); c.lineTo(xc, yDim); c.moveTo(xc + lamPx, yTop); c.lineTo(xc + lamPx, yDim); c.stroke(); c.restore();
        S.dim(c, xc, yDim, xc + lamPx, yDim, 'λ = ' + nm.toFixed(0) + ' nm', { off: -9, size: 12 });
        S.dim(c, xc, yMid, xc, yTop, 'E₀', { off: 14, size: 12 });
        if (inMat) {
          const s0 = cyc - xbUm / lamUm, m2 = Math.ceil(12 * n / lamPx - s0), xr = xb + (m2 + s0) * lamPx / n, lr = lamPx / n;
          if (xr + lr < W - padR) {
            c.save(); c.strokeStyle = C.faint; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(xr, yTop); c.lineTo(xr, yDim); c.moveTo(xr + lr, yTop); c.lineTo(xr + lr, yDim); c.stroke(); c.restore();
            S.dim(c, xr, yDim, xr + lr, yDim, 'λ/n = ' + (nm / n).toFixed(0) + ' nm', { off: -9, size: 12 });
          }
        }
        // what a detector sees: E² at one point, and its average
        const y0 = Hw + 22, yb = H - 12, pxI = (yb - y0 - 16) / 4, xa = padL, xe = W - padR, pp = phase(padL + 10) + p0;
        kit.label(c, 'What a detector sees', padL, Hw + 12, { color: C.muted, size: 12, weight: 650 });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(xa, yb); c.lineTo(xe, yb); c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1.4; c.beginPath();
        for (let x = xa; x <= xe; x += 2) { const tt = t - 3 * T_ANIM + (x - xa) / (xe - xa) * 3 * T_ANIM, E = A * Math.cos(pp - TAU * tt / T_ANIM), y = yb - E * E * pxI; x === xa ? c.moveTo(x, y) : c.lineTo(x, y); }
        c.stroke();
        c.strokeStyle = col; c.lineWidth = 2.6; c.beginPath(); c.moveTo(xa, yb - A * A * pxI / 2); c.lineTo(xe, yb - A * A * pxI / 2); c.stroke();
        kit.label(c, 'E² at one point: flickers at twice the light frequency', xa + 150, Hw + 12, { color: C.faint, size: 11 });
        kit.label(c, 'its average A²/2 is the intensity', xe - 4, yb - A * A * pxI / 2 - 9, { align: 'right', color: C.text, size: 11.5, bg: C.bg2 });
        ro.set('f', (O.frequency(nm) / 1e12).toFixed(1) + ' THz');
        ro.set('T', (1e15 / O.frequency(nm)).toFixed(2) + ' fs');
        ro.set('lam', nm.toFixed(0) + ' nm in vacuum' + (inMat ? ', ' + (nm / n).toFixed(1) + ' nm in the material' : ''));
        ro.set('v', (O.c / 1e8).toFixed(3) + ' ×10⁸ m/s' + (inMat ? ', ' + (O.c / n / 1e8).toFixed(3) + ' ×10⁸ in the material' : ''));
        ro.set('I', (A * A).toFixed(2));
      };

      const drawTwo = (c, C, t) => {
        const W = st.W, H = st.H, nm = V.nm, lam1 = nm / 1000, beat = V.kind === 'beat', lam2 = beat ? lam1 * 0.85 : lam1;
        const A1 = 1, A2 = V.amp2, phi = TAU * V.opd, wt = TAU * t / T_ANIM;
        const x0 = W * 0.36, x1 = W - 14, span = 4, pxUm = (x1 - x0) / span;
        const rows = [H * 0.15, H * 0.4, H * 0.76], unit = H * 0.062;
        const f1 = x => A1 * Math.cos(TAU * ((x - x0) / pxUm) / lam1 - wt);
        const f2 = x => A2 * Math.cos(TAU * ((x - x0) / pxUm) / lam2 - wt * (lam1 / lam2) + phi);
        const names = ['wave 1', 'wave 2', 'sum'], cols = [C.series[0], C.series[1], C.text];
        for (let r = 0; r < 3; r++) {
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, rows[r]); c.lineTo(x1, rows[r]); c.stroke();
          kit.label(c, names[r], x0 - 8, rows[r], { align: 'right', color: cols[r], size: 12.5, weight: 650 });
          c.strokeStyle = cols[r]; c.lineWidth = r === 2 ? 3 : 2.2; c.lineJoin = 'round'; c.beginPath();
          for (let x = x0; x <= x1; x += 2) {
            const v = r === 0 ? f1(x) : r === 1 ? f2(x) : f1(x) + f2(x), y = rows[r] - v * unit;
            x === x0 ? c.moveTo(x, y) : c.lineTo(x, y);
          }
          c.stroke();
        }
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(x1 - pxUm, H - 12); c.lineTo(x1, H - 12); c.stroke();
        kit.label(c, '1 µm', x1 - pxUm - 6, H - 12, { align: 'right', color: C.faint, size: 11 });
        // phasors
        if (!beat) {
          const cx = W * 0.13, cy = H * 0.5, R0 = Math.min(W * 0.11, H * 0.28), aU = R0 / 2.5;
          const psi1 = PI / 2 - wt, psi2 = psi1 + phi;
          const v1 = [A1 * aU * Math.cos(psi1), A1 * aU * Math.sin(psi1)], v2 = [A2 * aU * Math.cos(psi2), A2 * aU * Math.sin(psi2)];
          kit.label(c, 'phasors', cx, cy - R0 - 22, { align: 'center', color: C.muted, size: 12, weight: 650 });
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, R0, 0, TAU); c.stroke();
          c.beginPath(); c.moveTo(cx - R0 - 6, cy); c.lineTo(cx + R0 + 6, cy); c.moveTo(cx, cy - R0 - 6); c.lineTo(cx, cy + R0 + 6); c.stroke();
          c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + v2[0], cy - v2[1]); c.lineTo(cx + v2[0] + v1[0], cy - v2[1] - v1[1]); c.stroke(); c.restore();
          kit.arrow(c, cx, cy, cx + v1[0], cy - v1[1], C.series[0], 2.6, 9);
          kit.arrow(c, cx + v1[0], cy - v1[1], cx + v1[0] + v2[0], cy - v1[1] - v2[1], C.series[1], 2.6, 9);
          kit.arrow(c, cx, cy, cx + v1[0] + v2[0], cy - v1[1] - v2[1], C.text, 3.2, 11);
          kit.dot(c, cx, cy, 3, C.muted);
          // the field now: the vertical part of each arrow, as dots on a line
          const lx = cx + R0 + 20;
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(lx, cy - R0); c.lineTo(lx, cy + R0); c.stroke();
          kit.dot(c, lx, cy - v1[1], 3.5, C.series[0]); kit.dot(c, lx, cy - v2[1], 3.5, C.series[1]); kit.dot(c, lx, cy - v1[1] - v2[1], 4.5, C.text);
          kit.label(c, 'dots: the fields now', cx + 8, cy + R0 + 22, { align: 'center', color: C.faint, size: 11 });
        } else {
          kit.label(c, 'two colours: the phase', W * 0.15, H * 0.46, { align: 'center', color: C.muted, size: 12 });
          kit.label(c, 'difference keeps changing,', W * 0.15, H * 0.46 + 16, { align: 'center', color: C.muted, size: 12 });
          kit.label(c, 'so there is no steady sum', W * 0.15, H * 0.46 + 32, { align: 'center', color: C.muted, size: 12 });
        }
        const I = O.diff.twoBeam(A1 * A1, A2 * A2, phi);
        if (!beat) {
          ro.set('phi', (V.opd * 360).toFixed(0) + '°  (acts as ' + ((V.opd * 360) % 360).toFixed(0) + '°)');
          ro.set('opd', (V.opd * nm).toFixed(0) + ' nm = ' + V.opd.toFixed(2) + ' λ');
          ro.set('A', Math.sqrt(I).toFixed(3) + '  (wave 1 = 1)');
          ro.set('I', I.toFixed(3));
          ro.set('term', (I - A1 * A1 - A2 * A2).toFixed(3));
        } else {
          const bl = lam1 * lam2 / (lam1 - lam2);
          ro.set('phi', 'keeps changing');
          ro.set('opd', 'not defined for two colours');
          ro.set('A', 'swells and fades every ' + bl.toFixed(1) + ' µm');
          ro.set('I', 'on average ' + (A1 * A1 + A2 * A2).toFixed(2) + ': the intensities add');
          ro.set('term', 'averages to 0');
        }
      };

      const loop = kit.loop((dt, t) => { const c = st.begin(), C = kit.colors(); if (two) drawTwo(c, C, t); else drawOne(c, C, t); }, box.stage);
      st.onResize(() => loop.once());
      sync();
    }
  });

  /* ================================================================ two coherent sources */
  Hyper.sim('in-two-sources', {
    title: 'Two sources: where the waves add and where they cancel',
    blurb: `Two narrow slits (or any two sources) emit waves in step. The picture is a true-scale view, 12 µm wide: the waves spread from each source and **cross**. Along some lines the crests of one wave always meet the crests of the other — **constructive**, bright; along others a crest always meets a trough — **destructive**, dark (grey in the moving picture, because the field there never moves). The plot shows the brightness at the probe against the path difference.

**Try this**
- Drag the **probe** P to a point on a solid white line: the path difference r₂ − r₁ is a whole number of wavelengths and the brightness is 4 (one wave alone = 1). On a dashed black line it is an odd number of half wavelengths and the brightness is zero.
- Move the sources farther apart: more lines appear, closer together. Make the wavelength longer: the lines spread out.
- Give source 2 a head start of 180°: bright and dark lines swap, and the central line becomes dark.
- Look at the *average* read-out: the pattern has places of zero and places four times brighter than one source, yet its average is exactly 2 — the sum of the two beams. The light has been moved, not lost.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, blit = makeBlit();
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: 550, unit: 'nm' },
        { id: 'd', label: 'Separation of the sources d', min: 0.8, max: 5, step: 0.05, value: 2.4, unit: 'µm' },
        { id: 'ph0', label: 'Source 2 runs ahead by', min: 0, max: 360, step: 5, value: 0, unit: '°' },
        { id: 'show', type: 'select', label: 'Show', options: [['the waves, moving', 'wave'], ['the brightness, averaged over time', 'avg']], value: 'wave' },
        { id: 'lines', type: 'check', label: 'Mark lines of constant path difference', value: true }
      ], id => { if (id === 'show') sync(); else loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r', 'Distances r₁ and r₂'], ['dp', 'Path difference r₂ − r₁'], ['ph', 'Phase difference'], ['I', 'Brightness at the probe (one source = 1)'], ['what', 'Result at the probe'], ['avg', 'Average over a whole fringe']]);
      const plot = kit.plot(box.side, { x: { label: 'path difference r₂ − r₁ (wavelengths)' }, y: { label: 'brightness', min: 0, max: 4.4 } }, 170);
      const WUM = 12, P = { x: 8.5, y: 0 };
      let plotSig = '';
      const geom = () => { const W = st.W, H = st.H, pxUm = W / WUM, xs = 0.07 * W; return { W, H, pxUm, xs, X: u => xs + u * pxUm, Y: u => H / 2 - u * pxUm }; };
      kit.drag(st, {
        hover: true,
        hit: p => { const g = geom(); return Math.hypot(p.x - g.X(P.x), p.y - g.Y(P.y)) < 16 ? 'P' : null; },
        move: (w, p) => { const g = geom(); P.x = clamp((p.x - g.xs) / g.pxUm, 0.5, (g.W - g.xs) / g.pxUm - 0.2); P.y = clamp((g.H / 2 - p.y) / g.pxUm, -g.H / g.pxUm / 2 + 0.2, g.H / g.pxUm / 2 - 0.2); loop.once(); }
      });
      const sync = () => { if (V.show === 'wave') loop.start(); else { loop.stop(); loop.once(); } };
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), g = geom(), W = g.W, H = g.H, xs = g.xs, pxUm = g.pxUm;
        const lam = V.nm / 1000, k = TAU / lam, cs = V.d / 2, ph0 = V.ph0 * D2R, wt = TAU * t / T_ANIM, rgb = O.colour.wavelength(V.nm);
        const wave = V.show === 'wave';
        // the field to the right of the slits
        const fw = W - xs, fx = Math.round(clamp(fw / 5, 40, 170)), fy = Math.round(clamp(H / 5, 30, 110)), regUm = fw / pxUm;
        blit(c, xs, 0, fw, H, fx, fy, (u, v) => {
          const x = u * regUm, y = (0.5 - v) * H / pxUm;
          const r1 = Math.hypot(x, y - cs), r2 = Math.hypot(x, y + cs), a1 = 1 / Math.sqrt(1 + r1), a2 = 1 / Math.sqrt(1 + r2), s = a1 + a2;
          if (wave) {
            const e = (a1 * Math.cos(k * r1 - wt) + a2 * Math.cos(k * r2 - wt + ph0)) / s;
            return shade(rgb, 0.1 + 0.9 * (0.5 + 0.5 * e));
          }
          const b = (a1 * a1 + a2 * a2 + 2 * a1 * a2 * Math.cos(k * (r2 - r1) + ph0)) / (s * s);
          return shade(rgb, 0.04 + 0.96 * Math.pow(clamp(b, 0, 1), 0.8));
        });
        // lines of constant path difference: hyperbolas with the two sources as foci
        if (V.lines) {
          const hyper = (D, dash) => {
            const a = Math.abs(D) / 2; if (a > cs - 1e-6) return;
            const b = Math.sqrt(Math.max(1e-12, cs * cs - a * a)), umax = Math.asinh(regUm / b), sg = D >= 0 ? 1 : -1;
            c.beginPath();
            for (let i = 0; i <= 40; i++) { const u = umax * i / 40, x = b * Math.sinh(u), y = sg * a * Math.cosh(u), px = xs + x * pxUm, py = H / 2 - y * pxUm; i ? c.lineTo(px, py) : c.moveTo(px, py); }
            c.setLineDash(dash || []); c.stroke();
          };
          c.save(); c.lineWidth = 1.2;
          for (let m = -14; m <= 14; m++) {
            c.strokeStyle = 'rgba(255,255,255,0.75)'; hyper((m - ph0 / TAU) * lam, null);
            c.strokeStyle = 'rgba(0,0,0,0.7)'; hyper((m + 0.5 - ph0 / TAU) * lam, [5, 4]);
          }
          c.restore();
        }
        // the slits and the plane wave arriving from the left
        const y1 = g.Y(cs), y2 = g.Y(-cs), cyc = wt / TAU, lamPx = lam * pxUm;
        S.wavefronts(c, 0, 0, lamPx * (1 - (cyc - Math.floor(cyc))), lamPx, Math.ceil(xs / lamPx) + 1, 0, 0, { nm: V.nm, alpha: 0.8, width: 1.3, plane: { x: xs, y: H / 2, dir: PI, width: H } });
        S.slits(c, xs, H / 2, H / 2, [[y1 - 3, y1 + 3], [y2 - 3, y2 + 3]], { w: 5, color: C.text });
        kit.label(c, 'S₁', xs - 10, y1, { align: 'right', color: C.muted, size: 12 });
        kit.label(c, 'S₂', xs - 10, y2, { align: 'right', color: C.muted, size: 12 });
        // the probe
        const px = g.X(P.x), py = g.Y(P.y);
        const r1 = Math.hypot(P.x, P.y - cs), r2 = Math.hypot(P.x, P.y + cs), dp = r2 - r1, phi = k * dp + ph0, I = O.diff.twoBeam(1, 1, phi);
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(xs, y1); c.lineTo(px, py); c.moveTo(xs, y2); c.lineTo(px, py); c.stroke(); c.restore();
        c.fillStyle = C.bg2; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.arc(px, py, 7, 0, TAU); c.fill(); c.stroke();
        kit.label(c, 'P', px + 11, py - 11, { color: '#fff', size: 13, weight: 700, bg: 'rgba(0,0,0,0.45)' });
        kit.label(c, 'r₁ = ' + r1.toFixed(2) + ' µm', (xs + px) / 2, (y1 + py) / 2 - 10, { align: 'center', color: '#fff', size: 11, bg: 'rgba(0,0,0,0.4)' });
        kit.label(c, 'r₂ = ' + r2.toFixed(2) + ' µm', (xs + px) / 2, (y2 + py) / 2 + 14, { align: 'center', color: '#fff', size: 11, bg: 'rgba(0,0,0,0.4)' });
        kit.label(c, 'the picture is ' + WUM + ' µm wide', W - 8, H - 10, { align: 'right', color: '#fff', size: 11, bg: 'rgba(0,0,0,0.4)' });
        // readouts and plot
        const ph = ((phi * R2D) % 360 + 360) % 360, cy2 = phi / TAU, nearInt = Math.abs(cy2 - Math.round(cy2)), nearHalf = Math.abs(cy2 - Math.floor(cy2) - 0.5);
        let mean = 0; for (let i = 0; i < 64; i++) mean += O.diff.twoBeam(1, 1, TAU * i / 64) / 64;
        ro.set('r', r1.toFixed(2) + ' µm and ' + r2.toFixed(2) + ' µm');
        ro.set('dp', (dp * 1000).toFixed(0) + ' nm = ' + (dp / lam).toFixed(2) + ' λ');
        ro.set('ph', ph.toFixed(0) + '°  (' + (phi * R2D).toFixed(0) + '° in all)');
        ro.set('I', I.toFixed(2));
        ro.set('what', nearInt < 0.04 ? 'constructive: in step' : nearHalf < 0.04 ? 'destructive: cancelled' : 'in between');
        ro.set('avg', mean.toFixed(2) + ' = 1 + 1: nothing is lost');
        const L = Math.max(2, Math.ceil(V.d / lam)), sig = [V.nm, V.d, V.ph0, P.x.toFixed(3), P.y.toFixed(3)].join('|');
        if (sig !== plotSig) {
          plotSig = sig;
          const pts = []; for (let i = 0; i <= 12 * L; i++) { const x = -L + 2 * L * i / (12 * L); pts.push([x, O.diff.twoBeam(1, 1, TAU * x + ph0)]); }
          plot.set({ series: [{ pts, color: C.series[0], width: 2, label: 'brightness' }], x: { label: 'path difference r₂ − r₁ (wavelengths)', min: -L, max: L }, y: { label: 'brightness', min: 0, max: 4.4 }, hlines: [{ y: 2, label: 'average = 2' }], marks: [{ x: clamp(dp / lam, -L, L), y: I, label: 'P', color: C.warn }] });
        }
      }, box.stage);
      st.onResize(() => loop.once());
      sync();
    }
  });

  const fmtLen = m => { const a = Math.abs(m); return a >= 1000 ? (m / 1000).toFixed(0) + ' km' : a >= 1 ? m.toFixed(a >= 10 ? 0 : 2) + ' m' : a >= 1e-3 ? (m * 1e3).toFixed(a >= 0.1 ? 0 : 2) + ' mm' : a >= 1e-6 ? (m * 1e6).toFixed(a >= 1e-4 ? 0 : 1) + ' µm' : (m * 1e9).toFixed(1) + ' nm'; };

  /* ================================================================ coherence */
  Hyper.sim('in-coherence', {
    title: 'Coherence: how long and how wide light stays in step',
    blurb: `**Temporal coherence.** Every source emits wave trains of a finite length, about λ²/Δλ. A beam splitter delays a copy of each train by the path difference; the fringes exist only where a train overlaps its own copy. Choose a source and slide the delay: the sum of the two trains is a clear fringe pattern where they overlap and nothing where they do not.

**Spatial coherence.** An extended source is a crowd of independent points; each throws its own fringes on the screen, shifted by an amount that depends on where it sits, and the fringes wash out when the shifts spread over a whole fringe. Make the source wider, or the slits farther apart, or the source nearer.

**Try this**
- Temporal: pick the *white LED* and slide the path difference: the fringes die at about 3 µm. Pick the *single-frequency laser*: you can hardly tell.
- Temporal: the long trains of the lasers are drawn with only 14 waves; the real number is given in the read-out.
- Spatial: with b = 0.4 mm, d = 0.25 mm and L = 0.5 m the fringes have a visibility of 0.80. Narrow the source to 0.1 mm and they are almost perfect (0.99); widen it to the first zero, b = λL/d = 1.1 mm, and they vanish.
- Spatial: beyond the first zero the fringes come back faintly with the contrast reversed (bright where dark was), a known effect.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360 });
      const SRC = {
        sun: { nm: 550, dl: 300 }, led: { nm: 550, dl: 100 }, green: { nm: 525, dl: 30 }, filt: { nm: 546, dl: 1 },
        hene: { nm: 632.8, dl: 0.002 }, single: { nm: 632.8, dl: Math.pow(632.8e-9, 2) * 1e6 / O.c * 1e9 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Kind of coherence', options: [['Temporal: how long the wave stays in step', 'temporal'], ['Spatial: how wide the source may be', 'spatial']], value: params.kind || 'temporal' },
        { id: 'src', type: 'select', label: 'Light source', options: [['Sunlight or a lamp filament (≈ 300 nm wide)', 'sun'], ['White LED (≈ 100 nm)', 'led'], ['Green LED (≈ 30 nm)', 'green'], ['A lamp line behind a 1 nm filter', 'filt'], ['He–Ne laser, several modes (0.002 nm)', 'hene'], ['Single-frequency laser (1 MHz)', 'single']], value: 'led' },
        { id: 's', label: 'Path difference ÷ coherence length', min: 0, max: 2, step: 0.01, value: 0.3 },
        { id: 'b', label: 'Width of the source b', min: 0.01, max: 3, value: 0.4, log: true, sig: 2, unit: 'mm' },
        { id: 'd', label: 'Slit separation d', min: 0.05, max: 1, value: 0.25, log: true, sig: 2, unit: 'mm' },
        { id: 'L', label: 'Distance from source to slits L', min: 0.1, max: 3, step: 0.05, value: 0.5, unit: 'm' },
        { id: 'nm', label: 'Wavelength', min: 450, max: 650, step: 5, value: 550, unit: 'nm' }
      ], id => { if (id === 'kind') mode(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lc', 'Coherence length λ²/Δλ'], ['opd', 'Path difference'], ['Vt', 'Fringe visibility'], ['w', 'Coherence width at the slits λL/b'], ['dd', 'Slit separation d'], ['Vs', 'Visibility |sinc(π b d / λL)|'], ['Vm', 'Visibility measured on the pattern']]);
      const plot = kit.plot(box.side, { x: { label: 'path difference ÷ coherence length', min: 0, max: 2 }, y: { label: 'visibility', min: 0, max: 1.05 } }, 160);
      const mode = () => {
        const t = V.kind === 'temporal';
        ['src', 's'].forEach(id => ctl.show(id, t)); ['b', 'd', 'L', 'nm'].forEach(id => ctl.show(id, !t));
        ['lc', 'opd', 'Vt'].forEach(k => ro.show(k, t)); ['w', 'dd', 'Vs', 'Vm'].forEach(k => ro.show(k, !t));
      };
      let plotSig = '';
      const setPlot = (sig, fn, xmax, xlabel, mark) => {
        if (sig === plotSig) return; plotSig = sig;
        const pts = []; for (let i = 0; i <= 120; i++) { const x = xmax * i / 120; pts.push([x, fn(x)]); }
        plot.set({ series: [{ pts, color: kit.colors().series[0], width: 2 }], x: { label: xlabel, min: 0, max: xmax }, y: { label: 'visibility', min: 0, max: 1.05 }, marks: [mark] });
      };

      const drawT = (c, C, W, H) => {
        const sd = SRC[V.src], nm = sd.nm, Lc = O.diff.coherenceLength(nm, sd.dl), nc = Lc / (nm * 1e-9), cyc = Math.min(nc, 14);
        const s = V.s, Vt = Math.exp(-3.559 * s * s);
        const pxLc = 0.3 * W, xA = 0.2 * W, xB = xA + s * pxLc, lamPx = pxLc / cyc, amp = 0.05 * H, rows = [0.13 * H, 0.37 * H, 0.66 * H];
        const env = u => Math.exp(-u * u / 0.1405), col = S.nm(nm);
        const trace = (row, f, x0, x1, color, lw) => { c.strokeStyle = color; c.lineWidth = lw; c.lineJoin = 'round'; c.beginPath(); for (let x = x0; x <= x1; x += 1.5) { const y = row - amp * f(x); x === x0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); };
        const fA = x => env((x - xA) / pxLc) * Math.cos(TAU * (x - xA) / lamPx), fB = x => env((x - xB) / pxLc) * Math.cos(TAU * (x - xB) / lamPx);
        const xl = xA - 0.62 * pxLc, xr = xB + 0.62 * pxLc;
        // where the two trains overlap
        const o0 = xB - 0.5 * pxLc, o1 = xA + 0.5 * pxLc;
        if (o1 > o0) { c.save(); c.globalAlpha = 0.12; c.fillStyle = C.accent; c.fillRect(o0, rows[0] - 1.6 * amp, o1 - o0, rows[2] - rows[0] + 3.2 * amp); c.restore(); }
        for (const r of rows) { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(8, r); c.lineTo(W - 8, r); c.stroke(); }
        trace(rows[0], fA, xl, xA + 0.62 * pxLc, col, 2.2);
        trace(rows[1], fB, xB - 0.62 * pxLc, xr, col, 2.2);
        trace(rows[2], x => fA(x) + fB(x), xl, xr, C.text, 2.6);
        kit.label(c, 'a wave train from the source', 10, rows[0] - 1.5 * amp - 4, { color: C.muted, size: 12 });
        kit.label(c, 'the same train, delayed by the path difference', 10, rows[1] - 1.5 * amp - 4, { color: C.muted, size: 12 });
        kit.label(c, 'the sum: fringes only where the trains overlap', 10, rows[2] - 2.1 * amp - 4, { color: C.muted, size: 12 });
        S.dim(c, xA - 0.5 * pxLc, rows[0] + 1.2 * amp, xA + 0.5 * pxLc, rows[0] + 1.2 * amp, 'L_c ≈ ' + fmtLen(Lc), { off: 12, size: 12 });
        if (s > 0.05) S.dim(c, xA, rows[1] + 1.2 * amp, xB, rows[1] + 1.2 * amp, 'path difference ' + fmtLen(s * Lc), { off: 12, size: 12 });
        if (nc > 14) kit.label(c, 'drawn with 14 waves; the real train has ' + (nc > 1e5 ? nc.toExponential(1) : Math.round(nc).toLocaleString('en-GB')) + ' waves', W - 10, rows[0] - 1.5 * amp - 4, { align: 'right', color: C.faint, size: 11.5 });
        // the fringes seen when the path difference is varied by a few wavelengths
        const fy = 0.855 * H, fh = 0.08 * H, fx = 0.06 * W, fw = 0.88 * W;
        kit.label(c, 'fringes over 6 wavelengths of path: visibility V = ' + Vt.toFixed(2), fx, fy - 10, { color: C.text, size: 12.5, weight: 650 });
        S.fringes(c, fx, fy, fw, fh, u => O.diff.twoBeam(1, 1, TAU * 6 * u, Vt) / 4, { nm, gamma: 1 });
        ro.set('lc', fmtLen(Lc) + '  (' + (nc > 1e5 ? nc.toExponential(1) : Math.round(nc).toLocaleString('en-GB')) + ' waves)');
        ro.set('opd', fmtLen(s * Lc) + '  (' + s.toFixed(2) + ' L_c)');
        ro.set('Vt', Vt.toFixed(3));
        setPlot('t', x => Math.exp(-3.559 * x * x), 2, 'path difference ÷ coherence length', { x: s, y: Vt, label: 'now', color: C.warn });
        plot.set({ marks: [{ x: s, y: Vt, label: 'now', color: C.warn }] });
      };

      const drawS = (c, C, W, H) => {
        const nm = V.nm, lam = nm * 1e-9, b = V.b * 1e-3, d = V.d * 1e-3, L = V.L, w = lam * L / b, xx = b * d / (lam * L);
        const Vth = Math.abs(O.sinc(PI * xx));
        const N = 33, pat = xp => { let sum = 0; for (let j = 0; j < N; j++) sum += O.diff.twoBeam(1, 1, TAU * xp + TAU * xx * (j / (N - 1) - 0.5)) / 4; return sum / N; };
        let imax = 0, imin = 1; for (let i = 0; i < 64; i++) { const v = pat(i / 64); imax = Math.max(imax, v); imin = Math.min(imin, v); }
        const Vm = O.diff.visibility(imax, imin), col = S.nm(nm);
        // the set-up: source, slits, the coherent patch
        const cy = 0.29 * H, tP = 50, xsrc = 0.1 * W, xsl = 0.62 * W;
        const bpx = clamp(V.b * tP, 2.5, 0.5 * H), dpx = clamp(V.d * tP, 8, 0.4 * H);
        c.fillStyle = C.warn; c.fillRect(xsrc - 3, cy - bpx / 2, 6, bpx);
        kit.label(c, 'source, width b = ' + V.b.toPrecision(2) + ' mm', xsrc, cy - bpx / 2 - 12, { align: 'center', color: C.muted, size: 12 });
        S.slits(c, xsl, cy, 0.27 * H, [[cy - dpx / 2 - 3, cy - dpx / 2 + 3], [cy + dpx / 2 - 3, cy + dpx / 2 + 3]], { w: 5, color: C.text });
        kit.label(c, 'slits, d = ' + V.d.toPrecision(2) + ' mm', xsl, cy - 0.27 * H - 10, { align: 'center', color: C.muted, size: 12 });
        for (const f of [-0.5, 0, 0.5]) for (const sgn of [-1, 1]) S.ray(c, [[xsrc, cy + f * bpx], [xsl, cy + sgn * dpx / 2]], { nm, width: 1, alpha: 0.5, arrows: false });
        S.dim(c, xsrc, cy + 0.285 * H, xsl, cy + 0.285 * H, 'L = ' + L.toFixed(2) + ' m (not to scale)', { off: 12, size: 12 });
        const wpx = w * 1e3 * tP, half = 0.27 * H, clipped = wpx / 2 > half, hp = Math.min(wpx / 2, half);
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(xsl + 22, cy - hp); c.lineTo(xsl + 22, cy + hp); c.moveTo(xsl + 16, cy - hp); c.lineTo(xsl + 28, cy - hp); c.moveTo(xsl + 16, cy + hp); c.lineTo(xsl + 28, cy + hp); c.stroke();
        kit.label(c, 'coherent patch  w = ' + fmtLen(w) + (clipped ? '  (off the scale)' : ''), xsl + 36, cy, { color: C.ok, size: 12, weight: 650 });
        kit.label(c, w >= d ? 'both slits inside it: fringes' : 'slits farther apart than w: washed out', xsl + 36, cy + 16, { color: C.muted, size: 11.5 });
        // the pattern
        const px0 = 0.06 * W, pw = 0.88 * W, base = 0.84 * H, hh = 0.2 * H;
        kit.label(c, 'what the screen shows (6 fringes): visibility V = ' + Vm.toFixed(2), px0, 0.6 * H, { color: C.text, size: 12.5, weight: 650 });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(px0, base); c.lineTo(px0 + pw, base); c.stroke();
        c.strokeStyle = col; c.lineWidth = 2.2; c.beginPath(); for (let i = 0; i <= 240; i++) { const y = base - hh * pat(6 * i / 240), x = px0 + pw * i / 240; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
        S.fringes(c, px0, 0.87 * H, pw, 0.09 * H, u => pat(6 * u), { nm, gamma: 1 });
        ro.set('w', fmtLen(w));
        ro.set('dd', fmtLen(d) + (w >= d ? '  (inside the patch)' : '  (outside the patch)'));
        ro.set('Vs', Vth.toFixed(3));
        ro.set('Vm', Vm.toFixed(3));
        setPlot('s', x => Math.abs(O.sinc(PI * x)), 3, 'source width ÷ (λL/d)', { x: clamp(xx, 0, 3), y: Vth, label: 'now', color: C.warn });
        plot.set({ marks: [{ x: clamp(xx, 0, 3), y: Vth, label: 'now', color: C.warn }] });
      };

      const loop = kit.loop(() => { const c = st.begin(), C = kit.colors(); if (V.kind === 'temporal') drawT(c, C, st.W, st.H); else drawS(c, C, st.W, st.H); }, box.stage);
      st.onResize(() => loop.once());
      mode();
      loop.once();
    }
  });

  /* ================================================================ Young's double slit */
  Hyper.sim('in-young', {
    title: 'Young\'s double slit',
    blurb: `Light of one wavelength passes two narrow slits and falls on a screen 2 m away (the set-up is drawn schematically; the screen strip and the graph are to scale, ±30 mm). The bright fringes are where the path difference is a whole number of wavelengths, at **y = mλL/d**; the lines drawn from the slits to the strip show the first few.

**Try this**
- Move the slits apart (d): the fringes crowd together. Make them closer: the pattern spreads out.
- Change the wavelength from violet to red: the spacing grows in proportion to λ.
- Widen the slits (a): the dashed envelope narrows and fewer fringes are bright. Set a so that d/a is a whole number and an order disappears under an envelope zero.
- Tick *white light*: the central fringe is white, the others are coloured, and after two or three orders the colours blur into pastel. The graph shows the single colour chosen above.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour, blit = makeBlit();
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: 550, unit: 'nm' },
        { id: 'd', label: 'Slit separation d', min: 0.05, max: 1, value: 0.25, log: true, sig: 2, unit: 'mm' },
        { id: 'a', label: 'Slit width a', min: 5, max: 100, step: 1, value: 40, unit: 'µm' },
        { id: 'L', label: 'Distance to the screen L', min: 0.5, max: 5, step: 0.1, value: 2, unit: 'm' },
        { id: 'white', type: 'check', label: 'White light (colours of the screen strip)', value: !!params.white }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dy', 'Fringe spacing λL/d'], ['z', 'First zero of the envelope λL/a'], ['n', 'Bright fringes in the central lobe'], ['m1', 'Path difference at the first bright fringe']]);
      const plot = kit.plot(box.side, { x: { label: 'height on the screen (mm)', min: -30, max: 30 }, y: { label: 'relative intensity', min: 0, max: 1.05 } }, 170);
      // white light: spectral weights
      const LAM = []; for (let nm = 400; nm <= 700; nm += 10) LAM.push(nm);
      const cmf = LAM.map(nm => Cl.cmf(nm)), ill = O.photo.spectrum('daylight'), IL = LAM.map(nm => ill(nm));
      let Xw = 0, Yw = 0, Zw = 0; LAM.forEach((nm, i) => { Xw += IL[i] * cmf[i][0]; Yw += IL[i] * cmf[i][1]; Zw += IL[i] * cmf[i][2]; });
      const wlin = Cl.toRgb([Xw / Yw, 1, Zw / Yw]);
      const whiteAt = (a, d, L, y) => {
        const th = Math.atan(y / L); let X = 0, Y = 0, Z = 0;
        LAM.forEach((nm, i) => { const I = O.diff.doubleSlit(a, d, nm, th) * IL[i]; X += I * cmf[i][0]; Y += I * cmf[i][1]; Z += I * cmf[i][2]; });
        const lin = Cl.toRgb([X / Yw, Y / Yw, Z / Yw]).map((v, k) => v / wlin[k]);
        return Cl.srgb(lin);
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, nm = V.nm, d = V.d * 1e-3, a = V.a * 1e-6, L = V.L, Y0 = H / 2;
        const half = 30e-3, yScr = 0.43 * H, ypx = y => Y0 - y / half * yScr, xl = 0.05 * W, xsl = 0.15 * W, xsc = 0.7 * W, wsc = 0.1 * W;
        const dy = O.diff.fringeSpacing(nm, d, L), rgb = Cl.wavelength(nm);
        // the screen strip, to scale
        const mono = y => Math.pow(clamp(O.diff.doubleSlit(a, d, nm, Math.atan(y / L)), 0, 1), 0.6);
        blit(c, xsc, Y0 - yScr, wsc, 2 * yScr, 2, 240, (u, v) => {
          const y = (0.5 - v) * 2 * half;
          if (V.white) return whiteAt(a, d, L, y);
          return shade(rgb, mono(y));
        });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(xsc, Y0 - yScr, wsc, 2 * yScr);
        kit.label(c, 'screen', xsc + wsc / 2, Y0 - yScr - 10, { align: 'center', color: C.muted, size: 12 });
        // the set-up, schematic
        S.source(c, xl, Y0, { kind: 'laser', color: S.nm(nm), size: 10, dir: 0 });
        S.ray(c, [[xl + 4, Y0], [xsl, Y0]], { nm, width: 2, arrows: true, minArrow: 20 });
        const gp = clamp(Math.log(V.d / 0.05) / Math.log(20) * 46 + 14, 14, 62);
        S.slits(c, xsl, Y0, 0.4 * H, [[Y0 - gp / 2 - 3, Y0 - gp / 2 + 3], [Y0 + gp / 2 - 3, Y0 + gp / 2 + 3]], { w: 5, color: C.text });
        kit.label(c, 'two slits', xsl, Y0 - 0.4 * H - 10, { align: 'center', color: C.muted, size: 12 });
        S.dim(c, xsl + 14, Y0 - gp / 2, xsl + 14, Y0 + gp / 2, 'd', { off: -10 });
        let nShown = 0;
        for (let m = -4; m <= 4; m++) {
          const y = m * dy; if (Math.abs(y) > half) continue;
          S.ray(c, [[xsl, Y0], [xsc, ypx(y)]], { nm, width: 1, alpha: 0.5, arrows: false });
          if (Math.abs(m) <= 3) kit.label(c, 'm = ' + m, xsc + wsc + 8, ypx(y), { color: C.muted, size: 11 });
          nShown++;
        }
        S.dim(c, xsl + 4, Y0 + 0.4 * H + 6, xsc, Y0 + 0.4 * H + 6, 'L = ' + L.toFixed(1) + ' m (not to scale)', { off: 12, size: 12 });
        // the intensity graph
        const p1 = [], p2 = [];
        for (let i = 0; i <= 300; i++) { const y = -30 + 60 * i / 300, th = Math.atan(y * 1e-3 / L); p1.push([y, O.diff.doubleSlit(a, d, nm, th)]); p2.push([y, O.diff.singleSlit(a, nm, th)]); }
        plot.set({ series: [{ pts: p1, color: C.series[0], width: 1.8, label: 'double slit' }, { pts: p2, color: C.faint, width: 1.4, dash: true, label: 'envelope of one slit' }], x: { label: 'height on the screen (mm), light of ' + nm + ' nm', min: -30, max: 30 }, y: { label: 'relative intensity', min: 0, max: 1.05 } });
        const sz = nm * 1e-9 / a;
        ro.set('dy', (dy * 1e3).toFixed(2) + ' mm');
        ro.set('z', sz < 1 ? (L * Math.tan(Math.asin(sz)) * 1e3).toFixed(1) + ' mm' : 'none: the envelope never vanishes');
        ro.set('n', String(2 * Math.ceil(d / a) - 1) + '  (d/a = ' + (d / a).toFixed(1) + ')');
        ro.set('m1', nm.toFixed(0) + ' nm = 1 λ, at ' + (dy * 1e3).toFixed(2) + ' mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a thin film */
  Hyper.sim('in-thin-film', {
    title: 'A thin film: two reflections and the colour they make',
    blurb: `A film of transparent material between two media. Ray 1 is reflected from the top surface; ray 2 enters, reflects from the bottom and comes back out. They interfere; the swatch on the right is the colour of the reflected daylight (computed from the full thin-film calculation and the eye's colour response), and the graph is the reflectance at every wavelength. The cross-section is not to scale.

**Try this**
- Soap film: slide the thickness from 0. It starts black (the half-wave jump), turns silver, yellow, purple, blue, green … and the colours get paler above about 1 µm. The strip under the swatch shows the whole sequence from 0 to 1.5 µm.
- Increase the angle of view: every colour moves towards the blue as 2nt cos θₜ shrinks.
- Choose the *MgF₂ coating*: both reflections jump, so the reflection is **least** near 99 nm for green light — the quarter-wave coating. It never goes black, since the two reflections are weak and unequal.
- Choose *one colour*: the film turns bright and dark as the thickness grows, each cycle being λ/(2n).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 380 });
      const FILMS = {
        soap: { name: 'Soap film in air', n0: 1, n: 1.33, ns: 1, sub: 'air' },
        oil: { name: 'Oil film on water', n0: 1, n: 1.47, ns: 'water', sub: 'water' },
        mgf2: { name: 'MgF₂ coating on glass', n0: 1, n: O.film.COATING_MATERIALS.MgF2.n, ns: 'N-BK7', sub: 'glass' },
        gap: { name: 'Air gap between glass plates', n0: 'N-BK7', n: 1, ns: 'N-BK7', sub: 'glass' }
      };
      const ctl = kit.controls(box.side, [
        { id: 'film', type: 'select', label: 'The film', options: Object.keys(FILMS).map(k => [FILMS[k].name, k]), value: params.film || 'soap' },
        { id: 't', label: 'Thickness t', min: 0, max: 1500, step: 5, value: params.t || 300, unit: 'nm' },
        { id: 'th', label: 'Angle of incidence', min: 0, max: 80, step: 1, value: 0, unit: '°' },
        { id: 'light', type: 'select', label: 'Light', options: [['white (daylight)', 'white'], ['blue, 450 nm', 450], ['green, 550 nm', 550], ['red, 650 nm', 650]], value: 'white' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['opd', 'Path difference 2nt cos θₜ'], ['jump', 'Half-wave jumps (top · bottom)'], ['net', 'Net'], ['bright', 'Reinforced in the visible'], ['R', 'Reflectance at 550 nm']]);
      const plot = kit.plot(box.side, { x: { label: 'wavelength (nm)', min: 380, max: 780 }, y: { label: 'reflectance (%)' } }, 170);
      // spectral weights for colour
      const LAM = []; for (let nm = 400; nm <= 700; nm += 10) LAM.push(nm);
      const cmf = LAM.map(nm => Cl.cmf(nm)), ill = O.photo.spectrum('daylight'), IL = LAM.map(nm => ill(nm));
      let Xw = 0, Yw = 0, Zw = 0; LAM.forEach((nm, i) => { Xw += IL[i] * cmf[i][0]; Yw += IL[i] * cmf[i][1]; Zw += IL[i] * cmf[i][2]; });
      const wlin = Cl.toRgb([Xw / Yw, 1, Zw / Yw]);
      const defOf = (f, t) => ({ n0: f.n0, ns: f.ns, layers: [{ n: f.n, d: Math.max(0, t) }] });
      const colourOf = (def, th) => {
        let X = 0, Y = 0, Z = 0;
        LAM.forEach((nm, i) => { const R = O.film.stack(def, nm, th).R * IL[i]; X += R * cmf[i][0]; Y += R * cmf[i][1]; Z += R * cmf[i][2]; });
        const lin = Cl.toRgb([X / Yw, Y / Yw, Z / Yw]).map((v, k) => 4.5 * v / wlin[k]);
        return Cl.srgb(Cl.fit(lin));
      };
      let cacheKey = '', cache = [];
      const NCOL = 150;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, f = FILMS[V.film], th = V.th * D2R, t = V.t;
        const n0 = O.index(f.n0, 550), ns = O.index(f.ns, 550), nf = f.n;
        const tt = O.snell(n0, nf, th), ok = Number.isFinite(tt);
        const mono = typeof V.light === 'number';
        // ---- the cross-section (not to scale)
        const x0 = 0.04 * W, x1 = 0.58 * W, yTop = 0.34 * H, tpx = 16 + 62 * t / 1500, yBot = yTop + tpx;
        c.fillStyle = S.glass(n0 > 1.2 ? 0.18 : 0.03); c.fillRect(x0, 0.06 * H, x1 - x0, yTop - 0.06 * H);
        c.fillStyle = S.glass(0.34); c.fillRect(x0, yTop, x1 - x0, tpx);
        c.fillStyle = S.glass(ns > 1.2 ? 0.18 : (f.sub === 'water' ? 0.1 : 0.03)); c.fillRect(x0, yBot, x1 - x0, 0.78 * H - yBot);
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0, yTop); c.lineTo(x1, yTop); c.moveTo(x0, yBot); c.lineTo(x1, yBot); c.stroke();
        kit.label(c, 'above: n = ' + n0.toFixed(2), x0 + 6, 0.06 * H + 12, { color: C.muted, size: 12 });
        kit.label(c, 'film: n = ' + nf.toFixed(2) + (nf === 1 ? ' (air)' : ''), x0 + 6, yTop + tpx / 2, { color: C.text, size: 12, weight: 650 });
        kit.label(c, 'below: n = ' + ns.toFixed(2) + (f.sub === 'air' ? ' (air)' : ''), x0 + 6, 0.78 * H - 12, { color: C.muted, size: 12 });
        const xi = 0.24 * W, Lr = 0.17 * H, nmRay = mono ? V.light : 570, rc = mono ? S.nm(V.light) : C.warn;
        const dxIn = Lr * Math.sin(th), dyIn = Lr * Math.cos(th);
        S.ray(c, [[xi - dxIn, yTop - dyIn], [xi, yTop]], { color: rc, width: 2.4 });
        if (ok) {
          const dx = tpx * Math.tan(tt), xe = xi + 2 * dx;
          S.ray(c, [[xi, yTop], [xi + dxIn, yTop - dyIn]], { color: rc, width: 2, alpha: 0.9 });
          S.ray(c, [[xi, yTop], [xi + dx, yBot], [xe, yTop], [xe + dxIn, yTop - dyIn]], { color: rc, width: 2, minArrow: 30, alpha: 0.9 });
          kit.label(c, '1', xi + dxIn + 8, yTop - dyIn, { color: rc, size: 13, weight: 700 });
          kit.label(c, '2', Math.max(xe + dxIn + 8, xi + dxIn + 24), yTop - dyIn, { color: rc, size: 13, weight: 700 });
        } else {
          S.ray(c, [[xi, yTop], [xi + dxIn, yTop - dyIn]], { color: rc, width: 2.4 });
          kit.label(c, 'beyond the critical angle: all the light is reflected', xi + 20, yTop + tpx + 24, { color: C.warn, size: 12 });
        }
        S.angle(c, xi, yTop, 28, -PI / 2, -PI / 2 - th, th > 0.04 ? 'θ' : '');
        const j1 = nf > n0 + 1e-9, j2 = ns > nf + 1e-9, net = (j1 ? 1 : 0) + (j2 ? 1 : 0);
        kit.label(c, j1 ? 'π jump' : 'no jump', xi - 8, yTop - 8, { align: 'right', color: j1 ? C.bad : C.muted, size: 11.5, weight: 650 });
        kit.label(c, j2 ? 'π jump' : 'no jump', x1 - 8, yBot + 12, { align: 'right', color: j2 ? C.bad : C.muted, size: 11.5, weight: 650 });
        if (tpx > 20) S.dim(c, x0 + 150, yTop, x0 + 150, yBot, 't = ' + t.toFixed(0) + ' nm', { off: -10, size: 12 });
        else kit.label(c, 't = ' + t.toFixed(0) + ' nm', x0 + 150, yBot + 14, { color: C.text, size: 12 });
        kit.label(c, 'not to scale', x1 - 6, 0.78 * H - 12, { align: 'right', color: C.faint, size: 11 });
        // ---- the colour swatch and the thickness strip
        const sx = 0.63 * W, sw = 0.34 * W, sy = 0.08 * H, sh = 0.27 * H, th0 = th;
        const def = defOf(f, t);
        let rgb;
        if (mono) { const R = O.film.stack(def, V.light, th0).R, b = Math.pow(clamp(R / 0.16, 0, 1), 0.8), cc = Cl.wavelength(V.light); rgb = [cc[0] * b, cc[1] * b, cc[2] * b]; }
        else rgb = colourOf(def, th0);
        c.fillStyle = 'rgb(' + Math.round(rgb[0]) + ',' + Math.round(rgb[1]) + ',' + Math.round(rgb[2]) + ')'; c.fillRect(sx, sy, sw, sh);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(sx, sy, sw, sh);
        kit.label(c, mono ? 'brightness in ' + V.light + ' nm light' : 'colour in reflected daylight', sx, sy - 10, { color: C.muted, size: 12 });
        const key = V.film + '|' + V.th + '|' + V.light;
        if (key !== cacheKey) {
          cacheKey = key; cache = [];
          for (let i = 0; i < NCOL; i++) {
            const dd = defOf(f, 1500 * i / (NCOL - 1));
            if (mono) { const R = O.film.stack(dd, V.light, th0).R, b = Math.pow(clamp(R / 0.16, 0, 1), 0.8), cc = Cl.wavelength(V.light); cache.push([cc[0] * b, cc[1] * b, cc[2] * b]); }
            else cache.push(colourOf(dd, th0));
          }
        }
        const ty = sy + sh + 28, thh = 0.07 * H;
        for (let i = 0; i < NCOL; i++) { const q = cache[i]; c.fillStyle = 'rgb(' + Math.round(q[0]) + ',' + Math.round(q[1]) + ',' + Math.round(q[2]) + ')'; c.fillRect(sx + sw * i / NCOL, ty, sw / NCOL + 0.8, thh); }
        c.strokeStyle = C.axis; c.strokeRect(sx, ty, sw, thh);
        const mx = sx + sw * t / 1500; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(mx, ty - 5); c.lineTo(mx, ty + thh + 5); c.stroke();
        kit.label(c, 'thickness from 0 to 1500 nm', sx, ty - 8, { color: C.muted, size: 11.5 });
        for (const q of [0, 500, 1000, 1500]) kit.label(c, String(q), sx + sw * q / 1500, ty + thh + 14, { align: 'center', color: C.faint, size: 10.5 });
        // ---- the numbers
        const cosT = ok ? Math.cos(tt) : 0, opd = 2 * nf * t * cosT;
        const half = net % 2 === 1;
        const bright = [];
        for (let m = 0; m < 60 && ok; m++) { const lam = opd / (m + (half ? 0.5 : 0)); if (m === 0 && !half) continue; if (lam >= 400 && lam <= 700) bright.push(lam.toFixed(0) + ' nm'); }
        ro.set('opd', ok ? opd.toFixed(0) + ' nm = ' + (opd / 550).toFixed(2) + ' waves at 550 nm' : 'total reflection');
        ro.set('jump', (j1 ? 'π' : 'none') + ' · ' + (j2 ? 'π' : 'none'));
        ro.set('net', half ? 'half a wave: dark when 2nt cos θₜ = mλ' : 'no net jump: dark when 2nt cos θₜ = (m + ½)λ');
        ro.set('bright', ok && bright.length ? bright.join(', ') : 'none');
        ro.set('R', (100 * O.film.stack(def, 550, th0).R).toFixed(2) + ' %');
        // ---- the spectrum
        const pts = []; for (let nm = 380; nm <= 780; nm += 5) pts.push([nm, 100 * O.film.stack(def, nm, th0).R]);
        plot.set({ series: [{ pts, color: C.series[0], width: 2 }], x: { label: 'wavelength (nm)', min: 380, max: 780 }, y: { label: 'reflectance (%)' } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ wedge fringes and Newton's rings */
  Hyper.sim('in-wedge', {
    title: 'Fringes of equal thickness: an air wedge and Newton\'s rings',
    blurb: `The two reflections from the top and the bottom of an air gap between glass surfaces interfere. The gap is dark where its thickness is 0, λ/2, λ, … and bright in between, so the fringes are **contour lines of the gap**, λ/2 apart. The pattern is computed from the full thin-film calculation: a glass–air–glass film. The side view is not to scale.

**Try this**
- *Newton's rings*: the centre, where the lens touches the plate, is **dark** in reflection (the half-wave jump). The rings crowd together outward because their radii go as √m; the picture always shows 14 rings, and the read-out gives their real size for the lens you chose.
- Tick *transmitted light*: the pattern is the complement; the centre becomes bright.
- Choose *white light*: the rings and the wedge fringes are coloured, and fade within five or six orders — white light is coherent over only a micrometre or so.
- *Air wedge*: make the angle smaller and the fringes spread; a hair 50 mm from the contact line gives about 250″. Count the fringes between the contact line and the spacer: each is λ/2 of gap.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour, blit = makeBlit();
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Arrangement', options: [['Air wedge between two plates', 'wedge'], ['Newton\'s rings: a lens on a flat plate', 'rings']], value: params.kind || 'rings' },
        { id: 'light', type: 'select', label: 'Light', options: [['white (daylight)', 'white'], ['blue, 450 nm', 450], ['green, 550 nm', 550], ['sodium yellow, 589 nm', 589], ['red, 633 nm', 633]], value: 550 },
        { id: 'alpha', label: 'Wedge angle', min: 2, max: 300, value: 40, log: true, sig: 2, unit: '″' },
        { id: 'R', label: 'Radius of curvature of the lens R', min: 0.1, max: 10, value: 1, log: true, sig: 2, unit: 'm' },
        { id: 'trans', type: 'check', label: 'Look in transmitted light instead', value: false }
      ], id => { if (id === 'kind') mode(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['al', 'Wedge angle'], ['sp', 'Fringe spacing λ/2α'], ['nf', 'Fringes in the 8 mm shown'], ['gap', 'Gap change per fringe'], ['r1', 'Radius of dark ring 1'], ['r10', 'Radius of dark ring 10'], ['gm', 'Gap at dark ring m'], ['ctr', 'The centre']]);
      const mode = () => {
        const w = V.kind === 'wedge';
        ctl.show('alpha', w); ctl.show('R', !w);
        ['al', 'sp', 'nf', 'gap'].forEach(k => ro.show(k, w)); ['r1', 'r10', 'gm', 'ctr'].forEach(k => ro.show(k, !w));
      };
      // the sample wavelengths for white light
      const LAM = []; for (let nm = 400; nm <= 700; nm += 10) LAM.push(nm);
      const cmf = LAM.map(nm => Cl.cmf(nm)), ill = O.photo.spectrum('daylight'), IL = LAM.map(nm => ill(nm));
      let Xw = 0, Yw = 0, Zw = 0; LAM.forEach((nm, i) => { Xw += IL[i] * cmf[i][0]; Yw += IL[i] * cmf[i][1]; Zw += IL[i] * cmf[i][2]; });
      const wlin = Cl.toRgb([Xw / Yw, 1, Zw / Yw]), RMAX = 0.153;
      const gapDef = h => ({ n0: 'N-BK7', ns: 'N-BK7', layers: [{ n: 1, d: Math.max(0, h) }] });
      const rOf = (h, nm) => O.film.stack(gapDef(h), nm, 0).R;
      // the colour [r, g, b] of a gap h (nm), in reflected or transmitted light
      const colourAt = h => {
        const tr = V.trans;
        if (typeof V.light === 'number') { const b = clamp(tr ? 1 - rOf(h, V.light) / RMAX : rOf(h, V.light) / RMAX, 0, 1), c = Cl.wavelength(V.light); return shade(c, Math.pow(b, 0.9)); }
        let X = 0, Y = 0, Z = 0;
        LAM.forEach((nm, i) => { const r = rOf(h, nm), w = (tr ? clamp(1 - r / RMAX, 0, 1) : r) * IL[i]; X += w * cmf[i][0]; Y += w * cmf[i][1]; Z += w * cmf[i][2]; });
        const lin = Cl.toRgb([X / Yw, Y / Yw, Z / Yw]).map((v, k) => (tr ? 1 : 4.5) * v / wlin[k]);
        return Cl.srgb(Cl.fit(lin));
      };
      const NTAB = 300; let tabKey = '', tab = [];
      const ringTab = () => {
        const key = V.light + '|' + V.trans; if (key === tabKey) return; tabKey = key; tab = [];
        const lam = typeof V.light === 'number' ? V.light : 550, hmax = 7 * lam;
        for (let i = 0; i < NTAB; i++) tab.push(colourAt(hmax * i / (NTAB - 1)));
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, wedge = V.kind === 'wedge', tr = V.trans;
        const lam = typeof V.light === 'number' ? V.light : 550, nmCol = typeof V.light === 'number' ? V.light : 570, lamM = lam * 1e-9;
        // ---- the side view, schematic
        const sx0 = 0.04 * W, sx1 = 0.46 * W, yb = 0.62 * H, pl = 0.06 * H;
        c.save();
        S.poly(c, [[sx0, yb], [sx1, yb], [sx1, yb + pl], [sx0, yb + pl]]);
        if (wedge) {
          const gp = 0.06 * H + 4;
          S.poly(c, [[sx0, yb - 2], [sx1, yb - gp], [sx1, yb - gp - pl], [sx0, yb - 2 - pl]]);
          kit.dot(c, sx1 - 10, yb - gp / 2 - 1, Math.max(2, gp / 2 - 1), C.warn);
          kit.label(c, 'spacer', sx1 - 10, yb + pl + 14, { align: 'center', color: C.warn, size: 11.5 });
          kit.label(c, 'contact line', sx0 + 4, yb + pl + 14, { color: C.muted, size: 11.5 });
          kit.label(c, 'air wedge: gap h = α·x', (sx0 + sx1) / 2, yb - gp - pl - 12, { align: 'center', color: C.muted, size: 12 });
        } else {
          const cx = (sx0 + sx1) / 2, half = 0.18 * W, Rp = 330, sag = x => Rp - Math.sqrt(Rp * Rp - x * x), top = yb - sag(half) - 0.07 * H, pts = [];
          for (let i = 0; i <= 24; i++) { const x = -half + 2 * half * i / 24; pts.push([cx + x, yb - sag(x)]); }
          S.poly(c, pts.concat([[cx + half, top], [cx - half, top]]));
          kit.label(c, 'lens, radius R', cx, top - 12, { align: 'center', color: C.muted, size: 12 });
          kit.label(c, 'gap h = r²/2R', cx + half + 6, yb - 6, { color: C.muted, size: 11.5 });
        }
        c.restore();
        kit.label(c, 'flat plate', sx0 + 4, yb + pl / 2, { color: C.muted, size: 11.5 });
        for (const f of [0.22, 0.5, 0.78]) { const x = sx0 + (sx1 - sx0) * f; if (tr) S.ray(c, [[x, yb + pl + 34], [x, 0.14 * H]], { nm: nmCol, width: 1.6, minArrow: 20 }); else S.ray(c, [[x, 0.1 * H], [x, 0.3 * H]], { nm: nmCol, width: 1.6, minArrow: 20 }); }
        kit.label(c, tr ? 'light from below, looked at from above' : 'light from above, looked at from above (reflection)', sx0, 0.05 * H, { color: C.muted, size: 12 });
        // ---- the pattern
        if (wedge) {
          const px0 = 0.52 * W, pw = 0.45 * W, py0 = 0.14 * H, ph = Math.min(pw * 0.62, 0.7 * H);
          const alpha = V.alpha * 4.848e-6, hmax = alpha * 8e-3 * 1e9;
          blit(c, px0, py0, pw, ph, 240, 2, u => colourAt(u * hmax));
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(px0, py0, pw, ph);
          kit.label(c, 'what you see: a piece 8 mm long', px0, py0 - 12, { color: C.muted, size: 12 });
          S.dim(c, px0, py0 + ph + 14, px0 + pw, py0 + ph + 14, '8 mm', { off: 12, size: 12 });
          kit.label(c, 'contact line', px0 + 4, py0 + ph + 34, { color: C.faint, size: 11 });
          const sp = lamM / (2 * alpha);
          ro.set('al', V.alpha.toFixed(1) + '″ = ' + (alpha * 1e3).toFixed(3) + ' mrad');
          ro.set('sp', (sp * 1e3).toFixed(2) + ' mm');
          ro.set('nf', (8e-3 / sp).toFixed(1));
          ro.set('gap', (lam / 2).toFixed(0) + ' nm');
        } else {
          ringTab();
          const side = Math.min(0.45 * W, 0.78 * H), px0 = 0.52 * W + (0.45 * W - side) / 2, py0 = 0.12 * H, rad = side / 2, cx = px0 + rad, cy = py0 + rad;
          blit(c, px0, py0, side, side, 170, 170, (u, v) => { const rr = 2 * Math.hypot(u - 0.5, v - 0.5); if (rr > 1) return [18, 22, 40]; return tab[Math.min(NTAB - 1, Math.round(rr * rr * (NTAB - 1)))]; });
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, rad, 0, TAU); c.stroke();
          // the dark rings are numbered along a radius
          c.strokeStyle = C.warn; c.lineWidth = 1; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + rad, cy); c.stroke();
          for (let m = 1; m <= 14; m++) { const x = cx + rad * Math.sqrt(m / 14); c.beginPath(); c.moveTo(x, cy - 4); c.lineTo(x, cy + 4); c.stroke(); if ([1, 2, 3, 5, 8, 10, 14].includes(m)) kit.label(c, String(m), x, cy + 13, { align: 'center', color: C.warn, size: 10.5, bg: 'rgba(0,0,0,0.35)' }); }
          kit.label(c, 'dark ring numbers m along a radius', cx, py0 - 12, { align: 'center', color: C.muted, size: 12 });
          const R = V.R, rmax = Math.sqrt(14 * lamM * R);
          kit.label(c, 'picture radius ' + (rmax * 1e3).toFixed(2) + ' mm', cx, py0 + side + 14, { align: 'center', color: C.muted, size: 12 });
          ro.set('r1', (Math.sqrt(lamM * R) * 1e3).toFixed(3) + ' mm');
          ro.set('r10', (Math.sqrt(10 * lamM * R) * 1e3).toFixed(3) + ' mm');
          ro.set('gm', 'm × ' + (lam / 2).toFixed(0) + ' nm');
          ro.set('ctr', tr ? 'bright (gap 0)' : 'dark (gap 0, half-wave jump)');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      mode();
      loop.once();
    }
  });

  /* ================================================================ the Michelson interferometer */
  Hyper.sim('in-michelson', {
    title: 'The Michelson interferometer',
    blurb: `Light from a laser is split in two; each half goes to a mirror and back; the halves are recombined and fall on a detector. The disc on the right is what the detector sees: **circular fringes**. The graph is the brightness at the centre as the movable mirror is displaced. The mirror movement in the drawing is exaggerated.

**Try this**
- Drag the movable mirror (or use the slider): each time it moves by **λ/2** the centre goes through one complete fringe and one ring is born at the centre or swallowed by it. The read-out counts them.
- Press *Move the mirror λ/2* and watch the centre brightness return to the same value.
- Make the arm imbalance zero: there are no rings, the whole field goes bright and dark together — the 'zero path difference' of white-light interferometry.
- Tick *gas cell* and raise the pressure: the 100 mm cell filled with air to 101 kPa shifts the fringes by about 85, although no mirror moved. Measuring that is how the refractive index of a gas is found.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, blit = makeBlit();
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 350 });
      const ctl = kit.controls(box.side, [
        { id: 'nm', type: 'select', label: 'Laser', options: [['He–Ne, 632.8 nm', 632.8], ['green, 532 nm', 532], ['blue-violet, 405 nm', 405]], value: 632.8 },
        { id: 'x', label: 'Mirror displacement x', min: 0, max: 20, step: 0.01, value: 0, unit: 'µm' },
        { id: 'D', label: 'Arm imbalance D', min: 0, max: 2, step: 0.01, value: 0.8, unit: 'mm' },
        { id: 'cell', type: 'check', label: 'A 100 mm gas cell in the moving arm', value: false },
        { id: 'p', label: 'Air pressure in the cell', min: 0, max: 101.3, step: 0.5, value: 0, unit: 'kPa' },
        { id: 'auto', type: 'check', label: 'Move the mirror by itself', value: false },
        { type: 'buttons', items: [{ id: 'half', label: 'Move the mirror λ/2', primary: true }, { id: 'zero', label: 'Back to 0' }] }
      ], (id, val) => {
        if (id === 'half') ctl.set('x', clamp(V.x + V.nm / 2000, 0, 20));
        else if (id === 'zero') ctl.set('x', 0);
        else if (id === 'cell') ctl.show('p', V.cell);
        if (id === 'auto') sync(); else if (!V.auto) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['x', 'Mirror movement x'], ['dp', 'Path difference changed by 2x'], ['N', 'Fringes passed (2x + 2L(n−1))/λ'], ['c', 'Brightness at the centre'], ['rings', 'Rings across the field']]);
      const plot = kit.plot(box.side, { x: { label: 'mirror displacement (µm)' }, y: { label: 'centre brightness', min: 0, max: 1.05 } }, 160);
      const GEO = () => { const W = st.W, H = st.H, bx = 0.3 * W, by = 0.52 * H; return { W, H, bx, by, m2x0: bx + 0.22 * W }; };
      kit.drag(st, {
        hover: true,
        hit: p => { const g = GEO(), mx = g.m2x0 + V.x * 3; return Math.abs(p.x - mx) < 14 && Math.abs(p.y - g.by) < 0.08 * g.H ? 'm' : null; },
        move: (w, p) => { const g = GEO(); ctl.set('x', clamp((p.x - g.m2x0) / 3, 0, 20)); loop.once(); }
      });
      const sync = () => { if (V.auto) loop.start(); else { loop.stop(); loop.once(); } };
      const loop = kit.loop((dt) => {
        if (V.auto && dt > 0) ctl.set('x', (V.x + 1.6 * dt) % 20);
        const c = st.begin(), C = kit.colors(), g = GEO(), W = g.W, H = g.H, bx = g.bx, by = g.by, nm = V.nm, lam = nm * 1e-9, col = S.nm(nm);
        const s = 0.1 * H, m2x = g.m2x0 + V.x * 3, m1y = 0.14 * H, lx = 0.05 * W, dy = 0.88 * H;
        const nGas = 2.7e-4 * V.p / 101.325, Lc = 0.1;
        const phCell = V.cell ? TAU * 2 * Lc * nGas / lam : 0;
        const phase = th => 4 * PI * (V.D * 1e-3 + V.x * 1e-6) * Math.cos(th) / lam + phCell + PI;
        // beams
        const beam = (pts, w) => S.ray(c, pts, { color: col, width: w || 2, arrows: false });
        beam([[lx, by], [bx - s / 2, by]], 2.4);
        beam([[bx - 3, by - s / 2], [bx - 3, m1y]]); beam([[bx + 3, m1y], [bx + 3, by - s / 2]]);
        beam([[bx + s / 2, by - 3], [m2x, by - 3]]); beam([[m2x, by + 3], [bx + s / 2, by + 3]]);
        beam([[bx, by + s / 2], [bx, dy - 14]], 2.8);
        S.source(c, lx, by, { kind: 'laser', color: col, size: 10, dir: 0 });
        S.splitter(c, bx, by, s);
        S.flatMirror(c, bx - 0.06 * H, m1y, bx + 0.06 * H, m1y);
        S.flatMirror(c, m2x, by - 0.06 * H, m2x, by + 0.06 * H);
        kit.label(c, 'fixed mirror', bx, m1y - 14, { align: 'center', color: C.muted, size: 12 });
        kit.label(c, 'movable mirror', m2x, by + 0.06 * H + 16, { align: 'center', color: C.muted, size: 12 });
        kit.label(c, 'beam splitter', bx - s / 2 - 6, by + s / 2 + 14, { align: 'right', color: C.muted, size: 12 });
        if (V.cell) {
          const cw = 0.1 * W, cxl = bx + 0.09 * W; S.block(c, cxl, by - 0.045 * H, cw, 0.09 * H);
          kit.label(c, 'gas cell, 100 mm', cxl + cw / 2, by - 0.045 * H - 12, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, V.p.toFixed(0) + ' kPa', cxl + cw / 2, by + 0.005 * H, { align: 'center', color: C.text, size: 11.5 });
        }
        c.fillStyle = C.muted; c.fillRect(bx - 12, dy - 12, 24, 6);
        kit.label(c, 'detector', bx, dy + 6, { align: 'center', color: C.muted, size: 12 });
        kit.label(c, 'mirror movement exaggerated', m2x, by - 0.06 * H - 12, { align: 'center', color: C.faint, size: 11 });
        // the fringes the detector sees
        const rd = Math.min(0.16 * W, 0.22 * H), fcx = 0.8 * W, fcy = 0.27 * H, thmax = 0.05;
        blit(c, fcx - rd, fcy - rd, 2 * rd, 2 * rd, 130, 130, (u, v) => { const r = 2 * Math.hypot(u - 0.5, v - 0.5); if (r > 1) return [18, 22, 40]; return shade(O.colour.wavelength(nm), 0.03 + 0.97 * O.diff.twoBeam(1, 1, phase(thmax * r)) / 4); });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.arc(fcx, fcy, rd, 0, TAU); c.stroke();
        kit.label(c, 'what the detector sees', fcx, fcy - rd - 12, { align: 'center', color: C.muted, size: 12 });
        const I0 = O.diff.twoBeam(1, 1, phase(0)) / 4, Ntot = (2 * V.x * 1e-6 + 2 * Lc * nGas * (V.cell ? 1 : 0)) / lam;
        kit.label(c, Ntot.toFixed(1) + ' fringes', fcx, fcy + rd + 22, { align: 'center', color: C.text, size: 15, weight: 700 });
        ro.set('x', V.x.toFixed(2) + ' µm');
        ro.set('dp', (2 * V.x * 1000).toFixed(0) + ' nm = ' + (2 * V.x * 1e-6 / lam).toFixed(2) + ' λ');
        ro.set('N', Ntot.toFixed(2) + (V.cell ? '  (the gas alone: ' + (2 * Lc * nGas / lam).toFixed(1) + ')' : ''));
        ro.set('c', I0 > 0.9 ? 'bright' : I0 < 0.1 ? 'dark' : (100 * I0).toFixed(0) + ' % of the maximum');
        ro.set('rings', (2 * V.D * 1e-3 * thmax * thmax / lam).toFixed(1));
        const pts = []; for (let i = 0; i <= 240; i++) { const xx = V.x - 1 + 2 * i / 240, ph = 4 * PI * (V.D * 1e-3 + xx * 1e-6) / lam + phCell + PI; pts.push([xx, O.diff.twoBeam(1, 1, ph) / 4]); }
        plot.set({ series: [{ pts, color: C.series[0], width: 2 }], x: { label: 'mirror displacement (µm)', min: V.x - 1, max: V.x + 1 }, y: { label: 'centre brightness', min: 0, max: 1.05 }, marks: [{ x: V.x, y: I0, label: 'now', color: C.warn }] });
      }, box.stage);
      st.onResize(() => loop.once());
      ctl.show('p', false);
      sync();
    }
  });

  /* ================================================================ the Fabry–Perot interferometer */
  Hyper.sim('in-fabry-perot', {
    title: 'The Fabry–Perot interferometer',
    blurb: `Light bounces between two partly reflecting mirrors; a little leaks out of the far mirror on each round trip, and all the leaked beams add. The beams drawn in the cavity are separate for clarity (the real ones overlap); their brightness falls by a factor R² each round trip. The graph is the exact transmission, the Airy function, over three free spectral ranges; the dot shows where the tuning slider puts you.

**Try this**
- Set R = 0.9 and slide the tuning across one free spectral range: nothing gets through except in a narrow window, where all the light does — even though each mirror reflects 90 %.
- Raise the reflectance to 0.99: the peaks narrow (the finesse grows) but stay the same distance apart.
- Increase the spacing d: the peaks come closer together (a smaller free spectral range) and each gets narrower.
- Watch the bars: at resonance nothing is reflected back; off resonance almost everything is.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'R', label: 'Reflectance of each mirror R', min: 0.04, max: 0.995, step: 0.005, value: params.R || 0.9, fmt: v => (100 * v).toFixed(1) + ' %' },
        { id: 'd', label: 'Mirror spacing d', min: 0.01, max: 10, value: 1, log: true, sig: 2, unit: 'mm' },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 1, value: 550, unit: 'nm' },
        { id: 'tune', label: 'Tuning', min: -0.5, max: 0.5, step: 0.005, value: 0, fmt: v => v.toFixed(3) + ' of a free spectral range' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['F', 'Finesse π√R/(1 − R)'], ['fsr', 'Free spectral range'], ['fwhm', 'Width of a peak (FWHM)'], ['rp', 'Resolving power λ/δλ'], ['m', 'Order m = 2d/λ'], ['con', 'Peak-to-valley contrast'], ['T', 'Transmission at this tuning']]);
      const plot = kit.plot(box.side, { x: { label: 'wavelength (nm)' }, y: { label: 'transmission', min: 0, max: 1.05 } }, 170);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, d = V.d * 1e-3, lam = V.nm * 1e-9;
        const m = Math.max(1, Math.round(2 * d / lam)), lm = 2 * d / m * 1e9;          // the resonance nearest the chosen wavelength, nm
        const et = O.etalon({ R: V.R, d, nm: lm }), fsr = et.fsrNm, lt = lm + V.tune * fsr, T = O.etalon({ R: V.R, d, nm: lt }).T;
        const col = S.nm(V.nm), x1 = 0.3 * W, x2 = 0.62 * W, cy = 0.46 * H, mh = 0.31 * H;
        // the two mirrors
        c.save(); c.fillStyle = S.metal(); c.globalAlpha = 0.25 + 0.7 * V.R; c.fillRect(x1 - 3, cy - mh, 6, 2 * mh); c.fillRect(x2 - 3, cy - mh, 6, 2 * mh); c.restore();
        kit.label(c, 'mirror 1', x1, cy - mh - 12, { align: 'center', color: C.muted, size: 12 });
        kit.label(c, 'mirror 2', x2, cy - mh - 12, { align: 'center', color: C.muted, size: 12 });
        // the beams: in, bouncing, out
        const dyp = 0.07 * H, y0 = cy + 0.26 * H, I = j => Math.pow(V.R, 2 * j), slope = dyp / (x2 - x1), xin = 0.04 * W, xout = W - 0.04 * W;
        S.ray(c, [[xin, y0 + (x1 - xin) * slope], [x1, y0]], { color: col, width: 2.6, minArrow: 40 });
        const pts = [[x1, y0]];
        for (let k = 1; k <= 7; k++) pts.push([k % 2 ? x2 : x1, y0 - k * dyp]);
        for (let k = 0; k < 7; k++) S.ray(c, [pts[k], pts[k + 1]], { color: col, width: 1.5, alpha: 0.35 + 0.65 * Math.pow(V.R, k), arrows: false });
        for (let j = 0; j < 4; j++) {            // the beams that leave through mirror 2
          const p = pts[2 * j + 1];
          S.ray(c, [p, [xout, p[1] - (xout - x2) * slope]], { color: col, width: 1.6, alpha: 0.2 + 0.8 * I(j), arrows: false });
        }
        for (let j = 0; j < 4; j++) {            // the beams that leave through mirror 1: the first is the plain reflection
          const p = pts[2 * j];
          S.ray(c, [p, [xin, p[1] - (x1 - xin) * slope]], { color: C.warn, width: 1.5, alpha: clamp(j === 0 ? 0.3 + 0.7 * V.R : 0.15 + 0.85 * Math.pow(V.R, 2 * j - 1), 0, 1), arrows: false });
        }
        kit.label(c, 'transmitted beams →', W - 8, 0.04 * H, { align: 'right', color: col, size: 12 });
        kit.label(c, '← reflected beams', 8, 0.04 * H, { color: C.warn, size: 12 });
        S.dim(c, x1, cy + mh + 18, x2, cy + mh + 18, 'd = ' + (V.d >= 1 ? V.d.toFixed(2) + ' mm' : (V.d * 1000).toFixed(0) + ' µm') + ' (not to scale)', { off: 13, size: 12 });
        // the two totals
        const bw = 0.34 * W, by = 0.92 * H;
        c.fillStyle = C.ok; c.fillRect(W - 12 - bw * T, by - 6, bw * T, 12); kit.label(c, 'transmitted ' + (100 * T).toFixed(1) + ' %', W - 12 - bw, by - 16, { color: C.ok, size: 12, weight: 650 });
        c.fillStyle = C.warn; c.fillRect(12, by - 6, bw * (1 - T), 12); kit.label(c, 'reflected ' + (100 * (1 - T)).toFixed(1) + ' %', 12, by - 16, { color: C.warn, size: 12, weight: 650 });
        const onRes = Math.abs(V.tune) < 0.5 * et.fwhmNm / fsr;
        kit.label(c, onRes ? 'on resonance: the reflections cancel' : 'off resonance: the light is turned back', W / 2, 0.04 * H, { align: 'center', color: onRes ? C.ok : C.muted, size: 12.5, weight: 650 });
        // the numbers and the Airy curve
        ro.set('F', et.finesse.toFixed(1));
        ro.set('fsr', fsr >= 1 ? fsr.toFixed(2) + ' nm = ' + (et.fsrHz / 1e9).toFixed(0) + ' GHz' : (fsr * 1000).toFixed(1) + ' pm = ' + (et.fsrHz / 1e9).toFixed(1) + ' GHz');
        ro.set('fwhm', et.fwhmNm >= 0.1 ? et.fwhmNm.toFixed(2) + ' nm' : (et.fwhmNm * 1000).toFixed(et.fwhmNm < 0.01 ? 2 : 1) + ' pm = ' + (et.fsrHz / et.finesse >= 1e9 ? (et.fsrHz / et.finesse / 1e9).toFixed(2) + ' GHz' : (et.fsrHz / et.finesse / 1e6).toFixed(0) + ' MHz'));
        ro.set('rp', Math.round(lm / et.fwhmNm).toLocaleString('en-GB'));
        ro.set('m', String(m));
        ro.set('con', (1 + et.F).toFixed(0) + ' : 1');
        ro.set('T', (100 * T).toFixed(1) + ' %');
        const pp = []; for (let i = 0; i <= 600; i++) { const l = lm - 1.5 * fsr + 3 * fsr * i / 600; pp.push([l, O.etalon({ R: V.R, d, nm: l }).T]); }
        plot.set({ series: [{ pts: pp, color: C.series[0], width: 2 }], x: { label: 'wavelength (nm)', min: lm - 1.5 * fsr, max: lm + 1.5 * fsr }, y: { label: 'transmission', min: 0, max: 1.05 }, hlines: [{ y: 0.5, label: 'half maximum' }], marks: [{ x: lt, y: T, label: 'now', color: C.warn }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ Mach–Zehnder, modulator, Sagnac */
  Hyper.sim('in-mach-zehnder', {
    title: 'Mach–Zehnder and Sagnac interferometers',
    blurb: `**Mach–Zehnder.** The beams go along two separate arms and meet at a second splitter. The two outputs are *complementary*: when one gains the other loses, and the total never changes. A phase shifter (or, in a modulator, a voltage) in one arm steers the light from one output to the other.

**Sagnac.** The two beams go round the same ring in opposite directions. At rest they are exactly in step; when the ring turns, the beam travelling with the rotation has farther to go. The picture is schematic (the ring is drawn turning far faster than any real one); the numbers are for a fibre coil 10 cm across with the length you choose, working at 1550 nm.

**Try this**
- Mach–Zehnder: set the phase to 0°, 90°, 180° and 360°: the output moves from port 1 to port 2 and back. The sum is always 100 %.
- *Modulator*: sweep the voltage from 0 to 4 V (V_π): the transmission falls from 100 % to zero. This is the device that puts data on a laser beam.
- *Sagnac*: leave the rate at 15°/h (the Earth's rotation) and increase the fibre length: the phase grows in proportion to the area enclosed, the product of length and coil diameter.
- Sagnac: find the smallest rate that gives a phase of 1 µrad — the read-out has it.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const VPI = 4, RC = 0.05, EARTH = 7.292e-5;
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Arrangement', options: [['Mach–Zehnder: a phase shifter in one arm', 'mz'], ['Mach–Zehnder modulator: a voltage on one arm', 'mzm'], ['Sagnac ring: the loop turns', 'sagnac']], value: params.kind || 'mz' },
        { id: 'phi', label: 'Phase shift of one arm', min: 0, max: 720, step: 1, value: 60, unit: '°' },
        { id: 'V', label: 'Voltage on the modulator (Vπ = 4 V)', min: 0, max: 8, step: 0.05, value: 1, unit: 'V' },
        { id: 'rate', label: 'Rotation rate Ω', min: 0.01, max: 1000, value: 15.04, log: true, sig: 3, unit: '°/h' },
        { id: 'L', label: 'Fibre in the coil (10 cm diameter)', min: 10, max: 10000, value: 1000, log: true, sig: 2, unit: 'm' }
      ], id => { if (id === 'kind') mode(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p1', 'Power at output 1'], ['p2', 'Power at output 2'], ['ph', 'Phase difference'], ['dphi', 'Sagnac phase shift'], ['na', 'Turns × area  N·A'], ['earth', 'Compared with the Earth\'s rotation (15.04°/h)'], ['min', 'Rate that gives 1 µrad']]);
      const plot = kit.plot(box.side, { x: { label: 'phase difference (°)' }, y: { label: 'output power' } }, 170);
      const mode = () => {
        const k = V.kind;
        ctl.show('phi', k === 'mz'); ctl.show('V', k === 'mzm'); ctl.show('rate', k === 'sagnac'); ctl.show('L', k === 'sagnac');
        ['p1', 'p2', 'ph'].forEach(x => ro.show(x, k !== 'sagnac')); ['dphi', 'na', 'earth', 'min'].forEach(x => ro.show(x, k === 'sagnac'));
        if (k === 'sagnac') loop.start(); else { loop.stop(); loop.once(); }
      };
      let plotSig = '';
      const mzOut = ph => [O.diff.twoBeam(1, 1, ph) / 4, O.diff.twoBeam(1, 1, ph + PI) / 4];
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, col = S.nm(632.8);
        if (V.kind !== 'sagnac') {
          const mzm = V.kind === 'mzm', ph = mzm ? PI * V.V / VPI : V.phi * D2R, [p1, p2] = mzOut(ph);
          const xl = 0.22 * W, xr = 0.58 * W, yt = 0.28 * H, yb = 0.64 * H, s = 0.07 * H;
          const beam = (pts, w, a) => S.ray(c, pts, { color: col, width: w, alpha: a == null ? 1 : a, arrows: false });
          beam([[0.06 * W, yb], [xl, yb]], 2.6);
          beam([[xl, yb], [xl, yt], [xr, yt]], 2); beam([[xl, yb], [xr, yb], [xr, yt]], 2);
          beam([[xr, yt], [xr + 0.16 * W, yt]], 1 + 3.4 * p1, 0.25 + 0.75 * p1); beam([[xr, yt], [xr, 0.1 * H]], 1 + 3.4 * p2, 0.25 + 0.75 * p2);
          S.source(c, 0.06 * W, yb, { kind: 'laser', color: col, size: 10, dir: 0 });
          S.splitter(c, xl, yb, s); S.splitter(c, xr, yt, s);
          S.flatMirror(c, xl - 12, yt + 12, xl + 12, yt - 12); S.flatMirror(c, xr + 12, yb - 12, xr - 12, yb + 12);
          // the phase shifter in the lower arm
          const px = xl + 0.14 * W, pw = 0.1 * W;
          S.block(c, px, yb - 0.035 * H, pw, 0.07 * H);
          if (mzm) { c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(px, yb - 0.05 * H); c.lineTo(px + pw, yb - 0.05 * H); c.moveTo(px, yb + 0.05 * H); c.lineTo(px + pw, yb + 0.05 * H); c.stroke(); }
          kit.label(c, mzm ? 'electrodes: ' + V.V.toFixed(2) + ' V' : 'phase shifter', px + pw / 2, yb + 0.085 * H, { align: 'center', color: C.muted, size: 12 });
          kit.label(c, 'splitter 1', xl - 4, yb + s / 2 + 15, { align: 'right', color: C.muted, size: 12 });
          kit.label(c, 'splitter 2', xr + s / 2 + 6, yt + 16, { color: C.muted, size: 12 });
          kit.label(c, 'arm A', (xl + xr) / 2, yt - 12, { align: 'center', color: C.muted, size: 12 });
          kit.label(c, 'arm B', (xl + xr) / 2 + 0.12 * W, yb - 12, { align: 'center', color: C.muted, size: 12 });
          // the two detectors
          const dx = xr + 0.16 * W, rgbCss = a => 'rgb(' + a.map(Math.round).join(',') + ')', lc = O.colour.wavelength(632.8);
          c.fillStyle = rgbCss(shade(lc, 0.1 + 0.9 * p1)); c.fillRect(dx, yt - 14, 12, 28);
          kit.label(c, 'output 1: ' + (100 * p1).toFixed(0) + ' %', dx + 18, yt, { color: C.text, size: 12.5, weight: 650 });
          c.fillStyle = rgbCss(shade(lc, 0.1 + 0.9 * p2)); c.fillRect(xr - 14, 0.1 * H - 10, 28, 12);
          kit.label(c, 'output 2: ' + (100 * p2).toFixed(0) + ' %', xr + 22, 0.1 * H - 4, { color: C.text, size: 12.5, weight: 650 });
          ro.set('p1', (100 * p1).toFixed(1) + ' %'); ro.set('p2', (100 * p2).toFixed(1) + ' %'); ro.set('ph', (ph * R2D).toFixed(0) + '°');
          const sig = V.kind + (mzm ? V.V.toFixed(2) : V.phi);
          const pts1 = [], pts2 = [];
          if (mzm) { for (let i = 0; i <= 160; i++) { const v = 8 * i / 160, o = mzOut(PI * v / VPI); pts1.push([v, o[0]]); } plot.set({ series: [{ pts: pts1, color: C.series[0], width: 2 }], x: { label: 'voltage (V)', min: 0, max: 8 }, y: { label: 'transmission', min: 0, max: 1.05 }, marks: [{ x: V.V, y: p1, label: 'now', color: C.warn }], vlines: [{ x: VPI, label: 'Vπ' }], hlines: [], }); }
          else { for (let i = 0; i <= 180; i++) { const a = 720 * i / 180, o = mzOut(a * D2R); pts1.push([a, o[0]]); pts2.push([a, o[1]]); } plot.set({ series: [{ pts: pts1, color: C.series[0], width: 2, label: 'output 1' }, { pts: pts2, color: C.series[1], width: 2, label: 'output 2' }], x: { label: 'phase difference (°)', min: 0, max: 720 }, y: { label: 'output power', min: 0, max: 1.05 }, marks: [{ x: V.phi, y: p1, label: '1', color: C.warn }, { x: V.phi, y: p2, label: '2', color: C.warn }], vlines: [], hlines: [] }); }
          plotSig = sig;
        } else {
          // the Sagnac ring: schematic, turning
          const cx = 0.36 * W, cy = 0.52 * H, R = 0.3 * H, rot = 0.35 * t, lam = 1550e-9;
          const Om = V.rate * D2R / 3600, NA = V.L * RC / 2, dphi = 8 * PI * NA * Om / (lam * O.c);
          for (let k = 0; k < 3; k++) { c.strokeStyle = C.series[2]; c.globalAlpha = 0.6; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, R - k * 7, 0, TAU); c.stroke(); c.globalAlpha = 1; }
          const ca = PI + rot, cpx = cx + R * Math.cos(ca), cpy = cy + R * Math.sin(ca);
          S.splitter(c, cpx, cpy, 0.06 * H);
          S.source(c, 0.06 * W, cy, { kind: 'laser', color: col, size: 10, dir: 0 });
          kit.label(c, 'laser and detector', 0.06 * W, cy + 30, { align: 'center', color: C.muted, size: 12 });
          c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(0.06 * W + 6, cy); c.lineTo(cpx - 0.03 * H, cpy); c.stroke(); c.restore();
          const a1 = ca + 2.4 * t, a2 = ca - 2.4 * t;
          for (const [a, cc] of [[a1, C.warn], [a2, C.series[0]]]) kit.dot(c, cx + (R - 7) * Math.cos(a), cy + (R - 7) * Math.sin(a), 6, cc, C.bg2);
          kit.label(c, 'clockwise beam', cx, cy - 8, { align: 'center', color: C.warn, size: 12.5, weight: 650 });
          kit.label(c, 'anticlockwise beam', cx, cy + 10, { align: 'center', color: C.series[0], size: 12.5, weight: 650 });
          kit.label(c, 'fibre coil, 10 cm across', cx, cy + R + 22, { align: 'center', color: C.muted, size: 12 });
          // the rotation arrow
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R + 16, -2.3, -0.6); c.stroke();
          const ex = cx + (R + 16) * Math.cos(-0.6), ey = cy + (R + 16) * Math.sin(-0.6); kit.arrow(c, ex - 5, ey - 7, ex + 3, ey + 3, C.text, 2, 9);
          kit.label(c, 'Ω', cx + (R + 34) * Math.cos(-1.45), cy + (R + 34) * Math.sin(-1.45), { align: 'center', color: C.text, size: 15, weight: 700 });
          kit.label(c, 'Δφ = ' + (dphi * 1e6 >= 1000 ? (dphi * 1e3).toFixed(2) + ' mrad' : (dphi * 1e6).toFixed(2) + ' µrad'), 0.8 * W, 0.2 * H, { align: 'center', color: C.text, size: 17, weight: 700 });
          kit.label(c, 'between the two beams at the detector', 0.8 * W, 0.2 * H + 20, { align: 'center', color: C.muted, size: 12 });
          const earthPhi = 8 * PI * NA * EARTH / (lam * O.c);
          ro.set('dphi', (dphi * 1e6).toFixed(2) + ' µrad = ' + (dphi * R2D * 60).toExponential(2) + ' arcmin');
          ro.set('na', NA.toFixed(1) + ' m²  (N = ' + Math.round(V.L / (TAU * RC)) + ' turns)');
          ro.set('earth', (Om / EARTH).toFixed(2) + ' ×  (the Earth alone gives ' + (earthPhi * 1e6).toFixed(1) + ' µrad)');
          ro.set('min', (1e-6 * lam * O.c / (8 * PI * NA) * 3600 * R2D).toFixed(3) + ' °/h');
          const sig = 's' + V.L + '|' + V.rate;
          if (sig !== plotSig) {
            plotSig = sig;
            const pts = []; for (let i = 0; i <= 60; i++) { const r = 0.01 * Math.pow(1e5, i / 60), y = 8 * PI * NA * (r * D2R / 3600) / (lam * O.c) * 1e6; pts.push([r, clamp(y, 1e-3, 1e7)]); }
            plot.set({ series: [{ pts, color: C.series[0], width: 2 }], x: { label: 'rotation rate (°/h)', log: true, min: 0.01, max: 1000 }, y: { label: 'phase (µrad)', log: true, min: 1e-3, max: 1e7 }, marks: [{ x: V.rate, y: clamp(dphi * 1e6, 1e-3, 1e7), label: 'now', color: C.warn }], vlines: [{ x: 15.04, label: 'Earth' }], hlines: [{ y: 1, label: '1 µrad' }] });
          }
        }
      }, box.stage);
      st.onResize(() => loop.once());
      mode();
    }
  });

  /* ================================================================ reading fringes */
  Hyper.sim('in-fringe-test', {
    title: 'Reading fringes: testing a surface against a flat',
    blurb: `A test plate or a Fizeau interferometer compares a surface with a flat reference. In the left disc you see the **fringes**; in the right disc the **true height map** of the error you chose, high in red and low in blue. Each fringe is a contour of the gap, **λ/2** of height apart. The tilt control adds straight fringes to any surface, with the gap growing to the right; the reference touches the highest point, where the gap is zero and the fringe is dark.

**Try this**
- Choose *perfect flat* and add tilt: straight, equally spaced fringes. Remove the tilt: the field goes uniformly bright or dark.
- Choose *convex* with the error at 158 nm (λ/4 at 633 nm): the fringes bow by half their spacing, towards the thick end of the wedge (to the right) for a high centre. Choose *concave*: they bow the other way.
- Remove the tilt from a spherical error: concentric rings, one per half wavelength of sag.
- *Astigmatic* gives saddle-shaped fringes; *turned edge* leaves the fringes straight except near the rim; the *bump* shows a local ring.
- Read the numbers: the peak-to-valley error in λ/N, and the Strehl ratio of the reflected wavefront.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, blit = makeBlit();
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 330 });
      const SHAPES = {
        flat: () => 0,
        convex: (x, y) => 1 - (x * x + y * y),
        concave: (x, y) => -(1 - (x * x + y * y)),
        astig: (x, y) => (x * x - y * y) / 2,
        edge: (x, y) => { const q = Math.max(0, (Math.hypot(x, y) - 0.7) / 0.3); return -q * q; },
        bump: (x, y) => Math.exp(-((x - 0.3) * (x - 0.3) + (y + 0.25) * (y + 0.25)) / 0.06)
      };
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Surface error', options: [['Perfect flat', 'flat'], ['Convex: high in the middle', 'convex'], ['Concave: low in the middle', 'concave'], ['Astigmatic (saddle)', 'astig'], ['Turned edge', 'edge'], ['A bump', 'bump']], value: params.type || 'convex' },
        { id: 'pv', label: 'Size of the error (peak to valley)', min: 0, max: 1000, step: 5, value: params.pv || 158, unit: 'nm' },
        { id: 'tilt', label: 'Tilt between the surfaces', min: 0, max: 12, step: 0.1, value: 4, unit: 'fringes' },
        { id: 'nm', type: 'select', label: 'Test light', options: [['He–Ne, 632.8 nm', 632.8], ['green, 546 nm', 546.1], ['sodium, 589 nm', 589.3]], value: 632.8 },
        { id: 'map', type: 'check', label: 'Show the true height map beside the fringes', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pv', 'Peak-to-valley error'], ['grade', 'Grade'], ['fr', 'Error in fringes (λ/2 each)'], ['rms', 'r.m.s. error'], ['wf', 'Wavefront error on reflection (2×)'], ['S', 'Strehl ratio of that wavefront']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, lam = V.nm, f = SHAPES[V.type];
        // the extremes and the mean of the shape over the unit disc
        let lo = Infinity, hi = -Infinity, sum = 0, sum2 = 0, cnt = 0, gmin = Infinity;
        const tiltGap = x => V.tilt * lam / 2 * (x + 1) / 2;
        for (let j = 0; j < 41; j++) for (let i = 0; i < 41; i++) { const x = -1 + i / 20, y = -1 + j / 20; if (x * x + y * y > 1) continue; const v = f(x, y); lo = Math.min(lo, v); hi = Math.max(hi, v); sum += v; sum2 += v * v; cnt++; }
        for (let j = 0; j < 41; j++) for (let i = 0; i < 41; i++) { const x = -1 + i / 20, y = -1 + j / 20; if (x * x + y * y > 1) continue; gmin = Math.min(gmin, tiltGap(x) + V.pv * (hi - f(x, y))); }
        const mean = sum / cnt, rmsShape = Math.sqrt(Math.max(0, sum2 / cnt - mean * mean));
        const pv = V.pv * (hi - lo), rms = V.pv * rmsShape;
        const rd = Math.min(V.map ? 0.21 * W : 0.3 * W, 0.34 * H), cy = 0.46 * H, cx1 = V.map ? 0.27 * W : 0.5 * W, cx2 = 0.73 * W;
        const gap = (x, y) => tiltGap(x) + V.pv * (hi - f(x, y)) - gmin;     // a hill closes the gap; the reference touches the highest point
        blit(c, cx1 - rd, cy - rd, 2 * rd, 2 * rd, 150, 150, (u, v) => {
          const x = 2 * u - 1, y = 1 - 2 * v; if (x * x + y * y > 1) return [18, 22, 40];
          return shade(O.colour.wavelength(lam), 0.03 + 0.97 * O.diff.twoBeam(1, 1, 4 * PI * gap(x, y) / lam + PI) / 4);
        });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.arc(cx1, cy, rd, 0, TAU); c.stroke();
        kit.label(c, 'the fringes', cx1, cy - rd - 14, { align: 'center', color: C.text, size: 13, weight: 650 });
        kit.label(c, 'dark where the surfaces touch', cx1 - rd + 4, cy + rd + 16, { color: C.muted, size: 11.5 });
        kit.label(c, 'tilt: gap grows →', cx1 + rd - 4, cy + rd + 32, { align: 'right', color: C.muted, size: 11.5 });
        if (V.map) {
          blit(c, cx2 - rd, cy - rd, 2 * rd, 2 * rd, 150, 150, (u, v) => {
            const x = 2 * u - 1, y = 1 - 2 * v; if (x * x + y * y > 1) return [18, 22, 40];
            const t = hi > lo ? (f(x, y) - lo) / (hi - lo) : 0.5;
            return [60 + 195 * t, 90 + 100 * (1 - Math.abs(2 * t - 1)), 255 - 195 * t];
          });
          c.strokeStyle = C.axis; c.beginPath(); c.arc(cx2, cy, rd, 0, TAU); c.stroke();
          kit.label(c, 'the true error (low blue, high red)', cx2, cy - rd - 14, { align: 'center', color: C.text, size: 13, weight: 650 });
        }
        kit.label(c, 'one fringe = λ/2 = ' + (lam / 2).toFixed(0) + ' nm of height', W / 2, 0.93 * H, { align: 'center', color: C.muted, size: 12.5 });
        const w = 2 * rms, Sr = Math.exp(-Math.pow(2 * PI * w / lam, 2));
        ro.set('pv', pv.toFixed(0) + ' nm');
        ro.set('grade', pv < 1 ? 'perfect' : 'flat to λ/' + (lam / pv).toFixed(1) + '  (at ' + lam.toFixed(1) + ' nm)');
        ro.set('fr', (pv / (lam / 2)).toFixed(2));
        ro.set('rms', rms.toFixed(1) + ' nm = λ/' + (rms > 0.01 ? (lam / rms).toFixed(0) : '∞'));
        ro.set('wf', (2 * pv).toFixed(0) + ' nm peak-to-valley');
        ro.set('S', Sr.toFixed(3) + (Sr >= 0.8 ? '  (diffraction-limited)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ speckle */
  // a small 2-D FFT (radix 2) and a seeded random-number generator, for the speckle patterns
  const rng32 = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const NS = 128, TW = { c: new Float64Array(NS / 2), s: new Float64Array(NS / 2) };
  for (let k = 0; k < NS / 2; k++) { TW.c[k] = Math.cos(TAU * k / NS); TW.s[k] = Math.sin(TAU * k / NS); }
  function fft1(re, im) {
    const n = NS;
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit;
      if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const half = len >> 1, step = n / len;
      for (let i = 0; i < n; i += len) for (let k = 0; k < half; k++) {
        const wr = TW.c[k * step], wi = -TW.s[k * step], a = i + k, b = a + half;
        const xr = re[b] * wr - im[b] * wi, xi = re[b] * wi + im[b] * wr;
        re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
      }
    }
  }
  const tre = new Float64Array(NS), tim = new Float64Array(NS);
  function fft2(re, im) {
    for (let y = 0; y < NS; y++) { for (let x = 0; x < NS; x++) { tre[x] = re[y * NS + x]; tim[x] = im[y * NS + x]; } fft1(tre, tim); for (let x = 0; x < NS; x++) { re[y * NS + x] = tre[x]; im[y * NS + x] = tim[x]; } }
    for (let x = 0; x < NS; x++) { for (let y = 0; y < NS; y++) { tre[y] = re[y * NS + x]; tim[y] = im[y * NS + x]; } fft1(tre, tim); for (let y = 0; y < NS; y++) { re[y * NS + x] = tre[y]; im[y * NS + x] = tim[y]; } }
  }
  const lnFact = M => { let s = 0; for (let k = 2; k < M; k++) s += Math.log(k); return s; };       // ln Γ(M) = ln (M − 1)!

  Hyper.sim('in-speckle', {
    title: 'Speckle: random interference from a rough surface',
    blurb: `A laser lights a rough surface (random phase at every point of the lens aperture); the picture is what a camera sees. Each frame is the intensity of the sum of many waves of random phase, computed with a Fourier transform. The graph is the histogram of the brightness of the pixels, against the theory curve.

**Try this**
- With one pattern (M = 1): the contrast is 1, the most common value is *dark*, and the histogram follows the falling exponential e^(−I). About 10 % of the pixels are darker than a tenth of the mean.
- Raise the **f-number**: the lens aperture shrinks (see the white circle) and the grains grow, in proportion to λN. The dashed circle is the Airy disc of the lens: the grain is about its size.
- Raise **M**, the number of independent patterns averaged: the picture smooths, the contrast falls as 1/√M and the histogram narrows around the mean.
- Press *New surface*: a different random pattern, with the same statistics.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, blit = makeBlit();
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 340 });
      const PXUM = 0.8, MAXM = 64;
      let seed = 12345, frames = [], framesD = -1;
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'f-number of the lens', min: 4, max: 32, value: 8, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'nm', label: 'Wavelength', min: 450, max: 650, step: 5, value: 633, unit: 'nm' },
        { id: 'M', label: 'Independent patterns averaged M', min: 1, max: MAXM, step: 1, value: 1 },
        { type: 'buttons', items: [{ id: 'new', label: 'New surface', primary: true }] }
      ], id => { if (id === 'new') { seed = (seed * 1664525 + 1013904223) >>> 0; framesD = -1; } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['grain', 'Airy radius 1.22 λN (the grain)'], ['C', 'Contrast σ/mean, measured'], ['Cth', 'Contrast expected 1/√M'], ['dark', 'Pixels darker than 0.1 of the mean'], ['bright', 'Pixels brighter than the mean']]);
      const plot = kit.plot(box.side, { x: { label: 'intensity ÷ mean', min: 0, max: 4 }, y: { label: 'probability density' } }, 170);
      const gen = D => {
        const rnd = rng32(seed + frames.length * 7919), re = new Float64Array(NS * NS), im = new Float64Array(NS * NS), c0 = NS / 2;
        for (let y = 0; y < NS; y++) for (let x = 0; x < NS; x++) { const dx = x - c0, dy = y - c0; if (dx * dx + dy * dy <= D * D / 4) { const ph = rnd() * TAU; re[y * NS + x] = Math.cos(ph); im[y * NS + x] = Math.sin(ph); } }
        fft2(re, im);
        const I = new Float32Array(NS * NS); let mean = 0;
        for (let k = 0; k < NS * NS; k++) { I[k] = re[k] * re[k] + im[k] * im[k]; mean += I[k]; }
        mean /= NS * NS; if (mean > 0) for (let k = 0; k < NS * NS; k++) I[k] /= mean;
        return I;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, nm = V.nm, M = Math.round(V.M);
        // the aperture that makes grains of the Airy radius: D = n · pixel size / (λ N), in pixels of the aperture plane
        const D = clamp(Math.round(NS * PXUM / (nm / 1000 * V.N)), 4, NS / 2);
        if (framesD !== D) { frames = []; framesD = D; }
        while (frames.length < M) frames.push(gen(D));
        const avg = new Float32Array(NS * NS); for (let m = 0; m < M; m++) { const f = frames[m]; for (let k = 0; k < NS * NS; k++) avg[k] += f[k] / M; }
        let mean = 0, s2 = 0, dark = 0, bright = 0; for (let k = 0; k < NS * NS; k++) mean += avg[k]; mean /= NS * NS;
        for (let k = 0; k < NS * NS; k++) { const v = avg[k]; s2 += (v - mean) * (v - mean); if (v < 0.1 * mean) dark++; if (v > mean) bright++; }
        const Cm = Math.sqrt(s2 / (NS * NS)) / mean, rgb = O.colour.wavelength(nm);
        const side = Math.min(0.56 * W, 0.86 * H), x0 = 0.04 * W, y0 = 0.1 * H;
        blit(c, x0, y0, side, side, NS, NS, (u, v) => { const val = avg[Math.min(NS - 1, Math.floor(v * NS)) * NS + Math.min(NS - 1, Math.floor(u * NS))] / mean; return shade(rgb, Math.pow(clamp(val / 2.6, 0, 1), 0.8)); });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, y0, side, side);
        kit.label(c, 'what the camera sees (' + (NS * PXUM).toFixed(0) + ' µm across)', x0, y0 - 14, { color: C.muted, size: 12 });
        const pxPerUm = side / (NS * PXUM), rA = O.diff.airyRadius(nm, V.N) * 1e6;           // µm
        c.save(); c.strokeStyle = '#fff'; c.lineWidth = 1.4; c.setLineDash([4, 3]); c.beginPath(); c.arc(x0 + 12 + rA * pxPerUm, y0 + side - 12 - rA * pxPerUm, Math.max(1, rA * pxPerUm), 0, TAU); c.stroke(); c.restore();
        kit.label(c, 'Airy disc', x0 + 16 + 2 * rA * pxPerUm, y0 + side - 14 - rA * pxPerUm, { color: '#fff', size: 11, bg: 'rgba(0,0,0,0.4)' });
        // the lens aperture, as a white disc in a square
        const ax = x0 + side + 0.06 * W, ay = y0 + 0.3 * H, as = 0.17 * W;
        c.strokeStyle = C.axis; c.strokeRect(ax, ay, as, as); c.fillStyle = C.text; c.beginPath(); c.arc(ax + as / 2, ay + as / 2, as / 2 * D / (NS / 2), 0, TAU); c.fill();
        kit.label(c, 'the lens aperture', ax + as / 2, ay - 12, { align: 'center', color: C.muted, size: 12 });
        kit.label(c, 'f/' + kit.fmt(V.N, 2) + ': smaller means coarser grains', ax + as / 2, ay + as + 16, { align: 'center', color: C.faint, size: 11 });
        kit.label(c, M === 1 ? 'one pattern' : M + ' patterns averaged', ax + as / 2, ay + as + 40, { align: 'center', color: C.text, size: 13, weight: 650 });
        ro.set('grain', rA.toFixed(1) + ' µm  (' + (rA / PXUM).toFixed(1) + ' picture pixels)');
        ro.set('C', Cm.toFixed(3));
        ro.set('Cth', (1 / Math.sqrt(M)).toFixed(3));
        ro.set('dark', (100 * dark / (NS * NS)).toFixed(1) + ' %  (9.5 % for one pattern)');
        ro.set('bright', (100 * bright / (NS * NS)).toFixed(1) + ' %  (37 % for one pattern)');
        // histogram of I / mean against the theory (a gamma distribution of order M)
        const nb = 40, hist = new Array(nb).fill(0), bw = 4 / nb;
        for (let k = 0; k < NS * NS; k++) { const b = Math.floor(avg[k] / mean / bw); if (b >= 0 && b < nb) hist[b]++; }
        const meas = hist.map((h, i) => [(i + 0.5) * bw, h / (NS * NS * bw)]), th = [], lg = lnFact(M);
        for (let i = 0; i <= 80; i++) { const x = 4 * i / 80; th.push([x, x <= 0 ? (M === 1 ? 1 : 0) : Math.exp(M * Math.log(M) + (M - 1) * Math.log(x) - M * x - lg)]); }
        plot.set({ series: [{ pts: meas, color: C.series[0], width: 1.8, dots: true, label: 'this picture' }, { pts: th, color: C.warn, width: 1.6, dash: true, label: 'theory' }], x: { label: 'intensity ÷ mean', min: 0, max: 4 }, y: { label: 'probability density' } });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
