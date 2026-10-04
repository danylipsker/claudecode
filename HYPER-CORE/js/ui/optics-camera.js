/* HYPER-CORE · ui/optics-camera.js — Tools → Camera & lens (#/tools/camera/<fov|dof|sensor|mounts|exposure|mtf>)
 *
 *   fov       the angle of view and the width of the scene from focal length, sensor and distance; the lens you
 *             need; optical zoom against digital zoom
 *   dof       depth of field, the hyperfocal distance, blur against distance, depth of focus, the Airy disc
 *   sensor    sensor formats to scale, pixels and data rates, photons and noise, rolling shutter
 *   mounts    flange focal distances to scale, a cross-section of each mount, an adapter checker
 *   exposure  exposure value and the scene it suits, equivalent exposures, motion blur, the exposure triangle
 *   mtf       lens, pixel, defocus and motion MTF multiplied together; Nyquist; a bar target as the chain renders it
 *
 * The numbers come from kit.optics (O.cam, O.mtf, O.diff), the drawing helpers from kit.osym. Everything the reader
 * touches goes through kit.controls, so the headless test (tools/labtest.js) can drive it.
 */
(function () {
  'use strict';
  const H = window.Hyper, ui = H.ui, U = H.util, esc = U.esc, K = H.kit, O = H.optics, S = H.osym;
  const T = H.opticsTools = H.opticsTools || {};
  const TABS = [['fov', 'Field of view'], ['dof', 'Depth of field'], ['sensor', 'Sensors and pixels'], ['mounts', 'Lens mounts'], ['exposure', 'Exposure'], ['mtf', 'MTF and sampling']];
  T.camera = function (el, params, sub) {
    const t = T.util.subtabs(el, 'camera', TABS, sub, 'Everything here uses the thin-lens, small-angle picture of a camera: a sound guide for choosing and understanding a lens, but not a replacement for the maker\'s datasheet.');
    ({ fov, dof, sensor, mounts, exposure, mtf })[t.tab](t.body);
  };
  T.camera.tabs = TABS.map(t => t[0]);

  /* ---------------------------------------------------------------- small helpers shared by the six pages */
  const R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const num = (x, s) => U.fmt(x, s || 3);
  const fx = (x, d) => Number.isFinite(x) ? x.toFixed(d == null ? 1 : d) : '—';
  /* lengths: millimetres in, a friendly string out ("∞" for an unbounded one) */
  const lenMm = mm => !Number.isFinite(mm) ? '∞' : Math.abs(mm) >= 1e6 ? num(mm / 1e6) + ' km' : Math.abs(mm) >= 1000 ? num(mm / 1000) + ' m' : Math.abs(mm) >= 1 || mm === 0 ? num(mm) + ' mm' : num(mm * 1000) + ' µm';
  const lenM = m => lenMm(m * 1000);
  const angleStr = r => { const d = r * R2D; return !Number.isFinite(d) ? '—' : (d < 1 ? num(d, 2) : d < 10 ? d.toFixed(2) : d.toFixed(1)) + '°'; };
  const magStr = m => !(m > 0) ? '—' : m >= 1 ? num(m, 3) + ' : 1' : '1 : ' + num(1 / m, 3);
  const STOPS = O.cam.STOPS.concat([45, 64]);                              // the full-stop series of f-numbers
  const stopOpts = () => STOPS.map(n => ['f/' + n, n]);
  const AREA = O.cam.SENSORS.filter(s => s.h >= 0.5), FF = O.cam.sensor('Full frame'), FF_AREA = FF.w * FF.h;                      // the area sensors (the line-scan formats are one row)
  const sensOpts = list => list.map(s => [s.id + ' · ' + s.w + ' × ' + s.h + ' mm', s.id]);
  const cocOf = id => +clamp(O.cam.coc(O.cam.sensor(id).diag) * 1000, 1, 100).toFixed(1);   // µm
  const lab = (el, intro, aspect, opts) => T.util.lab(el, intro, aspect, opts);
  const col = () => K.colors();
  const line = (c, x1, y1, x2, y2, color, w, dash) => { c.save(); c.strokeStyle = color; c.lineWidth = w || 1; if (dash) c.setLineDash(dash); c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.restore(); };
  const text = (c, s, x, y, o) => K.label(c, s, x, y, Object.assign({ size: 12, color: col().muted }, o || {}));
  const rrect = (c, x, y, w, h, r) => { w = Math.max(0, w); h = Math.max(0, h); r = Math.max(0, Math.min(r, w / 2, h / 2)); c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const disc = (c, x, y, r, color, alpha) => { c.save(); if (alpha != null) c.globalAlpha = alpha; c.fillStyle = color; c.beginPath(); c.arc(x, y, Math.max(0, r), 0, TAU); c.fill(); c.restore(); };
  /* log-spaced tick values at 1, 2, 5 × 10^k (only 1 × 10^k over a wide range) */
  function logTicks(lo, hi) {
    const out = [], mult = Math.log10(hi / lo) < 2.6 ? [1, 2, 5] : [1];
    for (let e = Math.floor(Math.log10(lo)); e <= Math.ceil(Math.log10(hi)); e++) for (const m of mult) { const v = m * Math.pow(10, e); if (v >= lo * 0.999 && v <= hi * 1.001) out.push(v); }
    if (out.length < 3) {                                                  // a narrow range: ordinary round numbers instead
      const st = H.niceStep(hi - lo, 4); out.length = 0;
      for (let v = Math.ceil(lo / st) * st; v <= hi * 1.0001; v += st) out.push(+v.toPrecision(8));
    }
    return out;
  }

  /* ================================================================ field of view */
  const STD_F = [4, 6, 8, 12, 16, 25, 35, 50, 75, 100];                    // the usual focal lengths of C-mount lenses, mm
  /* things of known size, drawn to scale inside the scene: draw(c, left, baseline, width, height, colours) in pixels */
  const OBJECTS = [
    { id: 'card', name: 'a credit card, 86 mm wide', w: 0.0856, h: 0.054, draw(c, x, yb, w, h, C) {
      c.fillStyle = C.accent; rrect(c, x, yb - h, w, h, h * 0.1); c.fill();
      c.fillStyle = 'rgba(0,0,0,.5)'; c.fillRect(x, yb - h * 0.86, w, h * 0.18);
      c.fillStyle = C.warn; c.fillRect(x + w * 0.08, yb - h * 0.52, w * 0.16, h * 0.22); } },
    { id: 'sheet', name: 'an A4 sheet, 210 × 297 mm', w: 0.21, h: 0.297, draw(c, x, yb, w, h) {
      c.fillStyle = '#f3f3ee'; c.fillRect(x, yb - h, w, h); c.fillStyle = 'rgba(80,90,120,.55)';
      for (let i = 0; i < 9; i++) c.fillRect(x + w * 0.12, yb - h * (0.88 - i * 0.09), w * (i % 4 === 3 ? 0.45 : 0.76), h * 0.02); } },
    { id: 'person', name: 'a person, 1.75 m tall', w: 0.5, h: 1.75, draw(c, x, yb, w, h, C) {
      c.fillStyle = C.text; c.beginPath(); c.arc(x + w / 2, yb - h * 0.93, h * 0.065, 0, TAU); c.fill();
      rrect(c, x + w * 0.1, yb - h * 0.85, w * 0.8, h * 0.4, w * 0.2); c.fill();
      c.fillRect(x + w * 0.2, yb - h * 0.46, w * 0.25, h * 0.46); c.fillRect(x + w * 0.55, yb - h * 0.46, w * 0.25, h * 0.46); } },
    { id: 'car', name: 'a car, 4.5 m long', w: 4.5, h: 1.45, draw(c, x, yb, w, h, C) {
      c.fillStyle = C.series[1]; rrect(c, x, yb - h * 0.62, w, h * 0.5, h * 0.12); c.fill();
      c.beginPath(); c.moveTo(x + w * 0.2, yb - h * 0.6); c.lineTo(x + w * 0.3, yb - h); c.lineTo(x + w * 0.68, yb - h); c.lineTo(x + w * 0.82, yb - h * 0.6); c.closePath(); c.fill();
      c.fillStyle = C.bg2; c.beginPath(); c.moveTo(x + w * 0.27, yb - h * 0.6); c.lineTo(x + w * 0.34, yb - h * 0.92); c.lineTo(x + w * 0.49, yb - h * 0.92); c.lineTo(x + w * 0.49, yb - h * 0.6); c.closePath(); c.moveTo(x + w * 0.53, yb - h * 0.6); c.lineTo(x + w * 0.53, yb - h * 0.92); c.lineTo(x + w * 0.65, yb - h * 0.92); c.lineTo(x + w * 0.75, yb - h * 0.6); c.closePath(); c.fill();
      for (const u of [0.22, 0.78]) { disc(c, x + w * u, yb - h * 0.2, h * 0.2, C.text); disc(c, x + w * u, yb - h * 0.2, h * 0.09, C.bg2); } } },
    { id: 'bus', name: 'a bus, 12 m long', w: 12, h: 3.2, draw(c, x, yb, w, h, C) {
      c.fillStyle = C.series[4]; rrect(c, x, yb - h * 0.88, w, h * 0.78, h * 0.08); c.fill(); c.fillStyle = C.bg2;
      for (let i = 0; i < 7; i++) c.fillRect(x + w * (0.05 + i * 0.13), yb - h * 0.75, w * 0.09, h * 0.3);
      for (const u of [0.2, 0.8]) { disc(c, x + w * u, yb - h * 0.12, h * 0.12, C.text); } } },
    { id: 'building', name: 'a tower block, 20 × 45 m', w: 20, h: 45, draw(c, x, yb, w, h, C) {
      c.fillStyle = C.faint; c.fillRect(x, yb - h, w, h); c.fillStyle = C.bg2;
      for (let i = 0; i < 5; i++) for (let j = 0; j < 14; j++) c.fillRect(x + w * (0.1 + i * 0.17), yb - h * (0.95 - j * 0.065), w * 0.11, h * 0.035); } }
  ];
  /* the object for scale: the chosen one, or the one about half as tall as the scene */
  function pickObject(pref, Hm) {
    if (pref !== 'auto') return OBJECTS.find(o => o.id === pref) || OBJECTS[0];
    let best = OBJECTS[0], bd = Infinity;
    for (const o of OBJECTS) { const d = Math.abs(Math.log(o.h / (0.5 * Math.max(Hm, 1e-9)))); if (d < bd) { bd = d; best = o; } }
    return best;
  }
  /* the camera and its cone of view, seen from above: the angle is true, the distances are labelled, not scaled */
  function topView(c, C, x0, y0, w, h, fv, dmm, extras) {
    const cy = y0 + h / 2 - 8, ax = x0 + 62, half = clamp(fv.h / 2, 0.002, Math.min(1.45, Math.atan((h / 2 - 54) / 40)));
    const D = Math.max(40, Math.min(x0 + w - 36 - ax, (h / 2 - 54) / Math.tan(half))), ey = D * Math.tan(half);
    text(c, 'Seen from above', x0 + 14, y0 + 18, { color: C.text, weight: 650 });
    c.save(); c.fillStyle = C.hue(215, 0.16); c.beginPath(); c.moveTo(ax, cy); c.lineTo(ax + D, cy - ey); c.lineTo(ax + D, cy + ey); c.closePath(); c.fill(); c.restore();
    line(c, ax, cy, ax + D, cy - ey, C.accent, 1.6); line(c, ax, cy, ax + D, cy + ey, C.accent, 1.6);
    S.axis(c, ax, cy, ax + D);
    for (const [fe, color, name] of extras || []) {
      const ye = Math.min(D * Math.tan(clamp(fe.h / 2, 0.002, 1.45)), h / 2 - 44);
      line(c, ax, cy, ax + D, cy - ye, color, 1.4, [6, 4]); line(c, ax, cy, ax + D, cy + ye, color, 1.4, [6, 4]);
      text(c, name, ax + D - 6, cy + ye + 12, { align: 'right', color, size: 11 });
    }
    line(c, ax + D, cy - ey, ax + D, cy + ey, C.text, 2.4);
    c.save(); c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.3;
    rrect(c, ax - 56, cy - 15, 38, 30, 4); c.fill(); c.stroke();
    c.beginPath(); c.rect(ax - 18, cy - 9, 18, 18); c.fill(); c.stroke(); c.restore();
    text(c, 'camera', ax - 37, cy + 29, { align: 'center' });
    S.angle(c, ax, cy, 38, -half, half, '');
    text(c, angleStr(fv.h), ax + 46, cy, { color: C.text, bg: C.bg2, weight: 600 });
    const yb = Math.min(cy + ey + 26, y0 + h - 30);
    S.dim(c, ax, yb, ax + D, yb, 'distance ' + lenMm(dmm), { off: 13 });
    text(c, 'scene ' + lenMm(fv.W) + ' wide', ax + D, cy - ey - 12, { align: 'center', color: C.text });
  }
  /* the scene as the camera frames it, in the true proportions of the sensor, with something of known size in it */
  function sceneView(c, C, x0, y0, w, h, Wm, Hm, obj, title) {
    Wm = Math.max(Wm, 1e-9); Hm = Math.max(Hm, 1e-9);
    const pad = 30, k = Math.max(1e-9, Math.min((w - 2 * pad) / Wm, (h - 2 * pad - 14) / Hm));
    const fw = Wm * k, fh = Hm * k, fx0 = x0 + (w - fw) / 2, fy0 = y0 + (h - fh) / 2 - 4;
    c.save(); c.fillStyle = C.surface; c.fillRect(fx0, fy0, fw, fh);
    c.beginPath(); c.rect(fx0, fy0, fw, fh); c.clip();
    const base = fy0 + fh * 0.94;
    line(c, fx0, base, fx0 + fw, base, C.grid, 1);
    if (obj) obj.draw(c, fx0 + (fw - obj.w * k) / 2, base, obj.w * k, obj.h * k, C);
    c.restore();
    c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(fx0, fy0, fw, fh);
    text(c, title, x0 + 14, y0 + 18, { color: C.text, weight: 650 });
    S.dim(c, fx0, fy0 + fh + 14, fx0 + fw, fy0 + fh + 14, lenMm(Wm * 1000) + ' wide × ' + lenMm(Hm * 1000) + ' high', { off: 12 });
    if (obj) text(c, obj.name + ', to scale', fx0 + fw / 2, fy0 - 10, { align: 'center' });
  }
  /* a made-up picture for the zoom demonstration: brightness 0…1 at (u, v) in 0…1, with fine detail at every scale */
  function testPic(u, v) {
    let b = 0.14 + 0.16 * (1 - v);
    const r = Math.hypot(u - 0.5, (v - 0.5) * 0.8);
    if (r < 0.21) b = Math.floor(r / 0.03) % 2 ? 0.96 : 0.08;                                       // a bullseye
    if (Math.abs(u - 0.5) < 0.004 || Math.abs(v - 0.5) < 0.005) b = r < 0.21 ? 0.5 : b;               // cross-hairs
    if (u > 0.04 && u < 0.34 && v > 0.62 && v < 0.94) { const x = (u - 0.04) / 0.3; b = Math.sin(46 * x * x + 6 * x) > 0 ? 0.94 : 0.08; }   // bars that get finer
    if (u > 0.66 && Math.abs(v - (0.1 + 0.28 * (u - 0.66) / 0.3)) < 0.007) b = 0.9;               // a thin sloping line
    return b;
  }
  /* testPic as nx × ny pixels over the window [u0, v0, u1, v1]: every pixel averages what falls on it, as a sensor does */
  function pixelPic(c, x, y, w, h, nx, ny, win) {
    const cw = (win[2] - win[0]) / nx, ch = (win[3] - win[1]) / ny;
    S.cells(c, x, y, w, h, nx, ny, (u, v) => {
      const uc = win[0] + u * (win[2] - win[0]), vc = win[1] + v * (win[3] - win[1]); let sum = 0;
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) sum += testPic(uc + i * cw / 3, vc + j * ch / 3);
      return sum / 9;
    });
  }

  function fov(el) {
    const L = lab(el, 'Choose a focal length, a sensor and a distance and see what the camera takes in: the angles of view, the width of the scene, and how much of it falls on each pixel. The other two views turn the question round (which lens do I need?) and compare optical zoom with digital zoom.', 0.52);
    const ctl = K.controls(L.side, [
      { id: 'mode', type: 'select', label: 'What do you want to know?', options: [['What does this lens see?', 'view'], ['Which lens do I need?', 'need'], ['Optical zoom or digital zoom?', 'zoom']], value: 'view' },
      { id: 'sensor', type: 'select', label: 'Sensor format', options: sensOpts(AREA), value: 'Full frame' },
      { id: 'f', label: 'Focal length', min: 2, max: 800, value: 50, log: true, fmt: v => num(v, 3) + ' mm' },
      { id: 'sw', label: 'Width of scene to cover', min: 0.01, max: 500, value: 4, log: true, fmt: lenM },
      { id: 'dist', label: 'Distance to the scene', min: 0.05, max: 2000, value: 5, log: true, fmt: lenM },
      { id: 'z', label: 'Zoom factor', min: 1, max: 20, value: 3, log: true, fmt: v => '× ' + num(v, 2) },
      { id: 'pix', label: 'Pixels across the sensor', min: 320, max: 12000, value: 4000, log: true, fmt: v => Math.round(v) + ' pixels' },
      { id: 'obj', type: 'select', label: 'Object for scale', options: [['Chosen to suit the scene', 'auto']].concat(OBJECTS.map(o => [o.name, o.id])), value: 'auto' }
    ], () => { rows(); draw(); });
    const V = ctl.values;
    const roV = K.readout(L.side, [['h', 'Horizontal angle'], ['v', 'Vertical angle'], ['d', 'Diagonal angle'], ['W', 'Scene width'], ['Hh', 'Scene height'], ['m', 'Magnification'], ['eq', 'Full-frame equivalent'], ['mmpx', 'Scene per pixel'], ['px1', 'Pixels on a 1 mm feature']]);
    const roN = K.readout(L.side, [['f', 'Focal length needed'], ['h', 'Horizontal angle needed'], ['std', 'Nearest standard lens'], ['stdw', 'It sees a width of'], ['cover', 'Longest standard lens that covers it'], ['coverw', 'It sees a width of'], ['mmpx', 'Scene per pixel (exact lens)']]);
    const roZ = K.readout(L.side, [['of', 'Optical: focal length'], ['ow', 'Scene width: wide → zoomed'], ['opx', 'Optical: pixels on the zoomed view'], ['dpx', 'Digital: pixels really used'], ['dmp', 'Digital: megapixels used'], ['res', 'Scene per pixel: optical · digital']]);
    function rows() {
      const m = V.mode;
      ctl.show('f', m !== 'need'); ctl.show('sw', m === 'need'); ctl.show('z', m === 'zoom'); ctl.show('obj', m !== 'zoom');
      roV.show(m === 'view'); roN.show(m === 'need'); roZ.show(m === 'zoom');
    }
    function draw() {
      const c = L.st.begin(), C = col(), W = L.st.W, Hh = L.st.H, s = O.cam.sensor(V.sensor), mode = V.mode;
      const f = mode === 'need' ? O.cam.focalFor(s.w, V.sw * 1000, V.dist * 1000) : V.f;
      const dmm = mode === 'need' ? V.dist * 1000 : Math.max(V.dist * 1000, 2 * f);   // lenses focus no nearer than life size (1 : 1)
      const fv = O.cam.fov({ f, sensor: s, distance: dmm });
      const Nx = Math.round(V.pix), Ny = Math.max(1, Math.round(V.pix * s.h / s.w)), perPx = fv.W / Nx;
      let near = STD_F[0]; for (const x of STD_F) if (Math.abs(Math.log(x / f)) < Math.abs(Math.log(near / f))) near = x;
      const longest = STD_F.filter(x => x <= f).pop(), stdFov = x => O.cam.fov({ f: x, sensor: s, distance: Math.max(V.dist * 1000, 2 * x) });
      if (mode === 'zoom') drawZoom(c, C, W, Hh, s, f, fv, Nx, Ny);
      else {
        const pw = Math.round(W * 0.5), extras = mode !== 'need' ? [] : [[stdFov(near), C.warn, near + ' mm lens']].concat(longest && longest !== near ? [[stdFov(longest), C.ok, longest + ' mm lens']] : []);
        topView(c, C, 0, 0, pw, Hh, fv, dmm, extras);
        sceneView(c, C, pw, 0, W - pw, Hh, fv.W / 1000, fv.Hh / 1000, pickObject(V.obj, fv.Hh / 1000), 'What the camera sees');
        line(c, pw + 0.5, 10, pw + 0.5, Hh - 10, C.grid, 1);
      }
      if (mode === 'view') {
        roV.set('h', angleStr(fv.h)); roV.set('v', angleStr(fv.v)); roV.set('d', angleStr(fv.d));
        roV.set('W', lenMm(fv.W)); roV.set('Hh', lenMm(fv.Hh)); roV.set('m', magStr(fv.m));
        roV.set('eq', num(f * s.crop, 3) + ' mm (crop factor ' + num(s.crop, 3) + ')');
        roV.set('mmpx', lenMm(perPx)); roV.set('px1', num(O.cam.pixelsOnTarget(1, fv.W, Nx), 3) + ' pixels');
      } else if (mode === 'need') {
        const wOf = x => lenMm(stdFov(x).W);
        roN.set('f', num(f, 3) + ' mm'); roN.set('h', angleStr(fv.h));
        roN.set('std', near + ' mm'); roN.set('stdw', wOf(near));
        roN.set('cover', longest ? longest + ' mm' : 'none: wider than a 4 mm lens'); roN.set('coverw', longest ? wOf(longest) : '—');
        roN.set('mmpx', lenMm(perPx));
      } else {
        const fz = f * V.z, fvz = O.cam.fov({ f: fz, sensor: s, distance: Math.max(V.dist * 1000, 1.1 * fz) }), dz = O.cam.digitalZoom(Nx, Ny, V.z, f);
        roZ.set('of', num(f, 3) + ' mm → ' + num(fz, 3) + ' mm');
        roZ.set('ow', lenMm(fv.W) + ' → ' + lenMm(fvz.W));
        roZ.set('opx', Nx + ' × ' + Ny + ' = ' + num(Nx * Ny / 1e6, 3) + ' MP');
        roZ.set('dpx', dz.w + ' × ' + dz.h); roZ.set('dmp', num(dz.megapixels, 3) + ' MP of ' + num(Nx * Ny / 1e6, 3) + ' MP');
        roZ.set('res', lenMm(fvz.W / Nx) + ' · ' + lenMm(perPx));
      }
    }
    /* optical and digital zoom side by side: the same framing, very different pixels */
    function drawZoom(c, C, W, Hh, s, f, fv, Nx, Ny) {
      const a = s.w / s.h, z = V.z, pw = Math.round(W * 0.48), nx0 = 80, ny0 = Math.max(2, Math.round(nx0 / a));
      let fw = pw - 32, fh = fw / a; if (fh > Hh - 100) { fh = Hh - 100; fw = fh * a; }
      const x1 = 16 + (pw - 32 - fw) / 2, y1 = 50;
      text(c, 'The scene at ' + num(f, 3) + ' mm', x1, 13, { color: C.text, weight: 650 });
      pixelPic(c, x1, y1, fw, fh, nx0, ny0, [0, 0, 1, 1]);
      c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(x1, y1, fw, fh);
      const zw = fw / z, zh = fh / z;
      c.strokeStyle = C.warn; c.lineWidth = 2.4; c.strokeRect(x1 + (fw - zw) / 2, y1 + (fh - zh) / 2, zw, zh);
      text(c, 'the zoomed frame, × ' + num(z, 2), x1 + fw / 2, y1 + fh + 16, { align: 'center', color: C.warn });
      S.dim(c, x1, y1 - 8, x1 + fw, y1 - 8, lenMm(fv.W) + ' wide', { off: -10 });
      const rx = pw + 12, rw = W - rx - 14, ih = Math.max(20, (Hh - 112) / 2), iw = Math.min(rw, ih * a), nz = Math.max(2, Math.round(64 / z)), win = [0.5 - 0.5 / z, 0.5 - 0.5 / z, 0.5 + 0.5 / z, 0.5 + 0.5 / z];
      const ihh = iw / a, oy = 34, dy = oy + ihh + 56;
      text(c, 'Optical zoom: all the pixels on the smaller view', rx, oy - 16, { color: C.text, weight: 650 });
      pixelPic(c, rx, oy, iw, ihh, 64, Math.max(2, Math.round(64 / a)), win); c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(rx, oy, iw, ihh);
      text(c, 'every detail the lens resolves is recorded', rx, oy + ihh + 13);
      text(c, 'Digital zoom: a crop, enlarged', rx, dy - 16, { color: C.text, weight: 650 });
      pixelPic(c, rx, dy, iw, ihh, nz, Math.max(2, Math.round(nz / a)), win); c.strokeStyle = C.text; c.strokeRect(rx, dy, iw, ihh);
      text(c, 'only ' + Math.round(Nx / z) + ' × ' + Math.round(Ny / z) + ' pixels were behind it', rx, dy + ihh + 13);
      text(c, 'schematic: 64 pixels across', x1, Hh - 12, { color: C.faint, size: 11 });
    }
    K.drag(L.st, { hit: p => (V.mode === 'view' && p.x < L.st.W * 0.5) ? { x: p.x, f: V.f } : null, move: (t, p) => { ctl.set('f', clamp(t.f * Math.pow(1.6, (p.x - t.x) / 120), 2, 800)); draw(); }, hover: true });
    L.st.onResize(draw); T.util.onTheme(draw); rows(); draw();
    L.under.innerHTML = '<p class="small muted mt">Drag sideways over the drawing of the camera to change the focal length. The angles are those with the lens focused on the scene, so at very close range they are a little narrower than for a lens focused at infinity.</p>' + T.util.more(['field-of-view-and-focal-length', 'crop-factor-and-equivalent-focal-length', 'magnification-and-working-distance', 'optical-zoom', 'digital-zoom', 'choosing-a-machine-vision-lens', 'pixels-per-feature']);
  }
  /* ================================================================ depth of field */
  /* the blur circle on the sensor (mm) of a point at distance d when the lens is focused at s */
  const blurDia = (f, N, s, d) => f * f * Math.abs(d - s) / (N * (s - f) * d);

  function dof(el) {
    const L = lab(el, 'Focus on one distance and everything near it still looks sharp, until the blur of a point grows past what you are willing to accept. The green zone is that range of distances. Drag across the picture to move the focus; change the lens, the stop or the sensor and watch the zone widen and narrow.', 0.42);
    L.under.innerHTML = '<div class="dplot"></div><div class="dmore"></div>';
    const plot = K.plot(ui.$('.dplot', L.under), { x: { label: 'object distance (m)', log: true, min: 1, max: 10 }, y: { label: 'blur circle on the sensor (µm)', min: 0, max: 100 } }, 240);
    ui.$('.dmore', L.under).innerHTML = T.util.more(['depth-of-field', 'hyperfocal-distance', 'circle-of-confusion', 'depth-of-focus', 'the-f-number', 'aperture-and-f-stops', 'bokeh-and-out-of-focus-blur']);
    const ctl = K.controls(L.side, [
      { id: 'f', label: 'Focal length', min: 4, max: 800, value: 50, log: true, fmt: v => num(v, 3) + ' mm' },
      { id: 'N', type: 'select', label: 'f-number (full stops)', options: stopOpts(), value: 4 },
      { id: 's', label: 'Focus distance', min: 0.15, max: 1000, value: 3, log: true, fmt: lenM },
      { id: 'sensor', type: 'select', label: 'Sensor format', options: sensOpts(AREA), value: 'Full frame' },
      { id: 'c', label: 'Circle of confusion (the blur you accept)', min: 1, max: 100, value: cocOf('Full frame'), log: true, fmt: v => num(v, 3) + ' µm' },
      { type: 'buttons', items: [{ id: 'coc', label: 'Standard value for this sensor' }] }
    ], id => { if (id === 'sensor' || id === 'coc') ctl.set('c', cocOf(V.sensor)); draw(); });
    const V = ctl.values;
    const ro = K.readout(L.side, [['near', 'Near limit'], ['far', 'Far limit'], ['tot', 'Depth of field'], ['hyp', 'Hyperfocal distance'], ['hn', 'Focused there: sharp from'], ['m', 'Magnification at the focus'], ['dof', 'Depth of focus at the sensor'], ['airy', 'Airy disc (green light)'], ['lim', 'What limits sharpness']]);
    let freeze = null, map = null;                                         // the axis is held still while the focus is dragged
    function draw() {
      const c = L.st.begin(), C = col(), W = L.st.W, Hh = L.st.H;
      const f = V.f, N = V.N, cc = V.c / 1000, sm = Math.max(V.s * 1000, 2 * f), d = O.cam.dof({ f, N, s: sm, c: cc });
      const sM = sm / 1000, nearM = d.near / 1000, farM = d.far / 1000, HM = d.H / 1000;
      let lo, hi;
      if (Number.isFinite(farM)) { const mid = Math.sqrt(nearM * farM), span = Math.max(0.1, 3.2 * Math.log(farM / nearM)); lo = mid * Math.exp(-span / 2); hi = mid * Math.exp(span / 2); }
      else { lo = nearM / 3; hi = Math.max(HM * 5, sM * 12); }
      lo = Math.max(lo, 1.1 * f / 1000);
      if (freeze) { lo = freeze.lo; hi = freeze.hi; }
      hi = Math.max(hi, lo * 1.1);
      const x0 = 78, x1 = W - 26, axisY = Hh - 46, top = 62, yc = (top + axisY) / 2;
      const X = v => x0 + (Math.log(Math.max(v, 1e-9)) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)) * (x1 - x0), Xc = v => clamp(X(v), x0, x1);
      map = { x0, x1, lo, hi, axisY, X };
      // the zone of acceptable sharpness
      const zx0 = Xc(nearM), zx1 = Number.isFinite(farM) ? Xc(farM) : x1;
      c.fillStyle = C.hue(145, 0.2); c.fillRect(zx0, top, Math.max(0, zx1 - zx0), axisY - top);
      line(c, zx0, top, zx0, axisY, C.ok, 1.4); if (Number.isFinite(farM)) line(c, zx1, top, zx1, axisY, C.ok, 1.4);
      text(c, 'near ' + lenMm(d.near), zx0 - 4, 18, { align: 'right', color: C.ok });
      if (Number.isFinite(farM)) text(c, 'far ' + lenMm(d.far), zx1 + 4, 18, { color: C.ok });
      // the distance axis
      line(c, x0, axisY, x1, axisY, C.axis, 1.4);
      for (const v of logTicks(lo, hi)) { const x = X(v); line(c, x, axisY, x, axisY + 5, C.axis, 1); text(c, lenM(v), x, axisY + 17, { align: 'center', size: 11 }); }
      text(c, 'dots: a point of light at that distance, green while its blur is acceptable', x0, axisY + 36, { size: 11, color: C.faint });
      // the camera, and a row of points of light whose blur grows away from the focus
      c.save(); c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.3; rrect(c, 10, yc - 14, 36, 28, 4); c.fill(); c.stroke(); c.beginPath(); c.rect(46, yc - 8, 14, 16); c.fill(); c.stroke(); c.restore();
      for (let i = 0; i < 16; i++) {
        const dm = lo * Math.pow(hi / lo, (i + 0.5) / 16), ratio = blurDia(f, N, sm, dm * 1000) / cc, x = X(dm);
        if (ratio <= 1) disc(c, x, yc, 3.5, C.ok);
        else { disc(c, x, yc, clamp(3 + 4 * (ratio - 1), 3, 36), C.bad, 0.28); disc(c, x, yc, 2.5, C.bad); }
      }
      // the focus, and the hyperfocal distance
      line(c, X(sM), 44, X(sM), axisY, C.accent, 2.2); disc(c, X(sM), yc, 3.8, C.accent);
      text(c, 'focus ' + lenMm(sm), X(sM), 36, { align: 'center', color: C.accent, weight: 600 });
      if (HM >= lo && HM <= hi) { line(c, X(HM), 56, X(HM), axisY, C.warn, 1.4, [5, 4]); text(c, 'hyperfocal ' + lenMm(d.H), X(HM), 52, { align: 'center', color: C.warn }); }
      if (!Number.isFinite(farM)) text(c, 'sharp to infinity', x1 - 4, top + 14, { align: 'right', color: C.ok });
      if (V.s * 1000 < 2 * f) text(c, 'closest focus at this focal length (life size): ' + lenMm(sm), x0, top + 14, { color: C.warn });
      // blur circle against distance
      const ymax = 4 * V.c, pts = [], airy = 2 * O.diff.airyRadius(550, N) * 1e6;
      for (let i = 0; i <= 140; i++) { const dm = lo * Math.pow(hi / lo, i / 140); pts.push([dm, Math.min(blurDia(f, N, sm, dm * 1000) * 1000, ymax * 1.5)]); }
      pts.push([sM, 0]); pts.sort((p, q) => p[0] - q[0]);
      plot.set({
        x: { label: 'object distance (m)', log: hi / lo >= 4, min: lo, max: hi }, y: { label: 'blur circle on the sensor (µm)', min: 0, max: ymax },
        series: [{ pts, label: 'blur of a point at that distance', color: C.accent, width: 2.6 }],
        hlines: [{ y: V.c, label: 'blur you accept: ' + num(V.c, 3) + ' µm', color: C.ok }].concat(airy < ymax ? [{ y: airy, label: 'Airy disc: ' + num(airy, 3) + ' µm', color: C.warn }] : []),
        vlines: [{ x: nearM, label: 'near', color: C.ok }].concat(Number.isFinite(farM) ? [{ x: farM, label: 'far', color: C.ok }] : [], [{ x: sM, label: 'focus', color: C.accent }])
      });
      ro.set('near', lenMm(d.near)); ro.set('far', lenMm(d.far)); ro.set('tot', lenMm(d.total));
      ro.set('hyp', lenMm(d.H)); ro.set('hn', lenMm(d.H / 2) + ' to ∞'); ro.set('m', magStr(O.cam.magnification(f, sm)));
      ro.set('dof', lenMm(O.cam.depthOfFocus(N, cc))); ro.set('airy', num(airy, 3) + ' µm');
      ro.set('lim', airy > V.c ? 'diffraction: a perfect point is already blurrier than you accept' : airy > 0.5 * V.c ? 'both: diffraction uses up half the blur you accept' : 'the focus, not diffraction');
    }
    K.drag(L.st, {
      hit: p => map && p.x >= map.x0 - 10 && p.x <= map.x1 + 10 && p.y < map.axisY + 10 ? { lo: map.lo } : null,
      start: () => { freeze = { lo: map.lo, hi: map.hi }; },
      move: (t, p) => { const u = clamp((p.x - map.x0) / (map.x1 - map.x0), 0, 1); ctl.set('s', clamp(map.lo * Math.pow(map.hi / map.lo, u), 0.15, 1000)); draw(); },
      end: () => { freeze = null; draw(); }, hover: true
    });
    L.st.onResize(draw); T.util.onTheme(draw); draw();
  }
  /* ================================================================ sensors and pixels */
  const hash = (i, j, k) => { let h = (i * 374761393 + j * 668265263 + k * 2147483647) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
  const gauss = (i, j) => Math.sqrt(-2 * Math.log(Math.max(1e-12, hash(i, j, 1)))) * Math.cos(TAU * hash(i, j, 2));
  const inchOf = id => { const m = /^([\d.]+)(?:\/([\d.]+))?"$/.exec(id); return m ? +m[1] / (m[2] ? +m[2] : 1) : null; };
  const bitRate = bps => bps >= 1e9 ? num(bps / 1e9, 3) + ' Gbit/s' : num(bps / 1e6, 3) + ' Mbit/s';

  /* the two families of image sensor, side by side (typical of each, not of every sensor) */
  const CCD_CMOS = [
    ['<b>How the signal leaves</b>', 'The charge of every pixel is shifted, pixel to pixel, to one or a few output amplifiers and turned into a voltage there.', 'Every pixel has its own amplifier; rows are selected in turn and the voltages are read through a converter for each column.'],
    ['<b>Shutter</b>', 'Interline and frame-transfer designs expose every pixel at once (a global shutter) and move the charge aside to be read out slowly.', 'Usually a rolling shutter: rows are exposed and read one after another. A global shutter needs a storage node in every pixel.'],
    ['<b>Speed and power</b>', 'Limited by how fast charge can be moved; high power; several supply voltages.', 'Fast, with many converters working in parallel; low power; a single supply.'],
    ['<b>Noise and uniformity</b>', 'One amplifier serves all the pixels, so the response is very uniform.', 'The amplifiers of the pixels differ a little and are corrected; read noise of a few electrons, or below, is now common.'],
    ['<b>Very bright light</b>', 'A full pixel can overflow into its neighbours (blooming) and smear along the transfer direction unless drains are built in.', 'Blooming is rare and there is no smear from charge transfer.'],
    ['<b>Where you meet it</b>', 'Scientific and astronomical cameras, some industrial and older cameras.', 'Phones, most stills and video cameras, and most machine-vision cameras.']
  ];
  function sensor(el) {
    const L = lab(el, 'The sensor is where the picture becomes numbers. Compare the formats to scale, work out the pixel size and the amount of data a camera makes, see how photons and noise limit one pixel, and watch a rolling shutter bend a moving bar.', 0.56);
    L.under.innerHTML = '<div class="stb"></div><div class="spl"></div><div class="snote"></div><div class="smore"></div>';
    const tbl = ui.$('.stb', L.under), plotBox = ui.$('.spl', L.under), note = ui.$('.snote', L.under);
    ui.$('.smore', L.under).innerHTML = T.util.more(['sensor-formats-and-pixel-size', 'how-a-pixel-detects-light', 'ccd-sensors', 'cmos-sensors', 'sensor-noise', 'dynamic-range-and-full-well', 'quantum-efficiency-and-spectral-response', 'rolling-and-global-shutter', 'nyquist-sampling-and-aliasing']);
    const plot = K.plot(plotBox, { x: { label: 'signal (electrons)', log: true, min: 1, max: 1e5 }, y: { label: 'signal-to-noise ratio', log: true, min: 0.1, max: 1000 } }, 280);
    const SHOW = { formats: ['sensAll'], pixels: ['sens', 'by', 'mp', 'pitch', 'N', 'nm', 'bits', 'fps'], noise: ['sens', 'by', 'mp', 'pitch', 'lux', 't', 'qe', 'read', 'well', 'dark'], rolling: ['v', 'tr', 'sens', 'by', 'mp', 'pitch'] };
    const ALL = ['sensAll', 'sens', 'by', 'mp', 'pitch', 'N', 'nm', 'bits', 'fps', 'lux', 't', 'qe', 'read', 'well', 'dark', 'v', 'tr'];
    const ctl = K.controls(L.side, [
      { id: 'view', type: 'select', label: 'Show', options: [['Sensor formats to scale', 'formats'], ['Pixels, resolution and data', 'pixels'], ['Photons and noise', 'noise'], ['Rolling shutter', 'rolling']], value: 'formats' },
      { id: 'sensAll', type: 'select', label: 'Highlight a format', options: sensOpts(O.cam.SENSORS), value: '1"' },
      { id: 'sens', type: 'select', label: 'Sensor format', options: sensOpts(AREA), value: '1"' },
      { id: 'by', type: 'select', label: 'Describe the pixels by', options: [['Megapixels', 'mp'], ['Pixel pitch', 'pitch']], value: 'mp' },
      { id: 'mp', label: 'Megapixels', min: 0.3, max: 150, value: 12, log: true, fmt: v => num(v, 3) + ' MP' },
      { id: 'pitch', label: 'Pixel pitch', min: 0.8, max: 30, value: 3.4, log: true, fmt: v => num(v, 3) + ' µm' },
      { id: 'N', type: 'select', label: 'f-number of the lens', options: stopOpts(), value: 5.6 },
      { id: 'nm', label: 'Wavelength of the light', min: 400, max: 700, step: 5, value: 550, unit: 'nm' },
      { id: 'bits', type: 'select', label: 'Bit depth', options: [['8 bit', 8], ['10 bit', 10], ['12 bit', 12], ['14 bit', 14], ['16 bit', 16]], value: 12 },
      { id: 'fps', label: 'Frame rate', min: 1, max: 1000, value: 30, log: true, fmt: v => num(v, 3) + ' frames/s' },
      { id: 'lux', label: 'Illuminance on the sensor', min: 0.001, max: 100000, value: 2, log: true, fmt: v => num(v, 3) + ' lux' },
      { id: 't', label: 'Exposure time', min: 0.05, max: 1000, value: 10, log: true, fmt: v => num(v, 3) + ' ms' },
      { id: 'qe', label: 'Quantum efficiency', min: 10, max: 95, step: 1, value: 60, unit: '%' },
      { id: 'read', label: 'Read noise', min: 0.5, max: 30, value: 3, log: true, fmt: v => num(v, 2) + ' e⁻' },
      { id: 'well', label: 'Full well', min: 1000, max: 100000, value: 20000, log: true, fmt: v => num(v, 3) + ' e⁻' },
      { id: 'dark', label: 'Dark current', min: 0.01, max: 1000, value: 1, log: true, fmt: v => num(v, 2) + ' e⁻/s' },
      { id: 'v', label: 'Speed of the bar', min: 0.1, max: 5, value: 1.5, log: true, fmt: v => num(v, 2) + ' frame widths/s' },
      { id: 'tr', label: 'Time to read the whole frame', min: 1, max: 100, value: 25, log: true, fmt: v => num(v, 3) + ' ms' }
    ], id => {
      if (id === 'sensAll' && O.cam.sensor(V.sensAll).h >= 0.5) ctl.set('sens', V.sensAll);
      if (id === 'sens') ctl.set('sensAll', V.sens);
      rows(); refresh(); draw();
    });
    const V = ctl.values;
    const roF = K.readout(L.side, [['size', 'Size'], ['diag', 'Diagonal'], ['crop', 'Crop factor'], ['area', 'Area compared with full frame']]);
    const roP = K.readout(L.side, [['pitch', 'Pixel pitch'], ['n', 'Pixels'], ['mp', 'Megapixels'], ['nyq', 'Nyquist frequency'], ['lw', 'Most detail it can hold'], ['airy', 'Airy disc at this f-number'], ['n2', 'Airy disc spans 2 pixels at'], ['ncut', 'Cut-off falls to Nyquist at'], ['frame', 'One frame, uncompressed'], ['rate', 'Data rate, uncompressed']]);
    const roN = K.readout(L.side, [['ph', 'Photons on one pixel'], ['sig', 'Signal'], ['fw', 'Share of the full well'], ['noise', 'Noise'], ['snr', 'Signal-to-noise ratio'], ['dr', 'Dynamic range'], ['state', 'What limits it']]);
    const roR = K.readout(L.side, [['skew', 'Tilt of the bar'], ['px', 'The same in pixels'], ['dt', 'First row to last row']]);
    function rows() {
      const on = SHOW[V.view];
      for (const id of ALL) ctl.show(id, on.includes(id));
      ctl.show('mp', on.includes('mp') && V.by === 'mp'); ctl.show('pitch', on.includes('pitch') && V.by === 'pitch');
      roF.show(V.view === 'formats'); roP.show(V.view === 'pixels'); roN.show(V.view === 'noise'); roR.show(V.view === 'rolling');
      plotBox.style.display = V.view === 'noise' ? '' : 'none';
      if (V.view === 'rolling') loop.start(); else loop.stop();
    }
    /* the pixel grid implied by a format and either a megapixel count or a pitch */
    function pix() {
      const s = O.cam.sensor(V.sens), pitch = V.by === 'mp' ? Math.sqrt(s.w * s.h / (V.mp * 1e6)) * 1000 : V.pitch;
      const Nx = Math.max(1, Math.round(s.w * 1000 / pitch)), Ny = Math.max(1, Math.round(s.h * 1000 / pitch));
      return { s, pitch, Nx, Ny, mp: Nx * Ny / 1e6 };
    }
    /* photons, electrons and noise for the noise page */
    function noiseCalc(p) {
      const t = V.t / 1000, ph = O.cam.photons({ lux: V.lux, t, pitch: p.pitch }), qe = V.qe / 100, raw = ph * qe, sat = raw >= V.well;
      const r = O.cam.snr({ photons: sat ? V.well / qe : ph, qe, read: V.read, dark: V.dark, t });
      return { t, ph, qe, raw, sat, r, dr: O.cam.dynamicRange(V.well, V.read), darkE: V.dark * t };
    }
    let hits = { rects: [], labels: [], step: 18 };
    function drawFormats(c, C, W, Hh) {
      const all = O.cam.SENSORS, maxW = Math.max(...all.map(s => s.w)), maxH = Math.max(...all.map(s => s.h)), x0 = 24, yb = Hh - 26;
      const k = Math.max(0.5, Math.min((W * 0.58 - 30) / maxW, (Hh - 56) / maxH)), step = Math.min(18, (Hh - 40) / all.length), lx = x0 + maxW * k + 34;
      const order = all.slice().sort((a, b) => b.w * b.h - a.w * a.h), byH = all.slice().sort((a, b) => b.h - a.h || b.w - a.w);
      hits = { rects: [], labels: [], step };
      for (const s of order) {
        const w = s.w * k, h = Math.max(1.6, s.h * k), on = s.id === V.sensAll;
        c.fillStyle = on ? C.hue(215, 0.34) : C.hue(215, 0.06); c.fillRect(x0, yb - h, w, h);
        c.strokeStyle = on ? C.accent : C.muted; c.lineWidth = on ? 2.4 : 1; c.strokeRect(x0, yb - h, w, h);
        hits.rects.push({ id: s.id, x: x0, y: yb - h, w, h });
      }
      byH.forEach((s, i) => {
        const w = s.w * k, h = Math.max(1.6, s.h * k), ly = 22 + i * step, on = s.id === V.sensAll;
        line(c, x0 + w, yb - h, lx - 4, ly, on ? C.accent : C.grid, on ? 1.6 : 0.8);
        text(c, s.id + '  ' + s.w + ' × ' + s.h + ' mm', lx, ly, { color: on ? C.accent : C.muted, weight: on ? 700 : 500 });
        hits.labels.push({ id: s.id, x: lx, y: ly });
      });
      text(c, 'all drawn from the same corner, to the same scale', x0, 14, { size: 11, color: C.faint });
    }
    function drawPixels(c, C, W, Hh, p) {
      const lam = V.nm / 1000, airyD = 2.44 * lam * V.N, n = clamp(Math.ceil(airyD / p.pitch * 2.4), 9, 41) | 1;
      const lw = Math.round(W * 0.3), sq = Math.max(60, Math.min(W - lw - 50, Hh - 112)), px = W - sq - 24, py = 44, cell = sq / n;
      // the whole sensor
      const k = Math.max(0.5, Math.min((lw - 40) / p.s.w, (Hh - 120) / p.s.h)), sw = p.s.w * k, sh = p.s.h * k, sx = 20, sy = py + 10;
      c.fillStyle = C.hue(215, 0.12); c.fillRect(sx, sy, sw, sh); c.strokeStyle = C.accent; c.lineWidth = 1.8; c.strokeRect(sx, sy, sw, sh);
      c.strokeStyle = C.warn; c.lineWidth = 1.4; c.strokeRect(sx + sw / 2 - 5, sy + sh / 2 - 5, 10, 10);
      text(c, p.s.id + ' sensor', sx, py - 8, { color: C.text, weight: 650 });
      S.dim(c, sx, sy + sh + 14, sx + sw, sy + sh + 14, p.s.w + ' mm · ' + p.Nx + ' pixels', { off: 12 });
      text(c, p.s.h + ' mm · ' + p.Ny + ' rows', sx + sw / 2, sy + sh + 46, { align: 'center' });
      line(c, sx + sw / 2 + 5, sy + sh / 2 - 5, px, py, C.warn, 1, [3, 3]); line(c, sx + sw / 2 + 5, sy + sh / 2 + 5, px, py + sq, C.warn, 1, [3, 3]);
      // a point of light on the pixel grid
      S.cells(c, px, py, sq, sq, n, n, (u, v) => O.diff.airy(Math.PI * Math.hypot(u - 0.5, v - 0.5) * n * p.pitch / (lam * V.N)), { gamma: 0.45 });
      c.strokeStyle = 'rgba(128,128,128,.4)'; c.lineWidth = 1; c.beginPath();
      for (let i = 0; i <= n; i++) { c.moveTo(px + i * cell, py); c.lineTo(px + i * cell, py + sq); c.moveTo(px, py + i * cell); c.lineTo(px + sq, py + i * cell); }
      c.stroke();
      c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.8; c.setLineDash([5, 4]); c.beginPath(); c.arc(px + sq / 2, py + sq / 2, Math.max(0.5, airyD / 2 / p.pitch * cell), 0, TAU); c.stroke(); c.restore();
      text(c, 'A point of light on the pixels', px, py - 12, { color: C.text, weight: 650 });
      S.dim(c, px, py + sq + 12, px + Math.min(2 * cell, sq), py + sq + 12, '2 pixels', { off: 12 });
      text(c, 'dashed: the Airy disc, ' + num(airyD, 3) + ' µm = ' + num(airyD / p.pitch, 2) + ' pixels across', px + sq, py + sq + 46, { align: 'right', color: C.warn });
    }
    function drawNoise(c, C, W, Hh, p) {
      const z = noiseCalc(p), e = Math.min(z.raw, V.well), nx = 96, ny = 64, w = Math.max(40, Math.min(W - 40, (Hh - 104) * nx / ny)), h = w * ny / nx, x0 = (W - w) / 2, y0 = 40;
      const sd = rel => Math.sqrt(e * rel + z.darkE + V.read * V.read);
      S.cells(c, x0, y0, w, h, nx, ny, (u, v) => {
        const rel = clamp(testPic(u, v) / 0.96, 0, 1), i = Math.round(u * nx - 0.5), j = Math.round(v * ny - 0.5);
        return (e * rel + sd(rel) * gauss(i, j)) / Math.max(e, 1);
      }, { gamma: 0.6 });
      c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(x0, y0, w, h);
      text(c, 'The same scene, with the noise of this pixel', x0, y0 - 14, { color: C.text, weight: 650 });
      text(c, 'brightest area: ' + num(e, 3) + ' electrons, noise ' + num(z.r.noise, 3) + ' electrons, SNR ' + num(z.r.snr, 3) + (z.sat ? ' (the well is full)' : ''), x0, y0 + h + 16);
      text(c, 'shown with the gain set so that the brightest area comes out white', x0, y0 + h + 32, { size: 11, color: C.faint });
    }
    function drawRolling(c, C, W, Hh) {
      const t = loop.t, gap = 24, pw = Math.max(40, (W - 3 * gap) / 2), ph = Math.max(40, Math.min(Hh - 100, pw * 0.75)), y0 = 52, R = 64;
      [['Global shutter: all rows at once', false], ['Rolling shutter: row by row', true]].forEach(([title, rolling], q) => {
        const x = gap + q * (pw + gap), bw = pw * 0.12;
        c.fillStyle = C.surface; c.fillRect(x, y0, pw, ph);
        c.fillStyle = C.accent;
        for (let r = 0; r < R; r++) {
          const tt = rolling ? t + (r / R) * V.tr / 1000 : t, l = x + (((tt * V.v + 0.4) % 1.5) - 0.25) * pw, a = clamp(l, x, x + pw), b = clamp(l + bw, x, x + pw);
          if (b > a) c.fillRect(a, y0 + r * ph / R, b - a, ph / R + 0.6);
        }
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(x, y0, pw, ph);
        text(c, title, x, y0 - 14, { color: C.text, weight: 650, size: 11.5 });
      });
      const skew = V.v * V.tr / 1000, p = pix();
      K.arrow(c, gap + 2 * pw + gap + 8, y0 + 4, gap + 2 * pw + gap + 8, y0 + ph - 4, C.muted, 1.4);
      text(c, 'The bar moves right at ' + num(V.v, 2) + ' frame widths a second.', gap, y0 + ph + 22);
      text(c, 'The rolling frame is read from top to bottom in ' + num(V.tr, 3) + ' ms,', gap, y0 + ph + 40);
      text(c, 'so the last row sees the bar ' + num(skew * 100, 3) + ' % of the frame width further on.', gap, y0 + ph + 58, { color: C.warn });
      roR.set('skew', num(skew * 100, 3) + ' % of the frame width'); roR.set('px', num(skew * p.Nx, 3) + ' pixels'); roR.set('dt', num(V.tr, 3) + ' ms');
    }
    const loop = K.loop(() => { if (V.view === 'rolling') draw(); }, L.stage);
    function draw() {
      const c = L.st.begin(), C = col(), W = L.st.W, Hh = L.st.H, p = pix();
      if (V.view === 'formats') drawFormats(c, C, W, Hh);
      else if (V.view === 'pixels') drawPixels(c, C, W, Hh, p);
      else if (V.view === 'noise') drawNoise(c, C, W, Hh, p);
      else drawRolling(c, C, W, Hh);
    }
    /* everything that is not the stage: read-outs, table, noise curve */
    function refresh() {
      const p = pix(), sf = O.cam.sensor(V.sensAll);
      if (V.view === 'formats') {
        roF.set('size', sf.w + ' × ' + sf.h + ' mm'); roF.set('diag', num(sf.diag, 4) + ' mm'); roF.set('crop', num(sf.crop, 3)); roF.set('area', num(sf.w * sf.h / FF_AREA, 3));
        const inch = inchOf(sf.id);
        tbl.innerHTML = T.util.table(['Format', 'Width × height (mm)', 'Diagonal (mm)', 'Crop factor', 'Area (full frame = 1)'], O.cam.SENSORS.map(s => Object.assign([s.name, s.w + ' × ' + s.h, s.diag, s.crop, s.w * s.h / FF_AREA], s.id === V.sensAll ? { hl: true } : {}))) +
          '<p class="small muted mt">' + (inch ? 'The inch in a name like "' + esc(sf.id) + '" is the outer diameter of the glass video-camera tube these sizes were first used for, not the size of the sensor: ' + num(inch, 3) + ' inch is ' + num(inch * 25.4, 3) + ' mm, but this sensor\'s diagonal is only ' + num(sf.diag, 3) + ' mm, about ' + num(inch * 25.4 / sf.diag, 2) + ' times less. The other formats are named for their true size.' : 'This format is named for its true size, not for a tube diameter.') + '</p>';
      } else if (V.view === 'rolling') tbl.innerHTML = T.util.box('CCD and CMOS compared', '<p class="small muted" style="margin:0 0 8px">What is typical of each family; individual sensors differ.</p>' + T.util.table(['', 'CCD', 'CMOS'], CCD_CMOS));
      else tbl.innerHTML = '';
      if (V.view === 'pixels') {
        const lam = V.nm / 1000, airyD = 2.44 * lam * V.N;
        roP.set('pitch', num(p.pitch, 3) + ' µm'); roP.set('n', p.Nx + ' × ' + p.Ny); roP.set('mp', num(p.mp, 3) + ' MP');
        roP.set('nyq', num(O.mtf.nyquist(p.pitch), 3) + ' cycles/mm'); roP.set('lw', p.Ny + ' line widths per picture height');
        roP.set('airy', num(airyD, 3) + ' µm = ' + num(airyD / p.pitch, 2) + ' pixels'); roP.set('n2', 'f/' + num(2 * p.pitch / (2.44 * lam), 3)); roP.set('ncut', 'f/' + num(2000 * p.pitch / V.nm, 3));
        const bps = O.cam.dataRate(p.Nx, p.Ny, V.bits, V.fps);
        roP.set('frame', num(p.Nx * p.Ny * V.bits / 8e6, 3) + ' MB'); roP.set('rate', bitRate(bps) + ' (' + num(bps / 8e6, 3) + ' MB/s)');
      }
      note.innerHTML = V.view === 'noise' ? '<p class="small muted mt">Left of the vertical line the read noise and dark current dominate, and the signal-to-noise ratio climbs in step with the signal. Right of it the shot noise (the random arrival of photons) dominates and the ratio climbs only as the square root of the signal. At the right-hand edge the well is full and the pixel saturates.</p>' : '';
      if (V.view === 'noise') {
        const z = noiseCalc(p), e = Math.min(z.raw, V.well), fl = V.read * V.read + z.darkE, C = col(), pts = [], shot = [], rd = [];
        roN.set('ph', num(z.ph, 3) + ' photons'); roN.set('sig', num(e, 3) + ' electrons'); roN.set('fw', num(100 * e / V.well, 3) + ' %');
        roN.set('noise', num(z.r.noise, 3) + ' electrons'); roN.set('snr', num(z.r.snr, 3) + (Number.isFinite(z.r.db) ? ' (' + num(z.r.db, 3) + ' dB)' : ''));
        roN.set('dr', num(z.dr.db, 3) + ' dB · ' + num(z.dr.stops, 3) + ' stops · ' + z.dr.bits + ' bits');
        roN.set('state', z.sat ? 'saturation: the well is full' : e < fl ? 'read noise and dark current' : 'shot noise (the photons themselves)');
        for (let i = 0; i <= 120; i++) {
          const q = 0.5 * Math.pow(V.well / 0.5, i / 120), s = O.cam.snr({ photons: q, qe: 1, read: V.read, dark: V.dark, t: z.t });
          pts.push([q, Math.max(s.snr, 1e-3)]); shot.push([q, Math.sqrt(q)]); rd.push([q, q / Math.sqrt(fl)]);
        }
        plot.set({
          x: { label: 'signal (electrons)', log: true, min: 0.5, max: V.well * 2.5 }, y: { label: 'signal-to-noise ratio', log: true, min: 0.1, max: Math.sqrt(V.well) * 1.6 },
          series: [{ pts, label: 'a pixel with these noise figures', color: C.accent, width: 3 }, { pts: shot, label: 'shot noise alone', color: C.ok, dash: true, width: 1.6 }, { pts: rd, label: 'read noise and dark current alone', color: C.bad, dash: true, width: 1.6 }],
          vlines: [{ x: fl, label: 'read noise = shot noise', color: C.faint }, { x: V.well, label: 'full well: saturation', color: C.warn }],
          marks: [{ x: Math.max(e, 0.5), y: Math.max(z.r.snr, 0.1), label: 'now', color: C.warn }], hlines: [{ y: 1, label: 'SNR 1', color: C.faint }]
        });
      }
    }
    K.click(L.st, p => {
      const id = V.view === 'formats' ? hitFormat(p) : null;
      if (id) { ctl.set('sensAll', id); if (O.cam.sensor(id).h >= 0.5) ctl.set('sens', id); refresh(); draw(); }
    }, p => V.view === 'formats' && !!hitFormat(p));
    function hitFormat(p) {
      for (const l of hits.labels) if (p.x >= l.x - 10 && Math.abs(p.y - l.y) <= hits.step / 2) return l.id;
      for (let i = hits.rects.length - 1; i >= 0; i--) { const r = hits.rects[i]; if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y - 2 && p.y <= r.y + r.h + 2) return r.id; }
      return null;
    }
    L.st.onResize(draw); T.util.onTheme(draw); rows(); refresh(); draw();
  }
  /* ================================================================ lens mounts */
  /* can a lens made for one mount go on a camera with another, and with what? -> { ok, short, text } */
  function adapterWords(lens, body) {
    const a = O.cam.adapter(lens, body), A = O.cam.mount(lens), B = O.cam.mount(body);
    if (lens === body) return { ok: true, short: 'none: the same mount', ring: 0, text: 'The same mount on both sides, so the lens fits the camera directly and no adapter is needed.' };
    if (a.ok == null) return { ok: null, short: 'no fixed distance', ring: NaN, text: (A.ffd == null ? 'The ' + A.name + ' has no fixed flange distance: the lens is focused by screwing it in or out of its holder, and the holder sets the distance. ' : '') + (B.ffd == null ? 'The ' + B.name + ' has no fixed flange distance either: the camera\'s holder sets where the sensor sits. ' : '') + 'With no fixed distance on one side there is no ring length to work out; check the maker\'s adapter list or the lens holder.' };
    if (a.ring === 0) return { ok: true, short: 'a very thin ring', ring: 0, text: 'The two mounts put the sensor at the same distance, so the lens would be in the right place, but the fittings differ (' + A.fit + ' against ' + B.fit + '). Only a ring of almost no thickness could join them, which few makers offer.' };
    if (a.ok) return { ok: true, short: 'a ' + fx(a.ring, 2) + ' mm ring', ring: a.ring, text: 'Possible. The lens is built to form its image ' + fx(A.ffd, 3) + ' mm behind its flange, and this camera holds its sensor ' + fx(B.ffd, 3) + ' mm behind its flange. A plain ring or tube ' + fx(a.ring, 2) + ' mm long, with the ' + B.name + ' fitting on the camera side and the ' + A.name + ' fitting on the lens side, puts the lens exactly where it expects to be. There is no glass in it, so focus to infinity still works and the image quality is untouched.' + (lens === 'C' && body === 'CS' ? ' This is the familiar 5 mm C-to-CS ring.' : '') + (B.use.indexOf('mirrorless') >= 0 ? ' Mirrorless cameras have a short flange distance, so they accept lenses from many older systems this way; an adapter with electrical contacts can also pass on aperture and focus signals.' : '') };
    return { ok: false, short: 'impossible without extra glass', ring: a.ring, text: 'Not with a plain ring. The lens is built to form its image ' + fx(A.ffd, 3) + ' mm behind its flange, but this camera holds its sensor ' + fx(B.ffd, 3) + ' mm behind its flange, ' + fx(-a.ring, 2) + ' mm farther. The lens would have to sit ' + fx(-a.ring, 2) + ' mm inside the camera body, and a ring only moves it the wrong way. Mounted as it is, the lens would be ' + fx(-a.ring, 2) + ' mm too far from the sensor and could not focus on anything distant. An adapter with extra lenses in it (a focal reducer or relay) can bridge the gap, at a cost in light and in image quality.' };
  }

  function mounts(el) {
    const L = lab(el, 'A lens mount fixes one dimension above all: the flange focal distance, from the face where the lens meets the camera to the sensor. Lens and camera must agree on it or the picture will not focus at infinity. Pick a mount to see it in section, click a bar to choose one, and ask whether a lens of one mount can be fitted to a camera of another.', 0.8);
    const MOUNTS = O.cam.MOUNTS, mOpts = MOUNTS.map(m => [m.name + (m.ffd == null ? '' : ' · ' + fx(m.ffd, 3) + ' mm'), m.id]);
    const ctl = K.controls(L.side, [
      { id: 'mount', type: 'select', label: 'Mount to study', options: mOpts, value: 'C' },
      { type: 'html', html: '<b>Adapter checker</b>' },
      { id: 'lens', type: 'select', label: 'The lens has a', options: mOpts, value: 'C' },
      { id: 'body', type: 'select', label: 'The camera has a', options: mOpts, value: 'CS' }
    ], () => refresh());
    const V = ctl.values;
    const ro = K.readout(L.side, [['ffd', 'Flange focal distance'], ['throat', 'Throat diameter'], ['fit', 'Fitting'], ['adp', 'Adapter, lens to camera'], ['ring', 'Ring or tube length']]);
    let hitsM = [];
    function crossSection(c, C, x0, y0, w, h, m) {
      const ffd = m.ffd == null ? 14 : m.ffd, tr = m.throat, k = Math.max(0.5, Math.min((w - 24) / (ffd + 36), (h - 101) / (tr + 16)));
      const hb = (tr / 2 + 8) * k, fxp = x0 + 12 + 24 * k, cy = y0 + 62 + hb, xs = fxp + ffd * k;
      text(c, 'The ' + m.name + ' in section', x0, y0 + 12, { color: C.text, weight: 650 });
      text(c, m.fit, x0, y0 + 28, { size: 11 });
      c.save(); c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.3;
      c.beginPath(); c.rect(fxp - 24 * k, cy - (tr / 2 + 3) * k, 24 * k, (tr + 6) * k); c.fill(); c.stroke();             // the lens barrel
      c.beginPath(); c.rect(fxp, cy - hb, (ffd + 10) * k, 2 * hb); c.fill(); c.stroke(); c.restore();                      // the camera body
      c.fillStyle = C.faint; c.fillRect(fxp, cy - hb, 4 * k, 8 * k); c.fillRect(fxp, cy + tr / 2 * k, 4 * k, 8 * k);        // the wall with the throat in it
      S.lens(c, fxp - 15 * k, cy, tr * 0.38 * k, { f: 1, bulge: 2.4 });
      const ya = tr * 0.25 * k;
      for (const sg of [-1, 1]) S.ray(c, [[x0 + 2, cy + sg * ya], [fxp - 15 * k, cy + sg * ya], [xs, cy]], { nm: 580, width: 1.2, arrows: false });
      line(c, fxp, cy - hb - 8, fxp, cy + hb + 8, C.accent, 1.4, [4, 3]); text(c, 'mounting face', fxp, cy - hb - 18, { align: 'center', color: C.accent, size: 11 });
      S.sensor(c, xs, cy, Math.min(tr * 0.4, 24) * k, { pixels: 9 }); text(c, m.ffd == null ? 'sensor (distance set by the holder)' : 'sensor plane', xs + 4, cy + Math.min(tr * 0.4, 24) * k + 22, { align: 'center', color: C.ok, size: 11 });
      S.dim(c, fxp, cy + hb + 18, xs, cy + hb + 18, m.ffd == null ? 'distance not fixed' : fx(m.ffd, 3) + ' mm', { off: 13 });
      S.dim(c, fxp - 5, cy - tr / 2 * k, fxp - 5, cy + tr / 2 * k, '', {});
      text(c, 'throat ø ' + tr + ' mm', fxp - 12 * k, cy + (tr / 2 + 7) * k + 14, { align: 'center', size: 11 });
    }
    function adapterView(c, C, x0, y0, w, h, ad) {
      const A = O.cam.mount(V.lens), B = O.cam.mount(V.body);
      text(c, 'A ' + A.name + ' lens on a ' + B.name + ' camera', x0, y0 + 12, { color: C.text, weight: 650 });
      text(c, ad.short, x0, y0 + 28, { color: ad.ok === false ? C.bad : ad.ok ? C.ok : C.warn, weight: 600 });
      if (A.ffd == null || B.ffd == null) { text(c, 'No fixed flange distance on one side,', x0, y0 + 70); text(c, 'so there is nothing to compare.', x0, y0 + 88); return; }
      const k = Math.max(0.3, (w - 100) / (Math.max(A.ffd, B.ffd) + 14)), cy = y0 + 62 + (h - 120) / 2, xs = x0 + w - 24, xc = xs - B.ffd * k, xl = xs - A.ffd * k;
      c.save(); c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.3; c.beginPath(); c.rect(xc, cy - 30, xs - xc + 10, 60); c.fill(); c.stroke(); c.restore();
      text(c, 'camera', xc + 8, cy + 18, { size: 11 });
      if (ad.ok && ad.ring > 0) { c.fillStyle = C.hue(145, 0.55); c.fillRect(xl, cy - 20, xc - xl, 40); text(c, 'ring ' + fx(ad.ring, 2) + ' mm', (xl + xc) / 2, cy - 30, { align: 'center', color: C.ok, size: 11 }); }
      c.save(); c.strokeStyle = ad.ok === false ? C.bad : C.text; c.lineWidth = 1.5; if (ad.ok === false) c.setLineDash([5, 4]); c.fillStyle = C.hue(215, 0.2);
      c.beginPath(); c.rect(xl - 56, cy - 24, 56, 48); c.fill(); c.stroke(); c.restore();
      text(c, 'lens', xl - 28, cy, { align: 'center', size: 11 });
      if (ad.ok === false) text(c, 'would have to sit here, inside the camera', xl - 28, cy + 38, { align: 'center', color: C.bad, size: 11 });
      c.fillStyle = C.ok; c.fillRect(xs - 1.5, cy - 36, 3, 72); text(c, 'sensor', xs, cy - 46, { align: 'center', color: C.ok, size: 11 });
      S.dim(c, xl, cy + 62, xs, cy + 62, '', {}); text(c, 'the lens wants ' + fx(A.ffd, 3) + ' mm', xs, cy + 75, { align: 'right' });
      S.dim(c, xc, cy + 92, xs, cy + 92, '', {}); text(c, 'the camera has ' + fx(B.ffd, 3) + ' mm', xs, cy + 105, { align: 'right' });
    }
    function draw() {
      const c = L.st.begin(), C = col(), W = L.st.W, Hh = L.st.H, ad = adapterWords(V.lens, V.body);
      const fixed = MOUNTS.filter(m => m.ffd != null).sort((a, b) => a.ffd - b.ffd), loose = MOUNTS.filter(m => m.ffd == null);
      const top = Math.ceil(Math.max(...fixed.map(m => m.ffd)) / 10) * 10, cx0 = 40, cx1 = W - 14, cy0 = 54, cy1 = Math.round(Hh * 0.4), kk = (cy1 - cy0) / top, bw = (cx1 - cx0) / fixed.length;
      text(c, 'Flange focal distance, in millimetres', cx0, 14, { color: C.text, weight: 650 });
      text(c, 'No fixed distance (set by the lens or its holder): ' + loose.map(m => m.name).join(', '), cx0, 32, { size: 11 });
      for (let v = 0; v <= top; v += 10) { const y = cy1 - v * kk; line(c, cx0, y, cx1, y, C.grid, 1); text(c, String(v), cx0 - 6, y, { align: 'right', size: 11 }); }
      hitsM = [];
      fixed.forEach((m, i) => {
        const x = cx0 + i * bw + bw * 0.14, w = bw * 0.72, h = m.ffd * kk, on = m.id === V.mount;
        c.fillStyle = on ? C.accent : C.hue(215, 0.45); c.fillRect(x, cy1 - h, w, h);
        if (m.id === V.lens || m.id === V.body) { c.strokeStyle = m.id === V.lens ? C.ok : C.warn; c.lineWidth = 2.4; c.strokeRect(x, cy1 - h, w, h); }
        text(c, num(m.ffd, 4), x + w / 2, cy1 - h - 8, { align: 'center', size: 11, color: on ? C.accent : C.text });
        text(c, m.id, x + w / 2, cy1 + 11, { align: 'center', size: 11, color: on ? C.accent : C.muted, weight: on ? 700 : 500 });
        hitsM.push({ id: m.id, x: x - bw * 0.1, w: bw * 0.92 });
      });
      text(c, 'outlined: the lens (green) and camera (amber) of the adapter checker', cx1, cy1 + 28, { align: 'right', size: 11, color: C.faint });
      const y1 = cy1 + 40, hh = Hh - y1 - 6;
      line(c, 10, y1 - 4, W - 10, y1 - 4, C.grid, 1);
      crossSection(c, C, 12, y1, Math.round(W * 0.5) - 20, hh, O.cam.mount(V.mount));
      adapterView(c, C, Math.round(W * 0.5) + 8, y1, W - Math.round(W * 0.5) - 22, hh, ad);
    }
    function refresh() {
      const m = O.cam.mount(V.mount), ad = adapterWords(V.lens, V.body);
      ro.set('ffd', m.ffd == null ? 'not fixed' : fx(m.ffd, 3) + ' mm'); ro.set('throat', m.throat + ' mm'); ro.set('fit', m.fit);
      ro.set('adp', ad.short); ro.set('ring', Number.isFinite(ad.ring) && ad.ok && ad.ring > 0 ? fx(ad.ring, 2) + ' mm' : '—');
      L.under.innerHTML = T.util.box('Can this lens go on that camera?', '<p style="margin:0">' + esc(ad.text) + '</p>') +
        '<div style="margin-top:10px">' + T.util.table(['Mount', 'Fitting', 'Flange distance', 'Throat', 'Sensors it serves', 'Where you meet it'], MOUNTS.map(x => Object.assign([x.name, x.fit, x.ffd == null ? 'set by the lens' : fx(x.ffd, 3) + ' mm', x.throat + ' mm', x.sensor, x.use], x.id === V.mount ? { hl: true } : {}))) + '</div>' +
        T.util.more(['lens-mounts-and-flange-distance', 'c-mount', 'cs-mount', 's-mount-m12', 'f-mount', 'photographic-lens-mounts', 'lens-adapters-and-back-focus', 'image-circle-and-sensor-coverage']);
      draw();
    }
    const hitMount = p => { for (const h of hitsM) if (p.x >= h.x && p.x <= h.x + h.w && p.y < L.st.H * 0.4 + 24 && p.y > 40) return h.id; return null; };
    K.click(L.st, p => { const id = hitMount(p); if (id) { ctl.set('mount', id); refresh(); } }, p => !!hitMount(p));
    L.st.onResize(draw); T.util.onTheme(draw); refresh();
  }
  /* ================================================================ exposure */
  const TIMES = [1 / 8000, 1 / 4000, 1 / 2000, 1 / 1000, 1 / 500, 1 / 250, 1 / 125, 1 / 60, 1 / 30, 1 / 15, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8, 15, 30];
  const timeStr = t => !(t > 0) || !Number.isFinite(t) ? '—' : t >= 120 ? num(t / 60, 3) + ' min' : t >= 0.3 ? num(t, 2) + ' s' : '1/' + Math.round(1 / t) + ' s';
  const nearestTime = t => TIMES.reduce((b, x) => Math.abs(Math.log2(t / x)) < Math.abs(Math.log2(t / b)) ? x : b, TIMES[0]);
  const SCENES = [[15, 'Bright sun'], [12, 'Overcast day'], [8, 'Bright interior'], [5, 'Home at night'], [0, 'Dim light'], [-4, 'Moonlit landscape']];
  function sceneText(ev) {
    if (ev > 17) return 'brighter than a sunlit street: snow or sand in full sun';
    if (ev < -6) return 'darker than moonlight: stars and the night sky';
    const b = SCENES.reduce((a, s) => Math.abs(s[0] - ev) < Math.abs(a[0] - ev) ? s : a, SCENES[0]), d = ev - b[0];
    return b[1].toLowerCase() + (Math.abs(d) < 0.7 ? '' : d > 0 ? ' (somewhat brighter)' : ' (somewhat dimmer)');
  }

  const SHUTTERS = [
    ['<b>Leaf</b> (in the lens)', 'Thin blades open from the centre and close again, close to the aperture.', '1/500 to 1/4000 s', 'Flash works at every time. Found in compact cameras and in medium- and large-format lenses.'],
    ['<b>Focal-plane</b> (curtains)', 'Two curtains cross the sensor just in front of it; the gap between them is the exposure. At short times the gap is a narrow slit sweeping over the frame.', '1/4000 to 1/8000 s', 'Flash only while the whole frame is open, up to about 1/200 or 1/250 s. Very fast subjects are slightly skewed.'],
    ['<b>Electronic, rolling</b>', 'The sensor starts and stops each row in turn, with no moving parts.', '1/16000 s and shorter', 'Silent and vibration-free, but fast subjects lean and flickering lamps cause bands.'],
    ['<b>Electronic, global</b>', 'Every pixel starts and stops together, using a storage node in each pixel.', 'down to a few microseconds', 'No skew and flash can be fired at any moment; the extra circuitry can cost some sensitivity.']
  ];
  function exposure(el) {
    const L = lab(el, 'Aperture, shutter time and ISO together decide how bright the picture is, and each one costs something: the aperture costs depth of field, the shutter time costs motion blur, the ISO costs noise. The exposure value puts the three on one scale, so you can see which scenes a setting suits and trade one cost for another without changing the brightness.', 0.74);
    const ctl = K.controls(L.side, [
      { id: 'N', type: 'select', label: 'f-number', options: stopOpts(), value: 8 },
      { id: 't', type: 'select', label: 'Shutter time', options: TIMES.map(t => [timeStr(t), t]), value: 1 / 125 },
      { id: 'iso', type: 'select', label: 'ISO', options: [50, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 102400].map(i => ['ISO ' + i, i]), value: 100 },
      { type: 'buttons', items: [{ id: 'open', label: 'One stop wider, same exposure' }, { id: 'close', label: 'One stop narrower, same exposure' }] },
      { type: 'html', html: '<b>Motion blur</b>' },
      { id: 'v', label: 'Speed of the subject', min: 0.1, max: 100, value: 14, log: true, fmt: v => num(v, 3) + ' m/s' },
      { id: 'dist', label: 'Distance to the subject', min: 0.5, max: 1000, value: 20, log: true, fmt: lenM },
      { id: 'f', label: 'Focal length', min: 4, max: 800, value: 50, log: true, fmt: v => num(v, 3) + ' mm' },
      { id: 'pitch', label: 'Pixel pitch', min: 1, max: 10, value: 4, log: true, fmt: v => num(v, 3) + ' µm' }
    ], id => {
      if (id === 'open' || id === 'close') {
        const i = STOPS.indexOf(V.N), j = id === 'open' ? i - 1 : i + 1;
        if (i >= 0 && j >= 0 && j < STOPS.length) { const ev = O.cam.ev(V.N, V.t, V.iso); ctl.set('N', STOPS[j]); ctl.set('t', nearestTime(O.cam.exposureTime(STOPS[j], ev, V.iso))); }
      }
      refresh();
    });
    const V = ctl.values;
    const ro = K.readout(L.side, [['ev', 'EV the setting suits (at ISO 100)'], ['scene', 'A scene like'], ['gain', 'ISO gain over ISO 100'], ['m', 'Magnification on the sensor'], ['blur', 'Motion blur at this time'], ['tmax', 'Longest time for under 1 pixel of blur']]);
    let map = null;
    function calc() {
      const dmm = Math.max(V.dist * 1000, 2 * V.f), m = O.cam.magnification(V.f, dmm), blur = O.cam.motionBlur(V.v * 1000, V.t, m, V.pitch);
      return { ev: O.cam.ev(V.N, V.t, V.iso), m, blur, tmax: blur > 0 ? V.t / blur : Infinity };
    }
    function draw() {
      const c = L.st.begin(), C = col(), W = L.st.W, Hh = L.st.H, z = calc();
      // the exposure-value scale, with the scenes it spans
      const bx0 = 34, bx1 = W - 34, by = 80, bh = 22, lo = -6, hi = 18, X = ev => bx0 + (clamp(ev, lo, hi) - lo) / (hi - lo) * (bx1 - bx0);
      map = { bx0, bx1, by, bh, lo, hi };
      text(c, 'Exposure value (EV at ISO 100): the scenes this setting suits', bx0, 14, { color: C.text, weight: 650 });
      const g = c.createLinearGradient(bx0, 0, bx1, 0); g.addColorStop(0, '#05060c'); g.addColorStop(0.5, '#6a7088'); g.addColorStop(1, '#fff8e0');
      c.fillStyle = g; c.fillRect(bx0, by, bx1 - bx0, bh); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(bx0, by, bx1 - bx0, bh);
      for (let ev = lo; ev <= hi; ev += 2) { const x = X(ev); line(c, x, by + bh, x, by + bh + 4, C.axis, 1); text(c, String(ev).replace('-', '−'), x, by + bh + 14, { align: 'center', size: 10.5 }); }
      SCENES.forEach(([ev, name], i) => { const x = X(ev), yl = by - 14 - (i % 2) * 17; line(c, x, by, x, yl + 7, C.faint, 1); text(c, name + ' · ' + String(ev).replace('-', '−'), x, yl, { align: 'center', size: 11 }); });
      const xe = X(z.ev);
      c.fillStyle = C.warn; c.beginPath(); c.moveTo(xe, by + bh + 20); c.lineTo(xe - 7, by + bh + 32); c.lineTo(xe + 7, by + bh + 32); c.closePath(); c.fill();
      text(c, 'this setting: EV ' + num(z.ev, 3) + (z.ev < lo || z.ev > hi ? ' (off the scale)' : ''), clamp(xe, bx0 + 90, bx1 - 90), by + bh + 46, { align: 'center', color: C.warn, weight: 650 });
      // the exposure triangle
      const yT = by + bh + 88, yB0 = Hh - 122, cxm = W / 2, s3 = Math.max(120, Math.min(W * 0.46, (yB0 - yT - 4) / 0.866)), yB = yT + 4 + 0.866 * s3;
      const P = [[cxm, yT + 4], [cxm - s3 / 2, yB], [cxm + s3 / 2, yB]];
      c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.6; c.fillStyle = C.hue(215, 0.06); c.beginPath(); P.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.stroke(); c.restore();
      [['f/' + V.N, 'Aperture', 'costs depth of field', 205, 0], ['' + timeStr(V.t), 'Shutter time', 'costs motion blur', 145, -1], ['ISO ' + V.iso, 'Sensitivity', 'costs noise', 25, 1]].forEach(([val, name, cost, hue, side], i) => {
        const [x, y] = P[i];
        disc(c, x, y, 31, C.bg2); disc(c, x, y, 31, C.hue(hue, 0.28)); c.strokeStyle = C.hue(hue, 0.9); c.lineWidth = 2; c.beginPath(); c.arc(x, y, 31, 0, TAU); c.stroke();
        text(c, val, x, y, { align: 'center', color: C.text, weight: 700, size: 13 });
        const lx = x + (side === 0 ? 42 : side * 42), al = side < 0 ? 'right' : 'left';
        text(c, name, lx, y - 7, { align: al, color: C.text, weight: 650 }); text(c, cost, lx, y + 9, { align: al });
      });
      text(c, 'EV ' + num(z.ev, 3), cxm, yT + 0.6 * (yB - yT), { align: 'center', color: C.text, weight: 700, size: 15 });
      text(c, 'one stop wider = half the time', (P[0][0] + P[1][0]) / 2 - 10, (P[0][1] + P[1][1]) / 2, { align: 'right', size: 11 });
      text(c, 'one stop wider = half the ISO', (P[0][0] + P[2][0]) / 2 + 10, (P[0][1] + P[2][1]) / 2, { size: 11 });
      text(c, 'half the time = twice the ISO', cxm, yB + 46, { align: 'center', size: 11 });
      // a point of light smeared across the pixels during the exposure
      const n = 36, cw = (W - 80) / n, sy = Hh - 44, st = 3;
      text(c, 'A point of light smeared across the pixels: ' + num(z.blur, 3) + (z.blur === 1 ? ' pixel' : ' pixels'), 40, Hh - 60, { color: C.text, weight: 650, size: 11.5 });
      for (let i = 0; i < n; i++) {
        c.fillStyle = C.surface; c.fillRect(40 + i * cw, sy, cw - 1, 24);
        const cov = clamp(st + Math.max(z.blur, 1) - i, 0, 1) - clamp(st - i, 0, 1);
        if (cov > 0) { c.save(); c.globalAlpha = clamp(cov * (0.35 + 0.65 / Math.max(1, z.blur)), 0, 1); c.fillStyle = C.warn; c.fillRect(40 + i * cw, sy, cw - 1, 24); c.restore(); }
      }
      if (z.blur > n - st) text(c, '… and on beyond the edge of the strip', W - 40, sy + 34, { align: 'right', size: 11, color: C.faint });
    }
    function refresh() {
      const z = calc();
      ro.set('ev', num(z.ev, 3)); ro.set('scene', sceneText(z.ev)); ro.set('gain', '× ' + num(V.iso / 100, 4) + ' (' + num(Math.log2(V.iso / 100), 2) + ' stops)');
      ro.set('m', magStr(z.m)); ro.set('blur', num(z.blur, 3) + (z.blur === 1 ? ' pixel' : ' pixels')); ro.set('tmax', timeStr(z.tmax));
      const rows = STOPS.map(n => {
        const t = O.cam.exposureTime(n, z.ev, V.iso), r = n / V.N, b = O.cam.motionBlur(V.v * 1000, t, z.m, V.pitch);
        return Object.assign(['f/' + n, timeStr(t), timeStr(nearestTime(t)), Math.abs(Math.log(r)) < 0.05 ? 'the same' : r > 1 ? num(r, 2) + ' × deeper' : num(1 / r, 2) + ' × shallower', num(b, 2) + ' pixels'], n === V.N ? { hl: true } : {});
      });
      L.under.innerHTML = '<p class="small muted" style="margin:0 0 8px">Drag along the exposure-value scale to change the shutter time and watch the setting move across the scenes.</p>' + T.util.box('The same exposure at every stop', '<p class="small muted" style="margin:0 0 8px">Each step down the table lets in half the light and doubles the time, so the exposure stays the same. What changes is the depth of field and the blur of anything that moves, for the subject you described on the left.</p>' +
        T.util.table(['f-number', 'Time for the same exposure', 'Nearest standard time', 'Depth of field compared with now', 'Motion blur at that time'], rows, { maxHeight: 420 })) +
        T.util.box('Shutters compared', '<p class="small muted" style="margin:0 0 8px">Typical figures; every camera differs.</p>' + T.util.table(['Shutter', 'How it works', 'Fastest time, typically', 'Flash and moving subjects'], SHUTTERS)) +
        T.util.more(['exposure-and-the-exposure-triangle', 'aperture-and-f-stops', 'shutter-speed-and-motion', 'iso-and-gain', 'metering-and-exposure-value', 'shutter-types']);
      draw();
    }
    K.drag(L.st, {
      hit: p => map && p.y >= map.by - 36 && p.y <= map.by + map.bh + 50 ? { y: p.y } : null,
      move: (t, p) => { const ev = map.lo + clamp((p.x - map.bx0) / (map.bx1 - map.bx0), 0, 1) * (map.hi - map.lo); ctl.set('t', nearestTime(O.cam.exposureTime(V.N, ev, V.iso))); refresh(); }, hover: true
    });
    L.st.onResize(draw); T.util.onTheme(draw); refresh();
  }
  /* ================================================================ MTF and sampling */
  function mtf(el) {
    const L = lab(el, 'Every part of the chain, lens, pixel, focus error and motion, lets through less contrast as the detail gets finer. Each is a curve, the modulation transfer function, and the curve of the whole chain is their product. The strips show what that does to a pattern of bars that gets finer from left to right, and what happens when the pixels sample it.', 0.3, { minH: 250, maxH: 340 });
    L.under.innerHTML = '<div class="mverd"></div><div class="mplot"></div><div class="mmore"></div>';
    const verdEl = ui.$('.mverd', L.under);
    const plot = K.plot(ui.$('.mplot', L.under), { x: { label: 'spatial frequency (cycles/mm)', min: 0, max: 100 }, y: { label: 'MTF: contrast passed', min: 0, max: 1.05 } }, 340);
    ui.$('.mmore', L.under).innerHTML = T.util.more(['the-modulation-transfer-function', 'diffraction-limited-mtf', 'system-mtf', 'nyquist-sampling-and-aliasing', 'spatial-frequency-and-line-pairs', 'resolution-and-contrast', 'the-f-number']);
    const ctl = K.controls(L.side, [
      { id: 'nm', label: 'Wavelength of the light', min: 400, max: 700, step: 5, value: 550, unit: 'nm' },
      { id: 'N', type: 'select', label: 'f-number of the lens', options: stopOpts(), value: 5.6 },
      { id: 'pitch', label: 'Pixel pitch', min: 0.8, max: 20, value: 3.4, log: true, fmt: v => num(v, 3) + ' µm' },
      { id: 'sensor', type: 'select', label: 'Sensor format (for picture height)', options: sensOpts(AREA), value: '1"' },
      { id: 'defocus', label: 'Defocus: blur circle on the sensor', min: 0, max: 60, step: 0.5, value: 0, unit: 'µm' },
      { id: 'motion', label: 'Motion: smear on the sensor', min: 0, max: 60, step: 0.5, value: 0, unit: 'µm' }
    ], () => refresh());
    const V = ctl.values;
    const ro = K.readout(L.side, [['cut', 'Diffraction cut-off'], ['nyq', 'Nyquist frequency'], ['atn', 'MTF at Nyquist'], ['m50', 'MTF50'], ['lw', 'MTF50 in line widths per picture height'], ['lim', 'The sensor holds at most'], ['who', 'Verdict']]);
    /* all the curves of the chain, and the frequencies that matter */
    function calc() {
      const M = O.mtf, nm = V.nm, N = V.N, p = V.pitch, db = V.defocus / 1000, mb = V.motion / 1000, nyq = M.nyquist(p), cut = M.cutoff(nm, N);
      const dif = nu => M.diffraction(nu, nm, N), pixl = nu => M.pixel(nu, p), def = nu => M.defocus(nu, db), mot = nu => M.motion(nu, mb);
      const lens = nu => dif(nu) * def(nu) * mot(nu), sys = nu => M.system(nu, [dif, pixl, def, mot]);
      return { dif, pixl, def, mot, lens, sys, nyq, cut, xmax: clamp(cut * 1.05, nyq * 1.3, nyq * 3), s50: M.mtf50(sys, cut), h: O.cam.sensor(V.sensor).h };
    }
    function verdict(z) {
      const dN = z.dif(z.nyq), xN = z.def(z.nyq), mN = z.mot(z.nyq);
      if (dN < 0.2) return ['diffraction-limited', 'Diffraction is limiting. At this f-number a perfect lens passes almost no contrast at the sensor\'s Nyquist frequency, so the pixels are finer than the lens can use. Open the aperture (a smaller f-number) or accept that bigger pixels would lose nothing.'];
      if (xN < 0.3 && xN <= mN) return ['defocus-limited', 'Defocus is the biggest loss. The blur circle is wiping out the detail the pixels could record: focus more carefully, or stop down a little for more depth of focus.'];
      if (mN < 0.3) return ['motion-limited', 'Motion blur is the biggest loss. Use a shorter exposure, a steadier camera, or a lens that magnifies less.'];
      if (z.lens(1.5 * z.nyq) > 0.1) return ['sensor-limited: aliasing', 'The lens out-resolves the sensor: it delivers contrast beyond the Nyquist frequency, where the pixels cannot follow. Expect aliasing, false coarse bars and moiré on fine regular detail (the last strip shows it). The sensor, not the lens, limits the resolution.'];
      return ['well matched', 'Lens and sensor are well matched: each gives up about as much detail as the other, so neither is wasted and aliasing is mild.'];
    }
    function draw() {
      const c = L.st.begin(), C = col(), W = L.st.W, Hh = L.st.H, z = calc(), P = 200;
      const x0 = 14, w = Math.max(60, W - 28), rowH = Math.max(40, (Hh - 56) / 3), sh = rowH - 24, Lmm = P * V.pitch / 1000;
      const phase = u => Math.PI * z.xmax * Lmm * u * u, nu = u => z.xmax * u;                  // a chirp: the frequency rises in step with position
      const strips = [
        ['The target: bars that get finer from left to right, at full contrast', u => 0.5 + 0.5 * Math.sin(phase(u)), 0.8],
        ['What the lens puts on the sensor (its blur, defocus and motion)', u => 0.5 + 0.5 * z.lens(nu(u)) * Math.sin(phase(u)), 0.8],
        ['What the pixels record: one value per pixel, with the pixel\'s own blur', u => 0.5 + 0.5 * z.sys(nu(u)) * Math.sin(phase(u)), w / P]
      ];
      strips.forEach(([title, f, step], i) => {
        const y = 16 + i * rowH;
        text(c, title, x0, y + 2, { color: C.text, weight: 600, size: 11.5 });
        S.fringes(c, x0, y + 14, w, sh, f, { gamma: 1, step });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, y + 14, w, sh);
      });
      const xN = x0 + w * z.nyq / z.xmax, yEnd = 16 + 2 * rowH + 14 + sh;
      line(c, xN, 22, xN, yEnd + 6, C.warn, 1.6, [5, 4]);
      if (z.cut <= z.xmax) line(c, x0 + w * z.cut / z.xmax, 22, x0 + w * z.cut / z.xmax, yEnd + 6, C.bad, 1.2, [3, 3]);
      text(c, '0', x0, yEnd + 16, { size: 11 });
      text(c, 'Nyquist, ' + num(z.nyq, 3) + ' cycles/mm', xN, yEnd + 16, { align: 'center', color: C.warn, size: 11 });
      if (z.cut <= z.xmax * 0.97) text(c, 'cut-off ' + num(z.cut, 3), x0 + w * z.cut / z.xmax, yEnd + 30, { align: 'center', color: C.bad, size: 11 });
      if (xN + 70 < x0 + w - 85) text(c, num(z.xmax, 3) + ' cycles/mm', x0 + w, yEnd + 16, { align: 'right', size: 11 });
    }
    function refresh() {
      const z = calc(), C = col(), sN = z.sys(z.nyq), v = verdict(z), curve = fn => { const a = []; for (let i = 0; i <= 240; i++) { const x = z.xmax * i / 240; a.push([x, fn(x)]); } return a; };
      ro.set('cut', num(z.cut, 3) + ' cycles/mm'); ro.set('nyq', num(z.nyq, 3) + ' cycles/mm'); ro.set('atn', num(100 * sN, 3) + ' %');
      ro.set('m50', num(z.s50, 3) + ' cycles/mm'); ro.set('lw', num(2 * z.s50 * z.h, 3));
      ro.set('lim', num(1000 * z.h / V.pitch, 3) + ' line widths per picture height'); ro.set('who', v[0]);
      verdEl.innerHTML = T.util.box('What the chain tells you', '<p style="margin:0">' + esc(v[1]) + '</p>');
      plot.set({
        x: { label: 'spatial frequency (cycles/mm)', min: 0, max: z.xmax }, y: { label: 'MTF: contrast passed', min: 0, max: 1.05 },
        series: [{ pts: curve(z.dif), label: 'perfect lens (diffraction)', color: C.series[0], width: 1.8 }, { pts: curve(z.pixl), label: 'square pixel', color: C.series[1], width: 1.8 }]
          .concat(V.defocus > 0 ? [{ pts: curve(z.def), label: 'defocus blur', color: C.series[2], width: 1.8 }] : [], V.motion > 0 ? [{ pts: curve(z.mot), label: 'motion blur', color: C.series[3], width: 1.8 }] : [], [{ pts: curve(z.sys), label: 'the whole chain', color: C.text, width: 4 }]),
        vlines: [{ x: z.nyq, label: 'Nyquist', color: C.warn }].concat(z.cut <= z.xmax ? [{ x: z.cut, label: 'cut-off', color: C.bad }] : []),
        hlines: [{ y: 0.5, label: '50 %', color: C.faint }, { y: 0.1, label: '10 %: about the limit of what the eye sees', color: C.faint }],
        marks: [{ x: z.s50, y: 0.5, label: 'MTF50', color: C.ok }, { x: z.nyq, y: sN, label: num(100 * sN, 3) + ' % at Nyquist', color: C.warn }]
      });
      draw();
    }
    L.st.onResize(draw); T.util.onTheme(draw); refresh();
  }
})();
