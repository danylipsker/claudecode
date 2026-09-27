/* HYPER-BIOLOGY · sims/cells.js — simulations for the Cells branch (content/cells.js).
 *   cell-sav           a cube or sphere of cytoplasm cut into n³ pieces: surface, volume, SA:V and O₂ diffusion time,
 *                      placed on the SA:V = 6/size line among real cells
 *   cell-microscope    two point objects seen through a light or electron microscope: Airy images, the Rayleigh limit,
 *                      total magnification, the eye's own limit and empty magnification
 *   cell-diffusion     molecules random-walking in two compartments across a membrane (free, through channels or
 *                      through saturable carriers), with the exact diffusion theory for the free case
 *   cell-osmosis       a red cell (Boyle–van 't Hoff osmometer, permeant urea, haemolysis) or a plant cell (ψ = ψs + ψp,
 *                      turgor, plasmolysis, Höfler diagram) in solutions of different concentration
 *   cell-pump          the Na⁺/K⁺-ATPase cycle (3 Na⁺ out, 2 K⁺ in per ATP) animated, with a cell whose gradients the pump
 *                      maintains against leaks — or lose them when the pump is blocked
 *   cell-endomembrane  the secretory pathway ER → Golgi → vesicle → membrane with a pulse-chase experiment, lysosomal
 *                      sorting by mannose-6-phosphate, regulated secretion and receptor-mediated endocytosis
 *   cell-kinesin       a kinesin walking hand over hand along a microtubule: 8 nm steps, ATP (Michaelis–Menten) and load
 */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const D_O2 = 2e-9;                                                   // m²/s, oxygen in water near 25 °C
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const lerp = (a, b, t) => a + (b - a) * t;

  /* a time in seconds, in the unit that reads best */
  function fmtTime(kit, s) {
    if (!(s > 0)) return '0 s';
    if (s < 1e-3) return kit.fmt(s * 1e6, 2) + ' µs';
    if (s < 1) return kit.fmt(s * 1e3, 2) + ' ms';
    if (s < 120) return kit.fmt(s, 2) + ' s';
    if (s < 7200) return kit.fmt(s / 60, 2) + ' min';
    if (s < 2 * 86400) return kit.fmt(s / 3600, 2) + ' h';
    if (s < 2 * 3.156e7) return kit.fmt(s / 86400, 2) + ' days';
    return kit.fmt(s / 3.156e7, 2) + ' years';
  }
  /* µm, µm², µm³ with thousands separated */
  const big = (kit, v) => v >= 1e4 && v < 1e9 ? Math.round(v).toLocaleString('en-GB').replace(/,/g, ' ') : kit.fmt(v, 3);
  /* lines of text, each { t, color, size, weight, gap }, word-wrapped to maxW; returns the y below them */
  function textBlock(kit, c, x, y, maxW, items) {
    const family = typeof getComputedStyle === 'function' && document.body ? getComputedStyle(document.body).fontFamily : 'sans-serif';
    for (const it of items) {
      if (!it) continue;
      const size = it.size || 12, lines = [];
      c.save(); c.font = (it.weight || 500) + ' ' + size + 'px ' + family;
      let cur = '';
      for (const w of String(it.t).split(' ')) { const test = cur ? cur + ' ' + w : w; if (cur && c.measureText(test).width > maxW) { lines.push(cur); cur = w; } else cur = test; }
      if (cur) lines.push(cur);
      c.restore();
      for (const L of lines) { kit.label(c, L, x, y, { align: 'left', size, color: it.color, weight: it.weight }); y += size + 5; }
      y += it.gap != null ? it.gap : 4;
    }
    return y;
  }

  /* ================================================================ SURFACE AND VOLUME */
  const REAL_CELLS = [['Mycoplasma', 0.3], ['E. coli', 1.2], ['yeast', 5], ['red cell', 7.5], ['liver cell', 20], ['human egg', 120], ['frog egg', 1500]];

  Hyper.sim('cell-sav', {
    title: 'Surface, volume and the size of cells',
    blurb: `A cube (or a sphere) of living material is cut into n × n × n equal pieces. The volume never changes, but every cut exposes new surface, so the surface-area-to-volume ratio rises in proportion to n — and the distance oxygen has to diffuse to reach the middle of each piece falls. The bars compare the start with the pieces; the graph places both on the line SA:V = 6/size among real cells.

**Try this**
- Start with a 20 µm cube, about a liver cell, and cut it into 2 × 2 × 2: the total surface doubles from 2400 to 4800 µm² while the volume stays at 8000 µm³.
- Slide the size up to 1 mm: SA:V falls to 0.006 per µm and oxygen needs about a minute to reach the centre. Cut it into 6 × 6 × 6 — better, but still far from a real cell.
- Switch to spheres: the ratio is the same, because a sphere of diameter d has A/V = 6/d, like a cube of side d.
- Find the size at which oxygen takes about a second to reach the centre (x²/2D = 1 s): about 130 µm, the size of a human egg — one of the largest cells in the body. Most cells are ten times smaller.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Shape', options: [['Cube', 'cube'], ['Sphere', 'sphere']], value: 'cube' },
        { id: 'L', label: 'Size of the starting cell (side or diameter)', min: 1, max: 1000, value: 20, log: true, sig: 2, unit: 'µm' },
        { id: 'n', label: 'Cut into n × n × n pieces: n', min: 1, max: 6, step: 1, value: 1 },
        { id: 'apart', type: 'check', label: 'Pull the pieces apart', value: true }
      ], () => { dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pieces', 'Pieces'], ['A', 'Total surface'], ['vol', 'Total volume'], ['sav', 'SA:V'], ['t', 'O₂ to the centre of a piece'], ['like', 'Each piece is about the size of']]);
      const plot = kit.plot(gb, { x: { label: 'size (µm)', log: true, min: 0.1, max: 3000 }, y: { label: 'SA:V (µm² per µm³)', log: true, min: 0.001, max: 100 } }, 190);
      const line = []; for (let k = 0; k <= 60; k++) { const x = 0.1 * Math.pow(30000, k / 60); line.push([x, 6 / x]); }
      let gap = 0, dirty = true;
      st.onResize(() => { dirty = true; });

      function numbers() {
        const L = V.L, n = Math.round(V.n), s = L / n, cube = V.shape === 'cube';
        const A = cube ? 6 * L * L * n : Math.PI * L * L * n;
        const Vol = cube ? L * L * L : Math.PI * L * L * L / 6;
        return { L, n, s, cube, A, Vol, A0: cube ? 6 * L * L : Math.PI * L * L, sav: 6 * n / L, t: kit.bio.diffusionTime(s / 2 * 1e-6, D_O2), t0: kit.bio.diffusionTime(L / 2 * 1e-6, D_O2) };
      }
      function nearest(size) {
        let best = REAL_CELLS[0], bd = Infinity;
        for (const c of REAL_CELLS) { const d = Math.abs(Math.log(c[1] / size)); if (d < bd) { bd = d; best = c; } }
        return bd < 0.9 ? 'a ' + best[0] + ' (' + best[1] + ' µm)' : size < 0.3 ? 'smaller than any cell' : size > 1500 ? 'larger than any ordinary cell' : 'between ' + best[0] + ' and its neighbours';
      }

      const loop = kit.loop((dt) => {
        const target = V.apart && V.n > 1 ? 0.28 : 0;
        const g0 = gap; gap += (target - gap) * Math.min(1, dt * 6);
        if (Math.abs(gap - g0) > 1e-4) dirty = true;
        if (!dirty) return;
        dirty = false;
        const N = numbers(), C = kit.colors(), c = st.begin();
        // ---- the pieces, in isometric view (unit: the starting size)
        const n = N.n, s = 1 / n, g = gap * s, E = 1 + (n - 1) * g;
        const regW = st.W * 0.58, S = Math.min(regW / (1.732 * E), (st.H - 40) / (2 * E)) * 0.92;
        const ox = regW / 2 + 6, oy = st.H / 2 + 8;                      // the block spans oy − E·S … oy + E·S
        const P = (x, y, z) => [ox + (x - y) * 0.866 * S, oy + (x + y) * 0.5 * S - z * S];
        const shade = C.dark ? ['hsl(195 55% 55%)', 'hsl(200 50% 42%)', 'hsl(205 48% 31%)'] : ['hsl(195 65% 70%)', 'hsl(200 55% 55%)', 'hsl(205 50% 42%)'];
        const edge = C.dark ? 'rgba(0,0,0,.45)' : 'rgba(255,255,255,.75)';
        const order = [];
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) order.push([i, j, k]);
        order.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
        c.lineJoin = 'round';
        for (const [i, j, k] of order) {
          const x0 = i * (s + g), y0 = j * (s + g), z0 = k * (s + g);
          if (N.cube) {
            const face = (pts, col) => { c.beginPath(); pts.forEach((p, m) => { const q = P(p[0], p[1], p[2]); m ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fillStyle = col; c.fill(); c.strokeStyle = edge; c.lineWidth = 1; c.stroke(); };
            const x1 = x0 + s, y1 = y0 + s, z1 = z0 + s;
            face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], shade[0]);
            face([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], shade[1]);
            face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], shade[2]);
          } else {
            const q = P(x0 + s / 2, y0 + s / 2, z0 + s / 2), r = 0.5 * s * S * 1.2247;
            const gr = c.createRadialGradient(q[0] - r * 0.35, q[1] - r * 0.4, r * 0.1, q[0], q[1], r);
            gr.addColorStop(0, shade[0]); gr.addColorStop(0.7, shade[1]); gr.addColorStop(1, shade[2]);
            c.beginPath(); c.arc(q[0], q[1], r, 0, TAU); c.fillStyle = gr; c.fill(); c.strokeStyle = edge; c.lineWidth = 0.8; c.stroke();
          }
        }
        kit.label(c, (N.cube ? 'cube' : 'sphere') + ' of ' + kit.fmt(N.L, 3) + ' µm' + (n > 1 ? ' cut into ' + n * n * n + ' pieces of ' + kit.fmt(N.s, 3) + ' µm' : ''), 10, 14, { align: 'left', size: 12, color: C.muted });
        // ---- bars: start against pieces
        const bx = st.W * 0.61, bw = st.W - bx - 14, rows = [
          ['surface', N.A0, N.A, 'µm²'], ['volume', N.Vol, N.Vol, 'µm³'], ['SA:V', 6 / N.L, N.sav, 'per µm'], ['O₂ to centre', N.t0, N.t, 's']
        ];
        let y = 22;
        kit.label(c, 'start', bx, y, { align: 'left', size: 11.5, color: C.warn, weight: 600 });
        kit.label(c, 'pieces', bx + 46, y, { align: 'left', size: 11.5, color: C.accent, weight: 600 });
        y += 14;
        const hRow = Math.min(58, (st.H - y - 6) / rows.length);
        for (const [name, a, b, u] of rows) {
          const mx = Math.max(a, b) || 1;
          kit.label(c, name, bx, y + 8, { align: 'left', size: 12, color: C.text });
          const val = v => u === 's' ? fmtTime(kit, v) : big(kit, v) + ' ' + u;
          c.fillStyle = C.warn; c.fillRect(bx, y + 16, Math.max(1, bw * a / mx), 8);
          c.fillStyle = C.accent; c.fillRect(bx, y + 27, Math.max(1, bw * b / mx), 8);
          kit.label(c, val(a) + '  →  ' + val(b), bx + bw, y + 8, { align: 'right', size: 11.5, color: C.muted });
          y += hRow;
        }
        // ---- read-outs and graph
        ro.set('pieces', n * n * n + ' × ' + kit.fmt(N.s, 3) + ' µm');
        ro.set('A', big(kit, N.A) + ' µm² (' + kit.fmt(N.A / N.A0, 3) + ' × the start)');
        ro.set('vol', big(kit, N.Vol) + ' µm³ (unchanged)');
        ro.set('sav', kit.fmt(N.sav, 3) + ' per µm (' + n + ' × the start)');
        ro.set('t', fmtTime(kit, N.t) + ' (x²/2D, x = ' + kit.fmt(N.s / 2, 3) + ' µm)');
        ro.set('like', nearest(N.s));
        plot.set({
          series: [{ pts: line, label: 'SA:V = 6/size', color: C.muted, width: 1.5 }],
          marks: REAL_CELLS.map(([name, d]) => ({ x: d, y: 6 / d, label: name, color: C.faint, r: 3.5 }))
            .concat([{ x: N.L, y: 6 / N.L, color: C.warn, r: 6, label: n > 1 ? 'start' : 'your cell' }])
            .concat(n > 1 ? [{ x: N.s, y: N.sav, color: C.accent, r: 6, label: 'pieces' }] : [])
        });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ MICROSCOPE */
  function besselJ1(x) {                                               // Numerical Recipes rational approximation
    const ax = Math.abs(x);
    if (ax < 8) {
      const y = x * x;
      const a = x * (72362614232.0 + y * (-7895059235.0 + y * (242396853.1 + y * (-2972611.439 + y * (15704.48260 + y * (-30.16036606))))));
      const b = 144725228442.0 + y * (2300535178.0 + y * (18583304.74 + y * (99447.43394 + y * (376.9991397 + y))));
      return a / b;
    }
    const z = 8 / ax, y = z * z, xx = ax - 2.356194491;
    const p1 = 1.0 + y * (0.183105e-2 + y * (-0.3516396496e-4 + y * (0.2457520174e-5 + y * (-0.240337019e-6))));
    const p2 = 0.04687499995 + y * (-0.2002690873e-3 + y * (0.8449199096e-5 + y * (-0.88228987e-6 + y * 0.105787412e-6)));
    const v = Math.sqrt(0.636619772 / ax) * (Math.cos(xx) * p1 - z * Math.sin(xx) * p2);
    return x < 0 ? -v : v;
  }
  const airy = v => { if (Math.abs(v) < 1e-6) return 1; const j = 2 * besselJ1(v) / v; return j * j; };
  function waveRGB(w) {                                                // an approximate colour for a visible wavelength
    let r = 0, g = 0, b = 0;
    if (w < 440) { r = (440 - w) / 60; b = 1; } else if (w < 490) { g = (w - 440) / 50; b = 1; } else if (w < 510) { g = 1; b = (510 - w) / 20; }
    else if (w < 580) { r = (w - 510) / 70; g = 1; } else if (w < 645) { r = 1; g = (645 - w) / 65; } else r = 1;
    const f = w < 420 ? 0.4 + 0.6 * (w - 380) / 40 : w > 680 ? 0.4 + 0.6 * (750 - w) / 70 : 1;
    return [255 * r * f, 255 * g * f, 255 * b * f].map(v => clamp(Math.round(v), 0, 255));
  }
  const OBJ = [{ name: '4× (NA 0.10)', M: 4, NA: 0.10 }, { name: '10× (NA 0.25)', M: 10, NA: 0.25 }, { name: '40× (NA 0.65)', M: 40, NA: 0.65 }, { name: '100× oil immersion (NA 1.40)', M: 100, NA: 1.40 }];
  const EYE_MM = 0.1;                                                  // what the eye resolves in an image at 25 cm
  const PX_PER_MM = 100;                                               // so 0.1 mm of image = 10 px on the screen here

  Hyper.sim('cell-microscope', {
    title: 'Magnification and resolution',
    blurb: `Two tiny glowing objects — two fluorescent proteins, say — sit a chosen distance apart. The circle shows what reaches your eye: each point is imaged as a small diffraction pattern (an Airy disc) whose size is set by the wavelength and the numerical aperture, then magnified by the objective and the eyepiece and blurred a little more by the eye itself, which separates about 0.1 mm (10 px here). The graph is the brightness along the line through the two objects.

**Try this**
- With the 100× oil objective and green light, bring the objects closer than about 240 nm (Rayleigh's limit 0.61 λ/NA): the two peaks merge. Change to a 20× eyepiece — bigger, but no clearer: **empty magnification**.
- Take the 4× objective with the 5× eyepiece and set the objects 4000 nm apart: the optics resolve them (the limit is 3.4 µm), but their images are only 0.08 mm apart — too close for the eye. A 10× eyepiece fixes it: here magnification really helps.
- Change the wavelength from red (700 nm) to violet (400 nm) at a separation of 200 nm: shorter waves resolve finer detail.
- Switch to the electron microscope and look at 2 nm and at 0.3 nm. Its wavelength is only about 0.004 nm, but lens aberrations limit it to about 0.2 nm — and the specimen must be dead and in a vacuum.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Instrument', options: [['Light microscope', 'light'], ['Transmission electron microscope', 'tem']], value: 'light' },
        { id: 'sep', label: 'Distance between the two objects', min: 0.1, max: 5000, value: 300, log: true, sig: 2, unit: 'nm' },
        { id: 'obj', type: 'select', label: 'Objective', options: OBJ.map((o, i) => [o.name, i]), value: 3 },
        { id: 'eye', type: 'select', label: 'Eyepiece', options: [['5×', 5], ['10×', 10], ['15×', 15], ['20×', 20]], value: 10 },
        { id: 'lambda', label: 'Wavelength of the light', min: 400, max: 700, step: 5, value: 550, unit: 'nm' },
        { id: 'temM', type: 'select', label: 'Electron-microscope magnification', options: [['2 000×', 2000], ['20 000×', 20000], ['200 000×', 200000], ['2 000 000×', 2000000]], value: 200000 }
      ], () => { dirty = true; modes(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['M', 'Total magnification'], ['res', 'Resolution limit (Rayleigh)'], ['abbe', 'Abbe limit λ/2NA'], ['img', 'Gap in the image at the eye'], ['use', 'Useful magnification'], ['verdict', 'You see']]);
      const plot = kit.plot(gb, { x: { label: 'position across the specimen (nm)' }, y: { label: 'brightness', min: 0 } }, 170);
      const NPX = 150, off = document.createElement('canvas'); off.width = NPX; off.height = NPX;
      const octx = off.getContext('2d'), img = octx.createImageData(NPX, NPX);
      st.onResize(() => { dirty = true; });
      function modes() { const L = V.mode === 'light'; ctl.show('obj', L); ctl.show('eye', L); ctl.show('lambda', L); ctl.show('temM', !L); }
      modes();

      function optics() {
        const light = V.mode === 'light';
        if (light) {
          const o = OBJ[V.obj] || OBJ[3], M = o.M * V.eye, dR = 0.61 * V.lambda / o.NA;
          return { light, M, NA: o.NA, dR, abbe: V.lambda / (2 * o.NA), useLo: 500 * o.NA, useHi: 1000 * o.NA };
        }
        const M = V.temM, dR = 0.2;                                      // practical limit of a good TEM, nm
        return { light, M, NA: 0.01, dR, abbe: 0.0037 / 0.02, useLo: EYE_MM * 1e6 / dR / 2, useHi: EYE_MM * 1e6 / dR };
      }

      const loop = kit.loop(() => {
        if (!dirty) return;
        dirty = false;
        const O = optics(), C = kit.colors(), c = st.begin();
        const sep = V.sep, sImg = sep * 1e-6 * O.M;                      // mm in the image at the eye
        const rOpt = O.dR * 1e-6 * O.M, r = Math.sqrt(rOpt * rOpt + EYE_MM * EYE_MM);   // blur radius in the image (mm)
        const Rv = Math.max(60, Math.min(st.H - 34, st.W * 0.5) / 2), cx = Rv + 12, cy = st.H / 2 + 6;
        const mmPerPx = 1 / PX_PER_MM, span = 2 * Rv * mmPerPx;            // image width shown, mm
        // ---- render the image into the small canvas
        const col = O.light ? waveRGB(V.lambda) : [235, 235, 235], d = img.data;
        for (let py = 0; py < NPX; py++) {
          const Y = (py + 0.5 - NPX / 2) / NPX * span;
          for (let px = 0; px < NPX; px++) {
            const X = (px + 0.5 - NPX / 2) / NPX * span;
            const I = airy(3.8317 * Math.hypot(X - sImg / 2, Y) / r) + airy(3.8317 * Math.hypot(X + sImg / 2, Y) / r);
            const b = 1 - Math.exp(-1.7 * I), k = 4 * (py * NPX + px);
            d[k] = col[0] * b; d[k + 1] = col[1] * b; d[k + 2] = col[2] * b; d[k + 3] = 255;
          }
        }
        octx.putImageData(img, 0, 0);
        c.save(); c.beginPath(); c.arc(cx, cy, Rv, 0, TAU); c.clip();
        c.fillStyle = '#000'; c.fillRect(cx - Rv, cy - Rv, 2 * Rv, 2 * Rv);
        c.imageSmoothingEnabled = true; c.drawImage(off, cx - Rv, cy - Rv, 2 * Rv, 2 * Rv);
        // scale bar in specimen units
        const specW = span / O.M * 1e6, bar = Hyper.niceStep ? Hyper.niceStep(specW / 3, 1) : specW / 4, barPx = bar / specW * 2 * Rv;
        c.fillStyle = 'rgba(255,255,255,.85)'; c.fillRect(cx - barPx / 2, cy + Rv * 0.72, barPx, 3);
        kit.label(c, bar >= 1000 ? kit.fmt(bar / 1000, 3) + ' µm' : kit.fmt(bar, 3) + ' nm', cx, cy + Rv * 0.72 - 8, { align: 'center', size: 11.5, color: '#fff' });
        c.restore();
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, Rv, 0, TAU); c.stroke();
        kit.label(c, O.light ? 'through the eyepiece' : 'on the electron microscope screen', cx, 12, { align: 'center', size: 11.5, color: C.muted });
        // ---- verdict panel
        const resolved = sep >= O.dR, bigEnough = sImg >= EYE_MM, empty = O.M > O.useHi * 1.05;
        const verdict = !resolved ? 'one blur' : !bigEnough ? 'a single speck — too small for the eye' : 'two separate objects';
        const tx = cx + Rv + 18;
        textBlock(kit, c, tx, 26, st.W - tx - 10, [
          { t: 'Magnification ' + big(kit, O.M) + '×', size: 14, weight: 600, color: C.text },
          { t: 'objects ' + kit.fmt(sep, 3) + ' nm apart → ' + kit.fmt(sImg, 3) + ' mm apart in the image', color: C.muted },
          { t: 'resolution limit ' + kit.fmt(O.dR, 3) + ' nm; the eye needs at least 0.1 mm', color: C.muted, gap: 12 },
          { t: 'You see: ' + verdict, size: 13.5, weight: 600, color: resolved && bigEnough ? C.ok : C.bad },
          !resolved ? { t: 'The objects are closer than the resolution limit: more magnification cannot help.', color: C.muted }
            : !bigEnough ? { t: 'The optics separate them, but their image is too small for the eye: magnify more.', color: C.muted } : null,
          empty ? { t: 'Beyond about ' + big(kit, Math.round(O.useHi)) + '× the image only grows bigger and blurrier: empty magnification.', color: C.warn } : null,
          sImg / 2 > span / 2 ? { t: 'The objects lie outside the part of the field shown: lower the magnification.', color: C.warn } : null,
          O.light ? null : { t: 'Specimen: dead, fixed and in a vacuum.', color: C.muted }
        ]);
        // ---- read-outs
        ro.set('M', big(kit, O.M) + '×');
        ro.set('res', kit.fmt(O.dR, 3) + ' nm' + (O.light ? ' (0.61 λ/NA)' : ' (lens aberrations)'));
        ro.set('abbe', O.light ? kit.fmt(O.abbe, 3) + ' nm' : 'λ ≈ 0.0037 nm at 100 kV');
        ro.set('img', kit.fmt(sImg, 3) + ' mm');
        ro.set('use', big(kit, Math.round(O.useLo)) + '–' + big(kit, Math.round(O.useHi)) + '×');
        ro.set('verdict', verdict);
        // ---- brightness profile across the specimen
        const rSpec = r / O.M * 1e6, X = Math.max(sep, 3 * rSpec), tot = [], p1 = [], p2 = [];
        for (let k = 0; k <= 200; k++) {
          const x = -X + 2 * X * k / 200, a = airy(3.8317 * Math.abs(x - sep / 2) * O.M * 1e-6 / r), b = airy(3.8317 * Math.abs(x + sep / 2) * O.M * 1e-6 / r);
          tot.push([x, a + b]); p1.push([x, a]); p2.push([x, b]);
        }
        plot.set({
          series: [{ pts: tot, label: 'what you see', color: C.accent }, { pts: p1, label: 'each object alone', color: C.muted, dash: [4, 4], width: 1.2 }, { pts: p2, color: C.muted, dash: [4, 4], width: 1.2 }],
          x: { label: 'position across the specimen (nm)', min: -X, max: X }, y: { label: 'brightness', min: 0, max: 2.1 },
          vlines: [{ x: -sep / 2 }, { x: sep / 2 }]
        });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ DIFFUSION ACROSS A MEMBRANE */
  const SOLUTES = {
    o2: { name: 'O₂', D: 2.0e-9, how: 'bilayer', hue: 200 },
    glucose: { name: 'glucose', D: 6.7e-10, how: 'carrier', hue: 45 },
    ion: { name: 'Na⁺', D: 1.33e-9, how: 'channel', hue: 25 }
  };

  Hyper.sim('cell-diffusion', {
    title: 'Diffusion across a membrane',
    blurb: `Molecules random-walk in two compartments, each 10 µm wide, separated by a membrane. Each step is drawn at random, yet more molecules cross from the crowded side than back, so the two sides even out — diffusion down the gradient. Oxygen dissolves in the lipid bilayer and crosses anywhere; glucose and Na⁺ cross only where the membrane has proteins: **carriers** that hold one molecule at a time, or open **channels**. Time runs in slow motion; the step size is set by each molecule's real diffusion coefficient.

**Try this**
- Oxygen, 200 against 20: the dashed curves are the exact theory for free diffusion in this box. Note the half-time — a few milliseconds for 10 µm.
- Switch to Na⁺ with no channels: nothing crosses at all. Add channels one by one and watch the half-time shrink.
- Glucose with 2 carriers, then start with 300 on the left: the carriers are busy all the time and the net flux stops rising — facilitated diffusion **saturates**, like an enzyme.
- Start with equal numbers on both sides: molecules still cross all the time, but the net flux is zero — equilibrium is dynamic.`,
    mount(box, kit, params) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      let running = true;
      const ctl = kit.controls(box.side, [
        { id: 'solute', type: 'select', label: 'Molecule', options: [['Oxygen — crosses the bilayer', 'o2'], ['Glucose — needs carriers', 'glucose'], ['Na⁺ ions — need channels', 'ion']], value: SOLUTES[params && params.solute] ? params.solute : 'o2' },
        { id: 'nL', label: 'Molecules starting on the left', min: 0, max: 300, step: 10, value: 200 },
        { id: 'nR', label: 'Molecules starting on the right', min: 0, max: 300, step: 10, value: 20 },
        { id: 'ports', label: 'Channels or carriers in the membrane', min: 0, max: 12, step: 1, value: 4 },
        { id: 'speed', label: 'Slow motion: simulated ms per second', min: 1, max: 100, value: 10, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => {
        if (id === 'pause') running = !running;
        else if (id === 'ports') placePorts();
        else if (id !== 'speed') restart();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Simulated time'], ['n', 'Left / right'], ['flux', 'Net flux, left → right'], ['half', 'Difference halved after'], ['x2', 'x²/2D for 10 µm']]);
      const plot = kit.plot(gb, { x: { label: 'time (ms)', min: 0 }, y: { label: 'molecules', min: 0 }, legend: true }, 170);
      const W0 = 20, H0 = 10, X0 = 10, STEP = 0.4;                      // µm
      let R, parts, ports, t, hist, flux, crossed, halfT, theoryHalf, diff0, lastRec;
      const sol = () => SOLUTES[V.solute] || SOLUTES.o2;

      function placePorts() {
        const n = Math.round(V.ports), old = ports || [];
        for (const p of old) if (p.busy && p.part) { p.part.bound = false; p.part.x = p.from === 'L' ? X0 - 0.3 : X0 + 0.3; }
        ports = [];
        for (let k = 0; k < n; k++) ports.push({ y: (k + 0.5) * H0 / n, busy: false, t: 0, part: null, from: 'L' });
      }
      // free diffusion between two halves of a closed box: the fraction of the initial difference left at time t
      function theory(ts) {
        const Dm = sol().D * 1e12;
        let s = 0;
        for (let n = 1; n < 200; n += 2) s += 8 / (n * n * Math.PI * Math.PI) * Math.exp(-n * n * Math.PI * Math.PI * Dm * ts / (W0 * W0));
        return s;
      }
      function restart() {
        R = B.rng(21); parts = []; t = 0; hist = []; flux = 0; crossed = 0; halfT = null; lastRec = -1;
        for (let k = 0; k < V.nL; k++) parts.push({ x: R() * (X0 - 0.2), y: R() * H0, bound: false });
        for (let k = 0; k < V.nR; k++) parts.push({ x: X0 + 0.2 + R() * (W0 - X0 - 0.2), y: R() * H0, bound: false });
        ports = null; placePorts();
        diff0 = V.nL - V.nR;
        let lo = 0, hi = 1;                                             // the theoretical half-time, by bisection
        while (theory(hi) > 0.5 && hi < 1e3) hi *= 2;
        for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (theory(m) > 0.5) lo = m; else hi = m; }
        theoryHalf = hi;
        ctl.show('ports', sol().how !== 'bilayer');
      }
      restart();
      const portAt = y => { if (!ports.length) return -1; const half = 0.32; for (let k = 0; k < ports.length; k++) if (Math.abs(y - ports[k].y) < half) return k; return -1; };

      function stepAll(h) {
        const S = sol(), a = Math.sqrt(24 * S.D * 1e12 * h);             // uniform step with variance 2Dh per axis
        for (const cr of ports) if (cr.busy) {
          cr.t -= h;
          if (cr.t <= 0) { const p = cr.part; p.bound = false; p.y = cr.y; p.x = cr.from === 'L' ? X0 + 0.3 : X0 - 0.3; crossed += cr.from === 'L' ? 1 : -1; cr.busy = false; cr.part = null; }
        }
        for (const p of parts) {
          if (p.bound) continue;
          let x = p.x + (R() - 0.5) * a, y = p.y + (R() - 0.5) * a;
          if (y < 0) y = -y; if (y > H0) y = 2 * H0 - y;
          if (x < 0) x = -x; if (x > W0) x = 2 * W0 - x;
          const was = p.x < X0, now = x < X0;
          if (was !== now) {
            if (S.how !== 'bilayer') {
              const k = portAt((p.y + y) / 2);
              if (k < 0) x = p.x;                                         // lipid: blocked
              else if (S.how === 'carrier') {
                const cr = ports[k];
                if (cr.busy) x = p.x;                                     // the carrier is occupied
                else { cr.busy = true; cr.part = p; cr.from = was ? 'L' : 'R'; cr.t = 0.002 * (0.5 + R()); p.bound = true; p.x = X0; p.y = cr.y; continue; }
              }
            }
            if ((x < X0) !== was) crossed += was ? 1 : -1;
          }
          p.x = x; p.y = y;
        }
      }

      const loop = kit.loop((dt) => {
        const S = sol();
        if (running) {
          const want = dt * V.speed * 1e-3, h0 = STEP * STEP / (24 * S.D * 1e12);
          const n = Math.min(400, Math.max(1, Math.ceil(want / h0))), h = Math.min(h0, want / n);
          const c0 = crossed;
          for (let k = 0; k < n; k++) stepAll(h);
          t += n * h;
          const inst = n * h > 0 ? (crossed - c0) / (n * h * 1e3) : 0;     // molecules per ms
          flux += (inst - flux) * Math.min(1, dt * 2);
        }
        let nL = 0, nR = 0, nB = 0;
        for (const p of parts) { if (p.bound) nB++; else if (p.x < X0) nL++; else nR++; }
        const tms = t * 1e3;
        if (running && tms - lastRec >= 0.05) { hist.push([tms, nL, nR]); lastRec = tms; if (hist.length > 800) hist = hist.filter((_, i) => i % 2 === 0); }
        if (halfT == null && diff0 !== 0 && Math.abs(nL - nR) <= Math.abs(diff0) / 2) halfT = tms;
        // ---- read-outs
        ro.set('t', kit.fmt(tms, 3) + ' ms');
        ro.set('n', nL + ' / ' + nR + (nB ? ' (' + nB + ' in carriers)' : ''));
        ro.set('flux', kit.fmt(flux, 2) + ' molecules per ms');
        ro.set('half', halfT != null ? kit.fmt(halfT, 3) + ' ms' + (S.how === 'bilayer' ? ' (theory ' + kit.fmt(theoryHalf * 1e3, 3) + ' ms)' : '') : diff0 === 0 ? 'no difference to halve' : S.how !== 'bilayer' && !ports.length ? 'never — no way through' : 'not yet');
        ro.set('x2', fmtTime(kit, B.diffusionTime(10e-6, S.D)) + ' for ' + S.name);
        const N = V.nL + V.nR, series = [{ pts: hist.map(q => [q[0], q[1]]), label: 'left', color: kit.colors().accent }, { pts: hist.map(q => [q[0], q[2]]), label: 'right', color: kit.colors().series[1] }];
        if (S.how === 'bilayer' && hist.length) {
          const th = [], tmax = Math.max(hist[hist.length - 1][0], 1);
          for (let k = 0; k <= 80; k++) { const tt = tmax * k / 80, f = theory(tt * 1e-3); th.push([tt, N / 2 + (V.nL - N / 2) * f, N / 2 + (V.nR - N / 2) * f]); }
          series.push({ pts: th.map(q => [q[0], q[1]]), label: 'theory', color: kit.colors().muted, dash: [5, 4], width: 1.3 }, { pts: th.map(q => [q[0], q[2]]), color: kit.colors().muted, dash: [5, 4], width: 1.3 });
        }
        plot.set({ series, y: { label: 'molecules', min: 0, max: Math.max(10, N) } });
        // ---- drawing
        const c = st.begin(), C = kit.colors(), k = Math.min((st.W - 20) / W0, (st.H - 44) / H0), ox = (st.W - W0 * k) / 2, oy = 24;
        c.fillStyle = kit.hue(S.hue, 0.06); c.fillRect(ox, oy, W0 * k, H0 * k);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(ox, oy, W0 * k, H0 * k);
        // membrane: two leaflets of lipid heads, with proteins
        const mx = ox + X0 * k, gap = Math.max(3, 0.12 * k), headR = Math.max(1.6, k * 0.07);
        const blockedAt = y => S.how !== 'bilayer' && portAt(y) >= 0;
        c.strokeStyle = C.faint; c.lineWidth = 1;
        for (let y = 0.1; y < H0; y += 0.22) {
          if (blockedAt(y)) continue;
          const Y = oy + y * k;
          c.beginPath(); c.moveTo(mx - gap, Y); c.lineTo(mx + gap, Y); c.stroke();
          kit.dot(c, mx - gap, Y, headR, C.muted); kit.dot(c, mx + gap, Y, headR, C.muted);
        }
        if (S.how !== 'bilayer') for (const p of ports) {
          const Y = oy + p.y * k, hh = 0.32 * k, w = gap * 2 + 8;
          c.fillStyle = S.how === 'channel' ? kit.hue(280, 0.55) : (p.busy ? kit.hue(S.hue, 0.8) : kit.hue(140, 0.55));
          if (S.how === 'channel') { c.fillRect(mx - w / 2, Y - hh - 5, w, 5); c.fillRect(mx - w / 2, Y + hh, w, 5); }
          else { c.beginPath(); c.ellipse(mx, Y, w / 2 + 2, hh + 3, 0, 0, TAU); c.fill(); }
        }
        const col = kit.hue(S.hue);
        for (const p of parts) if (!p.bound) kit.dot(c, ox + p.x * k, oy + p.y * k, 2.6, col);
        kit.label(c, 'left: ' + nL, ox + 4, 12, { align: 'left', size: 12, color: C.text, weight: 600 });
        kit.label(c, 'right: ' + nR, ox + W0 * k - 4, 12, { align: 'right', size: 12, color: C.text, weight: 600 });
        kit.label(c, S.how === 'bilayer' ? 'membrane: lipid bilayer' : S.how === 'channel' ? 'membrane with ' + ports.length + ' channels' : 'membrane with ' + ports.length + ' carriers', mx, 12, { align: 'center', size: 11.5, color: C.muted });
        kit.label(c, '10 µm', ox + 5 * k, oy + H0 * k + 10, { align: 'center', size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ OSMOSIS: RED CELL AND PLANT CELL */
  const RBC = { V0: 90, Vb: 36, Vlys: 148, osm0: 290, kw: 0.12, Pu: 20 };   // fL, fL, fL, mOsm/L, fL/(s·mOsm/L), fL/s
  const mpa = v => (Math.abs(v) < 0.005 ? '0.00' : (v < 0 ? '−' : '+') + Math.abs(v).toFixed(2)) + ' MPa';
  const RT20 = 8.314462618 * 293.15 / 1e6;                             // RT at 20 °C in MPa per (mol/m³): ψs = −C·RT

  Hyper.sim('cell-osmosis', {
    title: 'Cells in solutions: osmosis and water potential',
    blurb: `**Red blood cell.** A red cell is an almost perfect osmometer: water crosses its membrane in a fraction of a second (slowed here), and its volume settles where the inside and outside have the same osmolarity — minus an inactive 40 % that is mostly haemoglobin (the Boyle–van 't Hoff line in the graph). Its membrane bends but barely stretches, so once the disc has swollen into a sphere, about 148 fL, it bursts.

**Plant cell.** Here the cell sap has a solute potential ψs, and the wall pushes back with turgor ψp as the protoplast swells. Water moves until the cell's water potential ψ = ψs + ψp equals that of the solution outside, ψ = −CRT for sucrose (20 °C). The graph is a Höfler diagram.

**Try this**
- Red cell: lower the salt from 290 to 150 mOsm/L — the disc swells into a sphere but survives. At 130 it bursts (haemolysis). At 600 it shrinks and crinkles (crenation).
- Put the red cell in 290 of salt plus 290 of urea: it first shrinks (the outside is hyperosmotic), then recovers as urea leaks in. Now try urea alone, with no salt: isosmotic, yet the cell bursts — urea is not an effective osmole.
- Plant cell in pure water: it becomes turgid at ψp ≈ +0.7 MPa, but cannot burst. Raise the sucrose until ψp reaches zero (incipient plasmolysis, about 0.33 M), then beyond: the protoplast pulls away from the wall.
- Make the wall stiffer: the cell reaches the same turgor with less swelling.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Cell', options: [['Human red blood cell', 'red'], ['Plant cell', 'plant']], value: params && params.mode === 'plant' ? 'plant' : 'red' },
        { id: 'salt', label: 'Salt outside (cannot enter)', min: 0, max: 700, step: 5, value: 290, unit: 'mOsm/L' },
        { id: 'urea', label: 'Urea outside (enters slowly)', min: 0, max: 600, step: 10, value: 0, unit: 'mOsm/L' },
        { id: 'suc', label: 'Sucrose outside', min: 0, max: 1, step: 0.01, value: 0, unit: 'M' },
        { id: 'sap', label: 'Solute potential of the sap, ψs at full size', min: -2, max: -0.3, step: 0.05, value: -0.8, unit: 'MPa' },
        { id: 'eps', label: 'Stiffness of the wall (elastic modulus)', min: 1, max: 20, step: 0.5, value: 5, unit: 'MPa' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Fresh cell', primary: true }] }
      ], (id) => { if (id === 'mode') { modes(); reset(); } else if (id === 'reset') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['vol', 'Volume'], ['osin', 'Osmolarity inside'], ['osout', 'Osmolarity outside'], ['ton', 'The solution is'],
        ['psout', 'ψ outside'], ['pss', 'ψs of the cell'], ['psp', 'ψp (turgor)'], ['psi', 'ψ of the cell'], ['state', 'State']]);
      const plot = kit.plot(gb, { x: { label: '' }, y: { label: '' } }, 180);
      let Vc, nU, lysed, lysT, x, flow, R;
      function reset() { Vc = RBC.V0; nU = 0; lysed = false; lysT = 0; x = 1; flow = 0; R = kit.bio.rng(3); }
      function modes() {
        const red = V.mode !== 'plant';
        for (const id of ['salt', 'urea']) ctl.show(id, red);
        for (const id of ['suc', 'sap', 'eps']) ctl.show(id, !red);
        for (const k of ['vol', 'osin', 'osout', 'ton']) ro.show(k, red);
        for (const k of ['psout', 'pss', 'psp', 'psi']) ro.show(k, !red);
        ro.show('vol', true);
      }
      reset(); modes();
      const nImp = RBC.osm0 * (RBC.V0 - RBC.Vb);                        // impermeant osmoles inside (mOsm/L × fL)
      const psiOut = () => -V.suc * 1000 * RT20;                         // MPa
      const plantPsi = xx => { const n = -V.sap, s = -n / xx, p = V.eps * Math.max(0, xx - 1); return { s, p, t: s + p }; };
      // an Evans–Fung red-cell profile (half-thickness, µm) at relative radius u
      const zDisc = u => 0.5 * Math.sqrt(Math.max(0, 1 - u * u)) * (0.81 + 7.83 * u * u - 4.39 * u * u * u * u);

      const loop = kit.loop((dt) => {
        const red = V.mode !== 'plant', subs = Math.max(1, Math.ceil(dt / 0.005)), h = dt / subs;
        let rate = 0;
        for (let k = 0; k < subs; k++) {
          if (red) {
            if (lysed) { lysT += h; continue; }
            const inside = (nImp + nU) / (Vc - RBC.Vb), outside = V.salt + V.urea;
            const dV = RBC.kw * (inside - outside);
            nU += RBC.Pu * (V.urea - nU / (Vc - RBC.Vb)) * h;
            Vc = Math.max(RBC.Vb + 2, Vc + dV * h); rate = dV;
            if (Vc >= RBC.Vlys) { lysed = true; Vc = RBC.Vlys; }
          } else {
            const dx = 0.12 * (psiOut() - plantPsi(x).t);
            x = clamp(x + dx * h, 0.12, 2); rate = dx;
          }
        }
        flow += (rate - flow) * Math.min(1, dt * 8);
        const c = st.begin(), C = kit.colors();
        if (red) drawRed(c, C); else drawPlant(c, C);
      }, box.stage);

      function arrows(c, C, cx, cy, rx, ry, q, n) {
        const L = clamp(Math.abs(q), 0, 1) * 26;
        if (L < 2) return;
        for (let k = 0; k < n; k++) {
          const a = k / n * TAU + 0.3, ux = Math.cos(a), uy = Math.sin(a), x1 = cx + ux * (rx + 8), y1 = cy + uy * (ry + 8), x2 = cx + ux * (rx + 8 + L), y2 = cy + uy * (ry + 8 + L);
          q > 0 ? kit.arrow(c, x2, y2, x1, y1, kit.hue(205), 2) : kit.arrow(c, x1, y1, x2, y2, kit.hue(205), 2);
        }
      }

      function drawRed(c, C) {
        const out = V.salt + V.urea, inside = lysed ? out : (nImp + nU) / (Vc - RBC.Vb);
        c.fillStyle = kit.hue(210, 0.04 + 0.22 * clamp(out / 900, 0, 1)); c.fillRect(0, 0, st.W, st.H);
        const k = Math.min(st.W * 0.6 / 21, (st.H - 50) / 9.5), fy = st.H / 2 + 6, fx = 16 + 5.6 * k, sx = fx + 9.6 * k;
        const s = lysed ? 1 : clamp((Vc - RBC.V0) / (RBC.Vlys - RBC.V0), 0, 1), shrink = clamp((0.95 * RBC.V0 - Vc) / (0.35 * RBC.V0), 0, 1);
        const Rr = lerp(3.91, 3.28, s) * (1 - 0.08 * shrink), spikes = th => shrink * 0.45 * Math.pow(Math.max(0, Math.sin(11 * th)), 6);
        const body = lysed ? kit.hue(0, 0.14) : C.dark ? 'hsl(0 62% 46%)' : 'hsl(0 65% 52%)', rim = lysed ? kit.hue(0, 0.6) : C.dark ? 'hsl(0 60% 30%)' : 'hsl(0 60% 38%)';
        // face view
        c.beginPath();
        for (let m = 0; m <= 120; m++) { const th = m / 120 * TAU, r = (Rr + spikes(th)) * k; m ? c.lineTo(fx + r * Math.cos(th), fy + r * Math.sin(th)) : c.moveTo(fx + r, fy); }
        c.closePath(); c.fillStyle = body; c.fill(); c.strokeStyle = rim; c.lineWidth = 1.5; c.stroke();
        if (!lysed && s < 0.9) {                                         // the pale centre of a biconcave disc
          const g = c.createRadialGradient(fx, fy, 0, fx, fy, Rr * k * 0.62);
          g.addColorStop(0, 'rgba(255,255,255,' + (0.42 * (1 - s)).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,255,255,0)');
          c.fillStyle = g; c.beginPath(); c.arc(fx, fy, Rr * k * 0.62, 0, TAU); c.fill();
        }
        if (lysed) {                                                      // haemoglobin leaking away
          const spread = Math.min(1, lysT / 3);
          for (let m = 0; m < 70; m++) { const a = m * 2.399, d = (Rr + 0.5 + spread * 4 * ((m * 37) % 11) / 11) * k; kit.dot(c, fx + d * Math.cos(a), fy + d * Math.sin(a), 1.8, kit.hue(0, 0.7 * (1 - 0.6 * spread))); }
        }
        kit.label(c, 'seen from above', fx, fy - 4.9 * k, { align: 'center', size: 11.5, color: C.muted });
        // side view (cross-section)
        c.beginPath();
        for (let m = 0; m <= 80; m++) {
          const u = -1 + 2 * m / 80, zd = zDisc(u) * (Vc < RBC.V0 ? Math.max(0.45, Vc / RBC.V0) : 1), zs = 3.28 * Math.sqrt(Math.max(0, 1 - u * u)), z = lysed ? zs : lerp(zd, zs, s);
          const X = sx + u * Rr * k, Y = fy - z * k - (u * u > 0.8 ? spikes(u * 9) * k : 0);
          m ? c.lineTo(X, Y) : c.moveTo(X, Y);
        }
        for (let m = 80; m >= 0; m--) {
          const u = -1 + 2 * m / 80, zd = zDisc(u) * (Vc < RBC.V0 ? Math.max(0.45, Vc / RBC.V0) : 1), zs = 3.28 * Math.sqrt(Math.max(0, 1 - u * u)), z = lysed ? zs : lerp(zd, zs, s);
          c.lineTo(sx + u * Rr * k, fy + z * k);
        }
        c.closePath(); c.fillStyle = body; c.fill(); c.strokeStyle = rim; c.stroke();
        kit.label(c, 'cut through the middle', sx, fy - 4.9 * k, { align: 'center', size: 11.5, color: C.muted });
        if (!lysed) arrows(c, C, fx, fy, Rr * k, Rr * k, flow / 25, 8);
        // concentration bars
        const bx = st.W - 150, bh = st.H - 70, top = 34, sc = v => clamp(v / 900, 0, 1) * bh;
        const bar = (x0, v, vu, label) => {
          c.fillStyle = kit.hue(210, 0.5); c.fillRect(x0, top + bh - sc(v), 34, sc(v));
          if (vu > 0) { c.fillStyle = kit.hue(45, 0.8); c.fillRect(x0, top + bh - sc(v), 34, sc(vu)); }
          c.strokeStyle = C.faint; c.strokeRect(x0, top, 34, bh);
          kit.label(c, label, x0 + 17, top + bh + 12, { align: 'center', size: 11.5, color: C.muted });
          kit.label(c, Math.round(v) + '', x0 + 17, top + bh - sc(v) - 8, { align: 'center', size: 11.5, color: C.text });
        };
        bar(bx, inside, lysed ? 0 : nU / (Vc - RBC.Vb), 'inside');
        bar(bx + 58, out, V.urea, 'outside');
        kit.label(c, 'mOsm/L (yellow: urea)', bx + 46, 14, { align: 'center', size: 11.5, color: C.muted });
        const ton = V.salt < 270 ? 'hypotonic' : V.salt > 310 ? 'hypertonic' : 'isotonic';
        const state = lysed ? 'haemolysed — the membrane burst' : Vc > 0.95 * RBC.Vlys ? 'a sphere, about to burst' : Vc > 1.08 * RBC.V0 ? 'swollen' : Vc < 0.9 * RBC.V0 ? 'shrunken and crenated' : 'a normal biconcave disc';
        kit.label(c, state, 12, st.H - 12, { align: 'left', size: 13, color: lysed ? C.bad : C.text, weight: 600 });
        ro.set('vol', kit.fmt(Vc, 3) + ' fL (' + Math.round(100 * Vc / RBC.V0) + ' % of normal)');
        ro.set('osin', lysed ? '—' : Math.round(inside) + ' mOsm/L');
        ro.set('osout', Math.round(out) + ' mOsm/L' + (V.urea > 0 ? ' (' + Math.round(V.urea) + ' urea)' : ''));
        ro.set('ton', ton + (V.urea > 0 ? ' in effect (urea enters)' : ''));
        ro.set('state', state);
        const curve = []; for (let q = 115; q <= 1300; q += 15) curve.push([q, RBC.V0 * (0.4 + 0.6 * RBC.osm0 / q)]);
        plot.set({
          series: [{ pts: curve, label: 'Boyle–van \'t Hoff: V = V₀[0.4 + 0.6 × 290/C]', color: C.muted, width: 1.5 }],
          x: { label: 'osmolarity outside (mOsm/L)', min: 0, max: 1300 }, y: { label: 'cell volume (fL)', min: 0, max: 180 },
          hlines: [{ y: RBC.Vlys, label: 'bursts (sphere)' }, { y: RBC.V0, label: 'normal' }],
          marks: [{ x: out, y: Vc, label: 'now', color: lysed ? C.bad : C.accent }]
        });
      }

      function drawPlant(c, C) {
        const po = psiOut(), P = plantPsi(x), state = x > 1.005 ? 'turgid' : x > 0.985 ? 'flaccid — incipient plasmolysis' : 'plasmolysed';
        c.fillStyle = kit.hue(45, 0.04 + 0.2 * clamp(V.suc, 0, 1)); c.fillRect(0, 0, st.W, st.H);
        const cx = st.W * 0.3, cy = st.H / 2 + 4, w1 = Math.min(st.W * 0.4, (st.H - 40) * 1.5), h1 = w1 / 1.5, wall = Math.sqrt(Math.max(1, x));
        const Ww = w1 * wall, Hw = h1 * wall, thick = 7;
        const rr = (x0, y0, w, h, r) => { c.beginPath(); c.moveTo(x0 + r, y0); c.arcTo(x0 + w, y0, x0 + w, y0 + h, r); c.arcTo(x0 + w, y0 + h, x0, y0 + h, r); c.arcTo(x0, y0 + h, x0, y0, r); c.arcTo(x0, y0, x0 + w, y0, r); c.closePath(); };
        // protoplast: fills the wall when x ≥ 1, shrinks away from it below
        const f = Math.sqrt(Math.min(1, x)), Wp = (Ww - 2 * thick) * f, Hp = (Hw - 2 * thick) * f;
        rr(cx - Wp / 2, cy - Hp / 2, Wp, Hp, Math.min(Wp, Hp) * (x < 1 ? 0.45 : 0.12));
        c.fillStyle = C.dark ? 'hsl(110 35% 30%)' : 'hsl(110 40% 78%)'; c.fill(); c.strokeStyle = C.dark ? 'hsl(110 40% 55%)' : 'hsl(110 40% 40%)'; c.lineWidth = 1.5; c.stroke();
        rr(cx - Wp * 0.36, cy - Hp * 0.34, Wp * 0.72, Hp * 0.68, Math.min(Wp, Hp) * 0.3);   // the vacuole
        c.fillStyle = kit.hue(205, 0.35); c.fill(); c.strokeStyle = kit.hue(205, 0.7); c.lineWidth = 1; c.stroke();
        kit.label(c, 'vacuole', cx, cy, { align: 'center', size: 11.5, color: C.text });
        for (let m = 0; m < 14; m++) {                                      // chloroplasts in the thin layer of cytoplasm
          const a = m / 14 * TAU, ex = cx + Math.cos(a) * Wp * 0.43, ey = cy + Math.sin(a) * Hp * 0.41;
          c.beginPath(); c.ellipse(ex, ey, 6, 3.2, a + Math.PI / 2, 0, TAU); c.fillStyle = C.dark ? 'hsl(120 55% 42%)' : 'hsl(120 55% 36%)'; c.fill();
        }
        rr(cx - Ww / 2, cy - Hw / 2, Ww, Hw, 12);
        c.strokeStyle = C.dark ? 'hsl(75 35% 55%)' : 'hsl(75 40% 35%)'; c.lineWidth = thick; c.stroke();
        arrows(c, C, cx, cy, Ww / 2, Hw / 2, flow * 3, 8);
        // the numbers
        const tx = Math.max(st.W * 0.58, cx + Ww / 2 + 40);
        textBlock(kit, c, tx, 28, st.W - tx - 10, [
          { t: 'outside: ψ = ' + mpa(po), size: 13, weight: 600, color: C.text, gap: 8 },
          { t: 'cell: ψs = ' + mpa(P.s), color: C.muted },
          { t: 'ψp = ' + mpa(P.p) + ' (turgor)', color: C.muted },
          { t: 'ψ = ψs + ψp = ' + mpa(P.t), size: 13, weight: 600, color: C.text, gap: 12 },
          { t: Math.abs(flow) < 0.002 ? 'no net flow of water' : flow > 0 ? 'water flows in, towards the lower ψ' : 'water flows out, towards the lower ψ', color: C.muted, gap: 8 },
          { t: state, size: 14, weight: 600, color: state === 'plasmolysed' ? C.bad : state === 'turgid' ? C.ok : C.warn }
        ]);
        ro.set('vol', Math.round(100 * x) + ' % of the size at incipient plasmolysis');
        ro.set('psout', mpa(po) + ' (−CRT, 20 °C)');
        ro.set('pss', mpa(P.s));
        ro.set('psp', mpa(P.p));
        ro.set('psi', mpa(P.t));
        ro.set('state', state);
        const ps = [], pp = [], pt = [];
        for (let q = 0; q <= 100; q++) { const xx = 0.3 + q / 100, Q = plantPsi(xx); if (Q.s >= -3.2) { ps.push([xx, Q.s]); pt.push([xx, Q.t]); } pp.push([xx, Q.p]); }
        plot.set({
          series: [{ pts: pt, label: 'ψ of the cell', color: C.accent }, { pts: ps, label: 'ψs', color: C.series[1], dash: [5, 4] }, { pts: pp, label: 'ψp', color: C.series[2], dash: [5, 4] }],
          x: { label: 'relative volume of the protoplast (Höfler diagram)', min: 0.3, max: 1.3 }, y: { label: 'MPa', min: -3.2, max: 2 },
          hlines: [{ y: po, label: 'ψ outside' }], vlines: [{ x: 1, label: 'wall reached' }],
          marks: [{ x: x, y: P.t, label: 'now', color: C.accent }]
        });
      }
      loop.start();
    }
  });

  /* ================================================================ THE Na⁺/K⁺ PUMP */
  // the Post–Albers cycle: [start, end) of each stage as a fraction of one cycle
  const PUMP_STAGES = [
    [0.00, 0.18, '1 · E1, facing the cytoplasm', '3 Na⁺ bind, and ATP binds'],
    [0.18, 0.28, '2 · ATP phosphorylates an aspartate', 'the 3 Na⁺ are locked in (occluded)'],
    [0.28, 0.40, '3 · E2-P', 'the pump flips to face the outside'],
    [0.40, 0.55, '4 · release', 'the 3 Na⁺ leave to the outside'],
    [0.55, 0.70, '5 · 2 K⁺ bind from outside', ''],
    [0.70, 0.80, '6 · the phosphate leaves', 'the 2 K⁺ are locked in'],
    [0.80, 1.00, '7 · back to E1', '2 K⁺ released inside: one ATP spent']
  ];
  const RT37 = 8.314462618 * 310.15 / 1000, F_kJ = 96.48533212;          // kJ/mol, kJ/(mol·V)
  const mV = v => { const r = Math.round(v); return (r === 0 ? '0' : (r < 0 ? '−' : '+') + Math.abs(r)) + ' mV'; };

  Hyper.sim('cell-pump', {
    title: 'The sodium–potassium pump',
    blurb: `Top: one Na⁺/K⁺-ATPase going through its cycle — 3 Na⁺ out, 2 K⁺ in, one ATP — slowed down enormously (a real pump turns over about a hundred times a second). The ions drawn on each side are in proportion to their concentrations. Bottom: a whole cell, in which Na⁺ leaks in and K⁺ leaks out through channels all the time, and its pumps put them back. The membrane potential is the one at which the Na⁺ leak, the K⁺ leak and the pump current add up to no net charge.

**Try this**
- Watch one cycle and count: three orange Na⁺ leave, two purple K⁺ enter, one ATP becomes ADP and phosphate. One net positive charge leaves each time — the pump is electrogenic.
- Add ouabain (or take away ATP): the pump stops, Na⁺ creeps up and K⁺ down over tens of minutes, and the membrane potential drifts towards zero. Remove it again and the pump restores the gradients.
- Double the Na⁺ leak: internal Na⁺ rises a little, the pump speeds up (it is stimulated by internal Na⁺) and a new steady state is reached.
- Raise K⁺ outside to 8–10 mM, as in hyperkalaemia: the cell depolarises by about 15–20 mV — why a high blood potassium affects the heart.
- Check the energy read-out: moving the ions costs about 40–45 kJ per mole of cycles, a little less than the 50–60 kJ/mol that ATP supplies in a cell.`,
    mount(box, kit) {
      const M = kit.med;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'anim', label: 'Animation: cycles shown per second', min: 0.1, max: 1.5, step: 0.05, value: 0.35 },
        { id: 'atp', type: 'check', label: 'ATP available', value: true },
        { id: 'ouabain', type: 'check', label: 'Add ouabain (blocks the pump)', value: false },
        { id: 'Ko', label: 'K⁺ outside', min: 1, max: 10, step: 0.5, value: 4, unit: 'mM' },
        { id: 'leak', label: 'Na⁺ leak (× normal)', min: 0.5, max: 3, step: 0.1, value: 1 },
        { id: 'tscale', label: 'Cell time: minutes per second', min: 0.5, max: 10, step: 0.5, value: 2 },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset the cell', primary: true }] }
      ], (id) => { if (id === 'reset') resetCell(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['stage', 'Pump'], ['count', 'Cycles shown'], ['nai', 'Na⁺ inside'], ['ki', 'K⁺ inside'], ['vm', 'Membrane potential'], ['rate', 'Pumping rate'], ['dg', 'Energy per cycle']]);
      const plot = kit.plot(gb, { x: { label: 'cell time (min)', min: 0 }, y: { label: 'concentration inside (mM)', min: 0, max: 160 }, legend: true }, 160);
      const R = kit.bio.rng(9), NAO = 145, KD = 15;
      // the resting cell sets the leak constants, so that it is in a steady state with the pump at 1 mM/min
      const pumpF = (nai, ko) => Math.pow(nai, 3) / (Math.pow(nai, 3) + KD * KD * KD) * ko * ko / (ko * ko + 2.25);
      const JMAX = 1 / pumpF(12, 4);
      // leak conductances (mM/min per mV) chosen so that the resting cell sits at −73 mV with the pump at 1 mM/min
      const VM0 = -73, kNa = 3 / (M.nernst(1, NAO, 12) - VM0), kK = -2 / (M.nernst(1, 4, 140) - VM0);
      // no net charge may cross (the membrane holds almost none): Na⁺ leak + K⁺ leak − pump current = 0 fixes Vm
      const vmOf = (nai, ki, ko, jp, leak) => (leak * kNa * M.nernst(1, NAO, nai) + kK * M.nernst(1, ko, ki) - jp) / (leak * kNa + kK);
      let nai, ki, tmin, hist, phase, cycles, lastRec;
      function resetCell() { nai = 12; ki = 140; tmin = 0; hist = [[0, 12, 140]]; lastRec = 0; }
      resetCell(); phase = 0; cycles = 0;
      // background ions, jiggling
      const bg = [];
      for (let k = 0; k < 60; k++) bg.push({ u: R(), v: R(), side: k % 2 ? 'in' : 'out', kind: k < 30 ? 'Na' : 'K' });
      const ease = t => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
      const within = (p, a, b) => ease((p - a) / (b - a));

      const loop = kit.loop((dt) => {
        const pumpOn = V.atp && !V.ouabain;
        // ---- the cell, in minutes
        const dtm = dt * V.tscale, subs = Math.max(1, Math.ceil(dtm / 0.02)), h = dtm / subs;
        let jp = 0, vm = VM0;
        for (let k = 0; k < subs; k++) {
          jp = pumpOn ? JMAX * pumpF(nai, V.Ko) : 0;
          vm = vmOf(nai, ki, V.Ko, jp, V.leak);
          const eNa = M.nernst(1, NAO, nai), eK = M.nernst(1, V.Ko, ki);
          nai = clamp(nai + (V.leak * kNa * (eNa - vm) - 3 * jp) * h, 0.5, NAO);
          ki = clamp(ki + (kK * (eK - vm) + 2 * jp) * h, 0.5, 200);
        }
        tmin += dtm;
        if (tmin - lastRec > 0.1) { hist.push([tmin, nai, ki]); lastRec = tmin; if (hist.length > 700) hist = hist.filter((_, i) => i % 2 === 0); }
        // ---- the molecule: blocked by ouabain in E2-P, or waiting for ATP in E1 with Na⁺ bound
        const hold = V.ouabain ? 0.555 : !V.atp ? 0.17 : null;
        if (hold == null) { phase += dt * V.anim; if (phase >= 1) { phase -= 1; cycles++; } }
        else if (Math.abs(phase - hold) > 0.004) phase = phase < hold ? Math.min(hold, phase + dt * V.anim) : (phase + dt * V.anim) % 1;
        const p = phase, stage = PUMP_STAGES.find(s => p >= s[0] && p < s[1]) || PUMP_STAGES[0];
        // ---- draw
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, my = Hh * 0.46, px = W * 0.32, mw = 22;
        const colNa = kit.hue(28), colK = kit.hue(275);
        c.fillStyle = kit.hue(210, 0.05); c.fillRect(0, 0, W * 0.64, my - mw);
        kit.label(c, 'outside the cell', 10, 14, { align: 'left', size: 12, color: C.muted });
        kit.label(c, 'cytoplasm', 10, Hh - 12, { align: 'left', size: 12, color: C.muted });
        // membrane
        c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.04)'; c.fillRect(0, my - mw, W * 0.64, 2 * mw);
        for (let x = 6; x < W * 0.64; x += 9) {
          if (Math.abs(x - px) < 40) continue;
          kit.dot(c, x, my - mw + 3, 3, C.muted); kit.dot(c, x, my + mw - 3, 3, C.muted);
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(x - 1, my - mw + 6); c.lineTo(x - 1, my - 2); c.moveTo(x + 1, my - mw + 6); c.lineTo(x + 1, my - 2); c.moveTo(x - 1, my + 2); c.lineTo(x - 1, my + mw - 6); c.moveTo(x + 1, my + 2); c.lineTo(x + 1, my + mw - 6); c.stroke();
        }
        // background ions in proportion to concentration (one dot per 10 mM, at least one)
        const want = { outNa: Math.max(1, Math.round(NAO / 10)), outK: Math.max(1, Math.round(V.Ko / 10)), inNa: Math.max(1, Math.round(nai / 10)), inK: Math.max(1, Math.round(ki / 10)) };
        const seen = { outNa: 0, outK: 0, inNa: 0, inK: 0 };
        for (const b of bg) {
          b.u = clamp(b.u + (R() - 0.5) * 0.01, 0.02, 0.98); b.v = clamp(b.v + (R() - 0.5) * 0.02, 0.05, 0.95);
          const key = b.side + b.kind;
          if (seen[key] >= want[key]) continue;
          seen[key]++;
          let x = 12 + b.u * (W * 0.62 - 24);
          if (Math.abs(x - px) < 60) x = x < px ? px - 60 : px + 60;
          const y = b.side === 'out' ? 24 + b.v * (my - mw - 40) : my + mw + 14 + b.v * (Hh - my - mw - 40);
          kit.dot(c, x, y, b.kind === 'Na' ? 5 : 6, b.kind === 'Na' ? kit.hue(28, 0.55) : kit.hue(275, 0.55));
        }
        // pump halves: gates open at the top (outward) or the bottom (inward)
        const gB = 1 - within(p, 0.18, 0.28) + within(p, 0.82, 0.95), gT = within(p, 0.28, 0.40) - within(p, 0.70, 0.80);
        const half = (sgn) => {
          const inner = w => px + sgn * (4 + 13 * w), outer = w => px + sgn * (30 + 7 * w);
          c.beginPath(); c.moveTo(inner(gT), my - 40); c.lineTo(outer(gT), my - 40); c.lineTo(outer(gB), my + 40); c.lineTo(inner(gB), my + 40); c.lineTo(px + sgn * 4, my); c.closePath();
          c.fillStyle = V.ouabain ? kit.hue(0, 0.35) : kit.hue(160, 0.45); c.fill(); c.strokeStyle = kit.hue(160, 0.95); c.lineWidth = 1.5; c.stroke();
        };
        half(-1); half(1);
        // ions of the animated cycle
        const naStart = [[-70, 80], [-25, 95], [35, 82]], naSite = [[-7, -8], [7, -8], [0, 6]], naEnd = [[-60, -95], [5, -110], [55, -90]];
        const kStart = [[-45, -105], [50, -100]], kSite = [[-6, 0], [6, 0]], kEnd = [[-50, 95], [45, 105]];
        const ion = (xy, col, lab, r) => { kit.dot(c, px + xy[0], my + xy[1], r, col); kit.label(c, lab, px + xy[0], my + xy[1] - r - 6, { align: 'center', size: 10.5, color: C.text }); };
        for (let i = 0; i < 3; i++) {
          const a = within(p, 0.02 + 0.04 * i, 0.10 + 0.04 * i), b = within(p, 0.40 + 0.03 * i, 0.50 + 0.03 * i);
          const xy = p < 0.40 ? [lerp(naStart[i][0], naSite[i][0], a), lerp(naStart[i][1], naSite[i][1], a)] : [lerp(naSite[i][0], naEnd[i][0], b), lerp(naSite[i][1], naEnd[i][1], b)];
          if (p < 0.55) ion(xy, colNa, 'Na⁺', 6);
        }
        for (let i = 0; i < 2; i++) {
          const a = within(p, 0.55 + 0.04 * i, 0.64 + 0.04 * i), b = within(p, 0.84 + 0.03 * i, 0.95 + 0.03 * i);
          const xy = p < 0.84 ? [lerp(kStart[i][0], kSite[i][0], a), lerp(kStart[i][1], kSite[i][1], a)] : [lerp(kSite[i][0], kEnd[i][0], b), lerp(kSite[i][1], kEnd[i][1], b)];
          if (p >= 0.52) ion(xy, colK, 'K⁺', 7);
        }
        // ATP → ADP + phosphate on the pump
        const atpIn = within(p, 0.04, 0.16), padX = px + 44, padY = my + 44;
        if (V.atp && p < 0.2) { const x = lerp(px + 120, padX, atpIn), y = lerp(my + 110, padY, atpIn); c.fillStyle = C.warn; c.fillRect(x - 13, y - 7, 26, 14); kit.label(c, 'ATP', x, y, { align: 'center', size: 10.5, color: '#000', weight: 600 }); }
        if (p >= 0.2 && p < 0.34) { const a = within(p, 0.2, 0.34), x = lerp(padX, px + 130, a), y = lerp(padY, my + 120, a); c.fillStyle = C.muted; c.fillRect(x - 13, y - 7, 26, 14); kit.label(c, 'ADP', x, y, { align: 'center', size: 10.5, color: '#000', weight: 600 }); }
        if (p >= 0.2 && p < 0.9) {
          const a = within(p, 0.74, 0.9), x = lerp(px + 26, px - 90, a), y = lerp(my + 34, my + 120, a);
          kit.dot(c, x, y, 7, C.bad); kit.label(c, 'P', x, y, { align: 'center', size: 10, color: '#fff', weight: 700 });
        }
        if (V.ouabain) { kit.dot(c, px, my - 52, 8, C.muted); kit.label(c, 'ouabain', px + 12, my - 52, { align: 'left', size: 11, color: C.muted }); }
        // stage text and tallies
        const tx = W * 0.66;
        const dG = 3 * (RT37 * Math.log(NAO / nai) - F_kJ * vm / 1000) + 2 * (RT37 * Math.log(ki / V.Ko) + F_kJ * vm / 1000);
        textBlock(kit, c, tx, 20, W - tx - 8, [
          { t: V.ouabain ? 'Blocked: ouabain holds the pump in E2-P' : !V.atp ? 'Stuck in E1, waiting for ATP' : stage[2], size: 12.5, weight: 600, color: V.ouabain || !V.atp ? C.bad : C.text },
          V.ouabain || !V.atp || !stage[3] ? null : { t: stage[3], color: C.text },
          { t: 'cycles shown: ' + cycles, color: C.muted, gap: 0 },
          { t: 'Na⁺ out: ' + 3 * cycles + ' · K⁺ in: ' + 2 * cycles, color: C.muted, gap: 0 },
          { t: 'ATP used: ' + cycles + ' · net charge out: +' + cycles, color: C.muted, gap: 10 },
          { t: 'Membrane potential ' + mV(vm), size: 12.5, weight: 600, color: C.text },
          { t: 'moving the ions costs ' + dG.toFixed(0) + ' kJ per mole of cycles; ATP supplies about 50–60 kJ/mol', color: C.muted }
        ]);
        ro.set('stage', V.ouabain ? 'blocked (ouabain)' : !V.atp ? 'stopped: no ATP' : 'running (about 100 cycles per second in reality)');
        ro.set('count', cycles + ' (3 Na⁺ out, 2 K⁺ in each)');
        ro.set('nai', nai.toFixed(1) + ' mM (outside 145)');
        ro.set('ki', ki.toFixed(0) + ' mM (outside ' + kit.fmt(V.Ko, 2) + ')');
        ro.set('vm', mV(vm) + ' (inside)');
        ro.set('rate', Math.round(100 * jp) + ' % of resting');
        ro.set('dg', dG.toFixed(1) + ' kJ/mol');
        plot.set({ series: [{ pts: hist.map(q => [q[0], q[1]]), label: 'Na⁺ inside', color: colNa }, { pts: hist.map(q => [q[0], q[2]]), label: 'K⁺ inside', color: colK }], x: { label: 'cell time (min)', min: 0, max: Math.max(10, tmin) } });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ THE ENDOMEMBRANE SYSTEM */
  Hyper.sim('cell-endomembrane', {
    title: 'The secretory pathway and endocytosis',
    blurb: `A secretory cell in cross-section. Proteins are made on the rough ER around the nucleus, carried in vesicles to the cis face of the Golgi, pass through its stack in about a quarter of an hour, and leave from the trans face: secretory proteins in vesicles and granules that fuse with the plasma membrane, lysosomal enzymes (tagged with mannose-6-phosphate, green) in vesicles to the lysosomes. A **pulse of label** marks a batch of new protein (magenta) — George Palade's pulse-chase experiment — and the graph follows where it is.

With **endocytosis** switched on, LDL particles (yellow) bind receptors on the lower-left surface, are gathered into clathrin-coated pits, and bud into vesicles that fuse with an endosome; the LDL goes on to a lysosome to be digested while the receptors return to the surface to be used again.

**Try this**
- Press *Pulse of label* and watch the magenta proteins: rough ER at first, the Golgi after 10–20 minutes, then secretory granules. The graph reproduces Palade's curves.
- In a regulated cell the granules wait: press *Signal: Ca²⁺ rise* and they fuse all at once. Switch to constitutive secretion: they leave as soon as they are made.
- Switch on endocytosis: count how many times a receptor goes round. Set LDL to zero — the pits still form and the receptors still cycle, but nothing is delivered.
- Raise the rate of coated pits: fewer receptors are at the surface at any moment, and each has less time to catch an LDL particle before it is taken in — uptake is limited by both steps.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 270 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'speed', label: 'Cell time: minutes per second', min: 1, max: 20, step: 1, value: 5 },
        { id: 'secmode', type: 'select', label: 'Secretion', options: [['Regulated: stored until a signal', 'reg'], ['Constitutive: released at once', 'con']], value: 'reg' },
        { id: 'synth', type: 'check', label: 'Unlabelled protein made all the time', value: true },
        { id: 'endo', type: 'check', label: 'Receptor-mediated endocytosis', value: !!(params && params.endo) },
        { id: 'pits', label: 'Coated pits per minute', min: 0.5, max: 6, step: 0.5, value: 2 },
        { id: 'ldl', label: 'LDL outside (relative)', min: 0, max: 2, step: 0.1, value: 1 },
        { type: 'buttons', items: [{ id: 'pulse', label: 'Pulse of label', primary: true }, { id: 'signal', label: 'Signal: Ca²⁺ rise' }, { id: 'restart', label: 'Restart' }] }
      ], (id) => {
        if (id === 'pulse') pulse();
        else if (id === 'signal') signal = true;
        else if (id === 'restart') restart();
        else if (id === 'endo') modes();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Minutes since the pulse'], ['where', 'Labelled protein'], ['mem', 'Vesicles per minute: out / in'], ['rec', 'Receptors at the surface'], ['ldlr', 'LDL taken in / digested']]);
      const plot = kit.plot(gb, { x: { label: 'minutes since the pulse', min: 0 }, y: { label: '% of the labelled protein', min: 0, max: 100 }, legend: true }, 170);
      function modes() { const e = !!V.endo; ctl.show('pits', e); ctl.show('ldl', e); ro.show('rec', e); ro.show('ldlr', e); }
      modes();
      // ---- the cell's geometry, in a 600 × 340 world
      const W0 = 600, H0 = 340, CX = 300, CY = 170, RX = 282, RY = 150, NUC = [128, 170, 50];
      const pm = (th, f) => [CX + RX * (f || 1) * Math.cos(th), CY + RY * (f || 1) * Math.sin(th)];
      const golgiX = (kf, y) => 318 + 12 * kf + 22 * Math.pow((y - 170) / 48, 2);
      const LYS = [[262, 272, 14], [440, 262, 12]], ENDO = [205, 238, 13];
      let R, prots, recs, pits, ldls, T, pulseT, signal, hist, lastRec, counts, events;

      const go = (p, s, x1, y1, dur) => { p.st = s; p.x0 = p.x; p.y0 = p.y; p.x1 = x1; p.y1 = y1; p.dur = dur; p.t = 0; };
      const move = (p, h) => { p.t += h; const f = Math.min(1, p.t / p.dur), e = f * f * (3 - 2 * f), bow = Math.sin(Math.PI * f) * 10; const dx = p.x1 - p.x0, dy = p.y1 - p.y0, L = Math.hypot(dx, dy) || 1; p.x = lerp(p.x0, p.x1, e) - dy / L * bow; p.y = lerp(p.y0, p.y1, e) + dx / L * bow; return f >= 1; };
      const erSpot = () => { const a = (R() - 0.5) * 2.3, r = 68 + 32 * R(); return [NUC[0] + r * Math.cos(a), NUC[1] + r * Math.sin(a)]; };
      function newProtein(hot) {
        const [x, y] = erSpot();
        prots.push({ kind: R() < 0.2 ? 'lys' : 'sec', hot, st: 'ER', t: 0, wait: 2 + -Math.log(Math.max(1e-6, R())) * 6, x, y, gy: 128 + 84 * R(), th: (R() - 0.5) * 1.5, age: 0, r: R() });
      }
      function update(h) {
        if (V.synth && R() < 0.5 * h) newProtein(false);
        for (const p of prots) {
          if (p.st === 'ER') { p.t += h; if (p.t > p.wait) go(p, 'toG', golgiX(0, p.gy), p.gy, 3); }
          else if (p.st === 'toG') { if (move(p, h)) { p.st = 'G'; p.prog = 0; } }
          else if (p.st === 'G') {
            p.prog += h / 15 * (0.8 + 0.4 * p.r); p.x = golgiX(4 * Math.min(1, p.prog), p.gy); p.y = p.gy;
            if (p.prog >= 1) {
              if (p.kind === 'lys') { p.tag = true; const L = LYS[p.r < 0.5 ? 0 : 1], a = R() * TAU, rr = L[2] * 0.5 * R(); go(p, 'toLys', L[0] + rr * Math.cos(a), L[1] + rr * Math.sin(a), 5); }
              else if (V.secmode === 'reg') { const q = pm(p.th, 0.84); go(p, 'toGran', q[0], q[1], 5); }
              else { const q = pm(p.th, 1); go(p, 'toPM', q[0], q[1], 6); }
            }
          }
          else if (p.st === 'toGran') { if (move(p, h)) { p.st = 'gran'; p.t = 0; } }
          else if (p.st === 'gran') {                                   // stored until a signal, with a slow basal release
            if (signal || V.secmode === 'con' || R() < 0.01 * h) { const q = pm(p.th, 1); go(p, 'toPM', q[0], q[1], signal ? 0.6 + 0.4 * R() : 1); }
          }
          else if (p.st === 'toPM') { if (move(p, h)) { p.st = 'out'; p.age = 0; events.out++; } }
          else if (p.st === 'out') { p.age += h; p.x += Math.cos(p.th) * 3 * h; p.y += Math.sin(p.th) * 3 * h; }
          else if (p.st === 'toLys') { if (move(p, h)) p.st = 'lys'; }
          else if (p.st === 'lys') { p.age += h; }
        }
        signal = false;
        for (const p of prots) if (p.st === 'out' && p.age > 12) { p.gone = true; if (p.hot) counts.secreted++; }
        for (const p of prots) if (p.st === 'lys' && !p.hot && p.age > 40) p.gone = true;
        prots = prots.filter(p => !p.gone);
        if (!V.endo) return;
        // ---- receptor-mediated endocytosis
        for (const r of recs) if (r.st === 'surf' && !r.ldl && R() < 0.5 * V.ldl * h) { const q = pm(r.th, 1.13); ldls.push({ st: 'in', x: q[0], y: q[1], rec: r }); go(ldls[ldls.length - 1], 'in', pm(r.th, 1.02)[0], pm(r.th, 1.02)[1], 0.6); r.ldl = 'coming'; }
        if (R() < V.pits * h) {
          const th = 1.4 + 1.1 * R(), pit = { th, t: 0, recs: [] };
          for (const r of recs) if (r.st === 'surf' && Math.abs(r.th - th) < 0.06 && r.ldl !== 'coming') { r.st = 'pit'; r.th0 = r.th; r.pit = pit; r.start = T; pit.recs.push(r); }
          pits.push(pit); events.inn++;
        }
        for (const pit of pits) {
          pit.t += h;
          for (const r of pit.recs) r.th = lerp(r.th0, pit.th + (pit.recs.indexOf(r) - (pit.recs.length - 1) / 2) * 0.012, Math.min(1, pit.t / 0.5));
          if (pit.t >= 1 && !pit.ves) { const q = pm(pit.th, 0.95); pit.ves = { x: q[0], y: q[1] }; go(pit.ves, 'ves', ENDO[0], ENDO[1], 1.5); for (const r of pit.recs) r.st = 'ves'; }
          if (pit.ves && move(pit.ves, h)) {
            pit.done = true;
            for (const r of pit.recs) {
              r.st = 'endo'; r.t = 0; r.x = ENDO[0] + (R() - 0.5) * 12; r.y = ENDO[1] + (R() - 0.5) * 12;
              if (r.ldl === true) { ldls.push({ st: 'endoL', t: 0, x: r.x, y: r.y }); counts.taken++; }
              r.ldl = false;
            }
          }
        }
        pits = pits.filter(p => !p.done);
        for (const r of recs) {
          if (r.st === 'endo') { r.t += h; if (r.t > 2.5) { const th = 1.4 + 1.1 * R(), q = pm(th, 1); r.thNext = th; go(r, 'back', q[0], q[1], 2.5); } }
          else if (r.st === 'back') { if (move(r, h)) { r.st = 'surf'; r.th = r.thNext; counts.trips++; counts.tripTime += T - r.start; } }
        }
        for (const l of ldls) {
          if (l.st === 'in') { if (move(l, h)) { l.gone = true; if (l.rec.st === 'surf') l.rec.ldl = true; else l.rec.ldl = false; } }
          else if (l.st === 'endoL') { l.t += h; if (l.t > 2) { const L = LYS[0]; go(l, 'toLysL', L[0] + (R() - 0.5) * 10, L[1] + (R() - 0.5) * 10, 3); } }
          else if (l.st === 'toLysL') { if (move(l, h)) { l.st = 'lysL'; l.age = 0; } }
          else if (l.st === 'lysL') { l.age += h; if (l.age > 4) { l.gone = true; counts.digested++; } }
        }
        ldls = ldls.filter(l => !l.gone);
      }
      function pulse() {
        for (const p of prots) p.hot = false;
        for (let k = 0; k < 30; k++) newProtein(true);
        pulseT = T; hist = []; lastRec = -1; counts.secreted = 0;
      }
      function restart() {
        R = kit.bio.rng(17); prots = []; pits = []; ldls = []; T = 0; signal = false; hist = []; lastRec = -1;
        counts = { secreted: 0, taken: 0, digested: 0, trips: 0, tripTime: 0 }; events = { out: 0, inn: 0 };
        recs = []; for (let k = 0; k < 20; k++) recs.push({ st: 'surf', th: 1.4 + 1.1 * k / 19, ldl: false });
        const endo0 = V.endo; V.endo = true;
        for (let k = 0; k < 1200; k++) { update(0.1); T += 0.1; }       // two hours of warm-up, then the clock restarts
        V.endo = endo0;
        for (const r of recs) if (r.start != null) r.start -= T;
        counts = { secreted: 0, taken: ldls.filter(l => l.st !== 'in').length, digested: 0, trips: 0, tripTime: 0 }; events = { out: 0, inn: 0 };
        T = 0; pulse();
      }
      restart();
      let rateOut = 0, rateIn = 0, evT = 0;

      const loop = kit.loop((dt) => {
        const dm = dt * V.speed, subs = Math.max(1, Math.ceil(dm / 0.1)), h = dm / subs;
        for (let k = 0; k < subs; k++) { update(h); T += h; }
        evT += dm;
        if (evT > 2) { rateOut += (events.out / evT - rateOut) * 0.5; rateIn += (events.inn / evT - rateIn) * 0.5; events.out = 0; events.inn = 0; evT = 0; }
        // ---- where the label is
        const hot = prots.filter(p => p.hot), n = 30;
        const cat = { er: 0, golgi: 0, gran: 0, lys: 0 };
        for (const p of hot) { if (p.st === 'ER') cat.er++; else if (p.st === 'toG' || p.st === 'G') cat.golgi++; else if (p.st === 'toLys' || p.st === 'lys') cat.lys++; else if (p.st !== 'out') cat.gran++; }
        const secr = n - cat.er - cat.golgi - cat.gran - cat.lys, since = T - pulseT;
        if (since - lastRec >= 0.5 && since <= 240) { hist.push([since, 100 * cat.er / n, 100 * cat.golgi / n, 100 * cat.gran / n, 100 * secr / n, 100 * cat.lys / n]); lastRec = since; }
        ro.set('t', kit.fmt(since, 3) + ' min');
        ro.set('where', 'ER ' + cat.er + ' · Golgi ' + cat.golgi + ' · granules ' + cat.gran + ' · out ' + secr + ' · lysosomes ' + cat.lys);
        ro.set('mem', kit.fmt(rateOut, 2) + ' fuse / ' + kit.fmt(rateIn, 2) + ' bud');
        const surf = recs.filter(r => r.st === 'surf').length;
        ro.set('rec', surf + ' of ' + recs.length + (counts.trips ? ' — a round trip takes about ' + kit.fmt(counts.tripTime / counts.trips, 2) + ' min' : ''));
        ro.set('ldlr', counts.taken + ' / ' + counts.digested);
        const C = kit.colors();
        if (V.endo) {
          if (!hist.endo) hist.endo = [];
          if (!hist.endoLast || T - hist.endoLast >= 0.5) { hist.endo.push([T, surf, recs.filter(r => r.st === 'surf' && r.ldl === true).length, ldls.filter(l => l.st !== 'in').length, counts.digested]); hist.endoLast = T; if (hist.endo.length > 400) hist.endo.shift(); }
          const E = hist.endo;
          plot.set({ series: [{ pts: E.map(q => [q[0], q[1]]), label: 'receptors at the surface', color: C.series[6] }, { pts: E.map(q => [q[0], q[2]]), label: 'LDL bound at the surface', color: C.series[4] }, { pts: E.map(q => [q[0], q[3]]), label: 'LDL inside', color: C.series[1] }, { pts: E.map(q => [q[0], q[4]]), label: 'LDL digested (total)', color: C.muted, dash: [4, 4] }],
            x: { label: 'cell time (min)', min: E.length ? E[0][0] : 0, max: Math.max(T, (E.length ? E[0][0] : 0) + 10) }, y: { label: 'number', min: 0, max: Math.max(20, counts.digested + 2) } });
        } else {
          const col = [kit.hue(200), kit.hue(45), kit.hue(320), C.ok, kit.hue(0)], names = ['rough ER', 'Golgi', 'secretory vesicles and granules', 'secreted', 'lysosomes'];
          plot.set({ series: names.map((nm, i) => ({ pts: hist.map(q => [q[0], q[i + 1]]), label: nm, color: col[i] })), x: { label: 'minutes since the pulse', min: 0, max: Math.max(60, since) }, y: { label: '% of the labelled protein', min: 0, max: 100 } });
        }
        // ---- drawing
        const c = st.begin(), k = Math.min(st.W / W0, st.H / H0), ox = (st.W - W0 * k) / 2, oy = (st.H - H0 * k) / 2;
        c.save(); c.translate(ox, oy); c.scale(k, k);
        c.beginPath(); c.ellipse(CX, CY, RX, RY, 0, 0, TAU); c.fillStyle = kit.hue(200, 0.05); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2.5; c.stroke();
        // nucleus and envelope
        c.beginPath(); c.arc(NUC[0], NUC[1], NUC[2], 0, TAU); c.fillStyle = kit.hue(265, 0.12); c.fill();
        c.strokeStyle = kit.hue(265, 0.8); c.lineWidth = 1.5; c.setLineDash([16, 4]); c.stroke(); c.beginPath(); c.arc(NUC[0], NUC[1], NUC[2] + 5, 0, TAU); c.stroke(); c.setLineDash([]);
        c.beginPath(); c.arc(NUC[0] - 12, NUC[1] - 8, 13, 0, TAU); c.fillStyle = kit.hue(265, 0.35); c.fill();
        // rough ER: sheets around the nucleus, studded with ribosomes
        c.strokeStyle = kit.hue(200, 0.75); c.lineWidth = 2;
        for (const r of [68, 79, 90, 101]) {
          c.beginPath(); c.arc(NUC[0], NUC[1], r, -1.25, 1.25); c.stroke();
          for (let a = -1.2; a < 1.2; a += 0.09) kit.dot(c, NUC[0] + (r + 2.5) * Math.cos(a), NUC[1] + (r + 2.5) * Math.sin(a), 1.3, C.muted);
        }
        // Golgi stack
        c.strokeStyle = kit.hue(45, 0.9); c.lineWidth = 5; c.lineCap = 'round';
        for (let g = 0; g <= 4; g++) { c.beginPath(); for (let y = 124; y <= 216; y += 4) { const x = golgiX(g, y); y === 124 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); }
        c.lineCap = 'butt';
        // lysosomes and the endosome
        for (const L of LYS) { c.beginPath(); c.arc(L[0], L[1], L[2], 0, TAU); c.fillStyle = kit.hue(0, 0.22); c.fill(); c.strokeStyle = kit.hue(0, 0.8); c.lineWidth = 1.5; c.stroke(); }
        if (V.endo) { c.beginPath(); c.arc(ENDO[0], ENDO[1], ENDO[2], 0, TAU); c.fillStyle = kit.hue(160, 0.2); c.fill(); c.strokeStyle = kit.hue(160, 0.8); c.lineWidth = 1.5; c.stroke(); }
        // proteins, in vesicles when travelling
        for (const p of prots) {
          const colr = p.hot ? kit.hue(320) : C.faint, moving = p.st === 'toG' || p.st === 'toGran' || p.st === 'toPM' || p.st === 'toLys';
          if (p.st === 'out') { const a = Math.max(0, 1 - p.age / 12); c.globalAlpha = a; kit.dot(c, p.x, p.y, p.hot ? 3.2 : 2.2, colr); c.globalAlpha = 1; continue; }
          if (moving || p.st === 'gran') { c.beginPath(); c.arc(p.x, p.y, p.st === 'gran' ? 7 : 5.5, 0, TAU); c.strokeStyle = p.st === 'gran' ? kit.hue(320, 0.6) : C.muted; c.lineWidth = 1.2; c.stroke(); if (p.st === 'gran') { c.fillStyle = kit.hue(320, 0.12); c.fill(); } }
          kit.dot(c, p.x, p.y, p.hot ? 3.2 : 2.2, colr);
          if (p.tag) kit.dot(c, p.x + 3, p.y - 3, 1.6, C.ok);
        }
        if (V.endo) {
          for (const pit of pits) {
            if (!pit.ves) { const q = pm(pit.th, 1 - 0.05 * Math.min(1, pit.t / 0.8)); c.beginPath(); c.arc(q[0], q[1], 8, 0, TAU); c.strokeStyle = C.text; c.setLineDash([2, 2]); c.lineWidth = 2; c.stroke(); c.setLineDash([]); }
            else { c.beginPath(); c.arc(pit.ves.x, pit.ves.y, 8, 0, TAU); c.strokeStyle = pit.ves.t < 0.6 ? C.text : C.muted; c.setLineDash(pit.ves.t < 0.6 ? [2, 2] : []); c.lineWidth = 1.5; c.stroke(); c.setLineDash([]); }
          }
          for (const r of recs) {
            let x, y;
            if (r.st === 'surf' || r.st === 'pit') { const q = pm(r.th, 1); x = q[0]; y = q[1]; }
            else if (r.st === 'ves') { const pit = r.pit; x = pit.ves ? pit.ves.x : 0; y = pit.ves ? pit.ves.y : 0; }
            else { x = r.x; y = r.y; }
            const a = Math.atan2(y - CY, x - CX);
            c.strokeStyle = kit.hue(190); c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 6 * Math.cos(a), y + 6 * Math.sin(a)); c.stroke();
            if (r.ldl === true) kit.dot(c, x + 8 * Math.cos(a), y + 8 * Math.sin(a), 3.2, kit.hue(52));
          }
          for (const l of ldls) { const a = l.st === 'lysL' ? Math.max(0, 1 - l.age / 4) : 1; c.globalAlpha = a; kit.dot(c, l.x, l.y, 3.2, kit.hue(52)); c.globalAlpha = 1; }
        }
        // labels
        const lab = (t, x, y, al) => kit.label(c, t, x, y, { align: al || 'center', size: 11, color: C.muted });
        lab('nucleus', NUC[0], NUC[1] + 30); lab('rough ER', NUC[0] + 88, NUC[1] - 104); lab('Golgi', 350, 110); lab('cis', 310, 228); lab('trans', 380, 228);
        lab('lysosomes', LYS[1][0] + 18, LYS[1][1] + 22); if (V.endo) lab('endosome', ENDO[0] - 4, ENDO[1] + 24); lab(V.secmode === 'reg' ? 'secretory granules' : 'secretory vesicles', 520, 108);
        c.restore();
        kit.label(c, 'cell time ' + kit.fmt(since, 3) + ' min after the pulse', 8, 12, { align: 'left', size: 11.5, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ KINESIN */
  const KIN = { kcat: 100, Km: 50, step: 8, Fs: 7, kT: 4.28 };          // 1/s, µM, nm, pN, pN·nm (37 °C)

  Hyper.sim('cell-kinesin', {
    title: 'Kinesin walking along a microtubule',
    blurb: `A single kinesin carries a vesicle along a microtubule, towards its plus end. Its two heads take turns: the rear head swings past the front one and lands 16 nm ahead, so the cargo advances 8 nm — one tubulin dimer — for every ATP split. Steps come at random moments; the stepping rate follows Michaelis–Menten kinetics in ATP (k_cat ≈ 100 per second, K_m ≈ 50 µM) and falls as an optical trap pulls back on the cargo, until at about 7 pN the motor stalls and steps back as often as forward. After about a hundred steps it usually lets go.

**Try this**
- At 1 mM ATP and no load, read the speed: about 0.8 µm/s. The graph shows the staircase of 8 nm steps.
- Lower ATP to 50 µM (K_m): the speed halves. At 5 µM the motor waits long between steps, but each step is still 8 nm.
- Pull with 4 pN, then 6, then 7.5: the motor slows, takes some backward steps, and falls off sooner.
- Compare with the diffusion of a vesicle: to go 1 µm it needs about a second on a motor; diffusion covers the first micrometre in about a second too, but a centimetre in a day and a metre in thousands of years.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'atp', label: 'ATP concentration', min: 1, max: 5000, value: 1000, log: true, sig: 2, unit: 'µM' },
        { id: 'load', label: 'Load on the cargo (optical trap)', min: 0, max: 8, step: 0.25, value: 0, unit: 'pN' },
        { id: 'slow', label: 'Slow motion (times slower than real)', min: 1, max: 100, value: 25, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'restart', label: 'New motor', primary: true }] }
      ], (id) => { if (id === 'restart') restart(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rate', 'Stepping rate (theory)'], ['v', 'Speed: this run / theory'], ['steps', 'Steps forward / back'], ['atp', 'ATP used'], ['run', 'Run length: this run / average']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'position of the cargo (nm)' } }, 170);
      const R = B.rng(5);
      let n, tReal, nextStep, fwd, back, atpUsed, runStart, runT0, runs, attached, offT, swing, lastDir, hist, camX;
      const rates = () => {
        const F = V.load, k = B.mm(V.atp, KIN.kcat, KIN.Km) / (1 + Math.exp((F - 5.5) / 1.1));
        const pf = 1 / (1 + Math.exp(-(KIN.Fs - F) * KIN.step / KIN.kT));
        return { k, pf, v: k * (2 * pf - 1) * KIN.step, det: 0.01 * Math.exp(F / 3) };
      };
      const wait = k => -Math.log(Math.max(1e-9, R())) / Math.max(1e-6, k);
      function land() { attached = true; runStart = n; runT0 = tReal; nextStep = tReal + wait(rates().k); swing = 1; }
      function restart() { n = 0; tReal = 0; fwd = 0; back = 0; atpUsed = 0; runs = []; hist = [[0, 0]]; camX = 0; lastDir = 1; land(); }
      restart();

      const loop = kit.loop((dt) => {
        const r = rates(), tEnd = tReal + dt / V.slow;
        while (attached && nextStep <= tEnd) {
          tReal = nextStep;
          hist.push([tReal, n * KIN.step]);
          const dir = R() < r.pf ? 1 : -1;
          n += dir; dir > 0 ? fwd++ : back++; atpUsed++; lastDir = dir; swing = 0;
          hist.push([tReal, n * KIN.step]);
          if (R() < r.det) { attached = false; offT = 0; runs.push((n - runStart) * KIN.step); break; }
          nextStep = tReal + wait(r.k);
        }
        tReal = tEnd;
        if (!attached) { offT += dt; if (offT > 1.2) land(); }
        swing = Math.min(1, swing + dt * 7);
        if (hist.length > 1500) hist = hist.slice(-1000);
        // ---- read-outs
        const runLen = (n - runStart) * KIN.step, runTime = tReal - runT0, mean = runs.length ? runs.reduce((a, b) => a + b, 0) / runs.length : 0;
        ro.set('rate', kit.fmt(r.k, 3) + ' steps per second');
        ro.set('v', (runTime > 0.05 && attached ? kit.fmt(runLen / runTime / 1000, 2) : '—') + ' / ' + kit.fmt(r.v / 1000, 2) + ' µm/s');
        ro.set('steps', fwd + ' / ' + back);
        ro.set('atp', atpUsed + ' (one per step)');
        ro.set('run', kit.fmt(runLen, 3) + ' nm / ' + (runs.length ? kit.fmt(mean, 3) + ' nm over ' + runs.length + ' runs' : 'no run finished yet'));
        const t0 = Math.max(0, tReal - 1.5);
        plot.set({ series: [{ pts: hist.filter(q => q[0] >= t0).concat([[tReal, n * KIN.step]]), color: kit.colors().accent }], x: { label: 'time (s, real)', min: t0, max: Math.max(t0 + 0.2, tReal) } });
        // ---- drawing: 1 nm = kpx pixels, the camera follows the motor
        const c = st.begin(), C = kit.colors(), kpx = Math.max(1.6, Math.min(3, st.W / 300)), my = st.H - 38, mtH = 25 * kpx;
        const centre = n * KIN.step;
        camX += (centre - camX) * Math.min(1, dt * 3);
        const X = nm => st.W / 2 + (nm - camX) * kpx;
        // microtubule: protofilaments with α/β dimers, 8 nm each
        c.fillStyle = C.dark ? 'hsl(200 25% 22%)' : 'hsl(200 30% 88%)'; c.fillRect(0, my, st.W, mtH);
        const first = Math.floor((camX - st.W / 2 / kpx) / 8) - 1, last = first + Math.ceil(st.W / kpx / 8) + 3;
        for (let d = first; d <= last; d++) {
          const x = X(d * 8);
          for (let pf = 0; pf < 5; pf++) {
            const y = my + 2 + pf * (mtH - 4) / 5, hh = (mtH - 4) / 5 - 1.5;
            c.fillStyle = kit.hue(200, 0.35 + (pf % 2) * 0.1); c.fillRect(x + 0.5, y, 4 * kpx - 1, hh);
            c.fillStyle = kit.hue(200, 0.6 + (pf % 2) * 0.1); c.fillRect(x + 4 * kpx + 0.5, y, 4 * kpx - 1, hh);
          }
        }
        kit.label(c, '− end', 8, my + mtH + 12, { align: 'left', size: 11, color: C.muted });
        kit.label(c, '+ end →', st.W - 8, my + mtH + 12, { align: 'right', size: 11, color: C.muted });
        // motor: heads on neighbouring β-tubulins, 8 nm apart; the rear head swings 16 nm forward
        const detachLift = attached ? 0 : Math.min(1, offT / 1.2) * 60;
        const back0 = centre - 4 * lastDir, front = centre + 4 * lastDir, e = swing * swing * (3 - 2 * swing);
        const movingX = lerp(centre - 12 * lastDir, front, e), arcY = Math.sin(Math.PI * e) * 9;   // from 16 nm behind its landing site
        const hy = my - 3 * kpx - detachLift * kpx;
        const head = (x, lift, colr) => { c.beginPath(); c.ellipse(X(x), hy - lift * kpx, 4.2 * kpx, 2.8 * kpx, 0, 0, TAU); c.fillStyle = colr; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1; c.stroke(); };
        const neckX = X(centre), neckY = hy - 12 * kpx, cargoY = neckY - 55 * kpx, cargoR = 18 * kpx;
        c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(X(back0), hy); c.lineTo(neckX, neckY); c.moveTo(X(movingX), hy - arcY * kpx); c.lineTo(neckX, neckY); c.stroke();
        head(back0, 0, kit.hue(30, 0.9));
        head(movingX, arcY, kit.hue(30, 0.9));
        c.strokeStyle = kit.hue(30); c.lineWidth = 2.5; c.beginPath(); c.moveTo(neckX, neckY);
        for (let s = 1; s <= 12; s++) c.lineTo(neckX + Math.sin(s * 1.3) * 2, neckY - s * (neckY - cargoY - cargoR) / 12);
        c.stroke();
        c.beginPath(); c.arc(neckX, cargoY, cargoR, 0, TAU); c.fillStyle = kit.hue(140, 0.25); c.fill(); c.strokeStyle = kit.hue(140, 0.9); c.lineWidth = 2; c.stroke();
        kit.label(c, 'vesicle', neckX, cargoY, { align: 'center', size: 11.5, color: C.text });
        if (V.load > 0) { kit.arrow(c, neckX - cargoR, cargoY, neckX - cargoR - V.load * 9, cargoY, C.bad, 2.5); kit.label(c, kit.fmt(V.load, 3) + ' pN', neckX - cargoR - V.load * 9 - 4, cargoY - 12, { align: 'right', size: 11.5, color: C.bad }); }
        kit.label(c, attached ? '8 nm per step, one ATP each' : 'let go after ' + kit.fmt(runs[runs.length - 1] || 0, 3) + ' nm — a new motor is landing', 8, 14, { align: 'left', size: 12, color: attached ? C.muted : C.warn });
        kit.label(c, 'shown ' + kit.fmt(V.slow, 2) + '× slower than real', st.W - 8, 14, { align: 'right', size: 11.5, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

})();
