/* HYPER-OPTICS · sims/nature-of-light.js — simulations of the topic "What light is".
 *   nl-wave-photon      the same beam as a wave and as photons landing one by one on a screen
 *   nl-wavelength-lab   a wave entering a material: wavelength, frequency, speed and colour
 *   nl-spectrum-ruler   the optical spectrum on a log ruler, with sources, windows and detectors
 *   nl-photon-ladder    photon energy against the thresholds of detectors, metals and bonds
 *   nl-index-lab        refractive index: a race in glass, and n against wavelength
 *   nl-optical-path     two arms of equal length, one through a slab: optical path and phase
 *   nl-wavefronts       wavefronts and the rays normal to them; where the ray picture fails
 *   nl-fermat           the quickest path across an interface, found by moving the crossing point
 *   nl-huygens          wavelets building the next wavefront: free space, a gap, refraction
 *   nl-beams            point sources, extended sources, pencils and the limits of "collimated"
 *   nl-shadow-pinhole   umbra and penumbra; the image formed by a pinhole
 * The numbers come from kit.optics, the drawing from kit.osym; geometry that no engine function covers
 * (shadows, the finite wavefront) is computed here.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI, EV = 1.602176634e-19;
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  const sci = (v, d) => {
    if (!Number.isFinite(v) || v === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(v))), m = v / Math.pow(10, e);
    return m.toFixed(d == null ? 2 : d) + ' × 10' + String(e).replace(/[0-9-]/g, c => SUP[c]);
  };
  const nmText = nm => nm >= 1000 ? +(nm / 1000).toPrecision(3) + ' µm' : +nm.toPrecision(4) + ' nm';
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const gauss = () => { let u = 0; while (u === 0) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * Math.random()); };
  const poisson = lam => {
    if (!(lam > 0)) return 0;
    if (lam > 40) return Math.max(0, Math.round(lam + Math.sqrt(lam) * gauss()));
    const L = Math.exp(-lam); let k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
  };
  // the x of the crest of a travelling wave nearest to x0 (for a wave drawn by S.wave from xStart with a given phase)
  const crestNear = (x0, xStart, lam, phase) => {
    const frac = ((phase / TAU + 0.25) % 1 + 1) % 1, first = xStart + lam * frac;
    return first + Math.round((x0 - first) / lam) * lam;
  };

  /* ================================================================ one beam, two descriptions */
  Hyper.sim('nl-wave-photon', {
    title: 'The same light as a wave and as photons',
    blurb: `A laser beam drawn two ways. Above, the wave: the electric field oscillating along the beam, with a wavelength that you can set. Below, a detector screen on which the same beam is counted photon by photon: each dot is one photon landing, at a random place, but with a probability that follows the wave's intensity (the faint glow).

**Try this**
- Set the rate to **10 photons per second** and watch: single flashes, no pattern. After a while the dots pile up into the beam's spot. Press *Clear the screen* and raise the rate to 5000: the same spot fills in at once. A smooth image is simply very many photons.
- Turn the *smooth wave intensity* glow on and off. The wave says where the photons are likely to land; the photons say how many have.
- Slide the wavelength from 400 to 700 nm: the crests move apart and each photon carries less energy (3.1 down to 1.8 eV), so the same 1 mW is more photons per second.
- Go to 1500 nm: the light is invisible, drawn here in dim red, and each photon carries only 0.83 eV.

The wave is drawn schematically: one pixel stands for 16 nm along the beam (see the 1 µm bar), its motion is slowed down enormously and its amplitude is arbitrary. The photon rate on the screen is a sample, not the real number — see the read-out for that.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const hits = [];
      let total = 0;
      const ctl = kit.controls(box.side, [
        { id: 'nm', label: 'Wavelength', min: 300, max: 1600, step: 5, value: params.nm || 550, unit: 'nm' },
        { id: 'rate', label: 'Photons shown per second', min: 10, max: 20000, value: params.rate || 300, log: true, sig: 2, unit: 'per s' },
        { id: 'glow', type: 'check', label: 'Show the smooth wave intensity', value: params.glow != null ? !!params.glow : true },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear the screen', primary: true }] }
      ], id => { if (id === 'clear') { hits.length = 0; total = 0; } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Frequency'], ['E', 'Energy of one photon'], ['band', 'Kind of radiation'], ['rate', 'Photons per second in a 1 mW beam'], ['count', 'Photons on the screen so far']]);
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, nm = V.nm, col = S.nm(nm);
        if (dt > 0) {
          const k = poisson(V.rate * dt);
          for (let i = 0; i < k; i++) hits.push([gauss(), gauss()]);
          total += k;
          if (hits.length > 9000) hits.splice(0, hits.length - 9000);
        }
        // the wave
        const wy = H * 0.2, x1 = 70, x2 = W - 16, lam = nm / 16, ph = t * 6;
        S.source(c, x1 - 8, wy, { kind: 'laser', size: 12, color: col });
        S.wave(c, x1, wy, x2, wy, { wavelength: lam, amp: H * 0.11, phase: ph, nm, width: 2.2, envelope: u => Math.min(1, u * 10) });
        S.axis(c, x1, wy, x2);
        kit.label(c, 'electric field of the wave', x1 + 6, H * 0.04, { color: C.muted, size: 11.5 });
        const xc = crestNear((x1 + x2) / 2, x1, lam, ph);
        S.dim(c, xc, wy - H * 0.145, xc + lam, wy - H * 0.145, 'λ = ' + nmText(nm), { off: -9 });
        S.dim(c, x2 - 62.5, wy + H * 0.15, x2, wy + H * 0.15, '1 µm', { off: 10 });
        // the screen
        const sx = W * 0.08, sy = H * 0.45, sw = W * 0.84, sh = H * 0.5, cx = sx + sw / 2, cy = sy + sh / 2, sig = sh * 0.17;
        c.fillStyle = '#06070f'; c.fillRect(sx, sy, sw, sh);
        if (V.glow) {
          const g = c.createRadialGradient(cx, cy, 0, cx, cy, sig * 2.6);
          for (let i = 0; i <= 6; i++) { const r = i / 6 * 2.6; g.addColorStop(i / 6, S.nm(nm, +(0.5 * Math.exp(-0.5 * r * r)).toFixed(3))); }
          c.fillStyle = g; c.fillRect(sx, sy, sw, sh);
        }
        c.fillStyle = col;
        for (const h of hits) { const x = cx + h[0] * sig, y = cy + h[1] * sig; if (x > sx + 1 && x < sx + sw - 2 && y > sy + 1 && y < sy + sh - 2) c.fillRect(x - 1, y - 1, 2, 2); }
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(sx + 0.5, sy + 0.5, sw, sh);
        kit.label(c, 'detector screen: each dot is one photon', sx, sy - 9, { color: C.muted, size: 11.5 });
        const E = O.photonEnergy(nm);
        ro.set('f', (O.frequency(nm) / 1e12).toFixed(1) + ' THz');
        ro.set('E', E.toFixed(3) + ' eV  =  ' + sci(E * EV) + ' J');
        ro.set('band', O.colourName(nm));
        ro.set('rate', sci(1e-3 / (E * EV)) + ' per second');
        ro.set('count', String(total));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ a wave entering a material */
  Hyper.sim('nl-wavelength-lab', {
    title: 'A wave entering a material: wavelength, frequency and colour',
    blurb: `A light wave comes in from vacuum (left) and enters a transparent material (right). The drawing is continuous: every crest that arrives on the left leaves on the right, so the **frequency cannot change**. What changes is the speed, and with it the wavelength.

**Try this**
- Choose **diamond** ($n$ = 2.42): the wavelength inside is 41 % of its vacuum value, yet the colour is the same. Count the waves in the 1 µm bars below the wave.
- Watch the crests: inside the material they are closer together and travel more slowly, yet they pass any point at the same rate as on the left.
- Slide the vacuum wavelength from violet (400 nm) to red (700 nm): the frequency falls from 749 to 428 THz and the index of the glass falls a little too: shorter wavelengths are slowed more (dispersion).
- Drag along the colour bar at the bottom to set the wavelength, or go to 1400 nm: invisible infrared, drawn in dim red.

Reflection at the surface is ignored; the scale is 70 px to the micrometre.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320 });
      const MEDIA = [['Water', 'water'], ['Acrylic (PMMA)', 'PMMA'], ['Crown glass (N-BK7)', 'N-BK7'], ['Dense flint glass (N-SF11)', 'N-SF11'], ['Diamond', 'diamond']];
      const nameOf = id => MEDIA.find(m => m[1] === id)[0];
      const NM0 = 300, NM1 = 1600;
      const ctl = kit.controls(box.side, [
        { id: 'nm', label: 'Wavelength in vacuum', min: NM0, max: NM1, step: 5, value: params.nm || 550, unit: 'nm' },
        { id: 'mat', type: 'select', label: 'The material', options: MEDIA, value: params.medium || 'N-BK7' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Frequency (the same in both)'], ['l0', 'Wavelength in vacuum'], ['n', 'Refractive index of the material'], ['lm', 'Wavelength in the material'], ['v', 'Speed in the material'], ['col', 'Colour']]);
      let bar = { x: 0, w: 1, y: 0, h: 20 };
      kit.drag(st, {
        hover: true,
        hit: p => (p.y > bar.y - 14 && p.y < bar.y + bar.h + 14) ? 'bar' : null,
        move: (w, p) => { ctl.set('nm', clamp(Math.round((NM0 + (NM1 - NM0) * (p.x - bar.x) / bar.w) / 5) * 5, NM0, NM1)); loop.once(); }
      });
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, nm = V.nm, s = 70;
        const n = O.index(V.mat, nm), x1 = 14, xb = W * 0.46, x2 = W - 14, cy = H * 0.3, A = Math.min(34, H * 0.1);
        const lamL = s * nm / 1000, lamM = lamL / n, ph = t * 5;
        c.fillStyle = S.glass(Math.min(0.5, 0.32 * (n - 1))); c.fillRect(xb, cy - A - 22, x2 - xb, 2 * A + 44);
        c.strokeStyle = S.edge(); c.lineWidth = 1.3; c.strokeRect(xb + 0.5, cy - A - 22, x2 - xb, 2 * A + 44);
        kit.label(c, 'vacuum  (n = 1)', x1, cy - A - 32, { color: C.muted });
        kit.label(c, nameOf(V.mat) + '  (n = ' + n.toFixed(3) + ')', xb + 8, cy - A - 32, { color: C.muted });
        S.axis(c, x1, cy, x2);
        S.wave(c, x1, cy, xb, cy, { wavelength: lamL, amp: A, phase: ph, nm, width: 2.4 });
        S.wave(c, xb, cy, x2, cy, { wavelength: lamM, amp: A, phase: ph - TAU * (xb - x1) / lamL, nm, width: 2.4 });
        const xl = crestNear((x1 + xb) / 2, x1, lamL, ph), xm = crestNear((xb + x2) / 2, xb, lamM, ph - TAU * (xb - x1) / lamL);
        const yd = cy + A + 14;
        S.dim(c, xl, yd, xl + lamL, yd, 'λ₀', { off: 10 });
        S.dim(c, xm, yd, xm + lamM, yd, 'λ', { off: 10 });
        // one micrometre, and how many waves fit in it
        const yb = cy + A + 44;
        S.dim(c, x1 + 10, yb, x1 + 10 + s, yb, '1 µm = ' + (1000 / nm).toFixed(2) + ' waves', { off: 12 });
        S.dim(c, xb + 10, yb, xb + 10 + s, yb, '1 µm = ' + (1000 * n / nm).toFixed(2) + ' waves', { off: 12 });
        // the colour bar, with the wavelength marked
        bar = { x: 24, w: W - 48, y: H * 0.78, h: 22 };
        S.spectrum(c, bar.x, bar.y, bar.w, bar.h, NM0, NM1);
        const mx = bar.x + bar.w * (nm - NM0) / (NM1 - NM0);
        c.fillStyle = C.text; c.beginPath(); c.moveTo(mx, bar.y - 2); c.lineTo(mx - 6, bar.y - 12); c.lineTo(mx + 6, bar.y - 12); c.closePath(); c.fill();
        for (const v of [300, 400, 500, 600, 700, 800, 1000, 1200, 1400, 1600]) S.text(c, v, bar.x + bar.w * (v - NM0) / (NM1 - NM0), bar.y + bar.h + 11, { size: 10.5 });
        kit.label(c, 'wavelength in vacuum, nm  (drag to change)', bar.x, bar.y - 20, { color: C.faint, size: 11 });
        const rg = O.MATERIALS[V.mat].range, inside = !rg || (nm >= rg[0] && nm <= rg[1]);
        ro.set('f', (O.frequency(nm) / 1e12).toFixed(1) + ' THz');
        ro.set('l0', nmText(nm));
        ro.set('n', n.toFixed(4) + (inside ? '' : '  (the material is opaque here)'));
        ro.set('lm', nmText(nm / n));
        ro.set('v', (O.c / n / 1e8).toFixed(3) + ' × 10⁸ m/s  (' + (100 / n).toFixed(1) + ' % of c)');
        ro.set('col', O.colourName(nm) + (nm >= 380 && nm <= 780 ? ' — the same on both sides' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ the optical spectrum on a log ruler */
  Hyper.sim('nl-spectrum-ruler', {
    title: 'The optical spectrum: bands, sources, windows and detectors',
    blurb: `The whole optical spectrum on one logarithmic ruler, from 100 nm to 20 µm — the visible band, painted in its real colours, is a thin sliver of it. Below the ruler: the thermal glow of a body at the temperature you choose, the typical range of common detectors, and the transmission range of common lens and window materials (taken from the engine's material data).

**Try this**
- Drag the cursor along the ruler, or slide the wavelength. The read-out names the band, the frequency and the photon energy, and lists which materials pass the wavelength and which detectors respond.
- Set the temperature to **5772 K** (the Sun): the peak sits in the green. Lower it to **3000 K** (a halogen lamp): the peak is in the near infrared. Go to **310 K**: a person peaks at 9–10 µm, exactly where microbolometers and germanium lenses work.
- Put the cursor at 10.6 µm: N-BK7 glass and fused silica are opaque, germanium and ZnSe are clear. At 193 nm only fused silica, sapphire and the fluoride crystal pass.
- Put it at 1550 nm: silicon has stopped responding (its cut-off is near 1.1 µm) but InGaAs has not.

Detector ranges are typical round figures for each technology, not the specification of any one device.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 470, maxH: 560 });
      const LO = 100, HI = 20000, lg = Math.log10;
      const SOURCES = [['ArF excimer laser', 193], ['mercury germicidal lamp', 254], ['UV-A blacklight', 365], ['violet laser diode', 405], ['green laser', 532], ['helium–neon laser', 632.8], ['infrared LED', 850], ['Nd:YAG laser', 1064], ['telecom laser', 1550], ['CO₂ laser', 10600]];
      const DET = [['Photomultiplier (bialkali)', 160, 650], ['Silicon: CCD, CMOS', 350, 1100], ['InGaAs', 900, 1700], ['InSb (cooled)', 1000, 5500], ['HgCdTe (cooled)', 1000, 14000], ['Microbolometer', 7500, 14000]];
      const MAT = [['fused-silica', 'Fused silica'], ['N-BK7', 'N-BK7 glass'], ['CaF2', 'CaF₂'], ['sapphire', 'Sapphire'], ['silicon', 'Silicon'], ['germanium', 'Germanium'], ['ZnSe', 'ZnSe']];
      const ctl = kit.controls(box.side, [
        { id: 'nm', label: 'Wavelength of the cursor', min: LO, max: HI, value: params.nm || 550, log: true, sig: 3, fmt: v => nmText(v) },
        { id: 'T', label: 'Temperature of a glowing body', min: 200, max: 10000, value: params.T || 5772, log: true, sig: 3, unit: 'K' },
        { id: 'go', type: 'select', label: 'Go to', options: [['(choose a source)', 0]].concat(SOURCES.map(s => [s[0] + ', ' + nmText(s[1]), s[1]])), value: 0 }
      ], (id, v) => { if (id === 'go' && v) ctl.set('nm', v); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['nm', 'Wavelength'], ['f', 'Frequency'], ['E', 'Photon energy'], ['band', 'Band'], ['mat', 'Passed by'], ['det', 'Detected by'], ['bb', 'The glowing body peaks at']]);
      let ax0 = 120, ax1 = 700;
      const X = nm => ax0 + (lg(nm) - lg(LO)) / (lg(HI) - lg(LO)) * (ax1 - ax0);
      const NM = x => Math.pow(10, lg(LO) + (x - ax0) / (ax1 - ax0) * (lg(HI) - lg(LO)));
      kit.drag(st, { hover: true, hit: p => p.x >= ax0 - 12 && p.x <= ax1 + 12 ? 'c' : null, move: (w, p) => { ctl.set('nm', clamp(NM(p.x), LO, HI)); loop.once(); } });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        ax0 = 128; ax1 = W - 18;
        const nm = V.nm, T = V.T;
        // wavelength labels above: sources in three staggered rows
        SOURCES.forEach((s, i) => {
          const x = X(s[1]), y = 14 + (i % 3) * 15;
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y + 6); c.lineTo(x, 66); c.stroke();
          kit.label(c, s[0], x, y, { align: 'center', color: C.muted, size: 10 });
        });
        // the bands
        const by = 70, bh = 28;
        for (const b of O.BANDS) {
          if (b[0] === 'violet' || b[0] === 'blue' || b[0] === 'green' || b[0] === 'yellow' || b[0] === 'orange' || b[0] === 'red') continue;
          const a = X(Math.max(LO, b[2])), e = X(Math.min(HI, b[3]));
          if (e <= a) continue;
          c.fillStyle = b[3] <= 400 ? S.nm(300, 0.4) : S.nm(1000, 0.4); c.fillRect(a, by, e - a, bh);
          c.strokeStyle = C.faint; c.strokeRect(a + 0.5, by + 0.5, e - a - 1, bh - 1);
          const nice = { uvc: 'UV-C', uvb: 'UV-B', uva: 'UV-A', nir: 'NIR', swir: 'SWIR', mwir: 'MWIR', lwir: 'LWIR', fir: 'far IR' }[b[0]];
          if (nice && e - a > 22 && b[0] !== 'uva') kit.label(c, nice, (a + e) / 2, by + bh / 2, { align: 'center', size: 10.5, color: C.text });
        }
        for (let x = Math.round(X(380)); x < X(780); x++) { c.fillStyle = S.nm(NM(x)); c.fillRect(x, by, 1.6, bh); }
        kit.label(c, 'visible', (X(380) + X(780)) / 2, by + bh + 9, { align: 'center', size: 10, color: C.muted });
        kit.label(c, 'UV-A', X(357), by + bh / 2, { align: 'center', size: 10, color: C.text });
        // the axis
        const ay = by + bh + 22;
        for (const v of [100, 200, 300, 400, 500, 700, 1000, 2000, 3000, 5000, 10000, 20000]) {
          const x = X(v); c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x, ay - 14); c.lineTo(x, ay - 9); c.stroke();
          S.text(c, nmText(v), x, ay, { size: 10 });
        }
        // the glowing body, power per unit wavelength relative to its peak
        const cy0 = ay + 14, ch = 76, pk = Ph.wien(T), top = Ph.planck(pk, T) || 1;
        c.beginPath(); c.moveTo(ax0, cy0 + ch);
        for (let x = ax0; x <= ax1; x += 2) c.lineTo(x, cy0 + ch - ch * 0.92 * clamp(Ph.planck(NM(x), T) / top, 0, 1));
        c.lineTo(ax1, cy0 + ch); c.closePath(); c.fillStyle = S.nm(T > 4500 ? 520 : T > 2500 ? 620 : 1000, 0.35); c.fill();
        c.strokeStyle = C.accent; c.lineWidth = 1.4; c.stroke();
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(ax0, cy0 + ch + 0.5); c.lineTo(ax1, cy0 + ch + 0.5); c.stroke();
        if (pk >= LO && pk <= HI) { const px = X(pk); c.save(); c.setLineDash([3, 3]); c.strokeStyle = C.warn; c.beginPath(); c.moveTo(px, cy0); c.lineTo(px, cy0 + ch); c.stroke(); c.restore(); kit.label(c, 'peak ' + nmText(pk), px > W - 120 ? px - 4 : px + 4, cy0 + 8, { color: C.warn, size: 10.5, align: px > W - 120 ? 'right' : 'left' }); }
        kit.label(c, 'a body at ' + Math.round(T) + ' K', 8, cy0 + ch / 2 - 6, { color: C.muted, size: 11 });
        kit.label(c, 'relative power', 8, cy0 + ch / 2 + 8, { color: C.faint, size: 10.5 });
        // detectors and materials as bars
        let y = cy0 + ch + 16;
        const rows = (title, list, passes) => {
          kit.label(c, title, 8, y + 3, { color: C.text, weight: 650, size: 11.5 }); y += 15;
          for (const r of list) {
            const a = X(Math.max(LO, r[1])), e = X(Math.min(HI, r[2])), on = nm >= r[1] && nm <= r[2];
            kit.label(c, r[0], ax0 - 6, y + 6, { align: 'right', size: 10.5, color: on ? C.text : C.muted });
            c.fillStyle = on ? C.ok : C.faint; c.globalAlpha = on ? 0.9 : 0.45; c.fillRect(a, y, Math.max(2, e - a), 12); c.globalAlpha = 1; y += 15;
          }
          y += 5;
        };
        const mats = MAT.map(m => [m[1], O.MATERIALS[m[0]].range[0], O.MATERIALS[m[0]].range[1]]);
        rows('Detectors (typical range)', DET);
        rows('Lens and window materials', mats);
        // the cursor
        const cx = X(nm);
        c.strokeStyle = C.text; c.lineWidth = 1.4; c.beginPath(); c.moveTo(cx, 8 + 45); c.lineTo(cx, y - 8); c.stroke();
        kit.label(c, nmText(nm), cx, 56, { align: 'center', weight: 650, bg: C.surface, size: 11.5 });
        ro.set('nm', nmText(nm));
        ro.set('f', (O.frequency(nm) / 1e12).toPrecision(4) + ' THz');
        ro.set('E', O.photonEnergy(nm).toPrecision(3) + ' eV');
        ro.set('band', O.colourName(nm));
        const pass = mats.filter(m => nm >= m[1] && nm <= m[2]).map(m => m[0]), det = DET.filter(d => nm >= d[1] && nm <= d[2]).map(d => d[0]);
        ro.set('mat', pass.length ? pass.join(', ') : 'none of these');
        ro.set('det', det.length ? det.join(', ') : 'none of these');
        ro.set('bb', nmText(pk) + ' — ' + O.colourName(pk));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ photon energy against thresholds */
  Hyper.sim('nl-photon-ladder', {
    title: 'Photon energy against the thresholds of matter',
    blurb: `A photon's energy sets how far up the ladder it can lift an electron. The arrow is one photon of the wavelength you choose; the horizontal lines are the energies that various processes need — a semiconductor's band gap, a metal's work function, the strength of a chemical bond. A line is *lit* (green) when the photon can drive that process.

**Try this**
- Start at **550 nm** (2.25 eV): the silicon, InGaAs, GaAs and caesium lines are lit. Copper, GaN and the bonds are out of reach.
- Move to **1550 nm** (0.80 eV): only the InGaAs line is lit. Silicon has gone dark: this is why silicon cameras cannot see telecom light.
- Move to **254 nm** (4.9 eV): GaN, the C–C bond and even the work function of copper join in. Still no O–H: that needs 238 nm or shorter (193 nm lights everything).
- There is no brightness control, on purpose: more photons do not change what one photon can do. Compare the read-out of photons per second for a fixed 1 mW.

Thresholds are typical room-temperature values; work functions depend on the surface.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 420, maxH: 540 });
      const EMAX = 6.8;
      const TH = [['InGaAs band gap', 0.74], ['Silicon band gap', 1.12], ['GaAs band gap', 1.42], ['Caesium work function', 2.1], ['GaN band gap', 3.4], ['C–C bond', 3.6], ['Copper work function', 4.7], ['O–H bond (water)', 5.2]];
      const ctl = kit.controls(box.side, [
        { id: 'nm', label: 'Wavelength', min: 190, max: 3000, value: params.nm || 550, log: true, sig: 3, fmt: v => nmText(v) },
        { type: 'buttons', items: [{ id: 'g', label: 'Green 550' }, { id: 'ir', label: 'Telecom 1550' }, { id: 'uv', label: 'UV-C 254' }, { id: 'ar', label: 'ArF 193' }] }
      ], id => { const m = { g: 550, ir: 1550, uv: 254, ar: 193 }[id]; if (m) ctl.set('nm', m); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['E', 'Energy of one photon'], ['f', 'Frequency'], ['can', 'Can drive'], ['rate', 'Photons per second in 1 mW'], ['mol', 'Energy of a mole of these photons']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, nm = V.nm, E = O.photonEnergy(nm), col = S.nm(nm);
        const ax = 70, yTop = 26, yBot = H - 34, Y = e => yBot - (yBot - yTop) * e / EMAX;
        // the energy axis, with the visible band painted alongside
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(ax, yTop - 8); c.lineTo(ax, yBot); c.stroke();
        for (let e = 0; e <= 6; e++) { c.beginPath(); c.moveTo(ax - 4, Y(e)); c.lineTo(ax, Y(e)); c.stroke(); S.text(c, e, ax - 14, Y(e), { size: 11 }); }
        kit.label(c, 'photon energy, eV', 6, 10, { color: C.muted, size: 11.5 });
        for (let y = Y(O.photonEnergy(380)); y < Y(O.photonEnergy(780)); y += 1) { const e = EMAX * (yBot - y) / (yBot - yTop); c.fillStyle = S.nm(1239.84 / e); c.fillRect(ax + 2, y, 9, 1.6); }
        // the wavelength scale on the same axis
        for (const w of [190, 200, 250, 300, 400, 500, 700, 1000, 2000]) { const y = Y(O.photonEnergy(w)); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(ax + 11, y); c.lineTo(ax + 20, y); c.stroke(); kit.label(c, w + ' nm', ax + 24, y, { color: C.muted, size: 10.5 }); }
        // the thresholds, labels pushed apart so they do not collide
        const ys = TH.map(t => Y(t[1])), lab = ys.slice();
        for (let i = lab.length - 2; i >= 0; i--) if (lab[i] > lab[i + 1] - 15) lab[i] = lab[i + 1] - 15;
        for (let i = 1; i < lab.length; i++) if (lab[i] < lab[i - 1] + 15) lab[i] = lab[i - 1] + 15;
        const lx = ax + 112, rx = Math.max(lx + 160, W - 200);
        TH.forEach((t, i) => {
          const on = E >= t[1];
          c.save(); c.strokeStyle = on ? C.ok : C.faint; c.lineWidth = on ? 1.8 : 1; if (!on) c.setLineDash([4, 4]);
          c.beginPath(); c.moveTo(lx, ys[i]); c.lineTo(rx, ys[i]); c.stroke(); c.restore();
          kit.label(c, t[0] + '  ' + t[1] + ' eV', rx + 6, lab[i], { size: 11, color: on ? C.ok : C.muted, weight: on ? 650 : 500 });
        });
        // the photon
        const px = lx + (rx - lx) * 0.35;
        kit.arrow(c, px, yBot, px, Math.min(yBot - 4, Y(E)), col, 4, 11);
        kit.label(c, 'one photon, ' + E.toFixed(2) + ' eV', px + 12, Math.max(yTop, Y(E)) + 4, { color: col === 'rgb(140,40,40)' ? C.text : col, weight: 650 });
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(lx, yBot + 0.5); c.lineTo(rx, yBot + 0.5); c.stroke();
        kit.label(c, 'thermal energy kT at 300 K: 0.026 eV', lx, yBot + 14, { color: C.faint, size: 10.5 });
        const can = TH.filter(t => E >= t[1]).map(t => t[0]);
        ro.set('E', E.toFixed(3) + ' eV  =  ' + sci(E * EV) + ' J');
        ro.set('f', (O.frequency(nm) / 1e12).toFixed(1) + ' THz');
        ro.set('can', can.length ? can.join(', ') : 'none of these');
        ro.set('rate', sci(1e-3 / (E * EV)) + ' per second');
        ro.set('mol', (E * 96.485).toFixed(0) + ' kJ/mol');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the refractive index: a race and a curve */
  Hyper.sim('nl-index-lab', {
    title: 'The refractive index: a race and a curve',
    blurb: `Two pulses of light set off together across 30 cm: one in vacuum, one in the material you choose. The picture is slowed down by a factor of 2.5 billion, so that 1 nanosecond of real time takes 2.5 seconds to watch. Below it, the index of the chosen material is plotted against wavelength, with the other common optical materials for comparison; each curve is drawn only where the material is transparent.

**Try this**
- Choose **diamond**: its pulse needs 2.4 times as long as the vacuum pulse to cover the same 30 cm. Choose **water**: 1.33 times.
- Slide the wavelength from 400 to 700 nm. Every curve falls: blue light is slowed more than red. The dense flint (N-SF11) falls much faster than the crown glass (N-BK7) — that is the difference the Abbe number measures.
- Look at the **group index** in the read-out: a pulse travels more slowly than the crests do, because $n_g > n$. For N-BK7 at 550 nm: 1.519 against 1.546.
- Slide to 1500 nm: the index of every glass has flattened out, which is why infrared lenses suffer little colour error.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.24, minH: 150, maxH: 190 });
      const MATS = [['Water', 'water'], ['Fused silica', 'fused-silica'], ['Acrylic (PMMA)', 'PMMA'], ['Crown glass (N-BK7)', 'N-BK7'], ['Polycarbonate', 'PC'], ['Sapphire', 'sapphire'], ['Dense flint glass (N-SF11)', 'N-SF11'], ['Diamond', 'diamond']];
      const nameOf = id => MATS.find(m => m[1] === id)[0];
      const REF = ['fused-silica', 'N-BK7', 'N-SF11', 'diamond'];
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'The material', options: MATS, value: params.mat || 'N-BK7' },
        { id: 'nm', label: 'Wavelength in vacuum', min: 300, max: 2500, step: 10, value: params.nm || 550, unit: 'nm' }
      ], () => loop.once());
      const V = ctl.values;
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'wavelength in vacuum (nm)', min: 300, max: 2500 }, y: { label: 'refractive index n', min: 1.3, max: 2.6 }, legend: true, series: [] }, 240);
      const ro = kit.readout(box.side, [['n', 'Refractive index n'], ['v', 'Speed of the crests, c/n'], ['lm', 'Wavelength in the material'], ['time', 'Time to cross 30 cm'], ['ng', 'Group index'], ['abbe', 'Index at 587.6 nm and Abbe number']]);
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, nm = V.nm, n = O.index(V.mat, nm);
        const x0 = 150, x1 = W - 100, Lm = 0.3, per = 2.5, tVac = Lm / O.c * 1e9, tMat = n * tVac;
        const tNs = (t % 7.8) / per, y1 = H * 0.3, y2 = H * 0.72;
        c.fillStyle = S.glass(Math.min(0.5, 0.32 * (n - 1))); c.fillRect(x0 - 8, y2 - 16, x1 - x0 + 16, 32);
        c.strokeStyle = C.axis; c.lineWidth = 1;
        for (const y of [y1, y2]) { c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); for (let k = 0; k <= 3; k++) { const x = x0 + (x1 - x0) * k / 3; c.beginPath(); c.moveTo(x, y - 5); c.lineTo(x, y + 5); c.stroke(); } }
        kit.label(c, 'vacuum', 10, y1, { color: C.muted });
        kit.label(c, nameOf(V.mat), 10, y2 - 7, { color: C.muted });
        kit.label(c, 'n = ' + n.toFixed(3), 10, y2 + 9, { color: C.muted, size: 11.5 });
        for (let k = 0; k <= 3; k++) kit.label(c, (k * 10) + ' cm', x0 + (x1 - x0) * k / 3, y2 + 26, { align: 'center', size: 10.5, color: C.faint });
        const pv = Math.min(1, tNs / tVac), pm = Math.min(1, tNs / tMat);
        kit.dot(c, x0 + (x1 - x0) * pv, y1, 7, S.nm(nm), C.text);
        kit.dot(c, x0 + (x1 - x0) * pm, y2, 7, S.nm(nm), C.text);
        if (pv >= 1) kit.label(c, tVac.toFixed(2) + ' ns', x1 + 12, y1, { color: C.ok, weight: 650 });
        if (pm >= 1) kit.label(c, tMat.toFixed(2) + ' ns', x1 + 12, y2, { color: C.ok, weight: 650 });
        kit.label(c, 'real time elapsed: ' + Math.min(tNs, tMat).toFixed(2) + ' ns   (slowed 2.5 billion times)', x0, H * 0.07, { color: C.muted, size: 11.5 });
        // the curves: redrawn only when something changed
        const key = V.mat + '|' + nm;
        if (key !== loop.key) {
          loop.key = key;
          const ids = REF.concat(REF.indexOf(V.mat) >= 0 ? [] : [V.mat]);
          plot.set({
            series: ids.map((id, i) => {
              const rg = O.MATERIALS[id].range, lo = Math.max(300, rg[0]), hi = Math.min(2500, rg[1]), pts = [];
              for (let w = lo; w <= hi + 1e-9; w += 25) pts.push([w, O.index(id, w)]);
              return { pts, label: nameOf(id), color: C.series[i % C.series.length], width: id === V.mat ? 3.2 : 1.3 };
            }),
            vlines: [{ x: nm, label: nmText(nm) }],
            marks: [{ x: nm, y: n, label: n.toFixed(4) }]
          });
        }
        const a = O.abbe(V.mat), ng = O.groupIndex(V.mat, nm), rg = O.MATERIALS[V.mat].range;
        ro.set('n', n.toFixed(4) + (nm >= rg[0] && nm <= rg[1] ? '' : '  (the material is opaque here)'));
        ro.set('v', (O.c / n / 1e3).toFixed(0) + ' km/s  (' + (100 / n).toFixed(1) + ' % of c)');
        ro.set('lm', nmText(nm / n));
        ro.set('time', tMat.toFixed(3) + ' ns  (vacuum: ' + tVac.toFixed(3) + ' ns)');
        ro.set('ng', ng.toFixed(4) + '  (pulses at ' + (100 / ng).toFixed(1) + ' % of c)');
        ro.set('abbe', 'n_d = ' + a.nd.toFixed(4) + ',  V = ' + (Number.isFinite(a.vd) ? a.vd.toFixed(1) : '—'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ optical path: two arms, one slab */
  Hyper.sim('nl-optical-path', {
    title: 'Optical path: two arms of equal length, one through a slab',
    blurb: `Two beams start in step and travel the same 12 µm (the drawing is stretched: one micrometre is about 45 pixels). The upper one crosses a slab of material; the lower one stays in air. Inside the slab the wave is compressed, so more wavelengths fit in the same distance: the upper beam arrives with a different **phase**. The dial on the right shows the two phases as arrows; if the beams were recombined, their brightness would depend on the angle between them.

**Try this**
- With the slab at 0 µm the beams arrive in step: 100 % brightness. Increase the thickness slowly. Each extra 1.06 µm of N-BK7 at 550 nm adds exactly one wavelength of optical path ($(n-1)t = \\lambda$), and the beams are back in step.
- Find the thickness that makes them exactly out of step (a half wavelength): about 0.53 µm for N-BK7. Recombined, the beams would cancel.
- Choose diamond: only about 0.39 µm of it adds a whole wavelength. The index, not the thickness alone, makes the path.
- Change the wavelength with the slab fixed: each colour has its own path difference in waves. This is why white-light interferometers show coloured fringes and only a few of them.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 340 });
      const MATS = [['Water', 'water'], ['Crown glass (N-BK7)', 'N-BK7'], ['Dense flint glass (N-SF11)', 'N-SF11'], ['Diamond', 'diamond']];
      const Lg = 12;   // geometric length of each arm, µm
      const ctl = kit.controls(box.side, [
        { id: 't', label: 'Thickness of the slab in the upper arm', min: 0, max: 8, step: 0.05, value: params.t != null ? params.t : 3, unit: 'µm' },
        { id: 'mat', type: 'select', label: 'Material of the slab', options: MATS, value: params.mat || 'N-BK7' },
        { id: 'nm', label: 'Wavelength in vacuum', min: 400, max: 800, step: 5, value: params.nm || 550, unit: 'nm' },
        { id: 'pause', type: 'check', label: 'Freeze the waves', value: false }
      ], id => { if (id === 'pause') { if (V.pause) loop.stop(); else loop.start(); } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Index of the slab'], ['opl', 'Optical path of each arm'], ['opd', 'Optical path difference'], ['dphi', 'Phase difference'], ['bright', 'If the beams were recombined'], ['inside', 'Wavelengths inside the slab']]);
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, nm = V.nm, n = O.index(V.mat, nm), tt = Math.min(V.t, Lg - 0.1);
        const x0 = 56, x1 = W - 150, s = (x1 - x0) / Lg, lam = s * nm / 1000, ph = t * 5, yA = H * 0.26, yB = H * 0.68, A = Math.min(26, H * 0.075), a = (Lg - tt) / 2;
        // the slab
        if (tt > 0.001) { c.fillStyle = S.glass(Math.min(0.5, 0.32 * (n - 1))); c.fillRect(x0 + a * s, yA - A - 14, tt * s, 2 * A + 28); c.strokeStyle = S.edge(); c.lineWidth = 1.3; c.strokeRect(x0 + a * s + 0.5, yA - A - 14, tt * s, 2 * A + 28); }
        // upper arm in three pieces, the phase running on from one to the next
        let xs = x0, acc = 0;
        for (const [len, nn] of [[a, 1], [tt, n], [a, 1]]) {
          if (len <= 1e-6) continue;
          S.wave(c, xs, yA, xs + len * s, yA, { wavelength: lam / nn, amp: A, phase: ph - acc, nm, width: 2.3 });
          acc += TAU * nn * len * 1000 / nm; xs += len * s;
        }
        S.wave(c, x0, yB, x1, yB, { wavelength: lam, amp: A, phase: ph, nm, width: 2.3 });
        S.axis(c, x0, yA, x1); S.axis(c, x0, yB, x1);
        c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(x0, yA - A - 18); c.lineTo(x0, yB + A + 18); c.moveTo(x1, yA - A - 18); c.lineTo(x1, yB + A + 18); c.stroke(); c.restore();
        kit.label(c, 'start: in step', x0, yB + A + 32, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'finish', x1, yB + A + 32, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, tt > 0.001 ? 'upper arm: through the slab (n = ' + n.toFixed(3) + ')' : 'upper arm', x0 + 4, yA - A - 26, { color: C.muted });
        kit.label(c, 'lower arm: air, same geometric length', x0 + 4, yB - A - 12, { color: C.muted });
        S.dim(c, x0, H - 14, x1, H - 14, Lg + ' µm geometric length', { off: -9 });
        // the dial: the lower arm is the reference
        const opd = (n - 1) * tt, dphi = (TAU * opd * 1000 / nm) % TAU, cx = W - 74, cy = (yA + yB) / 2, r = 40;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke();
        kit.arrow(c, cx, cy, cx + r, cy, C.muted, 2.2, 8);
        kit.arrow(c, cx, cy, cx + r * Math.cos(-dphi), cy + r * Math.sin(-dphi), S.nm(nm), 2.6, 9);
        if (dphi > 0.02) S.angle(c, cx, cy, r * 0.5, 0, -dphi, '');
        kit.label(c, 'phase at the finish', cx, cy - r - 14, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'Δφ = ' + Math.round(dphi * R2D) + '°', cx, cy + r + 14, { align: 'center', weight: 650, size: 12 });
        ro.set('n', n.toFixed(4) + ' at ' + nm + ' nm');
        ro.set('opl', 'upper ' + (Lg + opd).toFixed(3) + ' µm, lower ' + Lg.toFixed(3) + ' µm');
        ro.set('opd', opd.toFixed(3) + ' µm = ' + (opd * 1000 / nm).toFixed(2) + ' wavelengths');
        ro.set('dphi', Math.round(dphi * R2D) + '° (modulo 360°)');
        const I = Math.pow(Math.cos(dphi / 2), 2);
        ro.set('bright', (100 * I).toFixed(0) + ' % of the maximum' + (I > 0.97 ? ' (in step)' : I < 0.03 ? ' (cancel)' : ''));
        ro.set('inside', (n * tt * 1000 / nm).toFixed(2) + ' (against ' + (tt * 1000 / nm).toFixed(2) + ' in air)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* the Huygens envelope of a finite plane front of width a (px) centred on (x0, yc), after it has run a distance r:
     a straight piece with a quarter circle of radius r at each end */
  function finiteFront(c, x0, yc, a, r) {
    const yT = yc - a / 2, yB = yc + a / 2;
    c.beginPath();
    c.arc(x0, yT, r, -Math.PI / 2, 0);
    c.lineTo(x0 + r, yB);
    c.arc(x0, yB, r, 0, Math.PI / 2);
    c.stroke();
  }

  /* ================================================================ wavefronts and rays */
  Hyper.sim('nl-wavefronts', {
    title: 'Wavefronts, rays and where the ray picture fails',
    blurb: `A light wave drawn as its **wavefronts** (the blue curves: the crests, moving outwards) and its **rays** (the orange lines: always at right angles to the wavefronts). One wavelength is drawn 22 pixels wide.

**Try this**
- *A point source*: the wavefronts are circles and the rays are the radii. Drag the dot: the bright wavefront through it is always perpendicular to the ray through it.
- *A distant source*: the fronts are planes and the rays parallel. Tilt the direction and the rays tilt with the fronts.
- *A lens*: a plane wave is turned into a sphere that shrinks onto the focus and then opens out again. The rays predict a point, but the wave makes a disc: the dashed circle is the Airy disc, radius 1.22 λN.
- *A slit*: set the width to 30 wavelengths and the light goes straight through, as rays say. Shrink it to 3, then to 1: the wave spreads and the shadow's edges vanish. The curve on the right is the intensity on a distant screen. Rays fail when the aperture is only a few wavelengths wide.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const LAM = 22;
      const MODES = [['A point source', 'point'], ['A distant source: plane waves', 'plane'], ['A lens bringing a plane wave to a focus', 'lens'], ['A slit a few wavelengths wide', 'slit']];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: MODES, value: params.mode || 'point' },
        { id: 'tilt', label: 'Direction of the plane wave', min: -40, max: 40, step: 1, value: 0, unit: '°' },
        { id: 'a', label: 'Slit width', min: 0.6, max: 30, step: 0.1, value: 3, unit: 'λ' },
        { id: 'rays', type: 'check', label: 'Draw the rays', value: true }
      ], () => { modes(); loop.once(); });
      const V = ctl.values;
      const modes = () => { ctl.show('tilt', V.mode === 'plane'); ctl.show('a', V.mode === 'slit'); };
      modes();
      const ro = kit.readout(box.side, [['what', 'What is drawn'], ['curv', 'Shape of the wavefront'], ['ang', 'Ray and wavefront meet at'], ['ray', 'Does the ray picture hold?']]);
      const P = { x: 0.62, y: 0.3 };
      kit.drag(st, {
        hover: true,
        hit: p => (V.mode === 'point' || V.mode === 'plane') && Math.hypot(p.x - P.x * st.W, p.y - P.y * st.H) < 16 ? 'p' : null,
        move: (w, p) => { P.x = clamp(p.x / st.W, 0.03, 0.97); P.y = clamp(p.y / st.H, 0.03, 0.97); loop.once(); }
      });
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, mode = V.mode, off = (t * 40) % LAM, cy = H / 2, rmax = Math.hypot(W, H);
        const toEdge = (x, y, ang) => { const cx = Math.cos(ang), sy = Math.sin(ang); return Math.min(cx > 1e-9 ? (W - x) / cx : cx < -1e-9 ? -x / cx : 1e9, sy > 1e-9 ? (H - y) / sy : sy < -1e-9 ? -y / sy : 1e9); };
        const ray = (x, y, ang) => S.ray(c, [[x, y], [x + Math.cos(ang) * toEdge(x, y, ang), y + Math.sin(ang) * toEdge(x, y, ang)]], { color: C.warn, width: 1.3 });
        const right = (px, py, ux, uy) => { const vx = -uy, vy = ux; c.strokeStyle = C.text; c.lineWidth = 1.3; c.beginPath(); c.moveTo(px - 10 * ux, py - 10 * uy); c.lineTo(px - 10 * ux + 10 * vx, py - 10 * uy + 10 * vy); c.lineTo(px + 10 * vx, py + 10 * vy); c.stroke(); };
        const px = P.x * W, py = P.y * H;
        let what = '', curv = '', ang = '90° everywhere', rayOk = '';
        if (mode === 'point') {
          const sx = W * 0.14, sy = cy, r = Math.hypot(px - sx, py - sy), ux = (px - sx) / (r || 1), uy = (py - sy) / (r || 1);
          S.wavefronts(c, sx, sy, off, LAM, Math.ceil(rmax / LAM), 0, TAU, { color: C.accent, width: 1.3, alpha: 0.8 });
          c.strokeStyle = C.accent; c.lineWidth = 2.6; c.beginPath(); c.arc(sx, sy, Math.max(1, r), 0, TAU); c.stroke();
          if (V.rays) for (let k = 0; k < 18; k++) ray(sx, sy, TAU * k / 18 + 0.05);
          S.ray(c, [[sx, sy], [px, py]], { color: C.ok, width: 2.6 });
          right(px, py, ux, uy);
          S.source(c, sx, sy, { kind: 'point', size: 14 });
          kit.dot(c, px, py, 6, C.ok, C.text);
          what = 'Spherical fronts about a point; the rays are the radii';
          curv = 'radius ' + (r / LAM).toFixed(1) + ' wavelengths at the dot; curvature 1/R falls with distance';
          ang = '90° (drag the dot)'; rayOk = 'Yes, while the distances are many wavelengths';
        } else if (mode === 'plane') {
          const th = V.tilt * D2R, dx = Math.cos(th), dy = Math.sin(th), vx = -dy, vy = dx, ox = W / 2 - dx * rmax * 0.7, oy = cy - dy * rmax * 0.7;
          S.wavefronts(c, 0, 0, off, LAM, Math.ceil(rmax * 1.4 / LAM), 0, 0, { color: C.accent, width: 1.3, alpha: 0.8, plane: { x: ox, y: oy, dir: th, width: rmax * 2.2 } });
          c.strokeStyle = C.accent; c.lineWidth = 2.6; c.beginPath(); c.moveTo(px - vx * rmax, py - vy * rmax); c.lineTo(px + vx * rmax, py + vy * rmax); c.stroke();
          if (V.rays) for (let j = -9; j <= 9; j++) { const qx = W / 2 + vx * j * 36, qy = cy + vy * j * 36; if (qx < 0 || qx > W || qy < 0 || qy > H) continue; const b = toEdge(qx, qy, th + Math.PI), f = toEdge(qx, qy, th); S.ray(c, [[qx - dx * b, qy - dy * b], [qx + dx * f, qy + dy * f]], { color: C.warn, width: 1.3 }); }
          S.ray(c, [[px - dx * 70, py - dy * 70], [px + dx * 70, py + dy * 70]], { color: C.ok, width: 2.6 });
          right(px, py, dx, dy);
          kit.dot(c, px, py, 6, C.ok, C.text);
          what = 'Plane fronts, parallel rays — the light of a very distant source';
          curv = 'flat: infinite radius of curvature, vergence 0 D';
          ang = '90° (drag the dot)'; rayOk = 'Yes: ideal for a star, the Sun or a collimated beam';
        } else if (mode === 'lens') {
          const xl = W * 0.3, h = Math.min(H * 0.34, 125), f = W * 0.38, xF = xl + f, al = Math.atan(h / f), N = f / (2 * h);
          for (let d = -Math.ceil(xl / LAM) * LAM + off; d < W - xl + LAM; d += LAM) {
            c.strokeStyle = C.accent; c.lineWidth = 1.3; c.globalAlpha = 0.85; c.beginPath();
            if (d < 0) { if (xl + d > 2) { c.moveTo(xl + d, cy - h); c.lineTo(xl + d, cy + h); } }
            else if (d < f - 0.5) c.arc(xF, cy, f - d, Math.PI - al, Math.PI + al);
            else if (d > f + 0.5) c.arc(xF, cy, d - f, -al, al);
            c.stroke(); c.globalAlpha = 1;
          }
          if (V.rays) for (let i = -4; i <= 4; i++) { const yi = cy + h * i / 4.5; S.ray(c, [[8, yi], [xl, yi], [xF, cy], [W, cy + (cy - yi) * (W - xF) / f]], { color: C.warn, width: 1.2 }); }
          S.thinLens(c, xl, cy, h + 8, 1, {});
          const rA = O.diff.airyRadius(550, N) / 550e-9 * LAM;
          c.save(); c.fillStyle = S.nm(550, 0.25); c.strokeStyle = C.text; c.setLineDash([3, 3]); c.beginPath(); c.arc(xF, cy, Math.max(2, rA), 0, TAU); c.fill(); c.stroke(); c.restore();
          kit.label(c, 'focus: not a point but an Airy disc, radius 1.22 λN = ' + (rA / LAM).toFixed(1) + ' λ', xF, cy + h + 14, { align: 'center', color: C.muted, size: 11.5 });
          what = 'A lens turns plane fronts into spheres closing on the focus, then opening out';
          curv = 'radius shrinks to zero at the focus, then grows again';
          rayOk = 'No, at the focus: the rays promise a point, the wave gives a disc about ' + (2 * rA / LAM).toFixed(1) + ' wavelengths across';
        } else {
          const xb = W * 0.3, a = V.a * LAM, aM = V.a * 550e-9;
          for (let x = xb + off - LAM; x > 0; x -= LAM) { c.strokeStyle = C.accent; c.lineWidth = 1.3; c.globalAlpha = 0.85; c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); c.globalAlpha = 1; }
          c.strokeStyle = C.accent; c.lineWidth = 1.3; c.globalAlpha = 0.85;
          for (let r = off; r < W - xb; r += LAM) if (r > 0.5) finiteFront(c, xb, cy, a, r);
          c.globalAlpha = 1;
          S.slits(c, xb, cy, H / 2 - 2, [[cy - a / 2, cy + a / 2]], { w: 6 });
          if (V.rays) for (const u of [-0.7, 0, 0.7]) S.ray(c, [[10, cy + u * a / 2], [W - 96, cy + u * a / 2]], { color: C.warn, width: 1.3 });
          c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(xb, cy - a / 2); c.lineTo(W - 96, cy - a / 2); c.moveTo(xb, cy + a / 2); c.lineTo(W - 96, cy + a / 2); c.stroke(); c.restore();
          const dxs = W - 14 - xb;
          c.beginPath(); c.moveTo(W - 14, 0);
          for (let y = 0; y <= H; y += 2) c.lineTo(W - 14 - 76 * O.diff.singleSlit(aM, 550, Math.atan((y - cy) / dxs)), y);
          c.lineTo(W - 14, H); c.closePath(); c.fillStyle = S.nm(550, 0.35); c.fill(); c.strokeStyle = C.ok; c.lineWidth = 1.3; c.stroke();
          kit.label(c, 'screen: what the wave gives', W - 14, H - 10, { align: 'right', color: C.muted, size: 11 });
          kit.label(c, 'dashed: what rays predict', xb + 6, cy - a / 2 - 10, { color: C.muted, size: 11 });
          const sinm = 550e-9 / aM;
          what = 'A plane wave meets a slit ' + V.a.toFixed(1) + ' wavelengths wide (' + (V.a * 0.55).toFixed(2) + ' µm for green light)';
          curv = 'a flat middle with curved ends; for a narrow slit, half a circle';
          rayOk = V.a >= 25 ? 'Yes: the shadow is sharp; the spread is only ' + (Math.asin(sinm) * R2D).toFixed(1) + '°' : V.a >= 8 ? 'Roughly: the edges blur; the first dark line is at ' + (Math.asin(sinm) * R2D).toFixed(1) + '°' : sinm >= 1 ? 'No: with the slit under a wavelength the wave spreads over the whole half-plane' : 'No: the wave spreads to ±' + (Math.asin(sinm) * R2D).toFixed(0) + '° and beyond';
          ang = '90° to the fronts; the fronts themselves bend at the edges';
        }
        ro.set('what', what); ro.set('curv', curv); ro.set('ang', ang); ro.set('ray', rayOk);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ Fermat: move the crossing point */
  Hyper.sim('nl-fermat', {
    title: 'Fermat\'s principle: find the quickest path',
    blurb: `Light goes from A to B by way of a point on the line in between. Drag the crossing point along the line. The read-out gives the travel time of the path you chose; the curve underneath is the travel time for every possible crossing point. Light takes the lowest point.

**Try this**
- Press **Go to the quickest path**. At the minimum the angles obey $n_1\\sin\\theta_1 = n_2\\sin\\theta_2$ — the read-out shows that difference is zero, and that it matches the angle Snell's law predicts. Refraction *is* the quickest path.
- Drag the point 5 mm away. The time rises by about 1 ps, which is roughly 600 wavelengths of extra optical path; but within ±0.1 mm of the best point the excess is under a quarter of a wavelength. Waves along all those paths arrive in step: that is the light you see.
- Switch to the **mirror**. The quickest path now touches the mirror where the two angles are equal: the law of reflection.
- Raise the lower index to 2.4 (diamond): the quickest crossing shifts towards B, and the ray below the surface runs steeper, nearer the normal. Raise the upper index as well and the bending shrinks again.
- Tick *many paths*: the paths fade with their excess time, and the bundle that survives is the ray.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const PS = 1e9 / O.c;                       // picoseconds per millimetre of optical path
      let X = 30, map = null;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'The light meets', options: [['a boundary into a second medium', 'refract'], ['a flat mirror', 'mirror']], value: params.mode || 'refract' },
        { id: 'n1', label: 'Index above, n₁', min: 1, max: 2.5, step: 0.01, value: params.n1 || 1, unit: '' },
        { id: 'n2', label: 'Index below, n₂', min: 1, max: 2.5, step: 0.01, value: params.n2 || 1.5, unit: '' },
        { id: 'all', type: 'check', label: 'Show many paths, bright near the quickest', value: params.all != null ? !!params.all : true },
        { type: 'buttons', items: [{ id: 'best', label: 'Go to the quickest path', primary: true }] }
      ], id => { if (id === 'best') X = best().x; ctl.show('n2', V.mode === 'refract'); loop.once(); });
      const V = ctl.values;
      ctl.show('n2', V.mode === 'refract');
      const nn = () => V.mode === 'mirror' ? [V.n1, V.n1] : [V.n1, V.n2];
      const opl = x => { const k = nn(); return k[0] * Math.hypot(x, 30) + k[1] * Math.hypot(100 - x, 30); };
      const best = () => { let lo = -20, hi = 120; for (let i = 0; i < 60; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (opl(m1) < opl(m2)) hi = m2; else lo = m1; } const x = (lo + hi) / 2; return { x, L: opl(x) }; };
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'crossing point (mm along the line)', min: -20, max: 120 }, y: { label: 'travel time (ps)' }, series: [] }, 190);
      const ro = kit.readout(box.side, [['T', 'Travel time of this path'], ['opl', 'Optical path length'], ['Tmin', 'Quickest possible'], ['dT', 'This path is slower by'], ['ang', 'Angles from the normal'], ['sn', 'n₁ sin θ₁ − n₂ sin θ₂'], ['pred', 'The law predicts'], ['zone', 'Crossing points within λ/4 of the best']]);
      kit.drag(st, {
        hover: true,
        hit: p => map && Math.abs(p.y - map.Y(0)) < 18 ? 'x' : null,
        start: (w, p) => { X = clamp(map.Z(p.x), -20, 120); loop.once(); },
        move: (w, p) => { X = clamp(map.Z(p.x), -20, 120); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, k = nn(), mir = V.mode === 'mirror';
        const m = S.map(st, -20, 120, 42, { left: 26, right: 26, top: 22, bottom: 22 }); map = m;
        const bp = best(), Lmin = bp.L, y0 = m.Y(0);
        c.fillStyle = S.glass(Math.min(0.5, 0.36 * (k[0] - 1))); c.fillRect(0, 0, W, y0);
        if (!mir) { c.fillStyle = S.glass(Math.min(0.5, 0.36 * (k[1] - 1))); c.fillRect(0, y0, W, H - y0); c.strokeStyle = C.text; c.lineWidth = 1.4; c.beginPath(); c.moveTo(0, y0); c.lineTo(W, y0); c.stroke(); }
        else S.flatMirror(c, m.X(120), y0, m.X(-20), y0, { width: 3 });
        kit.label(c, 'n₁ = ' + k[0].toFixed(2), 10, 14, { color: C.muted });
        kit.label(c, mir ? 'mirror' : 'n₂ = ' + k[1].toFixed(2), 10, H - 14, { color: C.muted });
        const Ax = m.X(0), Ay = m.Y(30), Bx = m.X(100), By = mir ? m.Y(30) : m.Y(-30);
        if (V.all) for (let x = -20; x <= 120; x += 2) S.ray(c, [[Ax, Ay], [m.X(x), y0], [Bx, By]], { color: C.accent, alpha: Math.max(0.03, 0.6 * Math.exp(-(opl(x) - Lmin) / 0.5)), width: 1, arrows: false });
        const cx = m.X(X);
        S.normal(c, cx, y0, Math.PI / 2, 52);
        S.ray(c, [[Ax, Ay], [cx, y0], [Bx, By]], { nm: 550, width: 2.8, minArrow: 40 });
        const a1 = Math.atan2(Ay - y0, Ax - cx), a2 = Math.atan2(By - y0, Bx - cx);
        if (Math.abs(X) > 3) S.angle(c, cx, y0, 36, -Math.PI / 2, a1, 'θ₁');
        if (Math.abs(100 - X) > 3) S.angle(c, cx, y0, 30, mir ? -Math.PI / 2 : Math.PI / 2, a2, 'θ₂');
        kit.dot(c, Ax, Ay, 5, C.text); kit.label(c, 'A', Ax - 4, Ay - 12, { align: 'right', weight: 650 });
        kit.dot(c, Bx, By, 5, C.text); kit.label(c, 'B', Bx + 10, By + (mir ? -12 : 12), { weight: 650 });
        const bx = m.X(bp.x);
        c.fillStyle = C.ok; c.beginPath(); c.moveTo(bx, y0 + 3); c.lineTo(bx - 6, y0 + 14); c.lineTo(bx + 6, y0 + 14); c.closePath(); c.fill();
        kit.label(c, 'quickest', bx, y0 + 25, { align: 'center', color: C.ok, size: 11 });
        kit.dot(c, cx, y0, 7, C.warn, C.text);
        // the curve under the picture
        const pts = []; for (let x = -20; x <= 120; x += 1) pts.push([x, opl(x) * PS]);
        plot.set({ series: [{ pts, label: 'travel time', color: C.accent, width: 2.2 }], vlines: [{ x: bp.x, label: 'quickest' }], marks: [{ x: X, y: opl(X) * PS, label: (opl(X) * PS).toFixed(1) + ' ps' }] });
        // numbers
        const th1 = Math.atan(X / 30), th2 = Math.atan((100 - X) / 30), dL = opl(X) - Lmin;
        const kap = k[0] * 900 / Math.pow(900 + bp.x * bp.x, 1.5) + k[1] * 900 / Math.pow(900 + (100 - bp.x) * (100 - bp.x), 1.5);
        const pr = mir ? th1 : Math.sign(th1 || 1) * O.snell(k[0], k[1], Math.abs(th1));
        ro.set('T', (opl(X) * PS).toFixed(2) + ' ps');
        ro.set('opl', opl(X).toFixed(3) + ' mm');
        ro.set('Tmin', (Lmin * PS).toFixed(2) + ' ps  (at ' + bp.x.toFixed(1) + ' mm)');
        ro.set('dT', (dL * PS).toFixed(3) + ' ps  = ' + (dL * 1e6 / 550).toFixed(1) + ' wavelengths of 550 nm');
        ro.set('ang', 'θ₁ = ' + (th1 * R2D).toFixed(2) + '°,  θ₂ = ' + (th2 * R2D).toFixed(2) + '°');
        ro.set('sn', (k[0] * Math.sin(th1) - k[1] * Math.sin(th2)).toFixed(4));
        ro.set('pred', Number.isNaN(pr) ? 'total internal reflection: no refracted ray' : mir ? 'θ₂ = θ₁ = ' + (th1 * R2D).toFixed(2) + '°' : 'θ₂ = ' + (pr * R2D).toFixed(2) + '°  (Snell\'s law)');
        ro.set('zone', (2 * Math.sqrt(550e-6 / (2 * kap))).toFixed(3) + ' mm wide');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ Huygens' construction */
  Hyper.sim('nl-huygens', {
    title: 'Huygens\' wavelets build the next wavefront',
    blurb: `Every point of a wavefront is treated as a source of a small circular wavelet, and the front a little later is the **envelope** of the wavelets — the line that just touches them all. One wavelength is 22 pixels wide, and a wavelet grows by one wavelength in one period of the wave.

**Try this**
- *A gap*: a plane front has been cut to the width of the gap. The new front is a straight piece the width of the gap with a quarter circle at each end, and the curved ends grow with time. Make the gap 30 wavelengths wide: the front stays almost straight (rays hold). Make it 2: a half circle, and the light spreads (diffraction). The dashed lines are where rays would put the shadow's edge.
- *A surface*: a tilted front reaches the surface piece by piece. The wavelets in the second medium are smaller (the light is slower), and their common tangent — computed here from the circles alone — is the refracted front. Compare its angle with Snell's law in the read-out.
- Switch to *light coming from inside the material* and raise the angle past the critical angle (41° for glass): the wavelets cannot find a common tangent and the wave is totally reflected.
- Tick *Show the reflected wave*: wavelets above the surface make the reflected front, at the same angle as the incident one.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const LAM = 22;
      const MATS = [['Water', 'water'], ['Crown glass (N-BK7)', 'N-BK7'], ['Diamond', 'diamond']];
      let tpct = params.t != null ? params.t : 40;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['A front cut to a finite width (a gap)', 'gap'], ['A front meeting a surface', 'refr']], value: params.mode || 'gap' },
        { id: 'w', label: 'Width of the gap', min: 1, max: 40, step: 0.5, value: 12, unit: 'λ' },
        { id: 'ang', label: 'Angle of incidence', min: 0, max: 80, step: 1, value: 35, unit: '°' },
        { id: 'mat', type: 'select', label: 'The material', options: MATS, value: params.mat || 'N-BK7' },
        { id: 'rev', type: 'check', label: 'Light comes from inside the material', value: !!params.rev },
        { id: 'refl', type: 'check', label: 'Show the reflected wave', value: false },
        { id: 'N', label: 'Number of wavelets', min: 3, max: 40, step: 1, value: 14 },
        { id: 'wl', type: 'check', label: 'Draw the wavelets', value: true },
        { id: 'time', label: 'Elapsed time', min: 0, max: 100, step: 0.5, value: tpct, unit: '%' },
        { id: 'run', type: 'check', label: 'Let time run', value: true }
      ], (id, v) => { if (id === 'time') tpct = v; if (id === 'run') { if (v) loop.start(); else loop.stop(); } modes(); loop.once(); });
      const V = ctl.values;
      const modes = () => { for (const k of ['ang', 'mat', 'rev', 'refl']) ctl.show(k, V.mode === 'refr'); ctl.show('w', V.mode === 'gap'); };
      modes();
      const ro = kit.readout(box.side, [['t', 'Time since the front was cut or arrived'], ['r', 'Radius of a wavelet'], ['res', 'What the envelope gives'], ['chk', 'Check']]);
      const loop = kit.loop((dt) => {
        if (dt > 0 && V.run) { tpct = (tpct + dt * 7) % 100; ctl.set('time', tpct); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, cy = H / 2;
        let t1 = '', r1 = '', res = '', chk = '';
        if (V.mode === 'gap') {
          const xb = W * 0.2, a = V.w * LAM, T = tpct / 100 * 9, r = T * LAM;
          c.strokeStyle = C.accent; c.lineWidth = 1.2; c.globalAlpha = 0.8;
          for (let m = 1; xb - LAM * (m - (T % 1)) > 0; m++) { const x = xb - LAM * (m - (T % 1)); c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
          for (let k = 1; LAM * (T - k) > 0.5; k++) finiteFront(c, xb, cy, a, LAM * (T - k));
          c.globalAlpha = 1;
          if (V.wl) for (let i = 0; i < V.N; i++) {
            const yi = cy - a / 2 + a * (i + 0.5) / V.N;
            c.strokeStyle = C.muted; c.lineWidth = 1; c.globalAlpha = 0.45; c.beginPath(); c.arc(xb, yi, Math.max(0.5, r), -Math.PI / 2, Math.PI / 2); c.stroke();
            c.globalAlpha = 0.15; c.beginPath(); c.arc(xb, yi, Math.max(0.5, r), Math.PI / 2, 1.5 * Math.PI); c.stroke(); c.globalAlpha = 1;
          }
          c.strokeStyle = C.accent; c.lineWidth = 2.6; if (r > 0.5) finiteFront(c, xb, cy, a, r);
          S.slits(c, xb, cy, H / 2 - 2, [[cy - a / 2, cy + a / 2]], { w: 6 });
          c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(xb, cy - a / 2); c.lineTo(W, cy - a / 2); c.moveTo(xb, cy + a / 2); c.lineTo(W, cy + a / 2); c.stroke(); c.restore();
          kit.label(c, 'dashed: the shadow edge a ray would give', xb + 8, cy - a / 2 - 10, { color: C.muted, size: 11 });
          if (V.wl) kit.label(c, 'faint: the half of each wavelet that makes no wave (no backward wave)', 8, H - 12, { color: C.faint, size: 11 });
          t1 = T.toFixed(1) + ' periods = ' + (T * 550e-9 / O.c * 1e15).toFixed(1) + ' fs (green light)';
          r1 = (r / LAM).toFixed(1) + ' wavelengths = ' + (T * 0.55).toFixed(2) + ' µm';
          res = 'a straight front ' + V.w.toFixed(1) + ' λ wide with curved ends ' + (r / LAM).toFixed(1) + ' λ across';
          chk = V.w >= 25 ? 'wide gap: the ends are a small part of the front, rays hold' : V.w >= 6 ? 'medium gap: the edges are blurred, a straight middle remains' : 'narrow gap: the whole front is curved — the light spreads';
        } else {
          const n0 = O.index(V.mat, 550), n1 = V.rev ? n0 : 1, n2 = V.rev ? 1 : n0, th1 = V.ang * D2R, s1 = Math.sin(th1), c1 = Math.cos(th1), v2 = n1 / n2, y0 = cy, rmax = Math.hypot(W, H);
          const Ttot = (W * s1 + H * 0.5) / LAM, T = tpct / 100 * Ttot;
          const xs = []; for (let i = 0; i < V.N; i++) xs.push(W * (i + 0.5) / V.N);
          const tau = x => (x - xs[0]) * s1 / LAM, c0 = xs[0] * s1 + y0 * c1;
          // the two media
          c.fillStyle = S.glass(Math.min(0.5, 0.36 * (n1 - 1))); c.fillRect(0, 0, W, y0);
          c.fillStyle = S.glass(Math.min(0.5, 0.36 * (n2 - 1))); c.fillRect(0, y0, W, H - y0);
          c.strokeStyle = C.text; c.lineWidth = 1.4; c.beginPath(); c.moveTo(0, y0); c.lineTo(W, y0); c.stroke();
          kit.label(c, 'n₁ = ' + n1.toFixed(3), 10, 14, { color: C.muted });
          kit.label(c, 'n₂ = ' + n2.toFixed(3), 10, H - 14, { color: C.muted });
          // the incident fronts, above the surface
          c.save(); c.beginPath(); c.rect(0, 0, W, y0); c.clip();
          c.strokeStyle = C.accent; c.lineWidth = 1.3; c.globalAlpha = 0.85;
          const Dmax = W * s1 + y0 * c1;
          for (let k = Math.max(0, Math.ceil((LAM * T + c0 - Dmax) / LAM)); LAM * (T - k) + c0 >= 0; k++) {
            const D = LAM * (T - k) + c0;
            c.beginPath(); c.moveTo(D * s1 - rmax * c1, D * c1 + rmax * s1); c.lineTo(D * s1 + rmax * c1, D * c1 - rmax * s1); c.stroke();
          }
          c.restore();
          // the envelope of the wavelets at a time tk: from the circles alone. -> { nx, pts } or null
          const envelope = (tk, speed, sgn) => {
            let last = -1; for (let i = 0; i < xs.length; i++) if (tau(xs[i]) < tk - 1e-9) last = i;
            if (last < 1) return null;
            const r0 = LAM * speed * (tk - tau(xs[0])), r1 = LAM * speed * (tk - tau(xs[last])), nx = (r0 - r1) / (xs[last] - xs[0]);
            if (Math.abs(nx) > 1) return { nx, pts: null, last };
            const ny = sgn * Math.sqrt(1 - nx * nx);
            return { nx, last, pts: [[xs[0] + r0 * nx, y0 + r0 * ny], [xs[last] + r1 * nx, y0 + r1 * ny]] };
          };
          let lead = null, leadR = null;
          c.save(); c.beginPath(); c.rect(0, y0, W, H - y0); c.clip();
          if (V.wl) for (let i = 0; i < xs.length; i++) { const r = LAM * v2 * (T - tau(xs[i])); if (r > 0.5) { c.strokeStyle = C.muted; c.globalAlpha = 0.5; c.lineWidth = 1; c.beginPath(); c.arc(xs[i], y0, r, 0, Math.PI); c.stroke(); } }
          c.globalAlpha = 0.9; c.strokeStyle = C.accent;
          for (let k = 0; k < 40; k++) {
            const e = envelope(T - k * 1, v2, 1); if (k === 0) lead = e;
            if (e && e.pts) { c.lineWidth = k === 0 ? 2.8 : 1.3; c.beginPath(); c.moveTo(e.pts[0][0], e.pts[0][1]); c.lineTo(e.pts[1][0], e.pts[1][1]); c.stroke(); }
          }
          c.restore();
          const tir = !!(lead && !lead.pts) || (n1 * s1 / n2 > 1);
          if (V.refl || tir) {
            c.save(); c.beginPath(); c.rect(0, 0, W, y0); c.clip();
            if (V.wl) for (let i = 0; i < xs.length; i++) { const r = LAM * (T - tau(xs[i])); if (r > 0.5) { c.strokeStyle = C.muted; c.globalAlpha = 0.4; c.lineWidth = 1; c.beginPath(); c.arc(xs[i], y0, r, Math.PI, 2 * Math.PI); c.stroke(); } }
            c.strokeStyle = C.warn; c.globalAlpha = 0.9;
            for (let k = 0; k < 40; k++) {
              const e = envelope(T - k, 1, -1); if (k === 0) leadR = e;
              if (e && e.pts) { c.lineWidth = k === 0 ? 2.8 : 1.3; c.beginPath(); c.moveTo(e.pts[0][0], e.pts[0][1]); c.lineTo(e.pts[1][0], e.pts[1][1]); c.stroke(); }
            }
            c.restore();
          }
          const sn = O.snell(n1, n2, th1);
          t1 = T.toFixed(1) + ' periods = ' + (T * 550e-9 / O.c * 1e15).toFixed(1) + ' fs (green light)';
          r1 = 'in the first medium ' + (T > 0 ? 'λ per period' : '0') + '; in the second ' + v2.toFixed(2) + ' times as large';
          res = tir ? 'no common tangent: the wavelets cannot make a refracted front — total internal reflection' : lead ? 'refracted front at θ₂ = ' + (Math.asin(clamp(lead.nx, -1, 1)) * R2D).toFixed(2) + '° (from the wavelets)' : 'the first wavelets are just forming';
          chk = Number.isNaN(sn) ? 'Snell\'s law: no refracted ray (beyond the critical angle ' + (Math.asin(n2 / n1) * R2D).toFixed(1) + '°)' : 'Snell\'s law: θ₂ = ' + (sn * R2D).toFixed(2) + '°' + (leadR ? ';  reflected front at ' + (Math.asin(clamp(leadR.nx, -1, 1)) * R2D).toFixed(2) + '° = θ₁' : '');
        }
        ro.set('t', t1); ro.set('r', r1); ro.set('res', res); ro.set('chk', chk);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ sources and beams */
  Hyper.sim('nl-beams', {
    title: 'Sources, pencils and "collimated" beams',
    blurb: `A source of finite size behind a lens of 25 mm diameter. Rays are drawn from the top, the middle and the bottom of the source — each set of rays from one point is a **pencil** — and the lens bends them with the thin-lens rule. Distances are to scale along the axis; heights are stretched (see the note on the picture) so that the small angles show.

**Try this**
- Press **Put the source at the focus**: the pencil from each point leaves the lens *parallel* — but the three pencils head in different directions. The beam is "collimated" only to within the angle the source subtends from the lens: s/f.
- Shrink the source from 4 mm to 0.1 mm: the pencils merge into one parallel beam. Now the diffraction limit of the 25 mm lens (about 54 µrad) is what is left.
- Slide the source *inside* the focus (ratio below 1): the beam diverges, as if from a virtual image behind the source (dashed). *Outside* (above 1): it converges on a real image.
- Untick the lens: a bare source sends out diverging pencils, spherical wavefronts, the case of a lamp without optics.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, A = O.abcd;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 's', label: 'Size of the source', min: 0.1, max: 20, value: params.s || 4, log: true, sig: 2, unit: 'mm' },
        { id: 'u', label: 'Distance from the lens, in focal lengths', min: 0.4, max: 3, step: 0.01, value: params.u || 1, unit: '× f' },
        { id: 'f', type: 'select', label: 'Focal length of the lens', options: [['25 mm', 25], ['50 mm', 50], ['100 mm', 100]], value: params.f || 50 },
        { id: 'lens', type: 'check', label: 'Put the lens in the way', value: params.lens != null ? !!params.lens : true },
        { type: 'buttons', items: [{ id: 'focus', label: 'Put the source at the focus', primary: true }] }
      ], id => { if (id === 'focus') ctl.set('u', 1); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['kind', 'The beam is'], ['img', 'Image distance'], ['ang', 'Angle between the pencils (chief rays)'], ['dif', 'Diffraction limit of the lens (full angle)'], ['dom', 'What limits the collimation'], ['w10', 'Width of the beam 10 m away, source at the focus']]);
      let uMap = null;
      kit.drag(st, {
        hover: true,
        hit: p => uMap && V.lens && Math.abs(p.x - uMap.xs) < 14 && Math.abs(p.y - uMap.ys) < 40 ? 'src' : null,
        move: (w, p) => { ctl.set('u', clamp(Math.round(-uMap.Z(p.x) / V.f * 100) / 100, 0.4, 3)); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, f = V.f, s = V.s, uf = V.u * f, h = 12.5, zEnd = 4.2 * f;
        const sx = (W - 50) / (7.4 * f), sy = H * 0.82 / (2 * 22), yc = H / 2;
        const X = z => 22 + sx * (z + 3.2 * f), Y = y => yc - sy * y;
        uMap = { xs: X(-uf), ys: Y(0), Z: x => (x - 22) / sx - 3.2 * f };
        S.axis(c, X(-3.2 * f), yc, X(zEnd));
        // the source and the lens
        c.fillStyle = C.warn; c.fillRect(X(-uf) - 2, Y(s / 2), 4, Math.max(3, s * sy));
        kit.label(c, 'source ' + kit.fmt(s, 2) + ' mm', X(-uf), Y(s / 2) - 14, { align: 'center', color: C.muted, size: 11.5 });
        if (V.lens) { S.thinLens(c, X(0), yc, h * sy + 6, f, { foci: sx * f }); kit.label(c, 'lens, f = ' + f + ' mm, 25 mm across', X(0), yc + h * sy + 24, { align: 'center', color: C.muted, size: 11.5 }); }
        const pts = [[s / 2, C.series[0]], [0, C.series[2]], [-s / 2, C.series[1]]];
        let lo = Infinity, hi = -Infinity;
        for (const [ys, col] of pts) {
          // a pencil: five rays from this point of the source through different heights of the lens
          for (let j = -2; j <= 2; j++) {
            const hj = h * j / 2, sin = (hj - ys) / uf, out = V.lens ? A.apply(A.lens(f), [hj, sin])[1] : sin, yE = hj + out * zEnd;
            S.ray(c, [[X(-uf), Y(ys)], [X(0), Y(hj)], [X(zEnd), Y(yE)]], { color: col, width: 1.1, alpha: 0.85, arrows: false });
            lo = Math.min(lo, yE); hi = Math.max(hi, yE);
          }
        }
        const th = O.thinLens(f, uf);
        if (V.lens && V.u < 0.995) {
          // the virtual image, behind the source
          for (const [ys, col] of pts) S.virtual(c, X(0), Y(0), X(th.si), Y(th.m * ys), { color: col });
          kit.label(c, 'virtual image', X(th.si), Y(0) + 24, { align: 'center', color: C.faint, size: 11 });
        } else if (V.lens && V.u > 1.005 && Number.isFinite(th.si) && th.si < zEnd) {
          c.save(); c.strokeStyle = C.muted; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(th.si), Y(-th.m * s / 2)); c.lineTo(X(th.si), Y(th.m * s / 2)); c.stroke(); c.restore();
          kit.label(c, 'real image', X(th.si), Y(0) + 24, { align: 'center', color: C.faint, size: 11 });
        }
        S.dim(c, X(zEnd) - 6, Y(lo), X(zEnd) - 6, Y(hi), '', {});
        kit.label(c, 'beam here: ' + (hi - lo).toFixed(1) + ' mm', X(zEnd) - 12, yc + 4, { align: 'right', color: C.text, size: 11.5, bg: C.surface });
        kit.label(c, 'heights drawn ' + (sy / sx).toFixed(1) + ' × larger than distances', 14, H - 12, { color: C.faint, size: 11 });
        // numbers
        const chief = s / uf, dif = 2 * O.diff.rayleighAngle(550, 25e-3);
        const kind = !V.lens ? 'diverging: spherical wavefronts from each point of the source' : Math.abs(V.u - 1) < 0.005 ? 'collimated (each pencil parallel)' : V.u < 1 ? 'diverging (virtual image behind the source)' : 'converging (to a real image)';
        ro.set('kind', kind);
        ro.set('img', !V.lens ? 'no lens' : Math.abs(V.u - 1) < 0.005 ? 'at infinity' : (th.si > 0 ? 'real, ' : 'virtual, ') + Math.abs(th.si).toFixed(0) + ' mm ' + (th.si > 0 ? 'behind' : 'in front of') + ' the lens');
        ro.set('ang', (chief * 1e3).toFixed(1) + ' mrad = ' + (chief * R2D).toFixed(2) + '°   (size of the source / its distance from the ' + (V.lens ? 'lens' : 'point of view') + ')');
        ro.set('dif', (dif * 1e6).toFixed(0) + ' µrad = ' + (dif * 1e3).toFixed(3) + ' mrad (2.44 λ/D, green)');
        ro.set('dom', s / f > dif ? 'the size of the source: ' + ((s / f) / dif).toFixed(0) + ' times the diffraction limit' : 'diffraction: the source is small enough');
        ro.set('w10', (25 + 10000 * s / f).toFixed(0) + ' mm  (25 mm + 10 m × s/f)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ shadows and the pinhole */
  Hyper.sim('nl-shadow-pinhole', {
    title: 'Shadows, umbra and penumbra — and the pinhole image',
    blurb: `Two consequences of light travelling in straight lines.

**Shadow.** A source of some size, an opaque disc and a screen, seen from the side. The darkest part of the shadow is the **umbra** (the whole source is hidden), the grey fringe is the **penumbra** (only part of it is hidden). The strip and curve at the right show the brightness across the screen, found by working out how much of the source each point of the screen can see.
**Pinhole.** An object, a screen with a small hole, and a second screen. Each point of the object sends a thin pencil through the hole, so the image is upside down, and its sharpness is set by the hole.

**Try this**
- *Shadow*: shrink the source: the penumbra narrows and the shadow sharpens; the umbra widens. Make the source larger than the disc and move the screen away: the umbra tapers to a tip, and beyond it the disc is seen as a dark spot inside a ring of light — the antumbra, as in an annular eclipse.
- *Pinhole*: with a 0.5 mm hole the image is inverted and soft. Make the hole larger: the geometric blur grows. Make it smaller than 0.2 mm: sharpness gets *worse* — diffraction now dominates. The best hole is about √(2.44 λ b).
- Move the screen farther from the hole: the image grows in proportion, and so does the blur.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['The shadow of a disc', 'shadow'], ['The image from a pinhole', 'pinhole']], value: params.mode || 'shadow' },
        { id: 'S_s', label: 'Diameter of the source', min: 1, max: 100, step: 1, value: 30, unit: 'mm' },
        { id: 'S_d', label: 'Diameter of the disc', min: 5, max: 60, step: 1, value: 20, unit: 'mm' },
        { id: 'S_a', label: 'Source to disc', min: 100, max: 600, step: 5, value: 220, unit: 'mm' },
        { id: 'S_b', label: 'Disc to screen', min: 20, max: 400, step: 5, value: 200, unit: 'mm' },
        { id: 'P_d', label: 'Diameter of the pinhole', min: 0.05, max: 5, value: 0.5, log: true, sig: 2, unit: 'mm' },
        { id: 'P_b', label: 'Hole to screen', min: 50, max: 200, step: 1, value: 100, unit: 'mm' },
        { id: 'P_a', label: 'Object to hole', min: 200, max: 1500, step: 10, value: 500, unit: 'mm' },
        { id: 'P_nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: 550, unit: 'nm' }
      ], () => { modes(); loop.once(); });
      const V = ctl.values;
      const roS = kit.readout(box.side, [['umbra', 'Umbra on the screen'], ['pen', 'Penumbra, outer width'], ['L', 'The umbra ends'], ['ang', 'Source seen from the disc'], ['edge', 'Blur of the shadow\'s edge']]);
      const roP = kit.readout(box.side, [['m', 'Magnification b/a'], ['N', 'f-number of the pinhole, b/d'], ['geo', 'Geometric blur, d(1 + b/a)'], ['dif', 'Diffraction blur, 2.44 λb/d'], ['tot', 'Total blur (in quadrature)'], ['best', 'Best hole for this distance']]);
      const modes = () => {
        for (const k of ['S_s', 'S_d', 'S_a', 'S_b']) ctl.show(k, V.mode === 'shadow');
        for (const k of ['P_d', 'P_b', 'P_a', 'P_nm']) ctl.show(k, V.mode === 'pinhole');
        roS.show(V.mode === 'shadow'); roP.show(V.mode === 'pinhole');
      };
      modes();
      // the area of overlap of two discs of radii R1, R2 whose centres are δ apart
      const overlap = (R1, R2, dl) => {
        if (dl >= R1 + R2) return 0;
        if (dl <= Math.abs(R1 - R2)) return Math.PI * Math.pow(Math.min(R1, R2), 2);
        const a1 = Math.acos(clamp((dl * dl + R1 * R1 - R2 * R2) / (2 * dl * R1), -1, 1)), a2 = Math.acos(clamp((dl * dl + R2 * R2 - R1 * R1) / (2 * dl * R2), -1, 1));
        return R1 * R1 * a1 + R2 * R2 * a2 - 0.5 * Math.sqrt(Math.max(0, (-dl + R1 + R2) * (dl + R1 - R2) * (dl - R1 + R2) * (dl + R1 + R2)));
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, yc = H / 2;
        if (V.mode === 'shadow') {
          const s = V.S_s, d = V.S_d, a = V.S_a, b = V.S_b;
          const uh = d / 2 - (s - d) * b / (2 * a), ph = d / 2 + (s + d) * b / (2 * a), Lu = s > d ? a * d / (s - d) : Infinity;
          const sx = (W - 150) / (a + b), mh = Math.max(s / 2, d / 2, Math.min(ph, 3 * Math.max(s, d))) * 1.15, sy = (H - 50) / (2 * mh);
          const X = z => 24 + sx * z, Y = y => yc - sy * y, zs = a + b;
          const poly = (pts, fill) => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.closePath(); c.fillStyle = fill; c.fill(); };
          const dark = C.dark ? '255,255,255' : '0,0,0';
          // penumbra, umbra, antumbra
          poly([[a, d / 2], [zs, ph], [zs, -ph], [a, -d / 2]], 'rgba(' + dark + ',' + (C.dark ? 0.12 : 0.14) + ')');
          if (uh >= 0) poly([[a, d / 2], [zs, uh], [zs, -uh], [a, -d / 2]], 'rgba(' + dark + ',' + (C.dark ? 0.22 : 0.4) + ')');
          else { poly([[a, d / 2], [a + Lu, 0], [a, -d / 2]], 'rgba(' + dark + ',' + (C.dark ? 0.22 : 0.4) + ')'); poly([[a + Lu, 0], [zs, -uh], [zs, uh]], 'rgba(' + dark + ',0.1)'); }
          // construction lines from the edges of the source, past the edges of the disc
          c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1;
          for (const [e1, e2, y3] of [[s / 2, d / 2, uh], [-s / 2, d / 2, ph], [s / 2, -d / 2, -ph], [-s / 2, -d / 2, -uh]]) { c.beginPath(); c.moveTo(X(0), Y(e1)); c.lineTo(X(a), Y(e2)); c.lineTo(X(zs), Y(y3)); c.stroke(); }
          c.restore();
          // source, disc, screen
          c.fillStyle = C.warn; c.fillRect(X(0) - 3, Y(s / 2), 6, Math.max(3, s * sy));
          c.fillStyle = C.text; c.fillRect(X(a) - 3, Y(d / 2), 6, Math.max(3, d * sy));
          c.fillStyle = C.muted; c.fillRect(X(zs), Y(mh), 3, 2 * mh * sy);
          kit.label(c, 'source', X(0), Y(mh) - 6, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, 'disc', X(a), Y(d / 2) - 12, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, 'screen', X(zs), Y(mh) - 6, { align: 'center', color: C.muted, size: 11.5 });
          // the brightness across the screen
          const bx = X(zs) + 12;
          c.beginPath();
          for (let py = Math.round(Y(mh)); py <= Math.round(Y(-mh)); py += 1) {
            const y = (yc - py) / sy, R1 = s / 2, R2 = d * (a + b) / (2 * b), vis = 1 - overlap(R1, R2, Math.abs(y) * a / b) / (Math.PI * R1 * R1);
            c.fillStyle = 'rgb(' + Math.round(235 * vis) + ',' + Math.round(235 * vis) + ',' + Math.round(235 * vis) + ')'; c.fillRect(bx, py, 16, 1.4);
          }
          c.strokeStyle = C.faint; c.strokeRect(bx + 0.5, Y(mh), 16, 2 * mh * sy);
          c.strokeStyle = C.ok; c.lineWidth = 1.5; c.beginPath();
          for (let py = Math.round(Y(mh)); py <= Math.round(Y(-mh)); py += 2) {
            const y = (yc - py) / sy, R1 = s / 2, R2 = d * (a + b) / (2 * b), vis = 1 - overlap(R1, R2, Math.abs(y) * a / b) / (Math.PI * R1 * R1);
            if (py === Math.round(Y(mh))) c.moveTo(bx + 24 + 60 * vis, py); else c.lineTo(bx + 24 + 60 * vis, py);
          }
          c.stroke();
          kit.label(c, 'brightness', bx + 54, Y(mh) - 6, { align: 'center', color: C.muted, size: 11 });
          kit.label(c, 'vertical scale ' + (sy / sx).toFixed(1) + ' × the horizontal', 14, H - 12, { color: C.faint, size: 11 });
          const sizeDeg = 2 * Math.atan(s / (2 * a)) * R2D;
          roS.set('umbra', uh >= 0 ? (2 * uh).toFixed(1) + ' mm wide' : 'none: the screen is beyond the tip (antumbra ' + (-2 * uh).toFixed(1) + ' mm)');
          roS.set('pen', (2 * ph).toFixed(1) + ' mm');
          roS.set('L', Number.isFinite(Lu) ? Lu.toFixed(0) + ' mm behind the disc' : 'never: the source is not larger than the disc');
          roS.set('ang', sizeDeg.toFixed(2) + '°  (the Sun from Earth: 0.53°)');
          roS.set('edge', (ph - Math.max(0, uh)).toFixed(1) + ' mm on each side');
        } else {
          const d = V.P_d, b = V.P_b, a = V.P_a, nm = V.P_nm, Ho = 40;
          const sc = Math.min((W - 250) / (a + b), (H - 90) / (2 * Ho + 8)), x0 = 40 + 14, xh = x0 + a * sc, xs = xh + b * sc, Y = y => yc - sc * y;
          const m = b / a, geo = d * (1 + b / a), N = b / d, dif = 2 * O.diff.airyRadius(nm, N) * 1e3, tot = Math.hypot(geo, dif), best = Math.sqrt(2.44 * nm * 1e-6 * b);
          // object, hole, screen
          kit.arrow(c, x0, Y(-Ho), x0, Y(Ho), C.accent, 3, 10);
          kit.label(c, 'object', x0, Y(-Ho) + 16, { align: 'center', color: C.muted, size: 11.5 });
          const gap = Math.max(2, d * sc);
          S.slits(c, xh, yc, (H - 70) / 2, [[yc - gap / 2, yc + gap / 2]], { w: 5 });
          kit.label(c, 'pinhole ' + kit.fmt(d, 2) + ' mm', xh, 14, { align: 'center', color: C.muted, size: 11.5 });
          S.screen(c, xs, yc, (H - 70) / 2, { label: 'screen' });
          const nmc = nm;
          for (const yo of [Ho, 0, -Ho]) for (const e of [-1, 0, 1]) {
            const yh = e * d / 2, ye = yh + (yh - yo) * b / a;
            S.ray(c, [[x0, Y(yo)], [xh, Y(yh)], [xs, Y(ye)]], { nm: nmc, width: e === 0 ? 1.4 : 0.9, alpha: e === 0 ? 1 : 0.7, arrows: false });
          }
          kit.arrow(c, xs + 10, Y(Ho * m), xs + 10, Y(-Ho * m), C.ok, 3, 8);
          kit.label(c, 'image: ' + (2 * Ho * m).toFixed(1) + ' mm, inverted', xs + 18, yc + 4, { color: C.ok, size: 11.5 });
          S.dim(c, x0, H - 26, xh, H - 26, 'a = ' + a + ' mm', { off: 10 });
          S.dim(c, xh, H - 26, xs, H - 26, 'b = ' + b + ' mm', { off: 10 });
          // the image of two points 10 mm apart, magnified
          const bw = 120, bx = W - bw - 14, by = 34, sep = 10 * m, span = sep + 2.6 * Math.max(geo, dif, tot), k = bw / span;
          c.fillStyle = C.surface; c.fillRect(bx, by, bw, bw); c.strokeStyle = C.faint; c.strokeRect(bx + 0.5, by + 0.5, bw, bw);
          for (const sgn of [-1, 1]) {
            const px = bx + bw / 2 + sgn * sep / 2 * k, py = by + bw / 2;
            c.fillStyle = S.nm(nm, 0.35); c.beginPath(); c.arc(px, py, Math.max(1, tot / 2 * k), 0, TAU); c.fill();
            c.strokeStyle = C.accent; c.lineWidth = 1.2; c.beginPath(); c.arc(px, py, Math.max(1, geo / 2 * k), 0, TAU); c.stroke();
            c.save(); c.setLineDash([3, 3]); c.strokeStyle = C.warn; c.beginPath(); c.arc(px, py, Math.max(1, dif / 2 * k), 0, TAU); c.stroke(); c.restore();
          }
          kit.label(c, 'two points 10 mm apart,', bx + bw / 2, by + bw + 12, { align: 'center', color: C.muted, size: 11 });
          kit.label(c, 'as imaged (box ' + span.toFixed(2) + ' mm)', bx + bw / 2, by + bw + 26, { align: 'center', color: C.muted, size: 11 });
          kit.label(c, 'solid: geometric  dashed: diffraction', bx + bw / 2, by - 10, { align: 'center', color: C.faint, size: 10.5 });
          roP.set('m', m.toFixed(3) + '  (the image is inverted)');
          roP.set('N', 'f/' + N.toFixed(0) + '  (exposure ' + Math.pow(N / 8, 2).toFixed(0) + ' × longer than at f/8)');
          roP.set('geo', geo.toFixed(3) + ' mm');
          roP.set('dif', dif.toFixed(3) + ' mm');
          roP.set('tot', tot.toFixed(3) + ' mm' + (sep > tot ? ' — the two points are resolved' : ' — the two points merge'));
          roP.set('best', best.toFixed(3) + ' mm  (the two blurs are equal there)');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
