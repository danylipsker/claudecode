/* HYPER-OPTICS · sims/image-quality-and-mtf.js — simulations of the topic "Image quality and MTF".
 *   iq-resolve-contrast  two lenses imaging bar groups: the limit of resolution against the contrast kept at each scale
 *   iq-line-pairs        a bar pattern against the pixels of a sensor: lp/mm, cycles per pixel, line widths per picture height
 *   iq-psf               a scene convolved with a point-spread function (Airy, Gaussian, disc, motion, coma); LSF and ESF
 *   iq-mtf-bars          a sine or bar target through a lens: modulation in, modulation out, the profile and the MTF curve
 *   iq-mtf-budget        lens, aberrations, focus, motion, pixel and filter multiplied into the system MTF (and the perfect lens alone)
 *   iq-aliasing          a pattern sampled by pixels: false coarse patterns, the zone plate, the low-pass filter
 *   iq-mtf-chart         a maker's MTF chart: sagittal and tangential lines against image height
 *   iq-slanted-edge      the slanted-edge method: edge image, edge spread, line spread, the recovered MTF
 *   iq-distortion-grid   a checkerboard through a lens with radial distortion, and its calibration
 *   iq-shading           cos⁴ fall-off, vignetting and flat-field correction
 *   iq-bokeh             the shape and size of the blur discs of out-of-focus highlights
 * Numbers come from kit.optics (O.mtf, O.diff, O.cam); drawing from kit.osym. The local numerics are small: the
 * convolution of a tiny scene with a kernel, the discrete Fourier transform of a line-spread function, a few sums.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * Math.PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = (v, s) => Number.isFinite(v) ? String(+Number(v).toPrecision(s || 3)) : '—';
  const pct = x => Number.isFinite(x) ? (100 * x).toFixed(Math.abs(x) < 0.095 ? 1 : 0) + ' %' : '—';
  const um = v => Number.isFinite(v) ? (Math.abs(v) < 10 ? v.toFixed(2) : v.toFixed(1)) + ' µm' : '—';
  const lpmm = v => Number.isFinite(v) ? fmt(v, 3) + ' lp/mm' : '—';
  const grey = v => { const k = Math.round(255 * clamp(v, 0, 1)); return 'rgb(' + k + ',' + k + ',' + k + ')'; };

  /* a rising-frequency bar pattern (a chirp) across w pixels: the local frequency is F·u, the contrast gain(ν) */
  function chirp(c, x, y, w, h, F, gain) {
    const Lx = 200 / F;                                     // mm, so that the pattern ends near 0.33 cycles per pixel
    for (let i = 0; i < w; i++) {
      const u = (i + 0.5) / w, g = gain(F * u);
      c.fillStyle = grey(0.5 + 0.5 * g * Math.cos(TAU * F * Lx * u * u / 2));
      c.fillRect(x + i, y, 1.25, h);
    }
  }
  const niceStep = (span, n) => (typeof Hyper !== 'undefined' && Hyper.niceStep) ? Hyper.niceStep(span, n) : span / n;

  /* ================================================================ resolution against contrast */
  Hyper.sim('iq-resolve-contrast', {
    title: 'Two lenses: the limit of resolution against the contrast kept',
    blurb: `Two lenses image the same groups of bars, finer from left to right. **Lens A** is a little soft everywhere (a Gaussian blur). **Lens B** is very sharp but hazy: a share of its light is spread into a broad halo. Under each group is the contrast that survives; a group is outlined green while it is above the contrast you can still see, red when it has faded below. The pictures are made of sine-wave bars; the curves are the two lenses' MTF.

**Try this**
- At the start, lens B "resolves" five times finer, yet at 5 and 10 lp/mm lens A has the **higher contrast**. The curves cross near 20 lp/mm: which lens is better depends on the scale of detail you care about.
- Raise *the smallest contrast you can see* to 30 %: both limits fall, A to about 31 lp/mm and B to about 131. The limit of resolution is where a curve meets that line.
- Take the halo of lens B to zero: it becomes a perfect f/5.6 lens, better than A at every frequency. Increase the halo to 70 % and its contrast at coarse detail drops steeply while its fine-detail limit hardly moves.
- Make lens A sharper (a blur of 3 µm): the crossing moves out to about 67 lp/mm, so A now has the better contrast over most of the range that matters for prints, while B still resolves farther.`,
    mount(box, kit, params) {
      const O = kit.optics, Mt = O.mtf;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 250, maxH: 340 });
      const plot = kit.plot(box.stage, { x: { label: 'spatial frequency (lp/mm)', name: 'ν', min: 0, max: 150 }, y: { label: 'MTF', name: 'MTF', min: 0, max: 1.02 }, series: [] }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'sigA', label: 'Lens A: Gaussian blur, standard deviation', min: 2, max: 15, step: 0.5, value: params.sigA || 8, unit: 'µm' },
        { id: 'halo', label: 'Lens B: share of the light in a halo', min: 0, max: 70, step: 1, value: params.halo != null ? params.halo : 40, unit: '%' },
        { id: 'thr', label: 'Smallest contrast you can still see', min: 2, max: 40, step: 1, value: params.thr || 10, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['la', 'Lens A resolves to'], ['lb', 'Lens B resolves to'], ['a10', 'Contrast at 10 lp/mm: A · B'], ['a30', 'Contrast at 30 lp/mm: A · B'], ['cross', 'The curves cross at']]);
      const GROUPS = [5, 10, 20, 30, 45, 60, 90, 130, 190, 280];
      const A = nu => Mt.gaussian(nu, V.sigA * 1e-3);
      const B = nu => (1 - V.halo / 100) * Mt.diffraction(nu, 550, 5.6) + V.halo / 100 * Mt.gaussian(nu, 0.03);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, thr = V.thr / 100;
        const lw = 54, gap = 6, bw = (W - lw - 10 - (GROUPS.length - 1) * gap) / GROUPS.length, rh = Math.min(74, (Hh - 92) / 2);
        const rows = [['Lens A', A, 28], ['Lens B', B, 28 + rh + 30]];
        kit.label(c, 'lp/mm', 6, 12, { color: C.muted, size: 11.5 });
        GROUPS.forEach((nu, g) => kit.label(c, String(nu), lw + g * (bw + gap) + bw / 2, 12, { align: 'center', color: C.muted, size: 11.5 }));
        for (const [name, f, y0] of rows) {
          kit.label(c, name, 6, y0 + rh / 2, { color: C.text, weight: 650 });
          GROUPS.forEach((nu, g) => {
            const x0 = lw + g * (bw + gap), m = f(nu);
            for (let i = 0; i < bw; i++) { c.fillStyle = grey(0.5 + 0.5 * m * Math.cos(TAU * 4 * (i + 0.5) / bw)); c.fillRect(x0 + i, y0, 1.2, rh); }
            c.strokeStyle = m >= thr ? C.ok : C.bad; c.lineWidth = 2; c.strokeRect(x0 - 1, y0 - 1, bw + 2, rh + 2);
            kit.label(c, m.toFixed(2), x0 + bw / 2, y0 + rh + 12, { align: 'center', color: m >= thr ? C.ok : C.bad, size: 11.5, weight: 600 });
          });
        }
        kit.label(c, 'each group: four line pairs; below it the modulation kept (green: above your threshold)', lw, Hh - 6, { color: C.faint, size: 11, baseline: 'bottom' });
        const la = Mt.mtf50(A, 800, thr), lb = Mt.mtf50(B, 800, thr);
        let cross = NaN;
        for (let nu = 1; nu < 300; nu += 0.5) if ((A(nu) - B(nu)) * (A(nu + 0.5) - B(nu + 0.5)) <= 0) { cross = nu; break; }
        ro.set('la', lpmm(la)); ro.set('lb', lpmm(lb));
        ro.set('a10', A(10).toFixed(2) + ' · ' + B(10).toFixed(2)); ro.set('a30', A(30).toFixed(2) + ' · ' + B(30).toFixed(2));
        ro.set('cross', Number.isFinite(cross) ? lpmm(cross) + ' (A is better below, B above)' : 'they do not cross');
        const pa = [], pb = [];
        for (let nu = 0; nu <= 150; nu += 1.5) { pa.push([nu, A(nu)]); pb.push([nu, B(nu)]); }
        plot.set({ series: [{ pts: pa, label: 'Lens A', color: C.series[0] }, { pts: pb, label: 'Lens B', color: C.series[1] }], hlines: [{ y: thr, label: 'what you can see' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ line pairs and pixels */
  Hyper.sim('iq-line-pairs', {
    title: 'Line pairs, pixels and magnification',
    blurb: `A bar pattern lands on a sensor. The picture is a window twelve pixels wide: the bars are drawn at their true size against the pixel boundaries, so you can count pixels per line pair. The read-outs give the same pattern in every dialect: line pairs per millimetre, the period, cycles per pixel, line widths per picture height, and what it was on the object before the lens shrank it.

**Try this**
- Press **Nyquist**: one line pair is exactly two pixels, 0.5 cycles per pixel. Push beyond it and the pattern is finer than the pixels can follow (it will come back as false coarse bars, see the page on aliasing).
- Halve the pixel pitch at a fixed frequency: cycles per pixel halve.
- Move the magnification: a pattern of 100 lp/mm on the sensor was only 10 lp/mm on the object at m = 0.1; at m = 1 it is the same on both.
- Check the picture height: 24 mm at 100 lp/mm is 2 400 line pairs, 4 800 line widths.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.33, minH: 200, maxH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'nu', label: 'Spatial frequency on the sensor', min: 5, max: 400, value: params.nu || 50, log: true, sig: 3, unit: 'lp/mm' },
        { id: 'p', label: 'Pixel pitch', min: 1, max: 10, step: 0.05, value: params.p || 5, unit: 'µm' },
        { id: 'm', label: 'Magnification of the lens', min: 0.01, max: 2, value: params.m || 0.2, log: true, sig: 2 },
        { id: 'H', label: 'Picture height on the sensor', min: 3, max: 40, step: 0.5, value: params.H || 24, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'nyq', label: 'Nyquist of this sensor', primary: true }, { id: 'half', label: 'Half of Nyquist' }, { id: 'twice', label: 'Twice Nyquist' }] }
      ], id => {
        const nyq = O.mtf.nyquist(V.p);
        if (id === 'nyq') ctl.set('nu', clamp(nyq, 5, 400)); else if (id === 'half') ctl.set('nu', clamp(nyq / 2, 5, 400)); else if (id === 'twice') ctl.set('nu', clamp(nyq * 2, 5, 400));
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['per', 'Period of one line pair'], ['line', 'Width of one line'], ['obj', 'On the object, at this magnification'], ['cpp', 'Cycles per pixel'], ['ppl', 'Pixels per line pair'], ['lw', 'Line widths per picture height'], ['lp', 'Line pairs per picture height'], ['nyq', 'Nyquist frequency of this sensor']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const per = 1000 / V.nu, cpp = V.nu * V.p / 1000, nyq = O.mtf.nyquist(V.p);
        const x0 = 18, w = W - 36, y0 = 44, bh = Math.min(70, Hh * 0.3), NP = 12, pxW = w / NP;
        // the bars, as they fall on twelve pixels
        for (let i = 0; i < w; i++) { const t = (i + 0.5) / pxW * V.p * V.nu / 1000; c.fillStyle = (t - Math.floor(t)) < 0.5 ? (C.dark ? '#f2f2f2' : '#fdfdfd') : (C.dark ? '#0b0b0f' : '#15151c'); c.fillRect(x0 + i, y0, 1.2, bh); }
        // the pixels, below
        c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(x0, y0 + bh + 10, w, pxW);
        c.beginPath(); for (let k = 1; k < NP; k++) { c.moveTo(x0 + k * pxW, y0 + bh + 10); c.lineTo(x0 + k * pxW, y0 + bh + 10 + pxW); } c.stroke();
        c.strokeStyle = C.faint; c.setLineDash([2, 4]); c.beginPath(); for (let k = 0; k <= NP; k++) { c.moveTo(x0 + k * pxW, y0 - 2); c.lineTo(x0 + k * pxW, y0 + bh + 10); } c.stroke(); c.setLineDash([]);
        kit.label(c, 'twelve pixels of ' + V.p.toFixed(2) + ' µm: the window is ' + (12 * V.p).toFixed(1) + ' µm wide', x0, y0 + bh + 10 + pxW + 14, { color: C.muted, size: 11.5 });
        // one line pair and one pixel
        const perPx = per / V.p * pxW;
        if (perPx >= 14) S.dim(c, x0, y0 - 12, x0 + perPx, y0 - 12, 'one line pair = ' + um(per), { off: 0 });
        else kit.label(c, 'one line pair = ' + um(per) + ' (too fine to bracket at this scale)', x0, y0 - 14, { color: C.muted, size: 11.5 });
        if (cpp > 0.5) kit.label(c, 'beyond the Nyquist frequency: the pixels cannot follow this pattern', W / 2, Hh - 12, { align: 'center', color: C.bad, weight: 650 });
        else kit.label(c, cpp > 0.45 ? 'at the Nyquist limit: one line pair per two pixels' : 'within what the pixels can carry', W / 2, Hh - 12, { align: 'center', color: cpp > 0.45 ? C.warn : C.ok, weight: 650 });
        ro.set('per', um(per)); ro.set('line', um(per / 2)); ro.set('obj', lpmm(V.nu * V.m));
        ro.set('cpp', cpp.toFixed(3)); ro.set('ppl', (per / V.p).toFixed(2));
        ro.set('lw', fmt(2 * V.nu * V.H, 4)); ro.set('lp', fmt(V.nu * V.H, 4)); ro.set('nyq', lpmm(nyq));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the point-spread function */
  Hyper.sim('iq-psf', {
    title: 'The point-spread function: a scene convolved with a blur',
    blurb: `A small scene on a patch of sensor (72 × 44 µm, one cell = 1 µm): bright points, a close pair, a thin line, a square, two groups of bars. Each point of it is replaced by a copy of the **point-spread function** (middle panel, brightness lifted so the faint rings show) and the copies are added: that is the picture on the right. The graph is the PSF's line-spread function (what a thin line becomes) and its running sum, the edge-spread function (what a sharp edge becomes).

**Try this**
- *Perfect lens (Airy)* at f/2.8: the pair is cleanly resolved. Close the aperture to f/16: the pair merges into one blob, and the bars fade, though nothing is wrong with the lens.
- Switch to *Defocus disc* and widen it: the edge ramp (see the graph) becomes a long, nearly straight slope instead of a smooth S.
- *Motion* smears along the horizontal only: vertical lines blur, horizontal ones do not.
- *Coma* gives a comet with a tail on one side: the edge-spread function is lopsided and the point images shift.
- Watch the read-outs: the **10–90 % edge width** and the **FWHM** describe the blur in space; the **MTF50** (from the Fourier transform of the LSF) describes it in frequency.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220, maxH: 330 });
      const plot = kit.plot(box.stage, { x: { label: 'position across the blur (µm)', name: 'x', min: -24, max: 24 }, y: { label: 'relative response', name: 'y', min: -0.02, max: 1.05 }, series: [] }, 170);
      const NX = 72, NY = 44, R = 24, NK = 2 * R + 1;
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'The blur', options: [['Perfect lens (Airy disc)', 'airy'], ['Gaussian blur', 'gauss'], ['Defocus disc', 'disc'], ['Motion smear', 'motion'], ['Coma (a comet)', 'coma']], value: params.kind || 'airy' },
        { id: 'N', label: 'f-number (550 nm)', min: 2.8, max: 22, value: params.N || 8, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'sig', label: 'Standard deviation', min: 0.5, max: 8, step: 0.1, value: 2.5, unit: 'µm' },
        { id: 'dia', label: 'Diameter of the disc', min: 1, max: 24, step: 0.5, value: 8, unit: 'µm' },
        { id: 'len', label: 'Length of the smear', min: 1, max: 24, step: 0.5, value: 10, unit: 'µm' },
        { id: 'tail', label: 'Length of the comet', min: 3, max: 20, step: 0.5, value: 10, unit: 'µm' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const vis = () => { for (const id of ['N', 'sig', 'dia', 'len', 'tail']) ctl.show(id, (V.kind === 'airy' && id === 'N') || (V.kind === 'gauss' && id === 'sig') || (V.kind === 'disc' && id === 'dia') || (V.kind === 'motion' && id === 'len') || (V.kind === 'coma' && id === 'tail')); };
      vis();
      const ro = kit.readout(box.side, [['fwhm', 'Width of the line-spread function (FWHM)'], ['edge', 'Edge width, 10 % to 90 %'], ['peak', 'Peak of a point, relative to a sharp point'], ['mtf', 'MTF50, from the Fourier transform of the LSF'], ['airy', 'Airy disc diameter at this f-number']]);
      // the scene: points, a pair, a line, a square, two bar groups
      const scene = new Float64Array(NX * NY);
      const put = (x, y, v) => { if (x >= 0 && x < NX && y >= 0 && y < NY) scene[y * NX + x] = v; };
      put(8, 8, 25); put(22, 8, 25); put(29, 8, 25);
      for (let y = 3; y <= 20; y++) { put(41, y, 0.85); for (let x = 50; x <= 68; x++) put(x, y, 0.7); }
      for (let y = 26; y <= 40; y++) { for (let k = 0; k < 4; k++) for (let x = 6 + 6 * k; x < 9 + 6 * k; x++) put(x, y, 0.9); for (let k = 0; k < 5; k++) for (let x = 32 + 4 * k; x < 34 + 4 * k; x++) put(x, y, 0.9); }
      const ss = [-1 / 3, 0, 1 / 3];
      const kernel = () => {
        const k = new Float64Array(NK * NK);
        const sample = f => { for (let j = 0; j < NK; j++) for (let i = 0; i < NK; i++) { let s = 0; for (const a of ss) for (const b of ss) s += f(i - R + a, j - R + b); k[j * NK + i] = s / 9; } };
        if (V.kind === 'airy') sample((x, y) => O.diff.airy(PI * Math.hypot(x, y) / (0.55 * V.N)));
        else if (V.kind === 'gauss') sample((x, y) => Math.exp(-(x * x + y * y) / (2 * V.sig * V.sig)));
        else if (V.kind === 'disc') sample((x, y) => Math.hypot(x, y) <= V.dia / 2 ? 1 : 0);
        else if (V.kind === 'motion') sample((x, y) => (Math.abs(y) <= 0.5 && Math.abs(x) <= V.len / 2) ? 1 : 0);
        else {                                               // coma: the third-order comet, tip at the centre, tail towards +x
          const K = V.tail / 3;
          for (let a = 1; a <= 40; a++) { const rho = a / 40; for (let b = 0; b < 160; b++) { const phi = TAU * b / 160; const X = K * rho * rho * (2 + Math.cos(2 * phi)), Y = K * rho * rho * Math.sin(2 * phi); const i = Math.round(X) + R, j = Math.round(Y) + R; if (i >= 0 && i < NK && j >= 0 && j < NK) k[j * NK + i] += rho; } }
        }
        let tot = 0; for (let i = 0; i < k.length; i++) tot += k[i];
        if (tot > 0) for (let i = 0; i < k.length; i++) k[i] /= tot; else k[R * NK + R] = 1;
        return k;
      };
      let memo = { key: '' };
      const model = () => {
        const key = [V.kind, V.N, V.sig, V.dia, V.len, V.tail].join('|');
        if (memo.key === key) return memo;
        const k = kernel(), out = new Float64Array(NX * NY);
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          const s = scene[j * NX + i]; if (s === 0) continue;
          for (let dj = -R; dj <= R; dj++) { const jj = j + dj; if (jj < 0 || jj >= NY) continue; const kr = (dj + R) * NK + R, orow = jj * NX; for (let di = -R; di <= R; di++) { const ii = i + di; if (ii < 0 || ii >= NX) continue; out[orow + ii] += s * k[kr + di]; } }
        }
        const lsf = new Float64Array(NK); for (let j = 0; j < NK; j++) for (let i = 0; i < NK; i++) lsf[i] += k[j * NK + i];
        const esf = new Float64Array(NK); let run = 0; for (let i = 0; i < NK; i++) { run += lsf[i]; esf[i] = run; }
        const lmax = Math.max.apply(null, lsf);
        // widths by linear interpolation
        let ip = 0; for (let i = 0; i < NK; i++) if (lsf[i] === lmax) ip = i;
        let l = ip, r = ip; while (l > 0 && lsf[l] > lmax / 2) l--; while (r < NK - 1 && lsf[r] > lmax / 2) r++;
        const xl = l + (lmax / 2 - lsf[l]) / ((lsf[l + 1] - lsf[l]) || 1), xr = r - 1 + (lsf[r - 1] - lmax / 2) / ((lsf[r - 1] - lsf[r]) || 1);
        const fwhm = Math.max(0.5, xr - xl);
        const at = lev => { for (let i = 1; i < NK; i++) if (esf[i] >= lev && esf[i - 1] < lev) return i - 1 + (lev - esf[i - 1]) / ((esf[i] - esf[i - 1]) || 1); return NaN; };
        const edge = at(0.9) - at(0.1);
        // MTF50 from the DFT of the LSF (sample spacing 1 µm, so frequencies in cycles/mm are 1000 × cycles per µm)
        let mtf50 = NaN, prev = 1, pnu = 0;
        for (let nu = 2; nu <= 500; nu += 2) {
          let cs = 0, sn = 0; for (let i = 0; i < NK; i++) { const a = TAU * nu / 1000 * (i - R); cs += lsf[i] * Math.cos(a); sn += lsf[i] * Math.sin(a); }
          const m = Math.hypot(cs, sn); if (m < 0.5) { mtf50 = pnu + (prev - 0.5) / ((prev - m) || 1) * 2; break; } prev = m; pnu = nu;
        }
        const pts = [], pe = []; for (let i = 0; i < NK; i++) { pts.push([i - R, lsf[i] / lmax]); pe.push([i - R, esf[i]]); }
        memo = { key, k, out, fwhm, edge, kmax: Math.max.apply(null, k), mtf50, pts, pe };
        return memo;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, m = model();
        const gap = 10, pw = (W - 4 * gap) / 3, ph = pw * NY / NX, y0 = Math.max(24, (Hh - ph) / 2 + 6);
        const px = i => gap + i * (pw + gap + 0);
        const frame = (x, y, w, h) => { c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1); };
        S.image(c, px(0), y0, pw, ph, NX, NY, (u, v) => scene[Math.floor(v * NY) * NX + Math.floor(u * NX)] / 1.0, { gamma: 0.6, smooth: false }); frame(px(0), y0, pw, ph);
        const kmx = m.kmax || 1, side = Math.min(pw, ph), kx = px(1) + (pw - side) / 2, ky = y0 + (ph - side) / 2, vh = 21;
        S.image(c, kx, ky, side, side, 2 * vh + 1, 2 * vh + 1, (u, v) => m.k[(Math.floor(v * (2 * vh + 1)) + R - vh) * NK + Math.floor(u * (2 * vh + 1)) + R - vh] / kmx, { gamma: 0.45, smooth: false }); frame(kx, ky, side, side);
        S.image(c, px(2), y0, pw, ph, NX, NY, (u, v) => m.out[Math.floor(v * NY) * NX + Math.floor(u * NX)], { gamma: 0.6, smooth: true }); frame(px(2), y0, pw, ph);
        const cap = (i, t) => kit.label(c, t, px(i) + pw / 2, y0 - 10, { align: 'center', color: C.muted, size: 11.5 });
        cap(0, 'the scene (one cell = 1 µm)'); cap(1, 'the PSF, 43 × 43 µm, brightness lifted'); cap(2, 'the image = scene ∗ PSF');
        kit.label(c, 'the scale is the same in the left and right panels: the picture is ' + NX + ' µm wide', px(0), y0 + ph + 14, { color: C.faint, size: 11 });
        ro.set('fwhm', um(m.fwhm)); ro.set('edge', um(m.edge)); ro.set('peak', pct(m.kmax)); ro.set('mtf', lpmm(m.mtf50)); ro.set('airy', um(2 * O.diff.airyRadius(550, V.N) * 1e6));
        plot.set({ series: [{ pts: m.pts, label: 'line-spread function', color: C.series[0] }, { pts: m.pe, label: 'edge-spread function', color: C.series[1], dash: true }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ modulation in, modulation out */
  Hyper.sim('iq-mtf-bars', {
    title: 'From modulation to MTF: a target through a lens',
    blurb: `A grating of bright and dark bars is imaged by a lens (a perfect lens of the chosen f-number plus a little extra blur). The top strip is the target as it is, the lower one is the image the lens makes of it, six periods of each, and the graph below shows the intensity along both. The MTF at this frequency is simply (swing in the image) ÷ (swing in the target). The curve at the bottom is the MTF of the lens at all frequencies, with a marker at the one you chose.

**Try this**
- Slide the frequency up from 2 lp/mm: the image swing shrinks steadily and the bars go grey. The mean level never changes.
- Lower the target contrast to 20 %: the swing falls, but the **ratio** (the MTF) does not. That is why the MTF belongs to the lens and not to the target.
- Switch to *bars*: the image keeps more contrast than the sine wave did (the dashed curve, the contrast transfer function, lies above the MTF) and shows rounded corners and ripples: the high harmonics are being cut.
- Push the frequency to the lens's cut-off (the last read-out; 227 lp/mm at f/8): the image is a uniform grey. Beyond it nothing at all passes.`,
    mount(box, kit, params) {
      const O = kit.optics, Mt = O.mtf;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300, maxH: 400 });
      const plot = kit.plot(box.stage, { x: { label: 'spatial frequency (lp/mm)', name: 'ν', min: 0, max: 200 }, y: { label: 'MTF', name: 'MTF', min: 0, max: 1.02 }, series: [] }, 180);
      const ctl = kit.controls(box.side, [
        { id: 'nu', label: 'Spatial frequency of the target', min: 2, max: 400, value: params.nu || 40, log: true, sig: 3, unit: 'lp/mm' },
        { id: 'N', label: 'f-number of the (otherwise perfect) lens', min: 1.4, max: 32, value: params.N || 5.6, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'sig', label: 'Extra blur from aberrations, standard deviation', min: 0, max: 8, step: 0.1, value: params.sig != null ? params.sig : 2, unit: 'µm' },
        { id: 'mo', label: 'Contrast of the target', min: 20, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'wave', type: 'select', label: 'Target', options: [['Sine-wave grating', 'sine'], ['Bars (square wave)', 'bars']], value: params.wave || 'sine' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['per', 'Period of the target on the sensor'], ['mtf', 'MTF · CTF at this frequency'], ['mo', 'Modulation of the target'], ['mi', 'Modulation of the image'], ['lv', 'Image levels: brightest · darkest'], ['m50', 'MTF50 of this lens'], ['cut', 'Cut-off of the perfect lens']]);
      const mtf = f => Mt.diffraction(f, 550, V.N) * Mt.gaussian(f, V.sig * 1e-3);
      const ctf = f => { let s = 0; for (let k = 1; k <= 61; k += 2) s += (k % 4 === 1 ? 1 : -1) / k * mtf(k * f); return 4 / PI * s; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, NC = 6, mo = V.mo / 100, bars = V.wave === 'bars', nu = V.nu;
        const sObj = th => bars ? (Math.cos(th) >= 0 ? 1 : -1) : Math.cos(th);
        const mn = mtf(nu);
        const sImg = th => { if (!bars) return mn * Math.cos(th); let s = 0; for (let k = 1; k <= 61; k += 2) s += (k % 4 === 1 ? 1 : -1) / k * mtf(k * nu) * Math.cos(k * th); return 4 / PI * s; };
        const x0 = 58, w = W - x0 - 14, sh = Math.min(44, Hh * 0.11), y1 = 30, y2 = y1 + sh + 18;
        kit.label(c, 'target', 6, y1 + sh / 2, { color: C.text, weight: 650 }); kit.label(c, 'image', 6, y2 + sh / 2, { color: C.text, weight: 650 });
        const gy0 = y2 + sh + 34, gy1 = Hh - 18, Y = v => gy1 - (gy1 - gy0) * v;
        let mx = -1, mi = 2;
        const po = [], pi = [];
        for (let i = 0; i < w; i++) {
          const th = TAU * NC * (i + 0.5) / w, lo = 0.5 + 0.5 * mo * sObj(th), li = 0.5 + 0.5 * mo * sImg(th);
          c.fillStyle = grey(lo); c.fillRect(x0 + i, y1, 1.2, sh); c.fillStyle = grey(li); c.fillRect(x0 + i, y2, 1.2, sh);
          if (i % 2 === 0) { po.push([x0 + i, Y(lo)]); pi.push([x0 + i, Y(li)]); }
          if (th > TAU && th < 3 * TAU) { mx = Math.max(mx, li); mi = Math.min(mi, li); }
        }
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(x0 - 0.5, y1 - 0.5, w + 1, sh + 1); c.strokeRect(x0 - 0.5, y2 - 0.5, w + 1, sh + 1);
        // the profile graph
        c.strokeStyle = C.grid; c.beginPath(); for (const v of [0, 0.5, 1]) { c.moveTo(x0, Y(v)); c.lineTo(x0 + w, Y(v)); } c.stroke();
        for (const v of [0, 0.5, 1]) kit.label(c, v.toFixed(1), x0 - 6, Y(v), { align: 'right', color: C.muted, size: 11 });
        kit.label(c, 'intensity along the strip (dashed: target, solid: image)', x0, gy0 - 12, { color: C.muted, size: 11.5 });
        c.save(); c.strokeStyle = C.faint; c.setLineDash([5, 4]); c.lineWidth = 1.4; c.beginPath(); po.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath(); pi.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.warn; c.setLineDash([2, 3]); c.beginPath(); for (const v of [mx, mi]) { c.moveTo(x0, Y(v)); c.lineTo(x0 + w, Y(v)); } c.stroke(); c.restore();
        kit.label(c, 'Imax ' + mx.toFixed(2), x0 + w, Y(mx) - 6, { align: 'right', color: C.warn, size: 11 }); kit.label(c, 'Imin ' + mi.toFixed(2), x0 + w, Y(mi) + 12, { align: 'right', color: C.warn, size: 11 });
        const Mi = (mx - mi) / (mx + mi);
        ro.set('per', um(1000 / nu)); ro.set('mtf', mn.toFixed(3) + ' · ' + ctf(nu).toFixed(3)); ro.set('mo', mo.toFixed(2)); ro.set('mi', Mi.toFixed(3) + (bars ? '  (a bar target: CTF × target)' : '  (= MTF × target)'));
        ro.set('lv', mx.toFixed(2) + ' · ' + mi.toFixed(2)); ro.set('m50', lpmm(Mt.mtf50(mtf, Mt.cutoff(550, V.N), 0.5))); ro.set('cut', lpmm(Mt.cutoff(550, V.N)));
        const F = Math.max(30, Mt.cutoff(550, V.N) * 1.02), pm = [], pc = [];
        for (let i = 0; i <= 140; i++) { const f = F * i / 140; pm.push([f, mtf(f)]); pc.push([f, ctf(f)]); }
        const series = [{ pts: pm, label: 'MTF (sine waves)', color: C.series[0] }];
        if (bars) series.push({ pts: pc, label: 'CTF (bars)', color: C.series[1], dash: true });
        plot.set({ x: { label: 'spatial frequency (lp/mm)', name: 'ν', min: 0, max: F }, series, marks: nu <= F ? [{ x: nu, y: mn, label: 'MTF ' + mn.toFixed(2) }] : [] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the MTF budget */
  Hyper.sim('iq-mtf-budget', {
    title: 'The MTF budget: lens, focus, motion, pixel and filter',
    blurb: `Every stage of the imaging chain has an MTF, and they **multiply**. The graph shows each stage's curve and the system's (thick); the dashed vertical line is the sensor's Nyquist frequency. The two strips are a bar pattern whose fineness rises from left to right, as the target is and as the system renders it, with the same frequency scale as the graph. The bars give the contrast of each stage at the Nyquist frequency. (Opened from the page on the perfect lens, only the lens is shown, with its cut-off, and you can compare apertures and wavelengths.)

**Try this**
- Start as it is: perfect f/5.6 lens, 2 µm of aberrations, 5 µm pixels. The pixel alone passes 0.64 at Nyquist, however good the lens. The system is below each of its parts.
- Add a **motion smear** of 5 µm (one pixel): another 0.64 at Nyquist, and the system MTF drops by about a third.
- Add a **focus error** of 10 µm: its curve has ripples and a first zero at about 122 lp/mm, where the strip goes grey.
- Switch on the **anti-aliasing filter**: its curve is zero exactly at Nyquist; detail above is removed, and a good part of the contrast below goes with it.
- Reduce the pixel pitch to 2 µm: Nyquist moves up to where the lens has nothing left, and the pixels bring no gain.`,
    mount(box, kit, params) {
      const O = kit.optics, Mt = O.mtf;
      const only = !!params.lensOnly;
      const st = kit.stage(box.stage, { aspect: only ? 0.2 : 0.52, minH: only ? 140 : 270, maxH: 380 });
      const plot = kit.plot(box.stage, { x: { label: 'spatial frequency (lp/mm)', name: 'ν', min: 0, max: 200 }, y: { label: 'MTF', name: 'MTF', min: 0, max: 1.02 }, series: [] }, 210);
      const spec = [{ id: 'N', label: 'f-number', min: 1.4, max: 32, value: params.N || (only ? 8 : 5.6), log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) }];
      if (only) spec.push({ id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: 550, unit: 'nm' }, { id: 'p', label: 'Pixel pitch (for the Nyquist mark)', min: 1, max: 10, step: 0.05, value: 3.45, unit: 'µm' }, { id: 'cmp', type: 'check', label: 'Compare with f/2.8, f/5.6, f/11 and f/22', value: true });
      else spec.push({ id: 'sig', label: 'Lens aberrations (Gaussian blur, standard deviation)', min: 0, max: 6, step: 0.1, value: 2, unit: 'µm' }, { id: 'b', label: 'Focus error (diameter of the blur disc)', min: 0, max: 30, step: 0.5, value: 0, unit: 'µm' }, { id: 'L', label: 'Motion smear during the exposure', min: 0, max: 30, step: 0.5, value: 0, unit: 'µm' }, { id: 'p', label: 'Pixel pitch', min: 1, max: 10, step: 0.05, value: 5, unit: 'µm' }, { id: 'olpf', type: 'check', label: 'Anti-aliasing filter (two-point splitter, one pixel)', value: false });
      const ctl = kit.controls(box.side, spec, () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, only
        ? [['cut', 'Cut-off 1/(λN)'], ['m50', 'MTF50 (0.40 of the cut-off)'], ['mid', 'MTF at half the cut-off'], ['nyq', 'Nyquist frequency of the pixels'], ['mn', 'MTF at that Nyquist frequency'], ['air', 'Airy disc diameter 2.44 λN']]
        : [['nyq', 'Nyquist frequency of the pixels'], ['sys', 'System MTF at Nyquist'], ['m50', 'System MTF50'], ['weak', 'The weakest stage at Nyquist'], ['cut', 'Cut-off of the lens']]);
      const stages = () => {
        const nm = only ? V.nm : 550, out = [{ name: 'perfect lens', f: nu => Mt.diffraction(nu, nm, V.N) }];
        if (!only) {
          if (V.sig > 0) out.push({ name: 'aberrations', f: nu => Mt.gaussian(nu, V.sig * 1e-3) });
          if (V.b > 0) out.push({ name: 'focus error', f: nu => Mt.defocus(nu, V.b * 1e-3) });
          if (V.L > 0) out.push({ name: 'motion', f: nu => Mt.motion(nu, V.L * 1e-3) });
          out.push({ name: 'pixel', f: nu => Mt.pixel(nu, V.p) });
          if (V.olpf) out.push({ name: 'anti-aliasing filter', f: nu => Math.cos(PI * nu * V.p * 1e-3) });
        }
        return out;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, S = stages(), nm = only ? V.nm : 550;
        const nyq = Mt.nyquist(V.p), cut = Mt.cutoff(nm, V.N);
        const sys = nu => { let m = 1; for (const s of S) m *= s.f(nu); return m; };
        let F = only ? Math.max(1.1 * cut, V.cmp ? 1.1 * Mt.cutoff(nm, 5.6) : 0, 1.2 * nyq) : 1.6 * nyq;
        F = clamp(F, 40, 1400);
        const x0 = 70, w = W - x0 - 16, sh = Math.min(26, Hh * 0.075), y1 = 22, y2 = y1 + sh + 14;
        const X = nu => x0 + w * nu / F;
        kit.label(c, 'target', 6, y1 + sh / 2, { color: C.text, weight: 650, size: 12.5 }); kit.label(c, 'image', 6, y2 + sh / 2, { color: C.text, weight: 650, size: 12.5 });
        chirp(c, x0, y1, w, sh, F, () => 1); chirp(c, x0, y2, w, sh, F, sys);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(x0 - 0.5, y1 - 0.5, w + 1, sh + 1); c.strokeRect(x0 - 0.5, y2 - 0.5, w + 1, sh + 1);
        const st1 = niceStep(F, 6); for (let v = 0; v <= F + 1e-9; v += st1) kit.label(c, fmt(v, 3), X(v), y2 + sh + 11, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'lp/mm', x0 + w + 2, y2 + sh + 11, { color: C.muted, size: 11, align: 'right' });
        const mark = (nu, col, txt, row) => { if (nu > F) return; c.save(); c.strokeStyle = col; c.lineWidth = 1.6; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(nu), y1 - 4); c.lineTo(X(nu), y2 + sh + 3); c.stroke(); c.restore(); kit.label(c, txt, X(nu) + 3, y1 - 8 + row * 0, { color: col, size: 11, weight: 600 }); };
        mark(nyq, C.accent, 'Nyquist', 0);
        if (only) mark(cut, C.bad, 'cut-off', 0);
        // the contrast of each stage at the Nyquist frequency, as bars
        if (!only) {
          const by0 = y2 + sh + 32, bh = Math.min(20, (Hh - by0 - 12) / (S.length + 1.4)), bx = 150, bw = W - bx - 70;
          kit.label(c, 'contrast kept at the Nyquist frequency (' + fmt(nyq, 3) + ' lp/mm)', 6, by0 - 8, { color: C.muted, size: 11.5 });
          S.concat([{ name: 'SYSTEM', f: sys }]).forEach((s, i) => {
            const v = s.f(nyq), y = by0 + 4 + i * (bh + 4), last = i === S.length;
            kit.label(c, s.name, bx - 8, y + bh / 2, { align: 'right', color: last ? C.text : C.muted, weight: last ? 700 : 500, size: 12 });
            c.fillStyle = C.surface; c.fillRect(bx, y, bw, bh); c.fillStyle = last ? C.accent : C.series[i % 6]; c.fillRect(bx, y, bw * clamp(Math.abs(v), 0, 1), bh);
            kit.label(c, (v < 0 ? '−' : '') + Math.abs(v).toFixed(2), bx + bw + 6, y + bh / 2, { color: C.text, size: 12, weight: last ? 700 : 500 });
          });
        }
        const pts = nu => { const a = []; for (let i = 0; i <= 160; i++) { const f = F * i / 160; a.push([f, nu(f)]); } return a; };
        let series = [];
        if (only) {
          if (V.cmp) [2.8, 5.6, 11, 22].forEach((n, i) => series.push({ pts: pts(f => Mt.diffraction(f, nm, n)), label: 'f/' + n, color: C.series[(i + 1) % 7], dash: true, width: 1.4 }));
          series.push({ pts: pts(sys), label: 'f/' + fmt(V.N, 2) + ' (chosen)', color: C.accent, width: 3.2 });
        } else {
          S.forEach((s, i) => series.push({ pts: pts(s.f), label: s.name, color: C.series[i % 7], dash: true, width: 1.4 }));
          series.push({ pts: pts(sys), label: 'system', color: C.text, width: 3.4 });
        }
        plot.set({ x: { label: 'spatial frequency (lp/mm)', name: 'ν', min: 0, max: F }, series, vlines: [{ x: nyq, label: 'Nyquist' }], marks: [] });
        if (only) {
          ro.set('cut', lpmm(cut)); ro.set('m50', lpmm(Mt.mtf50(sys, cut, 0.5))); ro.set('mid', pct(sys(cut / 2))); ro.set('nyq', lpmm(nyq)); ro.set('mn', pct(sys(nyq)) + (nyq > cut ? '  (the pixels outrun the lens)' : '')); ro.set('air', um(2.44 * nm / 1000 * V.N));
        } else {
          let weak = S[0].name, wv = 2; for (const s of S) { const v = Math.abs(s.f(nyq)); if (v < wv) { wv = v; weak = s.name; } }
          ro.set('nyq', lpmm(nyq)); ro.set('sys', sys(nyq).toFixed(3)); ro.set('m50', lpmm(Mt.mtf50(sys, 1.5 * nyq, 0.5))); ro.set('weak', weak + ' (' + wv.toFixed(2) + ')'); ro.set('cut', lpmm(cut));
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sampling and aliasing */
  Hyper.sim('iq-aliasing', {
    title: 'Sampling and aliasing: a zone plate and a bar pattern on pixels',
    blurb: `Left: the pattern as it really is. Right: what a sensor with 64 pixels across (or 48 for the bars) records of it. In **zone plate** mode the pattern gets finer towards the edge, with a local frequency of 0 at the centre and the chosen multiple of the Nyquist frequency at the edge; wherever it passes 0.5 cycles per pixel the sensor shows rings that are not there. In **bars** mode the pattern has one frequency, and the read-out gives the false frequency the pixels make of it.

**Try this**
- Bars at 0.3 cycles/pixel: recorded as it is. Slide to 0.8: the sensor shows a *coarser* pattern of 0.2 cycles/pixel (an alias: 1 − 0.8), and no trace of the real one remains.
- At exactly 1.0 cycles/pixel the bars vanish into a flat field. At 0.5 cycles/pixel (the Nyquist frequency) the contrast recorded depends on the **phase**: slide the phase and it comes and goes.
- Zone plate with the finest detail at 2 × Nyquist: clean rings at the centre, then the pattern folds back and **moiré rings** appear at half the radius.
- Turn on the **anti-aliasing filter** (a two-point splitter of one pixel): the false rings fade, and so does the real detail near Nyquist.
- *Whole-pixel area* sampling blurs the pattern a little before sampling and reduces, but does not remove, the aliasing.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260, maxH: 400 });
      const ctl = kit.controls(box.side, [
        { id: 'pat', type: 'select', label: 'Pattern', options: [['Zone plate (frequency rises outwards)', 'zone'], ['Bars at one frequency', 'bars']], value: params.pat || 'zone' },
        { id: 'fmax', label: 'Zone plate: frequency at the edge, in Nyquist frequencies', min: 0.5, max: 3, step: 0.05, value: params.fmax || 2, sig: 3 },
        { id: 'nu', label: 'Bars: frequency, cycles per pixel', min: 0.05, max: 1.6, step: 0.01, value: params.nu || 0.8, sig: 3 },
        { id: 'ph', label: 'Bars: phase of the pattern (fraction of a period)', min: 0, max: 1, step: 0.01, value: 0.25, sig: 2 },
        { id: 'samp', type: 'select', label: 'Each pixel records', options: [['The brightness at its centre (point sample)', 'point'], ['The average over its whole area', 'area']], value: 'point' },
        { id: 'olpf', type: 'check', label: 'Anti-aliasing filter (two-point splitter, one pixel)', value: false }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const vis = () => { ctl.show('fmax', V.pat === 'zone'); ctl.show('nu', V.pat === 'bars'); ctl.show('ph', V.pat === 'bars'); };
      vis();
      const ro = kit.readout(box.side, [['a', 'The pattern'], ['b', 'What the sensor records'], ['c', 'Aliasing']]);
      const sinc = x => Math.abs(x) < 1e-9 ? 1 : Math.sin(PI * x) / (PI * x);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, gap = 14, side = Math.min((W - 3 * gap) / 2, Hh - 40), y0 = (Hh - side) / 2 + 8;
        const xa = (W - 2 * side - gap) / 2, xb = xa + side + gap;
        const zone = V.pat === 'zone', NP = zone ? 64 : 48;
        const kap = V.fmax * 0.5 / (NP / 2);                         // zone plate: local frequency = kap × radius in pixels
        const val = (x, y) => 0.5 + 0.5 * Math.cos(PI * kap * (x * x + y * y));   // x, y in pixels from the centre
        const bg = C.dark ? [18, 20, 32] : [238, 240, 246];
        if (zone) {
          const NS = 256;
          S.image(c, xa, y0, side, side, NS, NS, (u, v) => { const x = (u - 0.5) * NP, y = (v - 0.5) * NP; return Math.hypot(x, y) > NP / 2 ? bg : val(x, y); }, { smooth: true });
          S.cells(c, xb, y0, side, side, NP, NP, (u, v) => {
            const x = (u - 0.5) * NP, y = (v - 0.5) * NP; if (Math.hypot(x, y) > NP / 2) return bg;
            const fx = kap * x, fy = kap * y;
            let g = 1; if (V.samp === 'area') g *= sinc(fx) * sinc(fy); if (V.olpf) g *= Math.cos(PI * fx) * Math.cos(PI * fy);
            return 0.5 + 0.5 * g * Math.cos(PI * kap * (x * x + y * y));
          });
          ro.set('a', 'frequency 0 at the centre, ' + fmt(V.fmax * 0.5, 3) + ' cycles/pixel at the edge');
          ro.set('b', NP + ' × ' + NP + ' pixels; Nyquist is 0.5 cycles/pixel');
          ro.set('c', V.fmax <= 1 ? 'none: every ring is real' : 'false rings beyond ' + Math.round(100 / V.fmax) + ' % of the radius' + (V.fmax > 2 ? ', and a second fold beyond ' + Math.round(200 / V.fmax) + ' %' : ''));
        } else {
          const NS = 512, nu = V.nu;
          S.image(c, xa, y0, side, side, NS, 1, u => 0.5 + 0.5 * Math.cos(TAU * (nu * u * NP + V.ph)), { smooth: true });
          let g = 1; if (V.samp === 'area') g *= sinc(nu); if (V.olpf) g *= Math.cos(PI * nu);
          let smax = -1, smin = 1; for (let i = 0; i < NP; i++) { const q = Math.cos(TAU * (nu * (i + 0.5) + V.ph)); smax = Math.max(smax, q); smin = Math.min(smin, q); }
          const amp = Math.abs(g) * (smax - smin) / 2;
          S.cells(c, xb, y0, side, side, NP, 1, u => 0.5 + 0.5 * g * Math.cos(TAU * (nu * (Math.floor(u * NP) + 0.5) + V.ph)));
          const alias = Math.abs(nu - Math.round(nu));
          ro.set('a', fmt(nu, 3) + ' cycles/pixel: ' + fmt(1 / nu, 3) + ' pixels per line pair');
          ro.set('b', amp < 0.02 ? 'a flat field: the pattern is gone' : alias > 0.001 ? fmt(alias, 3) + ' cycles/pixel: ' + fmt(1 / alias, 3) + ' pixels per line pair' : 'a flat field (the bars fall on the pixel centres alike)');
          ro.set('c', nu <= 0.5 ? 'none: below the Nyquist frequency' : 'ALIASED: appears at ' + fmt(alias, 3) + ' instead of ' + fmt(nu, 3) + ' (false frequency |ν − ' + Math.round(nu) + '|)');
        }
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(xa - 0.5, y0 - 0.5, side + 1, side + 1); c.strokeRect(xb - 0.5, y0 - 0.5, side + 1, side + 1);
        kit.label(c, 'the pattern', xa + side / 2, y0 - 10, { align: 'center', color: C.muted }); kit.label(c, 'what the pixels record', xb + side / 2, y0 - 10, { align: 'center', color: C.muted });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a maker's MTF chart */
  Hyper.sim('iq-mtf-chart', {
    title: 'A maker\'s MTF chart: sagittal and tangential lines',
    blurb: `A schematic fast normal lens, drawn the way makers publish it: MTF at a low and a high frequency against the distance from the centre of the picture, solid lines for sagittal bars (pointing along the radius), dashed for tangential bars (running around it). The model is made up for teaching (a diffraction-limited lens plus a Gaussian blur that grows towards the edge, longer along the radius than across it) and is not any real lens. The frame on the left is drawn to scale; the patches show the bars as the lens renders them at the chosen position.

**Try this**
- Start at f/2 and slide the position towards the corner: the dashed lines fall faster than the solid ones. The gap is astigmatism, and the patches at the edge show the tangential bars greyer than the sagittal.
- Stop down to f/5.6 or f/8: the gap closes, the lines flatten and rise, until the ceiling of diffraction (the last read-out) takes over.
- Change the sensor to APS-C: the chart is the same, but only the centre of it is used (a vertical line marks the edge of the sensor), and 10 and 30 lp/mm on full frame mean 15 and 46 on this sensor.
- Reduce the astigmatism to zero: solid and dashed lines coincide, as in a well-corrected lens.`,
    mount(box, kit, params) {
      const O = kit.optics, Mt = O.mtf, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240, maxH: 340 });
      const HM = 21.63;
      const plot = kit.plot(box.stage, { x: { label: 'image height from the centre (mm)', name: 'h', min: 0, max: HM }, y: { label: 'MTF', name: 'MTF', min: 0, max: 1.02 }, series: [] }, 210);
      const ctl = kit.controls(box.side, [
        { id: 'N', type: 'select', label: 'Aperture', options: [1.4, 2, 2.8, 4, 5.6, 8, 11, 16].map(n => ['f/' + n, n]), value: params.N || 2 },
        { id: 'hi', type: 'select', label: 'The high frequency of the chart', options: [['20 lp/mm', 20], ['30 lp/mm', 30], ['40 lp/mm', 40]], value: params.hi || 30 },
        { id: 'astig', label: 'Astigmatism of the lens (1 = typical)', min: 0, max: 2, step: 0.05, value: params.astig != null ? params.astig : 1, sig: 2 },
        { id: 'fmt', type: 'select', label: 'Sensor behind the lens', options: [['Full frame', 'Full frame'], ['APS-C', 'APS-C'], ['1"', '1"']], value: 'Full frame' },
        { id: 'pos', label: 'Position in the field (image height)', min: 0, max: HM, step: 0.1, value: params.pos || 15, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['h', 'Image height · field angle (50 mm lens)'], ['lo', 'Low frequency: sagittal · tangential'], ['hi', 'High frequency: sagittal · tangential'], ['gap', 'Gap at the high frequency'], ['ceil', 'Diffraction ceiling at 10 · high lp/mm']]);
      const sig0 = N => 3.0 * Math.pow(2 / N, 2);                          // µm, axial blur
      const sigRad = (h, N) => sig0(N) + 6 * V.astig * Math.pow(h / HM, 2) * (2 / N);       // blur along the radius (tangential bars)
      const sigCirc = (h, N) => sig0(N) + 2 * V.astig * Math.pow(h / HM, 2) * (2 / N);      // blur around the circle (sagittal bars)
      const sag = (nu, h) => Mt.diffraction(nu, 550, V.N) * Mt.gaussian(nu, sigCirc(h, V.N) * 1e-3);
      const tan = (nu, h) => Mt.diffraction(nu, 550, V.N) * Mt.gaussian(nu, sigRad(h, V.N) * 1e-3);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, sen = O.cam.sensor(V.fmt), hs = sen.diag / 2;
        // the frame, to scale: full frame 36 × 24 and the sensor chosen
        const fw = Math.min(W * 0.4, (Hh - 24) / 43.27 * 36), k = fw / 36, cx = 16 + fw / 2, cy = Hh / 2 + 6;
        c.strokeStyle = C.text; c.lineWidth = 1.3; c.strokeRect(cx - 18 * k, cy - 12 * k, 36 * k, 24 * k);
        c.strokeStyle = C.accent; c.lineWidth = 1.6; c.strokeRect(cx - sen.w / 2 * k, cy - sen.h / 2 * k, sen.w * k, sen.h * k);
        c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.arc(cx, cy, HM * k, 0, TAU); c.stroke(); c.restore();
        kit.label(c, 'full frame 36 × 24 mm (dotted: its image circle)', cx, cy - 12 * k - 10, { align: 'center', color: C.muted, size: 11.5 });
        const ang = Math.atan2(24, 36), px = cx + V.pos * k * Math.cos(ang), py = cy - V.pos * k * Math.sin(ang);
        c.strokeStyle = C.warn; c.lineWidth = 1.2; c.beginPath(); c.moveTo(cx, cy); c.lineTo(px, py); c.stroke(); kit.dot(c, px, py, 4.5, C.warn);
        if (V.fmt !== 'Full frame') kit.label(c, V.fmt + ' sensor', cx, cy + sen.h / 2 * k + 14, { align: 'center', color: C.accent, size: 11.5 });
        // the patches: rows low and high frequency, columns sagittal and tangential
        const pw = Math.min(70, (W - fw - 90) / 2 - 8), x0 = W - 2 * pw - 40, rows = [[10, 'low'], [V.hi, 'high']];
        const cols = [['sagittal', sag], ['tangential', tan]];
        cols.forEach(([nm, f], ci) => kit.label(c, nm, x0 + ci * (pw + 18) + pw / 2, 14, { align: 'center', color: C.muted, size: 11.5 }));
        rows.forEach(([nu, lab], ri) => cols.forEach(([nm, f], ci) => {
          const m = f(nu, V.pos), bx = x0 + ci * (pw + 18), by = 26 + ri * (pw + 38), horizontal = ci === 0;
          if (horizontal) for (let j = 0; j < pw; j++) { c.fillStyle = grey(0.5 + 0.5 * m * Math.cos(TAU * 5 * (j + 0.5) / pw)); c.fillRect(bx, by + j, pw, 1.2); }
          else for (let i = 0; i < pw; i++) { c.fillStyle = grey(0.5 + 0.5 * m * Math.cos(TAU * 5 * (i + 0.5) / pw)); c.fillRect(bx + i, by, 1.2, pw); }
          c.strokeStyle = C.grid; c.strokeRect(bx - 0.5, by - 0.5, pw + 1, pw + 1);
          kit.label(c, nu + ' lp/mm: ' + m.toFixed(2), bx + pw / 2, by + pw + 12, { align: 'center', color: C.text, size: 11.5, weight: 600 });
        }));
        kit.label(c, 'bars along the radius', x0 + pw / 2, 26 + 2 * (pw + 38) - 18, { align: 'center', color: C.faint, size: 10.5 });
        kit.label(c, 'bars around the circle', x0 + pw + 18 + pw / 2, 26 + 2 * (pw + 38) - 18, { align: 'center', color: C.faint, size: 10.5 });
        const theta = Math.atan(V.pos / 50) * 180 / PI, hi = V.hi;
        ro.set('h', V.pos.toFixed(1) + ' mm · ' + theta.toFixed(1) + '°');
        ro.set('lo', sag(10, V.pos).toFixed(2) + ' · ' + tan(10, V.pos).toFixed(2)); ro.set('hi', sag(hi, V.pos).toFixed(2) + ' · ' + tan(hi, V.pos).toFixed(2));
        ro.set('gap', (sag(hi, V.pos) - tan(hi, V.pos)).toFixed(2)); ro.set('ceil', Mt.diffraction(10, 550, V.N).toFixed(2) + ' · ' + Mt.diffraction(hi, 550, V.N).toFixed(2));
        const line = (f, nu) => { const a = []; for (let i = 0; i <= 54; i++) { const h = HM * i / 54; a.push([h, f(nu, h)]); } return a; };
        const vl = [{ x: V.pos, label: 'here' }]; if (hs < HM - 0.5) vl.push({ x: hs, label: 'sensor edge' });
        plot.set({ series: [
          { pts: line(sag, 10), label: '10 lp/mm sagittal', color: C.series[0] }, { pts: line(tan, 10), label: '10 lp/mm tangential', color: C.series[0], dash: true },
          { pts: line(sag, hi), label: hi + ' lp/mm sagittal', color: C.series[1] }, { pts: line(tan, hi), label: hi + ' lp/mm tangential', color: C.series[1], dash: true }
        ], vlines: vl });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the slanted-edge method */
  Hyper.sim('iq-slanted-edge', {
    title: 'The slanted-edge method: from a tilted edge to the MTF',
    blurb: `A sharp edge is photographed by a sensor of 32 × 32 pixels. The lens blurs it (Gaussian) and each pixel averages over its own area. The analysis follows the standard method: find the edge in every row and fit a line; measure each pixel's distance from that line; sort all the pixels by distance to get an oversampled **edge-spread function** (middle panel: every pixel is a dot, the line is the binned profile); differentiate to the **line-spread function** (the accent curve); take its Fourier transform: that is the **MTF** in the graph, against the true curve (lens × pixel) it should reproduce.

**Try this**
- With the default 5° tilt the recovered MTF follows the true one up to and beyond the Nyquist frequency (0.5 cycles/pixel): the tilt gives each row a different sub-pixel phase.
- Set the tilt to **0°**: all rows are identical, the oversampling vanishes, many bins stay empty, and the result is wrong. This is why the standard prescribes a tilt.
- Raise the noise: the high-frequency tail of the recovered curve lifts and wobbles, while the low frequencies stay right.
- Make the lens sharper (blur 0.3 µm): the true curve is now the pixel's alone, with its MTF50 at about 0.58 cycles per pixel, above the Nyquist frequency of 0.5.`,
    mount(box, kit, params) {
      const O = kit.optics, Mt = O.mtf, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 220, maxH: 320 });
      const plot = kit.plot(box.stage, { x: { label: 'spatial frequency (cycles per pixel)', name: 'ν', min: 0, max: 1 }, y: { label: 'MTF', name: 'MTF', min: 0, max: 1.1 }, series: [] }, 200);
      const NP = 32;
      const ctl = kit.controls(box.side, [
        { id: 'ang', label: 'Tilt of the edge', min: 0, max: 12, step: 0.1, value: params.ang != null ? params.ang : 5, unit: '°' },
        { id: 'sig', label: 'Lens blur (Gaussian, standard deviation)', min: 0.3, max: 6, step: 0.1, value: params.sig || 2, unit: 'µm' },
        { id: 'p', label: 'Pixel pitch', min: 2, max: 8, step: 0.1, value: params.p || 4, unit: 'µm' },
        { id: 'noise', label: 'Noise', min: 0, max: 8, step: 0.1, value: params.noise != null ? params.noise : 1, unit: '% of the edge contrast' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t50', 'True MTF50'], ['m50', 'MTF50 from the edge'], ['nyq', 'MTF at Nyquist: true · measured'], ['fit', 'Edge angle found by the fit'], ['gap', 'Empty bins in the edge profile']]);
      const erf = x => { const s = x < 0 ? -1 : 1; x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x)); };
      const Gf = z => z * 0.5 * (1 + erf(z / Math.SQRT2)) + Math.exp(-z * z / 2) / Math.sqrt(TAU);
      const trueM = nu => Math.exp(-2 * PI * PI * Math.pow(V.sig / V.p, 2) * nu * nu) * Math.abs(O.sinc(PI * nu));      // nu in cycles per pixel
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const al = V.ang * PI / 180, ta = Math.tan(al), sp = V.sig / V.p, lo = 0.15, hi = 0.85;
        let seed = 12345; const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
        const img = new Float64Array(NP * NP);
        for (let j = 0; j < NP; j++) for (let i = 0; i < NP; i++) {
          const d = ((i + 0.5) - (NP / 2 + ta * (j + 0.5 - NP / 2))) * Math.cos(al);
          const e = (sp / 1) * (Gf((d + 0.5) / sp) - Gf((d - 0.5) / sp));
          const nz = (rnd() + rnd() + rnd() - 1.5) * 2 * V.noise / 100 * (hi - lo);
          img[j * NP + i] = lo + (hi - lo) * e + nz;
        }
        // 1. the edge in every row (crossing of the middle level), then a line fitted to them
        let sx = 0, sy = 0, sxx = 0, sxy = 0, n = 0;
        for (let j = 0; j < NP; j++) for (let i = 0; i < NP - 1; i++) { const a = img[j * NP + i], b = img[j * NP + i + 1], mid = (lo + hi) / 2; if (a < mid && b >= mid) { const x = i + 0.5 + (mid - a) / (b - a || 1), y = j + 0.5; sx += y; sy += x; sxx += y * y; sxy += x * y; n++; break; } }
        const slope = n > 2 ? (n * sxy - sx * sy) / ((n * sxx - sx * sx) || 1) : 0, icpt = n > 0 ? (sy - slope * sx) / n : NP / 2, ca = 1 / Math.sqrt(1 + slope * slope);
        // 2. distance of every pixel from the fitted edge, 3. binned in quarter pixels
        const BIN = 0.25, HB = 8, NB = Math.round(2 * HB / BIN), sum = new Float64Array(NB), cnt = new Float64Array(NB), dots = [];
        for (let j = 0; j < NP; j++) for (let i = 0; i < NP; i++) {
          const d = ((i + 0.5) - (icpt + slope * (j + 0.5))) * ca; if (Math.abs(d) >= HB) continue;
          const b = Math.floor((d + HB) / BIN); sum[b] += img[j * NP + i]; cnt[b]++; dots.push([d, img[j * NP + i]]);
        }
        const esf = new Float64Array(NB); let empty = 0;
        for (let b = 0; b < NB; b++) esf[b] = cnt[b] ? sum[b] / cnt[b] : NaN;
        for (let b = 0; b < NB; b++) if (!(esf[b] === esf[b])) { empty++; let l = b - 1, r = b + 1; while (l >= 0 && !(esf[l] === esf[l])) l--; while (r < NB && !(esf[r] === esf[r])) r++; const vl = l >= 0 ? esf[l] : (r < NB ? esf[r] : 0), vr = r < NB ? esf[r] : vl; esf[b] = l >= 0 && r < NB ? vl + (vr - vl) * (b - l) / (r - l) : vl; }
        // 4. the line-spread function, windowed; 5. its Fourier transform
        const lsf = new Float64Array(NB); for (let b = 1; b < NB - 1; b++) lsf[b] = (esf[b + 1] - esf[b - 1]) / 2;
        let ip = 0, mx = 0; for (let b = 0; b < NB; b++) if (lsf[b] > mx) { mx = lsf[b]; ip = b; }
        const win = b => 0.54 + 0.46 * Math.cos(PI * (b - ip) / (NB / 2));
        const meas = nu => { let a = 0, s = 0; for (let b = 0; b < NB; b++) { const x = (b - ip) * BIN, w = lsf[b] * win(b); a += w * Math.cos(TAU * nu * x); s += w * Math.sin(TAU * nu * x); } return Math.hypot(a, s); };
        const m0 = meas(0) || 1, pm = [], pt = [];
        for (let i = 0; i <= 100; i++) { const nu = i / 100; pm.push([nu, meas(nu) / m0]); pt.push([nu, trueM(nu)]); }
        let m50 = NaN; for (let i = 1; i < pm.length; i++) if (pm[i][1] < 0.5) { m50 = pm[i - 1][0] + 0.01 * (pm[i - 1][1] - 0.5) / ((pm[i - 1][1] - pm[i][1]) || 1); break; }
        const t50 = Mt.mtf50(trueM, 1, 0.5);
        // pictures
        const gap = 12, side = Math.min(Hh - 40, (W - 3 * gap) * 0.36), x0 = gap, y0 = (Hh - side) / 2 + 8, gx = x0 + side + gap + 6, gw = W - gx - gap, gh = side;
        S.cells(c, x0, y0, side, side, NP, NP, (u, v) => img[Math.floor(v * NP) * NP + Math.floor(u * NP)]);
        c.strokeStyle = C.grid; c.strokeRect(x0 - 0.5, y0 - 0.5, side + 1, side + 1);
        kit.label(c, 'the edge on 32 × 32 pixels', x0 + side / 2, y0 - 10, { align: 'center', color: C.muted, size: 11.5 });
        c.fillStyle = C.surface; c.fillRect(gx, y0, gw, gh); c.strokeStyle = C.grid; c.strokeRect(gx - 0.5, y0 - 0.5, gw + 1, gh + 1);
        const X = d => gx + gw * (d + 5) / 10, Y = v => y0 + gh - 6 - (gh - 12) * (v - 0.05) / 0.9;
        c.fillStyle = C.faint; for (const p of dots) { if (p[0] < -5 || p[0] > 5) continue; c.fillRect(X(p[0]) - 1, Y(clamp(p[1], 0, 1)) - 1, 2, 2); }
        c.strokeStyle = C.series[1]; c.lineWidth = 2; c.beginPath(); let first = true; for (let b = 0; b < NB; b++) { const d = -HB + (b + 0.5) * BIN; if (d < -5 || d > 5) continue; const xx = X(d), yy = Y(clamp(esf[b], 0, 1)); if (first) { c.moveTo(xx, yy); first = false; } else c.lineTo(xx, yy); } c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); first = true; for (let b = 0; b < NB; b++) { const d = -HB + (b + 0.5) * BIN; if (d < -5 || d > 5) continue; const xx = X(d), yy = y0 + gh - 6 - (gh - 12) * 0.9 * clamp(lsf[b] / (mx || 1), -0.3, 1) * 0.55; if (first) { c.moveTo(xx, yy); first = false; } else c.lineTo(xx, yy); } c.stroke();
        kit.label(c, 'dots: every pixel by its distance from the edge · line: the binned edge profile · accent: its derivative', gx + gw / 2, y0 - 10, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'distance from the edge (pixels): −5 … +5', gx + gw / 2, y0 + gh + 12, { align: 'center', color: C.faint, size: 11 });
        ro.set('t50', fmt(t50, 3) + ' cycles/pixel (' + lpmm(t50 * 1000 / V.p) + ')');
        ro.set('m50', Number.isFinite(m50) ? fmt(m50, 3) + ' cycles/pixel (' + lpmm(m50 * 1000 / V.p) + ')' : 'above 1');
        ro.set('nyq', trueM(0.5).toFixed(2) + ' · ' + pm[50][1].toFixed(2));
        ro.set('fit', (Math.atan(slope) * 180 / PI).toFixed(2) + '°  (true ' + V.ang.toFixed(1) + '°)'); ro.set('gap', empty + ' of ' + NB);
        plot.set({ series: [{ pts: pm, label: 'recovered from the edge', color: C.accent }, { pts: pt, label: 'true (lens × pixel)', color: C.series[1], dash: true }], vlines: [{ x: 0.5, label: 'Nyquist' }], hlines: [{ y: 0.5, label: '0.5' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ distortion and calibration */
  Hyper.sim('iq-distortion-grid', {
    title: 'Distortion and calibration: a checkerboard through a lens',
    blurb: `A checkerboard of 12 × 8 squares is photographed through a lens with radial distortion r_d = r (1 + k₁r² + k₂r⁴), r normalised to the corner. **Left**: what the camera records, with the 77 inner corners as the software finds them (with a small error). **Right**: the same picture after calibration: the coefficients have been estimated by a least-squares fit to those corners alone, and the picture undistorted with them. The graph compares the true distortion curve with the estimated one.

**Try this**
- Press **Barrel** (negative k₁): lines bulge outwards. Press **Pincushion**: they bow inwards. **Mustache** (k₁ and k₂ of opposite sign): barrel in the middle, pincushion at the edge.
- After calibration the lines are straight again and the estimated k's match the true ones: the checkerboard has been used as a ruler.
- Raise the error in finding the corners to 2–3 px: the fit gets noisier, and the estimated curve wanders away from the true one at the edge, where the leverage is greatest.
- Read the position error at the corner in pixels: a 3 % distortion on a picture of 3 000 px width moves the corner point by about 54 px.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250, maxH: 380 });
      const plot = kit.plot(box.stage, { x: { label: 'normalised radius r (0 at the centre, 1 at the corner)', name: 'r', min: 0, max: 1 }, y: { label: 'distortion (%)', name: 'D' }, series: [] }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'k1', label: 'k₁', min: -0.4, max: 0.4, step: 0.01, value: params.k1 != null ? params.k1 : -0.12, sig: 2 },
        { id: 'k2', label: 'k₂', min: -0.3, max: 0.3, step: 0.01, value: params.k2 != null ? params.k2 : 0, sig: 2 },
        { id: 'noise', label: 'Error in finding the corners', min: 0, max: 3, step: 0.05, value: 0.3, unit: 'px' },
        { id: 'ideal', type: 'check', label: 'Show the ideal grid (dashed)', value: true },
        { type: 'buttons', items: [{ id: 'barrel', label: 'Barrel' }, { id: 'pin', label: 'Pincushion' }, { id: 'must', label: 'Mustache' }] }
      ], id => {
        if (id === 'barrel') { ctl.set('k1', -0.15); ctl.set('k2', 0); } else if (id === 'pin') { ctl.set('k1', 0.15); ctl.set('k2', 0); } else if (id === 'must') { ctl.set('k1', -0.12); ctl.set('k2', 0.14); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['edge', 'Distortion at the corner'], ['half', 'Distortion at half the radius'], ['shift', 'Corner displacement, 3 000 px wide picture'], ['kest', 'Calibrated k₁ · k₂'], ['rms', 'Reprojection error (RMS)']]);
      const NX = 12, NY = 8, R0 = Math.hypot(1.5, 1), UNIT = 1000;            // the picture is 3 × 2 units; one unit = 1000 px
      const rn = (x, y) => Math.hypot(x, y) / R0;
      const hsh = (i, j) => { let h = Math.imul(i, 374761393) + Math.imul(j, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
      const gauss = (i, j) => (hsh(i, j) + hsh(i + 99, j + 7) + hsh(i + 13, j + 501) - 1.5) * 2;
      const dist = (x, y, k1, k2) => { const r = rn(x, y), f = r > 1e-9 ? O.cam.distortion(r, k1, k2) / r : 1; return [x * f, y * f]; };
      const undist = (xd, yd, k1, k2) => {
        const rd = rn(xd, yd); if (rd < 1e-9) return [xd, yd];
        let r = rd; for (let it = 0; it < 30; it++) { const g = r * (1 + k1 * r * r + k2 * r * r * r * r) - rd, dg = 1 + 3 * k1 * r * r + 5 * k2 * r * r * r * r; if (Math.abs(dg) < 1e-6) break; r -= g / dg; if (r < 0) r = 0; }
        const q = r / rd; return [xd * q, yd * q];
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, k1 = V.k1, k2 = V.k2;
        // the corners found, with noise, and the least-squares fit of k1, k2 (r_d / r − 1 = k1 r² + k2 r⁴)
        const found = []; let Saa = 0, Sab = 0, Sbb = 0, Say = 0, Sby = 0;
        for (let j = 1; j < NY; j++) for (let i = 1; i < NX; i++) {
          const x = -1.5 + 3 * i / NX, y = -1 + 2 * j / NY, d = dist(x, y, k1, k2), nx = d[0] + gauss(i, j) * V.noise / UNIT, ny = d[1] + gauss(i + 40, j + 40) * V.noise / UNIT;
          found.push({ x, y, nx, ny });
          const r = rn(x, y); if (r < 1e-6) continue;
          const a = r * r, b = a * a, yv = rn(nx, ny) / r - 1; Saa += a * a; Sab += a * b; Sbb += b * b; Say += a * yv; Sby += b * yv;
        }
        const det = Saa * Sbb - Sab * Sab, e1 = det > 1e-12 ? (Say * Sbb - Sby * Sab) / det : 0, e2 = det > 1e-12 ? (Saa * Sby - Sab * Say) / det : 0;
        let sq = 0; for (const p of found) { const u = undist(p.nx, p.ny, e1, e2); sq += (u[0] - p.x) * (u[0] - p.x) + (u[1] - p.y) * (u[1] - p.y); }
        const rms = Math.sqrt(sq / found.length) * UNIT;
        // the pictures
        const gap = 14, pw = (W - 3 * gap) / 2, s = pw / 3.5, ph = Math.min(Hh - 36, 2.4 * s), y0 = (Hh - ph) / 2 + 8;
        const panel = (x0, title, mapper, dots) => {
          const cx = x0 + pw / 2, cy = y0 + ph / 2;
          c.save(); c.beginPath(); c.rect(x0, y0, pw, ph); c.clip(); c.fillStyle = C.surface; c.fillRect(x0, y0, pw, ph);
          const P = (x, y) => { const m = mapper(x, y); return [cx + m[0] * s, cy + m[1] * s]; };
          const edge = (a, b, n) => { const pts = []; for (let t = 0; t <= n; t++) pts.push(P(a[0] + (b[0] - a[0]) * t / n, a[1] + (b[1] - a[1]) * t / n)); return pts; };
          for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
            if ((i + j) % 2) continue;
            const x1 = -1.5 + 3 * i / NX, x2 = -1.5 + 3 * (i + 1) / NX, y1 = -1 + 2 * j / NY, y2 = -1 + 2 * (j + 1) / NY;
            const pts = edge([x1, y1], [x2, y1], 6).concat(edge([x2, y1], [x2, y2], 6).slice(1), edge([x2, y2], [x1, y2], 6).slice(1), edge([x1, y2], [x1, y1], 6).slice(1));
            c.fillStyle = C.dark ? '#e8e8f0' : '#20202c'; c.beginPath(); pts.forEach((p, k) => k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill();
          }
          if (V.ideal) { c.strokeStyle = C.warn; c.lineWidth = 1; c.setLineDash([4, 3]); c.beginPath(); for (let i = 0; i <= NX; i++) { const x = cx + (-1.5 + 3 * i / NX) * s; c.moveTo(x, cy - s); c.lineTo(x, cy + s); } for (let j = 0; j <= NY; j++) { const y = cy + (-1 + 2 * j / NY) * s; c.moveTo(cx - 1.5 * s, y); c.lineTo(cx + 1.5 * s, y); } c.stroke(); c.setLineDash([]); }
          for (const p of found) { const m = dots(p); c.fillStyle = C.accent; c.fillRect(cx + m[0] * s - 2, cy + m[1] * s - 2, 4, 4); }
          c.restore(); c.strokeStyle = C.grid; c.strokeRect(x0 - 0.5, y0 - 0.5, pw + 1, ph + 1);
          kit.label(c, title, x0 + pw / 2, y0 - 10, { align: 'center', color: C.muted, size: 11.5 });
        };
        panel(gap, 'what the camera records (dots: corners found)', (x, y) => dist(x, y, k1, k2), p => [p.nx, p.ny]);
        panel(2 * gap + pw, 'after calibration and undistortion', (x, y) => { const d = dist(x, y, k1, k2); return undist(d[0], d[1], e1, e2); }, p => undist(p.nx, p.ny, e1, e2));
        const Dr = (r, a, b) => 100 * (a * r * r + b * r * r * r * r);
        ro.set('edge', fmt(Dr(1, k1, k2), 3) + ' %  (' + (Dr(1, k1, k2) < -0.05 ? 'barrel' : Dr(1, k1, k2) > 0.05 ? 'pincushion' : 'none') + (k1 * k2 < 0 && Math.abs(k2) > 0.02 ? ', mustache' : '') + ')');
        ro.set('half', fmt(Dr(0.5, k1, k2), 3) + ' %'); ro.set('shift', fmt(Dr(1, k1, k2) / 100 * R0 * UNIT, 3) + ' px');
        ro.set('kest', e1.toFixed(3) + ' · ' + e2.toFixed(3) + '   (true ' + k1.toFixed(2) + ' · ' + k2.toFixed(2) + ')'); ro.set('rms', fmt(rms, 2) + ' px');
        const pt = [], pe = []; for (let i = 0; i <= 50; i++) { const r = i / 50; pt.push([r, Dr(r, k1, k2)]); pe.push([r, Dr(r, e1, e2)]); }
        plot.set({ series: [{ pts: pt, label: 'true distortion', color: C.series[0] }, { pts: pe, label: 'estimated from the checkerboard', color: C.series[1], dash: true }], hlines: [{ y: 0 }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cos⁴ and flat-field correction */
  Hyper.sim('iq-shading', {
    title: 'Relative illumination: cos⁴, vignetting and flat-field correction',
    blurb: `A uniformly lit wall photographed through a lens: the **left** panel is the raw linear picture (with its photon noise), the **middle** panel the gain map that would flatten it (dark: gain 1; light: the highest gain), the **right** panel the picture after the correction. The graph gives the relative illumination along a radius: the cos⁴ law alone (dashed) and with mechanical vignetting (solid).

**Try this**
- Start with a 24 mm lens on full frame: the cos⁴ law alone darkens the corner by 1.7 stops. Move to 85 mm: the corner angle falls from 42° to 14° and the darkening almost vanishes.
- Raise the mechanical vignetting at f/1.4, then **stop down**: the extra loss disappears within two stops, but the cos⁴ part stays at every aperture.
- Look at the right panel at the corners: the brightness is flat, but the noise is not. The correction multiplies the weak corner signal and its noise together: the SNR there is √RI of the centre's.
- Choose a smaller sensor with the same lens: only the central part of the image circle is used, so the corner angle and the loss both fall.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 210, maxH: 300 });
      const plot = kit.plot(box.stage, { x: { label: 'image height from the centre (mm)', name: 'h', min: 0, max: 22 }, y: { label: 'relative illumination (%)', name: 'RI', min: 0, max: 105 }, series: [] }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Focal length', min: 8, max: 200, value: params.f || 24, log: true, sig: 3, unit: 'mm' },
        { id: 'fmt', type: 'select', label: 'Sensor', options: [['1" (diagonal 16 mm)', '1"'], ['APS-C (28 mm)', 'APS-C'], ['Full frame (43 mm)', 'Full frame'], ['Medium format 44 × 33 (55 mm)', '44×33']], value: params.fmt || 'Full frame' },
        { id: 'N', type: 'select', label: 'Aperture', options: [1.4, 2, 2.8, 4, 5.6, 8, 11].map(n => ['f/' + n, n]), value: 1.4 },
        { id: 'mech', label: 'Mechanical vignetting at the corner when wide open', min: 0, max: 60, step: 1, value: params.mech != null ? params.mech : 30, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['th', 'Field angle at the corner'], ['c4', 'cos⁴ alone at the corner'], ['ri', 'Relative illumination at the corner'], ['stops', 'Light lost at the corner'], ['gain', 'Flat-field gain at the corner'], ['snr', 'Corner SNR after correction (centre = 1)']]);
      const hsh = (i, j) => { let h = Math.imul(i, 374761393) + Math.imul(j, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
      const gauss = (i, j) => (hsh(i, j) + hsh(i + 99, j + 7) + hsh(i + 13, j + 501) - 1.5) * 2;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, sen = O.cam.sensor(V.fmt), half = sen.diag / 2;
        const tmax = Math.atan(half / V.f), stopsDown = 2 * Math.log2(V.N / 1.4), mech = V.mech / 100 * clamp(1 - stopsDown / 2, 0, 1);
        const c4 = r => O.cam.cos4(Math.atan(r * Math.tan(tmax))), ri = r => c4(r) * (1 - mech * r * r * r);
        const gap = 14, pw = (W - 4 * gap) / 3, ph = pw * sen.h / sen.w, y0 = (Hh - ph) / 2 + 8, nx = 48, ny = Math.max(8, Math.round(48 * sen.h / sen.w));
        const gmax = 1 / ri(1);
        const cell = (kind) => (u, v) => {
          const x = (u - 0.5) * sen.w, y = (v - 0.5) * sen.h, r = Math.min(1.2, Math.hypot(x, y) / half), R = Math.max(ri(r), 0.02);
          const i = Math.floor(u * nx), j = Math.floor(v * ny), n = gauss(i, j) * 0.04;
          if (kind === 0) return Math.pow(clamp(0.6 * (R + n * Math.sqrt(R)), 0, 1), 1 / 2.2);
          if (kind === 1) return gmax > 1.001 ? ((1 / R) - 1) / (gmax - 1) : 0;
          return Math.pow(clamp(0.6 * (1 + n / Math.sqrt(R)), 0, 1), 1 / 2.2);
        };
        ['the raw picture', 'the gain map', 'after flat-field correction'].forEach((t, k) => {
          const x0 = gap + k * (pw + gap); S.cells(c, x0, y0, pw, ph, nx, ny, cell(k)); c.strokeStyle = C.grid; c.strokeRect(x0 - 0.5, y0 - 0.5, pw + 1, ph + 1);
          kit.label(c, t, x0 + pw / 2, y0 - 10, { align: 'center', color: C.muted, size: 11.5 });
        });
        kit.label(c, 'gain 1 (black) to ' + gmax.toFixed(2) + ' (white)', gap + pw + gap + pw / 2, y0 + ph + 13, { align: 'center', color: C.faint, size: 11 });
        const R1 = ri(1);
        ro.set('th', (tmax * 180 / PI).toFixed(1) + '°'); ro.set('c4', c4(1).toFixed(2)); ro.set('ri', R1.toFixed(2) + ' (' + pct(R1) + ')'); ro.set('stops', (-Math.log2(R1)).toFixed(2) + ' stops');
        ro.set('gain', '× ' + (1 / R1).toFixed(2)); ro.set('snr', Math.sqrt(R1).toFixed(2));
        const pa = [], pb = []; for (let i = 0; i <= 44; i++) { const r = i / 44; pa.push([r * half, 100 * c4(r)]); pb.push([r * half, 100 * ri(r)]); }
        plot.set({ x: { label: 'image height from the centre (mm)', name: 'h', min: 0, max: Math.max(5, half) }, series: [{ pts: pa, label: 'cos⁴ law alone', color: C.series[1], dash: true }, { pts: pb, label: 'with vignetting', color: C.series[0] }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ bokeh */
  Hyper.sim('iq-bokeh', {
    title: 'Bokeh: the size and the shape of the blur discs',
    blurb: `A night scene: a few lights at the plane of focus (sharp points near the centre) and many more in the distance, out of focus. Each defocused light becomes a **blur disc**, a copy of the aperture. The size is computed from the lens, the focus distance and the distance of the lights; the shape is your choice of lens design. The frame is drawn to scale for the sensor chosen (one frame width = the sensor width), with the discs added on top of each other as light adds.

**Try this**
- Start with 85 mm at f/1.8, focused at 2.5 m, lights at 20 m: the discs are a few per cent of the frame wide. Stop down to f/5.6 and they shrink in proportion; open up and they swell and merge.
- Switch the lens style: *polygon* shows the iris blades (more blades, rounder disc); *cat's eye* squeezes the discs at the corners; *mirror lens* hollows them into rings; *aspheric* adds onion rings; *soft-edge* is the apodization look.
- Raise the focal length to 200 mm with the same f-number and distance: the discs grow with f² at fixed distance, and the background melts.
- Bring the lights closer (towards the focus distance): the disc shrinks to a point at the plane of focus and swells on either side.`,
    mount(box, kit, params) {
      const O = kit.optics;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 260, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Focal length', min: 24, max: 300, value: params.f || 85, log: true, sig: 3, unit: 'mm' },
        { id: 'N', label: 'f-number', min: 1.2, max: 16, value: params.N || 1.8, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 's0', label: 'Distance focused on', min: 0.5, max: 20, value: params.s0 || 2.5, log: true, sig: 2, unit: 'm' },
        { id: 's', label: 'Distance of the lights', min: 1, max: 300, value: params.s || 20, log: true, sig: 2, unit: 'm' },
        { id: 'fmt', type: 'select', label: 'Sensor', options: [['1" (13 mm wide)', '1"'], ['APS-C (24 mm)', 'APS-C'], ['Full frame (36 mm)', 'Full frame']], value: 'Full frame' },
        { id: 'style', type: 'select', label: 'Lens design', options: [['Round, uniform', 'round'], ['Round, bright rim (spherical aberration)', 'rim'], ['Polygon (iris blades)', 'poly'], ['Cat\'s eye (vignetting)', 'cat'], ['Mirror lens (ring)', 'ring'], ['Aspheric (onion rings)', 'onion'], ['Soft edge (apodized)', 'soft']], value: params.style || 'round' },
        { id: 'blades', label: 'Number of iris blades', min: 5, max: 9, step: 1, value: 7 }
      ], () => { ctl.show('blades', V.style === 'poly'); loop.once(); });
      const V = ctl.values;
      ctl.show('blades', V.style === 'poly');
      const ro = kit.readout(box.side, [['b', 'Blur disc on the sensor'], ['frac', 'As a share of the picture width'], ['px', 'Across, in 4 µm pixels'], ['inf', 'Largest possible: lights at infinity'], ['zero', 'Contrast of fine detail reverses above']]);
      let seed = 777; const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
      const LIGHTS = []; for (let i = 0; i < 46; i++) LIGHTS.push({ u: rnd(), v: rnd(), a: 0.5 + 0.5 * rnd(), col: Math.floor(rnd() * 6) });
      const COL = ['255,226,160', '255,200,120', '190,220,255', '255,255,240', '255,170,140', '200,255,200'];
      const SHARP = [[0.46, 0.5], [0.52, 0.46], [0.5, 0.56], [0.43, 0.43], [0.58, 0.53]];
      function disc(c, x, y, R, o) {
        const fill = al => 'rgba(' + o.col + ',' + clamp(al, 0, 1) + ')', a = o.alpha;
        c.save(); c.globalCompositeOperation = 'lighter';
        if (R < 1.6) { c.fillStyle = fill(Math.min(1, a * 2)); c.beginPath(); c.arc(x, y, 1.6, 0, TAU); c.fill(); c.restore(); return; }
        if (o.style === 'round') { c.fillStyle = fill(a); c.beginPath(); c.arc(x, y, R, 0, TAU); c.fill(); }
        else if (o.style === 'rim') { c.fillStyle = fill(a * 0.55); c.beginPath(); c.arc(x, y, R, 0, TAU); c.fill(); const lw = Math.max(1, R * 0.14); c.strokeStyle = fill(a * 1.7); c.lineWidth = lw; c.beginPath(); c.arc(x, y, R - lw / 2, 0, TAU); c.stroke(); }
        else if (o.style === 'poly') { c.fillStyle = fill(a); c.beginPath(); for (let k = 0; k < o.n; k++) { const th = TAU * k / o.n + 0.35, px = x + R * Math.cos(th), py = y + R * Math.sin(th); if (k) c.lineTo(px, py); else c.moveTo(px, py); } c.closePath(); c.fill(); }
        else if (o.style === 'cat') { c.beginPath(); c.arc(x, y, R, 0, TAU); c.clip(); const dx = o.cx - x, dy = o.cy - y, d = Math.hypot(dx, dy) || 1, off = R * 1.5 * clamp(o.t, 0, 1); c.fillStyle = fill(a * 1.25); c.beginPath(); c.arc(x + dx / d * off, y + dy / d * off, R, 0, TAU); c.fill(); }
        else if (o.style === 'ring') { c.fillStyle = fill(a * 1.3); c.beginPath(); c.arc(x, y, R, 0, TAU); c.arc(x, y, R * 0.55, 0, TAU, true); c.fill(); }
        else if (o.style === 'onion') { c.fillStyle = fill(a * 0.55); c.beginPath(); c.arc(x, y, R, 0, TAU); c.fill(); c.strokeStyle = fill(a * 0.9); c.lineWidth = Math.max(0.8, R * 0.05); for (const q of [0.32, 0.47, 0.61, 0.78, 0.92]) { c.beginPath(); c.arc(x, y, R * q, 0, TAU); c.stroke(); } }
        else { const g = c.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, fill(a * 1.1)); g.addColorStop(0.5, fill(a * 0.75)); g.addColorStop(0.85, fill(a * 0.25)); g.addColorStop(1, fill(0)); c.fillStyle = g; c.beginPath(); c.arc(x, y, R, 0, TAU); c.fill(); }
        c.restore();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, sen = O.cam.sensor(V.fmt);
        const fw = Math.min(W - 24, (Hh - 20) * sen.w / sen.h), fh = fw * sen.h / sen.w, x0 = (W - fw) / 2, y0 = (Hh - fh) / 2;
        const f = V.f, s0 = V.s0 * 1000, s = V.s * 1000;
        const b = f * f / (V.N * (s0 - f)) * Math.abs(s - s0) / s, binf = f * f / (V.N * (s0 - f));
        const Rpx = clamp(b / sen.w * fw / 2, 0, 0.22 * fw);
        c.save(); c.beginPath(); c.rect(x0, y0, fw, fh); c.clip(); c.fillStyle = '#06060b'; c.fillRect(x0, y0, fw, fh);
        const cx = x0 + fw / 2, cy = y0 + fh / 2, rmax = Math.hypot(fw / 2, fh / 2);
        for (const L of LIGHTS) { const x = x0 + L.u * fw, y = y0 + L.v * fh; disc(c, x, y, Rpx, { style: V.style, n: V.blades, alpha: clamp(0.85 * Math.pow(12 / Math.max(Rpx, 1), 2) * L.a, 0.06, 0.8), col: COL[L.col], cx, cy, t: Math.hypot(x - cx, y - cy) / rmax }); }
        for (const [u, v] of SHARP) { c.fillStyle = 'rgba(255,255,255,0.95)'; c.beginPath(); c.arc(x0 + u * fw, y0 + v * fh, 1.8, 0, TAU); c.fill(); }
        c.restore(); c.strokeStyle = C.grid; c.strokeRect(x0 - 0.5, y0 - 0.5, fw + 1, fh + 1);
        kit.label(c, 'frame: ' + sen.w + ' × ' + sen.h + ' mm; the sharp points are at the focus distance, the discs are the lights beyond', W / 2, Hh - 4, { align: 'center', color: C.faint, size: 11, baseline: 'bottom' });
        if (b / sen.w * fw / 2 > 0.22 * fw) kit.label(c, 'discs drawn at most 22 % of the frame wide', x0 + 6, y0 + 14, { color: C.warn, size: 11 });
        ro.set('b', b < 0.1 ? (b * 1000).toFixed(0) + ' µm' : b.toFixed(2) + ' mm'); ro.set('frac', pct(b / sen.w)); ro.set('px', fmt(b / 0.004, 3) + ' pixels');
        ro.set('inf', binf.toFixed(2) + ' mm (' + pct(binf / sen.w) + ' of the width)'); ro.set('zero', b > 0.0005 ? lpmm(1.22 / b) : 'above 2 000 lp/mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
