/* HYPER-OPTICS · sims/image-sensors.js — simulations of the topic "Image sensors".
 *   is-pixel          one pixel: photons arriving, electrons collected in the well, voltage, digital number
 *   is-ccd            a CCD (full-frame, frame-transfer, interline): exposure, transfer, read-out, blooming, smear, CTE
 *   is-cmos           a CMOS array: row select, column converters, random access, frame time
 *   is-shutter        rolling and global shutter: a moving bar or a fan, the exposure timeline, flash banding
 *   is-qe             quantum efficiency of silicon: thickness, dead layer, back illumination, filters, responsivity
 *   is-noise          shot, read and dark noise: a noisy picture and the SNR curve
 *   is-dynamic-range  full well, read noise, bits and HDR: what the sensor records of a 20-stop scene
 *   is-formats        sensor formats drawn to scale, pixel pitch against the Airy disc
 *   is-bayer          a colour filter array: the mosaic, demosaicing, false colour, the low-pass filter
 *   is-microlens      a pixel in section: microlens, chief-ray angle, front and back illumination
 *   is-binning        binning and area of interest: signal, noise, frame rate and data rate
 *   is-infrared       detectors by waveband and a thermal scene: Planck emission against the response of each detector
 * The numbers come from kit.optics (photon energy, photon counts, signal-to-noise, dynamic range, sensor formats,
 * the Planck function, the MTF and Airy functions); the drawing comes from kit.osym. Physics the engine does not
 * hold (the absorption coefficient of silicon, the charge-transfer bookkeeping of a CCD, a demosaicing filter) is
 * written here and marked.
 */
