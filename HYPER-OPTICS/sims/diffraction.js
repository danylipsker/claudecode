/* HYPER-OPTICS · sims/diffraction.js — simulations of the topic "Diffraction".
 *   df-spreading      light at a slit or a straight edge, from the near field to the far field (Fresnel integrals)
 *   df-single-slit    the far-field pattern of a single slit: dark lines, side lobes, the fringes on a screen
 *   df-airy           the Airy pattern of a round aperture against the pixels of a sensor
 *   df-resolution     two point sources imaged by an aperture: Rayleigh, Sparrow, Dawes
 *   df-grating        a grating fans white light into orders: the grating equation drawn with rays
 *   df-nslits         N slits: the principal peaks stay put and sharpen as N grows
 *   df-blaze          a blazed reflection grating: where the light goes, order by order and colour by colour
 *   df-spectrometer   resolving power: two spectral lines through a grating of N lit lines
 *   df-zones          Fresnel zones: a zone plate, a hole and a disc on the axis
 *   df-4f             a lens as a Fourier transformer: object, Fourier plane, filter, image
 *   df-hologram       recording and replaying a hologram of a point
 *   df-disc           the colours of a compact disc as a reflection grating
 *   df-spikes         diffraction spikes of polygon irises and spider vanes
 * Numbers come from kit.optics (Bessel and Fresnel functions, the diffraction formulas); drawing from kit.osym.
 * The only local numerics are two small FFTs (df-4f, df-spikes) and the scalar blaze efficiency (df-blaze).
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * Math.PI, D2R = PI / 180, R2D = 180 / PI, ARCSEC = 206264.806;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const sq = x => x * x;
  const fmt = (v, s) => Number.isFinite(v) ? String(+Number(v).toPrecision(s || 3)) : '—';
  const len = m => { const a = Math.abs(m); if (!Number.isFinite(m)) return '—'; return a < 1e-6 ? fmt(m * 1e9) + ' nm' : a < 1e-3 ? fmt(m * 1e6) + ' µm' : a < 1 ? fmt(m * 1e3) + ' mm' : fmt(m) + ' m'; };
  const angText = rad => { if (!Number.isFinite(rad)) return '—'; const a = Math.abs(rad) * R2D; return a >= 1 ? fmt(a) + '°' : a * 60 >= 1 ? fmt(a * 60) + '′' : fmt(a * 3600) + '″'; };
  const pct = x => (100 * x).toFixed(x < 0.1 ? 1 : 0) + ' %';
  // a picture of nx × ny cells painted through an image (one drawImage instead of a fillRect per cell):
  // f(i, j) -> brightness 0…1 or [r, g, b]; the pixels are rebuilt only when `key` changes
  const offs = {};
  function paint(c, id, x, y, w, h, nx, ny, f, o, key) {
    let e = offs[id];
    if (!e || e.nx !== nx || e.ny !== ny) { const cv = document.createElement('canvas'); cv.width = nx; cv.height = ny; const cx = cv.getContext('2d'); e = offs[id] = { cv, cx, img: cx.createImageData(nx, ny), nx, ny, key: null }; }
    if (key == null || e.key !== key) {
      const d = e.img.data, rgb = (o && o.rgb) || [255, 255, 255], g = o && o.gamma != null ? o.gamma : 1;
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const v = f(i, j), k = 4 * (j * nx + i);
        if (Array.isArray(v)) { d[k] = v[0]; d[k + 1] = v[1]; d[k + 2] = v[2]; }
        else { const b = Math.pow(clamp(v, 0, 1), g); d[k] = rgb[0] * b; d[k + 1] = rgb[1] * b; d[k + 2] = rgb[2] * b; }
        d[k + 3] = 255;
      }
      e.cx.putImageData(e.img, 0, 0); e.key = key;
    }
    c.save(); c.imageSmoothingEnabled = !!(o && o.smooth); c.drawImage(e.cv, x, y, w, h); c.restore();
  }

  /* ================================================================ light at a slit or an edge */
  Hyper.sim('df-spreading', {
    title: 'Light at a slit or an edge: near field to far field',
    blurb: `A plane wave meets a slit (or a razor's straight edge). The strip and the curve on the right show how bright the light is on a screen at distance *L*, relative to the undisturbed beam. The picture is schematic in the direction of the light (the distance is labelled, not drawn to scale) but exact across it.

**Try this**
- Press **Near field** (Fresnel number 20): the shadow is almost geometric, with fine ripples. Press **Far field**: the shadow is gone and the light has spread into the sinc² pattern of the single slit.
- Narrow the slit while watching the *far-field* pattern: it grows wider as the slit gets narrower.
- Change the colour: red spreads more than blue, because the angle is about λ/a.
- Switch to a **straight edge**: no matter how far away, the edge has its own pattern, a quarter of the full intensity at the edge and a 37 % overshoot inside the light.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Df = O.diff;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 320, maxH: 470 });
      const target = { near: 20, mid: 1, far: 0.03 };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Obstacle', options: [['A slit', 'slit'], ['A straight edge (razor blade)', 'edge']], value: params.mode || 'slit' },
        { id: 'a', label: 'Slit width', min: 0.05, max: 3, value: params.a || 0.5, log: true, sig: 2, unit: 'mm' },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: params.nm || 550, unit: 'nm' },
        { id: 'L', label: 'Distance to the screen', min: 0.02, max: 30, value: params.L || 1, log: true, sig: 2, unit: 'm' },
        { type: 'buttons', items: [{ id: 'near', label: 'Near field' }, { id: 'mid', label: 'N_F = 1' }, { id: 'far', label: 'Far field' }] }
      ], id => {
        if (target[id] != null) { const lam = V.nm * 1e-9, a = V.a * 1e-3 / 2; ctl.set('L', clamp(a * a / (target[id] * lam), 0.02, 30)); }
        if (id === 'mode') modes();
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['NF', 'Fresnel number a²/(λL)'], ['regime', 'Regime'], ['dark', 'First dark band (far field)'], ['rip', 'Ripple scale √(λL/2)'], ['e', 'At the geometric edge'], ['peak', 'Brightest point (undisturbed = 1)']]);
      function modes() {
        const e = V.mode === 'edge';
        ctl.show('a', !e); ['near', 'mid', 'far'].forEach(k => ctl.show(k, !e));
        ['NF', 'regime', 'dark'].forEach(k => ro.show(k, !e)); ['rip', 'e'].forEach(k => ro.show(k, e));
      }
      modes();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const lam = V.nm * 1e-9, L = V.L, edge = V.mode === 'edge', aw = V.a * 1e-3;
        const kk = Math.sqrt(2 / (lam * L)), s0 = Math.sqrt(lam * L / 2);
        const Y = edge ? 5 * s0 : 0.75 * aw + 3 * lam * L / aw;
        const prof = y => {
          if (edge) return Df.knifeEdge(y * kk);
          const p = O.fresnelCS((-aw / 2 - y) * kk), q = O.fresnelCS((aw / 2 - y) * kk);
          return 0.5 * (sq(q[0] - p[0]) + sq(q[1] - p[1]));
        };
        const n = 320, I = []; let Imax = 1e-12;
        for (let i = 0; i < n; i++) { const v = prof(Y * (1 - 2 * i / (n - 1))); I.push(v); if (v > Imax) Imax = v; }
        const bx = Math.round(W * 0.3), sx = Math.round(W * 0.6), cx0 = sx + 36, cw = W - cx0 - 14, cy = Hh / 2, sc = (Hh / 2 - 24) / Y;
        // the incoming plane wave
        for (let i = 0; i < 7; i++) { c.strokeStyle = S.nm(V.nm, 0.85 - 0.1 * i); c.lineWidth = 1.4; c.beginPath(); c.moveTo(bx - 10 - i * 15, 14); c.lineTo(bx - 10 - i * 15, Hh - 14); c.stroke(); }
        kit.label(c, 'plane wave', bx - 60, 8, { align: 'center', color: C.muted, size: 11.5 });
        // the barrier, and the edges of the geometric shadow
        const gp = Math.max(6, aw * sc), hh = Hh / 2 - 4;
        if (edge) S.slits(c, bx, cy, hh, [[cy - hh, cy]], { w: 5 }); else S.slits(c, bx, cy, hh, [[cy - gp / 2, cy + gp / 2]], { w: 5 });
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([5, 4]); c.beginPath();
        if (edge) { c.moveTo(bx, cy); c.lineTo(sx + 22, cy); } else { c.moveTo(bx, cy - gp / 2); c.lineTo(sx + 22, cy - gp / 2); c.moveTo(bx, cy + gp / 2); c.lineTo(sx + 22, cy + gp / 2); }
        c.stroke(); c.restore();
        kit.label(c, edge ? 'edge' : 'slit ' + len(aw), bx, Hh - 8, { align: 'center', color: C.text, size: 11.5, weight: 600 });
        // the screen as a strip, and the curve
        S.fringes(c, sx, cy - Y * sc, 22, 2 * Y * sc, u => prof(Y * (1 - 2 * u)) / Imax, { nm: V.nm, vertical: true, gamma: 0.7 });
        kit.label(c, 'screen', sx + 11, 8, { align: 'center', color: C.muted, size: 11.5 });
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(cx0, cy - Y * sc); c.lineTo(cx0, cy + Y * sc); c.stroke();
        if (Imax > 1.001) { const x1 = cx0 + cw / Imax; c.setLineDash([3, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(x1, cy - Y * sc); c.lineTo(x1, cy + Y * sc); c.stroke(); c.setLineDash([]); kit.label(c, 'undisturbed beam', x1, 8, { align: 'center', color: C.faint, size: 11 }); }
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        I.forEach((v, i) => { const x = cx0 + v / Imax * cw, y = cy - Y * (1 - 2 * i / (n - 1)) * sc; i ? c.lineTo(x, y) : c.moveTo(x, y); });
        c.stroke(); c.restore();
        kit.label(c, 'intensity' + (Imax < 0.95 ? ' (scaled to its peak)' : ''), cx0 + cw / 2, Hh - 8, { align: 'center', color: C.muted, size: 11.5 });
        S.dim(c, bx + 12, cy + gp / 2 + 26 > Hh - 22 ? Hh - 22 : cy + gp / 2 + 26, sx - 6, cy + gp / 2 + 26 > Hh - 22 ? Hh - 22 : cy + gp / 2 + 26, 'L = ' + len(L) + '  (not to scale)', { off: -9, size: 11.5 });
        // read-outs
        const NF = Df.fresnelNumber(aw / 2, L, V.nm);
        ro.set('NF', fmt(NF));
        ro.set('regime', NF > 3 ? 'near field (Fresnel): the shadow is nearly sharp' : NF > 0.3 ? 'in between: the pattern is changing shape' : 'far field (Fraunhofer): the pattern only scales');
        const r = lam / aw;
        ro.set('dark', r >= 1 ? 'none: slit narrower than λ' : angText(Math.asin(r)) + '  ·  ' + len(L * Math.tan(Math.asin(r))) + ' from the centre');
        ro.set('rip', len(s0));
        ro.set('e', '25 % at the edge; first peak 137 % at ' + len(1.2172 * s0) + ' inside');
        ro.set('peak', fmt(Imax));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the single slit, far field */
  Hyper.sim('df-single-slit', {
    title: 'The single slit: dark lines at a·sin θ = mλ',
    blurb: `Light of one colour passes a slit of width *a* and lands on a far screen. The strip is what you would see; the graph is its brightness against angle. The dashed rays and the vertical lines mark the dark lines at a sin θ = mλ.

**Try this**
- Halve the slit width: the whole pattern doubles in width. Narrower slit, wider pattern.
- Go to the narrowest slit (a few micrometres, comparable with the wavelength): the dark lines run off the edge of the picture and the light fills the half-space.
- Tick **log scale** to see the side lobes properly: 4.7 %, 1.6 % and 0.8 % of the central peak are almost invisible on a straight scale.
- Change the colour: the dark lines are at sin θ = mλ/a, so red lines lie farther from the centre than blue ones.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Df = O.diff;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190, maxH: 280 });
      const gb = document.createElement('div'); gb.style.padding = '0'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'Slit width a', min: 2, max: 300, value: params.a || 40, log: true, sig: 2, unit: 'µm' },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: params.nm || 550, unit: 'nm' },
        { id: 'L', label: 'Distance to the screen', min: 0.2, max: 5, step: 0.1, value: 1, unit: 'm' },
        { id: 'log', type: 'check', label: 'Log scale (shows the side lobes)', value: !!params.log }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r', 'Slit width a / wavelength λ'], ['th1', 'First dark line, sin θ = λ/a'], ['w', 'Central band on the screen'], ['sl', 'Side lobes, relative to the centre'], ['E', 'Light in the central band']]);
      const plot = kit.plot(gb, { x: { label: 'angle θ (°)' }, y: { label: 'I / I₀' } }, 190);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const lam = V.nm * 1e-9, a = V.a * 1e-6, r = lam / a;
        const thMax = Math.asin(Math.min(1, 4.35 * r)), x0 = 58, x1 = W - 16, cx = (x0 + x1) / 2;
        const yS = Hh - 58, hS = 30, gw = 4 + 10 * Math.log10(V.a / 2);
        const X = th => cx + th / thMax * (x1 - x0) / 2;
        // the beam, the slit and the dark directions
        c.fillStyle = S.nm(V.nm, 0.14); c.beginPath(); c.moveTo(cx - 14, 8); c.lineTo(cx + 14, 8); c.lineTo(cx + 14, 24); c.lineTo(cx + gw / 2, 24); c.lineTo(X(Math.asin(Math.min(1, r))), yS); c.lineTo(X(-Math.asin(Math.min(1, r))), yS); c.lineTo(cx - gw / 2, 24); c.lineTo(cx - 14, 24); c.closePath(); c.fill();
        c.fillStyle = C.text; c.fillRect(x0 - 10, 24, cx - gw / 2 - x0 + 10, 4); c.fillRect(cx + gw / 2, 24, x1 - cx - gw / 2 + 10, 4);
        kit.label(c, 'slit  a = ' + fmt(V.a) + ' µm', cx + 22, 14, { color: C.muted, size: 11.5 });
        for (let m = 1; m <= 4; m++) {
          if (m * r >= 1) break;
          const th = Math.asin(m * r);
          for (const sgn of [-1, 1]) { S.ray(c, [[cx, 26], [X(sgn * th), yS]], { color: C.faint, width: 1, dash: [4, 4], arrows: false }); }
          kit.label(c, '±' + m, X(th), yS - 7, { align: 'center', color: C.muted, size: 10.5 });
        }
        S.fringes(c, x0, yS, x1 - x0, hS, u => Df.singleSlit(a, V.nm, (2 * u - 1) * thMax), { nm: V.nm, gamma: 0.45 });
        kit.label(c, '−' + fmt(thMax * R2D, 2) + '°', x0, yS + hS + 11, { color: C.faint, size: 10.5 });
        kit.label(c, '0', cx, yS + hS + 11, { align: 'center', color: C.faint, size: 10.5 });
        kit.label(c, '+' + fmt(thMax * R2D, 2) + '°', x1, yS + hS + 11, { align: 'right', color: C.faint, size: 10.5 });
        // the graph
        const pts = [], n = 600;
        for (let i = 0; i <= n; i++) { const th = (2 * i / n - 1) * thMax, v = Df.singleSlit(a, V.nm, th); pts.push([th * R2D, V.log ? Math.max(1e-6, v) : v]); }
        const vl = []; for (let m = 1; m <= 4; m++) if (m * r < 1) { const th = Math.asin(m * r) * R2D; vl.push({ x: th, label: String(m) }, { x: -th }); }
        plot.set({ series: [{ pts, label: 'intensity' }], x: { label: 'angle θ (°)', min: -thMax * R2D, max: thMax * R2D }, y: V.log ? { label: 'I / I₀ (log)', log: true, min: 1e-4, max: 1.2 } : { label: 'I / I₀', min: 0, max: 1.05 }, vlines: vl });
        // read-outs
        ro.set('r', fmt(a / lam));
        ro.set('th1', r >= 1 ? 'none: a < λ, the light fills the half-space' : angText(Math.asin(r)));
        ro.set('w', r >= 1 ? 'the whole screen' : len(2 * V.L * Math.tan(Math.asin(r))));
        ro.set('sl', '4.7 %, 1.6 %, 0.8 %');
        let E = 0; const nn = 2000;
        for (let i = 0; i < nn; i++) { const b = (i + 0.5) / nn * PI; E += sq(Math.sin(b) / b) * PI / nn; }
        ro.set('E', fmt(100 * E / (PI / 2), 3) + ' %' + (r >= 1 ? ' (no dark line: a < λ)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the Airy pattern against pixels */
  Hyper.sim('df-airy', {
    title: 'The Airy disc against the pixels',
    blurb: `The image of a point made by a perfect lens: on the left as a sensor would record it, on the right brightened to show the faint rings. The grid is the pixels of a sensor, one of them centred on the point. The window is fixed at 24 µm across so that you see the disc grow as the lens is stopped down.

**Try this**
- Stop down from f/2 to f/16: the disc grows eightfold, from smaller than a pixel to a blob many pixels wide.
- Set the pixel pitch to 2 µm and find the f-number where the disc covers two pixels: below it the sensor limits the detail, above it the lens.
- In the graph tick **log scale**: the rings are the small peaks, 1.75 %, 0.42 %, 0.16 %. They are real, but almost invisible on a linear scale.
- Compare blue and red light: the disc is 44 % wider in red.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Df = O.diff, Mt = O.mtf;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250, maxH: 380 });
      const gb = document.createElement('div'); gb.style.padding = '0'; box.stage.appendChild(gb);
      const STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'f-number', min: 1.2, max: 22, value: params.N || 5.6, log: true, sig: 2, fmt: v => 'f/' + fmt(v, 2) },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: params.nm || 550, unit: 'nm' },
        { id: 'p', label: 'Pixel pitch', min: 0.5, max: 8, step: 0.1, value: params.p || 3, unit: 'µm' },
        { id: 'log', type: 'check', label: 'Log scale in the graph (shows the rings)', value: false },
        { type: 'buttons', items: STOPS.slice(1, 8).map(n => ({ id: 's' + n, label: String(n) })) }
      ], id => { if (/^s[\d.]+$/.test(id)) ctl.set('N', +id.slice(1)); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['d', 'Airy disc diameter 2.44 λN'], ['fw', 'Half-intensity width 1.03 λN'], ['k', 'Pixels across the disc'], ['e1', 'Light inside a pixel-sized circle'], ['cut', 'Lens cut-off 1/(λN)  ·  sensor Nyquist'], ['who', 'What limits the detail']]);
      const plot = kit.plot(gb, { x: { label: 'distance from the centre (µm)' }, y: { label: 'relative intensity' } }, 170);
      const WIN = 12;                                       // half-width of the window, µm
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const lam = V.nm * 1e-3, N = V.N, p = V.p, side = Math.min(Hh - 34, (W - 40) / 2), y0 = 18, xa = W / 2 - side - 8, xb = W / 2 + 8;
        const n = 84, I = r => Df.airy(PI * r / (lam * N)), rgb = O.colour.wavelength(V.nm), key = V.N + '|' + V.nm, at = (i, j) => I(Math.hypot((i + 0.5) / n - 0.5, (j + 0.5) / n - 0.5) * 2 * WIN);
        paint(c, 'airyA', xa, y0, side, side, n, n, at, { rgb, gamma: 1, smooth: true }, key);
        paint(c, 'airyB', xb, y0, side, side, n, n, at, { rgb, gamma: 0.3, smooth: true }, key);
        // the pixel grid on the left picture
        const s = side / (2 * WIN);
        c.save(); c.beginPath(); c.rect(xa, y0, side, side); c.clip(); c.strokeStyle = 'rgba(160,170,200,0.55)'; c.lineWidth = 1; c.beginPath();
        for (let k = -Math.ceil(WIN / p) - 1; k <= Math.ceil(WIN / p) + 1; k++) { const o = (k + 0.5) * p * s; c.moveTo(xa + side / 2 + o, y0); c.lineTo(xa + side / 2 + o, y0 + side); c.moveTo(xa, y0 + side / 2 + o); c.lineTo(xa + side, y0 + side / 2 + o); }
        c.stroke(); c.restore();
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(xa, y0, side, side); c.strokeRect(xb, y0, side, side);
        kit.label(c, 'as a sensor records it  (grid: pixels)', xa + side / 2, y0 + side + 12, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'brightened: the rings', xb + side / 2, y0 + side + 12, { align: 'center', color: C.muted, size: 11.5 });
        S.dim(c, xa + 2, y0 + side - 7, xa + 2 + 5 * s, y0 + side - 7, '5 µm', { off: -8, size: 10.5, color: '#fff', textColor: '#fff' });
        // the radial profile
        const pts = []; for (let i = 0; i <= 300; i++) { const r = WIN * i / 300, v = I(r); pts.push([r, V.log ? Math.max(1e-6, v) : v]); }
        const vl = []; for (const m of [1.21967, 2.2331, 3.2383]) if (m * lam * N < WIN) vl.push({ x: m * lam * N });
        plot.set({ series: [{ pts, label: 'intensity' }], x: { label: 'distance from the centre (µm)', min: 0, max: WIN }, y: V.log ? { label: 'I / I₀ (log)', log: true, min: 1e-4, max: 1.2 } : { label: 'I / I₀', min: 0, max: 1.05 }, vlines: vl });
        const dia = 2 * Df.airyRadius(V.nm, N) * 1e6;
        ro.set('d', fmt(dia) + ' µm');
        ro.set('fw', fmt(1.029 * lam * N) + ' µm');
        ro.set('k', fmt(dia / p) + ' pixels of ' + fmt(p) + ' µm');
        ro.set('e1', pct(Df.encircled(PI * (p / 2) / (lam * N))) + '  (the disc itself: 84 %)');
        ro.set('cut', fmt(Mt.cutoff(V.nm, N)) + ' lp/mm  ·  ' + fmt(Mt.nyquist(p)) + ' lp/mm');
        ro.set('who', dia < p ? 'the sensor: the disc is smaller than a pixel' : dia < 2 * p ? 'both: the disc spans one to two pixels' : 'the lens: diffraction blurs over ' + fmt(dia / p, 2) + ' pixels');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ resolution of two points */
  Hyper.sim('df-resolution', {
    title: 'Two stars through a circular aperture',
    blurb: `Two equal point sources, such as the stars of a double star, seen through a perfect telescope. Above is the picture, below the brightness along the line joining them. The two Airy patterns add as intensities (the stars are unrelated).

**Try this**
- Keep the separation at 1.4″ and step the aperture up from the **eye** to **100 mm**: the pair goes from one blob to two stars.
- Set the separation to exactly the Rayleigh limit (the readout says "1.00 × Rayleigh"): the dip between the peaks is 73.5 %, small but visible.
- Move to 0.78 × Rayleigh, the Sparrow separation: the dip has just vanished.
- Drag the right-hand star along the picture. Doubling the aperture halves every limit.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Df = O.diff;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 480 });
      const PRE = { eye: 3, bino: 50, t100: 100, t250: 250, hubble: 2400 };
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Aperture diameter', min: 2, max: 3000, value: params.D || 100, log: true, sig: 3, unit: 'mm' },
        { id: 'sep', label: 'Separation of the two stars', min: 0.02, max: 120, value: params.sep || 1.5, log: true, sig: 2, fmt: v => fmt(v, 2) + '″' },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: 550, unit: 'nm' },
        { type: 'buttons', items: [{ id: 'eye', label: 'Eye 3 mm' }, { id: 'bino', label: '50 mm' }, { id: 't100', label: '100 mm' }, { id: 't250', label: '250 mm' }, { id: 'hubble', label: '2.4 m' }] }
      ], id => { if (PRE[id]) ctl.set('D', PRE[id]); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['R', 'Rayleigh limit 1.22 λ/D'], ['S', 'Sparrow limit 0.947 λ/D'], ['Dw', 'Dawes limit 116/D'], ['x', 'Separation ÷ Rayleigh'], ['dip', 'Dip between the peaks'], ['v', 'What is seen']]);
      let geo = { cx: 0, scale: 1 }, frozen = 1;
      kit.drag(st, {
        hover: true,
        hit: p => Math.abs(p.x - (geo.cx + geo.half)) < 18 && p.y < geo.imgBottom ? 's2' : null,
        start: () => { frozen = geo.pxPerArc; },
        move: (w, p) => { ctl.set('sep', clamp(2 * Math.abs(p.x - geo.cx) / frozen, 0.02, 120)); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const Dm = V.D * 1e-3, thR = Df.rayleighAngle(V.nm, Dm), thRs = thR * ARCSEC, sepR = V.sep / thRs;
        const half = Math.max(6.5, sepR / 2 + 2), imgH = Hh * 0.42, x0 = 12, w = W - 24;
        const nx = 150, ny = Math.max(20, Math.round(nx * imgH / w)), pxPerR = w / (2 * half);
        const A = r => Df.airy(3.8317 * r);
        const sum = (x, y) => A(Math.hypot(x - sepR / 2, y)) + A(Math.hypot(x + sepR / 2, y));
        c.fillStyle = '#000'; c.fillRect(x0, 10, w, imgH);
        paint(c, 'res', x0, 10, w, imgH, nx, ny, (i, j) => sum(((i + 0.5) / nx - 0.5) * 2 * half, ((j + 0.5) / ny - 0.5) * 2 * half * imgH / w), { gamma: 0.55, smooth: true }, [V.D, V.sep, V.nm, w, imgH].join('|'));
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, 10, w, imgH);
        const cx = x0 + w / 2, cyI = 10 + imgH / 2;
        geo = { cx, half: sepR / 2 * pxPerR, pxPerArc: pxPerR / thRs, imgBottom: 10 + imgH };
        kit.dot(c, cx + geo.half, cyI, 3.5, C.accent); kit.dot(c, cx - geo.half, cyI, 3.5, C.faint);
        kit.label(c, 'drag', cx + geo.half + 8, cyI - 14, { color: C.accent, size: 10.5 });
        // the profile
        const py0 = 10 + imgH + 26, ph = Hh - py0 - 30;
        let pk = 0; const pts = [];
        for (let i = 0; i <= 300; i++) { const x = (i / 300 * 2 - 1) * half, v = sum(x, 0); pts.push([x, v]); if (v > pk) pk = v; }
        const mid = sum(0, 0), dip = mid / pk;
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, py0 + ph); c.lineTo(x0 + w, py0 + ph); c.stroke();
        c.setLineDash([4, 4]); c.strokeStyle = C.faint;
        for (const sg of [-1, 1]) { c.beginPath(); for (let i = 0; i <= 200; i++) { const x = (i / 200 * 2 - 1) * half, v = A(Math.abs(x - sg * sepR / 2)); const X = x0 + (x + half) / (2 * half) * w, Y = py0 + ph * (1 - v / pk); i ? c.lineTo(X, Y) : c.moveTo(X, Y); } c.stroke(); }
        c.setLineDash([]); c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        pts.forEach((q, i) => { const X = x0 + (q[0] + half) / (2 * half) * w, Y = py0 + ph * (1 - q[1] / pk); i ? c.lineTo(X, Y) : c.moveTo(X, Y); }); c.stroke(); c.restore();
        if (dip < 0.995) { const Xm = cx, Ym = py0 + ph * (1 - dip); c.strokeStyle = C.warn; c.lineWidth = 1.3; c.beginPath(); c.moveTo(Xm - 16, Ym); c.lineTo(Xm + 16, Ym); c.stroke(); kit.label(c, 'dip ' + (dip * 100).toFixed(0) + ' %', Xm + 22, Ym, { color: C.warn, size: 11.5 }); }
        // scale bar: one Rayleigh angle
        S.dim(c, x0 + 70, py0 + ph + 16, x0 + 70 + pxPerR, py0 + ph + 16, '1.22 λ/D = ' + fmt(thRs) + '″', { off: 0, size: 11 });
        kit.label(c, 'sum of the two patterns (solid) · each star alone (dashed)', x0 + w, py0 - 8, { align: 'right', color: C.muted, size: 11 });
        ro.set('R', fmt(thRs) + '″'); ro.set('S', fmt(thRs * 0.9472 / 1.21967) + '″'); ro.set('Dw', fmt(Df.dawes(Dm) * ARCSEC) + '″');
        ro.set('x', fmt(sepR, 3) + ' ×');
        ro.set('dip', dip >= 0.999 ? 'no dip: one peak' : (dip * 100).toFixed(1) + ' % of the peak');
        ro.set('v', sepR >= 1 ? 'two stars, clearly (Rayleigh)' : sepR >= 0.78 ? 'two stars, a faint notch (Sparrow)' : sepR >= 0.55 ? 'one elongated blob' : 'one star');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a grating fans white light into orders */
  Hyper.sim('df-grating', {
    title: 'A grating: orders and spectra from d(sin θm − sin θi) = mλ',
    blurb: `A transmission grating lit by one colour, or by white light. Each order leaves at the angle the grating equation gives, and the coloured bands at the rim are the spectra of the orders (violet nearest the straight-through beam, red farthest). Orders that would need sin θ > 1 do not exist.

**Try this**
- Start with **white light** and 600 lines/mm: the zero order is white, each side order is a spectrum. Raise the groove density to 1200: the spectra spread out and the second order starts to fall off the edge.
- Switch to a single colour and slide the wavelength: the order moves outwards for longer wavelengths (red farther than blue, the opposite of a prism).
- Tilt the incident beam (θᵢ): the pattern is no longer symmetric, and an order on one side can disappear while a new one appears on the other.
- At 300 lines/mm and 633 nm count the orders in the readout: eleven, from −5 to +5.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Df = O.diff;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'g', label: 'Groove density', min: 100, max: 1800, value: params.g || 600, log: true, sig: 3, unit: 'lines/mm' },
        { id: 'white', type: 'check', label: 'White light (400–700 nm)', value: params.white !== false },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 1, value: params.nm || 550, unit: 'nm' },
        { id: 'ti', label: 'Angle of incidence θᵢ', min: -60, max: 60, step: 1, value: params.ti || 0, unit: '°' }
      ], id => { if (id === 'white') ctl.show('nm', !V.white); loop.once(); });
      const V = ctl.values;
      ctl.show('nm', !V.white);
      const ro = kit.readout(box.side, [['d', 'Pitch d = 1/g'], ['ord', 'Orders that exist (this colour)'], ['a1', 'First-order angle'], ['fan', 'First-order spectrum, 400 → 700 nm'], ['top', 'Highest order for 400 nm']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const d = 1e-3 / V.g, ti = V.ti * D2R, gx = Math.round(W * 0.3), cy = Hh / 2, R = Math.min(Hh / 2 - 22, W - gx - 40), hg = Hh * 0.12;
        const lams = V.white ? [400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700] : [V.nm];
        const th = (nm, m) => Df.grating({ d, nm, thetaI: ti, m });
        S.normal(c, gx, cy, 0, R + 6);
        // the incident beam
        const Rin = gx - 24, sx = gx - Rin * Math.cos(ti), sy = cy + Rin * Math.sin(ti);
        S.ray(c, [[sx, sy], [gx, cy]], V.white ? { color: C.text, width: 3, arrows: true } : { nm: V.nm, width: 3, arrows: true });
        S.grating(c, gx, cy, hg, { lines: 18, label: 'grating' });
        const mMax = Math.floor(d * (1 + Math.abs(Math.sin(ti))) / 400e-9);
        for (let m = -mMax; m <= mMax; m++) {
          const mono = V.white ? 550 : V.nm;
          if (m === 0) { S.ray(c, [[gx, cy], [gx + R * Math.cos(ti), cy - R * Math.sin(ti)]], V.white ? { color: C.text, width: 2.6, arrows: false } : { nm: V.nm, width: 2.6, arrows: true }); kit.label(c, 'm = 0', gx + (R + 8) * Math.cos(ti), cy - (R + 8) * Math.sin(ti), { color: C.muted, size: 11.5, baseline: 'middle' }); continue; }
          let anyOrder = false, lastT = NaN;
          for (const nm of lams) {
            const t = th(nm, m); if (Number.isNaN(t)) continue;
            anyOrder = true;
            S.ray(c, [[gx, cy], [gx + R * Math.cos(t), cy - R * Math.sin(t)]], { nm, width: V.white ? 1.4 : 2.4, arrows: !V.white, alpha: V.white ? 0.85 : undefined });
          }
          // the spectrum of the order, as a coloured band at the rim
          if (V.white) {
            let prev = null;
            for (let nm = 400; nm <= 700; nm += 5) {
              const t = th(nm, m); if (Number.isNaN(t)) { prev = null; continue; }
              if (prev !== null) { c.strokeStyle = S.nm(nm); c.lineWidth = 7; c.beginPath(); c.arc(gx, cy, R + 7, -prev, -t, t > prev); c.stroke(); }
              prev = t;
            }
          }
          const tl = th(V.white ? 550 : V.nm, m), tl2 = Number.isNaN(tl) ? th(V.white ? 700 : V.nm, m) : tl;
          if (!Number.isNaN(tl2)) kit.label(c, (m > 0 ? '+' : '') + m, gx + (R + 20) * Math.cos(tl2), cy - (R + 20) * Math.sin(tl2), { align: 'center', color: C.muted, size: 11.5 });
        }
        if (Math.abs(V.ti) > 1) S.angle(c, gx, cy, 40, Math.PI, Math.PI - ti, 'θᵢ');
        const t1 = th(V.white ? 550 : V.nm, 1);
        if (!Number.isNaN(t1)) S.angle(c, gx, cy, 62, 0, -t1, 'θ₁', { gap: 12 });
        // the read-outs
        const nmr = V.white ? 550 : V.nm, ords = Df.gratingOrders({ d, nm: nmr, thetaI: ti }), ms = ords.map(o => o.m);
        ro.set('d', len(d) + '  (' + fmt(V.g) + ' lines/mm)');
        ro.set('ord', ms.length ? ms[0] + ' … ' + ms[ms.length - 1] + '  (' + ms.length + ' orders)' : 'none');
        ro.set('a1', Number.isNaN(th(nmr, 1)) ? 'no first order' : fmt(th(nmr, 1) * R2D) + '°');
        const f4 = th(400, 1), f7 = th(700, 1);
        ro.set('fan', Number.isNaN(f4) ? 'no first order for blue' : Number.isNaN(f7) ? fmt(f4 * R2D) + '° → (red does not reach)' : fmt(f4 * R2D) + '° → ' + fmt(f7 * R2D) + '°  (' + fmt((f7 - f4) * R2D) + '° wide)');
        let top = 0; for (let m = 1; m <= 40; m++) if (!Number.isNaN(th(400, m))) top = m; else break;
        ro.set('top', top ? String(top) : 'none');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ N slits */
  Hyper.sim('df-nslits', {
    title: 'N slits: the orders stay put and get sharper',
    blurb: `The intensity from N identical slits as a function of direction, in units of λ/d (so each whole number is a grating order). The dashed curve is the envelope of one slit. The strip below the graph is how the pattern looks on a screen.

**Try this**
- Start with N = 2: broad two-slit fringes, as in Young's experiment. Raise N to 5, 10, 30: the principal peaks stay exactly where they were and shrink to sharp lines, with N − 2 faint ripples between them.
- Tick **real brightness**: the peaks grow in proportion to N² as they narrow. The light that was spread across a fringe is gathered into a line.
- Make the slits wider (a/d up): the envelope narrows and fewer orders survive. At a/d = 0.5 every second order is missing, because it falls on a zero of the envelope.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Df = O.diff;
      const st = kit.stage(box.stage, { aspect: 0.22, minH: 100, maxH: 160 });
      const gb = document.createElement('div'); gb.style.padding = '0'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Number of slits N', min: 1, max: 40, step: 1, value: params.N || 2 },
        { id: 'ad', label: 'Slit width ÷ pitch, a/d', min: 0.05, max: 1, step: 0.05, value: params.ad || 0.3 },
        { id: 'real', type: 'check', label: 'Real brightness (peaks ∝ N²)', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sec', 'Faint maxima between orders'], ['hw', 'Half-width of an order'], ['fw', 'Full width at half maximum'], ['pk', 'Peak brightness vs one slit'], ['miss', 'Missing orders']]);
      const plot = kit.plot(gb, { x: { label: 'direction, d sin θ / λ  (whole numbers are orders)' }, y: { label: 'relative intensity' }, legend: true }, 210);
      const XM = 2.5, D0 = 10e-6, NM = 550;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const N = Math.round(V.N), a = V.ad * D0, I = x => Df.nSlits(N, a, D0, NM, Math.asin(clamp(x * NM * 1e-9 / D0, -1, 1)));
        const x0 = 58, x1 = W - 16, hS = Hh - 26;
        S.fringes(c, x0, 8, x1 - x0, hS, u => I((2 * u - 1) * XM), { nm: NM, gamma: 0.5 });
        for (let k = -2; k <= 2; k++) kit.label(c, String(k), x0 + (k / XM + 1) / 2 * (x1 - x0), Hh - 8, { align: 'center', color: C.faint, size: 10.5 });
        S.grating(c, 26, 8 + hS / 2, Math.min(hS / 2, 40), { lines: Math.min(N - 1, 20) || 1, color: C.text });
        kit.label(c, N + ' slits', 26, 8 + hS / 2 + Math.min(hS / 2, 40) + 12, { align: 'center', color: C.muted, size: 11 });
        const sc = V.real ? N * N : 1, pts = [], env = [];
        for (let i = 0; i <= 800; i++) { const x = (2 * i / 800 - 1) * XM; pts.push([x, I(x) * sc]); env.push([x, Df.singleSlit(a, NM, Math.asin(clamp(x * NM * 1e-9 / D0, -1, 1))) * sc]); }
        plot.set({ series: [{ pts, label: N + ' slits' }, { pts: env, label: 'one slit (envelope)', dash: true }], x: { label: 'direction, d sin θ / λ  (whole numbers are orders)', min: -XM, max: XM }, y: { label: V.real ? 'intensity ÷ one slit\'s' : 'relative intensity', min: 0, max: sc * 1.05 } });
        ro.set('sec', N > 2 ? String(N - 2) : 'none');
        ro.set('hw', '1/N = ' + fmt(1 / N) + ' of the order spacing');
        ro.set('fw', fmt(0.886 / N) + ' of the order spacing');
        ro.set('pk', '× ' + N * N);
        const r = 1 / V.ad, miss = Math.abs(r - Math.round(r)) < 0.02 && Math.round(r) > 1 ? 'orders ±' + Math.round(r) + ', ±' + 2 * Math.round(r) + ' … (on a zero of the envelope)' : Math.abs(r - 1) < 0.02 ? 'all except the zero order' : 'none';
        ro.set('miss', miss);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a blazed reflection grating */
  Hyper.sim('df-blaze', {
    title: 'A blazed grating: tilting the grooves to choose the order',
    blurb: `A reflection grating with sawtooth grooves, drawn so that the grooves are far larger than they would be. Each groove is a small mirror tilted by the blaze angle θB. The dashed ray is where one facet, acting as a mirror, would send the light; the order nearest to it takes most of the light. The graph shows the efficiency of each order against wavelength, in the simple scalar theory (real gratings fall a little short of it and differ for the two polarizations).

**Try this**
- Keep **Littrow** ticked and change the blaze wavelength: the efficiency peak of order +1 follows it. A 600 lines/mm grating blazed for 500 nm has a groove angle of 8.6°.
- Move the colour away from the blaze wavelength: the light shifts into other orders and the first order dims. Look at 1000 nm: only about a third of the peak.
- Untick Littrow and tilt the incident beam: the order that takes the light changes, though the grating is the same.
- Raise the groove density: the blaze angle grows for the same wavelength.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Df = O.diff;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 470 });
      const gb = document.createElement('div'); gb.style.padding = '0'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'g', label: 'Groove density', min: 100, max: 2400, value: params.g || 600, log: true, sig: 3, unit: 'lines/mm' },
        { id: 'lB', label: 'Blaze wavelength (order 1, Littrow)', min: 200, max: 1800, step: 10, value: params.lB || 500, unit: 'nm' },
        { id: 'lit', type: 'check', label: 'Littrow mount: α equals the blaze angle', value: params.lit !== false },
        { id: 'al', label: 'Angle of incidence α', min: 0, max: 80, step: 0.5, value: 8.6, unit: '°' },
        { id: 'nm', label: 'Colour shown', min: 250, max: 1500, step: 5, value: params.nm || 500, unit: 'nm' }
      ], id => { sync(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['d', 'Pitch d'], ['tB', 'Blaze angle θB'], ['mir', 'Facet mirror direction'], ['E', 'Light in each order (at this colour)']]);
      const plot = kit.plot(gb, { x: { label: 'wavelength (nm)' }, y: { label: 'efficiency (scalar theory)' }, legend: true }, 200);
      const sinc = x => Math.abs(x) < 1e-9 ? 1 : Math.sin(x) / x;
      const geom = () => { const d = 1e-3 / V.g, lB = Math.min(V.lB * 1e-9, 1.96 * d), tB = Math.asin(lB / (2 * d)); return { d, tB, al: V.lit ? tB : V.al * D2R }; };
      // the efficiency of order m at wavelength lam (m) for incidence al: each groove is a tilted mirror
      const eff = (m, lam, d, tB, al) => { const sb = Math.sin(al) - m * lam / d; if (Math.abs(sb) > 1) return NaN; const be = Math.asin(sb), cc = d / lam * Math.tan(tB) * (Math.cos(al) + Math.cos(be)); return sq(sinc(PI * (m - cc))); };
      function sync() { const g = geom(); ctl.show('al', !V.lit); if (V.lit) ctl.set('al', clamp(g.tB * R2D, 0, 80)); }
      sync();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const { d, tB, al } = geom(), lam = V.nm * 1e-9, gw = W;
        // the grooves
        const dpx = Math.min(54, 70 / Math.max(0.05, Math.tan(tB))), n = Math.max(3, Math.min(10, Math.floor((gw - 40) / dpx))), x0 = gw / 2 - n * dpx / 2, y0 = Hh * 0.7, hf = dpx * Math.tan(tB);
        c.save(); c.beginPath(); c.moveTo(x0 - 16, y0 + 18); c.lineTo(x0 - 16, y0);
        for (let k = 0; k < n; k++) { c.lineTo(x0 + k * dpx, y0); c.lineTo(x0 + (k + 1) * dpx, y0 - hf); c.lineTo(x0 + (k + 1) * dpx, y0); }
        c.lineTo(x0 + n * dpx + 16, y0); c.lineTo(x0 + n * dpx + 16, y0 + 18); c.closePath();
        c.fillStyle = S.metal(); c.globalAlpha = 0.5; c.fill(); c.globalAlpha = 1; c.strokeStyle = S.metal(); c.lineWidth = 1.5; c.stroke(); c.restore();
        const km = Math.floor(n / 2), hx = x0 + (km + 0.5) * dpx, hy = y0 - hf * 0.5, L = Math.min(Hh * 0.56, gw * 0.46);
        S.normal(c, hx, hy, Math.PI / 2, 70, { color: C.faint });
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx - 52 * Math.sin(tB), hy - 52 * Math.cos(tB)); c.stroke(); c.restore();
        kit.label(c, 'facet normal', hx - 52 * Math.sin(tB) - 4, hy - 52 * Math.cos(tB) - 6, { align: 'right', color: C.warn, size: 10.5 });
        S.ray(c, [[hx - L * Math.sin(al), hy - L * Math.cos(al)], [hx, hy]], { nm: V.nm, width: 2.6, arrows: true });
        // the mirror direction of a facet, and the orders
        const bs = al - 2 * tB;
        S.ray(c, [[hx, hy], [hx + L * Math.sin(bs), hy - L * Math.cos(bs)]], { color: C.warn, width: 1.2, dash: [5, 4], arrows: false });
        kit.label(c, 'facet mirror direction', hx + L * Math.sin(bs), hy - L * Math.cos(bs) - 8, { align: 'center', color: C.warn, size: 10.5 });
        const es = []; let best = null;
        for (let m = -3; m <= 5; m++) {
          const E = eff(m, lam, d, tB, al); if (Number.isNaN(E)) continue;
          const be = Math.asin(Math.sin(al) - m * lam / d); es.push((m > 0 ? '+' : '') + m + ': ' + (E * 100).toFixed(E < 0.1 ? 1 : 0) + ' %');
          if (E > 0.004) {
            S.ray(c, [[hx, hy], [hx + L * Math.sin(be), hy - L * Math.cos(be)]], { nm: V.nm, width: 1 + 3.5 * E, alpha: 0.3 + 0.7 * E, arrows: false });
            kit.label(c, (m > 0 ? '+' : '') + m, hx + (L + 12) * Math.sin(be), hy - (L + 12) * Math.cos(be), { align: 'center', color: C.text, size: 11.5, weight: 600 });
          }
        }
        S.angle(c, x0 + km * dpx, y0, 30, 0, -tB, 'θB', { gap: 14 });
        S.angle(c, hx, hy, 40, -Math.PI / 2, -Math.PI / 2 - al, 'α', { gap: 12 });
        kit.label(c, 'one groove = one small mirror', gw / 2, Hh - 10, { align: 'center', color: C.muted, size: 11.5 });
        // the efficiency curves
        const mk = m => { const pts = []; for (let nm = 200; nm <= 1500; nm += 5) { const E = eff(m, nm * 1e-9, d, tB, al); if (!Number.isNaN(E)) pts.push([nm, E]); } return pts; };
        plot.set({ series: [{ pts: mk(1), label: 'order +1' }, { pts: mk(2), label: 'order +2' }, { pts: mk(0), label: 'order 0', dash: true }, { pts: mk(-1), label: 'order −1', dash: true }], x: { label: 'wavelength (nm)', min: 200, max: 1500 }, y: { label: 'efficiency (scalar theory)', min: 0, max: 1.05 }, vlines: [{ x: V.lB, label: 'blaze' }, { x: V.nm, label: 'colour' }] });
        ro.set('d', len(d) + '  (' + fmt(V.g) + ' lines/mm)');
        ro.set('tB', fmt(tB * R2D, 3) + '°' + (V.lB * 1e-9 > 1.96 * d ? '  (blaze wavelength limited to 2d)' : ''));
        ro.set('mir', fmt(bs * R2D) + '° (order whose angle is nearest takes the light)');
        ro.set('E', es.join('   ') || 'no diffracted order');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ resolving two spectral lines */
  Hyper.sim('df-spectrometer', {
    title: 'Resolving power: telling two spectral lines apart',
    blurb: `A grating spectrometer (schematic above) forms an image of its entrance slit at each wavelength. The graph shows the brightness along the detector for a pair of spectral lines: each line is as wide as the grating's diffraction allows, Δλ = λ/(mN), and the strip underneath is what the detector would record.

**Try this**
- With the sodium pair and the default settings the two lines are one lump: R = mN is too small. Widen the lit part of the grating (W) to about 0.82 mm and the pair separates, just as Rayleigh predicts.
- Choose the **hydrogen–deuterium** pair, only 0.18 nm apart: it needs a resolving power of about 3600, which takes either a wide beam, a high order or a fine grating.
- Raise the order m: the lines get sharper in proportion, but the free spectral range λ/m shrinks.
- Look at the readouts for the dispersion: it depends on the groove density and order, not on how much of the grating is lit.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Df = O.diff;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200, maxH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '0'; box.stage.appendChild(gb);
      const PAIRS = [['Sodium D lines: 588.995 and 589.592 nm', 0], ['Mercury yellow pair: 576.96 and 579.07 nm', 1], ['Hydrogen and deuterium Balmer-α: 656.10 and 656.28 nm', 2]];
      const LINES = [[588.995, 589.592], [576.960, 579.066], [656.100, 656.279]];
      const ctl = kit.controls(box.side, [
        { id: 'pair', type: 'select', label: 'Pair of lines', options: PAIRS, value: params.pair || 0 },
        { id: 'g', label: 'Groove density', min: 100, max: 3600, value: params.g || 1200, log: true, sig: 3, unit: 'lines/mm' },
        { id: 'W', label: 'Width of grating lit, W', min: 0.1, max: 100, value: params.W || 0.6, log: true, sig: 2, unit: 'mm' },
        { id: 'm', label: 'Order m', min: 1, max: 6, step: 1, value: params.m || 1 }
      ], () => loop.once());
      const V = ctl.values, F = 300;
      const ro = kit.readout(box.side, [['R', 'Resolving power R = mN'], ['N', 'Lines lit, N = g·W'], ['dl', 'Line width λ/(mN)'], ['sep', 'Separation of the pair  ·  needed R'], ['v', 'The pair is'], ['disp', 'Angular dispersion  ·  at f = 300 mm'], ['fsr', 'Free spectral range λ/m']]);
      const plot = kit.plot(gb, { x: { label: 'wavelength (nm)' }, y: { label: 'intensity' } }, 190);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const [l1, l2] = LINES[V.pair], l0 = (l1 + l2) / 2, sepNm = l2 - l1, d = 1e-3 / V.g, m = Math.round(V.m), N = V.g * V.W, R = m * N, dl = l0 / R;
        const s = m * l0 * 1e-9 / (2 * d), ok = s < 1;
        // a schematic: slit, collimator, grating (its lit width), camera, detector
        const cy = Hh / 2, xs = [W * 0.08, W * 0.26, W * 0.5, W * 0.72, W * 0.92], bh = clamp(8 + 14 * Math.log10(V.W / 0.1), 6, Hh * 0.38);
        S.slits(c, xs[0], cy, 22, [[cy - 3, cy + 3]]);
        S.beam(c, xs[0], xs[1], cy, x => 3 + (x - xs[0]) / (xs[1] - xs[0]) * (bh - 3), { nm: l0, alpha: 0.3 });
        S.thinLens(c, xs[1], cy, bh + 8, 1, { foci: false });
        S.beam(c, xs[1], xs[2], cy, bh, { nm: l0, alpha: 0.3 });
        S.grating(c, xs[2], cy, bh, { lines: 14 });
        // the two colours leave at slightly different angles (exaggerated) and are focused at two places of the detector
        for (const [col, dir] of [[l1, 1], [l2, -1]]) for (const u of [-1, 0, 1]) { const yg = cy + u * bh * 0.8; S.ray(c, [[xs[2], yg], [xs[3], yg - dir * (xs[3] - xs[2]) * 0.06], [xs[4], cy - dir * 7]], { nm: col, width: 1, arrows: false, alpha: 0.7 }); }
        S.thinLens(c, xs[3], cy, bh + 8, 1, { foci: false });
        S.sensor(c, xs[4], cy, 24, { pixels: 16 });
        kit.label(c, 'slit', xs[0], cy + 34, { align: 'center', color: C.muted, size: 11 }); kit.label(c, 'collimator', xs[1], cy + bh + 22, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'grating: ' + fmt(N) + ' lines lit', xs[2], cy + bh + 22, { align: 'center', color: C.text, size: 11.5, weight: 600 }); kit.label(c, 'camera', xs[3], cy + bh + 22, { align: 'center', color: C.muted, size: 11 }); kit.label(c, 'detector', xs[4], cy + 40, { align: 'center', color: C.muted, size: 11 });
        // the profile: two diffraction-limited lines
        const half = Math.max(2.2 * sepNm, 3.2 * dl), prof = lam => sq(sinc(PI * (lam - l1) / dl)) + sq(sinc(PI * (lam - l2) / dl));
        const pts = []; for (let i = 0; i <= 600; i++) { const lam = l0 - half + 2 * half * i / 600; pts.push([lam, prof(lam)]); }
        plot.set({ series: [{ pts, label: 'detector signal' }], x: { label: 'wavelength (nm)', min: l0 - half, max: l0 + half }, y: { label: 'intensity', min: 0, max: 2.1 }, vlines: [{ x: l1, label: 'line 1' }, { x: l2, label: 'line 2' }] });
        const need = l0 / sepNm;
        ro.set('R', fmt(R)); ro.set('N', fmt(N, 4)); ro.set('dl', fmt(dl, 3) + ' nm');
        ro.set('sep', fmt(sepNm, 3) + ' nm  ·  R = ' + fmt(need, 3));
        ro.set('v', R >= need * 1.0 ? 'resolved: R ≥ λ/Δλ' : R >= need * 0.78 ? 'just merging (Sparrow limit)' : 'unresolved: one lump');
        if (ok) { const da = Df.angularDispersion({ d, nm: l0, thetaI: -Math.asin(s), m }); ro.set('disp', fmt(da * R2D, 3) + '°/nm  ·  ' + fmt(F * da, 3) + ' mm/nm'); ro.set('fsr', fmt(l0 / m, 3) + ' nm'); }
        else { ro.set('disp', 'no order ' + m + ' at this pitch'); ro.set('fsr', '—'); }
      }, box.stage);
      const sinc = x => Math.abs(x) < 1e-9 ? 1 : Math.sin(x) / x;
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ Fresnel zones, zone plates, discs */
  Hyper.sim('df-zones', {
    title: 'Fresnel zones: a zone plate, a hole and a disc',
    blurb: `Light of one colour falls on a flat element. The strip along the axis and the graph show the intensity on the axis behind it, relative to the unobstructed beam. The rings are drawn to scale across the element; the distance along the axis is to scale too (the transverse scale is not).

**Try this**
- **Zone plate** with 12 zones: a sharp focus at f = 100 mm that is 144 times brighter than the open beam, with weaker foci at f/3 and f/5. Add zones and the focus sharpens and brightens as K².
- Change the wavelength: the focus slides along the axis as 1/λ, so blue light (400 nm) focuses 75 % farther from the plate than red (700 nm): the reverse of a glass lens.
- **Circular hole**: the axis blinks bright and dark (up to 4× and down to zero) as the Fresnel number passes through whole numbers.
- **Opaque disc**: the axis is exactly as bright as with no disc at all, the Poisson (Arago) spot.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Df = O.diff;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260, maxH: 380 });
      const gb = document.createElement('div'); gb.style.padding = '0'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'el', type: 'select', label: 'Element', options: [['Zone plate (odd zones open)', 'plate'], ['Circular hole of the same outer radius', 'hole'], ['Opaque disc of the same radius', 'disc']], value: params.el || 'plate' },
        { id: 'K', label: 'Number of zones K', min: 2, max: 40, step: 1, value: params.K || 12 },
        { id: 'f0', label: 'Design focal length (at 550 nm)', min: 30, max: 300, step: 5, value: params.f0 || 100, unit: 'mm' },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: params.nm || 550, unit: 'nm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Main focus at this wavelength'], ['r1', 'First zone radius'], ['rK', 'Outer radius'], ['dr', 'Outermost zone width'], ['I', 'Intensity at the focus ÷ open beam'], ['NF', 'Fresnel number at z = design f']]);
      const plot = kit.plot(gb, { x: { label: 'distance behind the element z (mm)' }, y: { label: 'axis intensity ÷ open beam' } }, 180);
      const LAM0 = 550;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const K = Math.round(V.K), f0 = V.f0 * 1e-3, lam = V.nm * 1e-9, el = V.el;
        const rr = [0]; for (let k = 1; k <= K; k++) rr.push(Df.zoneRadius(k, f0, LAM0));
        const rK = rr[K];
        const onAxis = z => {
          const ph = r => PI * r * r / (lam * z); let re = 0, im = 0;
          if (el === 'plate') { for (let j = 1; j <= K; j += 2) { re += Math.cos(ph(rr[j - 1])) - Math.cos(ph(rr[j])); im += Math.sin(ph(rr[j - 1])) - Math.sin(ph(rr[j])); } }
          else if (el === 'hole') { re = 1 - Math.cos(ph(rK)); im = -Math.sin(ph(rK)); }
          else { re = Math.cos(ph(rK)); im = Math.sin(ph(rK)); }
          return re * re + im * im;
        };
        const zmax = 2.2 * V.f0 * 1e-3;
        // the face of the element
        const fs = Math.min(Hh - 40, W * 0.3), fx = 14, fy = 14, fc = [fx + fs / 2, fy + fs / 2], sc = fs / 2 / (rK * 1.12);
        c.fillStyle = C.surface; c.fillRect(fx, fy, fs, fs); c.strokeStyle = C.axis; c.strokeRect(fx, fy, fs, fs);
        const opaque = C.text, clear = C.bg2;
        const disk = (r, col) => { c.fillStyle = col; c.beginPath(); c.arc(fc[0], fc[1], Math.max(0.3, r * sc), 0, TAU); c.fill(); };
        if (el === 'plate') { disk(rK * 1.12, opaque); for (let k = K; k >= 1; k--) disk(rr[k], k % 2 ? clear : opaque); }
        else if (el === 'hole') { disk(rK * 1.12, opaque); disk(rK, clear); }
        else { disk(rK * 1.12, clear); disk(rK, opaque); }
        kit.label(c, 'face of the element: radius ' + len(rK), fx + fs / 2, fy + fs + 12, { align: 'center', color: C.muted, size: 11 });
        // the side view and the axis
        const bx = fx + fs + 40, ex = W - 14, cy = fy + fs / 2, X = z => bx + z / zmax * (ex - bx);
        const hh = fs / 2, s2 = hh / (rK * 1.12);
        const gaps = []; if (el === 'plate') { for (let j = 1; j <= K; j += 2) { gaps.push([cy - rr[j] * s2, cy - rr[j - 1] * s2], [cy + rr[j - 1] * s2, cy + rr[j] * s2]); } }
        else if (el === 'hole') gaps.push([cy - rK * s2, cy + rK * s2]); else gaps.push([cy - hh, cy - rK * s2], [cy + rK * s2, cy + hh]);
        S.slits(c, bx, cy, hh, gaps, { w: 4 });
        // brightness along the axis, as a strip, and the rays of the plate
        const nz = 320, zs = [], Is = []; let Imax = 1e-9;
        for (let i = 1; i <= nz; i++) { const z = zmax * i / nz, v = onAxis(z); zs.push(z); Is.push(v); if (v > Imax) Imax = v; }
        const ys = cy + hh + 18;
        S.fringes(c, bx, ys, ex - bx, 12, u => onAxis(Math.max(1e-6, u * zmax)) / Imax, { nm: V.nm, gamma: 0.55 });
        kit.label(c, 'axis brightness (brighter = more light)', bx, ys + 24, { color: C.muted, size: 11 });
        const fl = f0 * LAM0 / V.nm;
        if (el === 'plate') {
          for (let j = 1; j <= K; j += 2) { const r = (rr[j - 1] + rr[j]) / 2 * s2; for (const sg of [-1, 1]) S.ray(c, [[bx, cy + sg * r], [X(fl), cy]], { nm: V.nm, width: 0.8, arrows: false, alpha: 0.7 }); }
          if (fl <= zmax) { kit.dot(c, X(fl), cy, 4, C.warn); kit.label(c, 'focus', X(fl), cy - 12, { align: 'center', color: C.warn, size: 11.5 }); }
        } else { for (const r of [-0.6, -0.3, 0, 0.3, 0.6]) S.ray(c, [[bx - 30, cy + r * hh], [ex, cy + r * hh]], { nm: V.nm, width: 0.8, arrows: false, alpha: 0.35 }); }
        S.axis(c, bx, cy, ex);
        // the graph
        const pts = zs.map((z, i) => [z * 1e3, Is[i]]), vl = el === 'plate' ? [fl, fl / 3, fl / 5].filter(v => v <= zmax).map((v, i) => ({ x: v * 1e3, label: i ? 'f/' + (2 * i + 1) : 'f' })) : [];
        plot.set({ series: [{ pts, label: 'axis intensity' }], x: { label: 'distance behind the element z (mm)', min: 0, max: zmax * 1e3 }, y: { label: 'axis intensity ÷ open beam', min: 0 }, vlines: vl, hlines: [{ y: 1 }] });
        ro.set('f', el === 'plate' ? len(fl) + (V.nm === LAM0 ? '' : '  (design ' + len(f0) + ')') : '— (no focus)');
        ro.set('r1', len(rr[1])); ro.set('rK', len(rK));
        ro.set('dr', len(rK - rr[K - 1]));
        ro.set('I', el === 'plate' ? fmt(onAxis(fl)) + (V.nm === LAM0 ? '  (K² = ' + K * K + ')' : '') : el === 'hole' ? fmt(onAxis(f0)) + ' at z = f; between 0 and 4' : '1 everywhere on the axis (the Poisson spot)');
        ro.set('NF', fmt(Df.fresnelNumber(rK, f0, V.nm)) + (el === 'hole' ? ' zones exposed' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a small 2-D FFT for the Fourier-plane sims */
  const fftCache = {};
  function getFFT(n) {
    if (fftCache[n]) return fftCache[n];
    const bits = Math.round(Math.log2(n)), rev = new Uint32Array(n), cosT = new Float64Array(n / 2), sinT = new Float64Array(n / 2), tr = new Float64Array(n), ti = new Float64Array(n);
    for (let i = 0; i < n; i++) { let r = 0; for (let b = 0; b < bits; b++) if (i & (1 << b)) r |= 1 << (bits - 1 - b); rev[i] = r; }
    for (let i = 0; i < n / 2; i++) { cosT[i] = Math.cos(TAU * i / n); sinT[i] = Math.sin(TAU * i / n); }
    const line = (re, im, off, stride) => {
      for (let i = 0; i < n; i++) { const j = off + rev[i] * stride; tr[i] = re[j]; ti[i] = im[j]; }
      for (let size = 2; size <= n; size <<= 1) {
        const half = size >> 1, step = n / size;
        for (let s = 0; s < n; s += size) for (let k = 0; k < half; k++) {
          const c = cosT[k * step], sn = -sinT[k * step], a = s + k, b = a + half;
          const xr = tr[b] * c - ti[b] * sn, xi = tr[b] * sn + ti[b] * c;
          tr[b] = tr[a] - xr; ti[b] = ti[a] - xi; tr[a] += xr; ti[a] += xi;
        }
      }
      for (let i = 0; i < n; i++) { const j = off + i * stride; re[j] = tr[i]; im[j] = ti[i]; }
    };
    // the forward transform in place on an n × n array; two forward transforms in a row return the object turned upside down, as a 4f system does
    return (re, im) => { for (let y = 0; y < n; y++) line(re, im, y * n, 1); for (let x = 0; x < n; x++) line(re, im, x, n); };
  }

  /* ================================================================ the 4f system: object, Fourier plane, filter, image */
  Hyper.sim('df-4f', {
    title: 'A lens as a Fourier transformer: object, Fourier plane, filter, image',
    blurb: `A 4f system: the object (left) is transformed by the first lens into its spatial frequencies (middle, the Fourier plane, log brightness); a mask there (amber is blocked) keeps some of them; the second lens transforms back to give the image (right), upside down. The object is 6.4 mm across, lit by a 633 nm laser; the numbers in the readout are in real units.

**Try this**
- **Cosine grating**: three spots, the centre and one pair; a finer grating (smaller period) puts the spots farther out, at x = λfν. A **square-wave** grating adds the odd orders.
- **Slit** and **round hole**: the Fourier plane shows sinc² and the Airy pattern. A smaller opening makes a wider pattern.
- **Letters and shapes behind a fine gauze**, then the **Notch** mask: blocking the gauze's spots (far from the centre) removes the gauze and leaves the picture, a little softer.
- Choose **Low-pass** with a small hole: the picture blurs. **High-pass** or **Dark field**: only the edges remain. The **phase object** is invisible until you choose the **Phase contrast** mask.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230, maxH: 390 });
      const N = 128, h = N / 2, WOBJ = 6.4, PIX = WOBJ / N * 1e3, LAM = 633e-9, fft = getFFT(N);
      const OBJ = [['A cosine grating', 'grating'], ['A square-wave grating', 'square'], ['A single slit', 'slit'], ['A round hole', 'hole'], ['A wire mesh', 'mesh'], ['Letters and shapes', 'scene'], ['The same, behind a fine gauze', 'meshscene'], ['Transparent shapes (a phase object)', 'phase']];
      const MASK = [['None: open Fourier plane', 'none'], ['Low-pass: a pinhole at the centre', 'low'], ['High-pass: a small opaque dot at the centre', 'high'], ['Dark field: block only the zero order', 'dark'], ['Horizontal slit: keep detail that varies left-right', 'hslit'], ['Vertical slit: keep detail that varies up-down', 'vslit'], ['Notch: block the spots of the gauze', 'notch'], ['Phase contrast: quarter-wave dot at the centre', 'phase']];
      const ctl = kit.controls(box.side, [
        { id: 'obj', type: 'select', label: 'Object', options: OBJ, value: params.object || 'grating' },
        { id: 'size', label: 'Detail size (cells of 50 µm)', min: 3, max: 32, step: 1, value: params.size || 8 },
        { id: 'mask', type: 'select', label: 'Mask in the Fourier plane', options: MASK, value: params.mask || 'none' },
        { id: 'rc', label: 'Mask size (cells of the Fourier plane)', min: 1, max: 40, step: 1, value: params.rc || 8 },
        { id: 'f', label: 'Focal length of the lenses', min: 50, max: 500, step: 10, value: params.f || 200, unit: 'mm' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ob', 'The object'], ['sc', 'Fourier-plane cell = λf/W'], ['sp', 'Where its light lands'], ['mk', 'The mask'], ['im', 'The image']]);
      function vis() { ctl.show('size', ['grating', 'square', 'slit', 'hole', 'mesh'].includes(V.obj)); ctl.show('rc', ['low', 'high', 'hslit', 'vslit'].includes(V.mask)); }
      vis();
      const sh = (x, y) => (x >= -44 && x <= -32 && y >= -30 && y <= 30) || (x >= -44 && x <= -14 && y >= -30 && y <= -18) || (x >= -44 && x <= -20 && y >= -4 && y <= 8) || (sq(x - 12) + sq(y + 18) <= 256) || (y >= 6 && y <= 40 && Math.abs(x - 28) <= (y - 6) * 22 / 32) ? 1 : 0;
      const gauze = (x, y, p) => (0.55 + 0.45 * Math.cos(TAU * x / p)) * (0.55 + 0.45 * Math.cos(TAU * y / p));
      const meshT = (x, y, p) => ((((x % p) + p) % p) < 0.7 * p && (((y % p) + p) % p) < 0.7 * p) ? 1 : 0;
      const re = new Float64Array(N * N), im = new Float64Array(N * N), objI = new Float64Array(N * N), specI = new Float64Array(N * N), imgI = new Float64Array(N * N), blocked = new Uint8Array(N * N);
      function maskAt(kind, kx, ky, rc) {
        const r = Math.hypot(kx, ky);
        switch (kind) {
          case 'low': return r <= rc ? 0 : 1;
          case 'high': return r <= rc ? 1 : 0;
          case 'dark': return r <= 1.5 ? 1 : 0;
          case 'hslit': return Math.abs(ky) <= Math.max(1.5, rc * 0.35) ? 0 : 1;
          case 'vslit': return Math.abs(kx) <= Math.max(1.5, rc * 0.35) ? 0 : 1;
          case 'notch': { const jx = Math.round(kx / 32), jy = Math.round(ky / 32); return (jx || jy) && Math.hypot(kx - 32 * jx, ky - 32 * jy) <= 5 ? 1 : 0; }
          default: return 0;
        }
      }
      let key = '', last = null;
      function run() {
        const k0 = [V.obj, V.size, V.mask, V.rc].join('|');
        if (k0 === key && last) return last;
        key = k0;
        const size = Math.round(V.size), kind = V.obj;
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
          const x = i - h, y = j - h, win = Math.exp(-(x * x + y * y) / (2 * sq(N / 5)));
          let a = 0, ph = 0;
          switch (kind) {
            case 'grating': a = (0.5 + 0.5 * Math.cos(TAU * x / size)) * win; break;
            case 'square': a = ((((x % size) + size) % size) < size / 2 ? 1 : 0) * win; break;
            case 'slit': a = Math.abs(x) < size / 2 && Math.abs(y) < 0.42 * N ? 1 : 0; break;
            case 'hole': a = x * x + y * y < size * size ? 1 : 0; break;
            case 'mesh': a = meshT(x, y, size) * Math.sqrt(win); break;
            case 'scene': a = 0.1 + 0.9 * sh(x, y); break;
            case 'meshscene': a = (0.1 + 0.9 * sh(x, y)) * gauze(x, y, 4); break;
            default: a = 1; ph = 0.9 * sh(x, y);
          }
          re[j * N + i] = a * Math.cos(ph); im[j * N + i] = a * Math.sin(ph); objI[j * N + i] = a * a;
        }
        fft(re, im);
        let smax = 1e-12;
        for (let k = 0; k < N * N; k++) { specI[k] = re[k] * re[k] + im[k] * im[k]; if (specI[k] > smax) smax = specI[k]; }
        const quarter = V.mask === 'phase';
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
          const kx = i < h ? i : i - N, ky = j < h ? j : j - N, k = j * N + i;
          if (quarter) { blocked[k] = Math.hypot(kx, ky) <= 1.5 ? 2 : 0; if (blocked[k]) { const a = re[k]; re[k] = -im[k]; im[k] = a; } }
          else { blocked[k] = maskAt(V.mask, kx, ky, V.rc); if (blocked[k]) { re[k] = 0; im[k] = 0; } }
        }
        fft(re, im);
        let imax = 1e-12;
        for (let k = 0; k < N * N; k++) { imgI[k] = re[k] * re[k] + im[k] * im[k]; if (imgI[k] > imax) imax = imgI[k]; }
        last = { smax, imax };
        return last;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const { smax, imax } = run();
        const side = Math.min((W - 60) / 3, Hh - 42), gap = (W - 3 * side) / 4, y0 = 14, xs = [gap, 2 * gap + side, 3 * gap + 2 * side];
        const odd = (k, w) => ({ k, w });
        c.fillStyle = '#000'; xs.forEach(x => c.fillRect(x, y0, side, side));
        paint(c, 'f-obj', xs[0], y0, side, side, N, N, (i, j) => Math.min(1, objI[j * N + i]), { gamma: 0.8 }, key);
        const L2 = Math.log10(2001);
        paint(c, 'f-spec', xs[1], y0, side, side, N, N, (i, j) => {
          const idx = ((j + h) % N) * N + ((i + h) % N), b = blocked[idx], t = Math.log10(1 + 2000 * specI[idx] / smax) / L2;
          return b === 2 ? [60 + 195 * t, 220 * (0.4 + 0.6 * t), 255] : b ? [255 * (0.35 + 0.65 * t), 170 * (0.25 + 0.5 * t), 30] : [255 * t, 255 * t, 255 * t];
        }, null, key);
        paint(c, 'f-img', xs[2], y0, side, side, N, N, (i, j) => Math.min(1, imgI[j * N + i] / imax), { gamma: 0.7 }, key);
        c.strokeStyle = C.axis; c.lineWidth = 1; xs.forEach(x => c.strokeRect(x, y0, side, side));
        kit.label(c, 'object (transmission)', xs[0] + side / 2, y0 + side + 12, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'Fourier plane, mask shaded', xs[1] + side / 2, y0 + side + 12, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'image (upside down)', xs[2] + side / 2, y0 + side + 12, { align: 'center', color: C.muted, size: 11.5 });
        for (const x of [xs[0] + side + gap / 2, xs[1] + side + gap / 2]) S.thinLens(c, x, y0 + side / 2, Math.min(40, side / 2 - 6), 1, { foci: false });
        // the numbers, in real units
        const step = LAM * V.f * 1e-3 / (WOBJ * 1e-3);                 // metres per cell of the Fourier plane
        const size = Math.round(V.size), per = size * PIX * 1e-3;        // mm
        ro.set('sc', fmt(step * 1e6) + ' µm  (field ±' + fmt(step * h * 1e3) + ' mm)');
        const k = V.obj;
        ro.set('ob', k === 'grating' || k === 'square' || k === 'mesh' ? 'period ' + fmt(per) + ' mm = ' + fmt(1 / per) + ' lp/mm' : k === 'slit' ? 'slit ' + fmt(size * PIX) + ' µm wide' : k === 'hole' ? 'hole ' + fmt(2 * size * PIX) + ' µm across' : k === 'phase' ? 'glass shapes: no change in brightness, only in phase' : 'letters, a disc and a triangle');
        ro.set('sp', k === 'grating' || k === 'square' || k === 'mesh' ? 'first order at x = λfν = ' + fmt(LAM * V.f * 1e-3 / (per * 1e-3) * 1e3) + ' mm  (' + fmt(N / size) + ' cells)' : k === 'slit' ? 'first dark line at λf/w = ' + fmt(LAM * V.f * 1e-3 / (size * PIX * 1e-6) * 1e3) + ' mm' : k === 'hole' ? 'first dark ring at 1.22λf/D = ' + fmt(1.22 * LAM * V.f * 1e-3 / (2 * size * PIX * 1e-6) * 1e3) + ' mm' : 'large features near the axis, edges far out');
        const m = V.mask, rcmm = V.rc * step * 1e3;
        ro.set('mk', m === 'none' ? 'none' : m === 'low' ? 'pinhole radius ' + fmt(rcmm) + ' mm: passes details larger than ' + fmt(WOBJ / V.rc * 1e3) + ' µm' : m === 'high' ? 'dot radius ' + fmt(rcmm) + ' mm: blocks details larger than ' + fmt(WOBJ / V.rc * 1e3) + ' µm' : m === 'dark' ? 'blocks the zero order only' : m === 'notch' ? 'blocks the spots of the gauze (every 32 cells)' : m === 'phase' ? 'shifts the zero order by a quarter wave' : 'slit width ' + fmt(Math.max(1.5, V.rc * 0.35) * 2 * step * 1e3) + ' mm');
        ro.set('im', m === 'none' ? 'a copy of the object, inverted' : m === 'low' ? 'blurred: fine detail and noise gone' : m === 'high' || m === 'dark' ? 'edges and fine detail only' : m === 'notch' ? 'the mesh is gone if it was there' : m === 'phase' ? 'phase differences become brightness' : 'only one direction of detail survives');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ recording and replaying a hologram */
  Hyper.sim('df-hologram', {
    title: 'A hologram of a point: recording, fringes and playback',
    blurb: `A film (vertical bar) records the interference of a reference beam (from the upper left) with the light scattered from a point object. The three small windows on the right show the fringes in a patch of the film 6 µm across at the top, centre and bottom: their spacing differs, because a hologram is a grating of changing pitch. Their contrast is the fringe visibility, set by the coherence of the source.

**Try this**
- Drag the object point (the dot) nearer the film or sideways: the fringe spacing at the three places changes. The hologram of a point is a zone plate.
- Tick **Play back**: the film is lit by the reference alone, and diffracts three beams: the straight-through reference, a copy of the object's wave (dashed lines show it appears to come from the original point: the virtual image) and the conjugate beam (the real image).
- Raise the reference angle: the fringes get finer and the film must resolve more lines per millimetre.
- Choose the **LED** or the **laser diode**: the fringes fade except where the two paths happen to be equal. Return to the helium–neon laser and increase the arm mismatch to 200 mm, its coherence length: the fringes vanish.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Df = O.diff;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 480 });
      const SRC = [['Helium–neon laser (several modes): 632.8 nm, Δλ 0.002 nm', 0], ['Single-frequency green laser: 532 nm, Δλ 0.0001 nm', 1], ['Free-running laser diode: 650 nm, Δλ 1 nm', 2], ['Red LED: 630 nm, Δλ 20 nm', 3]];
      const SPEC = [[632.8, 0.002], [532, 0.0001], [650, 1], [630, 20]];
      const ctl = kit.controls(box.side, [
        { id: 'z0', label: 'Object point: distance from the film', min: 50, max: 500, step: 5, value: params.z0 || 150, unit: 'mm' },
        { id: 'yo', label: 'Object point: height', min: -40, max: 40, step: 1, value: params.yo != null ? params.yo : 10, unit: 'mm' },
        { id: 'rho', label: 'Reference beam: angle to the film normal', min: 5, max: 60, step: 1, value: params.rho || 30, unit: '°' },
        { id: 'src', type: 'select', label: 'Light source', options: SRC, value: params.src || 0 },
        { id: 'dl', label: 'Path mismatch of the two beams at the film centre', min: 0, max: 300, step: 1, value: 0, unit: 'mm' },
        { id: 'play', type: 'check', label: 'Play back: light the film with the reference beam only', value: !!params.play }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['per', 'Fringe period: top · centre · bottom'], ['lpm', 'Film must resolve (centre)'], ['Lc', 'Coherence length of the source'], ['dL', 'Path difference: top · centre · bottom'], ['vis', 'Fringe visibility: top · centre · bottom'], ['ver', 'Verdict']]);
      let geo = { Px: 0, Py: 0, platex: 0, sy: 1, zk: 1, cy: 0 };
      kit.drag(st, {
        hover: true,
        hit: p => Math.hypot(p.x - geo.Px, p.y - geo.Py) < 16 ? 'P' : null,
        move: (w, p) => { ctl.set('z0', clamp(Math.round((geo.platex - p.x) / geo.zk / 5) * 5, 50, 500)); ctl.set('yo', clamp(Math.round((geo.cy - p.y) / geo.sy), -40, 40)); loop.once(); }
      });
      const sinc = x => Math.abs(x) < 1e-9 ? 1 : Math.sin(x) / x;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const [nm, dnm] = SPEC[V.src], lamUm = nm * 1e-3, rho = V.rho * D2R, z0 = V.z0, yo = V.yo, cy = Hh / 2;
        const platex = Math.round(W * 0.44), sy = (Hh / 2 - 26) / 45, zk = W * 0.34 / 500, Px = platex - z0 * zk, Py = cy - yo * sy, HALF = 15;
        geo = { Px, Py, platex, sy, zk, cy };
        const dist = y => Math.hypot(z0, y - yo), sinPsi = y => (y - yo) / dist(y);
        const dL = y => V.dl + dist(y) - dist(0) + y * Math.sin(rho);               // mm: path difference between the two beams
        const Lc = Df.coherenceLength(nm, dnm) * 1e3;                               // mm
        const vis = y => Math.abs(sinc(PI * dL(y) / Lc));
        const period = y => lamUm / Math.max(1e-9, Math.abs(sinPsi(y) + Math.sin(rho)));
        const Y = y => cy - y * sy, ys = [-12, -6, 0, 6, 12];
        // the film
        c.fillStyle = S.glass(0.55); c.fillRect(platex - 3, Y(HALF), 6, 2 * HALF * sy); c.strokeStyle = S.edge(); c.lineWidth = 1.2; c.strokeRect(platex - 3, Y(HALF), 6, 2 * HALF * sy);
        kit.label(c, 'film', platex, Y(HALF) - 10, { align: 'center', color: C.muted, size: 11.5 });
        // the object point and the reference
        kit.dot(c, Px, Py, 6, C.accent, C.text); kit.label(c, 'object point  (drag)', Px, Py + 20, { align: 'center', color: C.accent, size: 11 });
        const Lr = Math.min(W * 0.34, (cy - 22) / Math.max(0.25, Math.sin(rho)));
        for (const y of ys) S.ray(c, [[platex - Lr * Math.cos(rho), Y(y) - Lr * Math.sin(rho)], [platex, Y(y)]], { nm, width: 1.3, arrows: true, minArrow: 60, alpha: V.play ? 0.55 : 0.9 });
        kit.label(c, 'reference beam', platex - Lr * Math.cos(rho) * 0.5 - 4, Y(0) - Lr * Math.sin(rho) * 0.5 - 12, { align: 'right', color: C.muted, size: 11.5 });
        if (!V.play) {
          for (const y of ys) S.ray(c, [[Px, Py], [platex, Y(y)]], { nm, width: 1, arrows: false, alpha: 0.75 });
          S.wavefronts(c, Px, Py, 14, 20, Math.max(2, Math.floor(z0 * zk / 20)), -0.5, 0.5, { nm, alpha: 0.5 });
          kit.label(c, 'object wave', (Px + platex) / 2, Py - 14, { align: 'center', color: C.muted, size: 11.5 });
        } else {
          const Lo = W * 0.2;
          for (const y of ys) {
            const psi = Math.atan2(y - yo, z0), sb = -(2 * Math.sin(rho) + Math.sin(psi));
            S.ray(c, [[platex, Y(y)], [platex + Lo * Math.cos(rho), Y(y) + Lo * Math.sin(rho)]], { nm, width: 1, arrows: false, alpha: 0.35 });            // zero order
            S.ray(c, [[platex, Y(y)], [platex + Lo * Math.cos(psi), Y(y) - Lo * Math.sin(psi)]], { nm, width: 1.6, arrows: false });                          // the object wave: virtual image
            S.ray(c, [[platex, Y(y)], [Px, Py]], { color: C.faint, width: 1, dash: [4, 4], arrows: false });
            if (Math.abs(sb) < 0.98) { const cb = Math.sqrt(1 - sb * sb); S.ray(c, [[platex, Y(y)], [platex + Lo * cb, Y(y) - Lo * sb]], { nm, width: 1, arrows: false, alpha: 0.45, dash: [2, 3] }); }   // the conjugate wave: real image
          }
          S.eye(c, platex + Lo + 34, cy - (platex + Lo + 34 - platex) * 0.0, 11, { dir: -1 });
          kit.label(c, 'reference: zero order', platex + Lo * Math.cos(rho), Y(12) + Lo * Math.sin(rho) + 12, { align: 'center', color: C.muted, size: 10.5 });
          kit.label(c, 'virtual image: the object wave', platex + Lo * 0.55, Y(-14) - 8, { align: 'center', color: C.text, size: 11 });
          kit.label(c, 'dotted: conjugate (real image)', platex + Lo * 0.4, Hh - 10, { align: 'center', color: C.muted, size: 10.5 });
        }
        // three windows on the film: the fringes
        const wx = Math.round(W * 0.8), ww = Math.round(W * 0.17), wh = Math.min(48, Hh * 0.12), rows = [[12, 'top'], [0, 'centre'], [-12, 'bottom']];
        rows.forEach(([y, nmv], i) => {
          const wy = Math.round(Hh * 0.14 + i * Hh * 0.28), P = period(y), v = vis(y), ph0 = (2 * PI * ((dL(y) * 1e3 / lamUm) % 1));
          S.fringes(c, wx, wy, ww, wh, u => 0.5 * (1 + v * Math.cos(2 * PI * (u * 6 - 3) / P + ph0)), { nm, gamma: 1, vertical: false, step: 0.6 });
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(wx, wy, ww, wh);
          kit.label(c, nmv + ' · ' + fmt(P, 3) + ' µm', wx + ww, wy - 8, { align: 'right', color: C.muted, size: 10.5 });
          c.strokeStyle = C.faint; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(platex + 3, Y(y)); c.lineTo(wx - 4, wy + wh / 2); c.stroke(); c.setLineDash([]);
        });
        kit.label(c, 'a patch 6 µm wide, magnified', wx + ww / 2, Hh - 8, { align: 'center', color: C.faint, size: 10.5 });
        // read-outs
        const tri = f => [12, 0, -12].map(y => f(y));
        ro.set('per', tri(period).map(v => fmt(v, 3)).join(' · ') + ' µm');
        ro.set('lpm', fmt(1e3 / period(0), 3) + ' lines/mm');
        ro.set('Lc', len(Lc * 1e-3) + '  (λ²/Δλ)');
        ro.set('dL', tri(dL).map(v => fmt(v, 3)).join(' · ') + ' mm');
        ro.set('vis', tri(vis).map(v => (100 * v).toFixed(0) + ' %').join(' · '));
        const vmin = Math.min(...tri(vis));
        ro.set('ver', vmin > 0.7 ? 'a good hologram: the whole film records fringes' : vmin > 0.3 ? 'weak at the edges: the source is barely coherent enough' : 'only part of the film records fringes: not coherent enough');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the colours of a disc */
  Hyper.sim('df-disc', {
    title: 'The rainbow on a disc: a reflection grating with a track pitch',
    blurb: `A lamp lights a disc seen from the side. The disc's spiral track is a grating, so each colour leaves in its own direction: the coloured arcs are the first and higher orders, and the white ray is the mirror reflection (order 0). The eye can be dragged round the arc: it sees only the colour that the grating equation sends in its direction.

**Try this**
- Start with the **CD** and drag the eye along the arc: the colour you see changes with the angle. Violet is nearest the mirror direction, red is farthest.
- Switch to the **DVD**: its pitch is less than half as large, so the spectra fan out much more widely.
- Switch to the **Blu-ray**: its pitch (0.32 µm) is shorter than visible wavelengths, and the first orders disappear unless the lamp is low.
- Move the lamp to a grazing angle (80°): even the Blu-ray shows a spectrum.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Df = O.diff;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320, maxH: 470 });
      const DISCS = [['Compact disc (CD): track pitch 1.6 µm', 1.6], ['DVD: track pitch 0.74 µm', 0.74], ['Blu-ray disc: track pitch 0.32 µm', 0.32]];
      const ctl = kit.controls(box.side, [
        { id: 'p', type: 'select', label: 'Disc', options: DISCS, value: params.p || 1.6 },
        { id: 'al', label: 'Lamp: angle from the normal α', min: 5, max: 85, step: 1, value: params.al || 40, unit: '°' },
        { id: 'be', label: 'Eye: angle from the normal β (drag it)', min: -85, max: 85, step: 1, value: params.be != null ? params.be : 20, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Track pitch · tracks per mm'], ['m0', 'Mirror reflection (order 0)'], ['seen', 'Colours reaching the eye'], ['fan', 'First order: violet → red']]);
      let geo = { hx: 0, hy: 0, R: 1, ex: 0, ey: 0 };
      kit.drag(st, {
        hover: true,
        hit: p => Math.hypot(p.x - geo.ex, p.y - geo.ey) < 22 ? 'eye' : null,
        move: (w, p) => { ctl.set('be', clamp(Math.round(Math.atan2(p.x - geo.hx, geo.hy - p.y) * R2D), -85, 85)); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const d = V.p * 1e-6, al = V.al * D2R, be = V.be * D2R, hx = W / 2, hy = Hh * 0.76, R = Math.min(hy - 62, W * 0.4);
        // the disc, edge-on, with a few tracks
        c.fillStyle = C.dark ? '#39405f' : '#aab2cc'; c.fillRect(hx - W * 0.42, hy, W * 0.84, 10); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(hx - W * 0.42, hy, W * 0.84, 10);
        c.beginPath(); for (let x = hx - 40; x <= hx + 40; x += 6) { c.moveTo(x, hy); c.lineTo(x, hy - 3); } c.stroke();
        kit.label(c, 'disc (tracks drawn far too coarse)', hx, hy + 24, { align: 'center', color: C.muted, size: 11 });
        S.normal(c, hx, hy, Math.PI / 2, R + 10);
        // the lamp and the incident beam
        const lx = hx - R * Math.sin(al), ly = hy - R * Math.cos(al);
        S.ray(c, [[lx, ly], [hx, hy]], { color: C.text, width: 3, arrows: true });
        S.source(c, lx, ly, { kind: 'bulb', size: 12, color: C.warn });
        S.ray(c, [[hx, hy], [hx + R * Math.sin(al), hy - R * Math.cos(al)]], { color: C.text, width: 1.6, alpha: 0.6, arrows: false });
        kit.label(c, 'order 0', hx + (R + 10) * Math.sin(al), hy - (R + 10) * Math.cos(al), { align: 'center', color: C.muted, size: 11 });
        // the spectra of the orders, as coloured arcs: sin β = sin α − mλ/d
        const bAt = (m, nm) => { const s = Math.sin(al) - m * nm * 1e-9 / d; return Math.abs(s) <= 1 ? Math.asin(s) : NaN; };
        for (let m = -4; m <= 4; m++) {
          if (!m) continue;
          let prev = NaN, mid = NaN;
          for (let nm = 400; nm <= 700; nm += 5) {
            const b = bAt(m, nm); if (nm === 550) mid = b;
            if (!Number.isNaN(b) && !Number.isNaN(prev)) { c.strokeStyle = S.nm(nm); c.lineWidth = 8; c.beginPath(); c.arc(hx, hy, R, prev - PI / 2, b - PI / 2, b < prev); c.stroke(); }
            prev = b;
          }
          const lab = !Number.isNaN(mid) ? mid : bAt(m, 400);
          if (!Number.isNaN(lab)) kit.label(c, (m > 0 ? '+' : '') + m, hx + (R + 22) * Math.sin(lab), hy - (R + 22) * Math.cos(lab), { align: 'center', color: C.muted, size: 11 });
        }
        // the eye and what it sees
        const ex = hx + (R + 30) * Math.sin(be), ey = hy - (R + 30) * Math.cos(be); geo = { hx, hy, R, ex, ey };
        const seen = [];
        for (let m = -4; m <= 4; m++) { if (!m) continue; const lam = d * (Math.sin(al) - Math.sin(be)) / m * 1e9; if (lam >= 380 && lam <= 780) seen.push({ m, lam }); }
        S.ray(c, [[hx, hy], [ex, ey]], seen.length ? { nm: seen[0].lam, width: 2.2, arrows: false } : { color: C.faint, width: 1, dash: [4, 4], arrows: false });
        S.eye(c, ex, ey, 11, { dir: ex < hx ? 1 : -1 });
        kit.label(c, 'eye (drag)', ex, ey - 20, { align: 'center', color: C.accent, size: 11 });
        // the read-outs
        ro.set('p', fmt(V.p) + ' µm  ·  ' + fmt(1e3 / V.p) + ' per mm');
        ro.set('m0', V.al + '° on the other side of the normal');
        ro.set('seen', seen.length ? seen.map(s => 'order ' + (s.m > 0 ? '+' : '') + s.m + ': ' + fmt(s.lam, 3) + ' nm (' + O.colourName(s.lam) + ')').join(' · ') : 'no visible colour at this angle');
        const b4 = bAt(1, 400), b7 = bAt(1, 700);
        ro.set('fan', Number.isNaN(b4) ? 'no first order at this angle' : fmt(b4 * R2D) + '° → ' + (Number.isNaN(b7) ? 'red does not reach' : fmt(b7 * R2D) + '°'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ diffraction spikes */
  Hyper.sim('df-spikes', {
    title: 'Diffraction spikes: iris blades and spider vanes',
    blurb: `The image of a bright point (a star, a street lamp) made by a lens or telescope whose opening has the shape shown at the top left. Each straight edge sends a spike at right angles to itself; the picture is on a logarithmic brightness scale so that the faint spikes show. It is computed as the Fourier transform of the aperture.

**Try this**
- A polygon with an **odd** number of blades (5, 7): twice as many spikes as blades. An **even** number (6, 8): as many spikes as blades, because opposite edges give the same spike.
- Slide **roundness** to the right: the blades become circular arcs and the spikes fade into the Airy rings.
- Choose the **telescope with a four-vane spider**: four spikes. With a **three-vane spider**: six spikes, as in many reflector photographs.
- Reduce the brightness range to 2 decades: only the brightest spikes survive.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300, maxH: 440 });
      const N = 256, h = N / 2, fft = getFFT(N), re = new Float64Array(N * N), im = new Float64Array(N * N), mask = new Float64Array(N * N), shown = new Float64Array(150 * 150), inten = new Float64Array(150 * 150);
      let key = '', peak = 1, skey = '';
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Aperture', options: [['An iris with straight blades', 'poly'], ['A telescope with a 4-vane spider', 'sp4'], ['A telescope with a 3-vane spider', 'sp3'], ['A plain circle', 'circle']], value: params.shape || 'poly' },
        { id: 'n', label: 'Number of blades', min: 3, max: 12, step: 1, value: params.n || 7 },
        { id: 'round', label: 'Roundness of the blades', min: 0, max: 1, step: 0.05, value: params.round || 0 },
        { id: 'dec', label: 'Brightness range shown', min: 2, max: 6, step: 0.5, value: params.dec || 4, unit: 'decades' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['spk', 'Spikes you should see'], ['why', 'Why'], ['ang', 'Direction of each spike']]);
      function vis() { ctl.show('n', V.shape === 'poly'); ctl.show('round', V.shape === 'poly'); }
      vis();
      const A = 22;                                          // apothem of the polygon, in cells; the circle has radius 24
      const inside = (x, y) => {
        const sh = V.shape, n = Math.round(V.n);
        if (sh === 'circle') return x * x + y * y <= 576 ? 1 : 0;
        if (sh === 'poly') {
          for (let k = 0; k < n; k++) { const a = PI / 2 + TAU * k / n; if (x * Math.cos(a) + y * Math.sin(a) > A) return 0; }
          const circ = A / Math.cos(PI / n), Rc = circ - V.round * (circ - A);
          return x * x + y * y <= Rc * Rc ? 1 : 0;
        }
        if (x * x + y * y > 576 || x * x + y * y < 100) return 0;                    // the secondary mirror blocks the centre
        const vanes = sh === 'sp4' ? [0, 90, 180, 270] : [90, 210, 330];
        for (const v of vanes) { const a = v * D2R, along = x * Math.cos(a) + y * Math.sin(a), across = -x * Math.sin(a) + y * Math.cos(a); if (along > 0 && Math.abs(across) <= 1) return 0; }
        return 1;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, nn = 150;
        const k0 = [V.shape, V.n, V.round].join('|');
        if (k0 !== key) {
          key = k0; let sum = 0;
          for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
            const x = i - h, y = j - h; let v = 0;
            for (const [dx, dy] of [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]]) v += inside(x + dx, y + dy);
            v /= 4; mask[j * N + i] = v; re[j * N + i] = v; im[j * N + i] = 0; sum += v;
          }
          fft(re, im); peak = Math.max(1e-9, sum * sum);
          for (let j = 0; j < nn; j++) for (let i = 0; i < nn; i++) {
            const kx = Math.round((i + 0.5) / nn * 2 * 80 - 80), ky = Math.round((j + 0.5) / nn * 2 * 80 - 80), idx = ((ky + N) % N) * N + ((kx + N) % N);
            inten[j * nn + i] = (re[idx] * re[idx] + im[idx] * im[idx]) / peak;
          }
        }
        if (skey !== key + '|' + V.dec) { skey = key + '|' + V.dec; for (let k = 0; k < nn * nn; k++) shown[k] = clamp((Math.log10(inten[k] + 1e-12) + V.dec) / V.dec, 0, 1); }
        const side = Math.min(Hh - 36, W * 0.62), x1 = W - side - 12, y1 = 10, ins = Math.min(Hh * 0.34, W * 0.2), x0 = 12;
        c.fillStyle = '#000'; c.fillRect(x1, y1, side, side);
        paint(c, 'sp-img', x1, y1, side, side, nn, nn, (i, j) => shown[j * nn + i], { rgb: [255, 246, 220] }, key + '|' + V.dec);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x1, y1, side, side);
        kit.label(c, 'image of a point (log brightness, ±15 λ/D)', x1 + side / 2, y1 + side + 11, { align: 'center', color: C.muted, size: 11 });
        c.fillStyle = '#000'; c.fillRect(x0, y1, ins, ins);
        paint(c, 'sp-ap', x0, y1, ins, ins, 64, 64, (i, j) => mask[(h - 32 + j) * N + (h - 32 + i)], { rgb: [230, 235, 255] }, key);
        c.strokeStyle = C.axis; c.strokeRect(x0, y1, ins, ins);
        kit.label(c, 'the aperture', x0 + ins / 2, y1 + ins + 11, { align: 'center', color: C.muted, size: 11 });
        const n = Math.round(V.n);
        const count = V.shape === 'poly' ? (V.round > 0.95 ? 0 : n % 2 ? 2 * n : n) : V.shape === 'sp4' ? 4 : V.shape === 'sp3' ? 6 : 0;
        ro.set('spk', count ? count + (V.shape === 'poly' && V.round > 0.2 ? '  (weaker as the blades round off)' : '') : 'none: only the Airy rings');
        ro.set('why', V.shape === 'poly' ? (n % 2 ? n + ' blades: odd, so each edge makes its own spike in both directions: 2 × ' + n : n + ' blades: even, opposite edges are parallel and share a spike') : V.shape === 'sp4' ? 'four vanes: two crossed lines of edges, two spikes each' : V.shape === 'sp3' ? 'three vanes at 120°: each vane edge pair makes a line, giving six spikes' : 'a circle has no straight edge');
        ro.set('ang', 'at right angles to the straight edges that cause them');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
