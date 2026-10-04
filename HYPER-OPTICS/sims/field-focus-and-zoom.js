/* HYPER-OPTICS · sims/field-focus-and-zoom.js — the simulations of the topic "Field of view, focus and zoom".
 *   fz-fov            a camera, its viewing cone and the framed picture: sensor, focal length and distance
 *   fz-crop           the same lens on six sensors: the field each sees on one scene, crop factor, equivalent f/ISO
 *   fz-magnification  object, lens and sensor to scale: magnification, working distance, extension, pixel footprint
 *   fz-dof            near and far limits, the blur of every distance against the circle of confusion (also hyperfocal)
 *   fz-coc            the cone of light near the focus: the blur disc against pixels, the d/1500 criterion and the Airy disc
 *   fz-focusing       unit focusing against an inner focusing group: travel, focal length and field of view with distance
 *   fz-autofocus      phase detection (two half pupils) and contrast detection (hunting), with a lens that moves
 *   fz-zoom           a two-group zoom: groups, rays and the framed scene; parfocal against varifocal (where the image lands)
 *   fz-digital        digital zoom: the crop, nearest / bilinear / bicubic enlargement, against an optical zoom
 *   fz-closeup        extension, close-up lens and working f-number: magnification, working distance, light, depth of field
 *   fz-perspective    a scene in depth: perspective follows the camera position; the dolly zoom
 * Every number comes from kit.optics (O.cam, O.abcd, O.design, O.mtf, O.diff), every lens and ray is drawn with kit.osym.
 * Pictures of scenes (fz-fov, fz-crop, fz-zoom, fz-digital, fz-perspective) are drawn from a small made-up scene.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rad = x => x * D2R;
  const deg = (r, d) => (r * R2D).toFixed(d == null ? 1 : d) + '°';
  const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  // a length given in mm, written the way a person would say it
  function dist(mm) {
    if (!Number.isFinite(mm)) return '∞';
    if (mm >= 1e5) return (mm / 1000).toFixed(0) + ' m';
    if (mm >= 1e4) return (mm / 1000).toFixed(1) + ' m';
    if (mm >= 1000) return (mm / 1000).toFixed(2) + ' m';
    if (mm >= 100) return mm.toFixed(0) + ' mm';
    if (mm >= 10) return mm.toFixed(1) + ' mm';
    return mm.toFixed(2) + ' mm';
  }
  const fn = v => 'f/' + (v >= 10 ? v.toFixed(0) : v.toFixed(1));
  const gcd = (a, b) => (b < 1e-9 ? a : gcd(b, a % b));
  // a rounded box, with or without the API of the context
  function box(c, x, y, w, h, fill, stroke) {
    if (fill) { c.fillStyle = fill; c.fillRect(x, y, w, h); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); }
  }

  /* ================================================================ a made-up scene, as a function of the tangent plane
     u, v are tangents of the angles from the line of sight (1 is 45°); the horizon is v = 0. It holds a person,
     a sign with a chirped bar pattern (to see what resolves), a house, a spire, trees, a road and mountains. */
  const ridge = u => 0.10 + 0.05 * Math.sin(5.1 * u + 0.8) + 0.03 * Math.sin(13 * u + 2) + 0.012 * Math.sin(31 * u);
  function tree(u, v, cx, w) {
    if (Math.abs(u - cx) < 0.014 * w && v > -0.13 * w && v < -0.01 * w) return [95, 68, 45];
    const dx = (u - cx) / (0.09 * w), dy = (v - 0.075 * w) / (0.085 * w);
    if (dx * dx + dy * dy < 1) return [(dx + dy) * 6 + 36, 110 + dy * 20, 52];
    return null;
  }
  function sceneRGB(u, v) {
    // the person, near the camera
    const hx = u - 0.16, hy = v - 0.012;
    if (hx * hx + hy * hy < 0.028 * 0.028) return [232, 188, 158];
    if (Math.abs(u - 0.16) < 0.045 && v > -0.30 && v < -0.02) return v > -0.15 ? [196, 64, 58] : [48, 58, 108];
    // a sign with bars of rising frequency (a chirp) on a pole
    if (u > 0.38 && u < 0.74 && v > 0.10 && v < 0.28) {
      if (u < 0.39 || u > 0.73 || v < 0.11 || v > 0.27) return [30, 30, 34];
      const x = (u - 0.39) / 0.34, ph = 4 * x + 10 * x * x;
      return ph - Math.floor(ph) < 0.5 ? [22, 22, 26] : [246, 246, 240];
    }
    if (Math.abs(u - 0.56) < 0.006 && v > -0.07 && v <= 0.10) return [92, 72, 52];
    // a spire with a clock
    if (Math.abs(u - 0.25) < 0.014 && v > -0.03 && v < 0.27) { const cx = u - 0.25, cy = v - 0.2; return cx * cx + cy * cy < 0.008 * 0.008 ? [250, 250, 245] : [160, 140, 120]; }
    if (v >= 0.27 && v < 0.37 && Math.abs(u - 0.25) < 0.022 * (0.37 - v) / 0.10) return [90, 80, 80];
    // a house
    if (u > -0.62 && u < -0.30 && v > -0.10 && v < 0.07) {
      if (u > -0.49 && u < -0.44 && v < -0.01) return [100, 60, 40];
      if (((u > -0.58 && u < -0.53) || (u > -0.40 && u < -0.35)) && v > -0.02 && v < 0.04) return [150, 200, 235];
      return [226, 205, 170];
    }
    if (v >= 0.07 && v < 0.17 && Math.abs(u + 0.46) < 0.21 * (0.17 - v) / 0.10) return [150, 60, 50];
    const t1 = tree(u, v, -0.85, 1), t2 = tree(u, v, 0.95, 1.1);
    if (t1) return t1;
    if (t2) return t2;
    if (v < 0) {
      if (Math.abs(u) < -v * 0.9) {
        if (Math.abs(u) < 0.003 - v * 0.012 && Math.floor(-v * 40) % 2 === 0) return [235, 225, 150];
        return [112, 112, 118];
      }
      const k = clamp(-v / 0.7, 0, 1);
      return mixc([92, 148, 78], [66, 118, 58], k);
    }
    const r = ridge(u);
    if (v < r) {
      if (r > 0.13 && v > r - 0.025) return [238, 240, 248];
      return mixc([120, 132, 160], [90, 100, 130], v / r);
    }
    const ex = (u + 0.25) / 0.14, ey = (v - 0.45) / 0.032, fx = (u - 0.5) / 0.12, fy = (v - 0.55) / 0.028;
    const sky = mixc([176, 214, 246], [70, 128, 214], clamp(v / 0.7, 0, 1));
    if (ex * ex + ey * ey < 1 || fx * fx + fy * fy < 1) return mixc(sky, [250, 250, 252], 0.7);
    return sky;
  }
  // small pictures are rendered once into an offscreen canvas and drawn from it again (a redraw must stay cheap)
  const bmpCache = new Map();
  function bitmap(key, nx, ny, rgb) {
    let cv = bmpCache.get(key);
    if (cv) return cv;
    if (typeof document === 'undefined' || !document.createElement) return null;
    cv = document.createElement('canvas'); cv.width = nx; cv.height = ny;
    const g = cv.getContext && cv.getContext('2d');
    if (!g || !g.createImageData || !g.putImageData) return null;
    const im = g.createImageData(nx, ny), d = im.data;
    for (let j = 0, k = 0; j < ny; j++) for (let i = 0; i < nx; i++, k += 4) { const p = rgb(i, j); d[k] = p[0]; d[k + 1] = p[1]; d[k + 2] = p[2]; d[k + 3] = 255; }
    g.putImageData(im, 0, 0);
    bmpCache.set(key, cv);
    if (bmpCache.size > 48) bmpCache.delete(bmpCache.keys().next().value);
    return cv;
  }
  function blit(c, cv, x, y, w, h, smooth) { c.save(); c.imageSmoothingEnabled = !!smooth; c.drawImage(cv, x, y, w, h); c.restore(); }
  // the scene seen through a window of the tangent plane: centre (uc, vc), half-width halfU
  function drawScene(c, S, x, y, w, h, uc, vc, halfU, nxOver) {
    const nx = nxOver > 0 ? nxOver : clamp(Math.round(w / 3), 30, 210), ny = Math.max(2, Math.round(nx * h / w)), halfV = halfU * h / w;
    const at = (a, b) => sceneRGB(uc + (2 * a - 1) * halfU, vc + (1 - 2 * b) * halfV);
    const cv = bitmap(['scene', uc.toFixed(5), vc.toFixed(5), halfU.toFixed(5), nx, ny].join('|'), nx, ny, (i, j) => at((i + 0.5) / nx, (j + 0.5) / ny));
    if (cv) blit(c, cv, x, y, w, h, true); else S.image(c, x, y, w, h, nx, ny, at);
  }

  // little figures for the scenes of the simulations: drawn standing on y = yb, centred on x, w wide and h high (px)
  function person(c, x, yb, w, h) {
    c.fillStyle = '#c4403a'; c.fillRect(x - w / 2, yb - 0.82 * h, w, 0.5 * h); c.fillStyle = '#303a70'; c.fillRect(x - w * 0.42, yb - 0.34 * h, w * 0.84, 0.34 * h);
    c.fillStyle = '#e8bc9e'; c.beginPath(); c.arc(x, yb - 0.91 * h, Math.max(1, 0.09 * h), 0, 2 * Math.PI); c.fill();
  }
  function thing(c, kind, x, yb, w, h) {
    if (kind === 'person') return person(c, x, yb, w, h);
    if (kind === 'building') { c.fillStyle = '#9aa3b4'; c.fillRect(x - w / 2, yb - h, w, h); c.fillStyle = '#d7e6f5'; const nx = Math.max(2, Math.round(w / Math.max(2, h * 0.07))), ny = Math.max(3, Math.round(h / Math.max(2, h * 0.07))); for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) c.fillRect(x - w / 2 + w * (i + 0.2) / nx, yb - h + h * (j + 0.2) / ny, w * 0.6 / nx, h * 0.6 / ny); return; }
    if (kind === 'tree') { c.fillStyle = '#5f442d'; c.fillRect(x - w * 0.06, yb - 0.4 * h, w * 0.12, 0.4 * h); c.fillStyle = '#3e7a38'; c.beginPath(); c.ellipse(x, yb - 0.68 * h, w / 2, 0.32 * h, 0, 0, 2 * Math.PI); c.fill(); return; }
    if (kind === 'house') { c.fillStyle = '#e2cdaa'; c.fillRect(x - w / 2, yb - 0.66 * h, w, 0.66 * h); c.fillStyle = '#963c32'; c.beginPath(); c.moveTo(x - w * 0.58, yb - 0.66 * h); c.lineTo(x, yb - h); c.lineTo(x + w * 0.58, yb - 0.66 * h); c.closePath(); c.fill(); c.fillStyle = '#7a4a30'; c.fillRect(x - w * 0.07, yb - 0.35 * h, w * 0.14, 0.35 * h); return; }
    if (kind === 'car') { c.fillStyle = '#2f6fbd'; c.fillRect(x - w / 2, yb - 0.55 * h, w, 0.4 * h); c.fillRect(x - w * 0.28, yb - h, w * 0.56, 0.45 * h); c.fillStyle = '#222'; c.beginPath(); c.arc(x - w * 0.3, yb - 0.14 * h, 0.16 * h, 0, 2 * Math.PI); c.arc(x + w * 0.3, yb - 0.14 * h, 0.16 * h, 0, 2 * Math.PI); c.fill(); return; }
    c.fillStyle = '#6c7078'; c.fillRect(x - w / 2, yb - h, Math.max(1.5, w), h); c.fillStyle = '#ffd96a'; c.fillRect(x - w * 1.5, yb - h, w * 3, Math.max(2, 0.04 * h));
  }

  /* ================================================================ field of view */
  Hyper.sim('fz-fov', {
    title: 'Field of view: what a lens and a sensor see',
    blurb: `A camera stands at the bottom of the plan view. The wedge is its angle of view, the line across it is the plane of the subjects, and the picture on the right is what the sensor records. Everything is to scale: the angles come from the sensor size and the focal length alone.

**Try this**
- Start at 50 mm on full frame (40° across, 7.2 m at 10 m) and drag the **edge of the wedge** or the slider to 24 mm, then 200 mm: the wedge swings from 74° to 10°, and the people move in and out of the frame.
- Change the **sensor** to 1/2.3" without touching the lens: the same 50 mm lens is now a strong telephoto (7° across). The angle belongs to the pair, not to the lens.
- Drag the **line of subjects** towards the camera or away from it: the angle does not change, the width of the scene does (it is about sensor width × distance ÷ focal length).
- Find the focal length at which the whole group of three people just fits across the frame.`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym, C = O.cam;
      const st = kit.stage(box_.stage, { aspect: 0.6, minH: 330 });
      const SENS = ['1/2.3"', '1"', '4/3"', 'APS-C', 'Full frame', '44×33'].map(id => C.sensor(id));
      const ctl = kit.controls(box_.side, [
        { id: 'sensor', type: 'select', label: 'Sensor', options: SENS.map(s => [s.name + ' — ' + s.w + ' × ' + s.h + ' mm', s.id]), value: params.sensor || 'Full frame' },
        { id: 'f', label: 'Focal length', min: 4, max: 800, value: params.f || 50, log: true, sig: 3, unit: 'mm' },
        { id: 'dist', label: 'Distance to the subjects', min: 1, max: 100, value: params.dist || 10, log: true, sig: 3, unit: 'm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['h', 'Horizontal angle'], ['v', 'Vertical angle'], ['d', 'Diagonal angle'], ['W', 'Scene at that distance'], ['kind', 'This lens is'], ['eq', 'Full-frame equivalent']]);
      // subjects in the plane at the chosen distance: [centre X (m), width (m), height (m), kind]
      const SUBJ = [[-9, 3.6, 7, 'tree'], [-5, 6, 5.5, 'house'], [-1.3, 0.55, 1.75, 'person'], [0, 0.55, 1.7, 'person'], [1.3, 0.55, 1.8, 'person'], [4.6, 4.4, 1.5, 'car'], [8, 0.35, 5, 'post'], [11, 3.6, 6.5, 'tree']];
      const geo = { k: 1, cx: 0, by: 0, yl: 0, edge: 0 };
      const loop = kit.loop(() => {
        const c = st.begin(), Cl = kit.colors(), W = st.W, Hh = st.H;
        const sens = C.sensor(V.sensor), f = V.f, s = V.dist;
        const r = C.fov({ f, sensor: sens, distance: s * 1000 });
        const far = C.fov({ f, sensor: sens });
        const Wm = r.W / 1000, Hm = r.Hh / 1000;
        const wide = W >= 560;
        // plan view on the left (or the top), the picture on the right (or the bottom)
        const pv = wide ? { x: 8, y: 8, w: W * 0.5 - 12, h: Hh - 16 } : { x: 8, y: 8, w: W - 16, h: Hh * 0.5 - 12 };
        const pa = wide ? { x: W * 0.5 + 4, y: 34, w: W * 0.5 - 12, h: Hh - 70 } : { x: 8, y: Hh * 0.5 + 30, w: W - 16, h: Hh * 0.5 - 56 };
        box(c, pv.x, pv.y, pv.w, pv.h, Cl.surface, Cl.grid);
        const cx = pv.x + pv.w / 2, by = pv.y + pv.h - 26;
        const Lh = Math.max(0.62 * Wm, 0.4 * s), k = Math.min(pv.w / (2 * Lh), (pv.h - 70) / s);
        const yl = by - s * k, A = far.h;
        geo.k = k; geo.cx = cx; geo.by = by; geo.yl = yl; geo.edge = Wm / 2 * k;
        // the wedge
        c.fillStyle = Cl.dark ? 'rgba(123,140,255,0.14)' : 'rgba(80,100,220,0.12)';
        c.beginPath(); c.moveTo(cx, by); c.lineTo(cx - Wm / 2 * k, yl); c.lineTo(cx + Wm / 2 * k, yl); c.closePath(); c.fill();
        c.strokeStyle = Cl.accent; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx - Wm / 2 * k, yl); c.lineTo(cx, by); c.lineTo(cx + Wm / 2 * k, yl); c.stroke();
        // the plane of the subjects
        c.save(); c.setLineDash([5, 4]); c.strokeStyle = Cl.muted; c.beginPath(); c.moveTo(pv.x + 6, yl); c.lineTo(pv.x + pv.w - 6, yl); c.stroke(); c.restore();
        for (const [X, w, , kind] of SUBJ) {
          const px = cx + X * k, inside = Math.abs(X) < Wm / 2 + w / 2;
          c.fillStyle = inside ? Cl.ok : Cl.faint;
          if (px > pv.x + 3 && px < pv.x + pv.w - 3) c.fillRect(px - Math.max(1.5, w * k / 2), yl - 2.5, Math.max(3, w * k), 5);
        }
        kit.dot(c, cx - Wm / 2 * k, yl, 5, Cl.accent); kit.dot(c, cx + Wm / 2 * k, yl, 5, Cl.accent);
        // the camera
        c.fillStyle = Cl.text; c.fillRect(cx - 9, by, 18, 12); c.beginPath(); c.moveTo(cx - 5, by); c.lineTo(cx - 3, by - 4); c.lineTo(cx + 3, by - 4); c.lineTo(cx + 5, by); c.closePath(); c.fill();
        S.angle(c, cx, by, clamp(s * k * 0.28, 24, 60), -Math.PI / 2 - A / 2, -Math.PI / 2 + A / 2, deg(A), { size: 11.5 });
        S.dim(c, pv.x + 16, by, pv.x + 16, yl, dist(s * 1000), { off: 9 });
        S.dim(c, cx - Wm / 2 * k, yl - 14, cx + Wm / 2 * k, yl - 14, dist(Wm * 1000) + ' wide', { off: -9 });
        kit.label(c, 'plan view, to scale', pv.x + 10, pv.y + 12, { color: Cl.muted, size: 11.5 });
        // what the sensor records
        const asp = sens.w / sens.h;
        let fw = pa.w, fh = fw / asp; if (fh > pa.h) { fh = pa.h; fw = fh * asp; }
        const fx = pa.x + (pa.w - fw) / 2, fy = pa.y + (pa.h - fh) / 2, pm = fw / Wm;
        box(c, pa.x - 4, pa.y - 28, pa.w + 8, pa.h + 56, Cl.surface, Cl.grid);
        c.save(); c.beginPath(); c.rect(fx, fy, fw, fh); c.clip();
        const g = c.createLinearGradient(0, fy, 0, fy + fh / 2); g.addColorStop(0, '#4f84d2'); g.addColorStop(1, '#b8d8f4'); c.fillStyle = g; c.fillRect(fx, fy, fw, fh);
        const yh = fy + fh / 2, yg = yh + 1.5 * pm;                       // the horizon is at the eye height of the camera, 1.5 m above the ground
        c.fillStyle = '#5e9a4c'; c.fillRect(fx, Math.max(fy, yh), fw, fh);
        c.fillStyle = '#6aa857'; c.fillRect(fx, yg, fw, fh);
        c.fillStyle = '#6f7076'; c.fillRect(fx, yg + 0.0, fw, Math.min(2.5 * pm, fh));
        for (const [X, w, h, kind] of SUBJ) thing(c, kind, fx + fw / 2 + X * pm, yg + 0.4 * pm, w * pm, h * pm);
        c.restore();
        c.strokeStyle = Cl.text; c.lineWidth = 1.5; c.strokeRect(fx, fy, fw, fh);
        kit.label(c, 'what the sensor records (' + sens.w + ' × ' + sens.h + ' mm)', pa.x + pa.w / 2, pa.y - 14, { align: 'center', color: Cl.muted, size: 11.5 });
        kit.label(c, dist(Wm * 1000) + ' × ' + dist(Hm * 1000), pa.x + pa.w / 2, pa.y + pa.h + 14, { align: 'center', color: Cl.muted, size: 11.5 });
        const ratio = f / sens.diag;
        const kind = ratio < 0.5 ? 'ultra-wide-angle' : ratio < 0.85 ? 'wide-angle' : ratio < 1.3 ? 'normal' : ratio < 3 ? 'telephoto' : ratio < 7 ? 'long telephoto' : 'super-telephoto';
        ro.set('h', deg(far.h) + '  (across ' + sens.w + ' mm)');
        ro.set('v', deg(far.v) + '  (across ' + sens.h + ' mm)');
        ro.set('d', deg(far.d) + '  (across ' + sens.diag.toFixed(1) + ' mm)');
        ro.set('W', dist(Wm * 1000) + ' wide, ' + dist(Hm * 1000) + ' high');
        ro.set('kind', kind + ' (f ÷ diagonal = ' + ratio.toFixed(2) + ')');
        ro.set('eq', (f * sens.crop).toFixed(f * sens.crop < 100 ? 1 : 0) + ' mm  (× ' + sens.crop.toFixed(2) + ')');
      }, box_.stage);
      kit.drag(st, {
        hover: true,
        hit: p => {
          if (Math.hypot(p.x - (geo.cx - geo.edge), p.y - geo.yl) < 12 || Math.hypot(p.x - (geo.cx + geo.edge), p.y - geo.yl) < 12) return 'edge';
          return Math.abs(p.y - geo.yl) < 8 && p.x < st.W * (st.W >= 560 ? 0.5 : 1) ? 'plane' : null;
        },
        move: (what, p) => {
          const sens = C.sensor(V.sensor);
          if (what === 'plane') ctl.set('dist', clamp((geo.by - p.y) / geo.k, 1, 100));
          else {
            const Wm = 2 * Math.abs(p.x - geo.cx) / geo.k;
            ctl.set('f', clamp(C.focalFor(sens.w, Math.max(1, Wm * 1000), V.dist * 1000), 4, 800));
          }
          loop.once();
        }
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ crop factor */
  Hyper.sim('fz-crop', {
    title: 'Crop factor: one lens, six sensors',
    blurb: `One scene, one lens, six sensors. Each coloured rectangle is the part of the scene that sensor records with the lens you have set; the nested rectangles on the left are the sensors themselves, to scale. The chosen sensor is the thick one.

**Try this**
- With 35 mm set, see how the rectangle of **APS-C** is the field of a 53 mm lens on full frame (crop factor 1.53), and that of **Four Thirds** the field of a 70 mm lens.
- Choose the 1/2.3" sensor and the read-outs: its f/2 lens has the depth of field of a full-frame f/11, and its ISO 100 is the noise of ISO 3200.
- Set the lens to **8 mm**: the medium-format rectangle runs off the picture. A lens made for a small sensor may not cover a large one; here the rectangles only say how much of the scene each would see.
- Compare *equivalent* focal length and f-number: the entrance pupil, f ÷ N, is the same in both.`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym, C = O.cam;
      const st = kit.stage(box_.stage, { aspect: 0.56, minH: 320 });
      const FMT = ['44×33', 'Full frame', 'APS-C', '4/3"', '1"', '1/2.3"'];
      const SENS = FMT.map(id => C.sensor(id));
      const ctl = kit.controls(box_.side, [
        { id: 'sensor', type: 'select', label: 'The sensor you use', options: SENS.map(s => [s.name + ' — crop ' + s.crop.toFixed(2), s.id]), value: params.sensor || 'APS-C' },
        { id: 'f', label: 'Focal length of the lens', min: 6, max: 400, value: params.f || 35, log: true, sig: 3, unit: 'mm' },
        { id: 'N', label: 'f-number', min: 1, max: 16, value: params.N || 2, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'iso', label: 'ISO', min: 100, max: 6400, value: 400, log: true, sig: 2, fmt: v => 'ISO ' + Math.round(v / 10) * 10 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['crop', 'Crop factor'], ['fov', 'Angle of view (h × v)'], ['feq', 'Equivalent focal length'], ['Neq', 'Equivalent f-number'], ['isoeq', 'Equivalent ISO'], ['D', 'Entrance pupil, f ÷ N']]);
      const loop = kit.loop(() => {
        const c = st.begin(), Cl = kit.colors(), W = st.W, Hh = st.H;
        const sel = C.sensor(V.sensor), f = V.f;
        const lw = Math.min(W * 0.32, 230), sx = 10, sw = lw;
        // the sensors to scale, nested about a common centre
        box(c, sx, 8, sw, Hh - 16, Cl.surface, Cl.grid);
        const ps = (sw - 24) / SENS[0].w, ccx = sx + sw / 2, ccy = 8 + (Hh - 16) / 2 - 6;
        SENS.forEach((s, i) => {
          const col = Cl.series[i % Cl.series.length], isSel = s.id === sel.id;
          c.fillStyle = isSel ? col : 'rgba(0,0,0,0)'; c.globalAlpha = 0.22; if (isSel) c.fillRect(ccx - s.w * ps / 2, ccy - s.h * ps / 2, s.w * ps, s.h * ps); c.globalAlpha = 1;
          c.strokeStyle = col; c.lineWidth = isSel ? 3 : 1.4; c.strokeRect(ccx - s.w * ps / 2, ccy - s.h * ps / 2, s.w * ps, s.h * ps);
        });
        kit.label(c, 'sensors, to scale', sx + sw / 2, 22, { align: 'center', color: Cl.muted, size: 11.5 });
        kit.label(c, sel.w + ' × ' + sel.h + ' mm', sx + sw / 2, Hh - 22, { align: 'center', color: Cl.muted, size: 11.5 });
        // the scene with the rectangles
        const px = sx + sw + 10, pw = W - px - 8, ph = pw * 0.66, py = 8 + Math.max(0, (Hh - 16 - ph - 58) / 2);
        const halfU = 1;
        drawScene(c, S, px, py, pw, ph, 0, 0, halfU);
        c.save(); c.beginPath(); c.rect(px, py, pw, ph); c.clip();
        const mx = u => px + pw / 2 + u / halfU * pw / 2, my = v => py + ph / 2 - v / halfU * pw / 2;
        SENS.forEach((s, i) => {
          const col = Cl.series[i % Cl.series.length], isSel = s.id === sel.id, hu = s.w / (2 * f), hv = s.h / (2 * f);
          c.strokeStyle = col; c.lineWidth = isSel ? 3.4 : 1.8; c.strokeRect(mx(-hu), my(hv), mx(hu) - mx(-hu), my(-hv) - my(hv));
        });
        c.restore();
        c.strokeStyle = Cl.text; c.lineWidth = 1; c.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);
        // the legend
        let lx = px, ly = py + ph + 16;
        SENS.forEach((s, i) => {
          const col = Cl.series[i % Cl.series.length], a = C.fov({ f, sensor: s });
          const txt = s.id + ' · ' + deg(a.h, 0);
          c.fillStyle = col; c.fillRect(lx, ly - 5, 10, 10);
          kit.label(c, txt, lx + 14, ly, { size: 11, color: s.id === sel.id ? Cl.text : Cl.muted, weight: s.id === sel.id ? 650 : 500 });
          lx += pw / 3; if (i === 2) { lx = px; ly += 18; }
        });
        const a = C.fov({ f, sensor: sel });
        ro.set('crop', sel.crop.toFixed(2) + '  (43.27 mm ÷ ' + sel.diag.toFixed(2) + ' mm)');
        ro.set('fov', deg(a.h) + ' × ' + deg(a.v));
        ro.set('feq', (f * sel.crop).toFixed(f * sel.crop < 100 ? 1 : 0) + ' mm on full frame');
        ro.set('Neq', fn(V.N * sel.crop) + ' for the same depth of field');
        ro.set('isoeq', 'ISO ' + Math.round(V.iso * sel.crop * sel.crop) + ' for the same noise');
        ro.set('D', (f / V.N).toFixed(1) + ' mm  (the same for the pair)');
      }, box_.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ magnification and working distance */
  Hyper.sim('fz-magnification', {
    title: 'Magnification and working distance',
    blurb: `The machine-vision way of choosing a lens: the sensor and the field you want fix the **magnification**; with a focal length (or a working distance) the rest follows. The picture is the thin-lens diagram of object, lens and sensor, with the distances to scale. Heights are drawn larger than lengths so that you can see the image; the label says how much.

**Try this**
- Keep *Field width* and slide the focal length: a short lens needs a short working distance for the same field (25 mm → 150 mm away, 50 mm → 300 mm).
- Set the magnification to 1 (field width equal to the sensor width): the object-to-sensor distance is 4 f, the least it can ever be.
- Switch to *Working distance*, put the lens 300 mm away and move the focal length: the field width and the pixel footprint change together.
- Choose a smaller pixel and read how the footprint on the object (pixel ÷ m) shrinks.`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym, C = O.cam;
      const st = kit.stage(box_.stage, { aspect: 0.5, minH: 300 });
      const SENS = ['1/3"', '1/2"', '2/3"', '1"', '1.1"'].map(id => C.sensor(id));
      const ctl = kit.controls(box_.side, [
        { id: 'by', type: 'select', label: 'I set', options: [['the field width', 'field'], ['the working distance', 'dist']], value: params.by || 'field' },
        { id: 'sensor', type: 'select', label: 'Sensor', options: SENS.map(s => [s.id + ' — ' + s.w + ' × ' + s.h + ' mm', s.id]), value: params.sensor || '2/3"' },
        { id: 'f', label: 'Focal length', min: 6, max: 200, value: params.f || 25, log: true, sig: 3, unit: 'mm' },
        { id: 'Wf', label: 'Field width on the object', min: 5, max: 1000, value: params.W || 44, log: true, sig: 3, unit: 'mm' },
        { id: 's', label: 'Object distance (from the lens)', min: 30, max: 3000, value: 150, log: true, sig: 3, unit: 'mm' },
        { id: 'p', type: 'select', label: 'Pixel pitch', options: [['1.85 µm', 1.85], ['3.45 µm', 3.45], ['5.5 µm', 5.5], ['9 µm', 9]], value: 3.45 }
      ], (id) => { if (id === 'by') show(); loop.once(); });
      const V = ctl.values;
      function show() { ctl.show('Wf', V.by === 'field'); ctl.show('s', V.by === 'dist'); }
      show();
      const ro = kit.readout(box_.side, [['m', 'Magnification'], ['W', 'Field on the object'], ['s', 'Object distance'], ['v', 'Lens to sensor'], ['T', 'Object to sensor'], ['q', 'One pixel covers'], ['n', 'Pixels across the field']]);
      function solve() {
        const sens = C.sensor(V.sensor), f = V.f;
        let m, s, Wf;
        if (V.by === 'field') { Wf = V.Wf; m = sens.w / Wf; s = f * (1 + 1 / m); }
        else { s = Math.max(V.s, 1.05 * f); m = f / (s - f); Wf = sens.w / m; }
        return { sens, f, m, s, Wf, v: f * (1 + m) };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), Cl = kit.colors(), W = st.W, Hh = st.H;
        const { sens, f, m, s, Wf, v } = solve();
        const mp = S.map(st, -s, v, Wf / 2 * 1.1, { left: 30, right: 34, top: 34, bottom: 62, stretch: 3 });
        const y0 = mp.y0, X = mp.X, sy = mp.sy;
        S.axis(c, X(-s) - 10, y0, X(v) + 22);
        const objH = sy * Wf / 2, imgH = sy * sens.w / 2;
        // object, rays, lens, image, sensor
        S.object(c, X(-s), y0, objH, { label: 'object' });
        const tip = [X(-s), y0 - objH], img = [X(v), y0 + imgH];
        S.ray(c, [tip, [X(0), y0], img], { color: Cl.warn, width: 1.3 });
        S.ray(c, [tip, [X(0), tip[1]], img], { color: Cl.accent, width: 1.3 });
        S.thinLens(c, X(0), y0, Math.max(objH, 16), f, { foci: f * mp.s });
        S.object(c, X(v), y0, -imgH, { label: 'image' });
        S.sensor(c, X(v) + 1, y0, Math.max(imgH + 3, 6), { pixels: 9 });
        const yd = y0 + Math.max(objH, 16) + 22;
        S.dim(c, X(-s), yd, X(0), yd, 's = ' + dist(s), { off: 12 });
        S.dim(c, X(0), yd + 22, X(v), yd + 22, 'v = ' + dist(v), { off: 12 });
        kit.label(c, 'heights drawn ×' + mp.stretch.toFixed(1) + ' against lengths', 12, 16, { color: Cl.faint, size: 11 });
        kit.label(c, 'm = ' + m.toFixed(m < 0.1 ? 3 : 2) + '×   (1:' + (1 / m).toFixed(1) + ')', W - 12, 16, { align: 'right', weight: 650 });
        const q = V.p / m;
        ro.set('m', m.toFixed(m < 0.1 ? 4 : 3) + '×  = ' + sens.w + ' mm ÷ ' + dist(Wf));
        ro.set('W', dist(Wf) + ' × ' + dist(Wf * sens.h / sens.w));
        ro.set('s', dist(s) + '  = f (1 + 1/m)');
        ro.set('v', dist(v) + '  = f (1 + m), ' + dist(v - f) + ' beyond f');
        ro.set('T', dist(s + v) + '  = f (2 + m + 1/m); least 4f = ' + dist(4 * f));
        ro.set('q', q.toFixed(q < 10 ? 2 : 1) + ' µm on the object');
        ro.set('n', Math.round(sens.w / (V.p / 1000)) + ' pixels');
      }, box_.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ depth of field (and the hyperfocal distance) */
  Hyper.sim('fz-dof', {
    title: 'Depth of field: where the blur stays below the limit',
    blurb: `The upper band is the scene along the axis, distances on a **log scale**; the shaded zone is the depth of field between the near and far limits. Below, every subject's point is shown as the blur disc it makes on the sensor, against a ring that is the circle of confusion: inside the ring it counts as sharp. The graph repeats it for every distance.

**Try this**
- Open the aperture from f/8 to f/2: the zone shrinks to a sliver around the focus line. Close it to f/22 and it stretches (until the diffraction of the real lens would spoil it).
- Press **Focus at the hyperfocal distance**: the far limit jumps to infinity and the near limit sits at exactly half the focus distance.
- Switch the **sensor** to 1/2.3" without changing the lens: much more depth. Then ask the picture to be judged more strictly (d/3000): the zone shrinks again.
- Drag the **focus line** along the scene; at 1 m with a 200 mm lens at f/4 only a few millimetres are sharp.`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym, C = O.cam;
      const st = kit.stage(box_.stage, { aspect: 0.64, minH: 350 });
      const SENS = ['1/2.3"', '1"', '4/3"', 'APS-C', 'Full frame'].map(id => C.sensor(id));
      const hyper = params.mode === 'hyper';
      const f0 = params.f || 50, N0 = params.N || (hyper ? 8 : 4), sens0 = C.sensor(params.sensor || 'Full frame');
      const H0 = C.hyperfocal(f0, N0, C.coc(sens0.diag)) / 1000;
      const ctl = kit.controls(box_.side, [
        { id: 'sensor', type: 'select', label: 'Sensor', options: SENS.map(s => [s.name, s.id]), value: sens0.id },
        { id: 'f', label: 'Focal length', min: 8, max: 400, value: f0, log: true, sig: 3, unit: 'mm' },
        { id: 'N', label: 'f-number', min: 1.4, max: 32, value: N0, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 's', label: 'Focus distance', min: 0.3, max: 1000, value: params.s || (hyper ? clamp(H0, 0.3, 1000) : 3), log: true, sig: 3, unit: 'm' },
        { id: 'k', type: 'select', label: 'Circle of confusion', options: [['diagonal ÷ 1500 (a print viewed normally)', 1500], ['diagonal ÷ 3000 (critical viewing)', 3000], ['diagonal ÷ 1000 (casual)', 1000]], value: 1500 },
        { type: 'buttons', items: [{ id: 'hyp', label: 'Focus at the hyperfocal distance', primary: hyper }, { id: 'three', label: 'Focus at 3 m' }] }
      ], (id) => {
        if (id === 'hyp') ctl.set('s', clamp(calc().H / 1000, 0.3, 1000));
        else if (id === 'three') ctl.set('s', 3);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['near', 'Near limit'], ['far', 'Far limit'], ['depth', 'Depth of field'], ['split', 'In front : behind the focus'], ['H', 'Hyperfocal distance'], ['c', 'Circle of confusion'], ['bg', 'Blur of a point at infinity']]);
      const plot = kit.plot(box_.side, {}, 190);
      function calc() {
        const sens = C.sensor(V.sensor), f = V.f, N = V.N, c = sens.diag / V.k;
        const s = Math.max(V.s * 1000, 1.05 * f);
        const r = C.dof({ f, N, s, c });
        return { sens, f, N, c, s, near: r.near, far: r.far, H: r.H };
      }
      const LO = 0.25, HI = 2000, L0 = Math.log10(LO), L1 = Math.log10(HI);
      const SUBJ = [0.4, 0.7, 1.2, 2, 3.5, 6, 12, 25, 60, 150, 400];
      const geo = { x0: 0, x1: 1 };
      const X = d => geo.x0 + (Math.log10(clamp(d, LO, HI)) - L0) / (L1 - L0) * (geo.x1 - geo.x0);
      const invX = x => Math.pow(10, L0 + (x - geo.x0) / (geo.x1 - geo.x0) * (L1 - L0));
      const loop = kit.loop(() => {
        const c = st.begin(), Cl = kit.colors(), W = st.W, Hh = st.H;
        const m = calc(), f = m.f, N = m.N, s = m.s;
        geo.x0 = 26; geo.x1 = W - 20;
        const yTop = 40, yAxis = Hh * 0.43;
        // the zone of acceptable sharpness
        const xn = X(m.near / 1000), xf = Number.isFinite(m.far) ? X(m.far / 1000) : geo.x1;
        c.fillStyle = Cl.dark ? 'rgba(34,179,122,0.18)' : 'rgba(34,179,122,0.2)'; c.fillRect(xn, yTop - 6, Math.max(2, xf - xn), yAxis - yTop + 10);
        c.strokeStyle = Cl.ok; c.lineWidth = 1.4; c.beginPath(); c.moveTo(xn, yTop - 6); c.lineTo(xn, yAxis + 4); if (Number.isFinite(m.far)) { c.moveTo(xf, yTop - 6); c.lineTo(xf, yAxis + 4); } c.stroke();
        // the axis with its distances
        c.strokeStyle = Cl.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(geo.x0, yAxis + 4); c.lineTo(geo.x1, yAxis + 4); c.stroke();
        for (const d of [0.3, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]) { c.beginPath(); c.moveTo(X(d), yAxis + 4); c.lineTo(X(d), yAxis + 9); c.stroke(); kit.label(c, d >= 1000 ? '1 km' : d + ' m', X(d), yAxis + 20, { align: 'center', size: 10.5, color: Cl.faint }); }
        // the camera and the subjects (posts with a head)
        c.fillStyle = Cl.text; c.fillRect(6, yAxis - 14, 12, 12); c.fillRect(18, yAxis - 11, 5, 6);
        for (const d of SUBJ) {
          const inside = d * 1000 >= m.near && d * 1000 <= m.far, x = X(d);
          c.strokeStyle = inside ? Cl.ok : Cl.muted; c.fillStyle = c.strokeStyle; c.lineWidth = 2;
          c.beginPath(); c.moveTo(x, yAxis); c.lineTo(x, yAxis - 26); c.stroke(); kit.dot(c, x, yAxis - 30, 4, c.fillStyle);
        }
        // the focus line, the limits, the hyperfocal mark
        c.strokeStyle = Cl.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(X(s / 1000), yTop - 14); c.lineTo(X(s / 1000), yAxis + 6); c.stroke();
        kit.label(c, 'focus ' + dist(s), X(s / 1000), yTop - 24, { align: 'center', color: Cl.accent, weight: 650, size: 11.5 });
        kit.label(c, 'near ' + dist(m.near), Math.max(xn - 4, 60), yTop + 8, { align: 'right', color: Cl.ok, size: 11 });
        kit.label(c, Number.isFinite(m.far) ? 'far ' + dist(m.far) : 'far ∞', Math.min(xf + 4, W - 70), yTop + 8, { align: 'left', color: Cl.ok, size: 11 });
        if (m.H / 1000 > LO && m.H / 1000 < HI) { c.save(); c.setLineDash([3, 4]); c.strokeStyle = Cl.warn; c.beginPath(); c.moveTo(X(m.H / 1000), yAxis - 40); c.lineTo(X(m.H / 1000), yAxis + 4); c.stroke(); c.restore(); kit.label(c, 'H', X(m.H / 1000), yAxis - 46, { align: 'center', color: Cl.warn, size: 11 }); }
        kit.label(c, 'the scene along the axis (log scale)', geo.x0 + 2, 14, { color: Cl.muted, size: 11.5 });
        // the blur disc of every subject against the circle of confusion
        const yb = Hh * 0.78, rc = 7;
        kit.label(c, 'blur disc on the sensor for a point at each distance (ring = circle of confusion)', geo.x0 + 2, Hh * 0.58, { color: Cl.muted, size: 11.5 });
        SUBJ.forEach((d, si) => {
          const dd = d * 1000, b = f * f * Math.abs(s - dd) / (N * dd * (s - f)), ratio = b / m.c, x = X(d), rr = clamp(ratio * rc, 0.6, 38);
          const ok = ratio <= 1.0001;
          c.fillStyle = ok ? 'rgba(34,179,122,0.5)' : 'rgba(229,72,77,0.38)'; c.beginPath(); c.arc(x, yb, rr, 0, 2 * Math.PI); c.fill();
          c.strokeStyle = Cl.text; c.lineWidth = 1; c.beginPath(); c.arc(x, yb, rc, 0, 2 * Math.PI); c.stroke();
          if (W >= 520 || si % 2 === 0) {
            kit.label(c, ratio < 10 ? ratio.toFixed(1) + '×' : ratio.toFixed(0) + '×', x, yb + 46, { align: 'center', size: 10.5, color: ok ? Cl.ok : Cl.muted });
            kit.label(c, d + ' m', x, yb + 60, { align: 'center', size: 10, color: Cl.faint });
          }
        });
        kit.label(c, 'disc ÷ c', geo.x0 + 2, yb + 46, { size: 10, color: Cl.faint });
        // the graph
        const pts = [], cu = m.c * 1000, ymax = cu * 5;
        for (let i = 0; i <= 120; i++) { const d = LO * Math.pow(HI / LO, i / 120) * 1000, b = f * f * Math.abs(s - d) / (N * d * (s - f)) * 1000; pts.push([d / 1000, Math.min(b, ymax)]); }
        const vl = [{ x: s / 1000, label: 'focus' }, { x: m.near / 1000, label: 'near' }];
        if (Number.isFinite(m.far)) vl.push({ x: m.far / 1000, label: 'far' });
        plot.set({ series: [{ pts, label: 'blur disc (µm)' }], x: { label: 'object distance (m)', log: true, min: LO, max: HI }, y: { label: 'blur disc on the sensor (µm)', min: 0, max: ymax }, hlines: [{ y: cu, label: 'c = ' + cu.toFixed(1) + ' µm' }], vlines: vl });
        const bg = f * f / (N * (s - f));
        ro.set('near', dist(m.near));
        ro.set('far', Number.isFinite(m.far) ? dist(m.far) : 'infinity');
        ro.set('depth', Number.isFinite(m.far) ? dist(m.far - m.near) : 'from ' + dist(m.near) + ' to infinity');
        ro.set('split', Number.isFinite(m.far) ? (100 * (s - m.near) / (m.far - m.near)).toFixed(0) + ' % : ' + (100 * (m.far - s) / (m.far - m.near)).toFixed(0) + ' %' : 'all the rest is behind');
        ro.set('H', dist(m.H) + (s >= m.H ? '  (focus is at or beyond it)' : ''));
        ro.set('c', (m.c * 1000).toFixed(1) + ' µm');
        ro.set('bg', (bg * 1000).toFixed(1) + ' µm = ' + (bg / m.c).toFixed(1) + ' × c');
      }, box_.stage);
      kit.drag(st, {
        hover: true,
        hit: p => (Math.abs(p.x - X(calc().s / 1000)) < 9 && p.y < st.H * 0.5 ? 'focus' : null),
        move: (w, p) => { ctl.set('s', clamp(invX(p.x), 0.3, 1000)); loop.once(); }
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ circle of confusion */
  Hyper.sim('fz-coc', {
    title: 'The circle of confusion: how big a blur still looks like a point',
    blurb: `Left, the cone of light near its focus (magnified: the window is only ±0.6 mm wide). Move the **sensor** along it and the point becomes a disc: the disc is where the cone meets the sensor plane. Right, that disc seen from the front, against the pixels and against three yardsticks: the standard circle of confusion (diagonal ÷ 1500, green), a two-pixel criterion (orange, dashed) and the Airy disc that diffraction makes anyway (grey, dashed).

**Try this**
- Set the sensor to *full frame*, f/4 and slide the focus error until the disc just touches the green ring: that is the 29 µm that every depth-of-field table assumes.
- Change to the *1/2.3"* sensor: the same ring shrinks to 5 µm, and a disc that was fine on full frame now fails.
- Raise the f-number to f/16: the Airy disc grows larger than the green ring on small sensors, so even a perfectly focused point is "not a point".
- Make the pixels small (2.4 µm): the orange ring is stricter than the print criterion.`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym, C = O.cam;
      const st = kit.stage(box_.stage, { aspect: 0.5, minH: 300 });
      const SENS = ['1/2.3"', '1"', '4/3"', 'APS-C', 'Full frame'].map(id => C.sensor(id));
      const ctl = kit.controls(box_.side, [
        { id: 'sensor', type: 'select', label: 'Sensor (sets d ÷ 1500)', options: SENS.map(s => [s.name, s.id]), value: params.sensor || 'Full frame' },
        { id: 'N', label: 'f-number', min: 1.4, max: 22, value: params.N || 4, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'dz', label: 'Sensor out of focus by', min: -400, max: 400, step: 5, value: params.dz != null ? params.dz : 120, unit: 'µm' },
        { id: 'p', type: 'select', label: 'Pixel pitch', options: [['2.4 µm', 2.4], ['3.45 µm', 3.45], ['6 µm', 6], ['9 µm', 9]], value: 6 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['b', 'Blur disc on the sensor'], ['c1', 'Circle of confusion, d ÷ 1500'], ['c2', 'Two-pixel criterion'], ['airy', 'Airy disc, 2.44 λ N'], ['v', 'On a print'], ['v2', 'At 100 % on a screen']]);
      const loop = kit.loop(() => {
        const c = st.begin(), Cl = kit.colors(), W = st.W, Hh = st.H;
        const sens = C.sensor(V.sensor), N = V.N, dz = V.dz;
        const b = Math.abs(dz) / N, c1 = sens.diag / 1500 * 1000, c2 = 2 * V.p, airy = 2.44 * 0.55 * N;
        // the cone near the focus, to scale: z along the axis (µm), the focus at z = 0
        const lw = Math.round(W * 0.58), zr = 600;
        box(c, 8, 8, lw - 8, Hh - 16, Cl.surface, Cl.grid);
        const m = S.map({ W: lw, H: Hh }, -zr, zr, zr / (2 * N) * 1.05 + 8, { left: 16, right: 16, top: 30, bottom: 36 });
        const X = z => m.X(z), Y = y => m.Y(y);
        S.axis(c, X(-zr), m.y0, X(zr));
        c.fillStyle = Cl.dark ? 'rgba(255,170,60,0.16)' : 'rgba(255,150,30,0.16)';
        c.beginPath(); c.moveTo(X(-zr), Y(zr / (2 * N))); c.lineTo(X(0), Y(0)); c.lineTo(X(-zr), Y(-zr / (2 * N))); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(X(zr), Y(zr / (2 * N))); c.lineTo(X(0), Y(0)); c.lineTo(X(zr), Y(-zr / (2 * N))); c.closePath(); c.fill();
        S.ray(c, [[X(-zr), Y(zr / (2 * N))], [X(0), Y(0)], [X(zr), Y(-zr / (2 * N))]], { color: Cl.warn, width: 1.4, arrows: false });
        S.ray(c, [[X(-zr), Y(-zr / (2 * N))], [X(0), Y(0)], [X(zr), Y(zr / (2 * N))]], { color: Cl.warn, width: 1.4, arrows: false });
        kit.dot(c, X(0), m.y0, 3.5, Cl.warn);
        kit.label(c, 'focus', X(0), m.y0 + 16, { align: 'center', color: Cl.warn, size: 11.5 });
        // the sensor plane and the disc it cuts out
        const hz = b / 2;
        c.strokeStyle = Cl.ok; c.lineWidth = 2.4; c.beginPath(); c.moveTo(X(dz), Y(zr / (2 * N) * 1.05)); c.lineTo(X(dz), Y(-zr / (2 * N) * 1.05)); c.stroke();
        c.strokeStyle = Cl.bad; c.lineWidth = 5; c.beginPath(); c.moveTo(X(dz), Y(hz)); c.lineTo(X(dz), Y(-hz)); c.stroke();
        kit.label(c, 'sensor', X(dz), Hh - 28 - 2, { align: 'center', color: Cl.ok, size: 11.5 });
        kit.label(c, 'the cone of light near its focus, window ' + (2 * zr) + ' µm long', 18, 20, { color: Cl.muted, size: 11 });
        kit.label(c, 'f/' + N.toFixed(1) + ': half-angle ' + deg(Math.atan(1 / (2 * N))), 18, Hh - 16, { color: Cl.faint, size: 11 });
        // the disc seen from the front, against the pixels
        const rx = lw + 10, rw = W - rx - 8, rh = Math.min(rw, Hh - 70), cx = rx + rw / 2, cy = 14 + rh / 2 + 14, half = 40;
        const pxu = rh / 2 / half;
        box(c, rx - 2, 8, rw + 4, Hh - 16, Cl.surface, Cl.grid);
        c.save(); c.beginPath(); c.rect(cx - rh / 2, cy - rh / 2, rh, rh); c.clip();
        c.strokeStyle = Cl.grid; c.lineWidth = 1; c.beginPath();
        for (let u = -half; u <= half; u += V.p) { const p = cx + u * pxu; c.moveTo(p, cy - rh / 2); c.lineTo(p, cy + rh / 2); c.moveTo(cx - rh / 2, cy + u * pxu); c.lineTo(cx + rh / 2, cy + u * pxu); }
        c.stroke();
        c.fillStyle = b <= c1 ? 'rgba(34,179,122,0.45)' : 'rgba(229,72,77,0.4)'; c.beginPath(); c.arc(cx, cy, Math.max(0.5, b / 2 * pxu), 0, 2 * Math.PI); c.fill();
        c.lineWidth = 1.6; c.strokeStyle = Cl.ok; c.beginPath(); c.arc(cx, cy, c1 / 2 * pxu, 0, 2 * Math.PI); c.stroke();
        c.save(); c.setLineDash([5, 3]); c.strokeStyle = Cl.warn; c.beginPath(); c.arc(cx, cy, c2 / 2 * pxu, 0, 2 * Math.PI); c.stroke(); c.strokeStyle = Cl.muted; c.beginPath(); c.arc(cx, cy, airy / 2 * pxu, 0, 2 * Math.PI); c.stroke(); c.restore();
        c.restore();
        c.strokeStyle = Cl.text; c.lineWidth = 1; c.strokeRect(cx - rh / 2 + 0.5, cy - rh / 2 + 0.5, rh - 1, rh - 1);
        kit.label(c, 'the disc, box 80 µm; grid = pixels', cx, cy + rh / 2 + 14, { align: 'center', color: Cl.muted, size: 10.5 });
        kit.label(c, 'green d/1500 · orange 2 px · grey Airy', cx, cy + rh / 2 + 28, { align: 'center', color: Cl.faint, size: 10.5 });
        ro.set('b', b.toFixed(1) + ' µm  (= out of focus ÷ N)');
        ro.set('c1', c1.toFixed(1) + ' µm  for ' + sens.name);
        ro.set('c2', c2.toFixed(1) + ' µm  (2 × ' + V.p + ' µm)');
        ro.set('airy', airy.toFixed(1) + ' µm at 550 nm');
        ro.set('v', b <= c1 ? 'looks like a point' : (b / c1).toFixed(1) + ' × too large: visibly soft');
        ro.set('v2', b <= c2 ? 'within two pixels: sharp' : (b / V.p).toFixed(1) + ' pixels across: soft');
      }, box_.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ focusing */
  // a two-group lens of 100 mm focal length focused at infinity: a fixed positive front group A and a negative group B that moves
  const IF = { fA: 60, fB: -50, F0: 100 };
  IF.d0 = IF.fA + IF.fB - IF.fA * IF.fB / IF.F0;
  IF.L = IF.d0 + IF.F0 * (1 - IF.d0 / IF.fA);
  // the spacing d that puts the image of an object s mm in front of A on the sensor (fixed, L behind A); null beyond the close limit
  function ifSolve(s) {
    const vA = IF.fA * s / (s - IF.fA), T = IF.L - vA, disc = T * T - 4 * IF.fB * T;
    if (!(s > IF.fA * 1.01) || T < 0 || disc < 0) return null;
    return vA + (T - Math.sqrt(disc)) / 2;
  }
  Hyper.sim('fz-focusing', {
    title: 'Focusing: what moves, and what it does to the view',
    blurb: `Two lenses of 100 mm focal length at infinity. The **unit-focusing** lens is one lens that moves out from the sensor. The **inner-focusing** lens has a fixed front group (A, +60 mm) and a rear group (B, −50 mm) that slides to bring the subject to the fixed sensor: the barrel never changes length. The rays are traced through the real thin-lens matrices.

**Try this**
- Focus the unit lens from infinity to 0.34 m: it moves by 42 mm, and its horizontal angle narrows from 20.4° to 14.5°.
- Switch to the inner-focusing lens: group B moves 28 mm, but the **effective focal length falls** (to 51 mm) and the angle *widens* to 31.6° — the graph shows both curves. That is focus breathing.
- Look at the travel read-out: from infinity to 3 m the unit lens moves 3.4 mm, from 1 m to 0.34 m it moves 31 mm. The ring spends most of its turn on the last metre.
- The inner-focusing lens cannot focus closer than 0.33 m: group B would have to reach the sensor.`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym, C = O.cam, A = O.abcd;
      const st = kit.stage(box_.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box_.side, [
        { id: 'type', type: 'select', label: 'The lens focuses by', options: [['moving the whole lens (unit focusing)', 'unit'], ['moving a group inside (inner focusing)', 'inner']], value: params.type || 'unit' },
        { id: 's', label: 'Subject distance (from the front of the lens)', min: 0.34, max: 1000, value: params.s || 3, log: true, sig: 3, unit: 'm' },
        { type: 'buttons', items: [{ id: 'inf', label: 'Infinity' }, { id: 'mod', label: 'Closest focus' }] }
      ], (id) => {
        if (id === 'inf') ctl.set('s', 1000);
        else if (id === 'mod') ctl.set('s', 0.34);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['travel', 'Travel from infinity'], ['efl', 'Focal length as focused'], ['m', 'Magnification'], ['ang', 'Horizontal angle as focused'], ['W', 'Scene width at that distance'], ['lim', 'Closest focus of this lens']]);
      const plot = kit.plot(box_.side, {}, 180);
      const sensor = C.sensor('Full frame'), F = IF.F0;
      // everything for one subject distance (mm from the front of the lens)
      function state(type, s) {
        if (type === 'unit') {
          const v = F * s / (s - F), r = C.fov({ f: F, sensor, distance: s });
          return { travel: v - F, efl: F, m: F / (s - F), ang: r.h, W: r.W, v };
        }
        const d = ifSolve(s);
        if (d == null) return null;
        const M = A.mul(A.lens(IF.fA), A.free(d), A.lens(IF.fB)), card = A.cardinal(M), im = A.image(M, s);
        const sH = s + card.Hfront, W = sensor.w / Math.abs(im.m);
        return { travel: d - IF.d0, efl: card.efl, m: Math.abs(im.m), ang: 2 * Math.atan(W / 2 / sH), W, d };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), Cl = kit.colors(), W = st.W, Hh = st.H;
        const sMm = Math.max(V.s * 1000, 340);
        let type = V.type, r = state(type, sMm);
        if (!r) { r = state(type, 340) || state('unit', sMm); }
        const inner = type === 'inner';
        // the lens, to scale, with the sensor at z = 0 and the light travelling to the right
        const mp = S.map(st, -(IF.L + 70), 14, 28, { left: 20, right: 28, top: 38, bottom: 56 });
        const X = mp.X, y0 = mp.y0, sy = mp.sy;
        S.axis(c, X(-(IF.L + 70)), y0, X(14));
        const zA = -IF.L, zB = zA + (inner ? r.d : IF.d0), zU = -r.v;
        const h = 17;
        const rays = [];
        for (const sgn of [1, -1]) {
          const hh = sgn * h, pts = [];
          if (!inner) {
            const zL = zU;
            pts.push([X(zL - 36), y0 - sy * hh * (sMm - 36) / sMm], [X(zL), y0 - sy * hh], [X(0), y0]);
          } else {
            const u1 = hh / sMm - hh / IF.fA, yB = hh + u1 * r.d;
            pts.push([X(zA - 36), y0 - sy * hh * (sMm - 36) / sMm], [X(zA), y0 - sy * hh], [X(zB), y0 - sy * yB], [X(0), y0]);
          }
          rays.push(pts);
        }
        for (const pts of rays) S.ray(c, pts, { nm: 580, width: 1.4, arrows: false });
        if (!inner) {
          S.lens(c, X(zU), y0, h * sy * 1.1, { f: 1, t: 8, bulge: 3 });
          kit.label(c, 'the whole lens moves', X(zU), y0 + h * sy * 1.1 + 18, { align: 'center', color: Cl.muted, size: 11.5 });
        } else {
          c.fillStyle = Cl.dark ? 'rgba(150,160,190,0.08)' : 'rgba(80,90,130,0.07)'; c.fillRect(X(zA) - 14, y0 - sy * 22, X(0) - X(zA) + 14, sy * 44);
          c.strokeStyle = Cl.muted; c.lineWidth = 1; c.strokeRect(X(zA) - 14 + 0.5, y0 - sy * 22, X(0) - X(zA) + 14 - 1, sy * 44);
          S.lens(c, X(zA) - 3, y0, h * sy * 1.1, { f: 1, t: 7, bulge: 3 });
          S.lens(c, X(zB) - 2, y0, h * sy * 0.9, { f: -1, t: 5 });
          kit.label(c, 'A: fixed', X(zA) + 2, y0 + 22 * sy + 14, { align: 'center', color: Cl.muted, size: 11.5 });
          kit.label(c, 'B: moves', X(zB), y0 + 22 * sy + 14, { align: 'center', color: Cl.accent, size: 11.5 });
          kit.label(c, 'the barrel keeps its length', (X(zA) + X(0)) / 2, y0 - 22 * sy - 9, { align: 'center', color: Cl.faint, size: 11 });
        }
        S.sensor(c, X(0) + 1, y0, 12 * sy, { pixels: 8 });
        kit.label(c, 'sensor', X(0), y0 + 12 * sy + 22, { align: 'center', color: Cl.muted, size: 11.5 });
        kit.label(c, 'subject at ' + (V.s >= 999 ? 'infinity' : dist(V.s * 1000)) + (inner && state('inner', sMm) == null ? '  (closer than this lens can focus)' : ''), 14, 18, { weight: 650 });
        // the graph: horizontal angle of view against distance, for both lenses
        const pu = [], pi = [];
        for (let i = 0; i <= 70; i++) {
          const s = 340 * Math.pow(1e6 / 340, i / 70), a = state('unit', s), b = state('inner', s);
          pu.push([s / 1000, a.ang * R2D]); if (b) pi.push([s / 1000, b.ang * R2D]);
        }
        plot.set({ series: [{ pts: pu, label: 'unit focusing' }, { pts: pi, label: 'inner focusing' }], x: { label: 'subject distance (m)', log: true, min: 0.34, max: 1000 }, y: { label: 'horizontal angle (°)', min: 10, max: 40 }, marks: [{ x: Math.min(V.s, 1000), y: r.ang * R2D, label: type === 'unit' ? 'unit' : 'inner' }] });
        ro.set('travel', r.travel.toFixed(r.travel < 10 ? 2 : 1) + ' mm' + (inner ? '  (group B)' : '  (the lens)'));
        ro.set('efl', r.efl.toFixed(1) + ' mm' + (inner ? '  (100 mm at infinity)' : '  (unchanged)'));
        ro.set('m', r.m.toFixed(r.m < 0.1 ? 4 : 3) + '×');
        ro.set('ang', deg(r.ang) + '  (20.4° at infinity)');
        ro.set('W', dist(r.W));
        ro.set('lim', inner ? dist(IF.fA * IF.L / (IF.L - IF.fA)) + ' from the front group' : 'no limit in this model');
      }, box_.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ autofocus */
  function erf(x) { const t = 1 / (1 + 0.3275911 * Math.abs(x)), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; }
  Hyper.sim('fz-autofocus', {
    title: 'Autofocus: two half-pupils against a climb in contrast',
    blurb: `The same lens, out of focus by a few hundred micrometres, and two ways to find the focus. The upper picture is the cone of light near its focus (magnified: the window is ±0.5 mm). The sensor is the green line.

**Phase detection** looks through the two halves of the pupil separately (blue and orange). In focus, both put the point on the same spot; out of focus, they land apart, and the sign of the gap says which way to move. **Contrast detection** has only the sharpness of one picture, which falls on both sides of the focus: it must move, measure, overshoot and come back.

**Try this**
- In phase mode move the focus error: the two images separate in proportion (0.42 ÷ N times the error), and swap sides when the error changes sign. Press **Autofocus**: one measurement, one smooth move.
- Open the aperture from f/8 to f/1.4: the gap for the same error grows six times — the longer baseline of a faster lens.
- Switch to contrast detection and press Autofocus: watch the dots on the graph: step, overshoot, return with half the step, until the step is small. Count the measurements.
- Throw it out of focus the other way and repeat.`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box_.stage, { aspect: 0.64, minH: 340 });
      let af = null, trail = [], count = 0, note = '';
      const ctl = kit.controls(box_.side, [
        { id: 'mode', type: 'select', label: 'Method', options: [['Phase detection: two half-pupils', 'phase'], ['Contrast detection: climb the sharpness', 'contrast']], value: params.mode || 'phase' },
        { id: 'N', label: 'f-number', min: 1.4, max: 8, value: params.N || 2.8, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'err', label: 'Focus error: sensor beyond (+) or before (−) the image', min: -400, max: 400, step: 5, value: params.err != null ? params.err : 150, unit: 'µm' },
        { type: 'buttons', items: [{ id: 'af', label: 'Autofocus', primary: true }, { id: 'flip', label: 'Throw it out of focus' }] }
      ], id => {
        if (id === 'af') { startAF(); return; }
        if (id === 'flip') { af = null; trail = []; count = 0; note = ''; ctl.set('err', V.err >= 0 ? -220 : 220); loop.stop(); }
        else if (id === 'mode') { af = null; trail = []; count = 0; note = ''; loop.stop(); }
        else if (id === 'N' || id === 'err') { if (!af) { trail = []; count = 0; note = ''; } }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['sep', 'Gap between the two images'], ['B', 'Baseline of the half-pupils'], ['c', 'Contrast of the picture'], ['b', 'Blur disc'], ['dir', 'The camera concludes'], ['n', 'Measurements used']]);
      const plot = kit.plot(box_.side, {}, 180);
      const NU = 15;                                                    // spatial frequency of the detail used, cycles/mm
      const contrast = (pos, N) => O.mtf.gaussian(NU, Math.abs(pos) / 1000 / N / 4);
      function startAF() {
        trail = []; note = '';
        if (V.mode === 'phase') { af = { type: 'phase', t: 0, from: V.err, dur: 0.55 }; count = 1; note = 'one measurement, then one move'; }
        else { af = { type: 'contrast', timer: 0.22, dir: 1, step: 60, last: contrast(V.err, V.N) }; count = 1; trail.push([V.err, af.last]); note = 'climbing'; }
        loop.start();
      }
      function advance(dt) {
        if (!af) return;
        if (af.type === 'phase') {
          af.t += dt; const k = clamp(af.t / af.dur, 0, 1), e = k * k * (3 - 2 * k);
          ctl.set('err', af.from * (1 - e));
          if (k >= 1) { ctl.set('err', 0); af = null; note = 'in focus after one measurement'; }
        } else {
          af.timer += dt;
          while (af && af.timer >= 0.22) {
            af.timer -= 0.22;
            const pos = clamp(V.err + af.dir * af.step, -400, 400), c = contrast(pos, V.N);
            trail.push([pos, c]); count++; ctl.set('err', pos);
            if (c < af.last) { af.dir = -af.dir; af.step *= 0.5; note = 'past the peak: back up with a smaller step'; } else note = 'climbing';
            af.last = c;
            if (af.step < 5 || count > 40) { af = null; note = 'settled after ' + count + ' measurements'; }
          }
        }
      }
      const loop = kit.loop((dt) => {
        advance(dt);
        const c = st.begin(), Cl = kit.colors(), W = st.W, Hh = st.H;
        const N = V.N, pos = V.err, phase = V.mode === 'phase';
        const zr = 500, px = 8, pw = W - 16, ph = Hh * 0.58, py = 8, cx = px + pw / 2, cy = py + ph / 2;
        const hmax = zr / (2 * N), k = Math.min((pw - 50) / (2 * zr), (ph - 56) / (2 * hmax * 1.05));
        const X = z => cx + z * k, Y = y => cy - y * k;
        box(c, px, py, pw, ph, Cl.surface, Cl.grid);
        S.axis(c, X(-zr), cy, X(zr));
        const h = zr / (2 * N);
        if (phase) {
          // the upper half of the pupil (blue) and the lower half (orange): each bundle crosses the axis at the focus
          const bundle = (sg, col, a) => {
            c.fillStyle = col; c.globalAlpha = a;
            c.beginPath(); c.moveTo(X(-zr), Y(0)); c.lineTo(X(-zr), Y(sg * h)); c.lineTo(X(0), Y(0)); c.closePath(); c.fill();
            c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(zr), Y(0)); c.lineTo(X(zr), Y(-sg * h)); c.closePath(); c.fill(); c.globalAlpha = 1;
          };
          bundle(1, Cl.accent, 0.25); bundle(-1, Cl.warn, 0.25);
          const sl = 0.21 / N;                                                // the ray through the centre of each half: 0.42 D apart
          S.ray(c, [[X(-zr), Y(sl * zr)], [X(0), Y(0)], [X(zr), Y(-sl * zr)]], { color: Cl.accent, width: 2, arrows: false });
          S.ray(c, [[X(-zr), Y(-sl * zr)], [X(0), Y(0)], [X(zr), Y(sl * zr)]], { color: Cl.warn, width: 2, arrows: false });
        } else {
          c.fillStyle = Cl.warn; c.globalAlpha = 0.2;
          c.beginPath(); c.moveTo(X(-zr), Y(h)); c.lineTo(X(0), Y(0)); c.lineTo(X(-zr), Y(-h)); c.closePath(); c.fill();
          c.beginPath(); c.moveTo(X(zr), Y(h)); c.lineTo(X(0), Y(0)); c.lineTo(X(zr), Y(-h)); c.closePath(); c.fill(); c.globalAlpha = 1;
          S.ray(c, [[X(-zr), Y(h)], [X(0), Y(0)], [X(zr), Y(-h)]], { color: Cl.warn, width: 1.4, arrows: false });
          S.ray(c, [[X(-zr), Y(-h)], [X(0), Y(0)], [X(zr), Y(h)]], { color: Cl.warn, width: 1.4, arrows: false });
        }
        kit.dot(c, X(0), cy, 3.5, Cl.text);
        c.strokeStyle = Cl.ok; c.lineWidth = 3; c.beginPath(); c.moveTo(X(pos), Y(hmax * 1.05)); c.lineTo(X(pos), Y(-hmax * 1.05)); c.stroke();
        kit.label(c, 'sensor', X(pos), py + ph - 12, { align: 'center', color: Cl.ok, size: 11.5 });
        kit.label(c, 'image', X(0), cy + 16, { align: 'center', color: Cl.muted, size: 11 });
        const yu = -pos * 0.21 / N, yl = pos * 0.21 / N, gap = Math.abs(yu - yl);
        if (phase) { kit.dot(c, X(pos), Y(yu), 4, Cl.accent, Cl.text); kit.dot(c, X(pos), Y(yl), 4, Cl.warn, Cl.text); }
        kit.label(c, 'the cone of light near its focus, window ' + (2 * zr) + ' µm', px + 10, py + 14, { color: Cl.muted, size: 11 });
        // the signal each method works from
        const qy = py + ph + 10, qh = Hh - qy - 8, qcy = qy + qh * 0.62, ks = (pw - 40) / 160;
        box(c, px, qy, pw, qh, Cl.surface, Cl.grid);
        c.strokeStyle = Cl.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(px + 20, qcy); c.lineTo(px + pw - 20, qcy); c.stroke();
        if (phase) {
          const bump = (x0, col) => { c.fillStyle = col; c.globalAlpha = 0.35; c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(cx - 80 * ks, qcy); for (let u = -80; u <= 80; u += 2) c.lineTo(cx + u * ks, qcy - qh * 0.45 * Math.exp(-Math.pow(u - x0, 2) / (2 * 36))); c.lineTo(cx + 80 * ks, qcy); c.fill(); c.globalAlpha = 1; c.stroke(); };
          bump(clamp(yu, -70, 70), Cl.accent); bump(clamp(yl, -70, 70), Cl.warn);
          c.save(); c.setLineDash([4, 3]); c.strokeStyle = Cl.faint; c.beginPath(); c.moveTo(cx, qy + 6); c.lineTo(cx, qcy); c.stroke(); c.restore();
          kit.label(c, gap < 1.5 ? 'the two images coincide: in focus' : 'two images of the same point, ' + gap.toFixed(1) + ' µm apart', cx, qy + 14, { align: 'center', size: 11.5, color: gap < 1.5 ? Cl.ok : Cl.text });
          kit.label(c, 'position across the baseline (µm), as seen by two strips of the AF sensor', cx, qy + qh - 8, { align: 'center', color: Cl.faint, size: 10.5 });
        } else {
          const sg = Math.max(0.5, Math.abs(pos) / N / 4);
          c.strokeStyle = Cl.text; c.lineWidth = 2; c.beginPath();
          for (let u = -80; u <= 80; u += 1.5) { const v = 0.5 * (1 + erf(u / (sg * Math.SQRT2))); const x = cx + u * ks, y = qcy - qh * 0.45 * v; if (u === -80) c.moveTo(x, y); else c.lineTo(x, y); }
          c.stroke();
          const cc = contrast(pos, N);
          kit.label(c, 'an edge as the sensor sees it: contrast ' + (100 * cc).toFixed(0) + ' %', cx, qy + 14, { align: 'center', size: 11.5 });
          kit.label(c, 'position across the edge (µm)', cx, qy + qh - 8, { align: 'center', color: Cl.faint, size: 10.5 });
        }
        // the graph of the signal against the focus error
        const pts = [];
        for (let e = -400; e <= 400; e += 10) pts.push([e, phase ? e * 0.42 / N : contrast(e, N)]);
        const series = [{ pts, label: phase ? 'gap between the two images (µm)' : 'contrast' }];
        if (!phase && trail.length) series.push({ pts: trail.map(t => [t[0], t[1]]), label: 'measurements', dots: true, line: false });
        plot.set({ series, x: { label: 'focus error (µm)', min: -400, max: 400 }, y: phase ? { label: 'gap (µm)', min: -130, max: 130 } : { label: 'contrast', min: 0, max: 1.05 }, marks: [{ x: pos, y: phase ? pos * 0.42 / N : contrast(pos, N), label: 'now' }] });
        const dirText = Math.abs(pos) < 3 ? 'in focus' : pos > 0 ? 'the image is in front of the sensor: lens towards the sensor' : 'the image is behind the sensor: lens away from the sensor';
        ro.show('sep', phase); ro.show('B', phase); ro.show('c', !phase); ro.show('b', !phase);
        ro.set('sep', gap.toFixed(1) + ' µm  = error × 0.42 ÷ N');
        ro.set('B', (0.42 * 50 / N).toFixed(1) + ' mm for a 50 mm lens');
        ro.set('c', (100 * contrast(pos, N)).toFixed(0) + ' %  (detail of 15 cycles/mm)');
        ro.set('b', (Math.abs(pos) / N).toFixed(1) + ' µm');
        ro.set('dir', phase ? (Math.abs(pos) < 3 ? 'in focus' : dirText + ', by ' + Math.abs(pos).toFixed(0) + ' µm') : 'only "sharper" or "less sharp": no direction from one reading');
        ro.set('n', count ? count + (note ? '  (' + note + ')' : '') : (phase ? '1 per move' : 'many per move'));
      }, box_.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ zoom: optical, parfocal and varifocal */
  const ZG = { f1: 80, f2: -40, Fmin: 100, Fmax: 240 };
  Hyper.sim('fz-zoom', {
    title: 'A zoom lens: groups, rays and the framed scene',
    blurb: `A zoom of two groups (a fixed-power +80 mm and a −40 mm), worked out with the thin-lens formulas, focused at infinity. Move the **focal length**: the rear group slides, the angle of view changes, and the picture below is reframed. The small picture shows the whole wide-end view with the current frame inside it.

**Try this**
- Slide from 100 to 240 mm: the scene width falls 2.4 times, and the rear group moves 19 mm towards the front group.
- Look at where the image lands. With *Parfocal* the front group also moves (the cam) and the image stays on the sensor. With *Varifocal* only the spacing changes and the image drifts: 51 mm between the ends.
- In the varifocal lens, **Refocus here** puts the image back on the sensor for this focal length — and loses it at the other.
- Raise the f-number from f/2.8 to f/5.6: the same drift, but its blur disc shrinks in proportion (the blur is the miss divided by N).`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym, C = O.cam;
      const focusMode = params.mode === 'focus';
      const st = kit.stage(box_.stage, { aspect: 0.7, minH: 380 });
      let F0 = ZG.Fmax;                                                     // the focal length at which the varifocal lens was focused
      const ctl = kit.controls(box_.side, [
        { id: 'F', label: 'Focal length', min: ZG.Fmin, max: ZG.Fmax, step: 1, value: params.F || (focusMode ? 100 : 150), unit: 'mm' },
        { id: 'lens', type: 'select', label: 'The lens is', options: [['Parfocal: a cam keeps the image on the sensor', 'par'], ['Varifocal: only the spacing of the groups changes', 'var']], value: params.lens || (focusMode ? 'var' : 'par') },
        { id: 'N', type: 'select', label: 'Aperture', options: [['f/2.8', 2.8], ['f/4', 4], ['f/5.6', 5.6]], value: 4 },
        { type: 'buttons', items: [{ id: 'wide', label: 'Wide end' }, { id: 'tele', label: 'Tele end' }, { id: 'refocus', label: 'Refocus here' }] }
      ], (id) => {
        if (id === 'wide') ctl.set('F', ZG.Fmin);
        else if (id === 'tele') ctl.set('F', ZG.Fmax);
        else if (id === 'refocus') F0 = V.F;
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['F', 'Focal length'], ['ang', 'Angle of view (horizontal)'], ['W', 'Scene width at 10 m'], ['d', 'Spacing of the groups'], ['img', 'Image behind the front group'], ['miss', 'Image against the sensor'], ['blur', 'Blur disc on the sensor']]);
      const plot = focusMode ? kit.plot(box_.side, {}, 170) : null;
      const at = F => { const z = O.design.zoom2(ZG.f1, ZG.f2, F); return { d: z.d, bfd: z.bfd, img: z.d + z.bfd }; };
      const loop = kit.loop(() => {
        const c = st.begin(), Cl = kit.colors(), W = st.W, Hh = st.H;
        const F = V.F, N = V.N, par = V.lens === 'par', g = at(F), g0 = at(F0);
        // positions along the axis, the sensor at z = 0 (mm)
        const zA = par ? -g.img : -g0.img, zB = zA + g.d, zImg = zA + g.img;
        const top = Hh * 0.5, mp = S.map({ W, H: top }, -150, 22, 26, { left: 14, right: 14, top: 16, bottom: 22 });
        const X = mp.X, y0 = mp.y0, sy = mp.sy;
        box(c, 6, 4, W - 12, top - 6, Cl.surface, Cl.grid);
        S.axis(c, X(-150), y0, X(22));
        const hh = 16;
        for (const sg of [1, -1]) {
          const h = sg * hh, u1 = -h / ZG.f1, yB = h + u1 * g.d, u2 = u1 - yB / ZG.f2, zEnd = 14;
          S.ray(c, [[X(zA - 22), y0 - sy * h], [X(zA), y0 - sy * h], [X(zB), y0 - sy * yB], [X(zEnd), y0 - sy * (yB + u2 * (zEnd - zB + 0))]], { nm: 590, width: 1.4, arrows: false });
        }
        S.thinLens(c, X(zA), y0, sy * 21, ZG.f1);
        S.thinLens(c, X(zB), y0, sy * 17, ZG.f2);
        S.sensor(c, X(0) + 1, y0, 12 * sy, { pixels: 8 });
        kit.label(c, 'sensor', X(0), y0 + 12 * sy + 14, { align: 'center', color: Cl.muted, size: 11 });
        kit.label(c, '+80 mm', X(zA), y0 - 21 * sy - 8, { align: 'center', color: Cl.muted, size: 11 });
        kit.label(c, '−40 mm', X(zB), y0 - 17 * sy - 8, { align: 'center', color: Cl.muted, size: 11 });
        if (Math.abs(zImg) > 0.4) { c.save(); c.setLineDash([3, 3]); c.strokeStyle = Cl.warn; c.beginPath(); c.moveTo(X(zImg), y0 - 18); c.lineTo(X(zImg), y0 + 18); c.stroke(); c.restore(); kit.label(c, 'image', X(zImg), y0 + 30, { align: 'center', color: Cl.warn, size: 11 }); }
        kit.label(c, 'F = ' + F.toFixed(0) + ' mm   (d = ' + g.d.toFixed(1) + ' mm)', 14, 18, { weight: 650 });
        // the scene: the wide-end picture with the frame inside, and the picture itself
        const by = top + 6, bh = Hh - by - 6, pw1 = Math.min((W - 28) / 2, bh * 1.5), ph1 = pw1 / 1.5;
        const x1 = 10 + ((W - 28) / 2 - pw1) / 2, x2 = W / 2 + 4 + ((W - 28) / 2 - pw1) / 2, yp = by + (bh - ph1) / 2;
        const wideHalfU = 18 / ZG.Fmin, halfU = 18 / F;
        drawScene(c, S, x1, yp, pw1, ph1, 0, 0, wideHalfU);
        c.strokeStyle = Cl.warn; c.lineWidth = 2; c.strokeRect(x1 + pw1 / 2 - pw1 / 2 * halfU / wideHalfU, yp + ph1 / 2 - ph1 / 2 * halfU / wideHalfU, pw1 * halfU / wideHalfU, ph1 * halfU / wideHalfU);
        c.strokeStyle = Cl.text; c.lineWidth = 1; c.strokeRect(x1 + 0.5, yp + 0.5, pw1 - 1, ph1 - 1);
        const blur = Math.abs(zImg) / N * 1000, ratio = blur / 28.8;
        drawScene(c, S, x2, yp, pw1, ph1, 0, 0, halfU, ratio > 0.5 ? clamp(Math.round(110 / (1 + ratio * 0.9)), 8, 110) : 0);
        c.strokeStyle = Cl.text; c.lineWidth = 1.5; c.strokeRect(x2 + 0.5, yp + 0.5, pw1 - 1, ph1 - 1);
        kit.label(c, 'the wide end (100 mm) and the frame now', x1 + pw1 / 2, yp - 7, { align: 'center', color: Cl.muted, size: 10.5 });
        kit.label(c, ratio > 0.5 ? 'what the sensor records (softening schematic)' : 'what the sensor records', x2 + pw1 / 2, yp - 7, { align: 'center', color: ratio > 0.5 ? Cl.bad : Cl.muted, size: 10.5 });
        const a = C.fov({ f: F, sensor: C.sensor('Full frame') });
        ro.set('F', F.toFixed(0) + ' mm  (' + (F / ZG.Fmin).toFixed(2) + '× the wide end)');
        ro.set('ang', deg(a.h) + '  (full frame, 36 mm wide)');
        ro.set('W', dist(36 * (10000 - F) / F));
        ro.set('d', g.d.toFixed(1) + ' mm  (bfd ' + g.bfd.toFixed(1) + ' mm)');
        ro.set('img', g.img.toFixed(1) + ' mm  (the lens\'s total length)');
        ro.set('miss', Math.abs(zImg) < 0.05 ? 'on the sensor' : Math.abs(zImg).toFixed(1) + ' mm ' + (zImg < 0 ? 'in front of it' : 'behind it'));
        ro.set('blur', blur < 1 ? 'none' : blur.toFixed(0) + ' µm  = ' + ratio.toFixed(1) + ' × the usual 29 µm');
        if (plot) {
          const pv = [], pp = [];
          for (let f = ZG.Fmin; f <= ZG.Fmax; f += 5) { pv.push([f, at(f).img - g0.img]); pp.push([f, 0]); }
          plot.set({ series: [{ pts: pv, label: 'varifocal (focused at ' + F0.toFixed(0) + ' mm)' }, { pts: pp, label: 'parfocal', dash: true }], x: { label: 'focal length (mm)', min: ZG.Fmin, max: ZG.Fmax }, y: { label: 'image against the sensor (mm)' }, marks: [{ x: F, y: par ? 0 : zImg, label: par ? 'parfocal' : 'now' }] });
        }
      }, box_.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ digital zoom */
  Hyper.sim('fz-digital', {
    title: 'Digital zoom: enlarging pixels against zooming the lens',
    blurb: `A toy sensor of 120 × 80 pixels photographs the scene (so that the pixels are big enough to see). **Digital zoom** keeps the central 1/z of the pixels and enlarges them to fill the frame; **optical zoom** points the same 120 × 80 pixels at the narrower field. The chart on the sign has bars that get finer to the right.

**Try this**
- Zoom to 3×. Digital: the middle 40 × 27 pixels, enlarged. Optical: the same number of pixels, but all of them on the middle of the scene. The finest bars on the sign are lost in the first and resolved in the second.
- Change the enlargement between nearest neighbour (blocks), bilinear (smooth, soft) and bicubic (crisper edges, a slight overshoot): the graph shows one row of the sign enlarged eight times, against what the scene really is.
- Move the zoom to 1×: the two pictures agree. The difference grows with the zoom factor.
- Switch to the 240 × 160 sensor: the digital zoom has more to work with, and the optical one still shows finer detail.`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym, C = O.cam;
      const st = kit.stage(box_.stage, { aspect: 0.6, minH: 330 });
      const ctl = kit.controls(box_.side, [
        { id: 'z', label: 'Zoom factor', min: 1, max: 8, step: 0.1, value: params.z || 3, fmt: v => v.toFixed(1) + '×' },
        { id: 'how', type: 'select', label: 'Enlarge by', options: [['nearest neighbour', 'nearest'], ['bilinear interpolation', 'linear'], ['bicubic interpolation', 'cubic']], value: params.how || 'linear' },
        { id: 'res', type: 'select', label: 'Sensor', options: [['120 × 80 pixels (a toy sensor)', 120], ['240 × 160 pixels', 240]], value: 120 },
        { id: 'cmp', type: 'check', label: 'Show the optical zoom beside it', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['kept', 'Pixels kept'], ['frac', 'Share of the sensor'], ['mp', 'On a 24-megapixel camera'], ['feq', 'Like a lens of'], ['up', 'Enlargement needed']]);
      const plot = kit.plot(box_.side, {}, 170);
      const UW = 0.6, VH = 0.4;                                             // the sensor sees u in ±0.6, v in ±0.4 of the scene
      const cache = {};
      // what the sensor records: each pixel averages 2 × 2 samples of the scene
      function capture(nx) {
        if (cache[nx]) return cache[nx];
        const ny = Math.round(nx * 2 / 3), R = new Float32Array(nx * ny), G = new Float32Array(nx * ny), B = new Float32Array(nx * ny);
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
          let r = 0, g = 0, b = 0;
          for (let a = 0; a < 2; a++) for (let q = 0; q < 2; q++) { const p = sceneRGB(-UW + 2 * UW * (i + (a + 0.5) / 2) / nx, VH - 2 * VH * (j + (q + 0.5) / 2) / ny); r += p[0]; g += p[1]; b += p[2]; }
          R[j * nx + i] = r / 4; G[j * nx + i] = g / 4; B[j * nx + i] = b / 4;
        }
        return (cache[nx] = { nx, ny, ch: [R, G, B] });
      }
      // digital zoom: the central 1/z of the pixels, enlarged to outW × outH
      function enlarge(img, z, how, outW, outH) {
        const { nx, ny, ch } = img;
        const cw = Math.max(2, Math.round(nx / z)), chh = Math.max(2, Math.round(ny / z)), x0 = Math.floor((nx - cw) / 2), y0 = Math.floor((ny - chh) / 2);
        const out = [];
        for (let k = 0; k < 3; k++) {
          const rows = [];
          for (let j = 0; j < chh; j++) rows.push(C.resample(Array.from(ch[k].subarray((y0 + j) * nx + x0, (y0 + j) * nx + x0 + cw)), outW, how));
          const o = new Float32Array(outW * outH);
          for (let i = 0; i < outW; i++) { const col = C.resample(rows.map(r => r[i]), outH, how); for (let j = 0; j < outH; j++) o[j * outW + i] = col[j]; }
          out.push(o);
        }
        return { out, cw, chh, x0, y0 };
      }
      // optical zoom: the same number of pixels on the central 1/z of the field
      function optical(z, nx, ny) {
        const R = new Float32Array(nx * ny), G = new Float32Array(nx * ny), B = new Float32Array(nx * ny);
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
          let r = 0, g = 0, b = 0;
          for (let a = 0; a < 2; a++) for (let q = 0; q < 2; q++) { const p = sceneRGB((-UW + 2 * UW * (i + (a + 0.5) / 2) / nx) / z, (VH - 2 * VH * (j + (q + 0.5) / 2) / ny) / z); r += p[0]; g += p[1]; b += p[2]; }
          R[j * nx + i] = r / 4; G[j * nx + i] = g / 4; B[j * nx + i] = b / 4;
        }
        return [R, G, B];
      }
      // a panel of nx × ny pixels from three channels, built once per key and drawn with hard pixels
      const paint = (c, key, arrsFn, nx, ny, x, y, w, h) => {
        let arrs = null;
        const cv = bitmap(key, nx, ny, (i, j) => { if (!arrs) arrs = arrsFn(); const k = j * nx + i; return [arrs[0][k], arrs[1][k], arrs[2][k]]; });
        if (cv) blit(c, cv, x, y, w, h, false);
        else { arrs = arrsFn(); S.cells(c, x, y, w, h, nx, ny, (u, v) => { const k = Math.min(ny - 1, Math.floor(v * ny)) * nx + Math.min(nx - 1, Math.floor(u * nx)); return [arrs[0][k], arrs[1][k], arrs[2][k]]; }); }
      };
      const cropOf = (nx, ny, z) => { const cw = Math.max(2, Math.round(nx / z)), chh = Math.max(2, Math.round(ny / z)); return { cw, chh, x0: Math.floor((nx - cw) / 2), y0: Math.floor((ny - chh) / 2) }; };
      const lum = (r, g, b) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const loop = kit.loop(() => {
        const c = st.begin(), Cl = kit.colors(), W = st.W, Hh = st.H;
        const nx = V.res, img = capture(nx), ny = img.ny, z = V.z, cmp = V.cmp;
        const pw = cmp ? Math.floor((W - 30) / 2) : Math.floor(Math.min(W - 20, (Hh - 80) * 1.5)), ph = Math.round(pw / 1.5);
        const x1 = cmp ? 10 : (W - pw) / 2, x2 = x1 + pw + 10, y = 32;
        const dz = cropOf(nx, ny, z), zk = z.toFixed(2);
        paint(c, ['dig', nx, zk, V.how].join('|'), () => enlarge(img, z, V.how, nx, ny).out, nx, ny, x1, y, pw, ph);
        c.strokeStyle = Cl.text; c.lineWidth = 1.5; c.strokeRect(x1 + 0.5, y + 0.5, pw - 1, ph - 1);
        kit.label(c, 'digital zoom ' + z.toFixed(1) + '×', x1 + pw / 2, y - 12, { align: 'center', weight: 650, size: 12.5 });
        // the whole sensor picture, small, with the crop marked
        const tw = Math.round(pw * 0.3), th = Math.round(tw / 1.5), tx = x1 + 6, ty = y + ph - th - 6;
        paint(c, ['full', nx].join('|'), () => img.ch, nx, ny, tx, ty, tw, th);
        c.strokeStyle = Cl.text; c.lineWidth = 1; c.strokeRect(tx + 0.5, ty + 0.5, tw - 1, th - 1);
        c.strokeStyle = Cl.warn; c.lineWidth = 1.6; c.strokeRect(tx + tw * dz.x0 / nx, ty + th * dz.y0 / ny, tw * dz.cw / nx, th * dz.chh / ny);
        if (cmp) {
          paint(c, ['opt', nx, zk].join('|'), () => optical(z, nx, ny), nx, ny, x2, y, pw, ph);
          c.strokeStyle = Cl.text; c.lineWidth = 1.5; c.strokeRect(x2 + 0.5, y + 0.5, pw - 1, ph - 1);
          kit.label(c, 'optical zoom ' + z.toFixed(1) + '×', x2 + pw / 2, y - 12, { align: 'center', weight: 650, size: 12.5 });
        }
        kit.label(c, 'both made of ' + nx + ' × ' + ny + ' pixels; the digital one from the middle ' + dz.cw + ' × ' + dz.chh + ' of the sensor', W / 2, y + ph + 16, { align: 'center', color: Cl.muted, size: 11 });
        // one row of the chart, enlarged eight times
        const j = clamp(Math.round((VH - 0.19) / (2 * VH) * ny - 0.5), 0, ny - 1);
        const pxu = 2 * UW / nx, i0 = Math.max(0, Math.floor((0.39 + UW) / pxu)), i1 = Math.min(nx - 1, Math.ceil((0.73 + UW) / pxu));
        const row = []; for (let i = i0; i <= i1; i++) row.push(lum(img.ch[0][j * nx + i], img.ch[1][j * nx + i], img.ch[2][j * nx + i]));
        const up = C.resample(row, row.length * 8, V.how), uA = -UW + i0 * pxu, uSpan = row.length * pxu;
        const sel = up.map((v, k) => [uA + (k + 0.5) / up.length * uSpan, v]);
        const tru = []; for (let k = 0; k < up.length; k++) { const u = uA + (k + 0.5) / up.length * uSpan, p = sceneRGB(u, 0.19); tru.push([u, lum(p[0], p[1], p[2])]); }
        const dots = row.map((v, k) => [uA + (k + 0.5) * pxu, v]);
        plot.set({ series: [{ pts: tru, label: 'the scene' }, { pts: sel, label: V.how === 'nearest' ? 'nearest neighbour ×8' : V.how === 'linear' ? 'bilinear ×8' : 'bicubic ×8' }, { pts: dots, label: 'sensor pixels', dots: true, line: false }], x: { label: 'position across the sign (tangent units)' }, y: { label: 'brightness', min: -0.1, max: 1.1 } });
        const kept = dz.cw * dz.chh, frac = kept / (nx * ny);
        ro.set('kept', dz.cw + ' × ' + dz.chh + ' of ' + nx + ' × ' + ny);
        ro.set('frac', (100 * frac).toFixed(frac < 0.1 ? 1 : 0) + ' %  = 1/z²');
        ro.set('mp', (24 * frac).toFixed(2) + ' MP of real pixels');
        ro.set('feq', (50 * z).toFixed(0) + ' mm if the real lens is 50 mm');
        ro.set('up', (nx / dz.cw).toFixed(2) + ' × in each direction');
      }, box_.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ extension tubes and close-up lenses */
  Hyper.sim('fz-closeup', {
    title: 'Close-up: extension, close-up lenses and the light they cost',
    blurb: `A lens that was made for distant subjects is moved away from the sensor (**extension**: a tube, a bellows or the focus ring) or given extra power in front (a **close-up lens**). The picture is object, lens and full-frame sensor, with the distances to scale and the heights stretched.

**Try this**
- Set the lens to 100 mm and the tube to 36 mm: magnification 0.36 with the subject 378 mm away, and 0.9 stop of light gone. Raise the tube to 100 mm: 1:1, two stops, and the subject only 200 mm away.
- Take the tube away and screw on a **+2 D** close-up lens instead: the subject comes to 0.5 m and the magnification is f·D = 0.2. No extra exposure is needed.
- Keep the 1:1 set-up and open the aperture to f/2.8, then close it to f/16: the depth of field is under a millimetre at f/8.
- With nothing added (tube 0, no close-up lens, focus ring at infinity) the subject is at infinity; add 1 mm of extension and it comes in to 10 m.`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym, C = O.cam;
      const st = kit.stage(box_.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box_.side, [
        { id: 'f', label: 'Focal length of the lens', min: 20, max: 200, value: params.f || 100, log: true, sig: 3, unit: 'mm' },
        { id: 'x', label: 'Extension tube or bellows', min: 0, max: 200, step: 1, value: params.x != null ? params.x : 36, unit: 'mm' },
        { id: 'e', label: 'Focus ring: extension beyond infinity', min: 0, max: 30, step: 0.5, value: 0, unit: 'mm' },
        { id: 'D', type: 'select', label: 'Close-up lens in front', options: [['none', 0], ['+1 D', 1], ['+2 D', 2], ['+4 D', 4], ['+10 D', 10]], value: params.D || 0 },
        { id: 'N', type: 'select', label: 'Aperture on the lens', options: [['f/2.8', 2.8], ['f/4', 4], ['f/5.6', 5.6], ['f/8', 8], ['f/11', 11], ['f/16', 16]], value: 8 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['m', 'Magnification'], ['s', 'Subject distance (from the lens)'], ['T', 'Subject to sensor'], ['W', 'Field on the subject (36 mm sensor)'], ['Nw', 'Working f-number'], ['L', 'Exposure to add'], ['dof', 'Depth of field']]);
      const c0 = C.coc(C.sensor('Full frame').diag);
      const loop = kit.loop(() => {
        const c = st.begin(), Cl = kit.colors(), W = st.W, Hh = st.H;
        const f = V.f, xx = V.x + V.e, D = V.D / 1000, v = f + xx, m = xx / f + D * v;
        const s = m > 1e-4 ? v / m : Infinity, finite = Number.isFinite(s) && s < 2500;
        const zMin = -(finite ? s : 300), Wf = m > 1e-4 ? 36 / m : 0;
        const mp = S.map(st, zMin, v + 10, Math.max(finite ? Wf / 2 : 0, 18) * 1.15, { left: 24, right: 30, top: 34, bottom: 70, stretch: 4 });
        const X = mp.X, y0 = mp.y0, sy = mp.sy;
        S.axis(c, X(zMin) - 8, y0, X(v) + 24);
        const objH = finite ? sy * Wf / 2 : 0, imgH = sy * 18, lensH = Math.max(objH, imgH, 16) * 1.05;
        // the sensor and the tube
        S.sensor(c, X(v) + 1, y0, Math.max(imgH, 8), { pixels: 9 });
        if (V.x > 0) { c.fillStyle = Cl.dark ? '#3a4262' : '#b9c0d6'; c.fillRect(X(0) + 4, y0 - 15, Math.max(2, X(V.x) - X(0)), 30); c.strokeStyle = Cl.text; c.lineWidth = 1; c.strokeRect(X(0) + 4.5, y0 - 14.5, Math.max(2, X(V.x) - X(0)), 29); kit.label(c, 'tube ' + V.x + ' mm', (X(0) + X(V.x)) / 2 + 4, y0 + 30, { align: 'center', color: Cl.muted, size: 10.5 }); }
        S.thinLens(c, X(0), y0, lensH, f);
        if (V.D > 0) { S.thinLens(c, X(0) - 12, y0, lensH * 0.9, 1, { color: Cl.accent }); kit.label(c, '+' + V.D + ' D', X(0) - 12, y0 - lensH * 0.9 - 9, { align: 'center', color: Cl.accent, size: 11 }); }
        if (finite) {
          S.object(c, X(-s), y0, objH, { label: 'subject' });
          const tip = [X(-s), y0 - objH], img = [X(v), y0 + imgH];
          S.ray(c, [tip, [X(0), y0], img], { color: Cl.warn, width: 1.3 });
          S.ray(c, [tip, [X(0), tip[1] > y0 - lensH ? tip[1] : y0 - lensH], img], { color: Cl.accent, width: 1.3 });
          S.object(c, X(v), y0, -imgH, { label: 'image' });
          const yd = y0 + lensH + 22;
          S.dim(c, X(-s), yd, X(0), yd, 's = ' + dist(s), { off: 12 });
          S.dim(c, X(0), yd + 20, X(v), yd + 20, 'v = ' + dist(v), { off: 12 });
        } else {
          for (const k of [-1, 0, 1]) S.ray(c, [[X(zMin) - 4, y0 - k * 10 * sy], [X(0), y0 - k * 10 * sy], [X(v), y0]], { nm: 590, width: 1.3 });
          kit.label(c, 'the subject is far away (infinity)', X(zMin) + 8, y0 - 24, { color: Cl.muted, size: 11.5 });
          S.dim(c, X(0), y0 + lensH + 22, X(v), y0 + lensH + 22, 'v = ' + dist(v), { off: 12 });
        }
        kit.label(c, 'heights drawn ×' + mp.stretch.toFixed(1) + ' against lengths', 12, 16, { color: Cl.faint, size: 11 });
        kit.label(c, 'm = ' + (m < 0.1 ? m.toFixed(3) : m.toFixed(2)) + '×', W - 12, 16, { align: 'right', weight: 650 });
        const Nw = V.N * (1 + m), loss = 2 * Math.log2(1 + m);
        ro.set('m', m.toFixed(m < 0.1 ? 4 : 3) + '×' + (m > 1e-4 ? '  (1:' + (1 / m).toFixed(m < 0.1 ? 0 : 1) + ')' : ''));
        ro.set('s', Number.isFinite(s) ? dist(s) : 'infinity');
        ro.set('T', Number.isFinite(s) ? dist(s + v) : 'infinity');
        ro.set('W', m > 1e-4 ? dist(Wf) + ' wide' : 'the whole view');
        ro.set('Nw', fn(Nw) + '  (marked ' + fn(V.N) + ' × (1 + m))');
        ro.set('L', '+' + loss.toFixed(2) + ' stops' + (V.D > 0 && xx === 0 ? '  (a close-up lens alone adds none)' : ''));
        ro.set('dof', m > 5e-3 ? (C.dofMacro(V.N, c0, m)).toFixed(2) + ' mm  (c = ' + (c0 * 1000).toFixed(0) + ' µm)' : 'metres: see the depth-of-field page');
      }, box_.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ perspective and the dolly zoom */
  Hyper.sim('fz-perspective', {
    title: 'Perspective: where the camera stands, and the dolly zoom',
    blurb: `A street scene in depth: a person, a lamp post 3 m behind, a tree 8 m, a house 22 m and a tall building 60 m behind the person. The plan on the left shows the camera and the objects; the picture is what a 36 × 24 mm sensor records.

**Try this**
- Keep the lens at 50 mm and walk the camera back (drag the person in the plan or use the slider): the person shrinks, and the house against the person grows. Perspective changed because the **position** changed.
- Now change only the focal length with the camera still: the same picture, bigger or smaller — a crop. The ratios in the read-out do not move.
- Tick **Dolly zoom** and move the camera: the focal length follows so that the person stays 12 mm tall on the sensor, while the building behind swells or shrinks. That is Hitchcock's *Vertigo* effect, made by distance and focal length together.
- Read off how much larger a nose 0.1 m ahead of the ears looks at each distance: 25 % at arm's length (0.4 m), 7 % at 1.5 m. The range of the slider starts at 1.5 m; the formula on the page gives the rest.`,
    mount(box_, kit, params) {
      const O = kit.optics, S = kit.osym, C = O.cam;
      const st = kit.stage(box_.stage, { aspect: 0.58, minH: 330 });
      const ctl = kit.controls(box_.side, [
        { id: 'Z', label: 'Camera to the person', min: 1.5, max: 40, value: params.Z || 6, log: true, sig: 3, unit: 'm' },
        { id: 'f', label: 'Focal length', min: 10, max: 300, value: params.f || 50, log: true, sig: 3, unit: 'mm' },
        { id: 'dolly', type: 'check', label: 'Dolly zoom: keep the person 12 mm tall', value: !!params.dolly }
      ], (id) => { loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box_.side, [['per', 'Person on the sensor'], ['house', 'House width ÷ person height'], ['bldg', 'Building width ÷ person height'], ['nose', 'A nose 0.1 m ahead of the ears'], ['ang', 'Angle of view (horizontal)']]);
      // [kind, x (m), dz (m behind the person), width, height]
      const WORLD = [['building', -9, 60, 20, 40], ['house', 6, 22, 10, 7], ['tree', -2.6, 8, 4.5, 7], ['post', 1.6, 3, 0.3, 4.5], ['person', 0, 0, 0.5, 1.7]];
      const geo = { k: 1, cx: 0, by: 0, pv: null };
      const ridgeM = x => 300 + 150 * Math.sin(x / 600) + 90 * Math.sin(x / 190 + 1);
      const loop = kit.loop(() => {
        const c = st.begin(), Cl = kit.colors(), W = st.W, Hh = st.H;
        const Z = V.Z, H = 1.7;
        const f = V.dolly ? clamp(12 * Z / H, 10, 300) : V.f;
        if (V.dolly && Math.abs(V.f - f) > 0.01) ctl.set('f', f);
        const wide = W >= 560;
        const pv = wide ? { x: 8, y: 8, w: W * 0.34 - 10, h: Hh - 16 } : { x: 8, y: 8, w: W - 16, h: Hh * 0.38 };
        const pa = wide ? { x: W * 0.34 + 4, y: 30, w: W * 0.66 - 12, h: Hh - 60 } : { x: 8, y: pv.h + 40, w: W - 16, h: Hh - pv.h - 66 };
        // the plan: depth upwards, fixed scale of 130 m
        box(c, pv.x, pv.y, pv.w, pv.h, Cl.surface, Cl.grid);
        const by = pv.y + pv.h - 20, cx = pv.x + pv.w / 2, k = (pv.h - 40) / 130;
        geo.k = k; geo.cx = cx; geo.by = by; geo.pv = pv;
        const A = C.fov({ f, sensor: C.sensor('Full frame') }).h, reach = 124 * k;
        c.fillStyle = Cl.dark ? 'rgba(123,140,255,0.14)' : 'rgba(80,100,220,0.12)';
        c.beginPath(); c.moveTo(cx, by); c.lineTo(cx - Math.tan(A / 2) * reach, by - reach); c.lineTo(cx + Math.tan(A / 2) * reach, by - reach); c.closePath(); c.fill();
        c.strokeStyle = Cl.accent; c.lineWidth = 1.2; c.beginPath(); c.moveTo(cx - Math.tan(A / 2) * reach, by - reach); c.lineTo(cx, by); c.lineTo(cx + Math.tan(A / 2) * reach, by - reach); c.stroke();
        c.fillStyle = Cl.text; c.fillRect(cx - 6, by, 12, 9);
        const names = { person: 'person', post: 'post', tree: 'tree', house: 'house', building: 'building' };
        for (const [kind, x, dz, w] of WORLD) {
          const yy = by - (Z + dz) * k, xx = cx + x * k * 3;                  // lateral positions drawn ×3 so that they can be told apart
          if (yy < pv.y + 6) continue;
          kit.dot(c, xx, yy, kind === 'person' ? 5 : 3.5, kind === 'person' ? Cl.warn : Cl.muted);
          kit.label(c, names[kind], xx + 8, yy, { size: 10.5, color: Cl.muted });
        }
        kit.label(c, 'plan (depth to scale; sideways ×3)', pv.x + 8, pv.y + 12, { color: Cl.muted, size: 10.5 });
        S.dim(c, pv.x + 14, by, pv.x + 14, by - Z * k, dist(Z * 1000), { off: 9 });
        // the picture on a 36 × 24 mm sensor
        const fw = Math.min(pa.w, pa.h * 1.5), fh = fw / 1.5, fx = pa.x + (pa.w - fw) / 2, fy = pa.y + (pa.h - fh) / 2, pmm = fw / 36;
        box(c, pa.x - 4, pa.y - 24, pa.w + 8, pa.h + 50, Cl.surface, Cl.grid);
        c.save(); c.beginPath(); c.rect(fx, fy, fw, fh); c.clip();
        const yh = fy + fh / 2, sc = d => pmm * f / d;                        // px per metre at distance d
        const g = c.createLinearGradient(0, fy, 0, yh); g.addColorStop(0, '#4f84d2'); g.addColorStop(1, '#bcdaf4'); c.fillStyle = g; c.fillRect(fx, fy, fw, fh);
        // the far mountains
        c.fillStyle = '#7d89aa'; c.beginPath(); c.moveTo(fx - 5, yh);
        for (let i = 0; i <= 60; i++) { const xm = (-fw / 2 + fw * i / 60) / sc(Z + 2000); c.lineTo(fx + fw * i / 60, yh - (ridgeM(xm) - 1.5) * sc(Z + 2000)); }
        c.lineTo(fx + fw + 5, yh); c.closePath(); c.fill();
        c.fillStyle = '#5e9a4c'; c.fillRect(fx, yh, fw, fh);
        for (const [kind, x, dz, w, h] of WORLD) {
          const d = Z + dz, s = sc(d), yb = yh + 1.5 * s;
          thing(c, kind, fx + fw / 2 + x * s, yb, w * s, h * s);
        }
        c.restore();
        c.strokeStyle = Cl.text; c.lineWidth = 1.5; c.strokeRect(fx, fy, fw, fh);
        kit.label(c, 'what the sensor records, ' + f.toFixed(0) + ' mm', pa.x + pa.w / 2, pa.y - 12, { align: 'center', color: Cl.muted, size: 11.5 });
        const hp = f * H / Z, hHouse = f * 10 / (Z + 22), hBldg = f * 20 / (Z + 60);
        ro.set('per', hp.toFixed(1) + ' mm tall  (' + (100 * hp / 24).toFixed(0) + ' % of the height)');
        ro.set('house', (hHouse / hp).toFixed(2) + ' × ' + (V.dolly ? ' — changes with the distance only' : ''));
        ro.set('bldg', (hBldg / hp).toFixed(2) + ' ×');
        ro.set('nose', ((Z + 0.1) / Z).toFixed(3) + ' × larger');
        ro.set('ang', deg(A));
      }, box_.stage);
      kit.drag(st, {
        hover: true,
        hit: p => (geo.pv && Math.abs(p.x - geo.cx) < 28 && Math.abs(p.y - (geo.by - V.Z * geo.k)) < 12 ? 'person' : null),
        move: (w, p) => { ctl.set('Z', clamp((geo.by - p.y) / geo.k, 1.5, 40)); loop.once(); }
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