(function () {
  'use strict';
  const TAU = 2 * Math.PI;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const mix = (a, b, t) => a + (b - a) * t;

  // ---- absorption coefficient of silicon at 300 K (cm^-1), after Green and Keevers 1995, rounded; log-interpolated
  const ALPHA = [[300, 1.7e6], [350, 1.04e6], [400, 9.5e4], [450, 2.55e4], [500, 1.1e4], [550, 7e3], [600, 4.1e3], [650, 2.8e3], [700, 1.9e3], [750, 1.3e3], [800, 850], [850, 540], [900, 310], [950, 160], [1000, 64], [1050, 16], [1100, 3.5], [1150, 0.5], [1200, 0.1]];
  function alphaSi(nm) {
    if (nm <= ALPHA[0][0]) return ALPHA[0][1];
    for (let i = 1; i < ALPHA.length; i++) {
      if (nm <= ALPHA[i][0]) { const a = ALPHA[i - 1], b = ALPHA[i], t = (nm - a[0]) / (b[0] - a[0]); return Math.exp(Math.log(a[1]) * (1 - t) + Math.log(b[1]) * t); }
    }
    return 0.05;
  }
  // quantum efficiency of a photodiode of thickness W (µm) under a dead layer d0 (µm), surface loss Rs
  const qeSi = (nm, d0, W, Rs) => { const a = alphaSi(nm) * 1e-4; return Math.max(0, (1 - Rs) * (Math.exp(-a * d0) - Math.exp(-a * (d0 + W)))); };
  // a seeded random stream (mulberry32) so that "noise" pictures stay put while a slider moves
  function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function gauss(r) { let u = 0; while (u < 1e-12) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * r()); }
  function poisson(lam, r) {
    if (!(lam > 0)) return 0;
    if (lam > 30) return Math.max(0, Math.round(lam + Math.sqrt(lam) * gauss(r)));
    const L = Math.exp(-lam); let k = 0, p = 1;
    do { k++; p *= r(); } while (p > L && k < 200);
    return k - 1;
  }
  const grey = v => { const g = Math.round(255 * clamp(v, 0, 1)); return 'rgb(' + g + ',' + g + ',' + g + ')'; };
  const fmtInt = v => Math.round(v).toLocaleString('en-US').replace(/,/g, ' ');

  /* ================================================================ one pixel */
  Hyper.sim('is-pixel', {
    title: 'One pixel: photon, electron, voltage, number',
    blurb: `A pixel in section. Photons fall from above; each is absorbed at a random depth (deeper for longer wavelengths). A photon absorbed inside the photodiode frees an electron that is collected in the well at the bottom; one absorbed too high, too deep, or not at all, is lost. On the right the well's charge becomes a voltage on the sense node and a number in the ADC. The dots drawn are a small sample of the real flux; the numbers count them all.

**Try this**
- Slide the wavelength from 400 nm to 1000 nm. Blue photons stop near the surface, red ones go deeper, near-infrared photons mostly pass through the 4 µm photodiode: the efficiency falls.
- Go beyond 1110 nm: the photon energy drops below the 1.12 eV band gap and nothing is detected at all.
- Make the photodiode thicker (10 µm): the near-infrared efficiency rises.
- Raise the light level until the well fills to its full-well capacity, and watch the ADC number stop at its maximum. Then change the sense-node capacitance: a smaller one gives more volts per electron.

The picture is schematic in scale (a real well is not one micrometre deep); the absorption depths are those of silicon at room temperature.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 340 });
      const D0 = 0.4, RS = 0.08, ZMAX = 10, GAP = 1239.84 / 1.12;
      const ctl = kit.controls(box.side, [
        { id: 'nm', label: 'Wavelength', min: 300, max: 1300, step: 10, value: params.nm || 550, unit: 'nm' },
        { id: 'flux', label: 'Photons arriving per second', min: 100, max: 1e6, log: true, sig: 2, value: params.flux || 3000 },
        { id: 'W', label: 'Thickness of the photodiode', min: 1, max: 10, step: 0.5, value: 4, unit: 'µm' },
        { id: 'FW', label: 'Full-well capacity', min: 1000, max: 100000, log: true, sig: 2, value: 10000, unit: 'e⁻' },
        { id: 'C', label: 'Capacitance of the sense node', min: 0.5, max: 5, step: 0.1, value: 1.6, unit: 'fF' },
        { id: 'bits', label: 'Bits of the ADC', min: 8, max: 14, step: 1, value: 12 },
        { type: 'buttons', items: [{ id: 'reset', label: 'Empty the well and start a new exposure', primary: true }] }
      ], id => { if (id === 'reset') reset(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['E', 'Energy of one photon'], ['eta', 'Chance a photon is collected'], ['N', 'Electrons in the well'], ['fill', 'Well filled'], ['v', 'Voltage on the sense node'], ['dn', 'Digital number'], ['k', 'Electrons per digital number']]);
      let N = 0, T = 0, spawn = 0, dots = [];
      const reset = () => { N = 0; T = 0; dots = []; spawn = 0; };
      const R = Math.random;
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const eta = V.nm > GAP ? 0 : qeSi(V.nm, D0, V.W, RS);
        T += dt;
        N = Math.min(V.FW, N + poisson(V.flux * eta * dt, R));
        // the geometry: depth z (µm) from −3 (air) to ZMAX, mapped to y
        const top = Hh * 0.07, ky = Hh * 0.84 / (ZMAX + 3), Y = z => top + (z + 3) * ky;
        const gx = 20, gw = Math.min(W * 0.44, 300), nmShow = Math.min(V.nm, 760);
        const lz = 1e4 / alphaSi(V.nm);                                  // absorption depth, µm
        // sample photons
        spawn += dt * Math.min(V.flux, 10);
        while (spawn >= 1) {
          spawn -= 1;
          const z = -lz * Math.log(1 - R() * 0.999999);
          let fate = 'through';
          if (V.nm <= GAP) {
            if (R() < RS) fate = 'reflect';
            else if (z > ZMAX) fate = 'through';
            else if (z < D0) fate = 'dead';
            else if (z < D0 + V.W) fate = 'got';
            else fate = 'deep';
          }
          dots.push({ x: gx + 12 + R() * (gw - 24), z: -3, to: fate === 'through' ? ZMAX + 3 : fate === 'reflect' ? 0 : z, fate, state: 0, a: 1 });
        }
        for (const d of dots) {
          if (d.state === 0) { d.z += 7 * dt; if (d.z >= d.to) { d.z = d.to; d.state = d.fate === 'reflect' ? 3 : d.fate === 'through' ? 4 : d.fate === 'got' ? 1 : 2; } }
          else if (d.state === 1) { d.z += 3 * dt; if (d.z >= D0 + V.W - 0.35) d.a -= 4 * dt; }
          else if (d.state === 2) d.a -= 1.6 * dt;
          else if (d.state === 3) { d.z -= 7 * dt; if (d.z < -2.8) d.a = 0; }
          else d.a -= 0.3 * dt;
        }
        dots = dots.filter(d => d.a > 0 && dots.length < 80);
        // ---- the section of the pixel
        c.fillStyle = C.surface; c.fillRect(gx, Y(0), gw, ZMAX * ky);
        c.fillStyle = C.dark ? 'rgba(120,130,170,0.35)' : 'rgba(120,130,170,0.30)'; c.fillRect(gx, Y(0), gw, D0 * ky);
        c.fillStyle = C.accent; c.globalAlpha = 0.16; c.fillRect(gx + gw * 0.12, Y(D0), gw * 0.76, V.W * ky); c.globalAlpha = 1;
        c.strokeStyle = C.accent; c.lineWidth = 1.2; c.setLineDash([4, 3]); c.strokeRect(gx + gw * 0.12, Y(D0), gw * 0.76, V.W * ky); c.setLineDash([]);
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(gx, Y(0), gw, ZMAX * ky);
        // the well: a bucket at the bottom of the photodiode
        const wx = gx + gw * 0.30, ww = gw * 0.40, wh = Math.min(2.2, V.W * 0.6) * ky, wy = Y(D0 + V.W) - wh;
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(wx, wy); c.lineTo(wx, wy + wh); c.lineTo(wx + ww, wy + wh); c.lineTo(wx + ww, wy); c.stroke();
        const lev = clamp(N / V.FW, 0, 1);
        c.fillStyle = lev >= 0.999 ? C.bad : C.accent; c.fillRect(wx + 1.5, wy + wh - (wh - 2) * lev, ww - 3, (wh - 2) * lev);
        kit.label(c, 'well', wx + ww / 2, wy + wh + 11, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'silicon', gx + gw - 6, Y(ZMAX) - 8, { align: 'right', color: C.faint, size: 11 });
        kit.label(c, 'dead layer', gx + gw + 6, Y(D0 / 2), { color: C.faint, size: 11 });
        kit.label(c, 'photodiode: ' + V.W + ' µm', gx + gw + 6, Y(D0 + V.W / 2), { color: C.accent, size: 11 });
        S.dim(c, gx - 8, Y(0), gx - 8, Y(ZMAX), '', {});
        for (let z = 0; z <= ZMAX; z += 2) kit.label(c, z + ' µm', gx - 12, Y(z), { align: 'right', color: C.faint, size: 10 });
        // photons and electrons
        for (const d of dots) {
          const y = Y(d.z);
          c.globalAlpha = clamp(d.a, 0, 1);
          if (d.state === 1) { kit.dot(c, d.x, y, 3.4, C.accent); }
          else {
            const col = V.nm > 780 ? C.muted : S.nm(nmShow);
            c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(d.x, y - 9); c.lineTo(d.x, y); c.stroke();
            kit.dot(c, d.x, y, 2.6, col);
            if (d.state === 2) { c.strokeStyle = C.faint; c.beginPath(); c.arc(d.x, y, 6, 0, TAU); c.stroke(); }
          }
          c.globalAlpha = 1;
        }
        const E = O.photonEnergy(V.nm);
        kit.label(c, V.nm + ' nm: ' + E.toFixed(2) + ' eV' + (E < 1.12 ? '  — below the 1.12 eV band gap: passes through' : ''), gx, Hh * 0.035, { color: E < 1.12 ? C.warn : C.muted, size: 11.5, weight: 600 });
        // ---- the chain on the right
        const bx = W * 0.62, bw = Math.min(W * 0.34, 230), bh = Hh * 0.2;
        const boxes = [Hh * 0.08, Hh * 0.38, Hh * 0.68];
        const CG = 160.2 / V.C;                                          // µV per electron
        const volts = N * CG * 1e-3;                                     // mV
        const vfull = V.FW * CG * 1e-3;
        const levels = Math.pow(2, V.bits) - 1, dn = Math.round(clamp(N / V.FW, 0, 1) * levels);
        const drawBox = (y, title, big, small) => {
          c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(bx, y, bw, bh); c.strokeRect(bx, y, bw, bh);
          kit.label(c, title, bx + 8, y + 12, { color: C.muted, size: 11.5 });
          kit.label(c, big, bx + 8, y + bh * 0.52, { color: C.text, size: 17, weight: 650 });
          kit.label(c, small, bx + 8, y + bh - 12, { color: C.faint, size: 11 });
        };
        drawBox(boxes[0], '1. the well', fmtInt(N) + ' e⁻', 'of ' + fmtInt(V.FW) + ' (full well)');
        drawBox(boxes[1], '2. the sense node', volts.toFixed(volts < 10 ? 2 : 1) + ' mV', CG.toFixed(0) + ' µV per electron');
        drawBox(boxes[2], '3. the ADC, ' + V.bits + ' bits', String(dn), 'of ' + levels + ' levels');
        c.fillStyle = lev >= 0.999 ? C.bad : C.accent; c.fillRect(bx + 8, boxes[0] + bh - 9, (bw - 16) * lev, 4);
        c.fillStyle = C.accent; c.fillRect(bx + 8, boxes[1] + bh - 9, (bw - 16) * clamp(volts / vfull, 0, 1), 4);
        c.fillStyle = C.accent; c.fillRect(bx + 8, boxes[2] + bh - 9, (bw - 16) * clamp(dn / levels, 0, 1), 4);
        kit.arrow(c, bx + bw / 2, boxes[0] + bh, bx + bw / 2, boxes[1], C.muted, 1.6, 7);
        kit.arrow(c, bx + bw / 2, boxes[1] + bh, bx + bw / 2, boxes[2], C.muted, 1.6, 7);
        kit.label(c, 'move the charge', bx + bw / 2 + 8, (boxes[0] + bh + boxes[1]) / 2, { color: C.faint, size: 10.5 });
        kit.label(c, 'amplify, digitise', bx + bw / 2 + 8, (boxes[1] + bh + boxes[2]) / 2, { color: C.faint, size: 10.5 });
        if (lev >= 0.999) kit.label(c, 'FULL: more light is lost', bx + bw - 8, boxes[0] + 12, { align: 'right', color: C.bad, size: 11, weight: 650 });
        ro.set('E', E.toFixed(3) + ' eV');
        ro.set('eta', V.nm > GAP ? '0 % (the photon is below the band gap)' : (100 * eta).toFixed(1) + ' %');
        ro.set('N', fmtInt(N) + ' e⁻ after ' + T.toFixed(1) + ' s');
        ro.set('fill', (100 * lev).toFixed(1) + ' %');
        ro.set('v', volts.toFixed(2) + ' mV  (' + CG.toFixed(0) + ' µV/e⁻)');
        ro.set('dn', dn + ' of ' + levels);
        ro.set('k', (V.FW / (levels + 1)).toFixed(2) + ' e⁻/DN');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ a CCD */
  Hyper.sim('is-ccd', {
    title: 'A CCD: exposing, moving the charge, reading it out',
    blurb: `A tiny CCD of 6 × 5 pixels. Charge collects in each well (the blue fill), then the whole picture is passed down the columns into the serial register at the bottom and along it to the output amplifier at the right, one packet at a time. On the right: the scene you want, and the picture the CCD delivers. The chip is a cartoon: in a real one the read-out of a row takes thousands of times longer than shifting it, and the transfer efficiency is 99.999 %, not the 90 to 100 % of the slider.

**Try this**
- *Full-frame*: tick nothing and watch the read-out: light still falls on the array while it is clocked, and the picture is smeared and brightened, most in the rows read last. Tick **mechanical shutter** and the picture is clean: that is why full-frame cameras need one.
- Raise the **star** to 4 full wells with the drain off: the excess spills up and down its column. That is **blooming**. Switch the drain on: the surplus is thrown away and the streak is gone.
- Lower the **transfer efficiency** to 96 %: each transfer leaves 4 % behind, and a faint tail trails behind every bright pixel, most in the corner pixel that is moved farthest.
- Choose **frame-transfer**: the image drops quickly into the masked store, read-out is slow, and smear is only the short transfer time. Choose **interline**: all pixels hop at once into the masked registers beside them, and there is almost no smear.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 380 });
      const NX = 6, NY = 5, LEAK = 0.004;
      const BASE = [[0.05, 0.1, 0.1, 0.1, 0.08, 0.05], [0.08, 0.15, 0.1, 0, 0.12, 0.08], [0.1, 0.2, 0.2, 0.2, 0.15, 0.1], [0.1, 0.4, 0.45, 0.2, 0.15, 0.1], [0.05, 0.1, 0.15, 0.15, 0.6, 0.1]];
      const a0 = params.arch || 'full';
      const ctl = kit.controls(box.side, [
        { id: 'arch', type: 'select', label: 'Architecture', options: [['Full-frame', 'full'], ['Frame-transfer', 'frame'], ['Interline-transfer', 'interline']], value: a0 },
        { id: 'star', label: 'Brightness of the star (full wells)', min: 0.5, max: 8, step: 0.25, value: 3 },
        { id: 'cte', label: 'Charge-transfer efficiency per transfer', min: 90, max: 100, step: 0.5, value: 100, unit: '%' },
        { id: 'tp', label: 'Time to read one pixel ÷ exposure time', min: 0.002, max: 0.08, log: true, sig: 2, value: 0.02, fmt: v => (100 * v).toFixed(1) + ' %' },
        { id: 'shut', type: 'check', label: 'A mechanical shutter closes after the exposure', value: false },
        { id: 'abd', type: 'check', label: 'Anti-blooming drain beside each pixel', value: a0 === 'interline' },
        { id: 'speed', label: 'Animation speed', min: 0.25, max: 4, step: 0.25, value: 1 },
        { type: 'buttons', items: [{ id: 'run', label: 'Expose and read again', primary: true }] }
      ], id => { if (id === 'arch') ctl.set('abd', V.arch === 'interline'); if (id !== 'speed') rebuild(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['kept', 'Charge read ÷ charge collected'], ['move', 'Time the charge moves in the light'], ['rt', 'Read-out time ÷ exposure time'], ['spill', 'Charge spilled or drained'], ['full', 'Pixels filled to the brim']]);
      // ---- the bookkeeping: every packet of charge is followed through exposure, transfer and read-out
      function build() {
        const arch = V.arch, cte = V.cte / 100, tp = V.tp, tv = tp / 2;
        const B = BASE.map(r => r.slice()); B[1][3] = V.star;
        const Lr = arch === 'frame' ? 2 * NY : NY;
        const cols = []; for (let c = 0; c < NX; c++) cols.push(new Array(Lr).fill(0));
        const P = arch === 'interline' ? cols.map(() => new Array(NY).fill(0)) : null;   // photodiodes of an interline chip, by column and position
        const Sr = new Array(NX).fill(0), out = BASE.map(r => r.map(() => NaN));
        const frames = []; let collected = 0, spilled = 0, full = 0, counting = true;      // spill is counted for the exposure only
        // position p counts up from the serial register; image row r (0 at the top) sits at p = NY - 1 - r
        const lightAt = (p, c) => arch === 'full' ? B[NY - 1 - p][c] : arch === 'frame' ? (p >= NY ? B[2 * NY - 1 - p][c] : 0) : LEAK * B[NY - 1 - p][c];
        const bloom = (a, lo, hi) => {
          for (let it = 0; it < 60; it++) {
            let any = false;
            for (let p = lo; p <= hi; p++) if (a[p] > 1.0000001) {
              any = true; const ex = a[p] - 1; a[p] = 1;
              if (V.abd) { if (counting) spilled += ex; continue; }
              const up = p + 1 <= hi, dn = p - 1 >= lo;
              if (up && dn) { a[p + 1] += ex / 2; a[p - 1] += ex / 2; } else if (up) a[p + 1] += ex; else if (dn) a[p - 1] += ex; else if (counting) spilled += ex;
            }
            if (!any) break;
          }
          for (let p = lo; p <= hi; p++) if (a[p] > 1) { if (counting) spilled += a[p] - 1; a[p] = 1; }
        };
        const integrate = (dt, on, expose) => {
          if (!on) return;
          for (let c = 0; c < NX; c++) {
            if (arch === 'interline') {
              for (let p = 0; p < NY; p++) { P[c][p] += B[NY - 1 - p][c] * dt; if (!expose) cols[c][p] += lightAt(p, c) * dt; }
              bloom(P[c], 0, NY - 1);
            } else {
              for (let p = 0; p < Lr; p++) cols[c][p] += lightAt(p, c) * dt;
              bloom(cols[c], arch === 'full' ? 0 : NY, arch === 'full' ? NY - 1 : 2 * NY - 1);
            }
          }
        };
        const shift = (a, lo, hi) => {                                   // one transfer: a fraction cte moves on, the rest stays and joins the next packet
          const em = cte * a[lo], old = a.slice();
          for (let p = lo; p <= hi; p++) a[p] = (1 - cte) * old[p] + (p + 1 <= hi ? cte * old[p + 1] : 0);
          return em;
        };
        const snap = (kind, label, dur, lightOn) => frames.push({ kind, label, dur, lightOn, cols: cols.map(a => a.slice()), P: P && P.map(a => a.slice()), Sr: Sr.slice(), out: out.map(a => a.slice()) });
        const NE = 6;
        for (let i = 0; i < NE; i++) { integrate(1 / NE, true, true); snap('expose', 'Exposing: every pixel collects charge from the scene', 0.28, true); }
        for (let c = 0; c < NX; c++) {
          if (arch === 'interline') for (let p = 0; p < NY; p++) { collected += P[c][p]; if (P[c][p] > 0.999) full++; }
          else for (let p = arch === 'full' ? 0 : NY; p < (arch === 'full' ? NY : 2 * NY); p++) { collected += cols[c][p]; if (cols[c][p] > 0.999) full++; }
        }
        const on = !V.shut;
        counting = false;
        if (arch === 'interline') {
          for (let c = 0; c < NX; c++) for (let p = 0; p < NY; p++) { cols[c][p] += P[c][p]; P[c][p] = 0; }
          snap('transfer', 'All pixels hop into the masked registers at once: the exposure is over', 0.5, on);
        } else if (arch === 'frame') {
          for (let k = 0; k < NY; k++) { integrate(tv, on, false); for (let c = 0; c < NX; c++) shift(cols[c], 0, 2 * NY - 1); snap('transfer', 'The whole image is shifted, fast, into the masked store', 0.3, on); }
        }
        for (let k = 0; k < NY; k++) {
          integrate(tv, on, false);
          for (let c = 0; c < NX; c++) Sr[c] += shift(cols[c], 0, NY - 1);
          snap('read', 'Row ' + (k + 1) + ' of ' + NY + ' moves into the serial register', 0.3, on);
          for (let j = 0; j < NX; j++) {
            integrate(tp, on, false);
            const em = cte * Sr[NX - 1], old = Sr.slice();
            for (let x = 0; x < NX; x++) Sr[x] = (1 - cte) * old[x] + (x > 0 ? cte * old[x - 1] : 0);
            out[NY - 1 - k][NX - 1 - j] = em;
            snap('read', 'Row ' + (k + 1) + ' of ' + NY + ': one pixel at a time to the amplifier', 0.13, on);
          }
        }
        let read = 0; for (const r of out) for (const v of r) read += v;
        const rowT = NY * (tv + NX * tp);
        return { frames, B, kept: collected > 0 ? read / collected : 1, spilled, full, move: arch === 'full' ? rowT : arch === 'frame' ? NY * tv : 0, rt: rowT };
      }
      let M = null, idx = 0, acc = 0;
      const rebuild = () => { M = build(); idx = 0; acc = 0; if (!loop.running) loop.start(); };
      const cell = (c, C, x, y, w, h, q, masked) => {
        c.fillStyle = masked ? (C.dark ? '#242a45' : '#c5cadb') : C.surface; c.fillRect(x, y, w, h);
        if (q > 0.0005) { const f = clamp(q, 0, 1); c.fillStyle = q >= 0.999 ? C.bad : C.accent; c.fillRect(x + 1, y + h - (h - 2) * f - 1, w - 2, (h - 2) * f); }
        if (masked) { c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); for (let k = -h; k < w; k += 7) { c.moveTo(Math.max(x, x + k), y + Math.max(0, -k)); c.lineTo(Math.min(x + w, x + k + h), y + Math.min(h, w - k)); } c.stroke(); }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x, y, w, h);
      };
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (!M) M = build();
        if (dt > 0 && idx < M.frames.length - 1) { acc += dt * V.speed; while (idx < M.frames.length - 1 && acc >= M.frames[idx].dur) { acc -= M.frames[idx].dur; idx++; } if (idx >= M.frames.length - 1) loop.stop(); }
        const f = M.frames[idx], arch = V.arch, RR = arch === 'frame' ? 2 * NY : NY;
        const cs = Math.min((W * 0.56 - 24) / NX, (Hh * 0.66) / RR, 56), x0 = 20, y0 = Hh * 0.16;
        const rowY = p => y0 + (RR - 1 - p) * cs;
        // light
        const lightOn = f.lightOn;
        kit.label(c, f.label, x0, 14, { color: C.text, size: 12, weight: 650 });
        for (let col = 0; col < NX; col++) {
          const x = x0 + (col + 0.5) * cs;
          if (lightOn) { c.strokeStyle = C.warn; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y0 - 22); c.lineTo(x, y0 - 6); c.stroke(); c.fillStyle = C.warn; c.beginPath(); c.moveTo(x - 4, y0 - 8); c.lineTo(x + 4, y0 - 8); c.lineTo(x, y0 - 2); c.fill(); }
        }
        kit.label(c, lightOn ? 'light falls on the chip' : 'dark: the shutter is closed', x0 + NX * cs + 8, y0 - 14, { color: lightOn ? C.warn : C.faint, size: 11 });
        // the array
        for (let col = 0; col < NX; col++) {
          for (let p = 0; p < (arch === 'frame' ? 2 * NY : NY); p++) {
            const x = x0 + col * cs, y = rowY(p);
            if (arch === 'interline') {
              const pw = cs * 0.56;
              cell(c, C, x, y, pw, cs, f.P[col][p], false);
              cell(c, C, x + pw, y, cs - pw, cs, f.cols[col][p], true);
            } else cell(c, C, x, y, cs, cs, f.cols[col][p], arch === 'frame' && p < NY);
          }
        }
        // labels for the areas
        const xr = x0 + NX * cs + 8;
        if (arch === 'frame') { kit.label(c, 'image area', xr, y0 + NY * cs * 0.5, { color: C.muted, size: 11 }); kit.label(c, 'storage (masked)', xr, y0 + NY * cs * 1.5, { color: C.muted, size: 11 }); }
        else if (arch === 'interline') kit.label(c, 'photodiode | masked register', xr, y0 + cs * 0.5, { color: C.muted, size: 11 });
        else kit.label(c, 'light-sensitive array', xr, y0 + cs * 0.5, { color: C.muted, size: 11 });
        // the serial register and the amplifier
        const sy = y0 + RR * cs + 8, sh = cs * 0.72;
        for (let col = 0; col < NX; col++) cell(c, C, x0 + col * cs, sy, cs, sh, f.Sr[col], true);
        kit.label(c, 'serial register', x0, sy + sh + 12, { color: C.muted, size: 11 });
        const ax = x0 + NX * cs + 6, ay = sy + sh / 2;
        c.fillStyle = C.muted; c.beginPath(); c.moveTo(ax, ay - 10); c.lineTo(ax + 20, ay); c.lineTo(ax, ay + 10); c.closePath(); c.fill();
        kit.arrow(c, ax + 20, ay, ax + 44, ay, C.muted, 1.6, 6);
        kit.label(c, 'amplifier, ADC', ax + 4, ay + 20, { color: C.muted, size: 11 });
        // the two pictures
        const px = W * 0.66, cw = Math.min((W - px - 14) / NX, 30);
        const pic = (y, title, fn) => {
          kit.label(c, title, px, y - 9, { color: C.muted, size: 11.5 });
          for (let r = 0; r < NY; r++) for (let col = 0; col < NX; col++) {
            const v = fn(r, col);
            c.fillStyle = Number.isNaN(v) ? C.bg2 : grey(Math.pow(clamp(v, 0, 1), 0.7));
            c.fillRect(px + col * cw, y + r * cw, cw - 1, cw - 1);
          }
        };
        pic(y0 + 4, 'the scene, ideally', (r, col) => M.B[r][col]);
        pic(y0 + NY * cw + 44, 'what the CCD delivers', (r, col) => f.out[r][col]);
        const lost = M.spilled;
        ro.set('kept', (100 * M.kept).toFixed(0) + ' %  (below 100: transfer losses; above: smear)');
        ro.set('move', V.shut ? 'none: the shutter is closed' : arch === 'interline' ? 'one step (leaks beneath the mask)' : (100 * M.move).toFixed(0) + ' % of the exposure');
        ro.set('rt', (100 * M.rt).toFixed(0) + ' %');
        ro.set('spill', lost > 0.005 ? lost.toFixed(2) + ' full wells' + (V.abd ? ' (drained)' : ' (spilled)') : 'none');
        ro.set('full', M.full + ' of ' + NX * NY);
      }, box.stage);
      st.onResize(() => loop.once());
      rebuild(); loop.once();
    }
  });

  /* ================================================================ a CMOS array */
  Hyper.sim('is-cmos', {
    title: 'A CMOS sensor: row select, column converters, random access',
    blurb: `A CMOS array of 8 × 6 pixels (the numbers are for a real 4000 × 3000 sensor). One row at a time is selected; every pixel of that row puts its voltage on its column line, and the converter at the foot of each column digitises it, all at the same time. The picture builds up on the right.

**Try this**
- Read the **whole frame**: time = rows × row time. Change the row time and watch the frame rate.
- Switch the converters to **one for the whole chip**, like the single amplifier of a CCD port (40 million pixels a second): the same sensor now takes about ten times as long, and the animation visits every pixel.
- Choose **a window of rows** (click the array to place it): only those rows are read, and the frame rate rises in proportion.
- Choose **one pixel** and click any pixel: random access reads just that one in a single row time. A CCD has no such shortcut.`,
    mount(box, kit, params) {
      const O = kit.optics;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 360 });
      const NX = 8, NY = 6, FULLX = 4000, FULLY = 3000, FADC = 40e6;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'What is read', options: [['The whole frame', 'full'], ['A window of rows (click to place it)', 'window'], ['One pixel (click to choose it)', 'pixel']], value: params.mode || 'full' },
        { id: 'adc', type: 'select', label: 'Converters', options: [['One per column (CMOS)', 'col'], ['One for the whole chip (like a CCD port)', 'one']], value: params.adc || 'col' },
        { id: 'win', label: 'Rows in the window', min: 1, max: 5, step: 1, value: 2 },
        { id: 'trow', label: 'Row time', min: 5, max: 20, step: 1, value: 11, unit: 'µs' },
        { id: 'speed', label: 'Animation speed', min: 0.25, max: 4, step: 0.25, value: 1 },
        { type: 'buttons', items: [{ id: 'again', label: 'Read the frame again', primary: true }] }
      ], id => { if (id !== 'speed') restart(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rows', 'Rows read'], ['px', 'Pixels read'], ['T', 'Time for one read-out'], ['fps', 'Frames per second'], ['rate', 'Pixels delivered per second']]);
      const scene = (r, c) => clamp(0.12 + 0.88 * Math.exp(-(Math.pow(r - 2.3, 2) + Math.pow(c - 3.6, 2)) / 5), 0, 1);
      let sel = { r0: 2, r: 2, c: 3 };
      let events = [], ev = 0, acc = 0, got = null;
      function plan() {
        events = []; got = []; for (let r = 0; r < NY; r++) got.push(new Array(NX).fill(NaN));
        const rows = V.mode === 'full' ? [0, 1, 2, 3, 4, 5] : V.mode === 'window' ? Array.from({ length: V.win }, (_, i) => clamp(sel.r0 + i, 0, NY - 1)).filter((v, i, a) => a.indexOf(v) === i) : [sel.r];
        for (const r of rows) {
          if (V.adc === 'col' || V.mode === 'pixel') events.push({ r, c: V.mode === 'pixel' ? sel.c : -1, dur: 0.55 });
          else for (let c = 0; c < NX; c++) events.push({ r, c, dur: 0.16 });
        }
      }
      const restart = () => { plan(); ev = 0; acc = 0; if (!loop.running) loop.start(); };
      kit.click(st, p => {
        const g = geom(); const c = Math.floor((p.x - g.x0) / g.cs), r = Math.floor((p.y - g.y0) / g.cs);
        if (c < 0 || c >= NX || r < 0 || r >= NY) return;
        if (V.mode === 'window') sel.r0 = clamp(r, 0, NY - V.win); else if (V.mode === 'pixel') { sel.r = r; sel.c = c; } else return;
        restart();
      }, p => { const g = geom(); return p.x >= g.x0 && p.x < g.x0 + NX * g.cs && p.y >= g.y0 && p.y < g.y0 + NY * g.cs; });
      function geom() { const W = st.W, Hh = st.H, cs = Math.min((W * 0.56 - 30) / NX, (Hh * 0.56) / NY, 52); return { cs, x0: 24, y0: Hh * 0.12 }; }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, g = geom(), cs = g.cs;
        if (!events.length) plan();
        // time bookkeeping for a real 4000 × 3000 sensor
        const rowsRead = V.mode === 'full' ? FULLY : V.mode === 'window' ? Math.round(FULLY * V.win / NY) : 1;
        const pxRead = V.mode === 'pixel' ? 1 : rowsRead * FULLX;
        const T = V.adc === 'col' || V.mode === 'pixel' ? (V.adc === 'col' ? rowsRead * V.trow * 1e-6 : pxRead / FADC) : pxRead / FADC;
        if (dt > 0 && ev < events.length) {
          acc += dt * V.speed;
          while (ev < events.length && acc >= events[ev].dur) {
            const e = events[ev]; acc -= e.dur;
            if (e.c < 0) for (let k = 0; k < NX; k++) got[e.r][k] = scene(e.r, k); else got[e.r][e.c] = scene(e.r, e.c);
            ev++;
          }
          if (ev >= events.length) loop.stop();
        }
        const cur = ev < events.length ? events[ev] : null, frac = cur ? acc / cur.dur : 1;
        // ---- the array
        for (let r = 0; r < NY; r++) for (let k = 0; k < NX; k++) {
          const x = g.x0 + k * cs, y = g.y0 + r * cs;
          c.fillStyle = grey(Math.pow(scene(r, k), 0.8) * 0.9 + 0.05); c.fillRect(x + 2, y + 2, cs - 4, cs - 4);
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x, y, cs, cs);
        }
        const inRead = r => V.mode === 'full' || (V.mode === 'window' && r >= sel.r0 && r < sel.r0 + V.win) || (V.mode === 'pixel' && r === sel.r);
        for (let r = 0; r < NY; r++) if (V.mode !== 'full' && !inRead(r)) { c.fillStyle = C.dark ? 'rgba(10,12,25,0.55)' : 'rgba(255,255,255,0.55)'; c.fillRect(g.x0, g.y0 + r * cs, NX * cs, cs); }
        if (V.mode === 'window') { c.strokeStyle = C.accent; c.lineWidth = 2; c.strokeRect(g.x0 - 1, g.y0 + sel.r0 * cs - 1, NX * cs + 2, V.win * cs + 2); }
        if (V.mode === 'pixel') { c.strokeStyle = C.accent; c.lineWidth = 2.4; c.strokeRect(g.x0 + sel.c * cs - 1, g.y0 + sel.r * cs - 1, cs + 2, cs + 2); }
        // the selected row and the column lines
        if (cur) {
          const y = g.y0 + cur.r * cs;
          c.fillStyle = C.accent; c.globalAlpha = 0.28; c.fillRect(g.x0, y, NX * cs, cs); c.globalAlpha = 1;
          c.strokeStyle = C.accent; c.lineWidth = 2; c.strokeRect(g.x0, y, NX * cs, cs);
          kit.label(c, 'row ' + (cur.r + 1) + ' selected', g.x0 - 2, y - 7, { color: C.accent, size: 11, weight: 650 });
        }
        const by = g.y0 + NY * cs, adcY = by + 22, adcH = Math.min(24, cs * 0.55);
        for (let k = 0; k < NX; k++) {
          const x = g.x0 + (k + 0.5) * cs;
          const active = cur && (cur.c < 0 || cur.c === k);
          c.strokeStyle = active ? C.accent : C.faint; c.lineWidth = active ? 2 : 1; c.beginPath(); c.moveTo(x, by); c.lineTo(x, adcY); c.stroke();
          if (V.adc === 'col') {
            c.fillStyle = C.surface; c.strokeStyle = active ? C.accent : C.axis; c.lineWidth = 1.2; c.fillRect(x - cs * 0.38, adcY, cs * 0.76, adcH); c.strokeRect(x - cs * 0.38, adcY, cs * 0.76, adcH);
            const last = ev > 0 ? got[events[ev - 1].r][k] : NaN;
            const show = active && cur ? (frac < 0.5 ? '…' : String(Math.round(scene(cur.r, k) * 4095))) : (Number.isNaN(last) ? '' : String(Math.round(last * 4095)));
            kit.label(c, show, x, adcY + adcH / 2, { align: 'center', color: C.text, size: 10 });
          }
        }
        if (V.adc === 'col') kit.label(c, 'one ADC per column', g.x0, adcY + adcH + 12, { color: C.muted, size: 11 });
        else {
          const ox = g.x0 + NX * cs + 12, oy = adcY + adcH / 2;
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(g.x0 + cs * 0.5, adcY); c.lineTo(g.x0 + (NX - 0.5) * cs, adcY); c.stroke();
          c.fillStyle = C.surface; c.strokeStyle = C.accent; c.lineWidth = 1.4; c.fillRect(ox, oy - 14, 46, 28); c.strokeRect(ox, oy - 14, 46, 28);
          kit.label(c, 'ADC', ox + 23, oy, { align: 'center', color: C.text, size: 11 });
          kit.arrow(c, g.x0 + (NX - 0.5) * cs, adcY, ox, adcY, C.muted, 1.4, 6);
          kit.label(c, 'a single converter, 40 MHz', g.x0, adcY + 28, { color: C.muted, size: 11 });
        }
        if (cur) kit.label(c, frac < 0.3 ? 'sampling the reset level' : frac < 0.6 ? 'charge transferred: sampling the signal level' : 'converting (signal − reset)', g.x0, Hh - 12, { color: C.muted, size: 11.5 });
        else kit.label(c, 'read-out complete', g.x0, Hh - 12, { color: C.ok, size: 11.5, weight: 650 });
        // ---- the picture built so far
        const px = W * 0.66, cw = Math.min((W - px - 16) / NX, 30), py = g.y0 + 4;
        kit.label(c, 'picture read so far', px, py - 9, { color: C.muted, size: 11.5 });
        for (let r = 0; r < NY; r++) for (let k = 0; k < NX; k++) {
          const v = got[r][k];
          c.fillStyle = Number.isNaN(v) ? C.bg2 : grey(Math.pow(v, 0.8) * 0.9 + 0.05); c.fillRect(px + k * cw, py + r * cw, cw - 1, cw - 1);
        }
        ro.set('rows', fmtInt(rowsRead) + (V.mode === 'full' ? ' (all)' : ''));
        ro.set('px', fmtInt(pxRead));
        ro.set('T', T < 1e-3 ? (T * 1e6).toFixed(T < 1e-5 ? 2 : 1) + ' µs' : T < 1 ? (T * 1e3).toFixed(T < 0.1 ? 1 : 0) + ' ms' : T.toFixed(2) + ' s');
        ro.set('fps', (1 / T < 100 ? (1 / T).toFixed(1) : fmtInt(1 / T)) + ' per s');
        const bps = O.cam.dataRate(pxRead, 1, 12, 1 / T);
        ro.set('rate', (pxRead / T / 1e6).toFixed(pxRead / T / 1e6 < 10 ? 2 : 0) + ' million  (' + (bps / 1e9).toFixed(bps < 1e10 ? 2 : 1) + ' Gbit/s at 12 bits)');
      }, box.stage);
      st.onResize(() => loop.once());
      restart(); loop.once();
    }
  });

  /* ================================================================ rolling and global shutter */
  Hyper.sim('is-shutter', {
    title: 'Rolling and global shutter: what a moving object looks like',
    blurb: `A bar (or a three-bladed fan) moves in front of a sensor. **Left:** the live scene, in slow motion; the dashed line joins the places where each row of a rolling-shutter sensor actually caught the bar. **Middle:** the picture the sensor records. **Below:** the exposure of each row against time: a staircase for the rolling shutter, a column for the global one.

**Try this**
- Rolling shutter, bar at 4 widths per second, readout 20 ms: the bar leans by speed × readout time (8 % of the picture width). Switch to the *global shutter*: it stands upright.
- Shorten the **exposure** to 0.1 ms: each row is sharp, but the lean does not change. Skew comes from the readout time, not the exposure time.
- Choose the **fan** and turn it at 25 revolutions a second: the blades curve (and at high speed look like a spiral); the global shutter shows three straight blades.
- Tick the **1 ms flash** with a short exposure: only a band of the rolling-shutter sensor is lit. Lengthen the exposure beyond the readout time (30 ms) and the whole picture is lit.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 390 });
      const NR = 56, NC = 56, FLASH = 1e-3;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Shutter', options: [['Rolling shutter', 'roll'], ['Global shutter', 'glob']], value: params.mode || 'roll' },
        { id: 'obj', type: 'select', label: 'Object', options: [['A bar moving sideways', 'bar'], ['A three-bladed fan', 'fan']], value: params.obj || 'bar' },
        { id: 'speed', label: 'Speed of the bar', min: 0.5, max: 12, step: 0.5, value: 4, unit: ' widths/s' },
        { id: 'rps', label: 'Turn rate of the fan', min: 2, max: 50, step: 1, value: 25, unit: ' rev/s' },
        { id: 'tro', label: 'Readout time, first row to last row', min: 1, max: 40, step: 1, value: 20, unit: ' ms' },
        { id: 'texp', label: 'Exposure time of each row', min: 0.1, max: 40, log: true, sig: 2, value: 2, unit: ' ms' },
        { id: 'flash', type: 'check', label: 'Light the scene with a 1 ms flash (otherwise steady light)', value: false }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const sync = () => { ctl.show('speed', V.obj === 'bar'); ctl.show('rps', V.obj === 'fan'); };
      const ro = kit.readout(box.side, [['tro', 'Time from the first row to the last'], ['shear', 'Movement during the readout'], ['all', 'All rows open at the same time?'], ['blur', 'Movement during one row\'s exposure'], ['flash', 'Rows lit by the flash']]);
      const wrap = a => { while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a; };
      // 1 where the object covers the picture point (x, y) (0…1, y down) at time t
      const cover = (x, y, t) => {
        if (V.obj === 'bar') { const xc = (((V.speed * t) % 1.1) + 1.1) % 1.1 - 0.05; return Math.abs(x - xc) < 0.05 ? 1 : 0; }
        const dx = x - 0.5, dy = y - 0.5, r = Math.hypot(dx, dy);
        if (r < 0.06) return 1;
        if (r < 0.08 || r > 0.47) return 0;
        const th = TAU * V.rps * t, half = mix(0.34, 0.12, (r - 0.08) / 0.39), a = Math.atan2(dy, dx);
        for (let k = 0; k < 3; k++) if (Math.abs(wrap(a - th - k * TAU / 3)) < half) return 1;
        return 0;
      };
      let tt = 0;
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        tt += dt * 0.04;
        const roll = V.mode === 'roll', tro = V.tro * 1e-3, texp = V.texp * 1e-3, t0 = tt;
        const fa = roll ? 0.5 * tro : 0.5 * texp - FLASH / 2, tfa = t0 + fa;     // the flash: in the middle of the readout, or of the global exposure
        // ---- the picture the sensor records
        const img = [];
        let lit = 0;
        for (let j = 0; j < NR; j++) {
          const row = new Array(NC).fill(0), a0 = t0 + (roll ? j / (NR - 1) * tro : 0), a1 = a0 + texp;
          let lo = a0, hi = a1, norm = texp;
          if (V.flash) { lo = Math.max(a0, tfa); hi = Math.min(a1, tfa + FLASH); norm = FLASH; }
          if (hi > lo) {
            if (V.flash) lit++;
            const n = clamp(Math.ceil((hi - lo) * 1e3 * 2), 5, 20);
            for (let i = 0; i < NC; i++) {
              let s = 0;
              for (let k = 0; k < n; k++) s += cover((i + 0.5) / NC, (j + 0.5) / NR, lo + (hi - lo) * (k + 0.5) / n);
              row[i] = (hi - lo) / norm * s / n;
            }
          }
          img.push(row);
        }
        // ---- the live view and the recording, side by side
        const sz = Math.min(W * 0.3, Hh * 0.52), x1 = 24, x2 = x1 + sz + Math.min(60, W * 0.08), y1 = 30;
        const scene = (u, v) => cover(u, v, tt);
        S.image(c, x1, y1, sz, sz, NC, NR, scene, { smooth: false });
        S.image(c, x2, y1, sz, sz, NC, NR, (u, v) => Math.pow(clamp(img[Math.min(NR - 1, Math.floor(v * NR))][Math.min(NC - 1, Math.floor(u * NC))], 0, 1), 0.8), { smooth: false });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x1, y1, sz, sz); c.strokeRect(x2, y1, sz, sz);
        kit.label(c, 'the scene now (slow motion)', x1, y1 - 12, { color: C.muted, size: 11.5 });
        kit.label(c, 'what the sensor records', x2, y1 - 12, { color: C.muted, size: 11.5 });
        // the track of the bar through the rows of the rolling shutter
        if (V.obj === 'bar') {
          c.strokeStyle = C.warn; c.lineWidth = 1.6; c.setLineDash([5, 3]); c.beginPath();
          for (let j = 0; j <= NR; j += 4) {
            const t = t0 + (roll ? Math.min(j, NR - 1) / (NR - 1) * tro : 0) + texp / 2, xc = (((V.speed * t) % 1.1) + 1.1) % 1.1 - 0.05;
            const px = x1 + clamp(xc, -0.05, 1.05) * sz, py = y1 + j / NR * sz;
            if (j === 0) c.moveTo(px, py); else c.lineTo(px, py);
          }
          c.stroke(); c.setLineDash([]);
        }
        kit.label(c, 'row 1', x2 + sz + 6, y1 + 6, { color: C.faint, size: 10.5 }); kit.label(c, 'last row', x2 + sz + 6, y1 + sz - 6, { color: C.faint, size: 10.5 });
        // ---- the timeline of the exposures
        const gx0 = 64, gx1 = W - 24, gy0 = y1 + sz + 36, gy1 = Hh - 26, span = Math.max(tro + texp, FLASH) * 1.08;
        const X = t => gx0 + (gx1 - gx0) * (t / span), Yr = j => gy0 + (gy1 - gy0) * (j / NR);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(gx0, gy0 - 4); c.lineTo(gx0, gy1 + 2); c.lineTo(gx1, gy1 + 2); c.stroke();
        for (let j = 0; j < NR; j += 2) {
          const a0 = (roll ? j / (NR - 1) * tro : 0);
          c.fillStyle = C.accent; c.globalAlpha = 0.75; c.fillRect(X(a0), Yr(j), Math.max(1.2, X(a0 + texp) - X(a0)), Math.max(1, (gy1 - gy0) / NR * 1.6)); c.globalAlpha = 1;
        }
        if (V.flash) { c.fillStyle = C.warn; c.globalAlpha = 0.6; c.fillRect(X(fa), gy0 - 4, Math.max(1.5, X(fa + FLASH) - X(fa)), gy1 - gy0 + 6); c.globalAlpha = 1; kit.label(c, 'flash', X(fa) + 4, gy0 - 8, { color: C.warn, size: 11 }); }
        kit.label(c, 'row', gx0 - 8, gy0 + 4, { align: 'right', color: C.muted, size: 11 });
        kit.label(c, 'time  (0 to ' + (span * 1e3).toFixed(0) + ' ms)', gx1, gy1 + 14, { align: 'right', color: C.muted, size: 11 });
        kit.label(c, 'exposure of each row', gx0 + 6, gy0 - 8, { color: C.muted, size: 11 });
        // ---- numbers
        ro.set('tro', roll ? V.tro + ' ms' : '0: every pixel together');
        const shearTxt = V.obj === 'bar' ? (V.speed * tro * 100).toFixed(1) + ' % of the picture width' : (360 * V.rps * tro).toFixed(0) + '° of rotation';
        ro.set('shear', roll ? shearTxt : 'none (global shutter)');
        ro.set('all', roll ? (V.texp > V.tro ? 'yes, for ' + (V.texp - V.tro).toFixed(1) + ' ms' : 'never: no flash can light every row') : 'yes');
        ro.set('blur', V.obj === 'bar' ? (V.speed * texp * 100).toFixed(2) + ' % of the width' : (360 * V.rps * texp).toFixed(1) + '°');
        ro.set('flash', V.flash ? Math.round(100 * lit / NR) + ' % of the rows' : 'no flash');
      }, box.stage);
      st.onResize(() => loop.once());
      sync(); loop.start();
    }
  });

  /* ================================================================ quantum efficiency */
  Hyper.sim('is-qe', {
    title: 'Quantum efficiency: what silicon, filters and thickness do to the curve',
    blurb: `The efficiency of a silicon pixel against wavelength, from a simple model: light is absorbed with the true absorption coefficient of silicon, and only what is absorbed inside the photodiode counts. It is schematic: real sensors differ in detail. Above the plot, a section of the pixel shows what the light passes on the way.

**Try this**
- Start with a front-illuminated, 4 µm photodiode: blue is poor (the layers above it are in the way) and the curve is gone by 1000 nm because deep photons pass through. Tick **back-illuminated**: blue and green rise.
- Make the photodiode thicker (15 µm): the near-infrared efficiency at 850 and 940 nm climbs. That is an NIR-enhanced sensor.
- Choose the **colour** sensor with the infrared-cut filter *off*: all three channels rise again beyond 700 nm, and the camera would see leaves and clothes in false colour. Switch the filter on.
- Plot **responsivity** in A/W instead: even at a fixed QE the curve climbs towards the infrared (more photons per watt).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.26, minH: 120, maxH: 150 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'wavelength (nm)', min: 300, max: 1200 }, y: { label: 'quantum efficiency (%)', min: 0, max: 100 }, legend: true, series: [] }, 250);
      const ctl = kit.controls(box.side, [
        { id: 'W', label: 'Thickness of the photodiode', min: 1, max: 30, step: 0.5, value: params.W || 4, unit: ' µm' },
        { id: 'bsi', type: 'check', label: 'Back-illuminated (no wiring above the photodiode)', value: !!params.bsi },
        { id: 'sens', type: 'select', label: 'Sensor', options: [['Monochrome', 'mono'], ['Colour (red, green, blue filters)', 'rgb']], value: params.sens || 'mono' },
        { id: 'ircut', type: 'check', label: 'Infrared-cut filter in front', value: params.ircut != null ? !!params.ircut : false },
        { id: 'y', type: 'select', label: 'Plot', options: [['Quantum efficiency (%)', 'qe'], ['Responsivity (A/W)', 'resp']], value: 'qe' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['q550', 'QE at 550 nm (green)'], ['q850', 'QE at 850 nm'], ['q940', 'QE at 940 nm'], ['pk', 'Peak of the curve'], ['r850', 'Responsivity at 850 nm']]);
      const filt = {
        R: nm => 1 / (1 + Math.exp((585 - nm) / 14)),
        G: nm => Math.exp(-Math.pow((nm - 540) / 38, 2) / 2),
        B: nm => Math.exp(-Math.pow((nm - 460) / 32, 2) / 2)
      };
      const nirLeak = nm => 0.9 / (1 + Math.exp((720 - nm) / 14));             // dyes become transparent in the near infrared
      const irc = nm => V.ircut ? 1 / (1 + Math.exp((nm - 675) / 9)) : 1;
      const qeAt = (nm, ch) => {
        const d0 = V.bsi ? 0.05 : 0.7, Rs = V.bsi ? 0.04 : 0.12;
        let q = qeSi(nm, d0, V.W, Rs) * irc(nm);
        if (ch) q *= clamp(filt[ch](nm) + (ch === 'R' ? 0 : nirLeak(nm)), 0, 1) * 0.93;
        return q;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // a section of the pixel: filter, colour filter, dead layer, photodiode
        const x0 = 20, bw = Math.min(W * 0.36, 260), y0 = 16;
        const layers = [];
        if (V.ircut) layers.push(['infrared-cut filter', 12, C.dark ? 'rgba(200,120,120,0.45)' : 'rgba(210,110,110,0.45)']);
        if (V.sens === 'rgb') layers.push(['colour filter', 12, C.dark ? 'rgba(120,200,140,0.45)' : 'rgba(80,170,110,0.45)']);
        if (!V.bsi) layers.push(['wiring and dead layer', 14, C.dark ? 'rgba(130,140,170,0.55)' : 'rgba(120,130,160,0.5)']);
        let y = y0;
        const ph = clamp(V.W * 2.2, 8, Hh - 70);
        for (const L of layers) { c.fillStyle = L[2]; c.fillRect(x0, y, bw, L[1]); c.strokeStyle = C.axis; c.strokeRect(x0, y, bw, L[1]); kit.label(c, L[0], x0 + bw + 8, y + L[1] / 2, { color: C.muted, size: 11 }); y += L[1]; }
        c.fillStyle = C.accent; c.globalAlpha = 0.3; c.fillRect(x0, y, bw, Math.min(ph, Hh - y - 12)); c.globalAlpha = 1; c.strokeStyle = C.accent; c.strokeRect(x0, y, bw, Math.min(ph, Hh - y - 12));
        kit.label(c, 'photodiode, ' + V.W + ' µm' + (V.bsi ? '  (light enters from the back)' : ''), x0 + bw + 8, y + Math.min(ph, Hh - y - 12) / 2, { color: C.accent, size: 11 });
        kit.arrow(c, x0 + bw * 0.5, 2, x0 + bw * 0.5, y0 + 4, C.warn, 2, 7);
        S.spectrum(c, W * 0.66, Hh * 0.38, W * 0.3, 14, 380, 780, { ticks: 100 });
        kit.label(c, 'visible light', W * 0.66, Hh * 0.38 - 10, { color: C.muted, size: 11 });
        // the plot
        const nms = []; for (let nm = 300; nm <= 1200; nm += 5) nms.push(nm);
        const conv = (nm, q) => V.y === 'qe' ? 100 * q : q * nm / 1239.84;
        const series = V.sens === 'mono' ? [{ pts: nms.map(nm => [nm, conv(nm, qeAt(nm))]), label: 'monochrome', color: C.text, width: 2.4 }]
          : [['R', '#e5484d', 'red pixels'], ['G', '#22b37a', 'green pixels'], ['B', '#4c7bff', 'blue pixels']].map(a => ({ pts: nms.map(nm => [nm, conv(nm, qeAt(nm, a[0]))]), label: a[2], color: a[1], width: 2.2 }));
        plot.set({ series, y: { label: V.y === 'qe' ? 'quantum efficiency (%)' : 'responsivity (A/W)', min: 0, max: V.y === 'qe' ? 100 : 1 }, vlines: [{ x: 1107, label: '1107 nm: band-gap limit' }] });
        const mono = V.sens === 'mono';
        const q = nm => mono ? qeAt(nm) : Math.max(qeAt(nm, 'R'), qeAt(nm, 'G'), qeAt(nm, 'B'));
        let pk = 0, pkAt = 0; for (let nm = 300; nm <= 1100; nm += 5) { const v = q(nm); if (v > pk) { pk = v; pkAt = nm; } }
        ro.set('q550', (100 * (mono ? qeAt(550) : qeAt(550, 'G'))).toFixed(0) + ' %');
        ro.set('q850', (100 * q(850)).toFixed(1) + ' %');
        ro.set('q940', (100 * q(940)).toFixed(1) + ' %');
        ro.set('pk', (100 * pk).toFixed(0) + ' % at ' + pkAt + ' nm' + (mono ? '' : ' (best channel)'));
        ro.set('r850', (q(850) * 850 / 1239.84).toFixed(3) + ' A/W   (photon energy ' + O.photonEnergy(850).toFixed(2) + ' eV)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ noise */
  Hyper.sim('is-noise', {
    title: 'Sensor noise: shot, read, dark and fixed-pattern',
    blurb: `A test picture as a sensor records it. The noise is drawn from the statistics of each source (the same random numbers are used every time, so the picture changes smoothly as you move a slider). The bars show how large each source is for the brightest part of the picture, and the graph gives the signal-to-noise ratio against the light level. A schematic: for very small counts the real statistics are Poisson, not Gaussian.

**Try this**
- 100 photons per pixel with 3 e⁻ of read noise: the picture is a mess and the read noise is as big as the shot noise. At 100 000 photons the read noise has vanished next to the shot noise, and the curve follows the ideal square-root line.
- Raise the **temperature** with a long exposure: the dark current doubles about every 7 °C and a grain appears in the darkest parts.
- Set the PRNU to 2 % and the light to 1 000 000 photons: the SNR stops at about 50 whatever the light, because the pixel-to-pixel gain differences are the same in every frame. Averaging more frames does not remove them.
- Average 16 frames at low light: the random noise falls by 4, the fixed pattern stays.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200, maxH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'photons per pixel (brightest region)', min: 1, max: 1e7, log: true }, y: { label: 'signal-to-noise ratio', min: 0.1, max: 1000, log: true }, legend: true, series: [] }, 230);
      const ctl = kit.controls(box.side, [
        { id: 'ph', label: 'Photons per pixel (brightest region)', min: 10, max: 1e6, log: true, sig: 2, value: params.ph || 1000 },
        { id: 'qe', label: 'Quantum efficiency', min: 10, max: 100, step: 1, value: 60, unit: ' %' },
        { id: 'read', label: 'Read noise', min: 0.3, max: 30, log: true, sig: 2, value: 3, unit: ' e⁻' },
        { id: 'dark', label: 'Dark current at 25 °C', min: 0.01, max: 100, log: true, sig: 2, value: 1, unit: ' e⁻/s' },
        { id: 'temp', label: 'Temperature of the sensor', min: -40, max: 60, step: 1, value: 25, unit: ' °C' },
        { id: 'texp', label: 'Exposure time', min: 0.001, max: 100, log: true, sig: 2, value: 0.1, unit: ' s' },
        { id: 'prnu', label: 'Pixel response non-uniformity (PRNU)', min: 0, max: 3, step: 0.1, value: 1, unit: ' %' },
        { id: 'avg', type: 'select', label: 'Frames averaged', options: [['1', 1], ['4', 4], ['16', 16], ['64', 64]], value: 1 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sig', 'Signal (brightest)'], ['shot', 'Photon shot noise'], ['dk', 'Dark current and its shot noise'], ['rd', 'Read noise'], ['pr', 'PRNU noise'], ['snr', 'Signal-to-noise ratio'], ['one', 'Without the fixed pattern'], ['who', 'The largest source']]);
      const NX = 64, NY = 40;
      const scene = (u, v) => {
        let s = 0.12 + 0.3 * u;
        if (Math.hypot(u - 0.72, (v - 0.4) * 0.8) < 0.17) s = 1;
        if (u > 0.08 && u < 0.46 && v > 0.62 && v < 0.92) s = (Math.floor((u - 0.08) / 0.095) % 2) ? 0.15 : 0.85;
        return s;
      };
      // dark current doubles about every 7 °C
      const darkE = () => V.dark * Math.pow(2, (V.temp - 25) / 7) * V.texp;
      const sigmaOf = (N, withPrnu) => {
        const S0 = N * V.qe / 100, D = darkE(), n = V.avg;
        const temporal = Math.sqrt((S0 + D + V.read * V.read) / n), fixed = withPrnu ? V.prnu / 100 * S0 : 0;
        return { S0, D, temporal, fixed, total: Math.sqrt(temporal * temporal + fixed * fixed) };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const sz = Math.min(Hh - 40, W * 0.4), ix = 20, iy = 24;
        const r = rng(2024), rp = rng(77);
        const S0 = V.ph * V.qe / 100, D = darkE(), n = V.avg;
        const pix = [];
        for (let j = 0; j < NY; j++) { const row = []; for (let i = 0; i < NX; i++) {
          const s = scene((i + 0.5) / NX, (j + 0.5) / NY), gp = gauss(rp), g1 = gauss(r);
          const mean = s * S0 * (1 + V.prnu / 100 * gp), varT = (s * S0 + D + V.read * V.read) / n;
          const x = mean + D + Math.sqrt(varT) * g1;
          row.push((x - D) / Math.max(S0, 1e-9));
        } pix.push(row); }
        S.image(c, ix, iy, sz * NX / NY, sz, NX, NY, (u, v) => Math.pow(clamp(pix[Math.min(NY - 1, Math.floor(v * NY))][Math.min(NX - 1, Math.floor(u * NX))], 0, 1), 0.6), { smooth: false });
        c.strokeStyle = C.axis; c.strokeRect(ix, iy, sz * NX / NY, sz);
        kit.label(c, 'the picture as recorded (dark offset removed)', ix, iy - 11, { color: C.muted, size: 11.5 });
        // bars: the sources, for the brightest part
        const bx = ix + sz * NX / NY + 30, bw = Math.max(60, W - bx - 24), by = iy + 8;
        const srcs = [['photon shot noise', Math.sqrt(S0), C.accent], ['dark current shot noise', Math.sqrt(D), C.warn], ['read noise', V.read, C.bad], ['PRNU (fixed pattern)', V.prnu / 100 * S0, C.ok]];
        const mx = Math.max(1e-9, ...srcs.map(s => s[1]));
        kit.label(c, 'noise sources, rms electrons', bx, iy - 11, { color: C.muted, size: 11.5 });
        srcs.forEach((s, i) => {
          const y = by + i * Math.min(36, (sz - 12) / 4);
          c.fillStyle = s[2]; c.globalAlpha = 0.85; c.fillRect(bx, y + 14, Math.max(1, bw * s[1] / mx * 0.8), 10); c.globalAlpha = 1;
          kit.label(c, s[0] + '   ' + (s[1] < 10 ? s[1].toFixed(2) : fmtInt(s[1])) + ' e⁻', bx, y + 6, { color: C.text, size: 11 });
        });
        // the curve
        const xs = []; for (let k = 0; k <= 56; k++) xs.push(Math.pow(10, k / 8));
        const snrAt = N => { const q = sigmaOf(N, true); return q.S0 > 0 ? q.S0 / q.total : 0; };
        const ideal = N => Math.sqrt(N * V.qe / 100 * n);
        plot.set({
          series: [{ pts: xs.map(N => [N, Math.max(0.05, ideal(N))]), label: 'ideal: shot noise only', color: C.faint, dash: true, width: 1.6 }, { pts: xs.map(N => [N, Math.max(0.05, snrAt(N))]), label: 'this sensor', color: C.accent, width: 2.6 }],
          marks: [{ x: V.ph, y: Math.max(0.05, snrAt(V.ph)), color: C.warn, label: 'now' }]
        });
        const q = sigmaOf(V.ph, true), sn = O.cam.snr({ photons: V.ph, qe: V.qe / 100, read: V.read, dark: V.dark * Math.pow(2, (V.temp - 25) / 7), t: V.texp });
        const tot = snrAt(V.ph);
        ro.set('sig', fmtInt(q.S0) + ' e⁻');
        ro.set('shot', Math.sqrt(q.S0).toFixed(1) + ' e⁻');
        ro.set('dk', D.toFixed(D < 10 ? 2 : 0) + ' e⁻ → ' + Math.sqrt(D).toFixed(2) + ' e⁻ of noise');
        ro.set('rd', V.read.toFixed(1) + ' e⁻');
        ro.set('pr', (V.prnu / 100 * q.S0).toFixed(1) + ' e⁻');
        ro.set('snr', tot.toFixed(tot < 10 ? 2 : 1) + '  (' + (20 * Math.log10(Math.max(tot, 1e-9))).toFixed(1) + ' dB)' + (n > 1 ? ', ' + n + ' frames averaged' : ''));
        ro.set('one', sn.snr.toFixed(sn.snr < 10 ? 2 : 1) + ' (one frame, random noise only)');
        const big = srcs.reduce((a, b) => b[1] > a[1] ? b : a);
        ro.set('who', big[0]);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ dynamic range */
  Hyper.sim('is-dynamic-range', {
    title: 'Dynamic range: what a sensor records of a 20-stop scene',
    blurb: `A scene whose brightness rises by a factor of a million (20 stops) from left to right, recorded by a sensor with a given full well, read noise and ADC. Top strip: the scene. Middle strip: the recorded signal on a logarithmic scale: speckle at the left is the read noise swamping the signal, the flat white at the right is the full well clipping. Bottom strip: what a normal (linear, gamma-encoded) display would show after the ADC. The graph is the signal-to-noise ratio of each part of the scene.

**Try this**
- Use the defaults (20 000 e⁻, 2.5 e⁻, 12 bits): 13 stops are recorded between the noise floor and the clip. Shift the **exposure** up and down to slide that 13-stop window along the 20-stop scene: you choose which stops to lose.
- Lower the **bits** to 8: the bottom strip posterizes, and the "electrons per level" read-out passes the read noise: the ADC is now the limit.
- Raise the read noise to 20 e⁻: the window loses 3 stops at the dark end.
- Switch on an **HDR** mode: the top of the window rises by the factor (3, 4 or 8 stops) while the shadows keep their low noise; the graph shows the dip in SNR where the second measurement takes over.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190, maxH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'scene brightness (stops above the dimmest part)', min: 0, max: 20 }, y: { label: 'signal-to-noise ratio', min: 0.1, max: 1000, log: true }, legend: true, series: [] }, 230);
      const ctl = kit.controls(box.side, [
        { id: 'FW', label: 'Full-well capacity', min: 1000, max: 200000, log: true, sig: 2, value: params.FW || 20000, unit: ' e⁻' },
        { id: 'read', label: 'Read noise', min: 0.5, max: 30, log: true, sig: 2, value: params.read || 2.5, unit: ' e⁻' },
        { id: 'bits', label: 'Bits of the ADC', min: 8, max: 16, step: 1, value: 12 },
        { id: 'exp', label: 'Exposure', min: -4, max: 4, step: 0.5, value: 0, unit: ' stops' },
        { id: 'hdr', type: 'select', label: 'HDR mode', options: [['None: one exposure', 1], ['Dual conversion gain: top × 8', 8], ['Two exposures, 16 : 1', 16], ['Four exposures, 256 : 1', 256]], value: 1 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dr', 'Dynamic range, one exposure'], ['hdr', 'With the HDR mode'], ['win', 'Window of the scene recorded'], ['snr', 'Best SNR (at the full well)'], ['k', 'Electrons per ADC level'], ['adc', 'Is the ADC the limit?']]);
      const X0 = -2;                                                       // the dimmest part of the scene is 2^X0 electrons at zero exposure
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const F = V.hdr, FWe = V.FW * F, levels = Math.pow(2, V.bits) - 1;
        const sx = 24, sw = W - 48, sh = Math.min(30, (Hh - 60) / 3);
        const NXs = Math.max(40, Math.round(sw / 4)), NYs = 6;
        const Sat = x => Math.pow(2, x + X0 + V.exp);                      // scene electrons at brightness x (stops)
        const r = rng(99);
        // the noisy measurement of the scene at brightness x
        const measure = x => {
          const s = Sat(x);
          if (s <= V.FW || F === 1) return clamp(s + Math.sqrt(s + V.read * V.read) * gauss(r), 0, V.FW);
          const sh2 = s / F; return clamp(s + F * Math.sqrt(sh2 + V.read * V.read) * gauss(r), 0, FWe);
        };
        const rows = [];
        for (let j = 0; j < NYs; j++) { const row = []; for (let i = 0; i < NXs; i++) row.push(measure(20 * (i + 0.5) / NXs)); rows.push(row); }
        const at = (j, u) => rows[Math.min(NYs - 1, Math.floor(j))][Math.min(NXs - 1, Math.floor(u * NXs))];
        const y1 = 26, y2 = y1 + sh + 22, y3 = y2 + sh + 22;
        kit.label(c, 'the scene: 20 stops, each step to the right is twice as bright', sx, y1 - 10, { color: C.muted, size: 11.5 });
        S.image(c, sx, y1, sw, sh, NXs, 1, u => u, { smooth: false });
        kit.label(c, 'as recorded, on a log scale: noise at the dark end, clipping at the bright end', sx, y2 - 10, { color: C.muted, size: 11.5 });
        S.image(c, sx, y2, sw, sh, NXs, NYs, (u, v) => clamp((Math.log2(Math.max(at(v * NYs, u), 0.25)) + 2) / 20, 0, 1), { smooth: false });
        kit.label(c, 'after the ADC, on a normal screen (linear, gamma-encoded)', sx, y3 - 10, { color: C.muted, size: 11.5 });
        S.image(c, sx, y3, sw, sh, NXs, NYs, (u, v) => Math.pow(Math.round(clamp(at(v * NYs, u) / FWe, 0, 1) * levels) / levels, 1 / 2.2), { smooth: false });
        for (const y of [y1, y2, y3]) { c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(sx, y, sw, sh); }
        // the window between the noise floor and saturation
        const xf = Math.log2(Math.max(V.read, 1e-6)) - X0 - V.exp, xs = Math.log2(FWe) - X0 - V.exp;
        const px = x => sx + sw * clamp(x / 20, 0, 1);
        c.strokeStyle = C.warn; c.lineWidth = 2;
        c.beginPath(); c.moveTo(px(xf), y2 + sh + 3); c.lineTo(px(xf), y2 - 3); c.moveTo(px(xs), y2 + sh + 3); c.lineTo(px(xs), y2 - 3); c.stroke();
        if (xf < 20 && xs > 0) { c.fillStyle = C.warn; c.globalAlpha = 0.18; c.fillRect(px(xf), y2, px(xs) - px(xf), sh); c.globalAlpha = 1; }
        kit.label(c, 'read noise', px(xf) + 3, y2 + sh + 11, { color: C.warn, size: 10.5 });
        kit.label(c, 'full well', px(xs) - 3, y2 + sh + 11, { align: 'right', color: C.warn, size: 10.5 });
        // the graph
        const xs0 = []; for (let k = 0; k <= 160; k++) xs0.push(k / 8);
        const snrAt = x => {
          const s = Sat(x);
          if (s <= V.FW) return s / Math.sqrt(s + V.read * V.read);
          if (F === 1 || s > FWe) return NaN;
          const q = s / F; return q / Math.sqrt(q + V.read * V.read);
        };
        const pts = xs0.map(x => [x, snrAt(x)]).filter(p => Number.isFinite(p[1]) && p[1] > 0.1);
        plot.set({ series: [{ pts, label: 'SNR of the recording', color: C.accent, width: 2.6 }], vlines: [{ x: clamp(xf, 0, 20), label: 'SNR ≈ 1' }, { x: clamp(xs, 0, 20), label: 'clips' }], hlines: [{ y: 1, label: 'SNR = 1' }] });
        const dr = O.cam.dynamicRange(V.FW, V.read), drh = O.cam.dynamicRange(FWe, V.read);
        const K = V.FW / (levels + 1);
        ro.set('dr', fmtInt(dr.ratio) + ' : 1   (' + dr.db.toFixed(0) + ' dB, ' + dr.stops.toFixed(1) + ' stops)');
        ro.set('hdr', F === 1 ? 'no HDR mode' : fmtInt(drh.ratio) + ' : 1   (' + drh.db.toFixed(0) + ' dB, ' + drh.stops.toFixed(1) + ' stops)');
        ro.set('win', 'brightness ' + clamp(xf, 0, 20).toFixed(1) + ' to ' + clamp(xs, 0, 20).toFixed(1) + ' of 20 stops' + (xs < 20 ? ' — bright end clipped' : '') + (xf > 0 ? ', dark end lost' : ''));
        ro.set('snr', Math.sqrt(V.FW).toFixed(0) + '  (' + (20 * Math.log10(Math.sqrt(V.FW))).toFixed(0) + ' dB)');
        ro.set('k', K.toFixed(2) + ' e⁻ per level of ' + (levels + 1));
        ro.set('adc', K > V.read ? 'yes: a level is bigger than the read noise' : 'no: the noise is bigger than a level');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sensor formats and pixel size */
  Hyper.sim('is-formats', {
    title: 'Sensor formats to scale, and pixel size against the Airy disc',
    blurb: `**Left:** the standard sensor formats drawn to the same scale, one inside another, with the chosen one filled. **Right:** a few pixels of the chosen sensor at the chosen pixel count, with the Airy disc of a perfect lens at the chosen f-number drawn over them. The read-outs give the light a pixel collects in a fixed scene (10 lux on the sensor, 10 ms) and the signal-to-noise ratio that follows.

**Try this**
- Step from 1/2.3" to the "1 inch" format to full frame at 12 megapixels: the pixel grows from 1.5 µm to 3.2 µm to 8.5 µm, the light per pixel by the square of that, the shot-noise SNR by the pitch.
- Keep the format and raise the megapixels: the pixels shrink and the light per pixel falls with their area.
- Open the lens to f/1.4: the Airy disc shrinks below the pixel. Close to f/16: the disc covers many pixels and the extra pixels sample only blur.
- Watch the **Nyquist frequency of the pixels** against the **cut-off of the lens**: when the pixels' limit is higher than the lens's, finer pixels give nothing.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const list = O.cam.SENSORS.filter(s => s.h > 0.5);
      const ctl = kit.controls(box.side, [
        { id: 'fmt', type: 'select', label: 'Sensor format', options: list.map(s => [s.id + '  (' + s.w + ' × ' + s.h + ' mm)', s.id]), value: params.fmt || '1"' },
        { id: 'mp', label: 'Number of pixels', min: 0.3, max: 150, log: true, sig: 2, value: params.mp || 12, unit: ' million' },
        { id: 'N', label: 'f-number of the lens', min: 1, max: 16, log: true, sig: 2, value: params.N || 2.8, fmt: v => 'f/' + kit.fmt(v, 2) }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['size', 'Sensor, width × height'], ['diag', 'Diagonal · crop factor'], ['p', 'Pixel pitch'], ['ph', 'Photons per pixel (10 lux, 10 ms)'], ['snr', 'Best SNR at that exposure (QE 60 %)'], ['nyq', 'Nyquist limit of the pixels'], ['cut', 'Cut-off of the lens'], ['v', 'Verdict']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const sel = O.cam.sensor(V.fmt) || list[0];
        const pitch = Math.sqrt(sel.w * sel.h / (V.mp * 1e6)) * 1e3;                // µm
        // ---- the formats to scale
        const big = list.reduce((a, s) => Math.max(a, s.w), 0), bigH = list.reduce((a, s) => Math.max(a, s.h), 0);
        const area = { x: 16, y: 16, w: W * 0.5 - 24, h: Hh - 32 };
        const k = Math.min(area.w / big, area.h / bigH), cx = area.x + area.w / 2, cy = area.y + area.h / 2;
        for (const s of list) {
          const w = s.w * k, h = s.h * k, on = s.id === sel.id;
          if (on) { c.fillStyle = C.accent; c.globalAlpha = 0.28; c.fillRect(cx - w / 2, cy - h / 2, w, h); c.globalAlpha = 1; }
          c.strokeStyle = on ? C.accent : C.faint; c.lineWidth = on ? 2.4 : 1; c.strokeRect(cx - w / 2, cy - h / 2, w, h);
          if (on || s.w > 9) kit.label(c, s.id, cx + w / 2 - 3, cy - h / 2 + 8, { align: 'right', color: on ? C.accent : C.faint, size: on ? 12 : 10.5, weight: on ? 650 : 500 });
        }
        // ---- pixels against the Airy disc
        const airyD = 2 * O.diff.airyRadius(550, V.N) * 1e6;                       // µm
        const rx = W * 0.52, rw = W - rx - 16, rcy = Hh * 0.46, scale = Math.min(rw / 2, Hh * 0.34) / Math.max(pitch * 1.6, airyD * 0.6);
        kit.label(c, 'pixels and the Airy disc of a perfect lens (550 nm)', rx, 18, { color: C.muted, size: 11.5 });
        const gx = rx + rw / 2, gy = rcy;
        const span = Math.floor((rw / 2) / (pitch * scale)) + 1, ncell = Math.min(span, 9);
        for (let i = -ncell; i <= ncell; i++) for (let j = -ncell; j <= ncell; j++) {
          const x = gx + (i - 0.5) * pitch * scale, y = gy + (j - 0.5) * pitch * scale;
          if (x < rx - 4 || x + pitch * scale > W - 8 || y < 28 || y + pitch * scale > Hh - 50) continue;
          c.fillStyle = C.surface; c.fillRect(x, y, pitch * scale, pitch * scale); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x, y, pitch * scale, pitch * scale);
        }
        c.strokeStyle = C.warn; c.lineWidth = 2.2; c.beginPath(); c.arc(gx, gy, Math.max(1, airyD * scale / 2), 0, TAU); c.stroke();
        c.fillStyle = C.warn; c.globalAlpha = 0.14; c.beginPath(); c.arc(gx, gy, Math.max(1, airyD * scale / 2), 0, TAU); c.fill(); c.globalAlpha = 1;
        S.dim(c, gx - pitch * scale / 2, gy + Hh * 0.33, gx + pitch * scale / 2, gy + Hh * 0.33, 'pixel ' + pitch.toFixed(2) + ' µm', { off: 12 });
        kit.label(c, 'Airy disc ' + airyD.toFixed(2) + ' µm across (f/' + kit.fmt(V.N, 2) + ')', rx, Hh - 12, { color: C.warn, size: 11.5 });
        // ---- the numbers
        const ph = O.cam.photons({ lux: 10, t: 0.01, pitch });
        const sn = O.cam.snr({ photons: ph, qe: 0.6, read: 2 });
        const nyq = O.mtf.nyquist(pitch), cut = O.mtf.cutoff(550, V.N);
        ro.set('size', sel.w + ' × ' + sel.h + ' mm  (' + (sel.w * sel.h).toFixed(0) + ' mm²)');
        ro.set('diag', sel.diag.toFixed(1) + ' mm · ' + sel.crop.toFixed(2));
        ro.set('p', pitch.toFixed(2) + ' µm  (' + (pitch * pitch).toFixed(1) + ' µm²)');
        ro.set('ph', fmtInt(ph));
        ro.set('snr', sn.snr.toFixed(0) + '  (' + sn.db.toFixed(0) + ' dB)');
        ro.set('nyq', nyq.toFixed(0) + ' lp/mm');
        ro.set('cut', cut.toFixed(0) + ' lp/mm');
        ro.set('v', nyq > cut ? 'the pixels oversample the lens: finer pixels add nothing' : 'the pixels are the limit: the lens could supply more');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ colour filter array */
  Hyper.sim('is-bayer', {
    title: 'A Bayer sensor: the mosaic, demosaicing and false colour',
    blurb: `A 48 × 48 pixel sensor looks at a neutral (black-and-white) pattern. **Left:** the scene. **Middle:** what the sensor really records, one colour per pixel (the Bayer mosaic of red, green, green, blue). **Right:** the full-colour picture reconstructed by demosaicing. The pattern is grey; any colour in the right panel is false colour. The sampling limit is 0.5 cycles per pixel for green and the pixel grid, 0.25 for red and blue.

**Try this**
- Zone plate or stripes, detail 0.15 cycles per pixel: the reconstruction is clean. Raise the detail past 0.25: coloured bands appear (red and blue are aliased) while the luminance is still fine; beyond 0.5 it aliases outright.
- Compare **nearest**, **bilinear** and **edge-directed** demosaicing: the cleverer methods cut the false colour but cannot remove it.
- Tick the **optical low-pass filter**: the scene is blurred by about a pixel before it is sampled. The false colour vanishes and so does the finest detail.
- Choose the *coloured edges* scene to see the zipper along sharp colour borders.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const NP = 48;
      const ctl = kit.controls(box.side, [
        { id: 'scene', type: 'select', label: 'Scene (all neutral except the last)', options: [['Stripes at a slant', 'stripes'], ['Zone plate (rising frequency)', 'zone'], ['Siemens star', 'star'], ['Coloured edges and a grid', 'colour']], value: params.scene || 'zone' },
        { id: 'f', label: 'Detail (stripes and zone plate)', min: 0.05, max: 0.9, step: 0.01, value: params.f || 0.3, unit: ' cycles/pixel' },
        { id: 'dm', type: 'select', label: 'Demosaicing', options: [['Nearest (copy within each 2 × 2 block)', 'near'], ['Bilinear', 'bilin'], ['Edge-directed (green first)', 'edge']], value: params.dm || 'bilin' },
        { id: 'olpf', type: 'check', label: 'Optical low-pass filter (blur by one pixel)', value: !!params.olpf },
        { id: 'pitch', label: 'Pixel pitch of the sensor', min: 1, max: 10, step: 0.05, value: 3.45, unit: ' µm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['nyq', 'Nyquist limit: pixel grid · red and blue'], ['det', 'Detail of the scene'], ['err', 'False colour (rms chroma error)'], ['plate', 'Quartz plate for a one-pixel split']]);
      // the scene: colours 0…1 at (x, y) in pixel units
      const scene = (x, y) => {
        const u = x / NP, v = y / NP;
        let g;
        switch (V.scene) {
          case 'stripes': { const t = V.f * (x * Math.cos(0.26) + y * Math.sin(0.26)); g = (t - Math.floor(t)) < 0.5 ? 1 : 0; break; }
          case 'zone': { const rx = (u - 0.5) * NP, ry = (v - 0.5) * NP, kz = V.f / (NP * 0.35); g = 0.5 + 0.5 * Math.cos(Math.PI * 2 * kz * (rx * rx + ry * ry) / 2); break; }
          case 'star': { const a = Math.atan2(v - 0.5, u - 0.5), rr = Math.hypot(u - 0.5, v - 0.5); g = rr < 0.47 ? (Math.sin(a * 18) > 0 ? 1 : 0) : 0.5; break; }
          default: {
            const band = Math.floor(u * 6);
            const base = [[0.9, 0.15, 0.15], [0.15, 0.8, 0.2], [0.2, 0.3, 0.95], [0.95, 0.85, 0.15], [0.1, 0.1, 0.1], [0.95, 0.95, 0.95]][Math.min(5, band)];
            const line = (Math.floor(x) % 4 === 0) || (Math.floor(y) % 4 === 0);
            return v > 0.55 && line ? [0.05, 0.05, 0.05] : base;
          }
        }
        return [g, g, g];
      };
      // what one pixel records: the scene averaged over its aperture (3 × 3 points), with the low-pass filter averaged over four shifted copies
      const pix = (i, j) => {
        const sh = V.olpf ? [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]] : [[0, 0]];
        let r = 0, g = 0, b = 0, n = 0;
        for (const [dx, dy] of sh) for (let a = 0; a < 3; a++) for (let q = 0; q < 3; q++) { const c = scene(i + (a + 0.5) / 3 + dx, j + (q + 0.5) / 3 + dy); r += c[0]; g += c[1]; b += c[2]; n++; }
        return [r / n, g / n, b / n];
      };
      const chan = (i, j) => (j % 2 === 0) ? (i % 2 === 0 ? 0 : 1) : (i % 2 === 0 ? 1 : 2);   // 0 red, 1 green, 2 blue: RGGB
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // the sensor: a mosaic of single values, and the true picture for the error
        const full = [], mos = [];
        for (let j = 0; j < NP; j++) { const rf = [], rm = []; for (let i = 0; i < NP; i++) { const p = pix(i, j); rf.push(p); rm.push(p[chan(i, j)]); } full.push(rf); mos.push(rm); }
        const M = (i, j) => mos[clamp(j, 0, NP - 1)][clamp(i, 0, NP - 1)];
        const out = [];
        for (let j = 0; j < NP; j++) out.push(new Array(NP));
        if (V.dm === 'near') {
          for (let j = 0; j < NP; j++) for (let i = 0; i < NP; i++) {
            const i0 = i - (i % 2), j0 = j - (j % 2);
            out[j][i] = [M(i0, j0), 0.5 * (M(i0 + 1, j0) + M(i0, j0 + 1)), M(i0 + 1, j0 + 1)];
          }
        } else {
          // green at every pixel
          const G = [];
          for (let j = 0; j < NP; j++) { const row = []; for (let i = 0; i < NP; i++) {
            if (chan(i, j) === 1) { row.push(M(i, j)); continue; }
            const l = M(i - 1, j), rr = M(i + 1, j), u = M(i, j - 1), d = M(i, j + 1);
            if (V.dm === 'bilin') row.push((l + rr + u + d) / 4);
            else {
              const here = M(i, j), dh = Math.abs(l - rr) + Math.abs(2 * here - M(i - 2, j) - M(i + 2, j)), dv = Math.abs(u - d) + Math.abs(2 * here - M(i, j - 2) - M(i, j + 2));
              row.push(dh < dv ? (l + rr) / 2 + (2 * here - M(i - 2, j) - M(i + 2, j)) / 4 : dh > dv ? (u + d) / 2 + (2 * here - M(i, j - 2) - M(i, j + 2)) / 4 : (l + rr + u + d) / 4);
            }
          } G.push(row); }
          const Gx = (i, j) => G[clamp(j, 0, NP - 1)][clamp(i, 0, NP - 1)];
          // red and blue from the colour differences (C − G), averaged from the nearest samples of that colour
          const diff = (i, j, want) => {                                   // (C − G) at (i, j) for C = want (0 red, 2 blue)
            if (chan(i, j) === want) return M(i, j) - Gx(i, j);
            let s = 0, n = 0;
            const nb = chan(i, j) === 1 ? [[-1, 0], [1, 0], [0, -1], [0, 1]] : [[-1, -1], [1, -1], [-1, 1], [1, 1]];
            for (const [dx, dy] of nb) { const ii = i + dx, jj = j + dy; if (ii >= 0 && ii < NP && jj >= 0 && jj < NP && chan(ii, jj) === want) { s += M(ii, jj) - Gx(ii, jj); n++; } }
            return n ? s / n : 0;
          };
          for (let j = 0; j < NP; j++) for (let i = 0; i < NP; i++) {
            const g = Gx(i, j);
            // at a green pixel the red and blue neighbours lie on the two sides; average all four neighbours in the Bayer sense
            let rd, bd;
            if (chan(i, j) === 1) {
              const rowRed = (j % 2 === 0);                                // green in a red row has red left and right, blue above and below
              const hs = (want) => { let s = 0, n = 0; for (const [dx, dy] of [[-1, 0], [1, 0]]) { const ii = i + dx; if (ii >= 0 && ii < NP && chan(ii, j) === want) { s += M(ii, j) - Gx(ii, j); n++; } } return n ? s / n : 0; };
              const vs = (want) => { let s = 0, n = 0; for (const [dx, dy] of [[0, -1], [0, 1]]) { const jj = j + dy; if (jj >= 0 && jj < NP && chan(i, jj) === want) { s += M(i, jj) - Gx(i, jj); n++; } } return n ? s / n : 0; };
              rd = rowRed ? hs(0) : vs(0); bd = rowRed ? vs(2) : hs(2);
            } else { rd = diff(i, j, 0); bd = diff(i, j, 2); }
            out[j][i] = [g + rd, g, g + bd];
          }
        }
        // the three pictures
        const sz = Math.min((W - 80) / 3, Hh - 70), gap = 20, y0 = 40, x1 = 16, x2 = x1 + sz + gap, x3 = x2 + sz + gap;
        S.image(c, x1, y0, sz, sz, 192, 192, (u, v) => { const p = scene(u * NP, v * NP); return [255 * p[0], 255 * p[1], 255 * p[2]]; }, { smooth: false });
        S.image(c, x2, y0, sz, sz, NP, NP, (u, v) => {
          const i = Math.min(NP - 1, Math.floor(u * NP)), j = Math.min(NP - 1, Math.floor(v * NP)), k = chan(i, j), a = 255 * clamp(mos[j][i], 0, 1);
          return k === 0 ? [a, 0, 0] : k === 1 ? [0, a, 0] : [0, 0, a];
        }, { smooth: false });
        S.image(c, x3, y0, sz, sz, NP, NP, (u, v) => { const p = out[Math.min(NP - 1, Math.floor(v * NP))][Math.min(NP - 1, Math.floor(u * NP))]; return [255 * clamp(p[0], 0, 1), 255 * clamp(p[1], 0, 1), 255 * clamp(p[2], 0, 1)]; }, { smooth: false });
        for (const x of [x1, x2, x3]) { c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x, y0, sz, sz); }
        kit.label(c, 'the scene', x1, y0 - 12, { color: C.muted, size: 11.5 });
        kit.label(c, 'the mosaic the sensor records', x2, y0 - 12, { color: C.muted, size: 11.5 });
        kit.label(c, 'after demosaicing', x3, y0 - 12, { color: C.muted, size: 11.5 });
        // the error: chroma (R − G, B − G) against the true pixel values
        let e2 = 0;
        for (let j = 0; j < NP; j++) for (let i = 0; i < NP; i++) { const a = out[j][i], t = full[j][i]; e2 += Math.pow((a[0] - a[1]) - (t[0] - t[1]), 2) + Math.pow((a[2] - a[1]) - (t[2] - t[1]), 2); }
        const err = Math.sqrt(e2 / (2 * NP * NP));
        const no = O.index('quartz-o', 550), ne = O.index('quartz-e', 550), rho = Math.atan((no * no - ne * ne) / (no * no + ne * ne));
        ro.set('nyq', O.mtf.nyquist(V.pitch).toFixed(0) + ' lp/mm · ' + (O.mtf.nyquist(V.pitch) / 2).toFixed(0) + ' lp/mm');
        const fs = V.scene === 'colour' ? '—' : V.scene === 'star' ? 'rises towards the centre' : V.f.toFixed(2) + ' cycles/pixel = ' + (V.f / (V.pitch * 1e-3)).toFixed(0) + ' lp/mm' + (V.scene === 'zone' ? ' at the edge' : '');
        ro.set('det', fs);
        ro.set('err', (100 * err).toFixed(1) + ' % of full scale');
        ro.set('plate', (V.pitch * 1e-3 / Math.tan(Math.abs(rho))).toFixed(2) + ' mm (walk-off ' + (Math.abs(rho) * 180 / Math.PI).toFixed(2) + '°)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ microlens, BSI */
  Hyper.sim('is-microlens', {
    title: 'A pixel in section: microlens, chief ray angle, front and back illumination',
    blurb: `A cross-section of three pixels (1.4 µm pitch) with nine rays entering the middle one at the chief ray angle. A ray that reaches the photodiode is drawn in colour; a ray lost on the metal walls or into a neighbour is drawn dashed. The rays are traced through the microlens surface with the lens engine; the pixel is a one-dimensional cut, so the numbers are fractions of a width, not of an area (the area fractions of a real pixel are the squares). Geometric optics: at 1.4 µm diffraction blurs the focus, so real gains are smaller.

**Try this**
- Front-illuminated, no microlens, angle 0°: only the photodiode opening (55 % of the width) collects light; the rest hits metal. Tick **Microlens**: nearly every ray is gathered.
- Raise the **chief ray angle** to 15°: in the front-illuminated pixel the focus slides off the photodiode and the rays strike the walls of the deep wiring tunnel. Tick **shifted for the chief ray angle**: it helps a little, but a tunnel this deep and narrow is simply closed to light at an angle. Reduce the **height of the stack** to 1.5 µm and it opens again.
- Switch to **back-illuminated**: the diode is only 2 µm below the lens and the wiring is out of the way. At 30° the response has collapsed, until you tick **shifted**: then it stays above 80 % even at 40°.
- Change the **strength** of the microlens: at 1 it focuses on the photodiode; weaker or stronger and the spot spreads.`,
    mount(box, kit, params) {
      const O = kit.optics, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 340 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'chief ray angle (degrees)', min: 0, max: 40 }, y: { label: 'rays reaching the photodiode (%)', min: 0, max: 100 }, legend: true, series: [] }, 210);
      const ctl = kit.controls(box.side, [
        { id: 'illum', type: 'select', label: 'Illumination', options: [['Front-illuminated (wiring above)', 'fsi'], ['Back-illuminated (wiring below)', 'bsi']], value: params.illum || 'fsi' },
        { id: 'ml', type: 'check', label: 'Microlens', value: params.ml != null ? !!params.ml : true },
        { id: 'shift', type: 'check', label: 'Microlens shifted for the chief ray angle', value: !!params.shift },
        { id: 'cra', label: 'Chief ray angle', min: 0, max: 40, step: 1, value: params.cra != null ? params.cra : 20, unit: '°' },
        { id: 'stack', label: 'Height of the wiring stack (front-illuminated)', min: 1.5, max: 5, step: 0.1, value: 3.5, unit: ' µm' },
        { id: 'curv', label: 'Strength of the microlens (1 focuses on the photodiode)', min: 0.6, max: 1.6, step: 0.05, value: 1 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eff', 'Rays reaching the photodiode'], ['eff0', 'The same pixel at 0°'], ['nolens', 'Without the microlens, at this angle'], ['gain', 'Gain from the microlens'], ['open', 'Opening ÷ pixel pitch'], ['focus', 'Focus of the lens · depth of the photodiode']]);
      const P = 1.4, NL = 1.6, NS = 1.45, TL = 0.5, FLAT = 1.6, D2R = Math.PI / 180;
      const geo = cfg => {
        const fsi = cfg.illum === 'fsi', zStack = TL + FLAT, zPD = zStack + (fsi ? cfg.stack : 0);
        const R = Math.max(0.8, (NL - 1) * ((zPD - TL) / NS + TL / NL) * cfg.curv);
        return { fsi, zStack, zPD, open: fsi ? 0.55 * P : 0.9 * P, R };
      };
      // one ray, entering the lens aperture at height u (relative to the lens centre) with the chief-ray angle th
      const ray = (cfg, th, u) => {
        const g = geo(cfg), ths = Math.asin(Math.sin(th) / NS), tt = Math.tan(th);
        const off = cfg.ml && cfg.shift ? -g.zPD * Math.tan(ths) : 0;     // the lens is moved towards the centre of the sensor
        let pts, yS, yP;
        if (cfg.ml) {
          const sys = { surfaces: [{ R: g.R, t: TL, n: NL, sd: P / 2 }, { R: 0, t: 0, n: NS, sd: P / 2 }], object: Infinity };
          const tr = Sy.trace(sys, { p: [0, u - tt, -1], d: [0, Math.sin(th), Math.cos(th)] }, 550);
          if (!tr.ok) return { pass: false, pts: [[u + off - tt, -1], [u + off, 0]] };
          const a = Sy.at(tr, g.zStack), b = Sy.at(tr, g.zPD);
          pts = tr.pts.map(q => [q[1] + off, q[2]]); pts.push([b[1] + off, g.zPD]); yS = a[1] + off; yP = b[1] + off;
        } else {
          yS = u + g.zStack * Math.tan(ths); yP = u + g.zPD * Math.tan(ths);
          pts = [[u - tt, -1], [u, 0], [yP, g.zPD]];
        }
        const h = g.open / 2;
        const pass = g.fsi ? Math.abs(yS) <= h && Math.abs(yP) <= h : Math.abs(yP) <= h;
        if (!pass && g.fsi) {                                              // stop the ray at the wall it strikes
          const last = pts[pts.length - 1], z0 = g.zStack;
          if (Math.abs(yS) > h) { pts = pts.filter(q => q[1] < z0); pts.push([yS, z0]); }
          else { const wall = yP > 0 ? h : -h, f = (wall - yS) / (yP - yS); pts = pts.filter(q => q[1] < z0); pts.push([yS, z0]); pts.push([wall, z0 + f * (g.zPD - z0)]); void last; }
        }
        return { pass, pts };
      };
      const eff = (cfg, deg) => { const N = 41; let ok = 0; for (let i = 0; i < N; i++) if (ray(cfg, deg * D2R, -P / 2 + P * (i + 0.5) / N).pass) ok++; return ok / N; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const cfg = { illum: V.illum, ml: V.ml, shift: V.shift, stack: V.stack, curv: V.curv }, g = geo(cfg);
        const s = Math.min((Hh - 36) / (g.zPD + 3.4), (W * 0.56) / (3 * P)), cx = 18 + 1.5 * P * s, top = 26;
        const X = y => cx + y * s, Z = z => top + (z + 1.1) * s;
        const th = V.cra * D2R, ths = Math.asin(Math.sin(th) / NS), off = V.ml && V.shift ? -g.zPD * Math.tan(ths) : 0;
        // silicon, filter, stack
        const zSi = g.fsi ? g.zPD - 0.1 : g.zStack - 0.1, xl = X(-1.5 * P), wAll = 3 * P * s;
        c.fillStyle = C.dark ? 'rgba(120,130,170,0.28)' : 'rgba(120,130,170,0.25)'; c.fillRect(xl, Z(zSi), wAll, Hh - Z(zSi) - 6);
        c.fillStyle = C.dark ? 'rgba(110,200,140,0.35)' : 'rgba(80,170,110,0.35)'; c.fillRect(xl, Z(TL), wAll, 0.6 * s);
        if (g.fsi) {
          for (let i = -1; i <= 1; i++) { const x0 = X(i * P);
            c.fillStyle = C.dark ? '#7e87a8' : '#7a8296';
            c.fillRect(x0 - P * s / 2, Z(g.zStack), (P - g.open) * s / 2, (g.zPD - g.zStack) * s); c.fillRect(x0 + g.open * s / 2, Z(g.zStack), (P - g.open) * s / 2, (g.zPD - g.zStack) * s);
          }
          kit.label(c, 'wiring and transistors', X(1.5 * P) + 8, Z((g.zStack + g.zPD) / 2), { color: C.muted, size: 11 });
        } else {
          c.strokeStyle = C.muted; c.lineWidth = 2;
          for (let i = -1; i <= 2; i++) { const x0 = X((i - 0.5) * P); c.beginPath(); c.moveTo(x0, Z(zSi)); c.lineTo(x0, Z(g.zPD + 2.3)); c.stroke(); }
          c.fillStyle = C.dark ? '#7e87a8' : '#7a8296'; c.fillRect(xl, Z(g.zPD + 2.4), wAll, 0.5 * s);
          kit.label(c, 'wiring, behind the photodiode', X(1.5 * P) + 8, Z(g.zPD + 2.65), { color: C.muted, size: 11 });
          kit.label(c, 'deep trench isolation', X(1.5 * P) + 8, Z(g.zPD + 1.4), { color: C.muted, size: 11 });
        }
        for (let i = -1; i <= 1; i++) {
          const x0 = X(i * P), phh = 1.5 * s;
          c.fillStyle = C.accent; c.globalAlpha = 0.4; c.fillRect(x0 - g.open * s / 2, Z(g.zPD), g.open * s, phh); c.globalAlpha = 1;
          c.strokeStyle = C.accent; c.lineWidth = 1.4; c.strokeRect(x0 - g.open * s / 2, Z(g.zPD), g.open * s, phh);
          if (V.ml) {
            c.fillStyle = C.dark ? 'rgba(160,210,255,0.35)' : 'rgba(70,140,220,0.32)'; c.strokeStyle = C.dark ? 'rgba(170,210,255,0.95)' : 'rgba(40,90,170,0.95)'; c.lineWidth = 1.3;
            c.beginPath(); const sd = P / 2 * 0.98;
            for (let k = -20; k <= 20; k++) { const u = sd * k / 20, z = g.R - Math.sqrt(Math.max(0, g.R * g.R - u * u)); const px = X(i * P + off + u), pz = Z(z); if (k === -20) c.moveTo(px, pz); else c.lineTo(px, pz); }
            c.lineTo(X(i * P + off + sd), Z(TL)); c.lineTo(X(i * P + off - sd), Z(TL)); c.closePath(); c.fill(); c.stroke();
          }
        }
        kit.label(c, 'photodiode', X(-1.5 * P) + 4, Z(g.zPD) + 0.75 * s, { color: C.accent, size: 11 });
        kit.label(c, V.ml ? 'microlens' : 'no microlens', X(1.5 * P) + 8, Z(0.2), { color: C.muted, size: 11 });
        kit.label(c, 'colour filter', X(1.5 * P) + 8, Z(TL + 0.3), { color: C.muted, size: 11 });
        // the rays through the middle pixel
        const NR9 = 9;
        for (let i = 0; i < NR9; i++) {
          const u = -P / 2 + P * (i + 0.5) / NR9, r = ray(cfg, th, u), col = kit.osym.nm(550, r.pass ? 1 : 0.8);
          kit.osym.ray(c, r.pts.map(q => [X(q[0]), Z(q[1])]), r.pass ? { color: col, width: 1.6, arrows: false } : { color: C.warn, width: 1.3, dash: [4, 3], arrows: false });
          const e = r.pts[r.pts.length - 1];
          if (!r.pass) { c.strokeStyle = C.warn; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(e[0]) - 3, Z(e[1]) - 3); c.lineTo(X(e[0]) + 3, Z(e[1]) + 3); c.moveTo(X(e[0]) + 3, Z(e[1]) - 3); c.lineTo(X(e[0]) - 3, Z(e[1]) + 3); c.stroke(); }
        }
        kit.label(c, 'chief ray angle ' + V.cra + '°', X(-1.5 * P), 12, { color: C.muted, size: 11.5 });
        // the graph: three designs against the angle
        const angs = []; for (let a = 0; a <= 40; a += 2) angs.push(a);
        const mk = (o) => angs.map(a => [a, 100 * eff(Object.assign({}, cfg, o), a)]);
        const e0 = eff(cfg, V.cra);
        plot.set({
          series: [
            { pts: mk({ illum: 'fsi', ml: false }), label: 'front-illuminated, no microlens', color: C.faint, dash: true, width: 1.8 },
            { pts: mk({ illum: 'fsi', ml: true }), label: 'front-illuminated, microlens', color: C.warn, width: 2.2 },
            { pts: mk({ illum: 'bsi', ml: true }), label: 'back-illuminated, microlens', color: C.accent, width: 2.2 }
          ],
          marks: [{ x: V.cra, y: 100 * e0, color: C.text, label: 'this pixel' }]
        });
        const nol = eff(Object.assign({}, cfg, { ml: false }), V.cra), e00 = eff(cfg, 0);
        const sys0 = { surfaces: [{ R: g.R, t: TL, n: NL, sd: P / 2 }, { R: 0, t: 0, n: NS, sd: P / 2 }], object: Infinity };
        const zf = Sy.paraxial(sys0, 550).zImage;
        ro.set('eff', (100 * e0).toFixed(0) + ' % of the pixel width');
        ro.set('eff0', (100 * e00).toFixed(0) + ' %');
        ro.set('nolens', (100 * nol).toFixed(0) + ' %');
        ro.set('gain', nol > 0.005 ? (e0 / nol).toFixed(2) + ' ×' : e0 > 0 ? 'the lens is the only way in' : 'none: no ray gets through');
        ro.set('open', (100 * g.open / P).toFixed(0) + ' %  (a width; the area ratio is the square)');
        ro.set('focus', V.ml ? zf.toFixed(1) + ' µm · ' + g.zPD.toFixed(1) + ' µm' : 'no lens');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ binning and the area of interest */
  Hyper.sim('is-binning', {
    title: 'Binning and the area of interest: light, pixels and frame rate',
    blurb: `A dim test picture on a 5-megapixel sensor (2448 × 2048, 14 µs per row, 8 bits). **Left:** the sensor at full resolution; the outline is the area of interest. **Right:** what the camera sends, with the chosen binning. The numbers give the pixels sent, the frame rate the sensor and the interface allow, and the signal-to-noise ratio of a bright pixel. In this simulation AOI is the *area of interest* (also called ROI): a window of the sensor that is read out.

**Try this**
- 2 × 2 binning in the charge domain at 100 photons per pixel: the picture clears and the SNR rises by nearly 4. Switch to *digital summing*: it is still better than nothing, but less, because the read noise is paid four times.
- Raise the light to 10 000 photons: the read noise no longer matters and binning gains only 2. Use *skipping* instead: no gain at all, and fine stripes alias.
- Shrink the **height** of the AOI to 25 %: the sensor's frame rate rises four-fold, until the interface becomes the limit. Choose a faster interface.
- Note that digital summing saves data but no read-out time; charge binning and skipping save both.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 330 });
      const SW = 2448, SH = 2048, TROW = 14e-6, T0 = 100e-6, BITS = 8, GX = 64, GY = 48;
      const ctl = kit.controls(box.side, [
        { id: 'b', type: 'select', label: 'Binning', options: [['1 × 1 (none)', 1], ['2 × 2', 2], ['3 × 3', 3], ['4 × 4', 4]], value: params.b || 2 },
        { id: 'mode', type: 'select', label: 'How the pixels are combined', options: [['Charge-domain binning (read noise paid once)', 'charge'], ['Digital summing (read noise paid per pixel)', 'digital'], ['Skipping: read every n-th pixel', 'skip']], value: params.mode || 'charge' },
        { id: 'aw', label: 'Width of the area of interest', min: 10, max: 100, step: 5, value: 100, unit: ' %' },
        { id: 'ah', label: 'Height of the area of interest', min: 10, max: 100, step: 5, value: params.ah || 100, unit: ' %' },
        { id: 'ph', label: 'Photons per pixel (brightest part)', min: 20, max: 20000, log: true, sig: 2, value: 100 },
        { id: 'read', label: 'Read noise', min: 1, max: 20, log: true, sig: 2, value: 5, unit: ' e⁻' },
        { id: 'link', type: 'select', label: 'Camera interface', options: [['Gigabit Ethernet (about 0.9 Gbit/s usable)', 0.9e9], ['USB 3 (about 3.2 Gbit/s)', 3.2e9], ['CoaXPress (12.5 Gbit/s)', 12.5e9]], value: 3.2e9 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['aoi', 'Window read'], ['px', 'Pixels sent per frame'], ['sens', 'Frame rate the sensor allows'], ['lnk', 'Frame rate the interface allows'], ['fps', 'Frame rate you get'], ['rate', 'Data rate'], ['snr', 'SNR of a bright pixel'], ['gain', 'Compared with no binning']]);
      const scene = (u, v) => {
        let s = 0.18 + 0.3 * v;
        if (Math.hypot(u - 0.3, (v - 0.42) * 0.8) < 0.16) s = 1;
        if (Math.hypot(u - 0.72, (v - 0.35) * 0.8) < 0.09) s = 0.65;
        if (u > 0.52 && u < 0.94 && v > 0.62 && v < 0.92) s = (Math.floor((u - 0.52) / 0.035) % 2) ? 0.12 : 0.9;
        return s;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const b = V.b, n = b * b, S0 = V.ph * 0.6;
        const w = Math.max(1, Math.round(SW * V.aw / 100)), h = Math.max(1, Math.round(SH * V.ah / 100));
        const wb = b > 1 ? Math.max(1, Math.floor(w / b)) : w, hb = b > 1 ? Math.max(1, Math.floor(h / b)) : h;
        const rowsRead = V.mode === 'digital' ? h : Math.max(1, Math.ceil(h / b));
        const tFrame = rowsRead * TROW + T0, fSens = 1 / tFrame, bitsFrame = wb * hb * BITS, fLink = V.link / bitsFrame, fps = Math.min(fSens, fLink);
        const rs = rng(31337);
        // ---- left: the full sensor, with the window
        const sz = Math.min(W * 0.42, Hh - 70), px0 = 20, py0 = 36, ph = sz * GY / GX, rx = px0 + sz + 36;
        const gw = Math.max(1, Math.round(GX * V.aw / 100)), gh = Math.max(1, Math.round(GY * V.ah / 100)), gx0 = Math.floor((GX - gw) / 2), gy0 = Math.floor((GY - gh) / 2);
        const full = [];
        for (let j = 0; j < GY; j++) { const row = []; for (let i = 0; i < GX; i++) { const m = scene((i + 0.5) / GX, (j + 0.5) / GY) * S0; row.push(clamp((m + Math.sqrt(m + V.read * V.read) * gauss(rs)) / Math.max(S0, 1e-9), 0, 1)); } full.push(row); }
        S.image(c, px0, py0, sz, ph, GX, GY, (u, v) => Math.pow(full[Math.min(GY - 1, Math.floor(v * GY))][Math.min(GX - 1, Math.floor(u * GX))], 0.7), { smooth: false });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(px0, py0, sz, ph);
        c.fillStyle = C.dark ? 'rgba(8,10,22,0.62)' : 'rgba(255,255,255,0.62)';
        const ax = px0 + sz * gx0 / GX, ay = py0 + ph * gy0 / GY, aw = sz * gw / GX, ah = ph * gh / GY;
        c.fillRect(px0, py0, sz, ay - py0); c.fillRect(px0, ay + ah, sz, py0 + ph - ay - ah); c.fillRect(px0, ay, ax - px0, ah); c.fillRect(ax + aw, ay, px0 + sz - ax - aw, ah);
        c.strokeStyle = C.accent; c.lineWidth = 2; c.strokeRect(ax, ay, aw, ah);
        kit.label(c, 'the sensor at full resolution, with the area of interest', px0, py0 - 12, { color: C.muted, size: 11.5 });
        // ---- right: what is sent
        const nbx = Math.max(1, Math.floor(gw / b)), nby = Math.max(1, Math.floor(gh / b)), rw = Math.min(W - rx - 16, sz * 1.0), rh = rw * (gh / gw);
        const out = [];
        for (let j = 0; j < nby; j++) { const row = []; for (let i = 0; i < nbx; i++) {
          const u = gx0 / GX + (i + 0.5) / nbx * gw / GX, v = gy0 / GY + (j + 0.5) / nby * gh / GY;
          const m = scene(u, v) * S0;
          let val;
          if (V.mode === 'skip' || b === 1) val = m + Math.sqrt(m + V.read * V.read) * gauss(rs);
          else if (V.mode === 'charge') val = n * m + Math.sqrt(n * m + V.read * V.read) * gauss(rs);
          else val = n * m + Math.sqrt(n * m + n * V.read * V.read) * gauss(rs);
          row.push(clamp(val / (V.mode === 'skip' || b === 1 ? Math.max(S0, 1e-9) : Math.max(n * S0, 1e-9)), 0, 1));
        } out.push(row); }
        S.image(c, rx, py0, rw, rh, nbx, nby, (u, v) => Math.pow(out[Math.min(nby - 1, Math.floor(v * nby))][Math.min(nbx - 1, Math.floor(u * nbx))], 0.7), { smooth: false });
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.strokeRect(rx, py0, rw, rh);
        kit.label(c, 'what the camera sends: ' + wb + ' × ' + hb + ' pixels', rx, py0 - 12, { color: C.muted, size: 11.5 });
        // ---- numbers
        const snrOf = (bb, mode) => { const nn = bb * bb, s = S0; return mode === 'skip' || bb === 1 ? s / Math.sqrt(s + V.read * V.read) : mode === 'charge' ? nn * s / Math.sqrt(nn * s + V.read * V.read) : nn * s / Math.sqrt(nn * s + nn * V.read * V.read); };
        const sn = snrOf(b, V.mode), sn1 = snrOf(1, 'skip');
        const bps = O.cam.dataRate(wb, hb, BITS, fps);
        ro.set('aoi', w + ' × ' + h + ' of ' + SW + ' × ' + SH);
        ro.set('px', fmtInt(wb * hb) + ' (' + (100 * wb * hb / (SW * SH)).toFixed(1) + ' % of the sensor)');
        ro.set('sens', fSens.toFixed(fSens < 100 ? 1 : 0) + ' per s  (' + rowsRead + ' rows read)');
        ro.set('lnk', fLink.toFixed(fLink < 100 ? 1 : 0) + ' per s');
        ro.set('fps', fps.toFixed(fps < 100 ? 1 : 0) + ' per s  (limited by the ' + (fLink < fSens ? 'interface' : 'sensor') + ')');
        ro.set('rate', (bps / 1e6).toFixed(0) + ' Mbit/s');
        ro.set('snr', sn.toFixed(1) + '  (' + (20 * Math.log10(sn)).toFixed(1) + ' dB)');
        ro.set('gain', (sn / sn1).toFixed(2) + ' × the SNR, ' + (n > 1 ? n + ' × the signal' : 'same signal'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ infrared */
  Hyper.sim('is-infrared', {
    title: 'Infrared detectors and a thermal scene',
    blurb: `**Left:** the response bands of the detectors (bars) on a logarithmic wavelength axis, with the emission of the hot object (filled curve, shape only) and of its 293 K surroundings (dashed). The shaded band is the chosen camera. **Right:** the same scene as that camera sees it, with the gain set automatically: a hot object (set its temperature and emissivity), a person at 307 K, and a polished metal plate at 330 K with an emissivity of 0.1.

**Try this**
- Choose the **long-wave microbolometer**: the person and the warm object glow, and the polished plate looks *cool* although it is the hottest thing in the room: it reflects the surroundings.
- Choose **silicon** with the object at 340 K: black. Raise it to 1200 K (a glowing element): now it shows, because the tail of its emission reaches 1 µm.
- Choose the **mid-wave** camera: the contrast per kelvin is higher than in the long-wave band, but there is far less light.
- Lower the object's **emissivity** to 0.1: it fades into the background, whatever its temperature.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 330 });
      const det = id => O.DETECTORS.find(d => d.id === id);
      const BANDS = { si: { name: 'Silicon, visible and near infrared', r: [400, det('silicon').range[1]] }, ingaas: { name: 'InGaAs, short-wave infrared', r: det('ingaas').range.slice() }, mwir: { name: 'Cooled InSb or MCT, mid-wave', r: [3000, 5000] }, lwir: { name: 'Microbolometer, long-wave', r: [8000, det('bolometer').range[1]] } };
      const ctl = kit.controls(box.side, [
        { id: 'band', type: 'select', label: 'Camera', options: [['Silicon, 0.4 to 1.1 µm', 'si'], ['InGaAs, 0.9 to 1.7 µm (short-wave)', 'ingaas'], ['Cooled InSb or MCT, 3 to 5 µm (mid-wave)', 'mwir'], ['Microbolometer, 8 to 14 µm (long-wave)', 'lwir']], value: params.band || 'lwir' },
        { id: 'T', label: 'Temperature of the hot object', min: 280, max: 1500, log: true, sig: 3, value: params.T || 340, unit: ' K' },
        { id: 'eps', label: 'Emissivity of the hot object', min: 0.05, max: 1, step: 0.01, value: 0.95 },
        { id: 'netd', label: 'NETD of the camera', min: 10, max: 200, step: 5, value: 50, unit: ' mK' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pk', 'Peak emission of the object'], ['tot', 'Power the object radiates'], ['inb', 'Share of it inside this band'], ['app', 'Apparent radiance ÷ surroundings'], ['cpk', 'Contrast per kelvin in this band'], ['nc', 'Smallest step the camera can see']]);
      const TB = 293;
      const bandL = (T, a, b) => { let s = 0; const stp = (b - a) > 3000 ? 100 : 25, n = Math.max(8, Math.round((b - a) / stp)); for (let i = 0; i < n; i++) { const nm = a + (b - a) * (i + 0.5) / n; s += Ph.planck(nm, T) * (b - a) / n; } return s; };
      const LREF = bandL(300, 8000, 14000);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const B = BANDS[V.band], T = V.T;
        // ---- the spectral panel: wavelengths 0.3 to 20 µm on a log axis
        const x0 = 18, x1 = W * 0.56, lo = Math.log10(0.3), hi = Math.log10(20), X = um => x0 + (x1 - x0) * (Math.log10(um) - lo) / (hi - lo);
        const ytop = 30, ybar = ytop + 150, bars = ['silicon', 'ingaas', 'insb', 'mct', 'bolometer'];
        c.fillStyle = C.accent; c.globalAlpha = 0.13; c.fillRect(X(B.r[0] / 1000), ytop - 6, X(B.r[1] / 1000) - X(B.r[0] / 1000), Hh - ytop - 6); c.globalAlpha = 1;
        // the emission curves, each normalised to its own peak
        const curve = (TT, col, dash, fill) => {
          const pts = []; let pk = 0;
          for (let k = 0; k <= 120; k++) { const um = Math.pow(10, lo + (hi - lo) * k / 120), v = Ph.planck(um * 1000, TT); pts.push([um, v]); if (v > pk) pk = v; }
          c.beginPath(); pts.forEach((p, i) => { const px = X(p[0]), py = ybar - 120 * (pk > 0 ? p[1] / pk : 0); if (i) c.lineTo(px, py); else c.moveTo(px, py); });
          if (fill) { c.lineTo(X(20), ybar); c.lineTo(X(0.3), ybar); c.closePath(); c.fillStyle = col; c.globalAlpha = 0.22; c.fill(); c.globalAlpha = 1; }
          else { c.strokeStyle = col; c.lineWidth = 1.8; c.setLineDash(dash || []); c.stroke(); c.setLineDash([]); }
        };
        curve(T, C.warn, null, true); curve(T, C.warn, null, false); curve(TB, C.muted, [5, 4], false);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, ybar); c.lineTo(x1, ybar); c.stroke();
        for (const um of [0.4, 1, 2, 5, 10, 20]) { c.beginPath(); c.moveTo(X(um), ybar); c.lineTo(X(um), ybar + 4); c.stroke(); kit.label(c, String(um), X(um), ybar + 14, { align: 'center', color: C.muted, size: 10.5 }); }
        kit.label(c, 'wavelength, µm', x1, ybar + 28, { align: 'right', color: C.faint, size: 10.5 });
        const wpk = Ph.wien(T) / 1000;
        kit.label(c, 'object at ' + Math.round(T) + ' K', X(Math.min(19, Math.max(0.35, wpk))), ybar - 128, { align: 'center', color: C.warn, size: 11, weight: 650 });
        // the detector bars
        bars.forEach((id, k) => {
          const d = det(id), y = ybar + 40 + k * 22;
          c.fillStyle = C.accent; c.globalAlpha = 0.55; c.fillRect(X(Math.max(d.range[0], 300) / 1000), y, X(Math.min(d.range[1], 20000) / 1000) - X(Math.max(d.range[0], 300) / 1000), 12); c.globalAlpha = 1;
          kit.label(c, d.name.replace(/ \(.*$/, '').replace(', cooled', ''), X(Math.max(d.range[0], 300) / 1000), y - 2, { color: C.muted, size: 10 });
        });
        kit.label(c, B.name, x0, 16, { color: C.accent, size: 11.5, weight: 650 });
        // ---- the thermal scene
        const sz = Math.min(W - x1 - 40, Hh - 90), ix = x1 + 22, iy = 36, GXs = 48, GYs = 36;
        const hot = (u, v) => Math.hypot(u - 0.24, (v - 0.58) * 0.75) < 0.15, person = (u, v) => Math.pow((u - 0.58) / 0.1, 2) + Math.pow((v - 0.5) / 0.32, 2) < 1, plate = (u, v) => u > 0.8 && u < 0.96 && v > 0.28 && v < 0.78;
        const Lb = bandL(TB, B.r[0], B.r[1]), Lh = V.eps * bandL(T, B.r[0], B.r[1]) + (1 - V.eps) * Lb, Lp = 0.98 * bandL(307, B.r[0], B.r[1]) + 0.02 * Lb, Ll = 0.1 * bandL(330, B.r[0], B.r[1]) + 0.9 * Lb;
        const Lmin = Math.min(Lb, Lh, Lp, Ll), Lmax = Math.max(Lb, Lh, Lp, Ll), span = Math.max(Lmax - Lmin, 1e-3 * LREF);
        const val = (u, v) => { const L = hot(u, v) ? Lh : person(u, v) ? Lp : plate(u, v) ? Ll : Lb; return clamp((L - Lmin) / span, 0, 1); };
        S.image(c, ix, iy, sz, sz * GYs / GXs, GXs, GYs, (u, v) => Math.pow(val(u, v), 0.9), { smooth: false });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(ix, iy, sz, sz * GYs / GXs);
        kit.label(c, 'the scene in this band (automatic gain)', ix, iy - 12, { color: C.muted, size: 11.5 });
        const ly = iy + sz * GYs / GXs + 14;
        kit.label(c, 'hot object ' + Math.round(T) + ' K, ε ' + V.eps.toFixed(2) + '  ·  person 307 K  ·  metal plate 330 K, ε 0.1', ix, ly, { color: C.faint, size: 10.5 });
        // ---- numbers
        const M = V.eps * 5.670374419e-8 * Math.pow(T, 4);
        const Lband = bandL(T, B.r[0], B.r[1]) * Math.PI, share = V.eps * Lband / M;
        const cpk = (bandL(T + 1, B.r[0], B.r[1]) - bandL(T, B.r[0], B.r[1])) / Math.max(bandL(T, B.r[0], B.r[1]), 1e-300) * 100;
        ro.set('pk', wpk.toFixed(2) + ' µm  (Wien)');
        ro.set('tot', M < 1e4 ? M.toFixed(0) + ' W/m²' : (M / 1e3).toFixed(0) + ' kW/m²');
        ro.set('inb', share > 1e-3 ? (100 * share).toFixed(share < 0.1 ? 2 : 1) + ' % (' + (V.eps * Lband < 1e4 ? (V.eps * Lband).toFixed(1) : (V.eps * Lband / 1e3).toFixed(1) + 'k') + ' W/m²)' : 'almost none (' + share.toExponential(1) + ')');
        ro.set('app', Lb > 0 ? (Lh / Lb).toFixed(Lh / Lb < 100 ? 2 : 0) + ' ×' : 'the surroundings are dark in this band');
        ro.set('cpk', Number.isFinite(cpk) && share > 1e-9 ? cpk.toFixed(cpk < 100 ? 1 : 0) + ' % per K' : '—');
        ro.set('nc', V.netd + ' mK  (' + (cpk * V.netd / 1000).toFixed(2) + ' % of the signal)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
