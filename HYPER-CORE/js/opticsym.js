/* HYPER-CORE · opticsym.js
 *
 * Drawing optics on a canvas (kit.osym, Hyper.osym): lenses with their true surfaces, mirrors, prisms, stops,
 * screens and sensors, eyes and light sources, rays coloured by wavelength with arrowheads, beams, waves and
 * wavefronts, angle marks and dimensions, spectra and fringe patterns. A whole prescription from optics.js is
 * drawn with S.system and its rays with S.rays. Every function takes the canvas context first; colours come
 * from the theme unless given. Nothing here needs the DOM beyond the context it is handed.
 *
 *   S.nm(nm, alpha)  S.glass(alpha)  S.map(st, zMin, zMax, yHalf, o)
 *   S.axis  S.ray  S.rays  S.virtual  S.normal  S.angle  S.dim  S.text
 *   S.lens  S.thinLens  S.mirror  S.flatMirror  S.system  S.stop  S.screen  S.sensor  S.object  S.eye  S.source
 *   S.prism  S.block  S.poly  S.splitter  S.plate  S.polarizer  S.grating  S.slits  S.fibre
 *   S.beam  S.wave  S.wavefronts  S.spectrum  S.fringes  S.cells  S.spot
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const O = H.optics;
  const S = H.osym = {};
  const PI = Math.PI, TAU = 2 * PI;
  const FALL = { text: '#e7e9f5', muted: '#959cbd', faint: '#677096', accent: '#7b8cff', axis: '#888', grid: 'rgba(128,128,128,.2)', bg2: '#10142a', surface: '#151a31', warn: '#e0a030', ok: '#22b37a', bad: '#e5484d', dark: true };
  const col = () => (H.ui && H.ui.colors ? H.ui.colors() : FALL);
  const flat = R => R == null || R === 0 || !Number.isFinite(R);

  S.nm = (nm, alpha) => O.colour.nmCss(nm, alpha);
  /* the tint of glass, for fills; edge(…) for outlines */
  S.glass = alpha => { const c = col(); return c.dark ? 'rgba(130,190,255,' + (alpha == null ? 0.22 : alpha) + ')' : 'rgba(60,130,220,' + (alpha == null ? 0.18 : alpha) + ')'; };
  S.edge = () => { const c = col(); return c.dark ? 'rgba(170,210,255,0.9)' : 'rgba(40,90,170,0.9)'; };
  S.metal = () => { const c = col(); return c.dark ? '#c9cfdf' : '#5b6170'; };

  /* a map from optical coordinates (z along the axis, y up, in the prescription's units) to canvas pixels, fitted
     to a stage: -> { x0, y0, s, X(z), Y(y), Z(x), Yi(py) }. o: { left, right, top, bottom (margins px), cy (0…1) } */
  S.map = function (st, zMin, zMax, yHalf, o) {
    o = o || {};
    const L = o.left == null ? 24 : o.left, R = o.right == null ? 24 : o.right, T = o.top == null ? 18 : o.top, Bm = o.bottom == null ? 18 : o.bottom;
    const fitY = (st.H - T - Bm) / Math.max(1e-9, 2 * yHalf);
    const s = Math.max(1e-9, Math.min((st.W - L - R) / Math.max(1e-9, zMax - zMin), fitY));
    // o.stretch: let heights be drawn up to that many times larger than lengths (long thin systems); m.sy is the height scale
    const sy = o.stretch ? Math.max(s, Math.min(s * o.stretch, fitY)) : s;
    const x0 = L + ((st.W - L - R) - s * (zMax - zMin)) / 2 - s * zMin, y0 = T + (st.H - T - Bm) * (o.cy == null ? 0.5 : o.cy);
    return { x0, y0, s, sy, stretch: sy / s, X: z => x0 + s * z, Y: y => y0 - sy * y, Z: x => (x - x0) / s, Yi: py => (y0 - py) / sy };
  };

  function text(ctx, str, x, y, o) {
    o = o || {};
    ctx.save();
    ctx.font = (o.weight || 500) + ' ' + (o.size || 12) + 'px ' + (o.font || 'system-ui, sans-serif');
    ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
    ctx.fillStyle = o.color || col().muted;
    ctx.fillText(String(str), x, y);
    ctx.restore();
  }
  S.text = text;
  function head(ctx, x, y, a, size, color) {
    ctx.save(); ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineTo(x - size * Math.cos(a - 0.4), y - size * Math.sin(a - 0.4)); ctx.lineTo(x - size * Math.cos(a + 0.4), y - size * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  /* the optical axis: a chain line */
  S.axis = function (ctx, x1, y, x2, o) {
    o = o || {};
    ctx.save(); ctx.strokeStyle = o.color || col().axis; ctx.lineWidth = 1; ctx.setLineDash(o.dash || [10, 3, 2, 3]);
    ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke(); ctx.restore();
  };
  /* a ray: a polyline [[x, y] …] with arrowheads. o: { color | nm, width, alpha, arrows (true: one per long segment),
     dash, extend (px beyond the last point) } */
  S.ray = function (ctx, pts, o) {
    o = o || {};
    if (!pts || pts.length < 2) return;
    const color = o.color || (o.nm ? S.nm(o.nm, o.alpha) : col().warn);
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = o.width || 1.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (o.alpha != null && !o.nm) ctx.globalAlpha = o.alpha;
    if (o.dash) ctx.setLineDash(o.dash === true ? [5, 4] : o.dash);
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    if (o.extend) { const a = pts[pts.length - 2], b = pts[pts.length - 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; ctx.lineTo(b[0] + (b[0] - a[0]) / l * o.extend, b[1] + (b[1] - a[1]) / l * o.extend); }
    ctx.stroke();
    if (o.arrows !== false) {
      ctx.setLineDash([]);
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (l < (o.minArrow || 46)) continue;
        const t = o.arrowAt == null ? 0.55 : o.arrowAt;
        head(ctx, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.atan2(b[1] - a[1], b[0] - a[0]), o.head || 7, color);
      }
    }
    ctx.restore();
  };
  /* a virtual ray: the dashed backward extension of a real one */
  S.virtual = function (ctx, x1, y1, x2, y2, o) { S.ray(ctx, [[x1, y1], [x2, y2]], Object.assign({ dash: [4, 4], arrows: false, width: 1, color: col().faint }, o || {})); };
  /* the dashed normal to a surface at a point: angle is the normal's direction (canvas radians) */
  S.normal = function (ctx, x, y, angle, len, o) {
    o = o || {}; len = len || 60;
    ctx.save(); ctx.strokeStyle = o.color || col().faint; ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(x - len * Math.cos(angle), y - len * Math.sin(angle)); ctx.lineTo(x + len * Math.cos(angle), y + len * Math.sin(angle)); ctx.stroke(); ctx.restore();
  };
  /* an angle mark at (x, y) from direction a0 to a1 (canvas radians, the way ctx.arc measures them), with a label */
  S.angle = function (ctx, x, y, r, a0, a1, label, o) {
    o = o || {};
    let d = a1 - a0; while (d > PI) d -= TAU; while (d < -PI) d += TAU;
    ctx.save(); ctx.strokeStyle = o.color || col().muted; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(x, y, Math.max(0.5, r), a0, a0 + d, d < 0); ctx.stroke(); ctx.restore();
    if (label) { const m = a0 + d / 2, rr = r + (o.gap || 13); text(ctx, label, x + rr * Math.cos(m), y + rr * Math.sin(m), { color: o.color || col().text, size: o.size || 12 }); }
  };
  /* a dimension line between two points with end ticks and a label */
  S.dim = function (ctx, x1, y1, x2, y2, label, o) {
    o = o || {};
    const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a), ny = Math.cos(a), t = 4, c = o.color || col().muted;
    ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.moveTo(x1 - nx * t, y1 - ny * t); ctx.lineTo(x1 + nx * t, y1 + ny * t); ctx.moveTo(x2 - nx * t, y2 - ny * t); ctx.lineTo(x2 + nx * t, y2 + ny * t); ctx.stroke(); ctx.restore();
    if (label) {
      // beside a steep line the label is set to one side of it instead of being centred on it
      const off = o.off == null ? -10 : o.off, lx = (x1 + x2) / 2 + nx * off, ly = (y1 + y2) / 2 + ny * off, steep = Math.abs(Math.cos(a)) < 0.5;
      text(ctx, label, lx, ly, { color: o.textColor || col().text, size: o.size || 12, align: steep ? (nx * off >= 0 ? 'left' : 'right') : 'center' });
    }
  };

  // the outline of one spherical or conic surface between ±h, as canvas points; R in px (Cartesian sign), vertex at x
  function surfPts(x, y, h, R, k, n) {
    const pts = []; n = n || 18;
    for (let i = -n; i <= n; i++) {
      const r = h * i / n;
      let z = 0;
      if (!flat(R)) { const c = 1 / R, rad = 1 - (1 + (k || 0)) * c * c * r * r; z = rad <= 0 ? (R > 0 ? 1 : -1) * Math.abs(R) : c * r * r / (1 + Math.sqrt(rad)); }
      pts.push([x + z, y - r]);
    }
    return pts;
  }
  function path(ctx, pts, close) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); if (close) ctx.closePath(); }

  /* a lens element with real surfaces. x: the front vertex; y: the axis; h: half-height (px).
     o: { R1, R2 (px, Cartesian signs; 0 = flat), t (centre thickness, px), f (instead of radii: >0 biconvex, <0 biconcave),
          fill, color, label, k1, k2 }  -> { x1, x2 } the vertices */
  S.lens = function (ctx, x, y, h, o) {
    o = o || {};
    let R1 = o.R1, R2 = o.R2, t = o.t;
    if (R1 === undefined && R2 === undefined) { const conv = (o.f == null ? 1 : o.f) > 0, R = Math.max(h * 1.25, h * (o.bulge == null ? 2.2 : o.bulge)); R1 = conv ? R : -R; R2 = conv ? -R : R; if (t == null) t = conv ? 2 * (R - Math.sqrt(R * R - h * h)) + 3 : 5; }
    // keep the radii large enough for the height
    if (!flat(R1) && Math.abs(R1) < h * 1.02) R1 = Math.sign(R1) * h * 1.02;
    if (!flat(R2) && Math.abs(R2) < h * 1.02) R2 = Math.sign(R2) * h * 1.02;
    if (t == null) t = 6;
    const a = surfPts(x, y, h, R1, o.k1), b = surfPts(x + t, y, h, R2, o.k2).reverse();
    ctx.save();
    path(ctx, a.concat(b), true);
    ctx.fillStyle = o.fill || S.glass(); ctx.fill();
    ctx.strokeStyle = o.color || S.edge(); ctx.lineWidth = o.width || 1.3; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.restore();
    if (o.label) text(ctx, o.label, x + t / 2, y + h + 13, { color: col().muted });
    return { x1: x, x2: x + t };
  };
  /* the textbook thin lens: a line with arrowheads pointing out (converging) or in (diverging) */
  S.thinLens = function (ctx, x, y, h, f, o) {
    o = o || {};
    const c = o.color || S.edge(), conv = f == null || f >= 0, a = 8;
    ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = o.width || 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x, y + h);
    for (const sgn of [-1, 1]) { const ty = y + sgn * h, d = conv ? -sgn : sgn; ctx.moveTo(x - a, ty + d * a); ctx.lineTo(x, ty); ctx.lineTo(x + a, ty + d * a); }
    ctx.stroke(); ctx.restore();
    if (o.label) text(ctx, o.label, x, y + h + 16, { color: col().muted });
    if (o.foci && Number.isFinite(f)) { for (const sx of [-1, 1]) { const fx = x + sx * Math.abs(o.foci); ctx.save(); ctx.fillStyle = col().muted; ctx.beginPath(); ctx.arc(fx, y, 2.5, 0, TAU); ctx.fill(); ctx.restore(); text(ctx, (sx < 0) === conv ? 'F' : 'F′', fx, y + 13, { size: 11 }); } }   // a diverging lens has its second focal point F′ in front
  };
  /* a curved mirror with its vertex at x. R in px (Cartesian: R < 0 is concave towards light coming from the left);
     o: { back: +1 (hatching on the right, light from the left; default) or −1, color, k } */
  S.mirror = function (ctx, x, y, h, o) {
    o = o || {};
    const pts = surfPts(x, y, h, o.R, o.k), back = o.back == null ? 1 : o.back, c = o.color || S.metal();
    ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = o.width || 2.4; ctx.lineCap = 'round'; path(ctx, pts); ctx.stroke();
    if (o.hatch !== false) { ctx.lineWidth = 1; ctx.globalAlpha = 0.7; ctx.beginPath(); for (let i = 0; i < pts.length; i += 2) { ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i][0] + back * 6, pts[i][1] + 5); } ctx.stroke(); }
    ctx.restore();
  };
  /* a flat mirror from (x1, y1) to (x2, y2); the hatching is on the left of that direction */
  S.flatMirror = function (ctx, x1, y1, x2, y2, o) {
    o = o || {};
    const l = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / l, uy = (y2 - y1) / l, nx = uy, ny = -ux, c = o.color || S.metal();
    ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = o.width || 2.4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    if (o.hatch !== false) { ctx.lineWidth = 1; ctx.globalAlpha = 0.7; ctx.beginPath(); for (let d = 4; d < l; d += 8) { const px = x1 + ux * d, py = y1 + uy * d; ctx.moveTo(px, py); ctx.lineTo(px + nx * 6 - ux * 4, py + ny * 6 - uy * 4); } ctx.stroke(); }
    ctx.restore();
  };
  /* a whole prescription (optics.js) under a map from S.map: glass elements with their true surfaces and edges,
     mirrors, and the aperture stop. o: { fill, color, stop: false to hide it, labels } */
  S.system = function (ctx, sys, m, o) {
    o = o || {};
    const Sf = sys.surfaces, zs = O.sys.vertices(sys);
    const surf = (i, sd) => { const s = Sf[i], pts = [], n = 16; for (let j = -n; j <= n; j++) { const r = sd * j / n; let z = O.sys.sag(s, r); if (!Number.isFinite(z)) z = 0; pts.push([m.X(zs[i] + z), m.Y(r)]); } return pts; };
    for (const e of O.sys.elements(sys)) {
      if (e.mirror) {
        const s = Sf[e.i0], sd = s.sd || 10, pts = surf(e.i0, sd);
        // the back of a mirror is on the side the light does not come from
        const before = e.i0 === 0 ? 1 : Math.sign((Sf[e.i0 - 1].t || 0)) || 1;
        ctx.save(); ctx.strokeStyle = o.mirror || S.metal(); ctx.lineWidth = 2.4; ctx.lineCap = 'round'; path(ctx, pts); ctx.stroke();
        ctx.lineWidth = 1; ctx.globalAlpha = 0.7; ctx.beginPath(); for (let j = 0; j < pts.length; j += 2) { ctx.moveTo(pts[j][0], pts[j][1]); ctx.lineTo(pts[j][0] + before * 6, pts[j][1] + 5); } ctx.stroke(); ctx.restore();
        continue;
      }
      // one glass element: front surface, then for cemented groups each inner surface, then the back
      const sd = e.sd || 10;
      for (let i = e.i0; i < e.i1; i++) {
        const sdA = Math.max(Sf[i].sd || sd, Sf[i + 1].sd || sd);
        const a = surf(i, sdA), b = surf(i + 1, sdA).reverse();
        ctx.save(); path(ctx, a.concat(b), true);
        ctx.fillStyle = o.fill || S.glass(i % 2 ? 0.3 : 0.2); ctx.fill();
        ctx.strokeStyle = o.color || S.edge(); ctx.lineWidth = 1.2; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
      }
    }
    if (o.stop !== false) {
      const si = O.sys.stopIndex(sys), s = Sf[si];
      if (s && s.stop && s.sd != null) {
        const isBare = !s.mirror && (s.n == null || O.index(s.n, 587.56) < 1.01) && (si === 0 || Sf[si - 1].n == null || O.index(Sf[si - 1].n, 587.56) < 1.01);
        const sy = m.sy || m.s;
        if (isBare || o.stop === true) S.stop(ctx, m.X(zs[si]), m.y0, sy * s.sd * 1.9, sy * s.sd);
        else {            // a stop on the face of a lens: two short bars outside its opening
          const zr = O.sys.sag(s, s.sd), xr = m.X(zs[si] + (Number.isFinite(zr) ? zr : 0)), g = sy * s.sd;
          ctx.save(); ctx.strokeStyle = col().text; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xr, m.y0 - g - 9); ctx.lineTo(xr, m.y0 - g); ctx.moveTo(xr, m.y0 + g); ctx.lineTo(xr, m.y0 + g + 9); ctx.stroke(); ctx.restore();
        }
      }
    }
  };
  /* the rays of O.sys.fan2d(...) under a map. o: { nm | color, width, alpha, arrows, lost: colour for rays that are cut off } */
  S.rays = function (ctx, fan, m, o) {
    o = o || {};
    for (const r of fan) {
      const pts = r.pts.map(p => [m.X(p[0]), m.Y(p[1])]);
      S.ray(ctx, pts, Object.assign({ arrows: false, width: 1.2 }, o, r.ok ? {} : { color: o.lost || col().faint, nm: null, alpha: 0.6 }));
    }
  };
  /* an aperture stop: two opaque bars leaving a gap of half-height `gap` */
  S.stop = function (ctx, x, y, h, gap, o) {
    o = o || {};
    ctx.save(); ctx.strokeStyle = o.color || col().text; ctx.lineWidth = o.width || 3; ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x, y - gap); ctx.moveTo(x, y + gap); ctx.lineTo(x, y + h); ctx.stroke();
    ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x - 4, y - gap); ctx.lineTo(x + 4, y - gap); ctx.moveTo(x - 4, y + gap); ctx.lineTo(x + 4, y + gap); ctx.stroke(); ctx.restore();
    if (o.label) text(ctx, o.label, x, y - h - 10, { color: col().muted });
  };
  S.screen = function (ctx, x, y, h, o) {
    o = o || {};
    ctx.save(); ctx.fillStyle = o.color || col().muted; ctx.fillRect(x, y - h, o.w || 4, 2 * h); ctx.restore();
    if (o.label) text(ctx, o.label, x + 2, y - h - 10, { color: col().muted });
  };
  /* an image sensor seen edge-on: a row of pixels on a package */
  S.sensor = function (ctx, x, y, h, o) {
    o = o || {};
    const c = col(), n = o.pixels || 12;
    ctx.save(); ctx.fillStyle = c.dark ? '#2a3050' : '#c9cfe2'; ctx.fillRect(x + 3, y - h - 4, 9, 2 * h + 8);
    ctx.fillStyle = o.color || c.ok; for (let i = 0; i < n; i++) ctx.fillRect(x, y - h + 2 * h * i / n + 0.6, 3, 2 * h / n - 1.2);
    ctx.restore();
    if (o.label) text(ctx, o.label, x + 6, y - h - 14, { color: c.muted });
  };
  /* the object or image arrow standing on the axis: h > 0 upright (drawn upwards), h < 0 inverted */
  S.object = function (ctx, x, y, h, o) {
    o = o || {};
    const c = o.color || col().accent;
    ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = o.width || 2.6; ctx.lineCap = 'round';
    if (o.dash) ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h); ctx.stroke(); ctx.restore();
    if (Math.abs(h) > 4) head(ctx, x, y - h, h > 0 ? -PI / 2 : PI / 2, Math.min(10, Math.abs(h)), c);
    if (o.label) text(ctx, o.label, x, y + (h > 0 ? 13 : -13), { color: c });
  };
  /* a schematic eye of radius r looking along dir (+1: to the right, −1: to the left; default −1, facing the light) */
  S.eye = function (ctx, x, y, r, o) {
    o = o || {};
    const d = o.dir == null ? -1 : o.dir, c = col();
    ctx.save();
    ctx.fillStyle = c.dark ? 'rgba(235,238,250,0.14)' : 'rgba(255,255,255,0.9)'; ctx.strokeStyle = o.color || c.text; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
    // the cornea: a steeper bulge at the front
    const cx = x + d * r * 0.62; ctx.beginPath(); ctx.arc(cx, y, r * 0.52, d > 0 ? -1.05 : PI - 1.05, d > 0 ? 1.05 : PI + 1.05); ctx.stroke();
    // iris and the lens behind it
    ctx.lineWidth = 2.2; ctx.strokeStyle = o.iris || c.accent; const ix = x + d * r * 0.78, p = (o.pupil == null ? 0.22 : o.pupil) * r;
    ctx.beginPath(); ctx.moveTo(ix, y - r * 0.52); ctx.lineTo(ix, y - p); ctx.moveTo(ix, y + p); ctx.lineTo(ix, y + r * 0.52); ctx.stroke();
    ctx.lineWidth = 1.2; ctx.strokeStyle = o.color || c.text; ctx.fillStyle = S.glass(0.35);
    ctx.beginPath(); ctx.ellipse(x + d * r * 0.6, y, r * (o.lens == null ? 0.13 : o.lens), r * 0.36, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.restore();
    return { cornea: x + d * r * 1.12, retina: x - d * r, nodal: x + d * r * 0.4 };
  };
  /* a light source. kind: 'point' | 'bulb' | 'led' | 'laser' | 'sun' | 'candle'; o: { color, size, dir (rad, for a laser) } */
  S.source = function (ctx, x, y, o) {
    o = o || {};
    const kind = o.kind || 'point', c = o.color || col().warn, s = o.size || 12, th = col();
    ctx.save(); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
    if (kind === 'point') { ctx.beginPath(); ctx.arc(x, y, Math.max(2, s / 4), 0, TAU); ctx.fill(); }
    else if (kind === 'sun') { ctx.beginPath(); ctx.arc(x, y, s * 0.55, 0, TAU); ctx.fill(); ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * PI / 4; ctx.moveTo(x + Math.cos(a) * s * 0.8, y + Math.sin(a) * s * 0.8); ctx.lineTo(x + Math.cos(a) * s * 1.2, y + Math.sin(a) * s * 1.2); } ctx.stroke(); }
    else if (kind === 'bulb') { ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(x, y - s * 0.2, s * 0.7, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; ctx.fillStyle = S.metal(); ctx.fillRect(x - s * 0.32, y + s * 0.42, s * 0.64, s * 0.5); }
    else if (kind === 'led') { ctx.beginPath(); ctx.arc(x, y - s * 0.15, s * 0.5, PI, 0); ctx.lineTo(x + s * 0.5, y + s * 0.4); ctx.lineTo(x - s * 0.5, y + s * 0.4); ctx.closePath(); ctx.fill(); ctx.strokeStyle = S.metal(); ctx.beginPath(); ctx.moveTo(x - s * 0.22, y + s * 0.4); ctx.lineTo(x - s * 0.22, y + s); ctx.moveTo(x + s * 0.22, y + s * 0.4); ctx.lineTo(x + s * 0.22, y + s * 0.85); ctx.stroke(); }
    else if (kind === 'candle') { ctx.beginPath(); ctx.ellipse(x, y - s * 0.5, s * 0.28, s * 0.6, 0, 0, TAU); ctx.fill(); ctx.fillStyle = th.muted; ctx.fillRect(x - s * 0.25, y + s * 0.1, s * 0.5, s); }
    else if (kind === 'laser') {
      const a = o.dir || 0, w = s * 2.6, hh = s * 0.9;
      ctx.translate(x, y); ctx.rotate(a);
      ctx.fillStyle = th.dark ? '#39405f' : '#aab2cc'; ctx.strokeStyle = th.text; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.rect(-w, -hh / 2, w, hh); ctx.fill(); ctx.stroke();
      ctx.fillStyle = c; ctx.fillRect(-3, -hh * 0.18, 3, hh * 0.36);
    }
    ctx.restore();
    if (o.label) text(ctx, o.label, x, y + s + 12, { color: th.muted });
  };
  /* an isosceles prism with its apex up, centred at (x, y): size = side length (px), apex angle (rad).
     -> the corners [apex, right, left] as [x, y] */
  S.prism = function (ctx, x, y, size, apex, o) {
    o = o || {};
    const hh = size * Math.cos(apex / 2), bw = size * Math.sin(apex / 2);
    const P = [[x, y - hh * 2 / 3], [x + bw, y + hh / 3], [x - bw, y + hh / 3]];
    S.poly(ctx, P, o);
    return P;
  };
  S.block = function (ctx, x, y, w, h, o) { S.poly(ctx, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], o); };
  /* any piece of glass given by its corners */
  S.poly = function (ctx, pts, o) {
    o = o || {};
    ctx.save(); path(ctx, pts, true); ctx.fillStyle = o.fill || S.glass(); ctx.fill(); ctx.strokeStyle = o.color || S.edge(); ctx.lineWidth = o.width || 1.3; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
    if (o.label) { const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length; text(ctx, o.label, cx, cy, { color: col().muted }); }
  };
  /* a cube beam splitter centred at (x, y); the coated diagonal runs from bottom-left to top-right unless o.flip */
  S.splitter = function (ctx, x, y, size, o) {
    o = o || {};
    const h = size / 2;
    S.block(ctx, x - h, y - h, size, size, o);
    ctx.save(); ctx.strokeStyle = o.coat || col().accent; ctx.lineWidth = 1.6; ctx.beginPath();
    if (o.flip) { ctx.moveTo(x - h, y - h); ctx.lineTo(x + h, y + h); } else { ctx.moveTo(x - h, y + h); ctx.lineTo(x + h, y - h); }
    ctx.stroke(); ctx.restore();
  };
  /* a thin plate (window, plate beam splitter, filter) centred at (x, y), of length len, tilted by angle from the vertical */
  S.plate = function (ctx, x, y, len, angle, o) {
    o = o || {};
    const a = (angle || 0) + PI / 2, ux = Math.cos(a), uy = Math.sin(a), t = (o.t || 5) / 2, nx = -uy, ny = ux, l = len / 2;
    S.poly(ctx, [[x - ux * l - nx * t, y - uy * l - ny * t], [x + ux * l - nx * t, y + uy * l - ny * t], [x + ux * l + nx * t, y + uy * l + ny * t], [x - ux * l + nx * t, y - uy * l + ny * t]], o);
  };
  /* a polariser (or wave plate) seen obliquely: an ellipse with its axis drawn at `angle` from the vertical */
  S.polarizer = function (ctx, x, y, h, angle, o) {
    o = o || {};
    const c = col(), w = h * (o.squash == null ? 0.32 : o.squash);
    ctx.save(); ctx.fillStyle = o.fill || (c.dark ? 'rgba(160,170,200,0.2)' : 'rgba(90,100,130,0.16)'); ctx.strokeStyle = o.color || c.text; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.ellipse(x, y, w, h, 0, 0, TAU); ctx.fill(); ctx.stroke();
    // the axis: a diameter at `angle` from the vertical, foreshortened in x
    const ax = Math.sin(angle || 0) * w, ay = -Math.cos(angle || 0) * h;
    ctx.strokeStyle = o.axis || c.accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - ax * 0.9, y - ay * 0.9); ctx.lineTo(x + ax * 0.9, y + ay * 0.9); ctx.stroke(); ctx.restore();
    if (o.label) text(ctx, o.label, x, y + h + 13, { color: c.muted });
  };
  /* a grating seen edge-on: a bar with ticks */
  S.grating = function (ctx, x, y, h, o) {
    o = o || {};
    const c = o.color || col().text, n = o.lines || 14;
    ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x, y + h); ctx.stroke();
    ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i <= n; i++) { const yy = y - h + 2 * h * i / n; ctx.moveTo(x - 4, yy); ctx.lineTo(x + 4, yy); } ctx.stroke(); ctx.restore();
    if (o.label) text(ctx, o.label, x, y - h - 10, { color: col().muted });
  };
  /* an opaque barrier at x from y − h to y + h with openings: gaps = [[yFrom, yTo] …] in canvas y */
  S.slits = function (ctx, x, y, h, gaps, o) {
    o = o || {};
    const g = (gaps || []).map(a => [Math.min(a[0], a[1]), Math.max(a[0], a[1])]).sort((a, b) => a[0] - b[0]);
    ctx.save(); ctx.fillStyle = o.color || col().text; let top = y - h; const w = o.w || 4;
    for (const [a, b] of g) { if (a > top) ctx.fillRect(x - w / 2, top, w, a - top); top = Math.max(top, b); }
    if (y + h > top) ctx.fillRect(x - w / 2, top, w, y + h - top);
    ctx.restore();
  };
  /* an optical fibre along a path: cladding, then core */
  S.fibre = function (ctx, pts, o) {
    o = o || {};
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'butt';
    ctx.strokeStyle = o.clad || S.glass(0.5); ctx.lineWidth = o.cladWidth || 14; path(ctx, pts); ctx.stroke();
    ctx.strokeStyle = o.core || S.glass(0.95); ctx.lineWidth = o.coreWidth || 5; path(ctx, pts); ctx.stroke(); ctx.restore();
  };
  /* a beam as a filled envelope between x1 and x2 about the line y: half-width w(x) in px. o: { color | nm, alpha } */
  S.beam = function (ctx, x1, x2, y, w, o) {
    o = o || {};
    const n = Math.max(8, Math.min(200, Math.round(Math.abs(x2 - x1) / 4))), up = [], dn = [];
    for (let i = 0; i <= n; i++) { const x = x1 + (x2 - x1) * i / n, hw = Math.max(0.5, typeof w === 'function' ? w(x) : w); up.push([x, y - hw]); dn.push([x, y + hw]); }
    ctx.save(); path(ctx, up.concat(dn.reverse()), true);
    ctx.fillStyle = o.color || (o.nm ? S.nm(o.nm, o.alpha == null ? 0.35 : o.alpha) : 'rgba(255,60,60,' + (o.alpha == null ? 0.35 : o.alpha) + ')'); ctx.fill();
    if (o.edge !== false) { ctx.strokeStyle = o.edgeColor || (o.nm ? S.nm(o.nm) : 'rgb(255,60,60)'); ctx.lineWidth = 1; path(ctx, up); ctx.stroke(); path(ctx, dn); ctx.stroke(); }
    ctx.restore();
  };
  /* a sine wave drawn along the line from (x1, y1) to (x2, y2). o: { wavelength (px), amp (px), phase, color | nm, width, envelope: fn(0…1) } */
  S.wave = function (ctx, x1, y1, x2, y2, o) {
    o = o || {};
    const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, lam = o.wavelength || 30, amp = o.amp == null ? 10 : o.amp;
    const n = Math.max(12, Math.round(L / 2));
    ctx.save(); ctx.strokeStyle = o.color || (o.nm ? S.nm(o.nm) : col().accent); ctx.lineWidth = o.width || 1.6; ctx.beginPath();
    for (let i = 0; i <= n; i++) { const d = L * i / n, a = amp * (o.envelope ? o.envelope(i / n) : 1) * Math.sin(TAU * d / lam - (o.phase || 0)); const x = x1 + ux * d - uy * a, y = y1 + uy * d + ux * a; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke(); ctx.restore();
  };
  /* wavefronts: circular arcs about (cx, cy) with radii r0, r0 + dr, … between angles a0 and a1 (canvas radians);
     for plane waves pass dr and o.plane = { x, y, dir (rad), width } */
  S.wavefronts = function (ctx, cx, cy, r0, dr, n, a0, a1, o) {
    o = o || {};
    ctx.save(); ctx.strokeStyle = o.color || (o.nm ? S.nm(o.nm, o.alpha == null ? 0.7 : o.alpha) : col().accent); ctx.lineWidth = o.width || 1.2; if (o.alpha != null && !o.nm) ctx.globalAlpha = o.alpha;
    for (let i = 0; i < n; i++) {
      const r = r0 + i * dr; if (r <= 0) continue;
      ctx.beginPath();
      if (o.plane) { const p = o.plane, ux = Math.cos(p.dir), uy = Math.sin(p.dir), w = p.width / 2; ctx.moveTo(p.x + ux * r - uy * w, p.y + uy * r + ux * w); ctx.lineTo(p.x + ux * r + uy * w, p.y + uy * r - ux * w); }
      else ctx.arc(cx, cy, r, a0 == null ? 0 : a0, a1 == null ? TAU : a1);
      ctx.stroke();
    }
    ctx.restore();
  };
  /* the visible spectrum painted as a bar from nm0 to nm1 */
  S.spectrum = function (ctx, x, y, w, h, nm0, nm1, o) {
    o = o || {}; nm0 = nm0 || 380; nm1 = nm1 || 780;
    const n = Math.max(2, Math.round(w / 2));
    for (let i = 0; i < n; i++) { const nm = nm0 + (nm1 - nm0) * (i + 0.5) / n; ctx.fillStyle = o.weight ? S.nm(nm, O.clamp(o.weight(nm), 0, 1)) : S.nm(nm); ctx.fillRect(x + w * i / n, y, w / n + 0.6, h); }
    if (o.ticks) { for (let nm = Math.ceil(nm0 / 50) * 50; nm <= nm1; nm += o.ticks === true ? 50 : o.ticks) { const tx = x + w * (nm - nm0) / (nm1 - nm0); text(ctx, String(nm), tx, y + h + 10, { size: 10.5 }); } }
  };
  /* an intensity pattern as vertical stripes: f(u) with u from 0 to 1 gives the brightness 0…1; rgb the full colour.
     o: { rgb: [r, g, b] | nm, gamma (default 0.6: lifts faint fringes), vertical: true for a pattern running down } */
  S.fringes = function (ctx, x, y, w, h, f, o) {
    o = o || {};
    const rgb = o.rgb || (o.nm ? O.colour.wavelength(o.nm) : [255, 255, 255]), g = o.gamma == null ? 0.6 : o.gamma;
    const len = o.vertical ? h : w, n = Math.max(2, Math.round(len / (o.step || 1.5)));
    ctx.save(); ctx.fillStyle = '#000'; ctx.fillRect(x, y, w, h);
    for (let i = 0; i < n; i++) {
      const v = Math.pow(O.clamp(f((i + 0.5) / n), 0, 1), g);
      ctx.fillStyle = 'rgb(' + Math.round(rgb[0] * v) + ',' + Math.round(rgb[1] * v) + ',' + Math.round(rgb[2] * v) + ')';
      if (o.vertical) ctx.fillRect(x, y + h * i / n, w, h / n + 0.6); else ctx.fillRect(x + w * i / n, y, w / n + 0.6, h);
    }
    ctx.restore();
  };
  /* a picture made of cells: f(u, v) with u, v from 0 to 1 gives a brightness 0…1 or an [r, g, b]; nx × ny cells */
  S.cells = function (ctx, x, y, w, h, nx, ny, f, o) {
    o = o || {};
    const rgb = o.rgb || (o.nm ? O.colour.wavelength(o.nm) : [255, 255, 255]), g = o.gamma == null ? 1 : o.gamma;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const v = f((i + 0.5) / nx, (j + 0.5) / ny);
      if (Array.isArray(v)) ctx.fillStyle = 'rgb(' + Math.round(O.clamp(v[0], 0, 255)) + ',' + Math.round(O.clamp(v[1], 0, 255)) + ',' + Math.round(O.clamp(v[2], 0, 255)) + ')';
      else { const b = Math.pow(O.clamp(v, 0, 1), g); ctx.fillStyle = 'rgb(' + Math.round(rgb[0] * b) + ',' + Math.round(rgb[1] * b) + ',' + Math.round(rgb[2] * b) + ')'; }
      ctx.fillRect(x + w * i / nx, y + h * j / ny, w / nx + 0.6, h / ny + 0.6);
    }
  };
  /* a smooth picture of nx × ny pixels stretched over the rectangle: f(u, v) with u, v from 0 to 1 gives a
     brightness 0…1 (tinted by o.rgb or o.nm, with o.gamma) or an [r, g, b]. For round fringes, an Airy pattern,
     speckle, a field of two sources: finer and faster than S.cells. o.smooth: false keeps the pixels square. */
  const IMG = typeof WeakMap !== 'undefined' ? new WeakMap() : null;      // pictures kept per canvas, for o.key
  S.image = function (ctx, x, y, w, h, nx, ny, f, o) {
    o = o || {};
    nx = Math.max(1, Math.round(nx)); ny = Math.max(1, Math.round(ny));
    // o.key: a string made of everything the picture depends on. While it stays the same the picture is not
    // computed again (a loop that redraws every frame would otherwise recompute thousands of pixels each time).
    let slot = null;
    if (o.key != null && IMG) {
      let m = IMG.get(ctx); if (!m) { m = new Map(); IMG.set(ctx, m); }
      const id = (o.id || '') + '|' + nx + 'x' + ny;
      slot = m.get(id); if (!slot) { slot = {}; m.set(id, slot); }
      if (slot.key === o.key && slot.cv) { ctx.save(); ctx.imageSmoothingEnabled = o.smooth !== false; ctx.drawImage(slot.cv, x, y, w, h); ctx.restore(); return; }
    }
    const doc = typeof document !== 'undefined' ? document : null;
    const cv = doc && doc.createElement ? doc.createElement('canvas') : null;
    let g = null;
    if (cv && cv.getContext) { cv.width = nx; cv.height = ny; g = cv.getContext('2d'); }
    if (!g || !g.createImageData || !ctx.drawImage) return S.cells(ctx, x, y, w, h, nx, ny, f, o);
    if (slot) { slot.key = o.key; slot.cv = cv; }
    const im = g.createImageData(nx, ny), d = im.data;
    const rgb = o.rgb || (o.nm ? O.colour.wavelength(o.nm) : [255, 255, 255]), gam = o.gamma == null ? 1 : o.gamma;
    for (let j = 0, k = 0; j < ny; j++) for (let i = 0; i < nx; i++, k += 4) {
      const v = f((i + 0.5) / nx, (j + 0.5) / ny);
      if (Array.isArray(v)) { d[k] = v[0]; d[k + 1] = v[1]; d[k + 2] = v[2]; }
      else { const b = Math.pow(O.clamp(v || 0, 0, 1), gam); d[k] = rgb[0] * b; d[k + 1] = rgb[1] * b; d[k + 2] = rgb[2] * b; }
      d[k + 3] = 255;
    }
    g.putImageData(im, 0, 0);
    ctx.save(); ctx.imageSmoothingEnabled = o.smooth !== false; ctx.drawImage(cv, x, y, w, h); ctx.restore();
  };
  /* a spot diagram: the points of O.sys.spot(...) about their centroid, in a square box of half-size `half` (px),
     `scale` px per unit; a circle of radius `airy` (in the prescription's units) for comparison */
  S.spot = function (ctx, spot, cx, cy, half, scale, o) {
    o = o || {};
    const c = col();
    ctx.save(); ctx.strokeStyle = c.grid; ctx.lineWidth = 1; ctx.strokeRect(cx - half, cy - half, 2 * half, 2 * half);
    ctx.beginPath(); ctx.moveTo(cx - half, cy); ctx.lineTo(cx + half, cy); ctx.moveTo(cx, cy - half); ctx.lineTo(cx, cy + half); ctx.stroke();
    if (o.airy) { ctx.strokeStyle = c.muted; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(cx, cy, Math.max(0.5, o.airy * scale), 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
    ctx.fillStyle = o.color || (o.nm ? S.nm(o.nm) : c.accent);
    for (const p of spot.pts) { const px = cx + (p[0] - spot.cx) * scale, py = cy - (p[1] - spot.cy) * scale; if (Math.abs(px - cx) <= half && Math.abs(py - cy) <= half) ctx.fillRect(px - 1, py - 1, 2, 2); }
    ctx.restore();
  };
})(typeof window !== 'undefined' ? window : globalThis);
