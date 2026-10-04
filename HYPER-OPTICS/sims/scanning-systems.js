/* HYPER-OPTICS · sims/scanning-systems.js — simulations of the topic "Scanners at work" (ids ss-…)
 *   ss-flatbed       a flatbed scanner: the carriage under the glass, and what a chirp chart looks like when sampled at a chosen dpi
 *   ss-barcode       a laser bar-code scanner: the beam's spot against the width of the bars, and the signal that results
 *   ss-printer       a laser printer engine: polygon, f-theta lens, start-of-scan detector and the latent image on the drum
 *   ss-marking       an X–Y galvanometer head with an f-theta lens: field size against spot size
 *   ss-projection    a laser show (vector) and a MEMS pico-projector (raster): points per frame and lines per frame
 *   ss-confocal      a laser-scanning microscope: the pinhole against out-of-focus light, and the optical section
 *   ss-lidar         a spinning lidar in a room: time of flight, points per second and spot spacing
 *   ss-triangulation laser triangulation: where the spot lands on the sensor, depth resolution, Scheimpflug
 *   ss-fringes       structured light: four phase-shifted fringe images, the wrapped phase and the height
 *   ss-tof           a time-of-flight camera: phase, ambiguity range, multipath, two frequencies
 *   ss-tdi           a TDI line-scan sensor: stages, signal-to-noise and the smear of a speed mismatch
 *   ss-oct           optical coherence tomography: bandwidth against axial resolution, A-scan and B-scan
 *   ss-pickup        an optical disc pickup: the spot against the pits of a CD, a DVD and a Blu-ray disc, drawn to one scale
 * Every number comes from kit.optics (O.scan, O.beam, O.cam, O.diff, O.mtf …); the drawing from kit.osym and the canvas.
 * Pictures that depend only on the controls are cached (S.image with a key) or drawn only on a change.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * Math.PI, D2R = PI / 180, R2D = 180 / PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  // a repeatable pseudo-random number in 0…1 from an integer
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const erf = x => { const s = x < 0 ? -1 : 1; x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x)); };
  const fmtLen = mm => mm >= 1000 ? (mm / 1000).toFixed(2) + ' m' : mm >= 100 ? mm.toFixed(0) + ' mm' : mm >= 10 ? mm.toFixed(1) + ' mm' : mm >= 1 ? mm.toFixed(2) + ' mm' : mm >= 0.001 ? (mm * 1000).toFixed(mm >= 0.1 ? 0 : 1) + ' µm' : (mm * 1e6).toFixed(0) + ' nm';
  const fmtHz = hz => hz >= 1e6 ? (hz / 1e6).toFixed(hz >= 1e8 ? 0 : 1) + ' MHz' : hz >= 1e3 ? (hz / 1e3).toFixed(hz >= 1e5 ? 0 : 1) + ' kHz' : hz.toFixed(0) + ' Hz';
  const fmtT = s => s >= 1 ? s.toFixed(2) + ' s' : s >= 1e-3 ? (s * 1e3).toFixed(2) + ' ms' : s >= 1e-6 ? (s * 1e6).toFixed(1) + ' µs' : (s * 1e9).toFixed(0) + ' ns';

  /* ================================================================ a flatbed scanner */
  Hyper.sim('ss-flatbed', {
    title: 'A flatbed scanner: one row of pixels and a motor',
    blurb: `The top picture is a side view of the scanner: a carriage runs under the glass, and a bright line on the page is imaged, through three mirrors and a reducing lens, on a **line sensor** (or, in a contact image sensor, straight through a row of rod lenses). The bottom picture is a test chart whose line pairs get finer to the right, and what the scanner makes of it at the dpi you choose. The sensor is ideal here: each pixel simply averages the chart over its own width.

**Try this**
- Raise the resolution from 150 to 600 dpi. The stripes stay clean further to the right. The dashed line is the **Nyquist limit**, half the sampling frequency: beyond it the pattern comes back as *false*, coarser stripes (aliasing).
- Tick *interpolate ×4*: the third row is smooth, but the false stripes are still there. Software cannot undo aliasing; 2400 dpi optical can.
- Watch the **magnification** the lens needs (read-out): it is the pixel pitch divided by the spacing on the page, 0.165 for 7 µm pixels at 600 dpi. A bigger pixel pitch needs less reduction.
- Switch to the contact image sensor: no mirrors and no reducing lens, the sensor is as wide as the page, and the image is life-size.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 210 });
      const st2 = kit.stage(box.stage, { aspect: 0.3, minH: 205 });
      const ctl = kit.controls(box.side, [
        { id: 'dpi', type: 'select', label: 'Scan resolution', options: [['150 dpi', 150], ['300 dpi', 300], ['600 dpi', 600], ['1200 dpi', 1200], ['2400 dpi', 2400]], value: params.dpi || 300 },
        { id: 'interp', type: 'check', label: 'Interpolate ×4 in software', value: false },
        { id: 'cis', type: 'check', label: 'Contact image sensor (CIS) instead of lens and mirrors', value: !!params.cis },
        { id: 'pp', label: 'Pixel pitch of the sensor', min: 4, max: 10, step: 0.5, value: 7, unit: 'µm' }
      ], () => { drawChart(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Sample spacing on the page'], ['nyq', 'Nyquist limit'], ['px', 'A4 page'], ['file', 'Raw file, 24-bit colour'], ['m', 'Magnification of the lens'], ['len', 'Pixels along a 216 mm line']]);
      const CH = { L: 10, k: 2.4 };                       // the chart: a chirp over 10 mm whose spatial frequency rises as k·x, 0 to 24 line pairs per mm
      const chart = x => 0.5 + 0.5 * Math.cos(PI * CH.k * x * x);
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cis = V.cis;
        const xa = 26, xb = W - 26, yg = Hh * 0.27, yb = Hh * 0.86, dy = yb - yg;
        c.fillStyle = C.surface; c.strokeStyle = C.axis; c.lineWidth = 1.2;
        c.fillRect(xa - 10, yg - 4, xb - xa + 20, dy + 4); c.strokeRect(xa - 10, yg - 4, xb - xa + 20, dy + 4);
        c.fillStyle = S.glass(0.4); c.fillRect(xa, yg - 3, xb - xa, 4);                       // the platen
        c.fillStyle = C.dark ? '#e8e6d9' : '#fbfaf2'; c.fillRect(xa + 4, yg - 9, xb - xa - 8, 6);   // the sheet
        c.fillStyle = C.muted; c.fillRect(xa - 10, yg - 17, xb - xa + 20, 6);                  // the lid
        const ph = (t * 0.17) % 2, pos = ph < 1 ? ph : 2 - ph, cx = xa + 52 + (xb - xa - 104) * pos;
        if (ph < 1) { c.fillStyle = 'rgba(123,140,255,0.45)'; c.fillRect(xa + 4, yg - 9, Math.max(0, cx - xa - 4), 6); }
        // the carriage
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = C.text; c.lineWidth = 1.1;
        c.fillRect(cx - 44, yg + 8, 88, dy - 16); c.strokeRect(cx - 44, yg + 8, 88, dy - 16);
        // the line light
        for (const s of [-1, 1]) { c.fillStyle = 'rgba(255,224,150,0.95)'; c.fillRect(cx + s * 32 - 4, yg + 8, 8, 5); S.ray(c, [[cx + s * 32, yg + 9], [cx, yg - 1]], { nm: 590, width: 1.2, alpha: 0.7, arrows: false }); }
        c.fillStyle = 'rgba(255,224,150,0.9)'; c.fillRect(cx - 3, yg - 4, 6, 3);
        const yA = yg + 0.3 * dy, yB = yg + 0.66 * dy, a = 56;
        if (!cis) {
          const mir = (x, y, up) => { c.strokeStyle = S.metal(); c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 7, y + (up ? 7 : -7)); c.lineTo(x + 7, y + (up ? -7 : 7)); c.stroke(); };
          S.ray(c, [[cx, yg], [cx, yA], [cx + a, yA], [cx + a, yB], [cx + 0.1 * a, yB]], { nm: 580, width: 1.8, minArrow: 22 });
          mir(cx, yA, false); mir(cx + a, yA, false); mir(cx + a, yB, true);
          S.lens(c, cx + 0.56 * a - 3, yB, 8, { f: 1 });
          S.sensor(c, cx + 0.1 * a - 5, yB, 6, { pixels: 6 });
        } else {
          c.fillStyle = S.glass(0.55); c.strokeStyle = S.edge(); c.lineWidth = 1;
          for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(cx - 12 + 12 * i, yg + 24, 5.5, 0, TAU); c.fill(); c.stroke(); }
          S.ray(c, [[cx, yg], [cx, yg + 0.5 * dy]], { nm: 580, width: 1.8, minArrow: 22 });
          c.fillStyle = C.ok; c.fillRect(cx - 18, yg + 0.5 * dy, 36, 5);
        }
        kit.label(c, 'side view: the carriage moves along the page', 14, 11, { color: C.muted, size: 11.5, align: 'left' });
        kit.label(c, cis ? 'carriage: LED line light · rod-lens array · line sensor' : 'carriage: LED line light · three mirrors · lens · line sensor', W / 2, Hh - 8, { color: C.muted, size: 11.5 });
      }, box.stage);

      function drawChart() {
        const c = st2.begin(), C = kit.colors(), W = st2.W;
        const x0 = 14, w = W - 28, pmm = 25.4 / V.dpi, N = Math.max(2, Math.round(CH.L / pmm));
        const sm = [];
        for (let i = 0; i < N; i++) { let s = 0; for (let j = 0; j < 6; j++) s += chart((i + (j + 0.5) / 6) * pmm); sm.push(s / 6); }
        const hh = 26, y1 = 30, y2 = y1 + hh + 26, y3 = y2 + hh + 24, yEnd = V.interp ? y3 + hh : y2 + hh;
        const du = 1 / w;
        S.fringes(c, x0, y1, w, hh, u => { let s = 0; for (let j = 0; j < 4; j++) s += chart((u - du / 2 + du * (j + 0.5) / 4) * CH.L); return s / 4; }, { gamma: 1, step: 1 });
        kit.label(c, 'the chart: line pairs get finer to the right, 0 to 24 per mm', x0, y1 - 10, { color: C.muted, size: 11.5, align: 'left' });
        for (let i = 0; i < N; i++) { const g = Math.round(255 * sm[i]); c.fillStyle = 'rgb(' + g + ',' + g + ',' + g + ')'; c.fillRect(x0 + w * i / N, y2, w / N + 0.6, hh); }
        kit.label(c, 'what the scanner delivers: ' + N + ' samples, ' + V.dpi + ' dpi', x0, y2 - 10, { color: C.muted, size: 11.5, align: 'left' });
        if (V.interp) {
          const r = O.cam.resample(sm, 4 * N, 'cubic'), n4 = r.length;
          for (let i = 0; i < n4; i++) { const g = Math.round(255 * clamp(r[i], 0, 1)); c.fillStyle = 'rgb(' + g + ',' + g + ',' + g + ')'; c.fillRect(x0 + w * i / n4, y3, w / n4 + 0.6, hh); }
          kit.label(c, 'same, interpolated ×4: no new detail', x0, y3 - 10, { color: C.muted, size: 11.5, align: 'left' });
        }
        // frequency axis and the Nyquist limit
        const fx = f => x0 + w * (f / CH.k) / CH.L;
        for (let f = 0; f <= 20; f += 5) kit.label(c, String(f), fx(f), yEnd + 12, { color: C.faint, size: 10.5 });
        kit.label(c, 'lp/mm', W - 14, yEnd + 12, { color: C.faint, size: 10.5, align: 'right' });
        const fN = 1 / (2 * pmm);
        if (fN < CH.k * CH.L) {
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(fx(fN), y1 - 4); c.lineTo(fx(fN), yEnd + 2); c.stroke(); c.restore();
          kit.label(c, 'Nyquist ' + fN.toFixed(1), clamp(fx(fN), 50, W - 50), yEnd + 28, { color: C.warn, size: 11 });
        } else kit.label(c, 'Nyquist limit ' + fN.toFixed(1) + ' per mm: beyond this chart', W / 2, yEnd + 28, { color: C.warn, size: 11 });
        const p = Sc.dpiPitch(V.dpi) * 1e6, nx = 210 / 25.4 * V.dpi, ny = 297 / 25.4 * V.dpi, nline = 216 / 25.4 * V.dpi;
        ro.set('p', p.toFixed(1) + ' µm  (25.4 mm ÷ ' + V.dpi + ')');
        ro.set('nyq', fN.toFixed(1) + ' line pairs per mm  (' + (V.dpi / 2) + ' per inch)');
        ro.set('px', Math.round(nx) + ' × ' + Math.round(ny) + '  (' + (nx * ny / 1e6).toFixed(1) + ' megapixels)');
        ro.set('file', (nx * ny * 3 / 1e6).toFixed(0) + ' MB');
        ro.set('m', V.cis ? '1 : 1  (life size, rod lenses)' : (V.pp / p).toFixed(3) + '  (reduction ' + (p / V.pp).toFixed(1) + ' ×)');
        ro.set('len', Math.round(nline) + (V.cis ? '  (a sensor as wide as the page)' : '  (sensor ' + (nline * V.pp / 1000).toFixed(1) + ' mm long)'));
      }
      st.onResize(() => loop.once()); st2.onResize(drawChart);
      drawChart(); loop.start(); loop.once();
    }
  });

  /* ================================================================ a bar-code scanner */
  Hyper.sim('ss-barcode', {
    title: 'A laser bar-code scanner: the spot against the bars',
    blurb: `A red laser spot sweeps across a bar code and a photodiode reads the light scattered back. **Top**: the beam from the scanner, focused to a waist 300 mm away; heights are exaggerated about forty-fold. **Middle**: the code at true scale, with the spot (a circle of its 1/e² radius) sweeping across it. **Bottom**: the signal, which is the bars blurred by the spot.

**Try this**
- Move the code to the waist (300 mm): the spot is as small as it gets and the signal is a clean square wave. Move it to 800 mm: the spot has grown and the narrow bars blur into one grey.
- Make the waist smaller (0.08 mm): fine bars read near the waist, but the zone where they read shrinks quickly, as the square of the waist radius.
- Raise the **X-dimension** to 0.66 mm (a code printed at 200 %): the same wide spot now comes close to reading it.
- Lower the print contrast: the signal swing falls and the verdict fails earlier. The thresholds in the verdict are illustrative.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, B = O.beam, Sc = O.scan;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 340 });
      const NM = 650, ZW = 300, WIN = 14;                       // wavelength (nm), distance of the waist from the scanner (mm), width of the window on the code (mm)
      const PAT = [1, 1, 1, 1, 1, 1, 2, 1, 1, 3, 2, 1, 1, 2, 1, 1, 1, 3, 1, 1, 2, 2, 1, 1, 1, 3, 1, 2, 1, 1];     // widths in X, starting with a bar
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Distance of the code from the scanner', min: 50, max: 950, step: 5, value: params.d || 300, unit: 'mm' },
        { id: 'w0', label: 'Waist radius of the beam', min: 0.08, max: 0.4, step: 0.01, value: params.w0 || 0.15, unit: 'mm' },
        { id: 'X', label: 'X-dimension of the code', min: 0.19, max: 0.66, step: 0.01, value: 0.33, unit: 'mm' },
        { id: 'pc', label: 'Print contrast', min: 40, max: 95, step: 5, value: 85, unit: '%' }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['w', 'Beam radius at the code'], ['r', 'Spot diameter ÷ X-dimension'], ['zone', 'Waist zone, 2 z_R'], ['m', 'Contrast kept on the narrowest bar'], ['v', 'Verdict']]);
      let cache = { key: '', sig: null, m: 0 };
      const compute = () => {
        const key = [V.d, V.w0, V.X, V.pc].join();
        if (cache.key === key) return cache;
        const w = B.w((V.d - ZW) * 1e-3, V.w0 * 1e-3, NM) * 1e3, Rs = 0.85, Rb = Rs * (1 - V.pc / 100);
        const segs = [{ a: -1e3, b: 0, bar: false }];
        let x = 0; PAT.forEach((u, i) => { segs.push({ a: x, b: x + u * V.X, bar: i % 2 === 0 }); x += u * V.X; });
        segs.push({ a: x, b: 1e3, bar: false });
        const at = x0 => { let s = 0; for (const g of segs) s += (g.bar ? Rb : Rs) * 0.5 * (erf(Math.SQRT2 * (g.b - x0) / w) - erf(Math.SQRT2 * (g.a - x0) / w)); return s; };
        const off = (WIN - x) / 2, M = 280, sig = [];
        for (let i = 0; i <= M; i++) sig.push(at(WIN * i / M - off));
        // the narrowest bars between two narrow spaces: the worst contrast they keep
        let worst = 1, any = false, pos = 0;
        const centres = PAT.map((u, i) => { const c = (pos + u / 2) * V.X; pos += u; return c; });
        for (let i = 1; i < PAT.length - 1; i++) if (i % 2 === 0 && PAT[i] === 1 && PAT[i - 1] === 1 && PAT[i + 1] === 1) { any = true; worst = Math.min(worst, (0.5 * (at(centres[i - 1]) + at(centres[i + 1])) - at(centres[i])) / (Rs - Rb)); }
        cache = { key, sig, off, w, m: any ? clamp(worst, 0, 1) : 1, Rs, Rb, segs };
        return cache;
      };
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, K = compute();
        // ---- the beam from the scanner
        const ys = 0.15 * Hh, bx0 = 54, bx1 = W - 18, X = z => bx0 + (bx1 - bx0) * z / 1000;
        const zR = B.rayleigh(V.w0 * 1e-3, NM) * 1e3, sy = Math.min(0.1 * Hh / 1.7, 30), hw = z => Math.min(0.1 * Hh, Math.max(0.8, sy * B.w((z - ZW) * 1e-3, V.w0 * 1e-3, NM) * 1e3));
        c.fillStyle = 'rgba(224,160,48,0.14)'; c.fillRect(X(ZW - zR), ys - 0.1 * Hh, X(ZW + zR) - X(ZW - zR), 0.2 * Hh);
        S.beam(c, X(0), X(1000), ys, x => hw(1000 * (x - bx0) / (bx1 - bx0)), { nm: NM, alpha: 0.45 });
        S.source(c, 22, ys, { kind: 'laser', color: S.nm(NM), size: 8 });
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X(V.d), ys - 0.11 * Hh); c.lineTo(X(V.d), ys + 0.11 * Hh); c.stroke();
        kit.label(c, 'code', X(V.d) + (V.d > 880 ? -5 : 5), ys - 0.11 * Hh + 7, { color: C.text, size: 11.5, align: V.d > 880 ? 'right' : 'left' });
        kit.label(c, 'waist zone 2z_R = ' + fmtLen(2 * zR), X(ZW), ys + 0.1 * Hh + 11, { color: C.warn, size: 11 });
        kit.label(c, 'beam drawn ×' + Math.round(sy / ((bx1 - bx0) / 1000)) + ' wider than long', W - 18, Hh - 8, { color: C.faint, size: 10.5, align: 'right' });
        // ---- the code at true scale, and the spot sweeping across it
        const wx0 = 18, wx1 = W - 18, pm = (wx1 - wx0) / WIN, yc0 = 0.37 * Hh, yc1 = 0.52 * Hh;
        c.save(); c.beginPath(); c.rect(wx0, yc0, wx1 - wx0, yc1 - yc0); c.clip();
        c.fillStyle = C.dark ? '#e8e6d9' : '#fbfaf2'; c.fillRect(wx0, yc0, wx1 - wx0, yc1 - yc0);
        for (const g of K.segs) if (g.bar) { c.fillStyle = 'rgba(30,34,48,' + (V.pc / 100) + ')'; c.fillRect(wx0 + (g.a + K.off) * pm, yc0, (g.b - g.a) * pm, yc1 - yc0); }
        const sweep = (t * 0.22) % 1, xs = sweep * WIN;
        c.restore();
        const spx = wx0 + xs * pm, spy = (yc0 + yc1) / 2, sr = Math.min(K.w * pm, 0.15 * Hh);
        c.save(); c.strokeStyle = S.nm(NM); c.fillStyle = S.nm(NM, 0.3); c.lineWidth = 1.8; c.beginPath(); c.arc(spx, spy, Math.max(1.5, sr), 0, TAU); c.fill(); c.stroke(); c.restore();
        kit.label(c, 'the code, true scale: window ' + WIN + ' mm across', wx0, yc0 - 9, { color: C.muted, size: 11.5, align: 'left' });
        // ---- the signal
        const sy0 = 0.62 * Hh, sy1 = 0.92 * Hh, lo = 0, hi = 0.95;
        c.fillStyle = C.surface; c.fillRect(wx0, sy0, wx1 - wx0, sy1 - sy0);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(wx0, sy1 - (sy1 - sy0) * K.Rs / hi); c.lineTo(wx1, sy1 - (sy1 - sy0) * K.Rs / hi); c.moveTo(wx0, sy1 - (sy1 - sy0) * K.Rb / hi); c.lineTo(wx1, sy1 - (sy1 - sy0) * K.Rb / hi); c.stroke(); c.setLineDash([]);
        const M = K.sig.length - 1, upto = Math.floor(sweep * M);
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= upto; i++) { const px = wx0 + (wx1 - wx0) * i / M, py = sy1 - (sy1 - sy0) * K.sig[i] / hi; i ? c.lineTo(px, py) : c.moveTo(px, py); }
        c.stroke();
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(spx, sy0); c.lineTo(spx, sy1); c.stroke();
        kit.label(c, 'photodiode signal (dashed: full print contrast)', wx0, sy0 - 9, { color: C.muted, size: 11, align: 'left' });
        const ratio = 2 * K.w / V.X, verdict = K.m >= 0.5 ? 'reads' : K.m >= 0.25 ? 'marginal' : 'fails: the narrow bars are blurred together';
        ro.set('w', fmtLen(K.w) + '  (1/e² radius)');
        ro.set('r', ratio.toFixed(2));
        ro.set('zone', fmtLen(Sc.barcodeDepth(V.w0 * 1e-3, NM) * 1e3) + '  (waist radius ' + V.w0.toFixed(2) + ' mm)');
        ro.set('m', (100 * K.m).toFixed(0) + ' % of the printed contrast');
        ro.set('v', verdict);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

  /* ================================================================ a laser printer engine */
  Hyper.sim('ss-printer', {
    title: 'A laser printer engine: polygon, f-theta lens and drum',
    blurb: `A fixed laser beam (drawn red; the real one is near-infrared) comes down on a spinning **polygon mirror**. Each facet sweeps it across the long **f-theta lens** and along the **drum**, the vertical bar on the right. The beam is on only in the middle of each sweep, the **active window**, and a **start-of-scan detector** at the top end of the drum catches it once per sweep to start the line. The strip on the far right is the drum surface unrolled: every sweep adds one line of dots. The picture runs in slow motion; the read-outs are for the real engine.

**Try this**
- Change the number of **facets** from 6 to 4 or 8. A facet sweeps 720°/n, so the polygon must turn faster or slower for the same lines per second.
- Double the **resolution** from 600 to 1200 dpi at the same paper speed: lines per second double and the pixel clock rises fourfold.
- Raise the **share of the sweep used for writing**: the pixel clock falls, but the lens must then be good over a wider angle.
- Watch the detector flash once per sweep: it makes every line start at the same place.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const rows = [];
      const ctl = kit.controls(box.side, [
        { id: 'n', type: 'select', label: 'Facets of the polygon', options: [['4', 4], ['5', 5], ['6', 6], ['8', 8]], value: params.n || 6 },
        { id: 'dpi', type: 'select', label: 'Resolution', options: [['300 dpi', 300], ['600 dpi', 600], ['1200 dpi', 1200]], value: params.dpi || 600 },
        { id: 'v', label: 'Paper speed', min: 50, max: 300, step: 5, value: 150, unit: 'mm/s' },
        { id: 'duty', label: 'Share of the sweep used for writing', min: 20, max: 60, step: 1, value: 40, unit: '%' }
      ], () => { rows.length = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lines', 'Scan lines per second'], ['rpm', 'Polygon speed'], ['sweep', 'Optical sweep of one facet'], ['px', 'Dots along an A4 line'], ['clk', 'Pixel clock'], ['dwell', 'Time per dot'], ['pitch', 'Dot spacing on the drum']]);
      const GLYPH = ['..###..', '.#...#.', '#.....#', '#.....#', '#######', '#.....#', '#.....#', '#.....#', '#.....#'];     // an A, 7 columns × 9 rows
      let psi = 0, prevTh = null, flash = 0, lineNo = 0;
      // the beam comes down on the polygon from above; the nominal facet normal points up and to the right, and the beam leaves to the right
      const scanAt = (P, rin, n, ang, ox) => {
        let best = null;
        for (let k = 0; k < n; k++) {
          const nu = ang + TAU * k / n, nx = Math.cos(nu), ny = Math.sin(nu);
          if (ny > -0.02) continue;                                        // not facing the beam
          const sk = (rin - (nx * (ox - P.x) + ny * (-1000))) / ny;        // distance along the beam, started 1000 px above the polygon
          const hx = ox, hy = P.y - 1000 + sk, tk = (hx - P.x) * (-ny) + (hy - P.y) * nx, half = rin * Math.tan(PI / n);
          if (Math.abs(tk) <= half && (!best || sk < best.s)) best = { k, s: sk, hx, hy, nx, ny };
        }
        if (!best) return null;
        const rx = -2 * best.ny * best.nx, ry = 1 - 2 * best.ny * best.ny;   // the reflected direction of a beam going down
        return Object.assign(best, { rx, ry, th: Math.atan2(ry, rx) });
      };
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, n = V.n, duty = V.duty / 100;
        const lines = V.v * V.dpi / 25.4, rpm = lines / n * 60, poly = Sc.polygon({ facets: n, rpm }), N = 204 / 25.4 * V.dpi, dwell = Sc.pixelDwell(poly.lineRate, N, duty);
        const thA = duty * TAU / n, thS = -(thA + 0.12 * TAU / n);                 // half the active window; where the start-of-scan detector sits
        const Px = 0.15 * W, Py = 0.5 * Hh, rin = Math.min(0.075 * W, 0.13 * Hh), rv = rin / Math.cos(PI / n), ox = Px + 0.7071 * rv;      // the beam meets the polygon where the facet that sweeps it about the horizontal passes
        const P = { x: Px, y: Py }, F = Math.min(0.5 * W, 0.3 * Hh / Math.abs(thS)), xd = Px + F, xl = Px + 0.55 * F, yAt = a => Py + F * a;
        psi += TAU * 0.5 * dt;
        const ang = -PI / 4 + psi, sc = scanAt(P, rin, n, ang, ox), th = sc ? sc.th : null;
        if (th != null) {
          if (prevTh != null && th < prevTh - 0.2 * TAU / n) { rows.unshift(lineNo); lineNo++; if (rows.length > 40) rows.pop(); }
          if (prevTh != null && prevTh < thS && th >= thS) flash = 1;
          prevTh = th;
        }
        flash = Math.max(0, flash - dt * 3);
        const active = th != null && Math.abs(th) <= thA, atSos = th != null && Math.abs(th - thS) < 0.09 * TAU / n, on = active || (atSos && flash > 0.4);
        const beamCol = 'rgba(255,70,70,';
        // laser and collimator, the incoming beam
        const yTop = Py - 0.4 * Hh;
        S.source(c, ox, yTop + 4, { kind: 'laser', color: S.nm(650), dir: PI / 2, size: 7 });
        c.fillStyle = S.glass(0.5); c.strokeStyle = S.edge(); c.lineWidth = 1.2; c.beginPath(); c.ellipse(ox, yTop + 26, 8, 3, 0, 0, TAU); c.fill(); c.stroke();
        kit.label(c, 'laser diode, collimator', ox + 14, yTop + 12, { color: C.muted, size: 11, align: 'left' });
        c.strokeStyle = on ? beamCol + '0.95)' : beamCol + '0.3)'; c.lineWidth = on ? 2 : 1; c.beginPath(); c.moveTo(ox, yTop + 28); c.lineTo(ox, sc ? sc.hy : Py - rin); c.stroke();
        // the f-theta lens and the drum
        const yL0 = yAt(-thA * 1.25), yL1 = yAt(thA * 1.25), yD0 = yAt(thS) - 14, yD1 = yAt(thA) + 14;
        c.fillStyle = S.glass(0.4); c.strokeStyle = S.edge(); c.lineWidth = 1.3; c.beginPath(); c.rect(xl - 5, yL0, 10, yL1 - yL0); c.fill(); c.stroke();
        kit.label(c, 'f-θ lens', xl, yL1 + 12, { color: C.muted, size: 11.5 });
        c.fillStyle = C.dark ? '#39405f' : '#b3bbd1'; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(xd - 2, yD0, 16, yD1 - yD0); c.strokeRect(xd - 2, yD0, 16, yD1 - yD0);
        kit.label(c, 'drum', xd + 6, yD1 + 12, { color: C.muted, size: 11.5 });
        c.fillStyle = flash > 0 ? 'rgba(255,70,70,' + (0.4 + 0.6 * flash) + ')' : C.muted; c.fillRect(xd - 14, yAt(thS) - 4, 9, 8);
        kit.label(c, 'start-of-scan detector', xd - 20, yAt(thS) - 6, { color: C.muted, size: 11, align: 'right' });
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(xd + 20, yAt(-thA)); c.lineTo(xd + 20, yAt(thA)); c.stroke(); c.restore();
        // the polygon, the active facet marked
        const pts = [];
        for (let k = 0; k < n; k++) { const a = ang + TAU * (k + 0.5) / n; pts.push([Px + rv * Math.cos(a), Py + rv * Math.sin(a)]); }
        S.poly(c, pts, { fill: S.glass(0.45), color: S.metal(), width: 1.8 });
        c.fillStyle = C.text; c.beginPath(); c.arc(Px, Py, 2.5, 0, TAU); c.fill();
        if (sc) { const a = pts[(sc.k + n - 1) % n], b = pts[sc.k]; c.strokeStyle = on ? beamCol + '1)' : C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
        kit.label(c, 'polygon, ' + n + ' facets', Px, Py + rv + 14, { color: C.muted, size: 11.5 });
        // the scanned beam, through the lens to the drum
        if (sc && Math.abs(th) < 80 * D2R) {
          const Sx = xd, Sy = yAt(th), ly = sc.hy + sc.ry / sc.rx * (xl - sc.hx);
          c.strokeStyle = on ? beamCol + '0.95)' : beamCol + '0.22)'; c.lineWidth = on ? 2 : 1;
          c.beginPath(); c.moveTo(sc.hx, sc.hy); c.lineTo(xl, ly); c.lineTo(Sx, Sy); c.stroke();
          if (on) { c.fillStyle = 'rgba(255,70,70,1)'; c.beginPath(); c.arc(Sx, Sy, 3.5, 0, TAU); c.fill(); }
        }
        // the drum surface unrolled: every sweep adds a line of dots (a column), the newest next to the drum
        const sx0 = xd + 32, ncol = 28, cw = Math.max(2.2, Math.min(6, (W - sx0 - 8) / ncol)), nd = 27, yA0 = yAt(-thA), yA1 = yAt(thA), dh = (yA1 - yA0) / nd;
        c.fillStyle = C.surface; c.fillRect(sx0, yA0, ncol * cw, yA1 - yA0);
        const prog = th == null ? 0 : clamp((th + thA) / (2 * thA), 0, 1);
        for (let r = 0; r < Math.min(rows.length + 1, ncol); r++) {
          const L = r === 0 ? lineNo : rows[r - 1], upto = r === 0 ? Math.floor(prog * nd) : nd, gx = Math.floor(((L % 14 + 14) % 14) / 2);
          for (let j = 0; j < upto && j < nd; j++) if (GLYPH[Math.floor(j / 3)][gx] === '#') { c.fillStyle = C.accent; c.fillRect(sx0 + r * cw + 0.3, yA0 + j * dh + 0.3, cw - 0.6, dh - 0.6); }
        }
        kit.label(c, 'drum, unrolled', sx0, yA0 - 10, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'slow motion: the real polygon turns ' + Math.round(lines / n / 0.5) + ' × faster', 12, Hh - 10, { color: C.faint, size: 10.5, align: 'left' });
        ro.set('lines', Math.round(poly.lineRate) + ' per second  (one every ' + fmtT(poly.facetTime) + ')');
        ro.set('rpm', Math.round(rpm) + ' rpm');
        ro.set('sweep', (poly.scanAngle * R2D).toFixed(0) + '°  (720° ÷ ' + n + '); writing in ±' + (thA * R2D).toFixed(0) + '°');
        ro.set('px', Math.round(N) + '  (204 mm at ' + V.dpi + ' dpi)');
        ro.set('clk', fmtHz(1 / dwell));
        ro.set('dwell', fmtT(dwell));
        ro.set('pitch', (Sc.dpiPitch(V.dpi) * 1e6).toFixed(1) + ' µm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

  /* ================================================================ a galvo marking head */
  Hyper.sim('ss-marking', {
    title: 'A galvo marking head: the field and the spot',
    blurb: `Left: the beam comes in from the left, is folded by a galvo mirror and focused by the f-theta lens on the work (only one mirror is drawn: the other turns the beam in the other direction). Right: the marking field seen from above, with a star being marked, and below it the focused spot at its true size next to a 100 µm bar. The mirror swing sets the field together with the focal length; the beam diameter sets the spot.

**Try this**
- Change the **lens** from 100 to 420 mm. The field grows in proportion, and so does the spot: read the *spots across the field*, which does not change.
- Widen the **beam** at the lens: the spot shrinks, and so does the depth of focus.
- Choose the **CO₂ laser**: the spot becomes ten times larger than for the fibre laser. That is why CO₂ marking is coarser.
- Make the mirror swing smaller: the field shrinks but the spot stays, so the number of spots across it falls.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan, B = O.beam;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'f', type: 'select', label: 'f-theta lens, focal length', options: [['100 mm', 100], ['160 mm', 160], ['254 mm', 254], ['420 mm', 420]], value: params.f || 160 },
        { id: 'D', label: 'Beam diameter at the lens', min: 4, max: 16, step: 0.5, value: 10, unit: 'mm' },
        { id: 'nm', type: 'select', label: 'Laser', options: [['355 nm ultraviolet', 355], ['532 nm green', 532], ['1064 nm fibre laser', 1064], ['10.6 µm CO₂', 10600]], value: params.nm || 1064 },
        { id: 'M2', label: 'Beam quality M²', min: 1, max: 3, step: 0.05, value: 1.2 },
        { id: 'mech', label: 'Mirror swing, ± from the centre', min: 4, max: 12, step: 0.5, value: 10, unit: '°' }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['field', 'Marking field'], ['beam', 'Beam swing (twice the mirror)'], ['spot', 'Focused spot diameter'], ['dof', 'Depth of focus, 2 z_R'], ['n', 'Spots across the field'], ['irr', 'Peak irradiance for 20 W continuous']]);
      // a pentagram, the path of the marking
      const STAR = [0, 1, 2, 3, 4, 0].map(k => { const a = -PI / 2 + k * 4 * PI / 5; return [0.78 * Math.cos(a), 0.78 * Math.sin(a)]; });
      const at = s => { const u = s * 5, i = Math.min(4, Math.floor(u)), t = u - i; return [lerp(STAR[i][0], STAR[i + 1][0], t), lerp(STAR[i][1], STAR[i + 1][1], t)]; };
      const nice = um => { const a = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000]; return a.find(v => v >= um) || 2000; };
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const thMax = Sc.galvoOptical(V.mech) * D2R, Wmm = 2 * V.f * thMax;
        const foc = B.focus({ w: V.D / 2 * 1e-3, f: V.f * 1e-3, nm: V.nm, M2: V.M2 }), d = 2 * foc.w0 * 1e3;      // spot diameter in mm
        const s = (t / 7) % 1, P = at(s);
        const L = Math.min(0.38 * W, 0.6 * Hh), cF = W - 14 - L / 2, yF = 0.1 * Hh + L / 2 + 14;
        // ---- left: the beam path, side view (one mirror)
        const wl = W - L - 44, xm = 12 + 0.45 * wl, ym = 0.15 * Hh, Fp = Math.min(0.6 * Hh, 0.42 * wl / (12.5 * D2R * 2)), yl = ym + 0.3 * Fp, yw = ym + Fp;
        const th = P[0] * thMax, hD = Math.min(20, V.D * 1.2);
        S.source(c, 22, ym, { kind: 'laser', color: S.nm(V.nm < 780 ? V.nm : 650), size: 8 });
        c.fillStyle = 'rgba(255,70,70,0.3)'; c.fillRect(30, ym - hD, xm - 30, 2 * hD);
        const xl = xm + Fp * 0.3 * Math.tan(th), xs = xm + Fp * th;
        c.fillStyle = 'rgba(255,70,70,0.3)'; c.beginPath(); c.moveTo(xm - hD, ym - hD); c.lineTo(xm + hD, ym + hD); c.lineTo(xl + hD, yl); c.lineTo(xl - hD, yl); c.closePath(); c.fill();
        c.fillStyle = 'rgba(255,70,70,0.3)'; c.beginPath(); c.moveTo(xl - hD, yl); c.lineTo(xl + hD, yl); c.lineTo(xs, yw); c.closePath(); c.fill();
        c.strokeStyle = 'rgba(255,70,70,0.95)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(22, ym); c.lineTo(xm, ym); c.lineTo(xl, yl); c.lineTo(xs, yw); c.stroke();
        const phi = PI / 4 - th / 2; c.strokeStyle = S.metal(); c.lineWidth = 3; c.beginPath(); c.moveTo(xm - 13 * Math.cos(phi), ym - 13 * Math.sin(phi)); c.lineTo(xm + 13 * Math.cos(phi), ym + 13 * Math.sin(phi)); c.stroke();
        c.fillStyle = S.glass(0.4); c.strokeStyle = S.edge(); c.lineWidth = 1.2; c.beginPath(); c.rect(xm - Fp * thMax * 0.55 - 12, yl - 3, 2 * Fp * thMax * 0.55 + 24, 6); c.fill(); c.stroke();
        c.fillStyle = C.muted; c.fillRect(xm - Fp * thMax - 14, yw, 2 * Fp * thMax + 28, 3);
        c.fillStyle = C.accent; c.beginPath(); c.arc(xs, yw, 3.5, 0, TAU); c.fill();
        kit.label(c, 'galvo mirror', xm + 16, ym - 12, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'f-θ lens', xm + Fp * thMax * 0.55 + 18, yl, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'work', xm, yw + 14, { color: C.muted, size: 11 });
        kit.label(c, 'f = ' + V.f + ' mm', xm + Fp * thMax * 0.55 + 18, yl + 13, { color: C.faint, size: 10.5, align: 'left' });
        // ---- right: the field from above, the star being marked
        c.fillStyle = C.surface; c.fillRect(cF - L / 2, yF - L / 2, L, L); c.strokeStyle = C.axis; c.lineWidth = 1.2; c.strokeRect(cF - L / 2, yF - L / 2, L, L);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(cF - L / 2, yF); c.lineTo(cF + L / 2, yF); c.moveTo(cF, yF - L / 2); c.lineTo(cF, yF + L / 2); c.stroke();
        const fx = p => cF + p[0] * L / 2, fy = p => yF + p[1] * L / 2;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); STAR.forEach((p, i) => i ? c.lineTo(fx(p), fy(p)) : c.moveTo(fx(p), fy(p))); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(fx(STAR[0]), fy(STAR[0]));
        for (let k = 1; k <= 60; k++) { const q = at(s * k / 60); c.lineTo(fx(q), fy(q)); }
        c.stroke();
        c.fillStyle = 'rgb(255,70,70)'; c.beginPath(); c.arc(fx(P), fy(P), 3.5, 0, TAU); c.fill();
        kit.label(c, 'field ' + Wmm.toFixed(0) + ' × ' + Wmm.toFixed(0) + ' mm', cF, yF - L / 2 - 9, { color: C.text, size: 11.5 });
        // ---- the focused spot against a 100 µm bar
        const um = d * 1000, sc = Math.min(1, 62 / um), yy = Math.min(Hh - 22, yF + L / 2 + 36), rr = Math.max(1.5, um * sc / 2);
        c.fillStyle = 'rgba(255,70,70,0.35)'; c.strokeStyle = 'rgb(255,70,70)'; c.lineWidth = 1.4; c.beginPath(); c.arc(cF - L / 4, yy, rr, 0, TAU); c.fill(); c.stroke();
        const bar = nice(um > 40 ? um * 1.2 : 100), bl = bar * sc;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(cF + L / 4 - bl / 2, yy); c.lineTo(cF + L / 4 + bl / 2, yy); c.stroke();
        kit.label(c, bar + ' µm', cF + L / 4, yy - 10, { color: C.text, size: 11 });
        kit.label(c, 'the spot, true size: ' + fmtLen(d), cF, yy + rr + 12, { color: C.muted, size: 11 });
        const N = Sc.resolvableSpots(2 * thMax, V.D * 1e-3, V.nm) / V.M2;
        ro.set('field', Wmm.toFixed(0) + ' × ' + Wmm.toFixed(0) + ' mm  (2 f θ)');
        ro.set('beam', '±' + (thMax * R2D).toFixed(0) + '°  (mirror ±' + V.mech + '°)');
        ro.set('spot', fmtLen(d) + '  (4 λ f M² ÷ π D)');
        ro.set('dof', fmtLen(2 * foc.zR * 1e3));
        ro.set('n', Math.round(N) + '  (field ÷ spot spacing ' + fmtLen(Wmm / N) + ')');
        ro.set('irr', (B.peakIrradiance(20, foc.w0) / 1e4).toExponential(1).replace('e+', ' × 10^') + ' W/cm²');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

  /* ================================================================ laser projection: vector and raster */
  Hyper.sim('ss-projection', {
    title: 'Laser projection: points per frame, lines per frame',
    blurb: `**Vector** (laser show): the beam follows the outline of a figure. The left screen shows it in slow motion, the right screen what the eye makes of it. The bar underneath shows the refresh rate against the flicker limits. **Raster** (a MEMS pico-projector): the left screen shows the zigzag the beam draws, the right strip the pixels of one line against the swing of the mirror.

**Try this**
- *Vector*: raise the **points the drawing needs** until the refresh rate falls under 30 Hz: the figure flickers. A faster scanner (more kpps) brings it back.
- *Raster*: change the **resonant frequency** and the **frame rate** and watch the lines per frame (2 f_res ÷ frames per second).
- Raise the **share of the swing used**: more of each line is used, but the pixels at the edges crowd together if the pixel clock is constant. Tick *pixel clock follows the mirror* and they are equally spaced again.
- The flicker of the right screen is shown slowed down.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Scanner', options: [['Vector: laser show, two galvo mirrors', 'vector'], ['Raster: MEMS pico-projector', 'raster']], value: params.mode || 'vector' },
        { id: 'kpps', label: 'Scanner speed', min: 10, max: 60, step: 1, value: 30, unit: 'kpps' },
        { id: 'pts', label: 'Points the drawing needs', min: 100, max: 3000, value: 800, log: true, sig: 3 },
        { id: 'shape', type: 'select', label: 'Figure', options: [['Star', 'star'], ['Circle', 'circle'], ['Lissajous curve', 'liss']], value: 'star' },
        { id: 'fres', label: 'Resonant frequency', min: 5, max: 30, step: 0.5, value: 18, unit: 'kHz' },
        { id: 'fps', label: 'Frame rate', min: 30, max: 75, step: 1, value: 60, unit: 'frames/s' },
        { id: 'use', label: 'Share of the swing used', min: 50, max: 95, step: 1, value: 80, unit: '%' },
        { id: 'clk', type: 'check', label: 'Pixel clock follows the mirror', value: false }
      ], () => vis());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Points per second'], ['b', 'Points the drawing needs'], ['c', 'Refresh rate'], ['d', 'Verdict'], ['e', 'Lines per second'], ['f', 'Lines per frame'], ['g', 'Writing share of each line'], ['h', 'Mirror speed at the edge'], ['i', 'Pixel clock while writing (16:9 pixels)']]);
      function vis() {
        const vec = V.mode === 'vector';
        for (const k of ['kpps', 'pts', 'shape']) ctl.show(k, vec);
        for (const k of ['fres', 'fps', 'use', 'clk']) ctl.show(k, !vec);
        for (const k of ['a', 'b', 'c', 'd']) ro.show(k, vec);
        for (const k of ['e', 'f', 'g', 'h', 'i']) ro.show(k, !vec);
      }
      const shapeAt = (kind, s) => kind === 'circle' ? [0.85 * Math.cos(TAU * s), 0.85 * Math.sin(TAU * s)] : kind === 'liss' ? [0.9 * Math.sin(3 * TAU * s + PI / 2), 0.9 * Math.sin(2 * TAU * s)] :
        (() => { const u = s * 5, i = Math.min(4, Math.floor(u)), t = u - i, A = k => { const a = -PI / 2 + k * 4 * PI / 5; return [0.88 * Math.cos(a), 0.88 * Math.sin(a)]; }, p = A(i), q = A((i + 1) % 5); return [lerp(p[0], q[0], t), lerp(p[1], q[1], t)]; })();
      let s = 0, t0 = 0;
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, vec = V.mode === 'vector';
        const gap = 14, sw = (W - 2 * 14 - gap) / 2, sh = Math.min(sw * 0.75, 0.5 * Hh), y0 = 28, xa = 14, xb = 14 + sw + gap;
        const frame = (x, y, w, h) => { c.fillStyle = C.dark ? '#05060d' : '#10131f'; c.fillRect(x, y, w, h); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x, y, w, h); };
        frame(xa, y0, sw, sh); frame(xb, y0, sw, sh);
        const mx = (x, p) => x + sw / 2 + p[0] * sw / 2 * 0.94, my = p => y0 + sh / 2 + p[1] * sh / 2 * 0.94;
        if (vec) {
          const pts = V.pts, R = V.kpps * 1000 / pts, speed = Math.min(1, R / 60) * 0.5 + 0.12;         // cycles a second in the slow-motion picture
          s = (s + dt * speed) % 1;
          // left: the beam in slow motion with a fading trail
          for (let k = 0; k < 40; k++) { const a = s - 0.35 * (1 - k / 40), b = s - 0.35 * (1 - (k + 1) / 40), p = shapeAt(V.shape, ((a % 1) + 1) % 1), q = shapeAt(V.shape, ((b % 1) + 1) % 1); c.strokeStyle = 'rgba(80,255,120,' + (0.1 + 0.85 * k / 40) + ')'; c.lineWidth = 2; c.beginPath(); c.moveTo(mx(xa, p), my(p)); c.lineTo(mx(xa, q), my(q)); c.stroke(); }
          const P = shapeAt(V.shape, s); c.fillStyle = '#c8ffd4'; c.beginPath(); c.arc(mx(xa, P), my(P), 3.5, 0, TAU); c.fill();
          kit.label(c, 'beam, slow motion', xa, y0 - 10, { color: C.muted, size: 11.5, align: 'left' });
          // right: what the eye makes of it; below the flicker limit it pulses
          const md = clamp((50 - R) / 50, 0, 0.85), al = 0.9 - md * (0.5 + 0.5 * Math.sin(TAU * 2.5 * t));
          c.strokeStyle = 'rgba(80,255,120,' + clamp(al, 0.05, 1) + ')'; c.lineWidth = 2.2; c.beginPath();
          for (let k = 0; k <= 160; k++) { const p = shapeAt(V.shape, (k / 160) % 1); k ? c.lineTo(mx(xb, p), my(p)) : c.moveTo(mx(xb, p), my(p)); }
          c.stroke();
          kit.label(c, R >= 50 ? 'eye: steady' : R >= 30 ? 'eye: borderline' : 'eye: flickers (slowed)', xb, y0 - 10, { color: R >= 30 ? C.muted : C.warn, size: 11.5, align: 'left' });
          // the refresh gauge on a log scale
          const gx0 = 24, gx1 = W - 24, gy = y0 + sh + 52, X = f => gx0 + (gx1 - gx0) * Math.log(clamp(f, 5, 300) / 5) / Math.log(60);
          c.fillStyle = 'rgba(229,72,77,0.25)'; c.fillRect(X(5), gy - 9, X(30) - X(5), 18); c.fillStyle = 'rgba(224,160,48,0.25)'; c.fillRect(X(30), gy - 9, X(50) - X(30), 18); c.fillStyle = 'rgba(34,179,122,0.25)'; c.fillRect(X(50), gy - 9, X(300) - X(50), 18);
          for (const f of [10, 30, 50, 100, 200]) kit.label(c, f + ' Hz', X(f), gy + 20, { color: C.faint, size: 10.5 });
          c.fillStyle = C.text; c.beginPath(); c.moveTo(X(R), gy - 12); c.lineTo(X(R) - 6, gy - 22); c.lineTo(X(R) + 6, gy - 22); c.closePath(); c.fill();
          kit.label(c, 'refresh rate ' + R.toFixed(0) + ' Hz  (' + V.kpps + ' kpps ÷ ' + Math.round(pts) + ' points)', gx0, gy - 28, { color: C.text, size: 11.5, align: 'left' });
          ro.set('a', V.kpps + ' 000');
          ro.set('b', Math.round(pts));
          ro.set('c', R.toFixed(0) + ' Hz  (≤ ' + Math.round(V.kpps * 1000 / 50) + ' points keeps 50 Hz)');
          ro.set('d', R >= 50 ? 'steady' : R >= 30 ? 'borderline: may flicker' : 'flickers: simplify the drawing or use a faster scanner');
        } else {
          const nl = Math.round(2 * V.fres * 1000 / V.fps), a = V.use / 100, show = Math.min(28, Math.max(6, Math.round(nl / 25)));
          s = (s + dt * 0.12) % 1;
          // left: the zigzag of the beam (fast sinusoid, slow ramp); only some of the lines are drawn
          c.strokeStyle = 'rgba(80,255,120,0.45)'; c.lineWidth = 1; c.beginPath();
          const NP = show * 24;
          for (let k = 0; k <= NP; k++) { const u = k / NP, p = [Math.sin(TAU * show * u / 2), -1 + 2 * u]; k ? c.lineTo(mx(xa, p), my(p)) : c.moveTo(mx(xa, p), my(p)); }
          c.stroke();
          const ph = TAU * show * s / 2, P = [Math.sin(ph), -1 + 2 * s]; c.fillStyle = '#c8ffd4'; c.beginPath(); c.arc(mx(xa, P), my(P), 3.5, 0, TAU); c.fill();
          c.save(); c.strokeStyle = C.warn; c.setLineDash([4, 3]); c.lineWidth = 1; const ux = [mx(xa, [-a, 0]), mx(xa, [a, 0])]; c.beginPath(); c.moveTo(ux[0], y0); c.lineTo(ux[0], y0 + sh); c.moveTo(ux[1], y0); c.lineTo(ux[1], y0 + sh); c.stroke(); c.restore();
          kit.label(c, 'zigzag: ' + show + ' of ' + nl + ' lines', xa, y0 - 10, { color: C.muted, size: 11.5, align: 'left' });
          // right: pixel positions along one line
          const NPX = 36, phm = Math.asin(a), yy = y0 + sh / 2;
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(xb + 8, yy + 20); c.lineTo(xb + sw - 8, yy + 20); c.stroke();
          for (let k = 0; k < NPX; k++) {
            const u = (k + 0.5) / NPX, x = V.clk ? (2 * u - 1) * a : Math.sin((2 * u - 1) * phm);
            c.strokeStyle = 'rgba(80,255,120,0.9)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(xb + sw / 2 + x * (sw / 2 - 10), yy - 22); c.lineTo(xb + sw / 2 + x * (sw / 2 - 10), yy + 14); c.stroke();
          }
          kit.label(c, V.clk ? 'clock follows the mirror' : 'constant pixel clock', xb, y0 - 10, { color: C.muted, size: 11.5, align: 'left' });
          kit.label(c, V.clk ? 'equally spaced' : 'crowded at the edges', xb + sw / 2, yy + 38, { color: V.clk ? C.ok : C.warn, size: 11.5 });
          // the position of the mirror over one cycle, with the used part
          const gx0 = 24, gx1 = W - 24, gy = y0 + sh + 56, gh = 26;
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
          for (let k = 0; k <= 120; k++) { const u = k / 120, x = gx0 + (gx1 - gx0) * u, y = gy - gh * Math.sin(TAU * u); k ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.stroke();
          c.fillStyle = 'rgba(34,179,122,0.22)';
          const u1 = Math.asin(a) / TAU, u2 = 0.5 - u1, u3 = 0.5 + u1, u4 = 1 - u1;
          c.fillRect(gx0, gy - gh, (gx1 - gx0) * u1, 2 * gh);
          c.fillRect(gx0 + (gx1 - gx0) * u2, gy - gh, (gx1 - gx0) * (u3 - u2), 2 * gh);
          c.fillRect(gx0 + (gx1 - gx0) * u4, gy - gh, (gx1 - gx0) * u1, 2 * gh);
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(gx0, gy); c.lineTo(gx1, gy); c.stroke();
          kit.label(c, 'mirror position; green = used', gx0, gy - gh - 12, { color: C.muted, size: 11, align: 'left' });
          const duty = 2 * Math.asin(a) / PI, lines = nl, px = lines * 16 / 9 * lines * V.fps;
          ro.set('e', Math.round(2 * V.fres * 1000) + ' per second');
          ro.set('f', nl + ' lines per frame  (' + (nl >= 720 ? 'at least 720p' : nl >= 480 ? 'at least 480 lines' : 'low resolution') + ')');
          ro.set('g', (100 * duty).toFixed(0) + ' %');
          ro.set('h', (100 * Math.sqrt(1 - a * a)).toFixed(0) + ' % of the speed at the centre');
          ro.set('i', fmtHz(px / duty) + '  (' + (px / 1e6).toFixed(0) + ' Mpixel/s on average)');
        }
      }, box.stage);
      vis();
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

  /* ================================================================ a confocal pinhole */
  Hyper.sim('ss-confocal', {
    title: 'The confocal pinhole: optical sectioning',
    blurb: `Only the returning light is drawn (the excitation laser, the scan mirrors and the dichroic mirror are left out). Light from the **focal plane** (green) comes to a focus in the **pinhole** and passes. Light from a **sheet above or below** it (violet) arrives as a blur disc and mostly hits the barrier. Bottom: how much of each plane's light reaches the detector, plane by plane, with and without the pinhole. The picture is a geometrical model with the Airy radius of the focus added; the numbers in the read-out are the usual textbook values.

**Try this**
- Move the sheet out of focus with **plane position**: the violet blur at the pinhole grows and the detected light falls. Without the pinhole (tick it off) it stays at 100 %: a widefield detector sees every plane equally.
- Open the **pinhole** to 3 AU: more light, but the dip in the curve widens, which is a thicker section. Close it below 1 AU and the peak falls: signal is lost.
- Change the objective: the section thickness follows 1.4 λ n/NA². At NA 0.4 it is 4.6 µm, at NA 1.4 just over half a micrometre.
- The lower-right circles show the view at the pinhole, to scale.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan;
      const OBJ = [{ NA: 0.4, n: 1 }, { NA: 0.75, n: 1 }, { NA: 0.95, n: 1 }, { NA: 1.2, n: 1.333 }, { NA: 1.4, n: 1.518 }];
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 270 });
      const plot = kit.plot(box.stage, { x: { label: 'plane position from the focus (µm)', name: 'z' }, y: { label: 'light detected', name: 'I', min: 0, max: 1.05 }, series: [] }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'obj', type: 'select', label: 'Objective', options: [['20× air, NA 0.40', 0], ['40× air, NA 0.75', 1], ['63× air, NA 0.95', 2], ['63× water, NA 1.20', 3], ['63× oil, NA 1.40', 4]], value: params.obj != null ? params.obj : 4 },
        { id: 'nm', type: 'select', label: 'Wavelength of the light detected', options: [['450 nm', 450], ['520 nm', 520], ['600 nm', 600], ['680 nm', 680]], value: 520 },
        { id: 'ph', label: 'Pinhole diameter', min: 0.2, max: 5, value: params.ph || 1, log: true, sig: 2, unit: 'AU' },
        { id: 'z', label: 'Plane position, in axial resolutions', min: -2.5, max: 2.5, step: 0.05, value: 1 },
        { id: 'on', type: 'check', label: 'Pinhole in place (off: widefield detection)', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['au', '1 Airy unit in the specimen'], ['lat', 'Lateral resolution, λ ÷ 2NA'], ['ax', 'Axial resolution, 1.4 λ n ÷ NA²'], ['sect', 'Section thickness with this pinhole (model)'], ['peak', 'Signal at the focus'], ['here', 'Light passed from this plane']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, o = OBJ[V.obj], nm = V.nm;
        const r = 0.61 * nm / o.NA, AU = 1.22 * nm / o.NA, z0 = 0.61 * nm * o.n / (o.NA * o.NA), ax = Sc.confocalAxial(nm, o.NA, o.n) * 1e9, lat = O.diff.abbe(nm, o.NA) * 1e9;
        const a = V.ph * r, dz = V.z * ax;
        const frac = z => V.on ? Math.min(1, a * a / (r * r * (1 + z * z / (z0 * z0)))) : 1;
        const P = V.on ? Math.min(1, a * a / (r * r)) : 1, fwhm = a >= r ? 2 * z0 * Math.sqrt(2 * a * a / (r * r) - 1) : 2 * z0, rho = r * Math.sqrt(1 + dz * dz / (z0 * z0));
        // ---- the optical path
        const yc = 0.46 * Hh, xs = 0.1 * W, xP = 0.62 * W, xL = (xs + xP) / 2, hL = 0.19 * Hh, xD = 0.84 * W, UN = 4.5;     // UN: px for the Airy radius at the pinhole
        const ra = UN, rp = Math.min(hL - 3, UN * rho / r), ap = Math.max(1.5, UN * a / r);
        S.axis(c, 8, yc, W - 8);
        S.thinLens(c, xL, yc, hL, 1, {});
        kit.label(c, 'objective + tube lens', xL, yc - hL - 10, { color: C.muted, size: 11 });
        // the specimen planes
        const xo = xs + V.z * 0.05 * W;
        c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(xs, yc - 0.75 * hL); c.lineTo(xs, yc + 0.75 * hL); c.stroke(); c.setLineDash([]);
        c.fillStyle = 'rgba(190,110,255,0.35)'; c.fillRect(xo - 2, yc - 0.65 * hL, 4, 1.3 * hL);
        kit.label(c, 'focal plane', xs, yc + 0.75 * hL + 12, { color: C.muted, size: 11 });
        kit.label(c, 'sheet', xo, yc - 0.65 * hL - 9, { color: 'rgb(190,110,255)', size: 11 });
        const g = frac(0), gA = 0.25 + 0.7 * g;
        // light from the focal point
        c.fillStyle = 'rgba(60,220,110,' + (0.18 * gA) + ')'; c.beginPath(); c.moveTo(xs, yc); c.lineTo(xL, yc - hL); c.lineTo(xP, yc - ra); c.lineTo(xP, yc + ra); c.lineTo(xL, yc + hL); c.closePath(); c.fill();
        c.strokeStyle = 'rgba(60,220,110,' + gA + ')'; c.lineWidth = 1.3; c.beginPath(); c.moveTo(xs, yc); c.lineTo(xL, yc - hL); c.lineTo(xP, yc - ra); c.moveTo(xs, yc); c.lineTo(xL, yc + hL); c.lineTo(xP, yc + ra); c.stroke();
        // light from the sheet (a point on the axis is drawn)
        const sg = V.z >= 0 ? 1 : -1, fo = frac(dz);
        c.fillStyle = 'rgba(190,110,255,0.14)'; c.beginPath(); c.moveTo(xo, yc); c.lineTo(xL, yc - hL); c.lineTo(xP, yc - sg * rp); c.lineTo(xP, yc + sg * rp); c.lineTo(xL, yc + hL); c.closePath(); c.fill();
        c.strokeStyle = 'rgba(190,110,255,0.85)'; c.lineWidth = 1.3; c.beginPath(); c.moveTo(xo, yc); c.lineTo(xL, yc - hL); c.lineTo(xP, yc - sg * rp); c.moveTo(xo, yc); c.lineTo(xL, yc + hL); c.lineTo(xP, yc + sg * rp); c.stroke();
        // the pinhole and what passes
        if (V.on) {
          c.fillStyle = C.text; c.fillRect(xP - 2, yc - hL - 4, 4, hL - ap + 4); c.fillRect(xP - 2, yc + ap, 4, hL - ap + 4);
          const pg = Math.min(rp, ap);
          c.fillStyle = 'rgba(60,220,110,' + (0.18 * gA) + ')'; c.beginPath(); c.moveTo(xP, yc - Math.min(ra, ap)); c.lineTo(xD, yc - 0.22 * hL); c.lineTo(xD, yc + 0.22 * hL); c.lineTo(xP, yc + Math.min(ra, ap)); c.closePath(); c.fill();
          c.fillStyle = 'rgba(190,110,255,' + (0.4 * fo) + ')'; c.beginPath(); c.moveTo(xP, yc - pg); c.lineTo(xD, yc - 0.22 * hL); c.lineTo(xD, yc + 0.22 * hL); c.lineTo(xP, yc + pg); c.closePath(); c.fill();
          kit.label(c, 'pinhole', xP, yc + hL + 16, { color: C.muted, size: 11 });
        } else {
          c.fillStyle = 'rgba(60,220,110,0.16)'; c.beginPath(); c.moveTo(xP, yc - ra); c.lineTo(xD, yc - 0.22 * hL); c.lineTo(xD, yc + 0.22 * hL); c.lineTo(xP, yc + ra); c.closePath(); c.fill();
          c.fillStyle = 'rgba(190,110,255,0.3)'; c.beginPath(); c.moveTo(xP, yc - rp); c.lineTo(xD, yc - 0.5 * hL); c.lineTo(xD, yc + 0.5 * hL); c.lineTo(xP, yc + rp); c.closePath(); c.fill();
          kit.label(c, 'no pinhole', xP, yc + hL + 16, { color: C.warn, size: 11 });
        }
        // the detector brightens with what arrives
        const tot = clamp(0.5 * g + 0.5 * fo, 0, 1);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(xD, yc - 0.3 * hL, 12, 0.6 * hL); c.strokeRect(xD, yc - 0.3 * hL, 12, 0.6 * hL);
        c.fillStyle = 'rgba(255,255,255,' + (0.1 + 0.8 * tot) + ')'; c.fillRect(xD + 1, yc - 0.3 * hL + 1, 10, 0.6 * hL - 2);
        kit.label(c, 'detector', xD + 6, yc + 0.3 * hL + 14, { color: C.muted, size: 11 });
        // the view at the pinhole, to scale
        const ix = W - 52, iy = Hh - 46, k = Math.min(1, 38 / Math.max(rho / r * UN, ap, 1));
        c.save(); c.beginPath(); c.arc(ix, iy, 40, 0, TAU); c.clip(); c.fillStyle = C.surface; c.fillRect(ix - 40, iy - 40, 80, 80);
        c.fillStyle = 'rgba(190,110,255,0.35)'; c.beginPath(); c.arc(ix, iy, Math.max(1, UN * rho / r * k), 0, TAU); c.fill();
        c.fillStyle = 'rgba(60,220,110,0.7)'; c.beginPath(); c.arc(ix, iy, Math.max(1, UN * k), 0, TAU); c.fill();
        c.restore(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.arc(ix, iy, Math.max(1.5, ap * k), 0, TAU); c.stroke();
        kit.label(c, 'at the pinhole', ix, iy - 48, { color: C.muted, size: 10.5 });
        kit.label(c, 'the excitation laser and the scan mirrors are not drawn', 12, Hh - 8, { color: C.faint, size: 10.5, align: 'left' });
        // the curve
        const pts = [], wide = [];
        for (let i = 0; i <= 100; i++) { const z = (i / 100 * 5 - 2.5) * ax; pts.push([z / 1000, frac(z)]); wide.push([z / 1000, 1]); }
        plot.set({ series: [{ pts, color: C.accent, label: V.on ? 'with the pinhole' : 'widefield' }, { pts: wide, color: C.muted, dash: true, label: 'widefield detection' }], vlines: [{ x: dz / 1000, label: '' }] });
        ro.set('au', (AU).toFixed(0) + ' nm  (pinhole ' + (V.ph * AU).toFixed(0) + ' nm in the specimen)');
        ro.set('lat', lat.toFixed(0) + ' nm');
        ro.set('ax', ax.toFixed(0) + ' nm');
        ro.set('sect', V.on ? (fwhm / 1000).toFixed(2) + ' µm (full width at half maximum)' : 'none: every plane is detected');
        ro.set('peak', (100 * P).toFixed(0) + ' % of the light from the focus');
        ro.set('here', (100 * fo).toFixed(0) + ' % of the light from this sheet');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a spinning lidar */
  Hyper.sim('ss-lidar', {
    title: 'A spinning lidar in a room: time of flight and point spacing',
    blurb: `A lidar at the centre of a room (top view) sends a pulse in every direction as it turns and times the echo. The dots are the measured points, coloured by distance, kept for one turn; the faint outlines are the room itself. One turn is shown in four seconds. The timing resolution quantizes the range: with a coarse clock the dots fall on rings.

**Try this**
- Set the **timing resolution** to 3 ns: the points snap to rings 45 cm apart. At 0.1 ns the rings are 1.5 cm apart and have disappeared.
- Make the **angular step** coarse (2°): the small pillar and the pedestrian are hit once or twice, or missed. Make it fine (0.1°) and they are drawn as outlines. Read how many points land on the pedestrian.
- Lower the **maximum range**: the far walls disappear because no echo comes back in time.
- Read the **pulse rate limit**: a channel may not send a pulse before the echo from the farthest target has returned.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 340 });
      const pts = [];
      const ctl = kit.controls(box.side, [
        { id: 'res', label: 'Angular step', min: 0.1, max: 2, value: params.res || 0.5, log: true, sig: 2, unit: '°' },
        { id: 'rate', type: 'select', label: 'Turns per second', options: [['5', 5], ['10', 10], ['20', 20]], value: 10 },
        { id: 'ch', type: 'select', label: 'Vertical channels (for the point rate)', options: [['16', 16], ['32', 32], ['64', 64], ['128', 128]], value: 64 },
        { id: 'dt', type: 'select', label: 'Timing resolution', options: [['3 ns', 3e-9], ['1 ns', 1e-9], ['0.3 ns', 0.3e-9], ['0.1 ns', 0.1e-9]], value: params.dt || 1e-9 },
        { id: 'rmax', label: 'Maximum range', min: 10, max: 60, step: 1, value: 40, unit: 'm' }
      ], () => { pts.length = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r', 'Distance in this direction'], ['t', 'Echo delay'], ['step', 'Range step of the clock'], ['pps', 'Points per second'], ['sp', 'Point spacing at the maximum range'], ['ped', 'Points across the pedestrian (one channel)'], ['prf', 'Pulse rate limit per channel']]);
      // the room: walls, a box, a car, a pillar and a pedestrian (metres)
      const rect = (cx, cy, w, h) => [[cx - w / 2, cy - h / 2, cx + w / 2, cy - h / 2], [cx + w / 2, cy - h / 2, cx + w / 2, cy + h / 2], [cx + w / 2, cy + h / 2, cx - w / 2, cy + h / 2], [cx - w / 2, cy + h / 2, cx - w / 2, cy - h / 2]];
      const SEG = [].concat(rect(2, 1, 64, 42), rect(12, -7, 5, 2.4), rect(-16, -9, 4.5, 2), rect(22, 9, 3, 3));
      const CIR = [[6, 12, 0.6], [-9, 5, 0.35]];
      const cast = a => {
        const dx = Math.cos(a), dy = Math.sin(a); let best = Infinity;
        for (const [x1, y1, x2, y2] of SEG) {
          const ex = x2 - x1, ey = y2 - y1, den = dx * ey - dy * ex;
          if (Math.abs(den) < 1e-9) continue;
          const t = (x1 * ey - y1 * ex) / den, u = (x1 * dy - y1 * dx) / den;
          if (t > 0 && u >= 0 && u <= 1 && t < best) best = t;
        }
        for (const [cx, cy, r] of CIR) {
          const b = dx * cx + dy * cy, cc = cx * cx + cy * cy - r * r, disc = b * b - cc;
          if (disc >= 0) { const t = b - Math.sqrt(disc); if (t > 0 && t < best) best = t; }
        }
        return best;
      };
      let ang = 0, next = 0;
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const step = V.res * D2R, dR = Sc.tofResolution(V.dt);
        ang += TAU * dt / 4;
        let guard = 0;
        while (next <= ang && guard++ < 1500) { const r = cast(next); if (r < V.rmax) { const m = Math.max(dR, dR * Math.round(r / dR)); pts.push({ x: m * Math.cos(next), y: m * Math.sin(next), r: m, t }); } next += step; }
        while (pts.length && (t - pts[0].t > 4.1 || pts.length > 4200)) pts.shift();
        const sc = Math.min(W / 72, Hh / 52), ox = W / 2, oy = Hh / 2, X = x => ox + x * sc, Y = y => oy + y * sc;
        // the room, faintly, and the range rings
        c.strokeStyle = C.faint; c.lineWidth = 1;
        for (const [x1, y1, x2, y2] of SEG) { c.beginPath(); c.moveTo(X(x1), Y(y1)); c.lineTo(X(x2), Y(y2)); c.stroke(); }
        for (const [cx, cy, r] of CIR) { c.beginPath(); c.arc(X(cx), Y(cy), Math.max(1.5, r * sc), 0, TAU); c.stroke(); }
        c.save(); c.strokeStyle = C.grid; c.setLineDash([3, 5]);
        for (const R of [10, 20, 30, 40]) { c.beginPath(); c.arc(ox, oy, R * sc, 0, TAU); c.stroke(); if (oy - R * sc > 14) kit.label(c, R + ' m', ox + 4, oy - R * sc + 9, { color: C.faint, size: 10, align: 'left' }); }
        c.restore();
        // the points
        const bk = new Map();
        for (const p of pts) { const age = clamp((t - p.t) / 4, 0, 1), key = Math.round((1 - clamp(p.r / V.rmax, 0, 1)) * 23) * 8 + Math.min(4, Math.floor(age * 5)); let q = bk.get(key); if (!q) bk.set(key, q = []); q.push(X(p.x) - 1, Y(p.y) - 1); }
        for (const [key, q] of bk) { c.fillStyle = 'hsla(' + Math.round((key >> 3) / 23 * 240) + ',85%,' + (C.dark ? 62 : 45) + '%,' + (1 - 0.85 * (key & 7) / 4.5).toFixed(2) + ')'; for (let i = 0; i < q.length; i += 2) c.fillRect(q[i], q[i + 1], 2.2, 2.2); }
        // the beam now
        const rNow = cast(ang), rr = rNow < V.rmax ? rNow : V.rmax;
        c.strokeStyle = 'rgba(255,70,70,0.85)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(ox, oy); c.lineTo(X(rr * Math.cos(ang)), Y(rr * Math.sin(ang))); c.stroke();
        c.fillStyle = C.text; c.beginPath(); c.arc(ox, oy, 4, 0, TAU); c.fill();
        kit.label(c, 'lidar', ox + 8, oy + 12, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'pedestrian', X(-9), Y(5) - 9, { color: C.muted, size: 10.5 });
        kit.label(c, 'pillar', X(6) + 8, Y(12), { color: C.muted, size: 10.5, align: 'left' });
        kit.label(c, 'colour: distance, red near, blue far', 12, Hh - 9, { color: C.faint, size: 10.5, align: 'left' });
        const res = V.res * D2R, rp = Math.hypot(-9, 5);
        ro.set('r', rNow < V.rmax ? rNow.toFixed(2) + ' m' : 'no echo within ' + V.rmax + ' m');
        ro.set('t', rNow < V.rmax ? fmtT(Sc.tofTime(rNow)) + '  (c·t ÷ 2)' : '—');
        ro.set('step', fmtLen(Sc.tofResolution(V.dt) * 1e3) + '  (' + fmtT(V.dt) + ')');
        ro.set('pps', (Sc.lidarPoints(V.ch, V.rate, res) / 1e6).toFixed(2) + ' million  (' + V.ch + ' channels, ' + V.rate + ' turns/s)');
        ro.set('sp', fmtLen(Sc.spinSpotSpacing(V.rmax, res) * 1e3));
        ro.set('ped', (2 * Math.asin(0.35 / rp) / res).toFixed(1) + '  (at ' + rp.toFixed(1) + ' m)');
        ro.set('prf', fmtHz(1 / Sc.tofTime(V.rmax)) + '  (round trip to ' + V.rmax + ' m: ' + fmtT(Sc.tofTime(V.rmax)) + ')');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

  /* ================================================================ laser triangulation */
  Hyper.sim('ss-triangulation', {
    title: 'Laser triangulation: where the spot lands, and how finely',
    blurb: `The laser (top left) sends a beam down; the camera lens, a **baseline** to its right, sees the spot. The picture is stretched sideways so that the geometry can be seen. On the right is the sensor, drawn to scale for the shaded measuring range (150 to 600 mm): the spot lands at f·b/z from the camera axis. Below, the depth step for one pixel and for a 0.1-pixel centroid.

**Try this**
- **Drag the surface** (or use the slider). Near the camera the spot is far along the sensor and each pixel is a small depth step; far away it crowds together and each pixel is a large step. The curve below rises as z².
- Double the **baseline**: the depth step halves, and the triangulation angle grows (more shadowing in a real scene).
- Fit a longer **lens**: again the step is smaller, but the sensor needed is longer.
- Untick the **tilt**: the spot blurs as the surface leaves the 300 mm the sensor is focused for.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan;
      const Z1 = 150, Z2 = 600, ZF = 300, NF = 4;       // the measuring range, the distance an untilted sensor is focused for, the f-number
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 330 });
      const plot = kit.plot(box.stage, { x: { label: 'distance of the surface (mm)', name: 'z', min: 100, max: 800 }, y: { label: 'depth step (µm)', name: 'Δz', log: true }, series: [] }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'z', label: 'Distance of the surface', min: 100, max: 800, step: 1, value: params.z || 300, unit: 'mm' },
        { id: 'b', label: 'Baseline', min: 40, max: 200, step: 1, value: params.b || 100, unit: 'mm' },
        { id: 'f', type: 'select', label: 'Focal length of the lens', options: [['8 mm', 8], ['12 mm', 12], ['16 mm', 16], ['25 mm', 25]], value: 16 },
        { id: 'p', label: 'Pixel pitch', min: 3, max: 10, step: 0.5, value: 5, unit: 'µm' },
        { id: 'tilt', type: 'check', label: 'Tilt the sensor (Scheimpflug)', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['x', 'Spot on the sensor, from the lens axis'], ['px', 'Position along the sensor'], ['dz', 'Depth step, one pixel'], ['dz1', 'Depth step, 0.1-pixel centroid'], ['ang', 'Triangulation angle'], ['tilt', 'Sensor tilt for a sharp line'], ['blur', 'Blur of the spot']]);
      const geo = () => { const W = st.W, Hh = st.H, wl = W * 0.58, x0 = 18, sx = (wl - 36) / 230, y0 = 0.16 * Hh, sz = 0.76 * Hh / 800; return { W, Hh, wl, x0, sx, y0, sz, X: x => x0 + (x + 10) * sx, Z: z => y0 + z * sz }; };
      kit.drag(st, { hover: true, hit: p => { const g = geo(); return p.x < g.wl && Math.abs(p.y - g.Z(V.z)) < 14 ? 'z' : null; }, move: (w, p) => { const g = geo(); ctl.set('z', clamp(Math.round((p.y - g.y0) / g.sz), 100, 800)); loop.once(); } });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), g = geo(), { W, Hh, wl, X, Z } = g;
        const z = V.z, b = V.b, f = V.f, p = V.p * 1e-3;
        const tri = Sc.triangulation({ z: z * 1e-3, p: V.p * 1e-6, f: f * 1e-3, b: b * 1e-3 }), xs = tri.shift * 1e3, dzp = tri.dz * 1e6;
        // the measuring range and the surface
        c.fillStyle = 'rgba(123,140,255,0.10)'; c.fillRect(g.x0, Z(Z1), wl - g.x0, Z(Z2) - Z(Z1));
        kit.label(c, 'measuring range', g.x0 + 4, Z(Z2) - 8, { color: C.faint, size: 10.5, align: 'left' });
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(g.x0, Z(z)); c.lineTo(wl - 6, Z(z)); c.stroke();
        c.strokeStyle = C.muted; c.lineWidth = 1; for (let x = g.x0; x < wl - 8; x += 9) { c.beginPath(); c.moveTo(x, Z(z)); c.lineTo(x - 5, Z(z) + 6); c.stroke(); }
        kit.label(c, 'surface (drag)', wl - 8, Z(z) - 10, { color: C.text, size: 11, align: 'right' });
        // the laser and its beam, the camera, and the ray through the lens centre
        S.source(c, X(0), g.y0 - 6, { kind: 'laser', color: S.nm(650), dir: PI / 2, size: 7 });
        c.strokeStyle = 'rgba(255,70,70,0.9)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(X(0), g.y0); c.lineTo(X(0), Z(z)); c.stroke();
        const lx = X(b), ap = 7;
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = C.text; c.lineWidth = 1.1; c.fillRect(lx - 14, g.y0 - 22, 28, 18); c.strokeRect(lx - 14, g.y0 - 22, 28, 18);
        c.fillStyle = S.glass(0.5); c.fillRect(lx - ap, g.y0 - 4, 2 * ap, 4);
        c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(lx, g.y0); c.lineTo(lx, Z(800)); c.stroke(); c.restore();
        c.strokeStyle = 'rgba(255,200,90,0.55)'; c.lineWidth = 1; c.beginPath(); c.moveTo(X(0), Z(z)); c.lineTo(lx - ap, g.y0); c.moveTo(X(0), Z(z)); c.lineTo(lx + ap, g.y0); c.stroke();
        c.strokeStyle = 'rgba(255,200,90,0.95)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(X(0), Z(z)); c.lineTo(lx, g.y0); c.stroke();
        c.fillStyle = 'rgb(255,70,70)'; c.beginPath(); c.arc(X(0), Z(z), 4, 0, TAU); c.fill();
        S.dim(c, X(0), g.y0 - 30, lx, g.y0 - 30, 'baseline b = ' + b + ' mm', { off: -9 });
        kit.label(c, 'laser', X(0) + 12, g.y0 - 8, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'camera', lx + 18, g.y0 - 14, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'sideways stretched ×' + (g.sx / g.sz).toFixed(1), 12, Hh - 8, { color: C.faint, size: 10.5, align: 'left' });
        // the sensor, to scale for the measuring range
        const xL = f * b * (1 / Z2), xR = f * b * (1 / Z1), Ls = xR - xL, sx0 = wl + 14, sw = W - sx0 - 14, ss = sw / Ls, sy = 0.2 * Hh;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(sx0, sy - 8, sw, 16); c.strokeRect(sx0, sy - 8, sw, 16);
        const px = sx0 + (xs - xL) * ss, inside = xs >= xL && xs <= xR;
        const blurUm = V.tilt ? 0 : (() => { const w1 = f * z / (z - f), w0 = f * ZF / (ZF - f); return 1000 * (f / NF) * Math.abs(w1 - w0) / w1; })();
        const br = Math.max(0, blurUm / 1000 * ss / 2);
        c.fillStyle = inside ? 'rgba(255,70,70,' + (br > 3 ? 0.4 : 0.95) + ')' : C.bad; c.beginPath(); c.arc(clamp(px, sx0 - 4, sx0 + sw + 4), sy, Math.max(2.5, br), 0, TAU); c.fill();
        kit.label(c, 'sensor, ' + Ls.toFixed(1) + ' mm = ' + Math.round(Ls / p) + ' pixels', sx0 + sw / 2, sy - 22, { color: C.muted, size: 11 });
        kit.label(c, inside ? 'the spot' : 'out of range', clamp(px, sx0 + 36, sx0 + sw - 36), sy + 22, { color: inside ? C.muted : C.bad, size: 11 });
        // the tilt
        const tl = Math.atan(f / b), ty = 0.42 * Hh, cx0 = sx0 + sw / 2;
        c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(cx0 - sw * 0.4, ty); c.lineTo(cx0 + sw * 0.4, ty); c.stroke();
        const ex = Math.min(5, 28 / Math.max(1, tl * R2D)), a2 = V.tilt ? tl * ex : 0;
        c.strokeStyle = C.accent; c.lineWidth = 2.5; c.beginPath(); c.moveTo(cx0 - sw * 0.4 * Math.cos(a2), ty + 18 - sw * 0.4 * Math.sin(a2)); c.lineTo(cx0 + sw * 0.4 * Math.cos(a2), ty + 18 + sw * 0.4 * Math.sin(a2)); c.stroke();
        kit.label(c, 'lens plane', cx0, ty - 9, { color: C.muted, size: 10.5 });
        kit.label(c, V.tilt ? 'tilt ' + (tl * R2D).toFixed(1) + '° (drawn ×' + ex.toFixed(0) + ')' : 'sensor not tilted', cx0, ty + 44, { color: V.tilt ? C.accent : C.warn, size: 10.5 });
        // the curve of depth steps
        const a1 = [], a2s = [];
        for (let zz = 100; zz <= 800; zz += 10) { const d = Sc.triangulation({ z: zz * 1e-3, p: V.p * 1e-6, f: f * 1e-3, b: b * 1e-3 }).dz * 1e6; a1.push([zz, d]); a2s.push([zz, d / 10]); }
        plot.set({ series: [{ pts: a1, color: C.accent, label: 'one pixel' }, { pts: a2s, color: C.warn, dash: true, label: '0.1-pixel centroid' }], vlines: [{ x: z, label: '' }] });
        ro.set('x', xs.toFixed(2) + ' mm  (f b ÷ z)');
        ro.set('px', inside ? 'pixel ' + Math.round((xs - xL) / p) + ' of ' + Math.round(Ls / p) : 'off the sensor');
        ro.set('dz', fmtLen(dzp / 1000) + '  (z² p ÷ f b)');
        ro.set('dz1', fmtLen(dzp / 10000));
        ro.set('ang', (Math.atan(b / z) * R2D).toFixed(1) + '°');
        ro.set('tilt', (tl * R2D).toFixed(1) + '°  (arctan f/b)');
        ro.set('blur', V.tilt ? 'none: the whole beam is in focus' : fmtLen(blurUm / 1000) + '  (f/' + NF + ', focused at ' + ZF + ' mm)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ structured light: fringes to height */
  Hyper.sim('ss-fringes', {
    title: 'Structured light: from fringes to height',
    blurb: `A projector throws sinusoidal fringes at an angle on an object and a camera, looking straight down, records them. The fringes are shifted sideways where the surface is high. **Left**: the camera's image (it cycles through the phase-shifted images, 1 to N). **Middle**: the phase that N images give for every pixel, compared with a flat reference: wrapped between −π and π. **Right**: the height that follows, $h = \\Delta\\varphi P/(2\\pi\\tan\\theta)$, and below it a section through the middle row.

**Try this**
- Raise the **height** of the object until its phase shift passes half a fringe: without unwrapping the height map folds back (the unambiguous range is P/tanθ, in the read-out); with *unwrap* it is restored.
- Choose the **cylinder with a step edge**: the jump at the edge is more than a fringe, and the unwrapping fails along the rows (the section shows it).
- Make the fringes **finer**: the height per hundredth of a fringe shrinks, the range shrinks too, and noise starts to break the unwrapping.
- Raise the **noise**: the heights become rough, and 3 images are worse than 6.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const NX = 96, NY = 64, FW = 40, FH = FW * NY / NX;                 // pixels and field (mm)
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 160 });
      const plot = kit.plot(box.stage, { x: { label: 'position along the middle row (mm)', name: 'x', min: 0, max: FW }, y: { label: 'height (mm)', name: 'h' }, series: [] }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Fringe period on the reference plane', min: 1, max: 8, step: 0.1, value: params.P || 3, unit: 'mm' },
        { id: 'th', label: 'Angle between projector and camera', min: 10, max: 60, step: 1, value: 30, unit: '°' },
        { id: 'H', label: 'Height of the object', min: 0.5, max: 12, step: 0.1, value: params.H || 4, unit: 'mm' },
        { id: 'noise', label: 'Noise, per cent of the fringe contrast', min: 0, max: 20, step: 1, value: 3 },
        { id: 'N', type: 'select', label: 'Images per phase measurement', options: [['3', 3], ['4', 4], ['6', 6]], value: 4 },
        { id: 'shape', type: 'select', label: 'Object', options: [['Smooth bump', 'bump'], ['Cylinder with a step edge', 'cyl']], value: params.shape || 'bump' },
        { id: 'unw', type: 'check', label: 'Unwrap the phase', value: true }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dphi', 'Phase change at the top of the object'], ['range', 'Unambiguous span of heights, P ÷ tanθ'], ['res', 'Height per hundredth of a fringe'], ['err', 'Error of the height map (RMS)']]);
      const wrap = a => a - TAU * Math.round(a / TAU);
      let cache = { key: '' };
      const compute = () => {
        const key = [V.P, V.th, V.H, V.noise, V.N, V.shape, V.unw].join();
        if (cache.key === key) return cache;
        const tn = Math.tan(V.th * D2R), N = V.N, sig = V.noise / 100 * 0.4;
        const hAt = (x, y) => V.shape === 'cyl' ? ((x - 20) ** 2 + (y - FH / 2) ** 2 < 49 ? V.H : 0) : V.H * Math.exp(-(((x - 20) ** 2 + (y - FH / 2) ** 2) / (2 * 36)));
        const imgs = [], hTrue = new Float32Array(NX * NY), dw = new Float32Array(NX * NY), hm = new Float32Array(NX * NY);
        for (let k = 0; k < N; k++) imgs.push(new Float32Array(NX * NY));
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          const n = j * NX + i, x = (i + 0.5) * FW / NX, y = (j + 0.5) * FH / NY, h = hAt(x, y); hTrue[n] = h;
          const po = TAU * (x - h * tn) / V.P, pr = TAU * x / V.P;
          let so = 0, co = 0, sr = 0, cr = 0;
          for (let k = 0; k < N; k++) {
            const d = TAU * k / N, g = (m) => (hash(n * 8 + k + m) + hash(n * 8 + k + m + 0.31) + hash(n * 8 + k + m + 0.62) - 1.5) * 2;
            const io = 0.5 + 0.4 * Math.cos(po + d) + sig * g(0), ir = 0.5 + 0.4 * Math.cos(pr + d) + sig * g(500000);
            imgs[k][n] = io; so += io * Math.sin(d); co += io * Math.cos(d); sr += ir * Math.sin(d); cr += ir * Math.cos(d);
          }
          dw[n] = wrap(Math.atan2(-sr, cr) - Math.atan2(-so, co));
        }
        // unwrap along each row from its left edge, where the surface is flat
        let sq = 0;
        for (let j = 0; j < NY; j++) {
          let u = 0;
          for (let i = 0; i < NX; i++) {
            const n = j * NX + i;
            if (i === 0) u = dw[n]; else u += wrap(dw[n] - dw[n - 1]);
            hm[n] = (V.unw ? u : dw[n]) * V.P / (TAU * tn); sq += (hm[n] - hTrue[n]) ** 2;
          }
        }
        cache = { key, imgs, hTrue, dw, hm, rms: Math.sqrt(sq / (NX * NY)), tn };
        return cache;
      };
      const cmap = t => { t = clamp(t, 0, 1); return [255 * clamp(2.2 * t - 0.6, 0, 1), 255 * Math.pow(Math.sin(PI * t), 0.7), 255 * clamp(1.2 - 1.6 * t, 0, 1)]; };
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, K = compute(), N = V.N, k = Math.floor(t * 1.5) % N;
        const gap = 10, pw = (W - 28 - 2 * gap) / 3, ph = pw * NY / NX, y0 = 26;
        const xs = [14, 14 + pw + gap, 14 + 2 * (pw + gap)];
        S.image(c, xs[0], y0, pw, ph, NX, NY, (u, v) => K.imgs[k][Math.floor(v * NY) * NX + Math.floor(u * NX)], { key: K.key + '|' + k, id: 'cam', smooth: false });
        S.image(c, xs[1], y0, pw, ph, NX, NY, (u, v) => (K.dw[Math.floor(v * NY) * NX + Math.floor(u * NX)] + PI) / TAU, { key: K.key, id: 'dw', smooth: false });
        const hmax = Math.max(1, V.H * 1.1);
        S.image(c, xs[2], y0, pw, ph, NX, NY, (u, v) => cmap(K.hm[Math.floor(v * NY) * NX + Math.floor(u * NX)] / hmax), { key: K.key, id: 'hm', smooth: false });
        for (const x of xs) { c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x, y0, pw, ph); }
        kit.label(c, 'camera, image ' + (k + 1) + ' of ' + N, xs[0], y0 - 10, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'phase, wrapped', xs[1], y0 - 10, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, V.unw ? 'height, unwrapped' : 'height, wrapped', xs[2], y0 - 10, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'field ' + FW + ' × ' + FH.toFixed(0) + ' mm; the middle row is shown below', 14, y0 + ph + 14, { color: C.faint, size: 10.5, align: 'left' });
        // the section through the middle row
        if (!K.plotted || K.plotted !== K.key) {
          K.plotted = K.key;
          const j = NY >> 1, a = [], b = [];
          for (let i = 0; i < NX; i++) { const x = (i + 0.5) * FW / NX; a.push([x, K.hTrue[j * NX + i]]); b.push([x, K.hm[j * NX + i]]); }
          plot.set({ series: [{ pts: a, color: C.muted, label: 'true height' }, { pts: b, color: C.accent, label: V.unw ? 'measured, unwrapped' : 'measured, wrapped' }] });
        }
        const tn = K.tn;
        ro.set('dphi', (V.H * tn / V.P).toFixed(2) + ' fringes  (' + (360 * V.H * tn / V.P).toFixed(0) + '°)');
        ro.set('range', (V.P / tn).toFixed(2) + ' mm (±' + (V.P / tn / 2).toFixed(2) + ')' + (V.H > V.P / tn / 2 ? ': this object folds' : ''));
        ro.set('res', fmtLen(V.P / (100 * tn)));
        ro.set('err', K.rms < 0.005 ? '< 0.01 mm' : K.rms.toFixed(2) + ' mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

  /* ================================================================ a time-of-flight camera */
  Hyper.sim('ss-tof', {
    title: 'A time-of-flight camera: phase, ambiguity and multipath',
    blurb: `Top left: a line of distances from the camera. The shaded bands are the **ambiguity zones**, each c/(2f) long: a target in any zone reads as if it were in the first. Top right: the **phasors**. The direct return is a blue arrow turned by the phase 4πfz/c; with multipath a second, weaker, delayed arrow (orange) is added to it and the camera reads the angle of the sum (white). Bottom: the distance read against the true distance.

**Try this**
- Set the true distance to 8 m at 20 MHz: it is read as 0.5 m (the ambiguity range is 7.5 m). Raise the frequency and the reading wraps sooner.
- Tick the **second frequency**: the reading is correct again, up to 5 times as far. With noise it can fail at the edges of the range.
- Add **multipath**: the reading is pulled towards the longer path, and the curve below is no longer straight. This is why corners look rounded.
- Raise the **phase noise**: the error in metres is c σ ÷ (4πf), smaller at a higher frequency.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sc = O.scan, c0 = O.c;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 250 });
      const plot = kit.plot(box.stage, { x: { label: 'true distance (m)', name: 'z', min: 0, max: 20 }, y: { label: 'distance read (m)', name: 'read', min: 0, max: 22 }, series: [] }, 160);
      const ctl = kit.controls(box.side, [
        { id: 'fm', label: 'Modulation frequency', min: 5, max: 120, value: params.fm || 20, log: true, sig: 3, unit: 'MHz' },
        { id: 'z', label: 'True distance', min: 0.2, max: 20, step: 0.05, value: params.z || 8, unit: 'm' },
        { id: 'mp', label: 'Multipath: relative strength of a longer path', min: 0, max: 60, step: 1, value: 0, unit: '%' },
        { id: 'sn', label: 'Phase noise', min: 0, max: 0.15, step: 0.005, value: 0.02, unit: 'rad' },
        { id: 'dual', type: 'check', label: 'Second frequency (0.8 × f) to unwrap', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['amb', 'Ambiguity range, c ÷ 2f'], ['ph', 'Phase of the return'], ['read', 'Distance read'], ['err', 'Error'], ['sz', 'Depth noise, c σ ÷ 4πf'], ['pair', 'Range with the second frequency']]);
      const EXTRA = 3;                                                       // the longer path of the multipath return adds 3 m of range
      const meas = (zt, f, mp, e) => {
        const k = 4 * PI * f * 1e6 / c0, a = k * zt, b = k * (zt + EXTRA);
        let ph = Math.atan2(Math.sin(a) + mp * Math.sin(b), Math.cos(a) + mp * Math.cos(b)) + e; ph = ((ph % TAU) + TAU) % TAU;
        return ph / k;
      };
      const read = (zt, f, mp, sn, dual) => {
        const z1 = meas(zt, f, mp, sn), am1 = c0 / (2 * f * 1e6);
        if (!dual) return z1;
        const f2 = 0.8 * f, z2 = meas(zt, f2, mp, -sn), am2 = c0 / (2 * f2 * 1e6);
        let best = z1, bd = Infinity;
        for (let k = 0; k < 6; k++) { const a = z1 + k * am1, l = Math.max(0, Math.round((a - z2) / am2)), d = Math.abs(a - (z2 + l * am2)); if (d < bd) { bd = d; best = a; } }
        return best;
      };
      let key = '';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, f = V.fm, mp = V.mp / 100;
        const am = Sc.phaseRange(f * 1e6), zr = read(V.z, f, mp, V.sn, V.dual);
        // the line of distances
        const x0 = 22, x1 = 0.6 * W - 10, ya = 0.5 * Hh, X = z => x0 + (x1 - x0) * z / 20;
        for (let k = 0; k * am < 20; k++) { c.fillStyle = k % 2 ? 'rgba(123,140,255,0.16)' : 'rgba(123,140,255,0.06)'; c.fillRect(X(k * am), ya - 0.22 * Hh, X(Math.min(20, (k + 1) * am)) - X(k * am), 0.44 * Hh); }
        c.strokeStyle = C.axis; c.lineWidth = 1.3; c.beginPath(); c.moveTo(x0, ya); c.lineTo(x1, ya); c.stroke();
        for (let z = 0; z <= 20; z += 4) { c.beginPath(); c.moveTo(X(z), ya - 4); c.lineTo(X(z), ya + 4); c.stroke(); kit.label(c, z + (z === 20 ? ' m' : ''), X(z), ya + 16, { color: C.faint, size: 10.5 }); }
        c.fillStyle = C.text; c.fillRect(x0 - 12, ya - 10, 12, 20);
        kit.label(c, 'camera', x0 - 4, ya - 20, { color: C.muted, size: 11, align: 'left' });
        c.strokeStyle = 'rgb(255,70,70)'; c.lineWidth = 3; c.beginPath(); c.moveTo(X(V.z), ya - 0.2 * Hh); c.lineTo(X(V.z), ya); c.stroke();
        kit.label(c, 'target ' + V.z.toFixed(2) + ' m', clamp(X(V.z), x0 + 36, x1 - 36), ya - 0.2 * Hh - 9, { color: 'rgb(255,110,110)', size: 11 });
        const okc = Math.abs(zr - V.z) < 0.25 * Math.max(0.3, am) * 0.2 + 0.05 * Math.max(1, V.z);
        c.strokeStyle = okc ? C.ok : C.warn; c.lineWidth = 3; c.beginPath(); c.moveTo(X(Math.min(20, zr)), ya); c.lineTo(X(Math.min(20, zr)), ya + 0.2 * Hh); c.stroke();
        kit.label(c, 'read ' + zr.toFixed(2) + ' m', clamp(X(Math.min(20, zr)), x0 + 36, x1 - 36), ya + 0.2 * Hh + 12, { color: okc ? C.ok : C.warn, size: 11 });
        kit.label(c, 'bands: ambiguity zones of ' + am.toFixed(2) + ' m', x0, 12, { color: C.faint, size: 10.5, align: 'left' });
        // the phasors at the first frequency
        const cx = 0.8 * W, cy = 0.5 * Hh, R = Math.min(0.17 * W, 0.34 * Hh), k = 4 * PI * f * 1e6 / c0, a = k * V.z, b = k * (V.z + EXTRA);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.moveTo(cx - R - 6, cy); c.lineTo(cx + R + 6, cy); c.moveTo(cx, cy - R - 6); c.lineTo(cx, cy + R + 6); c.stroke();
        const ax = cx + R * Math.cos(a), ay = cy - R * Math.sin(a), bx = ax + R * mp * Math.cos(b), by = ay - R * mp * Math.sin(b);
        kit.arrow(c, cx, cy, ax, ay, 'rgb(90,150,255)', 2.4, 8);
        if (mp > 0.005) { kit.arrow(c, ax, ay, bx, by, 'rgb(255,170,60)', 2.2, 7); kit.arrow(c, cx, cy, bx, by, C.text, 2.4, 8); }
        c.strokeStyle = okc ? C.ok : C.warn; c.lineWidth = 1.5; c.setLineDash([4, 3]); const pm = Math.atan2(mp * Math.sin(b) + Math.sin(a), mp * Math.cos(b) + Math.cos(a)); c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + (R + 14) * Math.cos(pm), cy - (R + 14) * Math.sin(pm)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'phasors at ' + f.toFixed(0) + ' MHz', cx, cy - R - 16, { color: C.muted, size: 11 });
        // the curve of readings
        const kk = [f, V.mp, V.sn, V.dual].join();
        if (kk !== key) {
          key = kk;
          const pts = [], ideal = [];
          for (let z = 0.2; z <= 20.001; z += 0.1) { pts.push([z, read(z, f, mp, V.sn, V.dual)]); ideal.push([z, z]); }
          plot.set({ series: [{ pts, color: C.accent, label: V.dual ? 'read (two frequencies)' : 'read (one frequency)', dots: true, line: false }, { pts: ideal, color: C.muted, dash: true, label: 'true distance' }] });
        }
        ro.set('amb', am.toFixed(2) + ' m');
        ro.set('ph', ((((a % TAU) + TAU) % TAU) * R2D).toFixed(0) + '° for the direct return');
        ro.set('read', zr.toFixed(2) + ' m');
        ro.set('err', (zr - V.z >= 0 ? '+' : '') + (zr - V.z).toFixed(2) + ' m');
        ro.set('sz', (c0 * V.sn / (4 * PI * f * 1e6) * 1e3).toFixed(1) + ' mm');
        ro.set('pair', V.dual ? Sc.phaseRange(0.2 * f * 1e6).toFixed(1) + ' m  (f and 0.8 f)' : 'one frequency: ' + am.toFixed(2) + ' m');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ TDI */
  Hyper.sim('ss-tdi', {
    title: 'TDI: adding the light of many lines',
    blurb: `**Top**: the stages of a TDI sensor. The image of a faint speck (the hollow circle) moves from stage to stage, and the charge it has made (the filled bar) moves with it and grows with every stage, until it is read out at the end. **Bottom**: the same scene seen by an ordinary line camera and by the TDI camera. The scene has a fine bar strip across the top and two faint specks, of 10 % and 25 % contrast. Both pictures show the same exposure per line.

**Try this**
- Lower the **light** to 10 photons: the single line is a hash and shows nothing, the TDI picture still shows the specks. Read the contrast-to-noise figures.
- Choose **256 stages**: the picture is cleaner by √256 = 16, but any speed mismatch now smears over twice as many pixels.
- Raise the **speed mismatch**: the bars of the strip blur along the web. At 1 % and 128 stages the smear is 1.3 pixels, enough to blur bars three pixels wide.
- With a mismatch of 0 the TDI picture is as sharp as the line picture and many times cleaner.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 350 });
      const ctl = kit.controls(box.side, [
        { id: 'M', type: 'select', label: 'TDI stages', options: [['16', 16], ['32', 32], ['64', 64], ['128', 128], ['256', 256]], value: params.M || 64 },
        { id: 'ph', label: 'Light: photons per pixel per line (white)', min: 5, max: 300, value: 40, log: true, sig: 2 },
        { id: 'er', label: 'Speed mismatch', min: 0, max: 3, step: 0.05, value: 0.3, unit: '%' }
      ], () => {});
      const V = ctl.values;
      const READ = 4;                                                         // read noise, electrons
      const ro = kit.readout(box.side, [['gain', 'Signal gain'], ['s1', 'Signal-to-noise of a white pixel, one line'], ['sM', 'Signal-to-noise with TDI'], ['cnr', 'Contrast ÷ noise of the 10 % speck: one line · TDI'], ['smear', 'Smear at the last stage']]);
      const NX = 120, NY = 60;
      const scene = (u, v) => {
        if (v < 0.2) return ((u * 16) % 1) < 0.4 ? 0.3 : 0.75;
        const d1 = Math.hypot(u - 0.35, (v - 0.55) * 0.5), d2 = Math.hypot(u - 0.7, (v - 0.4) * 0.5);
        return d1 < 0.05 ? 0.675 : d2 < 0.04 ? 0.5625 : 0.75;
      };
      const gauss = n => (hash(n) + hash(n + 0.31) + hash(n + 0.62) - 1.5) * 2;
      let step = 0, acc = 0;
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = V.M, ns = Math.min(M, 24), smear = M * V.er / 100;
        // ---- the stages
        const x0 = 20, x1 = W - 20, bw = (x1 - x0) / ns, y0 = 0.14 * Hh, bh = 0.13 * Hh;
        acc += dt * 5; if (acc >= 1) { step = (step + Math.floor(acc)) % (ns + 3); acc -= Math.floor(acc); }
        for (let k = 0; k < ns; k++) { c.fillStyle = C.surface; c.strokeStyle = C.axis; c.lineWidth = 1; c.fillRect(x0 + k * bw + 1, y0, bw - 2, bh); c.strokeRect(x0 + k * bw + 1, y0, bw - 2, bh); }
        if (step < ns) {
          const cxk = x0 + (step + 0.5) * bw, frac = (step + 1) / ns;
          c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.arc(cxk, y0 - 12, 5, 0, TAU); c.stroke();
          c.fillStyle = 'rgba(123,140,255,0.9)'; c.fillRect(x0 + step * bw + 3, y0 + bh * (1 - frac), bw - 6, bh * frac);
          for (let k = 0; k < step; k++) { c.fillStyle = 'rgba(123,140,255,0.22)'; c.fillRect(x0 + k * bw + 3, y0 + bh * (1 - (k + 1) / ns), bw - 6, bh * (k + 1) / ns); }
        } else { c.fillStyle = 'rgba(34,179,122,0.8)'; c.fillRect(x1 - 6, y0 - 8, 6, bh + 16); }
        kit.label(c, 'a speck and its charge move one stage a line', x0, y0 - 28, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'stage 1', x0 + bw / 2, y0 + bh + 11, { color: C.faint, size: 10 });
        kit.label(c, M > ns ? 'stage ' + M + ' (' + ns + ' of ' + M + ' drawn)' : 'stage ' + M, x1 - 2, y0 + bh + 11, { color: C.faint, size: 10, align: 'right' });
        kit.label(c, 'read out →', x1 - 2, y0 + bh + 25, { color: C.ok, size: 10.5, align: 'right' });
        // ---- the two pictures
        const gap = 14, pw = (W - 28 - gap) / 2, ph = pw * NY / NX, yi = 0.42 * Hh, xa = 14, xb = 14 + pw + gap;
        const pic = (id, Mx, sm) => (u, v) => {
          const i = Math.floor(u * NX), j = Math.floor(v * NY); let s = 0, n = 0;
          const m = Math.max(1, Math.ceil(sm) * 2);
          for (let q = 0; q < m; q++) { s += scene(u - (sm * q / m) / NX, v); n++; }
          const mean = s / n, sig = mean * V.ph * Mx, sd = Math.sqrt(sig + READ * READ), val = sig + sd * gauss(i + j * NX + (id === 'a' ? 0 : 777777));
          return val / (0.85 * V.ph * Mx);
        };
        S.image(c, xa, yi, pw, ph, NX, NY, pic('a', 1, 0), { key: [V.ph].join(), id: 'one', smooth: false });
        S.image(c, xb, yi, pw, ph, NX, NY, pic('b', M, smear), { key: [V.ph, M, V.er].join(), id: 'tdi', smooth: false });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(xa, yi, pw, ph); c.strokeRect(xb, yi, pw, ph);
        kit.label(c, 'one line, no TDI', xa, yi - 10, { color: C.muted, size: 11.5, align: 'left' });
        kit.label(c, 'TDI, ' + M + ' stages', xb, yi - 10, { color: C.muted, size: 11.5, align: 'left' });
        kit.label(c, 'bars on top, specks of 10 % and 25 % contrast; web moves →', 14, yi + ph + 14, { color: C.faint, size: 10.5, align: 'left' });
        const a = O.cam.snr({ photons: 0.85 * V.ph, read: READ }), b = O.cam.snr({ photons: 0.85 * V.ph * M, read: READ });
        ro.set('gain', '× ' + M + '  (noise only × ' + Math.sqrt(M).toFixed(1) + ' when shot noise rules)');
        ro.set('s1', a.snr.toFixed(1));
        ro.set('sM', b.snr.toFixed(1) + '  (× ' + (b.snr / a.snr).toFixed(1) + ')');
        ro.set('cnr', (0.1 * a.snr).toFixed(1) + ' · ' + (0.1 * b.snr).toFixed(1) + '   (a speck shows above about 4)');
        ro.set('smear', smear.toFixed(2) + ' pixels  (M × mismatch)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

  /* ================================================================ optical coherence tomography */
  Hyper.sim('ss-oct', {
    title: 'OCT: bandwidth, resolution and a cross-section',
    blurb: `A sample with a surface, a **thin layer** under it (two interfaces a few micrometres apart) and a deeper layer is scanned by a beam moving sideways; the **B-scan** at the top is built column by column. Below are the **A-scan** at the red line (the true reflectors, dots, and what the instrument shows) and the **interferogram** of the top two reflectors as the reference mirror moves: fringes inside an envelope as wide as the coherence gate.

**Try this**
- Narrow the **bandwidth** to 10 nm: the resolution is coarse (about 22 µm in tissue) and the thin layer merges with the surface in one blob. Widen it to 150 nm and they separate.
- Make the **thin layer** thinner than the axial resolution (read-out): the two peaks of the A-scan become one.
- Change the **centre wavelength** at the same bandwidth: a longer wavelength gives a coarser resolution (λ²/Δλ).
- Look at the interferogram: the fringes are λ/2n apart, a few tenths of a micrometre; the envelope is the resolution.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const NT = 1.38, ZD = 220, NX = 120, NY = 90;                           // tissue index, depth shown (µm), pixels of the B-scan
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 170 });
      const pa = kit.plot(box.stage, { x: { label: 'depth in the sample (µm)', name: 'z', min: 0, max: ZD }, y: { label: 'A-scan signal', name: 'A', min: 0, max: 1.2 }, series: [] }, 140);
      const pi_ = kit.plot(box.stage, { x: { label: 'reference mirror position (µm)', name: 'z' }, y: { label: 'fringe signal', name: 'I', min: -1.1, max: 1.1 }, series: [] }, 120);
      const ctl = kit.controls(box.side, [
        { id: 'nm', type: 'select', label: 'Centre wavelength', options: [['840 nm', 840], ['1050 nm', 1050], ['1300 nm', 1300]], value: params.nm || 840 },
        { id: 'dl', label: 'Bandwidth of the source', min: 10, max: 150, step: 1, value: params.dl || 50, unit: 'nm' },
        { id: 'd', label: 'Thickness of the thin layer', min: 2, max: 60, step: 1, value: params.d || 14, unit: 'µm' }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lc', 'Coherence length, λ² ÷ Δλ'], ['air', 'Axial resolution in air, 0.44 λ² ÷ Δλ'], ['tis', 'Axial resolution in tissue (n = 1.38)'], ['thin', 'Thin layer against the resolution'], ['col', 'Column scanned']]);
      const R = [1, 0.7, 0.85];
      const Zs = x => { const z0 = 40 + 10 * Math.sin(TAU * 1.2 * x); return [z0, z0 + V.d, 150 + 14 * Math.cos(TAU * (0.9 * x + 0.2))]; };
      const gk = (z, res) => Math.exp(-4 * Math.LN2 * (z / res) * (z / res));
      const resT = () => 0.44 * V.nm * V.nm / (NT * V.dl) * 1e-3;            // µm
      let lastP = -1, col = 0;
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, res = resT();
        col = Math.floor((t * 16) % NX);
        const key = [V.nm, V.dl, V.d].join();
        const f = (u, v) => { const Z = Zs(u), z = v * ZD; let a = 0; for (let i = 0; i < 3; i++) a += R[i] * gk(z - Z[i], res); return Math.pow(clamp(a, 0, 1), 0.7); };
        const x0 = 14, w = W - 28, h = st.H - 34, y0 = 22;
        c.save(); c.beginPath(); c.rect(x0, y0, w * (col + 1) / NX, h); c.clip();
        S.image(c, x0, y0, w, h, NX, NY, f, { key, id: 'bscan', smooth: true, rgb: [255, 255, 255] });
        c.restore();
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, y0, w, h);
        c.strokeStyle = 'rgba(255,70,70,0.9)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0 + w * (col + 0.5) / NX, y0); c.lineTo(x0 + w * (col + 0.5) / NX, y0 + h); c.stroke();
        kit.label(c, 'B-scan: ' + ZD + ' µm deep, the beam moves sideways', x0, y0 - 9, { color: C.muted, size: 11, align: 'left' });
        // the two plots follow the scanned column
        const P = Math.floor(col / 3);
        if (P !== lastP || key !== pa._k) {
          lastP = P; pa._k = key;
          const x = (col + 0.5) / NX, Z = Zs(x), ser = [], dots = [];
          for (let i = 0; i <= 220; i++) { const z = ZD * i / 220; let a = 0; for (let q = 0; q < 3; q++) a += R[q] * gk(z - Z[q], res); ser.push([z, a]); }
          for (let q = 0; q < 3; q++) dots.push([Z[q], R[q]]);
          pa.set({ series: [{ pts: ser, color: C.accent, label: 'what the instrument shows', fill: true }, { pts: dots, color: C.warn, label: 'true reflectors', dots: true, line: false }] });
          const lam = V.nm * 1e-3, car = lam / (2 * NT), z0 = Z[0] - 10, z1 = Z[1] + 10, n = clamp(Math.round((z1 - z0) / car * 7), 200, 2400), iv = [];
          for (let i = 0; i <= n; i++) { const z = z0 + (z1 - z0) * i / n; let s = 0; for (let q = 0; q < 2; q++) s += R[q] * gk(z - Z[q], res) * Math.cos(TAU * (z - Z[q]) / car); iv.push([z, clamp(s / 1.5, -1.05, 1.05)]); }
          pi_.set({ series: [{ pts: iv, color: C.ok, label: 'two reflectors, ' + V.d + ' µm apart' }] });
          ro.set('col', (col + 1) + ' of ' + NX);
        }
        const lc = O.diff.coherenceLength(V.nm, V.dl) * 1e6;
        ro.set('lc', lc.toFixed(1) + ' µm');
        ro.set('air', (res * NT).toFixed(1) + ' µm');
        ro.set('tis', res.toFixed(1) + ' µm');
        ro.set('thin', V.d + ' µm: ' + (V.d >= res ? 'resolved (≥ the resolution)' : 'not resolved (less than the resolution)'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

  /* ================================================================ an optical disc pickup */
  Hyper.sim('ss-pickup', {
    title: 'A disc pickup: the spot against the pits',
    blurb: `The spot (a ring at its half-maximum width) crosses the pits of a CD, a DVD or a Blu-ray disc, all drawn at **one scale**, five tracks wide, with pits and spacing as the standards give them (pit widths are approximate). Underneath is the light reflected back, from a simple ideal model (real drives see less modulation): a pit, a quarter-wave deep, turns the light that comes back from it by half a wave, so pit and land cancel where the spot covers both.

**Try this**
- Switch between **CD**, **DVD** and **Blu-ray** and watch the spot shrink against the same disc area: the pits, the pitch and the dips follow.
- Add **focus error**: the spot widens, the dips become shallower and then merge with those of the neighbouring tracks. The focus servo has to hold it within the depth of focus.
- Add **tracking error**: the spot slips towards the neighbouring track; the signal now carries the pits of both tracks (crosstalk).
- Read the **shortest pit against the spot**: the pits are shorter than the spot, and yet the dips appear.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const DISC = { CD: { nm: 780, NA: 0.45, pitch: 1.6, pit: 0.83, T: 0.2767, nmin: 3, w: 0.5, sub: 1.2, cap: '650–700 MB' }, DVD: { nm: 650, NA: 0.6, pitch: 0.74, pit: 0.4, T: 0.1333, nmin: 3, w: 0.32, sub: 0.6, cap: '4.7 GB' }, BD: { nm: 405, NA: 0.85, pitch: 0.32, pit: 0.149, T: 0.0745, nmin: 2, w: 0.13, sub: 0.1, cap: '25 GB' } };
      const LW = 14;                                                            // length of the window along the track, µm
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'disc', type: 'select', label: 'Disc', options: [['CD (780 nm, NA 0.45)', 'CD'], ['DVD (650 nm, NA 0.60)', 'DVD'], ['Blu-ray (405 nm, NA 0.85)', 'BD']], value: params.disc || 'CD' },
        { id: 'fz', label: 'Focus error', min: -3, max: 3, step: 0.05, value: 0, unit: 'µm' },
        { id: 'tr', label: 'Tracking error, per cent of the track pitch', min: -50, max: 50, step: 1, value: 0, unit: '%' }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['spot', 'Spot width at half maximum, in focus'], ['now', 'Spot width now (focus error included)'], ['pitch', 'Track pitch ÷ spot width'], ['pit', 'Shortest pit ÷ spot width'], ['depth', 'Pit depth, λ ÷ 4n'], ['dof', 'Depth of focus, ±λ ÷ 2NA²'], ['mod', 'Modulation of the signal']]);
      const pits = {};
      const build = id => {
        if (pits[id]) return pits[id];
        const D = DISC[id], out = [];
        for (let tk = -2; tk <= 2; tk++) {
          const list = []; let x = -2 - hash(tk * 7.1 + id.length) * 2, k = 0, isPit = hash(tk * 3.3) < 0.5;
          while (x < LW + 2) { const len = (D.nmin + Math.floor(hash(tk * 100 + k * 1.7 + id.length * 13) * (12 - D.nmin))) * D.T; if (isPit) list.push([x, x + len]); x += len; isPit = !isPit; k++; }
          out.push(list);
        }
        return (pits[id] = out);
      };
      let cache = { key: '' };
      const sig = () => {
        const D = DISC[V.disc], key = [V.disc, V.fz, V.tr].join();
        if (cache.key === key) return cache;
        const d0 = 0.51 * D.nm * 1e-3 / D.NA, blur = 2 * D.NA * Math.abs(V.fz), d = Math.hypot(d0, blur), sE = Math.SQRT2 * d / (2 * Math.sqrt(2 * Math.LN2)), r2 = Math.SQRT2 * sE;
        const P = build(V.disc), ys = V.tr / 100 * D.pitch, M = 280, out = [];
        const Fy = tk => 0.5 * (erf((tk * D.pitch + D.w / 2 - ys) / r2) - erf((tk * D.pitch - D.w / 2 - ys) / r2));
        const fys = [-2, -1, 0, 1, 2].map(Fy);
        let mn = 1, mx = 0, mn0 = 1, mx0 = 0;
        for (let i = 0; i <= M; i++) {
          const xs = LW * i / M; let f = 0, f0 = 0;
          for (let q = 0; q < 5; q++) for (const [a, b] of P[q]) { if (b < xs - 4 * sE || a > xs + 4 * sE) continue; const fx = 0.5 * (erf((b - xs) / r2) - erf((a - xs) / r2)); f += fx * fys[q]; if (q === 2) f0 += fx * fys[q]; }
          const I = Math.pow(1 - 2 * f, 2); out.push(I); if (xs > 2 && xs < LW - 2) { mn = Math.min(mn, I); mx = Math.max(mx, I); }
        }
        cache = { key, sig: out, d, d0, mod: mx > 0 ? (mx - mn) / mx : 0 };
        return cache;
      };
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, D = DISC[V.disc], K = sig(), P = build(V.disc);
        const x0 = 14, sc = (W - 28) / LW, yc = 0.27 * Hh, ph = 0.42 * Hh;
        c.fillStyle = C.dark ? '#0b0e1c' : '#dfe3f0'; c.fillRect(x0, 22, W - 28, ph); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, 22, W - 28, ph);
        c.save(); c.beginPath(); c.rect(x0, 22, W - 28, ph); c.clip();
        for (let q = -2; q <= 2; q++) {
          const y = 22 + ph / 2 + q * D.pitch * sc;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + W - 28, y); c.stroke();
          c.fillStyle = q === 0 ? (C.dark ? '#f2c14e' : '#b07a00') : (C.dark ? '#7e8399' : '#8a90a6');
          for (const [a, b] of P[q + 2]) c.fillRect(x0 + a * sc, y - D.w * sc / 2, Math.max(1, (b - a) * sc), Math.max(1.2, D.w * sc));
        }
        const sweep = (t * 0.14) % 1, xs = sweep * LW, ys = 22 + ph / 2 + V.tr / 100 * D.pitch * sc;
        c.fillStyle = 'rgba(80,255,120,0.22)'; c.beginPath(); c.arc(x0 + xs * sc, ys, Math.max(1.5, K.d * sc / 2), 0, TAU); c.fill();
        c.strokeStyle = 'rgb(80,255,120)'; c.lineWidth = 1.6; c.beginPath(); c.arc(x0 + xs * sc, ys, Math.max(1.5, K.d * sc / 2), 0, TAU); c.stroke();
        c.restore();
        kit.label(c, V.disc + ': five tracks, ' + LW + ' µm along the track, one scale for all discs', x0, 12, { color: C.muted, size: 11, align: 'left' });
        // the reflected light
        const sy0 = 22 + ph + 40, sy1 = Hh - 22;
        c.fillStyle = C.surface; c.fillRect(x0, sy0, W - 28, sy1 - sy0);
        const M = K.sig.length - 1, upto = Math.floor(sweep * M);
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= upto; i++) { const px = x0 + (W - 28) * i / M, py = sy1 - (sy1 - sy0) * clamp(K.sig[i], 0, 1.05) / 1.05; i ? c.lineTo(px, py) : c.moveTo(px, py); }
        c.stroke();
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(x0 + xs * sc, sy0); c.lineTo(x0 + xs * sc, sy1); c.stroke();
        kit.label(c, 'reflected light (relative): it dips as the spot crosses pits', x0, sy0 - 9, { color: C.muted, size: 11, align: 'left' });
        const dof = D.nm * 1e-3 / (2 * D.NA * D.NA);
        ro.set('spot', (K.d0 * 1000).toFixed(0) + ' nm  (0.51 λ ÷ NA)');
        ro.set('now', (K.d * 1000).toFixed(0) + ' nm' + (V.fz !== 0 ? '  (focus error ' + V.fz.toFixed(2) + ' µm; depth of focus ±' + dof.toFixed(2) + ' µm)' : ''));
        ro.set('pitch', (D.pitch / K.d).toFixed(2));
        ro.set('pit', (D.pit / K.d).toFixed(2) + '  (' + D.pit + ' µm)');
        ro.set('depth', (D.nm / (4 * O.index('PC', D.nm))).toFixed(0) + ' nm in polycarbonate');
        ro.set('dof', '±' + dof.toFixed(2) + ' µm');
        ro.set('mod', (100 * K.mod).toFixed(0) + ' % of the top level');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

})();
