/* HYPER-OPTICS · sims/camera-basics.js — simulations for the topic "The camera".
 *   cb-pinhole     a lensless camera: the picture of a letter on the screen, geometric blur against diffraction blur, the best hole
 *   cb-cutaway     a labelled cut-away of a mirrorless camera: lens, iris, shutter, filter stack, sensor, boards, finder, body
 *   cb-families    the sensor or film of each camera family drawn to scale, with its finder, lens and use
 *   cb-triangle    aperture, time and ISO against the scene: the exposure error in stops, the depth, blur and noise paid
 *   cb-aperture    an iris with n blades: the f-number, the blur discs of near and far lights, the depth of field
 *   cb-focalplane  a focal-plane shutter in slow motion: two curtains, the travelling slit, skew of a moving bar, flash sync
 *   cb-disc        a rotary disc shutter of a cine camera: shutter angle, exposure time, the look of motion over six frames
 *   cb-motion      a car crossing the frame: blur in pixels from speed, time and magnification; panning
 *   cb-shake       hand shake traced on the pixels of the sensor, with k stops of stabilization
 *   cb-iso         one scene, one exposure, a gain: shot noise and read noise at each ISO
 *   cb-metering    reflected and incident metering of snow, a grey card and a black cat: the exposure and its histogram
 *   cb-flash       guide number, power, ISO and distance: the exposure of a subject lit by a flash
 *   cb-viewfinder  the reflex path (mirror, screen, pentaprism, eyepiece) and what a split-image or microprism aid shows
 * The numbers come from kit.optics (exposure values, depth of field, blur, photons, sensor and mount tables), the drawing from
 * kit.osym; the f-number itself is explained in the simulation ref-fnumber.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const fin = Number.isFinite;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const num = (v, d) => (fin(v) ? (v < 0 ? '−' : '') + Math.abs(v).toFixed(d == null ? 1 : d) : '—');
  const nfmt = n => (n >= 100 ? String(Math.round(n)) : n >= 10 ? n.toFixed(0) : n.toFixed(1).replace(/\.0$/, ''));
  /* an exposure time as a fraction or in seconds */
  const tfmt = t => (!fin(t) || t <= 0 ? '—' : t >= 0.95 ? (t >= 10 ? t.toFixed(0) : t.toFixed(1)) + ' s' : '1/' + nfmt(1 / t) + ' s');
  const stopsStr = x => (fin(x) ? (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(1) + ' stop' + (Math.abs(x) === 1 ? '' : 's') : '—');
  /* a deterministic noise for pictures that must not flicker: uniform in [0, 1) and Gaussian */
  const hash = (i, j, k) => { let h = Math.imul(i | 0, 374761393) ^ Math.imul(j | 0, 668265263) ^ Math.imul(k | 0, 1274126177); h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
  const gauss = (i, j, k) => Math.sqrt(-2 * Math.log(Math.max(1e-9, hash(i, j, k)))) * Math.cos(2 * Math.PI * hash(i, j, k + 7919));
  const srgb = lin => { const v = clamp(lin, 0, 1); return 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055); };
  const STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
  const TIMES = [1 / 8000, 1 / 4000, 1 / 2000, 1 / 1000, 1 / 500, 1 / 250, 1 / 125, 1 / 60, 1 / 30, 1 / 15, 1 / 8, 1 / 4, 1 / 2, 1];
  const ISOS = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];
  const timeOptions = ts => ts.map(t => [tfmt(t), t]);

  /* ================================================================ the pinhole camera */
  Hyper.sim('cb-pinhole', {
    title: 'A camera with no lens: geometric blur against diffraction blur',
    blurb: `A box with a hole in the front and a screen at the back. The picture on the right is what the screen shows: a letter F, 0.5 m tall and 3 m away, turned through 180°. The graph below shows the two blurs of one point: the **geometric** blur (the hole itself) and the **diffraction** blur (the Airy disc, 2.44 λ f/d), and their sum.

**Try this**
- Make the hole large (3 mm): the picture is a wash and the geometric blur is the whole story. Make it tiny (0.05 mm): the picture is soft again, now from diffraction.
- Press **Best hole**: the blur is smallest where the two curves cross, at d = √(2.44 λ f) = 0.37 mm for a screen 100 mm back, which makes the camera f/270.
- Move the screen back to 200 mm: the image grows, the best hole grows (as √f) and the picture is sharper in proportion to the letter, not to the screen.
- Change the colour: red light diffracts more than blue, so the best hole is a little larger.
- Read the exposure time: bright sun on ISO 100 film takes seconds, not hundredths.

The drawing of the box is not to scale; the letter, the blur and the graph are.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 420 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'diameter of the hole (mm)', name: 'd', log: true, min: 0.03, max: 3 }, y: { label: 'blur of a point on the screen (mm)', name: 'blur', log: true, min: 0.03, max: 10 }, series: [] }, 190);
      const SUBJ = 3000, LETTER = 480, NPIX = 96, FIELD = 36;                 // subject distance and letter height (mm); the screen picture is 36 mm across
      const best = () => { const lam = ctl.values.nm * 1e-6, f = ctl.values.f; return clamp(Math.sqrt(2.44 * lam * f / (1 + f / SUBJ)), 0.04, 3); };
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Diameter of the hole', min: 0.04, max: 3, value: params.d || 0.37, log: true, sig: 2, unit: 'mm' },
        { id: 'f', label: 'Hole to screen distance', min: 20, max: 200, step: 5, value: params.f || 100, unit: 'mm' },
        { id: 'nm', type: 'select', label: 'Light', options: [['Blue, 450 nm', 450], ['Green, 550 nm', 550], ['Red, 650 nm', 650]], value: 550 },
        { type: 'buttons', items: [{ id: 'best', label: 'Best hole', primary: true }] }
      ], id => { if (id === 'best') ctl.set('d', best()); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['d', 'Hole · pinhole f-number'], ['geo', 'Geometric blur'], ['dif', 'Diffraction blur (Airy disc)'], ['tot', 'Total blur'], ['ang', 'Blur as an angle of the scene'], ['best', 'Best hole for this depth'], ['t', 'Exposure in bright sun, ISO 100']]);
      // the letter F (u, v in −1…1, v up)
      const inF = (u, v) => (u >= -0.55 && u <= -0.25 && v >= -1 && v <= 1) || (v >= 0.7 && v <= 1 && u >= -0.55 && u <= 0.55) || (v >= 0.05 && v <= 0.35 && u >= -0.55 && u <= 0.3);
      let cache = { key: null, a: null };
      const picture = (f, tot) => {
        const cell = FIELD / NPIX, k = LETTER * f / (SUBJ - f) / 2;                 // mm on the screen per unit of u, v
        const src = new Float32Array(NPIX * NPIX);
        for (let j = 0; j < NPIX; j++) for (let i = 0; i < NPIX; i++) {
          let s = 0;
          for (let b = 0; b < 3; b++) for (let a = 0; a < 3; a++) {
            const xc = ((i + (a + 0.5) / 3) / NPIX - 0.5) * FIELD, yc = ((j + (b + 0.5) / 3) / NPIX - 0.5) * FIELD;
            if (inF(-xc / k, yc / k)) s++;                                          // rotated through 180°: the image is upside down and reversed
          }
          src[j * NPIX + i] = s / 9;
        }
        const r = tot / 2 / cell, out = new Float32Array(NPIX * NPIX), R = Math.ceil(r);
        for (let j = 0; j < NPIX; j++) for (let i = 0; i < NPIX; i++) {
          if (r < 0.5) { out[j * NPIX + i] = src[j * NPIX + i]; continue; }
          let sum = 0, n = 0;
          for (let dj = -R; dj <= R; dj++) for (let di = -R; di <= R; di++) {
            if (di * di + dj * dj > r * r) continue;
            const ii = i + di, jj = j + dj; n++;
            if (ii >= 0 && jj >= 0 && ii < NPIX && jj < NPIX) sum += src[jj * NPIX + ii];
          }
          out[j * NPIX + i] = n ? sum / n : 0;
        }
        return out;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const lam = V.nm * 1e-6, f = V.f, d = V.d;
        const geo = d * (1 + f / SUBJ), dif = 2.44 * lam * f / d, tot = Math.hypot(geo, dif), N = f / d;
        // the picture on the screen
        const pic = Math.min(Hh - 56, W * 0.4), px = W - pic - 14, py = 30;
        const key = [d.toFixed(3), f, V.nm].join('|');
        if (cache.key !== key) cache = { key, a: picture(f, tot) };
        c.fillStyle = '#000'; c.fillRect(px, py, pic, pic);
        S.image(c, px, py, pic, pic, NPIX, NPIX, (u, v) => { const a = cache.a[Math.min(NPIX - 1, Math.floor(v * NPIX)) * NPIX + Math.min(NPIX - 1, Math.floor(u * NPIX))]; return 0.04 + 0.92 * a; }, { key: 'pin' + key, id: 'pin', gamma: 0.8 });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(px + 0.5, py + 0.5, pic, pic);
        kit.label(c, 'the picture on the screen (36 × 36 mm)', px + pic / 2, py - 14, { align: 'center', color: C.muted, size: 11.5 });
        const sc = pic / FIELD; c.fillStyle = C.text; c.fillRect(px + 8, py + pic - 12, 5 * sc, 3);
        kit.label(c, '5 mm', px + 8 + 5 * sc + 6, py + pic - 11, { color: C.text, size: 11 });
        // the box (not to scale)
        const cy = py + pic / 2, ox = 30, dx1 = px - 22, xh = ox + (dx1 - ox) * 0.55, L = dx1 - xh - 4, xs = xh + L * (0.25 + 0.75 * (f - 20) / 180);
        const hh = 54, ratio = (xs - xh) / (xh - ox), fr = Math.log(d / 0.04) / Math.log(3 / 0.04), gap = 1.5 + 6 * fr;
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(xh, cy - 86); c.lineTo(xs, cy - 86); c.lineTo(xs, cy + 86); c.lineTo(xh, cy + 86); c.stroke(); c.restore();
        c.fillStyle = C.dark ? 'rgba(160,170,200,0.10)' : 'rgba(90,100,130,0.08)'; c.fillRect(xh, cy - 86, xs - xh, 172);
        S.axis(c, ox - 14, cy, xs + 10);
        S.object(c, ox, cy, hh, { label: 'subject' });
        S.stop(c, xh, cy, 86, gap, { label: 'pinhole' });
        S.screen(c, xs, cy, 86, { w: 4 });
        S.object(c, xs - 6, cy, -hh * ratio, { color: C.warn });
        const tipY = cy - hh, nm = V.nm;
        S.ray(c, [[ox, tipY], [xh, cy], [xs, cy + hh * ratio]], { nm, width: 1.6, arrows: true });
        S.ray(c, [[ox, tipY], [xh, cy - gap], [xs, cy - gap + (xs - xh) * ((cy - gap) - tipY) / (xh - ox)]], { nm, width: 0.9, alpha: 0.7, arrows: false });
        S.ray(c, [[ox, tipY], [xh, cy + gap], [xs, cy + gap + (xs - xh) * ((cy + gap) - tipY) / (xh - ox)]], { nm, width: 0.9, alpha: 0.7, arrows: false });
        S.dim(c, xh, cy + 100, xs, cy + 100, 'f = ' + f + ' mm', { off: 12 });
        kit.label(c, '3 m away, 0.5 m tall (not to scale)', ox, cy + hh * 0 + 100, { size: 11, color: C.faint, align: 'center' });
        kit.label(c, 'hole drawn larger than true scale', xh, cy - 100, { size: 11, color: C.faint, align: 'center' });
        // read-outs and the graph
        const lamBest = best(), tExp = N * N / Math.pow(2, 15);
        ro.set('d', num(d, d < 0.1 ? 3 : 2) + ' mm · f/' + nfmt(N));
        ro.set('geo', num(geo, 2) + ' mm');
        ro.set('dif', num(dif, 2) + ' mm');
        ro.set('tot', num(tot, 2) + ' mm' + (Math.abs(Math.log(d / lamBest)) < 0.12 ? '  (about the smallest possible)' : ''));
        ro.set('ang', num(tot / f * 1000, 1) + ' mrad = ' + num(tot / f * R2D, 2) + '°');
        ro.set('best', num(lamBest, 2) + ' mm · f/' + nfmt(f / lamBest));
        ro.set('t', tfmt(tExp));
        const pts = (fn) => { const a = []; for (let i = 0; i <= 60; i++) { const x = 0.03 * Math.pow(100, i / 60); a.push([x, fn(x)]); } return a; };
        plot.set({
          series: [
            { pts: pts(x => x * (1 + f / SUBJ)), label: 'geometric (the hole)', dash: true },
            { pts: pts(x => 2.44 * lam * f / x), label: 'diffraction (Airy disc)', dash: true },
            { pts: pts(x => Math.hypot(x * (1 + f / SUBJ), 2.44 * lam * f / x)), label: 'total' }
          ],
          marks: [{ x: d, y: tot, label: 'now' }], vlines: [{ x: lamBest, label: 'best' }]
        });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the cut-away */
  Hyper.sim('cb-cutaway', {
    title: 'Inside a camera: the chain from lens to sensor',
    blurb: `A mirrorless camera cut open, drawn to scale (millimetres): the lens with its elements and iris, the shutter, the filter stack, the sensor and the boards, the finder, the battery and the body. The lens mount is the dashed line, and the sensor sits exactly the flange distance behind it.

**Try this**
- Click a part, or choose it in the list, to read what it does and what its size is.
- Close the iris with the aperture control: the opening shrinks to f/N, and the cone of light that reaches the sensor narrows. Tick *show the light* to see it.
- Look at the distances: the sensor is 18 mm behind the mount, and between them lie the shutter and 3 to 4 mm of filter glass.
- Notice how little room a mirrorless body needs behind the lens: there is no mirror box.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320, maxH: 460 });
      const FFD = O.cam.mount('E').ffd, F = 50;                                // E-mount: 18 mm; a 50 mm lens
      const PARTS = [
        { id: 'all', name: 'The whole camera', does: 'Light enters the lens, is trimmed by the iris, timed by the shutter and recorded by the sensor; the body holds everything at exact distances.', typ: 'about 130 mm deep with this lens', box: [] },
        { id: 'lens', name: 'Lens elements', does: 'Glass elements that gather the light and form a sharp image on the sensor. A group at the rear moves for focus.', typ: 'typically 6 to 15 elements in 5 to 12 groups', box: [[1, 55, -27, 27]] },
        { id: 'iris', name: 'Iris diaphragm', does: 'A ring of overlapping blades that sets the diameter D of the beam, so the f-number N = f/D: how much light, how deep the focus.', typ: 'f/1.4 to f/22 in whole stops; 7 to 11 blades', box: [[27.5, 32.5, -32, 32]] },
        { id: 'shutter', name: 'Shutter', does: 'Two curtains (or the sensor itself) that open and close to set the exposure time. Shown open and stowed above and below the frame.', typ: '30 s to 1/8000 s mechanically; 1/32 000 s electronically', box: [[72.5, 76, -24, -12], [72.5, 76, 12, 24]] },
        { id: 'filter', name: 'Filter stack', does: 'Glass plates in front of the sensor: an infrared-cut filter and a low-pass filter that slightly blurs the image so that fine detail does not alias against the pixel grid.', typ: '2 to 4 mm of glass in all', box: [[76.5, 79.5, -15, 15]] },
        { id: 'sensor', name: 'Image sensor', does: 'The array of pixels that converts the image into electrical charge, then into numbers. It sits one flange distance behind the mount.', typ: '36 × 24 mm, 24 to 60 million pixels of 4 to 6 µm', box: [[79, 86, -22, 22]] },
        { id: 'processor', name: 'Processor and memory', does: 'Turns the raw numbers into a picture (colour, noise reduction, compression), runs the autofocus and writes the file to the card.', typ: '12 to 16 bits per pixel, tens of frames per second', box: [[88, 96, -33, 33]] },
        { id: 'finder', name: 'Viewfinder and screen', does: 'A small display with an eyepiece, and a rear screen, that show what the sensor sees together with settings and a histogram.', typ: 'finder 2.4 to 9.4 million dots; screen about 1 million', box: [[96, 127, 48, 62], [126, 132, -33, 33]] },
        { id: 'battery', name: 'Battery', does: 'Powers the sensor, the processor, the screens and the stabilization motors.', typ: '7 to 17 Wh; 300 to 800 pictures', box: [[100, 122, -46, -22]] },
        { id: 'body', name: 'Body and lens mount', does: 'Holds the lens at the flange distance, carries the controls, and keeps stray light out. The mount is the dashed line.', typ: 'flange distance 18 mm (E-mount, from the engine table)', box: [[56, 132, -48, 48]] }
      ];
      const ctl = kit.controls(box.side, [
        { id: 'part', type: 'select', label: 'Show a part', options: PARTS.map(p => [p.name, p.id]), value: params.part || 'all' },
        { id: 'N', type: 'select', label: 'Aperture', options: STOPS.map(n => ['f/' + n, n]), value: 2.8 },
        { id: 'rays', type: 'check', label: 'Show the light', value: params.rays !== false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['name', 'Part'], ['does', 'What it does'], ['typ', 'Typical'], ['iris', 'Iris opening'], ['ffd', 'Mount to sensor']]);
      let geom = null;
      const hitPart = p => {
        if (!geom) return null;
        const order = ['iris', 'shutter', 'filter', 'sensor', 'processor', 'battery', 'finder', 'lens', 'body'];
        for (const id of order) { const pt = PARTS.find(q => q.id === id); for (const b of pt.box) { if (p.x >= geom.X(b[0]) && p.x <= geom.X(b[1]) && p.y >= geom.Y(b[3]) && p.y <= geom.Y(b[2])) return id; } }
        return null;
      };
      kit.click(st, p => { const h = hitPart(p); if (h) { ctl.set('part', h); loop.once(); } }, p => hitPart(p) != null);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const s = Math.min((W - 28) / 138, (Hh - 20) / 128), x0 = 14, cy = Hh / 2 + 4;
        const X = mm => x0 + s * mm, Y = mm => cy - s * mm;
        geom = { X, Y };
        const sel = V.part, on = id => sel === id, N = V.N, D = F / N;
        const body = C.dark ? '#262c48' : '#d5dae8', metal = C.dark ? '#39405f' : '#b3bbd1';
        c.lineJoin = 'round';
        // the body, with its finder
        c.fillStyle = body; c.strokeStyle = C.text; c.lineWidth = 1.3;
        c.beginPath(); c.rect(X(62), Y(48), s * 70, s * 96); c.fill(); c.stroke();
        c.beginPath(); c.rect(X(96), Y(62), s * 31, s * 14); c.fill(); c.stroke();
        c.fillStyle = C.bg2; c.fillRect(X(63), Y(40), s * 66, s * 80);                                    // the inside of the body
        // the lens barrel and mount
        c.fillStyle = metal; c.beginPath(); c.rect(X(0), Y(33), s * 56, s * 66); c.fill(); c.stroke();
        c.beginPath(); c.rect(X(56), Y(26), s * 8, s * 52); c.fill(); c.stroke();
        c.fillStyle = C.bg2; c.fillRect(X(1), Y(28), s * 54, s * 56); c.fillRect(X(56), Y(22), s * 8, s * 44);
        // flange line and the distances
        c.save(); c.strokeStyle = C.accent; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(X(62), Y(54)); c.lineTo(X(62), Y(-54)); c.stroke(); c.restore();
        kit.label(c, 'mount', X(62), Y(-58), { align: 'center', color: C.accent, size: 11.5 });
        S.dim(c, X(62), Y(-52), X(62 + FFD), Y(-52), FFD + ' mm', { off: 12 });
        // glass: front group, rear group, iris
        S.lens(c, X(5), cy, 24 * s, { f: 1, bulge: 2.6, t: 6 * s });
        S.lens(c, X(16), cy, 20 * s, { f: -1, bulge: 2.4, t: 3 * s });
        S.lens(c, X(38), cy, 18 * s, { f: 1, bulge: 2.4, t: 5 * s });
        S.lens(c, X(47), cy, 14 * s, { f: 1, bulge: 2.4, t: 4 * s });
        S.stop(c, X(30), cy, 31 * s, Math.min(28, D / 2) * s);
        kit.label(c, 'focusing group', X(42.5), Y(32), { align: 'center', color: C.faint, size: 10.5 });
        // shutter curtains (open), filter stack, sensor and its board
        c.fillStyle = C.muted; c.fillRect(X(73.2), Y(23), s * 2, s * 10); c.fillRect(X(73.2), Y(-13), s * 2, s * 10);
        c.fillStyle = S.glass(0.5); c.fillRect(X(76.8), Y(15), s * 2.6, s * 30); c.strokeStyle = S.edge(); c.strokeRect(X(76.8), Y(15), s * 2.6, s * 30);
        c.fillStyle = C.dark ? '#1f6b4a' : '#2c8a5f'; c.fillRect(X(81), Y(21), s * 5, s * 42);
        S.sensor(c, X(79.6), cy, 12 * s, { pixels: 16 });
        // processor board, battery, screen and finder
        c.fillStyle = C.dark ? '#1f6b4a' : '#2c8a5f'; c.fillRect(X(89), Y(32), s * 4, s * 64);
        c.fillStyle = C.muted; c.fillRect(X(93), Y(24), s * 3, s * 9); c.fillRect(X(93), Y(8), s * 3, s * 9); c.fillRect(X(93), Y(-6), s * 3, s * 7);
        c.fillStyle = C.dark ? '#33406e' : '#aab4d6'; c.fillRect(X(100), Y(-22), s * 22, s * 24); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(X(100), Y(-22), s * 22, s * 24);
        kit.label(c, 'battery', X(111), Y(-34), { align: 'center', color: C.muted, size: 11 });
        c.fillStyle = C.dark ? '#7b8cff' : '#4f5fd6'; c.fillRect(X(127), Y(32), s * 4, s * 64);
        c.fillStyle = C.bg2; c.fillRect(X(101), Y(58), s * 22, s * 6);
        S.lens(c, X(123), Y(55), 6 * s, { f: 1, bulge: 2.2, t: 2.5 * s });
        // the light
        if (V.rays) {
          const hb = Math.min(D / 2, 28) * 0.92;
          for (const u of [-1, -0.5, 0, 0.5, 1]) {
            const h = hb * u;
            S.ray(c, [[X(-16), Y(h)], [X(26), Y(h)], [X(FFD + 62), Y(0)]], { nm: 570, width: 1.2, arrows: u === 1 || u === -1, minArrow: 40 });
          }
          kit.label(c, 'light from the scene', X(-2), Y(hb + 6), { size: 11, color: C.muted });
        }
        // the highlight
        const part = PARTS.find(p => p.id === sel) || PARTS[0];
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 3; c.setLineDash([]);
        if (sel === 'all') { c.setLineDash([6, 4]); c.lineWidth = 2; c.strokeRect(X(-1), Y(64), s * 134, s * 128); }
        else for (const b of part.box) c.strokeRect(X(b[0]), Y(b[3]), s * (b[1] - b[0]), s * (b[3] - b[2]));
        c.restore();
        if (sel !== 'all') { const b0 = part.box[0]; kit.label(c, part.name, X((b0[0] + b0[1]) / 2), Y(b0[3]) - 14, { align: 'center', color: C.warn, weight: 650, size: 12.5, bg: C.bg2 }); }
        ro.set('name', part.name);
        ro.set('does', part.does);
        ro.set('typ', part.typ);
        ro.set('iris', 'f/' + N + ' → ' + num(D, 1) + ' mm of a ' + F + ' mm lens');
        ro.set('ffd', FFD + ' mm (flange to sensor)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ camera families */
  Hyper.sim('cb-families', {
    title: 'Camera families: the size of the picture they record',
    blurb: `The sensor (or film) of each camera family, drawn to scale and nested in one corner, with the area of each shown on the right on a logarithmic scale. The chosen family is highlighted; its finder, lens and use are in the read-out.

**Try this**
- Compare **full frame** (864 mm²) with a **phone** sensor (about 38 mm²): the area, and so the light collected at the same f-number, differs by a factor of 22.
- Look at the **view camera** film: 12 900 mm², fifteen times the area of full frame; and the **thermal** sensor, about as small as a phone's, yet each pixel is 12 µm wide.
- Click a bar to select its family. Note how the *normal lens*, whose focal length is about the diagonal, runs from 8 mm (action) to 160 mm (view camera).
- Notice that the **rangefinder** and the **single-lens reflex** use the same sensor and differ in how you see the picture.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320, maxH: 440 });
      const sz = id => { const s = O.cam.sensor(id); return [s.w, s.h]; };
      const FAM = [
        { id: 'view', name: 'View camera', wh: [127, 101.6], what: 'sheet film 4 × 5 in', find: 'ground glass on the film plane, image upside down', lens: 'on a board with its own leaf shutter, bellows', use: 'architecture, landscape, studio; tilts and shifts' },
        { id: 'tlr', name: 'Twin-lens reflex', wh: [56, 56], what: '6 × 6 cm on 120 film', find: 'ground glass seen from above through a second lens', lens: 'a matched pair, fixed', use: 'portraits and travel in the film era' },
        { id: 'instant', name: 'Instant camera', wh: [62, 46], what: 'integral film, mini size (46 × 62 mm picture)', find: 'a simple window', lens: 'fixed', use: 'parties, art' },
        { id: 'rf', name: 'Rangefinder', wh: sz('Full frame'), what: 'full frame', find: 'separate window with a focusing patch', lens: 'short bayonet: M-mount, flange 27.8 mm', use: 'street, reportage' },
        { id: 'slr', name: 'Single-lens reflex', wh: sz('Full frame'), what: 'full frame (APS-C in many models)', find: 'through the taking lens: mirror and pentaprism', lens: 'bayonet, flange 44 mm (EF) to 46.5 mm (F)', use: 'all-round, sport, wildlife' },
        { id: 'cine', name: 'Cine camera', wh: sz('Super 35'), what: 'Super 35', find: 'monitor, or a reflex shutter finder', lens: 'PL mount, flange 52 mm', use: 'film and television' },
        { id: 'mirrorless', name: 'Mirrorless', wh: sz('APS-C'), what: 'APS-C (full frame, 4/3" and medium format also)', find: 'electronic finder or rear screen', lens: 'short wide bayonet: flange 16 to 20 mm', use: 'all-round, video' },
        { id: 'sci', name: 'Scientific camera', wh: [13.3, 13.3], what: '2048 × 2048 pixels of 6.5 µm', find: 'none: the image goes to a computer', lens: 'C-mount, microscope or telescope port; cooled', use: 'microscopy, astronomy' },
        { id: 'compact', name: 'Compact', wh: sz('1"'), what: '"1 inch" type (to 1/2.3" in simpler ones)', find: 'rear screen, sometimes a finder', lens: 'fixed zoom or prime', use: 'snapshots, travel' },
        { id: 'industrial', name: 'Industrial camera', wh: sz('2/3"'), what: '2/3" type (1/3" to 1.1" in all)', find: 'none: triggered, read by software', lens: 'C-mount, flange 17.526 mm', use: 'inspection, robots' },
        { id: 'thermal', name: 'Thermal camera', wh: [7.68, 5.76], what: '640 × 480 microbolometer pixels of 12 µm', find: 'screen', lens: 'germanium lens, about f/1', use: 'buildings, firefighting, night' },
        { id: 'phone', name: 'Phone camera', wh: sz('1/1.8"'), what: '1/1.8" type (1/2.55" to about 1/1.3" in all)', find: 'the screen', lens: 'several fixed lenses of plastic aspheres', use: 'everyday photographs, video' },
        { id: 'action', name: 'Action camera', wh: sz('1/2.3"'), what: '1/2.3" type', find: 'screen or none', lens: 'fixed, wide, fixed focus; waterproof', use: 'sport, helmet and drone' }
      ];
      const FF = 864;
      const ctl = kit.controls(box.side, [
        { id: 'fam', type: 'select', label: 'Camera family', options: FAM.map(f => [f.name, f.id]), value: params.fam || 'slr' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['size', 'Sensor or film'], ['dim', 'Size · diagonal'], ['area', 'Area against full frame'], ['normal', 'Normal lens (about the diagonal)'], ['find', 'Finding the picture'], ['lens', 'Lens'], ['use', 'Typical use']]);
      let rows = [];
      kit.click(st, p => { for (const r of rows) if (p.y >= r.y0 && p.y <= r.y1 && p.x >= r.x0) { ctl.set('fam', r.id); loop.once(); return; } }, p => rows.some(r => p.y >= r.y0 && p.y <= r.y1 && p.x >= r.x0));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const fam = FAM.find(f => f.id === V.fam), area = f => f.wh[0] * f.wh[1];
        const lw = W * 0.46, s = Math.min((lw - 24) / 132, (Hh - 40) / 108), cx = 14 + lw / 2, cy = Hh / 2 + 6;
        // nested rectangles, largest first
        const bySize = FAM.slice().sort((a, b) => area(b) - area(a));
        for (const f of bySize) {
          const w = f.wh[0] * s, h = f.wh[1] * s;
          c.strokeStyle = f === fam ? C.warn : C.faint; c.lineWidth = f === fam ? 2.4 : 1;
          if (f === fam) { c.fillStyle = C.dark ? 'rgba(224,160,48,0.22)' : 'rgba(224,160,48,0.28)'; c.fillRect(cx - w / 2, cy - h / 2, w, h); }
          c.strokeRect(cx - w / 2, cy - h / 2, w, h);
        }
        kit.label(c, 'to scale: ' + num(fam.wh[0], 1) + ' × ' + num(fam.wh[1], 1) + ' mm', cx, 16, { align: 'center', color: C.muted, size: 12 });
        // the bars: area on a log axis
        const bx = lw + 40, bw = W - bx - 14, top = 30, rh = (Hh - top - 14) / FAM.length, lo = Math.log10(20), hi = Math.log10(15000);
        rows = [];
        bySize.forEach((f, i) => {
          const y = top + i * rh, len = bw * 0.62 * (Math.log10(area(f)) - lo) / (hi - lo), sel = f === fam;
          c.fillStyle = sel ? C.warn : C.accent; c.globalAlpha = sel ? 1 : 0.55; c.fillRect(bx + bw * 0.38, y + rh * 0.18, Math.max(2, len), rh * 0.64); c.globalAlpha = 1;
          kit.label(c, f.name, bx + bw * 0.38 - 6, y + rh / 2, { align: 'right', color: sel ? C.text : C.muted, weight: sel ? 650 : 500, size: 11.5 });
          kit.label(c, nfmt(area(f)) + ' mm²', bx + bw * 0.38 + Math.max(2, len) + 5, y + rh / 2, { color: C.muted, size: 10.5 });
          rows.push({ id: f.id, y0: y, y1: y + rh, x0: bx });
        });
        kit.label(c, 'area (log scale)', bx + bw * 0.38, 14, { color: C.muted, size: 11 });
        const diag = Math.hypot(fam.wh[0], fam.wh[1]), a = area(fam);
        ro.set('size', fam.what);
        ro.set('dim', num(fam.wh[0], 1) + ' × ' + num(fam.wh[1], 1) + ' mm · ' + num(diag, 1) + ' mm diagonal');
        ro.set('area', a >= FF ? num(a / FF, a / FF >= 10 ? 0 : 1) + ' × full frame  (' + num(a, 0) + ' mm²)' : '1/' + num(FF / a, FF / a >= 10 ? 0 : 1) + ' of full frame  (' + num(a, 0) + ' mm²)');
        ro.set('normal', num(diag, 0) + ' mm  (crop factor ' + num(43.267 / diag, 2) + ')');
        ro.set('find', fam.find);
        ro.set('lens', fam.lens);
        ro.set('use', fam.use);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* electrons collected by a pixel of the given pitch (µm) from a patch of reflectance rel × 18 % grey, in a scene whose metered
     exposure value (ISO 100) is ev, through a lens at f-number N for a time t. The scene luminance is that of 18 % grey. */
  const QE = 0.6, PITCH = 5.9, READ = 2.5;
  const electrons = (O, ev, N, t, pitch, rel) => {
    const L = 12.5 * Math.pow(2, ev) / 100, E = O.photo.imageIlluminance(L, N, 0.9, 0, 0);
    return O.cam.photons({ lux: E, t, pitch }) * QE * rel;
  };
  /* mid-grey sits three stops below saturation at ISO 100 (the ISO 12232 convention): the full well follows from sunny 16 */
  const wellOf = (O, pitch) => 8 * electrons(O, 15, 16, 1 / 128, pitch, 1);
  const polyPath = (c, cx, cy, r, n, rot) => { for (let i = 0; i < n; i++) { const a = rot + 2 * Math.PI * i / n, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.closePath(); };

  /* ================================================================ the exposure triangle */
  Hyper.sim('cb-triangle', {
    title: 'The exposure triangle: aperture, time and ISO against the scene',
    blurb: `Choose a scene, then set the three controls. The meter at the bottom shows how many stops too bright or too dark the picture will be; the three panels show what each control costs: the **aperture** (depth of field), the **time** (the blur of a jogger moving at 5 m/s), the **ISO** (the noise in a ramp of greys, from 2 % to 90 % reflectance).

**Try this**
- Leave *Let the camera set* on **shutter time** and open the aperture from f/16 to f/2: the time shortens by six stops and the jogger freezes, while the depth of field falls.
- Let the camera set the **aperture** instead, and raise the ISO: the aperture closes, the depth grows, but the noise in the shadows of the ramp grows too.
- Choose *nothing (manual)*, a dim room, f/2.8 and 1/30 s at ISO 100: the meter shows three stops too dark. Raise the ISO to 800: correct, but see the noise in the shadows. The photons did not change; only the amplifier did.
- Compare the same room at 1/4 s on ISO 100: the same brightness, a clean ramp, a smeared jogger.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340, maxH: 480 });
      const SCENES = [['Bright sun (EV 15)', 15], ['Overcast day (EV 12)', 12], ['Lit room or street at night (EV 8)', 8], ['Dim room (EV 5)', 5], ['Candlelight (EV 2)', 2]];
      const ctl = kit.controls(box.side, [
        { id: 'scene', type: 'select', label: 'Scene (metered at ISO 100)', options: SCENES, value: params.scene || 15 },
        { id: 'solve', type: 'select', label: 'Let the camera set the…', options: [['nothing (manual)', 'none'], ['shutter time', 't'], ['aperture', 'N'], ['ISO', 'iso']], value: params.solve || 't' },
        { id: 'N', type: 'select', label: 'Aperture', options: STOPS.map(n => ['f/' + n, n]), value: 8 },
        { id: 't', type: 'select', label: 'Shutter time', options: timeOptions(TIMES), value: 1 / 250 },
        { id: 'iso', type: 'select', label: 'ISO', options: ISOS.map(i => ['ISO ' + i, i]), value: 100 }
      ], () => { applyShow(); loop.once(); });
      const V = ctl.values;
      const applyShow = () => { ctl.show('t', V.solve !== 't'); ctl.show('N', V.solve !== 'N'); ctl.show('iso', V.solve !== 'iso'); };
      applyShow();
      const ro = kit.readout(box.side, [['set', 'Settings'], ['ev', 'Exposure value of the settings'], ['res', 'The picture is'], ['H', 'Light collected, E·t'], ['e', 'Electrons in a mid-grey pixel'], ['snr', 'Signal-to-noise ratio of that pixel']]);
      const settings = () => {
        const ev = V.scene; let N = V.N, t = V.t, iso = V.iso;
        if (V.solve === 't') t = O.cam.exposureTime(N, ev, iso);
        else if (V.solve === 'N') N = Math.sqrt(t * Math.pow(2, ev) * iso / 100);
        else if (V.solve === 'iso') iso = 100 * N * N / (t * Math.pow(2, ev));
        return { ev, N, t, iso };
      };
      let ramp = { key: null, e: null };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const { ev, N, t, iso } = settings();
        const evSet = Math.log2(N * N / t) - Math.log2(iso / 100), err = ev - evSet;
        const gap = 10, pw = (W - 4 * gap) / 3, py = 12, ph = Math.max(150, Hh * 0.6);
        const px = i => gap + i * (pw + gap);
        const titles = ['Aperture: depth of field', 'Time: motion blur', 'ISO: noise'];
        for (let i = 0; i < 3; i++) {
          c.fillStyle = C.surface; c.fillRect(px(i), py, pw, ph); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(px(i) + 0.5, py + 0.5, pw - 1, ph - 1);
          kit.label(c, titles[i], px(i) + pw / 2, py + 14, { align: 'center', color: C.muted, size: 12, weight: 650 });
        }
        // 1: the iris, and what the aperture does to depth
        {
          const cx = px(0) + pw / 2, cy = py + ph * 0.46, R0 = Math.min(pw, ph) * 0.34, r = Math.max(2.5, R0 * 0.92 * Math.min(1, 1.4 / N));
          c.beginPath(); c.arc(cx, cy, R0, 0, 2 * Math.PI); polyPath(c, cx, cy, r, 7, -Math.PI / 2);
          c.fillStyle = C.dark ? '#39405f' : '#aab2cc'; c.fill('evenodd');
          c.beginPath(); polyPath(c, cx, cy, r, 7, -Math.PI / 2); c.fillStyle = 'rgb(255,244,214)'; c.fill();
          c.beginPath(); c.arc(cx, cy, R0, 0, 2 * Math.PI); c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
          kit.label(c, 'f/' + (N < 10 ? N.toFixed(1) : N.toFixed(0)), cx, py + ph - 38, { align: 'center', weight: 650, size: 14 });
          kit.label(c, 'depth of field × ' + num(N / 2.8, N / 2.8 < 1 ? 2 : 1) + ' of f/2.8', cx, py + ph - 18, { align: 'center', color: C.muted, size: 11.5 });
        }
        // 2: a jogger at 5 m/s, 15 m away, 100 mm lens, 4 µm pixels: the streak in pixels
        {
          const blurPx = O.cam.motionBlur(5000, t, O.cam.magnification(100, 15000), 4), len = clamp(blurPx * 0.35, 0, pw * 0.7), x0 = px(1) + pw * 0.14, cy = py + ph * 0.46, rr = 11;
          c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(px(1) + 10, cy + 26); c.lineTo(px(1) + pw - 10, cy + 26); c.stroke(); c.setLineDash([]);
          const n = Math.max(1, Math.min(40, Math.ceil(len / 2)));
          for (let i = 0; i < n; i++) {
            const x = x0 + (n > 1 ? len * i / (n - 1) : 0);
            c.globalAlpha = Math.max(0.05, 1 / Math.sqrt(n)); c.fillStyle = C.accent; c.beginPath(); c.arc(x + rr, cy, rr, 0, 2 * Math.PI); c.fill(); c.fillRect(x + rr - 3, cy + rr - 2, 6, 18);
          }
          c.globalAlpha = 1;
          kit.label(c, tfmt(t), px(1) + pw / 2, py + ph - 38, { align: 'center', weight: 650, size: 14 });
          kit.label(c, 'jogger blur: ' + num(blurPx, blurPx < 10 ? 1 : 0) + ' pixels' + (len >= pw * 0.7 ? ' (off the panel)' : ''), px(1) + pw / 2, py + ph - 18, { align: 'center', color: C.muted, size: 11.5 });
        }
        // 3: a ramp of greys, with the noise the exposure and the gain give
        {
          const well = wellOf(O, PITCH), nx = 48, ny = 16, gx = px(2) + 10, gw = pw - 20, gh = ph * 0.42, gy = py + 36;
          const key = [ev, N.toFixed(3), t.toExponential(3), iso.toFixed(1)].join('|');
          if (ramp.key !== key) ramp = { key, e: Array.from({ length: nx }, (_, i) => electrons(O, ev, N, t, PITCH, 0.02 * Math.pow(45, (i + 0.5) / nx) / 0.18)) };
          S.image(c, gx, gy, gw, gh, nx, ny, (u, v) => {
            const i = Math.min(nx - 1, Math.floor(u * nx)), j = Math.min(ny - 1, Math.floor(v * ny)), e = ramp.e[i];
            const sample = e + Math.sqrt(Math.max(0, e) + READ * READ) * gauss(i, j, 1);
            const g = srgb(sample * (iso / 100) / well * 1.44);
            return [g, g, g];
          }, { key: 'tri' + key, id: 'tri', smooth: false });
          c.strokeStyle = C.axis; c.strokeRect(gx + 0.5, gy + 0.5, gw, gh);
          kit.label(c, '2 %', gx, gy + gh + 11, { size: 10.5, color: C.faint }); kit.label(c, '90 % reflectance', gx + gw, gy + gh + 11, { size: 10.5, color: C.faint, align: 'right' });
          kit.label(c, 'ISO ' + (iso >= 1000 ? Math.round(iso) : iso.toFixed(0)), px(2) + pw / 2, py + ph - 38, { align: 'center', weight: 650, size: 14 });
          kit.label(c, 'shadows are the noisiest', px(2) + pw / 2, py + ph - 18, { align: 'center', color: C.muted, size: 11.5 });
        }
        // the exposure meter
        const mx0 = 44, mx1 = W - 44, my = py + ph + 34, X = e => mx0 + (clamp(e, -4, 4) + 4) / 8 * (mx1 - mx0);
        c.fillStyle = C.faint; c.fillRect(mx0, my - 3, mx1 - mx0, 6);
        c.fillStyle = C.ok; c.fillRect(X(-0.5), my - 3, X(0.5) - X(-0.5), 6);
        for (let k = -4; k <= 4; k++) { c.fillStyle = C.muted; c.fillRect(X(k) - 0.5, my - 8, 1, 16); if (k % 2 === 0) kit.label(c, (k > 0 ? '+' : k < 0 ? '−' : '') + Math.abs(k), X(k), my + 20, { align: 'center', color: C.muted, size: 11 }); }
        const col = Math.abs(err) <= 0.5 ? C.ok : Math.abs(err) <= 1.5 ? C.warn : C.bad;
        c.fillStyle = col; c.beginPath(); c.moveTo(X(err), my - 6); c.lineTo(X(err) - 7, my - 20); c.lineTo(X(err) + 7, my - 20); c.closePath(); c.fill();
        kit.label(c, 'too dark', mx0, my - 22, { color: C.muted, size: 11 }); kit.label(c, 'too bright', mx1, my - 22, { color: C.muted, size: 11, align: 'right' });
        const verdict = Math.abs(err) <= 0.5 ? 'correct' : err > 0 ? stopsStr(err) + ' too bright' : stopsStr(-err).replace('−', '') + ' too dark';
        kit.label(c, verdict, (mx0 + mx1) / 2, my - 22, { align: 'center', weight: 650, color: col, size: 13 });
        const eMid = electrons(O, ev, N, t, PITCH, 1), Hh2 = O.photo.imageIlluminance(12.5 * Math.pow(2, ev) / 100, N, 0.9, 0, 0) * t;
        ro.set('set', 'f/' + (N < 10 ? N.toFixed(1) : N.toFixed(0)) + ' · ' + tfmt(t) + ' · ISO ' + Math.round(iso));
        ro.set('ev', num(evSet, 1) + '   (the scene is EV ' + ev + ')');
        ro.set('res', Math.abs(err) <= 0.5 ? 'correctly exposed' : err > 0 ? num(err, 1) + ' stops too bright' : num(-err, 1) + ' stops too dark');
        ro.set('H', num(Hh2, Hh2 < 0.01 ? 4 : 3) + ' lx·s  (the same at any ISO)');
        ro.set('e', Math.round(eMid) + ' electrons (QE 0.6, 5.9 µm pixels)');
        const sn = O.cam.snr({ photons: eMid / QE, qe: QE, read: READ });
        ro.set('snr', num(sn.snr, 1) + '  (' + num(sn.db, 1) + ' dB)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the iris and the f-stops */
  Hyper.sim('cb-aperture', {
    title: 'The iris: f-stops, blades and the discs of out-of-focus light',
    blurb: `A lens of the focal length you choose, an iris of five to nine blades, and three point lights at 1.5 m, 3 m and 10 m. The lens is focused on one of them; each of the others becomes a disc of blur whose **size** is set by the aperture and whose **shape** is the shape of the opening. The scale at the bottom shows the depth of field (circle of confusion 0.03 mm, full frame).

**Try this**
- Focus on the 3 m light and open the iris from f/8 to f/1.4: the discs of the near and far lights grow in proportion to 1/N, and the depth of field shrinks.
- Change the number of blades: the discs become pentagons, hexagons, heptagons. Tick **rounded blades** and they become circles.
- Raise the focal length from 50 to 200 mm at the same f-number: the discs grow with f² (the opening grows too), and the depth of field becomes thin.
- Focus on the far light: the near one is blurred, and the depth of field extends far beyond.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 320, maxH: 450 });
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'f-number', min: 1.4, max: 22, value: params.N || 2.8, log: true, sig: 3, fmt: v => 'f/' + kit.fmt(v, 3) },
        { id: 'blades', type: 'select', label: 'Blades', options: [5, 6, 7, 8, 9].map(n => [n + ' blades', n]), value: 7 },
        { id: 'round', type: 'check', label: 'Rounded blades', value: false },
        { id: 'f', label: 'Focal length', min: 24, max: 200, step: 1, value: params.f || 50, unit: 'mm' },
        { id: 'focus', type: 'select', label: 'Focused on', options: [['the near light, 1.5 m', 1500], ['the middle light, 3 m', 3000], ['the far light, 10 m', 10000]], value: 3000 },
        { type: 'buttons', items: STOPS.map(n => ({ id: 's' + n, label: 'f/' + n })) }
      ], id => { if (/^s[\d.]+$/.test(id)) ctl.set('N', +id.slice(1)); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['D', 'Opening of the iris'], ['light', 'Light, against f/1.4'], ['dof', 'Depth of field'], ['near', 'Blur of the near light'], ['far', 'Blur of the far light'], ['airy', 'Airy disc, green light']]);
      const DIST = [1500, 3000, 10000];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const N = V.N, f = V.f, n = V.blades, rnd = V.round, D = f / N, rot = -Math.PI / 2;
        // the iris
        const R0 = Math.min(W * 0.14, Hh * 0.26), icx = 18 + R0, icy = Hh * 0.36, r = Math.max(2.5, R0 * 0.92 * Math.min(1, 1.4 / N));
        const opening = () => { c.beginPath(); if (rnd) { c.arc(icx, icy, r, 0, 2 * Math.PI); } else polyPath(c, icx, icy, r, n, rot); };
        c.beginPath(); c.arc(icx, icy, R0, 0, 2 * Math.PI); if (rnd) { c.moveTo(icx + r, icy); c.arc(icx, icy, r, 0, 2 * Math.PI); } else polyPath(c, icx, icy, r, n, rot);
        c.fillStyle = C.dark ? '#39405f' : '#aab2cc'; c.fill('evenodd');
        opening(); c.fillStyle = 'rgb(255,244,214)'; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.4; c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath();
        for (let i = 0; i < n; i++) { const a = rot + 2 * Math.PI * i / n; c.moveTo(icx + r * Math.cos(a), icy + r * Math.sin(a)); c.lineTo(icx + R0 * Math.cos(a + 0.5), icy + R0 * Math.sin(a + 0.5)); }
        c.stroke();
        c.beginPath(); c.arc(icx, icy, R0, 0, 2 * Math.PI); c.strokeStyle = C.text; c.lineWidth = 1.4; c.stroke();
        kit.label(c, 'f/' + kit.fmt(N, 3), icx, icy + R0 + 20, { align: 'center', weight: 650, size: 15 });
        kit.label(c, 'opening ' + num(D, 1) + ' mm', icx, icy + R0 + 38, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, (rnd ? 'rounded' : n) + ' blades', icx, icy - R0 - 12, { align: 'center', color: C.muted, size: 11.5 });
        // three lights, one in focus
        const x0 = icx + R0 + 40, wr = W - x0 - 12, wc = wr / 3, cellTop = 22, cellH = Hh * 0.52;
        const siF = O.thinLens(f, V.focus).si, kpx = 3 * (W * 0.6) / 36;
        const blurs = DIST.map(s => { const si = O.thinLens(f, s).si; return D * Math.abs(siF - si) / si; });
        DIST.forEach((s, i) => {
          const cx = x0 + wc * (i + 0.5), cy = cellTop + cellH / 2, b = blurs[i], rad = clamp(b * kpx / 2, 1.5, cellH * 0.44);
          c.fillStyle = C.bg2; c.fillRect(x0 + wc * i + 3, cellTop, wc - 6, cellH); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0 + wc * i + 3.5, cellTop + 0.5, wc - 7, cellH - 1);
          c.beginPath(); if (rnd || b * kpx / 2 < 2.2) c.arc(cx, cy, rad, 0, 2 * Math.PI); else polyPath(c, cx, cy, rad, n, rot);
          c.globalAlpha = b * kpx / 2 < 2.2 ? 1 : 0.62; c.fillStyle = 'rgb(255,226,150)'; c.fill(); c.globalAlpha = 1;
          if (rad > 3) { c.strokeStyle = 'rgba(255,236,190,0.9)'; c.lineWidth = 1.2; c.stroke(); }
          kit.label(c, s / 1000 + ' m', cx, cellTop + 14, { align: 'center', color: C.text, weight: 650, size: 12 });
          kit.label(c, b < 0.012 ? 'in focus' : 'blur ' + num(b, b < 0.1 ? 3 : 2) + ' mm' + (b * kpx / 2 > cellH * 0.44 ? ' (too big to draw)' : ''), cx, cellTop + cellH - 12, { align: 'center', color: b < 0.012 ? C.ok : C.muted, size: 11.5 });
        });
        kit.label(c, 'blur discs of the three lights on the sensor, drawn × 3', x0 + wr / 2, cellTop + cellH + 14, { align: 'center', color: C.faint, size: 11 });
        // the depth of field on a distance scale, 1 m to 30 m
        const ax0 = x0 + 8, ax1 = x0 + wr - 8, ay = Hh * 0.8, P = s => ax0 + (ax1 - ax0) * Math.log(clamp(s, 1000, 30000) / 1000) / Math.log(30);
        const dof = O.cam.dof({ f, N, s: V.focus, c: 0.03 });
        c.fillStyle = C.faint; c.fillRect(ax0, ay - 2, ax1 - ax0, 4);
        c.fillStyle = C.ok; c.globalAlpha = 0.55; c.fillRect(P(dof.near), ay - 11, P(fin(dof.far) ? dof.far : 30000) - P(dof.near), 22); c.globalAlpha = 1;
        for (const m of [1, 2, 3, 5, 10, 20, 30]) { c.fillStyle = C.muted; c.fillRect(P(m * 1000) - 0.5, ay + 12, 1, 5); kit.label(c, m + ' m', P(m * 1000), ay + 28, { align: 'center', color: C.muted, size: 10.5 }); }
        DIST.forEach((s, i) => { const inside = s >= dof.near - 1 && s <= dof.far + 1; kit.dot(c, P(s), ay, 5.5, inside ? C.ok : C.bad, C.bg2); });
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(P(V.focus), ay - 16); c.lineTo(P(V.focus), ay + 16); c.stroke();
        kit.label(c, 'depth of field: ' + num(dof.near / 1000, 2) + ' m to ' + (fin(dof.far) ? num(dof.far / 1000, 2) + ' m' : 'infinity'), (ax0 + ax1) / 2, ay - 26, { align: 'center', weight: 650, size: 12.5 });
        ro.set('D', num(D, 1) + ' mm  (f/N)');
        ro.set('light', stopsStr(-2 * Math.log2(N / 1.4)));
        ro.set('dof', fin(dof.far) ? num(dof.near / 1000, 2) + ' to ' + num(dof.far / 1000, 2) + ' m  (' + num(dof.total / 1000, 2) + ' m deep)' : 'from ' + num(dof.near / 1000, 2) + ' m to infinity');
        ro.set('near', num(blurs[0], 3) + ' mm on the sensor');
        ro.set('far', num(blurs[2], 3) + ' mm on the sensor');
        ro.set('airy', num(2.44 * 0.55 * N, 1) + ' µm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the focal-plane shutter */
  Hyper.sim('cb-focalplane', {
    title: 'A focal-plane shutter in slow motion: two curtains, a slit, a skewed subject',
    blurb: `Left: the frame seen through the shutter, in slow motion. Two curtains move across, first one opening and, after the exposure time, the second one closing. A dark bar moves across the field. Right: the picture, built row by row. Each row is exposed for exactly the set time, but the rows are exposed one after another.

**Try this**
- At **1/4000 s** with a 4 ms curtain: the slit is under 1.5 mm of the 24 mm frame. The bar *leans* in the picture, because the top row was exposed 4 ms before the bottom one.
- Slow the time to **1/60 s**: the whole frame is open at once for a while, the lean is the same, but the bar is also smeared across its width.
- Tick **flash**: at 1/250 s the flash fires with the whole frame open and lights it all. At 1/1000 s a dark band appears at the top: the second curtain had already covered it.
- Switch to the **leaf shutter**: no lean, and the flash lights the whole frame at every time.
- Shorten the curtain travel (1 ms) and the sync speed rises; lengthen it to 12 ms (a cloth shutter) and the lean grows.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 310, maxH: 430 });
      let clk = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Shutter', options: [['Focal-plane: two curtains', 'fp'], ['Leaf: in the lens', 'leaf']], value: params.mode || 'fp' },
        { id: 't', type: 'select', label: 'Exposure time', options: timeOptions(TIMES.slice(0, 10)), value: params.t || 1 / 2000 },
        { id: 'Tc', label: 'Curtain travel time', min: 1, max: 12, step: 0.5, value: 4, unit: 'ms' },
        { id: 'v', label: 'Subject speed across the frame', min: 0, max: 40, step: 1, value: 20, unit: 'frame widths/s' },
        { id: 'flash', type: 'check', label: 'Fire a flash', value: !!params.flash },
        { type: 'buttons', items: [{ id: 'again', label: 'Fire again', primary: true }] }
      ], id => { if (id === 'again') clk = 0; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Exposure time'], ['Tc', 'Curtain travel time'], ['slit', 'Slit width (24 mm frame)'], ['sync', 'Fastest full-frame flash sync'], ['flash', 'The flash'], ['lean', 'Lean of the moving bar'], ['slow', 'Playing']]);
      const P = 5.2, T0 = 0.5, TS = 3;
      const loop = kit.loop(dt => {
        clk = (clk + dt) % P;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const leaf = V.mode === 'leaf', Tc = V.Tc * 1e-3, t = V.t, Dreal = leaf ? t : Tc + t;
        const tau = clamp((clk - T0) / TS, 0, 1) * Dreal, tauF = leaf ? t / 2 : Tc;
        const xs = tt => 0.5 + V.v * (tt - Dreal / 2), bw = 0.07;
        const gap = 18, pw = (W - 3 * gap) / 2, fw = Math.min(pw, (Hh - 96) * 1.5), fh = fw * 2 / 3, lx = gap + (pw - fw) / 2, rx = 2 * gap + pw + (pw - fw) / 2, fy = 40;
        // what is open now: the rows between from and to (0 at the top, 1 at the bottom)
        const open = tt => leaf ? (tt > 0 && tt < t ? [0, 1] : [0, 0]) : [clamp((tt - t) / Tc, 0, 1), clamp(tt / Tc, 0, 1)];
        const [o0, o1] = open(tau);
        c.fillStyle = C.dark ? '#0c0e18' : '#2a2d3a'; c.fillRect(lx, fy, fw, fh);
        const flashNow = V.flash && clk >= T0 + TS * tauF / Dreal && clk < T0 + TS * tauF / Dreal + 0.35;
        if (o1 > o0) {
          c.save(); c.beginPath(); c.rect(lx, fy + o0 * fh, fw, (o1 - o0) * fh); c.clip();
          c.fillStyle = flashNow ? '#fff1b8' : '#cfd6e6'; c.fillRect(lx, fy, fw, fh);
          c.fillStyle = '#1b1d2a'; c.fillRect(lx + (xs(tau) - bw / 2) * fw, fy, bw * fw, fh);
          c.restore();
        }
        if (!leaf) { c.strokeStyle = C.warn; c.lineWidth = 2; for (const y of [o0, o1]) if (y > 0 && y < 1) { c.beginPath(); c.moveTo(lx, fy + y * fh); c.lineTo(lx + fw, fy + y * fh); c.stroke(); } }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(lx + 0.5, fy + 0.5, fw, fh);
        kit.label(c, leaf ? 'through the leaf shutter' : 'through the two curtains', lx + fw / 2, fy - 14, { align: 'center', color: C.muted, size: 12, weight: 650 });
        kit.label(c, 'real time ' + num(tau * 1000, 2) + ' ms', lx + fw / 2, fy + fh + 14, { align: 'center', color: C.muted, size: 11.5 });
        if (flashNow) kit.label(c, 'FLASH', lx + fw - 8, fy + 14, { align: 'right', color: C.warn, weight: 700, size: 13 });
        // the picture, row by row
        const nr = 96;
        c.fillStyle = C.bg2; c.fillRect(rx, fy, fw, fh);
        for (let k = 0; k < nr; k++) {
          const y = (k + 0.5) / nr, t1 = leaf ? 0 : Tc * y, t2 = t1 + t;
          if (tau < t2 - 1e-12) continue;
          const lit = V.flash && t1 <= tauF && tauF <= t2, bg = V.flash ? (lit ? 232 : 34) : 150, ry = fy + fh * k / nr, rh = fh / nr + 0.6;
          c.fillStyle = 'rgb(' + bg + ',' + bg + ',' + Math.min(255, bg + 8) + ')'; c.fillRect(rx, ry, fw, rh);
          const a = clamp(xs(t1) - bw / 2, -0.2, 1.2), b = clamp(xs(t2) + bw / 2, -0.2, 1.2), xa = Math.max(0, a), xb = Math.min(1, b);
          if (xb > xa) { c.fillStyle = V.flash ? (lit ? 'rgba(27,29,42,0.28)' : 'rgba(12,14,24,0.7)') : 'rgba(27,29,42,0.78)'; c.fillRect(rx + xa * fw, ry, (xb - xa) * fw, rh); }
          if (lit) { const sx = xs(tauF); const xa2 = Math.max(0, sx - bw / 2), xb2 = Math.min(1, sx + bw / 2); if (xb2 > xa2) { c.fillStyle = '#1b1d2a'; c.fillRect(rx + xa2 * fw, ry, (xb2 - xa2) * fw, rh); } }
        }
        c.strokeStyle = C.axis; c.strokeRect(rx + 0.5, fy + 0.5, fw, fh);
        kit.label(c, 'the picture', rx + fw / 2, fy - 14, { align: 'center', color: C.muted, size: 12, weight: 650 });
        const frac = leaf ? 1 : clamp(t / Tc, 0, 1), dark = leaf ? 0 : Math.max(0, 1 - t / Tc), lean = V.v * Tc;
        if (V.flash && dark > 0) kit.label(c, 'no flash light on this band', rx + fw / 2, fy + dark * fh / 2, { align: 'center', color: C.warn, size: 11.5, weight: 650 });
        ro.set('t', tfmt(t));
        ro.set('Tc', leaf ? 'not applicable: the whole frame opens at once' : num(V.Tc, 1) + ' ms');
        ro.set('slit', leaf ? 'the whole frame' : t >= Tc ? 'the whole frame is open for ' + num((t - Tc) * 1000, 1) + ' ms' : num(24 * frac, 1) + ' mm (' + num(100 * frac, 0) + ' % of the height)');
        ro.set('sync', leaf ? 'every speed' : '1/' + Math.round(1 / Tc) + ' s (time ≥ ' + num(V.Tc, 1) + ' ms)');
        ro.set('flash', !V.flash ? 'off' : dark > 0 ? 'lights only the bottom ' + num(24 * (1 - dark), 1) + ' mm; the top ' + num(24 * dark, 1) + ' mm is dark' : 'lights the whole frame');
        ro.set('lean', leaf ? 'none: the whole frame is exposed together' : num(100 * lean, lean < 0.1 ? 1 : 0) + ' % of the frame width from top to bottom');
        ro.set('slow', 'slow motion × ' + nfmt(TS / Dreal));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ the rotary disc shutter of a cine camera */
  Hyper.sim('cb-disc', {
    title: 'A cine camera\'s rotary shutter: shutter angle and the look of motion',
    blurb: `A disc with a sector cut out turns once per frame in front of the film gate (shown in slow motion). While the opening passes the gate the film is exposed; while the solid part passes, the film is pulled down to the next frame. Below the disc, one frame period is drawn as a bar; on the right, six consecutive frames of a ball crossing the picture.

**Try this**
- A **180°** shutter at 24 frames/s exposes for 1/48 s: each ball has a streak half as long as the step to the next frame. This is the "film look".
- Open the disc to **360°** (no film pulldown, as in a video camera): the streaks join into a continuous smear, 1/24 s.
- Close it to **45°**: each ball is crisp but the six positions are separate: motion looks staccato.
- Tick *a film camera*: the disc cannot open beyond 200°, because the film has to move while it is shut.
- At 48 frames/s and 180° the exposure is 1/96 s: half the light and half the streak.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 310, maxH: 430 });
      let clk = 0;
      const ctl = kit.controls(box.side, [
        { id: 'fps', type: 'select', label: 'Frame rate', options: [12, 24, 25, 30, 48, 60].map(r => [r + ' frames/s', r]), value: params.fps || 24 },
        { id: 'angle', label: 'Opening of the disc (shutter angle)', min: 5, max: 360, step: 1, value: params.angle || 180, unit: '°' },
        { id: 'v', label: 'Speed of the ball', min: 0, max: 8, step: 0.25, value: 3, unit: 'frame widths/s' },
        { id: 'film', type: 'check', label: 'A film camera: the film must be pulled down while the disc is shut', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Exposure time'], ['open', 'Light collected, against 360°'], ['streak', 'Streak of each ball'], ['step', 'Step between frames'], ['look', 'The look of motion'], ['slow', 'Playing']]);
      const TREV = 1.6;
      const loop = kit.loop(dt => {
        clk += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const fps = V.fps, ang = V.film ? Math.min(V.angle, 200) : V.angle, th = ang * D2R, t = ang / (360 * fps);
        const R = Math.min(W * 0.17, Hh * 0.3), cx = 20 + R, cy = 36 + R, phi = (clk / TREV) * 2 * Math.PI;
        // the disc: solid with an open sector from phi to phi + th
        c.fillStyle = C.dark ? '#39405f' : '#aab2cc'; c.beginPath(); c.arc(cx, cy, R, 0, 2 * Math.PI); c.fill();
        c.fillStyle = C.bg2; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R, phi, phi + th); c.closePath(); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1.4; c.beginPath(); c.arc(cx, cy, R, 0, 2 * Math.PI); c.stroke();
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + R * Math.cos(phi), cy + R * Math.sin(phi)); c.moveTo(cx, cy); c.lineTo(cx + R * Math.cos(phi + th), cy + R * Math.sin(phi + th)); c.stroke();
        kit.dot(c, cx, cy, 3, C.text);
        // the gate at the top of the disc
        const gx = cx, gy = cy - R * 0.62, rel = ((-Math.PI / 2 - phi) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI), exposing = rel < th;
        c.fillStyle = exposing ? C.warn : C.surface; c.fillRect(gx - R * 0.2, gy - R * 0.13, R * 0.4, R * 0.26); c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(gx - R * 0.2, gy - R * 0.13, R * 0.4, R * 0.26);
        kit.label(c, exposing ? 'film gate: exposing' : 'film gate: shut, film moves', cx, cy + R + 16, { align: 'center', color: exposing ? C.warn : C.muted, weight: 650, size: 12 });
        kit.label(c, 'the disc turns once per frame', cx, 18, { align: 'center', color: C.muted, size: 11.5 });
        // six consecutive frames of a ball
        const sx = cx + R + 36, sw = W - sx - 12, g6 = 6, fw6 = (sw - 5 * g6) / 6, fh6 = Math.min(fw6 * 2 / 3, Hh * 0.28), fy6 = 36;
        const step = V.v / fps, len = step * ang / 360;                     // frame widths: the step between frames and the streak in each
        for (let k = 0; k < 6; k++) {
          const fx = sx + k * (fw6 + g6);
          c.fillStyle = '#cfd6e6'; c.fillRect(fx, fy6, fw6, fh6);
          const xc = 0.12 + k * step, rr = 0.07 * fh6 / fw6;
          const a = xc - len / 2, b = xc + len / 2;
          c.save(); c.beginPath(); c.rect(fx, fy6, fw6, fh6); c.clip(); c.fillStyle = 'rgba(27,29,42,0.82)';
          c.fillRect(fx + a * fw6, fy6 + fh6 / 2 - rr * fw6, (b - a) * fw6, 2 * rr * fw6);
          c.beginPath(); c.arc(fx + a * fw6, fy6 + fh6 / 2, rr * fw6, 0, 2 * Math.PI); c.arc(fx + b * fw6, fy6 + fh6 / 2, rr * fw6, 0, 2 * Math.PI); c.fill();
          c.restore();
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(fx + 0.5, fy6 + 0.5, fw6, fh6);
          kit.label(c, String(k + 1), fx + fw6 / 2, fy6 + fh6 + 11, { align: 'center', color: C.faint, size: 10.5 });
        }
        kit.label(c, 'six consecutive frames: the ball and its streak', sx + sw / 2, fy6 - 14, { align: 'center', color: C.muted, size: 12, weight: 650 });
        // one frame period as a bar, with a marker for the disc
        const bx0 = sx, bx1 = W - 12, by = fy6 + fh6 + 62, bwid = bx1 - bx0, frac = ang / 360;
        c.fillStyle = C.faint; c.fillRect(bx0, by, bwid, 16);
        c.fillStyle = C.warn; c.fillRect(bx0, by, bwid * frac, 16);
        const m = (((phi) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) / (2 * Math.PI);
        c.fillStyle = C.text; c.beginPath(); c.moveTo(bx0 + bwid * m, by + 18); c.lineTo(bx0 + bwid * m - 5, by + 28); c.lineTo(bx0 + bwid * m + 5, by + 28); c.closePath(); c.fill();
        kit.label(c, 'open: ' + tfmt(t), bx0 + bwid * frac / 2, by + 8, { align: 'center', color: '#1b1d2a', size: 11.5, weight: 650 });
        if (frac < 0.97) kit.label(c, V.film && frac < 0.7 ? 'shut: the film is pulled down' : 'shut', bx0 + bwid * (1 + frac) / 2, by + 8, { align: 'center', color: C.text, size: 11.5 });
        kit.label(c, 'one frame period = 1/' + fps + ' s', bx0 + bwid / 2, by + 44, { align: 'center', color: C.muted, size: 11.5 });
        ro.set('t', tfmt(t) + (V.film && V.angle > 200 ? '   (the disc is held to 200° in a film camera)' : ''));
        ro.set('open', stopsStr(Math.log2(frac)) + '  (' + num(100 * frac, 0) + ' % of the time)');
        ro.set('streak', num(100 * len, 1) + ' % of the frame width');
        ro.set('step', num(100 * step, 1) + ' % of the frame width');
        ro.set('look', V.v === 0 ? 'the ball is still' : ang >= 270 ? 'a continuous smear' : ang >= 120 ? 'natural motion blur: smooth' : ang >= 60 ? 'crisp, slightly choppy' : 'staccato: sharp ball, jumps between frames');
        ro.set('slow', 'slow motion × ' + nfmt(fps * TREV));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ a car and the exposure time */
  Hyper.sim('cb-motion', {
    title: 'Motion blur: speed, exposure time, lens and distance',
    blurb: `A car (4.5 m long) crosses the frame. The picture shows what the sensor (36 mm wide, 5.9 µm pixels) records for the chosen time. The blur on the sensor is **v · t · m**; the read-out converts it to pixels.

**Try this**
- Set 50 km/h, 20 m and 100 mm: at **1/500 s** the car is smeared across about 24 pixels; at 1/2000 s about 6. Press the times one by one.
- Move the car to 60 m: the blur falls by three, because the magnification does. Change the lens to 400 mm: it rises by four.
- Tick **pan** and set an accuracy of 95 %: the car becomes sharp, and the background posts become streaks. Lower the accuracy to 80 % to see the car blur again.
- At 1/15 s with panning, the background posts are smeared across about an eighth of the frame.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320, maxH: 450 });
      const ctl = kit.controls(box.side, [
        { id: 't', type: 'select', label: 'Exposure time', options: timeOptions([1 / 2000, 1 / 1000, 1 / 500, 1 / 250, 1 / 125, 1 / 60, 1 / 30, 1 / 15, 1 / 8, 1 / 4]), value: params.t || 1 / 500 },
        { id: 'kmh', label: 'Speed of the car', min: 5, max: 200, value: params.kmh || 50, log: true, sig: 2, unit: 'km/h' },
        { id: 'dist', label: 'Distance to the car', min: 5, max: 100, step: 1, value: params.dist || 20, unit: 'm' },
        { id: 'f', label: 'Focal length', min: 24, max: 400, step: 1, value: params.f || 100, unit: 'mm' },
        { id: 'pan', type: 'check', label: 'Pan with the car', value: !!params.pan },
        { id: 'acc', label: 'Accuracy of the pan', min: 80, max: 100, step: 0.5, value: 95, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['W', 'Width of the scene at the car'], ['move', 'Car moves in the exposure'], ['m', 'Magnification'], ['blur', 'Blur of the car on the sensor'], ['bg', 'Blur of the background'], ['verdict', 'The car is']]);
      const PITCH_UM = 5.9, SENSOR_W = 36;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const t = V.t, v = V.kmh / 3.6, s = V.dist * 1000, f = V.f, m = O.cam.magnification(f, s);
        const sceneW = SENSOR_W / m / 1000;                                           // metres across the frame at the car
        const fw = Math.min(W - 28, (Hh - 28) * 1.5), fh = fw * 2 / 3, fx = (W - fw) / 2, fy = (Hh - fh) / 2;
        const blurPx = O.cam.motionBlur(v * 1000, t, m, PITCH_UM), acc = V.pan ? V.acc / 100 : 0;
        const carPx = V.pan ? blurPx * (1 - acc) : blurPx, bgPx = V.pan ? blurPx * acc : 0;
        const toFw = px => px * PITCH_UM / 1000 / SENSOR_W;                          // pixels → fractions of the frame width
        c.save(); c.beginPath(); c.rect(fx, fy, fw, fh); c.clip();
        c.fillStyle = '#b9cdea'; c.fillRect(fx, fy, fw, fh * 0.62); c.fillStyle = '#7e8a66'; c.fillRect(fx, fy + fh * 0.62, fw, fh * 0.38);
        c.fillStyle = '#5b6a8a'; c.fillRect(fx, fy + fh * 0.5, fw, fh * 0.12);
        // background posts: still, or streaked by the pan
        const bl = toFw(bgPx) * fw;
        for (let i = -1; i < 12; i++) { const x = fx + (i * 0.1 + 0.03) * fw; c.fillStyle = bl > 1.5 ? 'rgba(60,50,40,' + clamp(0.55 * 5 / (5 + bl), 0.1, 0.9) + ')' : '#3c3228'; c.fillRect(x, fy + fh * 0.4, 0.014 * fw + bl, fh * 0.27); }
        // the car, drawn as a stack of copies across the streak
        const cw = clamp(4.5 / sceneW, 0.05, 0.8) * fw, ch = cw * 0.3, cy0 = fy + fh * 0.62, ccx = fx + fw * 0.5, len = toFw(carPx) * fw, n = clamp(Math.ceil(len / 2), 1, 48);
        const car = x => {
          c.fillStyle = '#c4343a'; c.beginPath(); c.rect(x - cw / 2, cy0 - ch * 0.62, cw, ch * 0.5); c.fill();
          c.beginPath(); c.moveTo(x - cw * 0.28, cy0 - ch * 0.62); c.lineTo(x - cw * 0.16, cy0 - ch); c.lineTo(x + cw * 0.18, cy0 - ch); c.lineTo(x + cw * 0.32, cy0 - ch * 0.62); c.closePath(); c.fill();
          c.fillStyle = '#9fb7d9'; c.beginPath(); c.moveTo(x - cw * 0.22, cy0 - ch * 0.65); c.lineTo(x - cw * 0.13, cy0 - ch * 0.93); c.lineTo(x + cw * 0.16, cy0 - ch * 0.93); c.lineTo(x + cw * 0.26, cy0 - ch * 0.65); c.closePath(); c.fill();
          c.fillStyle = '#1b1d2a'; for (const dx of [-0.3, 0.3]) { c.beginPath(); c.arc(x + dx * cw, cy0 - ch * 0.12, ch * 0.2, 0, 2 * Math.PI); c.fill(); }
        };
        for (let i = 0; i < n; i++) { c.globalAlpha = n === 1 ? 1 : clamp(2.4 / n, 0.06, 0.6); car(ccx - len / 2 + (n > 1 ? len * i / (n - 1) : 0)); }
        c.globalAlpha = 1; c.restore();
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(fx + 0.5, fy + 0.5, fw, fh);
        kit.label(c, V.pan ? 'panning: the car is held, the world streaks' : 'camera still: the world is sharp, the car streaks', fx + fw / 2, fy - 10, { align: 'center', color: C.muted, size: 12, weight: 650 });
        const verdict = carPx <= 1.5 ? 'frozen' : carPx <= 4 ? 'almost sharp' : carPx <= 12 ? 'visibly blurred' : 'a streak';
        ro.set('W', num(sceneW, 1) + ' m  (the sensor is 36 mm wide)');
        ro.set('move', num(v * t * 1000, v * t * 1000 < 10 ? 1 : 0) + ' mm in the scene');
        ro.set('m', '1 : ' + nfmt(1 / m));
        ro.set('blur', V.pan ? num(carPx * PITCH_UM, 0) + ' µm = ' + num(carPx, 1) + ' pixels (the pan is ' + num(100 * acc, 1) + ' % accurate)' : num(blurPx * PITCH_UM, 0) + ' µm = ' + num(blurPx, 1) + ' pixels');
        ro.set('bg', V.pan ? num(bgPx, 0) + ' pixels (' + num(100 * toFw(bgPx), 1) + ' % of the frame width)' : 'none: the camera is still');
        ro.set('verdict', verdict);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ hand shake and stabilization */
  Hyper.sim('cb-shake', {
    title: 'Camera shake on the pixels: the 1/focal-length rule and stops of stabilization',
    blurb: `A distant star (a point) photographed hand-held. The squares are pixels of 5.9 µm; the glow is the exposure accumulating as the image wanders over them in slow motion. The shake is a random mix of 1.5, 4 and 9 Hz turns of the camera; a **stabilizer** removes a factor 2^k of it. On the right: the sideways displacement of the image during the exposure (the shaded window).

**Try this**
- 200 mm at **1/250 s** (close to the rule of thumb) with no stabilization: the star spreads over two or three pixels. At 1/30 s it becomes a line of about fifteen.
- Give the stabilizer **4 stops**: the same 1/30 s is about as sharp as 1/500 s was.
- Raise the focal length to 600 mm at the same time: the blur grows in proportion.
- Make the exposure long (1/4 s): the path is no longer a line, it wanders across several cycles of the shake.
- Press **New shake**: no two shakes are alike; the rule is a guide, not a promise.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 310, maxH: 430 });
      let seed = 1, clk = 0;
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Focal length (35 mm equivalent)', min: 24, max: 600, value: params.f || 200, log: true, sig: 3, unit: 'mm' },
        { id: 't', type: 'select', label: 'Exposure time', options: timeOptions([1 / 1000, 1 / 500, 1 / 250, 1 / 125, 1 / 60, 1 / 30, 1 / 15, 1 / 8, 1 / 4]), value: params.t || 1 / 125 },
        { id: 'k', label: 'Stabilization', min: 0, max: 8, step: 0.5, value: params.stops != null ? params.stops : 0, unit: 'stops' },
        { id: 'w', label: 'How shaky the hands are (rms turning speed)', min: 0.2, max: 2, step: 0.05, value: 0.8, unit: '°/s' },
        { type: 'buttons', items: [{ id: 'new', label: 'New shake', primary: true }] }
      ], id => { if (id === 'new') { seed++; clk = 0; } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['path', 'Blur of the point'], ['px', 'in pixels'], ['verdict', 'The picture is'], ['rule', 'Rule of thumb: longest time'], ['with', 'With the stabilization'], ['ratio', 'Your time against that']]);
      const NX = 25, NY = 15, PIT = 0.0059, M = 160, P = 5.5;
      const mk = sd => {
        const comp = [0, 1, 2].map(k => ({ w: 2 * Math.PI * [1.5, 4, 9][k] * (0.85 + 0.3 * hash(sd, k, 1)), px: 2 * Math.PI * hash(sd, k, 2), py: 2 * Math.PI * hash(sd, k, 3), ax: 0.6 + 0.8 * hash(sd, k, 4), ay: 0.6 + 0.8 * hash(sd, k, 5) }));
        const nx = Math.sqrt(comp.reduce((a, q) => a + q.ax * q.ax / 2, 0)), ny = Math.sqrt(comp.reduce((a, q) => a + q.ay * q.ay / 2, 0));
        // the turn of the camera (radians) since the start, for 1 rad/s rms of turning speed
        return u => { let x = 0, y = 0; for (const q of comp) { x += q.ax / q.w * (Math.cos(q.px) - Math.cos(q.w * u + q.px)); y += q.ay / q.w * (Math.cos(q.py) - Math.cos(q.w * u + q.py)); } return [x / nx, y / ny]; };
      };
      const loop = kit.loop(dt => {
        clk += dt;
        if (clk > P) { clk = 0; seed++; }
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const f = V.f, t = V.t, w = V.w * D2R, kf = Math.pow(2, -V.k), shake = mk(seed);
        // the path of the image on the sensor, in mm
        const path = []; let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
        for (let j = 0; j < M; j++) { const a = shake(t * j / (M - 1)), px = f * Math.tan(a[0] * w) * kf, py = f * Math.tan(a[1] * w) * kf; path.push([px, py]); x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py); }
        const blurMm = Math.hypot(x1 - x0, y1 - y0), blurPx = blurMm / PIT, kz = Math.max(1, Math.pow(2, Math.ceil(Math.log2(Math.max(1, blurPx / 10))))), cell = PIT * kz;
        // the exposure builds up as the slow-motion clock runs
        const prog = clamp((clk - 0.3) / 3.2, 0, 1), upto = Math.max(1, Math.round(prog * M)), acc = new Float32Array(NX * NY);
        for (let j = 0; j < upto; j++) {
          const fx = path[j][0] / cell + (NX - 1) / 2, fy = path[j][1] / cell + (NY - 1) / 2, i0 = Math.floor(fx), j0 = Math.floor(fy), tx = fx - i0, ty = fy - j0;
          for (const [di, dj, wt] of [[0, 0, (1 - tx) * (1 - ty)], [1, 0, tx * (1 - ty)], [0, 1, (1 - tx) * ty], [1, 1, tx * ty]]) { const ii = i0 + di, jj = j0 + dj; if (ii >= 0 && jj >= 0 && ii < NX && jj < NY) acc[jj * NX + ii] += wt / M; }
        }
        const gw = Math.min(W * 0.46, Hh * 0.62 * NX / NY), gh = gw * NY / NX, gx = 14, gy = 34;
        S.cells(c, gx, gy, gw, gh, NX, NY, (u, v) => { const i = Math.min(NX - 1, Math.floor(u * NX)), j = Math.min(NY - 1, Math.floor(v * NY)); return acc[j * NX + i]; }, { rgb: [255, 238, 190], gamma: 0.5 });
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); for (let i = 0; i <= NX; i++) { c.moveTo(gx + gw * i / NX, gy); c.lineTo(gx + gw * i / NX, gy + gh); } for (let j = 0; j <= NY; j++) { c.moveTo(gx, gy + gh * j / NY); c.lineTo(gx + gw, gy + gh * j / NY); } c.stroke();
        c.strokeStyle = C.axis; c.strokeRect(gx + 0.5, gy + 0.5, gw, gh);
        kit.label(c, 'the star on the sensor: each square is ' + (kz > 1 ? kz + ' × ' + kz + ' pixels' : 'one pixel (5.9 µm)'), gx + gw / 2, gy - 14, { align: 'center', color: C.muted, size: 11.5, weight: 650 });
        kit.label(c, 'slow motion: the exposure of ' + tfmt(t) + ' is played over 3 s', gx + gw / 2, gy + gh + 14, { align: 'center', color: C.faint, size: 11 });
        // the sideways displacement over time, with and without the stabilizer
        const tx0 = gx + gw + 36, tx1 = W - 14, ty0 = gy, th = gh, span = Math.max(0.3, t * 1.15);
        c.fillStyle = C.surface; c.fillRect(tx0, ty0, tx1 - tx0, th); c.strokeStyle = C.axis; c.strokeRect(tx0 + 0.5, ty0 + 0.5, tx1 - tx0 - 1, th - 1);
        const TX = u => tx0 + 6 + (tx1 - tx0 - 12) * u / span;
        c.fillStyle = 'rgba(224,160,48,0.18)'; c.fillRect(TX(0), ty0, TX(t) - TX(0), th);
        const samples = [];
        let amp = 0.02; for (let j = 0; j <= 80; j++) { const u = span * j / 80, a = shake(u); samples.push([u, f * Math.tan(a[0] * w)]); amp = Math.max(amp, Math.abs(f * Math.tan(a[0] * w))); }
        const YT = y => ty0 + th / 2 - y / amp * (th / 2 - 8);
        const line = (kf2, color, wd) => { c.strokeStyle = color; c.lineWidth = wd; c.beginPath(); samples.forEach((p, j) => { const X = TX(p[0]), Y = YT(p[1] * kf2); if (j) c.lineTo(X, Y); else c.moveTo(X, Y); }); c.stroke(); };
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(tx0, ty0 + th / 2); c.lineTo(tx1, ty0 + th / 2); c.stroke();
        line(1, C.faint, 1.2); if (V.k > 0) line(kf, C.accent, 2);
        kit.label(c, 'sideways displacement of the image (µm)', (tx0 + tx1) / 2, ty0 - 14, { align: 'center', color: C.muted, size: 11.5, weight: 650 });
        kit.label(c, '± ' + num(amp * 1000, 0), tx0 + 8, ty0 + 10, { color: C.faint, size: 10.5 });
        kit.label(c, 'the exposure', TX(t / 2), ty0 + th - 10, { align: 'center', color: C.warn, size: 11 });
        kit.label(c, 'time (s)', (tx0 + tx1) / 2, ty0 + th + 14, { align: 'center', color: C.faint, size: 11 });
        kit.label(c, V.k > 0 ? 'grey: no stabilizer · blue: with ' + num(V.k, 1) + ' stops' : 'grey: no stabilizer', (tx0 + tx1) / 2, ty0 + th + 30, { align: 'center', color: C.faint, size: 11 });
        const rule = 1 / f, withK = Math.pow(2, V.k) / f;
        ro.set('path', num(blurMm * 1000, blurMm * 1000 < 10 ? 1 : 0) + ' µm');
        ro.set('px', num(blurPx, blurPx < 10 ? 1 : 0) + ' pixels of 5.9 µm');
        ro.set('verdict', blurMm <= 0.015 ? 'sharp' : blurMm <= 0.03 ? 'acceptable at normal size (under 30 µm)' : blurMm <= 0.06 ? 'visibly soft' : 'blurred');
        ro.set('rule', tfmt(rule));
        ro.set('with', V.k > 0 ? tfmt(withK) + '  (' + num(V.k, 1) + ' stops)' : 'none set');
        ro.set('ratio', num(t / (V.k > 0 ? withK : rule), 2) + ' × ' + (V.k > 0 ? 'the stabilized limit' : 'the rule'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ISO: one exposure, one gain */
  Hyper.sim('cb-iso', {
    title: 'ISO is gain: the same photons, amplified',
    blurb: `A scene photographed with a sensor of 5.9 µm pixels (quantum efficiency 0.6). The picture is built pixel by pixel from the **photons the exposure really collects** (aperture, time, scene) with their shot noise and the sensor's read noise, then multiplied by the gain that the ISO sets. The patches along the bottom are greys from 3 % to 90 % reflectance.

**Try this**
- Start at the default: a dim room at f/2.8, 1/30 s, ISO 800. The picture is about right, and noisy.
- Lower the ISO to 100: the picture goes dark. Lengthen the time to 1/4 s (three stops, the light that ISO 800 was making up for): it is bright *and* clean. (The button sets the ISO that matches the other two controls.)
- Keep the exposure and raise the ISO to 6400: the picture becomes too bright and clips; the noise does not change at all: ISO adds none, it only amplifies.
- Make the pixels smaller (1.5 µm): the same scene, the same f-number, fewer photons per pixel and a noisier picture.
- Read the signal-to-noise ratio: it is the square root of the number of electrons, as long as the read noise is small.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330, maxH: 470 });
      let seed = 1;
      const SCENES = [['Bright sun (EV 15)', 15], ['Overcast day (EV 12)', 12], ['Lit room or street at night (EV 8)', 8], ['Dim room (EV 5)', 5], ['Candlelight (EV 2)', 2]];
      const ctl = kit.controls(box.side, [
        { id: 'scene', type: 'select', label: 'Scene (metered at ISO 100)', options: SCENES, value: params.scene || 5 },
        { id: 'N', type: 'select', label: 'Aperture', options: STOPS.map(n => ['f/' + n, n]), value: 2.8 },
        { id: 't', type: 'select', label: 'Shutter time', options: timeOptions(TIMES), value: 1 / 30 },
        { id: 'iso', type: 'select', label: 'ISO', options: ISOS.map(i => ['ISO ' + i, i]), value: params.iso || 800 },
        { id: 'pitch', label: 'Pixel size', min: 1.2, max: 8, value: PITCH, log: true, sig: 2, unit: 'µm' },
        { id: 'read', label: 'Read noise', min: 1, max: 10, step: 0.5, value: READ, unit: 'e⁻' },
        { type: 'buttons', items: [{ id: 'set', label: 'Set ISO for a correct exposure', primary: true }, { id: 'new', label: 'New noise' }] }
      ], id => {
        if (id === 'set') { const need = 100 * V.N * V.N / (V.t * Math.pow(2, V.scene)); let best = ISOS[0]; for (const i of ISOS) if (Math.abs(Math.log(i / need)) < Math.abs(Math.log(best / need))) best = i; ctl.set('iso', best); }
        if (id === 'new') seed++;
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ex', 'The picture is'], ['ph', 'Photons per pixel, mid-grey patch'], ['e', 'Electrons collected'], ['snr', 'Shot-noise limit √N'], ['snr2', 'With read noise'], ['mid', 'Mid-grey comes out at']]);
      let cache = { key: null };
      const REFL = (u, v) => {
        if (v > 0.84) { const k = Math.min(7, Math.floor(u * 8)); return 0.03 * Math.pow(30, k / 7); }                    // eight grey patches, 3 % … 90 %
        if (Math.hypot((u - 0.78) * 1.6, v - 0.2) < 0.07) return 0.9;                                                     // the lamp or the sun
        if (u > 0.18 && u < 0.46 && v > 0.32 && v < 0.64) return (u > 0.25 && u < 0.32 && v > 0.4 && v < 0.5) || (u > 0.34 && u < 0.41 && v > 0.4 && v < 0.5) ? 0.04 : 0.3;
        if (v > 0.6) return 0.07 + 0.05 * Math.sin(u * 17);
        return 0.55 - 0.35 * v;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const ev = V.scene, N = V.N, t = V.t, iso = V.iso, pitch = V.pitch, read = V.read, well = wellOf(O, pitch);
        const NX = 120, NY = 76, pw = Math.min(W - 28, (Hh - 40) * NX / NY), ph = pw * NY / NX, px = (W - pw) / 2, py = 26;
        const unit = electrons(O, ev, N, t, pitch, 1 / 0.18);                       // electrons for reflectance 100 % (rel = R / 0.18)
        const key = [ev, N, t, iso, pitch.toFixed(2), read, seed].join('|');
        S.image(c, px, py, pw, ph, NX, NY, (u, v) => {
          const i = Math.min(NX - 1, Math.floor(u * NX)), j = Math.min(NY - 1, Math.floor(v * NY)), e = unit * REFL(u, v);
          const sample = e + Math.sqrt(e + read * read) * gauss(i, j, seed);
          const g = srgb(sample * (iso / 100) / well * 1.44);
          return [g, g, g * 0.96 + 4];
        }, { key: 'iso' + key, id: 'iso', smooth: false });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(px + 0.5, py + 0.5, pw, ph);
        kit.label(c, 'greys: 3 %', px + 4, py + ph + 12, { size: 10.5, color: C.faint }); kit.label(c, '90 % reflectance', px + pw, py + ph + 12, { size: 10.5, color: C.faint, align: 'right' });
        const eMid = unit * 0.18, snr = O.cam.snr({ photons: eMid / QE, qe: QE, read }), mid = srgb(eMid * (iso / 100) / well * 1.44) / 2.55;
        const evSet = Math.log2(N * N / t) - Math.log2(iso / 100), err = ev - evSet;
        ro.set('ex', Math.abs(err) <= 0.5 ? 'correctly exposed' : err > 0 ? num(err, 1) + ' stops too bright' : num(-err, 1) + ' stops too dark');
        ro.set('ph', Math.round(eMid / QE) + '  (at f/' + N + ', ' + tfmt(t) + ')');
        ro.set('e', Math.round(eMid) + ' e⁻   (full well ' + Math.round(well) + ' e⁻)');
        ro.set('snr', num(Math.sqrt(eMid), 1) + '  (' + num(20 * Math.log10(Math.sqrt(Math.max(1e-9, eMid))), 1) + ' dB)');
        ro.set('snr2', num(snr.snr, 1) + '  (' + num(snr.db, 1) + ' dB)');
        ro.set('mid', num(mid, 0) + ' % of the output range  (a correct exposure gives about 46 %)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ metering: snow, a grey card, a black cat */
  Hyper.sim('cb-metering', {
    title: 'Metering: a meter reads brightness, not the subject',
    blurb: `A subject in a scene of sky, trees and ground, in sun or under cloud. A **reflected-light** meter (average, centre-weighted or spot) reads the luminance and renders what it reads as mid-grey; an **incident** meter reads the light falling on the subject. The histogram shows the result: how many pixels are at each level, black on the left and white on the right.

**Try this**
- Choose **fresh snow** with the *average* meter: the sky and the snow are bright and the picture comes out too dark. Add +1 EV and the snow is white again.
- Choose the **black cat** with the *spot* meter and drag the circle onto the cat: the meter sees black and calls for more light, making the cat grey. Compensate −2 EV.
- Switch to **incident**: the snow, the grey card and the cat all come out at their true tones, with no compensation.
- Raise the compensation until the histogram climbs the right-hand wall: those pixels are clipped, and their detail is gone.
- Change to overcast light: the exposure changes by 3.3 stops, but the picture does not.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 320, maxH: 450 });
      const spot = { x: 0.5, y: 0.72 };
      const ctl = kit.controls(box.side, [
        { id: 'rho', type: 'select', label: 'Subject', options: [['Black cat (4 %)', 0.04], ['Person (35 %)', 0.35], ['Grey card (18 %)', 0.18], ['Fresh snow (90 %)', 0.9]], value: params.rho || 0.9 },
        { id: 'E', type: 'select', label: 'Light', options: [['Full sun (100 000 lx)', 100000], ['Overcast (10 000 lx)', 10000]], value: 100000 },
        { id: 'mode', type: 'select', label: 'Meter', options: [['Average of the frame', 'avg'], ['Centre-weighted', 'cw'], ['Spot (drag the circle)', 'spot'], ['Incident (held at the subject)', 'inc']], value: params.mode || 'avg' },
        { id: 'comp', label: 'Exposure compensation', min: -3, max: 3, step: 0.5, value: 0, unit: 'EV' },
        { id: 'N', type: 'select', label: 'Aperture', options: [4, 8, 16].map(n => ['f/' + n, n]), value: 8 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ev', 'Meter reading, EV at ISO 100'], ['t', 'Exposure it sets'], ['subj', 'The subject comes out at'], ['corr', 'Against the incident reading'], ['clip', 'Highlights at pure white'], ['dark', 'Shadows nearly black']]);
      const NX = 80, NY = 50, K = 12.5, Cc = 250;
      const rhoAt = (u, v, rho) => {
        if (((u - 0.5) / 0.16) ** 2 + ((v - 0.72) / 0.2) ** 2 < 1) return rho;
        if (((u - 0.5) / 0.22) ** 2 + ((v - 0.93) / 0.045) ** 2 < 1) return 0.03;
        if (v < 0.46) return 0.3 + 0.12 * (1 - v / 0.46);
        if (v < 0.58) return 0.1;
        return 0.14;
      };
      let geo = null;
      kit.drag(st, {
        hover: true,
        hit: p => (V.mode === 'spot' && geo && Math.hypot(p.x - (geo.px + spot.x * geo.pw), p.y - (geo.py + spot.y * geo.ph)) < Math.max(14, geo.pw * 0.05)) ? 'spot' : null,
        move: (what, p) => { if (!geo) return; spot.x = clamp((p.x - geo.px) / geo.pw, 0.04, 0.96); spot.y = clamp((p.y - geo.py) / geo.ph, 0.06, 0.94); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const E = V.E, N = V.N, comp = V.comp, mode = V.mode;
        const pw = Math.min(W * 0.6, (Hh - 40) * NX / NY), ph = pw * NY / NX, px = 14, py = 28;
        geo = { px, py, pw, ph };
        // luminance of every cell, and the meter's weighted average
        const lum = new Float32Array(NX * NY); let sw = 0, sl = 0;
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          const u = (i + 0.5) / NX, v = (j + 0.5) / NY, L = rhoAt(u, v, V.rho) * E / Math.PI;
          lum[j * NX + i] = L;
          const w = mode === 'avg' ? 1 : mode === 'cw' ? Math.exp(-((u - 0.5) ** 2 + (v - 0.5) ** 2) / (2 * 0.2 * 0.2)) : mode === 'spot' ? (Math.hypot((u - spot.x) * pw, (v - spot.y) * ph) < 0.05 * pw ? 1 : 0) : 0;
          sw += w; sl += w * L;
        }
        const Lref = mode === 'inc' ? K * E / Cc : sw > 0 ? sl / sw : K * E / Cc;
        const ev = Math.log2(Lref * 100 / K), evUsed = ev - comp, evInc = Math.log2(E * 100 / Cc), t = N * N / Math.pow(2, evUsed);
        const hist = new Array(48).fill(0); let clip = 0, dark = 0;
        const key = [V.rho, E, mode, comp, mode === 'spot' ? spot.x.toFixed(2) + spot.y.toFixed(2) : ''].join('|');
        S.image(c, px, py, pw, ph, NX, NY, (u, v) => {
          const i = Math.min(NX - 1, Math.floor(u * NX)), j = Math.min(NY - 1, Math.floor(v * NY)), lin = lum[j * NX + i] / Lref * 0.18 * Math.pow(2, comp), g = srgb(lin);
          return [g, g, g];
        }, { key: 'met' + key, id: 'met', smooth: false });
        for (let k = 0; k < NX * NY; k++) {
          const lin = lum[k] / Lref * 0.18 * Math.pow(2, comp), g = srgb(lin);
          hist[Math.min(47, Math.floor(g / 256 * 48))]++; if (lin >= 1) clip++; if (g < 8) dark++;
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(px + 0.5, py + 0.5, pw, ph);
        kit.label(c, 'the picture', px + pw / 2, py - 12, { align: 'center', color: C.muted, size: 12, weight: 650 });
        if (mode === 'spot') { const cx = px + spot.x * pw, cy = py + spot.y * ph; c.strokeStyle = C.warn; c.lineWidth = 2.4; c.beginPath(); c.arc(cx, cy, pw * 0.05, 0, 2 * Math.PI); c.stroke(); kit.label(c, 'spot', cx, cy - pw * 0.05 - 8, { align: 'center', color: C.warn, size: 11.5, weight: 650 }); }
        if (mode === 'cw') { c.strokeStyle = C.warn; c.lineWidth = 1.6; c.setLineDash([5, 4]); c.beginPath(); c.ellipse(px + pw / 2, py + ph / 2, pw * 0.26, ph * 0.26, 0, 0, 2 * Math.PI); c.stroke(); c.setLineDash([]); }
        if (mode === 'avg') { c.strokeStyle = C.warn; c.lineWidth = 2; c.setLineDash([5, 4]); c.strokeRect(px + 3, py + 3, pw - 6, ph - 6); c.setLineDash([]); }
        if (mode === 'inc') kit.label(c, 'incident: the meter reads the light on the subject, not the picture', px + pw / 2, py + ph + 14, { align: 'center', color: C.warn, size: 11.5 });
        // the histogram
        const hx = px + pw + 26, hw = W - hx - 14, hy = py + 20, hh = Math.min(ph * 0.7, 200), hmax = Math.max(...hist);
        c.fillStyle = C.surface; c.fillRect(hx, hy, hw, hh); c.strokeStyle = C.axis; c.strokeRect(hx + 0.5, hy + 0.5, hw - 1, hh - 1);
        for (let b = 0; b < 48; b++) { const bh = hist[b] / hmax * (hh - 8); c.fillStyle = b === 47 && clip > 0 ? C.bad : b === 0 && dark > 0 && hist[0] > 0 ? C.warn : C.accent; c.fillRect(hx + 2 + b * (hw - 4) / 48, hy + hh - 2 - bh, (hw - 4) / 48 - 0.5, bh); }
        kit.label(c, 'histogram', hx + hw / 2, hy - 12, { align: 'center', color: C.muted, size: 12, weight: 650 });
        kit.label(c, 'black', hx, hy + hh + 12, { size: 10.5, color: C.faint }); kit.label(c, 'white', hx + hw, hy + hh + 12, { size: 10.5, color: C.faint, align: 'right' });
        const sub = lum[Math.floor(0.72 * NY) * NX + Math.floor(0.5 * NX)] / Lref * 0.18 * Math.pow(2, comp), nat = 0.18 * (V.rho * E / Math.PI) / (K * E / Cc);
        ro.set('ev', num(ev, 1) + (mode === 'inc' ? '  (incident)' : '  (reflected)'));
        ro.set('t', 'f/' + N + ' at ' + tfmt(t) + ' (ISO 100)' + (comp ? ', with ' + (comp > 0 ? '+' : '−') + Math.abs(comp) + ' EV' : ''));
        ro.set('subj', num(srgb(sub) / 2.55, 0) + ' % brightness  (natural: ' + num(srgb(nat) / 2.55, 0) + ' %)');
        ro.set('corr', stopsStr(evInc - evUsed) + (Math.abs(evInc - evUsed) <= 0.5 ? '  (correct)' : evInc > evUsed ? '  (too bright)' : '  (too dark)'));
        ro.set('clip', num(100 * clip / (NX * NY), 1) + ' % of the picture' + (clip / (NX * NY) > 0.02 ? '  (detail lost)' : ''));
        ro.set('dark', num(100 * dark / (NX * NY), 1) + ' % of the picture');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ flash: guide number and distance */
  Hyper.sim('cb-flash', {
    title: 'Flash: guide number, power, ISO and distance',
    blurb: `A camera and flash on the left light a subject at the distance you choose. The guide number sets the reach: the correct f-number is GN ÷ distance. The graph shows the exposure error in stops against distance for the aperture you set; it falls by two stops each time the distance doubles.

**Try this**
- Set GN 36, f/5.6, ISO 100 and move the subject: it is correct at 6.4 m (GN ÷ f-number). At half that distance it is two stops too bright.
- Raise the ISO to 400: the reach doubles (GN × √4) with the same aperture.
- Lower the power to 1/4: the reach halves, but the flash duration drops to about a third: the blur of a 30 m/s ball falls from 30 mm to 10 mm.
- Move the subject twice as far: the exposure falls by two stops, and the background at 12 m is almost black.
- Try the built-in flash (GN 12) at f/2.8: it reaches 4.3 m at ISO 100.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190, maxH: 280 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'distance to the subject (m)', name: 'd', min: 1, max: 20 }, y: { label: 'exposure error (stops)', name: 'error', min: -6, max: 6 }, series: [] }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'GN', type: 'select', label: 'Flash (guide number, m at ISO 100)', options: [['Built-in flash, GN 12', 12], ['Hot-shoe flash, GN 36', 36], ['Large hot-shoe flash, GN 58', 58]], value: params.GN || 36 },
        { id: 'p', type: 'select', label: 'Power', options: [['1/1', 1], ['1/2', 1 / 2], ['1/4', 1 / 4], ['1/8', 1 / 8], ['1/16', 1 / 16], ['1/32', 1 / 32], ['1/64', 1 / 64], ['1/128', 1 / 128]], value: 1 },
        { id: 'N', type: 'select', label: 'Aperture', options: STOPS.map(n => ['f/' + n, n]), value: 5.6 },
        { id: 'iso', type: 'select', label: 'ISO', options: ISOS.slice(0, 6).map(i => ['ISO ' + i, i]), value: 100 },
        { id: 'd', label: 'Distance to the subject', min: 1, max: 20, step: 0.5, value: 6.5, unit: 'm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['gn', 'Effective guide number'], ['d0', 'Correct distance at this aperture'], ['n0', 'Correct aperture at this distance'], ['err', 'Exposure of the subject'], ['bg', 'A wall 12 m away'], ['dur', 'Flash duration (typical)'], ['ball', 'A ball at 30 m/s moves']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const GNe = V.GN * Math.sqrt(V.iso / 100 * V.p), d = V.d, N = V.N, err = 2 * Math.log2(GNe / d / N), d0 = GNe / N, n0 = GNe / d;
        const x0 = 46, pxm = (W - 70) / 20, cy = Hh * 0.52, X = m => x0 + m * pxm;
        // the beam, fading as 1/d²
        for (let m = 0.5; m < 20; m += 0.5) { const rel = Math.pow(1 / m, 2) * 4, a = clamp(0.5 * rel, 0.015, 0.5), h = m * pxm * 0.42; c.fillStyle = 'rgba(255,224,130,' + a + ')'; c.beginPath(); c.moveTo(X(m - 0.5), cy - (m - 0.5) * pxm * 0.42); c.lineTo(X(m), cy - h); c.lineTo(X(m), cy + h); c.lineTo(X(m - 0.5), cy + (m - 0.5) * pxm * 0.42); c.closePath(); c.fill(); }
        S.axis(c, 14, cy, W - 12);
        for (const m of [0, 5, 10, 15, 20]) { c.fillStyle = C.muted; c.fillRect(X(m) - 0.5, Hh - 22, 1, 6); kit.label(c, m + ' m', X(m), Hh - 8, { align: 'center', color: C.muted, size: 10.5 }); }
        // the camera and flash
        c.fillStyle = C.dark ? '#39405f' : '#aab2cc'; c.fillRect(14, cy - 14, 24, 28); c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(14.5, cy - 13.5, 24, 28);
        c.fillStyle = C.warn; c.fillRect(20, cy - 21, 12, 7);
        // the subject, as bright as the exposure makes it, and a wall at 12 m
        const lum = clamp(0.18 * Math.pow(2, err), 0, 1), g = srgb(lum), wall = srgb(clamp(0.18 * Math.pow(2, 2 * Math.log2(GNe / 12 / N)), 0, 1));
        c.fillStyle = 'rgb(' + wall + ',' + wall + ',' + wall + ')'; c.fillRect(X(12), cy - 70, 7, 140); c.strokeStyle = C.axis; c.strokeRect(X(12) + 0.5, cy - 69.5, 7, 140);
        c.fillStyle = 'rgb(' + g + ',' + g + ',' + g + ')'; c.beginPath(); c.arc(X(d), cy - 22, 11, 0, 2 * Math.PI); c.fill(); c.fillRect(X(d) - 11, cy - 10, 22, 36); c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.arc(X(d), cy - 22, 11, 0, 2 * Math.PI); c.stroke(); c.strokeRect(X(d) - 10.5, cy - 9.5, 22, 36);
        kit.label(c, 'subject, ' + num(d, 1) + ' m', X(d), cy + 44, { align: 'center', color: C.text, size: 11.5, weight: 650 });
        kit.label(c, 'wall', X(12) + 3, cy - 78, { align: 'center', color: C.faint, size: 11 });
        const tf = 1e-3 * Math.pow(V.p, 0.8);
        ro.set('gn', num(GNe, 1) + ' m  (' + V.GN + ' × √(' + V.iso / 100 + ' × ' + (V.p >= 1 ? '1' : '1/' + Math.round(1 / V.p)) + '))');
        ro.set('d0', num(d0, 1) + ' m at f/' + N);
        ro.set('n0', 'f/' + num(n0, n0 < 10 ? 1 : 0) + ' at ' + num(d, 1) + ' m');
        ro.set('err', Math.abs(err) <= 0.4 ? 'correct (' + stopsStr(err) + ')' : err > 0 ? stopsStr(err) + ' too bright' : stopsStr(-err).replace('−', '') + ' too dark');
        ro.set('bg', stopsStr(2 * Math.log2(GNe / 12 / N)) + ' (a black background)');
        ro.set('dur', tfmt(tf));
        ro.set('ball', num(30 * tf * 1000, 1) + ' mm during the flash');
        const pts = []; for (let i = 0; i <= 80; i++) { const m = 1 + 19 * i / 80; pts.push([m, clamp(2 * Math.log2(GNe / m / N), -6, 6)]); }
        plot.set({ series: [{ pts, label: 'exposure error' }], marks: [{ x: d, y: clamp(err, -6, 6), label: 'subject' }], hlines: [{ y: 0, label: 'correct' }], vlines: d0 <= 20 ? [{ x: d0, label: 'GN ÷ N' }] : [] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the reflex finder */
  // a ray in a polygon of edges {a, b, kind}: refract in at 'enter', reflect at 'mirror', refract out at 'exit'
  const trace2D = (O, p, d, edges, n) => {
    const pts = [p.slice()]; let inside = false;
    for (let step = 0; step < 6; step++) {
      let best = null;
      for (const e of edges) {
        const ex = e.b[0] - e.a[0], ey = e.b[1] - e.a[1], den = d[0] * ey - d[1] * ex;
        if (Math.abs(den) < 1e-9) continue;
        const tt = ((e.a[0] - p[0]) * ey - (e.a[1] - p[1]) * ex) / den, uu = ((e.a[0] - p[0]) * d[1] - (e.a[1] - p[1]) * d[0]) / den;
        if (tt > 1e-6 && uu >= -1e-9 && uu <= 1 + 1e-9 && (!best || tt < best.t)) best = { t: tt, e, ex, ey };
      }
      if (!best) break;
      p = [p[0] + d[0] * best.t, p[1] + d[1] * best.t]; pts.push(p.slice());
      const len = Math.hypot(best.ex, best.ey); let nx = best.ey / len, ny = -best.ex / len;
      if (nx * d[0] + ny * d[1] < 0) { nx = -nx; ny = -ny; }
      const cosI = Math.min(1, nx * d[0] + ny * d[1]);
      if (best.e.kind === 'mirror') d = [d[0] - 2 * cosI * nx, d[1] - 2 * cosI * ny];
      else if (best.e.kind === 'enter' || best.e.kind === 'exit') {
        const t2 = O.snell(inside ? n : 1, inside ? 1 : n, Math.acos(cosI));
        if (!fin(t2)) break;
        const tx = d[0] - cosI * nx, ty = d[1] - cosI * ny, tl = Math.hypot(tx, ty), ux = tl > 1e-12 ? tx / tl : 0, uy = tl > 1e-12 ? ty / tl : 0;
        d = [nx * Math.cos(t2) + ux * Math.sin(t2), ny * Math.cos(t2) + uy * Math.sin(t2)]; inside = !inside;
      } else break;
    }
    pts.push([p[0] + d[0] * 24, p[1] + d[1] * 24]);
    return pts;
  };

  Hyper.sim('cb-viewfinder', {
    title: 'The reflex finder: mirror, screen, pentaprism, eyepiece',
    blurb: `A single-lens reflex in section (millimetres, to scale). Before the shot a mirror at 45° sends the light up to the **focusing screen**, which is exactly as far from the mirror as the sensor is; the **pentaprism** turns the image the right way round and the eyepiece magnifies it. At the shot the mirror swings up. On the right: what you see in the finder.

**Try this**
- Press **Fire the shutter**: the mirror flips up, the finder goes dark, the light reaches the sensor, then the mirror falls back. Tick *hold the mirror up* to keep it there (mirror lock-up).
- Turn the focus ring away from zero with the **split image**: the two halves of the central circle slip sideways; they line up when the lens is in focus.
- Choose the **microprism collar**: the ring shimmers when the focus is wrong and clears at focus.
- Look at the two dimensions marked 22 mm: the screen and the sensor are the same distance from the mirror, so what is sharp on one is sharp on the other.
- Follow a ray through the prism: two reflections turn it through 90° and it leaves toward the eyepiece.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320, maxH: 450 });
      const FFD = O.cam.mount('EF').ffd;                                     // the sensor is 44 mm behind the mount of an SLR
      let mir = 0, hold = 0;
      const ctl = kit.controls(box.side, [
        { id: 'err', label: 'Focus ring (0 = in focus)', min: -1, max: 1, step: 0.02, value: params.err != null ? params.err : 0.5 },
        { id: 'aid', type: 'select', label: 'Focusing aid', options: [['Split image', 'split'], ['Microprism collar', 'micro'], ['Ground glass only', 'ground']], value: params.aid || 'split' },
        { id: 'lock', type: 'check', label: 'Hold the mirror up (mirror lock-up)', value: false },
        { id: 'rays', type: 'check', label: 'Show the light', value: true },
        { type: 'buttons', items: [{ id: 'fire', label: 'Fire the shutter', primary: true }] }
      ], id => { if (id === 'fire') hold = 0.9; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['mir', 'Mirror'], ['view', 'The finder shows'], ['err', 'Focus error'], ['aid', 'Focusing aid'], ['dist', 'Mirror to screen · mirror to sensor']]);
      // the section, in mm: x to the rear, y up; the mount at x = 0
      const XM = 22, LS = FFD - XM, A = 26, L2 = 10, R = A - Math.SQRT1_2 * L2, L1 = 1.848 * R, YP = LS + 4;
      const P1 = [XM + 13, YP], P0 = [P1[0] - A, YP];
      const P2 = [P0[0] + L1 * Math.cos(112.5 * D2R), P0[1] + L1 * Math.sin(112.5 * D2R)], P3 = [P2[0] + L2 * Math.SQRT1_2, P2[1] + L2 * Math.SQRT1_2], P4 = [P3[0] + L1 * Math.cos(-22.5 * D2R), P3[1] + L1 * Math.sin(-22.5 * D2R)];
      const EDGES = [{ a: P1, b: P0, kind: 'enter' }, { a: P0, b: P2, kind: 'mirror' }, { a: P2, b: P3, kind: 'wall' }, { a: P3, b: P4, kind: 'mirror' }, { a: P4, b: P1, kind: 'exit' }];
      const bars = [[0.08, 0.1, 70], [0.24, 0.05, 30], [0.4, 0.14, 100], [0.62, 0.06, 40], [0.74, 0.12, 90], [0.9, 0.05, 30]];
      const loop = kit.loop(dt => {
        const want = (V.lock || hold > 0) ? 1 : 0; hold = Math.max(0, hold - dt); mir += clamp(want - mir, -8 * dt, 8 * dt);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const Wd = W * 0.64, xmin = -66, xmax = 84, ymin = -28, ymax = 78, s = Math.min((Wd - 14) / (xmax - xmin), (Hh - 20) / (ymax - ymin));
        const X = x => 10 + s * (x - xmin), Y = y => Hh - 10 - s * (y - ymin), pt = p => [X(p[0]), Y(p[1])];
        const metal = C.dark ? '#39405f' : '#b3bbd1', bodyc = C.dark ? '#262c48' : '#d5dae8';
        c.lineJoin = 'round';
        // the body and the prism housing
        c.fillStyle = bodyc; c.strokeStyle = C.text; c.lineWidth = 1.3;
        c.beginPath(); c.rect(X(-2), Y(40), s * 68, s * 66); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(X(-10), Y(40)); c.lineTo(X(-10), Y(72)); c.lineTo(X(52), Y(72)); c.lineTo(X(52), Y(40)); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = C.bg2; c.fillRect(X(-1), Y(36), s * 66, s * 58);
        // the lens
        c.fillStyle = metal; c.beginPath(); c.rect(X(-62), Y(29), s * 62, s * 58); c.fill(); c.stroke(); c.fillStyle = C.bg2; c.fillRect(X(-61), Y(25), s * 60, s * 50);
        S.lens(c, X(-56), Y(0), 22 * s, { f: 1, bulge: 2.6, t: 6 * s }); S.lens(c, X(-44), Y(0), 18 * s, { f: -1, bulge: 2.4, t: 3 * s }); S.lens(c, X(-16), Y(0), 14 * s, { f: 1, bulge: 2.4, t: 4 * s });
        S.stop(c, X(-30), Y(0), 26 * s, (50 / 2.8 / 2) * s);
        c.save(); c.strokeStyle = C.accent; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(X(0), Y(-26)); c.lineTo(X(0), Y(36)); c.stroke(); c.restore();
        kit.label(c, 'mount', X(0), Y(-26) + 12, { align: 'center', color: C.accent, size: 11 });
        // the screen, the prism, the eyepiece, the eye
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(X(XM - 12), Y(LS)); c.lineTo(X(XM + 12), Y(LS)); c.stroke();
        kit.label(c, 'focusing screen', X(XM - 28), Y(LS) + 4, { color: C.muted, size: 11, align: 'center' });
        S.poly(c, [P0, P1, P4, P3, P2].map(pt));
        kit.label(c, 'pentaprism', X((P0[0] + P4[0]) / 2) - 4, Y(P3[1] - 12), { align: 'center', color: C.muted, size: 11.5 });
        S.lens(c, X(P1[0] + 5), Y((P1[1] + P4[1]) / 2 + 0), 11 * s, { f: 1, bulge: 2.4, t: 3 * s });
        S.eye(c, X(P1[0] + 38), Y((P1[1] + P4[1]) / 2), 10 * s, { dir: -1 });
        kit.label(c, 'eyepiece', X(P1[0] + 5), Y((P1[1] + P4[1]) / 2) - 11 * s - 8, { align: 'center', color: C.muted, size: 11 });
        // shutter and sensor
        c.strokeStyle = C.text; c.lineWidth = 2.2; if (mir < 0.5) { c.beginPath(); c.moveTo(X(FFD - 1.2), Y(15)); c.lineTo(X(FFD - 1.2), Y(-15)); c.stroke(); }
        S.sensor(c, X(FFD - 0.4), Y(0), 12 * s, { pixels: 14, color: mir > 0.9 ? C.warn : C.ok });
        kit.label(c, 'sensor', X(FFD) + 6, Y(-22), { align: 'center', color: C.muted, size: 11 });
        // the mirror: hinged at its upper end, swinging from 45° (down) to horizontal (up)
        const piv = [XM + 13, 13], ang = (225 - 45 * mir) * D2R, lo = [piv[0] + 26 * Math.SQRT2 * Math.cos(ang), piv[1] + 26 * Math.SQRT2 * Math.sin(ang)];
        S.flatMirror(c, X(lo[0]), Y(lo[1]), X(piv[0]), Y(piv[1]), { width: 3 });
        kit.label(c, 'mirror', X(XM) - 16, Y(-8), { align: 'center', color: C.muted, size: 11 });
        // the light
        const up = mir > 0.97, down = mir < 0.03, hb = 50 / 2.8 / 2 * 0.8;
        if (V.rays && (up || down)) {
          for (const h of [-hb, 0, hb]) {
            const A0 = [-12, h];
            if (up) S.ray(c, [[-12, h], [FFD, 0]].map(pt), { nm: 570, width: 1.2, arrows: false });
            else { const lam = (34 + h) / (56 + h), Ip = [-12 + 56 * lam, h * (1 - lam)]; S.ray(c, [A0, Ip, [XM, LS]].map(pt), { nm: 570, width: 1.2, arrows: false }); }
          }
          S.ray(c, [[-66, hb], [-12, hb]].map(pt), { nm: 570, width: 1.2, arrows: false }); S.ray(c, [[-66, -hb], [-12, -hb]].map(pt), { nm: 570, width: 1.2, arrows: false }); S.ray(c, [[-66, 0], [-12, 0]].map(pt), { nm: 570, width: 1.2, arrows: false });
          if (down) for (const a of [-10.1, 0, 10.1]) {
            const th = a * D2R, tr = trace2D(O, [XM, LS], [Math.sin(th), Math.cos(th)], EDGES, 1.52);
            S.ray(c, tr.map(pt), { nm: 570, width: 1.1, arrows: false, alpha: 0.9 });
          }
        }
        S.dim(c, X(XM + 3), Y(0), X(XM + 3), Y(LS), LS + ' mm', { off: -14 });
        S.dim(c, X(XM), Y(-3), X(FFD), Y(-3), LS + ' mm', { off: 12 });
        // the view in the finder
        const vx = Wd + 14, vy = 34, ps = Math.min(W - vx - 12, Hh - 74);
        c.fillStyle = '#10121c'; c.fillRect(vx, vy, ps, ps);
        kit.label(c, 'what you see in the finder', vx + ps / 2, vy - 14, { align: 'center', color: C.muted, size: 12, weight: 650 });
        const dark = mir > 0.5, err = V.err;
        if (dark) kit.label(c, 'mirror up: the finder is dark', vx + ps / 2, vy + ps / 2, { align: 'center', color: C.muted, size: 13 });
        else {
          const scene = (dx, blur) => {
            const k = blur < 0.6 ? 1 : 9;
            for (let i = 0; i < k; i++) {
              const off = k === 1 ? 0 : (i / (k - 1) - 0.5) * 2 * blur;
              c.globalAlpha = k === 1 ? 1 : 2 / k;
              for (const b of bars) { c.fillStyle = 'rgb(' + b[2] + ',' + b[2] + ',' + (b[2] + 20) + ')'; c.fillRect(vx + b[0] * ps + dx + off, vy, b[1] * ps, ps); }
            }
            c.globalAlpha = 1;
          };
          const cx = vx + ps / 2, cy = vy + ps / 2, r = 0.2 * ps, blur = Math.abs(err) * 14, back = () => { c.fillStyle = '#d8dcea'; c.fillRect(vx, vy, ps, ps); };
          c.save(); c.beginPath(); c.rect(vx, vy, ps, ps); c.clip();
          back(); scene(0, blur);
          if (V.aid === 'split') {
            const dxs = err * 0.1 * ps;
            for (const half of [-1, 1]) { c.save(); c.beginPath(); c.arc(cx, cy, r, 0, 2 * Math.PI); c.clip(); c.beginPath(); c.rect(vx, half < 0 ? vy : cy, ps, ps / 2); c.clip(); back(); scene(half * dxs, 0); c.restore(); }
            c.strokeStyle = '#10121c'; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, r, 0, 2 * Math.PI); c.moveTo(cx - r, cy); c.lineTo(cx + r, cy); c.stroke();
          } else if (V.aid === 'micro') {
            c.save(); c.beginPath(); c.arc(cx, cy, 0.34 * ps, 0, 2 * Math.PI); c.arc(cx, cy, r, 0, 2 * Math.PI, true); c.clip(); back(); scene(0, 0);
            const cell = Math.max(3, ps / 60), am = clamp(Math.abs(err) * 1.6, 0, 1);
            for (let yy = vy; yy < vy + ps; yy += cell) for (let xx = vx; xx < vx + ps; xx += cell) { const h = hash(Math.round(xx), Math.round(yy), 3); if (h < am * 0.7) { c.fillStyle = hash(Math.round(xx), Math.round(yy), 4) < 0.5 ? 'rgba(20,22,36,0.85)' : 'rgba(240,242,250,0.85)'; c.fillRect(xx, yy, cell, cell); } }
            c.restore();
            c.strokeStyle = '#10121c'; c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, r, 0, 2 * Math.PI); c.stroke(); c.beginPath(); c.arc(cx, cy, 0.34 * ps, 0, 2 * Math.PI); c.stroke();
          } else { c.strokeStyle = '#10121c'; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, r, 0, 2 * Math.PI); c.stroke(); }
          c.restore();
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(vx + 0.5, vy + 0.5, ps, ps);
        ro.set('mir', mir < 0.03 ? 'down: the light goes to the finder' : mir > 0.97 ? 'up: the light goes to the sensor' : 'moving');
        ro.set('view', dark ? 'nothing (blackout during the exposure)' : 'the picture through the lens, at full aperture');
        ro.set('err', Math.abs(err) < 0.04 ? 'in focus' : (err > 0 ? 'focused too far' : 'focused too near') + ' (' + num(Math.abs(err), 2) + ' of the scale)');
        ro.set('aid', V.aid === 'split' ? (Math.abs(err) < 0.04 ? 'the halves are aligned' : 'the halves are offset by ' + num(Math.abs(err) * 10, 0) + ' % of the width') : V.aid === 'micro' ? (Math.abs(err) < 0.04 ? 'the ring is clear' : 'the ring shimmers') : 'the picture is simply blurred');
        ro.set('dist', LS + ' mm · ' + LS + ' mm: equal, so the screen is conjugate to the sensor');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });
})();
